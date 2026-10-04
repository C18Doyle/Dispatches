/**
 * The historical line must end at the settled ending.
 *
 * walk-historical proves the spine is made of historical choices and ends at an ending. It does not run the meters,
 * so it cannot see a nextIf that diverts the historical line to a speculative ending. Found in the shipped 1.0.0: the
 * Russian historical line arrived at "Nothing Left to Sign With" (a speculative ending) because manpower sat exactly on a
 * threshold. This plays the historical choice, in standard and in hard mode, at every node with the real engine (rolls forced to their historicalBranch,
 * or to the heaviest branch where none is marked) and requires that the ending reached carries the settled badge.
 */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const problems = [];
let checked = 0;

function forcedRng(uncertain) {
  let idx = uncertain.findIndex((b) => b.historicalBranch);
  if (idx < 0) idx = uncertain.reduce((best, b, i) => (b.weight > uncertain[best].weight ? i : best), 0);
  const total = uncertain.reduce((s, b) => s + b.weight, 0);
  const before = uncertain.slice(0, idx).reduce((s, b) => s + b.weight, 0);
  return () => (before + uncertain[idx].weight / 2) / total;
}

for (const cid of E.CAMPAIGN_IDS) for (const mode of ["standard", "hard"]) {
  const c = E.CAMPAIGNS[cid];
  if (!Object.keys(c.nodes).length) continue;
  checked++;
  let flags = {};
  let meters = E.emptyMeters();
  let hard = mode === "hard" ? { enabled: true, erosion: 0 } : E.emptyHardState();
  let id = c.startNode;
  const path = [];
  for (let guard = 0; id && guard < 200; guard++) {
    const node = E.resolveNode(id, flags, meters, hard);
    if (!node) { problems.push(`${cid} (${mode}): the historical line reached "${id}", which does not resolve`); break; }
    path.push(id);
    if (node.ending) break;
    const choice = (node.choices ?? []).find((ch) => ch.historical);
    if (!choice) { problems.push(`${cid} (${mode}): no historical choice at ${id}`); break; }
    const rng = choice.uncertain && choice.uncertain.length ? forcedRng(choice.uncertain) : undefined;
    const r = E.chooseNext(cid, choice, flags, meters, hard, rng);
    flags = r.flags; meters = r.meters; hard = r.hardState; id = r.nextId;
  }
  const last = path[path.length - 1];
  const end = c.nodes[last]?.ending;
  if (!end) problems.push(`${cid} (${mode}): the historical line did not reach an ending (stopped at ${last})`);
  else if (end.badge !== "settled") {
    problems.push(`${cid} (${mode}): the historical line ends at ${last}, whose badge is "${end.badge}", not "settled". ` +
      `Meters at the last decision: ${JSON.stringify(meters)}, erosion ${hard.erosion}. A nextIf or the hard-mode cap is diverting it.`);
  }
}
process.exit(report("check-historical-ending", problems, checked) ? 1 : 0);
