/** The user explicitly approved the basket of mixed fruit for das Obst on 2026-11-23.
 * Enforce this immutable final mapping AFTER importing older photo archives,
 * which otherwise may restore an older picture of berries.
 */
import {readFileSync,writeFileSync,statSync} from "node:fs";
const file=new URL("../public/obst-fruit-basket-approved.avif",import.meta.url);
const image=readFileSync(file);
if(image.length<15000||image.toString("ascii",4,8)!=="ftyp"||!image.includes(Buffer.from("avif")))
 throw Error("User-approved Obst basket image missing or corrupt");
const dataUrl=new URL("../src/data.ts",import.meta.url);
const source=readFileSync(dataUrl,"utf8");
const match=source.match(/export const DEMO_WORDS:Word\[]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
if(!match)throw Error("Vocabulary source not found");
const words=JSON.parse(match[1]);
const obst=words.find(x=>x.id==="food-290");
if(!obst||obst.de!=="Obst"||obst.gender!=="das")throw Error("Obst identity mismatch");
const approved="/obst-fruit-basket-approved.avif";
if(obst.photo!==approved){obst.photo=approved;writeFileSync(dataUrl,source.replace(match[1],JSON.stringify(words)));}
console.log("User-approved Obst basket verified and mapped: "+approved+" ("+statSync(file).size+" B)");
