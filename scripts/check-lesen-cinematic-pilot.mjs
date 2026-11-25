import assert from "node:assert/strict";
import {readFileSync,statSync,readdirSync} from "node:fs";
import {execFileSync} from "node:child_process";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const pilot="public/lesen-pilot/";
const app=read("src/App.tsx"),lesen=read("src/Lesen.tsx"),styles=read("src/styles.css");
const html=read(pilot+"index.html"),js=read(pilot+"player.js"),css=read(pilot+"player.css");
assert.ok(app.includes('initialCinema={lesenStory} language={language}'),"Original reading route must remain");
for(const s of ["pilotOpen","lesenPilotLaunch","lesenPilotFrame","allowFullScreen","/lesen-pilot/index.html?embed=1","&story=","!story?<>"]){
 assert.ok(lesen.includes(s),"Missing in-app pilot integration: "+s);
}
for(const s of ["lesenPilotFrame","lesenPilotLaunch","lesenPilotBack"]){
 assert.ok(styles.includes("."+s),"Missing responsive pilot layout: "+s);
}
assert.ok(!html.includes("/lesen-pilot/media/storm.webp"),"First painting comes from the selected story, not hard-coded art");
for(const path of ["/lesen-pilot/player.js","/lesen-pilot/player.css"]){
 assert.ok(html.includes(path),"Incorrect iframe asset path: "+path);
}
// Story catalog: every cinematic story is a catalog entry.
const catalog=JSON.parse(read(pilot+"catalog.json"));
assert.ok(js.includes("/lesen-pilot/catalog.json")&&js.includes("story"),"Player must load stories from the catalog by ?story=");
assert.ok(lesen.includes("/lesen-pilot/catalog.json")&&lesen.includes("cinemaVisible"),"Lesen hub must list catalog stories");
const ids=new Set();
for(const s of catalog.stories){
 assert.ok(/^[a-z0-9-]+$/.test(s.id)&&!ids.has(s.id),"Bad or duplicate story id "+s.id);ids.add(s.id);
 assert.ok(["public","private"].includes(s.access),"Story needs access public/private: "+s.id);
 for(const k of ["title","cover","data","timings","audio","video"])assert.ok(s[k],"Story "+s.id+" missing "+k);
 assert.ok(s.audio.includes("{level}")&&s.audio.includes("{voice}")&&s.video.includes("{level}"),"Templated media paths: "+s.id);
}
// Every catalog story: each subtitle word opens a gloss (exact, Capitalised or lower-case, or a token context sense)
// with UA+EN meaning and a translated example; non-draft stories must ship art, audio and real timings.
{
 const tok=/[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*/gu;
 for(const s of catalog.stories){
  const data=JSON.parse(read("public"+s.data)),W=data.words,G=data.story.glossary||{},ctx=data.story.context||{};
  const look=w=>W[w]||W[w[0].toUpperCase()+w.slice(1)]||W[w.toLowerCase()]||G[w]||G[w[0].toUpperCase()+w.slice(1)];
  assert.equal(data.story.questions.length,3,s.id+" needs 3 comprehension questions");
  for(const scene of data.story.scenes){
   assert.ok(data.story.images[scene.art],s.id+" scene without art path: "+scene.id);
   for(const level of s.levels){const toks=[...scene[level].matchAll(tok)].map(m=>m[0]);
    toks.forEach((t,i)=>assert.ok(W[ctx[scene.id+":"+level+":"+i]]||look(t),"No gloss: "+s.id+" "+level+" "+scene.id+" "+t));}
  }
  for(const [k,v] of [...Object.entries(W),...Object.entries(data.phrases)]){
   assert.equal(v.length,6,s.id+" gloss needs [uk,en,ipa,exampleDe,exampleUk,exampleEn]: "+k);
   assert.ok(v[0]&&v[1]&&v[3]&&v[4]&&v[5],s.id+" incomplete gloss: "+k);
  }
  if(s.status!=="draft"){
   const t=JSON.parse(read("public"+s.timings));
   for(const scene of data.story.scenes)assert.ok(statSync(new URL("../public"+data.story.images[scene.art],import.meta.url)).size>50000,s.id+" art missing "+scene.art);
   for(const level of s.levels)for(const voice of s.voices){
    assert.equal(t[level][voice].scenes.length,data.story.scenes.length,s.id+" timings "+level+" "+voice);
    assert.ok(statSync(new URL("../public"+s.audio.replace("{level}",level).replace("{voice}",voice),import.meta.url)).size>200000,s.id+" audio "+level+" "+voice);
   }
  }
 }
}
for(const requirement of ["webkitEnterFullscreen","openDictionary","scrubSetup","prepareNative","pilotEmbedded","new URLSearchParams"]){
 assert.ok(js.includes(requirement),"Player missing action: "+requirement);
}
assert.ok(css.includes(".art.motion{transform:none}"),"Do not shake entire painted scene");
assert.ok(js.includes("phraseSpan"),"Player must match separable verbs across gaps");
const hqImages=readdirSync(new URL("../public/photos/hq",import.meta.url)).filter(x=>x.endsWith(".webp"));
const baseline=JSON.parse(read("public/photos/hq/approved22-manifest-20261123.json"));
assert.equal(baseline.items.length,22,"Preserve 22 previously approved HQ photos");
for(const item of baseline.items){assert.ok(hqImages.includes(item.asset.split("/").pop()),"Missing approved image "+item.asset);}
const added=JSON.parse(read("public/photos/hq/approved10-manifest-20261124.json"));
assert.equal(added.items.length,10,"Preserve batch 1 HQ photos");
for(const item of added.items){assert.ok(hqImages.includes(item.asset.split("/").pop()),"Missing approved image "+item.asset);}
const batch02=JSON.parse(read("public/photos/hq/approved-batch02-manifest-20261124.json"));
assert.equal(batch02.items.length,10,"Preserve batch 2 HQ photos");
for(const item of batch02.items){assert.ok(hqImages.includes(item.asset.split("/").pop()),"Missing approved image "+item.asset);}
const batch03=JSON.parse(read("public/photos/hq/approved-batch03-manifest-20261124.json"));
assert.equal(batch03.items.length,10,"Preserve batch 3 HQ photos");
for(const item of batch03.items){assert.ok(hqImages.includes(item.asset.split("/").pop()),"Missing approved image "+item.asset);}
const batch04=JSON.parse(read("public/photos/hq/approved-batch04-manifest-20261124.json"));
assert.equal(batch04.items.length,10,"Preserve batch 4 HQ photos");
for(const item of batch04.items){assert.ok(hqImages.includes(item.asset.split("/").pop()),"Missing approved image "+item.asset);}
const batch05=JSON.parse(read("public/photos/hq/approved-batch05-manifest-20261124.json"));
assert.equal(batch05.items.length,10,"Preserve batch 5 HQ photos");
for(const item of batch05.items){assert.ok(hqImages.includes(item.asset.split("/").pop()),"Missing approved image "+item.asset);}
const batch06=JSON.parse(read("public/photos/hq/approved-batch06-manifest-20261124.json"));
assert.equal(batch06.items.length,10,"Preserve batch 6 HQ photos");
for(const item of batch06.items){assert.ok(hqImages.includes(item.asset.split("/").pop()),"Missing approved image "+item.asset);}
const batch07=JSON.parse(read("public/photos/hq/approved-batch07-manifest-20261124.json"));
assert.equal(batch07.items.length,10,"Preserve batch 7 HQ photos");
for(const item of batch07.items){assert.ok(hqImages.includes(item.asset.split("/").pop()),"Missing approved image "+item.asset);}
const batch08=JSON.parse(read("public/photos/hq/approved-batch08-manifest-20261124.json"));
assert.equal(batch08.items.length,10,"Preserve batch 8 HQ photos");
for(const item of batch08.items){assert.ok(hqImages.includes(item.asset.split("/").pop()),"Missing approved image "+item.asset);}
const batch09=JSON.parse(read("public/photos/hq/approved-batch09-manifest-20261124.json"));
assert.equal(batch09.items.length,10,"Preserve batch 9 HQ photos");
for(const item of batch09.items){assert.ok(hqImages.includes(item.asset.split("/").pop()),"Missing approved image "+item.asset);}
const batch10=JSON.parse(read("public/photos/hq/approved-batch10-manifest-20261124.json"));
assert.equal(batch10.items.length,10,"Preserve batch 10 approved photos");
for(const item of batch10.items){assert.ok(hqImages.includes(item.asset.split("/").pop()),"Missing approved image "+item.asset);}
const batch11=JSON.parse(read("public/photos/hq/approved-batch11-manifest-20261124.json"));
assert.equal(batch11.items.length,10,"Preserve batch 11 HQ photos");
for(const item of batch11.items){assert.ok(hqImages.includes(item.asset.split("/").pop()),"Missing approved image "+item.asset);}
const batch12=JSON.parse(read("public/photos/hq/approved-batch12-manifest-20261124.json"));
assert.equal(batch12.items.length,7,"Preserve final batch 12 HQ photos");
for(const item of batch12.items){assert.ok(hqImages.includes(item.asset.split("/").pop()),"Missing approved image "+item.asset);}
assert.ok(read("package.json").includes("apply-hq-batch12-20261124.mjs"),"Missing final approved-photo import in build");
assert.ok(read("package.json").includes("apply-hq-approved22-20261123.mjs"),"Missing approved-photo import in build");
execFileSync(process.execPath,["--check",new URL("../"+pilot+"player.js",import.meta.url).pathname]);
console.log("Integrated Lesen pilot QA PASS: real iPhone fullscreen entry, accessible word lookup, A1/A2, responsive in-app route, original reading preserved, Approved HQ photo replacements preserved.");
