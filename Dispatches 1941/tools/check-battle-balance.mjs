// check-battle-balance.mjs
//
// Regression test for the Order of Battle's allocation math and for the content of every Pacific battle (ported from 1940's
// check-battle-balance.js). It does not reimplement the math: it evaluates the game's own source (src/parts/25-battle-subgame.jsx, the
// engine and its registries, and 26-battles-pacific.jsx, the battles) in a sandbox, so a change to either fails here instead of shipping.
//
// Invariants, for every battle x every enemy setup x every pool size (5-8), and again under four strand profiles (every strand-fed arm at
// its worst reading, at its best, and alternating):
//   1. The best single-arm plan differs across setups (reading the enemy matters).
//   2. A synergized concentration (right commander and approach) is at least as good as a careless pile of effort.
//   3. A one-chit hedge never beats honest concentration.
//   4. No allocation at all beats honest concentration in the informed arm (exhaustive over every way to place the pool).
// And for content: every arm has an order-of-battle sheet; the hard-mode rule names things that exist; the staff plan is sound but
// beatable by a player who reads the enemy; field decisions are well formed and none is best under every setup; the registries, titles and
// hosting choice agree with the config; the two outcomes exist and the first is the win.
import { readFileSync } from "node:fs";
import vm from "node:vm";

const read = (p) => readFileSync(new URL(`../src/parts/${p}.jsx`, import.meta.url), "utf8");
const source = [read("25-battle-subgame"), read("26-battles-pacific")].join("\n\n").replace(/\bconst\b/g, "var");
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source, sandbox);
// `var` declarations become properties of the sandbox; the const-turned-var registries and functions are all reachable.
const S = sandbox;

const failures = [];
let checks = 0;
const fail = (m) => failures.push(m);

const configs = Object.values(S.KEY_BATTLE_CONFIGS);
if (!configs.length) fail("no battles are registered");

// How a strand reading's level scales an arm (STRAND_LEVEL_MULT). Profiles: as it stands, all worst, all best, alternating.
const worst = S.STRAND_LEVEL_MULT[0];
const best = S.STRAND_LEVEL_MULT[4];
const PROFILES = [
  { tag: "", mult: () => 1 },
  { tag: "allWorst", mult: (c) => (c.strand ? worst : 1) },
  { tag: "allBest", mult: (c) => (c.strand ? best : 1) },
  { tag: "mixed", mult: (c, i) => (c.strand ? (i % 2 ? worst : best) : 1) },
];
if (worst < 0.85) fail(`STRAND_LEVEL_MULT worst band is ${worst}; below 0.85 an arm can be crippled by its reading alone`);

const variants = [];
for (const b of configs) {
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

function weightFor(battle, catId, commander, approach, posture) {
  const base = battle.effectiveness[catId] ?? 1;
  const commanderBonus = commander && commander.category === catId ? S.KEY_BATTLE_COMMANDER_BONUS : 0;
  const approachMod = approach?.modifiers?.[catId] ?? 0;
  const postureMult = posture?.modifiers?.[catId] ?? 1;
  const terrainMult = battle.terrainModifiers?.[catId] ?? 1;
  return (base + commanderBonus + approachMod) * postureMult * terrainMult;
}
function weightsMapFor(battle, commander, approach, posture) {
  return Object.fromEntries(battle.categories.map((c) => [c.id, weightFor(battle, c.id, commander, approach, posture)]));
}
function scoreRaw(battle, allocation, commander, approach, posture, poolSize) {
  const contributions = S.computeBattleContributions(battle.categories, allocation, weightsMapFor(battle, commander, approach, posture), poolSize);
  return S.sumBattleContributions(contributions);
}
const scoreAllocation = (...a) => S.clampBattleBonus(scoreRaw(...a));
const fullConcentration = (battle, catId, poolSize) => {
  const alloc = Object.fromEntries(battle.categories.map((c) => [c.id, 0]));
  alloc[catId] = poolSize;
  return alloc;
};
const oneChitHedge = (battle, catId, poolSize) => {
  const alloc = Object.fromEntries(battle.categories.map((c) => [c.id, 1]));
  alloc[catId] += poolSize - battle.categories.length;
  return alloc;
};
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
  let top = -Infinity;
  for (const alloc of allAllocations(battle.categories, poolSize)) top = Math.max(top, scoreRaw(battle, alloc, commander, approach, posture, poolSize));
  return top;
}
function bestSynergyFor(catId, commanderRoster, approachRoster) {
  return {
    commander: commanderRoster.find((c) => c.category === catId) || null,
    approach: approachRoster.find((a) => (a.modifiers?.[catId] ?? 0) > 0) || null,
  };
}
function bestInformedCategory(battle, commanderRoster, approachRoster, posture) {
  let bestCat = null;
  let bestScore = -Infinity;
  for (const c of battle.categories) {
    const { commander, approach } = bestSynergyFor(c.id, commanderRoster, approachRoster);
    const w = weightFor(battle, c.id, commander, approach, posture);
    if (w > bestScore) {
      bestScore = w;
      bestCat = c.id;
    }
  }
  return bestCat;
}
const bestBlindCategory = (battle) => [...battle.categories].sort((a, b) => (battle.effectiveness[b.id] ?? 1) - (battle.effectiveness[a.id] ?? 1))[0].id;

const STRANDS = ["trn", "flt", "mor", "oil", "shp", "ind", "int", "cmd", "tmp"];
const METERS = ["readiness", "pipeline", "initiative"];
const staffReport = [];

// ---- content: registries, titles, config shape, and agreement with the hosting choices in the campaigns -------------------------
for (const b of configs) {
  const who = b.id;
  checks++;
  const commanders = S.KEY_BATTLE_COMMANDERS[b.id] || [];
  const approaches = S.KEY_BATTLE_APPROACHES[b.id] || [];
  const postures = S.KEY_BATTLE_POSTURES[b.id] || [];
  const echoes = S.KEY_BATTLE_ECHOES[b.id];
  const catIds = new Set(b.categories.map((c) => c.id));
  if (b.categories.length < 3 || b.categories.length > 5) fail(`${who}: ${b.categories.length} arms; the planning screen is laid out for 3 to 5`);
  if (commanders.length < 2) fail(`${who}: needs at least two commanders`);
  if (approaches.length !== 2) fail(`${who}: needs exactly two approaches (has ${approaches.length})`);
  if (postures.length < 2) fail(`${who}: needs at least two enemy setups`);
  if (!echoes || !echoes.counter || !echoes.neglected || !echoes.commander) fail(`${who}: missing next-report echoes`);
  if (!S.KEY_BATTLE_TITLES.some((t) => t.id === b.id)) fail(`${who}: not listed in KEY_BATTLE_TITLES`);
  for (const c of b.categories) {
    if (!METERS.includes(c.meter)) fail(`${who}: arm "${c.id}" names unknown meter "${c.meter}"`);
    if (c.strand && !STRANDS.includes(c.strand)) fail(`${who}: arm "${c.id}" names unknown reading "${c.strand}"`);
    if (typeof b.effectiveness[c.id] !== "number") fail(`${who}: arm "${c.id}" has no effectiveness`);
    for (const k of ["categoryContext", "flashups", "idleLines"]) if (!b[k] || !b[k][c.id]) fail(`${who}: arm "${c.id}" missing from ${k}`);
    if ((b.flashups?.[c.id] || []).length < 4) fail(`${who}: arm "${c.id}" needs at least four flash-ups`);
    if ((b.idleLines?.[c.id] || []).length < 2) fail(`${who}: arm "${c.id}" needs at least two idle lines`);
    if (echoes && !echoes.neglected?.[c.id]) fail(`${who}: no "neglected" echo for arm "${c.id}"`);
  }
  for (const c of commanders) {
    if (!catIds.has(c.category)) fail(`${who}: commander ${c.id} is tied to unknown arm "${c.category}"`);
    if (!c.name || !c.role || !c.note || !c.reportLine) fail(`${who}: commander ${c.id} needs name, role, note and reportLine`);
    if (echoes && !echoes.commander?.[c.id]) fail(`${who}: no echo for commander ${c.id}`);
  }
  for (const a of approaches) {
    for (const k of Object.keys(a.modifiers || {})) if (!catIds.has(k)) fail(`${who}: approach ${a.id} modifies unknown arm "${k}"`);
    if (!a.name || !a.note || !a.reportLine) fail(`${who}: approach ${a.id} needs name, note and reportLine`);
  }
  for (const p of postures) {
    for (const k of Object.keys(p.modifiers || {})) if (!catIds.has(k)) fail(`${who}: setup ${p.id} modifies unknown arm "${k}"`);
    if ((p.hints || []).length < 2 || !p.reveal) fail(`${who}: setup ${p.id} needs two hints and a reveal`);
  }
  const ct = b.counterattack;
  if (ct) {
    if (!catIds.has(ct.category)) fail(`${who}: counterattack names unknown arm "${ct.category}"`);
    for (const k of Object.keys(ct.severity || {})) if (!postures.some((p) => p.id === k)) fail(`${who}: counterattack severity names unknown setup "${k}"`);
    for (const r of ["repulsed", "heldAtCost", "broke", "gaveGround"]) {
      if (!ct.results?.[r]) fail(`${who}: counterattack has no "${r}" result`);
      if (echoes && !echoes.counter?.[r]) fail(`${who}: no echo for counterattack result "${r}"`);
    }
  }
  if (!b.verdicts || b.verdicts.length !== 2) fail(`${who}: needs two verdict titles`);
  for (const g of ["clean", "costly", "marginal", "total"]) if (!b.verdictGrades?.[g]) fail(`${who}: no verdict text for grade "${g}"`);
  if (!b.reportTimes || !b.reportTimes.cats || b.reportTimes.cats.length < b.categories.length) fail(`${who}: reportTimes.cats needs a time for each arm`);
}

// The hosting choices in the campaigns: the config must be attached to a choice with two uncertain outcomes, the first of which is the win.
{
  const { loadGame } = await import("./audit-lib.mjs");
  const game = await loadGame();
  const found = new Set();
  for (const [cid, camp] of Object.entries(game.CAMPAIGNS)) {
    for (const id of (game.NODE_ATLAS[cid] || []).map((n) => n.id)) {
      // Resolved with a mid-game state so every conditional branch of the situation text is exercised at least once.
      let stage;
      try {
        stage = camp.resolveNode(id, game.logic.startFlags("open"), { ...game.logic.EMPTY_METERS });
      } catch (e) {
        continue;
      }
      for (const [ci, ch] of (stage?.choices || []).entries()) {
        if (!ch.keyBattleSubgame) continue;
        checks++;
        const cfg = ch.keyBattleSubgame;
        found.add(cfg.id);
        if (!S.KEY_BATTLE_CONFIGS[cfg.id]) fail(`${camp.id}/${id}[${ci}]: hosts "${cfg.id}", which is not in KEY_BATTLE_CONFIGS`);
        if (!ch.uncertain || ch.uncertain.length !== 2) fail(`${camp.id}/${id}[${ci}]: a battle needs exactly two outcomes`);
        else if (ch.uncertain[0].impact && ch.uncertain[1].impact) {
          const sum = (u) => Object.values(u.impact).reduce((a, v) => a + v, 0);
          if (sum(ch.uncertain[0]) <= sum(ch.uncertain[1])) fail(`${camp.id}/${id}[${ci}]: the first outcome (the win) is not better than the second`);
        }
        const seal = S.KEY_BATTLE_TITLES.find((t) => t.id === cfg.id)?.seal;
        if (seal && seal !== camp.seal) fail(`${camp.id}/${id}[${ci}]: title lists seal ${seal}, campaign is ${camp.seal}`);
      }
    }
  }
  for (const b of configs) if (!found.has(b.id)) fail(`${b.id}: no choice in any campaign hosts this battle`);
}

// ---- the math ------------------------------------------------------------------------------------------------------------------
for (const battle of variants) {
  const commanderRoster = S.KEY_BATTLE_COMMANDERS[battle.baseId] || [];
  const approachRoster = S.KEY_BATTLE_APPROACHES[battle.baseId] || [];
  const singleRoster = S.KEY_BATTLE_POSTURES[battle.baseId] || [null];
  const postureRoster = battle.phases && singleRoster[0] ? blendedPostures(singleRoster, battle.categories) : singleRoster;

  if (!battle.profileTag) {
    const who = battle.id;
    checks++;
    for (const c of battle.categories) {
      const sheet = battle.orderOfBattle && battle.orderOfBattle[c.id];
      if (!sheet || !Array.isArray(sheet.units) || sheet.units.length < 1 || !sheet.real) fail(`${who}: arm "${c.id}" has no order-of-battle sheet (units and what actually happened)`);
    }
    if (battle.orderOfBattle) for (const k of Object.keys(battle.orderOfBattle)) if (!battle.categories.some((c) => c.id === k)) fail(`${who}: order-of-battle sheet for unknown arm "${k}"`);
    checks++;
    const hr = battle.hardRule;
    if (!hr || !hr.text) fail(`${who}: no hardRule (orders from above in the campaign's hard mode)`);
    else {
      if (hr.lockApproach && !approachRoster.some((a) => a.id === hr.lockApproach)) fail(`${who}: hardRule locks unknown approach "${hr.lockApproach}"`);
      if (hr.lockCommander && !commanderRoster.some((c) => c.id === hr.lockCommander)) fail(`${who}: hardRule locks unknown commander "${hr.lockCommander}"`);
      for (const id of hr.forbidCommanders || []) if (!commanderRoster.some((c) => c.id === id)) fail(`${who}: hardRule forbids unknown commander "${id}"`);
      if (!(hr.lockApproach || hr.lockCommander || (hr.forbidCommanders || []).length || hr.noGiveGround)) fail(`${who}: hardRule does nothing`);
      if ((hr.forbidCommanders || []).length >= commanderRoster.length && commanderRoster.length) fail(`${who}: hardRule forbids every commander`);
    }
    // Staff plan: expected bonus across the enemy's possible setups, against what a player who knew the setup could reach, and a careless pile.
    const realPostures = singleRoster.filter(Boolean);
    const scenarios = S.battleScenarios(battle, realPostures);
    const blend = (sc) => {
      if (!sc.posture) return null;
      if (!sc.posture2) return sc.posture;
      const modifiers = {};
      for (const c of battle.categories) modifiers[c.id] = ((sc.posture.modifiers?.[c.id] ?? 1) + (sc.posture2.modifiers?.[c.id] ?? 1)) / 2;
      return { id: sc.posture.id + "+" + sc.posture2.id, modifiers };
    };
    const totalW = scenarios.reduce((a, sc) => a + sc.weight, 0);
    let staffSum = 0;
    let informedSum = 0;
    let naiveSum = 0;
    let n = 0;
    for (let poolSize = 5; poolSize <= 8; poolSize++) {
      checks++;
      const plan = S.staffPlanFor({ config: battle, categories: battle.categories, poolSize, strandMults: {}, commanders: commanderRoster, approaches: approachRoster, postures: realPostures });
      if (!plan) {
        fail(`${who}: staff plan came back empty at pool=${poolSize}`);
        continue;
      }
      let informed = 0;
      let naive = 0;
      for (const sc of scenarios) {
        const post = blend(sc);
        let top = -Infinity;
        for (const c of [null, ...commanderRoster]) for (const a of approachRoster.length ? approachRoster : [null]) top = Math.max(top, S.clampBattleBonus(bestAllocationRaw(battle, c, a, post, poolSize)));
        informed += (sc.weight / totalW) * top;
        naive += (sc.weight / totalW) * scoreAllocation(battle, fullConcentration(battle, bestBlindCategory(battle), poolSize), null, null, post, poolSize);
      }
      staffSum += plan.expected;
      informedSum += informed;
      naiveSum += naive;
      n++;
      if (plan.expected < naive) fail(`${who} / pool=${poolSize}: the staff plan (${plan.expected.toFixed(1)}) is worse than a careless pile of effort (${naive.toFixed(1)})`);
      if (informed - plan.expected < 2) fail(`${who} / pool=${poolSize}: a player who knows the enemy gains under 2 points over the staff plan (${informed.toFixed(1)} against ${plan.expected.toFixed(1)}), so reading the enemy is not worth it`);
    }
    if (n) staffReport.push(`  ${battle.id.padEnd(20)} careless ${(naiveSum / n).toFixed(1).padStart(5)}  staff ${(staffSum / n).toFixed(1).padStart(5)}  informed ${(informedSum / n).toFixed(1).padStart(5)}`);

    // Field decisions: well formed, and worth reading the enemy for (no option best under every setup).
    const seenIds = new Set();
    for (const d of battle.decisions || []) {
      checks++;
      const where = `${who} / decision ${d.id}`;
      if (seenIds.has(d.id)) fail(`${where}: duplicate decision id`);
      seenIds.add(d.id);
      if (!Array.isArray(d.options) || d.options.length < 2 || d.options.length > 3) fail(`${where}: needs 2 or 3 options`);
      const postureIds = new Set(realPostures.map((p) => p.id));
      for (const o of d.options || []) {
        if (!o.id || !o.name || !o.reportLine) fail(`${where}: option ${o.id || "?"} needs id, name and reportLine`);
        if (Math.abs(o.bonus || 0) > 6) fail(`${where}/${o.id}: bonus above 6`);
        for (const [pid, v] of Object.entries(o.bonusByPosture || {})) {
          if (!postureIds.has(pid)) fail(`${where}/${o.id}: unknown setup "${pid}"`);
          if (Math.abs(v) > 6) fail(`${where}/${o.id}: bonusByPosture above 6 for ${pid}`);
        }
        const costSum = Object.values(o.meters || {}).reduce((a, v) => a + v, 0);
        if (costSum < -2) fail(`${where}/${o.id}: meter cost beyond -2`);
        for (const m of Object.keys(o.meters || {})) if (!METERS.includes(m)) fail(`${where}/${o.id}: cost names unknown meter "${m}"`);
        if (Math.abs(o.severity || 0) > 1) fail(`${where}/${o.id}: severity change beyond 1`);
      }
      const bestSet = new Set();
      for (const p of realPostures) {
        const scores = d.options.map((o) => {
          const e = S.battleDecisionEffect(o, p.id);
          return e.bonus + e.lines.reduce((a, l) => a + l.delta, 0) - 2 * e.severity;
        });
        const top = Math.max(...scores);
        const winners = scores.map((v, i) => (v === top ? i : -1)).filter((i) => i >= 0);
        if (winners.length === 1) bestSet.add(winners[0]);
      }
      if (realPostures.length && bestSet.size < 2) fail(`${where}: one option (or a tie) is best under every setup, so the intelligence does not matter to it`);
    }
  }

  const informedCatsByPosture = new Set(postureRoster.map((p) => bestInformedCategory(battle, commanderRoster, approachRoster, p)));
  checks++;
  if (!battle.profileTag && postureRoster.length > 1 && informedCatsByPosture.size < 2) {
    fail(`${battle.id}: the best single-arm plan is the same (${[...informedCatsByPosture][0]}) under every setup, so the setup is not changing the best plan`);
  }

  for (const posture of postureRoster) {
    const blindCat = bestBlindCategory(battle);
    const informedCat = bestInformedCategory(battle, commanderRoster, approachRoster, posture);
    const { commander, approach } = bestSynergyFor(informedCat, commanderRoster, approachRoster);
    for (let poolSize = 5; poolSize <= 8; poolSize++) {
      const synergized = scoreAllocation(battle, fullConcentration(battle, informedCat, poolSize), commander, approach, posture, poolSize);
      const naive = scoreAllocation(battle, fullConcentration(battle, blindCat, poolSize), null, null, posture, poolSize);
      const hedge = scoreAllocation(battle, oneChitHedge(battle, informedCat, poolSize), commander, approach, posture, poolSize);
      const tag = `${battle.id} / setup=${posture?.id ?? "none"} / pool=${poolSize}`;
      const tol = battle.profileTag ? 1 : 0;
      checks += 3;
      if (!(synergized >= naive)) fail(`${tag}: synergized concentration (${synergized}) does not beat naive concentration (${naive})`);
      if (!(hedge <= synergized + tol)) fail(`${tag}: one-chit hedge (${hedge}) beats synergized full concentration (${synergized})`);
      const bestClamped = S.clampBattleBonus(bestAllocationRaw(battle, commander, approach, posture, poolSize));
      if (bestClamped > synergized + tol) fail(`${tag}: some allocation (clamped ${bestClamped}) beats honest full concentration (${synergized}), so a spread hedge is still winning`);
    }
  }
}

console.log(`battles checked: ${configs.map((b) => b.id).join(", ")}`);
console.log("average bonus on the roll, in points (careless / staff plan / informed player):");
for (const l of staffReport) console.log(l);
console.log(`checks run: ${checks}`);
if (failures.length) {
  console.log(`\n!! ${failures.length} battle failure(s):`);
  for (const f of failures) console.log("   " + f);
  process.exit(1);
}
console.log("\nAll battle checks hold.");
