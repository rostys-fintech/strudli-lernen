/** Curated practical phrases for newcomers to Germany (150, 15 per situation). A0–A2.
 * Original, bilingual phrases shared by Audio and everyday-situation exercises.
 * The German sentences are the exact audio utterances. No artificial filler.
 */
export type PhraseCategory="greetings"|"conversation"|"shopping"|"transport"|"housing"|"health"|"office"|"work"|"social"|"problems";
export type PhraseLevel="A0"|"A1"|"A2";
export type DailyPhrase={id:string;category:PhraseCategory;de:string;uk:string;en:string;level:PhraseLevel};
export const PHRASE_CATEGORIES:readonly {id:PhraseCategory;uk:string;en:string;emoji:string}[]=[
  {
    "id": "greetings",
    "uk": "Знайомство",
    "en": "Getting acquainted",
    "emoji": "👋"
  },
  {
    "id": "conversation",
    "uk": "Розмова",
    "en": "Conversation",
    "emoji": "💬"
  },
  {
    "id": "shopping",
    "uk": "Магазин і кафе",
    "en": "Shops and cafés",
    "emoji": "🛍️"
  },
  {
    "id": "transport",
    "uk": "Транспорт",
    "en": "Transport",
    "emoji": "🚆"
  },
  {
    "id": "housing",
    "uk": "Дім і житло",
    "en": "Home and housing",
    "emoji": "🏠"
  },
  {
    "id": "health",
    "uk": "Здоров’я",
    "en": "Health",
    "emoji": "🩺"
  },
  {
    "id": "office",
    "uk": "Документи й установи",
    "en": "Appointments and offices",
    "emoji": "📋"
  },
  {
    "id": "work",
    "uk": "Робота й навчання",
    "en": "Work and study",
    "emoji": "📚"
  },
  {
    "id": "social",
    "uk": "Друзі й дозвілля",
    "en": "Friends and leisure",
    "emoji": "☀️"
  },
  {
    "id": "problems",
    "uk": "Проблеми й допомога",
    "en": "Problems and help",
    "emoji": "🧩"
  }
];
const rows:readonly [PhraseCategory,string,string,string,PhraseLevel][]=[
  [
    "greetings",
    "Hallo! Schön, dich kennenzulernen.",
    "Привіт! Радий познайомитися.",
    "Hello! Nice to meet you.",
    "A0"
  ],
  [
    "greetings",
    "Wie heißen Sie?",
    "Як Вас звати?",
    "What is your name? (formal)",
    "A0"
  ],
  [
    "greetings",
    "Ich heiße Alex.",
    "Мене звати Алекс.",
    "My name is Alex.",
    "A0"
  ],
  [
    "greetings",
    "Woher kommen Sie?",
    "Звідки Ви?",
    "Where are you from?",
    "A0"
  ],
  [
    "greetings",
    "Ich komme aus der Ukraine.",
    "Я з України.",
    "I come from Ukraine.",
    "A0"
  ],
  [
    "greetings",
    "Ich wohne jetzt in Deutschland.",
    "Зараз я живу в Німеччині.",
    "I live in Germany now.",
    "A1"
  ],
  [
    "greetings",
    "Wie geht es Ihnen heute?",
    "Як Ви сьогодні почуваєтеся?",
    "How are you today? (formal)",
    "A0"
  ],
  [
    "greetings",
    "Danke, mir geht es gut.",
    "Дякую, у мене все добре.",
    "Thank you, I'm doing well.",
    "A0"
  ],
  [
    "greetings",
    "Und wie geht es dir?",
    "А як справи в тебе?",
    "And how are you? (informal)",
    "A0"
  ],
  [
    "greetings",
    "Bis morgen!",
    "До завтра!",
    "See you tomorrow!",
    "A0"
  ],
  [
    "greetings",
    "Freut mich, Sie kennenzulernen.",
    "Радий з Вами познайомитися.",
    "Pleased to meet you.",
    "A0"
  ],
  [
    "greetings",
    "Ich bin seit drei Monaten hier.",
    "Я тут уже три місяці.",
    "I have been here for three months.",
    "A1"
  ],
  [
    "greetings",
    "Das ist mein Mann.",
    "Це мій чоловік.",
    "This is my husband.",
    "A0"
  ],
  [
    "greetings",
    "Schönes Wochenende!",
    "Гарних вихідних!",
    "Have a nice weekend!",
    "A0"
  ],
  [
    "greetings",
    "Wir können uns gern duzen.",
    "Можемо перейти на «ти».",
    "We can use first names (du).",
    "A1"
  ],
  [
    "conversation",
    "Ich spreche noch nicht gut Deutsch.",
    "Я ще не дуже добре розмовляю німецькою.",
    "I don't speak German very well yet.",
    "A1"
  ],
  [
    "conversation",
    "Können Sie bitte langsamer sprechen?",
    "Можете говорити повільніше, будь ласка?",
    "Could you speak more slowly, please?",
    "A1"
  ],
  [
    "conversation",
    "Könnten Sie das bitte wiederholen?",
    "Не могли б Ви повторити це?",
    "Could you repeat that, please?",
    "A1"
  ],
  [
    "conversation",
    "Was bedeutet dieses Wort?",
    "Що означає це слово?",
    "What does this word mean?",
    "A1"
  ],
  [
    "conversation",
    "Wie schreibt man das?",
    "Як це пишеться?",
    "How do you spell that?",
    "A1"
  ],
  [
    "conversation",
    "Können Sie das bitte buchstabieren?",
    "Можете продиктувати це по літерах?",
    "Could you spell that, please?",
    "A1"
  ],
  [
    "conversation",
    "Ich habe die Frage nicht verstanden.",
    "Я не зрозумів запитання.",
    "I didn't understand the question.",
    "A1"
  ],
  [
    "conversation",
    "Einen Moment, bitte.",
    "Хвилинку, будь ласка.",
    "One moment, please.",
    "A0"
  ],
  [
    "conversation",
    "Können wir auf Englisch sprechen?",
    "Можемо розмовляти англійською?",
    "Can we speak English?",
    "A1"
  ],
  [
    "conversation",
    "Jetzt habe ich es verstanden.",
    "Тепер я зрозумів.",
    "Now I understand.",
    "A1"
  ],
  [
    "conversation",
    "Wie sagt man das auf Deutsch?",
    "Як це сказати німецькою?",
    "How do you say that in German?",
    "A1"
  ],
  [
    "conversation",
    "Können Sie mir das aufschreiben?",
    "Чи можете Ви мені це записати?",
    "Could you write that down for me?",
    "A1"
  ],
  [
    "conversation",
    "Ist das so richtig?",
    "Так правильно?",
    "Is it right like this?",
    "A1"
  ],
  [
    "conversation",
    "Ich verstehe nur ein bisschen.",
    "Я розумію лише трохи.",
    "I only understand a little.",
    "A1"
  ],
  [
    "conversation",
    "Gibt es hier einen Dolmetscher?",
    "Чи є тут перекладач?",
    "Is there an interpreter here?",
    "A2"
  ],
  [
    "shopping",
    "Ich hätte gern zwei Brötchen, bitte.",
    "Мені дві булочки, будь ласка.",
    "I'd like two bread rolls, please.",
    "A1"
  ],
  [
    "shopping",
    "Was kostet ein Kilo Äpfel?",
    "Скільки коштує кілограм яблук?",
    "How much is a kilo of apples?",
    "A1"
  ],
  [
    "shopping",
    "Wo finde ich die Milch?",
    "Де знайти молоко?",
    "Where can I find the milk?",
    "A1"
  ],
  [
    "shopping",
    "Haben Sie auch eine kleinere Größe?",
    "У Вас є менший розмір?",
    "Do you also have a smaller size?",
    "A1"
  ],
  [
    "shopping",
    "Kann ich das anprobieren?",
    "Можна це приміряти?",
    "May I try this on?",
    "A1"
  ],
  [
    "shopping",
    "Kann ich mit Karte bezahlen?",
    "Можна розрахуватися карткою?",
    "Can I pay by card?",
    "A1"
  ],
  [
    "shopping",
    "Ich brauche eine Quittung, bitte.",
    "Мені потрібен чек, будь ласка.",
    "I need a receipt, please.",
    "A1"
  ],
  [
    "shopping",
    "Zum Mitnehmen, bitte.",
    "Із собою, будь ласка.",
    "To take away, please.",
    "A0"
  ],
  [
    "shopping",
    "Ist dieser Platz noch frei?",
    "Це місце вільне?",
    "Is this seat still available?",
    "A1"
  ],
  [
    "shopping",
    "Die Rechnung, bitte.",
    "Рахунок, будь ласка.",
    "The bill, please.",
    "A0"
  ],
  [
    "shopping",
    "Wo ist hier die Kasse?",
    "Де тут каса?",
    "Where is the checkout?",
    "A0"
  ],
  [
    "shopping",
    "Haben Sie eine Tüte für mich?",
    "У Вас є для мене пакет?",
    "Do you have a bag for me?",
    "A1"
  ],
  [
    "shopping",
    "Ich möchte das umtauschen.",
    "Я хочу це обміняти.",
    "I would like to exchange this.",
    "A1"
  ],
  [
    "shopping",
    "Ist das im Angebot?",
    "Це зараз в акції?",
    "Is this on sale?",
    "A1"
  ],
  [
    "shopping",
    "Ich schaue nur, danke.",
    "Я лише дивлюся, дякую.",
    "I'm just looking, thanks.",
    "A0"
  ],
  [
    "transport",
    "Wo ist die nächste Bushaltestelle?",
    "Де найближча автобусна зупинка?",
    "Where is the nearest bus stop?",
    "A1"
  ],
  [
    "transport",
    "Wann fährt der nächste Zug ab?",
    "Коли відправляється наступний потяг?",
    "When does the next train leave?",
    "A1"
  ],
  [
    "transport",
    "Fährt dieser Bus zum Bahnhof?",
    "Цей автобус їде до вокзалу?",
    "Does this bus go to the station?",
    "A1"
  ],
  [
    "transport",
    "Auf welchem Gleis fährt der Zug ab?",
    "З якої колії відправляється потяг?",
    "Which platform does the train leave from?",
    "A1"
  ],
  [
    "transport",
    "Ich brauche eine Fahrkarte nach Ulm.",
    "Мені потрібен квиток до Ульма.",
    "I need a ticket to Ulm.",
    "A1"
  ],
  [
    "transport",
    "Einmal hin und zurück, bitte.",
    "Один квиток туди й назад, будь ласка.",
    "One return ticket, please.",
    "A1"
  ],
  [
    "transport",
    "Ich muss an der nächsten Haltestelle aussteigen.",
    "Мені потрібно вийти на наступній зупинці.",
    "I need to get off at the next stop.",
    "A1"
  ],
  [
    "transport",
    "Hat der Zug Verspätung?",
    "Потяг запізнюється?",
    "Is the train delayed?",
    "A1"
  ],
  [
    "transport",
    "Wie lange dauert die Fahrt?",
    "Скільки триває поїздка?",
    "How long does the journey take?",
    "A1"
  ],
  [
    "transport",
    "Entschuldigung, ist dieser Sitzplatz frei?",
    "Перепрошую, це місце вільне?",
    "Excuse me, is this seat free?",
    "A1"
  ],
  [
    "transport",
    "Wo kann ich ein Deutschlandticket kaufen?",
    "Де я можу купити Deutschlandticket?",
    "Where can I buy a Deutschlandticket?",
    "A1"
  ],
  [
    "transport",
    "Muss ich hier umsteigen?",
    "Мені тут треба пересідати?",
    "Do I have to change here?",
    "A1"
  ],
  [
    "transport",
    "Der Zug fällt heute aus.",
    "Потяг сьогодні скасовано.",
    "The train is cancelled today.",
    "A1"
  ],
  [
    "transport",
    "Welche Linie fährt ins Zentrum?",
    "Яка лінія їде до центру?",
    "Which line goes to the city centre?",
    "A1"
  ],
  [
    "transport",
    "Wo ist hier der Ausgang?",
    "Де тут вихід?",
    "Where is the exit?",
    "A0"
  ],
  [
    "housing",
    "Ich suche ein Zimmer zur Miete.",
    "Я шукаю кімнату в оренду.",
    "I'm looking for a room to rent.",
    "A1"
  ],
  [
    "housing",
    "Ist die Wohnung noch frei?",
    "Ця квартира ще вільна?",
    "Is the apartment still available?",
    "A1"
  ],
  [
    "housing",
    "Wann kann ich die Wohnung besichtigen?",
    "Коли можна подивитися квартиру?",
    "When can I view the apartment?",
    "A1"
  ],
  [
    "housing",
    "Sind die Nebenkosten in der Miete enthalten?",
    "Комунальні витрати входять в орендну плату?",
    "Are utilities included in the rent?",
    "A2"
  ],
  [
    "housing",
    "Wie hoch ist die Kaution?",
    "Який розмір застави?",
    "How much is the deposit?",
    "A1"
  ],
  [
    "housing",
    "Ab wann kann ich einziehen?",
    "Відколи я можу заселитися?",
    "When can I move in?",
    "A1"
  ],
  [
    "housing",
    "Der Wasserhahn funktioniert nicht.",
    "Кран не працює.",
    "The tap isn't working.",
    "A1"
  ],
  [
    "housing",
    "Die Heizung ist kaputt.",
    "Опалення зламалося.",
    "The heating is broken.",
    "A1"
  ],
  [
    "housing",
    "Könnten Sie mir den Schlüssel geben?",
    "Не могли б Ви дати мені ключ?",
    "Could you give me the key?",
    "A1"
  ],
  [
    "housing",
    "Ich habe eine Frage zum Mietvertrag.",
    "У мене запитання щодо договору оренди.",
    "I have a question about the rental contract.",
    "A2"
  ],
  [
    "housing",
    "Wann wird der Müll abgeholt?",
    "Коли вивозять сміття?",
    "When is the rubbish collected?",
    "A1"
  ],
  [
    "housing",
    "Mein Name steht nicht am Briefkasten.",
    "Мого імені немає на поштовій скриньці.",
    "My name is not on the letterbox.",
    "A1"
  ],
  [
    "housing",
    "Ich brauche eine Wohnungsgeberbestätigung.",
    "Мені потрібне підтвердження від орендодавця.",
    "I need a confirmation from my landlord.",
    "A2"
  ],
  [
    "housing",
    "Die Waschmaschine ist im Keller.",
    "Пральна машина в підвалі.",
    "The washing machine is in the basement.",
    "A1"
  ],
  [
    "housing",
    "Bitte lüften Sie jeden Tag.",
    "Провітрюйте, будь ласка, щодня.",
    "Please air the flat every day.",
    "A1"
  ],
  [
    "health",
    "Ich möchte einen Termin vereinbaren.",
    "Я хочу записатися на прийом.",
    "I'd like to make an appointment.",
    "A1"
  ],
  [
    "health",
    "Ich habe seit gestern Kopfschmerzen.",
    "У мене з учора болить голова.",
    "I've had a headache since yesterday.",
    "A1"
  ],
  [
    "health",
    "Mir ist schwindelig.",
    "У мене паморочиться в голові.",
    "I feel dizzy.",
    "A1"
  ],
  [
    "health",
    "Ich brauche einen Arzt.",
    "Мені потрібен лікар.",
    "I need a doctor.",
    "A0"
  ],
  [
    "health",
    "Wo ist die nächste Apotheke?",
    "Де найближча аптека?",
    "Where is the nearest pharmacy?",
    "A1"
  ],
  [
    "health",
    "Wie oft soll ich das Medikament nehmen?",
    "Як часто мені приймати ці ліки?",
    "How often should I take this medicine?",
    "A2"
  ],
  [
    "health",
    "Ich bin gegen Penicillin allergisch.",
    "У мене алергія на пеніцилін.",
    "I'm allergic to penicillin.",
    "A1"
  ],
  [
    "health",
    "Tut das hier weh?",
    "Тут болить?",
    "Does it hurt here?",
    "A1"
  ],
  [
    "health",
    "Ich habe meine Gesundheitskarte dabei.",
    "У мене із собою медична картка.",
    "I have my health insurance card with me.",
    "A1"
  ],
  [
    "health",
    "Könnten Sie das bitte erklären?",
    "Чи не могли б Ви це пояснити?",
    "Could you explain that, please?",
    "A1"
  ],
  [
    "health",
    "Ich brauche eine Krankmeldung.",
    "Мені потрібен лікарняний.",
    "I need a sick note.",
    "A1"
  ],
  [
    "health",
    "Rufen Sie bitte einen Krankenwagen!",
    "Викличте, будь ласка, швидку!",
    "Please call an ambulance!",
    "A1"
  ],
  [
    "health",
    "Mein Kind hat Fieber.",
    "У моєї дитини температура.",
    "My child has a fever.",
    "A1"
  ],
  [
    "health",
    "Brauche ich dafür ein Rezept?",
    "Мені для цього потрібен рецепт?",
    "Do I need a prescription for this?",
    "A1"
  ],
  [
    "health",
    "Haben Sie heute noch einen freien Termin?",
    "Чи є у Вас сьогодні ще вільний час для прийому?",
    "Do you have a free appointment today?",
    "A2"
  ],
  [
    "office",
    "Ich habe einen Termin um zehn Uhr.",
    "У мене запис на десяту годину.",
    "I have an appointment at ten.",
    "A1"
  ],
  [
    "office",
    "Welche Unterlagen brauche ich?",
    "Які документи мені потрібні?",
    "Which documents do I need?",
    "A1"
  ],
  [
    "office",
    "Wo muss ich das Formular abgeben?",
    "Куди мені подати бланк?",
    "Where do I submit the form?",
    "A2"
  ],
  [
    "office",
    "Ich möchte meine Adresse ändern.",
    "Я хочу змінити свою адресу.",
    "I'd like to change my address.",
    "A1"
  ],
  [
    "office",
    "Brauche ich eine Kopie von meinem Pass?",
    "Мені потрібна копія паспорта?",
    "Do I need a copy of my passport?",
    "A1"
  ],
  [
    "office",
    "Könnten Sie mir eine Bestätigung geben?",
    "Не могли б Ви дати мені підтвердження?",
    "Could you give me a confirmation?",
    "A2"
  ],
  [
    "office",
    "Muss ich einen neuen Termin buchen?",
    "Мені треба записатися ще раз?",
    "Do I need to book another appointment?",
    "A1"
  ],
  [
    "office",
    "Ich habe das Formular schon ausgefüllt.",
    "Я вже заповнив бланк.",
    "I've already filled in the form.",
    "A2"
  ],
  [
    "office",
    "Wann bekomme ich eine Antwort?",
    "Коли я отримаю відповідь?",
    "When will I get an answer?",
    "A1"
  ],
  [
    "office",
    "Vielen Dank für Ihre Hilfe.",
    "Щиро дякую за Вашу допомогу.",
    "Thank you very much for your help.",
    "A0"
  ],
  [
    "office",
    "Ich möchte meine Wohnung anmelden.",
    "Я хочу зареєструватися за адресою.",
    "I would like to register my address.",
    "A1"
  ],
  [
    "office",
    "Wo bekomme ich eine Wartenummer?",
    "Де взяти номерок у черзі?",
    "Where do I get a queue number?",
    "A1"
  ],
  [
    "office",
    "Mein Aufenthaltstitel läuft bald ab.",
    "Мій дозвіл на проживання скоро закінчується.",
    "My residence permit expires soon.",
    "A2"
  ],
  [
    "office",
    "Kann ich das auch online erledigen?",
    "Чи можу я зробити це онлайн?",
    "Can I do this online as well?",
    "A1"
  ],
  [
    "office",
    "Ich habe einen Brief vom Jobcenter bekommen.",
    "Я отримав лист від Jobcenter.",
    "I received a letter from the Jobcenter.",
    "A1"
  ],
  [
    "work",
    "Ich suche einen Deutschkurs am Abend.",
    "Я шукаю вечірній курс німецької.",
    "I'm looking for an evening German course.",
    "A1"
  ],
  [
    "work",
    "Wann beginnt der Unterricht?",
    "Коли починається заняття?",
    "When does the lesson start?",
    "A1"
  ],
  [
    "work",
    "Ich habe meine Hausaufgaben gemacht.",
    "Я зробив домашнє завдання.",
    "I've done my homework.",
    "A1"
  ],
  [
    "work",
    "Können wir die Aufgabe zusammen machen?",
    "Можемо зробити завдання разом?",
    "Can we do the task together?",
    "A1"
  ],
  [
    "work",
    "Ich habe morgen ein Vorstellungsgespräch.",
    "Завтра в мене співбесіда.",
    "I have a job interview tomorrow.",
    "A1"
  ],
  [
    "work",
    "Ich habe Erfahrung im Kundenservice.",
    "У мене є досвід роботи з клієнтами.",
    "I have experience in customer service.",
    "A2"
  ],
  [
    "work",
    "Könnten Sie mir die E-Mail schicken?",
    "Не могли б Ви надіслати мені електронного листа?",
    "Could you send me the email?",
    "A1"
  ],
  [
    "work",
    "Ich arbeite heute von zu Hause aus.",
    "Сьогодні я працюю з дому.",
    "I'm working from home today.",
    "A1"
  ],
  [
    "work",
    "Wann ist die nächste Besprechung?",
    "Коли наступна нарада?",
    "When is the next meeting?",
    "A2"
  ],
  [
    "work",
    "Ich brauche noch etwas Zeit.",
    "Мені потрібно ще трохи часу.",
    "I need a little more time.",
    "A1"
  ],
  [
    "work",
    "Mein Kind geht in die Kita.",
    "Моя дитина ходить у садочок.",
    "My child goes to nursery.",
    "A1"
  ],
  [
    "work",
    "Ich bin heute krank und komme nicht.",
    "Я сьогодні хворий і не прийду.",
    "I'm sick today and won't come in.",
    "A1"
  ],
  [
    "work",
    "Wie viele Stunden pro Woche soll ich arbeiten?",
    "Скільки годин на тиждень я маю працювати?",
    "How many hours a week should I work?",
    "A2"
  ],
  [
    "work",
    "Wo kann ich mich umziehen?",
    "Де я можу переодягнутися?",
    "Where can I get changed?",
    "A1"
  ],
  [
    "work",
    "Können Sie mir ein Arbeitszeugnis schreiben?",
    "Чи можете Ви написати мені відгук з місця роботи?",
    "Could you write me a job reference?",
    "A2"
  ],
  [
    "social",
    "Hast du am Wochenende Zeit?",
    "Маєш час на вихідних?",
    "Are you free at the weekend?",
    "A1"
  ],
  [
    "social",
    "Wollen wir zusammen einen Kaffee trinken?",
    "Може, вип’ємо разом кави?",
    "Shall we have a coffee together?",
    "A1"
  ],
  [
    "social",
    "Wo wollen wir uns treffen?",
    "Де зустрінемося?",
    "Where shall we meet?",
    "A1"
  ],
  [
    "social",
    "Ich komme ungefähr zehn Minuten später.",
    "Я прийду приблизно на десять хвилин пізніше.",
    "I'll be about ten minutes late.",
    "A1"
  ],
  [
    "social",
    "Das klingt nach einer guten Idee.",
    "Звучить як гарна ідея.",
    "That sounds like a good idea.",
    "A1"
  ],
  [
    "social",
    "Heute kann ich leider nicht.",
    "Сьогодні я, на жаль, не можу.",
    "Unfortunately, I can't today.",
    "A1"
  ],
  [
    "social",
    "Vielleicht ein anderes Mal?",
    "Може, іншим разом?",
    "Maybe another time?",
    "A1"
  ],
  [
    "social",
    "Ich freue mich auf das Treffen.",
    "Я з нетерпінням чекаю зустрічі.",
    "I'm looking forward to meeting up.",
    "A2"
  ],
  [
    "social",
    "Schick mir bitte die Adresse.",
    "Надішли мені адресу, будь ласка.",
    "Please send me the address.",
    "A1"
  ],
  [
    "social",
    "Es war wirklich schön heute.",
    "Сьогодні було справді чудово.",
    "Today was really lovely.",
    "A1"
  ],
  [
    "social",
    "Herzlichen Glückwunsch zum Geburtstag!",
    "Вітаю з днем народження!",
    "Happy birthday!",
    "A1"
  ],
  [
    "social",
    "Möchtest du etwas trinken?",
    "Хочеш щось випити?",
    "Would you like something to drink?",
    "A1"
  ],
  [
    "social",
    "Ich lade dich zum Essen ein.",
    "Я запрошую тебе поїсти.",
    "I'm inviting you for a meal.",
    "A1"
  ],
  [
    "social",
    "Das hat sehr gut geschmeckt.",
    "Це було дуже смачно.",
    "That tasted really good.",
    "A1"
  ],
  [
    "social",
    "Gute Besserung!",
    "Одужуй швидше!",
    "Get well soon!",
    "A0"
  ],
  [
    "problems",
    "Entschuldigung, ich habe mich verlaufen.",
    "Перепрошую, я заблукав.",
    "Excuse me, I'm lost.",
    "A1"
  ],
  [
    "problems",
    "Ich finde meinen Schlüssel nicht.",
    "Я не можу знайти ключ.",
    "I can't find my key.",
    "A1"
  ],
  [
    "problems",
    "Mein Handy ist verschwunden.",
    "Мій телефон зник.",
    "My phone has disappeared.",
    "A1"
  ],
  [
    "problems",
    "Können Sie mir bitte helfen?",
    "Можете мені допомогти, будь ласка?",
    "Could you help me, please?",
    "A0"
  ],
  [
    "problems",
    "Ich habe meine Tasche im Bus vergessen.",
    "Я забув сумку в автобусі.",
    "I left my bag on the bus.",
    "A1"
  ],
  [
    "problems",
    "Wo ist das Fundbüro?",
    "Де бюро знахідок?",
    "Where is the lost property office?",
    "A1"
  ],
  [
    "problems",
    "Die Karte funktioniert nicht.",
    "Картка не працює.",
    "The card isn't working.",
    "A1"
  ],
  [
    "problems",
    "Ich habe die falsche Adresse bekommen.",
    "Мені дали неправильну адресу.",
    "I was given the wrong address.",
    "A2"
  ],
  [
    "problems",
    "Könnten Sie mir den Weg zeigen?",
    "Не могли б Ви показати мені дорогу?",
    "Could you show me the way?",
    "A1"
  ],
  [
    "problems",
    "Alles gut, das kann passieren.",
    "Усе гаразд, таке буває.",
    "It's all right, these things happen.",
    "A1"
  ],
  [
    "problems",
    "Rufen Sie bitte die Polizei!",
    "Викличте, будь ласка, поліцію!",
    "Please call the police!",
    "A1"
  ],
  [
    "problems",
    "Ich habe mein Portemonnaie verloren.",
    "Я загубив гаманець.",
    "I have lost my wallet.",
    "A1"
  ],
  [
    "problems",
    "Mein Bankkonto ist gesperrt.",
    "Мій банківський рахунок заблоковано.",
    "My bank account is blocked.",
    "A1"
  ],
  [
    "problems",
    "Das Internet funktioniert nicht.",
    "Інтернет не працює.",
    "The internet isn't working.",
    "A1"
  ],
  [
    "problems",
    "Ich möchte mich beschweren.",
    "Я хочу поскаржитися.",
    "I would like to make a complaint.",
    "A2"
  ]
];
export const DAILY_PHRASES:readonly DailyPhrase[]=rows.map(([category,de,uk,en,level],i)=>({id:"phrase-"+String(i+1).padStart(3,"0"),category,de,uk,en,level}));
