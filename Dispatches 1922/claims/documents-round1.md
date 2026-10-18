# Documents, quotations, staff, operations and map data: sources, first pass

Text and data: `DOCUMENTS`, `QUOTES` and `CAST` in `src/parts/37-letters.jsx`; `OPERATIONS`, `CITY_ASSETS`, `MAP_EFFECTS`, `RIVERS` and `RANGES` in `src/parts/36-period.jsx`. They are not reports, so they are not in `claims/<campaign>.json`; this file and `claims/quotations.json` are their register. `npm run check:period` ties them to the code. Status words are those of `claims/README.md`. Nothing here is `independent`.

Method: web search on 2026-10-18; search summaries and a few pages read. The documents are **summaries**, labelled on the screen as reconstructions of the form; no line is a transcript unless it is in quotation marks and in `claims/quotations.json`.

## Documents

| node | document | status | note |
|---|---|---|---|
| aprilCrisis17 | Note of 1 May 1917; declaration of 9 April | drafted | Old Style 18 April and 27 March. The line that the Note lacks "peace without annexations" is the game's own report text. NEEDS A READER. |
| armyCommissars17 | Declaration of the Rights of the Soldier, 11 May 1917 | drafted | Old Style 29 April. Content summarised from memory. NEEDS A READER. |
| kornilovAffair17 | Kerensky's order to Kornilov, 9 September 1917 | web-checked (search-summary) | Wikipedia "Kornilov affair"; msu.edu. Hand over to Lukomsky and come to Petrograd; Kornilov refused the same day. |
| moscowDirective19 | Directive No. 08878, 3 July 1919 | web-checked (search-summary) | RBTH (number), Markovtsy PDF (opening line, Kursk-Orel-Tula). "Own axes" for the Don and Caucasus Armies and "no time given" for the start are from the same summaries. Date differs by a day between sources. |
| wrangelsDismissal20 | Order removing Wrangel, 8 February 1920 | web-checked | `claims/south-russia-round1.md` (fact-check pass). |
| omskCoup18 | Kolchak's proclamation, 18 November 1918 | web-checked (search-summary) | Wikipedia "Kolchak Coup", "Supreme Ruler of Russia". |
| revvoensovietFormed18 | VTsIK decree of 2 September 1918 | web-checked (search-summary) | Wikipedia "Revolutionary Military Council": decree titled as declaring the Soviet Republic a military camp; Trotsky chairman; Vatsetis first commander-in-chief. |
| grainRequisition18 | Decree of 11 January 1919 (prodrazverstka) | drafted | Quotas by province, county and village; fixed prices. NEEDS A READER. |
| polishWar20 | Tukhachevsky's order of 2 July 1920 | web-checked (search-summary) | IPN article; translations of the middle passage differ, so only its sense and its last words are given. |
| kronstadt21 | The Petropavlovsk resolution, 1 March 1921 | web-checked (search-summary) | libcom, anarchist FAQ, after Mett. The meeting of 15,000 to 16,000 and the two opposing Bolsheviks are from the same summaries. |

## Quotations

See `claims/quotations.json`. Two are `drafted` and marked NEEDS A READER in their notes (Kolchak's proclamation: translations differ; Wrangel on the Directive: second-hand).

## Staff (`CAST`)

Each person's role and the flag rules were written from the reports of the game itself (who commands what, where) and from the roles in the notes of `claims/*.json`. The facts stated outside the game's flags are: May-Maevsky replaced in command of the Volunteer Army in late November 1919 (drafted; NEEDS A READER); Wrangel dismissed on 8 February 1920 (web-checked); Miliukov out of the Cabinet after the May crisis (drafted). `check:period` checks that every flag a rule reads is set in the campaign.

## Operations (the map)

Drawn from the dates in the reports and the fact-check pass (`claims/*-round1.md`): the Ice March (February to April 1918); Wrangel on the Volga (May to June 1919); Kolchak's spring offensive (March to May 1919); the Red Eastern Front counteroffensive (Ufa 9 June, Chelyabinsk 24 July 1919); the Moscow Directive (July to October 1919, Orel 13 October); the pursuit into Siberia (Omsk 14 November 1919); the Southern Front counteroffensive (Kharkov 12 December 1919); the advance to Krasnoyarsk; the Great Siberian Ice March (January to February 1920); the Polish-Soviet War (June to August 1920); Perekop (7 to 17 November 1920); the assault on Kronstadt (17 to 18 March 1921). All `drafted` or web-checked in the earlier passes; the arrows join the two cities named and do not show a route.

## Map data

- Projection: equirectangular, standard parallel 53 degrees north, fitted to the city table (Petrograd, Moscow, Sevastopol and Chita to within one unit). Rivers and ranges are waypoints through named towns: approximate, drawn to show where an army met water, and not surveyed.
- Assets (`CITY_ASSETS`): grain, coal, junctions and ports at the cities. The Donbas coalfield; the Kuban, Don, Volga, Siberian and Ukrainian grain lands; the black earth of the centre; the Trans-Siberian junctions. `drafted`. NEEDS A READER for Orel and Voronezh as grain districts and for Ufa and Chita as junctions.
- Map effects (`MAP_EFFECTS`): four decisions of the run that move a place for a month or more (Perekop stalled, the Chelyabinsk counterattack checked, the island at Kronstadt left to the thaw). They are the game's own modelled alternatives, not history.
- Place names: Ekaterinodar became Krasnodar in December 1920; later names (Stalingrad 1925, Leningrad 1924, Stalin 1924 for Yuzovka, Donetsk 1961) are `drafted`.
