# Strudli Lernen — Stage 1 brand lock
Date: 2026-11-22. Source of truth: user-approved design board uploaded in the conversation on 2026-11-22.

## Approved, do not redesign
- Product name: **Strudli Lernen** (former working name IDL).
- Mascot: smiling, golden apple-strudel superhero with an apple slice and leaf, an S badge, sneakers and a black-red-gold cape.
- **App icon**: the **lower-left rounded-square portrait** on the design board. Use the clean original without the user-drawn yellow annotation/outline from the marked screenshot.
- **Header logo**: the user selected the **full horizontal “Strudli Lernen” graphic wordmark** from the upper-right of the approved design board on 2026-11-22. Use this wordmark in the app header on desktop and mobile; scale responsively without redrawing it. This does not replace the separate square app icon.
- The original image is source material; do not substitute a newly invented mascot or generic logo.
- German is the **language being learned**. Additional languages would be for translation of German vocabulary, not languages being taught.
- Existing word IDs, user progress keys, exercises, card photos and learning data remain untouched.

## Implemented on this feature branch
- Title, meta description, PWA app name, on-screen brand and dictionary title updated to Strudli Lernen.
- The approved lower-left icon has been cropped from the source board and embedded in `public/icon.svg` as a WebP image (128px preview asset); the source-quality 268px crop is retained in the local asset pack for final-quality exports.
- Header uses the approved horizontal graphic wordmark, on a matching warm-light background, with responsive sizing for narrow iPhone screens.
- PWA service-worker cache version updated to prevent stale branding.
- No rename of the GitHub repository, URLs, localStorage keys, user data or working learning components.

## Mascot pose map — approved image board, integration in next stages
| Pose | Intended placement |
|---|---|
| Classic superhero (main top-left drawing) | Home hero and marketing |
| Waving (bottom row) | First-run introduction and onboarding |
| Holding A1 book | Vocabulary learning and future Lesen |
| Headphones | Listening exercises |
| Thumbs up | Correct answer and celebration |
| Lower-left square portrait | Favicon, header brand mark, PWA icon |

These are references for later animation, **not claims that the animations have already been implemented**. Crop references preserve the approved visual; advanced animation and user flow must be reviewed after stage 1.

## Scope of the next implementation phases
1. Onboarding mascot with Welcome, Skip, topic selection and replay.
2. Replace visible three stars with three flames; adjust incorrect-answer logic from reset-to-zero to minus one stage. Keep mastered words recoverable for review.
3. Manual Next after answer + A0–A1 example, translation and speech; keep German word and translation visible before choosing der/die/das.
4. Global UA/EN/AR translation language selector, with full translated data coverage reviewed before launch.
5. Additional Lesen module only after the current learning flows have been stabilized.

## Stage 1 QA
Verify exact wordmark asset, icon portrait, warm-light header background, narrow iPhone layout, service-worker cache refresh and existing CI checks. Do not merge this branch into main until user reviews stage 1. Keep the old canonical UI and live site unchanged during review.


## Stage 2 — guided onboarding
- First-run tour contains five concise steps: welcome, topic selection, word/article practice, the four Practice modes, and completion.
- The approved Strudli portrait is shown only on the welcome and completion steps. Intermediate steps use simple interface previews, not additional mascot artwork or generated images.
- The exact approved horizontal Strudli Lernen wordmark remains in the application header.
- Skip, Back, Next, Escape, topic handoff and Practice handoff are wired; completion is persisted under `strudli-tour-complete-v1`.
- The guide can be replayed from Home and Progress. Keyboard focus is trapped while open and returned to the opener when dismissed.
- Mascot motion is subtle and respects `prefers-reduced-motion`; the dialog has short-screen and narrow-mobile layouts.
- A dedicated source-contract check is included in `npm run check:all`. Existing vocabulary, photo, progress, and learning logic are unchanged.
