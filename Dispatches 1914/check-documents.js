/** Documents from the record (src/46-documents.jsx). Each key names a report; each has a speaker, a date line, a source and a text that is a whole passage (it ends at a
 *  full stop), written in British spelling without a long dash; the document comes before the report's date (the report cannot quote what has not yet been written);
 *  and each is logged as a web-checked quotation in the command's register, with a source that exists. */
const fs = require("fs");
const path = require("path");
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
const claimsOf = (cid) => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, "claims", cid + ".json"), "utf8")); } catch { return []; } };
const sources = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, "claims", "sources.json"), "utf8")); } catch { return {}; } })();
for (const [nodeId, d] of Object.entries(E.DOCUMENTS)) {
  checked++;
  const f = E.findNode(nodeId);
  if (!f) { problems.push(nodeId + ": no such report"); continue; }
  for (const k of ["by", "date", "source", "text"]) if (!d[k] || typeof d[k] !== "string") problems.push(nodeId + ": no " + k);
  if (!/[.!?]$/.test(d.text || "")) problems.push(nodeId + ": the text does not end at a full stop");
  if (/[—–]/.test((d.text || "") + (d.by || "") + (d.date || ""))) problems.push(nodeId + ": a long dash");
  if (/\b(color|armor|defense|center|honor|labor|gray|realize|organize|neighbor)\b/i.test(d.text || "")) problems.push(nodeId + ": a US spelling in the text");
  const claim = claimsOf(f.campaignId).find((c) => c.id === "doc-" + nodeId + "-1");
  if (!claim) problems.push(nodeId + ": not logged as a claim (doc-" + nodeId + "-1)");
  else {
    if (claim.kind !== "quotation") problems.push(nodeId + ": its claim is not a quotation");
    if (claim.status !== "web-checked" && claim.status !== "source-checked") problems.push(nodeId + ": its claim is not checked against a source");
    for (const s of claim.sources || []) if (!sources[s]) problems.push(nodeId + ": source " + s + " is not in sources.json");
  }
}
for (const cid of E.CAMPAIGN_IDS) {
  checked++;
  const n = Object.keys(E.DOCUMENTS).filter((id) => E.findNode(id) && E.findNode(id).campaignId === cid).length;
  if (n < 1) problems.push(cid + ": no document");
}
process.exit(report("check-documents", problems, checked) ? 1 : 0);
