import { useEffect, useRef, useState, useReducer } from "react";
import { NODES, ENDINGS, PROLOGUE_TEXT, CHAPTER_CARD, HOW_TO_PLAY, getFritzGossip, getFritzCreatureReport } from "./data";
import { reducer, initialState, isOptionUnavailable, isOptionLocked, isOptionFlagLocked, resolveEndingText, effectiveRollChance, CRISIS_THRESHOLD } from "./engine";
import type { Difficulty, FontSize, Resource, GameState } from "./types";
import * as sfx from "./sfx";

const TOTAL_ENDINGS = Object.keys(ENDINGS).length;

const IN_RUN_SCREENS = new Set(["PROLOGUE", "CHAPTER_CARD", "NODE", "OUTCOME", "EXPERIMENT", "NEWSPAPER"]);

const RESOURCE_LABELS: Record<Resource, string> = {
  voltage: "Voltage",
  biomass: "Biomass",
  secrecy: "Secrecy",
};

const BRANCH_LABELS: Record<string, string> = {
  UNIVERSAL: "Act I · The Foundation",
  ALCHEMICAL: "Act II · The Alchemical Monster",
  GALVANIC: "Act II · The Galvanic Automaton",
  PROMETHEUS: "Act II · The Prometheus Pact",
};

const DIFFICULTY_INFO: Record<Difficulty, { label: string; blurb: string }> = {
  EASY: { label: "Easy", blurb: "See exactly how each choice will move your resources before you commit." },
  MEDIUM: { label: "Medium", blurb: "How each choice moves your resources stays hidden until after you commit." },
  HARD: { label: "Hard", blurb: "As Medium, plus fifty Thaler — some choices cost coin you cannot replace." },
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

function loadSettings(): {
  fontSize: FontSize;
  musicEnabled: boolean;
  musicVolume: number;
  sfxEnabled: boolean;
  sfxVolume: number;
} {
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

const RUN_SAVE_KEY = "frankenstein_run_save";

function loadRunSave(): GameState | null {
  try {
    const raw = localStorage.getItem(RUN_SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    // Guard against a save from an older content build naming a node that no
    // longer exists — better to discard it than to hydrate into a crash.
    if (!parsed || typeof parsed.screen !== "string" || !IN_RUN_SCREENS.has(parsed.screen)) return null;
    if (parsed.screen !== "PROLOGUE" && parsed.screen !== "CHAPTER_CARD" && !NODES[parsed.currentNodeId]) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveRunSave(state: GameState) {
  try {
    localStorage.setItem(RUN_SAVE_KEY, JSON.stringify(state));
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
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.4M12 18.1v2.4M20.5 12h-2.4M5.9 12H3.5M17.8 6.2l-1.7 1.7M7.9 16.1l-1.7 1.7M17.8 17.8l-1.7-1.7M7.9 7.9 6.2 6.2" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5.5" y="10.5" width="13" height="9" rx="1.2" />
      <path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7" />
    </svg>
  );
}

function CoinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
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
  const pct = ((value + 10) / 20) * 100;
  const inCrisis = value <= CRISIS_THRESHOLD;
  const fillColor = inCrisis ? "bg-blood-bright" : value >= 0 ? "bg-verdigris-bright" : "bg-blood-bright";
  const glow = inCrisis
    ? "shadow-[0_0_10px_rgba(179,40,31,0.85)]"
    : value >= 0
    ? "shadow-[0_0_8px_rgba(92,146,105,0.6)]"
    : "shadow-[0_0_8px_rgba(179,40,31,0.55)]";
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline justify-between mb-1 sm:mb-1.5 gap-1">
        <span className="font-heading text-[0.52rem] xs:text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.1em] sm:tracking-[0.18em] text-brass/90 font-semibold truncate">
          {RESOURCE_LABELS[resource]}
        </span>
        <span className={`font-heading text-[0.65rem] sm:text-xs font-bold tabular-nums shrink-0 ${inCrisis ? "text-blood-bright" : "text-parchment"}`}>
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
  const initial = loadSettings();
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialState(initial.fontSize, initial.musicEnabled, initial.musicVolume, initial.sfxEnabled, initial.sfxVolume)
  );
  const audioRef = useRef<HTMLAudioElement>(null);
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
      dispatch({ type: "CONDUCT_EXPERIMENT" });
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
    document.documentElement.style.fontSize = FONT_SIZE_PX[state.fontSize];
    saveSettings(state.fontSize, state.musicEnabled, state.musicVolume, state.sfxEnabled, state.sfxVolume);
  }, [state.fontSize, state.musicEnabled, state.musicVolume, state.sfxEnabled, state.sfxVolume]);

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
    if (IN_RUN_SCREENS.has(state.screen)) saveRunSave(state);
    else if (state.screen === "ENDING") clearRunSave();
  }, [state]);

  // Re-reads localStorage every time the menu is reached, rather than only
  // at mount: the button previously reflected whatever save existed on page
  // load and never updated again for the rest of the session, so it could
  // keep pointing at a run that had already finished and been cleared above.
  useEffect(() => {
    if (state.screen === "MENU") setResumableSave(loadRunSave());
  }, [state.screen]);

  // Tracks which of the 12 endings this browser has discovered, for the
  // menu's progress counter and the "new ending" note on the ending screen
  // itself. Persisted separately from the run save, since it should survive
  // across runs rather than being cleared when one finishes.
  useEffect(() => {
    if (state.screen !== "ENDING" || !state.endingId) return;
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
  }, [state.screen, state.endingId]);

  // Sound effects tied to screen transitions rather than clicks alone, so
  // they fire once per transition regardless of which button caused it.
  useEffect(() => {
    if (!state.sfxEnabled) return;
    if (state.screen === "OUTCOME") {
      if (state.pendingOutcomeKind === "SUCCESS") sfx.playSuccess(state.sfxVolume);
      else if (state.pendingOutcomeKind === "FAILURE") sfx.playFailure(state.sfxVolume);
    } else if (state.screen === "NEWSPAPER" && state.activeNewspaper?.type === "crisis") {
      sfx.playCrisis(state.sfxVolume);
    } else if (state.screen === "ENDING") {
      if (state.endingId?.startsWith("ENDING_CRISIS")) sfx.playEndingCrisis(state.sfxVolume);
      else sfx.playEnding(state.sfxVolume);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.screen, state.pendingOutcomeKind]);

  function click() {
    if (state.sfxEnabled) sfx.playClick(state.sfxVolume);
  }
  function select() {
    if (state.sfxEnabled) sfx.playSelect(state.sfxVolume);
  }
  function pageTurn() {
    if (state.sfxEnabled) sfx.playPageTurn(state.sfxVolume);
  }
  function unlock() {
    if (state.sfxEnabled) sfx.playUnlock(state.sfxVolume);
  }

  // There's only one music track, and it's too warm for a failure ending —
  // "The Work Collapses" plays under the same loop as a triumphant one, with
  // nothing in the score to tell them apart. Ducking it under crisis endings
  // at least lets the failure stinger (below) read as the dominant sound
  // rather than getting buried under an upbeat loop.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const isCrisisEnding = state.screen === "ENDING" && !!state.endingId?.startsWith("ENDING_CRISIS");
    try {
      el.volume = isCrisisEnding ? state.musicVolume * 0.3 : state.musicVolume;
    } catch {
      /* ignore */
    }
  }, [state.musicVolume, state.screen, state.endingId]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (state.musicEnabled) {
      el.play().catch(() => {
        /* blocked until the viewer interacts — retried from click handlers */
      });
    } else {
      el.pause();
    }
  }, [state.musicEnabled]);

  function tryStartMusic() {
    const el = audioRef.current;
    if (el && state.musicEnabled) el.play().catch(() => {});
  }

  const settingsButton = (
    <button
      onClick={() => {
        click();
        dispatch({ type: "OPEN_SETTINGS" });
      }}
      aria-label="Settings"
      className="fixed top-4 right-4 z-40 p-2 rounded-full border border-brass-dim/70 bg-black/50 text-brass hover:text-brass-bright hover:border-brass transition-colors"
    >
      <GearIcon className="w-4 h-4" />
    </button>
  );

  const audioEl = <audio ref={audioRef} src="audio/lament.mp3" loop preload="auto" />;

  let content: JSX.Element;

  if (state.screen === "SETTINGS") {
    content = (
      <VoidScreen>
        <div className="parchment-card max-w-sm w-full p-7 font-body text-ink relative">
          <CornerFlourishes />
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-blood font-bold mb-1">Settings</p>
          <h2 className="font-heading text-2xl font-bold mb-5">The Ledger's Print</h2>

          <p className="font-heading text-xs uppercase tracking-widest text-ink-soft/80 mb-2">Font Size</p>
          <div className="flex gap-2 mb-7">
            {(["small", "medium", "large"] as FontSize[]).map((size) => (
              <button
                key={size}
                onClick={() => {
                  click();
                  dispatch({ type: "SET_FONT_SIZE", size });
                }}
                className={`flex-1 py-2 border font-heading text-xs uppercase tracking-widest transition-colors ${
                  state.fontSize === size
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
                dispatch({ type: "SET_MUSIC_ENABLED", enabled: true });
                tryStartMusic();
              }}
              className={`flex-1 py-2 border font-heading text-xs uppercase tracking-widest transition-colors ${
                state.musicEnabled ? "bg-ink text-parchment border-ink" : "border-ink/30 text-ink/70 hover:border-ink/60"
              }`}
            >
              On
            </button>
            <button
              onClick={() => dispatch({ type: "SET_MUSIC_ENABLED", enabled: false })}
              className={`flex-1 py-2 border font-heading text-xs uppercase tracking-widest transition-colors ${
                !state.musicEnabled ? "bg-ink text-parchment border-ink" : "border-ink/30 text-ink/70 hover:border-ink/60"
              }`}
            >
              Off
            </button>
          </div>
          <label className="block mb-7">
            <span className="font-heading text-[0.65rem] uppercase tracking-widest text-ink-soft/70">
              Volume — {Math.round(state.musicVolume * 100)}%
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={state.musicVolume}
              disabled={!state.musicEnabled}
              onChange={(e) => dispatch({ type: "SET_MUSIC_VOLUME", volume: Number(e.target.value) })}
              className="w-full mt-2 accent-blood"
            />
          </label>

          <p className="font-heading text-xs uppercase tracking-widest text-ink-soft/80 mb-2">Sound Effects</p>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                dispatch({ type: "SET_SFX_ENABLED", enabled: true });
                sfx.playClick(state.sfxVolume || 0.6);
              }}
              className={`flex-1 py-2 border font-heading text-xs uppercase tracking-widest transition-colors ${
                state.sfxEnabled ? "bg-ink text-parchment border-ink" : "border-ink/30 text-ink/70 hover:border-ink/60"
              }`}
            >
              On
            </button>
            <button
              onClick={() => dispatch({ type: "SET_SFX_ENABLED", enabled: false })}
              className={`flex-1 py-2 border font-heading text-xs uppercase tracking-widest transition-colors ${
                !state.sfxEnabled ? "bg-ink text-parchment border-ink" : "border-ink/30 text-ink/70 hover:border-ink/60"
              }`}
            >
              Off
            </button>
          </div>
          <label className="block mb-7">
            <span className="font-heading text-[0.65rem] uppercase tracking-widest text-ink-soft/70">
              Volume — {Math.round(state.sfxVolume * 100)}%
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={state.sfxVolume}
              disabled={!state.sfxEnabled}
              onChange={(e) => dispatch({ type: "SET_SFX_VOLUME", volume: Number(e.target.value) })}
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
              dispatch({ type: "CLOSE_SETTINGS" });
            }}
            className="w-full px-5 py-2.5 bg-blood text-parchment font-heading font-semibold uppercase text-xs tracking-widest hover:bg-blood-bright transition-colors"
          >
            Close
          </button>
        </div>
      </VoidScreen>
    );
  } else if (state.screen === "RESEARCH") {
    content = (
      <VoidScreen>
        <div className="parchment-card max-w-2xl w-full p-8 sm:p-10 font-body text-ink relative max-h-[85vh] overflow-y-auto">
          <CornerFlourishes />
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-blood font-bold mb-1">How To</p>
          <h2 className="font-heading text-2xl font-bold mb-6">How to Play</h2>
          <div className="space-y-5">
            {HOW_TO_PLAY.map((section) => (
              <div key={section.heading}>
                <h3 className="font-heading text-sm uppercase tracking-widest text-blood-bright font-bold mb-1.5">
                  {section.heading}
                </h3>
                <p className="text-[0.98rem] leading-relaxed text-ink/90">{section.body}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              click();
              dispatch({ type: "CLOSE_RESEARCH" });
            }}
            className="mt-8 px-6 py-2.5 bg-ink text-parchment font-heading font-semibold uppercase text-xs tracking-widest hover:bg-ink-soft transition-colors"
          >
            Back
          </button>
        </div>
      </VoidScreen>
    );
  } else if (state.screen === "MENU") {
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
                dispatch({ type: "OPEN_RESEARCH" });
              }}
              className="px-6 py-2.5 border border-brass-dim text-ash font-heading uppercase text-xs tracking-widest hover:border-brass hover:text-parchment transition-colors"
            >
              How To
            </button>
            <button
              onClick={() => {
                click();
                dispatch({ type: "OPEN_SETTINGS" });
              }}
              className="px-6 py-2.5 border border-brass-dim text-ash font-heading uppercase text-xs tracking-widest hover:border-brass hover:text-parchment transition-colors"
            >
              Settings
            </button>
          </div>
          {endingsSeen.size > 0 && (
            <p className="mt-6 font-heading text-[0.65rem] uppercase tracking-[0.2em] text-brass-dim">
              {endingsSeen.size} / {TOTAL_ENDINGS} Endings Discovered
            </p>
          )}
          <p className="mt-8 font-body italic text-ash text-sm">
            Ingolstadt, 1818. What you build tonight, you will answer for.
          </p>
        </div>
      </VoidScreen>
    );
  } else if (state.screen === "PROLOGUE") {
    content = (
      <VoidScreen>
        <div className="parchment-card max-w-xl w-full p-8 sm:p-10 font-body text-ink relative">
          <CornerFlourishes />
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-blood font-bold mb-5">From a Private Journal</p>
          <div className="space-y-4 text-[1.05rem] leading-relaxed">
            {PROLOGUE_TEXT.map((para, i) => (
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
  } else if (state.screen === "CHAPTER_CARD") {
    content = (
      <VoidScreen>
        <div className="text-center max-w-lg w-full">
          <OrnamentDivider />
          <h2 className="flicker font-display text-4xl sm:text-5xl font-bold text-parchment my-6">
            {CHAPTER_CARD.title}
          </h2>
          <p className="font-heading text-xs uppercase tracking-[0.4em] text-brass/80 mb-8">{CHAPTER_CARD.subtitle}</p>

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
                {state.difficulty === "HARD" ? ", your purse refills to its full starting sum," : ""} and any
                option that depended on an earlier choice is out of reach for the rest of this run.
              </p>
            </div>
          )}
        </div>
      </VoidScreen>
    );
  } else if (state.screen === "ENDING") {
    const ending = resolveEndingText(state);
    const isFailure = state.endingId?.startsWith("ENDING_CRISIS");
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
          {ending.temperamentLabel && (
            <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-brass-dim font-semibold mt-4">
              How It's Remembered: <span className="text-ink">{ending.temperamentLabel}</span>
            </p>
          )}

          <div className="mt-7 pt-5 border-t border-ink/20">
            <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-blood font-bold mb-3">Your Record</p>
            <div className={`grid grid-cols-2 gap-3 text-sm ${state.difficulty === "HARD" ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
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
              {state.difficulty === "HARD" && (
                <div>
                  <p className="font-heading text-[0.6rem] uppercase tracking-widest text-ink-soft/70">Purse Left</p>
                  <p className="font-semibold">{state.money} Thaler</p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {(["voltage", "biomass", "secrecy"] as Resource[]).map((r) => (
                <div key={r} className="flex-1 min-w-[5rem]">
                  <p className="font-heading text-[0.6rem] uppercase tracking-widest text-ink-soft/70">{RESOURCE_LABELS[r]}</p>
                  <p className={`font-heading text-lg font-bold ${state.resources[r] <= CRISIS_THRESHOLD ? "text-blood" : "text-ink"}`}>
                    {state.resources[r] > 0 ? `+${state.resources[r]}` : state.resources[r]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              click();
              setFavorPanelOpen(false);
              dispatch({ type: "RESTART" });
            }}
            className="mt-8 px-5 py-2.5 bg-blood text-parchment font-heading font-semibold uppercase text-xs tracking-widest hover:bg-blood-bright transition-colors"
          >
            Begin a New Experiment
          </button>
        </div>
      </VoidScreen>
    );
  } else if (state.screen === "NEWSPAPER" && state.activeNewspaper) {
    const paper = state.activeNewspaper;
    content = (
      <VoidScreen>
        <div className="max-w-xl w-full bg-parchment border-4 border-double border-ink p-6 sm:p-8 font-broadsheet text-ink shadow-2xl relative">
          <div className="flex items-center justify-between border-b-2 border-ink pb-2 mb-4">
            <span className="text-xs uppercase tracking-[0.25em] font-bold">{paper.masthead}</span>
            <span className="text-xs uppercase tracking-widest text-ink/60">{paper.type}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">{paper.headline}</h2>
          <p className="font-body text-sm leading-relaxed columns-1 sm:columns-2 gap-6 whitespace-pre-line">{paper.bodyText}</p>
          <button
            onClick={() => {
              pageTurn();
              dispatch({ type: "DISMISS_NEWSPAPER" });
            }}
            className="mt-6 px-4 py-2 border border-ink text-ink font-heading font-semibold uppercase text-xs tracking-widest hover:bg-ink hover:text-parchment transition-colors"
          >
            Turn the Page
          </button>
        </div>
      </VoidScreen>
    );
  } else if (state.screen === "EXPERIMENT" && state.pendingRoll) {
    const pct = Math.round(effectiveRollChance(state.pendingRoll, state.resources) * 100);
    content = (
      <VoidScreen>
        {settingsButton}
        <div className="parchment-card max-w-xl w-full p-8 sm:p-10 font-body text-ink relative text-center">
          <CornerFlourishes />
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-blood font-bold mb-4">An Experiment</p>
          {state.pendingOptionLabel && (
            <h2 className="font-heading text-xl font-bold mb-3">{state.pendingOptionLabel}</h2>
          )}
          {state.pendingOptionQuote && (
            <p className="text-sm italic text-ink/70 mb-6">
              {state.pendingOptionQuote.speaker}: {"“"}
              {state.pendingOptionQuote.text}
              {"”"}
            </p>
          )}
          <div className="my-6">
            <span
              className={`font-heading text-4xl font-bold text-blood inline-block ${rolling ? "tension-pulse" : ""}`}
            >
              {pct}%
            </span>
            <p className="font-heading text-xs uppercase tracking-widest text-ink-soft mt-1">Chance of Success</p>
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
              if (state.sfxEnabled) sfx.playTension(state.sfxVolume);
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
  } else if (state.screen === "OUTCOME") {
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
        ? "text-blood-bright"
        : "text-blood";
    content = (
      <VoidScreen>
        {settingsButton}
        <div className="parchment-card max-w-xl w-full p-8 sm:p-10 font-body text-ink relative">
          <CornerFlourishes />
          <p className={`font-heading text-xs uppercase tracking-[0.3em] font-bold mb-5 ${kindColor}`}>{kindLabel}</p>
          <p className="text-[1.1rem] leading-relaxed italic">{state.pendingOutcomeText}</p>
          {state.difficulty !== "EASY" &&
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
    // state.screen === "NODE"
    const node = NODES[state.currentNodeId];
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
            {state.difficulty === "HARD" && (
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
                {state.difficulty !== "EASY" && (
                  <button
                    disabled={state.fritzAdviceUsesLeft <= 0 || state.fritzAdviceRevealed}
                    onClick={() => {
                      unlock();
                      dispatch({ type: "ASK_FRITZ_ADVICE" });
                    }}
                    className={`px-4 py-2 border font-heading uppercase text-xs tracking-widest transition-colors ${
                      state.fritzAdviceUsesLeft <= 0 || state.fritzAdviceRevealed
                        ? "cursor-not-allowed border-ink/15 text-ink/40"
                        : "border-ink/40 text-ink hover:border-ink hover:bg-ink hover:text-parchment"
                    }`}
                  >
                    {state.fritzAdviceRevealed
                      ? "Fritz Has Advised You"
                      : `Ask Fritz's Advice (${state.fritzAdviceUsesLeft} left)`}
                  </button>
                )}
                {!state.fritzFavorUsed && (
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
                    setGossipLine(getFritzGossip(state));
                  }}
                  className="px-4 py-2 border border-ink/40 text-ink font-heading uppercase text-xs tracking-widest hover:border-ink hover:bg-ink hover:text-parchment transition-colors"
                >
                  Gossip
                </button>
                <button
                  onClick={() => {
                    click();
                    setGossipLine(null);
                    setCreatureReportLine(getFritzCreatureReport(state));
                  }}
                  className="px-4 py-2 border border-ink/40 text-ink font-heading uppercase text-xs tracking-widest hover:border-ink hover:bg-ink hover:text-parchment transition-colors"
                >
                  Creature Report
                </button>
              </div>
              {state.fritzAdviceRevealed && (
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
              {favorPanelOpen && !state.fritzFavorUsed && (
                <div className="mt-3 border-t border-ink/15 pt-3">
                  <p className="text-xs text-ink/80 mb-2">
                    Fritz can have one of your resources quietly improved — but only, he admits, at the behest of
                    someone he won't name, and the improvement always costs you elsewhere. Use it once, and choose carefully.
                  </p>
                  <div className="flex gap-2">
                    {(["voltage", "biomass", "secrecy"] as Resource[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          unlock();
                          setFavorPanelOpen(false);
                          dispatch({ type: "USE_FRITZ_FAVOR", resource: r });
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
            <h2 className="font-heading text-2xl font-bold mb-3">{node.title}</h2>
            <p className="text-[1.05rem] leading-relaxed text-ink/90 mb-2">{node.description}</p>
            <OrnamentDivider />

            <div className="space-y-4">
              {node.options.map((option, i) => {
                const locked = isOptionUnavailable(state.resources, state.money, state.difficulty, state.flags, option);
                const gateLocked = isOptionLocked(state.resources, option.gate);
                const flagLocked = isOptionFlagLocked(state.flags, option.requiresFlag);
                const affordLocked = !gateLocked && !flagLocked && locked;
                const showStampPreview = state.difficulty === "EASY" || state.fritzAdviceRevealed;
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
                        <span className="stamp text-brass border-brass">
                          {Math.round(effectiveRollChance(option.roll, state.resources) * 100)}% EXPERIMENT
                        </span>
                      )}
                      {option.gate && (
                        <span className="stamp text-brass-dim border-brass-dim">
                          <LockIcon className="w-3 h-3" /> REQUIRES {RESOURCE_LABELS[option.gate.resource].toUpperCase()}{" "}
                          {"≥"}{" "}
                          {option.gate.minThreshold >= 0 ? `+${option.gate.minThreshold}` : option.gate.minThreshold}
                        </span>
                      )}
                      {option.requiresFlag && (
                        <span className="stamp text-brass-dim border-brass-dim">
                          <LockIcon className="w-3 h-3" /> {flagLocked ? option.requiresFlagHint ?? "REQUIRES AN EARLIER CHOICE" : "UNLOCKED BY AN EARLIER CHOICE"}
                        </span>
                      )}
                      {state.difficulty === "HARD" && option.moneyCost ? (
                        <span className={`stamp ${affordLocked ? "text-blood-bright border-blood-bright" : "text-brass-dim border-brass-dim"}`}>
                          <CoinIcon className="w-3 h-3" /> COST {option.moneyCost}
                        </span>
                      ) : null}
                      {state.difficulty === "HARD" && option.moneyDelta ? (
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
                    <p className="mt-2 text-sm italic text-ink/70">
                      {option.quote.speaker}: {"“"}
                      {option.quote.text}
                      {"”"}
                    </p>
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
      {content}
    </>
  );
}
