// Shared request/response hardening for Strudli API functions.
export const MAX_BODY_BYTES = 256 * 1024;

export function send(res, status, body, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  for (const [k, v] of Object.entries(extraHeaders)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

export function clientIp(req) {
  // On Vercel the platform writes x-vercel-forwarded-for / x-real-ip itself (client values are replaced),
  // so they are preferred over the first x-forwarded-for entry. Fall back to the socket.
  const pick = (h) => String(req.headers[h] || "").split(",")[0].trim();
  const ip = pick("x-vercel-forwarded-for") || pick("x-real-ip") || pick("x-forwarded-for") || req.socket?.remoteAddress || "unknown";
  return ip.slice(0, 64).replace(/[^0-9a-fA-F:.]/g, "") || "unknown";
}

/** Blocks cross-site requests: state-changing calls must come from our own origin with a JSON body. */
export function sameOriginJson(req) {
  if (req.method === "GET" || req.method === "HEAD") return true;
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "");
  const origin = String(req.headers.origin || "");
  let originHost = "";
  try { originHost = new URL(origin).host; } catch { return false; }
  if (!host || originHost !== host) return false;
  const type = String(req.headers["content-type"] || "").toLowerCase();
  return type.startsWith("application/json");
}

export async function readJson(req) {
  if (req.body !== undefined && req.body !== null && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    if (Buffer.byteLength(JSON.stringify(req.body)) > MAX_BODY_BYTES) throw httpError(413, "too_large");
    return req.body;
  }
  let raw = "";
  if (typeof req.body === "string") raw = req.body;
  else if (Buffer.isBuffer(req.body)) raw = req.body.toString("utf8");
  else {
    raw = await new Promise((resolve, reject) => {
      let size = 0; const chunks = [];
      req.on("data", (c) => { size += c.length; if (size > MAX_BODY_BYTES) { reject(httpError(413, "too_large")); req.destroy?.(); } else chunks.push(c); });
      req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      req.on("error", reject);
    });
  }
  if (Buffer.byteLength(raw) > MAX_BODY_BYTES) throw httpError(413, "too_large");
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    return parsed;
  } catch { throw httpError(400, "bad_json"); }
}

export function httpError(status, code) { const e = new Error(code); e.status = status; e.code = code; return e; }

export function parseCookies(req) {
  const out = Object.create(null);
  for (const part of String(req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}
