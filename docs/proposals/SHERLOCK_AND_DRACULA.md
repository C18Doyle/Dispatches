# Dispatches: Sherlock and Dracula, two proposed designs

Status: proposal, not started. Written 2026-10-10 for the author to choose between.

Both designs rest on the same fact: **the two stories overlap in time.** Stoker's novel runs from May to November of a year the text leaves out (his working notes and most readers put it in 1893). Conan Doyle sent Holmes over the Reichenbach Falls in May 1891 and brought him back in April 1894: the Great Hiatus, three years in which the world thinks the detective is dead. A Holmes who is alive, unseen and abroad in 1893 is not a crossover that fights the canon of either book. It fits in a gap that Doyle himself left open.

**Rights.** *Dracula* (1897) and every Holmes story (the last was published in 1927) are in the public domain in the United States and the United Kingdom. What is not free: the Universal and Hammer films' look (Lugosi's cape and widow's peak), and anything from a later adaptation. The game must work from the printed texts only. Sources would be Project Gutenberg editions, checked against the novels, in the same way as `claims/source/frankenstein-1818.txt`.

**What the series already gives either design** (nothing here needs a new engine): the node and choice format, the three-meter triangle with a label per seat, contested rolls with a stated dispute, hard mode with its own erosion rule, easy mode and command rank, the Order of Battle screen (renamed below), echoes between files, the claims register and `check-claims`, the quotation checker, the testkit baseline, the Near East-style per-seat map, the glossary and the "what this game leaves out" panel, per-seat document theming.

---

## Design A: "The Two Files" (two seats, one autumn)

**One line.** You hold two files in the same six months of 1893: Mycroft Holmes's, in Whitehall, and the Count's, in Transylvania, Whitby and Piccadilly. What one file decides, the other reads.

**Premise.** Sherlock is presumed dead, travelling, and sends no word. His brother Mycroft, the one man who knows he is alive, sits at the centre of the British government's small intelligence work and is handed the oddest dossier of his career: a solicitor's clerk who has come back from the Carpathians changed, a Russian schooner that ran aground at Whitby with no crew, a lunatic at Purfleet who eats flies. The second seat is the Count's own household and correspondence.

**The seats** (the series' "commands").
- *The Diogenes Club file (Mycroft, Whitehall)*. Document: Foreign Office minute paper, Home Office telegram, Scotland Yard report, Watson's letters. Meters: **Evidence** (what can be shown to a sceptical government), **Discretion** (how little the press and the public know), **Reach** (men and money that Whitehall will lend). Label for the third axis: *Reach*. Hard mode: *Exposure* (each choice that touches the Crown or the press adds to it; at the limit the file is taken from Mycroft).
- *The Count's household (Castle Dracula, then Carfax)*. Document: letters on crested paper, bills of lading, the firm of Hawkins's correspondence. Meters: **Strength** (blood and fitness to hunt), **Secrecy**, **Dominion** (the hold on those he has marked). Hard mode: *Overreach* (the more of London he takes, the more he can be found). The seat is written as correspondence and orders, never gore.
- Optional third seat, later: *Van Helsing's circle* (Amsterdam to London), meters Knowledge, Faith, Time.

**The echoes.** Each seat sets `xc_` marks that the other reads, only when the player departs from the book's own events: whether Mycroft's clerk watches the Whitby harbour in time, whether the Count writes to Hawkins by the open post. A player who keeps to the novel's course meets Stoker's story and nothing else; a player who departs meets a story that neither writer wrote and both could have.

**The signature mechanic: the Dossier Board** (the Order of Battle's cousin). On each big night (Whitby's wreck, the Carfax inventory, the vigil over Lucy, the chase to Varna) the board shows four strands of evidence, each with the real documents behind it; the player places a small pool of attention across them, may name a consultant, and chooses a method. The truth of the night is drawn hidden, and one line of intelligence points at it, right three times in four. The result moves the odds of the contested outcome, measured against what a competent clerk would have concluded alone, so the plain play keeps Stoker's record. Same rules and checker as the Orders of Battle; new configs, new words.

**Shape.** About 16 decisions in each seat, 5 or 6 endings each (the novel's own end; Lucy saved; Mina lost; the Count unfound; the file taken from Mycroft; a Whitehall that closes the case and the books). Dates run as telegrams: the Whitby gale of 11 August, the Lucy transfusions in September, the Count's flight in October.

**Why it works.** It is closest to what Dispatches already is, a person in a seat deciding with incomplete documents, and it is the best use of the echoes and the claims register. Replay value is high because the two seats read each other.

**Risks.** The widest scope: two campaigns' worth of writing and fact-checking. Mycroft's role is invented from a few lines in "The Greek Interpreter" and "The Bruce-Partington Plans", so it must be marked as such and not claimed. The Count's seat needs restraint about predation and about Mina, and the "what this game leaves out" panel must say that the novel's attitudes to women, foreigners and mental illness are the book's own and not ours.

**Rough size.** Comparable to the Ottoman command plus the Order of Battle port, twice over: about 8,000 lines of node text, 250 claims, a Dossier Board part, two themes.

---

## Design B: "The Season of the Case-Book" (one seat, one detective, the clock)

**One line.** You are the detective's own staff: Watson writes the case-book, you decide which leads to follow, and every lead costs hours when the sun is going down.

**Premise.** Told as Watson's case-book (the series' dispatch format is "a document from the seat"). Holmes is alive and back in London; the year is 1897, the year of the novel's publication, and the seat is 221B Baker Street. A run of ordinary Holmes cases (a dozen, each sized like a short story, each a real Doyle plot in outline) is gradually crossed by a single unexplained matter: a stranger buying houses by the Thames, ships arriving with boxes of earth, a doctor at Purfleet whose patient predicts the arrival of "the Master."

**The seat.** *Baker Street.* Meters: **Evidence**, **Nerve** (Watson's and Holmes's, a pair), **Standing** (with the Yard, the clients and Mycroft). Document: the case-book page, a telegram, a page of Watson's notes, Holmes's commonplace index. Hard mode: *Obsession* (each choice that follows a private line against a client's interest adds to it; at the limit the case-book ends in Holmes's room and Watson's silence).

**The signature mechanic: the Clock.** Each lead takes hours; nightfall is a hard line once the Count's matter opens. Early cases are daytime and generous; later cases carry a dusk after which a choice is different (a house can be searched at noon and not at midnight). The Clock replaces the pool of chits: you choose which leads to run before dark. Every decision shows what it costs in hours, and easy mode shows the whole day's board.

**The second mechanic: the Inference** (the Order of Battle, reduced). At the end of a case Holmes lays out the deduction: you choose which three of five clues carry the argument. The staff plan ("let Watson arrange it") plays the story's own solution; a plan that reads the right clues earns more; a wrong reading loses time and standing. The Dracula case uses a longer version with Van Helsing as a rival method (the book's faith and Holmes's reasoning disagree, and the game lets you decide which to trust).

**Shape.** Twelve short cases, three of them in the Dracula thread, then the long case: about 30 decisions in all, 7 or 8 endings (the case closed as a madman's; the Count unseen; Holmes believes and acts; Holmes refuses to believe and Mina pays; the partnership broken; the novel's end). Strong tonal range: most of the book is detective comedy and fog, then the dark turns.

**Why it works.** It is the cheaper design to build and the more focused one: one seat, one voice, one document type, and the easiest to make charming. Sherlock readers get twelve things they already love. The "Clock" is a new, simple pressure that the series does not have.

**Risks.** Holmes meeting a vampire is the crossover that the canon never allowed; Design A keeps to a gap, B puts a supernatural thread through the canon and needs a clear line for how seriously the game takes it (my suggestion: Watson tells it straight, and the ending that says "none of this happened" is always open). Less variety of seat; less for the echoes to do.

**Rough size.** About the size of the Frankenstein game: 30 decisions, 150 claims, a Clock and an Inference part, one theme. Probably a third of Design A.

---

## How they differ, in one table

| | A: The Two Files | B: The Case-Book |
|---|---|---|
| Seats | two (Mycroft; the Count), a third later | one (Baker Street) |
| Year | 1893, the Hiatus | 1897 |
| Tone | grave, procedural, paired | wry, episodic, then dark |
| Signature rule | the Dossier Board and the echoes | the Clock and the Inference |
| Hard mode | Exposure / Overreach | Obsession |
| Size | large | medium |
| Best for | players who like 1914 and the echoes | players who like Frankenstein and the storytelling |
| Main risk | scope and the Count's seat | the crossover's tone |

## What I would do

Build **B first** (it ships sooner and tests the Clock), keep **A's seat structure** in mind for a second release as "The Count's Household", and reuse B's cases as A's Whitehall dossier. If you want one choice only: **B**.

## Research gates (both)

1. Fix the year of the novel's events from Stoker's own notes and the text's dates (weekday and date pairs in the journals), and record it.
2. Check every Holmes case used against the printed text, and mark every invented link between the two worlds as invented, in the claims register, in the same way as `drafted` claims.
3. Take no image, line or name from a film or a later book.
4. Decide, before writing, how the game frames the novel's period attitudes, and say it in the "what this game leaves out" panel.
