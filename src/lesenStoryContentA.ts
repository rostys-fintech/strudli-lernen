import type {ReadingStory,ReadingQuestion} from "./lesenStories";
import {parseGloss} from "./lesenGlossary";
const Q=(uk:string,en:string,choices:[string,string][],correct:0|1|2):ReadingQuestion=>({
 prompt:[uk,en],choices:choices as unknown as ReadingQuestion["choices"],correct
});
export const LESSON_STORIES_A:readonly ReadingStory[]=[
{
 id:"morning",level:"A0",emoji:"🌤️",
 title:{de:"Ein neuer Morgen",uk:"Новий ранок",en:"A New Morning"},
 subtitle:["Початок дня, сніданок і дорога до школи","Morning, breakfast and going to school"],
 sentences:[
  ["Am Montag wacht Mia früh auf.","У понеділок Мія прокидається рано.","On Monday, Mia wakes up early."],
  ["Es ist ihr erster Tag in einer neuen Schule.","Це її перший день у новій школі.","It is her first day at a new school."],
  ["Draußen scheint die Sonne, aber Mia ist nervös.","Надворі світить сонце, але Мія нервує.","The sun is shining outside, but Mia is nervous."],
  ["In der Küche wartet schon ihr Bruder Ben.","На кухні на неї вже чекає брат Бен.","Her brother Ben is already waiting in the kitchen."],
  ["Er macht Tee und legt Brot und Käse auf den Tisch.","Він готує чай і кладе хліб та сир на стіл.","He makes tea and puts bread and cheese on the table."],
  ["Mia isst schnell und sucht ihre Tasche.","Мія швидко їсть і шукає свою сумку.","Mia eats quickly and looks for her bag."],
  ["Doch die Tasche ist nicht im Zimmer.","Але сумки в кімнаті немає.","But the bag is not in the room."],
  ["Sie schaut unter das Bett und hinter die Tür.","Вона заглядає під ліжко та за двері.","She looks under the bed and behind the door."],
  ["Ben lacht und zeigt auf den Stuhl in der Küche.","Бен сміється й показує на стілець у кухні.","Ben laughs and points to the chair in the kitchen."],
  ["Dort liegt die Tasche neben seinem Buch.","Там лежить сумка поруч із його книжкою.","The bag is there next to his book."],
  ["Jetzt läuft Mia zur Bushaltestelle.","Тепер Мія біжить до автобусної зупинки.","Now Mia runs to the bus stop."],
  ["Der Bus kommt um acht Uhr, und sie steigt ein.","Автобус прибуває о восьмій, і вона сідає.","The bus arrives at eight, and she gets on."],
  ["Im Bus sitzt ein Mädchen mit einem roten Rucksack.","В автобусі сидить дівчинка з червоним рюкзаком.","A girl with a red backpack is sitting on the bus."],
  ["Das Mädchen lächelt und sagt: „Hallo, ich bin Emma.“","Дівчинка усміхається й каже: «Привіт, я Емма».","The girl smiles and says, \"Hi, I'm Emma.\""],
  ["Mia antwortet: „Ich heiße Mia. Ich bin neu hier.“","Мія відповідає: «Мене звати Мія. Я тут новенька».","Mia replies, \"My name is Mia. I'm new here.\""],
  ["Emma geht auch zur gleichen Schule.","Емма теж ходить до тієї самої школи.","Emma goes to the same school."],
  ["Die beiden gehen zusammen zum Klassenzimmer.","Вони вдвох разом ідуть до класу.","The two of them walk to the classroom together."],
  ["Mia ist pünktlich, und die Lehrerin begrüßt sie freundlich.","Мія приходить вчасно, і вчителька привітно її вітає.","Mia is on time, and the teacher greets her warmly."],
  ["Am Ende des Tages hat Mia eine neue Freundin.","Наприкінці дня в Мії з'являється нова подруга.","By the end of the day, Mia has a new friend."],
  ["Der erste Schultag war doch gar nicht so schwer.","Перший шкільний день виявився зовсім не таким важким.","Her first day at school was not so difficult after all."],
 ],
 paragraphEnds:[5,10,15,20],
 glossary:parseGloss(String.raw`
Mia|Мія (ім'я)|Mia (name)
Sie|вона|she
wacht|прокидається|wakes up
öffnet|відчиняє|opens
Fenster|вікно|window
sieht|бачить|sees
Sonne|сонце|sun
Küche|кухня|kitchen
Tee|чай|tea
isst|їсть|eats
Brot|хліб|bread
Käse|сир|cheese
nimmt|бере|takes
Tasche|сумка|bag
Schule|школа|school
Bus|автобус|bus
pünktlich|вчасно|on time
freut|радіє|is happy
sich|себе (зворотна частка)|herself (reflexive)
Tag|день|day
`),
 questions:[
  Q("Хто допомагає Мії знайти сумку?","Who helps Mia find her bag?",[["Бен","Ben"],["Учителька","The teacher"],["Водій","The driver"]],0),
  Q("Що Мія п'є на сніданок?","What does Mia drink for breakfast?",[["Молоко","Milk"],["Чай","Tea"],["Каву","Coffee"]],1),
  Q("Куди Мія йде після сніданку?","Where does Mia go after breakfast?",[["У магазин","To the shop"],["До лікаря","To the doctor"],["До школи","To school"]],2)
 ]
},
{
 id:"bakery",level:"A0",emoji:"🥨",
 title:{de:"In der Bäckerei",uk:"У пекарні",en:"At the Bakery"},
 subtitle:["Просте замовлення й оплата карткою","A simple order and paying by card"],
 sentences:[
  ["Am Samstag hat Paul einen besonderen Plan.","У суботу в Пауля є особливий план.","On Saturday, Paul has a special plan."],
  ["Seine Schwester Lara hat heute Geburtstag.","Сьогодні день народження його сестри Лари.","It is his sister Lara's birthday today."],
  ["Paul möchte zum Frühstück frische Brötchen kaufen.","Пауль хоче купити на сніданок свіжі булочки.","Paul wants to buy fresh bread rolls for breakfast."],
  ["Er nimmt seine Tasche und geht zur kleinen Bäckerei.","Він бере сумку й іде до маленької пекарні.","He takes his bag and goes to the small bakery."],
  ["Vor der Tür riecht es schon nach frischem Brot.","Перед дверима вже пахне свіжим хлібом.","The smell of fresh bread reaches him outside the door."],
  ["In der Bäckerei stehen drei andere Kunden.","У пекарні стоять троє інших покупців.","There are three other customers in the bakery."],
  ["Paul wartet und sieht einen schönen Schokoladenkuchen.","Пауль чекає й помічає гарний шоколадний торт.","Paul waits and notices a beautiful chocolate cake."],
  ["„Der Kuchen ist perfekt für Lara“, denkt er.","«Цей торт ідеально підійде Ларі», — думає він.","\"That cake is perfect for Lara,\" he thinks."],
  ["Die Verkäuferin fragt: „Was möchten Sie bitte?“","Продавчиня запитує: «Що бажаєте, будь ласка?»","The shop assistant asks, \"What would you like, please?\""],
  ["Paul bestellt zwei Brötchen, ein Brot und den Kuchen.","Пауль замовляє дві булочки, хліб і торт.","Paul orders two bread rolls, a loaf of bread and the cake."],
  ["Dann sucht er sein Geld, aber sein Geldbeutel ist leer.","Потім він шукає гроші, але гаманець порожній.","Then he looks for his money, but his wallet is empty."],
  ["Paul wird rot und sagt: „Oh nein, wie peinlich!“","Пауль червоніє й каже: «О ні, як незручно!»","Paul blushes and says, \"Oh no, how embarrassing!\""],
  ["Die Verkäuferin lächelt und zeigt auf das Kartenlesegerät.","Продавчиня усміхається й показує на термінал для карток.","The shop assistant smiles and points to the card reader."],
  ["„Sie können auch mit Karte bezahlen“, sagt sie.","«Ви також можете заплатити карткою», — каже вона.","\"You can also pay by card,\" she says."],
  ["Zum Glück hat Paul seine Bankkarte dabei.","На щастя, Пауль узяв із собою банківську картку.","Luckily, Paul has his bank card with him."],
  ["Er bezahlt und trägt die Einkäufe vorsichtig nach Hause.","Він платить і обережно несе покупки додому.","He pays and carefully carries his shopping home."],
  ["Lara sitzt noch am Küchentisch und liest ein Buch.","Лара ще сидить за кухонним столом і читає книжку.","Lara is still sitting at the kitchen table reading a book."],
  ["Paul stellt den Kuchen auf den Tisch und singt ein Geburtstagslied.","Пауль ставить торт на стіл і співає пісню до дня народження.","Paul puts the cake on the table and sings a birthday song."],
  ["Lara lacht und umarmt ihren Bruder.","Лара сміється й обіймає брата.","Lara laughs and hugs her brother."],
  ["Jetzt beginnt das schönste Frühstück der Woche.","Тепер починається найкращий сніданок тижня.","Now the best breakfast of the week begins."],
 ],
 paragraphEnds:[5,10,15,20],
 glossary:parseGloss(String.raw`
Paul|Пауль (ім'я)|Paul (name)
Samstag|субота|Saturday
Bäckerei|пекарня|bakery
Brötchen|булочки|bread rolls
kaufen|купувати|buy
Verkäuferin|продавчиня|female shop assistant
bestellt|замовляє|orders
Kaffee|кава|coffee
kostet|коштує|costs
bezahlt|платить|pays
Karte|платіжна картка|payment card
Vielen|дуже (у фразі «дуже дякую»)|very (as in 'many thanks')
Dank|подяка|thanks
Zu|до; у (у фразі Zu Hause)|at; to
Hause|удома (у фразі zu Hause)|home (as in 'at home')
frühstückt|снідає|has breakfast
Schwester|сестра|sister
seiner|його (у давальному відмінку)|his (dative)
`),
 questions:[
  Q("Що Пауль купує спочатку?","What does Paul want to buy first?",[["Два квитки","Two tickets"],["Дві булочки та хліб","Two bread rolls and bread"],["Нову книгу","A new book"]],1),
  Q("Як Пауль платить?","How does Paul pay?",[["Карткою","By card"],["Лише готівкою","Cash only"],["Банківським переказом","By bank transfer"]],0),
  Q("З ким він снідає вдома?","Who does he have breakfast with at home?",[["З другом","With a friend"],["З мамою","With his mother"],["Із сестрою","With his sister"]],2)
 ]
},
{
 id:"bus",level:"A1",emoji:"🚌",
 title:{de:"Der Bus zum Krankenhaus",uk:"Автобус до лікарні",en:"The Bus to the Hospital"},
 subtitle:["Зупинки, запізнення та прохання про допомогу","Stops, delays and asking for directions"],
 sentences:[
  ["Leila wohnt erst seit einem Monat in Deutschland.","Лейла живе в Німеччині лише місяць.","Leila has been living in Germany for only a month."],
  ["Heute hat sie einen wichtigen Termin beim Arzt.","Сьогодні в неї важливий запис до лікаря.","Today she has an important doctor's appointment."],
  ["Am Morgen regnet es stark, und Leila nimmt ihren Regenschirm.","Уранці сильно дощить, і Лейла бере парасолю.","It is raining heavily in the morning, so Leila takes her umbrella."],
  ["Sie geht zur Haltestelle und schaut auf den Fahrplan.","Вона йде на зупинку й дивиться на розклад.","She goes to the bus stop and looks at the timetable."],
  ["Der Bus soll um neun Uhr kommen.","Автобус має прибути о дев'ятій.","The bus is supposed to arrive at nine."],
  ["Aber um neun Uhr ist noch kein Bus da.","Але о дев'ятій автобуса досі немає.","But at nine o'clock, there is still no bus."],
  ["Leila wird nervös und schaut immer wieder auf die Uhr.","Лейла нервує й знову й знову дивиться на годинник.","Leila gets nervous and keeps looking at her watch."],
  ["Neben ihr wartet eine ältere Frau mit einer Einkaufstasche.","Поруч із нею чекає літня жінка з господарською сумкою.","An older woman with a shopping bag is waiting next to her."],
  ["Leila fragt vorsichtig: „Fährt dieser Bus zum Krankenhaus?“","Лейла обережно запитує: «Цей автобус їде до лікарні?»","Leila asks carefully, \"Does this bus go to the hospital?\""],
  ["Die Frau antwortet: „Ja, aber steigen Sie an der dritten Haltestelle aus.“","Жінка відповідає: «Так, але вийдіть на третій зупинці».","The woman replies, \"Yes, but get off at the third stop.\""],
  ["Endlich kommt der Bus zehn Minuten zu spät.","Нарешті автобус прибуває із запізненням на десять хвилин.","At last the bus arrives ten minutes late."],
  ["Leila steigt ein und setzt sich ans Fenster.","Лейла сідає в автобус і влаштовується біля вікна.","Leila gets on and sits by the window."],
  ["Im Bus hört sie eine Ansage, aber sie versteht nicht jedes Wort.","В автобусі вона чує оголошення, але розуміє не кожне слово.","On the bus she hears an announcement, but she does not understand every word."],
  ["Sie zählt die Haltestellen: eins, zwei, drei.","Вона рахує зупинки: один, два, три.","She counts the stops: one, two, three."],
  ["Leila steigt aus, doch vor ihr stehen zwei große Gebäude.","Лейла виходить, але перед нею стоять дві великі будівлі.","Leila gets off, but two large buildings stand in front of her."],
  ["Welches Gebäude ist das Krankenhaus?","Яка з цих будівель — лікарня?","Which building is the hospital?"],
  ["Ein Mann zeigt ihr den Eingang auf der linken Seite.","Чоловік показує їй вхід ліворуч.","A man shows her the entrance on the left."],
  ["Leila bedankt sich und geht schnell hinein.","Лейла дякує й швидко заходить усередину.","Leila thanks him and hurries inside."],
  ["Am Empfang sagt die Mitarbeiterin: „Sie sind genau richtig.“","На рецепції працівниця каже: «Ви прийшли саме туди, куди потрібно».","At reception the employee says, \"You have come to the right place.\""],
  ["Leila lächelt: Sie hat den Weg ganz allein gefunden.","Лейла усміхається: вона самостійно знайшла дорогу.","Leila smiles: she found the way all by herself."],
 ],
 paragraphEnds:[5,10,15,20],
 glossary:parseGloss(String.raw`
Leila|Лейла (ім'я)|Leila (name)
Arzt|лікар|doctor
fahren|їхати|travel; go by vehicle
Haltestelle|зупинка|bus stop
wartet|чекає|waits
Minuten|хвилини|minutes
spät|пізно|late
Fahrer|водій|driver
Fährt|їде|goes; drives
dieser|цей|this (masculine)
Krankenhaus|лікарня|hospital
nächsten|наступній|next
aussteigen|виходити з транспорту|get off
steigt|сідає; виходить (із aus)|gets on; gets off (with aus)
Fuß|нога; пішки (zu Fuß)|foot; on foot
`),
 questions:[
  Q("На скільки запізнився автобус?","How late is the bus?",[["На п'ять хвилин","Five minutes"],["На десять хвилин","Ten minutes"],["На двадцять хвилин","Twenty minutes"]],1),
  Q("Куди їде Лейла?","Where is Leila going?",[["До лікарні","To the hospital"],["До школи","To school"],["До магазину","To the shop"]],0),
  Q("Хто показує Лейлі вхід до лікарні?","Who shows Leila the hospital entrance?",[["Працівниця пекарні","A bakery worker"],["Учитель","A teacher"],["Чоловік біля будівель","A man near the buildings"]],2),
 ]
}
];