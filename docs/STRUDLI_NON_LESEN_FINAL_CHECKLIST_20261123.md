# Strudli Lernen — non-Lesen completion checklist
23 November 2026 · Preview/Draft status

## Confirmed and fixed in Stage 10 (current Draft branch)

1. **Dictionary example bug**: The detail UI used the original `EXAMPLES` object containing 27 lexical headwords, even though Stage 08F's `cardExampleFor` resolver already selected a complete DE–UA–EN triple for all **1,177** cards. This caused "Приклади для цього слова ще готуються." and, for some English-language old examples, fell back to German instead of a genuine English translation.
2. Dictionary detail now uses `cardExampleFor(word,language)` by **stable word ID**, including the actual reviewed sentence, user-selected Ukrainian/English translation and German sentence audio. Approved secondary dictionaries remain in the resolver unchanged.
3. The **Речення / Sentences** section previously listed only `ORIGINAL_SENTENCES`, while the vocabulary already has 1,177 effective contextual sentences. It now uses the same resolver for each card, searchable by word and filterable by topic/favorites. Show-more adds 72 rows on demand to avoid rendering all 1,177 at once on a phone.
4. Existing approved interface, illustrations, full vocabulary, game audio, fire mechanic, Strudli mascot, progress and Lesen branch preserved.
5. New `scripts/check-dictionary-example-sync.mjs` in `check:all` protects the 1,177-row reviewed database against regression in the Dictionary and Sentences views.

## Remaining non-Lesen work (verified vs to inspect)

### 1 — Photo QA / missing image assets (confirmed from Stage 09B Vercel build)
- The approved 21 November photo import reports **9 outstanding assets** after recovery: six word IDs `0112`, `0115`, `0129`, `0136`, `0144`, `0149`, plus three cover assets `C33`, `C34`, `C40`. **Do not claim they are all currently blank** without a mobile visual audit; these are unresolved import/recovery entries.
- One externally hosted `Wörterbuch` photo (`study-661`) fails the build's mirroring step with HTTP 400; prioritize a clear, rights-safe locally hosted replacement, with a specific image approval where required.
- Inspect incorrectly cropped / blurry generated pictures and the user-approved replacement batch on mobile. Do not regenerate approved calendar/Schrank images or overwrite other images without review.

### 2 — Mobile QA before public release (still manual)
- Test Dictionary, Sentences, Search, Topics and Favorites on a real phone in both UA and EN modes.
- Check long words, card text wrapping, picture fit, audio playback, article colors, 3-flame behavior, manual Next and back-to-home navigation.
- Check progress export/import between preview/production domains: local storage is domain-specific; do not assume progress transfers automatically.

### 3 — Consolidated release (not done yet)
- Recent improvements are stacked as **Draft PRs (#31–#48 and current Stage 10)**, not merged into `main`. Verify PR lineage/conflicts, automated checks and image approvals before producing one release candidate.
- Vercel previews can be protected; use a time-limited shareable URL for external mobile testers. Do not disable project-wide authentication or move Draft to production without user approval.
- After final test and explicit go-ahead, merge reviewed work and verify the public tester URL, branding and manifest/installability.

### 4 — Optional, not current blockers
- Expanded speaking/dialogue AI would involve ongoing API costs and remains a separately approved future product idea, not a current requirement.
- Any new features should follow the agreed animated, story-driven Lesen concept rather than divert resources from fixing existing vocabulary functionality.

## Known limits

Stage 08F QA confirms all 1,177 effective DE–UA–EN sentence triples with zero source duplicates and no generic fallback. This **does not** certify that all 1,177 text/image pairs are independently human-proofread or that synthesized audio has been tested on each device.
