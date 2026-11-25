import {mkdirSync,writeFileSync} from "node:fs";
import {dirname} from "node:path";
import {fileURLToPath} from "node:url";

// Pexels free stock: Emre Ozyemisci, Brandenburg Gate in Golden Evening Light.
// https://www.pexels.com/photo/brandenburg-gate-in-golden-evening-light-32239604/
// Cached at build time to avoid runtime dependence on a third-party image host.
const url="https://images.pexels.com/photos/32239604/pexels-photo-32239604.jpeg?cs=srgb&fm=jpg&w=1800";
const filename=fileURLToPath(new URL("../public/strudli/berlin-gate-photo.jpg",import.meta.url));
try{
 const response=await fetch(url,{signal:AbortSignal.timeout(16000),headers:{"Accept":"image/jpeg"}});
 if(!response.ok)throw Error("HTTP "+response.status);
 const bytes=Buffer.from(await response.arrayBuffer());
 if(bytes.length<20000||bytes.length>4500000||bytes[0]!==0xff||bytes[1]!==0xd8)throw Error("Invalid JPEG response");
 mkdirSync(dirname(filename),{recursive:true});
 writeFileSync(filename,bytes);
 console.log("Local Brandenburg Gate photo ready: "+bytes.length+" bytes");
}catch(err){
 // Remote image in the homepage styles remains available if a build service
 // cannot reach the photographer's image CDN.
 console.warn("Berlin photo caching skipped; CSS remote fallback remains: "+String(err));
}
