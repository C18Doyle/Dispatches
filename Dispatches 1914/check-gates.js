/** Meter gates and softlocks. Spec §4.5, §11.
 *  Never leave every choice at a node gated. Thresholds must be reachable. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const problems = [];
let checked = 0;

for (const { nodeId, node } of E.allNodes()) {
  const choices = node.choices ?? [];
  if (!choices.length && !node.ending) {
    problems.push(`${nodeId}: no choices and not an ending — dead end`);
    continue;
  }
  let gated = 0;
  for (const ch of choices) {
    checked++;
    if (typeof ch.gate === "function") {
      gated++;
      if (!ch.disabledReason) problems.push(`${nodeId}/${ch.id}: gate with no disabledReason`);
      // Reachability: does any meter combination in range open this gate?
      let open = false;
      for (let mp = -10; mp <= 10 && !open; mp += 2)
        for (let mu = -10; mu <= 10 && !open; mu += 2)
          for (let w = -10; w <= 10 && !open; w += 2)
            if (ch.gate({ manpower: mp, munitions: mu, will: w }, {})) open = true;
      if (!open) problems.push(`${nodeId}/${ch.id}: gate is unsatisfiable anywhere in meter range`);
    }
    if (ch.next && !E.findNode(ch.next)) problems.push(`${nodeId}/${ch.id}: next "${ch.next}" does not resolve`);
    // The historical choice must never be gated: it can softlock the node and can
    // make the spine unwalkable at meter values a real run reaches.
    if (ch.historical && typeof ch.gate === "function")
      problems.push(`${nodeId}/${ch.id}: the historical choice is gated`);
  }
  if (choices.length && gated === choices.length) {
    problems.push(`${nodeId}: every choice is gated — potential softlock`);
  }
}
process.exit(report("check-gates", problems, checked) ? 1 : 0);
