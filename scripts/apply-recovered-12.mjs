/** Exact recovery of twelve pictures previously approved in the WortWelt review.
 * These are cropped from the already-reviewed image sheets, not new substitute photos.
 */
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {inflateRawSync} from 'node:zlib';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const assert=(b,m)=>{if(!b)throw Error('Recovered 12 approved images: '+m)};
const digest=b=>createHash('sha256').update(b).digest('hex');
const filename=join(root,'assets/approved-20261121/recovered-12.zip');
const bytes=readFileSync(filename);
assert(digest(bytes)==='307a0fefbc89e66209724ffdfb5c6e005c87163d8b4fea334e97dcffa1e3c1ef','ZIP changed');
let offset=0;const entries=new Map();
while(offset+4<=bytes.length&&bytes.readUInt32LE(offset)===0x04034b50){
 const flags=bytes.readUInt16LE(offset+6),method=bytes.readUInt16LE(offset+8);
 assert(!(flags&9),'zip data descriptor/encryption not expected');
 const compressed=bytes.readUInt32LE(offset+18),length=bytes.readUInt32LE(offset+22),nameLen=bytes.readUInt16LE(offset+26),extra=bytes.readUInt16LE(offset+28);
 const start=offset+30,name=bytes.toString('utf8',start,start+nameLen),dataOffset=start+nameLen+extra;
 const raw=bytes.subarray(dataOffset,dataOffset+compressed);
 const value=method===0?raw:method===8?inflateRawSync(raw):null;
 assert(value&&value.length===length,'bad entry '+name);
 assert(!name.includes('..')&&!name.startsWith('/'),'unsafe path '+name);
 entries.set(name,value);offset=dataOffset+compressed;
}
const manifest=JSON.parse(entries.get('manifest.json').toString('utf8'));
assert(manifest.count===12&&manifest.images.length===12&&entries.size===13,'12 photo set corrupted');
const expected=new Set(['0343','0352','0354','0370','0380','0384','0749','0750','0752','0758','0763','0764']);
const sourceFile=join(root,'src/data.ts');let source=readFileSync(sourceFile,'utf8');
const match=source.match(/export const DEMO_WORDS:Word\[]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
assert(match,'source catalog word-array marker not found');
const words=JSON.parse(match[1]);const byId=new Map(words.map(x=>[x.id,x]));
for(const x of manifest.images){
 assert(expected.delete(x.number),'unexpected recovered number '+x.number);
 assert(/^cards\/\d{4}-[A-Za-z0-9-]+\.webp$/.test(x.file),'bad file name '+x.file);
 const raw=entries.get(x.file);
 assert(raw&&raw.length===x.bytes&&digest(raw)===x.sha256,'image integrity '+x.number);
 assert(raw.subarray(0,4).toString()==='RIFF'&&raw.subarray(8,12).toString()==='WEBP','not WebP '+x.number);
 const word=byId.get(x.card_id);
 assert(word,'card missing '+x.card_id);
 assert((word.gender?word.gender+' ':'')+word.de===x.de,'German label mismatch '+x.number);
 const dest=join(root,'public/photos/approved-20261121',x.file);
 mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,raw);
 word.photo='/photos/approved-20261121/'+x.file;
}
assert(expected.size===0,'missing recovered numbers '+[...expected].join(','));
source=source.replace(match[1],JSON.stringify(words));writeFileSync(sourceFile,source);
const statusFile=join(root,'public/approved-photo-status.json');
const status=JSON.parse(readFileSync(statusFile,'utf8'));
assert(status.approved===397&&status.updatedWords===379,'base imported status wrong');
status.approved=409;
status.updatedWords=391;
status.generatedOrRevised=166;
const done=new Set(manifest.images.map(x=>x.number));
status.missingExportedAssets=status.missingExportedAssets.filter(x=>!done.has(x));
status.recoveredFromApprovedReviewSheets=[...done];
writeFileSync(statusFile,JSON.stringify(status,null,2)+'\n');
console.log('WortWelt recovered photos imported:',JSON.stringify({updatedWords:status.updatedWords,approved:status.approved,remaining:status.missingExportedAssets}));
