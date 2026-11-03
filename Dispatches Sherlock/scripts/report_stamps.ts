// A diagnostic, not a test: the average stamp each branch gives each gauge per option (a branch whose averages sit far from the others is unbalanced).
// Run: npm run report:stamps
import { loadDefinition } from "../../packages/engine/tools/load_definition";
const def = loadDefinition("sherlock");
const rs = def.config.resources.map((r) => r.id);
const byBranch: Record<string, Record<string, number>> = {}; const cnt: Record<string, number> = {};
for (const node of Object.values(def.content.nodes)) {
  for (const o of node.options) {
    cnt[node.branch] = (cnt[node.branch] ?? 0) + 1;
    for (const r of rs) {
      let v = 0;
      if (o.roll) { const p = o.roll.chance; v = p * (o.roll.success.stamps[r] ?? 0) + (1 - p) * (o.roll.failure.stamps[r] ?? 0); } else v = o.stamps[r] ?? 0;
      (byBranch[node.branch] ??= {})[r] = ((byBranch[node.branch] ??= {})[r] ?? 0) + v;
    }
  }
}
for (const [b, m] of Object.entries(byBranch)) console.log(b.padEnd(10), String(cnt[b]).padStart(3), rs.map((r) => `${r} ${(m[r] / cnt[b]).toFixed(2)}`).join("  "));
