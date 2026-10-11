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

/** Points of weight a plan moves the roll, against the staff's plan under the same enemy setup. Zero for the staff's own plan. */
export function battleBonus(config, plan, posture, pool) {
  const staff = staffPlanFor(config, pool);
  const mine = sumValues(battleContributions(config, plan, posture, pool));
  const theirs = sumValues(battleContributions(config, staff, posture, pool));
  const raw = (mine - theirs) * BATTLE_SCALE;
  return Math.max(-BATTLE_BONUS_CLAMP, Math.min(BATTLE_BONUS_CLAMP, Math.round(raw)));
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
export function battlePlanCosts(config, plan, posture, pool, won) {
  const cats = config.categories;
  const alloc = plan.allocation || {};
  const contributions = battleContributions(config, plan, posture, pool);
  const lines = [];
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
  const bonus = battleBonus(config, plan, posture, pool);
  return { config, posture, pool, bonus, costsFor: (won) => battlePlanCosts(config, plan, posture, pool, won) };
}
