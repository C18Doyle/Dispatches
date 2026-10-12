/** The staff's reading (src/68-intel.jsx). Every belief belongs to a report and says which orders rest on it; a false belief has an order that does not rest on
 *  it (an informed alternative exists); the text keeps to the style of the game; the claims register carries each belief; the believed odds are shown only
 *  for an order that rolls, never past 95; and a file that checks nothing plays as before (no edge, no fog beyond the dial). */
const fs = require("fs");
const path = require("path");
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
const wc = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const claimsOf = (cid) => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, "claims", cid + ".json"), "utf8")); } catch { return []; } };
const GRADES = ["firm", "doubtful", "poor"];
const perCommand = {};
for (const [nodeId, items] of Object.entries(E.INTEL_ITEMS)) {
  const found = E.findNode(nodeId);
  if (!found) { problems.push(`${nodeId}: no such report`); continue; }
  const { campaignId, node } = found;
  if (node.ending) problems.push(`${nodeId}: an ending carries beliefs`);
  const seen = new Set();
  const claims = claimsOf(campaignId);
  for (const it of items) {
    checked++;
    const where = `${nodeId}/${it.id}`;
    if (seen.has(it.id)) problems.push(`${where}: duplicate id`);
    seen.add(it.id);
    perCommand[campaignId] = (perCommand[campaignId] || 0) + 1;
    if (!GRADES.includes(it.grade)) problems.push(`${where}: grade must be firm, doubtful or poor`);
    if (typeof it.holds !== "boolean") problems.push(`${where}: holds must be true or false`);
    if (wc(it.text) < 8 || wc(it.truth) < 10) problems.push(`${where}: the belief or the truth is too short`);
    for (const s of [it.text, it.truth]) {
      if (/[—–]/.test(s)) problems.push(`${where}: a long dash`);
      if (/["“”]/.test(s)) problems.push(`${where}: a quotation mark`);
    }
    if (!Array.isArray(it.relied) || !it.relied.length) problems.push(`${where}: no order rests on it`);
    for (const id of it.relied || []) if (!(node.choices || []).some((c) => c.id === id)) problems.push(`${where}: relied order "${id}" does not exist`);
    if (!it.holds && (node.choices || []).every((c) => (it.relied || []).includes(c.id))) problems.push(`${where}: every order rests on it, so there is no informed alternative`);
    if (!claims.some((c) => c.id === `ix-${nodeId}-${it.id}`)) problems.push(`${where}: no claim ix-${nodeId}-${it.id} in claims/${campaignId}.json`);
    // the dial: a rolled order resting on a false belief shows better odds than it has, until checked
    const ch = (node.choices || []).find((c) => (it.relied || []).includes(c.id) && c.uncertain && c.uncertain.length);
    if (ch && !it.holds) {
      const real = E.orderOdds(ch, E.emptyMeters());
      const shown = E.intelBelievedOdds(real);
      if (!(shown.pct > real.pct || real.pct >= 90)) problems.push(`${where}: the believed odds are not better than the real ones`);
      if (shown.pct > 95) problems.push(`${where}: the believed odds pass 95`);
    }
    // a file that never checks gets no edge; one that checked this belief and chose an order that does not rest on it does (never in easy mode)
    const free = (node.choices || []).find((c) => !(it.relied || []).includes(c.id));
    if (free) {
      const none = E.intelEdge(nodeId, free, {}, false);
      const flags = { ["ix_" + nodeId + "_" + it.id]: true };
      const got = E.intelEdge(nodeId, free, flags, false);
      if (none) problems.push(`${where}: an edge without a check`);
      if (!it.holds && !(got && got.will === 1)) problems.push(`${where}: no edge for an informed order after a check`);
      if (it.holds && got) problems.push(`${where}: an edge for checking a belief that held`);
      if (E.intelEdge(nodeId, free, flags, true)) problems.push(`${where}: an edge in easy mode`);
    }
  }
}
for (const cid of E.CAMPAIGN_IDS) { checked++; if (!perCommand[cid]) problems.push(`${cid}: no report carries a belief`); }
// the checks
checked += 3;
const f0 = {};
if (E.intelChecksLeft(f0, false) !== E.INTEL.checks || E.intelChecksLeft(f0, true) !== E.INTEL.hardChecks) problems.push("the allowance of checks is wrong");
const first = Object.keys(E.INTEL_ITEMS)[0];
const used = E.intelCheck(f0, first, E.INTEL_ITEMS[first][0].id, false);
if (E.intelChecksLeft(used, false) !== E.INTEL.checks - 1) problems.push("a check does not spend one");
if (E.intelCheck(used, first, E.INTEL_ITEMS[first][0].id, false) !== used) problems.push("a belief can be checked twice");
process.exit(report("check-intel", problems, checked) ? 1 : 0);
