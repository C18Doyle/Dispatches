/**
 * Claims register. Every checkable statement in a node's text is a claim, logged in claims/<campaign>.json with the
 * sources behind it and how far it has been checked. Nothing here proves a claim true; it makes the state of the
 * checking visible and stops new content arriving unlogged.
 *
 * Statuses, weakest to strongest:
 *   drafted        written from the research pass; no source recorded
 *   web-checked    read against a web source named in sources.json
 *   source-checked read against a book, article or primary source
 *   independent    confirmed by someone other than the author
 *   disputed       sources disagree; the node says so
 *
 * Rules:
 *   - every node of a campaign that has a register file needs a claim, unless it is in claims/uncovered.json
 *   - the uncovered list is a ratchet: a node that gains claims must be removed from it, and no node may be added
 *   - web-checked and stronger need at least one source, and every source id must exist in sources.json
 *   - an attributed position must say what it is a characterization of (a note)
 */
const fs = require("fs");
const path = require("path");
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const dir = path.join(__dirname, "claims");
const STATUSES = ["drafted", "web-checked", "source-checked", "independent", "disputed"];
const NEEDS_SOURCE = new Set(["web-checked", "source-checked", "independent"]);
const KINDS = ["fact", "figure", "position", "characterization", "quotation"];

const readJson = (f, fallback) => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); } catch { return fallback; } };
const sources = readJson("sources.json", {});
const uncovered = new Set(readJson("uncovered.json", { nodes: [] }).nodes);

const problems = [];
const tally = Object.fromEntries(STATUSES.map((s) => [s, 0]));
const seenIds = new Set();
const covered = new Set();
let total = 0;

for (const cid of E.CAMPAIGN_IDS) {
  const file = path.join(dir, cid + ".json");
  if (!fs.existsSync(file)) continue;
  const claims = readJson(cid + ".json", []);
  for (const c of claims) {
    total++;
    const where = `claims/${cid}.json ${c.id || "(no id)"}`;
    if (!c.id) problems.push(`${where}: no id`);
    else if (seenIds.has(c.id)) problems.push(`${where}: duplicate id`);
    else seenIds.add(c.id);
    if (!c.claim || !String(c.claim).trim()) problems.push(`${where}: empty claim`);
    if (!KINDS.includes(c.kind)) problems.push(`${where}: kind "${c.kind}" not one of ${KINDS.join(", ")}`);
    if (!STATUSES.includes(c.status)) problems.push(`${where}: status "${c.status}" not one of ${STATUSES.join(", ")}`);
    else tally[c.status]++;
    if (!E.findNode(c.node)) problems.push(`${where}: node "${c.node}" does not exist`);
    else covered.add(c.node);
    const srcs = c.sources ?? [];
    if (NEEDS_SOURCE.has(c.status) && !srcs.length) problems.push(`${where}: status ${c.status} with no source`);
    for (const s of srcs) if (!sources[s]) problems.push(`${where}: source "${s}" is not in sources.json`);
    if (c.kind === "position" && !String(c.note ?? "").trim() && c.status === "drafted") {
      problems.push(`${where}: an attributed position needs a note saying what it characterizes`);
    }
  }
  for (const [nid, node] of Object.entries(E.CAMPAIGNS[cid].nodes)) {
    if (node.ending) continue; // endings restate the record; their claims are logged under the choices that lead to them
    if (!covered.has(nid) && !uncovered.has(nid)) problems.push(`${nid}: no claims logged. Add them to claims/${cid}.json (do not add the node to uncovered.json)`);
  }
}
for (const nid of uncovered) {
  if (!E.findNode(nid)) problems.push(`claims/uncovered.json: "${nid}" is not a node`);
  else if (covered.has(nid)) problems.push(`claims/uncovered.json: "${nid}" now has claims; remove it from the list`);
}

const summary = STATUSES.filter((s) => tally[s]).map((s) => `${tally[s]} ${s}`).join(", ");
console.log(`check-claims: ${total} claims on ${covered.size} nodes (${summary || "none"}); ${uncovered.size} nodes still to be logged`);
process.exit(report("check-claims", problems, total) ? 1 : 0);
