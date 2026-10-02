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
