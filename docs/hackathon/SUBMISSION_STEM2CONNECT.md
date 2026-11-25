# Strudli Lernen — STEM2Connect AI Hackathon submission

- **Deadline:** 29 Nov 2026, 11:59 pm EST = **30 Nov 2026, 05:59 Berlin** (submit together with the Global AI Builder's Challenge on 28 Nov).
- **Track:** Education (learning, accessibility, tutoring).
- **Required:** public GitHub repo with README (what it does, how to run, which AI tools/APIs), demo video ≤ 6 min on YouTube/Vimeo (same video as Global AI Builder's), Devpost description below incl. disclosure of pre-existing work, all team members on the submission. Demo Day 1 Dec 2026 (EST) — the prerecorded demo video counts as the presentation.
- Judged in five equal parts (20 % each): Problem & Impact · Use of AI · Functionality · Learning & Growth · Presentation.

---

**Project name:** Strudli Lernen

**Tagline:** German for newcomers, like going to the cinema — watch a painted story, tap any word, ask Strudli why.

## Problem and impact
**Made by immigrants, for immigrants.** 1.42 million people with Ukrainian citizenship (AZR, May 2026) and 14 million foreign nationals in total (Destatis, end of 2025) live in Germany. In 2026 the BAMF first stopped admitting voluntary participants to integration courses (about 129,500 people, roughly 40 % of expected participants) and since August processes them only with lower priority. They still need A1–A2 German for offices, doctors, jobs and their children's school, so they learn alone, in the evening, on a phone — and get stuck in three places: phone voices read sentences word by word, a translation is missing exactly at the hard word, and grammar is explained in German or English instead of their own language.

Strudli Lernen, built by newcomers from Ukraine, gives them 1,177 illustrated word cards in 47 everyday topics, 150 real-life phrases (Jobcenter, Kita, doctor, train) recorded as natural speech, short cinematic stories with a calm narrator and word-by-word highlighting, and an AI tutor that explains any sentence in Ukrainian or English. It is free, runs in any phone browser, needs no sign-up and keeps progress on the device.

## The solution
- **Cinematic stories:** painted scenes that gently animate, a neural narrator, karaoke-style highlighting from real speech timestamps, tap-any-word meanings in context (*sie* = she / they), A1 and A2 versions, quizzes.
- **Strudli explains (AI):** one tap explains a phrase or a story sentence — translation, key words with articles, the grammar point and a new example.
- **Say it yourself:** speech recognition marks each spoken word right or wrong.
- **Strudli Arena:** a game-show quiz (articles, endings, photos, story words).
- **Optional account without e-mail** to keep progress on several devices.

## Use of AI
**Inside the app:** an LLM through Vercel AI Gateway (`api/strudli-ai.js`) explains the exact sentence a learner is stuck on, at A1–A2 level, in their language. Input is limited to short German text (prompt-injection and code refused), the answer is forced into a fixed JSON shape and shown as plain text under the human-checked translation; if the AI is unavailable the app shows its own dictionary translation. The browser's speech recognition checks pronunciation. Microsoft neural voices narrate the stories and phrases and return word-boundary timestamps that drive the highlighting. An image model painted the 21 story scenes from one style guide.

**During development:** Claude and ChatGPT wrote most code, scripts and glosses through pull requests. A person reviewed every change on a phone, and 30+ automated checks gate each build (every subtitle word needs a gloss, every card a translation, example and photo; 28 security attacks must be refused). Examples of what review caught are in `docs/hackathon/AI_DEVELOPMENT_LOG.md`.

## Functionality
Live app https://wortwelt-de-ua.vercel.app/ · code https://github.com/rostys-fintech/strudli-lernen. Works on iPhone and Android browsers, offline after first visit (service worker). Three public story episodes × two levels with narration and fullscreen video; 150 phrases with recordings; AI tutor with safe fallback; account with scrypt passwords, secure cookies, CSRF and brute-force protection. CI: content checks, type check, production build, API attack tests and a browser security run (0 CSP violations).

## Learning and growth
- Word timing: estimating timestamps failed; using the voice service's own word boundaries made highlighting 98–100 % exact.
- iPhone fullscreen: Safari cannot fullscreen interactive HTML, so we render a real H.264 video for fullscreen and keep the interactive player inline.
- Reviewing AI output: the AI translated *sie* as "she" where the story meant "they" — we added per-token context glosses. AI-written security code first only stripped markup from prompts; an attack test showed it should refuse them instead.
- Rights: a pilot based on a video game was kept private and is stripped from public builds.

## Disclosure of pre-existing work
Strudli Lernen (formerly WortWelt) existed before this hackathon as a German–Ukrainian word-card app (cards, topics, practice exercises, classic reading stories). During the hackathon period (from 17 Oct 2026) we built: the cinematic story player and three *Bremer Stadtmusikanten* episodes, the Strudli Arena, the AI tutor and speech check, 150 recorded everyday phrases, 139 new photos, the optional account and the security hardening with attack tests. The public repository is a clean snapshot (private review material removed), so the dated pull requests are listed in `docs/hackathon/BUILD_HISTORY.md`.

## Next steps
More explanation languages for the largest newcomer groups — Arabic, Turkish and Farsi next — plus A2→B1 levels. Native iPhone/Android app (offline stories, daily reminders), more everyday stories (bakery, doctor, Jobcenter), spaced repetition, a multiplayer Arena for language courses.

## Built with
react · typescript · vite · vercel · vercel-ai-gateway · google-gemini · upstash-redis · web-speech-api · microsoft-neural-tts · ffmpeg · playwright · github-actions · claude · chatgpt
