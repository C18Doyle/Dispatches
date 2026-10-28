// Who sounds like what. Each entry is a constraint on that speaker's quotes (checked by scripts/check_prose.mjs) and, where it can be done mechanically,
// a rewrite that gen/polish.mjs applies. A speaker with no entry is not held to anything.
//   maxWords    the longest quote the speaker may have; whole sentences are dropped from the end of a longer one
//   noSemicolon the speaker does not talk in semicolons
//   noExclaim   the speaker does not shout
//   swap        [regex, replacement] pairs applied first
export const VOICES = {
  Wiggins: { maxWords: 24, noSemicolon: true, why: "a street boy: short, quick, no semicolons" },
  "Inspector Lestrade": { maxWords: 28, noSemicolon: true, why: "a policeman: blunt, to the point" },
  "Mycroft Holmes": { maxWords: 38, noSemicolon: false, why: "slow and exact; the longest speeches on the page" },
  "Professor Moriarty": { maxWords: 30, noExclaim: true, why: "mild, formal, never raises his voice" },
  "Mrs Norton": { maxWords: 34, noExclaim: true, why: "dry and quick; never gushes" },
  "Mrs Hudson": { maxWords: 28, why: "a landlady: she runs on, but not for long" },
  "Dr Watson": { maxWords: 30, why: "warm and a little formal; says Holmes" },
};

// the contraction habits of each speaker: a share of their quotes that must have one (or, for 0, none may). Mycroft, Moriarty and Mrs Norton do not
// contract; Wiggins, Lestrade and Mrs Hudson do.
export const CONTRACTIONS = {
  Wiggins: { atLeast: 0.6 },
  "Inspector Lestrade": { atLeast: 0.6 },
  "Mrs Hudson": { atLeast: 0.4 },
  "Mycroft Holmes": { atMost: 0 },
  "Professor Moriarty": { atMost: 0 },
};

// Quotes that carry a fact the story needs (a date, a ship, a name): never trimmed. Keyed as "scene:option index".
export const KEEP = new Set(["M6B:0", "Y9:5", "Y9:1", "4:3", "C4B:0", "AC:0"]);
