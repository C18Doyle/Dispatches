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

import React, { useState, useMemo } from "react";

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
  .dg-filerow{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.22em;
    color:${THEME.inkSoft};text-transform:uppercase}
  .dg-filerow .r{color:${THEME.accent}}
  .dg-title{font-family:${THEME.serif};font-weight:700;font-size:44px;line-height:1.02;
    margin:14px 0 18px;letter-spacing:-.01em}
  .dg-rule{border:0;border-top:1.5px solid ${THEME.rule};margin:0 0 22px}
  .dg-sect{font-size:11px;letter-spacing:.22em;color:${THEME.accent};text-transform:uppercase;
    margin:26px 0 12px}
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
  .dg-choice:hover:not(:disabled) .dg-quote{color:${THEME.paperRaised}}
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
  .dg-badge{display:inline-block;border:1.5px solid ${THEME.accent};color:${THEME.accent};
    font-size:10px;letter-spacing:.18em;padding:4px 8px;margin-bottom:14px}
  .dg-bulletin{border-top:1px solid ${THEME.rule};border-bottom:1px solid ${THEME.rule};
    padding:12px 0;margin-bottom:18px;font-size:13px}
  .dg-bulletin .h{font-size:10px;letter-spacing:.2em;color:${THEME.accent};margin-bottom:6px}
  details summary{cursor:pointer;border:1.5px solid ${THEME.rule};padding:10px 12px;
    font-size:12px;letter-spacing:.16em;margin-bottom:16px}
`;

function Stamp({ children }) {
  return <span className="dg-stamp">{children}</span>;
}

function MenuScreen({ onPick }) {
  const majors = CAMPAIGN_IDS.filter((c) => CAMPAIGNS[c].tier === TIERS.MAJOR);
  const minors = CAMPAIGN_IDS.filter((c) => CAMPAIGNS[c].tier === TIERS.MINOR);
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
      </button>
    );
  };
  return (
    <div className="dg-root">
      <div className="dg-filerow"><span>File No. 1914</span><span className="r">Restricted</span></div>
      <h1 className="dg-title">DISPATCHES<br />1914</h1>
      <hr className="dg-rule" />
      <div className="dg-sect">Major Commands</div>
      {majors.map(card)}
      <div className="dg-sect">Minor Commands</div>
      {minors.map(card)}
      <hr className="dg-dash" />
      <div className="dg-card" style={{ cursor: "default" }}>
        ▶ WAR RECORD — DOSSIERS, ATLAS, ENDINGS GALLERY
        <p style={{ marginTop: 8 }}>{nodeTotal()} nodes · {buildEndings().length} endings written</p>
      </div>
    </div>
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

function NodeScreen({ campaignId, node, meters, hardState, onChoose, onHome }) {
  const c = CAMPAIGNS[campaignId];
  const years = [1914, 1915, 1916, 1917, 1918];
  return (
    <div className="dg-root">
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
      <h2 className="dg-node-title">{node.title}</h2>
      <div className="dg-prose">{node.situation}</div>

      {node.context && (
        <details>
          <summary>▶ SHOW BACKGROUND</summary>
          <div className="dg-prose">{node.context}</div>
        </details>
      )}

      {node.ending ? (
        <>
          <div className="dg-badge">{BADGE_LABELS[node.ending.badge]}</div>
          {node.epilogue && <div className="dg-prose">{node.epilogue}</div>}
          <button className="dg-btn" onClick={onHome}>Return to file</button>
        </>
      ) : (
        <>
          <div className="dg-order">Issue Order</div>
          {node.choices.map((ch) => (
            <button key={ch.id} className="dg-choice" disabled={ch.blocked}
              onClick={() => onChoose(ch)}>
              <div className="lab">{ch.label}</div>
              {ch.blocked && <div className="dg-cost">✕ {ch.disabledReason}</div>}
              {ch.erodes && hardState.enabled && <div className="dg-cost">✕ Costs standing</div>}
              {ch.advisor && (
                <div className="dg-quote">
                  {ch.advisor.name} argues: {ch.advisor.position}
                </div>
              )}
            </button>
          ))}
        </>
      )}
    </div>
  );
}

function OutcomeScreen({ campaignId, outcome, onContinue }) {
  const c = CAMPAIGNS[campaignId];
  return (
    <div className="dg-root">
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <div className="dg-docrow"><span>{c.docLabel} · OUTCOME</span></div>
      <hr className="dg-rule" />
      <div className="dg-prose">{outcome}</div>
      <button className="dg-btn" onClick={onContinue}>Continue</button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [campaignId, setCampaignId] = useState(null);
  const [nodeId, setNodeId] = useState(null);
  const [flags, setFlags] = useState({});
  const [meters, setMeters] = useState(emptyMeters());
  const [hardState, setHardState] = useState(emptyHardState());
  const [pending, setPending] = useState(null);

  const node = useMemo(
    () => (nodeId ? resolveNode(nodeId, flags, meters, hardState) : null),
    [nodeId, flags, meters, hardState]
  );

  const start = (cid) => {
    setCampaignId(cid);
    setFlags({});
    setMeters(emptyMeters());
    setHardState(emptyHardState());
    setNodeId(CAMPAIGNS[cid].startNode);
    setScreen("node");
  };

  const home = () => { setScreen("menu"); setNodeId(null); setCampaignId(null); };

  const choose = (ch) => {
    const r = chooseNext(campaignId, ch, flags, meters, hardState);
    setFlags(r.flags); setMeters(r.meters); setHardState(r.hardState);
    setPending(r);
    setScreen(r.outcome ? "outcome" : "node");
    if (!r.outcome) setNodeId(r.nextId);
  };

  const cont = () => {
    setNodeId(pending?.nextId ?? null);
    setPending(null);
    setScreen("node");
  };

  return (
    <>
      <style>{css}</style>
      {screen === "menu" && <MenuScreen onPick={start} />}
      {screen === "outcome" && (
        <OutcomeScreen campaignId={campaignId} outcome={pending.outcome} onContinue={cont} />
      )}
      {screen === "node" && node && (
        <NodeScreen campaignId={campaignId} node={node} meters={meters}
          hardState={hardState} onChoose={choose} onHome={home} />
      )}
      {screen === "node" && !node && (
        <div className="dg-root">
          <div className="dg-draft">
            Node "{String(nodeId)}" does not resolve. This is a routing bug, not a dead end by design.
          </div>
          <button className="dg-btn" onClick={home}>Home</button>
        </div>
      )}
    </>
  );
}
