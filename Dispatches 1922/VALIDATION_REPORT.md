# Dispatches 1922 — Pre-Session Validation Report

Run against the uploaded `dispatches-1917.jsx` + six validators + `HANDOVER.md` +
`CIVILWAR_EXPANSION_PLAN.md`. Game file itself was **not edited** — this is a
read-only validation pass, results below are all measured, not assumed.

## Confirms HANDOVER.md's claimed state exactly

| | southRussia | siberia | bolsheviks | total |
|---|---|---|---|---|
| Nodes | 27 | 19 | 21 | **67** |
| Endings | 7 | 8 | 7 | **22** |
| Dossiers | 9 | 9 | 9 | **27** |
| Bulletins | 9 | 8 | 7 | **24** |
| Historical spine | 12 | 8 | 7 | — |

- `tsc --noEmit --jsx react --allowJs` — clean
- All six saved validators (`check-flag-values.js`, `check-continuity.js`,
  `check-advisor-coverage.js`, `check-gates.js`, `check-bulletins.js`,
  `walk-historical.js`) — pass with the same numbers HANDOVER.md reports.
  `check-continuity.js` flags the same 5 convergence points as before (not new).

## Additional checks run beyond the standard sweep

- **Full-file `esbuild` bundle** (not just the CAMPAIGNS slice) — clean, 498KB
  output, no syntax errors anywhere in the file including the screen components.
- **`resolveNode()` called for all 67 atlas node ids** with empty flags/initial
  meters — 0 throws, 0 falsy returns.
- **`ENDINGS_GALLERY` ↔ `ENDING_CLASSIFICATION` parity** checked per campaign —
  0 mismatches either direction.
- **Duplicate `case` label scan** across the whole switch (the exact bug class
  HANDOVER.md says previously shipped silently) — none found.
- **Monte Carlo, 8,000 random playthroughs per campaign**, hard mode off,
  gates respected: 0 crashes, 0 dead ends. Unreached endings were *exactly* the
  4 HANDOVER.md already documents as expected-unreachable in this kind of sim —
  the three hard-mode endings (`endingCossackMutiny`, `endingLegionWithdraws`,
  `endingCentralCommitteeMoves`, none reachable without hard mode enabled) plus
  `endingHollowVictory21` (needs a specific flag combination). No *new*
  unreachable endings turned up.
- **Meta-language scan** (`this campaign`, `this run`, `the player`, `this
  telling`, case-insensitive) — 35 hits, 33 are in `//` dev comments (not
  player-facing). The 2 remaining are exactly the two exceptions HANDOVER.md
  already names: the never-rendered `plannedEnding.note` on the bolsheviks
  campaign, and one JSX comment on the front-map marker legend. Nothing new
  leaked into rendered text.

## Finding: NODE_TO_CITY is missing 7 registrations

HANDOVER.md is explicit that a new node needs registering in four places —
`NODE_ATLAS`, `NODE_TOTAL`, `NODE_TO_CITY`, and (if an ending) both
`ENDINGS_GALLERY`/`ENDING_CLASSIFICATION` — and that "missing any is silent."
None of the six saved validators check `NODE_TO_CITY` completeness, so this
slipped through every sweep that's been run so far. Checked by cross-referencing
every `NODE_ATLAS`/`ENDINGS_GALLERY` id against the `NODE_TO_CITY` map directly:

| Campaign | Missing id | Type | Effect |
|---|---|---|---|
| southRussia | `volgaCossackDesertion19` | atlas node | won't register a position on the Front Map |
| southRussia | `endingTheArmyThatDidNotComeBack18` | ending | ending's final marker falls back to last-visited city instead of its own |
| southRussia | `endingTheLineThatBroke19` | ending | same fallback issue |
| siberia | `endingBoldyrevsOmsk18` | ending | same fallback issue |
| siberia | `endingOmskFalls19` | ending | same fallback issue |
| bolsheviks | `endingTheAutumnCrisis19` | ending | same fallback issue |
| bolsheviks | `endingTheIsland21` | ending | same fallback issue |

None of these crash anything — `NODE_TO_CITY[nid]` just returns `undefined` and
the lookup is skipped (`if (cid && ...)`), so the Front Map silently drops that
node's position, and `EndingScreen`'s `finalCityId` for an unregistered ending
silently falls back to the player's last visited city rather than the ending's
own. Read the epilogue text to infer the right city for each before writing
these in — I did NOT guess-fill these into the file myself, since a wrong city
id is a small but real continuity error and this project's own convention is
verify-don't-guess. From reading each epilogue for placement clues:

- `volgaCossackDesertion19` (Nov 1919, Volga axis) → almost certainly `tsaritsyn`, matching its sibling nodes `moscowDirective19`/`volgaThrust19`/`volgaOverextension19`.
- `endingTheArmyThatDidNotComeBack18` (Apr 1918) → almost certainly `ekaterinodar`, matching `kornilovsDeath18`/`ekaterinodarAssault18`/`afterEkaterinodar18`.
- `endingTheLineThatBroke19` (Dec 1919, epilogue is explicitly about Kharkov encirclement) → almost certainly `kharkov`.
- `endingBoldyrevsOmsk18` / `endingOmskFalls19` (both titled around Omsk) → almost certainly `omsk`.
- `endingTheAutumnCrisis19` (bolsheviks, Oct 1919, epilogue opens "Orel does not hold" and is centrally about the Orel battle) → likely `orel`, though its parent node `cavalryArmyDebate19` is itself registered under `voronezh` — worth your own read before committing, since the two plausible answers disagree.
- `endingTheIsland21` (Mar–Sep 1921, "The Island") → almost certainly `kronstadt` (a valid `CITIES` id already used by `kronstadt21`).

None of this changes flags, routing, or historical claims — it's purely the
Front Map's city tracking — but it's exactly the silent-registration bug class
the project has hit before, so worth fixing as the first item of the next
session rather than carrying it forward.

## Minor: stale header comment

Lines 1–16 and the "BACKLOG" block (~line 68-83) still say the file "does NOT
contain BriefingScreen / OutcomeScreen / EndScreen / DemoWallScreen" and "only
15 nodes are written so far." Both are long out of date — `BriefingScreen` and
`OutcomeScreen` are defined in this file (lines 6222, 6305), and the file has
67 nodes across a full `App()` shell. Not a functional bug, but worth trimming
so a future session doesn't take the stale note as current guidance about what
still needs building/porting from the 1940/1941 source.

## Bottom line

The file is exactly where HANDOVER.md says it is — every claimed number holds
up under independent re-derivation, not just re-running the same scripts.
One real gap (`NODE_TO_CITY`) got past all six existing validators since none
of them check it; worth either a seventh validator or folding the check into
an existing one (`check-continuity.js` or `check-gates.js` would be natural
homes) so it can't recur silently again. Everything else — tsc, full bundle,
resolveNode over every node, ending registration parity, duplicate case labels,
Monte Carlo reachability, meta-language leakage — came back clean.
