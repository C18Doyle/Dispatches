// =============================================================================
// THE STAFF'S READING
// =============================================================================
//
// A report tells what the headquarters believes, and sometimes that is wrong: the French staff thought the German right too weak to matter, the Russian
// front staff thought the German Eighth Army was falling back on the Vistula, the Ottoman staff thought the British would attack in the east. A few
// reports carry such beliefs (INTEL_ITEMS), each with the grade the staff gave it, whether it holds, and what the truth was. The grade is no guide: firm
// reports have been wrong and doubtful ones right.
//
// The player may CHECK a belief, spending one of a few checks for the file (INTEL.checks; INTEL.hardChecks in hard mode; a trusted adviser can bring one
// more: see 69-trust.jsx), and is told whether it holds. Two things follow, both small and neither touching a file that never checks:
//   * the odds dial of an order that rests on a false belief shows the odds the belief would give, INTEL.believedShift points better than the roll's
//     real odds, until the belief is checked (the dial says so);
//   * an order that does not rest on a belief the player has checked and found false earns the edge: the staff knew what it was facing (+1 will).
// In easy mode every belief is shown with its verdict from the start, at no cost, and there is no edge.
// =============================================================================

export const INTEL = { checks: 3, hardChecks: 2, believedShift: 15, edge: { will: 1 } };

/** { [nodeId]: [{ id, text, grade, holds, truth, relied: [choiceId] }] }: what the report's staff believes. `relied` names the orders that rest on it. */
export const INTEL_ITEMS = {
  gqg_1914_01_frontieres: [
    { id: "reserve", grade: "firm", holds: false, relied: ["attack"], source: "the General Staff's own appreciation, made before the war",
      text: "The Germans will not put their reserve corps in the front line, so their right wing cannot be strong enough to matter.",
      truth: "The German army put its reserve corps beside the active ones from the first day, and its right wing in Belgium was half as strong again as the French staff had allowed for." },
  ],
  stavka_1914_12_tannenberg: [
    { id: "retiring", grade: "firm", holds: false, relied: ["press"], source: "reports reaching the front's headquarters",
      text: "The German Eighth Army, beaten at Gumbinnen, is falling back toward the Vistula.",
      truth: "The Eighth Army was not retiring on the Vistula. It was turning south, by rail and on foot, against the Second Army." },
  ],
  aok_1914_03_galicia: [
    { id: "weak", grade: "doubtful", holds: false, relied: ["offensive"], source: "the army's intelligence office, the Evidenzbureau",
      text: "The Russians in front of Lemberg are fewer than the plan assumed, and the armies can advance into Poland.",
      truth: "The Russians put four armies into Galicia, and they were stronger and farther forward than the staff had reckoned." },
  ],
  bef_1916_11_somme: [
    { id: "wire", grade: "firm", holds: false, relied: ["compromise"], source: "the artillery staff's estimate",
      text: "A week's bombardment will cut the German wire and break the dugouts, and the infantry will walk into empty trenches.",
      truth: "The shells, many of them shrapnel, did not cut the wire everywhere, and the deep German dugouts survived the bombardment." },
  ],
  otto_1914_03_sarikamis: [
    { id: "thin", grade: "doubtful", holds: false, relied: ["launch"], source: "Enver's own reading of the front",
      text: "The Russian line round Sarıkamış is thin and has no winter equipment.",
      truth: "The Russians had more men in the area than Enver reckoned, and a railway to bring up the rest. It was the Ottoman columns that had no winter clothing." },
  ],
  otto_1915_02_gallipoli: [
    { id: "bulair", grade: "doubtful", holds: false, relied: ["reserve"], source: "the German adviser's judgement",
      text: "The main landing will come at Bulair, at the neck of the peninsula.",
      truth: "The landings came at Cape Helles and at Anzac, far from Bulair, and the two divisions held at the neck were in the wrong place." },
  ],
  gqg_1916_04_verdun: [
    { id: "stripped", grade: "firm", holds: true, relied: ["shorten"], source: "reports from officers in the fortress region",
      text: "The forts of Verdun have been stripped of their guns and garrisons.",
      truth: "The forts had been largely disarmed, and a handful of men held Douaumont; the line in front of them was thin." },
  ],
  bef_1915_06_loos: [
    { id: "light", grade: "doubtful", holds: true, relied: ["attack"], source: "patrol and prisoner reports",
      text: "The German line at Loos is lightly held.",
      truth: "The front line was lightly held and the first day made ground, but the German reserves were close behind it." },
  ],
  stavka_1915_01_masuria: [
    { id: "warning", grade: "doubtful", holds: true, relied: ["pull", "reinforce"], source: "the Tenth Army's own reports",
      text: "The Tenth Army's commander is right: a German attack is coming against it.",
      truth: "The Germans attacked on 7 February (Western calendar), in a snowstorm, and outflanked the Tenth Army within days." },
  ],
  ohl_1918_09_michael: [
    { id: "thin", grade: "firm", holds: true, relied: ["adaptive", "amiens"], source: "German reconnaissance of the British lines",
      text: "The British Fifth Army on the Somme is thinly held and has little reserve behind it.",
      truth: "The Fifth Army held a long front with few divisions and few reserves, and the German blow broke it in the first days." },
  ],
  otto_1918_02_megiddo: [
    { id: "jordan", grade: "firm", holds: false, relied: ["hold"], source: "reconnaissance of the British camps",
      text: "The British will attack in the east, across the Jordan.",
      truth: "The British attacked on the coast. The preparations in the east were a deception, and the main force had been moved west in the nights before." },
  ],
  gqg_1914_02_marne: [
    { id: "flank", grade: "firm", holds: true, relied: ["attack"], source: "French aerial reconnaissance",
      text: "The German First Army is marching south-east of Paris and has exposed its right flank.",
      truth: "The First Army had turned south-east of Paris, and French aircraft had seen it; its right flank was open to the Paris garrison and the Sixth Army." },
  ],
};

/** The beliefs a report carries, or []. */
export function intelItemsAt(nodeId) {
  return INTEL_ITEMS[nodeId] || [];
}

const key = (nodeId, itemId) => `ix_${nodeId}_${itemId}`;

/** Whether a belief has been checked in this file. */
export function intelChecked(flags, nodeId, itemId) {
  return Boolean(flags && flags[key(nodeId, itemId)]);
}

/** How many checks are left: the file's allowance, less those used, plus any a trusted adviser brought. */
export function intelChecksLeft(flags, hard) {
  const f = flags || {};
  return Math.max(0, (hard ? INTEL.hardChecks : INTEL.checks) + (Number(f.ix_bonus) || 0) - (Number(f.ix_used) || 0));
}

/** The flags after checking one belief (the same flags if it is already checked or none are left). */
export function intelCheck(flags, nodeId, itemId, hard) {
  if (intelChecked(flags, nodeId, itemId) || intelChecksLeft(flags, hard) < 1) return flags;
  return { ...flags, [key(nodeId, itemId)]: true, ix_used: (Number(flags.ix_used) || 0) + 1 };
}

/** True when the order rests on a belief that is false and has not been checked: its dial shows the belief's odds. Never in easy mode. */
export function intelFogged(nodeId, choice, flags, easy) {
  if (easy || !choice) return false;
  return intelItemsAt(nodeId).some((it) => !it.holds && it.relied.includes(choice.id) && !intelChecked(flags, nodeId, it.id));
}

/** The odds the belief would give: the real odds, `believedShift` points better (never past 95). Same shape as orderOdds. */
export function intelBelievedOdds(odds) {
  if (!odds) return odds;
  const pct = Math.min(95, odds.pct + INTEL.believedShift);
  return { ...odds, pct, word: ODDS_BANDS.find((b) => pct < b.max).word };
}

/**
 * The edge for an order given on checked intelligence: some belief at this report was checked and found false, and the order does not rest on it.
 * An impact ({ will: 1 }) or null. Easy mode shows the truth for nothing, so it earns none.
 */
export function intelEdge(nodeId, choice, flags, easy) {
  if (easy || !choice) return null;
  const refuted = intelItemsAt(nodeId).filter((it) => !it.holds && intelChecked(flags, nodeId, it.id));
  if (!refuted.length) return null;
  return refuted.every((it) => !it.relied.includes(choice.id)) ? { ...INTEL.edge } : null;
}
