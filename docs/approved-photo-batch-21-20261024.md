# WortWelt — approved batch 21 (October 24, 2026)

User approved exactly twelve image replacements. Initial candidates for leben, mögen, können, wissen were rejected and replaced with four specifically generated and approved images. The other eight use the exact reviewed Pexels photo identifiers.

| Card ID | German | Ukrainian | New photo | Previously |
|---|---|---|---|---|
| `verbs-805` | leben | жити | `/photos/custom/batch21-leben-generated.png` | `/photos/situations/verbs-805.svg` |
| `verbs-819` | brauchen | потребувати | `https://images.pexels.com/photos/8213096/pexels-photo-8213096.jpeg?auto=compress&w=960` | `/photos/situations/verbs-819.svg` |
| `verbs-820` | mögen | подобатися (про вподобання) | `/photos/custom/batch21-moegen-generated.png` | `/photos/situations/verbs-820.svg` |
| `verbs-822` | wollen | хотіти | `https://images.pexels.com/photos/3036908/pexels-photo-3036908.jpeg?auto=compress&w=960` | `/photos/situations/verbs-822.svg` |
| `verbs-823` | können | могти | `/photos/custom/batch21-koennen-generated.png` | `/photos/situations/verbs-823.svg` |
| `verbs-824` | müssen | мусити | `https://images.pexels.com/photos/9572685/pexels-photo-9572685.jpeg?auto=compress&w=960` | `/photos/situations/verbs-824.svg` |
| `verbs-826` | dürfen | мати дозвіл | `https://images.pexels.com/photos/35745563/pexels-photo-35745563.jpeg?auto=compress&w=960` | `/photos/situations/verbs-826.svg` |
| `verbs-827` | wissen | знати факт | `/photos/custom/batch21-wissen-generated.png` | `/photos/situations/verbs-827.svg` |
| `verbs-828` | kennen | знати людину чи місце | `https://images.pexels.com/photos/37170158/pexels-photo-37170158.jpeg?auto=compress&w=960` | `/photos/situations/verbs-828.svg` |
| `verbs-831` | verstehen | розуміти | `https://images.pexels.com/photos/8472879/pexels-photo-8472879.jpeg?auto=compress&w=960` | `/photos/situations/verbs-831.svg` |
| `verbs-863` | vergessen | забувати | `https://images.pexels.com/photos/36618908/pexels-photo-36618908.jpeg?auto=compress&w=960` | `/photos/situations/verbs-863.svg` |
| `verbs-864` | sich erinnern | пам'ятати | `https://images.pexels.com/photos/14013483/pexels-photo-14013483.jpeg?auto=compress&w=960` | `/photos/situations/verbs-864.svg` |

All four generated images are local version-controlled PNGs under public/photos/custom. Signed Canva thumbnail imports used to get these files into GitHub; these currently have reduced resolution (200×150) and should be upgraded from the original generated files when native full-resolution transfer is available. Never use signed, expiring media links as production photo fields.

Exactly 12 existing `photo` values changed. Obsolete SVG dependencies removed from situation generator and checks; new SVG count 170. No game code, vocabulary translations or topical classification changed.

Only claim production release when Build QA and Content/Typecheck QA succeed and the Vercel READY deployment SHA matches this commit. Progress after release: 210/1177=17.84% reviewed/replaced; this is not percent photo coverage.
