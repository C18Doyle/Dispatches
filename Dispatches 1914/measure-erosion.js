/** How much erosion can a run actually accumulate? Threshold must follow this. */
const { loadEngine } = require("./_load.js");
const E = loadEngine("dispatches-greatwar.jsx");
const cid = process.argv[2] || "ohl", c = E.CAMPAIGNS[cid];
let tagged = 0, total = 0;
for (const n of Object.values(c.nodes)) for (const ch of n.choices ?? []) {
  total++; if (E.erosionFromChoice(cid, ch)) tagged++;
}
console.log(`erosion-tagged choices: ${tagged} of ${total}`);
const dist = {};
for (let i = 0; i < 20000; i++) {
  let flags = {}, meters = E.emptyMeters(), hard = { enabled: true, erosion: 0 };
  let id = c.startNode, guard = 0;
  while (id && guard++ < 200) {
    const n = E.resolveNode(id, flags, meters, hard);
    if (!n || n.ending) break;
    const open = n.choices.filter(ch => !ch.blocked);
    if (!open.length) break;
    const ch = open[Math.floor(Math.random() * open.length)];
    const r = E.chooseNext(cid, ch, flags, meters, hard);
    flags = r.flags; meters = r.meters; hard = r.hardState; id = r.nextId;
  }
  dist[hard.erosion] = (dist[hard.erosion] || 0) + 1;
}
console.log("final erosion distribution:");
for (const k of Object.keys(dist).sort((a,b)=>a-b))
  console.log(`  ${String(k).padStart(2)}: ${String(dist[k]).padStart(6)}  ${(dist[k]/200).toFixed(1)}%`);
