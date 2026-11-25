# Strudli Lernen — Stage 08D: verbs and adjectives

Date: 23 November 2026. Draft preview; do not merge into production without approval.

## Scope and finished editorial batches

A dedicated trilingual (German, Ukrainian, English) example sentence was written for **all 207 cards** in these grammatical categories:
- **113 verbs** (including modals, irregular verbs, separable-prefix verbs, reflexive verbs and common bureaucratic/financial verbs).
- **94 adjectives** (including predicative and attributive adjective uses, inflection with articles and prepositions, and relevant everyday situations).

Sources:
- `src/reviewed08dVerbs.ts`
- `src/reviewed08dAdjectives.ts`

Examples:
- **anrufen** — *Ich rufe meine Mutter jeden Abend an.* — Я телефоную мамі щовечора. — I call my mother every evening.
- **sich bewerben** — *Ich bewerbe mich um eine Stelle im Büro.* — Я подаю заявку на посаду в офісі. — I am applying for an office position.
- **einsteigen** — *Wir steigen an der nächsten Haltestelle ein.* — Ми сідаємо в транспорт на наступній зупинці. — We get on at the next stop.
- **groß** — *Wir wohnen in einer großen Stadt.* — Ми живемо у великому місті. — We live in a big city.
- **ukrainisch** — *Meine Freundin kocht heute ein ukrainisches Gericht.* — Сьогодні моя подруга готує українську страву. — My friend is cooking a Ukrainian dish today.

## Rules and integration

`cardExampleFor` preserves the established precedence: Food, existing verified usage/dictionary/original examples, expanded examples (223), Stage 08A (108), Stage 08B (189), Stage 08C (151), **Stage 08D (207)**, then the fallback complete dataset (1,177). Earlier approved individual entries always win; Stage 08D primarily replaces previously generic fallback sentences.

The 207 entries are source-authored coverage across the two grammatical categories. This does **not** mean 207 visible cards have replaced previous approved examples; some cards already have older higher-priority examples, which are kept on purpose.

The new `scripts/check-reviewed-08d.mjs` automatically validates:
- Exactly 113 verb and 94 adjective IDs; one distinct sentence per ID, correctly keyed to the source category.
- DE / UA / EN strings, punctuation and nonempty examples.
- No repeated photo-description placeholders.
- Targeted German conjugation, separable-prefix, reflexive and adjective-declension cases.
- Previously approved source priority and all 1,177 stable vocabulary cards.

## Coverage and next editorial review

Stages 08A–08D added **655 individually written example triples** (108+189+151+207). The previously approved 223 expanded and 115 food examples are additional historical sources; some other curated dictionary/usage examples also exist. The baseline is still present and ensures 1,177/1,177 cards have sentences.

**The remaining uncurated/uncertain grammatical categories** include phrases, pronouns, adverbs, prepositions and question words, which require an additional editorial phase. Repetition, semantic appropriateness, Ukrainian style, English phrasing and live pronunciation still require manual review on the real app, not just automated checks.

No photos, Strudli mascot poses, styles, article colors, 3-flame mechanics, user progress or word voice timing are changed. Only Draft PR and Preview deployment are authorized.
