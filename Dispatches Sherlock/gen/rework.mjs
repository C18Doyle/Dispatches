// Round three of the content: the road confirmed at scene 11, options that open on trust, a way back from a bad run, finales with a sure route,
// and the echoes (trust, the lean, the Colonel) that make the earlier choices felt. Called from build.mjs with the scene table and its helpers.
import { opt, flag, res, all, any, not } from "./lib.mjs";

const ax = (a, v) => ({ axis: a, op: ">=", value: v });
const lo = (a, v) => ({ axis: a, op: "<=", value: v });
const always = { any: [{ difficulty: "EASY" }, { difficulty: "MEDIUM" }, { difficulty: "HARD" }] };
const moran = any(flag("moranSeen"), flag("moranMarked"), flag("moranHabits"), flag("moranKnows"));

export function rework({ need, addOption, echo }) {
  // ───────────── scene 11: confirm the road, or change it ─────────────
  const n11 = need("11");
  n11.description =
    "Friday 24 April, evening. Watson is smoking over the fire when you come in, as you have come in three times in a year, through the garden and over the wall, with a face the colour of paper. Your knuckles are bleeding. You tell him that you have been attacked twice more today, and that on Monday the police will close their hands upon the whole of the Professor's gang, if you can keep your own life until then. You chose your road in February. Tonight is the night to be sure of it, or to change it, and to learn whether the door you chose has been kept open for you.";
  n11.options = [
    opt({
      label: "Stay in London and Hold to the Law. Scotland Yard, on Monday, With You at the Table.",
      detail: "The road of proof. It stays open if you chose it in February, or if the Yard still trusts you now.",
      stamps: { standing: 1 },
      needs: [any(flag("leanYard"), all(flag("yardFile"), res("standing", ">=", 0))), "Needs the Yard's trust"],
      who: "Inspector Lestrade",
      says: "Come to the Yard in the morning, Mr Holmes. Bring everything. If we're going to do it, we'll do it on one night, and we'll do it properly.",
      outcome: "You send a note round to the Yard at eleven. The reply comes at midnight, in Lestrade's hand: a time, a room, and the words 'for God's sake bring your papers.'",
      next: "Y1",
    }),
    opt({
      label: "Go to the Streets. Wiggins's Boys, and No One Else.",
      detail: "The road of shadow. It stays open if you chose it in February, or if you hired the boys since.",
      stamps: { evidence: 1 },
      needs: [any(flag("leanStreet"), flag("irregulars")), "Needs the Irregulars"],
      who: "Wiggins",
      says: "We've got every back-door and cab-yard in the Professor's patch marked, Mr Holmes. All we want is the word.",
      outcome: "Wiggins is on the doorstep within the hour, with his cap in his fist and eleven boys behind him in the area. You give the word. London has never looked so large, or so full of corners.",
      next: "S1",
    }),
    opt({
      label: "Put It in Your Brother's Hands.",
      detail: "The road of power. It stays open if you chose it in February, or if your brother still trusts you.",
      stamps: { standing: 1 },
      needs: [any(flag("leanMycroft"), all(flag("mycroftAsked"), ax("trustMycroft", 1))), "Needs your brother's trust"],
      who: "Mycroft Holmes",
      says: "Come to the Club in the morning, Sherlock. Eleven o'clock. You will be received in the Strangers' Room. You will be expected to speak.",
      outcome: "You send a single line to the Club by a street boy. The reply comes in four minutes, on a card of thick cream, in a hand like a row of well-drilled soldiers: 'Eleven. Do not be late. Do not bring Watson. M.'",
      next: "M1",
    }),
    opt({
      label: "Leave England. Take Watson Across the Channel Until the Net Is Drawn.",
      detail: "The road of flight. It is always open, whatever you chose in February.",
      stamps: { nerve: 1 },
      who: "Dr Watson",
      says: "I have my bag. I have my revolver. I have an uncommonly low opinion of the British climate in any case. Where shall we be going?",
      outcome: "You leave the house by the back, over the wall, as you came. At Victoria on Saturday morning there is a first-class carriage reserved in a name that is not yours. It is not a retreat, you tell yourself. It is a change of ground.",
      next: "C1",
    }),
  ];

  // ───────────── a way back from a bad run (once each) ─────────────
  const restOpt = (id, london) =>
    addOption(
      id,
      opt({
        label: london ? "Take a Night at Watson's Fireside." : "Lie By for a Day and Do Nothing Whatever.",
        detail: "Not a decision, a repair. You can do it once. You will come back to this scene a little less ragged, and a little behind.",
        stamps: { nerve: 4 },
        flags: ["restTaken"],
        axis: { trustWatson: 1, company: 1 },
        only: all(res("nerve", "<=", -3), not(flag("restTaken"))),
        who: "Dr Watson",
        says: london
          ? "You are to sit in that chair, Holmes, and you are not to speak of the case. Mary has made a pie. I do not propose to argue."
          : "Not a word about the Professor until tomorrow. I have asked the landlord for a fire and a bottle of something Swiss, and I shall sit up, and you shall sleep.",
        outcome: london
          ? "You sleep in the armchair, in your boots, with a rug that smells of lavender over your knees. You wake at dawn with a stiff neck, a clear head, and the faint, foolish feeling of a man who has been looked after."
          : "You sleep for fourteen hours in a feather bed in a room that smells of wood-smoke, and wake to rain on the shutters and the sound of Watson turning the pages of a very old Baedeker. For the first time in a week you are hungry.",
        next: id,
      }),
    );
  for (const id of ["Y3", "Y6", "S2", "S5", "S7", "M3", "M6"]) restOpt(id, true);
  for (const id of ["C3", "C5", "C6"]) restOpt(id, false);
  const standingOpt = (id) =>
    addOption(
      id,
      opt({
        label: "Let Lestrade Vouch for You.",
        detail: "A word from a man the Yard respects. He can do it once. It will mend a good deal, and it will use up what he had.",
        stamps: { standing: 3 },
        flags: ["standingRepaired"],
        axis: { trustLestrade: -1 },
        only: all(res("standing", "<=", -3), ax("trustLestrade", 1), not(flag("standingRepaired"))),
        who: "Inspector Lestrade",
        says: "I'll say it to the Chief myself, Mr Holmes. I'll say I've known you eleven years. It'll cost me something. I'd as soon you didn't ask what.",
        outcome: "Lestrade is gone an hour, and comes back with his collar undone and his hat in his hand. The Chief has agreed, he says, to take another look. The word goes round the building by noon. Doors that were closed are, for the moment, unlocked.",
        next: id,
      }),
    );
  for (const id of ["Y2", "Y7", "S5", "M2"]) standingOpt(id);

  // ───────────── options that open on trust ─────────────
  addOption("Y1", opt({
    label: "Win Over the Chief Inspector First.",
    detail: "Lestrade has not said a word in your favour. The only man who can change that is the man above him.",
    stamps: { standing: 1, nerve: -1 },
    axis: { trustLestrade: 1 },
    only: lo("trustLestrade", -1),
    who: "The Chief Inspector",
    says: "Mr Holmes, I will be plain. I have heard that you are unsteady. I will listen for ten minutes, and if I am not satisfied you will find that I am a very tedious man to persuade.",
    outcome: "It takes forty minutes, and a good deal of patience, and you leave the Chief Inspector's room with a grudging nod and the beginnings of a reputation for being reasonable. Lestrade, in the corridor, does not look at you. But he opens the door.",
    next: "Y2",
  }));
  addOption("Y9", opt({
    label: "Have Lestrade Hold the Lane Himself.",
    detail: "A man you can trust at the door, with the lantern and the whistle. It is the one watch you will not have to check.",
    stamps: { standing: 1 },
    flags: ["watchSet"],
    needs: [ax("trustLestrade", 2), "Needs Lestrade's trust"],
    axis: { trustLestrade: 1 },
    who: "Inspector Lestrade",
    says: "Leave the lane to me, Mr Holmes. I'll be at the door myself, with the dark lantern, and nobody will come out of it that I haven't had a look at first.",
    outcome: "Lestrade takes the lane in person, in his old coat, with the lantern shuttered and his whistle in his teeth. You turn to the canal knowing that behind you there is a policeman of twenty years' standing who will stand there till the sun comes up. It is the most restful thing that has happened tonight.",
    next: "Y9B",
  }));
  addOption("S8B", opt({
    label: "Let Wiggins Lead the Boys In.",
    detail: "They will do what he says, and he will do what you say. It is a chain of trust that has never before been tried in a warehouse.",
    stamps: { nerve: 1 },
    flags: ["moranDown"],
    needs: [ax("trustWiggins", 3), "Needs Wiggins's full trust"],
    axis: { trustWiggins: 1 },
    who: "Wiggins",
    says: "Leave it to me, Mr Holmes. We've done it before, in a cellar in Bermondsey, and nobody got hurt but a pig. I'll have the Colonel's gun off him before he's had time to be surprised.",
    outcome: "Wiggins goes up the wall like a cat, and the boys go after him in a stream. There is a short, silent, comic struggle on the gantry, a fall of tarpaulin, and a very large man sitting on a very small boy. The air-gun is passed down the line like a bucket at a fire.",
    next: "S8C",
  }));
  addOption("C8", opt({
    label: "Watson Insists on Coming With You.",
    detail: "He will not be sent away, and for once you do not wish to send him. He has earned it.",
    stamps: { nerve: 1 },
    flags: ["watsonStays"],
    needs: [ax("trustWatson", 3), "Needs Watson's full trust"],
    axis: { company: 2 },
    who: "Dr Watson",
    says: "I know what the note is, Holmes. I can read a forgery as well as you. I am not going to the hotel, and you are not going to the Falls without me, and we shall not discuss it.",
    outcome: "He puts the note in his pocket-book, takes his revolver from his bag, loads it in front of you with great deliberation, and puts it in his coat. 'There,' he says. 'Now we may go.' There is nothing at all that you can say, and you do not try.",
    next: "C9",
  }));
  addOption("C8", opt({
    label: "Watson Goes to the Hotel Without Waiting for Your Leave.",
    detail: "He does not trust you to tell him the truth, and he has made up his mind to see for himself. You find him gone when you come down.",
    stamps: { nerve: -1 },
    flags: ["watsonDecoyed"],
    only: lo("trustWatson", -2),
    axis: { company: -2 },
    who: "The proprietor",
    says: "The doctor has gone up the road, sir, with his bag, a quarter of an hour since. He said you were not to be disturbed. I did think it odd.",
    outcome: "The note is on the table, folded small, with a line on the back in Watson's hand: 'I have gone to see. I do not like being managed.' You stand a long moment in the empty room. Then you take your stick, and your hat, and the path.",
    next: "C9",
  }));
  addOption("M1", opt({
    label: "Wait in the Corridor for an Hour.",
    detail: "Your brother has not forgotten how things stood between you. It is a small, cold, very Whitehall way of making the point.",
    stamps: { nerve: -1 },
    axis: { trustMycroft: 1 },
    only: lo("trustMycroft", -1),
    who: "The hall porter",
    says: "Mr Mycroft will be a little while, sir. He has asked me to say that you are very welcome to sit. He has also asked me to say that there is no hurry.",
    outcome: "You sit on a hard chair in a long corridor and look at a portrait of a man who looks like a Lord Chancellor and, you suspect, was. The hour is exactly sixty minutes. When the door opens, Mycroft is behind it with his hands folded, and he says, with a face of perfect blandness, 'Ah. Sherlock. You are early.'",
    next: "M2",
  }));
  addOption("M7", opt({
    label: "Let Mycroft Find a Third Way.",
    detail: "He has been looking at it all night. He knows a form of words that is neither the immunity nor the court.",
    stamps: { standing: 1 },
    flags: ["lawClause"],
    needs: [ax("trustMycroft", 3), "Needs your brother's full trust"],
    axis: { trustMycroft: 1 },
    who: "Mycroft Holmes",
    says: "A closed arrest, Sherlock, and an open trial of the lesser men. The Professor goes to the dock in a month, at a time of my choosing, and the ledger stays in a drawer until it is wanted. It is not a pleasing arrangement. It is the only one that will do.",
    outcome: "He lays it out in a quarter of an hour, in a voice like a man reading out a very long and very exact recipe. When he has finished you find that you have no objection to make. It is the neatest piece of work you have ever seen him do, and you are not at all sure that you like what it means.",
    next: "M8",
  }));

  // ───────────── finales with a sure route ─────────────
  addOption("C9", opt({
    label: "Take the Fight to the Ledge You Scouted.",
    detail: "You know every foot of it. Let him come to you, on the ground you have chosen, and use it.",
    stamps: { nerve: -1 },
    flags: ["noteLeft"],
    needs: [all(flag("ledgeKnown"), res("nerve", ">=", 0)), "Needs the ledge scouted, and a steady nerve"],
    who: "Professor Moriarty",
    says: "You have walked this path before, Mr Holmes. I had wondered. It is the sort of care that does one credit, and it will not, I think, save you.",
    outcome: "You write your four lines on the rock, as before, and set the case upon them. Then you step back, to the second ledge, and the Professor comes along the path after you in the full spray of the fall, swaying, sure-footed and, for the first time in your acquaintance, very slightly out of breath. You know where every inch of it is. You let him come.",
    next: "C10",
  }));
  addOption("C10", opt({
    label: "Follow Your Brother's Plan: a Boat Below the Gorge.",
    detail: "A rope, a ledge, and a man with a boat on the Aare, paid by Mycroft since Thursday. It is the careful way, and it needs both of you to have thought of it.",
    stamps: { nerve: -1 },
    needs: [all(flag("ledgeKnown"), ax("trustMycroft", 2)), "Needs the ledge scouted and your brother's trust"],
    axis: { trustMycroft: 1 },
    who: "Mycroft Holmes",
    says: "There will be a man at the foot of the gorge with a boat and no questions. I do not ask you to use him. I ask you to remember that he is there.",
    outcome: "You go down by the ledge that Hans showed you, hand over hand in the dusk, with the water thundering on the left, and at the foot of the cliff there is, absurdly, a small flat boat with a lantern in it and a Swiss boatman who says nothing at all. He rows you down the Aare in the dark. At midnight you are in a hay-loft above Meiringen with a blanket, and a bottle.",
    next: "H1",
  }));
  addOption("C10", opt({
    label: "Trust Watson's Aim.",
    detail: "He has never missed in a hurry, and he has never been asked to. He is behind you, with his revolver in both hands, and he says that he is ready.",
    stamps: { nerve: -1 },
    needs: [all(flag("watsonStays"), ax("trustWatson", 3)), "Needs Watson beside you, and his full trust"],
    axis: { trustWatson: 1, company: 1 },
    who: "Dr Watson",
    says: "He is on the ridge, Holmes, to the left of the pine. I have him. I shall fire when you say, and you may be very certain that I shall not miss.",
    outcome: "You say the word, and Watson fires, once, with a calm that you have only ever seen in him over an operating table. There is a short cry from the ridge and the soft clatter of a weapon on stone. When the guides' lanterns come up the valley a quarter of an hour later, you are sitting together on the wet rock, laughing like boys.",
    next: "ENDING_WATSON_STANDS",
  }));
  addOption("M8", opt({
    label: "Print the Second Ledger With the Editor's Backing.",
    detail: "A friend at the Standard, an inspector who will stand behind you in the witness box, and a name or two you can prove. It is not a gamble. It is a campaign.",
    stamps: { standing: 1 },
    needs: [all(flag("readSecond"), ax("trustLestrade", 2), res("standing", ">=", 3)), "Needs the ledger read, the Yard's trust and a good name"],
    who: "Mr Alderson of the Standard",
    says: "I have Lestrade to swear to the chain of custody, Mr Holmes, and a Bishop's chaplain who will swear to the signature. I shall print it as a campaign. If they sue us, they shall have to explain the book.",
    outcome: "It runs on a Saturday, in eleven columns, with every name sworn to, and nothing cut. Three Members resign by Monday. By Wednesday the Government has appointed a Commission, and by the end of the summer the Professor's name is the name of an inquiry. It is, everyone agrees, the most complete exposure of its kind in the history of the Press.",
    next: "ENDING_THE_SECOND_LEDGER",
  }));

  // ───────────── a way out of the flight, planned in February ─────────────
  addOption("C1", opt({
    label: "Take the Route You Planned in February.",
    detail: "Written in your own cipher on the inside of a cigarette-case, and booked, and paid. It is the one thing in this whole business that has gone to plan.",
    stamps: { nerve: 2 },
    needFlag: ["routePlanned", "Needs a route planned in February"],
    who: "The travel agent",
    says: "Ah, Mr Dubois. Your tickets are in order, sir, and your places in the second carriage from the end. I am told the boat will be on time. I never say so, but I am told.",
    outcome: "You go straight to your carriage, past a crowd and a smell of coal and wet umbrellas, with the ticket in your hand and not a flutter in your pulse. It is the plainest, quietest, most boring departure in the history of the Continental express, and you enjoy it exceedingly.",
    next: "C2",
  }));

  // ───────────── the echoes ─────────────
  const lean = (id, y, s, m, f) => {
    if (y) echo(id, flag("leanYard"), y);
    if (s) echo(id, flag("leanStreet"), s);
    if (m) echo(id, flag("leanMycroft"), m);
    if (f) echo(id, flag("leanFlight"), f);
  };
  lean("6", "Lestrade has already said at the Yard that you will be 'looking into' a bank clerk. It was not a thing he ought to have said.", "Wiggins's boys have been on the corner for a week, and one of them saw Larch under the lamp before you did.", "A cipher from Whitehall is in your inside pocket. It says, in nine words, that someone at the Bank has been very careless.", "Your papers lie all over the carpet and nobody has seen you in daylight for a week. Larch, who has been watching the house, has been afraid to knock.");
  lean("7", "Lestrade has offered, already, to see you through a magistrate. It is a thing that you would not have had in January.", "Wiggins knows the coaching house. The boys have counted its windows, and its drains, and the cat.", "Whitehall has a file on that coaching house, and has not shown you the file.", "You know the house by its roof and its drains, and have drawn it twice on the back of your own cipher.");
  lean("8", "The Yard's fires are warm, and its doors are open. You find that you are not afraid of them.", "Your boots are wet from three nights on the quay, and there is a smell of tar on your coat that Watson does not remark upon.", "You have a Foreign Office card in your breast pocket, and the odd, unfamiliar sensation of having been taken seriously.", "You have not been out of the house in five days, and you are aware that Watson has noticed.");
  lean("10", "The Yard's men are already moving, and the Professor knows it. It is the only reason that he has come.", "The boys are outside, in the area, twelve small faces at twelve small windows. He has, you think, counted them.", "Whitehall's men are watching the street. The Professor has seen them, and he has come anyway, which tells you something.", "He is not at all surprised to find you alone. He remarks on it, with the interest of a collector.");
  echo("10", always, "As he goes, on the landing, a very tall man in a long coat steps aside to let him pass, with an odd-shaped stick under his arm, and lifts his hat to you. You have never seen him before. You will be a long time forgetting him.");
  echo("M1", flag("priceNamed"), "You know the price already. Mycroft named it in February, and has not once mentioned it since, which is how you know that he has not forgotten.");
  echo("M4", flag("fofClerk"), "Greaves has the Foreign Office clerk's file under his arm. He has the manner of a man who has seen a better coat than his own.");
  echo("M4", flag("greavesKnown"), "You have met the Superintendent before, at a Club that does not speak. He nods, once, as though it had been a funeral.");
  const m = (id, text) => echo(id, moran, text);
  m("11", "At the corner of the street, a long coat and an odd-shaped stick that never touches the pavement. He is not there when you look again.");
  m("Y4", "A man with a long coat and a walking-stick that he does not lean on has been seen at the end of Baker Street twice in a week. Mrs Hudson thought he was a clergyman.");
  m("Y9", "Somewhere in the dark there is a soft metallic click, like a brass catch, that might be a latch or might not.");
  m("S1", "The Colonel's name is on the boys' map in a different colour, and a line under it, and a question mark.");
  m("S5", "Lestrade has a note about a tall Englishman with a brown face who has been asking for you at three different cab-ranks. He thinks it is a client.");
  m("M5", "Greaves says, without being asked, that the Colonel has not been seen in London since Friday, and that it is the only thing that has worried him.");
  m("C2", "A tall man with a violin-case is standing at the far end of the platform, looking at the clock. You do not look twice. You do not need to.");
  m("C6", "The guide in the hotel hall remarks, as if it were a trifle, that a gentleman with a long coat and a stick has asked for you by name.");
  m("C7", "On the table in the hall of the inn there is a violin-case that does not belong to anyone, and nobody will say whose it is.");
  m("H2", "At the foot of the pass, in the dusk, a mule driver says that a tall Englishman asked him the way to a Norwegian. He gave a wrong answer, he says, out of habit.");
}
