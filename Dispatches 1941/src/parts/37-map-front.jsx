const PAC_VBW = 960;
const PAC_VBH = 650;
/** [longitude, latitude] to the map's sheet (the projection PacificMap draws its coastlines with). Longitudes east of the date line are written above 180, so Pearl Harbor is 202.03. */
const pacificXY = (lo, la) => [40 + (lo - 79) * 7.15, 30 + (53 - la) * 7.19];

// The front through time, the place of each report, and the orders drawn on the map (ported from Dispatches 1940's report map).
//
// MAP_FRONT_SERIES: for each land theatre, the front as a list of entries; an entry holds from the day it begins until the next one (null lines end the theatre).
// A line is a list of [longitude, latitude] points, drawn from the course of the fighting and not surveyed: the map says so. A front is drawn on a day only if the
// regions it runs through (`watch`) stand as the record had them, or are still being fought over: a run that has departed from the record there gets the record's
// line drawn dashed in red, and none at all if no fighting is left. tools/check-map-front.mjs checks the data.
//
// MAP_PLACES: where each report is set, by command and report, as [longitude, latitude, name]. The map marks the report's place and the last few places before it.
// MAP_OFF_MAP: the reports set beyond the sheet, with the name of the place; the map draws an arrow at the edge.
// MAP_OPS: the orders of some reports, drawn on the map when the player picks one from the list under it.

const MAP_FRONT_SERIES = [
  {
    id: "china",
    watch: ["hunanGuangxi", "eastChina", "northChina"],
    entries: [
      { from: "1940-01-01", lines: [[[111.0, 40.6], [111.2, 38.0], [110.4, 35.0], [112.4, 34.6], [114.0, 33.5], [115.0, 31.8], [114.2, 30.6], [113.1, 29.4], [115.8, 28.7], [117.5, 28.4], [119.5, 28.0]], [[113.0, 23.4], [114.4, 23.2]]] },
      { from: "1944-04-17", lines: [[[111.0, 40.6], [111.2, 38.0], [110.4, 35.0], [111.6, 34.5], [113.7, 34.5], [114.0, 33.5], [115.0, 31.8], [114.2, 30.6], [113.1, 29.4], [115.8, 28.7], [117.5, 28.4], [119.5, 28.0]], [[113.0, 23.4], [114.4, 23.2]]] },
      { from: "1944-06-20", lines: [[[111.0, 40.6], [111.2, 38.0], [110.4, 35.0], [111.6, 34.5], [113.7, 34.5], [114.0, 33.5], [115.0, 31.8], [113.4, 30.0], [112.9, 28.2], [114.0, 27.0], [115.8, 28.7], [117.5, 28.4], [119.5, 28.0]], [[113.0, 23.4], [114.4, 23.2]]] },
      { from: "1944-08-10", lines: [[[111.0, 40.6], [111.2, 38.0], [110.4, 35.0], [111.6, 34.5], [113.7, 34.5], [114.0, 33.5], [115.0, 31.8], [113.4, 30.0], [112.6, 26.9], [113.6, 25.1], [115.8, 28.7], [117.5, 28.4], [119.5, 28.0]], [[113.0, 23.4], [114.4, 23.2]]] },
      { from: "1944-12-10", lines: [[[111.0, 40.6], [111.2, 38.0], [110.4, 35.0], [111.6, 34.5], [113.7, 34.5], [114.0, 33.5], [115.0, 31.8], [113.4, 30.0], [112.6, 26.9], [111.3, 25.3], [109.4, 24.3], [108.3, 22.8], [106.0, 21.5]]] },
      { from: "1945-05-26", lines: [[[111.0, 40.6], [111.2, 38.0], [110.4, 35.0], [111.6, 34.5], [113.7, 34.5], [114.0, 33.5], [115.0, 31.8], [113.4, 30.0], [112.6, 26.9], [113.6, 25.1], [115.8, 28.7], [117.5, 28.4], [119.5, 28.0]]] },
      { from: "1945-08-15", lines: null },
    ],
  },
  {
    id: "burma",
    watch: ["burma"],
    entries: [
      { from: "1942-01-20", lines: [[[98.6, 18.4], [97.6, 16.5], [98.2, 14.0]]] },
      { from: "1942-03-08", lines: [[[96.4, 18.9], [96.1, 16.8], [95.0, 17.3]]] },
      { from: "1942-05-20", lines: [[[96.3, 27.3], [94.8, 26.0], [94.4, 24.2], [93.8, 21.9], [92.9, 20.2]]] },
      { from: "1944-03-08", lines: [[[96.3, 27.3], [94.6, 25.4], [93.9, 24.8], [93.8, 23.4], [93.2, 21.5], [92.9, 20.2]]] },
      { from: "1944-07-05", lines: [[[97.4, 25.4], [95.5, 24.6], [94.5, 23.5], [94.3, 22.0], [93.5, 20.8], [92.9, 20.2]]] },
      { from: "1945-03-03", lines: [[[98.0, 24.0], [96.2, 22.0], [95.9, 20.9], [94.7, 19.9], [94.5, 18.5], [95.0, 17.3]]] },
      { from: "1945-05-03", lines: null },
    ],
  },
  {
    id: "newGuinea",
    watch: ["newGuinea"],
    entries: [
      { from: "1942-07-21", lines: [[[148.4, -8.65], [147.73, -8.88]]] },
      { from: "1942-09-17", lines: [[[148.4, -8.65], [147.55, -9.15]]] },
      { from: "1943-01-22", lines: [[[148.3, -8.7], [147.0, -7.0], [146.4, -6.0]]] },
      { from: "1943-09-16", lines: [[[147.85, -6.6], [146.8, -6.7], [145.8, -5.2]]] },
      { from: "1944-04-22", lines: [[[145.8, -5.2], [143.6, -3.6]]] },
      { from: "1945-01-01", lines: null },
    ],
  },
];

// ---- where each report is set ----
const MAP_PLACES = {
  japan: {
    nomonhan39: [119.0, 47.7, "Nomonhan"], chinaPeaceQuestion40: [118.8, 32.05, "Nanking"], indochinaMission40: [105.85, 21.03, "Hanoi"], burmaRoad40: [102.7, 25.04, "Kunming"],
    tripartitePact40: [139.7, 35.7, "Tokyo"], neutralityPact41: [37.6, 55.75, "Moscow"], unificationQuestion40: [139.7, 35.7, "Tokyo"], hokushinDebate41: [139.7, 35.7, "Tokyo"], kantokuenOffensive41: [125.3, 43.9, "Hsinking"],
    siberianReckoning42: [131.9, 43.1, "Vladivostok"], indochinaOccupation41: [106.7, 10.8, "Saigon"], novemberUltimatum41: [139.7, 35.7, "Tokyo"], pearlHarbor41: [202.03, 21.35, "Pearl Harbor"],
    burmaRangoon42: [96.15, 16.8, "Rangoon"], indianOceanRaid42: [79.85, 6.93, "Colombo"], burmaRangoon42Delayed: [96.15, 16.8, "Rangoon"], bataanPOWQuestion42: [120.45, 14.45, "Bataan"],
    doolittleRaid42: [139.7, 35.7, "Tokyo"], doolittleAirmen42: [121.5, 31.2, "Shanghai"], coralSea42: [147.15, -9.45, "Port Moresby"], midway42: [182.63, 28.2, "Midway"],
    yamamotoAscendant42: [202.03, 21.35, "Pearl Harbor"], aPacificWonTwice43: [79.85, 6.93, "Colombo"], earlyPeaceQuestion42: [139.7, 35.7, "Tokyo"], aStrongerHandToPlay42: [139.7, 35.7, "Tokyo"],
    aPeaceNooneExpected42: [139.7, 35.7, "Tokyo"], earlyPeaceChannel42: [139.7, 35.7, "Tokyo"], earlyPeaceOutcome42: [139.7, 35.7, "Tokyo"], kokodaTrail42: [147.73, -8.88, "Kokoda"],
    guadalcanal42: [160.0, -9.43, "Henderson Field"], keGoWithdrawal43: [159.8, -9.2, "Cape Esperance"], yamamotoDeath43: [155.7, -6.8, "Buin"], attu43: [172.9, 52.9, "Attu"],
    theMainlandCrisis44: [112.6, 26.9, "Hengyang"], ichiGoTriumph44: [110.3, 25.3, "Guilin"], philippineSea44: [145.75, 15.2, "Saipan"], onishiKamikaze44: [120.55, 15.2, "Clark Field"],
    leyteGulf44: [125.2, 11.0, "Leyte Gulf"], kuritaAtLeyte44: [126.0, 11.5, "Samar"], leyteBeachheadAftermath44: [124.9, 11.2, "Leyte"], iwoJima45: [141.3, 24.78, "Iwo Jima"],
    okinawa45: [127.9, 26.3, "Okinawa"], theSubmarineCarriersQuestion45: [139.8, 10.0, "Ulithi"], ketsuGo45: [139.7, 35.7, "Tokyo"], afterHiroshima45: [132.45, 34.4, "Hiroshima"],
    afterNagasaki45: [129.87, 32.75, "Nagasaki"], sacredDecision45: [139.7, 35.7, "Tokyo"], ketsuGoFinalStand45: [139.7, 35.7, "Tokyo"], theDeadlockHolds45: [139.7, 35.7, "Tokyo"],
    termsWorthHaving45: [139.7, 35.7, "Tokyo"], unhinderedSouth42: [106.8, -6.2, "Batavia"], australiaLanding42: [130.85, -12.46, "Darwin"], washingtonDecides42: [283.0, 38.9, "Washington"],
    perimeterDoctrine42: [152.2, -4.2, "Rabaul"], severSupplyLine42: [166.45, -22.27, "Noumea"], operationFsCulmination42: [178.4, -18.1, "Suva"], earlyPerimeter43: [155.2, -6.2, "Bougainville"],
    theLongWarFooting45: [139.7, 35.7, "Tokyo"], moscowMediates45: [37.6, 55.75, "Moscow"], surrenderInquiry45: [139.7, 35.7, "Tokyo"], twoFrontStrain44: [103.85, 1.3, "Singapore"],
    theDelayedStrike44: [202.03, 21.35, "Pearl Harbor"], theUnbloodiedFleets45: [145.75, 15.2, "Saipan"], theUndemolishedFields44: [104.75, -2.98, "Palembang"], theFuelLedger44: [139.7, 35.7, "Tokyo"],
    aSecondArmisticeQuestion44: [139.7, 35.7, "Tokyo"], theBelatedReckoning45: [139.7, 35.7, "Tokyo"], kantokuenFinalWord46: [139.7, 35.7, "Tokyo"], americaDecides44: [283.0, 38.9, "Washington"],
    aQuietEmpire45: [139.7, 35.7, "Tokyo"], newWorldOrder45: [139.7, 35.7, "Tokyo"], coldWarOpening48: [139.7, 35.7, "Tokyo"], theRommelQuestion43: [13.4, 52.5, "Berlin"],
  },
  alliedPacific: {
    fleetAtHawaii40: [202.03, 21.35, "Pearl Harbor"], richardsonObjection40: [202.03, 21.35, "Pearl Harbor"], atlanticTransfer41: [202.03, 21.35, "Pearl Harbor"], americanEmbargoResponse41: [283.0, 38.9, "Washington"],
    chinaAirForce41: [102.7, 25.04, "Kunming"], aStandoffInsteadOfAWar41: [283.0, 38.9, "Washington"], theSlowerDeclaration42: [283.0, 38.9, "Washington"], warBeginsLate42: [283.0, 38.9, "Washington"],
    theUnopposedConsolidation42: [103.85, 1.3, "Singapore"], twoForcesNeitherTested43: [160.0, -9.43, "Guadalcanal"], chinasWarAlone43: [106.55, 29.56, "Chungking"], britainsCalculus43: [-0.13, 51.5, "London"],
    japanUnopposed43: [103.85, 1.3, "Singapore"], chinaCivilWarShadow43: [109.5, 36.6, "Yan'an"], dutchExileCalculus44: [106.8, -6.2, "Batavia"], warWithoutAmerica45: [125.3, 43.9, "Hsinking"],
    wakeIslandRelief41: [166.63, 19.3, "Wake"], arcadia41: [283.0, 38.9, "Washington"], internmentQuestion42: [283.0, 38.9, "Washington"], stilwellInChungking42: [106.55, 29.56, "Chungking"],
    rangoonRetreatAllied42: [96.15, 16.8, "Rangoon"], curtinsTurn42: [149.1, -35.3, "Canberra"], corregidorEvacuation42: [120.58, 14.38, "Corregidor"], doolittleRaidAllied42: [153.0, 35.0, "The launch point"],
    carrierRequest42: [-0.13, 51.5, "London"], coralSeaMidwayAllied42: [182.63, 28.2, "Midway"], kokodaTrailAllied42: [147.73, -8.88, "Kokoda"], guadalcanalAllied42: [160.0, -9.43, "Lunga"],
    savoIslandReckoning42: [159.8, -9.15, "Savo Island"], vladivostokRoute42: [131.9, 43.1, "Vladivostok"], unconditionalSurrender43: [-7.6, 33.6, "Casablanca"], torpedoCrisis43: [202.03, 21.35, "Pearl Harbor"],
    theBatBombQuestion43: [283.0, 38.9, "Washington"], bismarckSea43: [148.0, -7.3, "The Bismarck Sea"], yamamotoIntercept43: [160.0, -9.43, "Henderson Field"], yamamotoSurvives43: [151.8, 7.4, "Truk"],
    tehransPromise43: [51.4, 35.7, "Tehran"], centralPacificDrive43: [173.0, 1.43, "Tarawa"], theTarawaQuestion43: [173.0, 1.43, "Tarawa"], macArthurTension44: [153.0, -27.5, "Brisbane"],
    macArthurAftermath44: [140.7, -2.55, "Hollandia"], philippineSeaAllied44: [145.75, 15.2, "Saipan"], chinaCrisisAllied44: [106.55, 29.56, "Chungking"], stilwellUltimatum44: [106.55, 29.56, "Chungking"],
    stilwellPreserved44: [106.55, 29.56, "Chungking"], peleliuDecision44: [134.25, 7.0, "Peleliu"], peleliuForcesRedirected44: [134.25, 7.0, "Peleliu"], aDifferentPacific45: [202.03, 21.35, "Pearl Harbor"],
    aDifferentPacificFinalWord45: [283.0, 38.9, "Washington"], portChicago44: [238.0, 38.05, "Port Chicago"], philippinesFormosaAllied44: [202.03, 21.35, "Pearl Harbor"], quezonsSuccessor44: [125.0, 11.25, "Tacloban"],
    halseyTyphoon44: [127.0, 14.0, "The Philippine Sea"], halseyAftermath44: [139.8, 10.0, "Ulithi"], burmaReconquest45: [97.4, 25.38, "Myitkyina"], cabanatuanRaid45: [121.05, 15.5, "Cabanatuan"],
    iwoJimaAllied45: [141.3, 24.78, "Iwo Jima"], okinawaAllied45: [127.9, 26.3, "Okinawa"], strategicBombingAllied45Delayed: [139.7, 35.7, "Tokyo"], atomicDemonstration45: [283.0, 38.9, "Washington"],
    targetSelection45: [145.63, 15.0, "Tinian"], kyotoTargetDebate45: [135.77, 35.01, "Kyoto"], kyotoStruck45: [135.77, 35.01, "Kyoto"], hiroshima45: [132.45, 34.4, "Hiroshima"],
    nagasaki45: [129.87, 32.75, "Nagasaki"], nagasakiDelayed45: [129.87, 32.75, "Nagasaki"], radiationDisclosure45: [132.45, 34.4, "Hiroshima"], indianapolisSinking45: [133.5, 12.0, "The Philippine Sea"],
    indianapolisReview45: [283.0, 38.9, "Washington"], downfallOrBlockade45: [130.55, 31.6, "Kyushu"], gasWarfareQuestion45: [283.0, 38.9, "Washington"], combinedPressureCollapse45: [139.7, 35.7, "Tokyo"],
    sovietHokkaido45: [141.67, 45.4, "Wakkanai"], theEmperorQuestion45: [139.7, 35.7, "Tokyo"], occupationAuthority45: [139.7, 35.7, "Tokyo"], pacificFirstGamble42: [283.0, 38.9, "Washington"],
    conservativePacific42: [202.03, 21.35, "Pearl Harbor"], japanStrikesAgain42: [166.45, -22.27, "Noumea"],
  },
};

const mapArrow = (kind, from, to) => ({ kind, from, to });
const mapStand = (at) => ({ kind: "hold", at });

// ---- the orders on the map ----
// For a report, each order that can be given is drawn when the player picks it from the list under the map: a solid arrow for an attack, a dashed one for a move,
// a dotted one for a withdrawal, a ring for a stand. The drawing is schematic: it shows where the weight goes, not a line of advance. An order is found by the
// start of its label (`match`), so a report whose orders change with the file still finds the ones it has. tools/check-map-front.mjs checks every entry.
const MAP_OPS = {
  japan: {
    hokushinDebate41: [
      { match: "Hold to the Southern Operation: the resources", note: "The weight stays on the south: the army gathers in Indochina for Malaya and the Indies.", arrows: [mapStand([106.7, 10.8]), mapArrow("move", [106.7, 10.8], [103.85, 1.3])] },
      { match: "Execute Kantokuen", note: "The Kwantung Army attacks north and east from Manchukuo towards Vladivostok and the Amur.", arrows: [mapArrow("attack", [129.6, 44.6], [131.9, 43.1]), mapArrow("attack", [127.5, 50.3], [135.1, 48.5])] },
      { match: "Hold to the Southern Operation, but run", note: "The south stays the main effort, and a limited probe goes across the eastern border.", arrows: [mapStand([106.7, 10.8]), mapArrow("attack", [129.6, 44.6], [130.6, 43.9])] },
    ],
    kantokuenOffensive41: [
      { match: "Push deep", note: "The drive goes for the railway itself, at Vladivostok, Khabarovsk and Svobodny.", arrows: [mapArrow("attack", [129.6, 44.6], [131.9, 43.1]), mapArrow("attack", [133.0, 47.7], [135.1, 48.5]), mapArrow("attack", [127.5, 50.3], [128.1, 51.4])] },
      { match: "Limit the objective", note: "The army takes the border country on the eastern side and goes no further.", arrows: [mapArrow("attack", [129.6, 44.6], [131.0, 44.0]), mapStand([131.0, 44.0])] },
    ],
    indochinaOccupation41: [
      { match: "Proceed with the full occupation", note: "Troops come south by sea, from Hainan to Saigon and the naval base at Cam Ranh.", arrows: [mapArrow("move", [109.5, 18.3], [106.7, 10.8]), mapArrow("move", [109.5, 18.3], [109.2, 11.9])] },
      { match: "Negotiate limited basing", note: "Japan asks for bases and the right of transit, and keeps its troops in the north.", arrows: [mapStand([105.85, 21.03]), mapStand([106.7, 10.8])] },
      { match: "Occupy in stages", note: "The ports and airfields are taken first, around Saigon and Cam Ranh, and the rest is held back.", arrows: [mapArrow("move", [109.5, 18.3], [106.7, 10.8]), mapStand([109.2, 11.9])] },
    ],
    pearlHarbor41: [
      { match: "Execute the Pearl Harbor strike as planned", note: "The carriers sail from the Kuriles by the northern route and strike Oahu from the north.", arrows: [mapArrow("move", [147.9, 43.5], [198.0, 33.0]), mapArrow("attack", [198.0, 33.0], [202.03, 21.35])] },
      { match: "Bypass Oahu", note: "No carrier goes east. All of them go to the south, for the Philippines, Malaya and the Indies.", arrows: [mapArrow("move", [139.7, 35.7], [125.0, 18.0]), mapArrow("attack", [125.0, 18.0], [120.98, 14.6]), mapArrow("attack", [125.0, 18.0], [103.85, 1.3])] },
      { match: "Execute the strike with orders for a follow-up", note: "The same approach, with a second strike held ready for the dockyards and the oil tanks.", arrows: [mapArrow("move", [147.9, 43.5], [198.0, 33.0]), mapArrow("attack", [198.0, 33.0], [202.03, 21.35]), mapStand([198.0, 33.0])] },
    ],
    burmaRangoon42: [
      { match: "Press the jungle drive", note: "The 15th Army drives from Moulmein straight at Rangoon.", arrows: [mapArrow("attack", [97.63, 16.5], [96.15, 16.8])] },
      { match: "Advance methodically along the coast", note: "The advance goes along the coast with the guns of the navy beside it.", arrows: [mapArrow("move", [97.63, 16.5], [96.15, 16.8])] },
      { match: "Send a second column north", note: "A second column goes north to Toungoo and Lashio, to cut the Burma Road.", arrows: [mapArrow("attack", [97.63, 16.5], [96.15, 16.8]), mapArrow("attack", [96.15, 16.8], [96.43, 18.93]), mapArrow("attack", [96.43, 18.93], [97.75, 22.93])] },
    ],
    indianOceanRaid42: [
      { match: "Send the five carriers into the Indian Ocean", note: "The carriers cross from the Celebes to strike Colombo and the ships at Ceylon.", arrows: [mapArrow("attack", [122.9, -4.0], [79.85, 6.93])] },
      { match: "Raid in strength", note: "The same raid, with the force kept in the ocean to hunt for the Eastern Fleet.", arrows: [mapArrow("attack", [122.9, -4.0], [79.85, 6.93]), mapArrow("attack", [122.9, -4.0], [81.2, 8.57])] },
      { match: "Skip the raid", note: "The carriers go home to rest before the next operation.", arrows: [mapArrow("withdraw", [122.9, -4.0], [139.7, 35.7])] },
    ],
    coralSea42: [
      { match: "Accept the decisive battle", note: "The fleet is committed to Midway, from the Inland Sea.", arrows: [mapArrow("attack", [132.3, 34.2], [182.63, 28.2])] },
      { match: "Consolidate", note: "The fleet holds what the south has won, at Rabaul and the Solomons.", arrows: [mapStand([152.2, -4.2])] },
      { match: "Cancel the Aleutian operation", note: "The light carriers join the Midway force, and nothing goes to the Aleutians.", arrows: [mapArrow("attack", [132.3, 34.2], [182.63, 28.2])] },
    ],
    midway42: [
      { match: "Proceed with the plan as built", note: "The carriers and the invasion force go for Midway, and a diversion goes to the Aleutians.", arrows: [mapArrow("attack", [132.3, 34.2], [182.63, 28.2]), mapArrow("attack", [141.15, 40.8], [193.5, 53.9])] },
      { match: "Redirect at sea", note: "The carrier force turns south, for Fiji and Samoa and the American supply line.", arrows: [mapArrow("attack", [152.2, -4.2], [178.4, -18.1]), mapArrow("attack", [178.4, -18.1], [188.3, -13.8])] },
      { match: "Proceed with the plan, and bring", note: "The same plan, with the battleships of the Main Body brought up close behind the carriers.", arrows: [mapArrow("attack", [132.3, 34.2], [182.63, 28.2]), mapStand([180.0, 29.8])] },
    ],
    kokodaTrail42: [
      { match: "Press the final push", note: "The detachment goes on from Ioribaiwa towards Port Moresby, at the end of its supply line.", arrows: [mapArrow("attack", [147.55, -9.15], [147.15, -9.45])] },
      { match: "Order an earlier withdrawal", note: "The detachment falls back over the track to Kokoda and the coast at Buna.", arrows: [mapArrow("withdraw", [147.55, -9.15], [147.73, -8.88]), mapArrow("withdraw", [147.73, -8.88], [148.4, -8.65])] },
      { match: "Halt at Ioribaiwa", note: "The detachment stops on the high ground and waits for the supply line to be rebuilt.", arrows: [mapStand([147.55, -9.15])] },
    ],
    guadalcanal42: [
      { match: "Commit destroyers and remaining naval air", note: "Destroyers and aircraft from the Shortlands and Rabaul go against Henderson Field.", arrows: [mapArrow("attack", [155.8, -7.1], [160.0, -9.43]), mapArrow("attack", [152.2, -4.2], [160.0, -9.43])] },
      { match: "Concede Guadalcanal early", note: "The garrison is brought out, to a line at Bougainville and Rabaul.", arrows: [mapArrow("withdraw", [160.0, -9.43], [155.7, -6.8]), mapStand([152.2, -4.2])] },
      { match: "Commit the Army's 2nd and 38th", note: "Two divisions go in a single lift from Rabaul, in place of battalions by destroyer.", arrows: [mapArrow("attack", [152.2, -4.2], [160.0, -9.43])] },
    ],
    philippineSea44: [
      { match: "Commit the fleet to the decisive battle", note: "The Mobile Fleet sails from the Philippines to meet the American carriers off Saipan.", arrows: [mapArrow("attack", [122.0, 10.5], [145.75, 15.2])] },
      { match: "Decline the fleet action", note: "The fleet stays away, and Saipan is left to its garrison.", arrows: [mapArrow("withdraw", [145.75, 15.2], [127.9, 26.3]), mapStand([145.75, 15.2])] },
    ],
    leyteGulf44: [
      { match: "Execute Sho-Go as planned", note: "The carriers sail from Japan as a decoy, while the battleships come through San Bernardino and Surigao Straits.", arrows: [mapArrow("move", [132.3, 34.2], [127.0, 19.5]), mapArrow("attack", [114.95, 4.9], [124.2, 12.5]), mapArrow("attack", [119.0, 8.5], [125.4, 10.1])] },
      { match: "Concentrate what remains on Formosa", note: "The fleet is kept back for Formosa and the home approaches, and the Philippines are given up.", arrows: [mapStand([121.0, 23.7]), mapArrow("withdraw", [125.2, 11.0], [121.0, 23.7])] },
      { match: "Send the Southern Force through San Bernardino", note: "The Southern Force follows Kurita through San Bernardino Strait in one column.", arrows: [mapArrow("attack", [114.95, 4.9], [124.2, 12.5]), mapArrow("attack", [124.2, 12.5], [125.2, 11.0])] },
    ],
    iwoJima45: [
      { match: "Reinforce and hold", note: "The garrison stays on the island to the end, with no way out.", arrows: [mapStand([141.3, 24.78])] },
      { match: "Decline further reinforcement", note: "The island is left as it is, and the spare strength goes to Okinawa.", arrows: [mapStand([141.3, 24.78]), mapArrow("move", [139.7, 35.7], [127.9, 26.3])] },
    ],
    okinawa45: [
      { match: "Commit everything", note: "Yamato sails from the Inland Sea, and the kamikaze aircraft fly from Kyushu, against the fleet off Okinawa.", arrows: [mapArrow("attack", [131.8, 34.0], [127.9, 26.3]), mapArrow("attack", [130.6, 31.4], [127.9, 26.3])] },
      { match: "Withhold Yamato", note: "Yamato and the aircraft are kept in Japan for the defence of the home islands.", arrows: [mapStand([131.8, 34.0]), mapStand([130.6, 31.4])] },
    ],
    australiaLanding42: [
      { match: "Force the landing", note: "Troops go ashore at Darwin from Timor, with the escort thinning.", arrows: [mapArrow("attack", [123.6, -10.17], [130.85, -12.46])] },
      { match: "Abort the landing", note: "The fleet is turned back from Darwin to Timor.", arrows: [mapArrow("withdraw", [127.0, -11.0], [123.6, -10.17])] },
    ],
  },
  alliedPacific: {
    wakeIslandRelief41: [
      { match: "Recall the relief force", note: "The carrier turns back for Pearl Harbor and Wake is left alone.", arrows: [mapArrow("withdraw", [185.0, 19.8], [202.03, 21.35])] },
      { match: "Send the relief force onward", note: "The carrier goes on to Wake, towards a Japanese force that is already converging on it.", arrows: [mapArrow("move", [202.03, 21.35], [166.63, 19.3])] },
      { match: "Use the carriers to raid the Marshalls", note: "The carriers strike the Marshalls as a diversion, and Wake is left alone.", arrows: [mapArrow("attack", [202.03, 21.35], [171.4, 7.1]), mapStand([166.63, 19.3])] },
    ],
    rangoonRetreatAllied42: [
      { match: "Order a fighting retreat", note: "The army falls back from Rangoon north towards the Indian border at Imphal.", arrows: [mapArrow("withdraw", [96.15, 16.8], [93.9, 24.8])] },
      { match: "Commit the Chinese divisions", note: "The army stands in Rangoon with the Chinese divisions beside it.", arrows: [mapStand([96.15, 16.8])] },
    ],
    corregidorEvacuation42: [
      { match: "Comply with the order", note: "MacArthur leaves Corregidor by PT boat for Mindanao, and goes on by air to Australia.", arrows: [mapArrow("move", [120.58, 14.38], [124.7, 8.5]), mapArrow("move", [124.7, 8.5], [130.85, -12.46])] },
      { match: "Defy the order", note: "MacArthur stays on Corregidor with the garrison and does not leave for Australia.", arrows: [mapStand([120.58, 14.38])] },
    ],
    doolittleRaidAllied42: [
      { match: "Launch immediately", note: "The bombers take off far out at sea, strike Tokyo, and fly on towards China.", arrows: [mapArrow("attack", [153.0, 35.0], [139.7, 35.7]), mapArrow("move", [139.7, 35.7], [119.0, 29.0])] },
      { match: "Abort the mission", note: "The task force turns away and the bombers do not fly.", arrows: [mapArrow("withdraw", [153.0, 35.0], [170.0, 34.0])] },
    ],
    coralSeaMidwayAllied42: [
      { match: "Commit all three available carriers", note: "The carriers wait north east of Midway, out of sight, for the Japanese force to come in.", arrows: [mapArrow("move", [202.03, 21.35], [184.5, 32.5]), mapArrow("attack", [184.5, 32.5], [180.0, 31.3])] },
      { match: "Play conservative", note: "The carriers stay at Hawaii, and the Australia route is guarded instead.", arrows: [mapStand([202.03, 21.35]), mapStand([166.45, -22.27])] },
      { match: "Commit all three carriers, and hold", note: "The same ambush, with a reserve group held back to follow it up.", arrows: [mapArrow("move", [202.03, 21.35], [184.5, 32.5]), mapArrow("attack", [184.5, 32.5], [180.0, 31.3]), mapStand([186.0, 30.5])] },
    ],
    kokodaTrailAllied42: [
      { match: "Back Blamey", note: "The Australians fall back along the track and fight as they go.", arrows: [mapArrow("withdraw", [147.73, -8.88], [147.55, -9.15]), mapArrow("withdraw", [147.55, -9.15], [147.15, -9.45])] },
      { match: "Demand an immediate stand", note: "The line is ordered to stand at Kokoda.", arrows: [mapStand([147.73, -8.88])] },
      { match: "Send the American 32nd Division", note: "The American division goes up the track from Port Moresby to take over the line.", arrows: [mapArrow("move", [147.15, -9.45], [147.73, -8.88])] },
    ],
    guadalcanalAllied42: [
      { match: "Land the Marines immediately", note: "The force gathers in the South Pacific and the Marines land at Lunga on the seventh of August.", arrows: [mapArrow("attack", [166.45, -22.27], [160.0, -9.43])] },
      { match: "Delay three months", note: "The force stays at its bases in the South Pacific while shipping, aircraft and supply are built up.", arrows: [mapStand([166.45, -22.27])] },
    ],
    peleliuDecision44: [
      { match: "Proceed with the landing", note: "The invasion force sails for Peleliu, and Angaur is attacked with it.", arrows: [mapArrow("attack", [147.3, -2.0], [134.25, 7.0])] },
      { match: "Cancel Stalemate II", note: "The force is recalled before it lands, and Peleliu is left alone.", arrows: [mapStand([147.3, -2.0])] },
    ],
    philippinesFormosaAllied44: [
      { match: "Liberate the Philippines", note: "The advance goes from New Guinea to Leyte and then to Luzon.", arrows: [mapArrow("attack", [140.7, -2.55], [125.0, 11.0]), mapArrow("attack", [125.0, 11.0], [120.3, 16.0])] },
      { match: "Bypass the Philippines", note: "The advance goes from the Marianas to Formosa.", arrows: [mapArrow("attack", [145.75, 15.2], [121.0, 23.7])] },
    ],
    burmaReconquest45: [
      { match: "Force the Ledo Road", note: "The road is built on from Ledo to join the Burma Road at Wanting.", arrows: [mapArrow("move", [95.9, 27.3], [98.1, 24.0])] },
      { match: "Rely permanently on the Hump", note: "Supplies keep going by air from Assam to Kunming.", arrows: [mapArrow("move", [95.2, 27.5], [102.7, 25.04])] },
    ],
    iwoJimaAllied45: [
      { match: "Accept the compressed", note: "The landing force sails from the Marianas on the planned date.", arrows: [mapArrow("attack", [145.7, 15.0], [141.3, 24.78])] },
      { match: "Insist on the full extended", note: "The landing force waits in the Marianas while the guns fire longer.", arrows: [mapStand([145.7, 15.0])] },
    ],
    okinawaAllied45: [
      { match: "Hold the radar picket line", note: "Destroyers stand on picket stations to the north of the island, in the path of the aircraft.", arrows: [mapStand([128.0, 28.5]), mapStand([129.3, 27.6])] },
      { match: "Pull the picket line back", note: "The stations are drawn back, and the warning comes later.", arrows: [mapArrow("withdraw", [128.0, 28.5], [127.5, 27.2])] },
    ],
    downfallOrBlockade45: [
      { match: "Prepare Operation Downfall", note: "Landings are prepared on Kyushu and then on the Kanto plain, from Okinawa.", arrows: [mapArrow("attack", [127.9, 26.3], [130.55, 31.6]), mapArrow("attack", [127.9, 26.3], [140.0, 35.5])] },
      { match: "Pursue Operation Starvation", note: "Mines and aircraft close the straits and the ports, and there is no landing.", arrows: [mapStand([130.9, 33.95]), mapStand([135.2, 34.5])] },
      { match: "Accelerate Downfall's timetable", note: "The landings go in earlier, on Kyushu and the Kanto plain, before the force is ready.", arrows: [mapArrow("attack", [127.9, 26.3], [130.55, 31.6]), mapArrow("attack", [127.9, 26.3], [140.0, 35.5])] },
    ],
    sovietHokkaido45: [
      { match: "Refuse the Soviet occupation zone", note: "All of Hokkaido stays under American administration, with no Soviet troops on it.", arrows: [mapStand([141.35, 43.06])] },
      { match: "Grant a limited Soviet occupation zone", note: "Soviet troops cross from Sakhalin into the north of Hokkaido.", arrows: [mapArrow("move", [142.7, 46.6], [141.67, 45.4])] },
    ],
  },
};

const mapIsoKey = (iso) => Number(iso.replace(/-/g, ""));

/**
 * The fronts drawn on a day: each theatre's latest entry that began before the day. A theatre whose regions stand as the record had them draws the record's
 * line; one that has departed from the record draws it dashed in red if some fighting is still going on there, and nothing if there is none.
 */
function frontsOn(dayKey, statuses) {
  if (dayKey == null || !statuses) return [];
  const base = baselineStatuses(dayKey);
  const out = [];
  for (const theatre of MAP_FRONT_SERIES) {
    let hit = null;
    for (const e of theatre.entries) {
      if (mapIsoKey(e.from) < dayKey) hit = e;
      else break;
    }
    if (!hit || !hit.lines) continue;
    const watch = hit.watch || theatre.watch;
    const moved = watch.some((r) => statuses[r] !== base[r]);
    if (moved && !watch.some((r) => statuses[r] === "contested")) continue;
    out.push({ id: theatre.id, lines: hit.lines, projection: moved });
  }
  return out;
}

/** The window of a framed map in sheet units around some places, at the shape of the window (width over height), or null if the places are too far apart or off the sheet. */
function pacificFrame(points, aspect = 2) {
  const ps = points.filter(Boolean).map(([lo, la]) => pacificXY(lo, la)).filter(([x, y]) => x > -30 && x < PAC_VBW + 30 && y > -30 && y < PAC_VBH + 30);
  if (!ps.length) return null;
  const xs = ps.map((p) => p[0]);
  const ys = ps.map((p) => p[1]);
  let w = Math.max(Math.max(...xs) - Math.min(...xs) + 220, 330);
  let h = w / aspect;
  const need = Math.max(Math.max(...ys) - Math.min(...ys) + 150, 165);
  if (h < need) {
    h = need;
    w = h * aspect;
  }
  if (w > PAC_VBW || h > PAC_VBH) return null;
  const x = Math.max(0, Math.min(PAC_VBW - w, (Math.min(...xs) + Math.max(...xs)) / 2 - w / 2));
  const y = Math.max(0, Math.min(PAC_VBH - h, (Math.min(...ys) + Math.max(...ys)) / 2 - h / 2));
  return { x, y, w, h };
}

const pacificPoints = (pts) => pts.map(([lo, la]) => pacificXY(lo, la).map((n) => n.toFixed(1)).join(",")).join(" ");

/** The fronts, drawn over the land: a pale halo and an ink line, red and dashed where the run has departed from the record. */
function PacificFronts({ fronts, s = 1 }) {
  if (!fronts || !fronts.length) return null;
  return (
    <g style={{ pointerEvents: "none" }} aria-hidden="true">
      {fronts.flatMap((f) =>
        f.lines.map((line, i) => (
          <g key={f.id + i}>
            <polyline points={pacificPoints(line)} fill="none" stroke="#f2ead9" strokeWidth={5.4 * s} strokeOpacity={0.85} strokeLinejoin="round" strokeLinecap="round" />
            <polyline points={pacificPoints(line)} fill="none" stroke={f.projection ? "#7a2e2e" : "#1a1410"} strokeWidth={2.4 * s} strokeDasharray={f.projection ? `${7 * s},${4 * s}` : undefined} strokeLinejoin="round" strokeLinecap="round" />
          </g>
        ))
      )}
    </g>
  );
}

/** One drawn order: an arrow (attack solid, move dashed, withdrawal dotted) or a ring (a stand). */
function PacificArrow({ a, accent, past, s }) {
  const color = accent || "#7a2e2e";
  const opacity = past ? 0.35 : 1;
  if (a.kind === "hold") {
    const [x, y] = pacificXY(a.at[0], a.at[1]);
    return (
      <g opacity={opacity}>
        <circle cx={x} cy={y} r={11 * s} fill="none" stroke="#f2ead9" strokeWidth={5.4 * s} />
        <circle cx={x} cy={y} r={11 * s} fill="none" stroke={color} strokeWidth={2.4 * s} />
      </g>
    );
  }
  const [x1, y1] = pacificXY(a.from[0], a.from[1]);
  const [x2, y2] = pacificXY(a.to[0], a.to[1]);
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const head = Math.min(13 * s, len * 0.5);
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const wing = head * 0.5;
  const dash = a.kind === "attack" ? undefined : a.kind === "withdraw" ? `${2 * s},${5 * s}` : `${7 * s},${5 * s}`;
  const tip = `${x2.toFixed(1)},${y2.toFixed(1)} ${(bx - uy * wing).toFixed(1)},${(by + ux * wing).toFixed(1)} ${(bx + uy * wing).toFixed(1)},${(by - ux * wing).toFixed(1)}`;
  return (
    <g opacity={a.kind === "withdraw" ? opacity * 0.8 : opacity} strokeLinecap="round" strokeLinejoin="round">
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke="#f2ead9" strokeWidth={6 * s} />
      <polygon points={tip} fill="#f2ead9" stroke="#f2ead9" strokeWidth={3 * s} />
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={2.6 * s} strokeDasharray={dash} />
      <polygon points={tip} fill={color} />
    </g>
  );
}

/**
 * The report's place and the places before it, and the orders drawn on the map. `view` is the window being shown, in sheet units, so an arrow for a place beyond
 * it sits on the window's nearest edge. Everything here is for the eye; the map's text version is the sentence under it.
 */
function PacificMarks({ marks, arrows, accent, view }) {
  const s = Math.max(0.55, Math.min(1, (view.w / PAC_VBW) * 1.5));
  const font = { fontFamily: "'IBM Plex Mono', monospace" };
  const label = { fill: "#241d12", stroke: "#f2ead9", strokeWidth: 2.6 * s, paintOrder: "stroke", style: { ...font, fontWeight: 600 } };
  const inView = ([x, y]) => x > view.x + 6 && x < view.x + view.w - 6 && y > view.y + 6 && y < view.y + view.h - 6;
  const here = marks && marks.here ? pacificXY(marks.here[0], marks.here[1]) : null;
  const route = ((marks && marks.trail) || []).filter(Boolean);
  const color = accent || "#7a2e2e";
  return (
    <g style={{ pointerEvents: "none" }} aria-hidden="true">
      {route.length > 1 && (
        <g>
          <polyline points={pacificPoints(route)} fill="none" stroke="#f2ead9" strokeWidth={4.4 * s} strokeOpacity={0.8} strokeLinejoin="round" />
          <polyline points={pacificPoints(route)} fill="none" stroke={color} strokeWidth={1.8 * s} strokeDasharray={`${2 * s},${4 * s}`} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {route.slice(0, -1).map((p, i) => {
        const [x, y] = pacificXY(p[0], p[1]);
        return inView([x, y]) ? <circle key={"v" + i} cx={x} cy={y} r={3.2 * s} fill="#f2ead9" stroke={color} strokeWidth={1.4 * s} /> : null;
      })}
      {(arrows || []).map((a, i) => (
        <PacificArrow key={i} a={a} accent={accent} past={a.past} s={s} />
      ))}
      {here && !inView(here) && marks.offLabel && (() => {
        // the report is set beyond the window: an arrow on the nearest edge, pointing the way, with the name of the place
        const cx = view.x + view.w / 2;
        const cy = view.y + view.h / 2;
        const dx = here[0] - cx;
        const dy = here[1] - cy;
        const m = 22 * s;
        const t = Math.min(dx !== 0 ? (view.w / 2 - m) / Math.abs(dx) : Infinity, dy !== 0 ? (view.h / 2 - m) / Math.abs(dy) : Infinity);
        const ex = cx + dx * t;
        const ey = cy + dy * t;
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
        const right = ex > cx + view.w * 0.2;
        const left = ex < cx - view.w * 0.2;
        return (
          <g transform={`translate(${ex} ${ey})`}>
            <g transform={`rotate(${ang})`}>
              <path d={`M${10 * s},0 L${-8 * s},${-9 * s} L${-8 * s},${9 * s} Z`} fill={color} stroke="#f2ead9" strokeWidth={2 * s} />
            </g>
            <text x={left ? 14 * s : right ? -14 * s : 0} y={dy < 0 && !left && !right ? 22 * s : dy > 0 && !left && !right ? -14 * s : 4 * s} textAnchor={left ? "start" : right ? "end" : "middle"} fontSize={10 * s} {...label}>{marks.offLabel}</text>
          </g>
        );
      })()}
      {here && inView(here) && (
        <g transform={`translate(${here[0]} ${here[1]})`}>
          <circle r={12 * s} fill="none" stroke="#f2ead9" strokeWidth={6 * s} />
          <circle r={12 * s} fill="none" stroke={color} strokeWidth={2.6 * s}>
            <animate attributeName="r" values={`${12 * s};${19 * s};${12 * s}`} dur="1.4s" repeatCount="3" />
            <animate attributeName="stroke-opacity" values="1;0.2;1" dur="1.4s" repeatCount="3" />
          </circle>
          <rect x={-4.4 * s} y={-4.4 * s} width={8.8 * s} height={8.8 * s} fill={color} stroke="#f2ead9" strokeWidth={1.4 * s} />
          {marks.name && (
            <text x={here[0] > view.x + view.w - 130 * s ? -16 * s : 16 * s} y={-10 * s} textAnchor={here[0] > view.x + view.w - 130 * s ? "end" : "start"} fontSize={10 * s} {...label}>{marks.name}</text>
          )}
        </g>
      )}
    </g>
  );
}

/** The places before this report that have a place on the map, newest last, once each in a row. */
function mapTrail(campaignId, history, nodeId) {
  const places = MAP_PLACES[campaignId] || {};
  const trail = [];
  for (const h of history || []) {
    const p = places[h.position];
    const last = trail[trail.length - 1];
    if (h.position !== nodeId && p && !(last && last[0] === p[0] && last[1] === p[1])) trail.push(p);
  }
  return trail.slice(-4);
}

/** The orders of a report that can be given and have a drawing: { index, label, op }. */
function mapOrdersOf(campaignId, nodeId, choices) {
  const ops = (MAP_OPS[campaignId] || {})[nodeId];
  if (!ops) return [];
  return choices
    .map((c, index) => ({ index, label: c.label, op: c.disabledReason ? null : ops.find((o) => c.label.startsWith(o.match)) || null }))
    .filter((x) => x.op);
}

const mapOrderName = (label) => {
  const head = label.split(":")[0];
  return head.length <= 58 ? head : head.split(" ").slice(0, 8).join(" ") + "...";
};

/**
 * The map under the title of a report: a wide window framed on the report's place and the places before it, with the front on the day, and below it the orders of
 * this report that can be drawn on it, one at a time, and the last few orders given, faint. A button opens the whole theatre, with the notes on each region.
 */
function ReportMap({ campaign, stage, nodeId, flags, meters, history, log }) {
  const [whole, setWhole] = useState(false);
  const [focus, setFocus] = useState(null);
  const place = ((MAP_PLACES[campaign.id] || {})[nodeId]) || null;
  const here = place ? [place[0], place[1]] : null;
  const trail = mapTrail(campaign.id, history, nodeId);
  const orders = mapOrdersOf(campaign.id, nodeId, stage.choices || []);
  const focused = orders.find((x) => x.index === focus) || null;
  const past = [];
  const hist = history || [];
  const given = (log || []);
  for (let k = Math.max(0, hist.length - 3); k < hist.length - 1; k++) {
    const e = given[k];
    const ops = (MAP_OPS[campaign.id] || {})[hist[k].position] || [];
    const op = e && ops.find((o) => e.label.startsWith(o.match));
    if (op) for (const a of op.arrows) past.push({ ...a, past: true });
  }
  const arrows = [...past, ...(focused ? focused.op.arrows : [])];
  const offLabel = MAP_OFF_MAP_NAMES[campaign.id + "/" + nodeId] || (place && place[2]) || null;
  const framePoints = [here, ...trail.slice(-3), ...arrows.flatMap((a) => (a.kind === "hold" ? [a.at] : [a.from, a.to]))];
  const frame = whole ? null : pacificFrame(framePoints, 2);
  const mono = { fontFamily: "'IBM Plex Mono', monospace" };
  const button = (on) => `border-2 border-black px-2 py-1 text-[10px] uppercase tracking-widest font-bold hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] ${on ? "bg-[#000000] text-[#ffffff]" : "text-[#000000]"}`;
  const marks = { here, trail, name: place ? place[2] : null, offLabel };
  return (
    <div className="mb-4" role="group" aria-label="The map on the day of this report">
      <PacificMap
        date={stage.date}
        year={yearFrom(stage.date, 1941)}
        flags={flags}
        meters={meters}
        accent={campaign.accent}
        nodeId={nodeId}
        report={{ marks, arrows, frame, passive: !whole }}
      />
      <div className="flex flex-wrap items-center gap-2 mt-2">
        {(frame || whole) && (
          <button onClick={() => setWhole(!whole)} aria-pressed={whole} className={button(whole)} style={mono}>
            {whole ? "Show this report's place" : "Show the whole theater"}
          </button>
        )}
      </div>
      {orders.length > 0 && (
        <div className="mt-2" role="group" aria-label="Orders drawn on the map">
          <div className="text-[10px] uppercase tracking-widest font-bold text-[#000000] mb-1" style={mono}>Show an order on the map</div>
          <div className="flex flex-wrap gap-2">
            {orders.map((o) => (
              <button key={o.index} onClick={() => setFocus(focus === o.index ? null : o.index)} aria-pressed={focus === o.index} className={button(focus === o.index)} style={mono}>
                {`Show order ${o.index + 1}`}
              </button>
            ))}
          </div>
          {focused && (
            <p className="text-[12px] leading-snug mt-2" style={{ fontFamily: "'Courier Prime', monospace" }}>
              <span className="font-bold">{mapOrderName(focused.label)}:</span> {focused.op.note}
            </p>
          )}
        </div>
      )}
      <p className="text-[11px] leading-snug mt-2 opacity-80" style={{ fontFamily: "'Courier Prime', monospace" }}>
        Front lines and arrows are drawn from the course of the fighting. They are not surveyed.
      </p>
    </div>
  );
}

// The reports set beyond the sheet, named for the arrow at its edge. A report whose place is on the sheet needs no entry.
const MAP_OFF_MAP_NAMES = {};
for (const [cid, places] of Object.entries(MAP_PLACES)) {
  for (const [id, p] of Object.entries(places)) {
    const [x, y] = pacificXY(p[0], p[1]);
    if (x < -30 || x > PAC_VBW + 30 || y < -30 || y > PAC_VBH + 30) MAP_OFF_MAP_NAMES[cid + "/" + id] = p[2];
  }
}
