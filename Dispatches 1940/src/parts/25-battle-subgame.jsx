const BATTLE_ALLOCATION_CATEGORIES = [
  { id: "divisions", name: "Divisions", meter: "manpower", glyph: "▮▮▮" },
  { id: "armour", name: "Mechanised Armour", meter: "fuel", glyph: "▶▶" },
  { id: "air", name: "Air Support", meter: "fuel", glyph: "✈" },
  { id: "supply", name: "Supply", meter: "fuel", glyph: "▤" },
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
      note: "The offensive's main armored fist — roughly 700 tanks under his direct command. Chits spent on Mechanised Armour carry further with him running that push.",
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
      note: "His own command is built around two full infantry corps flanking its one panzer corps. Chits spent on Divisions carry further under him.",
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
      note: "Commands the air fleet flying direct support for this front. Chits spent on Air Support carry further under him.",
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
      note: "The ships off this beach are his. Order his destroyers in close and they can fire straight into the strongpoints, shallows or not. Chits spent on Naval Gunfire carry further under him.",
      reportLine: "Hall's destroyers come in to a thousand yards, scraping bottom, firing into the bluffs.",
    },
    {
      id: "cota",
      name: "Brigadier General Norman Cota",
      role: "Assistant Commander, 29th Infantry Division",
      category: "waves",
      note: "Already ashore with the men pinned at the shingle. Put him forward and he can get them moving. Chits spent on Follow-on Waves carry further with him on the beach.",
      reportLine: "Cota gets men off the shingle and through a gap blown in the wire, up the bluff.",
    },
    {
      id: "hoge",
      name: "Brigadier General William M. Hoge",
      role: "Commanding, Provisional Engineer Special Brigade Group",
      category: "engineers",
      note: "His brigade group exists to open this beach's exits and keep them open. Chits spent on Engineers & Tanks carry further under him.",
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
      note: "His corps is what panzer strength survived Uranus inside the pocket. Chits spent on Mechanised Armour carry further under him.",
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
      note: "His corps is three infantry divisions, and he's one of the army's own generals already arguing for exactly this order. Chits spent on Divisions carry further under him.",
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
      note: "His air corps has been flying support over this front for months. Chits spent on Air Support carry further under him.",
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
      note: "Takes over the Korps from a wounded Nehring in the middle of this fight. Chits spent on Mechanised Armour carry further under him.",
      reportLine: "Von Vaerst pushes the panzer spearhead forward himself, Korps command or not.",
    },
    {
      id: "navarini",
      name: "Generale Enea Navarini",
      role: "Commanding, XXI Corpo d'Armata",
      category: "divisions",
      // Verified: Navarini commanded the Italian XXI Corps at Alam el Halfa (Wikipedia, Battle of
      // Alam el Halfa order of battle).
      note: "His corps is the Italian infantry mass that has to keep pace with a night march built around the panzers' own schedule. Chits spent on Divisions carry further under him.",
      reportLine: "Navarini gets his corps moving on the night schedule, no argument needed this time.",
    },
    {
      id: "seidemann",
      name: "General der Flieger Hans Seidemann",
      role: "Commanding, Fliegerführer Afrika",
      category: "air",
      // Verified: Seidemann took command of Fliegerführer Afrika on 30 August 1942 — the day this
      // attack opened — succeeding Hoffmann von Waldau (Wikipedia, Fliegerführer Afrika).
      note: "Takes command of the air corps the same morning this attack goes in. Chits spent on Air Support carry further under him.",
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
      note: "His group is the Piemonte and Bersaglieri battalions making the climb. Chits spent on Alpine & Bersaglieri Assault carry further under him.",
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
      note: "His front's rifle armies are doing much of the work sealing the ring shut. Chits spent on Divisions carry further under him.",
      reportLine: "Chernyakhovsky pushes his rifle armies forward to seal another stretch of the ring.",
    },
    {
      id: "rotmistrov",
      name: "General Pavel Rotmistrov",
      role: "Commanding, 5th Guards Tank Army",
      category: "armour",
      note: "His tank army is the offensive's own exploitation force, committed straight through the gap the breakthrough opened. Chits spent on Mechanised Armour carry further under him.",
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
      note: "His division leads the push toward the Alban Hills, armor included — the same thrust he will later argue should never have stopped short of Valmontone. Chits spent on Armored Exploitation carry further under him.",
      reportLine: "Truscott pushes his division's own column forward without waiting on the corps to confirm it.",
    },
    {
      id: "penney",
      name: "Major General Ronald Penney",
      role: "Commanding, British 1st Infantry Division",
      category: "assault",
      note: "His division holds the other half of the beachhead's own infantry line. Chits spent on Infantry Beachhead carry further under him.",
      reportLine: "Penney gets his division's line squared away and pushing its own perimeter forward.",
    },
    {
      id: "darby",
      name: "Colonel William O. Darby",
      role: "Commanding, 6615th Ranger Force",
      category: "rangers",
      note: "His Rangers took the port itself this morning without firing a shot. Chits spent on Ranger & Commando Vanguard carry further under him.",
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
      note: "His corps is the column stalled on the one road north of Nijmegen. Chits spent on XXX Corps Armored Push carry further under him.",
      reportLine: "Horrocks pushes the column forward on his own authority rather than wait for the road to clear itself.",
    },
    {
      id: "urquhart",
      name: "Major General Roy Urquhart",
      role: "Commanding, 1st Airborne Division",
      category: "perimeter",
      note: "His division, what's left of it, is the horseshoe around Oosterbeek. Chits spent on Oosterbeek Perimeter carry further under him.",
      reportLine: "Urquhart tightens the perimeter's own line rather than let it be pulled thinner.",
    },
    {
      id: "sosabowski",
      name: "Major General Stanisław Sosabowski",
      role: "Commanding, 1st Independent Parachute Brigade (Poland)",
      category: "poles",
      note: "His brigade is the one making the crossing attempts from Driel. Chits spent on Polish Parachute Brigade carry further under him.",
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
      note: "His destroyers and corvettes are the convoy's own close screen. Chits spent on Destroyer & Corvette Screen carry further under him.",
      reportLine: "Broome brings his destroyers in tighter on his own order rather than wait for a threat to name itself.",
    },
    {
      id: "hamilton",
      name: "Rear-Admiral Louis Hamilton",
      role: "Commanding, 1st Cruiser Squadron",
      category: "coveringForce",
      note: "His cruisers are the covering force standing off against the battleship threat. Chits spent on Distant Covering Force carry further under him.",
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
      note: "The combat box is his own doctrine, drilled into his division before anyone else's. Chits spent on Combat Box Discipline carry further under him.",
      reportLine: "LeMay orders the box tightened on his own standing doctrine rather than wait for a report to justify it.",
    },
    {
      id: "kepner",
      name: "Major General William Kepner",
      role: "Commanding, VIII Fighter Command",
      category: "escort",
      note: "His Thunderbolt groups are the whole of the mission's fighter escort. Chits spent on Fighter Escort Coordination carry further under him.",
      reportLine: "Kepner pushes another flight to the limit of its range on his own order rather than wait for the schedule to call for it.",
    },
    {
      id: "eaker",
      name: "Lieutenant General Ira Eaker",
      role: "Commanding, Eighth Air Force",
      category: "targeting",
      note: "The target list — and the case that chokepoint industries are worth this cost — is his own command's doctrine. Chits spent on Precision Bomb-Run carry further under him.",
      reportLine: "Eaker's own standing order to hold the run steady through flak is what the lead bombardiers are flying to.",
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
      note: "Lead with the tanks. A narrow armored wedge — Tigers forward, the rest fanning to the flanks and rear — punches through fast, the way 4th Panzer Army's own attack did. Speed outruns its own supply tail: Mechanised Armour chits carry further, Supply chits carry less.",
      modifiers: { armour: 0.7, supply: -0.5 },
      reportLine: "The attack goes in as a wedge: Tigers at the point, the lighter tanks fanning out behind.",
    },
    {
      id: "infantryBreach",
      name: "Methodical Infantry-Led Breach",
      subtitle: "Model's approach — the northern pincer",
      note: "Hold the tanks back. Infantry and artillery batter the line open first, the way 9th Army's own attack did, with the panzer reserve committed only once the defenses are actually breached. Divisions chits carry further; Mechanised Armour chits carry less, held back rather than leading. The methodical pace also keeps the supply columns closer behind the line: Supply chits carry a little further too.",
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
      note: "Go straight at the five draws, where the vehicle exits and the strongpoints both are. Open them and the beach can drain inland. Engineers & Tanks chits carry further; Follow-on Waves chits carry less, fed into the fire at the draw mouths.",
      modifiers: { engineers: 0.7, waves: -0.5 },
      reportLine: "The assault goes straight at the draws, where the exits and the strongpoints both are.",
    },
    {
      id: "climbBluffs",
      name: "Climb Between the Draws",
      subtitle: "Small groups, between the strongpoints",
      note: "Send small groups up the bluffs between the strongpoints, away from the draws, and take the defenders from behind. Follow-on Waves chits carry further; Engineers & Tanks chits carry less, with the exits left shut for now.",
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
      note: "Put the tanks at the front of the column and drive for open ground before the ring hardens. Mechanised Armour chits carry further; every kilometer spends fuel nobody is flying in a second load of, so Supply chits carry less.",
      modifiers: { armour: 0.7, supply: -0.5 },
      reportLine: "The panzer screen forms up at the head of the column and pushes west first.",
    },
    {
      id: "broadWithdrawal",
      name: "Broad Infantry Withdrawal",
      subtitle: "Preserve the mass, screen it rather than lead with it",
      note: "March the infantry divisions out under their own power, tanks screening the flanks rather than leading. Divisions chits carry further; Mechanised Armour chits carry less, held to the column's edges instead of its point.",
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
      note: "Push the panzer spearhead through the minefield lanes at speed rather than wait for them fully cleared — every hour saved is an hour less exposed to the Desert Air Force in daylight. Mechanised Armour chits carry further; the pace burns fuel nobody is shipping a second load of, so Supply chits carry less.",
      modifiers: { armour: 0.7, supply: -0.5 },
      reportLine: "The panzer spearhead probes the minefield's edge, looking for a lane already cleared.",
    },
    {
      id: "clearTheMines",
      name: "Clear the Mines Properly",
      subtitle: "Let the engineers open the lanes first",
      note: "Take the time to breach the minefields properly before committing the column, infantry and engineers leading rather than the tanks. Divisions chits carry further; Mechanised Armour chits carry less, held back until the lanes are actually open.",
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
      note: "Have the Anglo-Polish batteries register their fire plan before the assault battalions move, at the cost of some of the surprise a faster start would keep. Anglo-Polish Artillery chits carry further; Alpine & Bersaglieri Assault chits carry less, held to wait on the guns' own schedule.",
      modifiers: { artillery: 0.7, assault: -0.5 },
      reportLine: "The Anglo-Polish batteries range in their fire plan before the assault line moves.",
    },
    {
      id: "assaultLeads",
      name: "Assault Leads the Climb",
      subtitle: "Move on the peak now, guns in overwatch",
      note: "Send the assault battalions up the mountain on the original night-surprise schedule, artillery held in overwatch rather than leading the plan. Alpine & Bersaglieri Assault chits carry further; Anglo-Polish Artillery chits carry less, ranged in only after contact.",
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
      note: "Push the tank armies past the fortified towns rather than reduce them, closing the ring on the open country behind the line. Mechanised Armour chits carry further; every kilometer driven around a strongpoint is a kilometer the rear services haven't caught up to yet, so Supply chits carry less.",
      modifiers: { armour: 0.7, supply: -0.5 },
      reportLine: "The tank armies bypass the fortified towns and drive for open country behind the line.",
    },
    {
      id: "reduceStrongpoints",
      name: "Reduce the Strongpoints",
      subtitle: "Clear the fortified towns before pushing on",
      note: "Take the fortified towns methodically with the rifle armies before committing the tank strength past them. Divisions chits carry further; Mechanised Armour chits carry less, held back until the ground behind it is actually clear.",
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
      note: "Send the armor and its screening infantry up the road toward the Alban Hills before the German response can organize. Armored Exploitation chits carry further; the beachhead's own infantry line, thinned to feed the column, carries less. Infantry Beachhead chits carry less.",
      modifiers: { armor: 0.7, assault: -0.5 },
      reportLine: "The exploitation column moves out on the road inland without waiting for the beachhead to fully consolidate.",
    },
    {
      id: "securePerimeter",
      name: "Secure the Perimeter First",
      subtitle: "Lucas's actual order — entrench the beachhead against the counterattack he expects",
      note: "Hold the armor back and dig the infantry line in before committing anything inland, the way the historical corps commander actually ordered it. Infantry Beachhead chits carry further; Armored Exploitation chits carry less, held in reserve rather than leading.",
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
      note: "Drive the column for the river without pausing to widen the road behind it. XXX Corps Armored Push chits carry further; the single road left thin behind the spearhead is exactly what let the Germans cut it near Koevering — Supply Drop chits carry less, the corridor's own security being what keeps any resupply moving at all.",
      modifiers: { corpsPush: 0.7, resupply: -0.5 },
      reportLine: "The column drives straight for the river, leaving the road behind it thinner than the plan called for.",
    },
    {
      id: "securedAdvance",
      name: "Clear and Hold the Corridor First",
      subtitle: "Widen and secure the road north before committing the spearhead further",
      note: "Spend the effort holding Hell's Highway open before pushing the spearhead any further. Supply Drop chits carry further; XXX Corps Armored Push chits carry less, held to the pace the secured road actually allows.",
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
      note: "Keep the destroyers and corvettes hunting contacts rather than watching the sky. Destroyer & Corvette Screen chits carry further; Anti-Aircraft Auxiliaries chits carry less, left to fight the air threat alone.",
      modifiers: { escorts: 0.7, aaShips: -0.5 },
      reportLine: "The escort's attention goes to the water rather than the sky, hunting contacts before they can fire.",
    },
    {
      id: "antiAirPriority",
      name: "Mass Anti-Aircraft Fire",
      subtitle: "Concentrate the escort's attention on the torpedo bomber threat",
      note: "Bring every gun that can be spared onto the air picture rather than the water. Anti-Aircraft Auxiliaries chits carry further; Destroyer & Corvette Screen chits carry less, thinner on the U-boat threat as a result.",
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
      note: "Put the effort into keeping the box tight end to end. Combat Box Discipline chits carry further; Fighter Escort Coordination chits carry less, left to work the handoff with whatever timing the escort already has.",
      modifiers: { formation: 0.7, escort: -0.5 },
      reportLine: "The effort goes into holding the box tight rather than perfecting the escort handoff.",
    },
    {
      id: "exactRendezvous",
      name: "Time the Rendezvous Exactly",
      subtitle: "Drill the escort handoff over formation discipline",
      note: "Put the effort into making the fighter handoff as precise as the range allows. Fighter Escort Coordination chits carry further; Combat Box Discipline chits carry less, left to hold together with whatever discipline the groups already have.",
      modifiers: { escort: 0.7, formation: -0.5 },
      reportLine: "The effort goes into the escort handoff rather than drilling the box's own discipline.",
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
      modifiers: { armour: 0.6, divisions: 0.75, supply: 1.25 },
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
function pickKeyBattlePosture(battleId) {
  const roster = KEY_BATTLE_POSTURES[battleId] || [];
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
};
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
// resource hard); on a LOSS, every neglected category costs its meter 1 (the gap you left is
// where it broke); a WIN with nothing neglected earns +1 Initiative (a coordinated plan leaves
// the staff ahead of events); a reserve of 2+ chits held back and never committed returns +1
// Manpower. Each meter's net plan cost is capped to [-2, +1] so the plan can sting but never
// outweigh the battle's own historical outcome impact.
function computeBattlePlanCosts({ categories, finalAllocation, poolSize, contributions, won, reservesHeld, counter }) {
  const lines = [];
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
  const neglected = categories.filter((c) => (contributions[c.id] || 0) < 0);
  if (!won) {
    for (const c of neglected) lines.push({ meter: c.meter, delta: -1, reason: `${c.name} left uncovered` });
  } else if (neglected.length === 0) {
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

const NODE_TOTAL = 250; // 99 German + 49 Soviet + 51 Allied + 51 Italian — counted from the CAMPAIGNS getters, not estimated. Recount when nodes are added. (Round 19: Italy +6 for the extendedHoldout40/britainAloneQuestion40/enduringNeutrality40/germanPressure41/neutralItalyOccupied42/neutralItalyEnd45 chain.) (Round 13b: German +1 for rostov41, a new predecessor to typhoon; Soviet +1 for rzhevSummer42, a new predecessor to autumnWeight42.)

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
  const notes = {
    easy:
      "Training wheels for the whole engagement: every order previews the meter impact of each option before you commit, and the choice the real historical record made — where the record left one — is marked. Full meter visibility, rewind available.",
    open: "Standard play. Full meter visibility, rewind available.",
    iron: "Führer Mode: no rewind, decisions final, no meter dashboard — only staff reports — and five points of political capital to spend on defying the historical command structure.",
    purge: "NKVD Mode: no rewind, decisions final. Suspicion tracks how the political apparatus reads your defiance, out of 5 — let it max out and the run ends in a recall, not a defeat.",
    coalition: "Yalta Mode: no rewind, decisions final. Tracks Coalition Cohesion — every choice that overrides a partner's strong objection costs something, and a badly frayed alliance can no longer greenlight its boldest unilateral gambles.",
    axis: "Axis Mode: no rewind, decisions final. Tracks German Trust — every act of independent Italian judgment Berlin notices costs something, and a command Berlin has stopped trusting doesn't get asked before it's superseded.",
  };
  return { label: names[mode] || mode, note: notes[mode] || "" };
}

