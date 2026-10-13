/**
 * The Order of Battle for Dispatches 1922: pure arithmetic, no React, no DOM, no storage, no Math.random (randomness is passed in).
 *
 * A contested order that is a real engagement can be fought on its own screen. The player places a pool of counters across the battle's arms,
 * may name an officer and picks an approach; the enemy's setup is drawn hidden and only one line of intelligence, right three times in four,
 * points at it. The plan moves the odds of the hosting order's roll toward the better of its two outcomes, and charges the meters a little.
 *
 * THE BASELINE IS THE STAFF'S PLAN. The bonus is measured against the plan the staff would send without knowing the enemy's setup
 * (staffPlanFor), under the setup the enemy really shows. "Let the staff plan it" therefore plays the record's own odds (bonus 0); a plan that
 * reads the intelligence and is right beats it, and one that is wrong loses to it. Switching battle planning off plays the same odds as the staff
 * plan. The bonus is capped at BATTLE_BONUS_CLAMP points either way and the roll's weights are kept inside BATTLE_WEIGHT_BOUNDS.
 *
 * The configs live in src/parts/35-battles.jsx. This file is ported from Dispatches 1914 (src/61-battle.jsx) without the second day and
 * without strain, and with the meters named by the campaign's own axes.
 */

export const BATTLE_COMMANDER_BONUS = 0.8; // extra weight per counter in the arm the officer really led
export const BATTLE_NEGLECT_PENALTY = 1.5; // owed by an arm that gets less than its fair share, once half the pool is spent
export const BATTLE_BONUS_CLAMP = 20; // points of weight a plan can move the roll, either way
export const BATTLE_SCALE = 1.3; // points of weight per point of contribution above (or below) the staff's plan
export const BATTLE_INTEL_ERROR = 0.25; // how often the free intelligence summary describes the wrong setup
export const BATTLE_WEIGHT_BOUNDS: [number, number] = [5, 95];

export interface BattleArm {
  id: string;
  name: string;
  /** The campaign meter that a heavy commitment to this arm costs a point of. */
  meter: string;
  units: string[];
  real: string;
  context: string;
}
export interface BattleCommander { id: string; name: string; role: string; category: string; note: string }
export interface BattleApproach { id: string; name: string; note: string; modifiers: Record<string, number> }
export interface BattlePosture { id: string; name: string; intel: string; modifiers: Record<string, number>; weight?: number }
export interface BattleEcho {
  /** The report (or reports) whose situation carries the echo. */
  node: string | string[];
  grade?: Record<string, string>;
  neglected?: Record<string, string>;
  commander?: Record<string, string>;
}
export interface BattleConfig {
  id: string;
  host: { node: string; choice: number };
  /** Index, in the hosting choice's `uncertain`, of the better outcome for the command. */
  winBranch: number;
  campaign: string;
  /** The campaign meter that a clean win earns a point of. */
  cleanMeter: string;
  title: string;
  flavor: string;
  conditions: string;
  /** Said on the report: what the sources do not give and the game had to judge. */
  modelled: string;
  /** What happened on the day, as the sources give it. */
  record?: string;
  categories: BattleArm[];
  effectiveness: Record<string, number>;
  commanders?: BattleCommander[];
  approaches?: BattleApproach[];
  postures?: BattlePosture[];
  echo?: BattleEcho;
}
export interface BattlePlan {
  allocation: Record<string, number>;
  commanderId: string | null;
  approachId: string | null;
  postureId?: string | null;
  pool?: number;
}
export interface Contested { weight: number; title?: string; [k: string]: unknown }
export type Rng = () => number;

const lookup = <T extends { id: string }>(list: T[] | undefined, id: string | null | undefined): T | null =>
  (list || []).find((x) => x.id === id) || null;

/** How many counters the command can place: 6, one more or less as the meters stand. Between 4 and 8. */
export function battlePoolSize(meters: Record<string, number> | null | undefined): number {
  const sum = Object.values(meters || {}).reduce((a, v) => a + (v || 0), 0);
  return Math.max(4, Math.min(8, 6 + Math.trunc(sum / 6)));
}

/** The enemy's setup for this attempt, drawn by weight. */
export function pickBattlePosture(config: BattleConfig, rng: Rng = Math.random): BattlePosture | null {
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

/** The free intelligence summary. Right three times in four; otherwise it describes another setup. */
export function battleIntel(config: BattleConfig, posture: BattlePosture | null, rng: Rng = Math.random): { shown: BattlePosture | null; right: boolean } {
  const roster = config.postures || [];
  if (!posture || roster.length < 2 || rng() >= BATTLE_INTEL_ERROR) return { shown: posture, right: true };
  const others = roster.filter((p) => p.id !== posture.id);
  const shown = others[Math.min(others.length - 1, Math.floor(rng() * others.length))];
  return { shown, right: false };
}

/** The weight one counter carries in an arm: (base + officer + approach) times the enemy's setup. */
export function battleArmWeight(config: BattleConfig, catId: string, commander: BattleCommander | null, approach: BattleApproach | null, posture: BattlePosture | null): number {
  const base = config.effectiveness[catId] ?? 1;
  const commanderBonus = commander && commander.category === catId ? BATTLE_COMMANDER_BONUS : 0;
  const approachMod = (approach && approach.modifiers && approach.modifiers[catId]) || 0;
  const setup = posture && posture.modifiers && posture.modifiers[catId] != null ? posture.modifiers[catId] : 1;
  return (base + commanderBonus + approachMod) * setup;
}

/** What each arm contributes: its counters times its weight, less the penalty for an arm left short (once half the pool is spent). */
export function battleContributions(config: BattleConfig, plan: BattlePlan, posture: BattlePosture | null, pool: number): Record<string, number> {
  const cats = config.categories;
  const commander = lookup(config.commanders, plan.commanderId);
  const approach = lookup(config.approaches, plan.approachId);
  const alloc = plan.allocation || {};
  const spent = cats.reduce((s, c) => s + (alloc[c.id] || 0), 0);
  const fair = pool / cats.length;
  const out: Record<string, number> = {};
  for (const c of cats) {
    const n = alloc[c.id] || 0;
    const value = n * battleArmWeight(config, c.id, commander, approach, posture);
    const penalty = spent >= pool / 2 && n < fair ? BATTLE_NEGLECT_PENALTY * ((fair - n) / fair) : 0;
    out[c.id] = value - penalty;
  }
  return out;
}

const sumValues = (o: Record<string, number>): number => Object.values(o).reduce((a, v) => a + v, 0);

/** Every way to place exactly `pool` counters across the arms. */
export function allBattleAllocations(cats: { id: string }[], pool: number): Record<string, number>[] {
  const out: Record<string, number>[] = [];
  const rec = (i: number, left: number, cur: Record<string, number>): void => {
    if (i === cats.length - 1) {
      out.push({ ...cur, [cats[i].id]: left });
      return;
    }
    for (let v = 0; v <= left; v++) rec(i + 1, left - v, { ...cur, [cats[i].id]: v });
  };
  rec(0, pool, {});
  return out;
}

/**
 * The plan a competent staff would send without reading the intelligence: the approach and the placement that do best on average over the
 * enemy's possible setups (each weighted as the config weights it), with something in every arm, no more than half the pool in any one, and
 * no officer named. Robust, not clever.
 */
export function staffPlanFor(config: BattleConfig, pool: number): BattlePlan & { expected: number } {
  const cats = config.categories;
  const postures: (BattlePosture | null)[] = config.postures && config.postures.length ? config.postures : [null];
  const total = postures.reduce((s, p) => s + ((p && p.weight) || 1), 0);
  const cap = Math.ceil(pool / 2);
  const floor = pool >= cats.length ? 1 : 0;
  const allocations = allBattleAllocations(cats, pool).filter((a) => Object.values(a).every((v) => v <= cap && v >= floor));
  let best: (BattlePlan & { expected: number }) | null = null;
  const approaches: (BattleApproach | null)[] = config.approaches && config.approaches.length ? config.approaches : [null];
  for (const approach of approaches) {
    for (const allocation of allocations) {
      let expected = 0;
      for (const p of postures) {
        const plan: BattlePlan = { allocation, commanderId: null, approachId: approach ? approach.id : null };
        expected += (((p && p.weight) || 1) / total) * sumValues(battleContributions(config, plan, p, pool));
      }
      if (!best || expected > best.expected + 1e-9) best = { allocation, commanderId: null, approachId: approach ? approach.id : null, expected };
    }
  }
  return best as BattlePlan & { expected: number };
}

const clampBonus = (raw: number): number => Math.max(-BATTLE_BONUS_CLAMP, Math.min(BATTLE_BONUS_CLAMP, Math.round(raw)));

/** Points of weight a plan moves the roll, against the staff's plan under the same enemy setup. Zero for the staff's own plan. */
export function battleBonus(config: BattleConfig, plan: BattlePlan, posture: BattlePosture | null, pool: number): number {
  const staff = staffPlanFor(config, pool);
  const mine = sumValues(battleContributions(config, plan, posture, pool));
  const theirs = sumValues(battleContributions(config, staff, posture, pool));
  return clampBonus((mine - theirs) * BATTLE_SCALE);
}

/** The choice's contested outcomes with `bonus` points of weight moved toward the better outcome (two outcomes only). */
export function shiftToward<T extends { weight: number }>(uncertain: T[], winIndex: number, bonus: number): T[] {
  if (!bonus || !uncertain || uncertain.length !== 2) return uncertain;
  const lose = 1 - winIndex;
  const [lo, hi] = BATTLE_WEIGHT_BOUNDS;
  const w = uncertain[winIndex].weight + bonus;
  const clamped = Math.max(lo, Math.min(hi, w));
  const total = uncertain[0].weight + uncertain[1].weight;
  return uncertain.map((b, i) => (i === winIndex ? { ...b, weight: clamped } : i === lose ? { ...b, weight: total - clamped } : b));
}

const ODDS_BANDS: { max: number; word: string }[] = [
  { max: 20, word: "Long odds against" },
  { max: 40, word: "Against" },
  { max: 60, word: "Even" },
  { max: 80, word: "Favourable" },
  { max: 101, word: "Strongly favourable" },
];

/** The odds of the better outcome as the player can reckon them, on the enemy setup the intelligence names. For the screen's bar; the roll never reads it. */
export function battlePlanOdds(uncertain: Contested[], config: BattleConfig, plan: BattlePlan | null, posture: BattlePosture | null, pool: number): { pct: number; word: string; bonus: number } {
  const bonus = plan ? battleBonus(config, plan, posture, pool) : 0;
  const moved = shiftToward(uncertain as { weight: number }[], config.winBranch, bonus);
  const total = moved.reduce((s, x) => s + x.weight, 0) || 100;
  const pct = Math.round((moved[config.winBranch].weight / total) * 100);
  return { pct, word: (ODDS_BANDS.find((x) => pct < x.max) as { word: string }).word, bonus };
}

export interface BattleCosts {
  lines: { meter: string; delta: number; reason: string }[];
  totals: Record<string, number>;
  grade: "clean" | "costly" | "marginal" | "total";
  neglected: string[];
  contributions: Record<string, number>;
}

/**
 * What the plan costs the meters, and how well the battle was fought. A heavy commitment (half the pool or more in one arm) costs that arm's
 * meter a point; a win with no arm left short earns a point of the config's clean meter; each meter's net change is held to [-1, +1] and the whole
 * plan takes at most two points, so a plan can sting but never outweigh the battle's own outcome. The grade: a win with nothing neglected is
 * "clean", any other win "costly"; a loss is "marginal" when the plan held up and "total" when two or more arms were left short.
 */
export function battlePlanCosts(config: BattleConfig, plan: BattlePlan, posture: BattlePosture | null, pool: number, won: boolean, axes: string[]): BattleCosts {
  const cats = config.categories;
  const alloc = plan.allocation || {};
  const contributions = battleContributions(config, plan, posture, pool);
  const lines: { meter: string; delta: number; reason: string }[] = [];
  for (const c of cats) {
    if ((alloc[c.id] || 0) >= pool / 2) lines.push({ meter: c.meter, delta: -1, reason: `Heavy commitment to ${c.name}` });
  }
  const neglected = cats.filter((c) => contributions[c.id] < 0);
  if (won && neglected.length === 0) lines.push({ meter: config.cleanMeter, delta: 1, reason: "A coordinated plan" });
  const totals: Record<string, number> = Object.fromEntries(axes.map((a) => [a, 0]));
  for (const l of lines) if (l.meter in totals) totals[l.meter] += l.delta;
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

/** The flags a fought battle leaves, for the next report's echo (see battleEchoText). */
export function battleFlagsOut(config: BattleConfig, plan: BattlePlan, costs: BattleCosts): Record<string, string> {
  const out: Record<string, string> = { [`bx_${config.id}_grade`]: costs.grade };
  if (costs.neglected.length) {
    const worst = costs.neglected.reduce((a, id) => (costs.contributions[id] < costs.contributions[a] ? id : a));
    out[`bx_${config.id}_neglected`] = worst;
  }
  if (plan.commanderId) out[`bx_${config.id}_commander`] = plan.commanderId;
  return out;
}

/** What a report says about how the battle was fought: appended to that report's situation. "" when no battle was fought. */
export function battleEchoText(configs: Record<string, BattleConfig>, nodeId: string, flags: Record<string, unknown> | null | undefined): string {
  if (!flags) return "";
  const parts: string[] = [];
  for (const config of Object.values(configs)) {
    if (!config.echo || !([] as string[]).concat(config.echo.node).includes(nodeId)) continue;
    const grade = flags[`bx_${config.id}_grade`] as string | undefined;
    if (!grade) continue;
    const e = config.echo;
    if (e.grade && e.grade[grade]) parts.push(e.grade[grade]);
    const neglected = flags[`bx_${config.id}_neglected`] as string | undefined;
    const commander = flags[`bx_${config.id}_commander`] as string | undefined;
    if (neglected && e.neglected && e.neglected[neglected]) parts.push(e.neglected[neglected]);
    else if (commander && e.commander && e.commander[commander]) parts.push(e.commander[commander]);
  }
  return parts.length ? " " + parts.join(" ") : "";
}
