# Dispatches 1914 changelog

Player-facing and rules-facing changes only (what a player or a balance check would notice). Newest first.
Add an entry in the same commit as the change. Engine changes live in packages/engine/CHANGELOG.md.
Format: version or date, then Fixed / Changed / Added. A change that moves the UI baseline must also be
listed in tests/baseline/known-diffs.json (see docs/WORKFLOW.md).

## Unreleased (2026-10)
### Added: the Ottoman General Staff (13 decisions, 5 endings)
- The sixth command is now playable: the Ottoman war ministry and general staff, from the German ships at the Dardanelles (August 1914) to the armistice of Mudros (October 1918). Thirteen decisions: the Goeben and the Breslau, the Black Sea raid, the winter offensive at Sarikamis, the attack on the Suez Canal, where the landing comes at Gallipoli (a contested roll), Kut (a contested roll), Erzurum, the railway to Medina, Baghdad or Palestine, Jerusalem, the road to Baku, the line before Megiddo and the terms at Lemnos. Five endings: the armistice (the record), the Straits lost, a smaller war, the last line in the interior, and (hard mode) the dismissal of the minister.
- The meter is Imperial Control. Hard mode tracks commitments beyond what the railways and the stores could carry (Sarikamis, Medina and Baku on the record, and the plans to retake Baghdad and to defend Jerusalem): about one run in six ends in the minister's dismissal. Measured over 20,000 random runs: the armistice 58%, the last line 23%, a smaller war 12%, the Straits lost 7%.
- A second map, of Anatolia, the Levant, Mesopotamia and the Caucasus, drawn from the same public-domain Natural Earth outline; the front map shows each command's own.
- **The Armenian genocide** is narrated as settled fact in the node for 24 April 1915, on the night it began, and again in the closing epilogues: the government, its ruling party and units of the army carried it out, and the command whose file it is bears its share of the responsibility. It is never a choice, a flag or a meter effect, and nothing in the file can alter it (the smoke test checks that no Ottoman choice, label, flag or bulletin is about it). "What this game leaves out" says the same.
- Dates are Western; the Rumi calendar (Julian, with the year from 1 March) is explained, with one Rumi date, in the second node. What the General Staff itself dated its papers in is not confirmed and is recorded as open.
- 109 claims in `claims/otto.json` (76 `web-checked`, the rest mostly the advisers' positions, marked `drafted`), 20 new sources, 6 new glossary entries (52 in all), 24 new baseline recordings, 2 new save fixtures. The validators now pass with the Ottoman research gate closed.

### Added: six more echoes between commands
- What Russia and Austria-Hungary decide now reaches the other commands, and only when the decision departs from the record: Russia's answer at Chantilly reaches the French staff on the Somme; the offensive at Lake Naroch (or the refusal of it) reaches the French staff at Verdun; the promise made to the Allied missions in Petrograd reaches the French staff at the Chemin des Dames; the convention at Pless reaches the German staff before the attack on Serbia; the third invasion of Serbia (or the decision not to make it) reaches the Russian staff at Przemysl; and the divisions sent to Ukraine reach the German staff in February 1918. There are now twelve.

### Content: the Russian Stavka from 15 decisions to 24, the Austro-Hungarian AOK from 13 to 20
- **Nine more Stavka decisions**, dated Old Style with the Western date in brackets: the fortress of Przemysl behind the lines (October 1914), the army turned north at Lodz (November 1914), the warning from the Tenth Army before the winter battle in East Prussia (January 1915), the gap at Sventsiany (August 1915), the plan for every front at Chantilly (November 1915), Verdun's request for an offensive at Lake Naroch (February 1916), the Romanian Front (November 1916), the Allied missions in Petrograd (January 1917) and Riga (August 1917). Lodz is a contested roll with a recorded dispute (a Russian tactical victory or a German strategic one); the others are settled history, narrated.
- **Seven more AOK decisions**: a decisive blow meets another at Rawa (September 1914), the third invasion of Serbia (October 1914), telling the fortress of Przemysl that no more relief is coming (February 1915), the convention at Pless that put the attack on Serbia under Mackensen (September 1915), Montenegro (January 1916), the line at the Piave (November 1917) and grain from Ukraine (February 1918).
- Each reads the earlier choices where it should (Przemysl reads the January decision, Pless the one at Gorlice, Romania the one in August 1916); each ending's epilogue records them; the roster of advisers is unchanged.
- `claims/stavka.json` gains 61 claims (38 `web-checked`) and `claims/aok.json` 44 (26 `web-checked`): those whose passage was read on a web page are `web-checked`, the rest, mostly the advisers' positions (characterizations, not quotations), are `drafted` for the fact-check. Thirteen new sources are in `claims/sources.json`.
- Balance, measured again (20,000 random runs a command): Stavka's endings fall between 3.0% and 25% (were 3.6% to 26%) and hard mode relieves the Supreme Commander in 14.0% of runs (about one in seven, as before; one new erosion-tagged order, the order to hold Riga); AOK's between 8.0% and 46% with hard mode at 23.8% (was 21.9%). The historical lines still reach Brest-Litovsk and the armistice of Villa Giusti in both modes.
- What this game leaves out now names the expulsions of 1915 (about half a million Jews and a quarter of a million Germans deported into the interior by the Russian army's headquarters), which no decision offers.

### Added: easy mode, command rank, glossary and strain
- **Easy mode** (a third switch on the menu, beside Standard and Hard mode). Each order shows what it will do to the three meters (a range, for a contested order), the order the command really gave is marked, and the last order can be taken back, up to forty times, also after a save and resume. It is named for a famous machine of each army on the command's card: Big Bertha (German OHL), Soixante-Quinze (French GQG), Ilya Muromets (Russian Stavka), Mother (British Empire) and Skoda (Austro-Hungarian AOK).
- **A command rank on every ending**, a score out of 100 with its five parts shown: standing at the close (the three meters together, 30), the ending (a tier of 0 to 3 given to every ending, 30), nothing run dry (15), restraint (orders that cost the command standing, 10) and the mode (easy 5, standard 10, hard 15), from Staff Captain to Field Marshal. An easy file cannot rise above General. The tiers are the game's own judgment of how each ending left the army and the state, not a historical claim; `check-rank.js` keeps every ending covered.
- **A glossary**: 46 words and places (corps, salient, blockade, Galicia, Isonzo, Doullens, the Hindenburg Programme and so on). On each screen the first mention of a term in the story text is underlined, and pressing it shows the definition; the War Record has a Glossary tab. People are not in it: they have dossiers. `check-glossary.js` checks every term is used and none is defined twice.
- **"What this game leaves out"** on the menu: the war outside the commands, the people the orders fell on, and the crimes that are not decisions a general could take, among them the killing of Armenians in the Ottoman Empire from 1915 (named with the source: the International Association of Genocide Scholars, 1997).
- **Strain on contested orders.** Below -2, each point a meter is short moves 3 points of the odds from the best outcome of a contested order to its worst (at most 15, and never below 5 on the best), counted on the meter the order is about, and the order says so ("Strain: Manpower is short, so the odds are 6 points worse"). It touches only the contested rolls; settled outcomes are still narrated, never rolled. Monte Carlo (20,000 runs a command): every ending is still reached, with no dead end or softlock.
- Saves now also carry the easy flag, the orders given and the take-back history. All three are optional, so a save from 1.2.0 still resumes (as a standard or hard run with nothing to take back); `SAVE_SCHEMA_VERSION` is unchanged.
- `tests/easy-mode.test.mjs` (the preview, the mark, the take-back, save and resume, the rank panel, a glossary term) and 40 easy-mode runs in the UI baseline (one for each command and seed). The UI baseline was re-recorded: the only differences from before are the rank panel on every ending screen and the strain notice and odds on contested orders (checked by switching strain off: then only the ending screens differ).

## 1.2.0 (2026-10-05)
### New: the British Empire (BEF and War Cabinet), 1914-1918
- A fourth playable command, 21 decisions and 9 endings: where the army lands (Aug 1914), behind the Seine (1 Sep), Ypres, the Dardanelles and the 29th Division, the shell shortage and the Times (May 1915), Loos and where the reserve stands, the evacuation of Gallipoli, the change of Commander-in-Chief (Dec 1915), conscription (Jan 1916), a breakthrough or a bite on the Somme, the tanks (Sep 1916), Calais and the British under Nivelle (Feb 1917), the convoy (Apr 1917), Flanders again (Jul 1917), the line and the men (Jan 1918), the general reserve (Mar 1918), Doullens, Haig's order of 11 April, the Cabinet's anxiety in September 1918 and the armistice terms.
- The seat is the one the design specifies: the field commander (French, then Haig) with the Cabinet's decisions reaching it, and the first node says so. Will axis: Political Capital. Hard mode erodes on defying civil authority.
- Three contested rolls (the reserves at Loos, the first day of the Somme, the first use of the tanks) and nine recorded disputes (including who forced the convoy on the Admiralty and whether Haig's critics or defenders read the manpower figures of 1918 correctly), nine bulletins in the General Headquarters communiqué voice, an eleven-adviser roster with dossiers, and `claims/bef.json` (50 claims, 29 read against a web page).
- The Austro-Hungarian and Ottoman cards remain greyed out; the Ottoman one by the spec's research gate.
### New: the Austro-Hungarian AOK, 1914-1918
- A fifth playable command, 13 decisions and 6 endings: the swing force (Aug 1914), the recall of the Second Army, the offensive into Russian Poland, relieving Przemysl through the Carpathian winter, a German commander at Gorlice, the third front on the Isonzo, the Trentino offensive, the Russian break-through of June 1916, the Supreme War Command, the Emperor's letter to France, German help at Caporetto, two thrusts at the Piave in June 1918, and the order to retreat in October 1918.
- Will axis: Imperial Cohesion. Every acceptance of German direction is tagged for hard mode (surrendered sovereignty), and the historical line carries three of them.
- Two contested rolls (the Galician offensive, the Piave plan), three recorded disputes, five bulletins in the General Staff communiqué voice, an eight-adviser roster, and `claims/aok.json` (30 claims, 14 read against a web page).
- The spec's research gate for this campaign was worked through node by node on web sources and is recorded as closed in the campaign file; a specialist source (Herwig, Rothenberg, Tunstall) is still wanted for the independent fact-check. Only the Ottoman card remains greyed out, by the spec's gate.
### Added: look, sound, access and feedback
- Ending badges are stamped, and look different for the three kinds of ending (a plain frame for settled, a double frame for contested, a dashed frame for speculative), so the difference does not rely on colour.
- A Sound setting (off by default): a typewriter tick on each order and a stamp when a file closes, made with the browser's own audio; nothing is downloaded.
- Each new screen puts focus on its heading, so keyboard and screen-reader users hear the change.
- A Feedback section on the menu and "A note for the author" on every ending: a line recording the path taken, ready to paste into a comment on the game's page. docs/PLAYTEST.md says how to run a playtest and, plainly, that none has been run.
- `art/cover.html` and `art/cover.png`: the cover for the itch.io page (630 by 500), in the game's own palette.
### Added: the front map
- Every decision has a map under "Show the map": the stretch of Europe where the file has been, with the route of the headquarters so far and the current place ringed. Only places already visited are shown. The outline is Natural Earth land data (public domain); every node's city has a coordinate (`check-maps.js`).
- A stray double arrow on the "Show background" control is gone.
### Added: echoes between commands
- Six choices leave a mark that another command reads: submarine warfare (German) reaches the British convoy debate, the 1918 manpower question and the French army in 1917; Allied command in 1918 (French or British) reaches the German staff in May and August; the French counterattack on the Marne reaches the German staff in September 1914; the British under Nivelle reaches the French staff; the German plan for 1915 reaches the Austro-Hungarian staff; German help for Vienna reaches the Austro-Hungarian staff in 1917.
- Each echo is written only for the departure from the record, so a player who follows history never sees one (a smoke test checks every node under every historical echo value). Marks are kept in the war record and become the starting flags of the next run; the War Record has a new Echoes tab.
### Added: attested quotations
- Nine choices carry a short line of attested wording, shown as "On the record" with its source (Haig's order of 11 April 1918, Ludendorff on the black day, Foch at Doullens, Clemenceau, Kitchener's telegram, Dukhonin's reply, Karl's letter to Sixtus, Wilson's telegram and Haig's reply). Advisers still speak in indirect speech. `check-quotations.js` requires a source and a logged claim for each; the quotations are in the fact-check worksheet.
### Content: the writing pass
- Every choice outcome on the three commands is now 60 to 85 words (110 were under 60): the consequence is followed through to what the command has to live with next, in the same register. Counterfactual outcomes still begin "Speculative." and add only consequences that follow from the change.
- Every ending's epilogue now ends with a paragraph headed "What actually happened" (the real sequel: dates, signatories, what the armistice or treaty required), 100 to 200 words in all. The 27 paragraphs are logged as claims, marked drafted, for the fact-check.
- `check-prose-length.js` (in `validate.sh`) keeps outcomes at 55 to 100 words and epilogues at 100 or more.

## 1.1.0 (2026-10-04)
### Content: the German Supreme Command, 1914-1918, from 11 decisions to 23
- Twelve new decisions, each tied to a dated, sourced event: the two corps sent to East Prussia (25 Aug 1914), Ypres and the Channel ports (Nov 1914), Gorlice or a wide envelopment (Apr 1915), the Serbian campaign (Sep 1915), the Somme "no ground to give" order (Jul 1916), the Hindenburg Programme (Aug 1916), the retirement to the Siegfried Line and what to leave behind (Feb 1917), help for Vienna at Caporetto (Sep 1917), the Bad Homburg council and the Russian declaration (Feb 1918), the Aisne offensive past the Vesle (May 1918), the Black Day and the Spa council (Aug 1918) and the reply to Wilson's third note (Oct 1918).
- Earlier choices now shape later scenes: the two corps and the Marne, the Russian declaration and the Brest-Litovsk settlement, the Aisne salient and July.
- A new adviser dossier (Kuhl, Chief of Staff of Army Group Rupprecht) and two more OHL bulletins (ten now).
- The armistice epilogue records every one of the new decisions.
- `claims/`: a register of the checkable claims in the campaign's text (71 claims on 23 nodes), each with a kind, sources and a check status, `check-claims.js` (new nodes must arrive with claims logged; the list of unlogged nodes can only shrink) and `claims-worksheet.js`, which writes a reviewer worksheet for the independent fact-check. Only 13 claims have been read against a source so far (web pages); the rest are marked as drafted.
### Content: the French Grand Quartier Général, 1914-1918, from 11 decisions to 24
- Thirteen new decisions: the order to go back (25 Aug 1914), the generals who failed (3 Sep), the race to the sea (Sep), divisions for Salonika (Oct 1915), the Chantilly conference (Dec 1915), retaking Douaumont (Oct 1916), the Calais conference and the British under Nivelle (Feb 1917), Pétain's directive on limited objectives (May 1917), which way to fall back in March 1918, the Chemin des Dames in May 1918, an American army or American divisions (Sep 1918), the concentric offensives (Sep 1918) and the terms asked at Senlis (Oct 1918).
- The final-stretch route is longer: a strike at Villers-Cotterêts now leads through the American question, the autumn offensives and Senlis before the armistice; the "hold the reserve" path is unchanged.
- One more bulletin (ten now); the armistice epilogue records all thirteen new decisions.
- `claims/gqg.json`: 65 claims on the 24 decision nodes (33 read against a web page, the rest drafted). Logging them turned up one thing to check: the Marne node's dateline says Paris, and Joffre was at Châtillon-sur-Seine on 5 September 1914.
### Content: the Russian Stavka, 1914-1917, from 8 decisions to 15
- Seven new decisions, dated Old Style with the Western date in parentheses: the Second Army marching away from its supply (8 Aug 1914), Przemysl and the Carpathians (9 Mar 1915), the road to Kovel (10 Jul 1916), a new ally in Romania (14 Aug 1916), the death penalty at the front (12 Jul 1917), the dismissal of Kornilov (27 Aug 1917) and the order to open armistice talks (9 Nov 1917).
- The Kornilov decision carries a recorded dispute (what Kornilov meant to do). The campaign's October node now reads the Kornilov flag, and the Brest-Litovsk epilogue records all seven new decisions.
- `claims/stavka.json`: 40 claims on the 15 decision nodes (19 read against a web page, the rest drafted). Logging them turned up one thing to check: the existing October node gives Dukhonin a position that he is on record as stating on 9 November.
### Fixed
- The Russian historical line, played with the real engine and the historical outcome of every roll, did not end at "Signed at Brest-Litovsk" in 1.0.0: it ended at "Nothing Left to Sign With", a speculative ending, because manpower sat exactly on the cut-off. It now ends at Brest-Litovsk in both modes. `check-historical-ending.js` (new, in `validate.sh`) plays the historical line in standard and hard mode and requires the settled ending, so this cannot come back unnoticed; the German and French lines were already correct.
### Changed
- Stavka balance after the added decisions: the eight standard endings fall between 3.7% and 28% of random runs (every one reached) and hard mode still relieves the Supreme Commander in about one run in seven at the same cap.
- GQG balance after the added decisions: hard mode relieves the Commander-in-Chief at 6 erosion rather than 5 (the historical line carries five of the 11 erosion-tagged choices); the eight standard endings each fall between 2% and 23% of random runs.
- Re-recorded `tests/saves/gqg-hard.json` for the same reason as the OHL one below: an unreleased fixture whose only difference was the erosion track length.
- OHL balance after the added decisions, measured with `montecarlo.js` and `measure-erosion.js`: the Brest-Litovsk full settlement now releases divisions (manpower +2) and the orderly retreat after the Black Day keeps more of the army (manpower +2), and hard mode relieves the Chief at 7 erosion rather than 5 (the historical line carries five of the thirteen erosion-tagged choices, so it is not relieved). Under random play the eight standard endings fall between 3% and 26% of runs and every one is reached (the hard-mode ending in about one run in six); historical play still ends at "The Request".
- The restricted-submarine branch at Pless no longer jumps to the armistice; it continues through the same chain as the others.
- Re-recorded the committed `tests/saves/ohl-hard.json`: it had been recorded from an unreleased build and the only difference was the erosion track's denominator after the retune above. No shipped save was changed.
### Added
- Saved files: the run in progress is saved after every step and offered as "File in progress" on the menu, including a pending outcome screen. Starting a new file replaces it.
- A Standard / Hard mode switch on the menu. Hard mode adds the erosion track already in the rules; each command's card says what pressure it represents, and at the limit a fixed ending follows.
- The War Record is real: dossiers (opened by meeting each adviser in play), an atlas of decisions reached and an endings gallery, kept in the browser across runs.
- The historical record on every outcome screen: whether the order was the one the command gave (or what the historical command chose instead), and, where a roll stands for a real disagreement between historians, the dispute as written.
- Text size setting (Standard, Larger, Largest).
- Accessibility: a main landmark and heading structure on every screen, focus outlines, button states announced.
- `check-anachronisms.js`: titles, ranks, state names and terms checked against each node's date (a Marshal's baton before it was conferred, "Soviet" before 1917, a state before it existed). Part of `npm run validate`, which is now in `npm test`.
- Tests: six saved-file fixtures and a migration helper test (docs/SAVES.md), 24 recorded hard-mode playthroughs (four of them end on screens whose line-break fix, from 1.0.1, is listed in tests/baseline/known-diffs.json), and render checks for all of the above.

## 1.0.1 (2026-10-04)
### Fixed
- Seven ending screens of the German OHL campaign (the home front collapsing first, the front giving way, fighting on into 1919, an early negotiation, worse terms, an army that still exists, the east held and the west lost) showed the characters "\\n\\n" in the middle of their text instead of a paragraph break. The text is now broken into paragraphs as written.
### Added
- `check-text-integrity.js`, part of the validator suite: finds literal escape sequences, "undefined" or "NaN" interpolated into prose, doubled spaces and unclosed quotes in every string of every node. Run against 1.0.0 it reports exactly the seven endings above.

## 1.0.0 (2026-10-03): first public release
### Playable
- Three commands, each a branching graph of dated decisions with advisor positions, dossiers and bulletins: the German Oberste Heeresleitung (20 decisions), the French Grand Quartier Général (20) and the Russian Stavka (17), with 9 endings each (one per command is the hard-mode ending, see Known).
- BEF, AOK and the Ottoman command appear greyed out as "No content yet".
- Built for phones first: a column at most 600px wide, no sideways scrolling.
### Known
- The game keeps no saved state: closing the page ends the run.
- Hard mode exists in the rules (an erosion track with a forced ending per command) and is tested, but the menu has no switch for it yet.
- The historical claims have been checked by their author only; an independent fact-check is planned (see the game's CLAUDE.md).
### Changed
- The game is titled Dispatches 1914 on the title screen (File No. 1914) and in the page title; it used to say 1918.
### Quality
- All 54 decisions and endings are reachable (`npm run check:orphans`); 24 seeded playthroughs replay identically (`npm run verify:baseline`); the build loads cleanly in Chromium and WebKit on a phone and a desktop viewport.
- Fixed before release: the WAR RECORD card on the menu was wider than a phone screen (20px of sideways scrolling).
