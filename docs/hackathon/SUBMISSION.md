# Strudli Lernen — Devpost submission (Global AI Builder's Challenge)

Ready-to-paste text for the Devpost project page. Written in English (judges read English). 

- **Deadline:** 28 Nov 2026, 3:00 pm PST = **29 Nov 2026, 00:00 Berlin**. Submit by 28 Nov evening to leave a buffer.
- **Required:** project description (5 questions below), 2–4 min demo video on YouTube/Vimeo (embedding on, plays when signed out, sped-up parts labelled), **public** GitHub repo with all project code, setup instructions and third-party list, no secrets, team roster, each member's contact & sponsor opt-in form.
- **Categories to select:** AI for Education (main), Multimodal, Accessibility, Community Impact, Design & UX, Best Demo & Presentation, People's Choice.

---

**Project name:** Strudli Lernen

**Tagline:** German for newcomers, like going to the cinema — watch a painted story, tap any word, ask Strudli why, say it yourself.

## 1. Who is it for, and what need does it meet?
**Made by immigrants, for immigrants.** Strudli Lernen is for people in their first weeks in Germany who have no language course yet — and who need German *now*: for letters, offices, the doctor, the train and their children's school.

The need is large and growing:
- **1.42 million** Ukrainians are registered in Germany (Central Register of Foreigners, AZR, May 2026); about **1.2 million** people come from Syria and Iraq; **14 million** foreign nationals live in Germany in total (Destatis, end of 2025).
- **1.48 million** people moved to Germany in 2025 alone (Destatis).
- Since 9 Feb 2026 the BAMF no longer admits most voluntary participants to integration courses: up to **129,500 people** — Ukrainians included — get no new course place in 2026 (Bundestag print 21/5574).

So the first months are often spent alone with a phone. We ran into three concrete problems ourselves: phone voices read sentences "word by word", translations are missing exactly when they get stuck, and grammar is explained in German or English, not in their own language. We are newcomers from Ukraine ourselves and built the tool we were missing.

Strudli Lernen answers with: 1,177 illustrated word cards in 47 everyday topics, 150 practical phrases for real situations (Bürgeramt, Jobcenter, doctor, Kita, train), short cinematic stories with a calm narrator, and an AI tutor that explains any sentence in Ukrainian or English. It is free and runs in any phone browser. Next come explanations in Arabic, Turkish and Farsi — the languages of the next-largest newcomer groups — and A2→B1 content.

## 2. What did you build or improve during the event (21–28 Nov)?
Strudli Lernen existed before as a word-card app. During the event (21–25 Nov: 32 merged pull requests, more than 450 commits, production release on 25 Nov — see `docs/hackathon/BUILD_HISTORY.md`) we built:
- **Cinematic stories (Lesen 2.0):** a story player with painted scenes, a neural narrator in a calm storyteller pace, word-by-word highlighting from real speech timestamps, tap-any-word translations (in context: *sie* = she/they), A1/A2 versions, quizzes and native fullscreen video for iPhone. Three public episodes of *Die Bremer Stadtmusikanten* with 21 animated scenes.
- **Strudli explains (AI tutor):** one tap explains a phrase or a story sentence — translation, key words with articles, the grammar point and a new example — in Ukrainian or English.
- **Say it yourself:** speech recognition checks the learner's pronunciation and colours each word.
- **Strudli Arena:** a game-show quiz (articles, adjective endings, photos, story words, saved words).
- **Audio:** 150 everyday phrases (50 new this week), each recorded as one natural utterance instead of choppy phone synthesis.
- **Optional account** to keep progress on several devices, without e-mail.
- **139 new high-quality photos**, the Strudli mascot guide in every section, and a security hardening pass with automated attack tests.

## 3. How does the project use AI?
**AI inside the finished app (what users touch):**
| Feature | AI | What it does for the learner |
| --- | --- | --- |
| Strudli explains | LLM via Vercel AI Gateway (`api/strudli-ai.js`, model set by `STRUDLI_AI_MODEL`) | Explains the exact sentence the learner is stuck on, in their language, at A1–A2 level |
| Say it yourself | Browser speech recognition (on-device or the browser vendor's speech AI) | Hears the learner and marks each word right or wrong |
| Narration and word timing | Microsoft neural TTS (ConradNeural, KatjaNeural) | Natural, calm voice; real word-boundary timestamps drive the karaoke highlighting |
| Story scenes | Image generation | 21 painted scenes in one consistent style with a character sheet |

**AI during development, and how a person checked it** (details in `docs/hackathon/AI_DEVELOPMENT_LOG.md`): Claude and ChatGPT wrote most code, story scripts and glosses through pull requests. Every change was reviewed by the founder on a phone and by automated checks (each subtitle word must have a gloss, each card a translation, example and photo; 30+ content checks; attack tests). Examples of what review found: the AI translated *sie* as "she" where the story meant "they" (changed: per-token context glosses); subtitles in the video wrapped unevenly (changed); an AI-proposed Arena design did not match the app style (rejected and redone); story pilots based on a video game were kept private for rights reasons (rejected for public release); phone voices sounded choppy (changed to recorded whole phrases).

## 4. How can people access it, and what are the results?
- **Live app:** https://wortwelt-de-ua.vercel.app/ — works in any mobile browser, no install, no sign-up needed.
- **Repo:** https://github.com/rostys-fintech/strudli-lernen — `npm install && npm run build`.
- Results so far: 1,177 cards, 150 phrases with recorded audio, 3 cinematic episodes (A1 and A2, 6 narrated tracks, 6 fullscreen videos), word-timing match rate 98–100 %, 0 missing glosses on 1,000+ tappable story words, 28 automated attacks refused, 0 CSP violations across all screens in the browser security run.

## 5. Limitations and how failures are handled
- **AI can be wrong.** The AI card is labelled "AI", always appears under a human-checked translation, and says so. The input is limited to short German text; prompt-injection attempts and code are refused; the answer is forced into a fixed shape and shown as plain text.
- **AI unavailable** (no credit, timeout, rate limit): the app shows the checked translation from its own dictionary and suggests trying later. Nothing breaks.
- **Speech recognition missing** (e.g. Firefox) or microphone denied: a clear message; listening and repeating still work.
- **Account service down:** the account panel hides; progress stays on the device; JSON backup remains.
- **Offline:** the app shell, seen photos and recorded audio keep working through the service worker.
- Known limits: A1–A2 only; Ukrainian and English explanations only; narration voice terms must be reviewed before commercial use; targeted account lock-out after 10 wrong passwords (15 min) is the price of brute-force protection.

## Built with
react · typescript · vite · vercel · vercel-ai-gateway · google-gemini · upstash-redis · web-speech-api · microsoft-neural-tts (edge-tts) · ffmpeg · github-actions · playwright · claude · chatgpt

## Third-party services and assets
See `README.md` → *Third-party*. Own work vs. third-party is kept separate: `api/`, `src/`, `scripts/`, `public/lesen-pilot/` are ours; photos come from Wikimedia Commons, Pexels and Unsplash (credits in `public/photo-credits.html`, `public/media-credits.html`); fonts Rubik and Nunito (Google Fonts, OFL); icons lucide-react (ISC).

## Team roster
⟨names and Devpost usernames⟩ — every member must fill in the contact & sponsor opt-in form.
