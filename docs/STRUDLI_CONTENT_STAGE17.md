# Strudli Lernen — Stage 17: useful content expansion

## Intent
Make Strudli a practical A0–A2 German learning experience rather than a repeated der/die/das quiz. Preserve the approved home design, mascot, original 1,177 cards and existing progress storage.

## Shipped into the feature branch
- **Everyday audio**: 100 author-written DE/UA/EN phrases, 10 equal situations (10 each): introductions, conversation repair, shopping/cafés, transport, housing, health, public offices, work/study, social plans, solving problems. Category filters, random phrase, voice replay, and optional hide-German/recall-then-reveal mode.
- **Practice**: 110 additional original A1–A2 items: 24 verb forms, 14 cases, 36 situational dialogues, 36 sentence ordering tasks. Original task data remains unchanged.
- **New practice mode — “Що сказати?” / “What would you say?”**: select the matching German phrase from three context-relevant options. Uses the full 100-phrase bank and the existing answer feedback, audio and mobile Next button.
- **Listening**: balanced exposure to short real-life phrases and single vocabulary words; translations remain bilingual.
- **Lesen**: 4 new narrative stories, 20 DE/UA/EN sentences and 3 comprehension questions each, four 5-sentence paragraphs, per-word glossaries and narrator compatibility. Titles: “Der Schlüssel im Café”, “Eine Nachricht im Treppenhaus”, “Der erste Tag im Buchladen”, “Ein Abend ohne Internet”. The catalogue now contains 10 stories (200 sentences, 30 questions).
- **Contextual Strudli helper** and general onboarding include the sixth game.

## Architecture
- `src/everydayPhrases.ts` — primary typed phrase bank; shared between Audio, listening and phrase selection.
- `src/practiceExtra.ts` — additions to original unchanged practice rows, including English translations.
- `src/practice.ts` — feeds new datasets to the 6 practice modes.
- `src/StrudliAudio.tsx` and `src/strudli-audio-content.css` — category browsing and recall mode.
- `src/lesenStoryContentC.ts` + `src/lesenStories.ts` — new trilingual stories using existing narration, progress, and tap translation.
- `scripts/check-content-stage17.mjs` — completeness and consistency assertions; added to `check:all`.

## Verification
- Content integrity: **PASS** for 100 phrases, 110 extra exercises, 80 new trilingual story sentences, 12 comprehension questions, 0 untranslated words.
- Original Practice and Lesen QA: **PASS**.
- Full TypeScript `tsc --noEmit`: **PASS** across 53 source files (before final editorial-only wording adjustments).
- Selected TS/TSX transpilation: **PASS**.
- **Not yet live in a new Vercel preview**: the Vercel API returned `402 api-deployments-free-per-day` for the attempt. Existing production and previous preview deployments are unaffected.
- Browser-based visual, audio-volume and real-device interaction tests remain necessary.

## Next content-led iterations
1. Branching dialogues (choose a response, see its consequence and the next conversational turn).
2. Error-driven review of weak phrases by situation instead of random repeats only.
3. Short authentic-format reading (messages, schedules, notices, apartment listings) besides narrative stories.
4. Dictation and sentence transcription by ear; preserve accessibility and no mandatory timer.
