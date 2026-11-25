import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const app=read("src/App.tsx");
const practice=read("src/Practice.tsx");
const help=read("src/StrudliSectionHelp.tsx");
const css=read("src/practice-refine.css");
const baseCss=read("src/practice-studio.css");
const photoCss=read("src/strudli-cover-loading.css");
const home=read("src/StrudliHome.tsx");
const topics=read("src/TopicChooser.tsx");
const html=read("index.html");
const pkg=JSON.parse(read("package.json"));

assert.ok(practice.includes('setChooseStage("games")')&&practice.includes('setChooseStage("session")'),"Practice must have real session-first navigation");
assert.ok(practice.includes('onClick={()=>{setSession("quiz");setChooseStage("games")}}')&&practice.includes('onClick={()=>{setSession("mastery");setChooseStage("games")}}'),"Tapping session type must advance to game selection");
assert.ok(practice.includes('chooseStage==="session"')&&practice.includes('practiceModeDeck'),"Game modes shown after format selection");
assert.ok(practice.includes('className={answered?"practiceInlineAnswer":"practiceInlineBlank"}'),"Correct form must appear inside the sentence after answering");
assert.ok(practice.includes('current.prompt.indexOf("___")'),"Sentence gap must be filled directly");
assert.ok(practice.includes('practiceStrudliReaction')&&css.includes("@keyframes practiceMascotBounce"),"Strudli response must animate on correctness");
assert.ok(practice.includes('feedbackSound("wrong"')&&practice.includes('feedbackSound("correct"'),"Sound effects must trigger from the user's answer tap");
assert.ok(practice.includes('practiceNextDock')&&baseCss.includes(".practiceNextDock"),"Accessible mobile next button must remain anchored");
assert.ok(!practice.includes("XP</span>")&&!practice.includes('className="practiceCombo"')&&!practice.includes("ГРАЙ · ВЧИСЯ"),"Unwanted XP and service copy must not reappear");
assert.ok(!practice.includes('placeholder={mode==="verbs"?"lernst":"dem"}'),"Input placeholders must not reveal misleading example forms");
assert.ok(practice.includes('onModeChange?.(next)')&&practice.includes('onModeChange?.(null)'),"Context helper must follow current game");
for(const name of ["section","game","dictionary","search","sentences","favorites","lesen","audio","practice","backup","practice-verbs","practice-cases","practice-dialogues","practice-listening","practice-sentence"]){
 assert.ok(help.includes(name+":")||help.includes('"'+name+'":'), "Missing contextual section tutorial: "+name);
}
assert.ok(app.includes('<StrudliSectionHelp')&&app.includes('setSectionHelpOpen(true)')&&app.includes('className="back strudliSectionHelpLaunch"'),"A tappable Strudli must open section-specific help");
assert.ok(app.includes('onModeChange={setPracticeHelpMode}'),"Practice-specific guide must follow selected mode");
assert.ok(help.includes('e.key==="Escape"')&&help.includes('role="dialog" aria-modal="true"'),"Help must be dismissible and accessible");
assert.ok(home.includes('loading={index<2?"eager":"lazy"}')&&home.includes('fetchPriority={index<2?"high":"auto"}'),"First two homepage photos must load with high priority");
assert.ok(home.includes('coverFallbacks')&&home.includes('onError={e=>{const img=e.currentTarget;'),"Homepage covers must have bundled fallbacks");
assert.ok(topics.includes('loading={index<2?"eager":"lazy"}')&&topics.includes('const fallback=section.id'),"Subtopic covers must also recover");
assert.ok(photoCss.includes('strudliLandingTopicPlaceholder')&&photoCss.includes('.strudliLandingTopicCover.isLoaded'),"A clear category illustration must show while photos load");
assert.ok(html.includes('rel="preload" as="image" href="/strudli/topic-food-breakfast.jpg"')&&html.includes('rel="preload" as="image" href="/strudli/topic-home-livingroom.jpg"'),"Above-fold cover assets must be preloaded");
assert.ok(pkg.scripts["check:all"].includes("check:stage16"),"Feature tests must run in release CI");
console.log("Stage 16 QA PASS — context-sensitive Strudli, opt-in session flow, inline answers, reactions, sounds, eager images, local fallbacks.");
