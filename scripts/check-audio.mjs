/** Regression guard: one continuous article+noun utterance on correct answers. */
import {readFileSync} from "node:fs";
const source=readFileSync(new URL("../src/germanAudio.ts",import.meta.url),"utf8");
const game=readFileSync(new URL("../src/App.tsx",import.meta.url),"utf8");
if(source.includes("const segments=article?"))throw Error("Article and noun are still spoken separately");
if(!source.includes("await sayWithVoice(`${article} ${cleanWord}`,token)"))throw Error("Missing single article+noun utterance");
if(!source.includes("await recording(cleanWord,token)"))throw Error("Standalone word recording fallback lost");
if(!source.includes("if(article){"))throw Error("Missing article phrase branch");
if(!game.includes('speak(word.audioText||word.de,word.kind==="noun"?choice:undefined)'))throw Error("Correct answer must use the chosen article in one phrase");
if(!game.includes('feedbackSound("correct",Math.min(3,flames+1));gen.current++;void speak(word.audioText||word.de,word.kind==="noun"?choice:undefined)'))throw Error("Word pronunciation must start during the same answer tap as the flame sound");
if(game.includes("wordAudioToken")||game.includes("},880)"))throw Error("Delayed correct-answer speech timer must not return");
const library=readFileSync(new URL("../src/Library.tsx",import.meta.url),"utf8");
if(library.includes('speak(w.gender+" "+w.de)')||library.includes('speak(selected.gender+" "+selected.de)'))throw Error("Dictionary still speaks undefined for non-nouns");
if(!library.includes("speak(w.audioText||w.de,w.gender)")||!library.includes("speak(selected.audioText||selected.de,selected.gender)"))throw Error("Dictionary lacks unified noun/verb pronunciation");
console.log("Audio QA passed: word speaks with flame sound on the same tap; article and noun remain one phrase.");
