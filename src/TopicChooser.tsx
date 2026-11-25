import {useState} from "react";
import{tr,topicLabel,sectionLabel,sectionDescription,wordCounter,type UILang}from"./i18n";
import type {Topic,Word} from "./data";
import {topicsForSection,type LearningSection} from "./learningSections";
type Props={language:UILang;section:LearningSection;topics:readonly Topic[];words:readonly Word[];onBack:()=>void;onStart:(ids:string[])=>void};
/** Universal subtopic chooser: food, home, transport, grammar and every other section. */
export default function TopicChooser({language,section,topics,words,onBack,onStart}:Props){
 const t=(x:string)=>tr(x,language);
 const [includeExtra,setIncludeExtra]=useState(false);
 const subtopics=topicsForSection(section,topics);
 const inTopic=(id:string)=>words.filter(w=>w.topic===id&&!w.pluralOnly&&(includeExtra||w.tier!=="extra")).map(w=>w.id);
 const eligible=words.filter(w=>section.topicIds.includes(w.topic)&&!w.pluralOnly&&(includeExtra||w.tier!=="extra"));
 const selectRound=(ids:string[])=>{const pool=[...ids];for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,Math.min(16,pool.length));};
 const mix=()=>{const pool=[...eligible.map(w=>w.id)];for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}onStart(pool.slice(0,Math.min(20,pool.length)));};
 return <section className="foodChooser sectionChooser"><button className="foodReturn" onClick={onBack}>← {t("Усі розділи")}</button>
 <div className="foodHeading"><span>{section.emoji}</span><div><small>{section.de}</small><h1>{sectionLabel(section.id,section.name,language)}</h1><p>{sectionDescription(section.id,section.desc,language)}. {t("Обери підтему, щоб почати гру.")}</p></div></div>
 <label className="extraToggle"><input type="checkbox" checked={includeExtra} onChange={e=>setIncludeExtra(e.target.checked)}/><span>{t("Додаткові слова (складніші та рідші)")}</span></label>
 <div className="foodGroupGrid">{subtopics.map((topic,index)=>{const ids=inTopic(topic.id);const pic=topic.photo||words.find(w=>w.topic===topic.id&&w.photo)?.photo||section.coverPhoto||words.find(w=>w.id===section.coverWordId)?.photo||words.find(w=>section.topicIds.includes(w.topic)&&w.photo)?.photo;const fallback=section.id==="food"?"/obst-fruit-basket-approved.avif":section.id==="home"?"/photos/approved/everyday-54.webp":section.id==="nature"?"/photos/custom/batch26-nature-505.jpg":section.id==="study"?"/photos/custom/batch27-study-633.jpg":undefined;return <button key={topic.id} className={"foodGroupCard"+(pic?" photoTopicCard":"")} onClick={()=>onStart(selectRound(ids))} disabled={!ids.length}>{pic&&<img className="topicCoverImg" src={pic} loading={index<2?"eager":"lazy"} decoding="async" fetchPriority={index<2?"high":"auto"} alt="" aria-hidden="true" onError={e=>{const img=e.currentTarget;if(fallback&&img.getAttribute("src")!==fallback)img.src=fallback;else img.style.display="none"}}/>}<span className="foodGroupEmoji">{topic.emoji}</span><div><strong>{topicLabel(topic.id,topic.name,language)}</strong><small>{topic.de}</small><b>{ids.length} {includeExtra?wordCounter(ids.length,language):language==="en"?"core "+wordCounter(ids.length,language):"основних "+wordCounter(ids.length,language)} · {Math.min(16,ids.length)} {t("за раунд")}</b></div><span className="foodArrow">→</span></button>})}</div>
 <button className="allFoodButton" onClick={mix} disabled={!eligible.length}>🎲 {t("Мікс до 20 слів цього розділу")}</button>
 </section>;
}
