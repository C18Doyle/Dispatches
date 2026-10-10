import { useEffect, useRef, useState, useReducer } from "react";
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
  rollStrain,
  evalCondition,
} from "@dispatches/engine";
import type { Action, Difficulty, GameState, Quote, UiPrefs } from "@dispatches/engine";
import { def } from "./game";
import { IS_DEMO, isDemoStop } from "./demo";
import { IN_RUN_SCREENS, parseRunSave, serializeRunSave } from "./runSave";
import { LEDGER_KEY, carriedNotes, count, parseLedger, recordRun, runRecord, summaryText } from "./ledger";
import type { Ledger } from "./ledger";
import * as sfx from "./sfx";

type Resource = string;
type FontSize = UiPrefs["fontSize"];

const TOTAL_ENDINGS = Object.keys(def.content.endings).length;

const RESOURCE_IDS: Resource[] = def.config.resources.map((r) => r.id);
const RESOURCE_LABELS: Record<Resource, string> = Object.fromEntries(def.config.resources.map((r) => [r.id, r.label]));

function isInCrisis(resource: Resource, value: number): boolean {
  const r = def.config.resources.find((x) => x.id === resource);
  return r?.crisisAt !== undefined && value <= r.crisisAt;
}

const BRANCH_LABELS: Record<string, string> = {
  UNIVERSAL: "Act I · The Foundation",
  ALCHEMICAL: "Act II · The Alchemical Monster",
  GALVANIC: "Act II · The Galvanic Automaton",
  PROMETHEUS: "Act II · The Prometheus Pact",
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

// How long the Experiment screen holds on a suspense phase before the real
// CONDUCT_EXPERIMENT dispatch resolves it — long enough to read as a held
// breath, short enough not to feel like padding.
const ROLL_SUSPENSE_MS = 1500;
const ROLL_SUSPENSE_PHRASES = [
  "The apparatus holds its breath…",
  "Fritz grips the lever tighter.",
  "The needle trembles against the glass.",
  "Something in the wiring hesitates.",
];

const STORAGE_KEY = "frankenstein_modern_prometheus_settings";

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

const ENDINGS_SEEN_KEY = "frankenstein_endings_seen";

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
 * A choice's quotation. Imagined lines read as before; a line that is Mary Shelley's own carries its volume and chapter
 * (the 1818 edition's), so a player can tell which words are hers. scripts/check_quotations.mjs holds that claim to the book.
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

const RUN_SAVE_KEY = "frankenstein_run_save_v2";

function loadRunSave(): GameState | null {
  try {
    return parseRunSave(localStorage.getItem(RUN_SAVE_KEY), def.content.nodes);
  } catch {
    return null; // storage unavailable
  }
}

function saveRunSave(state: GameState) {
  try {
    localStorage.setItem(RUN_SAVE_KEY, serializeRunSave(state));
  } catch {
    /* autosave is a convenience, not a guarantee — never block on it */
  }
}

function clearRunSave() {
  try {
    localStorage.removeItem(RUN_SAVE_KEY);
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

function StampBadge({ resource, delta }: { resource: Resource; delta: number }) {
  const positive = delta > 0;
  return (
    <span className={`stamp ${positive ? "text-verdigris-bright border-verdigris-bright" : "text-blood-bright border-blood-bright"}`}>
      {positive ? "▲" : "▼"} {RESOURCE_LABELS[resource].toUpperCase()} {positive ? "+" : ""}
      {delta}
    </span>
  );
}

function VoidScreen({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex items-center justify-center px-4 py-10">{children}</div>;
}

export default function App() {
  // Engine state: only the pure reducer changes it. Everything else below is UI-only.
  const [state, dispatch] = useReducer((s: GameState, a: Action) => reduce(def, s, a), undefined, () => createInitialState(def));
  const [prefs, setPrefs] = useState<UiPrefs>(loadSettings);
  const [overlay, setOverlay] = useState<"SETTINGS" | "RESEARCH" | "LEDGER" | null>(null);
  // The demo build locks at the end of Act I, on arriving at the first scene of a track (src/demo.ts); the full game never does.
  const demoStop = IS_DEMO && state.phase === "NODE" && isDemoStop(def, state.currentNodeId);
  const screen: string = overlay ?? (demoStop ? "DEMO_END" : state.phase);
  const rules = def.config.difficulties[state.difficulty];
  const interlude = state.activeInterludeId ? def.content.interludes[state.activeInterludeId] : undefined;
  const audioRef = useRef<HTMLAudioElement>(null);
  const shellRef = useRef<HTMLElement>(null);
  const [favorPanelOpen, setFavorPanelOpen] = useState(false);
  const [fritzPanelOpen, setFritzPanelOpen] = useState(false);
  const [gossipLine, setGossipLine] = useState<string | null>(null);
  const [creatureReportLine, setCreatureReportLine] = useState<string | null>(null);
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

  // Fritz waits outside each node rather than staying underfoot — collapse
  // the panel (and clear any gossip line, which is scoped to the node it
  // was said in) every time a new node loads, so "Send for Fritz" is a
  // fresh call each time rather than a state that leaks across choices.
  useEffect(() => {
    setFritzPanelOpen(false);
    setFavorPanelOpen(false);
    setGossipLine(null);
    setCreatureReportLine(null);
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
    if (IN_RUN_SCREENS.has(state.phase)) saveRunSave(state);
    else if (state.phase === "ENDING") clearRunSave();
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
      sfx.playCrisis(prefs.sfxVolume);
    } else if (screen === "ENDING") {
      if (state.endingId?.startsWith("ENDING_CRISIS")) sfx.playEndingCrisis(prefs.sfxVolume);
      else sfx.playEnding(prefs.sfxVolume);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, state.pendingOutcomeKind]);

  function click() {
    if (prefs.sfxEnabled) sfx.playClick(prefs.sfxVolume);
  }
  function select() {
    if (prefs.sfxEnabled) sfx.playSelect(prefs.sfxVolume);
  }
  function pageTurn() {
    if (prefs.sfxEnabled) sfx.playPageTurn(prefs.sfxVolume);
  }
  function unlock() {
    if (prefs.sfxEnabled) sfx.playUnlock(prefs.sfxVolume);
  }

  // There's only one music track, and it's too warm for a failure ending —
  // "The Work Collapses" plays under the same loop as a triumphant one, with
  // nothing in the score to tell them apart. Ducking it under crisis endings
  // at least lets the failure stinger (below) read as the dominant sound
  // rather than getting buried under an upbeat loop.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const isCrisisEnding = screen === "ENDING" && !!state.endingId?.startsWith("ENDING_CRISIS");
    try {
      el.volume = isCrisisEnding ? prefs.musicVolume * 0.3 : prefs.musicVolume;
    } catch {
      /* ignore */
    }
  }, [prefs.musicVolume, screen, state.endingId]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (prefs.musicEnabled) {
      el.play().catch(() => {
        /* blocked until the viewer interacts — retried from click handlers */
      });
    } else {
      el.pause();
    }
  }, [prefs.musicEnabled]);

  function tryStartMusic() {
    const el = audioRef.current;
    if (el && prefs.musicEnabled) el.play().catch(() => {});
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

  const audioEl = <audio ref={audioRef} src="audio/lament.mp3" loop preload="auto" />;

  let content: JSX.Element;

  if (screen === "SETTINGS") {
    content = (
      <VoidScreen>
        <div className="parchment-card max-w-sm w-full p-7 font-body text-ink relative" role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <CornerFlourishes />
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-blood font-bold mb-1" aria-hidden="true">Settings</p>
          <h1 id="settings-title" className="font-heading text-2xl font-bold mb-5">The Ledger's Print</h1>

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

          <p className="font-heading text-xs uppercase tracking-widest text-ink-soft/80 mb-2">Music</p>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setPrefs((p) => ({ ...p, musicEnabled: true }));
                tryStartMusic();
              }}
              className={`flex-1 py-2 border font-heading text-xs uppercase tracking-widest transition-colors ${
                prefs.musicEnabled ? "bg-ink text-parchment border-ink" : "border-ink/30 text-ink/70 hover:border-ink/60"
              }`}
            >
              On
            </button>
            <button
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
              Volume — {Math.round(prefs.musicVolume * 100)}%
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
              Volume — {Math.round(prefs.sfxVolume * 100)}%
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
            Frankenstein is one entry in the Dispatches series of historically-grounded branching narrative games.
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
  } else if (screen === "LEDGER") {
    const endingIds = Object.keys(def.content.endings);
    const found = endingIds.filter((id) => endingsSeen.has(id) || (ledger.endings[id] ?? 0) > 0);
    content = (
      <VoidScreen>
        <div className="parchment-card max-w-2xl w-full p-8 sm:p-10 font-body text-ink relative max-h-[85vh] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="ledger-title">
          <CornerFlourishes />
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-blood font-bold mb-1">Kept in this browser</p>
          <h1 id="ledger-title" className="font-heading text-2xl font-bold mb-1">The Ledger</h1>
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
                      · {def.flavor.difficultyInfo?.[r.difficulty as Difficulty]?.label ?? r.difficulty} · {count(r.choices, "choice")}, {count(r.experiments, "experiment")}
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
          <p className="font-heading text-xs uppercase tracking-[0.5em] text-brass/80 mb-3">A Dispatches Chronicle</p>
          <h1 className="flicker font-display text-5xl sm:text-6xl font-bold text-parchment leading-tight mb-2">
            Frankenstein
          </h1>
          <p className="font-heading text-sm sm:text-base uppercase tracking-[0.35em] text-brass mb-10">
            The Modern Prometheus
          </p>
          <OrnamentDivider />
          <button
            onClick={() => {
              select();
              tryStartMusic();
              dispatch({ type: "START_GAME" });
            }}
            className="mt-6 w-full sm:w-auto px-10 py-3.5 border border-brass text-parchment font-heading uppercase text-sm tracking-[0.25em] hover:bg-brass hover:text-ink transition-colors"
          >
            Begin the Work
          </button>
          {resumableSave && (
            <button
              onClick={() => {
                select();
                tryStartMusic();
                dispatch({ type: "HYDRATE", state: resumableSave });
              }}
              className="mt-3 w-full sm:w-auto block mx-auto px-10 py-2.5 border border-brass-dim/70 text-ash font-heading uppercase text-xs tracking-[0.2em] hover:border-brass hover:text-parchment transition-colors"
            >
              Continue Your Work
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
                Ledger
              </button>
            )}
          </div>
          {endingsSeen.size > 0 && (
            <p className="mt-6 font-heading text-[0.65rem] uppercase tracking-[0.2em] text-ash">
              {endingsSeen.size} / {TOTAL_ENDINGS} Endings Discovered
            </p>
          )}
          <p className="mt-8 font-body italic text-ash text-sm">
            Ingolstadt, 1818. What you build tonight, you will answer for.
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
                Skip to the Laboratory
              </button>
              <p className="text-ash/70 text-sm italic mt-2 max-w-xs mx-auto">
                Jumps straight to the first choice that decides your track. Your reserves reset to zero
                {rules.enforceMoney ? ", your purse refills to its full starting sum," : ""} and any
                option that depended on an earlier choice is out of reach for the rest of this run.
              </p>
            </div>
          )}
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
            <a
              href="https://dispatches.itch.io"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => click()}
              className="px-5 py-2.5 border border-ink text-ink font-heading font-semibold uppercase text-xs tracking-widest hover:bg-ink hover:text-parchment transition-colors"
            >
              See the Rest of the Series
            </a>
          </div>
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
            {isFailure ? "The Work Collapses" : "The Campaign Ends"}
          </p>
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

          <div className="mt-7 pt-5 border-t border-ink/20">
            <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-blood font-bold mb-3">Your Record</p>
            <div className={`grid grid-cols-2 gap-3 text-sm ${rules.enforceMoney ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
              <div>
                <p className="font-heading text-[0.6rem] uppercase tracking-widest text-ink-soft/70">Track</p>
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
                  <p className="font-semibold">{state.money} Thaler</p>
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

          {carried.length > 0 && (
            <div className="mt-6">
              <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-blood font-bold mb-2">What You Carried</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-ink/90">
                {carried.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}
          {novelNote && (
            <div className="mt-6">
              <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-blood font-bold mb-2">In the Novel</p>
              <p className="text-sm text-ink/90 leading-relaxed">{novelNote}</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                click();
                setFavorPanelOpen(false);
                dispatch({ type: "RESTART" });
              }}
              className="px-5 py-2.5 bg-blood text-parchment font-heading font-semibold uppercase text-xs tracking-widest hover:bg-blood-bright transition-colors"
            >
              Begin a New Experiment
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
              Copy Summary
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
        <div className="max-w-xl w-full bg-parchment border-4 border-double border-ink p-6 sm:p-8 font-broadsheet text-ink shadow-2xl relative">
          <div className="flex items-center justify-between border-b-2 border-ink pb-2 mb-4">
            <span className="text-xs uppercase tracking-[0.25em] font-bold">{paper.source}</span>
            <span className="text-xs uppercase tracking-widest text-ink/60">{paper.kind}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">{paper.headline}</h1>
          <p className="font-body text-sm leading-relaxed columns-1 sm:columns-2 gap-6 whitespace-pre-line">{paper.bodyText}</p>
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
          <h1 className="font-heading text-xs uppercase tracking-[0.3em] text-blood font-bold mb-4">An Experiment</h1>
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
            {rolling ? "Holding Its Breath…" : "Conduct the Experiment"}
          </button>
        </div>
      </VoidScreen>
    );
  } else if (screen === "OUTCOME") {
    const kindLabel =
      state.pendingOutcomeKind === "SUCCESS"
        ? "Experiment Successful"
        : state.pendingOutcomeKind === "FAILURE"
        ? "Experiment Failed"
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
    content = (
      <div className="min-h-screen px-4 py-8 sm:py-12">
        {settingsButton}
        <div className="max-w-2xl mx-auto">
          <header className="mb-6 text-center">
            <p className="font-heading text-xs uppercase tracking-[0.35em] text-brass mb-1">Frankenstein</p>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-parchment">The Modern Prometheus</h1>
            <p className="font-heading text-xs uppercase tracking-widest text-ash mt-1">{BRANCH_LABELS[state.activeBranch]}</p>
          </header>

          <div className="parchment-card p-4 sm:p-5 mb-6 relative">
            <CornerFlourishes />
            {rules.enforceMoney && (
              <div className="flex items-center gap-1.5 mb-3 text-brass-dim">
                <CoinIcon className="w-3.5 h-3.5" />
                <span className="font-heading text-[0.65rem] uppercase tracking-widest font-semibold">
                  Purse: {state.money} Thaler
                </span>
              </div>
            )}
            <div className="flex flex-nowrap gap-2 sm:gap-4">
              <Meter resource="voltage" value={state.resources.voltage} />
              <Meter resource="biomass" value={state.resources.biomass} />
              <Meter resource="secrecy" value={state.resources.secrecy} />
            </div>
          </div>

          {!fritzPanelOpen ? (
            <button
              onClick={() => {
                click();
                setFritzPanelOpen(true);
              }}
              className="mb-6 px-4 py-2 border border-brass-dim text-ash font-heading uppercase text-xs tracking-widest hover:border-brass hover:text-parchment transition-colors"
            >
              Send for Fritz
            </button>
          ) : (
            <div className="parchment-card p-4 mb-6 relative">
              <CornerFlourishes />
              <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-blood font-bold mb-2">Fritz</p>
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
                    {state.adviceRevealed
                      ? "Fritz Has Advised You"
                      : `Ask Fritz's Advice (${state.adviceUsesLeft} left)`}
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
                    Fritz's Favor
                  </button>
                )}
                <button
                  onClick={() => {
                    click();
                    setCreatureReportLine(null);
                    setGossipLine(pickLine(gossipPool(def, state), Math.random()));
                  }}
                  className="px-4 py-2 border border-ink/40 text-ink font-heading uppercase text-xs tracking-widest hover:border-ink hover:bg-ink hover:text-parchment transition-colors"
                >
                  Gossip
                </button>
                <button
                  onClick={() => {
                    click();
                    setGossipLine(null);
                    setCreatureReportLine(pickLine(creatureReportPool(def, state), Math.random()));
                  }}
                  className="px-4 py-2 border border-ink/40 text-ink font-heading uppercase text-xs tracking-widest hover:border-ink hover:bg-ink hover:text-parchment transition-colors"
                >
                  Creature Report
                </button>
              </div>
              {state.adviceRevealed && (
                <p className="mt-2 text-sm italic text-ink/70">
                  Fritz leans in and tells you, quietly, exactly what each choice below will cost you.
                </p>
              )}
              {/* Gossip and the Creature Report are mutually exclusive (each
                  click above clears the other) so the panel never shows two
                  stacked Fritz lines at once — only ever the most recent. */}
              {gossipLine && (
                <p className="mt-2 text-sm italic text-ink/70">
                  Fritz: "{gossipLine}"
                </p>
              )}
              {creatureReportLine && (
                <p className="mt-2 text-sm italic text-ink/70">
                  Fritz, on the creature: "{creatureReportLine}"
                </p>
              )}
              {favorPanelOpen && !state.favorUsed && (
                <div className="mt-3 border-t border-ink/15 pt-3">
                  <p className="text-xs text-ink/80 mb-2">
                    Fritz can have one of your resources quietly improved — but only, he admits, at the behest of
                    someone he won't name, and the improvement always costs you elsewhere. Use it once, and choose carefully.
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
                return (
                  <button
                    key={i}
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
                          {Math.round(effectiveRollChance(option.roll, state.resources, def.config.strain) * 100)}% EXPERIMENT
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
                          <CoinIcon className="w-3 h-3" /> COST {option.moneyCost}
                        </span>
                      ) : null}
                      {rules.enforceMoney && option.moneyDelta ? (
                        <span className="stamp text-verdigris-bright border-verdigris-bright">
                          <CoinIcon className="w-3 h-3" /> +{option.moneyDelta}
                        </span>
                      ) : null}
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
      {audioEl}
      <main className="app-shell" ref={shellRef}>
        {content}
      </main>
    </>
  );
}
