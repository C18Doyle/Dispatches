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

/** Whether the system asks for reduced motion (prefers-reduced-motion), kept up to date if it changes. */
export function usePrefersReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [on, setOn] = useState(() => {
    try {
      return !!(window.matchMedia && window.matchMedia(query).matches);
    } catch (e) {
      return false;
    }
  });
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const handler = (e) => setOn(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else if (mq.addListener) mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else if (mq.removeListener) mq.removeListener(handler);
    };
  }, []);
  return on;
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

// ---- The bindings: which key and which controller button does what (rebindable in the menu) ----
// Four keyboard actions and four controller actions can be moved. What cannot: the digits 1 to 9 (they are the orders' numbers on every
// screen), Tab, the D-pad and the left stick (they move between the buttons), and Escape, which closes what is open or opens the menu
// whatever else is bound to it, so a binding can never lock a player out of the menu that changes it.
export const BINDINGS_KEY = "dispatchesWW2_bindings";
export const KEY_ACTIONS = [
  { id: "confirm", def: "Enter", help: T("Continue, or press the button that has the focus") },
  { id: "reconsider", def: "r", help: T("Open Reconsider an Earlier Decision") },
  { id: "journal", def: "j", help: T("Open the war journal") },
  { id: "back", def: "Escape", help: T("Close what is open, or open this menu") },
];
/** The actions a Steam Input build can send (window.dispatchesInput.act), in the order the Steam configurator lists them. */
export const STEAM_INPUT_ACTIONS = [
  { id: "press", help: T("Press the button that has the focus") },
  { id: "back", help: T("Close what is open, or open this menu") },
  { id: "menu", help: T("Open this menu") },
  { id: "journal", help: T("Open the war journal") },
  { id: "menu_up", help: T("Move to the previous button") },
  { id: "menu_down", help: T("Move to the next button") },
  { id: "continue", help: T("Continue") },
  { id: "reconsider", help: T("Open Reconsider an Earlier Decision") },
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({ id: `order_${n}`, help: T("Order {n}"), n })),
];
export const PAD_ACTIONS = [
  { id: "press", def: 0, help: T("Press the button that has the focus") },
  { id: "back", def: 1, help: T("Close what is open, or open this menu") },
  { id: "menu", def: 9, help: T("Open this menu") },
  { id: "journal", def: 8, help: T("Open the war journal") },
];
/** Keys and buttons that cannot be bound to an action. */
export const RESERVED_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Tab", "Shift", "Control", "Alt", "Meta", "CapsLock"];
export const RESERVED_PAD = [12, 13, 14, 15, 16];
export const defaultBindings = () => ({
  keys: Object.fromEntries(KEY_ACTIONS.map((a) => [a.id, a.def])),
  pad: Object.fromEntries(PAD_ACTIONS.map((a) => [a.id, a.def])),
});
/** The bindings kept between visits, over the defaults (an unknown or reserved value falls back to the default). */
export function loadBindings() {
  const b = defaultBindings();
  try {
    const kept = JSON.parse(window.localStorage.getItem(BINDINGS_KEY) || "null") || {};
    for (const a of KEY_ACTIONS) if (typeof kept.keys?.[a.id] === "string" && kept.keys[a.id] && !RESERVED_KEYS.includes(kept.keys[a.id])) b.keys[a.id] = kept.keys[a.id];
    for (const a of PAD_ACTIONS) if (Number.isInteger(kept.pad?.[a.id]) && kept.pad[a.id] >= 0 && kept.pad[a.id] < 20 && !RESERVED_PAD.includes(kept.pad[a.id])) b.pad[a.id] = kept.pad[a.id];
  } catch (e) {
    /* storage blocked or the value unreadable: the defaults */
  }
  return b;
}
let BINDINGS = typeof window !== "undefined" ? loadBindings() : defaultBindings();
export const currentBindings = () => BINDINGS;
/** Keys that always do one thing, whatever is bound: Enter and Space continue, Escape goes back. */
const ALWAYS = { Enter: "confirm", " ": "confirm", Escape: "back" };
/**
 * Bind `value` to `action` ("keys" or "pad"). Refused, and nothing changes, when the value is reserved, is one of the keys that always do
 * something else, or is already bound to another action (that one has to be moved first): { ok: false, reason, other }.
 */
export function rebind(kind, action, value) {
  if (kind === "keys" ? RESERVED_KEYS.includes(value) : RESERVED_PAD.includes(value)) return { ok: false, reason: "reserved" };
  if (kind === "keys" && ALWAYS[value] && ALWAYS[value] !== action) return { ok: false, reason: "always", other: ALWAYS[value] };
  const other = Object.keys(BINDINGS[kind]).find((o) => o !== action && sameBinding(kind, BINDINGS[kind][o], value));
  if (other) return { ok: false, reason: "taken", other };
  setBindings({ ...BINDINGS, [kind]: { ...BINDINGS[kind], [action]: value } });
  return { ok: true };
}
export function setBindings(next) {
  BINDINGS = next;
  try {
    window.localStorage.setItem(BINDINGS_KEY, JSON.stringify(next));
  } catch (e) {
    /* not kept */
  }
  applyPadGlyph();
  try {
    window.dispatchEvent(new CustomEvent("dispatchesWW2-bindings", { detail: next }));
  } catch (e) {
    /* no window */
  }
}
const sameBinding = (kind, a, b) => (kind === "keys" ? String(a).toLowerCase() === String(b).toLowerCase() : a === b);
/** Whether a key event is the key bound to `action`. */
export const keyIs = (e, action) => sameBinding("keys", e.key, BINDINGS.keys[action]);
/** The standard controller layout's button names (Xbox, as on the Steam Deck). */
export const PAD_BUTTON_NAMES = ["A", "B", "X", "Y", "LB", "RB", "LT", "RT", "View", "Start", "L3", "R3", "D-pad up", "D-pad down", "D-pad left", "D-pad right", "Guide"];
export const padButtonName = (i) => PAD_BUTTON_NAMES[i] || t("Button {n}", { n: i });
/** A key's name as the help shows it. */
export function keyName(k) {
  if (k === " ") return t("Space");
  if (k === "Escape") return "Esc";
  if (k === "ArrowUp") return "↑";
  if (k === "ArrowDown") return "↓";
  if (k === "ArrowLeft") return "←";
  if (k === "ArrowRight") return "→";
  return k.length === 1 ? k.toUpperCase() : k;
}
/** The controller's press button, as the focus badge draws it (INPUT_CSS reads --pad-press). */
function applyPadGlyph() {
  try {
    document.documentElement.style.setProperty("--pad-press", JSON.stringify(padButtonName(BINDINGS.pad.press)));
  } catch (e) {
    /* no document */
  }
}
if (typeof document !== "undefined") applyPadGlyph();
/** Set while the menu waits for the key or button to bind: the game's own handling stands aside. */
export const capture = { on: false };

/** The help rows, as the bindings stand: the keyboard first, then the controller. */
export function keyHelp() {
  const b = BINDINGS.keys;
  return [
    ["1 – 9", T("Choose the order, allocation or option with that number")],
    [b.confirm === "Enter" ? t("Enter or Space") : `${keyName(b.confirm)}, ${t("Enter or Space")}`, T("Continue, or press the button that has the focus")],
    [keyName(b.reconsider), T("Open Reconsider an Earlier Decision")],
    [keyName(b.journal), T("Open the war journal")],
    [b.back === "Escape" ? "Esc" : `${keyName(b.back)}, Esc`, T("Close what is open, or open this menu")],
    ["Tab", T("Move between the buttons")],
  ];
}
export function padHelp() {
  const p = BINDINGS.pad;
  return [
    [t("D-pad or left stick"), T("Move between the buttons")],
    [padButtonName(p.press), T("Press the button that has the focus")],
    [padButtonName(p.back), T("Close what is open, or open this menu")],
    [padButtonName(p.menu), T("Open this menu")],
    [padButtonName(p.journal), T("Open the war journal")],
  ];
}

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
      if (capture.on || e.ctrlKey || e.metaKey || e.altKey) return;
      const typing = typingIn(e.target);
      // Escape always closes or opens the menu, and so does the key bound to it (except in a text box, where a letter is a letter).
      if (e.key === "Escape" || (!typing && keyIs(e, "back"))) {
        if (handlers.current.onBack()) e.preventDefault();
        return;
      }
      if (typing) return;
      setMode("keys");
      if (/^[1-9]$/.test(e.key)) {
        if (pressHotkey(e.key)) e.preventDefault();
      } else if (e.key === "Enter" || e.key === " " || keyIs(e, "confirm")) {
        // Enter or Space (or the key bound to continue): the focused control's own, else the screen's continue button.
        const a = document.activeElement;
        const onControl = a && a !== document.body && a.matches && a.matches(FOCUSABLE);
        if (onControl && (e.key === "Enter" || e.key === " ")) return;
        if (onControl && a.click) (a.click(), e.preventDefault());
        else if (pressHotkey("enter")) e.preventDefault();
      } else if (keyIs(e, "reconsider")) {
        if (pressHotkey("r")) e.preventDefault();
      } else if (keyIs(e, "journal")) {
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
      // While the menu waits for a button to bind, it reads the controller itself.
      if (capture.on) {
        for (let i = 0; i < pad.buttons.length; i++) prev[i] = pressed(i);
        raf = requestAnimationFrame(poll);
        return;
      }
      const B = BINDINGS.pad;
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
      if (edge(B.press)) {
        const a = document.activeElement;
        if (a && a !== document.body && a.click) a.click();
        else moveFocus(1);
        used = true;
      }
      if (edge(B.back)) (handlers.current.onBack(), (used = true));
      if (edge(B.menu)) (handlers.current.onMenu(), (used = true));
      if (edge(B.journal)) (handlers.current.onJournal(), (used = true));
      if (used) setMode("pad");
      raf = requestAnimationFrame(poll);
    }
    const start = () => {
      if (!raf && typeof requestAnimationFrame === "function") raf = requestAnimationFrame(poll);
    };
    window.addEventListener("gamepadconnected", start);
    if (navigator.getGamepads && [...navigator.getGamepads()].some(Boolean)) start();
    // The game's actions by name, for a desktop build that reads the controller through Steam Input (the action names are the ones in
    // steam/input/game_actions_APPID.vdf; docs/STEAM.md). Returns whether the action did something.
    const act = (name) => {
      if (capture.on) return false;
      setMode("pad");
      if (name === "menu_up") return moveFocus(-1), true;
      if (name === "menu_down") return moveFocus(1), true;
      if (name === "press") {
        const a = document.activeElement;
        if (a && a !== document.body && a.click) return a.click(), true;
        return moveFocus(1), true;
      }
      if (name === "back") return !!handlers.current.onBack();
      if (name === "menu") return !!handlers.current.onMenu();
      if (name === "journal") return !!handlers.current.onJournal();
      if (name === "continue") return pressHotkey("enter");
      if (name === "reconsider") return pressHotkey("r");
      const n = /^order_([1-9])$/.exec(name);
      if (n) return pressHotkey(n[1]);
      return false;
    };
    window.dispatchesInput = { act };
    return () => {
      if (window.dispatchesInput && window.dispatchesInput.act === act) delete window.dispatchesInput;
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
  content: var(--pad-press, "A") / ""; display: inline-block; margin-left: 8px; width: 20px; height: 20px; line-height: 20px; border-radius: 50%;
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

/** The prompt bar as the controller bindings stand (the menu and the journal keep their symbols while on Start and View). */
export function padPrompts() {
  const p = BINDINGS.pad;
  const glyph = (i, sym) => (i === 9 || i === 8 ? sym : padButtonName(i));
  return [
    { glyph: padButtonName(p.press), colour: p.press === 0 ? "#2f6b34" : "#333333", text: T("Press") },
    { glyph: padButtonName(p.back), colour: p.back === 1 ? "#8a2a24" : "#333333", text: T("Back") },
    { glyph: glyph(p.menu, "☰"), colour: "#333333", text: T("Menu") },
    { glyph: glyph(p.journal, "⧉"), colour: "#333333", text: T("Journal") },
  ];
}

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
