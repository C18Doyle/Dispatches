#!/usr/bin/env python3
"""Build assets/maps/regions.json — one simplified polygon set per MAP_REGIONS id
(src/App.jsx), for the dynamic ownership-color overlay on the Checkpoint Map.

Sources:
  - Modern country outlines: world-atlas's countries-110m.json (npm), converted to
    GeoJSON via tools/geo_pipeline/convert.mjs (topojson-client) and dissolved into
    each MAP_REGIONS aggregate with shapely. This is a mechanical union of real,
    accurate modern boundaries — no manual tracing, no accuracy risk beyond "modern
    borders, not 1940s ones," which is an accepted simplification for every region
    EXCEPT the three below.
  - Poland, Germany, Czechoslovakia: hand-authored approximate interwar/wartime-era
    polygons (see POLAND_1938, GERMANY_1937, CZECHOSLOVAKIA_1938 below), because their
    real WWII-era shape differs from their modern shape enough to matter for this
    project (Poland's eastern Kresy, the Polish Corridor splitting German East Prussia
    from the mainland, Czechoslovakia including Slovakia). These are approximated from
    general historical knowledge of well-documented interwar borders — NOT traced from
    an authoritative shapefile (none was available offline in this environment) — so
    treat them as stylistically "close," not survey-accurate. Chosen specifically
    because Craig asked to hand-correct "the worst offenders" rather than ship every
    region with today's borders.

Usage: python3 tools/build_region_geometry.py
(Requires tools/geo_pipeline/countries.geojson to already exist — see
tools/geo_pipeline/README.md for the one-time npm conversion step.)
"""
import json
import os

import topojson
from shapely.geometry import shape, mapping, MultiLineString, Point, Polygon, box
from shapely.ops import linemerge, unary_union

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COUNTRIES_GEOJSON = os.path.join(ROOT, "tools", "geo_pipeline", "countries.geojson")
OUT_PATH = os.path.join(ROOT, "assets", "maps", "regions.json")

# The ten modern countries dissolved into the old single "ussr" region — now the raw
# source union that build_ussr_zones() below cuts into three army-group zones instead
# of emitting as one region. Pulled out of REGION_COUNTRIES (round 14) rather than left
# as a normal entry there, since this one needs custom polygon surgery afterward, not a
# a plain union-and-clip.
#
# The USSR's real WWII-relevant extent reaches well past modern Russia — Ukraine and
# Belarus (Kiev, Kharkov, Kursk, Bagration, the Dnieper line, Brest) are central to
# this game's own German/Soviet campaign text, so leaving them out would visibly
# misrepresent "the USSR" on the map, not just simplify it. Moldova (Bessarabia)
# included for the same reason. (Round 10: briefly split Ukraine out as its own
# region, then reverted — Craig: "Ukraine doesn't need its own border. I made a
# mistake" — the actual report was the Caucasus/Central Asia gap below, not this; round
# 14 splits North/Center/South instead, a different cut discussed and scoped in
# docs/specs/eastern-front-subdivision.md before being built, specifically to avoid
# repeating that unscoped reversal.) This is a mechanical dissolve of real modern
# countries, not invented geometry, so it carries none of the hand-tracing risk.
USSR_ZONE_COUNTRIES = [
    "Russia", "Ukraine", "Belarus", "Moldova",
    # Round 10 (Craig, on a screenshot of the area southeast of Stalingrad: "It is
    # the bit below the red line that isn't coloured in... I don't think this area
    # changes hands and therefore could even be hardcoded. Although I assume it is
    # all USSR"). These six republics were never in REGION_COUNTRIES at all — Russia/
    # Ukraine/Belarus/Moldova covers only the western USSR, so the real Soviet
    # Transcaucasus and Central Asia (never modeled, unlike the microstates'
    # documented small-and-known exclusion) rendered as a large uncolored void the
    # rasterization audit had already flagged but hadn't yet been asked to fix. Folded
    # into the zone split rather than given their own region: this land was Soviet-
    # controlled for the entire war (the deepest German advance, 1942's Caucasus
    # offensive, reached Mozdok in Russia's own North Caucasus and never crossed into
    # Georgia, Armenia, Azerbaijan, or Central Asia) — Craig's "doesn't change hands"
    # is correct, and there's no case for the front-line-driven status the rest of
    # this blob needs, but also no visible harm in it. (Kazakhstan and Azerbaijan
    # account for nearly all of the previously-uncolored area actually inside any
    # campaign's map frame; the other four are included for completeness since
    # REGION_CLIP_BBOX quietly discards whatever falls outside every campaign's bbox
    # anyway, at no cost.) All six land in "ussrSouth" — see build_ussr_zones().
    "Kazakhstan", "Georgia", "Armenia", "Azerbaijan", "Turkmenistan", "Uzbekistan",
]

# MAP_REGIONS id -> modern country name(s) in world-atlas's countries-110m.json.
# Aggregates are dissolved into one shape with shapely.ops.unary_union, exactly
# mirroring the "region groups several modern countries" convention MAP_REGIONS
# already uses on the schematic map (benelux, baltics, nwAfrica, etc.).
REGION_COUNTRIES = {
    "norway": ["Norway"],
    "sweden": ["Sweden"],
    "finland": ["Finland"],
    "denmark": ["Denmark"],
    "britain": ["United Kingdom"],
    "ireland": ["Ireland"],
    "france": ["France"],
    "benelux": ["Belgium", "Netherlands", "Luxembourg"],
    "switzerland": ["Switzerland"],
    "iberia": ["Spain", "Portugal"],
    "austria": ["Austria"],
    # "hungary" removed round 16 — promoted to a hand-authored region (see
    # HUNGARY_RUTHENIA_PATCH_BOX below and HAND_AUTHORED_PRIORITY) so its Ruthenia
    # patch can take priority over the mechanical "ussr" dissolve the same way
    # Germany's/Poland's/Czechoslovakia's own hand-authored shapes already do.
    "baltics": ["Estonia", "Latvia", "Lithuania"],
    # "ussr" removed round 14 — see USSR_ZONE_COUNTRIES above and build_ussr_zones()
    # below; it's no longer a single REGION_COUNTRIES entry.
    "romania": ["Romania"],
    "italy": ["Italy"],
    # Yugoslavia (1918-1941/45) doesn't exist today, but its real borders were very
    # close to the union of its modern successor states (missing only a few small
    # WWI-era border adjustments) — a safe dissolve, not a freehand trace.
    "yugoslavia": ["Serbia", "Croatia", "Bosnia and Herz.", "Slovenia", "Montenegro", "Macedonia", "Kosovo"],
    "greece": ["Greece"],
    "nwAfrica": ["Algeria", "Morocco", "Tunisia"],
    "libya": ["Libya"],
    "egypt": ["Egypt"],
    "turkey": ["Turkey"],
    "bulgaria": ["Bulgaria"],
    "albania": ["Albania"],
    # Round 8: only reachable at all once countries.geojson was regenerated from
    # world-atlas's 50m dataset instead of 110m — Malta doesn't exist in the 110m
    # dataset (below its size cutoff, along with Andorra/Monaco/Vatican/Liechtenstein).
    "malta": ["Malta"],
}

# --- Hand-authored historical polygons -------------------------------------------
# Approximate, simplified (15-25 vertices), (lon, lat) rings. Deliberately drawn to
# share a border with each other and with their modern-shape neighbors (Austria,
# Hungary, Lithuania, the Baltics) so the three don't leave a visible gap or overlap
# on the rendered map.

# Second Polish Republic, ~1938: reaches east into what's now Belarus/Ukraine/Lithuania
# (Wilno, Nowogródek, Wołyń, Lwów — lost to the USSR after 1945) and stops well short of
# modern Poland's west (Silesia/Pomerania were German until 1945 — see GERMANY_1937).
#
# Round 13b (Craig, relaying a player review's border-accuracy complaints — "Silesia"
# among them): verified via point-in-polygon test that Gliwice (Gleiwitz) — the famous
# Gleiwitz Incident site, staged by the SS in August 1939 specifically because it sat on
# German soil right at the border (Wikipedia, Gleiwitz incident, 2026-09-25) — fell inside
# this hand-typed "Poland" polygon, wrongly claiming it as Polish for the whole tracked
# war. Fixed with a small notch cut around Gliwice specifically (Katowice/Zabrze/Bytom/
# Chorzów/Tarnowskie Góry, its immediate industrial-cluster neighbors, all re-verified to
# remain correctly Polish). NOT a full redraw of the 1921 plebiscite line: that partition
# had genuine exclaves and split-vote districts (cross-checked sources gave conflicting
# answers for Zabrze/Bytom specifically) that a ~25-vertex simplified polygon can't fully
# represent — this fixes the one high-confidence, independently-corroborated case rather
# than force false precision onto the disputed rest.
POLAND_1938 = [
    (18.5, 54.5),   # Gdynia — the Corridor's Baltic outlet
    (18.65, 54.75), # around the Danzig free-city area (simplified into Poland)
    (19.4, 54.4),
    (20.9, 53.9),   # south of East Prussia
    (22.7, 54.3),
    (23.5, 54.35),  # Suwałki gap area, toward the Lithuanian border
    (25.3, 54.68),  # Wilno (Vilnius) — held by Poland 1922-1939
    (26.6, 53.9),
    (26.0, 53.13),  # Baranowicze
    (26.1, 52.12),  # Pinsk
    (26.25, 50.62), # Równe (Rivne)
    (25.6, 49.55),  # Tarnopol (Ternopil)
    (25.75, 48.65), # near Zaleszczyki — the Polish-Romanian-Czechoslovak tripoint area
    (24.0, 49.0),
    (22.5, 49.0),   # along the Carpathians, bordering Czechoslovakia
    (20.5, 49.3),
    (19.0, 49.35),  # Tatra mountains
    (18.9, 50.1),   # Polish Upper Silesia (Katowice)
    # Notch excluding Gliwice/Gleiwitz specifically (see comment above).
    (18.72, 50.204), (18.72, 50.35), (18.55, 50.35), (18.55, 50.303),
    (17.0, 51.2),   # the western border with German Silesia
    (16.9, 52.3),
    (17.0, 53.0),
    (18.0, 53.6),   # narrowing back into the Corridor
    (18.5, 54.5),
]

# 1937 Germany (pre-Anschluss, pre-Munich): western/southern border essentially matches
# modern Germany (Alsace stayed part of "france," Saarland was already German after the
# 1935 plebiscite) — the real difference is the east: Farther Pomerania, Silesia, and the
# East Prussia exclave (split from the mainland by the Polish Corridor) all belonged to
# Germany then and don't today. Approximated as one simplified outline including a notch
# for the Corridor and the East Prussia exclave as a separate small ring.
#
# Round 13b (Craig, relaying a player review's border-accuracy complaints, "Alsace" among
# them): verified via point-in-polygon test against real city coordinates that the
# original two-point Swiss-frontier-to-Luxembourg-frontier jump ((7.6, 47.6) straight to
# (6.2, 49.5)) cut across the Rhine and swallowed the whole of Alsace — Strasbourg AND
# Colmar both fell inside this hand-typed "Germany" polygon, contradicting this file's own
# stated intent above ("Alsace stayed part of 'france'") and showing them German-colored
# for the entire tracked war (1939-1945), not just the real 1940-44 annexation this
# project doesn't otherwise model. Fixed by splicing in Germany's own real modern western
# border through this stretch (tools/geo_pipeline/countries.geojson, clipped to this
# bbox) rather than hand-typing more points — this segment is historically stable
# (unchanged 1918-present except the unmodeled 1940-44 annexation), so modern data is
# accurate here, the same method already used for the round-9 Baltic-coast fix. Re-verified
# after the fix: Strasbourg/Colmar/Mulhouse/Basel/Luxembourg City all correctly fall
# outside; Freiburg/Karlsruhe/Saarbrücken (real German territory in this stretch) all
# correctly remain inside.
GERMANY_1937 = [
    # Mainland, clockwise from the Danish border.
    (9.0, 54.8), (10.9, 54.5), (12.2, 54.3),  # Baltic coast toward Pomerania
    (14.2, 53.9), (16.0, 54.2), (17.3, 54.5), # Farther Pomerania coast toward the Corridor
    (18.0, 53.6),                             # the Corridor notch (Polish territory excluded)
    (17.6, 52.8), (17.0, 51.9),               # German-Polish border, Posen/Silesia frontier
    (17.0, 51.2),
    # Gliwice/Gleiwitz notch — the exact mirror of the notch removed from POLAND_1938
    # above (see that comment for the Gleiwitz Incident sourcing).
    (18.55, 50.303), (18.55, 50.35), (18.72, 50.35), (18.72, 50.204),
    (18.9, 50.1),                             # Upper Silesia (Kattowitz plebiscite area to Poland)
    (17.6, 49.5), (14.9, 51.05),              # Sudeten border with Czechoslovakia
    (12.5, 50.6), (12.35, 50.08),             # Bohemia/Bavaria frontier
    (12.9, 47.7),                             # Austrian border (pre-Anschluss)
    (10.2, 47.3),                             # Swiss frontier, west of Lake Constance
    # Real Rhine/Alsace border, Basel to the Saar-Luxembourg tripoint (was a single bad
    # jump to (6.2, 49.5) — see comment above).
    (7.616, 47.593), (7.529, 47.673), (7.594, 47.906), (7.609, 48.003),
    (7.796, 48.546), (7.922, 48.699), (8.001, 49.011), (7.799, 49.043),
    (7.526, 49.086), (7.198, 49.114), (7.0, 49.18), (6.849, 49.202),
    (6.608, 49.291), (6.457, 49.442), (6.349, 49.513),
    (6.4, 50.1),                              # Luxembourg/Belgium frontier
    (6.1, 51.9), (7.2, 53.3),                 # Dutch frontier to the North Sea coast
    (8.2, 53.9), (9.0, 54.8),
]
# East Prussia, cut off from the German mainland by the Corridor — drawn as a second,
# disconnected ring of the same "germany" multi-polygon.
EAST_PRUSSIA_1937 = [
    (19.7, 54.5), (21.5, 54.4), (22.7, 54.3), (22.6, 53.6),
    (21.0, 53.4), (19.8, 53.6), (19.4, 54.1), (19.7, 54.5),
]

# Czechoslovakia, 1918-1938 (before Munich): Bohemia + Moravia + Slovakia + Subcarpathian
# Ruthenia, a long east-west strip along the Sudeten mountains and the Carpathians —
# very different from modern Czechia, which excludes Slovakia/Ruthenia entirely.
#
# Round 13b (Craig, relaying a player review's border-accuracy complaints — "Uzhgorod" and
# a "Czechian bulge" among them): verified via point-in-polygon test that the original
# eastern salient (reaching to 24.4E, labeled "Subcarpathian Ruthenia") contained both
# Uzhgorod and Mukachevo. That's wrong for every year this project actually tracks: the
# First Vienna Award (2 Nov 1938, confirmed by outright Hungarian occupation by 17-18
# March 1939 — Wikipedia, Hungarian invasion of Carpatho-Ukraine, 2026-09-25) ceded this
# territory to Hungary before this game's earliest tracked year (1939), so the "czechia"
# region showed it as Czech/Axis-occupied for the entire war on a static, single-geometry
# polygon that never varies by year — a real, verifiable error, not just a simplification
# call. Trimmed the salient back to the real Slovak/Ruthenian frontier (sourced from
# tools/geo_pipeline/countries.geojson — modern Slovakia's own eastern boundary, a
# reasonable proxy since this county-level line predates and outlived the war) rather than
# hand-typing a new border from scratch. Re-verified: Uzhgorod and Mukachevo now correctly
# fall outside; Košice, Prešov, and Bratislava (real Slovak territory) remain inside.
# NOTE, not a full fix: this trim frees Ruthenia's area for whichever mechanical region's
# true shape actually covers it — verified after rebuilding: Uzhgorod/Mukachevo now claim
# as "ussr" (modern Ukraine's own true shape, correctly, since Uzhgorod is Ukrainian
# territory today too), not "hungary" (a plain mechanical dissolve of MODERN Hungary, which
# doesn't reach this area). So the fix trades one wrong claim for a different, smaller one —
# "ussr"/Soviet-colored is still not "hungary," the actual 1938-45 controller. Giving
# Hungary its own historical extent, the same treatment as Poland/Germany/Czechoslovakia,
# is future work.
# ALSO NOT FIXED: Slovakia was a nominally separate Axis-partner state for the whole war
# (like Hungary/Romania/Bulgaria, already tracked as "axisAllied"), not part of a
# German-run "Czechoslovakia" — this polygon still reads "czechia" and gets that single
# region's "axis" status every tracked year, coloring Bratislava/Košice the same as Prague.
# That's a status-modeling gap, not a border-vertex error, so left alone pending a scoping
# decision (would need Slovakia split out as its own tracked region).
CZECHOSLOVAKIA_1938 = [
    (12.35, 50.08),  # western tip, Cheb/Eger
    (12.1, 49.3), (12.9, 47.7),          # southern Bohemia/Austria frontier
    (14.5, 48.6), (16.0, 48.6),
    (16.85, 48.6), (17.1, 47.8),
    (18.85, 47.76), (19.7, 48.0),        # Bratislava/southern Slovakia, Hungary frontier
    # Real Slovak/Ruthenian frontier, replacing the old salient to 24.4E that wrongly
    # reached Uzhgorod/Mukachevo (see comment above).
    (21.505, 48.522), (21.562, 48.496), (21.602, 48.463), (21.631, 48.418),
    (21.649, 48.402), (21.674, 48.378), (21.721, 48.347), (21.768, 48.338),
    (22.11, 48.393), (22.131, 48.406), (22.142, 48.569), (22.297, 48.685),
    (22.333, 48.746), (22.39, 48.874), (22.434, 48.933), (22.484, 48.984),
    (22.524, 49.031), (22.538, 49.072),
    (22.3, 49.1),                        # Carpathian ridge, Polish frontier
    (20.9, 49.4), (19.5, 49.4),
    (18.2, 49.6), (17.0, 50.3),          # Moravia/Silesia, Polish frontier
    (14.9, 51.05), (12.5, 50.6),         # Sudeten border with Germany
    (12.35, 50.08),
]

HAND_AUTHORED = {
    "poland": [POLAND_1938],
    "germany": [GERMANY_1937, EAST_PRUSSIA_1937],
    "czechia": [CZECHOSLOVAKIA_1938],
}

# Round 9 (Craig: "as pixel perfect as possible" after round 8's border-cluster fix):
# GERMANY_1937's Baltic coast (the block of points from the Danish border to the Corridor
# notch, above) is a ~10-point straight-line simplification of a real coastline that's
# considerably more jagged (Rügen, the Szczecin/Stettin lagoon, Farther Pomerania's own
# bays) — verified by rasterizing regions.json against each campaign's own land mask.png
# and diffing: up to ~300 contiguous mask-land pixels around Rügen (13 E) and Farther
# Pomerania (17.4 E) were mask-land but claimed by no region at all, the literal "beige
# gap between the bigger countries" Craig flagged, just further west along the same coast
# as round 8's tripoint fix rather than at a country corner. COASTAL_GROW (0.02 degrees)
# is nowhere near enough to close a gap this wide on its own.
#
# Fixed by adding real coastline detail back in rather than hand-typing more points:
# union the hand-authored Germany polygon with modern Germany's AND modern Poland's own
# true coastlines, clipped to a box hugging just this stretch. Both modern countries'
# geometry is needed because the real coastline here crosses the post-1945 border this
# region deliberately does NOT use (Farther Pomerania is 1937-German but modern-Polish);
# using modern Poland's coastline for this one narrow coastal band doesn't contradict
# POLAND_1938 above, since POLAND_1938's own hand-typed points never reach this stretch
# at all (its Baltic frontier is entirely east of the Corridor, from Gdynia at 18.5E) —
# confirmed empirically (zero overlap between this patch and POLAND_1938 at any of
# several tested southern/eastern bounds). The box's east edge stops at 18.05E, just past
# the Corridor notch (18.0E, so the patch's own straight clip edge doesn't leave a new
# sliver gap of its own right at the notch) but well short of Danzig/Gdynia's real coast
# (18.5E+), so it can never reach into Polish Corridor territory and relabel it German —
# verified empirically (zero overlap with POLAND_1938 up to 18.1E, a hair's overlap only
# starting at 18.15E). Its south edge (53.8N) sits just below
# GERMANY_1937's own lowest coastal vertex (53.9N at the Rügen-area dip) so it only ever
# adds a thin coastal band, not a path down into Poland's or Germany's own interior.
GERMANY_1937_COAST_PATCH_BOX = (5.5, 53.8, 18.05, 55.3)

# Round 16 (Craig, relaying a player review's map complaint — "Why does USSR has Northern
# Prussia" — re-verified directly, 2026-09-25, via point-in-polygon test against the actual
# built regions.json, not eyeballing): EAST_PRUSSIA_1937's hand-typed ring only reaches
# 54.5N, missing Konigsberg (54.71N), the Sambia peninsula, and the Memel Territory (annexed
# by Germany in March 1939, before this game's earliest tracked year) up to Memel/Klaipeda
# itself (55.72N). Before round 14's ussr zone split, this gap fell inside the single
# undivided "ussr" region — mechanically dissolved from modern Russia, whose Kaliningrad
# Oblast exclave sits almost exactly on former East Prussia's core — which is exactly what
# the review's complaint describes (East Prussia rendering Soviet-colored seven years before
# that was true). Round 14's zone split removed it from Soviet territory but never added it
# back to Germany, leaving a genuine gap (no region at all) rather than a wrong one.
#
# Fixed the same way as GERMANY_1937_COAST_PATCH_BOX above: real modern coastline, not more
# hand-typed points. Kaliningrad Oblast is a reasonable proxy for Konigsberg/the Sambia
# peninsula's real shape — Russia's mainland is thousands of km away, so intersecting with a
# tight box cleanly isolates just the exclave. For the Memel Territory, Wikipedia (Klaipeda
# Region, fetched 2026-09-25) confirms its southern border followed the Neman river and is
# "the current international boundary between Lithuania and the Kaliningrad Oblast of the
# Russian Federation" — i.e. the modern Lithuania/Kaliningrad border IS the old Memel
# Territory's southern edge, so a box hugging just the Klaipeda coastal strip (capped well
# short of Vilnius, ~25E) intersected with modern Lithuania is a real-coastline proxy, not a
# freehand guess at the Territory's actual extent.
EAST_PRUSSIA_KALININGRAD_PATCH_BOX = (19.3, 54.3, 22.9, 55.35)
EAST_PRUSSIA_MEMEL_PATCH_BOX = (20.8, 55.0, 21.9, 56.3)

# Round 16 (Craig's item 6 — Hungary/Ruthenia). Round 13c's Uzhgorod fix trimmed
# Czechoslovakia's own oversized salient back to the real Slovak/Ruthenian frontier,
# correctly stopping Czechoslovakia (and so the game's "axis"-status Czechia region)
# from claiming Ruthenia — but the exposed area then fell through to whatever
# mechanical region already sat underneath it, which is "ussr" (built from modern
# Ukraine, whose Zakarpattia Oblast closely matches historical Ruthenia's real
# extent). Disclosed at the time as a residual gap, not fixed then: Subcarpathian
# Ruthenia was actually Hungarian-controlled from the First Vienna Award and the
# March 1939 occupation (Wikipedia, Hungarian invasion of Carpatho-Ukraine — same
# sourcing round 13c's own fix used) through the end of the war, not Soviet.
#
# This is a bounded, disclosed patch to Ruthenia specifically — not an attempt at
# Hungary's full 1938-45 border history (the First Vienna Award's own Slovak strip,
# the Second Vienna Award's northern Transylvania, or the 1941 Yugoslav
# territories), none of which round 13c flagged as currently wrong, so none of them
# are touched here. Modern Ukraine's Zakarpattia Oblast is a close real-boundary
# proxy for historical Ruthenia, same "modern administrative border as historical
# proxy" reasoning as every other patch in this file — box sized from Zakarpattia's
# real extent (center ~48.50N/23.38E per OpenStreetMap, fetched 2026-09-25) rather
# than freehand-guessed, and capped well short of the rest of Ukraine.
HUNGARY_RUTHENIA_PATCH_BOX = (21.9, 47.85, 24.9, 48.7)


def unwrap_ring(coords):
    """Remove antimeridian folds from a ring's raw lon/lat sequence: whenever two
    consecutive points jump by more than 180 degrees of longitude (the raw data
    wrapping from +180 to -180 or back), shift everything after the jump by a
    multiple of 360 so the ring reads as one continuous line instead of tearing
    across the whole map. Only used on the specific parts that need it (see
    repair_geometry) — most rings never come near +/-180 and pass through untouched."""
    out = [coords[0]]
    for x, y in coords[1:]:
        px, _ = out[-1]
        while x - px > 180:
            x -= 360
        while x - px < -180:
            x += 360
        out.append((x, y))
    return out


def unwrap_polygon(poly):
    ext = unwrap_ring(list(poly.exterior.coords))
    ints = [unwrap_ring(list(r.coords)) for r in poly.interiors]
    return Polygon(ext, ints)


def repair_geometry(geom):
    """Repair an invalid raw feature. Most invalid world-atlas features are ordinary
    touching-ring quirks that plain buffer(0) fixes fine. Russia is a special case:
    its raw MultiPolygon crosses the antimeridian (lon +/-180), and buffer(0)'s
    even-odd cleanup resolves that self-intersection by silently discarding real
    area near the fold rather than fixing the topology — verified against this data:
    it truncated Russia's mainland at ~65 degrees N, well south of its actual Arctic
    coast (up to ~78N), which is exactly the visual gap Craig flagged in the
    Checkpoint Map's USSR coloring. The fix is per-part: any invalid part gets its
    longitudes unwrapped (removing the +/-180 jump so the ring stops folding on
    itself) before re-checking validity; buffer(0) is only the fallback for a part
    still invalid after that (unwrapping fixes antimeridian folds specifically, not
    every possible invalid-ring shape)."""
    if geom.is_valid:
        return geom
    if geom.geom_type != "MultiPolygon":
        return geom.buffer(0)
    parts = []
    for part in geom.geoms:
        if part.is_valid:
            parts.append(part)
            continue
        fixed = unwrap_polygon(part)
        if not fixed.is_valid:
            fixed = fixed.buffer(0)
        parts.append(fixed)
    return unary_union(parts)


def load_countries():
    with open(COUNTRIES_GEOJSON) as f:
        geo = json.load(f)
    by_name = {}
    for feat in geo["features"]:
        name = feat["properties"]["name"]
        geom = repair_geometry(shape(feat["geometry"]))
        by_name.setdefault(name, []).append(geom)
    return {name: unary_union(geoms) for name, geoms in by_name.items()}


def extract_rings(geom, coastal_grow=0.0):
    """Return a list of exterior-ring coordinate lists (holes dropped — fine at this
    stylization level) for a Polygon or MultiPolygon, dropping slivers under ~0.05 sq
    degrees so tiny islets bundled into some other region's MultiPolygon (a fragment of
    Denmark, Greece, etc.) don't bloat the output. `geom` is expected to already be
    topology-simplified (see `simplify_with_shared_topology` below) — this function just
    reads rings back out, it doesn't simplify anything itself.

    The largest piece always survives the threshold regardless of its own absolute size
    — otherwise a region whose entire area happens to be smaller than one "sliver" (Malta
    is ~0.03 sq degrees, added round 8) would come out with zero rings, i.e. invisible,
    which is a worse outcome than keeping an admittedly small island at its real size.

    `coastal_grow`, when nonzero, buffers the geometry outward by that many degrees
    *after* everything above — see the call site in main() for why this still exists
    even though shared-topology simplification means regions no longer need it to meet
    each other. It reintroduces a small amount of the mutual overlap this round
    otherwise eliminated (harmless: the fill layer composites in one semi-transparent
    group, same as round 6), but the border LINE layer (border_lines(), src/App.jsx's
    single stroke pass) is computed from the un-grown geometry, so the crisp single-line
    borders this round fixed are unaffected by it — only the fill's own reach into any
    land the mask says should be colored is."""
    if coastal_grow:
        geom = geom.buffer(coastal_grow, quad_segs=2)
    polys = list(geom.geoms) if geom.geom_type == "MultiPolygon" else [geom]
    polys = [p for p in polys if not p.is_empty]
    if not polys:
        return []
    polys.sort(key=lambda p: p.area, reverse=True)
    rings = []
    for i, p in enumerate(polys):
        if i > 0 and p.area < 0.05:
            continue
        ext = list(p.exterior.coords)
        rings.append([[round(x, 2), round(y, 2)] for x, y in ext])
    return rings


def simplify_with_shared_topology(final_geoms, tolerance=0.05):
    """Round 8 replacement for the old independent-per-region simplify+buffer: every
    region used to be simplified in isolation (no shared topology between, say, France's
    polygon and Germany's), so two regions that meet exactly in the source data ended up
    with two slightly different simplified lines along their common border — a scattering
    of thin random gaps (and occasional slivers of overlap) at almost every land border
    (Craig, round 6: "the random title gaps between the shapes"). That was patched rather
    than fixed: grow every region back out with a small buffer and rely on the land/sea
    mask to mop up any resulting overshoot into water. It worked (1.8-2.8% residual land
    gap) but left real double-line seams in the *border stroke* itself, since the fill
    and the border both come from each region's own independently-simplified shape.

    This builds one shared topology (`topojson.Topology`) across every region's precise,
    already-subtracted geometry and simplifies it once: a border segment shared by two
    regions is one arc, simplified a single time and referenced by both sides, so the two
    regions are geometrically identical along their shared edge — by construction, not by
    a buffer that papers over the mismatch afterward. Verified (see README item 38):
    pairwise overlap across all 28 regions drops to a single ~0.01 sq-degree sliver
    (Germany/France, from the hand-authored Germany polygon's own vertex placement, not a
    topology artifact), versus the round-6 buffer's deliberate up-to-1.2-sq-degree
    overlaps at nearly every border. `border_lines()` below reuses this same topology-
    consistent output to draw each shared border exactly once."""
    topo = topojson.Topology(final_geoms, prequantize=False, toposimplify=tolerance, simplify_algorithm="dp")
    gdf = topo.to_gdf()
    # topojson preserves dict-key order in the resulting GeoDataFrame but doesn't label
    # rows with our region ids by default — zip back up positionally against the same
    # key order the Topology() call was given.
    return dict(zip(final_geoms.keys(), gdf.geometry))


def border_lines(simplified_geoms):
    """Every real inter-region land border, each drawn exactly once — the fix for
    CheckpointMapRegions (src/App.jsx) stroking every region's own full outline
    independently, which drew every shared border twice (once from each side, at
    whatever the buffer-era per-region geometry happened to leave a hair's difference
    between) and drew a border-colored line along every coastline too, right on top of
    the base map art's own coastline ink (Craig, round 8: "we don't need the little
    black outline just around the countries especially the sea," and "double border
    black lines should be clamped together into one"). Computed the obvious way now
    that `simplify_with_shared_topology` guarantees every shared edge is byte-identical
    on both sides: for every pair of regions whose (simplified) polygons touch along a
    line (not just a corner point), that intersection *is* the border, with no tolerance
    fuzz to worry about. A region's coastal edges never show up here at all, since
    nothing else claims that boundary — the base map's own coastline art is left to be
    the only line drawn there, exactly as Craig asked."""
    ids = list(simplified_geoms.keys())
    lines = []
    for i in range(len(ids)):
        a = simplified_geoms[ids[i]]
        if a.is_empty:
            continue
        for j in range(i + 1, len(ids)):
            b = simplified_geoms[ids[j]]
            if b.is_empty or not a.intersects(b):
                continue
            shared = a.boundary.intersection(b.boundary)
            # boundary.intersection() of two rings that share a long run of vertices
            # comes back as many separate 2-point segments rather than one continuous
            # line (a shapely quirk, not a real gap) — linemerge() stitches contiguous
            # segments back into as few LineStrings as possible before this splits back
            # out only where two regions' shared border is genuinely disjoint (e.g. an
            # exclave touching at more than one separate stretch).
            raw_parts = _line_parts(shared)
            if not raw_parts:
                continue
            merged = linemerge(MultiLineString(raw_parts))
            for part in _line_parts(merged):
                if part.length < 0.01:
                    continue  # a bare touching point/sliver, not a real shared border
                lines.append([[round(x, 2), round(y, 2)] for x, y in part.coords])
    return lines


def _line_parts(geom):
    """Flatten a boundary intersection (Point/LineString/MultiLineString/
    GeometryCollection, any of which shapely can hand back) down to just its
    LineString pieces — points (a bare corner touch, no real shared edge) are
    dropped, they carry no border to draw."""
    if geom.is_empty:
        return []
    if geom.geom_type == "LineString":
        return [geom]
    if geom.geom_type == "MultiLineString":
        return list(geom.geoms)
    if geom.geom_type == "GeometryCollection":
        out = []
        for part in geom.geoms:
            out.extend(_line_parts(part))
        return out
    return []  # Point/MultiPoint — a touching corner, not a shared border


# Russia's real extent reaches to the Pacific, but no campaign bbox in src/App.jsx
# (CAMPAIGN_MAP_BBOX) ever shows anything east of ~62 degrees longitude — the whole
# Urals-to-Vladivostok stretch is dead weight (thousands of extra coastline vertices)
# that's never on screen. Clipped here, generously past every current bbox, rather
# than left in: keeps the shipped geometry small and sidesteps re-triggering the
# antimeridian repair above on parts of the shape nothing ever renders.
REGION_CLIP_BBOX = {
    "ussrZones": (-25, 30, 80, 85),  # (min lon, min lat, max lon, max lat)
}

# Round 14: North/Center/South dividing lines for build_ussr_zones() below, each a
# simplified (lon, lat) polyline running roughly west-to-east across the clipped
# "ussr" extent.
#
# CS_LINE (Center/South) follows the real historical boundary between Army Group
# Center and Army Group South during Barbarossa: the Pripyat Marshes were the actual
# terrain that split the two axes of advance, Center operating north of the marshes
# through Belorussia toward Smolensk/Moscow, South operating south of them through
# Ukraine toward Kiev, the Donbas, and the Caucasus (Wikipedia, "Operation
# Barbarossa," fetched 2026-09-24 — the article's own Army Group breakdown names this
# split explicitly). That line closely tracks the modern Belarus-Ukraine political
# border, so CS_LINE is drawn along it for the stretch where the two coincide
# (~23.85-31.8°E) and hand-continued east along roughly the same latitude band (no
# administrative line exists further east — this is the "coarse, defensible zone, not
# a surveyed border" scope disclosed in docs/specs/eastern-front-subdivision.md).
# Checked against named landmarks after drawing: Kyiv, Kharkiv, Kursk, Stalingrad
# (Volgograd), Rostov-on-Don, and Sevastopol all fall south of it; Moscow, Smolensk,
# Minsk, Rzhev, and Vitebsk all fall north.
#
# NC_LINE (North/Center) has no comparable real-world anchor — there's no modern
# administrative border here, and the historical Army Group North/Center boundary
# shifted repeatedly across the war (it ran along the Latvia/Lithuania-Belarus
# approaches early, then reshaped as the Baltic states and Belorussia were fully
# occupied) — so it's hand-drawn purely to keep Leningrad/Pskov/Novgorod (and
# Murmansk, far north) on the North side and Smolensk/Moscow/Vitebsk/Rzhev on the
# Center side, the same coarse-zone scope as CS_LINE.
NC_LINE = [(27.5, 57.6), (35.0, 57.0), (45.0, 56.5), (55.0, 56.0), (65.0, 55.5), (80.0, 55.0)]
CS_LINE = [
    (23.85, 52.7), (26.5, 51.9), (28.5, 51.5), (31.8, 52.1), (34.0, 52.0), (36.5, 51.9),
    (40.0, 51.5), (45.0, 51.0), (50.0, 50.5), (55.0, 50.0), (65.0, 49.5), (80.0, 49.0),
]


# Round 25: the three zones this function writes are cut into nine by tools/split-ussr-zones.mjs, which is run on the
# finished assets/maps/regions.json (python tools/build_region_geometry.py && node tools/split-ussr-zones.mjs). The
# Python pipeline itself is unchanged: it still writes ussrNorth / ussrCenter / ussrSouth.
def build_ussr_zones(countries):
    """Split the old single "ussr" mechanical union into three army-group zones —
    ussrNorth / ussrCenter / ussrSouth — using NC_LINE/CS_LINE above as cutting lines.
    Returns a dict of the same shape as one loop iteration over REGION_COUNTRIES would
    have produced, ready to fold straight into main()'s `mechanical` dict; the rest of
    the pipeline (hand-authored subtraction, close_interior_gaps, shared-topology
    simplify, coastal_grow) treats these three exactly like any other mechanical
    region — no special-casing needed past this function.

    Uses plain polygon algebra (intersection/difference against two cutting polygons)
    rather than hand-typed boundary vertices, unlike POLAND_1938/GERMANY_1937/
    CZECHOSLOVAKIA_1938: there's no historical border to trace here (see the NC_LINE/
    CS_LINE comment above), so the zones are defined by the lines directly instead of
    by a drawn ring that approximates a real frontier."""
    lon0, lat0, lon1, lat1 = REGION_CLIP_BBOX["ussrZones"]
    geom = unary_union([countries[n] for n in USSR_ZONE_COUNTRIES])
    geom = geom.intersection(box(lon0, lat0, lon1, lat1))

    # Bounding polygons for "everything north of NC_LINE" / "everything south of
    # CS_LINE", built by closing each line off against the clip box's own top/bottom
    # edge and far corners.
    north_cut = Polygon([(lon0, lat1)] + NC_LINE + [(lon1, lat1), (lon0, lat1)])
    south_cut = Polygon([(lon0, lat0)] + CS_LINE + [(lon1, lat0), (lon0, lat0)])

    north = geom.intersection(north_cut)
    remaining = geom.difference(north_cut)
    south = remaining.intersection(south_cut)
    center = remaining.difference(south_cut)
    return {"ussrNorth": north, "ussrCenter": center, "ussrSouth": south}


def label_point(geom):
    """A point guaranteed to sit inside geom (unlike a centroid, which can land in the
    sea for a concave or multi-part shape — e.g. Yugoslavia's crescent, or Norway's
    coastline), for placing that region's name label (Task: region name labels)."""
    p = geom.representative_point()
    return [round(p.x, 2), round(p.y, 2)]


# HAND_AUTHORED regions use WWII-era borders that don't match the modern-country
# shapes REGION_COUNTRIES dissolves for everyone else, so their areas genuinely
# overlap real neighbors on the map — Poland's 1938 Kresy overlaps modern
# Ukraine/Belarus/Lithuania (folded into "ussr"/"baltics"), Germany's 1937 Silesia
# overlaps modern Poland/Czechia's neighbors, and so on. Two SVG paths with
# semi-transparent fills covering the same ground blend into a third, wrong color
# where they overlap (Craig's "when the colours overlap it changes colour" report) —
# so every hand-authored region's geometry is authoritative and gets subtracted out
# of anything mechanical that claims the same ground. This list also fixes the small
# amount of mutual overlap between the three hand-authored regions themselves (their
# shared borders were drawn independently and don't line up to the vertex): each one
# after the first is clipped to exclude whatever the earlier ones already claimed.
HAND_AUTHORED_PRIORITY = ["germany", "poland", "czechia", "hungary"]

# Real microstates too small for world-atlas's 50m cutoff (Malta is the one round 8
# added as its own MAP_REGION; these four are legitimately NOT modeled at all) show up
# as small enclosed voids in the union of every REGION_COUNTRIES polygon — real gaps,
# but not bugs, and close_interior_gaps() below must not paper over them. Identified by
# proximity: every genuine cross-border seam gap found in practice sits >1.5 degrees
# from all four of these; the microstates themselves land within 0.05.
UNMODELED_MICROSTATES = [
    ("Andorra", 1.52, 42.53),
    ("San Marino", 12.45, 43.94),
    ("Liechtenstein", 9.55, 47.14),
    ("Vatican", 12.45, 41.90),
]
MICROSTATE_EXCLUDE_RADIUS = 0.5


def close_interior_gaps(final_geoms, mechanical, countries, europe_bbox=(-10, 34, 45, 71)):
    """Round 8 gap fix, widened in round 9 (Craig: "as pixel perfect as possible").

    Round 8's version only compared claimed land against itself — reading the interior
    rings of the union of every region's own geometry, which finds any void fully
    enclosed BY claimed land. That's exactly right for an inland tripoint like Germany/
    Poland/Czechoslovakia near Cieszyn (~0.3 sq degrees, the "beige gap" from round 8's
    own screenshots), where three hand-authored polygons' approach vertices to the same
    corner don't quite meet. It misses a void that also touches the TRUE coastline,
    though: a gap between two regions right at the coast reads as a dent in the claimed
    union's own exterior boundary, not an interior ring, so round 8's method never saw
    it — confirmed round 9 by rasterizing regions.json against each campaign's own
    mask.png and diffing (see GERMANY_1937_COAST_PATCH_BOX above): real gap pixels
    remained along Germany's Baltic coast (Rügen, Farther Pomerania) that this function's
    old hole search reported zero holes anywhere near.

    Round 9 compares against the true land extent instead of the claimed union's own
    interior: `mechanical` is passed in from before hand-authored subtraction (so hand-
    authored regions' own claimed area doesn't count as "not land" just because nothing
    mechanical reaches it), plus modern Germany's and Poland's own raw country shapes
    (needed because "poland" has no mechanical entry at all — it's hand-authored only —
    so its real coastline detail, and the Farther Pomerania stretch that's 1937-German
    but modern-Polish, only exists in `countries`), plus every hand-authored region's own
    raw drawn shape (so a hand-authored region's intentional divergence from its modern
    country — Poland's Kresy, Germany's Silesia — is still counted as real land, not
    manufactured into a phantom gap). This finds every void the old method found (a
    strictly interior hole is also missing from the true land extent) plus every
    coast-touching one it missed, with no dependency on which side of the claimed
    union's own boundary a gap happens to fall.

    Real unmodeled microstates (Andorra, San Marino, Liechtenstein, Vatican — all below
    world-atlas's 50m cutoff, same as Malta was before round 8) show up as voids too;
    those are correct absences, not bugs, and are excluded by proximity before anything
    is patched. Every remaining gap gets unioned into whichever final_geoms region sits
    closest to it (typically touching it directly, at distance 0) — since the gap's own
    boundary is made entirely of arcs already belonging to real neighboring land, this
    closes it exactly, by construction, the same way border_lines() finds an exact
    shared edge: no new hand-picked coordinates, no risk of a fresh mismatch. A small
    area floor (below it, floating-point sliver noise from unioning independently-
    sourced datasets, not a visible gap at this map's scale) keeps this from chasing
    sub-pixel artifacts around every coastline on the map."""
    # Modern countries needed as extra true-land sources specifically because their
    # hand-authored counterpart's own coarse frontier doesn't reach every real vertex of
    # the modern border it's approximating: Germany/Poland for the Baltic coast (see
    # GERMANY_1937_COAST_PATCH_BOX), Czechia/Slovakia for the Moravia-Silesia stretch of
    # the Polish frontier (CZECHOSLOVAKIA_1938's own "(18.2, 49.6), (17.0, 50.3)" segment
    # cuts the corner on a real jog in the border that only modern Czechia's polygon has
    # — verified empirically: neither hand-authored polygon nor modern Germany/Poland
    # contains a point there, but modern Czechia does).
    extra_sources = [countries[n] for n in ("Germany", "Poland", "Czechia", "Slovakia") if n in countries]
    hand_raw = [Polygon(ring) for polys in HAND_AUTHORED.values() for ring in polys]
    true_land = unary_union(list(mechanical.values()) + extra_sources + hand_raw).intersection(box(*europe_bbox))
    claimed_union = unary_union(list(final_geoms.values())).intersection(box(*europe_bbox))

    gaps_geom = true_land.difference(claimed_union)
    raw_gaps = list(gaps_geom.geoms) if gaps_geom.geom_type == "MultiPolygon" else ([gaps_geom] if not gaps_geom.is_empty else [])
    AREA_FLOOR = 0.0005  # ~5 sq km at this latitude — well under one rendered pixel
    gaps = [g for g in raw_gaps if g.geom_type == "Polygon" and g.area > AREA_FLOOR]

    patched = dict(final_geoms)
    closed_count = 0
    microstate_count = 0
    for gap in gaps:
        c = gap.centroid
        if any(c.distance(Point(lon, lat)) < MICROSTATE_EXCLUDE_RADIUS for _, lon, lat in UNMODELED_MICROSTATES):
            microstate_count += 1
            continue
        best_id, best_dist = None, None
        for region_id, geom in patched.items():
            d = gap.distance(geom)
            if best_dist is None or d < best_dist:
                best_id, best_dist = region_id, d
        if best_id is None:
            continue
        patched[best_id] = unary_union([patched[best_id], gap])
        closed_count += 1
    print(f"close_interior_gaps: closed {closed_count} border-seam void(s), "
          f"left {microstate_count} unmodeled-microstate void(s) alone "
          f"({len(raw_gaps) - len(gaps)} sub-floor sliver(s) ignored)")
    return patched


# How far each region's FILL polygon (only — never the border-line layer, see
# extract_rings()'s docstring) grows past its exact simplified shape, to reach the real
# coastline as drawn by the completely separately-sourced base-map/mask art (Basemap's
# own GSHHS coastline, not this file's world-atlas polygons — two different datasets
# that were never going to trace the same line, no matter how exact our own topology
# is with itself). Shared political borders no longer need any of this — that gap is
# now closed by construction — so this only has to reach the coast, not another region.
COASTAL_GROW = 0.02


def main():
    countries = load_countries()

    mechanical = {}
    for region_id, names in REGION_COUNTRIES.items():
        missing = [n for n in names if n not in countries]
        if missing:
            raise SystemExit(f"region {region_id}: country name(s) not found in countries.geojson: {missing}")
        geom = unary_union([countries[n] for n in names])
        if region_id in REGION_CLIP_BBOX:
            lon0, lat0, lon1, lat1 = REGION_CLIP_BBOX[region_id]
            geom = geom.intersection(box(lon0, lat0, lon1, lat1))
        mechanical[region_id] = geom

    missing = [n for n in USSR_ZONE_COUNTRIES if n not in countries]
    if missing:
        raise SystemExit(f"ussr zones: country name(s) not found in countries.geojson: {missing}")
    mechanical.update(build_ussr_zones(countries))

    hand_authored = {}
    claimed = None
    for region_id in HAND_AUTHORED_PRIORITY:
        if region_id == "hungary":
            # No hand-typed ring for Hungary — its base shape is the real modern
            # country (round 13c/16 didn't find anything wrong with Hungary's own
            # modern-day borders, only with Ruthenia falling on the wrong side of
            # someone else's). See HUNGARY_RUTHENIA_PATCH_BOX's docstring above.
            geom = countries["Hungary"]
        else:
            polys = [Polygon(ring) for ring in HAND_AUTHORED[region_id]]
            geom = unary_union(polys) if len(polys) > 1 else polys[0]
        if region_id == "hungary":
            ruthenia_patch = countries["Ukraine"].intersection(box(*HUNGARY_RUTHENIA_PATCH_BOX))
            geom = unary_union([geom, ruthenia_patch])
        if region_id == "germany":
            # Round 9 coastal patch — see GERMANY_1937_COAST_PATCH_BOX's docstring.
            # Applied here, before the priority-subtraction below, so poland/czechia
            # still correctly lose any (in practice nonexistent) sliver this reclaims.
            coast_patch = unary_union([countries["Germany"], countries["Poland"]]).intersection(
                box(*GERMANY_1937_COAST_PATCH_BOX)
            )
            # Round 16 East Prussia patch — see EAST_PRUSSIA_KALININGRAD_PATCH_BOX's
            # docstring above.
            east_prussia_patch = unary_union([
                countries["Russia"].intersection(box(*EAST_PRUSSIA_KALININGRAD_PATCH_BOX)),
                countries["Lithuania"].intersection(box(*EAST_PRUSSIA_MEMEL_PATCH_BOX)),
            ])
            geom = unary_union([geom, coast_patch, east_prussia_patch])
        if claimed is not None:
            geom = geom.difference(claimed)
        hand_authored[region_id] = geom
        claimed = geom if claimed is None else unary_union([claimed, geom])

    # Precise (unsimplified) final geometry per region — hand-authored regions are
    # authoritative, so every mechanical region has their combined area subtracted out
    # first (round 5's overlap fix; unchanged). Everything downstream of this dict is
    # topology-consistent by construction (simplify_with_shared_topology), which is
    # what's new this round.
    final_geoms = {region_id: geom.difference(claimed) for region_id, geom in mechanical.items()}
    final_geoms.update(hand_authored)
    final_geoms = close_interior_gaps(final_geoms, mechanical, countries)

    simplified = simplify_with_shared_topology(final_geoms)

    regions = {}
    for region_id, geom in final_geoms.items():
        if region_id in hand_authored and region_id in HAND_AUTHORED:
            # The label anchor comes from the first (main) ring of the ORIGINAL
            # hand-authored shape, not the post-subtraction remainder, so an attached
            # exclave (East Prussia, on "germany") or a sliver clipped off by a
            # higher-priority neighbor never pulls the label away from the main body.
            label = label_point(Polygon(HAND_AUTHORED[region_id][0]))
        else:
            # Round 16: "hungary" is hand-authored (see HAND_AUTHORED_PRIORITY) but
            # has no hand-typed ring to anchor from — its main body is the compact
            # modern-Hungary dissolve, not a fragmented exclave shape, so labeling
            # off the final geometry (same as any mechanical region) is safe here.
            label = label_point(geom)
        regions[region_id] = {"rings": extract_rings(simplified[region_id], coastal_grow=COASTAL_GROW), "label": label}

    # A separate, deduplicated layer of every real inter-region border line (see
    # border_lines()'s docstring) — CheckpointMapRegions (src/App.jsx) draws these
    # instead of stroking each region's own full outline for the normal (non-diverged,
    # non-selected) case. Keyed under a name that can never collide with a MAP_REGIONS
    # id (all of which are bare camelCase identifiers, never leading-underscored) so
    # existing `geometry[r.id]` lookups in src/App.jsx silently skip right past it.
    regions["__interiorBorders__"] = border_lines(simplified)

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(regions, f, separators=(",", ":"))

    region_count = len(regions) - 1  # exclude __interiorBorders__
    total_points = sum(len(ring) for k, r in regions.items() if k != "__interiorBorders__" for ring in r["rings"])
    border_points = sum(len(line) for line in regions["__interiorBorders__"])
    print(f"wrote {OUT_PATH}: {region_count} regions, {total_points} region points, "
          f"{len(regions['__interiorBorders__'])} border lines ({border_points} points), "
          f"{os.path.getsize(OUT_PATH)} bytes")


if __name__ == "__main__":
    main()
