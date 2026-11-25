# Strudli Lernen — Stage 04: bilingual card feedback + manual Next

## Protected requirements
- Stage 03 three-flame progress, word IDs, photo mappings, onboarding, approved logo, mascot and all other modes remain unchanged.
- Article prompt shows the German word and its translation **immediately**, without revealing the article prematurely.
- Non-noun translation-choice prompts keep the target translation hidden until the learner answers correctly.
- Correct: award one flame, persist the upcoming round immediately, play the word pronunciation, show the source-backed example (German + global UI language translation), and **wait for the user's Next tap**.
- Mistake: subtract only one flame and allow another attempt on the same card.
- Next: cancel current speech safely, display the next word, or show completion at the end.
- The global language toggle remains UA/EN in the header; no exercise-level language choice was added.

## Source policy and audited coverage
- Use the curated `Library.EXAMPLES` German/Ukrainian pairs and their checked English equivalents.
- Use the 53 existing German/Ukrainian original exercise sentences aligned with `ORIGINAL_ENGLISH_SENTENCES` where a token-exact lemma match is appropriate.
- Use 56 context usages where an exact word ID has an explicit Ukrainian/English translation. A noun's different sense must not be inferred from text similarity.
- Audited matching coverage against 1,177 current vocabulary IDs after the Food & Drinks revision: **226 cards** with complete bilingual examples, including **115/115 Food & Drinks cards**. Remaining: **951 cards** still need individually checked contextual sentences and photo matching.
- The entire **Food & Drinks** section (all six subtopics, 115 word IDs including Kiwi and Ananas) now has individually authored German sentences with Ukrainian and English translations. These are curated entries, not generated generic nouns or article templates.
- The three-flame indicator has visually distinct graduated yellow/orange/red artwork, continuous idle movement, a strong ignite/fizzle transition, and original synthetic fire sound effects. A visible audio test/enable button is on the game screen; user device mute/volume settings still apply.
- The UI never invents a sentence for a card with no complete bilingual example: it hides the empty sentence panel, showing the correct result and a compact manual Next button without misleading "example coming soon" placeholders.
- The remaining 951 are a **content-completeness blocker** for the later full sentence-quality phase (Stage 08); no claim of 100% sentence coverage is made in Stage 04.

## Validation
- Dedicated `scripts/check-cards-stage4.mjs` checks answer flow, no automatic audio-timed advance, translation visibility, both language sources, responsive layout, 1,177 IDs, brand, prior flames and build pipeline.
- All previous checks must pass, including Stage 03 and Stage 02.
- This Stage 04 branch is based on Stage 03 draft PR #30. Build and inspect a Vercel Preview without merging to main, Stage 03 or deploying to production.
- A physical iPhone tap-through and screenshot remain required before final acceptance.
