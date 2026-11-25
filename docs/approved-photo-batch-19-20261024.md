# WortWelt batch 19 — user-approved replacements (October 24, 2026)

The user approved exactly twelve images: nine reviewed Pexels ID photos and three original generated ChatGPT images (*nett*, *kurz*, *fertig*). The original 1122×1402 generated images are retained in chat; temporary 160×200 Canva preview versions are stored as the local GitHub PNG files at this stage. Upgrade them to originals when a full-resolution binary upload path is accessible; do not silently change their contents.

Exactly twelve existing `photo` fields changed. Eight obsolete learning SVGs and four obsolete situations SVG dependencies were removed from generator/QA requirements; original SVG artwork remains on disk. SVG count guard 206→194, legacy lang/kurz QA adjusted. Pexels images are under Pexels License; generated images are the user's approved scenes.

| ID | German | Ukrainian | Source | New photo | Old image |
|---|---|---|---|---|---|
| `adjs-878` | gut | хороший | [Pexels 36713032](https://www.pexels.com/photo/36713032/) | `https://images.pexels.com/photos/36713032/pexels-photo-36713032.jpeg?auto=compress&w=960` | `/photos/situations/adjs-878.svg` |
| `adjs-879` | schlecht | поганий | [Pexels 33715997](https://www.pexels.com/photo/33715997/) | `https://images.pexels.com/photos/33715997/pexels-photo-33715997.jpeg?auto=compress&w=960` | `/photos/situations/adjs-879.svg` |
| `adjs-886` | hässlich | негарний | [Pexels 8975696](https://www.pexels.com/photo/8975696/) | `https://images.pexels.com/photos/8975696/pexels-photo-8975696.jpeg?auto=compress&w=960` | `/photos/situations/adjs-886.svg` |
| `adjs-917` | unfreundlich | непривітний | [Pexels 3812754](https://www.pexels.com/photo/3812754/) | `https://images.pexels.com/photos/3812754/pexels-photo-3812754.jpeg?auto=compress&w=960` | `/photos/learning/adjs-917.svg` |
| `adjs-918` | nett | милий | Approved generated PNG | `/photos/custom/batch19-nett-generated.png` | `/photos/learning/adjs-918.svg` |
| `ww-new-194` | bereit | готовий (до дії) | [Pexels 38149422](https://www.pexels.com/photo/38149422/) | `https://images.pexels.com/photos/38149422/pexels-photo-38149422.jpeg?auto=compress&w=960` | `/photos/learning/ww-new-194.svg` |
| `adjs-926` | kompliziert | складний за будовою | [Pexels 18082922](https://www.pexels.com/photo/18082922/) | `https://images.pexels.com/photos/18082922/pexels-photo-18082922.jpeg?auto=compress&w=960` | `/photos/learning/adjs-926.svg` |
| `adjs-930` | unbequem | незручний | [Pexels 6634368](https://www.pexels.com/photo/6634368/) | `https://images.pexels.com/photos/6634368/pexels-photo-6634368.jpeg?auto=compress&w=960` | `/photos/situations/adjs-930.svg` |
| `adjs-940` | fertig | готовий | Approved generated PNG | `/photos/custom/batch19-fertig-generated.png` | `/photos/learning/adjs-940.svg` |
| `ww-new-182` | lang | довгий | [Pexels 2440623](https://www.pexels.com/photo/2440623/) | `https://images.pexels.com/photos/2440623/pexels-photo-2440623.jpeg?auto=compress&w=960` | `/photos/learning/ww-new-182.svg` |
| `ww-new-183` | kurz | короткий | Approved generated PNG | `/photos/custom/batch19-kurz-generated.png` | `/photos/learning/ww-new-183.svg` |
| `ww-new-199` | unzufrieden | незадоволений | [Pexels 6780044](https://www.pexels.com/photo/6780044/) | `https://images.pexels.com/photos/6780044/pexels-photo-6780044.jpeg?auto=compress&w=960` | `/photos/learning/ww-new-199.svg` |

Release verification: GitHub build and content/typecheck QA success; Vercel production READY matching commit SHA; nine new local mirrored Pexels files and three generated local assets present.
