import type { GameState } from "@dispatches/engine";

/** Phases a run can be resumed into. */
export const IN_RUN_SCREENS = new Set(["PROLOGUE", "CHAPTER_CARD", "NODE", "OUTCOME", "ROLL", "INTERLUDE"]);

/**
 * Version of the saved-run format. Saves written before versioning existed carry no `schemaVersion` and are
 * version 1 (the shape has not changed). Bump it whenever a change could make an old save unsafe to resume, and
 * add the matching entry to SAVE_MIGRATIONS so the update upgrades saves instead of wiping them (docs/SAVES.md).
 */
export const SAVE_SCHEMA_VERSION = 1;

/** Old node id -> new node id. Add an entry whenever a node is renamed so earlier saves still resume. */
export const NODE_ALIASES: Record<string, string> = {};

type Save = Record<string, unknown>;
/** SAVE_MIGRATIONS[n] upgrades a save from version n to n + 1. */
export const SAVE_MIGRATIONS: Record<number, (save: Save) => Save> = {};

export interface SaveRules {
  aliases?: Record<string, string>;
  migrations?: Record<number, (save: Save) => Save>;
  current?: number;
}

/** The string App.tsx stores in localStorage. */
export function serializeRunSave(state: GameState): string {
  return JSON.stringify({ ...state, schemaVersion: SAVE_SCHEMA_VERSION });
}

/**
 * Parses a saved run from localStorage. Returns null for anything that must not be hydrated: no save, broken JSON,
 * a save from a newer build, a version with no migration path, a phase that is not resumable, or a node that no
 * longer exists even after aliases (better to discard it than to hydrate into a crash).
 * Used by App.tsx and by scripts/test_saves.ts, which replays committed old saves through it. `rules` lets the test
 * inject migrations and aliases; the app uses the real tables above.
 */
export function parseRunSave(raw: string | null, nodes: Record<string, unknown>, rules: SaveRules = {}): GameState | null {
  const aliases = rules.aliases ?? NODE_ALIASES;
  const migrations = rules.migrations ?? SAVE_MIGRATIONS;
  const current = rules.current ?? SAVE_SCHEMA_VERSION;
  try {
    if (!raw) return null;
    let save = JSON.parse(raw) as Save;
    if (!save || typeof save !== "object") return null;
    let version = Number.isInteger(save.schemaVersion) ? (save.schemaVersion as number) : 1;
    if (version < 1 || version > current) return null;
    while (version < current) {
      const step = migrations[version];
      if (!step) return null;
      save = step(save);
      version += 1;
      if (!save || typeof save !== "object") return null;
    }
    delete save.schemaVersion;
    const alias = (id: unknown) => (typeof id === "string" && Object.prototype.hasOwnProperty.call(aliases, id) ? aliases[id] : id);
    if (Object.keys(aliases).length) {
      save.currentNodeId = alias(save.currentNodeId);
      save.pendingTarget = alias(save.pendingTarget);
      if (Array.isArray(save.history)) save.history = save.history.map((h) => (h && typeof h === "object" ? { ...(h as Save), nodeId: alias((h as Save).nodeId) } : h));
    }
    const parsed = save as unknown as GameState;
    if (typeof parsed.phase !== "string" || !IN_RUN_SCREENS.has(parsed.phase)) return null;
    if (typeof parsed.resources !== "object" || parsed.resources === null) return null;
    if (parsed.phase !== "PROLOGUE" && parsed.phase !== "CHAPTER_CARD" && !nodes[parsed.currentNodeId]) return null;
    return parsed;
  } catch {
    return null;
  }
}
