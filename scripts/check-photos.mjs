import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
const read=(name)=>readFileSync(new URL(name,import.meta.url),"utf8");
const data=read("../src/data.ts");
const match=data.match(/export const DEMO_WORDS:Word\[]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
if(!match)throw Error("Vocabulary unavailable");
const words=JSON.parse(match[1]);
const manifest=JSON.parse(read("../public/photos/curated/manifest.json"));
// Prevent a 100% badge masking missing images or invalid SVG.
const nouns=words.filter(w=>w.kind==="noun");
if(nouns.length!==736)throw Error("Expected 736 noun cards; got "+nouns.length);
const unpictured=nouns.filter(w=>!w.photo);
if(unpictured.length)throw Error("Missing noun visuals: "+unpictured.map(w=>w.id).join(", "));
const pictured=new Map();
for(const w of nouns){
 const other=pictured.get(w.photo);
 if(other)throw Error("Two noun cards reuse one picture: "+w.id+" (duplicate with "+other+")");
 pictured.set(w.photo,w.de);
 if(!w.photo.startsWith("data:image/svg+xml"))continue;
 let markup;
 try{markup=decodeURIComponent(w.photo.slice(w.photo.indexOf(",")+1));}
 catch{throw Error("Invalid SVG URI encoding: "+w.id);}
 if(!markup.startsWith("<svg ")||!markup.trimEnd().endsWith("</svg>"))throw Error("Invalid SVG wrapper: "+w.id);
 if(/&(?!amp;|lt;|gt;|apos;|quot;|#\d+;)/.test(markup))throw Error("Bad XML entity in SVG: "+w.id);
 const stack=[];
 for(const match of markup.matchAll(/<\/?([A-Za-z][A-Za-z0-9:-]*)\b[^>]*>/g)){
  const tag=match[0],name=match[1];
  if(tag.startsWith("</")){if(stack.pop()!==name)throw Error("Unbalanced SVG tag in "+w.id);}
  else if(!tag.endsWith("/>"))stack.push(name);
 }
 if(stack.length)throw Error("Unclosed SVG tag in "+w.id);
}
console.log("Checked all "+nouns.length+" noun illustrations, with valid SVG entities and nesting.");
const ids=new Set(),sources=new Set();
for(const photo of manifest.photos){
 if(ids.has(photo.word_id))throw Error("Duplicate photo entry: "+photo.word_id);
 ids.add(photo.word_id);
 const word=words.find(x=>x.id===photo.word_id);
 if(!word||`${word.gender} ${word.de}`!==photo.word)throw Error("Photo attached to wrong article/word: "+photo.word_id);
 if(photo.word_id==="study-661"){
  const local="/photos/approved-20261121/cards/0571-study-661.webp";
  if(word.photo!==local||photo.image_url!==local||photo.origin!=="user-approved-archive"||!photo.editorial_check.includes("Approved archive 2026-11-21"))
   throw Error("Wörterbuch must use the already approved photo #0571");
  // The importer extracts the photo after check:all; check approved manifest now.
  const archive=JSON.parse(read("../assets/approved-20261121/manifest.json"));
  const asset=archive.items.find(x=>x.number==="0571"&&x.card_id==="study-661");
  if(!asset||asset.sha256!=="27b90a212a4193239277fd0238a135a39093b374096969fa55b76127345f3d15"||asset.size!==76754)
   throw Error("Historic approved dictionary photo missing or modified");
  sources.add(local);continue;
 }
 if(photo.word_id==="food-290"){
  const approved="/obst-fruit-basket-approved.avif";
  if(word.photo!==approved||photo.image_url!==approved||photo.origin!=="user-approved-generated"||!photo.editorial_check.includes("Approved by user 2026-11-23"))throw Error("Obst must use the approved basket of assorted fruits");
  const data=readFileSync(new URL("../public"+approved,import.meta.url));
  if(data.length<15000||data.toString("ascii",4,8)!=="ftyp"||!data.includes(Buffer.from("avif")))throw Error("Approved Obst AVIF missing or corrupt");
  sources.add(photo.image_url);
  continue;
 }
 if(photo.word_id==="home-355"){
  const approved="/photos/custom/schrank-approved-20261123.webp";
  if(photo.image_url!==approved||word.photo!==approved||photo.origin!=="user-approved-generated"||!photo.editorial_check.includes("Approved by user 2026-11-23"))throw Error("Schrank must use exact user-approved generated local photo and truthful provenance");
  const data=readFileSync(new URL("../public"+approved,import.meta.url));
  if(data.length<20000||data.toString("ascii",0,4)!=="RIFF"||data.toString("ascii",8,12)!=="WEBP")throw Error("Approved wardrobe image missing/corrupt");
  sources.add(photo.image_url);
  continue;
 }

 // On Vercel, mirror-photos.mjs changes a successfully downloaded Wikimedia URL
 // into a deterministic /photos/<sha256>.jpg local asset before these checks run.
 const extension=new URL(photo.image_url).pathname.toLowerCase().endsWith(".png")?".png":".jpg";
 const hash=createHash("sha256").update(photo.image_url).digest("hex").slice(0,18);
 const mirroredPath="/photos/"+hash+extension;
 if(word.photo!==photo.image_url&&word.photo!==mirroredPath)throw Error("Photo URL not attached to catalog or mirrored file: "+photo.word_id);
 const sourcePage=photo.source_page||photo.commons_page;
 const isCommons=sourcePage?.startsWith("https://commons.wikimedia.org/wiki/File:")&&/^https:\/\/(thumb|upload)\.wikimedia\.org\//.test(photo.image_url);
 const isPexels=sourcePage?.startsWith("https://www.pexels.com/photo/")&&photo.image_url.startsWith("https://images.pexels.com/photos/")&&photo.license==="Pexels License";
 if(!isCommons&&!isPexels)throw Error("Unverified source/photo license: "+photo.word_id);
 if(!photo.license||!photo.author||!photo.editorial_check||!photo.image_note)throw Error("Missing rights or visual QA: "+photo.word_id);
 if(!(isCommons||isPexels))throw Error("Unexpected licensed media location: "+photo.word_id);
 if(sources.has(photo.image_url))throw Error("Photo reused across unrelated vocabulary cards: "+photo.word_id);
 sources.add(photo.image_url);
}
for(const [id,icon] of [["home-343","🛋️"],["clothes-392","🧥"],["clothes-407","🎒"],["transport-568","🚲"],["home-356","📚"]]){
 const card=words.find(x=>x.id===id);if(!card?.photo||card.emoji!==icon)throw Error("Latest photo/emoji inconsistency: "+id);
}
// Prevent regressions in the real game and in photo-backed subtopic navigation.
const topicsMatch=data.match(/export const DEMO_TOPICS:Topic\[]=(\[[\s\S]*?\]);\nexport const DEMO_WORDS/);
if(!topicsMatch)throw Error("Topic list unavailable for photo coverage checks");
const topics=JSON.parse(topicsMatch[1]);
const photographed=words.filter(w=>Boolean(w.photo)).length;
if(photographed<381)throw Error("Regressed vocabulary photo coverage: "+photographed);
const directlyPhotographed=topics.filter(t=>t.photo||words.some(w=>w.topic===t.id&&w.photo)).length;
if(directlyPhotographed<45)throw Error("Regressed subtopic photo coverage: "+directlyPhotographed+"/"+topics.length);
const chooser=read("../src/TopicChooser.tsx");
if(!chooser.includes('className="topicCoverImg"')||!chooser.includes('loading={index<2?"eager":"lazy"}')||!chooser.includes('fetchPriority={index<2?"high":"auto"}'))throw Error("Subtopic photos must prioritize visible cards and lazy-load remaining images");
if(!chooser.includes('onError={e=>{const img=e.currentTarget;'))throw Error("Subtopics must recover from photo load errors using bundled fallback assets");
const app=read("../src/App.tsx");
if(!app.includes('aria-pressed={language==="uk"}')||!app.includes('aria-pressed={language==="en"}'))throw Error("UA/EN language switch missing");
const extras=read("../src/englishExtras.ts");
const englishIds=new Set([...extras.matchAll(/"([^"]+)"\s*:\s*"/g)].map(x=>x[1]));
for(const w of words)if(!w.en&&!englishIds.has(w.id))throw Error("Missing bilingual word translation: "+w.id);
console.log("Photo + language QA passed: "+photographed+" illustrated words, "+directlyPhotographed+"/"+topics.length+" subtopics with topical images, complete UA/EN translations.");
if(!app.includes("<GamePicture key={word.id}"))throw Error("Game photo must reset with each vocabulary word");
if(!app.includes("preloadGamePhoto(upcomingPhoto)"))throw Error("Next vocabulary photo must be prefetched");
if(!app.includes('className="wordTranslation"'))throw Error("Word translations must display below words");
console.log("Photo QA passed: "+manifest.photos.length+" sourced/approved images checked against correct article, word, emoji and exact URLs.");
