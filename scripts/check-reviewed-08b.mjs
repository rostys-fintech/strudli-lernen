import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(path)=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const data=read("src/data.ts");
const m="export const DEMO_WORDS:Word[]=";
const i=data.indexOf(m),a=data.indexOf("=[",i)+1,b=data.indexOf("];",a);
const words=JSON.parse(data.slice(a,b+1));
assert.equal(words.length,1177,"The approved 1,177 vocabulary IDs must remain unchanged");
const byId=new Map(words.map(w=>[w.id,w]));
const input=[
 ["src/reviewed08bHome.ts",110,["tech","clothing","rooms","furniture","housework"]],
 ["src/reviewed08bLife.ts",79,["family","people","bodyparts","symptoms","everyday"]]
];
const allIds=new Set(), allGerman=new Set(),topicCounts=new Map();
for(const [path,count,expectedTopics] of input){
 const body=read(path);
 const match=body.match(/^const rows=(.*);$/m);
 assert.ok(match,"Review rows must be parseable: "+path);
 const rows=JSON.parse(match[1]).trim().split("\n");
 assert.equal(rows.length,count,"Incomplete editorial batch: "+path);
 const localTopics=new Set();
 for(let index=0;index<rows.length;index++){
  const [id,de,uk,en,...extras]=rows[index].split("|");
  assert.ok(!extras.length&&id&&de&&uk&&en,"Invalid DE/UK/EN row at "+path+":"+(index+1));
  assert.ok(byId.has(id),"Unknown word ID "+id);
  assert.ok(!allIds.has(id),"Duplicated word ID "+id);
  assert.ok(!allGerman.has(de),"Identical German sample repeated for "+id);
  allIds.add(id);allGerman.add(de);
  const topic=byId.get(id).topic;localTopics.add(topic);
  topicCounts.set(topic,(topicCounts.get(topic)||0)+1);
  for(const [lang,text] of [["de",de],["uk",uk],["en",en]]){
   assert.ok(text.length>=10&&/[.!?]$/.test(text),"Missing sentence or punctuation ("+lang+"): "+id);
  }
  assert.ok(!/(Auf dem Bild|auf dem Bild|auf dem Foto|ist auf dem Bild|Hier ist (der|die|das)|Das ist (der|die|das))/i.test(de),"No generic image boilerplate: "+id);
 }
 assert.deepEqual([...localTopics].sort(),[...expectedTopics].sort(),"Incorrect topic coverage: "+path);
}
assert.equal(allIds.size,189,"Exactly 189 new individually authored cards required");
assert.equal(topicCounts.size,10,"Ten different vocabulary topics expected");
const prev=read("src/reviewedCardExamples.ts").match(/^const rows=(.*);$/m);
assert.ok(prev,"Stage 08A records must remain present");
const stage08a=new Set(JSON.parse(prev[1]).trim().split("\n").map(x=>x.split("|")[0]));
for(const id of allIds)assert.ok(!stage08a.has(id),"New review may not overwrite previously reviewed Stage 08A "+id);
const curated=read("src/cardExamples.ts");
for(const required of [
 "FOOD_CARD_EXAMPLES[word.id]","usageTranslations[word.id]","EXPANDED_CARD_EXAMPLES[word.id]",
 "REVIEWED_CARD_EXAMPLES[word.id]","REVIEWED_08B_HOME[word.id]||REVIEWED_08B_LIFE[word.id]",
 "COMPLETE_CARD_EXAMPLES[word.id]"
])assert.ok(curated.includes(required),"Required example source missing: "+required);
const root=curated.indexOf(" const reviewed08b=REVIEWED_08B_HOME[word.id]||REVIEWED_08B_LIFE[word.id];");
const fallback=curated.indexOf(" const complete=COMPLETE_CARD_EXAMPLES[word.id];");
assert.ok(root>curated.indexOf(" const reviewed=REVIEWED_CARD_EXAMPLES[word.id];")&&root<fallback,"Priority must preserve older authored examples and avoid generic fallbacks");
assert.ok(curated.includes('source:"editorial-reviewed-08b"'),"Stage 08B provenance missing");
console.log("Stage 08B QA passed: 189 unique DE/UA/EN contextual sentences in 10 topics; approved Stage 08A and other curated examples preserved.");
