// Emits src/content/sherlock/{config,events,flavor}.json from the authoring modules. Usage: node build.mjs <game folder>
import { writeFileSync } from "node:fs";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { act1 } from "./act1.mjs";
import { act1b } from "./act1b.mjs";
import { act1c } from "./act1c.mjs";
import { yard } from "./yard.mjs";
import { yard2 } from "./yard2.mjs";
import { street } from "./street.mjs";
import { street2 } from "./street2.mjs";
import { continent } from "./continent.mjs";
import { continent2 } from "./continent2.mjs";
import { mycroft } from "./mycroft.mjs";
import { endings } from "./endings.mjs";
import { newEndings, replacedEmptyGrave, frontVariants } from "./endings2.mjs";
import { ruinVariants } from "./endings3.mjs";
import { rework } from "./rework.mjs";
import { applyStrand } from "./strand.mjs";
import { extras, extraOptions } from "./extras.mjs";
import { moreNodes, moreOptions, tweakFinales } from "./more.mjs";
import { leagueNodes, leagueEndings, leagueInterlude, leagueTrigger, leagueFlavor } from "./league.mjs";
import { hiddenOptions, hiddenEndings, hiddenFlavor } from "./hidden.mjs";
import { reactionInterludes, reactionTriggers, reactionEchoes, reactionFlagNotes } from "./reactions.mjs";
import { shelf, caseNodes, caseEndings, caseInterludes, caseTriggers, caseFlavor } from "./cases.mjs";
import { interludes, triggers } from "./meta.mjs";
import { flavor } from "./flavor.mjs";
import { flavor2 } from "./flavor2.mjs";
import { opt, flag, res, all, any, not } from "./lib.mjs";

// The generator is the source of the three content files. `npm run gen` rewrites them; `npm run check:gen` fails if the committed files differ from what it would write.
const check = process.argv.includes("--check");
const out = process.argv.find((a, i) => i >= 2 && !a.startsWith("--")) ?? join(dirname(fileURLToPath(import.meta.url)), "..");
const ax = (a, v) => ({ axis: a, op: ">=", value: v });
const HARD = { difficulty: "HARD" };

// ───────────── scenes ─────────────
const REPLACED = new Set(["Y9", "S8"]); // the single final scenes of the Yard and street roads, now three-step finales
const nodes = {};
for (const n of [...act1, ...act1b, ...act1c, ...yard.filter((n) => !REPLACED.has(n.id)), ...yard2, ...street.filter((n) => !REPLACED.has(n.id)), ...street2, ...continent, ...continent2, ...mycroft]) {
  if (nodes[n.id]) throw new Error("duplicate node " + n.id);
  nodes[n.id] = n;
}
for (const n of extras) nodes[n.id] = n;
const need = (id) => {
  if (!nodes[id]) throw new Error("missing node " + id);
  return nodes[id];
};

/** Every option (and roll branch) of a scene that leads to `from` now leads to `to`. */
function retarget(id, from, to) {
  let n = 0;
  for (const o of need(id).options) {
    if (o.nextNodeId === from) { o.nextNodeId = to; n++; }
    if (o.roll) for (const side of [o.roll.success, o.roll.failure]) if (side.nextNodeId === from) { side.nextNodeId = to; n++; }
  }
  if (!n) throw new Error(`retarget ${id}: nothing led to ${from}`);
}
const optionBy = (id, labelStart) => {
  const o = need(id).options.find((x) => x.label.startsWith(labelStart));
  if (!o) throw new Error(`no option "${labelStart}" in ${id}`);
  return o;
};
/** Trust is carried on hidden axes; this merges a change into an option's axisDelta. */
function trust(id, labelStart, delta) {
  const o = optionBy(id, labelStart);
  o.axisDelta = { ...(o.axisDelta ?? {}) };
  for (const [k, v] of Object.entries(delta)) o.axisDelta[k] = (o.axisDelta[k] ?? 0) + v;
}
const echo = (id, when, text) => (need(id).echoes ??= []).push({ when, text });
const addOption = (id, option, at) => (at === undefined ? need(id).options.push(option) : need(id).options.splice(at, 0, option));

// ── Act I: the road is chosen early. Scenes 1 to 3, an optional examination, then the first move (F1), which sends you down one of four short arcs.
optionBy("3", "Go Up After Him").nextNodeId = "X1"; // the examination only follows the rooftop chase
optionBy("3", "Report It at the Station").nextNodeId = "F1";
optionBy("3", "Walk On").nextNodeId = "F1";
retarget("X3", "4", "F1");
// the Yard arc: scene 4, then the clerk (6); the case board is a detour from scene 4
retarget("4", "5", "6");
addOption(
  "4",
  opt({
    label: "Offer to Take a Case the Yard Cannot Spare a Man For.",
    detail: "A small matter that has been sitting on Lestrade's desk for a month. It earns goodwill, and costs a week.",
    stamps: { standing: 1 },
    axis: { trustLestrade: 1 },
    who: "Inspector Lestrade",
    says: "There's a coachman in the cells at Marylebone, Mr Holmes, and a book gone missing from Clerkenwell, and a young lady who keeps writing to us about letters. I've nobody to give them to. If you'd care to look at one, I'd not say no.",
    outcome: "Lestrade pushes a small pile of papers across the desk with an expression of unconcealed relief. It is a very modest favour. It is the sort that a policeman remembers.",
    next: "4B",
  }),
);
retarget("4B", "5", "6");
for (const k of ["K2", "K4", "K6"]) retarget(k, "5", "6");
// the street arc: scene 5, the boys' report if you hire them, then the clerk
optionBy("5", "Hire the Whole Gang").nextNodeId = "5B";
// scene 8 (Watson): telling him leads on to the Professor's visit; saying nothing leaves you to face the dray alone
for (const l of ["Tell Him Everything.", "Tell Him Enough to Be Careful"]) optionBy("8", l).nextNodeId = "10";
optionBy("8", "Say Nothing. He Has a Wife").nextNodeId = "9";
optionBy("7", "Break Into the Coaching House").roll.failure.nextNodeId = "7D"; // the break-in is found out
optionBy("7B", "Take Her Key").roll.failure.nextNodeId = "7D";
optionBy("9", "Let the Papers Report You Dead").roll.success.nextNodeId = "9B"; // the dead man walks
// ── the Yard road
retarget("Y2", "Y3", "Y2B");
retarget("Y5", "Y6", "Y5B");
retarget("Y6", "Y7", "YX1");
retarget("Y7", "Y8", "Y7B");
// ── the street road
retarget("S3", "S4", "S3B");
retarget("S5", "S6", "S5B");
retarget("S6", "S7", "S6B");
// ── the flight
retarget("C4", "C5", "C4B");
retarget("C5", "C6", "C5B");
retarget("C6", "C7", "C6B");
retarget("C7", "C8", "C7B");
// the climb down the cliff now leads to the years away
{
  const o = optionBy("C10", "Go Down the Cliff in the Dark");
  o.roll.success.nextNodeId = "H1";
  o.nextNodeId = "H1";
  o.detail = "A ledge, a ledge, and another. You know it from a hundred yards of looking. It is the only way to live, and the long way round.";
  addOption(
    "C10",
    opt({
      label: "Take the Ledge You Walked With Hans.",
      detail: "You know every foot of it from yesterday's dusk. A man who has walked a path in the light may climb it in the dark.",
      needFlag: ["ledgeKnown", "Needs to have walked the ledge"],
      who: "Hans, the guide",
      says: "Here you put your foot, sir, and here you do not. I told you that. If you remember, you will live. If you forget, I shall be sorry.",
      roll: {
        p: 0.72,
        scale: ["nerve", 0.04, 0.4, 0.9],
        ok: {
          text: "Your foot finds each hold before your mind has named it: the ledge, the crack, the second ledge below. A stone strikes the rock a yard away, and another, and then there is only the roar of the water and the sound of your own breath. By midnight you are in the hay of a barn above Meiringen, with a bandaged hand, and Hans, who has found you without being told, is saying nothing at all in a most eloquent way.",
          stamps: { nerve: -1 },
          next: "H1",
        },
        bad: {
          text: "You remember the ledge, and the crack, and then you remember that the second ledge is a hand's breadth wider than you thought. The rock goes out from under your boot. You hear a flat, soft sound from the ridge, and a stone that is not a stone, and then nothing.",
          stamps: { nerve: -3 },
          next: "ENDING_FATAL_SHOT",
        },
      },
      next: "H1",
    }),
    1,
  );
}
// ── the fourth road, and the ways into each road
addOption(
  "11",
  opt({
    label: "Put It in Your Brother's Hands.",
    detail: "The Diogenes Club, the Home Office and the Bank. The State will do what you cannot, and expect to be thanked, and to be obeyed.",
    stamps: { standing: 1 },
    needs: [all(flag("mycroftAsked"), ax("trustMycroft", 1)), "Needs your brother's trust"],
    who: "Mycroft Holmes",
    says: "Come to the Club in the morning, Sherlock. Eleven o'clock. You will be received in the Strangers' Room. You will be expected to speak.",
    outcome: "You send a single line to the Club by a street boy. The reply comes in four minutes, on a card of thick cream, in a hand like a row of well-drilled soldiers: 'Eleven. Do not be late. Do not bring Watson. M.'",
    next: "M1",
  }),
);
addOption(
  "Y1",
  opt({
    label: "Ask Lestrade for His Own Best Men at Every Door.",
    detail: "The one inspector in the building who will vouch for you in front of his superiors. It spends a good deal of his credit.",
    stamps: { standing: 1, evidence: 1 },
    needs: [ax("trustLestrade", 2), "Needs Lestrade's trust"],
    axis: { trustLestrade: 1 },
    who: "Inspector Lestrade",
    says: "I'll put my own name to it, Mr Holmes. I've said before that I'd stand behind you, and I'd as soon not be made a liar this late in the day. You'll have my best.",
    outcome: "Lestrade rises in his place at the long table and says, in a flat plain voice, that he has known Mr Holmes for eleven years and has never known him wrong in a thing that mattered. It is not an eloquent speech. It is a very heavy one. The Assistant Commissioner, who has been looking at his watch, stops.",
    next: "Y2",
  }),
);
// ── hard-only choices: a man short of funds does what he must
addOption(
  "2",
  opt({
    label: "Pawn the Violin for a Fortnight's Expenses.",
    detail: "A good instrument, and a bad bargain. You will have it back by Easter, if the Professor allows.",
    stamps: { nerve: -1 },
    gain: 10,
    only: HARD,
    axis: { heart: -1 },
    who: "The pawnbroker",
    says: "A Stradivari, sir? I'll give you ten pounds on the strength of the case alone. I never could tell a good fiddle from a bad one. I can tell a gentleman in want.",
    outcome: "The pawnbroker looks at the violin for a long minute with an expression you cannot read, and writes out the ticket in a very small hand. You walk out into the street with ten pounds in your pocket and an unfamiliar lightness at your shoulder. Mrs Hudson, that evening, does not mention the empty place on the shelf.",
    next: "3",
  }),
);
addOption(
  "9",
  opt({
    label: "Sell a Case-Book to a Collector.",
    detail: "Three years of notes, in your own hand, bought by a man who has promised never to read them. It is a short-sighted bargain, and a necessary one.",
    stamps: { standing: -1 },
    gain: 8,
    only: HARD,
    who: "A collector",
    says: "I shall keep it under glass, Mr Holmes, and never let it out of the house. I am told that a good detective's notes are better than a good novel. I shall be glad to put it to the test.",
    outcome: "The collector counts out eight pounds in gold, and carries away the third volume of your case-books with the air of a man who has been given the Crown Jewels. You do not look back at the shelf. It is a short, sharp, shameful transaction, and you will make a very great effort to forget it.",
    next: "10",
  }),
);
addOption(
  "C1",
  opt({
    label: "Pawn Your Watch for the Fare.",
    detail: "A gold half-hunter, a gift from a grateful client. It will buy the tickets and leave you with a little in hand.",
    stamps: { nerve: -1 },
    gain: 6,
    only: HARD,
    who: "A pawnbroker near Victoria",
    says: "Fifteen shillings in the pound, sir, and a card with your name on it. They always come back. I have never in my life been surprised to see a gentleman again.",
    outcome: "You cross to a small shop in the arcade, and the old man behind the counter puts a glass in his eye and looks at the watch for a long time. 'Six pounds,' he says. 'It is a very good watch.' You say that it is. You take the money, and go to the train, and feel, for the first time since January, quite perfectly poor.",
    next: "C2",
  }),
);

// ── trust: the four who stand behind you
const T = [
  ["1", "Lay All Three Cases Before Lestrade", { trustLestrade: 1 }],
  ["2", "Ask Mycroft What the Government", { trustMycroft: 1 }],
  ["4", "Lay Out the Whole Pattern", { trustLestrade: 1 }],
  ["4", "Offer Lestrade One Small", { trustLestrade: 1 }],
  ["4", "Leave the Yard Out of It", { trustLestrade: -1 }],
  ["5", "Hire the Whole Gang", { trustWiggins: 1 }],
  ["5", "Send Them Away and Trust Your Own Eyes", { trustWiggins: -1 }],
  ["6", "Send Him to Lestrade With a Note", { trustLestrade: 1 }],
  ["7", "Have Lestrade Obtain a Warrant", { trustLestrade: 1 }],
  ["8", "Tell Him Everything.", { trustWatson: 2 }],
  ["8", "Tell Him Enough to Be Careful", { trustWatson: 1 }],
  ["8", "Say Nothing. He Has a Wife", { trustWatson: -1 }],
  ["9", "Post Wiggins's Boys", { trustWiggins: 1 }],
  ["9", "Move Into Watson's Spare Room", { trustWatson: 1 }],
  ["Y1", "Present the Full Case", { trustLestrade: 1 }],
  ["Y1", "Press for One Night", { trustLestrade: 1 }],
  ["Y2", "Let Lestrade Swear Them", { trustLestrade: 1 }],
  ["Y2", "Skip Bow Street and Take a Home Office Minute", { trustMycroft: 1 }],
  ["Y3", "Expose Him at Once", { trustLestrade: -1 }],
  ["Y3", "Tell Only Lestrade", { trustLestrade: 1 }],
  ["Y4", "Sit Up With Lestrade", { trustLestrade: 1 }],
  ["Y8", "Refuse. The Law Is the Law.", { trustMycroft: -1 }],
  ["Y8", "Accept a Closed Hearing", { trustMycroft: 2 }],
  ["Y8", "Ask What He Is Afraid Of", { trustMycroft: 1 }],
  ["S4", "Drop the Work and Find the Boy", { trustWiggins: 2 }],
  ["S4", "Send for Watson to Look Him Over", { trustWatson: 1, trustWiggins: 1 }],
  ["S4", "The Boys Knew the Risk", { trustWiggins: -2 }],
  ["S5", "Promise to Keep Within the Law", { trustLestrade: 1 }],
  ["S5", "Hand Him Your Best Lead", { trustLestrade: 1 }],
  ["S5", "Ignore the Warning", { trustLestrade: -1 }],
  ["C2", "Telegraph Mycroft From the Platform", { trustMycroft: 1 }],
  ["C3", "Tell Him the Whole of It", { trustWatson: 2 }],
  ["C3", "Tell Him Only That You Are Hunted", { trustWatson: 1 }],
  ["C3", "Tell Him Nothing", { trustWatson: -1 }],
  ["C4", "Wire Lestrade Everything", { trustLestrade: 1 }],
  ["C6", "Rest for Two Days", { trustWatson: 1 }],
  ["C6", "Write to Mycroft for Money", { trustMycroft: 1 }],
  ["C7", "Spend the Evening With Watson", { trustWatson: 1 }],
  ["C8", "Tell Watson It Is a Trap", { trustWatson: 1 }],
  ["C8", "Let Watson Go", { trustWatson: -1 }],
];
for (const [id, label, d] of T) trust(id, label, d);
// the road to scene 9 now runs through not telling Watson, so the spare room is open to a man who said nothing too
{
  const o = optionBy("9", "Move Into Watson's Spare Room");
  delete o.requiresFlag;
  delete o.requiresFlagHint;
}
// what the Yard and Whitehall think of the things you do
trust("7", "Break Into the Coaching House", { trustLestrade: -1 });
trust("7B", "Take Her Key", { trustLestrade: -1 });
trust("MA", "Take Information Only", { trustMycroft: -2 });

// ── later scenes remember the earlier ones
echo("9", flag("larchLost"), "In the street you keep seeing a young man's white face under a lamp, and hearing him ask whether you know best about everything.");
echo("Y3", flag("warrantsSworn"), "The warrants are in Lestrade's inside pocket, tied in green tape, and he pats them at every corner like a man checking for his watch.");
echo("Y4", flag("moleUsed"), "Somewhere in Mayfair a false list lies in a letter-box, and tonight you cannot tell whether you are the cat or the mouse.");
echo("S3", flag("routeKnown"), "You know which lamp-post the Professor's carriage stops beside, and tonight that knowledge is no comfort at all.");
echo("S6", flag("promisedLestrade"), "You gave Lestrade your word to keep within the law. Each of these three schemes sits very uneasily beside it.");
echo("S7", flag("moranMarked"), "A hundred cabmen now know the Colonel's face. Not one has found him.");
echo("Y1", flag("fitchNamed"), "On the corner of Lestrade's blotter is a card with a cabman's name on it. It has been there since February, and it has not once moved.");
echo("Y7", flag("codexFound"), "Among the letters on the Crown's table is one from the governors of the Clerkenwell Institute, speaking warmly of your character.");
echo("Y7", flag("confessed"), "Counsel's question about the Marylebone Road falls flat. The divisional book has no such entry, because you went to the Superintendent yourself, and he burned the page.");
echo("S1", flag("fitchNamed"), "You know a name, now: Fitch, who drives from a yard in Kentish Town. The yard is on Wiggins's map.");
echo("S1", flag("yardLearned"), "The cab-yard in Kentish Town is not a stranger to you. You have stood in its gateway, and you know which of its foremen has the shoulders of a prize-fighter.");
echo("S1", flag("dogcart"), "The dog-cart with the yellow wheels is on the map in red chalk, with a small neat note: 'GREEN DOOR, CAMDEN TOWN'.");
echo("Y9B", flag("roofWatch"), "Somewhere above you a very small whistle passes from slate to slate. The boys have seen it too.");
echo("Y9C", flag("canalOnly"), "You are standing at the canal and nowhere else. If you have read the study wrong, the whole of the night is lost.");
echo("S8B", flag("byWater"), "The lighterman's boat is tied below the water-stairs, with its oars shipped and its lantern covered. It is a quiet way out.");
echo("S8B", flag("byRoof"), "You hang from a joist in the roof, with the rope round your wrist and the whole of the floor beneath you.");
echo("S8B", flag("openQuay"), "You came by the front, with a lantern. Everyone in the building knows it.");
echo("C6", flag("strangerShaken"), "The man in the green hat is somewhere behind you on the line. You wonder how much he told, and to whom.");
echo("C8", flag("watsonWarned"), "Watson knows what you mean to do at the water, and he has been watching your face since breakfast, and is not at all deceived by your manner.");
echo("M3", flag("homeOfficeWarrant"), "The Home Secretary's warrant is folded in your waistcoat, a small cold square against your ribs.");

// ── round four: the wardrobe, the lady, the cipher and the Club
retarget("10", "11", "10W");
retarget("M4", "M5", "MX1");
retarget("M6", "M7", "M6B");
addOption(
  "3",
  opt({
    label: "Leave the Rooftop and Read the Note That Came This Morning.",
    detail: "It was on violet paper, scented, and signed with two initials. It has been in your pocket-book since breakfast, unopened, like a small unexploded shell.",
    stamps: {},
    who: "Dr Watson",
    says: "Holmes, you have been staring at that envelope for a quarter of an hour. It is not a cipher. It is a lady's handwriting, and I rather think you know whose.",
    outcome: "You read it standing at the corner of Vere Street with the brick still in your other hand.",
    next: "K7",
  }),
);
echo("M6", flag("buyerNamed"), "Mr Dunmore's name is on a slip in your pocket-book. The Chief Cashier does not know it, and you do not tell him, because you wish to see whether his face does.");
echo("C4", flag("adlerAbroad"), "Somewhere on this Continent, in a hotel whose name you were not told, a woman in a grey gown is reading a book face down on the arm of a chair. You find that you glance at the other tables.");
echo("Y9", flag("adlerBait"), "There is a cheque, somewhere in a bank in Lombard Street, with the Professor's money on it and a lady's signature on the back. You put the thought away, and it does not stay put.");
echo("M7", flag("knowsDeparture"), "On Tuesday a ship called the Teutonic will leave Southampton, with a gentleman aboard under another name. You know, because he told you himself, in a mild voice, in your brother's club.");
echo("M7", flag("mycroftAlone"), "Mycroft has been alone with the solicitor since the morning, and it shows: he is paler than usual, and a little more precise.");
echo("M8", flag("cipherBroken"), "In your breast-pocket is a key that fits four hundred and nine locks. It weighs nothing at all.");
echo("11", flag("dsPriest"), "A priest's black hangs on the door of the back bedroom, and there is a faint, rather holy smell of camphor.");
echo("11", flag("dsSailor"), "A pea-jacket hangs on the door, and a beard lies on the washstand, looking dead.");
echo("11", flag("dsClerk"), "A bowler sits on the hall table, and a clerk's coat hangs by it, with chalk on the cuffs.");
echo("MX1", flag("lawClause"), "You carry into the cable room a clause that you would not give up, and Mr Fenn, who has not seen one before, looks at it with great respect.");
echo("K8", flag("fitchNamed"), "You have a cabman's name already. You do not offer it. She has a way of making people feel that they have said more than they have.");

// ── round three: the road confirmed at scene 11, trust options, recovery, sure finales, echoes
rework({ need, addOption, echo });
applyStrand(nodes);
// the options added to existing scenes after the strand table was applied
for (const [id, o, at] of extraOptions) addOption(id, o, at);
// balance pass 2: with the strands in, Hours drained and Hands and Wires rose in a typical run, so a third of the costs of Hours and a fifth of the gains of
// Hands and Wires are dropped (picked by a fixed hash of the scene, the option and the line, so the build is repeatable).
{
  const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  for (const n of Object.values(nodes)) {
    n.options.forEach((o, i) => {
      const lists = [o.stamps, ...(o.roll ? [o.roll.success.stamps, o.roll.failure.stamps] : [])];
      for (const st of lists) {
        if (st.hours < 0 && hash(n.id + ":" + i + ":hours") % 3 === 0) delete st.hours;
        for (const r of ["hands", "wires"]) if (st[r] > 0 && hash(n.id + ":" + i + ":" + r) % 5 === 0) delete st[r];
      }
    });
  }
}

// ── balance pass: Evidence came too easily (83% of random runs ended at +10), so every gain of Evidence is one point smaller
for (const n of Object.values(nodes)) {
  for (const o of n.options) {
    const lists = [o.stamps, ...(o.roll ? [o.roll.success.stamps, o.roll.failure.stamps] : [])];
    for (const st of lists) if (st.evidence > 0) { st.evidence -= 1; if (st.evidence === 0) delete st.evidence; }
  }
}

// the three standalone cases and the shelf that opens the game; their numbers are their own, so the balance passes above leave them alone
for (const n of [shelf, ...caseNodes, ...leagueNodes, ...moreNodes]) {
  if (nodes[n.id]) throw new Error("duplicate node " + n.id);
  nodes[n.id] = n;
}
// round five: the street and the flight gain two investigations each, a second chance at every finale that hung on one roll, and Mrs Norton's later scenes
tweakFinales({ need, optionBy, addOption, retarget });
for (const [id, o, at] of moreOptions) addOption(id, o, at);
for (const [id, o, at] of hiddenOptions) addOption(id, o, at);
for (const [id, f, text] of reactionEchoes) echo(id, flag(f), text);
echo("S8", flag("wharfWatch"), "A tall, stooping gentleman went in at the gate on Sunday and did not come out. You are fairly sure that he is in there still.");
echo("S8", flag("wharfCarter"), "The carter's name is in your pocket-book, and so is the hour at which he collects the bread. You are not the only one with an appointment tonight.");
echo("C8", flag("pathRead"), "You know the path now as you know your own stair: where it is wide, where it narrows, and where a heel has scraped the moss. It is not a comfort.");
echo("C8", flag("adlerSent"), "A note in violet ink is in your pocket. It says 'Quite so'. You have not shown it to Watson, and you do not intend to.");
echo("Y9", flag("adlerSafe"), "Mrs Norton is on a boat, somewhere in the Channel, with a book. You find that you are rather glad of it, and a little ashamed to be glad.");
echo("Y9", flag("adlerHurt"), "A note is in your pocket that says she was not frightened. You do not believe it, and you do not intend to say so.");
echo("L2", flag("leagueCard"), "The card from the office door is in your pocket-book. It is dated the ninth of October, and it was not written by anybody who expected to be read.");
echo("L3", flag("leagueWatson"), "Watson is on the sofa, with a very good cigar and an air of conscious usefulness, and does not in the least know why he is so pleased.");

// ───────────── interludes ─────────────
const extraInterludes = [
  {
    id: "TRANSITION_MYCROFT",
    source: "A Card, Delivered by Hand",
    headline: "THE DIOGENES CLUB",
    bodyText: "MR MYCROFT HOLMES requests the favour of Mr Sherlock Holmes's company at the Club, on Saturday, at eleven in the morning. Mr Holmes will be received in the Strangers' Room, where conversation is permitted. He is requested to arrive punctually, to be brief, and to say nothing that he would not wish to see in the Estimates. The Club regrets that it cannot offer refreshment. It regrets very little else.",
    kind: "transition",
  },
  {
    id: "TRANSITION_HIATUS",
    source: "The Times (a notice)",
    headline: "SHERLOCK HOLMES: AN APPRECIATION",
    bodyText: "THE news from Switzerland has been received in London with a very general sorrow. Mr Sherlock Holmes, who was understood to have fallen with the notorious Professor Moriarty at the Falls of the Reichenbach on Monday last, was the most remarkable private detective of our time, and, those who knew him will say, among the most remarkable men. He was reserved, brilliant, and, it was sometimes thought, a little cold. It is to be hoped that it will be possible to say, in the years to come, that he was also happy.\n\nHis friend and companion, Dr John Watson, has declined to comment.",
    kind: "transition",
  },
];
extraInterludes.push(
  {
    id: "CRISIS_HOURS",
    source: "Bradshaw's Railway Guide",
    headline: "THE LAST TRAIN IS GONE",
    bodyText: "DOWN TRAINS. Victoria to Dover, 9.45 a.m., 12.30 p.m., 4.15 p.m. Passengers are requested to observe that the last connection of the day leaves at a quarter past four, and that no train is held for any person whatever.\n\nThere was always one more thing to do. You did it, and then another, and by the time you looked up the afternoon had gone. Whatever you are late for, you are late for it now.",
    kind: "crisis",
  },
  {
    id: "CRISIS_HANDS",
    source: "A Note, Folded Small",
    headline: "FROM WIGGINS, IN PENCIL",
    bodyText: "MR HOLMES THE BOYS HAVE GONE HOME. I TOLD THEM TO. THEY WERE TIRED AND SOME OF THEM WERE SCARED AND I DID NOT THINK YOU WOULD MIND. I AM SORRY. THERE IS NOBODY LEFT TO SEND. W.",
    kind: "crisis",
  },
  {
    id: "CRISIS_WIRES",
    source: "Telegram (Undelivered)",
    headline: "NO MESSAGE RECEIVED",
    bodyText: "TO MR S HOLMES 221B BAKER STREET. THE POST OFFICE REGRETS THAT THE WIRES TO YOUR DISTRICT ARE DOWN. YOUR MESSAGES OF FRIDAY AND SATURDAY HAVE NOT BEEN DELIVERED. NO REPLY WILL BE EXPECTED.",
    kind: "crisis",
  },
);
const interludeMap = Object.fromEntries([...interludes, ...extraInterludes, ...caseInterludes, leagueInterlude, ...reactionInterludes].map((i) => [i.id, i]));
const allTriggers = [...triggers, ...caseTriggers, leagueTrigger, ...reactionTriggers, { interludeId: "TRANSITION_MYCROFT", onEnterNodes: ["M1"] }, { interludeId: "TRANSITION_HIATUS", onEnterNodes: ["H1"] }];

// ───────────── endings ─────────────
const strandEnding = {
  id: "ENDING_CRISIS_STRAND",
  title: "The Strand Snaps",
  kind: "failure",
  headline: "THE GREAT DETECTIVE OUT OF MEANS: THE PROFESSOR UNTOUCHED",
  text: "It is not one thing but the three that hold a campaign up, and you have let one of them go. The Professor has not beaten you. He has merely outlasted you, as a tide outlasts a man with a spade.",
  variants: [
    { when: { resource: "hours", op: "<=", value: -8 }, headline: "TOO LATE: THE MONDAY COMES AND GOES", text: "There was always one more thing to do, and you did it, and then another, and by the time the last of them was done the thing it was for had already happened. The raids go off without you, or the train leaves, or the page is turned by someone else's hand. You were never wrong about anything. You were merely late for all of it, and the Professor, who has never in his life been in a hurry, has been waiting for exactly that." },
    { when: { resource: "hands", op: "<=", value: -8 }, headline: "AN EMPTY ROOM IN BAKER STREET", text: "At the end there is nobody left to send. Lestrade has stopped answering, the boys have been told to stay at home, Watson looks at you with a gentleness that is much worse than anger, and your brother has stopped writing. A detective is not one man. He is a system of other people's eyes and legs, and you have used them up or driven them off. You sit in a room full of the right conclusions, with no one to carry them anywhere." },
    { when: { resource: "wires", op: "<=", value: -8 }, headline: "THE LINES ARE DOWN", text: "It is a small silence at first: a telegram that is not answered, a letter that is not sent, a newspaper that does not call. Then it is a large one. You know a great deal, and nobody knows that you know it. The Professor has not so much cut your wires as made them irrelevant, and you sit in the middle of London with the answer in your head, as remote from the world as a man in a lighthouse." },
  ],
};
const endingMap = Object.fromEntries([...endings, ...newEndings, strandEnding, ...caseEndings, ...leagueEndings, ...hiddenEndings].map((e) => [e.id, e]));
endingMap.ENDING_THE_EMPTY_GRAVE = replacedEmptyGrave;
for (const [id, list] of Object.entries(frontVariants)) {
  const e = endingMap[id];
  const made = list.map(([cond, headline, text]) => ({ ...(cond.flag && Object.keys(cond).length === 1 ? { flag: cond.flag } : { when: cond }), headline, text }));
  e.variants = [...made, ...(e.variants ?? [])];
}

for (const [id, list] of Object.entries(ruinVariants)) {
  endingMap[id].variants = list.map(([cond, headline, text]) => ({ when: cond, headline, text }));
}

// ───────────── config ─────────────
const resource = (id, label) => ({
  id, label, min: -10, max: 10, start: 0,
  crisisAt: -7, crisisInterludeId: `CRISIS_${id.toUpperCase()}`,
  failAt: -10, failureEndingId: `ENDING_CRISIS_${id.toUpperCase()}`,
});
const strandLine = (id, label) => ({
  id, label, min: -8, max: 8, start: 0,
  crisisAt: -5, crisisInterludeId: `CRISIS_${id.toUpperCase()}`,
  failAt: -8, failureEndingId: "ENDING_CRISIS_STRAND",
});
const rule = (when, delta) => ({ when, delta });
const trustAxis = (id, label) => ({ id, label, min: -4, max: 4, bucketThreshold: 2 });
const config = {
  id: "sherlock",
  title: "Sherlock Holmes: The Final Problem",
  schemaVersion: 1,
  resources: [
    resource("evidence", "Evidence"),
    resource("standing", "Standing"),
    resource("nerve", "Nerve"),
    // The Strand: the means (see strand.mjs). Each line has its own warning and its own ruin, and they all end in the same story.
    strandLine("hours", "Hours"),
    strandLine("hands", "Hands"),
    strandLine("wires", "Wires"),
  ],
  axes: [
    { id: "heart", label: "Heart", min: -8, max: 8, bucketThreshold: 2 },
    { id: "company", label: "Company", min: -8, max: 8, bucketThreshold: 2 },
    trustAxis("trustWatson", "Watson"),
    trustAxis("trustLestrade", "Lestrade"),
    trustAxis("trustMycroft", "Mycroft"),
    trustAxis("trustWiggins", "Wiggins"),
    trustAxis("trustAdler", "Mrs Norton"),
  ],
  epilogue: {
    axes: ["heart", "company"],
    inferredRules: [
      rule(flag("larchLost"), { heart: -1 }),
      rule(flag("boyLost"), { heart: -1 }),
      rule(flag("boyFound"), { heart: 1 }),
      rule(flag("lawFirst"), { heart: 1 }),
      rule(flag("stateBargain"), { heart: -1 }),
      rule(flag("watsonIn"), { company: 1 }),
      rule(flag("watsonSpared"), { company: -1 }),
      rule(flag("irregulars"), { company: 1 }),
      rule(flag("mycroftFavour"), { company: 1 }),
      rule(flag("vigilante"), { company: -1 }),
      rule(flag("watsonStays"), { company: 1 }),
      rule(flag("watsonDecoyed"), { company: -1 }),
      rule(flag("governessSafe"), { heart: 1 }),
      rule(flag("governessBait"), { heart: -1 }),
      rule(flag("confessed"), { heart: 1 }),
      rule(flag("boysStand"), { heart: 1, company: 1 }),
      rule(flag("printerTurns"), { heart: 1 }),
      rule(flag("cleanHands"), { heart: 1 }),
      rule(flag("readSecond"), { heart: -1 }),
      rule(flag("ministerHeld"), { heart: -1 }),
      rule(flag("wroteWatson"), { company: 1 }),
      rule(flag("returnedEarly"), { heart: 1, company: 1 }),
      rule(res("nerve", "<=", -4), { heart: -1 }),
      rule(res("nerve", ">=", 5), { heart: 1 }),
      rule(res("standing", ">=", 5), { company: 1 }),
      rule(res("standing", "<=", -4), { company: -1 }),
    ],
  },
  difficulties: {
    EASY: { showPreview: true, enforceMoney: false, startingMoney: 0, adviceEnabled: false },
    MEDIUM: { showPreview: false, enforceMoney: false, startingMoney: 0, adviceEnabled: true },
    HARD: { showPreview: false, enforceMoney: true, startingMoney: 30, adviceEnabled: true },
  },
  defaultDifficulty: "MEDIUM",
  startBranch: "WEB",
  interludeTriggers: allTriggers,
  assist: {
    adviceLimit: 3,
    favors: {
      evidence: { evidence: 3, standing: -2 },
      standing: { standing: 3, nerve: -2 },
      nerve: { nerve: 3, evidence: -1, standing: -1 },
    },
    favorFlag: "mycroftFavour",
  },
  skipToNodeId: "11",
  strain: { threshold: -4, perPoint: 0.025, max: 0.12 },
  coupling: [
    { when: { resource: "nerve", atOrBelow: -4 }, on: { resource: "evidence", direction: "gain" }, add: { evidence: -1 }, label: "A tired mind reads less: while Nerve is -4 or worse, every gain of Evidence is one point smaller." },
    { when: { resource: "evidence", atOrBelow: -3 }, on: { resource: "standing", direction: "gain" }, add: { standing: -1 }, label: "A man without proof is not believed: while Evidence is -3 or worse, every gain of Standing is one point smaller." },
    { when: { resource: "standing", atOrBelow: -3 }, on: { resource: "nerve", direction: "gain" }, add: { nerve: -1 }, label: "A discredited man cannot rest: while Standing is -3 or worse, every gain of Nerve is one point smaller." },
    { when: { resource: "hands", atOrBelow: -4 }, on: { resource: "evidence", direction: "gain" }, add: { evidence: -1 }, label: "Nobody to carry it: while Hands are -4 or worse, every gain of Evidence is one point smaller." },
    { when: { resource: "wires", atOrBelow: -4 }, on: { resource: "standing", direction: "gain" }, add: { standing: -1 }, label: "Nobody hears of it: while Wires are -4 or worse, every gain of Standing is one point smaller." },
    { when: { resource: "hours", atOrBelow: -4 }, on: { resource: "nerve", direction: "gain" }, add: { nerve: -1 }, label: "Hurried, you cannot rest: while Hours are -4 or worse, every gain of Nerve is one point smaller." },
  ],
};

const events = { startNodeId: "0", nodes, interludes: interludeMap, endings: endingMap };

// ───────────── flavor ─────────────
const flavorOut = {
  ...flavor,
  howToPlay: flavor2.howToPlay,
  gossip: [...flavor.gossip, ...flavor2.gossip],
  novelNotes: { ...flavor.novelNotes, ...flavor2.novelNotes, ...caseFlavor.novelNotes, ...leagueFlavor.novelNotes, ...hiddenFlavor.novelNotes },
  endingHints: { ...flavor.endingHints, ...flavor2.endingHints, ...caseFlavor.endingHints, ...leagueFlavor.endingHints, ...hiddenFlavor.endingHints },
  flagNotes: { ...flavor.flagNotes, ...flavor2.flagNotes, ...caseFlavor.flagNotes, ...leagueFlavor.flagNotes, ...reactionFlagNotes },
};
Object.assign(flavorOut.flagNotes, {
  leanYard: "You took it to Scotland Yard first.",
  leanStreet: "You sent for the boys first.",
  leanMycroft: "You went to your brother's club first.",
  leanFlight: "You trusted no one, and kept the road out of England open.",
  greavesKnown: "Mycroft introduced you to Superintendent Greaves.",
  priceNamed: "Mycroft told you what Whitehall would cost.",
  fofClerk: "You followed the Foreign Office clerk to Kensington.",
  routePlanned: "You planned your road out of England in February.",
  restTaken: "You took a night's rest, and mended.",
  standingRepaired: "Lestrade vouched for you, and it cost him.",
  dsPriest: "You packed the priest's black.",
  dsSailor: "You packed the old sailor's jacket and beard.",
  dsClerk: "You packed the clerk's coat and bowler.",
  adlerMet: "Mrs Norton, once Irene Adler, wrote to you, and you called.",
  buyerNamed: "Mr Hector Dunmore of Brandt and Chambers is buying for the Professor.",
  adlerBait: "You asked Mrs Norton to sell, and followed the money.",
  adlerAbroad: "Mrs Norton went abroad, with the packet.",
  clueBook: "The Professor's cipher is made of groups of four figures, none above four hundred: a book.",
  clueTitle: "Every cable opens with the same five groups: a title.",
  cipherBroken: "You read the Professor's cipher: his own treatise, by page and line.",
  knowsDeparture: "The Professor means to sail from Southampton on Tuesday.",
  mycroftAlone: "You would not sit in the room with the Professor, and Mycroft bore it alone.",
  wharfTide: "The Teal comes up on the top of the tide on Tuesday, a quarter past eight, and never takes a load.",
  wharfWatch: "A tall, stooping man went into the wharf on Sunday and did not come out.",
  wharfPolice: "The wharf is leased in the name of Mr Alexander Bell, who does not exist.",
  wharfMarks: "Three crosses and a bar, chalked on every bollard: a route to the cellar stair.",
  wharfOil: "Forty-one casks of lamp-oil at the wharf gate, and the tops are off.",
  wharfCarter: "You followed the carter who brings the bread.",
  registerRead: "There is no sick English lady at the Englischer Hof.",
  guideTalks: "Every guide in Meiringen has been paid to be somewhere else.",
  formsRead: "The message that will call Watson away is in a man's hand, on a post-office form.",
  pathRead: "You walked the path above the Falls and read the ground.",
  cleftSeen: "There is a cleft in the rock below the ledge, big enough for one man lying flat.",
  adlerWarned: "Mrs Norton warned you of a forged message for Watson.",
  adlerWatch: "Mrs Norton is watching the hotel for you.",
  adlerSent: "You sent Mrs Norton back to Brussels.",
  adlerStatement: "Mrs Norton gave a sworn statement to Lestrade.",
  adlerSafe: "You told Mrs Norton to stay out of court and out of London.",
  adlerDecoy: "Mrs Norton dined with Mr Dunmore at the Café Royal and learned the door and the hour.",
  adlerHurt: "Mr Dunmore saw through Mrs Norton at the Café Royal.",
});
// the Empty Grave note now describes the road home
flavorOut.novelNotes.ENDING_THE_EMPTY_GRAVE = "In the Canon: this is the secret told in The Empty House (1903), up to the point where Holmes chooses not to come home. In the story he wrote the note with Moriarty's leave, escaped the Falls, travelled in Tibet, Persia and Khartoum, worked in a laboratory at Montpellier, and returned in 1894; Mycroft alone knew, and supplied him with money. The game lets you stay away.";
flavorOut.endingHints.ENDING_THE_EMPTY_GRAVE = "Survive the Falls, spend the years away, and choose in 1894 not to come home.";
flavorOut.novelNotes.ENDING_CRISIS_STRAND = "In the Canon: Holmes is never short of time, helpers or word of the world for long: he has Watson, the Irregulars, Lestrade, his brother and the telegraph. Running out of any of them is this game's invention.";
flavorOut.endingHints.ENDING_CRISIS_STRAND = "Spend your Hours, your Hands or your Wires down to nothing: work slowly, work alone, or cut yourself off.";
flavorOut.endingHints.ENDING_NAPOLEON_ESCAPES = "Close the file too soon, fail a finale, or walk out of a room, and let the Professor go.";

// the screen the demo build stops on (the demo is the Case-Book with the long case locked at the choice of road; src/demo.ts)
flavorOut.demoEnd = {
  title: "The Case Continues",
  body: [
    "You have been through the whole of the opening of The Final Problem: the brick in Vere Street, the first move, and the choice of how to meet the Professor's net.",
    "The door ahead is locked in the demo. The full game goes on down the road that you chose, through the Yard, the street, Whitehall or the flight to the Falls, to the last choice on each road, with seventeen endings in the long case and the Case-Book that keeps the ones you have found. The four minor cases on the shelf are complete in the demo, hidden endings and all. The full game is on the game's page, to download.",
  ],
  restart: "Back to the Title",
};

// Watson's remarks about the Strand, for his notebook: the shortest line speaks first, and when all three are well supplied he says so
flavorOut.creatureReportLines = { ...flavorOut.creatureReportLines };
const strandLines = {
  hours: [
    "We are behind, Holmes. I do not say it to scold you. I say it because the Professor keeps a better diary than we do, and he has not wasted a day.",
    "I have counted the days that remain, and I have counted the things that you still wish to do. The two sums do not agree, and I am a doctor, not a conjurer.",
    "Every scene that you read slowly is a day that he spends. I should be very grateful, my dear fellow, for something a little brisk.",
  ],
  hands: [
    "You have not a man to spare, Holmes. The boys are tired, Lestrade's constables have other orders, and I am only one doctor. Let us not ask for more than can be sent.",
    "I have looked round the room and counted, and I find that we are fewer than we were. A detective is not one man. You used to say so yourself.",
    "If anyone is to be asked for a favour this week, I should like it to be somebody who has not already given us three.",
  ],
  wires: [
    "Nobody has answered a wire of ours in a day and a half. We are working in the dark, Holmes, and the world is a good deal further off than it was.",
    "I have been to the post office twice this morning and have been told nothing at all, very civilly, both times. I do not at all like it.",
    "The newspapers have not telephoned, the clerks have not written, and the street has gone quiet. It is a poor sort of quiet.",
  ],
  plenty: [
    "I must say, Holmes, that for once we are very well supplied. The boys, the wires, the hours: I do not think I have seen it so since the Jeremy affair. Do not waste it.",
    "We have men, and time, and a good deal of news coming in. I should like to say that I am confident. I shall say instead that I am watching you very closely.",
  ],
};
for (const [k, lines] of Object.entries(strandLines)) flavorOut.creatureReportLines["strand_" + k] = lines;

const dir = join(out, "src/content/sherlock");
const text = (data) => JSON.stringify(data, null, 2) + String.fromCharCode(10);
const files = { "config.json": config, "events.json": events, "flavor.json": flavorOut };
if (check) {
  const stale = Object.entries(files).filter(([name, data]) => !existsSync(join(dir, name)) || readFileSync(join(dir, name), "utf8") !== text(data)).map(([name]) => name);
  if (stale.length) {
    console.error(`FAIL: ${stale.join(", ")} differ from what gen/build.mjs writes. Edit the generator (gen/), then run: npm run gen`);
    process.exit(1);
  }
  console.log(`Generator check passed: the three content files are exactly what gen/build.mjs writes (${Object.keys(nodes).length} scenes).`);
} else {
  for (const [name, data] of Object.entries(files)) writeFileSync(join(dir, name), text(data));
  console.log(`wrote ${Object.keys(nodes).length} nodes, ${Object.keys(endingMap).length} endings, ${Object.keys(interludeMap).length} interludes`);
}
