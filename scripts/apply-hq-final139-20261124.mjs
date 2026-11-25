import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const file=p=>new URL('../'+p,import.meta.url);
const catalog=file('src/data.ts');
const source=readFileSync(catalog,'utf8');
const match=source.match(/export const DEMO_WORDS:Word\[\]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
assert.ok(match,'Vocabulary markers missing');
const words=JSON.parse(match[1]);assert.equal(words.length,1177);
const manifest=JSON.parse(readFileSync(file('public/photos/hq/approved-final139-manifest-20261124.json'),'utf8'));
assert.equal(manifest.items.length,139);
const byId=new Map(words.map(w=>[w.id,w])),seen=new Set(),paths=new Set();
function sizeOf(b){
 assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');
 for(let p=12;p+8<=b.length;){const type=b.toString('ascii',p,p+4),n=b.readUInt32LE(p+4),q=p+8;assert.ok(q+n<=b.length);
  if(type==='VP8X')return [1+b.readUIntLE(q+4,3),1+b.readUIntLE(q+7,3)];
  if(type==='VP8 '){assert.equal(b.readUIntLE(q+3,3),0x2a019d);return [b.readUInt16LE(q+6)&0x3fff,b.readUInt16LE(q+8)&0x3fff];}
  if(type==='VP8L'){assert.equal(b[q],0x2f);const bits=b.readUInt32LE(q+1);return [1+(bits&0x3fff),1+((bits>>>14)&0x3fff)];}
  p=q+n+(n%2);
 }throw Error('Unsupported WebP');
}
for(const item of manifest.items){
 assert.ok(!seen.has(item.id)&&!paths.has(item.asset),'Duplicate HQ entry');seen.add(item.id);paths.add(item.asset);
 const w=byId.get(item.id);assert.ok(w,item.id);assert.equal(w.de,item.de);assert.equal(w.gender??null,item.gender??null);
 assert.match(item.asset,/^\/photos\/hq\/[a-z0-9-]+\.webp$/);
 const bytes=readFileSync(file('public'+item.asset));assert.equal(bytes.length,item.bytes,item.id);
 assert.deepEqual(sizeOf(bytes),[1536,1024],item.id+' dimensions');
 assert.equal(createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),item.gitBlobSha,item.id+' git hash');
 if(item.sha256)assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256,item.id+' sha256');
 w.photo=item.asset;
}
writeFileSync(catalog,source.replace(match[1],()=>JSON.stringify(words)));
const finalWords=JSON.parse(readFileSync(catalog,'utf8').match(/export const DEMO_WORDS:Word\[\]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/)[1]);
const finalById=new Map(finalWords.map(w=>[w.id,w]));
for(const item of manifest.items)assert.equal(finalById.get(item.id).photo,item.asset);
writeFileSync(file('public/approved-final139-photo-status.json'),JSON.stringify({date:manifest.date,count:139,wordCount:words.length,verified:{uniqueIds:139,uniquePaths:139,dimensions:'1536x1024',checksums:139},items:manifest.items.map(({id,de,asset})=>({id,de,asset}))},null,2)+'\n');
console.log('Final approved Strudli HQ: 139/139 exact local WebP files, dimensions and checksums verified, vocabulary mappings applied.');
