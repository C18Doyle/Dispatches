import { flag, res } from "./lib.mjs";

/** Additions to flavor.json for the second round. */
export const flavor2 = {
  flagNotes: {
    clueHeel: "You read the heel-print on the roof in Vere Street.",
    clueCab: "You followed the cab's ruts to the mews gate.",
    fitchNamed: "You named the cabman Fitch from the Kentish Town yard.",
    codexFound: "You recovered the Clerkenwell codex.",
    yardLearned: "You learned what the Kentish Town yard is for.",
    governessSafe: "You kept Miss Crewe out of the Professor's hands.",
    governessBait: "You used Miss Crewe as bait for the printer.",
    dogcart: "The boys found the dog-cart with the yellow wheels.",
    confessed: "You owned up to the break-in at Marylebone.",
    pressInformed: "You gave the Standard its exclusive for Monday night.",
    secretaryTalks: "The bishop's secretary told you the cab-yards.",
    pawnbrokerTalks: "Mrs Venn gave you the key to the cipher.",
    clueDoor: "You found the panel behind the Professor's desk.",
    clueGuide: "You learned the missing book was a railway guide.",
    studyRead: "You read where the Professor went from his study.",
    watchSet: "Your watch on the house in Hackney was properly set.",
    roofWatch: "Wiggins's boys held the rooftops in Hackney.",
    canalOnly: "You staked the whole watch on the canal.",
    cabStopped: "You stopped the Professor's cab.",
    moranHabits: "You learned the Colonel's habits.",
    printerTurns: "The printer sailed for Canada and left you his plates.",
    boysStand: "The boys stayed, because you told them the truth.",
    boysFewer: "Five of the boys went home, and seven stayed.",
    byWater: "You came to the wharf by water.",
    byRoof: "You came to the wharf over the roof.",
    openQuay: "You walked down the quay in the open.",
    moranDown: "You put the Colonel out of the fight.",
    strangerShaken: "You shook the stranger on the Basel train.",
    watsonWarned: "You told Watson what you meant to do at the Falls.",
    ledgeKnown: "You walked the ledge above the Falls with Hans.",
    tellNoOne: "You told no one that you lived.",
    mycroftKnows: "You told your brother, and him alone, that you lived.",
    wroteWatson: "Your letter from Florence reached Watson.",
    moranKnows: "Your letter from Florence was opened by the wrong man.",
    returnedEarly: "You came home once in 1893 to sit with Watson.",
    dramaticReturn: "You returned as an old bookseller.",
    gentleReturn: "You returned by the old stair, to a supper laid.",
    crownTerms: "You accepted the Government's terms.",
    lawClause: "You wrote the law into the Government's terms.",
    homeOfficeWarrant: "You carried the Home Secretary's warrant.",
    readSecond: "You read the second ledger to the last page.",
    cleanHands: "You would not open the second ledger.",
    specialBranch: "Special Branch took the Professor's house in silence.",
    ministerTurned: "Lord Harcastle talked, and was spared.",
    ministerHeld: "You hold Lord Harcastle's word in your pocket-book.",
    immunityAccepted: "You backed your brother's immunity for the Professor.",
  },
  novelNotes: {
    ENDING_THE_RETURN: "In the Canon: this is the opening of The Empty House (1903). Holmes returns to London in April 1894, with the Park Lane murder of Ronald Adair as his occasion. He reveals himself to Watson, who faints, and explains afterwards where he has been. The game gives you the choice of how.",
    ENDING_HER_MAJESTYS_SERVICE: "In the Canon: Holmes does work for the Government in later stories, through Mycroft, as in The Bruce-Partington Plans, where Mycroft calls on him to take up a government matter. The game's quiet office off Whitehall is its own invention.",
    ENDING_THE_SECOND_LEDGER: "In the Canon: nothing like this. Doyle's Holmes never exposes the powerful to the press, and in Charles Augustus Milverton he burns a blackmailer's letters rather than hand them to the police. The great scandal is this game's invention.",
  },
  endingHints: {
    ENDING_THE_RETURN: "Survive the Falls, win the struggle, and choose to come home from the years away.",
    ENDING_HER_MAJESTYS_SERVICE: "Take the road through your brother's club, and accept the Government's terms in full.",
    ENDING_THE_SECOND_LEDGER: "Take the road through your brother's club, read the second ledger, and put it in the newspapers.",
  },
  gossip: [
    { when: res("nerve", ">=", 4), lines: [
      "Mrs Hudson: 'You're looking a deal better, sir. There's colour in your face. I shall tell the butcher.'",
    ] },
    { when: flag("codexFound"), lines: [
      "The newsboy: 'There's a gentleman at the Institute says you're a marvel, sir. He's sent a hamper. Mrs Hudson has it in the larder.'",
    ] },
    { when: flag("governessSafe"), lines: [
      "Watson, by note: 'Miss Crewe sends you her kindest regards, and a pot of quince jelly which I'm not at all sure is safe.'",
    ] },
    { when: { branch: "MYCROFT" }, lines: [
      "A club servant: 'Nobody talks here, sir, except in the one room. We find that it improves the conversation.'",
      "A Whitehall messenger: 'You'll want the third door, sir, on the left. It's not on the plan, but it's the one they all use.'",
    ] },
    { when: { branch: "HIATUS" }, lines: [
      "A fellow traveller: 'The English, I find, are not so very mad. They are only lonely, and they walk a great deal.'",
    ] },
  ],
  howToPlay: [
    {
      heading: "Your Part",
      body: "You are Sherlock Holmes. The Case-Book holds one major case, The Final Problem, and four short ones that stand alone. Each scene is a dated report. Read it, then choose: tap an option once to mark it and again to confirm. Early choices open and shut later doors.",
    },
    {
      heading: "The Gauges",
      body: "Evidence, Standing and Nerve run from minus ten to plus ten: what you can prove, the trust of the Yard and the press, and your own calm. Under them run the Strand: Hours, Hands and Wires, from minus eight to plus eight. A low gauge brings a warning card, and at the bottom the case is lost. Watch the lowest.",
    },
    {
      heading: "Gambits",
      body: "A choice with a percentage is a gamble. The odds rise and fall with the gauge the scene names, and a gauge that is badly short takes points off. Success and failure each have their own story.",
    },
    {
      heading: "Baker Street",
      body: "The buttons above a scene open one panel each. Baker Street holds Watson's advice, Mycroft's Favour, overheard talk and Watson's Notebook. Company shows who trusts you. Board holds your traces and open questions. Calendar and Map show where and when you are.",
    },
    {
      heading: "Difficulty",
      body: "Choose it on the Case-Book before you open a case. On Watson's Account every choice shows its cost and a button offers Watson's suggestion. On the middle setting you deduce the cost. On the hardest, money is thin and some choices are shut to a poor man.",
    },
    {
      heading: "Real and Invented",
      body: "The cases follow Conan Doyle's stories, and each ending says afterwards what the original does. Most of the scenes, the clerk Larch, Sergeant Pike, the boy Alf and the newspaper clippings are invented, and so is Irene Adler's letter of 1891.",
    },
  ],
};
