#!/usr/bin/env python3
"""Generate the Checkpoint Map's base theater art for Historical Divergence Mode.

Produces one illustrated-looking base map per campaign per year at
assets/maps/<campaignId>/<year>.png, in a style consistent with the game's
existing torn-paper / dossier aesthetic: a real (if low-resolution) outline
of the relevant European/Mediterranean/African theater rendered from actual
coastline and border data, aged with paper grain and a vignette, tinted with
a campaign-accent wash, and stamped with a year and title.

Kept the "generate_placeholder_maps" filename (referenced from src/App.jsx
comments, README.md, and docs/specs/) even after Round 19 removed the visible
"PLACEHOLDER ART" watermark this script used to stamp on every image —
renaming would touch three files for a purely cosmetic gain. The art itself
was never actually placeholder-quality (real coastline/border shapefiles via
basemap, not a synthetic blob), just labeled that way as a pre-ship reminder.

Earlier versions of this script drew a purely synthetic "wandering polygon"
coastline, which read as an abstract blob rather than a recognizable map.
This version renders the real geography for each campaign's theater with
mpl_toolkits.basemap (backed by the basemap-data package, which ships actual
coastline/border shapefiles inside the pip package — no network fetch is
needed at generation time), then applies the same aged-dossier treatment on
top. CheckpointMap overlays small colored dots for revealed divergence forks
on top of whatever image sits at this path — those marker positions are
NOT geocoded to real coordinates (see CAMPAIGN_MAP_YEARS / CheckpointMap in
src/App.jsx), so this script's only job is to make the base image look like
a real period theater map, not to hit exact lat/lon marks.

Usage: python3 tools/generate_placeholder_maps.py
"""
import io
import math
import os
import random

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "maps")

W, H = 800, 600

# Per-campaign theater bounding boxes (lat/lon), chosen to cover every node's
# real-world location across that campaign's whole run, not just its starting
# front — e.g. italy needs the Western Desert as well as home territory and
# enough of Central Europe to read as Italy's actual strategic context (round
# 10), soviet needs to reach Berlin by 1945 as well as Moscow/Stalingrad.
CAMPAIGNS = {
    "german": {
        "accent": (122, 46, 46), "label": "OKW", "years": [1940, 1941, 1942, 1943, 1944, 1945],
        "bbox": {"llcrnrlat": 32, "urcrnrlat": 71, "llcrnrlon": -10, "urcrnrlon": 55},
    },
    "soviet": {
        "accent": (138, 47, 31), "label": "STAVKA", "years": [1941, 1942, 1943, 1944, 1945],
        "bbox": {"llcrnrlat": 38, "urcrnrlat": 66, "llcrnrlon": 5, "urcrnrlon": 62},
    },
    "allied": {
        "accent": (47, 74, 58), "label": "SHAEF", "years": [1940, 1941, 1942, 1943, 1944, 1945],
        "bbox": {"llcrnrlat": 27, "urcrnrlat": 60, "llcrnrlon": -12, "urcrnrlon": 42},
    },
    "italy": {
        "accent": (46, 74, 107), "label": "COMANDO SUPREMO", "years": [1940, 1941, 1942, 1943, 1944, 1945],
        # Round 10 (Craig: the map "looks centred a little low" and Europe "may need to be
        # a little more visible"): the original box (-3 to 47) put Italy's own northern
        # border at the very top edge and spent the entire lower ~80% of the frame on
        # empty Sahara/equatorial Africa — nothing this campaign ever pins or colors sits
        # south of Egypt/Libya (~19-22°N; src/App.jsx's MAP_LANDMARKS/MAP_CITIES reach no
        # further south than Cairo at 30°N), and it came at the expense of Central Europe
        # (Austria/Hungary/Balkans cramped, Germany/Poland cut off entirely) despite the
        # Axis alliance and eastern front being central to this campaign's own text. Must
        # match CAMPAIGN_MAP_BBOX.italy in src/App.jsx exactly — that constant re-projects
        # regions.json live using this same box, and a mismatch would misalign the color
        # overlay against this base art.
        "bbox": {"llcrnrlat": 10, "urcrnrlat": 54, "llcrnrlon": -8, "urcrnrlon": 52},
    },
}

LAND_COLOR = (208, 191, 156)
OCEAN_COLOR = (168, 190, 184)
INK = (58, 44, 28)


def find_font(size, bold=False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()


def render_geography(bbox):
    """Render the real coastline/border geography for a theater bbox to an
    800x600 PIL image using Basemap + the offline basemap-data shapefiles."""
    fig = plt.figure(figsize=(W / 100, H / 100), dpi=100)
    ax = fig.add_axes([0, 0, 1, 1])
    m = Basemap(
        projection="merc",
        # Round 8: "l" (low) resolution silently drops any island under its
        # ~1000 sq km default area_thresh — Malta (~316 sq km) never rendered as
        # land at all, base map or mask, no matter what regions.json said (Craig
        # asked for Malta as a real region; a colored polygon with an invisible
        # island under it isn't that). "i" (intermediate) drops that threshold to
        # ~100 sq km, which is installed in this environment's basemap-data
        # package and confirmed to actually paint Malta's few pixels at this
        # bbox/resolution — a few seconds slower per campaign, no visible
        # regression on the coastlines that already rendered fine at "l".
        resolution="i",
        fix_aspect=False,
        ax=ax,
        **bbox,
    )
    m.drawmapboundary(fill_color=[c / 255 for c in OCEAN_COLOR])
    m.fillcontinents(color=[c / 255 for c in LAND_COLOR], lake_color=[c / 255 for c in OCEAN_COLOR])
    m.drawcoastlines(color=[c / 255 for c in INK], linewidth=0.7)
    # No drawcountries() here (deliberately — this used to draw modern political
    # borders baked permanently into the base image). Two problems with that: those
    # borders don't move as the game's own front lines do (a 1940s occupied-but-still-
    # "Germany"-shaped blob kept showing today's Germany/Poland line right through the
    # middle of it), and for the three regions this project hand-corrects to WWII-era
    # borders (Poland/Germany/Czechoslovakia — see tools/build_region_geometry.py),
    # the modern line drawn here didn't even match the shape CheckpointMapRegions
    # colors in on top of it. The dynamic ownership overlay (assets/maps/regions.json
    # + CheckpointMapRegions in src/App.jsx) draws its own per-region borders that
    # stay correct for whatever year/status is showing, so this base layer only needs
    # coastlines now.
    ink_frac = (INK[0] / 255, INK[1] / 255, INK[2] / 255)
    m.drawparallels(range(-80, 90, 5), color=ink_frac, linewidth=0.3, dashes=[1, 2])
    m.drawmeridians(range(-40, 90, 5), color=ink_frac, linewidth=0.3, dashes=[1, 2])
    ax.set_xlim(0, m.urcrnrx)
    ax.set_ylim(0, m.urcrnry)

    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=100)
    plt.close(fig)
    buf.seek(0)
    img = Image.open(buf).convert("RGB")
    if img.size != (W, H):
        img = img.resize((W, H), Image.LANCZOS)
    return img


def render_land_mask(bbox):
    """Render a plain white-land/black-sea mask for a theater bbox, at the same size,
    projection, and bbox as render_geography() — used by CheckpointMapRegions (src/App.jsx)
    to hide the dynamic ownership-color overlay over water and guarantee full coverage over
    land, regardless of how well assets/maps/regions.json's own polygons (traced from a
    completely different dataset, world-atlas, than this Basemap/GSHHS coastline) happen to
    line up with the coastline actually drawn here. Two coastlines from two different sources
    were never going to align pixel-for-pixel — this sidesteps that entirely by keying the
    color overlay's visibility to this image's own land/sea pixels instead of trusting either
    vector shape's precision (Craig: "a rule based on the colour. The sea blue needs to be
    uncovered and the rest covered"). One mask per campaign (geography doesn't change year to
    year, only the color overlay and aging noise do), not one per year like the base art.
    Deliberately undecorated (no coastline stroke, parallels/meridians, compass, or aging
    noise) and saved without palette quantization.

    Round 12 (Craig, from a phone screenshot of the color overlay against the base art: "take
    the colour country up to the black line of the sea so there isn't a little beige line
    between the sea and the country"). The mask used to be saved exactly as matplotlib
    rendered it at output resolution (800x600, dpi=100) — a genuinely smooth grayscale
    gradient across the 1-2 pixels straddling every coastline, deliberately, on the theory
    that "a soft-edged mask reads better than a jagged one." SVG masks read that grayscale as
    partial alpha, so the color overlay actually fades out through that gradient rather than
    switching off — over those pixels the player sees a blend of the status color and
    whatever's underneath (this image's own raw LAND_COLOR beige, since the color group sits
    on top of the base map), which is exactly the "little beige line" Craig's screenshot
    shows, worse the more the modal gets scaled up (a bigger screen or a pinch-zoom stretches
    that 1-2 source pixels of blend across visibly more screen space). Fixed by rendering at
    4x this image's final size (dpi=400, so the actual matplotlib figure comes out at
    3200x2400) and then thresholding to pure black/white after downsampling to 800x600 —
    the LANCZOS downsample folds the oversampled edge into a far more accurate ~1-pixel
    transition at final resolution than direct dpi=100 rendering ever could, and thresholding
    that snaps every pixel fully on or off, so the color overlay's alpha now switches
    cleanly at the coast instead of fading through it. The tradeoff is a very slightly more
    stepped edge under heavy zoom rather than a smooth gradient — deliberately accepted this
    round, since a crisp edge "up to the black line" was the explicit ask."""
    OVERSAMPLE = 4
    fig = plt.figure(figsize=(W / 100, H / 100), dpi=100 * OVERSAMPLE)
    ax = fig.add_axes([0, 0, 1, 1])
    m = Basemap(projection="merc", resolution="i", fix_aspect=False, ax=ax, **bbox)
    m.drawmapboundary(fill_color="black")
    m.fillcontinents(color="white", lake_color="black")
    ax.set_xlim(0, m.urcrnrx)
    ax.set_ylim(0, m.urcrnry)

    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=100 * OVERSAMPLE)
    plt.close(fig)
    buf.seek(0)
    img = Image.open(buf).convert("L")
    if img.size != (W, H):
        img = img.resize((W, H), Image.LANCZOS)
    # Hard threshold (see docstring above) — every pixel becomes fully land (255) or fully
    # sea (0), no partial-alpha pixels left for the SVG mask to blend through.
    img = img.point(lambda p: 255 if p >= 128 else 0)
    return img


def age_image(base_img, rng):
    img = base_img.copy()
    # Fine paper grain.
    noise = Image.new("L", (W, H))
    px = noise.load()
    for y in range(H):
        for x in range(W):
            px[x, y] = rng.randint(0, 40)
    noise = noise.filter(ImageFilter.GaussianBlur(1))
    img = Image.composite(Image.new("RGB", (W, H), (35, 27, 15)), img, noise.point(lambda v: int(v * 0.22)))
    # Vignette toward the edges for an aged look.
    vign = Image.new("L", (W, H), 0)
    vd = ImageDraw.Draw(vign)
    vd.ellipse([-W * 0.25, -H * 0.25, W * 1.25, H * 1.25], fill=255)
    vign = vign.filter(ImageFilter.GaussianBlur(80))
    dark = Image.new("RGB", (W, H), (48, 38, 24))
    img = Image.composite(img, dark, vign)
    return img


def draw_compass(draw, accent):
    cx, cy, r = W - 70, 70, 30
    ink = tuple(max(0, c - 60) for c in accent)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=ink, width=2)
    draw.line([(cx, cy - r + 6), (cx, cy + r - 6)], fill=ink, width=2)
    draw.line([(cx - r + 6, cy), (cx + r - 6, cy)], fill=ink, width=2)
    draw.polygon([(cx, cy - r + 2), (cx - 6, cy - r + 14), (cx + 6, cy - r + 14)], fill=ink)


def make_map(geo_img, campaign_id, year, meta, rng):
    accent = meta["accent"]
    # No more full-image campaign-accent wash here — political-ownership color now comes
    # from a live SVG overlay in CheckpointMap (assets/maps/regions.json, colored per
    # MAP_YEAR_STATUS + mapOverrides()), which needs a neutral base underneath it. The
    # accent still shows up in the frame/compass/title ink so each campaign's map still
    # reads distinctly at a glance.
    img = age_image(geo_img, rng)
    draw = ImageDraw.Draw(img, "RGBA")
    draw_compass(draw, accent)

    ink = tuple(max(0, c - 60) for c in accent)
    draw.rectangle([8, 8, W - 9, H - 9], outline=ink, width=3)

    title_font = find_font(28, bold=True)
    sub_font = find_font(16)
    draw.text((28, 24), meta["label"], font=title_font, fill=ink)
    draw.text((28, 58), f"Theater Overview — {year}", font=sub_font, fill=ink)

    img = img.filter(ImageFilter.GaussianBlur(0.3))
    return img


def main():
    for campaign_id, meta in CAMPAIGNS.items():
        print(f"rendering geography for {campaign_id}...")
        geo_img = render_geography(meta["bbox"])
        out_dir = os.path.join(OUT, campaign_id)
        os.makedirs(out_dir, exist_ok=True)

        mask_img = render_land_mask(meta["bbox"])
        mask_path = os.path.join(out_dir, "mask.png")
        mask_img.save(mask_path, "PNG", optimize=True)
        print(f"wrote {mask_path}")

        for year in meta["years"]:
            seed = abs(hash((campaign_id, year))) % (2 ** 31)
            rng = random.Random(seed)
            img = make_map(geo_img, campaign_id, year, meta, rng)
            path = os.path.join(out_dir, f"{year}.png")
            # These are flat, muted-palette illustrations (not photos), so quantizing to a
            # modest palette shrinks the shipped PNG substantially with no visible loss —
            # meaningful here since 23 of these ship inside every itch.io build zip.
            img.quantize(colors=64, method=Image.MEDIANCUT).save(path, "PNG", optimize=True)
            print(f"wrote {path}")


if __name__ == "__main__":
    main()
