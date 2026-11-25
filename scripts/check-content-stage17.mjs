import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const bank=read("src/everydayPhrases.ts"),extras=read("src/practiceExtra.ts");
const practice=read("src/practice.ts"),ui=read("src/Practice.tsx");
const audio=read("src/StrudliAudio.tsx"),lesen=read("src/lesenStories.ts");
const stories=read("src/lesenStoryContentC.ts"),shared=read("src/lesenGlossary.ts");
const pkg=JSON.parse(read("package.json"));

function parseBetween(source,first,end){
 const a=source.indexOf(first);assert.ok(a>=0,"Missing "+first);
 const b=source.indexOf(end,a+first.length);assert.ok(b>a,"Missing closing marker "+end);
 return JSON.parse(source.slice(a+first.length,b).trim());
}
const phrases=parseBetween(bank,"const rows:readonly [PhraseCategory,string,string,string,PhraseLevel][]=",";\nexport const DAILY_PHRASES");
assert.equal(phrases.length,150,"Require 150 practical trilingual phrases");
const categories=Object.fromEntries(phrases.map(row=>[row[0],0]));
const german=new Set();
for(const row of phrases){
 assert.equal(row.length,5);assert.ok(["A0","A1","A2"].includes(row[4]));
 assert.ok(row[1].length>=11&&row[2].length>=9&&row[3].length>=9,"Meaningful DE/UK/EN phrase needed");
 assert.ok(!german.has(row[1]),"Duplicate phrase: "+row[1]);german.add(row[1]);
 categories[row[0]]++;
}
assert.equal(Object.keys(categories).length,10);
assert.ok(Object.values(categories).every(n=>n===15),"Even phrase coverage by situation");
for(const [name,expected] of [["EXTRA_VERBS",24],["EXTRA_CASES",14],["EXTRA_DIALOGUES",36],["EXTRA_SENTENCES",36]]){
 const text=extras.match(new RegExp("export const "+name+":[^=]+=(\\[[\\s\\S]*?\\]);"))?.[1];
 assert.ok(text,"Missing structured extra content "+name);
 const rows=JSON.parse(text);
 assert.equal(rows.length,expected,"Unexpected "+name+" count");
 for(const [i,row] of rows.entries()){
  if(name==="EXTRA_SENTENCES"){
   for(const field of ["de","uk","en","tipUk","tipEn"])assert.ok(row[field],"Missing sentence field "+name+" "+i);
   assert.ok(row.de.split(" ").length>=4&&row.de.split(" ").length<=12,"Tile count unsafe: "+row.de);
  }else{
   assert.ok(row.length>=7,"Missing bilingual exercise row "+name+" "+i);
   assert.equal(new Set(row.slice(2,5)).size,3,"Distractors collide "+name+" "+i);
  }
 }
}
assert.ok(practice.includes('mode==="phrases"')&&practice.includes("DAILY_PHRASES.map"),"Everyday phrase game not connected");
assert.ok(practice.includes('EXTRA_VERBS')&&practice.includes('EXTRA_DIALOGUES')&&practice.includes('EXTRA_SENTENCES'),"Exercises do not use authored content");
assert.ok(ui.includes('id:"phrases"')&&ui.includes('mode==="phrases"'),"Sixth playable game is not wired");
assert.ok(audio.includes('DAILY_PHRASES')&&audio.includes("setCategory(")&&audio.includes("setRecall(")&&audio.includes("setRevealed(true)"),"Audio category and hidden-text practice must work");
assert.ok(lesen.includes("...LESSON_STORIES_C"),"New stories missing from reading registry");

const sharedWords=new Set();
for(const m of shared.matchAll(/parseGloss\((?:String\.raw)?\`([\s\S]*?)\`\)/g)){
 for(const line of m[1].trim().split("\n")){const p=line.split("|");if(p.length===3)sharedWords.add(p[0]);}
}
const ids=[],storySentences=new Set();
for(const section of stories.split(/\n id:"/).slice(1)){
 const id=section.slice(0,section.indexOf('"'));ids.push(id);
 const rows=parseBetween(section,"sentences:",",\n paragraphEnds:");
 assert.equal(rows.length,20,"Need 20 original sentences per story: "+id);
 assert.ok(section.includes("paragraphEnds:[5,10,15,20]"),"Story paragraphs malformed "+id);
 const ownRaw=section.match(/glossary:parseGloss\(String\.raw\`([\s\S]*?)\`\)/)?.[1];assert.ok(ownRaw,"Story glossary missing "+id);
 const own=new Set(sharedWords);
 for(const line of ownRaw.trim().split("\n")){
  const fields=line.split("|");assert.equal(fields.length,3,"Gloss must have DE/UA/EN fields "+id+": "+line);
  assert.ok(fields.every(x=>x.trim()),"Empty reading gloss "+id);
  own.add(fields[0]);
 }
 for(const [de,uk,en] of rows){
  assert.ok(de&&uk&&en,"Incomplete bilingual narration "+id);
  assert.match(de,/[.!?][“”„"']?$/,"Punctuation missing "+de);
  assert.ok(!storySentences.has(de),"Duplicated narration "+de);storySentences.add(de);
  const missing=(de.match(/\p{L}+/gu)||[]).filter(w=>!own.has(w)&&!own.has(w.toLocaleLowerCase("de")));
  assert.deepEqual(missing,[],"Untranslated tap words in "+id+": "+missing.join(", "));
 }
 assert.equal((section.match(/\bQ\(/g)||[]).length,3,"Three reading checks required per story "+id);
}
assert.deepEqual(ids,["cafe-key","hallway-note","first-workday","offline-evening"]);
assert.ok(pkg.scripts["check:all"].includes("check:content17"),"New content integrity checks must run in CI");
console.log("Stage 17 content QA PASS: 150 trilingual daily phrases in 10 categories; 110 new practice questions; 4 new stories, 80 trilingual narrated sentences, 12 comprehension questions, full tap glossaries.");
