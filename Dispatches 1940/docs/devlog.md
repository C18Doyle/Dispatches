# Dispatches 1940 — Devlog (pre-V6 baseline)

Dispatches 1940
*Devlog — Initiative, and a bug a player found*

A player posted on the community board that their best-played Soviet run — most men conserved, furthest ahead of schedule, hitting a “Berlin, February” milestone in 1944 — still ended in November 1945. They asked whether the window to finish early was accidentally too narrow.

It wasn’t the window. Two functions computed the same thing with opposite signs. The mid-game date stamp shifted one way, the ending calculation the other, so the game told them they were ahead and then scored them as slow.

Fixing it exposed the real problem. The time meter was neutral by design — positive meant later — which let it serve three commands that want opposite things. But that neutrality meant playing carefully drove it positive, which pushed the ending later. Careful play was penalised on the calendar in all three campaigns, and the most common Soviet ending was the latest date on the board.

So time is now initiative: how much you’re setting the terms rather than answering them. High is good for everyone. STAVKA and SHAEF convert it to an earlier finish; OKW doesn’t convert it at all, because German duration doesn’t work that way — that army lengthens its war by yielding and shortens it by attacking, so its end date now derives from the decisions that actually record duration. The audit ran to 59 sign changes across 247 values.

Also this update: surplus now buys something. Bank manpower, fuel and initiative and new decisions unlock — skipping Kharkov’s recapture entirely in ’43, dumping supply forward before Bagration, declining the Seelow battle and enveloping Berlin instead, opening Antwerp in September at the cost of every other autumn offensive. Several open onto genuinely new endings.

New nodes on the German line: the Uranium Club funding decision (it fails, and the outcome text explains why money was never the constraint), the Kesselring–Rommel argument over where Italy gets defended, and the Stockholm channel — the documented 1943 Soviet peace feelers, with the historians’ disagreement about Stalin’s seriousness left as a disagreement.

And a pile of unglamorous fixes: 20 Soviet ending titles that were written, wired, and unreachable because a first-match-wins chain was ordered wrong. Reachable endings went from 20/8/9 to 45/34/27.

Main changes, from the map upgrade forward

The node-graph map

Replaced the old chit-grid “Theater Status Board” with a spatial map: real region coordinates, land-only borders, size tiers by narrative weight.

One deliberate exception to land-only borders: Denmark–Norway, the actual invasion route.

Fixed the map showing outcomes of decisions not yet made — MAP_YEAR_STATUS snapshots are year-end, so Norway appeared Axis before the invasion was ordered. Now capped to the previous year’s close until the current node resolves.

Known gap carried forward: a number of nodes still have no NODE_HIGHLIGHT_REGIONS entry and simply don’t highlight. Not broken, just incomplete.

Zoom-to-decision camera animation attempted and abandoned twice; the map rings the relevant region but does not pan or zoom.

Accessibility, build and platform

Fixed the window.storage API not existing in real browsers.

Full accessibility pass: reduced-motion support, keyboard navigation on the map, mobile zoom unlock.

Built the esbuild + Tailwind pipeline from scratch, verified against the shipped bundle.

DEMO_BUILD as a single build-time flag producing both demo and full variants from one source file.

Historical accuracy

Corrected advisors quoted after their real wounding or reassignment — Rommel and Model replaced with Kluge and Speidel, the officers actually present.

New researched content: Tannenbaum, Mussolini’s rescue, Finland’s armistice, Romania’s defection, V-weapons production, Heydrich and Lidice, the Vlasov question, Rommel’s forced suicide, Convoy PQ-17.

Settled atrocities and death tolls remain narrated fact — never dice rolls, never player-optimisable.

The time → initiative switch

The reported bug: shiftDateForPace and projectedEnd used opposite signs, so mid-game dates and the ending contradicted each other.

The deeper problem: banking meters produced the latest possible ending in all three campaigns. Careful play was penalised.

The rename: 581 impact keys, 55 meter reads, METER_NOTES, UI labels, the state setter and the notes lookup.

Per-campaign conversion: campaignPaceDirection() — STAVKA and SHAEF convert initiative to an earlier finish; OKW returns 0.

German duration decoupled: a new endurance() method reads the flags that actually record how long the war ran — dispersal, delivery delay, atomic path, final stand, north stand, surrender path — plus manpower at low weight.

The content audit: 59 sign changes across 247 values (German 35, Allied 13, Soviet 11), applied by verified file offset.

Re-keyed to endurance: the four German duration titles, the epilogue date and occupation clauses, the atomic note, and the Long Defense objective — all of which had been rewarding the opposite run.

METER_NOTES rewritten for all three campaigns: who is dictating, rather than who has calendar slack.

Endings and reachability

The core bug: positionLabel is a first-match-wins chain and was ordered arbitrarily. Broad flags near the top shadowed everything below — 20 Soviet titles matched thousands of runs and won zero.

Allied was worse: battleOfBritain40 and darlanDeal42 are set in essentially every run and sat mid-chain, killing ten titles below them.

German: atomic45 and finalStand were nested inside a pathVariant that always matched, so the specific ending could never out-rank the branch containing it.

Reachable titles: 20/8/9 → 45/34/27, measured across simulated playthroughs rather than assumed.

Dead content removed: the intermediate meter-derived fallback titles could only fire when no flag matched, which never happens. Deleted, along with the eight gallery entries they orphaned.

Gallery: 16 new entries, integrity-checked so every label maps to a string a campaign can actually return.

New forks and surplus gates

Kharkov ’43: skip the recapture entirely and press past toward the Dnieper — unlocked only by banked manpower and initiative.

Bagration: delay a fortnight to push supply echelons forward, so the offensive stops where you choose. Pays off at Warsaw, where the logistics defence for the historical halt is no longer available.

Vistula–Oder: the “Berlin in February” fork now genuinely branches instead of both outcomes routing to the same node, opening a new March 1945 ending.

Berlin assault: decline the Seelow battle entirely and envelop from two directions with a surplus army.

The Scheldt: open Antwerp in September and subordinate every other autumn offensive to it — the argument Eisenhower’s logisticians made and lost.

Western collapse: take Army Group B’s surrender early and face the Casablanca question under the one pressure that makes bending it tempting.

Dispersal: Speer’s answer to the bomb, extended to an entire society — written so it cannot read as a win.

New German nodes

The Uranium Club: fund the atomic programme at scale and watch it fail. Money was never the binding constraint — the graphite measurement error, the heavy-water dependency, no reactor critical, no separation plant.

Where Italy Is Held: the Kesselring–Rommel argument, previously present only from the Allied side.

The Stockholm Channel: the documented 1943 peace feelers, with the dispute over Stalin’s seriousness stated as a dispute rather than resolved.

Contested delivery: if the fighter arm was genuinely reserved, the American delivery problem becomes real. Weighted honestly against the likelier outcome.

Prose and presentation

Fixed 16 outcome texts rendering as lowercase sentence fragments.

Removed the self-referential narrator — “This campaign records…”, “the campaign should say…” and the historiography lectures attached to them.

Replaced 25 instances of “The projection…” as a narrator opener with individually varied in-frame alternatives.

Continued the prose-tic cleanup: “genuinely”, “for once”, and “the question is/becomes” as a structural template.

Validation

Behavioral sweep is the shipping gate: every change validated against 72/44/48 nodes, zero resolve errors, zero dead ends, zero unresolved targets.

NODE_TOTAL corrected from a stale 171 to an actual 189, counted from source rather than estimated.

Flag audit: every flag added has a downstream read. No write-only flags.

Objectives audit: all 23 awarded somewhere, none awarded that isn’t defined.

Outstanding: no browser or Playwright verification pass on this round of changes.

