/**
 * Stage 08F: audit the effective sentence a learner sees for every stable card.
 * Mirrors the source-precedence logic of src/cardExamples.ts rather than just
 * counting rows in editorial source files. Emits a reproducible per-card CSV
 * and a JSON summary for review during builds.
 * Note: this is structural and targeted semantic QA, not professional proofreading.
 */
import assert from "node:assert/strict";
import {readFileSync,mkdirSync,writeFileSync} from "node:fs";
import {join} from "node:path";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const parseArray=(src,marker)=>{
 const i=src.indexOf(marker);assert.ok(i>=0,"Missing source marker "+marker);
 const a=src.indexOf("=[",i)+1,b=src.indexOf("];",a);
 return JSON.parse(src.slice(a,b+1));
};
const parseObject=(src,marker)=>{
 const i=src.indexOf(marker);assert.ok(i>=0,"Missing source marker "+marker);
 const a=src.indexOf("={",i)+1,b=src.indexOf("};",a);
 return JSON.parse(src.slice(a,b+1));
};
const rowFile=path=>{
 const m=read(path).match(/^const rows=(.*);$/m);assert.ok(m,"Missing editorial rows "+path);
 const items=JSON.parse(m[1]).trim().split("\n").map(x=>x.split("|"));
 assert.ok(items.every(x=>x.length===4),"Incomplete editorial row "+path);
 return Object.fromEntries(items.map(([id,de,uk,en])=>[id,[de,uk,en]]));
};
const data=read("src/data.ts"),resolver=read("src/cardExamples.ts");
const words=parseArray(data,"export const DEMO_WORDS:Word[]=");
const original=parseArray(data,"export const ORIGINAL_SENTENCES:ExampleSentence[]=");
const enSource=read("src/englishSentences.ts");
const originalEn=parseArray(enSource,"export const ORIGINAL_ENGLISH_SENTENCES:readonly string[]=");
const English={...parseObject(enSource,"export const EXTRA_EXAMPLE_ENGLISH:"),...parseObject(resolver,"const extraEnglish:")};
const usageTrans=parseObject(resolver,"const usageTranslations:");
const food=parseObject(read("src/foodCardExamples.ts"),"export const FOOD_CARD_EXAMPLES:");
const baseline=parseObject(read("src/completeCardExamples.ts"),"export const COMPLETE_CARD_EXAMPLES:");
const expanded=rowFile("src/expandedCardExamples.ts");
const reviewed=rowFile("src/reviewedCardExamples.ts");
const stage08b={...rowFile("src/reviewed08bHome.ts"),...rowFile("src/reviewed08bLife.ts")};
const stage08c={...rowFile("src/reviewed08cOutdoors.ts"),...rowFile("src/reviewed08cLife.ts")};
const stage08d={...rowFile("src/reviewed08dVerbs.ts"),...rowFile("src/reviewed08dAdjectives.ts")};
const stage08e={...rowFile("src/reviewed08eFunctionWords.ts"),...rowFile("src/reviewed08eAdverbsPronouns.ts")};
const auditedBaseline=rowFile("src/reviewed08fBaseline.ts");
const corrections=rowFile("src/reviewed08fCorrections.ts");
const exampleSource=read("src/Library.tsx");
const examples={};
const lib=exampleSource.slice(exampleSource.indexOf("export const EXAMPLES:"),exampleSource.indexOf("};",exampleSource.indexOf("export const EXAMPLES:")));
for(const line of lib.split("\n")){
 const m=line.match(/^([\p{L}]+):(\[\[.*\]\]),?$/u);
 if(m)examples[m[1]]=JSON.parse(m[2]);
}
assert.equal(Object.keys(examples).length,27,"Library dictionary parsing changed: inspect the resolver");
assert.equal(original.length,originalEn.length,"Original German/English practice array misalignment");
assert.equal(words.length,1177,"Stable vocabulary count changed");
assert.equal(new Set(words.map(w=>w.id)).size,1177,"Duplicate stable word IDs");
// Assert that the audited order matches the implementation, not a diverging model.
const order=[
 "FOOD_CARD_EXAMPLES[word.id]",
 "REVIEWED_08F_CORRECTIONS[word.id]",
 "usageTranslations[word.id]",
 "EXAMPLES[word.de]",
 "ORIGINAL_SENTENCES.length",
 "EXPANDED_CARD_EXAMPLES[word.id]",
 "REVIEWED_CARD_EXAMPLES[word.id]",
 "REVIEWED_08B_HOME[word.id]",
 "REVIEWED_08C_OUTDOORS[word.id]",
 "REVIEWED_08D_VERBS[word.id]",
 "REVIEWED_08E_FUNCTION_WORDS[word.id]",
 "REVIEWED_08F_BASELINE[word.id]",
 "COMPLETE_CARD_EXAMPLES[word.id]"
];
let last=-1;
for(const term of order){
 const now=resolver.indexOf(term);
 assert.ok(now>last,"Resolver priority unexpectedly changed: "+term);
 last=now;
}
const originalMatch=(word,text)=>{
 if(!["noun","adj"].includes(word.kind)||word.de.length<4||word.de.includes(" "))return false;
 const tokens=text.toLocaleLowerCase("de").replace(/[.,!?;:“”„()]/g," ").split(/\s+/);
 return tokens.includes(word.de.toLocaleLowerCase("de"));
};
const rows=words.map(word=>{
 const id=word.id;
 let source="",ex;
 const assign=(label,triple)=>{source=label;ex=triple;};
 if(food[id])assign("food-curated",food[id]);
 else if(corrections[id])assign("audit-correction",corrections[id]);
 else if(word.usage?.trim()&&usageTrans[id]&&/[.!?]$/.test(word.usage.trim()))assign("card-usage",[word.usage.trim(),...usageTrans[id]]);
 else{
  for(const [de,uk] of examples[word.de]||[]){
   const english=English[de];
   if(english){assign("dictionary",[de,uk,english]);break;}
  }
  if(!ex)for(let i=0;i<original.length;i++){
   if(originalEn[i]&&originalMatch(word,original[i].de)){
    assign("original-exercise",[original[i].de,original[i].uk,originalEn[i]]);break;
   }
  }
  if(!ex)for(const [label,data] of [
   ["expanded-curated",expanded],
   ["editorial-reviewed",reviewed],
   ["editorial-reviewed-08b",stage08b],
   ["editorial-reviewed-08c",stage08c],
   ["editorial-reviewed-08d",stage08d],
   ["editorial-reviewed-08e",stage08e],
   ["audit-baseline-cleanup",auditedBaseline],
   ["complete-baseline",baseline]
  ]){
   if(data[id]){assign(label,data[id]);break;}
  }
 }
 assert.ok(ex&&ex.length===3&&ex.every(x=>typeof x==="string"&&x.trim()),"Missing triple for "+id);
 return {id,topic:word.topic,kind:word.kind,word:word.de,wordTranslation:word.uk,source,german:ex[0],ukrainian:ex[1],english:ex[2]};
});
const counts={},byTopic={},byGerman=new Map(),flags=[];
for(const r of rows){
 counts[r.source]=(counts[r.source]||0)+1;
 if(!byTopic[r.topic])byTopic[r.topic]={count:0,sources:{}};
 byTopic[r.topic].count++;
 byTopic[r.topic].sources[r.source]=(byTopic[r.topic].sources[r.source]||0)+1;
 const normalized=r.german.trim().normalize("NFC");
 byGerman.set(normalized,[...(byGerman.get(normalized)||[]),r.id]);
 if(!/[.!?][„“”"'»]?$/.test(r.german))flags.push({type:"punctuation",id:r.id});
 if(/^(Auf dem Bild|Auf dem Foto|Hier ist das |Das ist das )/i.test(r.german))
  flags.push({type:"possible-image-boilerplate",id:r.id});
 if(r.german.trim()===r.ukrainian.trim()||r.german.trim()===r.english.trim())
  flags.push({type:"identical-translation",id:r.id});
}
const duplicates=[...byGerman.entries()].filter(([,ids])=>ids.length>1).map(([german,ids])=>({german,ids}));
const summary={
 cardCount:rows.length,topicCount:Object.keys(byTopic).length,sourceCounts:counts,
 baselineRemaining:counts["complete-baseline"]||0,
 duplicates,flags,byTopic,
 auditCorrections:Object.keys(corrections).length,
 auditBaselineReplacements:Object.keys(auditedBaseline).length,
 notes:["Recreates the resolver's exact source order, except no TTS playback is performed.",
 "This structural check does not certify every translation's idiomatic accuracy, audio pronunciation or picture semantics."]
};
const reportDir=new URL("../reports/stage08f/",import.meta.url);
mkdirSync(reportDir,{recursive:true});
const csvEscape=x=>'"'+String(x??"").replaceAll('"','""')+'"';
const cols=["id","topic","kind","word","source","de","uk","en"];
const csvRows=rows.map(r=>[r.id,r.topic,r.kind,r.word,r.source,r.german,r.ukrainian,r.english]);
const csv=[cols.join(","),...csvRows.map(r=>r.map(csvEscape).join(","))].join("\n")+"\n";
const committedCsv=read("reports/stage08f/effective-examples.csv");
assert.equal(csv,committedCsv,"Effective example snapshot differs from the app source; regenerate reviewed CSV before release");
const committedSummary=JSON.parse(read("reports/stage08f/summary.json"));
assert.deepEqual(committedSummary.sourceCounts,counts,"Source distribution has changed since the audited report");
assert.equal(committedSummary.cardCount,rows.length,"Reported card count has changed");
writeFileSync(new URL("effective-examples.csv",reportDir),csv);
writeFileSync(new URL("summary.json",reportDir),JSON.stringify(summary,null,2)+"\n");
assert.equal(Object.keys(byTopic).length,47,"47 topics must remain intact");
assert.equal(summary.baselineRemaining,0,"Fallback boilerplate remains in displayed cards");
assert.equal(duplicates.length,0,"Multiple cards still display the same German sentence");
assert.equal(flags.length,0,"Quality flags remain: "+JSON.stringify(flags.slice(0,8)));
assert.equal(counts["audit-correction"],17,"Not all audited sense/duplicate fixes are displayed");
assert.equal(counts["audit-baseline-cleanup"],45,"Not all last baseline placeholders are replaced");
const map=Object.fromEntries(rows.map(r=>[r.id,r]));
assert.match(map["travel-433"].german,/Auf dieser Karte ist der Weg zum Museum markiert/,"Karte (map) cannot show payment-card example");
assert.match(map["shopping-678"].german,/Karte zahlen/,"Karte (payment card) must keep its meaning");
assert.match(map["home-355"].german,/Schrank/,"Approved wardrobe lesson must keep a proper example");
console.log("Stage 08F effective display audit PASS: "+rows.length+" cards, 47 topics, 0 generic fallbacks, 0 repeated German sentences, 0 structural flags.");
console.log("Effective example source distribution: "+JSON.stringify(counts));
console.log("Reports created: reports/stage08f/effective-examples.csv and summary.json.");
