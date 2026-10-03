const ARBITRARY_CSS = `
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
    { id: "norway40", date: "APRIL 1940", title: "Weserübung — The Norway Gamble" },
    { id: "caseYellow40", date: "MAY 1940", title: "The Manstein Plan" },
    { id: "dunkirk", date: "MAY 1940", title: "The Halt at Dunkirk" },
    { id: "channel", date: "AUGUST 1940", title: "The Channel Question" },
    { id: "balkans", date: "APRIL 1941", title: "The Balkans Problem" },
    { id: "hessFlight41", date: "MAY 10, 1941", title: "The Hess Flight" },
    { id: "crete41", date: "MAY 1941", title: "Mercury — The Airborne Gamble" },
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
    { id: "kursk", date: "1943", title: "Kursk — Strike Early or Wait" },
    { id: "kurskBreach43", date: "MAY 1943", title: "The Breach" },
    { id: "kurskAftermath43", date: "JUNE 1943", title: "A Rare Eastern Confidence" },
    { id: "expandedOffensive43", date: "JULY 1943", title: "How Far a Good Week Reaches" },
    { id: "twoFires1943", date: "SEPTEMBER 1943", title: "Two Fires at Once" },
    { id: "italyPartisans", date: "LATE 1943", title: "The Cost of a Secured Italy" },
    { id: "dnieperStabilized", date: "LATE 1943", title: "Holding the Dnieper" },
    { id: "firmestLine43", date: "WINTER 1943–44", title: "What a Firm Line Is For" },
    { id: "normandy", date: "JUNE 1944", title: "Normandy" },
    { id: "normandyCounterattack44", date: "JUNE 6, 1944", title: "The Counterattack That Almost Wasn't" },
    { id: "normandyConsolidation44", date: "JUNE 1944 — WEEK ONE", title: "The Week the Beachhead Wins" },
    { id: "bagration44", date: "JUNE 1944", title: "Where Will the Soviet Blow Fall" },
    { id: "eastStand44", date: "AUGUST 1944", title: "The Fighting Retreat" },
    { id: "collapse1944", date: "SUMMER – AUTUMN 1944", title: "The Front Comes Apart" },
    { id: "centerArmyPreserved44", date: "JULY 1944", title: "What the Preserved Army Is For" },
    { id: "july20Plot44", date: "JULY 20, 1944", title: "The Blast at the Wolf's Lair" },
    { id: "july20PlotFails44", date: "JULY 1944", title: "The Plot Against Hitler" },
    { id: "hitlerDead44", date: "JULY 20, 1944 — THE FOLLOWING HOURS", title: "Valkyrie, Actually Live" },
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
  ],
  soviet: [
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
  ],
  allied: [
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
    { id: "casablanca43", date: "JANUARY 1943", title: "Casablanca — Unconditional Surrender" },
    { id: "resistanceContact44", date: "1944", title: "The Door, Tested" },
    { id: "sicilyHusky43", date: "JULY – AUGUST 1943", title: "Sicily and the Messina Escape" },
    { id: "tehran43", date: "NOVEMBER – DECEMBER 1943", title: "Tehran — The Three Meet" },
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
    { id: "bomberDirective43", date: "1943", title: "Pointblank — What the Bombers Are For" },
    { id: "dodecanese43", date: "SEPTEMBER – NOVEMBER 1943", title: "The Aegean Temptation" },
    { id: "aegeanReckoning43", date: "DECEMBER 1943", title: "What Washington Does With Being Right" },
    { id: "turkishQuestion44", date: "LATE 1943", title: "The Turkish Question" },
    { id: "anzio44", date: "JANUARY 1944", title: "Shingle — The End Run" },
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
    { id: "omahaCrisis44", date: "JUNE 6, 1944 — MORNING", title: "Omaha" },
    { id: "omahaIsolated44", date: "JUNE 6, 1944 — LATE AFTERNOON", title: "The Beach That Didn't Link Up" },
    { id: "omahaToehold44", date: "JUNE 11, 1944", title: "The Toehold" },
    { id: "omahaBreakthroughLate44", date: "JUNE 9, 1944", title: "The Beach Widens" },
    { id: "gothicLineEarly44", date: "SPRING 1944", title: "The Gothic Line, Tested Early" },
    { id: "turkishBelligerence44", date: "EARLY 1944", title: "What a Symbolic Declaration Is Actually Worth" },
    { id: "westernCollapse45", date: "MARCH 1945", title: "The Surrender That Came Early" },
  ],
  italy: [
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
};


const CONTEXT_NOTES = {
  german: [
    { term: "The Fall of France, 1940", note: "The Manstein Plan sent panzers through the supposedly impassable Ardennes, splitting the Allied armies in six weeks — a victory so total it briefly convinced Hitler the war was effectively won, and shaped every overconfident decision that followed." },
    { term: "Dunkirk", note: "Hitler's halt order let some 338,000 British and French troops evacuate rather than be captured — one of the war's most argued-over decisions, since that intact army was what Britain had left to fight on with." },
    { term: "Operation Barbarossa, 1941", note: "The invasion of the USSR — the largest military operation in history, on a front over 1,800 miles wide. It opened five weeks later than originally planned, a delay some historians tie to the Balkans campaign and argue cost Germany the dry season it needed to take Moscow before winter." },
    { term: "Stalingrad", note: "A city on the Volga that mattered as much for its name as its position — Hitler and Stalin each treated its fate as a personal test of will. Its loss, with an entire German army encircled and destroyed, was the war's clearest turning point in the east." },
    { term: "Kursk, 1943", note: "The last major German strategic offensive in the east, and history's largest tank battle. Soviet intelligence knew the attack was coming and prepared defenses in depth; after Kursk failed, Germany never again held the initiative on the eastern front." },
    { term: "The July 20 Plot, 1944", note: "Stauffenberg's bomb failed to kill Hitler by a matter of feet and a heavy table leg. The reprisals that followed reached deep into the same officer corps this campaign puts you in command of." },
  ],
  soviet: [
    { term: "The Border Collapse, June 1941", note: "Barbarossa caught the Red Army in the middle of a reorganization, with Stalin having ignored repeated intelligence warnings. Entire armies were encircled in the war's first weeks — a catastrophe the Soviet state came startlingly close to not surviving." },
    { term: "Moscow, October–December 1941", note: "The government itself considered evacuating as German spearheads closed on the capital. That Stalin publicly stayed, and that the city held through the winter, is credited with breaking a panic that briefly threatened to unravel the whole Soviet war effort." },
    { term: "Stalingrad, 1942–43", note: "Named for Stalin himself, which is precisely why neither side could afford to lose it as a matter of prestige as much as strategy. Chuikov's defense inside the ruins, followed by the encirclement of an entire German army, made it the war's decisive turning point." },
    { term: "Kursk, 1943", note: "Soviet foreknowledge of the German plan — built through both intelligence and Hitler's own repeated delays — let Stavka prepare the deepest defensive belts of the war before the largest tank battle in history began." },
    { term: "Operation Bagration, 1944", note: "Timed to the anniversary of Barbarossa, this offensive destroyed an entire German army group — arguably the single largest defeat the German army suffered in the whole war — while Western attention stayed fixed on Normandy." },
    { term: "The Race for Berlin, 1945", note: "Stalin deliberately left the boundary between Zhukov's and Konev's fronts ambiguous, turning the war's final battle into a competitive double envelopment between two rival marshals." },
  ],
  allied: [
    { term: "Dunkirk", note: "Framed at the time as a deliverance rather than a defeat — Churchill himself warned Parliament not to call it a victory, even as the evacuation of an entire army became the story Britain needed to keep fighting." },
    { term: "Pearl Harbor, December 1941", note: "Brought the United States into a war it had been supplying but not fighting. Hitler's decision to declare war on the US days later, honoring the Axis pact with no obligation to, remains one of the war's more consequential unforced errors." },
    { term: "El Alamein, 1942", note: "Churchill's own verdict on the battle — \"not the end, nor the beginning of the end, but perhaps the end of the beginning\" — marked the first unambiguous British victory of the war and the turn against Rommel in North Africa." },
    { term: "Normandy, June 1944", note: "The long-delayed second front Stalin had demanded since 1941. Its timing depended on landing craft, weather, and deception operations convincing German intelligence the real target was Calais." },
    { term: "Market Garden, September 1944", note: "A single-road gamble to seize a Rhine bridgehead and end the war by Christmas — undone partly by fresh German armor refitting, by chance, almost on top of the furthest drop zone." },
    { term: "Yalta, February 1945", note: "The conference that shaped the postwar map more than any battle still to come — Poland's fate, occupation zones, and the working relationship between the Big Three were all set here, weeks before Roosevelt's death." },
  ],
  italy: [
    { term: "The Taranto Raid, November 1940", note: "Twenty-one aging biplanes crippled half of Italy's battle fleet at anchor in a single night — a demonstration of carrier air power against a battle line in harbor that Japanese naval planners studied closely before Pearl Harbor." },
    { term: "Operation Compass, December 1940", note: "A British force roughly a third the size of the Italian Tenth Army it faced destroyed that army as a fighting force within two months, taking some 130,000 prisoners — the disaster that brought Rommel to North Africa." },
    { term: "The Fall of the Grand Council, July 1943", note: "Mussolini's own regime voted him out, 19 to 7, after three years of losing war — and it was the King's independent authority to dismiss and arrest him the next day, not the Council's vote itself, that actually ended his government." },
    { term: "The Armistice, September 1943", note: "Announced before Rome's own military had coherent orders for what came next — the army disintegrated in the chaos, some 600,000 soldiers were deported to Germany as forced labor, and Italy split into two rival governments within weeks." },
    { term: "Monte Cassino, 1944", note: "Four Allied offensives — American, British and Commonwealth, Polish among them — were needed to break a single defensive position anchored on a medieval abbey, at a combined cost of over 50,000 Allied casualties." },
    { term: "The Death of Mussolini, April 1945", note: "Captured by Communist partisans fleeing toward Switzerland, shot without trial, and displayed hanging in a Milan piazza — on the same square where Fascist authorities had displayed partisan bodies the previous summer." },
  ],
};

const ENDINGS_GALLERY = [
  { campaign: "OKW", label: "Flensburg — Signed Twice", hint: "The historical ending.", tier: "Major Defeat" },
  { campaign: "OKW", label: "Reims, Once, in Full", hint: "One signature, no second ceremony.", tier: "Major Defeat" },
  { campaign: "OKW", label: "The Redoubt That Wasn't", hint: "A myth, followed into the mountains.", tier: "Major Defeat" },
  { campaign: "OKW", label: "The Myth Stood Down", hint: "The mountains, declined.", tier: "Minor Defeat" },
  { campaign: "OKW", label: "The Untouched Army", hint: "A fortress that outlasted its war.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Fortress That Conceded", hint: "Norway, surrendered whole.", tier: "Minor Defeat" },
  { campaign: "OKW", label: "The war that never went east", hint: "Barbarossa, cancelled.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Western Armistice — Speculative", hint: "Beyond the evidence, westward.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Volga Line — Speculative", hint: "Beyond the evidence, eastward.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Bomb, The Table Leg, The Coin — Speculative", hint: "The narrowest possible margin, run the other way.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Command That Set the Terms", hint: "A war fought on OKW's tempo throughout.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "Answering, Never Asking", hint: "Every order a response to someone else's.", tier: "Major Defeat" },
  { campaign: "OKW", label: "The Channel That Was Real", hint: "Stockholm, and the minority reading turning out true.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "A Conversation Moscow Wanted Overheard", hint: "Terms explored, and found to be leverage.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "Italy, Sold Cheaply and On Purpose", hint: "Rommel's line, taken over Kesselring's.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Mission That Was Not Flown", hint: "One aircraft, one day, and a defense that could not be planned against.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Interception Nobody Could Plan", hint: "The jets, held back for a single approach.", tier: "Major Defeat" },
  { campaign: "OKW", label: "A Country Taken Apart to Last Longer", hint: "The only answer to the weapon the physics doesn't refute.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "An army that barely resembles the historical one", hint: "Four years of arithmetic, kept.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Winter That Wasn't Supposed to Happen", hint: "Historical Divergence Mode: Moscow falls not through history's narrow window but a wider one — the reinforcements that saved it historically arrived thinner this time.", tier: "Major Victory" },
  { campaign: "OKW", label: "Citadel, Fought With Tanks That Didn't Burn", hint: "Historical Divergence Mode: the early Panther's engine-fire problem is chased down and fixed before Kursk rather than during it, and the spring strike breaches the unfinished defenses it was always supposed to catch.", tier: "Minor Victory" },
  { campaign: "OKW", label: "The Overextension That Didn't Bite", hint: "Historical Divergence Mode: a thinner-than-expected Soviet reserve lets Case Blue hold both the Stalingrad and Caucasus axes at once, longer than the historical overextension ever allowed.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "Recalled to Moscow", hint: "What NKVD Mode was watching for.", tier: "Minor Defeat" },
  { campaign: "STAVKA", label: "The Capital That Evacuated Anyway", hint: "Historical Divergence Mode: without the historical Kiev diversion slowing the German advance, October's panic reaches all the way to the government itself.", tier: "Major Defeat" },
  { campaign: "STAVKA", label: "The Weakness Nobody Exploited", hint: "Historical Divergence Mode: Model's Rzhev garrison runs thinner than the winter pattern, and Operation Mars is launched — and fails at its full historical cost anyway, the gap never noticed in time to change the plan.", tier: "Minor Defeat" },
  { campaign: "STAVKA", label: "The Warning That Went Nowhere", hint: "Historical Divergence Mode: German reconnaissance flags the real concentration areas before Bagration launches, and Army Group Center is destroyed on schedule regardless — whoever read the reports in Berlin, they changed nothing.", tier: "Major Victory" },
  { campaign: "STAVKA", label: "Berlin, Taken Early — At Stalingrad's Price", hint: "February, and paid for the fast way.", tier: "Major Victory" },
  { campaign: "STAVKA", label: "The City That Surrendered to the Ring", hint: "Three days, and no street contested.", tier: "Major Victory" },
  { campaign: "STAVKA", label: "The Heights That Held an Empty Front", hint: "Seelow, declined.", tier: "Major Victory" },
  { campaign: "STAVKA", label: "The Salient Never Offered", hint: "Kharkov, gone around rather than through.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "The City Saved by a Fortnight in June", hint: "Warsaw, reached — by a decision taken two months earlier.", tier: "Major Victory" },
  { campaign: "STAVKA", label: "The Halt That Needed No Excuse", hint: "The one version of that order logistics cannot account for.", tier: "Contested Outcome" },
  { campaign: "STAVKA", label: "The Offensive That Stopped Where It Was Told", hint: "Bagration, supplied before it launched.", tier: "Minor Victory" },
  { campaign: "STAVKA", label: "The Army That Should Not Have Survived This", hint: "The ledger history never got to write this way.", tier: "Major Victory" },
  { campaign: "SHAEF", label: "March 1945 — And Still Signed Together", hint: "Casablanca, tested where bending it was worth something.", tier: "Major Victory" },
  { campaign: "SHAEF", label: "The War Ended Early, The Peace Started Colder", hint: "The fastest end available, and its bill.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "The Port That Stopped Being the Constraint", hint: "One port, put above every offensive.", tier: "Minor Victory" },
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
  { campaign: "STAVKA", label: "Victory, Priced About the Same", hint: "The same victory, a different invoice.", tier: "Contested Outcome" },
  { campaign: "SHAEF", label: "The War, Fought Close to Schedule", hint: "Neither ahead of the record nor behind it.", tier: "Contested Outcome" },
  { campaign: "OKW", label: "The Debt Called Early", hint: "The clock, paid off ahead of schedule.", tier: "Minor Victory" },
  { campaign: "COMANDO SUPREMO", label: "An Army Spent Twice, on Both Sides of the Line", hint: "A run that paid at nearly every hinge point.", tier: "Major Defeat" },
  { campaign: "COMANDO SUPREMO", label: "The Command That Lost the Least", hint: "A run that came through unusually intact.", tier: "Minor Defeat" },
  { campaign: "COMANDO SUPREMO", label: "The Coup That Didn't Take", hint: "The Grand Council's vote, answered with the army instead of the King — and the army's own loyalty proving thinner than the wager.", tier: "Contested Outcome" },
  { campaign: "COMANDO SUPREMO", label: "The Highland War Rome Didn't Plan For", hint: "Historical Divergence Mode: a slower Commonwealth advance into East Africa gives the highland holdout the one thing it never historically had — time to become a real campaign.", tier: "Minor Victory" },
  { campaign: "COMANDO SUPREMO", label: "A Republic Founded a Month Early", hint: "The loyalist gamble, absorbed into Berlin's client-state arrangement before Salò ever had a name.", tier: "Major Defeat" },
  { campaign: "COMANDO SUPREMO", label: "The Uniform Handed Over, Not Torn Off", hint: "Salò's collapse, negotiated rather than fled.", tier: "Minor Defeat" },
  { campaign: "COMANDO SUPREMO", label: "A Republic Remembered by Marzabotto", hint: "The Republic's final address, after the reprisal years.", tier: "Major Defeat" },
  { campaign: "COMANDO SUPREMO", label: "The Republic's Last Address", hint: "The historical ending — Dongo, and Piazzale Loreto.", tier: "Major Defeat" },
  // "Twenty Months at Salò" and "Two Italies, One File" were both deleted here, Round 19 —
  // positionLabel's own comments (next to the checks that replaced them) trace exactly why each
  // was permanently unreachable rather than merely rare.
  { campaign: "COMANDO SUPREMO", label: "A Record Argued For, Not Assumed", hint: "The Co-Belligerent Army's case, pressed at the peace table.", tier: "Minor Defeat" },
  { campaign: "COMANDO SUPREMO", label: "The Line Held on Its Own Front", hint: "The Gothic Line, fully committed to.", tier: "Minor Defeat" },
  { campaign: "COMANDO SUPREMO", label: "The Co-Belligerent's Uncertain Honor", hint: "The historical ending — a junior partner's war, quietly closed.", tier: "Minor Defeat" },
  // Round 19: the extended non-belligerence branch, off nonBelligerence40's "wait" choice.
  { campaign: "COMANDO SUPREMO", label: "The War That Passed Rome By", hint: "Extended non-belligerence, held for the whole war — Berlin let it stand.", tier: "Minor Victory" },
  { campaign: "COMANDO SUPREMO", label: "Occupied Without Ever Having Fought", hint: "Extended non-belligerence, called by Berlin — submitted to rather than resisted.", tier: "Major Defeat" },
  { campaign: "COMANDO SUPREMO", label: "The War Rome Refused, Then Fought Anyway", hint: "Extended non-belligerence, called by Berlin — resisted, against the ally instead of beside it.", tier: "Contested Outcome" },
  { campaign: "COMANDO SUPREMO", label: "Rome Stops Being Consulted", hint: "Axis Mode's own ceiling on independent judgment.", tier: "Major Defeat" },
];

// Ending classification, judged relative to each campaign's own goals — not a universal
// war-outcome scale. OKW's campaign design has no victory branch (see resolveNode's own
// epilogue text), so no OKW ending is ever tagged Major/Minor Victory; its ceiling is
// Contested Outcome. STAVKA and SHAEF endings range across the full scale since both
// campaigns can produce strong or truly costly outcomes relative to their
// own objectives, independent of the war's larger, fixed result.
const TIER_META = {
  "Major Victory": { short: "Major Victory", color: "#2f5233" },
  "Minor Victory": { short: "Minor Victory", color: "#4a7856" },
  "Contested Outcome": { short: "Contested", color: "#6b5b1f" },
  "Minor Defeat": { short: "Minor Defeat", color: "#8a4a2f" },
  "Major Defeat": { short: "Major Defeat", color: "#7a2e2e" },
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
      {meta.short}
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
