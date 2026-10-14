#!/usr/bin/env node
// The fact-check workflow, in two steps.
//
//   node tools/claims-review.mjs            writes claims/review.html: ONE page, no server, no install. Give it to the reviewer.
//   node tools/claims-review.mjs --status   prints how much of the record has been checked
//
// The reviewer opens review.html in any browser. Each claim that nobody but the author has checked is shown with the report it comes from, the sources already
// on file and a choice: "Confirmed" (with the source they used), "Wrong" (with what is right), "Needs a source" or "Skip". Everything is kept in the browser as
// they go, so they can stop and come back, and "Export my review" saves one small file to send back.
//
// Then:   node tools/apply-review.mjs review-<name>.json     (checks it, updates claims/*.json, and prints what changed)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { loadCampaignsFromDataSection } from "../../packages/testkit/src/load-campaigns.mjs";

const CAMPAIGNS = loadCampaignsFromDataSection("src/App.jsx");
const read = (f, d) => (existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : d);
const sources = read("claims/sources.json", {});
const claims = [];
for (const cid of Object.keys(CAMPAIGNS)) for (const c of read(`claims/${cid}.json`, [])) claims.push({ ...c, campaign: cid });
const tally = (list) => list.reduce((o, c) => ((o[c.status] = (o[c.status] || 0) + 1), o), {});

if (process.argv.includes("--status")) {
  console.log(`claims: ${claims.length}`, tally(claims));
  for (const cid of Object.keys(CAMPAIGNS)) console.log(`  ${cid}:`, tally(claims.filter((c) => c.campaign === cid)));
  process.exit(0);
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const todo = claims.filter((c) => c.status !== "independent");
const titleOf = (c) => {
  const camp = CAMPAIGNS[c.campaign];
  if (c.node.startsWith("dossier:")) return `Dossier: ${c.node.slice(8)}`;
  const a = camp.NODE_ATLAS.find((x) => x.id === c.node) || (camp.ENDINGS_GALLERY || []).find((x) => x.id === c.node);
  return a ? `${a.date || ""} ${a.title}`.trim() : c.node;
};
const order = { disputed: 0, drafted: 1, "web-checked": 2, "source-checked": 3 };
todo.sort((a, b) => a.campaign.localeCompare(b.campaign) || (order[a.status] ?? 9) - (order[b.status] ?? 9) || a.node.localeCompare(b.node));

const blocks = [];
let lastKey = "";
for (const c of todo) {
  const key = c.campaign + "|" + c.node;
  if (key !== lastKey) {
    blocks.push(`<h3>${esc(CAMPAIGNS[c.campaign].label)}: ${esc(titleOf(c))}</h3>`);
    lastKey = key;
  }
  const srcs = (c.sources || []).map((s) => (sources[s] ? `<a href="${esc(sources[s].url)}">${esc(sources[s].title)}</a>` : esc(s))).join("; ");
  blocks.push(`<div class="claim" data-id="${esc(c.id)}">
<div class="meta">${esc(c.id)} · ${esc(c.kind)} · ${esc(c.where || "")} · <b class="st-${esc(c.status)}">${esc(c.status)}</b></div>
<p>${esc(c.claim)}</p>
${srcs ? `<div class="src">Sources on file: ${srcs}</div>` : ""}${c.note ? `<div class="note">Note: ${esc(c.note)}</div>` : ""}
<div class="choice"><label><input type="radio" name="${esc(c.id)}" value="confirmed"> Confirmed</label>
<label><input type="radio" name="${esc(c.id)}" value="wrong"> Wrong</label>
<label><input type="radio" name="${esc(c.id)}" value="needs"> Needs a source</label>
<label><input type="radio" name="${esc(c.id)}" value="skip" checked> Skip</label></div>
<input class="txt" type="text" placeholder="Confirmed: the source you used (a title or a link). Wrong: what is right." aria-label="Source or correction for ${esc(c.id)}">
</div>`);
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dispatches 1922: fact check</title>
<style>body{font:16px/1.5 Georgia,serif;max-width:760px;margin:0 auto;padding:16px;background:#f6f1e4;color:#1a1712}h1{font-size:1.5em}h3{margin:28px 0 6px;border-top:2px solid #1a1712;padding-top:10px}
.claim{background:#fffaf0;border:1px solid #b9ad92;padding:10px 12px;margin:8px 0}.meta{font:12px monospace;color:#5a5445}.src,.note{font-size:13px;color:#3a352c}.choice{margin:6px 0}.choice label{margin-right:14px}
.txt{width:100%;box-sizing:border-box;font:14px monospace;padding:6px}.st-disputed{color:#8a1f1f}.bar{position:sticky;top:0;background:#1a1712;color:#f2ecdc;padding:8px 12px;margin:0 -16px 12px}
button{font:14px monospace;padding:6px 10px;margin-right:8px}</style></head><body>
<div class="bar"><span id="count"></span> <button id="export">Export my review</button> <label>Import <input id="import" type="file" accept=".json"></label></div>
<h1>Dispatches 1922: fact check</h1>
<p>Reviewer: <input id="who" type="text" size="28" aria-label="Your name"></p>
<p>Each statement is from a report or an adviser's dossier. Mark <b>Confirmed</b> (and give the source you used), <b>Wrong</b> (and say what is right), <b>Needs a source</b>, or leave it on <b>Skip</b>. Disputed statements come first in each campaign. Your answers stay in this browser; <b>Export</b> saves one small file to send back.</p>
<p>Not in this list: the battle configs (claims/battles-round1.md and battles-round2.md) and the new 1917 reports (claims/provisional-government-round1.md) have their own source tables.</p>
${blocks.join("\n")}
<script>
const KEY = "dispatches1922-review";
const state = JSON.parse(localStorage.getItem(KEY) || "{}");
const claims = [...document.querySelectorAll(".claim")];
function save() { localStorage.setItem(KEY, JSON.stringify(state)); count(); }
function count() { const n = Object.values(state.answers || {}).filter((a) => a.verdict && a.verdict !== "skip").length; document.getElementById("count").textContent = n + " answered of " + claims.length; }
state.answers = state.answers || {};
document.getElementById("who").value = state.who || "";
document.getElementById("who").addEventListener("input", (e) => { state.who = e.target.value; save(); });
for (const el of claims) {
  const id = el.dataset.id, a = state.answers[id];
  if (a) { const r = el.querySelector('input[value="' + a.verdict + '"]'); if (r) r.checked = true; el.querySelector(".txt").value = a.text || ""; }
  const upd = () => { const v = el.querySelector("input[type=radio]:checked").value; state.answers[id] = { verdict: v, text: el.querySelector(".txt").value }; save(); };
  el.addEventListener("change", upd); el.addEventListener("input", upd);
}
document.getElementById("export").onclick = () => {
  const out = { reviewer: state.who || "", date: new Date().toISOString().slice(0, 10), claims: Object.entries(state.answers).filter(([, a]) => a.verdict !== "skip").map(([id, a]) => ({ id, verdict: a.verdict, text: a.text })) };
  const url = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: "application/json" }));
  const a = document.createElement("a"); a.href = url; a.download = "review-" + (out.reviewer || "reviewer").replace(/\\W+/g, "-") + "-" + out.date + ".json"; a.click();
};
document.getElementById("import").onchange = (e) => { const f = e.target.files[0]; if (!f) return; f.text().then((t) => { const j = JSON.parse(t); state.who = j.reviewer || state.who; for (const c of j.claims || []) state.answers[c.id] = { verdict: c.verdict, text: c.text }; save(); location.reload(); }); };
count();
</script></body></html>`;
writeFileSync("claims/review.html", html);
console.log(`claims/review.html written: ${todo.length} statements for review (${claims.length - todo.length} already independent).`);
