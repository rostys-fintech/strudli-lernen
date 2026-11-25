import {useEffect,useMemo,useState} from "react";
import {ArrowRight,BookOpen,Headphones,Shuffle,SkipBack,SkipForward,Volume2,Eye,EyeOff} from "lucide-react";
import {DAILY_PHRASES,PHRASE_CATEGORIES,type PhraseCategory} from "./everydayPhrases";
import type {UILang} from "./i18n";
import StrudliGuide from "./StrudliGuide";
import {SpeakCheck,StrudliExplain} from "./StrudliExplain";
import "./strudli-home.css";
import "./strudli-audio-content.css";

type CategoryFilter=PhraseCategory|"all";
const AUDIO_STORIES=[
 {id:"bremen",title:"Die Bremer Stadtmusikanten",part:{uk:"Серія 1",en:"Episode 1"},cover:"/lesen-pilot/stories/bremen/media/raeuber.webp"},
 {id:"bremen-2",title:"Die Reise nach Bremen",part:{uk:"Серія 2",en:"Episode 2"},cover:"/lesen-pilot/stories/bremen-2/media/statue.webp"},
 {id:"bremen-3",title:"Auf dem Markt",part:{uk:"Серія 3",en:"Episode 3"},cover:"/lesen-pilot/stories/bremen-3/media/konzert.webp"},
];
export default function StrudliAudio({language,onSpeak,onReading,onStory}:{language:UILang;onSpeak:(text:string)=>void;onReading:()=>void;onStory:(id:string)=>void}){
 const [category,setCategory]=useState<CategoryFilter>("all");
 const [position,setPosition]=useState(0);
 const [recall,setRecall]=useState(false);
 const [revealed,setRevealed]=useState(true);
 const en=language==="en";
 const filtered=useMemo(()=>category==="all"?DAILY_PHRASES:DAILY_PHRASES.filter(p=>p.category===category),[category]);
 const item=filtered[position]||filtered[0];
 const categoryName=PHRASE_CATEGORIES.find(p=>p.id===item?.category);
 useEffect(()=>{setPosition(0);setRevealed(!recall)},[category,recall]);
 if(!item)return null;
 function next(delta:number){setPosition(p=>(p+delta+filtered.length)%filtered.length);setRevealed(!recall);}
 function random(){if(filtered.length<2)return;setPosition(p=>{let candidate=(p+1+Math.floor(Math.random()*(filtered.length-1)))%filtered.length;return candidate});setRevealed(!recall);}
 return <section className="strudliAudio strudliAudioExpanded" aria-label={en?"German audio":"Німецька на слух"}>
  <header className="strudliAudioHeader"><Headphones size={30}/><div><h1>{en?"Listen to real German":"Слухай живу німецьку"}</h1><p>{en?"Short phrases for everyday situations.":"Короткі фрази для реальних ситуацій."}</p></div></header>
  <section className="strudliAudioStories" aria-label={en?"Stories with sound":"Казки зі звуком"}>
   <div className="strudliAudioCategoryHead"><strong>{en?"Stories with sound":"Казки зі звуком"}</strong><span>{en?"narrator + subtitles":"оповідач + субтитри"}</span></div>
   <div className="strudliAudioStoryRow">{AUDIO_STORIES.map(s=><button type="button" key={s.id} onClick={()=>onStory(s.id)}><img src={s.cover} alt="" aria-hidden="true" loading="lazy" decoding="async"/><span><small>{en?s.part.en:s.part.uk}</small><strong lang="de">{s.title}</strong></span></button>)}</div>
  </section>
  <div className="strudliAudioCategoryHead"><strong>{en?"Everyday phrases · choose a situation":"Фрази на щодень · обери ситуацію"}</strong><span>{DAILY_PHRASES.length} {en?"phrases":"фраз"}</span></div>
  <div className="strudliAudioCategories" role="group" aria-label={en?"Filter by situation":"Фільтр за ситуацією"}>
   <button type="button" className={category==="all"?"selected":""} aria-pressed={category==="all"} onClick={()=>setCategory("all")}>{en?"All":"Усі"}</button>
   {PHRASE_CATEGORIES.map(c=><button type="button" key={c.id} className={category===c.id?"selected":""} aria-pressed={category===c.id} onClick={()=>setCategory(c.id)}><span aria-hidden="true">{c.emoji}</span> {en?c.en:c.uk}</button>)}
  </div>
  <div className="strudliAudioRecall"><div><strong>{en?"Listen & remember":"Слухай і запам’ятовуй"}</strong><small>{en?"Hide the German text, then reveal it when ready.":"Сховай німецький текст і відкрий його, коли будеш готовий."}</small></div><button type="button" aria-pressed={recall} onClick={()=>setRecall(v=>!v)}>{recall?<EyeOff size={18}/>:<Eye size={18}/>} {recall?(en?"Recall on":"Тренування"):(en?"Show phrase":"З текстом")}</button></div>
  <div className="strudliAudioPlayer strudliAudioPlayerExpanded">
   <div className="strudliAudioMeta"><span>{categoryName?.emoji} {en?categoryName?.en:categoryName?.uk}</span><span>{item.level} · {position+1} / {filtered.length}</span></div>
   {revealed?<strong lang="de" className="strudliAudioGermanPhrase">{item.de}</strong>:<div className="strudliAudioHidden" aria-label={en?"German phrase hidden":"Німецьку фразу приховано"}>••• <small>{en?"Listen first":"Спершу послухай"}</small></div>}
   <p>{en?item.en:item.uk}</p>
   {!revealed&&<button type="button" className="strudliAudioReveal" onClick={()=>setRevealed(true)}><Eye size={16}/>{en?"Reveal German":"Показати німецькою"}</button>}
   <div className="strudliAudioControls">
    <button type="button" aria-label={en?"Previous phrase":"Попередня фраза"} onClick={()=>next(-1)}><SkipBack/></button>
    <button type="button" className="strudliAudioPlay" onClick={()=>onSpeak(item.de)} aria-label={en?"Play German phrase":"Прослухати німецьку фразу"}><Volume2/>{en?"Listen":"Слухати"}</button>
    <button type="button" aria-label={en?"Next phrase":"Наступна фраза"} onClick={()=>next(1)}><SkipForward/></button>
   </div>
   {revealed&&<div className="strudliAudioActions"><StrudliExplain text={item.de} language={language} fallback={en?item.en:item.uk}/><SpeakCheck text={item.de} language={language}/></div>}
   <button type="button" className="strudliAudioSurprise" onClick={random}><Shuffle size={17}/>{en?"Surprise me":"Випадкова фраза"}</button>
  </div>
  <StrudliGuide language={language} compact message={en?"Listen, repeat out loud, then try again without looking.":"Прослухай, повтори вголос і спробуй ще раз без підглядання."}/>
  <button type="button" className="strudliAudioReading" onClick={onReading}><BookOpen size={24}/><span><strong>{en?"Stories with narration":"Історії з озвученням"}</strong><small>{en?"Read a story, tap words and test yourself":"Читай, натискай на слова та перевіряй розуміння"}</small></span><ArrowRight/></button>
 </section>;
}
