/** Apply 22 individually user-approved, self-hosted HQ photos after all old archive imports. Preview only. */
import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {join,dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const catalogFile=join(root,"src/data.ts");
const source=readFileSync(catalogFile,"utf8");
const match=source.match(/export const DEMO_WORDS:Word\[\]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
assert.ok(match,"Vocabulary markers missing");
const words=JSON.parse(match[1]);
assert.equal(words.length,1177,"Expected 1,177 words");
const approved=JSON.parse(readFileSync(join(root,"public/photos/hq/approved22-manifest-20261123.json"),"utf8"));
assert.equal(approved.items.length,22,"Expected exactly 22 approved images");
const byId=new Map(words.map(w=>[w.id,w]));
const seen=new Set();
for(const item of approved.items){
 assert.ok(!seen.has(item.id),"Duplicate approval "+item.id);
 seen.add(item.id);
 const word=byId.get(item.id);
 assert.ok(word,"Unknown vocabulary ID "+item.id);
 assert.equal(word.gender,item.gender,"Article mismatch at "+item.number);
 assert.equal(word.de,item.de,"German word mismatch at "+item.number);
 assert.match(item.asset,/^\/photos\/hq\/\d{4}-[a-z0-9-]+-hq-20261123\.webp$/);
 const bytes=readFileSync(join(root,"public",item.asset.slice(1)));
 assert.equal(bytes.length,item.bytes,"Changed approved photo bytes at "+item.number);
 assert.ok(bytes.toString("ascii",0,4)==="RIFF"&&bytes.toString("ascii",8,12)==="WEBP","Invalid image at "+item.number);
 word.photo=item.asset;
}
const replaced=source.replace(match[1],JSON.stringify(words));
assert.notEqual(replaced,source,"No vocabulary photos changed");
writeFileSync(catalogFile,replaced);
writeFileSync(join(root,"public","approved22-photo-status.json"),JSON.stringify({date:approved.date,count:22,wordCount:words.length,items:approved.items.map(({number,id,asset})=>({number,id,asset}))},null,2)+"\n");
console.log("Strudli user-approved HQ photos applied after historical imports:",approved.items.map(i=>i.number).join(", "));
