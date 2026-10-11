// =============================================================================
// METERS
// =============================================================================

export function emptyMeters() {
  return { manpower: 0, munitions: 0, will: 0 };
}

export function clampMeter(v) {
  return Math.max(METER_MIN, Math.min(METER_MAX, v));
}

export function applyImpact(meters, impact) {
  const next = { ...meters };
  if (!impact) return next;
  for (const axis of METER_AXES) {
    if (typeof impact[axis] === "number") {
      next[axis] = clampMeter(next[axis] + impact[axis]);
    }
  }
  return next;
}

/** Label the will axis for the campaign in play. Spec §4.4. */
export function meterLabels(campaignId) {
  const c = CAMPAIGNS[campaignId];
  return {
    manpower: "Manpower",
    munitions: "Munitions",
    will: c ? c.willLabel : "Will",
  };
}

// ---------- the three readings under each meter (after Dispatches 1940) ----------
//
// Each meter is a headline over three readings, so that "Manpower -3" can be told as an army that is worn out, or green, or in disorder. Where an order's
// impact fell is read from its own words (the label and the outcome), the way 1940 does it, and tallied in the run's flags as st_<id>. A reading is the
// headline plus how far its own tally stands above or below the other two, so the three always average back to the headline. Nothing here changes a roll
// or an ending: it tells the player what the number is made of.

export const METER_STRANDS = {
  manpower: [
    { id: "org", name: "Organisation", weight: 0.6, bands: ["Shattered", "Disordered", "Strained", "Sound", "Tight"],
      words: /\b(reorgani[sz]\w*|regroup\w*|reform(?:ed|ing)?|consolidat\w*|amalgamat\w*|merg(?:e|ed|es|ing)|formations?|cohesi\w+|discipline|shorten\w*|withdraw\w*|retreat\w*|relieved|command structure|line|front|positions?|defensive)\b/gi },
    { id: "exp", name: "Experience", weight: 2.2, bands: ["Raw recruits", "Green", "Thin", "Seasoned", "Veteran"],
      words: /\b(veterans?|regulars?|experienced?|trained|training|officers?|officer corps|cadres?|recruits?|conscripts?|reservists?|volunteers?|new armies|schools?|instructors?|best divisions|shock troops?|new|raw|green|inexperienced|conscription|levy|class|young|replace\w*|volunteer army|territorials?|landwehr|landsturm|militia|lessons?|learn\w*|method|doctrine|tactics?|skill\w*)\b/gi },
    { id: "rdy", name: "Readiness", weight: 1, bands: ["Spent", "Exhausted", "Worn", "Ready", "Fresh"],
      words: /\b(rest(?:ed|ing)?|refit\w*|rotat\w*|fatigue\w*|exhaust\w*|winter|cold|frost\w*|disease|typhus|sick\w*|rations?|hunger|reserves?|replacements?|reinforce\w*|casualt\w*|losses|killed|wounded|fresh)\b/gi },
  ],
  munitions: [
    { id: "guns", name: "Guns and Shells", weight: 0.8, bands: ["Silent", "Short", "Strained", "Adequate", "Plentiful"],
      words: /\b(shells?|shell shortage|ammunition|artillery|guns?|howitzers?|barrage|bombardment|heavy guns?|rounds|high-explosive|shrapnel|machine guns?|rifles?|tanks?|mines?|gas)\b/gi },
    { id: "rail", name: "Rail and Transport", weight: 1.5, bands: ["Choked", "Short", "Strained", "Adequate", "Plentiful"],
      words: /\b(rail\w*|trains?|lorries|roads?|transport|supply|supplies|logistics?|convoys?|shipping|ports?|horses|depots?|stores|wagons?|submarines?|tonnage|trucks?|motor|bridges?|canal|harbour|ships?|fleet|navy|naval|route|distance|march\w*|moved|movement)\b/gi },
    { id: "ind", name: "Industry and Imports", weight: 2.5, bands: ["Idle", "Short", "Strained", "Adequate", "Plentiful"],
      words: /\b(factor(?:y|ies)|industry|industrial|production|output|munitions workers?|ministry of munitions|programme|imports?|blockade|raw materials?|coal|steel|oil|nitrates?|credit|loans?|american|hindenburg programme|grain|harvest|stocks?|stockpiles?|shortage\w*|manufactur\w*|workshops?|works|arsenals?|contracts?|purchase\w*|allies|ally|german help|help|money|economy|economic|scarce\w*|resources?|materi[ae]l)\b/gi },
  ],
  will: [
    { id: "army", name: "The Army", weight: 0.7, bands: ["Mutinous", "Shaken", "Wavering", "Steady", "Resolute"],
      words: /\b(morale|mutin\w*|discipline|troops|soldiers|ranks|desert\w*|refus\w*|obey|obedience|spirit|confidence|fraternis\w*|disintegrat\w*|units|regiments|panic|will to fight)\b/gi },
    { id: "govt", name: "The Government", weight: 1.2, bands: ["Estranged", "Strained", "Uneasy", "Aligned", "United"],
      words: /\b(government|ministers?|cabinet|parliament|reichstag|duma|politic\w*|emperor|kaiser|tsar|king|president|premier|chancellor|authority|civil|regime|dynasty|crown|war cabinet|council|sultan)\b/gi },
    { id: "pub", name: "The Public", weight: 1.6, bands: ["Hostile", "Weary", "Anxious", "Patient", "Behind the war"],
      words: /\b(public|people|press|newspapers?|home front|civilians?|strikes?|bread|food|cities|workers?|families|population|opinion|nation|country|towns|capital|peace|war weariness|propaganda|loan|bonds?|streets|politicians|parties|deputies|elections?|voters?|women|prices|rationing|shortages)\b/gi },
  ],
};

/** Where an impact lands when its words name none of the meter's readings: by the command's own meaning of will, and by the commonest reading for the others. */
const WILL_FALLBACK = { ohl: "pub", gqg: "army", stavka: "govt", bef: "govt", aok: "army", otto: "govt" };
function strandFallback(meter, campaignId) {
  if (meter === "will") return WILL_FALLBACK[campaignId] || "army";
  return meter === "manpower" ? "rdy" : "guns";
}

/** Which reading of `meter` an order's impact fell on, from its label and the text of its outcome. */
export function strandOf(meter, choice, outcomeText, campaignId) {
  const text = [choice.label, outcomeText ?? choice.outcome ?? ""].join(" ");
  let best = null;
  let bestN = 0;
  for (const s of METER_STRANDS[meter]) {
    const n = (text.match(s.words) || []).length * (s.weight || 1);
    if (n > bestN) { bestN = n; best = s.id; }
  }
  return best ?? strandFallback(meter, campaignId);
}

/** The three readings of one meter: { id, name, band, level (0 worst to 4 best), score }. */
export function strandReadout(meter, flags, meters) {
  const defs = METER_STRANDS[meter];
  const tallies = defs.map((s) => Number((flags || {})["st_" + s.id]) || 0);
  const mean = tallies.reduce((a, v) => a + v, 0) / defs.length;
  return defs.map((s, i) => {
    const score = clampMeter(Math.round(meters[meter] + (tallies[i] - mean)));
    const level = score <= -8 ? 0 : score <= -4 ? 1 : score <= -1 ? 2 : score <= 3 ? 3 : 4;
    return { id: s.id, name: s.name, band: s.bands[level], level, score };
  });
}

/** Add an order's impact to the tallies of the readings it fell on. Returns the new flags (the same object when nothing moved). */
export function tallyStrands(flags, choice, impact, outcomeText, campaignId) {
  let next = flags;
  for (const axis of METER_AXES) {
    const delta = impact && impact[axis];
    if (!delta) continue;
    const id = strandOf(axis, choice, outcomeText, campaignId);
    if (next === flags) next = { ...flags };
    next["st_" + id] = (Number(next["st_" + id]) || 0) + delta;
  }
  return next;
}

/** What an order did to each meter, for the report: [{ axis, delta, from, to, strand: { id, name, before, after } }]. */
export function meterChanges(before, after, flagsBefore, flagsAfter, choice, outcomeText, campaignId) {
  const out = [];
  for (const axis of METER_AXES) {
    const delta = after[axis] - before[axis];
    if (!delta) continue;
    const id = strandOf(axis, choice, outcomeText, campaignId);
    const b = strandReadout(axis, flagsBefore, before).find((r) => r.id === id);
    const a = strandReadout(axis, flagsAfter, after).find((r) => r.id === id);
    out.push({ axis, delta, from: before[axis], to: after[axis], strand: { id, name: a.name, before: b.band, after: a.band } });
  }
  return out;
}
