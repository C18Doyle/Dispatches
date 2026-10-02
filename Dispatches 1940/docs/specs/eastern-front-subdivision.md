# Spec: Eastern Front Region Subdivision

Status: SPEC ONLY — not implemented. Scoped at Craig's request after relaying a player review's
complaint that the USSR renders as a single undifferentiated region on the Checkpoint Map, with
no way to distinguish Leningrad from Stalingrad from Kursk from the Volga. Craig confirmed the
complaint himself before asking for this to be scoped rather than built directly, given a real
precedent (below) of a similar change going wrong when it skipped the scoping step.

## The complaint, verified

`assets/maps/regions.json` has 29 top-level regions. "ussr" is one of them — a single polygon
mechanically dissolved from ten modern countries (Russia, Ukraine, Belarus, Moldova, Kazakhstan,
Georgia, Armenia, Azerbaijan, Turkmenistan, Uzbekistan) via `tools/build_region_geometry.py`. No
internal subdivision exists. Every node in the German/Soviet/Allied/Italy campaigns that
highlights something happening inside the USSR — Leningrad, Moscow, Stalingrad, Kursk, the
Dnieper, Bagration, all of it — points at this same single region id in the
`NODE_HIGHLIGHT_REGIONS`-style table (58 separate node entries, counted directly via `grep -c
'"ussr"' src/App.jsx` restricted to that table). So the gap is real on both axes: no geometry to
draw the distinction, and no per-node data deciding which new piece each of those 58 references
should actually point at.

## The round-10 precedent

Round 10 already tried something adjacent: splitting Ukraine out as its own region, built
completely and verified working, then reverted by Craig from a phone screenshot: "Ukraine
doesn't need its own border. I made a mistake." On inspection this wasn't a considered verdict
against subdivision — the actual complaint that round was responding to was a different, simpler
bug (Georgia/Armenia/Azerbaijan/Kazakhstan/Turkmenistan/Uzbekistan were never in the mechanical
union at all, a genuine uncolored void south/east of Stalingrad) — but it's still a real data
point: a similar change was built once without a written scope first, and had to be unwound. This
spec exists specifically so that doesn't happen twice.

## Why this isn't like the project's other region additions

Every region this project has successfully added or fixed — Turkey, Bulgaria, Albania, Malta, the
round-13b border-accuracy fixes to Poland/Germany/Czechoslovakia — either mechanically dissolved a
real modern country's boundary from `tools/geo_pipeline/countries.geojson`, or hand-corrected a
small, well-documented local error against real reference points (verified this round: Gliwice
wrongly claimed by Poland, Uzhgorod wrongly claimed by Czechoslovakia, Alsace wrongly claimed by
Germany — see the round-13b devlog entry). What's being asked for here is a different kind of
problem. "Leningrad," "Moscow," "Volga," "Caucasus," and "Urals" have no clean administrative
boundary at any point in this era — they're informal front-descriptive terms, not oblasts or
countries, so there's no shapefile to dissolve and no single reference border to correct against.
"Western vs. Eastern Ukraine" is similar: the line that would divide them moved repeatedly across
the war (the 1939 partition line, the 1941 front's own stabilization, and modern political usage
of "western Ukraine" don't agree with each other), so drawing it means picking one and defending
the choice, not looking one up. Belarus and Ukraine as *whole countries*, by contrast, are exactly
like every prior successful addition — both are already inside the "ussr" mechanical union
waiting to be split back out with a one-line `REGION_COUNTRIES` change, the same operation as
Turkey/Bulgaria/Albania. Craig should treat that as its own smaller decision, not bundled silently
into whatever this spec decides, since it's the literal thing he called a mistake in round 10.

## Two paths, not one

**A. Full subdivision** — the reviewer's own list: Western Ukraine, Eastern Ukraine, Belarus,
Leningrad, Moscow, Volga, Caucasus, Urals (8 pieces, or 7 if Western/Eastern Ukraine are merged
into one "Ukraine"). Every piece except Belarus needs a hand-drawn boundary with no authoritative
source, using the same "hand-approximated interwar shape" method already disclosed for
Poland/Germany/Czechoslovakia — except with less to anchor against, since those three at least had
a real historical international border to approximate; several of these zones never had a
border of any kind. Then all 58 existing node-to-region references need to be individually
re-read and reassigned to whichever new piece (or pieces — some, like Bagration, plausibly span
more than one) actually fits.

**B. Army-group zones** — three or four broader pieces that mirror the fronts the game's own
campaign text already organizes around: North (Leningrad/Baltic approaches), Center
(Moscow/Belarus/Smolensk/Rzhev), South (Ukraine/Kursk/Caucasus/Stalingrad/the Volga). Cheaper to
hand-draw (roughly the same effort as one of the existing hand-authored regions, not seven), still
answers the actual complaint (Leningrad and Stalingrad stop reading as the same place), and reuses
a division the narrative already leans on rather than inventing new boundary logic from nothing.
Recommended over A: it gets most of the player-facing benefit at a fraction of the drawing and
retagging cost, and a coarser zone is more defensible with no authoritative source to check it
against — a wrong 3-way split is a smaller, more visible error to catch and fix than a wrong
8-way split.

## Scope estimate

- **Geometry, path B (recommended):** 3-4 new hand-authored polygons, same authoring method as
  Poland/Germany/Czechoslovakia (simplified 15-25 vertex rings, drawn to share borders with their
  mechanical neighbors and with each other). Comparable effort to the original three-region
  hand-authoring pass from Spec 5's build-out, not a new category of work.
- **Geometry, path A:** 7-8 new hand-authored polygons, several with no reference border to draw
  against at all (Volga, Urals, Western/Eastern Ukraine) — meaningfully higher risk of the same
  kind of vertex error the round-13b border audit just spent a full pass finding and fixing in the
  three existing hand-authored regions, this time with less to verify against.
- **Retagging, either path:** all 58 existing "ussr"-tagged node entries need individual review —
  this is a full read-and-decide pass, not a mechanical rename, since a wrong reassignment reads
  as a wrong claim on the map exactly like the bugs the border audit just fixed. Path B's 3-4
  buckets make each individual call easier (which front is this node about?) than path A's 7-8
  finer buckets would.
- **Status data:** `MAP_YEAR_STATUS` currently tracks one `ussr` entry per year across 7 tracked
  years (1939-1945). Each new region needs its own per-year status researched and added — real
  content work, not just geometry, following the same "axis"/"axisAllied"/"soviet"/"contested"
  vocabulary the table already uses.
- **Not required:** no new rendering, tooltip, or flash-on-change machinery — `CheckpointMapRegions`
  already reads `MAP_REGIONS`/`MAP_YEAR_STATUS` generically, the same "engine already built, this
  is a content problem" situation Spec 6 documented for its own, separate map-reactivity gap.

## Open questions for Craig before implementing

1. Path A (full subdivision) or path B (army-group zones, recommended)?
2. Should Belarus/Ukraine be split out as their own whole-country regions regardless of what's
   decided above — the cheap, mechanically-clean tier, but the literal thing reverted in round 10?
3. Pilot the retagging pass on a subset of the 58 references (e.g. just the German campaign's
   Eastern-front nodes) and review the real result before doing the other three campaigns, the
   same "prototype small, look at it, then decide" pattern used for Spec 6 and the original
   Historical Divergence rollout?
4. How should a node whose event plausibly spans more than one new zone (Bagration touches
   Belarus and arguably the edge of the Center zone; the Dnieper line sits between Center and
   South) be handled — pick one, or allow a node to highlight more than one region at once (the
   data model already supports a node pointing at multiple regions, e.g. `twoFires1943: ["italy",
   "ussr"]`, so this is a curation-bar question, not an engineering one)?
