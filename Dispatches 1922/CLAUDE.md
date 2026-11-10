# Dispatches 1922 (Russian Civil War)

React 18 + Tailwind 3, esbuild. Four campaigns (`provisionalGov17`, `southRussia`, `siberia`, `bolsheviks`), hard modes ("capital" spending), front map, discovery log, single-slot save. Ships as one HTML file.

## Layout
- `src/App.jsx` (~8.9k lines, 700 KB): `CAMPAIGNS` and engine helpers first (everything above the `// PREVIEW SCREENS` marker), then screens and `App()`. **Never read it whole**; Grep and ranged Read. Node text/choices/weights are code that reads `flags` and `meters`.
- `src/logic.ts` pure run logic: `resolveChoice` (roll, impact, clamp, capital, destination) and `afterOutcome` (where Continue goes). No React/DOM/storage/`Math.random`.
- `src/main.jsx`, `src/input.css`, `src/prelude.html`, `build.mjs` build. `tools/` validators (`check-*.js`, `walk-historical.js`, `monte-carlo.mjs`) and `tools/ui_differential.mjs`. `tests/*.js` older jsdom behaviour tests (need `bundle_test.js` = a copy of `dist/bundle.js` in the project root). `tests/baseline/ui/` recorded runs from the pre-refactor build.
- `HANDOVER.md`, `VALIDATION_REPORT.md`, `CIVILWAR_EXPANSION_PLAN.md`, `IMPROVEMENT_RECOMMENDATIONS.md` content/history notes.

## Advisers
An adviser line is `advisor: { name, position }`: one or two sentences in the third person saying what the person argues, never speech and never an invented figure. A real quotation goes only where it is logged with a source. `npm run check:advisers` enforces it.

## Dates
Western calendar, day then month, everywhere on screen (`7 November 1917`). Russia used the Julian calendar until 14 February 1918 (13 days behind), so Russian dates before that are converted; Old Style may appear in a code comment or a claims note, never on screen. Where sources disagree on a day, give the month. The How to Read screen carries the one sentence that explains it.

## The historical spine
`tools/historical-spine.mjs` (`npm run check:spine`, in test:fast) follows the choice flagged `historical: true` at every report, on the real rules, branching on each contested roll. It fails if a report on that path has no historical choice or more than one, if the historical choice is gated, if the path dead-ends, or if the most likely ending of the record is not a `historical` ending. It also ratchets (tests/spine-baseline.json) the share of record-following runs that end historically. A new report, gate or ending checkpoint must leave a player who follows the record at a historical ending.

## Your war against the record
`decisionEntry` and `RecordPanel` (src/parts/30-screens.jsx) record and show every order against the choice flagged `historical: true` at that report; the log is the `decisions` state in 40-app.jsx, saved with the run (optional field, no schema bump) and rewound with Easy mode. A choice's `outcome` is what is shown as "what the record did", so the historical choice's `outcome` must read as the account of what happened. `npm run test:record`.

## Preludes and the hard history
`PRELUDES` (one per command) and `HARD_HISTORY` are in src/parts/30-screens.jsx, shown by `PreludeScreen` after ENTER COMMAND and by `HardHistoryScreen` (from the prelude and the War Record). The prelude is not saved: a resumed run goes straight to its report. Tests start past the prelude (`tests/ui.config.mjs` setup) unless `ctx.stayOnPrelude`; `check:a11y` visits both screens. Every figure in them must be in claims/preludes-round1.md with a source; they describe atrocities and never offer one as an order, a meter or a score.

## Period details
src/parts/36-period.jsx (the map: terrain, operations, supply, place names), 37-letters.jsx (letterhead, documents, quotations, terms, staff, staff note) and 38-plates.jsx (the plates) are keyed by report, city or campaign, so no report text changes. A document is a summary of the real document, labelled as a reconstruction; a quotation goes only in `QUOTES` and claims/quotations.json with its translation and source; a plate scene is drawn in the skin's ink and captioned as an illustration. `npm run check:period` ties them to the campaigns and the registers; `npm run test:period` plays them on screen. The staff note works from `choice.impact` and `choice.uncertain`, so a new order gets one for free. Sources: claims/documents-round1.md.

## Orders of Battle
`src/battle.ts` is the pure arithmetic (typed, in `npm run typecheck`). `src/parts/35-battles.jsx` holds the configs (`BATTLES`), the planning screen and the report. A battle is hosted by a choice with `keyBattleSubgame: { id }` and exactly two contested outcomes; `winBranch` is the index of the better one. The staff's plan must move the odds by exactly 0 (tests/battle.test.mjs proves it for every config, setup and pool size), so never change the arithmetic without running it. New battle: config, `keyBattleSubgame` on the order, a line in claims/battles-round1.md.

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
- FIXED: hard-mode endings for South Russia (`endingCossackMutiny`) and the Bolsheviks (`endingCentralCommitteeMoves`) could not fire because no path spent 5 capital. More choices now cost capital; `node tools/capital-reach.mjs` shows how much each campaign can spend (greedy play reaches 5 on about 25% of South Russia runs and 66% of Bolsheviks runs). The 1917 campaign has its own hard mode; see its section in the changelog.
- FIXED: `endingHollowVictory21` was unreachable (needed both `requisitionPolicy: intensified` and `congressChoice: press`, set on opposite branches); it now needs either, after an assault on Kronstadt. Five seeded runs end there instead of at The Ice Broken (known-diffs.json).
- FIXED: a rolled outcome's own `next` was ignored. Effects: `provisionalGov17/kornilovAffair17` (choice with no `next`) routed to `undefined` and crashed ("Cannot read properties of null (reading 'date')", 4 of 48 recorded runs), and two authored endings were unreachable: `southRussia/afterEkaterinodar18` roll to `endingTheArmyThatDidNotComeBack18` and `siberia/irkutskUltimatum20` roll to `endingTheAdmiralAtIrkutsk20`. Roll outcomes now route to their own `next` (same rule as 1914/1941/1940). `tests/routing.test.mjs` forces every such outcome and checks the destination (it fails on the old logic). The seeded UI baseline does not reach those two nodes, so it stays 44 identical + 4 crashes fixed. `tools/monte-carlo.mjs` now drives the real `src/logic.ts` (random play, seeded): `node tools/monte-carlo.mjs 3000 [--hard]` prints gate-bite rate and which endings were reached or never reached. Both formerly unreachable endings are reached.
- Audio toggles in Settings are labelled "not yet wired" and are not.
- `geo/` (map generation pipeline) was not exported; the baked map data lives inside `App.jsx`.

## Changing behaviour (details: ../docs/WORKFLOW.md)
- After any change run `npm run test:fast`. When `verify:baseline` fails: if it is a bug you introduced, fix the code; if the change is intended, read the reported differences, run `npm run baseline:accept`, and commit the new baseline together with the change and a line in `CHANGELOG.md`. A fix of a legacy bug that the old build got wrong goes in `tests/baseline/known-diffs.json` instead (first differing step plus a one-line reason).
- Saves: `npm run test:saves` loads the committed old saves in `tests/saves/` into the current build and presses RESUME COMMAND; they must restore the same screen. Never re-record them to make a failure pass: write a migration so old saves still load.
- Balance and ending reachability: `npm run monte-carlo` (seeded random play on the real `src/logic.ts`).
- `npm run check:a11y` plays four seeded runs (one Easy, one hard) and the menus in jsdom and fails on a missing name, landmark or h1, a meter without a value, focus left on the body, or a skin colour pair under WCAG contrast. `npm run test:easy` covers Easy mode. Real-browser axe: `node ../tools/smoke-browser.mjs 1922` (needs @axe-core/playwright in the root node_modules).
- Real-browser check (from the repo root, after building): `npm run smoke:browser`. Known layout findings are listed in `tests/browser-allowlist.json`.
