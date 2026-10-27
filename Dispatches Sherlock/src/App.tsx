import { Fragment, useEffect, useRef, useState, useReducer } from "react";
import {
  reduce,
  createInitialState,
  resolveEnding,
  gossipPool,
  creatureReportPool,
  pickLine,
  isOptionUnavailable,
  isOptionLocked,
  isOptionFlagLocked,
  isOptionHidden,
  isOptionConditionLocked,
  effectiveRollChance,
  effectiveStamps,
  activeCoupling,
  rollStrain,
  evalCondition,
} from "@dispatches/engine";
import type { Action, Difficulty, GameState, Option, Quote, UiPrefs } from "@dispatches/engine";
import { def } from "./game";
import { IN_RUN_SCREENS, parseRunSave, serializeRunSave } from "./runSave";
import { LEDGER_KEY, carriedNotes, count, parseLedger, recordRun, runRecord, summaryText } from "./ledger";
import type { Ledger } from "./ledger";
import * as sfx from "./sfx";
import { PlateView, plateForEnding, plateForInterlude } from "./art";
import { MapView } from "./map";
import { CalendarView } from "./calendar";
import { BoardView } from "./board";
import { IS_DEMO, isDemoStop } from "./demo";
import { MINOR_BRANCHES, VOLUMES, volumeOfBranch, volumeOfEnding, volumeStats } from "./casebook";

type Resource = string;
type FontSize = UiPrefs["fontSize"];

const TOTAL_ENDINGS = Object.keys(def.content.endings).length;

const RESOURCE_IDS: Resource[] = def.config.resources.map((r) => r.id);
const RESOURCE_LABELS: Record<Resource, string> = Object.fromEntries(def.config.resources.map((r) => [r.id, r.label]));
/** The Strand: three lines of means (Hours, Hands, Wires) drawn as one gauge with three sub-lines. The other resources are plain gauges. */
const STRAND_IDS = ["hours", "hands", "wires"].filter((id) => RESOURCE_IDS.includes(id));
const CORE_IDS = RESOURCE_IDS.filter((r) => !STRAND_IDS.includes(r));

/** Watson's lines about the Strand live with his other notebook lines, under the keys strand_hours, strand_hands, strand_wires and strand_plenty. */
const STRAND_WORDS: Record<string, string[] | undefined> = {
  hours: def.flavor.creatureReportLines["strand_hours"],
  hands: def.flavor.creatureReportLines["strand_hands"],
  wires: def.flavor.creatureReportLines["strand_wires"],
  plenty: def.flavor.creatureReportLines["strand_plenty"],
};
/** Watson's remark about the Strand: the shortest line first (when one is at -2 or worse), or a word of comfort when all three are well supplied. */
function strandRemark(state: GameState): string | null {
  const short = STRAND_IDS.filter((id) => (state.resources[id] ?? 0) <= -2).sort((a, b) => state.resources[a] - state.resources[b]);
  const pool = short.length ? STRAND_WORDS[short[0]] : STRAND_IDS.every((id) => (state.resources[id] ?? 0) >= 3) ? STRAND_WORDS.plenty : undefined;
  return pool?.length ? pickLine(pool, Math.random()) : null;
}

function isInCrisis(resource: Resource, value: number): boolean {
  const r = def.config.resources.find((x) => x.id === resource);
  return r?.crisisAt !== undefined && value <= r.crisisAt;
}

const BRANCH_LABELS: Record<string, string> = {
  WEB: "Act I · The Web",
  YARD: "Act II · The Net",
  STREET: "Act II · The Shadow War",
  CONTINENT: "Act II · The Long Flight",
  MYCROFT: "Act II · The Cabinet",
  HIATUS: "Act III · The Years Away",
  BOHEMIA: "Case · A Scandal in Bohemia",
  BAND: "Case · The Speckled Band",
  CARBUNCLE: "Case · The Blue Carbuncle",
  LEAGUE: "Case · The Red-Headed League",
};

// The names and blurbs are content (flavor.json); these only stand in if a game does not supply them.
const DIFFICULTY_INFO: Record<Difficulty, { label: string; blurb: string }> = def.flavor.difficultyInfo ?? {
  EASY: { label: "Easy", blurb: "" },
  MEDIUM: { label: "Medium", blurb: "" },
  HARD: { label: "Hard", blurb: "" },
};

const FONT_SIZE_PX: Record<FontSize, string> = {
  small: "15px",
  medium: "17px",
  large: "19.5px",
};

// How long the Gambit screen holds on a suspense phase before the real
// CONDUCT_EXPERIMENT dispatch resolves it (the engine's name for a roll): long enough to read as a held
// breath, short enough not to feel like padding.
const ROLL_SUSPENSE_MS = 1500;
const ROLL_SUSPENSE_PHRASES = [
  "The room holds its breath.",
  "A cab slows in the street below.",
  "The pipe goes out, unnoticed.",
  "Somewhere a clock strikes the quarter.",
];

const STORAGE_KEY = "sherlock_final_problem_settings";

/** The look: tweed (the dark parlour) or paper (the same parlour in daylight). Kept apart from the other settings, which the engine's UiPrefs type fixes. */
type Theme = "tweed" | "paper";
const THEME_KEY = "sherlock_final_problem_theme";
function loadTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === "paper" ? "paper" : "tweed";
  } catch {
    return "tweed";
  }
}

function loadSettings(): UiPrefs {
  const fallback = {
    fontSize: "medium" as FontSize,
    musicEnabled: true,
    musicVolume: 0.45,
    sfxEnabled: true,
    sfxVolume: 0.6,
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      fontSize: parsed.fontSize === "small" || parsed.fontSize === "large" ? parsed.fontSize : "medium",
      musicEnabled: typeof parsed.musicEnabled === "boolean" ? parsed.musicEnabled : true,
      musicVolume: typeof parsed.musicVolume === "number" ? Math.min(1, Math.max(0, parsed.musicVolume)) : 0.45,
      sfxEnabled: typeof parsed.sfxEnabled === "boolean" ? parsed.sfxEnabled : true,
      sfxVolume: typeof parsed.sfxVolume === "number" ? Math.min(1, Math.max(0, parsed.sfxVolume)) : 0.6,
    };
  } catch {
    return fallback;
  }
}

function saveSettings(
  fontSize: FontSize,
  musicEnabled: boolean,
  musicVolume: number,
  sfxEnabled: boolean,
  sfxVolume: number
) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize, musicEnabled, musicVolume, sfxEnabled, sfxVolume }));
  } catch {
    /* per-viewer convenience only — losing it is fine */
  }
}

const ENDINGS_SEEN_KEY = "sherlock_endings_seen";

function loadEndingsSeen(): Set<string> {
  try {
    const raw = localStorage.getItem(ENDINGS_SEEN_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((x) => typeof x === "string")) : new Set();
  } catch {
    return new Set();
  }
}

function saveEndingsSeen(seen: Set<string>) {
  try {
    localStorage.setItem(ENDINGS_SEEN_KEY, JSON.stringify([...seen]));
  } catch {
    /* best-effort — a missed save just costs one line of "discovered" bookkeeping */
  }
}

function loadLedger(): Ledger {
  try {
    return parseLedger(localStorage.getItem(LEDGER_KEY));
  } catch {
    return parseLedger(null);
  }
}

function saveLedger(ledger: Ledger) {
  try {
    localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));
  } catch {
    /* the ledger is a keepsake, never a requirement */
  }
}

/**
 * A choice's quotation. Imagined lines read as before; a line marked as the canon's own would carry its story and chapter,
 * so a player can tell which words are Doyle's. (This game uses imagined lines only.)
 */
function QuoteLine({ quote, className }: { quote: Quote; className: string }) {
  const novel = quote.kind === "novel" && !!quote.source;
  return (
    <p className={className}>
      {quote.speaker}
      {novel ? <span className="not-italic font-heading text-[0.65rem] uppercase tracking-widest text-ink-soft"> · {quote.source}</span> : null}: {"“"}
      {quote.text}
      {"”"}
    </p>
  );
}

/**
 * One saved run per volume of the Case-Book, so that the long case can be left half-played while a minor case is finished. The old single save
 * (key v1) is moved to its volume the first time it is seen. `latest` names the volume saved most recently, which the title screen resumes.
 */
const LEGACY_SAVE_KEY = "sherlock_run_save_v1";
const SAVE_PREFIX = "sherlock_run_save_v2:";
const LATEST_KEY = SAVE_PREFIX + "latest";
const volumeOfState = (s: GameState) => volumeOfBranch(s.activeBranch)?.id ?? VOLUMES[0].id;

function migrateLegacySave() {
  try {
    const raw = localStorage.getItem(LEGACY_SAVE_KEY);
    if (raw === null) return;
    const old = parseRunSave(raw, def.content.nodes);
    if (old && old.currentNodeId !== "0") {
      const key = SAVE_PREFIX + volumeOfState(old);
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, serializeRunSave(old));
        localStorage.setItem(LATEST_KEY, volumeOfState(old));
      }
    }
    localStorage.removeItem(LEGACY_SAVE_KEY);
  } catch {
    /* storage unavailable */
  }
}

/** The saved run of each volume that has one. */
function loadRunSaves(): Record<string, GameState> {
  const out: Record<string, GameState> = {};
  try {
    migrateLegacySave();
    for (const v of VOLUMES) {
      const s = parseRunSave(localStorage.getItem(SAVE_PREFIX + v.id), def.content.nodes);
      if (s && s.currentNodeId !== "0") out[v.id] = s;
    }
  } catch {
    /* storage unavailable */
  }
  return out;
}

/** The run saved most recently, or any saved run if the record of which was lost. */
function loadRunSave(): GameState | null {
  const saves = loadRunSaves();
  try {
    const latest = localStorage.getItem(LATEST_KEY);
    if (latest && saves[latest]) return saves[latest];
  } catch {
    /* ignore */
  }
  return Object.values(saves)[0] ?? null;
}

function saveRunSave(state: GameState) {
  try {
    const id = volumeOfState(state);
    localStorage.setItem(SAVE_PREFIX + id, serializeRunSave(state));
    localStorage.setItem(LATEST_KEY, id);
  } catch {
    /* autosave is a convenience, not a guarantee, never block on it */
  }
}

/** A finished run is not something to resume: its volume's save goes, the others stay. */
function clearRunSave(state: GameState) {
  try {
    localStorage.removeItem(SAVE_PREFIX + volumeOfState(state));
  } catch {
    /* ignore */
  }
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.4M12 18.1v2.4M20.5 12h-2.4M5.9 12H3.5M17.8 6.2l-1.7 1.7M7.9 16.1l-1.7 1.7M17.8 17.8l-1.7-1.7M7.9 7.9 6.2 6.2" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="5.5" y="10.5" width="13" height="9" rx="1.2" />
      <path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7" />
    </svg>
  );
}

function CoinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8.3v7.4M9.7 9.8c0-1 1-1.7 2.3-1.7s2.3.6 2.3 1.5c0 2.2-4.6 1-4.6 3.2 0 .9 1 1.6 2.3 1.6s2.3-.6 2.3-1.6" />
    </svg>
  );
}

function OrnamentDivider() {
  return (
    <div className="ornament-divider text-blood-bright/70 my-4 select-none">
      <span className="font-heading text-sm">{"❦"}</span>
    </div>
  );
}

function CornerFlourishes() {
  return (
    <>
      <span className="corner-flourish tl" />
      <span className="corner-flourish tr" />
      <span className="corner-flourish bl" />
      <span className="corner-flourish br" />
    </>
  );
}

function Meter({ resource, value }: { resource: Resource; value: number }) {
  const range = def.config.resources.find((r) => r.id === resource) ?? { min: -10, max: 10 };
  const pct = ((value - range.min) / (range.max - range.min)) * 100;
  const inCrisis = isInCrisis(resource, value);
  const fillColor = inCrisis ? "bg-blood-bright" : value >= 0 ? "bg-verdigris-bright" : "bg-blood-bright";
  const glow = inCrisis
    ? "shadow-[0_0_10px_rgba(179,40,31,0.85)]"
    : value >= 0
    ? "shadow-[0_0_8px_rgba(92,146,105,0.6)]"
    : "shadow-[0_0_8px_rgba(179,40,31,0.55)]";
  return (
    <div className="flex-1 min-w-0" role="meter" aria-label={RESOURCE_LABELS[resource]} aria-valuemin={range.min} aria-valuemax={range.max} aria-valuenow={value} aria-valuetext={`${value}${inCrisis ? ", in crisis" : ""}`}>
      <div className="flex items-baseline justify-between mb-1 sm:mb-1.5 gap-1">
        <span className="font-heading text-[0.52rem] xs:text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.1em] sm:tracking-[0.18em] text-ink-soft font-semibold truncate">
          {RESOURCE_LABELS[resource]}
        </span>
        <span className={`font-heading text-[0.65rem] sm:text-xs font-bold tabular-nums shrink-0 ${inCrisis ? "text-blood" : "text-ink"}`}>
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <div className="gauge-track relative h-1.5 sm:h-2 rounded-sm bg-black/60 border border-brass-dim/70 overflow-hidden">
        <div className="absolute inset-y-0 w-px bg-brass/40" style={{ left: "50%" }} />
        <div
          className={`absolute inset-y-0 ${fillColor} ${glow} transition-all duration-500`}
          style={{
            left: value >= 0 ? "50%" : `${pct}%`,
            right: value >= 0 ? `${100 - pct}%` : "50%",
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-1 rounded-sm bg-brass-bright border border-black/40 transition-all duration-500"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StrandMeter({ resources }: { resources: Record<string, number> }) {
  const lines = STRAND_IDS.map((id) => ({ id, range: def.config.resources.find((r) => r.id === id)!, value: resources[id] ?? 0 }));
  if (!lines.length) return null;
  const { min, max } = lines[0].range;
  const low = Math.min(...lines.map((l) => l.value));
  const crisis = lines.some((l) => isInCrisis(l.id, l.value));
  const pct = ((low - min) / (max - min)) * 100;
  const fill = crisis || low < 0 ? "bg-blood-bright" : "bg-verdigris-bright";
  return (
    <div
      className="flex-1 min-w-0"
      role="meter"
      aria-label="The Strand"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={low}
      aria-valuetext={`${lines.map((l) => `${RESOURCE_LABELS[l.id]} ${l.value}`).join(", ")}${crisis ? ", in crisis" : ""}`}
    >
      <div className="flex items-baseline justify-between mb-1 sm:mb-1.5 gap-1">
        <span className="font-heading text-[0.52rem] xs:text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.1em] sm:tracking-[0.18em] text-ink-soft font-semibold truncate">The Strand</span>
        <span className={`font-heading text-[0.65rem] sm:text-xs font-bold tabular-nums shrink-0 ${crisis ? "text-blood" : "text-ink"}`}>{low > 0 ? `+${low}` : low}</span>
      </div>
      <div className="gauge-track relative h-1.5 sm:h-2 rounded-sm bg-black/60 border border-brass-dim/70 overflow-hidden">
        <div className="absolute inset-y-0 w-px bg-brass/40" style={{ left: "50%" }} />
        <div
          className={`absolute inset-y-0 ${fill} transition-all duration-500`}
          style={{ left: low >= 0 ? "50%" : `${pct}%`, right: low >= 0 ? `${100 - pct}%` : "50%" }}
        />
      </div>
      <ul className="mt-1.5 space-y-0.5" aria-hidden="true">
        {lines.map((l) => {
          const p = ((l.value - min) / (max - min)) * 100;
          const bad = isInCrisis(l.id, l.value);
          return (
            <li key={l.id} className="flex items-center gap-1">
              <span className="w-[2.1rem] shrink-0 font-heading text-[0.5rem] uppercase tracking-wider text-ink-soft">{RESOURCE_LABELS[l.id]}</span>
              <span className="relative h-[3px] flex-1 bg-black/50 overflow-hidden rounded-sm">
                <span className="absolute inset-y-0 w-px bg-brass/40" style={{ left: "50%" }} />
                <span
                  className={`absolute inset-y-0 ${bad || l.value < 0 ? "bg-blood-bright" : "bg-verdigris-bright"}`}
                  style={{ left: l.value >= 0 ? "50%" : `${p}%`, right: l.value >= 0 ? `${100 - p}%` : "50%" }}
                />
              </span>
              <span className={`w-3 text-right font-heading text-[0.55rem] tabular-nums ${bad ? "text-blood" : "text-ink"}`}>{l.value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StampBadge({ resource, delta }: { resource: Resource; delta: number }) {
  const positive = delta > 0;
  return (
    <span className={`stamp ${positive ? "text-verdigris-bright border-verdigris-bright" : "text-blood-bright border-blood-bright"}`}>
      {positive ? "▲" : "▼"} {RESOURCE_LABELS[resource].toUpperCase()} {positive ? "+" : ""}
      {delta}
    </span>
  );
}

const ROAD_BRANCHES = ["YARD", "STREET", "CONTINENT", "MYCROFT", ...MINOR_BRANCHES];
const BRANCH_TINT: Record<string, string> = {
  WEB: "bg-brass-dim",
  YARD: "bg-blood",
  STREET: "bg-verdigris",
  CONTINENT: "bg-ink",
  MYCROFT: "bg-brass",
  HIATUS: "bg-ink-soft",
  BOHEMIA: "bg-brass",
  BAND: "bg-verdigris",
  CARBUNCLE: "bg-blood",
  LEAGUE: "bg-brass-dim",
};
const TRUST_WORDS = ["Estranged", "Cold", "Doubtful", "Wary", "Neutral", "Warming", "Trusting", "Loyal", "Devoted"];
const trustWord = (v: number) => TRUST_WORDS[Math.max(0, Math.min(8, v + 4))];
const TRUST_AXES = def.config.axes.filter((a) => a.id.startsWith("trust"));

/** The people who stand behind you, as words and a row of pips. */
function TrustRow({ axes, flags }: { axes: Record<string, number>; flags: Record<string, boolean> }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mb-3" aria-label="Who trusts you">
      {TRUST_AXES.filter((a) => a.id !== "trustAdler" || flags.adlerMet).map((a) => {
        const v = axes[a.id] ?? 0;
        return (
          <li key={a.id} className="flex items-center justify-between gap-2 text-xs">
            <span className="font-heading uppercase tracking-widest text-ink-soft">{a.label}</span>
            <span className="flex items-center gap-1.5">
              <span className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 9 }, (_, i) => (
                  <span key={i} className={`block h-2 w-1 ${i - 4 <= v && i - 4 >= Math.min(0, v) ? (v >= 0 ? "bg-verdigris" : "bg-blood") : "bg-ink/15"}`} />
                ))}
              </span>
              <span className="text-ink/80 w-16 text-right">{trustWord(v)}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** The ending screen's account of the road: the path as a strip of scenes, what this run did not see, and where to look next. */
function RoadRecord({ state, endingsSeen }: { state: GameState; endingsSeen: Set<string> }) {
  const nodes = def.content.nodes;
  const visited = new Set(state.history.map((h) => h.nodeId));
  const road = state.history.map((h) => nodes[h.nodeId]?.branch).find((b) => ROAD_BRANCHES.includes(b));
  const roadNodes = road ? Object.values(nodes).filter((n) => n.branch === road) : [];
  const roadSeen = roadNodes.filter((n) => visited.has(n.id)).length;
  const sceneTotal = Object.keys(nodes).length;
  const unseenEndings = Object.keys(def.content.endings).filter((id) => !endingsSeen.has(id));
  const hint = unseenEndings.length ? def.flavor.endingHints?.[unseenEndings[0]] : undefined;
  return (
    <div>
      <div className="flex flex-wrap gap-0.5 mb-2" aria-hidden="true">
        {state.history.map((h, i) => (
          <span key={i} title={nodes[h.nodeId]?.title} className={`block h-3 w-3 ${BRANCH_TINT[nodes[h.nodeId]?.branch] ?? "bg-ink"} ${nodes[h.nodeId]?.options[h.optionIndex]?.roll ? "rounded-full" : ""}`} />
        ))}
      </div>
      <p className="text-sm text-ink/80 mb-3">
        {visited.size} of {sceneTotal} scenes seen
        {road ? `, ${roadSeen} of the ${roadNodes.length} on this road` : ""}. Round dots are gambits.
      </p>
      <details className="text-sm text-ink/90 mb-3">
        <summary className="cursor-pointer font-heading text-xs uppercase tracking-widest text-ink-soft">Every choice you made</summary>
        <ol className="mt-2 space-y-1 list-decimal pl-5">
          {state.history.map((h, i) => (
            <li key={i}>
              <span className="font-semibold">{nodes[h.nodeId]?.title}.</span> <span className="text-ink/80">{nodes[h.nodeId]?.options[h.optionIndex]?.label}</span>
            </li>
          ))}
        </ol>
      </details>
      <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-blood font-bold mb-2">What You Missed</p>
      <p className="text-sm text-ink/90 leading-relaxed">
        {unseenEndings.length > 0
          ? `${unseenEndings.length} of the ${TOTAL_ENDINGS} endings are still unfound in this browser.${hint ? " One hint: " + hint : ""}`
          : "Every ending has been found in this browser."}
      </p>
    </div>
  );
}

/** What each message looks like on the page (the classes are in index.css; no entry is a newspaper). */
const CARD_KIND: Record<string, string> = {
  TRANSITION_YARD: "card-telegram",
  TRANSITION_STREET: "card-note",
  CRISIS_EVIDENCE: "card-note",
  TRANSITION_MYCROFT: "card-calling",
  TRANSITION_BOHEMIA: "card-calling",
  TRANSITION_BAND: "card-telegram",
  TRANSITION_CARBUNCLE: "card-note",
  TRANSITION_REICHENBACH: "card-guide",
  CRISIS_NERVE: "card-journal",
  CRISIS_HOURS: "card-guide",
  CRISIS_HANDS: "card-note",
  CRISIS_WIRES: "card-telegram",
  DEADLINE_RAIDS_LATE: "card-telegram",
  DEADLINE_TIDE_LATE: "card-note",
  DEADLINE_HOTEL_LATE: "card-calling",
  DEADLINE_CABINET_LATE: "card-telegram",
  DEADLINE_RAIDS_EARLY: "card-journal",
  DEADLINE_TIDE_EARLY: "card-guide",
  DEADLINE_HOTEL_EARLY: "card-journal",
  DEADLINE_CABINET_EARLY: "card-telegram",
  ANSWER_CABS: "card-note",
  ANSWER_MOLE: "card-calling",
  ANSWER_PAPER: "card-note",
  ANSWER_BANK: "card-note",
  ANSWER_CABLES: "card-telegram",
};
const EXAM_SCENES = new Set(["X1", "X2", "X3", "YX1", "YX2", "YX3"]);
const ALLY_SPEAKERS: Record<string, string> = { Watson: "Dr Watson", Lestrade: "Inspector Lestrade", Mycroft: "Mycroft Holmes", Wiggins: "Wiggins" };

/** The latest thing each ally was heard to say in a choice you made. */
function lastHeard(state: GameState, speaker: string): string | null {
  for (let i = state.history.length - 1; i >= 0; i--) {
    const h = state.history[i];
    const q = def.content.nodes[h.nodeId]?.options[h.optionIndex]?.quote;
    if (q && q.speaker === speaker) return q.text;
  }
  return null;
}

/** The option that leaves the lowest gauge highest, counting what a gambit is expected to give: Watson's suggestion on the easiest setting. */
function watsonSuggestion(state: GameState, options: Option[]): number | null {
  let best = -1;
  let bestScore = -Infinity;
  options.forEach((o, i) => {
    if (isOptionUnavailable(def, state, o)) return;
    const exp: Record<string, number> = {};
    const add = (stamps: Record<string, number | undefined>, weight: number) => {
      const eff = effectiveStamps(def, state.resources, stamps);
      for (const r of RESOURCE_IDS) exp[r] = (exp[r] ?? 0) + weight * (eff[r] ?? 0);
    };
    if (o.roll) {
      const p = effectiveRollChance(o.roll, state.resources, def.config.strain);
      add(o.roll.success.stamps, p);
      add(o.roll.failure.stamps, 1 - p);
    } else add(o.stamps, 1);
    const after = RESOURCE_IDS.map((r) => (state.resources[r] ?? 0) + (exp[r] ?? 0));
    const score = Math.min(...after) * 10 + after.reduce((a, b) => a + b, 0);
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return best < 0 ? null : best;
}

/** A closed-by-default section: one line until the player opens it. */
function Fold({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="mt-3 border-t border-ink/15 pt-3 group/fold">
      <summary className="cursor-pointer font-heading text-[0.65rem] uppercase tracking-[0.25em] text-blood font-bold select-none">{title}</summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function VoidScreen({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex items-center justify-center px-4 py-10">{children}</div>;
}

export default function App() {
  // Engine state: only the pure reducer changes it. Everything else below is UI-only.
  const [state, dispatch] = useReducer((s: GameState, a: Action) => reduce(def, s, a), undefined, () => createInitialState(def));
  const [prefs, setPrefs] = useState<UiPrefs>(loadSettings);
  const [theme, setTheme] = useState<Theme>(loadTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* private window: the look simply does not persist */
    }
  }, [theme]);
  const [overlay, setOverlay] = useState<"SETTINGS" | "RESEARCH" | "LEDGER" | null>(null);
  // The demo build locks the long case on arriving at the first scene of a road (src/demo.ts); the full game never does.
  const demoStop = IS_DEMO && state.phase === "NODE" && isDemoStop(def, state.currentNodeId);
  const screen: string = overlay ?? (demoStop ? "DEMO_END" : state.phase);
  const rules = def.config.difficulties[state.difficulty];
  const interlude = state.activeInterludeId ? def.content.interludes[state.activeInterludeId] : undefined;
  const shellRef = useRef<HTMLElement>(null);
  const [favorPanelOpen, setFavorPanelOpen] = useState(false);
  const [houseTab, setHouseTab] = useState<"HOUSE" | "COMPANY" | "BOARD" | "MAP" | "CALENDAR" | null>(null);
  // browsers keep a page silent until the player has acted on it, so the atmosphere waits for the first click
  const [heard, setHeard] = useState(false);
  const [gossipLine, setGossipLine] = useState<string | null>(null);
  const [notebookLine, setNotebookLine] = useState<string | null>(null);
  // Two-tap option confirmation: the first tap on an option just "arms" it
  // (a color change, no dispatch); tapping the same option again is what
  // actually commits the choice. Craig's feedback was that the old design —
  // only the bold label line was clickable, the rest of the card inert —
  // read as unclear about what to tap; this makes the whole card the tap
  // target and adds a deliberate confirm step so a stray tap can't commit a
  // story choice by accident.
  const [armedOptionIndex, setArmedOptionIndex] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [suspenseTick, setSuspenseTick] = useState(0);
  const [resumableSave, setResumableSave] = useState<GameState | null>(() => loadRunSave());
  const [endingsSeen, setEndingsSeen] = useState<Set<string>>(() => loadEndingsSeen());
  const [isNewEnding, setIsNewEnding] = useState(false);
  const [ledger, setLedger] = useState<Ledger>(() => loadLedger());
  const recordedState = useRef<GameState | null>(null);
  const [copyNote, setCopyNote] = useState("");

  // Baker Street waits outside each scene rather than staying underfoot: collapse
  // the panel (and clear any overheard line, which is scoped to the scene it
  // was said in) every time a new scene loads, so "Send for Baker Street" is a
  // fresh call each time rather than a state that leaks across choices.
  useEffect(() => {
    setHouseTab((t) => (t === "MAP" ? t : null));
    setFavorPanelOpen(false);
    setGossipLine(null);
    setNotebookLine(null);
    setArmedOptionIndex(null);
  }, [state.currentNodeId]);

  // A new screen or scene puts focus on its heading, so a screen reader announces what changed and a keyboard user starts at the top. (The page
  // is also returned to the top: a long scene used to leave the next screen scrolled part way down.)
  useEffect(() => {
    const root = shellRef.current;
    if (!root) return;
    const heading = root.querySelector<HTMLElement>("[data-screen-heading]") ?? root.querySelector<HTMLElement>("h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
    window.scrollTo(0, 0);
  }, [screen, state.currentNodeId, state.activeInterludeId]);

  // The Experiment screen's suspense phase: a fixed-length hold between the
  // player committing to a roll and the real outcome resolving, so the only
  // mechanically-random moment in the game gets a beat of tension instead of
  // resolving instantly on click. The interval just cycles a display index
  // for the phrase/pulse shown below; the actual CONDUCT_EXPERIMENT dispatch
  // fires once, from the timeout, and both are torn down on cleanup so a
  // screen change mid-roll (there isn't a way to trigger one today, but
  // defensively) can never leave a dangling dispatch.
  useEffect(() => {
    if (!rolling) return;
    const interval = setInterval(() => setSuspenseTick((t) => t + 1), 380);
    const timeout = setTimeout(() => {
      dispatch({ type: "CONDUCT_EXPERIMENT", roll: Math.random() });
      setRolling(false);
      setSuspenseTick(0);
    }, ROLL_SUSPENSE_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolling]);

  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SIZE_PX[prefs.fontSize];
    saveSettings(prefs.fontSize, prefs.musicEnabled, prefs.musicVolume, prefs.sfxEnabled, prefs.sfxVolume);
  }, [prefs.fontSize, prefs.musicEnabled, prefs.musicVolume, prefs.sfxEnabled, prefs.sfxVolume]);

  // Mid-run autosave: every state change while a run is in progress is
  // written to localStorage, so refreshing or losing the tab doesn't lose
  // the run. Cleared on reaching the menu (a fresh RESTART) or an ending
  // (a finished run isn't something to resume back into). Only ENDING
  // clears it — MENU used to clear it as well, but MENU is also the
  // screen a fresh page load starts on, so that branch was wiping a
  // perfectly valid save off disk on every single load, a heartbeat after
  // mount, before the player ever got a chance to use it. It went
  // unnoticed only because the button below used to read a copy of the
  // save captured in memory before this effect ran, never checking disk
  // again — which is exactly the staleness this round fixes. MENU is only
  // ever reached from a fresh load or from Restart (dispatched solely on
  // the ENDING screen, after this same effect has already cleared the
  // save via the ENDING branch), so ENDING alone is the correct trigger.
  useEffect(() => {
    // the shelf is not a case: an unfinished one from an earlier visit stays on disk until a volume is opened over it
    if (IN_RUN_SCREENS.has(state.phase)) {
      if (state.currentNodeId !== "0") saveRunSave(state);
    }
    else if (state.phase === "ENDING") clearRunSave(state);
  }, [state]);

  // Re-reads localStorage every time the menu is reached, rather than only
  // at mount: the button previously reflected whatever save existed on page
  // load and never updated again for the rest of the session, so it could
  // keep pointing at a run that had already finished and been cleared above.
  useEffect(() => {
    if (state.phase === "MENU") setResumableSave(loadRunSave());
  }, [state.phase]);

  // Tracks which of the 12 endings this browser has discovered, for the
  // menu's progress counter and the "new ending" note on the ending screen
  // itself. Persisted separately from the run save, since it should survive
  // across runs rather than being cleared when one finishes.
  useEffect(() => {
    if (screen !== "ENDING" || !state.endingId) return;
    // Once per finished run: opening Settings over the ending screen and coming back must not count it again.
    if (recordedState.current === state) return;
    recordedState.current = state;
    setCopyNote("");
    const nextLedger = recordRun(ledger, runRecord(def, state));
    setLedger(nextLedger);
    saveLedger(nextLedger);
    const id = state.endingId;
    const wasNew = !endingsSeen.has(id);
    setIsNewEnding(wasNew);
    if (wasNew) {
      setEndingsSeen((prev) => {
        const next = new Set(prev);
        next.add(id);
        saveEndingsSeen(next);
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, state.endingId]);

  // Sound effects tied to screen transitions rather than clicks alone, so
  // they fire once per transition regardless of which button caused it.
  useEffect(() => {
    if (!prefs.sfxEnabled) return;
    if (screen === "OUTCOME") {
      if (state.pendingOutcomeKind === "SUCCESS") sfx.playSuccess(prefs.sfxVolume);
      else if (state.pendingOutcomeKind === "FAILURE") sfx.playFailure(prefs.sfxVolume);
    } else if (screen === "INTERLUDE" && interlude?.kind === "crisis") {
      const idx = RESOURCE_IDS.findIndex((r) => interlude.id === `CRISIS_${r.toUpperCase()}`);
      sfx.playGaugeCrisis(prefs.sfxVolume, Math.max(0, idx));
    } else if (screen === "INTERLUDE" && interlude?.id === "TRANSITION_REICHENBACH") {
      sfx.playViolin(prefs.sfxVolume);
    } else if (screen === "ENDING") {
      if (state.endingId?.startsWith("ENDING_CRISIS")) sfx.playEndingCrisis(prefs.sfxVolume);
      else {
        sfx.playEnding(prefs.sfxVolume);
        if (state.endingId === "ENDING_THE_FALL" || state.endingId === "ENDING_FATAL_SHOT") sfx.playViolin(prefs.sfxVolume);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, state.pendingOutcomeKind, state.activeInterludeId]);

  // the atmosphere: on while the setting is on and the player has acted on the page
  useEffect(() => {
    if (prefs.musicEnabled && heard) sfx.startAmbient(prefs.musicVolume);
    else sfx.stopAmbient();
  }, [prefs.musicEnabled, heard]);
  useEffect(() => {
    sfx.setAmbientVolume(prefs.musicVolume);
  }, [prefs.musicVolume]);

  function wake() {
    if (!heard) setHeard(true);
  }
  function click() {
    wake();
    if (prefs.sfxEnabled) sfx.playClick(prefs.sfxVolume);
  }
  function select() {
    wake();
    if (prefs.sfxEnabled) sfx.playSelect(prefs.sfxVolume);
  }
  function pageTurn() {
    wake();
    if (prefs.sfxEnabled) sfx.playPageTurn(prefs.sfxVolume);
  }
  function unlock() {
    wake();
    if (prefs.sfxEnabled) sfx.playUnlock(prefs.sfxVolume);
  }

  const settingsButton = (
    <button
      onClick={() => {
        click();
        setOverlay("SETTINGS");
      }}
      aria-label="Settings"
      className="fixed top-4 right-4 z-40 p-2 rounded-full border border-brass-dim/70 bg-black/50 text-brass hover:text-brass-bright hover:border-brass transition-colors"
    >
      <GearIcon className="w-4 h-4" />
    </button>
  );

  let content: JSX.Element;

  if (screen === "SETTINGS") {
    content = (
      <VoidScreen>
        <div className="parchment-card max-w-sm w-full p-7 font-body text-ink relative" role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <CornerFlourishes />
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-blood font-bold mb-1" aria-hidden="true">Settings</p>
          <h1 id="settings-title" className="font-heading text-2xl font-bold mb-5">Print and Sound</h1>

          <p className="font-heading text-xs uppercase tracking-widest text-ink-soft/80 mb-2">Font Size</p>
          <div className="flex gap-2 mb-7">
            {(["small", "medium", "large"] as FontSize[]).map((size) => (
              <button
                key={size}
                onClick={() => {
                  click();
                  setPrefs((p) => ({ ...p, fontSize: size }));
                }}
                className={`flex-1 py-2 border font-heading text-xs uppercase tracking-widest transition-colors ${
                  prefs.fontSize === size
                    ? "bg-ink text-parchment border-ink"
                    : "border-ink/30 text-ink/70 hover:border-ink/60"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <p className="font-heading text-xs uppercase tracking-widest text-ink-soft/80 mb-2">Look</p>
          <div className="flex gap-2 mb-7">
            {(["tweed", "paper"] as Theme[]).map((t) => (
              <button
                key={t}
                aria-pressed={theme === t}
                aria-label={t === "tweed" ? "Look: tweed, a dark parlour" : "Look: paper, the parlour in daylight"}
                onClick={() => {
                  click();
                  setTheme(t);
                }}
                className={`flex-1 py-2 border font-heading text-xs uppercase tracking-widest transition-colors ${
                  theme === t ? "bg-ink text-parchment border-ink" : "border-ink/30 text-ink/70 hover:border-ink/60"
                }`}
              >
                {t === "tweed" ? "Tweed" : "Paper"}
              </button>
            ))}
          </div>

          <p className="font-heading text-xs uppercase tracking-widest text-ink-soft/80 mb-2">Atmosphere</p>
          <div className="flex gap-2 mb-4">
            <button
              aria-label="Atmosphere on"
              onClick={() => {
                setHeard(true);
                setPrefs((p) => ({ ...p, musicEnabled: true }));
              }}
              className={`flex-1 py-2 border font-heading text-xs uppercase tracking-widest transition-colors ${
                prefs.musicEnabled ? "bg-ink text-parchment border-ink" : "border-ink/30 text-ink/70 hover:border-ink/60"
              }`}
            >
              On
            </button>
            <button
              aria-label="Atmosphere off"
              onClick={() => setPrefs((p) => ({ ...p, musicEnabled: false }))}
              className={`flex-1 py-2 border font-heading text-xs uppercase tracking-widest transition-colors ${
                !prefs.musicEnabled ? "bg-ink text-parchment border-ink" : "border-ink/30 text-ink/70 hover:border-ink/60"
              }`}
            >
              Off
            </button>
          </div>
          <label className="block mb-7">
            <span className="font-heading text-[0.65rem] uppercase tracking-widest text-ink-soft/70">
              Atmosphere volume: {Math.round(prefs.musicVolume * 100)}%
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={prefs.musicVolume}
              disabled={!prefs.musicEnabled}
              onChange={(e) => setPrefs((p) => ({ ...p, musicVolume: Number(e.target.value) }))}
              className="w-full mt-2 accent-blood"
            />
          </label>

          <p className="font-heading text-xs uppercase tracking-widest text-ink-soft/80 mb-2">Sound Effects</p>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setPrefs((p) => ({ ...p, sfxEnabled: true }));
                sfx.playClick(prefs.sfxVolume || 0.6);
              }}
              className={`flex-1 py-2 border font-heading text-xs uppercase tracking-widest transition-colors ${
                prefs.sfxEnabled ? "bg-ink text-parchment border-ink" : "border-ink/30 text-ink/70 hover:border-ink/60"
              }`}
            >
              On
            </button>
            <button
              onClick={() => setPrefs((p) => ({ ...p, sfxEnabled: false }))}
              className={`flex-1 py-2 border font-heading text-xs uppercase tracking-widest transition-colors ${
                !prefs.sfxEnabled ? "bg-ink text-parchment border-ink" : "border-ink/30 text-ink/70 hover:border-ink/60"
              }`}
            >
              Off
            </button>
          </div>
          <label className="block mb-7">
            <span className="font-heading text-[0.65rem] uppercase tracking-widest text-ink-soft/70">
              Volume: {Math.round(prefs.sfxVolume * 100)}%
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={prefs.sfxVolume}
              disabled={!prefs.sfxEnabled}
              onChange={(e) => setPrefs((p) => ({ ...p, sfxVolume: Number(e.target.value) }))}
              className="w-full mt-2 accent-blood"
            />
          </label>

          <p className="font-heading text-xs uppercase tracking-widest text-ink-soft/80 mb-2">Dispatches</p>
          <p className="text-xs text-ink/70 mb-3 leading-relaxed">
            Sherlock Holmes: The Final Problem is one entry in the Dispatches series of historically-grounded branching narrative games.
          </p>
          <a
            href="https://dispatches.itch.io"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => click()}
            className="mb-7 block w-full text-center px-5 py-2.5 border border-ink/40 text-ink font-heading font-semibold uppercase text-xs tracking-widest hover:border-ink hover:bg-ink hover:text-parchment transition-colors"
          >
            See the Rest of the Series
          </a>

          <button
            onClick={() => {
              click();
              setOverlay(null);
            }}
            className="w-full px-5 py-2.5 bg-blood text-parchment font-heading font-semibold uppercase text-xs tracking-widest hover:bg-blood-bright transition-colors"
          >
            Close
          </button>
        </div>
      </VoidScreen>
    );
  } else if (screen === "DEMO_END" && def.flavor.demoEnd) {
    const demoEnd = def.flavor.demoEnd;
    content = (
      <VoidScreen>
        {settingsButton}
        <div className="parchment-card max-w-xl w-full p-8 sm:p-10 font-body text-ink relative">
          <CornerFlourishes />
          <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-5">{demoEnd.title}</h1>
          <div className="space-y-4 text-[1.05rem] leading-relaxed">
            {demoEnd.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => {
                click();
                dispatch({ type: "RESTART" });
              }}
              className="px-5 py-2.5 bg-blood text-parchment font-heading font-semibold uppercase text-xs tracking-widest hover:bg-blood-bright transition-colors"
            >
              {demoEnd.restart}
            </button>
          </div>
        </div>
      </VoidScreen>
    );
  } else if (screen === "LEDGER") {
    const endingIds = Object.keys(def.content.endings);
    const found = endingIds.filter((id) => endingsSeen.has(id) || (ledger.endings[id] ?? 0) > 0);
    content = (
      <VoidScreen>
        <div className="parchment-card max-w-2xl w-full p-8 sm:p-10 font-body text-ink relative max-h-[85vh] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="ledger-title">
          <CornerFlourishes />
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-blood font-bold mb-1">Kept in this browser</p>
          <h1 id="ledger-title" className="font-heading text-2xl font-bold mb-1">The Case-Book</h1>
          <p className="font-heading text-xs uppercase tracking-widest text-ink-soft mb-6">
            {found.length} / {endingIds.length} endings found
          </p>
          <ul className="space-y-3">
            {endingIds.map((id) => {
              const seen = found.includes(id);
              const times = ledger.endings[id] ?? 0;
              return (
                <li key={id} className="border-b border-ink/15 pb-3">
                  {seen ? (
                    <>
                      <h2 className="font-heading text-sm font-bold">
                        {def.content.endings[id].title}
                        {times > 1 ? <span className="text-ink-soft font-normal"> · reached {times} times</span> : null}
                      </h2>
                      {def.flavor.novelNotes?.[id] && <p className="text-sm text-ink/80 mt-1">{def.flavor.novelNotes[id]}</p>}
                    </>
                  ) : (
                    <>
                      <h2 className="font-heading text-sm font-bold text-ink-soft">Not yet found</h2>
                      {def.flavor.endingHints?.[id] && <p className="text-sm text-ink/80 mt-1">{def.flavor.endingHints[id]}</p>}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          {ledger.runs.length > 0 && (
            <>
              <h2 className="font-heading text-sm uppercase tracking-widest text-blood font-bold mt-7 mb-2">Your last runs</h2>
              <ol className="space-y-1.5 text-sm">
                {ledger.runs.map((r, i) => (
                  <li key={i}>
                    <span className="font-semibold">{def.content.endings[r.endingId]?.title ?? r.endingId}</span>
                    <span className="text-ink-soft">
                      {" "}
                      · {def.flavor.difficultyInfo?.[r.difficulty as Difficulty]?.label ?? r.difficulty} · {count(r.choices, "choice")}, {count(r.experiments, "gambit")}
                    </span>
                  </li>
                ))}
              </ol>
            </>
          )}
          <button
            onClick={() => {
              click();
              setOverlay(null);
            }}
            className="mt-8 px-6 py-2.5 bg-ink text-parchment font-heading font-semibold uppercase text-xs tracking-widest hover:bg-ink-soft transition-colors"
          >
            Back
          </button>
        </div>
      </VoidScreen>
    );
  } else if (screen === "RESEARCH") {
    content = (
      <VoidScreen>
        <div className="parchment-card max-w-2xl w-full p-8 sm:p-10 font-body text-ink relative max-h-[85vh] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="research-title">
          <CornerFlourishes />
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-blood font-bold mb-1">How To</p>
          <h1 id="research-title" className="font-heading text-2xl font-bold mb-6">How to Play</h1>
          <div className="space-y-5">
            {def.flavor.howToPlay.map((section) => (
              <div key={section.heading}>
                <h2 className="font-heading text-sm uppercase tracking-widest text-blood font-bold mb-1.5">
                  {section.heading}
                </h2>
                <p className="text-[0.98rem] leading-relaxed text-ink/90">{section.body}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              click();
              setOverlay(null);
            }}
            className="mt-8 px-6 py-2.5 bg-ink text-parchment font-heading font-semibold uppercase text-xs tracking-widest hover:bg-ink-soft transition-colors"
          >
            Back
          </button>
        </div>
      </VoidScreen>
    );
  } else if (screen === "MENU") {
    content = (
      <VoidScreen>
        <div className="max-w-lg w-full text-center">
          <PlateView id="emblem" tone="light" />
          <p className="font-heading text-xs uppercase tracking-[0.5em] text-brass/80 mb-3">A Dispatches Chronicle</p>
          <h1 className="flicker font-display text-5xl sm:text-6xl font-bold text-parchment leading-tight mb-2">
            Sherlock Holmes
          </h1>
          <p className="font-heading text-sm sm:text-base uppercase tracking-[0.35em] text-brass mb-10">
            The Final Problem
          </p>
          <OrnamentDivider />
          <button
            onClick={() => {
              select();
              dispatch({ type: "START_GAME" });
            }}
            className="mt-6 w-full sm:w-auto px-10 py-3.5 border border-brass text-parchment font-heading uppercase text-sm tracking-[0.25em] hover:bg-brass hover:text-ink transition-colors"
          >
            Begin the Case
          </button>
          {resumableSave && (
            <button
              onClick={() => {
                select();
                dispatch({ type: "HYDRATE", state: resumableSave });
              }}
              className="mt-3 w-full sm:w-auto block mx-auto px-10 py-2.5 border border-brass-dim/70 text-ash font-heading uppercase text-xs tracking-[0.2em] hover:border-brass hover:text-parchment transition-colors"
            >
              Resume the Case{volumeOfBranch(resumableSave.activeBranch) ? `: ${volumeOfBranch(resumableSave.activeBranch)!.title}` : ""}
            </button>
          )}
          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={() => {
                click();
                setOverlay("RESEARCH");
              }}
              className="px-6 py-2.5 border border-brass-dim text-ash font-heading uppercase text-xs tracking-widest hover:border-brass hover:text-parchment transition-colors"
            >
              How To
            </button>
            <button
              onClick={() => {
                click();
                setOverlay("SETTINGS");
              }}
              className="px-6 py-2.5 border border-brass-dim text-ash font-heading uppercase text-xs tracking-widest hover:border-brass hover:text-parchment transition-colors"
            >
              Settings
            </button>
            {endingsSeen.size > 0 && (
              <button
                onClick={() => {
                  click();
                  setOverlay("LEDGER");
                }}
                className="px-6 py-2.5 border border-brass-dim text-ash font-heading uppercase text-xs tracking-widest hover:border-brass hover:text-parchment transition-colors"
              >
                Case-Book
              </button>
            )}
          </div>
          {endingsSeen.size > 0 && (
            <p className="mt-6 font-heading text-[0.65rem] uppercase tracking-[0.2em] text-ash">
              {endingsSeen.size} / {TOTAL_ENDINGS} Endings Discovered
            </p>
          )}
          <p className="mt-8 font-body italic text-ash text-sm">
            London, 1891. A man who has never been charged with a crime is running the city.
          </p>
        </div>
      </VoidScreen>
    );
  } else if (screen === "PROLOGUE") {
    content = (
      <VoidScreen>
        <div className="parchment-card max-w-xl w-full p-8 sm:p-10 font-body text-ink relative">
          <CornerFlourishes />
          <h1 className="font-heading text-xs uppercase tracking-[0.3em] text-blood font-bold mb-5">From a Private Journal</h1>
          <div className="space-y-4 text-[1.05rem] leading-relaxed">
            {def.flavor.prologue.map((para, i) => (
              <p key={i} className={i === 0 ? "font-heading text-lg tracking-wide" : ""}>
                {para}
              </p>
            ))}
          </div>
          <button
            onClick={() => {
              click();
              dispatch({ type: "ADVANCE_PROLOGUE" });
            }}
            className="mt-8 px-6 py-2.5 bg-ink text-parchment font-heading font-semibold uppercase text-xs tracking-widest hover:bg-ink-soft transition-colors"
          >
            Continue
          </button>
        </div>
      </VoidScreen>
    );
  } else if (screen === "CHAPTER_CARD") {
    content = (
      <VoidScreen>
        <div className="text-center max-w-lg w-full">
          <OrnamentDivider />
          <h1 className="flicker font-display text-4xl sm:text-5xl font-bold text-parchment my-6">
            {def.flavor.chapterCard.title}
          </h1>
          <p className="font-heading text-xs uppercase tracking-[0.4em] text-brass/80 mb-8">{def.flavor.chapterCard.subtitle}</p>

          <p className="font-heading text-xs uppercase tracking-[0.3em] text-ash mb-3">Choose Your Difficulty</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            {(["EASY", "MEDIUM", "HARD"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  click();
                  dispatch({ type: "SET_DIFFICULTY", difficulty: d });
                }}
                className={`px-4 py-2.5 border font-heading uppercase text-xs tracking-[0.2em] transition-colors ${
                  state.difficulty === d
                    ? "bg-brass text-ink border-brass"
                    : "border-brass-dim/70 text-parchment hover:border-brass"
                }`}
              >
                {DIFFICULTY_INFO[d].label}
              </button>
            ))}
          </div>
          <p className="text-ash text-sm italic mb-8 min-h-[2.5rem] px-2">{DIFFICULTY_INFO[state.difficulty].blurb}</p>

          <OrnamentDivider />
          <button
            onClick={() => {
              select();
              dispatch({ type: "ENTER_STORY" });
            }}
            className="mt-4 px-8 py-3 border border-brass text-parchment font-heading uppercase text-sm tracking-[0.25em] hover:bg-brass hover:text-ink transition-colors"
          >
            Enter
          </button>
          {endingsSeen.size > 0 && (
            <div className="mt-6">
              <button
                onClick={() => {
                  select();
                  dispatch({ type: "SKIP_TO_ACT2" });
                }}
                className="px-6 py-2 border border-brass-dim/60 text-ash font-heading uppercase text-xs tracking-[0.15em] hover:border-brass hover:text-parchment transition-colors"
              >
                Skip to the Monday Plan
              </button>
              <p className="text-ash/70 text-sm italic mt-2 max-w-xs mx-auto">
                Jumps straight to the choice that decides your road. Your reserves reset to zero
                {rules.enforceMoney ? ", your purse refills to its full starting sum," : ""} and any
                option that depended on an earlier choice is out of reach for the rest of this run.
              </p>
            </div>
          )}
        </div>
      </VoidScreen>
    );
  } else if (screen === "ENDING") {
    const ending = resolveEnding(def, state);
    const isFailure = state.endingId?.startsWith("ENDING_CRISIS");
    const thisRun = runRecord(def, state);
    const carried = carriedNotes(def, thisRun);
    const novelNote = state.endingId ? def.flavor.novelNotes?.[state.endingId] : undefined;
    content = (
      <VoidScreen>
        {settingsButton}
        <div className="parchment-card max-w-2xl w-full p-8 sm:p-10 font-body text-ink relative">
          <CornerFlourishes />
          <p className={`font-heading text-xs uppercase tracking-[0.3em] font-bold mb-2 ${isFailure ? "text-blood" : "text-brass-dim"}`}>
            {isFailure ? "The Case Is Lost" : "The Case Is Closed"}
          </p>
          <PlateView id={plateForEnding(state.endingId ?? "")} />
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-1 leading-tight">{ending.title}</h1>
          <p className="font-heading text-[0.65rem] uppercase tracking-[0.2em] text-brass-dim font-semibold mb-4">
            {isNewEnding ? "New Ending Discovered" : "An Ending You've Reached Before"} · {endingsSeen.size} / {TOTAL_ENDINGS}
          </p>
          <p className="font-heading text-sm uppercase tracking-wide text-ink-soft font-bold mb-6 border-b border-ink/20 pb-4">
            {ending.headline}
          </p>
          <p className="leading-relaxed text-[1.05rem] whitespace-pre-line">{ending.text}</p>
          {ending.epilogueLabel && (
            <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-brass-dim font-semibold mt-4">
              How It's Remembered: <span className="text-ink">{ending.epilogueLabel}</span>
            </p>
          )}

          <p className="mt-5 pt-4 border-t border-ink/20 text-sm text-ink/80">
            {DIFFICULTY_INFO[state.difficulty].label} · {state.history.length} choices ·{" "}
            {RESOURCE_IDS.map((r) => `${RESOURCE_LABELS[r]} ${state.resources[r] > 0 ? "+" : ""}${state.resources[r]}`).join(", ")}
          </p>
          {(() => {
            const here = volumeOfEnding(state.endingId ?? "");
            const seen = new Set(endingsSeen);
            seen.add(state.endingId ?? "");
            const stats = volumeStats(seen);
            const mine = stats.find((s) => s.volume.id === here.id)!;
            const opened = stats.filter((s) => s.finished).length;
            const next = stats.find((s) => !s.finished);
            return (
              <div className="mt-4 text-sm text-ink/85" aria-label="The Case-Book">
                <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-brass-dim font-semibold mb-1">The Case-Book</p>
                <p>
                  <span className="font-semibold">{here.title}</span> ({here.major ? "the major case" : "a minor case"}, {here.year}): {mine.found} of {mine.total} endings found.
                </p>
                <p>
                  {opened} of {VOLUMES.length} volumes finished.{" "}
                  {next ? `Next on the shelf: ${next.volume.title} (${next.volume.major ? "the major case" : "a minor case"}).` : "Every volume has been finished at least once."}
                </p>
              </div>
            );
          })()}
          <Fold title="Your Record">
          <div>
            <div className={`grid grid-cols-2 gap-3 text-sm ${rules.enforceMoney ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
              <div>
                <p className="font-heading text-[0.6rem] uppercase tracking-widest text-ink-soft/70">Road</p>
                <p className="font-semibold">{BRANCH_LABELS[state.activeBranch]?.split("· ")[1] ?? state.activeBranch}</p>
              </div>
              <div>
                <p className="font-heading text-[0.6rem] uppercase tracking-widest text-ink-soft/70">Choices Made</p>
                <p className="font-semibold">{state.history.length}</p>
              </div>
              <div>
                <p className="font-heading text-[0.6rem] uppercase tracking-widest text-ink-soft/70">Difficulty</p>
                <p className="font-semibold">{DIFFICULTY_INFO[state.difficulty].label}</p>
              </div>
              {rules.enforceMoney && (
                <div>
                  <p className="font-heading text-[0.6rem] uppercase tracking-widest text-ink-soft/70">Purse Left</p>
                  <p className="font-semibold">£{state.money}</p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {RESOURCE_IDS.map((r) => (
                <div key={r} className="flex-1 min-w-[5rem]">
                  <p className="font-heading text-[0.6rem] uppercase tracking-widest text-ink-soft/70">{RESOURCE_LABELS[r]}</p>
                  <p className={`font-heading text-lg font-bold ${isInCrisis(r, state.resources[r]) ? "text-blood" : "text-ink"}`}>
                    {state.resources[r] > 0 ? `+${state.resources[r]}` : state.resources[r]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          </Fold>
          <Fold title="The Road You Took">
            <RoadRecord state={state} endingsSeen={endingsSeen} />
          </Fold>
          {carried.length > 0 && (
            <Fold title="What You Carried">
              <ul className="list-disc pl-5 space-y-1 text-sm text-ink/90">
                {carried.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </Fold>
          )}
          {novelNote && (
            <Fold title="In the Canon">
              <p className="text-sm text-ink/90 leading-relaxed">{novelNote}</p>
            </Fold>
          )}
          <Fold title="Share Card">
            <div className="border border-ink/30 bg-black/[0.03] p-4" aria-label="Share card">
              <p className="text-sm text-ink/90 whitespace-pre-line">{summaryText(def, thisRun, ending.title)}</p>
            </div>
          </Fold>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                click();
                setFavorPanelOpen(false);
                dispatch({ type: "RESTART" });
              }}
              className="px-5 py-2.5 bg-blood text-parchment font-heading font-semibold uppercase text-xs tracking-widest hover:bg-blood-bright transition-colors"
            >
              Open a New Case
            </button>
            <button
              onClick={() => {
                click();
                const text = summaryText(def, thisRun, ending.title);
                navigator.clipboard.writeText(text).then(
                  () => setCopyNote("Summary copied."),
                  () => setCopyNote("Could not copy. Select the record above instead."),
                );
              }}
              className="px-5 py-2.5 border border-ink text-ink font-heading font-semibold uppercase text-xs tracking-widest hover:bg-ink hover:text-parchment transition-colors"
            >
              Copy Share Card
            </button>
            <span role="status" className="text-sm text-ink-soft">
              {copyNote}
            </span>
          </div>
        </div>
      </VoidScreen>
    );
  } else if (screen === "INTERLUDE" && interlude) {
    const paper = interlude;
    content = (
      <VoidScreen>
        <div className={`max-w-xl w-full bg-parchment border-4 border-double border-ink p-6 sm:p-8 font-broadsheet text-ink shadow-2xl relative ${CARD_KIND[paper.id] ?? ""}`}>
          <div className="flex items-center justify-between border-b-2 border-ink pb-2 mb-4">
            <span className="text-xs uppercase tracking-[0.25em] font-bold">{paper.source}</span>
            <span className="text-xs uppercase tracking-widest text-ink/60">{paper.kind === "transition" ? "Notice" : paper.kind === "lore" ? "Report" : "Warning"}</span>
          </div>
          {plateForInterlude(paper.id) && <PlateView id={plateForInterlude(paper.id)!} />}
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">{paper.headline}</h1>
          <p className="font-body text-sm leading-relaxed columns-1 sm:columns-2 gap-6 whitespace-pre-line">{paper.bodyText}</p>
          {state.pendingOutcomeStamps && Object.values(state.pendingOutcomeStamps).some(Boolean) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-heading text-[0.6rem] uppercase tracking-widest text-ink-soft/80">What changed</span>
              {Object.entries(state.pendingOutcomeStamps).map(([resource, delta]) => (delta ? <StampBadge key={resource} resource={resource as Resource} delta={delta} /> : null))}
            </div>
          )}
          <button
            onClick={() => {
              pageTurn();
              dispatch({ type: "DISMISS_INTERLUDE" });
            }}
            className="mt-6 px-4 py-2 border border-ink text-ink font-heading font-semibold uppercase text-xs tracking-widest hover:bg-ink hover:text-parchment transition-colors"
          >
            Turn the Page
          </button>
        </div>
      </VoidScreen>
    );
  } else if (screen === "ROLL" && state.pendingRoll) {
    const pct = Math.round(effectiveRollChance(state.pendingRoll, state.resources, def.config.strain) * 100);
    const strainPct = Math.round(rollStrain(state.pendingRoll, state.resources, def.config.strain) * 100);
    const strainAbout = state.pendingRoll.about ?? state.pendingRoll.scaling?.resource;
    content = (
      <VoidScreen>
        {settingsButton}
        <div className="parchment-card max-w-xl w-full p-8 sm:p-10 font-body text-ink relative text-center">
          <CornerFlourishes />
          <h1 className="font-heading text-xs uppercase tracking-[0.3em] text-blood font-bold mb-4">A Gambit</h1>
          {state.pendingOptionLabel && (
            <h2 className="font-heading text-xl font-bold mb-3">{state.pendingOptionLabel}</h2>
          )}
          {state.pendingOptionQuote && <QuoteLine quote={state.pendingOptionQuote} className="text-sm italic text-ink/70 mb-6" />}
          <div className="my-6">
            <span
              className={`font-heading text-4xl font-bold text-blood inline-block ${rolling ? "tension-pulse" : ""}`}
            >
              {pct}%
            </span>
            <p className="font-heading text-xs uppercase tracking-widest text-ink-soft mt-1">Chance of Success</p>
            {strainPct > 0 && strainAbout && (
              <p className="font-heading text-xs uppercase tracking-widest text-blood font-bold mt-2">
                Strain: {RESOURCE_LABELS[strainAbout]} is short, so the odds are {strainPct} points worse
              </p>
            )}
          </div>
          {rolling && (
            <p className="text-sm italic text-ink/70 mb-4 min-h-[1.5rem]" aria-live="polite">
              {ROLL_SUSPENSE_PHRASES[suspenseTick % ROLL_SUSPENSE_PHRASES.length]}
            </p>
          )}
          <button
            disabled={rolling}
            onClick={() => {
              if (rolling) return;
              select();
              if (prefs.sfxEnabled) sfx.playTension(prefs.sfxVolume);
              setSuspenseTick(0);
              setRolling(true);
            }}
            className={`px-6 py-2.5 font-heading font-semibold uppercase text-xs tracking-widest transition-colors ${
              rolling
                ? "bg-blood/40 text-parchment/70 cursor-not-allowed tension-pulse"
                : "bg-blood text-parchment hover:bg-blood-bright"
            }`}
          >
            {rolling ? "Holding Its Breath..." : "Play the Gambit"}
          </button>
        </div>
      </VoidScreen>
    );
  } else if (screen === "OUTCOME") {
    const kindLabel =
      state.pendingOutcomeKind === "SUCCESS"
        ? "The Gambit Pays"
        : state.pendingOutcomeKind === "FAILURE"
        ? "The Gambit Fails"
        : "The Outcome";
    const kindColor =
      state.pendingOutcomeKind === "SUCCESS"
        ? "text-verdigris-bright"
        : state.pendingOutcomeKind === "FAILURE"
        ? "text-blood"
        : "text-blood";
    content = (
      <VoidScreen>
        {settingsButton}
        <div className="parchment-card max-w-xl w-full p-8 sm:p-10 font-body text-ink relative">
          <CornerFlourishes />
          <h1 className={`font-heading text-xs uppercase tracking-[0.3em] font-bold mb-5 ${kindColor}`}>{kindLabel}</h1>
          <p className="text-[1.1rem] leading-relaxed italic">{state.pendingOutcomeText}</p>
          {!rules.showPreview &&
            state.pendingOutcomeStamps &&
            Object.values(state.pendingOutcomeStamps).some((d) => !!d) && (
              <div className="mt-5 pt-4 border-t border-ink/15">
                <p className="font-heading text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft/70 font-semibold mb-2">
                  What Changed
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(state.pendingOutcomeStamps).map(([resource, delta]) =>
                    delta ? <StampBadge key={resource} resource={resource as Resource} delta={delta} /> : null
                  )}
                </div>
              </div>
            )}
          <button
            onClick={() => {
              click();
              dispatch({ type: "CONTINUE_OUTCOME" });
            }}
            className="mt-8 px-6 py-2.5 bg-ink text-parchment font-heading font-semibold uppercase text-xs tracking-widest hover:bg-ink-soft transition-colors"
          >
            Continue
          </button>
        </div>
      </VoidScreen>
    );
  } else {
    // screen === "NODE"
    const node = def.content.nodes[state.currentNodeId];
    const suggestion = rules.showPreview ? watsonSuggestion(state, node.options) : null;
    const clues = Object.keys(state.flags).filter((f) => f.startsWith("clue") && state.flags[f]);
    const coupling = activeCoupling(def, state.resources);
    // the road you are on, for the calendar and the board: the branch, or, before you have gone down one, the one you leaned towards
    const road =
      state.activeBranch !== "WEB"
        ? state.activeBranch
        : state.flags.leanYard
        ? "YARD"
        : state.flags.leanStreet
        ? "STREET"
        : state.flags.leanMycroft
        ? "MYCROFT"
        : state.flags.leanFlight
        ? "CONTINENT"
        : "WEB";
    // the three standalone cases are short and self-contained: no company, board or calendar to keep
    const inCase = MINOR_BRANCHES.includes(state.activeBranch);
    const onShelf = state.currentNodeId === "0";
    const shelfStats = onShelf ? volumeStats(endingsSeen) : [];
    // an unfinished case from an earlier visit, which the shelf offers to take up again (the shelf itself is never saved)
    // each volume keeps its own unfinished case; the shelf offers to take it up again (starting the volume afresh replaces that volume's save only)
    const savedCases = onShelf ? loadRunSaves() : {};
    const tabButton = (id: "HOUSE" | "COMPANY" | "BOARD" | "MAP" | "CALENDAR", label: string) => (
      <button
        role="tab"
        aria-selected={houseTab === id}
        onClick={() => {
          click();
          setHouseTab((t) => (t === id ? null : id));
        }}
        className={`px-4 py-2 border font-heading uppercase text-xs tracking-widest transition-colors ${
          houseTab === id ? "border-brass-bright bg-brass-bright text-void" : "border-brass-dim text-ash hover:border-brass hover:text-parchment"
        }`}
      >
        {label}
      </button>
    );
    content = (
      <div className="min-h-screen px-4 py-8 sm:py-12">
        {settingsButton}
        <div className="max-w-2xl mx-auto">
          <header className="mb-6 text-center">
            <p className="font-heading text-xs uppercase tracking-[0.35em] text-brass mb-1">Sherlock Holmes</p>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-parchment">
              {onShelf ? "The Case-Book" : inCase ? BRANCH_LABELS[state.activeBranch].split("· ")[1] : "The Final Problem"}
            </h1>
            <p className="font-heading text-xs uppercase tracking-widest text-ash mt-1">{onShelf ? "Choose a volume" : inCase ? "A short case" : BRANCH_LABELS[state.activeBranch]}</p>
          </header>

          {!onShelf && (
          <div className="parchment-card p-4 sm:p-5 mb-6 relative">
            <CornerFlourishes />
            {rules.enforceMoney && (
              <div className="flex items-center gap-1.5 mb-3 text-brass-dim">
                <CoinIcon className="w-3.5 h-3.5" />
                <span className="font-heading text-[0.65rem] uppercase tracking-widest font-semibold">
                  Purse: £{state.money}
                </span>
              </div>
            )}
            <div className="flex flex-nowrap gap-2 sm:gap-4">
              {CORE_IDS.map((r) => (
                <Meter key={r} resource={r} value={state.resources[r]} />
              ))}
              <StrandMeter resources={state.resources} />
            </div>
            {coupling.map((c) => (
              <p key={c.label} className="mt-2 text-[0.72rem] leading-snug italic text-blood">
                {c.label}
              </p>
            ))}
          </div>
          )}

          <div className="mb-6">
            {!onShelf && (
            <div role="tablist" aria-label="Baker Street" className="flex flex-wrap gap-2">
              {tabButton("HOUSE", "Baker Street")}
              {!inCase && tabButton("COMPANY", "Company")}
              {!inCase && tabButton("BOARD", "Board")}
              {tabButton("MAP", "Map")}
              {!inCase && tabButton("CALENDAR", "Calendar")}
            </div>
            )}
            {houseTab === "HOUSE" && (
              <div role="tabpanel" className="parchment-card p-4 mt-3 relative text-ink font-body">
                <CornerFlourishes />
                <div className="flex flex-wrap gap-2">
                  {rules.adviceEnabled && (
                    <button
                      disabled={state.adviceUsesLeft <= 0 || state.adviceRevealed}
                      onClick={() => {
                        unlock();
                        dispatch({ type: "ASK_ADVICE" });
                      }}
                      className={`px-4 py-2 border font-heading uppercase text-xs tracking-widest transition-colors ${
                        state.adviceUsesLeft <= 0 || state.adviceRevealed
                          ? "cursor-not-allowed border-ink/15 text-ink/40"
                          : "border-ink/40 text-ink hover:border-ink hover:bg-ink hover:text-parchment"
                      }`}
                    >
                      {state.adviceRevealed ? "Watson Has Advised You" : `Ask Watson's Advice (${state.adviceUsesLeft} left)`}
                    </button>
                  )}
                  {!state.favorUsed && (
                    <button
                      onClick={() => {
                        click();
                        setFavorPanelOpen((o) => !o);
                      }}
                      className="px-4 py-2 border border-ink/40 text-ink font-heading uppercase text-xs tracking-widest hover:border-ink hover:bg-ink hover:text-parchment transition-colors"
                    >
                      Mycroft's Favour
                    </button>
                  )}
                  <button
                    onClick={() => {
                      click();
                      setNotebookLine(null);
                      setGossipLine(pickLine(gossipPool(def, state), Math.random()));
                    }}
                    className="px-4 py-2 border border-ink/40 text-ink font-heading uppercase text-xs tracking-widest hover:border-ink hover:bg-ink hover:text-parchment transition-colors"
                  >
                    Overheard
                  </button>
                  <button
                    onClick={() => {
                      click();
                      setGossipLine(null);
                      setNotebookLine((Math.random() < 0.65 ? strandRemark(state) : null) ?? pickLine(creatureReportPool(def, state), Math.random()));
                    }}
                    className="px-4 py-2 border border-ink/40 text-ink font-heading uppercase text-xs tracking-widest hover:border-ink hover:bg-ink hover:text-parchment transition-colors"
                  >
                    Watson's Notebook
                  </button>
                </div>
                {state.adviceRevealed && (
                  <p className="mt-2 text-sm italic text-ink/70">
                    Watson looks over your shoulder and tells you, quietly, exactly what each choice below will cost you.
                  </p>
                )}
                {/* Overheard talk and Watson's Notebook are mutually exclusive (each click above clears the other) so the panel never shows two stacked lines. */}
                {gossipLine && <p className="mt-2 text-sm italic text-ink/70">Overheard: {gossipLine}</p>}
                {notebookLine && <p className="mt-2 text-sm italic text-ink/70">From Watson's notebook: {notebookLine}</p>}
                {favorPanelOpen && !state.favorUsed && (
                  <div className="mt-3 border-t border-ink/15 pt-3">
                    <p className="text-xs text-ink/80 mb-2">
                      Your brother can have one of your gauges quietly improved, by a word in the right ear. The Foreign
                      Office never gives for nothing, and the improvement always costs you elsewhere. Use it once, and choose carefully.
                    </p>
                    <div className="flex gap-2">
                      {RESOURCE_IDS.map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            unlock();
                            setFavorPanelOpen(false);
                            dispatch({ type: "USE_FAVOR", resource: r });
                          }}
                          className="flex-1 px-3 py-2 border border-blood/50 text-blood font-heading uppercase text-xs tracking-widest hover:bg-blood hover:text-parchment transition-colors"
                        >
                          Boost {RESOURCE_LABELS[r]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {houseTab === "COMPANY" && (
              <div role="tabpanel" className="parchment-card p-4 mt-3 relative text-ink font-body">
                <CornerFlourishes />
                <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-blood font-bold mb-2">Who Stands Behind You</p>
                <TrustRow axes={state.axes} flags={state.flags} />
                <ul className="space-y-1.5 text-sm text-ink/85">
                  {TRUST_AXES.filter((a) => a.id !== "trustAdler" || state.flags.adlerMet).map((a) => {
                    const said = lastHeard(state, ALLY_SPEAKERS[a.label] ?? a.label);
                    return (
                      <li key={a.id}>
                        <span className="font-semibold">{a.label}:</span>{" "}
                        <span className="italic">{said ? `"${said}"` : "You have not heard from them yet."}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {houseTab === "BOARD" && (
              <div role="tabpanel" className="parchment-card p-4 mt-3 relative text-ink font-body">
                <CornerFlourishes />
                <BoardView state={state} road={road} />
              </div>
            )}
            {houseTab === "CALENDAR" && (
              <div role="tabpanel" className="parchment-card p-4 mt-3 relative text-ink font-body">
                <CornerFlourishes />
                <CalendarView nodeId={state.currentNodeId} branch={road} hours={state.resources.hours ?? 0} />
              </div>
            )}
            {houseTab === "MAP" && (
              <div role="tabpanel" className="parchment-card p-3 mt-3 relative text-ink font-body">
                <MapView nodeId={state.currentNodeId} history={state.history} />
              </div>
            )}
          </div>

          {EXAM_SCENES.has(state.currentNodeId) && (
            <div className="parchment-card p-4 mb-6 relative">
              <CornerFlourishes />
              <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-blood font-bold mb-2">Your Notebook</p>
              {clues.length ? (
                <ul className="list-disc pl-5 space-y-1 text-sm text-ink/90">
                  {clues.map((f) => (
                    <li key={f}>{def.flavor.flagNotes?.[f] ?? f}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-ink/70">Nothing yet. What you look at now is what you will be able to say later.</p>
              )}
            </div>
          )}

          <div className="parchment-card p-6 sm:p-8 font-body text-ink relative">
            <CornerFlourishes />
            <h2 data-screen-heading className="font-heading text-2xl font-bold mb-3">{node.title}</h2>
            <p className="text-[1.05rem] leading-relaxed text-ink/90 mb-2">{node.description}</p>
            {(node.echoes ?? [])
              .filter((e) => evalCondition(e.when, state))
              .map((e, i) => (
                <p key={i} className="mt-3 text-[1rem] leading-relaxed italic text-ink/80 border-l-2 border-blood/50 pl-3">
                  {e.text}
                </p>
              ))}
            <OrnamentDivider />

            {suggestion !== null && (
              <button
                onClick={() => {
                  select();
                  dispatch({ type: "SELECT_OPTION", optionIndex: suggestion });
                  setArmedOptionIndex(null);
                }}
                className="mb-4 w-full px-4 py-2.5 border border-verdigris-bright text-verdigris-bright font-heading uppercase text-xs tracking-widest hover:bg-verdigris-bright hover:text-parchment transition-colors"
              >
                Take Watson's Suggestion
              </button>
            )}
            <div className="space-y-4">
              {node.options.map((option, i) => {
                // An option that is not on offer at this difficulty (or in this state) is not shown; the index stays the option's own.
                if (isOptionHidden(state, option)) return null;
                const locked = isOptionUnavailable(def, state, option);
                const gateLocked = isOptionLocked(state.resources, option.gate);
                const flagLocked = isOptionFlagLocked(state.flags, option.requiresFlag);
                const condLocked = isOptionConditionLocked(state, option);
                const affordLocked = !gateLocked && !flagLocked && !condLocked && locked;
                const showStampPreview = rules.showPreview || state.adviceRevealed;
                const armed = armedOptionIndex === i;
                const volStat = onShelf ? shelfStats[i] : undefined;
                return (
                  <Fragment key={i}>
                  {onShelf && i <= 1 && (
                    <h3 className="font-heading text-[0.7rem] uppercase tracking-[0.3em] text-blood font-bold pt-2">{i === 0 ? "The Major Case" : "Minor Cases"}</h3>
                  )}
                  <button
                    type="button"
                    disabled={locked}
                    onClick={() => {
                      if (armed) {
                        select();
                        dispatch({ type: "SELECT_OPTION", optionIndex: i });
                        setArmedOptionIndex(null);
                      } else {
                        click();
                        setArmedOptionIndex(i);
                      }
                    }}
                    className={`group block w-full text-left border rounded-sm p-4 transition-colors ${
                      locked
                        ? "cursor-not-allowed border-ink/15 bg-ink/5 opacity-60"
                        : armed
                        ? "cursor-pointer border-blood-bright bg-blood/10"
                        : "cursor-pointer border-ink/30 bg-black/[0.03] hover:bg-black/[0.06]"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {showStampPreview &&
                        Object.entries(option.stamps).map(([resource, delta]) =>
                          delta ? <StampBadge key={resource} resource={resource as Resource} delta={delta} /> : null
                        )}
                      {option.roll && (
                        <span className="stamp text-brass-dim border-brass-dim">
                          {Math.round(effectiveRollChance(option.roll, state.resources, def.config.strain) * 100)}% GAMBIT
                        </span>
                      )}
                      {option.roll && rollStrain(option.roll, state.resources, def.config.strain) > 0 && (
                        <span className="stamp text-blood border-blood">
                          <span aria-hidden="true">▼ </span>STRAIN: {RESOURCE_LABELS[option.roll.about ?? option.roll.scaling?.resource ?? ""]} SHORT, -{Math.round(rollStrain(option.roll, state.resources, def.config.strain) * 100)} POINTS
                        </span>
                      )}
                      {option.gate && (
                        <span className="stamp text-brass-dim border-brass-dim">
                          <LockIcon className="w-3 h-3" /> REQUIRES {RESOURCE_LABELS[option.gate.resource].toUpperCase()}{" "}
                          {"≥"}{" "}
                          {option.gate.minThreshold >= 0 ? `+${option.gate.minThreshold}` : option.gate.minThreshold}
                        </span>
                      )}
                      {option.requires && (
                        <span className="stamp text-brass-dim border-brass-dim">
                          <LockIcon className="w-3 h-3" /> {condLocked ? option.requiresHint : "OPEN TO YOU"}
                        </span>
                      )}
                      {option.requiresFlag && (
                        <span className="stamp text-brass-dim border-brass-dim">
                          <LockIcon className="w-3 h-3" /> {flagLocked ? option.requiresFlagHint ?? "REQUIRES AN EARLIER CHOICE" : "UNLOCKED BY AN EARLIER CHOICE"}
                        </span>
                      )}
                      {rules.enforceMoney && option.moneyCost ? (
                        <span className={`stamp ${affordLocked ? "text-blood-bright border-blood-bright" : "text-brass-dim border-brass-dim"}`}>
                          <CoinIcon className="w-3 h-3" /> COST £{option.moneyCost}
                        </span>
                      ) : null}
                      {rules.enforceMoney && option.moneyDelta ? (
                        <span className="stamp text-verdigris-bright border-verdigris-bright">
                          <CoinIcon className="w-3 h-3" /> +£{option.moneyDelta}
                        </span>
                      ) : null}
                      {volStat && (
                        <span className={`stamp ${volStat.found ? "text-verdigris-bright border-verdigris-bright" : "text-brass-dim border-brass-dim"}`}>
                          {volStat.found ? `${volStat.found} OF ${volStat.total} ENDINGS FOUND` : "NOT YET OPENED"}
                        </span>
                      )}
                    </div>
                    <p
                      className={`font-heading font-semibold text-[1rem] leading-snug ${
                        locked ? "text-ink/50" : armed ? "text-blood-bright" : "text-ink group-hover:text-blood"
                      }`}
                    >
                      {option.label}
                    </p>
                    <p className="mt-1.5 text-[0.92rem] leading-snug text-ink/75">{option.detail}</p>
                    <QuoteLine quote={option.quote} className="mt-2 text-sm italic text-ink/70" />
                    {armed && (
                      <p className="mt-2 text-[0.7rem] uppercase tracking-widest text-blood-bright font-heading font-semibold">
                        Tap again to confirm
                      </p>
                    )}
                  </button>
                  {onShelf && savedCases[VOLUMES[i]?.id] && (
                    <div className="-mt-2 border border-t-0 border-ink/30 bg-black/[0.04] p-3">
                      <p className="text-sm text-ink/90">
                        An unfinished case: <span className="font-semibold">{def.content.nodes[savedCases[VOLUMES[i].id].currentNodeId]?.title}</span>, {savedCases[VOLUMES[i].id].history.length} choices so far.
                      </p>
                      <button
                        onClick={() => {
                          select();
                          dispatch({ type: "HYDRATE", state: savedCases[VOLUMES[i].id] });
                        }}
                        className="mt-2 px-4 py-2 border border-ink/40 text-ink font-heading uppercase text-xs tracking-widest hover:border-ink hover:bg-ink hover:text-parchment transition-colors"
                      >
                        Resume it
                      </button>
                      <p className="mt-2 text-xs text-ink/70">Starting this volume again puts that case away. The other volumes keep theirs.</p>
                    </div>
                  )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="app-shell" ref={shellRef}>
        {content}
      </main>
    </>
  );
}
