// =============================================================================
// THEMES
// =============================================================================
//
// The colours of the game, as data: three themes (Paper, Night, High contrast), each a set of tokens and one accent per command. The stylesheet in the
// UI layer is generated from this (themeCss), and check-themes.js holds every pair of text and ground, in every theme and for every command, to
// the WCAG contrast ratio for normal text (4.5 to 1; 7 to 1 in High contrast). Changing a colour is a change here, never in a component.
// =============================================================================

export const THEME_IDS = ["paper", "night", "contrast"];
export const THEME_LABELS = { paper: "Paper", night: "Night", contrast: "High contrast", auto: "Match my device" };

/** Tokens common to a theme. Text and ground pairs are listed in THEME_PAIRS. */
export const THEME_TOKENS = {
  paper: {
    base: { paper: "#f4efe2", paperRaised: "#e9e2cf", ink: "#1c1a17", inkSoft: "#5d574c", rule: "#1c1a17", accent: "#7a2e2e", good: "#3d5a2f", inverse: "#0d0c0b", sea: "#d3dddb", cp: "#cdb98f", ent: "#b6c5c4", neu: "#ece6d4" },
    // a command's own paper, accent and tint
    campaigns: {
      ohl: { accent: "#7a2e2e", tint: "rgba(70,80,60,.06)" },
      gqg: { accent: "#2f4858", paper: "#f1f0e8", tint: "rgba(40,70,110,.06)" },
      stavka: { accent: "#5c3a21", paper: "#f3e9cf", paperRaised: "#e8dcbb", tint: "rgba(150,110,40,.1)" },
      bef: { accent: "#3d4a2f", paper: "#eeeadb", paperRaised: "#dfdbc6", tint: "rgba(90,100,60,.08)" },
      aok: { accent: "#6b4a2f", paper: "#f4eedc", tint: "rgba(150,120,40,.07)" },
      otto: { accent: "#5a4a6b", paper: "#f3ecde", tint: "rgba(100,70,110,.06)" },
    },
    extra: { tint: "rgba(0,0,0,0)" },
  },
  night: {
    base: { paper: "#1b1814", paperRaised: "#27231d", ink: "#ece5d2", inkSoft: "#b9b09b", rule: "#cfc6b0", accent: "#e0a79d", good: "#9cc48a", inverse: "#f4efe2", sea: "#202c2e", cp: "#6a5c40", ent: "#38535a", neu: "#363229" },
    campaigns: {
      ohl: { accent: "#e6a39b" }, gqg: { accent: "#93b8d4" }, stavka: { accent: "#dbb57f" }, bef: { accent: "#adc58d" }, aok: { accent: "#dcbd6e" }, otto: { accent: "#c7acea" },
    },
    extra: { tint: "rgba(0,0,0,0)", grain: "none" },
  },
  contrast: {
    base: { paper: "#ffffff", paperRaised: "#f1f1f1", ink: "#000000", inkSoft: "#1f1f1f", rule: "#000000", accent: "#6a0000", good: "#0a4a00", inverse: "#000000", sea: "#e3eef3", cp: "#e6cf91", ent: "#9fc4cb", neu: "#f7f7f7" },
    campaigns: {
      ohl: { accent: "#5c0000" }, gqg: { accent: "#002f4a" }, stavka: { accent: "#4a2600" }, bef: { accent: "#1c3300" }, aok: { accent: "#4f3000" }, otto: { accent: "#38195f" },
    },
    extra: { tint: "rgba(0,0,0,0)", grain: "none" },
  },
};

/** The campaign bands (decoration, not text): the same in every theme. */
export const CAMPAIGN_BANDS = {
  ohl: "linear-gradient(90deg,#1c1a17 0 33.3%,#f4efe2 33.3% 66.6%,#7a2e2e 66.6%)",
  gqg: "linear-gradient(90deg,#2f4858 0 33.3%,#f1f0e8 33.3% 66.6%,#8a2f2f 66.6%)",
  stavka: "linear-gradient(90deg,#1c1a17 0 33.3%,#b08a2e 33.3% 66.6%,#f3e9cf 66.6%)",
  bef: "repeating-linear-gradient(90deg,#3d4a2f 0 14px,#eeeadb 14px 20px)",
  aok: "linear-gradient(90deg,#1c1a17 0 50%,#c4a02a 50%)",
  otto: "repeating-linear-gradient(90deg,#5a4a6b 0 4px,#f3ecde 4px 9px)",
};

/** [text token, ground token]: every one of these must reach the contrast ratio, in every theme and for every command. */
export const THEME_PAIRS = [
  ["ink", "paper"], ["ink", "paperRaised"], ["inkSoft", "paper"], ["inkSoft", "paperRaised"],
  ["accent", "paper"], ["accent", "paperRaised"], ["good", "paper"], ["paper", "inverse"], ["paperRaised", "inverse"], ["ink", "cp"], ["ink", "ent"],
];
export const THEME_MIN_RATIO = { paper: 4.5, night: 4.5, contrast: 7 };

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const luminance = (hex) => { const [r, g, b] = hexToRgb(hex).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

/** The WCAG contrast ratio of two #rrggbb colours. */
export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The tokens in force for a theme and (optionally) a command: the base with the command's own over it. */
export function tokensFor(theme, campaignId) {
  const t = THEME_TOKENS[theme];
  const own = (campaignId && t.campaigns[campaignId]) || {};
  // only the Paper theme lets a command change the paper itself
  return { ...t.base, ...(own.accent ? { accent: own.accent } : {}), ...(theme === "paper" ? { paper: own.paper || t.base.paper, paperRaised: own.paperRaised || t.base.paperRaised } : {}) };
}

const kebab = (k) => k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
const decls = (o) => Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => `--${kebab(k)}:${v}`).join(";");

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .36  0 0 0 0 .3  0 0 0 0 .2  0 0 0 .1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

/** The stylesheet's tokens: the Paper theme is the default, Night and High contrast override it on [data-theme]. */
export function themeCss() {
  const out = [];
  const p = THEME_TOKENS.paper;
  out.push(`.dg-root{${decls(p.base)};${decls(p.extra)};--grain:${GRAIN};--band:linear-gradient(90deg,var(--ink) 0 33.3%,var(--paper) 33.3% 66.6%,var(--accent) 66.6%);counter-reset:ord}`);
  for (const [cid, c] of Object.entries(p.campaigns)) {
    out.push(`.dg-root[data-campaign="${cid}"]{${decls({ accent: c.accent, paper: c.paper, paperRaised: c.paperRaised, tint: c.tint })};--band:${CAMPAIGN_BANDS[cid]}}`);
  }
  for (const theme of ["night", "contrast"]) {
    const t = THEME_TOKENS[theme];
    out.push(`[data-theme="${theme}"] .dg-root{${decls(t.base)};${decls(t.extra)}}`);
    for (const [cid, c] of Object.entries(t.campaigns)) {
      out.push(`[data-theme="${theme}"] .dg-root[data-campaign="${cid}"]{${decls({ accent: c.accent, paper: t.base.paper, paperRaised: t.base.paperRaised, tint: t.extra.tint })};--band:${CAMPAIGN_BANDS[cid]}}`);
    }
  }
  // every command's accent is also a variable of its own, for the places that colour something by command (pins, the record) whatever the screen's root is
  for (const theme of THEME_IDS) {
    const sel = theme === "paper" ? ".dg-root" : `[data-theme="${theme}"] .dg-root`;
    const vars = Object.entries(THEME_TOKENS[theme].campaigns).map(([cid, c]) => `--acc-${cid}:${c.accent}`).join(";");
    out.push(`${sel}{${vars}}`);
  }
  // High contrast: heavier rules, no texture
  out.push(`[data-theme="contrast"] .dg-root{background-image:none}
  [data-theme="contrast"] .dg-root *{text-shadow:none!important}
  [data-theme="contrast"] .dg-choice,[data-theme="contrast"] .dg-btn,[data-theme="contrast"] .dg-card{border-width:2.5px}
  [data-theme="contrast"] .dg-quote,[data-theme="contrast"] .dg-note,[data-theme="contrast"] .dg-count{color:var(--ink)}
  [data-theme="contrast"] .dg-root button:focus-visible,[data-theme="contrast"] .dg-root summary:focus-visible{outline:4px solid var(--ink);outline-offset:3px}`);
  out.push(`[data-theme="night"] .dg-root{background-image:linear-gradient(rgba(255,255,255,.02),rgba(255,255,255,.02))}
  [data-theme="night"] .dg-choice,[data-theme="night"] .dg-cmd,[data-theme="night"] .dg-bt-arm,[data-theme="night"] .dg-meters,[data-theme="night"] .dg-cable{background-color:rgba(255,255,255,.035)}`);
  return out.join("\n  ");
}

/** The theme in force: "auto" follows the device. */
export function resolveTheme(setting, prefersDark, prefersMore) {
  if (setting === "auto") return prefersMore ? "contrast" : prefersDark ? "night" : "paper";
  return THEME_IDS.includes(setting) ? setting : "paper";
}
