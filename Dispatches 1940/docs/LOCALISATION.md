# Localisation of Dispatches 1940

The interface of the game (its buttons, labels, settings, map legends, the line of conditions under a report, the Order of Battle screens, the share card) can be read in seven languages: English, Simplified Chinese (zh-Hans), Russian (ru), German (de), Brazilian Portuguese (pt-BR), Spanish (es) and Italian (it). The language is chosen on the opening screen and kept in `localStorage` (`dispatches1940_language`); the first visit follows the browser's language.

## What is translated, and what is not

Translated: everything that belongs to the interface.

Not translated, on purpose: the writing of the game itself. The reports (situations, orders, outcomes), the advisers' words, the dossiers, the claims, the notes on the map (the lines of what the commands were doing, the ground against the record, the guns of the great bombardments), the beliefs of the staff's reading and the names of the commands' own documents stay in English. They are the work of a writer and a fact-checker, they change every few weeks, and a machine translation of them would be worse than none. A translator who wants to take them on should start with `claims/`, which says what each statement rests on.

## How it works

`packages/i18n` (shared by the games) holds the language layer: `t("text", { params })` returns the text in the current language, `T("text")` marks a text for the tables without translating it (for texts held in data tables and translated where they are shown, as `t(label)`), and plurals are written in the ICU form (`{n, plural, one {war} other {wars}}`). The English text is the key: there is no table for English.

`src/i18n/<lang>.json` maps a text to its translation. `node tools/i18n.mjs` checks them:

- a text of the interface with no translation (a warning; `--require-complete` makes it an error, and `test:fast` uses it);
- a table entry for a text that no longer exists (stale);
- a translation whose `{placeholders}` differ from the English, or a plural without an `other` form;
- a `t()` call whose first argument is not a plain string (it could not be translated).

`--list` prints every text, `--sync` adds the missing texts to each table with an empty translation, `--dump keys.json` and `--apply <lang> values.json keys.json` are for writing translations in bulk.

## Adding or changing text

1. Write the English in `t("...")` (in JSX the text is `{t("...")}`; in a data table use `T("...")` and `t(value)` where it is shown).
2. Run `node tools/i18n.mjs --sync`, fill in the six tables, run `node tools/i18n.mjs` and `npm run check-i18n`.
3. Texts built from pieces must be one text with placeholders (`t("{a} of {b}", { a, b })`), never `t("a") + t("of") + t("b")`: word order differs between languages.
4. The register: Sie in German, tu or tú in Italian and Spanish, você in Brazilian Portuguese, вы in Russian, 你 in Chinese. The names of places and of the commands' own bodies follow the usual form in each language (Moskau, Mosca, 莫斯科); the German, Russian and Italian names of a command's documents (Lagebericht, Оперсводка, Bollettino) stay as they are.

## Looking for text that was missed

`I18N_LANG=pseudo node tools/playthrough.mjs` plays the game in a pseudo-language that marks every text that goes through `t()`: whatever is not marked in the output was missed. `I18N_LANG=de` plays in a real language.

## Known limits

- The report texts are English in every language (above). The interface around them is translated.
- The share card is drawn with system fonts only; a language whose characters the system lacks will show boxes there.
- The dyslexia-friendly typeface is for Latin and Cyrillic text.
