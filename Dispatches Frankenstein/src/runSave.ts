import type { GameState } from "@dispatches/engine";

/** Phases a run can be resumed into. */
export const IN_RUN_SCREENS = new Set(["PROLOGUE", "CHAPTER_CARD", "NODE", "OUTCOME", "ROLL", "INTERLUDE"]);

/**
 * Parses a saved run from localStorage. Returns null for anything that must not be hydrated: no save,
 * broken JSON, a phase that is not resumable, or a save from an older content build that names a node
 * that no longer exists (better to discard it than to hydrate into a crash).
 * Used by App.tsx and by scripts/test_saves.ts, which replays committed old saves through it.
 */
export function parseRunSave(raw: string | null, nodes: Record<string, unknown>): GameState | null {
  try {
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed || typeof parsed.phase !== "string" || !IN_RUN_SCREENS.has(parsed.phase)) return null;
    if (typeof parsed.resources !== "object" || parsed.resources === null) return null;
    if (parsed.phase !== "PROLOGUE" && parsed.phase !== "CHAPTER_CARD" && !nodes[parsed.currentNodeId]) return null;
    return parsed;
  } catch {
    return null;
  }
}
