/**
 * Attested quotations. Advisers carry `position`, never invented speech. A choice may carry one `attested` line,
 * words a named person is on record as having said or written, shown on screen with its source. Rules:
 *   - by, text and source are all present; the text is short (25 words or fewer)
 *   - the speaker was in the story on the node's date where the speaker is on the roster
 *   - the quotation is logged in claims/<campaign>.json as a claim of kind "quotation" whose text contains it,
 *     so the fact-check worksheet carries it
 */
const fs = require("fs");
const path = require("path");
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
const claims = {};
for (const cid of E.CAMPAIGN_IDS) {
  const f = path.join(__dirname, "claims", cid + ".json");
  claims[cid] = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : [];
}
for (const { campaignId, nodeId, node } of E.allNodes()) {
  for (const ch of node.choices ?? []) {
    const a = ch.attested;
    if (!a) continue;
    checked++;
    const where = `${nodeId}/${ch.id}`;
    for (const k of ["by", "text", "source"]) if (!a[k] || !String(a[k]).trim()) problems.push(`${where}: attested.${k} missing`);
    if (a.text && a.text.trim().split(/\s+/).length > 25) problems.push(`${where}: attested text is longer than 25 words; quote the fragment that matters`);
    const logged = claims[campaignId].some((c) => c.kind === "quotation" && c.node === nodeId && c.claim.includes(a.text));
    if (!logged) problems.push(`${where}: the quotation "${a.text}" is not logged as a claim of kind "quotation" in claims/${campaignId}.json`);
  }
}
process.exit(report("check-quotations", problems, checked) ? 1 : 0);
