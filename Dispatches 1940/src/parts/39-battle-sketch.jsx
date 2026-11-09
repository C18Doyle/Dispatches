const BS_STATUS_WORD = { gaining: T("Gaining"), holding: T("Holding"), breaking: T("Breaking") };
// THE SKETCH OF THE GROUND (1914's sketch of the ground, for the Order of Battle of 1940)
//
// One sector for each arm of the battle, left to right, the enemy above and our own side below, and the line between them. In the plan it is a straight line and
// each sector can be pressed to put a counter in it (a counter is pressed to take it out; the buttons under each arm do the same for a keyboard or a screen reader,
// so the sketch is only drawn). On the day each sector's part of the line is pushed forward, left where it is or pushed back as the dispatches say, so the report
// shows where the battle is going arm by arm and not only in the one bar. Nothing is rolled here: the status of an arm is read off what it contributes to the plan
// (computeBattleContributions) and, once they have come in, the reserve, the counterattack and the verdict, so the sketch and the result never disagree.

const BS_OFFSET = { gaining: -24, holding: 0, breaking: 24 };

/** The status of one arm from what it contributes, against the average of the arms that contribute: gaining, holding or breaking. */
function battleArmStatus(contribution, meanPositive) {
  return contribution > 0 ? (contribution >= meanPositive ? "gaining" : "holding") : "breaking";
}

/** The average contribution of the arms that contribute at all (1 when none does). */
function battleMeanPositive(categories, contributions) {
  const positive = categories.map((c) => contributions[c.id] || 0).filter((v) => v > 0);
  return positive.length ? positive.reduce((a, b) => a + b, 0) / positive.length : 1;
}

/**
 * The status of each arm that the report has reached: { armId: status } (an arm not yet reported is left out and its part of the line stays straight).
 * The plan's contribution at the arm's own dispatch, the final one once the reserve has gone in, the counterattack's result for the arm it fell on, and
 * at the verdict a won battle lifts the arms that held and a lost one lowers every arm a step.
 */
function battleArmStatuses({ categories, planContrib, finalContrib, beats, shownIndex, counter, counterCategory, done, won }) {
  const mean = battleMeanPositive(categories, planContrib);
  const reserveShown = beats.some((b, i) => b.kind === "reserve" && i <= shownIndex);
  const contrib = reserveShown ? finalContrib : planContrib;
  const out = {};
  beats.forEach((b, i) => {
    if (b.kind === "cat" && i <= shownIndex) out[b.catId] = battleArmStatus(contrib[b.catId] || 0, mean);
  });
  const counterShown = beats.some((b, i) => b.kind === "counter" && i <= shownIndex);
  if (counterShown && counter && counterCategory) out[counterCategory] = counter.result === "repulsed" ? "gaining" : counter.result === "heldAtCost" ? "holding" : "breaking";
  if (done) {
    for (const c of categories) {
      const s = out[c.id];
      if (!s) continue;
      out[c.id] = won ? (s === "holding" && (contrib[c.id] || 0) > 0 ? "gaining" : s) : s === "gaining" ? "holding" : s === "holding" ? "breaking" : s;
    }
  }
  return out;
}

/** An arm's name cut to what fits under its sector: whole words, with an ellipsis when some are left out. */
function battleArmLabel(name, chars) {
  const words = String(name).replace(/&/g, "and").split(/\s+/);
  let out = "";
  for (const w of words) {
    if ((out + " " + w).trim().length > chars) return out ? out + "\u2026" : w.slice(0, chars - 1) + "\u2026";
    out = (out + " " + w).trim();
  }
  return out;
}

/** The sketch. `allocation` puts the counters in; `status` is { armId: status } and moves the line; onAdd and onRemove make the sectors and the counters pressable. */
function BattleSketch({ categories, allocation, status, accent, onAdd, onRemove, small }) {
  const hatch = "bs-hatch-" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const n = categories.length;
  const W = 320;
  const H = 160;
  const w = W / n;
  const mid = 74;
  const ys = categories.map((c) => mid + (status && status[c.id] ? BS_OFFSET[status[c.id]] : 0));
  const edge = (i) => (i === 0 ? ys[0] : i === n ? ys[n - 1] : (ys[i - 1] + ys[i]) / 2);
  let d = "M 0 " + edge(0);
  categories.forEach((c, i) => {
    d += " L " + (i * w + 10) + " " + ys[i] + " L " + ((i + 1) * w - 10) + " " + ys[i] + " L " + (i + 1) * w + " " + edge(i + 1);
  });
  const cols = Math.max(2, Math.floor((w - 14) / 17));
  const summary = categories.map((c) => c.name + ": " + (status && status[c.id] ? t(BS_STATUS_WORD[status[c.id]]).toLowerCase() : t("{n} placed", { n: allocation[c.id] || 0 }))).join("; ");
  const ink = accent || "#7a2e2e";
  const sector = (s) => (s === "gaining" ? "#d9e3d2" : s === "breaking" ? "#ecd2cc" : "#f2ead9");
  const mono = { fontFamily: "'IBM Plex Mono', monospace" };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full block border-2 border-black" style={{ background: "#f2ead9" }} role="img" aria-label={t("Sketch of the line. {summary}", { summary })}>
      <defs>
        <pattern id={hatch} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#5a2a2a" strokeWidth="1.4" />
        </pattern>
      </defs>
      {categories.map((c, i) => (
        <g key={c.id}>
          <rect x={i * w} y="0" width={w} height={H} fill={sector(status && status[c.id])} />
          <rect x={i * w} y="0" width={w} height={ys[i]} fill={`url(#${hatch})`} opacity="0.35" />
          {i > 0 && <line x1={i * w} y1="0" x2={i * w} y2={H} stroke="#241d12" strokeOpacity="0.35" strokeDasharray="3,3" />}
          {onAdd && <rect x={i * w} y="0" width={w} height={H} fill="transparent" style={{ cursor: "pointer" }} onClick={() => onAdd(c.id)} />}
        </g>
      ))}
      <path d={d} fill="none" stroke="#f2ead9" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" style={{ pointerEvents: "none" }} />
      <path d={d} fill="none" stroke="#1a1410" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" style={{ pointerEvents: "none" }} />
      {categories.map((c, i) =>
        Array.from({ length: allocation[c.id] || 0 }, (_, j) => (
          <rect
            key={c.id + j}
            x={i * w + 8 + (j % cols) * 17}
            y={ys[i] + 12 + Math.floor(j / cols) * 16}
            width="13"
            height="11"
            fill={ink}
            stroke="#f2ead9"
            strokeWidth="1"
            style={onRemove ? { cursor: "pointer" } : { pointerEvents: "none" }}
            onClick={onRemove ? (e) => { e.stopPropagation(); onRemove(c.id); } : undefined}
          />
        ))
      )}
      {categories.map((c, i) => (
        <text key={"n" + c.id} x={i * w + 5} y={H - 6} fontSize="7.5" fill="#241d12" style={{ ...mono, pointerEvents: "none" }}>
          {i + 1} {battleArmLabel(c.name, Math.floor((w - 8) / 4.5) - 2)}
        </text>
      ))}
      <text x="6" y="12" fontSize="8.5" fill="#5a2a2a" style={{ ...mono, pointerEvents: "none" }}>{t("ENEMY")}</text>
      <text x="6" y={H - 18} fontSize="8.5" fill="#241d12" style={{ ...mono, pointerEvents: "none" }}>{t("OURS")}</text>
    </svg>
  );
}
