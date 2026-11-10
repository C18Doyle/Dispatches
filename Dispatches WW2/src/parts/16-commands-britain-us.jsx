  // ---------- THE BRITISH AND AMERICAN COMMANDS (Dispatches WW2) ----------
  // SHAEF (Dispatches 1940's `allied`) and CINCPAC (Dispatches 1941's `alliedPacific`) are no longer offered: their reports are shared out
  // between a British command and an American one by whose government made the decision in the record (docs/COMMANDS.md). Each of the two
  // runs two TRACKS, one through each source file, in date order (compositeNext, below the CAMPAIGNS object). Where a track reaches a report
  // that belongs to the other command, the record's own order is taken without a screen (its flags, not its meters), so the later reports
  // read as they were written. The British command plays by 1940's rules and its ending is 1940's Allied ending; the American command plays
  // by 1941's rules and its ending is 1941's (src/rules.ts: PACIFIC_RULES).
  british: {
    id: "british",
    seal: "WAR CABINET",
    name: "The War Cabinet and Chiefs of Staff",
    dates: "1939–1945",
    brief: "Direct Britain's war from the promise to Poland to Burma: Norway, Dunkirk, the Atlantic, the Mediterranean, Singapore and the road back through Italy and the Low Countries.",
    teaser: "An empire's war, fought on every front at once.",
    accent: "#2f4a3a",
    dynamic: true,
    start: "saar39",
    // The source file the war room, the end of the war and the European map are drawn from.
    endSource: "allied",
    tracks: [
      { key: "E", source: "allied", start: "saar39", theatre: "europe" },
      { key: "P", source: "alliedPacific", start: "fleetAtHawaii40", theatre: "pacific" },
    ],
    resolveNode(id, flags, meters) {
      return compositeResolve("british", id, flags, meters);
    },
    historicity(...a) { return CAMPAIGNS.allied.historicity ? CAMPAIGNS.allied.historicity(...a) : null; },
    projectedEnd(...a) { return CAMPAIGNS.allied.projectedEnd(...a); },
    positionLabel(...a) { return CAMPAIGNS.allied.positionLabel(...a); },
    epilogue(...a) { return CAMPAIGNS.allied.epilogue(...a); },
    oneYearLater(...a) { return CAMPAIGNS.allied.oneYearLater ? CAMPAIGNS.allied.oneYearLater(...a) : null; },
  },
  american: {
    id: "american",
    seal: "JOINT CHIEFS",
    name: "The Joint Chiefs of Staff",
    dates: "1940–1945",
    brief: "Direct America's war on two oceans, from the fleet at Hawaii to Tokyo Bay, and from Torch to the Elbe.",
    teaser: "Two wars, one arsenal, and the question of which comes first.",
    accent: "#28497a",
    dynamic: true,
    start: "fleetAtHawaii40",
    endSource: "alliedPacific",
    tracks: [
      { key: "P", source: "alliedPacific", start: "fleetAtHawaii40", theatre: "pacific" },
      // The war in Europe begins for the American file once it is at war: when the Pacific track has reached Arcadia.
      { key: "E", source: "allied", start: "saar39", theatre: "europe", opensAt: "arcadia41" },
    ],
    resolveNode(id, flags, meters) {
      return compositeResolve("american", id, flags, meters);
    },
    positionLabel(...a) { return CAMPAIGNS.alliedPacific.positionLabel(...a); },
    epilogue(...a) { return CAMPAIGNS.alliedPacific.epilogue(...a); },
  },
};

// ---------- WHO OWNS EACH ALLIED REPORT ----------
// Every report of the two source files belongs to the British command, the American command, or both (BOTH: Yalta, the one conference
// neither file has twice). The other conferences are in both source files under two ids (Arcadia: europeFirst42 and arcadia41; Casablanca:
// casablanca43 and unconditionalSurrender43; Tehran: tehran43 and tehransPromise43), so each command takes one of them and passes the other
// by the record. A report missing from both lists below is American (most of CINCPAC's file).
const BRITISH_REPORTS = new Set([
  // 1939 to 1941, the British war before America's
  "saar39", "dyle39", "altmarkRaid40", "finland40", "wilfred40", "narvik40", "dunkirk40", "halifaxCrisis40", "battleOfBritain40",
  "compassGreece41", "greeceFalls41", "crete41", "aidRussia41", "malaya41", "forceZ41", "crusader41",
  // the conferences from London's chair
  "europeFirst42", "casablanca43", "tehran43",
  // the sea, the bombers and the Mediterranean
  "atlanticConvoys42", "pq17_1942", "australiaLifeline42", "dieppe42", "bomberDirective43", "italyOrOverlord43", "dodecanese43", "aegeanReckoning43",
  "turkishQuestion44", "turkishBelligerence44", "anzio44", "anzioSiege44", "romeDividend44", "gothicLineEarly44", "ljubljanaGap44", "gapStalled44",
  "viennaStandoff44", "strategicBombing45",
  // Montgomery's front
  "marketGarden44", "arnhemPerimeter44", "scheldt44",
  // the Commonwealth's war in Asia (from CINCPAC's file)
  "curtinsTurn42", "rangoonRetreatAllied42", "kokodaTrailAllied42", "burmaReconquest45",
]);
const BOTH_REPORTS = new Set(["yaltaFeb45"]);
const AMERICAN_FROM_ALLIED = new Set([
  "pacificPressure42", "secondFront42", "darlanDeal42", "resistanceContact44", "sicilyHusky43", "untestedDoctrine44", "overlordPrep44",
  "omahaCrisis44", "omahaIsolated44", "omahaBreakthroughLate44", "omahaToehold44", "falaise44", "normandy44", "eisenhowerIntervenes44",
  "anvilDragoon44", "ardennesResponse44", "bulgeExploited44", "stalinTestsTheFront45", "westernCollapse45", "berlinDecision45", "berlinRace45",
  "germanyOccupation45",
]);

/** Whether a report of one of the two Allied source files is played in this command's file. */
function compositeOwns(commandId, nodeId) {
  if (BOTH_REPORTS.has(nodeId)) return true;
  if (commandId === "british") return BRITISH_REPORTS.has(nodeId);
  if (commandId === "american") return !BRITISH_REPORTS.has(nodeId) && (compositeSourceOf(nodeId) === "alliedPacific" || AMERICAN_FROM_ALLIED.has(nodeId));
  return false;
}

/** The source file a report of the British or American command comes from: "allied" or "alliedPacific". */
function compositeSourceOf(nodeId) {
  const id = String(nodeId);
  if (COMPOSITE_SOURCE_CACHE.has(id)) return COMPOSITE_SOURCE_CACHE.get(id);
  let src = "allied";
  try {
    if (!CAMPAIGNS.allied.resolveNode(id, {}, { manpower: 0, fuel: 0, initiative: 0 })) src = "alliedPacific";
  } catch (e) {
    src = "alliedPacific";
  }
  COMPOSITE_SOURCE_CACHE.set(id, src);
  return src;
}
const COMPOSITE_SOURCE_CACHE = new Map();

function compositeResolve(commandId, id, flags, meters) {
  return CAMPAIGNS[compositeSourceOf(id)].resolveNode(id, flags, meters);
}

/** The campaign object that a report's screens are drawn for: the source file's (its maps, its staff's reading, its events), under the
 * command's seal, name and colour. Commands that are not composite are their own view. */
function campaignView(campaign, nodeId) {
  if (!campaign || !campaign.tracks) return campaign;
  const src = CAMPAIGNS[compositeSourceOf(nodeId)];
  return { ...src, id: src.id, seal: campaign.seal, name: campaign.name, accent: campaign.accent, dates: campaign.dates, commandId: campaign.id, positionLabel: campaign.positionLabel, projectedEnd: campaign.projectedEnd, epilogue: campaign.epilogue };
}

/** A map draws the trail of the reports before this one from its own source file: a British or American file's history holds reports of
 * both, and each map knows only its own. A report's view (campaignView) keeps its source's; the end of the war keeps the endSource's. */
function mapHistory(campaign, history) {
  if (!campaign || !Array.isArray(history)) return history;
  const src = campaign.tracks ? campaign.endSource : campaign.commandId ? campaign.id : null;
  if (!src) return history;
  return history.filter((h) => h && compositeSourceOf(h.position) === src);
}

// ---------- STEPPING THROUGH TWO TRACKS ----------
const TRACK_FLAG = (key) => `trk_${key}`; // the track's next report not yet shown, or "END"
const TRACK_OPEN = (key) => `trkOpen_${key}`;
const TRACK_ENDS = new Set(["END", "end", ""]);
const REPORT_MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
/** The month a report's date starts in, for ordering two tracks: "SEPTEMBER 1944" is 194409; a season or a part of the year counts as its
 * usual month ("EARLY 1944" 194402, "SPRING" 04, "MID-" 06, "SUMMER" 07, "LATE" or "AUTUMN" 10, "WINTER" 12); a bare year ("1943", "1943 – 1944")
 * counts as its middle, 194306, so that a year-long report falls among the year's dated ones rather than before them. */
const TRACK_SEASON_MONTH = [[/\bEARLY\b/, 2], [/\bSPRING\b/, 4], [/\bMID\b|\bMID-/, 6], [/\bSUMMER\b/, 7], [/\bAUTUMN\b|\bFALL\b|\bLATE\b/, 10], [/\bWINTER\b/, 12]];
function trackMonth(date) {
  const s = String(date || "").toUpperCase();
  const y = s.match(/19\d{2}/);
  if (!y) return 999999;
  const head = s.slice(0, s.indexOf(y[0])); // only what comes before the first year: "JUNE – JULY 1942" is June
  const m = head.match(/JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC/);
  if (m) return Number(y[0]) * 100 + REPORT_MONTH_NAMES.indexOf(m[0]) + 1;
  for (const [re, month] of TRACK_SEASON_MONTH) if (re.test(head)) return Number(y[0]) * 100 + month;
  return Number(y[0]) * 100 + 6;
}

/** The order the record took at a report this command does not play: the historical order (else the first), and for a roll its likeliest
 * outcome (else the first). Returns the flags it sets and where it leads. */
function recordStep(node) {
  const choices = (node && node.choices) || [];
  const c = choices.find((x) => x.historical) || choices[0];
  if (!c) return { next: "END", setFlags: {} };
  let v = null;
  if (c.uncertain && c.uncertain.length) v = c.uncertain.reduce((best, x) => ((x.weight || 0) > (best.weight || 0) ? x : best), c.uncertain[0]);
  return { next: (v && v.next) || c.next || "END", setFlags: { ...(c.setFlags || {}), ...((v && v.setFlags) || {}) } };
}

/** From a report id in a track's source file, pass the other command's reports by the record until one of this command's (or the end). */
function trackForward(commandId, track, id, flags, meters) {
  let f = flags;
  let cur = id;
  for (let guard = 0; guard < 300; guard++) {
    if (cur == null || TRACK_ENDS.has(String(cur))) return { at: "END", flags: f };
    if (compositeOwns(commandId, cur)) return { at: String(cur), flags: f };
    let node = null;
    try {
      node = CAMPAIGNS[track.source].resolveNode(String(cur), f, meters);
    } catch (e) {
      node = null;
    }
    if (!node) return { at: "END", flags: f };
    const step = recordStep(node);
    f = { ...f, ...step.setFlags };
    cur = step.next;
  }
  return { at: "END", flags: f };
}

/**
 * The next report of a British or American file. `position` is the report just played and `rawNext` where its order leads in its own
 * source file (`rawEnd` when that is the end of the file). Each track keeps its next unplayed report in the flag trk_<key>; a track opens at
 * its start, or when the file reaches its `opensAt` report. The next report is the one, among the open tracks, whose date starts earliest
 * (the track just played wins a tie). The file ends when every open track has ended.
 */
function compositeNext(campaign, position, rawNext, rawEnd, flags, meters) {
  const commandId = campaign.id;
  let f = { ...flags };
  const here = compositeSourceOf(position);
  for (const tr of campaign.tracks) {
    if (tr.opensAt && String(position) === tr.opensAt) f[TRACK_OPEN(tr.key)] = true;
  }
  for (const tr of campaign.tracks) {
    const open = !tr.opensAt || f[TRACK_OPEN(tr.key)];
    if (!open) continue;
    if (tr.source === here) {
      const r = trackForward(commandId, tr, rawEnd ? "END" : rawNext, f, meters);
      f = { ...r.flags, [TRACK_FLAG(tr.key)]: r.at };
    } else if (f[TRACK_FLAG(tr.key)] == null) {
      const r = trackForward(commandId, tr, tr.start, f, meters);
      f = { ...r.flags, [TRACK_FLAG(tr.key)]: r.at };
    }
  }
  let best = null;
  for (const tr of campaign.tracks) {
    const at = f[TRACK_FLAG(tr.key)];
    if (at == null || at === "END") continue;
    let node = null;
    try {
      node = CAMPAIGNS[tr.source].resolveNode(String(at), f, meters);
    } catch (e) {
      node = null;
    }
    const month = trackMonth(node && node.date);
    const score = month * 2 + (tr.source === here ? 0 : 1);
    if (!best || score < best.score) best = { score, at, key: tr.key };
  }
  if (!best) return { nextPos: "END", isEnd: true, flags: f };
  // The report about to be shown is no longer waiting in its track.
  return { nextPos: best.at, isEnd: false, flags: { ...f, [TRACK_FLAG(best.key)]: undefined } };
}

// ---------- STYLE HELPERS ----------
// The artifact environment ships only Tailwind's precompiled core classes — arbitrary
// values like text-[#ffffff] are never generated. This stylesheet implements every
// arbitrary class this campaign uses, so the classes behave as written.
