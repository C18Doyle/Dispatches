#!/usr/bin/env node
// check-materiel-strands.mjs  (it covers all three meters)
//
// Each meter has readable micro-states under it: Matériel has three strands (Fuel & Oil, Arms & Ammunition,
// Shipping & Rail), Manpower has Organisation, Experience and Readiness, Initiative has Intelligence,
// Command and Tempo. A choice's impact on a meter is filed to one of them by `matStrand` (Matériel only) or by
// what its text is about (strandOf in src/logic.ts). That is a text-reading rule, so this audit shows how it
// files the choices a player can actually reach and fails if it drifts into uselessness: too many impacts that
// fit no micro-state, or a micro-state nothing feeds. It samples seeded random walks over the extracted
// campaigns (run `npm run extract-campaigns` first, or run it through `npm run audit`, which does).
//
// Usage: node tools/check-materiel-strands.mjs [--list]   (--list prints every filed choice)
import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(mkdtempSync(path.join(tmpdir(), "strands-")), "logic.cjs");
buildSync({ entryPoints: [path.join(ROOT, "src/logic.ts")], bundle: true, platform: "node", format: "cjs", outfile: out, logLevel: "error" });
const require = createRequire(import.meta.url);
const L = require(out);
const C = require(path.join(ROOT, "tools/campaigns_extracted.js"));
const camps = C.CAMPAIGNS || C;

const METERS = [
  { key: "fuel", name: "Matériel", maxNone: 0.5 },
  { key: "manpower", name: "Manpower", maxNone: 0.1 },
  { key: "initiative", name: "Initiative", maxNone: 0.1 },
];

let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const seen = new Map();
for (const [cid, c] of Object.entries(camps)) {
  for (let walk = 0; walk < 400; walk++) {
    let pos = c.start;
    let flags = {};
    let meters = { manpower: 0, fuel: 0, initiative: 0 };
    for (let step = 0; step < 80 && pos; step++) {
      let node;
      try {
        node = c.resolveNode(pos, flags, meters);
      } catch {
        break;
      }
      if (!node || !node.choices || !node.choices.length) break;
      const ch = node.choices[Math.floor(rnd() * node.choices.length)];
      let eff = { impact: ch.impact, outcome: ch.outcome, setFlags: null, next: ch.next };
      if (ch.uncertain && ch.uncertain.length) {
        const u = ch.uncertain[Math.floor(rnd() * ch.uncertain.length)];
        eff = { impact: u.impact || ch.impact, outcome: u.outcome, setFlags: u.setFlags, next: u.next || ch.next };
      }
      for (const m of METERS) {
        const delta = (eff.impact && eff.impact[m.key]) || 0;
        if (!delta) continue;
        const key = `${m.key}|${cid}|${pos}|${ch.label.slice(0, 40)}`;
        if (!seen.has(key)) seen.set(key, { meter: m.key, cid, pos, label: ch.label, delta, strand: L.strandOf(m.key, ch, eff.outcome) });
      }
      flags = { ...flags, ...(ch.setFlags || {}), ...(eff.setFlags || {}) };
      meters = {
        manpower: meters.manpower + ((eff.impact && eff.impact.manpower) || 0),
        fuel: meters.fuel + ((eff.impact && eff.impact.fuel) || 0),
        initiative: meters.initiative + ((eff.impact && eff.impact.initiative) || 0),
      };
      pos = eff.next && eff.next !== "END" ? eff.next : null;
    }
  }
}

const problems = [];
for (const m of METERS) {
  const rows = [...seen.values()].filter((v) => v.meter === m.key);
  const counts = { none: 0 };
  for (const s of L.METER_STRANDS[m.key]) counts[s.id] = 0;
  for (const v of rows) counts[v.strand || "none"]++;
  const total = rows.length;
  const filed = total - counts.none;
  console.log(`${m.name}: choices with an impact reached: ${total}`);
  for (const s of L.METER_STRANDS[m.key]) console.log(`  ${s.name.padEnd(16)} ${counts[s.id]}`);
  console.log(`  (fits none)      ${counts.none}`);
  if (process.argv.includes("--list")) for (const v of rows) console.log(`${String(v.strand).padEnd(6)} ${String(v.delta).padStart(2)} ${v.cid.padEnd(7)} ${v.pos.padEnd(22)} ${v.label.slice(0, 80)}`);
  if (total < 100) problems.push(`${m.name}: only ${total} choices reached; the walk or the extractor is broken`);
  if (total && counts.none / total > m.maxNone) problems.push(`${m.name}: ${Math.round((100 * counts.none) / total)}% of impacts fit no micro-state (limit ${Math.round(m.maxNone * 100)}%)`);
  for (const s of L.METER_STRANDS[m.key]) if (filed && counts[s.id] / filed < 0.04) problems.push(`${m.name}: "${s.name}" is fed by under 4% of filed impacts`);
}
if (problems.length) {
  console.log("\n!! " + problems.join("\n!! "));
  process.exit(1);
}
console.log("\nMicro-state filing looks sound.");
