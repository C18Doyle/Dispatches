import { opt, node, flag, res, all, any } from "./lib.mjs";

/**
 * Round five: two investigations each for the street and the flight, two more scenes for Mrs Norton, and a second chance at each of the three finales
 * that used to hang on a single roll.
 */
const ax = (a, v) => ({ axis: a, op: ">=", value: v });

export const moreNodes = [
  // ───────────── the street road: reading the river ─────────────
  node(
    "SX1",
    "STREET",
    "Reading the River",
    "Sunday 3 May, a flat grey morning. The Limehouse reach on a Sunday is shut and rather lovely, a long brown water with tarred sides moored along it, and not a crane moving. Wiggins has found a boat, and a man to row it, and has told the man that you are looking for a lost dog. You have two days, and a warehouse that you have so far seen only from the inside of a bad night. It is time to read the place the way that you read a hat. The river has been used for a good many years by a good many people, and it forgets nothing that is written on it.",
    [
      opt({
        label: "Read the Tide Tables Against the Lighterman's Book.",
        detail: "A barge comes up on the top of the tide or not at all. If the Professor has a ship, there is a day on which she will be there, and the book will say it.",
        stamps: { evidence: 1, hours: -1 },
        flags: ["wharfTide"],
        who: "A lighterman",
        says: "The Teal comes up on the top of the tide on Tuesday, a quarter past eight, and she never takes a load. Not once in a year. Rides high as a cork, she does, and goes out as light as she came in.",
        outcome: "He lends you the book, in a pub, with a pot of tea, and you go down the column with your finger. It takes half an hour. By the end of it you know the hour, to the quarter, at which the thing that is going to happen on Tuesday will happen, and you know that there is a stair at the water's edge that will be dry at that hour and under water an hour afterwards.",
        next: "SX2",
      }),
      opt({
        label: "Watch the Wharf From a Hired Barge.",
        detail: "A man in a boat with a pipe is the least interesting thing on the river. You may lie off the water-stairs all morning.",
        stamps: { evidence: 1, hands: -1 },
        flags: ["wharfWatch"],
        who: "A bargee",
        says: "That's the third time that cart has been in and out since seven, guv'nor, and it's a Sunday. There's nothing to deliver on a Sunday.",
        outcome: "You lie off the stairs with a line over the side and watch the gate in the way that a cat watches a hole. In three hours you see a cart, a small boy with a loaf, and a tall, stooping gentleman who does not come out again. It is not the Professor. It is someone who knows the Professor, and who walks in the way that a man walks who is sure of his welcome.",
        next: "SX2",
      }),
      opt({
        label: "Ask the River Police Who Pays for the Moorings.",
        detail: "A wharf is rented, and a lease is a name. The Thames Police keep a book, and the sergeant of the Wapping station owes Lestrade a favour.",
        stamps: { standing: 1, wires: 1 },
        flags: ["wharfPolice"],
        axis: { trustLestrade: 1 },
        who: "The sergeant at Wapping",
        says: "The lease is in the name of a Mr Alexander Bell, of nowhere, paid quarterly, in notes. I should be glad if somebody would tell me why a man pays a thousand a year for a warehouse that has never in four years had a cask of anything in it but oil.",
        outcome: "He is delighted to be asked, and has been waiting for the better part of a year for somebody to ask. You leave with a copy of the lease, a plan of the foreshore and a promise that the Thames Police will be looking the other way on Tuesday at eight. It is not much. It is the first time in the week that anyone has offered to look the other way on your behalf.",
        next: "SX2",
      }),
    ],
  ),
  node(
    "SX2",
    "STREET",
    "The Chalk and the Lamp-Oil",
    "Monday 4 May, noon. Wiggins and three of the boys are lying on the roof of a sugar-warehouse across the water-lane with their chins on their fists, and Alf has been sent to buy a pennyworth of toffee at a shop that has a view of the gate. The warehouse is a plain, high, flat-faced building with a hoist at the top and a double door at the bottom, and it has, in an ordinary light, nothing to say for itself at all. In the light of a Monday noon, with a lens, it has three things. There is chalk on the bollards. There are casks at the gate. And there is a carter who comes every day, at the same hour, with the same loaf.",
    [
      opt({
        label: "Read the Chalk Marks on the Bollards.",
        detail: "Three crosses and a bar, on every post from the stairs to the gate. It is not a child's game. It is the way that a thing is laid out in the dark.",
        stamps: { evidence: 1 },
        flags: ["wharfMarks"],
        who: "Wiggins",
        says: "I told you, Mr Holmes. Three crosses and a bar, and they go up to the door and they stop. And the last one's got an arrow on it, pointing at the floor. I'd not say it was a child that did it. A child would've drawn a face.",
        outcome: "You go down the row with a lens and a pencil. They are not a child's. They are a route: the stairs, the gate, the yard, the door, a flight of steps that goes down and not up, and an arrow at the end of it. Someone who is not the Professor has laid out the way to a place in the building that he does not wish to be found in. It is the sort of thing that is useful only to the man who is expecting to be followed.",
        next: "S8",
      }),
      opt({
        label: "Count the Lamp-Oil Casks Through the Slats of the Gate.",
        detail: "A warehouse that has never in four years held anything but oil has, on the Monday of the raid, more oil than it ever held. A fire is being prepared.",
        stamps: { evidence: 1, nerve: -1 },
        flags: ["wharfOil"],
        who: "Alf",
        says: "Forty-one, Mr Holmes, and I counted twice. And the ones at the back haven't got any of them tops on. I think they've been took off. They stink something dreadful.",
        outcome: "You do not need to count them. You smell them from the far side of the lane, a sweet, rank, greasy smell that goes into the back of the throat. There is a good deal more of it than a respectable warehouse would keep, and the casks have been moved, since Saturday, from the back of the building to the front. Somebody is not intending to leave the place as he found it. You write down forty-one, and underline it, and decide that you will need to know where the hoist-chain is.",
        next: "S8",
      }),
      opt({
        label: "Follow the Carter Who Brings the Bread.",
        detail: "A man who brings bread to an empty warehouse every day at noon is feeding somebody. He may be feeding the man you want.",
        who: "The carter",
        says: "Gov'nor? I just brings the bread. A gentleman pays me a shilling at the Prince of Wales in Cable Street, and he's never said what he wants it for.",
        roll: {
          p: 0.6,
          scale: ["nerve", 0.03, 0.35, 0.85],
          ok: {
            text: "He has a bad cough, a dray with a weak wheel, and no instinct whatever for being followed. You are with him to the Prince of Wales and a hundred yards past it, and when he comes out you have the name of the gentleman who pays him, and the hour at which the gentleman collects the bread. It is a name that you do not know and a habit that you can use.",
            stamps: { evidence: 2 },
            flags: ["wharfCarter"],
          },
          bad: {
            text: "He is a good deal less stupid than he looks. At the second corner he stops his dray, gets down, and stands looking at the horse's off hind hoof with an attention that no horse's hoof has ever merited, until you have gone past. When you look back he has gone. The bread has not been delivered. It is a message, and it is read at the other end in under ten minutes.",
            stamps: { evidence: -1, nerve: -1 },
          },
        },
        next: "S8",
      }),
    ],
    [
      [flag("wharfTide"), "In your pocket-book is the hour of the tide, to the quarter, and the name of a barge that never takes a load."],
      [flag("wharfPolice"), "A copy of the lease is folded in your coat. It is in the name of a Mr Alexander Bell, who does not exist."],
    ],
  ),

  // ───────────── the flight: reading the hotel and the path ─────────────
  node(
    "CX1",
    "CONTINENT",
    "The Hotel Register",
    "Monday 4 May, eight in the morning. It is a fine, hard morning, with the Alps standing up out of the valley like things that have been washed, and a smell of coffee and woodsmoke from the Englischer Hof. The Professor is somewhere on the line from Interlaken, and will be here before four. Before that, you have the hotel. You know, as you know the weather, that somebody will try today to separate you from Watson, and that the means will be a message, and that the message will be in a hand that is not the sender's. You have six hours, and a house full of people who are paid to be incurious.",
    [
      opt({
        label: "Read the Hotel Register.",
        detail: "A ledger of names, with a column for nationality and a column for the date. It will say who is here and who is not.",
        stamps: { evidence: 1 },
        flags: ["registerRead"],
        who: "The proprietor",
        says: "An English lady, Monsieur? Madame, I regret that there is no English lady in this house who is ill. There is a Mrs Fenwick of Bath, who is perfectly well, and a Miss Sutherland, who is out walking.",
        outcome: "He is shocked, and then he is helpful. You go down the register with your finger. There is no English lady who is ill. There is none who has sent for a doctor. There is, at the foot of the page, a gentleman who arrived on Saturday with a small bag and a violin-case and who has taken the room immediately over the stair, and who is out.",
        next: "CX2",
      }),
      opt({
        label: "Question the Stable-Boy About Who Has Hired the Guides.",
        detail: "A guide is a man who knows where the path goes. It would be as well to know who has paid him to keep away.",
        stamps: { evidence: 1, wires: 1 },
        flags: ["guideTalks"],
        who: "The stable-boy",
        says: "Hans has gone down to Interlaken, sir, with the other two, and he was told that he would not be wanted until the Wednesday. The gentleman paid him in gold. I have never seen so much gold in a week.",
        outcome: "He tells it in the Swiss German of the valley, and a good deal of it goes by, but the substance is plain. Every guide in Meiringen who could have told you the path has been paid to be somewhere else. It is a very economical piece of work: not one threat, and not one lie. The Professor has simply, and with great politeness, bought the whole of a village.",
        next: "CX2",
      }),
      opt({
        label: "Look at the Forms at the Telegraph Office.",
        detail: "A forged message has to be written, and written on something. The little office at the foot of the street keeps its forms.",
        stamps: { wires: 1, evidence: 1 },
        flags: ["formsRead"],
        who: "The telegraph clerk",
        says: "The message for the English doctor? It was handed in at half past ten, Monsieur, at the counter, by a boy. It was written in pencil, on one of our forms, with a very good English hand. It was not, I think, written by a lady.",
        outcome: "You turn over the copies of the morning's messages, which he is extremely reluctant to let you see and perfectly willing to let you see for a franc. It is there: a request, in a clear and rather mannered English, for Dr Watson to come at once to the hotel at the foot of the Falls. The writing is the writing of a man who has been told what a woman's handwriting looks like. You put it in your pocket-book beside the ticket, and you underline the time.",
        next: "CX2",
      }),
    ],
    [
      [flag("adlerWarned"), "Mrs Norton's warning is in your head like a small cold coin. A message, in the morning, for the Doctor. You have not told Watson. You intend to."],
      [flag("adlerWatch"), "At the foot of the stair, with a book, a lady in grey is reading the same page that she was reading at dinner. She does not look up."],
    ],
  ),
  node(
    "CX2",
    "CONTINENT",
    "The Path in Daylight",
    "Monday 4 May, ten in the morning. The path above the Reichenbach is a path of rock and wet roots, cut into the side of the gorge, going up and round through the spruce. It ends at a broad flat ledge on the lip of the upper fall, and the ledge ends in nothing at all. It is the loveliest and the least comfortable place that you have ever been. By dusk it will be the place where one of two men will not be. Now it is a place in a book. You have an hour, a walking-stick, and the knowledge that you will not be given another chance to look at it.",
    [
      opt({
        label: "Walk the Path to the Fall and Read the Ground.",
        detail: "A path is a record. Every man who has gone along it has left something, and the wet makes it last.",
        stamps: { evidence: 1, nerve: -1 },
        flags: ["pathRead"],
        who: "Your own notebook",
        says: "Two sets of prints up, since the rain: a heavy boot, a light boot. None down. And at the ledge a place where the moss has been scraped by a heel, in the way that a man scrapes it who is preparing to be thrown.",
        outcome: "You go up in the cold, with the roar of the water growing, and stand on the ledge with your toes at the edge. It is a hundred and sixty feet to the black water and a cloud of spray comes up over the lip in slow, soft puffs. Nothing could be quieter than the place where a man will die. On the way down you notice two things: the path is much wider than it looks, and in one place, at a bend, it is not very much wider than a man.",
        next: "C8",
      }),
      opt({
        label: "Find the Cleft in the Rock Below the Ledge.",
        detail: "There is a place at the foot of the cliff-face where a small man might go over the edge of the path and not be seen from the ledge. It will want a rope, and a good deal of care.",
        stamps: { hours: -1, nerve: -1 },
        flags: ["cleftSeen"],
        who: "Dr Watson",
        says: "You are going over the edge of a cliff, Holmes, with a rope, in a pair of boots that were bought for Bond Street. I should like to be told what you propose to find there.",
        outcome: "It takes the whole hour, and a good deal of language. But you find it: a narrow cleft in the rock, a few feet below the lip of the path, with a ledge that will take the weight of a man lying flat, and a root as thick as your wrist to hold by. From the path above it is invisible. You lie in it for a full minute, with the spray on your face and the sky going round, and feel, for the first time in a week, perfectly calm.",
        next: "C8",
      }),
      opt({
        label: "Leave the Path Unread and Rest Before the Afternoon.",
        detail: "You will need your head by four, and a man who has walked a cliff-path in the morning has not got one.",
        stamps: { nerve: 1 },
        who: "Dr Watson",
        says: "I am extremely glad to hear it, Holmes. I was beginning to think that you would not sleep again until you had gone over the edge yourself.",
        outcome: "You go back to the hotel and lie on the bed with your boots on and your hands behind your head, and for two hours you do not think about anything at all. It is the nearest thing to a prayer that you have said for years. Watson looks in, once, and goes away again on tiptoe, with a face of such tender concern that you are obliged to pretend to be asleep.",
        next: "C8",
      }),
    ],
    [
      [flag("registerRead"), "Somewhere in the Englischer Hof there is a man with a violin-case, who has taken a room over the stair and is, at present, out."],
      [flag("guideTalks"), "There is not a guide in the valley who will tell you where the path is wide and where it is narrow. You are left to your own legs, and the spruces."],
    ],
  ),

  // ───────────── Mrs Norton again ─────────────
  node(
    "AC",
    "CONTINENT",
    "The Lady in Grey",
    "Sunday 3 May, ten at night. A knock at the door of your room at the Englischer Hof, and it is not the knock of a servant. It is a short, rapid, businesslike rap, and when you open the door there is a lady in a grey travelling-dress, with a veil put back, who says that she is very sorry to disturb you and not at all sorry to have found you. You last saw her at Briony Lodge, on the day she burned a packet in a pair of tongs. She is paler, and a little thinner, and she has the air of having walked a great way in order to say a thing that she has been a long time rehearsing. It is Mrs Norton, and she has not come for the view.",
    [
      opt({
        label: "Hear Her Warning About a Message.",
        detail: "She has been in the hotel two days, and has been listening. A woman at a table with a book hears everything.",
        stamps: { evidence: 1 },
        flags: ["adlerWarned"],
        axis: { trustAdler: 1 },
        who: "Mrs Norton",
        says: "There is a boy in the yard who has been paid a franc to run with a message at noon tomorrow. I have not seen the message. I have seen the man who wrote it. He was tall, and he walked as if he had been in India, and he did not at any point look at me, which I thought was unusual in a man who had been staring at the door for an hour.",
        outcome: "She says it in four sentences, as she would give evidence, and she does not ask for anything. You thank her, and she says that thanks are unnecessary, in a tone that suggests that they are, on the contrary, extremely necessary and that she is a good deal too proud to say so. You have, at the end of it, a time and a description and a face. You also have, very distinctly, the feeling of having been given something that you cannot pay for.",
        next: "CX1",
      }),
      opt({
        label: "Ask Her to Watch the Hotel in the Morning.",
        detail: "A woman at a table with a book is the best watcher in Europe. She will see who comes to the desk and who goes to the stable.",
        stamps: { hands: 1, nerve: -1 },
        flags: ["adlerWatch"],
        axis: { trustAdler: 1 },
        who: "Mrs Norton",
        says: "You wish me to sit in the hall and read my book, and to remember who goes past. Mr Holmes, I have sat in halls and read books all my life. I think it is the only thing that I am really good at. Yes.",
        outcome: "She agrees at once, and without the least show of reluctance, and goes away to her room with the lamp. You hear her door close, and, a little after, the faint, domestic sound of a woman winding a watch. You sleep, which you had not expected, and in the morning you find that the chair at the foot of the stair has been occupied since six, by a lady in grey, with a book, who does not look up.",
        next: "CX1",
      }),
      opt({
        label: "Thank Her and Send Her Back to Brussels.",
        detail: "The Professor is not a man who forgives an accomplice. She has done a great deal already, and it would be wrong to let her do more.",
        stamps: { nerve: 1 },
        flags: ["adlerSent"],
        axis: { trustAdler: -1, heart: 1 },
        who: "Mrs Norton",
        says: "You are sending me away. I thought that you might. It is quite all right. You are being kind, and I am not at all accustomed to being protected, and I find that I do not like it. But I shall go.",
        outcome: "She goes down the stairs in the grey dress with her bag in her hand, as if she were leaving a theatre. You watch her from the window all the way to the station. She does not look back. In the morning, at the desk, there is a note for you in a firm hand, in violet ink. It says, 'Quite so,' and nothing else, and you keep it, with the other one.",
        next: "CX1",
      }),
    ],
  ),
  node(
    "AY",
    "YARD",
    "A Witness From St John's Wood",
    "Thursday 11 June, a little after nine in the morning. A note was left at Baker Street in the night, on violet paper, in a hand that you know. It says that Mr Hector Dunmore of Brandt and Chambers has been seen with a certain gentleman in the neighbourhood of the Old Bailey, and that she has, in consequence, taken it upon herself to walk across London on a wet morning and stand in the corner of Lestrade's room until somebody gives her a chair. She is there when you arrive, in the grey dress, on the hard chair, with her gloves in her lap. Lestrade is looking at her with the fixed, wary civility of a man who has been told that a lady is a witness and has not yet been told what for.",
    [
      opt({
        label: "Take Her Sealed Statement to Lestrade's Desk.",
        detail: "She has written it down, in a firm hand, in the order in which it happened. It names the buyer and the bank. It is the first piece of evidence in the case that a jury might look at twice.",
        stamps: { evidence: 1, standing: 1 },
        flags: ["adlerStatement"],
        axis: { trustAdler: 1, trustLestrade: 1 },
        who: "Inspector Lestrade",
        says: "I don't know what to make of her, Mr Holmes, and that's the truth. But I know what to make of a statement that gives a date, a bank and a man's name, and that's a thing I can swear to a magistrate. I'd be obliged if you'd tell the lady that I'm much obliged.",
        outcome: "She signs it with a flourish, at the Inspector's blotter, and he reads it standing, with his lips moving. At the end he folds it into his inside pocket beside the warrants, and pats it, and looks at you with the beginnings of respect. It is, you reflect, an extraordinary thing, that two such different people should have found, in the course of five minutes, that they liked one another.",
        next: "Y9",
      }),
      opt({
        label: "Tell Her to Stay Out of Court and Out of London.",
        detail: "She has done enough. The Professor's people have a long memory, and a witness is a person who can be found.",
        stamps: { nerve: 1 },
        flags: ["adlerSafe"],
        axis: { trustAdler: 1, heart: 1 },
        who: "Mrs Norton",
        says: "You are trying to protect me. It is rather sweet, and quite useless, but I shall do as you ask. I shall be on the Continent by Saturday, and I shall be extremely hard to find. You may tell Mr Lestrade that I am sorry to have wasted his chair.",
        outcome: "She rises, shakes hands with the Inspector, who has never in his life shaken the hand of a lady in a Scotland Yard office and is plainly not sure what to do with his thumb, and goes out. You see her to a cab. In the doorway she turns, and says that she has a feeling that you are going to be unhappy for a little time, and that she would very much like it if you did not do it alone. Then the cab goes, and the rain.",
        next: "Y9",
      }),
      opt({
        label: "Ask Her to Dine With Mr Dunmore.",
        detail: "It is a dangerous request and a good plan. She is the only person in London who can be in a room with him and be expected.",
        who: "Mrs Norton",
        says: "You wish me to dine with the man who tried to buy my letters, and to be charming, and to find out where he keeps the rest of the money. I think I should like it very much. It is a long time since I was asked to do something that mattered.",
        roll: {
          p: 0.6,
          scale: ["nerve", 0.03, 0.35, 0.85],
          ok: {
            text: "She is at a table for two at the Café Royal at eight, in black, with a diamond at the throat, and she is a good deal more charming than a man in his position has any right to expect. By the second course he has told her the name of his clerk and the number of his box. By the fourth he has let slip the day, and the hour, and the door. She comes out into Regent Street at eleven with a headache and a handful of facts, and gives you all of them in a cab.",
            stamps: { evidence: 2 },
            flags: ["adlerDecoy"],
          },
          bad: {
            text: "She is at the table for two, and she is as charming as the evening requires, and at the fifth course he leans across and says, quite pleasantly, that he knows who she is, and who has sent her, and that he is extremely sorry for her. He pays the bill and goes. She walks home alone through the rain. You find the note under your door in the morning. It says: 'I am not hurt. I should like it noted that I was not at all frightened.'",
            stamps: { nerve: -2 },
            flags: ["adlerHurt"],
          },
        },
        axis: { trustAdler: -1 },
        next: "Y9",
      }),
    ],
    [
      [flag("adlerMet"), "She is a good deal calmer than the room. She sits with her gloves in her lap, as one sits in a waiting-room at a dentist's, and looks at the Inspector's inkwell with polite interest."],
    ],
  ),

  // ───────────── a second chance at each finale ─────────────
  node(
    "Y9D",
    "YARD",
    "The Chase Along the Towpath",
    "Saturday 20 June, half past three in the morning. The net has not closed. At the last moment the tall, stooping figure on the towpath has seen the lantern on the bridge, and has turned and gone along the cut at a great pace, with his head thrust forward and his coat flying, and is already a hundred yards off. It is a black, narrow, wet night, with the towpath running between a high wall and the water, and every second that you stand here is a second in which he is further away. This is not the end. It is the last thing that you can do. Whatever you have prepared in the last two months will be needed in the next ten minutes.",
    [
      opt({
        label: "Send the Constables Ahead to the Lock.",
        detail: "You have a man on the lock, because you set one there. He will be standing with a lantern in the middle of the path when the Professor arrives.",
        stamps: { evidence: 1 },
        needFlag: ["watchSet", "Needs a watch set on the canal"],
        who: "Inspector Lestrade",
        says: "He's got to go through the lock, Mr Holmes, there's no other way along the cut. Jenkins is at the gate, and Pike's at the other end. I've never in my life been so glad to have a man standing in a wet field.",
        outcome: "The Professor comes round the bend at a steady walk, with his hat in his hand and a face of perfect composure, and finds a constable standing in the lock-gate with a lantern. He stops. He looks at the constable, and then, slowly, over his shoulder, at the three men coming along the path behind him, and then he puts his hat on again, with some care, and says that he supposes there is no help for it.",
        next: "ENDING_NET_CLOSES",
      }),
      opt({
        label: "Whistle for the Boys on the Roofs.",
        detail: "A boy on a roof can see the whole length of the cut. If you have the hands, you have the eyes.",
        stamps: { hands: -1 },
        needs: [res("hands", ">=", 1), "Needs Hands in hand"],
        who: "Wiggins",
        says: "He's gone along the wall, Mr Holmes! Alf's got him, he's on the shed roof! He's gone left! He's gone left!",
        outcome: "The whistle goes up and down the length of the canal, from roof to roof, like a thing that is alive. In a minute there is a cry, and then another, and then a string of small, triumphant voices, and the Professor, who has been going along the cut at a great pace with every sense alert, finds himself pursued from above by thirteen children and a dog. He is not a man who runs well. He is a very much better man at sitting.",
        next: "ENDING_NET_CLOSES",
      }),
      opt({
        label: "Run Him Down Yourself.",
        detail: "A hundred yards in the dark, on a wet towpath, after a man ten years older than you. It is the kind of thing that you do rather well.",
        who: "Professor Moriarty",
        says: "You are very persistent, Mr Holmes. It is a fault in the young, and a virtue, I am told, in the dog.",
        roll: {
          p: 0.5,
          scale: ["nerve", 0.04, 0.25, 0.85],
          ok: {
            text: "You are on him at the bend, in a flat run, with the stick under your arm, and you take him by the collar of the coat before he knows that you are there. He does not struggle. He stops, quite still, and stands with his head swaying slowly from side to side, in the light of the lantern, and says, mildly, that he had not supposed that you would be so fast. Behind you the constables come up with a rush.",
            stamps: { nerve: -2, evidence: 1 },
          },
          bad: {
            text: "You are twenty yards short when the dark puts a root across your path. You go down on your face on the wet stone, with the wind knocked out of you, and by the time that you are up there is nothing at the end of the towpath at all but a cab, with its lamps lit, driving very fast and quite silently towards the City.",
            stamps: { nerve: -2, evidence: -1 },
          },
        },
        next: "ENDING_NET_CLOSES",
      }),
      opt({
        label: "Let Him Go.",
        detail: "You have not the means to stop him. There are better ways to be a policeman than to chase an old man along a canal.",
        stamps: { standing: -1 },
        who: "Inspector Lestrade",
        says: "You are letting him go, Mr Holmes. I do not understand it. But I'll say nothing, if you say nothing, and we'll both go home to bed.",
        outcome: "You stand with your hands in your pockets and watch him go, a tall, stooping figure that grows smaller and smaller along the cut, until it passes under the next bridge and is gone. It is the most dignified retreat of your career, and the most expensive.",
        next: "ENDING_NAPOLEON_ESCAPES",
      }),
    ],
  ),
  node(
    "S8D",
    "STREET",
    "The Fire on the Stair",
    "Tuesday night, the lamp-light flickering. The first of the oil casks goes up with a low, soft roar, and the whole of the dim, high place is suddenly, shockingly bright. The Professor has not been trying to defend the warehouse. He has been trying to burn it, and he has done it with the thing that he has been collecting for a week. There is a river of burning oil spreading along the floor, a hoist-chain swinging in the heat, and fifteen boys, a very small boy among them, in a building with only two doors. You have, perhaps, three minutes, and a great deal to lose.",
    [
      opt({
        label: "Cut the Hoist-Chain Above the Casks.",
        detail: "You counted the casks, and you know where the chain runs. The barrels on the front gantry will drop into the river instead of the floor.",
        stamps: { nerve: -1 },
        needFlag: ["wharfOil", "Needs the oil counted on Monday"],
        who: "Alf",
        says: "The chain, Mr Holmes! The one with the hook! It's up on the roof by the winch!",
        outcome: "You are on the gantry before you have finished the thought, and the chain parts under the third blow of the iron bar. The front of the loft goes over into the river with a long, slow, shuddering crash, and a great cloud of smoke and steam, and the fire, which had the floor in its hand a moment before, is suddenly a small, sullen thing in a corner. Wiggins has the boys out of the water-door before you have taken a second breath. When the Professor looks round for his exit, there are four constables standing in it.",
        next: "ENDING_PRIVATE_WAR",
      }),
      opt({
        label: "Run the Boys Out by the Water-Stair.",
        detail: "A boy knows a stair. If there is a way out of a building, he will have found it already.",
        stamps: { hands: -1 },
        needs: [res("hands", ">=", 1), "Needs Hands in hand"],
        who: "Wiggins",
        says: "This way! Single file, and don't push! Alf, you're last, and you hold the rope! I said single file, Dickie!",
        outcome: "They go out through the smoke by the water-stair in a long, silent, orderly line, each with a hand on the shoulder in front, and they are standing in the wet on the foreshore, coughing, before the beams begin to go. Not one is missing. By the time that the Professor has come to the end of his own plan, he finds that the ground on which he is standing has been taken by the thing that he forgot to count, which is a quantity of very small and very angry people.",
        next: "ENDING_PRIVATE_WAR",
      }),
      opt({
        label: "Go Back In for the Professor.",
        detail: "A man who has set fire to his own house does not generally intend to be in it. But he may be, and you would rather not know.",
        who: "Professor Moriarty",
        says: "You should not have come in, Mr Holmes. I had made provision for most things, but not, I think, for you.",
        roll: {
          p: 0.45,
          scale: ["nerve", 0.04, 0.25, 0.85],
          ok: {
            text: "He is standing in the middle of the burning floor, with his hat in his hand, quite composed, and he lets you take him by the sleeve as a gentleman allows a waiter to take his coat. You get him to the water-door with a beam coming down behind you, and the last you see of the warehouse is the whole of the roof going up like a lantern.",
            stamps: { nerve: -3, evidence: 1 },
            next: "ENDING_PRIVATE_WAR",
          },
          bad: {
            text: "The smoke closes over you, and you go down on your knees, with the floor hot under your palms, and the Professor's figure on the far side of the fire turns, with a slight, courteous inclination of the head, and is lost. You are got out by a boy of eleven, by the coat. He has saved your life, and he is not at all impressed by it.",
            stamps: { nerve: -3 },
            next: "ENDING_BAKER_STREET_BURNS",
          },
        },
        next: "ENDING_PRIVATE_WAR",
      }),
      opt({
        label: "Leave Him to the Fire and Get the Boys Out.",
        detail: "It is not a victory. But a child is not a thing to be set on a scale.",
        stamps: { nerve: -1 },
        who: "Wiggins",
        says: "Mr Holmes, we've all got out. Every one. We've not got him, but we've got the boys.",
        outcome: "You do the only thing that a man can do, and you do it without hesitation, and the Professor, in the smoke, has gone. When the fire has burnt down, there is nothing in the ruin of the warehouse but a quantity of charred oak and a small, neat, empty chair, in the middle of the floor, that no fire has touched.",
        next: "ENDING_BAKER_STREET_BURNS",
      }),
    ],
  ),
  node(
    "M9",
    "MYCROFT",
    "One Throw More",
    "Friday 1 May, the late afternoon. The Cabinet Room is empty but for your brother, and the Prime Minister's secretary, and a tea-tray that no one has touched. The first throw has missed. It was a good one, and it was made at the right time, and it has not worked, and for a moment you stand and look at the table. Then Mycroft, who has not moved from his chair, says, in his flat, slow voice, that the Government has not yet decided that it is beaten, and that there is a quarter of an hour before the Prime Minister's carriage is called. He says it as one would give a man a coin for the omnibus. You have, therefore, exactly one more.",
    [
      opt({
        label: "Lay the Professor's Cables Before the Committee.",
        detail: "You broke the cipher. Every cable of the year, in plain English, with the Professor's own dates. There is nothing the Government can say to that.",
        stamps: { evidence: 1 },
        needFlag: ["cipherBroken", "Needs the cipher broken"],
        who: "Mycroft Holmes",
        says: "You had them all along, Sherlock, and you kept them in your waistcoat for a week. I do not know whether to be proud of you or to dismiss you from the service. I shall do neither. Hand them to Sir Edward.",
        outcome: "The sheets go on the green cloth in order, and Sir Edward reads the first aloud. By the sixth he has put down his tea. By the tenth the Prime Minister has been sent for, in the middle of his dinner, and has come, with a napkin in his collar. There is a warrant by seven, and a van by nine, and a quiet corridor in Holloway by midnight.",
        next: "ENDING_NET_CLOSES",
      }),
      opt({
        label: "Put the Second Ledger in Lestrade's Hands.",
        detail: "If the Government will not use it, the Yard will. Lestrade is a man who knows what to do with a ledger, and what not to say about it.",
        stamps: { standing: 1 },
        needs: [all(flag("readSecond"), ax("trustLestrade", 1)), "Needs the second ledger read and Lestrade's trust"],
        who: "Inspector Lestrade",
        says: "You want me to take it to the Commissioner, Mr Holmes, with the Government's name written in it. I've been in the force for thirty years and I've never done a braver thing, or a stupider. I'll do it.",
        outcome: "He walks out of the Cabinet Room with the ledger under his arm and his hat on straight, past the secretary, past the doorkeeper, past a Cabinet minister who tries to say something and is passed too. By the next morning it is the property of the Metropolitan Police, and by the next week it is in the hands of a printer.",
        next: "ENDING_THE_SECOND_LEDGER",
      }),
      opt({
        label: "Ask Greaves to Watch the Channel Ports Himself.",
        detail: "He will have men at Dover, Southampton, Folkestone and Newhaven by midnight. There are not many places in England from which a man of his height can leave unobserved.",
        who: "Superintendent Greaves",
        says: "Every port on the south coast, sir, and a man at every station. I do not say we shall have him. I say that he will have to be a very remarkable gentleman to get past thirty.",
        roll: {
          p: 0.5,
          scale: ["evidence", 0.04, 0.25, 0.85],
          ok: {
            text: "It is a telegram, at three in the morning, from a station-master at Newhaven. A tall, stooping gentleman has taken a first-class ticket for Dieppe under the name of Mr Alexander Bell, with a violin-case. He is stopped at the barrier by a young man from Special Branch with a cold. He goes quietly. He asks only whether there will be time for him to finish his tea.",
            stamps: { evidence: 1 },
            next: "ENDING_NET_CLOSES",
          },
          bad: {
            text: "He is not at any of them. He left London on the Wednesday, in a very plain brougham, with a quiet, plausible gentleman who is understood to be a clergyman, and he has been in Calais since Thursday. The ports are watched with great care for a week, and nothing at all is seen, except a number of tall, stooping, innocent men.",
            stamps: { evidence: -1 },
            next: "ENDING_NAPOLEON_ESCAPES",
          },
        },
        next: "ENDING_NET_CLOSES",
      }),
      opt({
        label: "Let the Professor Sail.",
        detail: "There is no more to be done tonight, and you have had the better part of a week of it.",
        stamps: { standing: -1 },
        who: "Mycroft Holmes",
        says: "You are doing the sensible thing, Sherlock. It is the only thing in the world that I should like less than to see you do.",
        outcome: "You rise from the table, and your brother does not, and the Prime Minister's secretary looks at his watch. There is nothing to say. You go out into Whitehall in a fine rain, and find that the lamps have been lit. Somewhere to the south, a long way off, a ship's siren sounds, very low, like a large animal clearing its throat.",
        next: "ENDING_NAPOLEON_ESCAPES",
      }),
    ],
  ),
];

/** The extra options added to existing scenes after the strand table has been applied. */
export const moreOptions = [
  ["S8B", opt({
    label: "Cut the Hoist-Chain Before the Casks Go.",
    detail: "You counted the oil. The chain runs from a winch on the roof to a hook above the front gantry, and it will let the front of the loft fall into the river.",
    stamps: { nerve: 1 },
    needFlag: ["wharfOil", "Needs the oil counted on Monday"],
    who: "Wiggins",
    says: "The winch is behind the sugar-hoist, Mr Holmes. Three of us can get to it by the back wall, and nobody'll ever know.",
    outcome: "A boy goes up the back wall with a pair of pincers, and the whole of the gantry sags and hangs. You have taken the one thing in the building that would have let the Professor burn it. Now it is a plain, ordinary, damp, dim, dirty place, with a man at the end of it who has not yet been told.",
    next: "S8C",
  })],
  ["S8C", opt({
    label: "Take Him on the Stair That Was Marked in Chalk.",
    detail: "You read the route on the bollards and you have the hour of the tide. There is a way out of the building that only he knows, and it ends where you will be standing.",
    needs: [all(flag("wharfMarks"), flag("wharfTide")), "Needs the chalk marks read and the tide known"],
    who: "Professor Moriarty",
    says: "How very careless of me. I had thought that the stair was my own affair.",
    outcome: "He comes down the steps in the dark, with his hat in one hand and a small brass lamp in the other, and he stops on the third step from the bottom. You are on the foreshore, with your stick under your arm and four constables behind you. He looks at you for a moment, with his head swaying slowly from side to side, and says that he had always thought you rather good at reading things, and that he is extremely sorry to find that it was not an exaggeration.",
    next: "ENDING_PRIVATE_WAR",
  })],
  ["C8", opt({
    label: "Show Watson the Forged Form.",
    detail: "A message in pencil, on a post-office form, in a hand that was told what a woman's looks like. It will not take a moment to convince him.",
    stamps: { nerve: 1 },
    needFlag: ["formsRead", "Needs the telegraph forms read"],
    flags: ["watsonWarned"],
    axis: { trustWatson: 1 },
    who: "Dr Watson",
    says: "It is a forgery, Holmes. I should know a woman's hand, and that is a man's, and a man who has been taught. I shall not go. I shall stay exactly where I am, and I do not intend to leave your side for a moment.",
    outcome: "He holds the form to the window and reads it twice, and then he gives it back with a face of cold, patient, military anger. It is the look you have seen on him in the Afghan hills, and you are very glad indeed to have it on your side.",
    next: "C9",
  })],
  ["C8", opt({
    label: "Show Watson Mrs Norton's Warning.",
    detail: "A lady who knows what she heard is a better witness than a form. He will believe her because he will not believe that she is lying.",
    stamps: { nerve: 1 },
    needFlag: ["adlerWarned", "Needs Mrs Norton's warning"],
    flags: ["watsonWarned"],
    axis: { trustWatson: 1, trustAdler: 1 },
    who: "Dr Watson",
    says: "She came all this way, Holmes, in a wet dress, to tell you that. I do not at all know what to say to her. I think that I shall say thank you.",
    outcome: "He goes down to the hall, in his shirt-sleeves, and thanks her very gravely, with a small stiff bow, and she is, for the first time in your acquaintance, extremely surprised. Then he comes back up the stairs, and sits down on the end of your bed, and says that it is a very peculiar thing to be saved by a woman whom one has met twice.",
    next: "C9",
  })],
  ["C10", opt({
    label: "Take the Cleft You Found in the Morning.",
    detail: "A narrow crack in the rock, a few feet below the path, with a ledge that will take a man lying flat, and a root as thick as your wrist. You are the only one who knows that it is there.",
    needFlag: ["cleftSeen", "Needs the cleft below the ledge found"],
    who: "Professor Moriarty",
    says: "I do not see him. I see only the edge, and the water, and the spray. I think, Mr Holmes, that I have, after all, been rather clever.",
    roll: {
      p: 0.8,
      scale: ["nerve", 0.04, 0.45, 0.92],
      ok: {
        text: "You are over the lip before the shot, and into the crack with your face against the wet rock, and the whole world goes past with a roar. You lie there for an hour, with your fingers locked round the root, and listen to the Colonel's boots go back along the path. When it is quite dark you climb out, and the fall is the loudest thing in Europe, and you are a dead man.",
        stamps: { nerve: -1 },
        next: "H1",
      },
      bad: {
        text: "The root gives. You have a moment of cold, enormous surprise, with the spray in your face and the gorge opening under you, and the next thing that you know is the sound of Moran's rifle, a long way above, and the great white roar swallowing it.",
        stamps: { nerve: -3 },
        next: "ENDING_FATAL_SHOT",
      },
    },
    next: "H1",
  })],
  ["C7B", opt({
    label: "Look Up the Lady Who Has Taken the Room Below Yours.",
    detail: "She registered on Friday, in a name that is not hers, and has not been out of the house since. It is exactly the kind of room that she would take.",
    needFlag: ["adlerMet", "Needs to have met Mrs Norton"],
    stamps: { nerve: -1 },
    who: "The proprietor",
    says: "A lady in grey, Monsieur? Yes, on the first floor, but she says she will not be disturbed. She is a lady of the most extraordinary firmness.",
    outcome: "You go down the stair in the dusk, and she is already standing at her door, with a lamp.",
    next: "AC",
  })],
  ["Y8", opt({
    label: "Answer the Note From St John's Wood.",
    detail: "It was left at the door last night, on violet paper, and was not at all a request. It said only that she would be at the Yard at nine.",
    needFlag: ["adlerMet", "Needs to have met Mrs Norton"],
    stamps: { hours: -1 },
    who: "Mrs Norton",
    says: "I am told that Mr Lestrade does not approve of lady witnesses. I should like to be told, in his own words, why.",
    outcome: "You go to Scotland Yard in the wet, and she is there before you.",
    next: "AY",
  })],
  ["Y9", opt({
    label: "Let Lestrade Take Mr Dunmore on Mrs Norton's Statement.",
    detail: "A name, a bank and a date, sworn to a magistrate. A man who has been buying letters for the Professor is a man who will be found at the bank on a Thursday.",
    stamps: { evidence: 1 },
    flags: ["watchSet"],
    needFlag: ["adlerStatement", "Needs Mrs Norton's statement"],
    who: "Inspector Lestrade",
    says: "I've sent a man to the bank, Mr Holmes. A Mr Dunmore came out of it at ten and has been walking up and down in front of the Bank of England ever since, looking at his watch. I think he's waiting for somebody who isn't coming.",
    outcome: "The thing is done by a single sergeant in a bowler hat, with a warrant and a decent manner, and Mr Dunmore, who is a good deal smaller in person than his cheques, comes away in a cab without any fuss. By the evening he has given the Yard the name of the house in Hackney, which is the thing that you wanted.",
    next: "Y9B",
  })],
  ["Y9", opt({
    label: "Spring the Trap Mr Dunmore Walked Into.",
    detail: "He told her the day, the hour and the door. All that remains is to be standing at it.",
    stamps: { evidence: 1 },
    flags: ["watchSet"],
    needFlag: ["adlerDecoy", "Needs the dinner at the Café Royal"],
    who: "Mrs Norton",
    says: "It is the back door, on the Cambridge Road side, between a corn-chandler's and a shuttered chapel. I should be there myself, if I were not a lady. Do be careful. He was not, I think, as stupid as he seemed.",
    outcome: "You are at the Cambridge Road door at one in the morning with Lestrade and six men, in the wet, and at ten past a figure in a long coat comes round the corner of the chapel with his head down. It is the first time in the whole of the case that the Professor's side has walked into a thing that you had made.",
    next: "Y9B",
  })],
];

/** Changes to scenes that already exist: the finales no longer hang on one roll, and walking away no longer pays. */
export function tweakFinales({ need, optionBy, addOption, retarget }) {
  // the street road: the road now runs through two investigations
  retarget("S7", "S8", "SX1");
  // the flight: the same
  retarget("C7B", "C8", "CX1");
  // Y9C: a failed net is a chase, not the end
  const y9c = optionBy("Y9C", "Close the Net and Trust the Odds");
  y9c.roll.chance = 0.5;
  y9c.roll.scaling = { resource: "evidence", perPoint: 0.06, min: 0.25, max: 0.9 };
  y9c.roll.failure.nextNodeId = "Y9D";
  y9c.roll.failure.stamps = { evidence: -1 };
  // S8C: the fire is a fight, not the end
  const s8c = optionBy("S8C", "Break Him Anyway");
  s8c.roll.chance = 0.55;
  s8c.roll.failure.nextNodeId = "S8D";
  s8c.roll.failure.stamps = { nerve: -2 };
  // M8: a missed shot at the Cabinet is a last throw, not the end
  const m8a = optionBy("M8", "Take the Second Ledger to the Standard");
  m8a.roll.failure.nextNodeId = "M9";
  m8a.roll.failure.stamps = { standing: -2, wires: 1 };
  const m8b = optionBy("M8", "Have Greaves Take Him at Southampton");
  m8b.roll.failure.nextNodeId = "M9";
  m8b.roll.failure.stamps = { evidence: -1 };
  // walking away costs something, so that it is never the comfortable choice for a tired player
  optionBy("Y9C", "Close the File and Go Home").stamps = { standing: -1 };
  optionBy("S8C", "Turn Round and Walk Away").stamps = { standing: -1 };
  optionBy("M8", "Walk Out of the Room").stamps = { standing: -1, wires: -1 };
}
