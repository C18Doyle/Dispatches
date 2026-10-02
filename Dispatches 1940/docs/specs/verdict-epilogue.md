# Spec: Generated Verdict Epilogue

Status: SPEC ONLY — not implemented. Craig flagged this as "amazing but difficult"; this spec
checks that instinct against what the codebase actually has to work with, and scopes it.

## The idea

Instead of a run's ending being one of the fixed titles in `ENDINGS_GALLERY`, compose a short,
genuinely unique closing "how would history judge you" essay from the specifics of that run —
so two runs that land on the same named ending still read differently.

## The good news: the raw material already exists

`evaluateObjectives()` (src/App.jsx, ~line 13071) already computes exactly the kind of
material a verdict needs, it just spends it on unlocking two objectives instead of producing
prose:

```js
const comparable = (log || []).filter((e) => e.histSum != null);
const matched = comparable.filter((e) => e.isHistorical).length;
const outperformed = comparable.filter((e) => e.sum > e.histSum).length;
const rolls = (log || []).filter((e) => e.rollP != null);
const compound = rolls.reduce((a, e) => a * e.rollP, 1);
```

That's a per-run "how closely did you track the historical record," "how often did you
outperform it," and "how statistically unlikely was your exact dice path" — already computed,
already sitting in `log`/`flags`/`meters` by the time a run ends. This is the same shape of
input `check-pace-text.js` and the epilogue's own `dateClause` system already turn into prose
today, just not at this level of per-run specificity.

## Proposed design: templated clause selection, not free generation

Important framing choice: this should **not** be an attempt at open-ended generative text (no
LLM call at runtime — this is a static client-side artifact with no backend, and even if it
had one, unconstrained generation risks incoherent or historically-wrong prose shipping
unreviewed). Instead, a `composeVerdict(ctx)` function, sibling to `evaluateObjectives`, that
assembles a paragraph from a small set of hand-written clause variants, each selected by a
threshold on the same inputs above — the same technique the epilogues already use for
`dateClause`, just with more clause slots:

- **Opening clause** — keyed by `matched / comparable.length`: near-total agreement with the
  record / a mixed record / consistent divergence from it.
- **Resource clause** — keyed by final `meters` (an army preserved vs. spent thin vs.
  something in between).
- **Rarity clause** — keyed by `compound` (an ordinary run vs. a statistically unlikely path,
  reusing the same threshold `againstOdds` already uses).
- **Closing clause** — keyed by which `OBJECTIVES` this run actually earned, picking the most
  notable one to reference by name.

Each clause slot has, say, 3-4 hand-written variants per campaign. The verdict is the
concatenation of one variant per slot — combinatorially many distinct outputs, but every
individual sentence was actually written and reviewed, not generated at play time.

## Why Craig's "difficult" instinct is right, and where the actual risk is

Not the code — the risk is clauses reading naturally in every combination without
contradicting each other (an "outperformed the record" opening clause next to a "spent thin"
resource clause needs to not read as contradictory, for instance). This needs the same kind of
verification discipline the project already applies elsewhere: generate the verdict text
across many simulated flag/log combinations (the same randomized-playthrough harness
`check-outcome-sign.js` and `check-reachability.js` already use) and eyeball a representative
sample for nonsense before shipping, rather than trusting clause design alone.

## Scope estimate

Bigger than the Grand Campaign plumbing, smaller than a new campaign. Clause-authoring is the
real cost: roughly 4 slots × 3-4 variants × 3 campaigns ≈ 40-50 short hand-written clauses,
plus a verification pass modeled on the existing audit scripts. Recommend prototyping with
just the German campaign's clause set first and reviewing actual generated output with Craig
before writing the Soviet/Allied variants.
