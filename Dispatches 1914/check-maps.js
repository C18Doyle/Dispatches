/** Front map. Every node's city must have coordinates on its campaign's map, inside its view. A missing city shows no map. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
for (const { campaignId, nodeId, node } of E.allNodes()) {
  checked++;
  if (!node.city) { problems.push(`${nodeId}: no city`); continue; }
  const map = E.mapFor(campaignId);
  const p = map.cities[node.city];
  if (!p) problems.push(`${nodeId}: city "${node.city}" has no entry on the ${E.CAMPAIGNS[campaignId].map} map (src/40-maps.jsx)`);
  else if (p[0] < 0 || p[0] > map.view.width || p[1] < 0 || p[1] > map.view.height) problems.push(`${nodeId}: city "${node.city}" lies outside the map view`);
}
// the front through time (41-map-history.jsx)
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const sides = new Set(["cp", "ent", "neu"]);
for (const [mapId, list] of Object.entries(E.MAP_OVERLAYS)) {
  const countries = new Set((mapId === "nearEast" ? E.MAP_NEAR.countries : E.MAP_COUNTRIES).map((x) => x.id));
  const view = mapId === "nearEast" ? E.MAP_NEAR.view : E.MAP_VIEW;
  const ids = new Set();
  for (const o of list) {
    checked++;
    const at = `overlay ${mapId}/${o.id}`;
    if (ids.has(o.id)) problems.push(`${at}: duplicate id`); ids.add(o.id);
    if (!sides.has(o.side)) problems.push(`${at}: side "${o.side}"`);
    if (!ISO.test(o.from) || !ISO.test(o.to) || o.from > o.to) problems.push(`${at}: dates ${o.from}..${o.to}`);
    if (o.from < "1914-07-28" || o.to > "1919-06-28") problems.push(`${at}: outside the war`);
    for (const m of o.mask) if (!countries.has(m)) problems.push(`${at}: mask names unknown country "${m}"`);
    if (!o.poly || o.poly.length < 3) problems.push(`${at}: polygon of fewer than three points`);
    for (const [lon, lat] of [...(o.poly || []), ...(o.line || [])]) {
      if (typeof lon !== "number" || typeof lat !== "number") problems.push(`${at}: a point is not [lon, lat]`);
      else if (lon < view.lon[0] - 15 || lon > view.lon[1] + 15 || lat < view.lat[0] - 15 || lat > view.lat[1] + 15) problems.push(`${at}: point ${lon},${lat} is far outside the map`);
    }
  }
  // on every day of the war, at most one Western or Eastern front line holds
  for (const family of ["w", "e", "m", "p"]) {
    const fronts = list.filter((o) => /^[wemp]\d+$/.test(o.id) && o.id[0] === family);
    for (let i = 0; i < fronts.length; i++) for (let j = i + 1; j < fronts.length; j++) {
      if (fronts[i].from <= fronts[j].to && fronts[j].from <= fronts[i].to) problems.push(`overlay ${mapId}: fronts ${fronts[i].id} and ${fronts[j].id} hold on the same days`);
    }
  }
}
for (const [name, rows] of Object.entries(E.MAP_ALLEGIANCE)) {
  checked++;
  const known = new Set([...E.MAP_COUNTRIES, ...E.MAP_NEAR.countries].map((x) => x.id));
  if (!known.has(name)) problems.push(`allegiance: "${name}" is not a country on either map`);
  for (let i = 0; i < rows.length; i++) {
    if (!ISO.test(rows[i][0]) || !sides.has(rows[i][1])) problems.push(`allegiance ${name}: bad row ${JSON.stringify(rows[i])}`);
    if (i && rows[i][0] <= rows[i - 1][0]) problems.push(`allegiance ${name}: rows are not in date order`);
  }
}
// the meanwhile: every report of every command is reached, and the Russian dates are brought to the Western calendar
{
  checked++;
  if (E.mapDate("stavka", "1916-05-22") !== "1916-06-04") problems.push("mapDate: 22 May 1916 Old Style is 4 June 1916");
  if (E.mapDate("ohl", "1916-05-22") !== "1916-05-22") problems.push("mapDate changes a Gregorian date");
  const node = E.CAMPAIGNS.gqg.nodes.gqg_1914_02_marne;
  const mw = E.meanwhileAt("gqg", node);
  if (mw.some((m) => m.campaignId === "gqg")) problems.push("meanwhile includes the command itself");
  if (mw.some((m) => m.date > E.mapDate("gqg", node.date))) problems.push("meanwhile shows a report from after the date");
}
process.exit(report("check-maps", problems, checked) ? 1 : 0);
