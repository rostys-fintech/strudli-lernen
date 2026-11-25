import type {Word} from "./data";
import {wordTranslation,type UILang} from "./i18n.ts";
const shuffle=<T,>(items:readonly T[]):T[]=>{
 const a=[...items];
 for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
 return a;
};
/** Choose plausible, varied alternatives while keeping choices stable during one card. */
export function answerOptionsFor(word:Word,catalog:readonly Word[],lang:UILang="uk"):string[]{
 if(word.kind==="noun")return ["der","die","das"];
 const other=catalog.filter(w=>w.id!==word.id&&wordTranslation(w,lang)!==wordTranslation(word,lang)&&wordTranslation(w,lang).trim());
 const sameKind=other.filter(w=>w.kind===word.kind);
 const sameTopic=sameKind.filter(w=>w.topic===word.topic);
 const used=new Set([wordTranslation(word,lang)]);const distractors:string[]=[];
 for(const pool of [sameTopic,sameKind,other]){
  for(const candidate of shuffle(pool)){
   if(used.has(wordTranslation(candidate,lang)))continue;
   used.add(wordTranslation(candidate,lang));distractors.push(wordTranslation(candidate,lang));
   if(distractors.length>=2)break;
  }
  if(distractors.length>=2)break;
 }
 return shuffle([wordTranslation(word,lang),...distractors]);
}
