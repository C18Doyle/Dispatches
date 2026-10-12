/** The advisers' trust (src/69-trust.jsx). Nearly every order's adviser is matched to the command's list; trust moves as written (+1 for the adviser followed,
 *  -1 for those passed over, within -3 to +3); a trusted adviser brings one check, once; an adviser who has gone asks to be relieved, once, and the event
 *  is written from the dossier; an unmatched adviser changes nothing. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
let named = 0;
let matched = 0;
const unmatched = {};
for (const { campaignId, node } of E.allNodes()) {
  for (const ch of node.choices || []) {
    if (!ch.advisor) continue;
    named++;
    if (E.adviserIdFor(campaignId, ch.advisor.name)) matched++;
    else unmatched[campaignId + ":" + ch.advisor.name] = 1;
  }
}
checked++;
if (matched / named < 0.95) problems.push(`only ${matched} of ${named} orders' advisers are matched to the list (${Object.keys(unmatched).join(", ")})`);
// the behaviour, on a report with two advisers
for (const cid of E.CAMPAIGN_IDS) {
  const camp = E.CAMPAIGNS[cid];
  const nodeId = Object.keys(camp.nodes).find((id) => {
    const n = camp.nodes[id];
    if (n.ending) return false;
    const ids = (n.choices || []).map((c) => E.adviserIdFor(cid, c.advisor && c.advisor.name));
    return ids.length >= 2 && ids.every(Boolean) && new Set(ids).size === ids.length;
  });
  checked++;
  if (!nodeId) { problems.push(`${cid}: no report with two matched advisers to test on`); continue; }
  const node = camp.nodes[nodeId];
  const pick = node.choices[0];
  const other = E.adviserIdFor(cid, node.choices[1].advisor.name);
  const mine = E.adviserIdFor(cid, pick.advisor.name);
  let flags = {};
  for (let i = 0; i < 3; i++) flags = E.trustAfter(cid, nodeId, pick, flags);
  if (E.trustOf(flags, mine) !== 3) problems.push(`${cid}: following an adviser three times does not make +3`);
  if (E.trustOf(flags, other) !== -3) problems.push(`${cid}: passing an adviser over three times does not make -3`);
  if (E.adviserState(flags, mine) !== "trusted" || E.adviserState(flags, other) !== "gone") problems.push(`${cid}: the states are wrong`);
  if (E.intelChecksLeft(flags, false) !== E.INTEL.checks + 1) problems.push(`${cid}: a trusted adviser does not bring a check`);
  flags = E.trustAfter(cid, nodeId, pick, flags);
  if (E.intelChecksLeft(flags, false) !== E.INTEL.checks + 1) problems.push(`${cid}: the check is brought more than once`);
  const ev = E.resignationEvent(cid, flags, node.date);
  if (!ev || !/Asks to Be Relieved/.test(ev.title) || ev.paras.length !== 2) problems.push(`${cid}: no resignation event for an adviser who has gone`);
  else if (/[—–"]/.test(ev.paras.join(" "))) problems.push(`${cid}: the resignation event has a long dash or a quotation mark`);
  if (E.resignationEvent(cid, { ...flags, ["ev_resign_" + other]: true }, node.date)) problems.push(`${cid}: the resignation event can be shown twice`);
  if (E.dueEvent(cid, nodeId, flags, E.emptyMeters()) === null) problems.push(`${cid}: dueEvent does not deliver the resignation`);
}
// an order whose adviser is not matched changes nothing
checked++;
const probe = { id: "x", advisor: { name: "Nobody In Particular" } };
const any = E.CAMPAIGNS.ohl.nodes[E.CAMPAIGNS.ohl.startNode];
if (JSON.stringify(E.trustAfter("ohl", E.CAMPAIGNS.ohl.startNode, probe, { a: 1 }).a) !== "1") problems.push("an unmatched order changed the flags");
process.exit(report("check-trust", problems, checked) ? 1 : 0);
