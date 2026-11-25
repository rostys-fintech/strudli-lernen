# Strudli Lernen — Stage 08A: sentence editorial QA

Date: 23 November 2026. Implemented as a **Draft Preview**, not merged to production.

## Why this stage is necessary
The full-coverage baseline supplies DE/UK/EN triples for all 1,177 stable cards but was intentionally generated as a safety net. A large share of baseline records repeat "Auf dem Bild ...", "Hier ist ...", or "Ich möchte ...". Such examples are often grammatically passable but too repetitive to teach vocabulary in context. Numerical completeness is not equivalent to linguistic quality.

## Stage 08A finished in this branch
- Added exactly **108 individually edited German A0–A2 usage examples with Ukrainian and English translations** to `src/reviewedCardExamples.ts`.
- Six priority areas: **institutions and documents (19), banking (17), housing (7), public transport (24), shopping (19), and city/directions (22)**.
- Every new example has a stable existing word ID and a distinct, relevant sentence rather than an image-description placeholder.
- The resolver uses the existing reviewed food, usage, dictionary, original, and expanded examples first, then this editorial set, then the full-coverage baseline.
- The previous complete 1,177-card dataset, voice playback, interface languages, images, article colors, game flow and persisted user progress are untouched.
- Dedicated test `scripts/check-reviewed-examples.mjs` runs in `check:all` and verifies all IDs, three translations, no photo boilerplate, vocabulary preservation, and source precedence.

## Important limitation and follow-up
This batch is **not** a certification that the remaining baseline examples are individually edited or that all translations have undergone external professional proofreading. The next batches should cover other practical categories, including technology, home, clothing, family, health, verb conjugation and adjective agreement. For each, review naturalness, grammar, semantic fidelity to the intended word and translations (not only automated syntax).

## Representative transformations
| Word | Stage 08A edited example |
| --- | --- |
| die Aufenthaltserlaubnis | Für meinen Aufenthalt brauche ich eine gültige Aufenthaltserlaubnis. |
| der Kontoauszug | Auf dem Kontoauszug sehe ich alle Zahlungen. |
| die Warmmiete | Die Warmmiete beträgt achthundert Euro im Monat. |
| der Fahrkartenautomat | Der Fahrkartenautomat nimmt keine Münzen an. |
| der Rabatt | Auf die Schuhe gibt es zehn Prozent Rabatt. |
| die Umleitung | Wegen der Baustelle gibt es eine Umleitung. |

## Release scope
Draft PR stacked on Stage 05B PR #36. Preview deployment only. User approval and mobile review should precede any merge to main / production.
