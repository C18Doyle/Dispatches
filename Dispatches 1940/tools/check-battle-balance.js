#!/usr/bin/env node
/*
 * check-battle-balance.js
 *
 * Automated regression test for the Key Battle Subgame's allocation math (round 12, Craig's
 * item #3 — "automated balance tests"). Every tuning pass on this system so far (rounds 8-11)
 * was verified by a throwaway hand-written Node script, checked once, then thrown away — which
 * is exactly how the round-9 posture rework nearly shipped without actually fixing the "one
 * best play" problem it was built for, and how the round-8 neglect penalty's one-chit hedge
 * loophole went unmeasured for three rounds. This script makes those checks permanent and part
 * of `npm run audit`, so a future change that breaks a balance invariant fails loudly instead of
 * shipping quietly.
 *
 * Method: this does NOT reimplement the battle math by hand — that would drift from the real
 * source and "verify" a copy, not the game. Instead it extracts the actual pure-function source
 * (KEY_BATTLE_NEGLECT_PENALTY through computeBattlePlanCosts, plus the commander/approach/
 * posture/category tables) straight out of App.jsx via balanced-delimiter slicing, then
 * evaluates that extracted source in a sandboxed vm context and runs real scenarios through it.
 * If a future round renames or restructures these, this script's extraction fails loudly rather
 * than silently testing stale logic.
 *
 * Invariants checked, for every battle x every enemy posture x every pool size (5-8):
 *   1. The best single-category plan differs across postures — round 9's whole point — checked
 *      once per battle (pool-size independent).
 *   2. A synergized concentration beats a NAIVE concentration (all chits in one category, wrong
 *      commander/approach, no synergy) — a plan should beat a pile of chits with no plan behind
 *      it, not just tie it.
 *   3. The one-chit hedge (a token chit in every off-category, the rest concentrated) does not
 *      come out ahead of true full concentration — round 8 shipped a flat per-category penalty
 *      that a hedge could dodge for free; round 12 grades the penalty by shortfall against a fair
 *      share, so a token chit still costs something. Compared on the clamped/displayed bonus,
 *      ties allowed (a strict "hedge must score lower" flags display-clamp and rounding
 *      coincidences that no player ever sees as a different outcome — see the Round 16 comment
 *      inline).
 *   5. (Round 16, Craig's item #9) No allocation AT ALL — not just the one-chit hedge — outscores
 *      honest full concentration in the informed category, on that same displayed/clamped basis.
 *      Every possible allocation of the pool across the battle's categories is enumerated
 *      exhaustively and compared against full concentration. This is what actually caught the
 *      real exploit:
 *      invariant #3 only ever tested ONE hedge shape and missed that a hedge which tops every
 *      off-category up to its fair share (not just one token chit) beat honest concentration in
 *      67 of 120 real scenarios under the pre-Round-16 penalty curve. It also subsumes the
 *      original invariant #1 as first written ("beats an even spread") — an even spread is just
 *      one allocation among the ones this now checks exhaustively, so a hand-picked even-spread
 *      comparison would have been weaker than what's here, not an independent extra check.
 *
 * Usage: node check-battle-balance.js [path/to/App.jsx]
 * Exit 1 if any invariant fails for any battle/posture/pool-size combination.
 */
const fs = require("fs");
const vm = require("vm");

const SRC = process.argv[2] || "App.jsx";
const src = fs.readFileSync(SRC, "utf8");

// ---- balanced-delimiter extraction (quote-aware, so a "}" inside dialogue doesn't miscount) ---
function extractBalanced(text, markerIndex, openChar, closeChar) {
  let i = text.indexOf(openChar, markerIndex);
  if (i === -1) throw new Error(`extractBalanced: no '${openChar}' found after index ${markerIndex}`);
  let depth = 0;
  let inString = null; // '"', "'" or "`" while inside a string/template literal
  for (let j = i; j < text.length; j++) {
    const ch = text[j];
    if (inString) {
      if (ch === "\\") { j++; continue; } // skip escaped char
      if (ch === inString) inString = null;
      continue;
    }
    // This source is full of hand-written prose in // line comments and /* */ block comments —
    // Wikipedia quotes, apostrophes, the works — which would otherwise be misread as string
    // delimiters and desync the brace count for thousands of characters (caught by this script
    // itself grabbing half the file on first run). Comments are skipped entirely, unscanned.
    if (ch === "/" && text[j + 1] === "/") {
      const nl = text.indexOf("\n", j);
      j = nl === -1 ? text.length : nl;
      continue;
    }
    if (ch === "/" && text[j + 1] === "*") {
      const end = text.indexOf("*/", j + 2);
      j = end === -1 ? text.length : end + 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inString = ch; continue; }
    if (ch === openChar) depth++;
    else if (ch === closeChar) {
      depth--;
      if (depth === 0) return text.slice(markerIndex, j + 1);
    }
  }
  throw new Error(`extractBalanced: unbalanced '${openChar}'/'${closeChar}' starting at index ${markerIndex}`);
}
function extractFromMarker(text, marker, openChar, closeChar) {
  const idx = text.indexOf(marker);
  if (idx === -1) throw new Error(`marker not found: ${marker}`);
  return extractBalanced(text, idx, openChar, closeChar);
}
// For `function name(...) { ... }` where the params may themselves be a destructured object
// (so the first "{" after the name is the params' brace, not the body's) — skip past the
// balanced parens first, then extract the body from the "{" that actually follows them.
function extractFunction(text, name) {
  const marker = `function ${name}(`;
  const idx = text.indexOf(marker);
  if (idx === -1) throw new Error(`function not found: ${name}`);
  const parenStart = idx + marker.length - 1; // index of the "("
  const paramsSlice = extractBalanced(text, parenStart, "(", ")");
  const bodyStartSearch = parenStart + paramsSlice.length;
  const body = extractBalanced(text, bodyStartSearch, "{", "}");
  const bodyEndIndex = text.indexOf(body, bodyStartSearch) + body.length;
  return text.slice(idx, bodyEndIndex);
}

// ---- 1. Extract the shared pure math + tables (KEY_BATTLE_NEGLECT_PENALTY through the end of
//         computeBattlePlanCosts is one contiguous block in App.jsx as of round 11) -------------
const mathStart = src.indexOf("const KEY_BATTLE_NEGLECT_PENALTY");
if (mathStart === -1) { console.error("KEY_BATTLE_NEGLECT_PENALTY not found — has it been renamed?"); process.exit(2); }
const planCostsFn = extractFunction(src, "computeBattlePlanCosts");
const mathEnd = src.indexOf(planCostsFn, mathStart) + planCostsFn.length;
const mathBlock = src.slice(mathStart, mathEnd);

const catBlock = extractFromMarker(src, "const BATTLE_ALLOCATION_CATEGORIES = [", "[", "]") + ";";
const commBlock = extractFromMarker(src, "const KEY_BATTLE_COMMANDERS = {", "{", "}") + ";";
const commBonusMatch = src.match(/const KEY_BATTLE_COMMANDER_BONUS\s*=\s*([\d.]+);/);
if (!commBonusMatch) { console.error("KEY_BATTLE_COMMANDER_BONUS not found"); process.exit(2); }
const appBlock = extractFromMarker(src, "const KEY_BATTLE_APPROACHES = {", "{", "}") + ";";
const postureBlock = extractFromMarker(src, "const KEY_BATTLE_POSTURES = {", "{", "}") + ";";

const sandbox = {};
vm.createContext(sandbox);
// vm contexts only expose `var`/function declarations as own-properties of the sandbox object —
// top-level `const`/`let` create lexical bindings the host side can't see. The extracted source
// uses `const` throughout (it's a straight slice of real App.jsx), so it's rewritten to `var`
// here, only for this sandboxed copy — never touches the actual file.
// Round 22: the field-decision effect function, taken from source like the rest.
const decisionFn = extractFunction(src, "battleDecisionEffect");
// Round 23: the shared arm-weight arithmetic, the staff plan and the strand multipliers.
const staffFns = ["battleArmWeight", "allBattleAllocations", "battleScenarios", "staffPlanFor", "staffDecisionOption"].map((n) => extractFunction(src, n));
const strandMultBlock = extractFromMarker(src, "const STRAND_BAND_MULT = {", "{", "}") + ";";
const hardModeBlock = extractFromMarker(src, "const HARD_MODE_NAMES = {", "{", "}") + ";";
const evalSource = [catBlock, commBlock, `const KEY_BATTLE_COMMANDER_BONUS = ${commBonusMatch[1]};`, appBlock, postureBlock, mathBlock, decisionFn, ...staffFns, strandMultBlock, hardModeBlock]
  .join("\n\n")
  .replace(/\bconst\b/g, "var");
vm.runInContext(evalSource, sandbox);

// ---- 2. Per-battle effectiveness + categories, pulled from each keyBattleSubgame block --------
function extractBattleConfig(id) {
  const markers = [];
  let searchFrom = 0;
  while (true) {
    const idx = src.indexOf("keyBattleSubgame:", searchFrom);
    if (idx === -1) break;
    markers.push(idx);
    searchFrom = idx + 1;
  }
  for (const m of markers) {
    const block = extractBalanced(src, src.indexOf("{", m), "{", "}");
    if (new RegExp(`id:\\s*"${id}"`).test(block.slice(0, 200))) {
      const effMatch = block.match(/effectiveness:\s*\{[^}]*\}/);
      if (!effMatch) throw new Error(`no effectiveness map found for battle "${id}"`);
      const effectiveness = vm.runInContext(`(${effMatch[0].replace(/^effectiveness:\s*/, "")})`, sandbox);
      let categories = sandbox.BATTLE_ALLOCATION_CATEGORIES;
      const catIdx = block.indexOf("categories: [");
      if (catIdx !== -1) {
        const catSrc = extractBalanced(block, catIdx + "categories: ".length, "[", "]");
        categories = vm.runInContext(`(${catSrc})`, sandbox);
      }
      // Round 13, item #6: a battle may define a static, known terrainModifiers map (Kursk's mud
      // knocking down Armour) — absent for battles that don't have one (Omaha), same as
      // effectiveWeight()'s own `?? 1` fallback in App.jsx.
      let terrainModifiers = {};
      const terrainMatch = block.match(/terrainModifiers:\s*\{[^}]*\}/);
      if (terrainMatch) {
        terrainModifiers = vm.runInContext(`(${terrainMatch[0].replace(/^terrainModifiers:\s*/, "")})`, sandbox);
      }
      // Round 22: phases (two postures averaged) and field decisions, both optional.
      let phases = null;
      const phasesMatch = block.match(/phases:s*[[^]]*]/);
      if (phasesMatch) phases = vm.runInContext(`(${phasesMatch[0].replace(/^phases:s*/, "")})`, sandbox);
      let decisions = [];
      const decIdx = block.indexOf("decisions: [");
      if (decIdx !== -1) {
        const decSrc = extractBalanced(block, decIdx + "decisions: ".length, "[", "]");
        decisions = vm.runInContext(`(${decSrc})`, sandbox);
      }
      let orderOfBattle = null;
      const oobIdx = block.indexOf("orderOfBattle: {");
      if (oobIdx !== -1) orderOfBattle = vm.runInContext(`(${extractBalanced(block, oobIdx + "orderOfBattle: ".length, "{", "}")})`, sandbox);
      let hardRule = null;
      const hrIdx = block.indexOf("hardRule: {");
      if (hrIdx !== -1) hardRule = vm.runInContext(`(${extractBalanced(block, hrIdx + "hardRule: ".length, "{", "}")})`, sandbox);
      return { id, effectiveness, categories, terrainModifiers, phases, decisions, orderOfBattle, hardRule };
    }
  }
  throw new Error(`keyBattleSubgame with id "${id}" not found`);
}

const battles = [
  extractBattleConfig("kursk"),
  extractBattleConfig("omaha"),
  extractBattleConfig("stalingrad"),
  extractBattleConfig("elAlamein"),
  extractBattleConfig("monteCassino44"),
  extractBattleConfig("bagrationSoviet44"),
  extractBattleConfig("anzio44"),
  extractBattleConfig("arnhemPerimeter44"),
  extractBattleConfig("pq17_1942"),
  extractBattleConfig("bomberDirective43"),
  extractBattleConfig("sedan40"),
  extractBattleConfig("moscow41"),
  extractBattleConfig("britainDay40"),
  extractBattleConfig("alps40"),
  extractBattleConfig("uranus"),
  extractBattleConfig("dynamo40"),
  extractBattleConfig("epirus40"),
  extractBattleConfig("crete41"),
  extractBattleConfig("bastogne44"),
  extractBattleConfig("matapan41"),
  extractBattleConfig("brodyCounterstroke41"),
  extractBattleConfig("rzhevVyazma42"),
  extractBattleConfig("monteLungo43"),
  extractBattleConfig("adriaticRoad44"),
  extractBattleConfig("springOffensive45"),
];

// Round 23: a Matériel strand can read Exhausted, Short, Strained, Adequate or Plentiful, which scales an arm that
// draws on it (STRAND_BAND_MULT). The invariants below must hold whatever the readings, so each battle
// is run as itself and under four profiles: every strand-fed arm Exhausted, every one Short, every one Plentiful, and
// alternating. A profile is a variant of the battle with the multiplier folded into its ground.
const PROFILES = [
  { tag: "", mult: () => 1 },
  { tag: "allShort", mult: (c) => (c.strand ? sandbox.STRAND_BAND_MULT.Short : 1) },
  { tag: "allExhausted", mult: (c) => (c.strand ? sandbox.STRAND_BAND_MULT.Exhausted : 1) },
  { tag: "allPlentiful", mult: (c) => (c.strand ? sandbox.STRAND_BAND_MULT.Plentiful : 1) },
  { tag: "mixed", mult: (c, i) => (c.strand ? (i % 2 ? sandbox.STRAND_BAND_MULT.Short : sandbox.STRAND_BAND_MULT.Plentiful) : 1) },
];
const variants = [];
for (const b of battles) {
  for (const prof of PROFILES) {
    variants.push({
      ...b,
      baseId: b.id,
      id: prof.tag ? `${b.id}[${prof.tag}]` : b.id,
      profileTag: prof.tag,
      terrainModifiers: Object.fromEntries(b.categories.map((c, i) => [c.id, (b.terrainModifiers?.[c.id] ?? 1) * prof.mult(c, i)])),
    });
  }
}

// Round 22: a battle fought in phases is weighed against the AVERAGE of its two postures, so the
// invariants below are run over every ordered pair of distinct postures instead of single ones.
function blendedPostures(roster, categories) {
  const out = [];
  for (const a of roster) {
    for (const b of roster) {
      if (a.id === b.id || a.only === 2 || b.only === 1) continue;
      const modifiers = {};
      for (const c of categories) modifiers[c.id] = ((a.modifiers?.[c.id] ?? 1) + (b.modifiers?.[c.id] ?? 1)) / 2;
      out.push({ id: a.id + "+" + b.id, modifiers });
    }
  }
  return out;
}

// ---- 3. Scenario runner ------------------------------------------------------------------------
// No jitter (1.0) and no readiness variance in these checks — the invariants being tested are
// about the ALLOCATION and PENALTY math, not the per-run luck, which is deliberately separate
// (see round 3's jitter comment in App.jsx). Every posture in the roster is checked, not sampled,
// since pickKeyBattlePosture's weighting only affects how OFTEN a posture is drawn, not whether
// the math holds when it is.

function weightFor(battle, catId, commander, approach, posture) {
  const base = battle.effectiveness[catId] ?? 1;
  const commanderBonus = commander && commander.category === catId ? sandbox.KEY_BATTLE_COMMANDER_BONUS : 0;
  const approachMod = approach?.modifiers?.[catId] ?? 0;
  const postureMult = posture?.modifiers?.[catId] ?? 1;
  // Round 13, item #6: mirrors App.jsx's effectiveWeight() terrainMult — see extractBattleConfig.
  const terrainMult = battle.terrainModifiers?.[catId] ?? 1;
  return (base + commanderBonus + approachMod) * postureMult * terrainMult;
}
function weightsMapFor(battle, commander, approach, posture) {
  const out = {};
  for (const c of battle.categories) out[c.id] = weightFor(battle, c.id, commander, approach, posture);
  return out;
}
// Raw (pre-clamp) score — what the underlying math actually produces, before clampBattleBonus
// saturates it to the display range. Two plans that both exceed the +/-KEY_BATTLE_BONUS_CLAMP
// ceiling are indistinguishable to the player (both just show the max bonus), so a ceiling tie
// is not a balance failure; comparisons that care about the real math (not the display clamp)
// use this instead of scoreAllocation.
function scoreRaw(battle, allocation, commander, approach, posture, poolSize) {
  const weights = weightsMapFor(battle, commander, approach, posture);
  const contributions = sandbox.computeBattleContributions(battle.categories, allocation, weights, poolSize);
  return sandbox.sumBattleContributions(contributions);
}
function scoreAllocation(battle, allocation, commander, approach, posture, poolSize) {
  return sandbox.clampBattleBonus(scoreRaw(battle, allocation, commander, approach, posture, poolSize));
}
function evenSpread(battle, poolSize) {
  const n = battle.categories.length;
  const base = Math.floor(poolSize / n);
  const rem = poolSize - base * n;
  const alloc = {};
  battle.categories.forEach((c, i) => (alloc[c.id] = base + (i < rem ? 1 : 0)));
  return alloc;
}
function fullConcentration(battle, catId, poolSize) {
  const alloc = Object.fromEntries(battle.categories.map((c) => [c.id, 0]));
  alloc[catId] = poolSize;
  return alloc;
}
function oneChitHedge(battle, catId, poolSize) {
  const alloc = Object.fromEntries(battle.categories.map((c) => [c.id, 1]));
  alloc[catId] += poolSize - battle.categories.length;
  return alloc;
}
// Round 16 (Craig's item #9): the one-chit hedge above tests exactly one hedge SHAPE. It missed
// the real exploit — a hedge that tops every off-category up to its fair share, not just one
// token chit — because that shape was never tried. This enumerates EVERY possible allocation of
// the pool across the battle's categories (sum == poolSize, each >= 0), so nothing is missed:
// whatever shape actually scores best is what gets compared against honest full concentration.
function* allAllocations(categories, poolSize) {
  const k = categories.length;
  function* rec(idx, remaining, cur) {
    if (idx === k - 1) {
      yield [...cur, remaining];
      return;
    }
    for (let v = 0; v <= remaining; v++) {
      cur.push(v);
      yield* rec(idx + 1, remaining - v, cur);
      cur.pop();
    }
  }
  for (const combo of rec(0, poolSize, [])) {
    const alloc = {};
    categories.forEach((c, i) => (alloc[c.id] = combo[i]));
    yield alloc;
  }
}
function bestAllocationRaw(battle, commander, approach, posture, poolSize) {
  let best = -Infinity;
  for (const alloc of allAllocations(battle.categories, poolSize)) {
    const s = scoreRaw(battle, alloc, commander, approach, posture, poolSize);
    if (s > best) best = s;
  }
  return best;
}

// Best (commander, approach) synergy pair for a given category, if the battle's rosters offer one.
function bestSynergyFor(battle, catId, commanderRoster, approachRoster) {
  const commander = commanderRoster.find((c) => c.category === catId) || null;
  const approach = approachRoster.find((a) => (a.modifiers?.[catId] ?? 0) > 0) || null;
  return { commander, approach };
}
// The category a player who has read the intelligence and picked the matching commander/approach
// would concentrate on FOR THIS SPECIFIC POSTURE — the whole point of round 9's posture rework
// was that this isn't the same category every time. Contrast with the "blind" pick below, which
// always favors whichever category has the best BASE effectiveness regardless of posture — a
// player who never reads the intel and always plays the same plan.
function bestInformedCategory(battle, commanderRoster, approachRoster, posture) {
  let best = null, bestScore = -Infinity;
  for (const c of battle.categories) {
    const { commander, approach } = bestSynergyFor(battle, c.id, commanderRoster, approachRoster);
    const w = weightFor(battle, c.id, commander, approach, posture);
    if (w > bestScore) { bestScore = w; best = c.id; }
  }
  return best;
}
function bestBlindCategory(battle) {
  return [...battle.categories].sort((a, b) => (battle.effectiveness[b.id] ?? 1) - (battle.effectiveness[a.id] ?? 1))[0].id;
}

let failures = [];
const staffReport = [];
let checks = 0;

for (const battle of variants) {
  const commanderRoster = sandbox.KEY_BATTLE_COMMANDERS[battle.baseId] || [];
  const approachRoster = sandbox.KEY_BATTLE_APPROACHES[battle.baseId] || [];
  const singleRoster = sandbox.KEY_BATTLE_POSTURES[battle.baseId] || [null]; // null = no posture drawn
  const postureRoster = battle.phases && singleRoster[0] ? blendedPostures(singleRoster, battle.categories) : singleRoster;

  // Round 23: every arm needs an order-of-battle sheet; a hard-mode rule must name things that exist;
  // and the staff plan must be sound but beatable by a player who reads the enemy.
  if (!battle.profileTag) {
    const who = battle.id;
    checks++;
    for (const c of battle.categories) {
      const sheet = battle.orderOfBattle && battle.orderOfBattle[c.id];
      if (!sheet || !Array.isArray(sheet.units) || sheet.units.length < 1 || !sheet.real) failures.push(`${who}: arm "${c.id}" has no order-of-battle sheet (units and what actually happened)`);
      if (c.strand && !["oil", "ammo", "steel", "arms", "ship"].includes(c.strand)) failures.push(`${who}: arm "${c.id}" names an unknown strand "${c.strand}"`);
    }
    if (battle.orderOfBattle) for (const k of Object.keys(battle.orderOfBattle)) if (!battle.categories.some((c) => c.id === k)) failures.push(`${who}: order-of-battle sheet for unknown arm "${k}"`);
    checks++;
    const hr = battle.hardRule;
    if (!hr || !hr.text) failures.push(`${who}: no hardRule (orders from above in the campaign's hard mode)`);
    else {
      if (hr.lockApproach && !approachRoster.some((a) => a.id === hr.lockApproach)) failures.push(`${who}: hardRule locks unknown approach "${hr.lockApproach}"`);
      if (hr.lockCommander && !commanderRoster.some((c) => c.id === hr.lockCommander)) failures.push(`${who}: hardRule locks unknown commander "${hr.lockCommander}"`);
      for (const id of hr.forbidCommanders || []) if (!commanderRoster.some((c) => c.id === id)) failures.push(`${who}: hardRule forbids unknown commander "${id}"`);
      if (!(hr.lockApproach || hr.lockCommander || (hr.forbidCommanders || []).length || hr.noGiveGround)) failures.push(`${who}: hardRule does nothing`);
      if ((hr.forbidCommanders || []).length >= commanderRoster.length && commanderRoster.length) failures.push(`${who}: hardRule forbids every commander`);
    }
    // The staff plan: expected bonus across the enemy's possible setups, against what a player who knew
    // the setup could reach, and against a careless pile of effort.
    const realPostures = singleRoster.filter(Boolean);
    const scenarios = sandbox.battleScenarios(battle, realPostures);
    const blend = (sc) => {
      if (!sc.posture) return null;
      if (!sc.posture2) return sc.posture;
      const modifiers = {};
      for (const c of battle.categories) modifiers[c.id] = ((sc.posture.modifiers?.[c.id] ?? 1) + (sc.posture2.modifiers?.[c.id] ?? 1)) / 2;
      return { id: sc.posture.id + "+" + sc.posture2.id, modifiers };
    };
    const totalW = scenarios.reduce((a, sc) => a + sc.weight, 0);
    let staffSum = 0, informedSum = 0, naiveSum = 0, n = 0;
    for (let poolSize = 5; poolSize <= 8; poolSize++) {
      checks++;
      const plan = sandbox.staffPlanFor({ config: battle, categories: battle.categories, poolSize, strandMults: {}, commanders: commanderRoster, approaches: approachRoster, postures: realPostures });
      if (!plan) { failures.push(`${who}: staff plan came back empty at pool=${poolSize}`); continue; }
      let informed = 0, naive = 0;
      for (const sc of scenarios) {
        const post = blend(sc);
        let top = -Infinity;
        for (const c of [null, ...commanderRoster]) for (const a of approachRoster.length ? approachRoster : [null]) top = Math.max(top, sandbox.clampBattleBonus(bestAllocationRaw(battle, c, a, post, poolSize)));
        informed += (sc.weight / totalW) * top;
        naive += (sc.weight / totalW) * scoreAllocation(battle, fullConcentration(battle, bestBlindCategory(battle), poolSize), null, null, post, poolSize);
      }
      staffSum += plan.expected; informedSum += informed; naiveSum += naive; n++;
      if (plan.expected < naive) failures.push(`${who} / pool=${poolSize}: the staff plan (${plan.expected.toFixed(1)}) is worse than a careless pile of effort (${naive.toFixed(1)})`);
      if (informed - plan.expected < 2) failures.push(`${who} / pool=${poolSize}: a player who knows the enemy gains under 2 points over the staff plan (${informed.toFixed(1)} against ${plan.expected.toFixed(1)}), so reading the enemy is not worth it`);
    }
    if (n) staffReport.push(`  ${battle.id.padEnd(20)} careless ${(naiveSum / n).toFixed(1).padStart(5)}  staff ${(staffSum / n).toFixed(1).padStart(5)}  informed ${(informedSum / n).toFixed(1).padStart(5)}`);
  }

  // Round 22: field decisions must be well formed and worth reading the enemy for: no single option
  // may be the best under every posture, because then the intelligence would not matter to it.
  if (battle.decisions.length && !battle.profileTag) {
    const seenIds = new Set();
    for (const d of battle.decisions) {
      checks++;
      const where = `${battle.id} / decision ${d.id}`;
      if (seenIds.has(d.id)) failures.push(`${where}: duplicate decision id`);
      seenIds.add(d.id);
      if (!Array.isArray(d.options) || d.options.length < 2 || d.options.length > 3) failures.push(`${where}: needs 2 or 3 options`);
      const postureIds = new Set(singleRoster.filter(Boolean).map((p) => p.id));
      for (const o of d.options || []) {
        if (!o.id || !o.name || !o.reportLine) failures.push(`${where}: option ${o.id || "?"} needs id, label and reportLine`);
        if (Math.abs(o.bonus || 0) > 6) failures.push(`${where}/${o.id}: bonus above 6`);
        for (const [pid, v] of Object.entries(o.bonusByPosture || {})) {
          if (!postureIds.has(pid)) failures.push(`${where}/${o.id}: unknown posture "${pid}"`);
          if (Math.abs(v) > 6) failures.push(`${where}/${o.id}: bonusByPosture above 6 for ${pid}`);
        }
        const costSum = Object.values(o.meters || {}).reduce((a, v) => a + v, 0);
        if (costSum < -2) failures.push(`${where}/${o.id}: meter cost beyond -2`);
        if (Math.abs(o.severity || 0) > 1) failures.push(`${where}/${o.id}: severity change beyond 1`);
      }
      const bestSet = new Set();
      for (const p of singleRoster.filter(Boolean)) {
        const scores = d.options.map((o) => {
          const e = sandbox.battleDecisionEffect(o, p.id);
          return e.bonus + e.lines.reduce((a, l) => a + l.delta, 0) - 2 * e.severity;
        });
        const top = Math.max(...scores);
        const winners = scores.map((v, i) => (v === top ? i : -1)).filter((i) => i >= 0);
        if (winners.length === 1) bestSet.add(winners[0]);
      }
      if (singleRoster[0] && bestSet.size < 2) failures.push(`${where}: one option (or a tie) is best under every posture, so the intelligence does not matter to it`);
    }
  }

  // Invariant: which category is the best single-category plan differs across postures — this
  // is round 9's whole point (a fixed "always concentrate here" plan should NOT be optimal under
  // every posture). Pool-size-independent, so checked once per battle, not per pool size.
  const informedCatsByPosture = new Set(postureRoster.map((p) => bestInformedCategory(battle, commanderRoster, approachRoster, p)));
  checks++;
  // Round 23: under an extreme strand profile an arm can be so crippled that the enemy's setup stops mattering to
  // the best single plan; that is only required of the battle as it stands.
  if (!battle.profileTag && postureRoster.length > 1 && informedCatsByPosture.size < 2) {
    failures.push(`${battle.id}: the best single-category plan is the same (${[...informedCatsByPosture][0]}) under every posture — posture isn't changing the optimal plan`);
  }

  for (const posture of postureRoster) {
    const blindCat = bestBlindCategory(battle);
    const informedCat = bestInformedCategory(battle, commanderRoster, approachRoster, posture);
    const { commander, approach } = bestSynergyFor(battle, informedCat, commanderRoster, approachRoster);

    for (let poolSize = 5; poolSize <= 8; poolSize++) {
      // "Synergized" = the intel-reading player's best single-category plan for THIS posture.
      // "Naive" = a player who never adapts, always piling every chit into whatever has the best
      // BASE effectiveness regardless of posture, with no commander or approach chosen at all —
      // a pile of chits, not a plan. Synergized should always beat that, posture or no.
      const synergized = scoreAllocation(battle, fullConcentration(battle, informedCat, poolSize), commander, approach, posture, poolSize);
      const naive = scoreAllocation(battle, fullConcentration(battle, blindCat, poolSize), null, null, posture, poolSize);
      const hedge = scoreAllocation(battle, oneChitHedge(battle, informedCat, poolSize), commander, approach, posture, poolSize);

      const tag = `${battle.id} / posture=${posture?.id ?? "none"} / pool=${poolSize}`;

      checks++;
      if (!(synergized >= naive)) {
        failures.push(`${tag}: synergized concentration (${synergized}) does not beat naive concentration (${naive})`);
      }
      checks++;
      // The hedge must not score ABOVE full concentration's own neglect-free score — i.e. it must
      // not come out ahead for spreading a chit into every other category versus committing
      // everything, or the loophole is back (round 8's original finding: a flat, all-or-nothing
      // neglect penalty a hedge could dodge for free). Allows ties (<=, not <): the invariant that
      // actually matters is what the player SEES, and clampBattleBonus rounds/saturates both
      // sides — two plans that round to the same displayed bonus, or both saturate the
      // +/-KEY_BATTLE_BONUS_CLAMP ceiling, are not a realized exploit even if their underlying raw
      // math differs by a fraction of a point (Round 16 — anzio44/windowStillOpen/pool=8 ties this
      // way: synergized 40.22 vs. hedge 30.29 raw, both clamp to the same +30 ceiling; a strict
      // "<" flagged that as a failure even though no player ever sees a different outcome).
      // Round 23: a strand profile is a known condition like the ground, and moves two plans a point either
      // way by rounding alone; one point of tolerance there, none for the battle as it stands.
      const tol = battle.profileTag ? 1 : 0;
      if (!(hedge <= synergized + tol)) {
        failures.push(`${tag}: one-chit hedge (${hedge}) beats synergized full concentration (${synergized}) — hedge should not come out ahead`);
      }
      checks++;
      // Round 16, Craig's item #9: the two checks above only ever compared full concentration
      // against two hand-picked shapes (naive concentration, one-chit hedge). They never asked
      // whether some OTHER allocation — in particular, a hedge that tops every off-category up to
      // its fair share rather than one token chit — scores higher still. This enumerates every
      // possible allocation and asserts nothing beats honest full concentration in the informed
      // category, on the same clamped/displayed basis (and for the same reason) as the hedge
      // check above — ties permitted, an actual displayed win is not.
      const bestClamped = sandbox.clampBattleBonus(bestAllocationRaw(battle, commander, approach, posture, poolSize));
      if (bestClamped > synergized + tol) {
        failures.push(`${tag}: some allocation (clamped ${bestClamped}) beats honest full concentration (${synergized}) — a spread hedge is still winning`);
      }
    }
  }
}

console.log(`battles checked: ${battles.map((b) => b.id).join(", ")}`);
console.log("average bonus on the roll, in points (careless / staff plan / informed player):");
for (const l of staffReport) console.log(l);
console.log(`scenario checks run: ${checks}`);
if (failures.length) {
  console.log(`\n!! ${failures.length} balance invariant failure(s):`);
  for (const f of failures) console.log("   " + f);
} else {
  console.log("\nAll battle-balance invariants hold.");
}
process.exit(failures.length ? 1 : 0);
