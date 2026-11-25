import {useLayoutEffect,useRef} from "react";

/**
 * On the third correct answer, capture the ACTUAL visible word heading and
 * animate its pixel-identical DOM clone into the approved Strudli character's hands.
 * The clone and character then leave the viewport on a coordinated GPU timeline.
 */
export type ToastEffect={kind:"mastered"|"wrong";tier:number;id:number;label?:string};

type Props={effect:ToastEffect;onMasteredFinished?:()=>void};
const DURATION=2180;
export default function StrudliToastEffect({effect,onMasteredFinished}:Props){
 const callback=useRef(onMasteredFinished);
 callback.current=onMasteredFinished;
 useLayoutEffect(()=>{
  if(effect.kind!=="mastered")return;
  if(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches){
   callback.current?.();
   return;
  }
  const source=document.querySelector<HTMLElement>(".game .flash .word h2");
  if(!source){callback.current?.();return}
  const origin=source.getBoundingClientRect();
  if(!origin.width||!origin.height){callback.current?.();return}

  // Use the existing real text and article markup, not an unrelated floating badge.
  const css=getComputedStyle(source);
  const articleSource=source.querySelector<HTMLElement>("span");
  const overlay=document.createElement("div");
  overlay.className="strudliMasteryOverlay";
  overlay.setAttribute("aria-hidden","true");
  const wordTicket=document.createElement("div");
  wordTicket.className="strudliMasteryCapturedWord";
  wordTicket.style.left=origin.left+"px";
  wordTicket.style.top=origin.top+"px";
  wordTicket.style.width=origin.width+"px";
  wordTicket.style.height=origin.height+"px";
  const copied=source.cloneNode(true) as HTMLElement;
  copied.removeAttribute("id");
  copied.style.margin="0";
  copied.style.width="100%";
  copied.style.fontSize=css.fontSize;
  copied.style.fontWeight=css.fontWeight;
  copied.style.lineHeight=css.lineHeight;
  copied.style.fontFamily=css.fontFamily;
  copied.style.letterSpacing=css.letterSpacing;
  copied.style.textShadow=css.textShadow;
  copied.style.color=css.color;
  const originalArticle=articleSource&&getComputedStyle(articleSource);
  const copiedArticle=copied.querySelector<HTMLElement>("span");
  if(copiedArticle&&originalArticle)copiedArticle.style.color=originalArticle.color;
  wordTicket.appendChild(copied);
  const mascot=document.createElement("img");
  mascot.className="strudliMasteryCarryCharacter";
  mascot.src="/strudli/strudli-mastered-flying.webp";
  mascot.alt="";
  mascot.draggable=false;
  const width=Math.min(220,Math.max(132,window.innerWidth*.39));
  const wordCx=origin.left+origin.width/2,wordCy=origin.top+origin.height/2;
  const mascotX=Math.max(-10,Math.min(window.innerWidth-width+12,wordCx-width*.35));
  const mascotY=Math.max(55,Math.min(window.innerHeight-width-30,wordCy-width*.44));
  mascot.style.left=mascotX+"px";
  mascot.style.top=mascotY+"px";
  mascot.style.width=width+"px";
  mascot.style.height=width+"px";
  // Grab point approximates the approved character's hands.
  const handX=mascotX+width*.63,handY=mascotY+width*.56;
  const pickupX=handX-wordCx,pickupY=handY-wordCy;
  const flyX=window.innerWidth-(mascotX+width)+width*.95+70;
  const flyY=-(mascotY+width+70);
  const entranceY=Math.max(190,window.innerHeight-mascotY+65);
  const entranceX=Math.max(140,window.innerWidth-mascotX+30);
  const glow=document.createElement("div");
  glow.className="strudliMasteryGrabGlow";
  glow.style.left=handX+"px";
  glow.style.top=handY+"px";
  overlay.append(wordTicket,mascot,glow);
  document.body.appendChild(overlay);
  const priorVisibility=source.style.visibility;
  source.style.visibility="hidden";
  const animations:Animation[]=[];
  let finished=false;
  const complete=()=>{
   if(finished)return;
   finished=true;
   callback.current?.();
  };
  try{
   // The word begins EXACTLY where the visible heading was, lifts, and is caught.
   // From 48% onward both animations use the same exit deltas.
   animations.push(wordTicket.animate([
    {offset:0,transform:"translate3d(0,0,0) scale(1) rotate(0deg)",opacity:1,backgroundColor:"rgba(255,244,205,0)",borderColor:"rgba(246,175,48,0)",boxShadow:"none",easing:"cubic-bezier(.22,.72,.3,1)"},
    {offset:.20,transform:"translate3d(0,-15px,0) scale(1.045) rotate(-2deg)",opacity:1,backgroundColor:"rgba(255,244,205,.18)",borderColor:"rgba(246,175,48,.10)",easing:"cubic-bezier(.22,.75,.31,1)"},
    {offset:.42,transform:`translate3d(${pickupX}px,${pickupY}px,0) scale(.72) rotate(-8deg)`,opacity:1,backgroundColor:"rgba(255,244,205,1)",borderColor:"rgba(246,175,48,1)",easing:"cubic-bezier(.35,.65,.28,1)"},
    {offset:.49,transform:`translate3d(${pickupX}px,${pickupY}px,0) scale(.72) rotate(-8deg)`,opacity:1,backgroundColor:"rgba(255,244,205,1)",borderColor:"rgba(246,175,48,1)",easing:"cubic-bezier(.25,.7,.26,1)"},
    {offset:.70,transform:`translate3d(${pickupX+flyX*.28}px,${pickupY+flyY*.23}px,0) scale(.62) rotate(-13deg)`,opacity:1,backgroundColor:"rgba(255,244,205,1)",borderColor:"rgba(246,175,48,1)",easing:"cubic-bezier(.27,.62,.35,1)"},
    {offset:1,transform:`translate3d(${pickupX+flyX}px,${pickupY+flyY}px,0) scale(.44) rotate(-18deg)`,opacity:1,backgroundColor:"rgba(255,244,205,1)",borderColor:"rgba(246,175,48,1)"}
   ],{duration:DURATION,fill:"forwards"}));
   // Strudli arrives by the heading, briefly holds to grab it, then flies
   // on the exact same trajectory as the captured word.
   animations.push(mascot.animate([
    {offset:0,transform:`translate3d(${entranceX}px,${entranceY}px,0) rotate(16deg) scale(.57)`,opacity:0,easing:"cubic-bezier(.21,.77,.3,1)"},
    {offset:.16,transform:"translate3d(62px,88px,0) rotate(8deg) scale(.84)",opacity:1,easing:"cubic-bezier(.21,.72,.31,1)"},
    {offset:.39,transform:"translate3d(0,0,0) rotate(-5deg) scale(1)",opacity:1,easing:"ease-in-out"},
    {offset:.49,transform:"translate3d(0,0,0) rotate(0deg) scale(1)",opacity:1,easing:"cubic-bezier(.25,.7,.26,1)"},
    {offset:.70,transform:`translate3d(${flyX*.28}px,${flyY*.23}px,0) rotate(-9deg) scale(.86)`,opacity:1,easing:"cubic-bezier(.27,.62,.35,1)"},
    {offset:1,transform:`translate3d(${flyX}px,${flyY}px,0) rotate(-18deg) scale(.62)`,opacity:1}
   ],{duration:DURATION,fill:"forwards"}));
   glow.animate([
    {offset:0,opacity:0,transform:"translate(-50%,-50%) scale(.2)"},
    {offset:.41,opacity:0,transform:"translate(-50%,-50%) scale(.2)"},
    {offset:.49,opacity:1,transform:"translate(-50%,-50%) scale(1.6)"},
    {offset:.69,opacity:0,transform:"translate(-50%,-50%) scale(2.7)"},
    {offset:1,opacity:0,transform:"translate(-50%,-50%) scale(3)"}
   ],{duration:DURATION,fill:"forwards"});
   const wordColor=copied.animate([
    {offset:0,color:css.color},
    {offset:.25,color:css.color},
    {offset:.43,color:"#432916"},
    {offset:1,color:"#432916"}
   ],{duration:DURATION,fill:"forwards"});
   animations.push(wordColor);
  }catch{
   complete();
  }
  // Finishes from the actual animation event; timer is only a browser fallback.
  if(animations.length>0)animations[0].onfinish=complete;
  const timeout=window.setTimeout(complete,DURATION+300);
  const initialWidth=window.innerWidth;
  const onResize=()=>{if(Math.abs(window.innerWidth-initialWidth)>28)complete()};
  const onVisibility=()=>{if(document.visibilityState==="hidden")complete()};
  window.addEventListener("resize",onResize);
  document.addEventListener("visibilitychange",onVisibility);
  return ()=>{
   window.clearTimeout(timeout);
   window.removeEventListener("resize",onResize);
   document.removeEventListener("visibilitychange",onVisibility);
   for(const anim of animations)anim.cancel();
   // React has already removed the source heading in the final mastery state.
   source.style.visibility=priorVisibility;
   overlay.remove();
  };
 },[effect.id,effect.kind]);
 if(effect.kind==="wrong")return <div key={effect.id} className="strudliToastEffect strudliToastEffect--wrong" aria-hidden="true">
  <div className="strudliToastSmoke strudliToastSmoke--only"><i/><i/><i/></div>
 </div>;
 return null;
}
