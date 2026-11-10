// Advisers do not speak (docs/WRITING.md rule 7): every adviser line is a third-person `position`, never a `quote` in speech marks, and it names the
// adviser. Walks every report of every campaign and fails on an adviser with a `quote`, with no `position`, with a position that starts with a speech mark
// or contains an em dash, or that does not mention the adviser's name or a plain role. Run: npm run check:advisers
import { loadCampaignsFromDataSection } from "../../packages/testkit/src/load-campaigns.mjs";

const CAMPAIGNS = loadCampaignsFromDataSection("src/App.jsx");
let advisers = 0;
const problems = [];
for (const [cid, camp] of Object.entries(CAMPAIGNS)) {
  const meters = Object.fromEntries(camp.triangleAxes.map((a) => [a.key, 0]));
  for (const at of camp.NODE_ATLAS) {
    const node = camp.resolveNode(at.id, {}, meters);
    for (const [i, ch] of (node.choices || []).entries()) {
      const a = ch.advisor;
      if (!a) continue;
      advisers++;
      const where = `${cid}/${at.id}[${i}] ${a.name}`;
      if ("quote" in a) problems.push(`${where}: has a quote (an adviser's line is a position)`);
      if (typeof a.position !== "string" || a.position.length < 30) problems.push(`${where}: no position`);
      else {
        if (/^["'“‘]/.test(a.position)) problems.push(`${where}: the position starts with a speech mark`);
        if (/[—]/.test(a.position)) problems.push(`${where}: an em dash in the position`);
        if (/\b(I|my|me|we|our|us)\b/.test(a.position.replace(/\b(I|A) (Southern|War|Column)\b/g, ""))) problems.push(`${where}: first person in the position`);
      }
    }
  }
}
console.log(`advisers: ${advisers} adviser lines checked, ${problems.length} problem(s).`);
for (const p of problems.slice(0, 40)) console.log("  " + p);
process.exit(problems.length ? 1 : 0);
