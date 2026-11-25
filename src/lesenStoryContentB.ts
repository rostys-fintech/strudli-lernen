import type {ReadingStory,ReadingQuestion} from "./lesenStories";
import {parseGloss} from "./lesenGlossary";
const Q=(uk:string,en:string,choices:[string,string][],correct:0|1|2):ReadingQuestion=>({
 prompt:[uk,en],choices:choices as unknown as ReadingQuestion["choices"],correct
});
export const LESSON_STORIES_B:readonly ReadingStory[]=[
{
 id:"apartment",level:"A1",emoji:"🏠",
 title:{de:"Eine neue Wohnung",uk:"Нова квартира",en:"A New Apartment"},
 subtitle:["Огляд квартири, оренда й договір","Viewing a flat, rent and a contract"],
 sentences:[
  ["Jonas ist vor zwei Wochen nach Deutschland gezogen.","Йонас переїхав до Німеччини два тижні тому.","Jonas moved to Germany two weeks ago."],
  ["Zurzeit wohnt er bei einem Freund auf dem Sofa.","Зараз він живе в друга на дивані.","At the moment, he is sleeping on a friend's sofa."],
  ["Er möchte endlich eine eigene kleine Wohnung finden.","Він хоче нарешті знайти власну маленьку квартиру.","He wants to finally find a small place of his own."],
  ["Jeden Abend sucht er im Internet nach Angeboten.","Щовечора він шукає оголошення в інтернеті.","Every evening, he looks for listings online."],
  ["Am Dienstag bekommt er eine Nachricht von einer Vermieterin.","У вівторок він отримує повідомлення від орендодавиці.","On Tuesday, he gets a message from a landlady."],
  ["Sie lädt ihn zu einem Besichtigungstermin ein.","Вона запрошує його на огляд квартири.","She invites him to view the apartment."],
  ["Jonas kommt früh und wartet vor dem Haus.","Йонас приходить рано й чекає перед будинком.","Jonas arrives early and waits outside the building."],
  ["Die Vermieterin öffnet die Tür und zeigt ihm die Wohnung.","Орендодавиця відчиняє двері й показує йому квартиру.","The landlady opens the door and shows him the apartment."],
  ["Es gibt zwei Zimmer, eine helle Küche und einen Balkon.","Там є дві кімнати, світла кухня та балкон.","There are two rooms, a bright kitchen and a balcony."],
  ["Auf dem Balkon wachsen sogar drei kleine Blumen.","На балконі ростуть навіть три маленькі квітки.","There are even three small flowers growing on the balcony."],
  ["Die Wohnung gefällt Jonas sofort, aber er hat viele Fragen.","Квартира одразу подобається Йонасу, але в нього багато запитань.","Jonas likes the apartment immediately, but he has many questions."],
  ["Er fragt nach der Warmmiete, der Kaution und dem Internet.","Він запитує про повну орендну плату, заставу та інтернет.","He asks about the total rent, the deposit and the internet."],
  ["Die Warmmiete beträgt achthundert Euro im Monat.","Повна орендна плата становить вісімсот євро на місяць.","The total monthly rent is eight hundred euros."],
  ["Die Kaution kostet zwei Monatsmieten.","Застава дорівнює двом місячним орендним платам.","The deposit is equal to two months' rent."],
  ["Jonas rechnet kurz und merkt, dass das viel Geld ist.","Йонас швидко рахує й розуміє, що це багато грошей.","Jonas does a quick calculation and realises that it is a lot of money."],
  ["Die Vermieterin gibt ihm den Mietvertrag zum Lesen.","Орендодавиця дає йому договір оренди для ознайомлення.","The landlady gives him the rental contract to read."],
  ["Zu Hause bittet Jonas seinen Freund um Hilfe.","Удома Йонас просить друга про допомогу.","Back home, Jonas asks his friend for help."],
  ["Sie lesen den Vertrag zusammen und finden eine wichtige Frage.","Вони разом читають договір і знаходять важливе питання.","They read the contract together and spot an important question."],
  ["Am nächsten Tag fragt Jonas noch einmal nach den Heizkosten.","Наступного дня Йонас ще раз запитує про витрати на опалення.","The next day, Jonas asks again about the heating costs."],
  ["Er möchte nichts unterschreiben, bevor er alles versteht.","Він не хоче нічого підписувати, доки все не зрозуміє.","He does not want to sign anything before he understands everything."],
 ],
 paragraphEnds:[5,10,15,20],
 glossary:parseGloss(String.raw`
Jonas|Йонас (ім'я)|Jonas (name)
sucht|шукає|looks for
neue|нову|new (feminine)
Wohnung|квартира|apartment
Stadt|місто|city; town
Dienstag|вівторок|Tuesday
Termin|запис; зустріч|appointment
Vermieterin|орендодавиця|landlady
Zimmer|кімната; кімнати|room; rooms
Küche|кухня|kitchen
kleinen|невеликий (знахідний)|small (accusative)
Balkon|балкон|balcony
Warmmiete|орендна плата з додатковими витратами|rent including additional costs
Kaution|застава|deposit
erklärt|пояснює|explains
beträgt|становить (про суму)|amounts to
Fotos|фотографії|photos
liest|читає|reads
Mietvertrag|договір оренди|rental contract
unterschreibt|підписує|signs
`),
 questions:[
  Q("Скільки кімнат у квартирі?","How many rooms does the apartment have?",[["Одну","One"],["Дві","Two"],["Три","Three"]],1),
  Q("Скільки становить Warmmiete?","How much is the Warmmiete?",[["600 євро","600 euros"],["700 євро","700 euros"],["800 євро","800 euros"]],2),
  Q("Чи підписує Йонас договір сьогодні?","Does Jonas sign the contract today?",[["Ні, ще не підписує","No, not yet"],["Так, одразу","Yes, immediately"],["Так, онлайн","Yes, online"]],0)
 ]
},
{
 id:"course",level:"A1",emoji:"📚",
 title:{de:"Im Deutschkurs",uk:"На курсі німецької",en:"At German Class"},
 subtitle:["Нові слова, артиклі та коротке читання","New words, articles and short reading"],
 sentences:[
  ["Nour lernt seit drei Wochen Deutsch.","Нур вивчає німецьку вже три тижні.","Nour has been learning German for three weeks."],
  ["Sie kann schon viele Wörter lesen, aber sie spricht noch leise.","Вона вже може читати багато слів, але говорить ще тихо.","She can already read many words, but she still speaks quietly."],
  ["Heute hat sie Angst vor dem Unterricht.","Сьогодні вона боїться заняття.","Today she feels nervous about class."],
  ["Der Lehrer möchte nämlich mit allen einen Dialog üben.","Адже вчитель хоче потренувати діалог з усіма.","The teacher wants everyone to practise a dialogue."],
  ["Nour setzt sich neben eine neue Mitschülerin namens Anna.","Нур сідає поруч із новою однокурсницею на ім'я Анна.","Nour sits next to a new classmate named Anna."],
  ["Anna lächelt und sagt: „Wir üben zusammen.“","Анна усміхається й каже: «Ми потренуємося разом».","Anna smiles and says, \"We can practise together.\""],
  ["Zuerst schreibt der Lehrer drei Wörter an die Tafel.","Спочатку вчитель пише на дошці три слова.","First, the teacher writes three words on the board."],
  ["Dort stehen: der Apfel, die Milch und das Brot.","Там написано: der Apfel, die Milch і das Brot.","They are: der Apfel, die Milch and das Brot."],
  ["Nour verwechselt die Artikel, und alle müssen lachen.","Нур плутає артиклі, і всі починають сміятися.","Nour mixes up the articles, and everyone starts to laugh."],
  ["Der Lehrer sagt freundlich: „Fehler helfen uns beim Lernen.“","Учитель доброзичливо каже: «Помилки допомагають нам учитися».","The teacher says kindly, \"Mistakes help us learn.\""],
  ["Dann spielen Anna und Nour eine Szene in einer Bäckerei.","Потім Анна й Нур розігрують сценку в пекарні.","Then Anna and Nour act out a scene in a bakery."],
  ["Anna ist die Verkäuferin, und Nour ist die Kundin.","Анна — продавчиня, а Нур — покупчиня.","Anna is the shop assistant, and Nour is the customer."],
  ["Nour fragt: „Ich hätte gern zwei Brötchen, bitte.“","Нур каже: «Я хотіла б дві булочки, будь ласка».","Nour says, \"I would like two bread rolls, please.\""],
  ["Anna antwortet: „Natürlich. Sonst noch etwas?“","Анна відповідає: «Звісно. Щось іще?»","Anna replies, \"Of course. Anything else?\""],
  ["Der Dialog klappt, und Nour wird mutiger.","Діалог вдається, і Нур стає сміливішою.","The dialogue goes well, and Nour becomes more confident."],
  ["Nach dem Kurs gehen die beiden wirklich in eine Bäckerei.","Після курсу вони справді йдуть у пекарню.","After class, they actually go to a bakery."],
  ["Dieses Mal bestellt Nour allein einen Kaffee und ein Brötchen.","Цього разу Нур сама замовляє каву та булочку.","This time, Nour orders a coffee and a bread roll by herself."],
  ["Die Verkäuferin versteht sie sofort und lächelt.","Продавчиня одразу її розуміє й усміхається.","The shop assistant understands her immediately and smiles."],
  ["Auf dem Heimweg erzählt Nour ihrer Familie von diesem Erfolg.","Дорогою додому Нур розповідає сім'ї про цей успіх.","On her way home, Nour tells her family about her success."],
  ["Sie weiß jetzt: Jeder kleine Schritt ist wichtig.","Тепер вона знає: кожен маленький крок важливий.","Now she knows that every small step matters."],
 ],
 paragraphEnds:[5,10,15,20],
 glossary:parseGloss(String.raw`
Nour|Нур (ім'я)|Nour (name)
besucht|відвідує|attends
Wochen|тижні|weeks
Deutschkurs|курс німецької мови|German course
Unterricht|заняття; урок|class; lesson
lernt|вивчає|learns
neue|нові|new
Wörter|слова|words
übt|тренує|practises
Artikel|артиклі|articles
Lehrer|учитель|teacher
schreibt|пише|writes
Tafel|дошка|board
Apfel|яблуко|apple
Milch|молоко|milk
Brot|хліб|bread
Fehler|помилка|mistake
versucht|намагається; пробує|tries
Ende|кінець|end
beantwortet|відповідає|answers
Fragen|запитання|questions
richtig|правильно|correctly
Kurs|курс|course
liest|читає|reads
kurze|коротку|short (feminine)
Geschichte|історія; оповідання|story
Deutsch|німецька мова|German language
`),
 questions:[
  Q("Що тренує Нур на курсі?","What does Nour practise?",[["Артиклі","Articles"],["Математику","Mathematics"],["Малювання","Drawing"]],0),
  Q("Що вона робить після помилки?","What does she do after making a mistake?",[["Йде додому","Goes home"],["Пробує ще раз","Tries again"],["Перестає відповідати","Stops answering"]],1),
  Q("Що Нур самостійно замовляє в пекарні?","What does Nour order by herself at the bakery?",[["Торт","A cake"],["Молоко","Milk"],["Каву та булочку","A coffee and a bread roll"]],2),
 ]
},
{
 id:"parcel",level:"A1",emoji:"📦",
 title:{de:"Ein Paket für Oma",uk:"Посилка для бабусі",en:"A Parcel for Grandma"},
 subtitle:["Пошта, адреса, відправлення та квитанція","Post office, address, shipping and receipt"],
 sentences:[
  ["Emil möchte seiner Oma eine Überraschung machen.","Еміль хоче зробити бабусі сюрприз.","Emil wants to surprise his grandma."],
  ["Sie wohnt in einer anderen Stadt und hat bald Geburtstag.","Вона живе в іншому місті, і скоро в неї день народження.","She lives in another city, and her birthday is coming soon."],
  ["Emil hat lange über ein Geschenk nachgedacht.","Еміль довго думав над подарунком.","Emil has spent a long time thinking about a present."],
  ["Jetzt legt er ein kleines Buch, Schokolade und eine Karte in einen Karton.","Тепер він кладе маленьку книжку, шоколад і листівку в коробку.","Now he puts a small book, chocolate and a greeting card into a box."],
  ["Auf die Karte schreibt er: „Alles Gute, liebe Oma!“","На листівці він пише: «Усього найкращого, люба бабусю!»","On the card he writes, \"All the best, dear Grandma!\""],
  ["Am Freitag geht er mit dem Paket zur Post.","У п'ятницю він іде з посилкою на пошту.","On Friday, he takes the parcel to the post office."],
  ["Draußen regnet es, und auf der Straße stehen viele Menschen.","Надворі дощить, а на вулиці багато людей.","It is raining outside, and the street is crowded."],
  ["In der Post gibt es eine lange Schlange.","На пошті велика черга.","There is a long queue at the post office."],
  ["Emil wartet geduldig und übt im Kopf, was er sagen möchte.","Еміль терпляче чекає й подумки тренує, що хоче сказати.","Emil waits patiently and practises in his head what he wants to say."],
  ["Endlich ist er an der Reihe.","Нарешті підходить його черга.","Finally, it is his turn."],
  ["Die Mitarbeiterin gibt ihm ein Formular für die Adresse.","Працівниця дає йому бланк для адреси.","The employee gives him a form for the address."],
  ["Emil schreibt den Namen, die Straße und die Postleitzahl auf.","Еміль записує ім'я, вулицю та поштовий індекс.","Emil writes down the name, street and postcode."],
  ["Doch die Mitarbeiterin sieht einen kleinen Fehler.","Але працівниця помічає маленьку помилку.","But the employee notices a small mistake."],
  ["„Hier fehlt eine Zahl“, sagt sie und zeigt auf die Postleitzahl.","«Тут бракує однієї цифри», — каже вона й показує на індекс.","\"A digit is missing here,\" she says and points to the postcode."],
  ["Zum Glück hat Emil die richtige Adresse auf seinem Handy.","На щастя, Еміль має правильну адресу в телефоні.","Luckily, Emil has the correct address on his phone."],
  ["Er verbessert das Formular und bezahlt den Versand.","Він виправляє бланк і оплачує відправлення.","He corrects the form and pays for shipping."],
  ["Die Mitarbeiterin gibt ihm eine Quittung mit einer Sendungsnummer.","Працівниця дає йому квитанцію з номером відстеження.","The employee gives him a receipt with a tracking number."],
  ["Am Montag bekommt Oma das Paket und ruft Emil sofort an.","У понеділок бабуся отримує посилку й одразу телефонує Емілю.","On Monday, Grandma receives the parcel and calls Emil straight away."],
  ["Sie lacht vor Freude und liest die Karte laut vor.","Вона сміється від радості й уголос читає листівку.","She laughs with joy and reads the card aloud."],
  ["Emil freut sich: Die Überraschung ist gelungen.","Еміль радіє: сюрприз удався.","Emil is happy: the surprise was a success."],
 ],
 paragraphEnds:[5,10,15,20],
 glossary:parseGloss(String.raw`
Freitag|п'ятниця|Friday
Emil|Еміль (ім'я)|Emil (name)
Paket|посилка|parcel
seine|свою (його)|his (feminine)
Oma|бабуся|grandma
schicken|надсилати|send
legt|кладе|puts
Buch|книжка|book
Schokolade|шоколад|chocolate
Karte|листівка|greeting card
Karton|коробка|box
Post|пошта|post office
füllt|заповнює (з aus)|fills out (with aus)
Formular|бланк|form
Adresse|адреса|address
Mitarbeiterin|працівниця|female employee
schwer|важкий|heavy
wiegt|важить|weighs
Kilo|кілограм|kilo
bezahlt|оплачує|pays
Versand|відправлення; доставка|shipping
bekommt|отримує|gets
Quittung|квитанція|receipt
Montag|понеділок|Monday
ruft|телефонує (з an)|calls (with an)
bedankt|дякує|thanks
`),
 questions:[
  Q("Що Еміль кладе в посилку?","What does Emil put in the parcel?",[["Взуття й телефон","Shoes and a phone"],["Книжку, шоколад і листівку","A book, chocolate and a greeting card"],["Каву й молоко","Coffee and milk"]],1),
  Q("Що він заповнює на пошті?","What does he fill out at the post office?",[["Бланк з адресою","A form with the address"],["Шкільний тест","A school test"],["Договір оренди","A rental contract"]],0),
  Q("Хто телефонує в понеділок?","Who calls on Monday?",[["Учитель","The teacher"],["Водій автобуса","The bus driver"],["Бабуся","Grandma"]],2)
 ]
}
];