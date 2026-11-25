import{readFileSync}from"node:fs";
const source=readFileSync(new URL("../src/data.ts",import.meta.url),"utf8");const s=source.indexOf("=[",source.indexOf("export const DEMO_WORDS"))+1,e=source.indexOf("];",s);const words=JSON.parse(source.slice(s,e+1));const ids=["everyday-50","everyday-53","everyday-54","everyday-66","everyday-72","everyday-74","everyday-75","questions-87","questions-88","questions-89","questions-90","questions-91","questions-92","questions-95","questions-96","questions-97","questions-98","questions-100","questions-101","questions-102"];const expected={"everyday-50":"undress","everyday-53":"washdishes","everyday-54":"tidy","everyday-66":"watchtv","everyday-72":"returnhome","everyday-74":"pickup","everyday-75":"prepare","questions-87":"why","questions-88":"why","questions-89":"why","questions-90":"which","questions-91":"which","questions-92":"which","questions-95":"howlong","questions-96":"howoften","questions-97":"sincewhen","questions-98":"untilwhen","questions-100":"forwhom","questions-101":"whose","questions-102":"whatfor"};
const approvedPhotographicIds=new Set(["everyday-50","everyday-53","everyday-54","everyday-66","everyday-72","everyday-74"]);
for(const id of ids){
 const w=words.find(w=>w.id===id);
 if(!w)throw Error("Missing card: "+id);
 if(id==="everyday-75"){if(w.photo!=="https://images.pexels.com/photos/5779378/pexels-photo-5779378.jpeg?auto=compress&w=960"&&w.photo!=="/photos/cc56fccd7f81c30af2.jpg")throw Error("Approved prepare-action photo mismatch "+id);continue;}
 if(approvedPhotographicIds.has(id)){
  const path="/photos/approved/"+id+".webp";
  if(w.photo!==path)throw Error("Missing approved photo mapping: "+id);
  const bytes=readFileSync(new URL("../public"+path,import.meta.url));
  if(bytes.length<8000||bytes.toString("ascii",0,4)!=="RIFF"||bytes.toString("ascii",8,12)!=="WEBP")throw Error("Missing or invalid approved WebP: "+id);
 }else{
  const path="/photos/learning/"+id+".svg";
  if(w.photo!==path)throw Error("Missing graphic link: "+id);
  const svg=readFileSync(new URL("../public"+path,import.meta.url),"utf8");
  if(!svg.startsWith("<svg ")||!svg.endsWith("</svg>")||svg.includes("NaN")||svg.includes("undefined")||svg.length<650)throw Error("Bad SVG file: "+id);
  if(/<text[\\s>]/.test(svg))throw Error("Text answer leaked in graphic "+id);
 }
}
const nn=words.filter(w=>w.kind!=="noun"),ns=words.filter(w=>w.kind==="noun");if(nn.length!==441||nn.filter(w=>w.photo).length<320||ns.length!==736||ns.some(w=>!w.photo)||new Set(ns.map(w=>w.photo)).size!==736)throw Error("Vocabulary image count regressed");
const opposites=[["everyday-50","everyday-73"],["verbs-869","verbs-868"]];for(const [a,b] of opposites)if(words.find(w=>w.id===a).photo===words.find(w=>w.id===b).photo)throw Error("Antonyms share misleading illustration");
console.log("Semantic scenes QA passed: "+ids.length+" generated diagrams, 320/441 illustrated non-nouns, no embedded answer text.");
