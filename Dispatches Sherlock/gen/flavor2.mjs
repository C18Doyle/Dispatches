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
      body: "The Case-Book on your table holds five volumes. The thick one is the major case, The Final Problem of 1891. The four thin ones are minor cases that stand alone: The Speckled Band (1883), A Scandal in Bohemia (1888), The Blue Carbuncle (1889) and The Red-Headed League (1890). A minor case is four scenes long, with four endings (the fourth is hidden until you have made the right choices), shares nothing with the major case, and is a good way to learn the game. The shelf remembers which endings you have found, and offers to resume an unfinished case. The rest of this page is about The Final Problem. You are Sherlock Holmes, from the first week of January 1891, hunting a man who has never been charged with a crime. Each scene is a dated report. You read it, and choose how to answer. Tap an option once to mark it, and again to confirm it. What you choose changes what comes next, and some doors open only for a detective who has done the right things earlier. You choose your road early, within a few scenes.",
    },
    {
      heading: "Evidence, Standing and Nerve",
      body: "Three gauges run from minus ten to plus ten. Evidence is what you can prove in a court. Standing is the trust of Scotland Yard, the magistrates and the press. Nerve is your own health and calm. When a gauge falls to minus seven, a warning card appears. At minus ten, the story ends in ruin. Watch the lowest gauge more than the highest.",
    },
    {
      heading: "The Strand",
      body: "Under the three gauges run three smaller lines, which the game calls the Strand, after the street and the magazine. Hours is time in hand: slow, patient work spends it. Hands is the people at your disposal: Watson, the boys, the Yard's men. Wires is your reach: a telegram, a file, an informant, the press. Each line runs from minus eight to plus eight, and has its own warning card at minus five. Any one of them at minus eight cuts the Strand, and the Professor goes untouched. A Strand line that is short also makes a gauge harder to fill. Keep the three in step, and do not spend the same line twice. Watson notices when one runs short, and says so in his notebook.",
    },
    {
      heading: "Gambits",
      body: "Some choices are a gamble, and show a percentage. The odds rise or fall with a gauge named in the scene. A gauge that is badly short also takes points off every gambit that depends on it, which the game calls strain. Success and failure each have their own story.",
    },
    {
      heading: "Baker Street, and Who Trusts You",
      body: "The five buttons above each scene open one panel at a time. Baker Street gives you Watson's advice (a few times in a game, it shows what each choice will cost), Mycroft's Favour (once, one gauge improves at the cost of another), overheard talk, and Watson's Notebook, his private opinion of the man you are becoming. Company shows how far Watson, Lestrade, Mycroft and Wiggins trust you, and the last thing each was heard to say. Some options open only to a detective they trust, and a few only to one they have lost. Board is your cork board: the traces, people and moves you have pinned up, the Professor's web with the arms you have found and cut (he notices), and the questions you cannot yet answer. Calendar shows where the scene falls in the winter and spring of 1891 and how long to the next date that matters; when your Hours run short it also shows how many days the calendar has already taken from you. Map is the sketch map.",
    },
    {
      heading: "When a Gauge Runs Short",
      body: "A gauge that is badly short makes the others harder: a tired mind reads less, a man without proof is not believed, a discredited man cannot rest. The scene says so while it is true. A man at the bottom is offered a way back, once: a night at Watson's, or a word from Lestrade, if he has earned it. It will not cure a bad road. It will let you keep walking.",
    },
    {
      heading: "Side Cases and Examinations",
      body: "In Act I you may take on one of three small cases, or decline them all and rest. Twice in the story you are asked to examine a scene, three scenes running. Before you leave Baker Street on the last Friday, you may pack a disguise: the priest, the sailor or the clerk. It opens a choice later on that a man in his own face cannot have. Pick what to look at with care: the traces you read decide whether you can state a deduction at the end. A trace you did not read cannot be guessed at.",
    },
    {
      heading: "Four Roads, Chosen Early",
      body: "A few scenes into the story you must choose how to meet the Professor's net: through Scotland Yard, through the street boys of Baker Street, through your brother's club in Whitehall, or by flight across Europe. Each road has its own people and its own endings, and each ends in a short run of scenes that your earlier choices make easier or harder. Some roads are shut until you have earned them.",
    },
    {
      heading: "The Map",
      body: "The map button shows where you are, and the trail you have followed. It is a sketch and not a survey: the streets and the coasts are only approximately where the game puts them.",
    },
    {
      heading: "Look and Sound",
      body: "Settings offers two looks: tweed, a dark parlour with cream paper cards, and paper, the same parlour in daylight. Both have the same houndstooth ground. There are three text sizes, and the atmosphere (a drone of fog and a distant chime) and the sound effects can be turned down or off. Nothing flashes, and motion stops if your device asks for it.",
    },
    {
      heading: "Difficulty",
      body: "On the easiest setting every choice shows its cost first, and a button offers Watson's suggestion for any scene, so that you may read the story with one tap at a time. On the middle setting you must deduce the cost. On the hardest, bribes, tickets and informants cost real money from a thin purse, a choice you cannot afford is shut to you, and a few extra choices are offered only to a man who is short of funds.",
    },
    {
      heading: "What Is Real and What Is Not",
      body: "This game follows the outline of Arthur Conan Doyle's story The Final Problem (1893) and, at the end of one road, The Empty House (1903): Professor Moriarty, the flight across the Continent, the Reichenbach Falls and the return. The four minor cases follow Doyle's A Scandal in Bohemia (1891), The Adventure of the Speckled Band (1892), The Adventure of the Blue Carbuncle (1892) and The Adventure of the Red-Headed League (1891). Irene Adler's letter in 1891 is the game's own invention. Most of the scenes, the clerk Larch, Sergeant Pike, the boy Alf and the newspaper clippings are invented. Each ending says, afterwards, what the original story does.",
    },
  ],
};
