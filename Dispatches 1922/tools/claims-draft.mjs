// Drafts a claims register from the report text: every sentence that states something checkable (a date, a number, a unit, a named event) in a report's
// bulletin, background and situation, in the aftermath and outcome of the choice that follows the record, in an ending's epilogue, and in every adviser's
// biography and fate. A draft claim is `drafted` and unsourced; checking it is the work. Existing claims are kept (matched by report and text), so this can
// be re-run when text changes to add the sentences that are new.
//
//   node tools/claims-draft.mjs            adds the new sentences to claims/<campaign>.json
//   node tools/claims-draft.mjs --count    only counts
//   node tools/claims-draft.mjs --prune    also removes claims whose text is no longer in the game (lists them first)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { loadCampaignsFromDataSection } from "../../packages/testkit/src/load-campaigns.mjs";
import { currentClaimText, kindOf } from "./lib/claim-text.mjs";

const COUNT = process.argv.includes("--count");
const PRUNE = process.argv.includes("--prune");
const CAMPAIGNS = loadCampaignsFromDataSection("src/App.jsx");

let grand = 0;
for (const [cid, camp] of Object.entries(CAMPAIGNS)) {
  const path = `claims/${cid}.json`;
  const existing = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : [];
  const now = currentClaimText(camp);
  const nowKeys = new Set(now.map((x) => x.node + "|" + x.s));
  let claims = existing;
  const stale = existing.filter((c) => !nowKeys.has(c.node + "|" + c.claim));
  if (PRUNE && stale.length) {
    for (const c of stale) console.log(`  pruned ${c.id}: ${c.claim.slice(0, 90)}`);
    claims = existing.filter((c) => nowKeys.has(c.node + "|" + c.claim));
  }
  const have = new Set(claims.map((c) => c.node + "|" + c.claim));
  const counters = {};
  for (const c of claims) {
    const m = /-(\d+)$/.exec(c.id);
    if (m) counters[c.node] = Math.max(counters[c.node] || 0, Number(m[1]));
  }
  let added = 0;
  for (const { node, where, s } of now) {
    if (have.has(node + "|" + s)) continue;
    counters[node] = (counters[node] || 0) + 1;
    const key = node.startsWith("dossier:") ? `dossier-${node.slice(8)}` : node;
    claims.push({ id: `${cid}-${key}-${counters[node]}`, node, kind: kindOf(s), where, claim: s, status: "drafted", sources: [], note: "" });
    have.add(node + "|" + s);
    added++;
  }
  grand += claims.length;
  console.log(`${cid}: ${claims.length} claims (${added} new, ${stale.length} stale${PRUNE ? ", pruned" : ""})`);
  if (!COUNT) writeFileSync(path, JSON.stringify(claims, null, 1) + "\n");
}
console.log(`total ${grand}`);
