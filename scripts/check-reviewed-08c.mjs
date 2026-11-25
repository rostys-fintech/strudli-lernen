import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const data=read("src/data.ts");
const start=data.indexOf("export const DEMO_WORDS:Word[]=");
const a=data.indexOf("=[",start)+1,b=data.indexOf("];",a);
const words=JSON.parse(data.slice(a,b+1));
assert.equal(words.length,1177,"All original words must remain unchanged");
const wordMap=new Map(words.map(word=>[word.id,word]));
const files=[
 {path:"src/reviewed08cOutdoors.ts",expected:63,topics:["landscapes","weather","animals","tourism"]},
 {path:"src/reviewed08cLife.ts",expected:88,topics:["school","leisure","calendar","vehicles"]}
];
const ids=new Set(),deSentences=new Set(),topics=new Set();
for(const {path,expected,topics:expectedTopics} of files){
 const src=read(path);
 const raw=src.match(/^const rows=(.*);$/m)?.[1];
 assert.ok(raw,"Example rows must be parseable: "+path);
 const records=JSON.parse(raw).trim().split("\n");
 assert.equal(records.length,expected,"Unexpected content count for "+path);
 const actualTopics=new Set();
 for(let i=0;i<records.length;i++){
  const [id,de,uk,en,...extra]=records[i].split("|");
  assert.ok(!extra.length&&id&&de&&uk&&en,"Incomplete DE/UA/EN row "+path+":"+(i+1));
  assert.ok(wordMap.has(id),"Unknown word: "+id);
  assert.ok(!ids.has(id),"Duplicate ID across Stage 08C: "+id);
  assert.ok(!deSentences.has(de),"Repeated German sentence: "+id);
  ids.add(id);deSentences.add(de);
  actualTopics.add(wordMap.get(id).topic);
  topics.add(wordMap.get(id).topic);
  for(const sentence of [de,uk,en])
   assert.ok(sentence.length>=12&&/[.!?]$/.test(sentence),"Incomplete sentence/translation: "+id);
  assert.ok(!/(auf dem Bild|auf dem Foto|Hier ist (der|die|das)|Das ist (der|die|das))/i.test(de),
    "Generic photo placeholder found in new content: "+id);
 }
 assert.deepEqual([...actualTopics].sort(),[...expectedTopics].sort(),"Unexpected topic coverage "+path);
}
assert.equal(ids.size,151,"Stage 08C must contain exactly 151 individual examples");
assert.equal(topics.size,8,"Stage 08C covers eight topics");
for(const path of ["src/reviewedCardExamples.ts","src/reviewed08bHome.ts","src/reviewed08bLife.ts","src/expandedCardExamples.ts"]){
 const content=read(path),raw=content.match(/^const rows=(.*);$/m)?.[1];
 assert.ok(raw,"Previously approved source is missing: "+path);
 for(const line of JSON.parse(raw).trim().split("\n")){
  const id=line.split("|")[0];
  assert.ok(!ids.has(id),"New reviewed row would override earlier approved example "+id);
 }
}
const food=read("src/foodCardExamples.ts"),foodJson=JSON.parse(food.slice(food.indexOf("={")+1,food.lastIndexOf("};")+1));
for(const id of Object.keys(foodJson))assert.ok(!ids.has(id),"Must not override curated food entry "+id);
const card=read("src/cardExamples.ts");
const previous=card.indexOf(" const reviewed08b=REVIEWED_08B_HOME[word.id]||REVIEWED_08B_LIFE[word.id];");
const added=card.indexOf(" const reviewed08c=REVIEWED_08C_OUTDOORS[word.id]||REVIEWED_08C_LIFE[word.id];");
const fallback=card.indexOf(" const complete=COMPLETE_CARD_EXAMPLES[word.id];");
assert.ok(previous>=0&&added>previous&&fallback>added,"Earlier reviewed examples must precede Stage 08C and fallback");
assert.ok(card.includes('source:"editorial-reviewed-08c"'),"Provenance for Stage 08C is required");
assert.ok(card.includes("FOOD_CARD_EXAMPLES[word.id]"),"Existing approved food source must remain");
assert.ok(card.includes("EXPANDED_CARD_EXAMPLES[word.id]"),"Existing expanded source must remain");
console.log("Stage 08C QA passed: 151 unique DE/UA/EN contextual examples across 8 topics; all 1,177 cards preserved and older approved sources prioritized.");
