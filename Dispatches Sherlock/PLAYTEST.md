# Playtest notes: Sherlock

**No human has played this yet.** What exists: the engine baseline, an exhaustive search (every scene, ending, gate and unlockable option reachable on every difficulty), a balance check (a cautious player never collapses; a random one about 8%), 24 headless UI runs that all reach an ending, a canon-claims register, and an accessibility check. None of that says whether it is fun.

## Ask a tester
1. Did Act I make you want to hunt the Professor, or did it read as a list of errands?
2. At the choice of road (scene 11), did you know what each one meant? Did you feel shut out of the Yard or the street road, and was the lock's hint clear?
3. Which gambit felt unfair? Which ending felt unearned?
4. Did the three gauges mean different things to you, or did you just avoid the lowest?
5. Was any line wrong about Doyle's stories? (Eight claims in `claims/canon-notes.json` are marked `memory`.)

## Known soft spots
- The Yard and street roads now end in three steps, and a well-prepared player has a sure route to the win; has nobody checked that the sure route is not too sure, or too hidden?
- The street road is shut unless the Irregulars were hired in scene 5, and the Whitehall road needs Mycroft's trust; most random play never reaches either.
- The road is chosen at about the fourth choice and a run is about 25 choices. Does the early fork feel like a real choice, or like a menu? Does anyone choose the street road, and does the Whitehall road feel earned?
- The validator takes under a minute now that it stops as soon as everything is reached and searches the smallest unseen volume first; it is no longer an exhaustive proof of every state, only of every scene, ending and option.
- The three short cases are new and untested by anyone: are they too easy, and does the Strand matter at all in a four-scene case?
- Mrs Norton's letter, the disguises and the cable room are new in the long case; ask whether each felt like a real choice.
- The examinations reward reading the scene text for a clue; a tester should say whether the clue was fair.
- The map is a hand sketch: ask a Londoner whether the streets are close enough to be forgiven.
- Nobody who knows the period has read the details of the Yard scenes (warrants at Bow Street, the Old Bailey in June).
- The atmosphere, the violin sting and the gauge sounds are synthesised and have not been heard by anyone but the author (the browser would not play them in the checks). Is the drone pleasant or a headache?
- The finales now have a second chance. Does a well-prepared player still feel the capture was earned, and does a careless one still feel that it could slip?
- The two new investigations (the river and the hotel) are optional in spirit: does a tester see what they pay off in the finale?
- The paper look has been checked for contrast by a script and by eye on a phone-width screenshot only; ask someone to read a long scene in it, outdoors.
- Deadlines: do the late and early cards feel fair, or like punishment for a bad run of luck? Does anyone notice that Hours decide them?
- The Professor's answers: do five of them feel like an opponent, or like a tax on cutting arms? Is the counter (a watch set, warrants sworn) discoverable?
- The hidden endings: does a tester find any of them without being told? Is the lock's hint enough to guess the missing choice?
