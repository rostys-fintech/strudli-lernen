# Strudli Lernen — Stage 09: Lesen (first usable release)

Date: 23 November 2026. **Draft Preview only.** This is a new reading practice module and not a full A0–B2 graded reading curriculum.

## What is implemented

- **6 original, short A0–A1 stories**: *Ein neuer Morgen*, *In der Bäckerei*, *Der Bus zum Krankenhaus*, *Eine neue Wohnung*, *Im Deutschkurs*, *Ein Paket für Oma*.
- Two-language interface (Ukrainian/English) with German as the reading language. Each sentence has a Ukrainian and an English translation, hidden until requested.
- **Tap any German word** to see its contextual meaning in the chosen language and hear its pronunciation. Every word in the six stories is checked against a dedicated shared or story-specific glossary. **Case-sensitive Sie vs sie** and **contextual Karte (payment card vs greeting card)** have separate entries.
- **Listen** to individual sentences or the entire story using the existing German audio service (device speech synthesis; platform audio quality varies).
- **3 comprehension questions per story**, 18 total, with immediate correct/incorrect feedback, retry and continue.
- Story completion and best quiz score are stored under `strudli-lesen-progress-v1` using existing local storage. This key is included in the existing progress export/import mechanism, preserving original archive format compatibility.
- Mobile-first, keyboard-friendly warm cream/gold/burgundy UI with the approved Strudli book and success poses. No new character drawings, no external AI services or paid APIs.
- New home-screen launch card *Lesen · A0–A1*, integrated as a distinct screen in existing app routing; the existing logo remains a quick route back home. Current bottom navigation and all existing vocabulary/fluency features are left unchanged.

## QA and safety

`scripts/check-lesen.mjs` validates six story IDs, two A0 and four A1 stories, 18 comprehension questions, every sentence's DE/UA/EN content, **word-by-word glossary coverage**, distinct meanings of Karte/Sie, navigation, German audio controls, mobile focus styles and backup key. Included in `npm run check:all`.

Previous Stages 05–08F, all 1,177 stable vocabulary IDs and audited displayed examples, approved Schrank image, mascot poses, 3-flame mastery and user progress remain untouched.

## Limitations / next iteration

This initial module has six stories, not a large reading library. The quizzes are written and checked as structured three-option questions, but this automated pass does not establish professional external proofreading, long-term retention or cross-browser device audio quality. TTS voices depend on installed German voices, device and browser.

After user approval, the next reading stage could add 8–12 A1–A2 stories with branching outcomes and targeted high-frequency vocabulary, plus a clearer reading progress timeline. Do not integrate paid AI dialogues without a separate decision.

## Release

Draft PR stacked on Stage 08F PR #45. No changes to production or `main`; validate on iPhone Preview before release.
