# Dispatches 1940 (WWII: OKW, STAVKA, SHAEF, Comando Supremo)

React 19 + Tone.js, esbuild + Tailwind v4. Four campaigns, 250 nodes, Easy / Standard / hard modes (Führer, Purge, Coalition, Axis), region map, wire bulletins, Historical Divergence forks, and the Key Battle (Order of Battle) subgame. Two build variants: `full` and `demo`. Assets: `assets/theme.mp3` (inlined into the bundle as a data URL), `assets/maps/` (region geometry JSON plus placeholder PNGs).

## Layout
- `src/App.jsx` (~23.6k lines, 1.9 MB): `CAMPAIGNS` (lines ~70-14000, node getters that read `flags`/`meters`), then maps, screens, the battle subgame, and `WW2CommandInner` (the run state machine near the end). **Never read it whole.** Grep and ranged Read only.
- `src/logic.ts` the pure run logic (typed; no React/DOM/storage/sound/`Math.random`): choice resolution (roll, battle nudge, plan costs, flags, hard-mode ceilings, meters), log entry, next position, divergence-fork arrival, Führer-mode necessity rule. App.jsx calls it. Content is passed in, never imported.
- `src/main.jsx`, `src/tailwind.css`, `build.mjs` build. `tools/` data audits (`npm run audit`), `tools/extract_campaigns.js` (loads CAMPAIGNS in Node), `tools/ui_differential.mjs` (behaviour baseline). `tests/baseline/ui/` recorded runs from the pre-refactor build. `docs/` devlog, specs, reports.

## Commands
- `npm run build:nozip` writes `dist/full` and `dist/demo`. `npm run build` also zips into `builds/` and needs the `zip` CLI (absent on stock Windows).
- `npm run audit` all data audits (reachability, advisor dates, pace text, outcome sign, battle balance, claims). Run before and after content changes.
- `npm run typecheck` checks `src/logic.ts` (App.jsx is untyped).
- `npm run verify:baseline` plays 48 seeded runs (4 campaigns x easy/standard/hard x 4 seeds) headlessly in jsdom through `dist/full/bundle.js`, hashes the page after every click and compares with `tests/baseline/ui`. Slow (roughly 15-25 minutes: every run loads the 7 MB bundle). Build first. Must report 0 failures.
- `TRACE=1 node tools/ui_differential.mjs one <german|soviet|allied|italy> <easy|open|hard> <seed>` prints one run step by step.

## Rules
- Game decisions go through `src/logic.ts`, not inline in the component.
- `modWeight` and the other helpers CAMPAIGNS calls stay defined in App.jsx above the screens; `tools/extract_campaigns.js` transpiles the whole file with stubs. Imports in App.jsx must stay single-line (the extractor strips single-line imports only), and any new asset import needs a stub in the extractor's prelude (the music data URL and map JSON are stubbed there).
- `Math.random` call sites: the roll in `chooseOption`, `rollDivergenceForks`, battle simulation. Call order is part of the recorded behaviour.
- A deliberate behaviour change means re-recording the baseline (rebuild the old version from git history, record, then record the new one) and saying so.
- Legacy build for comparisons: `src/App.jsx` at the import commit (`git log -- "Dispatches 1940/src/App.jsx"`), built with this folder's `build.mjs`.

## Known legacy behaviour
- FIXED: the outcome screen and `proceed()` looked up the player's choice in a stage re-resolved AFTER the choice applied its impact. When that changes the choice list (a meter-gated choice appears or disappears), the index points at a different choice: the game showed another choice's outcome text and could route by it. Seen in the baseline: `allied-hard-2` clicked "Press Stalin hard on free Polish elections" and was shown the outcome of "Accept the ambiguous language". The same defect crashed the shipped 1941 when the index fell off the end of the list; no crash occurred in these 48 runs, but the code path is the same. The stage is now snapshotted at choice time (`outcomeStage`/`seenStage`), used only when the live list no longer holds the picked choice, so all other runs are byte-identical.
- Documented in `tests/baseline/known-diffs.json`: `allied-hard-2` is the one baseline run allowed to differ (from step 85). Any new difference fails `verify:baseline`.
- FIXED (tooling): `tools/extract_campaigns.js` had stopped working (`THEME_MUSIC_DATA_URL is not defined`) once the music import was added, so the audits that need it could not run. Stubbed in the extractor. All five audits give identical output on the old and new source.
- FIXED (tooling): `build.mjs` ran the Tailwind `.bin` shim (fails on Windows) and required the `zip` CLI; it now runs Tailwind through node and accepts `--no-zip`.
- KEPT: the after-action log's roll odds can differ slightly from what the player faced when the snapshot is not needed (built from the stage re-resolved after the impact).
- The shipped `builds/*.zip` are older than this source and not reproducible byte-for-byte.
