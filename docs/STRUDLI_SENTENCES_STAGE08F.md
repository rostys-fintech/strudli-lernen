# Strudli Lernen — Stage 08F: complete effective-card sentence audit

**Date:** 23 November 2026  
**Scope:** All **1,177** stable vocabulary cards in **47** topics.  
**Release state:** Draft Preview branch; no production/main merge.

## Why the prior 803-row editorial count was not enough

Stages 08A–08E authored **803 individual triples**, but an earlier approved source can supersede a newer authored record. A raw count of content records cannot tell us what the learner actually sees. This stage reconstructs the **exact display precedence** from `src/cardExamples.ts`, including Food, card usage, Library dictionary, original exercises, expanded, 08A–08E and the generated safety baseline.

**Before Stage 08F**, the effective 1,177-card audit found:
- **45 cards** still displaying generic fallback examples: 14 in *places*, 10 in *work*, 21 in *numbers*.
- **16 duplicate-sentence groups**, one shared across three cards.
- A substantive wrong-sense example: *die Karte* in Travel meant a map but used a payment-card sentence.

## Fixes included

1. `src/reviewed08fBaseline.ts` — 45 new individually written DE/UA/EN contextual triples for the last fallback cards, replacing repetitive "Auf dem Bild ist ..." and "Das Ticket kostet ... Euro" boilerplate.
2. `src/reviewed08fCorrections.ts` — 17 narrowly scoped content corrections: 16 older duplicate groups and the ambiguous Karte example, with an additional collision eliminated in `Park`. The approved food example dataset is never overridden.
3. `src/cardExamples.ts` — targeted corrections after approved Food (before older sources), and baseline cleanup after earlier edited sources (before fallback).
4. `scripts/audit-displayed-examples.mjs` — reproducible **effective-display** audit at build time; checks source ordering against the real resolver, detects missing trilingual text, duplicates, residual baseline examples, and source changes.
5. **Auditable, tracked outputs**: `reports/stage08f/effective-examples.csv` lists every card and its actual selected German sentence, Ukrainian/English translations, topic and source; `reports/stage08f/summary.json` holds source and topic counts.

## Effective source distribution after corrections

| Source actually displayed | Cards |
|---|---:|
| Previously approved Food | 115 |
| Card usage with verified translation | 46 |
| Original Library dictionary pairs | 15 |
| Original practice sentences | 34 |
| Earlier expanded examples | 201 |
| Stage 08A | 102 |
| Stage 08B | 174 |
| Stage 08C | 134 |
| Stage 08D | 170 |
| Stage 08E | 124 |
| Stage 08F — fallback replacements | 45 |
| Stage 08F — specific corrections | 17 |
| **Total** | **1,177** |

### Post-fix automated acceptance criteria

- 1,177/1,177 cards have nonempty German, Ukrainian and English example sentences.
- All 47 topic identifiers remain populated.
- No card displays the generic `complete-baseline` source.
- No two cards display identical German sentence strings.
- No structural missing-translation / generic picture-boilerplate flags remain.
- `travel-433` (*die Karte* = map) displays *Auf dieser Karte ist der Weg zum Museum markiert.* Its payment-card equivalent in Shopping remains different.
- The committed 1,177-row CSV **must exactly match** the fresh effective display audit in each CI build. Any change to word IDs, source resolution, or selected example causes the test to fail until the snapshot is updated deliberately.

## Limitations and remaining validation

This is a **full structural and source-based audit**, plus targeted editorial fixes; it is not a certification that every sentence is natural in every regional variety or that every translation, photo and speech synthesis has undergone professional native-speaker proofreading. The category-based semantic checks and 17 targeted corrections are concrete; beyond those, human reading and listening on a real mobile device remain necessary before public release.

The user-approved Strudli icon and 4 poses, Schrank image, article colours, pronunciation behaviour, 3-flame progression, user progress data and image mappings have **not** been modified.

## Next proposed development focus (separate user decision)

After approving this audit, work on the next product capability: a short **Lesen** reading module with A0–A1 stories, tap-to-hear words, in-context translations and three comprehension questions, reusing the existing vocabulary and current warm branding; do not introduce costly AI chat/speaking features without a separate decision.
