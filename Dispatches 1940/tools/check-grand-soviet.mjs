#!/usr/bin/env node
// The experimental grand Soviet campaign (src/parts/46-grand-soviet.jsx): the graph of the consultant's tree.
//   - every order opens reports that exist; every report has between one and five orders, with different labels and at most one marked as the record's;
//   - the date of a report (`at`) agrees with its date line, and a walk never goes back in time;
//   - 20000 random walks from the first report all end, at GS_MERGE, without repeating a report; every report is reached by some walk;
//   - the texts keep the house style (British spelling, no dashes, no quotation marks).
//   node tools/check-grand-soviet.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "src/parts/46-grand-soviet.jsx"), "utf8");
const modWeight = (w) => w;
const G = new Function("modWeight", "CAMPAIGNS", src + "\nreturn { GS_REPORTS, gsBuildReport, GS_MERGE };")(modWeight, { soviet: {} });
const { GS_REPORTS, gsBuildReport, GS_MERGE } = G;
const problems = [];
const words = (t) => t.trim().split(/\s+/).filter(Boolean).length;
const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
const meters = { manpower: 0, fuel: 0, initiative: 0 };
const style = (at, t) => {
  if (/[—–"“”]/.test(t)) problems.push(`${at}: a dash or a quotation mark in "${t.slice(0, 50)}"`);
  if (/\b(color|armor|armored|defense|honor|labor|center|neighbor|harbor|kilometers|gray|theater|offense)\b/i.test(t)) problems.push(`${at}: American spelling in "${t.slice(0, 50)}"`);
};

const ids = Object.keys(GS_REPORTS);
// the flags that change what a report offers, for the static checks
const flagSets = [{}, { gsSevastopol: "stands" }, { gsMega: "big" }, { gsMega: "moderate" }, { gsMars: "breaks" }, { gsMars: "stalls" }];
for (const id of ids) {
  const r = GS_REPORTS[id];
  const at = `report ${id}`;
  if (r.id !== id) problems.push(`${at}: id mismatch`);
  const m = String(r.date).match(/(\d{4})/);
  const month = MONTHS.findIndex((n) => String(r.date).includes(n)) + 1;
  const y = Math.floor(r.at / 10000);
  const mo = Math.floor((r.at % 10000) / 100);
  if (!m || Number(m[1]) !== y) problems.push(`${at}: the day ${r.at} is not in the year of "${r.date}"`);
  if (month && month !== mo) problems.push(`${at}: the day ${r.at} is not in the month of "${r.date}"`);
  for (const flags of flagSets) {
    const built = gsBuildReport(r, flags, meters);
    const orders = built.choices;
    if (orders.length < 1 || orders.length > 5) problems.push(`${at}: ${orders.length} orders`);
    if (new Set(orders.map((o) => o.label)).size !== orders.length) problems.push(`${at}: two orders with one label`);
    if (orders.filter((o) => o.historical).length > 1) problems.push(`${at}: more than one order marked as the record's`);
    for (const o of orders) {
      if (!o.advisor.name) problems.push(`${at}: an order without an adviser`);
      if (o.next !== GS_MERGE && !GS_REPORTS[o.next]) problems.push(`${at} "${o.label}": opens "${o.next}", which is not a report`);
      style(at, o.label);
      style(at, o.outcome);
      for (const u of o.uncertain || []) style(at, u.outcome);
    }
    style(at, built.title);
    if (words(built.situation) < 8) problems.push(`${at}: the situation is under eight words`);
    style(at, built.situation);
  }
}

// ---- random walks ----
let seed = 12345;
const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const reached = new Map();
const lengths = { wide: [], moscow: [] };
const WALKS = 20000;
for (let w = 0; w < WALKS; w++) {
  let flags = {};
  let id = "gsDec41";
  const path = [];
  let last = 0;
  for (let step = 0; step < 100; step++) {
    if (id === GS_MERGE) break;
    const spec = GS_REPORTS[id];
    if (!spec) { problems.push(`walk ${w}: "${id}" is not a report`); break; }
    if (path.includes(id)) { problems.push(`walk ${w}: ${id} is played twice`); break; }
    if (spec.at < last) problems.push(`walk ${w}: ${id} (${spec.at}) comes after a report of ${last}`);
    last = Math.max(last, spec.at);
    path.push(id);
    reached.set(id, (reached.get(id) || 0) + 1);
    const built = gsBuildReport(spec, flags, meters);
    const c = built.choices[Math.floor(rnd() * built.choices.length)];
    let set = c.setFlags;
    if (c.uncertain) set = c.uncertain[rnd() < c.uncertain[0].weight / 100 ? 0 : 1].setFlags;
    flags = { ...flags, ...set };
    id = c.next;
    if (step === 99) problems.push(`walk ${w}: no end after 100 reports`);
  }
  (flags.gsPlan === "moscow" ? lengths.moscow : lengths.wide).push(path.length);
}
for (const id of ids) if (!reached.has(id)) problems.push(`report ${id}: no walk reaches it`);

const avg = (a) => (a.reduce((x, y) => x + y, 0) / (a.length || 1)).toFixed(1);
const range = (a) => `${Math.min(...a)} to ${Math.max(...a)}`;
if (problems.length) {
  console.error(`check-grand-soviet: ${problems.length} problem(s)`);
  for (const p of [...new Set(problems)].slice(0, 50)) console.error("  " + p);
  process.exit(1);
}
console.log(`check-grand-soviet: ${ids.length} reports, ${ids.reduce((n, id) => n + (typeof GS_REPORTS[id].orders === "function" ? 2 : GS_REPORTS[id].orders.length), 0)} orders; ${WALKS} walks all end at ${GS_MERGE}`);
console.log(`  the wide plan plays ${avg(lengths.wide)} reports on average (${range(lengths.wide)}), the Moscow plan ${avg(lengths.moscow)} (${range(lengths.moscow)})`);
const rare = [...reached.entries()].sort((a, b) => a[1] - b[1]).slice(0, 5).map(([id, n]) => `${id} ${((100 * n) / WALKS).toFixed(1)}%`);
console.log("  rarest reports: " + rare.join(", "));
