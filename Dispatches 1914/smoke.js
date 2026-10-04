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
  t("every advisor named on a node has a dossier entry", E.allNodes().every(({ campaignId, node }) => (node.advisors || []).every((id) => E.CAMPAIGNS[campaignId].advisors.some((a) => a.id === id && a.dossier))));
}

console.log(`smoke: ${fail} failure${fail===1?"":"s"}`);
process.exit(fail ? 1 : 0);
