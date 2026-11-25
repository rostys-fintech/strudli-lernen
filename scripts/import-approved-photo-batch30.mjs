import {readFileSync,writeFileSync,existsSync,statSync} from 'node:fs';
const manifest=JSON.parse(readFileSync('docs/batch30-verified-photo-sources-20261025.json','utf8'));
if(manifest.targets.length!==4||new Set(manifest.targets.map(x=>x.id)).size!==4)throw Error('Expected exactly four approved cards');
const file='src/data.ts',raw=readFileSync(file,'utf8');
const m=raw.match(/export const DEMO_WORDS:Word\[]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
if(!m)throw Error('Missing full catalog');
const words=JSON.parse(m[1]),byID=new Map(words.map(x=>[x.id,x]));
const changes=[];
for(const target of manifest.targets){
  const word=byID.get(target.id);
  if(!word||word.de!==target.de||word.uk!==target.uk||word.photo!==target.expectedPhoto)throw Error('Mismatch or previously updated: '+target.id);
  if(!existsSync(target.newFile)||statSync(target.newFile).size<15000)throw Error('Photo not present: '+target.id);
  const photo='/'+target.newFile.replace(/^public\//,'');
  word.photo=photo;changes.push({id:word.id,de:word.de,uk:word.uk,old:target.expectedPhoto,new:photo,author:target.author,license:target.license,sourcePage:target.originalPage,choice:target.choice});
}
if(words.length!==1177||words.filter(x=>x.kind==='noun').length!==736||new Set(words.filter(x=>x.kind==='noun').map(x=>x.photo)).size!==736)throw Error('Catalog counts or unique photos regressed');
writeFileSync(file,raw.replace(m[1],JSON.stringify(words)));
const mp='public/photos/curated/manifest.json';const mObj=JSON.parse(readFileSync(mp,'utf8'));const ids=new Set(changes.map(x=>x.id));
const oldCredits=mObj.photos.filter(x=>ids.has(x.word_id));
mObj.photos=mObj.photos.filter(x=>!ids.has(x.word_id));
writeFileSync(mp,JSON.stringify(mObj,null,2)+'\n');
writeFileSync('docs/batch30-superseded-credits.json',JSON.stringify(oldCredits,null,2)+'\n');
writeFileSync('docs/batch30-verified-import-20261025.json',JSON.stringify({batch:30,date:'2026-10-25',imported:changes.length,changes},null,2)+'\n');
const esc=s=>String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const htmlPath='public/photo-credits.html';let credits=readFileSync(htmlPath,'utf8');
if(!credits.includes('id="batch30-credits"')){
  const rows=changes.map(x=>'<tr><td>'+esc(x.de)+'</td><td>'+esc(x.author)+'</td><td>'+esc(x.license)+'</td><td><a href="'+esc(x.sourcePage)+'">Pexels photo</a></td></tr>').join('');
  const section='<section id="batch30-credits"><h2>WortWelt — approved images batch 30</h2><table><thead><tr><th>Word</th><th>Creator</th><th>License</th><th>Source</th></tr></thead><tbody>'+rows+'</tbody></table></section>';
  if(!credits.includes('</body>'))throw Error('Credits page invalid');
  credits=credits.replace('</body>',section+'</body>');
  writeFileSync(htmlPath,credits);
}
const historyFile='docs/photo-qa-proposal-ledger-20261025.json';
const history=JSON.parse(readFileSync(historyFile,'utf8'));
for(const c of changes){
 if(history.records.some(x=>x.id===c.id))throw Error('Prior proposal conflict: '+c.id);
 history.records.push({id:c.id,proposedIn:[30],status:'imported',notes:['Approved variant '+c.choice+' on October 25; published in batch 30']});
}
history.records.sort((a,b)=>a.id.localeCompare(b.id));
history.stats.importedKnown+=changes.length;
history.stats.previouslyReviewedUnique+=changes.length;
history.stats.catalogPhotosReplacedEditorial+=changes.length;
history.latestImportDocuments.push('docs/batch30-verified-import-20261025.json');
history.lastUpdated='2026-10-25';
writeFileSync(historyFile,JSON.stringify(history,null,2)+'\n');
console.log('Batch30 imported:',changes.length,'checked card IDs and matching files, 736 unique nouns, history updated');
