/** The projection of a GameState that the characterization tests hash (shared by verify_baseline.ts and record_baseline.ts). */
import { resolveEnding, gossipPool, creatureReportPool, type GameDefinition, type GameState } from "../src/index";
import type { Projection } from "./projection";

const distinctSorted = (lines: string[]) => [...new Set(lines)].sort();

export function makeProject(def: GameDefinition) {
  return function project(s: GameState): Projection {
    const ending = s.phase === "ENDING" ? resolveEnding(def, s) : null;
    return {
      phase: s.phase,
      difficulty: s.difficulty,
      money: s.money,
      currentNodeId: s.currentNodeId,
      activeBranch: s.activeBranch,
      resources: { ...s.resources },
      axes: { ...s.axes },
      flags: Object.keys(s.flags).filter((k) => s.flags[k]).sort(),
      activeInterludeId: s.activeInterludeId,
      pendingTarget: s.pendingTarget,
      pendingOutcomeText: s.pendingOutcomeText,
      pendingOutcomeKind: s.pendingOutcomeKind,
      pendingOutcomeStamps: s.pendingOutcomeStamps as Record<string, number> | null,
      pendingRoll: s.pendingRoll,
      pendingOptionLabel: s.pendingOptionLabel,
      pendingOptionQuote: s.pendingOptionQuote,
      shownCrises: [...s.shownCrises],
      shownOneShot: [...s.shownOneShot],
      endingId: s.endingId,
      history: s.history.map((h) => ({ ...h })),
      adviceUsesLeft: s.adviceUsesLeft,
      adviceRevealed: s.adviceRevealed,
      favorUsed: s.favorUsed,
      ending: ending && { headline: ending.headline, title: ending.title, text: ending.text, temperamentLabel: ending.epilogueLabel },
      gossipPool: s.phase === "NODE" ? distinctSorted(gossipPool(def, s)) : null,
      reportPool: s.phase === "NODE" ? distinctSorted(creatureReportPool(def, s)) : null,
    };
  };
}
