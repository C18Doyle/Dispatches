# Dispatches WW2: the six commands

Dispatches WW2 joins Dispatches 1940 (OKW, STAVKA, SHAEF, Comando Supremo) and Dispatches 1941 (IGHQ, CINCPAC) into one game. The code base is 1940's; 1941's content is ported in. This file records how the Allied side was split and what the joint rules are.

## The commands

| Command | Seat | Starts | Theatres | From |
|---|---|---|---|---|
| German | OKW | September 1939 | Europe | 1940 `german` |
| Soviet | STAVKA | October 1939 | Europe | 1940 `soviet` |
| Italian | Comando Supremo | September 1939 | Europe | 1940 `italy` |
| Japanese | IGHQ | 1940 | Pacific | 1941 `japan` |
| British | War Cabinet and Chiefs of Staff | September 1939 | Europe and Asia | 1940 `allied` (British reports) + 1941 `alliedPacific` (British and Commonwealth reports) |
| American | Joint Chiefs of Staff | May 1940 | Europe and Pacific | 1941 `alliedPacific` (American reports) + 1940 `allied` (American reports) |

SHAEF and CINCPAC stop being commands (built in November 2026: `src/parts/16-commands-britain-us.jsx`). Their two files stay in the game as `sourceOnly` campaigns, the home of the reports, and are not offered.

## The rule for sharing out a report

A report goes to the command whose government made the decision in the record. The lists are `BRITISH_REPORTS`, `AMERICAN_FROM_ALLIED` and `BOTH_REPORTS` in part 16; a CINCPAC report on neither British list is American.

- **Conferences.** Arcadia, Casablanca and Tehran are each in both source files under two ids, so each command takes one: Britain plays SHAEF's (europeFirst42, casablanca43, tehran43), the US plays CINCPAC's (arcadia41, unconditionalSurrender43, tehransPromise43). Yalta (yaltaFeb45) is in both files. Writing each conference from its own side's chair is still to do.
- **Commonwealth Pacific goes to Britain:** Curtin's turn, the Kokoda Track, the fall of Rangoon and Burma's reconquest. Singapore and Force Z were already SHAEF's and stay British.
- **Mediterranean after Torch:** Anzio, Rome, the Gothic Line, the Aegean and Turkey to Britain; Sicily and Anvil/Dragoon to the US.
- **North-west Europe:** SHAEF's own decisions (the Transportation Plan, Omaha, Falaise, broad front or narrow thrust, the Bulge, the Elbe, Germany's future) to the US; Market Garden, Arnhem and the Scheldt to Britain.

## British command (as built)

From SHAEF's file: saar39, dyle39, altmarkRaid40, finland40, wilfred40, narvik40, dunkirk40, halifaxCrisis40, battleOfBritain40, compassGreece41, greeceFalls41, crete41, aidRussia41, malaya41, forceZ41, crusader41, europeFirst42, casablanca43, tehran43, atlanticConvoys42, pq17_1942, australiaLifeline42, dieppe42, bomberDirective43, italyOrOverlord43, dodecanese43, aegeanReckoning43, turkishQuestion44, turkishBelligerence44, anzio44, anzioSiege44, romeDividend44, gothicLineEarly44, ljubljanaGap44, gapStalled44, viennaStandoff44, strategicBombing45, marketGarden44, arnhemPerimeter44, scheldt44, yaltaFeb45.

From CINCPAC's file: curtinsTurn42, rangoonRetreatAllied42, kokodaTrailAllied42, burmaReconquest45.

## American command (as built)

From CINCPAC's file: every report except the four British ones above (the fleet at Hawaii, the embargo, Wake, Arcadia, Corregidor, Doolittle, Midway, Watchtower, the Central Pacific, the Philippine Sea, Leyte, Iwo Jima, Okinawa, the bomb decisions, Downfall, the occupation, and the branch where the US stays out of the war).

From SHAEF's file: pacificPressure42, secondFront42, darlanDeal42, resistanceContact44, sicilyHusky43, untestedDoctrine44, overlordPrep44, omahaCrisis44, omahaIsolated44, omahaBreakthroughLate44, omahaToehold44, falaise44, normandy44, eisenhowerIntervenes44, anvilDragoon44, ardennesResponse44, bulgeExploited44, stalinTestsTheFront45, westernCollapse45, berlinDecision45, berlinRace45, germanyOccupation45, yaltaFeb45.

## Order of play in the two-theatre files

- A British or American file runs two **tracks**, one through each source file (`tracks` on the campaign; `compositeNext`). Each track keeps its next unplayed report in the flag `trk_<key>`, so saves, the history and rewind keep it.
- The next report is the one, among the open tracks, whose date starts earliest (`trackMonth`: a season counts as its usual month, a bare year as June); the track just played wins a tie. Within a track the source file's own order holds.
- A track passes the other command's reports **by the record**: the historical order (else the first), and for a roll its likeliest outcome (`recordStep`). Their flags are taken, their meters are not, and no screen is shown, so the later reports read as they were written.
- The American file's war in Europe opens when the Pacific track reaches Arcadia (`opensAt`), so the branch where the United States stays out of the war ends the file there, as it did in 1941. The British file's Asia track begins in 1940 and meets its first British report at Rangoon.
- The file ends when every open track has ended.
- **Rules and endings.** The British command plays by 1940's rules and ends with SHAEF's ending (positionLabel, epilogue, projected end, the European map at the end); the American command plays by 1941's rules (`PACIFIC_RULES` in src/rules.ts) and ends with CINCPAC's ending and the Pacific map.
- **Each report is drawn for its source file** (`campaignView`): its map (the European map for SHAEF's reports, the Pacific map for CINCPAC's), its conditions line, its staff's reading, its events and divergence forks are the source file's, under the command's seal, name and colour. A map draws the trail of earlier reports from its own source file only (`mapHistory`).

## The American effort split (improvement 4)

- Flag `usEffort`, an integer from -2 (the Pacific first) to +2 (Germany first). The record: +1 from Arcadia, held at Casablanca, +1 at Tehran (Overlord fixed), 0 in 1945.
- Set at four reports: Arcadia (December 1941), Casablanca (January 1943), Tehran (November 1943) and a new report in early 1945 (the last allocation, from the record of the Pacific build-up).
- Effect, in `src/logic.ts` beside `strainStage`: a contested choice in a report tagged `europe` gets its success weight moved by `usEffort` steps; a `pacific` report gets the opposite. One step is the same size as one stage of strain, so the split costs exactly what it buys. The stage shown is the stage rolled.
- Shown on every American report under the meters as one line: where the weight of the war lies, and what it costs the other theatre.

## Britain's imperial war (improvement 5)

- Matériel's three readings in the British file are Fuel & Oil, Shipping and Dollars. Dollars falls with cash-and-carry and recovers with Lend-Lease (March 1941); it is read by the decisions that cost dollars (the 1940 orders in America, the convoys, the Indian Army's pay).
- A choice that moves strength from one theatre to another (Compass to Greece, Malaya's battleship, Crusader against the Far East) says which theatre pays.

## The record across both theatres (improvement 6)

- `MAP_MEANWHILE` and the wire bulletins draw on both games' records: a European report can carry a Pacific line and the other way round.
- The theatre map of one theatre lists, in a side note, what the other theatre was doing on that date in the record.

## Meters (improvement 1)

Every command has Manpower, Matériel and Initiative. 1941's Readiness is Manpower, its Pipeline is Matériel. The readings under each meter are per command:

| | Manpower | Matériel | Initiative |
|---|---|---|---|
| 1940 commands | Organisation, Experience, Readiness | Fuel & Oil, Arms & Ammunition, Shipping & Rail | Intelligence, Command, Tempo |
| Japanese | Training, Forces, Morale | Fuel & Oil, Shipping, Industry | Intelligence, Command, Tempo |
| British | as 1940 | Fuel & Oil, Shipping, Dollars | as 1940 |
| American | Training, Forces, Morale | Fuel & Oil, Shipping, Industry | as 1940 |

The internal keys stay `manpower`, `fuel`, `initiative`; 1941's `readiness` and `pipeline` are renamed in the ported content.

## Interface in seven languages (improvement 2)

Every interface text from 1941's screens (its battle screens, map labels, staff's reading panel, glossary panel) goes through `T()` with the seven tables in `src/i18n`. Reports and advisers stay English, as in 1940.

## Open, decided later

- Saves: WW2 has its own keys; old 1940 and 1941 saves are not imported (improvement 3 was not chosen).
- itch.io pages and the demo (improvement 10 not chosen yet).
