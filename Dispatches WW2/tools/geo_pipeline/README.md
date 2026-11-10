# geo_pipeline

One-time input for `tools/build_region_geometry.py`. `countries.geojson` is modern
country outlines (world-atlas's `countries-50m.json`, converted from TopoJSON to
GeoJSON via `convert.mjs` + `topojson-client`) — real, accurate, but modern-day
borders, which is why `build_region_geometry.py` substitutes hand-authored polygons
for Poland/Germany/Czechoslovakia instead of using this file for those three.

Round 8 switched this from the 110m resolution to 50m: Malta (and Andorra/Monaco/
Vatican/Liechtenstein) don't exist at all in the 110m dataset — it's below that
resolution's size cutoff — and every mechanically-dissolved region gets a more
accurate coastline/border at 50m for free, at the same country-name keys
`REGION_COUNTRIES` already uses (verified: no renaming needed).

To regenerate `countries.geojson` (only needed if world-atlas ships an update):

```
npm install world-atlas@2 topojson-client
node convert.mjs
```

(`convert.mjs` reads `countries-50m.json` from the installed `world-atlas` package —
`npm install world-atlas@2` ships both the 50m and 110m files, so no separate package
or version is needed for this.)

Not part of the game build — this directory and `build_region_geometry.py` only
produce `assets/maps/regions.json`, which IS shipped.

## The Eastern Front zones

`build_region_geometry.py` writes the Soviet Union as three army-group zones (`ussrNorth`, `ussrCenter`,
`ussrSouth`). The game uses nine finer ones (Leningrad & Karelia, Northern Russia, Belorussia, Central Russia, Volga &
Urals, Ukraine & Crimea, Don & Volga, Caucasus, Central Asia), made from those three by a second step that needs no
Python libraries:

```
python tools/build_region_geometry.py
node tools/split-ussr-zones.mjs
```

The second script refuses to run if the file already holds the nine. It splits each old zone by straight lines and by the
Belarus-Russia and Ukraine-Russia borders (the chains of vertices those two outlines share in `countries.geojson`), keeps
the outer outline of each old zone vertex for vertex, checks 56 named places against the zone each belongs to, and adds
the new border lines to `__interiorBorders__`. See its header for the method and the reasons for each line.
