import {useEffect,useMemo,useRef,useState} from "react";
import {ArrowLeft,ArrowRight,AudioLines,BookText,Check,CheckCircle2,ChevronLeft,Flame,Headphones,MessageCircle,RotateCcw,Volume2,Zap,Puzzle,Keyboard,Delete} from "lucide-react";
import type {Word} from "./data";
import {createRound,remaining,rightAnswer,wrongAnswer,type Round} from "./game";
import {exercises,type Exercise,type Mode} from "./practice";
import {feedbackSound} from "./feedbackSounds";
import type {UILang} from "./i18n";
import FlameMeter from "./FlameMeter";
import StrudliGuide from "./StrudliGuide";
import Arena from "./Arena";
import {takeArenaRequest} from "./arenaRounds";
import "./practice-studio.css";
import "./practice-refine.css";

type Session="quiz"|"mastery";
const menu:{id:Mode;uk:string;en:string;descriptionUk:string;descriptionEn:string;icon:typeof Zap;accent:string;formatUk:string;formatEn:string}[]=[
 {id:"verbs",uk:"Дієслова",en:"Verbs",descriptionUk:"Präsens і Perfekt · обери форму або впиши її",descriptionEn:"Present and perfect · choose or type the verb",icon:Zap,accent:"rose",formatUk:"Квіз + введення",formatEn:"Quiz + typing"},
 {id:"cases",uk:"Відмінки",en:"Cases",descriptionUk:"Nominativ, Akkusativ, Dativ, Genitiv",descriptionEn:"Nominative, accusative, dative, genitive",icon:BookText,accent:"blue",formatUk:"Встав артикль",formatEn:"Fill the gap"},
 {id:"dialogues",uk:"Життєві діалоги",en:"Real-life dialogues",descriptionUk:"Лікар, вокзал, супермаркет, житло",descriptionEn:"Doctor, station, supermarket, housing",icon:MessageCircle,accent:"gold",formatUk:"Чат-сценарії",formatEn:"Chat scenarios"},
 {id:"listening",uk:"Аудіювання",en:"Listening",descriptionUk:"Розпізнавай слова й повсякденні фрази на слух",descriptionEn:"Recognize words and real-life phrases by ear",icon:Headphones,accent:"teal",formatUk:"Аудіоквіз",formatEn:"Listening quiz"},
 {id:"phrases",uk:"Що сказати?",en:"What would you say?",descriptionUk:"100 живих фраз із магазину, транспорту й повсякденного життя",descriptionEn:"100 useful expressions for daily life in Germany",icon:MessageCircle,accent:"rose",formatUk:"Фрази для життя",formatEn:"Everyday situations"},
 {id:"sentence",uk:"Склади речення",en:"Build sentences",descriptionUk:"Розстав слова у правильному порядку",descriptionEn:"Put the German words in the right order",icon:Puzzle,accent:"purple",formatUk:"Плитки слів",formatEn:"Word tiles"}
];
const symbols=["◆","●","▲","■"];
const shuffle=<T,>(arr:T[]):T[]=>{
 const copy=[...arr];
 for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
 return copy;
};
const normalize=(s:string)=>s.trim().replace(/\s+/g," ").toLocaleLowerCase("de-DE");
type Props={language:UILang;words:Word[];onBack:()=>void;speak:(text:string)=>Promise<void>;onModeChange?:(mode:Mode|null)=>void};

export default function Practice({language,words,onBack,speak,onModeChange}:Props){
 const en=language==="en";
 const [mode,setMode]=useState<Mode|null>(null);
 const [session,setSession]=useState<Session>("quiz");
 const [chooseStage,setChooseStage]=useState<"session"|"games">("session");
 const [cards,setCards]=useState<Exercise[]>([]);
 const [round,setRound]=useState<Round|null>(null);
 const [index,setIndex]=useState(0);
 const [answered,setAnswered]=useState(false);
 const [correct,setCorrect]=useState(false);
 const [wrong,setWrong]=useState("");
 const [failedLevel,setFailedLevel]=useState(0);
 const [shake,setShake]=useState(0);
 const [combo,setCombo]=useState(0);
 const [maxCombo,setMaxCombo]=useState(0);
 const [quizCorrect,setQuizCorrect]=useState(0);
 const [errors,setErrors]=useState(0);
 const [selectedTiles,setSelectedTiles]=useState<number[]>([]);
 const [typing,setTyping]=useState(false);
 const [typed,setTyped]=useState("");
 const [arenaStory]=useState<string|null>(takeArenaRequest);
 const [arena,setArena]=useState(()=>Boolean(arenaStory));
 const generation=useRef(0);
 const current=mode?(session==="quiz"?cards[index]:(round?.currentId?cards.find(x=>x.id===round.currentId):undefined)):undefined;
 const finished=Boolean(mode)&&(session==="quiz"?index>=cards.length:!round?.currentId);
 const flames=current?(session==="mastery"?(round?.streaks[current.id]||0):(correct?1:0)):0;
 const mastered=round?(round.pool.length-remaining(round)):0;
 const progress=session==="quiz"?(cards.length?index/cards.length:0):(round&&round.pool.length?mastered/round.pool.length:0);
 const menuItem=menu.find(m=>m.id===mode);
 const tiles=useMemo(()=>shuffle((current?.tiles||[]).map((value,i)=>({value,i}))),[current?.id]);
 const chosen=selectedTiles.map(id=>tiles.find(tile=>tile.i===id)?.value||"");
 const assembled=chosen.join(" ");
 useEffect(()=>()=>{generation.current++;window.speechSynthesis?.cancel()},[]);

 function resetFeedback(){
  setAnswered(false);setCorrect(false);setWrong("");setFailedLevel(0);setSelectedTiles([]);setTyped("");
 }
 function begin(next:Mode){
  generation.current++;window.speechSynthesis?.cancel();
  const all=shuffle(exercises(next,words,language)).slice(0,session==="quiz"?8:5);
  setCards(all);setIndex(0);setRound(session==="mastery"?createRound(all.map(x=>x.id)):null);
  setMode(next);onModeChange?.(next);setCombo(0);setMaxCombo(0);setQuizCorrect(0);setErrors(0);setTyping(false);
  resetFeedback();
 }
 function back(){
  generation.current++;window.speechSynthesis?.cancel();
  setMode(null);onModeChange?.(null);setRound(null);setCards([]);setIndex(0);setChooseStage("games");resetFeedback();
 }
 function answer(value:string){
  if(!current||answered||(!value.trim()))return;
  const isRight=normalize(value)===normalize(current.answer);
  if(!isRight){
   feedbackSound("wrong",Math.max(0,flames-1));
   setWrong(value);setShake(n=>n+1);setErrors(n=>n+1);
   setCombo(0);
   if(session==="mastery"){
    setFailedLevel(flames);
    setRound(r=>r?wrongAnswer(r):r);
    return;
   }
   setCorrect(false);setAnswered(true);
   return;
  }
  feedbackSound("correct",session==="mastery"?Math.min(3,flames+1):Math.min(3,combo+1));
  setWrong("");setAnswered(true);setCorrect(true);
  const newCombo=combo+1;setCombo(newCombo);setMaxCombo(n=>Math.max(n,newCombo));
  if(session==="quiz")setQuizCorrect(n=>n+1);
  const token=++generation.current;
  const spoken=mode==="dialogues"?current.answer:current.audio;
  // Pronunciation is triggered only after a deliberate correct answer.
  void Promise.resolve().then(()=>{if(token===generation.current)return speak(spoken);});
 }
 function next(){
  generation.current++;window.speechSynthesis?.cancel();
  if(!answered)return;
  resetFeedback();
  if(session==="quiz")setIndex(i=>i+1);
  else setRound(r=>r?rightAnswer(r):r);
 }
 function selectToken(i:number){
  if(answered)return;
  setWrong("");setSelectedTiles(previous=>previous.includes(i)?previous.filter(x=>x!==i):[...previous,i]);
 }
 const total=cards.length;
 const questionNumber=session==="quiz"?Math.min(index+1,total):Math.min(mastered+1,total);


 if(arena)return <Arena language={language} words={words} speak={speak} initialStory={arenaStory} onExit={()=>setArena(false)}/>;
 return <section className="practiceStudio" aria-label={en?"Interactive German practice":"Інтерактивна практика німецької"}>
  <header className="practiceStudioHeader">
   <button type="button" className="practiceStudioBack" onClick={mode?back:chooseStage==="games"?()=>setChooseStage("session"):onBack} aria-label={en?"Back":"Назад"}><ArrowLeft size={21}/></button>
   <div><h1>{mode?(en?menuItem?.en:menuItem?.uk):(en?"Practice":"Практика")}</h1></div>
  </header>


  {!mode?<div className="practiceStudioMenu">
    {chooseStage==="session"?<>
      <div className="practiceStudioSessionHero">
        <img src="/strudli/strudli-storybook-hero.webp" alt="" aria-hidden="true" />
        <div><h2>{en?"How do you want to play?":"Як хочеш тренуватися?"}</h2><p>{en?"Choose a format, then pick a game.":"Спочатку формат, потім гра."}</p></div>
      </div>
      <div className="practiceSessionChooser" role="group" aria-label={en?"Choose session style":"Обери формат заняття"}>
       <button type="button" onClick={()=>{setSession("quiz");setChooseStage("games")}}><Zap size={29}/><span><strong>{en?"Quick quiz":"Швидкий квіз"}</strong><small>{en?"8 questions · no timer":"8 запитань · без таймера"}</small></span><ArrowRight size={20}/></button>
       <button type="button" onClick={()=>{setSession("mastery");setChooseStage("games")}}><Flame size={29}/><span><strong>{en?"Practice until mastered":"До засвоєння"}</strong><small>{en?"5 tasks · three correct answers":"5 завдань · три вогники"}</small></span><ArrowRight size={20}/></button>
       <button type="button" className="practiceArenaLaunch" onClick={()=>setArena(true)}><Zap size={29}/><span><strong>{en?"Arena · quiz show":"Арена · гра-вікторина"}</strong><small>{en?"Articles, endings, photos, story words · 15 s":"Артиклі, закінчення, фото, слова з історій · 15 с"}</small></span><ArrowRight size={20}/></button>
      </div>
    </>:<>
      <div className="practiceStudioSelectedSession"><button type="button" onClick={()=>setChooseStage("session")}><ArrowLeft size={16}/>{en?"Change format":"Змінити формат"}</button><strong>{session==="quiz"?(en?"Quick quiz":"Швидкий квіз"):(en?"Practice until mastered":"До засвоєння")}</strong></div>
      <h2 className="practiceChooseGameTitle">{en?"Choose a game":"Обери гру"}</h2>
      <div className="practiceModeDeck">
       {menu.map(m=>{const Icon=m.icon;return <button type="button" key={m.id} className={"practiceModeCard accent-"+m.accent} onClick={()=>begin(m.id)}>
         <div className="practiceModeCardIcon"><Icon size={27}/></div>
         <div className="practiceModeCardBody"><strong>{en?m.en:m.uk}</strong><span>{en?m.descriptionEn:m.descriptionUk}</span></div>
         <ArrowRight size={22} className="practiceModeCardArrow"/>
       </button>})}
      </div>
      <StrudliGuide language={language} compact message={en?"Pick any game. I’ll help you with the answers.":"Обери гру — я підкажу під час відповідей."}/>
    </>}
  </div>:finished?<div className="practiceStudioResults" role="status">
   <img src="/strudli/strudli-storybook-hero.webp" alt="" aria-hidden="true"/>
   <span className="practiceStudioEyebrow"><CheckCircle2 size={18}/>{en?"SESSION COMPLETE":"СЕСІЮ ЗАВЕРШЕНО"}</span>
   <h2>{en?"Great work!":"Чудова робота!"}</h2>
   <p>{en?"Every practice round makes German more familiar.":"Кожен раунд допомагає впевненіше користуватися німецькою."}</p>
   <div className="practiceResultMetrics">
    <div><strong>{session==="quiz"?quizCorrect:mastered}<small> / {total}</small></strong><span>{en?"Completed":"Виконано"}</span></div>
    <div><strong>{maxCombo}</strong><span>{en?"Best streak":"Найкраща серія"}</span></div>
   </div>
   {errors>0&&<p className="practiceErrorNote">{en?`Mistakes: ${errors}. They're useful signals for what to revisit.`:`Помилок: ${errors}. Вони показують, що варто повторити.`}</p>}
   <div className="practiceResultActions"><button type="button" onClick={()=>begin(mode)}><RotateCcw size={18}/>{en?"Play again":"Зіграти ще"}</button><button type="button" onClick={back}><ArrowLeft size={18}/>{en?"Other games":"Інші ігри"}</button></div>
  </div>:current&&<div className={"practiceStudioRound practiceStudioRound--"+mode}>
   <div className="practiceStudioHud">
    <span><strong>{session==="quiz"?(en?"QUESTION":"ЗАПИТАННЯ"):(en?"MASTERING":"ОСВОЄННЯ")}</strong> {questionNumber} / {total}</span>
    <span className="practiceQuestionCount">{session==="quiz"?(en?"No timer":"Без таймера"):(en?"At your pace":"У твоєму темпі")}</span>
   </div>
   <div className="practiceStudioTrack" role="progressbar" aria-valuenow={Math.round(progress*100)} aria-valuemin={0} aria-valuemax={100} aria-label={en?"Session progress":"Прогрес сесії"}><span style={{width:(progress*100)+"%"}}/></div>
   <div className="practiceStudioQuestion">
    <div className="practiceStudioQuestionTop">
     <span>{current.tag}</span>
     {session==="mastery"&&<FlameMeter level={flames} preview={answered} wrong={Boolean(wrong)} lostLevel={failedLevel} signal={shake} variant="practice" language={language}/>}
    </div>
    {mode==="phrases"?<>
     <div className="practiceDialoguePerson"><MessageCircle size={18}/>{en?"Say it in German":"Скажи німецькою"}</div>
     <div className="practiceDialoguePrompt practicePhrasePrompt" lang={en?"en":"uk"}>{current.prompt}</div>
     <small>{en?"Find the most accurate German phrase":"Обери точний німецький вислів"}</small>
    </>:mode==="dialogues"?<>
     <div className="practiceDialoguePerson"><MessageCircle size={18}/>{en?"You are in a real conversation":"Ти в реальній розмові"}</div>
     <div className="practiceDialoguePrompt" lang="de">{current.prompt}</div>
     <small>{en?"Choose your reply":"Що ти відповіси?"}</small>
    </>:mode==="listening"?<>
     <div className="practiceListeningArt" aria-hidden="true"><AudioLines size={55}/></div>
     <h2>{en?"What did you hear?":"Що ти почув?"}</h2>
     <button type="button" className="practiceStudioListen" onClick={()=>void speak(current.audio)}><Volume2 size={20}/>{en?"Listen again":"Прослухати ще раз"}</button>
     <small>{en?"Listen and choose the meaning of the word or phrase.":"Послухай і вибери значення слова або фрази."}</small>
    </>:mode==="sentence"?<>
     <div className="practiceBuilderHeader"><Puzzle size={29}/></div>
     <h2>{en?"Build the German sentence":"Склади німецьке речення"}</h2>
     <p className="practicePromptTranslation">{current.translation}</p>
    </>:<>
     <h2 lang="de">{current.prompt.includes("___")?<>{current.prompt.slice(0,current.prompt.indexOf("___"))}<span key={answered?current.id+"-filled":current.id+"-blank"} className={answered?"practiceInlineAnswer":"practiceInlineBlank"}>{answered?current.answer:"___"}</span>{current.prompt.slice(current.prompt.indexOf("___")+3)}</>:current.prompt}</h2>
     {(mode==="cases"||mode==="verbs")&&current.translation&&<p className="practicePromptTranslation" lang={en?"en":"uk"}>{current.translation}</p>}
     {mode==="cases"&&<span className="practiceQuestionSub">{en?"Which article fits the sentence?":"Який артикль підходить у речення?"}</span>}
     {mode==="verbs"&&<span className="practiceQuestionSub">{en?"Choose the correct German verb form":"Обери правильну форму німецького дієслова"}</span>}
    </>}
   </div>

   {mode==="sentence"?<div className="practiceSentenceInteraction">
    <div className="practiceAssembled" aria-label={en?"Your assembled sentence":"Твоє складене речення"}>
     {chosen.length?selectedTiles.map(id=><button type="button" key={id} disabled={answered} onClick={()=>selectToken(id)}>{tiles.find(t=>t.i===id)?.value} <span>×</span></button>):<span className="practiceBuilderPlaceholder">{en?"Tap word tiles below in the right order":"Натискай на слова знизу в правильному порядку"}</span>}
    </div>
    <div className="practiceBuilderTiles">
     {tiles.filter(t=>!selectedTiles.includes(t.i)).map(t=><button key={t.i} type="button" disabled={answered} onClick={()=>selectToken(t.i)}>{t.value}</button>)}
    </div>
    {!answered&&<div className="practiceBuilderActions">
     <button type="button" className="practiceClear" disabled={!selectedTiles.length} onClick={()=>{setSelectedTiles([]);setWrong("");}}><Delete size={17}/>{en?"Clear":"Очистити"}</button>
     <button type="button" className="practiceCheck" disabled={chosen.length!==(current.tiles?.length||0)} onClick={()=>answer(assembled)}><Check size={18}/>{en?"Check sentence":"Перевірити"}</button>
    </div>}
   </div>:<div className={"practiceChoices practiceStudioChoices"+((mode==="dialogues"||mode==="phrases")?" practiceStudioChatChoices":"")} aria-label={en?"Answer options":"Варіанти відповіді"}>
    {!typing&&current.choices.map((choice,i)=><button type="button" key={choice} disabled={answered||(session==="mastery"&&wrong===choice)} className={"practiceChoice practiceChoice--"+i+(wrong===choice?" wrong":"")+(answered&&current.answer===choice?" right":"")} onClick={()=>answer(choice)}>
      {(mode==="dialogues"||mode==="phrases")?<span className="practiceChoiceAvatar"><MessageCircle size={16}/></span>:<span className="practiceChoiceGlyph" aria-hidden="true">{symbols[i]}</span>}
      <span className="practiceChoiceText" lang={mode==="listening"?(en?"en":"uk"):"de"}>{choice}</span>
      {answered&&current.answer===choice&&<Check size={19}/>}
     </button>)}
    {typing&&<form className="practiceTypeForm" onSubmit={e=>{e.preventDefault();answer(typed);}}>
     <label htmlFor="practiceTypedAnswer">{en?"Write the German answer":"Впиши німецьку відповідь"}</label>
     <input id="practiceTypedAnswer" value={typed} onChange={e=>setTyped(e.target.value)} autoComplete="off" autoCorrect="off" spellCheck={false} disabled={answered} placeholder={en?"Your answer":"Твоя відповідь"}/>
     <button disabled={!typed.trim()||answered} type="submit"><Check size={18}/>{en?"Check":"Перевірити"}</button>
    </form>}
    {(mode==="verbs"||mode==="cases")&&!answered&&<button type="button" className="practiceSwitchInput" onClick={()=>{setTyping(v=>!v);setWrong("");setTyped("");}}><Keyboard size={17}/>{typing?(en?"Show answer tiles":"Показати варіанти"):(en?"Challenge: type your answer":"Складніше: впиши відповідь")}</button>}
   </div>}

   {(answered||wrong)&&<div className={"practiceStudioFeedback "+(correct?"success":answered?"revealed":"retry")} role="status">
    <strong>{correct?<><CheckCircle2 size={20}/>{en?"Correct!":"Правильно!"}</>:answered?<>{en?"Here is the correct answer":"Правильна відповідь"}</>:<>{en?"Try again":"Спробуй ще раз"}</>}</strong>
    {answered&&mode!=="verbs"&&mode!=="cases"&&<div lang="de" className="practiceCorrectAnswer">{current.answer}</div>}
    {answered&&current.translation&&<p lang={en?"en":"uk"}>{current.translation}</p>}
    {(answered||wrong)&&current.note&&<small>{en&&mode!=="sentence"?"":current.note}</small>}
   </div>}
   <div className="practiceStudioBottom">
    {(answered||wrong)&&<div key={current.id+"-"+shake+"-"+answered} className={"practiceStrudliReaction "+(correct?"celebrate":answered?"reveal":"encourage")} role="status"><img src="/strudli/strudli-storybook-hero.webp" alt="" aria-hidden="true"/><div><strong>{correct?(en?"Super!":"Супер!"):(answered?(en?"You’ve learned this one!":"Тепер ти це знаєш!"):(en?"Try again!":"Спробуй ще!"))}</strong><span>{correct?(en?"That’s the right form!":"Саме так!"):mode==="cases"?(en?"Look at the case and article.":"Подивись на відмінок і артикль."):mode==="verbs"?(en?"Check the pronoun and ending.":"Перевір займенник і закінчення."):mode==="sentence"?(en?"The verb position is your clue.":"Зверни увагу на позицію дієслова."):(en?"Read or listen again.":"Спробуй ще раз послухати.")}</span></div>{correct&&<span className="practiceReactionSparkles" aria-hidden="true">✦ ✦</span>}</div>}
    {answered&&<div className="practiceNextDock"><button type="button" className="practiceNext" onClick={next}>{en?"Next":"Далі"}<ArrowRight size={22}/></button></div>}
    <button type="button" className="practiceBack" onClick={back}><ChevronLeft size={18}/>{en?"Choose another game":"До вибору вправ"}</button>
   </div>
  </div>}
 </section>;
}
