import fs from "fs";
import * as topojson from "topojson-client";

// 50m, not 110m: round 8 switched resolution after Craig asked for Malta (missing entirely
// from the 110m dataset — it and several other microstates, Andorra/Monaco/Vatican/
// Liechtenstein, are below that resolution's cutoff) and "a better pass" on border accuracy
// generally. 50m gives every mechanically-dissolved region (everything except the three
// hand-authored ones) a meaningfully more accurate coastline/border at the same country-name
// keys — verified all 41 REGION_COUNTRIES names used at the time of the switch resolve
// unchanged in the 50m feature set, so this is a resolution upgrade, not a remapping.
const topo = JSON.parse(fs.readFileSync("./node_modules/world-atlas/countries-50m.json", "utf8"));
const geo = topojson.feature(topo, topo.objects.countries);

// world-atlas's countries-50m ships numeric ISO-3166-1 ids and (recent versions) a "name"
// property. Print a sample to confirm shape before trusting it.
console.log("feature count:", geo.features.length);
console.log("sample properties:", JSON.stringify(geo.features.slice(0, 3).map(f => f.properties)));

fs.writeFileSync("./countries.geojson", JSON.stringify(geo));
console.log("wrote countries.geojson");
