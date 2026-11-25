import {useMemo,useState} from "react";
import {ArrowLeft,Bookmark,Heart,Search,Volume2} from "lucide-react";
import type {Word,Topic} from "./data";
import {cardExampleFor} from "./cardExamples";
import {tr,wordTranslation,topicLabel,type UILang} from "./i18n";
import StrudliGuide from "./StrudliGuide";
export const EXAMPLES:Record<string,[string,string][]> = {
Apfel:[["Ich esse einen Apfel.","Я їм яблуко."],["Der Apfel ist rot.","Яблуко червоне."]],
Kaffee:[["Ich trinke Kaffee.","Я п'ю каву."],["Der Kaffee ist heiß.","Кава гаряча."]],
Brot:[["Das Brot ist frisch.","Хліб свіжий."]],
Wasser:[["Ich trinke Wasser.","Я п'ю воду."]],
Milch:[["Die Milch ist kalt.","Молоко холодне."]],
Ei:[["Ich esse ein Ei.","Я їм яйце."]],
Butter:[["Ich brauche Butter.","Мені потрібне масло."]],
Katze:[["Die Katze schläft.","Кішка спить."]],
Hund:[["Der Hund spielt.","Собака грається."]],
Bus:[["Ich fahre mit dem Bus.","Я їду автобусом."]],
Zug:[["Der Zug kommt um acht Uhr.","Потяг прибуває о восьмій годині."]],
Bahnhof:[["Wo ist der Bahnhof?","Де вокзал?"]],
Apotheke:[["Wo ist die Apotheke?","Де аптека?"]],
Schlüssel:[["Wo ist mein Schlüssel?","Де мій ключ?"]],
Arzt:[["Ich gehe zum Arzt.","Я йду до лікаря."]],
Ärztin:[["Die Ärztin hilft mir.","Лікарка допомагає мені."]],
Wohnung:[["Ich suche eine Wohnung.","Я шукаю квартиру."]],
Tisch:[["Das Buch liegt auf dem Tisch.","Книжка лежить на столі."]],
Auto:[["Das Auto ist neu.","Автомобіль новий."]],
Frau:[["Die Frau lernt Deutsch.","Жінка вивчає німецьку."]],
Mann:[["Der Mann spricht Deutsch.","Чоловік розмовляє німецькою."]],
Kind:[["Das Kind spielt.","Дитина грається."]],
Schule:[["Die Schule beginnt um acht Uhr.","Школа починається о восьмій."]],
Tee:[["Ich hätte gern einen Tee.","Я хотів би чаю."]],
Suppe:[["Die Suppe ist warm.","Суп теплий."]],
Banane:[["Die Banane ist gelb.","Банан жовтий."]],
Telefon:[["Mein Telefon ist kaputt.","Мій телефон зламаний."]]
};
type Mode="dictionary"|"favorites"|"search"|"sentences";
type Props={language:UILang;mode:Mode;words:Word[];topics:Topic[];favorites:string[];onToggleFavorite:(id:string)=>void;onPracticeFavorites:()=>void;onBack:()=>void;speak:(text:string,article?:string)=>Promise<void>};
export default function Library({language,mode,words,topics,favorites,onToggleFavorite,onPracticeFavorites,onBack,speak}:Props){
const t=(key:string)=>tr(key,language);
const[search,setSearch]=useState("");
const[topic,setTopic]=useState("all");
const[selected,setSelected]=useState<Word|null>(null);
const[onlySaved,setOnlySaved]=useState(false);
const[visibleCount,setVisibleCount]=useState(72);
const matched=useMemo(()=>words.filter(w=>(topic==="all"||w.topic===topic)&&(!(onlySaved||mode==="favorites")||favorites.includes(w.id))&&(!search.trim()||[w.de,w.uk,wordTranslation(w,language),w.gender].join(" ").toLowerCase().includes(search.toLowerCase().trim()))),[words,topic,onlySaved,mode,favorites,search,language]);
const toggle=onToggleFavorite;
// The game and dictionary deliberately use the same stable-ID resolver.
// Unlike the legacy 27-word EXAMPLES list, this covers all 1,177 cards.
const exampleLookup=useMemo(()=>new Map(words.map(w=>[w.id,cardExampleFor(w,language)])),[words,language]);
const selectedExample=selected?exampleLookup.get(selected.id):null;
const shown=matched;
const visibleWords=shown.slice(0,visibleCount);
return <section className="library"><div className="libraryTop"><button onClick={selected?()=>setSelected(null):onBack} aria-label="Назад"><ArrowLeft size={20}/></button><div><strong>{mode==="sentences"?t("Речення"):mode==="search"?t("Пошук слів"):mode==="favorites"?t("Обране"):t("Словник")}</strong><small>Strudli Lernen · Deutsch lernen</small></div></div>
{selected?<article className="wordDetail"><div className="detailPhoto">{selected.photo?<img src={selected.photo} alt={t("Зображення:")+selected.de} onError={e=>{e.currentTarget.replaceWith(document.createTextNode(selected.emoji))}}/>:<span>{selected.emoji}</span>}</div><div className="detailHeading"><div><h1>{selected.gender&&<span className={"article "+selected.gender}>{selected.gender}</span>} {selected.de}</h1><p>{wordTranslation(selected,language)}</p>{language==="uk"&&selected.note&&<small className="detailNote">{selected.note}</small>}</div><button onClick={()=>toggle(selected.id)} aria-label={t("Додати до вибраного")}><Heart size={23} fill={favorites.includes(selected.id)?"#F05170":"none"} color="#F05170"/></button><button onClick={()=>void speak(selected.audioText||selected.de,selected.gender)} aria-label="Прослухати"><Volume2/></button></div><h2>{t("Приклади речень")}</h2>{selectedExample?<div className="sentenceRow" key={selected.id}><button onClick={()=>void speak(selectedExample.de)} aria-label={t("Озвучити речення")}><Volume2 size={19}/></button><div><strong lang="de">{selectedExample.de}</strong><small lang={language==="uk"?"uk":"en"}>{selectedExample.translation}</small></div></div>:<p className="emptyExamples">{t("Приклад недоступний.")}</p>}<button className="detailBack" onClick={()=>setSelected(null)}>← {mode==="favorites"?t("До обраного"):t("До словника")}</button></article>:<>
<p className="libraryIntro">{mode==="sentences"?t("Практичні приклади вживання слів у німецьких реченнях."):mode==="favorites"?t("Твої складні й улюблені слова з гри. Тут можна повторювати лише їх."):mode==="search"?t("Шукай слова німецькою або українською."):t("Слова, переклади, вимова й приклади. Зберігай найкорисніші слова.")}</p>{mode==="sentences"&&<StrudliGuide language={language} compact message={language==="uk"?"Натисни на динамік, щоб почути речення, або на слово, щоб відкрити його картку.":"Tap the speaker to hear a sentence, or the word to open its card."}/>} {mode==="favorites"&&<button type="button" className="favoritePractice" disabled={!favorites.some(id=>words.some(w=>w.id===id&&!w.pluralOnly))} onClick={onPracticeFavorites}>▶ {t("Тренувати обрані")} ({favorites.length})</button>}
<><label className="searchBox"><Search size={21}/><input type="search" value={search} placeholder={t("Пошук німецькою або українською...")} onChange={e=>{setSearch(e.target.value);setVisibleCount(72)}}/></label><div className="libraryFilters"><select value={topic} onChange={e=>{setTopic(e.target.value);setVisibleCount(72)}} aria-label={t("Усі теми")}><option value="all">{t("Усі теми")}</option>{topics.map(t=><option key={t.id} value={t.id}>{topicLabel(t.id,t.name,language)}</option>)}</select>{mode!=="favorites"&&<button className={onlySaved?"selected":""} onClick={()=>{setOnlySaved(x=>!x);setVisibleCount(72)}}><Bookmark size={16}/> {t("Вибрані")} ({favorites.length})</button>}</div></>
<div className="libraryCount">{shown.length} {mode==="sentences"?t("речень зі словника Strudli"):t("знайдено")}</div>{mode==="sentences"&&<div className="originalSentenceList">{visibleWords.map(w=>{const ex=exampleLookup.get(w.id);return ex?<div className="sentenceRow" key={w.id}><button onClick={()=>void speak(ex.de)} aria-label={t("Озвучити речення")}><Volume2 size={19}/></button><div><button className="sentenceWordLink" onClick={()=>setSelected(w)}><b lang="de">{w.gender?w.gender+" ":""}{w.de}</b> · {wordTranslation(w,language)}</button><strong lang="de">{ex.de}</strong><small lang={language==="uk"?"uk":"en"}>{ex.translation}</small></div></div>:null})}</div>}{mode!=="sentences"&&<div className="wordGrid">{visibleWords.map(w=><article key={w.id} className="wordTile"><button className="wordOpen" onClick={()=>setSelected(w)}><span className="wordEmoji">{w.emoji}</span><span className="wordCaption"><strong>{w.gender&&<i className={"article "+w.gender}>{w.gender}</i>} {w.de}</strong><small>{wordTranslation(w,language)}</small></span></button><button aria-label={t("Озвучити")} className="wordAudio" onClick={()=>void speak(w.audioText||w.de,w.gender)}><Volume2 size={17}/></button><button aria-label={t("Додати до вибраного")} className="wordBookmark" onClick={()=>toggle(w.id)}><Heart size={18} color="#F05170" fill={favorites.includes(w.id)?"#F05170":"none"}/></button></article>)}</div>}{visibleCount<shown.length&&<button type="button" className="libraryLoadMore" onClick={()=>setVisibleCount(n=>n+72)}>{t("Показати ще")} · {shown.length-visibleCount}</button>}{!shown.length&&(mode==="favorites"&&favorites.length===0?<StrudliGuide language={language} message={language==="uk"?"Тут поки порожньо. Натисни сердечко біля цікавого слова — і ми зможемо його повторювати!":"Nothing saved yet. Tap the heart next to a useful word and we can practice it together!"}/>:<p className="emptyExamples">{t("За цими умовами слів поки немає. Спробуй змінити фільтр.")}</p>)}</>}
</section>;
}