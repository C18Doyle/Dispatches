#!/usr/bin/env node
// Thin alternative paths: where an order away from the record leads to a short stretch of the war. Plays each command headlessly many times
// with random orders (as tools/balance.mjs does), and for every order not the record's that a run gave, notes how many more reports the file
// ran before its end. An order whose file usually ends much sooner than the record's order at the same report does is a thin path: the war
// it opens has been written for a report or two and then closed. Endings that are meant to come early (a collapse, a recall, an armistice)
// show up here too; read the list, do not chase it to zero.
//   node tools/thin-paths.mjs [runs] [--top=20]
import { createRequire } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(ROOT, "package.json"));
const esbuild = require("esbuild");
const { loadFromJsx } = await import(pathToFileURL(join(ROOT, "../packages/testkit/src/load-campaigns.mjs")).href);
const { CAMPAIGNS, compositeNext } = loadFromJsx(esbuild, join(ROOT, "src/App.jsx"), ["compositeNext"]);
const out = join(mkdtempSync(join(tmpdir(), "thin-")), "effort.cjs");
esbuild.buildSync({ entryPoints: [join(ROOT, "src/effort.ts")], bundle: true, platform: "node", format: "cjs", outfile: out, logLevel: "error" });
const { yearTurn, reportYear } = require(out);
const RUNS = Number(process.argv.find((a) => /^\d+$/.test(a)) || 3000);
const TOP = Number((process.argv.find((a) => a.startsWith("--top=")) || "--top=20").slice(6));
const clamp = (v) => Math.max(-10, Math.min(10, v));
function rngFor(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0), s / 4294967296);
}
function roll(u, rnd) {
  const total = u.reduce((a, v) => a + v.weight, 0);
  let r = rnd() * total;
  for (let k = 0; k < u.length; k++) if ((r -= u[k].weight) <= 0) return k;
  return 0;
}
/** One random file: the reports it passed, each with the order given and whether it was the record's, and the ending. */
function play(c, rnd) {
  let pos = c.start;
  let flags = {};
  let m = { manpower: 0, fuel: 0, initiative: 0 };
  let prevYear = null;
  const steps = [];
  for (let n = 0; n < 400; n++) {
    let node;
    try {
      node = c.resolveNode(pos, flags, m);
    } catch (e) {
      return null;
    }
    if (!node || !node.choices) return null;
    const turn = yearTurn(flags, m, reportYear(node.date), prevYear);
    flags = turn.flags;
    m = turn.meters;
    prevYear = reportYear(node.date) || prevYear;
    const avail = node.choices.filter((x) => !x.disabledReason);
    if (!avail.length) return null;
    const ch = avail[Math.floor(rnd() * avail.length)];
    const hasRecord = avail.some((x) => x.historical);
    steps.push({ pos: String(pos), title: node.title, label: ch.label, historical: !!ch.historical, hasRecord });
    const ri = ch.uncertain && ch.uncertain.length ? roll(ch.uncertain, rnd) : null;
    flags = { ...flags, ...(ch.setFlags || {}), ...((ch.uncertain && ch.uncertain[ri].setFlags) || {}) };
    const eff = ch.uncertain && ri != null ? ch.uncertain[ri].impact || ch.impact : ch.impact;
    if (eff) m = { manpower: clamp(m.manpower + (eff.manpower || 0)), fuel: clamp(m.fuel + (eff.fuel || 0)), initiative: clamp(m.initiative + (eff.initiative || 0)) };
    const next = (ch.uncertain && ri != null && ch.uncertain[ri].next) || ch.next;
    const rawEnd = next === "END" || next === undefined;
    if (c.tracks) {
      const s = compositeNext(c, pos, rawEnd ? "END" : next, rawEnd, flags, m);
      flags = s.flags;
      if (s.isEnd) return { steps, ending: c.positionLabel(flags, m) };
      pos = s.nextPos;
      continue;
    }
    if (rawEnd) return { steps, ending: c.positionLabel(flags, m) };
    pos = next;
  }
  return null;
}
const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  return s.length ? s[Math.floor(s.length / 2)] : null;
};

const rows = [];
for (const cid of ["german", "soviet", "italy", "japan", "british", "american"]) {
  const c = CAMPAIGNS[cid];
  const rnd = rngFor(77);
  const after = {}; // pos -> label -> { left: [], endings: {}, next: {} , historical }
  for (let i = 0; i < RUNS; i++) {
    const r = play(c, rnd);
    if (!r) continue;
    r.steps.forEach((s, k) => {
      if (!s.hasRecord) return;
      const byPos = (after[s.pos] = after[s.pos] || { title: s.title, orders: {} });
      const o = (byPos.orders[s.label] = byPos.orders[s.label] || { historical: s.historical, left: [], endings: {}, then: {} });
      o.left.push(r.steps.length - k - 1);
      o.endings[r.ending] = (o.endings[r.ending] || 0) + 1;
      const path = r.steps.slice(k + 1, k + 4).map((x) => x.pos).join(" > ") || "(end)";
      o.then[path] = (o.then[path] || 0) + 1;
    });
  }
  for (const [pos, p] of Object.entries(after)) {
    const rec = Object.values(p.orders).find((o) => o.historical);
    if (!rec || rec.left.length < 20) continue;
    const recLeft = median(rec.left);
    for (const [label, o] of Object.entries(p.orders)) {
      if (o.historical || o.left.length < 20) continue;
      const left = median(o.left);
      if (recLeft < 4) continue;
      const ratio = left / recLeft;
      if (ratio > 0.5) continue;
      const top = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1])[0];
      rows.push({ cid, pos, title: p.title, label, left, recLeft, ratio, runs: o.left.length, ending: top(o.endings)[0], then: top(o.then)[0] });
    }
  }
}
rows.sort((a, b) => a.ratio - b.ratio || b.recLeft - a.recLeft);
console.log(`Thin alternative paths (${RUNS} random runs a command): orders away from the record after which the file runs at most half as many reports as after the record's order.\n`);
for (const r of rows.slice(0, TOP)) {
  console.log(`${r.cid} / ${r.pos} (${r.title}): "${r.label.slice(0, 80)}"`);
  console.log(`    ${r.left} more reports, against ${r.recLeft} after the record's order (${r.runs} runs); most often ends: ${r.ending}; next: ${r.then}`);
}
console.log(`\n${rows.length} thin path(s) in all.`);
