/** Length of the consequence prose. Spec: a choice's outcome runs 60-80 words and an ending's epilogue 120-200 (with
 *  what actually happened). Limits here are a little wider than the target (55-100, and 100 or more) so a clause cut in
 *  an edit does not fail the build, but a one-line outcome or a bare epilogue does. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const wc = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const problems = [];
let checked = 0;
for (const { campaignId, nodeId, node } of E.allNodes()) {
  for (const ch of node.choices ?? []) {
    const outs = ch.uncertain && ch.uncertain.length ? ch.uncertain.map((b, i) => [`${ch.id}/${i}`, b.outcome]) : [[ch.id, ch.outcome]];
    for (const [k, o] of outs) {
      checked++;
      const n = wc(o);
      if (n < 55 || n > 100) problems.push(`${nodeId}/${k}: outcome is ${n} words (target 60-80)`);
    }
  }
  if (node.ending) {
    checked++;
    const e = typeof node.epilogue === "function" ? node.epilogue({}) : node.epilogue;
    const n = wc(e);
    if (n < 100) problems.push(`${nodeId}: epilogue is ${n} words (target 120-200, with what actually happened)`);
  }
}
process.exit(report("check-prose-length", problems, checked) ? 1 : 0);
