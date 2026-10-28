import { flag, res, all, not } from "./lib.mjs";

/**
 * Round six: events that fire on entering a scene (engine 0.8.0, a conditional interlude trigger with consequences).
 *   Deadlines: the story's dated moments come whether or not you are ready. With Hours at -3 (-4 in Whitehall) or worse the day goes against you; with +1 to +2 or better, for you.
 *   Answers: the Professor answers an arm of his web that you cut, unless you had made ready for it.
 * Each event is one card, shown once, with its cost on it.
 */
const it = (id, source, headline, bodyText, kind = "transition") => ({ id, source, headline, bodyText, kind });

// Thresholds were set from random and careful play of the long case: a careless player is usually late, a careful one is ahead about one time in four
const late = (n) => res("hours", "<=", n);
const early = (n) => res("hours", ">=", n);

export const reactionInterludes = [
  // ───────────── deadlines ─────────────
  it(
    "DEADLINE_RAIDS_LATE",
    "Scotland Yard, a note",
    "THE RAIDS WENT OFF WITHOUT YOU",
    "LESTRADE HAS NOT WAITED. THE ELEVEN HOUSES WERE ENTERED AT HALF PAST THREE, WHICH IS EARLIER THAN WE AGREED, BECAUSE THE SUPERINTENDENT WOULD NOT HOLD HIS MEN ANOTHER HOUR ON YOUR ACCOUNT. HALF THE BIRDS WERE ALREADY GONE. I AM SORRY. I DID SAY THAT YOU WERE SLOW. L.",
  ),
  it(
    "DEADLINE_RAIDS_EARLY",
    "A Page of the Diary",
    "A DAY IN HAND",
    "For once you are ahead of the hour. The warrants are signed, the men are fed, and Lestrade, who has been up since four, has been told that he may sleep until two. It is a small, rare, rather astonishing thing, to find that the day has been waiting for you, and not the other way round.",
  ),
  it(
    "DEADLINE_TIDE_LATE",
    "Wiggins, in pencil",
    "THE TEAL CAME UP EARLY",
    "MR HOLMES THE BARGE IS IN. SHE CAME UP ON THE TIDE A QUARTER HOUR BEFORE YOU SAID AND SOMEBODY IS ALREADY ON THE STAIRS. I DID NOT LIKE TO SEND THE BOYS IN WITHOUT YOU. WE ARE BEHIND. W.",
  ),
  it(
    "DEADLINE_TIDE_EARLY",
    "The Thames Pilot, a page",
    "YOU ARE ON THE STAIRS FIRST",
    "The tide has not yet turned and the wharf is still. You have time to count the boys twice, to look at the water, and to find the dry place on the third step where a man might stand and not be seen from the door. It is the first time in a week that the river has been on your side.",
  ),
  it(
    "DEADLINE_HOTEL_LATE",
    "The Englischer Hof, a card",
    "THE GENTLEMAN HAS ARRIVED",
    "A gentleman, Monsieur, came by the noon diligence, a good deal earlier than anyone supposed, and has asked the way to the Falls. He gave no name. He has left his bag at the desk. It is a very small bag. The porter would be most obliged if you would say whether he is to be given a room.",
  ),
  it(
    "DEADLINE_HOTEL_EARLY",
    "A Page of Watson's Journal",
    "A QUIET MORNING",
    "It is an odd thing to record, but Holmes slept until seven, and ate a roll, and sat for twenty minutes at the window with the Alps in the glass, saying nothing whatever. He had everything arranged by nine. I have not seen him so easy since the spring, and I find that it makes me more anxious, not less.",
  ),
  it(
    "DEADLINE_CABINET_LATE",
    "A message from Whitehall",
    "THE CABINET SAT WITHOUT YOU",
    "THE PRIME MINISTER HAS TAKEN THE QUESTION AT NOON, AS HE SAID HE WOULD, AND AS YOU WERE NOT HERE HE HAS TAKEN IT ON YOUR BROTHER'S WORD ALONE. I HAVE DONE WHAT I COULD. I SHOULD HAVE BEEN GLAD OF A DAY MORE, AND SO, I DARE SAY, WOULD YOU. M.",
  ),
  it(
    "DEADLINE_CABINET_EARLY",
    "A message from Whitehall",
    "THE CABINET WILL WAIT FOR YOU",
    "THE PRIME MINISTER HAS PUT BACK THE QUESTION TO THE AFTERNOON AT MY REQUEST, AND ASKS ME TO SAY THAT HE WILL BE GLAD TO HEAR YOU FULLY. IT IS NOT A THING I HAVE ASKED OF HIM BEFORE. YOU HAVE ARRIVED, I NOTICE, A DAY EARLY. IT SUITS YOU. M.",
  ),

  // ───────────── the Professor's answers ─────────────
  it(
    "ANSWER_CABS",
    "A foreman, in a hurry",
    "THE CAB AT THE CORNER WAS A DECOY",
    "You stopped the yard in Kentish Town. He sold it on the Thursday to a man in Hackney who has never driven a horse, and moved the one cab that mattered to the next street, where it is waiting now, with its lamps out and a rug over the wheel. It was done quietly, and for a price, and nobody in the yard will say who paid it.",
    "lore",
  ),
  it(
    "ANSWER_MOLE",
    "The Home Office, an internal minute",
    "A NEW MAN AT THE YARD",
    "You put your finger on the Yard's informer, and the Yard thanked you, and dismissed him. The Professor sent his regrets and, by the same post, a young man with excellent references who has been sitting in the second-floor room since Tuesday. Nobody has yet found out why the young man's references are so very good.",
    "lore",
  ),
  it(
    "ANSWER_PAPER",
    "A printer's boy, afterwards",
    "THE PAPER IS PRINTED ELSEWHERE",
    "You turned the printer, and the printer was grateful and very frightened, and told you what he knew. It has made no difference. The Professor's pamphlets are coming off another press in a cellar in Southwark, a better press, in a better ink, and the lies in them are better lies. Nobody in Fleet Street is aware that the press has changed.",
    "lore",
  ),
  it(
    "ANSWER_BANK",
    "A clerk, a note, unsigned",
    "THE MONEY HAS MOVED",
    "You ran the bank, and the bank was run, and every account that you could find was empty by Wednesday. The lieutenants have been paid in coin and told to carry what they need. The Professor has no more use for Lombard Street. And a boy who did an errand for you at the back door of the bank on Wednesday is not at his lodging tonight.",
    "lore",
  ),
  it(
    "ANSWER_CABLES",
    "Mr Fenn, at the cable room",
    "THE CIPHER CHANGED ON MONDAY",
    "You read the whole of a year of his cables, and it was the finest thing that you have done. On Monday he changed the key. It is a new page, and a new book, and a new hour of the day, and Mr Fenn is looking at a column of four-figure groups again with the face of a man who has been told that the shore has moved. The year is read. It is a year old.",
    "lore",
  ),
];

/** Order matters: the first trigger that matches fires, one per transition, so a late card comes before its early twin (their conditions cannot both hold). */
export const reactionTriggers = [
  { interludeId: "DEADLINE_RAIDS_LATE", onEnterNodes: ["Y5"], when: late(-3), stamps: { evidence: -1, nerve: -1 }, setFlags: ["raidsEarly"] },
  { interludeId: "DEADLINE_RAIDS_EARLY", onEnterNodes: ["Y5"], when: early(2), stamps: { nerve: 1 }, setFlags: ["dayInHand"] },
  { interludeId: "DEADLINE_TIDE_LATE", onEnterNodes: ["S8"], when: late(-3), stamps: { hands: -1, evidence: -1 }, setFlags: ["tideMissed"] },
  { interludeId: "DEADLINE_TIDE_EARLY", onEnterNodes: ["S8"], when: early(1), stamps: { evidence: 1 }, setFlags: ["dayInHand"] },
  { interludeId: "DEADLINE_HOTEL_LATE", onEnterNodes: ["C8"], when: late(-3), stamps: { nerve: -1, wires: -1 }, setFlags: ["professorEarly"] },
  { interludeId: "DEADLINE_HOTEL_EARLY", onEnterNodes: ["C8"], when: early(2), stamps: { nerve: 1 }, setFlags: ["dayInHand"] },
  { interludeId: "DEADLINE_CABINET_LATE", onEnterNodes: ["M8"], when: late(-4), stamps: { standing: -1 }, setFlags: ["cabinetStarted"] },
  { interludeId: "DEADLINE_CABINET_EARLY", onEnterNodes: ["M8"], when: early(1), stamps: { standing: 1 }, setFlags: ["dayInHand"] },
  // the answers: an arm cut, and no preparation against the reply
  { interludeId: "ANSWER_CABS", onEnterNodes: ["Y9B"], when: all(flag("cabStopped"), not(flag("watchSet"))), stamps: { evidence: -1, nerve: -1 }, setFlags: ["answeredCabs"] },
  { interludeId: "ANSWER_MOLE", onEnterNodes: ["Y8"], when: all(flag("moleExposed"), not(flag("warrantsSworn"))), stamps: { standing: -1 }, setFlags: ["answeredMole"] },
  { interludeId: "ANSWER_BANK", onEnterNodes: ["S6B"], when: all(flag("bankRun"), not(flag("routeKnown"))), stamps: { hands: -1 }, setFlags: ["answeredBank"] },
  { interludeId: "ANSWER_PAPER", onEnterNodes: ["S8B"], when: all(flag("printerTurns"), not(flag("boysStand"))), stamps: { wires: -1, nerve: -1 }, setFlags: ["answeredPaper"] },
  { interludeId: "ANSWER_CABLES", onEnterNodes: ["M7"], when: all(flag("cipherBroken"), not(flag("lawClause"))), stamps: { evidence: -1 }, setFlags: ["answeredCables"] },
];

/** [scene, flag, text]: what the scene says after the event. */
export const reactionEchoes = [
  ["Y5B", "raidsEarly", "The corridor is full of men who went in at half past three and found the beds still warm. Nobody says anything about your being late. Everybody looks at the clock."],
  ["Y5B", "dayInHand", "The prisoners are brought in at the hour that you said, in the order that you said, and the Yard's clerks have, for once, the paper ready. It is a pleasure to be early."],
  ["S8B", "tideMissed", "The barge is already against the wall, and the tide is already running. You have spent your quarter hour on something else, and the river has not waited."],
  ["S8B", "dayInHand", "The tide is exactly as the lighterman's book said. You are at the stairs a quarter of an hour before it, and the boys are in their places."],
  ["C9", "professorEarly", "He was early. You are not at all sure how long he has been standing on the path, with his hat in his hand, looking at the water."],
  ["C9", "dayInHand", "You are on the path before the sun is on the Falls, and it is quiet, and you have, for the first time since London, a minute in which to think."],
  ["M8", "cabinetStarted", "The Prime Minister has begun without you. You can tell from the way that the secretary looks at his watch, and then at you, and then away."],
  ["M8", "dayInHand", "The room is yours for the hour before the Cabinet sits. Mycroft has had the chairs put straight, and the papers laid out, and he is sitting in the corner with his hands folded, looking pleased."],
  ["Y9B", "answeredCabs", "The cab at the corner has its lamps out, and the horse is the wrong colour. You know a decoy when you are looking at one. It does not make the evening shorter."],
  ["Y9", "answeredMole", "There is a new young man at the second-floor window who does not look at you as you cross the yard. He is the sort of man who does not look at anybody."],
  ["S7", "answeredBank", "A boy is missing from Wiggins's count. Wiggins has not said so. He says everything else, very fast."],
  ["S8C", "answeredPaper", "A pamphlet is on the floor by the door, still wet, in a better ink than you have seen before. It says that you are a fraud, and in a good plain type, and it is nearly convincing."],
  ["M8", "answeredCables", "The cables in your pocket are a year old, and every one of them is true. You find that you hold them a little less firmly than you did."],
];

export const reactionFlagNotes = {
  raidsEarly: "You were slow, and the Yard raided the eleven houses without you.",
  dayInHand: "You were ahead of the hour, and had a day in hand.",
  tideMissed: "The barge came up on the tide before you were ready.",
  professorEarly: "The Professor reached Meiringen before you were ready.",
  cabinetStarted: "The Cabinet sat without you.",
  answeredCabs: "He answered the stopped cab-yard with a decoy cab.",
  answeredMole: "He answered the exposed mole with a new man at the Yard.",
  answeredBank: "He answered the run on his bank by moving the money, and a boy is missing.",
  answeredPaper: "He answered the turned printer with a better press in Southwark.",
  answeredCables: "He answered the broken cipher by changing the key.",
};
