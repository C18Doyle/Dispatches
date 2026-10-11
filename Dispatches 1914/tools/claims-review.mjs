#!/usr/bin/env node
// The fact-check workflow, in two steps.
//
//   node tools/claims-review.mjs            writes claims/review.html: ONE page, no server, no install. Give it to the reviewer.
//   node tools/claims-review.mjs --status   prints how much of the record has been checked
//
// The reviewer opens review.html in any browser. Each claim that nobody but the author has checked is shown with the report it comes from, the sources
// already recorded and a choice: "Confirmed" (with the source they used), "Wrong" (with what is right), "Needs a source" or "Skip". The same page lists the
// approximate lines of the front on the map, each drawn for its dates, to mark as right or wrong. Everything is kept in the browser as they go, so they can
// stop and come back, and "Export my review" saves one small file to send back.
//
// Then:   node tools/apply-review.mjs review-<name>.json     (checks it, updates claims/*.json and claims/map-review.json, and prints what changed)
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { loadEngine } = require(join(ROOT, "_load.js"));
const E = loadEngine(join(ROOT, "dispatches-greatwar.jsx"));
const sources = JSON.parse(readFileSync(join(ROOT, "claims", "sources.json"), "utf8"));
const read = (f, d) => (existsSync(join(ROOT, f)) ? JSON.parse(readFileSync(join(ROOT, f), "utf8")) : d);
const mapReview = read("claims/map-review.json", {});

const claims = [];
for (const cid of E.CAMPAIGN_IDS) {
  const list = read(`claims/${cid}.json`, []);
  for (const c of list) claims.push({ ...c, campaign: cid });
}
const tally = (list) => list.reduce((o, c) => ((o[c.status] = (o[c.status] || 0) + 1), o), {});

if (process.argv.includes("--status")) {
  console.log(`claims: ${claims.length}`, tally(claims));
  for (const cid of E.CAMPAIGN_IDS) console.log(`  ${cid}:`, tally(claims.filter((c) => c.campaign === cid)));
  const overlays = Object.values(E.MAP_OVERLAYS).flat();
  const reviewed = overlays.filter((o) => mapReview[o.id]);
  console.log(`map lines: ${overlays.length}, reviewed ${reviewed.length}`, tally(reviewed.map((o) => ({ status: mapReview[o.id].verdict }))));
  process.exit(0);
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const todo = claims.filter((c) => c.status !== "independent");

// ---- the reports the claims belong to
const nodeText = new Map();
for (const c of todo) {
  if (nodeText.has(c.node)) continue;
  const hit = E.findNode(c.node);
  if (!hit) continue;
  const r = E.resolveNode(c.node, {}, E.emptyMeters(), E.emptyHardState());
  nodeText.set(c.node, { title: r.title, date: r.date, campaign: hit.campaignId, situation: String(r.situation || "").slice(0, 1400) });
}

// ---- the map: each overlay on a small map of its own, countries defined once
const maps = {
  europe: { view: E.MAP_VIEW, countries: E.MAP_COUNTRIES, land: E.MAP_LAND_PATH },
  nearEast: { view: E.MAP_NEAR.view, countries: E.MAP_NEAR.countries, land: E.MAP_NEAR.land },
};
const slug = (s) => String(s).replace(/[^a-zA-Z0-9]/g, "_");
const proj = (view) => ([lon, lat]) => [((lon - view.lon[0]) / (view.lon[1] - view.lon[0])) * view.width, ((view.lat[1] - lat) / (view.lat[1] - view.lat[0])) * view.height];
let defs = "";
for (const [mid, m] of Object.entries(maps)) { defs += `<path id="${mid}-land" d="${m.land}"/>`; for (const c of m.countries) defs += `<path id="${mid}-${slug(c.id)}" d="${c.d}"/>`; }
const thumbs = [];
for (const [mid, list] of Object.entries(E.MAP_OVERLAYS)) {
  const m = maps[mid];
  const p = proj(m.view);
  const pts = (l) => l.map((q) => p(q).map((v) => v.toFixed(1)).join(",")).join(" ");
  for (const o of list) {
    const date = o.from > "1914-08-01" ? o.from : o.to;
    const clip = `<clipPath id="rc-${mid}-${o.id}">${o.mask.map((n) => `<use href="#${mid}-${slug(n)}"/>`).join("")}</clipPath>`;
    const base = m.countries.map((c) => `<use href="#${mid}-${slug(c.id)}" class="s-${E.sideOfCountry(c.id, date)}"/>`).join("");
    // frame the thumbnail on the line (or the polygon, when there is no line), with room around it
    const ps = (o.line || o.poly).map(p);
    const xs = ps.map((q) => q[0]), ys = ps.map((q) => q[1]);
    let w = Math.max(Math.max(...xs) - Math.min(...xs) + 90, 170), h = Math.max(Math.max(...ys) - Math.min(...ys) + 90, 120);
    const aspect = m.view.width / m.view.height;
    if (w / h < aspect) w = h * aspect; else h = w / aspect;
    w = Math.min(w, m.view.width); h = Math.min(h, m.view.height);
    const vx = Math.max(0, Math.min(m.view.width - w, (Math.min(...xs) + Math.max(...xs)) / 2 - w / 2));
    const vy = Math.max(0, Math.min(m.view.height - h, (Math.min(...ys) + Math.max(...ys)) / 2 - h / 2));
    const svg = `<svg viewBox="${vx.toFixed(1)} ${vy.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}" role="img" aria-label="${esc(o.id)} on ${date}"><defs>${clip}</defs><rect width="${m.view.width}" height="${m.view.height}" class="sea"/>${base}<polygon points="${pts(o.poly)}" clip-path="url(#rc-${mid}-${o.id})" class="s-${o.side}"/><use href="#${mid}-land" class="coast"/>${o.line ? `<polyline points="${pts(o.line)}" class="front"/>` : ""}</svg>`;
    thumbs.push({ id: o.id, map: mid, from: o.from, to: o.to, side: o.side, mask: o.mask, hasLine: Boolean(o.line), svg, prior: mapReview[o.id] || null });
  }
}

const data = {
  generated: new Date().toISOString().slice(0, 10),
  claims: todo.map((c) => ({ id: c.id, campaign: c.campaign, node: c.node, kind: c.kind, claim: c.claim, status: c.status, note: c.note || "", sources: (c.sources || []).map((s) => ({ id: s, title: sources[s]?.title || s, url: sources[s]?.url || "" })) })),
  nodes: Object.fromEntries(nodeText),
  campaigns: Object.fromEntries(E.CAMPAIGN_IDS.map((c) => [c, E.CAMPAIGNS[c].shortName])),
  maps: thumbs.map(({ svg, ...rest }) => rest),
};

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dispatches 1914: fact-check review</title>
<style>
:root{--paper:#f4efe2;--raised:#e9e2cf;--ink:#1c1a17;--soft:#5d574c;--accent:#7a2e2e;--good:#3d5a2f}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.55 Georgia,serif}
header{position:sticky;top:0;z-index:5;background:var(--paper);border-bottom:2px solid var(--ink);padding:10px 16px}
h1{font-size:18px;margin:0 0 6px}main{max-width:880px;margin:0 auto;padding:16px}
.bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font:13px system-ui,sans-serif}
.bar select,.bar input,.bar button{font:inherit;padding:6px 8px;border:1.5px solid var(--ink);background:#fff;border-radius:3px}
.bar button{cursor:pointer;background:var(--ink);color:var(--paper)}
.meter{height:8px;background:var(--raised);border:1px solid var(--soft);flex:1;min-width:120px}.meter i{display:block;height:100%;background:var(--good)}
.node{margin:26px 0 8px;font-size:16px;border-top:3px double var(--ink);padding-top:10px}.node small{color:var(--soft)}
details.ctx{margin:4px 0 10px;font-size:13px;color:var(--soft)}
.claim{border:1.5px solid var(--ink);background:#fff8;padding:10px 12px;margin:0 0 10px;font-family:system-ui,sans-serif;font-size:14px}
.claim.done{background:#e5efdc}.claim.bad{background:#f3dcdc}.claim.need{background:#f5ecc9}
.claim .k{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);font-weight:700}
.claim .t{margin:3px 0 6px}.claim .src{font-size:12px;color:var(--soft)}.claim .src a{color:var(--accent)}
.row{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.row label{font-size:13px;border:1.5px solid var(--ink);padding:5px 9px;border-radius:3px;cursor:pointer;background:#fff}
.row input[type=radio]{margin-right:5px}.row input[type=text]{flex:1;min-width:200px;padding:6px 8px;border:1.5px solid var(--soft);border-radius:3px;font:13px system-ui}
.mp{display:grid;grid-template-columns:260px 1fr;gap:14px;border:1.5px solid var(--ink);padding:10px;margin:0 0 12px;font-family:system-ui,sans-serif;font-size:14px}
.mp svg{width:100%;height:auto;border:1px solid var(--ink)}@media(max-width:640px){.mp{grid-template-columns:1fr}}
.sea{fill:#d3dddb}.s-cp{fill:#cdb98f}.s-ent{fill:#b6c5c4}.s-neu{fill:#ece6d4}use{stroke:#666;stroke-width:.4}.coast{fill:none;stroke:#222;stroke-width:.8}.front{fill:none;stroke:#7a2e2e;stroke-width:2.4;stroke-dasharray:7 4}
h2{font-size:16px;letter-spacing:.12em;text-transform:uppercase;border-bottom:2px solid var(--ink);padding-bottom:4px;margin-top:34px}
.help{font:14px/1.5 system-ui,sans-serif;background:var(--raised);border:1.5px solid var(--ink);padding:10px 14px}
</style></head><body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${defs}</defs></svg>
<header><h1>Dispatches 1914: fact-check review</h1>
<div class="bar"><label>Your name <input id="who" size="16" placeholder="so the record can say who checked"></label>
<label>Show <select id="f-status"><option value="todo">still to do</option><option value="all">everything</option><option value="drafted">drafted only</option><option value="web-checked">web-checked only</option></select></label>
<label>Command <select id="f-cmd"><option value="">all</option></select></label>
<span class="meter" title="claims you have given a verdict"><i id="bar" style="width:0"></i></span><span id="count"></span>
<button id="export">Export my review</button><label style="cursor:pointer">Load a saved review <input id="import" type="file" accept="application/json" style="display:none"></label></div></header>
<main>
<div class="help"><b>How this works.</b> Each box below is one statement the game makes (a date, a figure, who did what, or how a person's view is put). Read it, look it up in your own source, and choose: <b>Confirmed</b> (type the source: a book and page, or a link), <b>Wrong</b> (say what is right), <b>Needs a source</b> (you could not find one), or <b>Skip</b>. Positions ("X's view is put as...") are characterizations, not quotations: confirm them if the wording is fair to the person. Counterfactual outcomes ("Speculative...") need no check. Your answers are kept in this browser as you go; <b>Export my review</b> saves a small file to send back. Nothing leaves your computer.</div>
<h2>Statements</h2><div id="claims"></div>
<h2>Lines of the front on the map</h2>
<div class="help">The game draws the front, and the ground held by each side, from lines I wrote from the course of the fighting. They are approximate. For each, the map shows the territory taken by a side between the dates given (the dashed line is the front). Mark each <b>Fair</b> (right to within the scale of the map), <b>Wrong</b> (say where it should run) or <b>Skip</b>.</div>
<div id="maps"></div>
</main>
<script>
const DATA = ${JSON.stringify(data).replace(/</g, "\\u003c")};
const THUMBS = ${JSON.stringify(thumbs.map((t) => t.svg)).replace(/</g, "\\u003c")};
const KEY = "dispatches1914_review_v1";
let R = {};
try { R = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { R = {}; }
R.claims = R.claims || {}; R.maps = R.maps || {};
const $ = (s) => document.querySelector(s);
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(R)); } catch (e) {} };
const e = (t, a, ...kids) => { const n = document.createElement(t); for (const [k, v] of Object.entries(a || {})) { if (k === "class") n.className = v; else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else if (v !== undefined && v !== null) n.setAttribute(k, v); } for (const c of kids.flat()) n.append(c && c.nodeType ? c : document.createTextNode(c ?? "")); return n; };
for (const [id, name] of Object.entries(DATA.campaigns)) $("#f-cmd").append(e("option", { value: id }, name));
$("#who").value = R.who || "";
$("#who").addEventListener("input", () => { R.who = $("#who").value; save(); });
const VERDICTS = [["confirmed", "Confirmed"], ["wrong", "Wrong"], ["needs", "Needs a source"], ["skip", "Skip"]];
function verdictRow(kind, id, extraLabel) {
  const store = R[kind];
  const cur = store[id] || {};
  const row = e("div", { class: "row" });
  const mk = (v, label) => e("label", {}, e("input", { type: "radio", name: kind + id, value: v, ...(cur.verdict === v ? { checked: "" } : {}), onchange: () => { store[id] = { ...(store[id] || {}), verdict: v }; save(); paint(); } }), label);
  for (const [v, label] of (kind === "maps" ? [["fair", "Fair"], ["wrong", "Wrong"], ["skip", "Skip"]] : VERDICTS)) row.append(mk(v, label));
  row.append(e("input", { type: "text", placeholder: extraLabel, value: cur.text || "", oninput: (ev) => { store[id] = { ...(store[id] || {}), text: ev.target.value }; save(); } }));
  return row;
}
function paint() {
  const st = $("#f-status").value, cmd = $("#f-cmd").value;
  const done = (c) => R.claims[c.id] && R.claims[c.id].verdict && R.claims[c.id].verdict !== "skip";
  const list = DATA.claims.filter((c) => (!cmd || c.campaign === cmd) && (st === "all" || (st === "todo" ? !done(c) && c.status !== "web-checked" : c.status === st)));
  const box = $("#claims"); box.replaceChildren();
  let last = "";
  for (const c of list) {
    if (c.node !== last) {
      last = c.node; const n = DATA.nodes[c.node] || {};
      box.append(e("div", { class: "node" }, e("b", {}, n.title || c.node), " ", e("small", {}, (DATA.campaigns[c.campaign] || "") + ", " + (n.date || "")), e("details", { class: "ctx" }, e("summary", {}, "Show the report's text"), (n.situation || "").split(/\\n+/).map((p) => e("p", {}, p)))));
    }
    const v = (R.claims[c.id] || {}).verdict;
    const card = e("div", { class: "claim " + (v === "confirmed" ? "done" : v === "wrong" ? "bad" : v === "needs" ? "need" : "") },
      e("div", { class: "k" }, c.kind + " · " + c.status), e("div", { class: "t" }, c.claim),
      c.note ? e("div", { class: "src" }, "Author's note: " + c.note) : "",
      c.sources.length ? e("div", { class: "src" }, "Recorded sources: ", c.sources.map((s) => s.url ? e("a", { href: s.url, target: "_blank", rel: "noopener" }, s.title + "  ") : s.title + "  ")) : e("div", { class: "src" }, "No source recorded."),
      verdictRow("claims", c.id, "Your source (a book and page, or a link), or what is right"));
    box.append(card);
  }
  const answered = DATA.claims.filter(done).length;
  $("#count").textContent = list.length + " shown · " + answered + " of " + DATA.claims.length + " answered";
  $("#bar").style.width = Math.round((answered / DATA.claims.length) * 100) + "%";
}
function paintMaps() {
  const box = $("#maps");
  DATA.maps.forEach((m, i) => {
    const holder = e("div", { class: "mp" });
    holder.innerHTML = THUMBS[i];
    const right = e("div", {}, e("b", {}, m.id + " (" + m.map + ")"), e("div", {}, m.side === "cp" ? "Held by the Central Powers" : m.side === "ent" ? "Held by the Entente" : "Neutral"), e("div", {}, "From " + m.from + " to " + m.to), e("div", {}, "Within: " + m.mask.join(", ")), m.prior ? e("div", { class: "src" }, "Already reviewed: " + m.prior.verdict + (m.prior.reviewer ? " by " + m.prior.reviewer : "")) : "", verdictRow("maps", m.id, "Where it should run, if wrong"));
    holder.append(right); box.append(holder);
  });
}
$("#f-status").addEventListener("change", paint); $("#f-cmd").addEventListener("change", paint);
$("#export").addEventListener("click", () => {
  const out = { tool: "claims-review", generated: DATA.generated, reviewer: R.who || "", date: new Date().toISOString().slice(0, 10),
    claims: Object.entries(R.claims).filter(([, v]) => v.verdict && v.verdict !== "skip").map(([id, v]) => ({ id, verdict: v.verdict, text: v.text || "" })),
    maps: Object.entries(R.maps).filter(([, v]) => v.verdict && v.verdict !== "skip").map(([id, v]) => ({ id, verdict: v.verdict, text: v.text || "" })) };
  if (!out.reviewer) { alert("Please type your name first, so the record can say who checked."); return; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: "application/json" }));
  a.download = "review-" + out.reviewer.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + out.date + ".json"; a.click();
});
$("#import").addEventListener("change", (ev) => { const f = ev.target.files[0]; if (!f) return; f.text().then((t) => { const j = JSON.parse(t); R.who = j.reviewer || R.who; for (const c of j.claims || []) R.claims[c.id] = { verdict: c.verdict, text: c.text }; for (const m of j.maps || []) R.maps[m.id] = { verdict: m.verdict, text: m.text }; save(); $("#who").value = R.who || ""; paint(); paintMaps(); }); });
paint(); paintMaps();
</script></body></html>`;
writeFileSync(join(ROOT, "claims", "review.html"), html);
console.log(`claims/review.html: ${todo.length} statements to check (${claims.length - todo.length} already independent), ${thumbs.length} map lines, ${(html.length / 1024).toFixed(0)} KB`);
