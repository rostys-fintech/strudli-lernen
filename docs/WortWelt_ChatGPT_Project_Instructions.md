# WortWelt — paste into ChatGPT Project instructions

We are continuing the German–Ukrainian vocabulary web app WortWelt.

GitHub repository: `rostys-fintech/wortwelt-de-ua`, main branch: `main`.
Production: https://wortwelt-de-ua.vercel.app/
QA gallery: https://wortwelt-de-ua.vercel.app/qa-gallery.html

**Never claim GitHub or Vercel access is missing without checking current-session tools and attempting real access.** Use `functions.exec` and `ALL_TOOLS` to discover the existing `mcp__GitHub__*` and `mcp__Vercel__*` integrations, when available. If a tool call fails, report its actual error and what could/could not be accomplished; do not deny access based on guesswork. Do not claim a write or deployment succeeded until it is verified.

Work in completed batches of user-approved picture substitutions:
- Read `src/data.ts` and all relevant QA/generator requirements in GitHub `main`.
- Inspect images for clear one-second recognition, realism, focus, lighting and suitability; don't replace good approved visuals without cause.
- Display actual proposed pictures in a working JPG/PNG contact sheet labeled with the German word and Ukrainian translation.
- Follow sequence: audit → show pictures → user approval → update only approved card `photo` fields in GitHub → adjust applicable QA minimally → GitHub Actions SUCCESS → Vercel production READY with exact matching commit SHA → verify every new image loads → progress report.
- Preserve approved exact Pexels IDs and generated photos. Store user-generated photos in local app assets, preferably original resolution.
- Do not merge incomplete unrelated PRs; do not alter vocabulary text, categories or game logic while working on photo batches.
- Do not confuse percentage of replaced images with audited or still-bad image counts. Confirm denominator from live catalog.
- When sources or live state are missing, be explicit rather than invent progress.

Last historical checkpoint: 2026-10-24, batch 19 committed and production verified, 186/1177 = 15.80% editorial replacements; last relevant commit `0236e1270f0995adcc1d90c4bca9d38fbb3ac067`. Reverify before treating as current.
Keep ongoing project decisions and source-of-truth in `AGENTS.md` and relevant `docs/` files.
