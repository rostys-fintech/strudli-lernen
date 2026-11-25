/**
 * Pronunciation: verified-name Wikimedia recordings where available, with browser
 * de-DE voice as fallback. Article+noun phrases use ONE German utterance. A word is NEVER spoken with its article before
 * the learner answers correctly.
 */
const media:Record<string,string>={
  Kaffee:"https://upload.wikimedia.org/wikipedia/commons/transcoded/5/52/De-Kaffee.ogg/De-Kaffee.ogg.mp3",
  Katze:"https://upload.wikimedia.org/wikipedia/commons/transcoded/4/40/De-Katze.ogg/De-Katze.ogg.mp3",
  Rakete:"https://upload.wikimedia.org/wikipedia/commons/transcoded/d/d8/De-Rakete.ogg/De-Rakete.ogg.mp3",
  Astronaut:"https://upload.wikimedia.org/wikipedia/commons/transcoded/9/92/De-Astronaut.ogg/De-Astronaut.ogg.mp3",
  der:"https://upload.wikimedia.org/wikipedia/commons/transcoded/5/53/De-der.ogg/De-der.ogg.mp3",
  die:"https://upload.wikimedia.org/wikipedia/commons/transcoded/9/9b/De-die.ogg/De-die.ogg.mp3"
};
import phraseManifest from "./phraseAudioManifest.json";
const phraseClips:Record<string,string>=(phraseManifest as {clips?:Record<string,string>}).clips||{};
/** FNV-1a 32-bit over the UTF-8 bytes of the exact German text (same as scripts/generate_phrase_audio.py). */
export function phraseAudioKey(text:string):string{
 let h=0x811c9dc5;
 for(const b of new TextEncoder().encode(text.normalize("NFC").trim())){h^=b;h=Math.imul(h,0x01000193)>>>0}
 return h.toString(16).padStart(8,"0");
}
/** Whole-phrase neural recording for an everyday phrase, if one exists. */
export function phraseAudioUrl(text:string):string|undefined{
 const key=phraseAudioKey(text);
 return phraseClips[key]===text.normalize("NFC").trim()?`/audio/phrases/${key}.mp3`:undefined;
}
function playClip(url:string,token:number):Promise<boolean>{
 // One continuous utterance; the safety timeout follows the real clip length, never cuts a long phrase.
 return new Promise(resolve=>{
  if(token!==generation)return resolve(false);
  const clip=new Audio(url);clip.preload="auto";current=clip;let done=false;
  let wait=setTimeout(()=>finish(false),8000);
  function finish(okay:boolean){if(done)return;done=true;clearTimeout(wait);clip.onended=null;clip.onerror=null;if(!okay)try{clip.pause()}catch{}if(current===clip)current=null;resolve(okay)}
  clip.onloadedmetadata=()=>{if(done||!isFinite(clip.duration))return;clearTimeout(wait);wait=setTimeout(()=>finish(true),clip.duration*1000+2500)};
  clip.onended=()=>finish(true);clip.onerror=()=>finish(false);
  try{void clip.play().catch(()=>finish(false))}catch{finish(false)}
 });
}
const cache=new Map<string,HTMLAudioElement>();
let current:HTMLAudioElement|null=null;
let generation=0;
export function stopGermanAudio(){
 generation++;
 if(current){try{current.pause();current.currentTime=0}catch{}current=null}
 if(typeof window!=="undefined")try{window.speechSynthesis?.cancel()}catch{}
}
export function prepareGermanAudio(){
 if(typeof window==="undefined"||!("Audio"in window))return;
 for(const [word,url] of Object.entries(media)){
  if(cache.has(word))continue;
  const element=new Audio();element.preload="none";element.src=url;cache.set(word,element);
 }
}
function recording(segment:string,token:number):Promise<boolean>{
 return new Promise(resolve=>{
  const clip=cache.get(segment);
  if(!clip||token!==generation)return resolve(false);
  current=clip;let done=false;
  const finish=(okay:boolean)=>{if(done)return;done=true;clearTimeout(wait);clip.onended=null;clip.onerror=null;if(!okay)try{clip.pause()}catch{}if(current===clip)current=null;resolve(okay)};
  const wait=setTimeout(()=>finish(false),3500);
  clip.onended=()=>finish(true);clip.onerror=()=>finish(false);
  try{clip.currentTime=0;void clip.play().catch(()=>finish(false))}catch{finish(false)}
 });
}
function sayWithVoice(text:string,token:number):Promise<void>{
 return new Promise(resolve=>{
  if(token!==generation||!window.speechSynthesis){resolve();return}
  const synth=window.speechSynthesis;
  let completed=false;
  const finish=()=>{if(completed)return;completed=true;clearTimeout(timeout);resolve()};
  const timeout=setTimeout(finish,Math.max(3300,text.length*110));
  try{
   synth.cancel();
   const u=new SpeechSynthesisUtterance(text);
   u.lang="de-DE";u.rate=.96;u.pitch=1;u.volume=1;
   const voices=synth.getVoices().filter(v=>v.lang.toLowerCase().startsWith("de"));
   const preference=(v:SpeechSynthesisVoice)=>{
    const name=v.name.toLowerCase();
    return (/premium|enhanced|siri|neural|natural/.test(name)?100:0)+(/anna|katja|petra|google deutsch/.test(name)?25:0)+((v.lang.toLowerCase()==="de-de")?10:0)-(/espeak|compact/.test(name)?45:0)
   };
   if(voices.length)u.voice=voices.sort((a,b)=>preference(b)-preference(a))[0];
   u.onend=finish;u.onerror=finish;synth.speak(u);
  }catch{finish()}
 });
}
export async function speakGerman(word:string,article?:string):Promise<void>{
 // Speak a complete article+noun phrase with one voice, without segment pauses.
 stopGermanAudio();const token=generation;prepareGermanAudio();
 const trimmed=word.trim();
 const cleanWord=article?trimmed.replace(/^(der|die|das)\s+/i,""):trimmed;
 // Everyday phrases: play the recorded whole phrase instead of word-by-word phone synthesis.
 const phraseUrl=article?undefined:phraseAudioUrl(trimmed);
 if(phraseUrl){
  if(await playClip(phraseUrl,token)||generation!==token)return;
  await sayWithVoice(trimmed,token);return;
 }
 if(article){
  // "die Kartoffel" is a single SpeechSynthesisUtterance, never two clips.
  await sayWithVoice(`${article} ${cleanWord}`,token);
  return;
 }
 // Apple now follows the same single-voice pronunciation as ordinary vocabulary cards.
 // This avoids the slower, quieter, two-clip Wikimedia recording heard on iPhone.
 if(cleanWord==="Apfel"){await sayWithVoice(cleanWord,token);return;}
 // Other standalone words may still use their existing licensed natural recording.
 if(!(await recording(cleanWord,token))&&generation===token)await sayWithVoice(cleanWord,token);
}
