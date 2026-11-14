// The app shell's parts that need nothing of the game: settings kept between visits, full screen, crash reports, and the keyboard
// and the controller (Dispatches WW2). The first part of App.jsx to be a real module (docs/MODULES.md): it imports what it uses and
// part 00-head imports it, so the assembled App.jsx and its tools see it as any other import. The components that use it (the settings
// rows, the in-run menu, the war journal) are still in part 47-app-shell.
import { useState, useEffect, useRef } from "react";
import { t, T, getLanguage } from "@dispatches/i18n";
// ---- Settings kept between visits ----
/** A setting that is kept in localStorage under `key` (as JSON). Storage can be blocked; the setting then lasts until the page closes. */
export function useKeptSetting(key, initial) {
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
export const FONT_SCALES = [0.9, 1, 1.15, 1.3];
export const fontScaleName = (s) => (s <= 0.9 ? t("Small") : s >= 1.3 ? t("Extra large") : s >= 1.15 ? t("Large") : t("Normal"));

/** Full screen, where the browser or the desktop build allows it. */
export function useFullscreen() {
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
export const CRASH_REPORT_URL = null; // set by a release build that has somewhere to send reports; null sends nothing
export const CRASH_OPT_IN_KEY = "dispatchesWW2_crash_reports";
export const CRASH_STORE_KEY = "dispatchesWW2_crash_log";
/** Where the player is, kept up to date by the app on every render so a report can say it. */
export const CRASH_CONTEXT = { campaignId: null, position: null, screen: null, mode: null, decisions: 0 };
export const crashReportsOn = () => {
  try {
    return window.localStorage.getItem(CRASH_OPT_IN_KEY) === "true";
  } catch (e) {
    return false;
  }
};
export function buildCrashReport(error, info) {
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
export function keepCrashReport(report) {
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
export function keptCrashReports() {
  try {
    return JSON.parse(window.localStorage.getItem(CRASH_STORE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}
/** Hands the player a report as a file to save. */
export function downloadCrashReport(report) {
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


// ---- Keyboard and controller ----
// One set of markers drives both: a button with data-hotkey="1" … "9" is pressed by that number key, data-hotkey="enter" by Enter (when
// nothing else has the focus) and data-hotkey="r" by R. Escape (or B on a controller) closes what is open or opens the menu; J (or the
// controller's View button) opens the war journal; Start opens the menu. On a controller the D-pad or left stick moves between the
// buttons on the page, and A presses the one that has the focus. Keys typed into a text box are left alone.
export const KEY_HELP = [
  ["1 – 9", T("Choose the order, allocation or option with that number")],
  ["Enter or Space", T("Continue, or press the button that has the focus")],
  ["R", T("Open Reconsider an Earlier Decision")],
  ["J", T("Open the war journal")],
  ["Esc", T("Close what is open, or open this menu")],
  ["Tab", T("Move between the buttons")],
];
export const PAD_HELP = [
  ["D-pad or left stick", T("Move between the buttons")],
  ["A", T("Press the button that has the focus")],
  ["B", T("Close what is open, or open this menu")],
  ["Start", T("Open this menu")],
  ["View", T("Open the war journal")],
];

export const FOCUSABLE = 'button:not([disabled]), summary, select:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
/** Whether a control can be seen. Where the page has no layout at all (a test page), it is whatever is not hidden or inside a closed section. */
export const visible = (el) => {
  const r = el.getBoundingClientRect();
  if (r.width > 0 && r.height > 0) return true;
  const laidOut = document.documentElement.getBoundingClientRect().width > 0;
  if (laidOut) return false;
  if (el.closest("[hidden], [aria-hidden='true']")) return false;
  const shut = el.closest("details:not([open])");
  return !shut || el.tagName === "SUMMARY" || (el.closest("summary") && el.closest("summary").parentElement === shut);
};
/** The part of the page input acts on: the open dialog if there is one, else the whole page. */
export const inputScope = () => document.querySelector('[role="dialog"][aria-modal="true"]') || document;
export function pressHotkey(key) {
  const el = [...inputScope().querySelectorAll(`[data-hotkey="${key}"]`)].find((e) => visible(e) && !e.disabled);
  if (!el) return false;
  el.click();
  return true;
}
export function moveFocus(step) {
  const list = [...inputScope().querySelectorAll(FOCUSABLE)].filter(visible);
  if (!list.length) return;
  const i = list.indexOf(document.activeElement);
  const next = list[i < 0 ? (step > 0 ? 0 : list.length - 1) : (i + step + list.length) % list.length];
  next.focus();
  if (next.scrollIntoView) next.scrollIntoView({ block: "center", behavior: "auto" });
}
export const typingIn = (el) => !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);

/** Keyboard shortcuts and controller support, for the whole app. `onBack` closes what is open or opens the menu. */
export function useInputControls({ onBack, onMenu, onJournal }) {
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
export const INPUT_CSS = `
[data-input="pad"] :focus, [data-input="keys"] :focus-visible { outline: 4px solid #b08d3f !important; outline-offset: 3px; }
[data-input="pad"] button, [data-input="pad"] summary, [data-input="pad"] select { min-height: 44px; }
[data-input="pad"] button:focus:not(:disabled)::after, [data-input="pad"] summary:focus::after {
  content: "A" / ""; display: inline-block; margin-left: 8px; width: 20px; height: 20px; line-height: 20px; border-radius: 50%;
  background: #2f6b34; color: #ffffff; font: 700 12px/20px 'IBM Plex Mono', monospace; text-align: center; vertical-align: middle; text-decoration: none;
}
.dg-pad-prompts { display: none; }
[data-input="pad"] .dg-pad-prompts { display: flex; }
/* The prompts are drawn from attributes, not text, so a page's text (what the UI baseline hashes) is the same with or without a pad. */
.dg-pad-item::before { content: attr(data-glyph); display: inline-block; min-width: 20px; height: 20px; padding: 0 5px; border-radius: 10px; color: #ffffff; background: var(--pad-colour); font: 700 11px/20px 'IBM Plex Mono', monospace; text-align: center; margin-right: 5px; }
.dg-pad-item::after { content: attr(data-label); }
`;

/** The controller's buttons as the prompt bar shows them (Xbox layout, as on the Steam Deck). */
export const PAD_PROMPTS = [
  { glyph: "A", colour: "#2f6b34", text: T("Press") },
  { glyph: "B", colour: "#8a2a24", text: T("Back") },
  { glyph: "☰", colour: "#333333", text: T("Menu") },
  { glyph: "⧉", colour: "#333333", text: T("Journal") },
];

// ---- Settings shared between components ----
/**
 * A setting kept between visits that every component reading it sees change at once: the settings rows set it, the app root applies it.
 * Each copy listens for the others through a window event (dispatchesWW2-setting).
 */
export function useSharedSetting(key, initial) {
  const [value, setValue] = useKeptSetting(key, initial);
  useEffect(() => {
    const on = (e) => {
      if (e.detail && e.detail.key === key) setValue(e.detail.value);
    };
    window.addEventListener("dispatchesWW2-setting", on);
    return () => window.removeEventListener("dispatchesWW2-setting", on);
  }, [key]);
  const set = (v) => {
    setValue(v);
    try {
      window.dispatchEvent(new CustomEvent("dispatchesWW2-setting", { detail: { key, value: v } }));
    } catch (e) {
      /* old browser: this copy still changes */
    }
  };
  return [value, set];
}

// ---- Readability ----
// Wider lines, wider letters and stronger map colours: applied by the app root as style sheets when the setting is on.
export const READABILITY_KEYS = { lines: "dispatchesWW2_wide_lines", letters: "dispatchesWW2_wide_letters", mapContrast: "dispatchesWW2_map_contrast" };
export const WIDE_LINES_CSS = `
p, li, dd, label, figcaption, .leading-snug, .leading-relaxed, .leading-tight { line-height: 1.9 !important; }
`;
export const WIDE_LETTERS_CSS = `
p, li, dd, figcaption, button span.block { letter-spacing: 0.05em !important; word-spacing: 0.14em !important; }
`;
export const MAP_CONTRAST_CSS = `
.dg-reportmap-inner { filter: contrast(1.35) saturate(1.35); }
.dg-reportmap-inner svg path { stroke-width: 1.6px; }
`;
