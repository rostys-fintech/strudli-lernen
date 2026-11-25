// Review screenshots of the built Strudli app (run in CI against `vite preview`).
// Usage: node scripts/ui-screens.mjs http://127.0.0.1:4173 reports/screens/<name>
import {chromium} from "playwright";
import {mkdirSync,writeFileSync} from "node:fs";

const [base, out] = process.argv.slice(2);
mkdirSync(out, {recursive: true});
const log = [];
const browser = await chromium.launch({args: ["--autoplay-policy=no-user-gesture-required", "--mute-audio"]});
const page = await browser.newPage({viewport: {width: 390, height: 844}, deviceScaleFactor: 2, isMobile: true, hasTouch: true});
const errors = [];
page.on("pageerror", e => errors.push(String(e)));
const shot = async (name) => { await page.waitForTimeout(700); await page.screenshot({path: `${out}/${name}.png`}); log.push(name); };
const tap = async (re, opts = {}) => {
  const el = page.getByRole("button", {name: re}).first();
  await el.waitFor({timeout: opts.timeout || 8000});
  await el.click();
};
const skipOverlays = async () => {
  for (const re of [/Пропустити|Skip/i, /Закрити|Close/i]) {
    const el = page.getByRole("button", {name: re}).first();
    if (await el.isVisible().catch(() => false)) await el.click().catch(() => {});
  }
};

await page.goto(base + "/");
await page.waitForTimeout(1500);
await skipOverlays();

const step = async (name, fn) => { try { await fn(); } catch (e) { errors.push(name + ": " + String(e).split("\n")[0]); await page.screenshot({path: `${out}/error-${name}.png`}).catch(() => {}); } };

// Practice → Arena
await step("arena", async () => {
await tap(/Практика|Practice|Spielen|Грати/i);
await skipOverlays();
await shot("01-practice-formats");
await tap(/Арена/);
await page.waitForTimeout(1500);
await shot("02-arena-rounds");
await tap(/Який артикль/);
await page.waitForTimeout(1500);
await shot("03-arena-articles-question");
await page.locator(".arenaAnswer").first().click();
await shot("04-arena-articles-reveal");
await page.locator(".arenaTop .arenaIcon").first().click();
await tap(/Яке закінчення/);
await page.waitForTimeout(1200);
await shot("05-arena-endings-question");
await page.locator(".arenaAnswer").nth(1).click();
await shot("06-arena-endings-reveal");
await page.locator(".arenaTop .arenaIcon").first().click();
const storyCard = page.getByRole("button", {name: /З історії/}).first();
if (await storyCard.isVisible().catch(() => false)) {
  await storyCard.click(); await page.waitForTimeout(1200); await shot("07-arena-story-question");
  await page.locator(".arenaTop .arenaIcon").first().click();
}

});

// Lesen hub → Bremen story
await step("lesen", async () => {
await page.goto(base + "/");
await page.waitForTimeout(1200);
await skipOverlays();
await tap(/Історії|Stories/i);
await page.waitForTimeout(1500);
await shot("08-lesen-hub");
const bremen = page.getByRole("button", {name: /Bremer/}).first();
if (await bremen.isVisible().catch(() => false)) {
  await bremen.click();
  await page.waitForTimeout(2500);
  const frame = page.frameLocator(".lesenPilotFrame");
  await frame.locator("#centerPlay").click().catch(() => {});
  await page.waitForTimeout(3500);
  await shot("09-lesen-bremen-player");
  await frame.locator("#captions button").nth(1).click().catch(() => {});
  await page.waitForTimeout(800);
  await shot("10-lesen-word-save");
}
});

// English mode (judges): home, practice, arena, Lesen
await step("english", async () => {
  await page.evaluate(() => localStorage.setItem("wortwelt-ui-lang", "en"));
  await page.goto(base + "/"); await page.waitForTimeout(1500); await skipOverlays();
  await shot("11-en-home");
  await tap(/Practice|Spielen/i); await skipOverlays(); await shot("12-en-practice");
  await tap(/Arena/); await page.waitForTimeout(1200); await shot("13-en-arena");
  await page.goto(base + "/"); await page.waitForTimeout(1200); await skipOverlays();
  await tap(/Stories/i); await page.waitForTimeout(1500); await shot("14-en-lesen");
});

writeFileSync(`${out}/report.json`, JSON.stringify({shots: log, errors, at: new Date().toISOString()}, null, 1));
await browser.close();
console.log("screens:", log.length, "page errors:", errors.length);
