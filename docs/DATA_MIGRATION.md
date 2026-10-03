# Moving campaign content to JSON

Frankenstein keeps its story in JSON (`src/content/frankenstein/*.json`) checked against `packages/engine/src/schema.ts`.
The other four games keep content as code. This page records what the pilot on 1941 *Allied Pacific* found, and what has
to happen before moving more.

## The pilot (done)
`Dispatches 1941/tools/extract-json-nodes.mjs alliedPacific` moved **20 of the campaign's 71 nodes** into
`src/data/alliedPacific.nodes.json`. Each moved node is replaced in `src/parts/11-campaign-alliedpacific.jsx` by a one-line
stub (`return dataNode(ALLIED_PACIFIC_DATA, "id");`). The head part declares
`const ALLIED_PACIFIC_DATA = /*@inline-json src/data/alliedPacific.nodes.json*/null;` and **assembly inlines the JSON**
(`packages/testkit/src/split.mjs`), so the assembled `src/App.jsx` is still plain JS and every validator and the build read
it exactly as before.

Proof that nothing changed: all 639 sampled `resolveNode` outputs (all 71 nodes x 3 flag states x 3 meter levels) are
byte-identical to the original code, `verify:baseline` is 24/24 identical, and `check:structure`, `check:orphans`,
`test:saves` and `test:migration` pass. `npm run test:json` keeps the JSON and the stubs in step (every id has exactly one
stub, every stub has a node).

**Editing a moved node:** change `src/data/alliedPacific.nodes.json`, then `npm run build`. **Editing any other node:** the
campaign part, as before. `npm run split` now refuses in this game (the artifact no longer holds the directives).

## What blocked the other 51 nodes (the real finding)
The first version of the converter decided "plain data" by resolving each node under sampled flag and meter states. It moved
28 nodes and the UI baseline immediately failed in 10 runs: some nodes change their text on a flag value nobody sets in the
sampled states. So the converter now reads the **source**: a node is plain only if its code (outside string literals)
mentions no `flags`, `meters`, `this`, arrow function or `function`, *and* it samples identically. The same lesson applies
to the numbers below: sampling over-reports.

Of the 51 nodes that stay code in Allied Pacific: 4 only add 1 to a counter flag (`cohesion: (flags.cohesion || 0) + 1`),
and 47 contain flag-dependent text (about 130 `flags.x === "value"` tests), choices conditional on meters (about 90
`meters.` reads) or small helper functions (about 26 arrows).

`node tools/data-readiness.mjs` measures the same thing across all games (upper bounds, because it samples):

| Game | Nodes | Plain by sampling | Blocked by |
|---|---|---|---|
| 1914 | 57 | 4% | `epilogue` functions, `choices[].gate`, flag-built `situation`, `nextIf` |
| 1922 | 84 | 29% | content that changes with meters or flags, `gate`, `nextIf` |
| 1941 | 125 | 46% (20 already JSON) | content that changes with meters or flags |
| 1940 | 214 | 55% | content that changes with meters or flags |

(An earlier version of this page said 67% overall. That was the sampling being too generous.)

## What it would take to move the rest
Three declarative pieces cover nearly everything that blocks the code nodes. Frankenstein already solved the first two
(`Condition` in `schema.ts`: stat, flag, branch, difficulty); extend that vocabulary rather than inventing a second one:
1. **Counter flags**: `"addFlags": { "cohesion": 1 }` instead of `(flags.cohesion || 0) + 1` (about 4 nodes outright, and
   part of many more).
2. **Conditional text and impact**: `"variants": [{ "when": { "flag": "embargoPath", "is": "total" }, "text": "..." }]`
   instead of `flags.embargoPath === "total" ? "..." : "..."`.
3. **Meter-conditional choices**: a declarative `when` on a choice in place of a `meters.x >= n` check (1941 already
   expresses closed choices with `disabledReason`).

Each needs an engine-side evaluator in `packages/engine` (with equivalence tests like `campaign-equivalence.test.mjs`) and
a validator. It is a design change to how content is authored, so it needs your decision before more nodes move.

## Recommendation
Leave the 20-node pilot as it is (it works and is guarded). Do not convert more by hand, and do not start 1940 or 1922
until the vocabulary above exists. If most new content will be written in the next few months, the cheapest place to get
data-first content is Frankenstein's engine for any *new* game; for these four, write new nodes in the existing style.
