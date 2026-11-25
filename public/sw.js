/* Basic PWA offline shell; remote word photos and speech may still require network. */
const VERSION="strudli-shell-stage1b-v2";
const PRECACHE=["/","/index.html","/manifest.webmanifest","/icon.svg","/strudli-wordmark.webp"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(PRECACHE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n=>n!==VERSION).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET")return;
 const url=new URL(req.url);
 if(url.origin!==location.origin){
  // Repeat visits keep word photos accessible if the upstream is temporarily offline.
  if(url.hostname==="wortwelt-de-ua.floot.app"&&url.pathname.startsWith("/_cdn/static/")){
   event.respondWith(caches.open(VERSION).then(async c=>{const saved=await c.match(req);if(saved)return saved;const res=await fetch(req);if(res.ok||res.type==="opaque"){void c.put(req,res.clone());}return res}));
  }
  return;
 }
 // Keep previously seen vocabulary photos usable without a network connection.
 // Photos are cached on first view; never prefetch all 1,174 cards.
 if(url.pathname.startsWith("/photos/")){
  event.respondWith(caches.open(VERSION).then(async cache=>{
   const cached=await cache.match(req);if(cached)return cached;
   const response=await fetch(req);if(response.ok)await cache.put(req,response.clone());
   return response;
  }));
  return;
 }
 if(req.mode==="navigate"){
  event.respondWith(fetch(req).then(res=>{if(res.ok){const clone=res.clone();void caches.open(VERSION).then(c=>c.put("/index.html",clone));}return res}).catch(async()=>await caches.match("/index.html")||new Response("Strudli Lernen offline",{status:503})));
 }else if(url.pathname.startsWith("/assets/")||url.pathname==="/icon.svg"||url.pathname==="/manifest.webmanifest"||url.pathname==="/strudli-wordmark.webp"){
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{if(res.ok){const clone=res.clone();void caches.open(VERSION).then(c=>c.put(req,clone));}return res})));
 }
});
