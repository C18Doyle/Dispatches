/**
 * Engine-neutral view of a run, used by the characterization tests. Both the
 * legacy engine (via an adapter in record_baseline.ts) and the new reducer
 * are projected into this one shape and hashed, so the two can be compared
 * step by step. Imports types only.
 */
import { createHash } from "node:crypto";

export interface Projection {
  phase: string;
  difficulty: string;
  money: number;
  currentNodeId: string;
  activeBranch: string;
  resources: Record<string, number>;
  axes: Record<string, number>;
  flags: string[]; // sorted keys whose value is true
  activeInterludeId: string | null;
  pendingTarget: string | null;
  pendingOutcomeText: string | null;
  pendingOutcomeKind: string;
  pendingOutcomeStamps: Record<string, number> | null;
  pendingRoll: unknown;
  pendingOptionLabel: string | null;
  pendingOptionQuote: unknown;
  shownCrises: string[];
  shownOneShot: string[];
  endingId: string | null;
  history: { nodeId: string; optionIndex: number }[];
  adviceUsesLeft: number;
  adviceRevealed: boolean;
  favorUsed: boolean;
  /** Present only on the ENDING phase: resolved headline/title/text/label. */
  ending: unknown;
  /** Present only on the NODE phase: sorted distinct gossip / creature-report lines available. */
  gossipPool: string[] | null;
  reportPool: string[] | null;
}

function stable(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(stable);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.keys(v as object)
        .sort()
        .map((k) => [k, stable((v as Record<string, unknown>)[k])])
    );
  }
  return v;
}

export function hashProjection(p: Projection): string {
  return createHash("sha256").update(JSON.stringify(stable(p))).digest("hex").slice(0, 12);
}

/** mulberry32: tiny seedable PRNG so every run is reproducible. */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type RecordedAction =
  | { type: "START_GAME" | "ADVANCE_PROLOGUE" | "ENTER_STORY" | "SKIP_TO_ACT2" | "CONTINUE_OUTCOME" | "DISMISS_INTERLUDE" | "ASK_ADVICE" | "RESTART" }
  | { type: "SET_DIFFICULTY"; difficulty: string }
  | { type: "SELECT_OPTION"; optionIndex: number }
  | { type: "CONDUCT_EXPERIMENT"; roll: number }
  | { type: "USE_FAVOR"; resource: string };

export interface RecordedRun {
  seed: number;
  actions: RecordedAction[];
  /** hashes[i] = hash of projection after actions[i]. */
  hashes: string[];
}

export interface Baseline {
  generatedBy: string;
  runs: RecordedRun[];
  coverage: Record<string, number>;
}
