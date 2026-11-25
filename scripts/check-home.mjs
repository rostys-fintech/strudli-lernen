import {readFileSync} from "node:fs";
const s=readFileSync(new URL("../src/data.ts",import.meta.url),"utf8");
const m=s.match(/export const DEMO_WORDS:Word\[]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
if(!m)throw Error("Words unavailable");
const all=JSON.parse(m[1]),legacy=all.filter(w=>w.id.startsWith("home-"));
if(legacy.length!==51||new Set(legacy.map(w=>w.id)).size!==51)throw Error("Lost original home entries");
for(let i=337;i<=387;i++)if(!legacy.some(x=>x.id==="home-"+i))throw Error("Missing home-"+i);
for(const [id,topic]of [["home-337","rooms"],["home-349","rooms"],["home-353","furniture"],["home-364","housework"],["home-373","bathroom"],["home-377","kitchenware"]])if(all.find(w=>w.id===id)?.topic!==topic)throw Error("Wrong home topic "+id);
console.log("Home taxonomy passed: 51 original IDs preserved across precise home themes.");
