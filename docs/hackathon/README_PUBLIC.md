# Strudli Lernen

**German for newcomers, like going to the cinema.** Watch a painted story, tap any word, ask Strudli (our AI tutor) why, say it yourself — then play it in a quiz show. Ukrainian and English explanations.

**Made by immigrants, for immigrants** — for people in their first weeks in Germany who have no language course yet. Arabic, Turkish and Farsi explanations are next.

Live demo: _add the production link_ · Video: _add the YouTube link_

## Features
- **1,177 illustrated word cards** in 47 everyday topics for life in Germany (offices, transport, doctor, renting, shopping), with Ukrainian and English translations, der/die/das colours, audio and three-flame mastery.
- **Cinematic stories:** painted scenes, a calm neural narrator, subtitles that highlight each spoken word, and a tap on any word for meaning, IPA, a simple example and pronunciation. A1 and A2 versions, three questions, and native fullscreen video on phones.
- **Strudli Arena:** a game-show quiz with three buttons, a 15-second timer, speed points and an original Web Audio music loop. Rounds: article, adjective ending, photo, story words and the words you saved.
- **Strudli explains (AI):** one tap explains a phrase or story sentence — translation, key words, grammar point and a new example — in Ukrainian or English, with a human-checked fallback.
- **Say it yourself:** browser speech recognition marks each spoken word right or wrong.
- **150 everyday phrases** (offices, Jobcenter, doctor, Kita, transport) recorded as natural whole-phrase audio.
- **Optional account without e-mail** to keep progress on several devices.
- **Calm practice and reading:** verbs, cases, everyday dialogues, listening, sentence building and six illustrated reading stories.

## Tech
React 19 · TypeScript · Vite · Vercel. Progress lives in the learner's browser (localStorage) with JSON backup. Two small dependency-free Vercel functions add the optional parts:
- `api/strudli-ai.js` — AI tutor through Vercel AI Gateway (OpenAI-compatible endpoint)
- `api/account.js` — optional account on Upstash Redis (REST)

Security model, controls and the attack tests: [SECURITY.md](SECURITY.md).

## Story pipeline
| Step | Tool |
| --- | --- |
| A1/A2 script, translations, glosses for every word | AI (Claude), reviewed by a human |
| 7 painted 16:9 scenes from one style guide and a character sheet | Image model (ChatGPT), reviewed by a human |
| Narration and real word timestamps | `scripts/generate_lesen_story_audio.py` (Microsoft ConradNeural via edge-tts) in GitHub Actions |
| Native fullscreen MP4 with fixed camera and ambient motion | `scripts/build_lesen_story_video.py` (ffmpeg) |
| Every subtitle word has a gloss; assets and timings exist | `scripts/check-lesen-cinematic-pilot.mjs` |

Add a story: create `public/lesen-pilot/stories/<id>/story-data.json`, add `narrate.json` to trigger narration, put scene art in `media/`, render the video and add an entry to `public/lesen-pilot/catalog.json`.

## Run locally
```bash
npm install
npm run dev          # development server (static app; AI and account answer "not available")
npm run build        # all content checks, type check and production build
npm run test:attack  # attack tests for the account and AI functions (no network)
```

### Environment variables (Vercel)
| Variable | Needed for | Notes |
| --- | --- | --- |
| *(none)* | the whole learning app | works fully static |
| `GEMINI_API_KEY` | Strudli explains | Google AI Studio key; free tier, no card — at the free limit requests are refused and the app shows its fallback |
| `STRUDLI_GEMINI_MODEL` | Strudli explains | optional, default `gemini-3.5-flash-lite` |
| `AI_GATEWAY_API_KEY` | Strudli explains | not needed on Vercel when AI Gateway is enabled (OIDC token is used) |
| `STRUDLI_AI_MODEL` | Strudli explains | optional, default `anthropic/claude-haiku-4.5` |
| `STRUDLI_AI_DAILY_CAP` | Strudli explains | optional, default 1500 requests/day |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | accounts | set automatically when Upstash Redis is connected from the Vercel Marketplace; without them the account panel is hidden |

No secret is stored in the repository.

## AI tools and APIs used
| Where | Tool | Role |
| --- | --- | --- |
| In the app | LLM via Vercel AI Gateway (`api/strudli-ai.js`, model in `STRUDLI_AI_MODEL`) | "Strudli explains" — sentence explanations at A1–A2 |
| In the app | Browser Web Speech API | "Say it yourself" pronunciation check |
| Content pipeline | Microsoft neural TTS via edge-tts | Narration, phrase recordings, word timestamps |
| Content pipeline | ChatGPT image generation | Story scene paintings (one style guide, character sheet) |
| Development | Claude (Claude Code) and ChatGPT | Code, story scripts, glosses, reviews — every change reviewed by a person and gated by automated checks (`docs/hackathon/AI_DEVELOPMENT_LOG.md`) |
| Demo video | Playwright + edge-tts + ffmpeg (`scripts/demo/`) | Automated real-time recording of the real app with narration |

## Third-party
| Kind | What | License / terms |
| --- | --- | --- |
| Runtime libraries | react, react-dom, lucide-react | MIT / ISC |
| Build | vite, typescript, @vitejs/plugin-react | MIT |
| Services | Vercel hosting and AI Gateway; Upstash Redis (optional); the browser's speech recognition | provider terms |
| Voices | Microsoft neural TTS via edge-tts (narration, phrases) | review before commercial use |
| Fonts | Rubik, Nunito (Google Fonts) | OFL |
| Photos | Wikimedia Commons, Pexels, Unsplash, own/AI-generated | see credit pages |
| Test tooling | playwright (CI only) | Apache-2.0 |

## Content and credits
- *Die Bremer Stadtmusikanten*: original retelling of the public-domain Grimm tale (KHM 27); illustrations generated for this project.
- Photos: see `docs/` photo credit files and `public/photos` manifests.
- Narration voice: Microsoft neural TTS; check the provider's terms before commercial use.
