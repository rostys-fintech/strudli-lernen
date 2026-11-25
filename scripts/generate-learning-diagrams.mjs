import {mkdir,writeFile} from "node:fs/promises";
function baseSvg(body){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 768" role="img"><defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#eaf5fc"/><stop offset="1" stop-color="#e2f7f1"/></linearGradient><filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-opacity=".14"/></filter><marker id="arrow" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto"><path d="M1 1L10 6L1 11Z" fill="#176e9c"/></marker></defs><rect width="768" height="768" fill="url(#bg)"/><rect x="88" y="80" width="592" height="608" rx="45" fill="#fff" filter="url(#shadow)"/><circle cx="139" cy="139" r="15" fill="#c4e5f5"/><circle cx="177" cy="139" r="15" fill="#d2eee2"/>${body}</svg>`;}
function circle(x,y,r=45,fill="#ed8d5a"){return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="#fff" stroke-width="8" filter="url(#shadow)"/>`;}
function block(x=290,y=360,w=188,h=165){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="17" fill="#8bbfe3" stroke="#286d97" stroke-width="9"/>`;}
function arrow(x1,y1,x2,y2){return `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="#176e9c" stroke-width="14" stroke-linecap="round" marker-end="url(#arrow)"/>`;}
function prepositionGraphic(k){
 let b=block(),d=circle(385,443),s="";
 switch(k){
 case"in":s=b+d;break;
 case"an":s=b+circle(535,443);break;
 case"auf":s=b+circle(384,315);break;
 case"unter":s=block(290,245,188,165)+circle(384,475);break;
 case"über":s=b+circle(384,245);break;
 case"neben":s=block(230,358,183,166)+circle(513,441);break;
 case"vor":s=b+circle(440,472,64);break;
 case"hinter":s=circle(425,425,64)+b;break;
 case"zwischen":s=block(170,365,154,165)+block(474,365,154,165)+circle(400,444,47);break;
 case"gegen":s=block(480,321,88,225)+circle(262,432)+arrow(319,432,434,432);break;
 case"durch":s=`<rect x="265" y="300" width="235" height="255" rx="65" fill="#d5ebf4" stroke="#27698c" stroke-width="17"/><path d="M320 550V375Q382 290 445 375V550" fill="none" stroke="#fff" stroke-width="16"/>`+arrow(230,442,535,442);break;
 case"aus":s=b+circle(384,446,46)+arrow(411,432,590,302);break;
 case"zu":s=`<path d="M425 315L540 405V562H311V405Z" fill="#bee7dd" stroke="#277f83" stroke-width="10"/><rect x="401" y="444" width="60" height="118" rx="5" fill="#f4bd79"/>`+circle(204,472,39)+arrow(245,473,346,473);break;
 case"gegenüber":s=block(161,335,148,210)+block(468,335,148,210)+`<path d="M326 442H449M444 433L455 442L444 451M332 433L321 442L332 451" stroke="#176e9c" fill="none" stroke-width="12" stroke-linecap="round"/>`;break;
 case"entlang":s=`<path d="M192 510C275 475 286 335 389 345C476 355 459 510 579 480" stroke="#cce5ed" stroke-width="79" stroke-linecap="round" fill="none"/><path d="M192 510C275 475 286 335 389 345C476 355 459 510 579 480" stroke="#447d99" stroke-width="4" stroke-dasharray="24 20" fill="none"/>`+arrow(390,346,510,419);break;
 default:throw Error("Unsupported preposition "+k);
 }
 return baseSvg(s);
}
function numberGraphic(k){
 const keys=["null","eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn","zwanzig","dreißig","vierzig","fünfzig","hundert","tausend"];
 const values=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,30,40,50,100,1000],v=values[keys.indexOf(k)];
 if(v===undefined)throw Error("Bad number "+k);
 const fs=v>=100?150:207;
 let dots="";
 const count=v<=20?v:v<=50?v/10:v===100?10:20;
 for(let i=0;i<count;i++){let cols=5;let cx=290+(i%cols)*47,cy=490+Math.floor(i/cols)*42;dots+=`<circle cx="${cx}" cy="${cy}" r="12" fill="${i%2?"#54bdba":"#58a3d3"}"/>`;}
 return baseSvg(`<text x="384" y="420" font-family="system-ui,sans-serif" text-anchor="middle" font-size="${fs}" font-weight="850" fill="#195c86">${v}</text>${dots}`);
}
function face(mood){const eyes=`<circle cx="327" cy="367" r="15" fill="#245773"/><circle cx="444" cy="367" r="15" fill="#245773"/>`;const mouth=mood==="happy"?`<path d="M326 448Q385 516 444 448" />`:mood==="sad"?`<path d="M326 500Q385 427 444 500" />`:`<path d="M334 462Q385 458 436 462"/>`;return `<circle cx="385" cy="418" r="158" fill="#ffd79a" stroke="#e9b479" stroke-width="9"/>${eyes}<g fill="none" stroke="#895f49" stroke-width="14" stroke-linecap="round">${mouth}</g>`;}
function doorGraphic(open){return `<path d="M268 265H496V575H268Z" fill="#e2f0f4" stroke="#4984a3" stroke-width="17"/>${open?`<path d="M302 286L455 246V573L302 556Z" fill="#8dc9ba" stroke="#2c8b84" stroke-width="11"/><circle cx="432" cy="413" r="13" fill="#fff"/>`:`<rect x="282" y="283" width="201" height="277" fill="#8dc9ba" stroke="#2c8b84" stroke-width="8"/><circle cx="453" cy="422" r="12" fill="#fff"/>`}`;}
function traitGraphic(k){
 const check=`<path d="M272 416L352 495L512 302" fill="none" stroke="#0e9f88" stroke-linecap="round" stroke-linejoin="round" stroke-width="40"/>`;
 const cross=`<path d="M290 316L481 508M481 316L290 508" stroke="#dd6982" stroke-width="39" stroke-linecap="round"/>`;
 let s="";
 switch(k){
 case"groß":case"klein":s=`<rect x="235" y="260" width="164" height="320" rx="20" fill="${k==="groß"?"#36a4bd":"#c8d7df"}"/><rect x="439" y="420" width="112" height="160" rx="15" fill="${k==="klein"?"#36a4bd":"#c8d7df"}"/><path d="M184 584H598" stroke="#3a6c84" stroke-width="12"/>`;break;
 case"neu":s=`<rect x="273" y="355" width="230" height="197" rx="20" fill="#7bc7e7" stroke="#357ea0" stroke-width="12"/><path d="M389 354V555M275 420H500" stroke="#fff" stroke-width="24"/><path d="M226 286L241 253L256 286L289 302L256 318L241 350L226 318L193 302Z" fill="#f5bd5f"/><circle cx="527" cy="300" r="19" fill="#f5bd5f"/>`;break;
 case"leicht":s=`<ellipse cx="388" cy="338" rx="100" ry="127" fill="#f194ad" stroke="#d05b7f" stroke-width="10"/><path d="M383 467C433 516 340 532 384 605" fill="none" stroke="#aa7887" stroke-width="9"/><path d="M385 470L372 492H400Z" fill="#e27f9f"/>`;break;
 case"schwer":s=`<path d="M334 337V301Q334 248 385 248Q436 248 436 301V337" fill="none" stroke="#447b9a" stroke-width="28"/><rect x="249" y="340" width="272" height="240" rx="62" fill="#4a748c"/><circle cx="385" cy="445" r="61" fill="#6aa5b5"/>`;break;
 case"langsam":s=`<ellipse cx="379" cy="488" rx="147" ry="91" fill="#86bfa6" stroke="#408872" stroke-width="10"/><path d="M277 469Q385 265 497 469" fill="#bad4a4" stroke="#438d75" stroke-width="11"/><circle cx="561" cy="470" r="45" fill="#95ceae"/><circle cx="580" cy="452" r="7" fill="#2d655c"/><path d="M260 560H528" stroke="#4a918d" stroke-width="9" stroke-linecap="round"/>`;break;
 case"teuer":case"kostenlos":s=`<path d="M254 306H474L553 395L468 506H254Z" fill="#ffd99e" stroke="#d19c5c" stroke-width="13"/><circle cx="284" cy="360" r="19" fill="#fff"/><text x="397" y="440" font-family="sans-serif" font-size="105" text-anchor="middle" fill="#895627">€${k==="teuer"?"€":""}</text>${k==="kostenlos"?`<path d="M252 544L553 271" stroke="#e26976" stroke-width="25" stroke-linecap="round"/>`:""}`;break;
 case"reich":s=`<rect x="262" y="445" width="275" height="90" rx="13" fill="#85c3b0" stroke="#348b77" stroke-width="10"/><rect x="248" y="385" width="275" height="90" rx="13" fill="#91d5bb" stroke="#348b77" stroke-width="10"/><rect x="261" y="326" width="275" height="90" rx="13" fill="#a1dfc7" stroke="#348b77" stroke-width="10"/><circle cx="397" cy="371" r="31" fill="#e5f3d7"/>`;break;
 case"offen":case"geschlossen":s=doorGraphic(k==="offen");break;
 case"frei":case"besetzt":s=`<rect x="292" y="370" width="190" height="126" rx="21" fill="#6daecd"/><rect x="300" y="491" width="171" height="47" rx="8" fill="#377b9b"/><path d="M333 532V580M438 532V580" stroke="#377b9b" stroke-width="16"/>${k==="besetzt"?`<circle cx="388" cy="330" r="48" fill="#f0b88f"/><path d="M336 378Q385 360 438 378V475H336Z" fill="#f0a473"/>`:check}`;break;
 case"traurig":case"unfreundlich":case"unzufrieden":s=face("sad");break;
 case"freundlich":case"nett":case"zufrieden":s=face("happy");break;
 case"wichtig":s=`<circle cx="385" cy="418" r="172" fill="#fff0d8" stroke="#ffc165" stroke-width="22"/><path d="M384 301V447" stroke="#dc8f30" stroke-linecap="round" stroke-width="40"/><circle cx="384" cy="517" r="22" fill="#dc8f30"/>`;break;
 case"richtig":case"möglich":s=check;break;
 case"falsch":s=cross;break;
 case"einfach":s=`<path d="M231 496L538 336" stroke="#299e8c" stroke-width="24" stroke-linecap="round" marker-end="url(#arrow)"/><circle cx="222" cy="505" r="28" fill="#efae7e"/><circle cx="550" cy="323" r="28" fill="#74cbb4"/>`;break;
 case"kompliziert":case"schwierig":s=`<path d="M230 496C170 315 381 305 390 473C407 605 613 498 553 343C510 248 268 249 284 401" fill="none" stroke="#638dae" stroke-width="30" stroke-linecap="round"/><circle cx="230" cy="496" r="26" fill="#efae7e"/><circle cx="284" cy="401" r="26" fill="#78c5ad"/>`;break;
 case"fertig":s=`<rect x="280" y="268" width="227" height="319" rx="22" fill="#e9f5fa" stroke="#68a5c4" stroke-width="12"/><path d="M315 352L335 371L375 327M315 439L335 458L375 414M315 521L335 540L375 496" fill="none" stroke="#1b9b84" stroke-width="12"/><path d="M391 351H469M391 438H469M391 520H469" stroke="#8aabbc" stroke-width="12"/>`;break;
 case"kaputt":s=`<rect x="303" y="247" width="162" height="365" rx="26" fill="#5287a0" stroke="#235a7a" stroke-width="12"/><rect x="322" y="286" width="124" height="265" rx="9" fill="#d5f0f7"/><path d="M370 310L416 388L360 431L396 521L342 550" fill="none" stroke="#e28486" stroke-width="14"/>`;break;
 case"kurz":case"lang":{const longAccent=k==="lang"?"#149f91":"#aabfc8",shortAccent=k==="kurz"?"#149f91":"#aabfc8";s=`<rect x="154" y="270" width="453" height="76" rx="29" fill="#f0f6f8"/><rect x="154" y="464" width="248" height="76" rx="29" fill="#f0f6f8"/><g filter="url(#shadow)"><rect x="182" y="283" width="332" height="50" rx="7" fill="${longAccent}"/><rect x="168" y="283" width="29" height="50" rx="7" fill="#f1c5bb"/><path d="M514 283L582 308L514 333Z" fill="#e9cba9"/><path d="M570 304L582 308L570 312Z" fill="#445f68"/><path d="M207 292H499" stroke="#fff" stroke-opacity=".45" stroke-width="7" stroke-linecap="round"/><rect x="182" y="477" width="127" height="50" rx="7" fill="${shortAccent}"/><rect x="168" y="477" width="29" height="50" rx="7" fill="#f1c5bb"/><path d="M309 477L377 502L309 527Z" fill="#e9cba9"/><path d="M365 498L377 502L365 506Z" fill="#445f68"/><path d="M207 486H295" stroke="#fff" stroke-opacity=".45" stroke-width="7" stroke-linecap="round"/></g><path d="M174 370H582M174 564H377" stroke="#d7e4e9" stroke-width="4" stroke-dasharray="8 12"/>`;break;}
 case"eng":s=`<rect x="200" y="252" width="167" height="370" rx="15" fill="#72abc7"/><rect x="415" y="252" width="167" height="370" rx="15" fill="#72abc7"/><path d="M390 357V515" stroke="#f1af6b" stroke-width="13" stroke-linecap="round"/>`;break;
 case"trocken":s=`<path d="M195 496Q310 452 400 491Q494 453 583 500V559H195Z" fill="#d8b889"/><path d="M269 495L312 538L283 559M381 483L402 532L361 557M483 492L467 531L503 560" fill="none" stroke="#9c7756" stroke-width="13"/>`;break;
 case"hart":s=`<path d="M261 488L328 336L475 325L542 448L480 556H300Z" fill="#9fb9c5" stroke="#507e93" stroke-width="13"/><path d="M328 336L373 469L300 556M373 469L542 448" fill="none" stroke="#e7f4f9" stroke-width="9"/>`;break;
 case"bereit":s=`<rect x="296" y="322" width="173" height="260" rx="36" fill="#71b1c8" stroke="#397b93" stroke-width="10"/><path d="M341 322V292Q383 258 424 292V322" fill="none" stroke="#397b93" stroke-width="13"/><rect x="326" y="431" width="116" height="100" rx="23" fill="#b9e5ec"/>${check}`;break;
 default:throw Error("Unsupported trait "+k);
 }
 return baseSvg(s);
}
function actionGraphic(k){
 let s="";
 switch(k){
 case"öffnen":s=doorGraphic(true);break;
 case"schließen":s=doorGraphic(false);break;
 case"einschalten":case"ausschalten":s=`<path d="M385 243V290" stroke="#4c819f" stroke-width="18"/><path d="M315 385Q315 292 385 292Q455 292 455 385Q455 429 422 460V497H347V460Q315 429 315 385Z" fill="${k==="einschalten"?"#ffe6a1":"#c8dae2"}" stroke="#60899f" stroke-width="12"/><rect x="352" y="497" width="66" height="48" rx="11" fill="#60899f"/><rect x="280" y="579" width="210" height="32" rx="13" fill="#bed5e0"/>${k==="einschalten"?`<path d="M385 229V194M475 292L507 259M290 292L257 259M489 383H530M280 383H238" stroke="#e4a63d" stroke-width="13" stroke-linecap="round"/>`:""}`;break;
 case"einsteigen":case"aussteigen":s=`<rect x="213" y="315" width="355" height="230" rx="40" fill="#73b5d3" stroke="#2d7697" stroke-width="13"/><rect x="298" y="338" width="141" height="180" rx="9" fill="#ecf5f8"/><circle cx="279" cy="555" r="31" fill="#3b6075"/><circle cx="509" cy="555" r="31" fill="#3b6075"/>${k==="einsteigen"?`${circle(168,480,28,"#e5a77a")}${arrow(205,480,309,480)}`:`${circle(615,480,28,"#e5a77a")}${arrow(451,480,558,480)}`}`;break;
 case"geben":case"bekommen":s=`<circle cx="238" cy="338" r="47" fill="#f0bd95"/><path d="M179 540V415Q233 364 292 415V540Z" fill="#74b4d2"/><circle cx="540" cy="338" r="47" fill="#f0bd95"/><path d="M478 540V415Q540 364 598 415V540Z" fill="#84c7ac"/><rect x="349" y="393" width="80" height="83" rx="10" fill="#ffca8d" stroke="#cb965d" stroke-width="8"/><path d="M387 393V478M350 426H429" stroke="#fff" stroke-width="12"/>${k==="geben"?arrow(316,557,460,557):arrow(461,557,321,557)}`;break;
 case"stehen":s=`<circle cx="385" cy="305" r="66" fill="#efb48c"/><path d="M328 389Q385 357 442 389L439 498H332Z" fill="#65b2c8"/><path d="M335 486L318 599M432 486L451 599" stroke="#286b8b" stroke-width="26" stroke-linecap="round"/><path d="M335 397L269 484M434 397L510 484" stroke="#efb48c" stroke-width="22" stroke-linecap="round"/><path d="M220 619H560" stroke="#c3d7df" stroke-width="11"/>`;break;
 default:throw Error("Unsupported action "+k);
 }
 return baseSvg(s);
}
function directionGraphic(k){if(k==="geradeaus")return baseSvg(`<path d="M385 566V285" fill="none" stroke="#2590aa" stroke-width="42" stroke-linecap="round" marker-end="url(#arrow)"/><circle cx="385" cy="588" r="29" fill="#f0bb80"/>`);return baseSvg(`<path d="M${k==="links"?"532":"237"} 430H${k==="links"?"237":"532"}" fill="none" stroke="#2590aa" stroke-width="42" stroke-linecap="round" marker-end="url(#arrow)"/><circle cx="385" cy="530" r="31" fill="#f0bb80"/>`);}
const catalog=[{"id":"ww-new-001","type":"number"},{"id":"ww-new-002","type":"number"},{"id":"ww-new-003","type":"number"},{"id":"ww-new-004","type":"number"},{"id":"ww-new-005","type":"number"},{"id":"ww-new-006","type":"number"},{"id":"ww-new-007","type":"number"},{"id":"ww-new-008","type":"number"},{"id":"ww-new-009","type":"number"},{"id":"ww-new-010","type":"number"},{"id":"ww-new-011","type":"number"},{"id":"ww-new-012","type":"number"},{"id":"ww-new-013","type":"number"},{"id":"ww-new-014","type":"number"},{"id":"ww-new-015","type":"number"},{"id":"ww-new-016","type":"number"},{"id":"ww-new-017","type":"number"},{"id":"ww-new-018","type":"number"},{"id":"ww-new-019","type":"number"},{"id":"ww-new-020","type":"number"},{"id":"ww-new-021","type":"number"},{"id":"ww-new-022","type":"number"},{"id":"ww-new-023","type":"number"},{"id":"ww-new-024","type":"number"},{"id":"ww-new-025","type":"number"},{"id":"ww-new-026","type":"number"},{"id":"adjs-916","type":"trait"},{"id":"everyday-77","type":"action"},{"id":"everyday-78","type":"action"},{"id":"ww-new-155","type":"action"},{"id":"ww-new-156","type":"action"}];
const source=await (await import("node:fs/promises")).readFile(new URL("../src/data.ts",import.meta.url),"utf8");
const start=source.indexOf("=[",source.indexOf("export const DEMO_WORDS"))+1;
const end=source.indexOf("];",start);const words=JSON.parse(source.slice(start,end+1));
const out=new URL("../public/photos/learning/",import.meta.url);await mkdir(out,{recursive:true});
for(const record of catalog){const word=words.find(w=>w.id===record.id);if(!word)throw Error("Unknown media card "+record.id);const draw=record.type==="number"?numberGraphic:record.type==="preposition"?prepositionGraphic:record.type==="trait"?traitGraphic:record.type==="action"?actionGraphic:directionGraphic;const art=draw(word.de);if(!art.startsWith("<svg ")||!art.endsWith("</svg>"))throw Error("Malformed SVG "+word.id);await writeFile(new URL(record.id+".svg",out),art);}
console.log("Generated "+catalog.length+" crisp semantic visual diagrams, each keyed to a stable WortWelt card ID.");
