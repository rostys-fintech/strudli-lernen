import {useEffect,useState,type FormEvent} from "react";
import {CloudDownload,CloudUpload,Copy,Eye,EyeOff,KeyRound,LogOut,ShieldCheck,Trash2,UserRound} from "lucide-react";
import type {UILang} from "./i18n";
import {accountAction,accountError,accountStatus,loadProgressFromAccount,saveProgressToAccount,type AccountState} from "./strudliApi";
import "./strudli-ai-account.css";

type Mode="login"|"register"|"recover";
/** Optional account (no e-mail): save progress to the cloud only when the learner asks for it. */
export default function StrudliAccount({language}:{language:UILang}){
 const en=language==="en";
 const [state,setState]=useState<AccountState|null>(null);
 const [mode,setMode]=useState<Mode>("login");
 const [name,setName]=useState("");const [password,setPassword]=useState("");const [code,setCode]=useState("");
 const [show,setShow]=useState(false);const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState<{kind:"ok"|"error";text:string}|null>(null);
 const [recovery,setRecovery]=useState<string|null>(null);
 const [danger,setDanger]=useState<null|"password"|"delete">(null);const [confirmPw,setConfirmPw]=useState("");const [newPw,setNewPw]=useState("");
 useEffect(()=>{let alive=true;void accountStatus().then(s=>{if(alive)setState(s)});return ()=>{alive=false}},[]);
 if(!state||!state.enabled)return null; // Feature appears only where the server side is configured.
 const user=state.user;
 const say=(kind:"ok"|"error",text:string)=>setNotice({kind,text});
 async function submit(e:FormEvent){
  e.preventDefault();if(busy)return;setBusy(true);setNotice(null);
  const fields=mode==="recover"?{name,recoveryCode:code,newPassword:password}:{name,password};
  const {data}=await accountAction(mode,fields);
  setBusy(false);setPassword("");
  if(!data.ok||!data.user)return say("error",accountError(data.error,en));
  setState({enabled:true,user:data.user});setCode("");
  if(data.recoveryCode)setRecovery(data.recoveryCode);
  say("ok",mode==="register"?(en?"Account created. Save your recovery code!":"Акаунт створено. Збережи код відновлення!"):(en?"Signed in.":"Ти увійшов в акаунт."));
 }
 async function save(){setBusy(true);const {data}=await saveProgressToAccount();setBusy(false);
  if(data.ok)say("ok",en?"Progress saved to your account.":"Прогрес збережено в акаунті.");else{say("error",accountError(data.error,en));if(data.error==="not_signed_in")setState({enabled:true,user:null})}}
 async function load(){
  if(!window.confirm(en?"Replace the progress on this device with the progress from your account?":"Замінити прогрес на цьому пристрої прогресом з акаунта?"))return;
  setBusy(true);const r=await loadProgressFromAccount();setBusy(false);
  if(!r.ok)return say("error",accountError(r.error,en));
  if(r.empty)return say("error",en?"Nothing saved in the account yet.":"В акаунті ще немає збереженого прогресу.");
  say("ok",en?"Progress loaded. Reloading…":"Прогрес завантажено. Оновлюю сторінку…");setTimeout(()=>window.location.reload(),900);
 }
 async function logout(){setBusy(true);await accountAction("logout");setBusy(false);setState({enabled:true,user:null});setRecovery(null);say("ok",en?"Signed out.":"Ти вийшов з акаунта.")}
 async function sensitive(e:FormEvent){
  e.preventDefault();if(!danger)return;setBusy(true);
  const {data}=await accountAction(danger==="delete"?"delete":"change-password",danger==="delete"?{password:confirmPw}:{password:confirmPw,newPassword:newPw});
  setBusy(false);setConfirmPw("");setNewPw("");
  if(!data.ok)return say("error",accountError(data.error,en));
  if(danger==="delete"){setState({enabled:true,user:null});say("ok",en?"Account and cloud progress deleted. Progress on this device stays.":"Акаунт і хмарний прогрес видалено. Прогрес на цьому пристрої залишився.")}
  else say("ok",en?"Password changed. Other devices were signed out.":"Пароль змінено. Інші пристрої вийшли з акаунта.");
  setDanger(null);
 }
 return <section className="strudliAccount" aria-label={en?"Strudli account":"Акаунт Strudli"}>
  <header><ShieldCheck size={22}/><div><strong>{en?"Account (optional)":"Акаунт (за бажанням)"}</strong><small>{en?"Keep progress on several devices. No e-mail: only a username, a password and your progress.":"Щоб прогрес був на кількох пристроях. Без e-mail: лише ім’я користувача, пароль і прогрес."}</small></div></header>
  {notice&&<p className={"strudliAccountNotice "+notice.kind} role={notice.kind==="error"?"alert":"status"}>{notice.text}</p>}
  {recovery&&<div className="strudliRecovery" role="note"><strong>{en?"Recovery code — shown only once":"Код відновлення — показуємо лише один раз"}</strong><code>{recovery}</code><small>{en?"Write it down. Without e-mail this code is the only way to reset a forgotten password.":"Запиши його. Без e-mail це єдиний спосіб відновити забутий пароль."}</small><div><button type="button" onClick={()=>{void navigator.clipboard?.writeText(recovery).then(()=>say("ok",en?"Code copied.":"Код скопійовано."),()=>{})}}><Copy size={16}/>{en?"Copy":"Копіювати"}</button><button type="button" onClick={()=>setRecovery(null)}>{en?"I saved it":"Я зберіг код"}</button></div></div>}
  {user?<>
   <p className="strudliAccountUser"><UserRound size={18}/>{en?"Signed in as":"Ти в акаунті"} <b>{user.name}</b></p>
   <div className="strudliAccountActions">
    <button type="button" disabled={busy} onClick={()=>void save()}><CloudUpload size={19}/>{en?"Save progress to account":"Зберегти прогрес в акаунт"}</button>
    <button type="button" disabled={busy} onClick={()=>void load()}><CloudDownload size={19}/>{en?"Load progress from account":"Завантажити прогрес з акаунта"}</button>
   </div>
   <div className="strudliAccountSmall">
    <button type="button" onClick={()=>setDanger(danger==="password"?null:"password")}><KeyRound size={16}/>{en?"Change password":"Змінити пароль"}</button>
    <button type="button" disabled={busy} onClick={()=>void logout()}><LogOut size={16}/>{en?"Sign out":"Вийти"}</button>
    <button type="button" className="danger" onClick={()=>setDanger(danger==="delete"?null:"delete")}><Trash2 size={16}/>{en?"Delete account":"Видалити акаунт"}</button>
   </div>
   {danger&&<form className="strudliAccountForm" onSubmit={e=>void sensitive(e)}>
    <label>{en?"Current password":"Поточний пароль"}<input type="password" autoComplete="current-password" required maxLength={128} value={confirmPw} onChange={e=>setConfirmPw(e.target.value)}/></label>
    {danger==="password"&&<label>{en?"New password (10+ characters)":"Новий пароль (від 10 символів)"}<input type="password" autoComplete="new-password" required minLength={10} maxLength={128} value={newPw} onChange={e=>setNewPw(e.target.value)}/></label>}
    <button type="submit" disabled={busy} className={danger==="delete"?"danger":""}>{danger==="delete"?(en?"Delete account for good":"Видалити акаунт назавжди"):(en?"Save new password":"Зберегти новий пароль")}</button>
   </form>}
  </>:<>
   <div className="strudliAccountTabs" role="tablist">
    {(["login","register","recover"] as Mode[]).map(m=><button key={m} type="button" role="tab" aria-selected={mode===m} className={mode===m?"selected":""} onClick={()=>{setMode(m);setNotice(null)}}>{m==="login"?(en?"Sign in":"Увійти"):m==="register"?(en?"Create account":"Створити акаунт"):(en?"Forgot password":"Забув пароль")}</button>)}
   </div>
   <form className="strudliAccountForm" onSubmit={e=>void submit(e)}>
    <label>{en?"Username":"Ім’я користувача"}<input autoComplete="username" autoCapitalize="none" spellCheck={false} required minLength={3} maxLength={32} pattern="[A-Za-z0-9][A-Za-z0-9_.\-]{2,31}" value={name} onChange={e=>setName(e.target.value)}/></label>
    {mode==="recover"&&<label>{en?"Recovery code":"Код відновлення"}<input autoComplete="one-time-code" autoCapitalize="characters" spellCheck={false} required maxLength={24} value={code} onChange={e=>setCode(e.target.value)} placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"/></label>}
    <label>{mode==="login"?(en?"Password":"Пароль"):(en?"New password (10+ characters)":"Пароль (від 10 символів)")}
     <span className="strudliPassword"><input type={show?"text":"password"} autoComplete={mode==="login"?"current-password":"new-password"} required minLength={mode==="login"?1:10} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" aria-label={show?(en?"Hide password":"Сховати пароль"):(en?"Show password":"Показати пароль")} onClick={()=>setShow(v=>!v)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></span>
    </label>
    {mode!=="login"&&<small className="strudliAccountHint">{en?"Tip: a phrase of 3–4 words is strong and easy to remember.":"Порада: фраза з 3–4 слів — надійна й легко запам’ятовується."}</small>}
    <button type="submit" disabled={busy}>{busy?(en?"Please wait…":"Зачекай…"):mode==="login"?(en?"Sign in":"Увійти"):mode==="register"?(en?"Create account":"Створити акаунт"):(en?"Set new password":"Встановити новий пароль")}</button>
   </form>
  </>}
 </section>;
}
