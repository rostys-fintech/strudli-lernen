import type {Word} from "./data";
import {ORIGINAL_SENTENCES} from "./data";
import {ORIGINAL_ENGLISH_SENTENCES,EXTRA_EXAMPLE_ENGLISH} from "./englishSentences";
import {EXAMPLES} from "./Library";
import {FOOD_CARD_EXAMPLES} from "./foodCardExamples";
import {EXPANDED_CARD_EXAMPLES} from "./expandedCardExamples";
import {REVIEWED_CARD_EXAMPLES} from "./reviewedCardExamples";
import {REVIEWED_08B_HOME} from "./reviewed08bHome";
import {REVIEWED_08B_LIFE} from "./reviewed08bLife";
import {REVIEWED_08C_OUTDOORS} from "./reviewed08cOutdoors";
import {REVIEWED_08C_LIFE} from "./reviewed08cLife";
import {REVIEWED_08D_VERBS} from "./reviewed08dVerbs";
import {REVIEWED_08D_ADJECTIVES} from "./reviewed08dAdjectives";
import {REVIEWED_08E_FUNCTION_WORDS} from "./reviewed08eFunctionWords";
import {REVIEWED_08E_ADVERBS_PRONOUNS} from "./reviewed08eAdverbsPronouns";
import {REVIEWED_08F_BASELINE} from "./reviewed08fBaseline";
import {REVIEWED_08F_CORRECTIONS} from "./reviewed08fCorrections";
import {COMPLETE_CARD_EXAMPLES} from "./completeCardExamples";
import type {UILang} from "./i18n";

/**
 * Only display bilingual example sentences with a known source and a complete translation.
 * Existing authored examples take priority. Remaining stable card IDs receive simple
 * image-based examples with translations; editorial review is still recommended.
 */
export type CardExample={de:string;translation:string;source:"food-curated"|"card-usage"|"dictionary"|"original-exercise"|"expanded-curated"|"editorial-reviewed"|"editorial-reviewed-08b"|"editorial-reviewed-08c"|"editorial-reviewed-08d"|"editorial-reviewed-08e"|"audit-baseline-cleanup"|"audit-correction"|"complete-baseline"};
const usageTranslations:Readonly<Record<string,readonly [string,string]>>={
 "pronouns-106":["Вона тут.","She is here."],
 "pronouns-109":["Ви тут.","You are here."],
 "pronouns-110":["Ви говорите німецькою?","Do you speak German?"],
 "pronouns-111":["Діти граються. Вони надворі.","The children are playing. They are outside."],
 "pronouns-112":["Вона бачить мене.","She sees me."],
 "pronouns-113":["Я бачу тебе.","I see you."],
 "pronouns-114":["Я знаю його.","I know him."],
 "pronouns-115":["Вона бачить нас.","She sees us."],
 "pronouns-116":["Я допомагаю вам.","I help you (plural)."],
 "pronouns-117":["Можеш мені допомогти?","Can you help me?"],
 "pronouns-118":["Я даю тобі книжку.","I give you the book."],
 "pronouns-119":["Я допомагаю йому.","I help him."],
 "pronouns-120":["Я допомагаю їй.","I help her."],
 "pronouns-121":["Це моя книжка.","This is my book."],
 "pronouns-122":["Це твоя книжка.","This is your book."],
 "pronouns-124":["Це її книжка.","This is her book."],
 "pronouns-125":["Це наш будинок.","This is our house."],
 "pronouns-126":["Це ваш будинок.","This is your house."],
 "pronouns-127":["Цей чоловік привітний.","This man is friendly."],
 "pronouns-128":["Ця жінка привітна.","This woman is friendly."],
 "pronouns-129":["Ця дитина маленька.","This child is small."],
 "preps-177":["Я у школі.","I am at school."],
 "preps-186":["Я їду з мамою.","I am traveling with my mother."],
 "preps-188":["Цей подарунок для мого друга.","This gift is for my friend."],
 "food-299":["Я їм салат.","I am eating a salad."],
 "food-311":["Я хотів би морозиво.","I would like an ice cream."],
 "food-319":["Виноград солодкий.","The grapes are sweet."],
 "home-349":["Лампа висить на стелі.","The lamp hangs from the ceiling."],
 "home-362":["Замок на дверях зламаний.","The lock on the door is broken."],
 "home-363":["Опалення тепле.","The heating is warm."],
 "body-700":["На столі лежить волосина.","There is a hair on the table."],
 "ww-new-058":["Я залишаю п'ять євро чайових.","I leave five euros as a tip."],
 "ww-new-063":["Завтра в мене огляд квартири.","I have an apartment viewing tomorrow."],
 "ww-new-149":["Я подаю заявку на роботу.","I am applying for a job."],
 "ww-new-155":["Я заходжу в автобус.","I get on the bus."],
 "ww-new-156":["Я виходжу на наступній зупинці.","I get off at the next stop."],
 "ww-new-157":["Я роблю пересадку в Ульмі.","I change trains in Ulm."],
 "ww-new-159":["Потяг прибуває о восьмій.","The train arrives at eight."],
 "ww-new-161":["Я розриваю договір.","I am terminating the contract."],
 "ww-new-174":["Я запрошую тебе на вечерю.","I am inviting you to dinner."],
 "ww-new-176":["Ці штани мені підходять.","These trousers fit me."],
 "ww-new-177":["Мені бракує десяти євро.","I am ten euros short."],
 "ww-new-178":["Я коротко представлюся.","I will introduce myself briefly."],
 "ww-new-180":["Сьогодні я почуваюся добре.","I feel good today."],
 "ww-new-181":["Я цікавлюся німецькою мовою.","I am interested in German."],
 "ww-new-192":["Квартира недорога.","The apartment is inexpensive."],
 "ww-new-194":["Я готовий.","I am ready."],
 "ww-new-196":["Тут безпечно.","It is safe here."],
 "ww-new-200":["Вона заміжня.","She is married."],
 "ww-new-201":["Я неодружений.","I am single."],
 "ww-new-217":["Я їм мідії.","I eat mussels."],
 "ww-new-220":["На сніданок я готую омлет.","I make an omelet for breakfast."],
 "ww-new-221":["Я їм яєчню вранці.","I eat a fried egg in the morning."],
 "ww-new-222":["Я люблю їсти тофу.","I like eating tofu."],
 "ww-new-223":["Я готую сочевицю.","I cook lentils."],
 "ww-new-224":["Я купую нут.","I buy chickpeas."]
};
const extraEnglish:Readonly<Record<string,string>>={
 "Ich esse einen Apfel.":"I am eating an apple.",
 "Ich trinke Wasser.":"I drink water.",
 "Ich fahre mit dem Bus.":"I travel by bus.",
 "Wo ist der Bahnhof?":"Where is the train station?"
};
function originalSentenceMatches(word:Word,sentence:string):boolean{
 if(!["noun","adj"].includes(word.kind)||word.de.length<4||word.de.includes(" "))return false;
 const tokens=sentence.toLocaleLowerCase("de").replace(/[.,!?;:“”„()]/g," ").split(/\s+/);
 return tokens.includes(word.de.toLocaleLowerCase("de"));
}
export function cardExampleFor(word:Word,language:UILang):CardExample|null{
 const curated=FOOD_CARD_EXAMPLES[word.id];
 if(curated)return {de:curated[0],translation:curated[language==="uk"?1:2],source:"food-curated"};
 // A small, explicitly audited group fixes actual duplicate displays / mismatched senses.
 const correction=REVIEWED_08F_CORRECTIONS[word.id];
 if(correction)return{de:correction[0],translation:correction[language==="uk"?1:2],source:"audit-correction"};
 const usage=word.usage?.trim();
 const usagePair=usageTranslations[word.id];
 if(usage&&usagePair&&/[.!?]$/.test(usage)){
  return{de:usage,translation:usagePair[language==="uk"?0:1],source:"card-usage"};
 }
 for(const [de,uk] of EXAMPLES[word.de]||[]){
  const en=EXTRA_EXAMPLE_ENGLISH[de]||extraEnglish[de];
  if(en)return{de,translation:language==="uk"?uk:en,source:"dictionary"};
 }
 for(let i=0;i<ORIGINAL_SENTENCES.length;i++){
  const original=ORIGINAL_SENTENCES[i];
  const en=ORIGINAL_ENGLISH_SENTENCES[i];
  if(en&&originalSentenceMatches(word,original.de)){
   return{de:original.de,translation:language==="uk"?original.uk:en,source:"original-exercise"};
  }
 }
 const expanded=EXPANDED_CARD_EXAMPLES[word.id];
 if(expanded)return{de:expanded[0],translation:expanded[language==="uk"?1:2],source:"expanded-curated"};
 const reviewed=REVIEWED_CARD_EXAMPLES[word.id];
 if(reviewed)return{de:reviewed[0],translation:reviewed[language==="uk"?1:2],source:"editorial-reviewed"};
 const reviewed08b=REVIEWED_08B_HOME[word.id]||REVIEWED_08B_LIFE[word.id];
 if(reviewed08b)return{de:reviewed08b[0],translation:reviewed08b[language==="uk"?1:2],source:"editorial-reviewed-08b"};
 const reviewed08c=REVIEWED_08C_OUTDOORS[word.id]||REVIEWED_08C_LIFE[word.id];
 if(reviewed08c)return{de:reviewed08c[0],translation:reviewed08c[language==="uk"?1:2],source:"editorial-reviewed-08c"};
 const reviewed08d=REVIEWED_08D_VERBS[word.id]||REVIEWED_08D_ADJECTIVES[word.id];
 if(reviewed08d)return{de:reviewed08d[0],translation:reviewed08d[language==="uk"?1:2],source:"editorial-reviewed-08d"};
 const reviewed08e=REVIEWED_08E_FUNCTION_WORDS[word.id]||REVIEWED_08E_ADVERBS_PRONOUNS[word.id];
 if(reviewed08e)return{de:reviewed08e[0],translation:reviewed08e[language==="uk"?1:2],source:"editorial-reviewed-08e"};
 const auditBaseline=REVIEWED_08F_BASELINE[word.id];
 if(auditBaseline)return{de:auditBaseline[0],translation:auditBaseline[language==="uk"?1:2],source:"audit-baseline-cleanup"};
 const complete=COMPLETE_CARD_EXAMPLES[word.id];
 if(complete)return{de:complete[0],translation:complete[language==="uk"?1:2],source:"complete-baseline"};
 return null;
}
