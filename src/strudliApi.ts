/** Client side of the optional Strudli account and the "Strudli explains" AI tutor. */
import {exportProgress,validateProgressArchive,applyProgressArchive,type ProgressArchive} from "./progress";

export type AccountState={enabled:false}|{enabled:true;user:{name:string;created?:string}|null};
export type Explanation={translation:string;words:{de:string;meaning:string}[];grammar:string;example:{de:string;tr:string}|null};

async function request<T>(url:string,init?:RequestInit,timeoutMs=15000):Promise<{status:number;data:T}>{
 const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),timeoutMs);
 try{
  const res=await fetch(url,{credentials:"same-origin",...init,signal:ctrl.signal});
  const type=res.headers.get("content-type")||"";
  // Static hosting without functions (vite preview, offline) answers with HTML: treat as "not available".
  if(!type.includes("application/json"))return {status:res.status||503,data:{enabled:false,ok:false,fallback:true,error:"unavailable"} as T};
  return {status:res.status,data:await res.json() as T};
 }catch{return {status:0,data:{enabled:false,ok:false,fallback:true,error:"offline"} as T}}
 finally{clearTimeout(timer)}
}
const post=<T,>(url:string,body:unknown)=>request<T>(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});

export async function accountStatus():Promise<AccountState>{
 const {data}=await request<AccountState>("/api/account",{method:"GET"},8000);
 return data&&data.enabled===true?data:{enabled:false};
}
type Reply={ok?:boolean;error?:string;user?:{name:string};recoveryCode?:string;savedAt?:string;archive?:unknown;deleted?:boolean};
export const accountAction=(action:string,fields:Record<string,unknown>={})=>post<Reply>("/api/account",{action,...fields});
export async function saveProgressToAccount(){const archive:ProgressArchive=exportProgress();return accountAction("save",{archive});}
export async function loadProgressFromAccount():Promise<{ok:boolean;empty?:boolean;savedAt?:string;error?:string}>{
 const {data}=await accountAction("load");
 if(!data.ok)return {ok:false,error:data.error};
 if(!data.archive)return {ok:true,empty:true};
 try{applyProgressArchive(validateProgressArchive(data.archive));return {ok:true,savedAt:data.savedAt}}catch{return {ok:false,error:"bad_progress"}}
}
export async function explainGerman(text:string,lang:"uk"|"en"):Promise<{ok:true;answer:Explanation}|{ok:false;error:string}>{
 const {data}=await post<{ok?:boolean;answer?:Explanation;error?:string}>("/api/strudli-ai",{text,lang});
 return data.ok&&data.answer?{ok:true,answer:data.answer}:{ok:false,error:data.error||"unavailable"};
}

const ERRORS:Record<string,[string,string]>={
 bad_username:["Ім’я: 3–32 символи, латинські літери, цифри, крапка, дефіс або _.","Username: 3–32 characters, Latin letters, digits, dot, dash or _."],
 password_too_short:["Пароль має бути щонайменше 10 символів.","Password must be at least 10 characters."],
 password_too_long:["Пароль занадто довгий (до 128 символів).","Password is too long (max 128)."],
 password_too_common:["Цей пароль занадто простий — придумай фразу з кількох слів.","This password is too common — try a phrase of several words."],
 password_contains_name:["Пароль не повинен містити ім’я користувача.","Password must not contain your username."],
 username_taken:["Таке ім’я вже зайняте.","This username is taken."],
 wrong_credentials:["Неправильне ім’я, пароль або код.","Wrong username, password or code."],
 too_many_attempts:["Забагато спроб. Зачекай 15 хвилин.","Too many attempts. Please wait 15 minutes."],
 not_signed_in:["Сесія завершилась — увійди ще раз.","Session ended — please sign in again."],
 progress_too_large:["Прогрес завеликий для збереження.","Progress is too large to save."],
 bad_progress:["Дані прогресу пошкоджені.","Progress data is damaged."],
 cross_site_blocked:["Запит заблоковано з міркувань безпеки.","Request blocked for security reasons."],
};
export function accountError(code:string|undefined,en:boolean){const pair=code?ERRORS[code]:undefined;return pair?pair[en?1:0]:(en?"Service is not available right now. Your progress stays on this device.":"Сервіс зараз недоступний. Прогрес залишається на цьому пристрої.")}
