// The first block is a fallback for class names with arbitrary values. It sits in the `utilities` layer, the layer Tailwind uses: as unlayered
// rules these beat every Tailwind utility whatever its specificity, so `hover:text-[#ffffff]` lost to `text-[#000000]` (a hovered choice went
// black on black) and `sm:text-[..]` lost to `text-[..]`. The treatments after it are plain classes that Tailwind does not generate.
const ARBITRARY_CSS = `
@layer utilities {
.bg-\\[\\#000000\\] { background-color: #000000; }
.bg-\\[\\#ffffff\\] { background-color: #ffffff; }
.border-\\[\\#000000\\] { border-color: #000000; }
.border-\\[3px\\] { border-width: 3px; }
.focus-visible\\:ring-\\[\\#b08d3f\\]:focus-visible { outline: 4px solid #b08d3f; outline-offset: 2px; }
.h-\\[2px\\] { height: 2px; }
.h-\\[3px\\] { height: 3px; }
.hover\\:bg-\\[\\#000000\\]:hover { background-color: #000000; }
.hover\\:text-\\[\\#ffffff\\]:hover { color: #ffffff; }
.py-\\[2px\\] { padding-top: 2px; padding-bottom: 2px; }
.rotate-\\[6deg\\] { transform: rotate(6deg); }
.text-\\[\\#000000\\] { color: #000000; }
.text-\\[\\#ffffff\\] { color: #ffffff; }
.text-\\[10px\\] { font-size: 10px; }
.text-\\[11px\\] { font-size: 11px; }
.text-\\[12px\\] { font-size: 12px; }
.text-\\[13px\\] { font-size: 13px; }
.text-\\[14px\\] { font-size: 14px; }
.text-\\[15px\\] { font-size: 15px; }
.text-\\[16px\\] { font-size: 16px; }
.top-\\[-5px\\] { top: -5px; }
.tracking-\\[0\\.2em\\] { letter-spacing: 0.2em; }
.tracking-\\[0\\.25em\\] { letter-spacing: 0.25em; }
.tracking-\\[0\\.35em\\] { letter-spacing: 0.35em; }
.shadow-\\[0_8px_30px_rgba\\(0\\,0\\,0\\,0\\.5\\)\\] { box-shadow: 0 8px 30px rgba(0,0,0,0.5); }
}

/* ---- WarRoom briefing-card document treatments (OKW / STAVKA / SHAEF) ---- */
.briefing-triangle { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }
.briefing-triangle > div { text-align: center; padding: 6px 2px; }
.briefing-triangle span { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 0.14em; color: #777; margin-bottom: 2px; }
.briefing-triangle b { font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 700; }
.briefing-fields-okw { display: grid; grid-template-columns: 56px 1fr; row-gap: 3px; column-gap: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #444; padding: 8px 0; margin-bottom: 14px; }
.briefing-fields-okw b { color: #16130f; font-weight: 700; }
.briefing-stamp-okw { position: relative; transform: rotate(-9deg); font-family: 'IBM Plex Mono', monospace; font-weight: 700; font-size: 12px; letter-spacing: 0.14em; padding: 3px 9px; opacity: 0.85; display: inline-block; }
.briefing-stamp-okw::after { content: ""; position: absolute; inset: 3px; border: 1px solid currentColor; }
.briefing-rule-stavka { border: none; border-top: 3px double currentColor; margin: 10px 0 14px; }
.briefing-stamp-stavka { width: 92px; height: 92px; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-align: center; transform: rotate(8deg); font-family: 'IBM Plex Mono', monospace; font-weight: 700; font-size: 9px; letter-spacing: 0.08em; line-height: 1.35; opacity: 0.55; mix-blend-mode: multiply; position: relative; }
.briefing-stamp-stavka::before { content: ""; position: absolute; inset: 6px; border: 1px solid currentColor; border-radius: 50%; }
.briefing-rail-shaef { border-left: 1px solid #c7d0ce; padding: 4px 0 4px 10px; font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 0.03em; color: #556; line-height: 1.8; }

/* ---- Wire bulletin torn-strip signature device ---- */
.wire-tear { height: 10px; background: var(--wire-paper); clip-path: polygon(0% 0%, 4% 100%, 8% 20%, 12% 100%, 16% 10%, 20% 100%, 24% 15%, 28% 100%, 32% 5%, 36% 100%, 40% 20%, 44% 100%, 48% 10%, 52% 100%, 56% 15%, 60% 100%, 64% 5%, 68% 100%, 72% 20%, 76% 100%, 80% 10%, 84% 100%, 88% 15%, 92% 100%, 96% 5%, 100% 100%, 100% 0%); }
.wire-tear-bottom { transform: scaleY(-1); }
`;

const paper =
  "relative bg-white text-black shadow-[0_8px_30px_rgba(0,0,0,0.5)]";

// Subtle per-campaign paper stock — a crisp bureaucratic white for OKW, a warmer field-report
// kraft tone for STAVKA, a cool telegram-pale tone for SHAEF. Deliberately faint: this should
// read as "a different office's letterhead," not a different color scheme.
function campaignPaperStyle(campaignId, accent) {
  const tints = {
    german: "#fbfaf8",
    soviet: "#f8f1e2",
    allied: "#eff3f4",
    italy: "#f2f0e8",
    japan: "#f6efdf",
    alliedPacific: "#eef2f6",
    british: "#eff3f4",
    american: "#eef2f6",
  };
  const style = {
    backgroundColor: tints[campaignId] || "#ffffff",
    borderTop: `4px solid ${accent}`,
  };
  if (campaignId === "allied") {
    // Faint mimeograph ghosting — real SHAEF-era mimeographed memos had uneven ink density
    // rather than a clean print. Kept very subtle so it never competes with legibility.
    style.backgroundImage =
      "repeating-linear-gradient(0deg, rgba(47,74,58,0.025) 0px, rgba(47,74,58,0.025) 1px, transparent 1px, transparent 3px)," +
      "radial-gradient(ellipse 140% 60% at 15% 0%, rgba(47,74,58,0.03), transparent 55%)";
  }
  return style;
}

function Stamp({ text, color, campaignId }) {
  // OKW: a canted bureaucratic impression, like a stamp struck slightly off-true. STAVKA: a
  // bolder rubber ink-stamp look with a characteristic double-ring. SHAEF: a precise double-ruled
  // telegram seal, barely tilted at all — the most "correct" of the three. Same font, same
  // weight — just a different office's hand on the stamp.
  const variant = {
    german: { transform: "rotate(-4deg)" },
    soviet: {
      transform: "rotate(-2deg)",
      borderRadius: "3px",
      border: `3px solid ${color}`,
      boxShadow: `0 0 0 2px #00000000, inset 0 0 0 2px ${color}22`,
    },
    allied: { transform: "rotate(-0.5deg)", border: `1px solid ${color}`, boxShadow: `0 0 0 3px #ffffff, 0 0 0 4px ${color}`, margin: "0 3px" },
    italy: { transform: "rotate(-7deg)", borderRadius: "2px" },
  }[campaignId];
  return (
    <div
      key={text}
      className="stamp-in inline-block border-[3px] px-3 py-1 uppercase tracking-[0.2em] text-xs font-bold select-none"
      style={{ borderColor: color, color: color, fontFamily: "Oswald, sans-serif", ...variant }}
    >
      {text}
    </div>
  );
}

// ---------- SCREENS ----------

const NODE_ATLAS = {
  german: [
    { id: "fallWeiss39", date: "SEPTEMBER 1939", title: "Poland and the Western Wall" },
    { id: "phoneyWar39", date: "OCTOBER – NOVEMBER 1939", title: "The Order for the West" },
    { id: "mechelen40", date: "JANUARY 1940", title: "The Plan in the Snow" },
    { id: "altmark40", date: "FEBRUARY 1940", title: "The Altmark" },
    { id: "ore40", date: "MARCH – APRIL 1940", title: "The Date for Norway" },
    { id: "norway40", date: "APRIL 1940", title: "Weserübung: The Norway Gamble" },
    { id: "caseYellow40", date: "MAY 1940", title: "The Manstein Plan" },
    { id: "dunkirk", date: "MAY 1940", title: "The Halt at Dunkirk" },
    { id: "channel", date: "AUGUST 1940", title: "The Channel Question" },
    { id: "balkans", date: "APRIL 1941", title: "The Balkans Problem" },
    { id: "hessFlight41", date: "MAY 10, 1941", title: "The Hess Flight" },
    { id: "crete41", date: "MAY 1941", title: "Mercury: The Airborne Gamble" },
    { id: "bismarckBreakout41", date: "MAY 1941", title: "The Bismarck Sails" },
    { id: "sealionDisaster40", date: "SEPTEMBER 1940", title: "The Channel Crossing" },
    { id: "sealionAftermath40", date: "OCTOBER 1940", title: "What the Channel Cost" },
    { id: "barbarossa41", date: "MAY – JUNE 1941", title: "The Eastern Decision" },
    { id: "suezFirst41", date: "SUMMER 1941", title: "The Mediterranean First" },
    { id: "barbarossaAutumn41", date: "OCTOBER 1941", title: "Barbarossa, Out of Season" },
    { id: "japanDirection41", date: "JULY 1941", title: "Pressing Tokyo" },
    { id: "moscowFalls41", date: "DECEMBER 1941", title: "Moscow Falls" },
    { id: "volgaOverreach42", date: "JANUARY 1942", title: "The Pursuit That Went Too Far" },
    { id: "sovietFracture42", date: "WINTER 1941 – 1942", title: "The State Behind the Urals" },
    { id: "fractureResolution42", date: "SPRING 1942", title: "The Winter Answer" },
    { id: "volgaAftermath42", date: "SPRING 1942", title: "What an Army Freed From One War Does With the Other" },
    { id: "east42Launch", date: "MAY 1942", title: "Barbarossa, One Year Late" },
    { id: "armedTruce41", date: "SUMMER – AUTUMN 1941", title: "The Armed Truce" },
    { id: "mediterranean41", date: "1942", title: "The Middle Sea" },
    { id: "suezHorizon42", date: "LATE 1942", title: "How Far East a Conquered Suez Reaches" },
    { id: "gibraltarStalled42", date: "MID-1942", title: "The Weight That Went to Spain" },
    { id: "iberianQuestion42", date: "LATE 1942", title: "Franco's Actual Price" },
    { id: "bomberWar43", date: "1943", title: "The War That Comes Anyway" },
    { id: "invasionQuestion44", date: "1944", title: "The Fortress Tested" },
    { id: "lodgmentReduction44", date: "1944", title: "What Reduction Actually Looks Like" },
    { id: "easternQuestion44", date: "1944", title: "The Question in the East" },
    { id: "atomicReckoning45", date: "1945", title: "The Reckoning" },
    { id: "moscowKiev", date: "AUGUST 1941", title: "Moscow or Kiev" },
    { id: "doubleEnvelopment", date: "SEPTEMBER 1941", title: "The Double Envelopment" },
    { id: "exposedFlank", date: "AUGUST – SEPTEMBER 1941", title: "The Exposed Flank" },
    { id: "moscowRace41", date: "SEPTEMBER 1941", title: "The Race, With the Flank Still Open" },
    { id: "rostov41", date: "NOVEMBER 1941", title: "The Rostov Crisis" },
    { id: "typhoon", date: "DECEMBER 1941", title: "Typhoon Stalls" },
    { id: "pearlHarbor", date: "DECEMBER 11, 1941", title: "The American Question" },
    { id: "staticEast", date: "1942 – 1943", title: "A Static Eastern Front" },
    { id: "atlanticWall43", date: "1943", title: "Building the Western Fortress" },
    { id: "herkules42", date: "SPRING 1942", title: "Malta or Egypt" },
    { id: "suezOpening42", date: "SUMMER 1942", title: "A Supplied Desert War" },
    { id: "caseBlue", date: "JUNE 1942", title: "Case Blue" },
    { id: "torch42", date: "NOVEMBER 1942", title: "Torch and the Fleet at Toulon" },
    { id: "maltaAftermath", date: "AUTUMN 1942", title: "The Supplied Desert" },
    { id: "britishCrisis42", date: "AUTUMN 1942", title: "The Coalition Question" },
    { id: "crisisResolution42", date: "WINTER 1942", title: "The Answer From London" },
    { id: "westArmisticeAftermath42", date: "WINTER 1942", title: "A War Suddenly Halved" },
    { id: "elAlamein", date: "JULY – NOVEMBER 1942", title: "The End of the Tether" },
    { id: "stalingradPocket", date: "NOVEMBER 1942", title: "The Stalingrad Pocket" },
    { id: "easternCollapse1943", date: "EARLY 1943", title: "The Eastern Front Collapses" },
    { id: "blackMay", date: "MAY 1943", title: "Black May in the Atlantic" },
    { id: "atlanticAttrition43", date: "SUMMER 1943", title: "The Arm Bleeds Out" },
    { id: "reconstituted", date: "1943", title: "A Reconstituted Southern Front" },
    { id: "kursk", date: "1943", title: "Kursk: Strike Early or Wait" },
    { id: "kurskBreach43", date: "MAY 1943", title: "The Breach" },
    { id: "kurskAftermath43", date: "JUNE 1943", title: "A Rare Eastern Confidence" },
    { id: "expandedOffensive43", date: "JULY 1943", title: "How Far a Good Week Reaches" },
    { id: "twoFires1943", date: "SEPTEMBER 1943", title: "Two Fires at Once" },
    { id: "italyPartisans", date: "LATE 1943", title: "The Cost of a Secured Italy" },
    { id: "dnieperStabilized", date: "LATE 1943", title: "Holding the Dnieper" },
    { id: "firmestLine43", date: "WINTER 1943–44", title: "What a Firm Line Is For" },
    { id: "normandy", date: "JUNE 1944", title: "Normandy" },
    { id: "normandyCounterattack44", date: "JUNE 6, 1944", title: "The Counterattack That Almost Wasn't" },
    { id: "normandyConsolidation44", date: "JUNE 1944: WEEK ONE", title: "The Week the Beachhead Wins" },
    { id: "bagration44", date: "JUNE 1944", title: "Where Will the Soviet Blow Fall" },
    { id: "eastStand44", date: "AUGUST 1944", title: "The Fighting Retreat" },
    { id: "collapse1944", date: "SUMMER – AUTUMN 1944", title: "The Front Comes Apart" },
    { id: "centerArmyPreserved44", date: "JULY 1944", title: "What the Preserved Army Is For" },
    { id: "july20Plot44", date: "JULY 20, 1944", title: "The Blast at the Wolf's Lair" },
    { id: "july20PlotFails44", date: "JULY 1944", title: "The Plot Against Hitler" },
    { id: "hitlerDead44", date: "JULY 20, 1944: THE FOLLOWING HOURS", title: "Valkyrie, Actually Live" },
    { id: "gestapoInquiry44", date: "AUTUMN 1944", title: "The Inquiry Widens" },
    { id: "caenAttrition", date: "JULY 1944", title: "The Battle for Caen" },
    { id: "falaiseGerman", date: "AUGUST 1944", title: "The Pocket Closes" },
    { id: "arnhem44", date: "SEPTEMBER 1944", title: "The Corridor and the Estuary" },
    { id: "ardennes", date: "DECEMBER 1944", title: "The Ardennes" },
    { id: "hungaryGamble45", date: "JANUARY – MARCH 1945", title: "The Last Reserve" },
    { id: "rhineDefense45", date: "MARCH 1945", title: "The Rhine and the Bridge" },
    { id: "reichStand45", date: "FEBRUARY 1945", title: "Where the Reich Stands" },
    { id: "westWall45", date: "MARCH 1945", title: "The Western Stand" },
    { id: "fortressNorth45", date: "APRIL – MAY 1945", title: "Festung Norwegen" },
    { id: "oderDefense45", date: "APRIL 1945", title: "Seelow Heights" },
    { id: "berlinDefense45", date: "APRIL 1945", title: "Volkssturm and the Last Muster" },
    { id: "finalWeek45", date: "LATE APRIL 1945", title: "The Final Week" },
    { id: "flensburg45", date: "MAY 1945", title: "The Flensburg Government" },
    { id: "alpineRedoubt45", date: "MAY 1945", title: "The Redoubt That Wasn't" },
    { id: "caseYellowOriginal40", date: "JUNE 1940", title: "The Cost of Caution" },
    { id: "compressedInvasionWindow40", date: "AUGUST 1940", title: "A Shorter Summer to Work With" },
    { id: "tannenbaum40", date: "OCTOBER 1940", title: "The Tannenbaum Question" },
    { id: "heydrichReprisals42", date: "JUNE 1942", title: "Lidice" },
    { id: "vlasov43", date: "1943", title: "The Vlasov Question" },
    { id: "uranverein43", date: "LATE 1943", title: "The Uranium Club" },
    { id: "mussoliniRescue43", date: "SEPTEMBER 12, 1943", title: "Gran Sasso" },
    { id: "stockholmFeelers43", date: "SEPTEMBER – DECEMBER 1943", title: "The Stockholm Channel" },
    { id: "italianLine43", date: "OCTOBER – NOVEMBER 1943", title: "Where Italy Is Held" },
    { id: "vWeaponsProduction44", date: "SPRING 1944", title: "The Vengeance Weapons" },
    { id: "romaniaDefects44", date: "AUGUST 23, 1944", title: "The Coup in Bucharest" },
    { id: "valkyrieGovernment44", date: "AUGUST 1944", title: "What the New Government Actually Does" },
    { id: "rommelFate44", date: "OCTOBER 1944", title: "The Emissaries to Herrlingen" },
    { id: "backhandBlow43", date: "FEBRUARY – MARCH 1943", title: "The Backhand Blow" },
  ],
  soviet: [
    { id: "finnishPrep39", date: "OCTOBER – NOVEMBER 1939", title: "The Finnish Question" },
    { id: "winterStall40", date: "DECEMBER 1939 – JANUARY 1940", title: "The Mannerheim Line" },
    { id: "summaBreak40", date: "JANUARY 1940", title: "The Isthmus Breaks" },
    { id: "moscowPeace40", date: "MARCH – MAY 1940", title: "The Moscow Peace" },
    { id: "plan40", date: "AUGUST – OCTOBER 1940", title: "Where the Blow Will Fall" },
    { id: "games41", date: "JANUARY 1941", title: "The War Games" },
    { id: "prep41", date: "MARCH 1941", title: "The Mechanised Corps" },
    { id: "memo41", date: "MAY 1941", title: "The Memorandum" },
    { id: "border41", date: "JUNE 1941", title: "The Border Collapses" },
    { id: "smolensk41", date: "JULY – SEPTEMBER 1941", title: "Smolensk and the Kiev Question" },
    { id: "industrialShortfall42", date: "LATE 1941", title: "The Gap in the Ledger" },
    { id: "leningrad41", date: "SEPTEMBER 1941", title: "The Siege of Leningrad" },
    { id: "evacuateIndustry41", date: "JULY – NOVEMBER 1941", title: "The Factories Go East" },
    { id: "moscowPanic41", date: "OCTOBER 16, 1941", title: "The Moscow Panic" },
    { id: "specialSection41", date: "DECEMBER 1941", title: "The Special Section" },
    { id: "lendLease42", date: "1942", title: "The Lifeline Routes" },
    { id: "rzhevSummer42", date: "JULY – AUGUST 1942", title: "The First Blow at the Salient" },
    { id: "order227_42", date: "JULY 1942", title: "Not One Step Back" },
    { id: "stalingradStreets42", date: "SEPTEMBER – NOVEMBER 1942", title: "The City on the Volga" },
    { id: "escapedRemnants43", date: "DECEMBER 1942", title: "What the Looser Ring Let Through" },
    { id: "southernPursuit43", date: "DECEMBER 1942 – JANUARY 1943", title: "The Bigger Prize" },
    { id: "rostovAftermath43", date: "JANUARY 1943", title: "What's Left to Chase" },
    { id: "partisans43", date: "SPRING – SUMMER 1943", title: "The War Behind the Lines" },
    { id: "eastPrussia45", date: "JANUARY – APRIL 1945", title: "The Fortress in the Rear" },
    { id: "berlinRivalryIncident45", date: "APRIL 1945", title: "Fire in the Smoke" },
    { id: "berlinAssault45", date: "APRIL 16 – MAY 2, 1945", title: "Seelow and the City" },
    { id: "moscowDefense41", date: "OCTOBER – DECEMBER 1941", title: "The Defense of Moscow" },
    { id: "autumnWeight42", date: "AUTUMN 1942", title: "Where the Reserve Goes" },
    { id: "caucasusDefense42", date: "AUTUMN 1942", title: "The Mountain Line" },
    { id: "rzhev42", date: "NOVEMBER – DECEMBER 1942", title: "The Rzhev Grinder" },
    { id: "stalingradCounter42", date: "NOVEMBER 1942", title: "Operation Uranus" },
    { id: "southernVacuum43", date: "JANUARY 1943", title: "The Southern Vacuum" },
    { id: "kharkov43", date: "FEBRUARY – MARCH 1943", title: "The Overextension at Kharkov" },
    { id: "quietSector43", date: "SPRING 1943", title: "The Quiet Sector" },
    { id: "katynRevelation43", date: "APRIL 1943", title: "The Katyn Announcement" },
    { id: "katynBreak43", date: "MAY 1943", title: "Who Speaks for Poland Now" },
    { id: "kurskDefense43", date: "JULY 1943", title: "The Kursk Salient" },
    { id: "preemptResult43", date: "JULY 1943", title: "The Strike Before the Storm" },
    { id: "axis43", date: "AUGUST 1943", title: "The Axis of Pursuit" },
    { id: "smolenskGates43", date: "AUGUST – NOVEMBER 1943", title: "The Gates of Smolensk" },
    { id: "dnieperRace43", date: "AUGUST – NOVEMBER 1943", title: "The Race to the Dnieper" },
    { id: "easternWallBreach43", date: "NOVEMBER 1943", title: "The Wall That Actually Held" },
    { id: "bagrationSoviet44", date: "JUNE 1944", title: "Operation Bagration" },
    { id: "warsawUprising44", date: "AUGUST 1944", title: "The Warsaw Uprising" },
    { id: "warsawRelief44", date: "SEPTEMBER 1944", title: "The City Half-Saved" },
    { id: "balkans44", date: "AUGUST – OCTOBER 1944", title: "The Balkan Question" },
    { id: "athensRace44", date: "OCTOBER 1944", title: "The Race for Athens" },
    { id: "athensStandoff44", date: "OCTOBER 1944", title: "A Flag Over Athens" },
    { id: "polishQuestion45", date: "WINTER 1944–45", title: "The Polish Question" },
    { id: "vistulaOder45", date: "JANUARY – FEBRUARY 1945", title: "Berlin in February?" },
    { id: "maskingForceQuestion45", date: "FEBRUARY 1945", title: "The Watchers at the Gate" },
    { id: "berlinRace45", date: "APRIL 1945", title: "The Race for Berlin" },
    { id: "moscowVyazma41", date: "OCTOBER 16, 1941", title: "The Reserve Kiev Bought" },
    { id: "vacuumOverreach43", date: "FEBRUARY 1943", title: "The Salient Outruns Itself" },
    { id: "finnishArmistice44", date: "SEPTEMBER 1944", title: "The Finnish Question" },
    { id: "finlandOccupationCost44", date: "OCTOBER 1944", title: "What Holding a Hostile Population Actually Costs" },
    { id: "berlinFeb45", date: "MARCH 1945", title: "Berlin, Early" },
    { id: "brodyCounterstroke41", date: "JUNE 23–30, 1941", title: "Six Mechanized Corps" },
    { id: "yelnya41", date: "AUGUST 30 – SEPTEMBER 8, 1941", title: "The Salient at Yelnya" },
    { id: "winterGeneral42", date: "JANUARY 1942", title: "Everywhere at Once" },
    { id: "rzhevVyazma42", date: "JANUARY – FEBRUARY 1942", title: "The Pincers at Vyazma" },
    { id: "smolenskThaw42", date: "MARCH – APRIL 1942", title: "Smolensk, Before the Thaw" },
    { id: "kharkov42", date: "MAY 1942", title: "The Barvenkovo Salient" },
    { id: "westernOffensive42", date: "NOVEMBER – DECEMBER 1942", title: "Mars, Without the Salient" },
    { id: "leningrad44", date: "JANUARY 1944", title: "The Ring Is Lifted" },
    { id: "rightBank44", date: "JANUARY – FEBRUARY 1944", title: "The Cauldron at Korsun" },
    { id: "crimea44", date: "APRIL – MAY 1944", title: "The Crimea" },
    { id: "iasiKishinev44", date: "AUGUST 1944", title: "The Cannae in Romania" },
    { id: "budapest44", date: "DECEMBER 1944 – FEBRUARY 1945", title: "The Siege of Budapest" },
    { id: "balatonVienna45", date: "MARCH – APRIL 1945", title: "The Last German Offensive" },
    { id: "prague45", date: "MAY 1945", title: "The Last Operation" },
  ],
  allied: [
    { id: "saar39", date: "SEPTEMBER 1939", title: "The Promise to Poland" },
    { id: "dyle39", date: "NOVEMBER 1939 – MARCH 1940", title: "The Plan for the North" },
    { id: "altmarkRaid40", date: "FEBRUARY 1940", title: "The Altmark" },
    { id: "finland40", date: "FEBRUARY – MARCH 1940", title: "A Force for Finland" },
    { id: "wilfred40", date: "APRIL 1940", title: "Wilfred and R 4" },
    { id: "narvik40", date: "APRIL 1940", title: "Narvik" },
    { id: "dunkirk40", date: "MAY 1940", title: "Dunkirk" },
    { id: "halifaxCrisis40", date: "LATE MAY 1940", title: "The War Cabinet Crisis" },
    { id: "battleOfBritain40", date: "SUMMER–AUTUMN 1940", title: "The Big Wing Question" },
    { id: "europeFirst42", date: "JANUARY 1942", title: "Europe First" },
    { id: "atlanticConvoys42", date: "1942", title: "The Battle of the Atlantic" },
    { id: "australiaLifeline42", date: "LATE 1942", title: "The Threatened Lifeline" },
    { id: "secondFront42", date: "1942", title: "Where the Second Front Opens" },
    { id: "untestedDoctrine44", date: "EARLY 1944", title: "Planning Without Dieppe's Data" },
    { id: "darlanDeal42", date: "NOVEMBER 1942", title: "The Darlan Deal" },
    { id: "casablanca43", date: "JANUARY 1943", title: "Casablanca: Unconditional Surrender" },
    { id: "resistanceContact44", date: "1944", title: "The Door, Tested" },
    { id: "sicilyHusky43", date: "JULY – AUGUST 1943", title: "Sicily and the Messina Escape" },
    { id: "tehran43", date: "NOVEMBER – DECEMBER 1943", title: "Tehran: The Three Meet" },
    { id: "italyOrOverlord43", date: "LATE 1943", title: "The Soft Underbelly" },
    { id: "normandy44", date: "AUGUST 1944", title: "Broad Front or Narrow Thrust" },
    { id: "marketGarden44", date: "SEPTEMBER 1944", title: "A Bridge Too Far" },
    { id: "arnhemPerimeter44", date: "SEPTEMBER 21–25, 1944", title: "The Perimeter at Oosterbeek" },
    { id: "anvilDragoon44", date: "AUGUST 1944", title: "Southern France or the Balkans" },
    { id: "ljubljanaGap44", date: "AUTUMN 1944", title: "The Ljubljana Gap" },
    { id: "gapStalled44", date: "WINTER 1944–45", title: "A Campaign With Nowhere Useful Left to Go" },
    { id: "viennaStandoff44", date: "AUTUMN 1944", title: "The Vienna Standoff" },
    { id: "ardennesResponse44", date: "DECEMBER 1944", title: "The Bulge" },
    { id: "bulgeExploited44", date: "LATE DECEMBER 1944", title: "What the Delay Bought Germany" },
    { id: "yaltaFeb45", date: "FEBRUARY 1945", title: "Yalta" },
    { id: "berlinDecision45", date: "APRIL 1945", title: "The Halt on the Elbe" },
    { id: "berlinRace45", date: "APRIL 1945", title: "The Race" },
    { id: "pacificPressure42", date: "MID-1942", title: "The Navy's Bill Comes Due" },
    { id: "dieppe42", date: "AUGUST 1942", title: "The Dieppe Raid" },
    { id: "bomberDirective43", date: "1943", title: "Pointblank: What the Bombers Are For" },
    { id: "dodecanese43", date: "SEPTEMBER – NOVEMBER 1943", title: "The Aegean Temptation" },
    { id: "aegeanReckoning43", date: "DECEMBER 1943", title: "What Washington Does With Being Right" },
    { id: "turkishQuestion44", date: "LATE 1943", title: "The Turkish Question" },
    { id: "anzio44", date: "JANUARY 1944", title: "Shingle: The End Run" },
    { id: "anzioSiege44", date: "FEBRUARY – MAY 1944", title: "Four Months on the Beach" },
    { id: "romeDividend44", date: "SPRING 1944", title: "What an Early Rome Buys" },
    { id: "overlordPrep44", date: "SPRING 1944", title: "The Transportation Plan" },
    { id: "falaise44", date: "AUGUST 1944", title: "The Falaise Pocket" },
    { id: "eisenhowerIntervenes44", date: "AUGUST 1944", title: "The Line SHAEF Drew" },
    { id: "scheldt44", date: "OCTOBER – NOVEMBER 1944", title: "The Scheldt Approaches" },
    { id: "stalinTestsTheFront45", date: "MARCH 1945", title: "Stalin Tests the Front" },
    { id: "strategicBombing45", date: "FEBRUARY 1945", title: "The February Directives" },
    { id: "germanyOccupation45", date: "MAY – JUNE 1945", title: "What Germany Becomes" },
    { id: "pq17_1942", date: "JULY 4, 1942", title: "Convoy PQ-17" },
    { id: "omahaCrisis44", date: "JUNE 6, 1944: MORNING", title: "Omaha" },
    { id: "omahaIsolated44", date: "JUNE 6, 1944: LATE AFTERNOON", title: "The Beach That Didn't Link Up" },
    { id: "omahaToehold44", date: "JUNE 11, 1944", title: "The Toehold" },
    { id: "omahaBreakthroughLate44", date: "JUNE 9, 1944", title: "The Beach Widens" },
    { id: "gothicLineEarly44", date: "SPRING 1944", title: "The Gothic Line, Tested Early" },
    { id: "turkishBelligerence44", date: "EARLY 1944", title: "What a Symbolic Declaration Is Actually Worth" },
    { id: "westernCollapse45", date: "MARCH 1945", title: "The Surrender That Came Early" },
    { id: "compassGreece41", date: "FEBRUARY 1941", title: "Tripoli or Athens" },
    { id: "greeceFalls41", date: "APRIL 1941", title: "The Line at Thermopylae" },
    { id: "crete41", date: "MAY 1941", title: "The Island Without Aircraft" },
    { id: "aidRussia41", date: "SEPTEMBER – OCTOBER 1941", title: "Four Hundred Tanks a Month" },
    { id: "malaya41", date: "OCTOBER 1941", title: "A Battleship for Singapore" },
    { id: "forceZ41", date: "DECEMBER 8–10, 1941", title: "Without Air Cover" },
    { id: "crusader41", date: "NOVEMBER – DECEMBER 1941", title: "The Relief of Tobruk" },
  ],
  italy: [
    { id: "nonBelligerence39", date: "SEPTEMBER 1939", title: "The Word for Waiting" },
    { id: "coal40", date: "FEBRUARY – MARCH 1940", title: "Coal" },
    { id: "brenner40", date: "MARCH 1940", title: "The Brenner" },
    { id: "memo40", date: "31 MARCH 1940", title: "The Memorandum" },
    { id: "nonBelligerence40", date: "JUNE 1940", title: "The Parallel War" },
    { id: "alpsFront40", date: "JUNE 1940", title: "The Alps Offensive" },
    { id: "medStrategy40", date: "JULY 1940", title: "The Mediterranean Question" },
    { id: "greeceDecision40", date: "OCTOBER 1940", title: "The Greek Question" },
    { id: "tarantoDoctrine40", date: "NOVEMBER 1940", title: "The Taranto Shock" },
    { id: "greeceWinter40", date: "NOVEMBER 1940 – MARCH 1941", title: "The Epirus Front" },
    { id: "compass40", date: "DECEMBER 1940", title: "Operation Compass" },
    { id: "germanRescue41", date: "JANUARY 1941", title: "Asking Berlin" },
    { id: "matapan41", date: "MARCH 1941", title: "Cape Matapan" },
    { id: "yugoslaviaBalkans41", date: "APRIL 1941", title: "The Balkans, Divided" },
    { id: "eastAfrica41", date: "MAY 1941", title: "The Fall of Italian East Africa" },
    { id: "convoyWarMalta41", date: "SUMMER – FALL 1941", title: "The Supply Line to Africa" },
    { id: "rommelAdvance41", date: "NOVEMBER 1941 – JANUARY 1942", title: "Command in the Desert" },
    { id: "tobruk42", date: "JUNE 1942", title: "The Fall of Tobruk" },
    { id: "alamein42", date: "OCTOBER – NOVEMBER 1942", title: "El Alamein" },
    { id: "torchTunisia42", date: "NOVEMBER 1942", title: "Torch and the Race for Tunisia" },
    { id: "tunisiaCollapse43", date: "MAY 1943", title: "Surrender in Tunisia" },
    { id: "homeFrontBombing43", date: "JUNE – JULY 1943", title: "The Home Front Under the Bombs" },
    { id: "sicilyHusky43", date: "JULY 1943", title: "The Invasion of Sicily" },
    { id: "mussoliniCoup43", date: "JULY 25, 1943", title: "The Grand Council" },
    { id: "armisticeNegotiation43", date: "AUGUST 1943", title: "Secret Talks" },
    { id: "armisticeAnnounce43", date: "SEPTEMBER 8, 1943", title: "The Announcement" },
    { id: "twoItalies43", date: "SEPTEMBER – OCTOBER 1943", title: "Two Italies" },
    { id: "salernoAvalanche43", date: "SEPTEMBER 1943", title: "Salerno, and What the Co-Belligerent Army Actually Is" },
    { id: "monteCassino44", date: "JANUARY – MAY 1944", title: "The Gustav Line" },
    { id: "romeLiberation44", date: "JUNE 1944", title: "Rome, Open and Then Free" },
    { id: "gothicLine44", date: "AUGUST – DECEMBER 1944", title: "The Gothic Line" },
    { id: "coBelligerentEnding45", date: "APRIL – MAY 1945", title: "The War's End, From the South" },
    { id: "monteLungo43", date: "DECEMBER 1943", title: "The First Italian Attack" },
    { id: "adriaticRoad44", date: "JUNE – JULY 1944", title: "The Adriatic Road" },
    { id: "combatGroups44", date: "SEPTEMBER – NOVEMBER 1944", title: "Six Groups, and Everyone Else" },
    { id: "partisanWinter44", date: "NOVEMBER – DECEMBER 1944", title: "The Stand-Down" },
    { id: "groupsCommand45", date: "JANUARY – MARCH 1945", title: "Who Commands the Groups" },
    { id: "springOffensive45", date: "APRIL 1945", title: "The Last Offensive" },
    { id: "saloRepublic43", date: "SEPTEMBER – OCTOBER 1943", title: "Founding the Republic" },
    { id: "civilWarPartisans44", date: "1944", title: "The War Behind the Front" },
    { id: "gothicLineRSI44", date: "AUGUST – DECEMBER 1944", title: "The Republic's Front" },
    { id: "rsiCollapse45", date: "APRIL 1945", title: "The Republic's Last Address" },
    { id: "extendedHoldout40", date: "LATE JUNE 1940", title: "The Window Closes Without Rome" },
    { id: "britainAloneQuestion40", date: "JULY 1940", title: "A War Only Half Joined" },
    { id: "enduringNeutrality40", date: "AUTUMN 1940", title: "The Cost of Staying Out" },
    { id: "gibraltarGambit40", date: "SEPTEMBER 1940", title: "A Third Claimant at the Table" },
    { id: "gibraltarResolution40", date: "OCTOBER 23, 1940", title: "Hendaye, With Rome in the Room" },
    { id: "germanPressure41", date: "1941", title: "Berlin's Patience, Tested" },
    { id: "herculesExecution41", date: "FALL 1941", title: "The Plan Without the Parts It Needs" },
    { id: "maltaRetake41", date: "WINTER 1941 – 1942", title: "The Island Britain Won't Write Off" },
    { id: "neutralItalyOccupied42", date: "LATE 1942", title: "The Ultimatum" },
    { id: "romeStandoff43", date: "JULY 26, 1943", title: "A Palace Under Two Claims" },
    { id: "factionSplit43", date: "LATE JULY – AUGUST 1943", title: "An Army That No Longer Agrees With Itself" },
    { id: "germanExploitation43", date: "AUGUST 1943", title: "Berlin Reads the Confusion" },
    { id: "civilConflictEnd43", date: "SEPTEMBER 1943", title: "Rome, Spent on Itself" },
    { id: "alpenvorlandQuestion43", date: "SEPTEMBER – OCTOBER 1943", title: "The Provinces Salò Never Actually Governed" },
    { id: "imiCrisis43", date: "OCTOBER – DECEMBER 1943", title: "Six Hundred Thousand Men Germany Won't Call Prisoners" },
    { id: "vaticanChannel44", date: "JANUARY 1944", title: "What Rome's Other Government Can Still Do" },
    { id: "imiOutcome44", date: "SPRING 1944", title: "What Six Hundred Thousand Men Were Actually Offered" },
    { id: "clnLiaison44", date: "JULY 1944", title: "The War the South Can Only Fund, Not Fight" },
    { id: "neutralItalyEnd45", date: "1945", title: "The War That Passed Rome By" },
  ],
  // From Dispatches 1941.
  japan: [
    { id: "nomonhan39", date: "AUGUST – SEPTEMBER 1939", title: "Nomonhan and the Pact" },
    { id: "chinaPeaceQuestion40", date: "1940", title: "The China Question, Unsolved" },
    { id: "indochinaMission40", date: "JUNE 1940", title: "France Falls: The Door to China" },
    { id: "burmaRoad40", date: "JULY 1940", title: "The Burma Road" },
    { id: "tripartitePact40", date: "SEPTEMBER 1940", title: "The Tripartite Pact" },
    { id: "unificationQuestion40", date: "LATE 1940", title: "Two Services, Two Wars" },
    { id: "neutralityPact41", date: "APRIL 1941", title: "The Neutrality Pact" },
    { id: "hokushinDebate41", date: "JULY 1941", title: "Kantokuen: The Road Not Taken North" },
    { id: "kantokuenOffensive41", date: "AUGUST 1941", title: "The Kwantung Army's Wager" },
    { id: "siberianReckoning42", date: "1942", title: "A War on Two Fronts, By Choice" },
    { id: "indochinaOccupation41", date: "JULY 1941", title: "Indochina and the Embargo Question" },
    { id: "novemberUltimatum41", date: "LATE NOVEMBER 1941", title: "The Hull Note" },
    { id: "pearlHarbor41", date: "DECEMBER 1941", title: "The Opening Vector" },
    { id: "burmaRangoon42", date: "MARCH 1942", title: "The Road to Rangoon" },
    { id: "indianOceanRaid42", date: "APRIL 1942", title: "The Indian Ocean Raid" },
    { id: "burmaRangoon42Delayed", date: "LATE 1942", title: "The Road to Rangoon, Months Late" },
    { id: "bataanPOWQuestion42", date: "APRIL 1942", title: "Bataan: More Prisoners Than Anyone Planned For" },
    { id: "doolittleRaid42", date: "APRIL 1942", title: "Sixteen Bombers Over Tokyo" },
    { id: "doolittleAirmen42", date: "AUGUST 1942", title: "The Captured Airmen" },
    { id: "coralSea42", date: "MAY 1942", title: "Coral Sea and the Port Moresby Question" },
    { id: "midway42", date: "JUNE 1942", title: "Midway: The Search for the Decisive Battle" },
    { id: "yamamotoAscendant42", date: "JUNE 1942", title: "The Fantasy Considered Seriously for a Single Afternoon" },
    { id: "aPacificWonTwice43", date: "1943", title: "A Free Hand's Price" },
    { id: "theRommelQuestion43", date: "1943", title: "Berlin's Real Offer" },
    { id: "earlyPeaceQuestion42", date: "JUNE – JULY 1942", title: "Midway's Concealed Cost" },
    { id: "aStrongerHandToPlay42", date: "AUGUST 1942", title: "Peace From Strength" },
    { id: "aPeaceNooneExpected42", date: "SEPTEMBER 1942", title: "The Shape of a Peace That Wasn't Supposed to Happen" },
    { id: "earlyPeaceChannel42", date: "AUGUST 1942", title: "A Channel, If Anyone Answers" },
    { id: "earlyPeaceOutcome42", date: "1942 – 1945", title: "Three Years Early" },
    { id: "kokodaTrail42", date: "JULY – NOVEMBER 1942", title: "The Kokoda Track" },
    { id: "guadalcanal42", date: "AUGUST – NOVEMBER 1942", title: "The Attrition Nobody Planned For" },
    { id: "keGoWithdrawal43", date: "JANUARY – FEBRUARY 1943", title: "Operation Ke-Go" },
    { id: "yamamotoDeath43", date: "APRIL 1943", title: "Operation Vengeance" },
    { id: "attu43", date: "MAY 1943", title: "Attu" },
    { id: "theMainlandCrisis44", date: "1944", title: "Two Fronts, One Army Left" },
    { id: "ichiGoTriumph44", date: "LATE 1944", title: "The Corridor" },
    { id: "philippineSea44", date: "JUNE 1944", title: "The Marianas: What's Left of the Carrier Air Arm" },
    { id: "onishiKamikaze44", date: "OCTOBER 1944", title: "Onishi's Proposal" },
    { id: "leyteGulf44", date: "OCTOBER 1944", title: "Sho-Go: The Fleet as Decoy" },
    { id: "kuritaAtLeyte44", date: "OCTOBER 25, 1944", title: "Taffy 3" },
    { id: "leyteBeachheadAftermath44", date: "OCTOBER 1944", title: "The Beachhead's Reach" },
    { id: "iwoJima45", date: "FEBRUARY 1945", title: "Iwo Jima: The Doctrine That Abandoned the Beach" },
    { id: "okinawa45", date: "APRIL – JUNE 1945", title: "Okinawa: What's Left to Spend" },
    { id: "theSubmarineCarriersQuestion45", date: "JUNE 1945", title: "The World's Largest Submarines, Still Waiting for Orders" },
    { id: "ketsuGo45", date: "1945", title: "Ketsu-Go: The Home Islands Question" },
    { id: "afterHiroshima45", date: "AUGUST 6, 1945", title: "Hiroshima" },
    { id: "afterNagasaki45", date: "AUGUST 9, 1945", title: "Nagasaki" },
    { id: "sacredDecision45", date: "AUGUST 14 – 15, 1945", title: "The Recording" },
    { id: "ketsuGoFinalStand45", date: "AUGUST 1945", title: "A Deadlock With No One Left to Break It" },
    { id: "theDeadlockHolds45", date: "LATE AUGUST 1945", title: "What the Deadlock Doesn't Stop" },
    { id: "termsWorthHaving45", date: "1945", title: "A Negotiation With Something Behind It" },
    { id: "unhinderedSouth42", date: "EARLY – MID 1942", title: "The War America Didn't Wake Up To" },
    { id: "australiaLanding42", date: "LATE 1942", title: "Darwin: The Beachhead Nobody Could Supply" },
    { id: "washingtonDecides42", date: "LATE 1942", title: "Washington's Verdict" },
    { id: "perimeterDoctrine42", date: "MID 1942", title: "The Fortress That Held Longer" },
    { id: "severSupplyLine42", date: "MID 1942", title: "The Road Not Cut at Midway" },
    { id: "operationFsCulmination42", date: "LATE 1942", title: "Finishing What FS Started" },
    { id: "earlyPerimeter43", date: "1943", title: "The Line Held at Bougainville" },
    { id: "theLongWarFooting45", date: "1945", title: "A War Fought From a Different Position" },
    { id: "moscowMediates45", date: "1945", title: "Moscow's Price" },
    { id: "surrenderInquiry45", date: "1945", title: "A Fleet Preserved, A War Still Lost" },
    { id: "twoFrontStrain44", date: "1943 – 1944", title: "The Southern Operation, Delayed" },
    { id: "theDelayedStrike44", date: "1943 – 1944", title: "A Fleet That Was Never Attacked" },
    { id: "theUnbloodiedFleets45", date: "1945", title: "Two Fleets, Neither Blooded" },
    { id: "theUndemolishedFields44", date: "1944", title: "The Fields Nobody Burned" },
    { id: "theFuelLedger44", date: "1944", title: "The Fuel Ledger Between Two Fronts" },
    { id: "aSecondArmisticeQuestion44", date: "1944", title: "A Second Front's Own Bill Comes Due" },
    { id: "theBelatedReckoning45", date: "1945", title: "A War Two Years Behind Its Own Clock" },
    { id: "kantokuenFinalWord46", date: "1946", title: "The Price of Striking North" },
    { id: "americaDecides44", date: "1943 – 1944", title: "Two Years Without a Pearl Harbor" },
    { id: "aQuietEmpire45", date: "1945", title: "The War That Waited" },
    { id: "newWorldOrder45", date: "1945 – 1946", title: "A Charter With No Chair for This Japan" },
    { id: "coldWarOpening48", date: "1947 – 1950", title: "The Uses of an Unconquered Japan" },
  ],
  alliedPacific: [
    { id: "fleetAtHawaii40", date: "MAY 1940", title: "The Fleet Stays at Hawaii" },
    { id: "richardsonObjection40", date: "OCTOBER 1940", title: "Richardson's Objection" },
    { id: "atlanticTransfer41", date: "MAY – JUNE 1941", title: "Ships for the Atlantic" },
    { id: "americanEmbargoResponse41", date: "JULY 1941", title: "The Embargo Decision" },
    { id: "chinaAirForce41", date: "JULY – NOVEMBER 1941", title: "A Bomber Force for China" },
    { id: "aStandoffInsteadOfAWar41", date: "LATE 1941 – 1943", title: "A War Fought Without the United States" },
    { id: "theSlowerDeclaration42", date: "EARLY 1942", title: "Five Weeks in 1917, and No Guarantee of the Same Now" },
    { id: "warBeginsLate42", date: "1942", title: "A War Congress Chose Rather Than Had Chosen For It" },
    { id: "theUnopposedConsolidation42", date: "LATE 1942", title: "A Resource Area With Nobody Contesting It" },
    { id: "twoForcesNeitherTested43", date: "1943", title: "Two Forces, Neither Tested" },
    { id: "chinasWarAlone43", date: "1943", title: "The War Nobody Came to Help Finish" },
    { id: "britainsCalculus43", date: "1943", title: "No Asiatic Possession Worth the Cost" },
    { id: "japanUnopposed43", date: "1943", title: "The Tide's High-Water Mark" },
    { id: "chinaCivilWarShadow43", date: "1943", title: "Five Hundred Thousand Men Not Fighting Japan" },
    { id: "dutchExileCalculus44", date: "1944", title: "Recolonization Without the Means to Enforce It" },
    { id: "warWithoutAmerica45", date: "1945", title: "Manchuria, Not Hiroshima" },
    { id: "wakeIslandRelief41", date: "DECEMBER 1941", title: "The Relief Force" },
    { id: "arcadia41", date: "DECEMBER 1941 – JANUARY 1942", title: "Arcadia: Europe First, Confirmed" },
    { id: "internmentQuestion42", date: "FEBRUARY 1942", title: "Executive Order 9066" },
    { id: "stilwellInChungking42", date: "FEBRUARY – MARCH 1942", title: "A General for Chiang" },
    { id: "rangoonRetreatAllied42", date: "MARCH – APRIL 1942", title: "The Fall of Rangoon" },
    { id: "curtinsTurn42", date: "FEBRUARY 1942", title: "Curtin's Turn" },
    { id: "corregidorEvacuation42", date: "MARCH 1942", title: "The Order to Leave" },
    { id: "doolittleRaidAllied42", date: "APRIL 1942", title: "Doolittle's Gamble" },
    { id: "carrierRequest42", date: "APRIL 1942", title: "Churchill Asks for a Carrier" },
    { id: "coralSeaMidwayAllied42", date: "MAY – JUNE 1942", title: "Midway: The Ambush Nobody Was Supposed to Win" },
    { id: "kokodaTrailAllied42", date: "JULY – NOVEMBER 1942", title: "The Kokoda Track" },
    { id: "guadalcanalAllied42", date: "AUGUST 1942", title: "Watchtower: The First Offensive" },
    { id: "savoIslandReckoning42", date: "AUGUST 1942", title: "Savo Island" },
    { id: "vladivostokRoute42", date: "LATE 1942", title: "The Pacific Route to Russia" },
    { id: "unconditionalSurrender43", date: "JANUARY 1943", title: "The Casablanca Declaration" },
    { id: "torpedoCrisis43", date: "JANUARY 1943", title: "The Torpedo That Won't Explode" },
    { id: "theBatBombQuestion43", date: "JANUARY 1943", title: "Project X-Ray: A Dentist's Idea, Sixteen Months Later" },
    { id: "bismarckSea43", date: "MARCH 1943", title: "The Bismarck Sea" },
    { id: "yamamotoIntercept43", date: "APRIL 1943", title: "Operation Vengeance: The Yamamoto Intercept" },
    { id: "yamamotoSurvives43", date: "SUMMER 1943", title: "Yamamoto's Silence" },
    { id: "tehransPromise43", date: "NOVEMBER – DECEMBER 1943", title: "Stalin's Promise, Pressed Early" },
    { id: "centralPacificDrive43", date: "1943 – 1944", title: "Leapfrogging the Strong Points" },
    { id: "theTarawaQuestion43", date: "LATE 1943", title: "The Tarawa Question" },
    { id: "macArthurTension44", date: "1944", title: "MacArthur Goes to the Press" },
    { id: "macArthurAftermath44", date: "1944", title: "Eichelberger's Command" },
    { id: "philippineSeaAllied44", date: "JUNE 1944", title: "The Marianas: Spruance's Choice" },
    { id: "chinaCrisisAllied44", date: "1944", title: "Two Fronts, One Air Bridge" },
    { id: "stilwellUltimatum44", date: "SEPTEMBER 1944", title: "Deliver It Now, or Not At All" },
    { id: "stilwellPreserved44", date: "OCTOBER 1944", title: "Stilwell's Narrower Command" },
    { id: "peleliuDecision44", date: "SEPTEMBER 1944", title: "Halsey's Recommendation" },
    { id: "peleliuForcesRedirected44", date: "SEPTEMBER 1944", title: "Peleliu's Redirected Divisions" },
    { id: "aDifferentPacific45", date: "1945", title: "The Extra Tonnage" },
    { id: "aDifferentPacificFinalWord45", date: "1945", title: "The Different Road's Price" },
    { id: "portChicago44", date: "AUGUST 1944", title: "Port Chicago: The Order Back to the Pier" },
    { id: "philippinesFormosaAllied44", date: "LATE 1944", title: "Return to the Philippines, or Bypass for Formosa" },
    { id: "quezonsSuccessor44", date: "OCTOBER 1944", title: "A President Who Didn't Live to See the Beach" },
    { id: "halseyTyphoon44", date: "DECEMBER 1944", title: "Typhoon Cobra" },
    { id: "halseyAftermath44", date: "1945", title: "One Command, Not Two" },
    { id: "burmaReconquest45", date: "1945", title: "Reopening the Overland Route" },
    { id: "cabanatuanRaid45", date: "JANUARY 1945", title: "Cabanatuan: Thirty Miles Behind the Lines" },
    { id: "iwoJimaAllied45", date: "FEBRUARY 1945", title: "Iwo Jima: The Bombardment Argument" },
    { id: "okinawaAllied45", date: "APRIL – JUNE 1945", title: "Okinawa: The Picket Line" },
    { id: "strategicBombingAllied45Delayed", date: "APRIL – JUNE 1945", title: "The Incendiary Campaign, Already Underway" },
    { id: "atomicDemonstration45", date: "JUNE – JULY 1945", title: "The Interim Committee's Question" },
    { id: "targetSelection45", date: "JULY 1945", title: "The Remaining List" },
    { id: "kyotoTargetDebate45", date: "JUNE 1945", title: "The City Groves Wanted Most" },
    { id: "kyotoStruck45", date: "AUGUST 6, 1945", title: "Stimson's Warning, Ignored" },
    { id: "hiroshima45", date: "AUGUST 6, 1945", title: "Hiroshima" },
    { id: "nagasaki45", date: "AUGUST 9, 1945", title: "Nagasaki" },
    { id: "nagasakiDelayed45", date: "AUGUST 1945", title: "The Extra Days" },
    { id: "radiationDisclosure45", date: "SEPTEMBER 1945", title: "A Very Pleasant Way to Die" },
    { id: "indianapolisSinking45", date: "JULY 1945", title: "The Indianapolis" },
    { id: "indianapolisReview45", date: "1945", title: "The Indianapolis Findings" },
    { id: "downfallOrBlockade45", date: "1945", title: "Downfall or Starvation" },
    { id: "gasWarfareQuestion45", date: "1945", title: "The Argument for Gas" },
    { id: "combinedPressureCollapse45", date: "AUGUST 1945", title: "Two Strategies, One Question" },
    { id: "sovietHokkaido45", date: "AUGUST 1945", title: "Stalin's Request" },
    { id: "theEmperorQuestion45", date: "SEPTEMBER 1945", title: "The Emperor Question" },
    { id: "occupationAuthority45", date: "SEPTEMBER 1945", title: "One Man, One Occupation" },
    { id: "pacificFirstGamble42", date: "1942", title: "The Atlantic, Thinner" },
    { id: "conservativePacific42", date: "MID-LATE 1942", title: "The Fleet That Didn't Gamble" },
    { id: "japanStrikesAgain42", date: "MID-LATE 1942", title: "The Fleet That Wasn't Beaten" },
  ],
};


const CONTEXT_NOTES = {
  german: [
    { term: "The Fall of France, 1940", note: "The Manstein Plan sent panzers through the supposedly impassable Ardennes, splitting the Allied armies in six weeks: a victory so total it briefly convinced Hitler the war was effectively won, and shaped every overconfident decision that followed." },
    { term: "Dunkirk", note: "Hitler's halt order let some 338,000 British and French troops evacuate rather than be captured: one of the war's most argued-over decisions, since that intact army was what Britain had left to fight on with." },
    { term: "Operation Barbarossa, 1941", note: "The invasion of the USSR: the largest military operation in history, on a front over 1,800 miles wide. It opened five weeks later than originally planned, a delay some historians tie to the Balkans campaign and argue cost Germany the dry season it needed to take Moscow before winter." },
    { term: "Stalingrad", note: "A city on the Volga that mattered as much for its name as its position: Hitler and Stalin each treated its fate as a personal test of will. Its loss, with an entire German army encircled and destroyed, was the war's clearest turning point in the east." },
    { term: "Kursk, 1943", note: "The last major German strategic offensive in the east, and history's largest tank battle. Soviet intelligence knew the attack was coming and prepared defenses in depth; after Kursk failed, Germany never again held the initiative on the eastern front." },
    { term: "The July 20 Plot, 1944", note: "Stauffenberg's bomb failed to kill Hitler by a matter of feet and a heavy table leg. The reprisals that followed reached deep into the same officer corps this campaign puts you in command of." },
  ],
  soviet: [
    { term: "The Border Collapse, June 1941", note: "Barbarossa caught the Red Army in the middle of a reorganization, with Stalin having ignored repeated intelligence warnings. Entire armies were encircled in the war's first weeks: a catastrophe the Soviet state came startlingly close to not surviving." },
    { term: "Moscow, October–December 1941", note: "The government itself considered evacuating as German spearheads closed on the capital. That Stalin publicly stayed, and that the city held through the winter, is credited with breaking a panic that briefly threatened to unravel the whole Soviet war effort." },
    { term: "Stalingrad, 1942–43", note: "Named for Stalin himself, which is precisely why neither side could afford to lose it as a matter of prestige as much as strategy. Chuikov's defense inside the ruins, followed by the encirclement of an entire German army, made it the war's decisive turning point." },
    { term: "Kursk, 1943", note: "Soviet foreknowledge of the German plan, built through both intelligence and Hitler's own repeated delays, let Stavka prepare the deepest defensive belts of the war before the largest tank battle in history began." },
    { term: "Operation Bagration, 1944", note: "Timed to the anniversary of Barbarossa, this offensive destroyed an entire German army group, arguably the single largest defeat the German army suffered in the whole war, while Western attention stayed fixed on Normandy." },
    { term: "The Race for Berlin, 1945", note: "Stalin deliberately left the boundary between Zhukov's and Konev's fronts ambiguous, turning the war's final battle into a competitive double envelopment between two rival marshals." },
  ],
  allied: [
    { term: "Dunkirk", note: "Framed at the time as a deliverance rather than a defeat: Churchill himself warned Parliament not to call it a victory, even as the evacuation of an entire army became the story Britain needed to keep fighting." },
    { term: "Pearl Harbor, December 1941", note: "Brought the United States into a war it had been supplying but not fighting. Hitler's decision to declare war on the US days later, honoring the Axis pact with no obligation to, remains one of the war's more consequential unforced errors." },
    { term: "El Alamein, 1942", note: "Churchill's own verdict on the battle: \"not the end, nor the beginning of the end, but perhaps the end of the beginning\": marked the first unambiguous British victory of the war and the turn against Rommel in North Africa." },
    { term: "Normandy, June 1944", note: "The long-delayed second front Stalin had demanded since 1941. Its timing depended on landing craft, weather, and deception operations convincing German intelligence the real target was Calais." },
    { term: "Market Garden, September 1944", note: "A single-road gamble to seize a Rhine bridgehead and end the war by Christmas: undone partly by fresh German armor refitting, by chance, almost on top of the furthest drop zone." },
    { term: "Yalta, February 1945", note: "The conference that shaped the postwar map more than any battle still to come: Poland's fate, occupation zones, and the working relationship between the Big Three were all set here, weeks before Roosevelt's death." },
  ],
  italy: [
    { term: "The Taranto Raid, November 1940", note: "Twenty-one aging biplanes crippled half of Italy's battle fleet at anchor in a single night: a demonstration of carrier air power against a battle line in harbor that Japanese naval planners studied closely before Pearl Harbor." },
    { term: "Operation Compass, December 1940", note: "A British force roughly a third the size of the Italian Tenth Army it faced destroyed that army as a fighting force within two months, taking some 130,000 prisoners: the disaster that brought Rommel to North Africa." },
    { term: "The Fall of the Grand Council, July 1943", note: "Mussolini's own regime voted him out, 19 to 7, after three years of losing war, and it was the King's independent authority to dismiss and arrest him the next day, not the Council's vote itself, that actually ended his government." },
    { term: "The Armistice, September 1943", note: "Announced before Rome's own military had coherent orders for what came next: the army disintegrated in the chaos, some 600,000 soldiers were deported to Germany as forced labor, and Italy split into two rival governments within weeks." },
    { term: "Monte Cassino, 1944", note: "Four Allied offensives (American, British and Commonwealth, Polish among them) were needed to break a single defensive position anchored on a medieval abbey, at a combined cost of over 50,000 Allied casualties." },
    { term: "The Death of Mussolini, April 1945", note: "Captured by Communist partisans fleeing toward Switzerland, shot without trial, and displayed hanging in a Milan piazza: on the same square where Fascist authorities had displayed partisan bodies the previous summer." },
  ],
  // From Dispatches 1941.
  japan: [
    { term: "The China War's Unresolved Peace, 1937–40", note: "Prince Konoe's government declared in January 1938 that it would no longer deal with Chiang Kai-shek's government at all, foreclosing a negotiated settlement many historians consider to have been available on relatively generous terms at the time: a decision whose cost in tied-up divisions compounded for the rest of the war." },
    { term: "The Road to War, 1940–41", note: "The Tripartite Pact, the occupation of southern Indochina, and the resulting American oil embargo, in that order, did more to set the war's actual deadline than any single decision made after Pearl Harbor. The Hull Note in November 1941 closed the last diplomatic track Ambassador Nomura and Prince Konoe had spent the year trying to keep open." },
    { term: "Army-Navy Rivalry", note: "Japan's Army and Navy ran separate codebreaking bureaus, separate intelligence networks, and separate aircraft procurement programs throughout the war, with well-documented duplication and poor coordination between them. Unlike Germany's or the Allies' eventual joint command structures, no serious wartime attempt at unification succeeded." },
    { term: "Kantokuen, Summer 1941", note: "Nearly 700,000 Kwantung Army troops secretly mobilized on the Manchurian border for a possible strike into Siberia while Germany's invasion of the Soviet Union appeared to be succeeding, quietly stood down by late August once Soviet resistance around Smolensk proved harder than expected. It was the last live moment for the Army's decade-long preference for a war against Russia over the Navy's war against the resource-rich south." },
    { term: "The Southern Operation, 1941–42", note: "The whole point of the war from Tokyo's side: seizing the oil, rubber, and tin of Southeast Asia and the Indies after the American oil embargo made continuing the China war, on the existing footing, a matter of months rather than years." },
    { term: "Pearl Harbor, December 1941", note: "A tactical triumph that missed the fleet's carriers and its fuel and repair infrastructure: the two assets that mattered most for the year that followed. It also unified American opinion behind the war overnight, the one outcome Yamamoto's plan could least afford." },
    { term: "The Fall of Rangoon, March 1942", note: "Fifteenth Army's capture of Rangoon closed the Burma Road, China's only land connection to Western supply, and forced the rest of the war's China lifeline through the far lower-capacity Hump airlift over the Himalayas." },
    { term: "The Doolittle Raid, April 1942", note: "Sixteen Army bombers hit Tokyo and four other cities in a raid that killed almost nobody and destroyed almost nothing physically, but the shock of the home islands proving vulnerable is widely credited with silencing the remaining internal skepticism about the Midway operation." },
    { term: "The Captured Airmen, August 1942", note: "Eight of the raid's eighty airmen were captured and tried on an unsubstantiated charge of strafing civilians. Three were executed by firing squad; the Emperor commuted the remaining five death sentences, one of whom later died of malnutrition in captivity." },
    { term: "Midway, June 1942", note: "Four fleet carriers and their veteran air crews lost in a single morning, in a five-to-six-minute window that turned on American codebreaking and a dive-bomber squadron arriving just as Japanese flight decks were loaded and exposed. Japan's carrier arm never recovered the trained air crews this battle cost." },
    { term: "The Peace Question Never Asked, 1942", note: "No documented Japanese peace feeler toward Washington exists from 1942. Admiral Yonai's real, well-recorded skepticism about the war never translated into a concrete initiative before 1945, and Roosevelt's unconditional surrender doctrine, declared at Casablanca in January 1943, closed even the theoretical window explored here as one of the campaign's most speculative forks." },
    { term: "The UN Charter's Enemy-State Clauses, 1945", note: "The United Nations Charter, signed at San Francisco by fifty Allied nations, named Japan and Germany directly in its enemy-state clauses (Articles 53 and 107). Japan did not become a UN member until December 1956, after a peace treaty and years of Soviet veto obstruction, a decade after the war this alternate path imagines Japan never fighting." },
    { term: "The Kokoda Track, 1942", note: "Horii's South Seas Detachment pushed to within thirty miles of Port Moresby along a single mountain foot-track before an unsustainable supply line forced a withdrawal that became its own catastrophe: of roughly 13,000 men committed across the campaign, fewer than half remained fit to fight by the time it ended." },
    { term: "The Australia Invasion That Never Was, 1942", note: "Japan's Army General Staff studied and rejected an invasion of Australia in real 1942 planning, concluding the necessary shipping tonnage simply didn't exist and any attempt would starve every other front. It never reached operational planning, let alone an actual landing." },
    { term: "Guadalcanal, 1942–43", note: "Not the decisive battle either side planned for, but a half-year campaign of attrition: night destroyer actions, jungle starvation, and a steady bleed of naval air crews Japan's training pipeline had no capacity to replace at the historical rate." },
    { term: "Yamamoto's Death, April 1943", note: "American codebreakers intercepted his detailed flight itinerary and shot his aircraft down over Bougainville. Japan concealed his death from the public for over a month, informing the Emperor immediately but timing the public announcement for the least damaging moment available." },
    { term: "U-Go and Ichi-Go, 1944", note: "Japan's two largest mainland offensives of the war, launched almost simultaneously: Ichi-Go overran American airbases in China and succeeded tactically; U-Go's invasion of India via Imphal and Kohima, launched on a twenty-day ration assumption, became one of the Imperial Army's costliest defeats anywhere in the war." },
    { term: "Ichi-Go's Strategic Value", note: "Despite being the largest and most successful Japanese ground offensive of the war by territory taken, historians generally consider Ichi-Go to have had little to no effect on the war's actual outcome, which was being decided by submarine blockade and strategic bombing, neither of which the China theater could touch." },
    { term: "Operation Ke-Go, January–February 1943", note: "Roughly 11,000 Japanese soldiers were evacuated from Guadalcanal in twenty destroyer runs, under a deception plan convincing enough that American command didn't recognize the withdrawal for what it was until it was essentially complete, one of the more skillful logistics operations either side managed in the entire war." },
    { term: "Attu, May 1943", note: "Of a roughly 2,600-man Japanese garrison cut off in the Aleutians, fewer than 30 were taken alive after Colonel Yamasaki led a final banzai charge on May 29th. It was the first mass banzai charge of the war on this scale, a pattern later repeated at far greater scale at Saipan and Okinawa." },
    { term: "The Marianas Turkey Shoot, June 1944", note: "Roughly 600 Japanese aircraft destroyed in a single battle against a handful of American losses: the worst single-day defeat of Japanese naval aviation in the war, and the effective end of Japan's carrier-pilot training pipeline as a serious fighting force." },
    { term: "Taffy 3 and Kurita's Withdrawal, October 1944", note: "Kurita's battleship force broke through San Bernardino Strait to find only a single escort carrier group, Taffy 3, and its destroyers standing between his guns and Leyte's vulnerable invasion transports. After a fierce defense by the destroyers and amid fragmentary intelligence about American carrier strength, Kurita withdrew rather than pressing the attack, a decision historians still debate as one of the war's most consequential command choices." },
    { term: "Organized Kamikaze Doctrine, October 1944", note: "Vice Admiral Onishi proposed formally organizing suicide attacks as First Air Fleet doctrine at Leyte Gulf, reasoning that a force reduced to roughly thirty operational aircraft had no other way to meaningfully strike an American carrier force. The doctrine spread to become official Navy and Army policy for the rest of the war." },
    { term: "Leyte Gulf, October 1944", note: "The Imperial Navy's last major operation and the largest naval battle in history by some measures. Kurita's battleship force broke through to the invasion beaches and then withdrew, a decision still argued over; the surface navy ceased to exist as an offensive force afterward regardless." },
    { term: "Iwo Jima and Okinawa, 1945", note: "The last two island battles before the home islands. Iwo Jima cost the Marine Corps its highest single-battle death toll of the war against a tunnel-dug defense that abandoned beach-defense doctrine entirely; Okinawa's Kikusui kamikaze campaign, including the battleship Yamato's one-way sortie, became the costliest single battle of the Pacific War for the U.S. Navy." },
    { term: "Ketsu-Go and the Surrender, 1945", note: "Japan's home-islands defense plan assumed the political cost of an invasion could be made unbearable for America. Two atomic bombs and a Soviet declaration of war, inside a single week in August, forced a surrender the war ministry's hardliners had not planned an exit from." },
    { term: "Stalin's Yalta Commitment, February 1945", note: "Stalin secretly promised Roosevelt at Yalta that the Soviet Union would enter the Pacific war within roughly three months of Germany's surrender, in exchange for territorial concessions in Manchuria, the Kurils, and southern Sakhalin. Tokyo's real, contemporaneous outreach to Moscow as a peace mediator went unanswered because Stalin had already committed against Japan months before the approach was made." },
    { term: "The I-400 and the Panama Canal, 1945", note: "The largest submarines built by any navy in the war, ordered by Yamamoto before his 1943 death specifically to bomb the Panama Canal's lock gates. Real preparations were halted on June 25, 1945, redirected toward American forces massing at Ulithi Atoll instead; a missed radio rendezvous pushed that attack to August 25th, thirteen days after the actual surrender, and it never happened either." },
  ],
  alliedPacific: [
    { term: "The Oil Embargo, July–August 1941", note: "Japan's occupation of southern Indochina triggered an American asset freeze that hardened, largely through strict administrative implementation rather than an explicit presidential order, into a near-total oil embargo: the single biggest factor in Japan's eighteen-month war clock, set five months before Pearl Harbor." },
    { term: "Arcadia, December 1941 – January 1942", note: "Roosevelt and Churchill confirmed Germany as the priority enemy within weeks of Pearl Harbor: a decision Admiral King spent the rest of the war contesting, without ever formally overturning it." },
    { term: "Executive Order 9066, February 1942", note: "Authorized the forced removal of roughly 120,000 Japanese Americans, most of them citizens, from the West Coast, on a military necessity claim later government reviews found unsupported by actual evidence. Attorney General Biddle's Justice Department opposed it and lost the argument." },
    { term: "Ambassador Grew's Warning, 1941", note: "Joseph Grew's real cables from Tokyo repeatedly warned Washington that a total oil embargo would strengthen Japan's war faction's argument that negotiation had failed, rather than restraining Japanese expansion. Historians still debate whether a more calibrated embargo could have delayed or altered the path to Pearl Harbor." },
    { term: "Wake Island's Relief Force, December 1941", note: "A relief force built around the carrier Saratoga was recalled roughly a day before it would have reached the besieged Wake garrison, which surrendered on December 23rd after repelling an earlier invasion attempt outright. The decision remains one of the most disputed command calls of the early Pacific war." },
    { term: "The Casablanca Declaration, January 1943", note: "Roosevelt announced unconditional surrender as declared Allied policy against Germany, Italy, and Japan alike. Historians remain divided on whether removing any negotiated off-ramp prolonged Japanese resistance or made no difference to a war ministry that was never going to negotiate regardless." },
    { term: "The Battle of the Bismarck Sea, March 1943", note: "Every transport in an eight-ship Japanese convoy was sunk by Fifth Air Force skip-bombing, killing roughly 3,000 of the roughly 6,900 troops aboard. Japan effectively abandoned daylight convoy reinforcement of New Guinea by sea afterward, one of the most lopsided air-versus-naval engagements of the war." },
    { term: "Tarawa's Public Reckoning, November 1943", note: "Over a thousand Marines died in seventy-six hours taking Betio, and Life magazine's publication of photographs showing American dead in the surf, over Navy objection, shocked the public and prompted real Congressional scrutiny of assault-doctrine casualties, though it never actually forced a change in operational strategy." },
    { term: "Stalin's Tehran Promise, November 1943", note: "Stalin privately told Roosevelt at Tehran that the Soviet Union would enter the Pacific war after Germany's defeat, formalized fourteen months later at Yalta and honored to the letter in August 1945. The Eastern Front's manpower needs were never seriously negotiable before Germany's actual collapse." },
    { term: "The Retreat from Burma, 1942", note: "Still called, without much exaggeration, the longest retreat in British military history: nearly a thousand miles from Rangoon to the Indian frontier, fought the entire way. The army Slim rebuilt from it became Fourteenth Army, which broke Japan at Imphal and Kohima two years later." },
    { term: "Curtin's Turn, 1941–42", note: "Prime Minister Curtin's December 1941 declaration that Australia looked to America rather than Britain for defense, followed by his defiance of Churchill's attempt to redirect Australian troops from home defense to Burma, is generally credited as the real, lasting rupture point in Australian-British strategic relations." },
    { term: "Quezon's Death and Philippine Independence, 1944–46", note: "President Manuel Quezon died in August 1944, weeks before the Leyte landing he had spent years pressing for; Vice President Osmeña succeeded him and waded ashore beside MacArthur. The Philippines became independent on schedule on July 4, 1946, alongside a Military Bases Agreement granting the United States extensive, long-contested access to Clark Field, Subic Bay, and other installations." },
    { term: "The Order to Leave, March 1942", note: "Roosevelt ordered MacArthur to leave the besieged Philippines for Australia rather than remain with his garrison. MacArthur reportedly considered defying the order to stay and fight or die with his men before ultimately complying, departing by PT boat and submarine relay." },
    { term: "The Doolittle Raid, April 1942", note: "Sixteen B-25s launched from carriers on a one-way mission gave American morale its first unambiguous good headline after four months of defeats, and inside Imperial Headquarters, the raid's shock is credited with silencing the last skepticism about Midway's accelerated timetable." },
    { term: "Midway, June 1942", note: "American codebreakers identified the target and date weeks in advance; Yorktown was patched in seventy-two hours against a ninety-day repair estimate to sail as a third carrier the Japanese plan didn't expect. Four Japanese fleet carriers were destroyed for one American loss." },
    { term: "The Kokoda Track, 1942", note: "Australian militia conducted a skillful fighting withdrawal down the track that MacArthur, without having visited it himself, publicly read as a failure of nerve: a criticism military historians now generally consider unfair and a lasting source of friction between American and Australian commands." },
    { term: "Guadalcanal, August 1942", note: "The first American offensive of the Pacific war, launched well ahead of what Joint Chiefs staff studies said an operation this size should attempt: held for six months on a logistical shoestring that became the campaign that started converting American production into a Pacific-wide offensive." },
    { term: "Savo Island, August 1942", note: "Four Allied heavy cruisers sunk in under an hour by a Japanese night attack four days into the Guadalcanal landing, one of the worst single defeats in U.S. Navy history. The subsequent inquiry found real, specific command and doctrine failures and became a turning point in how the Navy handled night surface combat for the rest of the war." },
    { term: "Island-Hopping, 1943–44", note: "Nimitz's strategy of bypassing heavily fortified positions like Truk rather than assaulting them directly: starving tens of thousands of Japanese troops on isolated islands for the rest of the war while the advance moved past them." },
    { term: "MacArthur and the Chain of Command", note: "MacArthur repeatedly used friendly press contacts to argue his preferred strategy over agreed Joint Chiefs doctrine throughout the Pacific War, a tolerated pattern of insubordination that finally cost him his command seven years later, in Korea, not in World War II." },
    { term: "The Philippine Sea and Spruance's Caution, June 1944", note: "Spruance's decision to keep Task Force 58 close to the Saipan landing rather than releasing it to hunt Ozawa's fleet remains one of the more disputed command calls of the war: the 'Turkey Shoot' gutted Japanese naval aviation regardless, but Ozawa's carrier hulls escaped, a fact Mitscher and other aviators argued for years represented a missed opportunity." },
    { term: "Typhoon Cobra, December 1944", note: "Halsey's Third Fleet sailed into a typhoon whose track his staff misjudged, losing three destroyers and nearly 800 sailors, more than some actual naval battles cost. A court of inquiry found questionable judgment and recommended no punitive action; Halsey repeated a similar error in a second typhoon six months later." },
    { term: "The Stilwell-Chiang Crisis and Ichi-Go, 1944", note: "Chronic friction between Stilwell and Chiang over command and supply came to a head during Ichi-Go's advance; Stilwell was recalled from China in October 1944 at Chiang's explicit demand, the same year the Dixie Mission's observers at Yan'an were reporting Communist forces fighting the occupation more effectively than the Nationalist front." },
    { term: "The Ledo Road and Burma's Reconquest, 1945", note: "Slim's Fourteenth Army retook Burma in early 1945, and the Ledo Road, an overland supply route into China built through the reconquered north, opened that same year, so late in the war that the Hump airlift it was meant to supplement was already carrying more tonnage than the finished road ever did." },
    { term: "The Shift to Incendiary Bombing, March 1945", note: "LeMay's low-altitude firebombing campaign against Japanese cities began with the March 9–10, 1945 Tokyo raid, which killed an estimated 100,000 people in a single night: the deadliest bombing raid in history, exceeding either atomic bomb's immediate death toll." },
    { term: "The Franck Report and the Demonstration Question, 1945", note: "A group of Manhattan Project scientists formally proposed demonstrating the atomic bomb on an uninhabited site before any use on a populated city. The Interim Committee rejected the idea, citing the limited number of bombs available and the risk that a failed or unimpressive demonstration would embolden rather than deter Japan's war ministry." },
    { term: "Target Selection, 1945", note: "Kyoto was removed from the target list by Secretary of War Stimson personally over the objections of officers who considered it operationally ideal. Nagasaki was not the original secondary target for the second bomb; cloud cover over the primary target, Kokura, forced a last-minute switch on the day of the mission." },
    { term: "USS Indianapolis, July 1945", note: "Sunk four days after delivering components used in the atomic strikes; roughly 300 of her crew died in the sinking and hundreds more over four days awaiting rescue after her overdue status went unreported through a routing failure spread across multiple stations. Captain McVay was the only U.S. Navy captain court-martialed for losing his ship to enemy action in the entire war." },
    { term: "Stalin's Hokkaido Request, August 1945", note: "The Soviet Union requested an occupation zone on northern Hokkaido, mirroring the division of Germany. Truman refused, and American forces secured the island before any serious Soviet landing could be mounted: a decision with major, largely unexplored consequences for Japan's postwar political shape." },
    { term: "The Emperor Question, September 1945", note: "MacArthur argued strongly against prosecuting Hirohito, warning it would require far more occupation troops than were available. Hirohito retained the throne, stripped of official divine status; Tojo's war cabinet was tried separately, and several members were executed." },
    { term: "MacArthur's Occupation Authority, 1945–51", note: "MacArthur governed occupied Japan for six years with extraordinarily broad personal authority, largely outmaneuvering or ignoring the nominal Far Eastern Commission meant to provide Allied oversight. Britain and the Soviet Union both reportedly favored a more shared governing structure. Truman relieved him of an unrelated Korean War command in 1951 in one of the more consequential civil-military confrontations in American history." },
    { term: "Leyte Gulf and the Philippines, 1944", note: "MacArthur's argument for liberating the Philippines outright won out over the Navy's preference for bypassing them for Formosa: a decision that drew the Imperial Navy's remaining strength into the war's largest naval battle." },
    { term: "The Bomb and the Planned Invasion, 1945", note: "Operation Downfall, the invasion of Kyushu and Honshu, was prepared in full at casualty estimates that directly shaped the decision to use the atomic bombs instead. The invasion was never executed; the plan still shaped how the war actually ended." },
    { term: "Peleliu, September–November 1944", note: "Codenamed Stalemate II, the assault on a small, heavily fortified island cost roughly 1,800 American dead against a Japanese garrison of about 10,900, nearly all of whom fought to their deaths in a cave-and-tunnel defense that became the template for Iwo Jima and Okinawa. Historians still widely debate whether it was strategically necessary at all, given how thoroughly the Central Pacific advance had already bypassed the wider Palau group." },
    { term: "Project X-Ray, 1942–44", note: "A real, funded Army and later Navy program to attach small incendiary bombs to hibernating Mexican free-tailed bats and release them over Japanese cities before dawn. Testing showed it was more fire-efficient per pound than conventional incendiaries; Fleet Admiral King cancelled the program in 1944 once it became clear it couldn't reach combat readiness before the Manhattan Project would." },
  ],
};

const ENDINGS_GALLERY = [
  { campaign: "OKW", label: "Flensburg: Signed Twice", hint: "The historical ending.", tier: "Major Defeat" },
  { campaign: "OKW", label: "Reims, Once, in Full", hint: "One signature, no second ceremony.", tier: "Major Defeat" },
  { campaign: "OKW", label: "The Redoubt That Wasn't", hint: "A myth, followed into the mountains.", tier: "Major Defeat" },
  { campaign: "OKW", label: "The Myth Stood Down", hint: "The mountains, declined.", tier: "Minor Defeat" },
  { campaign: "OKW", label: "The Untouched Army", hint: "A fortress that outlasted its war.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Fortress That Conceded", hint: "Norway, surrendered whole.", tier: "Minor Defeat" },
  { campaign: "OKW", label: "The war that never went east", hint: "Barbarossa, cancelled.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Western Armistice: Speculative", hint: "Beyond the evidence, westward.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Volga Line: Speculative", hint: "Beyond the evidence, eastward.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Bomb, The Table Leg, The Coin: Speculative", hint: "The narrowest possible margin, run the other way.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Command That Set the Terms", hint: "A war fought on OKW's tempo throughout.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "Answering, Never Asking", hint: "Every order a response to someone else's.", tier: "Major Defeat" },
  { campaign: "OKW", label: "The Channel That Was Real", hint: "Stockholm, and the minority reading turning out true.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "A Conversation Moscow Wanted Overheard", hint: "Terms explored, and found to be leverage.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "Italy, Sold Cheaply and On Purpose", hint: "Rommel's line, taken over Kesselring's.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Mission That Was Not Flown", hint: "One aircraft, one day, and a defense that could not be planned against.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Interception Nobody Could Plan", hint: "The jets, held back for a single approach.", tier: "Major Defeat" },
  { campaign: "OKW", label: "A Country Taken Apart to Last Longer", hint: "The only answer to the weapon the physics doesn't refute.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "An army that barely resembles the historical one", hint: "Four years of arithmetic, kept.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Winter That Wasn't Supposed to Happen", hint: "Historical Divergence Mode: Moscow falls not through history's narrow window but a wider one: the reinforcements that saved it historically arrived thinner this time.", tier: "Major Victory" },
  { campaign: "OKW", label: "Citadel, Fought With Tanks That Didn't Burn", hint: "Historical Divergence Mode: the early Panther's engine-fire problem is chased down and fixed before Kursk rather than during it, and the spring strike breaches the unfinished defenses it was always supposed to catch.", tier: "Minor Victory" },
  { campaign: "OKW", label: "The Overextension That Didn't Bite", hint: "Historical Divergence Mode: a thinner-than-expected Soviet reserve lets Case Blue hold both the Stalingrad and Caucasus axes at once, longer than the historical overextension ever allowed.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "Recalled to Moscow", hint: "What NKVD Mode was watching for.", tier: "Minor Defeat" },
  { campaign: "STAVKA", label: "The Capital That Evacuated Anyway", hint: "Historical Divergence Mode: without the historical Kiev diversion slowing the German advance, October's panic reaches all the way to the government itself.", tier: "Major Defeat" },
  { campaign: "STAVKA", label: "The Weakness Nobody Exploited", hint: "Historical Divergence Mode: Model's Rzhev garrison runs thinner than the winter pattern, and Operation Mars is launched, and fails at its full historical cost anyway, the gap never noticed in time to change the plan.", tier: "Minor Defeat" },
  { campaign: "STAVKA", label: "The Warning That Went Nowhere", hint: "Historical Divergence Mode: German reconnaissance flags the real concentration areas before Bagration launches, and Army Group Center is destroyed on schedule regardless: whoever read the reports in Berlin, they changed nothing.", tier: "Major Victory" },
  { campaign: "STAVKA", label: "Berlin, Taken Early: At Stalingrad's Price", hint: "February, and paid for the fast way.", tier: "Major Victory" },
  { campaign: "STAVKA", label: "The City That Surrendered to the Ring", hint: "Three days, and no street contested.", tier: "Major Victory" },
  { campaign: "STAVKA", label: "The Heights That Held an Empty Front", hint: "Seelow, declined.", tier: "Major Victory" },
  { campaign: "STAVKA", label: "The Salient Never Offered", hint: "Kharkov, gone around rather than through.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "The City Saved by a Fortnight in June", hint: "Warsaw, reached: by a decision taken two months earlier.", tier: "Major Victory" },
  { campaign: "STAVKA", label: "The Halt That Needed No Excuse", hint: "The one version of that order logistics cannot account for.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "The Offensive That Stopped Where It Was Told", hint: "Bagration, supplied before it launched.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "The Army That Should Not Have Survived This", hint: "The ledger history never got to write this way.", tier: "Major Victory" },
  { campaign: "SHAEF", label: "March 1945, And Still Signed Together", hint: "Casablanca, tested where bending it was worth something.", tier: "Major Victory" },
  { campaign: "SHAEF", label: "The War Ended Early, The Peace Started Colder", hint: "The fastest end available, and its bill.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "The Port That Stopped Being the Constraint", hint: "One port, put above every offensive.", tier: "Minor Victory" },
  { campaign: "SHAEF", label: "Tripoli Before Rommel", hint: "The Western Desert Force went on, and Libya was cleared in 1941.", tier: "Minor Victory" },
  { campaign: "SHAEF", label: "The Fleet That Stayed Afloat", hint: "Force Z kept at Singapore, and still there after the first weeks.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "Tanks Kept for Egypt, and Not Enough", hint: "Moscow promised less, and Crusader failed anyway.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "A Victory That Cost Less Than the Planning Assumed", hint: "Every estimate beaten at once.", tier: "Major Victory" },
  { campaign: "SHAEF", label: "Fighter Command, Nearly Spent", hint: "Historical Divergence Mode: a Luftwaffe that never made the historical switch off the airfields, met by the slower-forming doctrine, pushes Fighter Command closer to its actual breaking point than history ever recorded.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "The Reserve That Never Bled at Rzhev", hint: "The autumn of 1942, weighted south.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "Berlin by the Longer Road", hint: "The pursuit that went west instead.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "Chuikov's Patience", hint: "Seelow, suppressed before it was assaulted.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "The Searchlights at Seelow", hint: "Zhukov's infamous night, as it happened.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "The Alliance That Held", hint: "Yalta Mode, cohesion strongly positive.", tier: "Major Victory" },
  { campaign: "SHAEF", label: "Papering Over the Cracks", hint: "Yalta Mode, cohesion critically frayed.", tier: "Minor Defeat" },
  { campaign: "SHAEF", label: "Churchill's Aegean Gambit", hint: "The Dodecanese, attempted.", tier: "Minor Defeat" },
  { campaign: "SHAEF", label: "The Race for Vienna", hint: "The Ljubljana Gap, driven for.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "The Raids Not Flown", hint: "February 1945, and a word never earned.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "The Quiet Contribution", hint: "A quieter posting, used well.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "The Officer Nobody Remembers", hint: "A quieter posting, survived.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "A Second Polish Army", hint: "The armed Home Army, left standing.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "One Army, One Command", hint: "The armed Home Army, absorbed.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "Discretion Revoked", hint: "Falaise, decided by SHAEF directly.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "The City We Already Held", hint: "Vienna, pressed for at the table.", tier: "Minor Victory" },
  { campaign: "SHAEF", label: "Vienna, Held Quietly", hint: "Vienna, left to the conference.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Arm Bled Dry", hint: "The Atlantic, held past all reason.", tier: "Major Defeat" },
  { campaign: "OKW", label: "The Mercy Spent Twice", hint: "July 20th's protection, spent again.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "Where the Mercy Ended", hint: "July 20th's protection, not repeated.", tier: "Major Defeat" },
  { campaign: "OKW", label: "The Withdrawal, Delayed", hint: "A season too late, and it showed.", tier: "Major Defeat" },
  { campaign: "STAVKA", label: "The City Half-Saved", hint: "Warsaw, relieved against the odds.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "Fire in the Smoke, Named", hint: "Berlin's rivalry, recorded honestly.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "Surrender Without the Fire", hint: "The bomb, and terms sought before it.", tier: "Major Defeat" },
  { campaign: "OKW", label: "The Fortress Meets the Bomb", hint: "The fortress strategy's final ledger.", tier: "Major Defeat" },
  { campaign: "OKW", label: "The Race Never Run", hint: "A crash program, decades too late.", tier: "Major Defeat" },
  { campaign: "OKW", label: "Napoleon's Weather, Repeated", hint: "The pursuit past Moscow, at its worst.", tier: "Major Defeat" },
  { campaign: "OKW", label: "The Army That Reached the Oder", hint: "Collapse, fought as a withdrawal.", tier: "Minor Defeat" },
  { campaign: "OKW", label: "Pockets, Not a Line", hint: "Collapse, ordered to hold anyway.", tier: "Major Defeat" },
  { campaign: "OKW", label: "The Retreat That Held Together", hint: "The 1943 collapse, fought in order.", tier: "Minor Defeat" },
  { campaign: "OKW", label: "Destroyed in Place", hint: "The 1943 collapse, held as ordered.", tier: "Major Defeat" },
  { campaign: "SHAEF", label: "Ankara, Pressed", hint: "Turkey, pushed toward the war early.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "Ankara, Courted", hint: "Turkey, left to its own clock.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "The Wall Paid For in Shells", hint: "The Eastern Wall, broken by artillery.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "The Seam in the Wall", hint: "The Eastern Wall, found by patience.", tier: "Minor Victory" },
  { campaign: "OKW", label: "The Canal in Sight", hint: "A supplied desert war, driven hard.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Patience Fuel Bought", hint: "A supplied desert war, rebuilt first.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "The Gothic Line, Met With Momentum", hint: "Rome's early fall, spent pushing north.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "Rome's Dividend, Spent Elsewhere", hint: "Rome's early fall, banked for Overlord.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "The Ring, Closed After the Fact", hint: "Uranus's escaped remnants, hunted down.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "What the Steppe Kept", hint: "Uranus's escaped remnants, left alone.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Army That Held the East", hint: "Army Group Center, preserved and kept east.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "Spent in Normandy Instead", hint: "Army Group Center, preserved and sent west.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "Insured Against a Question Nobody Could Answer", hint: "Overlord planned without Dieppe's lesson.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "The Lesson Assumed, Not Learned", hint: "Overlord planned on theory alone.", tier: "Minor Defeat" },
  { campaign: "STAVKA", label: "Ukraine, Taken on Momentum", hint: "The southern vacuum, filled at speed.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "The Vacuum, Filled Slowly", hint: "The southern vacuum, filled with care.", tier: "Minor Victory" },
  { campaign: "OKW", label: "The Good Week, Spent Anyway", hint: "Kursk's rare win, pressed further.", tier: "Major Defeat" },
  { campaign: "OKW", label: "One Good Week, Left as One", hint: "Kursk's rare win, banked and held.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "The Coalition Withdraws Confidence", hint: "Coalition Cohesion, broken past holding.", tier: "Major Defeat" },
  { campaign: "OKW", label: "The Pattern, Noticed", hint: "Führer Mode's own ceiling on defiance.", tier: "Major Defeat" },
  { campaign: "SHAEF", label: "The United Front, Spent", hint: "Yalta's rare unity, spent on a protest.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "The United Front, Banked", hint: "Yalta's rare unity, saved for later.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "The Lean Seal", hint: "East Prussia's masking force, kept minimal.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "The Insurance Premium", hint: "East Prussia's masking force, kept heavy.", tier: "Minor Victory" },
  { campaign: "OKW", label: "An Empire for a Signature", hint: "Franco's full price, paid in full.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Transaction, Not the Alliance", hint: "Franco's price, paid at the minimum.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Firm Line, Spent Trying for More", hint: "The Dnieper's firmest line, pressed further.", tier: "Major Defeat" },
  { campaign: "OKW", label: "The Quiet Winter", hint: "The Dnieper's firmest line, left to hold.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "A Flag Over Athens, Kept", hint: "Athens, held against the sphere agreement.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "A Flag Over Athens, Lowered", hint: "Athens, voluntarily returned.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "The Road Not Taken to Athens", hint: "Greece, tested and declined.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "The Salient, Sealed Twice", hint: "The Bulge, blunted with reserves spent twice.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "Logistics Did the Rest", hint: "The Bulge, trusted to run out of fuel.", tier: "Minor Victory" },
  { campaign: "SHAEF", label: "Europe First, in Name Only", hint: "The Pacific lifeline, quietly reinforced anyway.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "The Price of the Policy", hint: "The Pacific lifeline, held to the letter.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "Thin Across Every Front", hint: "The 1942 shortfall, spread evenly.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "Fewer Divisions, Fully Armed", hint: "The 1942 shortfall, concentrated instead.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "The Half-Success, Spent", hint: "Kursk's preemptive strike, pressed further.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "The Strike, Banked and Left", hint: "Kursk's preemptive strike, left as is.", tier: "Minor Victory" },
  { campaign: "SHAEF", label: "Warning Time, Spent Correctly", hint: "The Big Wing question, Park's doctrine.", tier: "Major Victory" },
  { campaign: "SHAEF", label: "The Wing That Formed Too Late", hint: "The Big Wing question, massed formations.", tier: "Minor Defeat" },
  { campaign: "SHAEF", label: "A Deal the Assassin Made Moot", hint: "Darlan's deal, accepted.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "The Principled Cost", hint: "Darlan's deal, refused.", tier: "Minor Defeat" },
  { campaign: "OKW", label: "The Bill History Didn't Write", hint: "A steeper ledger than the record shows.", tier: "Minor Defeat" },
  { campaign: "OKW", label: "The Same War, Differently Accounted", hint: "Close to the record, by a different road.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "The Centre That Broke Twice", hint: "A second blow at Army Group Centre, before it had mended from the first.", tier: "Major Victory" },
  { campaign: "STAVKA", label: "Smolensk, in April", hint: "The city retaken seventeen months early.", tier: "Major Victory" },
  { campaign: "STAVKA", label: "The Pocket at Vyazma", hint: "The winter ring that closed.", tier: "Major Victory" },
  { campaign: "STAVKA", label: "One Blow, Not Ten", hint: "January 1942, concentrated, and still not enough.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "The Salient Nobody Held", hint: "Izyum, given up before it was lost.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "The Armour That Was Kept", hint: "Six corps, saved from a counterattack.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "Victory, Priced About the Same", hint: "The same victory, a different invoice.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "The War, Fought Close to Schedule", hint: "Neither ahead of the record nor behind it.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Debt Called Early", hint: "The clock, paid off ahead of schedule.", tier: "Minor Victory" },
  { campaign: "COMANDO SUPREMO", label: "An Army Spent Twice, on Both Sides of the Line", hint: "A run that paid at nearly every hinge point.", tier: "Major Defeat" },
  { campaign: "COMANDO SUPREMO", label: "The Command That Lost the Least", hint: "A run that came through unusually intact.", tier: "Minor Defeat" },
  { campaign: "COMANDO SUPREMO", label: "The Coup That Didn't Take", hint: "The Grand Council's vote, answered with the army instead of the King, and the army's own loyalty proving thinner than the wager.", tier: "Contested Outcome" },
  { campaign: "COMANDO SUPREMO", label: "The Highland War Rome Didn't Plan For", hint: "Historical Divergence Mode: a slower Commonwealth advance into East Africa gives the highland holdout the one thing it never historically had: time to become a real campaign.", tier: "Minor Victory" },
  { campaign: "COMANDO SUPREMO", label: "A Republic Founded a Month Early", hint: "The loyalist gamble, absorbed into Berlin's client-state arrangement before Salò ever had a name.", tier: "Major Defeat" },
  { campaign: "COMANDO SUPREMO", label: "The Uniform Handed Over, Not Torn Off", hint: "Salò's collapse, negotiated rather than fled.", tier: "Minor Defeat" },
  { campaign: "COMANDO SUPREMO", label: "A Republic Remembered by Marzabotto", hint: "The Republic's final address, after the reprisal years.", tier: "Major Defeat" },
  { campaign: "COMANDO SUPREMO", label: "The Republic's Last Address", hint: "The historical ending: Dongo, and Piazzale Loreto.", tier: "Major Defeat" },
  // "Twenty Months at Salò" and "Two Italies, One File" were both deleted here, Round 19 —
  // positionLabel's own comments (next to the checks that replaced them) trace exactly why each
  // was permanently unreachable rather than merely rare.
  { campaign: "COMANDO SUPREMO", label: "A Corps With Its Own Flag", hint: "The Combat Groups under one Italian headquarters, and the last offensive won.", tier: "Contested Outcome" },
  { campaign: "COMANDO SUPREMO", label: "Eight Groups Where Six Were Offered", hint: "A larger combat army, on a lighter scale, led in the spring.", tier: "Contested Outcome" },
  { campaign: "COMANDO SUPREMO", label: "The Winter Nobody Stood Down", hint: "The partisans kept supplied, against the proclamation.", tier: "Contested Outcome" },
  { campaign: "COMANDO SUPREMO", label: "The Price of Leading", hint: "The last offensive's assault roles, asked for and paid for in full.", tier: "Minor Defeat" },
  { campaign: "COMANDO SUPREMO", label: "A Record Argued For, Not Assumed", hint: "The Co-Belligerent Army's case, pressed at the peace table.", tier: "Minor Defeat" },
  { campaign: "COMANDO SUPREMO", label: "The Line Held on Its Own Front", hint: "The Gothic Line, fully committed to.", tier: "Minor Defeat" },
  { campaign: "COMANDO SUPREMO", label: "The Co-Belligerent's Uncertain Honor", hint: "The historical ending: a junior partner's war, quietly closed.", tier: "Minor Defeat" },
  // Round 19: the extended non-belligerence branch, off nonBelligerence40's "wait" choice.
  { campaign: "COMANDO SUPREMO", label: "The War That Passed Rome By", hint: "Extended non-belligerence, held for the whole war: Berlin let it stand.", tier: "Minor Victory" },
  { campaign: "COMANDO SUPREMO", label: "Occupied Without Ever Having Fought", hint: "Extended non-belligerence, called by Berlin: submitted to rather than resisted.", tier: "Major Defeat" },
  { campaign: "COMANDO SUPREMO", label: "The War Rome Refused, Then Fought Anyway", hint: "Extended non-belligerence, called by Berlin: resisted, against the ally instead of beside it.", tier: "Contested Outcome" },
  { campaign: "COMANDO SUPREMO", label: "Rome Stops Being Consulted", hint: "Axis Mode's own ceiling on independent judgment.", tier: "Major Defeat" },
];

// Ending classification, judged relative to each campaign's own goals — not a universal
// war-outcome scale. OKW's campaign design has no victory branch (see resolveNode's own
// epilogue text), so no OKW ending is ever tagged Major/Minor Victory; its ceiling is
// Contested Outcome. STAVKA and SHAEF endings range across the full scale since both
// campaigns can produce strong or truly costly outcomes relative to their
// own objectives, independent of the war's larger, fixed result.
const TIER_META = {
  "Major Victory": { short: T("Major Victory"), color: "#2f5233" },
  "Minor Victory": { short: T("Minor Victory"), color: "#40694c" },
  "Contested Outcome": { short: T("Contested"), color: "#6b5b1f" },
  "Minor Defeat": { short: T("Minor Defeat"), color: "#8a4a2f" },
  "Major Defeat": { short: T("Major Defeat"), color: "#7a2e2e" },
};

function EndingTierBadge({ tier }) {
  const meta = TIER_META[tier];
  if (!meta) return null;
  return (
    <span
      className="inline-block border px-1.5 py-0.5 text-[9px] uppercase tracking-widest font-bold shrink-0"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        borderColor: meta.color,
        color: meta.color,
      }}
    >
      {t(meta.short)}
    </span>
  );
}

// esbuild replaces the __DEMO_BUILD__ token at build time (see build.mjs `define`).
// The typeof guard means the raw source also runs standalone — pasted into a preview,
// opened directly, etc. — instead of throwing "Can't find variable: __DEMO_BUILD__".
// Terser's constant propagation still strips the dead branch from each built variant,
// so the full build carries no demo-only content and vice versa (verified in build).
const DEMO_BUILD = typeof __DEMO_BUILD__ === "undefined" ? false : __DEMO_BUILD__;
const DEMO_UNLOCKED_CAMPAIGNS = ["german"];
// Round 20c (Craig: "the demo file is just the German campaign on standard difficulty
// only"). Previously hardcoded to `true` regardless of build variant — the "— full version"
// locked-button UI for Führer/NKVD/Yalta/Axis Mode already existed and was fully wired, but
// nothing ever actually flipped this to false for the demo zip, so the shipped demo build
// let a player select Führer Mode in the one campaign it unlocked. Wired to the same
// __DEMO_BUILD__ token every other demo restriction already uses, so a plain `npm run
// build` now produces a correctly-restricted demo without a manual step to remember.
const HARD_MODES_ENABLED = !DEMO_BUILD;
// Same fix applied to Easy Command: unlike hard mode, Easy had no gate at all — any
// unlocked campaign (i.e. German, in the demo) could still play Elefant Command. Craig's
// "standard difficulty only" is read literally: the demo's one campaign gets Standard Issue
// Command and nothing else, not Standard-plus-Easy.
const EASY_MODE_ENABLED = !DEMO_BUILD;

// Background music track path. Silent/harmless until a real file exists at this relative path
// alongside the built HTML — swap this constant if the eventual filename differs.
const MUSIC_TRACK_SRC = THEME_MUSIC_DATA_URL;

// Grand Campaign — prototype, per docs/specs/grand-campaign-mode.md. Chains German → Soviet →
// Allied into one continuous state carry-over (Italy excluded for now, per Craig — its
// "parallel war" arc doesn't share this fixed timeline the way the other three share one with
// each other). Gated by __GRAND_CAMPAIGN__, the same esbuild-`define` pattern as
// __DEMO_BUILD__ above: undefined (and therefore false) in the shipped itch full/demo builds,
// true only in the unlisted "dev" build variant (see build.mjs) that is never zipped or
// distributed. This is deliberately real plumbing, not a mockup — Craig's call, since a fake
// version wouldn't test whether the actual chaining mechanic is any good.
const GRAND_CAMPAIGN_ENABLED = typeof __GRAND_CAMPAIGN__ === "undefined" ? false : __GRAND_CAMPAIGN__;
const GRAND_CAMPAIGN_ORDER = ["german", "soviet", "allied"];

// Key Battle Subgame — prototype, Craig's "Order of Battle" allocation concept (2026-09-18).
// At a small set of pivotal battles, resolving the historical uncertain[] roll is preceded by a
// resource-allocation subgame: the player spends a small pool of "effort" chits across four
// categories (Divisions, Mechanised Armour, Air Support, Positioning & Intelligence), and the
// resulting mix nudges that battle's roll weight up or down — exactly the same mechanism an
// existing Historical Divergence fork uses (see forkPanthersFixed in the kursk node), just
// player-driven instead of a random fork. Deliberately NOT meter-threshold gating — every
// category is always available regardless of standing — because the series' own non-negotiable
// design rule is "decisions drive endings, never meter thresholds alone"; the chit pool's SIZE
// grows with the campaign's Manpower/Fuel/Initiative standing instead (Craig: "extra manpower or
// fuel or initiative should directly help your choices"), and the resulting bonus is clamped to
// +/-30 (see chooseOption) — well past the +/-15 an existing Historical Divergence fork nudges a
// roll by, since this is a whole subgame's worth of commitment, not one flag — so a maxed
// allocation tilts a roll hard without ever making it a certainty. Per-category effectiveness is
// battle-specific (set per choice via keyBattleSubgame.effectiveness), not a flat multiplier, so
// each pivotal battle can favor different levers for reasons the node's own text already
// establishes — see the kursk node's comment for why Positioning is weak there specifically.
// Round 3 (2026-09-19, Craig): raised the clamp and the effectiveness values behind it (roughly
// 1.8x across the board) so a heavy commitment can swing meaningfully further than round 2's cap
// allowed, and added a battle-instance jitter — see BattleAllocationScreen's `jitter` state — so
// the exact effectiveness of each category isn't the same fixed, memorizable number every time a
// player reaches this screen. Craig's own framing: "like an actual battle with the multipliers
// working differently so a player isn't confident on their choices." The UI shows a banded
// qualitative readout ("in good order" / "holding to plan" / "reports uncertain") per category
// instead of the raw number, so the player is reading intelligence, not solving an equation —
// consistent with the concealRoll fog-of-war precedent already established on Kursk's own choice.
// Same __KEY_BATTLE_SUBGAME__ esbuild-define pattern as Grand Campaign: false in every shipped
// itch build, true only in the unlisted dev prototype build (see build.mjs). Real plumbing
// feeding a real roll, not a mockup, for the same reason Grand Campaign is real plumbing — a fake
// version wouldn't test whether the actual mechanic is any good. Piloted on exactly one node
// (kursk) pending Craig's reaction, per the project's own "pilot narrow before generalizing"
// convention.
const KEY_BATTLE_SUBGAME_ENABLED = typeof __KEY_BATTLE_SUBGAME__ === "undefined" ? false : __KEY_BATTLE_SUBGAME__;
// Field is `name`, not `label` — deliberately, so these don't collide with
// check-reachability.js's stale-ENDINGS_GALLERY scan, which regexes every label field (as a
// quoted string following a colon) between `const ENDINGS_GALLERY` and `const NODE_TOTAL` (this
// array sits in that span) and treats each match as a claimed ending title.
// Round 2 (2026-09-19, Craig): dropped Positioning & Intelligence — it duplicated the
// concealRoll mechanic already live on Kursk's own choice (the situation text already tells the
// player their planning is compromised; a chit category for "outmaneuver them" restated the same
// idea a second way instead of adding one) — and replaced it with Supply, the more universally
// real lever Craig asked about directly ("what other factors drive the outcome, supplies etc?").
// Craig's other two calls this round: build out future battles one per archetype (land/naval/
// amphibious/strategic-air) rather than generalizing the land-battle set across every remaining
// battle — this array and its `keyBattleSubgame.effectiveness` pattern stay archetype-specific,
// not assumed universal — and try the per-category expansion panel (see
// BattleAllocationScreen's <details> blocks) showing what the historical order of battle
// actually looked like, sourced the same way every other claim in this game is.
