import type {Topic} from "./data";
export type LearningSection={id:string;name:string;de:string;emoji:string;desc:string;topicIds:readonly string[];heroTopic:string;coverWordId?:string;coverPhoto?:string};
/** Every original category appears exactly once. Word IDs and topic IDs never change. */
export const LEARNING_SECTIONS:LearningSection[]=[
 {id:"food",name:"Їжа та напої",de:"Essen & Trinken",emoji:"🍎",desc:"Продукти, овочі, фрукти, страви й напої",topicIds:["staples","vegetables","fruits","drinks","dishes","dining"],heroTopic:"staples",coverWordId:"food-277"},
 {id:"home",name:"Дім та побут",de:"Haus & Alltag",emoji:"🏡",desc:"Кімнати, меблі, побут, оренда",topicIds:["rooms","furniture","housework","bathroom","kitchenware","housing"],heroTopic:"rooms",coverWordId:"home-337"},
 {id:"city",name:"Місто і транспорт",de:"Stadt & Verkehr",emoji:"🚋",desc:"Вулиці, заклади, поїздки, транспорт",topicIds:["citydirections","places","vehicles","publictransport","tourism"],heroTopic:"publictransport",coverWordId:"transport-565"},
 {id:"services",name:"Покупки та документи",de:"Einkaufen & Ämter",emoji:"🛒",desc:"Магазин, гроші, установи та допомога",topicIds:["shopping","banking","institutions","social"],heroTopic:"shopping",coverPhoto:"https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1100&h=680&fit=crop&q=85"},
 {id:"people",name:"Люди та сім’я",de:"Familie & Menschen",emoji:"👨‍👩‍👧",desc:"Родина, друзі та стосунки",topicIds:["family","people"],heroTopic:"family",coverPhoto:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1100&h=680&fit=crop&q=85"},
 {id:"health",name:"Здоров’я",de:"Gesundheit",emoji:"🩺",desc:"Тіло, симптоми, лікар і аптека",topicIds:["bodyparts","symptoms","medical"],heroTopic:"medical",coverPhoto:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1100&h=680&fit=crop&q=85"},
 {id:"nature",name:"Природа",de:"Natur",emoji:"🐕",desc:"Тварини, природа, погода та сезони",topicIds:["animals","landscapes","weather"],heroTopic:"animals",coverWordId:"nature-506"},
 {id:"study",name:"Робота та навчання",de:"Arbeit & Lernen",emoji:"🎓",desc:"Професії, офіс, школа та університет",topicIds:["work","office","school","university"],heroTopic:"university",coverPhoto:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1100&h=680&fit=crop&q=85"},
 {id:"daily",name:"Повсякденне життя",de:"Mein Alltag",emoji:"👟",desc:"Одяг, спорт, дозвілля, час і техніка",topicIds:["clothing","sports","leisure","calendar","everyday","tech"],heroTopic:"clothing",coverWordId:"clothes-419"},
 {id:"language",name:"Основи німецької",de:"Deutsch lernen",emoji:"💬",desc:"Дієслова, прикметники, фрази й граматика",topicIds:["phrases","verbs","adjs","questions","pronouns","adverbs","preps","numbers"],heroTopic:"phrases",coverPhoto:"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1100&h=680&fit=crop&q=85"}
];
export function topicsForSection(section:LearningSection,topics:readonly Topic[]):Topic[]{
 return section.topicIds.map(id=>topics.find(topic=>topic.id===id)).filter((topic):topic is Topic=>Boolean(topic));
}
