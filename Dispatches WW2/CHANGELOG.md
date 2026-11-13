# Dispatches WW2 changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. The histories of the two games this one joins are in
`../Dispatches 1940/CHANGELOG.md` and `../Dispatches 1941/CHANGELOG.md`.

## 0.1.0 (unreleased)

### Added
- **A war in progress for every command, and three named slots.** Each command keeps its own war in progress, so a British war and a Japanese war can be under way at once and starting one never touches another; all are offered on the opening screen, newest first. The in-run menu saves the file to one of three slots under a name of the player's choosing (at a briefing, before the order is given); a slot is resumed from the opening screen and deleted only on a second press. A save from before this moves into its command's place by itself.
- **Autosave after every decision** (it was every third).
- **An in-run menu** (the ⚙ button, Escape, or Start on a controller): back to the file, the war journal, save and return to the opening screen, the three slots, every setting, and the keys and controller buttons. Instant text, text size, reduced motion, music and its volume are now kept between visits; text size has an Extra large step for a handheld; Full screen where the browser or the desktop build allows it.
- **Keyboard controls.** 1 to 9 give the order (or choose the allocation, or the menu item) with that number; Enter continues; R opens Reconsider an Earlier Decision; J opens the war journal; Escape closes what is open or opens the menu.
- **Controller support** (Steam Deck and other pads): the D-pad or left stick moves between the buttons, A presses, B goes back, Start opens the menu and View the war journal. With a controller in hand the focus is drawn large and every control is at least 44 pixels tall.
- **The war journal** (the ☰ button or J): the orders given so far in this file, newest first, with what the record did, the odds of any roll, the adviser, and the American allocations.
- **Records by command** in the War Record: files closed, best rank and endings reached for each of the six commands, and the five reports where you most often depart from the record. Wars closed before this count in the totals but not by command.
- **Crash reports.** When the file is damaged, the screen offers to copy or save a short report of what went wrong (the command, the report, the screen, the error, the browser and the language) to send to the developer. Keeping a copy on the machine is a setting, off by default; nothing is sent by itself.
- **The American allocation of effort.** Once a year from 1942, after Arcadia, the Joint Chiefs share the year's men, ships and aircraft between Germany and Japan: Germany first, an even hand, or the Pacific first. The share moves the odds of the year's contested orders in both theatres, six points for each step away from what the record did (an even hand in 1942 and 1943, Germany first in 1944 and 1945), better in the theatre that gets more and worse in the other; choosing as the record did leaves every roll as written. Battles keep their own arithmetic and the meters do not move. Each order shows what the allocation does to its odds, and the end of the file lists the four years against the record.
- **A British command and an American command in place of SHAEF and CINCPAC.** The War Cabinet and Chiefs of Staff play Britain's war from the promise to Poland in September 1939 through Norway, Dunkirk, the Battle of Britain, Greece, Crete, Singapore, the Atlantic, the Mediterranean, Arnhem and the Scheldt, with Rangoon, Curtin's turn, Kokoda and Burma at their dates. The Joint Chiefs play America's war on two oceans: the Pacific from the fleet at Hawaii to the occupation of Japan, and Torch, Sicily, Omaha, the Bulge and the Elbe at their dates among it. Where a file reaches a decision the other ally made, the record's own order is taken. The British command plays by 1940's rules and ends with SHAEF's ending; the American command by 1941's, with CINCPAC's.
- **One game, six commands.** Dispatches 1940 (OKW, STAVKA, SHAEF, Comando Supremo) and Dispatches 1941 (IGHQ, CINCPAC) are one game: the six commands are on one opening screen, share one war record, one set of settings, the seven languages of the interface and their own saves (new storage keys, so a 1940 or 1941 save is never read or overwritten).
- **The same three meters everywhere.** The Pacific commands' Readiness and Pipeline are now Manpower and Matériel, as in Europe; Initiative is unchanged. Each command keeps its own readings under them (IGHQ and CINCPAC: Training, Forces and Morale; Fuel & Oil, Shipping and Industry).
- **The Pacific commands play as they did.** Each command plays by its own game's rules (src/rules.ts): the Pacific commands keep 1941's rolls, strain, arrears, trust, hard modes (Fanatical Resolve for IGHQ, Coalition Resolve for CINCPAC) and their nine battles; the European commands are 1940's.
- **The Pacific map in the European map's tones.** The map under each Pacific report and the theatre map at the end of the war are 1941's, drawn in the European staff map's colours: the same sea, land, status colours at half strength, hatch for contested ground and serif place names. Night reading darkens both alike.
- **The Pacific commands' events.** 1941's fourteen state-driven events appear between reports on the special-dispatch screen.
- **War-room letterheads** for IGHQ and CINCPAC, with Yamamoto's and Roosevelt's words.

### Fixed
- The war in progress card no longer shows "{p2}" after its text when the save holds no battle.
