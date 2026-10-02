/** Bulletins. Spec §13.5. One press voice per campaign; bulletins fire on arrival. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const problems = [];
let checked = 0;

for (const cid of E.CAMPAIGN_IDS) {
  const c = E.CAMPAIGNS[cid];
  const nodes = Object.entries(c.nodes);
  if (!nodes.length) continue;

  if (!c.bulletinVoice?.defined) {
    problems.push(`${cid}: bulletin voice not defined in content brief`);
  }
  const count = nodes.filter(([, n]) => n.bulletin).length;
  const [lo, hi] = c.tier === "major" ? [8, 10] : [4, 5];
  if (count < lo || count > hi) problems.push(`${cid}: ${count} bulletins, target ${lo}-${hi}`);

  for (const [nid, node] of nodes) {
    if (!node.bulletin) continue;
    checked++;
    const b = node.bulletin;
    if (typeof b === "function") continue; // conditional; verified at render
    if (!b.voice) problems.push(`${nid}: bulletin missing voice tag`);
    else if (b.voice !== cid) problems.push(`${nid}: bulletin voice "${b.voice}" does not match campaign ${cid}`);
    if (b.announcesOutcomeOf) {
      problems.push(`${nid}: bulletin announces the outcome of a choice not yet made — bulletins fire on arrival`);
    }
    if (b.date && node.date && b.date > node.date) {
      problems.push(`${nid}: bulletin dated ${b.date}, after node date ${node.date}`);
    }
  }
}
process.exit(report("check-bulletins", problems, checked) ? 1 : 0);
