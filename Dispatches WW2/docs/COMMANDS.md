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

SHAEF and CINCPAC stop being commands. Their reports are shared out by whose decision the report puts to the player.

## The rule for sharing out a report

A report goes to the command whose people made the decision in the record. Where two governments decided together (the conferences), the report appears in both files, written from each side's chair, and the two versions set different flags.

- **Joint conferences in both files:** Arcadia (Dec 1941), Casablanca (Jan 1943), Tehran (Nov 1943), Yalta (Feb 1945).
- **Commonwealth Pacific goes to Britain:** Curtin's turn, the Kokoda Track, Rangoon, Burma's reconquest, Singapore and Force Z.
- **Mediterranean after Torch:** Sicily, Salerno and Anzio to Britain (Alexander's 15th Army Group and Churchill's push); Anvil/Dragoon to the US (Eisenhower and Marshall against Churchill).
- **North-west Europe:** SHAEF's own decisions (the Transportation Plan, broad front or narrow thrust, the Bulge, the Elbe) to the US; Market Garden, Arnhem and the Scheldt to Britain.

## British command (draft allocation)

1939 to 1941 from 1940 `allied`: saar39, dyle39, altmarkRaid40, finland40, wilfred40, narvik40, dunkirk40, halifaxCrisis40, battleOfBritain40, compassGreece41, greeceFalls41, crete41, aidRussia41, crusader41, malaya41, forceZ41.

1942 to 1945 from 1940 `allied`: atlanticConvoys42, pq17_1942, australiaLifeline42, dieppe42, bomberDirective43, italyOrOverlord43, dodecanese43, aegeanReckoning43, turkishQuestion44, turkishBelligerence44, anzio44, anzioSiege44, romeDividend44, gothicLineEarly44, ljubljanaGap44, gapStalled44, viennaStandoff44, marketGarden44, arnhemPerimeter44, scheldt44, strategicBombing45.

From 1941 `alliedPacific`: curtinsTurn42, rangoonRetreatAllied42, carrierRequest42 (Churchill asks; in the British file it is the asking), kokodaTrailAllied42, britainsCalculus43, burmaReconquest45.

Shared (British version): arcadia41, casablanca43, tehran43, yaltaFeb45.

## American command (draft allocation)

1940 to 1941 from 1941 `alliedPacific`: fleetAtHawaii40, richardsonObjection40, atlanticTransfer41, americanEmbargoResponse41, chinaAirForce41, wakeIslandRelief41 and the no-war branch (aStandoffInsteadOfAWar41 and its reports).

The Pacific from 1942: every other `alliedPacific` report (Corregidor, Doolittle, Midway, Watchtower, the Central Pacific drive, the Philippine Sea, Leyte, Iwo Jima, Okinawa, the bomb decisions, Downfall, the occupation).

Europe from 1940 `allied`: europeFirst42, pacificPressure42, secondFront42, darlanDeal42, sicilyHusky43, untestedDoctrine44, overlordPrep44, omahaCrisis44 and its four follow-ons, normandy44, falaise44, eisenhowerIntervenes44, anvilDragoon44, resistanceContact44, ardennesResponse44, bulgeExploited44, stalinTestsTheFront45, westernCollapse45, berlinDecision45, berlinRace45, germanyOccupation45.

Shared (American version): arcadia41, casablanca43, tehran43, yaltaFeb45.

## Order of play in the two-theatre files

A file is one line of reports in date order. Where a command fights in two theatres, the reports of both run in one chain sorted by their dates; a hinge report hands the file from one theatre to the other. The map under the report follows the report's theatre (`theatre: "europe" | "pacific"` on each report).

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
