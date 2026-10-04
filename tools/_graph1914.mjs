import { readFileSync } from "node:fs";
import vm from "node:vm";
const src = readFileSync("Dispatches 1914/dispatches-greatwar.jsx", "utf8").split("// UI_LAYER")[0].replace(/^export\s+/gm, "") + "\nmodule.exports = { CAMPAIGNS, resolveNode, emptyMeters, emptyHardState };\n";
const sb = { module: { exports: {} }, console, process: { env: {} } };
sb.exports = sb.module.exports;
vm.runInNewContext(src, sb);
const { CAMPAIGNS, resolveNode, emptyMeters, emptyHardState } = sb.module.exports;
const cid = process.argv[2];
const c = CAMPAIGNS[cid];
const w = (t) => (typeof t === "string" ? t.trim().split(/\s+/).length : 0);
console.log(`${cid}: start ${c.startNode}; hard forced ending ${c.hardMode.forcedEndingId}; willLabel ${c.willLabel}`);
for (const id of Object.keys(c.nodes)) {
  const raw = c.nodes[id];
  const n = resolveNode(id, {}, emptyMeters(), emptyHardState());
  console.log(`\n## ${id} | ${raw.date} | ${raw.city ?? "-"} | ${raw.title} | advisors ${JSON.stringify(raw.advisors ?? [])}${raw.ending ? " | ENDING " + JSON.stringify(raw.ending) : ""}${raw.bulletin ? " | bulletin" : ""}`);
  for (const ch of n.choices || []) {
    const dest = [ch.next, ch.nextIf ? "nextIf" : null].filter(Boolean).join("/");
    const rolls = (ch.uncertain || []).map((u) => `${u.weight}%->${u.next ?? "(choice next)"}`).join(", ");
    console.log(`  - ${ch.id}${ch.historical ? " [HIST]" : ""}: "${ch.label}" -> ${dest}${rolls ? " ROLL[" + rolls + "]" : ""} flags ${JSON.stringify(ch.setFlags ?? {})} impact ${JSON.stringify(ch.impact ?? {})}${ch.gate ? " GATED" : ""}${ch.erodes ? " erodes" : ""} | outcome ${w(ch.outcome)}w`);
  }
}
