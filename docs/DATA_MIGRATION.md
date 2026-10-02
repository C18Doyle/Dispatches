# Moving campaign content to JSON: what the pilot found

Frankenstein already keeps its story in JSON (`src/content/frankenstein/*.json`) checked against
`packages/engine/src/schema.ts`. The other four games keep content as code. `node tools/data-readiness.mjs`
evaluates each game's real campaigns and measures how much is already plain data.

| Game | Nodes | Plain data | What blocks the rest |
|---|---|---|---|
| 1914 | 57 | 4% | `epilogue` functions (27 nodes), `choices[].gate` (22), `situation` text built from flags (15), `choices[].nextIf` (6) |
| 1922 | 84 | 63% | `choices[].gate` (19), content that changes with meters or flags (18), `nextIf` (3) |
| 1941 | 125 | 73% | content that changes with meters or flags (34) |
| 1940 | 214 | 83% | content that changes with meters or flags (37) |

(Measured by resolving each node under different meters and with every settable flag on; flag values other than
true are not tried, so treat the percentages as upper bounds. 1914 has three more campaigns with no content yet.)

## What this means
- 1940 and 1941 are the cheap ones: most nodes are already data and the rest vary with state in a few recurring ways.
- 1914 is the expensive one: nearly every node carries a function. Do not convert it first.
- The blockers are always the same three things: a **gate** (can this choice be shown), a **nextIf** (divert on a
  meter state), and **text that depends on flags**. Frankenstein solved these declaratively
  (`Condition` in `schema.ts`: stat, flag, branch, difficulty...). That vocabulary is the bridge; extend it
  rather than inventing a second one.

## Recommended path (not started: it changes how content is authored, so it needs your go-ahead)
1. Pick 1941 `alliedPacific` (66 nodes, 82% already plain) as the pilot.
2. Add the missing declarative pieces to `schema.ts` (meter gate, flag-dependent text variants), with tests.
3. Convert the plain nodes to JSON; keep the dynamic ones as code behind the same interface.
4. Gate: `verify:baseline` must stay identical and `data-readiness` must show the plain share rise.
5. If it works, repeat for 1940, then 1922. Leave 1914 for last.
