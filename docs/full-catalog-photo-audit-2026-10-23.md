# WortWelt — повторний аудит усіх 47 тем (23.10.2026)

## Підсумок
- **1174 картки / 47 тем:** 736 іменників, 153 дієслова, 94 прикметники, 191 фраза. Усі картки мають шлях або URL до зображення.
- Усі **736 іменників мають 736 різних фотографій/зображень** за шляхами. У словнику немає порожніх карток.
- Перша пріоритетна черга: **85 замін + 3 збережені = 88 рішень**.
- Нова партія №25: **26 додаткових замін** (10 іменників, 12 дієслів, 3 прикметники, 1 фраза). Разом **111 окремих карток зі staged-замінами** у двох чергах. Важливо: ці лічильники про редакційні зміни, а не 111 нових фото, згенерованих у цей день.
- Перевірка доступних зовнішніх JPEG перед новою партією: 828 запитів, **418 успішно відкрилися**, **410 отримали HTTP 429** через ліміт Wikimedia, **0 інших мережевих помилок**. HTTP 429 **не означає**, що фото зламане в застосунку (релізний mirror-photos self-hosting).
- **346–347 локальних зображень** (різниця на межі перенесення PNG Zahn) не пройшли повного суб'єктивного pixel-QA у цьому проході.
- Знайдено **107 груп спільних URL** для різних значень серед усіх частин мови. Це не автоматична помилка: користувач дозволив семантично коректні повтори.

## Відкриті ручні питання після нових замін
- **Guten Tag!** (`phrases-2`) — Current daytime park photograph doesn't directly communicate the greeting; semantic review advised.
- **aufstehen** (`everyday-43`) — Current shared bed scene also used for schlafen/einschlafen/Bett/müde, not unequivocally getting out of bed.
- **aufstehen** (`verbs-849`) — Same generic bed scene, distinguish from schlafen.
- **spät** (`adjs-932`) — Stars/night conveys nighttime more than 'late'; avoid replacing with equally vague picture.
- **Regen** (`nature-500`) — Dark rainy image low light; may be acceptable due subject, pending smartphone crop.
- **Donner** (`ww-new-131`) — Photo of lightning denotes thunderstorm but not the sound itself; consider audio pairing.
- **Großvater** (`family-460`) — Older previous-stage Pexels family photo has low measured brightness; kept because relationship is unambiguous and was part of prior family batch.
- **Löffel** (`home-382`) — Low edge score likely due intentionally isolated spoon on white background; do not reject mechanically.

## Покриття за всіма 47 темами
| Тема | Картки | У партії №25 замінено |
|---|---:|---:|
| phrases | 40 | 1 |
| everyday | 39 | 4 |
| dining | 11 | 0 |
| questions | 23 | 0 |
| pronouns | 31 | 0 |
| adverbs | 43 | 0 |
| preps | 28 | 0 |
| institutions | 25 | 0 |
| social | 4 | 0 |
| banking | 22 | 0 |
| housing | 12 | 0 |
| tech | 36 | 2 |
| fruits | 17 | 0 |
| staples | 42 | 0 |
| dishes | 16 | 0 |
| vegetables | 17 | 0 |
| calendar | 41 | 2 |
| drinks | 12 | 0 |
| rooms | 16 | 0 |
| furniture | 10 | 0 |
| housework | 27 | 0 |
| bathroom | 6 | 0 |
| kitchenware | 8 | 1 |
| clothing | 45 | 0 |
| tourism | 24 | 1 |
| publictransport | 30 | 1 |
| family | 18 | 0 |
| people | 15 | 1 |
| landscapes | 17 | 1 |
| weather | 19 | 1 |
| animals | 21 | 0 |
| citydirections | 29 | 0 |
| places | 21 | 0 |
| vehicles | 13 | 0 |
| work | 17 | 0 |
| office | 12 | 0 |
| school | 27 | 0 |
| university | 9 | 0 |
| shopping | 24 | 0 |
| bodyparts | 20 | 0 |
| symptoms | 9 | 0 |
| medical | 11 | 0 |
| sports | 10 | 0 |
| leisure | 24 | 0 |
| verbs | 113 | 8 |
| adjs | 94 | 3 |
| numbers | 26 | 0 |

## Межі висновку
Це повторний **каталожний та частковий піксельний аудит** усіх тем, не фінальний естетичний огляд кожної з 1174 фотографій у мобільному інтерфейсі. Без такого огляду не можна заявити, що невдалі зображення відсутні. Після нових 26 замін потрібна повторна автоматична збірка GitHub і контроль мобільних квадратних кропів перед будь-якою публікацією. PR #8 має залишатися draft, без merge до main і без Vercel production.
