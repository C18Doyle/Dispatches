/**
 * Pure run logic for Dispatches 1922, extracted from App(). No React, no DOM, no storage, no
 * Math.random (randomness comes in as `rand`). The campaigns are passed in, never imported.
 *
 * `applyImpact` and `clampTriangle` are injected (see ChoiceHelpers) because the data-section
 * validators in tools/ evaluate everything above the "// PREVIEW SCREENS" marker of App.jsx on
 * its own, so those two helpers must stay defined there. Once content moves out of that file they
 * can move in here.
 */

export type Meters = Record<string, number>;
export type Flags = Record<string, unknown>;

export interface UncertainEntry {
  weight: number;
  title?: string;
  outcome?: string;
  aftermath?: string;
  impact?: Meters;
  setFlags?: Flags;
  next?: string;
}

export interface Choice {
  label?: string;
  outcome?: string;
  aftermath?: string;
  impact?: Meters;
  setFlags?: Flags;
  uncertain?: UncertainEntry[];
  next?: string;
  nextIf?: (meters: Meters) => string | null | undefined;
  costsCapital?: boolean;
  gate?: (meters: Meters) => boolean;
}

export interface HardMode {
  maxCap: number;
  maxEndingId: string;
}

export interface CampaignLike {
  triangleAxes: { key: string }[];
  hardMode: HardMode;
  ENDING_CLASSIFICATION?: Record<string, unknown>;
  resolveNode(nodeId: string, flags: Flags, meters: Meters): { isEnding?: boolean; bulletin?: unknown } | null;
}

export interface ChoiceHelpers {
  applyImpact(meters: Meters, impact?: Meters): Meters;
  clampTriangle(meters: Meters, axes?: string[]): Meters;
}

export interface ChoiceResult {
  text: string;
  aftermath: string;
  meters: Meters;
  triangleDeltas: Meters;
  hardModeValue: number;
  hardModeMaxed: boolean;
  newFlags: Flags;
  destination: string | undefined;
  /** Which half of the discovery log the destination belongs to. */
  discoveryKind: "nodes" | "endings";
}

/** roll is in [0, 100). The last entry is the fallback, as shipped. */
export function pickUncertain(uncertain: UncertainEntry[], roll: number): UncertainEntry {
  let cumulative = 0;
  let picked = uncertain[uncertain.length - 1];
  for (const entry of uncertain) {
    cumulative += entry.weight;
    if (roll <= cumulative) {
      picked = entry;
      break;
    }
  }
  return picked;
}

/**
 * Resolves the player's choice into the new run state. `rand` is called at most once, only for an
 * uncertain choice.
 */
export function resolveChoice(args: {
  choice: Choice;
  meters: Meters;
  campaign: CampaignLike;
  hardModeEnabled: boolean;
  hardModeValue: number;
  rand: () => number;
  helpers: ChoiceHelpers;
}): ChoiceResult {
  const { choice, meters, campaign: c, helpers } = args;
  let text = choice.outcome ?? "";
  let impact: Meters = choice.impact || {};
  let newFlags: Flags = { ...(choice.setFlags || {}) };
  let rolledAftermath = "";
  let rolledNext: string | undefined;

  if (choice.uncertain) {
    const picked = pickUncertain(choice.uncertain, args.rand() * 100);
    text = `${choice.outcome}\n\n[ROLL RESULT: ${picked.title}]\n${picked.outcome}`;
    rolledAftermath = picked.aftermath || "";
    rolledNext = picked.next;
    // The roll's impact stacks on the choice's base impact.
    impact = { ...impact };
    for (const k of Object.keys(picked.impact || {})) impact[k] = (impact[k] || 0) + (picked.impact as Meters)[k];
    // The roll's own flags win over the base choice's.
    newFlags = { ...newFlags, ...(picked.setFlags || {}) };
  }

  const axes = c.triangleAxes.map((a) => a.key);
  const clamped = helpers.clampTriangle(helpers.applyImpact(meters, impact), axes);

  // Capital is spent only by labelled choices (never by a roll), and only in hard mode.
  const spendsCapital = args.hardModeEnabled && choice.costsCapital === true;
  const hardModeValue = spendsCapital ? Math.min(c.hardMode.maxCap, args.hardModeValue + 1) : args.hardModeValue;

  // Real deltas after clamping.
  const triangleDeltas: Meters = {};
  for (const axis of axes) {
    const d = clamped[axis] - meters[axis];
    if (d !== 0) triangleDeltas[axis] = d;
  }

  // Destination: the choice's own `next`; a post-choice catastrophic meter state may divert it.
  // A choice with no `next` of its own (only its roll outcomes name destinations) falls back to the
  // rolled outcome's `next`; without that fallback such a choice routed to `undefined` and crashed.
  let destination = choice.next ?? rolledNext;
  if (typeof choice.nextIf === "function") {
    const diverted = choice.nextIf(clamped);
    if (diverted) destination = diverted;
  }

  const isEnding = !!(destination && c.ENDING_CLASSIFICATION && c.ENDING_CLASSIFICATION[destination]);
  return {
    text,
    aftermath: rolledAftermath || choice.aftermath || "",
    meters: clamped,
    triangleDeltas,
    hardModeValue,
    hardModeMaxed: args.hardModeEnabled && hardModeValue >= c.hardMode.maxCap,
    newFlags,
    destination,
    discoveryKind: isEnding ? "endings" : "nodes",
  };
}

export type AfterOutcome =
  | { screen: "ending"; endingId: string; hardCollapse: boolean; clearSave: true }
  | { screen: "end"; clearSave: true }
  | { screen: "bulletin"; clearSave: false }
  | { screen: "briefing"; clearSave: false };

/** Where the Continue button on the outcome screen goes. */
export function afterOutcome(args: {
  campaign: CampaignLike;
  nodeId: string | null | undefined;
  flags: Flags;
  meters: Meters;
  hardModeMaxed: boolean;
}): AfterOutcome {
  const { campaign: c, nodeId } = args;
  // Hard-mode collapse outranks whatever node was next.
  if (args.hardModeMaxed) return { screen: "ending", endingId: c.hardMode.maxEndingId, hardCollapse: true, clearSave: true };
  const nextNode = nodeId && nodeId !== "END_STUB" ? c.resolveNode(nodeId, args.flags, args.meters) : null;
  if (nextNode && nextNode.isEnding) return { screen: "ending", endingId: nodeId as string, hardCollapse: false, clearSave: true };
  if (nodeId === "END_STUB") return { screen: "end", clearSave: true };
  if (nextNode && nextNode.bulletin) return { screen: "bulletin", clearSave: false };
  return { screen: "briefing", clearSave: false };
}
