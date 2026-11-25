import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const css=read("src/styles.css");
const app=read("src/App.tsx");
const home=read("src/StrudliHome.tsx");
const homeCss=read("src/strudli-home.css");
const approvedCss=read("src/strudli-approved.css");
const finalCss=read("src/strudli-stage13.css");
assert.ok(finalCss.includes("strudliSway")&&finalCss.includes("mask-image:none"),"Coherent hero scene and gentle mascot animation must be present");
assert.ok(finalCss.includes(".brandHomeLink")&&finalCss.includes("left:50%"),"Home logo must be centered in the approved notch");
assert.ok(finalCss.includes("left:51.5%")&&finalCss.includes("strudliLandingContinue:hover"),"Bilingual headline and CTA must share optical center without hover shifting");
assert.ok(finalCss.includes("grid-template-columns:46px minmax(0,1fr) 46px")&&finalCss.includes("border-radius:35px 37px"),"Primary CTA must have balanced icon/text/arrow and softly rounded book shape");
assert.ok(home.includes('strudliLandingHero--en')&&home.includes("strudliLandingBubble"),"Language-aware hero must be present");
for(const name of ["icon-books.svg","icon-reading.svg","icon-sentences.svg","icon-heart.svg"]){assert.ok(home.includes(name),"Illustrated "+name+" icon missing");}
for(const id of ["nature","health","daily"]){assert.ok(home.includes(`data-section={section.id}`)&&home.includes(` ${id}:"/strudli/topic-${id=== "nature" ? "nature-dog":id=== "health" ? "health-doctor":"daily-routine"}.jpg"`),"Approved replacement photo not configured for "+id);}
assert.ok(approvedCss.includes("open-book-tab.svg")&&approvedCss.includes("autumn-canopy.svg"),"Approved dimensional open-book UI and real autumn foliage missing");
assert.ok(home.includes('import "./strudli-approved.css"'),"Approved design skin is not loaded");
assert.ok(home.includes('strudli-storybook-hero.webp'),"3D hero illustration not wired");
const mascotHQ=readFileSync(new URL("../public/strudli/strudli-storybook-hero.webp",import.meta.url));
assert.ok(mascotHQ.length>120000&&mascotHQ.toString("ascii",0,4)==="RIFF"&&mascotHQ.toString("ascii",8,12)==="WEBP","Full-resolution 3D mascot asset absent or corrupt");
assert.ok(homeCss.includes("images.pexels.com/photos/32239604")&&homeCss.includes("strudliLandingScene:before"),"Real photo of Brandenburg Gate must replace simplified illustration on home");
assert.ok(homeCss.includes(".strudliLandingMascotHQ")&&home.includes("strudli-hero-sharp.svg"),"Approved standalone high-definition Strudli mascot asset must be used on home");

const approvedSheet=readFileSync(new URL("../public/strudli/strudli-poses-approved-20261123.png",import.meta.url));
const heroSvg=read("public/strudli/strudli-hero-sharp.svg");
const embeddedSheet=heroSvg.match(/data:image\/png;base64,([^"]+)/)?.[1];
assert.ok(embeddedSheet&&heroSvg.includes('x="-840"')&&heroSvg.includes("feConvolveMatrix"),"Hero must crop exactly the approved final pose with a sharpening filter");
assert.deepEqual(Buffer.from(embeddedSheet,"base64"),approvedSheet,"Hero must embed the exact approved Strudli brand sprite, without changing the character");

// Stage 15: guide appears in useful contexts, without blocking or automatically playing audio.
const guide=read("src/StrudliGuide.tsx");
const practice=read("src/Practice.tsx");
const library=read("src/Library.tsx");
const audio=read("src/StrudliAudio.tsx");
const lesen=read("src/Lesen.tsx");
assert.ok(guide.includes("strudli-storybook-hero.webp")&&guide.includes("strudliGuideSpeech"),"Approved mascot-based helper missing");
assert.ok(!guide.includes("setInterval(")&&!guide.includes("speechSynthesis"),"The helper must not interrupt the lesson or speak automatically");
for(const [name,source] of [["word cards",app],["practice",practice],["dictionary",library],["audio",audio],["reading",lesen]]){
 assert.ok(source.includes("StrudliGuide"),"Contextual Strudli missing in "+name);
}
assert.ok(app.includes("strudliGuide--progress")&&library.includes('mode==="favorites"&&favorites.length===0'),"Progress and empty-state guide missing");

const roadmap=read("docs/STRUDLI_ROADMAP_STAGE05.md");
assert.ok(css.includes("Stage 05A — Strudli warm visual system"),"Warm brand theme missing");
for(const token of ["--strudli-ink:","--strudli-red:","--strudli-gold:","--strudli-cream:","--strudli-line:"])assert.ok(css.includes(token),"Missing brand token "+token);
assert.ok(css.includes('font-family:"Rubik","Nunito"'),"Readable Cyrillic-compatible brand typography missing");
assert.ok(css.includes(".topbar{background:var(--strudli-paper)"),"Header is not a warm surface");
assert.ok(css.includes(".navigation{background:var(--strudli-paper)"),"Bottom navigation still has old theme");
assert.ok(css.includes(".cardNextButton{background:linear-gradient(105deg,#ad2e49,#862039)"),"Primary Next lost burgundy CTA");
const coverCss=read("src/strudli-cover-loading.css");
assert.ok(home.includes("strudliLandingTopicShade")&&coverCss.includes("rgba(43,23,20,.77)")&&homeCss.includes("strudliLandingTopicCard"),"Warm photo overlays must remain with explicit, eagerly loaded images");
assert.ok(!app.includes("rgba(7,29,48,.33),rgba(5,31,51,.86)"),"Legacy blue topic photo overlay found");
for(const [article,color] of [["der","#2585DA"],["die","#F05170"],["das","#0EAD94"]]){
 assert.ok(css.includes('.word .'+article+',.article.'+article),article+" semantic heading color lost");
 assert.ok(css.includes("color:"+color+"}"),article+" semantic color changed");
 assert.ok(css.includes('.game .answers button.answerOption.answer--'+article),article+" answer CSS lost");
}
assert.ok(app.includes('className="brandWordmark" src="/strudli/strudli-wordmark-transparent.webp"'),"Transparent approved wordmark must be used on all screens");
const clearLogo=readFileSync(new URL("../public/strudli/strudli-wordmark-transparent.webp",import.meta.url));
assert.ok(clearLogo.length>10000&&clearLogo.toString("ascii",0,4)==="RIFF"&&clearLogo.toString("ascii",8,12)==="WEBP","Transparent wordmark asset missing or invalid");
assert.ok(finalCss.includes("mix-blend-mode:normal!important"),"The logo must not receive a background tint");
assert.ok(app.includes('<StrudliToastEffect effect={toastFx} onMasteredFinished={finishMasteryFlight}/>'),"Approved mastery flight altered");
assert.ok(app.includes('feedbackSound("correct",Math.min(3,flames+1));gen.current++;void speak('),"Audio sync Stage 04C.2 regressed");
assert.ok(roadmap.includes("Stage 05")&&roadmap.includes("05B")&&roadmap.includes("Lesen"),"Next-phase roadmap incomplete");
console.log("Stage 05A QA passed: warm theme, approved icon/wordmark, unchanged semantic article colors, mastery flight and synchronous speech.");
