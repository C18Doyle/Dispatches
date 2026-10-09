// check-reachability.mjs: content that exists, is wired, and can never be seen. Plays seeded random wars (the game's own rules)
// and asserts against what they produced:
//   (every title positionLabel() can return is reached: that search is in check-orphans.mjs, which explores flag states exactly)
//   1. every ENDINGS_GALLERY label is a title a campaign can return             (no stale gallery entries)
//   2. every flag a run writes is read somewhere in the source                  (no write-only flags)
//   3. every blocked choice (disabledReason) is open in at least one run        (no dead gates)
// Known findings that are reviewed and accepted live in tests/audit-allowlist.json under "reachability".
// Usage: node tools/check-reachability.mjs   (RUNS=n changes the number of wars per campaign and mode)
import { readFileSync, existsSync } from "node:fs";
import { loadGame, playWar, seeded, sourceText, labelsInSource, MODES } from "./audit-lib.mjs";

const RUNS = parseInt(process.env.RUNS || "20000", 10);
const allow = existsSync("tests/audit-allowlist.json") ? JSON.parse(readFileSync("tests/audit-allowlist.json", "utf8")).reachability || {} : {};
const allowed = (kind, key) => (allow[kind] || []).includes(key);

const game = await loadGame();
const src = sourceText();
const problems = [];
const note = (kind, key, text) => {
  if (!allowed(kind, key)) problems.push(`${kind}: ${text}`);
};

const sourceLabels = { japan: labelsInSource("japan"), alliedPacific: labelsInSource("alliedPacific") };

const writtenFlags = new Set();
const gates = new Map(); // "campaign node | label" -> { open, blocked }
const rnd = seeded(20260101);
for (const cid of ["japan", "alliedPacific"]) {
  for (const mode of MODES) {
    const n = mode === "open" ? RUNS : Math.ceil(RUNS / 4);
    for (let i = 0; i < n; i++) {
      const war = playWar(game, cid, mode, rnd, { uniformRolls: i % 2 === 1, greedy: [0, 0.5, 0.8, 0.95][(i >> 1) % 4] });
      Object.keys(war.flags).forEach((k) => writtenFlags.add(k));
      for (const s of war.seen) {
        for (const c of s.stage.choices) {
          if (!c.disabledReason) continue;
          const key = `${cid} ${s.id} | ${c.label.slice(0, 60)}`;
          const g = gates.get(key) || { open: 0, blocked: 0 };
          g.blocked++;
          gates.set(key, g);
        }
      }
    }
  }
}

// 1. gallery
const allTitles = new Set([...sourceLabels.japan, ...sourceLabels.alliedPacific]);
for (const g of game.ENDINGS_GALLERY) if (!allTitles.has(g.label)) note("staleGallery", g.label, `gallery entry that no campaign can return: "${g.label}"`);
// 1b. every ENDING_CLASSIFICATION entry is a title a campaign can return (a leftover would score an ending that cannot happen)
for (const k of Object.keys(game.ENDING_CLASSIFICATION)) if (!allTitles.has(k)) note("staleClassification", k, `ending classification for a title no campaign returns: "${k}"`);
// 2. write-only flags
const reads = (k) => new RegExp(`(\\.|\\?\\.)${k}\\b|\\[["']${k}["']\\]|["']${k}["']\\s*in\\s`).test(src);
// the tallies behind the readings under each meter are read by name from logic.ts (flags[def.flag]), so a text search cannot see them
const tallyFlags = new Set(Object.values(game.logic.METER_STRANDS).flat().map((d) => d.flag));
for (const k of writtenFlags) if (!tallyFlags.has(k) && !reads(k)) note("writeOnlyFlag", k, `flag written but never read: ${k}`);
// 3. dead gates: a choice that exists at some meter state but is blocked (disabledReason) at every meter state tried.
// Each node is re-resolved with the flags of up to 10 distinct wars, at every combination of meters on a coarse grid (64 states).
{
  const grid = [-10, -3, 3, 10];
  const states = new Map(); // "campaign node" -> Map(flagKey -> flags)
  const rnd2 = seeded(99);
  for (const cid of ["japan", "alliedPacific"]) {
    for (let i = 0; i < Math.ceil(RUNS / 4); i++) {
      const war = playWar(game, cid, "open", rnd2, { uniformRolls: i % 2 === 1, greedy: [0, 0.5, 0.8][i % 3] });
      for (const s of war.seen) {
        const k = cid + " " + s.id;
        const m = states.get(k) || new Map();
        if (m.size < 10) m.set(JSON.stringify(s.flagsBefore), s.flagsBefore);
        states.set(k, m);
      }
    }
  }
  for (const [k, flagSets] of states) {
    const [cid, id] = k.split(" ");
    const seenOpen = new Map(); // label -> ever open
    for (const flags of flagSets.values()) {
      for (const a of grid) for (const b of grid) for (const c of grid) {
        let stage;
        try { stage = game.CAMPAIGNS[cid].resolveNode(id, flags, { readiness: a, pipeline: b, initiative: c }); } catch { continue; }
        for (const ch of (stage && stage.choices) || []) {
          const key = ch.label.slice(0, 60);
          seenOpen.set(key, seenOpen.get(key) || !ch.disabledReason);
        }
      }
    }
    for (const [label, open] of seenOpen) if (!open) note("deadGate", k + " | " + label, "choice blocked at every meter state tried: " + k + " | " + label);
  }
}

console.log(`Reachability: ${RUNS} wars per campaign (open) plus hard modes; ${game.ENDINGS_GALLERY.length} gallery entries; ${writtenFlags.size} flags written.`);
if (problems.length) {
  console.log(problems.slice(0, 60).join("\n"));
  console.log(`\n${problems.length} finding(s). Fix the content, or add a reviewed exception to tests/audit-allowlist.json ("reachability").`);
  process.exit(1);
}
console.log("Reachability check passed.");
