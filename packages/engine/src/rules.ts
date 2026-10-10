/** Pure rule helpers shared by the reducer and the UI (locks, odds, clamping). */
import { evalCondition } from "./conditions";
import type { AxisId, GameDefinition, GameState, Option, PartialStamps, Roll, StrainConfig } from "./schema";

export function clampTo(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Applies stamps in config resource order, clamping each touched resource to its own bounds. */
export function applyStamps(def: GameDefinition, resources: Record<string, number>, stamps: PartialStamps): Record<string, number> {
  const next = { ...resources };
  for (const r of def.config.resources) {
    const delta = stamps[r.id] ?? 0;
    if (delta !== 0) next[r.id] = clampTo((next[r.id] ?? 0) + delta, r.min, r.max);
  }
  return next;
}

export function applyAxisDelta(def: GameDefinition, axes: Record<AxisId, number>, delta?: Partial<Record<AxisId, number>>): Record<AxisId, number> {
  if (!delta) return axes;
  const next = { ...axes };
  for (const a of def.config.axes) next[a.id] = clampTo((axes[a.id] ?? 0) + (delta[a.id] ?? 0), a.min, a.max);
  return next;
}

/** First resource (config order) at or below its failAt, as that resource's failure ending id. */
export function checkFailureEnding(def: GameDefinition, resources: Record<string, number>): string | null {
  for (const r of def.config.resources) {
    if (r.failAt !== undefined && r.failureEndingId && (resources[r.id] ?? 0) <= r.failAt) return r.failureEndingId;
  }
  return null;
}

/**
 * Strain on a roll: the probability taken off because the resource it is about is short (0 when there is no strain config, no
 * resource, or the resource is at or above the threshold). A positive number.
 */
export function rollStrain(roll: Roll, resources: Record<string, number>, strain?: StrainConfig): number {
  const about = roll.about ?? roll.scaling?.resource;
  if (!strain || !about) return 0;
  const value = resources[about] ?? 0;
  if (value >= strain.threshold) return 0;
  return Math.min(strain.max, (strain.threshold - value) * strain.perPoint);
}

/** Effective success chance of a roll given live resources (and strain, if the game has it). */
export function effectiveRollChance(roll: Roll, resources: Record<string, number>, strain?: StrainConfig): number {
  const penalty = rollStrain(roll, resources, strain);
  if (!roll.scaling) return clampTo(roll.chance - penalty, 0.05, 0.95);
  const { resource, perPoint, min = 0.1, max = 0.95 } = roll.scaling;
  return clampTo(clampTo(roll.chance + (resources[resource] ?? 0) * perPoint, min, max) - penalty, 0.05, max);
}

export function isOptionLocked(resources: Record<string, number>, gate?: Option["gate"]): boolean {
  return !!gate && (resources[gate.resource] ?? 0) < gate.minThreshold;
}

export function isOptionFlagLocked(flags: Record<string, boolean>, requiresFlag?: string): boolean {
  return !!requiresFlag && !flags[requiresFlag];
}

export function isOptionAffordable(def: GameDefinition, state: Pick<GameState, "money" | "difficulty">, moneyCost?: number): boolean {
  if (!moneyCost || !def.config.difficulties[state.difficulty].enforceMoney) return true;
  return state.money >= moneyCost;
}

/** An option that is not shown (and cannot be chosen) because its showWhen condition does not hold. */
export function isOptionHidden(state: GameState, option: Option): boolean {
  return !!option.showWhen && !evalCondition(option.showWhen, state);
}

/** A shown option locked by its `requires` condition. */
export function isOptionConditionLocked(state: GameState, option: Option): boolean {
  return !!option.requires && !evalCondition(option.requires, state);
}

export function isOptionUnavailable(def: GameDefinition, state: GameState, option: Option): boolean {
  return (
    isOptionHidden(state, option) ||
    isOptionConditionLocked(state, option) ||
    isOptionLocked(state.resources, option.gate) ||
    !isOptionAffordable(def, state, option.moneyCost) ||
    isOptionFlagLocked(state.flags, option.requiresFlag)
  );
}
