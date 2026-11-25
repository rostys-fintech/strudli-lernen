import{mkdir,writeFile,readFile}from"node:fs/promises";
function panel(content){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 768" role="img"><defs><linearGradient id="wash" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e9f6fc"/><stop offset="1" stop-color="#e1f5ec"/></linearGradient><filter id="sh" x="-25%" y="-25%" width="150%" height="155%"><feDropShadow dx="0" dy="7" stdDeviation="9" flood-color="#185d7e" flood-opacity=".13"/></filter><marker id="tip" viewBox="0 0 12 12" markerWidth="8" markerHeight="8" refX="9" refY="6" orient="auto"><path d="M1 1L11 6L1 11Z" fill="#218ca7"/></marker></defs><rect width="768" height="768" fill="url(#wash)"/><rect x="78" y="73" width="612" height="622" rx="46" fill="#fff" filter="url(#sh)"/><circle cx="132" cy="128" r="11" fill="#c5e6f3"/><circle cx="171" cy="128" r="11" fill="#cdeede"/>${content}</svg>`;}
function line(x,y,X,Y,color="#218ca7",width=15){return `<path d="M${x} ${y}L${X} ${Y}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;}
function arrow(x,y,X,Y,color="#218ca7",width=16){return `<path d="M${x} ${y}L${X} ${Y}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" marker-end="url(#tip)"/>`;}
function person(x=380,y=445,scale=1,c="#73b8cd"){return `<g transform="translate(${x} ${y}) scale(${scale})"><circle cx="0" cy="-100" r="45" fill="#f5c49d" stroke="#dfac8c" stroke-width="6"/><path d="M-64-38Q0-72 64-38L66 68H-66Z" fill="${c}" stroke="#36829d" stroke-width="8" stroke-linejoin="round"/><path d="M-44 75L-58 172M44 75L58 172" stroke="#407b94" stroke-width="23" stroke-linecap="round"/><path d="M-65-24L-106 78M65-24L106 78" stroke="#f0b990" stroke-width="18" stroke-linecap="round"/></g>`;}
function house(x=380,y=440,s=1){return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-141-8L0-134L141-8" fill="none" stroke="#318c9d" stroke-width="27" stroke-linecap="round" stroke-linejoin="round"/><rect x="-113" y="-12" width="226" height="199" rx="13" fill="#bcdfd4" stroke="#368f8b" stroke-width="10"/><rect x="-26" y="75" width="62" height="111" rx="5" fill="#eeac71"/><rect x="-89" y="28" width="49" height="52" rx="5" fill="#fff"/></g>`;}
function clock(x=384,y=390,r=116){return `<circle cx="${x}" cy="${y}" r="${r}" fill="#f0f9fc" stroke="#4e94af" stroke-width="15"/>${line(x,y,x,y-r*.59,"#3e7996",12)}${line(x,y,x+r*.4,y+r*.22,"#3e7996",12)}<circle cx="${x}" cy="${y}" r="10" fill="#f0a36f"/>`;}
function doc(x=370,y=400,s=1){return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-95" y="-134" width="190" height="264" rx="17" fill="#e9f6fd" stroke="#5993ae" stroke-width="12"/><path d="M-57-74H54M-57-25H60M-57 22H34M-57 66H55" stroke="#9ebfce" stroke-width="12" stroke-linecap="round"/></g>`;}
function gift(x=380,y=435,s=1){return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-93" y="-48" width="186" height="155" rx="12" fill="#f3ba8c" stroke="#ce815f" stroke-width="9"/><rect x="-111" y="-75" width="222" height="46" rx="8" fill="#f7d7a4"/><path d="M0-76V107M-111-29H111" stroke="#fff" stroke-width="18"/><path d="M0-70C-90-108-80-150-27-142Q0-124 0-70M0-70C90-108 80-150 27-142Q0-124 0-70" stroke="#60acb4" stroke-width="12" fill="none"/></g>`;}
function magnify(x=382,y=370,s=1){return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-19" cy="-38" r="96" fill="#eff9fd" fill-opacity=".62" stroke="#4397ac" stroke-width="22"/><path d="M50 32L157 143" stroke="#4397ac" stroke-width="31" stroke-linecap="round"/></g>`;}
function pin(x=380,y=380,c="#e68c69"){return `<path d="M${x} ${y+145}Q${x-115} ${y-3} ${x-77} ${y-69}A96 96 0 0 1 ${x+77} ${y-69}Q${x+118} ${y-3} ${x} ${y+145}Z" fill="${c}" stroke="#fff" stroke-width="10"/><circle cx="${x}" cy="${y-42}" r="33" fill="#fff"/>`;}
function calendar(selected=1){let cells="";for(let i=0;i<9;i++){let x=261+(i%3)*93,y=306+Math.floor(i/3)*83;cells+=`<rect x="${x}" y="${y}" width="74" height="63" rx="12" fill="${i===selected?"#e9aa72":"#edf5f8"}" stroke="${i===selected?"#cf8756":"#c5dce7"}" stroke-width="7"/>`;}return `<rect x="242" y="226" width="290" height="373" rx="28" fill="#fff" stroke="#67aac3" stroke-width="12"/><path d="M244 283H531" stroke="#68b5b8" stroke-width="37"/>${cells}`;}
function loop(x=380,y=400,s=1){return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-120 0A120 120 0 1 1 45 111" stroke="#60b5a3" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M52 85L56 137L105 118" fill="none" stroke="#60b5a3" stroke-width="20" stroke-linecap="round"/></g>`;}
function sun(x=370,y=345){return `<circle cx="${x}" cy="${y}" r="65" fill="#ffd18a" stroke="#e8ad57" stroke-width="7"/>${Array.from({length:8},(_,i)=>{let q=i*Math.PI/4;return line(Math.round(x+85*Math.cos(q)),Math.round(y+85*Math.sin(q)),Math.round(x+109*Math.cos(q)),Math.round(y+109*Math.sin(q)),"#eebf6b",9)}).join("")}`;}
function rain(){return `<path d="M221 271Q181 240 213 199Q230 175 269 179Q288 132 339 153Q369 164 386 192Q458 183 468 244Q471 279 427 287H235Z" fill="#afd1df" stroke="#74a7bf" stroke-width="9"/>${[260,325,395].map(x=>line(x,321,x-15,358,"#72add1",10)).join("")}`;}
function timeline(mode){let content=line(201,463,562,463,"#a4c4d0",16),n=mode==="past"?258:mode==="future"?525:mode==="end"?480:mode==="start"?275:380; content+=`<circle cx="${n}" cy="463" r="26" fill="#e9ad7b"/><circle cx="380" cy="463" r="12" fill="#4aaea6"/>`; if(mode==="past"||mode==="start")content+=arrow(n+30,463,556,463); if(mode==="future"||mode==="end")content+=arrow(207,463,n-33,463); if(mode==="range")content+=`<rect x="282" y="449" width="170" height="28" rx="10" fill="#85cabb"/>`;return content;}
function shapesThree(mode){let ss="";for(let i=0;i<3;i++){let x=268+i*115;ss+=`<circle cx="${x}" cy="410" r="42" fill="${mode==="select"&&i===1?"#f3bd83":"#b8d9e4"}" stroke="${mode==="select"&&i===1?"#e18b58":"#619db8"}" stroke-width="${mode==="select"&&i===1?12:7}"/>`;}return ss;}
function renderScene(k){
let s="";
switch(k){
case"undress":s=person(276,428,.76)+`<path d="M440 272L500 315L545 275L597 320L570 393L555 379V573H470V379L450 392Z" fill="#83c3b3" stroke="#347f80" stroke-width="11"/>`+arrow(355,404,464,409);break;
case"washdishes":s=`<path d="M235 310H375V350M375 350V385" stroke="#5d9cb5" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M370 393V446M352 426L340 445M390 426L405 445" stroke="#78bee2" stroke-width="12" stroke-linecap="round"/>`+`<ellipse cx="389" cy="505" rx="152" ry="59" fill="#a9dde5" stroke="#49899f" stroke-width="12"/><ellipse cx="389" cy="500" rx="88" ry="30" fill="#fff"/><path d="M215 552H567" stroke="#8bb1bd" stroke-width="18"/>`;break;
case"tidy":s=`<rect x="400" y="268" width="185" height="305" rx="12" fill="#d3e8df" stroke="#59999d" stroke-width="12"/><path d="M401 374H584M401 475H584" stroke="#59999d" stroke-width="12"/><rect x="427" y="305" width="54" height="60" rx="6" fill="#f3c18c"/><rect x="505" y="299" width="43" height="66" rx="8" fill="#91c9d7"/>`+`<rect x="174" y="445" width="118" height="87" rx="12" fill="#f1b790"/>`+arrow(297,437,406,373);break;
case"watchtv":s=`<rect x="358" y="244" width="261" height="202" rx="23" fill="#5b94af" stroke="#327a98" stroke-width="13"/><rect x="378" y="264" width="220" height="152" rx="8" fill="#c3e7f0"/>`+sun(486,341)+`<rect x="463" y="447" width="62" height="35" fill="#327a98"/>`+person(261,477,.74,"#69b4af");break;
case"returnhome":s=house(490,425,.78)+person(215,491,.58)+arrow(275,515,376,508);break;
case"pickup":s=`<rect x="205" y="455" width="335" height="110" rx="31" fill="#83bdd0" stroke="#417b9d" stroke-width="13"/><path d="M269 450L329 367H447L510 452" fill="#b9e4ee" stroke="#417b9d" stroke-width="11"/><circle cx="283" cy="575" r="34" fill="#4b667e"/><circle cx="477" cy="575" r="34" fill="#4b667e"/>`+person(580,405,.44,"#e5ab7b")+arrow(573,489,497,502);break;
case"prepare":s=`<rect x="203" y="421" width="363" height="171" rx="23" fill="#e9bb8f" stroke="#c89369" stroke-width="11"/><circle cx="300" cy="477" r="38" fill="#e6a271"/><circle cx="388" cy="488" r="35" fill="#83bf85"/><path d="M462 437L510 518" stroke="#477b9b" stroke-width="25" stroke-linecap="round"/><path d="M243 587H528" stroke="#c89369" stroke-width="9"/>`;break;
case"with":case"withwhom":s=person(291,410,.72)+person(481,410,.72,"#8abda0")+line(345,463,426,463,"#e8ae79",15);break;
case"without":s=person(324,419,.82)+`<circle cx="533" cy="412" r="85" fill="#e6f2f6" stroke="#abcbd9" stroke-dasharray="13 10" stroke-width="11"/>`+line(479,355,588,474,"#d57a82",15);break;
case"for":case"forwhom":s=gift(280,431,.78)+person(550,447,.68,"#8abda0")+arrow(380,471,457,472);break;
case"around":s=`<circle cx="384" cy="422" r="65" fill="#f1bc87" stroke="#d79b66" stroke-width="9"/><ellipse cx="384" cy="422" rx="195" ry="96" transform="rotate(-23 384 422)" stroke="#529bbb" stroke-width="18" stroke-dasharray="22 9" fill="none"/><circle cx="226" cy="501" r="27" fill="#86c7af"/>`;break;
case"toward":case"whereto":s=house(506,445,.77)+arrow(180,474,341,474)+pin(493,319);break;
case"from":case"wherefrom":s=house(261,445,.72)+arrow(365,476,582,476)+pin(261,309);break;
case"near":s=house(317,425,.83)+person(542,437,.64);break;
case"since":case"sincewhen":s=timeline("past")+calendar(3);break;
case"starting":s=timeline("start")+`<path d="M273 371V430" stroke="#e7a974" stroke-width="14"/><circle cx="272" cy="351" r="28" fill="#e7a974"/>`;break;
case"until":case"untilwhen":s=timeline("end")+clock(389,330,76);break;
case"during":s=clock(380,389,152)+person(393,468,.59,"#f1b284");break;
case"because":case"why":s=rain()+arrow(424,374,515,457)+`<path d="M518 451Q573 380 617 453Z" fill="#f1be8b" stroke="#ce906d" stroke-width="10"/><path d="M560 453V557" stroke="#a16d50" stroke-width="12"/>`;break;
case"despite":s=rain()+person(482,462,.54,"#91c8a5")+arrow(337,583,568,583);break;
case"who":s=person(292,430,.82)+person(489,430,.72,"#cbdde2")+`<circle cx="292" cy="338" r="89" fill="none" stroke="#edae74" stroke-width="17"/>`;break;
case"what":s=`<path d="M306 331L418 283L499 354V507L400 556L306 507Z" fill="#b8d9e4" stroke="#598fae" stroke-width="14"/>`+magnify(377,391,.57);break;
case"where":s=house(410,430,.9)+pin(385,253);break;
case"how":s=`<circle cx="217" cy="519" r="36" fill="#eeae7c"/><circle cx="368" cy="434" r="36" fill="#90c6d5"/><circle cx="529" cy="344" r="36" fill="#69bba7"/>`+arrow(258,502,493,362);break;
case"when":s=clock()+`<circle cx="554" cy="268" r="31" fill="#f2b787"/>`;break;
case"which":s=shapesThree("select")+magnify(436,457,.36);break;
case"howmuch":s=`<ellipse cx="319" cy="516" rx="75" ry="25" fill="#e7be7c" stroke="#c39856" stroke-width="8"/><path d="M244 482Q319 456 394 482V516Q319 543 244 516Z" fill="#f2d18f" stroke="#c39856" stroke-width="8"/><ellipse cx="319" cy="481" rx="75" ry="25" fill="#f6dc9e"/>`+magnify(485,387,.67);break;
case"howmany":s=shapesThree("normal")+magnify(421,453,.51);break;
case"howlong":s=clock(257,369,69)+clock(511,369,69)+arrow(334,371,430,371)+timeline("range");break;
case"howoften":s=clock(283,400,62)+clock(485,400,62)+loop(390,423,.6);break;
case"whose":s=person(261,402,.7)+gift(516,442,.67)+line(340,484,421,484,"#e7aa77",13);break;
case"whatfor":s=`<circle cx="301" cy="402" r="84" stroke="#5f9fb5" stroke-width="17" fill="#cfeaf2"/><circle cx="301" cy="402" r="28" fill="#fff"/>`+arrow(387,402,502,402)+`<rect x="512" y="342" width="89" height="125" rx="12" fill="#a2d6b7" stroke="#59a27e" stroke-width="10"/>`;break;
case"today":case"yesterday":case"tomorrow":s=calendar(k==="yesterday"?3:k==="tomorrow"?5:4);break;
case"now":s=clock(384,408,147)+`<circle cx="488" cy="316" r="22" fill="#f0a970"/>`;break;
case"immediately":s=clock(301,414,111)+`<path d="M503 250L438 408H509L466 575L593 383H518Z" fill="#f3bb71" stroke="#d99c5f" stroke-width="10" stroke-linejoin="round"/>`;break;
case"later":s=clock(283,417,93)+arrow(397,413,581,413);break;
case"earlier":s=clock(493,417,93)+arrow(370,413,197,413);break;
case"often":case"always":case"sometimes":case"rarely":case"never":s=Array.from({length:5},(_,i)=>`<circle cx="${228+i*80}" cy="424" r="27" fill="${k==="always"||k==="often"&&i<4||k==="sometimes"&&i%2===0||k==="rarely"&&i===2?"#67bba5":"#dcebf1"}" stroke="#7faebd" stroke-width="7"/>`).join("")+(k==="never"?line(208,340,560,507,"#d77c80",22):"");break;
case"already":s=clock(383,388,124)+`<path d="M331 526L376 565L467 469" stroke="#4caf91" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;break;
case"still":s=clock(379,389,125)+`<path d="M463 508L517 508M512 482L541 506L510 534" stroke="#eeb078" stroke-width="13" fill="none" stroke-linecap="round"/>`;break;
case"again":s=loop(384,411,1.25);break;
case"here":case"there":s=pin(k==="here"?383:524,388)+`<circle cx="286" cy="489" r="18" fill="#6398ae"/>`+(k==="there"?arrow(303,478,447,414):"");break;
case"outside":s=house(295,411,.73)+person(540,454,.58,"#8ac8a8");break;
case"tell":s=person(270,421,.68)+person(523,421,.68,"#8cbca4")+`<path d="M326 271Q385 229 444 271L462 334L418 326Q366 348 326 315Z" fill="#c7e9ee" stroke="#579bac" stroke-width="10"/>`;break;
case"find":s=magnify(328,370,.74)+`<circle cx="446" cy="416" r="36" fill="#edbe87"/><path d="M470 420L548 500" stroke="#d69c64" stroke-width="19"/>`+`<path d="M489 482L507 463" stroke="#d69c64" stroke-width="13"/>`;break;
case"search":s=`<circle cx="325" cy="400" r="30" fill="#b8dfe6"/><circle cx="459" cy="388" r="36" fill="#e9b687"/>`+magnify(375,417,1);break;
case"bring":s=person(278,420,.74)+gift(352,482,.43)+house(565,426,.66)+arrow(400,491,460,491);break;
case"begin":s=`<path d="M258 294V569" stroke="#5099aa" stroke-width="16"/><path d="M268 292H483L431 366L483 436H268Z" fill="#79c3a7" stroke="#499b86" stroke-width="11"/>`+arrow(285,564,561,564);break;
case"stop":s=`<path d="M330 250H438L522 334V444L438 528H330L247 444V334Z" fill="#e98990" stroke="#c4606b" stroke-width="15"/>`+`<path d="M347 323V455M418 323V455" stroke="#fff" stroke-width="30" stroke-linecap="round"/>`;break;
case"submit":s=doc(302,350,.72)+`<rect x="449" y="442" width="172" height="108" rx="16" fill="#91cdb8" stroke="#4c9a83" stroke-width="12"/>`+arrow(379,421,502,465);break;
case"lose":s=person(297,422,.78)+`<circle cx="494" cy="518" r="37" fill="#edbd86"/><path d="M526 532L575 570M539 570L552 552" stroke="#c18c55" stroke-width="15" stroke-linecap="round"/>`+arrow(402,471,480,529);break;
default:throw Error("No scene renderer "+k);
}
return panel(s);
}
const catalog={"everyday-50":"undress","everyday-53":"washdishes","everyday-54":"tidy","everyday-66":"watchtv","everyday-72":"returnhome","everyday-74":"pickup","everyday-75":"prepare","questions-87":"why","questions-88":"why","questions-89":"why","questions-90":"which","questions-91":"which","questions-92":"which","questions-95":"howlong","questions-96":"howoften","questions-97":"sincewhen","questions-98":"untilwhen","questions-100":"forwhom","questions-101":"whose","questions-102":"whatfor"};
const source=await readFile(new URL("../src/data.ts",import.meta.url),"utf8");
const s=source.indexOf("=[",source.indexOf("export const DEMO_WORDS"))+1,e=source.indexOf("];",s),words=JSON.parse(source.slice(s,e+1));
const dir=new URL("../public/photos/learning/",import.meta.url);await mkdir(dir,{recursive:true});
const approvedPhotoIds=new Set(["everyday-50","everyday-53","everyday-54","everyday-66","everyday-72","everyday-74"]);
for(const [id,scene] of Object.entries(catalog)){
 const w=words.find(x=>x.id===id);
 if(!w)throw Error("Missing catalog word "+id);
 if(id==="everyday-75"){if(w.photo!=="https://images.pexels.com/photos/5779378/pexels-photo-5779378.jpeg?auto=compress&w=960"&&w.photo!=="/photos/cc56fccd7f81c30af2.jpg")throw Error("Approved prepare-action photo mismatch "+id);continue;}
 if(approvedPhotoIds.has(id)){
  if(w.photo!=="/photos/approved/"+id+".webp")throw Error("Approved photo source mismatch "+id);
  continue;
 }
 if(w.photo!=="/photos/learning/"+id+".svg")throw Error("Source mismatch "+id);
 const img=renderScene(scene);
 if(!img.startsWith("<svg ")||!img.endsWith("</svg>")||img.includes("NaN")||img.includes("undefined"))throw Error("Invalid SVG "+id);
 await writeFile(new URL(id+".svg",dir),img);
}
console.log("Batch 2: rendered "+Object.keys(catalog).length+" deterministic learning SVG scenes.");
