import { flag, res } from "./lib.mjs";

const it = (id, source, headline, bodyText, kind) => ({ id, source, headline, bodyText, kind });

export const interludes = [
  it(
    "LORE_CITY_MISFORTUNES",
    "The Standard",
    "A SEASON OF MISFORTUNES IN THE CITY",
    "LONDON, Friday. The Lord Mayor's office has received, in the last three weeks, no fewer than forty-one complaints touching irregularities in the discount market, the Lombard Street banks and the Hatton Garden jewellers. Each case, on examination, has proved to be a separate affair. Each has been referred to a separate division of the police. A Cornhill broker, who asked that his name should not be printed, observed that the City was being 'nibbled, sir, as a cheese is nibbled, by a very small mouse that has never once been seen.'\n\nMEANWHILE, in Baker Street, the lamp in a certain first-floor window has been seen burning at four in the morning for six nights together. Neighbours decline to comment.",
    "lore",
  ),
  it(
    "TRANSITION_YARD",
    "Telegram",
    "SCOTLAND YARD TO 221B BAKER STREET",
    "RECEIVED 11.52 P.M. FRIDAY. ASSISTANT COMMISSIONER WILL SEE YOU SATURDAY, TEN O'CLOCK, FIRST FLOOR, LONG ROOM. BRING EVERYTHING. BRING WHATEVER YOU HAVE ON THE PROFESSOR, AND WHATEVER YOU CAN PROVE. THE CHIEF IS SCEPTICAL BUT WILL LISTEN. IF YOU ARE WRONG THIS WILL FINISH US BOTH. LESTRADE.",
    "transition",
  ),
  it(
    "TRANSITION_STREET",
    "A Note, Folded Small",
    "FROM WIGGINS, IN PENCIL",
    "DEAR MR HOLMES WE HAVE GOT THE MAP DONE. ITS ON THE KITCHEN TABLE. ELEVEN HOUSES AND A DOG. THE BOYS SAY THEY WILL NOT SLEEP TILL ITS FINISHED AND I HAVE TOLD THEM NOT TO BE SILLY BUT THEY WILL. PLEASE COME QUICK. W. WIGGINS. P.S. MRS HUDSON SAYS WILL YOU WIPE YOUR FEET.",
    "transition",
  ),
  it(
    "TRANSITION_CONTINENT",
    "The Daily Telegraph",
    "THE CONTINENTAL EXPRESS: A WARNING TO TRAVELLERS",
    "VICTORIA, Saturday. The boat-train for Dover, Calais and the Continent will run as usual this morning, though travellers are advised that the line near Canterbury has been much occupied of late with special trains. The company regrets the inconvenience.\n\nA CORRESPONDENT writes that on Friday evening an elderly gentleman, with a stoop and a broad-brimmed hat, was observed at the Charing Cross Hotel in earnest conversation with a young physician. The gentleman, our correspondent adds, 'was a good deal more cheerful than his years would warrant.'",
    "transition",
  ),
  it(
    "TRANSITION_REICHENBACH",
    "A Guide to Switzerland",
    "THE FALLS OF THE REICHENBACH",
    "A MILE and a half above Meiringen, the Reichenbach, a stream of considerable volume, descends in a series of leaps into a narrow and exceedingly deep gorge. The best view is obtained from a path cut into the rock above the principal fall, which the traveller will find slippery in wet weather, and in places so narrow that two persons cannot walk abreast. The roar of the water is deafening. Visitors are earnestly requested not to approach the edge.",
    "transition",
  ),
  it(
    "CRISIS_EVIDENCE",
    "A Private Note, Torn Across",
    "THERE IS NOTHING IN THE FILE",
    "You read through your own notes for the third time tonight, and the same thing happens that happened the first and the second. Every link in the chain is sound, and not one is proved. A witness has been frightened off. A ledger has been shown to be a copy. A date has been found to be wrong by a day. If you are to take the Professor in a court of law, you will have to find something he cannot explain away, and soon. The case is hanging by a thread, and he knows exactly where the thread is.",
    "crisis",
  ),
  it(
    "CRISIS_STANDING",
    "The Pall Mall Gazette",
    "A GENTLEMAN WHO SEES CONSPIRACIES: THE POLICE GROW WEARY",
    "A good deal of private irritation has been expressed, in the corridors of Scotland Yard, at the activities of a certain gentleman in Baker Street, who is understood to have a theory of an elaborate criminal conspiracy underlying half the commercial misfortunes of the metropolis. Officers of experience observe that the gentleman has not yet produced a conviction. A senior inspector remarked, 'We are always glad of a clever man. We are less glad when the clever man is wrong, and louder.'",
    "crisis",
  ),
  it(
    "CRISIS_NERVE",
    "Dr Watson, to Himself",
    "FROM A PRIVATE NOTEBOOK, NEVER PUBLISHED",
    "He has not slept. I have watched him for three nights now, and I do not think he has slept for more than an hour in the stretch. He sits with his knees drawn up and his violin on the floor, and his face has gone the grey of old paper. When I speak to him he turns his head slowly, like a man who has forgotten the way. I know the look. I have seen it in the wards. Someone must make him rest, and I do not think it will be me, because he will not listen.",
    "crisis",
  ),
];

export const triggers = [
  { interludeId: "LORE_CITY_MISFORTUNES", onEnterNodes: ["2"] },
  { interludeId: "TRANSITION_YARD", onEnterNodes: ["Y1"] },
  { interludeId: "TRANSITION_STREET", onEnterNodes: ["S1"] },
  { interludeId: "TRANSITION_CONTINENT", onEnterNodes: ["C1"] },
  { interludeId: "TRANSITION_REICHENBACH", onEnterNodes: ["C9"] },
];
