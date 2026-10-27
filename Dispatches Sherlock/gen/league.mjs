import { opt, node, flag, all } from "./lib.mjs";

const end = (id, title, kind, headline, text, variants) => {
  const e = { id, title, kind, headline, text };
  if (variants?.length) e.variants = variants.map(([cond, headline, text]) => ({ ...(cond.flag && Object.keys(cond).length === 1 ? { flag: cond.flag } : { when: cond }), headline, text }));
  return e;
};

/** The Red-Headed League: the fifth volume on the shelf, and the lightest. */
export const leagueNodes = [
  node(
    "L1",
    "LEAGUE",
    "A Red-Headed Pawnbroker",
    "Saturday 11 October 1890, ten in the morning. A stout, florid gentleman with a very red head has come up the seventeen steps and is sitting on the edge of the basket-chair with his hat on his knee. His name is Jabez Wilson, and he keeps a small pawnbroker's business in Saxe-Coburg Square, in the City, with an assistant who will work for half wages. Eight weeks ago his assistant showed him an advertisement. It offered four pounds a week to any red-headed man of full age who would sit for four hours a day in an office in Pope's Court and copy out the Encyclopaedia Britannica, and Mr Wilson got the place. This morning he went to the office, and found a card on the door that said that the Red-Headed League was dissolved. He is not at all upset about the money. He would like to know what it was for.",
    [
      opt({
        label: "Take the Case and Ask for the Whole of It.",
        detail: "A man who has been paid four pounds a week to copy the Encyclopaedia has been paid to be out of his shop. It is the shop that is interesting.",
        stamps: { evidence: 1 },
        flags: ["leagueFull"],
        who: "Jabez Wilson",
        says: "It was always from ten to two, Mr Holmes, and I never saw any League but a Mr Duncan Ross, who was very polite and wore a bowler hat. He used to look in at the end of the day and pay me in sovereigns. I did think it was queer, but I thought that it was queer in my favour.",
        outcome: "He tells it with a good deal of detail and an immense relish, from the day the assistant, Vincent Spaulding, came to the shop, to the morning of the card on the door. You ask four questions. At the end of the fourth you have a pipe lit, and your eyes shut, and Watson, on the sofa, is looking at you with the face of a man who has seen it before. 'It is quite a three-pipe problem,' you say, 'and I beg that you won't speak to me for fifty minutes.'",
        next: "L2",
      }),
      opt({
        label: "Ask About the Assistant Who Works for Half Wages.",
        detail: "A man who works for half pay is either a saint or has something to do in the shop that the pay would not allow.",
        stamps: { evidence: 2 },
        flags: ["leagueAssistant"],
        who: "Jabez Wilson",
        says: "Spaulding? A very smart fellow, Mr Holmes, though I don't know that I should have kept him at half wages if he hadn't been so good at the photography. He is always down in the cellar, developing his plates. It is his one fault. He takes an hour at it.",
        outcome: "You ask him to describe the man, and he does so at some length. The assistant is short, and quick, and clean-shaven, with a white splash of acid upon his forehead, and ears that have been pierced for earrings. He is a clever man who is willing to work for half pay, and who spends an hour at a time in your client's cellar. You give no sign of what you think. You merely observe, in the course of the next moment, that there is no better evidence in the world than a man's own cellar.",
        next: "L2",
      }),
      opt({
        label: "Look at the Card on the Door of the Office.",
        detail: "A card is a document. It will tell you at least as much as a story, and it cannot embroider.",
        stamps: { evidence: 1, hours: -1 },
        flags: ["leagueCard"],
        who: "Jabez Wilson",
        says: "I have it in my pocket, Mr Holmes. I took it off the door. It says that the League is dissolved, and the date is the ninth of October, 1890. I thought it a very civil way to end a matter.",
        outcome: "He gives it to you, with some pride. It is a square card, in a good, plain hand, on a better paper than the occasion deserved. It is dated two days ago, and signed with a name that does not appear in any directory in London. You turn it over, and look at the back of it, and then, without a word, hold it to the light of the window. 'It has been written,' you say, 'by a man who was in a hurry, and who did not expect to be read.'",
        next: "L2",
      }),
    ],
  ),
  node(
    "L2",
    "LEAGUE",
    "Saxe-Coburg Square",
    "Saturday 11 October 1890, early afternoon. Saxe-Coburg Square is a shabby, genteel place, a square of dingy two-storeyed houses of brick looking out upon a small railed enclosure where a lawn of weedy grass and a few clumps of faded laurel-bushes make a hard fight against a smoke-laden and uncongenial atmosphere. On the corner house, three gilt balls and a brown board with Jabez Wilson in white letters announce the premises of your client. On the far side of the corner, a dull, shabby street runs back to a bright, busy one. It is the back of a bank.",
    [
      opt({
        label: "Thump the Pavement and Knock at the Door.",
        detail: "You will not go in. You will merely strike the stones with your stick, outside the shop, and see which of them are not stones. And then ring the bell, and look at the man who opens it.",
        stamps: { evidence: 2 },
        flags: ["leagueKnees"],
        who: "Vincent Spaulding",
        says: "Yes, sir? Was it Mr Wilson that you wanted? He is out, sir, but I am sure that I could oblige. I am the assistant.",
        outcome: "The pavement is sound. The man at the door is not what you expected: he is quick, clean-shaven, clever, and has about him the look of one who has spent a great deal of time on his knees. You ask him the way to the Strand, and he tells you with perfect civility, and in the course of it you glance at the knees of his trousers. They are as you hoped. They are wrinkled, and stained, and worn through. You thank him, and go.",
        next: "L3",
      }),
      opt({
        label: "Walk Round the Block and Read the Bank Behind.",
        detail: "A dull street, a bright one, and the corner of a bank. An assistant who spends his time in the cellar is digging towards something, and there is only one thing in the block worth reaching.",
        stamps: { evidence: 1, hours: -1 },
        flags: ["leagueBank"],
        who: "Your own notebook",
        says: "The City and Suburban Bank, Coburg Branch. A cellar wall that backs onto the pawnbroker's cellar. The distance is four yards, and a man could dig it between ten and two in a fortnight.",
        outcome: "You walk round the block twice, with your hands behind you, and your hat over your eyes. On the second turn you have the whole of it. The little shop is at the back of the bank. The assistant is digging. The League has been sitting at the other end of the town, for four pounds a week, in order that the shop should be empty every day from ten to two. It is the cleverest and most extravagant device that you have encountered in a year.",
        next: "L3",
      }),
      opt({
        label: "Send Watson to Ask at the Tobacconist's.",
        detail: "A tobacconist sees everything on a corner. A doctor with a pipe may ask him for a light, and a question, and be given both.",
        stamps: { hands: 1, evidence: 1 },
        flags: ["leagueWatson"],
        axis: { trustWatson: 1 },
        who: "Dr Watson",
        says: "He says that the assistant goes out for a pipe every afternoon at two, Holmes, with a sooty face, and goes back in again. He also says that Mr Wilson has not had a customer since August. I did not ask. He volunteered it.",
        outcome: "Watson is gone twenty minutes, and returns with a very good cigar, a great deal of gossip, and a look of enormous, innocent satisfaction. He has, without in the least intending it, been told about the whole of the street. You tell him that he is an admirable detective, and he says, rather pink, that he does not think that he had better be told so by you in public.",
        next: "L3",
      }),
    ],
  ),
  node(
    "L3",
    "LEAGUE",
    "A Concert and a Conference",
    "Saturday 11 October 1890, the evening. Sarasate is playing at St James's Hall, and you have spent the afternoon in it, with your fingers moving a little in the air to the music, and your face as vacant as a child's. It is not a thing that Watson can ever quite believe. At seven you are back at Baker Street, with a cold supper laid, and two gentlemen in the sitting-room: Mr Peter Jones of Scotland Yard, who is official and a little stiff, and Mr Merryweather, a director of the City and Suburban Bank, who is tall, sad and solemn, and does not at all like being out after dark. In the cellar of his bank, you have told them both, are thirty thousand napoleons in boxes.",
    [
      opt({
        label: "Ask Mr Merryweather for the Vault Key and Be Dark About It.",
        detail: "He will give it, because he is afraid to refuse. A key is a very simple thing to forge, and a very simple thing to be seen holding.",
        stamps: { evidence: 1, standing: 1 },
        flags: ["leagueVault"],
        who: "Mr Merryweather",
        says: "I do not at all like the idea of a stranger in the vaults at night, Mr Holmes, with the French gold. But I have been a director for twenty years, and I have never been told anything by a man who looked so extremely sure of it.",
        outcome: "He hands it over like a man giving up a relative. It is a long, heavy, ugly key, on a ring, and you slip it into your pocket and tell him that he will have it back by morning. He goes pale. Mr Jones says, in a low and carefully official voice, that he hopes that this is not a practical joke. You tell him that it is, in a sense, the last thing in the world that you would call it.",
        next: "L4",
      }),
      opt({
        label: "Press Mr Jones to Bring Four Men and Handcuffs.",
        detail: "It is an old rule that a man who is walking into a trap should be given the benefit of company. The company had better be armed.",
        stamps: { hands: 1 },
        flags: ["leagueMen"],
        who: "Mr Peter Jones",
        says: "He is a clever fellow, is John Clay, Mr Holmes. His grandfather was a royal duke and he has been to Eton and Oxford. I have been on his track for years and have never set eyes on him yet. I shall bring four men, and a revolver, and I should be extremely obliged if you would lend me a little courage.",
        outcome: "He says it with a good deal of dignity, and some resentment, and goes away at once to the nearest station to find the men. You are rather pleased. The Yard is slow and conventional, but it has a bulldog's courage and a bulldog's tenacity when it is once at close quarters, and you have, on the whole, a very high opinion of Mr Jones.",
        next: "L4",
      }),
      opt({
        label: "Say That You Will Go Alone, and Ask Them to Wait at the Door.",
        detail: "A crowd in a vault is a crowd that makes a noise. You have been alone in worse places, and rather like it.",
        stamps: { nerve: -1, standing: -1 },
        flags: ["leagueAlone"],
        who: "Mr Merryweather",
        says: "Alone, Mr Holmes? In my own bank, in the dark, with a thirty thousand pounds beneath the floor? I should prefer, if I may say so, to have the Yard in the room.",
        outcome: "He is upset, and Mr Jones is affronted, and for a quarter of an hour the conversation is rather painful. You are obliged to say several times that it is not a lack of confidence in either of them. By the end of it you have a compromise: they are to be at the door of the bank, and you are to be in the cellar, and nobody is to be happy about it.",
        next: "L4",
      }),
    ],
    [
      [flag("leagueKnees"), "You can still see the trousers. There is a patch at the knee that nothing in the world but a spade can produce."],
      [flag("leagueBank"), "A map of four yards of London is drawn on the back of the concert-programme. It is the best thing that you have done all week, and you did it during the Mendelssohn."],
    ],
  ),
  node(
    "L4",
    "LEAGUE",
    "The Cellar",
    "Saturday night, a little after ten. The cellar of the City and Suburban Bank is a long, cold, stone place, stacked to the roof with boxes and crates, and smelling of damp and old wood. You are on your knees with a lantern and a lens, and have been for an hour; Mr Jones is crouching behind a packing-case with a pair of handcuffs, and Mr Merryweather is behind another, holding his breath. At ten past, a thin, pale line of light appears between two flagstones in the floor, and spreads, and a flagstone rises, silently, as if on hinges. A hand comes through the opening, a white hand, quite small. It feels about, for a moment. It finds the edge of the floor. Then a face follows it, with a splash of white acid upon the forehead, and a head of bright red hair, and the man, with a sigh, rolls up into the cellar and sits there with his legs over the edge.",
    [
      opt({
        label: "Pounce on the First Man and Hold Him by the Wrist.",
        detail: "He has a revolver in his pocket, and a rope over his shoulder, and he is as quick as a cat. You have a hunting-crop. It is a matter of the first half-second.",
        who: "John Clay",
        says: "It is no use, John. You have no chance at all. I have a man at the front, and a man at the back, and another at the door, and a very large number of friends in this cellar who are all, I am happy to say, extremely patient.",
        roll: {
          p: 0.65,
          scale: ["nerve", 0.04, 0.35, 0.9],
          ok: {
            text: "The crop comes down on his wrist, and the pistol clatters on the stone, and Jones is across the floor like a terrier with the handcuffs before the other man's head is out of the hole. There is a cry, a scramble, a splash of loose earth, and a rush of feet along the tunnel. 'You will not gain much by that,' says Clay, with a perfectly good-humoured smile, 'for there are three of our friends at the door of the shop.' It is the neatest little arrest that you have ever seen.",
            stamps: { evidence: 1, nerve: -1 },
          },
          bad: {
            text: "You are a half-second late. The hunting-crop goes through the air and meets the edge of the flagstone, and the man is down the hole as if he had been dropped, with a lamp, and a spade, and a noise like a cat on a roof. By the time Jones has found the end of the tunnel in the shop, there is nothing in it but a smell of paraffin and a trail of boot-prints. The bank is a great deal poorer, and the gold, which had been in the boxes for a week, is in a cart.",
            stamps: { standing: -2, nerve: -1 },
            next: "ENDING_THE_TUNNEL_OPEN",
          },
        },
        next: "ENDING_THE_LEAGUE_DISSOLVED",
      }),
      opt({
        label: "Hold the Light Back and Let Mr Jones Take Them on the Stair.",
        detail: "You have a man at the door of the shop, and four more behind the cellar-stair. You have only to keep the lantern shut.",
        stamps: { standing: 1 },
        needFlag: ["leagueMen", "Needs four men from the Yard"],
        who: "Mr Peter Jones",
        says: "I'll have him, Mr Holmes. I'll have the pair of them. I have been waiting for years for the chance of putting my hand upon the collar of John Clay, and I do not intend to ask you to do it for me.",
        outcome: "He goes up the stair like a young man, with the four constables behind him, and takes the second one on the way out of the hole, with a shout, and a flurry, and a very great quantity of dust. Clay himself he takes in the shop, in the dark, at the foot of the little ladder. It is entirely Mr Jones's affair, and he deserves the whole of the credit for it, and receives, from you, with an air of perfect sincerity, the whole of the congratulations.",
        next: "ENDING_THE_LEAGUE_DISSOLVED",
      }),
      opt({
        label: "Take Clay Quietly and Let the Bank Say Nothing.",
        detail: "A scandal would ruin the City and Suburban, and a quiet arrest would save it. It is not a thing that the papers need know.",
        stamps: { standing: -1 },
        needFlag: ["leagueVault", "Needs the vault key"],
        who: "Mr Merryweather",
        says: "I should be everlastingly grateful, Mr Holmes, if the matter could be kept out of the Times. I have been a director for twenty years, and I do not at all like to think what my fellow directors would say.",
        outcome: "It is done in the dark, in twenty minutes, without a shot. The two men are taken out by the back door of the shop in a four-wheeler, with a handkerchief round the mouth of one of them. The bank opens on Monday as usual. A paragraph, at the foot of the fifth column of the Standard, says that a quantity of coin was moved on Saturday night, for security. It is the only thing that the City ever says of it.",
        next: "ENDING_THE_ENCYCLOPAEDIA",
      }),
      opt({
        label: "Go Home to Bed and Leave the Bank to Mind Its Own Gold.",
        detail: "It was a clever plan, and a very good one. It will, you think, be a pity to spoil it.",
        stamps: { standing: -2 },
        who: "Dr Watson",
        says: "Holmes, I really do not understand you. We have come all this way, and given up a Saturday, and I have been sitting on a box for an hour. Do you mean to say that we are going home?",
        outcome: "You rise from the packing-case, brush the dust from your knees, and say that it is a splendid night for a walk. You go home. In the morning, at ten, there is a long, white, terrible face at the door of Baker Street, and it belongs to Mr Merryweather.",
        next: "ENDING_THE_TUNNEL_OPEN",
      }),
    ],
    [
      [flag("leagueAlone"), "You are alone in the cellar, as you said you would be. You find that you did not say it for the right reasons, and it is rather late to change your mind."],
      [flag("leagueFull"), "The whole of Jabez Wilson's story is in your head, in order, like a score. You have been listening to it for six hours."],
    ],
  ),
];

export const leagueEndings = [
  end(
    "ENDING_THE_LEAGUE_DISSOLVED",
    "The League Is Dissolved",
    "narrative",
    "THE CITY AND SUBURBAN BANK: A NARROW ESCAPE",
    "John Clay, murderer, thief, smasher and forger, who has for years been the cleverest criminal in London, is taken in the cellar of the City and Suburban Bank, and goes to prison for fourteen years. His accomplice is taken in the shop. Jabez Wilson goes back to his pawnbroking, with a good deal more red in his cheeks, and takes a new assistant. Mr Merryweather sends you a cheque and a very long letter. You and Watson walk home along the Embankment at three in the morning, in the first of the fog, and you tell him that it is all an attempt to escape from the commonplace, and that you are glad that it has not escaped.",
    [
      [flag("leagueMen"), "THE LEAGUE IS DISSOLVED: THE YARD'S ARREST", "John Clay is taken, with his accomplice, by Mr Peter Jones of Scotland Yard, at the end of a very long evening, and the papers give the credit to Mr Jones, which is as it should be. He is promoted in the spring. You do not say a word. You think, as you walk home with Watson, that the best of a detective's work is the work that somebody else is thanked for."],
      [flag("leagueAssistant"), "THE LEAGUE IS DISSOLVED: A MAN WITH PIERCED EARS", "John Clay, who had been a royal duke's grandson, an Etonian, an Oxonian, and a very pretty hand with a spade, is taken in the cellar of the City and Suburban Bank, with the white splash of acid still upon his forehead. His ears, as you had said, are pierced for earrings. Jabez Wilson says it is a most remarkable thing that you should have noticed."],
    ],
  ),
  end(
    "ENDING_THE_TUNNEL_OPEN",
    "The Tunnel Open",
    "failure",
    "THIRTY THOUSAND NAPOLEONS: A CITY BANK ROBBED",
    "It is the largest robbery in the City for a decade, and the whole of it has been done with a spade and a jar of paraffin and four pounds a week. The gold, thirty thousand napoleons in boxes lent by the Bank of France, has gone out through the cellar of a pawnbroker in Saxe-Coburg Square, and down the Metropolitan, and on to the Continent. John Clay is not seen again. Jabez Wilson, who had been an innocent party to the whole of it, is eventually found, in a very modest lodging, in the Borough, with his hair, which is now going rather grey, in a small and rather sad ring. The League, you think, as you sit at the window and look at the street, was always better than the thing that it covered.",
    [
      [flag("leagueAlone"), "THE TUNNEL OPEN: A MAN WHO WENT DOWN ALONE", "The gold goes out through the tunnel in the night, and you were in the cellar when it happened, and alone, because you said you would be. It is a thing that nobody forgives. Mr Merryweather writes to the Times, in an angry and rather unfair hand, about private detectives who would be wiser to leave the matter to the police."],
    ],
  ),
  end(
    "ENDING_THE_ENCYCLOPAEDIA",
    "Four Pounds a Week",
    "narrative",
    "A QUANTITY OF COIN MOVED FOR SECURITY",
    "The City and Suburban Bank opens on Monday, as usual, and its customers, who have not the least idea of how near they came to being the customers of a hole in the ground, go in and out all day with their books and their bags. John Clay is in Pentonville by Tuesday. The bank does not say a word, and neither do you. Jabez Wilson, who has been told that the League was dissolved because it had served its purpose, goes back to his shop with a very large and impressive volume, which he has kept, in a drawer, as a souvenir: the first volume of the Encyclopaedia Britannica, copied out in his own hand as far as the letter B, and worth, as he says, a good deal more to him than the money.",
    [
      [flag("leagueVault"), "FOUR POUNDS A WEEK: A DIRECTOR'S GRATITUDE", "The bank opens on Monday, as usual, and its director, who has kept his key, his good name and his thirty thousand napoleons, sends you a box of cigars of such extraordinary quality that Watson, who is a connoisseur, cannot at first believe that they are a gift. You say that you do not smoke cigars. You give them to Lestrade."],
    ],
  ),
];

export const leagueInterlude = {
  id: "TRANSITION_LEAGUE",
  source: "The Morning Post, a small advertisement",
  headline: "TO THE RED-HEADED LEAGUE",
  bodyText: "On account of the bequest of the late Ezekiah Hopkins, of Lebanon, Pennsylvania, U.S.A., there is now another vacancy open which entitles a member of the League to a salary of four pounds a week for purely nominal services. All red-headed men who are sound in body and mind, and above the age of twenty-one years, are eligible. Apply in person on Monday, at eleven o'clock, to Duncan Ross, at the offices of the League, 7 Pope's Court, Fleet Street.",
  kind: "transition",
};

export const leagueTrigger = { interludeId: "TRANSITION_LEAGUE", onEnterNodes: ["L1"] };

export const leagueFlavor = {
  novelNotes: {
    ENDING_THE_LEAGUE_DISSOLVED: "In the Canon: The Adventure of the Red-Headed League (1891, set in autumn 1890). Holmes seizes John Clay by the collar in the vault of the City and Suburban Bank and knocks the revolver from his wrist with a hunting-crop; Clay's accomplice dives down the tunnel and is taken at the shop door by three police. Holmes says that his life is one long effort to escape from the commonplaces of existence, and that such problems help him to do it.",
    ENDING_THE_TUNNEL_OPEN: "Invented. In the story the robbery is prevented and the gold is saved.",
    ENDING_THE_ENCYCLOPAEDIA: "Invented. In the story the arrest is public and goes to Scotland Yard; the bank is not kept quiet.",
  },
  endingHints: {
    ENDING_THE_LEAGUE_DISSOLVED: "In the Red-Headed League, take Clay in the cellar, or let the Yard do it.",
    ENDING_THE_TUNNEL_OPEN: "In the Red-Headed League, be a half-second late, or go home to bed.",
    ENDING_THE_ENCYCLOPAEDIA: "In the Red-Headed League, take Clay quietly and keep the bank's name out of the papers.",
  },
  flagNotes: {
    leagueFull: "Jabez Wilson told you the whole of the story.",
    leagueAssistant: "The assistant works for half wages, and spends an hour at a time in the cellar.",
    leagueCard: "You held the card from the office door to the light.",
    leagueKnees: "The assistant's trousers are worn through at the knee.",
    leagueBank: "The pawnbroker's cellar backs on to the City and Suburban Bank.",
    leagueWatson: "Watson asked at the tobacconist's.",
    leagueVault: "Mr Merryweather lent you the vault key.",
    leagueMen: "Mr Jones brought four men and handcuffs.",
    leagueAlone: "You said that you would wait in the cellar alone.",
  },
};
