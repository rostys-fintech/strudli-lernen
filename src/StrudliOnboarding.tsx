import {useEffect,useRef,useState} from "react";
import {ArrowRight,BookOpen,Check,GraduationCap,Headphones,Heart,MapPin,MessageCircle,Play,Volume2,BookText,Sparkles,Puzzle} from "lucide-react";
import type {UILang} from "./i18n";
import "./strudli-onboarding-2026.css";

type TourVisual="welcome"|"words"|"reading"|"audio"|"practice"|"progress"|"ready";
type TourStep={visual:TourVisual;title:{uk:string;en:string};body:{uk:string;en:string}};
const TOUR_STEPS:ReadonlyArray<TourStep>=[
 {visual:"welcome",title:{uk:"Привіт! Я Strudli!",en:"Hi! I'm Strudli!"},body:{uk:"Я покажу, як вивчати німецьку у твоєму темпі. На головній сторінці обирай Слова, Читання, Речення чи Обране — або продовжуй навчання.",en:"I'll show you how to learn German at your own pace. Start with Words, Reading, Sentences or Favorites—or continue learning from home."}},
 {visual:"words",title:{uk:"Слова, фото та артиклі",en:"Words, pictures and articles"},body:{uk:"Обери одну з 10 тем. На картках для іменників шукай der, die або das, для інших слів — правильний переклад. Потім слухай вимову та речення і натискай «Далі».",en:"Choose from 10 sections. On word cards, pick der, die or das for nouns, or the correct meaning for other words. Then listen to the pronunciation and example sentence before tapping Next."}},
 {visual:"reading",title:{uk:"Читай історії з Lesen",en:"Read stories with Lesen"},body:{uk:"Вибери коротку історію. Натискай на слова, щоб дізнатися переклад і вимову; можеш увімкнути озвучення всієї історії, а в кінці — відповісти на запитання.",en:"Choose a short story. Tap a word for its meaning and pronunciation, listen to the full narration, then answer a few questions about what you read."}},
 {visual:"audio",title:{uk:"Слухай і повторюй",en:"Listen and repeat"},body:{uk:"У розділі «Аудіо» слухай короткі німецькі фрази, повторюй уголос і переходь між ними. Натисни на динамік у прикладі, щоб спробувати.",en:"In Audio, listen to short German phrases, repeat them aloud and move between phrases. Tap the speaker in this preview to try it."}},
 {visual:"practice",title:{uk:"Шість способів практики",en:"Six ways to practice"},body:{uk:"Спробуй шість ігор: живі фрази, діалоги, аудіювання, складання речень, дієслова й відмінки. У короткому квізі є 8 запитань, а в тренуванні повторюй завдання до трьох вогників. Strudli підкаже, якщо треба.",en:"Try six games: useful phrases, dialogues, listening, sentence-building, verbs and cases. Quick quizzes have eight questions; in mastery training, repeat tasks until you collect three flames. Strudli can give you hints."}},
 {visual:"progress",title:{uk:"Зберігай і відстежуй",en:"Save words and see your progress"},body:{uk:"Зберігай корисні слова сердечком в «Обране». У «Прогресі» бачиш свою денну ціль, навчальні дні й слова для повторення.",en:"Save useful words with the heart in Favorites. Progress shows your daily goal, learning streak and words ready for review."}},
 {visual:"ready",title:{uk:"Готово! Вирушаймо!",en:"You're ready to begin!"},body:{uk:"Обери тему або відкрий практику. Я допомагатиму в навчанні короткими підказками. А цей тур завжди можна відкрити знову, натиснувши на великого Strudli на головному екрані.",en:"Choose a topic or open Practice. I'll help you along the way with short tips. To see this tour again, tap the big Strudli on the home screen."}}
];

type Props={
 language:UILang;
 onClose:()=>void;
 onTopics:()=>void;
 onPractice:()=>void;
 onSpeak:(text:string)=>void;
 todayCorrect:number;
 dailyGoal:number;
 favoritesCount:number;
};

export default function StrudliOnboarding({language,onClose,onTopics,onPractice,onSpeak,todayCorrect,dailyGoal,favoritesCount}:Props){
 const [step,setStep]=useState(0);
 const [wordOpened,setWordOpened]=useState(false);
 const dialog=useRef<HTMLElement>(null);
 const onCloseRef=useRef(onClose);
 onCloseRef.current=onClose;
 const uk=language==="uk";
 const item=TOUR_STEPS[step];
 const finish=step===TOUR_STEPS.length-1;
 const goalRatio=Math.max(0,Math.min(100,(todayCorrect/Math.max(1,dailyGoal))*100));
 const advance=(direction:number)=>{
  setWordOpened(false);
  setStep(i=>Math.max(0,Math.min(TOUR_STEPS.length-1,i+direction)));
 };
 useEffect(()=>{
  const previousFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const oldOverflow=document.body.style.overflow;
  document.body.style.overflow="hidden";
  dialog.current?.focus();
  const handleKey=(e:KeyboardEvent)=>{
   if(e.key==="Escape"){e.preventDefault();onCloseRef.current();return;}
   if(e.key==="Tab"&&dialog.current){
    const controls=Array.from(dialog.current.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));
    const first=controls[0],last=controls[controls.length-1];
    if(!first||!last)return;
    if(e.shiftKey&&(document.activeElement===first||document.activeElement===dialog.current)){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===dialog.current)){e.preventDefault();first.focus();}
   }
  };
  document.addEventListener("keydown",handleKey);
  return ()=>{document.body.style.overflow=oldOverflow;document.removeEventListener("keydown",handleKey);if(previousFocus?.isConnected)previousFocus.focus()};
 },[]);

 return <div className="strudliTourBackdrop">
  <section className="strudliTourCard strudliTourCard--v2" role="dialog" aria-modal="true" aria-labelledby="strudli-tour-title" aria-describedby="strudli-tour-desc" ref={dialog} tabIndex={-1}>
   <div className="strudliTourTop">
    <img className="strudliTourWordmark" src="/strudli/strudli-wordmark-transparent.webp" alt="Strudli Lernen"/>
    <button type="button" className="strudliTourSkip" onClick={onClose} aria-label={uk?"Закрити знайомство":"Close introduction"}>{uk?"Закрити":"Close"} ×</button>
   </div>
   <div className="strudliTourStepLabel">{uk?"КРОК":"STEP"} {step+1} {uk?"ІЗ":"OF"} {TOUR_STEPS.length}</div>
   <div className="strudliTourIllustration strudliTourIllustration--story" data-tour-visual={item.visual}>
    <div className="strudliTourLandscape" aria-hidden="true"/>
    <img className="strudliTourHeroMascot" src="/strudli/strudli-storybook-hero.webp" alt="" aria-hidden="true"/>
    <div className="strudliTourStoryPanel">
     {item.visual==="welcome"&&<div className="strudliTourFeatureBooks">
      <div><img src="/strudli/icon-books.svg" alt=""/><strong>{uk?"Слова":"Words"}</strong></div>
      <div><img src="/strudli/icon-reading.svg" alt=""/><strong>{uk?"Читання":"Reading"}</strong></div>
      <div><img src="/strudli/icon-sentences.svg" alt=""/><strong>{uk?"Речення":"Sentences"}</strong></div>
      <div><img src="/strudli/icon-heart.svg" alt=""/><strong>{uk?"Обране":"Favorites"}</strong></div>
     </div>}
     {item.visual==="words"&&<div className="strudliTourWordDemo">
      <div className="strudliTourDemoEyebrow"><MapPin size={13}/>{uk?"Їжа та напої · A1":"Food & drink · A1"}</div>
      <strong lang="de">Apfel</strong>
      <div className="strudliTourDemoArticles" aria-label={uk?"Німецькі артиклі":"German articles"}><span className="der">der <Check size={12}/></span><span className="die">die</span><span className="das">das</span></div>
      <small lang="de">Der Apfel ist rot.</small>
     </div>}
     {item.visual==="reading"&&<div className="strudliTourReadingDemo">
      <div className="strudliTourDemoEyebrow"><BookOpen size={14}/> LESEN · A1</div>
      <p lang="de">Das ist ein <button type="button" onClick={()=>setWordOpened(open=>!open)} aria-pressed={wordOpened}>Apfel</button>.</p>
      <div className="strudliTourTranslation">{wordOpened?(uk?"Apfel — яблуко":"Apfel — apple"):(uk?"Натисни на слово":"Tap the word")}</div>
      <small><Headphones size={14}/>{uk?"Історія з озвученням":"Narrated stories"}</small>
     </div>}
     {item.visual==="audio"&&<div className="strudliTourAudioDemo">
      <div className="strudliTourDemoEyebrow"><Headphones size={14}/> A1 · AUDIO</div>
      <strong lang="de">Guten Morgen!</strong>
      <span>{uk?"Доброго ранку!":"Good morning!"}</span>
      <button type="button" onClick={()=>onSpeak("Guten Morgen!")}><Volume2 size={17}/>{uk?"Прослухати":"Listen"}</button>
     </div>}
     {item.visual==="practice"&&<div className="strudliTourPracticeTiles">
      <div><Sparkles size={19}/><strong>{uk?"Дієслова":"Verbs"}</strong></div>
      <div><BookText size={19}/><strong>{uk?"Відмінки":"Cases"}</strong></div>
      <div><MessageCircle size={19}/><strong>{uk?"Діалоги":"Dialogues"}</strong></div>
      <div><Headphones size={19}/><strong>{uk?"Аудіювання":"Listening"}</strong></div>
      <div className="strudliTourPracticeExtra"><Puzzle size={17}/><strong>{uk?"Речення та фрази":"Sentences & phrases"}</strong></div>
     </div>}
     {item.visual==="progress"&&<div className="strudliTourProgressDemo">
      <div className="strudliTourDemoEyebrow"><GraduationCap size={14}/>{uk?"Твій прогрес":"Your progress"}</div>
      <div className="strudliTourProgressNums"><strong>{todayCorrect}<small> / {dailyGoal}</small></strong><span>{uk?"сьогодні":"today"}</span></div>
      <div className="strudliTourProgressTrack"><span style={{width:goalRatio+"%"}}/></div>
      <small><Heart size={14} fill="currentColor"/>{favoritesCount} {uk?"в обраному":"saved words"}</small>
     </div>}
     {item.visual==="ready"&&<div className="strudliTourReadyDemo">
      <div><Check size={28}/></div>
      <strong>{uk?"Вперед до німецької!":"Your German journey starts here!"}</strong>
      <span>{uk?"Твій темп. Твій наступний крок.":"Your pace. Your next step."}</span>
     </div>}
    </div>
   </div>
   <h2 id="strudli-tour-title" aria-live="polite">{item.title[language]}</h2>
   <p id="strudli-tour-desc">{item.body[language]}</p>
   <div className="strudliTourSteps" aria-label={uk?"Кроки знайомства":"Introduction steps"}>
    {TOUR_STEPS.map((_,i)=><span key={i} className={i===step?"current":i<step?"done":""} aria-current={i===step?"step":undefined} aria-label={(uk?"Крок ":"Step ")+(i+1)}/>)}
   </div>
   <div className="strudliTourFooter">
    {step>0?<button type="button" className="strudliTourSecondary" onClick={()=>advance(-1)}>{uk?"Назад":"Back"}</button>:<span/>}
    <button type="button" className="strudliTourPrimary" onClick={()=>{if(finish)onTopics();else advance(1);}}>{finish?(uk?"До тем":"Explore topics"):(uk?"Далі":"Next")}<ArrowRight size={16}/></button>
   </div>
   {finish&&<button type="button" className="strudliTourPractice" onClick={onPractice}><Play size={15}/>{uk?"Відкрити практику":"Open Practice"}</button>}
  </section>
 </div>;
}
