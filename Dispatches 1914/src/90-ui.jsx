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

const THEME = {
  paper: "#f4efe2",
  paperRaised: "#e9e2cf",
  ink: "#1c1a17",
  inkSoft: "#5d574c",
  rule: "#1c1a17",
  accent: "#7a2e2e",
  inverse: "#0d0c0b",
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"SFMono-Regular", Menlo, Consolas, "Courier New", monospace',
};

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/** IV.1940 — the series' date treatment. */
function romanDate(iso) {
  if (!iso) return "";
  const [y, m] = iso.split("-");
  return `${ROMAN[Number(m)]}.${y}`;
}

const css = `
  .dg-root{background:${THEME.paper};color:${THEME.ink};font-family:${THEME.mono};
    min-height:100%;padding:20px 18px 48px;box-sizing:border-box;line-height:1.6}
  .dg-root button:focus-visible,.dg-root summary:focus-visible{outline:3px solid ${THEME.accent};outline-offset:2px}
  .dg-filerow{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.22em;
    color:${THEME.inkSoft};text-transform:uppercase}
  .dg-filerow .r{color:${THEME.accent}}
  .dg-title{font-family:${THEME.serif};font-weight:700;font-size:44px;line-height:1.02;
    margin:14px 0 18px;letter-spacing:-.01em}
  .dg-rule{border:0;border-top:1.5px solid ${THEME.rule};margin:0 0 22px}
  .dg-sect{font-size:11px;letter-spacing:.22em;color:${THEME.accent};text-transform:uppercase;
    margin:26px 0 12px;font-weight:400}
  .dg-card{position:relative;border:1.5px solid ${THEME.rule};background:${THEME.paperRaised};
    padding:20px 18px;margin-bottom:14px;cursor:pointer;width:100%;text-align:left;
    font:inherit;color:inherit;display:block;box-sizing:border-box}
  .dg-card:hover{background:${THEME.ink};color:${THEME.paper}}
  .dg-card h3{font-family:${THEME.serif};font-size:23px;font-weight:700;margin:0 0 6px;line-height:1.2}
  .dg-card p{margin:0;font-size:13px;color:${THEME.inkSoft}}
  .dg-card:hover p{color:${THEME.paperRaised}}
  .dg-stamp{position:absolute;top:-12px;right:14px;transform:rotate(-3deg);
    border:2px solid ${THEME.accent};color:${THEME.accent};background:${THEME.paper};
    font-size:11px;letter-spacing:.18em;padding:4px 9px}
  .dg-dash{border:0;border-top:4px dashed ${THEME.accent};margin:28px 0 20px}
  .dg-btn{border:1.5px solid ${THEME.rule};background:none;font:inherit;color:inherit;
    padding:8px 12px;font-size:11px;letter-spacing:.14em;cursor:pointer;text-transform:uppercase}
  .dg-btn:hover{background:${THEME.ink};color:${THEME.paper}}
  .dg-docrow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;
    font-size:13px;letter-spacing:.16em;font-weight:700;margin:18px 0 16px}
  .dg-timeline{display:flex;justify-content:space-between;border-top:1.5px solid ${THEME.rule};
    padding-top:6px;font-size:11px;letter-spacing:.1em;margin-bottom:18px}
  .dg-timeline span.on{color:${THEME.accent};font-weight:700}
  .dg-node-date{font-size:13px;letter-spacing:.2em;margin-bottom:6px}
  .dg-node-title{font-family:${THEME.serif};font-size:34px;font-weight:700;line-height:1.08;margin:0 0 18px}
  .dg-prose{white-space:pre-wrap;font-size:15px;margin-bottom:18px}
  .dg-order{font-size:12px;letter-spacing:.22em;font-weight:700;margin:24px 0 12px}
  .dg-choice{width:100%;text-align:left;font:inherit;color:inherit;cursor:pointer;
    border:1.5px solid ${THEME.accent};background:none;padding:16px;margin-bottom:12px;display:block}
  .dg-choice:hover:not(:disabled){background:${THEME.inverse};color:${THEME.paper}}
  .dg-choice:disabled{cursor:not-allowed;opacity:.45}
  .dg-choice .lab{font-size:15px;margin-bottom:8px}
  .dg-quote{font-style:italic;font-size:13px;color:${THEME.inkSoft}}
  .dg-root summary{list-style:none}
  .dg-root summary::-webkit-details-marker{display:none}
  .dg-map{display:block;width:100%;height:auto;border:1.5px solid ${THEME.rule};background:${THEME.paper};margin:10px 0 18px}
  .dg-attested{font-size:13px;margin-top:8px;color:${THEME.inkSoft}}
  .dg-attested cite{font-style:normal;font-size:12px}
  .dg-attested-tag{display:inline-block;border:1px solid currentColor;font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:1px 5px}
  .dg-choice:hover:not(:disabled) .dg-quote,.dg-choice:hover:not(:disabled) .dg-attested{color:${THEME.paperRaised}}
  .dg-cost{display:inline-block;border:1px solid currentColor;font-size:10px;
    letter-spacing:.14em;padding:3px 7px;margin-bottom:8px}
  .dg-meters{display:flex;gap:14px;border:1.5px solid ${THEME.rule};padding:12px;
    margin-bottom:18px;font-size:11px;letter-spacing:.1em}
  .dg-meters div{flex:1}
  .dg-meters b{display:block;font-size:18px;font-family:${THEME.serif}}
  .dg-hard{border:1.5px solid ${THEME.accent};color:${THEME.accent};padding:12px;
    font-size:12px;letter-spacing:.14em;margin-bottom:18px}
  .dg-draft{border:1.5px dashed ${THEME.accent};color:${THEME.accent};padding:10px;
    font-size:11px;letter-spacing:.12em;margin-bottom:18px}
  .dg-badge{display:inline-block;border:2px solid ${THEME.accent};color:${THEME.accent};text-transform:uppercase;
    font-size:10px;font-weight:700;letter-spacing:.2em;padding:5px 10px;margin-bottom:14px;transform:rotate(-1.5deg);
    box-shadow:inset 0 0 0 2px ${THEME.paper},inset 0 0 0 3px ${THEME.accent}}
  .dg-badge-contested{border-style:double;border-width:4px;box-shadow:none}
  .dg-badge-speculative{border-style:dashed}
  .dg-root h1:focus{outline:none}
  .dg-note-box{border:1.5px solid ${THEME.rule};padding:12px;margin:14px 0}
  .dg-note-box textarea{width:100%;box-sizing:border-box;font:inherit;font-size:12px;min-height:110px;background:${THEME.paperRaised};color:${THEME.ink};border:1px solid ${THEME.rule}}
  .dg-note-box a{color:${THEME.accent}}
  .dg-bulletin{border-top:1px solid ${THEME.rule};border-bottom:1px solid ${THEME.rule};
    padding:12px 0;margin-bottom:18px;font-size:13px}
  .dg-bulletin .h{font-size:10px;letter-spacing:.2em;color:${THEME.accent};margin-bottom:6px}
  details summary{cursor:pointer;border:1.5px solid ${THEME.rule};padding:10px 12px;
    font-size:12px;letter-spacing:.16em;margin-bottom:16px}
  .dg-banner{border:1.5px solid ${THEME.accent};padding:14px;margin:0 0 18px}
  .dg-banner p{margin:0 0 10px;font-size:13px}
  .dg-banner .small{font-size:12px;color:${THEME.inkSoft}}
  .dg-seg{display:flex;margin:0 0 10px}
  .dg-seg button{flex:1;border:1.5px solid ${THEME.rule};background:none;font:inherit;color:inherit;
    padding:10px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer}
  .dg-seg button+button{border-left:0}
  .dg-seg button[aria-pressed="true"]{background:${THEME.ink};color:${THEME.paper}}
  .dg-note{font-size:12px;color:${THEME.inkSoft};margin:0 0 14px}
  .dg-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 18px}
  .dg-tabs button[aria-pressed="true"]{background:${THEME.ink};color:${THEME.paper}}
  .dg-entry{border-top:1px solid ${THEME.rule};padding:10px 0;font-size:13px}
  .dg-entry .t{font-family:${THEME.serif};font-size:17px;font-weight:700}
  .dg-entry.locked{color:${THEME.inkSoft}}
  .dg-entry .meta{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${THEME.inkSoft}}
  .dg-count{font-size:11px;letter-spacing:.14em;color:${THEME.inkSoft};margin:0 0 6px}
  .dg-term{background:none;border:0;border-bottom:1px dotted currentColor;font:inherit;color:inherit;cursor:pointer;padding:0;margin:0}
  .dg-defn{display:block;border-left:3px solid ${THEME.accent};padding:4px 0 4px 10px;margin:8px 0 14px;font-size:13px;color:${THEME.inkSoft}}
  .dg-preview{display:inline-block;border:1px solid currentColor;font-size:11px;letter-spacing:.08em;padding:3px 7px;margin:0 6px 8px 0}
  .dg-record-mark{display:inline-block;border:1px solid ${THEME.accent};color:${THEME.accent};font-size:10px;letter-spacing:.14em;text-transform:uppercase;padding:2px 6px;margin:0 6px 8px 0}
  .dg-choice:hover:not(:disabled) .dg-record-mark{color:${THEME.paperRaised};border-color:${THEME.paperRaised}}
  .dg-strain{display:block;font-size:12px;color:${THEME.accent};margin:0 0 8px;font-weight:700}
  .dg-choice:hover:not(:disabled) .dg-strain{color:${THEME.paperRaised}}
  .dg-rank{border:1.5px solid ${THEME.rule};padding:14px;margin:18px 0}
  .dg-rank h2{font-family:${THEME.serif};font-size:26px;margin:0 0 4px}
  .dg-rank ul{list-style:none;margin:10px 0 0;padding:0;font-size:12px}
  .dg-rank li{display:flex;justify-content:space-between;gap:10px;border-top:1px solid ${THEME.rule};padding:6px 0}
  .dg-rank li span.n{color:${THEME.inkSoft}}
  .dg-fs-m .dg-prose,.dg-fs-m .dg-choice .lab{font-size:17px}
  .dg-fs-m .dg-bulletin,.dg-fs-m .dg-quote,.dg-fs-m .dg-entry,.dg-fs-m .dg-banner p{font-size:15px}
  .dg-fs-l .dg-prose,.dg-fs-l .dg-choice .lab{font-size:19px}
  .dg-fs-l .dg-bulletin,.dg-fs-l .dg-quote,.dg-fs-l .dg-entry,.dg-fs-l .dg-banner p{font-size:17px}
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
    <main className="dg-root">
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
        <div key={a}>
          <b>{meters[a] > 0 ? `+${meters[a]}` : meters[a]}</b>
          {labels[a].toUpperCase()}
        </div>
      ))}
    </div>
  );
}

/** Where the headquarters sits, on the campaign's own stretch of Europe, with the route taken so far. */
function FrontMap({ campaignId, node, visited }) {
  const camp = CAMPAIGNS[campaignId];
  const cities = [...new Set(Object.values(camp.nodes).map((n) => n.city))].filter((c) => MAP_CITIES[c]);
  if (!cities.length || !MAP_CITIES[node.city]) return null;
  const trail = visited.map((id) => camp.nodes[id] && camp.nodes[id].city).filter((c, i, a) => MAP_CITIES[c] && c !== a[i - 1]);
  // Frame the last few headquarters, not the whole campaign, so the western front is readable.
  const focus = [...new Set([...trail.slice(-6), node.city])];
  const xs = focus.map((c) => MAP_CITIES[c][0]);
  const ys = focus.map((c) => MAP_CITIES[c][1]);
  const pad = 26;
  let x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad;
  let w = Math.max(...xs) + pad - x0, h = Math.max(...ys) + pad - y0;
  const aspect = MAP_VIEW.width / MAP_VIEW.height;
  const minW = 150;
  if (w < minW) { x0 -= (minW - w) / 2; w = minW; }
  if (w / h < aspect) { const nw = h * aspect; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / aspect; y0 -= (nh - h) / 2; h = nh; }
  const s = w / MAP_VIEW.width;
  // Only the places the file has been to: later headquarters are not given away.
  const shown = [...new Set([...trail, node.city])];
  const [hx, hy] = MAP_CITIES[node.city];
  return (
    <svg className="dg-map" viewBox={`${x0} ${y0} ${w} ${h}`} role="img" aria-label={`Map of the front. The headquarters is at ${node.city}.`}>
      <path d={MAP_LAND_PATH} fill={THEME.paperRaised} stroke={THEME.inkSoft} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
      {trail.length > 1 && (
        <polyline points={trail.map((c) => MAP_CITIES[c].join(",")).join(" ")} fill="none" stroke={THEME.accent}
          strokeWidth="1.4" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
      )}
      {shown.map((c) => (
        <circle key={c} cx={MAP_CITIES[c][0]} cy={MAP_CITIES[c][1]} r={3.4 * s}
          fill={trail.includes(c) ? THEME.accent : THEME.inkSoft} opacity={trail.includes(c) ? 1 : 0.55} />
      ))}
      {shown.filter((c) => c !== node.city && MAP_CITIES[c][0] > x0 && MAP_CITIES[c][0] < x0 + w && MAP_CITIES[c][1] > y0 && MAP_CITIES[c][1] < y0 + h).map((c) => (
        <text key={"l" + c} x={MAP_CITIES[c][0] + 5 * s} y={MAP_CITIES[c][1] + 4 * s} fontSize={11 * s} fill={THEME.inkSoft} stroke={THEME.paperRaised}
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
    <main className="dg-root">
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
      {node.city && MAP_CITIES[node.city] && (
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

function OutcomeScreen({ campaignId, outcome, record, onContinue }) {
  const c = CAMPAIGNS[campaignId];
  const [outcomeSegs, recordSegs] = useMemo(() => markFirstMentions([outcome, record && record.text]), [outcome, record]);
  return (
    <main className="dg-root">
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
    <main className="dg-root">
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
    setPending(s.pendingOutcome ? { nextId: s.pendingNextId, outcome: s.pendingOutcome, record: s.pendingRecord ?? null } : null);
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

  const choose = (ch) => {
    if (settings.sound) playSound("tick");
    const r = chooseNext(campaignId, ch, flags, meters, hardState);
    if (runEasy) setHistory((h) => [...h, { nodeId, flags, meters, hardState, visited, taken }].slice(-REWIND_LIMIT));
    setTaken((t) => [...t, { node: nodeId, choice: ch.id }]);
    setFlags(r.flags); setMeters(r.meters); setHardState(r.hardState);
    setRecord((rec) => noteEchoes(rec, r.flags));
    setPending({ ...r, record: historicalNote(node, ch) });
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
        <OutcomeScreen campaignId={campaignId} outcome={pending.outcome} record={pending.record} onContinue={cont} />
      )}
      {screen === "node" && node && (
        <NodeScreen campaignId={campaignId} node={node} meters={meters}
          hardState={hardState} visited={visited} flags={flags} nodeId={nodeId} easy={runEasy} canRewind={history.length > 0}
          rank={rank} mode={runMode} onRewind={rewind} onChoose={choose} onHome={home} />
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
