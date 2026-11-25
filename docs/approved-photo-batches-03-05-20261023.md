# WortWelt — user-approved visual photos, batches 03–05 (23 October 2026)

## What was shipped in this branch

Source: user-approved 3×2 contact sheets posted in chat, **all 18 scenes** cropped from the PHOTO area only (no caption or panel border), exported to **640×640 WebP**, and committed as **actual binary image files** under `public/photos/approved/`.

The source for each photo is the corresponding generated composite; see approved conversation. No external Floot media URL is referenced by `src/data.ts`.

| Asset | German phrase | Ukrainian meaning | Action |
|---|---|---|---|
| phrases-18.webp | Ich heiße… | Мене звати… | REPLACE phrases-18 |
| phrases-19.webp | Woher kommst du? | Звідки ти? | REPLACE phrases-19 |
| phrases-20.webp | Ich komme aus der Ukraine. | Я з України. | REPLACE phrases-20 |
| phrases-21.webp | Wo wohnst du? | Де ти живеш? | REPLACE phrases-21 |
| phrases-22.webp | Ich wohne in Deutschland. | Я живу в Німеччині. | REPLACE phrases-22 |
| phrases-23.webp | Ich verstehe nicht. | Я не розумію. | REPLACE phrases-23 |
| phrases-24.webp | Noch einmal, bitte. | Ще раз, будь ласка. | REPLACE phrases-24 |
| phrases-25.webp | Sprechen Sie Englisch? | Ви говорите англійською? | REPLACE phrases-25 |
| phrases-26.webp | Ich lerne Deutsch. | Я вивчаю німецьку. | REPLACE phrases-26 |
| phrases-27.webp | Bitte langsamer. | Повільніше, будь ласка. | REPLACE phrases-27 |
| phrases-28.webp | Ich weiß nicht. | Я не знаю. | REPLACE phrases-28 |
| phrases-29.webp | Ich brauche Hilfe. | Мені потрібна допомога. | REPLACE phrases-29 |
| phrases-30.webp | Können Sie mir helfen? | Ви можете мені допомогти? | REPLACE phrases-30 |
| phrases-31.webp | Was kostet das? | Скільки це коштує? | REPLACE phrases-31 |
| phrases-32.webp | Wo ist die Toilette? | Де туалет? | REPLACE phrases-32; image was fourth tile in last montage |
| phrases-40.webp | Kann ich mit Karte zahlen? | Чи можу я оплатити карткою? | ADD new card phrases-40; third montage tile |
| phrases-41.webp | Ich habe Hunger. | Я голодний / голодна. | ADD new card phrases-41; fifth montage tile |
| phrases-42.webp | Ich habe Durst. | Я хочу пити. | ADD new card phrases-42; sixth montage tile |

**Important mapping correction:** In the last 3×2 montage, tiles 3, 5, 6 are new phrases NOT originally in the 1174-record catalog. They were never misassigned to existing card IDs 32–35. Three new cards bring total to **1177**.

## QA numbers

- Previously visually reviewed in production: **18** original cards, including 13 earlier replacements and 5 retained.
- Current newly user-approved images: **18**, of which **15** replace existing cards and **3** create new cards.
- Reviewed/approved learning cards: **36 / 1177 = 3.06%**, assuming all 18 are counted after live deployment validation.
- Other **1141** cards remain outside this visual QA progression.
- Prior catalog coverage and structural audits are NOT visual approvals.
- 13 earlier approved photos on `main` preserved unchanged.
- **Do not merge** unrelated draft PR #10 with unreviewed stock-image proposals.

## Post-merge release checks

1. GitHub Actions build green for this branch.
2. Vercel deployment of the new main SHA READY.
3. HTTP 200 plus `image/webp` on each of the 18 new approved image paths.
4. Page and game show user-approved scenes at 1:1 with no captions, words or borders inside photos.
5. Check photo-status for any other source failures; distinct from this set.
