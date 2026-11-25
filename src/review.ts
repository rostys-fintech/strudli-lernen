/** Offline spaced repetition and daily learning progress. No server or account is needed. */
export type ReviewEntry={id:string;stage:number;due:string;last:string;successful:number;errors:number};
export type ReviewStore=Record<string,ReviewEntry>;
export type DailyEntry={correct:number;wrong:number;mastered:number};
export type DailyStore=Record<string,DailyEntry>;
const intervals=[0,1,3,7,14,30,60];
export function todayLocal(day=new Date()){return [day.getFullYear(),String(day.getMonth()+1).padStart(2,"0"),String(day.getDate()).padStart(2,"0")].join("-")}
export function futureDay(today:string,after:number){const [y,m,d]=today.split("-").map(Number);return todayLocal(new Date(y,m-1,d+after,12))}
export function completedReview(prev:ReviewEntry|undefined,id:string,day:string,hadErrors:boolean):ReviewEntry{
 const stage=hadErrors?1:Math.min(intervals.length-1,(prev?.stage||0)+1);
 return {id,stage,due:futureDay(day,intervals[stage]),last:day,successful:(prev?.successful||0)+1,errors:(prev?.errors||0)+(hadErrors?1:0)}
}
export function dueReviewIds(store:ReviewStore,day:string){return Object.values(store).filter(e=>e.due<=day).sort((a,b)=>a.due.localeCompare(b.due)).map(e=>e.id)}
export function logAttempt(store:DailyStore,day:string,correct:boolean,mastered=false):DailyStore{const old=store[day]||{correct:0,wrong:0,mastered:0};return{...store,[day]:{correct:old.correct+(correct?1:0),wrong:old.wrong+(correct?0:1),mastered:old.mastered+(mastered?1:0)}}}
export function learningStreak(store:DailyStore,today:string){const [y,m,d]=today.split("-").map(Number);const date=new Date(y,m-1,d,12);let streak=0;if(!store[today]||(store[today].correct+store[today].wrong===0))date.setDate(date.getDate()-1);for(let i=0;i<366;i++){const item=store[todayLocal(date)];if(!item||(item.correct+item.wrong===0))break;streak++;date.setDate(date.getDate()-1)}return streak}
export function loadJSON<T>(key:string,fallback:T):T{try{const raw=localStorage.getItem(key);if(raw===null)return fallback;const parsed=JSON.parse(raw);return parsed&&typeof parsed==="object"?parsed as T:fallback}catch{return fallback}}
