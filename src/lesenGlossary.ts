/** Shared word-by-word contextual translations for Lesen A0–A1.
 * The first occurrence in each story's glossary wins over common terms.
 * Case-sensitive matches preserve the distinction between sie (she) and Sie (formal you).
 */
export type Gloss=readonly [uk:string,en:string];
export function parseGloss(raw:string):Readonly<Record<string,Gloss>>{
 return Object.fromEntries(raw.trim().split("\n").map((line)=>{
  const parts=line.split("|");
  if(parts.length!==3)throw new Error("Invalid reading glossary line");
  return [parts[0],[parts[1],parts[2]] as const];
 }));
}
export const COMMON_READING_GLOSS=parseGloss(`
ich|я|I
du|ти|you (informal)
er|він|he
sie|вона|she
Sie|Ви (ввічливо)|you (formal)
wir|ми|we
ihr|ви (неформально, множина)|you (plural informal)
es|воно; це|it
mein|мій|my
meine|моя; мої|my
seine|його|his
ihre|її|her
der|означений артикль чоловічого роду|the (masculine)
die|означений артикль жіночого роду або множини|the (feminine or plural)
das|означений артикль середнього роду|the (neuter)
dem|означений артикль у Dativ|the (dative)
den|означений артикль у Akkusativ|the (accusative)
ein|неозначений артикль|a; an
eine|неозначений артикль жіночого роду|a; an (feminine)
einen|неозначений артикль в Akkusativ|a; an (accusative)
einer|неозначений артикль у Dativ/Genitiv|a (dative/genitive)
einem|неозначений артикль у Dativ|a (dative)
und|і|and
oder|або|or
aber|але|but
auch|також|also
noch|ще|still; another
nur|лише|only
nicht|не|not
nichts|нічого|nothing
mit|з; разом із|with
in|у; в|in
im|у; в (in dem)|in the
am|у; на (an dem)|at; on the
an|на; до|at; to
auf|на|on; onto
aus|з; назовні|out of; from
bei|у; біля|at; near
nach|після; до міста|after; to
zum|до (zu dem)|to the
zur|до (zu der)|to the
von|з; від|from; of
für|для|for
vor|перед|in front of; before
um|о (годині); навколо|at (time); around
seit|від; протягом|since; for
heute|сьогодні|today
morgen|завтра|tomorrow
Morgen|ранок|morning
dann|потім|then
später|пізніше|later
zuerst|спочатку|first
jetzt|зараз|now
hier|тут|here
dort|там|there
sehr|дуже|very
wieder|знову|again
schon|вже|already
alles|усе|everything
alle|усі|all
ist|є (від sein)|is
sind|є (множина)|are
hat|має|has
haben|мають|have
habe|маю|have
macht|робить|makes; does
machen|робити|make; do
geht|іде|goes
gehen|іти|go
kommt|приходить; прибуває|comes; arrives
kommen|приходити|come
sagt|каже|says
fragt|запитує|asks
möchte|хотів/хотіла б|would like
Möchten|чи бажаєте (ввічливо)|would you like (formal)
muss|мусить; має|must; has to
müssen|мусити|must; have to
kann|може|can
einmal|раз; ще раз|once; again
etwas|щось|something
zwei|два|two
drei|три|three
fünf|п'ять|five
sechs|шість|six
sieben|сім|seven
acht|вісім|eight
zehn|десять|ten
achthundert|вісімсот|eight hundred
Euro|євро|euros
Uhr|година (час)|o'clock
ja|так|yes
nein|ні|no
bitte|будь ласка|please
danke|дякую|thank you
Brot|хліб|bread
Bus|автобус|bus
sich|себе (зворотний займенник)|oneself (reflexive)
zu|до; у фразах за контекстом|to; too
`);
export const EXPANDED_READING_GLOSS=parseGloss(`
Abend|вечір|evening
allein|самостійно; наодинці|alone; independently
allen|усім|everyone; all
ältere|старша; літня|older
andere|інші|other
anderen|іншому; інших|other
Angeboten|пропозиціях; оголошеннях|listings; offers
Angst|страх|fear
Anna|Анна (ім'я)|Anna (name)
ans|до (an das)|to the
Ansage|оголошення|announcement
antwortet|відповідає|replies
Bäckerei|пекарня|bakery
bald|скоро|soon
Bankkarte|банківська картка|bank card
bedankt|дякує|thanks
beginnt|починається|begins
begrüßt|вітає|greets
beiden|двоє; обидва|both
beim|у; під час (bei dem)|at; while
bekommt|отримує|receives
Ben|Бен (ім'я)|Ben (name)
Besichtigungstermin|зустріч для огляду квартири|apartment viewing appointment
besonderen|особливий (знахідний відмінок)|special
bestellt|замовляє|orders
Bett|ліжко|bed
bevor|перш ніж|before
bezahlen|платити|pay
bin|є; я є (від sein)|am
bittet|просить|asks; requests
Blumen|квіти|flowers
Brötchen|булочки|bread rolls
Bruder|брат|brother
Buch|книжка|book
Bushaltestelle|автобусна зупинка|bus stop
da|тут; на місці|there; present
dabei|із собою|with him; on hand
dass|що (сполучник)|that
denkt|думає|thinks
des|артикль у родовому відмінку|the (genitive)
Deutschland|Німеччина|Germany
Dialog|діалог|dialogue
diesem|цьому (давальний відмінок)|this (dative)
Dieses|цей; це|this
doch|проте; усе ж|however; after all
Doch|але; проте|but; however
Draußen|надворі|outside
dritten|третій|third
eigene|власну|own
Eingang|вхід|entrance
Einkäufe|покупки|shopping; purchases
Einkaufstasche|сумка для покупок|shopping bag
eins|один|one
Emma|Емма (ім'я)|Emma (name)
Empfang|рецепція; приймальня|reception
Ende|кінець|end
endlich|нарешті|finally
Endlich|нарешті|finally
Erfolg|успіх|success
erst|лише; тільки|only; just
erste|перший; перша|first
erster|перший|first
erzählt|розповідає|tells
Fahrplan|розклад руху|timetable
Familie|сім'я|family
Fehler|помилка|mistake
fehlt|бракує|is missing
Fenster|вікно|window
finden|знаходити|find
Frage|запитання|question
Fragen|запитання (множина)|questions
Frau|жінка|woman
Freude|радість|joy
Freund|друг|friend
Freundin|подруга|female friend
freundlich|привітно; доброзичливо|kindly; warmly
freut|радіє|is happy
frische|свіжі|fresh
frischem|свіжим|fresh (dative)
früh|рано|early
Frühstück|сніданок|breakfast
ganz|цілком; зовсім|completely; quite
gar|зовсім; узагалі|at all
Gebäude|будівля; будівлі|building; buildings
Geburtstag|день народження|birthday
Geburtstagslied|пісня до дня народження|birthday song
geduldig|терпляче|patiently
gefällt|подобається|appeals to; likes
gefunden|знайшов; знайдено|found
Geld|гроші|money
Geldbeutel|гаманець|wallet
gelungen|вдалося|succeeded
genau|саме; точно|exactly
gern|із задоволенням|gladly
Geschenk|подарунок|present
gezogen|переїхав (у фразі ist gezogen)|moved (past participle)
gibt|є; дає|there is; gives
gleichen|того самого|same
Glück|щастя; удача|luck
große|великі|big; large
Gute|добро; хороше|good things
Hallo|привіт|hello
Haltestellen|зупинки|stops
Handy|мобільний телефон|mobile phone
hätte|хотів би; мала б|would have; would like
Haus|будинок|house
Hause|удома (zu Hause)|home (as in at home)
Heimweg|дорога додому|way home
heiße|мене звати|am called
Heizkosten|витрати на опалення|heating costs
helfen|допомагати|help
helle|світла|bright
Hilfe|допомога|help
hinein|усередину|inside
hinter|позаду; за|behind
hört|чує|hears
ihm|йому|to him
ihn|його|him
ihren|її; свій (знахідний відмінок)|her; their
ihrer|її (давальний відмінок)|her (dative)
immer|завжди; щоразу|always
Internet|інтернет|internet
Jeden|кожного|every
Jeder|кожен|every
jedes|кожне|every
Kaffee|кава|coffee
Kartenlesegerät|термінал для оплати карткою|card reader
kein|жодного; немає|no; not any
klappt|вдається|works out
Klassenzimmer|класна кімната|classroom
kleine|маленька|small
kleinen|маленький (відмінювана форма)|small (inflected)
kleines|маленьке|small
können|могти; можете|can
Kopf|голова|head
kostet|коштує|costs
Kuchen|торт; пиріг|cake
Küchentisch|кухонний стіл|kitchen table
Kunden|покупці; клієнти|customers
Kundin|покупчиня|female customer
kurz|коротко; швидко|briefly
lächelt|усміхається|smiles
lachen|сміятися|laugh
lacht|сміється|laughs
lädt|запрошує|invites
lange|довго; тривалий|long
Lara|Лара (ім'я)|Lara (name)
läuft|біжить|runs
laut|вголос; гучно|aloud; loud
leer|порожній|empty
legt|кладе|puts
Lehrerin|учителька|female teacher
leise|тихо|quietly
Lernen|навчання|learning
lesen|читати|read
Lesen|читання|reading
liebe|люба|dear
liegt|лежить|lies
liest|читає|reads
linken|лівий; ліворуч|left
Mädchen|дівчинка|girl
Mal|раз|time; occasion
Mann|чоловік|man
Menschen|люди|people
merkt|розуміє; помічає|realises; notices
Mitarbeiterin|працівниця|female employee
Mitschülerin|однокурсниця; однокласниця|female classmate
möchten|хотіти (ввічлива форма)|would like
Monat|місяць|month
Monatsmieten|місячні орендні плати|months of rent
Montag|понеділок|Monday
mutiger|сміливішою|more confident
nachgedacht|роздумував|thought about
Nachricht|повідомлення|message
nächsten|наступний (відмінювана форма)|next
Namen|ім'я|name
namens|на ім'я|named
nämlich|адже; справа в тому, що|because; you see
Natürlich|звісно|of course
neben|поруч|next to
Neben|поруч|beside
nervös|нервує; схвильований|nervous
neu|новий; новенький|new
neue|нова; нову|new (feminine)
neuen|новий (відмінювана форма)|new (inflected)
neun|дев'ять|nine
nimmt|бере|takes
öffnet|відчиняє|opens
Oh|ой; о|oh
peinlich|незручно; ніяково|embarrassing
perfekt|ідеальний|perfect
Plan|план|plan
Postleitzahl|поштовий індекс|postcode
rechnet|рахує|calculates
Regenschirm|парасоля|umbrella
regnet|дощить|rains
Reihe|черга; порядок|turn; queue
richtig|правильно; правильний|correct
richtige|правильна|correct
riecht|пахне|smells
rot|червоний; червоніє|red; blushes
roten|червоний (відмінювана форма)|red (inflected)
Rucksack|рюкзак|backpack
sagen|казати|say
schaut|дивиться|looks
scheint|світить|shines
Schlange|черга|queue
schnell|швидко|quickly
Schokoladenkuchen|шоколадний торт|chocolate cake
schönen|гарний (відмінювана форма)|beautiful
schönste|найкращий; найгарніший|best; most beautiful
schreibt|пише|writes
Schritt|крок|step
Schultag|шкільний день|school day
schwer|важкий; складний|heavy; difficult
sein|його; бути (залежно від контексту)|his; be
seinem|його (давальний відмінок)|his (dative)
seinen|його (знахідний відмінок)|his (accusative)
seiner|його (давальний/родовий)|his (dative/genitive)
Seite|сторона; бік|side
Sendungsnummer|номер відстеження|tracking number
setzt|сідає; садить|sits down; puts
sieht|бачить|sees
singt|співає|sings
sitzt|сидить|sits
so|так; настільки|so
Sofa|диван|sofa
sofort|негайно; одразу|immediately
sogar|навіть|even
soll|має; повинен|should; is supposed to
Sonst|інакше; іще|otherwise; else
spielen|грати|play
spricht|говорить|speaks
Stadt|місто|town; city
stark|сильно|strongly
stehen|стояти|stand
steigen|сідати; виходити|board; get off
steigt|сідає; виходить|boards; gets off
stellt|ставить|puts; places
Straße|вулиця|street
Stuhl|стілець|chair
sucht|шукає|looks for
Szene|сценка|scene
Tag|день|day
Tages|дня (родовий відмінок)|of the day
Tasche|сумка|bag
Termin|запис; зустріч|appointment
Tisch|стіл|table
trägt|несе|carries
Tür|двері|door
üben|тренуватися|practise
über|про; над|about; over
Überraschung|сюрприз|surprise
übt|тренує; вправляється|practises
umarmt|обіймає|hugs
uns|нас; нам|us
unter|під|under
unterschreiben|підписувати|sign
verbessert|виправляє|corrects
Verkäuferin|продавчиня|female shop assistant
versteht|розуміє|understands
Vertrag|договір|contract
verwechselt|плутає|mixes up
viel|багато|much; a lot
viele|багато|many
vorsichtig|обережно|carefully
wachsen|ростуть|grow
war|був; була|was
wartet|чекає|waits
was|що|what
Was|що|what
Weg|дорога; шлях|way; route
weiß|знає|knows
Welches|який; яка (середній рід)|which
wichtig|важливий|important
wichtige|важливе|important
wichtigen|важливий (відмінювана форма)|important
wie|як|how
wird|стає; буде|becomes; will
wirklich|справді|really
Woche|тиждень|week
Wochen|тижні|weeks
wohnt|живе|lives
Wort|слово|word
Zahl|цифра; число|number; digit
zählt|рахує|counts
zeigt|показує|shows
Zimmer|кімната|room
Zurzeit|зараз|at present
zusammen|разом|together
`);
export function readingTokens(sentence:string):string[]{
 return sentence.match(/[\p{L}]+|[^\p{L}]+/gu)||[];
}
export function readingGloss(word:string,own:Readonly<Record<string,Gloss>>):Gloss|undefined{
 const lower=word.toLocaleLowerCase("de");
 return own[word]||COMMON_READING_GLOSS[word]||EXPANDED_READING_GLOSS[word]||own[lower]||COMMON_READING_GLOSS[lower]||EXPANDED_READING_GLOSS[lower];
}
