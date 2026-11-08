#!/usr/bin/env node
// The translations of this game's interface (docs/LOCALISATION.md).
//
//   node tools/i18n.mjs                 print what is missing, stale or wrong in each language, and exit 1 if anything is wrong
//   node tools/i18n.mjs --sync          add the texts that are missing from each table, with an empty translation, in source order
//   node tools/i18n.mjs --require-complete   also fail when a text has no translation (used by test:fast once a language is complete)
//   node tools/i18n.mjs --list          print every text of the interface, one per line
//
// The English text is the key: every t("...") and T("...") in src/parts/*.jsx is a text of the interface, and each file src/i18n/<lang>.json maps
// a text to its translation. A text that is edited in English becomes a new key; the old one is listed as stale until it is removed.
// The check finds: a translation that is empty or missing (a warning, or an error with --require-complete), a table entry for a text that no
// longer exists (stale), a translation whose {placeholders} differ from the English, a plural without an "other" form, and a t() call whose
// first argument is not a plain string (it could not be translated).
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PARTS = join(ROOT, "src", "parts");
const I18N = join(ROOT, "src", "i18n");
const LANGS = ["zh-Hans", "ru", "de", "pt-BR", "es", "it"];
const args = new Set(process.argv.slice(2));

/** Every text of the interface, in source order: the first argument of t(...) and T(...) when it is a double-quoted string. */
export function sourceTexts() {
  const found = new Map();
  const bad = [];
  const files = [...readdirSync(PARTS).filter((f) => f.endsWith(".jsx")).sort().map((f) => [f, join(PARTS, f)]), ["logic.ts", join(ROOT, "src", "logic.ts")]];
  for (const [file, path] of files) {
    const src = readFileSync(path, "utf8");
    const re = /(?<![A-Za-z0-9_$.])[tT]\(\s*("(?:[^"\\\n]|\\.)*"|[^"\s)][^)]{0,40})/g;
    let m;
    while ((m = re.exec(src))) {
      const arg = m[1];
      const line = src.slice(0, m.index).split("\n").length;
      if (arg.startsWith('"')) {
        const text = JSON.parse(arg);
        if (!found.has(text)) found.set(text, `${file}:${line}`);
      } else if (/^(?:`|\w+\s*=>)/.test(arg) || arg.startsWith("`")) bad.push(`${file}:${line}: t(${arg.slice(0, 30)}) is not a plain string`);
    }
  }
  return { found, bad };
}

const holes = (s) => {
  // the {names} of a message: a plain {name} or the variable of a {name, plural, ...} (the words inside its forms are text, not names)
  const names = new Set();
  let depth = 0, start = -1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (s[i] === "}" && depth > 0) {
      depth--;
      if (depth === 0) {
        const body = s.slice(start + 1, i);
        const m = body.match(/^\s*([A-Za-z_]\w*)\s*(?:,|$)/);
        if (m) names.add(m[1]);
        if (/,\s*plural\b/.test(body)) for (const f of body.matchAll(/\{([^{}]*)\}/g)) for (const n of holes(f[1].replace(/#/g, ""))) names.add(n);
      }
    }
  }
  return names;
};
const pluralOk = (s) => !/plural/.test(s) || /other\s*\{/.test(s);

const { found, bad } = sourceTexts();
if (args.has("--list")) {
  for (const t of found.keys()) console.log(t);
  process.exit(0);
}
// --dump keys.json writes the texts as an array; --apply <lang> values.json keys.json writes values[i] as the translation of keys[i]
if (args.has("--dump")) {
  writeFileSync(process.argv[process.argv.indexOf("--dump") + 1], JSON.stringify([...found.keys()], null, 1));
  process.exit(0);
}
if (args.has("--apply")) {
  const i = process.argv.indexOf("--apply");
  const [lang, valuesPath, keysPath] = process.argv.slice(i + 1, i + 4);
  const keys = JSON.parse(readFileSync(keysPath, "utf8"));
  const values = JSON.parse(readFileSync(valuesPath, "utf8"));
  if (!Array.isArray(values) || (!Array.isArray(values[0]) && values.length !== keys.length)) {
    console.error("values must be an array of the same length as the keys: " + (values.length || "not an array") + " against " + keys.length);
    process.exit(1);
  }
  const path = join(I18N, lang + ".json");
  const table = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
  // values is an array of translations in the order of the keys, or an array of [index, translation] pairs
  if (values.length && Array.isArray(values[0])) for (const [n, v] of values) { if (keys[n] !== undefined && v) table[keys[n]] = v; }
  else keys.forEach((k, n) => { if (values[n]) table[k] = values[n]; });
  writeFileSync(path, JSON.stringify(table, null, 2) + "\n");
  console.log(lang + ": " + Object.keys(table).filter((k) => table[k]).length + " texts in the table");
  process.exit(0);
}
const problems = [];
const notes = [];
for (const b of bad) problems.push(b);
for (const lang of LANGS) {
  const path = join(I18N, lang + ".json");
  const table = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
  let missing = 0;
  const stale = [];
  for (const [text, at] of found) {
    const v = table[text];
    if (v === undefined || v === "") {
      missing++;
      continue;
    }
    const a = [...holes(text)].sort().join(","), b2 = [...holes(v)].sort().join(",");
    if (a !== b2) problems.push(`${lang}: placeholders differ in "${text.slice(0, 60)}" (${at}): English {${a}} against {${b2}}`);
    if (!pluralOk(v)) problems.push(`${lang}: a plural has no "other" form in "${text.slice(0, 60)}"`);
  }
  for (const key of Object.keys(table)) if (!found.has(key.replace(/^[^|]*\|(?=.)/, "")) && !found.has(key)) stale.push(key);
  if (args.has("--sync")) {
    const next = {};
    for (const text of found.keys()) next[text] = table[text] !== undefined ? table[text] : "";
    for (const key of stale) next[key] = table[key];
    writeFileSync(path, JSON.stringify(next, null, 2) + "\n");
  }
  notes.push(`${lang}: ${found.size - missing} of ${found.size} texts translated${stale.length ? `, ${stale.length} stale` : ""}`);
  if (stale.length) for (const k of stale.slice(0, 5)) problems.push(`${lang}: stale entry "${k.slice(0, 70)}" (the English has changed or gone)`);
  if (missing && args.has("--require-complete")) problems.push(`${lang}: ${missing} text(s) have no translation`);
}
console.log(`i18n: ${found.size} texts in the interface`);
for (const n of notes) console.log("  " + n);
if (problems.length) {
  console.error(`\n${problems.length} problem(s)`);
  for (const p of problems.slice(0, 60)) console.error("  " + p);
  process.exit(1);
}
console.log("The tables are well formed.");
