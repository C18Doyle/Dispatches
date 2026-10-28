# Dispatches Sherlock changelog

Player-facing and rules-facing changes only. Newest first. Add an entry in the same commit as the change.

## 0.7.0 (unreleased)
### Changed
- **A copy-edit pass over the whole text.** The habits that read as machine-written are thinned out by rules that run on every build (`gen/polish.mjs`) and by 65 hand-written rewrites (`gen/rewrites.mjs`): "very" 316 times to about 40, "a man who" similes and epigrams about a quarter fewer, "It is the most/first/only" openers 62 to 17, "a good deal", "perfectly", "quite" and "rather" roughly halved, and sentences over 40 words 95 to 49. Some outcomes no longer end on a reflective "It is..." line.
- **Not every choice ends on a line of dialogue.** 37 options are silent now, and 28 long scenes break into two paragraphs.
- **Each speaker sounds like themselves.** Wiggins, Lestrade, Mrs Hudson, Mycroft, Moriarty, Mrs Norton and Watson have a length limit, and Mycroft and Moriarty do not contract while Wiggins, Lestrade and Mrs Hudson do (`gen/voices.mjs`).
- **Names and labels.** The endings record on the title screen is the Ledger; the Case-Book is the shelf. Cards are tagged by what they are (Telegram, Note, Calling card, Journal, Guide, Newspaper), and a telegram's stamp says what became of it (RECEIVED, TOO LATE, UNDELIVERED, or none).
- **Gauge labels are readable**: the smallest were 8.8 px and are now at least 10 px.
### Added
- **A sticky gauge strip**: once the gauge card has scrolled out of sight, a slim strip of the six gauges stays at the top of the screen.
- **A style lint** (`npm run check:style`, in `npm test`): phrase budgets that may not grow, a limit on run-on sentences, each speaker's voice, the conventions for labels and titles, and a glossary (one name for each thing).
- **A continuity check** (`npm run check:continuity`, in `npm test`) against a bible (`claims/continuity.json`): no link goes back in time, and no scene description names a character before every path to it has introduced them.
- **A layout check** in a real browser (`npm run check:layout`; not in `npm test`, it needs Chromium): 13 screens at 320, 375 and 600 px, failing on horizontal scroll, overflow, small tap targets and tiny text, with screenshots and a recorded height per screen.
- **Transcripts**: `npx tsx scripts/transcripts.ts 30 0` writes readable random playthroughs to `tests/transcripts/` for a person to read for contradictions.

## 0.6.0 (unreleased)
### Added
- **Hours are a real deadline.** The story's dated moments come whether or not you are ready: the Monday raids (Yard), the tide on the Tuesday (street), the Professor's arrival at Meiringen (flight) and the Cabinet's sitting (Whitehall). With Hours short a card says what you lost; with Hours in hand, a card says what you gained. Each shows its cost on the card.
- **The Professor answers a cut.** Five arms of his web (the cab-yard, the Yard's man, the bank, the printer, the cipher) answer in the story, with a card and a cost, unless you made ready beforehand (a watch set, warrants sworn, the route known, the boys in place, the law written into the terms). The board says which answered and which came to nothing.
- **A hidden fourth ending for each minor case**: take the snake alive (Speckled Band), go to her door in your own name (Bohemia), ask them all to dinner (Blue Carbuncle), give Mr Wilson the cellar key (Red-Headed League). Each is locked, with its reason, until you have made the right choices earlier in that case; four new ending plates.
- **One saved case per volume.** You can leave the long case half-played and finish a minor one; the shelf shows each volume's unfinished case with a Resume button. The old single save moves to its volume.
- **A demo and a download.** The demo is the Case-Book with the long case locked at the choice of road (the four minor cases are complete, hidden endings and all); it stops on a screen that says so. The full game also comes as a download (index.html and a README, one file, no network). The release builds both (`npm run build` writes dist/demo too, and `npm run check:demo` plays both).
- **Cards say what they cost**: an interlude with consequences lists its stamps, and cards are labelled Notice, Report or Warning.
### Changed
- **The generator is in the repo** (`gen/`) and is the source of the content files; `npm run gen` writes them and `npm run check:gen` fails if they differ.
- **A writing lint** (`npm run check:prose`, part of `npm test` and CI) holds the house rules: no dashes, UK dates, UK spellings, no placeholders.
- **Every Doyle claim is checked against the text** (Project Gutenberg, 2026-10-24). Twenty-six claims are now "primary". The check found and fixed: "commuting a felony", not "compounding"; the Alpine-stock, the silver cigarette-case and the three-page note; the Baker Street fire (no great harm done); Moran as chief of staff, and that he drops rocks at the Falls; the Irregulars' shilling; and Mycroft's "occasionally he is the British government".
- Engine 0.8.0: an interlude trigger may carry stamps and flags.

## 0.5.0 (2026-10-23)
### Added
- **The shelf is split into one major case and four minor ones**, each card showing how many of its endings you have found, and a card that offers to resume an unfinished case (opening a volume over it puts it away). The ending screen says which volume you finished, how many of its endings you have found, how many volumes you have finished, and what is next on the shelf.
- **The Red-Headed League** (1890): the fifth volume. Four scenes and three endings, with the vault, the card on the door and the half-wage assistant.
- **Two investigations each for the street and the flight.** The street road reads the river and the wharf (tide, chalk marks, lamp-oil); the flight reads the hotel and the path above the Falls (the register, the telegraph forms, a cleft in the rock). What you find opens a sure choice in the finale.
- **Mrs Norton again**: a sworn statement and a dinner at the Café Royal on the Yard road, a warning at the Englischer Hof on the flight. Four scenes in all, and a payoff on both roads.
- **A second chance at every finale that hung on one roll.** A missed net on the towpath becomes a chase (Y9D), a burning warehouse becomes a fight to get the boys out (S8D), and a failed shot at the Cabinet becomes one more throw (M9). Each has a sure route if you prepared (a watch set, the oil counted, the cipher broken, Hands in hand).
- **Sixteen new ending plates**: every ending has its own picture now, and no ending shares a plate with another.
- **The Professor answers**: the board lists what he did about each arm of the web that you cut.
- **Watson reacts to the Strand**: his notebook comments when Hours, Hands or Wires run short (or when all three are well supplied).
- **Hours show on the calendar**: when Hours run short, the calendar marks how many days it has already taken from you and shortens the time left to the next date that matters.
- **A real houndstooth** (a twill weave, drawn in code) on the tweed ground and the itch artwork, and a **paper look** in Settings: the same parlour in daylight, with ink on a pale houndstooth.
### Changed
- Walking away from a finale (closing the file, leaving the room) now costs Standing, and the towpath net's odds rise faster with the Evidence you earned. A cautious player now reaches a capture in about two runs in three; before, most of them walked away.
- The shelf is never saved as a run, so an unfinished case survives a visit to the shelf.
- The accessibility check now reads its colours from `tailwind.config.js` (it was checking an older palette) and checks the paper look. The change found a real failure, a green gain badge at 4.0:1 on the cards, which is now darker.
- The validator searches the smallest unseen volume first, so it finishes in under a minute again.

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
