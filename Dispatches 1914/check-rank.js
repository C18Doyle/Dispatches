/** The command rank (59-rank.jsx).
 *  Every ending has a tier; the five parts add up to 100 at their best; a best-possible run reaches the top rank and an easy one cannot;
 *  and a ruined run does not reach a high one. Also: every campaign has an easy-mode name. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const problems = [];
let checked = 0;

const endings = E.buildEndings();
for (const e of endings) {
  checked++;
  const t = E.ENDING_TIER[e.id];
  if (![0, 1, 2, 3].includes(t)) problems.push(`${e.id}: no tier (0 to 3) in ENDING_TIER`);
}
for (const id of Object.keys(E.ENDING_TIER)) {
  checked++;
  if (!endings.some((e) => e.id === id)) problems.push(`ENDING_TIER names "${id}", which is not an ending`);
}
for (const cid of E.CAMPAIGN_IDS) {
  checked++;
  if (!E.EASY_NAMES[cid]) problems.push(`${cid}: no easy-mode name in EASY_NAMES`);
}

const best = E.rankFor({ campaignId: "ohl", endingId: "ohl_end_intact", meters: { manpower: 10, munitions: 10, will: 10 }, hardState: { enabled: true, erosion: 0 }, easy: false, taken: [] });
checked++;
if (best.parts.reduce((s, p) => s + p.max, 0) !== 100) problems.push("the five parts do not add up to 100 at their best");
if (best.score !== 100) problems.push(`a perfect hard run scores ${best.score}, not 100`);
if (best.rank !== E.RANKS[E.RANKS.length - 1].title) problems.push(`a perfect hard run is "${best.rank}", not the top rank`);

const easy = E.rankFor({ campaignId: "ohl", endingId: "ohl_end_intact", meters: { manpower: 10, munitions: 10, will: 10 }, hardState: { enabled: false, erosion: 0 }, easy: true, taken: [] });
checked++;
if (easy.rank === E.RANKS[E.RANKS.length - 1].title) problems.push("a perfect easy run reaches the top rank");
if (easy.rank !== E.RANKS[E.EASY_RANK_CAP].title) problems.push(`a perfect easy run is "${easy.rank}", not the easy cap`);

const ruin = E.rankFor({ campaignId: "ohl", endingId: "ohl_end_relieved", meters: { manpower: -10, munitions: -10, will: -10 }, hardState: { enabled: false, erosion: 0 }, easy: false, taken: [] });
checked++;
if (ruin.rank !== E.RANKS[0].title) problems.push(`a ruined standard run is "${ruin.rank}", not the lowest rank`);

// monotone in the ending tier
const at = (id) => E.rankFor({ campaignId: "gqg", endingId: id, meters: { manpower: 0, munitions: 0, will: 0 }, hardState: { enabled: false, erosion: 0 }, easy: false, taken: [] }).score;
checked++;
if (!(at("gqg_end_armybreaks") < at("gqg_end_costlier") && at("gqg_end_costlier") < at("gqg_end_victory") && at("gqg_end_victory") < at("gqg_end_intact"))) {
  problems.push("the score does not rise with the ending tier");
}

process.exit(report("check-rank", problems, checked) ? 1 : 0);
