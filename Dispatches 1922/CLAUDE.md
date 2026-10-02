# Dispatches 1922 (Russian Civil War)

React 18 + Tailwind 3, esbuild. Four campaigns (`provisionalGov17`, `southRussia`, `siberia`, `bolsheviks`), hard modes ("capital" spending), front map, discovery log, single-slot save. Ships as one HTML file.

## Layout
- `src/App.jsx` (~8.9k lines, 700 KB): `CAMPAIGNS` and engine helpers first (everything above the `// PREVIEW SCREENS` marker), then screens and `App()`. **Never read it whole**; Grep and ranged Read. Node text/choices/weights are code that reads `flags` and `meters`.
- `src/logic.ts` pure run logic: `resolveChoice` (roll, impact, clamp, capital, destination) and `afterOutcome` (where Continue goes). No React/DOM/storage/`Math.random`.
- `src/main.jsx`, `src/input.css`, `src/prelude.html`, `build.mjs` build. `tools/` validators (`check-*.js`, `walk-historical.js`, `monte-carlo.mjs`) and `tools/ui_differential.mjs`. `tests/*.js` older jsdom behaviour tests (need `bundle_test.js` = a copy of `dist/bundle.js` in the project root). `tests/baseline/ui/` recorded runs from the pre-refactor build.
- `HANDOVER.md`, `VALIDATION_REPORT.md`, `CIVILWAR_EXPANSION_PLAN.md`, `IMPROVEMENT_RECOMMENDATIONS.md` content/history notes.

## Editing surface: src/parts/ (not src/App.jsx)
`src/App.jsx` is an assembled artifact (the validators, extractors and baselines read it). Edit the parts in `src/parts/`: `00-head-and-helpers`, one file per campaign (`10-campaign-southrussia`, `11-campaign-siberia`, `12-campaign-bolsheviks`, `13-campaign-provisionalgov17`), `20-data-exports`, `30-screens` (starts at the `// PREVIEW SCREENS` marker), `40-app`. A session that touches one campaign needs that one part plus this file.
- `npm run build` assembles the parts into `src/App.jsx` first, and refuses if `src/App.jsx` is newer than every part (you edited the artifact by hand). Run `npm run split` to push such an edit back into the parts, or revert it.
- `npm run assemble` / `npm run roundtrip` (proves split then assemble is byte-identical) are available on their own. The split points live in `split.config.json`; the tool is `../packages/testkit/src/split.mjs`.
- Both the parts and the artifact are committed.

## Commands
- `npm run build` writes `dist/index.html` (single playable file), `dist/bundle.js`, `dist/output.css`.
- `npm run check` all data validators (flag values, continuity, advisor coverage, gates, bulletins, historical spine). Run before and after any content change.
- `npm run typecheck` checks `src/logic.ts` (App.jsx is untyped).
- `npm run verify:baseline` plays 48 seeded runs headlessly (jsdom, ~80 s) through the built bundle and compares every step's page hash to `tests/baseline/ui`. Must report 0 failures. Build first.
- `node tools/ui_differential.mjs one <campaignId> <open|hard> <seed>` with `TRACE=1` prints a step trace for one run.

## Rules
- Keep `modWeight`, `meterPct`, `applyImpact`, `clampTriangle`, `resolveNode` defined above the `// PREVIEW SCREENS` marker: the validators and `monte-carlo.mjs` evaluate only that part of the file. `logic.ts` receives `applyImpact`/`clampTriangle` by injection for that reason.
- `Math.random` is called once per uncertain choice, in `handleChoose`. Call order is part of the recorded behaviour.
- A deliberate behaviour change means re-recording the baseline (rebuild the old version from git history, `record legacy`, then the new one) and saying so.
- Legacy build for comparisons: `dispatches-1917.jsx` at commit `3352724`-era import; the baseline was recorded from it built with this folder's `build.mjs`.

## Known legacy behaviour
- FIXED: a rolled outcome's own `next` was ignored. Effects: `provisionalGov17/kornilovAffair17` (choice with no `next`) routed to `undefined` and crashed ("Cannot read properties of null (reading 'date')", 4 of 48 recorded runs), and two authored endings were unreachable: `southRussia/afterEkaterinodar18` roll to `endingTheArmyThatDidNotComeBack18` and `siberia/irkutskUltimatum20` roll to `endingTheAdmiralAtIrkutsk20`. Roll outcomes now route to their own `next` (same rule as 1914/1941/1940). `tests/routing.test.mjs` forces every such outcome and checks the destination (it fails on the old logic). The seeded UI baseline does not reach those two nodes, so it stays 44 identical + 4 crashes fixed. `tools/monte-carlo.mjs` now drives the real `src/logic.ts` (random play, seeded): `node tools/monte-carlo.mjs 3000 [--hard]` prints gate-bite rate and which endings were reached or never reached. Both formerly unreachable endings are reached.
- Audio toggles in Settings are labelled "not yet wired" and are not.
- `geo/` (map generation pipeline) was not exported; the baked map data lives inside `App.jsx`.

## Changing behaviour (details: ../docs/WORKFLOW.md)
- After any change run `npm run test:fast`. When `verify:baseline` fails: if it is a bug you introduced, fix the code; if the change is intended, read the reported differences, run `npm run baseline:accept`, and commit the new baseline together with the change and a line in `CHANGELOG.md`. A fix of a legacy bug that the old build got wrong goes in `tests/baseline/known-diffs.json` instead (first differing step plus a one-line reason).
- Saves: `npm run test:saves` loads the committed old saves in `tests/saves/` into the current build and presses RESUME COMMAND; they must restore the same screen. Never re-record them to make a failure pass: write a migration so old saves still load.
- Balance and ending reachability: `npm run monte-carlo` (seeded random play on the real `src/logic.ts`).
- Real-browser check (from the repo root, after building): `npm run smoke:browser`. Known layout findings are listed in `tests/browser-allowlist.json`.
