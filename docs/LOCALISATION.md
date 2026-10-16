# Localisation: design

Status: proposal, 2026-10-16. Nothing in this document is built. It says what languages, in what order, how, and what it costs to keep up.

## 1. Goal

Let a player choose the language of a game in its settings. The languages are English (the source), Simplified Chinese, Russian, German, Brazilian Portuguese, Spanish and Italian.

Release order of the games, which sets the order of the work: 1940, 1941 and 1914 first, then the fiction titles (Frankenstein, Sherlock), then 1922 (the Russian Civil War) and October 1962 (the Cuban Missile Crisis).

## 2. Where we start

There is no language system in any game. Text is in source files, and in the three big games it sits inside code, in getters that join sentences together according to game flags.

Words of text, counted from string literals and JSON (rough):

| Game | Words | Where the text lives |
|---|---|---|
| 1940 | 237,000 | code (node getters, flag-dependent fragments) |
| 1941 | 117,000 | code |
| 1914 | 109,000 and more | code |
| Sherlock | 61,000 | code |
| 1922 | 59,000 | code |
| Frankenstein | 38,000 | JSON (`events.json`, `flavor.json`) and code |
| October 1962 | 15,000 and more | JSON (`events.json`) and code |

About 650,000 words. Six extra languages is about four million words of translation if everything is translated.

Other facts that matter:
- Fonts are loaded from Google Fonts at run time (`Oswald`, `Courier Prime`, `IBM Plex Mono`, `Caveat`). Courier Prime has no Cyrillic or Chinese. A file:// build (a downloaded zip) cannot load them at all.
- The audits (`check-writing`, `check-pace-text`, `check-outcome-sign`, `check-quotations`) and the 64-run UI baselines read English text.
- Node dates are free text ("OCTOBER – NOVEMBER 1939", "LATE 1943", "WINTER 1943–44"), and the Soviet command adds a Russian-style "Г." to its dates.

## 3. Three levels of translation

| Level | What is translated | Needs |
|---|---|---|
| **Interface** | Menus, settings, buttons, headings, help, glossary labels, the end-screen frame | The language layer (section 4) |
| **Full, data-driven** | Interface and all story text | The layer, plus content already in JSON |
| **Full, code-embedded** | The same, for 1940, 1941, 1914, Sherlock, 1922 | The layer, plus the JSON data migration (`docs/DATA_MIGRATION.md`) first |

A game's settings screen says which level each language has, for example "Interface only; the story is in English". The coverage is data (`coverage: "interface" | "full"` per game and language), not a promise in prose.

## 4. Architecture

### 4.1 A shared package

`packages/i18n`, beside `packages/engine` and `packages/testkit`, used by every game.

- `t(key, params)` returns the text for the current language, then English, then the key.
- `useLanguage()` is the hook that says which language is active and changes it.
- Parameters are written `{name}`. Plurals use `Intl.PluralRules` (Russian needs more than two forms, Chinese none), so a plural is a small table of forms, never a hand-written "s".
- Language codes are BCP 47: `en`, `zh-Hans`, `ru`, `de`, `pt-BR`, `es`, `it`. Each is shown in its own name in the picker (English, 简体中文, Русский, Deutsch, Português (Brasil), Español, Italiano).
- The chosen language lives in the game's settings (a new `language` field; no save schema change, because a save does not hold it). If none is stored, the browser's language is matched to the list, else English. `<html lang>` follows it.

### 4.2 Files

Interface strings, one table per language per game: `src/i18n/<lang>.json`, flat keys such as `menu.continue`, `battle.reserve.title`. The English table is the source and is written by hand. A build step checks the other tables against it.

Story text, once it is data (section 6): one file per language per game, keyed by node id and field, for example `nodes.border41.situation` and `nodes.border41.choices.0.label`.

Each translation entry carries:

```json
{ "text": "…", "src": "<hash of the English it was made from>", "review": "machine | reviewed" }
```

### 4.3 Missing and stale text

- **Missing** (no entry): show the English. Nothing breaks.
- **Stale** (the English has changed since): show the existing translation, and list it in the report. A stale line is usually still close, and a blank is worse.
- **Unreviewed**: shown, and the settings screen labels the language "machine translated, unreviewed" until a reviewer has marked a game's text reviewed.

### 4.4 Text that is joined from fragments

This is the main authoring rule. A situation report that joins sentences according to flags is fine, as long as each piece is a whole sentence or paragraph and the pieces are joined by the game, not inside a sentence. Anything that builds one sentence from fragments (a name, a verb, a number, a flag-dependent clause) cannot be translated into Russian or German and must be rewritten as named variants:

```
situation.base
situation.ifForkBarbarossaDelay
situation.ifReadinessHigh
```

`check-i18n` flags the patterns it can recognise (a template string with a flag test in the middle of a sentence).

### 4.5 Dates and numbers

- Interface dates and numbers go through `Intl`.
- Node dates become structured data (`{ from, to, label }` or a season), so the display is generated per language and the map and pace code stop parsing English month names. The Soviet "Г." belongs only to Russian.

### 4.6 Names and terms

One glossary per language per game (`Wehrmacht`, `Stavka`, ranks, ship classes, operation names). A name is translated or transliterated once, in the glossary, and a check finds any other spelling in the text. The in-game glossary feature reads the same file.

### 4.7 Quotations

A quotation attributed to a real person or book is never machine-translated. Where a published translation exists in the public domain it is used and cited; otherwise the line is marked "translated from the English" and the register (`claims/quotations.json`) records that it is a rendering. `check-quotations` verifies the English against its source and the translation against its cited edition.

### 4.8 Fonts

- Per-language font stacks, with `lang`-aware fallbacks.
- Cyrillic: Oswald and IBM Plex Mono have it; Courier Prime does not, so the body face falls back to a Cyrillic monospace serif (PT Mono or IBM Plex Mono).
- Chinese: a subsetted Noto face (web build, by unicode range) and a system stack (`PingFang SC`, `Microsoft YaHei`, `Noto Sans CJK SC`).
- A file:// build cannot fetch web fonts, so those builds ship a bundled subset for each language they include. Size of this is the open item in section 9.

### 4.9 Typewriter, line breaks and text size

The typewriter reveal moves by grapheme (`Intl.Segmenter`), at a per-language speed (Chinese characters carry more than Latin ones). Chinese lines break between characters; the others break at words. Text size and the dyslexia-friendly option are checked on every language.

### 4.10 Size and loading

The interface tables are small (tens of kilobytes) and go in the bundle. Story text is large (the 1940 text is about 1.5 MB per language), so it loads on demand, per language. A downloaded file:// build cannot fetch, so it ships the story text as separate script files that the page loads by tag; the itch web builds can fetch.

## 5. Tests and checks

- **`check-i18n`** (in `test:fast`): every key exists in English, no table has a key English lacks, placeholders match, plural forms are complete, and the stale, missing and unreviewed counts are printed per language.
- **Baselines stay English-only.** The 64-run UI baseline and the audits read English. Running them per language would multiply CI time by seven.
- **A per-language smoke test**: `tools/playthrough.mjs` gains a `LANG` setting and plays one campaign per game per language to an ending, with the axe, console and stall checks. This catches a broken table, a missing glyph or an overflowing layout.
- **Language-specific style rules.** The "no em dashes" rule in `docs/WRITING.md` is a rule for English text; Russian punctuation uses the dash. `check-writing` becomes per-language.
- The checks that read English text (`check-pace-text`, `check-outcome-sign`) keep reading the English source.

## 6. Data migration

The three big games and Sherlock cannot be translated at the full level until their text is data. That is the work already described in `docs/DATA_MIGRATION.md`, with one addition: the extractor must split flag-dependent fragments into named variants (section 4.4) and turn node dates into structured fields (section 4.5). This is the largest single cost, and it is worth doing for its own sake, because it makes every audit simpler.

## 7. Sequence

| Phase | When | Work | Size |
|---|---|---|---|
| **0. Layer** | Before the releases | `packages/i18n`, the Language picker in settings, the stale check, fonts, the smoke test; interface of 1940 as the pilot, then 1941 and 1914; translate the interface in all six languages | about 3 to 4 sessions |
| **1. Big three, story text** | After release, content frozen | Data migration of 1940, 1941 and 1914; story translation, first in the languages that match the sides (1940: German for OKW, Russian for STAVKA, Italian for the Italian command), then the rest | several weeks, with native review |
| **2. Fiction titles** | After phase 1 starts | Frankenstein (data already), Sherlock (migration first); public-domain translations for the quotations | 2 to 3 sessions each |
| **3. 1922 and October 1962** | Last | Full translation; Russian first for 1922 | about 1 to 2 sessions each |

The layer in phase 0 is the only part that has to come before the releases. If it is built later, the interface strings have to be extracted from the three big games a second time.

## 8. Keeping it up as the games change

| Kind of change | Extra work |
|---|---|
| A new button, label or help line | A few seconds of translation in the same PR, and about 5 to 10% on a feature |
| A content PR in a fully translated game | Roughly double. A 5,000 word PR is about 30,000 words of translation, plus review |
| A fact correction | The same correction in each language |

How to hold the cost down:
1. English is the source of truth; every translation records the English it came from (section 4.2).
2. Translate in batches before a release, not in each PR. A PR carries English and the "needs translation" count the check prints.
3. Translate a content change only after it has stopped changing.
4. Keep the baselines and audits English-only (section 5).
5. Write new text so that it can be translated (section 4.4).

For the three big games the sensible policy is to translate the story only once the content has stopped changing, because each later edit costs a round of translation and review in six languages.

## 9. Open decisions

1. **Which story languages first for 1940, 1941, 1914**, and whether 1941's sides (Japan, United States) change that list.
2. **Reviewers.** Native readers for each language, and what counts as "reviewed" (a name and a date on the file).
3. **Unreviewed text.** Ship it labelled "machine translated, unreviewed", or hold it back until reviewed.
4. **Interface-only languages.** Whether to ship them as a language choice at all, with the "story in English" note.
5. **Fonts in downloaded builds.** Bundle a subset per language (adds size to every download), ship one build per language group, or rely on system fonts for Chinese only.
6. **Data migration timing for Sherlock and 1922**, since neither is on the first release list.
7. **Store pages.** The itch descriptions are written separately and are not covered here.

## 10. What done looks like, for phase 0

- A Language row in settings in every game, listing the seven languages in their own names, with the coverage note.
- The choice persists and applies to the whole interface, including help, glossary labels and the end screen.
- `check-i18n` in `test:fast` and green; the per-language smoke test green in CI for all seven languages on 1940.
- Cyrillic and Chinese render in a real browser, in a downloaded (file://) build as well as the web build.
- No change to a save, and the English baselines are identical.
