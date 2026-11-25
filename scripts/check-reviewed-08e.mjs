import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const original=read("src/data.ts");
const pos=original.indexOf("export const DEMO_WORDS:Word[]=");
const first=original.indexOf("=[",pos)+1,last=original.indexOf("];",first);
const cards=JSON.parse(original.slice(first,last+1));
assert.equal(cards.length,1177,"Original card count must remain 1,177");
const byId=new Map(cards.map(w=>[w.id,w]));
const datasets=[
 {path:"src/reviewed08eFunctionWords.ts",expected:81,byTopic:{phrases:38,questions:18,preps:25}},
 {path:"src/reviewed08eAdverbsPronouns.ts",expected:67,byTopic:{adverbs:39,pronouns:28}}
];
const entries=new Map(),deSeen=new Set(),count={};
for(const d of datasets){
 const raw=read(d.path).match(/^const rows=(.*);$/m)?.[1];
 assert.ok(raw,"Cannot read trilingual dataset "+d.path);
 const rows=JSON.parse(raw).trim().split("\n");
 assert.equal(rows.length,d.expected,"Incomplete Stage 08E batch "+d.path);
 const local={};
 for(let i=0;i<rows.length;i++){
  const parts=rows[i].split("|"),[id,de,uk,en,...extra]=parts;
  assert.ok(!extra.length&&parts.length===4&&id&&de&&uk&&en,"Incomplete sentence/translation "+d.path+":"+(i+1));
  assert.ok(byId.has(id),"Unknown word "+id);
  assert.ok(!entries.has(id),"Duplicate word ID "+id);
  assert.ok(!deSeen.has(de),"Duplicate German sentence "+id);
  for(const t of [de,uk,en])assert.ok(t.length>=12&&/[.!?][“”"'»]?$/.test(t),"Invalid sentence punctuation/length "+id);
  assert.ok(!/(auf dem Bild|auf dem Foto|Hier ist (der|die|das)|Das ist (der|die|das))/i.test(de),"Generic photo sentence "+id);
  entries.set(id,{de,uk,en});deSeen.add(de);
  const topic=byId.get(id).topic;local[topic]=(local[topic]||0)+1;count[topic]=(count[topic]||0)+1;
 }
 assert.deepEqual(local,d.byTopic,"Missing or wrong topic counts in "+d.path);
}
assert.equal(entries.size,148,"Stage 08E must cover exactly 148 new cards");
// Grammatically important cases: polite vs plural 'you', fem. singular vs plural sie,
// dative/pronoun distinctions, preposition government, interrogative declension.
const checks=[
 ["pronouns-106",/Sie wohnt seit zwei Jahren/],
 ["pronouns-111",/meine Freunde.*sie bleiben/i],
 ["pronouns-109",/Ihr könnt/],
 ["pronouns-110",/Können Sie mir bitte/],
 ["pronouns-115",/hilft uns bei der Aufgabe/],
 ["pronouns-116",/schicke euch heute/],
 ["pronouns-119",/gebe ihm den Schlüssel/],
 ["pronouns-120",/helfe ihr beim Deutschlernen/],
 ["pronouns-123",/Paul nimmt sein Fahrrad/],
 ["pronouns-124",/Anna sucht ihr Handy/],
 ["pronouns-126",/euer Hund/],
 ["pronouns-127",/Dieser Bus fährt/],
 ["pronouns-128",/Diese Jacke gehört/],
 ["pronouns-129",/Dieses Zimmer ist/],
 ["preps-186",/mit meiner Schwester/],
 ["preps-187",/Ohne meinen Ausweis/],
 ["preps-188",/für meine Mutter/],
 ["preps-190",/um neun Uhr/],
 ["preps-191",/durch den Park/],
 ["preps-192",/nach Köln/],
 ["preps-193",/aus der Ukraine/],
 ["preps-194",/zu meinem Hausarzt/],
 ["preps-196",/bei meinen Großeltern/],
 ["preps-197",/Seit einem Monat/],
 ["preps-200",/gegenüber dem Rathaus/],
 ["preps-201",/den Fluss entlang/],
 ["preps-202",/Während des Unterrichts/],
 ["preps-203",/Wegen des Schnees/],
 ["preps-204",/Trotz des Regens/],
 ["questions-90",/Welcher Bus/],
 ["questions-91",/Welche Jacke/],
 ["questions-92",/Welches Zimmer/],
 ["questions-93",/Wie viel Wasser/],
 ["questions-94",/Wie viele Personen/],
 ["questions-101",/Wessen Tasche/],
 ["adverbs-165",/aber ich muss arbeiten/],
 ["adverbs-166",/Tee oder Kaffee/],
 ["adverbs-167",/Brot und Milch/],
 ["adverbs-168",/deshalb gehen wir zu Fuß/],
 ["phrases-34",/Ich hätte gern einen Tee/]
];
for(const [id,re] of checks)assert.ok(re.test(entries.get(id)?.de||""),"Regression in critical example "+id);
const prev=[
 "src/reviewedCardExamples.ts",
 "src/reviewed08bHome.ts","src/reviewed08bLife.ts",
 "src/reviewed08cOutdoors.ts","src/reviewed08cLife.ts",
 "src/reviewed08dVerbs.ts","src/reviewed08dAdjectives.ts",
 "src/expandedCardExamples.ts"
];
for(const file of prev){
 const raw=read(file).match(/^const rows=(.*);$/m)?.[1];
 assert.ok(raw,"Missing older authored examples "+file);
 for(const row of JSON.parse(raw).trim().split("\n"))
  assert.ok(!entries.has(row.split("|")[0]),"Stage 08E overlaps previously curated word "+row.split("|")[0]);
}
const food=read("src/foodCardExamples.ts"),foodRecords=JSON.parse(food.slice(food.indexOf("={")+1,food.lastIndexOf("};")+1));
for(const id of Object.keys(foodRecords))assert.ok(!entries.has(id),"Stage 08E overlaps curated food "+id);
const resolver=read("src/cardExamples.ts");
const p08d=resolver.indexOf(" const reviewed08d=REVIEWED_08D_VERBS[word.id]||REVIEWED_08D_ADJECTIVES[word.id];");
const p08e=resolver.indexOf(" const reviewed08e=REVIEWED_08E_FUNCTION_WORDS[word.id]||REVIEWED_08E_ADVERBS_PRONOUNS[word.id];");
const pf=resolver.indexOf(" const complete=COMPLETE_CARD_EXAMPLES[word.id];");
assert.ok(p08d>=0&&p08e>p08d&&pf>p08e,"Preserve older editorial examples, then 08E, then baseline");
assert.ok(resolver.includes('source:"editorial-reviewed-08e"'),"Provenance marker missing");
const app=read("src/App.tsx");
assert.ok(app.includes('feedbackSound("correct",Math.min(3,flames+1));gen.current++;void speak('),"Word pronunciation synchronous with flame feedback must remain intact");
console.log("Stage 08E QA passed: 148 unique DE/UA/EN examples across 5 topics, critical German-case checks, earlier authored sentences and 1,177 vocabulary cards preserved.");
