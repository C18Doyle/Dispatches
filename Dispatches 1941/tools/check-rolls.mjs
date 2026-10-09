// check-rolls.mjs: every contested roll must respond to the state of the war. A choice with `uncertain` outcomes whose weights are the same
// at a strong and a weak reading of every meter is a flat die: the player's stewardship cannot matter to it. Tied to the meters through
// modWeight (up to 10 points either way, never below 5 or above 95), as the code nodes do, or through `rollMeter` on a data node.
// Known flat rolls are listed in tests/audit-allowlist.json under "flatRolls" (node id plus the choice's index).
// Usage: node tools/check-rolls.mjs
import { readFileSync, existsSync } from "node:fs";
import { loadGame, AXES } from "./audit-lib.mjs";

const allow = existsSync("tests/audit-allowlist.json") ? JSON.parse(readFileSync("tests/audit-allowlist.json", "utf8")).flatRolls || [] : [];
const game = await loadGame();
let rolls = 0;
const flat = [];
for (const [cid, camp] of Object.entries(game.CAMPAIGNS)) {
  for (const a of game.NODE_ATLAS[cid] || []) {
    const at = (m) => {
      try {
        return camp.resolveNode(a.id, {}, m);
      } catch {
        return null;
      }
    };
    const base = at({ readiness: 0, pipeline: 0, initiative: 0 });
    if (!base) continue;
    base.choices.forEach((c, i) => {
      if (!c.uncertain || !c.uncertain.length) return;
      rolls++;
      const weights = (m) => JSON.stringify(((at(m) || { choices: [] }).choices[i] || {}).uncertain?.map((u) => u.weight));
      const responds = AXES.some((k) => weights({ readiness: -6, pipeline: -6, initiative: -6, [k]: 6 }) !== weights({ readiness: -6, pipeline: -6, initiative: -6 }));
      if (!responds) flat.push(`${cid} ${a.id}[${i}] ${c.label.slice(0, 60)}`);
    });
  }
}
const fresh = flat.filter((f) => !allow.some((k) => f.includes(k)));
console.log(`Rolls: ${rolls} contested choices, ${flat.length} flat, ${allow.length} allowlisted.`);
if (fresh.length) {
  for (const f of fresh) console.log("  FLAT: " + f);
  console.log("Tie the roll to a meter (modWeight in a code node, rollMeter in a data node) or allowlist it with a reason.");
  process.exit(1);
}
console.log("Rolls check passed.");
