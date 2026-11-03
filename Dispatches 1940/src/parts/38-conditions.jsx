const COMMS = {
  german: [[1939, 6], [1943, 9], [1945, 14]],
  soviet: [[1939, 16], [1941, 30], [1942, 20], [1943, 12], [1944, 8]],
  allied: [[1939, 10], [1942, 8], [1944, 5]],
  italy: [[1939, 14], [1941, 24], [1943, 20], [1944, 16]],
};
// THE CONDITIONS OF A REPORT (the conditions of 1914's 48-conditions.jsx, for 1940)
//
// What a headquarters knew about the state of things when a report reached it, apart from the decision: how old the news was, the weather that the report's place
// usually has in the month, the state of the railways and the guns that were fired. These tables are MODELLED, not recorded: COMMS is a figure in hours for the
// means of communication of each command in each period, and the weather is the usual weather of the climate of the report's place (MAP_PLACES) in the month, not the
// weather of the day. The rail reading is the Matériel meter put into words. The guns are different: each is a figure from the histories, with its source, and is
// shown on the report that it belongs to only. tools/check-conditions.mjs proves that the tables are whole and the figures sourced.

/** How old the news is on a report, for a command, in a year: { hours, text }. */
function reportAge(campaignId, year) {
  const rows = COMMS[campaignId] || [[1939, 12]];
  let hours = rows[0][1];
  for (const [from, h] of rows) if (year >= from) hours = h;
  const text = hours < 24 ? t("{hours} hours old", { hours }) : hours < 36 ? t("a day old") : hours < 60 ? t("two days old") : t("more than two days old");
  return { hours, text };
}

const CLIMATES = {
  west: [T("Hard frost"), T("Frost and fog"), T("Thaw and mud"), T("Showers"), T("Fine, with showers"), T("Warm"), T("Warm"), T("Warm, with storms"), T("Fine, cooling"), T("Rain"), T("Rain and mud"), T("Frost")],
  east: [T("Hard frost"), T("Hard frost and snow"), T("Thaw and mud"), T("Mud: the roads are rivers"), T("Fine"), T("Warm"), T("Hot"), T("Hot"), T("Fine"), T("Rain: the rasputitsa begins"), T("Mud and the first frost"), T("Frost and snow")],
  north: [T("Hard frost in the polar night"), T("Hard frost"), T("Snow and frost"), T("Snow melting"), T("Thaw and mud"), T("Light nights"), T("Light nights, mild"), T("Mild, with rain"), T("Rain and the first frost"), T("Snow and gales"), T("Snow and the dark"), T("Hard frost in the polar night")],
  med: [T("Mild and wet"), T("Mild and wet"), T("Mild, with rain"), T("Fine"), T("Fine"), T("Hot"), T("Hot and dry"), T("Hot and dry"), T("Hot, storms at sea"), T("Rain and gales"), T("Rain and gales"), T("Mild and wet")],
  desert: [T("Cool, with rain on the coast"), T("Cool and clear"), T("Khamsin: sand and haze"), T("Khamsin: sand and haze"), T("Hot"), T("Very hot"), T("Very hot"), T("Very hot"), T("Hot"), T("Warm"), T("Cool"), T("Cool, with rain on the coast")],
};

/** The climate of a place [longitude, latitude], or "" for a place that none of the tables covers (the Pacific, America, Asia). */
function climateOf(place) {
  if (!place) return "";
  const [lon, lat] = place;
  if (lon < -12 || lon > 62 || lat < 24 || lat > 72) return "";
  if (lat >= 59) return "north";
  if (lat < 34 && lon >= 8) return "desert";
  if (lat < 44 && lon < 36) return "med";
  if (lon >= 20) return "east";
  return "west";
}

/** The usual weather for the month at a place: "" when there is none. month is 1 to 12. */
function usualWeather(place, month) {
  const c = climateOf(place);
  return c && month >= 1 && month <= 12 ? CLIMATES[c][month - 1] : "";
}

/** The Matériel meter as the state of the railways. */
function railReading(fuel) {
  const f = fuel || 0;
  return f <= -3 ? T("choked and broken") : f === -2 ? T("strained") : f === -1 ? T("short of wagons") : f === 0 ? T("working") : f === 1 ? T("running well") : T("running to the timetable");
}

/** The guns of the great bombardments, on the report where they were fired: [campaign, report] -> { text, source }. */
const BOMBARDMENTS = {
  "soviet/stalingradCounter42": { text: "About 3,500 guns and mortars, in a preparation of eighty minutes before the attack", source: "Operation Uranus, Wikipedia (the sources differ a little on the figure and the length)" },
  "german/elAlamein": { text: "The British barrage on the first night, by about 900 guns, going on for five hours", source: "Second Battle of El Alamein, Wikipedia (the figure is for the field guns)" },
  "italy/alamein42": { text: "The British barrage on the first night, by about 900 guns, going on for five hours", source: "Second Battle of El Alamein, Wikipedia (the figure is for the field guns)" },
};

/** The line about the guns on a report, or "". */
function bombardmentAt(campaignId, nodeId) {
  const b = BOMBARDMENTS[campaignId + "/" + nodeId];
  return b ? b.text : "";
}

/** The month, 1 to 12, of a node's date line, or 0 when it names no month or season (a date of only a year has no weather; a season is the month it begins in). */
function conditionsMonth(date) {
  if (!/\b(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER|SPRING|SUMMER|AUTUMN|FALL|WINTER)\b/i.test(String(date || ""))) return 0;
  const key = nodeDayKey(date);
  return key == null ? 0 : Math.floor((key % 10000) / 100);
}

/** One line under the title: the age of the news, the weather at the place, the rail, and the guns where they are known. */
function ReportConditions({ campaign, stage, nodeId, meters }) {
  const year = yearFrom(stage.date, 1940);
  const age = reportAge(campaign.id, year);
  const place = (MAP_PLACES[campaign.id] || {})[nodeId] || null;
  const weather = usualWeather(place, conditionsMonth(stage.date));
  const guns = bombardmentAt(campaign.id, nodeId);
  const parts = [t("News {age}", { age: age.text }), weather && t("Weather: {weather}", { weather: t(weather) }), t("Rail {state}", { state: t(railReading((meters || {}).fuel)) })];
  return (
    <div className="mb-3" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <p className="text-[11px] leading-snug text-[#000000] opacity-80 m-0">{parts.filter(Boolean).join(" · ")}</p>
      {guns && <p className="text-[11px] leading-snug text-[#000000] opacity-80 m-0 mt-0.5">{t("Guns: {guns}.", { guns })}</p>}
    </div>
  );
}

// ---- reading aids ----

/** The typeface for a reader who asks for the dyslexia-friendly one: OpenDyslexic or Lexend if they are installed, else a wide-spaced sans-serif (the drawn maps and sketches keep theirs). */
const DYSLEXIA_CSS = `
  body, body *:not(svg):not(svg *) { font-family: "OpenDyslexic", "Lexend", "Atkinson Hyperlegible", Verdana, "Trebuchet MS", sans-serif !important; letter-spacing: 0.04em !important; word-spacing: 0.12em !important; }
  body p, body li { line-height: 1.75 !important; }
`;

/**
 * Night reading: the game's page is already black, and what is light is the paper, so the paper is what is turned: each sheet (the white ones) is inverted and its hues turned
 * back (the paper becomes dark grey, the ink light, the reds stay red). A sheet inside a sheet is left as it is, and pictures on a sheet are inverted again so that they keep their look.
 */
const NIGHT_CSS = `
  html { color-scheme: dark; }
  .bg-white { filter: invert(0.9) hue-rotate(180deg); box-shadow: 0 8px 30px rgba(255, 255, 255, 0.5) !important; }
  .bg-white .bg-white { filter: none; }
  .bg-white img, .bg-white video, .bg-white canvas { filter: invert(1) hue-rotate(180deg); }
`;

/** Reads a report aloud with the browser's own voice, where it has one; nothing is drawn where it has none. */
function ReadAloud({ id, text }) {
  const [on, setOn] = useState(false);
  const can = typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance !== "undefined";
  useEffect(() => () => {
    try {
      if (can) window.speechSynthesis.cancel();
    } catch (e) {
      /* no voice here */
    }
  }, [id]);
  if (!can) return null;
  const toggle = () => {
    const ss = window.speechSynthesis;
    if (on) {
      ss.cancel();
      setOn(false);
      return;
    }
    const u = new window.SpeechSynthesisUtterance(text);
    u.lang = "en-GB";
    u.rate = 0.95;
    u.onend = () => setOn(false);
    u.onerror = () => setOn(false);
    ss.cancel();
    ss.speak(u);
    setOn(true);
  };
  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      className="mb-3 border-2 border-black px-2 py-1 text-[10px] uppercase tracking-widest font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {on ? t("Stop reading") : t("Read aloud")}
    </button>
  );
}
