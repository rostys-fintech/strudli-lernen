/**
 * WortWelt — the exact image files approved on 21 November 2026.
 * Reassembles Git-tracked chunks, validates the archive and every picture,
 * then applies only the approved card and cover mappings for this build.
 * No third-party requests and no changes to other cards or app behaviour.
 */
import {createHash} from 'node:crypto';
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {resolve, dirname, join, basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {inflateRawSync} from 'node:zlib';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const base=join(root,'assets','approved-20261121');
const numberOfParts=15;
const expectedArchiveSha='3fe29849e09985498844e04823f99586649f234e7b1637494a1a59bc9d55e0a4';
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
const assert=(ok,message)=>{if(!ok)throw Error('Approved-photo validation: '+message)};
const bytes=Buffer.concat(Array.from({length:numberOfParts},(_,i)=>readFileSync(join(base,`ww397_part_${String(i).padStart(2,'0')}.bin`))));
assert(sha256(bytes)===expectedArchiveSha,'archive sha256 mismatch');
const entries=new Map();
// ZipFile.writestr creates non-encrypted, ordinary deflate entries with local sizes.
let offset=0;
while(offset+4<=bytes.length&&bytes.readUInt32LE(offset)===0x04034b50){
  const flags=bytes.readUInt16LE(offset+6);
  const method=bytes.readUInt16LE(offset+8);
  const compressed=bytes.readUInt32LE(offset+18);
  const expanded=bytes.readUInt32LE(offset+22);
  const filenameLength=bytes.readUInt16LE(offset+26);
  const extraLength=bytes.readUInt16LE(offset+28);
  assert(!(flags&0x08),'zip data-descriptor flag not supported');
  assert(!(flags&0x01),'encrypted zip entry refused');
  const start=offset+30;
  const name=bytes.toString('utf8',start,start+filenameLength);
  const dataStart=start+filenameLength+extraLength;
  const dataEnd=dataStart+compressed;
  assert(dataEnd<=bytes.length,'truncated zip entry '+name);
  const part=bytes.subarray(dataStart,dataEnd);
  const result=method===0?part:method===8?inflateRawSync(part):null;
  assert(result,'unsupported zip compression '+method);
  assert(result.length===expanded,'bad uncompressed length '+name);
  assert(!name.startsWith('/')&&!name.includes('..')&&!name.includes('\\'),'unsafe zip entry '+name);
  assert(!entries.has(name),'duplicate archive entry '+name);
  entries.set(name,result);
  offset=dataEnd;
}
assert(entries.size===398,'expected 397 WebP + one manifest, got '+entries.size);
assert(entries.has('manifest.json'),'archive manifest absent');
const manifest=JSON.parse(entries.get('manifest.json').toString('utf8'));
assert(manifest.total_in_archive===397&&manifest.items.length===397,'approved count mismatch');
assert(manifest.original_approved===243&&manifest.new_exported_approved===154,'provenance count mismatch');
const rejected=new Set(['C33','C34','C40']);
const seenNumbers=new Set(),seenIds=new Set();
const mappedPaths=new Map();
for(const item of manifest.items){
  assert(!rejected.has(item.number),'unapproved cover present '+item.number);
  assert(!seenNumbers.has(item.number),'duplicate card number '+item.number);
  assert(!seenIds.has(item.card_id),'duplicate card/topic ID '+item.card_id);
  seenNumbers.add(item.number);seenIds.add(item.card_id);
  const source=item.file;
  assert(/^assets\/(cards|covers)\/(?:\d{4}|C\d{2})-[A-Za-z0-9-]+\.webp$/.test(source),'unexpected file path '+source);
  const raw=entries.get(source);
  assert(raw&&raw.length===item.size,'asset missing or different size '+source);
  assert(raw.subarray(0,4).toString()==='RIFF'&&raw.subarray(8,12).toString()==='WEBP','invalid WebP '+source);
  assert(sha256(raw)===item.sha256,'image SHA mismatch '+source);
  const destRelative=source.replace(/^assets\//,'');
  const publicPath='/photos/approved-20261121/'+destRelative;
  const dest=join(root,'public',publicPath.slice(1));
  mkdirSync(dirname(dest),{recursive:true});
  writeFileSync(dest,raw);
  mappedPaths.set(item.number,publicPath);
}
const sourceFile=join(root,'src','data.ts');
const source=readFileSync(sourceFile,'utf8');
const topicMatch=source.match(/export const DEMO_TOPICS:Topic\[]=(\[[\s\S]*?\]);\nexport const DEMO_WORDS/);
const wordMatch=source.match(/export const DEMO_WORDS:Word\[]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
assert(topicMatch&&wordMatch,'source catalog markers changed');
const topics=JSON.parse(topicMatch[1]),words=JSON.parse(wordMatch[1]);
const topicById=new Map(topics.map(x=>[x.id,x]));
const wordById=new Map(words.map(x=>[x.id,x]));
const sectionCovers=new Map();
let updatedWords=0,updatedTopics=0;
for(const item of manifest.items){
  const pic=mappedPaths.get(item.number);
  if(item.kind==='word'){
    const card=wordById.get(item.card_id);
    assert(card,'missing vocabulary ID '+item.card_id);
    const label=(card.gender?card.gender+' ':'')+card.de;
    assert(label===item.de,'wrong vocabulary mapping '+item.number+': '+item.de+' vs '+label);
    // Preserve higher-resolution source images for the two low-quality approved cards.
    // They are mirrored by mirror-photos.mjs before this archive is applied.
    // adverbs-176 (wirklich): replaced by an owner-approved HQ image on 25.11.2026.
    if(item.card_id!=='travel-444'&&item.card_id!=='transport-584'&&item.card_id!=='adverbs-176')card.photo=pic;
    updatedWords++;
  }else{
    const topic=topicById.get(item.card_id);
    if(topic){
      assert(topic.de===item.de,'cover topic mismatch '+item.number);
      topic.photo=pic;
      updatedTopics++;
    }else{
      assert(['food','home'].includes(item.card_id),'missing cover section '+item.card_id);
      sectionCovers.set(item.card_id,pic);
    }
  }
}
assert(updatedWords===379,'expected 379 replaced word images, got '+updatedWords);
assert(updatedTopics===16,'expected 16 subtopic covers, got '+updatedTopics);
assert(sectionCovers.size===2,'expected two section covers');
// Preserve all other catalog fields, IDs, topics and review settings.
const patched=source.replace(topicMatch[1],JSON.stringify(topics)).replace(wordMatch[1],JSON.stringify(words));
assert(patched!==source,'no photo changes were applied');
writeFileSync(sourceFile,patched);
const sectionsFile=join(root,'src','learningSections.ts');
let sections=readFileSync(sectionsFile,'utf8');
const marker='export function topicsForSection';
assert(sections.includes(marker),'section source marker missing');
const sectionOverrides=[...sectionCovers].map(([id,photo])=>`{const section=LEARNING_SECTIONS.find(s=>s.id===${JSON.stringify(id)});if(!section)throw Error('Missing section ${id}');section.coverPhoto=${JSON.stringify(photo)};delete section.coverWordId;}`).join('\n');
sections=sections.replace(marker,sectionOverrides+'\n'+marker);
writeFileSync(sectionsFile,sections);
const status={date:'2026-11-21',approved:397,original:243,generatedOrRevised:154,updatedWords,updatedTopics,updatedSections:2,missingExportedAssets:manifest.new_missing_approved,unapprovedCovers:['C33','C34','C40'],sha256:expectedArchiveSha};
writeFileSync(join(root,'public','approved-photo-status.json'),JSON.stringify(status,null,2)+'\n');
console.log('WortWelt 2026-11-21 approved photos applied:',JSON.stringify(status));
