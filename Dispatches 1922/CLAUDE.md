# Dispatches 1922 (Russian Civil War)

React 18 + Tailwind 3, esbuild. Four campaigns (`provisionalGov17`, `southRussia`, `siberia`, `bolsheviks`), hard modes ("capital" spending), front map, discovery log, single-slot save. Ships as one HTML file.

## Layout
- `src/App.jsx` (~8.9k lines, 700 KB): `CAMPAIGNS` and engine helpers first (everything above the `// PREVIEW SCREENS` marker), then screens and `App()`. **Never read it whole**; Grep and ranged Read. Node text/choices/weights are code that reads `flags` and `meters`.
- `src/logic.ts` pure run logic: `resolveChoice` (roll, impact, clamp, capital, destination) and `afterOutcome` (where Continue goes). No React/DOM/storage/`Math.random`.
- `src/main.jsx`, `src/input.css`, `src/prelude.html`, `build.mjs` build. `tools/` validators (`check-*.js`, `walk-historical.js`, `monte-carlo.js`) and `tools/ui_differential.mjs`. `tests/*.js` older jsdom behaviour tests (need `bundle_test.js` = a copy of `dist/bundle.js` in the project root). `tests/baseline/ui/` recorded runs from the pre-refactor build.
- `HANDOVER.md`, `VALIDATION_REPORT.md`, `CIVILWAR_EXPANSION_PLAN.md`, `IMPROVEMENT_RECOMMENDATIONS.md` content/history notes.

## Commands
- `npm run build` writes `dist/index.html` (single playable file), `dist/bundle.js`, `dist/output.css`.
- `npm run check` all data validators (flag values, continuity, advisor coverage, gates, bulletins, historical spine). Run before and after any content change.
- `npm run typecheck` checks `src/logic.ts` (App.jsx is untyped).
- `npm run verify:baseline` plays 48 seeded runs headlessly (jsdom, ~80 s) through the built bundle and compares every step's page hash to `tests/baseline/ui`. Must report 0 failures. Build first.
- `node tools/ui_differential.mjs one <campaignId> <open|hard> <seed>` with `TRACE=1` prints a step trace for one run.

## Rules
- Keep `modWeight`, `meterPct`, `applyImpact`, `clampTriangle`, `resolveNode` defined above the `// PREVIEW SCREENS` marker: the validators and `monte-carlo.js` evaluate only that part of the file. `logic.ts` receives `applyImpact`/`clampTriangle` by injection for that reason.
- `Math.random` is called once per uncertain choice, in `handleChoose`. Call order is part of the recorded behaviour.
- A deliberate behaviour change means re-recording the baseline (rebuild the old version from git history, `record legacy`, then the new one) and saying so.
- Legacy build for comparisons: `dispatches-1917.jsx` at commit `3352724`-era import; the baseline was recorded from it built with this folder's `build.mjs`.

## Known legacy behaviour
- FIXED: `provisionalGov17/kornilovAffair17`, choice 2 has no `next` (only its roll outcomes name destinations) and `handleChoose` ignored per-roll `next`, so the game routed to `undefined` and crashed ("Cannot read properties of null (reading 'date')"). 4 of 48 recorded runs hit it. Fix is narrow: a choice without its own `next` falls back to the rolled outcome's `next`.
- NOT CHANGED (needs a decision): per-roll `next` is still ignored when the choice also has its own `next`. Two authored routes are therefore unreachable today: `southRussia/afterEkaterinodar18` roll to `endingTheArmyThatDidNotComeBack18`, and `siberia/irkutskUltimatum20` roll to `endingTheAdmiralAtIrkutsk20`. Making rolls route would change those two nodes' outcomes. (`monte-carlo.js` replicates the old routing, which is why its 8,000-run "0 crashes" never saw this.)
- Audio toggles in Settings are labelled "not yet wired" and are not.
- `geo/` (map generation pipeline) was not exported; the baked map data lives inside `App.jsx`.
