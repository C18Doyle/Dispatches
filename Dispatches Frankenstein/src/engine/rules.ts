/** Pure rule helpers shared by the reducer and the UI (locks, odds, clamping). */
import type { AxisId, GameDefinition, GameState, Option, PartialStamps, Roll } from "./schema";

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

/** Effective success chance of a roll given live resources. */
export function effectiveRollChance(roll: Roll, resources: Record<string, number>): number {
  if (!roll.scaling) return roll.chance;
  const { resource, perPoint, min = 0.1, max = 0.95 } = roll.scaling;
  return clampTo(roll.chance + (resources[resource] ?? 0) * perPoint, min, max);
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

export function isOptionUnavailable(def: GameDefinition, state: GameState, option: Option): boolean {
  return (
    isOptionLocked(state.resources, option.gate) ||
    !isOptionAffordable(def, state, option.moneyCost) ||
    isOptionFlagLocked(state.flags, option.requiresFlag)
  );
}
