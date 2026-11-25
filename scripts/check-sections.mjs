import {readFileSync} from "node:fs";
const read=(p)=>readFileSync(new URL(p,import.meta.url),"utf8");
const sectionSource=read("../src/learningSections.ts");
const data=read("../src/data.ts");
const app=read("../src/App.tsx");
const home=read("../src/StrudliHome.tsx");
const chooser=read("../src/TopicChooser.tsx");
const sectionIds=[...sectionSource.matchAll(/topicIds:\[([^\]]+)\]/g)].flatMap(m=>JSON.parse("["+m[1]+"]"));
const topicMatches=data.match(/export const DEMO_TOPICS:Topic\[]=(\[[\s\S]*?\]);\nexport const DEMO_WORDS/);
const wordsMatch=data.match(/export const DEMO_WORDS:Word\[]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
if(!topicMatches||!wordsMatch)throw Error("Catalog not found");
const topics=JSON.parse(topicMatches[1]),words=JSON.parse(wordsMatch[1]);
if(sectionIds.length!==topics.length)throw Error("Sections do not contain all topics: "+sectionIds.length+"/"+topics.length);
if(new Set(sectionIds).size!==sectionIds.length)throw Error("A subtopic appears in multiple sections");
for(const t of topics)if(!sectionIds.includes(t.id))throw Error("Orphan subtopic: "+t.id);
for(const w of words)if(!sectionIds.includes(w.topic))throw Error("Orphan vocabulary word: "+w.id+" "+w.topic);
if(!app.includes("sections={LEARNING_SECTIONS}")||!home.includes("sections.map("))throw Error("Homepage must display parent sections");
if(!app.includes("function startWords(ids:string[])"))throw Error("Stable word-id launcher missing");
if(chooser.includes("topicGroups("))throw Error("Legacy subtopic selector still active");
if(!chooser.includes("section.topicIds.includes(w.topic)"))throw Error("Cross-topic mix unsupported");
if(!read("../src/TopicChooser.tsx").includes('w.tier!=="extra"'))throw Error("Beginner lessons do not filter rare words");
if(!read("../src/TopicChooser.tsx").includes('Math.min(16,pool.length)'))throw Error("Per-round lesson cap missing");
// A hero cover must illustrate the same concrete object as its pictogram.
for(const line of sectionSource.split("\n").filter(line=>line.includes("coverWordId:"))){
 const coverId=line.match(/coverWordId:"([^"]+)"/)?.[1];
 const icon=line.match(/emoji:"([^"]+)"/)?.[1];
 const card=words.find(w=>w.id===coverId);
 if(!card||!card.photo)throw Error("Missing hero cover image: "+coverId);
 if(card.emoji!==icon)throw Error("Hero photo/icon mismatch: "+coverId+" "+card.emoji+" != "+icon);
}
if(!home.includes("section.coverWordId?DEMO_WORDS.find("))throw Error("Homepage selects a random mismatching subtopic photo");
for(const [id,icon] of [["ww-new-027","🫑"],["ww-new-037","🍒"],["ww-new-113","🐖"],["ww-new-121","🐍"],["ww-new-130","⚡"],["ww-new-212","🐟"]]){
 const row=words.find(w=>w.id===id);if(row?.emoji!==icon)throw Error("Misleading default emoji: "+id);
}
console.log("Sections QA passed: "+sectionIds.length+" distinct subtopics mapped to ten parent sections, "+words.length+" vocabulary records preserved.");
