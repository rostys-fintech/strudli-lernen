/** Ensure 19 newly approved calendar photographs win after the historical 409-photo import. */
import {readFileSync,writeFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
const root=new URL("../src/data.ts",import.meta.url),source=readFileSync(root,"utf8");
const m=source.match(/export const DEMO_WORDS:Word\[\]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
if(!m)throw Error("Missing calendar catalog");
const words=JSON.parse(m[1]),byId=new Map(words.map(w=>[w.id,w]));
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
for(const item of expected){
 const card=byId.get(item.id);if(!card||card.de!==item.de)throw Error("Calendar mapping changed: "+item.id);
 const local=item.src.startsWith("/")?item.src:"/photos/"+createHash("sha256").update(item.src).digest("hex").slice(0,18)+".jpg";
 const fp=new URL("../public"+local,import.meta.url);
 if(!existsSync(fp))throw Error("High-resolution calendar image not available: "+item.id);
 const bytes=readFileSync(fp);if(bytes.length<18000)throw Error("Calendar photo unexpectedly small: "+item.id);
 card.photo=local;
}
writeFileSync(root,source.replace(m[1],JSON.stringify(words)));
console.log("Finalized 19 photograph calendar cards after 409 historical approvals; no other mappings touched.");
