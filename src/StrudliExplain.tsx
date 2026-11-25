import {useEffect,useRef,useState} from "react";
import {Mic,Sparkles,Square} from "lucide-react";
import type {UILang} from "./i18n";
import {explainGerman,type Explanation} from "./strudliApi";
import "./strudli-ai-account.css";

/** "Strudli explains": AI explanation of one German sentence, with a safe offline fallback. */
export function StrudliExplain({text,language,fallback}:{text:string;language:UILang;fallback:string}){
 const en=language==="en";
 const [state,setState]=useState<"idle"|"loading"|"done"|"offline">("idle");
 const [answer,setAnswer]=useState<Explanation|null>(null);
 const asked=useRef("");
 useEffect(()=>{setState("idle");setAnswer(null);asked.current=""},[text,language]);
 async function ask(){
  if(state==="loading")return;asked.current=text;setState("loading");
  const r=await explainGerman(text,en?"en":"uk");
  if(asked.current!==text)return; // the learner moved on to another phrase
  if(r.ok){setAnswer(r.answer);setState("done")}else setState("offline");
 }
 return <div className="strudliExplain">
  {state!=="done"&&state!=="offline"&&<button type="button" className="strudliExplainButton" disabled={state==="loading"} onClick={()=>void ask()}><Sparkles size={17}/>{state==="loading"?(en?"Strudli is thinking…":"Strudli думає…"):(en?"Strudli explains":"Strudli пояснює")}</button>}
  {state==="done"&&answer&&<div className="strudliExplainCard strudliTold" aria-live="polite">
   <p className="strudliExplainLabel"><img src="/strudli/strudli-storybook-hero.webp" alt="" aria-hidden="true"/>{en?"Strudli explains":"Strudli пояснює"} <span>AI</span></p>
   <p className="strudliExplainTranslation">{answer.translation}</p>
   {answer.words.length>0&&<ul>{answer.words.map(w=><li key={w.de}><b lang="de">{w.de}</b> — {w.meaning}</li>)}</ul>}
   <p className="strudliExplainGrammar">{answer.grammar}</p>
   {answer.example&&answer.example.de&&<p className="strudliExplainExample"><b lang="de">{answer.example.de}</b><small>{answer.example.tr}</small></p>}
   <small className="strudliExplainNote">{en?"Strudli can make mistakes. The translation above the button is checked by our team.":"Strudli може помилятися. Переклад над кнопкою перевірений нашою командою."}</small>
  </div>}
  {state==="offline"&&<div className="strudliExplainCard offline" role="status">
   <p className="strudliExplainLabel"><img src="/strudli/strudli-storybook-hero.webp" alt="" aria-hidden="true"/>{en?"Strudli is offline right now":"Strudli зараз офлайн"}</p>
   <p className="strudliExplainTranslation">{fallback}</p>
   <small className="strudliExplainNote">{en?"This is the checked translation from our dictionary. Try the AI explanation later.":"Це перевірений переклад із нашого словника. Спробуй пояснення від ШІ пізніше."}</small>
  </div>}
 </div>;
}

type Recognition={lang:string;interimResults:boolean;maxAlternatives:number;continuous:boolean;start():void;stop():void;abort():void;onresult:((e:{results:ArrayLike<ArrayLike<{transcript:string}>>})=>void)|null;onerror:((e:{error:string})=>void)|null;onend:(()=>void)|null};
function recognitionClass():(new()=>Recognition)|null{const w=window as unknown as Record<string,unknown>;return (w.SpeechRecognition||w.webkitSpeechRecognition||null) as (new()=>Recognition)|null}
const norm=(s:string)=>s.toLowerCase().normalize("NFC").replace(/ß/g,"ss").replace(/[^\p{L}\p{N}\s]/gu," ").split(/\s+/).filter(Boolean);
/** Word-level match between the target phrase and what the speech recogniser heard. */
export function compareSpeech(target:string,heard:string){
 const pool=norm(heard);
 const words=target.split(/\s+/).filter(Boolean).map(raw=>{const toks=norm(raw);if(!toks.length)return {raw,ok:true,counted:false};
  const ok=toks.every(t=>{const at=pool.indexOf(t);if(at<0)return false;pool.splice(at,1);return true});return {raw,ok,counted:true}});
 const counted=words.filter(w=>w.counted);
 const score=counted.length?Math.round(counted.filter(w=>w.ok).length/counted.length*100):0;
 return {words,score};
}
/** "Say it yourself": the browser's speech recognition (on-device or the browser vendor's AI service) checks pronunciation. */
export function SpeakCheck({text,language}:{text:string;language:UILang}){
 const en=language==="en";
 const [phase,setPhase]=useState<"idle"|"listening"|"result"|"unsupported"|"denied"|"nothing"|"network">("idle");
 const [result,setResult]=useState<ReturnType<typeof compareSpeech>|null>(null);const [heard,setHeard]=useState("");
 const rec=useRef<Recognition|null>(null);
 useEffect(()=>{setPhase("idle");setResult(null);setHeard("");return ()=>{try{rec.current?.abort()}catch{}}},[text]);
 function start(){
  const R=recognitionClass();if(!R){setPhase("unsupported");return}
  try{
   // iOS Safari often ends without a "final" result: keep interim text too and judge whatever was heard.
   const r=new R();rec.current=r;r.lang="de-DE";r.interimResults=true;r.maxAlternatives=3;r.continuous=false;
   let alts:string[]=[];let decided=false;let timer:ReturnType<typeof setTimeout>|null=null;
   const judge=()=>{if(decided)return;decided=true;if(timer)clearTimeout(timer);
    const heardAny=alts.map(a=>a.trim()).filter(Boolean);
    if(!heardAny.length){setPhase(p=>p==="listening"?"nothing":p);return}
    const best=heardAny.map(a=>({a,c:compareSpeech(text,a)})).sort((x,y)=>y.c.score-x.c.score)[0];
    setHeard(best.a);setResult(best.c);setPhase("result")};
   r.onresult=e=>{
    const res=Array.from(e.results as ArrayLike<ArrayLike<{transcript:string}>>);
    const first=res.map(x=>x[0]?.transcript||"").join(" ").replace(/\s+/g," ").trim();
    const last=res[res.length-1];const extra=last?Array.from(last).map(a=>a.transcript):[];
    alts=[first,...extra];
    const isFinal=(res[res.length-1] as unknown as {isFinal?:boolean})?.isFinal;
    if(isFinal)judge();
   };
   r.onerror=e=>{if(e.error==="not-allowed"||e.error==="service-not-allowed"){decided=true;setPhase("denied");return}
    if(e.error==="audio-capture"){decided=true;setPhase("denied");return}
    if(e.error==="network"){decided=true;setPhase("network");return}};
   r.onend=()=>judge();
   r.start();setPhase("listening");
   timer=setTimeout(()=>{try{r.stop()}catch{}},8000); // stop after 8 s and judge what was heard
  }catch{setPhase("unsupported")}
 }
 const verdict=result?(result.score>=90?(en?"Excellent! Strudli understood every word.":"Чудово! Strudli зрозумів кожне слово."):result.score>=60?(en?"Good! Repeat the red words once more.":"Добре! Повтори червоні слова ще раз."):(en?"Listen once more and try slowly.":"Послухай ще раз і спробуй повільніше.")):"";
 return <div className="strudliSpeak">
  <button type="button" className={"strudliSpeakButton"+(phase==="listening"?" live":"")} onClick={()=>phase==="listening"?rec.current?.stop():start()} aria-pressed={phase==="listening"}>{phase==="listening"?<Square size={16}/>:<Mic size={17}/>}{phase==="listening"?(en?"Listening… tap to stop":"Слухаю… натисни, щоб зупинити"):(en?"Say it yourself":"Скажи сам")}</button>
  {phase==="result"&&result&&<div className="strudliSpeakResult" aria-live="polite">
   <p lang="de">{result.words.map((w,i)=><span key={i} className={w.ok?"ok":"miss"}>{w.raw} </span>)}</p>
   <strong>{result.score}% · {verdict}</strong>
   <small>{en?"Heard":"Почув"}: „{heard}“</small>
  </div>}
  {phase==="idle"&&<small className="strudliSpeakNote strudliSpeakPrivacy">{en?"Your browser recognises the speech (in Chrome via Google’s service). Strudli stores no recordings.":"Мовлення розпізнає твій браузер (у Chrome — через сервіс Google). Strudli не зберігає записи."}</small>}
  {phase==="unsupported"&&<small className="strudliSpeakNote" role="status">{en?"Speech check needs Chrome, Edge or Safari. Listening and repeating out loud works everywhere.":"Перевірка вимови працює в Chrome, Edge або Safari. Слухати й повторювати вголос можна всюди."}</small>}
  {phase==="denied"&&<small className="strudliSpeakNote" role="status">{en?"Microphone access is off. Allow it in the browser settings to check your pronunciation.":"Доступ до мікрофона вимкнено. Дозволь його в налаштуваннях браузера, щоб перевірити вимову."}</small>}
  {phase==="nothing"&&<small className="strudliSpeakNote" role="status">{en?"Strudli heard nothing. Tap the button, wait for “Listening…”, then speak clearly. In apps like Telegram or Instagram, open the page in Safari or Chrome.":"Strudli нічого не почув. Натисни кнопку, дочекайся «Слухаю…» і чітко скажи фразу. Якщо сторінка відкрита в Telegram чи Instagram — відкрий її в Safari або Chrome."}</small>}
  {phase==="network"&&<small className="strudliSpeakNote" role="status">{en?"Speech recognition needs an internet connection. Check it and try again.":"Для розпізнавання мовлення потрібен інтернет. Перевір з'єднання й спробуй ще раз."}</small>}
 </div>;
}
