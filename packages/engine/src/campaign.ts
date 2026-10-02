/**
 * Campaign primitives: the choice-resolution rules shared by the code-defined-content games
 * (1914, 1922, 1940, 1941), where a node provider returns each stage as an object whose choices carry
 * `impact`, `setFlags`, `uncertain` (weighted roll outcomes), `next` and optionally `nextIf`.
 *
 * The games agree on the shape and differ in a few rules. Those rules are data (`ChoiceRules`), not
 * forks of the code, so one tested implementation serves all of them:
 *   - a roll outcome's impact either REPLACES the choice's impact (1914, 1940, 1941) or STACKS on it (1922);
 *   - routing order: roll `next` then choice `next` (1940, 1941), roll `next` then `nextIf` then choice
 *     `next` (1914), or `nextIf` overriding everything (1922);
 *   - how a roll value maps to an outcome (scale to the weights' total or to a fixed 100; which outcome
 *     wins if the weights do not cover the roll).
 *
 * Pure: no React, no DOM, no storage, no Math.random (randomness is passed in), no game names.
 */

import { clampTo } from "./rules";

export type Meters = Record<string, number>;
export type Flags = Record<string, unknown>;

export interface AxisSpec {
  key: string;
  min: number;
  max: number;
}

export interface Variant {
  weight: number;
  impact?: Meters;
  setFlags?: Flags;
  next?: string;
  [k: string]: unknown;
}

export interface CampaignChoice {
  impact?: Meters;
  setFlags?: Flags;
  uncertain?: Variant[];
  next?: string;
  nextIf?: (meters: Meters, flags: Flags) => string | null | undefined;
  [k: string]: unknown;
}

/** When `flags[flag]` crosses `threshold` in a given mode and `unless` is not yet set, merge `set` into the flags. */
export interface Ceiling {
  mode: string;
  flag: string;
  op: "gte" | "lte";
  threshold: number;
  unless: string;
  set: Flags;
}

/** When `flags[flag]` is truthy in `mode`, the run ends (routes to "END"). */
export interface EndFlag {
  mode: string;
  flag: string;
}

export interface RollRule {
  /** "total": roll = u * sum(weights). A number: roll = u * that number (e.g. 100). */
  scale: "total" | number;
  /** Outcome picked when the roll is beyond every cumulative weight. */
  fallback: "first" | "last";
}

export type Routing =
  | "roll-then-choice" //                     roll.next || choice.next
  | "roll-then-nextIf-then-choice" //         roll.next ?? nextIf(post) ?? choice.next
  | "nextIf-overrides"; //                    nextIf(post) || roll.next || choice.next

export interface ChoiceRules {
  axes: AxisSpec[];
  impact: "replace" | "stack";
  roll: RollRule;
  routing: Routing;
  ceilings?: Ceiling[];
  endFlags?: EndFlag[];
}

/** Index of the weighted outcome for a uniform sample u in [0, 1). */
export function pickWeighted(weights: number[], u: number, rule: RollRule): number {
  const total = weights.reduce((a, v) => a + v, 0);
  let roll = u * (rule.scale === "total" ? total : rule.scale);
  for (let k = 0; k < weights.length; k++) {
    roll -= weights[k];
    if (roll <= 0) return k;
  }
  return rule.fallback === "first" ? 0 : weights.length - 1;
}

/** Adds `impact` to the meters on the spec'd axes and clamps each axis to its range. Missing axes are left alone. */
export function applyImpact(meters: Meters, impact: Meters | undefined, axes: AxisSpec[]): Meters {
  if (!impact) return meters;
  const next: Meters = { ...meters };
  for (const a of axes) {
    if (a.key in next) next[a.key] = clampTo(next[a.key] + (impact[a.key] || 0), a.min, a.max);
  }
  return next;
}

/** Combines a choice's impact with its rolled outcome's, per the game's rule. */
export function combineImpact(choiceImpact: Meters | undefined, variant: Variant | null, mode: "replace" | "stack"): Meters | undefined {
  if (!variant || !variant.impact) return choiceImpact;
  if (mode === "replace") return variant.impact;
  const out: Meters = { ...(choiceImpact || {}) };
  for (const k of Object.keys(variant.impact)) out[k] = (out[k] || 0) + variant.impact[k];
  return out;
}

/** Hard-mode ceilings: crossing a threshold sets flags exactly once. */
export function applyCeilings(mode: string, flags: Flags, ceilings: Ceiling[] | undefined): Flags {
  let out = flags;
  for (const c of ceilings || []) {
    if (c.mode !== mode || out[c.unless]) continue;
    const v = (out[c.flag] as number) || 0;
    if (c.op === "gte" ? v >= c.threshold : v <= c.threshold) out = { ...out, ...c.set };
  }
  return out;
}

/** True if a hard-mode end flag is set for this mode (the run routes to "END" whatever the choice says). */
export function endsRun(mode: string, flags: Flags, endFlags: EndFlag[] | undefined): boolean {
  return (endFlags || []).some((e) => e.mode === mode && !!flags[e.flag]);
}

export function routeNext(choice: CampaignChoice, variant: Variant | null, meters: Meters, flags: Flags, routing: Routing): string | undefined {
  const rollNext = variant ? variant.next : undefined;
  switch (routing) {
    case "roll-then-choice":
      return rollNext || choice.next;
    case "roll-then-nextIf-then-choice":
      return rollNext ?? (typeof choice.nextIf === "function" ? choice.nextIf(meters, flags) : undefined) ?? choice.next;
    case "nextIf-overrides": {
      const base = rollNext || choice.next;
      const diverted = typeof choice.nextIf === "function" ? choice.nextIf(meters, flags) : undefined;
      return diverted || base;
    }
  }
}

export interface ResolvedChoice {
  meters: Meters;
  flags: Flags;
  rollIndex: number | null;
  variant: Variant | null;
  destination: string | undefined;
}

/**
 * Resolves one choice. `weights` overrides the rolled weights (e.g. a battle subgame's nudge); `rand`
 * is called at most once, only for an uncertain choice.
 */
export function resolveChoice(args: {
  choice: CampaignChoice;
  meters: Meters;
  flags: Flags;
  mode?: string;
  rules: ChoiceRules;
  rand: () => number;
  weights?: number[];
}): ResolvedChoice {
  const { choice, rules } = args;
  let rollIndex: number | null = null;
  let variant: Variant | null = null;
  if (choice.uncertain && choice.uncertain.length) {
    const weights = args.weights ?? choice.uncertain.map((v) => v.weight);
    rollIndex = pickWeighted(weights, args.rand(), rules.roll);
    variant = choice.uncertain[rollIndex];
  }
  const meters = applyImpact(args.meters, combineImpact(choice.impact, variant, rules.impact), rules.axes);
  let flags: Flags = { ...args.flags, ...(choice.setFlags || {}), ...((variant && variant.setFlags) || {}) };
  flags = applyCeilings(args.mode ?? "", flags, rules.ceilings);
  return { meters, flags, rollIndex, variant, destination: routeNext(choice, variant, meters, flags, rules.routing) };
}
