/** Original in-browser sound design, built with Web Audio. No network/audio-file dependency. */
const KEY="wortwelt-feedback-sounds-v1";
type ExtendedWindow=Window & {webkitAudioContext?:typeof AudioContext};
type AudioSessionNavigator=Navigator & {audioSession?:{type:string}};
let context:AudioContext|null=null;
export function soundEnabled(){try{return localStorage.getItem(KEY)!=="off"}catch{return true}}
export function setSoundEnabled(enabled:boolean){try{localStorage.setItem(KEY,enabled?"on":"off")}catch{}}

function activateAudio(){
 // Supported Safari versions may otherwise silence Web Audio in the hardware silent mode.
 try{const session=(navigator as AudioSessionNavigator).audioSession;if(session)session.type="playback"}catch{}
 const ctor=window.AudioContext||(window as ExtendedWindow).webkitAudioContext;
 if(!ctor)return null;
 if(!context||context.state==="closed")context=new ctor({latencyHint:"interactive"});
 if(context.state==="suspended")void context.resume().catch(()=>{});
 return context;
}
function tone(ctx:AudioContext,start:number,freq:number,duration:number,volume:number,endFreq?:number,type:OscillatorType="sine"){
 const osc=ctx.createOscillator(),gain=ctx.createGain();
 osc.type=type;
 osc.frequency.setValueAtTime(freq,start);
 if(endFreq)osc.frequency.exponentialRampToValueAtTime(Math.max(50,endFreq),start+duration*.9);
 gain.gain.setValueAtTime(.0001,start);
 gain.gain.exponentialRampToValueAtTime(volume,start+.026);
 gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
 osc.connect(gain);gain.connect(ctx.destination);
 osc.start(start);osc.stop(start+duration+.03);
 osc.onended=()=>{osc.disconnect();gain.disconnect()};
}
function fireWhoosh(ctx:AudioContext,start:number,duration:number,volume:number,rise:boolean){
 const sampleCount=Math.ceil(ctx.sampleRate*duration);
 const buffer=ctx.createBuffer(1,sampleCount,ctx.sampleRate);
 const samples=buffer.getChannelData(0);
 for(let i=0;i<sampleCount;i++)samples[i]=Math.random()*2-1;
 const source=ctx.createBufferSource();source.buffer=buffer;
 const filter=ctx.createBiquadFilter();filter.type="bandpass";
 filter.frequency.setValueAtTime(rise?670:1200,start);
 filter.frequency.exponentialRampToValueAtTime(rise?1950:280,start+duration*.9);
 filter.Q.value=.62;
 const gain=ctx.createGain();
 gain.gain.setValueAtTime(.0001,start);
 gain.gain.exponentialRampToValueAtTime(volume,start+.035);
 gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
 source.connect(filter);filter.connect(gain);gain.connect(ctx.destination);
 source.start(start);source.stop(start+duration);
 source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect()};
}
/**
 * Call synchronously inside a real button click/tap to unlock iOS audio.
 * Returns whether the effect was scheduled, not proof the device is physically audible.
 */
export function feedbackSound(kind:"correct"|"wrong",level=1):boolean{
 if(!soundEnabled()||typeof window==="undefined")return false;
 try{
  const ctx=activateAudio();if(!ctx)return false;
  const at=ctx.currentTime+.012;
  if(kind==="wrong"){
   fireWhoosh(ctx,at,.29,.115,false);
   tone(ctx,at,370,.24,.18,185,"triangle");
   tone(ctx,at+.085,210,.21,.10,112,"sine");
   return true;
  }
  const tier=Math.min(3,Math.max(1,Math.trunc(level)));
  // Three recognizably different, short ignition/reward sounds.
  fireWhoosh(ctx,at,.24+tier*.095,.105+tier*.023,true);
  tone(ctx,at+.04,510+tier*85,.25,.13+tier*.018,undefined,"triangle");
  if(tier>=2)tone(ctx,at+.15,790+tier*115,.24,.12,undefined,"sine");
  if(tier===3){
   tone(ctx,at+.27,1250,.27,.14,undefined,"triangle");
   tone(ctx,at+.37,1580,.22,.09,undefined,"sine");
  }
  return true;
 }catch{return false}
}
