# WortWelt — approved batch 18 (24 October 2026)

The user explicitly approved **12 replacements**: **two specifically generated scenes** (an elephant for *groß*, a mouse in a hand for *klein*) and ten Pexels images already approved in batch18 preview. The images were imported to Canva staging, then downloaded and committed as PNG blobs in `preview/wortwelt-batch18-generated-assets`. The staging plugin supplied 160×200 image renditions; these are local in GitHub, not dynamically linked to expiring Canva URLs. The full-resolution generated master images remain in the ChatGPT conversation.

This commit updates exactly 12 `photo` properties, preserves translations, topics and game code, removes 10 obsolete SVG requirements from generators/QA, and updates the SVG count to 206. The previous user-approved images from earlier batches are untouched.

| Card ID | German | Ukrainian | Approved source | Production card image | Previous image |
|---|---|---|---|---|---|
| `adjs-880` | groß | великий | generated local PNG | `/photos/custom/batch18-gross-elephant.png` | `/photos/learning/adjs-880.svg` |
| `adjs-881` | klein | малий | generated local PNG | `/photos/custom/batch18-klein-mouse.png` | `/photos/learning/adjs-881.svg` |
| `adjs-884` | neu | новий | Pexels 7190924 | `https://images.pexels.com/photos/7190924/pexels-photo-7190924.jpeg?auto=compress&w=960` | `/photos/learning/adjs-884.svg` |
| `adjs-887` | leicht | легкий | Pexels 6998589 | `https://images.pexels.com/photos/6998589/pexels-photo-6998589.jpeg?auto=compress&w=960` | `/photos/learning/adjs-887.svg` |
| `adjs-906` | offen | відчинений | Pexels 37031259 | `https://images.pexels.com/photos/37031259/pexels-photo-37031259.jpeg?auto=compress&w=960` | `/photos/learning/adjs-906.svg` |
| `adjs-907` | geschlossen | зачинений | Pexels 15315897 | `https://images.pexels.com/photos/15315897/pexels-photo-15315897.jpeg?auto=compress&w=960` | `/photos/learning/adjs-907.svg` |
| `adjs-908` | frei | вільний | Pexels 23964495 | `https://images.pexels.com/photos/23964495/pexels-photo-23964495.jpeg?auto=compress&w=960` | `/photos/learning/adjs-908.svg` |
| `adjs-909` | besetzt | зайнятий | Pexels 6738020 | `https://images.pexels.com/photos/6738020/pexels-photo-6738020.jpeg?auto=compress&w=960` | `/photos/learning/adjs-909.svg` |
| `adjs-929` | bequem | зручний | Pexels 4138042 | `https://images.pexels.com/photos/4138042/pexels-photo-4138042.jpeg?auto=compress&w=960` | `https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Cozy_interior_with_a_sofa_%28Unsplash%29.jpg/960px-Cozy_interior_with_a_sofa_%28Unsplash%29.jpg` |
| `ww-new-198` | zufrieden | задоволений | Pexels 3958826 | `https://images.pexels.com/photos/3958826/pexels-photo-3958826.jpeg?auto=compress&w=960` | `/photos/learning/ww-new-198.svg` |
| `ww-new-186` | breit | широкий | Pexels 8811580 | `https://images.pexels.com/photos/8811580/pexels-photo-8811580.jpeg?auto=compress&w=960` | `https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Motorway_Sargodha.jpg/960px-Motorway_Sargodha.jpg` |
| `adjs-942` | schwierig | важкий, складний | Pexels 6256115 | `https://images.pexels.com/photos/6256115/pexels-photo-6256115.jpeg?auto=compress&w=960` | `/photos/learning/adjs-942.svg` |

The Pexels images are used under the Pexels License. The generated pictures are created specifically for this app. Verify release status independently: GitHub build QA and typecheck/content QA SUCCESS, Vercel production READY matching this SHA, 10 new Pexels mirrors in `/photo-status.json`, and direct GET success for the 2 local custom PNGs.
