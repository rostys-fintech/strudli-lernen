// Prepare a local high-resolution 3D hero asset from approved-style Strudli art.
// It is cached into public/strudli when the build has access to the source.
// Keep the original branded sprite as offline fallback.
import {mkdirSync,writeFileSync} from "node:fs";
import {dirname} from "node:path";
import {fileURLToPath} from "node:url";
const target=fileURLToPath(new URL("../public/strudli/strudli-storybook-hero.png",import.meta.url));
const candidates=["https://media.canva.com/v2/image-resize/format:PNG/height:1199/quality:100/uri:ifs%3A%2F%2FM%2F09a66a68-8942-44d0-85a0-35cd02bb766a/watermark:F/width:1312","https://media.canva.com/v2/image-resize/format:PNG/height:1199/quality:100/uri:ifs%3A%2F%2FM%2F09a66a68-8942-44d0-85a0-35cd02bb766a/watermark:F/width:1312?csig=AAAAAAAAAAAAAAAAAAAAABepr__nYsWDGE4YpvJBFQCevKA6qmaWR8QXLD--9eJj&exp=1795469240&osig=AAAAAAAAAAAAAAAAAAAAAFI_RTnqDTx6y8mzq902aynlNCZTwqCjiZnQb8EFQuX-&signer=media-rpc&token=AAIAAU0AJDA5YTY2YTY4LTg5NDItNDRkMC04NWEwLTM1Y2QwMmJiNzY2YQAAAAABogpOZsCWNWqJ7VP41rhg0-YZjM6ohr5pqToxTDWSjr04ony0NA&x-canva-quality=thumbnail","https://media.canva.com/v2/image-resize/format:PNG/height:182/quality:100/uri:ifs%3A%2F%2FM%2F09a66a68-8942-44d0-85a0-35cd02bb766a/watermark:F/width:200?csig=AAAAAAAAAAAAAAAAAAAAABepr__nYsWDGE4YpvJBFQCevKA6qmaWR8QXLD--9eJj&exp=1795469240&osig=AAAAAAAAAAAAAAAAAAAAAFI_RTnqDTx6y8mzq902aynlNCZTwqCjiZnQb8EFQuX-&signer=media-rpc&token=AAIAAU0AJDA5YTY2YTY4LTg5NDItNDRkMC04NWEwLTM1Y2QwMmJiNzY2YQAAAAABogpOZsCWNWqJ7VP41rhg0-YZjM6ohr5pqToxTDWSjr04ony0NA&x-canva-quality=thumbnail"];
for(let i=0;i<candidates.length;i++){
 try{
  const res=await fetch(candidates[i],{signal:AbortSignal.timeout(14000),headers:{Accept:"image/png,image/webp"}});
  const bytes=Buffer.from(await res.arrayBuffer());
  const png=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
  const width=png?bytes.readUInt32BE(16):0;
  console.log("Mascot fetch",i,"HTTP",res.status,"bytes",bytes.length,"width",width);
  if(!res.ok||!png||width<500||bytes.length<40000)continue;
  mkdirSync(dirname(target),{recursive:true});writeFileSync(target,bytes);
  console.log("Strudli 3D hero cached to local public asset:",bytes.length,"bytes");
  break;
 }catch(e){console.warn("Mascot fetch candidate",i,String(e).slice(0,120))}
}
