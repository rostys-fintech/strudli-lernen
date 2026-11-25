import {useState} from "react";
/** Warm the next word-specific photo while the correct-answer audio plays. */
const decoded=new Set<string>();
const pending=new Map<string,Promise<void>>();
export function preloadGamePhoto(src?:string):Promise<void>{
 if(!src||decoded.has(src))return Promise.resolve();
 const existing=pending.get(src);if(existing)return existing;
 const request=new Promise<void>(resolve=>{
  const image=new Image();
  image.onload=()=>{void (image.decode?image.decode().catch(()=>{}):Promise.resolve()).then(()=>{decoded.add(src);resolve()})};
  image.onerror=()=>resolve();
  image.src=src;
 });
 pending.set(src,request);
 void request.then(()=>pending.delete(src));
 return request;
}
/** Key by word.id so a late load/error from the previous card cannot affect the next word. */
export default function GamePicture({src,emoji,alt,wordId}:{src?:string;emoji:string;alt:string;wordId?:string}){
 const[ready,setReady]=useState(()=>Boolean(src&&decoded.has(src)));
 const[broken,setBroken]=useState(false);
 return <div className="gamePicture">
  {(!ready||broken)&&<div className={"fallback"+(!src||broken?" pendingVisual":"")} aria-hidden="true"><span className="fallbackIcon">{emoji==="✨"?"▧":emoji}</span></div>}
  {src&&!broken&&<img src={src} alt={alt} data-word-id={wordId} loading="eager" fetchPriority="high" decoding="async" className={(ready?"isReady ":"")+((src?.startsWith("/photos/custom/")||src?.startsWith("/photos/learning/")||src?.startsWith("/photos/situations/")||src?.startsWith("/photos/grammar/"))?"isVisualCard":"")} onLoad={()=>{decoded.add(src);setReady(true)}} onError={()=>{setBroken(true);setReady(false)}}/>}
 </div>;
}
