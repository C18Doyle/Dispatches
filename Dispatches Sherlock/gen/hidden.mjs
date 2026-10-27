import { opt, flag, all, any } from "./lib.mjs";

const end = (id, title, kind, headline, text, variants) => {
  const e = { id, title, kind, headline, text };
  if (variants?.length) e.variants = variants.map(([cond, headline, text]) => ({ ...(cond.flag && Object.keys(cond).length === 1 ? { flag: cond.flag } : { when: cond }), headline, text }));
  return e;
};

/**
 * A fourth ending for each of the four minor cases, shown only to a player who has made the right choices earlier in that case: the choice
 * is locked, with its reason, until then. They are the game's own invention, and each is the kindest or the cleverest way out of its case.
 */
export const hiddenOptions = [
  ["R4", opt({
    label: "Take the Snake Alive: Hold a Sack Over the Ventilator.",
    detail: "You know the motive and you know the method. A man who sends a creature down a rope can be shown the creature, and a coroner cannot call a snake in a sack a misadventure.",
    stamps: { evidence: 1, nerve: -1 },
    needs: [all(flag("bandLondon"), flag("bandRope")), "Needs the motive learned at dawn and the dummy rope found"],
    who: "Dr Watson",
    says: "You mean to catch it, Holmes. Alive. In a pillow-case. I have been in a good many tight places with you, and I do not think that any of them has been so small.",
    roll: {
      p: 0.75,
      scale: ["evidence", 0.04, 0.45, 0.9],
      ok: {
        text: "The sack goes over the grille at the first whistle, with a sail-maker's knot at the neck and Watson's hands on the cord. The thing comes down the rope into the dark, finds the bag instead of the bed, and is a heavy, angry, lashing weight at the end of your arm. You carry it out through the window into the park, and you do not at all enjoy the walk.",
        stamps: { evidence: 1, nerve: -1 },
      },
      bad: {
        text: "The knot is the wrong knot. The sack gapes, and the thing is out of it and into the dark of the room with a hiss like a kettle, and by the time the lantern is lit it has gone back by its own road, and there is a sound of someone falling in the next room. When you reach him, he is beyond all help, and there is nothing left for you to prove.",
        stamps: { nerve: -2, evidence: -1 },
        next: "ENDING_THE_DOCTOR_LIVES",
      },
    },
    next: "ENDING_THE_ADDER_AT_THE_INQUEST",
  })],
  ["B3", opt({
    label: "Go to Her Door in Your Own Name and Tell Her the Whole of It.",
    detail: "You know what the King wrote, and what he wants, and you have stood in her mews in gaiters. There is only one honest thing left to try, and it is the one thing that Europe would never expect of you.",
    stamps: { standing: 1, nerve: -1 },
    needs: [all(flag("bohemiaFull"), flag("bohemiaGroom")), "Needs the King's whole story and an afternoon in her mews"],
    axis: { heart: 1 },
    who: "Mrs Norton",
    says: "You have come to tell me the truth, Mr Holmes. I have been waiting four years for somebody to try it. Please sit down. I am not going to say anything for at least ten minutes.",
    outcome: "She hears it all, in the lamp-lit drawing-room, without moving. When you have done she rings for tea, and says that she will not sell the photograph and will not use it, and will put it, with a letter of her own, in the safe of a firm in Lincoln's Inn, to be opened only if the King breaks his word to her. It is, she says, the nearest thing to a treaty that either of them has had. You carry the proposal to Baker Street in a cab, in the rain, a good deal lighter than you went.",
    next: "ENDING_THE_UNDERTAKING",
  })],
  ["G4", opt({
    label: "Ask Them All to Baker Street for New Year's Eve.",
    detail: "Henry Baker, who knows the truth, and Mrs Oakshott, who reared the geese, and Peterson, and John Horner, who has been in a cell. And James Ryder, to be sat in the middle. It is a dinner, and it is a trial, and it is the only one in London that could end in a toast.",
    stamps: { standing: 1, nerve: -1 },
    needs: [all(flag("carbTruth"), any(flag("carbOakshott"), flag("carbPaid"))), "Needs Henry Baker told the truth, and Mrs Oakshott found"],
    axis: { heart: 2 },
    who: "Henry Baker",
    says: "You mean me to sit at my own table with the man who put a stone in my goose. Mr Holmes, I have been a poor man for a good many years, and I find that I have a great deal of spare charity. I shall be very much surprised if I do not need it all.",
    outcome: "It is the strangest dinner that Mrs Hudson has ever laid. Ryder sits between the hat and the plumber and eats nothing, and is looked at with a good deal of mild curiosity by a stout widow from the Brixton Road, and at the end of the second course he stands up, white as the cloth, and tells it all. Nobody says a word. Then Henry Baker, who has not at any point raised his voice, passes him the sprouts.",
    next: "ENDING_THE_GOOSE_CLUB",
  })],
  ["L4", opt({
    label: "Give Mr Wilson the Cellar Key and Let Him Wait at the Top of the Stair.",
    detail: "He has told you all of it, and you have seen the knees of his assistant's trousers. A pawnbroker who has been robbed of his own cellar has, you think, a good deal of right to be the man standing over the hole.",
    stamps: { standing: 1 },
    needs: [all(flag("leagueFull"), flag("leagueKnees")), "Needs Mr Wilson's whole story and the assistant's trousers seen"],
    who: "Jabez Wilson",
    says: "Me, Mr Holmes? In my own cellar? With my own umbrella? I do not at all know what I am to say. But I should be very proud to be asked.",
    outcome: "He is a stout, flushed, brave little man, and he takes up his post at the top of his own cellar steps with the family umbrella across his knees and an expression of immense and trembling dignity. At ten past ten a flagstone rises, and a head of red hair comes up through the floor, and Mr Jabez Wilson, who has never struck anyone in his life, brings down the umbrella, with both hands, upon the exact middle of it.",
    next: "ENDING_THE_UMBRELLA",
  })],
];

export const hiddenEndings = [
  end(
    "ENDING_THE_ADDER_AT_THE_INQUEST",
    "The Adder at the Inquest",
    "narrative",
    "SURREY DOCTOR COMMITTED FOR TRIAL: THE EVIDENCE IN A SACK",
    "It is produced on the second day of the inquest into Julia Stoner's death, in a closed wicker basket, with the coroner standing a good way back, and nothing in the course of the proceedings has so much effect. Dr Grimesby Roylott is committed for trial at the Assizes and does not at any point speak; he looks at the basket the whole of the time. He is condemned in July. Helen Stoner goes to her aunt at Harrow and is married in the autumn, and in the year after sends you, by post, a small, plain, extremely unexpected present: a pair of very good, very thick gloves.",
    [
      [flag("bandWatson"), "THE ADDER AT THE INQUEST: A WITNESS AT THE WINDOW", "It is produced on the second day of the inquest in a wicker basket, and the coroner stands a good way back. Dr Watson is called, gives his evidence in the clear, flat voice of an army surgeon, and is asked whether he was frightened. He says that he was extremely frightened, and that he would do it again. Dr Grimesby Roylott is committed for trial and condemned in July."],
    ],
  ),
  end(
    "ENDING_THE_UNDERTAKING",
    "The Undertaking",
    "narrative",
    "BOHEMIAN COURT: A PROMISE PUT IN WRITING",
    "The King signs at Baker Street, in the kind of fury that does a man credit, with the mask on the table and a very sulky Chancellor at his elbow. He undertakes in writing to leave Mrs Norton unmolested for the rest of her life, and she undertakes, with her own signature and a seal in violet wax, that the photograph will be put away for ever in the safe of a firm in Lincoln's Inn. Nobody is humiliated. The betrothal is announced in June. In the summer there comes to Baker Street a note, on violet paper, that says: 'Quite so. I.N.' It is, you think, a signal that the treaty has been ratified.",
  ),
  end(
    "ENDING_THE_GOOSE_CLUB",
    "The Whole of the Goose Club",
    "narrative",
    "A CHRISTMAS DINNER AT BAKER STREET: THE COUNTESS'S STONE RESTORED",
    "By the second course it is quite clear that nobody at the table is going to be hanged, and by the fourth that nobody is going to be sorry. The blue carbuncle goes back to the Countess of Morcar with a covering note from Mr Sherlock Holmes, and John Horner the plumber is paid, out of the reward, the better part of what it cost him to be in prison. James Ryder goes to Canada in the spring with a letter of introduction from a gentleman in Museum Street who keeps a goose-club, and keeps, on the whole, remarkably straight. You tell Watson that you have never known the season of forgiveness so thoroughly overdone.",
    [
      [flag("carbOakshott"), "THE WHOLE OF THE GOOSE CLUB: A WIDOW'S DINNER", "Mrs Oakshott of the Brixton Road, who reared the geese and has not been so far from Brixton since her wedding, tells the table what a goose will and will not swallow, and Ryder is the only man present who is seen to take notes. The stone goes back to the Countess, and the reward to the plumber, and Ryder to Canada."],
    ],
  ),
  end(
    "ENDING_THE_UMBRELLA",
    "The Pawnbroker's Umbrella",
    "narrative",
    "PAWNBROKER FELLS NOTORIOUS CRIMINAL IN OWN CELLAR",
    "John Clay is taken in the cellar of the pawnbroker's shop in Saxe-Coburg Square at ten past ten on a Saturday night by a stout and trembling gentleman with an umbrella, and is carried out by Mr Peter Jones of Scotland Yard feeling, as he says, a good deal more insulted than hurt. His accomplice is taken in the tunnel by three police. Jabez Wilson is the toast of the City for a week, is presented with a very handsome umbrella by the directors of the City and Suburban Bank, and is asked by three separate newspapers to describe his feelings. He says that he does not at all know what they were. He says that they were red.",
    [
      [flag("leagueMen"), "THE PAWNBROKER'S UMBRELLA: THE YARD AT THE FOOT OF THE STAIRS", "John Clay is taken in a pawnbroker's cellar by a stout gentleman with an umbrella, and Mr Peter Jones, who has been waiting four years to put his hand upon the man's collar, is just in time to put it there. He is exceedingly gracious about the umbrella. The directors of the City and Suburban Bank present Mr Wilson with another."],
    ],
  ),
];

export const hiddenFlavor = {
  novelNotes: {
    ENDING_THE_ADDER_AT_THE_INQUEST: "Invented. In the story the snake turns on Roylott and no one is tried.",
    ENDING_THE_UNDERTAKING: "Invented. In the story Adler leaves England with her husband, and Holmes never speaks to her again.",
    ENDING_THE_GOOSE_CLUB: "Invented. In the story Holmes lets Ryder go alone, and the dinner is Holmes and Watson's.",
    ENDING_THE_UMBRELLA: "Invented. In the story it is Holmes who seizes Clay.",
  },
  endingHints: {
    ENDING_THE_ADDER_AT_THE_INQUEST: "In The Speckled Band, learn the motive at dawn, find the dummy rope, and take the snake alive.",
    ENDING_THE_UNDERTAKING: "In A Scandal in Bohemia, hear the King's whole story, play the groom, and go to her door in your own name.",
    ENDING_THE_GOOSE_CLUB: "In The Blue Carbuncle, tell Henry Baker the truth, find Mrs Oakshott, and ask them all to dinner.",
    ENDING_THE_UMBRELLA: "In The Red-Headed League, hear Mr Wilson's whole story, see the assistant's knees, and give Mr Wilson the key.",
  },
};
