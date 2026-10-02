/** Flags. Spec §13.2. Prefix enforcement plus write-only and read-only detection.
 *  Invented flag values compile silently and never fire. Happened twice in 1922. */
const { loadEngine, report, fileArg } = require("./_load.js");
const fs = require("fs");
const E = loadEngine(fileArg());

const problems = [];
const written = new Map();
const prefixes = E.CAMPAIGN_IDS.map((c) => E.CAMPAIGNS[c].flagPrefix).concat(["xc_"]);

for (const { campaignId, nodeId, node } of E.allNodes()) {
  const collect = (obj) => {
    for (const [k, v] of Object.entries(obj ?? {})) {
      if (!prefixes.some((p) => k.startsWith(p))) {
        problems.push(`${nodeId}: flag "${k}" is unprefixed — must start with a campaign prefix or xc_`);
      }
      if (!k.startsWith(E.CAMPAIGNS[campaignId].flagPrefix) && !k.startsWith("xc_")) {
        problems.push(`${nodeId}: flag "${k}" carries another campaign's prefix`);
      }
      if (!written.has(k)) written.set(k, new Set());
      written.get(k).add(JSON.stringify(v));
    }
  };
  for (const ch of node.choices ?? []) {
    collect(ch.setFlags);
    for (const b of ch.uncertain ?? []) collect(b.setFlags);
  }
}

// Read detection: flags referenced anywhere in the engine source as flags.X or flags["X"]
const src = fs.readFileSync(fileArg(), "utf8");
const read = new Set();
for (const m of src.matchAll(/flags\.([A-Za-z0-9_]+)/g)) read.add(m[1]);
for (const m of src.matchAll(/flags\[["'`]([^"'`]+)["'`]\]/g)) read.add(m[1]);

for (const k of written.keys()) {
  if (!read.has(k)) problems.push(`flag "${k}" is written but never read`);
}
for (const k of read) {
  if (!written.has(k) && prefixes.some((p) => k.startsWith(p))) {
    problems.push(`flag "${k}" is read but never written`);
  }
}
process.exit(report("check-flag-values", problems, written.size) ? 1 : 0);
