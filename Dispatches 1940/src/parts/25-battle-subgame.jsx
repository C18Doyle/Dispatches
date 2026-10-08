const BATTLE_ALLOCATION_CATEGORIES = [
  { id: "divisions", name: "Divisions", meter: "manpower" },
  { id: "armour", name: "Mechanised Armour", meter: "fuel", strand: "steel" },
  { id: "air", name: "Air Support", meter: "fuel", strand: "oil" },
  { id: "supply", name: "Supply", meter: "fuel", strand: "ship" },
];

// Round 4 (Craig, mobile playtest: "could we have a commander selection option which had a
// modifier on one of the four categories"). Keyed per battle id (matches
// keyBattleSubgame.id) since a roster is only honest for the specific army group/front that
// battle actually involved — no generic "pick a general" list. Each entry's `category` tie is
// to the officer's REAL documented command, not an invented personal doctrine, since only one
// of the four (Hoth) has a well-sourced individual reputation as an armor specialist; the other
// three are represented by what they verifiably commanded, which is a defensible way to give
// them a category without overclaiming a personality trait no source actually states. All
// ranks/roles/dates checked via Wikipedia and (for the Deßloch handover date, which Wikipedia's
// own infobox and body text disagree on) a cross-check against a specialist Luftwaffe-history
// source, 2026-09-19:
//  - Hoth: Generaloberst, 4th Panzer Army — the offensive's main armored spearhead (~700 tanks
//    committed). Well-documented as a Panzer specialist going back to 1940-41.
//  - Kempf: General der Panzertruppe, Army Detachment Kempf — its own order of battle was two
//    full infantry corps (XI, XLII — six infantry divisions) alongside III Panzer Corps, so
//    "Divisions" reflects the actual weight of what he commanded, not a claimed specialty.
//  - Deßloch: Generaloberst, commander-in-chief of Luftflotte 4 — confirmed (Dupuy Institute
//    Luftwaffe-history research citing Bundesarchiv-sourced correspondence) as having taken
//    over from Wolfram von Richthofen on 11 June 1943, weeks before Kursk opened, correcting an
//    initial assumption during research that Richthofen was still in command in July.
//  - Busse: Chief of Staff, Army Group South, under Manstein from 1943 — his rank at that exact
//    moment isn't pinned down by the sources checked (Oberst is confirmed for 1942,
//    Generalleutnant only confirmed by January 1944), so he's identified by role rather than a
//    guessed rank. A chief of staff is the officer who actually turns an army group's plan into
//    its logistics and troop-movement machinery, which is the honest tie to Supply here.
const KEY_BATTLE_COMMANDERS = {
  kursk: [
    {
      id: "hoth",
      name: "Generaloberst Hermann Hoth",
      role: "Commanding, 4th Panzer Army",
      category: "armour",
      note: "The offensive's main armored fist — roughly 700 tanks under his direct command. Effort put into Mechanised Armour carries further with him running that push.",
      // Round 9 report lines (Craig's item #4 — commander/approach voice in the battle report).
      // Each verified 2026-09-21: Hoth "had discussed [turning toward Prokhorovka] with
      // Manstein since early May, as he expected large Soviet armoured reserve forces to arrive
      // from the east" (Wikipedia, Battle of Prokhorovka) — so an early-May strike under Hoth
      // carrying that same intent is consistent, not anachronistic.
      reportLine: "Hoth angles the SS panzer corps toward Prokhorovka, braced for the Soviet armour he expects from the east.",
    },
    {
      id: "kempf",
      name: "General der Panzertruppe Werner Kempf",
      role: "Commanding, Army Detachment Kempf",
      category: "divisions",
      note: "His own command is built around two full infantry corps flanking its one panzer corps. Effort put into Divisions carries further under him.",
      // Verified: Army Detachment Kempf's III Panzer Corps crossed the Northern Donets "to
      // protect the 4th Panzer Army's eastern flank" (Wikipedia, Operation Citadel).
      reportLine: "Kempf's corps fights its way across the Donets to cover Hoth's right flank.",
    },
    // Round 10 correction: this was Deßloch, which is wrong for THIS battle — the early strike
    // is May 1943, and Luftflotte 4 was still Richthofen's then (Wikipedia, Luftflotte 4:
    // "Generalfeldmarschall Wolfram von Richthofen, 20 July 1942 – 4 September 1943"; the Dupuy
    // Institute's correspondence-based date for Deßloch taking over is 11 June 1943 — either
    // way, after May). The round-4 note below about Deßloch is kept for the record but no
    // longer describes a roster entry.
    {
      id: "richthofen",
      name: "Generalfeldmarschall Wolfram von Richthofen",
      role: "Commander-in-Chief, Luftflotte 4",
      category: "air",
      note: "Commands the air fleet flying direct support for this front. Effort put into Air Support carries further under him.",
      // Verified: "The Hs 129 formations from SG 1 inflicted grievous losses on Soviet tanks"
      // with 30 mm anti-tank cannon, flying in support of the southern attack (Wikipedia,
      // Battle of Prokhorovka).
      reportLine: "Hs 129 tank-busters of Luftflotte 4 catch Soviet armour moving up in the open.",
    },
  ],
  // Round 9 (Craig picked D-Day as the second battle — built as Omaha, Allied side; see the
  // omahaCrisis44 node for why). Three commanders, one per category the morning actually turned
  // on; Air left without a named tie, same asymmetric-by-design pattern as Kursk's Supply.
  // Verified 2026-09-21 (Wikipedia, Omaha Beach; William M. Hoge): Hall commanded naval Task
  // Force O; at 09:50 the destroyers "were ordered to get as close in as possible. Some
  // approached within 900 meters (1,000 yd) several times, scraping bottom." Cota, 29th Division
  // assistant commander, "led the charge off of Dog White, between WN-68 and WN-70, by forcing
  // gaps in the wire with a Bangalore torpedo." Hoge "commanded the Provisional Engineer Special
  // Brigade Group attached directly to V Corps in the assault on Omaha Beach" (a brigadier
  // general from 1942 until his May 1945 promotion to major general). The node's own premise is
  // that the historical rally doesn't arrive on its own — putting Cota or Hall forward is the
  // player's attempt to force it, which is why their notes are phrased as an order, not a given.
  omaha: [
    {
      id: "hall",
      name: "Rear Admiral John L. Hall Jr.",
      role: "Commanding, Naval Task Force O",
      category: "naval",
      note: "The ships off this beach are his. Order his destroyers in close and they can fire straight into the strongpoints, shallows or not. Effort put into Naval Gunfire carries further under him.",
      reportLine: "Hall's destroyers come in to a thousand yards, scraping bottom, firing into the bluffs.",
    },
    {
      id: "cota",
      name: "Brigadier General Norman Cota",
      role: "Assistant Commander, 29th Infantry Division",
      category: "waves",
      note: "Already ashore with the men pinned at the shingle. Put him forward and he can get them moving. Effort put into Follow-on Waves carries further with him on the beach.",
      reportLine: "Cota gets men off the shingle and through a gap blown in the wire, up the bluff.",
    },
    {
      id: "hoge",
      name: "Brigadier General William M. Hoge",
      role: "Commanding, Provisional Engineer Special Brigade Group",
      category: "engineers",
      note: "His brigade group exists to open this beach's exits and keep them open. Effort put into Engineers & Tanks carries further under him.",
      reportLine: "Hoge's engineers go to work on the exits as each draw falls.",
    },
  ],
  // Round 15 (battle #3, Stalingrad breakout). Three officers, each with a documented, sourced
  // tie to the category they're listed under — verified 2026-09-24 (Wikipedia: Hans-Valentin
  // Hube, Walther von Seydlitz-Kurzbach, Martin Fiebig). Supply left without a named commander
  // tie, same asymmetric-by-design pattern as Kursk's Supply and Omaha's Air.
  stalingrad: [
    {
      id: "hube",
      name: "Generalleutnant Hans-Valentin Hube",
      role: "Commanding, XIV Panzer Corps",
      category: "armour",
      note: "His corps is what panzer strength survived Uranus inside the pocket. Effort put into Mechanised Armour carries further under him.",
      // Verified: Hube personally "argued strongly, but to no avail, for Hitler to allow the 6th
      // Army to attempt a breakout" (Wikipedia, Hans-Valentin Hube) — he wants this order, not
      // just executes it.
      reportLine: "Hube pushes what's left of his panzer corps forward to screen the column's advance.",
    },
    {
      id: "seydlitz",
      name: "General der Artillerie Walther von Seydlitz-Kurzbach",
      role: "Commanding, LI Army Corps",
      category: "divisions",
      note: "His corps is three infantry divisions, and he's one of the army's own generals already arguing for exactly this order. Effort put into Divisions carries further under him.",
      // Verified: Seydlitz was "one of the generals who argued most forcefully in favour of a
      // breakout or a surrender, against Hitler's orders" (Wikipedia, Walther von
      // Seydlitz-Kurzbach) — his actual advocacy on record is documented from January 1943, after
      // this node's moment; his corps command and rank are contemporaneous and accurately stated.
      reportLine: "Seydlitz gets his three divisions moving on schedule, no argument needed this time.",
    },
    {
      id: "fiebig",
      name: "Generalleutnant Martin Fiebig",
      role: "Commanding, VIII Fliegerkorps",
      category: "air",
      note: "His air corps has been flying support over this front for months. Effort put into Air Support carries further under him.",
      // Verified: Fiebig told Paulus directly that an airlift "was not feasible," then appealed to
      // Richthofen, who agreed and "urged senior commanders to authorize a breakout rather than an
      // airlift" (Wikipedia, Martin Fiebig) — the airlift order hasn't been given yet at this
      // node's moment, but Fiebig's own math already points the same direction this choice does.
      reportLine: "Fiebig has VIII Fliegerkorps flying cover over the column before the order is even confirmed.",
    },
  ],
  // Round 15, battle #4 (Alam Halfa). Three officers, each with a documented, sourced tie to the
  // category they're listed under — verified 2026-09-25 (Wikipedia: Battle of Alam el Halfa,
  // Fliegerführer Afrika). Supply left without a named commander tie, same asymmetric-by-design
  // pattern as the other three battles above.
  elAlamein: [
    {
      id: "vaerst",
      name: "General Gustav von Vaerst",
      role: "Commanding, Afrika Korps",
      category: "armour",
      // Verified: von Vaerst took over the Afrika Korps after Nehring was wounded in an air raid
      // on 31 August 1942, mid-battle (Wikipedia, Battle of Alam el Halfa).
      note: "Takes over the Korps from a wounded Nehring in the middle of this fight. Effort put into Mechanised Armour carries further under him.",
      reportLine: "Von Vaerst pushes the panzer spearhead forward himself, Korps command or not.",
    },
    {
      id: "navarini",
      name: "Generale Enea Navarini",
      role: "Commanding, XXI Corpo d'Armata",
      category: "divisions",
      // Verified: Navarini commanded the Italian XXI Corps at Alam el Halfa (Wikipedia, Battle of
      // Alam el Halfa order of battle).
      note: "His corps is the Italian infantry mass that has to keep pace with a night march built around the panzers' own schedule. Effort put into Divisions carries further under him.",
      reportLine: "Navarini gets his corps moving on the night schedule, no argument needed this time.",
    },
    {
      id: "seidemann",
      name: "General der Flieger Hans Seidemann",
      role: "Commanding, Fliegerführer Afrika",
      category: "air",
      // Verified: Seidemann took command of Fliegerführer Afrika on 30 August 1942 — the day this
      // attack opened — succeeding Hoffmann von Waldau (Wikipedia, Fliegerführer Afrika).
      note: "Takes command of the air corps the same morning this attack goes in. Effort put into Air Support carries further under him.",
      reportLine: "Seidemann has what's flyable over the column before the first report comes in.",
    },
  ],
  // Round 15, battle #5 (Monte Marrone). One commander, not three — a deliberate departure from
  // the other battles' rosters, not an oversight: no individually-named commander for the Nembo
  // paratroop element, the attached Anglo-Polish artillery, or the mule-supply effort turned up
  // in verification, and inventing one would cross the line this project has held everywhere
  // else between "asymmetric by design" (Kursk's Supply, Omaha's Air) and simply making a name
  // up. Verified 2026-09-25 (Wikipedia, Italian Co-belligerent Army): General Vincenzo Dapino
  // commanded the 1st Motorized Group — the Corpo Italiano di Liberazione's own predecessor
  // formation, not yet reorganized under that name or under Utili's command until 18 April 1944,
  // after most of the fighting this subgame models.
  monteCassino44: [
    {
      id: "dapino",
      name: "General Vincenzo Dapino",
      role: "Commanding, 1st Motorized Group",
      category: "assault",
      note: "His group is the Piemonte and Bersaglieri battalions making the climb. Effort put into Alpine & Bersaglieri Assault carries further under him.",
      reportLine: "Dapino pushes the assault line up the last stretch of trail himself.",
    },
  ],
  // Round 15, battle #6 (Minsk). Two commanders, not three — Rokossovsky already speaks as this
  // choice's own advisor, so he isn't repeated here as a commander pick; no individually-named
  // air-army commander specific to Bagration turned up in verification (Novikov commanded the
  // whole VVS from 1942 on, but nothing found ties him personally to this operation rather than
  // Kursk or Königsberg), so Air is left uncommanded rather than attributed on an inference.
  // Verified 2026-09-25 (Wikipedia: Operation Bagration).
  bagrationSoviet44: [
    {
      id: "chernyakhovsky",
      name: "General Ivan Chernyakhovsky",
      role: "Commanding, 3rd Belorussian Front",
      category: "divisions",
      note: "His front's rifle armies are doing much of the work sealing the ring shut. Effort put into Divisions carries further under him.",
      reportLine: "Chernyakhovsky pushes his rifle armies forward to seal another stretch of the ring.",
    },
    {
      id: "rotmistrov",
      name: "General Pavel Rotmistrov",
      role: "Commanding, 5th Guards Tank Army",
      category: "armour",
      note: "His tank army is the offensive's own exploitation force, committed straight through the gap the breakthrough opened. Effort put into Mechanised Armour carries further under him.",
      reportLine: "Rotmistrov drives his tank army forward through the gap without waiting for orders to confirm it.",
    },
  ],
  // Round 15, battle #7 (Anzio). Three commanders, Naval Gunfire & Buildup left uncommanded —
  // no individually-named commander for the ships and the beach logistics effort as a whole
  // turned up in verification (the naval task force answered to Rear Admiral Frank Lowry, but
  // nothing found ties him personally to the corps-level push-inland-or-consolidate decision this
  // subgame models, unlike Hall's documented close-support decision at Omaha), so it's left
  // asymmetric the same way Omaha's Air and Bagration's Air already are. Verified 2026-09-25
  // (Wikipedia, Battle of Anzio): Truscott commanded 3rd Infantry Division and later argued the
  // inland thrust toward Valmontone "would have accomplished in full" the operation's aims;
  // Penney commanded the British 1st Infantry Division; Darby's 6615th Ranger Force took the
  // port of Anzio itself on the landing's first day.
  anzio44: [
    {
      id: "truscott",
      name: "Major General Lucian K. Truscott Jr.",
      role: "Commanding, 3rd Infantry Division",
      category: "armor",
      note: "His division leads the push toward the Alban Hills, armor included — the same thrust he will later argue should never have stopped short of Valmontone. Effort put into Armored Exploitation carries further under him.",
      reportLine: "Truscott pushes his division's own column forward without waiting on the corps to confirm it.",
    },
    {
      id: "penney",
      name: "Major General Ronald Penney",
      role: "Commanding, British 1st Infantry Division",
      category: "assault",
      note: "His division holds the other half of the beachhead's own infantry line. Effort put into Infantry Beachhead carries further under him.",
      reportLine: "Penney gets his division's line squared away and pushing its own perimeter forward.",
    },
    {
      id: "darby",
      name: "Colonel William O. Darby",
      role: "Commanding, 6615th Ranger Force",
      category: "rangers",
      note: "His Rangers took the port itself this morning without firing a shot. Effort put into Ranger & Commando Vanguard carries further under him.",
      reportLine: "Darby pushes his Rangers out ahead of the main line on his own authority.",
    },
  ],
  // Round 15, battle #8 (Arnhem). Three commanders. Urquhart's own quote is the OTHER choice's
  // advisor at this same node ("Organize the night evacuation"), not this one — Horrocks speaks
  // for the choice this subgame is attached to — so using Urquhart as a commander pick here
  // follows the same rule Bagration's roster established (a choice's own advisor isn't repeated
  // as a commander pick; anyone else is fair game). Verified 2026-09-25 (Wikipedia, Battle of
  // Arnhem; 1st Independent Parachute Brigade): Horrocks commanded XXX Corps; Urquhart commanded
  // 1st Airborne Division, holding the Oosterbeek perimeter; Sosabowski commanded the 1st
  // Independent Parachute Brigade (Poland) at Driel.
  arnhemPerimeter44: [
    {
      id: "horrocks",
      name: "Lieutenant General Brian Horrocks",
      role: "Commanding, XXX Corps",
      category: "corpsPush",
      note: "His corps is the column stalled on the one road north of Nijmegen. Effort put into XXX Corps Armored Push carries further under him.",
      reportLine: "Horrocks pushes the column forward on his own authority rather than wait for the road to clear itself.",
    },
    {
      id: "urquhart",
      name: "Major General Roy Urquhart",
      role: "Commanding, 1st Airborne Division",
      category: "perimeter",
      note: "His division, what's left of it, is the horseshoe around Oosterbeek. Effort put into Oosterbeek Perimeter carries further under him.",
      reportLine: "Urquhart tightens the perimeter's own line rather than let it be pulled thinner.",
    },
    {
      id: "sosabowski",
      name: "Major General Stanisław Sosabowski",
      role: "Commanding, 1st Independent Parachute Brigade (Poland)",
      category: "poles",
      note: "His brigade is the one making the crossing attempts from Driel. Effort put into Polish Parachute Brigade carries further under him.",
      reportLine: "Sosabowski sends another boat load across on his own order, ferry or no ferry.",
    },
  ],
  // Round 15, battle #9 (PQ-17). Two commanders, not three — no individually-named commander
  // for the anti-aircraft auxiliaries or the signals-intelligence effort specific to this convoy
  // turned up in verification, so Anti-Aircraft Auxiliaries and Signals Intelligence are left
  // uncommanded rather than attributed on an inference, the same asymmetric-by-design pattern as
  // Monte Cassino's single commander. Tovey is this choice's own advisor and so isn't repeated
  // here as a commander pick, the same rule Bagration's and Arnhem's rosters already established.
  // Verified 2026-09-25 (Wikipedia, Convoy PQ 17): Commander Jack Broome commanded the close
  // escort as Senior Officer of the Escort; Rear-Admiral Louis Hamilton commanded the 1st
  // Cruiser Squadron, the covering force screening against the Tirpitz threat.
  pq17_1942: [
    {
      id: "broome",
      name: "Commander Jack Broome",
      role: "Senior Officer of the Escort",
      category: "escorts",
      note: "His destroyers and corvettes are the convoy's own close screen. Effort put into Destroyer & Corvette Screen carries further under him.",
      reportLine: "Broome brings his destroyers in tighter on his own order rather than wait for a threat to name itself.",
    },
    {
      id: "hamilton",
      name: "Rear-Admiral Louis Hamilton",
      role: "Commanding, 1st Cruiser Squadron",
      category: "coveringForce",
      note: "His cruisers are the covering force standing off against the battleship threat. Effort put into Distant Covering Force carries further under him.",
      reportLine: "Hamilton holds his squadron ready to close the distance the moment the threat picture actually changes.",
    },
  ],
  // Round 15, battle #10 (Pointblank / Second Schweinfurt). Three commanders, each verified to a
  // documented rank and title as of the mission date (14 October 1943) rather than a later or
  // earlier one — LeMay in particular is easy to get wrong here, since he is far better known at
  // higher ranks later in the war. Spaatz, the choice's own advisor, isn't repeated here, the
  // same rule Bagration's, Arnhem's, and PQ-17's rosters already established. No individually-
  // named commander for the diversion force turned up in verification, so Diversionary Routing is
  // left uncommanded rather than attributed on an inference — the same asymmetric-by-design
  // pattern as PQ-17's Signals Intelligence. Verified 2026-09-25 (Wikipedia, Curtis LeMay /
  // William Ellsworth Kepner / Ira C. Eaker): Brigadier General Curtis LeMay (promoted from
  // Colonel on 28 September 1943) commanded the newly formed 3rd Air Division, one of the two
  // divisions that flew this mission, and had developed the combat box formation himself while
  // commanding the 305th Bombardment Group; Major General William Kepner commanded VIII Fighter
  // Command, the escort's parent command, from September 1943; Lieutenant General Ira Eaker
  // commanded Eighth Air Force throughout this period.
  bomberDirective43: [
    {
      id: "lemay",
      name: "Brigadier General Curtis LeMay",
      role: "Commanding, 3rd Air Division",
      category: "formation",
      note: "The combat box is his own doctrine, drilled into his division before anyone else's. Effort put into Combat Box Discipline carries further under him.",
      reportLine: "LeMay orders the box tightened on his own standing doctrine rather than wait for a report to justify it.",
    },
    {
      id: "kepner",
      name: "Major General William Kepner",
      role: "Commanding, VIII Fighter Command",
      category: "escort",
      note: "His Thunderbolt groups are the whole of the mission's fighter escort. Effort put into Fighter Escort Coordination carries further under him.",
      reportLine: "Kepner pushes another flight to the limit of its range on his own order rather than wait for the schedule to call for it.",
    },
    {
      id: "eaker",
      name: "Lieutenant General Ira Eaker",
      role: "Commanding, Eighth Air Force",
      category: "targeting",
      note: "The target list — and the case that chokepoint industries are worth this cost — is his own command's doctrine. Effort put into Precision Bomb-Run carries further under him.",
      reportLine: "Eaker's own standing order to hold the run steady through flak is what the lead bombardiers are flying to.",
    },
  ],
  // Early-war battles (round 21, 2026-10-05: Craig picked Sedan, Moscow 1941, Battle of Britain
  // Day and the Alps offensive as the first Order of Battle for each campaign). Every officer is
  // tied to a category by what they verifiably commanded, never by an invented trait. Verified
  // 2026-10-05 (Wikipedia: Battle of Sedan (1940), Hermann Balck, Bruno Loerzer):
  //  - Guderian commanded XIX Panzer Corps, the three panzer divisions (1st, 2nd, 10th) that all
  //    had to cross the same river, and whose tanks could only cross once a bridge stood.
  //  - Balck, an Oberst, commanded Schützen-Regiment 1 of 1st Panzer Division; "Balck's regiment
  //    spearheaded a crossing over the Meuse, and established a bridgehead on the far side"
  //    (Knight's Cross 3 June 1940).
  //  - Loerzer, Generalleutnant, commanded II Fliegerkorps from 11 October 1939 to 23 February
  //    1943, one of the air corps flying the day's attacks. Artillery has no named tie: the
  //    corps' guns arrived short (some of 2nd Panzer Division's heavy howitzers were still in the
  //    Ardennes traffic), the same asymmetric-by-design pattern as Kursk's Supply.
  sedan40: [
    {
      id: "guderian",
      name: "General der Panzertruppe Heinz Guderian",
      role: "Commanding, XIX Panzer Corps",
      category: "bridging",
      note: "All three of his panzer divisions cross at Sedan, and not one tank can follow the infantry until engineers put a bridge over the river. Effort put into Bridging & Traffic carries further under him.",
      reportLine: "Guderian presses the engineers on the bridge and the traffic behind it, because every tank he has is waiting for them.",
    },
    {
      id: "balck",
      name: "Oberst Hermann Balck",
      role: "Commanding, 1st Rifle Regiment, 1st Panzer Division",
      category: "assault",
      note: "His regiment is one of those that cross first and take the heights above the river. Effort put into Assault Infantry & Pioneers carries further under him.",
      reportLine: "Balck's riflemen go over in the first boats and are up the far slope before the French can steady.",
    },
    {
      id: "loerzer",
      name: "Generalleutnant Bruno Loerzer",
      role: "Commanding, II Fliegerkorps",
      category: "air",
      note: "His air corps flies in the day's waves over the French positions. Effort put into Air Attack carries further under him.",
      reportLine: "Loerzer's bombers keep coming over the French line in small waves, hour after hour.",
    },
  ],
  // Moscow 1941. Verified 2026-10-05 (Wikipedia: Battle of Moscow, Pavel Belov, 1st Shock Army):
  //  - Zhukov commanded the Western Front; accounts of the planning have him arguing that the
  //    reserves were thin and had to be gathered and used together ("Zhukov replied that it was
  //    possible, but reserves were urgently needed").
  //  - Belov commanded the cavalry corps renamed 1st Guards Cavalry Corps on 26 November 1941,
  //    "pivotal in stopping Guderian's Panzers... near the town of Kashira"; before the
  //    counteroffensive he appealed, with Zhukov's backing, to Stalin for it to be re-equipped.
  //  The other two arms (air, rail supply) have no named tie, the usual asymmetric pattern.
  moscow41: [
    {
      id: "zhukov",
      name: "General Georgy Zhukov",
      role: "Commanding, Western Front",
      category: "reserves",
      note: "He is the front commander who argued that the new armies had to be gathered and thrown together, not fed in one at a time. Effort put into Fresh Rifle Armies carries further under him.",
      reportLine: "Zhukov throws the fresh armies in together on the first morning rather than feed them in one by one.",
    },
    {
      id: "belov",
      name: "Major General Pavel Belov",
      role: "Commanding, 1st Guards Cavalry Corps",
      category: "exploitation",
      note: "His cavalry stopped Guderian's tanks near Kashira and is the one force on the line that can ride through the snow behind the German flank. Effort put into Cavalry & Ski Columns carries further under him.",
      reportLine: "Belov's horsemen ride through the snow past the German strongpoints and into the rear.",
    },
  ],
  // Battle of Britain Day. Verified 2026-10-05 (Wikipedia: Keith Park, Dowding system, Hugh
  // Dowding, Trafford Leigh-Mallory, Battle of Britain Day): Park commanded No. 11 Group from 20
  // April 1940, controlling it from the Uxbridge operations room, and favoured squadron-sized
  // interceptions; Dowding, Air Chief Marshal, built the radar, Observer Corps, filter room
  // and radio-control system that bears his name; Leigh-Mallory, an Air Vice-Marshal, commanded No.
  // 12 Group and its Duxford Wing and clashed with Park over cover for 11 Group's airfields.
  // Turnaround has no named tie (asymmetric by design).
  britainDay40: [
    {
      id: "park",
      name: "Air Vice-Marshal Keith Park",
      role: "Commanding, No. 11 Group",
      category: "squadrons",
      note: "The squadrons that meet the raids over Kent and London are his, flown from sector stations he knows by name. Effort put into 11 Group Squadrons carries further under him.",
      reportLine: "Park sends his squadrons up in ones and twos to meet each raid before it reaches the coast.",
    },
    {
      id: "dowding",
      name: "Air Chief Marshal Hugh Dowding",
      role: "Commanding-in-Chief, Fighter Command",
      category: "control",
      note: "The chain of radar, observers, plotting tables and radio control is his own design. Effort put into Radar & Ground Control carries further under him.",
      reportLine: "Dowding's system feeds the plot to Uxbridge, and the controllers put each squadron where the raid is going.",
    },
    {
      id: "leighMallory",
      name: "Air Vice-Marshal Trafford Leigh-Mallory",
      role: "Commanding, No. 12 Group",
      category: "wing",
      note: "He commands the group north of the Thames whose Duxford Wing flies as a mass of squadrons. Effort put into the Duxford Wing carries further under him.",
      reportLine: "Leigh-Mallory's wing forms up over Duxford and heads south in a single mass of fighters.",
    },
  ],
  // The Alps, 21-24 June 1940. Verified 2026-10-05 (Wikipedia: Italian invasion of France,
  // Alfredo Guzzoni): "the main Italian attack was by the 4th Army under General Alfredo Guzzoni",
  // the Alpine Army Corps on its left flank, through the Little St Bernard Pass. Guzzoni's exact
  // rank in June 1940 is not given there, so he is named as general and by command.
  alps40: [
    {
      id: "guzzoni",
      name: "General Alfredo Guzzoni",
      role: "Commanding, Fourth Army",
      category: "assault",
      note: "His army makes the main attack, through the Little St Bernard Pass. Effort put into Alpini & Infantry Assault carries further under him.",
      reportLine: "Guzzoni drives the main attack up the Little St Bernard road and holds nothing back from it.",
    },
  ],
  // Round 23: the six battles added in the second ring (Uranus, Dunkirk, the Pindus winter, Crete, the
  // relief of Bastogne, Cape Matapan). Facts verified 2026-10-05 against Wikipedia and noted on each host node.
  uranus: [
    {
      id: "vatutin",
      name: "Nikolai Vatutin",
      role: "Commanding, Southwestern Front",
      category: "breakthrough",
      note: "His front makes the northern pincer and breaks the Romanian Third Army's line. Effort put into Breakthrough Armies carries further under him.",
      reportLine: "Vatutin's armies break the Romanian line on the first morning.",
    },
    {
      id: "romanenko",
      name: "Pavel Romanenko",
      role: "Commanding, 5th Tank Army",
      category: "armour",
      note: "His army is the mobile heart of the northern pincer. Effort put into Tank & Cavalry Corps carries further under him.",
      reportLine: "Romanenko's tank army drives for the Don behind the break.",
    },
  ],
  dynamo40: [
    {
      id: "ramsay",
      name: "Admiral Bertram Ramsay",
      role: "Commanding, Dover Command",
      category: "navy",
      note: "He runs the whole lift from Dover Castle. Effort put into Destroyers & the Mole carries further under him.",
      reportLine: "Ramsay's staff at Dover send ship after ship across the Channel.",
    },
    {
      id: "park",
      name: "Air Vice-Marshal Keith Park",
      role: "Commanding, No. 11 Group",
      category: "air",
      note: "His squadrons provide the fighter cover over the beaches. Effort put into Fighter Cover carries further under him.",
      reportLine: "Park's squadrons fly patrol after patrol over the beaches.",
    },
    {
      id: "alexander",
      name: "General Harold Alexander",
      role: "Commanding the rearguard",
      category: "perimeter",
      note: "He commands the rearguard holding the perimeter. Effort put into The Perimeter & Rearguard carries further under him.",
      reportLine: "Alexander holds the line, fighting at every canal.",
    },
  ],
  epirus40: [
    {
      id: "cavallero",
      name: "General Ugo Cavallero",
      role: "Commanding in Albania from December 1940",
      category: "reserves",
      note: "He has taken personal command in Albania, and the reserve divisions are his to feed into the line. Effort put into Reserve Divisions from Italy carries further under him.",
      reportLine: "Cavallero feeds the reserve divisions into the line as they land.",
    },
  ],
  crete41: [
    {
      id: "student",
      name: "Generalleutnant Kurt Student",
      role: "Commanding, XI Fliegerkorps",
      category: "paratroops",
      note: "The whole airborne arm is his, and the plan is his. Effort put into The Paratroop Drop carries further under him.",
      reportLine: "Student sends in every paratrooper he has, from the first light.",
    },
    {
      id: "richthofen",
      name: "General der Flieger Wolfram von Richthofen",
      role: "Commanding, VIII Fliegerkorps",
      category: "air",
      note: "His close-support air corps works with the paratroops and drives the Royal Navy off. Effort put into Luftwaffe Support carries further under him.",
      reportLine: "Richthofen's bombers and dive bombers work over the island and the sea from first light.",
    },
    {
      id: "ringel",
      name: "Julius Ringel",
      role: "Commanding, 5th Mountain Division",
      category: "mountain",
      note: "His division is the reinforcement that must land as soon as an airfield is held. Effort put into Mountain Troops by Air-Landing carries further under him.",
      reportLine: "Ringel's mountain troops land on the airfield as soon as the runway can be used.",
    },
  ],
  bastogne44: [
    {
      id: "patton",
      name: "Lieutenant General George S. Patton Jr.",
      role: "Commanding, Third Army",
      category: "armour",
      note: "He told Eisenhower that Third Army could attack in forty-eight hours, and his armour leads the relief. Effort put into The Armoured Spearhead carries further under him.",
      reportLine: "Patton drives the armour up the road with everything he has.",
    },
    {
      id: "millikin",
      name: "Major General John Millikin",
      role: "Commanding, III Corps",
      category: "infantry",
      note: "His corps makes the attack, and the 26th and 80th Infantry Divisions are on the shoulders of the advance. Effort put into Infantry Divisions on the Shoulders carries further under him.",
      reportLine: "Millikin's infantry clear the road's flanks and hold the shoulders of the advance.",
    },
    {
      id: "mcauliffe",
      name: "Brigadier General Anthony McAuliffe",
      role: "Commanding, 101st Airborne Division at Bastogne",
      category: "garrison",
      note: "The town and the perimeter are his, and the surrender demand has already been refused. Effort put into The Bastogne Garrison carries further under him.",
      reportLine: "McAuliffe holds the perimeter with what he has and refuses to give up the town.",
    },
  ],
  matapan41: [
    {
      id: "iachino",
      name: "Admiral Angelo Iachino",
      role: "Commander-in-Chief, Italian Fleet",
      category: "battle",
      note: "The whole fleet is his, and the battleship flies his flag. Effort put into The Battle Fleet carries further under him.",
      reportLine: "Iachino holds the battle fleet together and turns it for home.",
    },
    {
      id: "cattaneo",
      name: "Admiral Carlo Cattaneo",
      role: "Commanding, 1st Cruiser Division",
      category: "cruisers",
      note: "His three heavy cruisers are the fleet's screen. Effort put into The Cruiser Divisions carries further under him.",
      reportLine: "Cattaneo keeps his cruisers in line and ready to fight.",
    },
  ],
  // Round 25 (Craig's item 9): the five battles added with the actions of rounds 24 and 25. Each commander is tied to
  // the arm of his own documented command, verified 2026-10-08; an arm with no documented named commander is left
  // without one, the asymmetric-by-design pattern used throughout.
  //  - Dapino commanded the 1st Motorized Group at Monte Lungo (Italian Wikipedia, Battaglia di Montelungo).
  //  - Utili commanded the Italian Liberation Corps and Anders the Polish II Corps it was attached to (Wikipedia,
  //    Italian Liberation Corps; Battle of Ancona).
  //  - Primieri commanded the Cremona Combat Group, attached to British V Corps under Keightley (Wikipedia, Italian
  //    Co-belligerent Army; historyofwar.org, Operation Buckland).
  //  - Ryabyshev (8th Mechanized Corps), Rokossovsky (9th, no T-34s or KVs; he put his infantry on his tanks and
  //    commandeered 200 trucks) and Zhukov (sent from Moscow to see Directive No. 3 carried out) from Wikipedia,
  //    Battle of Brody (1941).
  //  - Belov (1st Guards Cavalry Corps), Yefremov (33rd Army) and Levashev (4th Airborne Corps) from Wikipedia,
  //    Rzhev-Vyazma strategic offensive operation, Mikhail Yefremov and Vyazma airborne operation.
  monteLungo43: [
    {
      id: "dapino",
      name: "General Vincenzo Dapino",
      role: "Commanding, 1st Motorized Group",
      category: "infantry",
      note: "The Group is his, and its main body is the 67th Regiment that will climb the hill. Effort put into the 67th Infantry Regiment carries further under him.",
      reportLine: "Dapino keeps the regiment moving up the slope as the mist thins.",
    },
  ],
  adriaticRoad44: [
    {
      id: "utili",
      name: "General Umberto Utili",
      role: "Commanding, Italian Liberation Corps",
      category: "nembo",
      note: "The Nembo is the best division in his corps and the reason the corps was offered the town. Effort put into Nembo Paratroops carries further under him.",
      reportLine: "Utili sends the Nembo's battalions up into the hills in front of the town.",
    },
    {
      id: "anders",
      name: "General Władysław Anders",
      role: "Commanding, Polish II Corps",
      category: "armour",
      note: "The Italian Corps is attached to his, and the tanks and the roads are the Poles'. Effort put into Polish Armour carries further under him.",
      reportLine: "Anders keeps his tanks on the road below the ridges, close behind the Italians.",
    },
  ],
  springOffensive45: [
    {
      id: "primieri",
      name: "Major General Clemente Primieri",
      role: "Commanding, Cremona Combat Group",
      category: "assault",
      note: "The Group's two infantry regiments are his, and this is the first attack they have made. Effort put into Cremona Infantry carries further under him.",
      reportLine: "Primieri keeps the Cremona's regiments moving over the bank.",
    },
    {
      id: "keightley",
      name: "Charles Keightley",
      role: "Commanding, British V Corps",
      category: "fire",
      note: "The fire plan, the bombers and the flame-throwing tanks the Group is lent are his corps'. Effort put into Bombers & Guns carries further under him.",
      reportLine: "Keightley's corps fires its barrages on the timetable it set.",
    },
  ],
  brodyCounterstroke41: [
    {
      id: "ryabyshev",
      name: "Dmitry Ryabyshev",
      role: "Commanding, 8th Mechanized Corps",
      category: "armour",
      note: "His corps has 899 tanks on paper, and one of its groups takes Dubno in the middle of the battle. Effort put into Mechanized Corps carries further under him.",
      reportLine: "Ryabyshev drives his tank divisions on toward Brody.",
    },
    {
      id: "rokossovsky",
      name: "Konstantin Rokossovsky",
      role: "Commanding, 9th Mechanized Corps",
      category: "infantry",
      note: "His corps has no T-34s. He commandeers trucks and puts his infantry on the tanks to get them to the fight. Effort put into Infantry & Rifle Corps carries further under him.",
      reportLine: "Rokossovsky mounts his infantry on the tanks and sends them forward.",
    },
    {
      id: "zhukov",
      name: "Georgy Zhukov",
      role: "Representing Stavka at the Southwestern Front",
      category: "signals",
      note: "He has come from Moscow to see Directive No. 3 carried out, and he will overrule the front commander on the fourth day. Effort put into Orders & Signals carries further under him.",
      reportLine: "Zhukov presses the front's staff to get the orders to the corps.",
    },
  ],
  rzhevVyazma42: [
    {
      id: "belov",
      name: "Major General Pavel Belov",
      role: "Commanding, 1st Guards Cavalry Corps",
      category: "cavalry",
      note: "His corps is the one force that can ride through the forest and the snow into the German rear, as it did that winter. Effort put into Cavalry Corps carries further under him.",
      reportLine: "Belov's horsemen ride on through the gaps between the strongpoints.",
    },
    {
      id: "yefremov",
      name: "Lieutenant General Mikhail Yefremov",
      role: "Commanding, 33rd Army",
      category: "armies",
      note: "His army is the southern arm of the pincer, and he leads its striking force himself. Effort put into Pincer Armies carries further under him.",
      reportLine: "Yefremov leads the 33rd Army's striking force toward Vyazma.",
    },
    {
      id: "levashev",
      name: "Major General Alexei Levashev",
      role: "Commanding, 4th Airborne Corps",
      category: "airborne",
      note: "His corps is dropped behind the German line to hold the highway and the railway. Effort put into Airborne Corps carries further under him.",
      reportLine: "Levashev's paratroopers are dropped on the Vyazma highway.",
    },
  ],
  // Round 26 (item 1): the six battles added with the German and Soviet rounds. Each commander is tied to the arm of his
  // own documented command, verified 2026-10-08; an arm with no documented named commander is left without one.
  //  - Guderian (Panzer Group 2) and Kleist (Panzer Group 1) from Wikipedia, Battle of Kiev (1941).
  //  - Hausser (II SS Panzer Corps) and Hoth (4th Panzer Army) from Wikipedia, Third Battle of Kharkov.
  //  - Dietrich (Sixth SS Panzer Army) and Manteuffel (Fifth Panzer Army) from Wikipedia, Battle of the Bulge.
  //  - Rokossovsky (Central Front), Vatutin (Voronezh Front) and Rotmistrov (5th Guards Tank Army) from Wikipedia,
  //    Battle of Kursk.
  //  - Rodimtsev (13th Guards Rifle Division) and Chuikov (62nd Army) from Wikipedia, Battle of Stalingrad.
  //  - Chuikov (8th Guards Army), Katukov (1st Guards Tank Army) and Zhukov (1st Belorussian Front) from Wikipedia,
  //    Battle of the Seelow Heights.
  kievPocket41: [
    {
      id: "guderian",
      name: "General Heinz Guderian",
      role: "Commanding, Panzer Group 2",
      category: "northPincer",
      note: "The northern jaw is his, and he has argued against being sent south at all. Effort put into Panzer Group 2 carries further under him.",
      reportLine: "Guderian drives his group south from the Desna as fast as its fuel allows.",
    },
    {
      id: "kleist",
      name: "General Ewald von Kleist",
      role: "Commanding, Panzer Group 1",
      category: "southPincer",
      note: "The southern jaw is his, out of the bridgehead on the Dnieper. Effort put into Panzer Group 1 carries further under him.",
      reportLine: "Kleist's tanks come up out of the bridgehead and drive north to meet the other group.",
    },
  ],
  kharkovBackhand43: [
    {
      id: "hausser",
      name: "General Paul Hausser",
      role: "Commanding, II SS Panzer Corps",
      category: "ssCorps",
      note: "The SS divisions are his, and he has already left Kharkov once against orders. Effort put into the SS Panzer Corps carries further under him.",
      reportLine: "Hausser turns his three divisions back toward Kharkov.",
    },
    {
      id: "hoth",
      name: "General Hermann Hoth",
      role: "Commanding, 4th Panzer Army",
      category: "panzerArmy",
      note: "The flank blow is his, from the south. Effort put into the Panzer Armies carries further under him.",
      reportLine: "Hoth sends XLVIII Panzer Corps north into the flank of the Soviet spearheads.",
    },
  ],
  ardennesWacht44: [
    {
      id: "dietrich",
      name: "SS-Oberstgruppenführer Sepp Dietrich",
      role: "Commanding, Sixth SS Panzer Army",
      category: "sixthSS",
      note: "The main effort is his, on the northern shoulder, with Peiper's group at its head. Effort put into the Sixth SS Panzer Army carries further under him.",
      reportLine: "Dietrich's divisions go forward along the northern roads in the fog.",
    },
    {
      id: "manteuffel",
      name: "General Hasso von Manteuffel",
      role: "Commanding, Fifth Panzer Army",
      category: "fifthPanzer",
      note: "The centre is his, where the roads are better and the Americans thinner. Effort put into the Fifth Panzer Army carries further under him.",
      reportLine: "Manteuffel's panzer divisions slip through the gaps in the American line.",
    },
  ],
  kurskSoviet43: [
    {
      id: "rokossovsky",
      name: "General Konstantin Rokossovsky",
      role: "Commanding, Central Front",
      category: "antiTank",
      note: "The northern face is his, and it was dug in six belts deep. Effort put into the anti-tank guns and minefields carries further under him.",
      reportLine: "Rokossovsky's guns open on the German assembly areas and the belts wait.",
    },
    {
      id: "vatutin",
      name: "General Nikolai Vatutin",
      role: "Commanding, Voronezh Front",
      category: "infantry",
      note: "The southern face is his, where the German blow was heaviest, and his rifle armies took it. Effort put into the rifle armies carries further under him.",
      reportLine: "Vatutin's rifle divisions stand in the belts on the southern face and wait for the blow.",
    },
    {
      id: "rotmistrov",
      name: "General Pavel Rotmistrov",
      role: "Commanding, 5th Guards Tank Army",
      category: "tanks",
      note: "The tank reserve is his, moved up from the Steppe Front. Effort put into the tank reserve carries further under him.",
      reportLine: "Rotmistrov's tank corps move up behind the second belt.",
    },
  ],
  stalingradCity42: [
    {
      id: "rodimtsev",
      name: "General Alexander Rodimtsev",
      role: "Commanding, 13th Guards Rifle Division",
      category: "rifle",
      note: "His division crossed the Volga on 14 and 15 September and was in the centre of the city within a day. Effort put into the rifle divisions carries further under him.",
      reportLine: "Rodimtsev's guardsmen cross the river in the dark and go straight into the line.",
    },
    {
      id: "chuikov",
      name: "General Vasily Chuikov",
      role: "Commanding, 62nd Army",
      category: "groups",
      note: "The close-quarters fighting is his doctrine. Effort put into the assault groups carries further under him.",
      reportLine: "Chuikov moves his assault groups into the ruins as close to the Germans as they can get.",
    },
  ],
  seelow45: [
    {
      id: "zhukov",
      name: "Marshal Georgy Zhukov",
      role: "Commanding, 1st Belorussian Front",
      category: "barrage",
      note: "The barrage is his plan, and so are the searchlights. Effort put into the opening barrage carries further under him.",
      reportLine: "Zhukov gives the order for the barrage to open.",
    },
    {
      id: "chuikov",
      name: "General Vasily Chuikov",
      role: "Commanding, 8th Guards Army",
      category: "rifle",
      note: "His army is in the centre of the attack, below the heights, and he has taken a city before. Effort put into the rifle armies carries further under him.",
      reportLine: "Chuikov's army goes forward into the flooded fields below the heights.",
    },
    {
      id: "katukov",
      name: "General Mikhail Katukov",
      role: "Commanding, 1st Guards Tank Army",
      category: "tanks",
      note: "His tank army is the weight behind the first assault, and the road is narrow. Effort put into the tank armies carries further under him.",
      reportLine: "Katukov's tanks move up the one dry road toward the heights.",
    },
  ],
  // Round 8 (Craig: "if limit it to a max of 3 commanders"): cut from four names to three. The
  // one dropped — Theodor Busse, Manstein's Chief of Staff — was always the odd one out of the
  // four anyway: Hoth, Kempf, and Deßloch each held a field or air command, giving orders in
  // their own right; Busse ran a headquarters staff, not a command. "Field Command" as a section
  // label fits the remaining three more honestly than it did the four. Supply is left without a
  // named commander tie as a result — consistent with the existing asymmetric-by-design pattern
  // (this roster was never meant to cover every category, see KEY_BATTLE_COMMANDER_BONUS below).
};
// Flat effectiveness add-on for whichever single category a selected commander is tied to —
// see BattleAllocationScreen's effectiveWeight(). Deliberately not scaled by jitter (a
// commander's presence is a known, chosen fact going in, not a roll of the dice the way that
// category's own readiness is) and sized to be felt without letting commander choice alone
// dominate the allocation decision: at the current per-chit effectiveness range (1.8-3.0 before
// jitter), +0.8 is a meaningful fraction of a chit's value in that category, not a second pool
// of chits in disguise.
const KEY_BATTLE_COMMANDER_BONUS = 0.8;

// Round 4 follow-up (2026-09-20, Craig: "would there an ability to pick a tactical approach...
// night battle, flank, paras, spearhead?"). Researched before building anything (Wikipedia's
// Operation Citadel order-of-battle/planning content, cross-checked against Warfare History
// Network's Manstein and Model retrospectives, 2026-09-20): of Craig's four suggested labels,
// two don't survive verification for Kursk specifically — no airborne/paratroop component was
// ever planned for Citadel, and "flank" isn't an alternative choice at all, it's what the whole
// operation already does unconditionally (a double envelopment: Model's 9th Army from the
// north, Hoth's 4th Panzer Army/Kempf from the south, meeting to cut off the salient). A "night
// battle" is also overstated — the only documented night activity is engineers clearing mine
// lanes on 4/5 July ahead of a dawn assault, prep work rather than a fighting doctrine. What DID
// hold up, and is what actually shipped (Craig's call, given the choice directly): a genuine,
// sourced tactical contrast between the battle's own two real pincers. Model's 9th Army
// deliberately did not lead with armor — "he planned to use his infantry to batter their way
// through the defenses," with the panzer reserve committed only after the three Soviet
// defensive lines were breached (a subordinate later said holding those reserves back cost them
// Kursk). Hoth's 4th Panzer Army led with the opposite: a concentrated armored wedge (Panzerkeil
// — Tigers forward, Panzer IIIs/IVs and assault guns fanning to the flanks and rear). Modeled as
// a tradeoff, not a pure buff, per-category: Spearhead pushes Mechanised Armour harder but
// thins Supply (a fast armored thrust famously outruns its own logistics tail — the real risk
// Hoth's own attack ran, worst at Prokhorovka); Infantry-Led Breach pushes Divisions harder but
// holds Armour back (armor deliberately not leading, per Model's own plan above). Air
// deliberately untouched by either — both pincers flew similar close air support, and this
// isn't a lever either doctrine actually pulled. Un-jittered, same reasoning as the commander
// bonus: which doctrine you picked is a known fact going into the battle, not a roll of the
// dice. Unlike commander selection, there's no "no particular approach" default — Craig's own
// framing ("choose between the two tactical choices") is a forced pick, matching how a real
// commander can't run an attack according to neither doctrine.
const KEY_BATTLE_APPROACHES = {
  kursk: [
    {
      id: "spearhead",
      name: "Concentrated Armored Spearhead",
      subtitle: "Hoth's approach — the southern pincer",
      note: "Lead with the tanks. A narrow armored wedge — Tigers forward, the rest fanning to the flanks and rear — punches through fast, the way 4th Panzer Army's own attack did. Speed outruns its own supply tail: effort in Mechanised Armour carries further, effort in Supply carries less.",
      modifiers: { armour: 0.7, supply: -0.5 },
      reportLine: "The attack goes in as a wedge: Tigers at the point, the lighter tanks fanning out behind.",
    },
    {
      id: "infantryBreach",
      name: "Methodical Infantry-Led Breach",
      subtitle: "Model's approach — the northern pincer",
      note: "Hold the tanks back. Infantry and artillery batter the line open first, the way 9th Army's own attack did, with the panzer reserve committed only once the defenses are actually breached. Effort in Divisions carries further; effort in Mechanised Armour carries less, held back rather than leading. The methodical pace also keeps the supply columns closer behind the line: effort in Supply carries a little further too.",
      // Round 13, Craig's item #4: Supply had no commander tie and no positive approach modifier
      // anywhere in Kursk's config — structurally a dead end, since check-battle-balance.js's own
      // round-12 build surfaced that no plan can ever push Supply to the same ceiling every other
      // category can reach. Not a 4th commander (Craig, round 8: "if limit it to a max of 3
      // commanders") — a small +0.3 tacked onto the approach that already fits it. 9th Army's
      // methodical, engineer-supported approach (verified below) is the honest place to hang a
      // supply-side bonus; deliberately smaller than the 0.7 lead-lever bonuses so this approach
      // doesn't become strictly stronger than spearhead's own two-lever tradeoff.
      modifiers: { divisions: 0.7, armour: -0.5, supply: 0.3 },
      // Verified: "Model chose to make his initial attacks using infantry divisions reinforced
      // with assault guns and heavy tanks" (Wikipedia, Operation Citadel).
      reportLine: "Infantry and assault guns go in first. The panzer divisions wait behind them, unspent.",
    },
  ],
  // Omaha (round 9). Verified 2026-09-21 (Wikipedia, Omaha Beach): the plan was built around
  // opening the beach's five draws — the only vehicle exits — which were also where the
  // strongpoints were sited; what actually worked on the morning was troops who "made
  // improvised assaults, scaling the bluffs between the most well-defended points," and "by
  // 09:00, more than 600 American troops, in groups ranging from company sized to just a few
  // men, had reached the top of the bluff opposite Dog White." Same tradeoff shape as Kursk's
  // pair: each pushes one category and thins another; Naval Gunfire untouched, since both
  // doctrines leaned on it equally.
  omaha: [
    {
      id: "forceDraws",
      name: "Force the Draws",
      subtitle: "The V Corps plan — take the exits",
      note: "Go straight at the five draws, where the vehicle exits and the strongpoints both are. Open them and the beach can drain inland. Effort in Engineers & Tanks carries further; effort in Follow-on Waves carries less, fed into the fire at the draw mouths.",
      modifiers: { engineers: 0.7, waves: -0.5 },
      reportLine: "The assault goes straight at the draws, where the exits and the strongpoints both are.",
    },
    {
      id: "climbBluffs",
      name: "Climb Between the Draws",
      subtitle: "Small groups, between the strongpoints",
      note: "Send small groups up the bluffs between the strongpoints, away from the draws, and take the defenders from behind. Effort in Follow-on Waves carries further; effort in Engineers & Tanks carries less, with the exits left shut for now.",
      modifiers: { waves: 0.7, engineers: -0.5 },
      reportLine: "Small groups start up the bluffs between the strongpoints, well away from the draws.",
    },
  ],
  // Round 15, battle #3. No second officially-planned breakout axis is on the documentary record
  // for Stalingrad the way Kursk had two real army groups' doctrines — this is a modeled tactical
  // tradeoff (concentrate the mobile force vs. preserve the broader infantry mass), not two named
  // historical plans, and is disclosed as such rather than attributed to a specific staff study.
  stalingrad: [
    {
      id: "armoredThrust",
      name: "Concentrated Armored Thrust",
      subtitle: "Lead with what panzer strength survived Uranus",
      note: "Put the tanks at the front of the column and drive for open ground before the ring hardens. Effort in Mechanised Armour carries further; every kilometer spends fuel nobody is flying in a second load of, so effort in Supply carries less.",
      modifiers: { armour: 0.7, supply: -0.5 },
      reportLine: "The panzer screen forms up at the head of the column and pushes west first.",
    },
    {
      id: "broadWithdrawal",
      name: "Broad Infantry Withdrawal",
      subtitle: "Preserve the mass, screen it rather than lead with it",
      note: "March the infantry divisions out under their own power, tanks screening the flanks rather than leading. Effort in Divisions carries further; effort in Mechanised Armour carries less, held to the column's edges instead of its point.",
      modifiers: { divisions: 0.7, armour: -0.5 },
      reportLine: "The infantry divisions form the column's main body, tanks screening its edges rather than leading it.",
    },
  ],
  // Round 15, battle #4. Rommel's actual plan for Alam Halfa was a single scheme (night march
  // south of the minefields, then north behind the ridge before daylight) — no second
  // officially-planned axis exists the way Kursk had two real army groups' doctrines. Same
  // disclosed-modeled-tradeoff pattern as Stalingrad's approaches above, grounded in the sourced
  // fact that the actual attempt was delayed past first light by minefields deeper than expected
  // and then caught in the open by the Desert Air Force (Wikipedia, Battle of Alam el Halfa).
  elAlamein: [
    {
      id: "raceTheDawn",
      name: "Race the Dawn",
      subtitle: "Force the gap before first light",
      note: "Push the panzer spearhead through the minefield lanes at speed rather than wait for them fully cleared — every hour saved is an hour less exposed to the Desert Air Force in daylight. Effort in Mechanised Armour carries further; the pace burns fuel nobody is shipping a second load of, so effort in Supply carries less.",
      modifiers: { armour: 0.7, supply: -0.5 },
      reportLine: "The panzer spearhead probes the minefield's edge, looking for a lane already cleared.",
    },
    {
      id: "clearTheMines",
      name: "Clear the Mines Properly",
      subtitle: "Let the engineers open the lanes first",
      note: "Take the time to breach the minefields properly before committing the column, infantry and engineers leading rather than the tanks. Effort in Divisions carries further; effort in Mechanised Armour carries less, held back until the lanes are actually open.",
      modifiers: { divisions: 0.7, armour: -0.5 },
      reportLine: "The infantry and engineers lead into the minefield, clearing the lanes ahead of the tanks.",
    },
  ],
  // Round 15, battle #5. No second officially-planned axis exists for Monte Marrone specifically
  // any more than one does for Stalingrad or Alam Halfa above — this is the same disclosed
  // modeled tradeoff (which arm leads the plan), not two named historical doctrines. Balance note
  // (tools/check-battle-balance.js): without any approach bonus available, Artillery's own
  // effectiveness under a dampening posture couldn't clear the neglect penalty on the other three
  // categories at pool=5 — Artillery needed its own synergy path the same way Assault already
  // has one through its commander, which is what "Guns Forward" gives it.
  monteCassino44: [
    {
      id: "gunsForward",
      name: "Guns Forward",
      subtitle: "Range the artillery in before the climb starts",
      note: "Have the Anglo-Polish batteries register their fire plan before the assault battalions move, at the cost of some of the surprise a faster start would keep. Effort in Anglo-Polish Artillery carries further; effort in Alpine & Bersaglieri Assault carries less, held to wait on the guns' own schedule.",
      modifiers: { artillery: 0.7, assault: -0.5 },
      reportLine: "The Anglo-Polish batteries range in their fire plan before the assault line moves.",
    },
    {
      id: "assaultLeads",
      name: "Assault Leads the Climb",
      subtitle: "Move on the peak now, guns in overwatch",
      note: "Send the assault battalions up the mountain on the original night-surprise schedule, artillery held in overwatch rather than leading the plan. Effort in Alpine & Bersaglieri Assault carries further; effort in Anglo-Polish Artillery carries less, ranged in only after contact.",
      modifiers: { assault: 0.7, artillery: -0.5 },
      reportLine: "The assault line moves up the mountain on schedule, the guns held in overwatch behind it.",
    },
  ],
  // Round 15, battle #6. Real operational tension, not an invented one — the Feste Plätze
  // doctrine (see the outer choice's own sourcing note) only became a trap because the Soviet
  // plan's actual character was to bypass strongpoints with deep armored thrusts rather than
  // reduce them in place, which is what let the Minsk pocket close as fast and as completely as
  // it did. No source found naming an internal Stavka debate between these two doctrines as
  // live alternatives for this specific operation, so — same disclosure as Stalingrad's and Alam
  // Halfa's approach pairs above — this is a modeled tradeoff built from what the historical
  // doctrine actually was (bypass) and its plausible operational opposite (reduce in place), not
  // two named historical plans.
  bagrationSoviet44: [
    {
      id: "deepEncirclement",
      name: "Bypass and Encircle",
      subtitle: "Drive the tank armies deep, leave the strongpoints behind",
      note: "Push the tank armies past the fortified towns rather than reduce them, closing the ring on the open country behind the line. Effort in Mechanised Armour carries further; every kilometer driven around a strongpoint is a kilometer the rear services haven't caught up to yet, so effort in Supply carries less.",
      modifiers: { armour: 0.7, supply: -0.5 },
      reportLine: "The tank armies bypass the fortified towns and drive for open country behind the line.",
    },
    {
      id: "reduceStrongpoints",
      name: "Reduce the Strongpoints",
      subtitle: "Clear the fortified towns before pushing on",
      note: "Take the fortified towns methodically with the rifle armies before committing the tank strength past them. Effort in Divisions carries further; effort in Mechanised Armour carries less, held back until the ground behind it is actually clear.",
      modifiers: { divisions: 0.7, armour: -0.5 },
      reportLine: "The rifle armies move to reduce the fortified towns before the tank strength is committed past them.",
    },
  ],
  // Round 15, battle #7 (Anzio). This is the choice's own real historical tension, not an
  // invented one — Lucas's actual order was to consolidate the beachhead first ("no military
  // reason for Shingle," per his diary), while Truscott, first as division commander and later
  // as Lucas's replacement, argued for pushing the exploitation column while the roads were
  // still open. The outer choice already resolves the strategic question (launch Shingle at
  // all); this is the tactical one underneath it — which of the corps's two real, documented
  // instincts the landing force actually executes on the ground.
  anzio44: [
    {
      id: "pushInland",
      name: "Push the Column Inland Now",
      subtitle: "Truscott's argument — commit the exploitation force while the roads are open",
      note: "Send the armor and its screening infantry up the road toward the Alban Hills before the German response can organize. Effort in Armored Exploitation carries further; the beachhead's own infantry line, thinned to feed the column, carries less. Effort in Infantry Beachhead carries less.",
      modifiers: { armor: 0.7, assault: -0.5 },
      reportLine: "The exploitation column moves out on the road inland without waiting for the beachhead to fully consolidate.",
    },
    {
      id: "securePerimeter",
      name: "Secure the Perimeter First",
      subtitle: "Lucas's actual order — entrench the beachhead against the counterattack he expects",
      note: "Hold the armor back and dig the infantry line in before committing anything inland, the way the historical corps commander actually ordered it. Effort in Infantry Beachhead carries further; effort in Armored Exploitation carries less, held in reserve rather than leading.",
      modifiers: { assault: 0.7, armor: -0.5 },
      reportLine: "The infantry digs in on the beachhead's own perimeter while the armor stays back in reserve.",
    },
  ],
  // Round 15, battle #8 (Arnhem). A real, sourced tension, not an invented one: "Hell's
  // Highway," the single road XXX Corps had to advance and resupply on, was cut by the Germans
  // more than once and fatally near Koevering on 25 September — the moment that convinced
  // Horrocks the relief could not succeed. Pushing the spearhead hard for the river and holding
  // enough strength back to keep the road itself open were genuinely in tension the whole way
  // north from Nijmegen.
  arnhemPerimeter44: [
    {
      id: "directAssault",
      name: "Push the Armor Straight at the River",
      subtitle: "Send the spearhead for the crossing directly, corridor security secondary",
      note: "Drive the column for the river without pausing to widen the road behind it. Effort in XXX Corps Armored Push carries further; the single road left thin behind the spearhead is exactly what let the Germans cut it near Koevering — effort in Supply Drop carries less, the corridor's own security being what keeps any resupply moving at all.",
      modifiers: { corpsPush: 0.7, resupply: -0.5 },
      reportLine: "The column drives straight for the river, leaving the road behind it thinner than the plan called for.",
    },
    {
      id: "securedAdvance",
      name: "Clear and Hold the Corridor First",
      subtitle: "Widen and secure the road north before committing the spearhead further",
      note: "Spend the effort holding Hell's Highway open before pushing the spearhead any further. Effort in Supply Drop carries further; effort in XXX Corps Armored Push carries less, held to the pace the secured road actually allows.",
      modifiers: { resupply: 0.7, corpsPush: -0.5 },
      reportLine: "The corps spends its effort holding the road open rather than pushing the spearhead further north.",
    },
  ],
  // Round 15, battle #9 (PQ-17). A modeled tradeoff, not a named historical doctrine dispute —
  // same disclosure as Stalingrad's and Bagration's approach pairs above — built from the real
  // operational fact that a convoy escort this size (six destroyers, two AA auxiliaries) could
  // not fight U-boats and torpedo bombers at full strength simultaneously; where the escort's
  // attention goes is a genuine and disclosed-as-modeled tradeoff, not a documented order.
  pq17_1942: [
    {
      id: "antiSubPriority",
      name: "Screen Against the Wolfpacks",
      subtitle: "Concentrate the escort's attention on the submarine threat",
      note: "Keep the destroyers and corvettes hunting contacts rather than watching the sky. Effort in Destroyer & Corvette Screen carries further; effort in Anti-Aircraft Auxiliaries carries less, left to fight the air threat alone.",
      modifiers: { escorts: 0.7, aaShips: -0.5 },
      reportLine: "The escort's attention goes to the water rather than the sky, hunting contacts before they can fire.",
    },
    {
      id: "antiAirPriority",
      name: "Mass Anti-Aircraft Fire",
      subtitle: "Concentrate the escort's attention on the torpedo bomber threat",
      note: "Bring every gun that can be spared onto the air picture rather than the water. Effort in Anti-Aircraft Auxiliaries carries further; effort in Destroyer & Corvette Screen carries less, thinner on the U-boat threat as a result.",
      modifiers: { aaShips: 0.7, escorts: -0.5 },
      reportLine: "The escort's attention goes to the sky rather than the water, massing fire against the next low pass.",
    },
  ],
  // Round 15, battle #10 (Pointblank / Second Schweinfurt). A modeled tradeoff, not a documented
  // doctrine dispute — same disclosure as PQ-17's and Bagration's approach pairs above — built
  // from the real operational fact that a group's own staff effort on mission day could go toward
  // drilling combat-box discipline or toward the fighter-escort handoff, not fully both; where
  // that effort goes is a genuine and disclosed-as-modeled tradeoff, not a documented order.
  bomberDirective43: [
    {
      id: "holdTheBox",
      name: "Hold the Box Together",
      subtitle: "Drill formation discipline over the exact rendezvous timing",
      note: "Put the effort into keeping the box tight end to end. Effort in Combat Box Discipline carries further; effort in Fighter Escort Coordination carries less, left to work the handoff with whatever timing the escort already has.",
      modifiers: { formation: 0.7, escort: -0.5 },
      reportLine: "The effort goes into holding the box tight rather than perfecting the escort handoff.",
    },
    {
      id: "exactRendezvous",
      name: "Time the Rendezvous Exactly",
      subtitle: "Drill the escort handoff over formation discipline",
      note: "Put the effort into making the fighter handoff as precise as the range allows. Effort in Fighter Escort Coordination carries further; effort in Combat Box Discipline carries less, left to hold together with whatever discipline the groups already have.",
      modifiers: { escort: 0.7, formation: -0.5 },
      reportLine: "The effort goes into the escort handoff rather than drilling the box's own discipline.",
    },
  ],
  // Round 21, Sedan. The one real, documented alternative: the air plan was first a single
  // concentrated bombardment of about twenty minutes before H-hour, then replaced by continuous
  // attacks in small formations from 08:00 to 16:00 (Wikipedia, Battle of Sedan (1940), citing
  // Hooton and Frieser). Modeled as a tradeoff, disclosed: the corps' limited fire-control effort
  // went into one or the other.
  sedan40: [
    {
      id: "rollingAttack",
      name: "Rolling Air Attack All Day",
      subtitle: "Small waves over the bunkers from first light, so the defenders never settle",
      note: "Keep the bombers coming in small formations hour after hour, as the corps actually did. Effort in Air Attack carries further; effort in Artillery Preparation carries less, the guns fighting for fire-control attention with the aircraft overhead.",
      modifiers: { air: 0.7, guns: -0.5 },
      reportLine: "Small formations of bombers go over the bunkers hour after hour, and the French never get a quiet minute.",
    },
    {
      id: "singleBlow",
      name: "One Great Blow at H-Hour",
      subtitle: "Hold the weight back and hit the river line with everything in a short, heavy strike",
      note: "Save the effort for a short, heavy preparation timed to the crossing, as the first air plan intended. Effort in Artillery Preparation carries further; effort in Air Attack carries less, the aircraft idle for most of the day.",
      modifiers: { guns: 0.7, air: -0.5 },
      reportLine: "Nothing flies until the great strike goes in just before the boats go down to the water.",
    },
  ],
  // Round 21, Moscow. A modeled tradeoff, disclosed like Bagration's and PQ-17's pairs: the real
  // facts are the two main attack areas (the northern sector at Klin and Solnechnogorsk, the
  // southern at Tula) and a railway net that could not feed every sector at once; where the
  // weight went between them is a tradeoff, not a documented order.
  moscow41: [
    {
      id: "twoBlows",
      name: "Two Great Blows at the Flanks",
      subtitle: "Mass the new armies at Klin in the north and Tula in the south",
      note: "Put the weight of the fresh armies into two concentrated thrusts. Effort in Fresh Rifle Armies carries further; effort in Air Cover carries less, thinned across the two sectors.",
      modifiers: { reserves: 0.7, air: -0.5 },
      reportLine: "The new armies go in as two massed blows, one at each flank of the German salient.",
    },
    {
      id: "railPriority",
      name: "A Wide Front, Rail Priority",
      subtitle: "Spread the attack and give the railway's capacity first call on ammunition and clothing",
      note: "Attack on a wider front and feed it. Effort in Rail & Winter Supply carries further; effort in Fresh Rifle Armies carries less, spread over more ground.",
      modifiers: { supply: 0.7, reserves: -0.5 },
      reportLine: "The attack goes in along a wide front, and the railway's trains are given over to shells and winter clothing first.",
    },
  ],
  // Round 21, Battle of Britain Day. The real tension, documented: Park favoured squadron-sized
  // interceptions and complained that No. 12 Group was not covering 11 Group's airfields in
  // time (Wikipedia, Keith Park; Trafford Leigh-Mallory); on 15 September he asked for 12 Group's
  // help and the Duxford Wing was scrambled. Where the staff effort goes between them is the
  // disclosed-as-modeled tradeoff.
  britainDay40: [
    {
      id: "smallSquadrons",
      name: "Meet Them in Squadron Strength",
      subtitle: "Park's practice — scramble fast, meet each raid forward, in small formations",
      note: "Fight the raids with 11 Group's own squadrons, in the numbers each raid needs and no more. Effort in 11 Group Squadrons carries further; effort in the Duxford Wing carries less, held off until it is wanted.",
      modifiers: { squadrons: 0.7, wing: -0.5 },
      reportLine: "11 Group's squadrons go up in pairs and sections to meet each raid well forward of London.",
    },
    {
      id: "callTheWing",
      name: "Call 12 Group In Early",
      subtitle: "Ask the Duxford Wing to cover the capital while 11 Group meets the first blow",
      note: "Ask 12 Group to come south at the first warning, so there are more fighters over the capital. Effort in Duxford Wing carries further; effort in 11 Group Squadrons carries less, held back to cover the sector stations.",
      modifiers: { wing: 0.7, squadrons: -0.5 },
      reportLine: "Park calls on 12 Group at the first warning, and the Duxford Wing climbs south toward London.",
    },
  ],
  // Round 21, the Alps. Modeled tradeoff, disclosed: the documented fact is a main attack in the
  // north (the Little St Bernard) with a secondary advance along the coast (Wikipedia, Italian
  // invasion of France); the old Austro-Hungarian guns and the single road with its bridges down
  // make the choice between massing on one road and spreading across the valleys a real one.
  alps40: [
    {
      id: "oneRoad",
      name: "Mass on the Little St Bernard",
      subtitle: "Put everything behind the main thrust the 4th Army is making",
      note: "Keep to one road and make it count. Effort in Alpini & Infantry Assault carries further; effort in Mules & Mountain Roads carries less, one road and one trail carrying everything.",
      modifiers: { assault: 0.7, supply: -0.5 },
      reportLine: "Everything goes up the Little St Bernard road behind the main thrust.",
    },
    {
      id: "wholeFront",
      name: "Press Every Valley at Once",
      subtitle: "Spread the guns and attack across the whole front, as the orders require",
      note: "Attack at every pass and let the guns range across the whole front. Effort in Corps Artillery carries further; effort in Alpini & Infantry Assault carries less, spread across more valleys.",
      modifiers: { artillery: 0.7, assault: -0.5 },
      reportLine: "The attack goes in at every pass at once and the guns range across the whole front.",
    },
  ],
  // Round 23: the second ring's approach pairs, modeled tradeoffs between the arms.
  uranus: [
    {
      id: "deepRing",
      name: "Seal the Ring Far Out",
      subtitle: "Send the mobile corps deep, to the Don and beyond",
      note: "Push the tank and cavalry corps as deep as they will go, to trap the whole army. Effort in Tank & Cavalry Corps carries further; effort in Rail & Ammunition Dumps carries less, the corps running far ahead of the railheads.",
      modifiers: { armour: 0.7, supply: -0.5 },
      reportLine: "The mobile corps run far ahead of the railheads, for the Don.",
    },
    {
      id: "nearRing",
      name: "Seal the Ring Near the City",
      subtitle: "Keep the pincers close and trap the garrison",
      note: "Keep the pincers shorter and tighter. Effort in Breakthrough Armies carries further; effort in Tank & Cavalry Corps carries less, held to a shorter reach.",
      modifiers: { breakthrough: 0.7, armour: -0.5 },
      reportLine: "The pincers are kept short and close to the city.",
    },
  ],
  dynamo40: [
    {
      id: "useTheMole",
      name: "Work the Mole and the Harbour",
      subtitle: "Load the big ships alongside the east mole",
      note: "Put the weight of the lift into the destroyers and passenger ships at the mole. Effort in Destroyers & the Mole carries further; effort in Small Craft & the Beaches carries less, the boats left to work alone.",
      modifiers: { navy: 0.7, smallCraft: -0.5 },
      reportLine: "The big ships load alongside the east mole, one after another.",
    },
    {
      id: "workTheBeaches",
      name: "Work the Open Beaches",
      subtitle: "Put the small craft to the sand",
      note: "Spread the lift along the beaches, with boats ferrying men out to the waiting ships. Effort in Small Craft & the Beaches carries further; effort in Destroyers & the Mole carries less, the big ships waiting offshore.",
      modifiers: { smallCraft: 0.7, navy: -0.5 },
      reportLine: "The small boats run in to the beaches and ferry men out to the waiting ships.",
    },
  ],
  epirus40: [
    {
      id: "feedTheReserve",
      name: "Feed the Reserve in at Once",
      subtitle: "Put every division across the Adriatic into the line",
      note: "Throw every division into the line as it lands. Effort in Reserve Divisions from Italy carries further; effort in Ports & Mountain Tracks carries less, the tracks choked by the divisions arriving.",
      modifiers: { reserves: 0.7, ports: -0.5 },
      reportLine: "Every division that lands goes straight into the line.",
    },
    {
      id: "mountainLine",
      name: "Hold the Mountain Line with the Alpini",
      subtitle: "Let the mountain troops hold the heights",
      note: "Hold the heights with the mountain troops and keep the new divisions behind them. Effort in Alpini & Mountain Troops carries further; effort in Reserve Divisions from Italy carries less, held back behind the line.",
      modifiers: { alpini: 0.7, reserves: -0.5 },
      reportLine: "The Alpini hold the heights while the reserve divisions wait behind them.",
    },
  ],
  crete41: [
    {
      id: "concentrateMaleme",
      name: "Concentrate on Maleme",
      subtitle: "Make the western airfield the main effort",
      note: "Put the weight into the drop at Maleme, and win the airfield first. Effort in The Paratroop Drop carries further; effort in The Sea Convoys carries less, left to sail without the air effort.",
      modifiers: { paratroops: 0.7, sea: -0.5 },
      reportLine: "The weight of the drop goes to Maleme and its airfield.",
    },
    {
      id: "spreadThree",
      name: "Strike All Three Objectives at Once",
      subtitle: "Drop at Maleme, Rethymno and Heraklion together",
      note: "Strike every airfield at once, so that the garrison cannot reinforce one from another. Effort in Mountain Troops by Air-Landing carries further, with more fields to land on; effort in The Paratroop Drop carries less, thinned across three drop zones.",
      modifiers: { mountain: 0.7, paratroops: -0.5 },
      reportLine: "The paratroopers drop on all three airfields together.",
    },
  ],
  bastogne44: [
    {
      id: "rapidWheel",
      name: "The Rapid Wheel",
      subtitle: "Attack at once with what is to hand",
      note: "Strike north in forty-eight hours, as Patton promised. Effort in The Armoured Spearhead carries further; effort in Infantry Divisions on the Shoulders carries less, the infantry left to catch up.",
      modifiers: { armour: 0.7, infantry: -0.5 },
      reportLine: "Third Army swings north at once, with the armour in front.",
    },
    {
      id: "twoCorpsWeight",
      name: "Two Corps in Strength",
      subtitle: "Wait to bring two corps into line",
      note: "Take the time to bring up the weight of two corps. Effort in Infantry Divisions on the Shoulders carries further; effort in The Armoured Spearhead carries less, held to the infantry's pace.",
      modifiers: { infantry: 0.7, armour: -0.5 },
      reportLine: "Third Army waits to bring two corps into line before it moves.",
    },
  ],
  matapan41: [
    {
      id: "keepConcentrated",
      name: "Keep the Fleet Together",
      subtitle: "Run for home with the fleet concentrated",
      note: "Keep every ship in company and make for port. Effort in The Battle Fleet carries further; effort in The Cruiser Divisions carries less, tied to the fleet's pace.",
      modifiers: { battle: 0.7, cruisers: -0.5 },
      reportLine: "The fleet holds together and makes for home.",
    },
    {
      id: "detachTheCruisers",
      name: "Detach the Cruisers to Help",
      subtitle: "Send the cruiser divisions to help whatever is crippled",
      note: "Let the cruisers go back to help a damaged ship. Effort in The Cruiser Divisions carries further; effort in The Battle Fleet carries less, left with fewer ships around it.",
      modifiers: { cruisers: 0.7, battle: -0.5 },
      reportLine: "The cruiser divisions are detached to help the damaged ship.",
    },
  ],
  // Round 25 (Craig's item 9). Each pair is a modeled tradeoff between two arms, disclosed like the pairs above: the
  // documented fact is the tension, not two named historical plans.
  //  - Monte Lungo: the American plan was an attack in the morning mist; the second attack, on 16 December, went in
  //    behind a careful bombardment (Italian Wikipedia, Battaglia di Montelungo).
  //  - Filottrano: the Italian Corps had few vehicles and the Polish corps the tanks and guns (Italian Wikipedia,
  //    Battaglia di Filottrano).
  //  - The Senio: V Corps' fire plan against the speed of the infantry's crossing (Wikipedia, Spring 1945 offensive in Italy).
  //  - Brody: Directive No. 3's deep concentric strike toward Lublin against a blow at the German spearhead where it
  //    stood, which is what Kirponos is recorded as having wanted (Wikipedia, Battle of Brody (1941)).
  //  - Vyazma: horsemen and paratroopers sent deep, or the armies breaking the line wide first.
  monteLungo43: [
    {
      id: "underTheMist",
      name: "Go In Under the Mist",
      subtitle: "The American plan: the infantry up the hill at first light",
      note: "Send the infantry up the hill while the mist hides them, as II Corps' plan required. Effort in the 67th Infantry Regiment carries further; effort in Guns & Mortars carries less, the batteries asked to fire blind through the mist.",
      modifiers: { infantry: 0.7, guns: -0.5 },
      reportLine: "The infantry go up the hill in the mist, with the guns held back for whatever they find.",
    },
    {
      id: "gunsFirst",
      name: "Let the Guns Work First",
      subtitle: "Wait for the mist to lift and fire the hill in",
      note: "Hold the infantry at the start line and let the guns and mortars range the slope as the mist lifts. Effort in Guns & Mortars carries further; effort in the 67th Infantry Regiment carries less, kept waiting at the foot of the hill.",
      modifiers: { guns: 0.7, infantry: -0.5 },
      reportLine: "The infantry wait at the foot of the hill while the guns and mortars range the slope.",
    },
  ],
  adriaticRoad44: [
    {
      id: "nemboLeads",
      name: "The Nembo Leads",
      subtitle: "Paratroopers up the hills first, the tanks behind them",
      note: "Send the Nembo up the ridges first and keep the Polish tanks on the road behind. Effort in Nembo Paratroops carries further; effort in Polish Armour carries less, held to the roads until the hills are cleared.",
      modifiers: { nembo: 0.7, armour: -0.5 },
      reportLine: "The Nembo goes up into the hills first, with the Polish tanks waiting on the road behind it.",
    },
    {
      id: "gunsFirst",
      name: "The Guns Clear the Ridges First",
      subtitle: "Bombard the line, as the town was bombarded on 8 July, before the paratroopers move",
      note: "Let the Polish and Italian artillery bombard the ridges first and hold the paratroopers until the shells have done their work. Effort in Corps Artillery carries further; effort in Nembo Paratroops carries less, held back until the bombardment is over.",
      modifiers: { artillery: 0.7, nembo: -0.5 },
      reportLine: "The corps artillery bombards the ridges first, and the Nembo waits for the shells to stop.",
    },
  ],
  springOffensive45: [
    {
      id: "barrageFirst",
      name: "The Barrage Goes First",
      subtitle: "The fire plan clears the bank before the infantry cross",
      note: "Hold the infantry on the near bank until the barrage has lifted, and let the fire plan do the clearing. Effort in Bombers & Guns carries further; effort in Cremona Infantry carries less, kept back until the shells have stopped.",
      modifiers: { fire: 0.7, assault: -0.5 },
      reportLine: "The bombers and guns go first, and the infantry wait for the barrage to lift.",
    },
    {
      id: "infantryLeads",
      name: "The Infantry Cross on the Barrage's Heels",
      subtitle: "Go over close behind the last shells, before the Germans are out of their dugouts",
      note: "Send the infantry over the moment the barrage lifts, close behind the last shells. Effort in Cremona Infantry carries further; effort in Bombers & Guns carries less, the fire plan spent before the men are across.",
      modifiers: { assault: 0.7, fire: -0.5 },
      reportLine: "The infantry go over the bank on the heels of the last shells.",
    },
  ],
  brodyCounterstroke41: [
    {
      id: "strikeForLublin",
      name: "Strike for Lublin",
      subtitle: "Directive No. 3: deep concentric blows by the 5th and 6th Armies",
      note: "Carry out the directive as written: the tank corps drive deep toward Lublin and the rest follow. Effort in Mechanized Corps carries further; effort in Orders & Signals carries less, the corps running far ahead of the front's staff and its telephone lines.",
      modifiers: { armour: 0.7, signals: -0.5 },
      reportLine: "The tank corps drive deep toward Lublin, outrunning the front's staff.",
    },
    {
      id: "hitTheSalient",
      name: "Hit the Spearhead Near Dubno",
      subtitle: "Kirponos's way: strike the German thrust where it is, not where Lublin is",
      note: "Use the corps against the German spearhead near Dubno, Lutsk and Brody, and keep the staff's grip on them. Effort in Orders & Signals carries further; effort in Mechanized Corps carries less, held to a shorter reach.",
      modifiers: { signals: 0.7, armour: -0.5 },
      reportLine: "The corps are turned on the German spearhead near Dubno, on a shorter reach and a tighter rein.",
    },
  ],
  rzhevVyazma42: [
    {
      id: "rideDeep",
      name: "Ride Deep, Close the Ring Behind",
      subtitle: "Cavalry and paratroopers first, the armies following",
      note: "Send the cavalry and the airborne corps on ahead as the plan says, and let the armies follow through the gap. Effort in Cavalry Corps carries further; effort in Pincer Armies carries less, spread behind the horsemen along the corridor.",
      modifiers: { cavalry: 0.7, armies: -0.5 },
      reportLine: "The cavalry ride on ahead, and the armies follow along the corridor behind them.",
    },
    {
      id: "widenFirst",
      name: "Widen the Gap First",
      subtitle: "The armies break the line wide before anyone rides through",
      note: "Hold the cavalry until the armies have widened the gap and secured its shoulders. Effort in Pincer Armies carries further; effort in Cavalry Corps carries less, kept waiting behind the line.",
      modifiers: { armies: 0.7, cavalry: -0.5 },
      reportLine: "The armies break the line wide first, and the cavalry wait behind them for the gap.",
    },
  ],
  // Round 26 (item 1). Each pair is a modeled tradeoff between two arms, disclosed like the pairs above: the documented
  // fact is the tension, not two named historical plans.
  //  - Kiev: the two panzer groups closing the ring on their own, or the infantry armies squeezing it from every side
  //    (the ring was closed by the tanks on 16 September, and held by the infantry; Wikipedia, Battle of Kiev (1941)).
  //  - Kharkov: the flank blow by the panzer armies, or the SS divisions going for the city (Wikipedia, Third Battle of
  //    Kharkov).
  //  - The Ardennes: the northern route by the Sixth SS Panzer Army, which was the plan, or the centre, where the Fifth
  //    Panzer Army found the thinnest line (Wikipedia, Battle of the Bulge).
  //  - Kursk: the belts held as laid out, or the tank reserve held ready for a counterstroke (Wikipedia, Battle of Kursk).
  //  - Stalingrad: the close-quarters doctrine, or the guns on the east bank doing the work (Wikipedia, Battle of
  //    Stalingrad).
  //  - Seelow: the tank armies on the first day, as Zhukov had them, or the rifle armies breaking in first
  //    (Wikipedia, Battle of the Seelow Heights).
  kievPocket41: [
    {
      id: "closeTheRing",
      name: "Close the Ring Early",
      subtitle: "Both panzer groups drive to the meeting-point",
      note: "Send both panzer groups at the gap between them as fast as they can go, as the directive wanted. Effort in the two panzer groups carries further; effort in the Infantry Armies carries less, left to follow on foot.",
      modifiers: { northPincer: 0.7, southPincer: 0.7, infantry: -0.5 },
      reportLine: "Both panzer groups drive for the meeting-point, and the infantry follow as best they can.",
    },
    {
      id: "squeezeFromAllSides",
      name: "Squeeze It From Every Side",
      subtitle: "The infantry armies close in while the panzers hold the outer ring",
      note: "Let the infantry armies press the Soviet front while the panzer groups close more slowly behind. Effort in the Infantry Armies and the Luftwaffe carries further; effort in the two panzer groups carries less, held on the outer ring.",
      modifiers: { infantry: 0.7, air: 0.4, northPincer: -0.5, southPincer: -0.4 },
      reportLine: "The infantry armies press in from the west while the panzer groups close the outer ring.",
    },
  ],
  kharkovBackhand43: [
    {
      id: "flankFirst",
      name: "Strike the Flank First",
      subtitle: "The panzer armies cut off the spearheads before the city",
      note: "Send the 4th and 1st Panzer Armies into the flank of the Soviet spearheads first, as Manstein planned. Effort in the Panzer Armies and the Fourth Air Fleet carries further; effort in the SS Panzer Corps carries less, held back from the city.",
      modifiers: { panzerArmy: 0.7, ssCorps: -0.4, air: 0.5 },
      reportLine: "The panzer armies go into the flank of the Soviet spearheads, and the SS divisions wait at the edge of the city.",
    },
    {
      id: "cityFirst",
      name: "Retake the City First",
      subtitle: "The SS divisions go for Kharkov at once",
      note: "Send the SS Panzer Corps into Kharkov at once, because the city is what Hitler wants back. Effort in the SS Panzer Corps and the Infantry Holding the Line carries further; effort in the Panzer Armies carries less, kept to the flank.",
      modifiers: { ssCorps: 0.7, panzerArmy: -0.5, infantry: 0.5 },
      reportLine: "The SS divisions are sent into Kharkov while the panzer armies hold the flank.",
    },
  ],
  ardennesWacht44: [
    {
      id: "northernWeight",
      name: "The Northern Route",
      subtitle: "The main weight on the Sixth SS Panzer Army, as the plan had it",
      note: "Put the main weight on the Sixth SS Panzer Army on the northern shoulder, as Hitler's plan required. Effort in the Sixth SS Panzer Army carries further; effort in the Fifth Panzer Army carries less, kept as the second effort.",
      modifiers: { sixthSS: 0.7, fifthPanzer: -0.5, seventhArmy: 0 },
      reportLine: "The main weight goes to the Sixth SS Panzer Army on the northern shoulder.",
    },
    {
      id: "centreWeight",
      name: "The Centre",
      subtitle: "The weight where the line is thinnest",
      note: "Put the main weight on the Fifth Panzer Army in the centre, where the American line is thinnest. Effort in the Fifth Panzer Army and the Seventh Army carries further; effort in the Sixth SS Panzer Army carries less, held as the second effort.",
      modifiers: { fifthPanzer: 0.7, seventhArmy: 0.3, sixthSS: -0.5 },
      reportLine: "The main weight goes to the Fifth Panzer Army in the centre, where the American line is thinnest.",
    },
  ],
  kurskSoviet43: [
    {
      id: "holdTheBelts",
      name: "Hold the Belts",
      subtitle: "Fight the whole defence in the belts, as Zhukov planned",
      note: "Fight the battle in the belts as they were laid out, and keep the tank reserve back. Effort in the Anti-Tank Guns and Minefields and the Rifle Armies carries further; effort in the Tank Reserve carries less, held behind the second belt.",
      modifiers: { antiTank: 0.7, infantry: 0.3, tanks: -0.6 },
      reportLine: "The defence is fought in the belts, and the tank reserve is held behind the second one.",
    },
    {
      id: "counterstrokeReady",
      name: "Keep the Counterstroke Ready",
      subtitle: "The tank reserve forward, close behind the belts",
      note: "Bring the tank reserve right up behind the belts and keep it ready to move. Effort in the Tank Reserve and the Air Armies carries further; effort in the Anti-Tank Guns and Minefields carries less, because the guns that are not there to hold the belts must be made up by the tanks.",
      modifiers: { tanks: 0.7, air: 0.3, antiTank: -0.5 },
      reportLine: "The tank reserve is brought up close behind the belts, ready to move.",
    },
  ],
  stalingradCity42: [
    {
      id: "huggingThem",
      name: "Hug Them",
      subtitle: "Fight at grenade range, so that their aircraft and guns cannot be used",
      note: "Hold the ruins as close to the Germans as possible so that the Luftwaffe and the German guns cannot fire without hitting their own men. Effort in the Assault Groups carries further; effort in the East-Bank Artillery carries less, because the guns cannot fire where the fronts are touching.",
      modifiers: { groups: 0.7, guns: -0.5 },
      reportLine: "The assault groups are put in among the Germans, so close that the guns cannot fire on them without hitting their own.",
    },
    {
      id: "gunsFromTheBank",
      name: "Let the Guns Do It",
      subtitle: "The east-bank artillery fires the Germans out of the ruins",
      note: "Hold a line a little back from the Germans and let the artillery on the east bank range the ruins in front of it. Effort in the East-Bank Artillery and the Ferries carries further; effort in the Assault Groups carries less, kept out of the ruins in front of the line.",
      modifiers: { guns: 0.7, ferries: 0.2, groups: -0.5 },
      reportLine: "The line is held a little back, and the guns on the east bank range the ruins in front of it.",
    },
  ],
  seelow45: [
    {
      id: "tanksOnTheFirstDay",
      name: "Tanks on the First Day",
      subtitle: "The tank armies go in behind the barrage, as Zhukov ordered",
      note: "Send the tank armies in behind the barrage on the first day, as Zhukov's plan ordered. Effort in the Tank Armies carries further; effort in the Rifle Armies carries less, left to share the roads with the tanks.",
      modifiers: { tanks: 0.7, rifle: -0.5 },
      reportLine: "The tank armies go forward behind the barrage on the first day, and the infantry share the roads with them.",
    },
    {
      id: "infantryBreaksIn",
      name: "The Infantry Break In First",
      subtitle: "The rifle armies take the heights, and the tanks wait",
      note: "Let the rifle armies break into the line first, with the barrage in front of them, and hold the tank armies back until the heights are taken. Effort in the Rifle Armies and the Opening Barrage carries further; effort in the Tank Armies carries less, held back on the roads.",
      modifiers: { rifle: 0.6, barrage: 0.6, tanks: -0.6 },
      reportLine: "The rifle armies break into the line behind the barrage, and the tank armies are held back.",
    },
  ],
};

// Round 9, Craig's item #1 (the "one best play" problem: with fixed multipliers, Hoth +
// Spearhead + Armour was the answer every time once learned). Each battle now secretly draws one
// enemy posture at the moment the Order of Battle screen opens; it multiplies that category's
// WHOLE per-chit weight, commander and approach bonuses included (the enemy blunts an arm no
// matter who leads it — an earlier draft multiplied only the base effectiveness, and hand-
// simulation showed the flat commander/approach adds then kept Hoth + Spearhead + Armour the
// best plan under every posture, i.e. it didn't fix the problem it was built for). Tuned so each
// posture has a different best plan in both battles (round-9 spec has the enumeration). It is
// hinted at, never stated, by one line of intelligence on the planning screen. It's revealed as a "contact" beat
// at the start of the battle report — before the mid-battle reserve decision, so the player can
// respond to it with reserves. Every posture is a real option the defender historically had or
// took, verified 2026-09-21:
//  Kursk — Wikipedia, Operation Citadel / Battle of Prokhorovka / Pakfront: belts built around
//   anti-tank ditches and gun emplacements (the Pakfront: mutually covering AT-gun groups); three
//   Soviet air armies (2nd, 16th, 17th) committed, the 2nd and 17th on the southern face; the
//   Steppe Front "held back east of the salient until the time was right for the Soviet
//   counteroffensive."
//  Omaha — Wikipedia, Omaha Beach: the 352nd Division, "believed to be 30 kilometers inland at
//   Saint-Lô," was on the coast (the historical posture; its move was known to First Army by
//   June 4 but "no plans were changed"); the bombers "overshot their targets and only three bombs
//   fell near the beach area"; and the thin coastal line the planners actually expected ("a
//   reinforced 716th Infantry Division battalion").
// Field is `name`, not `label`, for the same ENDINGS_GALLERY-regex reason as the categories.
const KEY_BATTLE_POSTURES = {
  kursk: [
    {
      id: "antiTankFirst",
      name: "Anti-tank belts first",
      modifiers: { armour: 0.5, supply: 1.35 },
      hints: [
        "Air reconnaissance photographs fresh anti-tank ditches and gun pits across the first belt.",
        "Deserters describe anti-tank guns sited in clusters, each group covering the next.",
      ],
      reveal: "Contact: the first belt is an anti-tank gun line in mutually covering groups. The tanks are driving into the teeth of it.",
    },
    {
      id: "airForward",
      name: "Air armies forward",
      modifiers: { air: 0.5, armour: 0.8, divisions: 1.3 },
      hints: [
        "Signals intercepts show new air regiments arriving on the fields behind the southern face.",
        "Luftwaffe crews report more Soviet fighters over the line every day this week.",
      ],
      reveal: "Contact: the Soviet air armies are up in strength over the southern face. The sky is not ours.",
    },
    {
      id: "reservesDeep",
      name: "Armour held deep",
      modifiers: { armour: 1.3, divisions: 0.9, supply: 0.9 },
      hints: [
        "Agents report Soviet tank armies far back, east of the salient, not at the front.",
        "The forward belts look light on armour. The tanks are somewhere else.",
      ],
      reveal: "Contact: the Soviet armour is held far back, east of the salient. The forward belts are thinner than feared, for now.",
    },
  ],
  omaha: [
    {
      id: "fieldDivision",
      name: "A field division on the bluffs",
      // Round 10 (item 7): the historical posture is drawn twice as often as either alternative.
      weight: 2,
      modifiers: { waves: 0.6, naval: 0.8, engineers: 1.25 },
      hints: [
        "A report relayed through First Army two days ago: another German division may have moved up to this coast.",
        "Prisoners taken at the shingle are not from the coastal division we were briefed on.",
      ],
      reveal: "Contact: the bluffs are held by a full field division, the 352nd, which the briefings placed inland at Saint-Lô.",
    },
    {
      id: "strongpointsIntact",
      name: "Strongpoints untouched",
      modifiers: { engineers: 0.6, naval: 1.35, air: 0.8 },
      hints: [
        "Bomber crews report solid overcast over the target. Results unobserved.",
        "The strongpoints at the mouths of the draws are firing as if the bombing never happened.",
      ],
      reveal: "Contact: the bombing missed. Every strongpoint at the draws is intact and firing.",
    },
    {
      id: "thinGarrison",
      name: "The thin coastal line",
      modifiers: { waves: 1.4, naval: 0.85 },
      hints: [
        "Photo interpretation still shows only the coastal division's positions along these bluffs.",
        "Fire from the bluffs is heavy at the draws and noticeably lighter between them.",
      ],
      reveal: "Contact: it's the thin coastal line the planners expected. The fire is concentrated at the draws.",
    },
  ],
  // Round 15, battle #3. Grounded in the two well-established, uncontroversial facts about this
  // encirclement rather than a fresh granular-numbers verification pass the way Kursk/Omaha's
  // postures were: Operation Uranus's double envelopment left the Soviets building outward from
  // two separate fronts — one facing the pocket, one facing away from it against exactly the kind
  // of relief or breakout attempt this battle models — and the southern Russian steppe in late
  // November was already deep into the harsh continental winter that later defined the whole
  // campaign's popular memory. No specific unit numbers or named formations invented here, same
  // "illustrative, not individually sourced" bar this file already holds its flashup text to.
  stalingrad: [
    {
      id: "ringHardening",
      name: "The outer ring is already forming",
      weight: 2,
      // armour at 1.0 (not dampened like the other categories): a hardening ring is a race against
      // time, not a fortification the armoured spearhead has to grind through yet — it's still the
      // one force fast enough to hit the ring before it's finished, which is exactly Hube's own
      // argument in the flavor text above. Balance-tuned per tools/check-battle-balance.js (round
      // 15): at pool=5 the original 0.85 left full concentration on armour and a one-chit hedge
      // scoring within rounding of each other, since every category here is dampened and the
      // absolute weight gap stayed too thin to survive Math.round — this keeps the "ring hardening
      // hurts everyone" read for every other category while giving the actually-favored one enough
      // separation to price a hedge correctly.
      modifiers: { divisions: 0.6, supply: 0.7, armour: 1.0 },
      hints: [
        "Reconnaissance reports fresh Soviet formations digging in facing west, away from the pocket, not just around it.",
        "A patrol that found open ground yesterday reports the same stretch entrenched this morning.",
      ],
      reveal: "Contact: the outer ring is forming faster than hoped — this isn't a cordon around a pocket anymore, it's a front facing both ways.",
    },
    {
      id: "softSpot",
      name: "A gap that hasn't closed yet",
      modifiers: { armour: 1.3, divisions: 1.2, supply: 0.9 },
      hints: [
        "A returning patrol reports a stretch of the ring with no organized position at all, just outposts.",
        "Prisoners taken west of the pocket describe units still arriving, not yet dug in.",
      ],
      reveal: "Contact: there's a real gap, for now — a stretch of the ring that's outposts and arriving units, not a finished line.",
    },
    {
      id: "deepWinter",
      name: "Winter takes both sides",
      // divisions at 1.05 (fractionally above 1.0, everything else still dampened): infantry
      // moving under their own power on foot are the one thing the cold doesn't stop cold the way
      // it does aircraft, engines, and a fuel column — same balance-tuning note as ringHardening's
      // armour above (round 15, tools/check-battle-balance.js) — the original 0.9 left the same
      // rounding tie between full concentration and a one-chit hedge at pool=5.
      modifiers: { air: 0.5, armour: 0.8, divisions: 1.05, supply: 1.0 },
      hints: [
        "The forecast the staff meteorologist won't put a number on, except to say it's worse than yesterday.",
        "Vehicles that started this morning without trouble won't start again without being run all night.",
      ],
      reveal: "Contact: the cold is the enemy tonight as much as the Red Army is — aircraft grounded, engines failing to start, the column moving slower than the plan allowed for.",
    },
  ],
  // Round 15, battle #4 (Alam Halfa). Three sourced facts about how the actual attempt broke
  // down (Wikipedia, Battle of Alam el Halfa; historyofwar.org, Battle of Alam Halfa): the
  // minefields were deeper than reconnaissance judged; the Desert Air Force flew hundreds of
  // sorties against the exposed column once daylight caught it; and Montgomery had ordered his
  // armour to stay in fixed, dug-in hull-down positions and let the panzers come to them, a
  // deliberate break from the desert war's earlier maneuver doctrine. Balance-tuned the same way
  // as Stalingrad's postures above (tools/check-battle-balance.js, round 15): the category each
  // posture actually favors sits above 1.0 while the rest stay dampened, so a full concentration
  // on it clears a one-chit hedge by more than Math.round's rounding tolerance at pool=5 — supply
  // under hullDownLine needed a fuller 1.25 rather than a fractional bump, since it carries no
  // commander and no approach bonus at all here, and so had less raw weight to spread that gap
  // with than armour or divisions do under their own postures.
  elAlamein: [
    {
      id: "deepMinefields",
      name: "The belts run deeper than briefed",
      weight: 2,
      modifiers: { divisions: 0.65, armour: 0.9, supply: 0.75 },
      hints: [
        "Engineers report the first belt running deeper than the reconnaissance photos showed.",
        "A cleared lane from last week's patrol reports fresh mines laid back into it overnight.",
      ],
      reveal: "Contact: the belts are deeper than briefed — what looked like a thin screen is a real minefield, and it's already past the hour the plan needed to be through it by.",
    },
    {
      id: "airSuperiority",
      name: "The sky never changed hands",
      modifiers: { air: 0.4, supply: 0.75, divisions: 0.9 },
      hints: [
        "Reconnaissance reports the Desert Air Force flying at a tempo that hasn't let up since Gazala.",
        "Forward units report aircraft finding them well before the column expected to be seen.",
      ],
      reveal: "Contact: the sky never changed hands — the Desert Air Force is over the column in daylight strength, and the plan's whole logic was not to still be moving when that happened.",
    },
    {
      id: "hullDownLine",
      name: "The ridge isn't maneuvering",
      modifiers: { armour: 0.6, divisions: 0.75, supply: 1.35 },
      hints: [
        "Prisoners describe orders to hold fixed positions and let the attack come to them, not to counter-charge.",
        "The armor on the ridge hasn't moved from its dug-in line since first contact was reported.",
      ],
      reveal: "Contact: the ridge isn't maneuvering — the tanks up there are dug in hull-down behind their own guns, waiting, the way this army usually makes the British wait.",
    },
  ],
  // Round 15, battle #5 (Monte Marrone). Three sourced facts (Wikipedia, Battle of Monte
  // Marrone): the peak's German garrison turned out to be reinforced by three Gebirgsjäger —
  // German mountain-specialist — battalions on 10 April, a harder counterattack than the
  // exploratory and dawn attacks of 2 and 3 April; the peak itself was taken by surprise on 31
  // March, meaning the initial defense was thinner than a fully alerted position would have
  // been; and the position sits at 1,805 meters in the Mainarde range, real high-altitude
  // mountain terrain regardless of the exact weather on any given night. Balance-tuned the same
  // way as the battles above (tools/check-battle-balance.js, round 15): Assault has its own
  // +0.8 commander bonus under Dapino and Artillery has its own approach synergy through "Guns
  // Forward" (see KEY_BATTLE_APPROACHES below), but Paratroops and Supply have neither — so a
  // posture that favors either of those two has to lean on its own multiplier alone to clear the
  // other categories' synergy advantage.
  monteCassino44: [
    {
      id: "gebirgsjagerReserve",
      name: "German mountain troops are moving up, not just garrison",
      weight: 2,
      modifiers: { assault: 0.7, paratroops: 0.75, artillery: 1.2, supply: 0.85 },
      hints: [
        "Prisoners describe fresh mountain-trained units moving into the sector, not the garrison troops briefed.",
        "Reconnaissance reports a column with mule transport of its own moving toward the peak from the German rear.",
      ],
      reveal: "Contact: these aren't garrison troops — Gebirgsjäger, German mountain specialists, are moving up in strength, and the guns are what's going to have to answer them.",
    },
    {
      id: "thinInitialLine",
      name: "The peak isn't fully alerted yet",
      modifiers: { assault: 1.2, paratroops: 0.85, artillery: 0.8, supply: 0.85 },
      hints: [
        "A returning patrol reports the peak's garrison keeping a routine night posture, not an alerted one.",
        "No fresh wire or listening posts have gone in on the approach the plan actually uses.",
      ],
      reveal: "Contact: the peak isn't alerted — whatever's up there is holding a routine night line, not one that's expecting what's coming.",
    },
    {
      id: "highAltitudeCold",
      name: "The mountain is its own enemy tonight",
      modifiers: { assault: 0.6, paratroops: 1.1, artillery: 0.65, supply: 0.55 },
      hints: [
        "The forecast for the peak itself is worse than the valley floor's, and nobody will put a number on how much worse.",
        "A mule train already turned back once tonight, the trail too iced over past a certain height.",
      ],
      reveal: "Contact: the mountain is its own enemy tonight — the cold and the altitude are slowing everything that isn't a small unit moving light.",
    },
  ],
  // Round 15, battle #6 (Minsk). Three sourced facts (Wikipedia, Operation Bagration; Minsk
  // offensive): the double maskirovka held German reserves at Lvov while the real blow fell in
  // Belorussia; Hitler's Feste Plätze order left strongpoints fighting on past the point they
  // could actually be relieved, sometimes harder and longer than the bypass plan assumed; and
  // the pocket east of Minsk, once it started to give, did so as a collapse rather than an
  // orderly withdrawal — the 25th Panzergrenadier's breakout attempt itself dissolved into
  // scattered fragments rather than a coherent fighting retreat. Balance-tuned the same way as
  // the battles above (tools/check-battle-balance.js, round 15).
  bagrationSoviet44: [
    {
      id: "deceptionHolding",
      name: "The reserves are still watching Lvov",
      weight: 2,
      modifiers: { divisions: 1.15, armour: 0.85, air: 0.9, supply: 0.85 },
      hints: [
        "Signals intercepts still show the German reserve armies oriented south, toward Lvov.",
        "No sign yet that Berlin has read this front's own buildup for what it actually is.",
      ],
      reveal: "Contact: the deception is holding — whatever reserves the Germans have left are still watching the wrong front, and this one is wide open in front of the rifle armies.",
    },
    {
      id: "fortifiedResistance",
      name: "The strongpoints are fighting on past sense",
      modifiers: { divisions: 0.7, armour: 1.1, air: 0.85, supply: 0.75 },
      hints: [
        "Prisoners describe orders to hold their positions regardless of what happens on either flank.",
        "A garrison the advance already passed is still fighting rather than surrendering to the follow-on troops.",
      ],
      reveal: "Contact: the fortified towns are fighting on past the point where holding makes any sense — Hitler's own order, and it's slowing the rifle armies more than the tanks that already bypassed it.",
    },
    {
      id: "collapsingCenter",
      name: "The whole front is coming apart at once",
      modifiers: { divisions: 1.1, armour: 0.85, air: 0.9, supply: 0.8 },
      hints: [
        "Reports describe entire regiments surrendering without a fight along stretches of the line.",
        "Radio discipline on the German side has broken down; whole units are transmitting in the clear.",
      ],
      reveal: "Contact: this isn't a defense giving ground anymore, it's a front coming apart — the rifle armies are the ones positioned to take advantage of it fastest.",
    },
  ],
  // Round 15, battle #7 (Anzio). Three sourced facts (Wikipedia, Battle of Anzio): Kesselring's
  // own Operation "Richard" order — Kampfgruppe elements of the 4th Parachute and Hermann Göring
  // Divisions rushed to block the roads to Campoleone and Cisterna — went out at 0500 on landing
  // day itself, hours after the first troops were ashore, which is why it's the weighted,
  // historically-favored posture here; the roads themselves were genuinely open in the landing's
  // first hours, with a patrol reportedly reaching the outskirts of Rome before turning back; and
  // the blocking line the rushed German units formed was real but, by its own rushed nature,
  // thinner than the eight-division ring it became within days. Balance-tuned the same way as the
  // battles above (tools/check-battle-balance.js, round 15).
  anzio44: [
    {
      id: "richardOrder",
      name: "Kesselring's order is already moving",
      weight: 2,
      modifiers: { assault: 1.05, armor: 0.6, rangers: 0.8, naval: 1.0 },
      hints: [
        "Reconnaissance reports German armored cars already moving on the road to Campoleone.",
        "Radio intercepts suggest a corps-level order went out from German headquarters before dawn was fully broken.",
      ],
      reveal: "Contact: Kesselring's own order went out at first light — Kampfgruppe elements of the Hermann Göring and 4th Parachute Divisions are already moving to block the roads to Campoleone and Cisterna, and every hour spent deciding is an hour closer to that order being finished.",
    },
    {
      id: "windowStillOpen",
      name: "The roads haven't closed yet",
      modifiers: { armor: 1.3, assault: 0.85, rangers: 0.95, naval: 0.75 },
      hints: [
        "A jeep patrol reports the road to Campoleone clear for miles, no German positions found.",
        "Forward observers see nothing moving on the approaches to the Alban Hills.",
      ],
      reveal: "Contact: the roads are still open — whatever Kesselring intends, it hasn't reached this stretch of ground yet, and the gap won't stay unwatched forever.",
    },
    {
      id: "thinCordon",
      name: "The blocking line isn't finished",
      modifiers: { rangers: 1.25, assault: 0.9, armor: 0.85, naval: 0.85 },
      hints: [
        "A patrol finds a stretch of the German blocking line thinly held, more outpost than front.",
        "Prisoners describe a scratch force, rushed forward without time to dig in properly.",
      ],
      reveal: "Contact: whatever line the Germans are forming, it isn't finished — a fast-moving element could still find the gap before it closes.",
    },
  ],
  // Round 15, battle #8 (Arnhem). Three sourced facts (Wikipedia, Battle of Arnhem): the
  // Germans cut XXX Corps's single supply road near Koevering on 25 September — the decisive
  // blow, and why it's the weighted, historically-favored posture here; German troops holding
  // the 22 September drop zone used captured British marker panels and flares to lure resupply
  // aircraft to their own positions rather than the perimeter's; and fresh German armor,
  // including Tiger tanks, reached the perimeter's line on 24 September, which is what Major
  // Cain's own 6-pounder engagement that day was fought against. Balance-tuned the same way as
  // the battles above (tools/check-battle-balance.js, round 15).
  arnhemPerimeter44: [
    {
      id: "corridorCut",
      name: "The road behind the column is cut",
      weight: 2,
      // Balance note (tools/check-battle-balance.js, round 15): Poles needed a fuller edge here
      // than a fractional bump gave it — under this posture the corps push is nearly moot and
      // the perimeter holds on largely unchanged, so the Polish crossing is the one lever still
      // worth concentrating on, and its multiplier needed to say so clearly (1.15, not a near-tie
      // with the perimeter's own score) to clear Math.round's rounding tolerance at pool=5.
      modifiers: { corpsPush: 0.6, perimeter: 0.85, resupply: 0.8, poles: 1.15 },
      hints: [
        "Radio traffic from the rear of the column reports German infantry active near Koevering.",
        "A supply convoy due up from Nijmegen hasn't arrived and isn't answering the radio.",
      ],
      reveal: "Contact: the road is cut behind the column — whatever reaches the river now is whatever's already forward of Koevering, and nothing else is getting through today.",
    },
    {
      id: "dropZoneCompromised",
      name: "The drop zone answers to captured markers",
      modifiers: { resupply: 0.55, corpsPush: 0.95, perimeter: 0.9, poles: 1.0 },
      hints: [
        "A pilot reports marker panels on the old drop zone that don't match today's recognition signal.",
        "Ground observers inside the perimeter report supply canisters landing well outside the horseshoe again.",
      ],
      reveal: "Contact: the drop zone answers to the wrong markers now — the Germans are flying our own panels and flares to pull the aircraft onto their own ground, not the perimeter's.",
    },
    {
      id: "freshPanzerReserves",
      name: "Fresh armor is reaching the ring",
      modifiers: { perimeter: 0.65, corpsPush: 0.9, resupply: 0.95, poles: 0.95 },
      hints: [
        "Prisoners describe armor moving up that wasn't in the line yesterday.",
        "A forward post reports the unmistakable sound of heavier tanks somewhere past the tree line.",
      ],
      reveal: "Contact: fresh armor is reaching the ring — heavier than what the perimeter has faced so far, and it's the wire itself that's going to have to answer it.",
    },
  ],
  // Round 15, battle #9 (PQ-17). Three real, period-accurate threat pictures a convoy on this
  // route genuinely faced, not invented ones: coordinated U-boat pack attacks (the Atlantic and
  // Arctic war's defining tactic throughout 1942); Luftwaffe torpedo-bomber strikes from the
  // Norwegian bases within range of this exact track; and a shadowing aircraft holding contact
  // and reporting the convoy's position up the chain — which is, per the sourcing note on the
  // subgame above, genuinely how German surface units (Tirpitz's own group included) would have
  // been vectored onto a target in the first place. Wolfpack concentration is weighted as the
  // single most persistent threat of the underlying tonnage war. Balance-tuned the same way as
  // the battles above (tools/check-battle-balance.js, round 15); Signals Intelligence has
  // neither a commander nor an approach bonus (see KEY_BATTLE_COMMANDERS/KEY_BATTLE_APPROACHES
  // above), so none of these three postures makes it the best play — the same asymmetric-by-
  // design choice as Kursk's Supply or Omaha's Air.
  pq17_1942: [
    {
      id: "wolfpackConcentration",
      name: "A coordinated pack is converging",
      weight: 2,
      modifiers: { escorts: 1.1, aaShips: 0.85, coveringForce: 0.9, intelligence: 0.85 },
      hints: [
        "Hydrophone contacts are being reported on multiple bearings around the convoy's track.",
        "Direction-finding suggests more than one U-boat is shadowing the convoy tonight.",
      ],
      reveal: "Contact: this is a coordinated pack, not a single boat — multiple U-boats are converging on the convoy's track from more than one bearing.",
    },
    {
      id: "luftwaffeStrike",
      name: "Torpedo bombers are massing from Norway",
      // Balance note (tools/check-battle-balance.js, round 15): escorts' own ceiling (a
      // commander AND an approach bonus both) is high enough that AA Auxiliaries — no commander
      // at all — needed escorts dampened hard here, not just below its own multiplier, or the
      // screen stayed the best play under every posture regardless of what the contact was.
      modifiers: { aaShips: 1.2, escorts: 0.6, coveringForce: 0.85, intelligence: 0.8 },
      hints: [
        "Reconnaissance reports torpedo bomber squadrons active from the Norwegian bases today.",
        "A shadowing aircraft has held station longer than a single reconnaissance pass usually takes.",
      ],
      reveal: "Contact: the Luftwaffe is coming in strength — torpedo bombers are forming up from the Norwegian fields, and it's the sky the convoy has to answer first.",
    },
    {
      id: "distantShadow",
      only: 1,
      name: "The convoy is fixed and reported",
      // Same reasoning as luftwaffeStrike above: escorts' own ceiling needed matching dampening
      // here too, or the screen stayed the best play regardless of contact.
      modifiers: { coveringForce: 1.15, escorts: 0.6, aaShips: 0.8, intelligence: 0.9 },
      hints: [
        "A shadowing aircraft has held contact with the convoy for hours without breaking off.",
        "Signals traffic suggests the convoy's position has been reported up the German chain of command.",
      ],
      reveal: "Contact: the convoy is fixed and reported — whatever responds to that report, surface or otherwise, now knows exactly where to look.",
    },
  ],
  // Round 15, battle #10 (Pointblank / Second Schweinfurt). Three real, documented threat
  // pictures this mission genuinely faced, not invented ones: single-engine fighters attacking
  // head-on in abreast waves (the mission's most persistent and sustained threat throughout the
  // route, weighted accordingly); twin-engine Ju 88s firing 21cm rockets from roughly 1,000
  // yards, outside the bombers' own defensive gun range, answerable only by escort fighters
  // reaching them first; and heavy, concentrated flak over the target itself, Schweinfurt being
  // one of the most heavily air-defended cities in Germany, answerable only by a bomb run flown
  // with real discipline rather than rushed to get clear of the barrage. Balance-tuned the same
  // way as the battles above (tools/check-battle-balance.js, round 15); Diversionary Routing has
  // neither a commander nor an approach bonus (see KEY_BATTLE_COMMANDERS/KEY_BATTLE_APPROACHES
  // above), so none of these three postures makes it the best play — the same asymmetric-by-
  // design choice as PQ-17's Signals Intelligence.
  bomberDirective43: [
    {
      id: "headOnWaves",
      name: "Fighters are massing for head-on passes",
      weight: 2,
      modifiers: { formation: 1.1, escort: 0.85, targeting: 0.9, diversion: 0.85 },
      hints: [
        "Reconnaissance reports single-engine fighter wings forming up ahead of the bomber stream's track.",
        "The lead groups report fighters climbing to altitude well out in front of the formation.",
      ],
      reveal: "Contact: single-engine fighters are massing for head-on passes, abreast in waves, exactly where the box's own mutual fire has to answer them.",
    },
    {
      id: "rocketStandoff",
      name: "Twin-engine rocket-carriers are forming up",
      // Balance note (tools/check-battle-balance.js, round 15): formation's own ceiling (a
      // commander AND an approach bonus both) is high enough that Fighter Escort Coordination —
      // commander only, no approach bonus of its own under this posture — needed formation
      // dampened hard here, not just below its own multiplier, or the box stayed the best play
      // under every posture regardless of what the contact was.
      modifiers: { escort: 1.2, formation: 0.6, targeting: 0.85, diversion: 0.8 },
      hints: [
        "Signals traffic reports twin-engine aircraft orbiting well outside the bomber stream's own gun range.",
        "A returning crew reports rocket contrails fired from a stand-off distance no defensive gun could reach.",
      ],
      reveal: "Contact: twin-engine Ju 88s are firing rockets from well outside the formation's own defensive range — only the escort can reach them before they fire.",
    },
    {
      id: "flakOverTarget",
      only: 2,
      name: "The target itself is ringed with flak",
      // Same reasoning as rocketStandoff above: formation's own ceiling needed matching
      // dampening here too, or the box stayed the best play regardless of contact.
      modifiers: { targeting: 1.15, formation: 0.6, escort: 0.8, diversion: 0.85 },
      hints: [
        "Prior missions to this target report flak concentrations denser than the fighter threat itself.",
        "Intelligence flags the target's own defenses as the heavier risk on this run, not the fighter screen.",
      ],
      reveal: "Contact: the target itself is ringed with flak dense enough that only a disciplined run gets bombs through it — the fighters are not today's real defense.",
    },
  ],
  // Round 21, Sedan. Three real conditions the crossing met, all verified 2026-10-05
  // (Wikipedia, Battle of Sedan (1940)): the 55th Division's reservists broke under the
  // continuous bombing though almost nobody was hit (56 French casualties, no bunker destroyed by
  // a direct hit, the "panic of Bulson" at about 19:00); French artillery destroyed 81 of the 96
  // assault boats at Wadelincourt; a two-kilometre gap lay between two bunkers at Glaire and
  // Pont Neuf, and small assault parties (Großdeutschland, Feldwebel Rubarth's team of the 49th
  // Engineer Battalion) cleared the bunkers around it; and X Corps' armour (3rd Armoured Division,
  // Char B1 bis) was within reach for a dawn counterattack on 14 May. The reservist collapse is
  // the historical posture, drawn twice as often (round 10, item 7).
  sedan40: [
    {
      id: "reservistsShaken",
      name: "Reservists breaking under the bombing",
      weight: 2,
      modifiers: { air: 1.1, assault: 0.95, guns: 0.85, bridging: 0.9 },
      hints: [
        "Prisoners from the last river crossing say the men in the bunkers have not slept and are ready to leave.",
        "Telephone lines on the French side are down and the officers cannot be heard giving orders.",
      ],
      reveal: "Contact: the defenders on the far bank are reservists, and the bombing is wearing them down faster than any bunker is breached.",
    },
    {
      id: "riverArtillery",
      name: "French guns ranged on the river",
      modifiers: { guns: 1.5, air: 0.7, assault: 0.85, bridging: 0.9 },
      hints: [
        "A forward observer reports French batteries firing at the approaches to the crossing places before any boat is in the water.",
        "The far bank's bunkers are intact and the guns behind them have clearly registered the river.",
      ],
      reveal: "Contact: French artillery has the whole river ranged, and the first boats in the water are being hit.",
    },
    {
      id: "gapBetweenBunkers",
      name: "A gap between the bunkers",
      modifiers: { assault: 1.25, air: 0.8, guns: 0.9, bridging: 0.95 },
      hints: [
        "Air photographs show a stretch of the line where the bunkers stand well apart with nothing between.",
        "Patrols report the French line is thin between two strongpoints and that no one is watching the ground.",
      ],
      reveal: "Contact: there is a gap in the line, and small parties can get through it and take the bunkers from the flank.",
    },
    {
      id: "armourOnTheMove",
      name: "French tanks moving up",
      modifiers: { bridging: 1.5, assault: 0.85, air: 0.7, guns: 0.8 },
      hints: [
        "Reconnaissance reports French armour on the roads south of Sedan, moving north.",
        "Radio intercepts talk of a reserve division being brought forward to the heights above the town.",
      ],
      reveal: "Contact: French armour is moving up toward the bridgehead, and the tanks on this side of the river can do nothing until the bridge is built.",
    },
  ],
  // Round 21, Moscow. Three conditions the German line actually offered, verified 2026-10-05
  // (Wikipedia, Battle of Moscow; Winter campaign of 1941-1942): Army Group Centre had only a
  // third of its motor vehicles working and infantry divisions at third to half strength, with no
  // winter clothing (the frozen line, the historical posture, drawn twice as often); the northern
  // and southern groups were still armoured, Third Panzer Army at Klin and Second Panzer Army at
  // Tula (the flank counterattack case); and the Germans did withdraw, in many places in good
  // order, so that "the Red Army mostly failed to encircle the German units" in December (the
  // orderly withdrawal, which tests the pursuit and its supply).
  moscow41: [
    {
      id: "frozenLine",
      name: "A hollow, frozen line",
      weight: 2,
      modifiers: { exploitation: 1.4, reserves: 0.95, supply: 0.9, air: 0.9 },
      hints: [
        "Prisoners come over the line in summer boots and report their regiments down to a hundred and fifty rifles.",
        "Scouts find stretches of the German line with no one in it at all.",
      ],
      reveal: "Contact: the German line is hollow and frozen, with whole sectors open to anyone who can get through the snow.",
    },
    {
      id: "mobileFlanks",
      name: "Tank groups still mobile on the flanks",
      modifiers: { reserves: 1.05, exploitation: 0.7, air: 1.1, supply: 0.95 },
      hints: [
        "Air reconnaissance still finds German tanks and armoured cars at the roads leading out of Klin and Tula.",
        "Signals show the panzer groups' headquarters have kept their reserves close to the main roads.",
      ],
      reveal: "Contact: German tank groups are still mobile at the flanks, and anyone riding through the gaps will be hit from the side.",
    },
    {
      id: "orderlyWithdrawal",
      name: "A German withdrawal in good order",
      modifiers: { supply: 1.5, reserves: 0.85, exploitation: 0.8, air: 0.9 },
      hints: [
        "Villages along the main roads are burning, and the Germans are blowing the bridges behind them.",
        "Rearguards are fighting from village to village and then pulling out before they can be surrounded.",
      ],
      reveal: "Contact: the Germans are pulling back in good order, and the whole attack will depend on how far its own supplies can keep up.",
    },
  ],
  // Round 21, Battle of Britain Day. Three conditions of the day itself, verified 2026-10-05
  // (Wikipedia, Battle of Britain Day): a heavy fighter escort rode with each raid (about 120
  // Bf 109s with 25 Dorniers in the morning, about 350 fighters with 114 bombers in the
  // afternoon: the historical posture, drawn twice as often); the afternoon raid was a second
  // wave about three hours behind the first; and cloud between 2,000 and 12,000 feet hid the
  // targets, which makes the Observer Corps' and ground controllers' job harder (the Dowding
  // system's own limits, per Wikipedia, Dowding system: the Observer Corps "struggled in poor
  // weather and darkness").
  britainDay40: [
    {
      id: "heavyEscort",
      name: "Fighters riding close with the bombers",
      weight: 2,
      modifiers: { wing: 1.2, squadrons: 0.85, control: 1.0, turnaround: 0.9 },
      hints: [
        "The plot shows a large number of fighters forming up over the Pas de Calais with the bombers.",
        "The first plots are rather bigger than a bombing raid usually is.",
      ],
      reveal: "Contact: the raid has a heavy fighter escort, and the fight will be as much with the Messerschmitts as with the bombers.",
    },
    {
      id: "secondWave",
      only: 2,
      name: "A second wave behind the first",
      modifiers: { turnaround: 1.8, squadrons: 0.8, wing: 0.8, control: 0.9 },
      hints: [
        "Radar shows no break in the plots: the first raid is not alone.",
        "The first raid has gone home, but the controllers say they can see more aircraft forming up behind it.",
      ],
      reveal: "Contact: a second, larger raid is coming within hours of the first, and the squadrons that met the first have to be back in the air.",
    },
    {
      id: "cloudCover",
      name: "Cloud hiding the raid",
      modifiers: { squadrons: 1.1, control: 0.7, wing: 0.9, turnaround: 1.0 },
      hints: [
        "A solid layer of cloud lies across Kent at 2,000 feet and builds to twelve thousand.",
        "The Observer Corps posts report the raid by sound and cannot see it.",
      ],
      reveal: "Contact: cloud is hiding the raid from the ground, and the plot is thin and late.",
    },
  ],
  // Round 21, the Alps. Three conditions the offensive actually faced, verified 2026-10-05
  // (Wikipedia, Italian invasion of France): the French blew the bridges on the Little St Bernard
  // road and garrisoned the old Redoute Ruinée with seventy men and machine guns, with an advance
  // post at Seloge (the historical posture, drawn twice as often); the French fortress artillery
  // silenced six of the eight turrets of the Italian fort on Mont Chaberton with 57 shots from
  // 280-mm mortars on 21 June and ranged the passes; and the French had 86 platoons of elite
  // ski scouts (sections d'éclaireurs-skieurs) screening the approaches.
  alps40: [
    {
      id: "bridgesDown",
      name: "The bridges down, the old posts manned",
      weight: 2,
      modifiers: { supply: 2.0, assault: 0.6, artillery: 0.9, air: 0.9 },
      hints: [
        "Engineers report the French have blown the bridges on the Little St Bernard road.",
        "Aerial photographs show machine-gun posts in the ruins of the old fort at the top of the pass.",
      ],
      reveal: "Contact: the bridges are down and the old posts above them are manned, so the road itself is the obstacle.",
    },
    {
      id: "fortressGuns",
      name: "Fortress guns ranged on the passes",
      modifiers: { artillery: 1.2, assault: 0.6, air: 0.8, supply: 0.9 },
      hints: [
        "French heavy mortars have been moved up below the forts at the frontier.",
        "The guns in the forts opposite are firing on the approaches before anyone has moved.",
      ],
      reveal: "Contact: the French fortress guns have the passes ranged, and whoever shows himself gets shelled.",
    },
    {
      id: "skiScreen",
      name: "Ski patrols on every approach",
      modifiers: { assault: 1.0, artillery: 0.7, air: 0.8, supply: 0.9 },
      hints: [
        "Patrols are meeting French ski scouts well forward of the French line.",
        "Every approach seems to have a few men on skis watching it, and they are good.",
      ],
      reveal: "Contact: French ski patrols are screening every approach, and the attack will be fought out in small mountain actions.",
    },
  ],
  // Round 23: the second ring's enemy setups, each tied to a documented condition of its battle.
  uranus: [
    {
      id: "thinRomanianLine",
      name: "A thin Romanian line, thinly supported",
      weight: 2,
      modifiers: { breakthrough: 1.1, armour: 1.1, air: 0.9, supply: 0.85 },
      hints: [
        "Prisoners say their regiments have few anti-tank guns and no reserves behind them.",
        "Reconnaissance finds long stretches of the Romanian line held by outposts.",
      ],
      reveal: "Contact: the Romanian line is thin and thinly supported, and it begins to give on the first morning.",
    },
    {
      id: "panzerReserve",
      name: "German armour behind the Romanians",
      modifiers: { armour: 0.65, breakthrough: 1.15, air: 1.25, supply: 0.9 },
      hints: [
        "Air reconnaissance reports German tanks assembled behind the Romanian front.",
        "Intercepted signals mention a panzer corps held in reserve behind the Don bend.",
      ],
      reveal: "Contact: a German panzer corps stands in reserve behind the Romanians, and it is moving to meet the pincers.",
    },
    {
      id: "strongpoints",
      name: "Strongpoints held to the last",
      modifiers: { breakthrough: 0.7, armour: 1.2, air: 0.9, supply: 1.1 },
      hints: [
        "Prisoners describe orders to hold the villages whatever happens.",
        "Reconnaissance finds the Romanian line anchored on fortified villages.",
      ],
      reveal: "Contact: the Romanian divisions hold their villages and hills to the last, and the infantry have to take them one at a time.",
    },
  ],
  dynamo40: [
    {
      id: "luftwaffeStrikes",
      name: "The Luftwaffe over the beaches",
      weight: 2,
      modifiers: { air: 1.5, navy: 0.8, smallCraft: 0.9, perimeter: 1 },
      hints: [
        "Reconnaissance reports bomber groups massing on the airfields behind the pocket.",
        "The sky over the beaches is already busy with German aircraft.",
      ],
      reveal: "Contact: the Luftwaffe is over the beaches and the mole in force, and the ships are its first target.",
    },
    {
      id: "perimeterPressed",
      name: "A heavy ground attack on the perimeter",
      modifiers: { perimeter: 1.3, navy: 0.85, smallCraft: 0.9, air: 0.9 },
      hints: [
        "The French at Lille report heavy attacks on the south of the perimeter.",
        "German infantry columns are moving up toward the canal line.",
      ],
      reveal: "Contact: a heavy German ground attack is going in on the perimeter, and every hour the rearguard holds is an hour of lift.",
    },
    {
      id: "panzersHalted",
      name: "The panzers held at the canals",
      modifiers: { smallCraft: 1.3, navy: 0.8, perimeter: 0.9, air: 0.9 },
      hints: [
        "The German armour has not moved from the canal line for two days.",
        "The marshes in front of the perimeter are quiet of tanks.",
      ],
      reveal: "Contact: the panzers are held back at the canals, and the pressure on the perimeter is only infantry.",
    },
  ],
  epirus40: [
    {
      id: "greekCounteroffensive",
      name: "The Greeks on the offensive",
      weight: 2,
      modifiers: { reserves: 1, alpini: 0.8, air: 1.1, ports: 0.9 },
      hints: [
        "Prisoners say the Greek divisions have orders to keep attacking.",
        "Greek columns are moving forward along the mountain tracks.",
      ],
      reveal: "Contact: the Greeks are on the offensive along the whole front, and the line is being pushed.",
    },
    {
      id: "numbersInTheHills",
      name: "Greek divisions larger than the Italians'",
      modifiers: { reserves: 1.3, alpini: 0.9, air: 0.9, ports: 0.8 },
      hints: [
        "Prisoners come from three different Greek divisions in one small sector.",
        "The Greek line is held in depth, with more men than the Italian staff expected.",
      ],
      reveal: "Contact: the Greek divisions are larger and stronger than the Italian ones in front of them, and they are everywhere on the heights.",
    },
    {
      id: "replacementsRunShort",
      name: "Greek replacements running short",
      modifiers: { alpini: 1.25, reserves: 0.85, air: 0.8, ports: 0.9 },
      hints: [
        "Prisoners say the Greek units are well below strength and that replacements are slow.",
        "The Greek attacks are being made by tired men with little behind them.",
      ],
      reveal: "Contact: the Greek army is short of replacements, and its attacks are costing it more than it can afford.",
    },
  ],
  crete41: [
    {
      id: "largerGarrison",
      name: "A garrison larger than briefed",
      weight: 2,
      only: 1,
      modifiers: { paratroops: 0.65, air: 0.9, sea: 1, mountain: 1.15 },
      hints: [
        "A report from the mainland suggests the island holds more troops than the staff believed.",
        "Aerial photographs show dug-in positions around every airfield.",
      ],
      reveal: "Contact: the garrison is larger than briefed, and it was waiting. The paratroopers are landing among the defenders.",
    },
    {
      id: "asBriefed",
      name: "A garrison as briefed",
      only: 1,
      modifiers: { paratroops: 1.2, air: 1, sea: 0.9, mountain: 0.8 },
      hints: [
        "Reconnaissance suggests the defence is thin around the airfields.",
        "No heavy guns have been seen on the hills above the drop zones.",
      ],
      reveal: "Contact: the garrison is about as strong as the planners believed, and the first wave gets a foothold.",
    },
    {
      id: "navyHunts",
      name: "The Royal Navy hunting the convoys",
      only: 2,
      modifiers: { sea: 0.5, air: 1.2, paratroops: 0.9, mountain: 0.9 },
      hints: [
        "Air reconnaissance reports British cruisers and destroyers steaming north of the island.",
        "The Navy's ships are at sea in strength, and the convoys are slow.",
      ],
      reveal: "Contact: the Royal Navy is hunting the convoys, and the ships in them are being sunk one after another.",
    },
    {
      id: "malemeGap",
      name: "A gap at Maleme",
      only: 2,
      modifiers: { mountain: 1.4, paratroops: 1.2, sea: 0.9, air: 0.9 },
      hints: [
        "A paratroop patrol reports that the hill beside the airfield is quiet.",
        "The defenders on the hill appear to have pulled back in the night.",
      ],
      reveal: "Contact: the defenders have left the hill beside Maleme airfield, and the runway can be used.",
    },
  ],
  bastogne44: [
    {
      id: "southernShoulder",
      name: "The German shoulder in the south",
      weight: 2,
      only: 1,
      modifiers: { armour: 0.8, infantry: 1.3, air: 1.1, garrison: 1 },
      hints: [
        "Intercepts show German infantry divisions dug in along the southern edge of the salient.",
        "Reports describe villages on the road held in strength.",
      ],
      reveal: "Contact: the southern shoulder of the salient is held in strength, and the road north is lined with villages that must be taken.",
    },
    {
      id: "panzersAtBastogne",
      name: "Panzers still pressing the town",
      modifiers: { garrison: 1.3, armour: 0.85, infantry: 0.9, air: 1.1 },
      hints: [
        "German tanks are reported massing for a fresh attack on the town.",
        "The garrison reports tank fire on three sides of the perimeter at once.",
      ],
      reveal: "Contact: German panzers are still pressing the town hard, and the garrison is in danger.",
    },
    {
      id: "fuelRunsDry",
      name: "German fuel running out",
      only: 2,
      modifiers: { armour: 1.35, infantry: 0.85, air: 0.9, garrison: 0.9 },
      hints: [
        "German vehicles are being abandoned along the roads for lack of fuel.",
        "Prisoners say their tanks have not been refuelled in two days.",
      ],
      reveal: "Contact: the German advance has run out of fuel, and its tanks are standing where they stopped.",
    },
  ],
  matapan41: [
    {
      id: "carrierStrikes",
      name: "Carrier aircraft striking in waves",
      weight: 2,
      only: 1,
      modifiers: { air: 1.5, battle: 0.8, cruisers: 0.9, signals: 1 },
      hints: [
        "A shadowing aircraft has been over the fleet since morning.",
        "Signals traffic suggests a carrier is within range.",
      ],
      reveal: "Contact: carrier aircraft are attacking the fleet in waves through the day, and the sky above it is empty of friends.",
    },
    {
      id: "cruisersInContact",
      name: "British cruisers in contact",
      only: 1,
      modifiers: { cruisers: 1.3, battle: 0.9, air: 0.9, signals: 0.85 },
      hints: [
        "A report from the morning describes British cruisers on the horizon.",
        "The cruisers on the flank report ships in sight to the south-east.",
      ],
      reveal: "Contact: British cruisers are in sight and in touch with the fleet, and they will not go away.",
    },
    {
      id: "britishClose",
      name: "British battleships close behind, with radar",
      weight: 2,
      only: 2,
      modifiers: { signals: 0.5, cruisers: 0.8, battle: 1.1, air: 0.9 },
      hints: [
        "A report suggests the British battle fleet is steaming west at speed.",
        "A shadowing aircraft reports heavy ships on the fleet's track.",
      ],
      reveal: "Contact: the British battle fleet is close behind, and its radar finds the ships long before the ships find it.",
    },
    {
      id: "britishFarAstern",
      name: "The British far astern",
      only: 2,
      modifiers: { cruisers: 1.3, signals: 1, battle: 0.9, air: 0.9 },
      hints: [
        "No ship has been reported east of the fleet in hours.",
        "The last report puts the British battle fleet a long way behind.",
      ],
      reveal: "Contact: the British are far astern, and the sea around the fleet is empty.",
    },
    {
      id: "mistakenForFriends",
      name: "British ships mistaken for friends",
      only: 2,
      modifiers: { signals: 1.4, cruisers: 0.9, battle: 0.9, air: 0.9 },
      hints: [
        "Ships have been sighted ahead and not challenged.",
        "The watch reports a force in the dark and cannot say whose it is.",
      ],
      reveal: "Contact: a force is sighted in the dark and taken for Italian ships, and the signal that would settle it is not made.",
    },
  ],
  // Round 25 (Craig's item 9): the enemy setups of the five new battles. Each is tied to a documented condition of its
  // battle where one was found (verified 2026-10-08), and the weights are tuned by tools/check-battle-balance.js like
  // the postures above. The first posture of each battle is the historical one and is drawn twice as often; a posture
  // with no documented basis is marked as modeled.
  //  Monte Lungo - Italian Wikipedia, Battaglia di Montelungo, and Wikipedia, 15th Panzergrenadier Division: the
  //   German positions were stronger than the plan assumed (the historical posture); two battalions held both San
  //   Pietro Infine and Monte Lungo, a thin line; the mist is documented, though how long it lasted is modeled.
  monteLungo43: [
    {
      id: "strongPositions",
      name: "Stronger positions than the plan assumed",
      weight: 2,
      modifiers: { infantry: 0.65, bersaglieri: 0.75, guns: 1.25, recon: 1.3 },
      hints: [
        "A patrol that went out in the night cannot say where the German line begins.",
        "Prisoners from the valley speak of machine-gun posts and mortar pits on the hill that no map shows.",
      ],
      reveal: "Contact: the mist lifts on German positions the plan never found, with mortars and machine guns laid on the open slopes.",
    },
    {
      id: "thinLine",
      name: "Two battalions to hold two hills",
      modifiers: { infantry: 1.25, bersaglieri: 1.15, guns: 0.8, recon: 0.85 },
      hints: [
        "The Germans seem to be holding the whole gap with very few men, and the posts on the hill are far apart.",
        "No fresh troops have been seen moving up toward Monte Lungo in the last day.",
      ],
      reveal: "Contact: the hill is thinly held, and whoever gets up the slope quickly will find gaps in the line.",
    },
    {
      id: "mistHolds",
      name: "The mist stays on the hill",
      modifiers: { infantry: 1.0, bersaglieri: 1.3, guns: 0.7, recon: 0.7 },
      hints: [
        "The valley lies under a thick mist, and nobody can say when it will lift.",
        "Sound carries oddly in the fog, and the sentries on the hill are listening more than they are watching.",
      ],
      reveal: "Contact: the mist stays thick on the slope past dawn, and neither side can see a hundred yards.",
    },
  ],
  //  Filottrano - Italian Wikipedia, Battaglia di Filottrano, and the Filottrano memorial museum's account: the Germans
  //   (278th and 71st Infantry Divisions) held a line from Cingoli through Filottrano and Osimo to Castelfidardo and
  //   withdrew by night once the town had been bombarded; the blown bridges and mines are modeled, a normal part of
  //   such a retreat.
  adriaticRoad44: [
    {
      id: "hillsDugIn",
      name: "A line held along the ridges",
      weight: 2,
      modifiers: { nembo: 0.75, armour: 0.7, artillery: 1.3, supply: 0.95 },
      hints: [
        "Air photographs show the ridge line from Cingoli to Castelfidardo freshly dug.",
        "Prisoners say the order is to hold the line to cover Ancona.",
      ],
      reveal: "Contact: the Germans are holding the ridge line in prepared positions, and every approach to Filottrano is covered.",
    },
    {
      id: "rearguardGiving",
      name: "A rearguard falling back by stages",
      modifiers: { nembo: 1.2, armour: 1.15, artillery: 0.8, supply: 0.9 },
      hints: [
        "Outposts are found empty at dawn that were manned the night before.",
        "Villages along the road are left in the night, with the culverts mined behind them.",
      ],
      reveal: "Contact: the Germans are falling back by stages, fighting from one ridge to the next, and leaving mines behind.",
    },
    {
      id: "roadsBlown",
      name: "The bridges down and the verges mined",
      modifiers: { nembo: 1.1, armour: 0.75, artillery: 0.9, supply: 1.5 },
      hints: [
        "Engineers report demolitions on the road behind the German outposts.",
        "A lorry has gone up on a mine at a culvert, and the road is blocked behind it.",
      ],
      reveal: "Contact: the bridges are down and the verges mined, and everything that does not walk is held up behind the demolitions.",
    },
  ],
  //  The Senio - the 2nd New Zealand Division's official history: German posts were dug into the inner face of the
  //   stopbank, with tunnels through it, and dominated both sides of the river (the historical posture); the
  //   Eighth Army faced a garrison "much weaker" than the winter before (Wikipedia, Spring 1945 offensive in Italy);
  //   mines and flooded ground are modeled, the usual condition of such a river line.
  springOffensive45: [
    {
      id: "bankDugouts",
      name: "Posts dug into the flood bank",
      weight: 2,
      modifiers: { assault: 0.7, flame: 1.3, fire: 1.2, bridging: 0.9 },
      hints: [
        "Air photographs show the far bank dotted with dug-in posts, and tunnels running through it.",
        "Prisoners say the garrison lives in the bank itself, with the guns behind.",
      ],
      reveal: "Contact: the Germans are dug into the far bank in tunnels and dugouts, and nothing but fire reaches them.",
    },
    {
      id: "thinGarrison",
      name: "A garrison short of everything",
      modifiers: { assault: 1.25, flame: 0.9, fire: 0.8, bridging: 1.0 },
      hints: [
        "The posts in the bank are far apart, and some look empty.",
        "Prisoners say the companies are at half strength, with little ammunition for the machine guns.",
      ],
      reveal: "Contact: the bank is thinly held by men who have been told not to give ground and have little to hold it with.",
    },
    {
      id: "floodedMined",
      name: "Mines on the banks and water behind",
      modifiers: { assault: 0.9, flame: 0.8, fire: 0.9, bridging: 1.6 },
      hints: [
        "Sappers report fresh mines on both banks, and trip wires across the paths down to the water.",
        "Patrols find the fields behind the river flooded and the farm tracks cut.",
      ],
      reveal: "Contact: the approaches to the bank are mined and the ground behind the river is flooded, and the crossing depends on the engineers.",
    },
  ],
  //  Brody - Wikipedia, Battle of Brody (1941): the 11th Panzer Division had already advanced 40 miles by 23 June
  //   and the 13th and 14th were on the road to Lutsk (the historical posture); the Luftwaffe shot down 24 SB
  //   bombers on the first day, was credited with 201 Soviet tanks, and the front's aircraft were mostly destroyed on
  //   the ground; the anti-tank positions manned by motorcycle troops of XXXXVIII Panzer Corps were swept aside by
  //   Popel's group.
  brodyCounterstroke41: [
    {
      id: "panzersPastLine",
      name: "The panzers are already far in",
      weight: 2,
      modifiers: { armour: 1.0, infantry: 0.65, air: 0.85, signals: 1.3 },
      hints: [
        "The first reports put German tanks far beyond the border posts, and nobody can say where the head of the column is.",
        "Railway reports from Dubno speak of panzers passing through, not stopping.",
      ],
      reveal: "Contact: the German spearheads are already far inside the country, and the corps are meeting a moving column, not a line.",
    },
    {
      id: "luftwaffeOverhead",
      name: "The sky belongs to the Luftwaffe",
      modifiers: { armour: 0.7, infantry: 1.3, air: 0.5, signals: 0.8 },
      hints: [
        "Soviet fighters have not been seen over the front since the first morning.",
        "Columns on the road report German aircraft over them every hour of daylight.",
      ],
      reveal: "Contact: the Luftwaffe has the sky, and every column on the road is being bombed as it moves.",
    },
    {
      id: "antiTankScreen",
      name: "A thin screen of anti-tank guns",
      modifiers: { armour: 1.35, infantry: 0.9, air: 1.0, signals: 0.85 },
      hints: [
        "Scouts find only a few anti-tank guns and motorcyclists on the German flank.",
        "The German columns seem to have run ahead of their own infantry.",
      ],
      reveal: "Contact: the German flank is covered only by a hasty screen of anti-tank guns and motorcycle troops, and tanks can sweep it aside.",
    },
  ],
  //  Vyazma - Wikipedia, Rzhev-Vyazma strategic offensive operation and Vyazma airborne operation: the German line was
  //   a line of strongpoints held under Hitler's order not to retreat, with the country between them open to cavalry
  //   (the historical posture); the transports dropping the airborne corps had very little fighter cover and seven
  //   TB-3s were lost; German reserves arriving by rail is modeled, the usual German answer to a penetration.
  rzhevVyazma42: [
    {
      id: "strongpointLine",
      name: "A line of strongpoints with gaps between",
      weight: 2,
      modifiers: { armies: 0.8, cavalry: 1.3, airborne: 1.0, supply: 0.9 },
      hints: [
        "Cavalry patrols find villages held as strongpoints, with the ground between them open.",
        "Prisoners say the order is to hold every village to the last man.",
      ],
      reveal: "Contact: the Germans hold the villages as strongpoints under orders not to retreat, and the country between them is open to anyone who can ride through it.",
    },
    {
      id: "reservesByRail",
      name: "German reserves arriving by rail",
      modifiers: { armies: 1.1, cavalry: 0.7, airborne: 0.8, supply: 1.1 },
      hints: [
        "Railway reports show troop trains arriving at Vyazma every night.",
        "Intercepts speak of divisions brought up from other parts of the front.",
      ],
      reveal: "Contact: German reserves are arriving by rail behind the salient, and the corridor will be contested by fresh divisions.",
    },
    {
      id: "luftwaffeCorridor",
      name: "German aircraft over the corridor",
      modifiers: { armies: 1.0, cavalry: 1.0, airborne: 0.55, supply: 0.7 },
      hints: [
        "German fighters have been seen over the forest tracks behind the front all week.",
        "The transports flew out last night with no fighter cover and not all of them came back.",
      ],
      reveal: "Contact: German aircraft are over the corridor and the drop zones, and the transports are going in without fighter cover.",
    },
  ],
  // Round 26 (item 1): the enemy setups of the six new battles. Each is tied to a documented condition of its battle
  // where one was found (verified 2026-10-08), and the weights are tuned by tools/check-battle-balance.js like the
  // postures above. The first posture of each battle is the historical one and is drawn twice as often; a posture with
  // no documented basis is marked as modeled.
  //  Kiev - Wikipedia, Battle of Kiev (1941): Stalin refused to let the Southwestern Front withdraw (the historical
  //   posture); a line along the rivers and a reserve held back on the Psel are modeled.
  kievPocket41: [
    {
      id: "orderToHold",
      name: "The armies told not to move",
      weight: 2,
      modifiers: { northPincer: 1.1, southPincer: 1.1, infantry: 0.85, air: 1.0 },
      hints: [
        "Intercepts say that the Southwestern Front has been ordered to hold Kiev and the line of the Dnieper.",
        "Air reconnaissance finds the Soviet armies still on the ground they held a week ago.",
      ],
      reveal: "Contact: the Soviet armies are where they were told to stay, with nothing behind them to fall back on.",
    },
    {
      id: "riverLine",
      name: "A strong line on the rivers",
      modifiers: { northPincer: 0.75, southPincer: 0.75, infantry: 1.3, air: 1.0 },
      hints: [
        "The crossings of the Desna are held by dug-in infantry with guns behind them.",
        "Prisoners from the river line speak of fresh divisions that have only just come up.",
      ],
      reveal: "Contact: the rivers are held in strength, and every crossing is covered by guns on the far bank.",
    },
    {
      id: "reserveOnPsel",
      name: "A reserve held back on the Psel",
      modifiers: { northPincer: 1.2, southPincer: 0.75, infantry: 1.0, air: 0.9 },
      hints: [
        "Reports from the south speak of a Soviet army moving into position behind the Dnieper bridgehead.",
        "A prisoner says there are tanks in the woods east of Kremenchug waiting for orders.",
      ],
      reveal: "Contact: a Soviet reserve is waiting on the Psel and goes straight in against the southern jaw.",
    },
  ],
  //  Kharkov - Wikipedia, Third Battle of Kharkov: the Soviet spearheads were weak and short of fuel (the historical
  //   posture); Rokossovsky's Central Front joined on 25 February; the scattering of the Soviet forces is modeled.
  kharkovBackhand43: [
    {
      id: "spearheadsSpent",
      name: "Spearheads out of fuel and men",
      weight: 2,
      modifiers: { ssCorps: 1.0, panzerArmy: 1.3, infantry: 0.9, air: 1.0 },
      hints: [
        "Captured Soviet tanks are found abandoned on the roads with their tanks empty.",
        "Prisoners say their divisions have not had a resupply for ten days.",
      ],
      reveal: "Contact: the Soviet spearheads are out of fuel and short of men, and they have little left to meet a blow in the flank.",
    },
    {
      id: "reservesComing",
      name: "Fresh reserves arriving",
      modifiers: { ssCorps: 0.7, panzerArmy: 0.8, infantry: 1.5, air: 1.0 },
      hints: [
        "Aircraft report long columns on the roads east of the Donets.",
        "A prisoner says a whole army has been ordered to the sector.",
      ],
      reveal: "Contact: fresh Soviet divisions are coming up from the east and go straight into the line.",
    },
    {
      id: "moppingUp",
      name: "The Soviet forces scattered across the steppe",
      modifiers: { ssCorps: 1.25, panzerArmy: 0.7, infantry: 1.0, air: 1.1 },
      hints: [
        "The Soviet columns seem to have no common plan and many are heading in different directions.",
        "Wireless messages from the Soviet side are being sent in the clear.",
      ],
      reveal: "Contact: the Soviet forces are scattered in small groups across the steppe, and every group has to be found and dealt with.",
    },
  ],
  //  The Ardennes - Wikipedia, Battle of the Bulge: the American line was thin and held by some tired and some green
  //   divisions (the historical posture); reserves near the front and a warning that came in time are modeled.
  ardennesWacht44: [
    {
      id: "thinAndGreen",
      name: "A thin line, tired and green",
      weight: 2,
      modifiers: { sixthSS: 1.0, fifthPanzer: 1.25, seventhArmy: 1.1, fuelColumns: 0.9 },
      hints: [
        "The sector in front of the Eifel has been quiet for weeks, and the Americans there are not expecting anything.",
        "Prisoners say that two of the divisions on the line are new to the front and two are resting.",
      ],
      reveal: "Contact: the American line is thinly held by divisions that were not expecting an attack.",
    },
    {
      id: "reserveNearby",
      name: "A reserve close behind the line",
      modifiers: { sixthSS: 0.5, fifthPanzer: 0.55, seventhArmy: 0.8, fuelColumns: 1.6 },
      hints: [
        "An American armoured division is reported resting a day's march behind the line.",
        "Radio traffic from the northern sector suggests that reinforcements are already on the move.",
      ],
      reveal: "Contact: an American armoured reserve is close behind the line and goes into the fight on the first day.",
    },
    {
      id: "warnedInTime",
      name: "A warning that came in time",
      modifiers: { sixthSS: 1.2, fifthPanzer: 0.7, seventhArmy: 1.2, fuelColumns: 0.85 },
      hints: [
        "The units in the forward positions have been told to be on the alert at dawn.",
        "A report says that the Americans have laid mines across the roads leading west.",
      ],
      reveal: "Contact: the Americans were warned and the forward positions are manned, with the roads mined behind them.",
    },
  ],
  //  Kursk - Wikipedia, Battle of Kursk: the heaviest German weight was on the southern face (the historical
  //   posture); a heavier northern thrust and the German heavy tanks used in a wedge are modeled.
  kurskSoviet43: [
    {
      id: "southWeight",
      name: "The weight on the southern face",
      weight: 2,
      modifiers: { infantry: 0.8, antiTank: 1.0, tanks: 1.25, air: 1.0 },
      hints: [
        "Intelligence reports that the II SS Panzer Corps is assembling in the south, with Kempf's group beside it.",
        "Air reconnaissance finds more armoured vehicles in the south than in the north.",
      ],
      reveal: "Contact: the heaviest German blow falls on the southern face, with the SS Panzer Corps at its head.",
    },
    {
      id: "northWeight",
      name: "The weight on the northern face",
      modifiers: { infantry: 1.1, antiTank: 1.25, tanks: 0.8, air: 1.0 },
      hints: [
        "Prisoners from the north speak of a very large artillery park behind Model's army.",
        "Rail traffic in the north has doubled in the last week.",
      ],
      reveal: "Contact: the German weight is in the north, against the Central Front, under a massive artillery preparation.",
    },
    {
      id: "tigerWedge",
      name: "The heavy tanks in a wedge",
      modifiers: { infantry: 1.0, antiTank: 0.8, tanks: 1.0, air: 1.3 },
      hints: [
        "Prisoners say the heavy Tigers are to lead the attack in a single armoured wedge.",
        "Photographs show a new kind of tank formation assembling behind the German front.",
      ],
      reveal: "Contact: the German heavy tanks come on in a wedge, straight at one point in the line.",
    },
  ],
  //  Stalingrad - Wikipedia, Battle of Stalingrad: the Germans reached the Volga in the centre in September (the
  //   historical posture); the weight on the factory district in October is documented, the sappers and flamethrowers
  //   in the ruins are modeled.
  stalingradCity42: [
    {
      id: "landingStage",
      name: "The weight on the central landing stage",
      weight: 2,
      modifiers: { rifle: 1.2, guns: 0.85, groups: 1.0, ferries: 0.8 },
      hints: [
        "German infantry are massing in the ruins near the railway station.",
        "Aircraft are bombing the central landing stage and the ferry crossing heavily.",
      ],
      reveal: "Contact: the Germans attack toward the central landing stage in force, to reach the river and cut the army in two.",
    },
    {
      id: "factoryWeight",
      name: "The weight on the factories",
      modifiers: { rifle: 0.8, guns: 1.25, groups: 1.1, ferries: 1.0 },
      hints: [
        "Tanks and assault guns are being brought up behind the northern suburbs.",
        "Prisoners speak of a big attack on the tractor works.",
      ],
      reveal: "Contact: the Germans attack the factory district with everything, with tanks and aircraft over the factory yards.",
    },
    {
      id: "flameAndSappers",
      name: "Sappers and flamethrowers in the ruins",
      modifiers: { rifle: 1.0, guns: 0.8, groups: 0.75, ferries: 1.2 },
      hints: [
        "German assault engineers are working their way through a row of ruined houses with explosives.",
        "Flamethrowers are heard in the ruins at night.",
      ],
      reveal: "Contact: the Germans come on in small groups of sappers and flamethrower teams, taking the buildings one at a time.",
    },
  ],
  //  Seelow - Wikipedia, Battle of the Seelow Heights: Heinrici pulled his front-line troops back to the second line
  //   before the barrage (the historical posture); the strength of the first line and the flooded plain are modeled.
  seelow45: [
    {
      id: "secondLineHeld",
      name: "The front pulled back to the second line",
      weight: 2,
      modifiers: { barrage: 0.7, rifle: 1.0, tanks: 0.8, engineers: 1.15 },
      hints: [
        "Prisoners from the Oder say that the trenches on the river bank have been left lightly held.",
        "Air photographs show new positions dug on the slopes of the heights behind them.",
      ],
      reveal: "Contact: the first line is nearly empty, and the second line on the heights is manned in strength.",
    },
    {
      id: "firstLineStrong",
      name: "The first line held in strength",
      modifiers: { barrage: 1.35, rifle: 1.1, tanks: 0.95, engineers: 0.9 },
      hints: [
        "The riverbank positions seem to be fully manned, and the German artillery has not moved.",
        "Prisoners say the order is to hold the river line at all costs.",
      ],
      reveal: "Contact: the Germans hold the river line in strength, and the barrage falls on men who are still in their trenches.",
    },
    {
      id: "floodedPlain",
      name: "The plain flooded at the foot of the heights",
      modifiers: { barrage: 0.8, rifle: 1.0, tanks: 0.6, engineers: 1.3 },
      hints: [
        "The Oderbruch is under water in places where the maps show dry fields.",
        "Sappers report that the dykes have been opened and the ground is soft.",
      ],
      reveal: "Contact: the plain below the heights is flooded, and only a few roads and dykes carry the weight of a tank.",
    },
  ],
};

// Shared battle math — one pure implementation used by the planning screen (staff assessment),
// the battle report (beats, reserve decision) and chooseOption (plan costs), so the three can
// never disagree about what a plan is worth. Round 9 adds reserves (Craig's item #2): chits left
// unplaced at commit can be thrown into ONE category at the battle's decisive hour, after the
// enemy posture has been revealed, at KEY_BATTLE_RESERVE_MULT of a planned chit's weight —
// reserves arrive late and piecemeal, and that discount is also the price of the information.
// Neglect is judged on the FINAL allocation (plan + committed reserve): a reserve thrown into an
// empty category plugs that gap, but dumping the whole pool into one category via the reserve is
// still a full concentration and pays for it — which is what stops "hold everything, wait for
// the reveal, then go all-in" from beating actual planning (checked by hand-simulation, round 9).
//
// Round 12 (Craig's item #8, "graded neglect coverage"): round 8's rule was a hard cliff — ANY
// category above literally zero chits paid nothing at all, no matter how thin. That gave a
// "hedge" — one token chit parked in every off-category, the rest piled into the real pick —
// a way to dodge the whole penalty while keeping nearly all the concentration payoff, which
// round 8's own hand-simulation flagged as an unpatched loophole. tools/check-battle-balance.js
// (round 12's item #3) turned that hand-simulation into a permanent, automated check and found
// the hedge wasn't just "surviving for free" — swept across every posture and pool size, it
// usually beat honest full concentration outright, by a wide margin. The fix: the penalty now
// grades continuously against a category's FAIR SHARE of the pool (poolSize / category count)
// rather than a zero/nonzero cliff. A category at or above its fair share pays nothing; a
// category below it pays a penalty scaled by how far below — so a token chit still costs
// something, and literal zero still pays the full penalty exactly as before.
//
// Round 16 (Craig's item #9): round 12's own curve was a 1/4-power ("shallow") curve, chosen so
// a single token chit still cost nearly the full penalty. That shape has a second-order problem
// its own check never measured: a CONCAVE curve stays near its maximum for almost the entire
// shortfall range and only collapses right at the fair-share line, which means the one chit that
// actually CROSSES a category into fair share is worth far more than its raw weight — it also
// buys back nearly the whole remaining penalty in one stroke. A rational plan should therefore
// top every category up to exactly its fair share first (cheap: clears that category's penalty
// entirely) and only dump the leftover into the real pick — a "spread to fair share" hedge, not
// the one-chit hedge the old check screened for. Exhaustively enumerating every possible
// allocation (not just the two hand-picked shapes the old check compared) across all 10 battles,
// every posture, and pool sizes 5-8 confirmed it: that spread hedge beat honest full
// concentration in 67 of 120 real scenarios, by up to 4 clamped bonus points. A LINEAR penalty
// (no crossing bonus — every missing chit costs the same fixed slice of the penalty, whether
// it's the first or the last) closes this without reintroducing round 8's hard cliff: grading is
// still continuous, a token chit still isn't free, but no single chit is worth more than its
// share. The constant dropped from 4.5 to 1.5 alongside the shape change — swept empirically
// (same discipline as round 12's own curve tuning) against both the original 250
// check-battle-balance.js scenarios and the new exhaustive search: 1.5 is the largest value that
// clears every one of the 120 exhaustively-enumerated scenarios while still passing all 250
// original ones.
const KEY_BATTLE_NEGLECT_PENALTY = 1.5;
const KEY_BATTLE_RESERVE_MULT = 0.75;
const KEY_BATTLE_BONUS_CLAMP = 30;

// Round 10 (item 7): postures can carry a `weight` (default 1) — Omaha's historical posture is
// drawn twice as often as either alternative.
function pickKeyBattlePosture(battleId, excludeId, phase) {
  // Round 22: a battle with phases (config.phases) draws a second posture for its second phase,
  // never the same one twice. excludeId is undefined for every ordinary battle, so nothing about
  // the first draw changes for them.
  // A posture can be tied to one phase (only: 1 or 2): a second wave cannot open the day.
  const roster = (KEY_BATTLE_POSTURES[battleId] || []).filter(
    (p) => (!excludeId || p.id !== excludeId) && (!phase || !p.only || p.only === phase)
  );
  if (!roster.length) return null;
  const total = roster.reduce((a, p) => a + (p.weight || 1), 0);
  let r = Math.random() * total;
  for (const p of roster) {
    r -= p.weight || 1;
    if (r <= 0) return p;
  }
  return roster[roster.length - 1];
}

// Round 10, Craig's item #4: the staff assessment's reliability scales with Initiative at the
// moment you ask — his own example, "9 initiative 90% accuracy." Floored at 10% so a staff
// that is badly behind events still occasionally gets it right, capped at 95% so it never
// becomes a guarantee. The free intelligence summary is wrong a flat 1 time in 4.
const KEY_BATTLE_INTEL_ERROR_RATE = 0.25;
// Round 13, Craig's item #3 ("intel as a spendable resource"): a second, PAID look at the same
// hidden posture, priced the same way the staff assessment is (1 Initiative) and reusing that
// same "spend a scarce meter for a materially better read, never a certainty" shape — sharper
// than the free hint (1-in-10 wrong, not 1-in-4) but still not perfect, so a Recon Pass narrows
// the odds of being fooled rather than removing the risk outright. See requestRecon.
const KEY_BATTLE_RECON_ERROR_RATE = 0.1;
function staffReliability(initiative) {
  return Math.max(10, Math.min(95, (initiative || 0) * 10));
}
const STAFF_VERDICT_BANDS = ["strong", "sound", "thin", "a mistake"];

// Round 10, Craig's item #8: how the battle was fought carries into the next node. chooseOption
// writes `${battleId}Counter`, `${battleId}PlanNeglected` and `${battleId}PlanCommander` flags
// (dev build only — the subgame is the only thing that sets them), and the next node's
// situation text appends at most two of these lines: what happened with the counterattack, then
// either the arm that was left uncovered or, if none was, the commander's lingering mark.
// Past tense is right here: by the next node, this is the player's own history.
const KEY_BATTLE_ECHOES = {
  kursk: {
    counter: {
      repulsed: "The Soviet tank counterattack on the flank was beaten off, and it cost them.",
      heldAtCost: "The flank held against the Soviet tank counterattack, but the infantry who held it are a shadow of what they were.",
      broke: "The Soviet tank counterattack broke into the flank, and the shoulder of the breach is still not secure.",
      gaveGround: "The flank gave ground to the Soviet tanks rather than fight it out. The ground is gone; the divisions are intact.",
    },
    neglected: {
      divisions: "There was never enough infantry behind the tanks to hold what they took.",
      armour: "The panzer divisions barely went in; what was won, the infantry won on foot.",
      air: "Soviet aircraft have held the sky over the front since the first morning.",
      supply: "Behind the front, the mine lanes the engineers never reached are still closed.",
    },
    commander: {
      hoth: "Hoth has the SS panzer corps angled toward Prokhorovka, watching the east.",
      kempf: "Kempf's corps is across the Donets and holding the right flank.",
      richthofen: "Luftflotte 4 is flying from first light to dark over the front.",
    },
  },
  omaha: {
    counter: {
      repulsed: "The German counterattack on the bluff top was stopped before dark.",
      heldAtCost: "The bluff top held against the German counterattack, barely, and the companies up there are badly thinned.",
      broke: "The German counterattack drove the forward companies back down toward the shingle.",
      gaveGround: "The forward companies gave up the bluff top to the counterattack and are dug in at its edge.",
    },
    neglected: {
      waves: "No more waves came in behind the first ones; the men ashore are what there is.",
      naval: "The destroyers never came in close, and the strongpoints that held the beach all day are still manned.",
      engineers: "Only a handful of lanes through the obstacles are open, and the tide will cover them again by morning.",
      air: "Nothing flew over the bluffs today that the Germans needed to fear.",
    },
    commander: {
      hall: "Hall's destroyers came in close all afternoon; without them there would be less beach than this.",
      cota: "Cota is still up on the bluff with the men he got off the shingle.",
      hoge: "Hoge's engineers are working on the exits through the night.",
    },
  },
  // Weeks later (falaise44, after a won Omaha): only the commander's mark survives the summer.
  omahaLater: {
    counter: {},
    neglected: {},
    commander: {
      hall: "V Corps still talks about the June morning the destroyers came in close enough to scrape bottom.",
      cota: "V Corps still talks about the June morning Cota got them off the shingle.",
      hoge: "V Corps still talks about the June morning Hoge's engineers opened the draws.",
    },
  },
  stalingrad: {
    counter: {
      repulsed: "The Soviet cavalry probing the column's flank was thrown back, and the march never lost its order.",
      heldAtCost: "The flank held against the attack on the march, at a real cost to the rearguard that held it.",
      broke: "The attack on the march broke into the column's rear before it could be stopped.",
      gaveGround: "The rearguard fell back into the column rather than fight it out, and the march lost its order doing it.",
    },
    neglected: {
      divisions: "The column came out with its tanks intact and its infantry a fraction of what it started with.",
      armour: "What made it out marched the whole way; there was no armor left to screen it.",
      air: "Nothing flew over the column from the first day to the last. Whatever found it, found it alone.",
      supply: "What's left of the army came out with its rifles and little else — the depots were never stripped before the order went out.",
    },
    commander: {
      hube: "Hube's panzer corps, what's left of it, screened the column the whole way west.",
      seydlitz: "Seydlitz's three divisions came out of the pocket the way they went in — as divisions.",
      fiebig: "VIII Fliegerkorps flew over the column from the first light to the last.",
    },
  },
  elAlamein: {
    counter: {
      repulsed: "The dug-in gun line on the ridge was answered and held off, and the panzer screen kept its ground.",
      heldAtCost: "The panzer screen held its ground on the ridge, at a real cost to the tanks that held it.",
      broke: "The dug-in guns on the ridge broke the panzer spearhead before it ever closed the range.",
      gaveGround: "The armor pulled back off the ridge's open ground rather than fight the gun line at close range.",
    },
    neglected: {
      divisions: "The panzers took the ridge alone; the infantry corps never caught up to hold what they took.",
      armour: "What reached the ridge got there on foot; there was no armored spearhead left to lead it.",
      air: "Nothing flew over the column from the first hour to the last. The Desert Air Force never had to share the sky.",
      supply: "What's left of the army reached the ridge running on fumes — the reserve dump was never touched before the order went out.",
    },
    commander: {
      vaerst: "Von Vaerst's Korps, what's left of it, is still screening the ground it took.",
      navarini: "Navarini's corps held every yard the panzers cleared for it.",
      seidemann: "Fliegerführer Afrika flew over the column from the morning Seidemann took command to the last.",
    },
  },
  monteCassino44: {
    counter: {
      repulsed: "The Gebirgsjäger counterattack was thrown back whole, and the line on the peak never gave an inch.",
      heldAtCost: "The line on the peak held against the Gebirgsjäger, at a real cost to the company that held it.",
      broke: "The Gebirgsjäger broke into the line, and the peak was held afterward only by retaking ground hand to hand.",
      gaveGround: "The line gave up its most exposed ground rather than fight the Gebirgsjäger out where they hit it.",
    },
    neglected: {
      assault: "The peak was taken and held mostly by paratroopers and gunfire; the assault battalions were never the weight of it.",
      paratroops: "The Nembo element barely went in; what was won on the peak, the assault battalions won alone.",
      artillery: "No guns ever answered for this position. Whatever came up the mountain, the line met it with rifles alone.",
      supply: "The mule trains never caught up to the line; what the men carried up with them was all there was.",
    },
    commander: {
      dapino: "Dapino's group, what's left of it, is still holding the ground it climbed to take.",
    },
  },
  bagrationSoviet44: {
    counter: {
      repulsed: "The breakout from the pocket was thrown back whole, and the ring never lost its shape.",
      heldAtCost: "The ring held against the breakout, at a real cost to the rifle division that held it.",
      broke: "The breakout punched through the ring, and the pocket cost more to finally seal than the plan allowed.",
      gaveGround: "The line gave up a stretch of the ring rather than fight the breakout out where it landed.",
    },
    neglected: {
      divisions: "The tanks closed the ring alone; the rifle armies were never the weight that sealed it shut.",
      armour: "What sealed the ring did it on foot; there was no tank strength left to drive it closed faster.",
      air: "Nothing flew over the pocket's roads from the first hour to the last. Whatever moved on them, moved unmolested.",
      supply: "What reached Minsk got there running on what it started with — the rear services never caught up to the advance.",
    },
    commander: {
      chernyakhovsky: "Chernyakhovsky's rifle armies are still holding every stretch of the ring they sealed.",
      rotmistrov: "5th Guards Tank Army, what's left of it, is still screening the ground it drove to take.",
    },
  },
  anzio44: {
    counter: {
      repulsed: "The German blocking force at the roads out of the beachhead was brushed aside, and the column that forced them stayed intact.",
      heldAtCost: "The roads out of the beachhead stayed open, at a real cost to the column that forced them.",
      broke: "The German blocking force sealed the roads before the column could force them, and the beachhead paid for the attempt anyway.",
      gaveGround: "The column pulled back onto the beachhead rather than force roads that were no longer open.",
    },
    neglected: {
      assault: "The beachhead's own perimeter was left thin to feed the push inland — what holds it now is mostly the ground itself.",
      armor: "Nothing pushed past the beachhead's own edge; whatever window the roads offered, it closed unused.",
      rangers: "No vanguard went out ahead of the main line, and nobody found out what was past it until the main line did.",
      naval: "The buildup off the ships never caught up to what came ashore that first day — the beachhead is living on what it landed with.",
    },
    commander: {
      truscott: "Truscott's own division still holds the ground its column pushed to take.",
      penney: "Penney's division is still dug in on the perimeter it squared away that first day.",
      darby: "Darby's Rangers are still the furthest element out from the beach, exactly where he put them.",
    },
  },
  arnhemPerimeter44: {
    counter: {
      repulsed: "The assault on the perimeter's line was thrown back whole, PIATs and six-pounders both.",
      heldAtCost: "The perimeter's line held against the assault, at a cost the sector that held it is still counting.",
      broke: "The German assault broke into the perimeter, and the line was fought back inch by inch to close it again.",
      gaveGround: "The perimeter pulled back to a tighter line rather than fight the assault out where it landed.",
    },
    neglected: {
      corpsPush: "The column never reached past where it already was; whatever the road might have offered, nobody drove for it.",
      perimeter: "The horseshoe held on what it already had — no one went forward to the wire who wasn't there already.",
      resupply: "Nothing extra came down that day; the division ate whatever it already had on hand and no more.",
      poles: "No boats went out; the brigade stayed on the south bank watching a crossing nobody attempted.",
    },
    commander: {
      horrocks: "Horrocks still has his corps as close to the river as it ever got that day.",
      urquhart: "Urquhart's division still holds the ground its own perimeter line was drawn on.",
      sosabowski: "Sosabowski's brigade still holds the south bank position it crossed from.",
    },
  },
  pq17_1942: {
    counter: {
      repulsed: "The pack attack on the convoy was broken up before it pressed home, and the column sailed on in company.",
      heldAtCost: "The convoy held together, at the cost of ships the escort couldn't cover in time.",
      broke: "The pack pressed home through the screen, and the convoy took losses it couldn't make good.",
      gaveGround: "The escort pulled the column into a tighter, slower formation rather than fight the pack out where it struck.",
    },
    neglected: {
      escorts: "The screen stayed exactly as thin as it started; the convoy's own perimeter never got the extra weight it needed.",
      aaShips: "Nothing extra was done to thicken the flak; the auxiliaries fought the air threat with what they already had.",
      coveringForce: "Hamilton's cruisers held their distant station, unchanged, the whole voyage through.",
      intelligence: "The plot room's warnings stayed at their existing pace; the convoy sailed blind to more than it should have.",
    },
    commander: {
      broome: "Broome's destroyers are still the tightest screen this convoy had the whole voyage.",
      hamilton: "Hamilton's cruiser squadron is still standing exactly where he placed it against the threat that never came.",
    },
  },
  bomberDirective43: {
    counter: {
      repulsed: "The fighter attack on the formation was broken up before it pressed home, and the box held its course intact.",
      heldAtCost: "The formation held together, at a cost in aircraft the box couldn't cover in time.",
      broke: "The attack pressed home through the box, and the formation took losses it couldn't make good.",
      gaveGround: "The lead group pulled the formation into a tighter, slower box rather than fight the attack out where it struck.",
    },
    neglected: {
      formation: "The box held whatever interval it already had; no extra effort went into keeping the wings tight.",
      escort: "The fighter escort flew its briefed profile and nothing more; no extra minutes were bought at the turnback line.",
      targeting: "The bomb run got no extra attention; the groups flew it exactly as briefed, nothing tightened.",
      diversion: "The diversion flew its own track and nothing more elaborate was asked of it.",
    },
    commander: {
      lemay: "LeMay's own combat box is still the tightest formation this mission flew, start to finish.",
      kepner: "Kepner's Thunderbolts are still the reason the handoff near Aachen went as cleanly as it did.",
      eaker: "Eaker's own target list is still what every lead bombardier on this mission flew to.",
    },
  },
  sedan40: {
    counter: {
      repulsed: "The French tanks that came at the bridgehead at first light were broken up on the heights above Sedan.",
      heldAtCost: "The bridgehead held against the French tanks, at a cost the regiments on the heights still feel.",
      broke: "The French tanks broke into the bridgehead at first light, and it took a day to seal the breach.",
      gaveGround: "The bridgehead gave up the heights to the French tanks and fell back to the river bank to hold it.",
    },
    neglected: {
      assault: "Too few riflemen and pioneers went over in the first boats, and the men on the far bank were counting rounds all night.",
      air: "The bombers hardly flew, and the French behind the bunkers kept their nerve and their guns until the very end.",
      guns: "The guns were never fired in earnest, and the bunkers were still firing when the boats went down to the water.",
      bridging: "The bridge was late, and the panzers stood on the near bank through the night, watching the far one.",
    },
    commander: {
      guderian: "Guderian is still on the river bank, hurrying the engineers and the traffic over the bridge.",
      balck: "Balck's regiment is still holding the heights above the river that it took on the first afternoon.",
      loerzer: "Loerzer's bombers are still flying over the French line in small waves, every few minutes.",
    },
  },
  moscow41: {
    counter: {
      repulsed: "The German counterattack on the shoulder of the advance was beaten off and the advance went on.",
      heldAtCost: "The shoulder of the advance held against the German counterattack, but the divisions that held it are badly worn.",
      broke: "The Germans broke into the shoulder of the advance, and the armies on either side had to stop and fight for it.",
      gaveGround: "The shoulder gave ground to the German counterattack, and the advance beside it slowed to stay in touch.",
    },
    neglected: {
      reserves: "There were never enough fresh divisions to follow up, and the front stopped when the first wave ran out.",
      exploitation: "The cavalry and ski columns stayed behind the line, and the Germans got out of the villages the horsemen might have cut off.",
      air: "The sky over the advance belonged to nobody, and the columns on the roads were bombed as they moved.",
      supply: "The railway brought up men and not the shells and the winter clothing, and the front paid for that in the cold.",
    },
    commander: {
      zhukov: "Zhukov has the fresh armies in one hand and is already planning the next blow.",
      belov: "Belov's horsemen are still out beyond the German strongpoints, in the snow.",
    },
  },
  britainDay40: {
    counter: {
      repulsed: "The second raid was met by squadrons already back in the air and turned away from London's docks.",
      heldAtCost: "The second raid was held off, at the price of squadrons going up with their tanks barely full.",
      broke: "The second raid broke through to the docks while 11 Group's squadrons were still on the ground refuelling.",
      gaveGround: "Park pulled his squadrons back to cover the sector stations, and the second raid reached the docks.",
    },
    neglected: {
      squadrons: "11 Group's own squadrons were held back, and the raids reached London with fewer fighters in their way.",
      control: "The plot was thin and late, and the controllers were putting squadrons where the raid had been.",
      wing: "The Duxford Wing was never called, and the northern group's fighters stayed on the ground.",
      turnaround: "The squadrons were not turned round in time, and the second raid found the sky nearly empty.",
    },
    commander: {
      park: "Park's squadrons still go up to meet each raid in ones and twos, well forward of London.",
      dowding: "Dowding's plot and controllers are still the thing that tells Fighter Command where to be.",
      leighMallory: "Leigh-Mallory's wing is still flying south from Duxford in one mass, and the argument over it is still unsettled.",
    },
  },
  // Fifteen months later (europeFirst42): only the commander's mark, and the neglected arm, survive.
  britainDayLater: {
    counter: {},
    neglected: {
      squadrons: "Fighter Command still remembers the day 11 Group's squadrons were held back.",
      control: "Fighter Command still remembers the day the plot was thin and the controllers were behind it.",
      wing: "Fighter Command still remembers the argument over the wing that was never called.",
      turnaround: "Fighter Command still remembers the day the squadrons were not turned round in time.",
    },
    commander: {
      park: "Fighter Command still talks about the September day Park put every squadron he had into the air.",
      dowding: "Fighter Command still talks about the September day Dowding's system did what he had built it to do.",
      leighMallory: "Fighter Command still argues about the September day the wing flew south from Duxford.",
    },
  },
  alps40: {
    counter: {
      repulsed: "The French counterattack on the new line was thrown back and the line stayed where it was.",
      heldAtCost: "The line held against the French counterattack, at a cost the mountain troops will remember.",
      broke: "The French broke into the line, and the fight went on in the snow at close range for hours.",
      gaveGround: "The line fell back off the high ground rather than fight the counterattack out where it struck.",
    },
    neglected: {
      assault: "The Alpini barely climbed, and the guns and aircraft had nothing to cover while they stayed at the bottom.",
      artillery: "The guns hardly fired, and whatever the infantry met in the passes it met without them.",
      air: "The Regia Aeronautica never flew a mission that mattered to the men climbing, and no one on the ground missed it.",
      supply: "The mules and the road were never fixed, and the front was short of everything but cold and snow.",
    },
    commander: {
      guzzoni: "Guzzoni's army is still strung out along the Little St Bernard road, the main attack's weight behind it.",
    },
  },
  uranus: {
    counter: {
      repulsed: "The German counterattack on the flank of the pincers was beaten off, and the ring closed behind it.",
      heldAtCost: "The flank of the pincers held against the German counterattack, but the corps that held it are worn.",
      broke: "The Germans broke into the flank of the pincers, and it took days to seal the break.",
      gaveGround: "The head of the advance gave ground to the German counterattack, and the ring closed a day late.",
    },
    neglected: {
      breakthrough: "There were too few infantry behind the first assault, and the line in front of the mobile corps was never properly broken.",
      armour: "The mobile corps never raced for the Don, and the ring closed late and thin.",
      air: "The air armies never flew, and the Romanian guns and the German reserve moved freely.",
      supply: "The railways were not pushed forward, and the corps ran dry short of the Don.",
    },
    commander: {
      vatutin: "Vatutin's armies hold the line they broke on the first morning.",
      romanenko: "Romanenko's tank army is still the point of the northern pincer.",
    },
  },
  dynamo40: {
    counter: {
      repulsed: "The German attack on the perimeter was beaten off, and the lift went on behind the line.",
      heldAtCost: "The perimeter held against the attack, but the units that held it came home as remnants.",
      broke: "The Germans broke through the canal line, and the beaches were in range of their guns for a day.",
      gaveGround: "The rearguard fell back to a shorter line, and the last of the lift was crowded into less ground.",
    },
    neglected: {
      navy: "The big ships were never sent in, and the mole stood idle while men waited on the sand.",
      smallCraft: "The small boats never worked the beaches, and the men on the sand waited for ships that could not come close.",
      air: "The sky over the beaches belonged to the Luftwaffe, and the ships were bombed as they loaded.",
      perimeter: "The perimeter was held thinly, and it nearly gave way before the lift was done.",
    },
    commander: {
      ramsay: "Ramsay's staff at Dover are still sending ships across the Channel.",
      park: "Park's squadrons are still flying their patrols over the beaches.",
      alexander: "Alexander's rearguard is still holding the canal line.",
    },
  },
  epirus40: {
    counter: {
      repulsed: "The Greek attack on the heights was thrown back, and the line stayed where it was.",
      heldAtCost: "The Alpini held the heights against the Greeks, but the battalions that held them were badly cut up.",
      broke: "The Greeks broke onto the heights, and the fighting went on for hours in the dark.",
      gaveGround: "The line fell back off the heights rather than fight the Greek attack out where it struck.",
    },
    neglected: {
      reserves: "The reserve divisions stayed at the ports, and the line was held by what was already on it.",
      alpini: "The high ground was never properly held, and the Greeks used it.",
      air: "The air force barely flew over the passes, and the Greeks moved in daylight.",
      ports: "The ports and the tracks were left to clog, and the front was short of everything but mud.",
    },
    commander: { cavallero: "Cavallero is still feeding the divisions into the line as they land." },
  },
  crete41: {
    counter: {
      repulsed: "The counterattack on the airfield was beaten off, and the mountain troops went on landing.",
      heldAtCost: "The paratroopers held the edge of the airfield, but the units that held it were almost gone.",
      broke: "The defenders broke into the airfield, and the landings stopped for hours under fire.",
      gaveGround: "The paratroopers gave up the edge of the airfield and fell back on the hill.",
    },
    neglected: {
      paratroops: "Too few paratroopers dropped, and the airfields were never properly threatened.",
      air: "The Luftwaffe was thin over the island, and the Royal Navy went where it liked.",
      sea: "The convoys were never properly covered, and the heavy equipment never arrived.",
      mountain: "The mountain troops waited on the mainland, and there was no reinforcement to land.",
    },
    commander: {
      student: "Student is still sending every paratrooper he has into the island.",
      richthofen: "Richthofen's bombers are still working over the island and the sea.",
      ringel: "Ringel's mountain troops are still being flown in as fast as the runway allows.",
    },
  },
  bastogne44: {
    counter: {
      repulsed: "The German counterattack on the corridor was beaten off, and the road stayed open.",
      heldAtCost: "The shoulder of the corridor held, but the infantry that held it were worn out.",
      broke: "The Germans broke into the corridor, and the road was cut until the break was sealed.",
      gaveGround: "The shoulder gave ground, and the corridor was narrowed to the width of the road.",
    },
    neglected: {
      armour: "No armoured spearhead led the relief, and the road was forced on foot.",
      infantry: "The flanks of the road were left open, and every convoy was attacked from the side.",
      air: "The aircraft never flew for the garrison, and the town went on without them.",
      garrison: "The garrison was left to hold the town on what it had, and its ammunition ran short.",
    },
    commander: {
      patton: "Patton has the armour on the road to Bastogne and is already looking beyond the town.",
      millikin: "Millikin's infantry are still holding the shoulders of the corridor.",
      mcauliffe: "McAuliffe's garrison is still holding the town it refused to surrender.",
    },
  },
  matapan41: {
    counter: {
      repulsed: "The ships acted as one, and the British attack was driven off before it did any harm.",
      heldAtCost: "The fleet got away, but the ships that covered it were badly hit.",
      broke: "The British guns found the cruisers at point-blank range, and the ships were lost in minutes.",
      gaveGround: "The fleet turned away from the fight and left a part of itself behind.",
    },
    neglected: {
      battle: "The battle fleet was left slow and spread out, and its screen was never properly formed.",
      cruisers: "The cruiser divisions were left to look after themselves, and they paid for it in the dark.",
      air: "No cover and no reconnaissance came, and the fleet fought blind.",
      signals: "No one rehearsed the night action, and the fleet met it with the drills of a day battle.",
    },
    commander: {
      iachino: "Iachino has brought the battle fleet home and is already writing his report.",
      cattaneo: "Cattaneo's cruisers are still the screen of the fleet.",
    },
  },
  monteLungo43: {
    counter: {
      repulsed: "On the hill in December the German counterattack was thrown back up the slope, and the Group kept the ground it had won.",
      heldAtCost: "On the hill in December the Group held against the Germans, but the companies that held were badly cut up.",
      broke: "On the hill in December the Germans broke into the leading companies and threw them back down the slope.",
      gaveGround: "On the hill in December the Group gave up the exposed slope rather than meet the Germans on it.",
    },
    neglected: {
      infantry: "On Monte Lungo the regiment hardly went up the hill, and what was done there was done by the guns.",
      bersaglieri: "The cadets were left at the foot of the hill in December and took no part in the first attack.",
      guns: "The guns on Monte Lungo never fired in earnest, and the infantry went up the hill without them.",
      recon: "The Group went up Monte Lungo without finding the German line first, and the line found the Group.",
    },
    commander: {
      dapino: "Dapino's Group is still talking about the hill in the mist.",
    },
  },
  adriaticRoad44: {
    counter: {
      repulsed: "At Filottrano the German counterattack on the slope was beaten back, and the paratroopers kept their ground.",
      heldAtCost: "At Filottrano the paratroopers held the slope against the Germans, at a heavy cost to the battalion that held it.",
      broke: "At Filottrano the Germans broke into the battalion on the slope, and it came to hand-to-hand fighting in the olive groves.",
      gaveGround: "At Filottrano the battalion gave up the slope rather than meet the counterattack on it.",
    },
    neglected: {
      nembo: "At Filottrano the Nembo hardly went up the hills; the town was taken by the guns and the Polish tanks.",
      armour: "The Polish tanks were hardly asked for at Filottrano, and the paratroopers went up the hills without them.",
      artillery: "The guns were kept back at Filottrano, and the paratroopers went up the hills without them.",
      supply: "The Corps went up to Filottrano on what it could carry, and the trucks never caught up.",
    },
    commander: {
      utili: "Utili's Corps has the town it was offered, and the Poles have noticed.",
      anders: "Anders's armour stood close behind the Italians all the way to Ancona.",
    },
  },
  springOffensive45: {
    counter: {
      repulsed: "At the Senio the German counterattack on the bridgehead was beaten back, and the Group kept the far bank.",
      heldAtCost: "At the Senio the bridgehead held against the Germans, at a heavy cost to the battalion that held it.",
      broke: "At the Senio the Germans broke into the bridgehead, and it came to hand-to-hand fighting at the water's edge.",
      gaveGround: "At the Senio the Group gave up its furthest ground on the far bank rather than meet the counterattack on it.",
    },
    neglected: {
      assault: "At the Senio the Group's own infantry hardly crossed, and the town was taken by others.",
      flame: "The Group asked for no flame-throwers at the Senio, and the posts in the bank were left to the infantry.",
      fire: "The Group asked for no special fire at the Senio, and went over under the plan V Corps made for everyone.",
      bridging: "The Group crossed the Senio before the engineers had made the way, and the men on the far bank were left alone.",
    },
    commander: {
      primieri: "Primieri's regiments are the first the Group has put across a river.",
      keightley: "Keightley's corps fired its barrages on the timetable it set, and the Group crossed behind them.",
    },
  },
  brodyCounterstroke41: {
    counter: {
      repulsed: "The German tanks that turned on the flank were beaten off, and the corps kept their line.",
      heldAtCost: "The flank held against the German tanks, but at a heavy cost in tanks and men.",
      broke: "The German tanks broke into the flank of the leading corps, and the Soviet tanks had to turn and fight in the open.",
      gaveGround: "The leading corps pulled back from the flank rather than meet the German tanks on open ground.",
    },
    neglected: {
      armour: "The tank corps were hardly committed, and the infantry took the weight of the fight alone.",
      infantry: "The infantry were left behind on the border, and the tanks went forward without them.",
      air: "No aircraft covered the corps' march, and the roads were open to the Germans.",
      signals: "The corps moved as their commanders saw fit, since no orders reached them over the cut lines.",
    },
    commander: {
      ryabyshev: "Ryabyshev's corps is what is left of it, after the road to Brody.",
      rokossovsky: "Rokossovsky's infantry rode the tanks to the fight and are still with them.",
      zhukov: "Zhukov has gone back to Moscow, and the front's staff have kept to the order he gave.",
    },
  },
  rzhevVyazma42: {
    counter: {
      repulsed: "The German counterattack on the shoulder of the gap was beaten off, and the corridor stayed open.",
      heldAtCost: "The shoulder of the gap held against the Germans, at a heavy cost to the division that held it.",
      broke: "The Germans broke into the neck of the corridor, and the armies on either side had to fight to reopen it.",
      gaveGround: "The shoulder of the gap gave ground, and the corridor was narrowed to the width of a single road.",
    },
    neglected: {
      armies: "The armies were hardly pushed into the breach, and the gap stayed as narrow as the first attack left it.",
      cavalry: "No horsemen rode into the German rear, and the pincers had nothing ahead of them.",
      airborne: "The paratroopers stayed on their airfields, and the highway behind the Germans was left open to them.",
      supply: "The forces in the German rear lived on what they had, and the railway never reached them.",
    },
    commander: {
      belov: "Belov's horsemen are still somewhere in the German rear.",
      yefremov: "Yefremov's army is out at the end of the gap, and his men are counting what they have left.",
      levashev: "Levashev's paratroopers are down in the forest behind the Germans, fewer than were counted.",
    },
  },
  kievPocket41: {
    counter: {
      repulsed: "At Kiev the Soviet breakout was beaten back along the whole of the ring, and the pocket stayed shut.",
      heldAtCost: "At Kiev the ring held against the breakout, at a heavy cost to the infantry divisions that held it.",
      broke: "At Kiev the Soviet armies broke through the ring at one point, and the road behind the panzers was cut for a day.",
      gaveGround: "At Kiev the ring gave way at its thinnest point, and thousands of men went through it.",
    },
    neglected: {
      northPincer: "At Kiev Guderian's group was hardly pushed, and the northern jaw closed slowly.",
      southPincer: "At Kiev Kleist's group stayed in its bridgehead too long, and the southern jaw was late.",
      infantry: "At Kiev the infantry armies were left to follow on foot, and the ring was thin when the panzers had closed it.",
      air: "At Kiev the Luftwaffe was thin over the gap, and the Soviet columns moved on the roads by day.",
    },
    commander: {
      guderian: "Guderian is still arguing that the panzers should have been sent to Moscow.",
      kleist: "Kleist's panzers are across the Dnieper and not turning back.",
    },
  },
  kharkovBackhand43: {
    counter: {
      repulsed: "At Kharkov the Soviet counterattack on the flank of the counterblow was beaten off, and the panzers went on.",
      heldAtCost: "At Kharkov the flank held against the Soviet attack, at a heavy cost to the infantry that held it.",
      broke: "At Kharkov the Soviet tanks broke into the flank of the counterblow, and the panzers had to turn and fight.",
      gaveGround: "At Kharkov the line on the flank gave ground, and the counterblow had to be narrowed to protect it.",
    },
    neglected: {
      ssCorps: "At Kharkov the SS divisions were held at the edge of the city, and the city was taken late.",
      panzerArmy: "At Kharkov the panzer armies were hardly sent into the flank, and the Soviet spearheads got away.",
      infantry: "At Kharkov the infantry were left to hold the line alone, and it bent more than once.",
      air: "At Kharkov the Fourth Air Fleet flew no more than it had, and the panzers fought without cover on the roads.",
    },
    commander: {
      hausser: "Hausser has his city back, and he took it after leaving it once against orders.",
      hoth: "Hoth's panzer army is strung out along the Donets, a long way from where it began.",
    },
  },
  ardennesWacht44: {
    counter: {
      repulsed: "In the Ardennes the American attack on the southern flank was thrown back, and the shoulder held.",
      heldAtCost: "In the Ardennes the southern flank held against the Americans, at a heavy cost to the divisions that held it.",
      broke: "In the Ardennes the Americans broke through the southern flank, and the Fifth Panzer Army had to turn to meet them.",
      gaveGround: "In the Ardennes the southern flank gave ground, and the whole offensive had to be narrowed to protect it.",
    },
    neglected: {
      sixthSS: "In the Ardennes the Sixth SS Panzer Army was hardly pushed, and it moved at the pace of its supply.",
      fifthPanzer: "In the Ardennes the Fifth Panzer Army was given no more, and its divisions moved slowly through the forest.",
      seventhArmy: "In the Ardennes the Seventh Army was left thin on the southern shoulder, and covered it badly.",
      fuelColumns: "In the Ardennes no more fuel was brought up, and the spearheads drove on what they carried.",
    },
    commander: {
      dietrich: "Dietrich's army is still on the northern roads, and nobody can say how far Peiper got.",
      manteuffel: "Manteuffel's panzers are in the forest, and he knows exactly how much fuel they have.",
    },
  },
  kurskSoviet43: {
    counter: {
      repulsed: "At Kursk the German wedge was stopped in the minefield, and the reserve was not needed.",
      heldAtCost: "At Kursk the line held against the German tanks, at a heavy cost in guns and men.",
      broke: "At Kursk the German tanks broke through the first belt, and the reserve had to be thrown in to close the gap.",
      gaveGround: "At Kursk the forward position was given up rather than meet the wedge on open ground.",
    },
    neglected: {
      infantry: "At Kursk the forward belts were thinly held, and the attack met only the outposts.",
      antiTank: "At Kursk the strongpoints were left as they were, and few more guns and mines were put into them.",
      tanks: "At Kursk the tank reserve was held back, and the belts held alone.",
      air: "At Kursk the air armies flew what they already had, and the German columns moved without much hindrance.",
    },
    commander: {
      rokossovsky: "Rokossovsky's guns opened before the Germans did, and his belts are intact.",
      vatutin: "Vatutin's rifle armies took the blow in the south, and they are still counting.",
      rotmistrov: "Rotmistrov's tank army is what the reserve was for, and he knows what it cost.",
    },
  },
  stalingradCity42: {
    counter: {
      repulsed: "In the city the German assault was stopped in the ruins before it reached the river, and the strip held.",
      heldAtCost: "In the city the strip held against the German attack, at a heavy cost in the assault groups.",
      broke: "In the city the Germans broke through to the river, and the strip was divided in two.",
      gaveGround: "In the city the defenders gave up a block of ruins rather than be cut off in them.",
    },
    neglected: {
      rifle: "In the city no more divisions were sent across the river, and the strip was held by what was in it.",
      guns: "In the city the guns on the east bank were not asked for more, and fired what they had.",
      groups: "In the city no more assault groups were put into the ruins, and the Germans moved more freely through them.",
      ferries: "In the city no more boats were put on the river, and what crossed was what the ferries could carry.",
    },
    commander: {
      rodimtsev: "Rodimtsev's guardsmen are still in the centre of the city, and there are fewer of them.",
      chuikov: "Chuikov's army has not given up its strip, and he does not mean to.",
    },
  },
  seelow45: {
    counter: {
      repulsed: "At Seelow the German counterattack at the foot of the heights was thrown back, and the infantry kept their ground.",
      heldAtCost: "At Seelow the line held against the Germans, at a heavy cost in the battalions that held it.",
      broke: "At Seelow the Germans broke into the flank of the penetration, and the infantry had to fall back to the road.",
      gaveGround: "At Seelow the foremost battalions gave up the slope rather than be cut off on it.",
    },
    neglected: {
      barrage: "At Seelow the barrage was thin, and the German trenches were barely touched.",
      rifle: "At Seelow the rifle armies were held back, and the first wave went forward alone.",
      tanks: "At Seelow the tank armies were held in their assembly areas, and the infantry fought for the heights without them.",
      engineers: "At Seelow no more engineers went to the plain, and the crossings were made on what already stood.",
    },
    commander: {
      zhukov: "Zhukov has his barrage, and Stalin has his answer from Konev.",
      chuikov: "Chuikov's army is below the heights, and he has taken a city before.",
      katukov: "Katukov's tanks are on the one dry road, and nobody can pass them.",
    },
  },
};
// Round 22: the War Record's Battle Record lists every battle by name, in campaign order, with the
// campaign seal it belongs to. Fought battles show their record; the others show as blanks.
const KEY_BATTLE_TITLES = [
  { id: "sedan40", seal: "OKW", title: "The Crossing at Sedan" },
  { id: "crete41", seal: "OKW", title: "Operation Mercury" },
  { id: "kievPocket41", seal: "OKW", title: "The Kiev Pocket" },
  { id: "elAlamein", seal: "OKW", title: "The Push to Alam Halfa" },
  { id: "stalingrad", seal: "OKW", title: "The Breakout West" },
  { id: "kharkovBackhand43", seal: "OKW", title: "Manstein's Backhand Blow" },
  { id: "kursk", seal: "OKW", title: "The Kursk Salient" },
  { id: "ardennesWacht44", seal: "OKW", title: "Watch on the Rhine" },
  { id: "brodyCounterstroke41", seal: "STAVKA", title: "Dubno, Lutsk, Brody" },
  { id: "moscow41", seal: "STAVKA", title: "The Blow Before Moscow" },
  { id: "rzhevVyazma42", seal: "STAVKA", title: "The Pincers at Vyazma" },
  { id: "stalingradCity42", seal: "STAVKA", title: "The Strip on the Volga" },
  { id: "uranus", seal: "STAVKA", title: "Operation Uranus" },
  { id: "kurskSoviet43", seal: "STAVKA", title: "The Kursk Belts" },
  { id: "bagrationSoviet44", seal: "STAVKA", title: "The Drive on Minsk" },
  { id: "seelow45", seal: "STAVKA", title: "The Seelow Heights" },
  { id: "dynamo40", seal: "SHAEF", title: "Operation Dynamo" },
  { id: "britainDay40", seal: "SHAEF", title: "Battle of Britain Day" },
  { id: "pq17_1942", seal: "SHAEF", title: "Holding the Convoy Together" },
  { id: "bomberDirective43", seal: "SHAEF", title: "The Second Schweinfurt Mission" },
  { id: "anzio44", seal: "SHAEF", title: "The Beachhead's First Hours" },
  { id: "omaha", seal: "SHAEF", title: "Omaha, Mid-Morning" },
  { id: "arnhemPerimeter44", seal: "SHAEF", title: "The Corridor and the Perimeter" },
  { id: "bastogne44", seal: "SHAEF", title: "The Relief of Bastogne" },
  { id: "alps40", seal: "COMANDO", title: "The Little St Bernard" },
  { id: "epirus40", seal: "COMANDO", title: "The Pindus Winter" },
  { id: "matapan41", seal: "COMANDO", title: "Cape Matapan" },
  { id: "monteLungo43", seal: "COMANDO", title: "Monte Lungo, First Attack" },
  { id: "monteCassino44", seal: "COMANDO", title: "Monte Marrone" },
  { id: "adriaticRoad44", seal: "COMANDO", title: "Filottrano" },
  { id: "springOffensive45", seal: "COMANDO", title: "The Senio at Alfonsine" },
];
const BATTLE_GRADE_ORDER = ["total", "marginal", "costly", "clean"]; // worst to best

function keyBattleEcho(echoId, flags, battleId) {
  const E = KEY_BATTLE_ECHOES[echoId];
  const id = battleId || echoId;
  if (!E) return "";
  const parts = [];
  const counter = flags[`${id}Counter`];
  if (counter && E.counter[counter]) parts.push(E.counter[counter]);
  const neglected = flags[`${id}PlanNeglected`];
  const commander = flags[`${id}PlanCommander`];
  if (neglected && E.neglected[neglected]) parts.push(E.neglected[neglected]);
  else if (commander && E.commander[commander]) parts.push(E.commander[commander]);
  return parts.length ? " " + parts.join(" ") : "";
}

function keyBattleCategories(config) {
  return (config && config.categories) || BATTLE_ALLOCATION_CATEGORIES;
}

function computeBattleContributions(categories, plan, weights, poolSize, reserve) {
  const res = reserve || {};
  const spent = categories.reduce((a, c) => a + (plan[c.id] || 0) + (res[c.id] || 0), 0);
  // Round 12: fair share is what an even split of the pool would give each category. Below it,
  // a category owes a penalty graded by the shortfall, linearly (Round 16 — see the comments
  // above this function and on the penalty line below); at or above it, nothing.
  const fairShare = poolSize / categories.length;
  const out = {};
  for (const c of categories) {
    const p = plan[c.id] || 0;
    const r = res[c.id] || 0;
    const finalCount = p + r;
    const value = finalCount > 0 ? (p + r * KEY_BATTLE_RESERVE_MULT) * (weights[c.id] || 0) : 0;
    let penalty = 0;
    if (spent >= poolSize / 2 && finalCount < fairShare) {
      // Round 16 superseded the 1/4-power curve this comment used to describe — see the
      // Round 16 comment above this function for why. Short version: that curve's own concavity
      // made the LAST chit before fair share worth far more than its raw weight (it bought back
      // almost the whole remaining penalty at once), which a "top everyone up to fair share, dump
      // the leftover" plan could exploit for a bigger net gain than the one-chit hedge the old
      // check screened for. Linear removes that: every missing chit costs the same fixed slice of
      // KEY_BATTLE_NEGLECT_PENALTY, first or last, so there's no crossing point worth camping on.
      // The earlier note that "linear lets the one-chit hedge win" was true at the OLD constant
      // (4.5) — raising a linear penalty's constant to compensate for the shape change is what
      // widened the hedge's margin back then. It was never linear-vs-power that mattered; it was
      // never re-tuning the constant alongside the shape. 1.5 is the largest constant that clears
      // both the original 250 check-battle-balance.js scenarios AND an exhaustive search over
      // every possible allocation (not just the hand-picked hedge/concentration shapes) across
      // every battle, posture, and pool size 5-8.
      penalty = KEY_BATTLE_NEGLECT_PENALTY * ((fairShare - finalCount) / fairShare);
    }
    out[c.id] = value - penalty;
  }
  return out;
}

function sumBattleContributions(contributions) {
  return Object.values(contributions).reduce((a, v) => a + v, 0);
}

function clampBattleBonus(raw) {
  return Math.max(-KEY_BATTLE_BONUS_CLAMP, Math.min(KEY_BATTLE_BONUS_CLAMP, Math.round(raw)));
}

// Round 9, Craig's item #3 (consequences that depend on the plan, not just the odds). Small,
// legible rules keyed off each category's own `meter`, so they generalize to any battle's
// categories: a category holding at least half the pool costs its meter 1 (you spent that
// resource hard); a WIN with nothing neglected earns +1 Initiative (a coordinated plan leaves
// the staff ahead of events); a reserve of 2+ chits held back and never committed returns +1
// Manpower. Each meter's net plan cost is capped to [-2, +1] so the plan can sting but never
// outweigh the battle's own historical outcome impact.
function computeBattlePlanCosts({ categories, finalAllocation, poolSize, contributions, won, reservesHeld, counter, extraLines, attrition }) {
  const lines = [];
  // Round 22: costs chosen at a mid-battle decision (extraLines: [{meter, delta, reason}]) and a
  // battle's own attrition rules (attrition: [{category, atLeast, meter, delta, reason}], e.g. the
  // frostbite on the Alps or the cold before Moscow) read exactly like the rules below. They go
  // through the same [-2, +1] cap per meter, so a battle can sting but never outweigh its outcome.
  for (const l of extraLines || []) lines.push({ meter: l.meter, delta: l.delta, reason: l.reason });
  for (const a of attrition || []) {
    if ((finalAllocation[a.category] || 0) >= a.atLeast) lines.push({ meter: a.meter, delta: a.delta, reason: a.reason });
  }
  // Round 10: the counterattack's own cost. Repulsing it is free; holding it at a cost, or
  // being broken, costs the meter of the arm that met it; giving ground costs tempo.
  if (counter && counter.result !== "repulsed") {
    const cat = categories.find((c) => c.id === counter.category);
    if (counter.result === "gaveGround") {
      lines.push({ meter: "initiative", delta: -1, reason: "Gave ground to the counterattack" });
    } else if (cat) {
      lines.push({ meter: cat.meter, delta: -1, reason: `${cat.name} mauled by the counterattack` });
      if (counter.result === "broke") lines.push({ meter: "initiative", delta: -1, reason: "The counterattack broke through" });
    }
  }
  for (const c of categories) {
    if ((finalAllocation[c.id] || 0) >= poolSize / 2) {
      lines.push({ meter: c.meter, delta: -1, reason: `Heavy commitment to ${c.name}` });
    }
  }
  // Round 24 (double jeopardy): an arm left uncovered used to cost its meter a point on a loss as well. The gap has
  // already cost the plan its odds (the neglect penalty) and set the grade, and a loss carries its own impact, so
  // charging it again was charging the same fault three times. A win with nothing neglected still earns the point.
  const neglected = categories.filter((c) => (contributions[c.id] || 0) < 0);
  if (won && neglected.length === 0) {
    lines.push({ meter: "initiative", delta: 1, reason: "A coordinated plan" });
  }
  if (reservesHeld >= 2) lines.push({ meter: "manpower", delta: 1, reason: "Reserve returned intact" });
  const totals = { manpower: 0, fuel: 0, initiative: 0 };
  for (const l of lines) totals[l.meter] = (totals[l.meter] || 0) + l.delta;
  for (const m of Object.keys(totals)) totals[m] = Math.max(-2, Math.min(1, totals[m]));
  // Round 13, Craig's item #1 ("graded outcomes, not strict binary win/lose"). Deliberately NOT a
  // second dice roll or a change to the shared uncertain[] mechanic (that roll is game-wide, used
  // for hundreds of choices — too risky to touch for one subsystem). Instead a quality axis
  // layered on top of the same signals this function already computes for meter costs: a win with
  // nothing neglected and no counterattack cost reads as "clean"; any win that neglected a
  // category or paid for a counterattack reads as "costly" — same battle, different texture. A
  // loss is graded the other way: "marginal" when the plan itself held up (0-1 neglected
  // categories) and the roll simply went the other way — the plan wasn't the problem, the dice
  // were — versus "total" when 2+ categories were left short or the counterattack broke through
  // outright, i.e. the plan itself gave out, not just the roll.
  const grade = won
    ? neglected.length === 0 && (!counter || counter.result === "repulsed")
      ? "clean"
      : "costly"
    : neglected.length >= 2 || (counter && counter.result === "broke")
    ? "total"
    : "marginal";
  return { lines, totals, grade };
}

// Round 22, field decisions (config.decisions). Mid-battle choices written for each battle from
// the real alternatives its day offered. Each option has a flat `bonus` toward the roll, optionally
// an extra `bonusByPosture` for the enemy posture in force when the decision is made (the later
// of the battle's postures, when it has two phases), optional `meters` costs, and an optional
// `severity` change to the counterattack that follows. Pure, so the balance check can run the same
// code the screen does.
function battleDecisionEffect(option, postureId) {
  const byPosture = (option.bonusByPosture && postureId && option.bonusByPosture[postureId]) || 0;
  const lines = Object.entries(option.meters || {}).map(([meter, delta]) => ({
    meter,
    delta,
    reason: option.costReason || option.name,
  }));
  return { bonus: (option.bonus || 0) + byPosture, severity: option.severity || 0, lines };
}

// Round 23: the campaign hard modes that can put orders from above on a battle (config.hardRule).
const HARD_MODE_NAMES = { iron: "Führer Mode", purge: "NKVD Mode", coalition: "Coalition Mode", axis: "Axis Mode" };

// Round 23: how a Matériel strand's reading (see materielReadout in logic.ts) changes the weight an
// arm can bring. Each category may name the strand it draws on (category.strand: "oil", "ammo",
// "steel" or "ship"): artillery draws on ammunition, armour on steel, aircraft on fuel and oil, supply
// on shipping and rail. Read once, when the battle screen opens, like the pool size. A strand that reads
// Exhausted (a meter at -8 or below) is shown as worse than Short but weighs the same: the balance check
// holds at 0.85 and fails below it, so the extra danger is in the reading, not in the arithmetic.
const STRAND_BAND_MULT = { Exhausted: 0.85, Short: 0.85, Strained: 0.93, Adequate: 1, Plentiful: 1.06 };

// Weight per effort point for one arm. Pure, so the planning screen, the staff plan and the balance
// check all use the same arithmetic: (jittered base + commander bonus + approach modifier) times the
// enemy posture (the average of the two when a battle has two phases), the ground, and the strand.
function battleArmWeight({ config, catId, jitter, commander, approach, posture, posture2, strandMult }) {
  const base = (config.effectiveness[catId] ?? 1) * (jitter ?? 1);
  const commanderBonus = commander && commander.category === catId ? KEY_BATTLE_COMMANDER_BONUS : 0;
  const approachMod = approach?.modifiers?.[catId] ?? 0;
  const m1 = posture?.modifiers?.[catId] ?? 1;
  const postureMult = posture2 ? (m1 + (posture2.modifiers?.[catId] ?? 1)) / 2 : m1;
  const terrain = config.terrainModifiers?.[catId] ?? 1;
  return (base + commanderBonus + approachMod) * postureMult * terrain * (strandMult ?? 1);
}

// Every way to place exactly `pool` points of effort across the arms.
function allBattleAllocations(categories, pool) {
  const out = [];
  const rec = (i, left, cur) => {
    if (i === categories.length - 1) {
      out.push({ ...cur, [categories[i].id]: left });
      return;
    }
    for (let v = 0; v <= left; v++) rec(i + 1, left - v, { ...cur, [categories[i].id]: v });
  };
  rec(0, pool, {});
  return out;
}

// The enemy setups a battle can be fought against, as scenarios: one posture each, or an ordered
// pair when the battle has two phases (a second-phase-only posture never opens the day).
function battleScenarios(config, postures) {
  if (!postures.length) return [{ posture: null, posture2: null, weight: 1 }];
  if (!config.phases) return postures.map((p) => ({ posture: p, posture2: null, weight: p.weight || 1 }));
  const out = [];
  for (const a of postures) {
    for (const b of postures) {
      if (a.id === b.id || a.only === 2 || b.only === 1) continue;
      out.push({ posture: a, posture2: b, weight: (a.weight || 1) * (b.weight || 1) });
    }
  }
  return out;
}

// "Let your staff plan it". The plan a competent staff would send without knowing what the enemy has
// drawn: the commander, approach and placement of all the effort that does best on average across
// the setups the enemy might show (the historical one counting double where the battle says so). It
// is robust and not clever: it never reads the intelligence, so a player who does can beat it.
function staffPlanFor({ config, categories, poolSize, strandMults, commanders, approaches, postures, commanderRequired }) {
  const scenarios = battleScenarios(config, postures);
  const totalWeight = scenarios.reduce((a, s) => a + s.weight, 0);
  const allocations = allBattleAllocations(categories, poolSize);
  let best = null;
  // The staff name no favourite: no commander unless the orders require one, and no more than half the
  // effort (rounded up) in any one arm, so their plan is balanced rather than clever.
  const cap = Math.ceil(poolSize / 2);
  for (const commander of commanderRequired ? commanders : [null]) {
    for (const approach of approaches.length ? approaches : [null]) {
      const weightSets = scenarios.map((s) =>
        Object.fromEntries(
          categories.map((c) => [
            c.id,
            battleArmWeight({ config, catId: c.id, jitter: 1, commander, approach, posture: s.posture, posture2: s.posture2, strandMult: strandMults?.[c.id] }),
          ])
        )
      );
      for (const allocation of allocations) {
        if (Object.values(allocation).some((v) => v > cap)) continue;
        let expected = 0;
        scenarios.forEach((s, i) => {
          const raw = sumBattleContributions(computeBattleContributions(categories, allocation, weightSets[i], poolSize));
          expected += (s.weight / totalWeight) * clampBattleBonus(raw);
        });
        if (!best || expected > best.expected + 1e-9) {
          best = { commanderId: commander ? commander.id : null, approachId: approach ? approach.id : null, allocation, expected };
        }
      }
    }
  }
  return best;
}

// The field-decision answer a staff gives without knowing the enemy: best on average across setups.
function staffDecisionOption(decision, postures, config) {
  const scenarios = battleScenarios(config || {}, postures);
  const totalWeight = scenarios.reduce((a, s) => a + s.weight, 0);
  let best = null;
  for (const option of decision.options) {
    let score = 0;
    for (const s of scenarios) {
      const latest = s.posture2 || s.posture;
      const e = battleDecisionEffect(option, latest ? latest.id : null);
      score += (s.weight / totalWeight) * (e.bonus + e.lines.reduce((a, l) => a + l.delta, 0) - 2 * e.severity);
    }
    if (!best || score > best.score + 1e-9) best = { option, score };
  }
  return best.option;
}

// One entry per transition (fixed order, so exactly 2 transitions for 3 campaigns — see the
// spec's own reasoning for why fixed order was chosen over player-chosen). Each function reads
// the just-finished campaign's final flags/meters and returns a small, curated seed for the
// next campaign to start with: a couple of new `legacy*`-prefixed flags the next campaign's
// opening node can check, plus a deliberately small meters nudge (never a wholesale transplant
// — see the spec's "curated translation layer, not a raw flag dump" principle). This is
// intentionally thin for a first prototype — 1 flag per transition rather than the spec's
// recommended 4-6 for a shipped version — enough to prove the mechanic works end to end without
// committing to a full content pass before knowing whether Craig likes how it feels.
//
// Both transitions are written as *retrospective* echoes ("history will remember...") rather
// than claims of literal simultaneity — each campaign keeps its own fixed historical start date
// regardless of Grand Campaign (Soviet always opens June 1941, Allied always opens April 1940,
// which is actually *before* a Soviet run played first could have "ended"). Grand Campaign was
// never a shared clock; it's state and flavor carried forward, same as the spec describes.
const GRAND_CAMPAIGN_SEEDS = {
  german_soviet(priorLegacy) {
    const sealion = priorLegacy?.flags?.sealion;
    const westCommitted = sealion === "commit" || sealion === "launched";
    const eastPriority = sealion === "attrition" || sealion === "east";
    return {
      seedFlags: westCommitted
        ? { legacyGermanOpening: "westCommitted" }
        : eastPriority
        ? { legacyGermanOpening: "eastPriority" }
        : {},
      seedMeters: westCommitted ? { initiative: 1 } : eastPriority ? { initiative: -1 } : {},
    };
  },
  soviet_allied(priorLegacy) {
    const initiative = priorLegacy?.meters?.initiative ?? 0;
    const advancing = initiative >= 2;
    const grinding = initiative <= -2;
    return {
      seedFlags: advancing
        ? { legacyEasternFront: "advancing" }
        : grinding
        ? { legacyEasternFront: "grinding" }
        : {},
      seedMeters: advancing ? { initiative: 1 } : grinding ? { initiative: -1 } : {},
    };
  },
};

// Historical Divergence Mode — per docs/specs/historical-divergence-and-checkpoint-map.md.
// A per-campaign War Room checkbox ("Historically Accurate Opponent," ticked by default).
// Unticking it silently rolls 3 independent forks per campaign at even odds — moments where the
// OTHER side does something other than what actually happened, unrelated to anything the player
// chose. This is deliberately different from Grand Campaign's seeds: those are narrated up
// front, so the player always knows what's coming (dramatic irony). These are never announced —
// the roll happens silently, and each fork's flag is only discovered in play, at its own
// `revealNode`, via a Wire Bulletin (see DIVERGENCE_HEADLINES below). `endingCapable: true`
// forks additionally unlock one brand-new ENDINGS_GALLERY title each, reachable only when that
// fork fired — confirmed with Craig as in-scope, not just flavor/meters, for this build.
const DIVERGENCE_FORKS = {
  german: [
    { id: "norwayHeld", flag: "forkNorwayHeld", revealNode: "norway40", endingCapable: false },
    { id: "moscowHolds", flag: "forkMoscowHolds", revealNode: "moscowRace41", endingCapable: true },
    { id: "torchShift", flag: "forkTorchShift", revealNode: "torch42", endingCapable: false },
    // Round 20 (Craig: "more speculative and outlandish history... build a ton of extra
    // content" for Historical Divergence Mode): both new German forks are picked to touch a
    // node where the situation text already treats the outcome as genuinely uncertain rather
    // than a fixed historical fact (kursk's own text says intelligence is compromised but
    // doesn't force a result; caseBlue's own text already flags Soviet reserve estimates as a
    // live unknown spanning "nearly two to one"). Every other node touched by an existing fork
    // either has an internal uncertain roll to nudge (Round 20 reuses that pattern for allied's
    // two new forks below) or two live, undetermined choices. Nodes where the situation text
    // states a single outcome as certain regardless of choice (blackMay, matapan41, compass40's
    // "hold" branch) are deliberately left alone — a fork claiming otherwise would contradict
    // text already presented to the player as settled history, not genuine uncertainty.
    { id: "panthersFixed", flag: "forkPanthersFixed", revealNode: "kursk", endingCapable: true },
    { id: "caucasusReservesThin", flag: "forkCaucasusThin", revealNode: "caseBlue", endingCapable: true },
  ],
  soviet: [
    { id: "barbarossaDelay", flag: "forkBarbarossaDelay", revealNode: "border41", endingCapable: false },
    { id: "kievPush", flag: "forkKievPush", revealNode: "smolensk41", endingCapable: true },
    { id: "stalingradConsolidate", flag: "forkStalingradConsolidate", revealNode: "order227_42", endingCapable: false },
    { id: "rzhevGarrisonThin", flag: "forkRzhevThin", revealNode: "rzhev42", endingCapable: true },
    { id: "deceptionPartlySeen", flag: "forkDeceptionSeen", revealNode: "bagrationSoviet44", endingCapable: true },
  ],
  allied: [
    { id: "narvikHeld", flag: "forkNarvikHeld", revealNode: "narvik40", endingCapable: false },
    { id: "luftwaffeShift", flag: "forkLuftwaffeShift", revealNode: "battleOfBritain40", endingCapable: true },
    { id: "arnhemLucky", flag: "forkArnhemLucky", revealNode: "marketGarden44", endingCapable: false },
    // Both new Allied forks reuse the existing uncertain-roll weight-nudge mechanic already
    // established by forkEastAfricaSlow (italy) rather than inventing new outcome branches —
    // anzio44 and dodecanese43 already resolve via modWeight() rolls, so a fork here is a
    // circumstance (garrison strength) nudging odds already in play, not new content.
    { id: "anzioGarrisonWeak", flag: "forkAnzioWeak", revealNode: "anzio44", endingCapable: false },
    { id: "rhodesGarrisonWeak", flag: "forkRhodesWeak", revealNode: "dodecanese43", endingCapable: false },
  ],
  italy: [
    { id: "greeceResistance", flag: "forkGreeceResistance", revealNode: "greeceDecision40", endingCapable: false },
    { id: "eastAfricaSlow", flag: "forkEastAfricaSlow", revealNode: "eastAfrica41", endingCapable: true },
    { id: "maltaWeak", flag: "forkMaltaWeak", revealNode: "convoyWarMalta41", endingCapable: false },
    { id: "fleetRepairedFast", flag: "forkFleetFast", revealNode: "tarantoDoctrine40", endingCapable: false },
    { id: "desertGapNarrower", flag: "forkDesertGap", revealNode: "compass40", endingCapable: false },
  ],
};

// Reveal bulletins for each fork — same shape as WIRE_HEADLINES ({id, year, month, headline,
// dek}) so they render through the existing WireBulletin component and share its dedup list
// (seenWireHeadlines) with zero new UI. Unlike WIRE_HEADLINES these are never picked
// probabilistically — they fire deterministically, exactly once, the instant a fired fork's
// revealNode is reached (see chooseOption's wire-trigger check, and enterWarRoom for the
// special case where revealNode is the campaign's own start node).
const DIVERGENCE_HEADLINES = {
  norwayHeld: { id: "norwayHeld", year: 1940, month: "APRIL", headline: "Norway Standoff Drags Into a Third Week", dek: "Allied troops remain dug in around Narvik with no clear breaking point in sight. Naval staff privately concede the ore route cannot be called secure while the port keeps changing hands." },
  moscowHolds: { id: "moscowHolds", year: 1941, month: "SEPTEMBER", headline: "Reports Suggest Thinner Siberian Reinforcement Than Expected", dek: "Fremde Heere Ost cannot fully confirm the picture, but early indications are that fewer of the divisions watching Japan have been released west than earlier estimates assumed." },
  torchShift: { id: "torchShift", year: 1942, month: "NOVEMBER", headline: "Allied Landing Fleet Reported Delayed by Weather", dek: "North African convoys said to be running days behind their expected schedule. Whether this changes anything at Toulon is, for the moment, an open question." },
  barbarossaDelay: { id: "barbarossaDelay", year: 1941, month: "JUNE", headline: "Frontier Reports Describe a Slower Opening Than Feared", dek: "Some formations expected at the border in the war's first hours are still reportedly arriving. Stavka's own picture of the opening days remains unusually incomplete." },
  kievPush: { id: "kievPush", year: 1941, month: "SEPTEMBER", headline: "No Southern Turn Reported in German Axis of Advance", dek: "Army Group Center's spearheads are described as continuing directly toward the capital rather than diverting south, contrary to the pattern Stavka's planners had expected." },
  stalingradConsolidate: { id: "stalingradConsolidate", year: 1942, month: "JULY", headline: "German Advance Reportedly Consolidating Short of the City", dek: "Rather than pressing directly into Stalingrad's outskirts, forward units are said to be regrouping — an uncharacteristic pause Stavka's staff cannot yet explain." },
  narvikHeld: { id: "narvikHeld", year: 1940, month: "APRIL", headline: "Narvik Garrison Reports Successful Reinforcement", dek: "Allied troops holding the port say German counter-landings have so far failed to dislodge them. The ore route's fate remains unresolved for now." },
  luftwaffeShift: { id: "luftwaffeShift", year: 1940, month: "SEPTEMBER", headline: "Luftwaffe Raids Reported Still Concentrated on Airfields", dek: "The expected shift toward city targets has not yet materialized. Fighter Command's own assessment of what this means for its reserves is, so far, not being made public." },
  arnhemLucky: { id: "arnhemLucky", year: 1944, month: "SEPTEMBER", headline: "No SS Armor Reported Near Arnhem Drop Zones", dek: "Aerial reconnaissance ahead of the operation found the area unusually quiet. Planners are said to be treating the absence with some suspicion rather than relief." },
  greeceResistance: { id: "greeceResistance", year: 1940, month: "OCTOBER", headline: "Greek Frontier Units Reported Standing Firmer Than Expected", dek: "Early contact reports describe organized resistance where Comando Supremo's planning assumed a rapid collapse. Albania command is said to be revising its timetable already." },
  eastAfricaSlow: { id: "eastAfricaSlow", year: 1941, month: "MAY", headline: "Commonwealth Advance on East Africa Reported Slowing", dek: "Supply difficulties across Kenya and Sudan are said to be delaying the converging columns. Whether this changes anything for the garrisons still holding out is not yet clear." },
  maltaWeak: { id: "maltaWeak", year: 1941, month: "AUGUST", headline: "Convoy Losses to Africa Reported Down This Month", dek: "Escort commanders describe unusually light interference from the island's air and submarine forces. Naval staff are not yet prepared to call the improvement durable." },
  // Round 20 additions (8 new forks, 2 per campaign).
  panthersFixed: { id: "panthersFixed", year: 1943, month: "MAY", headline: "Panther Reliability Reports Unusually Positive Ahead of Kursk", dek: "Maintenance units describe the engine-fire problem that plagued earlier trials as substantially addressed. Armor inspectors are, for once, not the ones raising objections at this planning stage." },
  caucasusReservesThin: { id: "caucasusReservesThin", year: 1942, month: "JUNE", headline: "Southern Front Intelligence Revises Soviet Reserve Estimate Downward", dek: "Early prisoner interrogations along the Don bend suggest the cautious end of FHO's range, not the alarming one, may be the figure worth trusting this time." },
  rzhevGarrisonThin: { id: "rzhevGarrisonThin", year: 1942, month: "NOVEMBER", headline: "Rzhev Garrison Reports Described as Under Strength", dek: "Reserves that should be backstopping the salient by the usual winter pattern are not where the order of battle says they should be. Front intelligence cannot yet explain the gap." },
  deceptionPartlySeen: { id: "deceptionPartlySeen", year: 1944, month: "JUNE", headline: "Unusual German Reconnaissance Activity Reported Over Concentration Areas", dek: "Persistent flights over ground the deception plan was supposed to keep uninteresting to German air reconnaissance cannot yet be explained away as routine patrolling." },
  anzioGarrisonWeak: { id: "anzioGarrisonWeak", year: 1944, month: "JANUARY", headline: "Anzio-Area Garrison Assessed Lighter Than Expected", dek: "Planners are treating the estimate with some caution rather than staking the landing's timing on it, but the coastal garrison opposite the chosen beaches may be thinner than the historical planning assumption." },
  rhodesGarrisonWeak: { id: "rhodesGarrisonWeak", year: 1943, month: "SEPTEMBER", headline: "Rhodes Garrison Reported Below Full Strength", dek: "Aerial reconnaissance ahead of any Aegean move suggests the island's defenders may be fewer than the planning figures assumed. Confidence in the estimate is, so far, limited." },
  fleetRepairedFast: { id: "fleetRepairedFast", year: 1940, month: "DECEMBER", headline: "Taranto-Damaged Battleships Reported Ahead of Repair Schedule", dek: "Naval yard officials describe work on the crippled battle line proceeding faster than the fleet's own engineers initially projected, though no return-to-service date is yet being made public." },
  desertGapNarrower: { id: "desertGapNarrower", year: 1940, month: "DECEMBER", headline: "Western Desert Camps Reported Partially Linked Ahead of British Push", dek: "Engineers report some progress closing the gap between the fortified camps west of Sidi Barrani, though how much of the line is actually continuous remains unclear even to Comando Supremo." },
};

function rollDivergenceForks(campaignId) {
  const forks = DIVERGENCE_FORKS[campaignId] || [];
  const flags = {};
  forks.forEach((f) => {
    if (Math.random() < 0.5) flags[f.flag] = true;
  });
  return flags;
}

// Save-schema version. Bump this any time a change could make an old save unsafe to resume
// (a renamed/removed node, a changed flag meaning, a changed campaign structure). Old saves
// are validated against the CURRENT campaign data on load — if the node no longer resolves,
// the save is treated as stale and discarded rather than crashing the resume flow.
const SAVE_VERSION = 1;

// Old node id -> new node id. Add an entry whenever a node is renamed, so saves made before the rename still
// resume (see docs/SAVES.md). Empty today: no node has been renamed since saving started working.
const NODE_ALIASES = {};
// SAVE_MIGRATIONS[n] upgrades a save from version n to n + 1. Add one whenever SAVE_VERSION is bumped, so an
// update upgrades players' saves instead of wiping them. A save with no way forward is discarded.
const SAVE_MIGRATIONS = {};
const aliasNode = (id) => (typeof id === "string" && Object.prototype.hasOwnProperty.call(NODE_ALIASES, id) ? NODE_ALIASES[id] : id);

/** Upgrades a parsed save to the current version and applies node aliases. Returns null if it cannot be used. */
function migrateSave(saved) {
  if (!saved || typeof saved !== "object") return null;
  let version = saved.version;
  if (!Number.isInteger(version) || version < 1 || version > SAVE_VERSION) return null; // unknown, or from a newer build
  let s = saved;
  while (version < SAVE_VERSION) {
    const step = SAVE_MIGRATIONS[version];
    if (!step) return null;
    s = step(s);
    version += 1;
    if (!s || typeof s !== "object") return null;
    s.version = version;
  }
  if (Object.keys(NODE_ALIASES).length) {
    s = { ...s, position: aliasNode(s.position) };
    if (Array.isArray(s.visited)) s.visited = s.visited.map(aliasNode);
    if (Array.isArray(s.history)) s.history = s.history.map((h) => (h && typeof h === "object" ? { ...h, position: aliasNode(h.position) } : h));
  }
  return s;
}

const NODE_TOTAL = 278; // 100 German + 63 Soviet + 58 Allied + 57 Italian — counted from the CAMPAIGNS getters, not estimated. Recount when nodes are added. (Round 26: German +1 for backhandBlow43; Soviet +7 for leningrad44, rightBank44, crimea44, iasiKishinev44, budapest44, balatonVienna45 and prague45.) (Round 24: Allied +7 for compassGreece41, greeceFalls41, crete41, aidRussia41, malaya41, forceZ41 and crusader41.) (Round 24: Italy +6 for monteLungo43, adriaticRoad44, combatGroups44, partisanWinter44, groupsCommand45 and springOffensive45.) (Round 24: Soviet +7 for brodyCounterstroke41, yelnya41, winterGeneral42, rzhevVyazma42, smolenskThaw42, kharkov42 and westernOffensive42.) (Round 19: Italy +6 for the extendedHoldout40/britainAloneQuestion40/enduringNeutrality40/germanPressure41/neutralItalyOccupied42/neutralItalyEnd45 chain.) (Round 13b: German +1 for rostov41, a new predecessor to typhoon; Soviet +1 for rzhevSummer42, a new predecessor to autumnWeight42.)

const CAMPAIGN_WAR_CONTEXT = {
  german: "APRIL 1940 — Poland fell in weeks last September, divided between Berlin and Moscow under a pact neither side expects to last. The West has spent seven quiet months in what the newspapers call the Phoney War. That quiet ends with Norway.",
  soviet: "JUNE 1941 — Germany controls Poland's western half, Denmark, Norway, the Low Countries, and France. Britain fights on alone from across the Channel. The Molotov–Ribbentrop Pact has held for nearly two years. It is about to end, without warning, from the other side.",
  allied: "MAY 1940 — Poland, Denmark, and Norway are gone. German panzers have reached the Channel coast, and France is breaking apart. The entire British Expeditionary Force is pinned against the sea at a small port called Dunkirk.",
  italy: "JUNE 1940 — France is collapsing faster than anyone in Rome expected. Italy has stayed 'non-belligerent' — deliberately not neutral — since September 1939, and the army's own mobilization tables say it isn't ready. The peace table is about to seat only belligerents.",
};

// Framing quotes shown on entering the War Room. Where a clean, verified, short quote from
// the actual command figure at this moment exists, it's used with a real name and date. Where
// none could be verified (no attributable line was found for German high command in this
// specific window), the line is left unattributed rather than inventing a false citation —
// same standard the Pacific build's advisor dossier work established.
const CAMPAIGN_WAR_ROOM_QUOTE = {
  german: {
    text: "Seven quiet months end with a single order to a fleet that has no margin for the losses this will cost it.",
    speaker: null,
    date: null,
  },
  soviet: {
    text: "A grave danger hangs over our country.",
    speaker: "Joseph Stalin",
    date: "radio address, July 3, 1941",
  },
  allied: {
    text: "I have nothing to offer but blood, toil, tears and sweat.",
    speaker: "Winston Churchill",
    date: "House of Commons, May 13, 1940",
  },
  italy: {
    text: "I need a few thousand dead to sit at the peace table as a belligerent.",
    speaker: "Benito Mussolini",
    date: "to Badoglio, May 1940",
  },
};

// Easy Command is named per campaign after a real, notorious equipment failure of that
// nation's — a small joke that telegraphs the mode's actual function (training wheels, full
// visibility), but per Craig's direction (Round 15) the War Room screen itself now shows only
// war context and mechanics, not the name's own backstory — so EASY_MODE_NOTES (which used to
// open with "Named for the X — a Y...") was retired in favor of warRoomModeInfo()'s shared
// mechanics-only fallback text, identical in substance across all four campaigns anyway.
const EASY_MODE_NAMES = { german: "Elefant Command", soviet: "T-35 Command", allied: "Defiant Command", italy: "Breda Command" };

function warRoomModeInfo(mode, campaignId) {
  const names = {
    easy: EASY_MODE_NAMES[campaignId] || "Easy Command",
    open: "Standard Issue Command",
    iron: "Führer Mode",
    purge: "NKVD Mode",
    coalition: "Yalta Mode",
    axis: "Axis Mode",
  };
  const hard = !!HARD_MODE_NAMES[mode];
  const summaries = {
    easy: "Training wheels: see what each order will cost before you give it, and which one the record chose.",
    open: "The war as designed. Judge each order on what you know.",
    iron: "The Führer's command, with no dashboard and no way back. Five points of political capital to spend on defying him.",
    purge: "Stalin's apparatus is watching. Suspicion is counted out of five, and a full count ends in a recall.",
    coalition: "Every order that overrides a partner's strong objection costs Coalition Cohesion, and a broken alliance relieves you.",
    axis: "Berlin watches every act of independent Italian judgment. Lose its trust and the command is superseded.",
  };
  const trackerRules = {
    iron: "Political capital: you have five points to spend defying the historical command. Five defiances and you are dismissed.",
    purge: "Suspicion rises as you defy the apparatus, counted out of 5. At 5 you are recalled.",
    coalition: "Coalition Cohesion falls when you override a partner's strong objection. At -6 the alliance relieves you of command.",
    axis: "German Trust falls when Berlin notices independent Italian judgment. At -5 you are superseded.",
  };
  const rules = hard
    ? [
        "Decisions are final: there is no rewind.",
        mode === "iron" ? "There is no meter dashboard. Only the staff's notes say how you stand." : null,
        trackerRules[mode],
        "Each battle can carry orders from above: a fixed approach or commander, or an order not to give ground.",
        "Reports are partly censored as Manpower falls.",
      ].filter(Boolean)
    : mode === "easy"
    ? ["Each option shows its meter impact before you choose.", "The choice the historical record made is marked, where the record left one.", "In battle the intelligence summary is never wrong.", "Rewind is available."]
    : ["Full meter dashboard.", "Rewind is available."];
  return { label: names[mode] || mode, note: summaries[mode] || "", summary: summaries[mode] || "", rules };
}

// The hard mode of each campaign.
const HARD_MODE_OF = { german: "iron", soviet: "purge", allied: "coalition", italy: "axis" };

// What each mode changes, as rows the difficulty screen sets side by side. modeFeatures gives each mode's value for every row.
const MODE_FEATURES = [
  { id: "preview", label: "Meter impact shown before you choose" },
  { id: "history", label: "The historical choice marked" },
  { id: "rewind", label: "Rewind to an earlier decision" },
  { id: "dashboard", label: "Meter dashboard" },
  { id: "intel", label: "Intelligence in battle" },
  { id: "tracker", label: "Extra tracker" },
  { id: "orders", label: "Orders from above in battle" },
  { id: "censor", label: "Reports censored as Manpower falls" },
];
function modeFeatures(mode) {
  const hard = !!HARD_MODE_NAMES[mode];
  const trackers = { iron: "Political capital, 5", purge: "Suspicion, out of 5", coalition: "Coalition Cohesion", axis: "German Trust" };
  return {
    preview: mode === "easy" ? "Yes" : "No",
    history: mode === "easy" ? "Yes" : "No",
    rewind: hard ? "No" : "Yes",
    dashboard: mode === "iron" ? "Staff notes only" : "Full",
    intel: mode === "easy" ? "Always right" : "Wrong one time in four",
    tracker: trackers[mode] || "None",
    orders: hard ? "Yes" : "No",
    censor: hard ? "Yes" : "No",
  };
}

