import {useEffect,useRef,useState} from "react";
import {ArrowRight,Volume2,X} from "lucide-react";
import type {UILang} from "./i18n";
import type {Mode} from "./practice";
import "./strudli-section-help.css";
type Line={uk:string;en:string};
type Help={title:Line;steps:readonly Line[];example:string};
const guides:Record<string,Help>={
 section:{title:{uk:"Як обирати теми",en:"Choosing a topic"},steps:[
  {uk:"Обери один із розділів: їжа, дім, природа та інші.",en:"Choose a section such as food, home or nature."},
  {uk:"Відкрий підтему й обери набір слів. Можна увімкнути додаткові слова.",en:"Open a subtopic and choose a word set. Extra vocabulary is optional."},
  {uk:"На картці відповідай і слухай вимову. Після відповіді натискай «Далі».",en:"Answer on each card, listen to the pronunciation and tap Next."}
 ],example:"der Apfel"},
 game:{title:{uk:"Як працюють картки",en:"How word cards work"},steps:[
  {uk:"Подивись на зображення та німецьке слово. Для іменників обери der, die або das.",en:"Look at the picture and the word. For nouns, choose der, die or das."},
  {uk:"Після відповіді побачиш переклад і приклад. Натисни динамік, щоб послухати.",en:"After answering, see the meaning and an example. Tap the speaker to listen."},
  {uk:"Кожна правильна відповідь запалює вогник. Три вогники — слово засвоєне.",en:"Each correct answer lights a flame. Three flames mean the word is mastered."}
 ],example:"das Wasser"},
 dictionary:{title:{uk:"Твій словник",en:"Your dictionary"},steps:[
  {uk:"Шукай потрібне слово або фільтруй слова за темою.",en:"Search for a word or filter by topic."},
  {uk:"Відкрий картку: там є артикль, переклад, приклад і вимова.",en:"Open a word for its article, translation, example and pronunciation."},
  {uk:"Додавай потрібні слова сердечком до «Обраного».",en:"Tap the heart to save useful words to Favorites."}
 ],example:"die Wohnung"},
 search:{title:{uk:"Пошук слів",en:"Find a word"},steps:[
  {uk:"Введи слово німецькою, українською або англійською.",en:"Type a word in German, Ukrainian or English."},
  {uk:"Відкрий результат, щоб побачити приклад і почути вимову.",en:"Open a result to see an example and hear it."},
  {uk:"Збережи цікаве слово сердечком, щоб повернутися до нього.",en:"Save a useful word with the heart for later."}
 ],example:"Guten Morgen"},
 sentences:{title:{uk:"Речення з прикладами",en:"Example sentences"},steps:[
  {uk:"Тут можна побачити, як німецькі слова працюють у живих реченнях.",en:"See how German words work in natural example sentences."},
  {uk:"Натисни динамік біля речення й повтори його вголос.",en:"Tap the speaker next to a sentence and repeat it aloud."},
  {uk:"Відкрий слово, щоб переглянути його переклад і зберегти.",en:"Open a word for its meaning and save it if useful."}
 ],example:"Ich lerne Deutsch."},
 favorites:{title:{uk:"Твої обрані слова",en:"Your saved words"},steps:[
  {uk:"Натискай сердечко на словах, які хочеш повторювати.",en:"Tap the heart on words you want to practice."},
  {uk:"Тут усі збережені слова зібрані в одному місці.",en:"All your saved words are collected here."},
  {uk:"Коли збережеш кілька, зможеш запустити їхнє повторення.",en:"Once you have saved a few, you can start a review round."}
 ],example:"der Schlüssel"},
 ask:{title:{uk:"Запитай Strudli",en:"Ask Strudli"},steps:[
  {uk:"Встав або напиши німецьке речення — з листа, оголошення чи повідомлення.",en:"Paste or type a German sentence from a letter, a sign or a message."},
  {uk:"Натисни «Пояснити»: Strudli дасть переклад, ключові слова та граматику.",en:"Tap Explain: Strudli gives the translation, key words and grammar."},
  {uk:"Strudli може помилятися — важливі деталі офіційних листів уточнюй в установі.",en:"Strudli can make mistakes: check important details of official letters with the office."}
 ],example:"Bitte bringen Sie Ihren Ausweis mit."},
 lesen:{title:{uk:"Історії зі Strudli",en:"Stories with Strudli"},steps:[
  {uk:"Угорі — кіноказки: мальовані сцени, голос оповідача й субтитри. Нижче — короткі історії A0–A1 для читання.",en:"At the top: cinematic tales with painted scenes, a narrator and subtitles. Below: short A0–A1 stories to read."},
  {uk:"Натисни незнайоме слово — відкриється переклад і вимова.",en:"Tap an unfamiliar word for its meaning and pronunciation."},
  {uk:"Можна слухати всю історію, а наприкінці відповісти на три запитання.",en:"You can hear the full story and then answer three questions."}
 ],example:"Ein neuer Morgen"},
 audio:{title:{uk:"Слухай і повторюй",en:"Listen and repeat"},steps:[
  {uk:"Увімкни коротку німецьку фразу та уважно послухай.",en:"Play a short German phrase and listen closely."},
  {uk:"Повтори фразу вголос. Якщо потрібно — прослухай ще раз.",en:"Repeat it aloud. Replay as many times as you need."},
  {uk:"Гортай фрази та спробуй вимовити наступну без підказки.",en:"Move through the phrases and try the next one on your own."}
 ],example:"Guten Morgen!"},
 practice:{title:{uk:"Грай і тренуйся",en:"Play and practice"},steps:[
  {uk:"Спочатку обери формат: короткий квіз або повторення до засвоєння.",en:"First choose a format: a short quiz or practice until mastered."},
  {uk:"Потім обери гру: фрази, діалоги, слухання, речення, дієслова чи відмінки.",en:"Then choose phrases, dialogues, listening, sentence-building, verbs or cases."},
  {uk:"Після відповіді Strudli покаже підказку. Натискай «Далі», коли будеш готовий.",en:"After answering, Strudli gives a hint. Tap Next when you are ready."}
 ],example:"du bist"},
 "practice-verbs":{title:{uk:"Дієслова",en:"Verb practice"},steps:[
  {uk:"Прочитай займенник та знайди правильну форму дієслова.",en:"Read the pronoun and find the correct form of the verb."},
  {uk:"Можна обрати готову відповідь або вписати форму самостійно.",en:"Choose an answer or type the verb form yourself."},
  {uk:"Правильна форма з’явиться прямо в реченні. Спробуй повторити її вголос.",en:"The correct form appears in the sentence. Try saying it aloud."}
 ],example:"du bist"},
 "practice-cases":{title:{uk:"Відмінки",en:"Practice cases"},steps:[
  {uk:"Прочитай повне речення і зверни увагу на прийменник або дієслово.",en:"Read the sentence and notice its preposition or verb."},
  {uk:"Обери потрібний артикль — Akkusativ, Dativ та інші відмінки.",en:"Choose the correct article in accusative, dative and other cases."},
  {uk:"Після відповіді побачиш повне речення й коротке правило.",en:"After answering, see the complete sentence and a brief rule."}
 ],example:"mit dem Bus"},
 "practice-dialogues":{title:{uk:"Розмовляй у ситуаціях",en:"Real-life conversations"},steps:[
  {uk:"Прочитай репліку співрозмовника — як у справжньому чаті.",en:"Read the other person's message, just like in a chat."},
  {uk:"Обери природну відповідь німецькою.",en:"Choose the natural German reply."},
  {uk:"Прослухай правильну репліку та уяви, що відповідаєш сам.",en:"Listen to the correct reply and imagine saying it yourself."}
 ],example:"Wie geht es Ihnen?"},
 "practice-listening":{title:{uk:"Аудіювання",en:"Listening practice"},steps:[
  {uk:"Натисни «Прослухати» — спочатку слухай, не дивлячись на варіанти.",en:"Tap Listen; first focus on the sound, not the choices."},
  {uk:"Обери правильний переклад почутого слова.",en:"Choose the correct meaning of the word you heard."},
  {uk:"Повтори вголос і прослухай слово ще раз.",en:"Say it aloud and replay the word if you want."}
 ],example:"Guten Tag!"},
 "practice-phrases":{title:{uk:"Що сказати німецькою?",en:"What would you say in German?"},steps:[
  {uk:"Прочитай повсякденну ситуацію українською.",en:"Read the everyday situation in English."},
  {uk:"Обери точну німецьку фразу серед трьох варіантів.",en:"Choose the matching German expression from three options."},
  {uk:"Послухай правильний вислів уголос і спробуй вжити його в житті.",en:"Listen to the correct expression and try using it in real life."}
 ],example:"Können Sie bitte langsamer sprechen?"},
 "practice-sentence":{title:{uk:"Збери речення",en:"Build a sentence"},steps:[
  {uk:"Подивись на переклад — тобі треба скласти німецьке речення.",en:"Look at the translation; build its German sentence."},
  {uk:"Натискай плитки по черзі. Помилився — прибери слово й спробуй знову.",en:"Tap the tiles in order. Tap a chosen word to remove it."},
  {uk:"Перевір речення та запам’ятай, на якому місці стоїть дієслово.",en:"Check the sentence and notice where the verb belongs."}
 ],example:"Ich lerne Deutsch."},
 backup:{title:{uk:"Твій прогрес",en:"Your progress"},steps:[
  {uk:"Тут видно сьогоднішні відповіді, навчальні дні та слова для повторення.",en:"See today's answers, learning streak and words for review."},
  {uk:"Змінюй денну ціль і повторюй слова, коли вони з’являться в списку.",en:"Adjust your daily goal and review words when they're due."},
  {uk:"У резервній копії можна зберегти прогрес файлом JSON.",en:"Export a JSON backup to keep your progress safe."}
 ],example:"Jeden Tag ein Schritt!"}
};
type Props={language:UILang;screen:string;mode?:Mode|null;sectionName?:string;onClose:()=>void;onSpeak:(text:string)=>void};
export default function StrudliSectionHelp({language,screen,mode,sectionName,onClose,onSpeak}:Props){
 const id=screen==="practice"&&mode?"practice-"+mode:screen;
 const guide=guides[id]||guides.practice;
 const [step,setStep]=useState(0);
 const panel=useRef<HTMLElement>(null);
 const closeRef=useRef(onClose);closeRef.current=onClose;
 const en=language==="en";
 useEffect(()=>{
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const old=document.body.style.overflow;document.body.style.overflow="hidden";
  panel.current?.focus();
  const handler=(e:KeyboardEvent)=>{
   if(e.key==="Escape"){e.preventDefault();closeRef.current()}
   if(e.key==="Tab"&&panel.current){
    const btn=Array.from(panel.current.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
    if(btn.length===0)return;
    const first=btn[0],last=btn[btn.length-1];
    if(e.shiftKey&&(document.activeElement===first||document.activeElement===panel.current)){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
   }
  };
  document.addEventListener("keydown",handler);
  return ()=>{document.body.style.overflow=old;document.removeEventListener("keydown",handler);if(previous?.isConnected)previous.focus()};
 },[]);
 const end=step===guide.steps.length-1;
 return <div className="strudliSectionBackdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section ref={panel} className="strudliSectionPanel" role="dialog" aria-modal="true" aria-labelledby="strudli-section-title" tabIndex={-1}>
   <div className="strudliSectionTop"><span>{en?"TIP FROM STRUDLI":"ПІДКАЗКА STRUDLI"}</span><button onClick={onClose} type="button" aria-label={en?"Close help":"Закрити інструкцію"}><X size={21}/></button></div>
   <div className="strudliSectionArt">
    <img src="/strudli/strudli-storybook-hero.webp" alt="" aria-hidden="true"/>
    <div><h2 id="strudli-section-title">{screen==="section"&&sectionName?sectionName:guide.title[language]}</h2><small>{en?"I'll show you how!":"Я покажу, як це працює!"}</small></div>
   </div>
   <div className="strudliSectionStory" key={id+"-"+step}><span>{step+1} / {guide.steps.length}</span><p>{guide.steps[step][language]}</p>
    {step===1&&<button type="button" className="strudliSectionListen" onClick={()=>onSpeak(guide.example)}><Volume2 size={18}/><span lang="de">{guide.example}</span></button>}
   </div>
   <div className="strudliSectionDots">{guide.steps.map((_,i)=><span key={i} className={i===step?"active":""}/>)}</div>
   <div className="strudliSectionActions"><button type="button" disabled={step===0} onClick={()=>setStep(i=>Math.max(0,i-1))}>{en?"Back":"Назад"}</button><button type="button" onClick={()=>end?onClose():setStep(i=>i+1)}>{end?(en?"Got it!":"Зрозуміло!"):(en?"Next":"Далі")}<ArrowRight size={18}/></button></div>
  </section>
 </div>;
}
