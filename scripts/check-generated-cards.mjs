import {readFileSync} from "node:fs";
import {CARDS,makeCardPng} from "./generate-vocab-cards.mjs";
const source=readFileSync(new URL("../src/data.ts",import.meta.url),"utf8");
const match=source.match(/export const DEMO_WORDS:Word\[]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
if(!match)throw Error("Missing vocabulary list");
const nouns=JSON.parse(match[1]).filter(x=>x.kind==="noun");
if(nouns.length!==736)throw Error("Expected 736 nouns, got "+nouns.length);
if(nouns.some(x=>!x.photo||x.photo.startsWith("data:image/svg+xml")))throw Error("Noun has missing image or SVG placeholder");
if(new Set(nouns.map(x=>x.photo)).size!==736)throw Error("Not all 736 noun images unique");
const map=new Map(nouns.map(x=>[x.id,x]));
const manifest=JSON.parse(readFileSync(new URL("../public/photos/custom/manifest.json",import.meta.url),"utf8"));
if(CARDS.length!==32||manifest.images.length!==32)throw Error("Expected 32 original PNG images");
const calendarIds=new Set(Array.from({length:19},(_,i)=>`time-${774+i}`));
const ids=new Set();
for(const card of CARDS){
 const [id]=card,path="/photos/custom/"+id+".png";
 if(ids.has(id))throw Error("Duplicate card "+id);ids.add(id);
 if(!calendarIds.has(id)&&map.get(id)?.photo!==path)throw Error("Incorrect word-to-image association "+id);
 if(!manifest.images.some(x=>x.id===id&&x.path===path))throw Error("Manifest missing "+id);
 const stored=readFileSync(new URL("../public"+path,import.meta.url));
 if(stored.subarray(0,8).toString("hex")!=="89504e470d0a1a0a")throw Error("Not PNG "+id);
 if(stored.readUInt32BE(16)!==768||stored.readUInt32BE(20)!==768)throw Error("PNG size mismatch "+id);
 if(!Buffer.from(makeCardPng(card)).equals(stored))throw Error("PNG fails byte-for-byte renderer consistency "+id);
}
console.log("PNG QA passed: 13 original non-calendar graphic associations preserved; 19 retired calendar PNGs archived; 736 noun images unique.");
