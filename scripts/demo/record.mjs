// Records the demo walkthrough of the REAL production build (no mocks): the app is served with the
// production headers, the two API functions run for real (Gemini / AI Gateway when a key is set,
// otherwise the app's genuine offline fallback). Frames come from Chrome's own screencast at device
// resolution with wall-clock timestamps, so the video is sharp, steady and in sync with our timeline.
// Usage: node scripts/demo/record.mjs dist demo-build
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

process.env.STRUDLI_TEST_MEMORY_STORE = "1"; delete process.env.VERCEL;
const { default: account } = await import("../../api/account.js");
const { default: ai } = await import("../../api/strudli-ai.js");
const [distArg, outArg] = process.argv.slice(2);
const dist = path.resolve(distArg || "dist"), out = path.resolve(outArg || "demo-build");
const framesDir = path.join(out, "frames"); fs.rmSync(framesDir, { recursive: true, force: true }); fs.mkdirSync(framesDir, { recursive: true });
const cfg = JSON.parse(fs.readFileSync(new URL("./segments.json", import.meta.url), "utf8"));
const durations = JSON.parse(fs.readFileSync(path.join(out, "voice", "durations.json"), "utf8"));
const vercel = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
const rx = (src) => new RegExp("^" + src.replace(/\(\.\*\)/g, "(.*)") + "$");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".avif": "image/avif", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json" };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  for (const rule of vercel.headers) if (rx(rule.source).test(url.pathname)) for (const h of rule.headers) res.setHeader(h.key, h.value);
  if (url.pathname === "/api/account") return account(req, res);
  if (url.pathname === "/api/strudli-ai") return ai(req, res);
  let file = path.join(dist, decodeURIComponent(url.pathname));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { if (/\.[a-z0-9]{2,6}$/i.test(url.pathname)) { res.statusCode = 404; return res.end(); } file = path.join(dist, "index.html"); }
  res.setHeader("Content-Type", TYPES[path.extname(file)] || "application/octet-stream");
  const stat = fs.statSync(file), range = req.headers.range;
  if (range && /audio|video/.test(res.getHeader("Content-Type"))) {
    const [a, b] = range.replace("bytes=", "").split("-"); const start = Number(a), end = b ? Number(b) : stat.size - 1;
    res.statusCode = 206; res.setHeader("Content-Range", `bytes ${start}-${end}/${stat.size}`); res.setHeader("Accept-Ranges", "bytes"); res.setHeader("Content-Length", end - start + 1);
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.setHeader("Content-Length", stat.size); fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(4200, "127.0.0.1", r));
const base = "http://localhost:4200";

// Google Chrome first: it plays the story's H.264 video like phones do (open-source Chromium cannot).
const launchArgs = { args: ["--autoplay-policy=no-user-gesture-required", "--mute-audio", "--unsafely-treat-insecure-origin-as-secure=http://localhost:4200"] };
const browser = await chromium.launch({ ...launchArgs, channel: "chrome" }).catch((e) => {
  console.log("Chrome not available, using Chromium:", e.message.split("\n")[0]);
  return chromium.launch({ ...launchArgs, channel: "chromium" });
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "en-US" });
await ctx.addInitScript(() => { try { localStorage.setItem("wortwelt-ui-lang", "en"); } catch {} });
const page = await ctx.newPage();
const timeline = { segments: [], sfx: [], aiLive: false, notes: [], frames: [] };
const now = () => Date.now() / 1000;
const wait = (ms) => page.waitForTimeout(ms);
const frame = () => page.frameLocator(".lesenPilotFrame");
const nav = async (re) => { await page.locator("nav.navigation button", { hasText: re }).first().click(); await wait(900); };
const fnv = (t) => { let h = 0x811c9dc5; for (const b of Buffer.from(t.normalize("NFC").trim(), "utf8")) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, "0"); };
const tap = async (locator) => { await locator.scrollIntoViewIfNeeded().catch(() => {}); await wait(250); await locator.click(); };
const smoothScroll = async (dy, steps = 18) => { for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, dy / steps); await wait(28); } };

// Warm up before filming: load the app once so nothing flashes white on camera.
await page.goto(base + "/"); await wait(2500);

// Chrome screencast at device resolution (780x1688) with its own timestamps.
const cdp = await ctx.newCDPSession(page);
let frameNo = 0, recording = true;
cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
  if (recording) {
    const name = `${String(frameNo++).padStart(6, "0")}.jpg`;
    fs.writeFileSync(path.join(framesDir, name), Buffer.from(data, "base64"));
    timeline.frames.push([name, metadata.timestamp, now()]); // [file, Chrome swap time, our receive time]
  }
  await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
});
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1 });
await wait(600);
timeline.start = now();

const scenes = {
  async home() {
    await wait(900); await smoothScroll(300); await wait(900); await smoothScroll(-300); await wait(500);
    await tap(page.locator(".langSwitch button", { hasText: "UA" })); await wait(2400);
    await tap(page.locator(".langSwitch button", { hasText: "EN" })); await wait(600);
  },
  async cards() {
    await tap(page.locator(".strudliLandingTopicCard").first()); await wait(1300);
    await tap(page.locator(".allFoodButton").first()); await wait(1700);
    const options = page.locator(".answers button.answerOption");
    for (let i = 0; i < 3; i++) { if (await page.locator(".game--answered").count()) break; await tap(options.nth(i)); await wait(1300); }
  },
  async story() {
    await nav(/Stories/); await wait(1200);
    await tap(page.getByRole("button", { name: /Bremer/ }).first()); await wait(2600);
    await frame().locator("#centerPlay").click();
    await wait(1500);
    // Exact audio start = now − currentTime, so the mixed narrator matches the highlighted words.
    const ct = await frame().locator("#narration").evaluate((a) => a.currentTime).catch(() => 0);
    timeline.sfx.push({ file: "public/lesen-pilot/stories/bremen/audio/a1_conrad.mp3", at: now() - ct, volume: 0.32, id: "story" });
  },
  async word() {
    await frame().locator("#captions button").nth(3).click();
    const s = timeline.sfx.find((x) => x.id === "story"); if (s) s.until = now();
    await wait(800);
  },
  async ai() {
    // The visible "Not clear? Ask Strudli" button under the subtitles explains the sentence being read.
    await frame().locator("#lookupClose").click().catch(() => {}); await wait(700);
    await frame().locator("#askStrudli").click();
    await frame().locator("#aiExplainResult.aiTold").waitFor({ timeout: 25000 });
    timeline.aiLive = (await frame().locator(".aiExplainResult ul, .aiExplainResult .aiGrammar").count()) > 0;
    await wait(1200); await frame().locator("#aiExplainResult").scrollIntoViewIfNeeded();
  },
  async ask() {
    await tap(page.locator(".brandHomeLink")); await wait(900);
    await tap(page.locator(".strudliSpotlight--ask")); await wait(1100);
    const box = page.locator("#strudli-ask-input"); await box.click();
    await box.pressSequentially("Bitte bringen Sie zum Termin Ihren Pass und die Meldebescheinigung mit.", { delay: 32 });
    await wait(400); await tap(page.locator(".strudliAskGo"));
    await page.locator(".strudliTold, .strudliExplainCard.offline").first().waitFor({ timeout: 25000 }).catch(() => {});
    // Let the viewer read the whole answer: bring the card to the top and hold it.
    await wait(900);
    await page.locator(".strudliTold").first().evaluate((e) => e.scrollIntoView({ behavior: "smooth", block: "start" })).catch(() => {});
    await wait(4200);
  },
  async phrases() {
    await nav(/Audio/); await wait(700);
    await page.locator(".strudliAudioPlayer").scrollIntoViewIfNeeded().catch(() => {}); await wait(500);
    await tap(page.getByRole("button", { name: /Next phrase/ })); await wait(700);
    await tap(page.getByRole("button", { name: /Next phrase/ })); await wait(900);
  },
  async phrasesTail() {
    const text = (await page.locator(".strudliAudioGermanPhrase").innerText()).trim();
    const clip = `public/audio/phrases/${fnv(text)}.mp3`;
    await tap(page.getByRole("button", { name: /Play German phrase|Listen/ }).first());
    if (fs.existsSync(clip)) timeline.sfx.push({ file: clip, at: now() + 0.15, volume: 1.0, id: "phrase" });
    await wait(3600);
  },
  async arena() {
    await nav(/Practice/); await wait(600);
    await tap(page.locator(".practiceArenaLaunch")); await wait(1400);
    await tap(page.locator(".arenaRounds button").first()); await wait(2400);
    await tap(page.locator(".arenaAnswers button").first()); await wait(1800);
  },
  async account() {
    await nav(/Progress/); await wait(900); await smoothScroll(260); await wait(500);
    const panel = page.locator(".strudliAccount"); await panel.scrollIntoViewIfNeeded(); await wait(700);
    await panel.getByRole("tab", { name: /Create account/ }).click(); await wait(500);
    await panel.getByLabel(/Username/).pressSequentially("olena.ulm", { delay: 70 });
    await panel.locator("input[type=password]").pressSequentially("Brezel-und-Kaffee-24", { delay: 45 });
    await panel.locator("form button[type=submit]").click();
    await panel.locator(".strudliRecovery code").waitFor({ timeout: 10000 }); await wait(1600);
    await panel.getByRole("button", { name: /I saved it/ }).click(); await wait(500);
    await panel.getByRole("button", { name: /Save progress to account/ }).click(); await wait(1500);
  },
};

for (const seg of cfg.scenes.filter((s) => s.kind === "demo")) {
  const start = now(); timeline.segments.push({ id: seg.id, start });
  try { await scenes[seg.id](); } catch (e) { timeline.notes.push(seg.id + ": " + String(e).split("\n")[0]); console.log("scene problem", seg.id, e.message); }
  const minEnd = start + Math.max(durations[seg.id], durations[seg.id + "_alt"] || 0) + 1.2;
  while (now() < minEnd) await wait(80);
  if (seg.id === "phrases") { try { await scenes.phrasesTail(); } catch (e) { timeline.notes.push("phrasesTail: " + e.message); } }
  if (seg.id === "story") await wait(6000); // let the story play on its own: narrator + highlighting
  timeline.segments[timeline.segments.length - 1].end = now();
}
await wait(700);
timeline.end = now();
recording = false;
await cdp.send("Page.stopScreencast").catch(() => {});
await ctx.close(); await browser.close(); server.close();
fs.writeFileSync(path.join(out, "timeline.json"), JSON.stringify(timeline, null, 1));
console.log("recorded", (timeline.end - timeline.start).toFixed(1), "s,", timeline.frames.length, "frames; AI live:", timeline.aiLive, "; notes:", timeline.notes);
