import {readFileSync} from "node:fs";
const s=readFileSync(new URL("../src/data.ts",import.meta.url),"utf8");
function rows(name,next){const m=s.match(new RegExp("export const "+name+":[^=]+=(\\[[\\s\\S]*?\\]);\\nexport const "+next));if(!m)throw Error("Missing "+name);return JSON.parse(m[1])}
const w=rows("DEMO_WORDS","ORIGINAL_SENTENCES"),topics=rows("DEMO_TOPICS","DEMO_WORDS");
const idSet=new Set(),errors=[],tally=new Map();
for(const x of w){if(!x.id||!x.de||!x.uk||!x.topic)errors.push("Incomplete "+x.id);if(idSet.has(x.id))errors.push("Duplicate id "+x.id);idSet.add(x.id);
tally.set(x.topic,(tally.get(x.topic)||0)+1);
if(x.kind==="noun"&&!(["der","die","das"].includes(x.gender)))errors.push("Article "+x.id);
if(x.kind!=="noun"&&x.gender)errors.push("Non-noun article "+x.id);
if(x.pluralOnly&&x.kind!=="noun")errors.push("Plural-only must be noun "+x.id);
if(x.acceptedArticles && x.acceptedArticles.some(g=>!["der","die","das"].includes(g)))errors.push("Invalid alternate article "+x.id);
}
const extraPhrases=new Set(["phrases-40","phrases-41","phrases-42"]);
const originals=w.filter(x=>!x.id.startsWith("ww-new-")&&!extraPhrases.has(x.id));
if(w.length!==1177)errors.push("Expected 1177 active records, found "+w.length);
for(const id of extraPhrases)if(!w.some(x=>x.id===id&&x.kind==="phrase"&&x.topic==="phrases"&&x.photo==="/photos/approved/"+id+".webp"))errors.push("Missing approved new phrase "+id);
if(originals.length!==952)errors.push("Expected 952 preserved legacy IDs");
if(!w.find(x=>x.id==="food-277")||!w.find(x=>x.id==="home-337"))errors.push("Missing legacy IDs");
if(topics.length!==47)errors.push("Expected 47 topics");
if(topics.some(t=>!t.id||!t.name))errors.push("Incomplete topics");
for(const t of topics)if((tally.get(t.id)||0)!==t.plannedCount)errors.push("Topic count "+t.id);
for(const id of tally.keys())if(!topics.some(x=>x.id===id))errors.push("Unknown topic "+id);
for(const id of ["family-465","germany-228","ww-new-054","ww-new-102"])if(!w.find(x=>x.id===id)?.pluralOnly)errors.push("Missing plural-only guard "+id);
if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log("Vocabulary checks passed: "+w.length+" words, "+topics.length+" topics, "+originals.length+" original IDs preserved.");
