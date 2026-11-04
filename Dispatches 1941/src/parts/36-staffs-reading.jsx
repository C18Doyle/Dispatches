const INTEL = { checks: 3, hardChecks: 2 };
// THE STAFF'S READING (ported from Dispatches 1940, which took it from 1914's fog of war)
//
// A report tells what the headquarters knows, and sometimes what it knows is wrong: the staff that thought the American carriers would stay away from Midway, the one that
// thought Peleliu would fall in days, the one that trusted the Mark 14. A few reports carry such beliefs (INTEL_ITEMS), each with the grade the staff gave it, whether it
// holds, and what the truth was. The grade is no guide: firm beliefs have been wrong and doubtful ones right.
//
// The player may ask to SEE THE EVIDENCE on a belief, spending one of a few checks for the file (INTEL.checks; INTEL.hardChecks in the hard modes), and is told whether it
// holds. This changes NOTHING in the rules: no roll, no meter and no ending reads it (tools/check-staffs-reading.mjs proves it); it is a thing to know when choosing, and the
// orders that rest on a belief say so. In easy mode every belief is shown with its verdict from the start, at no cost.
// The beliefs are the record's (claims/staffs-reading.json); `relied` names the orders (by position in the report's list) that rest on the belief.

/** { [campaignId]: { [nodeId]: [{ id, text, grade, holds, truth, source, relied: [orderIndex] }] } } */
const INTEL_ITEMS = {
  japan: {
    pearlHarbor41: [
      { id: "anchor", grade: "firm", holds: true, relied: [0, 2], source: "the consulate's reports from Honolulu",
        text: "The American battleships will lie at anchor at Pearl Harbor on a Sunday morning, with no warning given and no ship ready for sea.",
        truth: "On 7 December the battleships were at their moorings and eight of them were hit. 2,403 Americans were killed. The three American carriers were not in the harbor." },
      { id: "year", grade: "doubtful", holds: false, relied: [0, 2], source: "Yamamoto's own estimate",
        text: "A blow at Pearl Harbor will leave the American fleet unable to act in the Pacific for a year or more.",
        truth: "The carriers survived, and the shipyards, repair shops and oil tanks were untouched. Six of the eight battleships that were hit were repaired and returned to service, and American carriers were fighting at Coral Sea within five months." },
    ],
    midway42: [
      { id: "carriers", grade: "firm", holds: false, relied: [0, 2], source: "the Combined Fleet staff's plan",
        text: "The American carriers will not come out until after the landing on Midway, and at most one or two of them will be in the area.",
        truth: "Station HYPO had read the plan. Nimitz had three carriers, Enterprise, Hornet and Yorktown, waiting north east of Midway before the Japanese carriers arrived, and Yorktown had been patched in seventy-two hours at Pearl Harbor." },
    ],
    guadalcanal42: [
      { id: "small", grade: "firm", holds: false, relied: [0], source: "the Army's estimate in August",
        text: "The Americans on Guadalcanal are few, and a detachment of a few hundred men can retake the airfield before reinforcements come.",
        truth: "Ichiki's first echelon, about 900 men, attacked at the Tenaru river on the night of 20 to 21 August against prepared Marine positions, and most of it was killed." },
    ],
    leyteGulf44: [
      { id: "bait", grade: "doubtful", holds: true, relied: [0], source: "Ozawa's plan for the decoy force",
        text: "The American fast carriers will go north after Ozawa's carriers and leave San Bernardino Strait uncovered.",
        truth: "Halsey took the Third Fleet's carriers north on 24 October. Ozawa's carriers were sunk off Cape Engano on 25 October, and Kurita came through the strait that night." },
    ],
    okinawa45: [
      { id: "break", grade: "firm", holds: false, relied: [0], source: "the Fifth Air Fleet's estimate",
        text: "Mass attacks by suicide aircraft will force the American fleet to break off the invasion of Okinawa.",
        truth: "The Kikusui attacks sank thirty or more American ships, damaged hundreds and killed nearly five thousand sailors. The fleet stayed at Okinawa until the island was taken in June." },
    ],
  },
  alliedPacific: {
    wakeIslandRelief41: [
      { id: "carriers", grade: "doubtful", holds: true, relied: [0], source: "radio intelligence at Pearl Harbor",
        text: "Two Japanese carriers are close to Wake and will cover the second landing.",
        truth: "Soryu and Hiryu, detached from the Pearl Harbor force, struck Wake with their aircraft on 21 December and stood off the island while the landing went in on 23 December." },
    ],
    coralSeaMidwayAllied42: [
      { id: "af", grade: "doubtful", holds: true, relied: [0], source: "Station HYPO under Commander Rochefort",
        text: "The Japanese target is Midway, called AF in their traffic, and the attack will come in the first days of June.",
        truth: "The Japanese carriers were found north west of Midway on 4 June, as Rochefort's team had said, and four of them were sunk in the battle." },
    ],
    guadalcanalAllied42: [
      { id: "light", grade: "firm", holds: true, relied: [0], source: "coastwatchers and air photographs",
        text: "The Japanese garrison on Guadalcanal is small and mostly construction troops, and the airfield is lightly held.",
        truth: "The Marines landed on 7 August and walked onto the unfinished airfield on the 8th with almost no fighting. The Japanese there had withdrawn into the jungle." },
    ],
    torpedoCrisis43: [
      { id: "sound", grade: "firm", holds: false, relied: [1], source: "the Bureau of Ordnance",
        text: "The Mark 14 torpedo is sound, and the failures the submarines report are errors of approach and handling.",
        truth: "The torpedo ran deeper than it was set, and its exploder did not work as designed. The fleet's own tests found the faults one by one through 1942 and 1943." },
    ],
    tehransPromise43: [
      { id: "entry", grade: "firm", holds: true, relied: [0], source: "Stalin's word to Roosevelt at Tehran",
        text: "The Soviet Union will enter the war against Japan once Germany has been defeated.",
        truth: "The Soviet Union declared war on Japan on 8 August 1945, three months after Germany's surrender, and attacked Manchuria the next day." },
    ],
    peleliuDecision44: [
      { id: "days", grade: "firm", holds: false, relied: [0], source: "the First Marine Division's planning",
        text: "Peleliu will be taken in two to four days, and the airfield with it.",
        truth: "The Japanese had fortified the ridges in depth. The fighting lasted from 15 September to 27 November 1944, and the First Marine Division suffered very heavy losses." },
    ],
    iwoJimaAllied45: [
      { id: "gunfire", grade: "doubtful", holds: false, relied: [0], source: "the Navy's schedule for the bombardment",
        text: "Three days of naval gunfire will break the island's defenses before the landing.",
        truth: "Marine planners had asked for ten days. Of about 915 fortified positions on the island, fewer than 200 had been silenced when the Marines landed." },
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

const INTEL_GRADE_TAG = { firm: "Reported as firm", doubtful: "Doubtful", poor: "Poor" };

/** The beliefs of a report, each with its grade and source and a button to see the evidence; once seen (at once, in easy mode) whether it held and what the truth was. */
function IntelPanel({ campaignId, nodeId, flags, easy, hard, onCheck, accent }) {
  const items = intelItemsAt(campaignId, nodeId);
  if (!items.length) return null;
  const left = intelChecksLeft(flags, hard);
  return (
    <section className="mb-4 border-l-4 pl-3" style={{ borderColor: accent, fontFamily: "'IBM Plex Mono', monospace" }} aria-label="What the staff believes">
      <div role="heading" aria-level="2" className="text-xs uppercase tracking-[0.25em] mb-1 text-[#000000] font-semibold">
        What the staff believes
      </div>
      <ul className="list-none m-0 p-0">
        {items.map((it) => {
          const known = easy || intelChecked(flags, nodeId, it.id);
          return (
            <li key={it.id} className="mb-2 text-sm text-[#000000]">
              <span className="inline-block mr-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]">{INTEL_GRADE_TAG[it.grade]}</span>
              {it.text} <span className="opacity-70">Source: {it.source}.</span>
              {known ? (
                <p className="m-0 mt-1 text-sm">
                  <b>{it.holds ? "The evidence leans towards it." : "The evidence leans against it."}</b> {it.truth}
                </p>
              ) : (
                <p className="m-0 mt-1">
                  <button
                    onClick={() => onCheck(it.id)}
                    disabled={left < 1}
                    className="border-2 px-3 py-1 uppercase tracking-widest text-xs [@media(hover:hover)]:hover:bg-[#000000] [@media(hover:hover)]:hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ borderColor: accent, fontFamily: "Oswald, sans-serif" }}
                  >
                    {left < 1 ? "Show the evidence: no checks left" : "Show the evidence (" + left + " left)"}
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
  if (states.includes("wrong")) return "Rests on a belief the evidence goes against";
  if (states.includes("open")) return "Rests on a belief the staff has not tested";
  return "Rests on a belief the evidence supports";
}
