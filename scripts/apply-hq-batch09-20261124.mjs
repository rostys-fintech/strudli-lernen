import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname, resolve, join} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)), '..');
const catalog=join(root,'src/data.ts');
const source=readFileSync(catalog,'utf8');
const match=source.match(/export const DEMO_WORDS:Word\[\]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
assert.ok(match,'Vocabulary markers missing');
const words=JSON.parse(match[1]); assert.equal(words.length,1177);
const manifest=JSON.parse(readFileSync(join(root,'public/photos/hq/approved-batch09-manifest-20261124.json'),'utf8'));
assert.equal(manifest.items.length,10); const ids=new Set();
const byId=new Map(words.map(w=>[w.id,w]));
for(const item of manifest.items){
  assert.ok(!ids.has(item.id)); ids.add(item.id);
  const w=byId.get(item.id); assert.ok(w,item.id); assert.equal(w.gender??null,item.gender??null); assert.equal(w.de,item.de);
  assert.match(item.asset,/^\/photos\/hq\/[a-z0-9-]+-hq-20261124-b09\.webp$/);
  const data=readFileSync(join(root,'public',item.asset.slice(1)));
  assert.equal(data.length,item.bytes); assert.equal(createHash('sha256').update(data).digest('hex'),item.sha256);
  assert.equal(data.toString('ascii',0,4),'RIFF'); assert.equal(data.toString('ascii',8,12),'WEBP');
  w.photo=item.asset;
}
writeFileSync(catalog,source.replace(match[1],()=>JSON.stringify(words)));
writeFileSync(join(root,'public/approved-batch09-photo-status-20261124.json'),JSON.stringify({date:manifest.date,count:10,wordCount:words.length,items:manifest.items.map(({id,asset})=>({id,asset}))},null,2)+'\n');
console.log('Applied batch 09: 10 user-approved HQ images after prior imports.');
