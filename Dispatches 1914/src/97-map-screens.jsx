// =============================================================================
// MAP SCREENS
// =============================================================================
//
// The front map: always on the report, small, and drawn for the date of the report: the countries coloured by side, the ground that changed
// hands, the front as a moving dashed line, the headquarters pulsing, the places already visited, and a pin for what each other command was
// doing (the "meanwhile"). Pressing Expand opens the whole theatre with a key and the list of what the others were doing. The data and the
// rules for what is drawn on a date are in 41-map-history.jsx; the lines are approximate and the map says so.

const SIDE_NAMES = { cp: "Central Powers", ent: "Entente", neu: "Neutral or independent" };

function projectFor(view) {
  return ([lon, lat]) => [((lon - view.lon[0]) / (view.lon[1] - view.lon[0])) * view.width, ((view.lat[1] - lat) / (view.lat[1] - view.lat[0])) * view.height];
}

const OP_TONES = ["focus", "cand", "done", "past"];

/** A place held or taken beyond the record (a ring and a plus) or lost or not taken against it (a square and a cross), drawn at its place. */
function GroundMark({ g, p, s, label, big }) {
  const r = (big ? 11 : 7) * s;
  const k = r * 0.5;
  return (
    <g className={"dg-ground dg-ground-" + g.kind} transform={`translate(${p[0]} ${p[1]})`}>
      {g.kind === "gained" ? <circle r={r} /> : <rect x={-r} y={-r} width={2 * r} height={2 * r} />}
      {g.kind === "gained" ? <path d={`M${-k} 0H${k}M0 ${-k}V${k}`} /> : <path d={`M${-k} ${-k}L${k} ${k}M${-k} ${k}L${k} ${-k}`} />}
      {label && <text x={r + 3 * s} y={4 * s} fontSize={(big ? 13 : 10.5) * s} className="dg-maplabel">{g.name}</text>}
    </g>
  );
}

/** One arrow or marker of an order, drawn in a tone: the order in view, the other orders, the order given, an order given earlier. */
function OpMark({ a, tone, pt, s, uid }) {
  if (a.kind === "hold") {
    const p = pt(a.at);
    if (!p) return null;
    return (
      <g className={"dg-op dg-op-hold dg-op-" + tone}>
        <circle cx={p[0]} cy={p[1]} r={8 * s} strokeWidth={(tone === "focus" ? 3.6 : 2.6) * s} />
        <rect x={p[0] - 3 * s} y={p[1] - 3 * s} width={6 * s} height={6 * s} />
      </g>
    );
  }
  const f = pt(a.from);
  const t = pt(a.to);
  if (!f || !t) return null;
  const open = a.kind === "withdraw";
  // a short move is drawn long enough to be read: the arrow keeps its direction and starts at its place
  const dx = t[0] - f[0];
  const dy = t[1] - f[1];
  const len = Math.hypot(dx, dy);
  const min = 30 * s;
  const to = len > 0 && len < min ? [f[0] + (dx * min) / len, f[1] + (dy * min) / len] : t;
  return (
    <line x1={f[0]} y1={f[1]} x2={to[0]} y2={to[1]} className={"dg-op dg-op-" + a.kind + " dg-op-" + tone} strokeWidth={(tone === "focus" ? 4.6 : 3.2) * s}
      strokeDasharray={a.kind === "attack" ? undefined : `${6 * s} ${3.5 * s}`} markerEnd={`url(#${uid}-${open ? "o" : "s"}-${tone})`} />
  );
}

/** The map as an SVG. `full` shows the whole theatre; otherwise the view is framed on the recent headquarters. `ops` is { candidates, focus, past, executed }: the orders drawn. */
function MapCanvas({ campaignId, node, visited, full, pins, ops, ground }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const camp = CAMPAIGNS[campaignId];
  const map = mapFor(campaignId);
  const { view, cities: XY, land, countries } = map;
  const proj = projectFor(view);
  const date = mapDate(campaignId, node.date);
  const overlays = activeOverlays(map.id, date);
  const sideOf = (name) => sideOfCountry(name, date);
  const trail = (visited || []).map((id) => camp.nodes[id] && camp.nodes[id].city).filter((c, i, a) => XY[c] && c !== a[i - 1]);
  const shown = [...new Set([...trail, node.city])];
  const [hx, hy] = XY[node.city];
  const pt = (p) => (Array.isArray(p) ? proj(p) : XY[p]);
  const arrowPts = (arrows) => (arrows || []).flatMap((a) => (a.kind === "hold" ? [pt(a.at)] : [pt(a.from), pt(a.to)])).filter(Boolean);
  const frameExtra = [...(ops && ops.candidates ? Object.values(ops.candidates).flatMap(arrowPts) : []), ...arrowPts(ops && ops.executed)];

  // the frame: the whole theatre, or the last few headquarters with room around them, at the shape of the card
  let box = { x: 0, y: 0, w: view.width, h: view.height };
  if (!full) {
    const focus = [...new Set([...trail.slice(-5), node.city])].map((c) => XY[c]).concat(frameExtra);
    const xs = focus.map((p) => p[0]);
    const ys = focus.map((p) => p[1]);
    const pad = 52;
    let w = Math.max(Math.max(...xs) - Math.min(...xs) + pad * 2, 230);
    let h = Math.max(Math.max(...ys) - Math.min(...ys) + pad * 2, 115);
    const aspect = 2.1;
    if (w / h < aspect) w = h * aspect; else h = w / aspect;
    w = Math.min(w, view.width);
    h = Math.min(h, view.height);
    let x = (Math.min(...xs) + Math.max(...xs)) / 2 - w / 2;
    let y = (Math.min(...ys) + Math.max(...ys)) / 2 - h / 2;
    x = Math.max(0, Math.min(view.width - w, x));
    y = Math.max(0, Math.min(view.height - h, y));
    box = { x, y, w, h };
  }
  const s = box.w / view.width;
  const pts = (line) => line.map((p) => proj(p).map((v) => v.toFixed(1)).join(",")).join(" ");
  const inBox = ([x, y]) => x > box.x && x < box.x + box.w && y > box.y && y < box.y + box.h;
  const mask = (o) => countries.filter((c) => o.mask.includes(c.id)).map((c) => c.d).join("");
  return (
    <svg className="dg-map" viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} role="img"
      aria-label={`Map of the front on ${nodeDate(campaignId, node.date)}. The headquarters is at ${node.city}.`}>
      <defs>
        {overlays.map((o) => <clipPath key={o.id} id={`${uid}-${o.id}`}><path d={mask(o)} /></clipPath>)}
        {OP_TONES.map((tone) => (
          <React.Fragment key={tone}>
            <marker id={`${uid}-s-${tone}`} className={"dg-mk dg-mk-" + tone} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="currentColor" /></marker>
            <marker id={`${uid}-o-${tone}`} className={"dg-mk dg-mk-" + tone} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke="currentColor" strokeWidth="1.8" /></marker>
          </React.Fragment>
        ))}
      </defs>
      <rect x="0" y="0" width={view.width} height={view.height} className="dg-sea" />
      {countries.map((c) => <path key={c.id} d={c.d} className={"dg-country dg-side-" + sideOf(c.id)} />)}
      {overlays.map((o) => (
        <polygon key={o.id} points={pts(o.poly)} clipPath={`url(#${uid}-${o.id})`} className={"dg-occupied dg-side-" + o.side} />
      ))}
      <path d={land} className="dg-coast" />
      {overlays.filter((o) => o.line).map((o) => (
        <g key={"f" + o.id}>
          <polyline points={pts(o.line)} className="dg-front-glow" />
          <polyline points={pts(o.line)} className="dg-front" />
        </g>
      ))}
      {trail.length > 1 && <polyline points={trail.map((c) => XY[c].join(",")).join(" ")} className="dg-trail" />}
      {ops && (
        <g className="dg-ops" aria-hidden="true">
          {(ops.past || []).map((a, i) => <OpMark key={"p" + i} a={a} tone="past" pt={pt} s={s} uid={uid} />)}
          {ops.candidates && Object.entries(ops.candidates).filter(([id]) => id !== ops.focus).flatMap(([id, arrows]) => arrows.map((a, i) => <OpMark key={id + i} a={a} tone="cand" pt={pt} s={s} uid={uid} />))}
          {ops.executed && ops.executed.map((a, i) => <OpMark key={"x" + i} a={a} tone="done" pt={pt} s={s} uid={uid} />)}
          {ops.candidates && ops.focus && (ops.candidates[ops.focus] || []).map((a, i) => <OpMark key={"f" + i} a={a} tone="focus" pt={pt} s={s} uid={uid} />)}
        </g>
      )}
      {(ground || []).filter((g) => full || inBox(proj(g.at))).map((g) => <GroundMark key={g.id} g={g} p={proj(g.at)} s={s} label big={full} />)}
      {shown.filter((c) => c !== node.city).map((c) => <circle key={c} cx={XY[c][0]} cy={XY[c][1]} r={3.2 * s} className="dg-visited" />)}
      {(pins || []).filter((p) => XY[p.city]).map((p) => (
        <g key={p.campaignId} transform={`translate(${XY[p.city][0]} ${XY[p.city][1]})`}>
          <rect x={-3.6 * s} y={-3.6 * s} width={7.2 * s} height={7.2 * s} transform="rotate(45)" className="dg-pin" style={{ fill: "var(--acc-" + p.campaignId + ")" }} />
          {full && <text x={7 * s} y={3 * s} fontSize={9.5 * s} className="dg-pintext">{CAMPAIGNS[p.campaignId].seal}</text>}
        </g>
      ))}
      {shown.filter((c) => c !== node.city && inBox(XY[c])).map((c) => (
        <text key={"l" + c} x={XY[c][0] + 5 * s} y={XY[c][1] + 4 * s} fontSize={10.5 * s} className="dg-maplabel">{c}</text>
      ))}
      <circle cx={hx} cy={hy} r={5 * s} className="dg-pulse" />
      <circle cx={hx} cy={hy} r={6 * s} className="dg-hq" />
      <text x={hx + 10 * s} y={hy - 8 * s} fontSize={15 * s} className="dg-hqlabel">{node.city}</text>
    </svg>
  );
}

/** The report's map: always there, small, and expandable to the whole theatre with its key and the other commands' news. */
function FrontMapPanel({ campaignId, node, nodeId, visited, focus, taken, executed, flags }) {
  const [open, setOpen] = useState(false);
  // the ground the file has taken or given up against the record
  const ground = useMemo(() => groundOf(campaignId, flags), [campaignId, flags]);
  // the orders drawn: this report's, the one in view, those given before (the last three), and the one just given
  const ops = useMemo(() => {
    if (!nodeId) return null;
    const candidates = executed ? null : mapOpsOf(nodeId);
    const past = (taken || []).filter((t) => t.node !== nodeId).slice(-3).flatMap((t) => mapOpsFor(t.node, t.choice));
    const done = executed ? mapOpsFor(executed.nodeId, executed.choiceId) : null;
    if (!past.length && !done && (!candidates || !Object.keys(candidates).length)) return null;
    return { candidates, focus, past, executed: done };
  }, [nodeId, focus, taken, executed]);
  const opener = useRef(null);
  const closer = useRef(null);
  const date = mapDate(campaignId, node.date);
  const meanwhile = useMemo(() => meanwhileAt(campaignId, node), [campaignId, node.date]);
  const sides = useMemo(() => {
    const map = mapFor(campaignId);
    const seen = new Set(map.countries.map((c) => sideOfCountry(c.id, date)));
    return ["cp", "ent", "neu"].filter((k) => seen.has(k));
  }, [campaignId, date]);
  useEffect(() => {
    if (!open) return undefined;
    if (closer.current) closer.current.focus();
    // Escape closes it; Tab and Shift-Tab go round inside it, so the page behind cannot be reached from the keyboard while it is open
    const onKey = (e) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab") return;
      const dlg = document.querySelector('.dg-modal[role="dialog"]');
      if (!dlg) return;
      const f = [...dlg.querySelectorAll("button, [href], input, summary, [tabindex]")].filter((el) => !el.disabled && el.tabIndex >= 0 && el.offsetParent !== null);
      if (!f.length) { e.preventDefault(); return; }
      const first = f[0];
      const last = f[f.length - 1];
      if (!dlg.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; if (opener.current) opener.current.focus(); };
  }, [open]);
  return (
    <section className="dg-mapcard" aria-label="The front">
      <div className="dg-maphead">
        <span className="t">The front · {nodeDate(campaignId, node.date)}</span>
        <button ref={opener} className="dg-btn" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>Expand the map</button>
      </div>
      <MapCanvas campaignId={campaignId} node={node} visited={visited} full={false} pins={meanwhile} ops={ops} ground={ground} />
      {open && (
        <div className="dg-modal" role="dialog" aria-modal="true" aria-label="The front, whole theatre" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="dg-modal-inner">
            <div className="dg-maphead">
              <span className="t">The front · {nodeDate(campaignId, node.date)}</span>
              <button ref={closer} className="dg-btn" onClick={() => setOpen(false)}>Close</button>
            </div>
            <MapCanvas campaignId={campaignId} node={node} visited={visited} full pins={meanwhile} ops={ops} ground={ground} />
            {meanwhile.length > 0 && (
              <>
                <h2 className="dg-order">Meanwhile</h2>
                <ul className="dg-meanwhile">
                  {[...meanwhile].sort((x, y) => x.daysAgo - y.daysAgo).slice(0, 3).map((m) => (
                    <li key={m.campaignId} style={{ "--accent": "var(--acc-" + m.campaignId + ")" }}>
                      <span className="dg-seal">{CAMPAIGNS[m.campaignId].seal}</span>
                      <span><b>{m.title}</b><br />{m.city ? `${m.city}, ` : ""}{ukDate(m.date)}{m.daysAgo > 0 ? ` (${m.daysAgo} ${m.daysAgo === 1 ? "day" : "days"} before this report)` : ""}<br /><span className="dg-mw-ctx">{m.context}</span></span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <ul className="dg-key" aria-label="Key">
              {sides.map((k) => <li key={k}><i className={"dg-swatch dg-side-" + k} />{SIDE_NAMES[k]}</li>)}
              <li><i className="dg-swatch dg-swatch-front" />The front, approximate</li>
              <li><i className="dg-swatch dg-swatch-hq" />This headquarters</li>
              {ops && <li><i className="dg-swatch dg-swatch-op" />An order: a solid arrow attacks, a dashed one moves or withdraws, a ring is a stand</li>}
              {ground.length > 0 && <li><i className="dg-swatch dg-swatch-gained" />Ground held or taken beyond the record</li>}
              {ground.length > 0 && <li><i className="dg-swatch dg-swatch-lost" />Ground lost or not taken, against the record</li>}
            </ul>
            {ground.length > 0 && (
              <>
                <h2 className="dg-order">Your file against the record</h2>
                <ul className="dg-groundlist">
                  {ground.map((g) => (
                    <li key={g.id} className={"dg-ground-" + g.kind}><b>{g.kind === "gained" ? "Held or taken" : "Lost or not taken"}: {g.name}.</b> <span className="dg-offrecord">Not in the record</span> {g.text}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
