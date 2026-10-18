import themeData from "./themes.json";
import { def, ui } from "./game";

/**
 * The look of the game. A theme is a palette (the same token names tailwind.config.js uses), a display face, and the colours the artwork in art.tsx is drawn with.
 * They are applied as CSS variables on <html>, so nothing in the markup names a colour. Themes are data in themes.json; scripts/check-a11y.mjs checks every one.
 * The choice is kept per seat under its own key, apart from the engine's settings.
 */
export interface Theme {
  id: string;
  label: string;
  blurb: string;
  displayFont: string;
  colors: Record<string, string>;
  art: Record<string, string>;
  /** The page itself: dark or light, the hatching and vignette over it, and the colours of the title over the title art. */
  page: { scheme: "dark" | "light"; hatch: string; vignette: string; titleKicker: string; titleText: string; titleSub: string };
}

export const THEMES = themeData.themes as unknown as Theme[];
export const DEFAULT_THEME: string = themeData.default;

const KEY = `${def.config.id}_theme`;

/** "#8c1b1b" -> "140 27 27", the form tailwind's `rgb(var(--c-x) / <alpha>)` colours read. */
function channels(hex: string): string {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(" ");
}

export function loadTheme(): string {
  try {
    const id = localStorage.getItem(KEY);
    if (id && THEMES.some((t) => t.id === id)) return id;
  } catch {
    /* private window, or storage blocked: the default theme is fine */
  }
  // a first-time player of a seat sees that seat's own look
  return ui.defaultTheme && THEMES.some((x) => x.id === ui.defaultTheme) ? ui.defaultTheme : DEFAULT_THEME;
}

export function saveTheme(id: string): void {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* not kept, still applied for this visit */
  }
}

export function applyTheme(id: string): void {
  const theme = THEMES.find((t) => t.id === id) ?? THEMES.find((t) => t.id === DEFAULT_THEME) ?? THEMES[0];
  const root = document.documentElement;
  for (const [name, hex] of Object.entries(theme.colors)) root.style.setProperty(`--c-${name}`, channels(hex));
  for (const [name, hex] of Object.entries(theme.art)) root.style.setProperty(`--a-${name}`, hex);
  root.style.setProperty("--font-display", theme.displayFont);
  root.style.setProperty("--hatch", theme.page.hatch);
  root.style.setProperty("--vignette", theme.page.vignette);
  root.style.setProperty("--t-kicker", theme.page.titleKicker);
  root.style.setProperty("--t-title", theme.page.titleText);
  root.style.setProperty("--t-sub", theme.page.titleSub);
  root.dataset.scheme = theme.page.scheme;
  root.dataset.theme = theme.id;
}
