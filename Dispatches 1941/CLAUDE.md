# Dispatches 1941 (Pacific war: IGHQ and CINCPAC)

React + Tone.js, esbuild + Tailwind v4. Two campaigns (`japan`, `alliedPacific`), ~139 nodes, hard modes (`fanatical`, `coalition`), a demo build. Source was reconstructed from the shipped single-file build; the unmigrated parts are still one large file.

## Layout
- `src/App.jsx` (~12.7k lines, 1.1 MB): content (`CAMPAIGNS`, lines ~760-7600) plus all screens. **Never read it whole.** Use Grep and ranged Read. Campaign nodes are getters inside `resolveNode(id, flags, meters)`; node text, choices and weights are code that reads `flags` and `meters`, so they cannot simply be moved to JSON.
- `src/logic.ts` the pure run logic (typed, no React/DOM/storage/sound/`Math.random`): meters and clamping, roll picking, choice resolution, next position, log entry, arrival interstitials. App.jsx calls it; content is passed in, never imported.
- `src/main.jsx`, `src/tailwind.css`, `build.mjs` build. `assets/maps/pacific-regions.json` (fetched at runtime), `audio/theme.mp3`, `tools/build_pacific_map_geometry.py` (map geometry pipeline).
- `tests/baseline/ui/` recorded runs (24: 2 campaigns x 2 modes x 6 seeds). `tests/ui.config.mjs` configures the shared headless driver in `../packages/testkit`.

## Editing surface: src/parts/ (not src/App.jsx)
`src/App.jsx` is an assembled artifact (the validators, extractors and baselines read it). Edit the parts in `src/parts/`: `00-head`, one file per campaign (`10-campaign-japan`, `11-campaign-alliedpacific`), `20-registries-and-gallery`, `30-screens`, `40-app`. A session that touches one campaign needs that one part plus this file.
- `npm run build` assembles the parts into `src/App.jsx` first, and refuses if `src/App.jsx` is newer than every part (you edited the artifact by hand). Run `npm run split` to push such an edit back into the parts, or revert it.
- `npm run assemble` / `npm run roundtrip` (proves split then assemble is byte-identical) are available on their own. The split points live in `split.config.json`; the tool is `../packages/testkit/src/split.mjs`.
- Both the parts and the artifact are committed.

## Commands
- `npm run build` writes `dist/full` and `dist/demo` (demo = `process.env.DEMO_BUILD` defined true).
- `npm run typecheck` checks `src/logic.ts` (App.jsx is not typed yet).
- `npm run verify:baseline` plays 24 seeded runs headlessly in jsdom through `dist/full/bundle.js` (~1 min), hashes the page after every click and compares with `tests/baseline/ui`. Build first. Must report 0 failures. `node ../packages/testkit/src/cli.mjs one japan-open 1` (with `TRACE=1`) plays one run.
- Runs are deterministic: seeded `Math.random`, seeded choice picking, instant text, DOM-settled hashing. The map JSON is served from `assets/` by the driver.

## Rules
- Game decisions go through `src/logic.ts`, not inline in the component. New pure logic gets a type there.
- Do not call `Math.random` anywhere new. Two call sites exist (roll in `chooseOption`, `rollDivergenceForks`); the order of calls is part of the recorded behaviour.
- A behaviour change on purpose means re-recording the baseline (rebuild the old version from git history, `record legacy`, then the new one, inspect the differences, then replace `tests/baseline/ui`) and saying so.
- The legacy build for comparisons is `dispatches-pacific.jsx` at commit `3352724` (`git show 3352724:"Dispatches 1941/dispatches-pacific.jsx"`), built with this folder's `build.mjs`.

## Known legacy behaviour (preserved on purpose unless noted)
- FIXED (also fixes a silent variant: when the live list shifted instead of shrinking, the outcome screen showed a different choice than the one picked): a choice gated on a meter (e.g. `pipeline >= 6`) whose own impact drops the meter below the gate used to crash the game ("The File Was Damaged"): the outcome step re-resolved the stage from the new meters and looked up a choice that was no longer in the list. The player's stage is now snapshotted at choice time (`outcomeStage`, `seenStage` in App.jsx). 2 of 12 headless legacy runs (4 of 24 in the earlier browser baseline) hit the crash in the shipped build.
- FIXED (decided 2026-10): `proceed()` (picked choice, next node, after-action log) always reads the snapshot of the stage the player faced (`seenStage = outcomeStage || stage`), so the end screen's "compound likelihood" odds and "Passed over most often" counts are what the player actually faced. The outcome screen renders the live stage as before unless it no longer holds the picked choice (`displayStage`). The baseline was re-recorded once for this (legacy vs new: 7 runs differ in exactly those two end-screen figures, nothing else).
- `src/logic.ts` calls the engine's campaign primitives (`packages/engine/src/campaign.ts`); `packages/engine/tests/campaign-equivalence.test.mjs` proves they match this game's own rules.
- KEPT: iron mode (`favor`/`defiance`) is inherited dead code; no Pacific mode uses it.
- The shipped itch.io zips are older than this source (different pipeline); do not diff against them.
