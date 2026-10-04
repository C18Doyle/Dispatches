import { readFileSync } from "node:fs";
import vm from "node:vm";
const src = readFileSync("Dispatches 1914/dispatches-greatwar.jsx", "utf8").split("// UI_LAYER")[0].replace(/^export\s+/gm, "") + "\nmodule.exports={CAMPAIGNS,resolveNode,emptyMeters,emptyHardState};";
const sb = { module: { exports: {} }, console, process: { env: {} } };
sb.exports = sb.module.exports;
vm.runInNewContext(src, sb);
const { CAMPAIGNS, resolveNode, emptyMeters, emptyHardState } = sb.module.exports;
const BS = String.fromCharCode(92);
const lit = BS + "n";
const bad = [];
for (const c of Object.values(CAMPAIGNS))
  for (const id of Object.keys(c.nodes)) {
    const n = resolveNode(id, {}, emptyMeters(), emptyHardState());
    const fields = { title: n.title, situation: n.situation, context: n.context, epilogue: n.epilogue, bulletin: n.bulletin && n.bulletin.text };
    for (const ch of n.choices || []) { fields["label:" + ch.id] = ch.label; fields["outcome:" + ch.id] = ch.outcome; for (const b of ch.uncertain || []) fields["roll:" + ch.id] = (fields["roll:" + ch.id] || "") + (b.outcome || ""); }
    for (const [k, v] of Object.entries(fields)) if (typeof v === "string" && v.includes(lit)) bad.push(id + "." + k);
  }
console.log("fields with a literal backslash-n:", bad.length);
console.log(bad.join("\n"));
