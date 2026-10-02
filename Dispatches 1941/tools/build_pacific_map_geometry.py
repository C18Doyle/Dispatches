#!/usr/bin/env python3
"""
Builds assets/maps/pacific-regions.json for Dispatches 1941's real-geography PacificMap,
from Natural Earth 1:50m Admin-0 Countries (public domain; downloaded from
nvkelso/natural-earth-vector's geojson mirror of the official Natural Earth dataset).

Source file (not checked in — ~3MB, regenerate before rerunning this script):
  curl -o countries-50m.geojson \
    https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson
Place it next to this script (SRC below) before running.

Same projection PacificMap already used for its lat/long reference grid (see the file's
own comment: "x = 40 + (lon-79)*7.15", "y = 30 + (53-lat)*7.19") is reused here so the
new coastline/border geometry lines up with that grid, and with anything else in the
file that assumes this projection, without needing to touch that code.

Output has two parts:
  - "backdrop": every country whose territory falls anywhere inside the visible window,
    as simplified real coastline/border rings, for geographic context (rendered as a
    neutral base layer under everything else).
  - "regions": for the 17 of the game's 24 MAP_REGIONS ids that map cleanly onto one or
    more modern country polygons (a straight one-to-one for most; Indochina and the
    Marianas are the two real historical/administrative groupings, each merging more
    than one modern country's rings under a single id — see REGION_SOURCES below for
    exactly which countries and why). The remaining 7 MAP_REGIONS ids (manchuria,
    okinawa, iwoJima, pearlHarbor, midway, attu, sovietFarEast) have no clean modern
    country-level polygon of their own — Manchuria isn't a country any more, Okinawa and
    Iwo Jima are Japanese prefecture/sub-prefecture territory the country-level polygon
    doesn't separate out, and Pearl Harbor/Midway/Attu are small features 50m-scale
    country data doesn't resolve as distinct shapes. Rather than hand-drawing invented
    boundaries for any of these (this project's whole research discipline is built
    around not doing that), PacificMap keeps rendering those 7 as status-colored discs,
    same as every region was before this pass, just now positioned by real verified
    lat/long (see PIN_REGIONS below) over the real coastline backdrop instead of over a
    blank hex-textured background.
"""
import json
import math
import os

SRC = os.path.join(os.path.dirname(__file__), "countries-50m.geojson")
OUT = os.path.join(os.path.dirname(__file__), "pacific-regions.json")

# Same projection constants PacificMap's own lat/long reference-grid code already uses.
ORIGIN_LON = 79
ORIGIN_LAT = 53
SCALE_X = 7.15
SCALE_Y = 7.19
PAD_X = 40
PAD_Y = 30
VBW = 960
VBH = 650
# Small margin so rings that are only just offscreen still get included (their edges
# can still be visible once stroke width / a slightly wider viewport is accounted for).
MARGIN = 40


# Longitude at the center of the window this map actually shows (window spans roughly
# 73E to 208E — see ORIGIN_LON/SCALE_X/VBW above), used to pick which of a ring's two
# possible antimeridian-wrapped positions (its raw longitude, or raw+360) actually
# belongs near this map. Applied ONCE PER RING, using that ring's own center longitude,
# never per point — a per-point modulo (tried first, during development) unwraps every
# ring independently of its neighbors and silently tears apart any ring whose raw
# longitude happens to straddle the modulo's own cut point (it did exactly this to
# several South American countries, whose real extent straddles raw -60E, producing
# bogus ~360-degree-wide rings that then falsely appeared to overlap this Pacific-side
# window). A per-ring shift is safe here because Natural Earth's own multipolygons
# already split any country whose territory truly crosses the antimeridian (Russia,
# checked directly: its mainland ring stops exactly at raw lon 180, with Chukotka as a
# separate ring starting at raw -180) — so no individual ring in this dataset needs a
# mid-ring wrap at all, only a whole-ring choice of which side of the globe to draw it on.
WINDOW_CENTER_LON = (ORIGIN_LON - PAD_X / SCALE_X) + (VBW / SCALE_X) / 2


def ring_lon_shift(raw_lons):
    center = (min(raw_lons) + max(raw_lons)) / 2
    return 360 if abs(center + 360 - WINDOW_CENTER_LON) < abs(center - WINDOW_CENTER_LON) else 0


def project(lon, lat, shift=0):
    x = PAD_X + ((lon + shift) - ORIGIN_LON) * SCALE_X
    y = PAD_Y + (ORIGIN_LAT - lat) * SCALE_Y
    return (round(x, 1), round(y, 1))


def ring_bbox(ring):
    xs = [p[0] for p in ring]
    ys = [p[1] for p in ring]
    return (min(xs), min(ys), max(xs), max(ys))


def bbox_overlaps_window(bbox):
    x0, y0, x1, y1 = bbox
    return not (x1 < -MARGIN or x0 > VBW + MARGIN or y1 < -MARGIN or y0 > VBH + MARGIN)


def rdp(points, epsilon):
    # Standard Ramer-Douglas-Peucker simplification, run in already-projected pixel
    # space (so epsilon is a pixel tolerance, easy to reason about against a 960x650
    # viewBox) rather than in degrees.
    if len(points) < 3:
        return points

    def perp_dist(pt, a, b):
        (x, y), (ax, ay), (bx, by) = pt, a, b
        dx, dy = bx - ax, by - ay
        if dx == 0 and dy == 0:
            return math.hypot(x - ax, y - ay)
        t = ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)
        t = max(0, min(1, t))
        px, py = ax + t * dx, ay + t * dy
        return math.hypot(x - px, y - py)

    dmax, idx = 0, 0
    for i in range(1, len(points) - 1):
        d = perp_dist(points[i], points[0], points[-1])
        if d > dmax:
            dmax, idx = d, i
    if dmax > epsilon:
        left = rdp(points[: idx + 1], epsilon)
        right = rdp(points[idx:], epsilon)
        return left[:-1] + right
    return [points[0], points[-1]]


def project_ring(coords):
    shift = ring_lon_shift([lon for lon, lat in coords])
    return [project(lon, lat, shift) for lon, lat in coords]


def simplify_ring(points, epsilon):
    if len(points) <= 4:
        return points
    closed = points[0] == points[-1]
    pts = points[:-1] if closed else points
    simplified = rdp(pts, epsilon)
    if closed and simplified[0] != simplified[-1]:
        simplified.append(simplified[0])
    return simplified


def ring_area(ring):
    # Shoelace formula, signed area — used only to compare ring sizes (pick the main
    # landmass out of a MultiPolygon's islands), so the sign doesn't matter here.
    a = 0.0
    for i in range(len(ring) - 1):
        x0, y0 = ring[i]
        x1, y1 = ring[i + 1]
        a += x0 * y1 - x1 * y0
    return abs(a) / 2.0


def ring_centroid(ring):
    # True polygon centroid (area-weighted), not a plain average of vertices — a plain
    # vertex average skews toward whichever coastline stretch happens to have the most
    # simplified points left, which is exactly the kind of arbitrary artifact this
    # centroid is meant to avoid.
    a = 0.0
    cx = 0.0
    cy = 0.0
    for i in range(len(ring) - 1):
        x0, y0 = ring[i]
        x1, y1 = ring[i + 1]
        cross = x0 * y1 - x1 * y0
        a += cross
        cx += (x0 + x1) * cross
        cy += (y0 + y1) * cross
    a *= 0.5
    if abs(a) < 1e-9:
        xs = [p[0] for p in ring]
        ys = [p[1] for p in ring]
        return (round(sum(xs) / len(xs), 1), round(sum(ys) / len(ys), 1))
    cx /= 6 * a
    cy /= 6 * a
    return (round(cx, 1), round(cy, 1))


def polygons_of(feature):
    geom = feature["geometry"]
    if geom["type"] == "Polygon":
        return [geom["coordinates"]]
    if geom["type"] == "MultiPolygon":
        return geom["coordinates"]
    return []


def extract_rings(feature, epsilon, drop_specks_below=None):
    """Returns a flat list of simplified, projected exterior+hole rings for whichever of
    this feature's polygon parts (islands, for a MultiPolygon) actually fall inside the
    visible window. drop_specks_below, when given, discards a part whose on-screen bbox
    is smaller than that many pixels on both axes — used only for the generic backdrop
    layer's visual declutter, never for a named political region (see module docstring)."""
    out = []
    for poly in polygons_of(feature):
        for ring_idx, ring_coords in enumerate(poly):
            projected = project_ring(ring_coords)
            bbox = ring_bbox(projected)
            if not bbox_overlaps_window(bbox):
                continue
            if drop_specks_below and ring_idx == 0:
                w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
                if w < drop_specks_below and h < drop_specks_below:
                    continue
            simplified = simplify_ring(projected, epsilon)
            if len(simplified) >= 3:
                out.append(simplified)
    return out


def main():
    with open(SRC) as f:
        data = json.load(f)
    by_name = {}
    for feature in data["features"]:
        by_name.setdefault(feature["properties"]["NAME"], []).append(feature)

    # Real, verified 1:1 or merged-group mappings from a MAP_REGIONS id to one or more
    # modern country NAME values in this dataset. Indochina (French Indochina, 1940s) is
    # the real historical grouping of Vietnam + Laos + Cambodia; the Marianas grouping
    # (Guam + Northern Mariana Islands) reflects that both are the real present-day
    # political split of the same island chain the game treats as one theater region.
    # Every other id here is a direct, unambiguous match to a single modern country.
    REGION_SOURCES = {
        "japan": ["Japan"],
        "formosa": ["Taiwan"],
        "china": ["China"],
        "indochina": ["Vietnam", "Laos", "Cambodia"],
        "thailand": ["Thailand"],
        "burma": ["Myanmar"],
        "india": ["India"],
        "malaya": ["Malaysia"],
        "indies": ["Indonesia"],
        "philippines": ["Philippines"],
        "newGuinea": ["Papua New Guinea"],
        "solomons": ["Solomon Is."],
        "australia": ["Australia"],
        "gilberts": ["Kiribati"],
        "marshalls": ["Marshall Is."],
        "marianas": ["Guam", "N. Mariana Is."],
        "palau": ["Palau"],
    }

    regions = {}
    used_names = set()
    for region_id, names in REGION_SOURCES.items():
        rings = []
        for name in names:
            feats = by_name.get(name)
            if not feats:
                raise SystemExit(f"Missing expected country '{name}' for region '{region_id}'")
            used_names.add(name)
            for feat in feats:
                rings.extend(extract_rings(feat, epsilon=0.6))
        # Label/edge-line anchor point: the centroid (by real polygon area, shoelace
        # formula) of the region's single largest ring — its main landmass — not just
        # whichever ring happens to have the most points after simplification. This
        # replaces the old MAP_REGIONS' hand-placed x/y guesses with a point actually
        # derived from the real geometry.
        largest = max(rings, key=ring_area) if rings else None
        label = ring_centroid(largest) if largest else (0, 0)
        regions[region_id] = {"rings": rings, "label": label}

    # Backdrop: every country in the dataset, simplified more aggressively (it's context,
    # not the interactive/colored content) and with sub-2px specks dropped, EXCEPT the
    # countries already captured above at higher fidelity for regions — no need to draw
    # a low-detail copy of Japan underneath the high-detail one that's about to sit on
    # top of it. Still restricted to whatever actually falls inside the visible window.
    backdrop = []
    for name, feats in by_name.items():
        if name in used_names:
            continue
        rings = []
        for feat in feats:
            rings.extend(extract_rings(feat, epsilon=1.0, drop_specks_below=2.0))
        if rings:
            backdrop.append({"name": name, "rings": rings})

    # The 7 MAP_REGIONS ids with no clean modern country-level polygon (see module
    # docstring) — real, individually verified lat/long for each, same as this file's
    # own MAP_CITIES/MAP_LANDMARKS-style entries elsewhere use, projected through the
    # exact same pipeline as everything else here so they land correctly relative to
    # the real coastlines around them.
    PIN_SOURCES = {
        "manchuria": (123.43, 41.80),      # Shenyang (Mukden), the historical Manchukuo-era regional capital
        "okinawa": (127.68, 26.21),        # Naha
        "iwoJima": (141.32, 24.78),        # Iwo Jima (Iwo To)
        "pearlHarbor": (-157.98, 21.35),   # Pearl Harbor, Oahu
        "midway": (-177.37, 28.21),        # Midway Atoll
        "attu": (172.90, 52.88),           # Attu Island
        "sovietFarEast": (131.90, 43.12),  # Vladivostok
    }
    pins = {}
    for region_id, (lon, lat) in PIN_SOURCES.items():
        shift = ring_lon_shift([lon])
        pins[region_id] = {"lon": lon, "lat": lat, "label": list(project(lon, lat, shift))}

    out = {
        "meta": {
            "projection": {
                "originLon": ORIGIN_LON,
                "originLat": ORIGIN_LAT,
                "scaleX": SCALE_X,
                "scaleY": SCALE_Y,
                "padX": PAD_X,
                "padY": PAD_Y,
                "vbw": VBW,
                "vbh": VBH,
            },
            "source": "Natural Earth 1:50m Admin-0 Countries (public domain), simplified for this map",
        },
        "regions": regions,
        "pins": pins,
        "backdrop": backdrop,
    }
    with open(OUT, "w") as f:
        json.dump(out, f, separators=(",", ":"))

    total_region_pts = sum(len(r) for reg in regions.values() for r in reg["rings"])
    total_backdrop_pts = sum(len(r) for b in backdrop for r in b["rings"])
    print(f"regions: {len(regions)} ids, {sum(len(v['rings']) for v in regions.values())} rings, {total_region_pts} points")
    print(f"pins: {len(pins)} ids")
    print(f"backdrop: {len(backdrop)} countries, {sum(len(b['rings']) for b in backdrop)} rings, {total_backdrop_pts} points")
    print(f"output size: {os.path.getsize(OUT)/1024:.1f} KB -> {OUT}")


if __name__ == "__main__":
    main()
