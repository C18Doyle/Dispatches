// =============================================================================
// THE FILE AT ITS CLOSE
// =============================================================================
//
// What the ending screen shows after the epilogue and the rank: the front on the first day and on the last, side by side, with the ground the file took
// or gave up against the record marked on the last; the orders that left the record, in order, each with the report it was given at; and the staff the
// file ended with. It is read from the run that has just ended (the orders taken and the flags); nothing is saved.
// =============================================================================

const STRIP_LABEL_MAX = 110;

function stripLabel(label) {
  const s = String(label || "").replace(/\s+/g, " ").trim();
  if (s.length <= STRIP_LABEL_MAX) return s;
  const cut = s.slice(0, STRIP_LABEL_MAX - 1);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), 50)).replace(/[,;:]$/, "") + "…";
}

/** The orders a run gave, split into those that followed the record and those that left it: { kept, departures: [{ node, date, label }] }. */
function fileDepartures(campaignId, taken) {
  const camp = CAMPAIGNS[campaignId];
  const departures = [];
  let kept = 0;
  for (const t of Array.isArray(taken) ? taken : []) {
    const node = camp && camp.nodes[t.node];
    const choice = node && (node.choices || []).find((c) => c.id === t.choice);
    if (!choice) continue;
    if (choice.historical) kept++;
    else departures.push({ node: t.node, title: node.title, date: node.date, label: stripLabel(choice.label) });
  }
  return { kept, departures };
}

/** The advisers the file ended with, by state: { trusted, quiet, gone } as lists of names. */
function fileStaff(campaignId, flags) {
  const out = { trusted: [], quiet: [], gone: [] };
  const list = (CAMPAIGNS[campaignId] && CAMPAIGNS[campaignId].advisors) || [];
  for (const a of list) {
    const st = adviserState(flags || {}, a.id);
    if (out[st]) out[st].push(a.name);
  }
  return out;
}

function FileStrip({ campaignId, endingId, flags, taken, hard }) {
  const camp = CAMPAIGNS[campaignId];
  const first = camp.nodes[camp.startNode];
  const last = camp.nodes[endingId];
  const map = mapFor(campaignId);
  const ground = useMemo(() => groundOf(campaignId, flags), [campaignId, flags]);
  const { kept, departures } = useMemo(() => fileDepartures(campaignId, taken), [campaignId, taken]);
  const staff = useMemo(() => fileStaff(campaignId, flags), [campaignId, flags]);
  if (!first || !last) return null;
  const f = flags || {};
  const checks = Number(f.ix_used) || 0;
  const battles = Object.keys(BATTLES).filter((id) => f[`bx_${id}_grade`]).length;
  const total = kept + departures.length;
  const canMap = (n) => n.city && map.cities[n.city];
  return (
    <section className="dg-strip" aria-label="How your file went">
      <h2 className="dg-order">How your file went</h2>
      <p className="dg-note">
        {total} {total === 1 ? "order" : "orders"} given: {kept} followed the record and {departures.length} left it.
        {ground.length > 0 ? ` ${ground.length} ${ground.length === 1 ? "place was" : "places were"} held or lost against the record.` : ""}
      </p>
      {canMap(first) && canMap(last) && (
        <div className="dg-strip-maps">
          <figure>
            <MapCanvas campaignId={campaignId} node={first} visited={[]} full pins={[]} ops={null} ground={[]} />
            <figcaption>The first day, {nodeDate(campaignId, first.date)}</figcaption>
          </figure>
          <figure>
            <MapCanvas campaignId={campaignId} node={last} visited={[]} full pins={[]} ops={null} ground={ground} />
            <figcaption>The last, {nodeDate(campaignId, last.date)}, with the ground your orders took or gave up</figcaption>
          </figure>
        </div>
      )}
      {ground.length > 0 && (
        <ul className="dg-groundlist" aria-label="Ground against the record">
          {ground.map((g) => (
            <li key={g.id} className={"dg-ground-" + g.kind}><b>{g.kind === "gained" ? "Held or taken" : "Lost or not taken"}: {g.name}.</b> <span className="dg-offrecord">Not in the record</span> {g.text}</li>
          ))}
        </ul>
      )}
      {departures.length > 0 && (
        <>
          <h3 className="dg-strip-h">Where the file left the record</h3>
          <ol className="dg-strip-list">
            {departures.map((d, i) => (
              <li key={d.node + i}><span className="d">{nodeDate(campaignId, d.date)}</span> <b>{d.title}.</b> {d.label}</li>
            ))}
          </ol>
        </>
      )}
      <h3 className="dg-strip-h">The staff</h3>
      <ul className="dg-strip-staff">
        <li>{staff.trusted.length ? `Trusted: ${staff.trusted.join(", ")}.` : "No adviser ended trusted."}</li>
        {staff.quiet.length > 0 && <li>Gone quiet: {staff.quiet.join(", ")}.</li>}
        {staff.gone.length > 0 && <li>Relieved at their own request: {staff.gone.join(", ")}.</li>}
        <li>{checks} {checks === 1 ? "belief" : "beliefs"} checked{hard ? " (hard mode)" : ""}; {battles} {battles === 1 ? "battle" : "battles"} planned.</li>
      </ul>
    </section>
  );
}
