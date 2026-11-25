import {readFileSync} from "node:fs";
import {answerOptionsFor} from "../src/answerOptions.ts";
const text=readFileSync(new URL("../src/data.ts",import.meta.url),"utf8");
const match=text.match(/export const DEMO_WORDS:Word\[]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
if(!match)throw Error("Missing vocabulary for answer options");
const words=JSON.parse(match[1]);
for(const w of words.filter(x=>!x.pluralOnly).slice(0,250)){
 const options=answerOptionsFor(w,words);
 if(options.length!==3||new Set(options).size!==3)throw Error("Need three distinct options: "+w.id);
 if(!options.includes(w.kind==="noun"?w.gender:w.uk))throw Error("Correct choice missing: "+w.id);
 if(w.kind==="noun"&&options.join(",")!=="der,die,das")throw Error("Article game changed");
}
const verb=words.find(w=>w.id==="verbs-815");
const alternativeChoices=new Set();
for(let i=0;i<30;i++)for(const option of answerOptionsFor(verb,words))if(option!==verb.uk)alternativeChoices.add(option);
if(alternativeChoices.size<5)throw Error("Non-noun distractors are repetitive");
console.log("Answer options QA passed: 3 distinct choices, correct choice present, varied plausible alternatives.");
