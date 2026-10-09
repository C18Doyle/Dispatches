function WarRoomDocOKW({ campaign, modeInfo, easy }) {
  return (
    <>
      <div className="flex justify-between items-start mb-3">
        <div style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="text-left">
          <div className="text-[10px] font-bold tracking-[0.18em]" style={{ color: campaign.accent }}>
            OBERKOMMANDO DER WEHRMACHT
          </div>
          <div className="text-[9px] text-[#555] mt-0.5">{campaign.name}</div>
        </div>
        <div className="briefing-stamp-okw" style={{ border: `2.5px solid ${campaign.accent}`, color: campaign.accent }}>
          GEHEIM
        </div>
      </div>
      <div className="briefing-fields-okw" style={{ borderTop: "1px solid #ccc4b8", borderBottom: "1px solid #ccc4b8" }}>
        <span>BETR.</span>
        <span>
          <b>{campaign.name}</b>
        </span>
        <span>DATUM.</span>
        <span>{campaign.dates}</span>
      </div>
      {(
        <>
          {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id] && (
            <p className="text-[14px] italic leading-relaxed mb-4 text-[#000000] text-left" style={{ fontFamily: "'Courier Prime', monospace" }}>
              "{CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].text}"
              {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].speaker && (
                <span className="block not-italic text-[11px] uppercase tracking-widest font-semibold mt-1 opacity-60" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  — {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].speaker}, {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].date}
                </span>
              )}
            </p>
          )}
        </>
      )}
      <div className="text-[9px] tracking-[0.08em] text-left pt-2 mb-6" style={{ borderTop: "1px solid #ccc4b8", color: "#777", fontFamily: "'IBM Plex Mono', monospace" }}>
        VERTEILER: OKW / OKH / OKM: ROUTINE DISTRIBUTION ONLY
      </div>
    </>
  );
}

function WarRoomDocComandoSupremo({ campaign, modeInfo, easy }) {
  return (
    <>
      <div className="flex justify-between items-start mb-3">
        <div style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="text-left">
          <div className="text-[10px] font-bold tracking-[0.18em]" style={{ color: campaign.accent }}>
            COMANDO SUPREMO: STATO MAGGIORE GENERALE
          </div>
          <div className="text-[9px] text-[#555] mt-0.5">{campaign.name}</div>
        </div>
        <div className="briefing-stamp-okw" style={{ border: `2.5px solid ${campaign.accent}`, color: campaign.accent }}>
          SEGRETO
        </div>
      </div>
      <div className="briefing-fields-okw" style={{ borderTop: "1px solid #ccc4b8", borderBottom: "1px solid #ccc4b8" }}>
        <span>OGGETTO.</span>
        <span>
          <b>{campaign.name}</b>
        </span>
        <span>DATA.</span>
        <span>{campaign.dates}</span>
      </div>
      {(
        <>
          {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id] && (
            <p className="text-[14px] italic leading-relaxed mb-4 text-[#000000] text-left" style={{ fontFamily: "'Courier Prime', monospace" }}>
              "{CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].text}"
              {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].speaker && (
                <span className="block not-italic text-[11px] uppercase tracking-widest font-semibold mt-1 opacity-60" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  — {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].speaker}, {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].date}
                </span>
              )}
            </p>
          )}
        </>
      )}
      <div className="text-[9px] tracking-[0.08em] text-left pt-2 mb-6" style={{ borderTop: "1px solid #ccc4b8", color: "#777", fontFamily: "'IBM Plex Mono', monospace" }}>
        DISTRIBUZIONE: COMANDO SUPREMO: SOLO USO INTERNO
      </div>
    </>
  );
}

function WarRoomDocSTAVKA({ campaign, modeInfo, easy }) {
  return (
    <>
      <div className="flex justify-between items-start mb-1">
        <div style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="text-left">
          <div className="text-[10px] font-bold tracking-[0.14em]" style={{ color: campaign.accent }}>
            СТАВКА ВЕРХОВНОГО ГЛАВНОКОМАНДОВАНИЯ
          </div>
          <div className="text-[9px] text-[#555] mt-0.5">{campaign.name}</div>
        </div>
        <div className="briefing-stamp-stavka" style={{ border: `2.5px solid ${campaign.accent}`, color: campaign.accent }}>
          СОВ.
          <br />
          СЕКРЕТНО
          <br />
          (TOP SECRET)
        </div>
      </div>
      <div className="text-left mt-2" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 15, color: campaign.accent }}>
        ПРИКАЗ № 001
      </div>
      <div className="text-[10px] tracking-[0.2em] text-left mb-1" style={{ color: "#666", fontFamily: "'IBM Plex Mono', monospace" }}>
        {campaign.dates}
      </div>
      <hr className="briefing-rule-stavka" style={{ color: campaign.accent }} />
      {(
        <>
          {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id] && (
            <div className="mb-4 text-left pl-3" style={{ borderLeft: `3px solid ${campaign.accent}` }}>
              <p className="text-[14px] italic leading-relaxed text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
                "{CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].text}"
              </p>
              {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].speaker && (
                <span className="block text-[11px] uppercase tracking-widest font-semibold mt-1 opacity-60" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  — {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].speaker}, {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].date}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

function WarRoomDocSHAEF({ campaign, modeInfo, easy }) {
  return (
    <>
      <div className="flex gap-3">
        <div className="flex-1 text-left">
          <div className="flex justify-between items-start mb-2">
            <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              <div className="text-[10px] font-bold tracking-[0.14em]" style={{ color: campaign.accent }}>
                SUPREME HEADQUARTERS
              </div>
              <div className="text-[9px] text-[#555] mt-0.5">{campaign.name}</div>
            </div>
            <div
              className="text-center px-1.5 py-1 text-[10px] font-bold tracking-[0.12em]"
              style={{
                border: `2px solid ${campaign.accent}`,
                color: campaign.accent,
                fontFamily: "'IBM Plex Mono', monospace",
                boxShadow: `0 0 0 3px #eff3f4, 0 0 0 4px ${campaign.accent}`,
              }}
            >
              TOP
              <br />
              SECRET
            </div>
          </div>
          <div className="text-[10px] leading-[1.7] mb-3" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#333" }}>
            <b style={{ color: campaign.accent }}>FROM:</b> SHAEF FORWARD
            <br />
            <b style={{ color: campaign.accent }}>TO:</b> ALL ARMY GROUP COMMANDS
            <br />
            <b style={{ color: campaign.accent }}>RE:</b> {campaign.name}
          </div>
        </div>
        <div className="briefing-rail-shaef shrink-0" style={{ width: 64 }}>
          <span className="block font-bold mb-1" style={{ color: campaign.accent, letterSpacing: "0.1em" }}>
            DISTR.
          </span>
          EISENHOWER
          <br />
          BRADLEY
          <br />
          MONTGOMERY
          <br />
          TEDDER
          <br />
          FILE
        </div>
      </div>
      {(
        <>
          {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id] && (
            <p className="text-[14px] italic leading-relaxed mb-4 text-[#000000] text-left pt-3" style={{ borderTop: "1px dashed #aab8b5", fontFamily: "'Courier Prime', monospace" }}>
              "{CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].text}"
              {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].speaker && (
                <span className="block not-italic text-[11px] uppercase tracking-widest font-semibold mt-1 opacity-60" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  — {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].speaker}, {CAMPAIGN_WAR_ROOM_QUOTE[campaign.id].date}
                </span>
              )}
            </p>
          )}
        </>
      )}
    </>
  );
}

function WireBulletin({ campaign, headline, onContinue }) {
  const paperTint = { german: "#fbfaf8", soviet: "#f8f1e2", allied: "#eff3f4", italy: "#f2f0e8" }[campaign.id] || "#ffffff";
  const agency = WIRE_AGENCY[campaign.id] || WIRE_AGENCY.german;
  const headingRef = useRef(null);
  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
  }, []);
  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <h1 ref={headingRef} tabIndex={-1} className="sr-only outline-none">
          Wire bulletin
        </h1>
        <div className="wire-tear" style={{ "--wire-paper": paperTint }}></div>
        <div className="px-5 py-5" style={{ backgroundColor: paperTint }}>
          <div
            className="flex items-baseline justify-between pb-2 mb-3"
            style={{ borderBottom: `2px solid ${campaign.accent}` }}
          >
            <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              <div className="text-xs font-bold tracking-[0.16em]" style={{ color: campaign.accent }}>
                {agency.name}
              </div>
              <div className="text-[9px] text-[#555] mt-0.5">{agency.sub}</div>
            </div>
            <div className="text-[10px] text-[#666] shrink-0" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {headline.month} {headline.year}
            </div>
          </div>
          <h2
            className="text-2xl uppercase leading-tight mb-2.5 text-[#16130f]"
            style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700 }}
          >
            {headline.headline}
          </h2>
          <p className="text-[13px] leading-relaxed mb-3 text-[#2a2622]" style={{ fontFamily: "'Courier Prime', monospace" }}>
            {headline.dek}
          </p>
          <div
            className="text-[9px] pt-2 text-[#888]"
            style={{ borderTop: "1px dashed #ccc4b8", fontFamily: "'IBM Plex Mono', monospace" }}
          >
            WIRE: RELAYED VIA {campaign.name.toUpperCase()}, ROUTINE PRIORITY
          </div>
        </div>
        <div className="wire-tear wire-tear-bottom" style={{ "--wire-paper": paperTint }}></div>
        <button
          onClick={onContinue}
          className="w-full border-2 mt-4 px-4 py-3 text-sm uppercase tracking-[0.2em] font-bold transition-colors duration-150"
          style={{ borderColor: campaign.accent, color: campaign.accent, fontFamily: "'IBM Plex Mono', monospace", background: "transparent" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Checkpoint map — per docs/specs/historical-divergence-and-checkpoint-map.md. Deliberately NOT
// a live/simulated territory map (scoped out as a much larger, separate project) — a small fixed
// set of pre-drawn base illustrations, one per calendar year each campaign's nodes actually span
// (real spans confirmed from node dates during the spec's research pass, not the campaign header
// strings). Overlaid with a marker per Historical Divergence Mode fork that has ALREADY been
// revealed to the player this run (never shown before its own Wire Bulletin has fired — the map
// must not spoil a fork the player hasn't discovered yet).
const CAMPAIGN_MAP_YEARS = {
  german: [1940, 1941, 1942, 1943, 1944, 1945],
  soviet: [1941, 1942, 1943, 1944, 1945],
  allied: [1940, 1941, 1942, 1943, 1944, 1945],
  italy: [1940, 1941, 1942, 1943, 1944, 1945],
};

// Ownership-by-region overlay on top of the checkpoint map art, added after Craig's
// "colour each nation by owner" request. Reuses MAP_YEAR_STATUS/mapOverrides/
// STATUS_COLORS — the exact same historically-researched, run-aware data the schematic
// Continental Situation map (EuropeMap, below) already renders — projected onto real
// geography instead of schematic disc positions, so the two maps can never disagree
// with each other about what a given run's territorial situation is.
//
// Region shapes live in assets/maps/regions.json (built by
// tools/build_region_geometry.py from modern country outlines, with hand-approximated
// interwar shapes substituted for Poland/Germany/Czechoslovakia — see that script's
// header comment for the full account of what's exact vs. approximated). This bbox
// table MUST match tools/generate_placeholder_maps.py's CAMPAIGNS[...].bbox exactly —
// it's what makes the region overlay line up with the coastline art rendered from that
// same bbox via Basemap.
const CAMPAIGN_MAP_BBOX = {
  german: { llcrnrlat: 32, urcrnrlat: 71, llcrnrlon: -10, urcrnrlon: 55 },
  soviet: { llcrnrlat: 38, urcrnrlat: 66, llcrnrlon: 5, urcrnrlon: 62 },
  allied: { llcrnrlat: 27, urcrnrlat: 60, llcrnrlon: -12, urcrnrlon: 42 },
  // Round 10 (Craig: "The Italian map looks centred a little low... the war outcome is
  // driven a lot by what happens in Europe so that may need to be a little more
  // visible"). The original box (-3 to 47) put Italy's own northern border right at the
  // very top edge and gave the entire lower ~80% of the frame to empty Sahara — nothing
  // Italy's campaign ever puts a pin or a region status on sits south of Egypt/Libya
  // (~19-22°N; MAP_LANDMARKS' southernmost entry, Cairo, is 30°N), so that space was pure
  // waste, and it came directly at Central Europe's expense: Austria, Hungary, and the
  // full Balkans/Yugoslavia cluster were cramped into a thin strip and Germany/Poland cut
  // off entirely, despite Italy's Axis alliance and the eastern front's course being
  // central to this campaign's own text. Shifted the whole window north instead of just
  // padding it: raised both edges (-3→10, 47→54) rather than only the top, so Italy's
  // own peninsula moves from pinned-at-the-frame-edge to comfortably upper-middle, with
  // Egypt/Libya/Fr. N. Africa still fully in frame below it and Austria/Hungary/most of
  // Germany and Poland now visible above it.
  italy: { llcrnrlat: 10, urcrnrlat: 54, llcrnrlon: -8, urcrnrlon: 52 },
};
const MAP_OVERLAY_W = 800;
const MAP_OVERLAY_H = 600;

// Bundled at build time (see the REGIONS_GEOMETRY import above) rather than fetched at
// runtime — kept as a resolved Promise so CheckpointMapRegions's existing async-loading
// effect (setGeometry once it resolves) doesn't need to change at all, just what feeds it.
function loadRegionGeometry() {
  return Promise.resolve(REGIONS_GEOMETRY);
}

// Spherical Web Mercator + the same fix_aspect=False linear stretch Basemap used to
// render the background art (tools/generate_placeholder_maps.py's render_geography) —
// reimplemented here so the browser doesn't need a mapping library just to match a
// projection that was only ever a bbox-to-800x600 stretch to begin with.
function mercY(lat) {
  return Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
}
function regionPathD(rings, bbox) {
  const x0 = bbox.llcrnrlon, x1 = bbox.urcrnrlon;
  const y0 = mercY(bbox.llcrnrlat), y1 = mercY(bbox.urcrnrlat);
  return (rings || [])
    .map((ring) => {
      const pts = ring.map(([lon, lat]) => {
        const px = ((lon - x0) / (x1 - x0)) * MAP_OVERLAY_W;
        const py = (1 - (mercY(lat) - y0) / (y1 - y0)) * MAP_OVERLAY_H;
        return `${px.toFixed(1)},${py.toFixed(1)}`;
      });
      return pts.length ? `M${pts.join("L")}Z` : "";
    })
    .filter(Boolean)
    .join(" ");
}
// Same bbox-to-pixel projection as regionPathD, for a single (lon, lat) point rather
// than a closed ring — used by the landmark pins and the Vichy line below.
function projectLonLat(lon, lat, bbox) {
  const x0 = bbox.llcrnrlon, x1 = bbox.urcrnrlon;
  const y0 = mercY(bbox.llcrnrlat), y1 = mercY(bbox.urcrnrlat);
  const px = ((lon - x0) / (x1 - x0)) * MAP_OVERLAY_W;
  const py = (1 - (mercY(lat) - y0) / (y1 - y0)) * MAP_OVERLAY_H;
  return [px, py];
}

// Simplified 1940-42 demarcation line between German-occupied and Vichy-administered
// France: from the Spanish frontier near Hendaye, north past Bordeaux (the occupied
// zone reached the Atlantic coast for the U-boat ports, well south of the line's
// average latitude) to its furthest-north bulge around Tours/Vierzon, then back
// southeast to the Swiss border near Geneva. ~18 points simplified from the real
// line's many small jogs — accurate enough at this map's scale to read as "occupied
// north and west coast, Vichy-administered south," which is the historically
// important shape, not a survey-grade trace.
const VICHY_LINE = [
  [-1.77, 43.35], [-0.85, 43.85], [-0.30, 44.35], [-0.15, 44.85], [0.05, 45.35],
  [0.45, 45.85], [0.85, 46.4], [1.25, 47.0], [1.95, 47.22], [2.45, 47.08],
  [3.0, 46.85], [3.33, 46.57], [3.85, 46.5], [4.4, 46.55], [4.85, 46.78],
  [5.3, 46.9], [5.75, 46.5], [6.05, 46.2],
];

// Round 13 (Craig: "hidden territories lines... to allow the campaign to look like it is
// progressing"): two more high-water-mark lines, same idea as the Vichy line above — a
// simplified real front position, not a player-choice-driven boundary, shown only for the
// single year it's actually true of so the map visibly changes as a run advances rather than
// sitting static through the whole USSR occupation window the way a single "contested" tint
// does. Both lines mark the deepest point of the respective German offensive before the
// following winter/summer counteroffensive pushed back past it.
//
// BARBAROSSA_LINE: the farthest advance in the Moscow-centered autumn 1941 offensive — from
// the Tikhvin salient near Leningrad, past the closest approach to Moscow itself (Soviet
// counterattack retook Yakhroma/Krasnaya Polyana within days of the line's absolute peak, so
// this is the honest high point, not a line that was ever stable), through Tula's southern
// flank, to Rostov-on-Don — taken in late November 1941 and lost again to a Soviet counterattack
// within a week, the shortest-held of any city on this line. Shown only for statusYear 1941.
const BARBAROSSA_LINE = [
  [33.51, 59.65], [35.9, 57.9], [37.35, 56.4], [37.0, 55.95], [37.55, 54.85],
  [38.9, 53.9], [39.72, 47.23],
];

// CASE_BLUE_LINE: the farthest advance of the summer 1942 southern offensive (Fall Blau) —
// from Voronezh, down the Volga to Stalingrad, and into the North Caucasus foothills toward
// Mozdok, the deepest point German forces reached in that theater and never crossed. Shown
// only for statusYear 1942.
const CASE_BLUE_LINE = [
  [39.2, 51.67], [42.5, 50.0], [44.5, 48.71], [44.63, 43.75],
];

// Small strategic points too minor to be their own MAP_REGION (none is a full country)
// but too load-bearing on the map's own narrative content — the Gibraltar chokepoint,
// the airborne invasion of Crete, the Dodecanese campaign — to leave entirely unmarked.
// Real coordinates; shown only when a campaign's bbox actually covers them (the soviet
// theater never does). Malta was on this list too until round 8 promoted it to a full
// MAP_REGION (its own siege/convoy-war narrative content earned it a full colorable
// region, not just a pin) — removed from here so it doesn't get both a landmark dot AND
// a region polygon/label sitting on the same spot.
const MAP_LANDMARKS = [
  { id: "gibraltar", name: "Gibraltar", lon: -5.35, lat: 36.14 },
  { id: "crete", name: "Crete", lon: 25.13, lat: 35.34 },
  { id: "dodecanese", name: "Dodecanese", lon: 28.22, lat: 36.45 },
];

// A curated set of orientation cities — capitals and the handful of named battles this
// game's own text leans on most (Stalingrad, Leningrad) — not an exhaustive gazetteer.
// Drawn smaller and lighter than the landmark pins above so they read as background
// orientation, not competing strategic markers.
const MAP_CITIES = [
  { id: "london", name: "London", lon: -0.13, lat: 51.51 },
  { id: "paris", name: "Paris", lon: 2.35, lat: 48.86 },
  { id: "berlin", name: "Berlin", lon: 13.41, lat: 52.52 },
  { id: "rome", name: "Rome", lon: 12.5, lat: 41.9 },
  { id: "vienna", name: "Vienna", lon: 16.37, lat: 48.21 },
  { id: "budapest", name: "Budapest", lon: 19.04, lat: 47.5 },
  { id: "warsaw", name: "Warsaw", lon: 21.02, lat: 52.23 },
  { id: "moscow", name: "Moscow", lon: 37.62, lat: 55.75 },
  { id: "leningrad", name: "Leningrad", lon: 30.31, lat: 59.94 },
  { id: "stalingrad", name: "Stalingrad", lon: 44.5, lat: 48.71 },
  { id: "cairo", name: "Cairo", lon: 31.24, lat: 30.04 },
  { id: "ankara", name: "Ankara", lon: 32.85, lat: 39.93 },
];

// MAP_YEAR_STATUS entries are year-END snapshots (see EuropeMap's own comment on this) —
// showing the current node's own year before its choice is resolved leaks that choice's
// outcome. Same cap EuropeMap applies, reused here since CheckpointMap has no scrubber:
// it just shows the latest year safe to show.
function cappedStatusYear(year, resolved) {
  const rawMax = Math.max(1939, Math.min(1945, year || 1945));
  return resolved ? rawMax : Math.max(1939, rawMax - 1);
}
// Round 24 (map accuracy): the checkpoint map's baseline now follows the calendar instead of year-end snapshots.
// Each region has a list of [date, status] entries, the date being the day the status began. A node's map shows the
// state on the day its report opens (a date like "APRIL 1940" counts as the first of the month, "LATE MAY 1940" as the
// 21st, "SEPTEMBER 21-25, 1944" as the 21st, a season as the day it begins), so nothing is shown that the report is
// about to decide and nothing is left out that had already happened. Run-specific changes still come from
// mapOverrides. The year-end table (MAP_YEAR_STATUS) stays for the Continental Situation panel; check-map.mjs keeps
// the two in step.
const MAP_TIMELINE = {
  germany: [["1939-01-01", "axis"], ["1945-01-20", "contested"], ["1945-05-08", "divided"]],
  poland: [["1939-01-01", "neutral"], ["1939-09-01", "contested"], ["1939-10-06", "axis"], ["1944-07-22", "contested"], ["1945-02-01", "soviet"]],
  britain: [["1939-01-01", "allied"]],
  ireland: [["1939-01-01", "neutral"]],
  france: [["1939-01-01", "allied"], ["1940-05-13", "contested"], ["1940-06-22", "axisAllied"], ["1942-11-11", "axis"], ["1944-06-06", "contested"], ["1944-08-25", "allied"]],
  benelux: [["1939-01-01", "neutral"], ["1940-05-10", "contested"], ["1940-05-28", "axis"], ["1944-09-03", "contested"], ["1945-05-05", "allied"]],
  denmark: [["1939-01-01", "neutral"], ["1940-04-09", "axis"], ["1945-05-05", "allied"]],
  norway: [["1939-01-01", "neutral"], ["1940-04-09", "contested"], ["1940-05-03", "axis"], ["1945-05-08", "allied"]],
  sweden: [["1939-01-01", "neutral"]],
  switzerland: [["1939-01-01", "neutral"]],
  iberia: [["1939-01-01", "neutral"]],
  czechia: [["1939-01-01", "axis"], ["1945-05-09", "soviet"]],
  austria: [["1939-01-01", "axis"], ["1945-03-29", "contested"], ["1945-05-08", "divided"]],
  hungary: [["1939-01-01", "axisAllied"], ["1944-10-06", "contested"], ["1945-04-04", "soviet"]],
  baltics: [["1939-01-01", "neutral"], ["1940-06-15", "soviet"], ["1941-07-01", "axis"], ["1944-07-10", "contested"], ["1944-10-13", "soviet"]],
  // Round 25: the three army-group zones are now nine (docs/specs/eastern-front-subdivision.md, tools/split-ussr-zones.mjs),
  // so that each front changes on its own day and the Soviet rear never reads "contested". Dates from the standard
  // accounts (Wikipedia and the articles it links); those of Pskov, Gomel, Smolensk, Kharkov, Rostov, Belgorod, Krasnodar
  // and Operation Edelweiss were checked on 2026-10-08, the rest (the Minsk pocket, the autumn 1941 falls of Kharkov and
  // Kursk) are from the standard accounts and are the first to check. A zone is "contested" while a front runs through it
  // and "axis" once the Germans hold nearly all of it.
  //  - Leningrad & Karelia: Pskov falls on 9 July 1941 and the Finns attack in Karelia on the 10th; the zone is clear when
  //    Pskov is retaken on 23 July 1944 (the siege itself was lifted on 27 January 1944).
  //  - Belorussia: invaded on 22 June 1941, and "axis" once Gomel falls on 21 August; Gomel is retaken on 26 November 1943
  //    and the Minsk pocket is cleared by 12 July 1944 (Minsk itself fell on 3 July).
  //  - Central Russia (Smolensk, Bryansk, Orel, Moscow, Kalinin, Voronezh): the Smolensk battle opens on 10 July 1941 and the
  //    zone stays contested, the front never more than a few hundred kilometres from Moscow, until Smolensk is retaken on
  //    25 September 1943.
  //  - Ukraine & Crimea: invaded on 22 June 1941; Kharkov falls on 24 October and most of the zone is Axis-held; the final
  //    liberation of Kharkov on 23 August 1943 puts the front inside it again, and Crimea is cleared on 12 May 1944.
  //  - Don & Volga (Kursk, Belgorod, Rostov, Stalingrad): Belgorod falls on 24-25 October 1941 and Kursk on 3 November,
  //    so the zone is contested until Rostov is retaken on 14 February 1943 (Kursk and Belgorod were retaken on 8 and 9
  //    February); Belgorod is lost again on 18 March and retaken on 5 August 1943, when the Kursk salient was fought over.
  //  - Caucasus: Operation Edelweiss opens on 25 July 1942 (Army Group A crosses the Don; Krasnodar falls on 9-12 August);
  //    Krasnodar is retaken on 12 February 1943 (the Taman bridgehead held out until October, a small part of the zone).
  //  - Northern Russia, Volga & Urals and Kazakhstan & Central Asia are the Soviet rear and never change.
  ussrLeningrad: [["1939-01-01", "soviet"], ["1941-07-10", "contested"], ["1944-07-23", "soviet"]],
  ussrNorthRear: [["1939-01-01", "soviet"]],
  ussrBelarus: [["1939-01-01", "soviet"], ["1941-06-22", "contested"], ["1941-08-21", "axis"], ["1943-11-26", "contested"], ["1944-07-12", "soviet"]],
  ussrMoscow: [["1939-01-01", "soviet"], ["1941-07-10", "contested"], ["1943-09-25", "soviet"]],
  ussrUrals: [["1939-01-01", "soviet"]],
  ussrUkraine: [["1939-01-01", "soviet"], ["1941-06-22", "contested"], ["1941-10-24", "axis"], ["1943-08-23", "contested"], ["1944-05-12", "soviet"]],
  ussrDon: [["1939-01-01", "soviet"], ["1941-10-24", "contested"], ["1943-02-14", "soviet"], ["1943-03-18", "contested"], ["1943-08-05", "soviet"]],
  ussrCaucasus: [["1939-01-01", "soviet"], ["1942-07-25", "contested"], ["1943-02-12", "soviet"]],
  ussrAsia: [["1939-01-01", "soviet"]],
  romania: [["1939-01-01", "neutral"], ["1940-11-23", "axisAllied"], ["1944-08-20", "contested"], ["1944-09-12", "soviet"]],
  italy: [["1939-01-01", "neutral"], ["1940-06-10", "axisAllied"], ["1943-07-10", "contested"], ["1945-05-02", "allied"]],
  yugoslavia: [["1939-01-01", "neutral"], ["1941-04-06", "contested"], ["1941-04-17", "axis"], ["1942-01-01", "contested"], ["1945-05-08", "allied"]],
  greece: [["1939-01-01", "neutral"], ["1940-10-28", "contested"], ["1941-04-27", "axis"], ["1944-10-14", "allied"]],
  albania: [["1939-01-01", "axisAllied"], ["1942-09-16", "contested"], ["1944-11-29", "allied"]],
  bulgaria: [["1939-01-01", "neutral"], ["1941-03-01", "axisAllied"], ["1944-09-09", "soviet"]],
  finland: [["1939-01-01", "neutral"], ["1939-11-30", "contested"], ["1940-03-13", "neutral"], ["1941-06-25", "axisAllied"], ["1944-06-09", "contested"], ["1945-04-27", "neutral"]],
  nwAfrica: [["1939-01-01", "allied"], ["1940-06-25", "axisAllied"], ["1942-11-12", "allied"]],
  libya: [["1939-01-01", "axisAllied"], ["1941-01-05", "contested"], ["1943-01-23", "allied"]],
  egypt: [["1939-01-01", "allied"], ["1940-09-13", "contested"], ["1940-12-11", "allied"], ["1942-06-26", "contested"], ["1942-11-04", "allied"]],
  turkey: [["1939-01-01", "neutral"], ["1945-02-23", "allied"]],
  malta: [["1939-01-01", "allied"]],
};

const MAP_MONTH_NUMBERS = { JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6, JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12 };
const MAP_SEASON_STARTS = { SPRING: [3, 21], SUMMER: [6, 21], AUTUMN: [9, 22], FALL: [9, 22], WINTER: [12, 21] };

// A node date as a sortable day number (YYYYMMDD), or null when it holds no year.
function nodeDayKey(date) {
  const up = String(date || "").toUpperCase();
  const ym = up.match(/\b(19[34]\d)\b/);
  if (!ym) return null;
  const year = Number(ym[1]);
  let month = null;
  let at = Infinity;
  for (const [name, n] of Object.entries(MAP_MONTH_NUMBERS)) {
    const i = up.indexOf(name);
    if (i >= 0 && i < at) {
      month = n;
      at = i;
    }
  }
  let day = 1;
  if (month) {
    const dm = up.slice(at).match(/^[A-Z]+\s+(\d{1,2})(?!\d)/);
    if (dm && Number(dm[1]) >= 1 && Number(dm[1]) <= 31) day = Number(dm[1]);
    else if (/\bLATE\b/.test(up.slice(0, at))) day = 21;
    else if (/\bMID\b/.test(up.slice(0, at))) day = 15;
  } else {
    let sAt = Infinity;
    for (const [name, [m, d]] of Object.entries(MAP_SEASON_STARTS)) {
      const i = up.indexOf(name);
      if (i >= 0 && i < sAt) {
        sAt = i;
        month = m;
        day = d;
      }
    }
    if (!month) {
      if (/\bLATE\b/.test(up)) month = 10;
      else if (/\bMID\b/.test(up)) {
        month = 6;
        day = 15;
      } else month = 1;
    }
  }
  return year * 10000 + month * 100 + day;
}

// Every region's status on the day just before dayKey (a node's own events are never in its own map).
function baselineStatuses(dayKey) {
  const out = {};
  for (const [id, entries] of Object.entries(MAP_TIMELINE)) {
    let status = entries[0][1];
    for (const [d, s] of entries) {
      if (Number(d.replace(/-/g, "")) < dayKey) status = s;
      else break;
    }
    out[id] = status;
  }
  return out;
}

// `dayKey` (from nodeDayKey) puts the baseline on the node's own date; without it the year-end table is used.
function currentRegionStatuses(statusYear, flags, meters, dayKey) {
  const base = dayKey != null ? baselineStatuses(dayKey) : MAP_YEAR_STATUS[statusYear] || MAP_YEAR_STATUS[1940];
  const { o } = mapOverrides(statusYear, flags, meters, dayKey);
  return { ...base, ...o };
}
function CheckpointMapRegions({ campaignId, statusYear, flags, meters, statuses: givenStatuses, divergedRegions, selectedRegion, setSelectedRegion, highlightRegions, accent, changedRegions }) {
  const [geometry, setGeometry] = useState(null);
  useEffect(() => {
    let cancelled = false;
    loadRegionGeometry()
      .then((g) => {
        if (!cancelled) setGeometry(g);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const bbox = CAMPAIGN_MAP_BBOX[campaignId];
  if (!geometry || !bbox) return null;
  const statuses = givenStatuses || currentRegionStatuses(statusYear, flags, meters);
  // STATUS_COLORS.divided is "url(#divideGradient)", resolved against TheaterGraph's own
  // <defs> for the schematic map. This SVG can be mounted at the same time as that one
  // (the briefing's "Show Continental Situation" panel and this checkpoint map modal can
  // both be open), so reusing the same id would be a duplicate-SVG-id — this map defines
  // its own gradient under its own id (below) instead of trusting STATUS_COLORS.divided.
  const fillFor = (status) => (status === "divided" ? "url(#checkpointDivideGradient)" : STATUS_COLORS[status]);
  // Computed once so the label pass below can reuse each region's fill/geometry without
  // redoing the lookup, and so labels only ever appear for a region that actually drew
  // (same "does this region have geometry and a status color" gate as the path itself).
  const drawnRegions = MAP_REGIONS.map((r) => {
    const entry = geometry[r.id];
    const status = statuses[r.id];
    const fill = fillFor(status);
    const d = fill && entry && regionPathD(entry.rings, bbox);
    return d ? { ...r, d, fill, label: entry.label } : null;
  }).filter(Boolean);
  const highlightSet = new Set(highlightRegions || []);
  return (
    <svg
      viewBox={`0 0 ${MAP_OVERLAY_W} ${MAP_OVERLAY_H}`}
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
      aria-hidden={divergedRegions && divergedRegions.size > 0 ? undefined : true}
    >
      <defs>
        {/* West/east occupation-zone split for "divided" (Germany and Austria, end of
            1945): objectBoundingBox (the SVG default) means this one definition scales
            to each path's own bounding box, so every divided region gets its own correctly
            proportioned half-and-half fill from a single <linearGradient>. */}
        <linearGradient id="checkpointDivideGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={STATUS_COLORS.allied} />
          <stop offset="50%" stopColor={STATUS_COLORS.allied} />
          <stop offset="50%" stopColor={STATUS_COLORS.soviet} />
          <stop offset="100%" stopColor={STATUS_COLORS.soviet} />
        </linearGradient>
        {/* Keys the color overlay's visibility to the base map's OWN land/sea pixels
            (generate_placeholder_maps.py's render_land_mask: white land, black sea, one per
            campaign) rather than trusting regions.json's polygons to line up with the
            coastline actually drawn underneath: they never will exactly, since they trace
            two independently-sourced coastlines. SVG masks read luminance, so white passes
            the color group through and black blocks it: sea and lakes (rendered black in the
            mask, same as sea) are never tinted no matter how a region's polygon happens to
            fall, which is also what lets polygon_rings() grow regions slightly to close gaps
            between neighbors (build_region_geometry.py) without fear of coloring the water. */}
        <mask id="checkpointLandMask" maskContentUnits="userSpaceOnUse">
          <image
            href={`assets/maps/${campaignId}/mask.png`}
            x="0"
            y="0"
            width={MAP_OVERLAY_W}
            height={MAP_OVERLAY_H}
            preserveAspectRatio="none"
          />
        </mask>
      </defs>
      {/* Fill pass only, grouped so semi-transparency is relative to the base map, not to
          each other: every region draws at full fillOpacity inside one group whose own
          opacity is 0.42, so an overlapping sliver between two regions (buffer-created or
          otherwise) shows whichever region is on top, never the blended third color two
          independently semi-transparent paths would produce. Masked to land/sea (above) so
          the fill never tints water regardless of how the polygon itself falls. */}
      <g mask="url(#checkpointLandMask)" opacity={0.42}>
        {drawnRegions.map((r) => (
          <path key={r.id} d={r.d} fill={r.fill} style={{ pointerEvents: "none" }} />
        ))}
      </g>
      {/* Small unmasked status dot for "small"-tier regions (round 8: just Malta): at this
          map's scale (a single 800x600 image spanning the whole German theater bbox, ~65
          degrees of longitude), a real island under 0.03 sq degrees is one or two pixels,
          which the land mask above only barely paints at all (see
          tools/generate_placeholder_maps.py's Basemap resolution note) and the 0.42-opacity
          fill group renders as an imperceptible tint on top of. Rather than ship a region
          whose ownership color is technically correct but never actually visible, draw its
          status color as a small always-visible dot at the label point too: same idea as
          MAP_CITIES' dot-plus-label below, just colored by status instead of fixed ink. */}
      {drawnRegions
        .filter((r) => MAP_REGION_SIZE[r.id] === "small")
        .map((r) => {
          const [px, py] = projectLonLat(r.label[0], r.label[1], bbox);
          // Offset above the label point — the name text below is centered exactly on
          // (px, py) (see the label pass further down), so the dot sits just clear of it
          // rather than hiding underneath the text's own stroke halo.
          return <circle key={`dot-${r.id}`} cx={px} cy={py - 8} r={2.4} fill={r.fill} stroke="#241d12" strokeWidth={0.6} style={{ pointerEvents: "none" }} />;
        })}
      {/* Base political border grid, unmasked: every real inter-region border drawn
          exactly once. Precomputed in build_region_geometry.py (border_lines()) from a
          topology shared across every region, so two neighbors' border lines are
          byte-identical instead of each region stroking its own independently-built
          outline (which used to draw every shared border twice, at whatever the old
          per-region buffer happened to leave a hair's difference between), and a
          region's coastal edge simply never appears in this list at all, since nothing
          else claims that boundary, so the base map's own coastline ink is left as the
          only line drawn there. Fixes both halves of Craig's round-8 report: "we don't
          need the little black outline just around the countries especially the sea"
          and "double border black lines should be clamped together into one". */}
      {(geometry.__interiorBorders__ || []).map((line, i) => (
        <polyline
          key={`ibdr-${i}`}
          points={line.map(([lon, lat]) => projectLonLat(lon, lat, bbox).map((n) => n.toFixed(1)).join(",")).join(" ")}
          fill="none"
          stroke="#2a2015"
          strokeOpacity={0.55}
          strokeWidth={1}
          style={{ pointerEvents: "none" }}
        />
      ))}
      {/* Diverged-region emphasis + click/keyboard handling, unmasked. The grid above
          already draws every region's ordinary border, so this pass only has work to do
          for a region that has actually diverged from the historical record: its own
          dashed highlight on top of the grid, and the hit area to inspect why (hit-
          testing follows the path's geometry, not the fill mask, so it's unaffected by
          the fill pass being masked out over water). selectedRegion can only ever be a
          diverged region's id (see the onClick/onKeyDown below), so isDiverged implies
          isSelected is meaningful, not the reverse. */}
      {drawnRegions.map((r) => {
        const isDiverged = !!(divergedRegions && divergedRegions.has(r.id));
        if (!isDiverged) return null;
        const isSelected = selectedRegion === r.id;
        return (
          <path
            key={`border-${r.id}`}
            d={r.d}
            fill="none"
            stroke={isSelected ? "#0a0a0a" : "#7a2e2e"}
            strokeOpacity={0.9}
            strokeWidth={isSelected ? 2.6 : 1.8}
            strokeDasharray="3,2"
            style={{ pointerEvents: "auto", cursor: "pointer" }}
            role="button"
            tabIndex={0}
            aria-label={`${r.name}, diverged from the historical record. ${isSelected ? "Selected. Activate to deselect." : "Activate to see why."}`}
            onClick={setSelectedRegion ? () => setSelectedRegion(isSelected ? null : r.id) : undefined}
            onKeyDown={
              setSelectedRegion
                ? (e) => {
                    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                      e.preventDefault();
                      setSelectedRegion(isSelected ? null : r.id);
                    }
                  }
                : undefined
            }
          />
        );
      })}
      {highlightSet.size > 0 &&
        drawnRegions
          .filter((r) => highlightSet.has(r.id))
          .map((r) => (
            // The current node's own region(s) — same idea as EuropeMap's enlarged disc
            // for a highlighted region, adapted to a filled polygon: a bright halo ring
            // in the campaign's own accent color, drawn over the base fill/border so it
            // reads at a glance without changing the region's actual ownership color.
            <path key={`hl-${r.id}`} d={r.d} fill="none" stroke={accent || "#c9a227"} strokeOpacity={0.85} strokeWidth={4} style={{ pointerEvents: "none" }} />
          ))}
      {changedRegions &&
        changedRegions.size > 0 &&
        drawnRegions
          .filter((r) => changedRegions.has(r.id))
          .map((r) => (
            // A brief flash on any region whose status differs from what this player last
            // saw on this map — territory that moved while they weren't looking. Animates
            // a few times then settles back to invisible (fill="remove", the SVG default,
            // reverts to this element's own base strokeOpacity={0}); it's a one-time "look
            // here," not a lasting decoration like the highlight ring above.
            <path key={`chg-${r.id}`} d={r.d} fill="none" stroke="#f5efe0" strokeOpacity={0} strokeWidth={3.2} style={{ pointerEvents: "none" }}>
              <animate attributeName="stroke-opacity" values="0;0.95;0" dur="1.1s" repeatCount="3" />
            </path>
          ))}
      {drawnRegions.map((r) => {
        if (!r.label) return null;
        const [px, py] = projectLonLat(r.label[0], r.label[1], bbox);
        // Outside the visible frame — Ussr's representative point in particular sits
        // well east of most campaigns' bbox — so skip it rather than draw an
        // off-screen <text> with no visual effect.
        if (px < -20 || px > MAP_OVERLAY_W + 20 || py < -20 || py > MAP_OVERLAY_H + 20) return null;
        const tier = MAP_REGION_SIZE[r.id] || "medium";
        const fontSize = tier === "massive" ? 11 : tier === "large" ? 10 : tier === "medium" ? 8.5 : 7;
        return (
          <text
            key={`label-${r.id}`}
            x={px}
            y={py}
            fontSize={fontSize}
            fill="#241d12"
            stroke="#f2ead9"
            strokeWidth={2}
            paintOrder="stroke"
            textAnchor="middle"
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, pointerEvents: "none" }}
          >
            {r.name}
          </text>
        );
      })}
      {statuses.france === "axisAllied" && (
        <polyline
          points={VICHY_LINE.map(([lon, lat]) => projectLonLat(lon, lat, bbox).map((n) => n.toFixed(1)).join(",")).join(" ")}
          fill="none"
          stroke="#3a2f1d"
          strokeWidth={1.6}
          strokeDasharray="5,4"
          strokeOpacity={0.8}
          style={{ pointerEvents: "none" }}
        />
      )}
      {statusYear === 1941 && (
        <polyline
          points={BARBAROSSA_LINE.map(([lon, lat]) => projectLonLat(lon, lat, bbox).map((n) => n.toFixed(1)).join(",")).join(" ")}
          fill="none"
          stroke="#3a2f1d"
          strokeWidth={1.6}
          strokeDasharray="5,4"
          strokeOpacity={0.8}
          style={{ pointerEvents: "none" }}
        />
      )}
      {statusYear === 1942 && (
        <polyline
          points={CASE_BLUE_LINE.map(([lon, lat]) => projectLonLat(lon, lat, bbox).map((n) => n.toFixed(1)).join(",")).join(" ")}
          fill="none"
          stroke="#3a2f1d"
          strokeWidth={1.6}
          strokeDasharray="5,4"
          strokeOpacity={0.8}
          style={{ pointerEvents: "none" }}
        />
      )}
      {MAP_CITIES.filter(
        (c) => c.lon >= bbox.llcrnrlon && c.lon <= bbox.urcrnrlon && c.lat >= bbox.llcrnrlat && c.lat <= bbox.urcrnrlat
      ).map((c) => {
        const [px, py] = projectLonLat(c.lon, c.lat, bbox);
        return (
          <g key={c.id} style={{ pointerEvents: "none" }}>
            <circle cx={px} cy={py} r={1.6} fill="#241d12" stroke="#f2ead9" strokeWidth={0.6} />
            <text
              x={px + 4}
              y={py + 2.5}
              fontSize={7}
              fill="#241d12"
              stroke="#f2ead9"
              strokeWidth={2}
              paintOrder="stroke"
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontStyle: "italic" }}
            >
              {c.name}
            </text>
          </g>
        );
      })}
      {MAP_LANDMARKS.filter(
        (lm) => lm.lon >= bbox.llcrnrlon && lm.lon <= bbox.urcrnrlon && lm.lat >= bbox.llcrnrlat && lm.lat <= bbox.urcrnrlat
      ).map((lm) => {
        const [px, py] = projectLonLat(lm.lon, lm.lat, bbox);
        return (
          <g key={lm.id} style={{ pointerEvents: "none" }}>
            <circle cx={px} cy={py} r={3} fill="#1a1410" stroke="#f2ead9" strokeWidth={1} />
            <text
              x={px + 5}
              y={py + 3}
              fontSize={9}
              fill="#1a1410"
              stroke="#f2ead9"
              strokeWidth={2.5}
              paintOrder="stroke"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {lm.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function CheckpointMap({ campaign, year, flags, meters, resolved, seenWireHeadlines, onClose, nodeId, lastSeenMapStatuses, onStatusesChange, history, embedded = false, review = null, endDate = null }) {
  const highlightRegions = (NODE_HIGHLIGHT_REGIONS[campaign.id] || {})[nodeId];
  const years = CAMPAIGN_MAP_YEARS[campaign.id] || [year];
  const forks = DIVERGENCE_FORKS[campaign.id] || [];
  // Round 16 (Craig, after playing: "reactive to each choice ... scroller to work backwards
  // and forwards like a timeline"): the Round 13 year-only scrubber always re-applied the
  // player's CURRENT, final flags to whichever year was selected — scrubbing "back" never
  // showed what the map actually looked like at that point in the run, just a year-gated
  // slice of the ending state. Fixed by reading the same per-decision flags/meters snapshots
  // the Rewind feature already keeps (`history` — one entry per decision made, each carrying
  // the flags/meters as they stood right after that decision) instead of reapplying live
  // flags across a fixed year list.
  //
  // Round 17 fix: EVERY entry gets the same cap, not just the last one. MAP_YEAR_STATUS
  // entries are coarse, year-END snapshots — a node dated April 1941 is not accurately
  // represented by the 1941 baseline (which already bakes in everything that happens THROUGH
  // December), only by 1940's. Capping only the last entry (the original Round 16 version of
  // this comment reasoned "past decisions are already resolved, so their own year is safe")
  // was wrong: being resolved doesn't mean the calendar year is over. That bug is exactly what
  // Craig caught — France not starting blue, and Russia appearing to turn immediately after
  // the Balkans decision, months before Barbarossa is even chosen. Genuinely early or
  // mid-year events that SHOULD be visible sooner than the next year-end baseline (Italy
  // entering the war, Barbarossa actually launching) now go through explicit flag-driven
  // overrides in mapOverrides() instead, the same pattern already used there for every other
  // run-specific divergence.
  const runTimeline = useMemo(() => {
    const historySrc = history && history.length ? history : [{ position: nodeId, flags, meters }];
    // Reports are not always filed in date order (a node dated "1944" can come before one dated "1943"), but a map
    // never goes back in time: each stop takes the latest date, and the latest year, seen so far.
    let latestKey = 0;
    let latestYear = 0;
    const raw = historySrc.map((snap, i) => {
      const isLast = i === historySrc.length - 1;
      const s = resolveStage(campaign, snap.position, snap.flags || flags, snap.meters || meters);
      latestYear = Math.max(latestYear, yearFrom(s.date, 1940));
      const rawYear = latestYear;
      const statusYear = cappedStatusYear(rawYear, false);
      const dayKey = nodeDayKey(s.date);
      if (dayKey != null) latestKey = Math.max(latestKey, dayKey);
      const snapFlags = snap.flags || flags;
      const snapMeters = snap.meters || meters || {};
      return {
        date: s.date,
        title: s.title,
        year: statusYear,
        flags: snapFlags,
        meters: snapMeters,
        dayKey: latestKey || null,
        statuses: currentRegionStatuses(statusYear, snapFlags, snapMeters, latestKey || null),
        isLast,
      };
    });
    // Craig: scrub stops only where the map actually changes, not one per decision — most
    // choices are pure resource trades with no territorial effect, and a stop-per-choice
    // slider would mostly look identical from one notch to the next. The first and last
    // entries always survive the filter, so "start" and "latest" are always reachable.
    const kept = [raw[0]];
    for (let i = 1; i < raw.length; i++) {
      const entry = raw[i];
      const prevKept = kept[kept.length - 1];
      const changed = MAP_REGIONS.some((r) => entry.statuses[r.id] !== prevKept.statuses[r.id]);
      if (changed || entry.isLast) kept.push(entry);
    }
    if (embedded && endDate) {
      const endKey = nodeDayKey(endDate);
      const finalKey = endKey != null ? Math.max(endKey, latestKey) : latestKey;
      const endYear = cappedStatusYear(Math.max(latestYear, yearFrom(endDate, 1945)), true);
      kept[kept.length - 1].isLast = false;
      kept.push({
        date: endDate,
        title: "The war ends",
        year: endYear,
        flags,
        meters: meters || {},
        dayKey: finalKey || null,
        statuses: currentRegionStatuses(endYear, flags, meters || {}, finalKey || null),
        isLast: true,
      });
    }
    return kept;
  }, [history, campaign, nodeId, flags, meters, embedded, endDate]);
  const [viewIndex, setViewIndex] = useState(runTimeline.length - 1);
  const current = runTimeline[Math.min(viewIndex, runTimeline.length - 1)];
  const statusYear = current.year;
  const clampedYear = years.includes(statusYear) ? statusYear : years.filter((y) => y <= statusYear).pop() || years[0];
  const revealedForks = forks
    .filter((fk) => flags[fk.flag] && (seenWireHeadlines || []).includes(fk.id))
    // A fork revealed later in the run shouldn't show its marker when scrubbed back to a point
    // before it was ever announced — that would tell the player something before the game did.
    .filter((fk) => (DIVERGENCE_HEADLINES[fk.id] ? DIVERGENCE_HEADLINES[fk.id].year : 0) <= statusYear);
  const src = `assets/maps/${campaign.id}/${clampedYear}.png`;
  const statuses = current.statuses;
  const usedStatuses = [...new Set(MAP_REGIONS.map((r) => statuses[r.id]).filter(Boolean))];
  // notes are otherwise discarded by currentRegionStatuses — recomputed here (mapOverrides
  // is a cheap pure function) so a diverged region can be tapped for the same explanatory
  // text EuropeMap already surfaces for its own theater board. Reads the SELECTED timeline
  // entry's own flags, not the live ones, so the "why" text matches what's on screen at
  // whatever point in the run is being viewed.
  const { notes } = mapOverrides(statusYear, current.flags, current.meters, current.dayKey);
  const divergedRegions = new Set(notes.flatMap((n) => n.regions || []));
  const notesForRegion = (id) => notes.filter((n) => (n.regions || []).includes(id));
  const nameOf = (id) => (MAP_REGIONS.find((r) => r.id === id) || {}).name || id;
  // "Changed since you last checked" only makes sense relative to the latest state — flashing
  // that on an earlier timeline stop would read as "this just changed" when it's really just
  // further from home than the live position, which is a different thing.
  const latestStatuses = runTimeline[runTimeline.length - 1].statuses;
  const changedRegions =
    lastSeenMapStatuses && current.isLast
      ? new Set(MAP_REGIONS.map((r) => r.id).filter((id) => statuses[id] && statuses[id] !== lastSeenMapStatuses[id]))
      : new Set();
  const handleClose = () => {
    // Always record the LATEST state as "last seen," regardless of where the scrubber was
    // left — otherwise closing mid-scrub would make the next open flash regions that only
    // "changed" relative to a stop the player was just browsing, not the true last-seen state.
    if (onStatusesChange) onStatusesChange(latestStatuses);
    onClose();
  };
  const [selectedRegion, setSelectedRegion] = useState(null);
  useEffect(() => {
    setSelectedRegion(null);
  }, [viewIndex]);
  const headingRef = useRef(null);
  useEffect(() => {
    if (!embedded && headingRef.current) headingRef.current.focus();
  }, []);
  const card = (
      <div
        className={`${paper} w-full max-w-md p-4 my-auto`}
        style={{ ...campaignPaperStyle(campaign.id, campaign.accent), borderTop: `5px solid ${campaign.accent}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div
            ref={headingRef}
            tabIndex={-1}
            className="text-xs uppercase tracking-widest font-bold outline-none"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: campaign.accent }}
          >
            {embedded ? `The map at the end of ${clampedYear}` : `Theater Map: ${clampedYear}`}
          </div>
          {!embedded && (
            <button
              onClick={handleClose}
              className="text-[10px] uppercase tracking-widest font-bold border-2 border-black px-2 py-1 hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Close
            </button>
          )}
        </div>
        {runTimeline.length > 1 && (
          <div className="mb-3">
            <input
              type="range"
              min={0}
              max={runTimeline.length - 1}
              step={1}
              value={viewIndex}
              onChange={(e) => setViewIndex(parseInt(e.target.value, 10))}
              aria-label={`Timeline position ${viewIndex + 1} of ${runTimeline.length}: ${current.date || ""}${current.title ? `: ${current.title}` : ""}`}
              className="w-full accent-black"
              style={{ accentColor: campaign.accent }}
            />
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <span
                className="text-[9px] uppercase tracking-wider opacity-60 shrink-0"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Start
              </span>
              <span
                className="text-[10px] uppercase tracking-wider font-bold text-center flex-1 truncate px-1"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: campaign.accent }}
                title={current.title ? `${current.date}: ${current.title}` : current.date}
              >
                {current.date}
                {current.title ? `: ${current.title}` : ""}
              </span>
              {current.isLast ? (
                <span
                  className="text-[9px] uppercase tracking-wider opacity-60 shrink-0"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  Latest
                </span>
              ) : (
                <button
                  onClick={() => setViewIndex(runTimeline.length - 1)}
                  className="text-[9px] uppercase tracking-wider font-bold underline shrink-0"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", color: campaign.accent }}
                >
                  Jump to latest
                </button>
              )}
            </div>
          </div>
        )}
        {review && !embedded && (
          <p className="mb-3 border border-black px-3 py-1 text-[11px] leading-snug text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            <span className="font-bold uppercase tracking-wider">Strategic review</span>
            {review}
          </p>
        )}
        <div className="relative w-full border-2 border-black overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
          <img
            src={src}
            alt={`${campaign.name}: ${clampedYear}`}
            className="w-full h-full object-cover absolute inset-0"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <CheckpointMapRegions
            campaignId={campaign.id}
            statusYear={statusYear}
            flags={current.flags}
            meters={current.meters || {}}
            statuses={statuses}
            divergedRegions={divergedRegions}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            highlightRegions={highlightRegions}
            accent={campaign.accent}
            changedRegions={changedRegions}
          />
          {revealedForks.map((fk, i) => (
            <div
              key={fk.id}
              title={(DIVERGENCE_HEADLINES[fk.id] && DIVERGENCE_HEADLINES[fk.id].headline) || fk.id}
              className="absolute rounded-full border-2 border-white"
              style={{
                width: 14,
                height: 14,
                backgroundColor: campaign.accent,
                left: `${18 + ((i * 27) % 64)}%`,
                top: `${22 + ((i * 41) % 56)}%`,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 0 2px #00000066",
                zIndex: 2,
              }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          {usedStatuses.map((s) => (
            <span
              key={s}
              className="flex items-center gap-1 text-[9px] uppercase tracking-wider opacity-80"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              <span
                className="inline-block rounded-sm border border-black/40"
                style={{
                  width: 9,
                  height: 9,
                  background: s === "divided" ? `linear-gradient(90deg, ${STATUS_COLORS.allied} 50%, ${STATUS_COLORS.soviet} 50%)` : STATUS_COLORS[s],
                }}
              />
              {STATUS_LABELS[s] || s}
            </span>
          ))}
          {changedRegions.size > 0 && (
            <span
              className="flex items-center gap-1 text-[9px] uppercase tracking-wider opacity-80"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              <span aria-hidden="true">{"✦"}</span>
              Flashing border: changed since you last checked the map
            </span>
          )}
        </div>
        {embedded && notes.length > 0 && (
          <div className="mt-2">
            {notes.map((n, i) => (
              <p key={i} className="text-[12px] leading-snug mb-1 border-l-4 pl-2" style={{ borderColor: campaign.accent || "#7a2e2e", fontFamily: "'Courier Prime', monospace" }}>
                {n.text}
              </p>
            ))}
          </div>
        )}
        {!embedded && selectedRegion && notesForRegion(selectedRegion).length > 0 && (
          <div className="mt-2 border-2 px-2 py-1" style={{ borderColor: campaign.accent || "#7a2e2e" }}>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {nameOf(selectedRegion)}
            </p>
            {notesForRegion(selectedRegion).map((n, i) => (
              <p key={i} className="text-[12px]" style={{ fontFamily: "'Courier Prime', monospace" }}>
                {n.text}
              </p>
            ))}
          </div>
        )}
        <p className="text-[11px] mt-1 opacity-70" style={{ fontFamily: "'Courier Prime', monospace" }}>
          {revealedForks.length
            ? `${revealedForks.length} confirmed divergence${revealedForks.length > 1 ? "s" : ""} from the historical record marked above.`
            : "No confirmed divergences from the historical record yet."}
          {" "}Ownership shown through end of {statusYear}.
          {statuses.france === "axisAllied" && " Dashed line marks the Vichy/occupied-zone demarcation."}
          {statusYear === 1941 && " Dashed line marks Barbarossa's farthest advance, autumn 1941."}
          {statusYear === 1942 && " Dashed line marks Case Blue's farthest advance, autumn 1942."}
        </p>
      </div>
  );
  if (embedded) return card;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8"
      style={{ backgroundColor: "#000000cc" }}
      onClick={handleClose}
    >
      {card}
    </div>
  );
}

function WarRoomScreen({ campaign, mode, onModeChange, onEnter, onBack }) {
  const modeInfo = warRoomModeInfo(mode, campaign.id);
  const hardId = HARD_MODE_OF[campaign.id];
  const modeChoices = [
    { id: "easy", name: "Easy", available: EASY_MODE_ENABLED, colour: "#3a6b4f" },
    { id: "open", name: "Normal", available: true, colour: "#000000" },
    { id: hardId, name: `Hard: ${warRoomModeInfo(hardId, campaign.id).label}`, available: HARD_MODES_ENABLED, colour: "#7a2e2e" },
  ];
  const headingRef = useRef(null);
  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
  }, [campaign.id, mode]);
  const Doc = { german: WarRoomDocOKW, soviet: WarRoomDocSTAVKA, allied: WarRoomDocSHAEF, italy: WarRoomDocComandoSupremo }[campaign.id] || WarRoomDocOKW;

  // Historical Divergence Mode toggle. Available from a player's very first run of a campaign —
  // Round 11 (Craig: "Can the make the historically accurate unlock available from the
  // beginning") removed the original campaignsPlayed-gated unlock. Default ticked (today's
  // behavior); unticking is an opt-in the player actively chooses.
  const [historicallyAccurate, setHistoricallyAccurate] = useState(true);
  const hasForks = (DIVERGENCE_FORKS[campaign.id] || []).length > 0;

  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center px-4 py-10">
      <div
        className={`${paper} w-full max-w-lg p-6`}
        style={{ ...campaignPaperStyle(campaign.id, campaign.accent), borderTop: `5px solid ${campaign.accent}` }}
      >
        <h1 ref={headingRef} tabIndex={-1} className="sr-only outline-none">
          {campaign.name}: War Room
        </h1>
        <Doc campaign={campaign} modeInfo={modeInfo} easy={mode === "easy"} />
        <div role="radiogroup" aria-label="Difficulty" className="mb-4 pb-4 border-b-2" style={{ borderColor: campaign.accent }}>
          <div className="font-bold uppercase tracking-widest text-[11px] mb-2 text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Difficulty
          </div>
          <div className="flex flex-col gap-2">
            {modeChoices.map((c) => {
              const on = mode === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  disabled={!c.available}
                  onClick={() => (on ? null : onModeChange(c.id))}
                  className="text-left border-2 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
                  style={{ borderColor: c.colour, backgroundColor: on ? c.colour : "transparent", color: on ? "#ffffff" : "#000000", fontFamily: "'Courier Prime', monospace" }}
                >
                  <span className="block text-[12px] uppercase tracking-widest font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {c.name}{c.available ? "" : " (full version)"}
                  </span>
                  <span className="block text-[13px] leading-snug mt-1">{warRoomModeInfo(c.id, campaign.id).summary}</span>
                </button>
              );
            })}
          </div>
        </div>
        {hasForks && (
          <label
            className="flex items-start gap-3 mb-4 pb-4 border-b-2 text-[12px] leading-snug text-[#000000] cursor-pointer"
            style={{ borderColor: campaign.accent, fontFamily: "'Courier Prime', monospace" }}
          >
            <span className="relative shrink-0" style={{ width: 68, height: 26 }}>
              <input
                type="checkbox"
                checked={historicallyAccurate}
                onChange={(e) => setHistoricallyAccurate(e.target.checked)}
                className="appearance-none m-0 block cursor-pointer absolute"
                style={{
                  left: 25,
                  top: 4,
                  width: 18,
                  height: 18,
                  border: "2px solid #000000",
                  background: "#f4efe3",
                  boxShadow: "inset 0 0 0 2px #f4efe3",
                }}
              />
              {/* Round 19 (Craig: "instead of a tick... make it a stamp, would look more
                  authentic"): reuses this file's existing ink-stamp visual grammar (see the
                  <Stamp> component and .briefing-stamp-* classes used for ending/report seals)
                  rather than inventing a new treatment: a small canted bordered rectangle in the
                  campaign's own accent color struck over the checkbox, not a handwritten check
                  mark. Centered on the container (not left-anchored) so the rotated box can't
                  spill into the label text that follows. */}
              {historicallyAccurate && (
                <span
                  aria-hidden="true"
                  className="absolute pointer-events-none select-none whitespace-nowrap"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%) rotate(-9deg)",
                    display: "inline-block",
                    border: `2px solid ${campaign.accent}`,
                    borderRadius: 2,
                    padding: "2px 5px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 700,
                    fontSize: 8,
                    letterSpacing: "0.1em",
                    color: campaign.accent,
                    opacity: 0.85,
                    mixBlendMode: "multiply",
                  }}
                >
                  VERIFIED
                </span>
              )}
            </span>
            <span>
              <span className="font-bold uppercase tracking-widest text-[11px]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                Historically Accurate Opponent
              </span>
              <br />
              Lift the stamp, and the war is more likely to run beyond the realms of historical accuracy.
            </span>
          </label>
        )}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onEnter(hasForks ? historicallyAccurate : true)}
            className="w-full border-2 px-4 py-3 text-sm uppercase tracking-[0.2em] font-bold text-[#ffffff] transition-colors duration-150"
            style={{ borderColor: campaign.accent, backgroundColor: campaign.accent, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Enter the War Room
          </button>
          <button
            onClick={onBack}
            className="w-full border-2 border-black px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

