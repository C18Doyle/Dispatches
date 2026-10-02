# Dispatches 1918 — session rules

Auto-loads each session. Read before touching the file.

## Monorepo notes (added on import to Dispatches Code)

- This is the reference shape for the series: the logic layer is already pure and separate. `src/50-registries` to `57-nodeids` (registries, meters, succession, hard mode, `resolveNode`, `chooseNext`, `walkSpine`) have no React/DOM, take an injectable `rng`, and read content only from `CAMPAIGNS`. `chooseNext(campaignId, choice, flags, meters, hardState, rng)` already honours per-roll `next`, `nextIf` on post-choice meters, and the hard-mode forced ending. The shared engine's "function returns the node" mode should be modelled on it.
- No logic extraction was needed. A headless UI baseline was added instead: `npm run verify:baseline` (jsdom, ~20 s) plays 24 seeded runs (3 campaigns x 8 seeds) through `dist/bundle.js` and compares every step's page hash to `tests/baseline/ui`. Build first (`npm run build`).
- `npm test` = build, smoke, render-test, roundtrip, verify:baseline. `npm run validate` (= `bash validate.sh`) is separate because it exits 1 on the deliberate Ottoman research gate.
- The UI has no hard-mode switch yet, so hard mode is covered by `smoke.js` and `montecarlo.js`, not by the UI baseline.
- `roundtrip-test.mjs` now uses the OS temp dir (it hardcoded `/tmp`, which failed on Windows).
- Moving a campaign's text into JSON is not planned: nodes use functions of `flags`/`meters` for prose and gates.

## State

Engine scaffold only. **No content. No UI.** Node sets are empty by design.

- `dispatches-greatwar.jsx` — engine layer. UI layer is empty, blocked on art direction.
- 13 validators + `smoke.js` + `_fixture.jsx` (deliberate faults, validator self-test)
- Spec: `DISPATCHES_1918_DESIGN_SPEC.md`

**This engine was written clean-room from the spec, NOT ported from
`dispatches-1922.jsx`, which was unavailable.** Points marked `RECONCILE` must be
checked against the real 1922 implementation before content work begins.

## Commands

```
./validate.sh                 # full suite
node smoke.js                 # engine behaviour, real execution
./validate.sh _fixture.jsx    # self-test: must report MANY problems
```

`validate.sh` currently exits 1 on the Ottoman Rumi calendar research gate. That is
correct and deliberate. It stays failing until spec §9 is resolved.

## Non-negotiables

1. Never add a field the UI doesn't render. Check the render layer first.
2. Never add a flag without a reader. Prefix every flag (`ohl_`, `gqg_`, `stavka_`,
   `bef_`, `aok_`, `otto_`, `xc_`).
3. Verify flag VALUES, never guess. `flags.x === "guessed"` compiles and never fires.
4. One `historical: true` choice per node, exactly.
5. Bulletins fire on ARRIVAL, before the decision.
6. Never leave every choice at a node gated.
7. Gate thresholds from measured Monte Carlo distributions, never intuition.
8. No blanket find-and-replace. Structured node IDs exist so a careless one fails loudly.
9. Settled outcomes are narrated, never rolled. Every roll carries a `dispute` field.
10. No roll at the final junction before an ending. Endings stay decision-driven.

## Registries are derived, not maintained

`NODE_ATLAS`, `NODE_TO_CITY`, endings and `NODE_TOTAL` are all built from live node
data by `buildNodeAtlas()` etc. There is no hand-edited table to forget. Do not
reintroduce one.

## Prose blocklist

"genuinely", "for once", "the question is", "a real X, not an invented one:",
"historians of this counterfactual", "X, not Y" as a crutch, repeated anaphora
openers across adjacent nodes. No meta-language: "this campaign", "this run",
"the player", "this telling". `check-meta-language.js` is case-insensitive.

Title-specific: avoid WWI futility-poetry. Commanders in 1916 believed they were
solving a solvable problem. Write them as people solving it.

## Build order

OHL → GQG → STAVKA → BEF → AOK → OTTO. One campaign end-to-end through its full
ship gate before the next starts. Ottoman last, and blocked on spec §9.

## Session discipline

One campaign per session. Run validators locally first; bring only failure lines
into context. Large-file work belongs in Claude Code on desktop.

## Running it

```
npm install
node build.mjs        # assembles src/ -> single file -> dist/index.html
bash validate.sh      # full validator suite
node smoke.js         # engine behaviour, real execution
node render-test.js   # mounts in jsdom and clicks all three campaigns
node verify-standalone.js
node roundtrip-test.mjs
```

The JSX file is not runnable on its own — `entry.jsx` mounts it. Opening the raw
.jsx gives a blank screen.

Note: copying this folder through /mnt/user-data/outputs strips the exec bit from
`validate.sh`. Use `bash validate.sh` or re-`chmod +x`.

## src/ is the editing surface; the single file is the artifact

`dispatches-greatwar.jsx` is 3,700+ lines and is what every validator reads. To
avoid loading all of it to change one campaign:

```
node split.mjs        # single file -> src/ (16 files, campaign-per-file)
node assemble.mjs     # src/ -> single file
node roundtrip-test.mjs   # proves split->assemble is BYTE-IDENTICAL
```

`build.mjs` assembles automatically before bundling, and **refuses to run** if the
single file is newer than everything in `src/` — that means somebody edited the
artifact directly and assembling would destroy the work. Run `node split.mjs` to
bring `src/` up to date, or revert.

Campaign files are `src/30-campaign-ohl.jsx`, `31-campaign-gqg.jsx`,
`32-campaign-stavka.jsx` — roughly 800-1,000 lines each. A session that touches one
campaign needs one of them plus this file.

`roundtrip-test.mjs` must stay byte-identical. If it ever diverges, the editing
surface has silently drifted from the artifact the validators read, and the split
is a liability rather than a convenience — fix it or abandon it.

## Advisors carry `position`, not `quote` — deliberate departure

1940 and 1941 put written-in-voice lines inside quotation marks attributed to real
named people (Raeder, Donitz). Those read as historical quotations and are not.
That is a fact-checking exposure on a game that badges its own accuracy.

This title uses `advisor: { name, position }` and renders it as
"Falkenhayn argues: ..." — indirect speech, no quotation marks. Nothing in this
file claims a real person said specific words unless the wording is attested.

## Content status

| campaign | nodes | endings | dossiers | bulletins | spine | rolls | gate-blocks | status |
|---|---|---|---|---|---|---|---|---|
| ohl | 20 | 9 | 10 | 8 | 12 | 3 | 2.56 | complete |
| gqg | 20 | 9 | 10 | 8 | 11 | 3 | 3.22 | complete |
| stavka | 17 | 9 | 10 | 8 | 9 | 3 | 2.37 | complete |
| bef | 0 | - | - | - | - | - | - | not started |
| aok | 0 | - | - | - | - | - | - | not started |
| otto | 0 | - | - | - | - | - | - | blocked, spec §9 |

Both complete campaigns: 30,000 runs each, 0 dead ends, 0 softlocks, every
non-hard ending reachable, hard-mode ending fires ~10% of runs with hard mode on.

**Remaining before either could ship: independent fact-check of every historical
claim.** The claims were written and verified by the same party, which is not the
same as review.

## GQG design constraint — the mutinies

The 1917 repression is NARRATED, never dialled. The player does not set a number of
executions. The choice is concession, discipline, or both — the choice the command
actually faced. The execution count is disputed in the literature (Pedroncini
documents 43, Rolland ~30, other counts differ, files closed a century) and the
game says so rather than picking one.

## Thresholds come from measurement — including erosion

`measure.js` prints per-node meter percentiles. `measure-erosion.js` prints the
erosion ceiling actually reachable. `montecarlo.js [file] [runs] [hard]` reports
ending reachability and gate-blocks.

`EROSION_MAX` was a global 10 set by intuition. Measured OHL ceiling is 7, so the
hard-mode ending could never fire. It is now per-campaign (`hardMode.erosionMax`);
OHL 5, GQG 5.

GQG's 5 was copied from OHL before measuring, which is exactly what this file says
not to do. Measurement afterwards happened to confirm it (GQG ceiling is 5, forced
ending fires 9.2%). Do not take that as licence. Minor campaigns have half the
nodes and copying 5 there will produce an unreachable ending.

`node measure-erosion.js <campaign>` and `node measure.js <campaign>` both take a
campaign id.

Erosion caps: OHL 5, GQG 5, Stavka 4 (firing ~9.5% / ~9.3% / ~4.7% of hard runs).
Stavka needed a different cap and a reduction in erosion-tagged choices: 7 of 16 was
proportionally far above OHL's 8 of 23 and forced the ending in 32% of runs.

## nextIf thresholds need measuring too — not just gates

Stavka shipped its first sweep with the canonical settled ending firing in 0.4% of
runs. The `nextIf` thresholds routing to alternative endings were set by intuition at
-6, which sat at or above the median for a campaign whose meters legitimately run
deep negative, so almost every run was diverted before reaching the historical
ending. Set ending-routing thresholds from `measure.js` at that node, at the tails.
The canonical ending should normally be the modal outcome.

## Never gate the historical choice

`check-gates.js` enforces this. Gating it can softlock the node and can make the
spine unwalkable at meter values a real run reaches. If a node needs more gate
pressure, tighten the gate on a non-historical choice instead.

## Gates are set from measured distributions

`node measure.js` prints per-node meter percentiles. `node montecarlo.js` reports
gate-blocks per run. Current OHL: 2.15 per run against a 2.0 target. Never add a
gate before measuring; 1922 shipped one that was unreachable.

## Theme

`THEME` at the top of the UI layer is the whole palette. Art direction (spec §13.8)
is a change to that object, not to components.

## Changing behaviour (details: ../docs/WORKFLOW.md)
- After any change run `npm run test:fast`. When `verify:baseline` fails: if it is a bug you introduced, fix the code; if the change is intended, read the reported differences, run `npm run baseline:accept`, and commit the new baseline together with the change and a line in `CHANGELOG.md`. A fix of a legacy bug that the old build got wrong goes in `tests/baseline/known-diffs.json` instead (first differing step plus a one-line reason).
- This game keeps no saved state, so there is no save-compatibility test.
- Real-browser check (from the repo root, after building): `npm run smoke:browser`. Known layout findings are listed in `tests/browser-allowlist.json`.
