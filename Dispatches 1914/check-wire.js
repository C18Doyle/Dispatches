/** The wire: every report that is not an ending has its one line, and the lines are sentences a person wrote (short, present, no long dash, no line for a report that is not there). */
const { loadEngine, report } = require("./_load.js");
const E = loadEngine("dispatches-greatwar.jsx");
const problems = [];
let checked = 0;
const ids = new Set();
for (const cid of E.CAMPAIGN_IDS) {
  for (const [nid, n] of Object.entries(E.CAMPAIGNS[cid].nodes)) {
    if (n.ending) continue;
    ids.add(nid);
    checked++;
    const line = E.WIRE[nid];
    if (typeof line !== "string") { problems.push(`${nid}: no line`); continue; }
    const words = line.split(/\s+/).length;
    if (words > 22) problems.push(`${nid}: ${words} words, the most is 22`);
    if (words < 6) problems.push(`${nid}: ${words} words, the least is 6`);
    if (!/[a-z0-9]\.$/.test(line)) problems.push(`${nid}: not one sentence ending in a full stop`);
    if ((line.match(/[.!?]\s/g) || []).length) problems.push(`${nid}: more than one sentence`);
    if (/[–—―]|--|"|“|‘/.test(line)) problems.push(`${nid}: a long dash or a quotation mark`);
    if (/\n/.test(line)) problems.push(`${nid}: a line break`);
  }
}
for (const nid of Object.keys(E.WIRE)) { checked++; if (!ids.has(nid)) problems.push(`${nid}: a line for a report that does not exist`); }
process.exit(report("check-wire", problems, checked) ? 1 : 0);
