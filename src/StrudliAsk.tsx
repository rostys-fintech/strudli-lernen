import {useState} from "react";
import {Sparkles,Volume2,Eraser} from "lucide-react";
import type {UILang} from "./i18n";
import {explainGerman,type Explanation} from "./strudliApi";
import StrudliGuide from "./StrudliGuide";
import "./strudli-ai-account.css";

const EXAMPLES=[
 "Bitte bringen Sie Ihren Ausweis zum Termin mit.",
 "Die Miete ist am Anfang des Monats fällig.",
 "Der Zug fällt heute leider aus.",
 "Ich hätte gern einen Termin beim Arzt.",
];

/** "Ask Strudli": paste or type any German sentence (a letter, a sign, a message) and get it explained. */
export default function StrudliAsk({language,onSpeak}:{language:UILang;onSpeak:(text:string)=>void}){
 const en=language==="en";
 const [text,setText]=useState("");
 const [state,setState]=useState<"idle"|"loading"|"done"|"offline"|"bad">("idle");
 const [answer,setAnswer]=useState<Explanation|null>(null);
 const [asked,setAsked]=useState("");
 async function ask(value=text){
  const t=value.replace(/\s+/g," ").trim();
  if(t.length<2||state==="loading")return;
  setText(t);setAsked(t);setState("loading");setAnswer(null);
  const r=await explainGerman(t,en?"en":"uk");
  if(r.ok){setAnswer(r.answer);setState("done")}else setState(r.error==="bad_text"?"bad":"offline");
 }
 return <section className="strudliAsk" aria-label={en?"Ask Strudli":"Запитай Strudli"}>
  <header className="strudliAskHead">
   <img src="/strudli/strudli-storybook-hero.webp" alt="" aria-hidden="true"/>
   <div><span className="strudliAskTag"><Sparkles size={14}/> AI</span>
    <h1>{en?"Ask Strudli":"Запитай Strudli"}</h1>
    <p>{en?"Paste a German sentence from a letter, a sign or a message. Strudli explains it in English: translation, key words and grammar.":"Встав німецьке речення з листа, оголошення чи повідомлення. Strudli пояснить українською: переклад, ключові слова й граматику."}</p>
   </div>
  </header>
  <div className="strudliAskBox">
   <label htmlFor="strudli-ask-input">{en?"German text (up to 280 characters)":"Німецький текст (до 280 символів)"}</label>
   <textarea id="strudli-ask-input" lang="de" maxLength={280} rows={3} value={text} placeholder="z. B. Bitte füllen Sie das Formular aus." onChange={e=>{setText(e.target.value);if(state!=="loading")setState("idle")}} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();void ask()}}}/>
   <div className="strudliAskActions">
    <button type="button" className="strudliAskGo" disabled={text.trim().length<2||state==="loading"} onClick={()=>void ask()}><Sparkles size={18}/>{state==="loading"?(en?"Strudli is thinking…":"Strudli думає…"):(en?"Explain":"Пояснити")}</button>
    {text&&<button type="button" className="strudliAskSecondary" onClick={()=>onSpeak(text)} aria-label={en?"Hear the German text":"Прослухати німецький текст"}><Volume2 size={18}/></button>}
    {text&&<button type="button" className="strudliAskSecondary" onClick={()=>{setText("");setState("idle");setAnswer(null)}} aria-label={en?"Clear":"Очистити"}><Eraser size={18}/></button>}
   </div>
  </div>
  <div className="strudliAskExamples"><strong>{en?"Try an example":"Спробуй приклад"}</strong>
   {EXAMPLES.map(x=><button type="button" key={x} lang="de" onClick={()=>void ask(x)}>{x}</button>)}
  </div>
  {state==="loading"&&<div className="strudliExplainCard strudliThinking" role="status"><p className="strudliExplainLabel"><img src="/strudli/strudli-storybook-hero.webp" alt="" aria-hidden="true"/>{en?"Strudli is thinking":"Strudli думає"}<span className="strudliDots">…</span></p></div>}
  {state==="done"&&answer&&<div className="strudliExplainCard strudliTold" aria-live="polite">
   <p className="strudliExplainLabel"><img src="/strudli/strudli-storybook-hero.webp" alt="" aria-hidden="true"/>{en?"Strudli explains":"Strudli пояснює"} <span>AI</span></p>
   <p className="strudliAskAsked" lang="de">{asked}</p>
   <p className="strudliExplainTranslation">{answer.translation}</p>
   {answer.words.length>0&&<ul>{answer.words.map(w=><li key={w.de}><b lang="de">{w.de}</b> — {w.meaning}</li>)}</ul>}
   <p className="strudliExplainGrammar">{answer.grammar}</p>
   {answer.example&&answer.example.de&&<p className="strudliExplainExample"><b lang="de">{answer.example.de}</b><small>{answer.example.tr}</small></p>}
   <small className="strudliExplainNote">{en?"Strudli can make mistakes. For official letters, check important details with the office.":"Strudli може помилятися. Важливі деталі в офіційних листах уточнюй в установі."}</small>
  </div>}
  {state==="bad"&&<div className="strudliExplainCard offline" role="status"><p className="strudliExplainTranslation">{en?"Strudli explains German text only. Please type the sentence in German (Latin letters).":"Strudli пояснює лише німецький текст. Напиши речення німецькою (латинськими літерами)."}</p></div>}
  {state==="offline"&&<div className="strudliExplainCard offline" role="status"><p className="strudliExplainLabel"><img src="/strudli/strudli-storybook-hero.webp" alt="" aria-hidden="true"/>{en?"Strudli is offline right now":"Strudli зараз офлайн"}</p><p className="strudliExplainTranslation">{en?"The AI tutor is not available at the moment. Please try again a bit later.":"AI-помічник зараз недоступний. Спробуй трохи пізніше."}</p></div>}
  <StrudliGuide language={language} compact message={en?"Tip: you also find “Ask Strudli” in every story and next to every phrase in Audio.":"Порада: «Запитай Strudli» є також у кожній історії та біля кожної фрази в «Аудіо»."}/>
 </section>;
}
