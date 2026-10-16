import type { GameDefinition, GameState } from "@dispatches/engine";

/** The Ledger: what this browser remembers across runs. Pure functions here; App.tsx does the storage. */
export const LEDGER_KEY = "sherlock_ledger";
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
  /** The road taken (a branch id after Act I), the trust the four allies ended with, and how many scenes were seen. Absent in older records. */
  road?: string;
  trust?: Record<string, number>;
  scenes?: number;
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

const ROAD_NAMES: Record<string, string> = { YARD: "Scotland Yard", STREET: "the Irregulars", CONTINENT: "the flight", MYCROFT: "Whitehall" };
const TRUST_WORDS = ["Estranged", "Cold", "Doubtful", "Wary", "Neutral", "Warming", "Trusting", "Loyal", "Devoted"];

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
    road: state.history.map((h) => def.content.nodes[h.nodeId]?.branch).find((b) => b in ROAD_NAMES),
    trust: Object.fromEntries(def.config.axes.filter((a) => a.id.startsWith("trust")).map((a) => [a.label, state.axes[a.id] ?? 0])),
    scenes: new Set(state.history.map((h) => h.nodeId)).size,
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
    `Sherlock Holmes: The Final Problem. ${endingTitle}`,
    `${label}. ${count(run.choices, "choice")}, ${count(run.experiments, "gambit")}${run.road ? `, by way of ${ROAD_NAMES[run.road] ?? run.road}` : ""}. ${res}.`,
  ];
  if (run.trust && Object.keys(run.trust).length) lines.push(`Trust: ${Object.entries(run.trust).map(([who, v]) => `${who} ${TRUST_WORDS[Math.max(0, Math.min(8, v + 4))].toLowerCase()}`).join(", ")}.`);
  if (carried.length) lines.push(`Carried: ${carried.slice(0, 3).join(" ")}${carried.length > 3 ? ` (and ${carried.length - 3} more)` : ""}`);
  return lines.join("\n");
}
