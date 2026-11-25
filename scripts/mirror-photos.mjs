/**
 * Mirror only the specifically curated photos already used by our original app.
 * Build-time step: keeps URL-to-word mapping deterministic, creates self-hosted
 * static media in dist/photos, and leaves original URLs as fallback on fetch failure.
 * Does not collect arbitrary images, images from visitors, or personal data.
 */
import{createHash}from"node:crypto";
import{readFile,writeFile,mkdir}from"node:fs/promises";
const sourcePath=new URL("../src/data.ts",import.meta.url);
const source=await readFile(sourcePath,"utf8");
const sectionsPath=new URL("../src/learningSections.ts",import.meta.url);
const sectionSource=await readFile(sectionsPath,"utf8");
const wordsMatch=source.match(/export const DEMO_WORDS:Word\[]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
const topicsMatch=source.match(/export const DEMO_TOPICS:Topic\[]=(\[[\s\S]*?\]);\nexport const DEMO_WORDS/);
if(!wordsMatch||!topicsMatch)throw Error("Expected original WortWelt dictionary");
const words=JSON.parse(wordsMatch[1]),topics=JSON.parse(topicsMatch[1]);
const sectionPhotos=[...sectionSource.matchAll(/coverPhoto:"([^"]+)"/g)].map(m=>m[1]);
const urls=[...new Set([...words.map(w=>w.photo),...topics.map(t=>t.photo),...sectionPhotos].filter(x=>typeof x==="string"&&(x.startsWith("https://wortwelt-de-ua.floot.app/_cdn/static/")||x.startsWith("https://images.unsplash.com/")||x.startsWith("https://images.pexels.com/")||x.startsWith("https://thumb.wikimedia.org/wikipedia/commons/thumb/")||x.startsWith("https://upload.wikimedia.org/wikipedia/commons/"))))];
await mkdir(new URL("../public/photos/",import.meta.url),{recursive:true});
let done=0,failed=0;
const replacements=new Map();
const failedSources=[];
let index=0;
const delay=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));

// Reuse files served by the PREVIOUS verified production release, avoiding
// another 300+ requests to Commons for identical sources every deployment.
// The filename is a stable SHA-256 digest of the exact original image URL.
// Failure to read the prior manifest is nonfatal: Wikimedia remains source of truth.
const priorRelease="https://wortwelt-de-ua.vercel.app";
let reusable=new Set();
try{
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),6500);
 let status;
 try{status=await fetch(priorRelease+"/photo-status.json",{signal:controller.signal,headers:{"Accept":"application/json"}})}finally{clearTimeout(timer)}
 if(status.ok){
  const json=await status.json();
  if(Array.isArray(json.localPaths))reusable=new Set(json.localPaths.filter(p=>typeof p==="string"&&/^\/photos\/[a-f0-9]{18}\.(jpg|png|webp)$/.test(p)));
 }
}catch(e){console.warn("Previous photo manifest unavailable, using Commons:",String(e).slice(0,90))}
console.log("Reusable media from prior release:",reusable.size);
const fetchCache=async(name)=>{
 const local="/photos/"+name;
 if(!reusable.has(local))return null;
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),6500);
 try{
  const response=await fetch(priorRelease+local,{signal:controller.signal,headers:{"Accept":"image/*"}});
  if(!response.ok||!(response.headers.get("content-type")||"").startsWith("image/"))return null;
  const bytes=Buffer.from(await response.arrayBuffer());
  return bytes.length>200&&bytes.length<4_000_000?bytes:null;
 }catch{return null}finally{clearTimeout(timer)}
};
let cacheHits=0;

const download=async()=>{
 while(index<urls.length){
  const url=urls[index++];
  const photoPath=new URL(url).pathname.toLowerCase();
  const ext=photoPath.endsWith(".webp")?".webp":photoPath.endsWith(".png")?".png":".jpg";
  const name=createHash("sha256").update(url).digest("hex").slice(0,18)+ext;
  let error="Unknown";
  let mirrored=false;
  const cached=await fetchCache(name);
  if(cached){
   await writeFile(new URL("../public/photos/"+name,import.meta.url),cached);
   replacements.set(url,"/photos/"+name);
   done++;cacheHits++;mirrored=true;
  }
  for(let attempt=0;attempt<5&&!mirrored;attempt++){
   try{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),12000);
    let response;
    try{response=await fetch(url,{signal:controller.signal,headers:{"User-Agent":"WortWelt-educational-app/1.0 (attribution and source metadata in photo manifest)"}})}finally{clearTimeout(timeout)}
    const type=response.headers.get("content-type")||"";
    if(!response.ok||!type.startsWith("image/")){
     error=String(response.status)+" "+type;
     if((response.status===429||response.status===503)&&attempt<4){
      const seconds=Number(response.headers.get("retry-after"));
      await delay(Number.isFinite(seconds)&&seconds>0?Math.min(seconds*1000,30000):Math.min(30000,5000*Math.pow(2,attempt)));
      continue;
     }
     break;
    }
    const binary=Buffer.from(await response.arrayBuffer());
    if(binary.length>4_000_000||binary.length<200){error="Unexpected image size";break}
    await writeFile(new URL("../public/photos/"+name,import.meta.url),binary);
    replacements.set(url,"/photos/"+name);done++;mirrored=true;
   }catch(e){
    error=String(e).slice(0,120);
    if(attempt<4)await delay(Math.min(12000,(attempt+1)*2500));
   }
  }
  if(!mirrored){
   failed++;
   failedSources.push({url,reason:error});
   console.warn("Photo could not be mirrored:",new URL(url).pathname.slice(0,70),error);
  }
 }
};
await Promise.all(Array.from({length:Math.min(3,urls.length)},download));
let updated=source;
let updatedSections=sectionSource;
for(const [remote,local]of replacements){updated=updated.replaceAll(remote,local);updatedSections=updatedSections.replaceAll(remote,local);}
if(updated!==source)await writeFile(sourcePath,updated);
if(updatedSections!==sectionSource)await writeFile(sectionsPath,updatedSections);
await writeFile(new URL("../public/photo-status.json",import.meta.url),JSON.stringify({expected:urls.length,mirrored:done,failed,reusedFromPriorRelease:cacheHits,failedSources,localPaths:[...replacements.values()]},null,2)+"\n");
console.log("Photo assets self-hosted for this release:",done,"/",urls.length,"(from previous release:",cacheHits,"; unavailable fallbacks:",failed,")");
