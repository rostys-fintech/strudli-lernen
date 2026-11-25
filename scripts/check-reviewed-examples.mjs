import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(name)=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
const wordsText=read("src/data.ts");
const wordMarker="export const DEMO_WORDS:Word[]=";
const start=wordsText.indexOf(wordMarker),a=wordsText.indexOf("=[",start)+1,b=wordsText.indexOf("];",a);
const words=JSON.parse(wordsText.slice(a,b+1));
assert.equal(words.length,1177,"The existing 1,177 vocabulary cards must be preserved");
const byId=new Map(words.map(w=>[w.id,w]));
const reviewed=read("src/reviewedCardExamples.ts");
const raw=reviewed.match(/^const rows=(.*);$/m)?.[1];
assert.ok(raw,"Audited examples must be readable and countable by stable ID");
const lines=JSON.parse(raw).trim().split("\n");
assert.equal(lines.length,108,"Stage 08A batch should contain exactly 108 reviewed sentences");
const seen=new Set(),topics=new Set(),germanExamples=new Set();
for(const [i,line] of lines.entries()){
 const cells=line.split("|");
 assert.equal(cells.length,4,"Incomplete German/UA/EN record at line "+(i+1));
 const [id,de,uk,en]=cells;
 assert.ok(byId.has(id),"Unknown card ID "+id);
 assert.ok(!seen.has(id),"Duplicated reviewed ID "+id);
 seen.add(id);topics.add(byId.get(id).topic);
 for(const [lang,sentence] of [["de",de],["uk",uk],["en",en]]){
  assert.ok(sentence.length>13&&/[.!?]$/.test(sentence),"Missing meaningful "+lang+" text for "+id);
 }
 assert.ok(!/(Auf dem Bild|auf dem Bild|auf dem Foto|ist auf dem Bild|Hier ist (der|die|das)|Das ist (der|die|das))/i.test(de),
  "Stage 08A should replace generic photo boilerplate: "+id);
 assert.ok(!germanExamples.has(de),"Distinct words should not reuse the same sentence: "+id);
 germanExamples.add(de);
}
assert.equal(topics.size,6,"This audited batch must cover six high-priority practical topics");
for(const topic of ["institutions","banking","housing","publictransport","shopping","citydirections"])
 assert.ok(topics.has(topic),"Missing priority topic "+topic);
const card=read("src/cardExamples.ts");
const source=card.indexOf(" const reviewed=REVIEWED_CARD_EXAMPLES[word.id];");
const baseline=card.indexOf(" const complete=COMPLETE_CARD_EXAMPLES[word.id];");
assert.ok(source!==-1&&baseline!==-1&&source<baseline,"Hand-edited examples must precede the generic fallback");
for(const s of ["FOOD_CARD_EXAMPLES[word.id]","EXPANDED_CARD_EXAMPLES[word.id]","usageTranslations[word.id]"])
 assert.ok(card.indexOf(s)<source,"Older approved authored examples must retain priority: "+s);
assert.ok(card.includes('source:"editorial-reviewed"'),"QA provenance must be available to the example resolver");
const full=read("src/completeCardExamples.ts");
assert.ok(full.includes('COMPLETE_CARD_EXAMPLES'),"Do not remove full-coverage fallback for unreviewed words");
console.log("Stage 08A QA passed: 108 unique manually edited DE/UA/EN examples across 6 practical topics, no photo-template placeholders, legacy approved examples preserved.");
