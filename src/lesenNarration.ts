import type {ReadingStory} from "./lesenStories";

/** Stable hosted, whole-story narration tracks may be added after a generated
 * recording has been approved and stored. The HeyGen free quota was exhausted
 * during Stage 09B; no nonexistent speech URLs are included in this release.
 */
export const RECORDED_STORY_AUDIO:Readonly<Partial<Record<string,string>>>={};

export function storyParagraphs(story:ReadingStory):readonly string[]{
 let start=0;
 return story.paragraphEnds.map(end=>{
  const text=story.sentences.slice(start,end).map(row=>row[0]).join(" ");
  start=end;
  return text;
 });
}
function germanNarratorVoice():SpeechSynthesisVoice|undefined{
 const available=window.speechSynthesis?.getVoices()?.filter(v=>v.lang.toLowerCase().startsWith("de"))||[];
 if(!available.length)return undefined;
 const maleNames=/markus|stefan|daniel|thomas|martin|andreas|oliver|walter|albrecht|male/i;
 const quality=/natural|neural|premium|enhanced|siri|google/i;
 const priority=(v:SpeechSynthesisVoice)=>(maleNames.test(v.name)?100:0)+(quality.test(v.name)?20:0)+(v.lang.toLowerCase()==="de-de"?10:0);
 return [...available].sort((a,b)=>priority(b)-priority(a))[0];
}
/** Play one reading session for the FULL story. The fallback streams four
 * paragraphs in sequence with a continuous play action, never requiring
 * sentence-by-sentence tapping. A hosted HeyGen recording is preferred when
 * a real approved URL is configured. Always return a stop function.
 */
export function playStoryNarration(story:ReadingStory,onFinish:()=>void,onError:()=>void):()=>void{
 if(typeof window==="undefined")return ()=>{};
 const source=RECORDED_STORY_AUDIO[story.id];
 let stopped=false;
 let audio:HTMLAudioElement|undefined;
 let active:SpeechSynthesisUtterance|undefined;
 const finish=()=>{if(stopped)return;stopped=true;onFinish();};
 const fail=()=>{if(stopped)return;stopped=true;onError();};
 const stop=()=>{
  if(stopped)return;
  stopped=true;
  if(audio){audio.pause();audio.removeAttribute("src");audio.load();}
  if(active){active.onend=null;active.onerror=null}
  try{window.speechSynthesis?.cancel()}catch{}
 };
 if(source){
  audio=new Audio(source);
  audio.onended=finish;audio.onerror=fail;
  void audio.play().catch(fail);
  return stop;
 }
 const synth=window.speechSynthesis;
 if(!synth||typeof SpeechSynthesisUtterance==="undefined"){fail();return stop;}
 try{synth.cancel()}catch{}
 const paragraphs=storyParagraphs(story);
 const voice=germanNarratorVoice();
 const speakPart=(i:number)=>{
  if(stopped)return;
  if(i>=paragraphs.length){finish();return}
  const speech=new SpeechSynthesisUtterance(paragraphs[i]);
  speech.lang="de-DE";speech.rate=.91;speech.pitch=.94;
  if(voice)speech.voice=voice;
  speech.onend=()=>speakPart(i+1);
  speech.onerror=()=>fail();
  active=speech;
  try{synth.speak(speech)}catch{fail()}
 };
 speakPart(0);
 return stop;
}