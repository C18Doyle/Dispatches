# Dispatches Dracula changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased

## 0.4.0 (2026-10-28)
### Changed
- **Hard is harder.** Hard now begins four points down in every reserve (was two) and feels a short reserve three times as much (was twice). A sensible player who cannot see the numbers loses about one Hard run in six; on Easy almost none. The mode descriptions say so.
- **Names are fixed.** "The old man" meant both Mr Swales on the Whitby bench and Van Helsing. Van Helsing is now Van Helsing, then the Professor; the old man is only Mr Swales.
- **Prose.** Both seats were read through for machine-written habits: strings of sentences opening with "You" or "The", lists of three, even rhythm and tidy last lines. Mina's seat had the most.
- **Twenty-four choices now cost something or gain something their neighbours lack.** Before, a choice could be worse than another in the same scene on every reserve, with no reason to take it.
- **Every control is at least 44 pixels each way** and the settings button is larger.
- Words on the screens (headings, buttons, notes) come from one copy deck (`src/labels.json`), in one capitalisation style: Title Case for headings and buttons, sentence case for notes. "Hear It" and "Your Last Runs" changed to match.
### Added
- **Eight room plates** (a study, a library, a bedchamber, a ward, a ship's hold, a tomb, an opera box, a chapel) for scenes set indoors, so London is no longer the picture for two scenes in five, and **a plate of its own for each of Mina's fifteen endings**.
- Checks: `check:names`, `check:voice`, `check:labels`, `check:layout` (every screen, both seats, four looks, phone and desktop; `check:layout:all` for the full run), a fallible player and players set on ruin in `check:balance`, and a check for choices that are worse than a neighbour on every reserve.

## 0.3.0 (2026-10-19)
### Added
- **Real Easy and Hard modes.** The three difficulties used to differ only in whether you could see the sums and whether gold mattered. Now they change the game itself (engine 0.7.0: `strainScale` and `startBonus`). The Householder (Easy) begins with two points in every reserve and feels a short reserve half as much. The Exile (Hard) begins two points down and feels a short reserve twice as much, with gold on top. A random player collapses in about 6% of Easy runs, 15% of Medium and 26% of Hard; `npm run check:balance` now reports that and fails if Easy is not easier than Medium, or Medium than Hard. Mina's seat has the same.
- **Branches in Act I.** Three scenes now have an extra door that leads to a side scene and back: Harker's journal by lamplight (before the first lesson ends), the Szgany in the courtyard (before the boxes are chosen) and the harbour office at Whitby (before Carfax). Each has three ways to spend the hour, twelve new flags, and echoes in later scenes (Mina's name on the Abbey bench, the headman at the pass, a blotted page in the Whitby book). 48 scenes in all.
- **A plate for each Act II track** (the Quiet Colony, the Court, the Storm; for Mina, the Sacred Rite, the Modern Hunt and the Tie) with a drawing, the act title and an epigraph on the track's first scene, and a page glow that takes the track's colour while you play it.
- **Mina's counters:** Host in the Professor's box, the tie with the Count and leads in the record, each worked out from what you have done.
- **Hear it** on every document: the device reads it aloud with its own voice (shown only where the browser has speech).
- **Three ways to get the game** (`npm run build`): the web copy, a downloadable copy (a folder with the page, a manifest, a service worker, icons and a README, so it works offline and can be installed from an https host) and the demo. The demo is the Count's Act I only, and is about 20% smaller because Mina's story is no longer in the file.
### Changed
- The demo's end screen and the how-to page describe the side scenes, the modes and the documents.
- itch.json: the demo and the download are pushed to the game's page; the full web copy waits for its own page (it still reads REPLACE_ME).

## 0.2.0 (2026-10-18)
### Added
- **Four looks**, chosen in Settings and kept per browser: Blood and Bone (the Count's default), Candlelit Study, Carpathian Night and Harker's Journal (cream paper and black ink, the light one, Mina's default). A theme is data in `src/themes.json`; the accessibility check tests every theme's contrast pairs.
- **Artwork drawn in code** (`src/art.tsx`): an illustrated title screen, a silhouette frontispiece for each place, **a picture for each of the fifteen endings**, bat rules, wax-seal choice numbers, drop caps, gilt corners and icons for the reserves. Nothing loads a file.
- **Dread.** When your lowest reserve falls to -4 the page darkens red at the edges; at the brink it beats, the gilt cracks to blood, and the banner cracks and reddens. "Before dawn" scenes tint toward sunrise.
- **Six more documents**, each tied to what you did: the Demeter's log (if you took the crew), Dr Seward's note on Renfield, Miss Murray's journal on the East Cliff (if you marked Lucy), Seward's letter about Miss Westenra, the Westminster Gazette's "A Hampstead Mystery" (if you took Lucy hard) and Mrs Harker's typescript. Newspapers, typed letters and ruled notebook pages each have their own paper. Every statement in them is a claim checked against the 1897 text. (Engine 0.6.0: an interlude trigger can carry a condition.)
- **Mina as a second seat.** A button on the title page switches between the Count and Mina Harker (the page reloads; each seat keeps its own saves, ledger, settings and theme). She has her own title picture, scene pictures and endings plates, and a writing pass: the repetition check now runs on her text too.
- **Sound effects for places and moods**, all generated: a wolf at the castle, a bell at Whitby, a door at Carfax, rats in the East End, wings in the Storm, a heartbeat at the brink, a pen on a notebook page, a bell tolling at an ending.
- **Save Card:** the ending screen makes a picture of your ending (plate, title, record) to save or hand to the phone's share sheet. Nothing is sent anywhere.
- **Fonts are embedded** (cut down to the characters the game uses), so it looks right offline and inside itch.io's frame. `npm run check:fonts` fails if the text uses a character the fonts do not have.
- `itch/`: the cover (630x500), screenshots and the page copy for the itch.io page.
### Changed
- The page is about 1 MB (it was 0.4 MB), mostly fonts and the second seat.
- The how-to-play page describes Before Dawn, Beds in England, the Map and the music.
- The accessibility check covers all four themes; Firefox is added as an advisory step in CI (it cannot be run on the author's machine).

## 0.1.0 (2026-10-14)
### Added
- **The game, from the Count's side.** You are Count Dracula, from the castle in April to the last choice at the end of the passage. Forty-five scenes, eight clippings, letters and notes between them, and fifteen endings. Act I is the same for everyone: Mr Harker's visit (the three letters, the looking-glass, the sisters), fifty boxes of earth, the Demeter, Whitby and Carfax. Act II is one of three tracks: the Quiet Colony, the Court at Carfax and the Storm. Each track has three endings in the open and one that opens only to what you have been; three more are collapses (Strength, Secrecy or Dominion run to -10).
- Three reserves (Strength, Secrecy, Dominion) and two hidden axes (Manner, Longing). Nine readings of how you are remembered, chosen by the axes.
- **The Children of the Night** (wolves, rats and owls): three reports a game that show the costs, one night's hunting that costs elsewhere, what the rats heard, and what the old wolf thinks of you.
- What Mr Harker teaches you in Act I opens options later: the law, manners, the city, whom to avoid. How many boxes you ship decides which endings can open.
- **Ventures** (the engine's rolls), with strain when a reserve is short, three difficulties with names (The Householder, The Nobleman, The Exile) and gold on Hard.
- A hundred and thirty-odd things a run can carry forward: lines in italics under later scenes, and a list on the ending screen. Three scenes where a failed venture leads somewhere of its own.
- The Ledger, the ending screen's "What You Carried" and "In the Novel", Copy Summary, a demo build locked at the end of Act I, save and resume.
- **A second seat, hidden.** Mina Harker's campaign (40 scenes, 15 endings, written from the other side of the same events) is kept in `src/content/mina/`. It is not offered to the player. `npm run check:mina` keeps it validated and playable; `npm run build:mina` builds it for local play. See `CLAUDE.md`.
- Seats: each seat's words (titles, labels, the adviser's panel) are in its own `ui.json`, so the UI no longer names a character.
- Checks: `check:writing` (docs/WRITING.md), the exhaustive validator (now keyed on what the rest of the story can still read, so it runs in under a minute), the balance check, a 240-run behaviour baseline, a 24-run UI baseline, committed saves, and an accessibility check.
- **Act I knowledge pays off on every track.** What Mr Harker teaches you in scene 2 (the law, manners, the city, whom to avoid) now opens or cheapens options on the Quiet Colony, the Court and the Storm, not only in the first scenes after it.
- **More ventures, each with its own failure scene.** Four new scenes (`10-X`, `12B-X`, `16A-X`, `15C-X`) where a failed venture leads somewhere of its own. Forty-five scenes in all.
- **Before dawn.** Seven choices that are a race against the sun (moving boxes, running a ship in, changing cellars) carry a "Before dawn" badge and are mostly ventures on Strength.
- **Beds in England.** A counter under the reserves shows how many beds you have in England and how many are still in the castle crypt. It is the engine's new `trackers` field (engine 0.5.0).
- **What It Cost.** The ending screen gives a plain account of the people named in the passage and what became of them.
- **The Book's Road.** At nineteen scenes the novel's Count does something the game can follow; the ending screen says how far you went with him and, where you left it, what the book does.
- **A route map** from the castle to London (button on the scene screen, and on the ending screen) with the houses you hold, the ones sealed and the ones safe, and a list that says the same in words.
- **A score made in the browser** (`src/score.ts`, Web Audio) that follows the screen and how low the lowest reserve has fallen. No audio file is shipped: Frankenstein's placeholder track is gone.
- **Checked against the novel.** The text of *Dracula* (Project Gutenberg #345) is kept in `claims/source/`. Every statement the game makes about the book is a claim in `claims/novel-notes.json` with a passage that must be in the text (`npm run check:claims`), and the eight choice quotations that are Stoker's own words are checked against it (`npm run check:quotations`). Several facts written from memory were wrong and are corrected in both seats: Carter, Paterson and Company, not Potter and Sons; nine, six and six boxes at the three London houses; the Suicide's Seat; the Demeter's crew.
- **Reports:** `npm run report:options` (which options and endings nobody reaches), `npm run map` writes `SCENE_MAP.md` (a diagram of the scenes and a table of where every flag is set and read; `check:map` keeps it current).
- `npm run check:repetition`: counts the habits that make machine-written prose recognisable (repeated phrases, sayings as option details, passages that end on a saying, "very", "nobody") and fails when one passes its limit.
### Changed
- **A full writing pass** over all the Count's text. Every option's detail line now says what the option does and what it risks, in place of a general saying; the last choice of each track no longer repeats its outcome as the first sentence of its ending; three scenes that shared one paragraph word for word now have their own; "very", "a great deal" and "nobody" are down to a fraction of what they were.
- The how-to-play page describes Before Dawn, Beds in England, the Map and the music.
- Mina's seat (hidden) was corrected for the same novel facts; its baseline was re-recorded.
### Known gaps
- No human playtest. The dialogue is imagined, and four absence claims (things the novel never does) are left for a reader who knows the book (see `PLAYTEST.md`).
- The score is generated and has not been heard by anyone but its author. The full game goes to the draft itch.io page `dispatches/dispatches-dracula` (channel `web-full`) as a test build; the demo is built but not pushed.
