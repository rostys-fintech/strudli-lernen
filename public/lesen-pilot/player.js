'use strict';
/* Standalone cinematic language player. Single audio-clock timeline; no legacy overrides. */
const $=id=>document.getElementById(id);
const htmlEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wordPattern=/[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*/gu;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
let library=null, cues=null, entry=null, activeImage=$('imageOne'), nextImage=$('imageTwo'), activeMotion=$('motionOne'), nextMotion=$('motionTwo');
document.documentElement.classList.toggle('pilotEmbedded',new URLSearchParams(location.search).get('embed')==='1');
const urlLang=new URLSearchParams(location.search).get('lang');
let state={level:'a1',voice:'conrad',language:urlLang==='en'?'en':'uk',playing:false,started:false,scene:-1,captionWord:-1,captionVisible:true,timeMs:0,scrub:null,lastFocus:null,lookupIndex:-1,lookupWasPlaying:false};
const audio=$('narration'), wordAudio=$('wordReplay');
let timeLoop=0, artToken=0, wordStopTime=0, audioPending=false;
try{const prev=JSON.parse(localStorage.getItem('strudli-lesen-cinema')||'{}');
 if(['a1','a2'].includes(prev.level))state.level=prev.level;
 if(['conrad','killian'].includes(prev.voice))state.voice=prev.voice;
 if(!urlLang&&['en','uk'].includes(prev.language))state.language=prev.language;
}catch{}
function persist(){try{localStorage.setItem('strudli-lesen-cinema',JSON.stringify({level:state.level,voice:state.voice,language:state.language}))}catch{}}
function getTrack(){return cues?.[state.level]?.[state.voice]}
function currentScene(){const t=getTrack();return t?.scenes[state.scene]}
function timeLabel(ms){const s=Math.floor(clamp(ms,0,99999999)/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function findScene(ms){const t=getTrack();if(!t)return 0;for(let i=t.scenes.length-1;i>=0;i--)if(ms>=t.scenes[i].startMs)return i;return 0}
function fill(t){return String(t).replace('{level}',state.level).replace('{voice}',state.voice)}
function audioSrc(){return fill(entry.audio)}
function videoSrc(){return fill(entry.video)}
function message(txt){$('statusLine').textContent=txt||''}
function renderLevels(){document.querySelectorAll('[data-level]').forEach(b=>{const on=b.dataset.level===state.level;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))})}
function artAt(i){return library.story.images[library.story.scenes[i].art]}
function changeImage(i){const path=artAt(i),token=++artToken;
 if(activeImage.getAttribute('src')===path&&activeImage.classList.contains('front'))return;
 const temporary=new Image();temporary.decoding='async';
 temporary.onload=()=>{if(token!==artToken)return;nextImage.setAttribute('src',path);buildMotion(nextMotion,library.story.scenes[i]);nextImage.alt='Мальована сцена: '+library.story.scenes[i].label;
  nextImage.style.opacity='0';nextImage.classList.remove('front','motion');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{if(token!==artToken)return;nextImage.classList.add('front','motion');nextImage.style.opacity='1';activeImage.classList.remove('front','motion');activeImage.style.opacity='0';nextMotion.classList.add('front');activeMotion.classList.remove('front');const pastMotion=activeMotion;activeMotion=nextMotion;nextMotion=pastMotion;const past=activeImage;activeImage=nextImage;nextImage=past;setTimeout(()=>{past.style.opacity='';activeImage.style.opacity=''},1350)}));
 };
 temporary.onerror=()=>message('Зображення сцени не вдалося завантажити.');temporary.src=path;
 if(temporary.complete&&temporary.naturalWidth)temporary.onload();
}

/* Scene element animation: small effects placed on the painting (normalised x/y), fixed camera.
   Two layers crossfade with the two paintings; .cinema.paused freezes them. */
function fitMotion(){const v=$('visual').getBoundingClientRect(),img=activeImage.naturalWidth?activeImage:nextImage,ar=img.naturalWidth&&img.naturalHeight?img.naturalWidth/img.naturalHeight:16/9;
 let w=v.width,h=w/ar;if(h>v.height){h=v.height;w=h*ar}
 for(const l of [$('motionOne'),$('motionTwo')]){l.style.left=((v.width-w)/2)+'px';l.style.top=((v.height-h)/2)+'px';l.style.width=w+'px';l.style.height=h+'px'}}
function mk(cls,parent,css){const e=document.createElement('span');e.className=cls;Object.assign(e.style,css||{});parent.appendChild(e);return e}
const P=v=>(v*100)+'%';
function area(layer,a,cls){return mk('mArea '+(cls||''),layer,{left:P(a[0]),top:P(a[1]),width:P(a[2]-a[0]),height:P(a[3]-a[1])})}
function buildMotion(layer,scene){layer.innerHTML='';const list=scene&&scene.motion||[];
 list.forEach((m,k)=>{const at={left:P(m.x||0),top:P(m.y||0)};
  if(m.type==='glow'||m.type==='flicker')mk('m'+(m.type==='glow'?'Glow':'Flicker'),layer,{...at,width:P((m.r||.05)*2),'--c':m.color||'#ffc46a'});
  else if(m.type==='rays')mk('mRays',layer,at);
  else if(m.type==='sparkle')mk('mSparkle',layer,{...at,animationDelay:(k*.7)+'s'}).textContent='✦';
  else if(m.type==='rings'){for(let i=0;i<3;i++)mk('mRing',layer,{...at,animationDelay:(i*.6)+'s'})}
  else if(m.type==='notes'){['♪','♫','♪','♬'].forEach((n,i)=>{mk('mNote',layer,{...at,animationDelay:(i*.9)+'s','--dx':((i%2?1:-1)*(12+i*6))+'px'}).textContent=n})}
  else if(m.type==='steam'){for(let i=0;i<3;i++)mk('mSteam',layer,{...at,animationDelay:(i*1.1)+'s','--dx':((i-1)*8)+'px'})}
  else if(m.type==='leaves'){const a=area(layer,m.area);for(let i=0;i<5;i++)mk('mLeaf',a,{left:P(.1+.18*i),animationDelay:(i*1.7)+'s',animationDuration:(7+i%3*1.6)+'s','--h':(i%2?'#d98b2b':'#b8611f')})}
  else if(m.type==='fireflies'){const a=area(layer,m.area);for(let i=0;i<12;i++)mk('mFly',a,{left:P((i*37%100)/100),top:P((i*53%100)/100),animationDelay:(i*.45)+'s'})}
  else if(m.type==='pollen'){for(let i=0;i<10;i++)mk('mPollen',layer,{left:P((i*41%100)/100),top:P((15+i*29%70)/100),animationDelay:(i*.8)+'s'})}
  else if(m.type==='streaks'){const a=area(layer,m.area,'clip');for(let i=0;i<6;i++)mk('mStreak',a,{top:P(.12+i*.14),animationDelay:(i*.35)+'s'})}
  else if(m.type==='shimmer'){const a=area(layer,m.area,'clip');for(let i=0;i<9;i++)mk('mShimmer',a,{left:P((i*23%90)/100),top:P(.15+(i*31%70)/100),animationDelay:(i*.4)+'s'})}
  else if(m.type==='twinkle'){const a=area(layer,m.area);for(let i=0;i<10;i++)mk('mTwinkle',a,{left:P(i/9),top:P((i%3)*.3),animationDelay:(i*.3)+'s'})}
 });}
window.addEventListener('resize',fitMotion);document.addEventListener('fullscreenchange',()=>setTimeout(fitMotion,60));
function tokenize(text){return [...text.matchAll(wordPattern)].map(m=>({text:m[0],start:m.index,end:m.index+m[0].length}))}
function renderCaptions(){const s=library.story.scenes[state.scene], tokens=tokenize(s[state.level]);let cursor=0,out='';
 tokens.forEach((t,i)=>{out+=htmlEscape(s[state.level].slice(cursor,t.start));out+='<button type="button" data-word="'+i+'" aria-label="Переклад '+htmlEscape(t.text)+'">'+htmlEscape(t.text)+'</button>';cursor=t.end});
 out+=htmlEscape(s[state.level].slice(cursor));$('captions').innerHTML=out;state.captionWord=-1;
}
function showScene(index){if(state.scene===index)return;state.scene=index;changeImage(index);
 const scene=library.story.scenes[index],fx=scene.fx||scene.id;$('visual').dataset.scene=fx;$('visual').style.setProperty('--scene-image','url('+JSON.stringify(artAt(index))+')');$('topInfo').textContent=scene.label;
 $('butterfly').hidden=fx!=='butterfly';renderCaptions();
}
function wordHighlight(ms){const scene=currentScene();if(!scene)return;let idx=-1;
 for(let i=0;i<scene.words.length;i++){const w=scene.words[i];if(ms>=w.a&&ms<w.b){idx=i;break}}
 if(idx===state.captionWord)return;state.captionWord=idx;
 $('captions').querySelectorAll('button[data-word]').forEach(b=>{const match=Number(b.dataset.word)===idx;b.classList.toggle('reading',match);if(match)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')});
}
function drawTimeline(){const track=getTrack();if(!track)return;const current=clamp(state.timeMs,0,track.durationMs);
 const percentage=clamp(current/track.durationMs*100,0,100);$('played').style.width=percentage+'%';$('playhead').style.left=percentage+'%';
 $('timeDisplay').textContent=timeLabel(current)+' / '+timeLabel(track.durationMs);
 $('timeline').setAttribute('aria-valuenow',String(Math.round(percentage)));$('timeline').setAttribute('aria-valuetext',timeLabel(current)+' з '+timeLabel(track.durationMs));
}
function drawMarkers(){const track=getTrack();if(!track)return;$('chapterLines').innerHTML=track.scenes.slice(1).map(s=>'<span style="left:'+(s.startMs/track.durationMs*100)+'%"></span>').join('')}
function display(){if(!getTrack())return;
 if(state.playing&&!state.scrub)state.timeMs=audio.currentTime*1000;
 const index=findScene(state.timeMs);showScene(index);wordHighlight(state.timeMs);drawTimeline();
 $('playPause').textContent=state.playing?'Ⅱ':'▶';$('playPause').setAttribute('aria-label',state.playing?'Пауза':'Відтворити');
 $('cinema').classList.toggle('paused',!state.playing);
 if(state.playing&&!audio.ended)timeLoop=requestAnimationFrame(display);
}
function stop(){if(!state.playing)return;state.playing=false;audio.pause();cancelAnimationFrame(timeLoop);display()}
function start(){if(!getTrack()||audioPending)return;
 if(audio.ended||state.timeMs>=getTrack().durationMs-100){audio.currentTime=0;state.timeMs=0;showScene(0)}
 audioPending=true;audio.volume=$('volume').value/100;audio.playbackRate=Number($('speed').value);
 const attempted=audio.play();Promise.resolve(attempted).then(()=>{audioPending=false;state.playing=true;state.started=true;$('centerPlay').hidden=true;message('');cancelAnimationFrame(timeLoop);timeLoop=requestAnimationFrame(display)}).catch(()=>{audioPending=false;message('Браузер заблокував звук. Натисни ▶ ще раз.')});
}
function togglePlay(){state.playing?stop():start()}
function setTime(ms,keepPlaying){const tr=getTrack();if(!tr)return;const target=clamp(ms,0,Math.max(0,tr.durationMs-100));
 state.timeMs=target;try{audio.currentTime=target/1000}catch{};
 const scene=findScene(target);showScene(scene);wordHighlight(target);drawTimeline();
 if(keepPlaying){state.playing=false;start()}else{state.playing=false;audio.pause();display()}
}
function trackChange(level,voice){const old=getTrack(),oldScene=state.scene<0?0:state.scene;
 const oldC=old?.scenes[oldScene],oldEnd=old?old.scenes[oldScene+1]?.startMs??old.durationMs:1;
 const relative=oldC?clamp((state.timeMs-oldC.startMs)/Math.max(1,oldEnd-oldC.startMs),0,1):0;
 const wasPlaying=state.playing;stop();state.level=level;state.voice=voice;persist();renderLevels();$('voice').value=voice;
 const tr=getTrack(),next=tr.scenes[oldScene];state.timeMs=next.startMs+relative*((tr.scenes[oldScene+1]?.startMs??tr.durationMs)-next.startMs);state.scene=-1;
 audio.src=audioSrc();audio.load();audio.playbackRate=Number($('speed').value);prepareNative();
 try{audio.currentTime=state.timeMs/1000}catch{audio.addEventListener('loadedmetadata',()=>{audio.currentTime=state.timeMs/1000},{once:true})}
 drawMarkers();showScene(oldScene);display();if(wasPlaying)start();
}
function previewAt(e){const box=$('timeline').getBoundingClientRect(),p=clamp((e.clientX-box.left)/Math.max(1,box.width),0,1),ms=p*getTrack().durationMs,i=findScene(ms);
 $('hoverCard').hidden=false;$('hoverArt').src=artAt(i);$('hoverTitle').textContent=library.story.scenes[i].label;$('hoverTime').textContent=timeLabel(ms);
 $('hoverCard').style.left=clamp(e.clientX-box.left,80,Math.max(80,box.width-80))+'px';return {ms,i}
}
function scrubSetup(){const rail=$('timeline');
 rail.addEventListener('pointerdown',e=>{if(e.button!==0)return;const v=previewAt(e);state.scrub={pointerId:e.pointerId,startX:e.clientX,at:v.ms,scene:v.i,wasPlaying:state.playing,dragged:false};stop();rail.classList.add('dragging');rail.setPointerCapture(e.pointerId);e.preventDefault()});
 rail.addEventListener('pointermove',e=>{const v=previewAt(e);if(!state.scrub||state.scrub.pointerId!==e.pointerId)return;if(Math.abs(e.clientX-state.scrub.startX)>6)state.scrub.dragged=true;
  if(state.scrub.dragged){state.timeMs=v.ms;showScene(v.i);wordHighlight(v.ms);drawTimeline()}});
 rail.addEventListener('pointerup',e=>{const d=state.scrub;if(!d||d.pointerId!==e.pointerId)return;const v=previewAt(e),target=v.ms;
  state.scrub=null;rail.classList.remove('dragging');$('hoverCard').hidden=true;rail.releasePointerCapture(e.pointerId);setTime(target,d.wasPlaying)});
 rail.addEventListener('pointercancel',()=>{if(!state.scrub)return;const t=state.scrub.at,p=state.scrub.wasPlaying;state.scrub=null;rail.classList.remove('dragging');$('hoverCard').hidden=true;setTime(t,p)});
 rail.addEventListener('pointerleave',()=>{if(!state.scrub)$('hoverCard').hidden=true});
 rail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();setTime(state.timeMs+(e.key==='ArrowRight'?5000:-5000),state.playing)}else if(e.key==='Home'||e.key==='End'){e.preventDefault();setTime(e.key==='Home'?0:getTrack().durationMs-150,state.playing)}});
}
function showSettings(open){$('settings').hidden=!open;$('settingsButton').setAttribute('aria-expanded',String(open))}
function toggleCC(){state.captionVisible=!state.captionVisible;$('captions').hidden=!state.captionVisible;$('cc').setAttribute('aria-pressed',String(state.captionVisible))}
function toggleMute(){audio.muted=!audio.muted;$('sound').textContent=audio.muted?'◖×':'◖))';$('sound').setAttribute('aria-label',audio.muted?'Увімкнути звук':'Вимкнути звук')}
function phraseSpan(text,tokens,key){const want=tokenize(key).map(t=>t.text.toLocaleLowerCase('de'));if(!want.length)return null;
 const low=tokens.map(t=>t.text.toLocaleLowerCase('de')),gapOK=(a,b)=>b-a<=7&&!/[.!?:;]/.test(text.slice(tokens[a].end,tokens[b].start));
 for(let s=0;s<low.length;s++){if(low[s]!==want[0])continue;const hit=[s];let j=s;
  for(let w=1;w<want.length;w++){let f=-1;for(let k=j+1;k<low.length&&gapOK(j,k);k++)if(low[k]===want[w]){f=k;break}if(f<0)break;hit.push(f);j=f}
  if(hit.length===want.length)return hit}
 return null}
function chooseTerm(index){const text=library.story.scenes[state.scene][state.level],tokens=tokenize(text),tok=tokens[index];
 const keys=Object.keys(library.phrases).sort((a,b)=>tokenize(b).length-tokenize(a).length);
 const phrase=keys.find(k=>{const hit=phraseSpan(text,tokens,k);return hit&&hit.includes(index)});
 return phrase||tok.text;
}
function infoFor(term){const cap=term[0].toUpperCase()+term.slice(1),low=term.toLocaleLowerCase('de'),W=library.words,G=library.story.glossary||{};return library.phrases[term]||W[term]||W[cap]||W[low]||G[term]||G[cap]||G[low]||null}
function contextKey(index){const s=library.story.scenes[state.scene];return library.story.context?.[s.id+':'+state.level+':'+index]||null}
function openDictionary(index){const scene=currentScene();if(!scene||!scene.words[index])return;state.lookupIndex=index;state.lastFocus=document.activeElement;state.lookupWasPlaying=state.playing;stop();uiLanguage();
 const term=chooseTerm(index),phrase=Boolean(library.phrases[term]),ctx=phrase?null:contextKey(index),data=(ctx&&library.words[ctx])||infoFor(term),lang=state.language==='uk'?0:1,story=library.story.scenes[state.scene];
 $('lookupTitle').textContent=term;$('lookupType').textContent=state.language==='uk'?(phrase?'Фраза':'Слово'):(phrase?'Phrase':'Word');$('lookupIPA').textContent=data?.[2]?'/'+data[2]+'/':'';
 $('lookupMeaning').textContent=data?.[lang]||'—';$('lookupContext').textContent=story[state.level];$('lookupTranslation').textContent=story[state.language];
 $('exampleContainer').hidden=!data?.[3];$('lookupExample').textContent=data?.[3]||'';$('lookupExampleUA').textContent=state.language==='uk'?(data?.[4]||''):(data?.[5]||'');
 state.lookupTerm=term;state.lookupData=data;renderSave();resetExplain();$('dictionaryBackdrop').hidden=false;$('lookupTitle').focus();
}
/* Strudli explains (AI tutor via /api/strudli-ai). Answer is built with textContent only; any failure shows the checked translation. */
function sentenceAt(index){const text=library.story.scenes[state.scene][state.level],tok=tokenize(text)[index];if(!tok)return text;let from=0,to=text.length;
 for(const m of text.matchAll(/[.!?…]["“”»]?\s+/g)){const s=m.index+m[0].length;if(s<=tok.start)from=s;else{to=s;break}}return text.slice(from,to).trim()}
function resetExplain(){const en=state.language==='en',b=$('aiExplainButton'),r=$('aiExplainResult');if(!b)return;b.hidden=false;b.disabled=false;b.textContent=en?'✦ Strudli explains this sentence':'✦ Strudli пояснює речення';r.hidden=true;r.replaceChildren();state.explainToken=(state.explainToken||0)+1}
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
// Strudli himself tells the explanation: the mascot sits at the top of the card and talks (CSS animation).
function strudliTalker(text,talking){const head=el('div','aiTalker'+(talking?' talking':''));const img=document.createElement('img');img.src='/strudli/strudli-storybook-hero.webp';img.alt='';img.setAttribute('aria-hidden','true');const bubble=el('p','aiHead',text);if(!talking)bubble.append(el('span','aiDots','…'));head.append(img,bubble);return head}
async function explainSentence(){const en=state.language==='en',b=$('aiExplainButton'),r=$('aiExplainResult'),token=++state.explainToken,sentence=sentenceAt(state.lookupIndex);
 b.disabled=true;b.textContent=en?'Strudli is thinking…':'Strudli думає…';let data=null;
 r.hidden=false;r.className='aiExplainResult aiThinking';r.replaceChildren(strudliTalker(en?'Strudli is thinking':'Strudli думає'));
 try{const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),16000);
  const res=await fetch('/api/strudli-ai',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:sentence,lang:en?'en':'uk'}),signal:ctrl.signal});clearTimeout(timer);
  if((res.headers.get('content-type')||'').includes('application/json'))data=await res.json()}catch{}
 if(token!==state.explainToken)return;b.hidden=true;r.hidden=false;r.className='aiExplainResult aiTold';r.replaceChildren();
 r.append(strudliTalker(en?'Strudli explains':'Strudli пояснює',true),el('p','aiSentence',sentence));
 if(data&&data.ok&&data.answer){const a=data.answer;r.append(el('p','aiTranslation',a.translation));
  if(a.words&&a.words.length){const ul=el('ul');for(const w of a.words){const li=el('li');li.append(el('b',null,w.de),document.createTextNode(' — '+w.meaning));ul.append(li)}r.append(ul)}
  r.append(el('p','aiGrammar',a.grammar));if(a.example&&a.example.de){const ex=el('p','aiExample');ex.append(el('b',null,a.example.de),el('small',null,a.example.tr));r.append(ex)}
  r.append(el('small','aiNote',en?'Strudli can make mistakes; the story translation above is checked by our team.':'Strudli може помилятися; переклад історії вище перевірений нашою командою.'))}
 else r.append(el('p','aiTranslation',en?'Strudli is offline right now. The translation above is checked by our team — ask Strudli again a bit later.':'Strudli зараз офлайн. Переклад вище перевірений нашою командою — запитай Strudli трохи пізніше.'))}

const SAVED_KEY='strudli-lesen-saved';
function savedList(){try{const v=JSON.parse(localStorage.getItem(SAVED_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return []}}
function savedIndex(term){return savedList().findIndex(x=>x.term===term&&x.story===entry.id)}
function renderSave(){const on=state.lookupTerm!=null&&savedIndex(state.lookupTerm)>=0,en=state.language==='en';$('saveWord').setAttribute('aria-pressed',String(on));$('saveWord').textContent=on?(en?'★ Saved':'★ Збережено'):(en?'☆ Save':'☆ Зберегти');$('saveWord').hidden=!state.lookupData}
function toggleSave(){if(!state.lookupData)return;const list=savedList(),i=savedIndex(state.lookupTerm);
 if(i>=0)list.splice(i,1);else list.push({term:state.lookupTerm,uk:state.lookupData[0],en:state.lookupData[1],story:entry.id,title:entry.title,at:Date.now()});
 try{localStorage.setItem(SAVED_KEY,JSON.stringify(list.slice(-300)))}catch{}renderSave()}
function openArena(){try{localStorage.setItem('strudli-arena-request',JSON.stringify({story:entry.id,at:Date.now()}))}catch{}
 try{window.parent.postMessage({type:'strudli-open-arena',story:entry.id},location.origin)}catch{}}
function closeDictionary(resume=state.lookupWasPlaying){$('dictionaryBackdrop').hidden=true;wordAudio.pause();if(state.lastFocus?.focus)state.lastFocus.focus();state.lookupWasPlaying=false;if(resume)start()}
// One visible entry to the AI tutor: explain the sentence that is being read right now.
function askStrudliNow(){const scene=currentScene();if(!scene||!scene.words||!scene.words.length){message(state.language==='en'?'Start the story first.':'Спершу запусти історію.');return}const idx=Math.max(0,Math.min(scene.words.length-1,state.captionWord));openDictionary(idx);void explainSentence()}
function askStrudliLabel(){const b=$('askStrudli');if(!b)return;const en=state.language==='en';b.childNodes[1].textContent=en?'Not clear? Ask Strudli ':'Не зрозуміло? Запитай Strudli '}
function uiLanguage(){const en=state.language==='en',t=(id,uk,e)=>{const el=$(id);if(el)el.textContent=en?e:uk};askStrudliLabel();
 const cp=$('centerPlay');if(cp){cp.setAttribute('aria-label',en?'Start the story':'Почати історію');const s=cp.querySelector('small');if(s)s.textContent=en?'Watch with sound':'Дивитися зі звуком'}
 t('lookupContextLabel','У цій історії','In this story');t('lookupExampleLabel','Простий приклад','Simple example');t('repeatWord','◖)) Прослухати','◖)) Listen');t('resumeStory','▶ Продовжити історію','▶ Continue story');t('playArena','⚡ Пограти в Арені','⚡ Play in the Arena');}
function replayWord(){if(state.lookupIndex<0)return;const w=currentScene().words[state.lookupIndex];if(!w)return;wordAudio.pause();wordAudio.src=audioSrc();
 const play=()=>{wordStopTime=w.b/1000;wordAudio.currentTime=Math.max(0,w.a/1000-.05);wordAudio.play().catch(()=>{})};
 if(wordAudio.readyState>=1)play();else wordAudio.addEventListener('loadedmetadata',play,{once:true});
}
function quizBuild(){const list=$('quizQuestions');list.innerHTML=library.story.questions.map((q,i)=>'<section class="question"><p>'+(i+1)+'. '+htmlEscape(q.de)+'</p>'+q.options.map((a,j)=>'<button type="button" data-q="'+i+'" data-a="'+j+'">'+htmlEscape(a)+'</button>').join('')+'</section>').join('');
 list.addEventListener('click',e=>{const b=e.target.closest('button[data-q]');if(!b||b.disabled)return;const qi=Number(b.dataset.q),answer=Number(b.dataset.a),q=library.story.questions[qi];for(const el of list.querySelectorAll('button[data-q="'+qi+'"]')){el.disabled=true;const j=Number(el.dataset.a);if(j===q.correct)el.classList.add('correct');if(j===answer&&j!==q.correct)el.classList.add('wrong')}
  const right=list.querySelectorAll('button.correct').length,done=list.querySelectorAll('button[disabled]').length===q.options.length*3;
  $('quizScore').textContent=done?'Результат: '+right+'/3':'';
 });
}
async function loadEntry(){
 const wanted=new URLSearchParams(location.search).get('story');
 const response=await fetch('/lesen-pilot/catalog.json',{cache:'no-cache'});if(!response.ok)throw Error('Missing story catalog');
 const catalog=await response.json(),PUBLIC_HOSTS=['wortwelt-de-ua.vercel.app'];
 // Private review stories never open on the public host, not even via ?story=.
 const list=(catalog.stories||[]).filter(s=>s&&s.status!=='draft'&&(s.access==='public'||!PUBLIC_HOSTS.includes(location.hostname)));
 const found=list.find(s=>s.id===wanted)||list[0];if(!found)throw Error('Empty story catalog');return found;
}
function applyEntry(){
 if(!entry.levels.includes(state.level))state.level=entry.levels[0];
 if(!entry.voices.includes(state.voice))state.voice=entry.defaultVoice||entry.voices[0];
 document.querySelectorAll('[data-level]').forEach(b=>{b.hidden=!entry.levels.includes(b.dataset.level)});
 [...$('voice').options].forEach(o=>{o.hidden=o.disabled=!entry.voices.includes(o.value)});
 const h=document.querySelector('.intro h1');if(h)h.innerHTML=htmlEscape(entry.title)+(entry.subtitle?' <span>· '+htmlEscape(entry.subtitle)+'</span>':'');
 const e=document.querySelector('.intro .eyebrow');if(e&&entry.eyebrow)e.textContent=entry.eyebrow;
 document.title='Strudli Learning · Lesen — '+entry.title+(entry.subtitle?' · '+entry.subtitle:'');
}
async function boot(){try{
 entry=await loadEntry();applyEntry();
 const [responseA,responseB]=await Promise.all([fetch(entry.data,{cache:'no-cache'}),fetch(entry.timings,{cache:'no-cache'})]);if(!responseA.ok||!responseB.ok)throw Error('Missing learning assets');
 library=await responseA.json();cues=await responseB.json();if(!cues[state.level]?.[state.voice]?.scenes?.length)throw Error('Missing narration timing');
 const first=library.story.images[library.story.scenes[0].art];if($('imageOne').getAttribute('src')!==first)$('imageOne').setAttribute('src',first);
 renderLevels();uiLanguage();$('voice').value=state.voice;$('language').value=state.language;audio.src=audioSrc();audio.volume=.9;audio.playbackRate=1;audio.load();prepareNative();
 state.scene=-1;buildMotion(activeMotion,library.story.scenes[0]);showScene(0);state.timeMs=0;drawMarkers();$('imageOne').addEventListener('load',fitMotion);fitMotion();drawTimeline();quizBuild();scrubSetup();$('centerPlay').disabled=false;
 ['imageOne','imageTwo'].forEach(id=>{$(id).addEventListener('error',()=>message('Не вдалося завантажити малюнок'))});
 }catch(err){message('Не вдалося завантажити історію: '+err.message);$('centerPlay').disabled=true}}
// Arbitrary-element fullscreen is unavailable in iOS Safari and many in-app browsers.
const vocabHome=$('dictionaryBackdrop').parentNode;
const onIOS=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);

/* Full iPhone fullscreen needs a real H.264 video. WebKit cannot fullscreen
   arbitrary interactive DOM on iPhone or remove a host app's browser chrome. */
let nativeExitGuard=false;
function prepareNative(){
 const v=$('nativeVideo'),src=videoSrc();
 if(v.getAttribute('src')!==src){v.pause();v.setAttribute('src',src);v.load()}
}
function syncNativeExit(){
 if(nativeExitGuard)return;
 nativeExitGuard=true;
 const v=$('nativeVideo'),ms=Math.round((Number.isFinite(v.currentTime)?v.currentTime:0)*1000);
 v.pause();setTime(ms,false);syncTheater();
 nativeExitGuard=false;
}
function beginNativeFullscreen(){
 const v=$('nativeVideo');
 if(!getTrack())return;
 prepareNative();
 if(v.error){message('Повноекранний відеофайл не завантажився. Онови сторінку.');return}
 if(v.readyState<1){message('Завантаження відео… Натисни ⛶ ще раз.');return}
 const target=clamp(state.playing?audio.currentTime:state.timeMs/1000,0,getTrack().durationMs/1000);
 stop();
 try{v.currentTime=target}catch{}
 try{
  if(typeof v.webkitEnterFullscreen==='function'){v.webkitEnterFullscreen()}
  else if(typeof v.requestFullscreen==='function'){v.requestFullscreen().catch(()=>{})}
  else{message('Для нативного повноекранного відео відкрий посилання у Safari.');return}
  Promise.resolve(v.play()).catch(()=>message('Натисни ▶ у повноекранному відеоплеєрі.'));
 }catch{
  message('Вбудований браузер заборонив нативний fullscreen. Відкрий посилання у Safari.');
 }
}

function theaterFull(){return document.fullscreenElement===$('cinema')||$('cinema').classList.contains('mobileFullscreen')}
function syncTheater(){
 setTimeout(fitMotion,60);
 const active=theaterFull(),pane=$('cinema'),popup=$('dictionaryBackdrop'),button=$('fullscreen');
 pane.classList.toggle('fullscreenLayout',active);document.body.classList.toggle('cinemaFull',active);
 button.textContent=active?'✕':'⛶';button.setAttribute('aria-label',active?'Вийти з повноекранного режиму':'На весь екран');
 button.title=active?'Вийти з повноекранного режиму':'На весь екран';
 if(active&&popup.parentNode!==pane)pane.appendChild(popup);
 if(!active&&popup.parentNode!==vocabHome)vocabHome.appendChild(popup);
 if(!active)showSettings(false);
}
async function theaterToggle(){
 if(onIOS){beginNativeFullscreen();return}
 const pane=$('cinema');
 if(theaterFull()){
  if(document.fullscreenElement===pane){try{await document.exitFullscreen()}catch{}}
  pane.classList.remove('mobileFullscreen');syncTheater();return;
 }
 if(!onIOS&&typeof pane.requestFullscreen==='function'){
  try{await pane.requestFullscreen({navigationUI:'hide'});syncTheater();return}catch{}
 }
 pane.classList.add('mobileFullscreen');syncTheater();
}
document.addEventListener('fullscreenchange',syncTheater);
document.addEventListener('webkitfullscreenchange',syncTheater);

function wire(){
 $('nativeVideo').addEventListener('webkitendfullscreen',syncNativeExit);
 $('nativeVideo').addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)syncNativeExit()});
 $('nativeVideo').addEventListener('error',()=>message('Відео для fullscreen не вдалося завантажити.'));
 $('playPause').onclick=togglePlay;$('centerPlay').onclick=start;$('sound').onclick=toggleMute;
 $('visual').addEventListener('click',e=>{if(e.target.closest('button'))return;togglePlay()});
 $('captions').addEventListener('click',e=>{const btn=e.target.closest('button[data-word]');if(btn)openDictionary(Number(btn.dataset.word))});
 $('cc').onclick=toggleCC;$('volume').oninput=e=>{audio.volume=Number(e.target.value)/100;audio.muted=false;$('sound').textContent='◖))'};
 $('settingsButton').onclick=()=>showSettings($('settings').hidden);$('settingsClose').onclick=()=>showSettings(false);
 $('voice').onchange=e=>{trackChange(state.level,e.target.value);showSettings(false)};
 $('speed').onchange=e=>{audio.playbackRate=Number(e.target.value);wordAudio.playbackRate=Number(e.target.value)};
 $('language').onchange=e=>{state.language=e.target.value;persist();uiLanguage()};
 $('showLesson').onclick=()=>{$('quiz').hidden=false;showSettings(false);$('quiz').scrollIntoView({behavior:'smooth'})};
 $('fullscreen').onclick=theaterToggle;
 document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{trackChange(b.dataset.level,state.voice);$('quiz').hidden=true});
 $('lookupClose').onclick=()=>closeDictionary();$('aiExplainButton').onclick=()=>void explainSentence();$('askStrudli').onclick=askStrudliNow;$('resumeStory').onclick=()=>closeDictionary(true);$('repeatWord').onclick=replayWord;$('saveWord').onclick=toggleSave;$('playArena').onclick=openArena;$('playArena').hidden=!document.documentElement.classList.contains('pilotEmbedded');
 $('dictionaryBackdrop').addEventListener('click',e=>{if(e.target===$('dictionaryBackdrop'))closeDictionary()});
 $('restart').onclick=()=>{$('quiz').hidden=true;setTime(0,true);window.scrollTo({top:0,behavior:'smooth'})};
 audio.onended=()=>{state.playing=false;cancelAnimationFrame(timeLoop);state.timeMs=getTrack().durationMs;display();$('quiz').hidden=false;$('quiz').scrollIntoView({behavior:'smooth',block:'start'})};
 audio.onerror=()=>message('Аудіо не завантажилося. Перевір з’єднання й онови сторінку.');
 wordAudio.ontimeupdate=()=>{if(wordAudio.currentTime>=wordStopTime)wordAudio.pause()};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('dictionaryBackdrop').hidden)closeDictionary();else if(!$('settings').hidden)showSettings(false);else if(theaterFull())theaterToggle();return}
  if(!$('dictionaryBackdrop').hidden||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
  if(['Space','KeyK'].includes(e.code)){e.preventDefault();togglePlay()}
  if(e.code==='ArrowLeft'||e.code==='ArrowRight'){if(e.target.id==='timeline')return;e.preventDefault();setTime(state.timeMs+(e.code==='ArrowRight'?5000:-5000),state.playing)}
  if(e.code==='KeyM')toggleMute();if(e.code==='KeyC')toggleCC();if(e.code==='KeyF')$('fullscreen').click();
  if(/Digit[1-7]/.test(e.code)){const i=Number(e.code.slice(-1))-1;setTime(getTrack().scenes[i].startMs,true)}
 });
}
wire();boot();
