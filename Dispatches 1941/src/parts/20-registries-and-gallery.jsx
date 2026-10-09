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
`;

const paper =
  "bg-white text-black shadow-[0_8px_30px_rgba(0,0,0,0.5)]";

// Subtle per-campaign paper stock — a warm rice-paper tone for IGHQ, a cool Navy-signal
// pale tone for CINCPAC. Deliberately faint: this should read as "a different office's
// letterhead," not a different color scheme.
function campaignPaperStyle(campaignId, accent) {
  const tints = {
    japan: "#f6efdf",
    alliedPacific: "#eef2f6",
  };
  return {
    backgroundColor: tints[campaignId] || "#ffffff",
    borderTop: `4px solid ${accent}`,
  };
}

// Message-form chrome, scoped to BriefingScreen only — deliberately NOT shared with
// WarRoomScreen, SelectScreen, OutcomeScreen, or EndScreen, which still use the
// original campaignPaperStyle above until/unless those get designed in this
// direction too. Distinct per campaign: alliedPacific reads as a completed Navy
// message blank (grey-cream, black border, red precedence accent); japan reads as
// a decoded signal intercept sheet (cooler grey-green, same black border).
function briefingMessageFormStyle(campaignId, accent) {
  // Deliberately reuses the exact same tints as campaignPaperStyle (WarRoomScreen,
  // OutcomeScreen, EndScreen) rather than a separate palette — the blue/cream tone
  // established once you "enter the war room" should carry through the whole
  // campaign, not shift to a different color on the next screen.
  const tints = {
    japan: "#f6efdf",
    alliedPacific: "#eef2f6",
  };
  return {
    backgroundColor: tints[campaignId] || "#ffffff",
    border: "2px solid #1a1a1a",
    borderTop: `4px solid ${accent}`,
    boxShadow: "6px 6px 0 rgba(0,0,0,0.25)",
  };
}

// DTG-style header field. Real Navy DTGs carry day/hour/minute precision; this
// game's `stage.date` field never stores anything finer than month, and several
// nodes only store a year or a year range. Rather than inventing false day/time
// precision to look more "authentic," this formats exactly what's really there.
// Decorative five-digit code groups for the IGHQ signal-intercept chrome, styled
// after real JN-25 intercept sheets. Deterministic from nodeId (simple string hash
// seeding a PRNG) purely so the strip doesn't reshuffle on every re-render — this is
// NOT a real cipher and encodes nothing about the node's actual content.
function codeGroupStrip(seed) {
  let h = 0;
  const s = String(seed || "x");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const groups = [];
  for (let i = 0; i < 8; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    groups.push(String(10000 + (h % 90000)));
  }
  return groups.join("  ");
}

// Region-grounded command designations for the addressee block. These are real
// historical unit/command names, not invented per-node — but this mapping was built
// from general knowledge plus two targeted verification searches (4th Fleet's actual
// command of the Gilberts/Marshalls, and CINCPAC vs COMSOPAC's actual role there), not
// a full historian pass on all 19 entries. Treat as a strong draft, not settled fact,
// before shipping — several entries (109th Division at Iwo Jima, the exact CBI vs SEAC
// boundary for Thailand) deserve a closer check.
const IGHQ_COMMAND_BY_REGION = {
  japan: "Imperial General Headquarters",
  manchuria: "Kwantung Army",
  formosa: "Formosa Army",
  okinawa: "32nd Army",
  china: "China Expeditionary Army",
  indochina: "Southern Expeditionary Army Group",
  thailand: "15th Army",
  burma: "Burma Area Army",
  india: "Burma Area Army",
  malaya: "25th Army",
  indies: "16th Army",
  philippines: "14th Army",
  newGuinea: "18th Army",
  solomons: "8th Fleet, Rabaul",
  australia: "Combined Fleet",
  gilberts: "4th Fleet",
  marshalls: "4th Fleet",
  marianas: "31st Army",
  iwoJima: "109th Division",
  palau: "14th Division", // Lt. Gen. Sadae Inoue's command, transferred from the Kwantung Army in April 1944
  pearlHarbor: "First Air Fleet", // Kido Butai, the carrier strike force — well-established, not individually re-verified this pass
  midway: "Combined Fleet", // the full Midway operation was a direct Combined Fleet plan, not a single subordinate command
  attu: "5th Fleet", // Japanese Northern Force for the Aleutians operation
  sovietFarEast: "Kwantung Army", // same command responsible for watching/planning against the Soviet border as Manchuria
};
const CINCPAC_COMMAND_BY_REGION = {
  japan: "COMINCH, Navy Department",
  manchuria: "Joint Chiefs of Staff",
  formosa: "Fifth Fleet",
  okinawa: "Tenth Army",
  china: "China-Burma-India Theater",
  indochina: "China-Burma-India Theater",
  thailand: "China-Burma-India Theater",
  burma: "China-Burma-India Theater",
  india: "China-Burma-India Theater",
  malaya: "South East Asia Command",
  indies: "South West Pacific Area",
  philippines: "South West Pacific Area",
  newGuinea: "South West Pacific Area",
  solomons: "COMSOPAC",
  australia: "South West Pacific Area",
  gilberts: "CINCPAC",
  marshalls: "CINCPAC",
  marianas: "Fifth Fleet",
  iwoJima: "Fifth Fleet",
  palau: "Fifth Fleet", // Operation Stalemate II, under III Amphibious Corps within the same Central Pacific command as Iwo Jima and the Marianas
  pearlHarbor: "CINCPAC",
  midway: "CINCPAC",
  attu: "North Pacific Force", // less certain than the others — worth a closer check before treating as settled
  sovietFarEast: "Joint Chiefs of Staff", // strategic-level only, same treatment as Manchuria's Allied entry
};

// Resolves an addressee pair for a given node from its region hint. Falls back to the
// top-level command when a node has no region (broad strategic/policy nodes like an
// embargo decision genuinely are IGHQ/Washington-level, not a theater command, so the
// fallback isn't a gap, it's often the historically correct answer).
function resolveAddressee(campaignId, nodeId) {
  const regions = NODE_REGION_HINTS[nodeId] || [];
  const region = regions[0];
  if (campaignId === "japan") {
    const unit = (region && IGHQ_COMMAND_BY_REGION[region]) || "Imperial General Headquarters";
    return { originator: "Combined Fleet", addressee: unit };
  }
  const unit = (region && CINCPAC_COMMAND_BY_REGION[region]) || "COMINCH, Navy Department";
  return { fm: "COMSOPAC", to: unit };
}

// Classification tier driven by the worst of the three meters' existing wearTier()
// severity, not a separate invented scale. A routine, healthy situation stays
// RESTRICTED (the old static default); real strain bumps it up.
function classificationLevel(meters) {
  const worst = Math.min(wearTier(meters.readiness), wearTier(meters.pipeline), wearTier(meters.initiative));
  if (worst <= -2) return "SECRET";
  if (worst <= -1) return "CONFIDENTIAL";
  return "RESTRICTED";
}

function messageFormDate(stageDate) {
  return String(stageDate || "").toUpperCase();
}

// ---------- SHARE CARD (canvas-rendered, downloadable PNG) ----------
// Draws a real shareable image, not a plain-text clipboard dump: the campaign's own
// paper-file look (aged paper tint, seal, accent rule) rendered onto a 1200x630 canvas
// (standard social preview ratio) and offered as a PNG download. No external libraries,
// no CDN dependency — pure Canvas 2D API, consistent with the itch.io packaging
// constraint that nothing here can depend on a script that might not load.
function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(" ");
  let line = "";
  let lines = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + " ";
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      ctx.fillText(line.trim(), x, y);
      line = words[i] + " ";
      y += lineHeight;
      lines++;
      if (maxLines && lines >= maxLines - 1) {
        // last allowed line: truncate with ellipsis if more text remains
        const remaining = words.slice(i + 1).join(" ");
        let finalLine = line.trim();
        if (remaining) {
          while (ctx.measureText(finalLine + "…").width > maxWidth && finalLine.length > 0) {
            finalLine = finalLine.slice(0, -1);
          }
          finalLine += "…";
        }
        ctx.fillText(finalLine, x, y);
        return y + lineHeight;
      }
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, y);
  return y + lineHeight;
}

function renderShareCard({ campaign, endingLabel, epilogueExcerpt, rank, meters, mode, matchedHistory, comparableCount, outperformed, topAdvisor, compoundPct }) {
  const W = 1200, H = 630;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const paperTint = campaign.id === "japan" ? "#f6efdf" : "#eef2f6";
  const accent = campaign.accent;

  // Background paper
  ctx.fillStyle = paperTint;
  ctx.fillRect(0, 0, W, H);

  // Top accent rule, matching the in-game paper style
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, W, 10);

  // Faint border
  ctx.strokeStyle = "#00000022";
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 30, W - 40, H - 60);

  // Seal (stamp-style box, top left)
  ctx.save();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.translate(90, 90);
  if (campaign.id === "japan") ctx.rotate((-2 * Math.PI) / 180);
  ctx.strokeRect(-70, -28, 140, 56);
  ctx.fillStyle = accent;
  ctx.font = "bold 22px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(campaign.seal, 0, 2);
  ctx.restore();

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // "SITUATION REPORT · FINAL" label
  ctx.fillStyle = "#000000cc";
  ctx.font = "bold 16px 'Courier New', monospace";
  ctx.fillText("SITUATION REPORT · FINAL", 190, 75);
  ctx.font = "14px 'Courier New', monospace";
  ctx.fillStyle = "#00000099";
  ctx.fillText(campaign.name.toUpperCase() + (mode !== "open" ? "  ·  HARD MODE" : ""), 190, 98);

  // Classification badge (Major/Minor Victory/Defeat, or Contested Outcome)
  const classification = classifyEnding(endingLabel);
  const classColor = classification === "Major Victory" ? "#1f5c2e" : classification === "Minor Victory" ? "#3a7a4a" : classification === "Contested Outcome" ? "#7a6a2e" : classification === "Minor Defeat" ? "#8a4a2e" : "#7a2e2e";
  ctx.strokeStyle = classColor;
  ctx.lineWidth = 2;
  ctx.font = "bold 14px 'Courier New', monospace";
  const classWidth = ctx.measureText(classification).width + 24;
  ctx.strokeRect(90, 130, classWidth, 30);
  ctx.fillStyle = classColor;
  ctx.textAlign = "center";
  ctx.fillText(classification, 90 + classWidth / 2, 150);
  ctx.textAlign = "left";

  // Ending title (the actual named ending, large)
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 46px Georgia, serif";
  let y = 200;
  y = wrapCanvasText(ctx, endingLabel, 90, y, W - 180, 54, 3);

  // Rank line
  ctx.font = "italic 22px Georgia, serif";
  ctx.fillStyle = "#333333";
  ctx.fillText(rank, 90, y + 10);

  // Epilogue excerpt — the card previously showed only the ending's short title, no
  // actual prose, which made every card look identical in tone regardless of how
  // different the underlying ending actually was. A real excerpt (truncated to a
  // clean sentence boundary, not just character-count-chopped) gives the card the
  // specific texture of the ending it's actually reporting on.
  let excerptY = y + 50;
  if (epilogueExcerpt) {
    ctx.font = "16px Georgia, serif";
    ctx.fillStyle = "#1a1a1a";
    excerptY = wrapCanvasText(ctx, epilogueExcerpt, 90, excerptY, W - 180, 24, 2);
  }

  // Meter readout
  const meterY = excerptY + 30;
  ctx.font = "bold 15px 'Courier New', monospace";
  ctx.fillStyle = "#000000";
  const meterText = campaign.dynamic
    ? `READINESS ${meters.readiness >= 0 ? "+" : ""}${meters.readiness}    PIPELINE ${meters.pipeline >= 0 ? "+" : ""}${meters.pipeline}    INITIATIVE ${meters.initiative >= 0 ? "+" : ""}${meters.initiative}`
    : "";
  if (meterText) ctx.fillText(meterText, 90, meterY);

  // Stats line(s)
  let statY = meterY + 34;
  ctx.font = "15px 'Courier New', monospace";
  ctx.fillStyle = "#000000aa";
  const statLines = [];
  if (comparableCount > 0) statLines.push(`Matched history ${matchedHistory}/${comparableCount} · Outperformed at ${outperformed}`);
  if (topAdvisor) statLines.push(`Most trusted advisor: ${topAdvisor}`);
  if (compoundPct) statLines.push(`Path likelihood ~${compoundPct}`);
  statLines.slice(0, 3).forEach((line) => {
    ctx.fillText(line, 90, statY);
    statY += 24;
  });

  // Footer branding
  ctx.font = "bold 15px 'Courier New', monospace";
  ctx.fillStyle = accent;
  ctx.textAlign = "right";
  ctx.fillText("DISPATCHES 1941", W - 90, H - 60);
  ctx.font = "13px 'Courier New', monospace";
  ctx.fillStyle = "#00000088";
  ctx.fillText("A Pacific War command file · 1941–1945", W - 90, H - 40);
  ctx.textAlign = "left";

  return canvas.toDataURL("image/png");
}

function downloadShareCard(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function Stamp({ text, color, campaignId }) {
  // IGHQ: a canted rubber ink-stamp look. CINCPAC: a double-ruled signal-office seal.
  // Same font, same weight — just a different office's seal.
  const variant = {
    japan: { transform: "rotate(-2deg)", borderRadius: "3px", border: `3px solid ${color}` },
    alliedPacific: { border: `1px solid ${color}`, boxShadow: `0 0 0 3px #ffffff, 0 0 0 4px ${color}`, margin: "0 3px" },
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
  japan: [
    { id: "chinaPeaceQuestion40", date: "1940", title: "The China Question, Unsolved" },
    { id: "tripartitePact40", date: "SEPTEMBER 1940", title: "The Tripartite Pact" },
    { id: "unificationQuestion40", date: "LATE 1940", title: "Two Services, Two Wars" },
    { id: "hokushinDebate41", date: "JULY 1941", title: "Kantokuen: The Road Not Taken North" },
    { id: "kantokuenOffensive41", date: "AUGUST 1941", title: "The Kwantung Army's Wager" },
    { id: "siberianReckoning42", date: "1942", title: "A War on Two Fronts, By Choice" },
    { id: "indochinaOccupation41", date: "JULY 1941", title: "Indochina and the Embargo Question" },
    { id: "novemberUltimatum41", date: "LATE NOVEMBER 1941", title: "The Hull Note" },
    { id: "pearlHarbor41", date: "DECEMBER 1941", title: "The Opening Vector" },
    { id: "burmaRangoon42", date: "MARCH 1942", title: "The Road to Rangoon" },
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
    { id: "americanEmbargoResponse41", date: "JULY 1941", title: "The Embargo Decision" },
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
    { id: "rangoonRetreatAllied42", date: "MARCH – APRIL 1942", title: "The Fall of Rangoon" },
    { id: "curtinsTurn42", date: "FEBRUARY 1942", title: "Curtin's Turn" },
    { id: "corregidorEvacuation42", date: "MARCH 1942", title: "The Order to Leave" },
    { id: "doolittleRaidAllied42", date: "APRIL 1942", title: "Doolittle's Gamble" },
    { id: "coralSeaMidwayAllied42", date: "MAY – JUNE 1942", title: "Midway: The Ambush Nobody Was Supposed to Win" },
    { id: "kokodaTrailAllied42", date: "JULY – NOVEMBER 1942", title: "The Kokoda Track" },
    { id: "guadalcanalAllied42", date: "AUGUST 1942", title: "Watchtower: The First Offensive" },
    { id: "savoIslandReckoning42", date: "AUGUST 1942", title: "Savo Island" },
    { id: "unconditionalSurrender43", date: "JANUARY 1943", title: "The Casablanca Declaration" },
    { id: "torpedoCrisis43", date: "JANUARY 1943", title: "The Torpedo That Won't Explode" },
    { id: "theBatBombQuestion43", date: "JANUARY 1943", title: "Project X-Ray: A Dentist's Idea, Fourteen Months Later" },
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


// NOTE: this list is the target spec for campaign.positionLabel(), which neither Pacific
// campaign implements yet (see build notes) — until that's added, nothing sets a run's
// label to match these strings, so the Endings Gallery completion count stays at 0 no
// matter what's actually played. The list itself is accurate against all 21 current
// terminal choices as of this pass; regenerate it again whenever content changes.
// Regenerated from a live graph walk of CAMPAIGNS (976 combinations tested, 0 failures) —
// exactly the 13 terminal (node, choice) endings actually reachable as of this pass.
// Regenerated from a live graph walk of CAMPAIGNS (44,784 combinations tested, 0
// failures) — exactly the 16 terminal (node, choice) endings actually reachable as of
// this pass. downfallOrBlockade45's two choices are no longer terminal (both now route
// through sovietHokkaido45); several old entries were removed for that reason.
// Regenerated from a live graph walk of CAMPAIGNS (183,628 combinations tested, 0
// failures) — exactly the 18 terminal (node, choice) endings actually reachable as of
// this pass. One Allied entry (the coalition-collapse case) is a hard-mode-ceiling
// cutoff, not a designed story ending — flagged in its hint rather than hidden.
// Regenerated from a live graph walk of CAMPAIGNS (664,736 combinations tested, 0
// failures) — exactly the 20 distinct positionLabel() outputs actually reachable as of
// this pass. "Two Empires, Two Different Wars" was removed: that path now continues
// through theRommelQuestion43 instead of ending directly, replaced by its two real endings.
// Updated after adding 5 new IGHQ endgame titles (hiroshimaResponsePath/coupOutcomePath/
// deadlockPath, previously unlabeled and collapsing into "One Hundred Million, Together"
// or "The Check Removed Before It Was Needed" regardless of which of those 5 genuinely
// different resolutions — including the real historical one — actually occurred). Full
// exhaustive re-walk was not run this pass (the branching factor makes it too slow to
// complete in this environment); instead verified via 30,000 random-rollout trials, which
// found 33 distinct positionLabel() outputs including all 5 new titles and confirmed
// neither of the 2 removed titles appears anymore. This is a lower confidence bound, not
// an exhaustive count — a full graph walk would be worth running before next release to
// confirm no other title became unreachable as a side effect.
// ---------- ENDING CLASSIFICATION ----------
// A quick read on how a given named ending actually turned out, relative to that seat's
// own goals — "victory" for IGHQ means good for Japan, "victory" for CINCPAC means good
// for the Allied war effort. Not an absolute scale, and not derived from meters alone:
// several of these outcomes are decided by what actually happened in the story (a coup,
// a purge, a genuine negotiated peace) rather than by how the numbers landed. Assigned by
// hand against each ending's actual content, since the nuance here isn't something a
// formula over readiness/pipeline/initiative can be trusted to get right on its own.
const ENDING_CLASSIFICATION = {
  // IGHQ (Japan) — victory/defeat judged by outcome for Japan
  "The War That Ended at Hiroshima Alone": "Major Defeat",
  "The Broadcast That Almost Wasn't": "Major Defeat",
  "The Recording That Never Aired": "Contested Outcome",
  "One Vote, Not Six": "Major Defeat",
  "A Council That Never Decided": "Major Defeat",
  "The Peace Nobody Was Ready For": "Minor Defeat",
  "The Fleet's Last Sortie": "Major Defeat",
  "A Navy Held Hostage to Its Own Survival": "Major Defeat",
  "Peace Bought With What Remained": "Minor Defeat",
  "Spent Regardless of the Reason": "Major Defeat",
  "The Gift Yamamoto Asked For": "Minor Victory",
  "A Coordination That Arrived Too Late": "Minor Defeat",
  "The Fleet That Turned for Home": "Minor Defeat",
  "The War That Waited": "Contested Outcome",
  "Armed Against a Ghost": "Contested Outcome",
  "Held to the Last Man, Lost to the Ledger": "Major Defeat",
  "The Lesson Nomonhan Taught Twice": "Major Defeat",
  "Deposed by Their Own Hardliners": "Major Defeat",
  "A Smaller War, Ended Whole": "Major Victory",
  "The War That Ended in 1942, On Japan's Terms": "Major Victory",
  // Added this session — 13 more titles that existed in positionLabel() but had no
  // classification entry. All nine of the quietEmpirePath × coldWarPath combinations
  // represent a Japan that survives entirely unconquered, a real divergence from the
  // catastrophic historical defeat regardless of which specific postwar posture this
  // staff chose — the classification reflects that survival, not just the flavor of
  // the specific arrangement. totalMobilization/pineRootDiversion are two more branches
  // of the same historical-finish thread as ketsuGo, appended with atomicChainOutcome
  // the same way, so they're classified consistently with that thread's other endings.
  "A Different Kind of Ready": "Minor Victory",
  "A Militia Empire, Courted Anyway": "Minor Victory",
  "A Quiet Empire, Quietly Courted": "Minor Victory",
  "An Unoccupied Japan Names Its Own Price": "Minor Victory",
  "Armed for a War That Became an Alliance": "Minor Victory",
  "The Swiss Model, Offered as Leverage": "Minor Victory",
  "Two Decades of Readiness, Finally Spent on Paper": "Minor Victory",
  "Cheap Deterrence, Held on Principle": "Contested Outcome",
  "The War That Waited, Still Waiting": "Contested Outcome",
  "A Price Already Paid to Someone Else": "Contested Outcome",
  "The War Moscow Sat Out": "Contested Outcome",
  "The Line Nobody Had to Cross": "Major Defeat",
  "Two Hundred Roots, One Hour": "Major Defeat",
  "The Peace That Asked for Too Much": "Minor Defeat",
  "Strength Read as Weakness": "Minor Defeat",
  "The Line Not Moved": "Contested Outcome",
  "The One Term That Held": "Minor Victory",
  "Terms Worth Having": "Minor Victory",
  "A Shorter Final Act": "Minor Victory",
  "The Beach Kurita Reached": "Minor Victory",
  "A Raid, Not a Rout": "Minor Victory",
  "The Question Asked Three Years Early": "Minor Defeat",
  "The Channel That Closed Itself": "Major Defeat",
  "The Reform Nobody Wrote a History Of": "Minor Victory",
  "Four Years of Quiet Friction": "Minor Defeat",
  // CINCPAC (Allied) — victory/defeat judged by outcome for the Allied war effort
  "The Coalition Comes Apart": "Major Defeat",
  "The Cost of the Other Road": "Minor Victory",
  "An Honest Silence at the End": "Minor Victory",
  "Manila, Left Behind": "Minor Victory",
  "Japan, Kept Whole": "Major Victory",
  "One Occupation, No Exceptions": "Major Victory",
  "A Second Korea, A Kept Throne": "Minor Victory",
  "Command Without Its Commander": "Contested Outcome",
  "The Council MacArthur Never Allowed": "Minor Victory",
  "Divided Ground, No Institution Spared": "Minor Victory",
  "One Doctrine, No Second Chair": "Minor Victory",
  "A Less Famous Hand on the Wheel": "Minor Victory",
  // Added this session — 10 endings that existed in positionLabel() but had no
  // classification entry, silently defaulting to "Contested Outcome" via the fallback.
  // For 8 of these the fallback happened to be correct, but by accident, not by
  // design; for 2 ("Europe First, Meant Literally" and "Mercenaries in Everything But
  // Name") the fallback was genuinely wrong given what their epilogue text describes.
  "Manchuria, Not Hiroshima": "Contested Outcome",
  "A Seat Bought Late": "Contested Outcome",
  "Stimson's Warning, Answered": "Contested Outcome",
  "Stimson's Warning, Ignored": "Contested Outcome",
  "The Admiral Who Wasn't Removed": "Contested Outcome",
  "The Landing That Never Happened": "Contested Outcome",
  "The General Who Stayed": "Contested Outcome",
  "Europe First, Meant Literally": "Minor Defeat",
  "Mercenaries in Everything But Name": "Minor Victory",
  "The Stalemate That Finally Moved": "Minor Victory",
  "The Fleet the Act Built Anyway": "Minor Victory",
  "What Urgency Was Actually Worth": "Contested Outcome",
  "First Contact, Held": "Contested Outcome",
  // Three more found in a final completeness pass — genuinely missed in the earlier
  // batch (one, "Everything But the Declaration," was accidentally deleted entirely
  // across two consecutive edits fixing an unrelated duplicate-key and
  // misplaced-comment issue, net result zero copies; caught by re-running the
  // cross-reference check rather than assuming the earlier fix was complete).
  "A Vote Forced, and Won": "Contested Outcome",
  "A Slower, Angrier War": "Contested Outcome",
  "Everything But the Declaration": "Contested Outcome",
};

function classifyEnding(endingLabel) {
  return ENDING_CLASSIFICATION[endingLabel] || "Contested Outcome";
}

const ENDINGS_GALLERY = [
  { campaign: "IGHQ", label: "The War That Ended at Hiroshima Alone", hint: "The war ministry's position breaks before a second bomb can test how much further it would have held." },
  { campaign: "IGHQ", label: "The Broadcast That Almost Wasn't", hint: "The historical finish: the Emperor's own intervention breaks the deadlock, and the Kyūjō coup that follows is suppressed by dawn." },
  { campaign: "IGHQ", label: "The Recording That Never Aired", hint: "The Emperor's intervention breaks the deadlock, but the coup that follows succeeds where the real one narrowly didn't." },
  { campaign: "IGHQ", label: "One Vote, Not Six", hint: "The Big Six's deadlock broken by a single minister's defection, not the Emperor's own intervention." },
  { campaign: "IGHQ", label: "A Council That Never Decided", hint: "The Big Six's three-three deadlock, never given the chance to break at all." },
  { campaign: "IGHQ", label: "The Peace Nobody Was Ready For", hint: "Surrender feelers, before the bombs made the case." },
  { campaign: "IGHQ", label: "The War Moscow Sat Out", hint: "An early Moscow approach, and the rarest roll: Soviet neutrality actually holds to the end." },
  { campaign: "IGHQ", label: "The Fleet's Last Sortie", hint: "Philippines abandoned at Leyte; the preserved fleet spent in home waters." },
  { campaign: "IGHQ", label: "A Navy Held Hostage to Its Own Survival", hint: "Philippines abandoned at Leyte; the preserved fleet held for the negotiating table." },
  { campaign: "IGHQ", label: "Peace Bought With What Remained", hint: "A carrier-preserved 1945; terms sought from real remaining strength." },
  { campaign: "IGHQ", label: "The Gift Yamamoto Asked For", hint: "A decisive Midway win, spent hardening the resource empire instead." },
  { campaign: "IGHQ", label: "A Coordination That Arrived Too Late", hint: "A decisive Midway win, pressed into the Indian Ocean: Rommel already beaten by the time the fleet arrives." },
  { campaign: "IGHQ", label: "The Fleet That Turned for Home", hint: "A decisive Midway win, recalled from the Indian Ocean rather than spent on a losing partner." },
  { campaign: "IGHQ", label: "A Quiet Empire, Quietly Courted", hint: "Pearl Harbor bypassed, war footing stood down; the Cold War eventually offers recognition, and it's accepted." },
  { campaign: "IGHQ", label: "An Unoccupied Japan Names Its Own Price", hint: "Pearl Harbor bypassed, war footing stood down; a formal Cold War proposal is made outright rather than just accepted." },
  { campaign: "IGHQ", label: "The War That Waited, Still Waiting", hint: "Pearl Harbor bypassed, war footing stood down; the Cold War's opening is declined." },
  { campaign: "IGHQ", label: "A Militia Empire, Courted Anyway", hint: "Pearl Harbor bypassed, armed neutrality kept modest; the Cold War eventually offers alignment, and it's accepted." },
  { campaign: "IGHQ", label: "Cheap Deterrence, Held on Principle", hint: "Pearl Harbor bypassed, armed neutrality kept modest; the Cold War's opening is declined on principle." },
  { campaign: "IGHQ", label: "The Swiss Model, Offered as Leverage", hint: "Pearl Harbor bypassed, armed neutrality kept modest; a formal Cold War proposal is made outright." },
  { campaign: "IGHQ", label: "Armed for a War That Became an Alliance", hint: "Pearl Harbor bypassed, permanent war footing kept; the Cold War eventually offers alignment, and it's accepted." },
  { campaign: "IGHQ", label: "Two Decades of Readiness, Finally Spent on Paper", hint: "Pearl Harbor bypassed, permanent war footing kept; a formal Cold War proposal made from that same readiness." },
  { campaign: "IGHQ", label: "Armed Against a Ghost", hint: "Pearl Harbor bypassed, permanent war footing kept; the Cold War's opening is declined too." },
  { campaign: "IGHQ", label: "A Price Already Paid to Someone Else", hint: "The southern Kurils offered directly to Moscow: already promised those same islands for free at Yalta months earlier." },
  { campaign: "IGHQ", label: "Held to the Last Man, Lost to the Ledger", hint: "Kantokuen, fought to its bitter end and defended anyway." },
  { campaign: "IGHQ", label: "The Lesson Nomonhan Taught Twice", hint: "Kantokuen's final chapter: a direct admission the gamble was wrong." },
  { campaign: "IGHQ", label: "Deposed by Their Own Hardliners", hint: "Fanatical Resolve Mode: insubordination maxed out before the war reached its final phase." },
  { campaign: "IGHQ", label: "A Smaller War, Ended Whole", hint: "The 1942 peace holds; a phased withdrawal from the Philippines and Malaya, the Indies retained." },
  { campaign: "IGHQ", label: "The War That Ended in 1942, On Japan's Terms", hint: "The 1942 peace holds a broader Japanese sphere through a harder, successful negotiation." },
  { campaign: "IGHQ", label: "The Peace That Asked for Too Much", hint: "The 1942 peace bid collapses when the negotiation asks for more than Washington will grant." },
  { campaign: "IGHQ", label: "Strength Read as Weakness", hint: "Negotiated from genuine strength; Washington reads the strong offer as an opening to press harder." },
  { campaign: "IGHQ", label: "The One Term That Held", hint: "Negotiated from genuine strength at readiness/pipeline surplus; the throne held as the sole term." },
  { campaign: "IGHQ", label: "Terms Worth Having", hint: "Negotiated from genuine strength at readiness/pipeline surplus; broader terms pressed and asked for." },
  { campaign: "IGHQ", label: "The Beach Kurita Reached", hint: "Kurita presses through at Leyte instead of withdrawing; full bombardment of the beachhead." },
  { campaign: "IGHQ", label: "A Raid, Not a Rout", hint: "Kurita presses through at Leyte instead of withdrawing; a limited strike, then withdrawal." },
  { campaign: "IGHQ", label: "The Question Asked Three Years Early", hint: "After the historical Midway defeat, a 1942 peace channel pressed regardless." },
  { campaign: "IGHQ", label: "The Channel That Closed Itself", hint: "After the historical Midway defeat, a 1942 peace channel opened and withdrawn." },
  { campaign: "CINCPAC", label: "The Coalition Comes Apart", hint: "Coalition Resolve Mode: cohesion collapsed before the war reached its final phase." },
  { campaign: "CINCPAC", label: "A Shorter Final Act", hint: "Downfall and Starvation run together at genuine pipeline surplus; the deadlock breaks days faster." },
  { campaign: "CINCPAC", label: "A Slower, Angrier War", hint: "Pearl Harbor never happened; war declared anyway over a divided Congress." },
  { campaign: "CINCPAC", label: "A Vote Forced, and Won", hint: "Pearl Harbor never happened; the declaration forced onto the floor early and won by a narrower margin than history ever needed." },
  { campaign: "CINCPAC", label: "The Fleet the Act Built Anyway", hint: "The slower declaration's own first contact: a less urgently trained force wins on matériel and numbers regardless." },
  { campaign: "CINCPAC", label: "What Urgency Was Actually Worth", hint: "The slower declaration's own first contact: the training gap costs more than the fleet's equipment advantage covers." },
  { campaign: "CINCPAC", label: "First Contact, Held", hint: "The slower declaration's own first contact: reconnaissance chosen over a decisive engagement neither side is ready to risk." },
  { campaign: "CINCPAC", label: "Manchuria, Not Hiroshima", hint: "Pearl Harbor never happened; the war ends on the Soviet Union's own timetable, no atomic bomb ever built." },
  { campaign: "CINCPAC", label: "A Seat Bought Late", hint: "Pearl Harbor never happened; Washington reenters the conversation only at the very end." },
  { campaign: "CINCPAC", label: "Stimson's Warning, Answered", hint: "Kyoto, not Hiroshima, took the first weapon: occupation policy responds with real cultural preservation commitment." },
  { campaign: "CINCPAC", label: "Stimson's Warning, Ignored", hint: "Kyoto, not Hiroshima, took the first weapon: treated as one wartime cost among many." },
  { campaign: "CINCPAC", label: "The Admiral Who Wasn't Removed", hint: "Yamamoto's April 1943 interception is declined: the war's broader shape moves on almost entirely without regard for it." },
  { campaign: "CINCPAC", label: "The Landing That Never Happened", hint: "Peleliu is bypassed rather than fought for: a real, specific difference the broader war barely notices." },
  { campaign: "CINCPAC", label: "The General Who Stayed", hint: "Stilwell stays in China on a narrower mandate: Ichi-Go succeeds regardless." },
  { campaign: "CINCPAC", label: "The Cost of the Other Road", hint: "A divergent mid-war; the historical ending reasserts itself, cost acknowledged." },
  { campaign: "CINCPAC", label: "An Honest Silence at the End", hint: "A divergent mid-war; honest uncertainty about Washington's actual calculus." },
  { campaign: "CINCPAC", label: "Japan, Kept Whole", hint: "Stalin's Hokkaido request refused; the Emperor's throne preserved. What actually happened." },
  { campaign: "CINCPAC", label: "One Occupation, No Exceptions", hint: "Stalin's Hokkaido request refused; the Emperor prosecuted alongside his war cabinet." },
  { campaign: "CINCPAC", label: "A Second Korea, A Kept Throne", hint: "Stalin's Hokkaido request granted; the Emperor's throne preserved regardless." },
  { campaign: "CINCPAC", label: "Command Without Its Commander", hint: "MacArthur never survived Corregidor or was relieved earlier; Eichelberger administers the occupation instead." },
  { campaign: "CINCPAC", label: "The Council MacArthur Never Allowed", hint: "MacArthur absent or relieved; a genuine Allied council governs occupied Japan instead of one general." },
  { campaign: "CINCPAC", label: "Divided Ground, No Institution Spared", hint: "Stalin's Hokkaido request granted; the Emperor prosecuted too." },
  { campaign: "CINCPAC", label: "One Doctrine, No Second Chair", hint: "Halsey relieved after Typhoon Cobra; Spruance's caution becomes the fleet's only doctrine." },
  { campaign: "CINCPAC", label: "A Less Famous Hand on the Wheel", hint: "Halsey relieved after Typhoon Cobra; the alternating command structure restored under a new name." },
];


// DEMO_BUILD is a build-time flag substituted by build.mjs's esbuild `define` (see
// build.mjs) — the literal expression `process.env.DEMO_BUILD` gets replaced with an
// actual `true`/`false` token before this code ever runs, so no live `process` reference
// survives into the compiled browser bundle either way. (A `typeof process !== "undefined"`
// guard was here previously as defensive belt-and-suspenders; it was removed because
// browsers never have a bare `process` global, so that check always evaluated to false in
// every real build — including demo builds — silently forcing this to false regardless of
// the actual build flag. Caught via an actual browser test after a shipped demo build
// showed no lock behavior at all; source-level testing via Node's require() never exercises
// esbuild's define substitution, so it never surfaced the bug.)
const DEMO_BUILD = process.env.DEMO_BUILD === true;

// Build-time gate: locked in demo builds (Open Command only across both seats), unlocked
// in the full paid download (adds Fanatical Resolve and Coalition Resolve Mode). Previously
// a separate hardcoded toggle from before DEMO_BUILD existed; now derived from the same
// single source of truth so the two can't drift out of sync with each other.
const HARD_MODES_ENABLED = !DEMO_BUILD;

const NODE_TOTAL = 139; // Corrected from 136 to 139: bataanPOWQuestion42 (japan), portChicago44 and cabanatuanRaid45 (alliedPacific)
// or seriously built programs (Project X-Ray's bat bombs, the I-400 submarine carriers'
// Panama Canal mission) that were genuinely pursued and then overtaken by events, not
// invented for flavor. Both cite real, checked figures and dates.
// Corrected from 131 to 133: theUnopposedConsolidation42 and
// twoForcesNeitherTested43 added this session, completing the "Press for War" expansion
// thread's node 2 (Japan's position after unopposed consolidation) and node 3 (a first
// engagement between two forces that have never fought each other) that
// PRESS_FOR_WAR_EXPANSION_PLAN.md had scoped but left unbuilt.
// Corrected from 130 to 131: theDeadlockHolds45 added this session,
// giving the "A Council That Never Decided" ending a real continuation past the deadlock
// itself, rather than the epilogue trailing off mid-thought at "into whatever came next."
// Corrected from 129 to 130: burmaRangoon42Delayed added this
// session as a genuine second entry-path variant (Burma is reachable both on the
// historical timetable and, months late, via the Australia-gamble detour). A parallel
// attempt to split strategicBombingAllied45 the same way was reverted after the
// validator showed the "on-time" original had ZERO real entry points — every actual
// playthrough reaches this decision via okinawaAllied45, always dated APRIL-JUNE, never
// MARCH. That node was renamed to strategicBombingAllied45Delayed outright rather than
// kept as two nodes, since only one was ever reachable. Net change: +1, not +2.
// Prior correction, retained: 127 to 129, reflecting theSlowerDeclaration42 and
// warBeginsLate42 added this session (the "press for war" content gap fix). Verified via the
// same static method as prior corrections: every atlas entry has a real node definition and
// is referenced as a next: target or is a legitimate campaign start node.

function warRoomModeInfo(mode) {
  const names = { open: "Open Command", fanatical: "Fanatical Resolve Mode", coalition: "Coalition Resolve Mode" };
  const notes = {
    open: "Standard play. Full meter visibility, rewind available.",
    fanatical: "No rewind. IGHQ's tolerance for non-dogmatic choices is tracked: some choices draw more than others.",
    coalition: "No rewind. Coalition Resolve tracked between Washington, London, Chongqing, and Canberra.",
  };
  return { label: names[mode] || mode, note: notes[mode] || "" };
}

