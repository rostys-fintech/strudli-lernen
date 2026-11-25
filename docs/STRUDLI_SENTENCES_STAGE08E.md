# Strudli Lernen — Stage 08E: functional vocabulary and sentence quality

Date: 23 November 2026. **Draft / Preview only.**

## New sentences

Exactly **148** new individual DE–UA–EN example triples across five existing app topics:

| Original topic name | Count | Editorial focus |
|---|---:|---|
| phrases | 38 | Natural greetings, requests, practical everyday conversations |
| questions | 18 | Distinguish wie viel / wie viele, welcher / welche / welches, wessen, seit wann, bis wann |
| preps | 25 | Accusative vs dative, temporal and spatial uses, standard genitive after wegen/während/trotz |
| adverbs | 39 | Natural time/place/manner use; note source category also includes conjunctions aber/und/oder |
| pronouns | 28 | she vs they vs formal Sie; accusative/dative cases; possessive agreement |
| **Total** | **148** | All three aligned translations per row |

Implementation sources:
- `src/reviewed08eFunctionWords.ts`
- `src/reviewed08eAdverbsPronouns.ts`

Examples:
- **welches**: *Welches Zimmer ist für uns reserviert?* — Яка кімната заброньована для нас? — Which room is reserved for us?
- **gegenüber**: *Die Bank liegt gegenüber dem Rathaus.* — Банк розташований навпроти ратуші. — The bank is opposite the town hall.
- **trotz**: *Trotz des Regens gehen wir spazieren.* — Попри дощ ми йдемо гуляти. — We are going for a walk despite the rain.
- **ihr (Dativ)**: *Ich helfe ihr beim Deutschlernen.* — Я допомагаю їй вивчати німецьку. — I help her learn German.
- **Sie (formal)**: *Können Sie mir bitte den Weg erklären?* — Чи можете Ви, будь ласка, пояснити мені дорогу? — Could you please explain the way to me?

## Integration and safeguards

All previously approved user-facing Food, usage, dictionary, original-exercise and curated Stage 08A–08D examples remain higher priority. Stage 08E renders only when those older sources do not supply an example; the complete-card fallback remains the final source for all 1,177 stable word IDs.

- `scripts/check-reviewed-08e.mjs` checks 148 unique card IDs; count 38+18+25+39+28; nonempty, punctuated German, Ukrainian and English; non-generic sentence text; no collisions with earlier reviewed/expanded/food sources; 40+ critical grammar-targeted assertions; unchanged voice synchronization and source order.
- No changes to card IDs, approved photography, mascot, logo, three-flame mechanics, audio, translation selection, saved progress or UI styles.

## Editorial progress and limits

Stages 08A–08E collectively added **803 individual authored DE–UA–EN sentence triples** (108 + 189 + 151 + 207 + 148), in addition to older approved curated examples. Because older sources are prioritized, the number of new *displayed* examples can be lower than the count of rows added.

**803 authored entries is not equivalent to 803 professionally certified cards or a linguistic sign-off on 1,177 cards.** In particular, automated tests confirm structure and selected grammar patterns, not complete semantic fidelity or native-speaker quality.

## Next step: final full-catalog audit (Stage 08F)

1. Resolve **effective source and displayed example** for each of 1,177 cards in both language modes.
2. Produce reports by topic and provenance, detect remaining complete-baseline placeholders, missing or repeated translation patterns, sentence/word mismatches and unresolved ambiguity.
3. Fix identified problems in small, inspectable sets, preserving earlier manually approved examples. Run a mobile QA spot-check of sentence audio and photo context before release.
4. Keep Draft branches separate and do not merge or modify production without the user's approval.
