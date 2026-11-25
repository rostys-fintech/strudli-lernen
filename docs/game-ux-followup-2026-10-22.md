# WortWelt UX audit follow-up — 2026-10-22

Browser QA of published app confirmed: answer translation hidden until correct, neutral buttons, wrong-answer red and right-answer green. However the adjective **arm** still displayed a placeholder because not all 1174 words are illustrated.

## Corrective patch
- Added two new verified Wikimedia photograph assignments: arm (empty wallet, CC BY-SA 4.0 BigBruiser) and sicher (padlock, CC0 Bich Tran), with copyright credits.
- Added 9 associative existing curated images to visually recognizable verb cards, without changing any noun media mappings.
- Coverage now 906/1174 (77.2%); 268 non-noun cards still have no image.
- Added scripts/check-game-ux.mjs to npm run check:all to catch premature translations, colored choice buttons, and missing priority photos.
- Curation for grammatical/conceptual words remains outstanding; do not use arbitrary photographs to reach 100%.

## Assignments
- putzen (everyday-55) ← Besen
- sich ausruhen (everyday-65) ← Sofa
- warten (everyday-70) ← Uhr
- anziehen (everyday-73) ← Jacke
- warten (verbs-855) ← Uhr
- zeigen (verbs-860) ← Finger
- putzen (verbs-866) ← Besen
- anziehen (verbs-868) ← Jacke
- stehen (verbs-871) ← Mensch

## Release QA
Pending CI build and live Vercel photo mirror verification for the two new external sources.

## Live deployment correction
- The first release mirrored 711/712 sources; padlock image for **sicher** returned HTTP 400 from Wikimedia.
- Reassigned sicher to the existing, successfully mirrored door-lock close-up used for **Schloss**. The rejected Wikimedia source credit was removed.
- Expected distinct image mirroring total after patch is 711, with no failed sources; production status must be checked after deployment.
