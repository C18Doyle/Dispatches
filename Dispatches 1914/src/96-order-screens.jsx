// =============================================================================
// ORDER SCREENS
// =============================================================================
//
// The pieces that make an order feel like an order: the ledger of meters with the three readings under each, the odds dial on a contested
// order, the button that has to be held to sign it, the sealed cable that comes back, and the list of what the order did.
// Nothing here changes a rule: the readings and the odds are read from the engine (51-meters.jsx, 55-choose.jsx).

const fmtMeter = (v) => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : "0");

/** The three meters as a ledger. Press one to see what it is made of. With `from`, the gauges slide from there to where the meters now stand. */
function MeterLedger({ meters, labels, flags, from }) {
  const [open, setOpen] = useState(null);
  const [shown, setShown] = useState(from || meters);
  useEffect(() => {
    if (!from) { setShown(meters); return undefined; }
    const t = setTimeout(() => setShown(meters), 80);
    return () => clearTimeout(t);
  }, [meters.manpower, meters.munitions, meters.will, from]);
  return (
    <>
      <div className="dg-meters">
        {METER_AXES.map((a) => (
          <div key={a} className={meters[a] < 0 ? "neg" : meters[a] > 0 ? "pos" : ""}>
            <button className="dg-meter-btn" aria-expanded={open === a} aria-controls={"dg-rd-" + a} onClick={() => setOpen(open === a ? null : a)}>
              <b>{meters[a] > 0 ? `+${meters[a]}` : meters[a]}</b>
              <span className="dg-gauge" aria-hidden="true"><i style={{ left: `${(shown[a] + 10) * 5}%` }} /></span>
              {labels[a].toUpperCase()} <span className={"dg-more" + (open === a ? " open" : "")} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      {open && (
        <div id={"dg-rd-" + open} className="dg-readings" role="region" aria-label={`What ${labels[open]} is made of`}>
          <div className="dg-count">{labels[open]}: what it is made of</div>
          {strandReadout(open, flags || {}, meters).map((r) => (
            <div key={r.id} className={"dg-reading lv" + r.level}>
              <span className="n">{r.name}</span>
              <span className="dg-rbar" aria-hidden="true"><i style={{ width: `${(r.level + 1) * 20}%` }} /></span>
              <b>{r.band}</b>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

const DIAL_BANDS = ["#7a2e2e", "#a8683f", "#a39a82", "#78905a", "#3d5a2f"];
function dialPoint(deg, r) {
  const t = (Math.PI * (180 - deg)) / 180;
  return [50 + r * Math.cos(t), 50 - r * Math.sin(t)];
}

/** A half-circle dial for a contested order: the needle at the odds of the better outcome. */
function OddsDial({ odds, easy, fog }) {
  const [nx, ny] = dialPoint(odds.pct * 1.8, 33);
  return (
    <span className="dg-odds">
      <svg className="dg-dial" viewBox="0 0 100 58" aria-hidden="true">
        {DIAL_BANDS.map((col, i) => {
          const [x1, y1] = dialPoint(i * 36 + 1, 40);
          const [x2, y2] = dialPoint((i + 1) * 36 - 1, 40);
          return <path key={i} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} A40 40 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`} stroke={col} strokeWidth="9" fill="none" />;
        })}
        <line x1="50" y1="50" x2={nx.toFixed(1)} y2={ny.toFixed(1)} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="50" cy="50" r="3.4" fill="currentColor" />
      </svg>
      <span className="dg-odds-t">Odds: {odds.word}{easy ? ` (${odds.pct} in 100)` : ""}{fog ? <span className="dg-fogtag">, on the staff's reading</span> : null}</span>
    </span>
  );
}

const HOLD_MS = 900;
const HOLD_TOUCH_MS = 650; // a finger holds less steadily than a mouse button, and has no other signal that it is being held
const HOLD_SLOP = 14; // pixels a pointer may move before it is scrolling and not holding

/**
 * An order. A contested one (`hold`) is signed by holding the button down; a keyboard or assistive press signs it at once (a click with no
 * pointer behind it has detail 0), and the setting can turn the holding off.
 */
function OrderButton({ ch, hold, onSign, onView, children }) {
  const [holding, setHolding] = useState(false);
  const [holdMs, setHoldMs] = useState(HOLD_MS);
  const timer = useRef(null);
  const origin = useRef(null);
  const stop = () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; atmosphereFx("release"); }
    setHolding(false);
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const start = (e) => {
    if (ch.blocked || timer.current) return;
    const ms = e && e.pointerType === "touch" ? HOLD_TOUCH_MS : HOLD_MS;
    origin.current = e ? [e.clientX, e.clientY] : null;
    setHoldMs(ms);
    setHolding(true);
    atmosphereFx("hold");
    timer.current = setTimeout(() => {
      timer.current = null;
      setHolding(false);
      atmosphereFx("release");
      try { if (navigator.vibrate) navigator.vibrate(14); } catch (err) { /* no vibration here */ }
      onSign();
    }, ms);
  };
  const move = (e) => {
    if (!timer.current || !origin.current) return;
    if (Math.hypot(e.clientX - origin.current[0], e.clientY - origin.current[1]) > HOLD_SLOP) stop();
  };
  return (
    <button className={"dg-choice" + (holding ? " holding" : "")} disabled={ch.blocked}
      onFocus={onView ? () => onView(ch.id) : undefined} onBlur={onView ? () => onView(null) : undefined}
      onMouseEnter={onView ? () => onView(ch.id) : undefined} onMouseLeave={onView ? () => onView(null) : undefined}
      onClick={(e) => { if (!hold || e.detail === 0) onSign(); }}
      onPointerDown={hold ? start : undefined} onPointerMove={hold ? move : undefined} onPointerUp={hold ? stop : undefined} onPointerLeave={hold ? stop : undefined} onPointerCancel={hold ? stop : undefined}
      onContextMenu={hold ? (e) => e.preventDefault() : undefined}
      style={hold ? { touchAction: "pan-y", WebkitTouchCallout: "none", userSelect: "none" } : undefined}>
      {children}
      {hold && !ch.blocked && <span className="dg-holdhint">Hold to sign</span>}
      {hold && <span className="dg-holdbar" aria-hidden="true" style={{ animationDuration: holdMs + "ms" }} />}
    </button>
  );
}

/** The cable that carries the result of a contested order: sealed until the player breaks the seal. */
function SealedCable({ onOpen }) {
  return (
    <section className="dg-cable" aria-label="A sealed cable">
      <p className="dg-prose">A cable has come in from the front, and it is sealed. What it says settles the order.</p>
      <button className="dg-btn" onClick={onOpen}>Break the seal</button>
    </section>
  );
}

/** What the order did to each meter, and to which reading of it. */
function MeterChanges({ changes, labels }) {
  if (!changes || !changes.length) return null;
  return (
    <ul className="dg-changes" aria-label="What the order cost">
      {changes.map((c) => (
        <li key={c.axis} className={c.delta < 0 ? "neg" : "pos"}>
          <b>{fmtMeter(c.delta)}</b> {labels[c.axis]}: {c.strand.name}{c.strand.before !== c.strand.after ? ` (${c.strand.before} to ${c.strand.after})` : ` (${c.strand.after})`}
        </li>
      ))}
    </ul>
  );
}
