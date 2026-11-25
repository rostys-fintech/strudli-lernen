# WortWelt · масова перевірка фото (23.10.2026)

**Гілка:** `audit/media-quality-oct23`. **Джерело:** main `a80bfa1`.

## Факти
- Проскановано джерела для **1174 карток** (736 іменників, 153 дієслова, 94 прикметники, 191 фраза).
- Зовнішніх зображень: **855**; локальних ілюстрацій: **319**. Записів Wikimedia у curated manifest: **673**; **182** інших зовнішніх джерел потребують окремої перевірки ланцюга атрибуції (це не означає відсутність ліцензії).
- Наявність зображення ≠ естетична якість. **Жоден файл не отримав нового візуального схвалення** без відкриття пікселів.
- Нова пріоритетна черга: **88 унікальних карток**, решта **1086** — планова ручна перевірка за темами.

## Черга на заміну / повторну перевірку
- **P0 — 4 заміни підготовлено у GitHub (мобільний QA ще потрібен)**: 4 підтверджені погані приклади зі скриншотів користувача: `nature-512 Kuh`, `ww-new-121 Schlange`, `ww-new-047 Espresso`, `adjs-916 freundlich`.
- **P1 — 18**: усі 18 карток теми `family`; природні людські портрети, чітка роль, нейтральна обстановка та охайний фон. Не прирівнювати національність/зовнішність до критерію якості.
- **P2 — 66**: інші актуальні кандидати з 72 попередніх зауважень; багато з них уже замінювали URL, але мобільну якість не перевірили.
- **P3 — 1086**: решта карток; без фотоогляду не стверджувати, що вони погані або якісні.

## Масштабна проблема у відображенні
Правило `.shade` має внизу чорну накладку `#0009`, тож навіть білий фон робить сірим, як видно на Espresso. На цій гілці доречно протестувати світлішу накладку, перш ніж вирішувати, що кожне фото потребує заміни.

## Не виконано
Чотири фото замінено у тестовій гілці PR №8 з перевіреними джерелами Wikimedia й зазначеннями ліцензій. Сертифікації 1 174 фотографій, повного мобільного тесту, тесту production Vercel і завантаження в main **не виконано**. Розширений машинний реєстр: `docs/visual-qa-register-2026-10-23.json`.

## Оновлення P0 — 4 кандидати в тестовій гілці
- Kuh: крупний портрет корови, **CC BY-SA 4.0** (Carolyn Parsons, з обов'язковою атрибуцією).
- Schlange: одна чітка змія, CC0 (Ethan Porcaro).
- Espresso: чашка еспресо на світлому тлі без бренду, CC0 (Jubair Bin Iqbal).
- freundlich: природний портрет людини замість емодзі з написом, CC0 (Allef Vinicius).
- Скрипт `scripts/check-image-remediation.mjs` підключено до `check:all`, щоб не повернути попередні невдалі зображення.

**Важливо:** ці фото з Wikimedia, а не оригінально згенеровані. Візуально переглянуті вихідні 960px-прев'ю, але на мобільному екрані live застосунку не протестовані.

## Партія 2 — 23.10.2026

4 чіткі природні фото нової сімейної добірки **внесено у `src/data.ts` тільки в PR №8**:

- `family-452 Vater`: чіткий близький портрет батька з донькою, Carolina Hernandez (автор: Caroline Hernandez), CC0, замість сцени на ярмарковому атракціоні.
- `family-457 Oma`: природний портрет усміхненої літньої жінки, Shixart1985, CC BY 2.0, замість невдалого старого фото.
- `family-458 Opa`: літній чоловік із книгою, чіткі риси обличчя, Shixart1985, CC BY 2.0, замість строкатої сцени на ринку.
- `family-466 Kind`: крупний план усміхненої дитини, Nino Barbieri, CC BY-SA 3.0, замість дитини, малопомітної на сходах.

Джерела, атрибуцію і ліцензії оновлено у маніфесті й на сторінці photo-credits. Чотири реальні 960px previews візуально переглянуто на Wikimedia. Студійної ретуші, генерації та колажів немає. Додано 4 картки в автоматичну перевірку відкатів.

Відхилено кандидати `Grandma portrait.jpg` (темне, похмуре, дрібне), `Mother and daughter share a quiet moment...` (обличчя навмисно розмиті), `Portrait of granddaughter and grandmother` (специфічне святкове вбрання, не універсальна картка).

**Прогрес:** 8/88 пріоритетних карток із заміненими посиланнями, 4/18 сімейних з новими фотографіями, 80 в першочерговій черзі. Live Vercel/мобільна верифікація не проводилась; main не змінено.

## Партія 3 — виправлення кольору (23.10.2026)

`family-466 Kind`: вилучено старе блякле/монохромне зображення. Нове джерело — **яскравий кольоровий портрет дитини**, Abdulmomn Kadhim, Wikimedia Commons CC0, фото 5184×3456, реально переглянуто 960px-прев'ю; високий контраст, природне освітлення, видно обличчя. Замінено URL у словнику, ліцензійний маніфест, credits, автоматичний regression check. Усі фото людини і живих предметів мають залишатись кольоровими (схеми та інфографіка можуть бути графічними). Мобільний live crop не підтверджений, main не змінено.

## Партія 4 — ще 4 сімейні фото та кольоровість (23.10.2026)

- **Schwester, family-453:** два усміхнені обличчя на світлому тлі, RDNE Stock project, Pexels License, <https://www.pexels.com/photo/kids-sitting-on-the-floor-6182792/>.
- **Bruder, family-454:** два брати в природних обіймах, Elina Fairytale, Pexels License, <https://www.pexels.com/photo/cute-little-boys-4008827/>.
- **Großmutter, family-459:** літня жінка обіймає онуку в яскравому парку, juliane Monari, Pexels License, <https://www.pexels.com/photo/grandmother-embracing-little-granddaughter-in-park-25636768/>.
- **Großvater, family-460:** теплий крупний план дідуся з онукою, Alena Darmel, Pexels License, <https://www.pexels.com/photo/granddaughter-hugging-her-grandfather-while-smiling-7322006/>.

Словник, фотоманіфест і сторінка photo-credits оновлені на тестовій гілці. Скрипти mirroring, перевірки джерел та захист від повернення невдалих фото розширені, щоб легально та технічно підтримувати Pexels. Pexels License означає безоплатний дозвіл на використання в застосунку, **не CC0 та не повну відсутність авторського права**. Обрізання фото оптимізовано для мобільної картки, але фінальний перегляд реальних пікселів на телефоні ще не виконано.

**Поточний прогрес:** 12/88 пріоритетних карток замінено в PR, 8/18 сімейних карток, залишилося 76 пріоритетних. Вимога — кольорові природні фотокартки, жодних монохромних портретів. Основна гілка та Vercel не змінені.

## Партія 5 — незалежний аудит поза сім'єю (23.10.2026)

Ще **7** карток перенаправлено на ліцензовані Pexels-фотографії в review-гілці (основна production-версія не змінювалась):

| Німецьке слово | Чому старе фото погане | Нове джерело |
|---|---|---|
| `Teller` | На фото головний об’єкт паста, не тарілка | <https://www.pexels.com/photo/a-plate-on-a-table-16404305/> |
| `Schublade` | Замість шухляди антикварний комод | <https://www.pexels.com/photo/side-view-of-a-partially-open-drawer-4185557/> |
| `Tennis` | Лише порожній корт | <https://www.pexels.com/photo/tennis-racket-and-ball-on-court-surface-36258640/> |
| `Kochen` | Нетипова сцена на вогнищі | <https://www.pexels.com/photo/woman-cooking-in-kitchen-7418495/> |
| `Laden` | Кав’ярня замість універсального магазину | <https://www.pexels.com/photo/exterior-of-a-shop-in-city-18075647/> |
| `Preis` | Штрихкод без зрозумілої ціни | <https://www.pexels.com/photo/jeans-with-price-ticket-on-white-table-7441481/> |
| `Rock` | Спідниця погано помітна на тлі заходу сонця | <https://www.pexels.com/photo/close-up-of-woman-legs-9166748/> |

Джерела перевірено на офіційних Pexels сторінках (автори, ліцензія, зміст, URL). Усі 7 внесені в `src/data.ts`, `public/photos/curated/manifest.json`, `public/photo-credits.html`, `scripts/check-image-remediation.mjs`. Для високих фотографій додано CSS-`object-position` за ID.

**Реальний статус:** 19 / 88 пріоритетних записів із новими фото, залишилося 69. Деякі з цих нових кадрів можуть потребувати додаткового доопрацювання після мобільного перегляду. Наявність правильного URL ≠ фінальне візуальне схвалення.

### Відкладені заміни через семантику

- `Vermieter`: фото передачі ключів агентом нерухомості не гарантовано показує саме орендодавця; заміна відкладена.
- `Buchung`: рецепція готелю не є бронюванням; потрібне чітке підтвердження броні.
- `Antrag`: паспортний бланк РФ невдалий для німецького контексту; не замінювати іншим географічно неправильним бланком.

## Партія 6 — відповідь на два відхилені зображення + документи (23.10.2026)

Користувач відхилив попередні `Rock` (ноги замість спідниці) і `Schublade` (меблева фурнітура). Їх не рахуємо як нові унікальні картки, але повторно змінено в GitHub.

- **Rock** (`clothes-395`): Replaced rejected close-up of legs with the clearly visible ombre pleated skirt in motion. A skirt is main foreground subject. Автор Maksim Goncharenok. [Точне фото](https://www.pexels.com/photo/a-person-wearing-a-pleated-skirt-4663319/).
- **Schublade** (`ww-new-099`): Replaced rejected construction detail with a top-down view of a drawer visibly containing neatly folded colorful clothes. Автор RDNE Stock project. [Точне фото](https://www.pexels.com/photo/close-up-photo-of-neatly-folded-clothes-8581064/).
- **Antrag** (`germany-215`): Replaced Russian-language passport application with geographically neutral contemporary paperwork being completed. Автор RDNE Stock project. [Точне фото](https://www.pexels.com/photo/close-up-shot-of-a-person-filling-out-a-form-7821682/).
- **Bewerbung** (`work-612`): Replaced Dutch shop job application form with clean contemporary resume and application stationery on desk. Автор Markus Winkler. [Точне фото](https://www.pexels.com/photo/a-clipboard-near-pen-and-laptop-on-a-marble-surface-4101343/).
- **Woche** (`time-770`): Replaced Dutch weekly agenda with a legible weekly planner opened on white background. Автор Mike Murray. [Точне фото](https://www.pexels.com/photo/pen-on-open-planner-6446318/).

Оригінали перевірено на сторінках Pexels; індивідуальне візуальне схвалення користувачем та mobile-crop поки відсутні. Pexels License дає право використовувати безкоштовно в застосунку, але не є CC0. Перевірки авторів і ліцензій залишено. **Загалом 22/88 пріоритетних карток оновлено, лишилося 66.** Жодного merge у main або публікації Vercel.

### Додаткове виправлення — die Monatskarte

Замінено старі американські проїзні 2012 року на **чітку сучасну німецьку чіпкарту HVV Deutschlandticket**: https://commons.wikimedia.org/wiki/File:HVV_Deutschlandticket_230420_Front.jpg. Автор MissyWegner, CC BY-SA 4.0. Зображення відкрите і переглянуте на Wikimedia Commons 960px. Deutschlandticket є місячним абонементом для громадського транспорту (дотичне значення до Monatskarte); усі фото перевіряються на телефоні перед релізом. Загальний пріоритетний прогрес **23/88**, залишилося **65**.


## Партія 7 — якісні предметні виправлення (23.10.2026)

- **Zeugnis** (`study-657`) → [фактичне фото німецького табеля з оцінками](https://commons.wikimedia.org/wiki/File:Zeugnis_Benotung.jpg), Tim Reckmann, CC BY 2.0. Сторінка файлу, ліцензія та саме 960px фото переглянуті. Замість церемонії — сам документ. Телефонне кадрування ще перевірити.
- **Vermieter** (`ww-new-064`) → [оригінальне фото передачі ключів](https://www.pexels.com/photo/giving-keys-to-a-buyer-7642004/), Alena Darmel, Pexels License. За метаданими — двоє дорослих передають ключі; з огляду на неоднозначність ролі орендодавця / продавця / агента — **потрібне схвалення користувачем**.
- `Buchung` і `Kopie` залишені відкритими: не знайдено однозначно коректного фото підтвердження бронювання / фізичної копії; відхилені слабкі заміни. `Ausfall` поки збережено: старе фото справді показує скасування рейсів.

**Прогрес:** 25/88 пріоритетних карток з новими джерелами, залишилося 63. Продовжуємо лише у чернетковому PR, production не зачіпали.


## Партія 8 — консультація, годинник, запрошення, електронна пошта (23.10.2026)
- **Beratung** (`germany-237`): Medical consultation replaced with client and advisor reviewing paperwork at a modern office desk. [Перевірити точний оригінал](https://www.pexels.com/photo/an-agent-showing-documents-to-his-client-7821671/); RDNE Stock project, Pexels License. Кадрування на телефоні ще не підтверджене.
- **Uhr** (`time-761`): Generic old wall clock replaced with bright clean round gold-trim clock on white wall; visually distinct from alarm clocks. [Перевірити точний оригінал](https://www.pexels.com/photo/round-analog-wall-clock-with-gold-trim-on-white-wall-6968188/); Mikhail Nilov, Pexels License. Кадрування на телефоні ще не підтверджене.
- **Einladung** (`hobbies-757`): Dated cluttered Singapore official invitation replaced with a visually prominent contemporary RSVP invitation card. [Перевірити точний оригінал](https://www.pexels.com/photo/invitation-card-with-the-inscription-tied-with-ribbon-6479559/); Tara Winstead, Pexels License. Кадрування на телефоні ще не підтверджене.
- **E-Mail** (`work-622`): Historical rights email screenshot replaced with recognizable mobile email inbox on smartphone in hand. [Перевірити точний оригінал](https://www.pexels.com/photo/person-holding-a-smartphone-5744250/); Solen Feyissa, Pexels License. Кадрування на телефоні ще не підтверджене.

**Прогрес:** 29 із 88 пріоритетних фото замінено у тестовій гілці, залишилось 59. `Buchung` і `Kopie` лишаються відкритими: очевидний візуальний замінник не знайдено. Main/Vercel не змінено.


## Партія 9 — шість наступних замін (23.10.2026)
- **Gleis** (`transport-577`): Station platform in Japan replaced by clearly visible parallel rails on a sunny day, photographed in Leer, Germany. [Exact official photo](https://www.pexels.com/photo/clear-photo-of-train-rail-during-daytime-192948/) — Hinrich Oltmanns, Pexels License; in-game pixel/crop approval pending.
- **Rabatt** (`shopping-672`): Cluttered shop-window promotion replaced with simple close-up of discount percentage signs on clean pale tabletop. [Exact official photo](https://www.pexels.com/photo/discount-percentages-and-sale-sign-5872305/) — Max Fischer, Pexels License; in-game pixel/crop approval pending.
- **Qualität** (`shopping-690`): Outdated military equipment QA photo replaced with modern worker visibly inspecting sheets in bright factory. [Exact official photo](https://www.pexels.com/photo/industrial-worker-inspecting-materials-in-factory-35383622/) — Ruslan Alekso, Pexels License; in-game pixel/crop approval pending.
- **Krankenhaus** (`city-541`): Dull Venezuelan hospital exterior replaced with brighter recognizable real Charité hospital building in Berlin. [Exact official photo](https://www.pexels.com/photo/charite-krankenhaus-in-berlin-on-a-sunny-day-33746554/) — Niklas Jeromin, Pexels License; in-game pixel/crop approval pending.
- **Sahne** (`food-327`): Cream as secondary topping on dessert replaced with close-up of whipped cream in mixing bowl and whisk. [Exact official photo](https://www.pexels.com/photo/mixing-heavy-cream-6641182/) — Nadezhda Moryak, Pexels License; in-game pixel/crop approval pending.
- **Foto** (`hobbies-742`): Person photographing a market replaced with actual printed instant photo being held/annotated on light table. [Exact official photo](https://www.pexels.com/photo/person-writing-on-polaroid-picture-6188759/) — cottonbro studio, Pexels License; in-game pixel/crop approval pending.

**Прогрес:** 35/88 пріоритетних карток, 53 лишилося. Main / production Vercel unchanged. `Größe`, `Fahrkartenautomat`, `Buchung`, `Kopie` not replaced pending semantically clear better assets.


## Партія 10 — лікарня перероблена за зауваженням + дві картки (23.10.2026)

- **Krankenhaus** (`city-541`) — USER-REJECTED previous Charité facade replaced with real German hospital entrance, large readable KRANKENHAUS sign and explicit red medical cross; photo pixels inspected at 960×640, phone crop still pending. [Точний оригінал](https://commons.wikimedia.org/wiki/File:Krankenhaus_vom_Roten_Kreuz_-_Eingang.jpg). H. Sellmoene, CC BY-SA 4.0. Відхилений попередній варіант не повертаємо; ця повторна заміна не збільшує число різних оновлених карток.
- **Fahrkartenautomat** (`ww-new-070`) — Older German ticket machine replaced with 2025 photograph of modern blue Munich MVV ticket machine, machine centered and recognizable; inspected exact Wikimedia 960px image. [Точний оригінал](https://commons.wikimedia.org/wiki/File:Fahrkartenautomat_des_MVV_an_der_S-Bahnstation_Langwied_01.jpg). Kritzolina, CC BY-SA 4.0.
- **Größe** (`clothes-415`) — Generic person with yardstick replaced by tailor measuring a client's clothing size with tape; original photo/source rights checked, phone crop pending. [Точний оригінал](https://www.pexels.com/photo/woman-in-gray-sweater-holding-a-tape-measure-8769360/). Gustavo Fring, Pexels License.

**Прогрес:** 37/88 у QA гілці, 51 лишилося. Окремо: user-requested hospital redo; кадрування ще перевірити. Production Vercel/main не змінено.


## Партія 11 — Linie, Termin, Fahrer (23.10.2026)
- **Linie** (`transport-586`): Replaced Canadian Toronto route display with actual German route 318 front display on city bus, readable bright image shot Oldenburg in 2024; preview 960px visually inspected. [Точне джерело](https://commons.wikimedia.org/wiki/File:Bus_der_VWG-Linie_318_im_ZOB_Oldenburg_(2024).jpg) — Joachim Kohler, CC BY-SA 4.0.
- **Termin** (`germany-214`): Replaced general bullet journal with appointment dates actively being marked on calendar by hand; official source description and license confirmed, exact pixels not inspected. [Точне джерело](https://www.pexels.com/photo/person-holding-blue-pen-6170653/) — RDNE Stock project, Pexels License.
- **Fahrer** (`transport-574`): Replaced driverless cockpit image with actual bus driver holding wheel and driving a bus; source photo description and Pexels license verified, phone crop pending. [Точне джерело](https://www.pexels.com/photo/man-driving-bus-19832472/) — Alfredo Guri, Pexels License.

Прогрес: **40/88** замін карток у QA-гілці, **48** пріоритетних невирішених. Buchung/Kopie/Datenvolumen не замінювали: потрібен сильніший однозначний візуальний аналог. Pexels pixel crop у грі не перевірено; GitHub PR draft, Vercel main unchanged.


## Партія 12 — перероблені Fahrer/Linie за точним вибором користувача + Chef (23.10.2026)
- **Fahrer** (`transport-574`): User-approved replacement for rejected blurry driver: bus driver navigating city street viewed through bus window; actual Pexels image opened and reviewed, reflections remain; phone crop still pending. [Точний оригінал](https://www.pexels.com/photo/man-driving-bus-17976225/), Joaquin Carfagna, Pexels License. Повторна заміна — не збільшує число унікальних оновлених карток.
- **Linie** (`transport-586`): User-approved New York B13 actual bus route map with route line visually highlighted; 960px original examined, replace bus picture entirely. [Точний оригінал](https://commons.wikimedia.org/wiki/File:B13_Bus_Route_Map_(as_of_August_2025).png), KXPUMVVL, CC0 1.0. Повторна заміна — не збільшує число унікальних оновлених карток.
- **Chef** (`work-597`): Archive of officials in a crowded government meeting replaced with clear modern office leader standing and presenting growth charts to seated team; actual source image visually inspected. [Точний оригінал](https://www.pexels.com/photo/business-partners-having-a-meeting-at-the-office-7433898/), Vlada Karpovich, Pexels License.

**Поточна черга:** 41/88 пріоритетних карток отримали кандидатів на кращі зображення, 47 залишилося. `Sprache`: відхилено два потенційні джерела (вчитель далеко від камери, великий текст на словнику) як недостатньо придатні для гри. Buchung, Kopie, Datenvolumen — поки відкриті. CI і мобільний crop перевіряються окремо. Жодних змін основної версії Vercel.


## Партія 13 — документ, податок, мова, замовлення, оренда (23.10.2026)
- **Kopie** (`germany-218`): Isolated photocopier machine replaced with actual employee copying a paper document in a clear modern office. Process visually contextualizes 'copy', but printed original vs copy are not side by side; user phone crop pending.. [Точний оригінал](https://www.pexels.com/photo/woman-using-a-photocopier-3791246/) — Andrea Piacquadio, Pexels License.
- **Steuer** (`work-626`): US IRS 990-PF form replaced with a genuine photographed German Einkommensteuererklärung tax return; license/source metadata verified (2010 German form), smartphone legibility/crop pending.. [Точний оригінал](https://commons.wikimedia.org/wiki/File:Einkommensteuererklärung_0176.jpg) — Sven Teschke, CC BY-SA 3.0 DE.
- **Sprache** (`study-636`): Dated US military facility replaced with bright hands-on classroom activity using magnetic letters, teaching language rather than military training; not necessarily specifically German, phone crop pending.. [Точний оригінал](https://www.pexels.com/photo/student-writing-on-whiteboard-5428013/) — Tima Miroshnichenko, Pexels License.
- **Bestellung** (`ww-new-057`): Crowded restaurant large group replaced with waiter visibly taking an order from seated guests in cleaner modern interior; final mobile crop pending.. [Точний оригінал](https://www.pexels.com/photo/waiter-taking-order-from-customers-at-a-glass-table-in-an-elegant-interior-with-textured-walls-6816368/) — Yan Krukau, Pexels License.
- **Miete** (`germany-227`): Dull old rental house replaced by bright contemporary wooden rental house featuring unmistakable House for Rent sign; conveys renting property, not rent amount, English text on sign may remain visible.. [Точний оригінал](https://www.pexels.com/photo/low-angle-shot-of-wooden-house-8963083/) — Ivan S, Pexels License.

**Прогрес:** 46/88 пріоритетних карток замінено у QA гілці; 42 лишилося. `Buchung`, `Datenvolumen`, `Serie`: залишено без змін — поки немає достатньо чіткого кращого зображення саме для поняття. Main/Vercel не зачеплено. Остаточна перевірка телефону, а також наявність усіх зовнішніх зображень у білді, лишаються відкритими.


## Партія 14 — поняття без придатного стокового фото + Verein (23.10.2026)
- **Buchung** (`travel-430`): Замінено готельну рецепцію на **оригінальну власну SVG-ілюстрацію** смартфона зі статусом *Buchung bestätigt*, галочкою та датами перебування. [Фактичний файл GitHub](../public/photos/custom/booking-confirmed.svg). Цей об'єкт показує саме підтвердження бронювання, а не прийом у готелі.
- **Datenvolumen** (`technology-276`): Замінено застарілий екран Windows Mobile на **оригінальну власну масштабовану SVG-ілюстрацію** сучасного смартфона з використанням 6,2/10 GB. [Фактичний файл GitHub](../public/photos/custom/mobile-data-volume.svg). Це *мобільний інтернет-трафік*, не місткість диска.
- **Verein** (`hobbies-759`): Замінено фотографію політичної зустрічі футбольної команди на сучасний ясний кольоровий знімок аматорського клубу у спільній формі. [Точне джерело Pexels](https://www.pexels.com/photo/football-team-posing-for-group-photo-16543116/) — Володимир Король, Pexels License. Фінальне піксельне/мобільне кадрування не схвалене.
- Власні SVG не мають сторонніх ліцензійних обмежень; посилання та авторство оновлені у HTML credits, а Pexels — у curated manifest. Нові зміни перевіряє `check-image-remediation.mjs`.
- **Стан: 49/88 (55,7%), залишилось 39.** Усього зображень: **853 зовнішніх і 321 локальне** на 1174 картки. 671 curated source і 182 поза curated-реєстром (не тотожне відсутності ліцензій).
- `Serie` залишається відкритою: звичайне фото людини біля телевізора означає радше *fernsehen*, а не *die Serie*; не підмінювати суть слабким знімком.
- Залишилось перевірити малий екран, реальну збірку CI та відображення Pexels зображення. Draft PR; main та production Vercel не змінювали.


## Партія 14B — виправлення за скриншотом користувача (23.10.2026)
- Попередні SVG `booking-confirmed.svg` і `mobile-data-volume.svg` **відхилено та видалено**. Вони були надто дрібними і виглядали як плоскі схеми.
- Замість них згенеровано і завантажено **два реалістичні фотографічні PNG оригінали 1536×1024** без водяних знаків. Повні binary-дані імпортовані безпосередньо в GitHub: [Buchung](../public/photos/custom/booking-confirmed.png), [Datenvolumen](../public/photos/custom/mobile-data-volume.png).
- `Buchung`: телефон із чітким `Buchung bestätigt!` у сучасному готельному номері. `Datenvolumen`: телефон на столі з `Datenvolumen`, показником `6,2 GB / 10 GB` та круговим індикатором.
- `src/data.ts` тепер посилається **лише на власні локальні `/photos/custom/*.png`**, а не на Floot CDN або SVG. Отже Vercel бере ті ж файли прямо з репозиторію.
- `check-image-remediation.mjs` перевіряє PNG-сигнатуру, фактичні розміри 1536×1024 і збіг словника з локальним файлом. Кредити та реєстр узгоджені.
- Ніяких додаткових унікальних карток не заявлено: **49/88, лишилося 39**. Дві заміни — це виправлення вже врахованих карток. Draft PR, main/Vercel production без змін. Мобільний кадр ще потребує візуальної перевірки.


## Партія 15 — реалістичні фото Serie, Note, Ausfall (23.10.2026)
- **die Serie** (`hobbies-746`): [оригінальне фото 1536×1024](../public/photos/custom/serie.png) — сучасний телевізор з реальною композицією платформи серіалів, сезоном *Staffel 1* і випусками *Folge 1–5*; відкинуто архівне фото телезйомок.
- **die Note** (`study-644`): [оригінальне фото 1536×1024](../public/photos/custom/note.png) — наочна перевірена німецька контрольна з великою `Note: 1` і `Sehr gut!`; прибрано історично/географічно невідповідний індійський табель. У цьому розділі `Note` означає саме шкільну оцінку.
- **der Ausfall** (`ww-new-073`): [оригінальне фото 1536×1024](../public/photos/custom/ausfall.png) — яскраве німецьке вокзальне табло з однозначним червоним `Ausfall` навпроти поїзда Köln; замінено голландське табло.
- Фотографії згенеровані спеціально для WortWelt, перевірені на PNG сигнатуру, повне розширення, присутність у GitHub. Вони локальні `/photos/custom/`, не залежать від зовнішнього фото-CDN після збірки. Словник, HTML credits, QA реєстр, PNG regression tests та кадрування оновлені.
- **Пріоритетна черга: 52/88 замінено (59,1%), 36 лишилося.** У всьому наборі 1174 картки: 850 зовнішніх зображень, 324 локальні, серед зовнішніх 668 curated entries; 182 інших зовнішніх ресурсів. Не плутати заміну фото із завершеною ручною QA.
- Візуальну придатність початкових згенерованих фотокадрів користувач попередньо підтвердив; фактичне mobile gameplay crop і release main/Vercel ще не схвалені. Draft PR #8, production unchanged.


## Партія 16 — фотоякість сім'ї, 4 оригінали (23.10.2026)
- **die Mutter** (`family-451`) — [оригінальне фото](../public/photos/custom/mutter.png): уважна мама говорить з донькою за столом у сучасній світлій кухні; чітке обличчя, природні емоції, без тексту. Перший варіант із зайвим заголовком відхилено, у GitHub пішло повторне фото.
- **die Tochter** (`family-455`) — [оригінальне фото](../public/photos/custom/tochter.png): дівчинка показує малюнок батькові в сонячній кухні, донька — очевидний основний об'єкт.
- **die Eltern** (`family-465`) — [оригінальне фото](../public/photos/custom/eltern.png): обоє батьків поруч із дитиною вдома; головні обличчя чіткі та в центрі.
- **die Familie** (`family-468`) — [оригінальне фото](../public/photos/custom/familie.png): сімейний сніданок за столом, яскравий натуральний сюжет замість далекого озера, з кількома членами родини.
- Кожна фотографія — окремий **1024×1024 PNG**, без колажу та зовнішніх брендів, збережена безпосередньо у `public/photos/custom/`. Словник `src/data.ts`, photo-credits, curated manifest (лише сторонні фото), регресійні перевірки PNG, а також квадратне кадрування гри узгоджено. Підтверджено сигнатуру й роздільність бінарних файлів; фінальна перевірка саме у мобільному режимі гри ще потрібна.
- **Результат: 56/88 (63,6%) пріоритетних карток замінено, залишилося 32.** Тема Family — 12 із 18 карток отримали заміни у PR, 6 досі потребують окремої візуальної перевірки.
- На всі 1174 картки: 846 сторонніх фото, 328 локальних зображень; 664 curated фото із зареєстрованим зовнішнім джерелом, 182 інших зовнішніх. Гілка `audit/media-quality-oct23` із PR #8, без merge/production deploy.


## Ревізія партії 16: три фото відхилено й перероблено (23.10.2026)
- Після повідомлення користувача «всі крім мами фото невдалі перероби» **Mutter залишено без жодної зміни**. Її Git blob SHA залишився `f2af01c3e1bd034e0ff2cbae16cc16149d1dd0c3`.
- **Tochter**: попередній кадр із батьком замінено на [нову чітку фотографію 1254×1254](../public/photos/custom/tochter.png) — дівчинка з малюнком на передньому плані, мама поруч.
- **Eltern**: попереднє фото батьків із хлопчиком замінено на [новий природний портрет 1254×1254](../public/photos/custom/eltern.png) — мама, тато та донька, обидва батьки чітко видимі.
- **Familie**: попередній багатопоколінний сніданок замінено на [нову фотографію 1254×1254](../public/photos/custom/familie.png) — четверо членів сім'ї за домашнім сніданком.
- Фото імпортовані повними PNG файлами в **ті ж локальні шляхи** `/photos/custom/*.png`; ані словник, ані `Mutter` не потрібно повторно редагувати. QA перевіряє PNG-сигнатури та нові 1254×1254 для трьох перероблених карток.
- Це **три повторні заміни**, тому прогрес залишається **56/88 (63,6%)**, залишилося **32**, до фінальної мобільної візуальної QA. GitHub PR #8 draft, main/Vercel не змінювали.


## Партія 17 — Vater, Sohn, Bruder (23.10.2026)
- **der Vater** (`family-452`) — [оригінальне PNG 1024×1024](../public/photos/custom/vater.png). Фотореалістична сцена батька, який допомагає дитині кататися на велосипеді на світлій садовій доріжці. Попереднє фото з Wikimedia замінено; це **повторна заміна** раніше зарахованої картки.
- **der Sohn** (`family-456`) — [оригінальне PNG 1024×1024](../public/photos/custom/sohn.png). Хлопчик на передньому плані грає з татом у м'яч у парку. Перший генеративний варіант із зайвим написом `der Sohn` відхилено до GitHub, фінальний кадр без напису. Це **одна нова завершена пріоритетна заміна**.
- **der Bruder** (`family-454`) — [оригінальне PNG 1024×1024](../public/photos/custom/bruder.png). Старший брат навчає молодшу сестру складати дерев'яний літачок; головний об'єкт — хлопчик, освітлення природне та чисте. Це **повторна заміна**.
- Збережені точні локальні PNG у `public/photos/custom/`, жодних чужих фотолінків для цих карток. Виправлено vocabulary mapping, атрибуції, curated manifest, регресійний QA та повноекранне мобільне заповнення `object-fit:cover`. Мати з попередньої партії залишилася без змін.
- Результат: **57/88 (64,8%)** пріоритетних зображень замінено в PR (31 лишилося). Сім'я: **13/18 замінено**, 5 на черзі. Production Vercel/main не змінено; фінальна ручна перевірка в застосунку лишається відкритою.


## Партія 18 — завершено заміни п’яти решти сімейних карток (23.10.2026)
- **die Tante** (`family-461`): [оригінальний PNG 1024×1024](../public/photos/custom/tante.png) — доросла тітка складає букет із племінницею в сонячній кімнаті.
- **der Onkel** (`family-462`): [оригінальний PNG 1024×1024](../public/photos/custom/onkel.png) — дядько допомагає племіннику з повітряним змієм на терасі.
- **die Cousine** (`family-463`): [оригінальний PNG 1024×1024](../public/photos/custom/cousine.png) — дві дівчини-підлітки разом готують на світлій кухні.
- **der Cousin** (`family-464`): [оригінальний PNG 1024×1024](../public/photos/custom/cousin.png) — двоє хлопців-підлітків допомагають один одному з колесом велосипеда.
- **das Baby** (`family-467`): [оригінальний PNG 1024×1024](../public/photos/custom/baby.png) — немовля на пледі в світлій дитячій кімнаті, чітке обличчя без жодних написів.
- Усі кадри — окремі фотореалістичні кольорові зображення без колажів, написів або водяних знаків; вони є ілюстративними ситуаціями, а ступінь спорідненості Cousin/Cousine/Tante/Onkel неможливо встановити лише з фото. Файли імпортовані повними PNG у GitHub.
- Зміни внесені у `src/data.ts`, `public/photo-credits.html`, curated manifest, QA-реєстр, регресійні PNG-перевірки та правила відображення в мобільній грі.
- Пріоритетний аудит: **62/88 = 70,5%** зарахованих замін, **26 лишилося**. Тема Family: **18/18 карток отримали заміни**, але не вважати це завершеним персональним естетичним схваленням користувача; потрібна перевірка реального мобільного інтерфейсу.
- Production/main/Vercel не змінені; усе в draft PR #8.


## Партія 19 — нові фото для Kuh/Espresso/freundlich/Teller/Preis/Medikament/Öffnungszeit (23.10.2026)
- **die Kuh** (`nature-512`) — [точне зображення](../public/photos/custom/kuh.png): одна корова породи голштин у зеленому полі, без натовпу тварин та сторонніх об'єктів.
- **der Espresso** (`ww-new-047`) — [точне зображення](../public/photos/custom/espresso.png): порцелянова невелика чашка міцної кави з крема, без брендів, чистий світлий фон.
- **freundlich** (`adjs-916`) — [точне зображення](../public/photos/custom/freundlich.png): реальна доброзичлива взаємодія двох жінок на прогулянці; перше фото на рецепції із зайвим написом на стіні було відхилено.
- **der Teller** (`home-377`) — [точне зображення](../public/photos/custom/teller.png): окрема порожня біла порцелянова тарілка лежить рівно на столі; перше неприродно поставлене зображення було відхилено.
- **der Preis** (`shopping-684`) — [точне зображення](../public/photos/custom/preis.png): великий читабельний цінник `19,90 €` поруч із товаром у магазині.
- **das Medikament** (`body-720`) — [точне зображення](../public/photos/custom/medikament.png): таблетки в блістері і склянка води, без напівчитабельних назв; попередній варіант із написом `das Medikament` на упаковці відхилено.
- **die Öffnungszeit** (`shopping-688`) — [точне зображення](../public/photos/custom/oeffnungszeit.png): реалістична табличка `Öffnungszeiten` з часом роботи німецького магазину.
- Повні **7 оригінальних 1024×1024 PNG** збережено у `public/photos/custom/`, перевірено контрольні сигнатури PNG і їхню роздільну здатність, додано у `src/data.ts`. Оновлено photo-credits, curated manifest, regression tests та правила відображення `object-fit:cover`.
- При генерації тимчасово досягнуто ліміту медіасховища. Видалено лише 3 відхилені тестові картинки саме цієї партії; фотографії, які використовуються в застосунку, не чіпали. Після цього вдалося зробити нову чисту картку Medikament.
- Попередні 5 уже мали заміни, тому це їх якісне доопрацювання. **Лише 2 картки, Medikament та Öffnungszeit, є новими унікальними виправленнями. Загальна черга: 64/88 (72,7%) замінено, 24 залишилося.** На весь каталог 1174 картки — 343 локальні зображення і 831 зовнішнє (650 curated з ліцензіями).
- Залишити PR #8 draft. Не деплоїти Vercel production і не зливати в main без підтвердження. Остаточне візуальне схвалення всіх карток на телефоні ще відкрите.


## Партія 20–21: user-approved Kuh/freundlich + 3 нові карти (23.10.2026)
- **die Kuh** (`nature-512`): за прямим зауваженням користувача стару фронтальну корову замінено на **схвалене ним реалістичне бічне фото** 1254×1254. [Фактичний PNG](../public/photos/custom/kuh.png).
- **freundlich** (`adjs-916`): надто награну рукостискальну сцену замінено на **схвалену користувачем природну прогулянку та допомогу літній жінці з покупками**, 1254×1254. [Фактичний PNG](../public/photos/custom/freundlich.png).
- **der Bildschirm** (`technology-243`): [оригінальне PNG](../public/photos/custom/bildschirm.png), 1024×1024, чіткий великий екран монітора на столі в світлому офісі.
- **der Staubsauger** (`ww-new-090`): [оригінальне PNG](../public/photos/custom/staubsauger.png), 1024×1024, впізнаваний пилосос повністю в кадрі, затишна вітальня.
- **die Haltestelle** (`city-559`): [оригінальне PNG](../public/photos/custom/haltestelle.png), 1024×1024, добре видно характерний жовто-червоний знак H та зупинковий павільйон у Німеччині.
- **Передача трьох нових файлів**: перша спроба GitHub Actions `git push` завершилася HTTP 408 після скачування правильних PNG. Повторний імпорт через GitHub Git Data API (`blob/tree/commit/ref`) успішно записав їх у репозиторій. Без втрати файлів чи змін production.
- Словник, ліцензії і авторство, реєстр, локальна PNG-сигнатура, відповідність слову й розміри, CSS для ігрової картки узгоджені. Повний mobile gameplay crop і ручне схвалення **трьох нових** зображень ще залишаються для QA; два попередні нові варіанти схвалені користувачем у чаті.
- **Прогрес 67/88 (76,1%), залишилося 21.** Kuh і freundlich — дві переробки зауважень без додаткового лічильника; Bildschirm/Staubsauger/Haltestelle — три нові завершені пріоритетні заміни в draft PR.
- Всього 1174 картки, 346 локальних фото і 828 зовнішніх (647 curated). PR #8 draft, main/Vercel production unchanged.


## Партія 22 — їжа, дім та тварини (23.10.2026)

- **die Pasta** (`food-297`): [точне фото Pexels](https://www.pexels.com/photo/close-up-of-spaghetti-pasta-on-plate-4518946/) — Чітка тарілка зі спагеті на світлому фоні; одна страва без сторонніх об'єктів. Автор: Polina Tankilevitch, Pexels License.
- **das Hähnchen** (`food-300`): [точне фото Pexels](https://www.pexels.com/photo/roasted-chicken-on-a-white-plate-6163330/) — Одна ціла запечена курка на білій тарілці, зрозумілий предмет слова. Автор: Maksim Goncharenok, Pexels License.
- **die Decke** (`home-349`): [точне фото Pexels](https://www.pexels.com/photo/photo-of-white-painted-ceiling-3615726/) — Вид на білу стелю зі звичайним підвісним світильником; саме стеля, не ковдра. Автор: La Miko, Pexels License.
- **die Badewanne** (`home-374`): [точне фото Pexels](https://www.pexels.com/photo/bathtub-in-a-modern-bathroom-19984614/) — Окрема сучасна ванна в чистій ванній кімнаті, без зайвих деталей. Автор: Hallie, Pexels License.
- **das Steak** (`ww-new-207`): [точне фото Pexels](https://www.pexels.com/photo/a-plate-with-a-steak-and-lemon-on-it-27305268/) — Один виразний гриль-стейк на тарілці; фото без водяних знаків. Автор: Valeria Boltneva, Pexels License.
- **der Bär** (`ww-new-120`): [точне фото Pexels](https://www.pexels.com/photo/close-up-of-a-brown-bear-in-natural-habitat-31011138/) — Один бурий ведмідь у природному середовищі, заміна неоднозначної групи ведмедів. Автор: Marcin Marcelliszcz, Pexels License.

Шість нових пріоритетних карток отримали посилання на високороздільні фото Pexels у `src/data.ts`; це **ліцензовані зовнішні фотографії**, а не PNG, згенеровані всередині WortWelt. Оновлено curated-реєстр, авторство/ліцензії, QA, регресійні URL-перевірки. Оригінальні сторінки джерел перевірено, **телефонне кадрування та остаточне візуальне схвалення користувача ще потрібні**. `die Decke` = стеля саме в цій картці.

**Прогрес: 73/88 (83.0%), залишилося 15.** Зміни лише в draft PR #8; main/Vercel не змінювали.


## Партія 23 — перероблена стеля й 8 нових проблемних карток (23.10.2026)

- **die Decke** (`home-349`, user-requested REDO): [точне фото](https://www.pexels.com/photo/white-ceiling-in-an-empty-room-8678894/) — Переробка: у центрі видима геометрична стеля порожньої кімнати; попередню лампочку відхилено. Автор: H&CO; Pexels License.
- **die Straße** (`city-523`, нова пріоритетна заміна): [точне фото](https://www.pexels.com/photo/narrow-street-with-wooden-residential-houses-in-german-style-4916136/) — Чітко видна європейська вулиця між будинками, дорога у центрі. Автор: Maria Orlova; Pexels License.
- **das Dokument** (`work-623`, нова пріоритетна заміна): [точне фото](https://www.pexels.com/photo/person-holding-a-document-8463149/) — На передньому плані документ у руках над клавіатурою, а не просто офіс. Автор: Kampus Production; Pexels License.
- **der Unterricht** (`study-646`, нова пріоритетна заміна): [точне фото](https://www.pexels.com/photo/teacher-and-students-in-the-classroom-8617967/) — Світлий клас: учитель взаємодіє з учнями під час уроку. Автор: Yan Krukau; Pexels License.
- **der Geldschein** (`shopping-677`, нова пріоритетна заміна): [точне фото](https://www.pexels.com/photo/photo-of-european-banknotes-4201343/) — Впізнавані банкноти євро крупним планом, без монет або карток. Автор: Markus Spiske; Pexels License.
- **der Zahn** (`body-698`, нова пріоритетна заміна): [точне фото](https://www.pexels.com/photo/close-up-shot-of-a-person-holding-a-tooth-7195433/) — Один зуб крупним планом на світлому фоні, замість цілої усмішки. Автор: Kaboompics; Pexels License.
- **der Mund** (`body-697`, нова пріоритетна заміна): [точне фото](https://www.pexels.com/photo/close-up-of-womans-mouth-in-a-gentle-smile-13765656/) — Нейтральні натуральні губи без яскравої помади. Автор: Mizuno K; Pexels License.
- **der Hals** (`body-701`, нова пріоритетна заміна): [точне фото](https://www.pexels.com/photo/close-up-shot-of-a-person-s-neck-7067815/) — Видно людську шию та ключиці, без шарфа й написів. Автор: Irina Gonchar; Pexels License.
- **die E-Mail** (`technology-265`, нова пріоритетна заміна): [точне фото](https://www.pexels.com/photo/person-holding-a-smartphone-5744250/) — Світлий екран смартфона з відкритою електронною поштою; аналог картки work-622. Автор: Solen Feyissa; Pexels License.

Попередню стелю з лампочкою відхилено і не повертаємо. Усі 9 URL зі сторінок Pexels з описами і авторством, дійсні фотосторінки; телефонний квадратний кроп і суб'єктивна якість у грі ще потребують особистого схвалення. Редо не рахуємо двічі. 

**Прогрес: 81/88 (92.0%), залишається 7.** Лише draft PR #8. Main/Vercel production без змін.


## Партія 24 — завершення розбору 7 пріоритетних карток + схвалений Zahn

- **das Land**: [точне Pexels фото](https://www.pexels.com/photo/flags-on-a-map-8828597/) — Карта Європи з прапорцями окремих держав, зрозумілий символ країн. Автор: Lara Jameson, Pexels License.
- **der Beruf**: [точне Pexels фото](https://www.pexels.com/photo/studio-shot-of-various-professions-representatives-9879936/) — П'ять представниць різних професій у формі, реальна групова студійна фотографія (не колаж). Автор: Wayne Fotografias, Pexels License.
- **das Unternehmen**: [точне Pexels фото](https://www.pexels.com/photo/people-working-together-at-the-office-6326260/) — Команда працює в офісі; зв'язок з поняттям підприємства через організацію людей. Автор: olia danilevich, Pexels License.
- **das Blut**: [точне Pexels фото](https://www.pexels.com/photo/woman-wearing-a-white-uniform-holding-a-blood-sample-6285363/) — Медпрацівниця тримає пробірку зі зразком крові; без травм та шокувальних деталей. Автор: Gustavo Fring, Pexels License.

**Без заміни (свідомо залишено, не вважати новими фото):**
- **Tier** — Одна собака залишається коректною конкретною ілюстрацією слова тварина; універсальне зображення всіх тварин неможливе. Остаточна оцінка кольору та кадру на телефоні відкритa.
- **Donner** — Блискавка — прийнятна фізична ознака грози, пов'язаної з громом, сам звук нерепрезентований на статичному фото; бажаний аудіо-супровід у грі.
- **Fundbüro** — На фото реальні працівниці бюро знахідок із предметами. Нові альтернативи відхилені: або застарілі/низької якості, або за ліцензіями недостатньо чіткі. Мобільна якість і читаємість ще на QA.

**der Zahn:** фінально схвалене користувачем фото (палець показує на білі зуби, щільніший кроп) 1254×1254 PNG в `public/photos/custom/zahn.png`. Старий Pexels URL 7195433 прибраний зі словника й curated photo-реєстру та credits; нові відповідності додані до регресійних тестів. PNG 1254×1254 повністю завантажено в GitHub через одноразовий GitHub Actions імпорт із перевіркою SHA256; імпортер і тригер видалено. Користувач схвалив фото в чаті, рендер усередині мобільної гри ще потребує перевірки.

**88/88 пріоритетних рішень оформлено:** **85** унікальних карток із заміненими фото, **3** залишені без заміни як прийнятні, що відрізняється від 100% візуального схвалення. Для 1174 загальних карток великий наскрізний pixel QA не завершений. Production Vercel/main untouched.


## Технічне виправлення GitHub CI (23.10.2026)

- Повний approved Zahn PNG (1,941,335 байтів, 1254×1254, SHA256 `2bf5875d72e80dc20d03b4dfc8cadda141f5ee6c579546723c30e07ca0382346`) збережено у `public/photos/custom/zahn.png` за GitHub Actions успішного запуску `39966147056`.
- Після попередньої партії CI показав дубль `technology-265` та `work-622`: обидва мають однаковий лексичний об'єкт `die E-Mail`. Зміненo `scripts/check-photos.mjs`, щоб лише точні збіги слова + артикля могли використовувати той самий файл; для різних слів перевірка заборони повторень залишається.
- Виробничий Vercel та main без змін; нові GitHub Action CI збірки повторно перевіряються.


## Batch 24 технічний ремонт — E-Mail без дублювання
- `technology-265` (die E-Mail) — [точне фото застосунку пошти](https://www.pexels.com/photo/close-up-photo-of-a-mail-application-7568298/) автор Brett Jordan, Pexels License, замість того самого Pexels source, який був у `work-622`.
- `work-622` залишається зі смартфоном, на якому відкрито поштову скриньку.
- Це виправляє два незалежні тести унікальності 736 noun images без послаблення тестів. Нове унікальне пріоритетне слово не додається, рахунок **85 замінених + 3 залишених = 88 розглянутих** не змінюється.


## Партія №25 — повний міжтематичний повторний аудит, 23.10.2026

Знайдені попередні невдалі відповідності та темні/непоказові фото замінено за семантичним принципом. Охоплено **26 карток**, серед них **10 іменників**, дієслова, прикметники та фраза.

- **Guten Morgen!** (`phrases-1`, phrase, phrases): [точне Pexels джерело](https://www.pexels.com/photo/green-grass-field-during-sun-rise-997121/) — Кольоровий ранок над зеленим полем замість темного фото.
- **Morgen** (`time-767`, noun, calendar): [точне Pexels джерело](https://www.pexels.com/photo/green-grass-field-during-sun-rise-997121/) — Кольоровий ранок над зеленим полем замість темного фото.
- **früh** (`adjs-933`, adj, adjs): [точне Pexels джерело](https://www.pexels.com/photo/green-grass-field-during-sun-rise-997121/) — Кольоровий ранок над зеленим полем замість темного фото.
- **aufwachen** (`everyday-44`, verb, everyday): [точне Pexels джерело](https://www.pexels.com/photo/sleepy-woman-waking-up-on-bed-in-morning-7622509/) — Людина справді прокидається в освітленій спальні, не просто будильник.
- **aufwachen** (`verbs-850`, verb, verbs): [точне Pexels джерело](https://www.pexels.com/photo/sleepy-woman-waking-up-on-bed-in-morning-7622509/) — Людина справді прокидається в освітленій спальні, не просто будильник.
- **wach** (`adjs-911`, adj, adjs): [точне Pexels джерело](https://www.pexels.com/photo/sleepy-woman-waking-up-on-bed-in-morning-7622509/) — Людина справді прокидається в освітленій спальні, не просто будильник.
- **kochen** (`everyday-52`, verb, everyday): [точне Pexels джерело](https://www.pexels.com/photo/woman-cooking-in-kitchen-7418495/) — Сучасне приготування їжі на кухні замість темного вогнища.
- **kochen** (`verbs-814`, verb, verbs): [точне Pexels джерело](https://www.pexels.com/photo/woman-cooking-in-kitchen-7418495/) — Сучасне приготування їжі на кухні замість темного вогнища.
- **waschen** (`everyday-57`, verb, everyday): [точне Pexels джерело](https://www.pexels.com/photo/person-washing-hands-3943909/) — На передньому плані справді миють руки водою.
- **waschen** (`verbs-865`, verb, verbs): [точне Pexels джерело](https://www.pexels.com/photo/person-washing-hands-3943909/) — На передньому плані справді миють руки водою.
- **warten** (`everyday-70`, verb, everyday): [точне Pexels джерело](https://www.pexels.com/photo/a-person-waiting-on-a-bus-stop-9180935/) — Видно людину, яка чекає на транспорт, а не тільки годинник.
- **warten** (`verbs-855`, verb, verbs): [точне Pexels джерело](https://www.pexels.com/photo/a-person-waiting-on-a-bus-stop-9180935/) — Видно людину, яка чекає на транспорт, а не тільки годинник.
- **Computer** (`technology-246`, noun, tech): [точне Pexels джерело](https://www.pexels.com/photo/contemporary-workplace-with-office-supplies-and-computer-6177594/) — Світлий повноцінний комп'ютер на робочому столі замість темного RGB.
- **Tastatur** (`technology-244`, noun, tech): [точне Pexels джерело](https://www.pexels.com/photo/close-up-shot-of-a-person-typing-on-a-keyboard-8572600/) — Клавіатура крупним планом при денному освітленні.
- **Unterkunft** (`travel-440`, noun, tourism): [точне Pexels джерело](https://www.pexels.com/photo/interior-of-bright-room-in-hotel-6186819/) — Добре освітлена кімната для проживання.
- **Ankunft** (`travel-444`, noun, publictransport): [точне Pexels джерело](https://www.pexels.com/photo/departures-and-arrivals-screen-at-airport-16739127/) — Сучасне табло прибуття замість нечіткого вокзального екрана.
- **Junge** (`family-479`, noun, people): [точне Pexels джерело](https://www.pexels.com/photo/smiling-boy-in-green-shirt-outdoors-28614908/) — Чіткий портрет хлопчика вдень замість затемненого кадру.
- **Natur** (`nature-484`, noun, landscapes): [точне Pexels джерело](https://www.pexels.com/photo/green-grass-field-57659/) — Світла природа, зелений луг і сонячне небо замість темного лісу.
- **Himmel** (`nature-495`, noun, weather): [точне Pexels джерело](https://www.pexels.com/photo/blue-sky-with-white-clouds-23234956/) — Чисте блакитне небо в кадрі, без літака і затемнень.
- **Wecker** (`time-794`, noun, calendar): [точне Pexels джерело](https://www.pexels.com/photo/close-up-shot-of-a-white-alarm-clock-7361181/) — Великий білий будильник при світлому освітленні.
- **Topf** (`home-383`, noun, kitchenware): [точне Pexels джерело](https://www.pexels.com/photo/silver-cooking-pot-on-black-stove-12673687/) — Чітка металева каструля у звичайній світлій кухні.
- **sprechen** (`verbs-807`, verb, verbs): [точне Pexels джерело](https://www.pexels.com/photo/best-friends-talking-in-park-5543178/) — Двоє людей розмовляють, замість самотнього мікрофона.
- **sagen** (`verbs-834`, verb, verbs): [точне Pexels джерело](https://www.pexels.com/photo/best-friends-talking-in-park-5543178/) — Двоє людей розмовляють, замість самотнього мікрофона.
- **kommen** (`verbs-803`, verb, verbs): [точне Pexels джерело](https://www.pexels.com/photo/urban-train-arriving-at-european-railway-station-33983936/) — Потяг прибуває на європейську станцію, а не табло.
- **ankommen** (`ww-new-159`, verb, verbs): [точне Pexels джерело](https://www.pexels.com/photo/urban-train-arriving-at-european-railway-station-33983936/) — Потяг прибуває на європейську станцію, а не табло.
- **glücklich** (`adjs-914`, adj, adjs): [точне Pexels джерело](https://www.pexels.com/photo/portrait-of-a-woman-smiling-9322439/) — Щира радісна усмішка, а не торт.

Технічна перевірка: нові прямі JPEG URL Pexels доступні, щонайменше 960px; **736 іменників зберігають 736 різних фото**, старі user-approved заміни не змінені. Це QA draft, `main` і Vercel production без змін. Контроль картинки у квадратному мобільному вікні та остаточне візуальне схвалення ще попереду; **не заявляти, що весь 1174-картковий каталог ідеальний**.
