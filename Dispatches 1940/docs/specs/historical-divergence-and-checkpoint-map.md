# Spec: Historical Divergence Mode ("Historically Accurate Opponent" toggle) + Checkpoint Map

Status: **BUILT and Playwright-verified (2026-09-14), through a 10th round covering comprehensive
historical-accuracy/reactivity work, five follow-up passes of visually-spotted map-art bugs, and
two map-completeness additions** — see "Build notes: what actually shipped" at the end of this doc
for the as-built detail, including the 3 places implementation diverged in small ways from the plan
below, the "Round 4" paragraph after it (Turkey as a full region, the Vichy demarcation line,
landmark pins, region/city labels, click-to-inspect divergence tooltips, the current-node region
highlight, a real divided-status split-fill, and a change-since-last-look flash — full detail in
`README.md` item 34), the "Round 5" paragraph after that (overlapping region colors blending into
a wrong third color, stale baked-in political borders, and a gap in the USSR's coloring near the
Arctic — full detail in `README.md` item 35), the "Round 6" paragraph after that (colored sea and
gaps between region shapes, fixed with a land/sea pixel mask rather than more vector-precision
chasing — full detail in `README.md` item 36), the "Round 7" paragraph after that (Bulgaria
and Albania added as full regions, plus an accuracy review with recommendations for anything
bigger — full detail in `README.md` item 37), the "Round 8" paragraph after that (Malta
promoted to a full region, a real border-topology bug found and fixed at the Poland/Germany/
Czechoslovakia corner, and the double border line/coastal outline removed — full detail in
`README.md` item 38), the "Round 9" paragraph after that (a real Baltic coastline gap closed,
the gap-closing pass generalized to catch coast-touching voids rather than only fully-enclosed
holes, and two suspected bugs investigated and ruled out — full detail in `README.md` item 39),
and the "Round 10" paragraph after that (Italy's map bbox re-centered, and a real Caucasus/
Central Asia coloring gap closed — after a false start splitting out Ukraine as its own region,
which Craig corrected and which was fully reverted — full detail in `README.md` item 40). The
design sections that follow are left as
originally written (the plan this was built from), not rewritten after the fact. Recommend reading
`grand-campaign-mode.md` first — this spec reuses several of its patterns (legacy-style seed
flags, a curated translation table instead of a raw dump) and is easiest to compare against it
directly.

**Scope note confirmed with Craig (2026-09-12): the upcoming build session covers this spec
only — Historical Divergence Mode + Checkpoint Map. Grand Campaign's full content pass is
explicitly not part of it**, even though both features share the seeding pattern. Treat them as
sequential, independent build sessions.

**Decisions confirmed with Craig (2026-09-12), before any code:**
- Italy is in scope (it already was in this spec's candidate list — confirmed, not new).
- The toggle is available at every difficulty tier (Elefant/Standard/hard modes alike), not
  restricted.
- All forks roll at even odds (50/50) to start — no per-fork probability tuning for v1.
- **Forks may change which ending is reachable** — Craig chose the larger-scope option over
  keeping this contained to flavor/meters. See the new "Endings impact" section below; this
  changes the scope estimate and adds a prerequisite audit step before the build starts.

## The idea, in one paragraph

Add a per-campaign War Room checkbox, "Historically Accurate Opponent" (ticked by default —
today's behavior). Unticking it silently pre-rolls a small, curated set of "divergence forks" —
moments where the *other* side does something other than what actually happened, independent of
anything the player chose. Each fork that fires is announced in-fiction via a new variant of the
existing Wire Bulletin, marked on a small checkpoint map, and changes a short, locally-contained
chain of nodes rather than the whole campaign. The toggle unlocks per campaign after the player
has completed one historically-accurate run of it.

This directly answers the open question sitting in the baseline doc since several rounds ago —
"what should 'special events' mean, distinct from the Wire Bulletin service" — the divergence
bulletin *is* that answer: same visual component, a different, flag-triggered content table.

## Why this is a different mechanic than anything already in the game

`uncertain[]` branches make the *consequence of the player's own choice* uncertain — the player
picked something, then a die decided how well it went. This is not that. A divergence fork is
uncertain regardless of what the player does on their own side; it comes from outside the
choices in front of them, the same way a real war correspondent could never have controlled
whether Stalin evacuated Moscow or whether the SS Panzer Corps happened to be refitting near
Arnhem. That's what makes it read as suspense rather than dramatic irony, the problem Grand
Campaign's legacy seeds have (the player authored both ends of that link and always know what's
coming). It needs to stay genuinely hidden until the moment it lands, or the whole point is lost.

## Proposed design

**1. Roll silently at campaign start, reveal deep in the tree.** No new engine capability is
needed for this — it's the same `pickCampaign(id, playMode, seed)` seeding pattern Grand
Campaign already added, just with a randomized seed instead of a legacy-derived one, and with
the seed *not* shown to the player anywhere (no briefing text says "a divergence is active" —
contrast with Grand Campaign's seeds, which are narrated up front on purpose). Each campaign
gets its own small `DIVERGENCE_FORKS` table (mirrors `GRAND_CAMPAIGN_SEEDS`'s shape): one entry
per fork, each an independent Bernoulli roll (recommend even odds to start, tunable later) that
sets one flag, e.g. `forkNorwayHeld`, `forkMoscowHolds`, `forkArnhemUncontested`.

**2. Each fork gets a short, locally-contained downstream chain, not a single node.** Craig's
own steer here: some downstream awareness is needed, not just a flavor-text swap at the moment
of the fork. Recommend 2-3 touched nodes per fork: the primary node where the divergence
first becomes visible (a materially different `situation`/choice set, not just a different
paragraph), plus one or two later nodes in the same campaign that check the same flag and
acknowledge the changed trajectory (an adjusted meter baseline, a changed gate, or at minimum a
paragraph that couldn't otherwise exist). This is the same order of authored depth as one Grand
Campaign transition seed (which touched 1 node) — a fork touching 2-3 nodes is a deliberate step
up, matching "just major, not every fork."

**3. Keep forks chronologically separated so they can't collide.** Because forks are rolled
independently (a campaign with 3 forks can land with 0, 1, 2, or 3 active in a given run), no two
forks' downstream chains should ever reach the same node — otherwise that node needs to handle
every combination of forks that could be simultaneously active, and the content cost stops being
linear. The candidates below are deliberately spread across each campaign's early/mid/late
nodes for exactly this reason. Recommend 3 forks per campaign as the starting scope (not the
hypothetical 5 floated in discussion) — enough to matter, few enough that "sometimes 2 fire,
sometimes none" stays a small, auditable combinatorial space (2³ = 8 states per campaign) rather
than an open-ended one.

**4. The reveal is a new Wire Bulletin variant, not a new UI.** `WireBulletin` (`src/App.jsx:12574`)
and its `WIRE_HEADLINES` table (`:13571`) already do exactly the presentation job needed — a
torn-paper full-screen card with a headline and dek. Add a second table, e.g.
`DIVERGENCE_HEADLINES`, one entry per fork (`{forkFlag, headline, dek}`), and a second trigger
path alongside `shouldShowWireBulletin`: instead of the existing ~1-in-7 probabilistic gate on
node id, a divergence bulletin fires deterministically, exactly once, the first time the game
renders a node past the fork's primary reveal point with that flag set. Visually indistinguishable
from a normal bulletin at a glance (deliberately — the surprise is in the content, not a special
color coding that would itself be a spoiler).

**5. Checkpoint map, sharing the same fork data.** Separate feature, explicitly meant to ship
alongside this one. Not a live/simulated territory map (ruled out earlier as its own much larger
project) — a small number of pre-drawn base map images per campaign, one per calendar year the
campaign actually spans (nodes already carry a free-text `date` field and a `yearFrom()` helper
already extracts the year, `:13612` — so the checkpoint years fall out of existing data, not a
new authoring structure). Real spans, confirmed from node dates rather than the campaign header
strings (which are inconsistent — Allied's header says "1942 — 1945" but its actual start node
`narvik40` is dated April 1940; worth fixing that label separately, unrelated to this spec):
German and Allied 1940-45 (6 snapshots each), Soviet 1941-45 (5), Italy 1940-45 (6). Each
checkpoint map is a mostly-static illustration with a small number of abstracted state markers
overlaid — shading or icons reflecting the three real meters (manpower/fuel/initiative) rather
than literal front lines, since most choices in this game are political/economic and have no
territorial meaning. Any fork whose reveal has occurred by that checkpoint year gets its own
small marker, reusing the same `{forkFlag, ...}` record the bulletin table uses, so a fork is
authored once and feeds both surfaces. This keeps the art budget to a fixed set of base maps
(~23 across all four campaigns) plus a small reusable marker-icon library, not a unique map per
possible fork combination.

**6. Endings impact (confirmed in scope, not just flavor/meters).** At least some forks should
be authored so that an active fork can plausibly swing which ending in `ENDINGS_GALLERY` is
reachable, not just texture the run. This needs an audit before the build starts, not during
it: nobody has yet mapped exactly how endings are currently gated (this spec's research pass
confirmed `evaluateObjectives()` computes comparable-decision/rarity material near the ending
logic, but did not trace the actual gating conditions for `ENDINGS_GALLERY` entries — that's now
a required first step, not an assumption). Recommend, once that audit is done, picking a small
subset of the 12 candidate forks below — likely 1 per campaign, the ones with the clearest
"this really would have changed how the war ended" logic (candidates: German's `moscowRace41`
fork, Soviet's `smolensk41` fork, Allied's `battleOfBritain40` fork, Italy's `eastAfrica41` fork)
— to actually carry ending-level weight, while the rest stay contained to flavor/meters as
originally scoped. Trying to make all 12 forks ending-capable would multiply the ending-gating
logic by every combination of active forks; picking one per campaign keeps that combinatorial
surface small (at most one ending-relevant fork active per campaign at a time to reason about,
even though up to 3 forks total can be active).

**7. Unlock condition.** Reuse the existing `record.campaignsPlayed` tracking (`saveRunRecord()`,
around `:16380-16401`) — the toggle for a given campaign is disabled (shown greyed out with an
explanatory note) in that campaign's War Room until `record.campaignsPlayed.includes(campaign.id)`
is true, i.e. until the player has completed at least one historically-accurate run of that
specific campaign. Worth flagging: this would be the first *save-gated* unlock in the mode
picker — `HARD_MODES_ENABLED` today is a static build flag, not actually keyed to save data
(the hard modes aren't really "unlocked" by anything right now), so this is new UI territory,
not a copy of an existing pattern, even though the underlying data already exists.

## Candidate fork locations per campaign

Picked for being genuine "the other side, not the player" moments — historically contingent
events that plausibly could have gone the other way — and spread across each campaign's
timeline so their downstream chains stay separated per point 3 above.

**German** (player is Germany — divergence = the Allies/Soviets do something unhistorical):
- `norway40` (Weserübung, 1940) — Allied forces hold out around Narvik longer than history,
  disrupting the Swedish ore route. Downstream: a fuel-meter penalty carried for the rest of the
  campaign, referenced once more in a mid-war naval/economy node.
- `moscowRace41`/`moscowFalls41` (1941) — Soviet defense of Moscow is more brittle than history
  (mirrors Craig's original framing, but scoped to one operational moment rather than "Barbarossa
  doesn't happen"). Downstream: changes the difficulty/framing of the following winter
  counteroffensive nodes.
- `torch42`/`elAlamein` (1942) — Allied Mediterranean strategy lands somewhere other than
  historically expected, or lands later. Downstream: shifts the following Tunisia-adjacent
  nodes' starting position.

**Soviet** (player is USSR — divergence = the Germans do something unhistorical):
- `border41` (June 1941) — Barbarossa launches later or with less prepared force than history
  (the actual historical delay was already the Balkans campaign running long; this fork pushes
  that further). Downstream: better starting meters through `smolensk41`.
- `smolensk41` (the historical Kiev diversion) — the German opponent doesn't divert south to
  Kiev and pushes straight for Moscow instead. Downstream: `moscowPanic41` plays out under
  materially worse starting conditions.
- `order227_42`/Stalingrad — the German opponent doesn't overextend into the city itself and
  consolidates earlier. Downstream: the Uranus counteroffensive nodes face a tougher, better-
  organized defense.

**Allied** (player is the Western Allies — divergence = the Germans do something unhistorical):
- `narvik40` (Craig's own original example) — Norway is genuinely held. Downstream: changes the
  framing of the following Battle of Britain nodes (a stronger opening position).
- `battleOfBritain40` — the historical German switch from airfields to city bombing (the
  decision that arguably saved the RAF) doesn't happen; the Luftwaffe stays on Fighter Command's
  airfields longer. Downstream: makes a later Sea-Lion-adjacent node a live threat rather than a
  historical footnote.
- `marketGarden44`/`arnhemPerimeter44` — the II SS Panzer Corps isn't refitting near Arnhem (a
  real historical stroke of bad luck for the Allies that easily could not have happened).
  Downstream: Market Garden's outcome and the following Rhine-crossing framing shift.

**Italy** (player is Italy — divergence = the Allies/Commonwealth do something unhistorical):
- `greeceDecision40`/`greeceWinter40` — Greek and Commonwealth resistance is notably weaker (or
  stronger) than history. Downstream: shapes the following Alps/Balkans-front framing.
- `eastAfrica41` (Ethiopia theatre) — the British Commonwealth counteroffensive is slower to
  materialize than it was historically. Downstream: extends Italy's East Africa position into a
  later node that historically had already been lost by that point.
- `convoyWarMalta41`/`herculesExecution41` — British Malta's defense and resupply convoys
  perform worse than history. Downstream: changes the framing of the following Mediterranean
  convoy-war nodes.

## Scope estimate

- Plumbing (per-campaign `DIVERGENCE_FORKS` table, seeded roll at campaign start, save-gated
  toggle UI in `WarRoomScreen`, second Wire Bulletin table + deterministic trigger path, base
  checkpoint-map rendering keyed off `yearFrom()`): comparable to Grand Campaign's plumbing —
  roughly a day, since most of the underlying pattern (seeding, flag-conditional branching,
  Wire Bulletin rendering) already exists.
- Content is the real cost, larger than Grand Campaign's: 3 forks × 4 campaigns × ~2-3 touched
  nodes each ≈ 30-36 authored node touches, plus 12 divergence bulletin entries, plus ~23 base
  map illustrations and a small marker-icon set, plus (per the endings-impact decision above) an
  ending-gating audit and new gating logic for the 4 forks chosen to carry ending weight.
  Recommend prototyping one campaign's 3 forks fully (German, since it has the clearest
  candidate set above) before committing to all four — and doing that prototype's fork as one of
  the ending-capable ones, so the harder ending-gating problem gets tested early rather than
  saved for last.

## Open questions for Craig

1. Confirm the recommended per-campaign fork picks above, or swap any for different historical
   moments — the list was picked for spread and clarity, not because these are the only, or
   necessarily the best, candidates in each tree. (Tentatively confirmed for Italy specifically;
   not yet explicitly confirmed for the other three.)
2. Once the endings audit (section 6) is done: do the four proposed ending-capable forks
   (German `moscowRace41`, Soviet `smolensk41`, Allied `battleOfBritain40`, Italy `eastAfrica41`)
   look right, or should different forks carry that weight?
3. Should the Allied campaign's header date string ("1942 — 1945", inconsistent with its actual
   April-1940 start) get fixed as a small drive-by correction, or left alone since it's unrelated
   to this spec?

**Resolved (2026-09-12):** difficulty-tier availability (all tiers), per-fork probability (even
odds), whether forks can affect endings (yes), and whether Grand Campaign is part of this build
session (no, separate).

## Build notes: what actually shipped (2026-09-13)

All 12 forks, all 4 ending-capable titles, and the checkpoint map were built exactly as scoped
above, in one pass across all four campaigns (Craig: "do it all," rather than the staged
German-first approach recommended in the scope estimate). Three implementation details worth
recording against the plan above:

1. **Three downstream nodes were reassigned from what a literal reading of "Candidate fork
   locations" implies**, to hold the point-3 containment rule ("no two forks' downstream chains
   should ever reach the same node") exactly: `border41`'s natural downstream would have been
   `smolensk41` — but `smolensk41` is fork #2's own primary node, so `border41`'s downstream
   acknowledgment moved to `leningrad41` instead. Same collision, same fix, for `narvik40`
   (natural downstream `battleOfBritain40`, itself fork #2's primary node → moved to `dunkirk40`)
   and `greeceDecision40` (natural downstream `eastAfrica41`, itself fork #2's primary node →
   moved to `alpsFront40`). Each fork's own primary/reveal node is unchanged from the list above
   — only the second, acknowledgment-only node moved, and only for these three forks.
2. **The 3 forks sitting on a campaign's own opening node** (German `norway40`, Soviet
   `border41`, Allied `narvik40`) needed a small addition point 4 didn't anticipate: the
   deterministic reveal trigger lives in `chooseOption`, which only runs on a *transition*
   between nodes — it can never fire for the very first node, since the player hasn't chosen
   anything yet to trigger it. Special-cased directly in `enterWarRoom`: immediately after
   rolling forks, it checks whether any rolled-true fork's reveal node equals the campaign's own
   `start` and routes straight to the wire screen before the first briefing if so.
3. **Point 3's "an audit... needed before the build starts"** was done via a research pass that
   confirmed `positionLabel` functions already read early-run flags at the very end to pick a
   title (documented in-code as each function's own rarest-first ordering convention) — meaning
   no new engine mechanism was needed for ending-capable forks; they're gated exactly the same
   way any other rare title already was, just with an added fork-flag condition.

Placeholder checkpoint-map art (23 images, Pillow-generated, watermarked) shipped per Craig's
explicit choice this round over blocking on real/commissioned art — see
`tools/generate_placeholder_maps.py`. Full verification detail, including the Playwright
scenarios run and the one known `npm run check-reachability` false-positive (the harness can't
set pre-game War-Room-toggle flags, so it reports all 4 new endings as unreached even though
each is reachable in real play), is in the working tree's `README.md`, item 33.

**A second playtest pass (Craig: "playtest it first," before agreeing to commit) found and fixed
a real bug** in exactly the collision-avoidance work described in point 1 above: 2 of the 3
reassigned downstream nodes (Italy's) turned out to be chronologically *before* their fork's
primary reveal node, not after — graph reachability (the only thing checked at build time) and
chronological order aren't the same property. `alpsFront40` and `compass40` were fixed to
`greeceWinter40` and `rommelAdvance41` respectively. Full root-cause and fix detail in
`README.md` item 33's second verification section — worth reading before repeating this
collision-avoidance pattern on any future fork work, since the failure mode is easy to reintroduce
without a chronology check, not just a reachability check.

**Round 2 on the placeholder map art**: Craig's feedback on the v1 Pillow-only maps ("don't look
like the European theatre and more just blobs") was correct — v1 drew a synthetic wandering
polygon, not real geography. `generate_placeholder_maps.py` now renders actual coastlines/borders
via `mpl_toolkits.basemap` + the offline `basemap-data` package (chosen because this environment's
proxy blocks the ad-hoc CDN fetches that newer geo libraries like `geodatasets` need at runtime),
then composites the same aged-paper/accent-wash/compass-rose/watermark treatment on top as before.
Node map (`EuropeMap`/`TheaterGraph`) stays primary per Craig's instruction; this only touched
Checkpoint Map's base art. Full detail — per-campaign bounding boxes, the modern-vs-1940s-borders
caveat, the palette-quantize size win (7.7MB → 3.4MB) — in `README.md` item 33's follow-up section.

**Round 3 — ownership coloring, reusing MAP_YEAR_STATUS.** Craig asked to color each region by
owner with historical borders. No offline 1938-45 boundary dataset exists (checked), so borders
are modern country outlines (`world-atlas` via npm, dissolved with shapely into `MAP_REGIONS`'
own aggregate groups) except Poland/Germany/Czechoslovakia, hand-approximated from historical
knowledge since their real WWII shape differs enough from today's to matter — not traced from an
authoritative source, flagged as such in `tools/build_region_geometry.py`'s header. Coloring is
live, not baked into the PNG: a new `CheckpointMapRegions` SVG overlay reads the *same*
`MAP_YEAR_STATUS`/`mapOverrides()` the schematic map already uses, reprojected onto real geometry
with a JS reimplementation of Basemap's own Mercator math, so the two maps can't disagree and a
Historical-Divergence-Mode run's own territorial changes show up on Checkpoint Map too. Caught and
fixed one spoiler risk before it shipped: `MAP_YEAR_STATUS` entries are year-end snapshots, so
showing a node's own year before its choice is resolved would leak that choice's outcome —
replicated EuropeMap's existing previous-year-close cap rather than assume it didn't apply here.
Full account — the two concept-stage forks Craig chose between, the geometry pipeline, what's
mechanical-and-safe vs. hand-approximated, and the verification (including a live Playwright
check that flipping the Tannenbaum-invades-Switzerland flag actually recolors the region with no
art regenerated) — in `README.md` item 33's third follow-up section.

**Round 4 — comprehensive historical-accuracy and reactivity pass.** Craig asked for a
comprehensive review of both maps for historical accuracy, reactivity to the player's own run,
and player-experience improvements, then authorized building everything from that review except
the one item flagged as the largest optional swing: a "compare to the real historical timeline"
alternate-history toggle/slider, which stays explicitly out of scope. The review surfaced a real
bug worth calling out on its own: `mapOverrides()` — the single function both maps read to color
a run — had never been wired to read any of the 12 Historical Divergence fork flags from Round 1,
meaning a run with active forks rendered identically to a fully historical one. That's now fixed,
alongside nine other items: Turkey added as a full 25th region (previously a Greece stand-in for
its two `NODE_HIGHLIGHT_REGIONS` entries), the Vichy/occupied-zone demarcation line, four Med.
landmark pins (Gibraltar/Malta/Crete/Dodecanese), region name labels (`regions.json`'s schema grew
a `representative_point()`-derived label anchor per region), a curated 12-city orientation layer,
click-to-inspect tooltips reusing `mapOverrides()`'s previously-discarded `notes` array (mirroring
`EuropeMap`'s existing pattern exactly), a current-node region highlight via the
`NODE_HIGHLIGHT_REGIONS` table `EuropeMap` already had but `CheckpointMap` never received, a real
west/east split-fill gradient for "divided" status (Germany/Austria, end of 1945) replacing a flat
placeholder color, and a three-pulse flash on any region that changed color since the player last
closed the map. Full account of each item and how it was verified — including forcing
`Math.random` around just the War Room fork roll to deterministically prove a fork's territorial
nudge renders live, and a full playthrough trace confirming the change-flash fires on exactly the
regions that actually changed at each year rollover, with zero false positives — in `README.md`
item 34.

**Round 5 — three visual defects Craig spotted by eye.** Overlapping region colors blending into a
third, wrong color at their shared edge; the base-map art's baked-in modern political borders
staying visible (and, for the three hand-authored WWII-era regions, actively mismatched) as the
game's own front lines move; and a large gap breaking up the USSR's coloring in its northern
reaches. All three were data/art-pipeline bugs, not `src/App.jsx` bugs: the color-overlap traced to
`regions.json` polygons genuinely double-claiming the same ground (Poland's 1938 borders vs. the
modern-country shapes `ussr`/`baltics` dissolve from, worst case 13.7 sq. degrees of real overlap),
fixed by making the hand-authored regions authoritative and subtracting their area out of anything
mechanical that overlapped them; the borders issue traced to `generate_placeholder_maps.py` calling
Basemap's `drawcountries()`, removed outright since the dynamic SVG overlay already draws its own
per-region border correctly for whatever year is showing; and the USSR gap traced to Russia's raw
source geometry crossing the antimeridian and being silently truncated at 65°N by the previous
pipeline's `buffer(0)` repair, fixed with a targeted per-part longitude-unwrap before re-validating
so the real Arctic coast (up to 80.9°N) survives. No spec-level design change — full root-cause
detail and before/after verification numbers in `README.md` item 35.

**Round 6 — colored sea and gaps between shapes, fixed with a pixel mask instead of more vector
tuning.** Craig, looking again: colored water and random gaps between region shapes; proposed
rule: "the sea blue needs to be uncovered and the rest covered." Root cause was structural, not a
tuning problem: `regions.json`'s polygons and the background art's own coastline come from two
independent datasets that were never going to align exactly, and every region is simplified with
no shared topology with its neighbors, so borders drift slightly in both directions at once (gap
in one stretch, overlap in the next). Rather than continue chasing tighter vector agreement
between two unrelated data sources, took Craig's proposed rule at face value: a per-campaign
land/sea mask image, generated from the exact same Basemap call as the real background art, is
now used as an SVG `<mask>` on the color-fill layer — sea is unconditionally excluded regardless
of any polygon's precision. That made it safe to also grow every region's shape back out slightly
to close the land-side gaps (the mask cleans up any resulting overshoot into open water), combined
with switching the fill layer from per-path semi-transparency to one shared semi-transparent group
(any overlap the growth creates between neighbors now just shows whichever is drawn on top, not a
blended color). Verified with a standalone rasterize-and-compare script, not just by eye: land left
uncolored near an actual region dropped to 1.8-2.8% across the four campaigns (mostly coastal-edge
slivers, not border seams), and sea coloring is now a hard zero by construction. Full detail in
`README.md` item 36.

**Round 7 — Bulgaria and Albania added, plus an accuracy review.** Craig: "I think we need to add
Bulgaria and Albania to the map for completeness and can you do another pas to improve the
accuracy of the maps recommend any improvements." Both added as full `MAP_REGIONS` — mechanical
dissolves of their modern country outlines (same treatment as Turkey in round 4, not a hand trace
like Poland/Germany/Czechoslovakia — both countries' modern and WWII-era borders are close enough
that no historical-accuracy risk was introduced), wired into `MAP_GRAPH_EDGES`,
`MAP_REGION_SIZE`, `THEATERS`, and all seven `MAP_YEAR_STATUS` year tables with historically
researched per-year statuses (Albania Italian-occupied from 1939, Bulgaria neutral until its
March 1941 Axis accession, both tracking the wider war's status shifts through 1945). No bbox or
base-map changes were needed — all four campaign bboxes already cover both countries' extent —
and the round-5/6 mask-and-buffer geometry pipeline absorbed both new regions with zero pipeline
code changes, regenerating cleanly from 25 to 27 regions. Three `NODE_HIGHLIGHT_REGIONS` entries
were updated after auditing every node that discusses either country by name (Italian
`greeceDecision40`/`greeceWinter40` now include `"albania"`, Soviet `balkans44` now includes
`"bulgaria"`); several neighboring Balkans nodes were checked and deliberately left unchanged for
lacking any textual reference to either new region. The accuracy-review half of the request
produced recommendations, not further changes: notably, extending the map east to cover the
Persian Corridor/Suez-adjacent Middle East (Iraq/Iran/Syria/Palestine) that several campaigns'
text already references, and whether Malta's narrative weight ever justifies promoting it from a
landmark dot to a full colorable region. Full detail, including the complete recommendations
list, in `README.md` item 37.

**Round 8 — Malta, a real border-topology bug, and the double-line/coastal-outline stroke
removed.** Craig, with two screenshots of the Poland/Germany/Czechia/Austria/Hungary/Yugoslavia
corner: "Let's do the Malta and then a better pass at the Poland/German/Czech/Hubgary and
Yugoslavia borders. Also we don't need the little black outline just around the countries
especially the sea. Any double border black lines should be clamped together into one and there
should be little beige gaps between the bigger counties unless a country border." Malta added as a
full `MAP_REGION` (round 7's own recommendation): required switching the geometry pipeline's source
dataset from `world-atlas`'s 110m to 50m resolution (Malta doesn't exist at all below 50m, along
with Andorra/Monaco/Vatican/Liechtenstein), fixing a sliver-filter that was dropping Malta's whole
~0.03 sq degree area as noise, and — the deeper fix — discovering that the campaign base-map
art's own land/sea mask (rendered separately via `mpl_toolkits.basemap`) was dropping Malta
entirely at its `resolution="l"` area threshold, so the region could have correct data and still
render as literally nothing; fixed by regenerating all four campaigns' base art at
`resolution="i"`, plus a small always-visible status-colored dot for any region too small to read
at this map's scale. The border "better pass" started as planned — replace round 6's
independently-simplified-and-buffered regions with `topojson.Topology()`'s shared-topology
simplification, so a border shared by two regions is one arc instead of two independently-drawn
near-misses — but that alone didn't close Craig's flagged gap, because shared-topology dedup only
works when the input coordinates already coincide exactly, which hand-authored-vs-mechanical and
hand-authored-vs-hand-authored borders never quite do. Measuring directly (every fully-enclosed
hole in the union of all regions) found 16 real gaps this way, the largest exactly at the Poland/
Germany/Czechoslovakia tripoint Craig flagged, plus 4 correctly-unmapped microstate voids that
needed to stay open. A new `close_interior_gaps()` pass closes the 16 real ones automatically (by
construction, from the hole's own boundary — no hand-picked coordinates) while leaving the 4
microstates alone. The double-line/coastal-outline removal fell out of the same topology rewrite:
a new deduplicated `__interiorBorders__` line list is drawn once for the ordinary case instead of
every region stroking its own outline, so a coastal edge (which nothing else claims) is never
drawn twice, and a shared land border is never drawn from two independently-simplified sides. Full
detail, including the exact hole-closing numbers and verification methodology, in `README.md`
item 38.

**Round 9 — a real Baltic coastline gap closed, and the gap-closing pass generalized.** Craig
asked to review round 8's screenshots, then, after two suspected issues were flagged back to him
(a possible Poland/Lithuania overlap, a color "bleed" near Warsaw/Germany): "Let's do a pass make
it as pixel perfect as possible." Built a stricter audit than any prior round — rasterize
`regions.json` into each campaign's own 800×600 pixel space with the same projection the app
renders with, then diff directly against that campaign's real land/sea mask image, rather than
checking topology or eyeballing screenshots. The Poland/Lithuania overlap turned out to be
intentional (Poland's 1938 eastern frontier correctly reaches into the historical Kresy for this
period); the Warsaw notch led to a genuine find further along the same coast as round 8's fix — up
to ~300 contiguous mask-land pixels near Rügen and Farther Pomerania that no region claimed, because
`GERMANY_1937`'s hand-typed Baltic coast is a ~10-point straight-line simplification of a much more
jagged real coastline. Fixed by unioning the hand-authored polygon with modern Germany's and
Poland's own true coastlines in a tuned bounding box, rather than hand-typing new points. Also
rewrote `close_interior_gaps()` (round 8's gap-closer) to diff an independently-built "true land"
superset against the claimed union instead of only finding fully-enclosed holes in the union's own
footprint — round 8's method structurally can't see a gap that also touches the coastline, since
that reads as a dent in the exterior boundary rather than an interior ring. The rebuilt method
caught a second real gap, a small Moravia-Silesia void along the Polish/Czech border that only
modern Czechia's own polygon (not Germany's, Poland's, or Czechoslovakia's 1938 hand-typed line)
actually covers; added Czechia and Slovakia as true-land sources to close it. Full detail, including
the exact numbers, the box-tuning process, and the leads chased and correctly ruled out, in
`README.md` item 39.

**Round 10 — Italy's map re-centered, and a real Caucasus/Central Asia gap closed (after a false
start splitting out Ukraine, corrected and reverted).** Craig: "The Italian map looks centred a
little low as although their nodes are more southern... Ukraine isn't coloured in." Fixed Italy's
bbox directly (`llcrnrlat: -3..47` → `10..54`, matched in both `CAMPAIGN_MAP_BBOX` and `tools/
generate_placeholder_maps.py`) — the old framing put Italy at the very top edge and wasted ~80% of
the frame on empty Sahara. Read "Ukraine isn't coloured in" as a request to split Ukraine out as
its own bordered region (following round 4/7/8's precedent for Turkey/Bulgaria/Albania/Malta) and
built that out fully — new region entry, historically-researched per-year status, graph edges,
override conditions, node-highlight reassignments — verified working as designed. **Craig then
corrected this from a phone screenshot:** "Ukraine doesn't need its own border. I made a mistake.
It is the bit below the red line that isn't coloured in... I assume it is all USSR." The actual
report was a large genuinely-uncolored void south/east of Stalingrad — Georgia, Armenia,
Azerbaijan, Kazakhstan, Turkmenistan, and Uzbekistan were never in `REGION_COUNTRIES` at all,
unlike the deliberately-excluded microstates `close_interior_gaps()` already knows to ignore — a
gap the rasterization audit had independently already flagged just before Craig's message arrived.
Reverted the Ukraine split entirely and instead folded those six republics into the existing
`"ussr"` entry (no separate border, per Craig's instruction), accepting they'll read the same
front-line-driven status as the rest of "ussr" (occasionally "contested" rather than solid "soviet"
in 1941-43) rather than building a bespoke fixed-color mechanism for territory that, historically,
never actually changed hands. Full detail, including the exact pixel-audit numbers confirming the
gap closed, in `README.md` item 40.
