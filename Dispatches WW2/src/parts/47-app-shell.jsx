// ---------- THE APP SHELL (Dispatches WW2) ----------
// What sits around the files rather than in them: the settings (shown on the opening screen and in the in-run menu), the in-run menu
// with its three save slots, the war journal, the records across runs, the keyboard and controller, and the crash reports.

// ---- Settings kept between visits ----
/** A setting that is kept in localStorage under `key` (as JSON). Storage can be blocked; the setting then lasts until the page closes. */
function useKeptSetting(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw == null ? initial : JSON.parse(raw);
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* not kept */
    }
  }, [key, value]);
  return [value, setValue];
}

/** The text sizes, smallest first. Extra large is for a handheld (the Steam Deck) read at arm's length. */
const FONT_SCALES = [0.9, 1, 1.15, 1.3];
const fontScaleName = (s) => (s <= 0.9 ? t("Small") : s >= 1.3 ? t("Extra large") : s >= 1.15 ? t("Large") : t("Normal"));

/** Full screen, where the browser or the desktop build allows it. */
function useFullscreen() {
  const [on, setOn] = useState(() => typeof document !== "undefined" && !!document.fullscreenElement);
  useEffect(() => {
    const onChange = () => setOn(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const can = typeof document !== "undefined" && !!(document.documentElement && document.documentElement.requestFullscreen);
  const toggle = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    } catch (e) {
      /* refused: stays as it is */
    }
  };
  return { on, can, toggle };
}

// ---- Crash reports ----
// When the file is damaged (ErrorBoundary, part 45) the game can keep a report of what happened: the command, the report, the screen,
// the error and where it was thrown. Keeping them is off until the player turns it on (Settings: "Keep crash reports"). A report never
// leaves the machine unless the player copies or saves it, or a build sets CRASH_REPORT_URL and the player has turned reports on.
const CRASH_REPORT_URL = null; // set by a release build that has somewhere to send reports; null sends nothing
const CRASH_OPT_IN_KEY = "dispatchesWW2_crash_reports";
const CRASH_STORE_KEY = "dispatchesWW2_crash_log";
/** Where the player is, kept up to date by the app on every render so a report can say it. */
const CRASH_CONTEXT = { campaignId: null, position: null, screen: null, mode: null, decisions: 0 };
const crashReportsOn = () => {
  try {
    return window.localStorage.getItem(CRASH_OPT_IN_KEY) === "true";
  } catch (e) {
    return false;
  }
};
function buildCrashReport(error, info) {
  return {
    when: new Date().toISOString(),
    game: "Dispatches WW2",
    version: typeof __GAME_VERSION__ !== "undefined" ? __GAME_VERSION__ : "0.1.0",
    language: getLanguage(),
    ...CRASH_CONTEXT,
    error: String((error && error.message) || error).slice(0, 500),
    stack: String((error && error.stack) || "").split("\n").slice(0, 12).join("\n"),
    componentStack: String((info && info.componentStack) || "").split("\n").slice(0, 12).join("\n"),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };
}
/** Keeps the report (the last ten) and, when a destination is set and the player agreed, sends it. Never throws. */
function keepCrashReport(report) {
  if (!crashReportsOn()) return;
  try {
    const list = JSON.parse(window.localStorage.getItem(CRASH_STORE_KEY) || "[]");
    window.localStorage.setItem(CRASH_STORE_KEY, JSON.stringify([...list, report].slice(-10)));
  } catch (e) {
    /* storage full or blocked */
  }
  if (CRASH_REPORT_URL) {
    try {
      fetch(CRASH_REPORT_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(report), keepalive: true }).catch(() => {});
    } catch (e) {
      /* offline */
    }
  }
}
function keptCrashReports() {
  try {
    return JSON.parse(window.localStorage.getItem(CRASH_STORE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}
/** Hands the player a report as a file to save. */
function downloadCrashReport(report) {
  try {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dispatches-ww2-crash-${String(report.when || Date.now()).replace(/[:.]/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 0);
  } catch (e) {
    /* no downloads here */
  }
}

// ---- Settings ----
/**
 * The rows of the settings, on the opening screen and in the in-run menu. `idp` keeps the labels' ids apart when both could be on a page.
 * "Always let my staff plan battles" and "Keep crash reports" keep themselves; the rest belong to the app.
 */
function SettingsRows({ idp = "setting-", instantText, onToggleInstant, soundOn, onToggleSound, fontScale, onCycleFontScale, reducedMotion, onToggleReducedMotion, musicOn, onToggleMusic, musicVolume, onMusicVolumeChange, dyslexia, onToggleDyslexia, night, onToggleNight }) {
  const language = getLanguage();
  // "Always let my staff plan battles": off until asked for. The battle screens read the same key.
  const STAFF_KEY = "dispatchesWW2_staff_plans";
  const [staffAlways, setStaffAlways] = useState(() => {
    try {
      return window.localStorage.getItem(STAFF_KEY) === "1";
    } catch (e) {
      return false;
    }
  });
  function toggleStaffAlways() {
    const next = !staffAlways;
    setStaffAlways(next);
    try {
      if (next) window.localStorage.setItem(STAFF_KEY, "1");
      else window.localStorage.removeItem(STAFF_KEY);
    } catch (e) {
      /* storage can be blocked; the setting then lasts only until the page is closed */
    }
  }
  const [crashOn, setCrashOn] = useKeptSetting(CRASH_OPT_IN_KEY, false);
  const fs = useFullscreen();
  const toggleCls = "border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]";
  const labelCls = "text-xs uppercase tracking-[0.25em] font-bold text-[#000000]";
  const mono = { fontFamily: "'IBM Plex Mono', monospace" };
  return (
    <>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id={idp + "instant-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Instant text (skip typewriter)")}
          </span>
          <button
            onClick={onToggleInstant}
            aria-pressed={instantText}
            aria-labelledby={idp + "instant-label"}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {instantText ? t("On") : t("Off")}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id={idp + "sound-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Sound (typewriter, stamps, dice, battle reports)")}
          </span>
          <button
            onClick={onToggleSound}
            aria-pressed={soundOn}
            aria-labelledby={idp + "sound-label"}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {soundOn ? t("On") : t("Off")}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between gap-3`}>
          <span id={idp + "language-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Language")}
            {language !== "en" && (
              <span className="block normal-case tracking-normal font-normal text-[12px] opacity-80 mt-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
                {t("Menus, buttons and help are translated. The story text is in English.")}
              </span>
            )}
          </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-labelledby={idp + "language-label"}
            className="border-2 border-black px-3 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] bg-transparent focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} lang={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id={idp + "textsize-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Text size")}
          </span>
          <button
            onClick={onCycleFontScale}
            aria-labelledby={idp + "textsize-label"}
            aria-label={t("Text size: {p}. Activate to cycle to the next size.", { p: fontScaleName(fontScale) })}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {fontScaleName(fontScale)}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id={idp + "dyslexia-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Dyslexia-friendly typeface")}
          </span>
          <button
            onClick={onToggleDyslexia}
            aria-pressed={!!dyslexia}
            aria-labelledby={idp + "dyslexia-label"}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {dyslexia ? t("On") : t("Off")}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id={idp + "night-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Night reading (a dark page)")}
          </span>
          <button
            onClick={onToggleNight}
            aria-pressed={!!night}
            aria-labelledby={idp + "night-label"}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {night ? t("On") : t("Off")}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id={idp + "reducedmotion-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Reduce motion (stamp tilt, transitions)")}
          </span>
          <button
            onClick={onToggleReducedMotion}
            aria-pressed={reducedMotion}
            aria-labelledby={idp + "reducedmotion-label"}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {reducedMotion ? t("On") : t("Off")}
          </button>
        </div>
        <div className={`${paper} p-4 flex items-center justify-between gap-3`}>
          <span id={idp + "staff-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Always let my staff plan battles")}
            <span className="block normal-case tracking-normal font-normal text-[12px] opacity-80 mt-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
              {t("The staff plan and fight every battle for you. Off by default.")}
            </span>
          </span>
          <button
            onClick={toggleStaffAlways}
            aria-pressed={staffAlways}
            aria-labelledby={idp + "staff-label"}
            className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {staffAlways ? t("On") : t("Off")}
          </button>
        </div>
        <div className={`${paper} p-4 flex flex-col gap-2`}>
          <div className="flex items-center justify-between">
            <span id={idp + "music-label"} className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {t("Music")}
            </span>
            <button
              onClick={onToggleMusic}
              aria-pressed={musicOn}
              aria-labelledby={idp + "music-label"}
              className="border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 active:scale-95"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {musicOn ? t("On") : t("Off")}
            </button>
          </div>
          {musicOn && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
              aria-label={t("Music volume, currently {p} percent", { p: Math.round(musicVolume * 100) })}
              className="w-full accent-black"
            />
          )}
        </div>      {fs.can && (
        <div className={`${paper} p-4 flex items-center justify-between`}>
          <span id={idp + "fullscreen-label"} className={labelCls} style={mono}>
            {t("Full screen")}
          </span>
          <button onClick={fs.toggle} aria-pressed={fs.on} aria-labelledby={idp + "fullscreen-label"} className={toggleCls} style={mono}>
            {fs.on ? t("On") : t("Off")}
          </button>
        </div>
      )}
      <div className={`${paper} p-4 flex items-center justify-between gap-3`}>
        <span id={idp + "crash-label"} className={labelCls} style={mono}>
          {t("Keep crash reports")}
          <span className="block normal-case tracking-normal font-normal text-[12px] opacity-80 mt-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
            {t("If the file is damaged, keep a short report of what went wrong (the command, the report, the error, the browser and the language) on this machine, to copy or save and send to the developer. Off by default; nothing is sent by itself.")}
          </span>
        </span>
        <button onClick={() => setCrashOn(!crashOn)} aria-pressed={!!crashOn} aria-labelledby={idp + "crash-label"} className={toggleCls} style={mono}>
          {crashOn ? t("On") : t("Off")}
        </button>
      </div>
    </>
  );
}

// ---- Keyboard and controller ----
// One set of markers drives both: a button with data-hotkey="1" … "9" is pressed by that number key, data-hotkey="enter" by Enter (when
// nothing else has the focus) and data-hotkey="r" by R. Escape (or B on a controller) closes what is open or opens the menu; J (or the
// controller's View button) opens the war journal; Start opens the menu. On a controller the D-pad or left stick moves between the
// buttons on the page, and A presses the one that has the focus. Keys typed into a text box are left alone.
const KEY_HELP = [
  ["1 – 9", T("Choose the order, allocation or option with that number")],
  ["Enter or Space", T("Continue, or press the button that has the focus")],
  ["R", T("Open Reconsider an Earlier Decision")],
  ["J", T("Open the war journal")],
  ["Esc", T("Close what is open, or open this menu")],
  ["Tab", T("Move between the buttons")],
];
const PAD_HELP = [
  ["D-pad or left stick", T("Move between the buttons")],
  ["A", T("Press the button that has the focus")],
  ["B", T("Close what is open, or open this menu")],
  ["Start", T("Open this menu")],
  ["View", T("Open the war journal")],
];

const FOCUSABLE = 'button:not([disabled]), summary, select:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
/** Whether a control can be seen. Where the page has no layout at all (a test page), it is whatever is not hidden or inside a closed section. */
const visible = (el) => {
  const r = el.getBoundingClientRect();
  if (r.width > 0 && r.height > 0) return true;
  const laidOut = document.documentElement.getBoundingClientRect().width > 0;
  if (laidOut) return false;
  if (el.closest("[hidden], [aria-hidden='true']")) return false;
  const shut = el.closest("details:not([open])");
  return !shut || el.tagName === "SUMMARY" || (el.closest("summary") && el.closest("summary").parentElement === shut);
};
/** The part of the page input acts on: the open dialog if there is one, else the whole page. */
const inputScope = () => document.querySelector('[role="dialog"][aria-modal="true"]') || document;
function pressHotkey(key) {
  const el = [...inputScope().querySelectorAll(`[data-hotkey="${key}"]`)].find((e) => visible(e) && !e.disabled);
  if (!el) return false;
  el.click();
  return true;
}
function moveFocus(step) {
  const list = [...inputScope().querySelectorAll(FOCUSABLE)].filter(visible);
  if (!list.length) return;
  const i = list.indexOf(document.activeElement);
  const next = list[i < 0 ? (step > 0 ? 0 : list.length - 1) : (i + step + list.length) % list.length];
  next.focus();
  if (next.scrollIntoView) next.scrollIntoView({ block: "center", behavior: "auto" });
}
const typingIn = (el) => !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);

/** Keyboard shortcuts and controller support, for the whole app. `onBack` closes what is open or opens the menu. */
function useInputControls({ onBack, onMenu, onJournal }) {
  const handlers = useRef({ onBack, onMenu, onJournal });
  handlers.current = { onBack, onMenu, onJournal };
  useEffect(() => {
    const setMode = (m) => {
      if (document.documentElement.dataset.input !== m) document.documentElement.dataset.input = m;
    };
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const typing = typingIn(e.target);
      if (e.key === "Escape") {
        if (handlers.current.onBack()) e.preventDefault();
        return;
      }
      if (typing) return;
      setMode("keys");
      if (/^[1-9]$/.test(e.key)) {
        if (pressHotkey(e.key)) e.preventDefault();
      } else if (e.key === "Enter" || e.key === " ") {
        // Enter or Space: the focused control's own, else the screen's continue button.
        const a = document.activeElement;
        const onControl = a && a !== document.body && a.matches && a.matches(FOCUSABLE);
        if (!onControl && pressHotkey("enter")) e.preventDefault();
      } else if (e.key === "r" || e.key === "R") {
        if (pressHotkey("r")) e.preventDefault();
      } else if (e.key === "j" || e.key === "J") {
        if (handlers.current.onJournal()) e.preventDefault();
      }
    }
    const onPointer = () => setMode("pointer");
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer, { passive: true });

    // The controller: polled while one is connected. Buttons act on the press, not while held; the stick repeats while held.
    let raf = 0;
    const prev = {};
    let stickAt = 0;
    function poll(now) {
      raf = 0;
      const pads = navigator.getGamepads ? [...navigator.getGamepads()].filter(Boolean) : [];
      if (!pads.length) return;
      const pad = pads[0];
      const pressed = (i) => !!(pad.buttons[i] && pad.buttons[i].pressed);
      const edge = (i) => {
        const p = pressed(i);
        const was = prev[i];
        prev[i] = p;
        return p && !was;
      };
      let used = false;
      if (edge(12) || edge(14)) (moveFocus(-1), (used = true));
      if (edge(13) || edge(15)) (moveFocus(1), (used = true));
      const y = pad.axes[1] || 0;
      if (Math.abs(y) > 0.6 && now - stickAt > 220) {
        moveFocus(y > 0 ? 1 : -1);
        stickAt = now;
        used = true;
      }
      if (edge(0)) {
        const a = document.activeElement;
        if (a && a !== document.body && a.click) a.click();
        else moveFocus(1);
        used = true;
      }
      if (edge(1)) (handlers.current.onBack(), (used = true));
      if (edge(9)) (handlers.current.onMenu(), (used = true));
      if (edge(8)) (handlers.current.onJournal(), (used = true));
      if (used) setMode("pad");
      raf = requestAnimationFrame(poll);
    }
    const start = () => {
      if (!raf && typeof requestAnimationFrame === "function") raf = requestAnimationFrame(poll);
    };
    window.addEventListener("gamepadconnected", start);
    if (navigator.getGamepads && [...navigator.getGamepads()].some(Boolean)) start();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("gamepadconnected", start);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

/** With a controller in hand the focus is drawn large and every control is a comfortable size to land on. */
const INPUT_CSS = `
[data-input="pad"] :focus, [data-input="keys"] :focus-visible { outline: 4px solid #b08d3f !important; outline-offset: 3px; }
[data-input="pad"] button, [data-input="pad"] summary, [data-input="pad"] select { min-height: 44px; }
`;

// ---- The in-run menu ----
function ShellButton({ children, onClick, hotkey, disabled, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-hotkey={hotkey}
      aria-label={label}
      className="w-full text-left border-2 border-black px-4 py-3 text-xs uppercase tracking-[0.2em] font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] disabled:opacity-40"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {children}
    </button>
  );
}

/** A modal sheet over the game: the in-run menu and the war journal use it. Focus goes to its heading and returns on close. */
function ShellSheet({ title, onClose, children }) {
  const headingRef = useRef(null);
  useEffect(() => {
    const back = document.activeElement;
    if (headingRef.current) headingRef.current.focus();
    return () => {
      if (back && back.focus) back.focus();
    };
  }, []);
  return (
    <div className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.75)] flex justify-center items-start overflow-y-auto px-4 py-8">
      <div role="dialog" aria-modal="true" aria-label={title} className="bg-white text-black w-full max-w-lg p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 ref={headingRef} tabIndex={-1} className="text-2xl uppercase outline-none" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="border-2 border-black px-3 py-1 text-xs uppercase tracking-widest font-bold hover:bg-[#000000] hover:text-[#ffffff] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {t("Close")}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * The menu during a run: back to the file, the war journal, the three save slots (at a briefing, where a save is a clean place to
 * resume), save and leave for the opening screen, the settings, and the keys and controller buttons.
 */
function InRunMenu({ campaign, canSave, slots, onSaveSlot, onClose, onJournal, onSaveAndHome, settings }) {
  const [names, setNames] = useState({});
  const [savedTo, setSavedTo] = useState(null);
  const sectionHead = (s) => (
    <div className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] mt-5 mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      {s}
    </div>
  );
  return (
    <ShellSheet title={t("Menu")} onClose={onClose}>
      <div className="flex flex-col gap-2">
        <ShellButton onClick={onClose} hotkey="1">{t("1 · Back to the file")}</ShellButton>
        <ShellButton onClick={onJournal} hotkey="2">{t("2 · The war journal")}</ShellButton>
        <ShellButton onClick={onSaveAndHome} hotkey="3" disabled={!canSave}>{t("3 · Save and return to the opening screen")}</ShellButton>
      </div>

      {sectionHead(t("Save to a slot"))}
      {!canSave && (
        <p className="text-[13px] italic mb-2" style={{ fontFamily: "'Courier Prime', monospace" }}>
          {t("A file can be saved to a slot at a briefing, before the order is given.")}
        </p>
      )}
      <ul className="flex flex-col gap-2">
        {slots.map((s) => {
          const fallback = s.run ? s.run.slotName || CAMPAIGNS[s.run.campaignId]?.name : "";
          return (
            <li key={s.n} className="border-2 border-black p-2">
              <div className="text-[12px] mb-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
                {s.run
                  ? t("Slot {n}: {name}, {length} decisions", { n: s.n, name: fallback || t("unnamed"), length: (s.run.log || []).length })
                  : t("Slot {n}: empty", { n: s.n })}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={40}
                  value={names[s.n] ?? ""}
                  onChange={(e) => setNames({ ...names, [s.n]: e.target.value })}
                  placeholder={t("Name (optional)")}
                  aria-label={t("Name for slot {n}", { n: s.n })}
                  disabled={!canSave}
                  className="flex-1 min-w-0 border-2 border-black px-2 py-1 text-[13px] disabled:opacity-40"
                  style={{ fontFamily: "'Courier Prime', monospace" }}
                />
                <button
                  onClick={async () => {
                    const ok = await onSaveSlot(s.n, (names[s.n] || "").trim() || `${campaign.name}`);
                    setSavedTo(ok ? s.n : -s.n);
                  }}
                  disabled={!canSave}
                  className="border-2 border-black px-3 text-xs uppercase tracking-widest font-bold hover:bg-[#000000] hover:text-[#ffffff] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] disabled:opacity-40"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {s.run ? t("Overwrite") : t("Save here")}
                </button>
              </div>
              {savedTo === s.n && <div role="status" className="text-[12px] mt-1 font-bold">{t("Saved.")}</div>}
              {savedTo === -s.n && <div role="status" className="text-[12px] mt-1 font-bold text-[#7a2e2e]">{t("The save failed: the browser's storage may be full or blocked.")}</div>}
            </li>
          );
        })}
      </ul>

      {sectionHead(t("Settings"))}
      <div className="flex flex-col gap-3">
        <SettingsRows idp="menu-setting-" {...settings} />
      </div>

      {sectionHead(t("Keys and controller"))}
      <dl className="text-[13px] grid grid-cols-[auto_1fr] gap-x-3 gap-y-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
        {[...KEY_HELP, ...PAD_HELP].map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{k}</dt>
            <dd>{t(v)}</dd>
          </div>
        ))}
      </dl>
    </ShellSheet>
  );
}

// ---- The war journal ----
/** The orders given so far in this file, newest first: what was chosen, what the record did, the odds faced, and the allocations. */
function WarJournal({ campaign, log, flags, onClose }) {
  const entries = (log || []).map((e, i) => ({ ...e, n: i + 1 })).reverse();
  return (
    <ShellSheet title={t("War Journal")} onClose={onClose}>
      <p className="text-[13px] mb-3" style={{ fontFamily: "'Courier Prime', monospace" }}>
        {t("{name} · {length} {length, plural, one {order} other {orders}} on file", { name: campaign.name, length: entries.length })}
      </p>
      {campaign.id === "american" && allocationRecord(flags).length > 0 && (
        <div className="mb-4 border-2 border-black p-3">
          <div className="text-xs uppercase tracking-[0.25em] font-bold mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {t("Allocation of effort")}
          </div>
          <EffortRecord flags={flags} accent={campaign.accent} />
        </div>
      )}
      {entries.length === 0 ? (
        <p className="text-[13px] italic" style={{ fontFamily: "'Courier Prime', monospace" }}>
          {t("No order has been given yet.")}
        </p>
      ) : (
        <ol className="flex flex-col gap-3">
          {entries.map((e) => (
            <li key={e.n} className="border-l-4 pl-3" style={{ borderColor: e.isHistorical ? "#2f6b3f" : campaign.accent }}>
              <div className="text-[11px] uppercase tracking-widest font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {t("{n}. {date}", { n: e.n, date: e.date || "" })}
              </div>
              <div className="text-[15px] font-bold" style={{ fontFamily: "Oswald, sans-serif" }}>
                {e.title}
              </div>
              <div className="text-[13px]" style={{ fontFamily: "'Courier Prime', monospace" }}>
                {e.label}
              </div>
              <div className="text-[12px] opacity-80 mt-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {e.isHistorical ? t("As the record did.") : e.histLabel ? t("The record: {label}", { label: e.histLabel }) : t("The record has no order here.")}
                {typeof e.rollP === "number" ? " " + t("A roll: this outcome had a {p}% chance.", { p: Math.round(e.rollP * 100) }) : ""}
                {e.advisor ? " " + t("Advised by {name}.", { name: e.advisor }) : ""}
              </div>
            </li>
          ))}
        </ol>
      )}
    </ShellSheet>
  );
}

// ---- Records across runs ----
/**
 * The record by command and the orders most often taken against the record, for the opening screen's War Record. Read from the record
 * saveRunRecord keeps (part 45): byCommand (files closed, best rank) and departures (how often each report's record was departed from).
 * Wars closed before this was kept count in the totals above but not here.
 */
function RecordsByCommand({ record }) {
  if (!record) return null;
  const by = record.byCommand || {};
  const commands = Object.values(CAMPAIGNS).filter((c) => !c.hidden && !c.sourceOnly);
  const departures = Object.values(record.departures || {})
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const mono = { fontFamily: "'IBM Plex Mono', monospace" };
  const body = { fontFamily: "'Courier Prime', monospace" };
  return (
    <div className={`${paper} p-5`}>
      <div className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] mb-2" style={mono}>
        {t("Records by Command")}
      </div>
      <table className="w-full text-[13px] text-[#000000]" style={body}>
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-widest" style={mono}>
            <th className="pr-2 font-bold">{t("Command")}</th>
            <th className="pr-2 font-bold">{t("Files closed")}</th>
            <th className="pr-2 font-bold">{t("Best rank")}</th>
            <th className="font-bold">{t("Endings")}</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((c) => {
            const r = by[c.id] || {};
            return (
              <tr key={c.id} className="border-t" style={{ borderColor: "#00000022" }}>
                <td className="pr-2 py-1 font-bold">{c.seal}</td>
                <td className="pr-2 py-1">{r.played || 0}</td>
                <td className="pr-2 py-1">{r.bestRank ? t(r.bestRank) : "—"}</td>
                <td className="py-1">{(r.endings || []).length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {departures.length > 0 && (
        <>
          <div className="text-xs uppercase tracking-[0.25em] font-bold text-[#000000] mt-4 mb-1" style={mono}>
            {t("Where you most often depart from the record")}
          </div>
          <ol className="list-decimal pl-5 text-[13px] text-[#000000]" style={body}>
            {departures.map((d) => (
              <li key={d.campaign + d.title}>
                {t("{title} ({seal}): {count} {count, plural, one {time} other {times}}", { title: d.title, seal: CAMPAIGNS[d.campaign] ? CAMPAIGNS[d.campaign].seal : d.campaign, count: d.count })}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

