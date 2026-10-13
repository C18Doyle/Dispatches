/** The command rank (59-rank.jsx).
 *  Every ending has a tier and a ground (0 to 3); the seven parts add up to 100 at their best; a best-possible run reaches the top rank and an easy one cannot;
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
  if (![0, 1, 2, 3].includes(E.ENDING_GROUND[e.id])) problems.push(`${e.id}: no ground (0 to 3) in ENDING_GROUND`);
}
for (const id of Object.keys(E.ENDING_TIER)) {
  checked++;
  if (!endings.some((e) => e.id === id)) problems.push(`ENDING_TIER names "${id}", which is not an ending`);
}
for (const id of Object.keys(E.ENDING_GROUND)) {
  checked++;
  if (!endings.some((e) => e.id === id)) problems.push(`ENDING_GROUND names "${id}", which is not an ending`);
}
for (const cid of E.CAMPAIGN_IDS) {
  checked++;
  if (!E.EASY_NAMES[cid]) problems.push(`${cid}: no easy-mode name in EASY_NAMES`);
}

const trustedFlags = Object.fromEntries(E.CAMPAIGNS.ohl.advisors.slice(0, 3).map((a) => ["tr_" + a.id, 3]));
const best = E.rankFor({ campaignId: "ohl", endingId: "ohl_end_negotiated", meters: { manpower: 10, munitions: 10, will: 10 }, hardState: { enabled: true, erosion: 0 }, easy: false, taken: [], flags: trustedFlags });
checked++;
if (best.parts.reduce((s, p) => s + p.max, 0) !== 100) problems.push("the seven parts do not add up to 100 at their best");
if (best.score !== 100) problems.push(`a perfect hard run scores ${best.score}, not 100`);
if (best.rank !== E.RANKS[E.RANKS.length - 1].title) problems.push(`a perfect hard run is "${best.rank}", not the top rank`);

const easy = E.rankFor({ campaignId: "ohl", endingId: "ohl_end_negotiated", meters: { manpower: 10, munitions: 10, will: 10 }, hardState: { enabled: false, erosion: 0 }, easy: true, taken: [], flags: trustedFlags });
checked++;
if (easy.rank === E.RANKS[E.RANKS.length - 1].title) problems.push("a perfect easy run reaches the top rank");
if (easy.rank !== E.RANKS[E.EASY_RANK_CAP].title) problems.push(`a perfect easy run is "${easy.rank}", not the easy cap`);

const ruin = E.rankFor({ campaignId: "ohl", endingId: "ohl_end_relieved", meters: { manpower: -10, munitions: -10, will: -10 }, hardState: { enabled: false, erosion: 0 }, easy: false, taken: [] });
checked++;
if (ruin.rank !== E.RANKS[0].title) problems.push(`a ruined standard run is "${ruin.rank}", not the lowest rank`);

// territory and power are most of the score: ground and the meters each move it more than the tier does
const same = (over) => E.rankFor({ campaignId: "gqg", endingId: "gqg_end_victory", meters: { manpower: 0, munitions: 0, will: 0 }, hardState: { enabled: false, erosion: 0 }, easy: false, taken: [], ...over }).score;
checked++;
const groundSwing = E.rankFor({ campaignId: "gqg", endingId: "gqg_end_paris", meters: { manpower: 0, munitions: 0, will: 0 }, hardState: { enabled: false, erosion: 0 }, easy: false, taken: [] }).score;
if (!(same({}) - groundSwing >= 30)) problems.push("a lost heartland and a recovered one are less than 30 points apart");
if (!(same({ meters: { manpower: 10, munitions: 10, will: 10 } }) - same({ meters: { manpower: -10, munitions: -10, will: -10 } }) >= 25)) problems.push("full meters and empty ones are less than 25 points apart");
// the staff part: a lost adviser costs points, a trusted one adds them
const lost = same({ flags: { ["tr_" + E.CAMPAIGNS.gqg.advisors[0].id]: -3 } });
const trusted3 = same({ flags: Object.fromEntries(E.CAMPAIGNS.gqg.advisors.slice(0, 3).map((a) => ["tr_" + a.id, 3])) });
checked++;
if (!(lost < same({}) && same({}) < trusted3)) problems.push("the staff part does not fall with a lost adviser and rise with trusted ones");

// monotone in the ending tier
const at = (id) => E.rankFor({ campaignId: "gqg", endingId: id, meters: { manpower: 0, munitions: 0, will: 0 }, hardState: { enabled: false, erosion: 0 }, easy: false, taken: [] }).score;
checked++;
if (!(at("gqg_end_armybreaks") < at("gqg_end_costlier") && at("gqg_end_costlier") < at("gqg_end_victory") && at("gqg_end_victory") < at("gqg_end_intact"))) {
  problems.push("the score does not rise with the ending tier");
}

process.exit(report("check-rank", problems, checked) ? 1 : 0);
