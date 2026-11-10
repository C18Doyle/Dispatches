// Claims register for Dispatches 1922. Every checkable statement in a report's text is a claim, logged in claims/<campaign>.json with the sources behind
// it and how far it has been checked. Nothing here proves a claim true; it makes the state of the checking visible and stops new content arriving unlogged.
//
// Statuses, weakest to strongest:
//   drafted        written from the research pass; no source recorded
//   web-checked    read against a web source named in claims/sources.json (a page opened, or a search summary)
//   source-checked read against a book, article or primary source
//   independent    confirmed by someone other than the author (apply-review.mjs sets this)
//   disputed       sources disagree, or a reviewer says it is wrong; the report says so, or must be fixed
//
// Rules:
//   - every report of a campaign needs a claim, unless it is in claims/uncovered.json (a ratchet: nodes only leave that list)
//   - web-checked and stronger need at least one source, and every source id must exist in claims/sources.json
//   - a disputed claim needs a note
//   - a claim whose text no longer appears in the report is stale: re-run tools/claims-draft.mjs and keep only claims that still match
// Run: npm run check:claims
import { existsSync, readFileSync } from "node:fs";
import { loadCampaignsFromDataSection } from "../../packages/testkit/src/load-campaigns.mjs";
import { currentClaimText } from "./lib/claim-text.mjs";

const CAMPAIGNS = loadCampaignsFromDataSection("src/App.jsx");
const STATUSES = ["drafted", "web-checked", "source-checked", "independent", "disputed"];
const NEEDS_SOURCE = new Set(["web-checked", "source-checked", "independent"]);
const KINDS = ["fact", "figure", "position", "characterization", "quotation"];
const read = (f, d) => (existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : d);
const sources = read("claims/sources.json", {});
const uncovered = new Set(read("claims/uncovered.json", { nodes: [] }).nodes);

const problems = [];
const tally = Object.fromEntries(STATUSES.map((s) => [s, 0]));
const seen = new Set();
const covered = new Set();
let total = 0;
const usedSources = new Set();

for (const [cid, camp] of Object.entries(CAMPAIGNS)) {
  const claims = read(`claims/${cid}.json`, null);
  if (!claims) {
    problems.push(`claims/${cid}.json is missing (run node tools/claims-draft.mjs)`);
    continue;
  }
  const now = new Set(currentClaimText(camp).map((x) => x.node + "|" + x.s));
  const ids = new Set([...camp.NODE_ATLAS.map((a) => a.id), ...(camp.ENDINGS_GALLERY || []).map((e) => e.id)]);
  for (const c of claims) {
    total++;
    const where = `claims/${cid}.json ${c.id || "(no id)"}`;
    if (!c.id) problems.push(`${where}: no id`);
    else if (seen.has(c.id)) problems.push(`${where}: duplicate id`);
    else seen.add(c.id);
    if (!c.claim || !String(c.claim).trim()) problems.push(`${where}: empty claim`);
    if (!KINDS.includes(c.kind)) problems.push(`${where}: kind "${c.kind}" is not one of ${KINDS.join(", ")}`);
    if (!STATUSES.includes(c.status)) problems.push(`${where}: status "${c.status}" is not one of ${STATUSES.join(", ")}`);
    else tally[c.status]++;
    if (String(c.node).startsWith("dossier:")) {
      if (!camp.ADVISOR_DOSSIERS || !camp.ADVISOR_DOSSIERS[c.node.slice(8)]) problems.push(`${where}: no dossier "${c.node}"`);
    } else if (!ids.has(c.node)) problems.push(`${where}: report "${c.node}" does not exist`);
    else covered.add(cid + ":" + c.node);
    if (!now.has(c.node + "|" + c.claim)) problems.push(`${where}: stale (the text is no longer in the game; run node tools/claims-draft.mjs --prune)`);
    const srcs = c.sources ?? [];
    if (NEEDS_SOURCE.has(c.status) && !srcs.length) problems.push(`${where}: status ${c.status} with no source`);
    for (const s of srcs) {
      usedSources.add(s);
      if (!sources[s]) problems.push(`${where}: source "${s}" is not in claims/sources.json`);
    }
    if (c.status === "disputed" && !String(c.note || "").trim()) problems.push(`${where}: a disputed claim needs a note`);
  }
  for (const a of camp.NODE_ATLAS) {
    if (!covered.has(cid + ":" + a.id) && !uncovered.has(cid + ":" + a.id)) problems.push(`${cid}:${a.id}: no claims logged (add them with tools/claims-draft.mjs; do not add the report to claims/uncovered.json)`);
  }
}
for (const u of uncovered) {
  const [cid, nid] = u.split(":");
  if (!CAMPAIGNS[cid] || !CAMPAIGNS[cid].NODE_ATLAS.some((a) => a.id === nid)) problems.push(`claims/uncovered.json: "${u}" is not a report`);
  else if (covered.has(u)) problems.push(`claims/uncovered.json: "${u}" now has claims; remove it from the list`);
}
const checked = tally["web-checked"] + tally["source-checked"] + tally["independent"];
console.log(`claims: ${total} logged (${checked} checked, ${tally.disputed} disputed, ${tally.drafted} still drafted), ${usedSources.size} of ${Object.keys(sources).length} sources used, ${uncovered.size} report(s) uncovered.`);
console.log("  " + JSON.stringify(tally));
for (const p of problems.slice(0, 40)) console.log("  " + p);
console.log(`${problems.length} problem(s).`);
process.exit(problems.length ? 1 : 0);
