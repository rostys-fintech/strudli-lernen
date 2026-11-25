/** Calendar quality gate: protect other approved images, reject schema/low-resolution calendar assets. */
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
const catalog=readFileSync(new URL("../src/data.ts",import.meta.url),"utf8");
const match=catalog.match(/export const DEMO_WORDS:Word\[\]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
if(!match)throw Error("Calendar QA cannot read dictionary");
const byId=new Map(JSON.parse(match[1]).map(w=>[w.id,w]));
const expected=[
  {
    "id": "time-774",
    "de": "Montag",
    "src": "/photos/calendar-approved-20261122/time-774.jpg"
  },
  {
    "id": "time-775",
    "de": "Dienstag",
    "src": "/photos/calendar-approved-20261122/time-775.jpg"
  },
  {
    "id": "time-776",
    "de": "Mittwoch",
    "src": "/photos/calendar-approved-20261122/time-776.jpg"
  },
  {
    "id": "time-777",
    "de": "Donnerstag",
    "src": "/photos/calendar-approved-20261122/time-777.jpg"
  },
  {
    "id": "time-778",
    "de": "Freitag",
    "src": "/photos/calendar-approved-20261122/time-778.jpg"
  },
  {
    "id": "time-779",
    "de": "Samstag",
    "src": "/photos/calendar-approved-20261122/time-779.jpg"
  },
  {
    "id": "time-780",
    "de": "Sonntag",
    "src": "/photos/calendar-approved-20261122/time-780.jpg"
  },
  {
    "id": "time-781",
    "de": "Januar",
    "src": "/photos/calendar-approved-20261122/time-781.jpg"
  },
  {
    "id": "time-782",
    "de": "Februar",
    "src": "/photos/calendar-approved-20261122/time-782.jpg"
  },
  {
    "id": "time-783",
    "de": "März",
    "src": "/photos/calendar-approved-20261122/time-783.jpg"
  },
  {
    "id": "time-784",
    "de": "April",
    "src": "/photos/calendar-approved-20261122/time-784.jpg"
  },
  {
    "id": "time-785",
    "de": "Mai",
    "src": "/photos/calendar-approved-20261122/time-785.jpg"
  },
  {
    "id": "time-786",
    "de": "Juni",
    "src": "/photos/calendar-approved-20261122/time-786.jpg"
  },
  {
    "id": "time-787",
    "de": "Juli",
    "src": "/photos/calendar-approved-20261122/time-787.jpg"
  },
  {
    "id": "time-788",
    "de": "August",
    "src": "/photos/calendar-approved-20261122/time-788.jpg"
  },
  {
    "id": "time-789",
    "de": "September",
    "src": "/photos/calendar-approved-20261122/time-789.jpg"
  },
  {
    "id": "time-790",
    "de": "Oktober",
    "src": "/photos/calendar-approved-20261122/time-790.jpg"
  },
  {
    "id": "time-791",
    "de": "November",
    "src": "/photos/calendar-approved-20261122/time-791.jpg"
  },
  {
    "id": "time-792",
    "de": "Dezember",
    "src": "/photos/calendar-approved-20261122/time-792.jpg"
  }
];
// SHA-256 for the seven exact user-approved enhanced weekday JPG files installed in main commit c6ed73f6 on 2026-11-22.
const approvedWeekdaySha256={"time-774":"b1edbe3d8dca8424b72cba7d1731a2afe4458b5aa40df6c86171a56f8a3c895f","time-775":"076e660d4c59aa000b8d2b275d40f9862c5b3c3e52c61470dac7174656118b72","time-776":"1193c35ef60d98db4aa6f8d38bcd1a4ce961bb6d1d8f6b6b74caa92e6205d5e4","time-777":"686b4302d8413aba92402d6b136dbfb83a03dd9bd0668cd14d2b3768b7db2162","time-778":"9d4f6b500175713d336ceb190b52eb6d134340fd1a1f696bfd5ca883d919a0c1","time-779":"70b9b8d15fb32dc926405a498f7403ddf4bddc7467905e474a1fe5cddd623016","time-780":"738a69a31b6be0d824847a0054f2da5cdf7d47bcb242e2c1e02fe28d19df9ccd"};
const approvedMonthSha256={"time-781":"800de63cdbc33e0bcbb0dbb1bbb3f59d7aa6927b249af7b850180d48038840d0","time-782":"44d298c9ab5e3df0541f8c7b181406a6f3f7c442d9a61cb0d8f57d48377f0728","time-783":"edf60263400ae152f12af66745e510f5f09f54fdd94d110010cba8d194643d64","time-784":"93ad92522971879aae196c0fd25901475ec2e47b601faf8caaa8afd3a9a8ea24","time-785":"621d05ea5565703888b9d1f4a4957f819cdc0b29d431f0d793a019f35450c1d3","time-786":"43faf3309f0aad4029b57e9557527c152c340e0d57d24f224b192dff6518bb87","time-787":"bd9648ca9be24b491372b86bae32670ee91a34e6a15345f31685df1d3fb1cc5e","time-788":"5fc0822cc73f9f7aa9773788cb57ca70c2e9bb34f627f2e099c0310e3b1fcb18","time-789":"9dbfb2440e06e237039af8b5451ea18800deec5a2bb7632c7fdbf3bbc1df900e","time-790":"af3dff57470c3793e3b08bf972e8d6a28603e58d889623705d300cdd1990902f","time-791":"d21bb7264ecf944db9ccf5f492c88a0a01f778ede5fa10910da84cd6ae31c151","time-792":"7f09e2c29f684745bd77235c45da3e102315689b40c3a612d4b140ec78fb7f38"};
const seen=new Set();
for(const item of expected){
 const word=byId.get(item.id);if(!word||word.de!==item.de)throw Error("Wrong calendar word: "+item.id);
 const local=item.src.startsWith("/")?item.src:"/photos/"+createHash("sha256").update(item.src).digest("hex").slice(0,18)+".jpg";
 if(word.photo!==item.src&&word.photo!==local)throw Error("Calendar visual mismatch: "+item.id+" "+word.photo);
 if(seen.has(word.photo))throw Error("Repeated visual: "+item.id);
 seen.add(word.photo);
 if(word.photo.includes("/custom/")||/\.(?:svg|png)$/.test(word.photo))throw Error("Calendar schema or old PNG: "+item.id);
 const path=new URL("../public"+local,import.meta.url);
 if(item.src.startsWith("/")){
  if(!existsSync(path))throw Error("Approved calendar image missing: "+item.id);
  const actual=createHash("sha256").update(readFileSync(path)).digest("hex");
  if(actual!==(approvedWeekdaySha256[item.id]??approvedMonthSha256[item.id]))throw Error("Approved calendar image was altered: "+item.id);
 }
 if(existsSync(path)){
  const bytes=readFileSync(path);if(bytes.length<18000||bytes[0]!==255||bytes[1]!==216)throw Error("Calendar photo broken: "+item.id);
  let width=0,height=0;
  for(let p=2;p+9<bytes.length;){if(bytes[p]!==255){p++;continue;} const code=bytes[p+1];if(code===216||code===217||code===1){p+=2;continue;}
   const len=bytes.readUInt16BE(p+2);if(len<2)break;
   if([192,193,194,195,198,199,201,202,203,205,206,207].includes(code)){height=bytes.readUInt16BE(p+5);width=bytes.readUInt16BE(p+7);break;}p+=2+len;
  }
  if(width<1400||height<900||width<=height)throw Error("Approved calendar photo must be high-resolution horizontal: "+item.id+" "+width+"x"+height);
 }
}
if(expected.length!==19)throw Error("Expected 19 calendar photographs");
console.log("Calendar QA: 19 exact approved local calendar photographs (7 weekdays and 12 months; SHA-256 locked), high-resolution horizontal, no old calendar schematics.");
