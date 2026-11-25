import {readFileSync} from "node:fs";
const s=readFileSync(new URL("../src/data.ts",import.meta.url),"utf8");
const m=s.match(/export const DEMO_WORDS:Word\[]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
if(!m)throw Error("Words unavailable");
const words=JSON.parse(m[1]);
const legacy=words.filter(w=>w.id.startsWith("food-")),ids=new Set(legacy.map(w=>w.id));
if(legacy.length!==60||ids.size!==60)throw Error("Missing legacy food words");
for(let i=277;i<=336;i++)if(!ids.has("food-"+i))throw Error("Lost food-"+i);
for(const id of ["food-289","food-291","food-292"])if(words.find(w=>w.id===id)?.topic!=="vegetables")throw Error(id+" must be vegetables");
for(const id of ["food-277","food-278","food-319"])if(words.find(w=>w.id===id)?.topic!=="fruits")throw Error(id+" must be fruits");
for(const id of ["food-301","food-302","food-303"])if(words.find(w=>w.id===id)?.topic!=="calendar")throw Error(id+" must be daily routine");
for(const id of ["food-332","food-333"])if(words.find(w=>w.id===id)?.topic!=="dining")throw Error(id+" must be dining");
if(words.find(w=>w.id==="food-300")?.topic!=="dishes")throw Error("Hähnchen photo sense is cooked dish");
// Keep beginner cards useful and prevent low-value micro-ingredients from returning.
for(const id of ["ww-new-218","ww-new-219"])if(words.some(w=>w.id===id))throw Error("Obsolete egg-part card restored: "+id);
for(const [id,name,meaning]of [["food-297","Pasta","макарони, паста"],["food-324","Bohne","квасоля"],["ww-new-223","Linse","сочевиця"],["ww-new-224","Kichererbse","нут"]]){
 const w=words.find(x=>x.id===id);if(!w||w.de!==name||w.uk!==meaning)throw Error("Beginner-friendly label changed: "+id);
}
if(words.filter(w=>["staples","vegetables","fruits","drinks","dishes","dining"].includes(w.topic)).length!==115)throw Error("Unexpected food card count");
console.log("Food taxonomy passed: 60 original IDs preserved, products / vegetables / fruits / dining separated.");
