import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const data=read("src/data.ts");
const marker="export const DEMO_WORDS:Word[]=";
const a=data.indexOf(marker),start=data.indexOf("=[",a)+1,end=data.indexOf("];",start);
const words=JSON.parse(data.slice(start,end+1));
const complete=read("src/completeCardExamples.ts");
const base="export const COMPLETE_CARD_EXAMPLES:Readonly<Record<string,readonly [string,string,string]>>=";
const pos=complete.indexOf(base);
assert.ok(pos>=0,"Full example dataset export missing");
const pairs=JSON.parse(complete.slice(pos+base.length,complete.lastIndexOf(";")));
const expectedIds=new Set(words.map(w=>w.id));
assert.equal(words.length,1177,"Original vocabulary changed");
assert.equal(Object.keys(pairs).length,1177,"Every word requires a complete example");
for(const [id,example] of Object.entries(pairs)){
 assert.ok(expectedIds.has(id),"Orphaned example ID "+id);
 assert.ok(Array.isArray(example)&&example.length===3,"Missing German/UA/EN triple: "+id);
 for(const v of example)assert.ok(typeof v==="string"&&v.length>=3&&/[.!?]$/.test(v),"Missing full sentence or punctuation: "+id);
}
for(const w of words)assert.ok(pairs[w.id],"Missing example: "+w.id);
const schrank=words.find(w=>w.id==="home-355");
assert.ok(schrank?.photo==="/photos/custom/schrank-approved-20261123.webp","Wardrobe image does not match approved local photo");
const photo=readFileSync(new URL("../public/photos/custom/schrank-approved-20261123.webp",import.meta.url));
assert.ok(photo.length>20000&&photo.toString("ascii",0,4)==="RIFF"&&photo.toString("ascii",8,12)==="WEBP","Approved wardrobe WebP not bundled");
const card=read("src/cardExamples.ts");
assert.ok(card.includes("COMPLETE_CARD_EXAMPLES[word.id]")&&card.includes('source:"complete-baseline"'),"Full coverage fallback not connected");
for(const label of ["FOOD_CARD_EXAMPLES[word.id]","usageTranslations[word.id]","EXAMPLES[word.de]","ORIGINAL_SENTENCES.length","EXPANDED_CARD_EXAMPLES[word.id]"])assert.ok(card.includes(label),"Previous curated source missing "+label);
const app=read("src/App.tsx");
assert.ok(app.includes('className="logo brandHomeLink" onClick={()=>navigate("home")}'),"Approved logo does not navigate home");
for(const debug of ["gameSoundCheck","gameAudioTools","testFlameSound","demoTier","demoStatus","Правильна відповідь: +1 вогник."]){
 assert.ok(!app.includes(debug),"Diagnostic UI leaked: "+debug);
}
assert.ok(app.includes('feedbackSound("correct",Math.min(3,flames+1));gen.current++;void speak('),"Simultaneous pronunciation/feedback regressed");
console.log("Stage 05C QA passed: 1,177/1,177 UA/DE/EN example sentences, 47 topics, approved Schrank image, logo-home click, no diagnostic UI.");
