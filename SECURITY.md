# Security — Strudli Lernen

Last review: 24 Nov 2026. Scope: the web app (React/Vite on Vercel), the static story player (`public/lesen-pilot`), the service worker, and the two server functions `api/account.js` and `api/strudli-ai.js`.

## What we protect
| Asset | Why it matters |
| --- | --- |
| Learner progress (on the device; in the optional account) | Months of learning; must not be lost, read or changed by others |
| Account credentials | Password reuse is common; a leak must not expose real passwords |
| AI budget | Anonymous abuse of the AI tutor could burn the monthly credit |
| Private review stories | Unlicensed pilot material must never be reachable on the public site |
| The site itself | No injected scripts, no clickjacking, no mixed content |

Data we deliberately **do not** collect: e-mail, real name, phone, location, analytics or advertising IDs. The account stores a username, a password hash, a hashed recovery code and the progress archive.

## Controls
**Browser**
- Content-Security-Policy (`vercel.json`): scripts only from our own origin (no inline script, no `eval`), images and media only from our origin and the photo hosts we use, `frame-ancestors 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `upgrade-insecure-requests`.
- HSTS (2 years), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy: same-origin`, `Permissions-Policy` that turns off camera, location, payment, USB, serial and Bluetooth and allows the microphone only on our own pages (for "Say it yourself").
- React escapes all text. The story player builds untrusted text with `textContent` or an HTML escaper; the AI answer is inserted with `textContent` only.
- Cross-window messages (player → app) are accepted only from our own origin and only with a known message type.
- Progress import (file or account) is validated: format and version, whitelisted keys only, at most 2 MB, nesting depth at most 40.

**Accounts (`api/account.js`)**
- Passwords hashed with scrypt (N = 2^15, r = 8, p = 1, 16-byte random salt), compared with `timingSafeEqual`. A login for an unknown username still runs one scrypt, so response time does not reveal which usernames exist; the error message is the same.
- Password rules: 10–128 characters, not a common password, not a repeated character, must not contain the username.
- Session: 256-bit random token in a `__Host-strudli_sid` cookie (`Secure`, `HttpOnly`, `SameSite=Strict`, `Path=/`, no `Domain`). Only the token's SHA-256 is stored. 30-day expiry; logout deletes it on the server; a password change or reset bumps a per-user epoch and logs out every other device.
- CSRF: every state-changing request must carry our own `Origin` and a JSON body (blocks HTML form posts and other sites).
- Brute force: per username 10 login attempts / 15 min (also across many IPs), per IP 30 logins / 15 min and 5 registrations / hour, 5 recoveries / hour per username, 120 writes / hour per user. IP comes from headers that Vercel writes itself.
- No e-mail means no reset link to steal: a one-time recovery code (≈ 95 bits) is shown once, stored hashed, and rotated after use.
- Input: strict username pattern (`a–z 0–9 . _ -`, 3–32), JSON bodies at most 256 KB, progress at most 200 KB and only known keys (no `__proto__`).
- Errors are generic; passwords and request bodies are never logged. Responses are `no-store`.
- The in-memory test store refuses to run on Vercel, so a leaked test flag cannot turn production accounts into volatile memory.

**AI tutor (`api/strudli-ai.js`)** — Google Gemini free tier (`GEMINI_API_KEY`, no billing attached, so no charges are possible) or Vercel AI Gateway
- Accepts only short German text (2–280 characters, mostly Latin letters). Text with code or markup characters (`` ` { } < > \ $ | ; = _ # @ [ ] ``) is refused before any AI call.
- The learner's text is passed as quoted data (`<german>…</german>`) with an instruction never to follow instructions inside it. The model gets no secrets, tools or user data.
- The answer must be strict JSON in a fixed shape; every field is length-clamped and unknown fields are dropped. The app renders it as plain text.
- Same-origin JSON only, 20 explanations per IP per hour, a global daily cap (`STRUDLI_AI_DAILY_CAP`, default 1500), 15 s timeout.
- Any problem (no key, timeout, bad answer, limit) returns `{ ok:false, fallback:true }` and the app shows the human-checked translation instead.

**Content**
- Private review stories (unlicensed pilot) are hidden in the app and refused by the player on the public host, and `scripts/strip-private-stories.mjs` deletes their files from production builds, so they cannot be downloaded by URL.
- No secrets in the repository. Server keys live only in Vercel environment variables.

## How we attacked it
`scripts/attack-account-api.mjs` and `scripts/attack-ai-api.mjs` run real attacks against the functions (in-memory store and mocked AI, no network):

| Attack | Result |
| --- | --- |
| Re-register an existing name (account takeover) | 409, refused |
| Weak, common, name-containing, 129-char passwords | refused with a clear reason |
| Username tricks: `../admin`, `user:sess:x`, `<script>`, Cyrillic look-alike `аdmin`, objects/arrays | 400 |
| CSRF: foreign Origin, no Origin, `x-www-form-urlencoded`, `strudli.test.evil.example` | 403 |
| User enumeration by message or timing | same message; unknown user pays a real scrypt |
| Brute force one account from many IPs; spraying from one IP; mass registration | 429 |
| Forged, malformed, path-like session cookies | 401 |
| Read another user's progress (IDOR) | impossible: progress is keyed by the session's user only |
| Progress with unknown keys, wrong format, `__proto__` pollution, 230 KB value, 300 KB body, broken JSON | 400 / 413, prototype untouched |
| Stolen cookie after logout, after password change, after recovery | 401 |
| Delete account without password | 401 |
| DELETE/PUT methods; secrets in GET response | 405; no hash or recovery data ever returned |
| Prompt injection in Ukrainian, code fences, closing the quote tag, `{instructions}`, `$(whoami)` | refused before the AI call |
| Malicious AI output (HTML, 900 chars, 20 words, extra `secret` field) | clamped to the fixed shape, rendered as text |
| AI down / no key / garbage answer | safe fallback, no crash |
| Cross-site use of the AI budget; 22 requests from one IP | 403; 429 |

The CI workflow *Strudli security attack tests* also builds the real app, serves it with the production headers from `vercel.json`, opens every main screen in Chromium and fails on any CSP violation, on any private-story file reachable in a public build, and on XSS payloads in the progress import and story URL.

## Known limits and next steps
- A targeted lock-out is possible: 10 wrong guesses lock a username for 15 minutes. This is the price of stopping online guessing without e-mail or CAPTCHA.
- Progress on the device is in `localStorage`; anyone with access to the unlocked device can read it (normal for offline web apps).
- `style-src 'unsafe-inline'` remains because React components use inline `style` attributes; scripts stay strict.
- The speech check uses the browser's own recognizer; in Chrome audio goes to the browser vendor's service. The app explains this in the privacy note.
- Report a vulnerability: open a private security advisory on the GitHub repository.
