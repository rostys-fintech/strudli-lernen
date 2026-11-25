import {useEffect,useRef,useState} from "react";
import {ArrowLeft,ArrowRight,BookOpen,Bookmark,Image as ImageIcon,PenLine,RotateCcw,Shuffle,Trophy,Volume2,VolumeX,Zap} from "lucide-react";
import type {Word} from "./data";
import {feedbackSound} from "./feedbackSounds";
import type {UILang} from "./i18n";
import GamePicture from "./GamePicture";
import StrudliMascot from "./StrudliMascot";
import {articleRound,endingRound,glossRound,loadSaved,mixRound,photoRound,storyGlosses,type ArenaQuestion,type RoundKind,type StoryGloss} from "./arenaRounds";
import "./arena.css";

/* Strudli Arena — optional game-show quiz: three big buttons, 15-second timer, points for
   speed, original Web Audio music. Rounds: mix, articles with photos, photo → word,
   adjective endings, words from a cinematic story, and words saved while watching. */

const LIMIT_MS=15000, MAX_POINTS=1000, MIN_POINTS=500;
const BEST_KEY="strudli-arena-best-v1";
const SHAPES=["◆","●","▲"]; // same glyphs and order as the calm Practice quiz
const PRODUCTION_HOSTS=["wortwelt-de-ua.vercel.app"];
type Phase="intro"|"question"|"reveal"|"done";
type CinemaEntry={id:string;status?:string;access:string;title:string;data:string};
type StorySet={id:string;title:string;items:StoryGloss[]};
type Props={language:UILang;words:Word[];speak:(text:string)=>Promise<void>;onExit:()=>void;initialStory?:string|null};

const norm=(s:string)=>s.trim().replace(/\s+/g," ").toLocaleLowerCase("de-DE");
function visible(s:CinemaEntry){
 if(s.status==="draft")return false;
 if(s.access==="public")return true;
 try{return !PRODUCTION_HOSTS.includes(window.location.hostname)}catch{return false}
}
function loadBest():Record<string,number>{try{const v=JSON.parse(localStorage.getItem(BEST_KEY)||"{}");return v&&typeof v==="object"?v:{}}catch{return {}}}

/* ---------- original music loop (Web Audio, no files, no licence questions) ---------- */
type MusicHandle={stop:()=>void;setFast:(fast:boolean)=>void};
type ExtendedWindow=Window&{webkitAudioContext?:typeof AudioContext};
function startMusic():MusicHandle|null{
 const Ctor=window.AudioContext||(window as ExtendedWindow).webkitAudioContext;
 if(!Ctor)return null;
 const ctx=new Ctor();
 const master=ctx.createGain();master.gain.value=0.13;master.connect(ctx.destination);
 const bass=[110,110,146.83,130.81], arp=[440,523.25,659.25,523.25,587.33,698.46,880,698.46];
 let step=0, next=ctx.currentTime+0.05, fast=false, alive=true;
 const note=(freq:number,at:number,len:number,vol:number,type:OscillatorType)=>{
  const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;
  g.gain.setValueAtTime(0.0001,at);g.gain.exponentialRampToValueAtTime(vol,at+0.012);g.gain.exponentialRampToValueAtTime(0.0001,at+len);
  o.connect(g);g.connect(master);o.start(at);o.stop(at+len+0.02);
 };
 const tick=window.setInterval(()=>{
  if(!alive)return;
  const sixteenth=fast?0.105:0.135;
  while(next<ctx.currentTime+0.2){
   if(step%4===0)note(bass[(step/4|0)%bass.length],next,sixteenth*3.2,0.55,"triangle");
   note(arp[step%arp.length]*(step%16>=8?1.122:1),next,sixteenth*0.9,0.18,"square");
   if(step%8===4)note(2200,next,0.03,0.12,"sine");
   next+=sixteenth;step++;
  }
 },60);
 return {stop:()=>{alive=false;window.clearInterval(tick);master.gain.setTargetAtTime(0.0001,ctx.currentTime,0.08);window.setTimeout(()=>void ctx.close().catch(()=>{}),400)},setFast:(v:boolean)=>{fast=v}};
}

export default function Arena({language,words,speak,onExit,initialStory}:Props){
 const en=language==="en";
 const label=(uk:string,e:string)=>en?e:uk;
 const [phase,setPhase]=useState<Phase>("intro");
 const [roundKey,setRoundKey]=useState<string>(initialStory?"story:"+initialStory:"mix");
 const [cards,setCards]=useState<ArenaQuestion[]>([]);
 const [index,setIndex]=useState(0);
 const [score,setScore]=useState(0);
 const [correctCount,setCorrectCount]=useState(0);
 const [streak,setStreak]=useState(0);
 const [picked,setPicked]=useState<string|null>(null);
 const [gained,setGained]=useState(0);
 const [left,setLeft]=useState(LIMIT_MS);
 const [musicOn,setMusicOn]=useState(true);
 const [best,setBest]=useState<Record<string,number>>(loadBest);
 const [stories,setStories]=useState<StorySet[]>([]);
 const [saved]=useState<StoryGloss[]>(loadSaved);
 const music=useRef<MusicHandle|null>(null);
 const startedAt=useRef(0);
 const feedbackRef=useRef<HTMLDivElement|null>(null);
 const current=cards[index];

 const stopMusic=()=>{music.current?.stop();music.current=null};
 useEffect(()=>()=>stopMusic(),[]);
 useEffect(()=>{if(phase==='reveal')window.requestAnimationFrame(()=>feedbackRef.current?.scrollIntoView({behavior:'smooth',block:'nearest'}))},[phase,index]);
 useEffect(()=>{
  let alive=true;
  fetch("/lesen-pilot/catalog.json",{cache:"no-cache"}).then(r=>r.ok?r.json():{stories:[]})
   .then(async(c:{stories?:CinemaEntry[]})=>{
    const list=(c.stories||[]).filter(visible);
    const sets=await Promise.all(list.map(async s=>{try{const d=await (await fetch(s.data,{cache:"no-cache"})).json();return {id:s.id,title:s.title,items:storyGlosses(s.id,s.title,d)}}catch{return null}}));
    const order=new Map(list.map(s=>[s.id,s.access==='public'?0:1]));
    if(alive)setStories(sets.filter((x):x is StorySet=>Boolean(x&&x.items.length>=3)).sort((a,b)=>(order.get(a.id)||0)-(order.get(b.id)||0)));
   }).catch(()=>{});
  return ()=>{alive=false};
 },[]);
 useEffect(()=>{
  if(phase!=="question")return;
  startedAt.current=performance.now();setLeft(LIMIT_MS);
  if(current?.speakFirst)void speak(current.speakFirst);
  const timer=window.setInterval(()=>{
   const rest=Math.max(0,LIMIT_MS-(performance.now()-startedAt.current));
   setLeft(rest);music.current?.setFast(rest<5000);
   if(rest<=0){window.clearInterval(timer);reveal(null)}
  },100);
  return ()=>window.clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[phase,index]);

 const rounds:{key:string;kind:RoundKind;title:string;sub:string;icon:typeof Zap;ready:boolean}[]=[
  {key:"articles",kind:"articles",title:label("Який артикль?","Which article?"),sub:label("Фото і слово · der / die / das","Photo and word · der / die / das"),icon:BookOpen,ready:true},
  {key:"endings",kind:"endings",title:label("Яке закінчення?","Which ending?"),sub:label("ein neuer / eine neue / ein neues","ein neuer / eine neue / ein neues"),icon:PenLine,ready:true},
  {key:"photo",kind:"photo",title:label("Що на фото?","What's in the photo?"),sub:label("Обери німецьке слово","Pick the German word"),icon:ImageIcon,ready:true},
  {key:"mix",kind:"mix",title:label("Мікс","Mix"),sub:label("Відмінки, дієслова, слова на слух","Cases, verbs, listening"),icon:Shuffle,ready:true},
  ...stories.map(s=>({key:"story:"+s.id,kind:"story" as RoundKind,title:label("З історії","From the story")+": "+s.title,sub:label(`${s.items.length} слів і фраз з кіноісторії`,`${s.items.length} words and phrases from the story`),icon:Zap,ready:true})),
  {key:"saved",kind:"saved",title:label("Мої слова з історій","My saved story words"),sub:saved.length>=3?label(`${saved.length} збережених слів`,`${saved.length} saved words`):label("Збережи щонайменше 3 слова в кіноісторії (☆)","Save at least 3 words in a story (☆)"),icon:Bookmark,ready:saved.length>=3},
 ];

 function build(key:string):ArenaQuestion[]{
  if(key==="articles")return articleRound(words,language);
  if(key==="endings")return endingRound(words,language);
  if(key==="photo")return photoRound(words,language);
  if(key==="saved")return glossRound(saved,language,"saved",label("Мої слова","My words"));
  if(key.startsWith("story:")){const s=stories.find(x=>"story:"+x.id===key);return s?glossRound(s.items,language,"story",s.title):[]}
  return mixRound(words,language);
 }
 function begin(key=roundKey){
  const qs=build(key);if(qs.length<3)return;
  setRoundKey(key);setCards(qs);setIndex(0);setScore(0);setCorrectCount(0);setStreak(0);setPicked(null);setGained(0);
  stopMusic();if(musicOn)music.current=startMusic();
  setPhase("question");
 }
 function reveal(choice:string|null){
  if(!current)return;
  const elapsed=performance.now()-startedAt.current;
  const right=choice!==null&&norm(choice)===norm(current.answer);
  const points=right?Math.round(MAX_POINTS-(MAX_POINTS-MIN_POINTS)*Math.min(1,elapsed/LIMIT_MS)):0;
  setPicked(choice);setGained(points);setScore(s=>s+points);
  if(right){setCorrectCount(n=>n+1);setStreak(n=>n+1);feedbackSound("correct",Math.min(3,streak+1));if(current.kind!=="mix"&&current.kind!=="story"&&current.kind!=="saved")void speak(current.reveal)}
  else{setStreak(0);feedbackSound("wrong",0)}
  music.current?.setFast(false);
  setPhase("reveal");
 }
 function next(){
  if(index+1>=cards.length){
   stopMusic();
   if(score>(best[roundKey]||0)){const b={...best,[roundKey]:score};setBest(b);try{localStorage.setItem(BEST_KEY,JSON.stringify(b))}catch{}}
   setPhase("done");return;
  }
  setPicked(null);setGained(0);setIndex(i=>i+1);setPhase("question");
 }
 function toggleMusic(){
  const on=!musicOn;setMusicOn(on);
  if(!on)stopMusic();else if(phase==="question"||phase==="reveal")music.current=startMusic();
 }
 function exit(){stopMusic();onExit()}
 const seconds=Math.ceil(left/1000);
 const roundTitle=rounds.find(r=>r.key===roundKey)?.title||"Arena";

 return <section className="arena" aria-label={label("Арена: швидкий квіз","Arena: quick quiz")}>
  <header className="arenaTop">
   <button type="button" className="arenaIcon" onClick={phase==="intro"?exit:()=>{stopMusic();setPhase("intro")}} aria-label={label("Назад","Back")}><ArrowLeft size={20}/></button>
   <strong className="arenaTitle"><Zap size={18}/> Arena</strong>
   {phase==="question"||phase==="reveal"?<span className="arenaScore" aria-live="polite">{score} {label("балів","pts")}</span>:<span/>}
   <button type="button" className="arenaIcon" onClick={toggleMusic} aria-pressed={musicOn} aria-label={musicOn?label("Вимкнути музику","Mute music"):label("Увімкнути музику","Play music")}>{musicOn?<Volume2 size={19}/>:<VolumeX size={19}/>}</button>
  </header>

  {phase==="intro"&&<div className="arenaIntro">
   <img src="/strudli/strudli-storybook-hero.webp" alt="" aria-hidden="true"/>
   <h1>{label("Арена Strudli","Strudli Arena")}</h1>
   <p>{label("10 питань · 15 секунд на кожне · бали за швидкість. Обери раунд:","10 questions · 15 seconds each · points for speed. Choose a round:")}</p>
   <div className="arenaRounds">
    {rounds.map(r=>{const Icon=r.icon;return <button key={r.key} type="button" className={"arenaRoundCard"+(r.key===roundKey?" selected":"")} disabled={!r.ready} onClick={()=>begin(r.key)}>
     <Icon size={22}/><span><strong>{r.title}</strong><small>{r.sub}</small></span>{best[r.key]?<em><Trophy size={13}/> {best[r.key]}</em>:<ArrowRight size={18}/>}
    </button>})}
   </div>
  </div>}

  {(phase==="question"||phase==="reveal")&&current&&<div className="arenaRound">
   <div className="arenaMeta"><span className="arenaMetaMascot" aria-hidden="true"><StrudliMascot pose={phase==="reveal"?(gained>0?"success":"wave"):current.speakFirst?"listen":"book"}/></span><span>{index+1} / {cards.length}</span>{streak>1&&<span className="arenaStreak">🔥 {streak}</span>}<span className={"arenaClock"+(seconds<=5&&phase==="question"?" urgent":"")}>{phase==="question"?seconds:"—"}</span></div>
   <div className="arenaBar" aria-hidden="true"><i style={{width:(phase==="question"?left/LIMIT_MS*100:0)+"%"}}/></div>
   <div className={"arenaPrompt"+(current.photo?" withPhoto":"")}>
    {current.photo&&<div className="arenaPhoto"><GamePicture key={current.photo.id} src={current.photo.photo} wordId={current.photo.id} emoji={current.photo.emoji} alt={label("Фото до слова","Photo for the word")}/></div>}
    <div className="arenaPromptText">
     <small>{current.tag}</small>
     <h2 lang="de">{current.prompt}</h2>
     {current.hint&&<p className="arenaHint" lang={en?"en":"uk"}>{current.hint}</p>}
     {current.speakFirst&&<button type="button" className="arenaReplay" onClick={()=>void speak(current.speakFirst||"")}><Volume2 size={18}/> {label("Прослухати","Listen")}</button>}
    </div>
   </div>
   <div className="arenaAnswers">
    {current.choices.slice(0,3).map((choice,i)=>{
     const isAnswer=norm(choice)===norm(current.answer), isPicked=picked!==null&&norm(choice)===norm(picked);
     const state=phase==="reveal"?(isAnswer?" right":isPicked?" wrong":" dim"):"";
     const colour=current.articleButtons?" article-"+choice:" arenaAnswer"+i;
     return <button key={choice} type="button" className={"arenaAnswer"+colour+state} disabled={phase==="reveal"} onClick={()=>reveal(choice)}>
      <span className="arenaGlyph" aria-hidden="true">{SHAPES[i]}</span><span className="arenaChoiceText" lang={current.kind==="story"||current.kind==="saved"?undefined:"de"}>{choice}</span>
     </button>;
    })}
   </div>
   {phase==="reveal"&&<div ref={feedbackRef} className={"arenaFeedback"+(gained>0?" good":" bad")}>
    <div className="arenaCoach" aria-hidden="true"><StrudliMascot pose={gained>0?"success":"wave"}/>{gained>0&&<span className="arenaBag">+1</span>}</div>
    <div className="arenaBubble">
    <strong>{gained>0?`+${gained} · ${label("Правильно!","Correct!")}`:picked===null?label("Час вийшов","Time's up"):label("Не зовсім","Not quite")}</strong>
    <span lang="de" className="arenaReveal">{current.reveal}</span>
    <span>{current.translation}</span>
    {current.note&&<small>{current.note}</small>}
    </div>
    <button type="button" className="arenaNext" onClick={next}>{index+1>=cards.length?label("Результат","Results"):label("Далі","Next")} <ArrowRight size={18}/></button>
   </div>}
  </div>}

  {phase==="done"&&<div className="arenaDone">
   <Trophy size={44}/>
   <small className="arenaDoneRound">{roundTitle}</small>
   <h1>{score} {label("балів","points")}</h1>
   <p>{label(`Правильно: ${correctCount} з ${cards.length}`,`Correct: ${correctCount} of ${cards.length}`)}</p>
   <p className="arenaBest">{score>0&&score>=(best[roundKey]||0)?label("Новий рекорд!","New record!"):label(`Рекорд: ${best[roundKey]||0}`,`Best: ${best[roundKey]||0}`)}</p>
   <div className="arenaDoneButtons">
    <button type="button" className="arenaStart" onClick={()=>begin()}><RotateCcw size={18}/> {label("Ще раунд","Play again")}</button>
    <button type="button" className="arenaGhost" onClick={()=>setPhase("intro")}>{label("Інший раунд","Another round")}</button>
   </div>
  </div>}
 </section>;
}
