#!/usr/bin/env node
/*
 * check-outcome-sign.js
 *
 * In the spirit of check-pace-text.js: a real (if rarer) bug class is an outcome{} string
 * that reads as a win for the player while its impact{} mechanically punishes them, or vice
 * versa — a copy-paste or a late hand-edit that changed the number but not the prose, or the
 * prose but not the number. This doesn't attempt general sentiment analysis (that would be
 * both unreliable and, given how much of this game's prose is deliberately double-edged —
 * "the cost was real too" sitting inside an outcome the mechanics reward — actively wrong most
 * of the time). Instead it looks for a narrow, high-confidence signal: outcome text containing
 * an UNHEDGED superlative-disaster or superlative-triumph phrase, paired with a net impact
 * (manpower + fuel + initiative) that unambiguously points the other way. Anything short of
 * that — a mixed result, a Pyrrhic victory, a costly-but-correct call — is exactly the kind of
 * prose this game is full of on purpose, and this check is deliberately blind to it.
 *
 * Choices are pulled from real resolved node objects (via campaigns_extracted.js + resolveNode,
 * same harness as check-reachability.js), not static regex over the source text, so ternary
 * outcome/impact pairs (e.g. "outcome: flags.x ? A : B" alongside "impact: flags.x ? {...} :
 * {...}") are captured as they actually resolve together for a given playthrough, rather than
 * as disconnected string/object literals that happen to sit near each other in the file.
 *
 * Findings are CANDIDATES FOR REVIEW, like check-advisor-dates.js's SPEAKS_AFTER_FATE — read
 * each one. False positives are still possible (a "disaster" word describing something other
 * than the choice's own outcome, e.g. quoting what an advisor feared would happen instead of
 * what did).
 *
 * Usage: node check-outcome-sign.js [path/to/App.jsx]
 * Exit 1 if any candidate is found, so it can gate a build.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SRC = process.argv[2] || "../src/App.jsx";
const EXTRACTED = path.join(__dirname, "campaigns_extracted.js");
const RUNS = parseInt(process.env.RUNS || "20000", 10);

execFileSync("node", [path.join(__dirname, "extract_campaigns.js"), SRC, EXTRACTED], { stdio: "inherit" });
delete require.cache[require.resolve(EXTRACTED)];
const CAMPAIGNS = require(EXTRACTED);

// ---- word lists -------------------------------------------------------------------------
// Deliberately narrow and unhedged. A word like "costly" or "setback" is excluded on purpose:
// this game routinely pairs those with a net-positive impact (a costly but worthwhile call).
// These phrases, by contrast, describe an outcome that is *wholly* one thing, not a trade-off.
// "catastrophe"/"catastrophic" were tried and dropped: in this game's prose they're routinely
// used reflexively about the historical war or a referenced event ("cancelling the war's
// central catastrophe") rather than about the choice's own outcome, which is exactly the false
// positive this check exists to avoid. What's left is phrasing specific enough that it's hard
// to use about anything other than the outcome actually being described.
const DISASTER_RE =
  /\b(disastrous|total(?:ly)? annihilat(?:ed|ion)|wiped out|utterly destroyed|crushing defeat|humiliating defeat|routed|total failure|complete failure|ceases? to exist as a fighting force)\b/i;
const TRIUMPH_RE =
  /\b(resounding (?:success|victory)|decisive victory|total victory|overwhelming success|stunning victory|triumphant(?:ly)?|complete success|total success)\b/i;

// A hedge word anywhere in the same outcome text withdraws the "unhedged" premise the check
// depends on — the sentence is explicitly framing a trade-off, which this check isn't built to
// weigh, so skip it rather than guess.
const HEDGE_RE =
  /\b(but|however|though|yet|still|even so|nonetheless|nevertheless|at (?:a|the) cost|the cost|price of|would have|might have|feared|warned|risk(?:s|ed)?|almost|nearly|narrowly|avoid(?:s|ed|ing)?|prevent(?:s|ed|ing)?|spared|averted)\b/i;

// ---- helpers ------------------------------------------------------------------------------
const clamp = (v) => Math.max(-10, Math.min(10, v));

function rollUncertain(u) {
  const total = u.reduce((a, v) => a + v.weight, 0);
  let r = Math.random() * total;
  for (let k = 0; k < u.length; k++) {
    r -= u[k].weight;
    if (r <= 0) return k;
  }
  return 0;
}

function netImpact(impact) {
  if (!impact) return null;
  const m = impact.manpower || 0;
  const f = impact.fuel || 0;
  const i = impact.initiative || 0;
  return m + f + i;
}

// key -> { impact, outcome, node, label } — deduped so the same resolved pair isn't reported
// twice across many playthroughs.
const seen = new Map();

function harvest(node, nodeKey) {
  if (!node || !node.choices) return;
  for (const ch of node.choices) {
    if (typeof ch.outcome === "string" && ch.impact) {
      const key = `${nodeKey}|${ch.label}|${ch.outcome}`;
      if (!seen.has(key)) seen.set(key, { impact: ch.impact, outcome: ch.outcome, node: nodeKey, label: ch.label });
    }
    if (Array.isArray(ch.uncertain)) {
      for (const u of ch.uncertain) {
        if (typeof u.outcome === "string" && u.impact) {
          const key = `${nodeKey}|${ch.label}|${u.title || ""}|${u.outcome}`;
          if (!seen.has(key)) {
            seen.set(key, { impact: u.impact, outcome: u.outcome, node: nodeKey, label: `${ch.label} -> ${u.title || "(uncertain)"}` });
          }
        }
      }
    }
  }
}

function play(campKey, hardKey) {
  const c = CAMPAIGNS[campKey];
  let pos = c.start;
  let flags = hardKey ? { hardMode: true } : {};
  let m = { manpower: 0, fuel: 0, initiative: 0 };
  let steps = 0;
  while (steps++ < 400) {
    let node;
    try {
      node = c.resolveNode(pos, flags, m);
    } catch (e) {
      return;
    }
    if (!node || !node.choices || !node.choices.length) return;
    harvest(node, pos);

    const avail = node.choices.filter((x) => !x.disabledReason);
    if (!avail.length) return;
    const ch = avail[Math.floor(Math.random() * avail.length)];
    let ri = ch.uncertain ? rollUncertain(ch.uncertain) : null;

    let mf = { ...flags };
    if (ch.setFlags) mf = { ...mf, ...ch.setFlags };
    if (ch.uncertain && ri != null && ch.uncertain[ri].setFlags) mf = { ...mf, ...ch.uncertain[ri].setFlags };
    if (ch.suspicionDelta) mf.suspicion = (mf.suspicion || 0) + ch.suspicionDelta;
    if (ch.cohesionDelta) mf.cohesion = (mf.cohesion || 0) + ch.cohesionDelta;
    if (hardKey === "purge" && (mf.suspicion || 0) >= 5) mf.purged = true;
    if (hardKey === "coalition" && (mf.cohesion || 0) <= -6) mf.relieved = true;
    if (hardKey === "iron" && ch.favor) {
      mf._d = (mf._d || 0) + 1;
      if (mf._d >= 5) mf.dismissed = true;
    }

    const eff = ch.uncertain && ri != null ? ch.uncertain[ri].impact || ch.impact : ch.impact;
    if (eff) {
      m = {
        manpower: clamp(m.manpower + (eff.manpower || 0)),
        fuel: clamp(m.fuel + (eff.fuel || 0)),
        initiative: clamp(m.initiative + (eff.initiative || 0)),
      };
    }
    flags = mf;

    let next = (ch.uncertain && ri != null && ch.uncertain[ri].next) || ch.next;
    const forced =
      (hardKey === "iron" && flags.dismissed) ||
      (hardKey === "purge" && flags.purged) ||
      (hardKey === "coalition" && flags.relieved);
    if (next === undefined || next === "END" || forced) return;
    pos = next;
  }
}

const HARD_MODE = { german: "iron", soviet: "purge", allied: "coalition", italy: null };
for (const camp of ["german", "soviet", "allied", "italy"]) {
  for (let i = 0; i < RUNS; i++) play(camp, null);
  if (HARD_MODE[camp]) for (let i = 0; i < RUNS; i++) play(camp, HARD_MODE[camp]);
}

// ---- check ----------------------------------------------------------------------------
const findings = [];
for (const { impact, outcome, node, label } of seen.values()) {
  const net = netImpact(impact);
  if (net == null || net === 0) continue;
  if (HEDGE_RE.test(outcome)) continue;

  const disaster = DISASTER_RE.test(outcome);
  const triumph = TRIUMPH_RE.test(outcome);
  if (disaster && net >= 2) {
    findings.push({ node, label, net, impact, outcome, note: "unhedged disaster language, but net impact is strongly positive" });
  } else if (triumph && net <= -2) {
    findings.push({ node, label, net, impact, outcome, note: "unhedged triumph language, but net impact is strongly negative" });
  }
}

console.log(`resolved choice/outcome pairs observed: ${seen.size}`);
if (findings.length) {
  console.log(`\n!! ${findings.length} candidate outcome/impact sign mismatch(es):`);
  for (const f of findings) {
    console.log(`\n   ${f.node} :: ${f.label}`);
    console.log(`   impact ${JSON.stringify(f.impact)} (net ${f.net}) — ${f.note}`);
    console.log(`   "${f.outcome.slice(0, 220)}${f.outcome.length > 220 ? "…" : ""}"`);
  }
  console.log(`\n${findings.length} candidate(s) found — read each one.`);
  process.exit(1);
}
console.log("\nNo unhedged outcome/impact sign mismatches found.");
process.exit(0);
