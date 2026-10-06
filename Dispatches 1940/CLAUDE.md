# Dispatches 1940 (WWII: OKW, STAVKA, SHAEF, Comando Supremo)

React 19 + Tone.js, esbuild + Tailwind v4. Four campaigns, 250 nodes, Easy / Standard / hard modes (Führer, Purge, Coalition, Axis), region map, wire bulletins, Historical Divergence forks, and the Key Battle (Order of Battle) subgame. Two build variants: `full` and `demo`. Assets: `assets/theme.mp3` (inlined into the bundle as a data URL), `assets/maps/` (region geometry JSON plus placeholder PNGs).

## Layout
- `src/App.jsx` (~23.6k lines, 1.9 MB): `CAMPAIGNS` (lines ~70-14000, node getters that read `flags`/`meters`), then maps, screens, the battle subgame, and `WW2CommandInner` (the run state machine near the end). **Never read it whole.** Grep and ranged Read only.
- `src/logic.ts` the pure run logic (typed; no React/DOM/storage/sound/`Math.random`): choice resolution (roll, battle nudge, plan costs, flags, hard-mode ceilings, meters), log entry, next position, divergence-fork arrival, Führer-mode necessity rule. App.jsx calls it. Content is passed in, never imported.
- `src/main.jsx`, `src/tailwind.css`, `build.mjs` build. `tools/` data audits (`npm run audit`), `tools/extract_campaigns.js` (loads CAMPAIGNS in Node), `tests/ui.config.mjs` (config for the shared headless driver in `../packages/testkit`). `tests/baseline/ui/` recorded runs from the pre-refactor build. `docs/` devlog, specs, reports.

## Editing surface: src/parts/ (not src/App.jsx)
`src/App.jsx` is an assembled artifact (the validators, extractors and baselines read it). Edit the parts in `src/parts/`: `00-head`, one file per campaign (`10-campaign-german`, `11-campaign-soviet`, `12-campaign-allied`, `13-campaign-italy`), `20-registries-and-gallery`, `25-battle-subgame`, `30-warroom-and-maps`, `40-select-briefing-end-screens`, `45-dossiers-objectives`, `50-app`. A session that touches one campaign needs that one part plus this file.
- `npm run build` assembles the parts into `src/App.jsx` first, and refuses if `src/App.jsx` is newer than every part (you edited the artifact by hand). Run `npm run split` to push such an edit back into the parts, or revert it.
- `npm run assemble` / `npm run roundtrip` (proves split then assemble is byte-identical) are available on their own. The split points live in `split.config.json`; the tool is `../packages/testkit/src/split.mjs`.
- Both the parts and the artifact are committed.

## Commands
- `npm run build:nozip` writes `dist/full` and `dist/demo`. `npm run build` also zips into `builds/` and needs the `zip` CLI (absent on stock Windows).
- `npm run audit` all data audits (reachability, advisor dates, pace text, outcome sign, battle balance, Matériel strands, quotations, claims). Run before and after content changes.
- `npm run typecheck` checks `src/logic.ts` (App.jsx is untyped).
- `npm run verify:baseline` plays 48 seeded runs (4 campaigns x easy/standard/hard x 4 seeds) headlessly in jsdom through `dist/full/bundle.js`, hashes the page after every click and compares with `tests/baseline/ui`. Roughly 4 minutes on Linux, 8 on Windows (every run loads the 7 MB bundle). Build first. Must report 0 failures.
- `TRACE=1 node ../packages/testkit/src/cli.mjs one <german|soviet|allied|italy>-<easy|open|hard> <seed>` prints one run step by step; `DUMP_STEP=<i>` prints the full page text after click i (diff two builds with `BUNDLE=<path>`).

- Advisers carry `position` (what the named person argued, in the third person), never invented speech. A real quotation goes in `attested: { by, text, source }` on the same choice (shown in speech marks instead of the position) and in `claims/quotations.json`; `npm run check-quotations` enforces it.
- `npm run test:battle-resume` plays to a battle, saves from the planning screen and the report, resumes in fresh pages and checks the screens come back identical (run after a build).

## Rules
- Game decisions go through `src/logic.ts`, not inline in the component.
- `modWeight` and the other helpers CAMPAIGNS calls stay defined in App.jsx above the screens; `tools/extract_campaigns.js` transpiles the whole file with stubs. Imports in App.jsx must stay single-line (the extractor strips single-line imports only), and any new asset import needs a stub in the extractor's prelude (the music data URL and map JSON are stubbed there).
- `Math.random` call sites: the roll in `chooseOption`, `rollDivergenceForks`, battle simulation. Call order is part of the recorded behaviour.
- A deliberate behaviour change means re-recording the baseline (rebuild the old version from git history, record, then record the new one) and saying so.
- Legacy build for comparisons: `src/App.jsx` at the import commit (`git log -- "Dispatches 1940/src/App.jsx"`), built with this folder's `build.mjs`.

## Known legacy behaviour
- FIXED: the outcome screen and `proceed()` looked up the player's choice in a stage re-resolved AFTER the choice applied its impact. When that changes the choice list (a meter-gated choice appears or disappears), the index points at a different choice: the game showed another choice's outcome text and routed by it. Seen: `allied-hard-2` clicked "Press Stalin hard on free Polish elections" and was shown the outcome of "Accept the ambiguous language". The same defect crashed the shipped 1941 when the index fell off the end of the list. `proceed()` now always reads a snapshot of the stage the player faced (`outcomeStage`/`seenStage`), and the outcome screen uses the live stage as before unless it no longer holds the picked choice (`displayStage`).
- FIXED (decided 2026-10): the after-action log is built from that snapshot, so the end screen's "compound likelihood" odds and the log-derived figures are what the player actually faced (legacy computed them from the stage re-resolved after the choice moved the meters). Roll-odds reveals shown on the outcome screen itself are unchanged.
- Baseline was re-recorded once for these two changes. Evidence: with percentages and parenthesised counts masked, 43 of 48 legacy runs are identical to the new build; the other 5 are the one wrong-choice run (`allied-hard-2`, from step 85) and 3 German runs whose only difference is a decimal odds figure the mask missed (~6.7% vs ~5.8%). `tests/baseline/ui` is now the new build's behaviour.
- The 1940 `logic.ts` calls the engine's campaign primitives (`packages/engine/src/campaign.ts`); `packages/engine/tests/campaign-equivalence.test.mjs` proves they match this game's own rules.
- FIXED (tooling): `tools/extract_campaigns.js` had stopped working (`THEME_MUSIC_DATA_URL is not defined`) once the music import was added, so the audits that need it could not run. Stubbed in the extractor. All five audits give identical output on the old and new source.
- FIXED (tooling): `build.mjs` ran the Tailwind `.bin` shim (fails on Windows) and required the `zip` CLI; it now runs Tailwind through node and accepts `--no-zip`.
- The shipped `builds/*.zip` are older than this source and not reproducible byte-for-byte.

## Changing behaviour (details: ../docs/WORKFLOW.md)
- After any change run `npm run test:fast`. When `verify:baseline` fails: if it is a bug you introduced, fix the code; if the change is intended, read the reported differences, run `npm run baseline:accept`, and commit the new baseline together with the change and a line in `CHANGELOG.md`. A fix of a legacy bug that the old build got wrong goes in `tests/baseline/known-diffs.json` instead (first differing step plus a one-line reason).
- Saves: the run and war record are written to `ww2-command-active` / `ww2-command-record` through `window.storage`, which `src/parts/00-head.jsx` defines on top of localStorage (it only exists natively in Claude's artifact environment; before this was added, nothing saved on itch.io or Windows). `SAVE_VERSION`, `NODE_ALIASES`, `SAVE_MIGRATIONS` and `migrateSave` follow docs/SAVES.md; `npm run test:saves` and `npm run test:migration` guard them.
- Real-browser check (from the repo root, after building): `npm run smoke:browser`. Known layout findings are listed in `tests/browser-allowlist.json`.
