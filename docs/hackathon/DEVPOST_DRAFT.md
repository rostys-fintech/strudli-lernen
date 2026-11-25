# Strudli Lernen — Devpost submission draft (superseded by SUBMISSION.md)

Draft, 24 Nov 2026. Every number below is taken from the repository; re-check before submitting.

**Tagline:** German for newcomers, like going to the cinema: watch a painted story, tap any word, then play it in a quiz show.

## Inspiration
More than a million Ukrainians now live in Germany. Most of them learn German as adults, in the evening, on a phone, after work or a course. Vocabulary apps teach isolated words, and graded readers are dry. We wanted German to feel like a film: a calm narrator, beautiful pictures and a translation exactly when you need it, in Ukrainian or English.

## What it does
- **1,177 illustrated word cards in 47 everyday topics** (Bürgeramt, Bus & Bahn, doctor, renting, shopping…), with Ukrainian and English translations, article colours (der / die / das), audio and a three-flame mastery system.
- **Cinematic stories (Lesen):** a hand-painted story plays like a short film. A neural narrator reads it slowly, subtitles highlight each spoken word, and tapping any word pauses the story and shows its meaning, IPA, a simple example sentence and pronunciation. Separable verbs open as one unit (*lädt … ein*). Every story has A1 and A2 versions, three comprehension questions and a native fullscreen video for phones. The first public story is the Brothers Grimm tale *Die Bremer Stadtmusikanten*.
- **Strudli Arena:** an optional game-show quiz with three big buttons, a 15-second timer, points for speed and an original music loop. Rounds: which article, which adjective ending, what is in the photo, words from a story, and words the learner saved while watching.
- **Calm practice and reading:** verb and case exercises, real-life dialogues, listening, sentence building and six classic illustrated reading stories with 120 sentences.

## How we built it
- React 19, TypeScript and Vite, hosted on Vercel; progress is stored only in the browser.
- **An AI production pipeline for stories:** an AI writes the A1/A2 script and glosses for every word; an image model paints seven scenes from one locked style guide and a character sheet; a neural voice (Microsoft *ConradNeural*) narrates in GitHub Actions and returns real word-boundary timestamps; a script renders the native MP4 with fixed camera and gentle ambient motion. A new story takes about a day, and the person mostly reviews.
- **AI coding agents** (Claude and ChatGPT) built and reviewed most of the app through pull requests, with automated content checks (every subtitle word must have a gloss, every card a translation, an example and a photo).

## Challenges we ran into
- Making word-by-word highlighting match real speech: we use the voice service's own word timestamps, not estimates (98–99 % exact).
- Fullscreen on iPhone: Safari cannot fullscreen interactive HTML, so stories ship a real H.264 video for fullscreen and keep the interactive player inline.
- Consistent characters across seven generated paintings: a character sheet attached to every prompt.
- German ambiguity: *sie* can mean *she* or *they*; the player shows the meaning for the exact token in context.

## Accomplishments that we're proud of
A learner can watch a 60-second story, understand every word, and then practise exactly those words in the Arena, all in one app and all in their own language.

## What we learned
AI is fastest when the human sets taste and rules: one approved style, one approved voice and pace, automated checks, and the AI producing within them.

## What's next
More stories from everyday life in Germany (bakery, doctor, Jobcenter), the Odyssey and German legends; spaced repetition; multiplayer Arena with a PIN code; an app-store release.

## Built with
react · typescript · vite · vercel · github-actions · claude · chatgpt · microsoft-neural-tts · ffmpeg · web-audio-api

## Links (to fill in)
- Demo: production URL after the release
- Public repository: to create (a clean snapshot without private pilot material)
- Video: YouTube link, 2:30–3:00
