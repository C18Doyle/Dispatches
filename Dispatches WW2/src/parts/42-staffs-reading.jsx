const INTEL = { checks: 3, hardChecks: 2 };
// THE STAFF'S READING (the fog of war of 1914's 68-intel.jsx, for 1940)
//
// A report tells what the headquarters knows, and sometimes what it knows is wrong: the staff that thought the Red Army a colossus of clay, the one that expected the
// main Soviet blow in the south, the one that thought the Greeks would not fight. A few reports carry such beliefs (INTEL_ITEMS), each with the grade the staff gave it,
// whether it holds, and what the truth was. The grade is no guide: firm beliefs have been wrong and doubtful ones right.
//
// The player may ask to SEE THE EVIDENCE on a belief, spending one of a few checks for the file (INTEL.checks; INTEL.hardChecks in Führer-style hard mode), and is told
// whether it holds. This changes NOTHING in the rules: no roll, no meter and no ending reads it (that is what check-staffs-reading proves); it is a thing to know when
// choosing, and the orders that rest on a belief say so. In easy mode every belief is shown with its verdict from the start, at no cost.
// The beliefs are the record's (claims/staffs-reading.json); `relied` names the orders (by position in the report's list) that rest on the belief.

/** { [campaignId]: { [nodeId]: [{ id, text, grade, holds, truth, source, relied: [orderIndex] }] } } */
const INTEL_ITEMS = {
  german: {
    caseYellow40: [
      { id: "dyle", grade: "firm", holds: true, relied: [0], source: "OKH's appreciation of the Allied deployment",
        text: "The French and British armies will move forward into Belgium as soon as the attack opens, to meet it on the line of the Dyle.",
        truth: "On 10 May the best of the Allied armies, the French First Army Group and the British Expeditionary Force, did advance into Belgium under Plan D, and the French Seventh Army went north towards Breda." },
    ],
    barbarossa41: [
      { id: "clay", grade: "firm", holds: false, relied: [0], source: "the assessment of Fremde Heere Ost",
        text: "The Red Army is a colossus with feet of clay: its officers purged, its tanks obsolete, it will break in a single season.",
        truth: "Halder wrote in August 1941 that the army had reckoned with about 200 Soviet divisions and had already counted 360. The Red Army was far larger than the staff had allowed for, and it did not break in a season." },
    ],
    bagration44: [
      { id: "south", grade: "firm", holds: false, relied: [0], source: "Fremde Heere Ost under Gehlen",
        text: "The main Soviet blow of the summer will fall in the south, against Army Group North Ukraine, towards Romania and the Balkans.",
        truth: "The main blow, Operation Bagration, opened on 22 June 1944 against Army Group Centre, and in the weeks that followed that army group lost most of its strength." },
    ],
  },
  soviet: {
    plan40: [
      { id: "south", grade: "firm", holds: false, relied: [0], source: "Stalin's own reading of what Hitler wants",
        text: "The main German blow will fall in the south, for the grain of Ukraine and the coal of the Donbas.",
        truth: "In June 1941 the German weight was in the centre: Army Group Centre had two of the four panzer groups and drove for Minsk and Smolensk, while Army Group South attacked with one." },
    ],
    memo41: [
      { id: "notthisyear", grade: "firm", holds: false, relied: [2], source: "Stalin's own judgement, and the reports that fitted it",
        text: "Germany will not attack this summer while its war with Britain is still unfinished.",
        truth: "Germany attacked on 22 June 1941, just over five weeks after the memorandum, with more than three million men." },
    ],
    kurskDefense43: [
      { id: "twosides", grade: "firm", holds: true, relied: [0], source: "intelligence passed to Stavka in the spring",
        text: "The Germans will attack the Kursk salient from the north and from the south at once, early in July.",
        truth: "Operation Citadel opened on 5 July 1943 from both sides of the salient, Army Group Centre from the north and Army Group South from the south." },
    ],
  },
  allied: {
    narvik40: [
      { id: "time", grade: "doubtful", holds: false, relied: [0], source: "the War Cabinet's reading in April",
        text: "The decisive fighting in France is still some time away, so Norway can be reinforced without risk to the main front.",
        truth: "The German attack in the west opened on 10 May and the Meuse was crossed at Sedan on 13 and 14 May. The Allied force at Narvik was withdrawn in the first week of June to meet the crisis in France." },
    ],
    malaya41: [
      { id: "deter", grade: "doubtful", holds: false, relied: [0], source: "the Prime Minister's own reading",
        text: "A modern battleship at Singapore will make Tokyo stop and count, and so deter an attack.",
        truth: "Japan attacked Pearl Harbor and Malaya on 7 and 8 December. The Prince of Wales and the Repulse sailed to meet the landings and were sunk by aircraft off the coast of Malaya on 10 December, with no fighter cover." },
    ],
    marketGarden44: [
      { id: "weak", grade: "doubtful", holds: false, relied: [0], source: "the army group's intelligence summaries",
        text: "The German forces round Arnhem are weak and second-rate, and will not stand against an airborne landing.",
        truth: "The 9th and 10th SS Panzer Divisions, battered but still armoured, were refitting in the area, and Dutch reports and air photographs had said so. They were the force that met the 1st Airborne Division." },
    ],
  },
  italy: {
    greeceDecision40: [
      { id: "ten", grade: "firm", holds: false, relied: [0], source: "the promise of General Visconti Prasca to Mussolini",
        text: "The Greek forces in Epirus will be finished off in ten to fifteen days, and the Greeks will not fight in earnest.",
        truth: "The Italian advance was halted inside Greek territory by mid-November, and the Greek counteroffensive from 14 November pushed it back towards Albania, where it ended in January 1941." },
    ],
    compass40: [
      { id: "camps", grade: "doubtful", holds: false, relied: [1], source: "the Tenth Army's own dispositions",
        text: "The fortified camps support one another, and the gaps between them can be watched by patrols.",
        truth: "The British attacked on 9 December through the gap and took the camps one at a time, Nibeiwa first, from the rear. Within days the Tenth Army was beaten and tens of thousands of its men were prisoners." },
    ],
  },
};

/** The beliefs a report carries, or []. */
function intelItemsAt(campaignId, nodeId) {
  return ((INTEL_ITEMS[campaignId] || {})[nodeId]) || [];
}

const intelKey = (nodeId, itemId) => "ix_" + nodeId + "_" + itemId;

/** Whether a belief has been checked in this file. */
function intelChecked(flags, nodeId, itemId) {
  return Boolean(flags && flags[intelKey(nodeId, itemId)]);
}

/** How many checks are left: the file's allowance less those used. */
function intelChecksLeft(flags, hard) {
  const f = flags || {};
  return Math.max(0, (hard ? INTEL.hardChecks : INTEL.checks) - (Number(f.ix_used) || 0));
}

/** The flags after checking one belief (the same flags if it is already checked or none are left). */
function intelCheck(flags, nodeId, itemId, hard) {
  if (intelChecked(flags, nodeId, itemId) || intelChecksLeft(flags, hard) < 1) return flags;
  return { ...flags, [intelKey(nodeId, itemId)]: true, ix_used: (Number(flags.ix_used) || 0) + 1 };
}

const INTEL_GRADE_TAG = { firm: T("Reported as firm"), doubtful: T("Doubtful"), poor: T("Poor") };

/** The beliefs of a report, each with its grade and source and a button to see the evidence; once seen (at once, in easy mode) whether it held and what the truth was. */
function IntelPanel({ campaignId, nodeId, flags, easy, hard, onCheck, accent }) {
  const items = intelItemsAt(campaignId, nodeId);
  if (!items.length) return null;
  const left = intelChecksLeft(flags, hard);
  return (
    <section className="mb-4 border-l-4 pl-3" style={{ borderColor: accent, fontFamily: "'IBM Plex Mono', monospace" }} aria-label={t("What the staff believes")}>
      <div className="text-xs uppercase tracking-[0.25em] mb-1 text-[#000000] font-semibold">{t("What the staff believes")}</div>
      <ul className="list-none m-0 p-0">
        {items.map((it) => {
          const known = easy || intelChecked(flags, nodeId, it.id);
          return (
            <li key={it.id} className="mb-2 text-sm text-[#000000]">
              <span className="inline-block mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]">{t(INTEL_GRADE_TAG[it.grade])}</span>
              {it.text} <span className="opacity-70">{t("Source: {itSource}.", { itSource: it.source })}</span>
              {known ? (
                <p className="m-0 mt-1 text-sm">
                  <b>{it.holds ? t("The evidence leans towards it.") : t("The evidence leans against it.")}</b> {it.truth}
                </p>
              ) : (
                <p className="m-0 mt-1">
                  <button
                    onClick={() => onCheck(it.id)}
                    disabled={left < 1}
                    className="border-2 px-3 py-1 uppercase tracking-widest text-xs hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] disabled:opacity-50"
                    style={{ borderColor: accent, fontFamily: "Oswald, sans-serif" }}
                  >
                    {left < 1 ? t("Show the evidence: no checks left") : t("Show the evidence ({left} left)", { left })}
                  </button>
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** The line under an order that rests on a belief: that it does, and how it stands. "" when the order rests on none. */
function intelRests(campaignId, nodeId, orderIndex, flags, easy) {
  const items = intelItemsAt(campaignId, nodeId).filter((it) => it.relied.includes(orderIndex));
  if (!items.length) return "";
  const states = items.map((it) => (easy || intelChecked(flags, nodeId, it.id) ? (it.holds ? "held" : "wrong") : "open"));
  if (states.includes("wrong")) return t("Rests on a belief the evidence goes against");
  if (states.includes("open")) return t("Rests on a belief the staff has not tested");
  return t("Rests on a belief the evidence supports");
}
