import {readFile,mkdir,writeFile} from "node:fs/promises";
const t=await readFile(new URL("../src/data.ts",import.meta.url),"utf8");
const a=t.indexOf("=[",t.indexOf("export const DEMO_WORDS"))+1,b=t.indexOf("];",a),words=JSON.parse(t.slice(a,b+1));
const remaining=words.filter(w=>w.photo?.startsWith("/photos/grammar/"));
if(remaining.length>48)throw Error("More than 48 grammatical illustrations remain");
const output=new URL("../public/photos/grammar/",import.meta.url);await mkdir(output,{recursive:true});
const human=(x,y,scale=1,shade="#89c3b8")=>'<g transform="translate('+x+' '+y+') scale('+scale+')"><circle cx="0" cy="-97" r="55" fill="#f2c6a4" stroke="#d6aa8b" stroke-width="6"/><circle cx="-19" cy="-103" r="5" fill="#4b6977"/><circle cx="19" cy="-103" r="5" fill="#4b6977"/><path d="M-20 -66Q0 -52 20 -66" stroke="#ae8c76" fill="none" stroke-width="6"/><path d="M-78-18Q0-66 78-18L86 122H-86Z" fill="'+shade+'" stroke="#468da1" stroke-width="10"/></g>';
const line=(x,y,X,Y)=>'<path d="M'+x+' '+y+'L'+X+' '+Y+'" stroke="#4e9eb4" stroke-width="17" stroke-linecap="round" fill="none" marker-end="url(#ar)"/>';
const orb=(x,y,rad,color)=>'<circle cx="'+x+'" cy="'+y+'" r="'+rad+'" fill="'+color+'"/>';
const box=(content)=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 768"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eaf7ff"/><stop offset="1" stop-color="#e9f6ec"/></linearGradient><marker id="ar" markerWidth="10" markerHeight="10" refX="8" refY="5"><path d="M0 0L9 5L0 10Z" fill="#4e9eb4"/></marker></defs><rect width="768" height="768" fill="url(#bg)"/><rect x="74" y="74" width="620" height="620" rx="49" fill="#fff" stroke="#d3eaf0" stroke-width="4"/>'+content+'</svg>';
const draw=(w)=>{
  const n=Number(w.id.split("-")[1]);let image="";
  if(w.topic==="pronouns"){
    const group=[108,109,111,115,116,125,126,130,133].includes(n);
    if(group)image=human(250,461,.68,"#80bac7")+human(388,443,.79,"#82c5a3")+human(530,461,.68,"#e9b291");
    else if(n===131)image='<circle cx="384" cy="433" r="159" fill="#e5eff4" stroke="#a9cad7" stroke-width="12" stroke-dasharray="20 16"/>';
    else if([107,129].includes(n))image='<rect x="287" y="332" width="196" height="205" rx="23" fill="#bfe4e9" stroke="#619fb9" stroke-width="13"/>';
    else image=human(379,450,1.05);
    if([104,110,112,113,114,117,118,119,120,127,128,129].includes(n))image+=line(178,500,279,500);
    if([117,118,119,120,121,122,123,124,125,126].includes(n))image+='<path d="M485 420Q532 385 577 420V520Q530 489 485 520Z" fill="#d0e9ee" stroke="#619eae" stroke-width="12"/>'+line(450,496,488,496);
    if([130,133].includes(n))image+='<path d="M174 298L200 325L232 284M345 260L377 287L411 252M500 296L528 322L560 282" fill="none" stroke="#4fb49a" stroke-width="14" stroke-linecap="round"/>';
    if(n===132)image+=orb(546,295,36,"#efbb92");
  }else{
    const k=w.de;
    if(k==="zusammen")image=human(300,450,.81)+human(488,450,.81,"#a9c6a8");
    else if(k==="allein")image=human(385,450,1.02)+'<circle cx="385" cy="435" r="203" fill="none" stroke="#a7d2de" stroke-width="11" stroke-dasharray="17 14"/>';
    else if(["sehr","ziemlich","genug"].includes(k)){let num=k==="sehr"?5:k==="ziemlich"?3:4;image=Array.from({length:5},(_,i)=>'<rect x="'+(205+i*76)+'" y="'+(548-i*48)+'" width="58" height="'+(60+i*48)+'" rx="14" fill="'+(i<num?"#84c9af":"#d7e9ee")+'"/>').join("");}
    else if(["auch","und","oder","aber"].includes(k)){image=orb(257,428,80,"#84c9b4")+orb(512,428,80,"#f0bc92");if(k==="und"||k==="auch")image+='<path d="M384 377V480M331 426H437" stroke="#508ea7" stroke-width="18" stroke-linecap="round"/>';else if(k==="oder")image+=line(385,293,270,345)+line(385,293,506,345);else image+='<path d="M362 428H411" stroke="#91b6c3" stroke-width="16" stroke-dasharray="10 10"/>';}
    else if(k==="nur")image=human(385,449,.99)+'<ellipse cx="385" cy="437" rx="152" ry="216" fill="none" stroke="#e7b687" stroke-width="14"/>';
    else if(["dann","zuerst","danach","deshalb"].includes(k))image=[236,385,535].map((x,i)=>orb(x,428,64,(k==="zuerst"&&i===0||k==="dann"&&i===1||k==="danach"&&i===2)?"#edb98e":"#afdbe6")).join("")+line(310,428,318,428)+line(455,428,461,428);
    else if(["vielleicht","ungefähr"].includes(k))image='<circle cx="385" cy="423" r="172" fill="none" stroke="#83bbc7" stroke-dasharray="19 17" stroke-width="18"/>'+orb(404,406,37,"#eab991");
    else if(k==="natürlich")image=orb(384,364,116,"#fbd68f")+'<path d="M384 573V469M382 508Q275 493 286 425Q374 420 382 508M386 482Q492 469 484 399Q394 418 386 482" fill="#92cead" stroke="#70ae91" stroke-width="11"/>';
    else if(k==="besonders")image='<path d="M385 252L428 381L559 381L449 462L485 587L385 510L285 587L321 462L211 381L343 381Z" fill="#fbd185" stroke="#d7a75f" stroke-width="12"/>';
    else if(k==="wirklich")image=orb(385,426,161,"#dff4e6")+'<path d="M291 430L354 492L487 345" fill="none" stroke="#4eac91" stroke-width="35" stroke-linecap="round"/>';
    else throw Error("Missing design for "+k);
  }
  return box(image);
};
for(const w of remaining){const drawing=draw(w);if(!drawing.startsWith("<svg ")||!drawing.endsWith("</svg>")||drawing.includes("NaN")||drawing.includes("undefined")||/<text[\s>]/.test(drawing))throw Error("bad original image "+w.id);await writeFile(new URL(w.id+".svg",output),drawing)}
console.log(`Generated ${remaining.length} remaining grammatical SVG illustrations.`);
