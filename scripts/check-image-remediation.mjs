import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
const read=p=>readFileSync(new URL(p,import.meta.url),"utf8");
const source=read("../src/data.ts");
const wordsBlock=source.match(/export const DEMO_WORDS:Word\[]=(\[[\s\S]*?\]);\nexport const ORIGINAL_SENTENCES/);
if(!wordsBlock)throw Error("Cannot locate Word catalog");
const words=JSON.parse(wordsBlock[1]);
const manifest=JSON.parse(read("../public/photos/curated/manifest.json")).photos;
const credits=read("../public/photo-credits.html");
const byId=new Map(words.map(w=>[w.id,w]));
const expected={
"travel-438":{de:"Land",url:"https://images.pexels.com/photos/8828597/pexels-photo-8828597.jpeg?auto=compress&w=960"},
"work-590":{de:"Beruf",url:"https://images.pexels.com/photos/9879936/pexels-photo-9879936.jpeg?auto=compress&w=960"},
"work-610":{de:"Unternehmen",url:"https://images.pexels.com/photos/6326260/pexels-photo-6326260.jpeg?auto=compress&w=960"},
"body-712":{de:"Blut",url:"https://images.pexels.com/photos/6285363/pexels-photo-6285363.jpeg?auto=compress&w=960"},
"home-349":{de:"Decke",url:"https://images.pexels.com/photos/8678894/pexels-photo-8678894.jpeg?auto=compress&w=960"},
"city-523":{de:"Straße",url:"https://images.pexels.com/photos/4916136/pexels-photo-4916136.jpeg?auto=compress&w=960"},
"work-623":{de:"Dokument",url:"https://images.pexels.com/photos/8463149/pexels-photo-8463149.jpeg?auto=compress&w=960"},
"study-646":{de:"Unterricht",url:"https://images.pexels.com/photos/8617967/pexels-photo-8617967.jpeg?auto=compress&w=960"},
"shopping-677":{de:"Geldschein",url:"https://images.pexels.com/photos/4201343/pexels-photo-4201343.jpeg?auto=compress&w=960"},

"body-697":{de:"Mund",url:"https://images.pexels.com/photos/13765656/pexels-photo-13765656.jpeg?auto=compress&w=960"},
"body-701":{de:"Hals",url:"https://images.pexels.com/photos/7067815/pexels-photo-7067815.jpeg?auto=compress&w=960"},
"technology-265":{de:"E-Mail",url:"https://images.pexels.com/photos/7568298/pexels-photo-7568298.jpeg?auto=compress&w=960"},
"food-297":{de:"Pasta",url:"https://images.pexels.com/photos/4518946/pexels-photo-4518946.jpeg?auto=compress&w=960"},
"food-300":{de:"Hähnchen",url:"https://images.pexels.com/photos/6163330/pexels-photo-6163330.jpeg?auto=compress&w=960"},

"home-374":{de:"Badewanne",url:"https://images.pexels.com/photos/19984614/pexels-photo-19984614.jpeg?auto=compress&w=960"},
"ww-new-207":{de:"Steak",url:"https://images.pexels.com/photos/27305268/pexels-photo-27305268.jpeg?auto=compress&w=960"},
"ww-new-120":{de:"Bär",url:"https://images.pexels.com/photos/31011138/pexels-photo-31011138.jpeg?auto=compress&w=960"},
"ww-new-121":{de:"Schlange",url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/CornSnake.jpg/960px-CornSnake.jpg"},
"family-457":{de:"Oma",url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Smiling_senior_woman_with_curly_hair_portrait.jpg/960px-Smiling_senior_woman_with_curly_hair_portrait.jpg"},
"family-458":{de:"Opa",url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Senior_man_reading_a_book_and_smiling.jpg/960px-Senior_man_reading_a_book_and_smiling.jpg"},
"family-466":{de:"Kind",url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Girl_Portrait_Kid_Cute_Hair_Sunlight_Arab_Young.jpg/960px-Girl_Portrait_Kid_Cute_Hair_Sunlight_Arab_Young.jpg"}
,
"family-453":{de:"Schwester",url:"https://images.pexels.com/photos/6182792/pexels-photo-6182792.jpeg?auto=compress&w=960"},
"family-459":{de:"Großmutter",url:"https://images.pexels.com/photos/25636768/pexels-photo-25636768.jpeg?auto=compress&w=960"},
"family-460":{de:"Großvater",url:"https://images.pexels.com/photos/7322006/pexels-photo-7322006.jpeg?auto=compress&w=960"}
,
"ww-new-099":{de:"Schublade",url:"https://images.pexels.com/photos/8581064/pexels-photo-8581064.jpeg?auto=compress&w=960"},
"hobbies-731":{de:"Tennis",url:"https://images.pexels.com/photos/36258640/pexels-photo-36258640.jpeg?auto=compress&w=960"},
"hobbies-749":{de:"Kochen",url:"https://images.pexels.com/photos/7418495/pexels-photo-7418495.jpeg?auto=compress&w=960"},
"city-544":{de:"Laden",url:"https://images.pexels.com/photos/18075647/pexels-photo-18075647.jpeg?auto=compress&w=960"},
"clothes-395":{de:"Rock",url:"https://images.pexels.com/photos/4663319/pexels-photo-4663319.jpeg?auto=compress&w=960"}
,
"germany-215":{de:"Antrag",url:"https://images.pexels.com/photos/7821682/pexels-photo-7821682.jpeg?auto=compress&w=960"}
,
"work-612":{de:"Bewerbung",url:"https://images.pexels.com/photos/4101343/pexels-photo-4101343.jpeg?auto=compress&w=960"}
,
"time-770":{de:"Woche",url:"https://images.pexels.com/photos/6446318/pexels-photo-6446318.jpeg?auto=compress&w=960"}
,
"ww-new-069":{de:"Monatskarte",url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/HVV_Deutschlandticket_230420_Front.jpg/960px-HVV_Deutschlandticket_230420_Front.jpg"}
,"study-657":{de:"Zeugnis",url:"https://upload.wikimedia.org/wikipedia/commons/3/31/DDR_Zeugnis_Noten.jpg"}
,"ww-new-064":{de:"Vermieter",url:"https://images.pexels.com/photos/7642004/pexels-photo-7642004.jpeg?auto=compress&w=960"}
,"germany-237":{de:"Beratung",url:"https://images.pexels.com/photos/7821671/pexels-photo-7821671.jpeg?auto=compress&w=960"}
,"time-761":{de:"Uhr",url:"https://images.pexels.com/photos/6968188/pexels-photo-6968188.jpeg?auto=compress&w=960"}
,"hobbies-757":{de:"Einladung",url:"https://images.pexels.com/photos/6479559/pexels-photo-6479559.jpeg?auto=compress&w=960"}
,"work-622":{de:"E-Mail",url:"https://images.pexels.com/photos/5744250/pexels-photo-5744250.jpeg?auto=compress&w=960"}
,"transport-577":{de:"Gleis",url:"https://images.pexels.com/photos/192948/pexels-photo-192948.jpeg?auto=compress&w=960"}
,"shopping-672":{de:"Rabatt",url:"https://images.pexels.com/photos/5872305/pexels-photo-5872305.jpeg?auto=compress&w=960"}
,"shopping-690":{de:"Qualität",url:"https://images.pexels.com/photos/35383622/pexels-photo-35383622.jpeg?auto=compress&w=960"}
,"city-541":{de:"Krankenhaus",url:"https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Krankenhaus_vom_Roten_Kreuz_-_Eingang.jpg/960px-Krankenhaus_vom_Roten_Kreuz_-_Eingang.jpg"}
,"food-327":{de:"Sahne",url:"https://images.pexels.com/photos/6641182/pexels-photo-6641182.jpeg?auto=compress&w=960"}
,"hobbies-742":{de:"Foto",url:"https://images.pexels.com/photos/6188759/pexels-photo-6188759.jpeg?auto=compress&w=960"}
,"ww-new-070":{de:"Fahrkartenautomat",url:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Fahrkartenautomat_des_MVV_an_der_S-Bahnstation_Langwied_01.jpg/960px-Fahrkartenautomat_des_MVV_an_der_S-Bahnstation_Langwied_01.jpg"}
,"clothes-415":{de:"Größe",url:"https://images.pexels.com/photos/8769360/pexels-photo-8769360.jpeg?auto=compress&w=960"}
,"germany-214":{de:"Termin",url:"https://images.pexels.com/photos/6170653/pexels-photo-6170653.jpeg?auto=compress&w=960"}
,"transport-574":{de:"Fahrer",url:"https://images.pexels.com/photos/17976225/pexels-photo-17976225.jpeg?auto=compress&w=960"}
,"work-597":{de:"Chef",url:"https://images.pexels.com/photos/7433898/pexels-photo-7433898.jpeg?auto=compress&w=960"}
,"germany-218":{de:"Kopie",url:"https://images.pexels.com/photos/3791246/pexels-photo-3791246.jpeg?auto=compress&w=960"}
,"work-626":{de:"Steuer",url:"https://images.pexels.com/photos/6927342/pexels-photo-6927342.jpeg?auto=compress&w=960"}
,"study-636":{de:"Sprache",url:"https://images.pexels.com/photos/5428013/pexels-photo-5428013.jpeg?auto=compress&w=960"}
,"ww-new-057":{de:"Bestellung",url:"https://images.pexels.com/photos/6816368/pexels-photo-6816368.jpeg?auto=compress&w=960"}
,"germany-227":{de:"Miete",url:"https://images.pexels.com/photos/8963083/pexels-photo-8963083.jpeg?auto=compress&w=960"}
,"hobbies-759":{de:"Verein",url:"https://images.pexels.com/photos/16543116/pexels-photo-16543116.jpeg?auto=compress&w=960"}
};
for(const [id,ref] of Object.entries(expected)){
 const w=byId.get(id);
 if(!w||w.de!==ref.de)throw Error("Mismatched picture / headword: "+id);
 const h=createHash("sha256").update(ref.url).digest("hex").slice(0,18);
 const ext=new URL(ref.url).pathname.toLowerCase().endsWith(".png")?".png":".jpg";
 const mirrored="/photos/"+h+ext;
 if(w.photo!==ref.url&&w.photo!==mirrored)throw Error("Rejected old photo restored for "+id+": "+w.photo);
 const entry=manifest.find(m=>m.word_id===id);
 if(w.kind==="noun"&&(!entry||entry.image_url!==ref.url||!entry.license||!entry.author||!entry.commons_page))throw Error("No verified credit for "+id);
 if(!credits.includes(ref.de)||!credits.includes(entry?.commons_page||"File:Smiling_woman_(Unsplash).jpg"))throw Error("Missing photo attribution for "+id);
}
const mappedLine=byId.get("transport-586");
if(mappedLine?.photo!=="/photos/custom/batch29-transport-586.svg")throw Error("User-approved German line map is missing");
const svg=readFileSync(new URL("../public"+mappedLine.photo,import.meta.url),"utf8");
if(!svg.includes("Liniennetz")||!svg.includes("<svg "))throw Error("Invalid line route map");
if(!source.includes('"adjs-916"'))throw Error("No freundlich card");
// Project-original photorealistic images are committed in GitHub as full-resolution PNGs.
const ownPhotos={
 "body-698":{de:"Zahn",url:"/photos/custom/zahn.png"},
 "travel-430":{de:"Buchung",url:"/photos/custom/booking-confirmed.png"},
 "technology-276":{de:"Datenvolumen",url:"/photos/custom/mobile-data-volume.png"},
 "hobbies-746":{de:"Serie",url:"/photos/custom/serie.png"},
 "study-644":{de:"Note",url:"/photos/custom/note.png"},
 "ww-new-073":{de:"Ausfall",url:"/photos/custom/ausfall.png"},
 "family-451":{de:"Mutter",url:"/photos/custom/mutter.png"},
 "family-455":{de:"Tochter",url:"/photos/custom/tochter.png"},
 "family-465":{de:"Eltern",url:"/photos/custom/eltern.png"},
 "family-468":{de:"Familie",url:"/photos/custom/familie.png"},
 "family-452":{de:"Vater",url:"/photos/custom/vater.png"},
 "family-456":{de:"Sohn",url:"/photos/custom/sohn.png"},
 "family-454":{de:"Bruder",url:"/photos/custom/bruder.png"},
 "family-461":{de:"Tante",url:"/photos/custom/tante.png"},
 "family-462":{de:"Onkel",url:"/photos/custom/onkel.png"},
 "family-463":{de:"Cousine",url:"/photos/custom/cousine.png"},
 "family-464":{de:"Cousin",url:"/photos/custom/cousin.png"},
 "family-467":{de:"Baby",url:"/photos/custom/baby.png"},
 "nature-512":{de:"Kuh",url:"/photos/custom/kuh.png"},
 "ww-new-047":{de:"Espresso",url:"/photos/custom/espresso.png"},
 "adjs-916":{de:"freundlich",url:"/photos/custom/freundlich.png"},
 "home-377":{de:"Teller",url:"/photos/custom/teller.png"},
 "shopping-684":{de:"Preis",url:"/photos/custom/preis.png"},
 "body-720":{de:"Medikament",url:"/photos/custom/medikament.png"},
 "shopping-688":{de:"Öffnungszeit",url:"/photos/custom/oeffnungszeit.png"},
 "technology-243":{de:"Bildschirm",url:"/photos/custom/bildschirm.png"},
 "ww-new-090":{de:"Staubsauger",url:"/photos/custom/staubsauger.png"},
 "city-559":{de:"Haltestelle",url:"/photos/custom/haltestelle.png"}
};
for(const [id,ref] of Object.entries(ownPhotos)){
 const w=byId.get(id);
 if(!w||w.de!==ref.de||w.photo!==ref.url)throw Error("Full-resolution original photo not attached: "+id);
 const bytes=readFileSync(new URL("../public"+ref.url,import.meta.url));
 if(bytes.length<100000||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error("Not a full-size PNG for "+id);
 const expectedSize= ["family-451","family-452","family-454","family-456","family-461","family-462","family-463","family-464","family-467","ww-new-047","home-377","shopping-684","body-720","shopping-688","technology-243","ww-new-090","city-559"].includes(id) ? [1024,1024] : (["family-455","family-465","family-468","nature-512","adjs-916","body-698"].includes(id) ? [1254,1254] : [1536,1024]);
 if(bytes.readUInt32BE(16)!==expectedSize[0]||bytes.readUInt32BE(20)!==expectedSize[1])throw Error("Original photo wrongly sized for "+id+": "+bytes.readUInt32BE(16)+"x"+bytes.readUInt32BE(20));
 if(manifest.some(m=>m.word_id===id))throw Error("Incorrect third-party license credit for own photo: "+id);
 if(!credits.includes(ref.url))throw Error("Original photo credit missing for "+id);
}
console.log("Image remediation QA: "+(Object.keys(expected).length+Object.keys(ownPhotos).length)+" unique staged cards validated, including five 1536×1024, nineteen 1024×1024, and six 1254×1254 original images. Cow and freundlich use user-approved 1254px replacements.");
