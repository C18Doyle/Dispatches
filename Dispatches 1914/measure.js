/** Measure meter distributions at each node. Gates get set from THIS, not intuition. */
const { loadEngine } = require("./_load.js");
const E = loadEngine("dispatches-greatwar.jsx");
const cid = process.argv[2] || "ohl", c = E.CAMPAIGNS[cid], RUNS = 20000;
const at = {};
for (let i = 0; i < RUNS; i++) {
  let flags = {}, meters = E.emptyMeters(), hard = E.emptyHardState();
  let id = c.startNode, guard = 0;
  while (id && guard++ < 200) {
    const n = E.resolveNode(id, flags, meters, hard);
    if (!n) break;
    (at[id] = at[id] || []).push({ ...meters });
    if (n.ending) break;
    const ch = n.choices[Math.floor(Math.random() * n.choices.length)];
    const r = E.chooseNext(cid, ch, flags, meters, hard);
    flags = r.flags; meters = r.meters; hard = r.hardState; id = r.nextId;
  }
}
const pct = (a, p) => a.sort((x, y) => x - y)[Math.floor(a.length * p)];
for (const [id, rows] of Object.entries(at)) {
  const line = E.METER_AXES.map(ax => {
    const v = rows.map(r => r[ax]);
    return `${ax} min${Math.min(...v)} p25:${pct([...v],.25)} p50:${pct([...v],.5)} p75:${pct([...v],.75)} max${Math.max(...v)}`;
  }).join("  |  ");
  console.log(`${id.padEnd(26)} n=${String(rows.length).padStart(6)}  ${line}`);
}
