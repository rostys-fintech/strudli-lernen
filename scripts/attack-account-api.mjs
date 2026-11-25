// Attack tests for /api/account — run with: STRUDLI_TEST_MEMORY_STORE=1 node scripts/attack-account-api.mjs
// Each block tries a real attack and asserts the API refuses it.
import assert from "node:assert/strict";
import { Readable } from "node:stream";
process.env.STRUDLI_TEST_MEMORY_STORE = "1";
delete process.env.VERCEL;
const { default: handler } = await import("../api/account.js");
const store = await import("../api/_lib/store.js");

const HOST = "strudli.test";
let ipCounter = 0;
async function call({ method = "POST", body, cookie, origin = `https://${HOST}`, type = "application/json", ip, raw } = {}) {
  const payload = raw !== undefined ? raw : body === undefined ? "" : JSON.stringify(body);
  const req = Readable.from(payload ? [Buffer.from(payload)] : []);
  req.method = method;
  req.headers = { host: HOST, "x-forwarded-for": ip || `10.0.${Math.floor(ipCounter / 250)}.${ipCounter++ % 250}` };
  if (origin) req.headers.origin = origin;
  if (type) req.headers["content-type"] = type;
  if (cookie) req.headers.cookie = cookie;
  const res = { statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, end(b) { this.body = b; } };
  await handler(req, res);
  const json = res.body ? JSON.parse(res.body) : null;
  const set = res.headers["set-cookie"];
  const sid = set && /__Host-strudli_sid=([^;]*)/.exec(set)?.[1];
  return { status: res.statusCode, json, headers: res.headers, cookie: sid ? `__Host-strudli_sid=${sid}` : null, setCookie: set };
}
const results = [];
const check = (name, fn) => results.push([name, fn]);
const strong = "Gruene-Brezel-42!";

check("register works, cookie is __Host-, HttpOnly, Secure, SameSite=Strict", async () => {
  const r = await call({ body: { action: "register", name: "olena", password: strong } });
  assert.equal(r.status, 201); assert.match(r.json.recoveryCode, /^[A-Z0-9X]{4}(-[A-Z0-9X]{4}){4}$/);
  for (const flag of ["HttpOnly", "Secure", "SameSite=Strict", "Path=/"]) assert.ok(r.setCookie.includes(flag), flag);
  assert.ok(!/Domain=/i.test(r.setCookie));
  assert.equal(r.headers["cache-control"], "no-store");
});
check("duplicate username refused (no account takeover by re-register)", async () => {
  const r = await call({ body: { action: "register", name: "OLENA", password: "Another-pass-123" } });
  assert.equal(r.status, 409);
});
check("weak, common, name-containing and huge passwords refused", async () => {
  for (const [pw, err] of [["short1", "password_too_short"], ["password123", "password_too_common"], ["aaaaaaaaaaaa", "password_too_common"], ["ivan-is-great-1", "password_contains_name"], ["x".repeat(129), "password_too_long"]]) {
    const r = await call({ body: { action: "register", name: "ivan", password: pw } });
    assert.equal(r.json.error, err, pw);
  }
});
check("username injection / traversal / unicode tricks refused", async () => {
  for (const name of ["../admin", "a", "user:sess:x", "<script>", "ad min", "аdmin", "x".repeat(40), { $ne: 1 }, ["olena"]]) {
    const r = await call({ body: { action: "register", name, password: strong } });
    assert.equal(r.status, 400, JSON.stringify(name));
  }
});
check("CSRF: foreign origin, missing origin, form content-type all blocked", async () => {
  assert.equal((await call({ body: { action: "login", name: "olena", password: strong }, origin: "https://evil.example" })).status, 403);
  assert.equal((await call({ body: { action: "login", name: "olena", password: strong }, origin: null })).status, 403);
  assert.equal((await call({ raw: "action=login&name=olena", type: "application/x-www-form-urlencoded" })).status, 403);
  assert.equal((await call({ body: { action: "login" }, origin: `https://${HOST}.evil.example` })).status, 403);
});
check("wrong password and unknown user give the same answer", async () => {
  const a = await call({ body: { action: "login", name: "olena", password: "Wrong-password-1" } });
  const b = await call({ body: { action: "login", name: "nobody", password: "Wrong-password-1" } });
  assert.equal(a.status, 401); assert.deepEqual(a.json, b.json);
});
check("timing: unknown user costs a real scrypt (no user enumeration by time)", async () => {
  const t = async (name) => { const s = process.hrtime.bigint(); await call({ body: { action: "login", name, password: "Wrong-password-1" } }); return Number(process.hrtime.bigint() - s) / 1e6; };
  const known = await t("olena"), unknown = await t("ghost-user");
  assert.ok(unknown > known * 0.5, `unknown ${unknown.toFixed(0)} ms vs known ${known.toFixed(0)} ms`);
});
check("brute force on one account is stopped after 10 tries even from many IPs", async () => {
  await call({ body: { action: "register", name: "target", password: strong } });
  let last;
  for (let i = 0; i < 12; i++) last = await call({ body: { action: "login", name: "target", password: `Guess-number-${i}` } });
  assert.equal(last.status, 429);
  const real = await call({ body: { action: "login", name: "target", password: strong } });
  assert.equal(real.status, 429, "locked window also blocks the right password");
});
check("password spraying from one IP is stopped", async () => {
  let last;
  for (let i = 0; i < 32; i++) last = await call({ ip: "203.0.113.7", body: { action: "login", name: `user${i}x`, password: "Sommer-2026-ok" } });
  assert.equal(last.status, 429);
});
check("mass registration from one IP is stopped", async () => {
  let last;
  for (let i = 0; i < 7; i++) last = await call({ ip: "198.51.100.9", body: { action: "register", name: `bot${i}abc`, password: strong } });
  assert.equal(last.status, 429);
});
check("session: forged, malformed and missing cookies are rejected", async () => {
  for (const cookie of [undefined, "__Host-strudli_sid=AAAA", "__Host-strudli_sid=" + "A".repeat(43), "__Host-strudli_sid=../../etc/passwd"]) {
    const r = await call({ body: { action: "load" }, cookie });
    assert.equal(r.status, 401);
  }
});
check("save/load progress round trip; other users cannot read it", async () => {
  const me = await call({ body: { action: "login", name: "olena", password: strong } });
  const archive = { format: "wortwelt-progress", version: 1, exportedAt: "x", values: { "wortwelt-daily-goal": 20 } };
  assert.equal((await call({ cookie: me.cookie, body: { action: "save", archive } })).status, 200);
  const other = await call({ body: { action: "register", name: "mallory", password: strong } });
  const stolen = await call({ cookie: other.cookie, body: { action: "load", name: "olena" } });
  assert.equal(stolen.json.archive, null);
  const mine = await call({ cookie: me.cookie, body: { action: "load" } });
  assert.deepEqual(mine.json.archive, archive);
});
check("progress: unknown keys, wrong format, prototype pollution and oversize refused", async () => {
  const me = await call({ body: { action: "login", name: "olena", password: strong } });
  const bad = [
    { format: "x", version: 1, values: {} },
    { format: "wortwelt-progress", version: 1, values: { "evil-key": 1 } },
    JSON.parse('{"format":"wortwelt-progress","version":1,"values":{"__proto__":{"admin":true}}}'),
  ];
  for (const archive of bad) assert.equal((await call({ cookie: me.cookie, body: { action: "save", archive } })).status, 400);
  assert.equal(({}).admin, undefined);
  const big = { format: "wortwelt-progress", version: 1, values: { "wortwelt-custom": "x".repeat(230 * 1024) } };
  assert.equal((await call({ cookie: me.cookie, body: { action: "save", archive: big } })).status, 413);
  const huge = await call({ cookie: me.cookie, raw: JSON.stringify({ action: "save", pad: "y".repeat(300 * 1024) }) });
  assert.equal(huge.status, 413);
  assert.equal((await call({ cookie: me.cookie, raw: "{not json" })).status, 400);
});
check("password change logs out other devices", async () => {
  const a = await call({ body: { action: "register", name: "andrii", password: strong } });
  const b = await call({ body: { action: "login", name: "andrii", password: strong } });
  const changed = await call({ cookie: a.cookie, body: { action: "change-password", password: strong, newPassword: "Neue-Wohnung-77" } });
  assert.equal(changed.status, 200);
  assert.equal((await call({ cookie: b.cookie, body: { action: "load" } })).status, 401, "old device logged out");
  assert.equal((await call({ cookie: changed.cookie, body: { action: "load" } })).status, 200, "this device keeps working");
});
check("recovery code resets password once and is rotated", async () => {
  const r = await call({ body: { action: "register", name: "maria", password: strong } });
  const code = r.json.recoveryCode;
  assert.equal((await call({ body: { action: "recover", name: "maria", recoveryCode: "AAAA-BBBB-CCCC-DDDD-EEEE", newPassword: "Neues-Passwort-9" } })).status, 401);
  const ok = await call({ body: { action: "recover", name: "maria", recoveryCode: code.toLowerCase(), newPassword: "Neues-Passwort-9" } });
  assert.equal(ok.status, 200); assert.notEqual(ok.json.recoveryCode, code);
  assert.equal((await call({ body: { action: "recover", name: "maria", recoveryCode: code, newPassword: "Noch-ein-Pass-1" } })).status, 401, "old code is dead");
  assert.equal((await call({ cookie: r.cookie, body: { action: "load" } })).status, 401, "old session dead");
});
check("logout kills the session server-side (stolen cookie useless)", async () => {
  const me = await call({ body: { action: "login", name: "mallory", password: strong } });
  await call({ cookie: me.cookie, body: { action: "logout" } });
  assert.equal((await call({ cookie: me.cookie, body: { action: "load" } })).status, 401);
});
check("delete account needs the password and removes data", async () => {
  const me = await call({ body: { action: "login", name: "mallory", password: strong } });
  assert.equal((await call({ cookie: me.cookie, body: { action: "delete", password: "Wrong-password-1" } })).status, 401);
  assert.equal((await call({ cookie: me.cookie, body: { action: "delete", password: strong } })).status, 200);
  assert.equal((await call({ body: { action: "login", name: "mallory", password: strong } })).status, 401);
});
check("only GET/POST; GET never changes state and reveals no secrets", async () => {
  assert.equal((await call({ method: "DELETE" })).status, 405);
  const me = await call({ body: { action: "login", name: "olena", password: strong } });
  const g = await call({ method: "GET", cookie: me.cookie, origin: null, type: null });
  assert.equal(g.json.user.name, "olena");
  assert.ok(!JSON.stringify(g.json).match(/hash|recovery|scrypt/));
});
check("store disabled → API says disabled, nothing else", async () => {
  process.env.STRUDLI_TEST_MEMORY_STORE = "0";
  const r = await call({ body: { action: "register", name: "zoe", password: strong } });
  process.env.STRUDLI_TEST_MEMORY_STORE = "1";
  assert.deepEqual(r.json, { enabled: false });
});
check("memory store is refused on Vercel even if the test flag leaks", async () => {
  process.env.VERCEL = "1";
  const enabled = store.storeEnabled();
  delete process.env.VERCEL;
  assert.equal(enabled, false);
});

let failed = 0;
for (const [name, fn] of results) {
  try { await fn(); console.log("  ✓", name); } catch (e) { failed++; console.log("  ✗", name, "→", e.message); }
}
console.log(failed ? `Account attack tests: ${failed} FAILED` : `Account attack tests PASS: ${results.length} attacks refused`);
process.exit(failed ? 1 : 0);
