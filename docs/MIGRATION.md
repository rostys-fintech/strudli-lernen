# Migration audit — 20 October 2026

- Repository created by the owner, private, on GitHub. This commit contains an **independent working React/Vite preview only**. It **does not** claim the Floot application is fully migrated.
- Current published Floot app: https://wortwelt-de-ua.floot.app — KEEP RUNNING.
- Original dataset: 24 topics, 952 records. Pending exact export of helpers/vocabulary.tsx once Floot's 100-call/day limit renews at 20:00 UTC on 21 Oct 2026.
- Read helpers: practiceRound, germanAudio, reviewLearning, extraPractice; actual pages/_index.tsx and module.css; preserve legacy IDs/storage keys and image URLs or migrate image bytes with licenses.
- Audio needs real iOS Safari user activation tests. Recordings from Wikimedia must be checked for URL and licensing.
- New GitHub/Vercel domain gets separate localStorage; export via source-app button or a JS export utility on the old origin, then import JSON on the new origin. Never import strangers' backups.
- Full release gate: 952 records, 24 topics, clean typecheck/tests, verified photo mapping, pronunciation and navigation tests at 320, 375, 393 widths, then Vercel deployment. Do not change the old domain before sign-off.
- Demo URLs referencing the old Floot site are temporary and must be replaced with correctly licensed bundled assets.
