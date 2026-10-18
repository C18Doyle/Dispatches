/** Orders that can fail (src/44-risks.jsx). Each key names a real order that the build has made contested: two branches, the order's own outcome as the one that works and a
 *  failing one that is speculative, written without quotation marks or dashes, with a worse impact than the working branch; the weights are sound; no order that hosts a battle
 *  is in the list; and every command has a fair share of contested orders. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
const AXES = ["manpower", "munitions", "will"];
const sum = (imp) => AXES.reduce((s, a) => s + ((imp && imp[a]) || 0), 0);
for (const [key, r] of Object.entries(E.RISKS)) {
  checked++;
  const [nodeId, choiceId] = key.split("/");
  const f = E.findNode(nodeId);
  if (!f) { problems.push(`${key}: no such report`); continue; }
  const ch = (f.node.choices || []).find((c) => c.id === choiceId);
  if (!ch) { problems.push(`${key}: no such order`); continue; }
  const u = ch.uncertain;
  if (!u || u.length !== 2) { problems.push(`${key}: the order is not contested with two branches (it was contested already, or has no outcome)`); continue; }
  if (u[1].outcome !== r.loseOutcome) problems.push(`${key}: the failing branch was not applied`);
  if (ch.historical) problems.push(`${key}: an order the record gave should not be made to fail here`);
  if (!ch.dispute || String(ch.dispute).length < 60) problems.push(`${key}: the roll cites no dispute`);
  if (u[0].weight + u[1].weight !== 100) problems.push(`${key}: the weights do not add to 100`);
  if (r.win < 30 || r.win > 70) problems.push(`${key}: the working branch has weight ${r.win}, outside 30 to 70`);
  if (!/^Speculative\. /.test(r.loseOutcome)) problems.push(`${key}: the failing outcome should begin "Speculative."`);
  if (r.loseOutcome.length < 180 || r.loseOutcome.length > 620) problems.push(`${key}: the failing outcome is ${r.loseOutcome.length} characters, not 180 to 620`);
  if (/[—–]/.test(r.loseOutcome + r.winTitle + r.loseTitle)) problems.push(`${key}: a dash in the text`);
  if (/["“”]/.test(r.loseOutcome)) problems.push(`${key}: quotation marks in the failing outcome`);
  if (!r.winTitle || r.winTitle.length > 80 || !r.loseTitle || r.loseTitle.length > 80) problems.push(`${key}: the titles should be present and under 80 characters`);
  for (const a of Object.keys(r.loseImpact || {})) if (!AXES.includes(a)) problems.push(`${key}: impact on "${a}"`);
  for (const a of AXES) if (Math.abs((r.loseImpact || {})[a] || 0) > 4) problems.push(`${key}: an impact of more than 4 on ${a}`);
  if (!(sum(r.loseImpact) < sum(ch.impact))) problems.push(`${key}: the failing branch is not worse than the working one`);
  if (E.BATTLES && Object.values(E.BATTLES).some((b) => b.host && b.host.node === nodeId && b.host.choice === choiceId)) problems.push(`${key}: the order hosts a battle`);
}
for (const cid of E.CAMPAIGN_IDS) {
  checked++;
  let n = 0;
  for (const node of Object.values(E.CAMPAIGNS[cid].nodes)) for (const c of node.choices || []) if (c.uncertain && c.uncertain.length) n++;
  if (n < 12) problems.push(`${cid}: only ${n} orders are contested`);
}
process.exit(report("check-risks", problems, checked) ? 1 : 0);
