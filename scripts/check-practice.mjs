import{readFileSync}from"node:fs";
const source=readFileSync(new URL("../src/practice.ts",import.meta.url),"utf8");
const blocks=[["verbRows","const caseRows",24],["caseRows","const dialogueRows",28],["dialogueRows","const shuffled",24]];
let count=0;
for(const [name,after,expected]of blocks){
 const start=source.indexOf("const "+name+"="),end=source.indexOf(";\n"+after,start);
 if(start<0||end<0)throw Error("Missing practice rows: "+name);
 const raw=source.slice(start+("const "+name+"=").length,end);
 const rows=JSON.parse(raw);
 if(rows.length!==expected)throw Error("Practice count "+name+": "+rows.length);
 for(const [i,row]of rows.entries()){
  const options=name==="dialogueRows"?[row[2],row[3],row[4]]:[row[2],row[3],row[4]];
  if(new Set(options).size!==3)throw Error("Ambiguous options "+name+" "+i);
  if(!row[0]||!row[1]||!row[5])throw Error("Incomplete exercise "+name+" "+i);
 }
 count+=rows.length;
}
const dialogueText=source.slice(source.indexOf("const dialogueRows="),source.indexOf(";\nconst shuffled"));
const dialogues=JSON.parse(dialogueText.slice("const dialogueRows=".length));
for(const [i,row] of dialogues.entries()){
 if(row.length!==7||!row[6])throw Error("Dialogue missing English translation "+i);
 if(new Set(row.slice(2,5)).size!==3)throw Error("Duplicate or trivial answer variants "+i);
}
const sentencesStart=source.indexOf("const sentenceRows="),sentencesEnd=source.indexOf(";\nexport function exercises",sentencesStart);
if(sentencesStart<0||sentencesEnd<0)throw Error("Missing sentence-building exercises");
const sentenceSection=source.slice(sentencesStart,sentencesEnd);
const sentences=sentenceSection.split("\n").filter(row=>/^\s*\{de:"/.test(row));
if(sentences.length!==12)throw Error("Expected twelve curated word-order exercises");
for(const [i,row] of sentences.entries()){
 if(!['de:','uk:','en:','tipUk:','tipEn:'].every(field=>row.includes(field)))throw Error("Incomplete bilingual sentence "+i);
 const german=row.match(/de:"([^"]+)"/)?.[1]||"";
 if(german.split(" ").length<4||german.split(" ").length>9)throw Error("Word-order tile count invalid "+i);
}
const practice=readFileSync(new URL("../src/Practice.tsx",import.meta.url),"utf8");
const css=readFileSync(new URL("../src/practice-studio.css",import.meta.url),"utf8");
for(const token of ['practiceSessionChooser','practiceModeDeck','practiceStudioChatChoices','practiceSentenceInteraction','practiceNextDock','practiceStudioResults'])if(!practice.includes(token))throw Error("Missing playable experience "+token);
for(const token of ['.practiceStudioChoices','.practiceStudioChatChoices','.practiceBuilderTiles','@media(max-width:640px)','prefers-reduced-motion:reduce'])if(!css.includes(token))throw Error("Practice responsive style missing "+token);
if(!practice.includes('setSession("quiz")')||!practice.includes('setSession("mastery")'))throw Error("Both session styles must be selectable");
console.log("Practice content QA passed:",count,"fixed German exercises +",sentences.length,"word-order puzzles, five game formats, accessible quiz/mastery modes.");

