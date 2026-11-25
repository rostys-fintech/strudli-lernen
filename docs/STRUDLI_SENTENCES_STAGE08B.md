# Strudli Lernen — Stage 08B: contextual German sentences

Date: 23 November 2026. Draft only; no production changes.

## Objective and results
Replace low-information generic sentences (for example "Auf dem Bild ist ...") with specific natural German usage in familiar, useful scenarios. Every authored sentence has its own existing vocabulary card ID and complete Ukrainian and English translations.

**189 new contextual sentence triples across 10 topics:**
- Technology / digital life — 30
- Clothes / shopping for clothes — 40
- Rooms — 12
- Furniture — 6
- Household chores and objects — 22
- Family — 13
- People — 12
- Body parts — 15
- Symptoms — 5
- Daily routines — 34

Source files: `src/reviewed08bHome.ts` and `src/reviewed08bLife.ts`.

**Example:** `technology-254` → *Ich habe mein Passwort vergessen.* → Я забув свій пароль. → I forgot my password.

**Example:** `ww-new-096` → *Wo ist die Fernbedienung für den Fernseher?* → Де пульт від телевізора? → Where is the remote control for the television?

**Example:** `body-709` → *Mein Knie tut beim Treppensteigen weh.* → У мене болить коліно, коли я піднімаюся сходами. → My knee hurts when I climb stairs.

## Priority and preservation
The `cardExampleFor` resolver preserves the same source order:
1. Previously approved Food, usage, dictionary, and original-exercise examples
2. Earlier expanded examples (223)
3. Stage 08A reviewed examples (108)
4. Stage 08B reviewed examples (189)
5. Generic complete baseline as a final safety net

The existing 1,177 stable vocabulary IDs, image/photo mappings, article colors, app mascot, 3-flame progress, voice playback and manual "Next" remain unchanged. Stage 08B does not alter the original base dataset.

## QA
`scripts/check-reviewed-08b.mjs` validates 189 distinct IDs, complete three-language sentence triples, punctuation, non-boilerplate German examples, ten topic assignments, and non-overlap with Stage 08A. It verifies the source precedence and that the 1,177-card baseline is retained.

Automated tests are necessary but do not establish professional linguistic proofreading or perfect semantic appropriateness. Spot-check all intended meanings and audio pronunciation on iPhone before final public publication.

## Next editorial batches
- Stage 08C: transport, tourism, nature/animals/weather, studies, leisure and remaining phrases/pronouns/prepositions
- Stage 08D: German **verbs and adjectives** — conjugation, separable prefixes, cases, agreement, accurate translations, avoiding repeated "Ich möchte ..." examples
- Final editor pass: find remaining repeated template patterns, review examples against each image and word sense, verify both translations, and document coverage levels separately from linguistic QA

Release: stacked Draft PR on Stage 08A PR #39; Preview only. Merge needs an explicit user decision.
