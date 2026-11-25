import{createHash}from"node:crypto";
import {mkdir,writeFile,readFile} from "node:fs/promises";
function wrapSvg(body){
return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 768" role="img"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e8f6ff"/><stop offset="1" stop-color="#edf8f3"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="10" stdDeviation="13" flood-color="#31596a" flood-opacity=".12"/></filter><marker id="arrow" markerWidth="11" markerHeight="11" refX="9" refY="5.5" orient="auto"><path d="M0 0L10 5.5L0 11Z" fill="#4c9cb5"/></marker></defs><rect width="768" height="768" fill="url(#bg)"/><rect x="83" y="79" width="602" height="610" rx="46" fill="#fff" filter="url(#shadow)"/><circle cx="137" cy="134" r="11" fill="#bedde8"/><circle cx="171" cy="134" r="11" fill="#c9e8db"/>${body}</svg>`;
}
function icon(key,x,y,size=1){
const back='#eaf4f8',ink='#28657f',blue='#64acc4',mint='#77c7ac',amber='#efb67e',red='#df888b';
const circle=(cx,cy,r,fill,stroke='none',sw=6)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const path=(d,stroke=ink,sw=12,fill='none')=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
let content='';
switch(key){
case'person':case'personHappy':case'personSad':case'personConfused':case'personWave':case'personRaised':case'personWork':
 content=circle(0,-66,55,'#f1c499',ink,5)+`<path d="M-77 17Q0-28 77 17V120H-77Z" fill="${key==='personSad'?red:blue}" stroke="${ink}" stroke-width="8"/>`+
 circle(-19,-75,5,ink)+circle(19,-75,5,ink);
 if(key==='personSad')content+=path('M-21 -30Q0 -47 21 -30',ink,5);
 else if(key==='personConfused')content+=path('M-10 -30H12',ink,6);
 else content+=path('M-20 -39Q0 -17 20 -39',ink,5);
 if(key==='personWave'||key==='personRaised')content+=path('M65 27Q109 -5 112 -107', '#efbd92',20)+path('M111 -102L93 -145M111 -102L129 -148M111 -102L154 -133','#efbd92',11);
 else if(key==='personWork')content+=path('M60 39L103 93','#efbd92',21)+path('M-60 39L-101 93','#efbd92',21);
 else content+=path('M-73 40L-100 98M73 40L100 98','#efbd92',19);
 break;
case'twoPeople': content=icon('person',-87,20,.63)+icon('personHappy',92,20,.63);break;
case'wave':content=path('M-84 80Q-101 15-91 -55Q-87 -92-60 -70L-29 0V-118Q-18-144 0-126V-66V-150Q19-165 27-145V-61L44-124Q65-140 73-123V-34Q110-58 120-35Q129-13 96 48L60 104Q-11 130-84 80Z','#d38f70',7,'#f3c7a3');break;
case'hand':content=icon('wave',0,0,.8);break;
case'handshake': content=path('M-116-12L-47 22L-4 0L42 27L111-14',blue,26)+path('M-44 24L-12 57L26 52L54 15',amber,25);break;
case'heart':case'hearts':content=`<path d="M0 99C-168 12-138-111-54-102Q-14-98 0-52Q29-126 95-104Q184-64 0 99Z" fill="#e78c9b" stroke="#bc6c85" stroke-width="7"/>`;if(key==='hearts')content+=circle(92,-115,24,'#f7c9d2');break;
case'speech':content=`<path d="M-132-92H116Q139-92 139-65V65Q139 92 112 92H-34L-100 131L-86 92H-130Q-149 92-149 68V-59Q-149-92-132-92Z" fill="#dceff6" stroke="${ink}" stroke-width="9"/>`+[-50,0,50].map(i=>circle(i,2,11,blue)).join('');break;
case'farewell':content=icon('speech',0,0,.88)+path('M-68-70L61 62',red,12);break;
case'arrowAway':content=path('M-100 0H89',blue,18)+path('M58 -46L111 0L58 46',blue,18);break;
case'clock': content=circle(0,0,121,'#f4fbfc',blue,12)+path('M0 -74V0L67 46',ink,13)+circle(0,0,11,amber);break;
case'calendar':content=`<rect x="-110" y="-114" width="218" height="226" rx="22" fill="#e2f3f7" stroke="${blue}" stroke-width="12"/><path d="M-110-45H108" stroke="${blue}" stroke-width="27"/>`+[-62,0,62].map(xx=>[-4,63].map(yy=>`<rect x="${xx-19}" y="${yy-20}" width="38" height="34" rx="7" fill="${xx===0&&yy===-4?amber:mint}"/>`).join('')).join('');break;
case'gift':content=`<rect x="-94" y="-58" width="189" height="155" rx="15" fill="#f7cc9a" stroke="#dba365" stroke-width="9"/><rect x="-115" y="-79" width="231" height="45" rx="8" fill="#edb17e"/><path d="M0-83V100M-111-33H111" stroke="#fff" stroke-width="18"/><path d="M0-79C-65-139-106-97-57-71M0-79C65-139 106-97 57-71" fill="none" stroke="${blue}" stroke-width="11"/>`;break;
case'question':content=path('M-75-53Q-70-130 11-128Q82-121 77-60Q73-24 18-1Q1 9 1 39',ink,24)+circle(0,93,14,ink);break;
case'check':content=path('M-105 0L-32 82L116-97','#32a586',25);break;
case'cross':content=path('M-91-91L90 92M90-91L-91 92',red,24);break;
case'globe':content=circle(0,0,118,'#c9e8ef',ink,10)+path('M-114 0H114M0-113V113M-92-54H92M-92 54H92',blue,8)+`<ellipse rx="55" ry="116" fill="none" stroke="${blue}" stroke-width="8"/>`;break;
case'flagUA':content=`<rect x="-111" y="-71" width="223" height="142" rx="8" fill="#ffd44c"/><path d="M-111-71H112V0H-111Z" fill="#4c9cdb"/><rect x="-111" y="-71" width="223" height="142" rx="8" fill="none" stroke="${ink}" stroke-width="7"/>`;break;
case'flagDE':content=`<rect x="-111" y="-72" width="222" height="144" rx="7" fill="#edca58"/><path d="M-111-72H111V-24H-111Z" fill="#292e35"/><path d="M-111-24H111V24H-111Z" fill="#dc6f74"/><rect x="-111" y="-72" width="222" height="144" rx="7" fill="none" stroke="${ink}" stroke-width="7"/>`;break;
case'flagUK':content=`<rect x="-111" y="-70" width="222" height="140" rx="7" fill="#3e659d"/><path d="M-106-67L105 66M105-67L-106 66" stroke="#fff" stroke-width="27"/><path d="M-106-67L105 66M105-67L-106 66" stroke="#ce525e" stroke-width="12"/><path d="M0-70V70M-111 0H111" stroke="#fff" stroke-width="35"/><path d="M0-70V70M-111 0H111" stroke="#d95f68" stroke-width="18"/><rect x="-111" y="-70" width="222" height="140" rx="7" fill="none" stroke="${ink}" stroke-width="7"/>`;break;
case'house':content=`<path d="M-122-18L0-119L122-18" fill="none" stroke="${ink}" stroke-width="22" stroke-linejoin="round"/><rect x="-101" y="-14" width="202" height="144" rx="9" fill="#c8ebdc" stroke="#4e9c93" stroke-width="9"/><rect x="-21" y="53" width="60" height="77" rx="7" fill="${amber}"/><rect x="-78" y="26" width="41" height="41" rx="5" fill="#fff"/>`;break;
case'book':content=`<path d="M0-87Q-65-115-120-79V103Q-49 63 0 95Q49 63 120 103V-79Q65-115 0-87Z" fill="#d3edf4" stroke="${ink}" stroke-width="10"/><path d="M0-87V95M-101-50L-23-45M-101-10L-23-5M23-45L98-50M23-5L98-10" stroke="${blue}" stroke-width="9"/>`;break;
case'nameBadge':content=`<rect x="-122" y="-73" width="244" height="164" rx="19" fill="#e8f4f8" stroke="${ink}" stroke-width="10"/>`+circle(-70,1,30,amber)+path('M-100 58Q-70 22-40 58',blue,13)+path('M-7-6H97M-7 35H74',ink,10);break;
case'puzzle':content=`<path d="M-100-100H-21Q-12-68 22-72Q50-75 51-100H102V-22Q70-17 71 16Q71 44 102 50V105H22Q15 72-14 72Q-45 72-49 105H-100Z" fill="#a8d9e1" stroke="${ink}" stroke-width="11"/>`;break;
case'repeat':content=path('M-102-28Q-78-118 22-95Q83-85 104-30',blue,20)+path('M74-60L106-25L137-58',blue,16)+path('M102 34Q71 118-17 96Q-83 87-101 32',mint,20)+path('M-134 53L-105 26L-77 59',mint,16);break;
case'snail':content=`<ellipse cx="-5" cy="73" rx="122" ry="42" fill="#9acda6"/><circle cx="-35" cy="-16" r="83" fill="#e3bb8b" stroke="#b58f66" stroke-width="9"/>`+path('M-40-16Q22-45 4 20Q-23 61-64 12', '#b58f66',10)+path('M99 59V-81M118 59V-80',mint,11)+circle(101,-91,13,ink)+circle(119,-91,13,ink);break;
case'price':content=`<path d="M-130-72H60L131 0L60 75H-130Z" fill="#ffe0ad" stroke="${ink}" stroke-width="12"/>`+circle(-91,0,17,'#fff')+`<path d="M8-41Q-33-67-44-22Q-45 4 6 2Q64 2 43 41Q19 67-32 38M10-67V70" fill="none" stroke="#b3854c" stroke-width="13" stroke-linecap="round"/>`;break;
case'toilet':content=`<rect x="-80" y="-112" width="160" height="72" rx="11" fill="#a6d0dd" stroke="${ink}" stroke-width="9"/><path d="M-110-36H104Q107 74 3 86Q-100 74-110-36Z" fill="#e5f4f8" stroke="${ink}" stroke-width="10"/><path d="M4 80V121M-70 119H70" stroke="${ink}" stroke-width="13"/>`;break;
case'location':content=`<path d="M0 122Q-119-21-90-78A99 99 0 0 1 91-78Q120-21 0 122Z" fill="#e49c82" stroke="${ink}" stroke-width="10"/>`+circle(0,-51,35,'#fff');break;
case'flowers':content=[0,72,-72].map((xx,i)=>`<path d="M${xx} 80L${xx+8} -16" stroke="#69a28d" stroke-width="10"/><circle cx="${xx+8}" cy="-58" r="37" fill="${i===0?'#efb67e':'#e9a5b6'}"/><circle cx="${xx+8}" cy="-58" r="13" fill="#ffe4aa"/>`).join('');break;
case'star':content=`<path d="M0-127L31-43L119-40L50 14L71 109L0 60L-75 109L-51 14L-122-40L-32-43Z" fill="#f4c76f" stroke="#cd9e4b" stroke-width="8"/>`;break;
case'target':content=circle(0,0,114,'#e4f5f5',ink,11)+circle(0,0,76,'#f0b6ae',red,9)+circle(0,0,37,'#fff',ink,7);break;
case'sprout':case'growth':content=path('M0 115V-25','#609979',12)+`<path d="M0-20Q-105-10-110-105Q-39-107 0-20M0-50Q111-60 112-133Q21-146 0-50" fill="#8fcfa9" stroke="#609979" stroke-width="8"/>`+`<path d="M-124 117H124" stroke="#d0aa75" stroke-width="18"/>`;break;
case'tools':content=path('M-82 107L67-98','#5595ac',26)+`<circle cx="-80" cy="112" r="21" fill="#5595ac"/><path d="M61-101L106-119L118-75L89-53" fill="none" stroke="${ink}" stroke-width="24" stroke-linecap="round"/>`;break;
case'exclamation':content=path('M0-92V34',red,28)+circle(0,91,18,red);break;
case'checklist':content=`<rect x="-98" y="-124" width="194" height="255" rx="16" fill="#e7f4f7" stroke="${ink}" stroke-width="9"/>`+[-73,-8,57].map(yy=>path(`M-69 ${yy}L-49 ${yy+17}L-21 ${yy-20}`,mint,10)+path(`M2 ${yy}H63`,blue,10)).join('');break;
case'lockOpen':content=`<rect x="-83" y="-16" width="168" height="145" rx="20" fill="#bde4cc" stroke="${ink}" stroke-width="11"/><path d="M-33-20V-83Q-34-150 37-142Q98-132 92-65" fill="none" stroke="${ink}" stroke-width="22"/>`+circle(0,42,18,ink);break;
case'lightbulb':content=`<path d="M-80-39Q-80-120 0-126Q80-120 80-39Q80 0 36 51V81H-36V51Q-80 0-80-39Z" fill="#ffe3a7" stroke="${ink}" stroke-width="10"/><path d="M-32 100H32M-17 116H17" stroke="${ink}" stroke-width="13" stroke-linecap="round"/>`;break;
case'contract':content=`<rect x="-104" y="-127" width="208" height="254" rx="14" fill="#e7f4f8" stroke="${ink}" stroke-width="10"/>`+[-63,-23,18,59].map(yy=>path(`M-71 ${yy}H67`,blue,9)).join('')+path('M-72 100Q-27 62 27 95',ink,9);break;
case'empty':content=`<rect x="-114" y="-74" width="227" height="166" rx="15" fill="none" stroke="${ink}" stroke-width="13" stroke-dasharray="19 15"/>`;break;
case'chair':content=`<rect x="-80" y="-115" width="162" height="157" rx="18" fill="#c6dfdf" stroke="${ink}" stroke-width="11"/><rect x="-110" y="14" width="221" height="57" rx="16" fill="#a6cbd4" stroke="${ink}" stroke-width="10"/><path d="M-69 65V129M70 65V129" stroke="${ink}" stroke-width="14"/>`;break;
case'ringOff':content=`<ellipse rx="96" ry="96" fill="none" stroke="#e6b95b" stroke-width="26"/>`+path('M-119 115L113-117',red,18);break;
case'flowerWilt':content=path('M14-30Q-60 17 13 112','#79a78a',10)+circle(-11,-56,39,'#db99aa')+path('M-28-18Q20 42-47 41',red,8);break;
case'sleep':content=icon('person',0,24,.68)+`<path d="M-85-88L-30-88L-80-38H-30M6-132H72L7-55H73" stroke="${blue}" stroke-width="9" fill="none" stroke-linejoin="round"/>`;break;
case'help':content='<circle cx="0" cy="0" r="117" fill="#f6b988" stroke="#bc8468" stroke-width="8"/><circle cx="0" cy="0" r="58" fill="#fff" stroke="#4e9bb5" stroke-width="13"/><path d="M-88-77L-40-33M88-77L40-33M-88 77L-40 33M88 77L40 33" stroke="#fff" stroke-width="27" stroke-linecap="round"/>';break;
default:throw Error('Unknown icon: '+key);
}
return `<g transform="translate(${x} ${y}) scale(${size})">${content}</g>`;
}
function scene(id,spec){
const [left,right]=spec;
let body=icon(left,268,397,.79)+icon(right,510,415,.72);
if(left==='flagUA'||left==='flagDE'||left==='flagUK')body=icon(left,272,379,.93)+icon(right,512,432,.72);
if(right==='flagUA'||right==='flagDE'||right==='flagUK')body=icon(left,257,425,.78)+icon(right,512,354,.9);
if(id==='phrases-19'||id==='phrases-21'||id==='phrases-17'||id==='phrases-15'||id==='phrases-35'||id==='phrases-30'||id==='verbs-822'||id==='ww-new-161')body+=`<path d="M348 478L411 478" fill="none" stroke="#5e9caf" stroke-width="12" marker-end="url(#arrow)"/>`;
if(id==='phrases-8'||id==='phrases-7')body+=icon('arrowAway',383,582,.42);
if(id==='verbs-824')body+=icon('clock',403,595,.25);
return wrapSvg(body);
}
const catalog={"phrases-6":["personWave","arrowAway"],"phrases-7":["personWave","clock"],"phrases-8":["personWave","calendar"],"phrases-9":["handshake","heart"],"phrases-10":["handshake","hearts"],"phrases-11":["gift","hand"],"phrases-12":["personRaised","speech"],"phrases-13":["personSad","heart"],"phrases-14":["check","personHappy"],"phrases-15":["twoPeople","question"],"phrases-16":["personHappy","check"],"phrases-17":["twoPeople","nameBadge"],"phrases-18":["personRaised","nameBadge"],"phrases-19":["person","globe"],"phrases-20":["flagUA","person"],"phrases-21":["person","house"],"phrases-22":["flagDE","house"],"phrases-23":["personConfused","puzzle"],"phrases-24":["speech","repeat"],"phrases-25":["speech","flagUK"],"phrases-26":["book","flagDE"],"phrases-27":["speech","snail"],"phrases-28":["personConfused","question"],"phrases-29":["personSad","help"],"phrases-30":["handshake","help"],"phrases-31":["price","question"],"phrases-32":["toilet","location"],"phrases-33":["clock","hand"],"phrases-34":["gift","heart"],"phrases-35":["personRaised","question"],"phrases-36":["check","speech"],"phrases-37":["cross","speech"],"phrases-38":["handshake","twoPeople"],"phrases-39":["flowers","heart"],"verbs-798":["person","star"],"verbs-799":["person","gift"],"verbs-800":["sprout","growth"],"verbs-825":["checklist","person"],"verbs-830":["person","star"],"ww-new-161":["contract","cross"],"ww-new-180":["personHappy","heart"],"ww-new-201":["person","ringOff"]};
const source=await readFile(new URL("../src/data.ts",import.meta.url),"utf8");
const a=source.indexOf("=[",source.indexOf("export const DEMO_WORDS"))+1,b=source.indexOf("];",a),words=JSON.parse(source.slice(a,b+1));
const folder=new URL("../public/photos/situations/",import.meta.url);await mkdir(folder,{recursive:true});
for (const [id,spec] of Object.entries(catalog)){const w=words.find(x=>x.id===id);const original="/photos/situations/"+id+".svg";const approved=new Set(["phrases-2","phrases-6","phrases-7","phrases-8","phrases-9","phrases-10","phrases-11","phrases-12","phrases-13","phrases-14","phrases-15","phrases-16","phrases-17","phrases-18","phrases-19","phrases-20","phrases-21","phrases-22","phrases-23","phrases-24","phrases-25","phrases-26","phrases-27","phrases-28","phrases-29","phrases-30","phrases-31","phrases-32","phrases-33","phrases-34","phrases-35","phrases-36","phrases-37","phrases-38","phrases-39"]);
 const remote="https://wortwelt-de-ua.floot.app/_cdn/static/wortwelt-20261023-"+id+".webp";
 const permanent="/photos/approved/"+id+".webp";
 const mirrored="/photos/"+createHash("sha256").update(remote).digest("hex").slice(0,18)+".webp";
 if(!w||(!approved.has(id)&&w.photo!==original)||(approved.has(id)&&w.photo!==remote&&w.photo!==mirrored&&w.photo!==permanent))throw Error("Source mismatch "+id);const art=scene(id,spec);if(!art.startsWith("<svg ")||!art.endsWith("</svg>")||art.includes("NaN")||art.includes("undefined")||/<text[\s>]/.test(art))throw Error("Bad drawing "+id);await writeFile(new URL(id+".svg",folder),art);}
console.log("Batch 3 generated "+Object.keys(catalog).length+" clean situation SVGs.");
