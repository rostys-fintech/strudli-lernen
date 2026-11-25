import {useEffect,useMemo,useRef,useState} from "react";
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,Headphones,RotateCcw,Volume2,X} from "lucide-react";
import type {Word} from "./data";
import type {UILang} from "./i18n";
import StrudliMascot from "./StrudliMascot";
import StrudliGuide from "./StrudliGuide";
import {READING_STORIES,READING_PROGRESS_KEY,type ReadingProgress,type ReadingStory} from "./lesenStories";
import {readingGloss,readingTokens,type Gloss} from "./lesenGlossary";
import {playStoryNarration} from "./lesenNarration";

type Props={language:UILang;words:readonly Word[];onBack:()=>void;speak:(text:string)=>Promise<void>;stopAudio:()=>void;onArena?:()=>void;initialCinema?:string|null};
type SelectedWord={surface:string;gloss:Gloss;article?:string;sentenceIndex:number};
type ReadingFilter="all"|"A0"|"A1";

function loadReadingProgress():ReadingProgress{
 try{
  const stored=JSON.parse(localStorage.getItem(READING_PROGRESS_KEY)||"{}") as unknown;
  if(!stored||typeof stored!=="object"||Array.isArray(stored))return {};
  const known=new Set(READING_STORIES.map(s=>s.id));
  const safe:ReadingProgress={};
  for(const [id,value] of Object.entries(stored)){
   if(!known.has(id)||!value||typeof value!=="object"||Array.isArray(value))continue;
   const result=value as Record<string,unknown>;
   if(typeof result.score==="number"&&result.score>=0&&result.score<=3&&result.maxScore===3&&typeof result.completedAt==="string")
    safe[id]={score:result.score,maxScore:3,completedAt:result.completedAt};
  }
  return safe;
 }catch{return {}}
}
type CinemaStory={id:string;status?:string;access:"public"|"private";title:string;subtitle?:string;cover:string;teaser?:{uk:string;en:string};levels:string[]};
const PRODUCTION_HOSTS=["wortwelt-de-ua.vercel.app","strudli-lernen.vercel.app"];
function cinemaVisible(s:CinemaStory){
 if(s.status==="draft")return false;
 if(s.access==="public")return true;
 try{return !PRODUCTION_HOSTS.includes(window.location.hostname)}catch{return false}
}
export default function Lesen({language,words,onBack,speak,stopAudio,onArena,initialCinema}:Props){
 const uk=language==="uk";
 const [storyId,setStoryId]=useState<string|null>(null);
 const [pilotOpen,setPilotOpen]=useState(false);
 const [cinema,setCinema]=useState<CinemaStory[]>([]);
 const [cinemaId,setCinemaId]=useState<string|null>(null);
 const [filter,setFilter]=useState<ReadingFilter>("all");
 const [selectedWord,setSelectedWord]=useState<SelectedWord|null>(null);
 const [showTranslation,setShowTranslation]=useState(false);
 const [isNarrating,setIsNarrating]=useState(false);
 const [narrationError,setNarrationError]=useState(false);
 const narratorStop=useRef<(()=>void)|null>(null);
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const [progress,setProgress]=useState<ReadingProgress>(loadReadingProgress);
 const story=READING_STORIES.find(s=>s.id===storyId)||null;
 const completed=Object.keys(progress).length;
 const wordIndex=useMemo(()=>{
  const index=new Map<string,Word>();
  for(const w of words){
   const key=w.de.toLocaleLowerCase("de");
   if(!index.has(key))index.set(key,w);
  }
  return index;
 },[words]);
 useEffect(()=>{try{localStorage.setItem(READING_PROGRESS_KEY,JSON.stringify(progress))}catch{}},[progress]);
 useEffect(()=>{
  if(!story||Object.keys(answers).length!==story.questions.length)return;
  const score=story.questions.reduce((sum,q,i)=>sum+(answers[i]===q.correct?1:0),0);
  setProgress(previous=>{
   const old=previous[story.id];
   if(old&&old.score>=score)return previous;
   return {...previous,[story.id]:{score,maxScore:story.questions.length,completedAt:new Date().toISOString()}};
  });
 },[answers,story]);
 useEffect(()=>()=>{narratorStop.current?.();stopAudio()},[stopAudio]);
 useEffect(()=>{
  const onMessage=(e:MessageEvent)=>{if(e.origin===window.location.origin&&e.data&&e.data.type==="strudli-open-arena")onArena?.()};
  window.addEventListener("message",onMessage);return ()=>window.removeEventListener("message",onMessage);
 },[onArena]);
 useEffect(()=>{
  let alive=true;
  fetch("/lesen-pilot/catalog.json",{cache:"no-cache"})
   .then(r=>r.ok?r.json():{stories:[]})
   .then((c:{stories?:CinemaStory[]})=>{if(!alive)return;const list=(c.stories||[]).filter(cinemaVisible);setCinema(list);if(initialCinema&&list.some(s=>s.id===initialCinema)){setCinemaId(initialCinema);setPilotOpen(true)}})
   .catch(()=>{if(alive)setCinema([])});
  return ()=>{alive=false};
 },[]);
 const cinemaStory=cinema.find(s=>s.id===cinemaId)||cinema[0]||null;
 const score=story&&Object.keys(answers).length===story.questions.length
  ?story.questions.reduce((sum,q,i)=>sum+(answers[i]===q.correct?1:0),0)
  :null;
 function stopNarration(){
  narratorStop.current?.();narratorStop.current=null;stopAudio();setIsNarrating(false);
 }
 function openPilot(id:string){stopNarration();setStoryId(null);setSelectedWord(null);setCinemaId(id);setPilotOpen(true)}
 function closePilot(){setPilotOpen(false)}
 function openStory(item:ReadingStory){
  stopNarration();setStoryId(item.id);setSelectedWord(null);setShowTranslation(false);setAnswers({});setNarrationError(false);
 }
 function backToList(){stopNarration();setStoryId(null);setSelectedWord(null);setAnswers({});}
 function backHome(){stopNarration();onBack();}
 function toggleNarration(){
  if(!story)return;
  if(isNarrating){stopNarration();return}
  stopAudio();setNarrationError(false);setIsNarrating(true);
  narratorStop.current=playStoryNarration(story,()=>{narratorStop.current=null;setIsNarrating(false)},()=>{narratorStop.current=null;setIsNarrating(false);setNarrationError(true)});
 }
 function tapWord(word:string,sentenceIndex:number){
  if(!story)return;
  let gloss=readingGloss(word,story.glossary);
  if(word==="Sie"){
   const line=story.sentences[sentenceIndex]?.[0]||"";
   const formal=/\b(?:möchten|steigen|können|haben)\s+Sie\b|\bSie\s+(?:können|müssen|sind|möchten|haben)\b/i.test(line);
   gloss=formal?["Ви (ввічливо)","you (formal)"]:["вона","she"];
  }
  if(!gloss)return;
  stopNarration();
  const found=wordIndex.get(word.toLocaleLowerCase("de"));
  setSelectedWord({surface:word,gloss,article:found?.kind==="noun"?found.gender:undefined,sentenceIndex});
  void speak(word);
 }
 function answer(questionIndex:number,choiceIndex:number){
  setAnswers(previous=>questionIndex in previous?previous:{...previous,[questionIndex]:choiceIndex});
 }
 const labels={
  back:uk?"До історій":"Back to stories",
  first:uk?"Вибери коротку історію":"Choose a short story",
  subtitle:uk?"Читай німецькою, натискай на слова та перевіряй розуміння.":"Read in German, tap words and check your understanding.",
  stories:uk?"історій":"stories",
  done:uk?"прочитано":"completed",
  words:uk?"Натисни на будь-яке слово, щоб побачити переклад і почути вимову.":"Tap any word to see its meaning and hear the pronunciation.",
  show:uk?"Показати переклад":"Show translation",
  hide:uk?"Приховати переклад":"Hide translation",
  stopNarration:uk?"Зупинити читання":"Stop narration",
  narrationError:uk?"Озвучення недоступне в цьому браузері.":"Narration is unavailable in this browser.",
  voiceInfo:uk?"Безперервне читання голосом пристрою":"Continuous reading using the device voice",
  fullAudio:uk?"Слухати всю історію":"Listen to full story",
  questions:uk?"Перевір себе":"Check your understanding",
  quizHelp:uk?"Три короткі запитання за сюжетом":"Three short comprehension questions",
  correct:uk?"Правильно!":"Correct!",
  wrong:uk?"Правильна відповідь позначена зеленим.":"The correct answer is highlighted in green.",
  close:uk?"Закрити переклад":"Close translation",
  repeat:uk?"Пройти тест ще раз":"Retry questions",
  complete:uk?"Історію завершено!":"Story completed!",
  result:uk?"Правильних відповідей":"Correct answers",
  finished:uk?"Вже прочитано":"Completed",
  before:uk?"Почни читати":"Start reading",
  next:uk?"Наступна історія":"Next story",
  filter:uk?"Рівень":"Level",
  all:uk?"Усі":"All",
  fromCatalog:uk?"Слово зі словника Strudli":"Strudli vocabulary word"
 };
 const visible=READING_STORIES.filter(s=>filter==="all"||s.level===filter);
 const storyIndex=story?READING_STORIES.findIndex(s=>s.id===story.id):-1;
 const nextStory=storyIndex>=0?READING_STORIES[storyIndex+1]:undefined;
 const bookParagraphs=story?story.paragraphEnds.map((end,paragraphIndex)=>{
  const first=paragraphIndex===0?0:story.paragraphEnds[paragraphIndex-1];
  return story.sentences.slice(first,end).map((sentence,i)=>({de:sentence[0],uk:sentence[1],en:sentence[2],index:first+i}));
 }):[];

 return <section className="lesenHub" aria-label={uk?"Читання німецькою":"German reading"}>
  <div className="lesenTop">
   <button type="button" className="lesenBack" onClick={pilotOpen?closePilot:story?backToList:backHome} aria-label={story?labels.back:(uk?"На головну":"Home")}><ArrowLeft size={19}/></button>
   <span className="lesenBreadcrumb">Strudli Lernen <span aria-hidden="true">/</span> Lesen {pilotOpen?" / "+(cinemaStory?cinemaStory.title+(cinemaStory.subtitle?" · "+cinemaStory.subtitle:""):(uk?"Кіноісторія":"Cinematic story")):story?" / "+story.title.de:""}</span>
  </div>
  {pilotOpen?<>
    <section className="lesenPilotArea" aria-label={uk?"Кінематографічний пілот Lesen":"Cinematic Lesen pilot"}>
      <div className="lesenPilotHead">
       <div><span className="lesenEyebrow">{uk?"КІНОКАЗКА · A1/A2":"CINEMA TALE · A1/A2"}</span>
        <h1>{uk?"Історія у кадрах":"A story in moving pictures"}</h1>
        <p>{uk?"Оповідач Conrad, сім мальованих сцен і переклад за натисканням на слово.":"Conrad narrates seven painted scenes. Tap a subtitle word for translation."}</p>
       </div>
       <button type="button" className="lesenPilotBack" onClick={closePilot}><ArrowLeft size={17}/>{uk?"Усі історії":"All stories"}</button>
      </div>
      <iframe
       className="lesenPilotFrame"
       title={uk?"Інтерактивний кінематографічний плеєр Lesen":"Interactive cinematic Lesen player"}
       src={`/lesen-pilot/index.html?embed=1&lang=${language}&story=${encodeURIComponent(cinemaStory?.id||"")}`}
       allow="autoplay; fullscreen; picture-in-picture"
       allowFullScreen
       loading="eager"
      />
      <p className="lesenPilotHelp">{uk?"Натисни на слово у субтитрах, щоб побачити переклад. На iPhone ⛶ відкриває системний плеєр — для інтерактивного перекладу повернись до звичайного перегляду.":"Tap a word in the subtitles for translation. On iPhone, ⛶ opens the native player; exit fullscreen to tap words again."}</p>
    </section>
   </>:!story?<>
   <header className="lesenHero"><div className="lesenHeroCopy">
    <span className="lesenEyebrow"><BookOpen size={15}/> LESEN · A0–A1</span>
    <h1>{uk?"Читай із":"Read with"} <em>Strudli</em></h1>
    <p>{labels.subtitle}</p>
    <div className="lesenHeroStats"><span><b>{READING_STORIES.length}</b> {labels.stories}</span><span><b>{completed}</b> {labels.done}</span></div>
   </div><StrudliMascot pose="book"/></header>
   {cinema.map(item=><button key={item.id} type="button" className="lesenPilotLaunch" onClick={()=>openPilot(item.id)} aria-label={(uk?"Відкрити кіноісторію ":"Open cinematic story ")+item.title}>
      <img src={item.cover} alt="" loading="lazy" decoding="async"/>
      <span className="lesenPilotLaunchContent">
       <span className="lesenPilotTag">{item.access==="private"?"PRIVATE PILOT":"KINO"} · {item.levels.map(l=>l.toUpperCase()).join(" / ")}</span>
       <strong>{item.title}{item.subtitle?" · "+item.subtitle:""}</strong>
       <small>{item.teaser?(uk?item.teaser.uk:item.teaser.en):(uk?"Мальовані сцени, голос оповідача, субтитри й переклад слів.":"Painted scenes, narrator, subtitles and word translations.")}</small>
       <span className="lesenPilotAction">{uk?"Дивитися й вивчати":"Watch and learn"} <ArrowRight size={17}/></span>
      </span>
   </button>)}
   <div className="lesenSectionHeading">
    <h2>{labels.first}</h2>
    <div className="lesenFilters" role="group" aria-label={labels.filter}>
     {(["all","A0","A1"] as const).map(level=><button key={level} type="button" aria-pressed={filter===level} className={filter===level?"selected":""} onClick={()=>setFilter(level)}>{level==="all"?labels.all:level}</button>)}
    </div>
   </div>
   <div className="lesenStoryGrid">{visible.map(s=>{const result=progress[s.id];return <button type="button" key={s.id} className="lesenStoryTile" onClick={()=>openStory(s)}>
    <div className="lesenTileTop"><span className="lesenTileEmoji" aria-hidden="true">{s.emoji}</span><span className="lesenLevel">{s.level}</span></div>
    <span className="lesenGermanTitle" lang="de">{s.title.de}</span>
    <span className="lesenTileTranslation">{s.title[language]}</span>
    <span className="lesenTileDescription">{s.subtitle[uk?0:1]}</span>
    <span className="lesenTileBottom">{result?<span className="lesenCompleted"><CheckCircle2 size={15}/> {labels.finished} · {result.score}/3</span>:<span>{labels.before} <ArrowRight size={16}/></span>}</span>
   </button>})}</div>
  </>:<>
   <div className="lesenReaderHead">
    <div><span className="lesenEyebrow">LESEN · {story.level} · {story.sentences.length} {uk?"речень":"sentences"}</span><h1 lang="de">{story.title.de}</h1><p>{story.title[language]} · {story.subtitle[uk?0:1]}</p></div>
    <span className="lesenReaderEmoji" aria-hidden="true">{story.emoji}</span>
   </div>
   <div className="lesenReaderActions">
    <span><BookOpen size={16}/>{labels.words}</span>
    <button type="button" className={isNarrating?"lesenNarrating":""} onClick={toggleNarration} aria-pressed={isNarrating}><Headphones size={18}/>{isNarrating?labels.stopNarration:labels.fullAudio}</button>
     <small className="lesenVoiceNote">{labels.voiceInfo}</small>
     {narrationError&&<small className="lesenVoiceError" role="status">{labels.narrationError}</small>}
   </div>
   <StrudliGuide language={language} compact message={uk?"Читай у своєму темпі. Натисни на незнайоме слово, щоб почути його та побачити переклад.":"Read at your own pace. Tap an unfamiliar word to hear it and see its meaning."}/>
   {selectedWord&&<aside className="lesenWordDetail" aria-live="polite">
    <div><small>{uk?"Переклад слова":"Word meaning"}</small><strong lang="de">{selectedWord.article?selectedWord.article+" ":""}{selectedWord.surface}</strong><span>{selectedWord.gloss[uk?0:1]}</span></div>
    <button type="button" aria-label={uk?"Прослухати слово":"Hear word"} onClick={()=>{stopNarration();void speak(selectedWord.surface)}}><Volume2 size={18}/></button>
    <button type="button" className="lesenClose" aria-label={labels.close} onClick={()=>setSelectedWord(null)}><X size={18}/></button>
   </aside>}
   <article className="lesenPage" aria-label={uk?"Текст історії":"Story text"} lang="de">
    {bookParagraphs.map((paragraph,paragraphIndex)=><p key={paragraphIndex} className="lesenStoryParagraph">
     {paragraph.map(({de,index})=><span key={index} className="lesenInlineSentence">{readingTokens(de).map((piece,t)=>/^\p{L}+$/u.test(piece)
      ?<button type="button" key={t} className={"lesenToken"+(selectedWord?.sentenceIndex===index&&selectedWord.surface===piece?" active":"")} onClick={()=>tapWord(piece,index)} lang="de">{piece}</button>
      :<span key={t}>{piece}</span>)}{" "}</span>)}
    </p>)}
   </article>
   <div className="lesenFullTranslationArea">
    <button type="button" className="lesenFullTranslationToggle" onClick={()=>setShowTranslation(v=>!v)} aria-expanded={showTranslation}>{showTranslation?labels.hide:labels.show} {showTranslation?"−":"+"}</button>
    {showTranslation&&<section className="lesenFullTranslation" lang={uk?"uk":"en"} aria-label={uk?"Повний переклад історії":"Full story translation"}>{bookParagraphs.map((paragraph,i)=><p key={i}>{paragraph.map(row=>uk?row.uk:row.en).join(" ")}</p>)}</section>}
   </div>
   <section className="lesenQuiz" aria-label={labels.questions}>
    <div className="lesenQuizHead"><span className="lesenEyebrow">✓ {story.questions.length} {uk?"запитання":"questions"}</span><h2>{labels.questions}</h2><p>{labels.quizHelp}</p></div>
    {story.questions.map((q,qi)=><div className="lesenQuestion" key={qi}>
     <h3><span>{qi+1}</span>{q.prompt[uk?0:1]}</h3>
     <div className="lesenChoices">{q.choices.map((ch,ci)=>{const chosen=answers[qi],answered=chosen!==undefined,isCorrect=ci===q.correct;return <button type="button" key={ci} disabled={answered} className={"lesenChoice"+(answered?(isCorrect?" isCorrect":chosen===ci?" isWrong":""):"")} onClick={()=>answer(qi,ci)}>{ch[uk?0:1]}{answered&&isCorrect?<CheckCircle2 size={16}/>:null}</button>})}</div>
     {answers[qi]!==undefined&&<p className={answers[qi]===q.correct?"lesenFeedback good":"lesenFeedback"} role="status">{answers[qi]===q.correct?labels.correct:labels.wrong}</p>}
    </div>)}
    {score!==null&&<div className="lesenResult" role="status">
      <StrudliMascot pose="success"/>
      <div><h3>{labels.complete}</h3><p>{labels.result}: <b>{score} / {story.questions.length}</b></p></div>
      <div className="lesenResultActions"><button type="button" onClick={()=>setAnswers({})}><RotateCcw size={17}/>{labels.repeat}</button><button type="button" onClick={backToList}>{labels.back}<ArrowRight size={17}/></button>{nextStory&&<button type="button" onClick={()=>openStory(nextStory)}>{labels.next}<ArrowRight size={17}/></button>}</div>
    </div>}
   </section>
  </>}
 </section>;
}
