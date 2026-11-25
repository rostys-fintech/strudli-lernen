# WortWelt — instructions for coding assistants

This repository is the user's German–Ukrainian vocabulary learning app.
Production: https://wortwelt-de-ua.vercel.app/
Repository: rostys-fintech/wortwelt-de-ua; default branch: `main`.

## Tools and access
- The user has previously connected GitHub and Vercel to ChatGPT. **Do not claim access is unavailable without checking the currently available tools and attempting an appropriate read call.**
- In ChatGPT sessions that support it, discover `mcp__GitHub__*` and `mcp__Vercel__*` via `functions.exec` and `ALL_TOOLS`. A previous session's connectivity is not proof of access in the current session.
- If an authorized tool cannot be called, report the exact limitation or error. Never fabricate writes, deploy status, or source verification.
- GitHub and Vercel access does not confer control over ChatGPT's Projects UI, project settings, or chat placement.

## Image workflow
1. Inspect the real current card data in `src/data.ts` and relevant QA/generator files before recommending replacements.
2. Audit current actual images. Favor one clear recognizable subject/action, natural lighting, sharp focus, minimal clutter, no overlays, collages, watermarks, or extraneous text.
3. Show a real, user-viewable, verified contact sheet with German/Ukrainian labels. Do not rely on broken links or images that merely look similar.
4. **User approval comes before production edits**. Keep approved exact sources, including user-generated assets. Do not replace approved images with alternative photos without authorization.
5. For approved batches, change only targeted `photo` fields and the minimally necessary QA/generator requirements. Never silently merge unrelated pull requests or modify words, translations, topics or game logic.
6. Save provenance and candidate-to-card mappings, commit to GitHub `main`, verify both GitHub Actions (build QA and typecheck/content QA) succeeded, Vercel production is READY **at the new exact commit SHA**, and all newly changed images load from production.
7. Report the commit link, CI run results, production SHA/status, image success count, and progress. Do not count pending commits/deployments as published.
8. Track **editorial replacement count / total cards** separately from *unreviewed cards*, *missing/broken media*, and *cards that passed the visual audit*; these are not interchangeable.

## Quality and cautions
- Generated visuals should be stored as local repository assets. If imported at reduced resolution, call out the resolution truthfully; do not describe a 160×200 preview as full quality.
- The prior `Wörterbuch` Wikimedia HTTP 400 issue is separate from a batch's own source failures.
- Last previously confirmed checkpoint (2026-10-24): batch 19, 186 editorial replacements among 1,177 cards (15.80%), commit `0236e1270f0995adcc1d90c4bca9d38fbb3ac067`. **This is historical, not live state; always inspect current GitHub/Vercel before repeating these counts.**
- These rules do not authorize actions or permissions unavailable in a new session.
