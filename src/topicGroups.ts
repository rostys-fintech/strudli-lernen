import {FOOD_GROUPS} from "./foodGroups";
export {FOOD_GROUPS};
export const HOME_GROUPS=[
  {
    "id": "rooms",
    "name": "Кімнати та приміщення",
    "emoji": "🏠",
    "desc": "Кімнати, кухня, коридор, житло",
    "ids": [
      "home-337",
      "home-338",
      "home-339",
      "home-340",
      "home-341",
      "home-342",
      "home-343",
      "home-344"
    ]
  },
  {
    "id": "structure",
    "name": "Частини будинку",
    "emoji": "🚪",
    "desc": "Двері, вікна, підлога, дах",
    "ids": [
      "home-345",
      "home-346",
      "home-347",
      "home-348",
      "home-349",
      "home-350",
      "home-360"
    ]
  },
  {
    "id": "furniture",
    "name": "Меблі та затишок",
    "emoji": "🛋️",
    "desc": "Ліжко, диван, стіл, освітлення",
    "ids": [
      "home-351",
      "home-352",
      "home-353",
      "home-354",
      "home-355",
      "home-356",
      "home-357",
      "home-358",
      "home-359",
      "home-385"
    ]
  },
  {
    "id": "appliances",
    "name": "Техніка та господарство",
    "emoji": "🔌",
    "desc": "Плита, холодильник, прання, ключі",
    "ids": [
      "home-361",
      "home-362",
      "home-363",
      "home-364",
      "home-365",
      "home-366",
      "home-367",
      "home-368",
      "home-369",
      "home-370",
      "home-386",
      "home-387"
    ]
  },
  {
    "id": "bathroom",
    "name": "Ванна та гігієна",
    "emoji": "🚿",
    "desc": "Душ, ванна, мило, рушники",
    "ids": [
      "home-371",
      "home-372",
      "home-373",
      "home-374",
      "home-375",
      "home-376"
    ]
  },
  {
    "id": "kitchen",
    "name": "Кухонний посуд",
    "emoji": "🍴",
    "desc": "Тарілки, склянки, виделки, каструлі",
    "ids": [
      "home-377",
      "home-378",
      "home-379",
      "home-380",
      "home-381",
      "home-382",
      "home-383",
      "home-384"
    ]
  }
] as const;
export type StructuredTopic="food"|"home";
export type TopicGroup={id:string;name:string;emoji:string;desc:string;ids:readonly string[]};
export function topicGroups(topic:StructuredTopic):readonly TopicGroup[]{return topic==="food"?FOOD_GROUPS:HOME_GROUPS}
export function idsForTopicGroup(topic:StructuredTopic,groupId:string):string[]{
 const groups=topicGroups(topic);
 if(groupId==="all")return groups.flatMap(g=>[...g.ids]);
 const group=groups.find(g=>g.id===groupId);
 return group?[...group.ids]:[];
}
