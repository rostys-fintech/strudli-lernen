/** User-facing subtopics keep all 60 original word IDs and their main food topic. */
export const FOOD_GROUPS=[
  {
    "id": "meals",
    "name": "Готові страви",
    "emoji": "🍽️",
    "desc": "Суп, піца, випічка та десерти",
    "ids": [
      "food-279",
      "food-288",
      "food-298",
      "food-299",
      "food-300",
      "food-308",
      "food-309",
      "food-310",
      "food-311",
      "food-323",
      "food-334"
    ]
  },
  {
    "id": "products",
    "name": "Продукти",
    "emoji": "🧀",
    "desc": "Молочні продукти, м’ясо, крупи та спеції",
    "ids": [
      "food-280",
      "food-281",
      "food-282",
      "food-283",
      "food-284",
      "food-285",
      "food-286",
      "food-287",
      "food-297",
      "food-304",
      "food-305",
      "food-306",
      "food-307",
      "food-320",
      "food-321",
      "food-322",
      "food-326",
      "food-327",
      "food-328",
      "food-329"
    ]
  },
  {
    "id": "produce",
    "name": "Овочі та фрукти",
    "emoji": "🥕",
    "desc": "Фрукти, овочі, зелень та гриби",
    "ids": [
      "food-277",
      "food-278",
      "food-289",
      "food-290",
      "food-291",
      "food-292",
      "food-293",
      "food-294",
      "food-295",
      "food-296",
      "food-316",
      "food-317",
      "food-318",
      "food-319",
      "food-324",
      "food-325",
      "food-335",
      "food-336"
    ]
  },
  {
    "id": "drinks",
    "name": "Напої",
    "emoji": "☕",
    "desc": "Вода, чай, кава, соки",
    "ids": [
      "food-312",
      "food-313",
      "food-314",
      "food-315",
      "food-330",
      "food-331"
    ]
  },
  {
    "id": "restaurant",
    "name": "У ресторані та прийоми їжі",
    "emoji": "🍴",
    "desc": "Сніданок, обід, вечеря, меню, рахунок",
    "ids": [
      "food-301",
      "food-302",
      "food-303",
      "food-332",
      "food-333"
    ]
  }
] as const;
export const allFoodWordIds=FOOD_GROUPS.flatMap(group=>[...group.ids]);
export function foodWordsInGroup(id:string):string[]{
 if(id==="all")return allFoodWordIds;
 const group=FOOD_GROUPS.find(g=>g.id===id);
 return group?[...group.ids]:[];
}
