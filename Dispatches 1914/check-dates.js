/** Calendar and date integrity. Spec §13.1. Catches a campaign mixing conventions. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const problems = [];
let checked = 0;
const ISO = /^\d{4}-\d{2}-\d{2}$/;

for (const cid of E.CAMPAIGN_IDS) {
  const c = E.CAMPAIGNS[cid];
  if (!E.CALENDARS[c.calendar]) {
    problems.push(`${cid}: unknown calendar "${c.calendar}"`);
  } else if (E.CALENDARS[c.calendar].researchGate && Object.keys(c.nodes).length > 0) {
    // The gate blocks writing content, so it only fails once a campaign behind it has nodes
    // (smoke.js separately asserts the Ottoman campaign is still blocked on spec §9).
    problems.push(`${cid}: calendar "${c.calendar}" is behind an open RESEARCH GATE`);
  }

  const nodes = Object.entries(c.nodes);
  for (const [nid, node] of nodes) {
    checked++;
    if (!node.date || !ISO.test(node.date)) {
      problems.push(`${nid}: missing or malformed date (expected YYYY-MM-DD)`);
      continue;
    }
    if (node.date < c.span.from || node.date > c.span.to) {
      problems.push(`${nid}: date ${node.date} outside campaign span ${c.span.from}..${c.span.to}`);
    }
    if (node.year !== undefined && Number(node.date.slice(0, 4)) !== Number(node.year)) {
      problems.push(`${nid}: date ${node.date} disagrees with node.year ${node.year}`);
    }
  }

  const spine = E.walkSpine(cid);
  if (spine.path.length > 1) {
    for (let i = 1; i < spine.path.length; i++) {
      const a = c.nodes[spine.path[i - 1]], b = c.nodes[spine.path[i]];
      if (a?.date && b?.date && b.date < a.date) {
        problems.push(`${cid} spine: ${spine.path[i]} (${b.date}) precedes ${spine.path[i - 1]} (${a.date})`);
      }
    }
  }
}
process.exit(report("check-dates", problems, checked) ? 1 : 0);
