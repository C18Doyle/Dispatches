#!/usr/bin/env node
// Turns full_node_report.json into one HTML file: an H1, then one H2 + table per campaign.
// Node/date/title/situation cells are rowspan-merged across a node's own choice/branch rows so
// the (often 500-800 char) situation text isn't repeated once per choice.
const fs = require("fs");

const data = JSON.parse(fs.readFileSync(process.argv[2] || "full_node_report.json", "utf8"));

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

const CAMPAIGN_LABEL = { german: "German Campaign (OKW)", soviet: "Soviet Campaign (СТАВКА)", allied: "Allied Campaign (SHAEF)", italy: "Italy Campaign (STEFANI)" };
const CAMPAIGN_ORDER = ["german", "soviet", "allied", "italy"];
const ONLY_CAMPAIGN = process.argv[4]; // optional: emit just one campaign's section (for splitting into per-campaign docs)

let html = "";
if (!ONLY_CAMPAIGN) {
  html += `<h1>Dispatches 1940 — Full Node Export</h1>`;
  html += `<p>All ${data.rows.length} choice/branch rows across ${Object.values(data.counts).reduce((a,b)=>a+b,0)} nodes ` +
    `(${CAMPAIGN_ORDER.map(k => data.counts[k] + " " + k).join(", ")}). ` +
    `Generated from the live game source (src/App.jsx), not hand-transcribed — every node id, choice label, ` +
    `outcome text, next-node link, and Manpower/Fuel/Initiative delta below is resolved directly from the ` +
    `game's own CAMPAIGNS getters at baseline flags (a fresh run, no prior choices), the same values the ` +
    `project's own automated tools already validate against. Where a choice branches probabilistically ` +
    `(an "uncertain" roll), each branch gets its own row with its own outcome text, link, and deltas, plus the ` +
    `odds at baseline meters — those odds shift during real play as Manpower/Fuel/Initiative move.</p>`;
}

for (const camp of (ONLY_CAMPAIGN ? [ONLY_CAMPAIGN] : CAMPAIGN_ORDER)) {
  const rows = data.rows.filter((r) => r.campaign === camp);
  html += `\n<h2>${esc(CAMPAIGN_LABEL[camp])} — ${data.counts[camp]} nodes</h2>\n`;
  html += `<table border="1" cellspacing="0" cellpadding="4">`;
  html += `\n<tr>` +
    `<th>Node ID</th><th>Date</th><th>Title</th><th>Situation Text</th>` +
    `<th>Choice</th><th>Branch</th><th>Outcome Text</th><th>Next Node</th>` +
    `<th>Manpower</th><th>Fuel</th><th>Initiative</th>` +
    `</tr>`;

  let i = 0;
  while (i < rows.length) {
    const nodeId = rows[i].nodeId;
    const group = [];
    while (i < rows.length && rows[i].nodeId === nodeId) {
      group.push(rows[i]);
      i++;
    }
    for (let g = 0; g < group.length; g++) {
      const r = group[g];
      html += "\n<tr>";
      if (g === 0) {
        html += `<td rowspan="${group.length}"><b>${esc(r.nodeId)}</b></td>`;
        html += `<td rowspan="${group.length}">${esc(r.date)}</td>`;
        html += `<td rowspan="${group.length}">${esc(r.title)}</td>`;
        html += `<td rowspan="${group.length}">${esc(r.situation)}</td>`;
      }
      html += `<td>${esc(r.choiceLabel)}</td>`;
      html += `<td>${esc(r.branchNote)}</td>`;
      html += `<td>${esc(r.outcome)}</td>`;
      html += `<td>${esc(r.next)}</td>`;
      html += `<td>${r.manpower === "" ? "" : (r.manpower > 0 ? "+" : "") + r.manpower}</td>`;
      html += `<td>${r.fuel === "" ? "" : (r.fuel > 0 ? "+" : "") + r.fuel}</td>`;
      html += `<td>${r.initiative === "" ? "" : (r.initiative > 0 ? "+" : "") + r.initiative}</td>`;
      html += "</tr>";
    }
  }
  html += `\n</table>\n`;
}

const outPath = process.argv[3] || "full_node_report.html";
fs.writeFileSync(outPath, `<html><body>\n${html}\n</body></html>`);
console.error(`Wrote ${outPath} (${(fs.statSync(outPath).size / 1024 / 1024).toFixed(2)} MB)`);
