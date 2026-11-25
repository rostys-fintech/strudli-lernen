import type {ReadingStory,ReadingQuestion} from "./lesenStories";
import {parseGloss} from "./lesenGlossary";
const Q=(uk:string,en:string,choices:[string,string][],correct:0|1|2):ReadingQuestion=>({prompt:[uk,en],choices:choices as unknown as ReadingQuestion["choices"],correct});
/** Four original plotted A0–A1 stories: daily conversations + narrative twists.
 * Each has 20 reviewed trilingual sentences, four paragraphs and three comprehension questions.
 */
export const LESSON_STORIES_C:readonly ReadingStory[]=[
{
 id:"cafe-key",level:"A1",emoji:"🔑",
 title:{"de":"Der Schlüssel im Café","uk":"Ключ у кафе","en":"The Key in the Café"},
 subtitle:["Загублений ключ, допомога та перше заняття","A lost key, a helping hand and a first class"],
 sentences:[
  [
    "Es ist kurz vor acht Uhr.",
    "До восьмої залишилося зовсім мало часу.",
    "It is almost eight o'clock."
  ],
  [
    "Lara hat heute ihren ersten Deutschkurs.",
    "Сьогодні в Лари перше заняття з німецької.",
    "Lara has her first German class today."
  ],
  [
    "Vor dem Kurs geht sie in ein kleines Café.",
    "Перед заняттям вона заходить до маленького кафе.",
    "Before class, she goes to a small café."
  ],
  [
    "Sie möchte ein Brötchen und einen Tee kaufen.",
    "Вона хоче купити булочку й чай.",
    "She wants to buy a bread roll and tea."
  ],
  [
    "Die Verkäuferin begrüßt Lara mit einem Lächeln.",
    "Продавчиня зустрічає Лару усмішкою.",
    "The shop assistant greets Lara with a smile."
  ],
  [
    "Lara sagt: „Ein Brötchen mit Butter, bitte.“",
    "Лара каже: «Булочку з маслом, будь ласка».",
    "Lara says, “A bread roll with butter, please.”"
  ],
  [
    "Sie bezahlt mit Karte und setzt sich ans Fenster.",
    "Вона платить карткою та сідає біля вікна.",
    "She pays by card and sits down by the window."
  ],
  [
    "Der Tee ist heiß und das Brötchen ist frisch.",
    "Чай гарячий, а булочка свіжа.",
    "The tea is hot and the bread roll is fresh."
  ],
  [
    "Nach fünf Minuten schaut Lara auf die Uhr.",
    "Через п'ять хвилин Лара дивиться на годинник.",
    "Five minutes later, Lara looks at the clock."
  ],
  [
    "Der Deutschkurs beginnt in zehn Minuten.",
    "Курс німецької починається за десять хвилин.",
    "The German class starts in ten minutes."
  ],
  [
    "Lara steht auf, aber ihr Schlüssel ist weg.",
    "Лара встає, але її ключ зник.",
    "Lara stands up, but her key is gone."
  ],
  [
    "Sie sucht in ihrer Tasche und unter dem Tisch.",
    "Вона шукає в сумці та під столом.",
    "She searches in her bag and under the table."
  ],
  [
    "Dort findet sie den Schlüssel nicht.",
    "Там вона не знаходить ключа.",
    "She cannot find the key there."
  ],
  [
    "Lara fragt: „Haben Sie einen Schlüssel gefunden?“",
    "Лара запитує: «Ви знайшли якийсь ключ?»",
    "Lara asks, “Have you found a key?”"
  ],
  [
    "Die Verkäuferin sagt: „Leider nein.“",
    "Продавчиня каже: «На жаль, ні».",
    "The shop assistant says, “Unfortunately, no.”"
  ],
  [
    "Ein Mann am Nebentisch hebt die Hand.",
    "Чоловік за сусіднім столиком підіймає руку.",
    "A man at the next table raises his hand."
  ],
  [
    "Er zeigt einen Schlüssel mit einem blauen Band.",
    "Він показує ключ із синьою стрічкою.",
    "He shows a key with a blue ribbon."
  ],
  [
    "Lara lacht: „Ja, das ist mein Schlüssel!“",
    "Лара сміється: «Так, це мій ключ!»",
    "Lara laughs, “Yes, that's my key!”"
  ],
  [
    "Sie bedankt sich und läuft schnell zum Kurs.",
    "Вона дякує й швидко біжить на заняття.",
    "She thanks him and hurries to class."
  ],
  [
    "Lara kommt pünktlich an und ist sehr froh.",
    "Лара приходить вчасно й дуже радіє.",
    "Lara arrives on time and is very happy."
  ]
],
 paragraphEnds:[5,10,15,20],
 glossary:parseGloss(String.raw`
Schlüssel|ключ|key
ersten|перший (відмінювана форма)|first (inflected)
Café|кафе|café
Lächeln|усмішка|smile
Butter|масло|butter
heiß|гарячий|hot
frisch|свіжий|fresh
steht|стоїть; встає|stands; stands up
weg|зник; немає|gone; missing
findet|знаходить|finds
Leider|на жаль|unfortunately
Nebentisch|сусідній столик|next table
hebt|підіймає|raises
Hand|рука|hand
blauen|синій (відмінювана форма)|blue (inflected)
Band|стрічка|ribbon
froh|радісний; задоволений|glad; happy
Deutschkurs|курс німецької|German course
Kurs|курс; заняття|course; class
Tee|чай|tea
kaufen|купувати|buy
bezahlt|платить; оплачує|pays
Karte|банківська картка|payment card
Minuten|хвилини|minutes
pünktlich|вчасно|on time
`),
 questions:[
 Q("Що Лара замовляє в кафе?","What does Lara order at the café?",[["Суп і воду","Soup and water"],["Булочку з маслом і чай","A bread roll with butter and tea"],["Салат і каву","Salad and coffee"]],1),
 Q("Де чоловік сидить?","Where is the man sitting?",[["За сусіднім столиком","At the next table"],["У класі","In the classroom"],["На зупинці","At the bus stop"]],0),
 Q("Що він знайшов?","What does he find?",[["Синій телефон","A blue phone"],["Гаманець","A wallet"],["Ключ із синьою стрічкою","A key with a blue ribbon"]],2)
 ]
},
{
 id:"hallway-note",level:"A1",emoji:"📦",
 title:{"de":"Eine Nachricht im Treppenhaus","uk":"Записка в під’їзді","en":"A Note in the Stairwell"},
 subtitle:["Сусіди, посилка й маленька несподіванка","Neighbours, a parcel and a little surprise"],
 sentences:[
  [
    "Samir wohnt seit einem Monat in einem neuen Haus.",
    "Самір уже місяць живе в новому будинку.",
    "Samir has lived in a new building for a month."
  ],
  [
    "Er kennt noch nicht alle Nachbarn.",
    "Він ще не знає всіх сусідів.",
    "He does not know all his neighbours yet."
  ],
  [
    "Eines Morgens liegt ein Paket vor seiner Tür.",
    "Одного ранку перед його дверима лежить посилка.",
    "One morning, a parcel is lying outside his door."
  ],
  [
    "Auf dem Paket steht der Name Frau Roth.",
    "На посилці написано ім'я пані Рот.",
    "The parcel has the name Frau Roth on it."
  ],
  [
    "Frau Roth wohnt im dritten Stock.",
    "Пані Рот живе на третьому поверсі.",
    "Frau Roth lives on the third floor."
  ],
  [
    "Samir möchte ihr das Paket bringen.",
    "Самір хоче віднести їй посилку.",
    "Samir wants to take the parcel to her."
  ],
  [
    "Vor ihrer Wohnung hängt eine kleine Nachricht.",
    "Перед її квартирою висить маленька записка.",
    "There is a small note outside her apartment."
  ],
  [
    "Dort steht: „Bitte nicht klingeln, das Baby schläft.“",
    "Там написано: «Будь ласка, не дзвоніть, дитина спить».",
    "It says, “Please don't ring the bell, the baby is sleeping.”"
  ],
  [
    "Samir überlegt kurz und geht wieder nach unten.",
    "Самір трохи думає та знову спускається вниз.",
    "Samir thinks for a moment and goes downstairs again."
  ],
  [
    "Er legt das Paket sicher in seine Wohnung.",
    "Він ставить посилку в безпечне місце у своїй квартирі.",
    "He puts the parcel safely inside his apartment."
  ],
  [
    "Dann schreibt er einen Zettel für Frau Roth.",
    "Потім він пише пані Рот записку.",
    "Then he writes Frau Roth a note."
  ],
  [
    "„Ihr Paket ist bei Samir im zweiten Stock.“",
    "«Ваша посилка у Саміра на другому поверсі».",
    "“Your parcel is with Samir on the second floor.”"
  ],
  [
    "Er legt den Zettel vor ihre Wohnungstür.",
    "Він залишає записку перед її дверима.",
    "He leaves the note outside her apartment door."
  ],
  [
    "Am Nachmittag klopft jemand an Samirs Tür.",
    "Удень хтось стукає у двері Саміра.",
    "In the afternoon, someone knocks on Samir's door."
  ],
  [
    "Frau Roth steht dort mit ihrem kleinen Kind.",
    "Там стоїть пані Рот із маленькою дитиною.",
    "Frau Roth is standing there with her little child."
  ],
  [
    "Sie sagt: „Vielen Dank, das ist wirklich nett!“",
    "Вона каже: «Дуже дякую, це справді мило!»",
    "She says, “Thank you so much, that is really kind!”"
  ],
  [
    "Samir gibt ihr das Paket und lächelt.",
    "Самір віддає їй посилку й усміхається.",
    "Samir gives her the parcel and smiles."
  ],
  [
    "Frau Roth lädt ihn am Samstag zum Kaffee ein.",
    "Пані Рот запрошує його в суботу на каву.",
    "Frau Roth invites him for coffee on Saturday."
  ],
  [
    "Samir freut sich über seine erste neue Bekanntschaft.",
    "Самір радіє своєму першому новому знайомству.",
    "Samir is happy to have made his first new acquaintance."
  ],
  [
    "Jetzt fühlt sich das Haus schon mehr wie Zuhause an.",
    "Тепер цей будинок уже більше схожий на дім.",
    "Now the building already feels more like home."
  ]
],
 paragraphEnds:[5,10,15,20],
 glossary:parseGloss(String.raw`
Samir|Самір (ім’я)|Samir (name)
Roth|Рот (прізвище)|Roth (surname)
steht|стоїть; написано|stands; says on a note
Stock|поверх|floor
Zettel|записка; папірець|note
kennt|знає; знайомий із|knows
Nachbarn|сусіди; сусіда|neighbours; neighbour
Eines|одного (разу)|one (day)
Morgens|ранку|in the morning
Name|ім’я; ім'я на посилці|name
bringen|приносити; відносити|bring; take
hängt|висить|hangs
klingeln|дзвонити у двері|ring the bell
Baby|немовля; маленька дитина|baby
schläft|спить|is sleeping
überlegt|обмірковує|thinks it over
unten|унизу|downstairs
sicher|безпечно; надійно|safely; securely
zweiten|другий (відмінювана форма)|second (inflected)
Wohnungstür|двері квартири|apartment door
Nachmittag|післяобідній час|afternoon
klopft|стукає|knocks
jemand|хтось|someone
Samirs|Саміра (присвійна форма)|Samir's
ihrem|її (давальний відмінок)|her (dative)
Kind|дитина|child
nett|милий; добрий|kind; nice
Bekanntschaft|знайомство|acquaintance
fühlt|відчуває|feels
mehr|більше|more
Zuhause|дім; рідна оселя|home
Paket|посилка|parcel
Wohnung|квартира|apartment
Vielen|дуже багато; щиро (в подяці)|many; very (in thanks)
Dank|подяка|thanks
Samstag|субота|Saturday
`),
 questions:[
 Q("Чому Самір не дзвонить у двері?","Why doesn't Samir ring the doorbell?",[["У нього немає ключа","He doesn't have a key"],["Спить дитина","A baby is sleeping"],["Двері зламані","The door is broken"]],1),
 Q("Де можна забрати посилку?","Where can the parcel be collected?",[["На вокзалі","At the station"],["У кафе","At a café"],["У Саміра на другому поверсі","From Samir on the second floor"]],2),
 Q("Куди пані Рот запрошує Саміра?","What does Frau Roth invite Samir to?",[["На каву в суботу","Coffee on Saturday"],["У лікарню","The hospital"],["На роботу","Work"]],0)
 ]
},
{
 id:"first-workday",level:"A1",emoji:"📚",
 title:{"de":"Der erste Tag im Buchladen","uk":"Перший день у книгарні","en":"The First Day at the Bookshop"},
 subtitle:["Перша робота, незручна ситуація й маленька перемога","A first job, a mix-up and a small victory"],
 sentences:[
  [
    "Mina beginnt heute ihre neue Arbeit in einem Buchladen.",
    "Сьогодні Міна починає нову роботу в книгарні.",
    "Mina starts her new job at a bookshop today."
  ],
  [
    "Sie ist aufgeregt und kommt zwanzig Minuten zu früh.",
    "Вона хвилюється й приходить на двадцять хвилин раніше.",
    "She is nervous and arrives twenty minutes early."
  ],
  [
    "Ihre Kollegin Jana zeigt ihr die Kasse und die Regale.",
    "Колега Яна показує їй касу та полиці.",
    "Her colleague Jana shows her the till and the shelves."
  ],
  [
    "„Frag mich einfach, wenn du etwas nicht weißt“, sagt Jana.",
    "«Просто запитай мене, якщо чогось не знаєш», — каже Яна.",
    "“Just ask me if you don't know something,” says Jana."
  ],
  [
    "Zuerst sortiert Mina Bücher nach ihren Titeln.",
    "Спершу Міна сортує книжки за назвами.",
    "First Mina sorts books by their titles."
  ],
  [
    "Dann kommt eine Kundin mit einem kleinen Kind.",
    "Потім приходить покупчиня з маленькою дитиною.",
    "Then a customer comes in with a small child."
  ],
  [
    "Die Kundin sucht ein Geschenk für ihren Sohn.",
    "Покупчиня шукає подарунок для сина.",
    "The customer is looking for a gift for her son."
  ],
  [
    "Mina fragt freundlich: „Wie alt ist Ihr Sohn?“",
    "Міна привітно запитує: «Скільки років Вашому синові?»",
    "Mina asks kindly, “How old is your son?”"
  ],
  [
    "„Er ist sechs und liebt Tiere“, antwortet die Frau.",
    "«Йому шість, і він любить тварин», — відповідає жінка.",
    "“He's six and loves animals,” the woman replies."
  ],
  [
    "Mina findet ein buntes Buch über Hunde und Katzen.",
    "Міна знаходить барвисту книжку про собак і котів.",
    "Mina finds a colourful book about dogs and cats."
  ],
  [
    "Die Kundin möchte das Buch sofort kaufen.",
    "Покупчиня хоче одразу купити книжку.",
    "The customer wants to buy the book straight away."
  ],
  [
    "An der Kasse kann Mina den Preis nicht finden.",
    "На касі Міна не може знайти ціну.",
    "At the till, Mina cannot find the price."
  ],
  [
    "Sie wird rot und sagt: „Einen Moment, bitte.“",
    "Вона червоніє й каже: «Хвилинку, будь ласка».",
    "She blushes and says, “One moment, please.”"
  ],
  [
    "Jana kommt und hilft ihr mit dem Computer.",
    "Яна підходить і допомагає їй із комп'ютером.",
    "Jana comes over and helps her with the computer."
  ],
  [
    "Zusammen finden sie den richtigen Preis.",
    "Разом вони знаходять правильну ціну.",
    "Together they find the correct price."
  ],
  [
    "Die Kundin bezahlt und bedankt sich bei Mina.",
    "Покупчиня платить і дякує Міні.",
    "The customer pays and thanks Mina."
  ],
  [
    "„Du hast gut gefragt und bist ruhig geblieben“, sagt Jana.",
    "«Ти добре запитала і зберегла спокій», — каже Яна.",
    "“You asked the right question and stayed calm,” says Jana."
  ],
  [
    "In der Pause trinken die beiden einen Tee.",
    "На перерві вони удвох п'ють чай.",
    "During their break, the two of them drink tea."
  ],
  [
    "Mina schreibt drei neue Wörter in ihr Notizbuch.",
    "Міна записує три нові слова в блокнот.",
    "Mina writes three new words in her notebook."
  ],
  [
    "Nach der Arbeit möchte sie morgen wiederkommen.",
    "Після роботи вона вже хоче повернутися завтра.",
    "After work, she is looking forward to coming back tomorrow."
  ]
],
 paragraphEnds:[5,10,15,20],
 glossary:parseGloss(String.raw`
Mina|Міна (ім'я)|Mina (name)
Jana|Яна (ім'я)|Jana (name)
Arbeit|робота|work
Kasse|каса|till; checkout
Sohn|син|son
Preis|ціна|price
Buchladen|книгарня|bookshop
aufgeregt|схвильований|nervous; excited
zwanzig|двадцять|twenty
Kollegin|колега (жінка)|female colleague
Regale|полиці|shelves
Frag|запитай (наказова форма)|ask (imperative)
mich|мене|me
einfach|просто|simply; just
wenn|якщо|if
weißt|знаєш|you know
sortiert|сортує|sorts
Bücher|книжки|books
Titeln|назви (давальний множини)|titles (dative plural)
Kind|дитина|child
alt|старий; років|old; years old
liebt|любить|loves
Tiere|тварини|animals
findet|знаходить|finds
buntes|барвисте|colourful (inflected)
Hunde|собаки|dogs
Katzen|коти|cats
Moment|мить; хвилинка|moment
hilft|допомагає|helps
Computer|комп'ютер|computer
richtigen|правильний (відмінювана форма)|correct (inflected)
hast|маєш; ти зробив(ла)|you have
gut|добре|well
gefragt|запитав(ла)|asked
bist|ти є; ти (допоміжне дієслово)|you are; auxiliary verb
ruhig|спокійний|calm
geblieben|залишився; зберіг|remained; stayed
Pause|перерва|break
trinken|п’ють; пити|drink
Notizbuch|блокнот|notebook
wiederkommen|повернутися|come back
Minuten|хвилини|minutes
kaufen|купувати|buy
bezahlt|оплачує|pays
Tee|чай|tea
Wörter|слова|words
`),
 questions:[
 Q("Який подарунок шукає покупчиня?","What gift is the customer looking for?",[["Книжку для шестирічного сина","A book for her six-year-old son"],["Зошит для себе","A notebook for herself"],["Квиток на поїзд","A train ticket"]],0),
 Q("Що не виходить у Міни на касі?","What can't Mina do at the till?",[["Знайти сумку","Find her bag"],["Знайти ціну","Find the price"],["Знайти колегу","Find her colleague"]],1),
 Q("Що Міна записує на перерві?","What does Mina write down during her break?",[["Номер автобуса","A bus number"],["Рецепт супу","A soup recipe"],["Три нові слова","Three new words"]],2)
 ]
},
{
 id:"offline-evening",level:"A1",emoji:"🎲",
 title:{"de":"Ein Abend ohne Internet","uk":"Вечір без інтернету","en":"An Evening Without Internet"},
 subtitle:["Коли Wi-Fi зникає, а з’являються нові друзі","When Wi-Fi disappears and new friends appear"],
 sentences:[
  [
    "Jonas möchte am Freitagabend einen Film sehen.",
    "Йонас хоче подивитися фільм у п'ятницю ввечері.",
    "Jonas wants to watch a film on Friday evening."
  ],
  [
    "Er macht Popcorn und setzt sich aufs Sofa.",
    "Він готує попкорн і сідає на диван.",
    "He makes popcorn and sits on the sofa."
  ],
  [
    "Doch plötzlich funktioniert das Internet nicht mehr.",
    "Але раптом інтернет перестає працювати.",
    "But suddenly the internet stops working."
  ],
  [
    "Er startet den Router neu, aber nichts passiert.",
    "Він перезапускає роутер, але нічого не стається.",
    "He restarts the router, but nothing happens."
  ],
  [
    "Seine Mitbewohnerin Emma kommt aus der Küche.",
    "Його сусідка по квартирі Емма виходить із кухні.",
    "His flatmate Emma comes out of the kitchen."
  ],
  [
    "„Mein Handy hat auch kein WLAN“, sagt sie.",
    "«У моєму телефоні теж немає Wi-Fi», — каже вона.",
    "“My phone has no Wi-Fi either,” she says."
  ],
  [
    "Jonas zeigt auf das Popcorn und lacht.",
    "Йонас показує на попкорн і сміється.",
    "Jonas points at the popcorn and laughs."
  ],
  [
    "„Wir haben einen Filmabend ohne Film“, sagt er.",
    "«У нас кіновечір без фільму», — каже він.",
    "“We're having a movie night without a movie,” he says."
  ],
  [
    "Emma findet im Schrank ein altes Brettspiel.",
    "Емма знаходить у шафі стару настільну гру.",
    "Emma finds an old board game in the cupboard."
  ],
  [
    "Auf der Schachtel steht: „Wer bin ich?“",
    "На коробці написано: «Хто я?»",
    "The box says, “Who am I?”"
  ],
  [
    "Die beiden verstehen die Regeln nicht sofort.",
    "Вони не одразу розуміють правила.",
    "The two of them don't understand the rules right away."
  ],
  [
    "Emma ruft ihren Nachbarn Ben an.",
    "Емма телефонує їхньому сусідові Бену.",
    "Emma calls their neighbour Ben."
  ],
  [
    "Ben bringt einen Freund und noch ein Spiel mit.",
    "Бен приходить із другом і приносить ще одну гру.",
    "Ben brings a friend and another game."
  ],
  [
    "Jetzt sitzen vier Leute am Küchentisch.",
    "Тепер четверо людей сидять за кухонним столом.",
    "Now four people are sitting at the kitchen table."
  ],
  [
    "Jeder bekommt eine Karte mit einem Tier.",
    "Кожен отримує картку з твариною.",
    "Everyone gets a card with an animal on it."
  ],
  [
    "Jonas fragt: „Kann mein Tier fliegen?“",
    "Йонас питає: «Моя тварина вміє літати?»",
    "Jonas asks, “Can my animal fly?”"
  ],
  [
    "Alle lachen, denn auf seiner Karte steht „Pinguin“.",
    "Усі сміються, адже на його картці написано «пінгвін».",
    "Everyone laughs, because his card says “penguin”."
  ],
  [
    "Um elf Uhr funktioniert das Internet wieder.",
    "Об одинадцятій інтернет знову працює.",
    "At eleven o'clock the internet starts working again."
  ],
  [
    "Aber niemand möchte jetzt einen Film sehen.",
    "Але тепер ніхто не хоче дивитися фільм.",
    "But now nobody wants to watch a film."
  ],
  [
    "Sie spielen weiter und verabreden sich für Samstag.",
    "Вони грають далі й домовляються зустрітися в суботу.",
    "They keep playing and arrange to meet on Saturday."
  ]
],
 paragraphEnds:[5,10,15,20],
 glossary:parseGloss(String.raw`
Film|фільм|film
sehen|дивитися; бачити|watch; see
Popcorn|попкорн|popcorn
funktioniert|працює; функціонує|works; functions
steht|написано; стоїть|says; stands
Tier|тварина|animal
Freitagabend|вечір п'ятниці|Friday evening
aufs|на (auf das)|onto the; on the
plötzlich|раптом|suddenly
mehr|більше; вже не (nicht mehr)|more; no longer
startet|запускає|starts
Router|роутер|router
passiert|стається|happens
Mitbewohnerin|сусідка по квартирі|female flatmate
WLAN|вайфай; бездротова мережа|Wi-Fi
Filmabend|кіновечір|movie night
ohne|без|without
findet|знаходить|finds
Schrank|шафа|cupboard
altes|стару (відмінювана форма)|old (inflected)
Brettspiel|настільна гра|board game
Schachtel|коробка|box
Wer|хто|who
verstehen|розуміти|understand
Regeln|правила|rules
Nachbarn|сусіда; сусіди|neighbour; neighbours
bringt|приносить|brings
Spiel|гра|game
sitzen|сидять|sit
vier|чотири|four
Leute|люди|people
fliegen|літати|fly
denn|бо; адже|because
Pinguin|пінгвін|penguin
elf|одинадцять|eleven
niemand|ніхто|nobody
weiter|далі|on; further
verabreden|домовляються про зустріч|arrange to meet
Jonas|Йонас (ім’я)|Jonas (name)
Küche|кухня|kitchen
ruft|телефонує; кличе|calls
Karte|картка для гри|game card
Samstag|субота|Saturday
`),
 questions:[
 Q("Чому Йонас не дивиться фільм?","Why doesn't Jonas watch the film?",[["Він заснув","He fell asleep"],["Інтернет не працює","The internet isn't working"],["Його телефон загубився","He lost his phone"]],1),
 Q("Яку гру знаходить Емма?","What game does Emma find?",[["Настільну гру «Хто я?»","A board game called “Who Am I?”"],["Комп’ютерну гру","A computer game"],["Гру в шахи","A chess game"]],0),
 Q("Чому друзі сміються з Йонаса?","Why do the friends laugh at Jonas?",[["Він загубив ключ","He lost his key"],["Він переплутав час","He got the time wrong"],["На його картці пінгвін","His card shows a penguin"]],2)
 ]
}
];
