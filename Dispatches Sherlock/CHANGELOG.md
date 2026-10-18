# Dispatches Sherlock changelog

Player-facing and rules-facing changes only. Newest first. Add an entry in the same commit as the change.

## 0.4.0 (2026-10-18)
### Added
- **Houndstooth**: the whole game is restyled as a Victorian parlour (a houndstooth ground, cream and oxblood cards, Playfair Display, Rokkitt and Lora). The fonts are bundled into the page, so it works offline.
- **The Strand**: three smaller lines under the three gauges (Hours, Hands, Wires), each -8 to +8 with its own warning card at -5 and its own ruin at -8, one ending ("The Strand Snaps", three versions). Short lines make a gauge harder to fill (six coupling rules in all).
- **Different cards for different messages**: telegram, handwritten note, calling card, journal and guidebook page, instead of one newspaper.
- **Board** tab: the traces, people and moves you have pinned, the Professor's web (eleven arms, found and cut, and what he does about it) and the questions you cannot yet answer. **Calendar** tab: where the scene falls in 1891 and how long to the next date that matters.
- **Disguises** (priest, sailor, clerk): pack one in the back bedroom on the last Friday and it opens a choice on one of the roads.
- **The Whitehall road is deeper**: three scenes in the cable room to break the Professor's cipher, the Professor himself at the Diogenes Club, and two new finales (read his cables to the Cabinet, or have Special Branch take him at Southampton).
- **Mrs Norton (Irene Adler)** writes in February; her own trust meter and three ways to answer. She can burn the letters, sell them for bait, or leave London, and it comes back later on the Yard and Continental roads.
- **The Case-Book**: the game opens on a shelf with The Final Problem and three short standalone cases, A Scandal in Bohemia (1888), The Speckled Band (1883) and The Blue Carbuncle (1889): thirteen scenes in all (shelf plus twelve), nine endings, their own cards, map places and gauges.
### Changed
- The exhaustive validator stops once every scene, ending and option has been shown reachable, ignores flags and trust that nothing later reads, and caps values that cannot matter any more (the full search had grown past ten minutes). It now takes about three minutes. Witness runs now push one gauge down and a trust up at once.
- The balance check plays each of the four volumes separately.

## 0.3.0 (2026-10-14)
### Changed
- **The road is chosen at the fourth choice, not the nineteenth.** After the brick in Vere Street, scene F1 asks whom you trust first (the Yard, the boys, your brother, or no one), and each answer sends you down its own short arc (four new scenes: F1, MA, MB, FA). The old Act I scenes that applied to everyone are now consequences of what you chose: the roof examination only follows the rooftop chase, the case board is a detour for the Yard and the lone road, the dray only meets a man who told Watson nothing. Scene 11 now confirms the road you chose, or lets you change it. A random run is 25 choices (it was 31) and reaches its first road scene at about choice 12 (it was 19).
- Ruin endings are told through the road that led to them (five versions of each).
### Added
- **Trust changes the story**: options and scenes that open only to a detective an ally has lost (win over the Chief Inspector, wait in the corridor, Watson goes to the hotel without leave) and sure routes at the finales for one an ally trusts (Lestrade holds the lane, Wiggins leads the boys in, Mycroft's boat below the gorge, Watson's aim, the ledger printed with the editor's backing).
- **A way back**: once each, a night at Watson's for a ruined Nerve, Lestrade's word for a ruined Standing.
- **Gauge coupling** (new in engine 0.4.0): a short gauge makes gains in another smaller, and the screen says so.
- The Colonel is felt across the game: an early hook at the Professor's visit and echoes on every road.
- **One tabbed bar** (Baker Street, Company, Map) instead of three stacked panels; **Company** shows each ally's trust and the last thing they were heard to say; **a notebook** in the examination scenes lists the traces you have read; **Watson's suggestion** (Easy only) picks a scene's best-looking option in one tap.
- **A shorter ending screen**: the story and one line of gauges, with the record, the road, what you carried, the canon note and the share card each a closed fold.

## 0.2.0 (2026-10-14)
### Added
- **Forty-two more scenes (81 in all) and three more endings (16).** Act I gains a roof examination (X1-X3), a case board with three side cases (the codex, the coachman, the governess), and three early forks (the boys' first report, the divisional book, the dead man walking). The Yard road gains the press, the prisoners, a study examination and a witness, and ends in a three-step finale; so does the street road, with the Colonel's club, the printer and the boys' quarrel. The flight gains letters at Brussels, the Basel train, the lake steamer and the guide's warning, and now continues past the Falls into four scenes of the years away and the return ("The Return to Baker Street").
- **A fourth road through Whitehall** (eight scenes): the Strangers' Room, the second ledger, Special Branch, a minister, the Bank, the Professor's terms, and the Cabinet Room, with two new endings, "In Her Majesty's Service" and "The Second Ledger".
- **Trust**: Watson, Lestrade, Mycroft and Wiggins each carry a hidden trust that moves with what you do and unlocks options; the Baker Street panel shows it in words.
- **Examinations**: pick what to read in three scenes running, and state a deduction only if you read the right traces.
- **Hard-only choices** (four, each a way to raise money) and a number of choices locked behind trust.
- **A sketch map** (London and the Continent) with the places you have been, a set of line-art plates on the newspaper cards and the endings, an atmosphere (drone, fog and a distant chime, off in Settings), a violin sting at the Falls, and a different sound for each gauge in crisis.
- **A richer ending screen**: the road as a strip of scenes (round dots are gambits), every choice listed, what you missed, and a share card with the road and the trust you ended with.
### Changed
- Every gain of Evidence is one point smaller (83% of random runs ended at +10). The validator now prunes dominated states and proves the ruin endings with witness runs (10 million states became about 300 thousand). "The Empty Grave" is now the ending of choosing, in 1894, not to come home.

## 0.1.0 (2026-10-14)
### Added
- First version: *Sherlock Holmes: The Final Problem*, London 1891. Twelve scenes of Act I, then one of three roads (Scotland Yard 9 scenes, the street war 8, the flight across Europe 10), thirteen endings (three ruins, ten stories) with variants, five newspaper and telegram cards, three crisis cards, three gauges (Evidence, Standing, Nerve), a hidden pair (Heart, Company) behind nine "How it's remembered" readings, gambits (31 of them, with strain below -4), Watson's advice, Mycroft's Favour, overheard talk and Watson's Notebook, three named difficulties, and an "In the Canon" note on every ending.
- The Case-Book (endings found, last ten runs), a copyable summary, run saves, the UI baseline (24 headless runs), the engine baseline (240 runs), `claims/canon-notes.json` and its check.
