/** Keep the user's 23 Nov approved Schrank photo even after historical photo batch imports. */
import {readFileSync,writeFileSync,statSync} from "node:fs";
import {fileURLToPath} from "node:url";
const dataUrl=new URL("../src/data.ts",import.meta.url);
const photoUrl=new URL("../public/photos/custom/schrank-approved-20261123.webp",import.meta.url);
const photo=readFileSync(photoUrl);
if(photo.length<20000||photo.toString("ascii",0,4)!=="RIFF"||photo.toString("ascii",8,12)!=="WEBP")throw Error("Approved wardrobe image missing or invalid");
const source=readFileSync(dataUrl,"utf8");
const match=source.match(/export const DEMO_WORDS:Word\[]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
if(!match)throw Error("Vocabulary catalog not found");
const words=JSON.parse(match[1]);
const word=words.find(w=>w.id==="home-355");
if(!word||word.de!=="Schrank"||word.gender!=="der")throw Error("Schrank card identity changed");
const approved="/photos/custom/schrank-approved-20261123.webp";
if(word.photo!==approved){word.photo=approved;writeFileSync(dataUrl,source.replace(match[1],JSON.stringify(words)));}
console.log("Approved Schrank image verified and mapped: "+approved+" ("+statSync(photoUrl).size+" B)");
