// Adds reachable nodes that are missing from NODE_ATLAS (found by `npm run check:orphans`) to the atlas, so the Discovery
// Atlas lists every situation report and its counts add up to NODE_TOTAL. One-off repair tool; safe to re-run (it adds
// only what is missing). Run: node tools/add-missing-atlas.mjs   (then npm run build:nozip && npm run check:orphans)
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { loadFromJsx } from "../../packages/testkit/src/load-campaigns.mjs";

const PART = "src/parts/20-registries-and-gallery.jsx";
const esbuild = createRequire(import.meta.url)("esbuild");
const { CAMPAIGNS, NODE_ATLAS } = loadFromJsx(esbuild, "src/App.jsx", ["NODE_ATLAS"]);
const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
const when = (date) => {
  const y = /(19\d\d)/.exec(date || "");
  const m = MONTHS.findIndex((x) => (date || "").toUpperCase().includes(x));
  return (y ? Number(y[1]) : 9999) * 100 + (m < 0 ? 6 : m);
};

// Nodes reachable by static next links plus a few flag and meter states (enough to find the missing ones; the
// orphan check is the judge afterwards).
const zero = { manpower: 0, fuel: 0, initiative: 0 };
// Extra ids can be named as campaign:id (for nodes only reached under flag combinations the walk above does not try).
const EXTRA = process.argv.slice(2).map((a) => a.split(":"));
const states = [{}, ...[true, "zz", 3].map((v) => ({ __all: v }))];
let text = readFileSync(PART, "utf8").replace(/\r\n/g, "\n");
let added = 0;
for (const [cid, camp] of Object.entries(CAMPAIGNS)) {
  const listed = new Set((NODE_ATLAS[cid] || []).map((n) => n.id));
  const seen = new Set();
  const queue = [camp.start];
  const missing = [];
  while (queue.length) {
    const id = queue.pop();
    if (!id || seen.has(id) || id === "END") continue;
    seen.add(id);
    for (const st of states) {
      let node;
      try {
        node = camp.resolveNode(id, st.__all === undefined ? st : new Proxy({}, { get: () => st.__all }), zero);
      } catch {
        continue;
      }
      if (!node) continue;
      for (const ch of node.choices || []) {
        if (typeof ch.next === "string") queue.push(ch.next);
        for (const u of ch.uncertain || []) if (typeof u.next === "string") queue.push(u.next);
      }
    }
    let node;
    try {
      node = camp.resolveNode(id, {}, zero);
    } catch {
      continue;
    }
    if (node && !node.isEnding && !listed.has(id)) missing.push({ id, date: node.date || "", title: node.title || id });
  }
  for (const [c, id] of EXTRA) {
    if (c !== cid || listed.has(id) || missing.some((m) => m.id === id)) continue;
    const node = camp.resolveNode(id, {}, zero);
    if (node) missing.push({ id, date: node.date || "", title: node.title || id });
  }
  if (!missing.length) continue;
  missing.sort((a, b) => when(a.date) - when(b.date));
  const open = text.indexOf(`  ${cid}: [`, text.indexOf("const NODE_ATLAS = {"));
  const close = text.indexOf("\n  ],", open);
  if (open < 0 || close < 0) throw new Error(`atlas array for ${cid} not found`);
  const rows = missing.map((n) => `    { id: ${JSON.stringify(n.id)}, date: ${JSON.stringify(n.date)}, title: ${JSON.stringify(n.title)} },`).join("\n");
  text = text.slice(0, close) + "\n" + rows + text.slice(close);
  added += missing.length;
  console.log(`${cid}: added ${missing.length} (${missing.map((n) => n.id).join(", ")})`);
}
writeFileSync(PART, text);
console.log(`added ${added} atlas entries to ${PART}`);
