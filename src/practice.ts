import type{Word}from"./data";
import{wordTranslation,type UILang}from"./i18n.ts";
import {DAILY_PHRASES,PHRASE_CATEGORIES} from "./everydayPhrases";
import {EXTRA_VERBS,EXTRA_CASES,EXTRA_DIALOGUES,EXTRA_SENTENCES,ORIGINAL_VERBS_EN,ORIGINAL_CASES_EN} from "./practiceExtra";
export type Mode="verbs"|"cases"|"dialogues"|"listening"|"sentence"|"phrases";
export type Exercise={id:string;mode:Mode;tag:string;prompt:string;choices:string[];answer:string;translation:string;audio:string;note?:string;tiles?:string[]};
const verbRows=[
["gehen","ich","gehe","gehst","geht","Я йду.","Präsens"],
["gehen","du","gehst","gehe","geht","Ти йдеш.","Präsens"],
["kommen","er","kommt","komme","kommst","Він приходить.","Präsens"],
["haben","ich","habe","hat","hast","Я маю.","Präsens"],
["haben","du","hast","habe","hat","Ти маєш.","Präsens"],
["sein","ich","bin","bist","ist","Я є.","Präsens"],
["sein","du","bist","bin","ist","Ти є.","Präsens"],
["sein","wir","sind","seid","ist","Ми є.","Präsens"],
["machen","ich","mache","machst","macht","Я роблю.","Präsens"],
["lernen","du","lernst","lerne","lernt","Ти вчишся.","Präsens"],
["sprechen","er","spricht","spreche","sprichst","Він розмовляє.","Präsens"],
["essen","du","isst","esse","esst","Ти їси.","Präsens"],
["fahren","du","fährst","fahre","fährt","Ти їдеш.","Präsens"],
["lesen","er","liest","lese","lest","Він читає.","Präsens"],
["sehen","du","siehst","sehe","sieht","Ти бачиш.","Präsens"],
["können","ich","kann","kannst","könnt","Я можу.","Präsens"],
["müssen","du","musst","muss","müsst","Ти мусиш.","Präsens"],
["gehen","ich","bin gegangen","habe gegangen","bin gegeht","Я пішов / пішла.","Perfekt"],
["kommen","sie","ist gekommen","hat gekommen","ist gekommt","Вона прийшла.","Perfekt"],
["machen","ich","habe gemacht","bin gemacht","habe gemachen","Я зробив / зробила.","Perfekt"],
["essen","wir","haben gegessen","sind gegessen","haben geesst","Ми поїли.","Perfekt"],
["sehen","er","hat gesehen","ist gesehen","hat geseht","Він побачив.","Perfekt"],
["fahren","ich","bin gefahren","habe gefahrt","bin gefahrt","Я поїхав / поїхала.","Perfekt"],
["lernen","du","hast gelernt","bist gelernt","hast gelernen","Ти вивчив / вивчила.","Perfekt"]];
const caseRows=[["Nominativ","___ Mann arbeitet heute.","der","die","das","Чоловік сьогодні працює.","der Mann — підмет чоловічого роду"],["Nominativ","___ Frau kommt aus Berlin.","die","der","das","Жінка приїжджає з Берліна.","die Frau — жіночий рід"],["Nominativ","___ Kind spielt im Garten.","das","der","die","Дитина грається в саду.","das Kind — середній рід"],["Nominativ","___ Zug kommt gleich.","der","die","das","Потяг скоро прибуде.","der Zug — чоловічий рід"],["Nominativ","___ Wohnung ist hell.","die","das","der","Квартира світла.","die Wohnung — жіночий рід"],["Akkusativ","Ich sehe ___ Hund.","den","der","dem","Я бачу собаку.","sehen + Akkusativ: der → den"],["Akkusativ","Ich kaufe ___ Apfel.","den","dem","der","Я купую яблуко.","kaufen + Akkusativ: den Apfel"],["Akkusativ","Ich brauche ___ Termin.","einen","einem","ein","Мені потрібен запис.","brauchen + Akkusativ: einen Termin"],["Akkusativ","Ich trinke ___ Wasser.","das","dem","der","Я п'ю воду.","das Wasser — середній рід"],["Akkusativ","Ich suche ___ Wohnung.","die","der","das","Я шукаю квартиру.","suchen + Akkusativ: die Wohnung"],["Dativ","Ich helfe ___ Mann.","dem","den","der","Я допомагаю чоловікові.","helfen + Dativ: dem Mann"],["Dativ","Ich danke ___ Frau.","der","die","den","Я дякую жінці.","danken + Dativ: der Frau"],["Dativ","Ich fahre mit ___ Zug.","dem","den","der","Я їду потягом.","mit завжди вимагає Dativ"],["Dativ","Ich wohne in ___ Stadt.","der","die","den","Я живу в місті.","in + місце (де?) → Dativ"],["Dativ","Ich spreche mit ___ Arzt.","dem","den","der","Я розмовляю з лікарем.","mit + Dativ"],["Genitiv","Das Auto ___ Mannes ist rot.","des","dem","den","Машина чоловіка червона.","Належність: des Mannes"],["Genitiv","Die Tasche ___ Frau ist neu.","der","die","den","Сумка жінки нова.","Належність: der Frau"],["Genitiv","Die Tür ___ Hauses ist offen.","des","dem","das","Двері будинку відчинені.","Genitiv: des Hauses"],["Genitiv","Der Name ___ Kindes ist Paul.","des","dem","das","Дитину звати Пауль.","Genitiv: des Kindes"],["Genitiv","Das Dach ___ Schule ist neu.","der","die","das","Дах школи новий.","Genitiv: der Schule"],["Nominativ","___ Kinder spielen draußen.","die","den","der","Діти граються надворі.","Plural Nominativ: die Kinder"],["Akkusativ","Ich treffe ___ Freund.","den","dem","des","Я зустрічаю друга.","treffen + Akkusativ: den Freund"],["Dativ","Sie spricht mit ___ Lehrerin.","der","die","den","Вона розмовляє з учителькою.","mit + Dativ: der Lehrerin"],["Akkusativ","Ich suche ___ Schlüssel.","den","dem","des","Я шукаю ключ.","suchen + Akkusativ: den Schlüssel"],["Dativ","Er geht zu ___ Arzt.","dem","den","des","Він іде до лікаря.","zu + Dativ: dem Arzt"],["Dativ","Ich bin bei ___ Familie.","der","die","den","Я перебуваю в родини.","bei + Dativ: der Familie"],["Akkusativ","Wir kaufen ___ Brot.","das","dem","des","Ми купуємо хліб.","Akkusativ Neutrum: das Brot"],["Genitiv","Die Farbe ___ Autos ist blau.","des","dem","das","Колір автомобіля синій.","Genitiv Neutrum: des Autos"]];
const dialogueRows=[["У пекарні","Guten Morgen! Was darf es sein?","Ich hätte gern zwei Brötchen, bitte.","Die Brötchen kosten drei Euro.","Ich zahle heute mit Karte.","Я хотів би дві булочки, будь ласка.","I would like two bread rolls, please."],["У супермаркеті","Kann ich Ihnen helfen?","Ja, wo finde ich Milch?","Die Milch kostet zwei Euro.","Die Kasse schließt um acht Uhr.","Так, де знайти молоко?","Yes, where can I find milk?"],["У Bürgerbüro","Haben Sie einen Termin?","Ja, ich habe heute einen Termin.","Mein Antrag dauert vier Wochen.","Das Formular liegt auf dem Tisch.","Так, у мене сьогодні запис.","Yes, I have an appointment today."],["У лікаря","Was fehlt Ihnen?","Ich habe seit gestern Kopfschmerzen.","Die Praxis schließt um sechs Uhr.","Das Rezept liegt auf dem Tisch.","У мене з учора болить голова.","I have had a headache since yesterday."],["На вокзалі","Wohin möchten Sie fahren?","Nach Ulm, bitte.","Einfach, bitte.","Mit dem Regionalzug, bitte.","До Ульма, будь ласка.","To Ulm, please."],["Оренда житла","Möchten Sie die Wohnung besichtigen?","Ja, wann ist eine Besichtigung möglich?","Die Kaution beträgt zwei Monatsmieten.","Die Wohnung hat zwei Zimmer.","Так, коли можна подивитися квартиру?","Yes, when is it possible to view the apartment?"],["Співбесіда","Erzählen Sie etwas über sich.","Ich habe Finanzwesen studiert.","Wie hoch ist das Gehalt?","Wie viele Urlaubstage gibt es?","Я вивчав фінанси.","I studied finance."],["У пекарні","Möchten Sie sonst noch etwas?","Nein, danke. Das ist alles.","Die Brötchen sind frisch.","Ich zahle mit Karte.","Ні, дякую. Це все.","No, thank you. That's all."],["У супермаркеті","Brauchen Sie eine Tüte?","Ja, bitte.","Die Tüte kostet zehn Cent.","Die Kasse ist dort drüben.","Так, будь ласка.","Yes, please."],["На вокзалі","Einfach oder hin und zurück?","Hin und zurück, bitte.","Der Zug fährt in zehn Minuten.","Ich brauche eine Fahrkarte für morgen.","Туди й назад, будь ласка.","A return ticket, please."],["У лікаря","Seit wann haben Sie die Beschwerden?","Seit drei Tagen.","Ich habe starke Kopfschmerzen.","Die Tabletten liegen zu Hause.","Уже три дні.","For three days."],["Оренда житла","Wie hoch sind die Nebenkosten?","Die Nebenkosten betragen 150 Euro im Monat.","Die Kaution beträgt zwei Monatsmieten.","Die Wohnung hat einen Balkon.","Комунальні витрати становлять 150 євро на місяць.","The utilities cost 150 euros per month."],["У кафе","Was möchten Sie trinken?","Einen Tee, bitte.","Der Tee kostet drei Euro.","Das Café öffnet um sieben Uhr.","Чай, будь ласка.","A tea, please."],["У кафе","Möchten Sie Zucker?","Nein, danke, ohne Zucker.","Der Kaffee ist sehr heiß.","Das kostet zwei Euro.","Ні, дякую, без цукру.","No, thank you, without sugar."],["У лікаря","Sind Sie gegen etwas allergisch?","Ja, gegen Penicillin.","Ich habe morgen einen Termin.","Das Rezept liegt auf dem Tisch.","Так, у мене алергія на пеніцилін.","Yes, I am allergic to penicillin."],["В аптеці","Haben Sie ein Rezept?","Ja, hier ist mein Rezept.","Nehmen Sie es zweimal täglich.","Die Tabletten kosten zehn Euro.","Так, ось мій рецепт.","Yes, here is my prescription."],["На пошті","Wohin möchten Sie das Paket schicken?","Nach Tunesien, bitte.","Das Paket wiegt zwei Kilogramm.","Ich brauche eine Briefmarke.","До Тунісу, будь ласка.","To Tunisia, please."],["На вулиці","Entschuldigung, wo ist die Haltestelle?","Gehen Sie geradeaus und dann links.","Der Bus fährt um neun Uhr.","Ich brauche ein Ticket.","Ідіть прямо, потім ліворуч.","Go straight ahead and then turn left."],["У Bürgerbüro","Welche Unterlagen haben Sie dabei?","Meinen Pass und das Antragsformular.","Ich habe einen Termin um zehn Uhr.","Der Antrag dauert vier Wochen.","Паспорт і заяву.","My passport and the application form."],["У готелі","Auf welchen Namen haben Sie gebucht?","Auf den Namen Müller.","Für zwei Nächte, bitte.","Das Zimmer ist im dritten Stock.","На прізвище Мюллер.","Under the name Müller."],["У ресторані","Möchten Sie die Rechnung?","Ja, bitte. Wir möchten bezahlen.","Ein Wasser ohne Kohlensäure, bitte.","Der Tisch ist reserviert.","Так, будь ласка. Ми хочемо розрахуватися.","Yes, please. We'd like to pay."],["На курсі","Wann beginnt der Unterricht?","Um neun Uhr morgens.","Im Raum zweihundertvier.","Der Unterricht dauert zwei Stunden.","О дев’ятій ранку.","At nine in the morning."],["По телефону","Könnten Sie Ihren Namen bitte buchstabieren?","Ja, M-U-E-L-L-E-R.","Meine Telefonnummer beginnt mit null eins.","Ich wohne in der Stadtmitte.","Так, М-У-Е-Л-Л-Е-Р.","Yes, M-U-E-L-L-E-R."],["Оренда житла","Wann kann ich einziehen?","Ab dem ersten Dezember.","Die Miete beträgt achthundert Euro.","Die Wohnung hat zwei Zimmer.","З першого грудня.","From the first of December."]];
const shuffled=(a:string[])=>{const b=[...new Set(a)];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
/** 12 hand-authored A1 word-order tasks; word-token selection works by index,
 * so repeated words are also safe, with no fragile drag-and-drop on phones. */
const sentenceRows=[
 {de:"Ich lerne jeden Tag Deutsch.",uk:"Я щодня вивчаю німецьку.",en:"I learn German every day.",tipUk:"Підмет → дієслово → обставини → додаток.",tipEn:"Subject → verb → time → object."},
 {de:"Wir fahren morgen nach Berlin.",uk:"Ми завтра їдемо до Берліна.",en:"We are going to Berlin tomorrow.",tipUk:"Дієслово у звичайному реченні стоїть на другому місці.",tipEn:"In a main clause the conjugated verb is in position two."},
 {de:"Der Apfel ist rot.",uk:"Яблуко червоне.",en:"The apple is red.",tipUk:"Підмет der Apfel, потім ist.",tipEn:"Subject der Apfel, followed by ist."},
 {de:"Ich hätte gern einen Kaffee.",uk:"Я хотів би каву.",en:"I would like a coffee.",tipUk:"Ввічливе замовлення: ich hätte gern.",tipEn:"Polite ordering: ich hätte gern."},
 {de:"Meine Wohnung ist sehr hell.",uk:"Моя квартира дуже світла.",en:"My apartment is very bright.",tipUk:"Прикметник після sein: ist sehr hell.",tipEn:"Adjective after sein: ist sehr hell."},
 {de:"Der Zug kommt um acht Uhr.",uk:"Потяг прибуває о восьмій.",en:"The train arrives at eight.",tipUk:"Um acht Uhr — точний час.",tipEn:"Um acht Uhr — an exact clock time."},
 {de:"Kann ich mit Karte bezahlen?",uk:"Чи можу я розрахуватися карткою?",en:"Can I pay by card?",tipUk:"У питанні без питального слова дієслово стоїть першим.",tipEn:"In a yes/no question the verb comes first."},
 {de:"Ich habe heute einen Termin.",uk:"Сьогодні в мене є запис.",en:"I have an appointment today.",tipUk:"Ich habe — дієслово стоїть другим.",tipEn:"Ich habe — the verb takes second position."},
 {de:"Sie kauft Brot im Supermarkt.",uk:"Вона купує хліб у супермаркеті.",en:"She buys bread at the supermarket.",tipUk:"Sie kauft — третя особа однини.",tipEn:"Sie kauft — third-person singular."},
 {de:"Ich fahre mit dem Bus.",uk:"Я їду автобусом.",en:"I travel by bus.",tipUk:"Після mit використовується Dativ: dem Bus.",tipEn:"Mit takes the dative: dem Bus."},
 {de:"Wir gehen am Wochenende spazieren.",uk:"Ми гуляємо на вихідних.",en:"We go for a walk at the weekend.",tipUk:"Spazieren gehen — поширений вираз, spazieren наприкінці.",tipEn:"Spazieren gehen is a common phrase; spazieren comes last."},
 {de:"Wo finde ich den Bahnhof?",uk:"Де я можу знайти вокзал?",en:"Where can I find the station?",tipUk:"Після Wo дієслово finde, потім ich.",tipEn:"After Wo comes the verb finde, then ich."}
];
export function exercises(mode:Mode,words:Word[],lang:UILang="uk"):Exercise[]{
 if(mode==="verbs")return [...verbRows,...EXTRA_VERBS].map((r,i)=>({id:"v"+i,mode,tag:r[6]+" · "+r[0],prompt:r[1]+" ___",choices:shuffled([r[2],r[3],r[4]]),answer:r[2],translation:lang==="en"?(r[7]||ORIGINAL_VERBS_EN[i]||r[5]):r[5],audio:r[1]+" "+r[2]}));
 if(mode==="cases")return [...caseRows,...EXTRA_CASES].map((r,i)=>({id:"c"+i,mode,tag:r[0],prompt:r[1],choices:shuffled([r[2],r[3],r[4]]),answer:r[2],translation:lang==="en"?(r[7]||ORIGINAL_CASES_EN[i]||r[5]):r[5],note:r[6],audio:r[1].replace("___",r[2])}));
 if(mode==="dialogues")return [...dialogueRows,...EXTRA_DIALOGUES].map((r,i)=>({id:"d"+i,mode,tag:r[0],prompt:r[1],choices:shuffled([r[2],r[3],r[4]]),answer:r[2],translation:lang==="en"?(r[6]||r[5]):r[5],audio:r[1]}));
 if(mode==="sentence")return [...sentenceRows,...EXTRA_SENTENCES].map((r,i)=>({id:"s"+i,mode,tag:"WORTSTELLUNG · A1–A2",prompt:lang==="uk"?"Склади речення з цих слів":"Put the words in order",choices:[],tiles:r.de.split(" "),answer:r.de,translation:lang==="uk"?r.uk:r.en,note:lang==="uk"?r.tipUk:r.tipEn,audio:r.de}));
 // Real-life language: choose exactly what to say in a concrete situation.
 if(mode==="phrases")return DAILY_PHRASES.map((p,i)=>{
  const peers=DAILY_PHRASES.filter(x=>x.category===p.category&&x.id!==p.id);
  const others=[peers[(i*3+2)%peers.length],peers[(i*3+5)%peers.length]];
  const label=PHRASE_CATEGORIES.find(c=>c.id===p.category);
  return {id:"ph-"+p.id,mode,tag:(label?(lang==="uk"?label.uk:label.en):"Alltag")+" · "+p.level,
   prompt:lang==="uk"?"Як сказати: «"+p.uk+"»?":"How do you say: “"+p.en+"”?",
   choices:shuffled([p.de,...others.map(x=>x.de)]),answer:p.de,translation:lang==="uk"?p.uk:p.en,audio:p.de};
 });
 // Listening now mixes natural daily phrases with individual vocabulary words.
 const speech=DAILY_PHRASES.map((p,i)=>{
  const peers=DAILY_PHRASES.filter(x=>x.category===p.category&&x.id!==p.id);
  const others=[peers[(i+1)%peers.length],peers[(i+5)%peers.length]];
  const meaning=(q:typeof p)=>lang==="en"?q.en:q.uk;
  return {id:"lp-"+p.id,mode,tag:"HÖREN · "+p.level,prompt:lang==="uk"?"🔊 Послухай фразу":"🔊 Listen to the phrase",
   choices:shuffled([meaning(p),...others.map(meaning)]),answer:meaning(p),translation:p.de,audio:p.de};
 });
 const selectedWords=words.filter((_,i)=>i%12===0);
 return [...speech,...selectedWords.map((w,i)=>{
   const candidates=words.filter(x=>x.id!==w.id&&wordTranslation(x,lang)!==wordTranslation(w,lang));
   const picked=[wordTranslation(w,lang)],used=new Set(picked);
   const start=(i*7+3)%candidates.length;
   for(let j=0;j<candidates.length&&picked.length<3;j++){
    const option=wordTranslation(candidates[(start+j)%candidates.length],lang);
    if(!used.has(option)){used.add(option);picked.push(option)}
   }
   const choices=shuffled(picked);
   return {id:"l"+w.id,mode,tag:"HÖREN · A1",prompt:lang==="en"?"🔊 Listen to the word":"🔊 Прослухай слово",choices,answer:wordTranslation(w,lang),translation:w.de,audio:w.de};
 })];
}
