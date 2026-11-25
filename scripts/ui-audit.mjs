// Full UI audit of the built Strudli app on a phone screen: screenshots of every main screen and an
// automatic colour-contrast check (axe-core, WCAG AA) on each of them. Read-only.
// Usage: node scripts/ui-audit.mjs http://127.0.0.1:4173 reports/ui-audit/<name>
import {chromium} from "playwright";
import {mkdirSync, writeFileSync} from "node:fs";
import {createRequire} from "node:module";
const require = createRequire(import.meta.url);
const AXE = require.resolve("axe-core/axe.min.js");

const [base, out] = process.argv.slice(2);
mkdirSync(out, {recursive: true});
const browser = await chromium.launch({args: ["--autoplay-policy=no-user-gesture-required", "--mute-audio"]});
const ctx = await browser.newContext({viewport: {width: 390, height: 844}, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "uk-UA"});
await ctx.addInitScript(() => { try { localStorage.setItem("strudli-onboarding-seen", "1"); } catch {} });
const page = await ctx.newPage();
const errors = [], results = [];
page.on("pageerror", e => errors.push(String(e)));
let n = 0;

async function contrast(target, where) {
  try {
    await target.addScriptTag({path: AXE});
    const r = await target.evaluate(async () => {
      const res = await window.axe.run(document, {runOnly: {type: "rule", values: ["color-contrast"]}, resultTypes: ["violations"]});
      return res.violations.flatMap(v => v.nodes.map(nd => {
        const d = (nd.any[0] || {}).data || {};
        return {html: nd.html.slice(0, 160), target: nd.target.join(" "), fg: d.fgColor, bg: d.bgColor, ratio: d.contrastRatio, need: d.expectedContrastRatio, text: (document.querySelector(nd.target[0])?.textContent || "").trim().slice(0, 70)};
      }));
    });
    return r.map(x => ({...x, where}));
  } catch (e) { return [{where, error: String(e).split("\n")[0]}]; }
}
async function shot(name, {full = false, frame = null} = {}) {
  await page.waitForTimeout(600);
  const file = `${String(++n).padStart(2, "0")}-${name}.png`;
  await page.screenshot({path: `${out}/${file}`, fullPage: full});
  const issues = await contrast(frame || page, name);
  results.push({screen: name, file, issues});
}
const btn = (re) => page.getByRole("button", {name: re}).first();
const tap = async (re) => { const b = btn(re); await b.waitFor({timeout: 8000}); await b.click(); await page.waitForTimeout(700); };
const closeOverlays = async () => {
  for (const re of [/Пропустити|Skip/i, /Закрити|Close/i]) { const b = btn(re); if (await b.isVisible().catch(() => false)) await b.click().catch(() => {}); }
};
const step = async (name, fn) => { try { await fn(); } catch (e) { errors.push(name + ": " + String(e).split("\n")[0]); await page.screenshot({path: `${out}/error-${name}.png`}).catch(() => {}); } };
const home = async () => { await page.goto(base + "/"); await page.waitForTimeout(1300); await closeOverlays(); };

await step("home", async () => { await home(); await shot("home", {full: true}); });
await step("topics", async () => {
  await home(); await page.locator(".strudliLandingTopicCard, .strudliSectionCard, [class*=TopicCard]").first().click(); await shot("topic-chooser", {full: true});
  const start = page.locator(".allFoodButton, .topicStart, button:has-text('Почати'), button:has-text('Start')").first();
  if (await start.isVisible().catch(() => false)) { await start.click(); await page.waitForTimeout(1500); await shot("word-card"); await page.locator(".answers button").first().click(); await shot("word-card-answer"); }
});
await step("audio", async () => { await home(); await tap(/^Аудіо$|^Audio$|Слухати/); await shot("audio", {full: true}); });
await step("dictionary", async () => { await home(); await tap(/Словник|Dictionary/); await shot("dictionary"); });
await step("practice", async () => {
  await home(); await tap(/Практика|Practice/); await shot("practice-start", {full: true});
  await tap(/Швидкий квіз|Quick quiz/); await shot("practice-games", {full: true});
  for (let i = 0; i < 6; i++) {
    await page.locator(".practiceModeCard").nth(i).click(); await page.waitForTimeout(1000);
    const title = (await page.locator(".practiceModeCard, h1, h2").first().innerText().catch(() => "game")).slice(0, 20);
    await shot("practice-game-" + (i + 1));
    const choice = page.locator(".practiceChoice").first();
    if (await choice.isVisible().catch(() => false)) { await choice.click(); await shot("practice-game-" + (i + 1) + "-answered"); }
    await page.goto(base + "/"); await page.waitForTimeout(900); await closeOverlays(); await tap(/Практика|Practice/); await tap(/Швидкий квіз|Quick quiz/);
  }
});
await step("arena", async () => {
  await home(); await tap(/Практика|Practice/); await page.locator(".practiceArenaLaunch").click(); await page.waitForTimeout(1200); await shot("arena-menu", {full: true});
  await page.locator(".arenaRounds button").first().click(); await page.waitForTimeout(1500); await shot("arena-question");
  await page.locator(".arenaAnswers button, .arenaAnswer").first().click(); await shot("arena-answer");
});
await step("lesen", async () => {
  await home(); await page.locator("nav.navigation button", {hasText: /Історії|Stories/}).click(); await page.waitForTimeout(1200); await shot("lesen-hub", {full: true});
  const story = page.locator(".lesenStoryTile").first(); await story.click(); await shot("lesen-reader", {full: true});
  await home(); await page.locator(".strudliSpotlight--story").click(); await page.waitForTimeout(3000);
  const fh = await page.locator(".lesenPilotFrame").elementHandle(); const frame = await fh.contentFrame();
  await frame.locator("#centerPlay").click().catch(() => {}); await page.waitForTimeout(3000);
  await shot("lesen-player", {frame});
  await frame.locator("#captions button").nth(2).click().catch(() => {}); await page.waitForTimeout(900);
  await shot("lesen-word", {frame});
});
await step("ask", async () => {
  await home(); await page.locator(".strudliSpotlight--ask").click(); await page.waitForTimeout(900); await shot("ask", {full: true});
  await page.locator(".strudliAskExamples button").first().click(); await page.waitForTimeout(2500); await shot("ask-answer", {full: true});
});
await step("audio-story", async () => { await home(); await tap(/^Аудіо$|^Audio$/); await page.locator(".strudliAudioStoryRow button").nth(1).click(); await page.waitForTimeout(3000); await shot("audio-opens-story"); });
await step("progress", async () => { await home(); await tap(/Прогрес|Progress/); await shot("progress", {full: true}); });

const all = results.flatMap(r => r.issues.filter(i => !i.error));
const md = ["# UI audit", "", `Screens: ${results.length}, contrast problems: ${all.length}, page errors: ${errors.length}`, "",
  ...results.map(r => `## ${r.screen} (${r.file})\n` + (r.issues.length ? r.issues.map(i => i.error ? `- check failed: ${i.error}` : `- ${i.ratio}:1 (need ${i.need}) fg ${i.fg} on ${i.bg} — "${i.text}" — \`${i.target}\``).join("\n") : "- no contrast problems")),
  "", "## Errors", ...errors.map(e => "- " + e)];
writeFileSync(`${out}/README.md`, md.join("\n") + "\n");
writeFileSync(`${out}/contrast.json`, JSON.stringify({results, errors}, null, 1));
console.log(md.slice(0, 4).join("\n"));
await browser.close();
