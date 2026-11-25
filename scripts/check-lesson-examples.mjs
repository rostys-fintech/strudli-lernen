import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const app=read("src/App.tsx");
const examples=read("src/cardExamples.ts");
const expanded=read("src/expandedCardExamples.ts");
const food=read("src/foodCardExamples.ts");
const data=read("src/data.ts");
const listStart=data.indexOf("export const DEMO_WORDS:Word[]=");
const listBegin=data.indexOf("=[",listStart)+1, listEnd=data.indexOf("];",listBegin);
const words=JSON.parse(data.slice(listBegin,listEnd+1));
const wordById=new Map(words.map(word=>[word.id,word]));
const exportJson=expanded.match(/^const rows=(.*);$/m)?.[1];
assert.ok(exportJson,"New examples source is not parseable");
const sourceRows=JSON.parse(exportJson).trim().split("\n");
const ids=new Set(),topics=new Set();
for(const line of sourceRows){
 const [id,de,uk,en,...extra]=line.split("|");
 assert.ok(!extra.length&&id&&de&&uk&&en,"Incomplete bilingual record for "+id);
 assert.ok(wordById.has(id),"New sentence refers to unknown word ID "+id);
 assert.ok(!ids.has(id),"Duplicated word example "+id);
 ids.add(id);topics.add(wordById.get(id).topic);
 assert.ok(de[0]===de[0].toLocaleUpperCase("de"),"German example should begin with a capital: "+id);
 for(const translated of [de,uk,en]){
  assert.ok(translated.length>=7&&/[.!?]$/.test(translated),"Missing sentence or punctuation: "+id);
 }
}
assert.ok(sourceRows.length>=200,"First expansion batch has been lost");
const foodStart=food.indexOf("={")+1,foodEnd=food.lastIndexOf("};")+1;
const curatedFood=JSON.parse(food.slice(foodStart,foodEnd));
for(const id of Object.keys(curatedFood)){
 assert.ok(!ids.has(id),"Expanded batch overrides existing food example "+id);
 topics.add(wordById.get(id)?.topic);
}
const totalTopics=new Set(words.map(word=>word.topic));
assert.equal(topics.size,totalTopics.size,"Not all vocabulary topics have at least one curated sentence");
assert.ok(examples.includes("EXPANDED_CARD_EXAMPLES[word.id]"),"Expanded examples are not used by the lesson cards");
assert.ok(examples.includes('source:"expanded-curated"'),"Source attribution for expanded examples lost");
assert.ok(examples.includes("return null;"),"Do not replace remaining missing examples with a fake generic placeholder");
assert.ok(ids.has("ww-new-146")&&sourceRows.some(row=>row.startsWith("ww-new-146|Auf der Straße gibt es einen Stau.")),"Stau in user screenshot must have a relevant example");
for(const bad of ["testFlameSound","demoStatus","demoTier","gameSoundCheck","gameAudioTools","Правильна відповідь: +1 вогник.","Correct answer: +1 flame. Mistake: −1 flame."]){
 assert.ok(!app.includes(bad),"Technical learner-facing debug UI must not return: "+bad);
}
assert.ok(app.includes('className="soundSetting"')&&app.includes("setSoundEnabled(v)"),"Sound settings must remain available from Progress");
assert.ok(app.includes("feedbackSound(\"correct\",Math.min(3,flames+1))"),"Flame audio feedback must remain functional");
assert.ok(app.includes("void speak(word.audioText||word.de,word.kind===\"noun\"?choice:undefined)"),"Immediate word pronunciation must remain functional");
console.log("Stage 05B learner UX passed: "+sourceRows.length+" new authored bilingual sentences, all "+topics.size+" vocabulary topics represented, Stau fixed, no diagnostic sound text.");
