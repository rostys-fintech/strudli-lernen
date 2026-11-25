/**
 * WortWelt original PNG cards. Dependency-free, deterministic renderer.
 * SVG is never used as a game image. All assets are committed as real PNGs.
 * Run with node scripts/generate-vocab-cards.mjs to regenerate in public/photos/custom.
 */
export const CARDS=[
["germany-229","Kaution","concept",0],
["technology-272","Empfang","concept",1],
["technology-274","Tarif","concept",2],
["family-476","Nachbarin","concept",3],
["study-634","Satz","concept",4],
["study-637","Grammatik","concept",5],
["shopping-681","Umtausch","concept",6],
["time-774","Montag","day",0],["time-775","Dienstag","day",1],["time-776","Mittwoch","day",2],["time-777","Donnerstag","day",3],["time-778","Freitag","day",4],["time-779","Samstag","day",5],["time-780","Sonntag","day",6],
["time-781","Januar","month",0],["time-782","Februar","month",1],["time-783","März","month",2],["time-784","April","month",3],["time-785","Mai","month",4],["time-786","Juni","month",5],["time-787","Juli","month",6],["time-788","August","month",7],["time-789","September","month",8],["time-790","Oktober","month",9],["time-791","November","month",10],["time-792","Dezember","month",11],
["ww-new-061","Warmmiete","concept",7],["ww-new-062","Kaltmiete","concept",8],["ww-new-063","Besichtigung","concept",9],["ww-new-065","Vermieterin","concept",10],["ww-new-077","Kontostand","concept",11],["ww-new-079","Dauerauftrag","concept",12]
];
const COLOR=[
[247,250,253],[255,255,255],[22,47,72],[89,108,127],[217,229,239],
[219,246,239],[22,143,126],[255,240,213],[227,154,42],
[234,235,255],[92,107,198],[253,233,230],[226,96,86],
[227,243,255],[53,139,197],[234,244,227],[113,165,65],
[197,213,223],[237,245,251],[170,193,208],[43,73,100],[244,247,251]
];
const FONT={
A:"0,8 3,0 6,8|1.1,5 4.9,5",
B:"0,0 0,8 4.1,8 6,6.5 6,5.2 4.4,4 0,4|0,0 4,0 6,1.4 6,2.6 4.4,4",
C:"6,0.8 4.8,0 1.7,0 0,2 0,6 1.7,8 4.8,8 6,7.2",
D:"0,0 0,8 3.9,8 6,6 6,2 3.9,0 0,0",
E:"6,0 0,0 0,8 6,8|0,4 5,4",
F:"0,8 0,0 6,0|0,4 5,4",
G:"6,1 4.7,0 1.7,0 0,2 0,6 1.7,8 6,8 6,4.5 3.5,4.5",
H:"0,0 0,8|6,0 6,8|0,4 6,4",
I:"0,0 6,0|3,0 3,8|0,8 6,8",
J:"6,0 6,6 4,8 2,8 0,6.5",
K:"0,0 0,8|6,0 0,4 6,8",
L:"0,0 0,8 6,8",
M:"0,8 0,0 3,4 6,0 6,8",
N:"0,8 0,0 6,8 6,0",
O:"1.5,0 4.5,0 6,2 6,6 4.5,8 1.5,8 0,6 0,2 1.5,0",
P:"0,8 0,0 4.5,0 6,1.4 6,2.9 4.5,4.2 0,4.2",
Q:"1.5,0 4.5,0 6,2 6,6 4.5,8 1.5,8 0,6 0,2 1.5,0|4.2,6.2 6.5,8.7",
R:"0,8 0,0 4.5,0 6,1.4 6,2.9 4.5,4.2 0,4.2|3.5,4.2 6,8",
S:"6,0.8 4.7,0 1.2,0 0,1.4 0,2.5 1.4,4 4.6,4 6,5.5 6,6.7 4.8,8 1.2,8 0,7.2",
T:"0,0 6,0|3,0 3,8",
U:"0,0 0,6.5 1.6,8 4.4,8 6,6.5 6,0",
V:"0,0 3,8 6,0",
W:"0,0 1.1,8 3,3.5 4.9,8 6,0",
X:"0,0 6,8|6,0 0,8",
Y:"0,0 3,4.2 6,0|3,4.2 3,8",
Z:"0,0 6,0 0,8 6,8",
0:"1.5,0 4.5,0 6,2 6,6 4.5,8 1.5,8 0,6 0,2 1.5,0|0.5,7 5.5,1",
1:"0.8,2 3,0 3,8|1,8 5,8",
2:"0,1.2 1.5,0 4.7,0 6,1.3 6,2.8 0,8 6,8",
3:"0,0 6,0 3.5,4 6,4 6,7 4.7,8 0,8",
4:"5,8 5,0|0,0 0,5 6,5",
5:"6,0 0,0 0,4 4.7,4 6,5.3 6,7 4.7,8 0,8",
6:"5.7,0.4 4,0 1,2 0,4 0,6.6 1.6,8 4.5,8 6,6.5 6,5.2 4.5,4 0,4",
7:"0,0 6,0 2,8",
8:"1.3,0 4.7,0 6,1.3 6,2.7 4.7,4 1.3,4 0,2.7 0,1.3 1.3,0|1.3,4 4.7,4 6,5.4 6,6.7 4.7,8 1.3,8 0,6.7 0,5.4 1.3,4",
9:"6,4 1.4,4 0,2.6 0,1.3 1.4,0 4.5,0 6,1.5 6,4 5,6 2,8 0.3,7.7",
Ä:"0,8 3,0 6,8|1.1,5 4.9,5|1.4,-1.6 1.4,-1.2|4.6,-1.6 4.6,-1.2",
Ü:"0,0 0,6.5 1.6,8 4.4,8 6,6.5 6,0|1.4,-1.6 1.4,-1.2|4.6,-1.6 4.6,-1.2",
"-":"0,4 6,4",
".":"3,8 3.2,8",
":":"3,2.5 3.2,2.5|3,6.2 3.2,6.2",
"€":"5.7,1 4.4,0 2,0 0.8,2 0.8,6 2,8 4.4,8 5.7,7|0,3 4.8,3|0,5 4.8,5",
"/":"0,8 6,0"
};
const B64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export function toBase64(data){
 let res=[];for(let i=0;i<data.length;i+=3){const a=data[i],b=i+1<data.length?data[i+1]:0,c=i+2<data.length?data[i+2]:0;res.push(B64[a>>2],B64[((a&3)<<4)|(b>>4)],i+1<data.length?B64[((b&15)<<2)|(c>>6)]:"=",i+2<data.length?B64[c&63]:"=")}
 return res.join("");
}
function crc(data){let c=0xffffffff;for(let i=0;i<data.length;i++){c^=data[i];for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^0xffffffff)>>>0}
function u32(x){return[(x>>>24)&255,(x>>>16)&255,(x>>>8)&255,x&255]}
function chunk(label,payload){
 const n=payload.length,t=[...label].map(c=>c.charCodeAt(0)),contents=new Uint8Array(8+n+4);
 contents.set(u32(n),0);contents.set(t,4);contents.set(payload,8);contents.set(u32(crc(contents.subarray(4,8+n))),8+n);
 return contents;
}
function compressStored(raw){
 const full=[0x78,0x01];let a=1,b=0;
 for(let i=0;i<raw.length;){const len=Math.min(65535,raw.length-i),last=(i+len===raw.length)?1:0;
 full.push(last,len&255,(len>>>8)&255,(~len)&255,((~len)>>>8)&255);
 for(let j=0;j<len;j++){const c=raw[i+j];full.push(c);a=(a+c)%65521;b=(b+a)%65521}i+=len;
 }
 full.push(...u32(((b<<16)|a)>>>0));
 return new Uint8Array(full);
}
function assemble(parts){let n=0;for(const p of parts)n+=p.length;const out=new Uint8Array(n);let i=0;for(const p of parts){out.set(p,i);i+=p.length}return out}
const W=768,H=768;
export function makeCardPng(card){
 const pixels=new Uint8Array(W*H);
 const plot=(x,y,c)=>{x|=0;y|=0;if(x>=0&&x<W&&y>=0&&y<H)pixels[y*W+x]=c};
 const rect=(x,y,w,h,c)=>{const x0=Math.max(0,x|0),y0=Math.max(0,y|0),x1=Math.min(W,Math.ceil(x+w)),y1=Math.min(H,Math.ceil(y+h));for(let yy=y0;yy<y1;yy++)pixels.fill(c,yy*W+x0,yy*W+x1)};
 const round=(x,y,w,h,r,c)=>{const x0=Math.max(0,x|0),y0=Math.max(0,y|0),x1=Math.min(W,Math.ceil(x+w)),y1=Math.min(H,Math.ceil(y+h));for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++){const qx=Math.max(x+r-xx,0,xx-(x+w-r)),qy=Math.max(y+r-yy,0,yy-(y+h-r));if(qx*qx+qy*qy<=r*r)pixels[yy*W+xx]=c}};
 const circle=(cx,cy,r,c)=>{for(let y=Math.max(0,Math.floor(cy-r));y<Math.min(H,Math.ceil(cy+r));y++)for(let x=Math.max(0,Math.floor(cx-r));x<Math.min(W,Math.ceil(cx+r));x++){let dx=x+.5-cx,dy=y+.5-cy;if(dx*dx+dy*dy<=r*r)pixels[y*W+x]=c}};
 const line=(x1,y1,x2,y2,wd,c)=>{const r=wd/2,minx=Math.max(0,Math.floor(Math.min(x1,x2)-r-1)),maxx=Math.min(W-1,Math.ceil(Math.max(x1,x2)+r+1)),miny=Math.max(0,Math.floor(Math.min(y1,y2)-r-1)),maxy=Math.min(H-1,Math.ceil(Math.max(y1,y2)+r+1)),dx=x2-x1,dy=y2-y1,dd=dx*dx+dy*dy||1;for(let y=miny;y<=maxy;y++)for(let x=minx;x<=maxx;x++){let t=Math.max(0,Math.min(1,((x+.5-x1)*dx+(y+.5-y1)*dy)/dd)),ex=x+.5-(x1+t*dx),ey=y+.5-(y1+t*dy);if(ex*ex+ey*ey<=r*r)pixels[y*W+x]=c}};
 const glyph=(ch,x,y,s,col)=>{const str=FONT[ch]||FONT["-"];for(const sub of str.split("|")){const dots=sub.split(" ").map(s=>s.split(",").map(Number));for(let i=0;i<dots.length-1;i++){const a=dots[i],b=dots[i+1];line(x+a[0]*s,y+a[1]*s,x+b[0]*s,y+b[1]*s,Math.max(2.2,0.78*s),col)}}};
 const draw=(str,x,y,s,col=2)=>{str=String(str).toUpperCase();for(const ch of str){if(ch===" "){x+=5.4*s;continue}glyph(ch,x,y,s,col);x+=8.7*s}};
 const text=(str,cx,y,size,maxWidth,col=2)=>{str=String(str).toUpperCase();let units=0;for(const c of str)units+=c===" "?5.4:8.7;const s=Math.min(size,maxWidth/Math.max(1,units));draw(str,cx-units*s/2,y,s,col)};
 const shadow=(x,y,w,h)=>{round(x+8,y+12,w,h,28,4);round(x+3,y+5,w,h,28,17);round(x,y,w,h,28,1)};
 const [id,word,kind,idx]=card;
 const accents=[6,10,8,12,14,16,6],lights=[5,9,7,11,13,15,5];
 let accent=kind==="day"?accents[idx]:kind==="month"?accents[idx%7]:accents[idx%7];
 let light=kind==="day"?lights[idx]:kind==="month"?lights[idx%7]:lights[idx%7];
 pixels.fill(0);round(32,32,704,704,40,18);shadow(65,58,638,650);
 // Printed, softly-colored top header with a discreet publication mark.
 round(88,82,592,146,24,light);round(90,84,588,10,5,accent);
 text("WORTWELT",170,108,2.25,140,3);
 if(kind==="day"||kind==="month"){
   text(word,384,141,8.5,530,2);
   round(95,255,578,384,30,0);
   text(kind==="day"?"WOCHENTAG":"KALENDER",384,277,3.0,450,3);
   if(kind==="day"){
     const labels=["MO","DI","MI","DO","FR","SA","SO"];
     for(let i=0;i<7;i++){
       const x=110+i*79;
       round(x,355,72,126,15,i===idx?accent:1);
       text(labels[i],x+36,382,3.3,58,i===idx?1:3);
       text(String(i+1),x+36,430,3.5,46,i===idx?1:2);
     }
     rect(133,519,503,3,4);
     text("MO - SO",384,549,3.1,380,3);
   }else{
     const names=["JAN","FEB","MAR","APR","MAI","JUN","JUL","AUG","SEP","OKT","NOV","DEZ"];
     for(let i=0;i<12;i++){
       const row=Math.floor(i/4),col=i%4,x=130+col*132,y=335+row*92;
       round(x,y,113,78,13,i===idx?accent:1);
       text(names[i],x+56.5,y+19,3.1,100,i===idx?1:3);
     }
     text("2026",384,612,2.4,230,3);
   }
 }else{
   const labels=["WOHNEN","TECHNIK","MOBILFUNK","NACHBARN","SPRACHE","SPRACHE","EINKAUFEN","WOHNEN","WOHNEN","WOHNEN","WOHNEN","FINANZEN","BANKING"];
   text(word,384,140,8.7,546,2);
   text(labels[idx],384,251,3.2,490,3);
   round(153,292,462,364,32,light);
   circle(384,474,147,1);
   const key=(cx,cy,c)=>{circle(cx-90,cy-56,37,c);circle(cx-90,cy-56,22,1);line(cx-65,cy-31,cx+85,cy+95,24,c);line(cx+42,cy+60,cx+16,cy+89,20,c);line(cx+71,cy+86,cx+46,cy+114,18,c)};
   const house=(cx,cy,c)=>{rect(cx-86,cy+6,172,135,c);line(cx-105,cy+10,cx,cy-92,30,c);line(cx,cy-92,cx+105,cy+10,30,c);rect(cx-23,cy+68,48,73,1);rect(cx-63,cy+38,27,28,1);rect(cx+37,cy+38,27,28,1)};
   const mobile=(cx,cy)=>{round(cx-84,cy-131,168,268,22,2);round(cx-72,cy-111,144,220,10,1);round(cx-25,cy+112,50,5,2)};
   const paper=(cx,cy)=>{round(cx-118,cy-131,236,262,15,1);round(cx-105,cy-116,210,235,10,4);rect(cx-90,cy-99,180,201,1);for(let i=0;i<4;i++)rect(cx-65,cy-54+i*34,130-i*12,5,17)};
   if(idx===0){paper(402,456);key(392,485,accent);text("€",498,349,4.0,84,accent)}
   if(idx===1){mobile(373,466);for(let i=0;i<4;i++)round(324+i*26,539-i*33,18,37+i*33,5,accent)}
   if(idx===2){mobile(363,460);text("€",368,423,9,110,accent);text("GB",369,514,3.5,135,3)}
   if(idx===3){house(335,439,accent);house(484,477,10);circle(379,541,29,8);rect(364,570,30,48,2)}
   if(idx===4){paper(384,477);text("ICH LERNE",384,416,3.8,183,2);text("DEUTSCH.",384,493,3.5,182,accent);line(296,541,474,541,7,accent)}
   if(idx===5){paper(384,474);text("DER",384,390,4.2,185,accent);text("DIE",384,468,4.2,185,2);text("DAS",384,546,4.2,185,accent)}
   if(idx===6){round(270,436,218,187,16,1);line(284,453,315,405,17,accent);line(315,405,440,405,17,accent);line(440,405,477,450,17,accent);text("€",384,503,8,100,accent);circle(270,380,30,accent);circle(492,569,30,accent)}
   if(idx===7){house(337,452,accent);text("+",479,459,6,100,2);text("€",503,538,8.5,96,accent);rect(322,596,135,14,8)}
   if(idx===8){house(384,431,accent);text("€",385,561,8.5,150,2)}
   if(idx===9){house(368,445,accent);circle(475,548,62,10);circle(475,548,46,1);line(513,591,572,649,19,10)}
   if(idx===10){circle(378,400,61,12);round(319,472,118,117,54,12);key(476,507,accent);text("€",380,535,5,72,1)}
   if(idx===11){mobile(377,465);text("€",381,398,7.6,122,accent);text("1250",379,502,4.2,150,2)}
   if(idx===12){paper(386,457);text("€",384,416,8,100,accent);circle(384,539,42,accent);circle(384,539,27,1);text("12",384,530,2.8,50,accent)}
 }
 round(93,674,582,10,5,accent);
 const raw=new Uint8Array((W+1)*H);
 for(let y=0;y<H;y++){const i=y*(W+1);raw[i]=0;raw.set(pixels.subarray(y*W,(y+1)*W),i+1)}
 const pal=new Uint8Array(COLOR.length*3);for(let i=0;i<COLOR.length;i++)pal.set(COLOR[i],i*3);
 const header=new Uint8Array([...u32(W),...u32(H),8,3,0,0,0]);
 return assemble([new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",header),chunk("PLTE",pal),chunk("IDAT",compressStored(raw)),chunk("IEND",new Uint8Array())]);
}
