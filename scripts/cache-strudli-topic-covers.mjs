// Local copies of free-to-use Pexels photos chosen to mirror the approved home mockup.
import {mkdirSync,writeFileSync} from "node:fs";
import {dirname} from "node:path";
import {fileURLToPath} from "node:url";
const covers=[
 {name:"topic-food-breakfast.jpg",url:"https://images.pexels.com/photos/30359471/pexels-photo-30359471.jpeg?cs=srgb&fm=jpg&w=1200",credit:"James Collington / Pexels"},
 {name:"topic-home-livingroom.jpg",url:"https://images.pexels.com/photos/38936047/pexels-photo-38936047.jpeg?cs=srgb&fm=jpg&w=1200",credit:"Pexels"},
 {name:"topic-nature-dog.jpg",url:"https://images.pexels.com/photos/17648876/pexels-photo-17648876.jpeg?auto=compress&cs=tinysrgb&w=1400",credit:"Wadim Ł. / Pexels"},
 {name:"topic-health-doctor.jpg",url:"https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=1400",credit:"Antoni Shkraba / Pexels"},
 {name:"topic-daily-routine.jpg",url:"https://images.pexels.com/photos/8055693/pexels-photo-8055693.jpeg?auto=compress&cs=tinysrgb&w=1400",credit:"Annushka Ahuja / Pexels — mother and daughter folding clothes"}
];
for(const cover of covers){
 try{
  const result=await fetch(cover.url,{signal:AbortSignal.timeout(16000),headers:{"Accept":"image/jpeg"}});
  if(!result.ok)throw Error("HTTP "+result.status);
  const bytes=Buffer.from(await result.arrayBuffer());
  if(bytes.length<20000||bytes.length>3500000||bytes[0]!==0xff||bytes[1]!==0xd8)throw Error("Invalid JPEG");
  const out=fileURLToPath(new URL("../public/strudli/"+cover.name,import.meta.url));
  mkdirSync(dirname(out),{recursive:true});writeFileSync(out,bytes);
  console.log("Topic cover cached",cover.name,bytes.length);
 }catch(err){console.warn("Topic cover missing",cover.name,String(err))}
}
