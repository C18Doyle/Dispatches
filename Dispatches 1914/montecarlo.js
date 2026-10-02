/** Monte Carlo reachability + gate-block sweep. Spec §4.5, §5, §11. */
const { loadEngine } = require("./_load.js");
const E = loadEngine(process.argv[2] || "dispatches-greatwar.jsx");
const RUNS = Number(process.argv[3] || 20000);
const HARD = process.argv[4] === "hard";

for (const cid of E.CAMPAIGN_IDS) {
  const c = E.CAMPAIGNS[cid];
  if (!Object.keys(c.nodes).length) continue;
  const hits = {}, deadEnds = [], softlocks = [];
  let blocks = 0, steps = 0;

  for (let i = 0; i < RUNS; i++) {
    let flags = {}, meters = E.emptyMeters();
    let hard = HARD ? { enabled: true, erosion: 0 } : E.emptyHardState();
    let id = c.startNode, guard = 0;
    while (id && guard++ < 200) {
      const n = E.resolveNode(id, flags, meters, hard);
      if (!n) { deadEnds.push(id); break; }
      if (n.ending) { hits[id] = (hits[id] || 0) + 1; break; }
      const open = n.choices.filter(ch => !ch.blocked);
      blocks += n.choices.length - open.length;
      steps++;
      if (!open.length) { softlocks.push(id); break; }
      const ch = open[Math.floor(Math.random() * open.length)];
      const r = E.chooseNext(cid, ch, flags, meters, hard);
      flags = r.flags; meters = r.meters; hard = r.hardState; id = r.nextId;
    }
  }

  const endings = E.buildEndings().filter(e => e.campaignId === cid);
  const unreached = endings.filter(e => !hits[e.id] && (HARD || !e.hardModeOnly));
  console.log(`\n${cid}: ${RUNS} runs, ${steps} decisions${HARD ? "  [HARD MODE]" : ""}`);
  for (const e of endings)
    console.log(`  ${String(hits[e.id] || 0).padStart(6)}  ${e.id}${e.hardModeOnly ? "  (hard mode only)" : ""}`);
  console.log(`  gate-blocks/run: ${(blocks / RUNS).toFixed(2)}  (target >=2.0)`);
  console.log(`  dead ends: ${deadEnds.length}   softlocks: ${softlocks.length}`);
  if (unreached.length) console.log(`  UNREACHED: ${unreached.map(e => e.id).join(", ")}`);
}
