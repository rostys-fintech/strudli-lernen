// Public builds (Vercel production or STRUDLI_PUBLIC_BUILD=1) must not ship private review stories:
// hiding them in the UI is not enough, because every file in dist/ is downloadable by URL.
import fs from "node:fs";
import path from "node:path";
const publicBuild=process.env.VERCEL_ENV==="production"||process.env.STRUDLI_PUBLIC_BUILD==="1";
if(!publicBuild){console.log("strip-private-stories: preview build, private review stories kept");process.exit(0);}
const dist="dist",catalogPath=path.join(dist,"lesen-pilot","catalog.json");
const catalog=JSON.parse(fs.readFileSync(catalogPath,"utf8"));
const keep=catalog.stories.filter(s=>s.access==="public"&&s.status!=="draft");
const drop=catalog.stories.filter(s=>!keep.includes(s));
const used=new Set(keep.flatMap(s=>[s.data,s.timings,s.audio,s.video,s.cover].filter(Boolean)).map(p=>p.split("/").slice(0,4).join("/")));
let removed=0;
const rm=p=>{const f=path.join(dist,p.replace(/^\//,""));if(fs.existsSync(f)){fs.rmSync(f,{recursive:true,force:true});removed++;}};
for(const s of drop){
 for(const field of ["data","timings"])if(s[field])rm(s[field]);
 for(const field of ["audio","video"])if(s[field])rm(path.posix.dirname(s[field]));
 // Story images live next to the data file (…/media/).
 const media=path.posix.join(path.posix.dirname(s.data||""),"media");
 if(![...used].some(u=>u.startsWith(media)))rm(media);
}
catalog.stories=keep;
fs.writeFileSync(catalogPath,JSON.stringify(catalog,null,1)+"\n");
// Guard: no name of a private story may remain anywhere in the public build (static HTML, JS, JSON).
const names=[...new Set(drop.flatMap(s=>[s.title,s.subtitle]).filter(t=>typeof t==="string"&&t.trim().length>3))];
const leaks=[];
const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(/\.(html|js|json|css|txt|webmanifest)$/.test(e.name)){const t=fs.readFileSync(f,"utf8");for(const n of names)if(t.includes(n))leaks.push(f+": "+n);}}};
walk(dist);
if(leaks.length){console.error("strip-private-stories: private story names found in the public build:\n"+leaks.slice(0,20).join("\n"));process.exit(1);}
console.log(`strip-private-stories: public build, removed ${drop.length} private/draft stories (${removed} paths), ${keep.length} public stories left`);
