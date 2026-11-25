import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const src=read("src/data.ts");
const start=src.indexOf("export const DEMO_WORDS:Word[]="),a=src.indexOf("=[",start)+1,b=src.indexOf("];",a);
const words=JSON.parse(src.slice(a,b+1));
assert.equal(words.length,1177,"Do not alter any of the 1,177 vocabulary cards");
const byId=new Map(words.map(w=>[w.id,w]));
const files=[["src/reviewed08dVerbs.ts",113,"verbs"],["src/reviewed08dAdjectives.ts",94,"adjs"]];
const ids=new Set(),sentences=new Set(),samples=new Map();
for(const [path,n,topic] of files){
 const c=read(path),match=c.match(/^const rows=(.*);$/m);
 assert.ok(match,"The sentence dataset must be parseable: "+path);
 const items=JSON.parse(match[1]).trim().split("\n");
 assert.equal(items.length,n,"Incomplete Stage 08D dataset: "+path);
 for(const [i,line] of items.entries()){
  const [id,de,uk,en,...excess]=line.split("|");
  assert.ok(!excess.length&&id&&de&&uk&&en,"Missing German/UA/EN values: "+path+":"+(i+1));
  assert.ok(!ids.has(id),"Duplicate word ID in Stage 08D: "+id);
  assert.equal(byId.get(id)?.topic,topic,"Sentence not attached to the matching card "+id);
  assert.ok(!sentences.has(de),"Repeated German sentence: "+id);
  assert.ok(!/(auf dem Bild|auf dem Foto|Hier ist (der|die|das)|Das ist (der|die|das))/i.test(de),"Generic photo placeholder: "+id);
  for(const value of [de,uk,en])assert.ok(value.length>13&&/[.!?]$/.test(value),"Incomplete text: "+id);
  ids.add(id);sentences.add(de);samples.set(id,{de,uk,en});
 }
}
assert.equal(ids.size,207,"All 113 verbs and 94 adjectives must have their own authored example");
// Focused regression checks for conjugated modals, separable prefixes, reflexive and dative verbs,
// and adjective inflection after articles or prepositions.
for(const [id,re] of [
 ["verbs-823",/Kannst du mir bitte helfen\?/],
 ["verbs-824",/Ich muss morgen früh aufstehen\./],
 ["verbs-842",/hilft mir bei den Hausaufgaben\./],
 ["verbs-853",/fängt um neun Uhr an\./],
 ["verbs-858",/rufe meine Mutter jeden Abend an\./],
 ["ww-new-149",/bewerbe mich um eine Stelle/],
 ["ww-new-154",/gebe den Antrag am Schalter ab\./],
 ["ww-new-162",/überweise die Miete/],
 ["ww-new-169",/schreibt sich an der Universität ein\./],
 ["ww-new-170",/laden Sie das Dokument als PDF hoch\./],
 ["ww-new-181",/interessiere mich für deutsche Geschichte/],
 ["adjs-880",/in einer großen Stadt\./],
 ["adjs-884",/ein neues Ladegerät/],
 ["adjs-893",/einen warmen Pullover/],
 ["adjs-916",/sehr freundlich\./],
 ["adjs-943",/eine deutsche Zeitung/],
 ["adjs-944",/einen englischen Film/],
 ["adjs-945",/ein ukrainisches Gericht/],
 ["adjs-946",/bei rotem Licht\./],
 ["ww-new-192",/ein günstiges Zimmer/],
 ["ww-new-200",/seit drei Jahren verheiratet/]
]){
 assert.ok(re.test(samples.get(id)?.de||""),"Grammar regression in example "+id);
}
const resolver=read("src/cardExamples.ts");
const old=resolver.indexOf(" const reviewed08c=REVIEWED_08C_OUTDOORS[word.id]||REVIEWED_08C_LIFE[word.id];");
const current=resolver.indexOf(" const reviewed08d=REVIEWED_08D_VERBS[word.id]||REVIEWED_08D_ADJECTIVES[word.id];");
const fallback=resolver.indexOf(" const complete=COMPLETE_CARD_EXAMPLES[word.id];");
assert.ok(old!==-1&&current>old&&fallback>current,"Stage 08D must follow earlier curated examples and precede baseline");
for(const marker of ["FOOD_CARD_EXAMPLES[word.id]","EXPANDED_CARD_EXAMPLES[word.id]","REVIEWED_CARD_EXAMPLES[word.id]","REVIEWED_08B_HOME[word.id]"])
 assert.ok(resolver.includes(marker)&&resolver.indexOf(marker)<current,"Preserve approved sources before the new dataset: "+marker);
assert.ok(resolver.includes('source:"editorial-reviewed-08d"'),"Editorial provenance missing");
for(const path of ["src/reviewedCardExamples.ts","src/reviewed08bHome.ts","src/reviewed08bLife.ts","src/reviewed08cOutdoors.ts","src/reviewed08cLife.ts"]){
 const match=read(path).match(/^const rows=(.*);$/m);
 assert.ok(match,"Missing previously reviewed source "+path);
 for(const line of JSON.parse(match[1]).trim().split("\n"))
  assert.ok(!ids.has(line.split("|")[0]),"Accidental override of previous editorial review: "+line.split("|")[0]);
}
console.log("Stage 08D QA passed: 207 unique trilingual examples (113 verbs, 94 adjectives), targeted grammar checks, earlier approved sources preserved, 1,177 cards intact.");
