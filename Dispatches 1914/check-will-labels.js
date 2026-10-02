/** Will axis labelling. Spec §4.4, §11.
 *  Catches a German node talking about Army Morale. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const problems = [];
let checked = 0;
const allLabels = E.CAMPAIGN_IDS.map((c) => E.CAMPAIGNS[c].willLabel);

for (const cid of E.CAMPAIGN_IDS) {
  const c = E.CAMPAIGNS[cid];
  if (!c.willLabel) { problems.push(`${cid}: no willLabel defined`); continue; }
  const foreign = allLabels.filter((l) => l !== c.willLabel);

  for (const [nid, node] of Object.entries(c.nodes)) {
    checked++;
    const text = [node.situation, node.context, node.title,
      ...(node.choices ?? []).flatMap((ch) => [ch.label, ch.outcome, ch.aftermath, ch.disabledReason])]
      .filter((x) => typeof x === "string").join(" ");
    for (const f of foreign) {
      if (text.toLowerCase().includes(f.toLowerCase())) {
        problems.push(`${nid}: prose uses "${f}", which is another campaign's will label (this campaign uses "${c.willLabel}")`);
      }
    }
  }
}
process.exit(report("check-will-labels", problems, checked) ? 1 : 0);
