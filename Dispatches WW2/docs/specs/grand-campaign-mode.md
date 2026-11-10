# Spec: Grand Campaign Mode

Status: SPEC ONLY — not implemented. Flagged by Craig as the highest-value replayability item
and also the most complex to build; this doc scopes it before any code gets written.

## The idea

Chain the three commands (German/OKW, Soviet/STAVKA, Allied/SHAEF) into one continuous
timeline, where the flags and outcome of one campaign's run seed the starting state of the
next. Right now "play all three" is tracked (`record.campaignsPlayed`, the `threeCommands`
objective) but the three runs are otherwise independent — nothing about how your German war
went can ever touch your Soviet run.

## Why this is the highest-leverage item on the list

It's the only item in the whole brainstorm that changes what *replaying* means, rather than
adding more content to replay through. Everything else (a new campaign, new choice types, new
endings) is more of the same kind of thing. This makes a second playthrough structurally
different from the first.

## What's missing today (the actual gap)

`pickCampaign(id, playMode)` in `WW2CommandInner` (src/App.jsx, ~line 13364) always seeds:

```js
const seedFlags = playMode === "purge" || playMode === "coalition" ? { hardMode: true } : {};
setFlags(seedFlags);
setMeters(EMPTY_METERS);
```

There is no path today to seed non-empty flags/meters from a prior run. More importantly:
`saveRunRecord()` (~line 13156), which fires when a run ends, only writes a **summary line**
to `record.runs` — `{ when, label, endDate, mode }` — not the run's actual final `flags` or
`meters`. The full end state of a completed run is discarded. That's the real gap; the
UI/flow wiring around it is comparatively minor.

## Proposed design

**1. Capture a "legacy" snapshot at run end.** Alongside the existing `saveRunRecord()` call,
persist the completed run's actual final `flags` and `meters` keyed by campaign, e.g. a new
`record.legacy = { german: { flags, meters, endDate }, soviet: {...}, allied: {...} }`. Only
the most recent completion per campaign needs keeping — this isn't a history, just "what's
available to carry forward right now."

**2. A curated translation layer, not a raw flag dump.** Most flags are campaign-specific and
meaningless outside their own campaign (`dunkirkResult`, `berlinAssault`, etc.). Transplanting
the whole flags object wholesale into a different campaign would produce nonsense states.
Instead: a small, hand-written `GRAND_CAMPAIGN_SEEDS` table, one entry per campaign transition
(german→soviet, soviet→allied, etc.), each a pure function
`(priorLegacy) => ({ seedFlags, seedMeters })` that reads a handful of *specific* flags from
the prior campaign's legacy and translates them into a handful of new flags the next
campaign's nodes are written to recognize (e.g. `flags.legacyNavyIntact`,
`flags.legacyMoscowFell`), plus a small meters nudge (±1, not a wholesale transplant).

**3. UI.** SelectScreen gets a "Grand Campaign" entry point, available once at least one
campaign has a `record.legacy` entry. Recommend a **fixed chronological order** (German →
Soviet → Allied) rather than player-chosen order — it matches the actual war's timeline and
avoids the combinatorial mess of writing seed translations for every possible pairing (6
orderings × transitions vs. 2 fixed transitions). Picking "Grand Campaign" runs the same
`pickCampaign` flow, but seeded via the relevant `GRAND_CAMPAIGN_SEEDS` entry instead of `{}`.

**4. Content: this is where the real cost is, not the plumbing.** Each campaign needs new
`flags.legacyX`-conditional prose in a handful of early nodes — acknowledging the carried-over
state in `situation` text, and in one or two cases a genuinely different choice or gate. This
is the same technique already used throughout the game for `flags.dunkirk === "push"` style
branching; nothing new to build, just more of it, aimed at legacy flags specifically.

**5. A capstone.** Recommend a Grand Campaign completion gets its own closing beat, in the
same "dossier" aesthetic as the just-shipped Full Clearance unlock — since Craig cares about
this being the flagship replayability feature, it should feel like one when finished.

## Scope estimate

- Plumbing (legacy capture, seed-translation table, SelectScreen entry point, seeded
  `pickCampaign`): mechanical, maybe a day's focused work.
- Content (legacy-aware prose in early nodes of each campaign, enough to feel real rather than
  cosmetic): the actual cost driver. Recommend scoping to **4-6 curated legacy flags per
  transition** rather than trying to make "everything" carry over — probably touches 10-15
  nodes across the three campaigns for a first version.

## Open questions for Craig before implementing

1. Fixed chronological order (recommended above), or does the player choose the order to play
   the three commands in?
2. Does a Grand Campaign run need to be startable independently of having "spare" completed
   runs sitting in `record.legacy` — i.e., does picking "Grand Campaign" force you to play
   German first if you have no german legacy yet, or does it require having already completed
   at least one command normally first?
3. How much should a later leg's *outcome* depend on the earlier leg (a real strategic
   consequence), versus just flavor-text acknowledgment? The above design supports either —
   worth deciding up front since it changes how many meters-nudges vs. flags-only seeds get
   written.
