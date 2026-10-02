/** Ending classification. Spec §5, §11. Registries are derived, so this checks
 *  the thing derivation cannot: that every ending carries a valid badge. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const problems = [];
const endings = E.buildEndings();
const valid = new Set(Object.values(E.BADGES));

for (const e of endings) {
  if (!e.badge) problems.push(`${e.id}: ending with no accuracy badge`);
  else if (!valid.has(e.badge)) problems.push(`${e.id}: unknown badge "${e.badge}"`);
  if (!e.family) problems.push(`${e.id}: ending with no family`);
}

const atlas = E.buildNodeAtlas();
for (const e of endings) if (!atlas[e.id]) problems.push(`${e.id}: ending missing from derived atlas`);

for (const cid of E.CAMPAIGN_IDS) {
  const c = E.CAMPAIGNS[cid];
  if (!Object.keys(c.nodes).length) continue;
  const mine = endings.filter((e) => e.campaignId === cid);
  const [lo, hi] = c.targetEndings;
  if (mine.length < lo || mine.length > hi) {
    problems.push(`${cid}: ${mine.length} endings, target ${lo}-${hi}`);
  }
  const hm = c.hardMode.forcedEndingId;
  if (!hm) problems.push(`${cid}: hard mode has no forcedEndingId`);
  else if (!E.findNode(hm)) problems.push(`${cid}: hard mode forcedEndingId "${hm}" does not resolve`);
}
process.exit(report("check-classification", problems, endings.length) ? 1 : 0);
