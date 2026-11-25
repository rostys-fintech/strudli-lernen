import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const library=read("src/Library.tsx"),resolver=read("src/cardExamples.ts"),i18n=read("src/i18n.ts");
const css=read("src/styles.css"),report=read("reports/stage08f/effective-examples.csv");
const lines=report.trimEnd().split("\n"),headers=lines[0].split(",");
assert.equal(lines.length,1178,"1 header + 1177 effective bilingual examples required");
assert.deepEqual(headers,["id","topic","kind","word","source","de","uk","en"],"Audited source report changed unexpectedly");
const ids=new Set();
for(const line of lines.slice(1)){
 const parts=[...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(m=>m[1].replaceAll('""','"'));
 assert.equal(parts.length,8,"Incomplete audited DE/UA/EN row");
 assert.ok(!ids.has(parts[0]),"Repeated vocabulary ID");
 ids.add(parts[0]);
 assert.ok(parts.slice(5).every(x=>x.trim()),"Missing German or translated text for "+parts[0]);
 assert.notEqual(parts[4],"complete-baseline","Old generic fallback remains for "+parts[0]);
}
assert.equal(ids.size,1177,"All stable IDs must exist");
assert.ok(library.includes("import {cardExampleFor} from \"./cardExamples\""),"Library must share actual Game resolver");
assert.ok(library.includes("cardExampleFor(w,language)"),"All library card examples must use stable word IDs");
assert.ok(library.includes("selectedExample.de")&&library.includes("selectedExample.translation"),"Dictionary detail must render bilingual example");
assert.ok(library.includes("speak(selectedExample.de)")&&library.includes("speak(ex.de)"),"Sentence speaker buttons absent");
assert.ok(library.includes('mode==="sentences"')&&library.includes("visibleWords.map(w=>")&&library.includes("exampleLookup.get(w.id)"),"Sentences tab must show complete audited corpus");
assert.ok(library.includes("searchBox")&&library.includes("libraryFilters"),"Search and topical filtering must remain");
assert.ok(library.includes("libraryLoadMore")&&library.includes("visibleCount<shown.length"),"Large vocabulary list must paginate on phones");
assert.ok(library.includes("EXAMPLES:Record<string,[string,string][]>"),"Original curated dictionary entries must remain for resolver");
assert.ok(!library.includes("Приклади для цього слова ще готуються."),"Never display outdated coming-soon placeholder");
assert.ok(!library.includes("EXTRA_EXAMPLE_ENGLISH[p[0]]||p[0]"),"Avoid presenting German as an English translation");
assert.ok(!library.includes('mode==="sentences"?ORIGINAL_SENTENCES.length'),"Sentences tab must not show legacy subset count");
assert.ok(resolver.includes("COMPLETE_CARD_EXAMPLES[word.id]")&&resolver.includes("REVIEWED_08F_CORRECTIONS[word.id]"),"Core example priority unchanged");
for(const phrase of ["Приклад недоступний.","речень зі словника Strudli","Показати ще"])
 assert.ok(i18n.includes('"'+phrase+'":'),"Missing dual-language copy: "+phrase);
for(const klass of [".library .sentenceRow",".library .libraryLoadMore",".library .sentenceWordLink:focus-visible"])
 assert.ok(css.includes(klass),"Missing mobile/keyboard-friendly styles");
console.log("Stage 10 dictionary QA PASS: shared resolver serves 1177 DE/UA/EN examples, 47 topics, no coming-soon message, searchable/paginated sentences, audio and bilingual details.");
