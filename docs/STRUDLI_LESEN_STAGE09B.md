# Strudli Lernen — Stage 09B: longer storybook Lesen + continuous narration

Date: 23 November 2026. **Preview only**.

## What changed

The six original Stage 09 stories have been rewritten into short **plotted mini-stories**, each with:
- **20 German sentences** in **four flowing 5-sentence paragraphs** (6 stories = **120 sentences and 24 paragraphs**).
- A narrative arc rather than a short list of isolated practice sentences: a beginning, a problem and a resolution.
- Aligned Ukrainian and English translations for every sentence in the source; unlike the previous UI they are **not interleaved after each German sentence**. A single **Show full translation** toggle under the text displays four paragraphs.
- Word-by-word click interaction remains available anywhere within the **continuous prose**, with a floating bottom meaning card, German word audio and the original article whenever available.
- 290 additional Ukrainian/English lexical glosses; a required QA check asserts every visible German lexical token is covered.
- Retained three comprehension questions per story; question details adjusted to follow the extended plots.
- Full-story narration uses **one Play/Stop button**. It speaks four consecutive paragraphs as one uninterrupted reading session (a natural paragraph boundary), never asking learners to click each sentence. Browser speech synthesis provides a local German voice with a preference for available male-sounding voices, but actual installed voice and quality depend on the user's device.
- `src/lesenNarration.ts` can prefer a pre-rendered audio URL whenever a stable approved external track is configured in `RECORDED_STORY_AUDIO`; this release deliberately does not claim generated speech exists.

## HeyGen narrator status

We identified HeyGen German public male voice **Albrecht — Calm & Trustworthy** (`voice_id=20cd33ab51e546009b390d207842580f`). One authorized full-story generation request for the revised first story was **refused** with HeyGen code `insufficient_credit` / HTTP 402: the connected workspace has too little monthly free speech allowance remaining. **No HeyGen audio was created, consumed or uploaded; there are no fake audio links.** The platform returned the user-visible plans page https://app.heygen.com/home?surface=chatgpt_plans&utm_source=chatgpt . No automatic retry, invented reset time or upgraded HeyGen subscription.

The current Preview therefore runs a **whole-story device voice fallback**. Once speech allowance is available and audio is approved, the same component can serve **one recorded narrator track per story**, without redesigning the reader.

## Build and persistence

- `src/lesenStoryContentA.ts`, `src/lesenStoryContentB.ts`, `src/lesenGlossary.ts`: longer plots, translations and extensive glossary.
- `src/Lesen.tsx`, `src/styles.css`: book-like paragraphs, large tap targets, floating translation card, one whole-story narrator control.
- `src/lesenNarration.ts`: paragraph-continuous speech playback and future approved recorded-track support.
- `scripts/check-lesen.mjs`: validates exactly 120 fully translated sentences, four paragraphs per story, all lexical meanings, translation toggle, future audio assets status, responsive styling and preserved progress.

No changes to any of the 1,177 legacy flashcards, image mappings (including approved Schrank), article colors, Strudli poses or game mechanics. The prior sentence audit remains a required check in `check:all`.

Release is a Draft PR stacked on Stage 09 PR #46. Keep main and production intact until the user approves the Preview after mobile QA.
