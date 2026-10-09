// check-map.mjs: the theater map is data too. Fails on: a region without geometry or the reverse; geometry that is not split into zones; a timeline with a
// missing region, an unsorted or malformed date or an unknown status; a year-end table that is not what the timeline gives; a route between unknown regions;
// a report date the map cannot read; a year with a missing or unknown status; a status without a
// colour or label; a map override (mapOverrides, over many real wars) that names an unknown region or status; a node hint that names an unknown node or region.
// Usage: node tools/check-map.mjs
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { loadFromJsx } from "../../packages/testkit/src/load-campaigns.mjs";
import { loadGame, playWar, seeded } from "./audit-lib.mjs";

const esbuild = createRequire(import.meta.url)("esbuild");
const m = loadFromJsx(esbuild, "src/App.jsx", ["MAP_REGIONS", "MAP_YEAR_STATUS", "STATUS_COLORS", "STATUS_LABELS", "NODE_REGION_HINTS", "mapOverrides", "NODE_ATLAS", "MAP_TIMELINE", "MAP_EDGES", "nodeDayKey", "baselineStatuses"]);
const geometry = JSON.parse(readFileSync("assets/maps/pacific-regions.json", "utf8"));
const problems = [];
const ids = m.MAP_REGIONS.map((r) => r.id);
const known = new Set(ids);

if (new Set(ids).size !== ids.length) problems.push("MAP_REGIONS has a duplicate id");
for (const r of m.MAP_REGIONS) {
  const src = r.kind === "pin" ? geometry.pins : geometry.regions;
  if (!src[r.id]) problems.push(`region ${r.id} (${r.kind}) has no geometry in assets/maps/pacific-regions.json`);
}
for (const id of [...Object.keys(geometry.regions), ...Object.keys(geometry.pins)]) if (!known.has(id)) problems.push(`geometry for ${id} has no entry in MAP_REGIONS`);

if (!geometry.meta.zonesSplit) problems.push("assets/maps/pacific-regions.json is not split into zones: run node tools/split-pacific-zones.mjs after build_pacific_map_geometry.py");
for (const [a, b] of m.MAP_EDGES) for (const id of [a, b]) if (!known.has(id)) problems.push(`a route names unknown region ${id}`);

const statuses = new Set(Object.keys(m.STATUS_COLORS));
// the dated timeline
const isoOk = (d) => {
  const mm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (!mm) return false;
  const t = new Date(Date.UTC(Number(mm[1]), Number(mm[2]) - 1, Number(mm[3])));
  return t.getUTCFullYear() === Number(mm[1]) && t.getUTCMonth() === Number(mm[2]) - 1 && t.getUTCDate() === Number(mm[3]);
};
for (const id of ids) if (!m.MAP_TIMELINE[id]) problems.push(`MAP_TIMELINE has no entry for ${id}`);
for (const [id, entries] of Object.entries(m.MAP_TIMELINE)) {
  if (!known.has(id)) problems.push(`MAP_TIMELINE names unknown region ${id}`);
  if (!entries.length || entries[0][0] !== "1940-01-01") problems.push(`MAP_TIMELINE ${id} must begin on 1940-01-01`);
  let prev = "";
  for (const [d, st] of entries) {
    if (!isoOk(d)) problems.push(`MAP_TIMELINE ${id}: bad date ${d}`);
    else if (d <= prev) problems.push(`MAP_TIMELINE ${id}: ${d} is not after ${prev}`);
    else if (d > "1945-12-31") problems.push(`MAP_TIMELINE ${id}: ${d} is after the war`);
    prev = d;
    if (!statuses.has(st)) problems.push(`MAP_TIMELINE ${id}: unknown status "${st}" on ${d}`);
  }
  for (let i = 1; i < entries.length; i++) if (entries[i][1] === entries[i - 1][1]) problems.push(`MAP_TIMELINE ${id}: ${entries[i][0]} repeats the status "${entries[i][1]}"`);
}
// the year-end table is derived: it must still be what the timeline gives
for (const y of [1940, 1941, 1942, 1943, 1944, 1945]) {
  const want = m.baselineStatuses((y + 1) * 10000 + 101);
  for (const id of ids) if (m.MAP_YEAR_STATUS[y] && m.MAP_YEAR_STATUS[y][id] !== want[id]) problems.push(`${y}: the year-end table says ${m.MAP_YEAR_STATUS[y][id]} for ${id}, the timeline ${want[id]}`);
}
// every report's date can be read by the map
for (const grp of Object.values(m.NODE_ATLAS))
  for (const n of grp) {
    const k = m.nodeDayKey(n.date);
    if (k == null) problems.push(`report ${n.id}: the date "${n.date}" holds no year the map can read`);
    else if (k < 19400101 || k > 19501231) problems.push(`report ${n.id}: the date "${n.date}" reads as ${k}`);
  }
for (const s of statuses) if (!m.STATUS_LABELS[s]) problems.push(`status ${s} has a colour and no label`);
for (const [year, map] of Object.entries(m.MAP_YEAR_STATUS)) {
  for (const id of ids) if (!map[id]) problems.push(`${year}: no status for ${id}`);
  for (const [id, s] of Object.entries(map)) {
    if (!known.has(id)) problems.push(`${year}: status for unknown region ${id}`);
    if (!statuses.has(s)) problems.push(`${year}: unknown status "${s}" for ${id}`);
  }
}
const years = Object.keys(m.MAP_YEAR_STATUS).map(Number).sort();
for (let y = years[0]; y <= years[years.length - 1]; y++) if (!m.MAP_YEAR_STATUS[y]) problems.push(`no map status for ${y}`);

// overrides over many real wars, at every year
const game = await loadGame();
const rnd = seeded(123);
let overrides = 0;
for (let i = 0; i < 400; i++) {
  const cid = i % 2 ? "japan" : "alliedPacific";
  const war = playWar(game, cid, "open", rnd, { uniformRolls: i % 3 === 0, greedy: [0, 0.6][i % 2] });
  for (const s of war.seen.slice(-1).concat(war.seen[Math.floor(war.seen.length / 2)] || [])) {
    if (!s) continue;
    for (const y of years) {
      const { o } = m.mapOverrides(y, s.flagsBefore || war.flags, s.metersBefore || war.meters);
      for (const [id, st] of Object.entries(o || {})) {
        overrides++;
        if (!known.has(id)) problems.push(`override for unknown region ${id} (year ${y})`);
        if (!statuses.has(st)) problems.push(`override with unknown status "${st}" for ${id} (year ${y})`);
      }
    }
  }
}
const atlasIds = new Set(Object.values(m.NODE_ATLAS).flat().map((n) => n.id));
for (const [node, regs] of Object.entries(m.NODE_REGION_HINTS)) {
  if (!atlasIds.has(node)) problems.push(`hint for unknown node ${node}`);
  for (const r of regs) if (!known.has(r)) problems.push(`hint for ${node} names unknown region ${r}`);
}
const hinted = [...atlasIds].filter((id) => !m.NODE_REGION_HINTS[id]).length;
console.log(`Map: ${ids.length} regions, ${years.length} years, ${overrides} overrides checked, ${Object.keys(m.NODE_REGION_HINTS).length} node hints (${hinted} of ${atlasIds.size} nodes have none, by design for policy decisions).`);
if (problems.length) {
  console.log([...new Set(problems)].slice(0, 40).map((p) => "  " + p).join("\n"));
  process.exit(1);
}
console.log("Map check passed.");
