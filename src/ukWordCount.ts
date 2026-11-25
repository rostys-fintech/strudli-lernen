export const wordCountForm=(n:number):string=>n%100>=11&&n%100<=14?"слів":n%10===1?"слово":n%10>=2&&n%10<=4?"слова":"слів";
