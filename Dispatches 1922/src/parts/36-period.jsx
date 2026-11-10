// PERIOD DETAILS
// The map's terrain, the named operations, the supply picture and the place names; then the letterheads, documents, plates, quotations, terms,
// staff and cast that make each report read as a file of the time. Everything here is keyed by a report, a city or a campaign, so the reports
// themselves are not touched. Nothing in this part is data the validators read (it sits below PREVIEW SCREENS).

// ---------------------------------------------------------------------------------------------------------------------
// MAP: the projection the city positions were made with (equirectangular, standard parallel 53 degrees north, one unit
// about 7.0 km), fitted to the city table and checked against Petrograd, Moscow, Sevastopol and Chita to within a unit.
function projectLL(lat, lon) {
  return [Math.round((lon - 15.0) * 9.56 * 10) / 10, Math.round((64 - lat) * 15.886 * 10) / 10];
}
const polyPath = (pts) => pts.map(([lat, lon], i) => { const [x, y] = projectLL(lat, lon); return (i ? "L " : "M ") + x + " " + y; }).join(" ");

// Rivers as waypoints through named towns (approximate: drawn to show where an army met water, not to survey it).
const RIVERS = [
  { id: "volga", name: "Volga", pts: [[57.0, 38.0], [57.63, 39.9], [57.77, 40.93], [56.33, 44.0], [56.1, 46.5], [55.8, 49.2], [54.3, 48.4], [53.4, 49.6], [52.0, 47.5], [51.53, 46.03], [50.0, 45.4], [48.7, 44.5], [47.0, 46.9], [46.35, 48.04]] },
  { id: "kama", name: "Kama", pts: [[60.0, 56.5], [58.0, 56.2], [57.0, 54.0], [56.2, 52.5], [55.7, 52.0], [55.4, 50.0]] },
  { id: "don", name: "Don", pts: [[54.0, 38.3], [53.0, 38.9], [51.7, 39.2], [50.45, 40.1], [49.6, 42.7], [48.7, 43.5], [47.6, 42.1], [47.3, 40.0], [47.1, 39.2]] },
  { id: "dnieper", name: "Dnieper", pts: [[55.0, 31.5], [54.5, 30.4], [53.9, 30.3], [52.4, 30.9], [50.45, 30.55], [49.8, 31.5], [49.07, 33.4], [48.45, 35.0], [47.85, 35.1], [47.55, 34.4], [46.8, 33.4], [46.6, 32.6], [46.5, 31.9]] },
  { id: "vistula", name: "Vistula", pts: [[50.0, 20.0], [51.0, 21.8], [52.2, 21.0], [52.6, 19.5], [54.0, 18.8]] },
  { id: "kuban", name: "Kuban", pts: [[43.9, 41.0], [44.6, 40.0], [45.0, 39.0], [45.2, 38.0], [45.3, 37.4]] },
  { id: "ob", name: "Ob", pts: [[52.5, 85.0], [53.35, 83.8], [54.9, 83.0], [56.5, 83.0], [58.3, 82.9], [60.0, 80.5], [62.0, 77.0]] },
  { id: "irtysh", name: "Irtysh", pts: [[50.4, 80.3], [52.3, 77.0], [53.5, 75.0], [55.0, 73.4], [56.5, 71.0], [58.2, 68.25], [60.5, 68.5]] },
  { id: "tobol", name: "Tobol", pts: [[52.0, 63.0], [53.2, 63.6], [55.4, 65.3], [57.0, 66.0], [58.2, 68.25]] },
  { id: "yenisei", name: "Yenisei", pts: [[52.5, 91.5], [54.0, 91.5], [56.0, 92.9], [58.0, 92.0], [60.0, 90.0], [62.0, 89.5]] },
  { id: "angara", name: "Angara", pts: [[51.9, 104.9], [52.3, 104.3], [54.0, 102.2], [56.1, 101.8], [58.0, 97.0], [58.0, 93.0]] },
];
// Mountain ranges as ridge lines; drawn as a row of small peaks along them.
const RANGES = [
  { id: "urals", name: "URALS", pts: [[52.0, 58.0], [53.0, 58.8], [54.0, 59.3], [55.2, 59.7], [56.5, 59.5], [58.0, 59.6], [59.5, 59.3], [61.0, 59.0], [63.0, 59.5]], label: [57.2, 60.4] },
  { id: "caucasus", name: "CAUCASUS", pts: [[44.0, 38.5], [43.6, 40.5], [43.35, 42.4], [42.8, 44.0], [42.6, 45.5], [42.2, 47.0], [41.7, 48.0]], label: [42.0, 41.0] },
  { id: "sayan", name: "SAYAN", pts: [[51.5, 92.0], [51.8, 95.0], [52.0, 98.0], [51.8, 101.0], [51.5, 103.0]], label: [50.6, 96.0] },
  { id: "carpathians", name: "", pts: [[49.0, 22.5], [48.5, 24.5], [48.0, 25.5]], label: null },
];

function ridgePoints(pts, every) {
  const xy = pts.map(([la, lo]) => projectLL(la, lo));
  const out = [];
  let carry = 0;
  for (let i = 1; i < xy.length; i++) {
    const [x1, y1] = xy[i - 1];
    const [x2, y2] = xy[i];
    const len = Math.hypot(x2 - x1, y2 - y1);
    let d = every - carry;
    while (d <= len) {
      out.push([x1 + ((x2 - x1) * d) / len, y1 + ((y2 - y1) * d) / len]);
      d += every;
    }
    carry = len - (d - every);
  }
  return out;
}

function TerrainLayer({ skin, compact }) {
  const water = skin.dark ? "rgba(140,170,200,0.55)" : "rgba(60,100,140,0.45)";
  const rock = skin.dark ? "rgba(255,255,255,0.35)" : "rgba(60,50,40,0.40)";
  return (
    <g aria-hidden="true">
      {RIVERS.map((r) => (
        <path key={r.id} d={polyPath(r.pts)} fill="none" stroke={water} strokeWidth={r.id === "volga" || r.id === "ob" || r.id === "yenisei" ? 2.2 : 1.4} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {RANGES.map((g) =>
        ridgePoints(g.pts, 7).map(([x, y], i) => (
          <path key={g.id + i} d={`M ${x - 3.2} ${y + 2.2} L ${x} ${y - 3} L ${x + 3.2} ${y + 2.2}`} fill="none" stroke={rock} strokeWidth="1.1" />
        ))
      )}
      {!compact &&
        RIVERS.filter((r) => ["volga", "don", "dnieper", "ob", "yenisei", "irtysh"].includes(r.id)).map((r) => {
          const mid = r.pts[Math.floor(r.pts.length / 2)];
          const [x, y] = projectLL(mid[0], mid[1]);
          return (
            <text key={"l" + r.id} x={x + 5} y={y - 3} fontSize="9" fill={water} style={{ fontFamily: skin.monoFont, fontStyle: "italic" }}>{r.name}</text>
          );
        })}
      {!compact &&
        RANGES.filter((g) => g.label).map((g) => {
          const [x, y] = projectLL(g.label[0], g.label[1]);
          return <text key={"r" + g.id} x={x} y={y} fontSize="8.5" fill={rock} letterSpacing="1.5" style={{ fontFamily: skin.monoFont }}>{g.name}</text>;
        })}
    </g>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// MAP: named operations, drawn while they were under way. start and end are YYYYMM (inclusive).
const OPERATIONS = [
  { id: "icemarch", name: "Ice March", side: "white", from: "don", to: "ekaterinodar", start: 191802, end: 191804, text: "The Volunteer Army marches from the Don to the Kuban and turns on Ekaterinodar." },
  { id: "volgathrust", name: "Caucasus Army to the Volga", side: "white", from: "ekaterinodar", to: "tsaritsyn", start: 191905, end: 191906, text: "Wrangel's Caucasus Army fights its way north to Tsaritsyn, which falls on 30 June." },
  { id: "kolchakspring", name: "Spring offensive", side: "white", from: "omsk", to: "ufa", start: 191903, end: 191905, text: "Kolchak's army drives west from the Urals toward the Volga." },
  { id: "redufa", name: "Eastern Front counteroffensive", side: "red", from: "ufa", to: "chelyabinsk", start: 191906, end: 191907, text: "The Red Army retakes Ufa on 9 June and Chelyabinsk on 24 July." },
  { id: "moscowdirective", name: "Moscow Directive", side: "white", from: "kharkov", to: "orel", start: 191907, end: 191910, text: "The Armed Forces of South Russia advance on Moscow and reach Orel on 13 October." },
  { id: "redpursuit", name: "Pursuit into Siberia", side: "red", from: "chelyabinsk", to: "omsk", start: 191908, end: 191911, text: "The Red armies drive east across the Tobol and Ishim and take Omsk on 14 November." },
  { id: "redsouth", name: "Southern Front counteroffensive", side: "red", from: "orel", to: "kharkov", start: 191910, end: 191912, text: "The Red armies retake Orel and push the Whites south; Kharkov falls on 12 December." },
  { id: "krasnoyarsk", name: "Advance to Krasnoyarsk", side: "red", from: "omsk", to: "krasnoyarsk", start: 191911, end: 192001, text: "The Red 5th Army follows the retreating Whites along the railway to Krasnoyarsk." },
  { id: "siberiaice", name: "Great Siberian Ice March", side: "white", from: "krasnoyarsk", to: "irkutsk", start: 192001, end: 192002, text: "The remnants of Kolchak's armies retreat east on foot and by sleigh toward Irkutsk." },
  { id: "polish", name: "Polish-Soviet War", side: "red", from: "kiev", to: "warsaw", start: 192006, end: 192008, text: "After the Poles take Kiev in May, the Red Army advances to the Vistula in July and August." },
  { id: "perekop", name: "Perekop and the Sivash", side: "red", from: "perekop", to: "sevastopol", start: 192011, end: 192011, text: "The Red Army storms the Perekop defences and crosses the Sivash, 7 to 17 November." },
  { id: "kronstadt", name: "Assault on Kronstadt", side: "red", from: "petrograd", to: "kronstadt", start: 192103, end: 192103, text: "The Red Army crosses the ice to Kronstadt on 17 and 18 March." },
];
const activeOperations = (atDate) => (atDate == null ? [] : OPERATIONS.filter((o) => atDate >= o.start && atDate <= o.end));

function OperationsLayer({ atDate, skin }) {
  const ops = activeOperations(atDate);
  if (!ops.length) return null;
  return (
    <g aria-hidden="true">
      <defs>
        {["red", "white"].map((s) => (
          <marker key={s} id={"opHead-" + s} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={CONTROL_COLORS[s]} />
          </marker>
        ))}
      </defs>
      {ops.map((o, n) => {
        const a = CITIES[o.from];
        const b = CITIES[o.to];
        if (!a || !b) return null;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const bend = Math.min(30, len * 0.18);
        const cx = mx - (dy / len) * bend;
        const cy = my + (dx / len) * bend;
        const col = CONTROL_COLORS[o.side];
        const tx = (a.x + 2 * cx + b.x) / 4;
        const ty = (a.y + 2 * cy + b.y) / 4;
        return (
          <g key={o.id}>
            <path d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`} fill="none" stroke={col} strokeWidth="3" strokeDasharray="9 5" opacity="0.9" markerEnd={"url(#opHead-" + o.side + ")"} />
            <circle cx={tx} cy={ty} r="8" fill={col} stroke={skin.dark ? skin.ground : skin.paper} strokeWidth="1.5" />
            <text x={tx} y={ty + 4} fontSize="11" textAnchor="middle" fontWeight="bold" fill="#fff" style={{ fontFamily: skin.monoFont }}>{n + 1}</text>
          </g>
        );
      })}
    </g>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// MAP: what a command lives on. Rail junctions, grain districts, coal and ports, held or lost as the map shows the control of the
// nearest city; a command whose rail (or war industry) meter is low has its held junctions marked as strained.
const CITY_ASSETS = {
  moscow: ["junction"],
  petrograd: ["port"],
  kronstadt: ["port"],
  orel: ["junction", "grain"],
  voronezh: ["junction", "grain"],
  kharkov: ["junction"],
  kiev: ["grain"],
  yuzovka: ["coal"],
  don: ["grain"],
  saratov: ["grain"],
  tsaritsyn: ["junction"],
  ekaterinodar: ["grain"],
  novorossiysk: ["port"],
  sevastopol: ["port"],
  ufa: ["junction"],
  chelyabinsk: ["junction"],
  omsk: ["junction", "grain"],
  krasnoyarsk: ["junction"],
  irkutsk: ["junction"],
  chita: ["junction"],
};
const ASSET_KINDS = [
  { id: "junction", label: "RAIL JUNCTIONS", one: "junction" },
  { id: "grain", label: "GRAIN DISTRICTS", one: "grain district" },
  { id: "coal", label: "COAL", one: "coalfield" },
  { id: "port", label: "PORTS", one: "port" },
];
const ASSET_DETAIL = {
  yuzovka: "the Donbas coalfield",
  don: "the Don Cossack grain lands",
  ekaterinodar: "the Kuban grain lands",
  saratov: "the Volga grain lands",
  omsk: "the Siberian wheat belt",
  kiev: "the Ukrainian grain lands",
  orel: "the black-earth grain of the centre",
  voronezh: "the black-earth grain of the centre",
};
// The side a command fights for on this map, and the meter that stands for its railways and works.
const SUPPLY_SIDE = { southRussia: "white", siberia: "white", bolsheviks: "red" };
const SUPPLY_AXIS = { southRussia: "rail", siberia: "rail", bolsheviks: "warIndustry" };

// A few of the player's own decisions change who holds a place. Each entry names the flag and value that has to be on the run, the place,
// the months it applies to (YYYYMM, inclusive) and the control it has then.
const MAP_EFFECTS = [
  { flag: "perekopOutcome", value: "stalled", city: "perekop", from: 192011, to: 192011, side: "white" },
  { flag: "perekopOutcome", value: "stalled", city: "sevastopol", from: 192011, to: 192011, side: "white" },
  { flag: "chelyabinskOutcome", value: "checked", city: "chelyabinsk", from: 191907, to: 191907, side: "contested" },
  { flag: "kronstadtChoice", value: "wait_for_thaw", city: "kronstadt", from: 192104, to: 192112, side: "contested" },
];
function controlFor(cid, city, atDate, flags) {
  if (flags && atDate != null) {
    for (const e of MAP_EFFECTS) {
      if (e.city === cid && flags[e.flag] === e.value && atDate >= e.from && atDate <= e.to) return e.side;
    }
  }
  return controlAt(city, atDate);
}

function supplyReport(campaignId, atDate, flags, meters) {
  const side = SUPPLY_SIDE[campaignId];
  if (!side || atDate == null) return null;
  const axis = SUPPLY_AXIS[campaignId];
  const strained = !!(meters && axis && meters[axis] != null && meters[axis] <= -3);
  const kinds = ASSET_KINDS.map((k) => {
    const items = [];
    for (const [cid, list] of Object.entries(CITY_ASSETS)) {
      if (!list.includes(k.id)) continue;
      const city = CITIES[cid];
      const ctl = controlFor(cid, city, atDate, flags);
      if (ctl === "unknown") continue;
      let state = ctl === side ? "held" : ctl === "contested" ? "contested" : "lost";
      if (state === "held" && strained && k.id === "junction") state = "strained";
      items.push({ cid, name: placeName(cid, atDate), state, detail: ASSET_DETAIL[cid] || "" });
    }
    return { ...k, items };
  }).filter((k) => k.items.length);
  return { side, strained, axis, kinds };
}

function SupplyPanel({ campaignId, atDate, flags, meters, skin }) {
  const rep = supplyReport(campaignId, atDate, flags, meters);
  if (!rep) return null;
  const word = { held: "HELD", strained: "HELD, STRAINED", contested: "CONTESTED", lost: "LOST" };
  return (
    <section className="border-2 mt-4 p-3 text-xs" style={{ borderColor: skin.paperDim, ...monoFontStyle(skin) }} aria-labelledby="supply-title">
      <div id="supply-title" className="font-bold tracking-widest" style={accentTextStyle(skin)}>WHAT THE COMMAND LIVES ON, AS OF {monthKeyLabel(atDate)}</div>
      {rep.strained && (
        <div className="mt-1" style={mutedTextStyle(skin)}>The railways and works are running badly. Junctions that are held still carry less than they should.</div>
      )}
      {rep.kinds.map((k) => {
        const held = k.items.filter((i) => i.state === "held" || i.state === "strained").length;
        return (
          <div key={k.id} className="mt-3">
            <div className="font-bold">{k.label}: {held} OF {k.items.length} HELD</div>
            <ul style={{ listStyle: "none", padding: 0 }} className="mt-1">
              {k.items.map((i) => (
                <li key={i.cid} className="py-0.5" style={i.state === "lost" ? mutedTextStyle(skin) : undefined}>
                  {i.name}{i.detail ? ` (${i.detail})` : ""}: <b>{word[i.state]}</b>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}

function OperationsList({ atDate, skin }) {
  const ops = activeOperations(atDate);
  if (!ops.length) return null;
  return (
    <section className="border-2 mt-4 p-3 text-xs" style={{ borderColor: skin.paperDim, ...monoFontStyle(skin) }} aria-labelledby="ops-title">
      <div id="ops-title" className="font-bold tracking-widest" style={accentTextStyle(skin)}>UNDER WAY THIS MONTH</div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {ops.map((o, n) => (
          <li key={o.id} className="mt-2">
            <b>{n + 1}. {o.name.toUpperCase()}</b> ({o.side === "red" ? "Red" : "White"}). {o.text}
          </li>
        ))}
      </ul>
    </section>
  );
}

// Drawn beside each marker on the full map: a small glyph for each asset the place carries, dashed when it is contested and pale when it is lost.
function AssetGlyphs({ campaignId, atDate, flags, skin }) {
  const side = SUPPLY_SIDE[campaignId];
  if (!side) return null;
  const ink = skin.dark ? skin.paper : skin.ink;
  return (
    <g aria-hidden="true">
      {Object.entries(CITY_ASSETS).map(([cid, list]) => {
        const city = CITIES[cid];
        if (!city) return null;
        const ctl = controlFor(cid, city, atDate, flags);
        if (ctl === "unknown") return null;
        const op = ctl === side ? 1 : ctl === "contested" ? 0.7 : 0.3;
        const dash = ctl === "contested" ? "2 1.5" : undefined;
        return list.map((a, i) => {
          const x = city.x - 8 + i * 9;
          const y = city.y - markerRadius(city) - 6;
          if (a === "junction") return <g key={cid + a} opacity={op}><circle cx={x} cy={y} r="3.4" fill="none" stroke={ink} strokeWidth="1.3" strokeDasharray={dash} /><path d={`M ${x - 3.4} ${y} H ${x + 3.4} M ${x} ${y - 3.4} V ${y + 3.4}`} stroke={ink} strokeWidth="1" /></g>;
          if (a === "grain") return <g key={cid + a} opacity={op}><circle cx={x} cy={y} r="3.4" fill="#c9a227" stroke={ink} strokeWidth="0.9" strokeDasharray={dash} /></g>;
          if (a === "coal") return <g key={cid + a} opacity={op}><rect x={x - 3.2} y={y - 3.2} width="6.4" height="6.4" fill={ink} stroke={ink} strokeDasharray={dash} /></g>;
          return <g key={cid + a} opacity={op}><path d={`M ${x} ${y - 3.6} L ${x + 3.6} ${y + 3} L ${x - 3.6} ${y + 3} Z`} fill="none" stroke={ink} strokeWidth="1.3" strokeDasharray={dash} /></g>;
        });
      })}
    </g>
  );
}

function AssetLegend({ skin }) {
  const ink = skin.dark ? skin.paper : skin.ink;
  const items = [
    ["junction", "rail junction"],
    ["grain", "grain district"],
    ["coal", "coalfield"],
    ["port", "port"],
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
      {items.map(([k, t]) => (
        <span key={k} className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="-6 -6 12 12" aria-hidden="true">
            {k === "junction" && <g><circle r="3.4" fill="none" stroke={ink} strokeWidth="1.3" /><path d="M -3.4 0 H 3.4 M 0 -3.4 V 3.4" stroke={ink} strokeWidth="1" /></g>}
            {k === "grain" && <circle r="3.4" fill="#c9a227" stroke={ink} strokeWidth="0.9" />}
            {k === "coal" && <rect x="-3.2" y="-3.2" width="6.4" height="6.4" fill={ink} />}
            {k === "port" && <path d="M 0 -3.6 L 3.6 3 L -3.6 3 Z" fill="none" stroke={ink} strokeWidth="1.3" />}
          </svg>
          {t}
        </span>
      ))}
      <span>Dashed: contested. Pale: lost.</span>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// PLACE NAMES: the name in use on the date, and the later names a reader may know the place by.
const CITY_NAMES = {
  ekaterinodar: [[191701, "Ekaterinodar"], [192012, "Krasnodar"]],
};
const CITY_LATER = {
  tsaritsyn: "Stalingrad from 1925, Volgograd from 1961",
  petrograd: "Leningrad from 1924, St Petersburg from 1991",
  yuzovka: "Stalin from 1924, Donetsk from 1961",
  ekaterinodar: "Krasnodar from December 1920",
  kiev: "Kyiv in the Ukrainian spelling used today",
  kharkov: "Kharkiv in the Ukrainian spelling used today",
};
function placeName(cid, atDate) {
  const city = CITIES[cid];
  if (!city) return cid;
  const list = CITY_NAMES[cid];
  if (!list || atDate == null) return city.name;
  let name = list[0][1];
  for (const [from, n] of list) if (atDate >= from) name = n;
  return name;
}
function PlaceNamesNote({ cityIds, skin }) {
  const rows = [...new Set(cityIds)].filter((c) => CITY_LATER[c]);
  if (!rows.length) return null;
  return (
    <details className="mt-3 text-xs" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
      <summary className="cursor-pointer font-bold tracking-widest" style={accentTextStyle(skin)}>PLACE NAMES THAT CHANGED</summary>
      <ul style={{ listStyle: "none", padding: 0 }} className="mt-2">
        {rows.map((c) => (
          <li key={c} className="py-0.5"><b>{CITIES[c].name}</b>: {CITY_LATER[c]}.</li>
        ))}
      </ul>
    </details>
  );
}
