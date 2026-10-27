import { flag, all, any, not, res } from "./lib.mjs";

const mk = (id, title, kind, headline, text, variants) => {
  const e = { id, title, kind, headline, text };
  if (variants?.length) e.variants = variants.map(([cond, headline, text]) => ({ ...(cond.flag && Object.keys(cond).length === 1 ? { flag: cond.flag } : { when: cond }), headline, text }));
  return e;
};

export const newEndings = [
  mk(
    "ENDING_THE_RETURN",
    "The Return to Baker Street",
    "narrative",
    "MR SHERLOCK HOLMES ALIVE: THE GREAT DETECTIVE RETURNS AFTER THREE YEARS",
    "The Park Lane mystery is solved within the week, and the world, which had stopped expecting anything of the sort, takes the news with a gasp. There is a long, loud, delighted correspondence in the newspapers. The Yard sends a polite note. A man who had been buried in a black border is sitting, in the same armchair, with the same pipe, in the same cloud of smoke, as if the Reichenbach Falls had been a fortnight's holiday. Mrs Hudson, on being told, puts her apron over her head and goes into the pantry, and comes out again looking very well. The rooms smell, for a month, of lavender and old books.",
    [
      [flag("dramaticReturn"), "A BOOKSELLER'S SURPRISE: DR WATSON FAINTS IN HIS STUDY", "Watson tells the story of that afternoon, afterwards, to anyone who will listen, and at each telling it grows a little. He had been writing at his desk when an old bookseller came in with an armful of volumes, and the bookseller had said something about a bargain, and when he looked up the bookseller was gone and in his place was a lean, pale, grinning, perfectly familiar face. 'I have never fainted in my life,' he says. 'I fainted then. And I'll thank you not to laugh.' You do not. Not very much."],
      [flag("gentleReturn"), "THE LAMP LIT AND THE SUPPER LAID", "You come in with your own key, by the old stair, to the room that has not changed. Watson is in the armchair. He does not turn round. He says, in a perfectly steady voice, that you took your time, and you sit down opposite him, and neither of you says anything for the better part of an hour. It is the quietest, kindest return that a man could have had, and it is the only one that you will ever wish to remember."],
      [flag("returnedEarly"), "A MAN WHO HAD ALREADY COME HOME ONCE", "You came home once before, in the dark, in a closed cab, to sit beside a friend in a silent room. Nobody knows it but the two of you. When you walk into Baker Street in the April of 1894, in plain daylight, Watson takes your hand and says only that it was a very long time between visits. You say that it was. You do not say that you would have come sooner, if you had been able. He knows."],
      [flag("wroteWatson"), "THE LETTER FROM FLORENCE", "Watson has the letter still. He has kept it in his pocket-book for three years, with the creases worn white, and he takes it out on the first evening, and lays it on the table between you without a word. It is four lines long. 'I had it by heart,' he says, 'in a week. I only kept it to be sure that I had not made it up.' You do not trust your voice. You pour the whisky."],
      [flag("mycroftFunds"), "A SUPPER FOR TWO, LAID BY A BROTHER", "Mycroft is in the sitting-room when you arrive, in your chair, with a cold supper laid for two and the air of a man who has been there since noon. 'You are late,' he says. 'I have paid your bank for three years, and I do not propose to be thanked.' He is, for the first time in your memory, extremely moved, and he conceals it by eating a chicken leg."],
    ],
  ),
  mk(
    "ENDING_HER_MAJESTYS_SERVICE",
    "In Her Majesty's Service",
    "narrative",
    "PROFESSOR MORIARTY: A QUIET END. THE NAPOLEON OF CRIME IS NO MORE",
    "There is no trial, no headline, no inquest. A closed carriage, a closed court, and a closed file, and by Whitsun the Professor's organisation has ceased to exist, quite as though it had never been. You are given a small office in a street off Whitehall, with a name on the door that is not your own, and a salary that is paid by a department that does not appear in the Estimates. It is interesting work. It is not, you reflect, the kind of work that one boasts of, even to Watson, who is told only that you are engaged on 'a matter for a friend in the Government'. You keep the commission in a drawer, and you do not read it.",
    [
      [flag("ministerHeld"), "A HAND ON THE LEVER", "You hold, in a small black pocket-book, the signature of an Under-Secretary of State, and it is a thing that you will use very seldom, and never lightly. It makes you a good servant to the Crown, since a man who owns a minister is a man who need never be ignored. You are very good at it. You tell yourself that you will not become what you have caught. It is a thing that is easy to say in the first year."],
      [flag("cleanHands"), "A SERVANT WHO WOULD NOT READ", "You serve the Crown, and you have never opened the black book, and the Crown, to its surprise, rather likes it. 'A man who has not read it,' says Mycroft, 'cannot be asked what is in it.' It is a very sound principle. It lets you sleep. It is also the one thing about the whole affair that you have never been able to look at straight."],
    ],
  ),
  mk(
    "ENDING_THE_SECOND_LEDGER",
    "The Second Ledger",
    "narrative",
    "THE GREAT SCANDAL: ELEVEN COLUMNS IN THE STANDARD; THREE MEMBERS RESIGN",
    "It is called, within a week, the Moriarty Scandal, and it runs for the whole of the summer. Three Members of Parliament resign. A bishop goes abroad. A Cabinet Minister makes a speech of three hours, and is not believed. At the end of it there is a Royal Commission, and a Bill, and a very great quantity of ink. The Professor's name is spoken in the House with a kind of reluctant awe. Mycroft does not speak to you for the whole of the autumn, and then, one evening in November, he calls in a hansom without a number and says only that he has come to say that you were right, and that he cannot bear it.",
    [
      [flag("ministerTurned"), "A MINISTER WHO SPOKE FIRST", "Lord Harcastle is the only man in the book who has already confessed, and the only one who is not ruined. He gives evidence to the Commission in a low, level voice and is spared by an act of the House. It is a very curious thing. You are, you find, glad for him, and a little ashamed of being so, and the two feelings sit side by side at your table for the rest of the year."],
    ],
  ),
];

/** Replacements for existing endings whose text assumed the old route. */
export const replacedEmptyGrave = mk(
  "ENDING_THE_EMPTY_GRAVE",
  "The Empty Grave",
  "narrative",
  "HOLMES: A MEMORIAL. THE GREAT DETECTIVE'S NAME REMAINS IN BLACK",
  "You decide that the dead shall stay dead. In the house in the south of France there is a chemical bench, a window on a garden, and a very good view of the sea, and nobody comes to it who has any idea who you have been. The Park Lane mystery is solved by somebody else, or by nobody. The Professor's organisation is a ruin, and the Colonel is a hunted man. London goes on without Sherlock Holmes, quite as well as it did with him, and rather more quietly. In the evenings you play the violin, to the window, and the window does not applaud.",
  [
    [flag("tellNoOne"), "ONE MAN WHO NEVER KNEW", "You told no one at all, at the beginning, and you have kept to it. There is not a person alive who has your address. The silence has grown round you year by year, like a coat of dust on a shelf, and it has become a kind of comfort and a kind of cell. Sometimes, in the dusk, you think of Watson, and then you do not."],
    [flag("mycroftKnows"), "ONE MAN IN LONDON KNOWS", "Your brother's draft arrives every quarter, with a short note that says nothing. He knows where you are, and he has kept it from every living soul, including the Prime Minister. He writes in the cipher of your boyhood, and sometimes, at the foot, he writes the name of a book that he thinks you ought to read. You do not tell him that you would sooner he came to see you. It is not a thing that you say."],
    [flag("watsonDecoyed"), "A FRIEND'S FUNERAL", "Watson came back from the hotel at the Falls and found the note, and the cigarette-case, and the stick. He did not know what to believe, so he believed the worst. You know it, and you have not written. It is a thing you tell yourself you will put right, in the spring. In the spring you tell yourself that it will be the next one."],
  ],
);

/** Variants put at the FRONT of an existing ending (first match wins, so the specific ones go first). */
export const frontVariants = {
  ENDING_NET_CLOSES: [
    [all({ branch: "MYCROFT" }, flag("lawClause")), "THE LAW AT LAST: A CLAUSE KEPT", "The trial is held in public, at the Old Bailey, in the first week of June, because you insisted on a clause and your brother, who has never in his life been outflanked, was outflanked. The Professor stands in the dock with his hands folded and his head swaying slowly from side to side, and he listens to every word of it as if it were a lecture. The Government sits on its hands in the gallery, and very nearly all of it is spared. It is the cleanest victory of your career, and you feel not the least inclined to enjoy it."],
    [all({ branch: "YARD" }, flag("roofWatch")), "TWELVE BOYS ON THE ROOFS: THE NET CLOSES", "The Professor is taken on the towpath at three in the morning with a carpet-bag in his hand, and it is the boys who saw him first, twelve small whistles passed from slate to slate down the length of the street. Wiggins is thanked in the Commissioner's own office, in a clean collar. He tells the story for the rest of his life, with the twelve boys, and the whistles, and the Commissioner's handshake, and he never once says that he was frightened."],
    [all({ branch: "YARD" }, flag("canalOnly")), "A SINGLE DOOR, A SINGLE GUESS", "You staked everything on the canal, and the Professor came by the canal, as he had to, a long figure on the towpath with a bag in his hand. Lestrade says afterwards that it was the finest piece of work he ever saw and the most reckless, and that he does not want to see either again. You say that it was not a guess. He says that it was. You both leave it at that."],
  ],
  ENDING_REASON_OF_STATE: [
    [all({ branch: "MYCROFT" }, flag("immunityAccepted")), "SOUTHAMPTON, TUESDAY: A GENTLEMAN SAILS", "He sails on the Tuesday, in a first-class cabin, under his own name, with two trunks and a violin-case, and the newspapers say nothing, because no newspaper has been told. The names in the black book are safe, and the House of Commons sleeps quietly. Mycroft sends a case of claret, which you give to Mrs Hudson, who gives it, in turn, to the milkman. It is the nearest thing to a joke that the whole of the Moriarty business has produced."],
  ],
  ENDING_NAPOLEON_ESCAPES: [
    [{ branch: "MYCROFT" }, "A MAN WHO WOULD NOT BE A SERVANT, OR A WITNESS", "You walk out of Whitehall into the sunlight, and the Professor goes on, quietly, as he has always done. The Cabinet makes its arrangements without you. The names in the black book are not printed, and not burned, and not forgotten. Mycroft, in his office, takes off his spectacles and rubs the bridge of his nose and says to nobody at all that he had not thought you would do it. It is a very quiet end to a very noisy year."],
  ],
};
