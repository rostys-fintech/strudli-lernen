// End-to-end security run against the REAL production build.
// Serves dist/ with the exact headers and rewrites from vercel.json, mounts the two API functions
// (in-memory store, AI Gateway mocked), then attacks the app in Chromium.
// Usage (CI): node scripts/security-e2e.mjs dist reports/screens/security
import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";

process.env.STRUDLI_TEST_MEMORY_STORE = "1"; delete process.env.VERCEL; process.env.AI_GATEWAY_API_KEY = "e2e-fake";
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  if (String(url).startsWith("https://ai-gateway.vercel.sh/")) {
    const asked = JSON.parse(init.body).messages[1].content;
    const content = JSON.stringify({ translation: "Перевірений тестовий переклад: " + asked.replace(/<\/?german>/g, ""), words: [{ de: "Termin", meaning: "der Termin — запис, прийом" }], grammar: "Модальне дієслово стоїть на 2-му місці, інфінітив — у кінці.", example: { de: "Ich möchte einen Termin.", tr: "Я хотів би записатися." } });
    return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { headers: { "content-type": "application/json" } });
  }
  return realFetch(url, init);
};
const { default: account } = await import("../api/account.js");
const { default: ai } = await import("../api/strudli-ai.js");

const [distArg, outArg] = process.argv.slice(2);
const out = outArg || "reports/screens/security"; fs.mkdirSync(out, { recursive: true });
const vercel = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
const toRegex = (src) => new RegExp("^" + src.replace(/\(\.\*\)/g, "(.*)") + "$");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".webmanifest": "application/manifest+json", ".avif": "image/avif", ".woff2": "font/woff2", ".srt": "text/plain" };

function serve(root, port) {
  // HTTPS like production when a test certificate is provided (the __Host- session cookie needs a secure origin).
  const tls = process.env.E2E_TLS_KEY && process.env.E2E_TLS_CERT ? { key: fs.readFileSync(process.env.E2E_TLS_KEY), cert: fs.readFileSync(process.env.E2E_TLS_CERT) } : null;
  const create = (handler) => (tls ? https.createServer(tls, handler) : http.createServer(handler));
  const server = create(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    for (const rule of vercel.headers) if (toRegex(rule.source).test(url.pathname)) for (const h of rule.headers) res.setHeader(h.key, h.value);
    if (url.pathname === "/api/account") return account(req, res);
    if (url.pathname === "/api/strudli-ai") return ai(req, res);
    let file = path.join(root, decodeURIComponent(url.pathname));
    if (!file.startsWith(path.resolve(root))) { res.statusCode = 400; return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      const rewrite = vercel.rewrites.find((r) => toRegex(r.source.replace("((?!assets/|api/).*)", "(?!assets/|api/)(.*)")).test(url.pathname));
      const looksLikeFile = /\.[a-z0-9]{2,6}$/i.test(url.pathname);
      if (rewrite && !looksLikeFile) file = path.join(root, "index.html"); else { res.statusCode = 404; return res.end("not found"); }
    }
    res.setHeader("Content-Type", TYPES[path.extname(file)] || "application/octet-stream");
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((r) => server.listen(port, "127.0.0.1", () => r(server)));
}

const dist = path.resolve(distArg || "dist");
const failures = [], notes = [];
const fail = (m) => { failures.push(m); console.log("  ✗", m); };
const pass = (m) => { notes.push(m); console.log("  ✓", m); };
const server = await serve(dist, 4180);
const scheme = process.env.E2E_TLS_KEY ? "https" : "http";
const base = `${scheme}://localhost:4180`;

// 1. Headers on the real build
{
  const r = await realFetch(base + "/");
  const csp = r.headers.get("content-security-policy") || "";
  for (const need of ["script-src 'self'", "frame-ancestors 'self'", "object-src 'none'"]) csp.includes(need) ? pass("CSP has " + need) : fail("CSP missing " + need);
  for (const h of ["strict-transport-security", "x-content-type-options", "x-frame-options", "referrer-policy", "permissions-policy"]) r.headers.get(h) ? pass("header " + h) : fail("missing header " + h);
  const html = await r.text();
  /<script(?![^>]*\bsrc=)[^>]*>/i.test(html) ? fail("inline <script> in index.html would be blocked by CSP") : pass("no inline scripts in index.html");
}

// Real deployments are HTTPS; locally the __Host-/Secure session cookie needs localhost treated as a secure origin.
const browser = await chromium.launch({ channel: "chromium", args: ["--mute-audio", "--use-fake-ui-for-media-stream", "--unsafely-treat-insecure-origin-as-secure=http://localhost:4180", "--ignore-certificate-errors"] });
const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "uk-UA" });
await ctx.addInitScript(() => {
  window.__csp = []; document.addEventListener("securitypolicyviolation", (e) => window.__csp.push(e.violatedDirective + " " + e.blockedURI));
  try { localStorage.setItem("strudli-onboarding-done", "1"); } catch {}
});
const page = await ctx.newPage();
const pageErrors = []; page.on("pageerror", (e) => pageErrors.push(String(e)));
const shot = async (name) => { await page.waitForTimeout(600); await page.screenshot({ path: `${out}/${name}.png` }); };
const skip = async () => { for (const re of [/Пропустити|Skip/i, /Закрити|Close/i]) { const b = page.getByRole("button", { name: re }).first(); if (await b.isVisible().catch(() => false)) await b.click().catch(() => {}); } };
const nav = async (re) => { await page.locator("nav.navigation button", { hasText: re }).first().click(); await page.waitForTimeout(900); await skip(); };
const step = async (name, fn) => { try { await fn(); } catch (e) { fail(name + ": " + String(e).split("\n")[0]); await page.screenshot({ path: `${out}/error-${name}.png` }).catch(() => {}); } };

await page.goto(base + "/"); await page.waitForTimeout(1500); await skip();
await shot("01-home");

// 2. Every main screen under the production CSP
await step("screens", async () => {
  for (const [re, name] of [[/Аудіо|Audio/, "02-audio"], [/Історії|Stories/, "03-stories"], [/Практика|Practice/, "04-practice"], [/Прогрес|Progress/, "05-progress"], [/Теми|Topics/, "06-topics"]]) { await nav(re); await shot(name); }
});

// 3. AI tutor + speech check on the Audio screen
await step("ai-explain", async () => {
  await nav(/Аудіо|Audio/);
  await page.getByRole("button", { name: /Strudli пояснює|Strudli explains/ }).first().click();
  await page.locator(".strudliExplainCard").waitFor({ timeout: 8000 });
  const t = await page.locator(".strudliExplainTranslation").innerText();
  t.includes("Перевірений тестовий переклад") ? pass("AI explanation rendered as text") : fail("AI explanation missing");
  await page.locator(".strudliExplainCard").scrollIntoViewIfNeeded(); await shot("07-audio-strudli-explains");
});

// 4. Account: register, recovery code, save, logout, login, load — through the real UI
await step("account", async () => {
  await nav(/Прогрес|Progress/);
  const panel = page.locator(".strudliAccount"); await panel.waitFor({ timeout: 8000 }); await panel.scrollIntoViewIfNeeded();
  await shot("08-account-signed-out");
  await panel.getByRole("tab", { name: /Створити акаунт|Create account/ }).click();
  await panel.getByLabel(/Ім’я користувача|Username/).fill("e2e.learner");
  await panel.locator("input[type=password]").fill("password123");
  await panel.locator("form button[type=submit]").click();
  await panel.locator(".strudliAccountNotice.error").waitFor({ timeout: 8000 }); pass("weak password refused in UI");
  await panel.locator("input[type=password]").fill("Brezel-und-Kaffee-24");
  await panel.locator("form button[type=submit]").click();
  await panel.locator(".strudliRecovery code").waitFor({ timeout: 8000 }); pass("recovery code shown once");
  await shot("09-account-recovery-code");
  await panel.getByRole("button", { name: /Я зберіг код|I saved it/ }).click();
  await page.waitForTimeout(300);
  const before = await panel.locator(".strudliAccountNotice").innerText().catch(() => "");
  await panel.getByRole("button", { name: /Зберегти прогрес в акаунт|Save progress/ }).click();
  // Poll from Node (no in-page eval): the strict CSP forbids string evaluation in the page.
  for (let t = 0; t < 80; t++) { const now = await panel.locator(".strudliAccountNotice").innerText().catch(() => ""); if (now && now !== before) break; await page.waitForTimeout(100); }
  const notice = await panel.locator(".strudliAccountNotice").innerText();
  (await panel.locator(".strudliAccountNotice.ok").count()) ? pass("progress saved to account") : fail("save progress: " + notice);
  await shot("10-account-signed-in");
  const cookies = await ctx.cookies(); const sid = cookies.find((c) => c.name === "__Host-strudli_sid");
  sid && sid.httpOnly && sid.secure && sid.sameSite === "Strict" ? pass("session cookie HttpOnly+Secure+Strict") : fail("session cookie flags wrong");
  (await page.evaluate(() => document.cookie)).includes("strudli_sid") ? fail("session cookie readable from JS") : pass("session cookie not readable from JS");
  await panel.getByRole("button", { name: /Вийти|Sign out/ }).click();
  await panel.getByRole("tab", { name: /Увійти|Sign in/ }).waitFor();
  pass("logout works");
});

// 5. Cross-site attack from another origin cannot use the session or the AI
await step("csrf", async () => {
  const evil = await realFetch(base + "/api/account", { method: "POST", headers: { "content-type": "application/json", origin: "https://evil.example" }, body: JSON.stringify({ action: "load" }) });
  evil.status === 403 ? pass("cross-site POST blocked (403)") : fail("cross-site POST status " + evil.status);
  const form = await realFetch(base + "/api/strudli-ai", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", origin: base }, body: "text=Hallo" });
  form.status === 403 ? pass("form-encoded AI call blocked") : fail("form AI call status " + form.status);
});

// 6. XSS attempts: poisoned progress file and story URL
await step("xss", async () => {
  const payload = { format: "wortwelt-progress", version: 1, exportedAt: "x", values: { "wortwelt-custom": [{ id: "x", de: "<img src=x onerror=window.__xss=1>", uk: "<svg onload=window.__xss=2>", en: "\"><script>window.__xss=3</script>" }], "strudli-lesen-saved": [{ term: "<img src=x onerror=window.__xss=4>", uk: "a", en: "b" }] } };
  fs.writeFileSync("/tmp/poison.json", JSON.stringify(payload));
  await nav(/Прогрес|Progress/);
  await page.locator('input[type=file]').setInputFiles("/tmp/poison.json");
  await page.waitForTimeout(800); await page.reload(); await page.waitForTimeout(1200); await skip();
  for (const re of [/Історії|Stories/, /Практика|Practice/]) await nav(re);
  await page.goto(base + "/lesen-pilot/index.html?embed=1&story=%3Cimg%20src%3Dx%20onerror%3Dwindow.__xss%3D5%3E&lang=%22%3E%3Csvg%20onload%3Dwindow.__xss%3D6%3E"); await page.waitForTimeout(1500);
  const x = await page.evaluate(() => window.__xss);
  x === undefined ? pass("no script ran from poisoned progress or story URL") : fail("XSS executed: " + x);
});

// 7. Story player word sheet: Strudli explains the sentence
await step("player-ai", async () => {
  await page.goto(base + "/lesen-pilot/index.html?embed=1&lang=uk&story=bremen");
  await page.waitForFunction(() => !document.getElementById("centerPlay").disabled, null, { timeout: 15000 });
  await page.locator("#captions button").nth(2).click();
  await page.locator("#aiExplainButton").click();
  await page.locator(".aiTranslation").waitFor({ timeout: 8000 }); pass("player AI explanation rendered");
  await shot("11-player-strudli-explains");
});

const csp = await page.evaluate(() => window.__csp || []);
csp.length ? fail("CSP violations: " + [...new Set(csp)].slice(0, 8).join(" | ")) : pass("no CSP violations on any screen");
pageErrors.length ? fail("page errors: " + pageErrors.slice(0, 5).join(" | ")) : pass("no page errors");
await browser.close(); server.close();

// 8. Public build: private story files must be gone
{
  const work = "/tmp/strudli-public-check"; fs.rmSync(work, { recursive: true, force: true }); fs.mkdirSync(work);
  fs.cpSync(dist, path.join(work, "dist"), { recursive: true });
  execFileSync("node", [path.resolve("scripts/strip-private-stories.mjs")], { cwd: work, env: { ...process.env, STRUDLI_PUBLIC_BUILD: "1" } });
  const s2 = await serve(path.join(work, "dist"), 4181);
  const cat = await (await realFetch(`${scheme}://localhost:4181`+"/lesen-pilot/catalog.json")).json();
  cat.stories.every((s) => s.access === "public") ? pass("public catalog lists only public stories") : fail("private story in public catalog");
  for (const p of ["/lesen-pilot/story-data.json", "/lesen-pilot/media/storm.webp", "/lesen-pilot/audio/a1_conrad.mp3", "/lesen-pilot/video/a1_conrad.mp4"]) {
    const st = (await realFetch(`${scheme}://localhost:4181`+"" + p)).status; st === 404 ? pass("public build: " + p + " → 404") : fail("public build serves " + p + " (" + st + ")");
  }
  const ok = (await realFetch(`${scheme}://localhost:4181`+"/lesen-pilot/stories/bremen/story-data.json")).status;
  ok === 200 ? pass("public story still served") : fail("public story missing (" + ok + ")");
  s2.close();
}

fs.writeFileSync(`${out}/report.json`, JSON.stringify({ failures, passed: notes }, null, 1));
console.log(failures.length ? `Security E2E: ${failures.length} FAILED` : `Security E2E PASS: ${notes.length} checks`);
process.exit(failures.length ? 1 : 0);
