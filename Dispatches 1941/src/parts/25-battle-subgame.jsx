// The Order of Battle (Key Battle) subgame, ported from Dispatches 1940. A major battle can be fought on its own screen: the player
// commits a pool of effort across the battle's arms, picks a commander and an approach, and meets one of several enemy setups the
// intelligence may or may not have read right. The plan nudges the roll of the choice that hosts the battle (see subgameWeights in
// logic.ts) and costs the meters (computeBattlePlanCosts). Battles are registered below: KEY_BATTLE_COMMANDERS, _APPROACHES, _POSTURES,
// _ECHOES and _TITLES are keyed by the battle's id (the `id` of the hosting choice's `keyBattleSubgame`).
// The hosting choice's FIRST outcome is the win. A battle must have exactly two outcomes.

const BATTLE_ALLOCATION_CATEGORIES = [
  { id: "fleet", name: "Carriers & Battleships", meter: "readiness", strand: "flt" },
  { id: "air", name: "Air Groups", meter: "readiness", strand: "trn" },
  { id: "escorts", name: "Cruisers & Destroyers", meter: "readiness", strand: "mor" },
  { id: "supply", name: "Supply & Logistics", meter: "pipeline", strand: "shp" },
];

// Commanders available to the player, per battle: { id, name, role, category, note }. The category is the arm the officer's
// real command gives a bonus (KEY_BATTLE_COMMANDER_BONUS).
const KEY_BATTLE_COMMANDERS = {};
const KEY_BATTLE_COMMANDER_BONUS = 0.8;

// Approaches, per battle: { id, name, note, modifiers: { <category id>: bonus } }.
const KEY_BATTLE_APPROACHES = {};

// Enemy setups, per battle: { id, name, intel, modifiers: { <category id>: multiplier }, weight, only }.
const KEY_BATTLE_POSTURES = {};

const KEY_BATTLE_NEGLECT_PENALTY = 1.5;
const KEY_BATTLE_RESERVE_MULT = 0.75;
const KEY_BATTLE_BONUS_CLAMP = 30;

// Round 10 (item 7): postures can carry a `weight` (default 1) — Omaha's historical posture is
// drawn twice as often as either alternative.
function pickKeyBattlePosture(battleId, excludeId, phase) {
  // Round 22: a battle with phases (config.phases) draws a second posture for its second phase,
  // never the same one twice. excludeId is undefined for every ordinary battle, so nothing about
  // the first draw changes for them.
  // A posture can be tied to one phase (only: 1 or 2): a second wave cannot open the day.
  const roster = (KEY_BATTLE_POSTURES[battleId] || []).filter(
    (p) => (!excludeId || p.id !== excludeId) && (!phase || !p.only || p.only === phase)
  );
  if (!roster.length) return null;
  const total = roster.reduce((a, p) => a + (p.weight || 1), 0);
  let r = Math.random() * total;
  for (const p of roster) {
    r -= p.weight || 1;
    if (r <= 0) return p;
  }
  return roster[roster.length - 1];
}

// Round 10, Craig's item #4: the staff assessment's reliability scales with Initiative at the
// moment you ask — his own example, "9 initiative 90% accuracy." Floored at 10% so a staff
// that is badly behind events still occasionally gets it right, capped at 95% so it never
// becomes a guarantee. The free intelligence summary is wrong a flat 1 time in 4.
const KEY_BATTLE_INTEL_ERROR_RATE = 0.25;
// Round 13, Craig's item #3 ("intel as a spendable resource"): a second, PAID look at the same
// hidden posture, priced the same way the staff assessment is (1 Initiative) and reusing that
// same "spend a scarce meter for a materially better read, never a certainty" shape — sharper
// than the free hint (1-in-10 wrong, not 1-in-4) but still not perfect, so a Recon Pass narrows
// the odds of being fooled rather than removing the risk outright. See requestRecon.
const KEY_BATTLE_RECON_ERROR_RATE = 0.1;
function staffReliability(initiative) {
  return Math.max(10, Math.min(95, (initiative || 0) * 10));
}
const STAFF_VERDICT_BANDS = ["strong", "sound", "thin", "a mistake"];

// Round 10, Craig's item #8: how the battle was fought carries into the next node. chooseOption
// writes `${battleId}Counter`, `${battleId}PlanNeglected` and `${battleId}PlanCommander` flags
// (dev build only — the subgame is the only thing that sets them), and the next node's
// situation text appends at most two of these lines: what happened with the counterattack, then
// either the arm that was left uncovered or, if none was, the commander's lingering mark.
// Past tense is right here: by the next node, this is the player's own history.

// What the next report says about how the battle was fought: { counter: {...}, neglected: {...}, commander: {...} } per battle.
const KEY_BATTLE_ECHOES = {};

// The battles, in campaign order, with the campaign seal each belongs to (the war record lists them by name).
const KEY_BATTLE_TITLES = [];

const BATTLE_GRADE_ORDER = ["total", "marginal", "costly", "clean"]; // worst to best

function keyBattleEcho(echoId, flags, battleId) {
  const E = KEY_BATTLE_ECHOES[echoId];
  const id = battleId || echoId;
  if (!E) return "";
  const parts = [];
  const counter = flags[`${id}Counter`];
  if (counter && E.counter[counter]) parts.push(E.counter[counter]);
  const neglected = flags[`${id}PlanNeglected`];
  const commander = flags[`${id}PlanCommander`];
  if (neglected && E.neglected[neglected]) parts.push(E.neglected[neglected]);
  else if (commander && E.commander[commander]) parts.push(E.commander[commander]);
  return parts.length ? " " + parts.join(" ") : "";
}

function keyBattleCategories(config) {
  return (config && config.categories) || BATTLE_ALLOCATION_CATEGORIES;
}

function computeBattleContributions(categories, plan, weights, poolSize, reserve) {
  const res = reserve || {};
  const spent = categories.reduce((a, c) => a + (plan[c.id] || 0) + (res[c.id] || 0), 0);
  // Round 12: fair share is what an even split of the pool would give each category. Below it,
  // a category owes a penalty graded by the shortfall, linearly (Round 16 — see the comments
  // above this function and on the penalty line below); at or above it, nothing.
  const fairShare = poolSize / categories.length;
  const out = {};
  for (const c of categories) {
    const p = plan[c.id] || 0;
    const r = res[c.id] || 0;
    const finalCount = p + r;
    const value = finalCount > 0 ? (p + r * KEY_BATTLE_RESERVE_MULT) * (weights[c.id] || 0) : 0;
    let penalty = 0;
    if (spent >= poolSize / 2 && finalCount < fairShare) {
      // Round 16 superseded the 1/4-power curve this comment used to describe — see the
      // Round 16 comment above this function for why. Short version: that curve's own concavity
      // made the LAST chit before fair share worth far more than its raw weight (it bought back
      // almost the whole remaining penalty at once), which a "top everyone up to fair share, dump
      // the leftover" plan could exploit for a bigger net gain than the one-chit hedge the old
      // check screened for. Linear removes that: every missing chit costs the same fixed slice of
      // KEY_BATTLE_NEGLECT_PENALTY, first or last, so there's no crossing point worth camping on.
      // The earlier note that "linear lets the one-chit hedge win" was true at the OLD constant
      // (4.5) — raising a linear penalty's constant to compensate for the shape change is what
      // widened the hedge's margin back then. It was never linear-vs-power that mattered; it was
      // never re-tuning the constant alongside the shape. 1.5 is the largest constant that clears
      // both the original 250 check-battle-balance.js scenarios AND an exhaustive search over
      // every possible allocation (not just the hand-picked hedge/concentration shapes) across
      // every battle, posture, and pool size 5-8.
      penalty = KEY_BATTLE_NEGLECT_PENALTY * ((fairShare - finalCount) / fairShare);
    }
    out[c.id] = value - penalty;
  }
  return out;
}

function sumBattleContributions(contributions) {
  return Object.values(contributions).reduce((a, v) => a + v, 0);
}

function clampBattleBonus(raw) {
  return Math.max(-KEY_BATTLE_BONUS_CLAMP, Math.min(KEY_BATTLE_BONUS_CLAMP, Math.round(raw)));
}

// Round 9, Craig's item #3 (consequences that depend on the plan, not just the odds). Small,
// legible rules keyed off each category's own `meter`, so they generalize to any battle's
// categories: a category holding at least half the pool costs its meter 1 (you spent that
// resource hard); a WIN with nothing neglected earns +1 Initiative (a coordinated plan leaves
// the staff ahead of events); a reserve of 2+ chits held back and never committed returns +1
// Manpower. Each meter's net plan cost is capped to [-2, +1] so the plan can sting but never
// outweigh the battle's own historical outcome impact (round 27: at most 1 per meter and 2 in all).
function computeBattlePlanCosts({ categories, finalAllocation, poolSize, contributions, won, reservesHeld, counter, extraLines, attrition }) {
  const lines = [];
  // Round 22: costs chosen at a mid-battle decision (extraLines: [{meter, delta, reason}]) and a
  // battle's own attrition rules (attrition: [{category, atLeast, meter, delta, reason}], e.g. the
  // frostbite on the Alps or the cold before Moscow) read exactly like the rules below. They go
  // through the same [-2, +1] cap per meter, so a battle can sting but never outweigh its outcome.
  for (const l of extraLines || []) lines.push({ meter: l.meter, delta: l.delta, reason: l.reason });
  for (const a of attrition || []) {
    if ((finalAllocation[a.category] || 0) >= a.atLeast) lines.push({ meter: a.meter, delta: a.delta, reason: a.reason });
  }
  // Round 10: the counterattack's own cost. Repulsing it is free; holding it at a cost, or
  // being broken, costs the meter of the arm that met it; giving ground costs tempo.
  if (counter && counter.result !== "repulsed") {
    const cat = categories.find((c) => c.id === counter.category);
    if (counter.result === "gaveGround") {
      lines.push({ meter: "initiative", delta: -1, reason: "Gave ground to the counterattack" });
    } else if (cat) {
      lines.push({ meter: cat.meter, delta: -1, reason: `${cat.name} mauled by the counterattack` });
      if (counter.result === "broke") lines.push({ meter: "initiative", delta: -1, reason: "The counterattack broke through" });
    }
  }
  for (const c of categories) {
    if ((finalAllocation[c.id] || 0) >= poolSize / 2) {
      lines.push({ meter: c.meter, delta: -1, reason: `Heavy commitment to ${c.name}` });
    }
  }
  // Round 24 (double jeopardy): an arm left uncovered used to cost its meter a point on a loss as well. The gap has
  // already cost the plan its odds (the neglect penalty) and set the grade, and a loss carries its own impact, so
  // charging it again was charging the same fault three times. A win with nothing neglected still earns the point.
  const neglected = categories.filter((c) => (contributions[c.id] || 0) < 0);
  if (won && neglected.length === 0) {
    lines.push({ meter: "initiative", delta: 1, reason: "A coordinated plan" });
  }
  if (reservesHeld >= 2) lines.push({ meter: "readiness", delta: 1, reason: "Reserve returned intact" });
  const totals = { readiness: 0, pipeline: 0, initiative: 0 };
  for (const l of lines) totals[l.meter] = (totals[l.meter] || 0) + l.delta;
  // Round 27: random play reached -10 within a few decisions once battles charged their plans on top of their own
  // outcomes. A plan now costs a meter at most 1, and a battle's plan takes at most 2 points from the three meters in
  // all (the largest charges are eased first); gains are still capped at +1.
  for (const m of Object.keys(totals)) totals[m] = Math.max(-1, Math.min(1, totals[m]));
  let owed = Object.values(totals).reduce((a, v) => a + Math.min(0, v), 0);
  while (owed < -2) {
    const worst = Object.keys(totals).reduce((a, m) => (totals[m] < totals[a] ? m : a));
    totals[worst] += 1;
    owed += 1;
  }
  // Round 13, Craig's item #1 ("graded outcomes, not strict binary win/lose"). Deliberately NOT a
  // second dice roll or a change to the shared uncertain[] mechanic (that roll is game-wide, used
  // for hundreds of choices — too risky to touch for one subsystem). Instead a quality axis
  // layered on top of the same signals this function already computes for meter costs: a win with
  // nothing neglected and no counterattack cost reads as "clean"; any win that neglected a
  // category or paid for a counterattack reads as "costly" — same battle, different texture. A
  // loss is graded the other way: "marginal" when the plan itself held up (0-1 neglected
  // categories) and the roll simply went the other way — the plan wasn't the problem, the dice
  // were — versus "total" when 2+ categories were left short or the counterattack broke through
  // outright, i.e. the plan itself gave out, not just the roll.
  const grade = won
    ? neglected.length === 0 && (!counter || counter.result === "repulsed")
      ? "clean"
      : "costly"
    : neglected.length >= 2 || (counter && counter.result === "broke")
    ? "total"
    : "marginal";
  return { lines, totals, grade };
}

// Round 22, field decisions (config.decisions). Mid-battle choices written for each battle from
// the real alternatives its day offered. Each option has a flat `bonus` toward the roll, optionally
// an extra `bonusByPosture` for the enemy posture in force when the decision is made (the later
// of the battle's postures, when it has two phases), optional `meters` costs, and an optional
// `severity` change to the counterattack that follows. Pure, so the balance check can run the same
// code the screen does.
function battleDecisionEffect(option, postureId) {
  const byPosture = (option.bonusByPosture && postureId && option.bonusByPosture[postureId]) || 0;
  const lines = Object.entries(option.meters || {}).map(([meter, delta]) => ({
    meter,
    delta,
    reason: option.costReason || option.name,
  }));
  return { bonus: (option.bonus || 0) + byPosture, severity: option.severity || 0, lines };
}

// The campaign hard modes that can put orders from above on a battle (config.hardRule).
const HARD_MODE_NAMES = { fanatical: "Fanatical Resolve Mode", coalition: "Coalition Resolve Mode" };

// How a reading's band (see strandReadout in logic.ts) changes the weight an arm can bring. Each category may name the reading it draws on
// (category.strand with category.meter): aircraft draw on Training, ships on Forces, supply on Shipping. Read once, when the battle screen
// opens, like the pool size. The balance check holds the worst band at 0.85 and fails below it.
const STRAND_LEVEL_MULT = [0.85, 0.85, 0.93, 1, 1.06];

// Weight per effort point for one arm. Pure, so the planning screen, the staff plan and the balance
// check all use the same arithmetic: (jittered base + commander bonus + approach modifier) times the
// enemy posture (the average of the two when a battle has two phases), the ground, and the strand.
function battleArmWeight({ config, catId, jitter, commander, approach, posture, posture2, strandMult }) {
  const base = (config.effectiveness[catId] ?? 1) * (jitter ?? 1);
  const commanderBonus = commander && commander.category === catId ? KEY_BATTLE_COMMANDER_BONUS : 0;
  const approachMod = approach?.modifiers?.[catId] ?? 0;
  const m1 = posture?.modifiers?.[catId] ?? 1;
  const postureMult = posture2 ? (m1 + (posture2.modifiers?.[catId] ?? 1)) / 2 : m1;
  const terrain = config.terrainModifiers?.[catId] ?? 1;
  return (base + commanderBonus + approachMod) * postureMult * terrain * (strandMult ?? 1);
}

// Every way to place exactly `pool` points of effort across the arms.
function allBattleAllocations(categories, pool) {
  const out = [];
  const rec = (i, left, cur) => {
    if (i === categories.length - 1) {
      out.push({ ...cur, [categories[i].id]: left });
      return;
    }
    for (let v = 0; v <= left; v++) rec(i + 1, left - v, { ...cur, [categories[i].id]: v });
  };
  rec(0, pool, {});
  return out;
}

// The enemy setups a battle can be fought against, as scenarios: one posture each, or an ordered
// pair when the battle has two phases (a second-phase-only posture never opens the day).
function battleScenarios(config, postures) {
  if (!postures.length) return [{ posture: null, posture2: null, weight: 1 }];
  if (!config.phases) return postures.map((p) => ({ posture: p, posture2: null, weight: p.weight || 1 }));
  const out = [];
  for (const a of postures) {
    for (const b of postures) {
      if (a.id === b.id || a.only === 2 || b.only === 1) continue;
      out.push({ posture: a, posture2: b, weight: (a.weight || 1) * (b.weight || 1) });
    }
  }
  return out;
}

// "Let your staff plan it". The plan a competent staff would send without knowing what the enemy has
// drawn: the commander, approach and placement of all the effort that does best on average across
// the setups the enemy might show (the historical one counting double where the battle says so). It
// is robust and not clever: it never reads the intelligence, so a player who does can beat it.
function staffPlanFor({ config, categories, poolSize, strandMults, commanders, approaches, postures, commanderRequired }) {
  const scenarios = battleScenarios(config, postures);
  const totalWeight = scenarios.reduce((a, s) => a + s.weight, 0);
  const allocations = allBattleAllocations(categories, poolSize);
  let best = null;
  // The staff name no favourite: no commander unless the orders require one, and no more than half the
  // effort (rounded up) in any one arm, so their plan is balanced rather than clever.
  const cap = Math.ceil(poolSize / 2);
  for (const commander of commanderRequired ? commanders : [null]) {
    for (const approach of approaches.length ? approaches : [null]) {
      const weightSets = scenarios.map((s) =>
        Object.fromEntries(
          categories.map((c) => [
            c.id,
            battleArmWeight({ config, catId: c.id, jitter: 1, commander, approach, posture: s.posture, posture2: s.posture2, strandMult: strandMults?.[c.id] }),
          ])
        )
      );
      for (const allocation of allocations) {
        if (Object.values(allocation).some((v) => v > cap)) continue;
        let expected = 0;
        scenarios.forEach((s, i) => {
          const raw = sumBattleContributions(computeBattleContributions(categories, allocation, weightSets[i], poolSize));
          expected += (s.weight / totalWeight) * clampBattleBonus(raw);
        });
        if (!best || expected > best.expected + 1e-9) {
          best = { commanderId: commander ? commander.id : null, approachId: approach ? approach.id : null, allocation, expected };
        }
      }
    }
  }
  return best;
}

// The field-decision answer a staff gives without knowing the enemy: best on average across setups.
function staffDecisionOption(decision, postures, config) {
  const scenarios = battleScenarios(config || {}, postures);
  const totalWeight = scenarios.reduce((a, s) => a + s.weight, 0);
  let best = null;
  for (const option of decision.options) {
    let score = 0;
    for (const s of scenarios) {
      const latest = s.posture2 || s.posture;
      const e = battleDecisionEffect(option, latest ? latest.id : null);
      score += (s.weight / totalWeight) * (e.bonus + e.lines.reduce((a, l) => a + l.delta, 0) - 2 * e.severity);
    }
    if (!best || score > best.score + 1e-9) best = { option, score };
  }
  return best.option;
}
