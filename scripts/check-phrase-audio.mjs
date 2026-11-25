// Every everyday phrase has one whole-phrase recording (no word-by-word phone synthesis).
import fs from "node:fs";
const src=fs.readFileSync("src/everydayPhrases.ts","utf8");
const rows=JSON.parse(src.match(/const rows[^=]*=(\[[\s\S]*?\n\]);/)[1]);
const manifest=JSON.parse(fs.readFileSync("src/phraseAudioManifest.json","utf8"));
const key=t=>{let h=0x811c9dc5;for(const b of Buffer.from(t.normalize("NFC").trim(),"utf8")){h^=b;h=Math.imul(h,0x01000193)>>>0}return h.toString(16).padStart(8,"0")};
const missing=[];
for(const r of rows){const k=key(r[1]);const f=`public/audio/phrases/${k}.mp3`;if(manifest.clips?.[k]!==r[1]||!fs.existsSync(f)||fs.statSync(f).size<2000)missing.push(r[1])}
const audio=fs.readFileSync("src/germanAudio.ts","utf8");
if(!/phraseAudioUrl\(trimmed\)/.test(audio))throw new Error("speakGerman does not use phrase recordings");
if(missing.length)throw new Error(`${missing.length}/${rows.length} phrases without a recording, e.g. ${missing.slice(0,3).join(" | ")}`);
console.log(`Phrase audio PASS: ${rows.length}/${rows.length} phrases have whole-phrase recordings (${manifest.voice} ${manifest.rate}).`);
