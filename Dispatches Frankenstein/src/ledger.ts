import type { GameDefinition, GameState } from "@dispatches/engine";

/** The Ledger: what this browser remembers across runs. Pure functions here; App.tsx does the storage. */
export const LEDGER_KEY = "frankenstein_ledger";
const KEEP_RUNS = 10;

export interface RunRecord {
  endingId: string;
  difficulty: string;
  branch: string;
  choices: number;
  experiments: number;
  resources: Record<string, number>;
  money: number;
  flags: string[];
}

export interface Ledger {
  version: 1;
  /** How many times each ending has been reached. */
  endings: Record<string, number>;
  /** The last few runs, newest first. */
  runs: RunRecord[];
}

export function emptyLedger(): Ledger {
  return { version: 1, endings: {}, runs: [] };
}

/** Reads a stored ledger, tolerating anything: a missing, damaged or foreign value is an empty ledger. */
export function parseLedger(raw: string | null): Ledger {
  if (!raw) return emptyLedger();
  try {
    const p = JSON.parse(raw);
    if (!p || p.version !== 1 || typeof p.endings !== "object" || !Array.isArray(p.runs)) return emptyLedger();
    const endings: Record<string, number> = {};
    for (const [k, v] of Object.entries(p.endings)) if (typeof v === "number" && v > 0) endings[k] = Math.floor(v);
    const runs = (p.runs as unknown[]).filter(
      (r): r is RunRecord => !!r && typeof (r as RunRecord).endingId === "string" && Array.isArray((r as RunRecord).flags),
    );
    return { version: 1, endings, runs: runs.slice(0, KEEP_RUNS) };
  } catch {
    return emptyLedger();
  }
}

/** The facts worth keeping about a finished run. */
export function runRecord(def: GameDefinition, state: GameState): RunRecord {
  const experiments = state.history.filter((h) => !!def.content.nodes[h.nodeId]?.options[h.optionIndex]?.roll).length;
  return {
    endingId: state.endingId ?? "",
    difficulty: state.difficulty,
    branch: state.activeBranch,
    choices: state.history.length,
    experiments,
    resources: { ...state.resources },
    money: state.money,
    flags: Object.keys(state.flags).filter((f) => state.flags[f]),
  };
}

/** A new ledger with this run added. */
export function recordRun(ledger: Ledger, run: RunRecord): Ledger {
  return {
    version: 1,
    endings: { ...ledger.endings, [run.endingId]: (ledger.endings[run.endingId] ?? 0) + 1 },
    runs: [run, ...ledger.runs].slice(0, KEEP_RUNS),
  };
}

/** The lines for what a run carried, in the order the content lists its flags; flags with no note are left out. */
export function carriedNotes(def: GameDefinition, run: Pick<RunRecord, "flags">): string[] {
  const notes = def.flavor.flagNotes;
  if (!notes) return [];
  return Object.keys(notes)
    .filter((f) => run.flags.includes(f))
    .map((f) => notes[f]);
}

/** "1 choice", "2 choices". */
export function count(n: number, one: string, many = one + "s"): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** A short plain-text account of a run, for copying. */
export function summaryText(def: GameDefinition, run: RunRecord, endingTitle: string): string {
  const label = def.flavor.difficultyInfo?.[run.difficulty as "EASY"]?.label ?? run.difficulty;
  const res = def.config.resources.map((r) => `${r.label} ${run.resources[r.id] > 0 ? "+" : ""}${run.resources[r.id]}`).join(", ");
  const carried = carriedNotes(def, run);
  const lines = [
    `Frankenstein: The Modern Prometheus. ${endingTitle}`,
    `${label}. ${count(run.choices, "choice")}, ${count(run.experiments, "experiment")}. ${res}.`,
  ];
  if (carried.length) lines.push(`Carried: ${carried.join(" ")}`);
  return lines.join("\n");
}
