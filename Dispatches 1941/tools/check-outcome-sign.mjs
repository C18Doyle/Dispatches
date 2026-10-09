// check-outcome-sign.mjs: an outcome that reads as a plain win while its impact punishes the player, or the reverse (a number or a sentence edited
// without the other). Not sentiment analysis: it looks only for an UNHEDGED disaster or triumph phrase beside a net impact (readiness + pipeline +
// initiative) of at least 2 pointing the other way. Mixed results, costly wins and double-edged prose are what this game is full of, so any
// hedge word in the outcome withdraws the premise and the outcome is skipped. Findings are candidates: read each one.
// Every node in the atlas is resolved with the flags of many random wars and at several meter states, and every choice and every roll outcome is
// examined as the game resolves it. Known, reviewed findings go in tests/audit-allowlist.json under "outcomeSign".
// Usage: node tools/check-outcome-sign.mjs
import { readFileSync, existsSync } from "node:fs";
import { loadGame, playWar, seeded, AXES } from "./audit-lib.mjs";

const DISASTER_RE = /\b(disastrous|total(?:ly)? annihilat(?:ed|ion)|wiped out|utterly destroyed|crushing defeat|humiliating defeat|routed|total failure|complete failure|ceases? to exist as a fighting force)\b/i;
const TRIUMPH_RE = /\b(resounding (?:success|victory)|decisive victory|total victory|overwhelming success|stunning victory|triumphant(?:ly)?|complete success|total success)\b/i;
const HEDGE_RE = /\b(but|however|though|yet|still|even so|nonetheless|nevertheless|at (?:a|the) cost|the cost|price of|would have|might have|feared|warned|risk(?:s|ed)?|almost|nearly|narrowly|avoid(?:s|ed|ing)?|prevent(?:s|ed|ing)?|spared|averted)\b/i;

const RUNS = parseInt(process.env.RUNS || "3000", 10);
const allow = existsSync("tests/audit-allowlist.json") ? JSON.parse(readFileSync("tests/audit-allowlist.json", "utf8")).outcomeSign || [] : [];
const net = (impact) => (impact ? AXES.reduce((a, k) => a + (impact[k] || 0), 0) : null);

const game = await loadGame();
const flagSets = new Map(); // "campaign node" -> Map(key -> flags)
const rnd = seeded(31337);
for (const cid of ["japan", "alliedPacific"]) {
  for (let i = 0; i < RUNS; i++) {
    const war = playWar(game, cid, "open", rnd, { uniformRolls: i % 2 === 1, greedy: [0, 0.5, 0.8][i % 3] });
    for (const s of war.seen) {
      const k = cid + " " + s.id;
      const m = flagSets.get(k) || new Map();
      if (m.size < 12) m.set(JSON.stringify(s.flagsBefore), s.flagsBefore);
      flagSets.set(k, m);
    }
  }
}

const pairs = new Map();
const add = (key, p) => pairs.has(key) || pairs.set(key, p);
for (const [k, sets] of flagSets) {
  const [cid, id] = k.split(" ");
  for (const flags of sets.values()) {
    for (const v of [-6, 0, 6]) {
      let st;
      try {
        st = game.CAMPAIGNS[cid].resolveNode(id, flags, { readiness: v, pipeline: v, initiative: v });
      } catch {
        continue;
      }
      for (const ch of (st && st.choices) || []) {
        if (typeof ch.outcome === "string" && ch.impact) add(`${k}|${ch.label}|${ch.outcome}`, { node: k, label: ch.label, impact: ch.impact, outcome: ch.outcome });
        for (const u of ch.uncertain || []) {
          if (typeof u.outcome === "string" && (u.impact || ch.impact)) add(`${k}|${ch.label}|${u.title}|${u.outcome}`, { node: k, label: `${ch.label} -> ${u.title}`, impact: u.impact || ch.impact, outcome: u.outcome });
        }
      }
    }
  }
}

const found = [];
for (const p of pairs.values()) {
  const n = net(p.impact);
  if (n == null || n === 0 || HEDGE_RE.test(p.outcome)) continue;
  const tag = `${p.node} | ${p.label.slice(0, 70)}`;
  if (DISASTER_RE.test(p.outcome) && n >= 2) found.push({ tag, text: `unhedged disaster language, but net impact is +${n}: "${p.outcome.slice(0, 160)}"` });
  else if (TRIUMPH_RE.test(p.outcome) && n <= -2) found.push({ tag, text: `unhedged triumph language, but net impact is ${n}: "${p.outcome.slice(0, 160)}"` });
}
const fresh = found.filter((f) => !allow.includes(f.tag));
console.log(`Outcome sign: ${pairs.size} resolved choice/outcome pairs examined, ${found.length} candidate(s), ${allow.length} allowlisted.`);
if (fresh.length) {
  for (const f of fresh) console.log(`  ${f.tag}\n    ${f.text}`);
  process.exit(1);
}
console.log("Outcome sign check passed.");
