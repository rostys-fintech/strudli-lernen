import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const shared=read("src/lesenGlossary.ts");
const sourceA=read("src/lesenStoryContentA.ts"),sourceB=read("src/lesenStoryContentB.ts");
const app=read("src/App.tsx"),component=read("src/Lesen.tsx");
const narration=read("src/lesenNarration.ts"),styles=read("src/styles.css");
const delimiter=String.fromCharCode(96);
function enclosed(source,prefix){
 const pos=source.indexOf(prefix);
 assert.ok(pos>=0,"Missing glossary prefix: "+prefix);
 const rest=source.slice(pos+prefix.length),first=rest.indexOf(delimiter),last=rest.indexOf(delimiter,first+1);
 assert.ok(first>=0&&last>first,"Glossary not properly delimited");
 return rest.slice(first+1,last);
}
function glossMap(raw){
 return Object.fromEntries(raw.trim().split("\n").map(line=>{
  const cells=line.split("|");
  assert.equal(cells.length,3,"Invalid gloss: "+line);
  assert.ok(cells.every(x=>x.trim()),"Empty gloss: "+line);
  return [cells[0],cells.slice(1)];
 }));
}
const common=glossMap(enclosed(shared,"COMMON_READING_GLOSS=parseGloss("));
const extended=glossMap(enclosed(shared,"EXPANDED_READING_GLOSS=parseGloss("));
const entries=[],seen=new Set(),allGerman=new Set();
for(const file of [sourceA,sourceB]){
 const sections=file.split(/\n id:"/).slice(1);
 assert.equal(sections.length,3,"Exactly three stories per source module");
 for(const section of sections){
  const id=section.slice(0,section.indexOf('"'));
  const level=section.match(/level:"(A0|A1)"/)?.[1];
  assert.ok(level,"Missing CEFR level: "+id);
  assert.ok(!seen.has(id),"Repeated story ID: "+id);seen.add(id);
  assert.ok(section.match(/title:\{de:"([^"]+)",uk:"([^"]+)",en:"([^"]+)"\}/),"Missing story titles: "+id);
  const own=glossMap(enclosed(section,"glossary:parseGloss("));
  const rawLines=section.split(" sentences:[")[1]?.split(" paragraphEnds:")[0]||"";
  const sentences=rawLines.split("\n").filter(x=>x.trim().startsWith("[")).map(line=>{
   const row=JSON.parse(line.trim().replace(/,$/,""));
   assert.equal(row.length,3,"Incomplete trilingual story sentence: "+id);
   return row;
  });
  assert.equal(sentences.length,20,"Each story must have 20 purposeful sentences: "+id);
  const breaks=section.match(/paragraphEnds:\[([0-9, ]+)\]/)?.[1].split(",").map(Number);
  assert.deepEqual(breaks,[5,10,15,20],"Exactly four 5-sentence paragraphs required: "+id);
  const missing=[],tokens=[];
  for(const [de,uk,en] of sentences){
   assert.ok(de.length>=15&&uk.length>=12&&en.length>=12,"Empty bilingual text: "+id);
   assert.ok(/[.!?][“”„"']?$/.test(de),"Incomplete punctuation: "+id+" "+de);
   assert.ok(!allGerman.has(de),"Duplicate story narration sentence "+de);allGerman.add(de);
   for(const token of de.match(/\p{L}+/gu)||[]){
    tokens.push(token);
    if(!own[token]&&!common[token]&&!extended[token]&&!own[token.toLocaleLowerCase("de")]&&!common[token.toLocaleLowerCase("de")]&&!extended[token.toLocaleLowerCase("de")])missing.push(token);
   }
  }
  assert.deepEqual(missing,[],"Every word must have UA and EN meaning in "+id);
  const questions=(section.match(/^\s*Q\(/gm)||[]).length;
  assert.equal(questions,3,"Three comprehension questions per story: "+id);
  entries.push({id,level,sentences:sentences.length,words:tokens.length});
 }
}
assert.equal(entries.length,6,"Require six complete stories");
assert.equal(entries.filter(x=>x.level==="A0").length,2,"Need two A0 stories");
assert.equal(entries.filter(x=>x.level==="A1").length,4,"Need four A1 stories");
assert.equal(allGerman.size,120,"Exactly 120 unique German sentences required");
assert.ok(sourceA.includes("Karte|платіжна картка|payment card"),"Karte bakery = payment card");
assert.ok(sourceB.includes("Karte|листівка|greeting card"),"Karte parcel = greeting card");
assert.ok(sourceA.includes("Sie|вона|she")&&common.Sie[0].includes("Ви"),"Case-sensitive Sie translation missing");
for(const fragment of ['onReading={()=>openStory(null)}','screen==="lesen"','initialCinema={lesenStory} language={language}','onStory={id=>openStory(id)}']){
 assert.ok(app.includes(fragment),"Missing reading screen integration: "+fragment);
}
const home=read("src/StrudliHome.tsx");
assert.ok(home.includes("onClick={onReading}"),"Approved home reading button must be wired to Lesen");
for(const fragment of ["readingTokens(de)","readingGloss(word,story.glossary)","onClick={()=>tapWord(piece,index)}","lesenStoryParagraph","lesenFullTranslation","setShowTranslation","toggleNarration","playStoryNarration","stopNarration","setProgress(","localStorage.setItem(READING_PROGRESS_KEY"]){
 assert.ok(component.includes(fragment),"Reading UX regression: "+fragment);
}
assert.ok(!component.includes("lesenSentenceAudio"),"Do not restore per-sentence reading buttons");
assert.ok(narration.includes("paragraphEnds.map")&&narration.includes("speech.onend=()=>speakPart(i+1)"),"The whole story must play as one session");
assert.ok(narration.includes('RECORDED_STORY_AUDIO:Readonly<Partial<Record<string,string>>>={}'),"Do not invent HeyGen audio URLs");
assert.ok(read("src/progress.ts").includes('"strudli-lesen-progress-v1"'),"Existing export must carry reading scores");
for(const fragment of [".lesenHub",".lesenHomeLaunch",".lesenStoryParagraph",".lesenWordDetail{position:fixed",".lesenFullTranslationToggle",".lesenHub button:focus-visible","@media(max-width:550px)"]){
 assert.ok(styles.includes(fragment),"Mobile storybook layout or accessibility missing: "+fragment);
}
console.log("Stage 09B Lesen QA PASS: six 20-sentence plotted stories in 24 flowing paragraphs, 120 DE/UA/EN sentences, 18 quizzes, "+entries.reduce((a,x)=>a+x.words,0)+" tappable words with contextual glosses; continuous narrator and saved progress.");
console.log(JSON.stringify(entries));
