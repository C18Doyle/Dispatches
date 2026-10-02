# Dispatches 1941 (Pacific war: IGHQ and CINCPAC)

React + Tone.js, esbuild + Tailwind v4. Two campaigns (`japan`, `alliedPacific`), ~139 nodes, hard modes (`fanatical`, `coalition`), a demo build. Source was reconstructed from the shipped single-file build; the unmigrated parts are still one large file.

## Layout
- `src/App.jsx` (~12.7k lines, 1.1 MB): content (`CAMPAIGNS`, lines ~760-7600) plus all screens. **Never read it whole.** Use Grep and ranged Read. Campaign nodes are getters inside `resolveNode(id, flags, meters)`; node text, choices and weights are code that reads `flags` and `meters`, so they cannot simply be moved to JSON.
- `src/logic.ts` the pure run logic (typed, no React/DOM/storage/sound/`Math.random`): meters and clamping, roll picking, choice resolution, next position, log entry, arrival interstitials. App.jsx calls it; content is passed in, never imported.
- `src/main.jsx`, `src/tailwind.css`, `build.mjs` build. `assets/maps/pacific-regions.json` (fetched at runtime), `audio/theme.mp3`, `tools/build_pacific_map_geometry.py` (map geometry pipeline).
- `tests/baseline/ui/` recorded runs from the pre-refactor build. `tools/ui_driver.js`, `tools/serve.mjs`, `tools/verify_baseline.mjs` the differential test.

## Commands
- `npm run build` writes `dist/full` and `dist/demo` (demo = `process.env.DEMO_BUILD` defined true).
- `npm run typecheck` checks `src/logic.ts` (App.jsx is not typed yet).
- Behaviour check (needs a browser; there is no headless runner here):
  1. `node tools/serve.mjs dist/full 4174`
  2. In the browser open `http://localhost:4174/`, run `eval(await (await fetch('/__driver')).text()); await __matrix('candidate')` (24 seeded runs; takes ~2 min; each run is recorded to `tests/ui-runs/candidate/` by the server).
  3. `npm run verify:baseline`. Must report 0 failures.
- Runs are deterministic: seeded `Math.random`, seeded choice picking, instant text, DOM-settled hashing, storage cleared before every mount. If runs ever disagree with themselves, suspect the driver, not the game.

## Rules
- Game decisions go through `src/logic.ts`, not inline in the component. New pure logic gets a type there.
- Do not call `Math.random` anywhere new. Two call sites exist (roll in `chooseOption`, `rollDivergenceForks`); the order of calls is part of the recorded behaviour.
- A behaviour change on purpose means re-recording the baseline (rebuild the old version from git history, record, then record the new one) and saying so. Otherwise `verify:baseline` must stay clean.
- The legacy build for comparisons is `dispatches-pacific.jsx` at commit `3352724` (`git show 3352724:"Dispatches 1941/dispatches-pacific.jsx"`), built with this folder's `build.mjs`.

## Known legacy behaviour (preserved on purpose unless noted)
- FIXED: a choice gated on a meter (e.g. `pipeline >= 6`) whose own impact drops the meter below the gate used to crash the game ("The File Was Damaged"): the outcome step re-resolved the stage from the new meters and looked up a choice that was no longer in the list. The player's stage is now snapshotted at choice time (`outcomeStage`, `seenStage` in App.jsx). 4 of 24 recorded runs hit this in the shipped build.
- KEPT: the after-action log (end screen's "compound likelihood" odds and "Passed over most often" counts) is built from the stage re-resolved after the choice applied its impact, so those two figures can be slightly off versus what the player faced. Using the snapshot would fix it and change those end-screen numbers; not done without a decision.
- KEPT: iron mode (`favor`/`defiance`) is inherited dead code; no Pacific mode uses it.
- The shipped itch.io zips are older than this source (different pipeline); do not diff against them.
