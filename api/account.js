// Optional Strudli account: keep learning progress across devices.
// No e-mail and no personal data: a username, a password and a one-time recovery code.
//
// Security model (see SECURITY.md):
//  - passwords: scrypt (N=2^15, r=8, p=1, 16-byte salt), compared in constant time;
//    unknown users still pay one scrypt so timing does not reveal which names exist
//  - sessions: 256-bit random token in a __Host- cookie (Secure, HttpOnly, SameSite=Strict),
//    only its SHA-256 is stored; 30-day expiry; a password change or reset logs out every device
//  - CSRF: state-changing calls need our own Origin and a JSON body
//  - brute force: fixed-window limits per IP and per username
//  - input: strict username pattern, password length and common-password checks,
//    progress archives validated against the app's whitelist and capped at 200 KB
import crypto from "node:crypto";
import * as store from "./_lib/store.js";
import { send, clientIp, sameOriginJson, readJson, parseCookies } from "./_lib/http.js";

const COOKIE = "__Host-strudli_sid";
const SESSION_TTL = 30 * 24 * 3600;
const PROGRESS_MAX = 200 * 1024;
const USER_RX = /^[a-z0-9][a-z0-9_.-]{2,31}$/;
const PROGRESS_KEYS = new Set(["wortwelt-stats", "wortwelt-saved", "wortwelt-custom", "wortwelt-active-round", "wortwelt-active-topic", "wortwelt-active-case", "wortwelt-reviews-v1", "wortwelt-daily-v1", "wortwelt-daily-goal", "wortwelt-migration-demo-round", "strudli-lesen-progress-v1", "strudli-lesen-saved", "strudli-arena-best-v1"]);
const COMMON = new Set(["password", "password1", "password123", "passwort", "passwort123", "1234567890", "12345678910", "123456789a", "qwertyuiop", "qwertz1234", "qwerty1234", "iloveyou12", "letmein123", "welcome123", "admin12345", "abc1234567", "0987654321", "1111111111", "0000000000", "deutschland", "deutsch123", "ukraine123", "strudli123", "strudlilernen", "wortwelt123", "hallo12345", "sommer2026", "winter2026", "football12", "baseball12", "princess12", "sunshine12", "dragon1234", "monkey1234", "master1234", "superman12", "trustno1234", "zaq12wsxcde", "1q2w3e4r5t", "asdfghjkl1", "qazwsxedc1", "passw0rd12", "p@ssw0rd12", "slava12345", "kyiv123456", "lviv123456", "berlin1234", "muenchen12", "ulm1234567"]);
const LIMITS = {
  loginIp: [30, 15 * 60], loginUser: [10, 15 * 60],
  registerIp: [5, 60 * 60], recoverUser: [5, 60 * 60], writeUser: [120, 60 * 60],
};
// Dummy hash so a login for an unknown name costs the same as a real one.
const DUMMY = hashPasswordSync("strudli-dummy-password-for-timing");

function scryptAsync(password, salt, N, r, p) {
  return new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, { N, r, p, maxmem: 96 * 1024 * 1024 }, (e, k) => (e ? reject(e) : resolve(k))));
}
function hashPasswordSync(password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 96 * 1024 * 1024 });
  return `scrypt$32768$8$1$${salt.toString("base64")}$${key.toString("base64")}`;
}
async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = await scryptAsync(password, salt, 32768, 8, 1);
  return `scrypt$32768$8$1$${salt.toString("base64")}$${key.toString("base64")}`;
}
async function verifyPassword(password, stored) {
  const [alg, N, r, p, salt, hash] = String(stored).split("$");
  if (alg !== "scrypt") return false;
  const expected = Buffer.from(hash, "base64");
  const key = await scryptAsync(password, Buffer.from(salt, "base64"), Number(N), Number(r), Number(p));
  return key.length === expected.length && crypto.timingSafeEqual(key, expected);
}
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const newRecoveryCode = () => crypto.randomBytes(15).toString("base64url").replace(/[-_]/g, "x").slice(0, 20).toUpperCase().match(/.{4}/g).join("-");

function passwordProblem(password, name) {
  if (typeof password !== "string") return "password_required";
  if (password.length < 10) return "password_too_short";
  if (password.length > 128) return "password_too_long";
  const lower = password.toLowerCase();
  if (COMMON.has(lower) || /^(.)\1+$/.test(password)) return "password_too_common";
  if (name && lower.includes(name)) return "password_contains_name";
  return null;
}
function cleanName(name) {
  const n = typeof name === "string" ? name.trim().toLowerCase().normalize("NFKC") : "";
  return USER_RX.test(n) ? n : null;
}
async function limited(kind, id) {
  const [max, windowSec] = LIMITS[kind];
  const n = await store.hit(`strudli:rl:${kind}:${sha256(id)}`, windowSec);
  return n > max;
}
function sessionCookie(token, maxAge) {
  return `${COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;
}
async function readUser(name) {
  const raw = await store.get(`strudli:user:${name}`);
  return raw ? JSON.parse(raw) : null;
}
async function writeUser(user) {
  await store.set(`strudli:user:${user.name}`, JSON.stringify(user));
}
async function startSession(res, user) {
  const token = crypto.randomBytes(32).toString("base64url");
  await store.set(`strudli:sess:${sha256(token)}`, JSON.stringify({ name: user.name, epoch: user.epoch, at: Date.now() }), SESSION_TTL);
  res.setHeader("Set-Cookie", sessionCookie(token, SESSION_TTL));
}
async function currentUser(req) {
  const token = parseCookies(req)[COOKIE];
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const raw = await store.get(`strudli:sess:${sha256(token)}`);
  if (!raw) return null;
  const sess = JSON.parse(raw);
  const user = await readUser(sess.name);
  if (!user || user.epoch !== sess.epoch) return null;
  return { user, key: `strudli:sess:${sha256(token)}` };
}
function validArchive(archive) {
  if (!archive || typeof archive !== "object" || Array.isArray(archive)) return false;
  if (archive.format !== "wortwelt-progress" || archive.version !== 1) return false;
  if (!archive.values || typeof archive.values !== "object" || Array.isArray(archive.values)) return false;
  return Object.keys(archive.values).every((k) => PROGRESS_KEYS.has(k));
}

export default async function handler(req, res) {
  try {
    if (!store.storeEnabled()) return send(res, 200, { enabled: false });
    if (!["GET", "POST"].includes(req.method)) return send(res, 405, { error: "method_not_allowed" }, { Allow: "GET, POST" });
    if (req.method === "GET") {
      const me = await currentUser(req);
      return send(res, 200, { enabled: true, user: me ? { name: me.user.name, created: me.user.created } : null });
    }
    if (!sameOriginJson(req)) return send(res, 403, { error: "cross_site_blocked" });
    const body = await readJson(req);
    const action = String(body.action || "");
    const ip = clientIp(req);

    if (action === "register") {
      if (await limited("registerIp", ip)) return send(res, 429, { error: "too_many_attempts" });
      const name = cleanName(body.name);
      if (!name) return send(res, 400, { error: "bad_username" });
      const problem = passwordProblem(body.password, name);
      if (problem) return send(res, 400, { error: problem });
      const recovery = newRecoveryCode();
      const user = { name, hash: await hashPassword(body.password), recovery: sha256(recovery), epoch: 1, created: new Date().toISOString() };
      if (!(await store.setIfAbsent(`strudli:user:${name}`, JSON.stringify(user)))) return send(res, 409, { error: "username_taken" });
      await startSession(res, user);
      return send(res, 201, { ok: true, user: { name }, recoveryCode: recovery });
    }

    if (action === "login") {
      const name = cleanName(body.name);
      if ((await limited("loginIp", ip)) || (name && (await limited("loginUser", name)))) return send(res, 429, { error: "too_many_attempts" });
      const user = name ? await readUser(name) : null;
      const ok = typeof body.password === "string" && body.password.length <= 128
        && (await verifyPassword(body.password, user ? user.hash : DUMMY)) && Boolean(user);
      if (!ok) return send(res, 401, { error: "wrong_credentials" });
      await startSession(res, user);
      return send(res, 200, { ok: true, user: { name: user.name } });
    }

    if (action === "recover") {
      const name = cleanName(body.name);
      if (!name || (await limited("recoverUser", name)) || (await limited("loginIp", ip))) return send(res, 429, { error: "too_many_attempts" });
      const user = await readUser(name);
      const code = typeof body.recoveryCode === "string" ? body.recoveryCode.trim().toUpperCase() : "";
      const given = Buffer.from(sha256(code)), expected = Buffer.from(user ? user.recovery : sha256("none"));
      if (!user || !crypto.timingSafeEqual(given, expected)) return send(res, 401, { error: "wrong_credentials" });
      const problem = passwordProblem(body.newPassword, name);
      if (problem) return send(res, 400, { error: problem });
      const recovery = newRecoveryCode();
      Object.assign(user, { hash: await hashPassword(body.newPassword), recovery: sha256(recovery), epoch: user.epoch + 1 });
      await writeUser(user);
      await startSession(res, user);
      return send(res, 200, { ok: true, user: { name }, recoveryCode: recovery });
    }

    // Everything below needs a valid session.
    const me = await currentUser(req);
    if (!me) return send(res, 401, { error: "not_signed_in" });
    const user = me.user;

    if (action === "logout") {
      await store.del(me.key);
      res.setHeader("Set-Cookie", sessionCookie("", 0));
      return send(res, 200, { ok: true });
    }
    if (await limited("writeUser", user.name)) return send(res, 429, { error: "too_many_attempts" });

    if (action === "save") {
      if (!validArchive(body.archive)) return send(res, 400, { error: "bad_progress" });
      const json = JSON.stringify(body.archive);
      if (Buffer.byteLength(json) > PROGRESS_MAX) return send(res, 413, { error: "progress_too_large" });
      const savedAt = new Date().toISOString();
      await store.set(`strudli:progress:${user.name}`, JSON.stringify({ savedAt, archive: body.archive }));
      return send(res, 200, { ok: true, savedAt });
    }
    if (action === "load") {
      const raw = await store.get(`strudli:progress:${user.name}`);
      return send(res, 200, raw ? { ok: true, ...JSON.parse(raw) } : { ok: true, archive: null });
    }
    if (action === "change-password" || action === "delete") {
      if (typeof body.password !== "string" || body.password.length > 128 || !(await verifyPassword(body.password, user.hash))) return send(res, 401, { error: "wrong_credentials" });
      if (action === "delete") {
        await store.del(`strudli:progress:${user.name}`);
        await store.del(`strudli:user:${user.name}`);
        await store.del(me.key);
        res.setHeader("Set-Cookie", sessionCookie("", 0));
        return send(res, 200, { ok: true, deleted: true });
      }
      const problem = passwordProblem(body.newPassword, user.name);
      if (problem) return send(res, 400, { error: problem });
      Object.assign(user, { hash: await hashPassword(body.newPassword), epoch: user.epoch + 1 });
      await writeUser(user);
      await startSession(res, user); // all other devices are logged out by the new epoch
      return send(res, 200, { ok: true });
    }
    return send(res, 400, { error: "unknown_action" });
  } catch (err) {
    if (err && err.status) return send(res, err.status, { error: err.code });
    console.error("account error", err && err.message); // never log bodies or passwords
    return send(res, 503, { error: "temporarily_unavailable" });
  }
}
