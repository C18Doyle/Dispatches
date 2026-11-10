// Checks of the language layer: fallback to English, parameters, plurals in languages with different rules, language matching.
// Run: node packages/i18n/tests/i18n.test.mjs
import { t, T, setLanguage, registerTables, matchLanguage, format, getLanguage, hasLanguage, LANGUAGES, subscribe } from "../src/index.js";

const fails = [];
const check = (ok, what) => {
  if (!ok) fails.push(what);
  console.log((ok ? "ok   " : "FAIL ") + what);
};

registerTables({
  ru: { Continue: "Продолжить", "{n, plural, one {# war} other {# wars}} fought": "{n, plural, one {Проведена # война} few {Проведено # войны} many {Проведено # войн} other {Проведено # войны}}", "map|Close": "Закрыть карту", Close: "Закрыть" },
  "zh-Hans": { Continue: "继续", "{n, plural, one {# war} other {# wars}} fought": "{n, plural, other {已进行 # 场战争}}" },
  de: { "{n} situation reports discovered": "{n} Lageberichte entdeckt" },
});

check(t("Continue") === "Continue" && getLanguage() === "en", "English is the key, and the default");
setLanguage("ru", { persist: false });
check(t("Continue") === "Продолжить", "a table entry is used in its language");
check(t("Not in the table") === "Not in the table", "a message with no entry falls back to English");
check(t("Close") === "Закрыть" && t("Close", { context: "map" }) === "Закрыть карту", "a context picks its own entry, else the plain one");
const P = "{n, plural, one {# war} other {# wars}} fought";
check([1, 2, 5, 11, 21, 22].map((n) => t(P, { n })).join("|") === "Проведена 1 война|Проведено 2 войны|Проведено 5 войн|Проведено 11 войн|Проведена 21 война|Проведено 22 войны", "Russian plurals follow Intl.PluralRules (one, few, many)");
setLanguage("zh-Hans", { persist: false });
check(t(P, { n: 3 }) === "已进行 3 场战争", "Chinese has one plural form");
setLanguage("en", { persist: false });
check(t(P, { n: 1 }) === "1 war fought" && t(P, { n: 3 }) === "3 wars fought", "English plurals");
setLanguage("de", { persist: false });
check(t("{n} situation reports discovered", { n: 12 }) === "12 Lageberichte entdeckt", "a parameter is filled in the translation");
setLanguage("en", { persist: false });
check(t("{n} situation reports discovered", { n: 12 }) === "12 situation reports discovered", "and in English");
check(t("Hello {missing}", {}) === "Hello {missing}", "a missing parameter is left as written");
check(format("{a} and {b}", { a: 1, b: "x" }) === "1 and x", "several parameters");
check(format("{a}x{b}", { a: false, b: true }) === "x", "a false or true parameter is nothing, as in JSX (a condition and a text)");
check(T("kept") === "kept", "T marks a string and returns it");
check(matchLanguage(["de-AT"]) === "de" && matchLanguage(["zh-CN"]) === "zh-Hans" && matchLanguage(["pt-PT"]) === "pt-BR" && matchLanguage(["pt-br"]) === "pt-BR" && matchLanguage(["fr", "es-MX"]) === "es" && matchLanguage(["ja"]) === "en" && matchLanguage([]) === "en", "the browser's language is matched to ours");
check(!hasLanguage("fr") && hasLanguage("it") && LANGUAGES.length === 7, "seven languages");
let heard = 0;
const off = subscribe(() => heard++);
setLanguage("it", { persist: false });
setLanguage("it", { persist: false });
setLanguage("xx", { persist: false });
off();
check(heard === 2 && getLanguage() === "en", "listeners hear each change once, and an unknown language becomes English");

if (fails.length) {
  console.log(`\n${fails.length} check(s) failed`);
  process.exit(1);
}
console.log("\ni18n: all checks passed");
