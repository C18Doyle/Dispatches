// =============================================================================
// THE ORDER OF BATTLE
// =============================================================================
//
// A contested order that is a battle can be fought on its own screen, ported in spirit from Dispatches 1940 and 1941. The player
// places a pool of effort ("chits") across the battle's arms, may name a commander and picks an approach, and the enemy's setup is
// drawn hidden: only one line of intelligence, right three times in four, points at it. The plan moves the odds of the hosting
// order's roll toward the better of its two outcomes, and charges the meters a little.
//
// THE BASELINE IS THE STAFF'S PLAN. The bonus is measured against the plan the staff would send without knowing the enemy's setup
// (staffPlanFor), under the setup the enemy really shows: so "let the staff plan it" plays the record's own odds (bonus 0), a plan
// that reads the intelligence and is right beats it, and one that is wrong loses to it. Switching the planning off in the settings
// therefore plays the same odds as the staff plan. The bonus is capped at BATTLE_BONUS_CLAMP points either way, and the roll's
// weights are kept inside [5, 95].
//
// A battle is registered in 62-battles.jsx (BATTLES, keyed by the id of the hosting choice's `keyBattleSubgame`). The hosting
// choice must have exactly two contested outcomes; `winBranch` is the index of the better one for the commander.
// =============================================================================

export const BATTLE_COMMANDER_BONUS = 0.8; // extra weight per chit in the arm the officer really commanded
export const BATTLE_NEGLECT_PENALTY = 1.5; // owed by an arm that gets less than its fair share, once half the pool is spent
export const BATTLE_BONUS_CLAMP = 20; // points of weight a plan can move the roll, either way
export const BATTLE_SCALE = 1.3; // points of weight per point of contribution above (or below) the staff's plan
export const BATTLE_INTEL_ERROR = 0.25; // how often the free intelligence summary describes the wrong setup
export const BATTLE_WEIGHT_BOUNDS = [5, 95];
export const BATTLE_PRESS = 1.3; // the second day: pressing on multiplies the plan's edge (or its error) by this
export const BATTLE_STEADY = 0.5; // the second day: steadying the line multiplies it by this
export const BATTLE_SHIFT_MAX = 2; // counters that can be moved between arms on the second day
export const BATTLE_SHIFT_COST = 1; // points of weight lost to the confusion of moving them, once any are moved
export const BATTLE_SECOND_GAIN = 3; // what a counter moved with the enemy known is worth, against the same move made in the dark

/** Filled in by 62-battles.jsx: { [battleId]: config }. */
export const BATTLES = {};

/** The battle a choice hosts, or null. */
export function battleOf(choice) {
  const id = choice && choice.keyBattleSubgame && choice.keyBattleSubgame.id;
  return (id && BATTLES[id]) || null;
}

/** How many chits the command can place: 6, one more or less as the men and the shells stand. Between 4 and 8. */
export function battlePoolSize(meters) {
  const m = meters || {};
  const stock = (m.manpower || 0) + (m.munitions || 0);
  return Math.max(4, Math.min(8, 6 + Math.trunc(stock / 6)));
}

/** The enemy's setup for this attempt, drawn by weight. `rng` is injectable. */
export function pickBattlePosture(config, rng = Math.random) {
  const roster = config.postures || [];
  if (!roster.length) return null;
  const total = roster.reduce((s, p) => s + (p.weight || 1), 0);
  let r = rng() * total;
  for (const p of roster) {
    r -= p.weight || 1;
    if (r <= 0) return p;
  }
  return roster[roster.length - 1];
}

/** The free intelligence summary: { shown, right }. Right three times in four; otherwise it describes another setup. */
export function battleIntel(config, posture, rng = Math.random) {
  const roster = config.postures || [];
  if (!posture || roster.length < 2 || rng() >= BATTLE_INTEL_ERROR) return { shown: posture, right: true };
  const others = roster.filter((p) => p.id !== posture.id);
  const shown = others[Math.min(others.length - 1, Math.floor(rng() * others.length))];
  return { shown, right: false };
}

/** The weight one chit carries in an arm: (base + commander + approach) times the enemy's setup. */
export function battleArmWeight(config, catId, commander, approach, posture) {
  const base = (config.effectiveness && config.effectiveness[catId]) ?? 1;
  const commanderBonus = commander && commander.category === catId ? BATTLE_COMMANDER_BONUS : 0;
  const approachMod = (approach && approach.modifiers && approach.modifiers[catId]) || 0;
  const setup = posture && posture.modifiers && posture.modifiers[catId] != null ? posture.modifiers[catId] : 1;
  return (base + commanderBonus + approachMod) * setup;
}

const lookup = (list, id) => (list || []).find((x) => x.id === id) || null;

/** What each arm contributes: its chits times its weight, less the penalty for an arm left short (once half the pool is spent). */
export function battleContributions(config, plan, posture, pool) {
  const cats = config.categories;
  const commander = lookup(config.commanders, plan.commanderId);
  const approach = lookup(config.approaches, plan.approachId);
  const alloc = plan.allocation || {};
  const spent = cats.reduce((s, c) => s + (alloc[c.id] || 0), 0);
  const fair = pool / cats.length;
  const out = {};
  for (const c of cats) {
    const n = alloc[c.id] || 0;
    const value = n * battleArmWeight(config, c.id, commander, approach, posture);
    const penalty = spent >= pool / 2 && n < fair ? BATTLE_NEGLECT_PENALTY * ((fair - n) / fair) : 0;
    out[c.id] = value - penalty;
  }
  return out;
}

const sumValues = (o) => Object.values(o).reduce((a, v) => a + v, 0);

/** Every way to place exactly `pool` chits across the arms. */
export function allBattleAllocations(cats, pool) {
  const out = [];
  const rec = (i, left, cur) => {
    if (i === cats.length - 1) { out.push({ ...cur, [cats[i].id]: left }); return; }
    for (let v = 0; v <= left; v++) rec(i + 1, left - v, { ...cur, [cats[i].id]: v });
  };
  rec(0, pool, {});
  return out;
}

/**
 * The plan a competent staff would send without reading the intelligence: the approach and the placement of the pool that does best
 * on average over the enemy's possible setups (each weighted as the config weights it), with something in every arm (the staff leave none
 * bare), no more than half the pool in any one, and no commander named. Robust, not clever.
 */
export function staffPlanFor(config, pool) {
  const cats = config.categories;
  const postures = config.postures && config.postures.length ? config.postures : [null];
  const total = postures.reduce((s, p) => s + ((p && p.weight) || 1), 0);
  const cap = Math.ceil(pool / 2);
  const floor = pool >= cats.length ? 1 : 0;
  const allocations = allBattleAllocations(cats, pool).filter((a) => Object.values(a).every((v) => v <= cap && v >= floor));
  let best = null;
  for (const approach of config.approaches && config.approaches.length ? config.approaches : [null]) {
    for (const allocation of allocations) {
      let expected = 0;
      for (const p of postures) {
        const plan = { allocation, commanderId: null, approachId: approach ? approach.id : null };
        expected += (((p && p.weight) || 1) / total) * sumValues(battleContributions(config, plan, p, pool));
      }
      if (!best || expected > best.expected + 1e-9) best = { allocation, commanderId: null, approachId: approach ? approach.id : null, expected };
    }
  }
  return best;
}

const clampBonus = (raw) => Math.max(-BATTLE_BONUS_CLAMP, Math.min(BATTLE_BONUS_CLAMP, Math.round(raw)));

/** The unrounded edge of a plan over the staff's, under the same enemy setup. */
function rawBonus(config, plan, posture, pool) {
  const staff = staffPlanFor(config, pool);
  const mine = sumValues(battleContributions(config, plan, posture, pool));
  const theirs = sumValues(battleContributions(config, staff, posture, pool));
  return (mine - theirs) * BATTLE_SCALE;
}

/** Points of weight a plan moves the roll, against the staff's plan under the same enemy setup. Zero for the staff's own plan. */
export function battleBonus(config, plan, posture, pool) {
  return clampBonus(rawBonus(config, plan, posture, pool));
}

// ---------- the second day ----------
//
// The plan is made on one reading of the enemy and the first day shows the real one. On the second day the player may (a) move up to BATTLE_SHIFT_MAX
// counters from one arm to another (a counter moved with the enemy known is worth BATTLE_SECOND_GAIN times what it was worth in the dark, less
// BATTLE_SHIFT_COST points of weight in the confusion), and (b) choose a stance: hold the plan (the
// plan's edge as it is), press on (BATTLE_PRESS times the edge, and a point of manpower), or steady the line (BATTLE_STEADY times the edge). A plan
// that is not given a second day is a plan held with nothing moved, so the staff's plan still plays the record's odds.
export const BATTLE_STANCES = [
  { id: "hold", name: "Hold the line", note: "Stand where the first day left the troops, with the odds as they stand." },
  { id: "press", name: "Press the attack", note: "Throw in everything where the enemy is giving: the plan's edge, or its error, is a third greater, and it costs a point of manpower." },
  { id: "steady", name: "Fall back to the second line", note: "Play safe: the plan's edge, or its error, is halved." },
];

/** The plan with its second day applied: { ...plan, allocation } after the counters moved ({ from, to } pairs, at most BATTLE_SHIFT_MAX). */
export function battleSecondPlan(plan) {
  const second = plan.second || {};
  const alloc = { ...(plan.allocation || {}) };
  let n = 0;
  for (const m of second.moves || []) {
    if (n >= BATTLE_SHIFT_MAX || !m || m.from === m.to || !(alloc[m.from] > 0) || !(m.to in alloc)) continue;
    alloc[m.from] -= 1;
    alloc[m.to] += 1;
    n++;
  }
  return { ...plan, allocation: alloc, moved: n };
}

/** The bonus the roll takes: the plan after its second day, under the setup the enemy really showed. Equals battleBonus for a plan with no second day. */
export function battleFinalBonus(config, plan, posture, pool) {
  const adjusted = battleSecondPlan(plan);
  const stance = (plan.second && plan.second.stance) || "hold";
  const before = rawBonus(config, plan, posture, pool);
  let raw = before + (rawBonus(config, adjusted, posture, pool) - before) * BATTLE_SECOND_GAIN;
  raw *= stance === "press" ? BATTLE_PRESS : stance === "steady" ? BATTLE_STEADY : 1;
  if (adjusted.moved > 0) raw -= BATTLE_SHIFT_COST;
  return clampBonus(raw);
}

// ---------- the day in bulletins ----------
//
// The second day is read as three bulletins from the field, morning, noon and evening, one for each arm, each marking the arm as gaining, holding or breaking.
// Nothing here is rolled: a bulletin is read off the plan and the enemy that was met, and the last is read off how the battle ended, so that the bulletins and the
// result never disagree. An arm's ratio is what it contributes (its counters at their weight, less the penalty for being left short) over a fair share of the pool.
//   morning  the plan as issued, under the enemy that was really met
//   noon     after the second day's order: counters moved (send the reserve), the attack pressed (arms that are ahead go further, the rest fall away), or the line
//            fallen back (every arm pulled toward holding)
//   evening  noon, moved by the result: a won battle lifts every arm a little and a lost one lowers it, and an arm that was left short does not come through a defeat
export const BULLETIN_TIMES = ["morning", "noon", "evening"];
const STATUS_AT = { gaining: 1.15, holding: 0.6 };
const statusOf = (r) => (r >= STATUS_AT.gaining ? "gaining" : r >= STATUS_AT.holding ? "holding" : "breaking");

export function battleStages(config, plan, posture, pool, won) {
  const cats = config.categories;
  const share = pool / cats.length;
  const ratios = (alloc) => {
    const c = battleContributions(config, { ...plan, allocation: alloc }, posture, pool);
    return cats.map((k) => (c[k.id] || 0) / share);
  };
  const first = ratios(plan.allocation);
  const moved = battleSecondPlan(plan);
  const stance = (plan.second && plan.second.stance) || "hold";
  const noon = ratios(moved.allocation).map((r) => (stance === "press" ? (r >= 1 ? r + 0.2 : r - 0.2) : stance === "steady" ? 0.9 + (r - 0.9) * 0.5 : r));
  const left = battleContributions(config, plan, posture, pool);
  const evening = won === undefined ? null : noon.map((r, i) => {
    const out = r + (won ? 0.2 : -0.25);
    return left[cats[i].id] < 0 ? (won ? Math.min(out, 0.9) : Math.min(out, 0.3)) : out;
  });
  const pack = (rs) => rs && cats.map((k, i) => ({ id: k.id, name: k.name, ratio: rs[i], status: statusOf(rs[i]) }));
  return { morning: pack(first), noon: pack(noon), evening: pack(evening) };
}

const PHRASES = {
  morning: {
    gaining: ["First objectives taken", "Advancing on the first reports", "Ahead of the timetable"],
    holding: ["Holding at first light", "The line stands as ordered", "No ground lost"],
    breaking: ["Giving way under the first blows", "Units falling back", "Short of what the plan asked"],
  },
  noon: {
    gaining: ["Gone forward again", "Across the first line", "Pressing the enemy back"],
    holding: ["Holding through the middle of the day", "Every attack stopped", "Where it was at dawn"],
    breaking: ["Losing ground", "First line lost", "Calling for support that is not there"],
  },
  evening: {
    gaining: ["Ends the day ahead", "The ground taken is held", "The enemy on the move"],
    holding: ["Ends the day where it began", "Held to the last light", "Spent, but standing"],
    breaking: ["Broken", "Gone back in disorder", "Ends the day without a line"],
  },
};

/** One arm's bulletin at one time of day: "The Guns: Held to the last light." The wording is picked by the arm and the hour, so that it does not change on a redraw. */
export function bulletinLine(time, arm) {
  const list = PHRASES[time][arm.status];
  let h = 0;
  for (const ch of arm.id + time) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return arm.name + ": " + list[h % list.length] + ".";
}

/**
 * The odds of the better outcome as the player can reckon them: the plan's bonus under the enemy setup the intelligence names (which is right about
 * three times in four), on the roll as strain leaves it. { pct, word, bonus }. For the screen's bar; the roll itself never reads it.
 */
export function battlePlanOdds(choice, config, plan, posture, pool, meters) {
  const strained = strainedUncertain(choice, meters).uncertain;
  const bonus = plan ? battleFinalBonus(config, plan, posture, pool) : 0;
  const moved = shiftToward(strained, config.winBranch, bonus);
  const total = moved.reduce((s, x) => s + x.weight, 0) || 100;
  const pct = Math.round((moved[config.winBranch].weight / total) * 100);
  return { pct, word: ODDS_BANDS.find((x) => pct < x.max).word, bonus };
}

/** The choice's contested outcomes with `bonus` points of weight moved toward the better outcome (two outcomes only). */
export function shiftToward(uncertain, winIndex, bonus) {
  if (!bonus || !uncertain || uncertain.length !== 2) return uncertain;
  const lose = 1 - winIndex;
  const [lo, hi] = BATTLE_WEIGHT_BOUNDS;
  const w = uncertain[winIndex].weight + bonus;
  const clamped = Math.max(lo, Math.min(hi, w));
  const total = uncertain[0].weight + uncertain[1].weight;
  return uncertain.map((b, i) => (i === winIndex ? { ...b, weight: clamped } : i === lose ? { ...b, weight: total - clamped } : b));
}

/**
 * What the plan costs the meters, and how well the battle was fought. A heavy commitment (half the pool or more in one arm) costs that arm's
 * meter a point; a win with no arm left short earns a point of will; each meter's net cost is held to [-1, +1] and the whole plan takes at most
 * two points from the three meters, so a plan can sting but never outweigh the battle's own outcome. The grade: a win with nothing neglected is
 * "clean", any other win "costly"; a loss is "marginal" when the plan held up and "total" when two or more arms were left short.
 */
export function battlePlanCosts(config, planGiven, posture, pool, won) {
  const cats = config.categories;
  const plan = battleSecondPlan(planGiven);
  const alloc = plan.allocation || {};
  const contributions = battleContributions(config, plan, posture, pool);
  const lines = [];
  if (planGiven.second && planGiven.second.stance === "press") lines.push({ meter: "manpower", delta: -1, reason: "Pressed the attack" });
  for (const c of cats) {
    if ((alloc[c.id] || 0) >= pool / 2) lines.push({ meter: c.meter, delta: -1, reason: `Heavy commitment to ${c.name}` });
  }
  const neglected = cats.filter((c) => contributions[c.id] < 0);
  if (won && neglected.length === 0) lines.push({ meter: "will", delta: 1, reason: "A coordinated plan" });
  const totals = { manpower: 0, munitions: 0, will: 0 };
  for (const l of lines) totals[l.meter] += l.delta;
  for (const m of Object.keys(totals)) totals[m] = Math.max(-1, Math.min(1, totals[m]));
  let owed = Object.values(totals).reduce((a, v) => a + Math.min(0, v), 0);
  while (owed < -2) {
    const worst = Object.keys(totals).reduce((a, m) => (totals[m] < totals[a] ? m : a));
    totals[worst] += 1;
    owed += 1;
  }
  const grade = won ? (neglected.length === 0 ? "clean" : "costly") : neglected.length >= 2 ? "total" : "marginal";
  return { lines, totals, grade, neglected: neglected.map((c) => c.id), contributions };
}

/** The flags a fought battle leaves, for the next node's echo (see battleEchoText). */
export function battleFlagsOut(config, plan, costs) {
  const out = { [`bx_${config.id}_grade`]: costs.grade };
  if (costs.neglected.length) {
    // the arm left furthest behind
    const worst = costs.neglected.reduce((a, id) => (costs.contributions[id] < costs.contributions[a] ? id : a));
    out[`bx_${config.id}_neglected`] = worst;
  }
  if (plan.commanderId) out[`bx_${config.id}_commander`] = plan.commanderId;
  return out;
}

/** What the next report says about how the battle was fought: appended to that node's situation. "" when no battle was fought. */
export function battleEchoText(nodeId, flags) {
  if (!flags) return "";
  const parts = [];
  for (const config of Object.values(BATTLES)) {
    if (!config.echo || config.echo.node !== nodeId) continue;
    const grade = flags[`bx_${config.id}_grade`];
    if (!grade) continue;
    const e = config.echo;
    if (e.grade && e.grade[grade]) parts.push(e.grade[grade]);
    const neglected = flags[`bx_${config.id}_neglected`];
    const commander = flags[`bx_${config.id}_commander`];
    if (neglected && e.neglected && e.neglected[neglected]) parts.push(e.neglected[neglected]);
    else if (commander && e.commander && e.commander[commander]) parts.push(e.commander[commander]);
  }
  return parts.length ? "\n\n" + parts.join(" ") : "";
}

/**
 * Resolve the hosting order under a plan: the roll's weights moved by the plan's bonus, then the plan's cost to the meters.
 * Returns what chooseNext needs: { uncertain, bonus, posture, costsFor(branchIndex) }.
 */
export function battleRoll(choice, plan, meters) {
  const config = battleOf(choice);
  if (!config || !plan || !choice.uncertain || choice.uncertain.length !== 2) return null;
  const posture = lookup(config.postures, plan.postureId);
  const pool = plan.pool || battlePoolSize(meters);
  const bonus = battleFinalBonus(config, plan, posture, pool);
  return { config, posture, pool, bonus, costsFor: (won) => battlePlanCosts(config, plan, posture, pool, won) };
}
