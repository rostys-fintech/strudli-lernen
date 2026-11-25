/** Restore and verify the original user-approved dictionary image #0571. */
import {readFileSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";
const approved="/photos/approved-20261121/cards/0571-study-661.webp";
const expectedHash="27b90a212a4193239277fd0238a135a39093b374096969fa55b76127345f3d15";
const bytes=readFileSync(new URL("../public"+approved,import.meta.url));
if(bytes.length!==76754||bytes.toString("ascii",0,4)!=="RIFF"||bytes.toString("ascii",8,12)!=="WEBP"||createHash("sha256").update(bytes).digest("hex")!==expectedHash)
 throw Error("User-approved dictionary photo #0571 missing or modified");
const path=new URL("../src/data.ts",import.meta.url),source=readFileSync(path,"utf8");
const match=source.match(/export const DEMO_WORDS:Word\[]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
if(!match)throw Error("Vocabulary catalog marker missing");
const words=JSON.parse(match[1]),card=words.find(w=>w.id==="study-661");
if(!card||card.de!=="Wörterbuch"||card.gender!=="das")throw Error("Dictionary card identity changed");
if(card.photo!==approved){card.photo=approved;writeFileSync(path,source.replace(match[1],JSON.stringify(words)));}
console.log("Approved dictionary photo #0571 restored and SHA256 verified");
