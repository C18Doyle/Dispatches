/** Engine smoke test. Real execution, not syntax checks. */
const { loadEngine } = require("./_load.js");
const E = loadEngine(process.argv[2] || "dispatches-greatwar.jsx");
let fail = 0;
const t = (name, cond) => { console.log(`  ${cond ? "ok  " : "FAIL"} ${name}`); if (!cond) fail++; };

t("six campaigns", E.CAMPAIGN_IDS.length === 6);
t("four majors, two minors",
  E.CAMPAIGN_IDS.filter(c => E.CAMPAIGNS[c].tier === "major").length === 4 &&
  E.CAMPAIGN_IDS.filter(c => E.CAMPAIGNS[c].tier === "minor").length === 2);
t("meters clamp at +10", E.clampMeter(999) === 10 && E.clampMeter(-999) === -10);
t("impact clamps", E.applyImpact({manpower:9,munitions:0,will:0},{manpower:5}).manpower === 10);
t("will label is per campaign",
  E.meterLabels("ohl").will === "Home Front" && E.meterLabels("gqg").will === "Army Morale");
t("six distinct will labels",
  new Set(E.CAMPAIGN_IDS.map(c => E.CAMPAIGNS[c].willLabel)).size === 6);
t("six distinct erosion triggers",
  new Set(E.CAMPAIGN_IDS.map(c => E.CAMPAIGNS[c].hardMode.trigger)).size === 6);
t("erosion only fires on the campaign's own trigger",
  E.erosionFromChoice("ohl", { erodes: E.EROSION_TRIGGERS.SPEND_WILL }) === 1 &&
  E.erosionFromChoice("ohl", { erodes: E.EROSION_TRIGGERS.OVEREXTEND }) === 0);
t("hard mode off means no erosion",
  E.applyErosion({enabled:false,erosion:0}, "ohl", {erodes:"spend_will"}).erosion === 0);
t("hard mode forces at the campaign cap", E.hardModeForcesEnding({enabled:true,erosion:E.erosionMax("ohl")}, "ohl") === true);
t("hard mode does not force below the cap", E.hardModeForcesEnding({enabled:true,erosion:E.erosionMax("ohl") - 1}, "ohl") === false);
t("erosion cap is reachable", E.erosionMax("ohl") <= 10);
t("registries derive from live data", E.nodeTotal() === Object.values(E.CAMPAIGNS).reduce((n,c)=>n+Object.keys(c.nodes).length,0));
t("draft content is flagged as draft", E.allNodes().every(x => !x.node.draft || x.node.draft === true));
t("atlas includes every node", Object.keys(E.buildNodeAtlas()).length === E.nodeTotal());
t("node id pattern accepts valid", E.isValidNodeId("ohl_1917_03_usw"));
t("node id pattern rejects invalid", !E.isValidNodeId("node_12"));
t("ending id pattern", E.isValidNodeId("gqg_end_mutiny"));
t("rolls are deterministic under a seeded rng",
  E.rollUncertain([{weight:50,id:"a"},{weight:50,id:"b"}], () => 0.1).id === "a");
t("nextIf sees POST-choice meters", (() => {
  const r = E.chooseNext("ohl",
    { impact:{manpower:-5}, nextIf:(m)=> m.manpower <= -5 ? "hit" : null, next:"miss" },
    {}, E.emptyMeters(), E.emptyHardState());
  return r.nextId === "hit";
})());
t("uncertain branch next beats nextIf and next", (() => {
  const r = E.chooseNext("ohl",
    { uncertain:[{weight:100,next:"branch"}], nextIf:()=> "ifpath", next:"fallthrough" },
    {}, E.emptyMeters(), E.emptyHardState());
  return r.nextId === "branch";
})());
t("calendars are authentic per campaign",
  E.CAMPAIGNS.stavka.calendar === "julian" && E.CAMPAIGNS.ohl.calendar === "gregorian");
t("flag prefixes are unique",
  new Set(E.CAMPAIGN_IDS.map(c => E.CAMPAIGNS[c].flagPrefix)).size === 6);
t("ottoman blocked on spec §9", E.CAMPAIGNS.otto.blockingIssue.resolved === false);


// ---- historical note (outcome screen) ----
{
  let decisions = 0, bad = 0, withDispute = 0;
  for (const { campaignId, nodeId } of E.allNodes()) {
    const node = E.resolveNode(nodeId, {}, E.emptyMeters(), E.emptyHardState());
    if (node.ending) { if (E.historicalNote(node, {}) !== null) bad++; continue; }
    for (const ch of node.choices) {
      decisions++;
      const n = E.historicalNote(node, ch);
      const hist = node.choices.find((c) => c.historical);
      if (!n || !n.text) { bad++; continue; }
      if (ch.historical && !n.text.startsWith("The command gave this order.")) bad++;
      if (!ch.historical && !n.text.includes(hist.label.replace(/[.!?]+$/, ""))) bad++;
      if (ch.dispute) { withDispute++; if (!n.text.includes(ch.dispute)) bad++; }
    }
  }
  t(`historical note builds for all ${decisions} choices (${withDispute} with a dispute), none for endings`, bad === 0 && decisions > 0);
}
// ---- saved run, war record, settings ----
{
  const cid = "ohl";
  const start = E.CAMPAIGNS[cid].startNode;
  const snap = E.snapshotRun({ campaignId: cid, nodeId: start, flags: {}, meters: E.emptyMeters(), hardState: E.emptyHardState(), visited: [start] });
  t("a fresh run's snapshot is a valid save", E.validateSave(snap) === true);
  t("a save pointing at a missing node is refused", E.validateSave({ ...snap, nodeId: "ohl_1914_99_gone" }) === false);
  t("a save from another schema version is refused", E.validateSave({ ...snap, schemaVersion: E.SAVE_SCHEMA_VERSION + 1 }) === false);
  t("a save whose node belongs to another campaign is refused", E.validateSave({ ...snap, campaignId: "gqg" }) === false);
  let r = E.emptyRecord();
  const r2 = E.noteNodeSeen(r, cid, start, ["moltke"]);
  t("the record notes a node and its advisers once", r2.nodes[cid].length === 1 && r2.advisers[cid][0] === "moltke" && E.noteNodeSeen(r2, cid, start, ["moltke"]) === r2);
  const r3 = E.noteEnding(r2, "ohl_end_armistice", true);
  t("the record counts endings and hard-mode runs", r3.endings.length === 1 && r3.runs === 1 && r3.hardRuns === 1);
  t("settings fall back to the default on junk", E.sanitizeSettings({ schemaVersion: 1, textSize: "huge" }).textSize === "s" && E.sanitizeSettings(null).textSize === "s");
  t("sound is off by default and only a literal true turns it on", E.defaultSettings().sound === false && E.sanitizeSettings({ schemaVersion: 1, sound: "yes" }).sound === false && E.sanitizeSettings({ schemaVersion: 1, sound: true }).sound === true);
  t("every advisor named on a node has a dossier entry", E.allNodes().every(({ campaignId, node }) => (node.advisors || []).every((id) => E.CAMPAIGNS[campaignId].advisors.some((a) => a.id === id && a.dossier))));
}

{
  const withQuote = [];
  for (const { nodeId, node } of E.allNodes()) {
    const r = E.resolveNode(nodeId, {}, E.emptyMeters(), E.emptyHardState());
    for (const ch of r.choices || []) if (ch.attested) withQuote.push(nodeId + "/" + ch.id);
  }
  t("attested quotations survive node resolution and every one is short and cited", withQuote.length >= 9 && E.allNodes().every(({ node }) => (node.choices || []).every((ch) => !ch.attested || (ch.attested.source && ch.attested.text.split(/s+/).length <= 25))));
}

{
  // Echoes between commands (docs/SAVES.md: bookkeeping in the war record)
  const r0 = E.emptyRecord();
  t("a fresh record has no echoes and seeds no flags", Object.keys(r0.xc).length === 0 && Object.keys(E.echoSeed(r0)).length === 0);
  const r1 = E.noteEchoes(r0, { ohl_usw: "restricted", xc_usw: "restricted" });
  t("only xc_ flags are remembered", r1.xc.xc_usw === "restricted" && Object.keys(r1.xc).length === 1 && E.echoSeed(r1).xc_usw === "restricted");
  t("noting the same echo twice returns the same record", E.noteEchoes(r1, { xc_usw: "restricted" }) === r1);
  const written = new Set(), values = {};
  for (const { node } of E.allNodes()) for (const ch of node.choices || []) for (const sf of [ch.setFlags, ...(ch.uncertain || []).map((b) => b.setFlags)])
    for (const [k, v] of Object.entries(sf || {})) if (k.startsWith("xc_")) { written.add(k); (values[k] = values[k] || new Set()).add(v); }
  t("every registered echo is written by a choice, with its historical value among them", Object.keys(E.ECHOES).every((k) => written.has(k) && values[k].has(E.ECHOES[k].historical)) && [...written].every((k) => E.ECHOES[k]));
  // The historical value of an echo changes no text anywhere: a player who follows the record never sees one.
  const same = E.allNodes().every(({ nodeId }) => Object.entries(E.ECHOES).every(([k, e]) => {
    const a = E.resolveNode(nodeId, {}, E.emptyMeters(), E.emptyHardState());
    const b = E.resolveNode(nodeId, { [k]: e.historical }, E.emptyMeters(), E.emptyHardState());
    return JSON.stringify([a.situation, a.context, a.title]) === JSON.stringify([b.situation, b.context, b.title]);
  }));
  t("the historical value of every echo leaves every node's text unchanged", same);
  const differs = Object.entries(E.ECHOES).every(([k, e]) => Object.keys(e.values).filter((v) => v !== e.historical).every((v) =>
    E.allNodes().some(({ nodeId }) => { const a = E.resolveNode(nodeId, {}, E.emptyMeters(), E.emptyHardState()); const b = E.resolveNode(nodeId, { [k]: v }, E.emptyMeters(), E.emptyHardState()); return a.situation !== b.situation; })));
  t("every departure from the record is read by some node", differs);
}

{
  // Strain: a command short of what a contested order is about finds it harder (55-choose.jsx)
  const roll = { id: "x", impact: { manpower: -1 }, uncertain: [
    { weight: 60, impact: { manpower: 2 }, next: "good" },
    { weight: 40, impact: { manpower: -4 }, next: "bad" },
  ] };
  const at = (m) => E.strainedUncertain(roll, { manpower: m, munitions: 0, will: 0 });
  t("no strain at 0, at -2", at(0).points === 0 && at(-2).points === 0 && at(0).uncertain === roll.uncertain);
  t("each point short of -2 moves 3 points from the best outcome to the worst", at(-3).points === 3 && at(-3).uncertain[0].weight === 57 && at(-3).uncertain[1].weight === 43);
  t("strain is capped at 15 points and the weights still add to 100", at(-10).points === 15 && at(-10).uncertain.reduce((s, b) => s + b.weight, 0) === 100);
  t("strain never takes the best outcome below its floor", E.strainedUncertain({ ...roll, uncertain: [{ weight: 8, impact: { manpower: 2 } }, { weight: 92, impact: { manpower: -4 } }] }, { manpower: -10, munitions: 0, will: 0 }).uncertain[0].weight === 5);
  t("strain follows the meter the order is about", E.strainMeterOf(roll) === "manpower" && E.strainedUncertain(roll, { manpower: 0, munitions: -9, will: -9 }).points === 0);
  t("an order with equal outcomes is not strained", E.strainedUncertain({ uncertain: [{ weight: 50, impact: { will: 1 } }, { weight: 50, impact: { will: 1 } }] }, { manpower: 0, munitions: 0, will: -9 }).points === 0);
  t("the roll uses the strained weights", E.chooseNext("ohl", roll, {}, { manpower: -10, munitions: 0, will: 0 }, E.emptyHardState(), () => 0.5).branch.next === "bad");
  t("without strain the same roll goes the other way", E.chooseNext("ohl", roll, {}, E.emptyMeters(), E.emptyHardState(), () => 0.5).branch.next === "good");
  const pv = E.previewImpact(roll);
  t("the easy mode's preview gives the range over a contested order's outcomes", pv.manpower[0] === -4 && pv.manpower[1] === 2 && !pv.will);
  t("and the plain effect of a settled order", JSON.stringify(E.previewImpact({ impact: { will: -2, manpower: 1 } })) === JSON.stringify({ manpower: [1, 1], will: [-2, -2] }));
  // The save carries the easy mode and the take-back history, and an older save without them still validates.
  const snap = E.snapshotRun({ campaignId: "ohl", nodeId: E.CAMPAIGNS.ohl.startNode, flags: {}, meters: E.emptyMeters(), hardState: E.emptyHardState(), visited: [], easy: true, taken: [{ node: "a", choice: "b" }], history: [{ nodeId: "x" }] });
  t("a snapshot keeps easy, taken and history", snap.easy === true && snap.taken.length === 1 && snap.history.length === 1);
  const old = { ...snap }; delete old.easy; delete old.taken; delete old.history;
  t("a save made before the easy mode still validates", E.validateSave(snap) && E.validateSave(old));
  t("rewind history is capped", E.snapshotRun({ campaignId: "ohl", nodeId: "n", flags: {}, meters: E.emptyMeters(), hardState: E.emptyHardState(), visited: [], history: new Array(E.REWIND_LIMIT + 10).fill({}) }).history.length === E.REWIND_LIMIT);
}

console.log(`smoke: ${fail} failure${fail===1?"":"s"}`);
process.exit(fail ? 1 : 0);
