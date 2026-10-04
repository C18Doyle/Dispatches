/**
 * Reviewer worksheet. Writes claims/WORKSHEET.md: every claim grouped by node, with the node's own text beside it, the
 * sources already recorded and a box to tick for each of the four statuses. Hand it to the person doing the fact-check;
 * they edit the status in claims/<campaign>.json when they are done.
 *
 *   node claims-worksheet.js            all campaigns
 *   node claims-worksheet.js ohl        one campaign
 *   node claims-worksheet.js ohl open   only claims not yet source-checked
 */
const fs = require("fs");
const path = require("path");
const { loadEngine } = require("./_load.js");
const E = loadEngine("dispatches-greatwar.jsx");

const only = process.argv[2] && process.argv[2] !== "open" ? process.argv[2] : null;
const openOnly = process.argv.includes("open");
const dir = path.join(__dirname, "claims");
const sources = JSON.parse(fs.readFileSync(path.join(dir, "sources.json"), "utf8"));
const DONE = new Set(["source-checked", "independent"]);

const out = ["# Fact-check worksheet", "",
  "One block per node. For each claim: find a source that says it, note the source, and set the status in `claims/<campaign>.json` (`source-checked`, `independent`, or `disputed` with a note).",
  "Where a claim is an attributed *position*, check that the node's wording is indirect speech and that the position is fairly characterized. Counterfactual outcomes begin 'Speculative.' and need no check beyond that label.", ""];

let shown = 0;
for (const cid of E.CAMPAIGN_IDS) {
  if (only && cid !== only) continue;
  const file = path.join(dir, cid + ".json");
  if (!fs.existsSync(file)) continue;
  const claims = JSON.parse(fs.readFileSync(file, "utf8")).filter((c) => !openOnly || !DONE.has(c.status));
  const byNode = new Map();
  for (const c of claims) { if (!byNode.has(c.node)) byNode.set(c.node, []); byNode.get(c.node).push(c); }
  out.push(`## ${E.CAMPAIGNS[cid].name ?? cid}`, "");
  for (const [nid, list] of byNode) {
    const hit = E.findNode(nid);
    const node = hit.node ?? hit;
    out.push(`### ${node.title}  (\`${nid}\`, ${node.date})`, "");
    for (const c of list) {
      shown++;
      out.push(`- **${c.id}** [${c.kind}, ${c.status}] ${c.claim}`);
      if (c.sources?.length) out.push(`  - recorded: ${c.sources.map((s) => `[${sources[s]?.title ?? s}](${sources[s]?.url ?? ""})`).join("; ")}`);
      if (c.note) out.push(`  - note: ${c.note}`);
      out.push("  - [ ] source-checked   [ ] independent   [ ] disputed   source: ______________________", "");
    }
  }
}
fs.writeFileSync(path.join(dir, "WORKSHEET.md"), out.join("\n") + "\n");
console.log(`claims-worksheet: ${shown} claims written to claims/WORKSHEET.md`);
