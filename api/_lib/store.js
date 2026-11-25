// Minimal key-value store for accounts and rate limits.
// Production: Upstash Redis over its REST API (Vercel Marketplace sets KV_REST_API_URL / KV_REST_API_TOKEN).
// Tests only: an in-memory store, enabled by STRUDLI_TEST_MEMORY_STORE=1 and refused on Vercel.
const memory = new Map();

function restConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

function memoryEnabled() {
  return process.env.STRUDLI_TEST_MEMORY_STORE === "1" && !process.env.VERCEL;
}

export function storeEnabled() {
  return Boolean(restConfig()) || memoryEnabled();
}

async function rest(command) {
  const cfg = restConfig();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(cfg.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(command),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`store ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error("store error");
    return data.result;
  } finally {
    clearTimeout(timer);
  }
}

function memGet(key) {
  const item = memory.get(key);
  if (!item) return null;
  if (item.exp && item.exp < Date.now()) { memory.delete(key); return null; }
  return item.value;
}

export async function get(key) {
  if (restConfig()) return rest(["GET", key]);
  return memGet(key);
}

export async function set(key, value, ttlSeconds) {
  if (restConfig()) return rest(ttlSeconds ? ["SET", key, value, "EX", String(ttlSeconds)] : ["SET", key, value]);
  memory.set(key, { value, exp: ttlSeconds ? Date.now() + ttlSeconds * 1000 : 0 });
  return "OK";
}

/** SET only if absent; returns true when this call created the key (atomic registration). */
export async function setIfAbsent(key, value) {
  if (restConfig()) return (await rest(["SET", key, value, "NX"])) === "OK";
  if (memGet(key) !== null) return false;
  memory.set(key, { value, exp: 0 });
  return true;
}

export async function del(key) {
  if (restConfig()) return rest(["DEL", key]);
  memory.delete(key);
  return 1;
}

/** Fixed-window counter; returns the count after incrementing. */
export async function hit(key, windowSeconds) {
  if (restConfig()) {
    const n = await rest(["INCR", key]);
    if (n === 1) await rest(["EXPIRE", key, String(windowSeconds)]);
    return n;
  }
  const n = Number(memGet(key) || 0) + 1;
  const item = memory.get(key);
  memory.set(key, { value: String(n), exp: item && item.exp > Date.now() ? item.exp : Date.now() + windowSeconds * 1000 });
  return n;
}

export function _resetMemoryForTests() { memory.clear(); }
