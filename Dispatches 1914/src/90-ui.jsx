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

import React, { useState, useMemo, useEffect, useRef, useId } from "react";

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
  mono: "var(--mono)",
};

/** Props for a screen's root: it takes its command's accent and paper (see the stylesheet's [data-campaign] rules). */
function rootProps(campaignId, screen) {
  return { className: "dg-root", "data-campaign": campaignId || undefined, "data-screen": screen };
}

const css = `
  /* ---- tokens: the themes and each command's accent, from src/63-themes.jsx ---- */
  ${themeCss()}
  .dg-root{--mono:"American Typewriter","Courier Prime","Courier New",Courier,monospace}
  [data-font="typewriter"] .dg-root{--mono:"American Typewriter","Courier Prime","Courier New",Courier,monospace}
  [data-font="dyslexia"] .dg-root{--mono:"OpenDyslexic","Lexend","Atkinson Hyperlegible",Verdana,"Trebuchet MS",sans-serif;line-height:1.9;letter-spacing:.05em;word-spacing:.16em}
  [data-font="plain"] .dg-root{--mono:"Atkinson Hyperlegible","Segoe UI",Verdana,Tahoma,sans-serif;line-height:1.72;letter-spacing:.012em;word-spacing:.06em}
  /* reading comfort (Settings): line spacing, line length and motion, after the type so they win */
  [data-spacing="roomy"] .dg-root{line-height:1.85;letter-spacing:.02em;word-spacing:.08em}
  [data-spacing="roomy"] .dg-prose{margin-bottom:24px}
  [data-spacing="wide"] .dg-root{line-height:2.05;letter-spacing:.035em;word-spacing:.14em}
  [data-spacing="wide"] .dg-prose{margin-bottom:30px}
  [data-measure="narrow"] .dg-prose,[data-measure="narrow"] .dg-lede,[data-measure="narrow"] .dg-ask{max-width:34em}
  [data-motion="reduced"] .dg-root *,[data-motion="reduced"] .dg-root *::before,[data-motion="reduced"] .dg-root *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}

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
  .dg-lede::first-letter{float:left;font-family:${THEME.serif};font-size:3.3em;line-height:.82;font-weight:700;padding:.07em .1em 0 0;color:var(--accent)}
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
  .dg-map{display:block;width:100%;height:auto;border:1.5px solid var(--rule);background:var(--sea);margin:0;box-shadow:inset 0 0 0 3px var(--paper),inset 0 0 0 4.5px var(--rule)}
  .dg-mapcard{margin:0 0 20px;box-shadow:2px 3px 0 rgba(28,26,23,.13)}
  .dg-maphead{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:0 0 6px}
  .dg-maphead .t{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;font-weight:700;color:var(--accent)}
  .dg-sea{fill:var(--sea)}
  .dg-country{stroke:var(--ink-soft);stroke-width:.45;vector-effect:non-scaling-stroke;stroke-opacity:.55}
  .dg-side-cp{fill:var(--cp)}
  .dg-side-ent{fill:var(--ent)}
  .dg-side-neu{fill:var(--neu)}
  .dg-occupied{stroke:none;opacity:.96}
  .dg-coast{fill:none;stroke:var(--ink);stroke-width:.9;vector-effect:non-scaling-stroke;stroke-opacity:.6}
  .dg-front-glow{fill:none;stroke:var(--accent);stroke-width:7;stroke-opacity:.22;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke}
  .dg-front{fill:none;stroke:var(--accent);stroke-width:2.2;stroke-dasharray:7 4;stroke-linejoin:round;vector-effect:non-scaling-stroke}
  .dg-trail{fill:none;stroke:var(--ink);stroke-width:1.3;stroke-dasharray:2 4;vector-effect:non-scaling-stroke;opacity:.7}
  .dg-visited{fill:var(--ink-soft);opacity:.65}
  .dg-pin{stroke:var(--paper);stroke-width:1.4;vector-effect:non-scaling-stroke}
  .dg-pintext{fill:var(--ink);font-family:${THEME.mono};font-weight:700;paint-order:stroke;stroke:var(--paper);stroke-width:2.5px}
  .dg-maplabel{fill:var(--ink-soft);font-family:${THEME.mono};paint-order:stroke;stroke:var(--paper);stroke-width:2.6px}
  .dg-hq{fill:none;stroke:var(--ink);stroke-width:2;vector-effect:non-scaling-stroke}
  .dg-pulse{fill:var(--accent);opacity:.35}
  .dg-hqlabel{fill:var(--ink);font-family:${THEME.serif};font-weight:700;paint-order:stroke;stroke:var(--paper);stroke-width:4px}
  .dg-modal{position:fixed;inset:0;z-index:50;background:rgba(20,17,12,.72);overflow:auto;padding:18px 12px;box-sizing:border-box}
  .dg-modal-inner{max-width:600px;margin:0 auto;background:var(--paper);padding:16px 14px 18px;border:2px solid var(--rule);box-shadow:0 14px 50px rgba(0,0,0,.4)}
  .dg-key{list-style:none;display:flex;flex-wrap:wrap;gap:6px 16px;margin:10px 0 4px;padding:0;font-size:12px}
  .dg-key li{display:flex;align-items:center;gap:6px}
  .dg-swatch{display:inline-block;width:16px;height:11px;border:1px solid var(--ink-soft)}
  .dg-swatch-front{background:none;border:0;border-top:2.5px dashed var(--accent);height:0;width:20px}
  .dg-swatch-hq{border-radius:50%;width:11px;height:11px;border:2px solid var(--ink);background:none}
  .dg-meanwhile{list-style:none;margin:0 0 12px;padding:0;font-size:12.5px}
  .dg-meanwhile li{display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-top:1px dotted var(--ink-soft)}
  .dg-meanwhile b{font-family:${THEME.serif};font-size:15px}
  @media (prefers-reduced-motion:no-preference){
    @keyframes dg-march{to{stroke-dashoffset:-22}}
    @keyframes dg-ping{0%{transform:scale(1);opacity:.45}100%{transform:scale(3.2);opacity:0}}
    .dg-front{animation:dg-march 1.1s linear infinite}
    .dg-pulse{transform-box:fill-box;transform-origin:center;animation:dg-ping 2.2s ease-out infinite}
  }
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
  .dg-root h1:focus,.dg-root h2:focus{outline:none}
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
  .dg-seg-wrap{flex-wrap:wrap}
  .dg-seg-wrap button{flex:1 1 40%;border-left:1.5px solid var(--rule)!important;margin:0 0 -1.5px}
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
  .dg-mode{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}
  .dg-mode-name{font-family:${THEME.serif};font-size:14px;letter-spacing:0;text-transform:none;font-weight:700}
  .dg-mode-tag{font-size:10px;letter-spacing:.14em;text-transform:uppercase;opacity:.8}
  .dg-planstamp{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px;padding:10px 12px;border:1.5px dashed var(--rule);cursor:pointer;position:relative}
  .dg-planstamp input{position:absolute;opacity:0;width:100%;height:100%;left:0;top:0;margin:0;cursor:pointer}
  .dg-planstamp:focus-within{outline:3px solid var(--accent);outline-offset:2px}
  .dg-planstamp-text{font-size:13px}
  .dg-planstamp-mark{flex:none;border:2.5px solid var(--rule);color:var(--ink-soft);padding:4px 10px;font-weight:700;font-size:11px;letter-spacing:.16em;text-transform:uppercase;transform:rotate(-4deg);opacity:.6}
  .dg-planstamp.on .dg-planstamp-mark{border-color:var(--accent);color:var(--accent);opacity:1}
  .dg-check{display:flex;gap:10px;align-items:flex-start;font-size:13px;margin:0 0 10px;cursor:pointer}
  .dg-check input{margin-top:4px;width:18px;height:18px;accent-color:var(--accent)}

  /* ---- the readings under a meter, the odds dial, the hold to sign, the sealed cable, the list of changes ---- */
  .dg-meter-btn{display:block;width:100%;text-align:left;background:none;border:0;padding:0;margin:0;font:inherit;color:inherit;letter-spacing:inherit;cursor:pointer}
  .dg-meter-btn:hover b{text-decoration:underline dotted}
  .dg-more{display:inline-block;width:0;height:0;margin-left:4px;vertical-align:middle;border:4px solid transparent;border-top-color:currentColor;border-bottom-width:0;opacity:.7}
  .dg-more.open{border-top-width:0;border-bottom-width:4px;border-top-color:transparent;border-bottom-color:currentColor}
  .dg-gauge i{transition:left .9s cubic-bezier(.3,.7,.2,1)}
  .dg-readings{border:1.5px solid var(--rule);border-top:0;margin:-20px 0 20px;padding:12px 14px 6px;background:rgba(255,255,255,.3);font-size:12px}
  .dg-reading{display:grid;grid-template-columns:9.5em 1fr 8em;gap:10px;align-items:center;padding:5px 0;border-top:1px dotted var(--ink-soft)}
  .dg-reading:first-of-type{border-top:0}
  .dg-reading .n{letter-spacing:.06em}
  .dg-reading b{text-align:right;font-weight:700}
  .dg-reading.lv0 b,.dg-reading.lv1 b{color:var(--accent)}
  .dg-reading.lv4 b{color:var(--good)}
  .dg-rbar{display:block;height:7px;border:1px solid var(--ink-soft);background:rgba(28,26,23,.06)}
  .dg-rbar i{display:block;height:100%;background:var(--ink-soft)}
  .dg-reading.lv0 .dg-rbar i,.dg-reading.lv1 .dg-rbar i{background:var(--accent)}
  .dg-reading.lv4 .dg-rbar i{background:var(--good)}
  @media (max-width:420px){.dg-reading{grid-template-columns:7.5em 1fr 6.5em}}
  .dg-odds{display:flex;align-items:center;gap:10px;margin:2px 0 10px;font-size:12px;letter-spacing:.08em;font-weight:700}
  .dg-dial{width:64px;height:37px;flex:none}
  .dg-choice{overflow:hidden}
  .dg-holdhint{display:block;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-soft);margin-top:6px}
  .dg-choice:hover:not(:disabled) .dg-holdhint{color:var(--paper-raised)}
  .dg-holdbar{position:absolute;left:0;bottom:0;height:5px;width:0;background:var(--accent)}
  .dg-choice:hover:not(:disabled) .dg-holdbar{background:var(--paper)}
  .dg-choice.holding .dg-holdbar{animation-name:dg-hold;animation-timing-function:linear;animation-fill-mode:forwards}
  @keyframes dg-hold{from{width:0}to{width:100%}}
  .dg-cable{border:1.5px solid var(--rule);padding:22px 18px;margin:0 0 20px;background:rgba(255,255,255,.3);text-align:center;box-shadow:2px 3px 0 rgba(28,26,23,.13)}
  .dg-envelope{position:relative;width:150px;height:96px;margin:6px auto 18px;border:2px solid var(--ink);background:var(--paper-raised);box-shadow:2px 3px 0 rgba(28,26,23,.2)}
  .dg-envelope::before{content:"";position:absolute;inset:0;background:linear-gradient(to bottom right,transparent 49%,var(--ink) 49%,var(--ink) 51%,transparent 51%) 0 0/100% 100%,linear-gradient(to bottom left,transparent 49%,var(--ink) 49%,var(--ink) 51%,transparent 51%) 0 0/100% 100%}
  .dg-envelope i{position:absolute;left:50%;top:50%;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;background:var(--accent);border:2px solid var(--paper);box-shadow:0 0 0 2px var(--accent)}
  .dg-changes{list-style:none;margin:0 0 20px;padding:0;font-size:13px}
  .dg-changes li{border-top:1px dotted var(--ink-soft);padding:7px 0}
  .dg-changes li b{display:inline-block;min-width:2.4em;font-family:${THEME.serif};font-size:17px}
  .dg-changes li.neg b{color:var(--accent)}
  .dg-changes li.pos b{color:var(--good)}
  @media (prefers-reduced-motion:no-preference){
    @keyframes dg-shake{0%,100%{transform:rotate(0)}25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}
  }
  @media (prefers-reduced-motion:reduce){.dg-gauge i{transition:none}}

  /* ---- the war record ---- */
  .dg-rec-card{border:1.5px solid var(--rule);padding:14px;margin:0 0 18px;background:rgba(255,255,255,.3);box-shadow:inset 0 0 0 3px var(--paper),inset 0 0 0 4px var(--rule)}
  .dg-tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:8px 0 14px}
  .dg-tile{border:1px solid var(--ink-soft);padding:8px 6px;text-align:center;background:var(--paper)}
  .dg-tile b{display:block;font-family:${THEME.serif};font-size:26px;line-height:1.1}
  .dg-tile small{font-size:13px;color:var(--ink-soft)}
  .dg-tile span{display:block;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft)}
  @media (max-width:420px){.dg-tiles{grid-template-columns:repeat(2,1fr)}}
  .dg-rec-bar{display:grid;grid-template-columns:7.5em 1fr 3.8em;gap:10px;align-items:center;padding:3px 0;font-size:12px}
  .dg-rec-bar b{text-align:right}
  .dg-rec-cmd{border:1.5px solid var(--rule);border-left:8px solid var(--accent);padding:12px 14px;margin:0 0 14px;background:rgba(255,255,255,.28);box-shadow:2px 3px 0 rgba(28,26,23,.12)}
  .dg-cmd-head{display:flex;gap:12px;align-items:center;margin-bottom:8px}
  .dg-cmd-head .t{font-family:${THEME.serif};font-size:19px;font-weight:700;line-height:1.15}
  .dg-cmd-head .meta{font-size:11px;letter-spacing:.1em;color:var(--ink-soft);text-transform:uppercase}
  .dg-seal{flex:none;border:2px solid var(--accent);color:var(--accent);font-size:10px;font-weight:700;letter-spacing:.12em;padding:5px 7px;transform:rotate(-4deg);box-shadow:inset 0 0 0 2px var(--paper),inset 0 0 0 3px var(--accent)}
  .dg-cmd-foot{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:8px;padding-top:8px;border-top:1px dotted var(--ink-soft);font-size:12px;color:var(--ink-soft)}
  .dg-avatar{display:inline-flex;align-items:center;justify-content:center;flex:none;width:38px;height:38px;border-radius:50%;margin-right:10px;border:2px solid var(--accent);
    background:radial-gradient(circle at 35% 30%,var(--paper),var(--paper-raised));color:var(--accent);font-family:${THEME.serif};font-weight:700;font-size:15px;box-shadow:inset 0 0 0 2px var(--paper)}
  .dg-avatar.shut{border-style:dashed;color:var(--ink-soft);border-color:var(--ink-soft)}
  .dg-mw-ctx{display:block;font-size:12.5px;color:var(--ink-soft);margin-top:3px;line-height:1.45}
  #root{position:relative}
  .dg-read{margin:0 0 14px}
  .dg-agreed{display:block;font-size:12px;color:var(--ink-soft);margin-top:2px}
  .dg-dossier summary{display:flex;align-items:center;border:0;padding:0;margin:0;background:none}
  .dg-dossier summary:hover{background:none;color:inherit}
  .dg-dossier-locked{display:flex;align-items:center}
  .dg-ribbon{display:flex;gap:6px;margin:6px 0 12px}
  .dg-ribbon .col{flex:1;border-top:2px solid var(--accent);padding-top:4px;text-align:center}
  .dg-ribbon .y{display:block;font-size:10px;letter-spacing:.14em;color:var(--ink-soft)}
  .dg-ribbon .dots{display:flex;gap:3px;justify-content:center;flex-wrap:wrap;min-height:10px;margin-top:3px}
  .dg-ribbon i{width:9px;height:9px;border-radius:50%;border:1.5px solid var(--ink-soft);background:none}
  .dg-ribbon i.on{background:var(--accent);border-color:var(--accent)}
  .dg-endings{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:0 0 14px}
  @media (max-width:420px){.dg-endings{grid-template-columns:1fr}}
  .dg-ending{border:2px solid var(--accent);padding:10px 12px;background:var(--paper);box-shadow:inset 0 0 0 2px var(--paper),inset 0 0 0 3px var(--accent);min-height:76px}
  .dg-ending .t{font-family:${THEME.serif};font-size:17px;font-weight:700;line-height:1.2;margin-top:2px}
  .dg-ending .meta{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:700}
  .dg-ending.dg-badge-contested{border-style:double;border-width:5px;box-shadow:none}
  .dg-ending.dg-badge-speculative{border-style:dashed}
  .dg-ending.locked{border:1.5px dashed var(--ink-soft);box-shadow:none;background:none}
  .dg-ending.locked .meta{color:var(--ink-soft)}
  .dg-ending.locked .t{color:var(--ink-soft);font-size:26px;opacity:.5}
  .dg-battle{border-left:6px solid var(--accent);padding-left:12px}
  .dg-battle-grade b{text-transform:uppercase;letter-spacing:.1em;color:var(--accent)}

  /* ---- the phone: tap targets of 44 pixels, a map that opens as a sheet from the bottom, the safe areas, words that never run off the edge ---- */
  .dg-swatch.dg-side-cp{background:var(--cp)}
  .dg-swatch.dg-side-ent{background:var(--ent)}
  .dg-swatch.dg-side-neu{background:var(--neu)}
  .dg-root{-webkit-text-size-adjust:100%;text-size-adjust:100%;overflow-wrap:anywhere;padding-bottom:calc(56px + env(safe-area-inset-bottom,0px));padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px))}
  .dg-root button,.dg-root summary,.dg-root label{-webkit-tap-highlight-color:transparent;touch-action:manipulation}
  .dg-btn{min-height:44px;padding-top:10px;padding-bottom:10px}
  .dg-seg button{min-height:44px}
  .dg-meter-btn{min-height:44px}
  .dg-bt-ctl .dg-btn{min-width:46px;padding-left:10px;padding-right:10px}
  details summary{min-height:44px;display:flex;align-items:center;box-sizing:border-box}
  .dg-check{min-height:44px;align-items:center}
  .dg-check input{width:22px;height:22px;flex:none;margin:0}
  .dg-term{padding:6px 0}
  @media (max-width:640px){
    .dg-modal{padding:0;display:flex;align-items:flex-end}
    .dg-modal-inner{max-width:none;width:100%;max-height:92vh;overflow:auto;border-radius:16px 16px 0 0;border-width:2px 0 0;padding:18px 14px calc(22px + env(safe-area-inset-bottom,0px));box-sizing:border-box}
    .dg-modal-inner::before{content:"";display:block;width:44px;height:4px;border-radius:2px;background:var(--ink-soft);opacity:.55;margin:-8px auto 12px}
  }
  @media (max-width:640px) and (prefers-reduced-motion:no-preference){
    @keyframes dg-sheet{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
    .dg-modal-inner{animation:dg-sheet .28s ease-out both}
  }
  @media (orientation:landscape) and (max-height:480px){.dg-modal-inner{max-height:96vh}.dg-node-title{font-size:28px}}

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

  /* ---- the shareable file ---- */
  .dg-share{margin:26px 0}
  .dg-sharecard{border:2px solid var(--rule);background:var(--paper-raised);padding:18px 18px 14px;text-align:center}
  .dg-sc-top{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--ink-soft)}
  .dg-sc-cmd{margin-top:8px;font-size:15px;color:var(--ink-soft)}
  .dg-sc-end{font-family:${THEME.serif};font-size:30px;font-weight:700;line-height:1.1;margin:6px 0 8px}
  .dg-sc-badge{display:inline-block;border:2px solid var(--accent);color:var(--accent);font-size:11px;letter-spacing:.2em;text-transform:uppercase;padding:3px 10px}
  .dg-sc-rank{margin-top:12px;font-size:14px}
  .dg-sc-rank b{display:block;font-size:22px;font-family:${THEME.serif}}
  .dg-sc-facts{font-size:14px;margin:12px 0 0}
  .dg-sc-h{margin-top:12px;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-soft)}
  .dg-sc-list{list-style:none;margin:6px 0 0;padding:0;font-size:14px;text-align:left}
  .dg-sc-list li{padding:6px 0;border-top:1px dotted var(--ink-soft)}
  .dg-share-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}
  .dg-share-text{width:100%;box-sizing:border-box;min-height:150px;font:inherit;font-size:14px;background:var(--paper-raised);color:var(--ink);border:1px solid var(--rule);margin-top:8px}
  @media print{
    .dg-root > *:not(.dg-share){display:none!important}
    .dg-share-btns,.dg-share .dg-note,.dg-share h2,.dg-share-text{display:none!important}
    .dg-sharecard{border-color:#000;background:#fff;color:#000;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .dg-sharecard *{color:#000!important;border-color:#000!important}
  }

  /* ---- the question, the steps of a battle plan, the verdict ---- */
  .dg-ask{border-left:4px solid var(--accent);padding:2px 0 2px 12px;margin:0 0 16px;font-size:16px}
  .dg-ask b{display:block;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);margin-bottom:2px}
  .dg-jump{display:block;margin-top:6px;background:none;border:0;border-bottom:1px solid currentColor;padding:6px 0;font:inherit;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:inherit;cursor:pointer;min-height:44px}
  .dg-steps{list-style:none;margin:0 0 6px;padding:0;display:grid;gap:6px}
  .dg-step{display:flex;gap:12px;align-items:center;width:100%;text-align:left;background:none;border:1.5px solid var(--rule);padding:10px 12px;font:inherit;color:inherit;cursor:pointer;min-height:44px}
  .dg-steps .now .dg-step{background:var(--ink);color:var(--paper)}
  .dg-step-n{flex:none;width:28px;height:28px;border:1.5px solid currentColor;border-radius:50%;display:grid;place-items:center;font-weight:700}
  .dg-step-t b{display:block;font-size:14px}
  .dg-step-t small{display:block;font-size:12.5px;opacity:.85}
  .dg-bt-bar{position:sticky;bottom:0;z-index:5;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;background:var(--paper);border-top:2px solid var(--rule);padding:10px 14px;margin:18px -20px 0}
  .dg-bt-stat{display:flex;flex-direction:column;font-size:12.5px}
  .dg-bt-k{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-soft)}
  .dg-bt-stat b{font-size:16px}
  .dg-bt-stat small{font-size:12px;color:var(--ink-soft)}
  .dg-bt-bar .dg-issue{margin:0;width:auto}
  @media (max-width:480px){.dg-bt-bar{grid-template-columns:1fr 1fr}.dg-bt-bar>:last-child{grid-column:1 / -1}}
  .dg-verdict{margin:0 0 18px}
  .dg-kind{display:inline-block;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;border:1.5px solid var(--ink-soft);padding:2px 8px;color:var(--ink-soft)}
  .dg-verdict-h{font-family:${THEME.serif};font-size:26px;line-height:1.15;margin:10px 0 12px}
  .dg-chips{list-style:none;margin:0 0 10px;padding:0;display:flex;flex-wrap:wrap;gap:8px}
  .dg-chips li{border:1.5px solid var(--ink-soft);padding:6px 10px;font-size:13px;display:flex;gap:8px;align-items:baseline}
  .dg-chips li b{font-size:17px;font-family:${THEME.serif}}
  .dg-chips li.neg{border-color:var(--accent)}
  .dg-grade{margin:0;font-size:13.5px;color:var(--ink-soft)}
  .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}

  /* ---- the Sepia look, over everything above ---- */

  /* ---- the front screens: the commands, the briefing, how to play, settings ---- */
  .dg-sub{font-size:14px;color:var(--ink-soft);margin:-6px 0 12px}
  .dg-title-sm{font-size:40px;margin:6px 0 10px}
  .dg-first{font-size:14px;margin:0 0 14px}
  .dg-cmd{position:relative;display:flex;gap:14px;width:100%;box-sizing:border-box;text-align:left;font:inherit;color:inherit;background:var(--paper-raised);
    border:1.5px solid var(--rule);padding:18px 14px 14px;margin:0 0 12px;cursor:pointer;min-height:44px;overflow:hidden}
  .dg-cmd:hover:not(:disabled){outline:3px solid var(--ink);outline-offset:-3px}
  .dg-cmd:disabled{opacity:.45;cursor:not-allowed}
  .dg-cmd-band{position:absolute;left:0;right:0;top:0;height:7px}
  .dg-cmd-seal{flex:none;width:58px;height:58px;box-sizing:border-box;display:grid;place-items:center;border:2px solid var(--ink);font-weight:700;font-size:12px;
    letter-spacing:.04em;text-align:center;margin-top:4px;transform:rotate(-3deg)}
  .dg-cmd-body{display:flex;flex-direction:column;gap:3px;min-width:0}
  .dg-cmd-nation{font-family:${THEME.serif};font-size:27px;font-weight:700;line-height:1.1}
  .dg-cmd-name{font-size:14px;font-weight:700}
  .dg-cmd-native{font-size:12px;color:var(--ink-soft);font-style:italic}
  .dg-cmd-quote{font-size:14.5px;font-style:italic;margin-top:6px;line-height:1.5}
  .dg-cmd-seal.long{font-size:10px;letter-spacing:0;white-space:nowrap}
  .dg-cmd-qdate{display:block;text-transform:none;letter-spacing:.02em;font-size:11px;margin-top:1px}
  .dg-sub-by{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-soft);margin:-6px 0 14px}
  .dg-sub-by span{display:block;text-transform:none;letter-spacing:.02em}
  .dg-cmd-by{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-soft);margin-top:2px}
  .dg-sum::before{content:"+";font-weight:700;display:inline-block;width:1.4em}
  details[open]>.dg-sum::before{content:"−"}
  .dg-cmd-meta{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft);margin-top:4px}
  .dg-nav{display:flex;flex-direction:column;gap:10px}
  .dg-navbtn{display:flex;flex-direction:column;gap:2px;text-align:left;font:inherit;color:inherit;background:none;border:1.5px solid var(--rule);padding:12px 14px;min-height:44px;cursor:pointer}
  .dg-navbtn b{font-size:14px;letter-spacing:.12em;text-transform:uppercase}
  .dg-navbtn span{font-size:12.5px;color:var(--ink-soft)}
  .dg-navbtn:hover{outline:3px solid var(--ink);outline-offset:-3px}
  .dg-brief{margin:0 0 12px}
  .dg-go{display:block;width:100%;margin-top:18px;padding:14px;font-size:13px;background:var(--ink);color:var(--paper)}
  .dg-go:hover:not(:disabled){background:var(--ink);color:var(--paper);outline:3px solid var(--ink-soft);outline-offset:2px}
  .dg-jumps{display:flex;flex-wrap:wrap;gap:6px 16px;margin:0 0 6px;font-size:13px}
  .dg-jumps a{color:var(--accent)}
  .dg-setting{margin:0 0 20px}
  .dg-range{width:100%;min-height:44px;accent-color:var(--ink);margin:0}
  .dg-ticks{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft)}
  .dg-sample{margin:10px 0 0;border-left:3px solid var(--rule);padding-left:12px}
  .dg-swatches{display:grid;grid-template-columns:repeat(auto-fit,minmax(104px,1fr));gap:8px}
  .dg-sw{display:flex;flex-direction:column;align-items:stretch;gap:6px;font:inherit;color:inherit;background:none;border:1.5px solid var(--rule);padding:8px;
    font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-align:center;cursor:pointer;min-height:44px}
  .dg-sw:hover{outline:3px solid var(--ink-soft);outline-offset:-3px}
  .dg-sw[aria-pressed="true"]{outline:3px solid var(--ink);outline-offset:-3px}
  .dg-sw-chip{display:block;padding:8px 0;border:1.5px solid;font-size:18px;font-family:${THEME.serif};letter-spacing:0;text-transform:none}
  .dg-fixed{border:1.5px dashed var(--rule);padding:10px 12px;margin:0}

  /* ---- ground held or lost against the record, on the map and in its list ---- */
  .dg-ground circle,.dg-ground rect{stroke-width:2.2;vector-effect:non-scaling-stroke}
  .dg-ground path{fill:none;stroke-width:2.2;stroke-linecap:round;vector-effect:non-scaling-stroke}
  .dg-ground-gained circle{fill:var(--paper);stroke:var(--accent)}
  .dg-ground-gained path{stroke:var(--accent)}
  .dg-ground-lost rect{fill:var(--paper);stroke:var(--op-focus,#9b2c1f)}
  .dg-ground-lost path{stroke:var(--op-focus,#9b2c1f)}
  .dg-swatch-gained{border-radius:50%;border:2px solid var(--accent);background:var(--paper)}
  .dg-swatch-lost{border:2px solid var(--op-focus,#9b2c1f);background:var(--paper)}
  .dg-groundlist{list-style:none;margin:6px 0 14px;padding:0}
  .dg-groundlist li{font-size:13px;margin:0 0 8px;padding-left:10px;border-left:3px solid var(--accent)}
  .dg-groundlist li.dg-ground-lost{border-left-color:var(--op-focus,#9b2c1f)}

  /* ---- a document from the record, at the head of a report ---- */
  .dg-document{margin:0 0 18px;padding:10px 14px 10px 16px;border-left:4px solid var(--accent);background:rgba(255,255,255,.18)}
  .dg-document figcaption{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:6px}
  .dg-document blockquote{margin:0;font-style:italic;line-height:1.6}
  .dg-document .src{font-size:11px;color:var(--ink-soft);margin-top:6px}

  /* ---- a newspaper special ---- */
  .dg-paper{position:relative;border:1px solid var(--rule);background:linear-gradient(90deg,rgba(60,40,10,.10),rgba(60,40,10,0) 5%,rgba(60,40,10,0) 95%,rgba(60,40,10,.12)),var(--paper-raised);padding:16px 18px 10px;margin:6px 0 18px;box-shadow:3px 4px 0 rgba(28,26,23,.18);color:var(--ink)}
  .dg-paper-mast{font-family:${THEME.serif};font-size:36px;font-weight:700;text-align:center;line-height:1.05;letter-spacing:.03em;text-transform:uppercase;padding-bottom:8px;border-bottom:4px double var(--ink)}
  .dg-paper-mast.de{font-family:"Old English Text MT","UnifrakturCook","Luminari",${THEME.serif};text-transform:none;font-size:40px;letter-spacing:0}
  .dg-paper-mast.fr{font-style:italic;text-transform:none;font-size:40px}
  .dg-paper-date{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-soft);padding:6px 0;border-bottom:1.5px solid var(--rule)}
  .dg-paper-title{font-family:${THEME.serif};font-size:32px;font-weight:700;line-height:1.08;margin:12px 0 4px;letter-spacing:-.01em}
  .dg-paper-by{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);margin:0 0 10px;padding-bottom:8px;border-bottom:1.5px solid var(--rule)}
  .dg-paper-cols p{margin:0 0 10px;font-family:${THEME.serif};font-size:15.5px;line-height:1.5;text-align:justify;hyphens:auto}
  .dg-paper-first::first-letter{font-family:${THEME.serif};float:left;font-size:3.1em;line-height:.85;padding:4px 6px 0 0;font-weight:700}
  .dg-paper-foot{font-size:11px;font-style:italic;color:var(--ink-soft);text-align:center;margin:6px 0 4px;padding-top:6px;border-top:1px dotted var(--ink-soft)}
  @media (min-width:720px){.dg-paper-cols{column-count:2;column-gap:26px;column-rule:1px solid var(--rule)}.dg-paper-cols p{break-inside:avoid-column}}

  /* ---- the sketch of the ground and the day's bulletins ---- */
  .dg-sketch{display:block;width:100%;height:auto;border:1.5px solid var(--ink);background:var(--paper-raised);margin:0 0 10px;touch-action:manipulation}
  .dg-sketch.small{margin:0 0 6px}
  .dg-sk-sector{fill:transparent}
  .dg-sk-sector.gaining{fill:rgba(95,123,88,.22)}
  .dg-sk-sector.breaking{fill:rgba(148,80,74,.22)}
  .dg-sk-hatch{stroke:var(--ink-soft);stroke-width:1}
  .dg-sk-div{stroke:var(--ink-soft);stroke-width:1;stroke-dasharray:3 3}
  .dg-sk-line{fill:none;stroke:var(--ink);stroke-width:3.5;stroke-linejoin:round}
  .dg-sk-counter{fill:var(--accent);stroke:var(--ink);stroke-width:1;cursor:pointer}
  .dg-sk-hit{fill:transparent;cursor:pointer}
  .dg-cond{display:flex;flex-wrap:wrap;gap:2px 14px;list-style:none;margin:0 0 12px;padding:0;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-soft)}
  .dg-cond-guns{flex-basis:100%;text-transform:none;letter-spacing:.02em;font-size:12.5px;color:var(--ink)}
  .dg-bel-src{display:block;font-size:11.5px;color:var(--ink-soft);margin-top:2px}
  .dg-sk-num{font-size:13px;font-weight:700;fill:var(--ink)}
  .dg-bul-n{display:inline-block;min-width:16px;text-align:center;font-size:10px;font-weight:700;border:1px solid var(--ink-soft);margin-right:4px}
  .dg-sk-label{font-size:9px;letter-spacing:.14em;text-transform:uppercase;fill:var(--ink-soft)}
  .dg-stage{margin:0 0 14px}
  .dg-stage-h{font-size:12px;letter-spacing:.2em;text-transform:uppercase;margin:6px 0 6px;color:var(--accent)}
  .dg-bulletins{list-style:none;margin:0;padding:0}
  .dg-bulletins li{padding:5px 8px;margin:0 0 4px;border-left:5px solid var(--rule);font-size:13px;line-height:1.45}
  .dg-bulletins li.s-gaining{border-left-color:#5f7b58}
  .dg-bulletins li.s-breaking{border-left-color:#94504a}
  .dg-bul-s{font-size:10px;letter-spacing:.14em;text-transform:uppercase;margin-right:4px}

  /* ---- the modes, the demo, the battle rig ---- */
  .dg-mode[data-mode="easy"]{border-bottom:4px solid #5f7b58}
  .dg-mode[data-mode="hard"]{border-bottom:4px solid #94504a}
  .dg-seg button.dg-mode[data-mode="easy"][aria-pressed="true"]{background:#4f6b49;color:#fff}
  .dg-seg button.dg-mode[data-mode="hard"][aria-pressed="true"]{background:#85443f;color:#fff}
  .dg-bullets{margin:0 0 14px;padding:8px 12px 8px 30px;font-size:13px;line-height:1.5;border-left:4px solid var(--rule)}
  .dg-bullets[data-mode="easy"]{border-left-color:#5f7b58}
  .dg-bullets[data-mode="hard"]{border-left-color:#94504a}
  .dg-bullets li{margin:2px 0}
  .dg-cmd-locked{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-top:6px}
  .dg-demo-note{font-size:13px;margin:0 0 14px;padding:10px 12px;border:1.5px dashed var(--rule);background:rgba(255,255,255,.2)}
  a.dg-link{display:block;text-decoration:none;text-align:center;box-sizing:border-box;margin:14px 0}
  .dg-rigrow{border:1.5px solid var(--rule);border-left:6px solid var(--accent);padding:10px 12px;margin:0 0 10px;background:var(--paper-raised)}
  .dg-rigrow .meta{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-soft)}
  .dg-rigrow .t{font-weight:700;margin:2px 0 8px}
  .dg-rigsel{display:flex;gap:10px;align-items:center;margin:0 0 8px;font-size:13px}
  .dg-rigsel select{flex:1;min-height:40px;font:inherit;background:var(--paper);color:var(--ink);border:1.5px solid var(--rule)}

  /* ---- the file at its close ---- */
  .dg-strip{margin:22px 0}
  .dg-strip-maps{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:10px 0}
  .dg-strip-maps figure{margin:0}
  .dg-strip-maps figcaption{font-size:12px;color:var(--ink-soft);margin-top:4px}
  @media (max-width:640px){.dg-strip-maps{grid-template-columns:1fr}}
  .dg-strip-h{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);margin:18px 0 8px}
  .dg-strip-list{margin:0;padding-left:20px;font-size:13.5px}
  .dg-strip-list li{margin:0 0 7px}
  .dg-strip-list .d{color:var(--ink-soft);font-size:12px}
  .dg-strip-staff{margin:0;padding-left:18px;font-size:13.5px}

  /* ---- the orders on the map ---- */
  .dg-op{fill:none;stroke:currentColor;stroke-linecap:round}
  .dg-op-hold circle{fill:none;stroke:currentColor}
  .dg-op-hold rect{fill:currentColor;stroke:none}
  .dg-op-cand{color:var(--ink);opacity:.45}
  .dg-op-focus{color:var(--op-focus,var(--accent));opacity:1}
  .dg-op-done{color:var(--ink);opacity:.95}
  .dg-op-past{color:var(--ink);opacity:.25}
  .dg-mk-cand{color:var(--ink);opacity:.45}
  .dg-mk-focus{color:var(--op-focus,var(--accent))}
  .dg-mk-done{color:var(--ink)}
  .dg-mk-past{color:var(--ink);opacity:.25}
  .dg-swatch-op{background:linear-gradient(90deg,var(--accent) 0 60%,transparent 60%);height:4px;align-self:center}

  /* ---- the staff's reading, the advisers' trust ---- */
  .dg-intel{margin:0 0 6px}
  .dg-bel{list-style:none;margin:0 0 8px;padding:0}
  .dg-bel li{border-top:1px dotted var(--ink-soft);padding:10px 0;font-size:14px}
  .dg-gtag{display:inline-block;border:1.5px solid var(--ink-soft);padding:1px 8px;margin-right:8px;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft)}
  .dg-g-firm{border-color:var(--ink);color:var(--ink)}
  .dg-fogtag{font-weight:400;letter-spacing:.02em;text-transform:none}
  .dg-rests{display:block;font-size:12px;color:var(--ink-soft);font-style:italic;margin:0 0 8px}
  .dg-mute{font-style:italic;color:var(--ink-soft)}
  .dg-trust{font-style:normal;font-size:11px;letter-spacing:.12em;text-transform:uppercase}

  ${sepiaCss()}
`;

function Stamp({ children }) {
  return <span className="dg-stamp">{children}</span>;
}

const TEXT_SIZE_LABELS = { s: "Standard", m: "Larger", l: "Largest" };

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

/** The report's jump: straight to the orders, and the focus goes with it. */
function jumpToOrders() {
  const h = document.getElementById("dg-orders");
  if (!h) return;
  h.scrollIntoView({ block: "start" });
  h.focus({ preventScroll: true });
}

function NodeScreen({ campaignId, node, meters, hardState, visited, flags, nodeId, easy, canRewind, rank, mode, taken, holdToSign, onRewind, onChoose, onCheck, onHome }) {
  const c = CAMPAIGNS[campaignId];
  const years = [1914, 1915, 1916, 1917, 1918];
  const [situationSegs, epilogueSegs] = useMemo(() => markFirstMentions([node.situation, node.epilogue]), [node]);
  const [viewing, setViewing] = useState(null); // the order the pointer or the keyboard is on: its arrow is drawn on the map
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

      <div className="dg-node-date">{nodeDate(campaignId, node.date)}</div>
      <h1 className="dg-node-title">{node.title}</h1>
      <ConditionsStrip campaignId={campaignId} node={{ ...node, id: nodeId }} flags={flags} meters={meters} />
      {node.city && mapFor(campaignId).cities[node.city] && <FrontMapPanel campaignId={campaignId} node={node} nodeId={nodeId} visited={visited || []} focus={viewing} taken={taken || []} flags={flags} />}
      {documentOf(nodeId) ? (
        <figure className="dg-document">
          <figcaption>{documentOf(nodeId).date}. {documentOf(nodeId).by}</figcaption>
          <blockquote>{documentOf(nodeId).text}</blockquote>
          <div className="src">{documentOf(nodeId).source}</div>
        </figure>
      ) : node.bulletin && typeof node.bulletin === "object" && (
        <div className="dg-bulletin">
          <div className="h">{node.bulletin.source} · {node.bulletin.date}</div>
          {node.bulletin.text}
        </div>
      )}

      <ReadAloud id={nodeId} text={[node.title, documentOf(nodeId) ? documentOf(nodeId).by + ". " + documentOf(nodeId).text : "", String(node.situation || "").replace(/\s+/g, " ")].filter(Boolean).join(". ")} />
      <GlossText key={nodeId + "-situation"} segs={situationSegs} className="dg-prose dg-lede" />

      {!node.ending && <IntelPanel nodeId={nodeId} flags={flags || {}} easy={easy} hard={hardState.enabled} onCheck={onCheck} />}

      <MeterLedger meters={meters} labels={node.meterLabels} flags={flags} />

      {node.ending ? (
        <>
          <div className={`dg-badge dg-badge-${node.ending.badge}`}>{BADGE_LABELS[node.ending.badge]}</div>
          {node.epilogue && <GlossText key={nodeId + "-epilogue"} segs={epilogueSegs} />}
          {rank && <RankPanel result={rank} />}
          <FileStrip campaignId={campaignId} endingId={nodeId} flags={flags} taken={taken || []} hard={hardState.enabled} />
          {rank && <ShareCard campaignId={campaignId} endingId={nodeId} rank={rank} taken={taken || []} flags={flags || {}} mode={mode} />}
          <button className="dg-btn" onClick={onHome}>Return to file</button>
        </>
      ) : (
        <>
          <h2 id="dg-orders" tabIndex={-1} className="dg-order">Issue Order</h2>
          {easy && canRewind && (
            <p><button className="dg-btn" onClick={onRewind}>Take back the last order</button></p>
          )}
          {node.choices.map((ch) => {
            const strain = strainedUncertain(ch, meters);
            const fog = !ch.blocked && intelFogged(nodeId, ch, flags || {}, easy);
            const odds = ch.blocked ? null : fog ? intelBelievedOdds(orderOdds(ch, meters, flags)) : orderOdds(ch, meters, flags);
            const rests = intelRests(nodeId, ch, flags || {}, easy);
            return (
            <OrderButton key={ch.id} ch={ch} hold={holdToSign && !!odds} onSign={() => onChoose(ch)} onView={setViewing}>
              <div className="lab">{ch.label}</div>
              {!ch.advisor && orderNote(nodeId, ch.id) && <div className="dg-quote">{orderNote(nodeId, ch.id)}</div>}
              {odds && <OddsDial odds={odds} easy={easy} fog={fog} />}
              {rests && <span className="dg-rests">{rests}</span>}
              {ch.blocked && <div className="dg-cost">{ch.disabledReason}</div>}
              {easy && ch.historical && <span className="dg-record-mark">The order the command gave</span>}
              {easy && !ch.blocked && <span className="dg-preview">{previewText(ch, node.meterLabels)}</span>}
              {strain.points > 0 && (
                <span className="dg-strain">Strain: {node.meterLabels[strain.meter]} is short, so the odds are {strain.points} points worse</span>
              )}
              {ch.erodes && hardState.enabled && !ch.ally && <div className="dg-cost">Costs standing</div>}
              {ch.ally && hardState.enabled && <div className="dg-cost">{ch.ally.charAt(0).toUpperCase() + ch.ally.slice(1)} must be brought round: it costs standing</div>}
              {ch.advisor && (() => {
                const aid = adviserIdFor(campaignId, ch.advisor.name);
                const st = aid ? adviserState(flags || {}, aid) : "normal";
                if (st === "gone") return <div className="dg-quote dg-mute">{ch.advisor.name} has left the staff.</div>;
                if (st === "quiet") return <div className="dg-quote dg-mute">{ch.advisor.name} has gone quiet and offers no argument on this.</div>;
                return <div className="dg-quote">{ch.advisor.name}{st === "trusted" ? <span className="dg-trust"> (trusted)</span> : null} argues: {ch.advisor.position}</div>;
              })()}
              {ch.attested && (
                <div className="dg-attested">
                  <span className="dg-attested-tag">On the record</span>{" "}
                  {ch.attested.by}: “{ch.attested.text}” <cite>— {ch.attested.source}</cite>
                </div>
              )}
            </OrderButton>
            );
          })}
        </>
      )}
    </main>
  );
}

/** What the outcome of an order is called on its screen: as the record has it, a modelled alternative, or just the result. */
const SPECULATIVE_LEAD = /^(Speculative|A modell?ed alternative)\.\s*/i;

function OutcomeScreen({ campaignId, node, nodeId, orderId, visited, outcome, headline, historical, record, battle, changes, contested, informed, meters, flags, onContinue }) {
  const c = CAMPAIGNS[campaignId];
  const heading = useRef(null);
  useEffect(() => { if (contested && heading.current) heading.current.focus(); }, []);
  const speculative = SPECULATIVE_LEAD.test(outcome || "");
  const body = speculative ? outcome.replace(SPECULATIVE_LEAD, "") : outcome;
  const [outcomeSegs, recordSegs] = useMemo(() => markFirstMentions([body, record && record.text]), [body, record]);
  const labels = meterLabels(campaignId);
  // what each meter did, summed over its readings
  const moved = useMemo(() => {
    const o = {};
    for (const ch of changes || []) o[ch.axis] = (o[ch.axis] || 0) + ch.delta;
    return METER_AXES.filter((a) => o[a]).map((a) => ({ axis: a, delta: o[a] }));
  }, [changes]);
  // where the meters stood before the order, so the gauges can slide to where they stand now
  const from = useMemo(() => {
    const f = { ...meters };
    for (const ch of changes || []) f[ch.axis] = ch.from;
    return f;
  }, [meters, changes]);
  return (
    <main {...rootProps(campaignId, "outcome")}>
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <h1 className="dg-docrow" style={{ margin: "18px 0 16px" }}><span>{c.docLabel} · OUTCOME</span></h1>
      <hr className="dg-rule" />
      {(
        <>
          <section className="dg-verdict" aria-label="The verdict">
            <h2 ref={heading} tabIndex={-1} className="dg-verdict-h">{headline || (contested ? "The result" : "The outcome")}</h2>
            <ul className="dg-chips" aria-label="What it did to the meters">
              {moved.length === 0 && <li>No change to the meters</li>}
              {moved.map((m) => (
                <li key={m.axis} className={m.delta < 0 ? "neg" : "pos"}>
                  <b aria-hidden="true">{fmtMeter(m.delta)}</b>
                  <span className="sr">{m.delta < 0 ? "Down " : "Up "}{Math.abs(m.delta)}: </span>{labels[m.axis]}
                </li>
              ))}
            </ul>
            {battle && <p className="dg-grade">{GRADE_SHORT[battle.grade]}</p>}
            {informed && <p className="dg-note">The staff had checked its reading.</p>}
          </section>
          {node && node.city && mapFor(campaignId).cities[node.city] && mapOpsFor(nodeId, orderId).length > 0 && (
            <FrontMapPanel campaignId={campaignId} node={node} nodeId={nodeId} visited={visited || []} executed={{ nodeId, choiceId: orderId }} flags={flags} />
          )}
          <GlossText key={"o-" + String(outcome).slice(0, 24)} segs={outcomeSegs} />
          <MeterLedger meters={meters} labels={labels} flags={flags} from={from} />
          {battle && <BattleReport battle={battle} />}
          <button className="dg-btn" onClick={onContinue}>Continue</button>
        </>
      )}
    </main>
  );
}

function yearsInPost(a) {
  const y = (d) => (d ? d.slice(0, 4) : "");
  return y(a.from) === y(a.to) ? y(a.from) : `${y(a.from)}–${y(a.to)}`;
}

const initialsOf = (name) => name.replace(/[^A-Za-zÀ-ɏ ]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

function RecBar({ label, a, b }) {
  const pct = b ? Math.round((a / b) * 100) : 0;
  return (
    <div className="dg-rec-bar">
      <span className="n">{label}</span>
      <span className="dg-rbar" role="img" aria-label={`${a} of ${b}`}><i style={{ width: pct + "%" }} /></span>
      <b>{a}/{b}</b>
    </div>
  );
}

function RecordScreen({ record, onBack }) {
  const [tab, setTab] = useState("service");
  const playable = CAMPAIGN_IDS.filter((cid) => Object.keys(CAMPAIGNS[cid].nodes).length > 0);
  const atlas = buildNodeAtlas();
  const endings = buildEndings();
  const best = record.best || {};
  const files = record.files || {};
  const fought = record.battles || {};
  // what has been opened, per command
  const stats = Object.fromEntries(playable.map((cid) => {
    const c = CAMPAIGNS[cid];
    const ids = Object.keys(c.nodes).filter((id) => !c.nodes[id].ending);
    const seen = ids.filter((id) => (record.nodes[cid] || []).includes(id)).length;
    const list = endings.filter((e) => e.campaignId === cid);
    const found = list.filter((e) => record.endings.includes(e.id)).length;
    return [cid, { seen, decisions: ids.length, found, endings: list.length }];
  }));
  const sum = (k) => playable.reduce((n, cid) => n + stats[cid][k], 0);
  const opened = sum("seen") + sum("found");
  const everything = sum("decisions") + sum("endings");
  const TABS = [["service", "Service"], ["dossiers", "Dossiers"], ["endings", "Endings"], ["atlas", "Atlas"], ["battles", "Battles"], ["glossary", "Glossary"]];
  return (
    <main {...rootProps(null, "record")}>
      <div className="dg-docrow">
        <h1 style={{ margin: 0, font: "inherit" }}>WAR RECORD</h1>
        <button className="dg-btn" onClick={onBack}>Return to file</button>
      </div>
      <div className="dg-tabs" role="group" aria-label="Record sections">
        {TABS.map(([id, label]) => (
          <button key={id} className="dg-btn" aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === "service" && (
        <section>
          <div className="dg-rec-card">
            <div className="dg-count">Service record</div>
            <div className="dg-tiles">
              <div className="dg-tile"><b>{record.runs || 0}</b><span>files closed</span></div>
              <div className="dg-tile"><b>{record.hardRuns || 0}</b><span>in hard mode</span></div>
              <div className="dg-tile"><b>{sum("found")}<small>/{sum("endings")}</small></b><span>endings found</span></div>
              <div className="dg-tile"><b>{sum("seen")}<small>/{sum("decisions")}</small></b><span>decisions reached</span></div>
            </div>
            <RecBar label="The whole record" a={opened} b={everything} />
          </div>
          {playable.map((cid) => {
            const c = CAMPAIGNS[cid];
            const s = stats[cid];
            const b = best[cid];
            return (
              <div key={cid} className="dg-rec-cmd" style={{ "--accent": "var(--acc-" + cid + ")" }}>
                <div className="dg-cmd-head">
                  <span className="dg-seal">{c.seal}</span>
                  <div>
                    <div className="t">{c.shortName}</div>
                    <div className="meta">{c.seat}</div>
                  </div>
                </div>
                <RecBar label="Decisions" a={s.seen} b={s.decisions} />
                <RecBar label="Endings" a={s.found} b={s.endings} />
                <div className="dg-cmd-foot">
                  <span>{files[cid] ? `${files[cid]} ${files[cid] === 1 ? "file" : "files"} closed` : "No file closed yet"}</span>
                  <span>{b ? `Best: ${b.rank} (${b.score}/100)` : "No rank yet"}</span>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {tab === "glossary" && (
        <section>
          <p className="dg-note">Underlined words in a report open their definition.</p>
          {[...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term)).map((g) => (
            <div key={g.id} className="dg-entry">
              <div className="t">{g.term.replace(/(^|[\s-])([a-z])/g, (m, a, b) => a + b.toUpperCase())}</div>
              <div>{g.def}</div>
            </div>
          ))}
        </section>
      )}

      {tab === "battles" && (
        <section>
          {Object.values(BATTLES).map((cfg) => {
            const f = fought[cfg.id];
            const c = CAMPAIGNS[cfg.campaign];
            const host = atlas[cfg.host.node];
            return (
              <div key={cfg.id} className={"dg-entry dg-battle" + (f ? "" : " locked")} style={{ "--accent": "var(--acc-" + cfg.campaign + ")" }}>
                <div className="meta">{c.shortName}{host ? ` · ${nodeDate(cfg.campaign, host.date)}` : ""}</div>
                <div className="t">{cfg.title.replace("Order of Battle: ", "")}</div>
                {f && <div className="dg-battle-grade">Fought {f.n} {f.n === 1 ? "time" : "times"} · best: <b>{f.best}</b></div>}
              </div>
            );
          })}
        </section>
      )}

      {tab !== "service" && tab !== "glossary" && tab !== "battles" && playable.map((cid) => {
        const c = CAMPAIGNS[cid];
        if (tab === "dossiers") {
          const advice = (record.advice || {})[cid] || {};
          return (
            <section key={cid} style={{ "--accent": "var(--acc-" + cid + ")" }}>
              <h2 className="dg-sect">{c.shortName}</h2>
              {c.advisors.map((a) => {
                const adv = advice[a.id] || { agreed: 0, argued: 0 };
                return (
                  <details key={a.id} className="dg-entry dg-dossier">
                    <summary>
                      <span className="dg-avatar" aria-hidden="true">{initialsOf(a.name)}</span>
                      <span><span className="t">{a.name}</span> <span className="meta">{a.dossier.role} · {yearsInPost(a)}</span>
                        <span className="dg-agreed">{adv.argued ? `You followed this adviser in ${adv.agreed} of ${adv.argued} orders.` : "No orders given on this adviser's argument yet."}</span></span>
                    </summary>
                    <div className="dg-prose">{a.dossier.bio}{"\n\n"}Fate: {a.dossier.fate}</div>
                  </details>
                );
              })}
            </section>
          );
        }
        if (tab === "atlas") {
          const ids = Object.keys(c.nodes).filter((id) => !c.nodes[id].ending);
          const seen = record.nodes[cid] || [];
          const years = [1914, 1915, 1916, 1917, 1918];
          return (
            <section key={cid} style={{ "--accent": "var(--acc-" + cid + ")" }}>
              <h2 className="dg-sect">{c.shortName}</h2>
              <p className="dg-count">{ids.filter((id) => seen.includes(id)).length} of {ids.length} decisions reached</p>
              <div className="dg-ribbon" aria-hidden="true">
                {years.map((y) => {
                  const here = ids.filter((id) => atlas[id].year === y);
                  return (
                    <div key={y} className="col">
                      <span className="y">{y}</span>
                      <span className="dots">{here.map((id) => <i key={id} className={seen.includes(id) ? "on" : ""} />)}</span>
                    </div>
                  );
                })}
              </div>
              {years.map((y) => {
                const here = ids.filter((id) => atlas[id].year === y);
                const got = here.filter((id) => seen.includes(id));
                if (!here.length) return null;
                return (
                  <div key={y}>
                    {got.map((id) => {
                      const n = atlas[id];
                      return (
                        <div key={id} className="dg-entry">
                          <div className="meta">{nodeDate(n.campaignId, n.date)}{n.city ? ` · ${n.city}` : ""}</div>
                          <div className="t">{n.title}</div>
                        </div>
                      );
                    })}
                    {got.length < here.length && (
                      <div className="dg-entry locked"><span className="meta">{y}</span> {here.length - got.length} not yet reached.</div>
                    )}
                  </div>
                );
              })}
            </section>
          );
        }
        const list = endings.filter((e) => e.campaignId === cid);
        const found = list.filter((e) => record.endings.includes(e.id));
        return (
          <section key={cid} style={{ "--accent": "var(--acc-" + cid + ")" }}>
            <h2 className="dg-sect">{c.shortName}</h2>
            <p className="dg-count">{found.length} of {list.length} endings found</p>
            <div className="dg-endings">
              {list.map((e) =>
                record.endings.includes(e.id) ? (
                  <div key={e.id} className={"dg-ending dg-badge-" + e.badge}>
                    <div className="meta">{e.badgeLabel}{e.hardModeOnly ? " · hard mode" : ""}</div>
                    <div className="t">{e.title}</div>
                  </div>
                ) : (
                  <div key={e.id} className="dg-ending locked">
                    <div className="meta">Not yet reached{e.hardModeOnly ? " (hard mode)" : ""}</div>
                    <div className="t" aria-hidden="true">?</div>
                  </div>
                )
              )}
            </div>
          </section>
        );
      })}
    </main>
  );
}

export default function App() {
  const [settings, setSettings] = useState(loadSettings);
  const [record, setRecord] = useState(loadRecord);
  const [savedRun, setSavedRun] = useState(() => { const s = loadSavedRun(); return DEMO && s && (s.campaignId !== DEMO_COMMAND || (Array.isArray(s.taken) ? s.taken.length : 0) >= DEMO_DECISIONS) ? null : s; });
  const [signals, setSignals] = useState("cipher"); // the briefing's choice: "cipher" or "clear"
  const [press, setPress] = useState("free"); // the briefing's choice: "free" or "censored"
  const [rigOn, setRigOn] = useState(false); // a battle opened from the battle rig (a dev build): nothing of it is saved
  const [rigPosture, setRigPosture] = useState(null);
  const [mode, setMode] = useState("standard"); // the menu's choice: "easy", "standard" or "hard"
  const [runEasy, setRunEasy] = useState(false); // the run in hand is an easy run
  const [taken, setTaken] = useState([]); // the orders the run has given: { node, choice }
  const [history, setHistory] = useState([]); // the state before each order, for the easy mode's take-back
  const [screen, setScreen] = useState("menu");
  const [cameFrom, setCameFrom] = useState("menu"); // where How to play and Settings go back to
  const [howBack, setHowBack] = useState(null); // How to play opened from Settings goes back to it
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
  // the colours and the type: set on the page, so the whole sheet and the desk behind it follow
  useEffect(() => {
    const apply = () => {
      const mq = (q) => (window.matchMedia ? window.matchMedia(q).matches : false);
      const theme = resolveTheme(settings.theme || DEFAULT_THEME, mq("(prefers-color-scheme: dark)"), mq("(prefers-contrast: more)"));
      const root = document.documentElement;
      root.setAttribute("data-theme", theme);
      root.setAttribute("data-font", settings.font === "plain" || settings.font === "typewriter" || settings.font === "dyslexia" ? settings.font : "theme");
      root.setAttribute("data-spacing", settings.spacing || "standard");
      root.setAttribute("data-measure", settings.measure || "standard");
      root.setAttribute("data-motion", settings.motion || "auto");
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", THEME_TOKENS[theme].base.paper);
    };
    apply();
    if (settings.theme !== "auto" || !window.matchMedia) return undefined;
    const qs = [window.matchMedia("(prefers-color-scheme: dark)"), window.matchMedia("(prefers-contrast: more)")];
    qs.forEach((q) => q.addEventListener && q.addEventListener("change", apply));
    return () => qs.forEach((q) => q.removeEventListener && q.removeEventListener("change", apply));
  }, [settings.theme, settings.font, settings.spacing, settings.measure, settings.motion]);
  // the soundtrack follows the settings, and starts on the first tap or key because the browser will not start it before then
  useEffect(() => { musicApply(settings.music !== false, typeof settings.musicVolume === "number" ? settings.musicVolume : 0.5); }, [settings.music, settings.musicVolume]);
  useEffect(() => {
    const vis = () => musicHidden(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, []);
  useEffect(() => {
    const opts = { once: true, capture: true };
    const go = () => musicResume();
    ["pointerdown", "keydown", "touchstart"].forEach((e) => document.addEventListener(e, go, opts));
    return () => ["pointerdown", "keydown", "touchstart"].forEach((e) => document.removeEventListener(e, go, opts));
  }, []);
  // sound: the mode follows the settings, the ambience follows the command in play, and a bulletin comes in on the wire
  useEffect(() => { setAudioMode(settings.sound ? (settings.atmosphere ? 2 : 1) : 0); }, [settings.sound, settings.atmosphere]);
  useEffect(() => {
    if (settings.sound && settings.atmosphere && campaignId && (screen === "node" || screen === "outcome" || screen === "battle")) atmosphereStart(campaignId);
    else atmosphereStop();
  }, [screen, campaignId, settings.sound, settings.atmosphere]);
  useEffect(() => {
    if (screen === "node" && node && node.bulletin && typeof node.bulletin === "object" && !documentOf(nodeId)) atmosphereFx("telegraph");
  }, [screen, nodeId]);

  // A new screen puts keyboard and screen-reader focus on its heading, so the change is announced.
  const firstScreen = useRef(true);
  useEffect(() => {
    if (firstScreen.current) { firstScreen.current = false; return; }
    try { window.scrollTo(0, 0); } catch (e) { /* no scrolling here */ }
    const h = document.querySelector("main h1");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }, [screen, nodeId, campaignId]);
  useEffect(() => { if (!rigOn) saveRecord(record); }, [record]);

  // A node on screen counts as seen, and so do the advisers present at it.
  useEffect(() => {
    if (screen !== "node" || !campaignId || !nodeId || !node) return;
    setVisited((v) => (v.includes(nodeId) ? v : [...v, nodeId]));
    setRecord((r) => noteNodeSeen(r, campaignId, nodeId, node.advisors || []));
    if (node.ending && endedRun.current !== runKey) {
      endedRun.current = runKey;
      if (settings.sound) playSound("stamp");
      setRecord((r) => {
        const closed = noteEnding(r, nodeId, hardState.enabled);
        return noteRank(closed, campaignId, rankFor({ campaignId, endingId: nodeId, meters, hardState, easy: runEasy, taken, flags }));
      });
    }
  }, [screen, campaignId, nodeId, runKey]);

  // The run in progress is saved after every step; a finished run clears its save.
  useEffect(() => {
    if (rigOn || !campaignId || !nodeId || (screen !== "node" && screen !== "outcome")) return;
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
      pendingHeadline: screen === "outcome" && pending ? pending.headline ?? null : null,
      pendingHistorical: screen === "outcome" && pending ? (pending.historical === undefined ? null : pending.historical) : null,
    }));
  }, [screen, campaignId, nodeId, flags, meters, hardState, pending, visited, runEasy, taken, history]);

  const start = (cid) => {
    setCampaignId(cid);
    setFlags({ ...echoSeed(record), ...(signals === "clear" ? { sig_clear: true } : {}), ...(press === "censored" ? { press_censored: true } : {}) });
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
    setPending(s.pendingOutcome ? { nextId: s.pendingNextId, outcome: s.pendingOutcome, record: s.pendingRecord ?? null, battle: s.pendingBattle ?? null, headline: s.pendingHeadline ?? null, historical: s.pendingHistorical === true } : null);
    setRunKey((k) => k + 1);
    setNodeId(s.nodeId);
    setScreen(s.pendingOutcome ? "outcome" : "node");
  };

  const discard = () => { clearSavedRun(); setSavedRun(null); };

  // How to play and Settings open from the menu or the briefing and go back to where they were opened.
  const openAside = (which) => { setCameFrom(screen); setScreen(which); };

  const home = () => {
    setRigOn(false);
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
    atmosphereFx("sign");
    const r = chooseNext(campaignId, ch, flags, meters, hardState, Math.random, plan, { nodeId, easy: runEasy });
    if (runEasy) setHistory((h) => [...h, { nodeId, flags, meters, hardState, visited, taken }].slice(-REWIND_LIMIT));
    setTaken((t) => [...t, { node: nodeId, choice: ch.id }]);
    setFlags(r.flags); setMeters(r.meters); setHardState(r.hardState);
    const argued = (node.choices || []).map((c) => adviserIdFor(campaignId, c.advisor && c.advisor.name)).filter(Boolean);
    const followed = adviserIdFor(campaignId, ch.advisor && ch.advisor.name);
    setRecord((rec) => noteAdvice(r.battle ? noteBattle(noteEchoes(rec, r.flags), r.battle.id, r.battle.grade) : noteEchoes(rec, r.flags), campaignId, argued, followed));
    const event = r.nextId ? dueEvent(campaignId, r.nextId, r.flags, r.meters) : null; // a special event that the file's state has earned, before the next report
    setPending({ ...r, headline: r.title || ch.label, record: historicalNote(node, ch), battle: r.battle ? { ...r.battle, plan } : null, event });
    setScreen(r.outcome ? "outcome" : event ? "event" : "node");
    if (!r.outcome) setNodeId(r.nextId);
  };

  // The battle rig: a battle opened at its own report, with the meters and the enemy chosen.
  const rigFight = ({ cfg, postureId, meters: m, easy }) => {
    const resolved = resolveNode(cfg.host.node, {}, m, emptyHardState());
    const ch = resolved && resolved.choices.find((x) => x.id === cfg.host.choice);
    if (!ch) return;
    setRigOn(true);
    setRigPosture(postureId);
    setCampaignId(cfg.campaign);
    setFlags({}); setMeters(m); setHardState(emptyHardState()); setRunEasy(easy);
    setTaken([]); setHistory([]); setVisited([cfg.host.node]); setPending(null);
    setRunKey((k) => k + 1);
    setNodeId(cfg.host.node);
    setBattleChoice(ch);
    setScreen("battle");
  };

  const cont = () => {
    if (rigOn) { setRigOn(false); setPending(null); setScreen("rig"); return; }
    // the free demo stops after its last order, whatever comes next
    if (DEMO && taken.length >= DEMO_DECISIONS) { clearSavedRun(); setSavedRun(null); setPending(null); setScreen("demoend"); return; }
    setNodeId(pending?.nextId ?? null);
    if (pending && pending.event) { setScreen("event"); return; }
    setPending(null);
    setScreen("node");
  };

  // Check a belief on the report in hand: one of the file's checks is spent.
  const checkBelief = (itemId) => setFlags((f) => intelCheck(f, nodeId, itemId, hardState.enabled));

  // The event is shown once: its flag goes into the file as the report opens.
  const afterEvent = () => {
    const id = pending.event.id;
    setFlags((f) => ({ ...f, ["ev_" + id]: true }));
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
    () => (node && node.ending ? rankFor({ campaignId, endingId: nodeId, meters, hardState, easy: runEasy, taken, flags }) : null),
    [node, campaignId, nodeId, meters, hardState, runEasy, taken, flags]
  );

  return (
    <div className={`dg-fs-${settings.textSize}`} style={{ display: "contents" }}>
      <style>{css}</style>
      {screen === "menu" && (
        <MenuScreen onPick={(cid) => { setCampaignId(cid); setScreen("briefing"); }} onRecord={() => setScreen("record")} onRig={() => setScreen("rig")} savedRun={savedRun}
          onResume={resume} onDiscard={discard} onSettings={() => openAside("settings")} record={record} />
      )}
      {screen === "briefing" && campaignId && (
        <BriefingScreen key={campaignId} campaignId={campaignId} mode={mode} onMode={setMode} signals={signals} onSignals={setSignals} press={press} onPress={setPress} settings={settings} onSettings={setSettings}
          onEnter={() => start(campaignId)} onBack={home} />
      )}
      {screen === "demoend" && campaignId && <DemoEndScreen campaignId={campaignId} onHome={home} />}
      {screen === "rig" && <BattleRigScreen onFight={rigFight} onBack={home} />}
      {screen === "howto" && <HowToScreen onBack={() => { setScreen(howBack || cameFrom); setHowBack(null); }} />}
      {screen === "settings" && <SettingsScreen settings={settings} onSettings={setSettings} onBack={() => setScreen(cameFrom)} onHowTo={() => { setHowBack("settings"); setScreen("howto"); }} />}
      {screen === "record" && <RecordScreen record={record} onBack={home} />}
      {screen === "outcome" && (
        <OutcomeScreen key={runKey + "-" + nodeId} campaignId={campaignId} node={node} nodeId={nodeId} orderId={taken.length ? taken[taken.length - 1].choice : null} visited={visited} outcome={pending.outcome} headline={pending.headline} historical={pending.historical} record={pending.record} battle={pending.battle}
          changes={pending.changes} contested={pending.contested} informed={pending.informed} meters={meters} flags={flags} onContinue={cont} />
      )}
      {screen === "event" && pending && pending.event && <EventScreen key={pending.event.id} campaignId={campaignId} event={pending.event} onContinue={afterEvent} />}
      {screen === "battle" && battleChoice && (
        <BattleScreen campaignId={campaignId} config={battleOf(battleChoice)} choice={battleChoice} meters={meters} easy={runEasy}
          onCommit={(plan) => { const ch = battleChoice; setBattleChoice(null); choose(ch, plan); }}
          forcePostureId={rigPosture}
          onBack={() => { setBattleChoice(null); setScreen(rigOn ? "rig" : "node"); }} />
      )}
      {screen === "node" && node && (
        <NodeScreen campaignId={campaignId} node={node} meters={meters}
          hardState={hardState} visited={visited} flags={flags} nodeId={nodeId} easy={runEasy} canRewind={history.length > 0}
          rank={rank} mode={runMode} taken={taken} holdToSign={settings.signHold === true} onRewind={rewind} onChoose={pick} onCheck={checkBelief} onHome={home} />
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
