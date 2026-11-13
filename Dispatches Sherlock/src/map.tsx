/**
 * A sketch map of where each scene happens: London for the first three roads, the Channel and the Alps for the flight and the years away. It is
 * drawn by hand and is only approximately where the streets and coasts are; the how-to page says so. Place names are labels on the map, not story.
 */

export type MapId = "london" | "europe" | "moor";
export interface Place {
  map: MapId;
  name: string;
  x: number;
  y: number;
}

export const PLACES: Record<string, Place> = {
  // London (viewBox 200 x 120)
  baker: { map: "london", name: "Baker Street", x: 62, y: 42 },
  marylebone: { map: "london", name: "Marylebone Road", x: 76, y: 44 },
  vere: { map: "london", name: "Vere Street", x: 80, y: 56 },
  mayfair: { map: "london", name: "Mayfair", x: 68, y: 63 },
  hampstead: { map: "london", name: "Hampstead", x: 46, y: 12 },
  kentish: { map: "london", name: "Kentish Town", x: 84, y: 16 },
  kensington: { map: "london", name: "Kensington", x: 22, y: 66 },
  professor: { map: "london", name: "The Professor's house", x: 38, y: 52 },
  pallmall: { map: "london", name: "Pall Mall", x: 86, y: 70 },
  whitehall: { map: "london", name: "Whitehall", x: 98, y: 76 },
  yard: { map: "london", name: "Scotland Yard", x: 104, y: 82 },
  bowstreet: { map: "london", name: "Bow Street", x: 108, y: 60 },
  clerkenwell: { map: "london", name: "Clerkenwell", x: 120, y: 42 },
  oldbailey: { map: "london", name: "The Old Bailey", x: 126, y: 56 },
  city: { map: "london", name: "The City", x: 140, y: 62 },
  shoreditch: { map: "london", name: "Shoreditch", x: 148, y: 42 },
  hackney: { map: "london", name: "Hackney", x: 164, y: 26 },
  wapping: { map: "london", name: "Wapping", x: 152, y: 80 },
  limehouse: { map: "london", name: "Limehouse", x: 176, y: 78 },
  briony: { map: "london", name: "Briony Lodge, St John's Wood", x: 52, y: 30 },
  stoke: { map: "london", name: "Stoke Moran, off the map", x: 20, y: 104 },
  covent: { map: "london", name: "Covent Garden", x: 114, y: 66 },
  saxe: { map: "london", name: "Saxe-Coburg Square", x: 132, y: 50 },
  citybank: { map: "london", name: "The City and Suburban Bank", x: 144, y: 60 },
  victoriastn: { map: "london", name: "Victoria Station", x: 78, y: 92 },
  parklane: { map: "london", name: "Park Lane", x: 60, y: 62 },
  camden: { map: "london", name: "Camden House, opposite", x: 66, y: 40 },
  conduit: { map: "london", name: "Conduit Street", x: 78, y: 64 },
  soho: { map: "london", name: "Soho", x: 96, y: 58 },
  stjames: { map: "london", name: "St James's Street", x: 84, y: 74 },
  paddington: { map: "london", name: "Paddington Station", x: 34, y: 52 },
  northumberland: { map: "london", name: "The Northumberland Hotel", x: 98, y: 68 },
  fulham: { map: "london", name: "The Fulham Road", x: 44, y: 94 },
  chancery: { map: "london", name: "Chancery Lane", x: 116, y: 58 },
  fetter: { map: "london", name: "Fetter Lane", x: 124, y: 62 },
  blackfriars: { map: "london", name: "Blackfriars", x: 128, y: 74 },
  southwark: { map: "london", name: "Southwark", x: 136, y: 84 },
  clapham: { map: "london", name: "Clapham", x: 92, y: 108 },
  lauder: { map: "london", name: "Off the map: Lauder", x: 12, y: 8 },
  leith: { map: "london", name: "Off the map: Leith", x: 12, y: 18 },
  college: { map: "london", name: "Off the map: the provincial college", x: 12, y: 28 },
  // The moor (viewBox 240 x 160)
  gateway: { map: "moor", name: "Grimpen Road halt", x: 24, y: 52 },
  hall: { map: "moor", name: "Baskerville Hall", x: 72, y: 62 },
  yewalley: { map: "moor", name: "The Yew Alley", x: 60, y: 76 },
  crag: { map: "moor", name: "The crag below the tor", x: 96, y: 44 },
  hut: { map: "moor", name: "The stone hut on the tor", x: 112, y: 34 },
  merripit: { map: "moor", name: "Merripit House", x: 160, y: 74 },
  mire: { map: "moor", name: "The Great Grimpen Mire", x: 150, y: 108 },
  grimpen: { map: "moor", name: "Grimpen", x: 108, y: 94 },
  coombe: { map: "moor", name: "Coombe Tracey", x: 200, y: 44 },
  princetown: { map: "moor", name: "Princetown", x: 60, y: 120 },
  // Europe (viewBox 240 x 160)
  victoria: { map: "europe", name: "London", x: 36, y: 46 },
  canterbury: { map: "europe", name: "Canterbury", x: 50, y: 54 },
  channel: { map: "europe", name: "The Channel", x: 62, y: 58 },
  brussels: { map: "europe", name: "Brussels", x: 100, y: 66 },
  strasbourg: { map: "europe", name: "Strasbourg", x: 152, y: 84 },
  basel: { map: "europe", name: "Basel", x: 152, y: 104 },
  geneva: { map: "europe", name: "Geneva", x: 120, y: 124 },
  interlaken: { map: "europe", name: "Interlaken", x: 148, y: 122 },
  meiringen: { map: "europe", name: "Meiringen and the Falls", x: 162, y: 118 },
  florence: { map: "europe", name: "Florence", x: 188, y: 140 },
  tibet: { map: "europe", name: "Off the map: Tibet", x: 228, y: 96 },
  montpellier: { map: "europe", name: "Montpellier", x: 100, y: 146 },
};

/** Where each scene is. check_map.ts holds this to the list of scenes. */
export const SCENE_PLACE: Record<string, string> = {
  "1": "baker", "2": "mayfair", "3": "vere", X1: "vere", X2: "vere", X3: "baker", "4": "yard", "4B": "baker",
  K1: "clerkenwell", K2: "clerkenwell", K3: "kentish", K4: "kentish", K5: "hampstead", K6: "hampstead",
  "5": "baker", "5B": "baker", "6": "baker", "7": "marylebone", "7B": "city", "7D": "marylebone", "8": "kensington", "9": "mayfair",
  "9B": "baker", "10": "baker", "11": "kensington",
  F1: "baker", MA: "pallmall", MB: "whitehall", FA: "baker",
  Y1: "yard", Y2: "bowstreet", Y2B: "yard", Y3: "yard", Y4: "baker", Y5: "yard", Y5B: "yard", Y6: "professor", YX1: "professor",
  YX2: "professor", YX3: "professor", Y7: "oldbailey", Y7B: "oldbailey", Y8: "baker", Y9: "hackney", Y9B: "hackney", Y9C: "hackney",
  S1: "baker", S2: "wapping", S3: "baker", S3B: "pallmall", S4: "baker", S5: "baker", S5B: "clerkenwell", S6: "city", S6B: "baker",
  S7: "baker", S8: "limehouse", S8B: "limehouse", S8C: "limehouse",
  M1: "pallmall", M2: "whitehall", M3: "whitehall", M4: "yard", M5: "baker", M6: "city", M7: "pallmall", M8: "whitehall",
  C1: "victoria", C2: "canterbury", C3: "channel", C4: "brussels", C4B: "brussels", C5: "strasbourg", C5B: "basel", C6: "geneva",
  C6B: "interlaken", C7: "meiringen", C7B: "meiringen", C8: "meiringen", C9: "meiringen", C10: "meiringen",
  H1: "florence", H2: "tibet", H3: "montpellier", H4: "victoria",
  MX1: "whitehall", MX2: "whitehall", MX3: "whitehall", M6B: "pallmall", "10W": "baker", K7: "briony", K8: "briony",
  "0": "baker", B1: "baker", B2: "briony", B3: "briony", B4: "briony", R1: "baker", R2: "stoke", R3: "stoke", R4: "stoke",
  G1: "baker", G2: "baker", G3: "covent", G4: "baker",
  L1: "baker", L2: "saxe", L3: "baker", L4: "citybank",
  D1: "baker", D2: "baker", D3: "baker", D4: "baker", D5: "baker", D5A: "southwark", D5B: "northumberland", D5C: "baker", D6: "baker", D7: "paddington",
  D8: "baker", D9: "yard", D10: "chancery", D11: "fulham", D12: "baker", D13: "baker", D14: "baker", D15: "baker", D16: "baker", D17: "baker", D18: "yard", D19: "pallmall", D20: "baker",
  D21: "gateway", D22: "hut", D23: "hut", D24: "crag", D24B: "hall", D25: "hut", D26: "coombe", D26B: "coombe", D27: "hut",
  D28: "merripit", D29: "merripit", D30: "merripit", D31: "mire", D32: "merripit", D33: "hut",
  P1: "baker", P2: "lauder", P3: "blackfriars", P4: "city", P5: "kensington", P6: "fetter", P7: "oldbailey", P8: "clapham",
  P9: "baker", P10: "baker", P11: "southwark", P12: "baker", P13: "college", P14: "leith", P15: "pallmall", P16: "pallmall", P17: "baker", P18: "baker",
  P19: "kensington", P20: "kensington", P21: "kensington", P22: "kensington", P23: "baker",
  E1: "victoriastn", E1A: "baker", E1B: "kensington", E2: "pallmall", E3: "parklane", E4: "baker", E5: "pallmall",
  E6: "yard", E7: "yard", E8: "pallmall", E9: "yard", E10: "baker", E11: "camden", E12: "marylebone", E13: "conduit",
  E14: "pallmall", E15: "soho", E16: "stjames", E17: "baker", E18: "baker", E19: "camden", E20: "camden", E21: "camden", E21B: "camden", E22: "camden", E23: "yard",
  SX1: "limehouse", SX2: "limehouse", S8D: "limehouse", CX1: "meiringen", CX2: "meiringen", AC: "meiringen", AY: "yard", Y9D: "hackney", M9: "whitehall",
};

const LONDON_THAMES = "M-4 92C20 94 36 96 56 90S84 84 100 88 122 84 140 88 164 90 204 82";
const LAND_EUROPE = "M62 64L76 58 98 56 124 48 154 42 194 42 228 54 236 82 230 122 204 150 164 154 132 142 112 152 84 152 60 134 40 120 32 98 46 88 56 78Z";
const LAND_ITALY = "M154 112L178 118 190 132 206 154 196 158 180 144 166 136Z";
const LAND_BRITAIN = "M28 14L40 8 50 20 46 36 56 48 46 58 30 62 18 54 26 42 20 28Z";
const LAND_IRELAND = "M4 28L14 24 18 38 8 44Z";

/** The map for one scene, with the places you have been this run joined in the order you went. */
export function MapView({ nodeId, history }: { nodeId: string; history: Array<{ nodeId: string }> }) {
  const here = PLACES[SCENE_PLACE[nodeId] ?? ""];
  if (!here) return null;
  const map = here.map;
  const box = map === "london" ? "0 0 200 120" : "0 0 240 160";
  const mapName = map === "london" ? "London" : map === "moor" ? "Dartmoor" : "the Channel and the Continent";
  const seen: string[] = [];
  for (const h of history) {
    const p = SCENE_PLACE[h.nodeId];
    if (p && PLACES[p].map === map && seen[seen.length - 1] !== p) seen.push(p);
  }
  const here_id = SCENE_PLACE[nodeId];
  if (seen[seen.length - 1] !== here_id) seen.push(here_id);
  const trail = seen.map((p) => `${PLACES[p].x},${PLACES[p].y}`).join(" ");
  const places = Object.entries(PLACES).filter(([, p]) => p.map === map);
  const visited = new Set(seen);
  return (
    <figure className="m-0">
      <svg
        viewBox={box}
        className="w-full h-auto text-ink"
        role="img"
        aria-label={`Sketch map of ${mapName}. You are at ${here.name}. You have been to ${seen.length} place${seen.length === 1 ? "" : "s"} on this map.`}
      >
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(15,15,14,0.04)" stroke="rgba(15,15,14,0.25)" />
        {map === "london" ? (
          <>
            <path d={LONDON_THAMES} fill="none" stroke="rgba(61,92,69,0.55)" strokeWidth="7" strokeLinecap="round" />
            <path d={`${LONDON_THAMES}`} fill="none" stroke="rgba(15,15,14,0.35)" strokeWidth="0.7" />
            <text x="190" y="102" fontSize="6" textAnchor="end" fill="currentColor" opacity="0.55" style={{ fontStyle: "italic" }}>the Thames</text>
            <path d="M54 30C70 28 84 34 90 46" fill="none" stroke="rgba(61,92,69,0.4)" strokeWidth="1" strokeDasharray="2 3" />
          </>
        ) : map === "moor" ? (
          <>
            <path d="M0 150C40 142 90 146 130 150S210 146 240 150V160H0Z" fill="rgba(143,136,122,0.28)" />
            <path d="M118 96l10-8 12 4 10-8 14 6 10-4 12 10-10 12-16-2-12 8-14-4Z" fill="rgba(61,92,69,0.32)" stroke="rgba(15,15,14,0.35)" strokeWidth="0.6" />
            <path d="M84 56l12-16 12 16Z M104 46l10-14 10 14Z M178 30l8-12 8 12Z M44 112l10-14 10 14Z" fill="rgba(15,15,14,0.1)" stroke="rgba(15,15,14,0.4)" strokeWidth="0.6" />
            <path d="M24 52C44 56 56 62 72 62S130 78 160 74S196 56 200 44" fill="none" stroke="rgba(15,15,14,0.4)" strokeWidth="0.8" strokeDasharray="1.5 2.5" />
            <text x="132" y="126" fontSize="5.5" fill="currentColor" opacity="0.5" style={{ fontStyle: "italic" }}>the Mire</text>
            <text x="14" y="140" fontSize="5.5" fill="currentColor" opacity="0.5" style={{ fontStyle: "italic" }}>Dartmoor</text>
          </>
        ) : (
          <>
            <path d={LAND_EUROPE} fill="rgba(143,136,122,0.28)" stroke="rgba(15,15,14,0.4)" strokeWidth="0.8" />
            <path d={LAND_ITALY} fill="rgba(143,136,122,0.28)" stroke="rgba(15,15,14,0.4)" strokeWidth="0.8" />
            <path d={LAND_BRITAIN} fill="rgba(143,136,122,0.28)" stroke="rgba(15,15,14,0.4)" strokeWidth="0.8" />
            <path d={LAND_IRELAND} fill="rgba(143,136,122,0.28)" stroke="rgba(15,15,14,0.4)" strokeWidth="0.8" />
            <path d="M126 112l8-8 10 4 8-6 12 6 8-4 10 8-8 10-14-2-10 6-12-4Z" fill="rgba(15,15,14,0.12)" stroke="rgba(15,15,14,0.35)" strokeWidth="0.5" />
            <text x="12" y="76" fontSize="6" fill="currentColor" opacity="0.5" style={{ fontStyle: "italic" }}>the Channel</text>
            <text x="150" y="132" fontSize="5.5" fill="currentColor" opacity="0.5" style={{ fontStyle: "italic" }}>the Alps</text>
          </>
        )}
        {seen.length > 1 && <polyline points={trail} fill="none" stroke="#7d2230" strokeWidth="1.3" strokeDasharray="3 2" strokeLinejoin="round" />}
        {places.map(([id, p]) => (
          <g key={id}>
            <circle cx={p.x} cy={p.y} r={visited.has(id) ? 2.4 : 1.6} fill={visited.has(id) ? "#7d2230" : "rgba(15,15,14,0.55)"} />
            {(visited.has(id) || id === here_id) && (
              <text x={p.x + 3.5} y={p.y - 2.5} fontSize="5.2" fill="currentColor" stroke="none" style={{ fontFamily: "Cinzel, Georgia, serif" }}>
                {p.name}
              </text>
            )}
          </g>
        ))}
        <circle cx={here.x} cy={here.y} r="5.5" fill="none" stroke="#7d2230" strokeWidth="1.4" />
      </svg>
      <figcaption className="mt-1 font-heading text-[0.62rem] uppercase tracking-[0.2em] text-ink-soft">
        You are at {here.name}. A sketch, not a survey.
      </figcaption>
    </figure>
  );
}
