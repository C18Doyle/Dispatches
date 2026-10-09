# Dispatches 1941 (Pacific war: IGHQ and CINCPAC)

React + Tone.js, esbuild + Tailwind v4. Two campaigns (`japan`, `alliedPacific`), ~139 nodes, hard modes (`fanatical`, `coalition`), a demo build. Source was reconstructed from the shipped single-file build; the unmigrated parts are still one large file.

## Layout
- `src/App.jsx` (~12.7k lines, 1.1 MB): content (`CAMPAIGNS`, lines ~760-7600) plus all screens. **Never read it whole.** Use Grep and ranged Read. Campaign nodes are getters inside `resolveNode(id, flags, meters)`; node text, choices and weights are code that reads `flags` and `meters`, so they cannot simply be moved to JSON.
- `src/logic.ts` the pure run logic (typed, no React/DOM/storage/sound/`Math.random`): meters and clamping, roll picking, choice resolution, next position, log entry, arrival interstitials. App.jsx calls it; content is passed in, never imported.
- `src/main.jsx`, `src/tailwind.css`, `build.mjs` build. `assets/maps/pacific-regions.json` (fetched at runtime), `audio/theme.mp3`, `tools/build_pacific_map_geometry.py` (map geometry pipeline).
- `tests/baseline/ui/` recorded runs (64: easy, standard, hard and a staff-plan run per campaign, x 8 seeds). `tests/ui.config.mjs` configures the shared headless driver in `../packages/testkit`.

## Editing surface: src/parts/ (not src/App.jsx)
`src/App.jsx` is an assembled artifact (the validators, extractors and baselines read it). Edit the parts in `src/parts/`: `00-head`, one file per campaign (`10-campaign-japan`, `11-campaign-alliedpacific`), `20-registries-and-gallery`, `25-battle-subgame` (the Order of Battle engine and registries), `26-battles-pacific` (the three battles), `30-screens`, `35-battle-screens`, `40-app`. A session that touches one campaign needs that one part plus this file.
- `npm run build` assembles the parts into `src/App.jsx` first, and refuses if `src/App.jsx` is newer than every part (you edited the artifact by hand). Run `npm run split` to push such an edit back into the parts, or revert it.
- `npm run assemble` / `npm run roundtrip` (proves split then assemble is byte-identical) are available on their own. The split points live in `split.config.json`; the tool is `../packages/testkit/src/split.mjs`.
- Both the parts and the artifact are committed.

## The Order of Battle (battles)
- A choice that hosts a battle carries `keyBattleSubgame: KEY_BATTLE_CONFIGS.<id>` (config in `src/parts/26-battles-pacific.jsx`; commanders, approaches, enemy setups, echoes and titles are registered there by the same id). Rules: exactly two outcomes, the first is the win; arms are 3 to 5, each with a `meter` and a `strand` (reading) it draws on; the plan's roll nudge and meter cost live in `src/logic.ts` (`subgameWeights`, `computeBattlePlanCosts` in the engine part). The next node's situation appends `keyBattleEcho(id, flags)`.
- `npm run check-battle-balance` evaluates the engine and battle parts in a sandbox and fails on any broken invariant (hedge exploits, staff plan worse than careless play, no reason to read the enemy, a registry that does not match the config or its hosting choice). New battle: add the config, registries and title, host it on a choice, add the echo, run the check, run `npm run test:battle-resume`.
- Flags a battle writes: `<id>Grade`, `<id>Counter`, `<id>PlanNeglected`, `<id>PlanCommander`, `<id>Staff`, `<id>Posture`, `<id>Dec_*`. A save made inside a battle carries a `battle` field (`restoreBattleSave`).
- `npm run check-undefined` is the guard for names shared between parts.

## Strain and arrears
- `strainStage` (logic.ts) worsens the odds of a contested choice by the shortage of the meter it is about (`strainMeterOf`: its `gateCheck` label, else the meter its outcomes move most); the app and the audits (`audit-lib.mjs`, `check-endings.mjs`) run every stage through it, so what is shown is what is rolled. `resolveChoice` keeps arrears (`arrearsReadiness`, `arrearsPipeline`, `arrearsInitiative`, capped at 3) for what a cost takes below -10. The flags are set aside in the engine equivalence test (`TALLY_FLAGS`) and in `check-reachability`.

## The map
- `assets/maps/pacific-regions.json` is written by `tools/build_pacific_map_geometry.py` (Python, needs shapely; this machine has none) and then split by `node tools/split-pacific-zones.mjs` (China into 8 zones, the Indies into 5, the Philippines into 3; the Manchuria pin becomes a polygon). The split refuses to run twice (`meta.zonesSplit`); `--check` prints the area and landmark report (every city in `LANDMARKS` must fall in its zone). Zone borders are straight lines, listed with their reasons in the tool's ZONES table.
- `MAP_TIMELINE` (30-screens) holds each region's [date, status] entries; `baselineStatuses(dayKey)` gives the state the day before a report opens; `MAP_YEAR_STATUS` is derived. `mapOverrides` (run-specific changes) is still year-level. A new region needs geometry, a MAP_REGIONS entry, a timeline, MAP_EDGES, hints, and both command tables in 20-registries; `npm run check-map` fails on any that is missing.

## Content in JSON (pilot)
- 20 Allied Pacific nodes that are plain data live in `src/data/alliedPacific.nodes.json`; their getters in `src/parts/11-campaign-alliedpacific.jsx` are stubs (`return dataNode(ALLIED_PACIFIC_DATA, "id");`). Edit those nodes in the JSON, then `npm run build` (assembly inlines the JSON via `/*@inline-json ...*/`). All other nodes stay code in the part.
- `npm run split` refuses in this game (the artifact no longer holds the directives). `npm run test:json` keeps JSON and stubs consistent. `npm run extract:json -- alliedPacific --dry-run` shows what else is plain. See `../docs/DATA_MIGRATION.md`.

## Commands
- `npm run build` writes `dist/full` and `dist/demo` (demo = `process.env.DEMO_BUILD` defined true).
- `npm run typecheck` checks `src/logic.ts` (App.jsx is not typed yet).
- `npm run check:orphans` (atlas/reachability), `npm run test:saves`, `npm run test:migration`, `npm run test:json` are part of `test:fast`.
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

## Changing behaviour (details: ../docs/WORKFLOW.md)
- After any change run `npm run test:fast`. When `verify:baseline` fails: if it is a bug you introduced, fix the code; if the change is intended, read the reported differences, run `npm run baseline:accept`, and commit the new baseline together with the change and a line in `CHANGELOG.md`. A fix of a legacy bug that the old build got wrong goes in `tests/baseline/known-diffs.json` instead (first differing step plus a one-line reason).
- Saves: `npm run test:saves` loads the committed old saves in `tests/saves/` into the current build and resumes; they must restore the same screen. Never re-record them to make a failure pass: write a migration so old saves still load.
- Real-browser check (from the repo root, after building): `npm run smoke:browser`. Known layout findings are listed in `tests/browser-allowlist.json`.

## Writing and quotations
- Follow `../docs/WRITING.md`. `npm run check-writing` fails on an em dash in on-screen text (campaign parts and `src/data`).
- Advisers carry `position`, a third-person summary, never invented speech. A real quotation is an `attested` line on the choice and is logged in `claims/quotations.json`; `npm run check-quotations` enforces both.
## Audits (npm run audit; most are in test:fast)
- `tools/audit-lib.mjs` loads the campaigns and logic.ts and plays seeded wars the way the app does (random, greedy on the meters, uniform rolls so rare branches are visited).
- `check:orphans` (nodes and ending titles reachable), `check-reachability`, `check-advisor-dates` (needs an entry in `tests/adviser-tenures.json` for every named adviser), `check-outcome-sign`, `check-endings`.
- Reviewed exceptions live in `tests/audit-allowlist.json` and `tests/orphans-allowlist.json`; an entry that no longer occurs is reported so it can be removed. Never add an exception to make a new finding pass without reading it.
- Known gap: there is no pace-text check because the Pacific campaigns have no projected end date yet.
