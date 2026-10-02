# Dispatches 1922 — Handover

Paste this into a fresh chat along with `dispatches-1917.jsx` and the six validator
scripts. Everything below is verified as of this handover, not remembered.

---

## What this is

A single-file React/JSX branching-narrative strategy game about the Russian Civil War.
Three playable campaigns, one shared engine. Distributed via itch.io; Electron desktop
build planned.

**Filename is still `dispatches-1917.jsx`** — the game was renamed to *Dispatches 1922*
in-content but the file was never renamed on disk. Rename it if you like; nothing
depends on the filename.

## Current verified state

| | southRussia | siberia | bolsheviks | total |
|---|---|---|---|---|
| Nodes | 27 | 19 | 21 | **67** |
| Endings | 7 | 8 | 7 | **22** |
| Dossiers | 9 | 9 | 9 | **27** |
| Bulletins | 9 | 8 | 7 | **24** |
| Historical spine | 12 | 8 | 7 | — |

`tsc --noEmit --jsx react --allowJs` clean. All six validators pass with 0 problems.

## Run the validators before and after every change

```
tsc --noEmit --jsx react --allowJs dispatches-1917.jsx
node check-flag-values.js       dispatches-1917.jsx   # 131 comparisons, 0 write-only
node check-continuity.js        dispatches-1917.jsx   # convergence points to review
node check-advisor-coverage.js  dispatches-1917.jsx   # 0 advisors without dossiers
node check-gates.js             dispatches-1917.jsx   # meter gates + softlocks
node check-bulletins.js         dispatches-1917.jsx   # 24 bulletins, 0 problems
node walk-historical.js         dispatches-1917.jsx   # spine must stay 12/8/7
```

**`tsc` passing means very little here.** It has passed cleanly through: a deleted
`const CITIES` declaration, a swallowed `case` label, two `setLegitimacy` calls to a
function that no longer existed, a duplicate `gate:` key that silently discarded the
first one, an infinite routing loop, and an invented `nextIf` field the engine never
read. Every one of those was caught by a validator, a render test, or a simulation —
never by the type-checker.

## How to actually verify a change

**Data changes** — load the CAMPAIGNS module and call `resolveNode` for real:
```js
let s = fs.readFileSync('dispatches-1917.jsx','utf8').split('// PREVIEW SCREENS')[0];
s = s.replace(/^export /gm,'') + '\nmodule.exports={CAMPAIGNS};\n';
```

**UI changes** — bundle and render in jsdom, then click through the actual path:
```
npx esbuild file.jsx.jsx --bundle --format=cjs --jsx=automatic --platform=node \
  --external:react --external:react-dom --outfile=/tmp/b.js
```
`--external:react` matters. Bundling React in while also requiring it separately
produces a bogus "Invalid hook call" that looks like a real bug and isn't.

**Balance/reachability changes** — Monte Carlo. Random playthroughs, count which endings
fire. This is the only thing that catches an unreachable ending, and it has caught
several.

---

## Engine facts worth knowing before editing

- **`resolveNode(nodeId, flags, meters)`** returns the whole node. `situation`,
  `context`, `bulletin`, and `epilogue` can all be built conditionally from `flags` —
  no engine change needed. Many already are.
- **`choice.gate(meters)`** blocks selection; needs a paired `disabledReason`.
- **`choice.nextIf(meters)`** redirects the destination based on POST-choice meters,
  returning `null` to fall through to `next`. Three exist; they drive the mid-war
  collapse endings. Custom field, wired in `handleChoose`.
- **`choice.uncertain[]`** is a weighted roll; weights must sum to 100. Each branch may
  carry its own `impact`, `setFlags`, `outcome`, `next`, `aftermath`.
- **Meters** are three per campaign, clamped ±10, 0 = historical baseline.
- **Hard mode** is a separate erosion track; at max it forces a campaign-specific
  ending. Named per campaign: Kalabukhov / Janin / Orgburo Mode.

## A new node must be registered in four places

`NODE_ATLAS`, `NODE_TOTAL`, `NODE_TO_CITY`, and — if an ending — **both**
`ENDINGS_GALLERY` and `ENDING_CLASSIFICATION`. Missing any is silent.

## Rules that came from real shipped bugs

1. **Never add a field the UI doesn't render.** Check the render layer first.
2. **Never add a flag without a reader.** `check-flag-values.js` must show 0 write-only.
3. **Verify flag VALUES, never guess them.** `flags.x === "guessed"` compiles, passes
   tsc, and silently never fires. Happened twice.
4. **Advisors must belong to the right campaign and be alive/present on that date.**
   Wrangel and Kutepov once advised the *Bolshevik* command. Gajda spoke four months
   after being dismissed and turning against the government. Kappel spoke after being
   incapacitated.
5. **Bulletins fire on ARRIVAL, before the node's decision.** Never write one that
   announces the outcome of the choice the player is about to make.
6. **Never leave every choice at a node gated** — that's a softlock. `check-gates.js`
   checks this now.
7. **Set gate/nextIf thresholds from measured distributions, not intuition.** A
   diversion once required `rail <= -5` at a node where rail's measured minimum was
   +2 — literally unreachable.
8. **One `historical: true` choice per node, exactly.** Two breaks `walk-historical.js`;
   the bolsheviks spine silently collapsed 7 → 3 this way.
9. **Blanket find-and-replace across the file is dangerous.** One rerouted 18 correct
   references and also the new node's own two, creating a self-loop.
10. **Third options only where documented.** Several were verified and *rejected*
    because the "alternative" was already represented — see the plan doc.

## No player-facing meta language

No "this campaign", "this run", "the player", "this telling". 47 instances were removed;
a case-insensitive grep is the check, since the first pass missed every capitalised
sentence-start. Two known-safe exceptions remain: a `plannedEnding.note` that is never
rendered, and a JSX comment.

---

## Where things stand

**Recently completed:** meter gates on all nine axes (were 5 of 9 decorative); three
mid-war 1919 collapse endings; 24 newspaper bulletins with WWI context; advisor voice
and timing audit; full field-dossier UI (main menu, War Record, Settings); game renamed
to Dispatches 1922; hard modes renamed to Kalabukhov / Janin / Orgburo.

**Known weak points, honestly:**
- **Gate blocks per run: 0.52 / 0.26 / 0.14.** Gates exist on every axis now, but
  bolsheviks especially still rarely constrains anything in practice. Not solved.
- **Three endings unreachable in random simulation** — all three hard-mode endings
  (sim doesn't enable hard mode) plus `A Hollow Victory`, which needs a specific
  three-flag combination. Explained, not necessarily fine.
- **No save state, no objectives system.** The War Record lists everything written
  rather than what a playthrough uncovered. Acknowledged in-game.
- **Audio toggles are wired to nothing** — marked NOT YET WIRED in Settings.
- **`check-continuity.js` flags ~5 convergence points** for manual review. Not bugs by
  default; each needs reading against every path that reaches it.

**Not started:** Steam evaluation (Mac build infra, Steamworks SDK, AI-content
disclosure under Valve policy), independent fact-checking of historical claims.

## Files

- `dispatches-1917.jsx` — the game
- `check-flag-values.js`, `check-continuity.js`, `check-advisor-coverage.js`,
  `check-gates.js`, `check-bulletins.js`, `walk-historical.js` — validators
- `CIVILWAR_EXPANSION_PLAN.md` — batch history, including verified rejections so
  they don't get re-proposed
