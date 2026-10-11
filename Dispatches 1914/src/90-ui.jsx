// =============================================================================
// UI_LAYER
// =============================================================================
//
// Everything below is render code. Validators split the file here and never
// evaluate it.
//
// PALETTE IS TOKENISED. Art direction is undecided (spec §13.8); this renders in
// the established series idiom so the game is playable now. Changing direction is
// a change to THEME below, not a rewrite of the components.
// =============================================================================

import React, { useState, useMemo, useEffect, useRef } from "react";

// The values live in the stylesheet as custom properties on .dg-root (each command sets its own paper tint and accent there), so a screen
// takes its command's look without the components knowing it. Changing direction is a change to the stylesheet below.
const THEME = {
  paper: "var(--paper)",
  paperRaised: "var(--paper-raised)",
  ink: "var(--ink)",
  inkSoft: "var(--ink-soft)",
  rule: "var(--rule)",
  accent: "var(--accent)",
  inverse: "var(--inverse)",
  serif: '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
  mono: '"American Typewriter", "Courier Prime", "Courier New", Courier, monospace',
};

/** Props for a screen's root: it takes its command's accent and paper (see the stylesheet's [data-campaign] rules). */
function rootProps(campaignId, screen) {
  const c = campaignId && CAMPAIGNS[campaignId];
  return { className: "dg-root", "data-campaign": campaignId || undefined, "data-screen": screen, style: c ? { "--accent": c.accent } : undefined };
}

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/** IV.1940 — the series' date treatment. */
function romanDate(iso) {
  if (!iso) return "";
  const [y, m] = iso.split("-");
  return `${ROMAN[Number(m)]}.${y}`;
}

const css = `
  /* ---- tokens: one paper, one ink, one accent per command (a command sets its own on the screen's root) ---- */
  .dg-root{
    --paper:#f4efe2;--paper-raised:#e9e2cf;--ink:#1c1a17;--ink-soft:#5d574c;--rule:#1c1a17;--accent:#7a2e2e;--inverse:#0d0c0b;
    --good:#3d5a2f;--sea:#e1e4da;--tint:rgba(0,0,0,0);
    --grain:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .36  0 0 0 0 .3  0 0 0 0 .2  0 0 0 .1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
    --band:linear-gradient(90deg,var(--ink) 0 33.3%,var(--paper) 33.3% 66.6%,var(--accent) 66.6%);
    counter-reset:ord;
  }
  .dg-root[data-campaign="ohl"]{--tint:rgba(70,80,60,.06);--accent:#7a2e2e;--band:linear-gradient(90deg,#1c1a17 0 33.3%,#f4efe2 33.3% 66.6%,#7a2e2e 66.6%)}
  .dg-root[data-campaign="gqg"]{--tint:rgba(40,70,110,.06);--paper:#f1f0e8;--band:linear-gradient(90deg,#2f4858 0 33.3%,#f1f0e8 33.3% 66.6%,#8a2f2f 66.6%)}
  .dg-root[data-campaign="stavka"]{--tint:rgba(150,110,40,.1);--paper:#f3e9cf;--paper-raised:#e8dcbb;--band:linear-gradient(90deg,#1c1a17 0 33.3%,#b08a2e 33.3% 66.6%,#f3e9cf 66.6%)}
  .dg-root[data-campaign="bef"]{--tint:rgba(90,100,60,.08);--paper:#eeeadb;--paper-raised:#dfdbc6;--band:repeating-linear-gradient(90deg,#3d4a2f 0 14px,#eeeadb 14px 20px)}
  .dg-root[data-campaign="aok"]{--tint:rgba(150,120,40,.07);--paper:#f4eedc;--band:linear-gradient(90deg,#1c1a17 0 50%,#c4a02a 50%)}
  .dg-root[data-campaign="otto"]{--tint:rgba(100,70,110,.06);--paper:#f3ecde;--band:repeating-linear-gradient(90deg,#5a4a6b 0 4px,#f3ecde 4px 9px)}

  /* ---- the sheet ---- */
  .dg-root{background-color:var(--paper);
    background-image:var(--grain),linear-gradient(var(--tint),var(--tint)),radial-gradient(ellipse at 50% -10%,rgba(255,255,255,.5),rgba(255,255,255,0) 55%);
    color:var(--ink);font-family:${THEME.mono};min-height:100%;padding:26px 20px 56px;box-sizing:border-box;line-height:1.62;
    position:relative;-webkit-font-smoothing:antialiased}
  .dg-root[data-campaign]::before,.dg-root[data-screen="menu"]::before{content:"";display:block;height:7px;margin:-26px -20px 18px;background:var(--band);
    border-bottom:1.5px solid var(--rule);box-shadow:0 1px 0 rgba(255,255,255,.5)}
  .dg-root button:focus-visible,.dg-root summary:focus-visible,.dg-root input:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
  .dg-filerow{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.24em;color:var(--ink-soft);text-transform:uppercase}
  .dg-filerow .r{color:var(--accent);border:1.5px solid var(--accent);padding:1px 8px;transform:rotate(1.5deg);font-weight:700}
  .dg-title{font-family:${THEME.serif};font-weight:700;font-size:48px;line-height:1;margin:16px 0 18px;letter-spacing:-.015em;
    text-shadow:0 1px 0 rgba(255,255,255,.65),0 -1px 0 rgba(0,0,0,.08)}
  .dg-rule{border:0;border-top:3px double var(--rule);margin:0 0 22px}
  .dg-sect{font-size:11px;letter-spacing:.26em;color:var(--accent);text-transform:uppercase;margin:28px 0 14px;font-weight:700;
    display:flex;align-items:center;gap:12px}
  .dg-sect::after{content:"";flex:1;border-top:1px solid var(--accent);opacity:.55}

  /* ---- menu: a dossier folder for each command ---- */
  .dg-card{position:relative;border:1.5px solid var(--rule);background:var(--paper-raised);
    background-image:linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,0) 40%);
    padding:20px 18px 18px;margin:0 0 18px;cursor:pointer;width:100%;text-align:left;font:inherit;color:inherit;display:block;box-sizing:border-box;
    box-shadow:2px 3px 0 rgba(28,26,23,.14)}
  .dg-card::before{content:"";position:absolute;left:14px;top:-9px;width:84px;height:9px;background:var(--paper-raised);
    border:1.5px solid var(--rule);border-bottom:0;border-radius:3px 3px 0 0}
  .dg-card:hover{background:var(--ink);color:var(--paper);box-shadow:2px 3px 0 var(--accent)}
  .dg-card:hover::before{background:var(--ink)}
  .dg-card h3{font-family:${THEME.serif};font-size:24px;font-weight:700;margin:0 0 6px;line-height:1.15}
  .dg-card p{margin:0;font-size:13px;color:var(--ink-soft)}
  .dg-card:hover p{color:var(--paper-raised)}
  .dg-card[disabled]{box-shadow:none}
  .dg-stamp{position:absolute;top:-13px;right:14px;transform:rotate(-3deg);border:2px solid var(--accent);color:var(--accent);background:var(--paper);
    font-size:11px;font-weight:700;letter-spacing:.2em;padding:4px 10px;box-shadow:inset 0 0 0 2px var(--paper),inset 0 0 0 3px var(--accent)}
  .dg-dash{border:0;border-top:3px dashed var(--accent);opacity:.7;margin:30px 0 22px}
  .dg-btn{border:1.5px solid var(--rule);background:none;font:inherit;color:inherit;padding:8px 13px;font-size:11px;letter-spacing:.16em;cursor:pointer;
    text-transform:uppercase;box-shadow:1px 2px 0 rgba(28,26,23,.2)}
  .dg-btn:hover:not(:disabled){background:var(--ink);color:var(--paper)}
  .dg-btn:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}

  /* ---- the order sheet ---- */
  .dg-docrow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:13px;letter-spacing:.26em;font-weight:700;margin:20px 0 16px;
    padding-bottom:10px;border-bottom:3px double var(--rule);text-transform:uppercase}
  .dg-docrow .dg-btn{margin-left:auto}
  .dg-timeline{display:flex;justify-content:space-between;align-items:center;padding:8px 0 0;font-size:11px;letter-spacing:.12em;margin-bottom:20px;
    background:linear-gradient(var(--rule),var(--rule)) 0 0/100% 1.5px no-repeat}
  .dg-timeline span{padding:2px 8px;border:1.5px solid transparent}
  .dg-timeline span.on{color:var(--accent);font-weight:700;border-color:var(--accent);transform:rotate(-1.5deg);background:var(--paper)}
  .dg-node-date{display:inline-block;font-size:13px;letter-spacing:.24em;margin:0 0 10px;padding:2px 12px;border:2px solid var(--accent);color:var(--accent);
    font-weight:700;transform:rotate(-1.2deg);background:var(--paper)}
  .dg-node-title{font-family:${THEME.serif};font-size:36px;font-weight:700;line-height:1.06;margin:0 0 18px;letter-spacing:-.01em}
  .dg-prose{white-space:pre-wrap;font-size:15.5px;margin-bottom:18px}
  .dg-node-title + .dg-prose::first-letter{float:left;font-family:${THEME.serif};font-size:3.3em;line-height:.82;font-weight:700;padding:.07em .1em 0 0;color:var(--accent)}
  .dg-order{font-size:12px;letter-spacing:.26em;font-weight:700;margin:26px 0 14px;text-transform:uppercase;display:flex;gap:12px;align-items:center;color:var(--accent)}
  .dg-order::after{content:"";flex:1;border-top:1px solid var(--accent);opacity:.55}
  .dg-choice{position:relative;width:100%;text-align:left;font:inherit;color:inherit;cursor:pointer;border:1.5px solid var(--rule);
    border-left:8px solid var(--accent);background:rgba(255,255,255,.28);padding:16px 16px 14px;margin-bottom:14px;display:block;
    box-shadow:2px 3px 0 rgba(28,26,23,.13)}
  .dg-choice:not(.dg-opt):not(.dg-issue)::before{counter-increment:ord;content:"ORDER " counter(ord);display:block;font-size:10px;letter-spacing:.24em;
    color:var(--accent);font-weight:700;margin-bottom:6px}
  .dg-choice:hover:not(:disabled){background:var(--inverse);color:var(--paper);box-shadow:2px 3px 0 var(--accent)}
  .dg-choice:hover:not(:disabled)::before{color:var(--paper-raised)}
  .dg-choice:disabled{cursor:not-allowed;opacity:.5;box-shadow:none}
  .dg-choice .lab{font-size:15.5px;margin-bottom:8px;font-weight:700}
  .dg-quote{font-style:italic;font-size:13px;color:var(--ink-soft);border-top:1px dotted var(--ink-soft);padding-top:8px;margin-top:6px}
  .dg-root summary{list-style:none}
  .dg-root summary::-webkit-details-marker{display:none}
  .dg-map{display:block;width:100%;height:auto;border:1.5px solid var(--rule);background:var(--sea);margin:10px 0 18px;
    box-shadow:inset 0 0 0 4px var(--paper),inset 0 0 0 5.5px var(--rule),2px 3px 0 rgba(28,26,23,.13)}
  .dg-attested{font-size:13px;margin-top:8px;color:var(--ink-soft)}
  .dg-attested cite{font-style:normal;font-size:12px}
  .dg-attested-tag{display:inline-block;border:1px solid currentColor;font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:1px 5px}
  .dg-choice:hover:not(:disabled) .dg-quote,.dg-choice:hover:not(:disabled) .dg-attested{color:var(--paper-raised)}
  .dg-cost{display:inline-block;border:1px solid currentColor;font-size:10px;letter-spacing:.14em;padding:3px 7px;margin-bottom:8px}

  /* ---- the ledger of meters ---- */
  .dg-meters{display:flex;gap:16px;border:1.5px solid var(--rule);padding:12px 14px 10px;margin-bottom:20px;font-size:10.5px;letter-spacing:.12em;
    background:rgba(255,255,255,.3);box-shadow:inset 0 0 0 3px var(--paper),inset 0 0 0 4px var(--rule)}
  .dg-meters>div{flex:1}
  .dg-meters b{display:block;font-size:22px;font-family:${THEME.serif};line-height:1.2}
  .dg-meters .neg b{color:var(--accent)}
  .dg-meters .pos b{color:var(--good)}
  .dg-gauge{display:block;position:relative;height:7px;margin:3px 0 6px;border:1px solid var(--ink-soft);
    background:linear-gradient(90deg,var(--accent) 0,var(--accent) 50%,var(--good) 50%,var(--good) 100%);opacity:.9}
  .dg-gauge::before{content:"";position:absolute;left:50%;top:-3px;bottom:-3px;width:1px;background:var(--ink)}
  .dg-gauge i{position:absolute;top:-4px;width:7px;height:13px;margin-left:-3.5px;background:var(--paper);border:1.5px solid var(--ink);box-sizing:border-box}
  .dg-hard{border:1.5px solid var(--accent);color:var(--accent);padding:12px;font-size:12px;letter-spacing:.16em;margin-bottom:18px;font-weight:700;
    background:repeating-linear-gradient(135deg,rgba(122,46,46,.07) 0 8px,rgba(122,46,46,0) 8px 16px)}
  .dg-draft{border:1.5px dashed var(--accent);color:var(--accent);padding:10px;font-size:11px;letter-spacing:.12em;margin-bottom:18px}
  .dg-badge{display:inline-block;border:3px solid var(--accent);color:var(--accent);text-transform:uppercase;font-size:11px;font-weight:700;letter-spacing:.22em;
    padding:7px 14px;margin-bottom:16px;transform:rotate(-1.5deg);box-shadow:inset 0 0 0 2px var(--paper),inset 0 0 0 3.5px var(--accent);background:var(--paper)}
  .dg-badge-contested{border-style:double;border-width:5px;box-shadow:none}
  .dg-badge-speculative{border-style:dashed}
  .dg-root h1:focus{outline:none}
  .dg-note-box{border:1.5px solid var(--rule);padding:12px;margin:14px 0;background:rgba(255,255,255,.25)}
  .dg-note-box textarea{width:100%;box-sizing:border-box;font:inherit;font-size:12px;min-height:110px;background:var(--paper-raised);color:var(--ink);border:1px solid var(--rule)}
  .dg-note-box a{color:var(--accent)}

  /* ---- the bulletin: a wire slip pasted to the sheet ---- */
  .dg-bulletin{position:relative;border:1.5px dashed var(--ink-soft);background:var(--paper-raised);
    background-image:repeating-linear-gradient(180deg,rgba(28,26,23,0) 0 21px,rgba(28,26,23,.06) 21px 22px);
    padding:14px 14px 12px;margin:0 0 20px;font-size:13px;transform:rotate(-.35deg);box-shadow:1px 2px 0 rgba(28,26,23,.12)}
  .dg-bulletin::before{content:"";position:absolute;left:50%;top:-8px;width:56px;height:14px;margin-left:-28px;background:rgba(190,170,110,.55);transform:rotate(1.5deg)}
  .dg-bulletin .h{font-size:10px;letter-spacing:.22em;color:var(--accent);margin-bottom:6px;font-weight:700;text-transform:uppercase}
  details summary{cursor:pointer;border:1.5px solid var(--rule);padding:10px 12px;font-size:12px;letter-spacing:.16em;margin-bottom:16px;background:rgba(255,255,255,.22)}
  details summary:hover{background:var(--ink);color:var(--paper)}
  .dg-banner{border:1.5px solid var(--accent);padding:14px;margin:0 0 20px;background:rgba(255,255,255,.3);box-shadow:inset 0 0 0 3px var(--paper),inset 0 0 0 4px var(--accent)}
  .dg-banner p{margin:0 0 10px;font-size:13px}
  .dg-banner .small{font-size:12px;color:var(--ink-soft)}
  .dg-seg{display:flex;margin:0 0 10px}
  .dg-seg button{flex:1;border:1.5px solid var(--rule);background:none;font:inherit;color:inherit;padding:11px 8px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer}
  .dg-seg button+button{border-left:0}
  .dg-seg button:hover{background:var(--paper-raised)}
  .dg-seg button[aria-pressed="true"]{background:var(--ink);color:var(--paper)}
  .dg-note{font-size:12px;color:var(--ink-soft);margin:0 0 14px}
  .dg-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 18px}
  .dg-tabs button[aria-pressed="true"]{background:var(--ink);color:var(--paper)}
  .dg-entry{border-top:1px solid var(--rule);padding:10px 0;font-size:13px}
  .dg-entry .t{font-family:${THEME.serif};font-size:17px;font-weight:700}
  .dg-entry.locked{color:var(--ink-soft)}
  .dg-entry .meta{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-soft)}
  .dg-count{font-size:11px;letter-spacing:.16em;color:var(--ink-soft);margin:0 0 6px;text-transform:uppercase}
  .dg-term{background:none;border:0;border-bottom:1px dotted currentColor;font:inherit;color:inherit;cursor:pointer;padding:0;margin:0}
  .dg-defn{display:block;border-left:3px solid var(--accent);padding:4px 0 4px 10px;margin:8px 0 14px;font-size:13px;color:var(--ink-soft)}
  .dg-preview{display:inline-block;border:1px solid currentColor;font-size:11px;letter-spacing:.08em;padding:3px 7px;margin:0 6px 8px 0}
  .dg-record-mark{display:inline-block;border:1px solid var(--accent);color:var(--accent);font-size:10px;letter-spacing:.14em;text-transform:uppercase;padding:2px 6px;margin:0 6px 8px 0}
  .dg-choice:hover:not(:disabled) .dg-record-mark{color:var(--paper-raised);border-color:var(--paper-raised)}
  .dg-strain{display:block;font-size:12px;color:var(--accent);margin:0 0 8px;font-weight:700}
  .dg-choice:hover:not(:disabled) .dg-strain{color:var(--paper-raised)}

  /* ---- the report on your command ---- */
  .dg-rank{border:1.5px solid var(--rule);padding:16px 16px 12px;margin:22px 0;background:rgba(255,255,255,.3);box-shadow:inset 0 0 0 3px var(--paper),inset 0 0 0 4px var(--rule),2px 3px 0 rgba(28,26,23,.13)}
  .dg-rank h2{font-family:${THEME.serif};font-size:30px;margin:0 0 4px;color:var(--accent)}
  .dg-rank ul{list-style:none;margin:12px 0 0;padding:0;font-size:12px}
  .dg-rank li{display:flex;justify-content:space-between;gap:10px;border-top:1px dotted var(--ink-soft);padding:7px 0}
  .dg-rank li span.n{color:var(--ink-soft)}

  /* ---- the Order of Battle ---- */
  .dg-bt-arm{border:1.5px solid var(--rule);padding:12px 14px;margin:0 0 14px;background:rgba(255,255,255,.28);box-shadow:2px 3px 0 rgba(28,26,23,.12)}
  .dg-bt-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:6px;font-size:14px}
  .dg-bt-ctl{display:flex;align-items:center;gap:8px}
  .dg-bt-n{min-width:2ch;text-align:center;font-family:${THEME.serif};font-size:24px;font-weight:700;color:var(--accent)}
  .dg-bt-units{margin:0 0 12px;padding-left:20px;font-size:13px}
  .dg-bt-pick .dg-choice{margin-bottom:10px}
  .dg-opt[aria-pressed="true"]{background:var(--ink);color:var(--paper);border-left-color:var(--paper-raised)}
  .dg-opt[aria-pressed="true"] .dg-quote{color:var(--paper-raised);border-top-color:var(--paper-raised)}
  .dg-bt-report{border-top:3px double var(--rule);margin-top:22px;padding-top:8px}
  .dg-check{display:flex;gap:10px;align-items:flex-start;font-size:13px;margin:0 0 10px;cursor:pointer}
  .dg-check input{margin-top:4px;width:18px;height:18px;accent-color:var(--accent)}

  /* ---- text sizes ---- */
  .dg-fs-m .dg-prose,.dg-fs-m .dg-choice .lab{font-size:17px}
  .dg-fs-m .dg-bulletin,.dg-fs-m .dg-quote,.dg-fs-m .dg-entry,.dg-fs-m .dg-banner p{font-size:15px}
  .dg-fs-l .dg-prose,.dg-fs-l .dg-choice .lab{font-size:19px}
  .dg-fs-l .dg-bulletin,.dg-fs-l .dg-quote,.dg-fs-l .dg-entry,.dg-fs-l .dg-banner p{font-size:17px}
  @media (max-width:420px){.dg-title{font-size:40px}.dg-node-title{font-size:30px}.dg-meters{gap:10px}.dg-meters b{font-size:19px}}

  /* ---- a stamp comes down on an ending, and an order is signed ---- */
  @media (prefers-reduced-motion:no-preference){
    @keyframes dg-thump{0%{transform:scale(1.7) rotate(-7deg);opacity:0}55%{opacity:1}100%{transform:scale(1) rotate(-1.5deg);opacity:1}}
    @keyframes dg-rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    .dg-badge{animation:dg-thump .55s cubic-bezier(.2,.8,.2,1) both}
    .dg-prose,.dg-choice,.dg-bulletin{animation:dg-rise .35s ease-out both}
    .dg-choice:nth-of-type(2){animation-delay:.06s}
    .dg-choice:nth-of-type(3){animation-delay:.12s}
  }
  @media print{.dg-root{background:#fff!important}.dg-btn,.dg-choice{box-shadow:none}}
`;

function Stamp({ children }) {
  return <span className="dg-stamp">{children}</span>;
}

const TEXT_SIZE_LABELS = { s: "Standard", m: "Larger", l: "Largest" };
const FEEDBACK_URL = "https://dispatches.itch.io/dispatches-1914#comments";

/** A short typewriter tick or a stamp thud, made with the browser's own audio. Off unless the player turned it on. */
let audioCtx = null;
function playSound(kind) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = audioCtx || new AC();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    const stamp = kind === "stamp";
    o.type = stamp ? "sine" : "square";
    o.frequency.setValueAtTime(stamp ? 80 : 1900, t);
    g.gain.setValueAtTime(stamp ? 0.3 : 0.05, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (stamp ? 0.25 : 0.035));
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(t);
    o.stop(t + (stamp ? 0.3 : 0.05));
  } catch (e) { /* no audio: carry on silently */ }
}

/** The note a player can paste into a bug report or a playtest comment: the whole path, from the flags. */
function runNote(campaignId, nodeId, flags, mode, visited) {
  const c = CAMPAIGNS[campaignId];
  const marks = Object.keys(flags).sort().map((k) => k + "=" + flags[k]).join(" ");
  return ["Dispatches 1914", c.shortName, mode === "hard" ? "hard mode" : mode === "easy" ? "easy mode" : "standard", "ending " + nodeId,
    "decisions " + (visited.length - 1), "marks: " + marks].join(" | ");
}

// ---------- the glossary: the first mention of a term on a screen is underlined ----------

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const GLOSS_RES = GLOSSARY.map((g) => ({
  g,
  re: new RegExp(`(^|[^\\p{L}\\p{N}_-])(${g.match || escapeRe(g.term)})(?![\\p{L}\\p{N}_-])`, g.ci ? "iu" : "u"),
}));

/** Splits each text into { t, g? } segments, giving the first mention of each glossary term across all the texts, in order, its entry. Pure. */
function markFirstMentions(texts) {
  const used = new Set();
  return texts.map((text) => {
    if (typeof text !== "string" || !text) return [];
    const hits = [];
    for (const { g, re } of GLOSS_RES) {
      if (used.has(g.id)) continue;
      const m = re.exec(text);
      if (m) hits.push({ g, start: m.index + m[1].length, end: m.index + m[1].length + m[2].length });
    }
    hits.sort((a, b) => a.start - b.start);
    const segs = [];
    let pos = 0;
    for (const h of hits) {
      if (h.start < pos) continue; // inside a term already taken
      used.add(h.g.id);
      if (h.start > pos) segs.push({ t: text.slice(pos, h.start) });
      segs.push({ t: text.slice(h.start, h.end), g: h.g });
      pos = h.end;
    }
    if (pos < text.length) segs.push({ t: text.slice(pos) });
    return segs;
  });
}

/** A paragraph of story text whose glossary terms can be pressed for their definition. */
function GlossText({ segs, className = "dg-prose" }) {
  const [open, setOpen] = useState(null);
  const def = open ? GLOSSARY.find((g) => g.id === open) : null;
  return (
    <div className={className}>
      {segs.map((s, i) =>
        s.g ? (
          <button type="button" key={i} className="dg-term" aria-expanded={open === s.g.id} onClick={() => setOpen(open === s.g.id ? null : s.g.id)}>{s.t}</button>
        ) : (
          <React.Fragment key={i}>{s.t}</React.Fragment>
        )
      )}
      {def && <span className="dg-defn" role="note"><b>{def.term}.</b> {def.def}</span>}
    </div>
  );
}

function MenuScreen({ onPick, onRecord, savedRun, onResume, onDiscard, mode, onMode, settings, onSettings, record }) {
  const hardOn = mode === "hard";
  const easyOn = mode === "easy";
  const majors = CAMPAIGN_IDS.filter((c) => CAMPAIGNS[c].tier === TIERS.MAJOR);
  const minors = CAMPAIGN_IDS.filter((c) => CAMPAIGNS[c].tier === TIERS.MINOR);
  const saved = useMemo(() => {
    if (!savedRun) return null;
    try {
      return resolveNode(savedRun.nodeId, savedRun.flags, savedRun.meters, savedRun.hardState);
    } catch (e) {
      return null;
    }
  }, [savedRun]);
  const card = (cid) => {
    const c = CAMPAIGNS[cid];
    const playable = Object.keys(c.nodes).length > 0;
    return (
      <button key={cid} className="dg-card" disabled={!playable}
        style={playable ? undefined : { opacity: 0.45, cursor: "not-allowed" }}
        onClick={() => playable && onPick(cid)}>
        <Stamp>{c.seal}</Stamp>
        <h3>{c.name}</h3>
        <p>{c.seat} · {CALENDARS[c.calendar].label}</p>
        <p style={{ marginTop: 6 }}>
          {playable ? `${Object.keys(c.nodes).length} nodes` : "No content yet"}
        </p>
        {playable && hardOn && c.hardMode.description && (
          <p style={{ marginTop: 6 }}>Hard mode: {c.hardMode.description}</p>
        )}
        {playable && easyOn && EASY_NAMES[cid] && (
          <p style={{ marginTop: 6 }}>Easy: {EASY_NAMES[cid]} Command</p>
        )}
      </button>
    );
  };
  return (
    <main {...rootProps(null, "menu")}>
      <div className="dg-filerow"><span>File No. 1914</span><span className="r">Restricted</span></div>
      <h1 className="dg-title">DISPATCHES<br />1914</h1>
      <hr className="dg-rule" />

      {saved && (
        <section className="dg-banner" aria-label="Saved file">
          <p>
            <b>File in progress.</b> {CAMPAIGNS[savedRun.campaignId].shortName} · {romanDate(saved.date)} · {saved.title}
            {savedRun.hardState.enabled ? " · hard mode" : savedRun.easy ? " · easy mode" : ""}
          </p>
          <p className="small">Starting a new file replaces this one.</p>
          <button className="dg-btn" onClick={onResume}>Resume file</button>{" "}
          <button className="dg-btn" onClick={onDiscard}>Discard</button>
        </section>
      )}

      <div className="dg-seg" role="group" aria-label="Difficulty">
        <button aria-pressed={easyOn} onClick={() => onMode("easy")}>Easy mode</button>
        <button aria-pressed={mode === "standard"} onClick={() => onMode("standard")}>Standard</button>
        <button aria-pressed={hardOn} onClick={() => onMode("hard")}>Hard mode</button>
      </div>
      <p className="dg-note">
        {hardOn
          ? "Hard mode adds an erosion track. Each command's office faced its own kind of pressure; at the limit its freedom to choose ends and a fixed ending follows."
          : easyOn
          ? "Easy mode shows what each order will do to the three meters, marks the order the command really gave, and lets you take back the last order. It cannot reach the highest rank."
          : "Standard: every command plays on the same logistical triangle, with no erosion track."}
      </p>
      <label className="dg-check">
        <input type="checkbox" checked={settings.battles !== false} onChange={(e) => onSettings({ ...settings, battles: e.target.checked })} />
        <span>Take control of battle planning. {settings.battles !== false
          ? "The battles that have an Order of Battle (" + Object.keys(BATTLES).length + ") open on a planning screen: you place the effort, name a commander and choose the approach."
          : "Switched off, those battles are rolled as ordinary orders, at the same odds as the staff's plan."}</span>
      </label>

      <h2 className="dg-sect">Major Commands</h2>
      {majors.map(card)}
      <h2 className="dg-sect">Minor Commands</h2>
      {minors.map(card)}
      <hr className="dg-dash" />
      <button className="dg-card" onClick={onRecord}>
        ▶ WAR RECORD — DOSSIERS, ATLAS, ENDINGS GALLERY
        <p style={{ marginTop: 8 }}>
          {Object.values(record.nodes).reduce((n, l) => n + l.length, 0)} of {nodeTotal()} nodes seen · {record.endings.length} of {buildEndings().length} endings found
        </p>
      </button>
      <details>
        <summary>▶ SETTINGS</summary>
        <div className="dg-count">Text size</div>
        <div className="dg-seg" role="group" aria-label="Text size">
          {TEXT_SIZES.map((s) => (
            <button key={s} aria-pressed={settings.textSize === s} onClick={() => onSettings({ ...settings, textSize: s })}>
              {TEXT_SIZE_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="dg-count">Sound</div>
        <div className="dg-seg" role="group" aria-label="Sound">
          {[[false, "Off"], [true, "Typewriter"]].map(([v, label]) => (
            <button key={label} aria-pressed={settings.sound === v} onClick={() => onSettings({ ...settings, sound: v })}>{label}</button>
          ))}
        </div>
      </details>
      <details>
        <summary>▶ WHAT THIS GAME LEAVES OUT</summary>
        {LEAVES_OUT.map((p, i) => (
          <p key={i} className="dg-note">{p}</p>
        ))}
      </details>
      <details>
        <summary>▶ FEEDBACK</summary>
        <p className="dg-note">
          Found a mistake in the history, or want to say what the game was like to play? Say so on the{" "}
          <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer" style={{ color: THEME.accent }}>game's page</a>.
          When a file closes, a note with the path you took is ready to paste.
        </p>
      </details>
    </main>
  );
}

function Meters({ meters, labels }) {
  return (
    <div className="dg-meters">
      {METER_AXES.map((a) => (
        <div key={a} className={meters[a] < 0 ? "neg" : meters[a] > 0 ? "pos" : ""}>
          <b>{meters[a] > 0 ? `+${meters[a]}` : meters[a]}</b>
          <span className="dg-gauge" aria-hidden="true"><i style={{ left: `${(meters[a] + 10) * 5}%` }} /></span>
          {labels[a].toUpperCase()}
        </div>
      ))}
    </div>
  );
}

/** Where the headquarters sits, on the campaign's own stretch of Europe, with the route taken so far. */
function FrontMap({ campaignId, node, visited }) {
  const camp = CAMPAIGNS[campaignId];
  const { view, cities: CITY_XY, land } = mapFor(campaignId);
  const cities = [...new Set(Object.values(camp.nodes).map((n) => n.city))].filter((c) => CITY_XY[c]);
  if (!cities.length || !CITY_XY[node.city]) return null;
  const trail = visited.map((id) => camp.nodes[id] && camp.nodes[id].city).filter((c, i, a) => CITY_XY[c] && c !== a[i - 1]);
  // Frame the last few headquarters, not the whole campaign, so the western front is readable.
  const focus = [...new Set([...trail.slice(-6), node.city])];
  const xs = focus.map((c) => CITY_XY[c][0]);
  const ys = focus.map((c) => CITY_XY[c][1]);
  const pad = 26;
  let x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad;
  let w = Math.max(...xs) + pad - x0, h = Math.max(...ys) + pad - y0;
  const aspect = view.width / view.height;
  const minW = 150;
  if (w < minW) { x0 -= (minW - w) / 2; w = minW; }
  if (w / h < aspect) { const nw = h * aspect; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / aspect; y0 -= (nh - h) / 2; h = nh; }
  const s = w / view.width;
  // Only the places the file has been to: later headquarters are not given away.
  const shown = [...new Set([...trail, node.city])];
  const [hx, hy] = CITY_XY[node.city];
  return (
    <svg className="dg-map" viewBox={`${x0} ${y0} ${w} ${h}`} role="img" aria-label={`Map of the front. The headquarters is at ${node.city}.`}>
      <path d={land} fill={THEME.paperRaised} stroke={THEME.inkSoft} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
      {trail.length > 1 && (
        <polyline points={trail.map((c) => CITY_XY[c].join(",")).join(" ")} fill="none" stroke={THEME.accent}
          strokeWidth="1.4" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
      )}
      {shown.map((c) => (
        <circle key={c} cx={CITY_XY[c][0]} cy={CITY_XY[c][1]} r={3.4 * s}
          fill={trail.includes(c) ? THEME.accent : THEME.inkSoft} opacity={trail.includes(c) ? 1 : 0.55} />
      ))}
      {shown.filter((c) => c !== node.city && CITY_XY[c][0] > x0 && CITY_XY[c][0] < x0 + w && CITY_XY[c][1] > y0 && CITY_XY[c][1] < y0 + h).map((c) => (
        <text key={"l" + c} x={CITY_XY[c][0] + 5 * s} y={CITY_XY[c][1] + 4 * s} fontSize={11 * s} fill={THEME.inkSoft} stroke={THEME.paperRaised}
          strokeWidth={3 * s} paintOrder="stroke" fontFamily={THEME.mono}>{c}</text>
      ))}
      <circle cx={hx} cy={hy} r={7 * s} fill="none" stroke={THEME.ink} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <text x={hx + 10 * s} y={hy - 8 * s} fontSize={17 * s} fill={THEME.ink} stroke={THEME.paper} strokeWidth={4 * s}
        paintOrder="stroke" fontFamily={THEME.mono}>{node.city}</text>
    </svg>
  );
}

/** "Manpower -2 · Will +1" or, for a contested order, "Manpower -3 to +1". */
function previewText(choice, labels) {
  const p = previewImpact(choice);
  const fmt = (n) => (n > 0 ? "+" + n : String(n));
  const parts = METER_AXES.filter((a) => p[a]).map((a) => `${labels[a]} ${p[a][0] === p[a][1] ? fmt(p[a][0]) : `${fmt(p[a][0])} to ${fmt(p[a][1])}`}`);
  return parts.length ? parts.join(" · ") : "No change to the meters";
}

function RankPanel({ result }) {
  return (
    <section className="dg-rank" aria-label="Your command">
      <div className="dg-count">Your command</div>
      <h2>{result.rank}</h2>
      <div className="dg-note" style={{ margin: 0 }}>{result.score} out of 100</div>
      <ul>
        {result.parts.map((p) => (
          <li key={p.id}>
            <span>{p.label}: <span className="n">{p.note}</span></span>
            <b>{p.points}/{p.max}</b>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NodeScreen({ campaignId, node, meters, hardState, visited, flags, nodeId, easy, canRewind, rank, mode, onRewind, onChoose, onHome }) {
  const c = CAMPAIGNS[campaignId];
  const years = [1914, 1915, 1916, 1917, 1918];
  const [situationSegs, contextSegs, epilogueSegs] = useMemo(() => markFirstMentions([node.situation, node.context, node.epilogue]), [node]);
  return (
    <main {...rootProps(campaignId, "node")}>
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <div className="dg-docrow">
        <span>{c.docLabel}</span>
        <button className="dg-btn" onClick={onHome}>Home</button>
      </div>
      <div className="dg-timeline">
        {years.map((y) => (
          <span key={y} className={y === node.year ? "on" : ""}>{y}</span>
        ))}
      </div>

      {node.draft && (
        <div className="dg-draft">
          DRAFT CONTENT — PROSE NOT VERIFIED. NOT FOR SHIP.
        </div>
      )}

      {hardState.enabled && (
        <div className="dg-hard">
          HARD MODE — EROSION {hardState.erosion}/{erosionMax(campaignId)}
        </div>
      )}

      <Meters meters={meters} labels={node.meterLabels} />

      {node.bulletin && typeof node.bulletin === "object" && (
        <div className="dg-bulletin">
          <div className="h">{node.bulletin.source} · {node.bulletin.date}</div>
          {node.bulletin.text}
        </div>
      )}

      <div className="dg-node-date">{romanDate(node.date)}</div>
      <h1 className="dg-node-title">{node.title}</h1>
      <GlossText key={nodeId + "-situation"} segs={situationSegs} />

      {node.context && (
        <details>
          <summary>▶ SHOW BACKGROUND</summary>
          <GlossText key={nodeId + "-context"} segs={contextSegs} />
        </details>
      )}
      {node.city && mapFor(campaignId).cities[node.city] && (
        <details>
          <summary>▶ SHOW THE MAP</summary>
          <FrontMap campaignId={campaignId} node={node} visited={visited || []} />
        </details>
      )}

      {node.ending ? (
        <>
          <div className={`dg-badge dg-badge-${node.ending.badge}`}>{BADGE_LABELS[node.ending.badge]}</div>
          {node.epilogue && <GlossText key={nodeId + "-epilogue"} segs={epilogueSegs} />}
          {rank && <RankPanel result={rank} />}
          <details>
            <summary>▶ A NOTE FOR THE AUTHOR</summary>
            <div className="dg-note-box">
              <p className="dg-note" style={{ marginTop: 0 }}>
                A line that records the path you took. Paste it into a comment on the{" "}
                <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer">game's page</a> with whatever you want to say.
              </p>
              <textarea readOnly aria-label="Note with the path taken" value={runNote(campaignId, nodeId || "", flags || {}, mode, visited || [])}
                onFocus={(e) => e.target.select()} />
            </div>
          </details>
          <button className="dg-btn" onClick={onHome}>Return to file</button>
        </>
      ) : (
        <>
          <h2 className="dg-order">Issue Order</h2>
          {easy && canRewind && (
            <p><button className="dg-btn" onClick={onRewind}>Take back the last order</button></p>
          )}
          {node.choices.map((ch) => {
            const strain = strainedUncertain(ch, meters);
            return (
            <button key={ch.id} className="dg-choice" disabled={ch.blocked}
              onClick={() => onChoose(ch)}>
              <div className="lab">{ch.label}</div>
              {ch.blocked && <div className="dg-cost">✕ {ch.disabledReason}</div>}
              {easy && ch.historical && <span className="dg-record-mark">✓ The order the command gave</span>}
              {easy && !ch.blocked && <span className="dg-preview">{previewText(ch, node.meterLabels)}</span>}
              {strain.points > 0 && (
                <span className="dg-strain">Strain: {node.meterLabels[strain.meter]} is short, so the odds are {strain.points} points worse</span>
              )}
              {ch.erodes && hardState.enabled && <div className="dg-cost">✕ Costs standing</div>}
              {ch.advisor && (
                <div className="dg-quote">
                  {ch.advisor.name} argues: {ch.advisor.position}
                </div>
              )}
              {ch.attested && (
                <div className="dg-attested">
                  <span className="dg-attested-tag">On the record</span>{" "}
                  {ch.attested.by}: “{ch.attested.text}” <cite>— {ch.attested.source}</cite>
                </div>
              )}
            </button>
            );
          })}
        </>
      )}
    </main>
  );
}

function OutcomeScreen({ campaignId, outcome, record, battle, onContinue }) {
  const c = CAMPAIGNS[campaignId];
  const [outcomeSegs, recordSegs] = useMemo(() => markFirstMentions([outcome, record && record.text]), [outcome, record]);
  return (
    <main {...rootProps(campaignId, "outcome")}>
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <h1 className="dg-docrow" style={{ margin: "18px 0 16px" }}><span>{c.docLabel} · OUTCOME</span></h1>
      <hr className="dg-rule" />
      <GlossText key={"o-" + String(outcome).slice(0, 24)} segs={outcomeSegs} />
      {record && (
        <details>
          <summary>▶ THE HISTORICAL RECORD</summary>
          <GlossText key={"r-" + String(outcome).slice(0, 24)} segs={recordSegs} />
        </details>
      )}
      {battle && <BattleReport battle={battle} />}
      <button className="dg-btn" onClick={onContinue}>Continue</button>
    </main>
  );
}

function yearsInPost(a) {
  const y = (d) => (d ? d.slice(0, 4) : "");
  return y(a.from) === y(a.to) ? y(a.from) : `${y(a.from)}–${y(a.to)}`;
}

function RecordScreen({ record, onBack }) {
  const [tab, setTab] = useState("dossiers");
  const playable = CAMPAIGN_IDS.filter((cid) => Object.keys(CAMPAIGNS[cid].nodes).length > 0);
  const atlas = buildNodeAtlas();
  const endings = buildEndings();
  return (
    <main {...rootProps(null, "record")}>
      <div className="dg-docrow">
        <h1 style={{ margin: 0, font: "inherit" }}>WAR RECORD</h1>
        <button className="dg-btn" onClick={onBack}>Return to file</button>
      </div>
      <hr className="dg-rule" />
      <p className="dg-note">
        {record.runs} {record.runs === 1 ? "file" : "files"} closed · {record.hardRuns} in hard mode. Entries open as you play; the record stays in this browser.
      </p>
      <div className="dg-tabs" role="group" aria-label="Record sections">
        {[["dossiers", "Dossiers"], ["atlas", "Atlas"], ["endings", "Endings"], ["echoes", "Echoes"], ["glossary", "Glossary"]].map(([id, label]) => (
          <button key={id} className="dg-btn" aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === "echoes" && (
        <section>
          <p className="dg-note">A choice in one command can change what another command faces. Marks are kept here; nothing echoes unless you have departed from the record.</p>
          {Object.entries(ECHOES).map(([flag, e]) => {
            const v = (record.xc || {})[flag];
            return v === undefined ? (
              <div key={flag} className="dg-entry locked"><span className="meta">{e.label}</span> Not yet set.</div>
            ) : (
              <div key={flag} className="dg-entry">
                <div className="meta">{e.label}</div>
                <div className="t">{e.values[v] || v}</div>
                <div className="meta">{v === e.historical ? "As in the record." : "Echoes in: " + e.readBy + ". Set in: " + e.setBy + "."}</div>
              </div>
            );
          })}
        </section>
      )}
      {tab === "glossary" && (
        <section>
          <p className="dg-note">Words and places in the files. In the story text, the first mention of each on a screen is underlined: press it for the definition.</p>
          {[...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term)).map((g) => (
            <div key={g.id} className="dg-entry">
              <div className="t">{g.term}</div>
              <div>{g.def}</div>
            </div>
          ))}
        </section>
      )}
      {tab !== "echoes" && tab !== "glossary" && playable.map((cid) => {
        const c = CAMPAIGNS[cid];
        if (tab === "dossiers") {
          const met = record.advisers[cid] || [];
          return (
            <section key={cid}>
              <h2 className="dg-sect">{c.shortName}</h2>
              <p className="dg-count">{c.advisors.filter((a) => met.includes(a.id)).length} of {c.advisors.length} dossiers open</p>
              {c.advisors.map((a) =>
                met.includes(a.id) ? (
                  <details key={a.id} className="dg-entry">
                    <summary><span className="t">{a.name}</span> <span className="meta">{a.dossier.role} · {yearsInPost(a)}</span></summary>
                    <div className="dg-prose">{a.dossier.bio}{"\n\n"}Fate: {a.dossier.fate}</div>
                  </details>
                ) : (
                  <div key={a.id} className="dg-entry locked">File closed. Meet this adviser in play to open it.</div>
                )
              )}
            </section>
          );
        }
        if (tab === "atlas") {
          const ids = Object.keys(c.nodes).filter((id) => !c.nodes[id].ending);
          const seen = record.nodes[cid] || [];
          return (
            <section key={cid}>
              <h2 className="dg-sect">{c.shortName}</h2>
              <p className="dg-count">{ids.filter((id) => seen.includes(id)).length} of {ids.length} decisions reached</p>
              {ids.map((id) => {
                const n = atlas[id];
                return seen.includes(id) ? (
                  <div key={id} className="dg-entry">
                    <div className="meta">{romanDate(n.date)}{n.city ? ` · ${n.city}` : ""}</div>
                    <div className="t">{n.title}</div>
                  </div>
                ) : (
                  <div key={id} className="dg-entry locked"><span className="meta">{n.year}</span> Not yet reached.</div>
                );
              })}
            </section>
          );
        }
        const list = endings.filter((e) => e.campaignId === cid);
        const found = list.filter((e) => record.endings.includes(e.id));
        return (
          <section key={cid}>
            <h2 className="dg-sect">{c.shortName}</h2>
            <p className="dg-count">{found.length} of {list.length} endings found</p>
            {list.map((e) =>
              record.endings.includes(e.id) ? (
                <div key={e.id} className="dg-entry">
                  <div className="meta">{e.badgeLabel}{e.hardModeOnly ? " · hard mode" : ""}</div>
                  <div className="t">{e.title}</div>
                </div>
              ) : (
                <div key={e.id} className="dg-entry locked">Not yet reached{e.hardModeOnly ? " (hard mode)" : ""}.</div>
              )
            )}
          </section>
        );
      })}
    </main>
  );
}

export default function App() {
  const [settings, setSettings] = useState(loadSettings);
  const [record, setRecord] = useState(loadRecord);
  const [savedRun, setSavedRun] = useState(loadSavedRun);
  const [mode, setMode] = useState("standard"); // the menu's choice: "easy", "standard" or "hard"
  const [runEasy, setRunEasy] = useState(false); // the run in hand is an easy run
  const [taken, setTaken] = useState([]); // the orders the run has given: { node, choice }
  const [history, setHistory] = useState([]); // the state before each order, for the easy mode's take-back
  const [screen, setScreen] = useState("menu");
  const [campaignId, setCampaignId] = useState(null);
  const [nodeId, setNodeId] = useState(null);
  const [flags, setFlags] = useState({});
  const [meters, setMeters] = useState(emptyMeters());
  const [hardState, setHardState] = useState(emptyHardState());
  const [pending, setPending] = useState(null);
  const [battleChoice, setBattleChoice] = useState(null); // the order whose battle is being planned
  const [visited, setVisited] = useState([]);
  const [runKey, setRunKey] = useState(0);
  const endedRun = useRef(-1);

  const node = useMemo(
    () => (nodeId ? resolveNode(nodeId, flags, meters, hardState) : null),
    [nodeId, flags, meters, hardState]
  );

  useEffect(() => { saveSettings(settings); }, [settings]);

  // A new screen puts keyboard and screen-reader focus on its heading, so the change is announced.
  const firstScreen = useRef(true);
  useEffect(() => {
    if (firstScreen.current) { firstScreen.current = false; return; }
    const h = document.querySelector("main h1");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }, [screen, nodeId]);
  useEffect(() => { saveRecord(record); }, [record]);

  // A node on screen counts as seen, and so do the advisers present at it.
  useEffect(() => {
    if (screen !== "node" || !campaignId || !nodeId || !node) return;
    setVisited((v) => (v.includes(nodeId) ? v : [...v, nodeId]));
    setRecord((r) => noteNodeSeen(r, campaignId, nodeId, node.advisors || []));
    if (node.ending && endedRun.current !== runKey) {
      endedRun.current = runKey;
      if (settings.sound) playSound("stamp");
      setRecord((r) => noteEnding(r, nodeId, hardState.enabled));
    }
  }, [screen, campaignId, nodeId, runKey]);

  // The run in progress is saved after every step; a finished run clears its save.
  useEffect(() => {
    if (!campaignId || !nodeId || (screen !== "node" && screen !== "outcome")) return;
    if (screen === "node" && node && node.ending) {
      clearSavedRun();
      setSavedRun(null);
      return;
    }
    saveRun(snapshotRun({
      campaignId, nodeId, flags, meters, hardState, visited, easy: runEasy, taken, history,
      pendingNextId: screen === "outcome" && pending ? pending.nextId ?? null : null,
      pendingOutcome: screen === "outcome" && pending ? pending.outcome ?? null : null,
      pendingRecord: screen === "outcome" && pending ? pending.record ?? null : null,
      pendingBattle: screen === "outcome" && pending ? pending.battle ?? null : null,
    }));
  }, [screen, campaignId, nodeId, flags, meters, hardState, pending, visited, runEasy, taken, history]);

  const start = (cid) => {
    setCampaignId(cid);
    setFlags(echoSeed(record));
    setMeters(emptyMeters());
    setHardState({ ...emptyHardState(), enabled: mode === "hard" });
    setRunEasy(mode === "easy");
    setTaken([]);
    setHistory([]);
    setVisited([]);
    setPending(null);
    setRunKey((k) => k + 1);
    setNodeId(CAMPAIGNS[cid].startNode);
    setScreen("node");
  };

  const resume = () => {
    const s = savedRun;
    if (!s) return;
    setCampaignId(s.campaignId);
    setFlags(s.flags);
    setMeters(s.meters);
    setHardState(s.hardState);
    setRunEasy(Boolean(s.easy));
    setTaken(Array.isArray(s.taken) ? s.taken : []);
    setHistory(Array.isArray(s.history) ? s.history : []);
    setVisited(s.visited);
    setPending(s.pendingOutcome ? { nextId: s.pendingNextId, outcome: s.pendingOutcome, record: s.pendingRecord ?? null, battle: s.pendingBattle ?? null } : null);
    setRunKey((k) => k + 1);
    setNodeId(s.nodeId);
    setScreen(s.pendingOutcome ? "outcome" : "node");
  };

  const discard = () => { clearSavedRun(); setSavedRun(null); };

  const home = () => {
    setScreen("menu");
    setNodeId(null);
    setCampaignId(null);
    setSavedRun(loadSavedRun());
  };

  // An order that hosts a battle opens the planning screen first, unless the planning is switched off.
  const pick = (ch) => {
    if (settings.battles !== false && battleOf(ch)) { setBattleChoice(ch); setScreen("battle"); return; }
    choose(ch);
  };

  const choose = (ch, plan = null) => {
    if (settings.sound) playSound("tick");
    const r = chooseNext(campaignId, ch, flags, meters, hardState, Math.random, plan);
    if (runEasy) setHistory((h) => [...h, { nodeId, flags, meters, hardState, visited, taken }].slice(-REWIND_LIMIT));
    setTaken((t) => [...t, { node: nodeId, choice: ch.id }]);
    setFlags(r.flags); setMeters(r.meters); setHardState(r.hardState);
    setRecord((rec) => noteEchoes(rec, r.flags));
    setPending({ ...r, record: historicalNote(node, ch), battle: r.battle ? { ...r.battle, plan } : null });
    setScreen(r.outcome ? "outcome" : "node");
    if (!r.outcome) setNodeId(r.nextId);
  };

  const cont = () => {
    setNodeId(pending?.nextId ?? null);
    setPending(null);
    setScreen("node");
  };

  // Easy mode: take back the last order, restoring the state it was given from.
  const rewind = () => {
    if (!history.length) return;
    const last = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setFlags(last.flags); setMeters(last.meters); setHardState(last.hardState); setVisited(last.visited); setTaken(last.taken);
    setPending(null);
    setNodeId(last.nodeId);
    setScreen("node");
  };

  const runMode = modeOf(hardState, runEasy);
  const rank = useMemo(
    () => (node && node.ending ? rankFor({ campaignId, endingId: nodeId, meters, hardState, easy: runEasy, taken }) : null),
    [node, campaignId, nodeId, meters, hardState, runEasy, taken]
  );

  return (
    <div className={`dg-fs-${settings.textSize}`} style={{ display: "contents" }}>
      <style>{css}</style>
      {screen === "menu" && (
        <MenuScreen onPick={start} onRecord={() => setScreen("record")} savedRun={savedRun}
          onResume={resume} onDiscard={discard} mode={mode} onMode={setMode}
          settings={settings} onSettings={setSettings} record={record} />
      )}
      {screen === "record" && <RecordScreen record={record} onBack={home} />}
      {screen === "outcome" && (
        <OutcomeScreen campaignId={campaignId} outcome={pending.outcome} record={pending.record} battle={pending.battle} onContinue={cont} />
      )}
      {screen === "battle" && battleChoice && (
        <BattleScreen campaignId={campaignId} config={battleOf(battleChoice)} meters={meters} easy={runEasy}
          onCommit={(plan) => { const ch = battleChoice; setBattleChoice(null); choose(ch, plan); }}
          onBack={() => { setBattleChoice(null); setScreen("node"); }} />
      )}
      {screen === "node" && node && (
        <NodeScreen campaignId={campaignId} node={node} meters={meters}
          hardState={hardState} visited={visited} flags={flags} nodeId={nodeId} easy={runEasy} canRewind={history.length > 0}
          rank={rank} mode={runMode} onRewind={rewind} onChoose={pick} onHome={home} />
      )}
      {screen === "node" && !node && (
        <main className="dg-root">
          <div className="dg-draft">
            Node "{String(nodeId)}" does not resolve. This is a routing bug, not a dead end by design.
          </div>
          <button className="dg-btn" onClick={home}>Home</button>
        </main>
      )}
    </div>
  );
}
