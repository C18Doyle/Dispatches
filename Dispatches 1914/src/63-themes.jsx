// =============================================================================
// THEMES
// =============================================================================
//
// The colours of the game, as data: four themes (Sepia, Paper, Night, High contrast), each a set of tokens and one accent per command. The stylesheet in the
// UI layer is generated from this (themeCss), and check-themes.js holds every pair of text and ground, in every theme and for every command, to
// the WCAG contrast ratio for normal text (4.5 to 1; 7 to 1 in High contrast). Changing a colour is a change here, never in a component.
// =============================================================================

export const THEME_IDS = ["sepia", "paper", "night", "contrast"];
export const THEME_LABELS = { sepia: "Sepia", paper: "Paper", night: "Night", contrast: "High contrast", auto: "Match my device" };
/** The theme a new player sees. */
export const DEFAULT_THEME = "sepia";

/** Tokens common to a theme. Text and ground pairs are listed in THEME_PAIRS. */
export const THEME_TOKENS = {
  // Sepia: cream on black, a sepia map, no colour but one red kept for what needs a decision. The map has its own ink (mapInk, mapSoft) because it is a light sheet on a dark page.
  sepia: {
    base: { paper: "#0a0908", paperRaised: "#14110d", ink: "#ece5d0", inkSoft: "#b8ad90", rule: "#867d68", accent: "#e8664e", good: "#ece5d0", inverse: "#ece5d0", sea: "#b4a37c", cp: "#a39368", ent: "#c2b28b", neu: "#b8a880", mapInk: "#15110a", mapSoft: "#43371d" },
    campaigns: {
      ohl: { accent: "#e8664e" }, gqg: { accent: "#e8664e" }, stavka: { accent: "#e8664e" }, bef: { accent: "#e8664e" }, aok: { accent: "#e8664e" }, otto: { accent: "#e8664e" },
    },
    extra: { tint: "rgba(0,0,0,0)", grain: "none" },
  },
  paper: {
    base: { paper: "#f4efe2", paperRaised: "#e9e2cf", ink: "#1c1a17", inkSoft: "#5d574c", rule: "#1c1a17", accent: "#7a2e2e", good: "#3d5a2f", inverse: "#0d0c0b", sea: "#d3dddb", cp: "#cdb98f", ent: "#b6c5c4", neu: "#ece6d4", mapInk: "#1c1a17", mapSoft: "#5d574c" },
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
    base: { paper: "#1b1814", paperRaised: "#27231d", ink: "#ece5d2", inkSoft: "#b9b09b", rule: "#cfc6b0", accent: "#e0a79d", good: "#9cc48a", inverse: "#f4efe2", sea: "#202c2e", cp: "#6a5c40", ent: "#38535a", neu: "#363229", mapInk: "#ece5d2", mapSoft: "#b9b09b" },
    campaigns: {
      ohl: { accent: "#e6a39b" }, gqg: { accent: "#93b8d4" }, stavka: { accent: "#dbb57f" }, bef: { accent: "#adc58d" }, aok: { accent: "#dcbd6e" }, otto: { accent: "#c7acea" },
    },
    extra: { tint: "rgba(0,0,0,0)", grain: "none" },
  },
  contrast: {
    base: { paper: "#ffffff", paperRaised: "#f1f1f1", ink: "#000000", inkSoft: "#1f1f1f", rule: "#000000", accent: "#6a0000", good: "#0a4a00", inverse: "#000000", sea: "#e3eef3", cp: "#e6cf91", ent: "#9fc4cb", neu: "#f7f7f7", mapInk: "#000000", mapSoft: "#1f1f1f" },
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
  ["accent", "paper"], ["accent", "paperRaised"], ["good", "paper"], ["paper", "inverse"], ["paperRaised", "inverse"],
  ["mapInk", "cp"], ["mapInk", "ent"], ["mapInk", "neu"], ["mapInk", "sea"], ["mapSoft", "sea"],
];
export const THEME_MIN_RATIO = { sepia: 4.5, paper: 4.5, night: 4.5, contrast: 7 };

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
  for (const theme of ["sepia", "night", "contrast"]) {
    const t = THEME_TOKENS[theme];
    out.push(`[data-theme="${theme}"] .dg-root{${decls(t.base)};${decls(t.extra)}}`);
    for (const [cid, c] of Object.entries(t.campaigns)) {
      out.push(`[data-theme="${theme}"] .dg-root[data-campaign="${cid}"]{${decls({ accent: c.accent, paper: t.base.paper, paperRaised: t.base.paperRaised, tint: t.extra.tint })};--band:${CAMPAIGN_BANDS[cid]}}`);
    }
  }
  // every command's accent is also a variable of its own (in Sepia they are all one soft ink, see sepiaCss), for the places that colour something by command (pins, the record) whatever the screen's root is
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

/** The theme in force: "auto" follows the device (dark gives Night, a wish for more contrast gives High contrast); anything unknown gives the default. */
export function resolveTheme(setting, prefersDark, prefersMore) {
  if (setting === "auto") return prefersMore ? "contrast" : prefersDark ? "night" : "paper";
  return THEME_IDS.includes(setting) ? setting : DEFAULT_THEME;
}

const SEPIA_SERIF = '"EB Garamond","Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif';
const SEPIA_SMALL = [".dg-filerow", ".dg-sect", ".dg-timeline", ".dg-btn", ".dg-docrow", ".dg-order", ".dg-maphead .t", ".dg-cost", ".dg-meters", ".dg-badge", ".dg-seg button", ".dg-count", ".dg-preview", ".dg-record-mark", ".dg-tile span", ".dg-cmd-head .meta", ".dg-seal", ".dg-ribbon .y", ".dg-ending .meta", ".dg-holdhint", ".dg-entry .meta", ".dg-attested-tag", ".dg-hard", ".dg-draft", ".dg-key"];
const SEPIA_COMMANDS = ["ohl", "gqg", "stavka", "bef", "aok", "otto"];

/**
 * The Sepia look, as a stylesheet laid over the tokens: a single dark page, the report as a column of ruled lines, serif type in small capitals for
 * captions, a sepia map, no boxes and no shadows; one lit frame (the order under the pointer or the focus), and the one red, kept for a decision, the odds,
 * a seal and a stamp. It comes last in the sheet so that it wins over the text sizes. Every rule is under [data-theme="sepia"].
 */
export function sepiaCss() {
  const accVars = SEPIA_COMMANDS.map((c) => `--acc-${c}:var(--ink-soft)`).join(";");
  const mapAcc = SEPIA_COMMANDS.map((c) => `--acc-${c}:var(--map-ink)`).join(";");
  const css = `
  /* ---- Sepia: a quiet column ---- */
  [data-theme="sepia"]:not([data-font="plain"]):not([data-font="typewriter"]) .dg-root{--mono:${SEPIA_SERIF}}
  @S .dg-root{${accVars};background-image:none;font-size:19px;line-height:1.5}
  @S .dg-root[data-campaign]::before,@S .dg-root[data-screen="menu"]::before{display:none}
  @S .dg-root button:focus-visible,@S .dg-root summary:focus-visible,@S .dg-root input:focus-visible{outline:3px solid var(--ink);outline-offset:3px}
  ${SEPIA_SMALL.map((s) => "@S " + s).join(",")}{font-size:13.5px;letter-spacing:.14em}
  @S .dg-title{font-weight:500;font-size:56px;text-align:center;letter-spacing:.04em;text-shadow:none;margin:12px 0 10px}
  @S .dg-rule,@S .dg-dash{border:0;border-top:1px solid var(--rule);opacity:1;margin:0 0 18px}
  @S .dg-filerow .r{border:0;transform:none;color:var(--ink-soft);padding:0;font-weight:400}
  @S .dg-sect,@S .dg-order{color:var(--ink-soft);font-weight:400;margin:24px 0 0;padding-bottom:5px;border-bottom:1px solid var(--rule)}
  @S .dg-sect::after,@S .dg-order::after{display:none}
  @S .dg-count{color:var(--ink-soft)}
  @S .dg-note,@S .dg-entry,@S .dg-attested,@S .dg-banner p,@S .dg-meanwhile{font-size:16px}
  @S .dg-note{color:var(--ink-soft)}
  @S .dg-stamp{top:14px;right:8px;transform:none;border:0;box-shadow:none;background:none;color:var(--ink-soft);font-weight:400;font-size:13.5px;letter-spacing:.14em;padding:0}

  /* the menu: a list of commands */
  @S .dg-card{border:0;border-top:1px solid var(--rule);background:none;box-shadow:none;padding:12px 8px;margin:0}
  @S .dg-card::before{display:none}
  @S .dg-card:hover{background:none;color:var(--ink);box-shadow:0 0 26px rgba(236,229,208,.12);outline:2px solid var(--ink);outline-offset:-2px}
  @S .dg-card:hover p{color:var(--ink-soft)}
  @S .dg-card h3{font-weight:400;font-size:25px;margin:0 0 2px}
  @S .dg-card p{font-size:13.5px;letter-spacing:.1em;text-transform:uppercase}
  @S .dg-banner{border:0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);background:none;box-shadow:none;padding:12px 4px}
  @S .dg-banner .small{font-size:15px}
  @S .dg-btn{border:1px solid var(--ink-soft);box-shadow:none;padding:10px 16px}
  @S .dg-seg button{border-color:var(--rule)}
  @S .dg-seg button:hover:not([aria-pressed="true"]){background:rgba(236,229,208,.1)}
  @S .dg-seg button[aria-pressed="true"]{outline:2px solid var(--ink);outline-offset:-3px}
  @S details summary{border:0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);background:none;font-size:13.5px;letter-spacing:.14em}
  @S details summary:hover{background:var(--ink);color:var(--paper)}
  @S .dg-dossier summary:hover{background:none;color:inherit}
  @S .dg-bulletin{border:1px solid var(--rule);background:none;transform:none;box-shadow:none;font-size:16px}
  @S .dg-bulletin::before{display:none}
  @S .dg-bulletin .h{color:var(--ink-soft);font-weight:400;font-size:13.5px;letter-spacing:.14em}
  @S .dg-hard,@S .dg-draft{border:1px solid var(--rule);color:var(--ink);background:none}

  /* the report */
  @S .dg-timeline{background:none;border-bottom:1px solid var(--rule);padding:0 0 8px;margin-bottom:14px}
  @S .dg-timeline span{border:0;padding:2px 6px}
  @S .dg-timeline span.on{transform:none;color:var(--ink);font-weight:400;border:0;border-bottom:2px solid var(--ink);background:none}
  @S .dg-docrow{border-bottom:1px solid var(--rule);font-weight:400;margin:14px 0 14px;padding-bottom:8px}
  @S .dg-node-date{display:block;transform:none;border:0;padding:0;color:var(--ink-soft);font-size:13.5px;letter-spacing:.14em;font-weight:400;background:none;margin:14px 0 0;text-align:center}
  @S .dg-node-title{font-weight:500;font-size:44px;text-align:center;letter-spacing:0;margin:2px 0 14px}
  @S .dg-prose{font-size:19.5px;line-height:1.55}
  @S .dg-lede::first-letter{float:none;font:inherit;padding:0;color:inherit}
  @S .dg-quote{font-size:16px;border-top:0;padding-top:0;margin-top:4px}
  @S .dg-mapcard{box-shadow:none;margin:0 0 14px}
  @S .dg-maphead .t{color:var(--ink-soft);font-weight:400}
  @S .dg-meters{border:0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);background:none;box-shadow:none;padding:10px 0 8px;gap:24px;margin:16px 0}
  @S .dg-meters b{font-weight:500;font-size:28px}
  @S .dg-meters .neg b,@S .dg-meters .pos b{color:var(--ink)}
  @S .dg-gauge{background:rgba(236,229,208,.16);border-color:var(--rule);opacity:1}
  @S .dg-gauge::before{background:var(--ink-soft)}
  @S .dg-gauge i{background:var(--ink);border-color:var(--paper)}
  @S .dg-readings{border-color:var(--rule);background:none;margin:-10px 0 16px;font-size:14.5px}
  @S .dg-reading.lv0 b,@S .dg-reading.lv1 b,@S .dg-reading.lv4 b{color:var(--ink)}
  @S .dg-rbar{border-color:var(--rule);background:none}
  @S .dg-rbar i,@S .dg-reading.lv0 .dg-rbar i,@S .dg-reading.lv1 .dg-rbar i,@S .dg-reading.lv4 .dg-rbar i{background:var(--ink-soft)}

  /* the orders: ruled rows numbered in Roman, framed when pointed at */
  @S .dg-choice{display:grid;grid-template-columns:44px 1fr;border:0;border-bottom:1px solid var(--rule);background:none;box-shadow:none;padding:12px 8px;margin:0}
  @S .dg-choice>*{grid-column:2}
  @S .dg-choice:not(.dg-opt):not(.dg-issue)::before{content:counter(ord,upper-roman);grid-column:1;grid-row:1 / span 9;align-self:start;font-size:21px;letter-spacing:0;color:var(--ink-soft);font-weight:400;margin:0}
  @S .dg-choice.dg-opt,@S .dg-choice.dg-issue{display:block}
  @S .dg-choice:hover:not(:disabled),@S .dg-choice:focus-visible{background:none;color:var(--ink);box-shadow:0 0 26px rgba(236,229,208,.12);outline:2px solid var(--ink);outline-offset:-2px}
  @S .dg-choice:hover:not(:disabled)::before{color:var(--ink)}
  @S .dg-choice .lab{font-size:23px;font-weight:400;font-style:italic;margin-bottom:4px;line-height:1.2}
  @S .dg-choice:hover:not(:disabled) .dg-quote,@S .dg-choice:hover:not(:disabled) .dg-attested,@S .dg-choice:hover:not(:disabled) .dg-holdhint,@S .dg-choice:hover:not(:disabled) .dg-strain,@S .dg-choice:hover:not(:disabled) .dg-record-mark{color:var(--ink-soft)}
  @S .dg-choice:hover:not(:disabled) .dg-record-mark{border-color:var(--rule)}
  @S .dg-choice:hover:not(:disabled) .dg-holdbar{background:var(--accent)}
  @S .dg-record-mark{color:var(--ink-soft);border-color:var(--rule)}
  @S .dg-strain{color:var(--ink);font-size:14.5px}
  @S .dg-odds{font-size:13.5px;letter-spacing:.1em}
  @S .dg-odds-t{color:var(--accent)}
  @S .dg-dial path{stroke:var(--rule)}
  @S .dg-opt[aria-pressed="true"]{background:rgba(236,229,208,.08);color:var(--ink);outline:2px solid var(--ink);outline-offset:-2px;border-left-color:var(--rule)}
  @S .dg-opt[aria-pressed="true"] .dg-quote{color:var(--ink-soft);border-top-color:var(--rule)}
  @S .dg-choice.dg-issue{border:1px solid var(--ink);text-align:center;margin-top:12px}

  /* the map: a sepia sheet with its own ink, the front a ticked black line */
  @S .dg-map{border:1px solid var(--rule);box-shadow:none;--ink:var(--map-ink);--ink-soft:var(--map-soft);--paper:var(--sea);--accent:var(--map-ink);${mapAcc}}
  @S .dg-country{stroke:var(--map-soft)}
  @S .dg-front-glow{stroke:var(--map-ink);stroke-width:11;stroke-dasharray:2 9;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1}
  @S .dg-front{stroke:var(--map-ink);stroke-width:3.5;stroke-dasharray:none;animation:none}
  @S .dg-pulse{fill:var(--map-ink);opacity:.25}
  @S .dg-swatch-front{border-top-color:var(--ink)}
  @S .dg-modal{background:rgba(5,4,3,.82)}
  @S .dg-meanwhile li{border-top-color:var(--rule)}

  /* the outcome: the sealed cable and what the order cost */
  @S .dg-cable{border:1px solid var(--rule);background:none;box-shadow:none}
  @S .dg-envelope{border-color:var(--ink);box-shadow:none}
  @S .dg-changes{font-size:16px}
  @S .dg-changes li{border-top-color:var(--rule)}
  @S .dg-changes li b{font-weight:500}
  @S .dg-changes li.neg b,@S .dg-changes li.pos b{color:var(--ink)}
  @S .dg-rank{border:2px solid var(--ink);background:none;box-shadow:none}
  @S .dg-rank h2{font-weight:500;color:var(--ink)}
  @S .dg-rank ul{font-size:15px}
  @S .dg-rank li{border-top-color:var(--rule)}
  @S .dg-note-box{background:none;border-color:var(--rule)}

  /* the Order of Battle and the war record */
  @S .dg-bt-arm,@S .dg-rec-card,@S .dg-cmd{border:0;border-top:1px solid var(--rule);border-left:0;background:none;box-shadow:none;padding:12px 4px;margin:0}
  @S .dg-bt-n{color:var(--ink);font-weight:500}
  @S .dg-bt-head{font-size:22px;letter-spacing:0}
  @S .dg-bt-head b,@S .dg-bt-head strong{font-weight:400}
  @S .dg-check input{accent-color:var(--ink)}
  @S .dg-bt-units{font-size:16px}
  @S .dg-bt-report{border-top:1px solid var(--rule)}
  @S .dg-tile{border-color:var(--rule);background:none}
  @S .dg-seal{transform:none;border:1px solid var(--rule);box-shadow:none;color:var(--ink-soft);font-weight:400}
  @S .dg-avatar{display:none}
  @S .dg-ribbon .col{border-top-color:var(--rule)}
  @S .dg-ribbon i{border-color:var(--ink-soft)}
  @S .dg-ribbon i.on{background:var(--ink);border-color:var(--ink)}
  @S .dg-ending{border:1px solid var(--rule);box-shadow:none;background:none}
  @S .dg-ending .meta{color:var(--ink-soft);font-weight:400}
  @S .dg-ending.dg-badge-contested{border-style:double;border-width:4px}
  @S .dg-ending.locked{border-style:dashed}
  @S .dg-battle{border-left:2px solid var(--rule)}
  @S .dg-battle-grade b{color:var(--ink)}
  @S .dg-cmd-head .t,@S .dg-entry .t{font-weight:400}

  /* the badge of an ending is the stamp: the red kept for it */
  @S .dg-badge{background:var(--paper);box-shadow:inset 0 0 0 2px var(--paper),inset 0 0 0 3.5px var(--accent)}

  /* the question, the steps of a battle plan, the verdict */
  @S .dg-ask{border-left:2px solid var(--ink);font-size:19.5px}
  @S .dg-ask b{color:var(--ink-soft);font-weight:400;font-size:13.5px;letter-spacing:.14em}
  @S .dg-jump{font-size:13.5px;letter-spacing:.14em;color:var(--ink-soft)}
  @S .dg-step{border:0;border-top:1px solid var(--rule);padding:10px 8px}
  @S .dg-steps li:last-child .dg-step{border-bottom:1px solid var(--rule)}
  @S .dg-steps .now .dg-step{background:none;color:var(--ink);outline:2px solid var(--ink);outline-offset:-2px;box-shadow:0 0 26px rgba(236,229,208,.12)}
  @S .dg-step-n{border-color:var(--ink-soft);font-weight:400}
  @S .dg-step-t b{font-weight:400;font-size:20px}
  @S .dg-step-t small{font-size:15px;color:var(--ink-soft)}
  @S .dg-bt-bar{border-top:1px solid var(--ink);background:var(--paper)}
  @S .dg-bt-k{font-size:13px;letter-spacing:.14em}
  @S .dg-bt-stat b{font-weight:500;font-size:19px}
  @S .dg-bt-stat small{font-size:14px}
  @S .dg-bt-bar .dg-choice.dg-issue{margin:0;padding:10px 18px}
  @S .dg-verdict-h{font-weight:500;font-size:32px}
  @S .dg-kind{border-color:var(--rule);font-size:13.5px;letter-spacing:.14em}
  @S .dg-chips li{border-color:var(--rule);font-size:15px}
  @S .dg-chips li.neg{border-color:var(--rule)}
  @S .dg-chips li b{font-weight:500}
  @S .dg-grade{font-size:15.5px}

  /* text sizes: serif runs smaller than a typewriter at the same size */
  @S .dg-fs-m .dg-prose{font-size:21px}
  @S .dg-fs-l .dg-prose{font-size:23px}
  @S .dg-fs-m .dg-choice .lab{font-size:25px}
  @S .dg-fs-l .dg-choice .lab{font-size:27px}
  @S .dg-fs-m .dg-quote,@S .dg-fs-m .dg-bulletin,@S .dg-fs-m .dg-entry,@S .dg-fs-m .dg-banner p,@S .dg-fs-m .dg-note{font-size:18px}
  @S .dg-fs-l .dg-quote,@S .dg-fs-l .dg-bulletin,@S .dg-fs-l .dg-entry,@S .dg-fs-l .dg-banner p,@S .dg-fs-l .dg-note{font-size:20px}
  @media (max-width:480px){
    @S .dg-title{font-size:40px}
    @S .dg-node-title{font-size:32px}
    @S .dg-choice{grid-template-columns:34px 1fr}
    @S .dg-choice .lab{font-size:21px}
    @S .dg-prose{font-size:18.5px}
  }
  `;
  return css.replace(/@S /g, '[data-theme="sepia"] ');
}
