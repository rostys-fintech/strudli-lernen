# Strudli Lernen — roadmap after approved Stage 04C.2
Updated: 23 November 2026 · status: staged, draft branches only

## Approved foundation
- Stage 01: user-selected lower-left Strudli app icon and full approved wordmark. **Never regenerate or substitute this branding.**
- Stage 02: skippable five-step introduction, Back/Next and replay.
- Stage 03: three persistent flames, +1 correct / −1 wrong, visual and audio feedback.
- Stage 04 / 04C.1: German card, language-aware translation, verified contextual examples where available, manual Next, third-flame mascot catches the **actual on-card word** and takes it offscreen.
- Stage 04C.2: accepted on 23 Nov 2026: German word speech starts from the *same answer tap* as the flame effect; no 880 ms timer. Existing ~2.18 s character flight retained.

## Stage 05 — complete Strudli personality and warm brand identity
### 05A — warm interface styling (current implementation)
The user explicitly requested removal of the leftover cold blue WortWelt look in **colors, backgrounds, buttons, typography, navigation and UI accents**. Use the already approved *Strudli Lernen App Flow* reference, not a newly generated logo.

Visual direction:
- Vanilla/cream backgrounds, warm parchment surfaces, soft brown text.
- Burgundy/red primary controls and warm golden highlights, based on the black–red–gold identity on the mascot and logo.
- Rounded readable type, mobile-first spacing, subtle warmth rather than strong neon gradients.
- Maintain accessible contrast, focus states, iPhone safe areas, responsive layout, reduced-motion support.
- **Exception:** the already-approved article semantics are fixed: **der blue #2585DA, die coral #F05170, das teal #0EAD94** on headings, buttons and onboarding examples. Blue is still allowed only where it conveys `der`, not as a sitewide brand color.
- Do not change vocabulary, photographs, localStorage keys, card progression, animations, sounds, onboarding logic or the approved Strudli artwork.
- Stage 05A remains a separate Draft PR branched from Stage 04/PR #31. No merge or production deployment.

### 05B — Four exact approved Strudli poses (implemented in a Draft PR; awaiting mobile visual review)
The four poses (wave, A1 book, headphones, success/thumbs-up) are cropped directly from the approved 22 November brand board into a transparent, **self-hosted** four-frame sprite: `public/strudli/strudli-poses-approved-20261123.png`. No alternative character artwork was generated. The five-step onboarding uses: wave → book → book → listen → success. The game-completion screen also shows the success pose. The icon, wordmark and flying-word mascot remain unchanged. Poses have subtle motion and respect reduced-motion preferences. Check appearance/cropping and layout on a physical iPhone before the user accepts Stage 05B.

## Later, not part of Stage 05A
- Remaining sentence quality/content completion: approximately 951 vocabulary cards lacked individually verified bilingual sentence pairs at the Stage 04 audit; this is tracked for the separate Stage 08 content phase. Don't fabricate examples.
- Lesen: short A0–A1 passages, expandable to A2, tap a word for translation/pronunciation and answer comprehension questions. Content and volume require a separate review; not implemented here.
- Strudli Sprint: fast mini-game, roadmap Stages 09–11; not implemented.
- “Штрудліц” narrative branching/Boss Fight: roadmap Stages 12–15; not implemented.
- Advertising/demo video is a separate deliverable after core site features, not a prerequisite for Stage 05A.
- Do **not** add AI companion/chat or speaking exercise: those were declined by the user.

## Acceptance tests for 05A
1. Main screen, topic chooser, word cards, Practice, dictionary, progress and onboarding have a cohesive warm visual tone instead of WortWelt blue.
2. All 1,177 stable cards/IDs and all previous tests remain intact.
3. The three article colors remain *exactly* unchanged and distinguishable.
4. Approved full Strudli wordmark, icon, mascot image and flying-word animation still display.
5. Preview-only Vercel deployment; no merges, `main` or production changes.
6. Manual iPhone review is required before acceptance.
