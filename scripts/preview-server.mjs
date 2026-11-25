// Temporary test server for the built app (owner-approved 25.11.2026): production headers from vercel.json,
// the real API functions (AI tutor with GEMINI_API_KEY and its rate limits, account API with an in-memory store),
// range requests for audio/video. Usage: node scripts/preview-server.mjs dist 4200
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

process.env.STRUDLI_TEST_MEMORY_STORE = "1"; delete process.env.VERCEL;
const { default: account } = await import("../api/account.js");
const { default: ai } = await import("../api/strudli-ai.js");
const dist = path.resolve(process.argv[2] || "dist"), port = Number(process.argv[3] || 4200);
const vercel = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
const rx = (src) => new RegExp("^" + src.replace(/\(\.\*\)/g, "(.*)") + "$");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".avif": "image/avif", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".ico": "image/x-icon", ".txt": "text/plain" };
http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  for (const rule of vercel.headers) if (rx(rule.source).test(url.pathname)) for (const h of rule.headers) res.setHeader(h.key, h.value);
  if (url.pathname === "/api/account") return account(req, res);
  if (url.pathname === "/api/strudli-ai") return ai(req, res);
  let file = path.join(dist, decodeURIComponent(url.pathname));
  if (!file.startsWith(dist)) { res.statusCode = 400; return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { if (/\.[a-z0-9]{2,6}$/i.test(url.pathname)) { res.statusCode = 404; return res.end(); } file = path.join(dist, "index.html"); }
  res.setHeader("Content-Type", TYPES[path.extname(file).toLowerCase()] || "application/octet-stream");
  const stat = fs.statSync(file), range = req.headers.range;
  if (range && /audio|video/.test(res.getHeader("Content-Type"))) {
    const [a, b] = range.replace("bytes=", "").split("-"); const start = Number(a) || 0, end = b ? Number(b) : stat.size - 1;
    res.statusCode = 206; res.setHeader("Content-Range", `bytes ${start}-${end}/${stat.size}`); res.setHeader("Accept-Ranges", "bytes"); res.setHeader("Content-Length", end - start + 1);
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.setHeader("Content-Length", stat.size); fs.createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => console.log("preview server on", port));
