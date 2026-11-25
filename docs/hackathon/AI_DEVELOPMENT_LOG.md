# AI-assisted development — what the AI did and how a person checked it

The rubric asks for evidence that AI output was reviewed (kept, changed or rejected). Each row links to real history in this repository (pull requests and commits on the `feature/strudli-lesen-cinematic-pilot-20261123` line).

| Area | AI tool and output | Human check | Finding | Decision |
| --- | --- | --- | --- | --- |
| Story glosses | Claude wrote glosses for every story word | Founder tapped words on a phone; `check:pilot` requires a gloss for every subtitle token | *sie* shown as "she" where the scene meant "they"; ticket scene *Sie* = formal "you" | **Changed:** per-token context glosses (`context` map) |
| Separable verbs | Claude glossed single tokens | Phone review of A2 text | *lädt … ein* split into two wrong meanings | **Changed:** gapped phrase matching (`phraseSpan`) |
| Narration pace | Edge neural voice at default speed | Listening review | Too fast for A1, "reads like a robot" | **Changed:** −13 % rate, sentence pauses 380–450 ms, scene pause 650 ms |
| Phrase audio | Browser speech synthesis | Founder listened on iPhone | Choppy, word by word | **Changed:** one recorded clip per phrase (`generate_phrase_audio.py`), check that all 150 exist |
| Fullscreen video | Claude's ffmpeg renderer | Watched on iPhone | Subtitles wrapped unevenly; storm image flashed before other stories | **Changed:** width 46 + WrapStyle 2; removed hard-coded first image |
| Arena design | First AI design | Founder compared with app screens | Did not match the approved Strudli style | **Rejected and redone** with practice-tile style and der/die/das colours |
| Story choice | AI drafted pilots from a video game | Rights review | Third-party IP | **Rejected for public release**; kept private, stripped from public builds |
| Scene art | ChatGPT generated several versions per scene | Founder chose versions in a PDF contact sheet | Some style drift (2.4, 2.6, 3.1) | **Kept chosen versions**, revisions planned |
| Account security | Claude designed and wrote the API | 28 scripted attacks + browser security run in CI | AI input initially only stripped markup characters | **Changed:** markup/code characters are now refused, test added |
| Photos | AI proposed replacements | Founder approved each photo in galleries | Many rejected; 139 approved | **Kept only approved** photos |

Automated gates that every AI change passes: 30+ content checks (`npm run check:all`), TypeScript, Vite build, `test:attack`, the browser security run, and the pilot QA workflow.
