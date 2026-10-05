#!/usr/bin/env node
// check-materiel-strands.mjs
//
// The Matériel meter has four readable strands under it (Fuel & Oil, Ammunition, Armour & Steel,
// Shipping & Rail). A choice's Matériel impact is filed to a strand by `matStrand` if the choice
// names one, and otherwise by what its text is about (materielStrandOf in src/logic.ts). That is a
// text-reading rule, so this audit shows how it files the choices a player can actually reach and
// fails if it drifts into uselessness: too many impacts that fit no strand, or a strand nothing
// feeds. It samples seeded random walks over the extracted campaigns (run `npm run
// extract-campaigns` first, or run it through `npm run audit`, which does).
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
      const fuel = (eff.impact && eff.impact.fuel) || 0;
      if (fuel) {
        const key = `${cid}|${pos}|${ch.label.slice(0, 40)}`;
        if (!seen.has(key)) seen.set(key, { cid, pos, label: ch.label, fuel, strand: L.materielStrandOf(ch, eff.outcome) });
      }
      flags = { ...flags, ...(ch.setFlags || {}), ...(eff.setFlags || {}) };
      meters = {
        manpower: meters.manpower + ((eff.impact && eff.impact.manpower) || 0),
        fuel: meters.fuel + fuel,
        initiative: meters.initiative + ((eff.impact && eff.impact.initiative) || 0),
      };
      pos = eff.next && eff.next !== "END" ? eff.next : null;
    }
  }
}

const counts = { none: 0 };
for (const s of L.MATERIEL_STRANDS) counts[s.id] = 0;
for (const v of seen.values()) counts[v.strand || "none"]++;
const total = seen.size;
const filed = total - counts.none;
console.log(`choices with a Matériel impact reached: ${total}`);
for (const s of L.MATERIEL_STRANDS) console.log(`  ${s.name.padEnd(16)} ${counts[s.id]}`);
console.log(`  (fits no strand)  ${counts.none}`);
if (process.argv.includes("--list")) for (const v of seen.values()) console.log(`${String(v.strand).padEnd(6)} ${String(v.fuel).padStart(2)} ${v.cid.padEnd(7)} ${v.pos.padEnd(22)} ${v.label.slice(0, 80)}`);

const problems = [];
if (total < 100) problems.push(`only ${total} choices reached; the walk or the extractor is broken`);
if (counts.none / total > 0.5) problems.push(`${Math.round((100 * counts.none) / total)}% of Matériel impacts fit no strand (limit 50%)`);
for (const s of L.MATERIEL_STRANDS) if (filed && counts[s.id] / filed < 0.04) problems.push(`strand "${s.name}" is fed by under 4% of filed impacts`);
if (problems.length) {
  console.log("\n!! " + problems.join("\n!! "));
  process.exit(1);
}
console.log("\nStrand filing looks sound.");
