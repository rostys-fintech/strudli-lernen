import {useEffect,useState} from "react";
import type {UILang} from "./i18n";

/** Three visually distinct fire stages. Uses the original Round.streaks progress without migration. */
type Props={level:number;preview?:boolean;wrong?:boolean;lostLevel?:number;signal?:number;variant?:"overlay"|"practice";language:UILang};
const MAX_FLAMES=3;
const fire=[
 {top:"#fff6ac",middle:"#ffba20",base:"#e96808",core:"#fffcd0"},
 {top:"#ffe994",middle:"#ff851c",base:"#e93c12",core:"#fff5a3"},
 {top:"#ffe983",middle:"#ff4916",base:"#d60e13",core:"#fff4ad"}
] as const;
const silhouette="M30 3C32 17 42 24 44 35C49 27 49 20 46 14C63 30 61 53 45 65C36 73 23 74 14 66C-3 53 1 36 18 19C18 30 21 36 24 38C27 28 25 18 30 3Z";
const innerFire="M29 35C31 43 40 46 38 55C37 64 28 69 21 62C15 56 20 47 29 35Z";
export default function FlameMeter({level,preview=false,wrong=false,lostLevel=0,signal=0,variant="overlay",language}:Props){
 const stored=Number.isFinite(level)?Math.max(0,Math.min(MAX_FLAMES,Math.trunc(level))):0;
 const shown=Math.min(MAX_FLAMES,stored+(preview?1:0));
 const label=language==="uk"?shown+" із 3 вогників":shown+" of 3 flames";
 const [ghost,setGhost]=useState(-1);
 useEffect(()=>{
  if(!wrong||lostLevel<=0){setGhost(-1);return}
  // When a mistake removes a flame, briefly show that exact flame fading away.
  setGhost(Math.min(MAX_FLAMES,lostLevel)-1);
  const timer=window.setTimeout(()=>setGhost(-1),700);
  return()=>window.clearTimeout(timer);
 },[signal,wrong,lostLevel]);
 return <div key={wrong?"mistake-"+signal:"normal"} className={"flameMeter flameMeter--"+variant+(wrong?" flameMeter--wrong":"")} role="meter" aria-valuemin={0} aria-valuemax={MAX_FLAMES} aria-valuenow={shown} aria-label={label}>
  {[0,1,2].map(i=>{
   const lit=i<shown;
   const fading=wrong&&ghost===i&&!lit;
   const colors=fire[i];
   const gradient="strudli-fire-"+variant+"-"+i;
   return <span key={i} className={"flameMeterSlot flameMeterSlot--tier"+(i+1)+(lit?" flameMeterSlot--lit":"")+(fading?" flameMeterSlot--ghost":"")+(preview&&i===stored?" flameMeterSlot--ignite":"")}>
    <svg className="flameArt" width="56" height="65" viewBox="0 0 60 74" aria-hidden="true" focusable="false">
     <defs><linearGradient id={gradient} x1="0" y1="0" x2="0.25" y2="1"><stop offset="0%" stopColor={colors.top}/><stop offset="46%" stopColor={colors.middle}/><stop offset="100%" stopColor={colors.base}/></linearGradient></defs>
     <path d={silhouette} fill={lit||fading?"url(#"+gradient+")":"rgba(18,24,34,.43)"} stroke={lit||fading?"#ffe8ac":"#fff9eea8"} strokeWidth={lit||fading?"1.25":"2.5"} strokeLinejoin="round"/>
     {(lit||fading)&&<path d={innerFire} fill={colors.core} opacity=".91"/>}
     {i===2&&(lit||fading)&&<g className="flameSparks"><circle cx="9" cy="13" r="2.5" fill="#ffbf50"/><circle cx="52" cy="8" r="2" fill="#ffd66b"/><circle cx="47" cy="0" r="1.6" fill="#fff0ad"/></g>}
    </svg>
   </span>;
  })}
 </div>;
}
