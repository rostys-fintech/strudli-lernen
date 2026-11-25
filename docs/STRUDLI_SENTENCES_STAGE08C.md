# Strudli Lernen — Stage 08C: nature, travel, school, leisure and time

Date: 23 November 2026. Draft Preview only.

## 151 new contextual example triples (German / Ukrainian / English)

| Topic | New entries |
|---|---:|
| Landscapes | 14 |
| Weather | 13 |
| Animals | 17 |
| Tourism | 19 |
| School | 22 |
| Leisure | 20 |
| Calendar | 36 |
| Vehicles | 10 |
| **Total** | **151** |

Source files: `src/reviewed08cOutdoors.ts` and `src/reviewed08cLife.ts`. Each entry is anchored to its original stable word ID. Edited German examples replace baseline picture descriptions when no previously approved authored example is present.

Examples:
- `nature-493`: **Der Fluss fließt durch die Stadt.** — Річка протікає через місто. — The river flows through the city.
- `ww-new-128`: **Wegen des Nebels kann ich die Straße kaum sehen.** — Через туман я майже не бачу дороги. — I can hardly see the road because of the fog.
- `study-638`: **Welcher Artikel gehört zu diesem Nomen?** — Який артикль належить до цього іменника? — Which article goes with this noun?
- `hobbies-752`: **Im Sommer gehen wir oft in den Bergen wandern.** — Улітку ми часто ходимо в походи в гори. — In summer, we often go hiking in the mountains.
- `time-781`: **Im Januar ist es oft sehr kalt.** — У січні часто дуже холодно. — It is often very cold in January.

## Integration and regression safety

`cardExampleFor` prioritizes all existing approved Food, usage, dictionary and original examples, then expanded (223), Stage 08A (108), Stage 08B (189), then Stage 08C (151), and finally the complete fallback covering all 1,177 words.

The test `scripts/check-reviewed-08c.mjs` verifies the count, eight topics, valid unique word IDs, three-language completeness, absence of photo boilerplate, no duplicate German examples, non-overlap with older approved datasets and correct source order.

No changes to images, card IDs, articles, theme, mascot animation, voice, progress keys or game mechanics. Draft changes only; physical iPhone testing and editorial spot-checking remain useful.

## Remaining editorial work

- Stage 08D: 113 verbs and 94 adjectives, with special attention to conjugation, separable verbs, negation, case and adjective agreement.
- Additional grammar-focused QA: phrases, question words, prepositions, adverbs, pronouns.
- Final pass: identify remaining baseline-generated sentences, check contextual relevance to vocabulary meanings, both translations and pronunciation, and report verified coverage rather than equating completion with quality.
