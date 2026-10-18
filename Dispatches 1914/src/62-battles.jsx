// =============================================================================
// THE ORDERS OF BATTLE
// =============================================================================
//
// The battles that open on the Order of Battle screen (61-battle.jsx). Each config is registered under the id of the `keyBattleSubgame`
// of the choice that hosts it, and that choice has two contested outcomes: `winBranch` is the index of the better one for the command.
// Facts (units, dates, strengths) come from the pages named in claims/battles.json; what is modelled and not documented, the weights
// above all, is a game judgment and is said to be one. An arm's `units` are real formations; `real` is what happened on the day.
//
//   categories     the arms the pool is placed across: { id, name, meter (the meter a heavy commitment to it costs), units, real, context }
//   effectiveness  the weight of one chit in each arm, before commander, approach and the enemy's setup
//   commanders     { id, name, role, category (the arm the officer really led), note }
//   approaches     { id, name, note, modifiers: { arm: added weight } }
//   postures       the enemy's setup, drawn hidden: { id, name, intel (the line the intelligence summary gives), modifiers: { arm: multiplier }, weight }
//   echo           what the next report says (node, grade[clean|costly|marginal|total], neglected[arm], commander[id])
// =============================================================================

BATTLES.marneFrench = {
  id: "marneFrench",
  host: { node: "gqg_1914_02_marne", choice: "attack" },
  winBranch: 0,
  campaign: "gqg",
  title: "Order of Battle: the Marne",
  flavor:
    "The German First Army has swung north-west of Paris and left its right flank in the open. Joffre has a Sixth Army of reservists to the north " +
    "of the city, a Fifth Army that has just changed its commander, a British force that is slow, and a Ninth Army that did not exist a fortnight ago.",
  conditions:
    "Early September, dry and warm. The roads are full of columns that have been marching for three weeks. Aeroplanes are watching the German " +
    "columns, which is new, and the staff has not yet learned how far to trust what they say.",
  categories: [
    {
      id: "sixth", name: "The Sixth Army and Paris", meter: "manpower",
      units: [
        "Maunoury's Sixth Army, about 150,000 men, mostly reservists, formed to protect Paris",
        "The Paris garrison under Gallieni, the Military Governor",
        "About 600 Renault taxis requisitioned at Les Invalides on the night of 7 to 8 September",
      ],
      real:
        "On 5 September part of the Sixth Army met the German IV Reserve Corps, about 24,000 men under Gronau, who held it for about a day. Kluck turned his " +
        "army west to face the Ourcq and marched some 130 kilometres in two days to do it. About 600 taxis carried troops some 50 kilometres on the night of " +
        "7 to 8 September. How much that mattered militarily is disputed, though the effect on morale was undeniable.",
      context:
        "The Sixth Army is the arm that pulls Kluck round. Each commitment puts more reservists on the Ourcq and makes the German turn to the west harder to refuse.",
    },
    {
      id: "gap", name: "The Fifth Army and the BEF at the Gap", meter: "will",
      units: [
        "Franchet d'Esperey's Fifth Army, which he took over from Lanrezac on 3 September",
        "Sir John French's British Expeditionary Force, about 100,000 men on the eve of the battle",
        "The aeroplanes that watched the German columns and found the gap",
      ],
      real:
        "Kluck's turn to the north-west opened a gap of about 50 kilometres between the German First and Second Armies, and French aircraft saw it. The BEF, " +
        "sent north-west into it, outnumbered the Germans there ten to one and advanced only about 40 kilometres in three days, ending 6 September some 12 " +
        "kilometres short of its objectives; Franchet d'Esperey and other French commanders were furious. His Fifth Army fought the battle of the Two Morins " +
        "on 6 September, crossed the Petit Morin by the 8th and the Marne on the 9th.",
      context:
        "The gap is where the battle turns. Each commitment pushes more of the Fifth Army and the British toward the hole between the two German armies, and makes the " +
        "Second Army's flank harder to cover.",
    },
    {
      id: "ninth", name: "The Ninth Army at Saint-Gond", meter: "manpower",
      units: [
        "Foch's Ninth Army, formed as a new army during the retreat",
        "The causeways and the marshes of Saint-Gond",
        "Langle de Cary's Fourth Army on its flank",
      ],
      real:
        "On 8 September Hausen's Third German Army, some 82,000 men, struck the Ninth Army in the marshes of Saint-Gond in a night attack without artillery " +
        "preparation. It drove Foch back about 13 kilometres, then bogged down, having lost about 11,000 men.",
      context:
        "The Ninth Army holds the centre while the flank does the work. Each commitment puts more men on the causeways of Saint-Gond, where a night attack will fall.",
    },
    {
      id: "guns", name: "The Guns", meter: "munitions",
      units: [
        "The Allied artillery, about 3,000 guns in all",
        "The field batteries under each army",
        "The ammunition columns behind them",
      ],
      real:
        "The Allies had about 3,000 guns on the eve of the battle against about 3,300 German, and Herwig is cited for the German advantage in artillery. The " +
        "Marne is remembered for marches and for a gap, and not for a bombardment.",
      context:
        "The guns support every other arm and decide none of them. Each commitment puts more batteries and shells forward, and takes them from the places that have to " +
        "move.",
    },
  ],
  // The gap first: the Marne turned on the hole between the German armies. The Sixth Army second, which opened it. The Ninth Army held the centre.
  // The guns last, on the page's own account of what the battle was made of. A game judgment, not a measurement.
  effectiveness: { gap: 2.4, sixth: 2.0, ninth: 1.6, guns: 1.3 },
  commanders: [
    { id: "gallieni", name: "Gallieni", role: "Military Governor of Paris", category: "sixth",
      note: "He has been arguing for the attack on the open flank for two days." },
    { id: "franchet", name: "Franchet d'Esperey", role: "Commander of the Fifth Army from 3 September", category: "gap",
      note: "He replaced Lanrezac four days ago and will not forgive a slow ally." },
    { id: "foch", name: "Foch", role: "Commander of the Ninth Army", category: "ninth",
      note: "His army was formed in the retreat, and holds the centre." },
  ],
  approaches: [
    { id: "flank", name: "Throw the weight on the exposed flank", note: "Everything goes into the Ourcq and the gap, and the centre holds as it can.", modifiers: { sixth: 0.4, gap: 0.3, ninth: -0.3 } },
    { id: "line", name: "Attack along the whole line", note: "Every army attacks and keeps in touch with the next, with no single point of main effort.", modifiers: { ninth: 0.5, guns: 0.3, sixth: -0.2, gap: -0.2 } },
  ],
  postures: [
    { id: "kluckTurns", name: "Kluck turns west and opens a gap", weight: 2,
      intel: "French aeroplanes report the German First Army's columns bending away to the north-west, toward the Ourcq, with nothing behind them.",
      modifiers: { sixth: 1.1, gap: 1.3 } },
    { id: "kluckSouth", name: "Kluck holds on south of the Marne", weight: 1,
      intel: "Aeroplanes report the German First Army still marching south of the Marne, its right flank covered by reserve corps.",
      modifiers: { sixth: 0.8, gap: 0.65, ninth: 1.1 } },
    { id: "centreTested", name: "A heavy German blow at the centre", weight: 1,
      intel: "Prisoners and patrols speak of a heavy German concentration opposite the marshes of Saint-Gond, and of an attack at night.",
      modifiers: { ninth: 0.8, gap: 1.1, sixth: 1.1, guns: 1.15 } },
  ],
  echo: {
    node: "gqg_1914_14_race",
    grade: {
      clean: "The battle on the Marne was fought with every army given its part, and the staff has the habit of working that way.",
      costly: "The battle on the Marne was won, with some of its parts starved to pay for the rest, and the army remembers which.",
      marginal: "The plan on the Marne held together and the battle did not go the way it should have, and no one at headquarters can say what was left undone.",
      total: "The battle on the Marne was fought with parts of the line left bare, and the army has seen what that costs.",
    },
    neglected: {
      sixth: "The Sixth Army was left short on the Ourcq.",
      gap: "The gap between the German armies was left under-used.",
      ninth: "Foch's army was left short in the marshes.",
      guns: "The guns were left short of what they needed.",
    },
    commander: {
      gallieni: "Gallieni's part in the plan is remembered in Paris.",
      franchet: "Franchet d'Esperey's army is remembered as the one that went into the gap.",
      foch: "Foch's army is remembered as the one that held.",
    },
  },
};

BATTLES.gallipoliOttoman = {
  id: "gallipoliOttoman",
  host: { node: "otto_1915_02_gallipoli", choice: "reserve" },
  winBranch: 0,
  campaign: "otto",
  title: "Order of Battle: Gallipoli",
  flavor:
    "The fleet has been beaten off at the Narrows. An army is waiting at Lemnos and in Egypt, and nobody on the peninsula knows where it will land. " +
    "The Fifth Army has six divisions, a German commander, and a coast that is longer than it can hold.",
  conditions:
    "Late April, fine weather. The roads on the peninsula are few and bad, and the troops move at night to avoid the Allied aeroplanes.",
  categories: [
    {
      id: "reserve", name: "The Mobile Reserve", meter: "manpower",
      units: [
        "The 19th Division under Mustafa Kemal, held near Boghali",
        "The divisions of the Fifth Army kept inland, ready to be moved to the landing",
        "The night marches that move them out of sight of Allied aircraft",
      ],
      real:
        "Sanders kept most of the army inland as a mobile reserve and moved troops by night. Kemal watched the beaches from Boghali, near Maidos, and by " +
        "mid-morning on 25 April had reorganised the defenders for a counter-attack on Chunuk Bair and Sari Bair. Sanders was at Bulair with the 5th Division for " +
        "two days, which disrupted the chain of command.",
      context:
        "The reserve is the arm that meets the landing wherever it comes. Each commitment keeps more men inland and ready, and fewer on the beaches.",
    },
    {
      id: "coast", name: "The Beaches and the Heights", meter: "manpower",
      units: [
        "The 9th Division along the Aegean coast",
        "The covering troops at Cape Helles",
        "The first-line trenches above the beaches",
      ],
      real:
        "Mustafa Kemal and others thought the beaches too thinly held. Troops on the coast met the first landings on 25 April; they were few, and the " +
        "defence of the heights was made by the reserve coming up behind them.",
      context:
        "The men on the shore are the first to meet the landing. Each commitment puts more rifles on the beaches and the ridges above them, and makes the first hours " +
        "harder for the Allies.",
    },
    {
      id: "flanks", name: "Bulair and the Asiatic Shore", meter: "will",
      units: [
        "Two divisions at Bulair, at the neck of the peninsula",
        "About a third of the army at Besika Bay, on the Asiatic shore",
        "The 3rd Division and a cavalry brigade, which arrived in early April",
      ],
      real:
        "About a third of the army stood at Besika Bay and two divisions at Bulair; the 3rd Division and a cavalry brigade arrived in early April, bringing the " +
        "front-line strength to some 60,000 to 62,000 men in three groups. On 25 April the Allies also made a French landing at Kum Kale on the Asiatic shore and " +
        "a demonstration off Bulair, neither of which led to a main attack.",
      context:
        "The flanks are the places the landing might fall and mostly did not. Each commitment puts more men at Bulair and on the Asiatic shore, and fewer where the " +
        "main landing comes.",
    },
    {
      id: "forts", name: "The Narrows Forts and Mines", meter: "munitions",
      units: [
        "The forts and batteries on both shores of the Narrows",
        "The minefield laid by the minelayer Nusret ten days before 18 March",
        "The searchlights, the torpedo stations and the mobile guns",
      ],
      real:
        "On 18 March the Bouvet struck a mine and capsized in about two minutes, with 75 survivors of 718 men; the Irresistible sank and the Ocean was abandoned. The " +
        "Ottoman account says that by 2 p.m. all the telephone wires were cut and the fire of the forts had slackened considerably. The mines laid ten days before did the " +
        "damage.",
      context:
        "The forts and mines are what stopped the fleet. Each commitment puts more guns and shells at the Narrows, for the day the fleet comes back.",
    },
  ],
  // The mobile reserve first: the defence of 25 April was made by the reserve moving forward. The coast second. The forts and the flanks matter less on the day,
  // the fleet having been beaten off and the feints having drawn little. A game judgment, not a measurement.
  effectiveness: { reserve: 2.4, coast: 1.9, forts: 1.4, flanks: 1.2 },
  commanders: [
    { id: "liman", name: "Liman von Sanders", role: "Commander of the Fifth Army", category: "flanks",
      note: "He keeps the reserve inland, and will be at Bulair when the landing comes." },
    { id: "kemal", name: "Mustafa Kemal", role: "Commander of the 19th Division", category: "reserve",
      note: "He thinks the beaches too thinly held, and is held in reserve himself." },
  ],
  approaches: [
    { id: "mobile", name: "Keep the reserve inland and move it to the landing", note: "The reserve goes where the landing falls, and the beaches are held lightly.", modifiers: { reserve: 0.3, flanks: 0.2, coast: -0.3 } },
    { id: "forward", name: "Put the weight forward on the heights", note: "Every beach has its defenders, and the reserve is smaller.", modifiers: { coast: 0.5, forts: 0.1, reserve: -0.2 } },
  ],
  postures: [
    { id: "helles", name: "The main landings at Cape Helles and Anzac", weight: 2,
      intel: "Allied transports are massing at Lemnos and Mudros, and the fleet's attention is on Cape Helles and the coast north of Gaba Tepe.",
      modifiers: { reserve: 1.15, coast: 1.2, flanks: 0.8, forts: 0.9 } },
    { id: "bulair", name: "A landing at Bulair, at the neck", weight: 1,
      intel: "Allied transports are reported making for the Gulf of Xeros, off the neck of the peninsula at Bulair.",
      modifiers: { flanks: 1.5, coast: 0.8, reserve: 0.9 } },
    { id: "asiatic", name: "A landing on the Asiatic shore", weight: 1,
      intel: "A French squadron and transports are reported off Besika Bay and Kum Kale, on the Asiatic shore.",
      modifiers: { flanks: 1.5, coast: 0.8 } },
  ],
  echo: {
    node: "otto_1915_03_kut",
    grade: {
      clean: "The army that held the peninsula was handled as one force, and the staff has learned from it.",
      costly: "The peninsula was held, with some arms starved to pay for the rest.",
      marginal: "The dispositions on the peninsula were sound, and the landing went the other way.",
      total: "The peninsula was held with parts of the coast left bare, and the army has seen what that costs.",
    },
    neglected: {
      reserve: "The reserve was left short, and was late.",
      coast: "The beaches were left thinly held.",
      flanks: "The flanks were left uncovered.",
      forts: "The forts were left short of shell.",
    },
    commander: {
      liman: "Liman von Sanders's dispositions are the ones the army is arguing about.",
      kemal: "Mustafa Kemal's division is the one the army talks of.",
    },
  },
};

BATTLES.sommeBritish = {
  id: "sommeBritish",
  host: { node: "bef_1916_11_somme", choice: "compromise" },
  winBranch: 1,
  campaign: "bef",
  title: "Order of Battle: the Somme",
  flavor:
    "The Fourth Army is to attack on a front of some twenty kilometres north of the river, with the French on its right. Haig wants a breakthrough and the cavalry " +
    "through it. Rawlinson wants to bite and hold. The plan has to serve both and be built by one staff.",
  conditions:
    "The end of June, after a week of bombardment. The German front is on a forward slope of white chalk, and the second position behind it is nearly finished.",
  categories: [
    {
      id: "bombardment", name: "The Bombardment", meter: "munitions",
      units: [
        "The Fourth Army's artillery, its heavy guns increased from 324 to 714 between 1 January and 3 July",
        "More than 1.5 million shells before zero hour",
        "The nineteen mines under the German front, from Lochnagar to Hawthorn Ridge",
      ],
      real:
        "More than 1.5 million shells were fired before 1 July and about 250,000 on the day. There were not enough guns to be certain the wire was cut; shrapnel was " +
        "virtually useless against entrenched positions and very little high-explosive was made for field artillery. German dugouts 20 to 30 feet deep survived in many " +
        "places. Most of the mines were fired at 7.28 on the morning of the attack, two minutes before zero.",
      context:
        "The guns are what the infantry's advance depends on. Each commitment puts more heavy guns, shells and mines behind the attack, and takes them from the men who have to cross the ground.",
    },
    {
      id: "south", name: "XIII and XV Corps, with the French", meter: "manpower",
      units: [
        "XIII Corps, with the 18th (Eastern) and 30th Divisions, at Montauban",
        "XV Corps, at Mametz and Fricourt",
        "The French XX Corps and I Colonial Corps on the right, with 552 heavy guns and howitzers",
      ],
      real:
        "XIII Corps took Montauban and reached all its objectives. XV Corps captured Mametz and isolated Fricourt, which the Germans abandoned overnight. The French XX Corps " +
        "attacked at 7.30 and took Bois Y 'like clockwork', and I Colonial Corps took about 2,000 prisoners for very few casualties.",
      context:
        "The southern corps are next to the French and nearest the German weak point. Each commitment puts more men and weight on the right of the attack.",
    },
    {
      id: "north", name: "III, X and VIII Corps", meter: "manpower",
      units: [
        "III Corps on the Albert-Bapaume road, with the 34th Division",
        "X Corps at Thiepval and the Leipzig Redoubt, with the 36th (Ulster) Division",
        "VIII Corps north of the Ancre, at Beaumont-Hamel and Serre",
      ],
      real:
        "III Corps met a disaster on the Albert-Bapaume road, and the 34th Division lost more men than any Allied division that day. X Corps took part of the Leipzig Redoubt and " +
        "failed at Thiepval; the 36th (Ulster) Division overran the German front line and took the Schwaben and Stuff Redoubts, but the gains were temporary. VIII Corps, north of " +
        "the Ancre, was a costly failure, with many attackers shot down in no man's land.",
      context:
        "The northern corps face the strongest ground. Each commitment puts more men against the ridge in the north, where the dugouts are deepest.",
    },
    {
      id: "exploit", name: "The Exploitation Force", meter: "will",
      units: [
        "Three cavalry divisions, the 1st, the 2nd Indian and the 3rd, assembled about five miles west of Albert",
        "The 19th (Western) and 49th (West Riding) Divisions in local reserve",
        "The order of 28 June that the infantry should exploit without waiting for the cavalry",
      ],
      real:
        "Haig's plan allowed exploitation if German resistance collapsed, with the cavalry to take Bapaume and then turn north toward Arras. It never came to that. On 28 June the " +
        "Fourth Army ordered the infantry to exploit without waiting for the cavalry, which could not move until the roads were cleared.",
      context:
        "The exploitation force is what turns a gain into a breakthrough, if there is one. Each commitment holds more cavalry and reserves ready, and puts fewer into the first assault.",
    },
  ],
  // The bombardment first: the plan lived or died by the guns. The southern corps second, where the attack succeeded. The northern corps third, against the deepest dugouts.
  // The exploitation force last: it was never used. A game judgment, not a measurement.
  effectiveness: { bombardment: 2.5, south: 2.0, north: 1.4, exploit: 1.0 },
  commanders: [
    { id: "rawlinson", name: "Rawlinson", role: "Commander of the Fourth Army", category: "bombardment",
      note: "He wants the German belts pulverised and then occupied, and thinks little of a breakthrough." },
    { id: "haig", name: "Haig", role: "Commander-in-Chief", category: "exploit",
      note: "He wants the plan to aim at a real success, with the cavalry ready if the line breaks." },
  ],
  approaches: [
    { id: "bite", name: "Bite and hold: take the ground the guns have cleared", note: "Limited advances to the high ground, then a pause to break the counter-attacks.", modifiers: { bombardment: 0.4, south: 0.2, exploit: -0.5 } },
    { id: "breakthrough", name: "Aim at a breakthrough, with the cavalry through the gap", note: "A deeper attack along the whole front, and the exploitation force ready behind it.", modifiers: { exploit: 0.6, north: 0.3, bombardment: -0.3 } },
  ],
  postures: [
    { id: "deep", name: "Deep dugouts under a forward slope", weight: 2,
      intel: "Trench raids and aerial photographs show deep dugouts under the German front line and two thick belts of wire in front of it.",
      modifiers: { bombardment: 0.8, north: 0.8, south: 1.05, exploit: 0.8 } },
    { id: "thin", name: "A thinly held front", weight: 1,
      intel: "Prisoners say the German front line is held by few men, with the second position behind it still unfinished.",
      modifiers: { bombardment: 1.2, north: 1.2, south: 1.1, exploit: 1.4 } },
    { id: "reserves", name: "German reserves close behind", weight: 1,
      intel: "Aircraft report rail traffic and German reserves close behind the front, more than was thought.",
      modifiers: { exploit: 0.5, north: 0.9 } },
  ],
  echo: {
    node: "bef_1916_12_tanks",
    grade: {
      clean: "The plan for the first day was built so that every part of the army had its place, and the staff is proud of the work.",
      costly: "The first day was won where the plan had put its weight, with other parts starved to pay for it.",
      marginal: "The plan held together, and the first day did not go the way it should have.",
      total: "The plan for the first day left parts of the front bare, and the army has seen what that costs.",
    },
    neglected: {
      bombardment: "The guns were left short of what the attack needed.",
      south: "The southern corps were left short of men.",
      north: "The northern corps were left short of men.",
      exploit: "The exploitation force was left too small to use.",
    },
    commander: {
      rawlinson: "Rawlinson's method is the one the army is learning.",
      haig: "Haig's ambition is the one the army has been asked to serve.",
    },
  },
};

BATTLES.brusilovRussian = {
  id: "brusilovRussian",
  host: { node: "stavka_1916_05_brusilov", choice: "alone" },
  winBranch: 1,
  campaign: "stavka",
  title: "Order of Battle: the South-Western Front",
  flavor:
    "Brusilov proposes to attack everywhere at once, each army on a sector of its own choosing and no single place where the enemy can look for the main blow. " +
    "The artillery, the sappers and four army commanders have a month to make it work.",
  conditions:
    "Late May by the Russian calendar. The sap trenches are being dug at night toward the Austro-Hungarian wire, and the Russian guns have been told to open on the day and not before.",
  categories: [
    {
      id: "eighth", name: "The Eighth Army toward Lutsk", meter: "manpower",
      units: [
        "Kaledin's Eighth Army, which spearheaded the attack toward Lutsk and Kovel",
        "Its corps: the 32nd, the 8th and 40th in the centre, and the 39th in the north",
        "The first and second Austro-Hungarian lines in front of it",
      ],
      real:
        "The Eighth Army overran the first and second Austro-Hungarian lines by 5 June and occupied Lutsk by the 7th. The Austro-Hungarian Fourth Army, which faced " +
        "it, fell from 117,800 men to some 35,000 within four days.",
      context:
        "The Eighth Army is the northern spearhead. Each commitment puts more of it behind the attack toward Lutsk and Kovel.",
    },
    {
      id: "ninth", name: "The Ninth Army in the south", meter: "manpower",
      units: [
        "Lechitsky's Ninth Army on the southern flank",
        "Its attack toward Doroshoutz, Okna and Czarny Potok",
        "Czernowitz and Kolomea, farther behind the Austro-Hungarian line",
      ],
      real:
        "The Austro-Hungarian Seventh Army in front of it, under Pflanzer-Baltin, held the southern sector with 194,200 men and lost 76,200 of them by 8 June. On 9 and 10 June the Ninth Army advanced on Doroshoutz, Okna and Czarny Potok. Czernowitz fell on 17 June and Kolomea on 18 June.",
      context:
        "The Ninth Army is the southern spearhead. Each commitment puts more men into the advance on the Bukovina.",
    },
    {
      id: "centre", name: "The Seventh and Eleventh Armies", meter: "will",
      units: [
        "Shcherbachev's Seventh Army, facing the Austro-Hungarian Seventh Army",
        "Sakharov's Eleventh Army in the centre of the front",
        "The attacks made at once on a wide front, so that no reserve knows where to go",
      ],
      real:
        "The Seventh Army pushed the Austro-Hungarian Seventh Army back to the Strypa and captured Jazlowiek. The Eleventh Army attacked on 4 June as part of the first wave. " +
        "The South Army, under the German general Bothmer, prepared a counter-attack on 11 June, and the line held.",
      context:
        "The central armies keep the enemy from moving his reserves. Each commitment puts more of them into the attack, so that the whole front is moving at once.",
    },
    {
      id: "guns", name: "The Guns and the Sap Works", meter: "munitions",
      units: [
        "Alexander Winogradsky's artillery brigade, whose 76 mm guns opened 24 breaches",
        "The 152 mm howitzers and 122 mm guns, firing at the hard points",
        "Sap trenches to within about 100 metres of the Austro-Hungarian lines, and tunnels under the Russian wire",
      ],
      real:
        "Each army attacked on a sector of about 15 kilometres of its own choosing, with two reinforced corps in waves and not a massed formation. Sap trenches were pushed to " +
        "within about 100 metres of the Austro-Hungarian lines, and tunnels ran under the Russian wire so that it stayed intact. False radio traffic, planted orders and dummy " +
        "artillery were used to deceive the enemy, and a creeping barrage moved ahead of the assaulting infantry.",
      context:
        "The guns and the sappers are what let the infantry cross. Each commitment puts more batteries, shells and trenches behind the attack, and takes them from the men who go over.",
    },
  ],
  // The Eighth Army first: the main effect was made toward Lutsk. The guns and the sap works second: the method was the point. The Ninth Army third, the centre last:
  // the armies that pinned the enemy. A game judgment, not a measurement.
  effectiveness: { eighth: 2.4, guns: 2.2, ninth: 1.8, centre: 1.4 },
  commanders: [
    { id: "brusilov", name: "Brusilov", role: "Commander of the South-Western Front", category: "guns",
      note: "He has planned the method, and each army's sector, and the deception." },
    { id: "kaledin", name: "Kaledin", role: "Commander of the Eighth Army", category: "eighth",
      note: "His army is the one that has to take Lutsk." },
    { id: "lechitsky", name: "Lechitsky", role: "Commander of the Ninth Army", category: "ninth",
      note: "His army is the one that has to go for the Bukovina." },
  ],
  approaches: [
    { id: "wide", name: "Attack on a wide front, each army on its own sector", note: "No single point of main effort, so the enemy cannot move his reserves.", modifiers: { centre: 0.5, ninth: 0.3, eighth: -0.2 } },
    { id: "lutsk", name: "Put the weight on the Eighth Army and Lutsk", note: "One main thrust in the north, and the other armies pin the enemy.", modifiers: { eighth: 0.6, centre: -0.4, ninth: -0.2 } },
  ],
  postures: [
    { id: "thin", name: "A thinly held Austro-Hungarian line", weight: 2,
      intel: "Deserters report the Austro-Hungarian Fourth Army's line thinly manned, some fifty battalions along the sector, and its reserves a long way back.",
      modifiers: { eighth: 1.2, guns: 1.1 } },
    { id: "warned", name: "An enemy that has been warned", weight: 1,
      intel: "Deserters speak of extra batteries and a new reserve division moved up behind the Austro-Hungarian line, as though an attack were expected.",
      modifiers: { guns: 0.8, ninth: 0.75, eighth: 0.9, centre: 0.9 } },
    { id: "german", name: "German divisions on their way", weight: 1,
      intel: "Intercepted messages mention German divisions entraining for the Kovel sector.",
      modifiers: { eighth: 0.75, centre: 1.1, ninth: 1.1 } },
  ],
  echo: {
    node: "stavka_1916_12_kovel",
    grade: {
      clean: "The plan for the offensive was built so that every army had its part, and the staff has the habit of working that way.",
      costly: "The offensive succeeded where its weight had been put, with other armies starved to pay for it.",
      marginal: "The plan for the offensive held together, and the first days did not go the way they should have.",
      total: "The plan for the offensive left parts of the front bare, and the army has seen what that costs.",
    },
    neglected: {
      eighth: "The Eighth Army was left short of what it needed.",
      ninth: "The Ninth Army was left short of what it needed.",
      centre: "The central armies were left short, and the enemy's reserves moved.",
      guns: "The guns and the sappers were left short of what they needed.",
    },
    commander: {
      brusilov: "Brusilov's method is the one the army now speaks of.",
      kaledin: "Kaledin's army is remembered as the one that went for Lutsk.",
      lechitsky: "Lechitsky's army is remembered as the one that went for the Bukovina.",
    },
  },
};

BATTLES.galiciaAustro = {
  id: "galiciaAustro",
  host: { node: "aok_1914_03_galicia", choice: "offensive" },
  winBranch: 1,
  campaign: "aok",
  title: "Order of Battle: Galicia",
  flavor:
    "Conrad has some 950,000 men on a front of about 280 kilometres and a plan to strike north before the Russians are ready. The Russians are stronger on the flank than he thought, " +
    "and they can bring more trains to the front than he can.",
  conditions:
    "The end of August, in the heat. The armies march from railheads: Austria-Hungary can run 152 trains a day to this front, and Russia 260.",
  categories: [
    {
      id: "first", name: "The First Army at Krasnik", meter: "manpower",
      units: [
        "Dankl's First Army, on the northern wing",
        "Its advance toward Krasnik against the Russian Fourth Army",
        "The Russian Fourth Army's position in front of it",
      ],
      real:
        "Dankl's First Army drove back the Russian Fourth Army at Krasnik and took about 6,000 prisoners. It was one of the two battles in the north that the Austro-Hungarian armies won, and the Russian Fourth Army's commander, Salza, was replaced by Evert afterward.",
      context:
        "The First Army is the northern wing of the blow. Each commitment puts more of it into the advance on Krasnik.",
    },
    {
      id: "fourth", name: "The Fourth Army at Komarow", meter: "manpower",
      units: [
        "Auffenberg's Fourth Army, in the centre of the northern wing",
        "Its attack on the Russian Fifth Army under Plehve",
        "The Russian Fifth Army's line at Komarow",
      ],
      real:
        "Auffenberg's Fourth Army drove back Plehve's Fifth Army at Komarow and took about 20,000 prisoners. It was a victory in the north, won while the south was giving way, and it could not make up for what was lost on the flank.",
      context:
        "The Fourth Army is the centre of the blow. Each commitment puts more of it into the attack at Komarow.",
    },
    {
      id: "third", name: "The Third Army and the Southern Flank", meter: "will",
      units: [
        "Brudermann's Third Army, advancing against the Russian left",
        "Army Group Kovess, on its flank",
        "The Gnila Lipa, the river line east of Lemberg",
      ],
      real:
        "The Third Army and Army Group Kovess were routed at the Gnila Lipa by Brusilov's Eighth Army and Ruzsky's Third. The Russians took Lemberg, and the army fell back about 160 kilometres to the Carpathians.",
      context:
        "The southern flank is where the Russians are strongest and the plan is weakest. Each commitment puts more of the army's strength and attention on it.",
    },
    {
      id: "rail", name: "The Second Army and the Railways", meter: "munitions",
      units: [
        "The Second Army, recalled from Serbia and on its way north",
        "The railways: 152 trains a day against Russia's 260",
        "Przemysl, the fortress behind the line of retreat",
      ],
      real:
        "The Second Army was recalled from Serbia and arrived too late to stop the collapse. Russia could bring 260 trains a day to its front, against 152 for Austria-Hungary, and the siege of Przemysl began once the army had fallen back.",
      context:
        "The railways decide how fast the army can be strengthened where it is weak. Each commitment puts more trains, shells and reserves behind the line.",
    },
  ],
  // The southern flank first: it was where the battle was lost. The Fourth Army second, the First third, the Second Army and the railways last.
  // A game judgment, not a measurement.
  effectiveness: { third: 2.4, fourth: 2.0, first: 1.7, rail: 1.4 },
  commanders: [
    { id: "dankl", name: "Dankl", role: "Commander of the First Army", category: "first",
      note: "His army is on the northern wing and is going forward." },
    { id: "auffenberg", name: "Auffenberg", role: "Commander of the Fourth Army", category: "fourth",
      note: "His army is the centre of the blow." },
    { id: "kovess", name: "Kovess", role: "Commander of the army group on the southern flank", category: "third",
      note: "His group is where the Russians are strongest." },
  ],
  approaches: [
    { id: "north", name: "Strike north with the First and Fourth Armies, as planned", note: "The weight goes into the northern wing and the flank is left to hold as it can.", modifiers: { first: 0.4, fourth: 0.4, third: -0.4 } },
    { id: "flank", name: "Keep a strong force on the southern flank", note: "The flank is covered and the blow in the north is smaller.", modifiers: { third: 0.6, rail: 0.2, first: -0.3, fourth: -0.3 } },
  ],
  postures: [
    { id: "strong", name: "The Russians stronger than expected, on the flank", weight: 2,
      intel: "Reports speak of Russian armies in strength on the southern flank, more than the plan allows for.",
      modifiers: { third: 0.7, rail: 0.9 } },
    { id: "north", name: "The Russians strongest in the north", weight: 1,
      intel: "Reports speak of the main Russian concentration in the north, against the First and Fourth Armies.",
      modifiers: { first: 0.8, fourth: 0.8, third: 1.2 } },
    { id: "late", name: "The Russians not yet concentrated", weight: 1,
      intel: "Reports say the Russian armies are still coming forward and are not yet in touch with each other.",
      modifiers: { first: 1.15, fourth: 1.15, third: 1.2, rail: 1.1 } },
  ],
  echo: {
    node: "aok_1914_04_rawa",
    grade: {
      clean: "The offensive in Galicia was planned so that every army had its part, and the staff has the habit of working that way.",
      costly: "The offensive in Galicia won where its weight was put, with other armies starved to pay for it.",
      marginal: "The plan for Galicia held together, and the battle did not go the way it should have.",
      total: "The offensive in Galicia was begun with parts of the front left bare, and the army has seen what that costs.",
    },
    neglected: {
      first: "The First Army was left short of what it needed.",
      fourth: "The Fourth Army was left short of what it needed.",
      third: "The southern flank was left too weak to hold.",
      rail: "The Second Army and the railways were left short, and help came too late.",
    },
    commander: {
      dankl: "Dankl's army is remembered as the one that won at Krasnik.",
      auffenberg: "Auffenberg's army is remembered as the one that won at Komarow.",
      kovess: "Kovess's group is remembered as the one on the flank.",
    },
  },
};

BATTLES.michaelGerman = {
  id: "michaelGerman",
  host: { node: "ohl_1918_09_michael", choice: "adaptive" },
  winBranch: 1,
  campaign: "ohl",
  title: "Order of Battle: the March Offensive",
  flavor:
    "Seventy-four divisions, 6,600 guns and a method nobody has used on this scale: a hurricane bombardment, then storm troops that go through the line and not at it. " +
    "What is not settled is what the blow is for.",
  conditions:
    "21 March, before dawn. A heavy fog lies on the ground, so thick in places that a man cannot see ten metres. It will hide the infantry, and the guns' targets.",
  categories: [
    {
      id: "eighteenth", name: "The Eighteenth Army at St Quentin", meter: "manpower",
      units: [
        "Hutier's Eighteenth Army, about 27 divisions",
        "Its attack on both sides of St Quentin",
        "Stormtroop battalions trained to infiltrate the line",
      ],
      real:
        "The Eighteenth Army carried the main weight, with about 27 divisions attacking on both sides of St Quentin, and was the only army to reach its objectives on the first day.",
      context:
        "The Eighteenth Army is the arm that can break through. Each commitment puts more of the divisions on the St Quentin sector.",
    },
    {
      id: "north", name: "The Seventeenth and Second Armies", meter: "manpower",
      units: [
        "Below's Seventeenth Army, attacking toward Arras",
        "Marwitz's Second Army, to attack west along the Somme toward Amiens",
        "The 44 'mobile' divisions among the 74",
      ],
      real:
        "The Seventeenth Army was to advance toward Arras and the Second Army along the Somme toward Amiens. Operation Mars on 28 March, with 29 divisions, was repulsed, and Ludendorff ended the offensive on 5 April after the fighting at Villers-Bretonneux.",
      context:
        "The northern armies are meant to roll the British back toward the Channel. Each commitment puts more of them into the attack at Arras and on the Somme.",
    },
    {
      id: "guns", name: "The Hurricane Bombardment", meter: "munitions",
      units: [
        "6,600 guns and 3,500 mortars",
        "326 aircraft",
        "Gas and smoke shell fired in three phases",
      ],
      real:
        "The bombardment opened at 4.35 and the barrage began at 4.40, along a front of about 69 kilometres: more than 3.5 million shells in five hours. The infantry attacked at 9.40, in fog.",
      context:
        "The guns open the line. Each commitment puts more batteries and shells into the five hours before the infantry go.",
    },
    {
      id: "objective", name: "The Objective and the Axis", meter: "will",
      units: [
        "Ludendorff's orders, which give each army its axis",
        "The aim of separating the British from the French",
        "Amiens, the city on the Somme",
      ],
      real:
        "A directive of 23 March re-aimed the offensive at separating the British and French armies and then taking Amiens. The advance covered some 3,100 square kilometres and as much as 65 kilometres of ground, but never reached Amiens.",
      context:
        "What the blow is for decides where the reserves go. Each commitment puts more of the headquarters' attention on naming the objective and holding to it.",
    },
  ],
  // The Eighteenth Army first: it was the army that went through. The objective second: how the blow was directed was what the criticism was about.
  // The guns third, the northern armies last. A game judgment, not a measurement.
  effectiveness: { eighteenth: 2.4, objective: 2.2, guns: 1.8, north: 1.4 },
  commanders: [
    { id: "ludendorff", name: "Ludendorff", role: "First Quartermaster-General", category: "objective",
      note: "He has made the breakthrough the plan, and the objective whatever the line gives." },
    { id: "hutier", name: "Hutier", role: "Commander of the Eighteenth Army", category: "eighteenth",
      note: "His army is the one that is to break through at St Quentin." },
  ],
  approaches: [
    { id: "exploit", name: "Exploit wherever the line gives", note: "The armies go where the resistance is weakest, and the objective follows.", modifiers: { eighteenth: 0.3, north: 0.2, objective: -0.4 } },
    { id: "amiens", name: "Hold every army to its axis, with Amiens in view", note: "One objective, and no diversions from it.", modifiers: { objective: 0.5, guns: 0.2, north: -0.3 } },
  ],
  postures: [
    { id: "forward", name: "A thinly held forward zone", weight: 2,
      intel: "Reconnaissance shows the British Fifth Army spread thinly over a long front, with its forward zone lightly held and its reserves far back.",
      modifiers: { eighteenth: 1.2, guns: 1.1 } },
    { id: "depth", name: "A defence in depth", weight: 1,
      intel: "Prisoners speak of a deep battle zone behind the forward line and of reserves close up to hold it.",
      modifiers: { north: 0.75, eighteenth: 0.85, objective: 1.1 } },
    { id: "warned", name: "An enemy that is ready", weight: 1,
      intel: "Deserters report the British expecting an attack within days, and their batteries moved to cover the approaches.",
      modifiers: { guns: 0.75, eighteenth: 0.85, objective: 0.9 } },
  ],
  echo: {
    node: "ohl_1918_13_aisne",
    grade: {
      clean: "The March offensive was planned so that every army and every arm had its part and its objective, and the staff is proud of the work.",
      costly: "The March offensive was won where its weight was put, with the rest starved to pay for it.",
      marginal: "The plan for March held together, and the offensive did not go as it should have.",
      total: "The March offensive was begun with parts of the plan left bare, and the army has seen what that costs.",
    },
    neglected: {
      eighteenth: "The Eighteenth Army was left short of what it needed to break through.",
      north: "The northern armies were left short, and could not hold the British.",
      guns: "The bombardment was left short of what the plan asked of it.",
      objective: "No objective was held to, and the armies went where the line gave.",
    },
    commander: {
      ludendorff: "Ludendorff's choice of objective is the one the army is arguing about.",
      hutier: "Hutier's army is remembered as the one that broke through.",
    },
  },
};

BATTLES.verdunGerman = {
  id: "verdunGerman",
  host: { node: "ohl_1916_04_verdun", choice: "attrition" },
  winBranch: 0,
  campaign: "ohl",
  title: "Order of Battle: Verdun",
  flavor:
    "Falkenhayn wants the French army drawn into a battle it cannot refuse and bled by the guns. The Fifth Army, which will fight it, can read the directive as an " +
    "order to take a fortress. The artillery programme is the same either way, for the first week.",
  conditions:
    "Late February, after a delay for the weather. The forts round Verdun have been stripped of their heavy guns, and the German guns are massed on the east bank of the Meuse.",
  categories: [
    {
      id: "guns", name: "The Guns and the Shell Supply", meter: "munitions",
      units: [
        "1,201 guns massed on the Verdun front, about two-thirds of them heavy",
        "808 guns in the opening bombardment",
        "A planned 2,000,000 shells in the first six days",
      ],
      real:
        "The attack was set for 12 February and put off by the weather. The bombardment began at 7.15 on the morning of 21 February and lasted about ten hours, with about a million shells on the first day.",
      context:
        "The guns do what the plan says they will. Each commitment puts more heavy batteries and shells on the French lines, and keeps them there longer.",
    },
    {
      id: "assault", name: "The Assault Corps", meter: "manpower",
      units: [
        "III Corps, VII Reserve Corps and XVIII Corps, each reinforced with 2,400 experienced troops and 2,000 recruits",
        "Rohr's Sturm-Bataillon Number 5, the stormtroop battalion",
        "The Brandenburg Regiment 24",
      ],
      real:
        "The infantry attacked at 4 in the afternoon of 21 February. On 25 February men of the Brandenburg Regiment 24 entered Fort Douaumont, held by a skeleton garrison of about 25 under Chenot; most of its guns had been taken away in 1915.",
      context:
        "The infantry take the ground. Each commitment puts more of the corps into the attack, and fewer behind it.",
    },
    {
      id: "command", name: "The Directive and the Command", meter: "will",
      units: [
        "Falkenhayn's directive, which can be read either way",
        "The Fifth Army's staff, who added the phrase 'relentless pressure'",
        "Knobelsdorf as chief of staff, and the Crown Prince as army commander",
      ],
      real:
        "Falkenhayn wanted the Meuse Heights, from which artillery could dominate the battle, and the French army bled. The phrase 'relentless pressure' made the aim ambiguous, since it could be read as an order to take Verdun.",
      context:
        "How the directive is read decides what the operation is. Each commitment puts more of the headquarters' effort into saying plainly what the battle is for.",
    },
    {
      id: "reserve", name: "The Reserve and the West Bank", meter: "manpower",
      units: [
        "XV Corps, held in army reserve",
        "The French guns on the west bank of the Meuse, firing across the river",
        "The Mort-Homme and Hill 265 (Cote 265), the west-bank heights",
      ],
      real:
        "The attack on the west bank began on 6 March, against the Mort-Homme and Hill 265, to silence the French artillery that fired across the river. By the end of March the German casualties were 81,607.",
      context:
        "The reserve is what the battle can go on with. Each commitment holds more men back, for the day the first plan runs out.",
    },
  ],
  // The command first: the roll turns on how the directive is read. The guns second, because the plan was an artillery plan. The assault corps third and the reserve last.
  // A game judgment, not a measurement.
  effectiveness: { command: 2.4, guns: 2.2, assault: 1.8, reserve: 1.3 },
  commanders: [
    { id: "falkenhayn", name: "Falkenhayn", role: "Chief of the General Staff", category: "command",
      note: "It is his battle: the French army is the object, and the city is only the bait." },
    { id: "knobelsdorf", name: "Knobelsdorf", role: "Chief of Staff of the Fifth Army", category: "assault",
      note: "His army has been given the directive, and may read it as an order to take the fortress." },
  ],
  approaches: [
    { id: "bleed", name: "Hold the ground and let the French counter-attack into the guns", note: "The guns do the work, and the infantry take only what the guns have cleared.", modifiers: { guns: 0.4, command: 0.3, assault: -0.4 } },
    { id: "press", name: "Press the infantry forward and take the heights", note: "Every day's ground is taken, and the reserve is spent behind it.", modifiers: { assault: 0.5, reserve: 0.3, guns: -0.2, command: -0.4 } },
  ],
  postures: [
    { id: "stripped", name: "A fortress stripped of its guns", weight: 2,
      intel: "Aerial photographs and agents report the forts stripped of their heavy guns, the trenches thinly held and few reserves near.",
      modifiers: { assault: 1.2, guns: 1.1 } },
    { id: "reinforced", name: "French divisions arriving", weight: 1,
      intel: "Agents report French divisions arriving by rail on the Meuse, and the line being strengthened behind the forts.",
      modifiers: { assault: 0.75, reserve: 0.8 } },
    { id: "counter", name: "A French counter-attack at once", weight: 1,
      intel: "Prisoners say the French command means to counter-attack at once and not to give up ground.",
      modifiers: { guns: 1.2, assault: 0.85, command: 1.1 } },
  ],
  echo: {
    node: "ohl_1916_14_somme",
    grade: {
      clean: "The battle on the Meuse was planned so that the guns, the infantry, the reserve and the directive all pointed one way, and the staff knows it.",
      costly: "The battle on the Meuse was fought as the directive meant, with some arms starved to pay for the rest.",
      marginal: "The plan on the Meuse held together, and the battle did not go as it was meant to.",
      total: "The battle on the Meuse was begun with parts of the plan left bare, and the army has seen what that costs.",
    },
    neglected: {
      guns: "The guns were left short of what the plan needed.",
      assault: "The assault corps were left short of men.",
      command: "The directive was left to be read two ways.",
      reserve: "The reserve was left too small to go on with.",
    },
    commander: {
      falkenhayn: "Falkenhayn's plan is the one the army is arguing about.",
      knobelsdorf: "Knobelsdorf's reading of the directive is the one the army is arguing about.",
    },
  },
};

BATTLES.kutOttoman = {
  id: "kutOttoman",
  host: { node: "otto_1915_03_kut", choice: "siege" },
  winBranch: 0,
  campaign: "otto",
  title: "Order of Battle: Kut",
  flavor:
    "A British Indian garrison is shut in a bend of the Tigris, and a relief force is gathering at Basra. The Sixth Army has three failed attacks behind it and not enough men for another.",
  conditions:
    "Winter on the Tigris: floods, mud and marsh, with the river the only road. The garrison has food for some weeks, and the relief force has to fight up the river to reach it.",
  categories: [
    {
      id: "siege", name: "The Siege Lines", meter: "manpower",
      units: [
        "The XVIII Corps, with the 45th and 51st Divisions, assigned to besiege Kut",
        "The siege works that Goltz directed after the December attacks",
        "A garrison of 8,000 to 13,000 men",
      ],
      real:
        "The Ottoman pursuit reached Kut on 7 December 1915 and Goltz made three attacks in December. After they failed he directed the building of siege works, and the siege lasted 147 days, to the surrender on 29 April 1916, when 13,164 men were taken.",
      context:
        "The siege lines keep the garrison where it is. Each commitment puts more of the army round the town, and fewer on the river.",
    },
    {
      id: "blocking", name: "The Blocking Force on the Tigris", meter: "manpower",
      units: [
        "The XIII Corps, with the 35th and 52nd Divisions, assigned down the Tigris to block any relief from Basra",
        "The river positions at Sheikh Sa'ad, the Wadi, Hanna and Dujaila",
        "The fords and the marsh on the Tigris",
      ],
      real:
        "The British relief attempts failed at Sheikh Sa'ad (6 to 9 January), the Wadi (13 January), Hanna, Dujaila (8 March) and, under Gorringe from 5 April, at Sannaiyat on 22 April, with about 1,200 British casualties there. All the relief efforts together cost around 30,000 killed and wounded.",
      context:
        "The blocking force meets the relief where it comes. Each commitment puts more men on the river positions, and takes them from the siege.",
    },
    {
      id: "command", name: "Goltz and the Command", meter: "will",
      units: [
        "Goltz, who led the Ottoman forces",
        "Khalil Pasha, who brought 20,000 to 30,000 reinforcements after Aylmer's defeat",
        "The Sixth Army, created on 5 October 1915",
      ],
      real:
        "The Sixth Army was created on 5 October 1915 under Goltz, who died of disease about a week before the surrender (typhoid, typhus or cholera, the sources disagree). Khalil Pasha came to the battle after Aylmer's defeat, with 20,000 to 30,000 reinforcements.",
      context:
        "A command that knows what it wants gets it. Each commitment puts more of the headquarters' effort into holding the plan together.",
    },
    {
      id: "supply", name: "Reinforcement and Supply", meter: "munitions",
      units: [
        "The reinforcements that raise the Ottoman strength from about 11,000",
        "The ammunition and rations for the siege lines",
        "No. 30 Squadron of the Royal Flying Corps, flying supplies to the garrison",
      ],
      real:
        "In April 1916 the Royal Flying Corps carried out the first air supply operation in history, but many parcels fell into the Tigris or the Ottoman trenches, and the rations delivered from 11 to 29 April were enough for only three days.",
      context:
        "Supply decides how long each side can hold. Each commitment puts more shells, rations and fresh men behind the Ottoman lines.",
    },
  ],
  // The blocking force first: the relief was beaten on the river. The siege lines second, the command third, the supply last. A game judgment, not a measurement.
  effectiveness: { blocking: 2.4, siege: 2.0, command: 1.6, supply: 1.5 },
  commanders: [
    { id: "goltz", name: "Goltz", role: "German field marshal, commander of the Sixth Army", category: "siege",
      note: "He built the siege works after the assaults failed, and will not see the end." },
    { id: "khalil", name: "Khalil Pasha", role: "Commander who brought the reinforcements", category: "blocking",
      note: "He has the relief to meet, and the reinforcements to do it with." },
  ],
  approaches: [
    { id: "starve", name: "Starve the garrison and meet the relief on the river", note: "No more assaults on the town; the weight goes to the river positions.", modifiers: { blocking: 0.3, siege: 0.2, supply: 0.1, command: -0.2 } },
    { id: "close", name: "Close the siege lines tighter and keep the army round the town", note: "The garrison is pressed, and the river is held by less.", modifiers: { siege: 0.5, command: 0.2, blocking: -0.3 } },
  ],
  postures: [
    { id: "piecemeal", name: "Relief attempts one after another", weight: 2,
      intel: "Reports from Basra say the British are sending the relief up the river in separate forces, as each is ready.",
      modifiers: { blocking: 1.2, supply: 1.1 } },
    { id: "together", name: "A relief in force, with air supply", weight: 1,
      intel: "Reports say the British are gathering a larger force at once and mean to supply the garrison from the air.",
      modifiers: { blocking: 0.7, siege: 0.9, supply: 0.9 } },
    { id: "breakout", name: "A breakout by the garrison", weight: 1,
      intel: "Deserters say the British commander in Kut wants to break out and join the relief.",
      modifiers: { siege: 0.7, command: 1.1 } },
  ],
  echo: {
    node: "otto_1916_01_erzurum",
    grade: {
      clean: "The siege was planned so that the lines, the river and the command all had their part, and the staff has learned from it.",
      costly: "The siege was won, with some arms starved to pay for the rest.",
      marginal: "The siege was planned soundly, and the relief went the other way.",
      total: "The siege was begun with parts of the plan left bare, and the army has seen what that costs.",
    },
    neglected: {
      siege: "The siege lines were left thin.",
      blocking: "The river positions were left short of men.",
      command: "The command was left divided about what the army was for.",
      supply: "The lines were left short of shells and rations.",
    },
    commander: {
      goltz: "Goltz's siege is the one the army talks about.",
      khalil: "Khalil's defence of the river is the one the army talks about.",
    },
  },
};

BATTLES.piaveAustro = {
  id: "piaveAustro",
  host: { node: "aok_1918_12_piave", choice: "divide" },
  winBranch: 1,
  campaign: "aok",
  title: "Order of Battle: the Piave",
  flavor:
    "The last offensive of the monarchy: 946,000 men and some 6,800 guns, and two army-group commanders who want different battles. Boroevic wants to cross the Piave, and Conrad wants to come down " +
    "from the mountains onto the plain.",
  conditions:
    "Mid-June, with the Piave swollen. Bridges have to be thrown across a river that the Italian guns can reach.",
  categories: [
    {
      id: "boroevic", name: "Boroevic's Thrust on the Piave", meter: "manpower",
      units: [
        "Army Group Boroevic: the Fifth Army (Wurm) and the Sixth (the Archduke Joseph)",
        "The crossing of the Piave toward the Adriatic coast",
        "The bridgehead on the far bank",
      ],
      real:
        "Boroevic's army group crossed the Piave on 15 June. It held a bridgehead about 24 kilometres wide and 8 deep until Diaz counter-attacked its flank on 19 June, which the Italians had retaken in full by 23 June.",
      context:
        "The Piave thrust is the one that can get across. Each commitment puts more of the army on the river, and takes it from the mountains.",
    },
    {
      id: "conrad", name: "Conrad's Thrust from the Mountains", meter: "manpower",
      units: [
        "Army Group Conrad: the Eleventh Army (Scheuchenstuel) and the Tenth (Krobatin)",
        "The Asiago plateau, and the road to Vicenza",
        "Mount Zovetto, Mount Lemerle and the Tre Monti",
      ],
      real:
        "Conrad attacked on the Asiago plateau on 15 June, aiming for Vicenza. He met stiff resistance at Mount Zovetto, Mount Lemerle and the Tre Monti, and went on attacking with a diminished force instead of sending reinforcements to the Piave.",
      context:
        "The mountain thrust is the one that can come down onto the plain. Each commitment puts more of the army on the plateau, and takes it from the river.",
    },
    {
      id: "guns", name: "The Guns and the Bridges", meter: "munitions",
      units: [
        "6,833 guns in all on the Austro-Hungarian side",
        "The bridging trains and pontoons",
        "The batteries that are to cover the crossing",
      ],
      real:
        "The Italian side had 5,650 guns and 1,570 mortars. The swollen river and the destruction of the bridges cut off the units that had crossed, and many men are reported to have drowned trying to get back.",
      context:
        "The guns and the bridges decide whether a crossing can be held. Each commitment puts more batteries and bridging behind the attack.",
    },
    {
      id: "secrecy", name: "Surprise and the Emperor's Orders", meter: "will",
      units: [
        "The plan of attack and the hour that was fixed for it",
        "Emperor Karl, who ordered the retreat",
        "Arz, the Chief of the General Staff",
      ],
      real:
        "The Italian artillery opened fire at 2.30 on the morning of 15 June, half an hour before the Austro-Hungarian attack at 3.00. Karl ordered the retreat on 20 June, and by 23 June the Italians had recovered all that was lost.",
      context:
        "A blow that is expected is a different blow. Each commitment puts more of the headquarters' effort into keeping the day and the place from the enemy.",
    },
  ],
  // The Piave thrust first, because it was the one that got across. Surprise second: the Italian artillery opened before the attack. The mountain thrust third, the guns last.
  // A game judgment, not a measurement.
  effectiveness: { boroevic: 2.3, secrecy: 2.2, conrad: 1.8, guns: 1.6 },
  commanders: [
    { id: "boroevic", name: "Boroevic", role: "Commander of the army group on the Piave", category: "boroevic",
      note: "He wants the whole army on the river." },
    { id: "conrad", name: "Conrad", role: "Commander of the army group in the mountains", category: "conrad",
      note: "He wants the attack from the mountains, and will not be told it is the lesser one." },
    { id: "arz", name: "Arz", role: "Chief of the General Staff", category: "secrecy",
      note: "He has two army-group commanders who want different battles, and one day to keep secret." },
  ],
  approaches: [
    { id: "equal", name: "Equal shares, as ordered", note: "Each commander has his own thrust and half the forces, and neither can say he was refused.", modifiers: { conrad: 0.3, boroevic: 0.2, secrecy: -0.2 } },
    { id: "river", name: "Give the reserves and the bridging to the Piave thrust", note: "The two thrusts are made, and the one on the river is the stronger.", modifiers: { boroevic: 0.6, guns: 0.3, conrad: -0.5 } },
  ],
  postures: [
    { id: "forewarned", name: "An enemy that has been told the day", weight: 2,
      intel: "Deserters and prisoners speak of Italian batteries moved up and a counter-bombardment prepared for the morning of the attack.",
      modifiers: { guns: 0.7, boroevic: 0.8, secrecy: 0.6 } },
    { id: "quiet", name: "A quiet front", weight: 1,
      intel: "The Italian line is quiet, with no sign of preparations on the river or on the plateau.",
      modifiers: { boroevic: 1.3, conrad: 1.2, secrecy: 1.4 } },
    { id: "elastic", name: "A defence that gives way", weight: 1,
      intel: "The Italian forward positions are lightly held, and the strength is held back on a second line.",
      modifiers: { conrad: 0.8, guns: 0.8, boroevic: 1.0 } },
  ],
  echo: {
    node: "aok_1918_13_vittorio",
    grade: {
      clean: "The offensive on the Piave was planned so that both thrusts and the guns and the secrecy all had their part, and the staff is proud of the work.",
      costly: "The offensive on the Piave won where its weight was put, with the rest starved to pay for it.",
      marginal: "The plan for the Piave held together, and the battle did not go the way it should have.",
      total: "The offensive on the Piave was begun with parts of the plan left bare, and the army has seen what that costs.",
    },
    neglected: {
      boroevic: "The thrust on the Piave was left short of what it needed.",
      conrad: "The thrust from the mountains was left short of what it needed.",
      guns: "The guns and the bridges were left short, and the crossing could not be held.",
      secrecy: "The day was left to leak, and the Italians were ready.",
    },
    commander: {
      boroevic: "Boroevic's thrust is remembered as the one that got across.",
      conrad: "Conrad's thrust is remembered as the one that was left alone.",
      arz: "Arz's plan is the one that the army is arguing about.",
    },
  },
};

BATTLES.caporettoAustro = {
  id: "caporettoAustro",
  host: { node: "aok_1917_11_caporetto", choice: "german" },
  winBranch: 0,
  campaign: "aok",
  title: "Order of Battle: Caporetto",
  flavor:
    "Nine Austro-Hungarian and six to eight German divisions are to be made into a new Fourteenth Army under Otto von Below, to break the Italian line at the northern end of the " +
    "Isonzo front. The Italians hold the heights in a line packed forward. What has to be planned is how the blow is struck: by the guns and the gas, by infantry that goes round the strong points, or by the pursuit that follows.",
  conditions:
    "Late October in the Julian Alps: mist in the valley, no wind on the morning of the attack, and the date put back two days by the weather and by guns not yet in place.",
  categories: [
    {
      id: "divisions", name: "The Fourteenth Army's Divisions", meter: "manpower",
      units: [
        "Otto von Below's Fourteenth Army: nine Austro-Hungarian and six to eight German divisions",
        "The German divisions, Ludendorff's general reserve, lent for the offensive",
        "Army Group Boroevic, held ready on the Isonzo for the offensive",
      ],
      real:
        "The army struck at the northern end of the Isonzo front and broke the Italian line between the IV and XXVII Corps. Some units advanced 25 kilometres on the first day, and by 10 November the Central Powers had come about 150 kilometres to the Piave.",
      context:
        "The divisions are the weight of the blow. Each commitment puts more of them into the breakthrough at Caporetto, and fewer on the flanks.",
    },
    {
      id: "guns", name: "The Guns and the Gas", meter: "munitions",
      units: [
        "About 2,200 guns that opened fire at 6.41 on the morning of the attack",
        "894 metal tubes, like Livens projectors, firing chlorine and arsenic agent and diphosgene",
        "Two large mines fired at 8 o'clock, as the infantry went forward",
      ],
      real:
        "At 2 in the morning on 24 October the tubes fired gas into the valley, and at 6.41 some 2,200 guns opened fire. At 8 two large mines were fired and the infantry attacked. The gas is reported to have killed 500 to 600 Italians.",
      context:
        "The guns open the line. Each commitment puts more batteries, gas and shell into the first hours, and takes them from the pursuit.",
    },
    {
      id: "storm", name: "The Storm Troops on the Ridges", meter: "will",
      units: [
        "Stormtroop units with the 08/15 Maxim light machine gun, light trench mortars, mountain guns and flamethrowers",
        "Alpine troops who infiltrated the ridges at Matajur and Kolovrat, laying telephone lines as they went",
        "Erwin Rommel, then a junior officer, who won the Pour le Merite and later wrote Infantry Attacks",
      ],
      real:
        "The storm units did not attack the line. They went between the Italian positions and down the valleys behind them, and the mountain troops took the ridges at Matajur and Kolovrat. Rommel won the Pour le Merite for his part.",
      context:
        "The storm troops are the method. Each commitment puts more of the army's confidence in the infantry that goes round the strong points.",
    },
    {
      id: "pursuit", name: "The Pursuit and the Railways", meter: "manpower",
      units: [
        "The advance down the valleys behind the storm units",
        "The roads and railways that had to be repaired to keep the army fed",
        "The Tagliamento and the Piave, the rivers the Italians fell back on",
      ],
      real:
        "After Cadorna ordered the retreat on 30 October the Italian crossing of the Tagliamento took four days. By 10 November the Italians held the Piave and Monte Grappa, and about 265,000 to 275,000 of them had been taken and some 3,000 guns lost.",
      context:
        "The pursuit turns a breakthrough into a victory. Each commitment holds more men and more supply back for the days after the blow.",
    },
  ],
  // The storm troops first: the method was what broke the line. The guns second. The divisions third and the pursuit last. A game judgment, not a measurement.
  effectiveness: { storm: 2.4, guns: 2.2, divisions: 1.8, pursuit: 1.4 },
  commanders: [
    { id: "below", name: "Below", role: "German general commanding the Fourteenth Army", category: "divisions",
      note: "He has the army that has been made for the blow." },
    { id: "krafft", name: "Krafft von Dellmensingen", role: "German lieutenant general, mountain-warfare expert", category: "storm",
      note: "He reconnoitred the ground and chose where the army would go in." },
    { id: "boroevic", name: "Boroevic", role: "Commander of the Army Group on the Isonzo", category: "pursuit",
      note: "He has held the Isonzo for two years, and will lead the pursuit." },
  ],
  approaches: [
    { id: "infiltrate", name: "Let the storm units go down the valleys and leave the strong points", note: "The line is turned and not attacked, and the guns follow.", modifiers: { storm: 0.5, divisions: -0.2, guns: -0.2 } },
    { id: "bombard", name: "Break the line with gas and guns first, then send the infantry", note: "The line is opened by the guns, and the storm units follow through.", modifiers: { guns: 0.5, pursuit: 0.1, storm: -0.4 } },
  ],
  postures: [
    { id: "forward", name: "A line packed forward on the heights", weight: 2,
      intel: "Reports say the Italian Second Army holds its line packed forward on the slopes, with its reserves too far back and its commander ill.",
      modifiers: { storm: 1.2, guns: 1.1 } },
    { id: "depth", name: "A defence in depth", weight: 1,
      intel: "Deserters speak of new orders to hold the line in depth, with a second position behind the first and reserves brought up close.",
      modifiers: { storm: 0.8, divisions: 1.1, pursuit: 0.8 } },
    { id: "warned", name: "An enemy that has been warned", weight: 1,
      intel: "Prisoners report that an attack at the northern end of the front is expected within days, and that guns have been moved up to meet it.",
      modifiers: { guns: 0.75, storm: 0.9, divisions: 1.0 } },
  ],
  echo: {
    node: "aok_1917_12_pursuit",
    grade: {
      clean: "The blow at Caporetto was planned so that the divisions, the guns, the storm troops and the pursuit each had their part, and the staff knows it.",
      costly: "The blow at Caporetto was won where its weight was put, with some arms starved to pay for the rest.",
      marginal: "The plan for Caporetto held together, and the battle did not go the way it should have.",
      total: "The blow at Caporetto was begun with parts of the plan left bare, and the army has seen what that costs.",
    },
    neglected: {
      divisions: "The divisions were left short of what the breakthrough needed.",
      guns: "The guns and the gas were left short, and the line did not open as it should have.",
      storm: "The storm troops were left short, and the line had to be attacked and not turned.",
      pursuit: "The pursuit was left short, and the army ran out of road and food too soon.",
    },
    commander: {
      below: "Below's army is the one that is spoken of as having broken the line.",
      krafft: "Krafft's choice of ground is the one that is spoken of as having won it.",
      boroevic: "Boroevic's pursuit is the one that is spoken of as having followed it.",
    },
  },
};

BATTLES.megiddoOttoman = {
  id: "megiddoOttoman",
  host: { node: "otto_1918_02_megiddo", choice: "hold" },
  winBranch: 1,
  campaign: "otto",
  title: "Order of Battle: Megiddo",
  flavor:
    "Liman von Sanders has three armies and about 32,000 infantry between the sea and the Jordan. Allenby has put nearly five times as many men on the coast, behind a deception " +
    "that has made the Ottoman staff look east. What has to be planned is how the line is held against a blow that has been hidden until the last night.",
  conditions:
    "Mid-September, dry, with dust on the roads and the sky held by British aeroplanes. The Ottoman units are understrength, short of food and boots, and losing men to desertion and sickness.",
  categories: [
    {
      id: "coast", name: "The Coast: Eighth Army and XXII Corps", meter: "manpower",
      units: [
        "Jevad's Eighth Army: five divisions, a cavalry division and a German detachment of about a regiment",
        "Refet's XXII Corps on the right flank of the Eighth Army",
        "The line from the sea to the Judean Hills",
      ],
      real:
        "The main blow fell on the coast at 4.30 on 19 September, after a barrage by 385 guns. The headquarters of the XXII Corps was overrun that day. Refet had wanted to withdraw before the attack and had been forbidden.",
      context:
        "The coast is where the blow will fall. Each commitment puts more men on the line from the sea to the hills, and fewer in the hills.",
    },
    {
      id: "hills", name: "The Hills: the Seventh Army", meter: "manpower",
      units: [
        "Mustafa Kemal's Seventh Army: four divisions and a German regiment",
        "The Judean Hills, from the Eighth Army's flank to the Jordan",
        "The Nablus to Beisan road, through the defile of the Wadi Fara",
      ],
      real:
        "On 21 September British aeroplanes attacked the Seventh Army's column on the road from Nablus to Beisan, in the defile of the Wadi Fara, and the column was destroyed in about an hour, its wreckage stretching over six miles.",
      context:
        "The hills guard the road back. Each commitment puts more men in the Seventh Army's sector and fewer on the coast.",
    },
    {
      id: "signals", name: "The Telephones and the Staff", meter: "will",
      units: [
        "The telephone exchange at Afula, between Liman's headquarters at Nazareth and the Seventh and Eighth Armies",
        "Liman's two German regiments and two weak cavalry divisions in reserve",
        "The staff at Nazareth, which commands the army group by wire",
      ],
      real:
        "At 1 in the morning on 19 September a single bomber dropped sixteen bombs on the Afula exchange and station, and the army group was cut off from the Seventh and Eighth Armies for two days. On the 20th British cavalry attacked Nazareth, and Liman escaped.",
      context:
        "The wire is how the army group is commanded. Each commitment puts more of the headquarters' effort into keeping orders moving when the lines are cut.",
    },
    {
      id: "guns", name: "The Guns and the Road Back", meter: "munitions",
      units: [
        "402 guns on the front, against about 540 on the British side",
        "The railway from Damascus and the line to Deraa",
        "The supply columns on the roads north of Nablus",
      ],
      real:
        "The Ottoman guns were outnumbered, and the columns on the roads left behind 87 guns, 55 motor lorries and 837 wagons. By the fall of Damascus on 1 October about 75,000 Ottoman soldiers had been taken.",
      context:
        "The guns and the roads decide whether an army can get away. Each commitment puts more batteries and transport behind the line.",
    },
  ],
  // The coast first: it is where the blow fell. The telephones and the staff second: the cut wire decided how the army group could answer.
  // The hills third, the guns and roads last. A game judgment, not a measurement.
  effectiveness: { coast: 2.3, signals: 2.1, hills: 1.7, guns: 1.3 },
  commanders: [
    { id: "liman", name: "Liman von Sanders", role: "Commander of the Yildirim Army Group", category: "signals",
      note: "He commands three armies by wire from Nazareth." },
    { id: "refet", name: "Refet", role: "Commander of the XXII Corps on the coast", category: "coast",
      note: "He thinks the attack is coming on his front, and wants to withdraw before it." },
    { id: "kemal", name: "Mustafa Kemal", role: "Commander of the Seventh Army", category: "hills",
      note: "He thinks the line too long for the men who hold it." },
  ],
  approaches: [
    { id: "withdraw", name: "Draw the coast corps back to a shorter line before the blow", note: "The line is shorter and the first blow falls on empty ground.", modifiers: { coast: 0.5, hills: 0.2, signals: -0.2 } },
    { id: "hold", name: "Hold every position and keep the reserve behind the centre", note: "No ground is given, and the reserve answers where the line gives.", modifiers: { signals: 0.3, guns: 0.2, coast: -0.4 } },
  ],
  postures: [
    { id: "coast", name: "The main blow on the coast", weight: 2,
      intel: "Prisoners and deserters speak of troops moving by night toward the coast, and the staff is divided about whether to believe them.",
      modifiers: { coast: 0.7, signals: 0.8, guns: 0.9 } },
    { id: "jordan", name: "The blow in the Jordan Valley", weight: 1,
      intel: "Airmen and patrols report much activity in the Jordan Valley, with camps on the east bank and a fresh cavalry division reported there.",
      modifiers: { coast: 1.3, hills: 1.1, signals: 1.1 } },
    { id: "feint", name: "A feint on the coast and a blow in the hills", weight: 1,
      intel: "A deserter says the coast is a feint and the real attack is meant for the hills, toward Nablus.",
      modifiers: { hills: 0.8, coast: 1.1, signals: 1.0 } },
  ],
  echo: {
    node: "otto_1918_03_mudros",
    grade: {
      clean: "The line in Palestine was planned so that the coast, the hills, the wire and the guns each had their part, and the staff knows it.",
      costly: "The line in Palestine held where its weight was put, with some arms starved to pay for the rest.",
      marginal: "The plan for Palestine held together, and the battle did not go the way it should have.",
      total: "The line in Palestine was held with parts of the plan left bare, and the army has seen what that costs.",
    },
    neglected: {
      coast: "The coast was left short of men, and was the first place to give.",
      hills: "The hills were left short of men, and the road back was not held.",
      signals: "The wire and the staff were left short, and the army group could not answer.",
      guns: "The guns and the road back were left short, and the columns were caught on the roads.",
    },
    commander: {
      liman: "Liman's plan for the line is the one that is argued about.",
      refet: "Refet's judgment of where the blow would fall is the one that is argued about.",
      kemal: "Mustafa Kemal's judgment of the length of the line is the one that is argued about.",
    },
  },
};

BATTLES.tannenbergRussian = {
  id: "tannenbergRussian",
  host: { node: "stavka_1914_12_tannenberg", choice: "wheel" },
  winBranch: 0,
  campaign: "stavka",
  title: "Order of Battle: Tannenberg",
  flavor:
    "The Second Army has gone into East Prussia from the south before its concentration was finished and before its bread could follow, and the First Army is a long way off to the north-east. " +
    "The German Eighth Army, beaten at Gumbinnen, is thought by the staff to be falling back on the Vistula. What has to be planned is how the army is turned: which corps are drawn together, " +
    "what is done about the bread, and how the link with the First Army is made.",
  conditions:
    "Late August in the lakes and sand of East Prussia: hot days, few good roads, and a country of forests and marshes in which the corps cannot see each other. The wireless sets are the only link between the armies, and the staff sends its orders in clear.",
  categories: [
    {
      id: "corps", name: "The Second Army's Corps", meter: "manpower",
      units: [
        "Samsonov's Second Army, five corps and its cavalry",
        "The corps on the right, marching toward Allenstein",
        "The corps in the centre, on the roads through the forest",
      ],
      real:
        "The corps were strung out over sandy roads a day or more apart. When the German Eighth Army struck on 26 August, the corps on the flanks were beaten in turn and the centre was drawn into a pocket. " +
        "The army was almost entirely destroyed, and Samsonov died by his own hand.",
      context:
        "The corps are the army. Each commitment puts more of them in the march on Allenstein and fewer on the roads that hold the army together.",
    },
    {
      id: "bread", name: "Bread and the Railheads", meter: "munitions",
      units: [
        "The field bakeries and the carts that carry the corps' bread",
        "The railheads that the army has marched away from",
        "The wells and villages of the sandy country in between",
      ],
      real:
        "The army marched away from its railheads, through thin and sandy country, without the carts to follow it. The corps commanders complained that the men were short of bread and the horses of oats, " +
        "and the army reached the battle hungry and tired.",
      context:
        "Bread is what holds an army to its road. Each commitment puts more carts and more days of food behind the corps, and takes them from the march.",
    },
    {
      id: "link", name: "The Wireless and the Link with the First Army", meter: "will",
      units: [
        "Zhilinsky's headquarters of the North-Western Front",
        "Rennenkampf's First Army, to the north-east",
        "The wireless sets, whose messages were sent in clear",
      ],
      real:
        "The Germans intercepted and read the Russian wireless messages, which were not enciphered, and knew where the Second Army was going. Rennenkampf's First Army, to the north-east, did not come to the Second Army's help, " +
        "and the front headquarters was a long way from the fighting.",
      context:
        "The link is what makes two armies one. Each commitment puts more of the staff's effort into the wireless, the codes and the orders between the armies.",
    },
    {
      id: "flank", name: "The Flank Corps", meter: "manpower",
      units: [
        "The corps on the left, round Soldau",
        "The cavalry screen on the flanks",
        "The reserve brigades on the road behind",
      ],
      real:
        "On the left the Russian I Corps was attacked by François's corps, which had been brought by rail to the south-west, and was driven back toward Soldau. The flank that should have been the army's shield was opened, " +
        "and the Germans closed in behind the centre.",
      context:
        "The flanks are what keep an army from being enveloped. Each commitment puts more men and horse on the corps at the edges of the line.",
    },
  ],
  // The link first: the army was beaten by an enemy that read its orders. Bread second. The corps third and the flank last. A game judgment, not a measurement.
  effectiveness: { link: 2.4, bread: 2.0, corps: 1.8, flank: 1.6 },
  commanders: [
    { id: "samsonov", name: "Samsonov", role: "Commander of the Second Army", category: "corps",
      note: "He has taken the army into the country and he is the one who has to bring it out." },
    { id: "zhilinsky", name: "Zhilinsky", role: "Commander of the North-Western Front", category: "link",
      note: "He has the two armies and the wireless that is meant to join them." },
    { id: "rennenkampf", name: "Rennenkampf", role: "Commander of the First Army", category: "flank",
      note: "His army is the one that is to close the gap, and it is a long way off." },
  ],
  approaches: [
    { id: "close", name: "Draw the corps together toward the First Army and shorten the front", note: "The corps are brought close and the link is made good before the army goes further.", modifiers: { link: 0.5, corps: 0.2, flank: -0.3 } },
    { id: "feed", name: "Halt for the bread and close up the flank corps first", note: "The army stops where it is, and eats, and waits for the corps to come up.", modifiers: { bread: 0.5, flank: 0.3, corps: -0.4 } },
  ],
  postures: [
    { id: "retiring", name: "A German army in retreat toward the Vistula", weight: 2,
      intel: "Zhilinsky's staff reports that the German Eighth Army, beaten at Gumbinnen, is falling back toward the Vistula, and that the Second Army has only to pursue it.",
      modifiers: { corps: 1.2, bread: 1.1 } },
    { id: "turning", name: "A German army turning south on the Second Army", weight: 1,
      intel: "Cavalry patrols report German columns marching south toward Soldau and Neidenburg, with trains of troops moving by rail on the flank.",
      modifiers: { link: 1.25, flank: 1.2, corps: 0.8 } },
    { id: "reinforced", name: "A German army that has been reinforced and has read the wireless", weight: 1,
      intel: "Intercepted German messages and prisoners suggest that the Eighth Army has been reinforced and is moving to meet the Second Army where it is weakest.",
      modifiers: { link: 1.2, bread: 0.85, flank: 1.1 } },
  ],
  echo: {
    node: "stavka_1914_02_galicia",
    grade: {
      clean: "The Second Army's march was planned so that the corps, the bread, the wireless and the flank each had their part, and the staff knows it.",
      costly: "The Second Army's march was kept together where its weight was put, with some arms left short to pay for the rest.",
      marginal: "The plan for the Second Army held together, and the battle did not go the way it should have.",
      total: "The Second Army went into the country with parts of its plan left bare, and the staff has seen what that costs.",
    },
    neglected: {
      corps: "The corps were left short of the men that the march needed.",
      bread: "The bread and the carts were left short, and the army arrived hungry.",
      link: "The wireless and the link were left short, and the enemy read the orders.",
      flank: "The flank corps were left short, and the flank was opened.",
    },
    commander: {
      samsonov: "Samsonov's march is the one that is spoken of as having brought the army through.",
      zhilinsky: "Zhilinsky's link between the armies is the one that is spoken of as having held.",
      rennenkampf: "Rennenkampf's army is the one that is spoken of as having come up in time.",
    },
  },
};

BATTLES.cheminFrench = {
  id: "cheminFrench",
  host: { node: "gqg_1917_07_chemin", choice: "continue" },
  winBranch: 1,
  campaign: "gqg",
  title: "Order of Battle: the Chemin des Dames",
  flavor:
    "The Fifth and Sixth Armies attacked on 16 April and took the lightly held front line. The German second position on the ridge is intact, the defenders are in quarries the barrage did not reach, " +
    "and the promise given to the Minister of War was that the attack would stop if it had not broken through. What has to be planned is how the offensive is continued: where the guns and the tanks are put, and what the men are told.",
  conditions:
    "Late April on the Aisne: cold rain on the slopes, mud in the valleys, the ridge above covered by German machine guns, and an army that was told it was the last offensive.",
  categories: [
    {
      id: "infantry", name: "The Divisions on the Ridge", meter: "manpower",
      units: [
        "The divisions of the Sixth Army under Mangin, on the left",
        "The divisions of the Fifth Army under Mazel, on the right",
        "The reserve divisions that Nivelle has kept back",
      ],
      real:
        "On 16 April the infantry took the lightly held front line and found the intermediate defences largely intact. Troops, among them colonial regiments, fought their way up the slope and gained the ridge in places, " +
        "but fire from the German second line on the plateau cut down soldiers by the platoon. The offensive was abandoned on 9 May.",
      context:
        "The divisions are the weight of the offensive. Each commitment puts more of them on the slope, and fewer in reserve for the days after.",
    },
    {
      id: "barrage", name: "The Barrage and the Guns", meter: "munitions",
      units: [
        "The preliminary bombardment that began on 2 April",
        "The creeping barrage that was to walk ahead of the infantry",
        "The heavy guns that had to find the German batteries in the quarries",
      ],
      real:
        "The bombardment had not destroyed the German defences in depth. The creeping barrage ran too far ahead of the infantry, and as the distance between them grew to hundreds of yards " +
        "the German reserves were freed to counter-attack.",
      context:
        "The guns open the way. Each commitment puts more batteries and shell into the preparation, and takes them from the days when the infantry are on the slope.",
    },
    {
      id: "tanks", name: "The Tanks at Berry-au-Bac", meter: "munitions",
      units: [
        "The groups of Schneider tanks with the Fifth Army",
        "The crews, who had never fought together",
        "The ground in front of Berry-au-Bac, cut by German guns",
      ],
      real:
        "The Schneider tank went into action for the first time at Berry-au-Bac, in support of the Fifth Army, with more than a hundred machines. The losses were heavy, " +
        "and a large part of them were lost on the first day. They brought the infantry little help.",
      context:
        "The tanks are the new thing. Each commitment puts more of the new machines and crews where they are tried, and takes them from the arm that has to carry the day.",
    },
    {
      id: "word", name: "What the Men Are Told", meter: "will",
      units: [
        "The promise of a breakthrough in forty-eight hours",
        "The men's belief that this was the last offensive",
        "The orders read to the regiments before they went forward",
      ],
      real:
        "The attack had been promised as the decisive one. When it failed, the French lost some 185,000 men by one count, and the belief that this offensive would end the war went with them. " +
        "The refusals of May followed.",
      context:
        "The men's belief is what makes them climb the ridge. Each commitment puts more of the army's trust in what it has been told, and what it has been promised.",
    },
  ],
  // What the men were told first: it was the army's belief that broke. The barrage second. The divisions third and the tanks last. A game judgment, not a measurement.
  effectiveness: { word: 2.4, barrage: 2.2, infantry: 1.8, tanks: 1.2 },
  commanders: [
    { id: "mangin", name: "Mangin", role: "Commander of the Sixth Army", category: "infantry",
      note: "He believes in the attack, and he is the one who has to make it again." },
    { id: "mazel", name: "Mazel", role: "Commander of the Fifth Army", category: "barrage",
      note: "His army has the heavy guns, and he has doubted the plan from the start." },
    { id: "estienne", name: "Estienne", role: "Colonel, father of the French tank arm", category: "tanks",
      note: "He built the tanks, and he is the one who will say what they are for." },
  ],
  approaches: [
    { id: "whole", name: "Go on attacking along the whole front, as the Minister was promised", note: "The army goes on as the plan had it, and the men are told that it is the last effort.", modifiers: { word: 0.4, infantry: 0.2, barrage: -0.3 } },
    { id: "sector", name: "Stop the general attack and make a limited one on a single sector with the guns shifted to it", note: "One sector is taken with all the guns, and the rest of the line is held.", modifiers: { barrage: 0.5, infantry: 0.1, word: -0.4 } },
  ],
  postures: [
    { id: "quarries", name: "A German second position intact in the quarries", weight: 2,
      intel: "Prisoners and air photographs show the German second position intact on the ridge, with the defenders in the quarries and the machine guns sited to cover every approach.",
      modifiers: { barrage: 1.2, infantry: 0.9, tanks: 0.8 } },
    { id: "depth", name: "A defence in depth, with the counter-attack divisions behind it", weight: 1,
      intel: "German reserves are reported close behind the ridge, with fresh divisions brought up and ready to counter-attack any gain that is made.",
      modifiers: { infantry: 1.2, word: 0.85, tanks: 1.1 } },
    { id: "shaken", name: "A defence that has been shaken by the first day", weight: 1,
      intel: "Deserters from the first day say that the German front line was thinly held and that the defenders on the ridge are short of food and ammunition.",
      modifiers: { word: 1.2, infantry: 1.1, barrage: 0.8 } },
  ],
  echo: {
    node: "gqg_1917_13_directive",
    grade: {
      clean: "The offensive was continued so that the divisions, the guns, the tanks and the men's belief each had their part, and the staff knows it.",
      costly: "The offensive was pressed where its weight was put, with some arms left short to pay for the rest.",
      marginal: "The plan for the offensive held together, and the ridge was not taken.",
      total: "The offensive was continued with parts of the plan left bare, and the army has seen what that costs.",
    },
    neglected: {
      infantry: "The divisions were left short of what the slope needed.",
      barrage: "The guns and the barrage were left short, and the defenders were not suppressed.",
      tanks: "The tanks were left short, and they did not help the infantry.",
      word: "What the men were told was left short of the truth, and they noticed.",
    },
    commander: {
      mangin: "Mangin's attack is the one that is spoken of as having gone on longest.",
      mazel: "Mazel's guns are the ones that are spoken of as having prepared it.",
      estienne: "Estienne's tanks are the ones that are spoken of as having been tried.",
    },
  },
};

BATTLES.flersBritish = {
  id: "flersBritish",
  host: { node: "bef_1916_12_tanks", choice: "now" },
  winBranch: 1,
  campaign: "bef",
  title: "Order of Battle: Flers and Courcelette",
  flavor:
    "The Somme has gone on for ten weeks, and the army needs a success. Forty-nine tanks are ready, and the attack of 15 September on the Fourth Army's front is the next chance to try them. " +
    "The officers who built them would have waited for a mass attack on chosen ground. What has to be planned is how the tanks are used: where they go, how the guns and the infantry work with them, and how much of the secret is kept.",
  conditions:
    "Mid-September on the high ground of the Somme: a dry morning, the ground broken by ten weeks of shelling, and woods and villages that have been fought over since July.",
  categories: [
    {
      id: "tanks", name: "The Tanks", meter: "munitions",
      units: [
        "The forty-nine tanks of the Heavy Section",
        "The crews, who had trained in secret for months",
        "The lanes left in the barrage for the tanks to pass",
      ],
      real:
        "Of the forty-nine tanks, fewer than forty reached the start lines, and many of those broke down or ditched. A few reached Flers, and within fifteen minutes infantry had joined them and occupied the north and west of the village. " +
        "Two of the four tanks with the New Zealand Division were knocked out by German artillery.",
      context:
        "The tanks are the new thing. Each commitment puts more of them and their crews where they are tried, and takes them from the arm that has to carry the day.",
    },
    {
      id: "infantry", name: "The Six Divisions", meter: "manpower",
      units: [
        "The divisions of the Fourth Army that attack from Delville Wood to Flers",
        "The 2nd Canadian Division, on the left, going for Courcelette",
        "The New Zealand Division, between Delville Wood and High Wood",
      ],
      real:
        "Six divisions attacked on 15 September. On the left the 2nd Canadian Division took Courcelette, and the New Zealanders fought between Delville and High Woods. The line advanced about a mile and a half and High Wood was taken, " +
        "at a cost of some 29,000 casualties.",
      context:
        "The divisions are the weight of the attack. Each commitment puts more of them in the line and fewer in reserve for the next day.",
    },
    {
      id: "guns", name: "The Barrage", meter: "munitions",
      units: [
        "The heavy artillery that cut the wire and shelled the German batteries",
        "The creeping barrage that walked ahead of the infantry",
        "The gaps left open in the barrage for the tanks",
      ],
      real:
        "The British artillery fired a heavy barrage, with lanes left open so that the tanks could pass through it. It carried the infantry across the first German lines, and it did not reach the guns behind them.",
      context:
        "The guns open the way. Each commitment puts more of them and their shell into the barrage, and takes them from the tanks and the infantry.",
    },
    {
      id: "secret", name: "The Secret", meter: "will",
      units: [
        "The ground that the designers wanted chosen for the first mass attack",
        "The camouflage and the roads by which the tanks were brought up",
        "The staff's plan for how the first use would be explained",
      ],
      real:
        "The designers wanted the tanks held back until enough were ready for a mass attack on chosen ground. They were used in small groups in a battle already ten weeks old, and the Germans saw them and learned what the new weapon was.",
      context:
        "Surprise can be used once. Each commitment puts more of the army's effort into keeping the secret, and the later lessons for those who try.",
    },
  ],
  // The infantry and the barrage first: the attack was won, where it was won, by them. The tanks next. The secret last. A game judgment, not a measurement.
  effectiveness: { infantry: 2.2, guns: 2.0, tanks: 1.8, secret: 1.2 },
  commanders: [
    { id: "haig", name: "Haig", role: "Commander-in-Chief of the British armies in France", category: "secret",
      note: "He wants the tanks tried now, and the secret is his to spend." },
    { id: "rawlinson", name: "Rawlinson", role: "Commander of the Fourth Army", category: "infantry",
      note: "His army has made the attack for ten weeks, and he is the one who will make it again." },
    { id: "elles", name: "Elles", role: "Commander of the Heavy Section", category: "tanks",
      note: "He has the machines and the crews, and he knows what they cannot do." },
  ],
  approaches: [
    { id: "groups", name: "Spread the tanks in small groups ahead of the infantry along the whole front", note: "Every division gets a few, and the line is helped at the places where it is weakest.", modifiers: { tanks: 0.3, infantry: 0.3, secret: -0.4 } },
    { id: "massed", name: "Keep the tanks in two strong groups at the points where the ground is best", note: "Two blows are made with all the machines, and the rest of the line is carried by the guns and the infantry.", modifiers: { tanks: 0.5, secret: 0.2, infantry: -0.3 } },
  ],
  postures: [
    { id: "trenches", name: "German trenches that are strong on the high ground", weight: 2,
      intel: "Air photographs show the German front system intact on the high ground, with the second line behind it and the villages of Flers and Courcelette strongly held.",
      modifiers: { guns: 1.2, infantry: 0.9, tanks: 0.85 } },
    { id: "wire", name: "Uncut wire and machine guns in the villages", weight: 1,
      intel: "Patrols report that the wire in front of Flers is uncut in places, and the machine guns in the ruins have been moved forward.",
      modifiers: { tanks: 1.25, secret: 1.1, guns: 0.85 } },
    { id: "thin", name: "A German line that has been worn thin", weight: 1,
      intel: "Prisoners say that the German divisions on the high ground have been worn down by ten weeks of fighting and have few reserves to put in.",
      modifiers: { infantry: 1.2, guns: 1.1, secret: 0.85 } },
  ],
  echo: {
    node: "bef_1917_13_calais",
    grade: {
      clean: "The attack at Flers was planned so that the tanks, the infantry, the guns and the secret each had their part, and the staff knows it.",
      costly: "The attack at Flers was carried where its weight was put, with some arms left short to pay for the rest.",
      marginal: "The plan for Flers held together, and the ground was not taken as it should have been.",
      total: "The attack at Flers was made with parts of the plan left bare, and the army has seen what that costs.",
    },
    neglected: {
      tanks: "The tanks were left short, and they did little for the infantry.",
      infantry: "The divisions were left short of what the ground needed.",
      guns: "The guns and the barrage were left short, and the wire was not cut.",
      secret: "The secret was left short, and the Germans learned what the tanks were.",
    },
    commander: {
      haig: "Haig's decision to use the tanks is the one that is spoken of as having started them.",
      rawlinson: "Rawlinson's divisions are the ones that are spoken of as having carried the ground.",
      elles: "Elles's crews are the ones that are spoken of as having learned the machines.",
    },
  },
};

BATTLES.ypresGerman = {
  id: "ypresGerman",
  host: { node: "ohl_1914_13_ypres", choice: "press" },
  winBranch: 1,
  campaign: "ohl",
  title: "Order of Battle: Ypres",
  flavor:
    "Antwerp has fallen and the race to the sea has ended without a result. If the line can be broken at Ypres, the Channel ports lie behind it. The Fourth Army is made largely of reserve corps raised since August, " +
    "whose first assaults near Langemarck lost heavily for little ground. What has to be planned is the last attack of the autumn: where the divisions go, how the guns are used, and what is kept in reserve.",
  conditions:
    "Early November in Flanders: cold mist in the mornings, ground cut by drains and hedges, woods that hide the defenders, and a British line that has been fighting for three weeks and is very thin.",
  categories: [
    {
      id: "divisions", name: "The Fresh Divisions", meter: "manpower",
      units: [
        "The Prussian Guard and the 4th Division, in twelve fresh battalions",
        "The two army groups under Fabeck and Linsingen",
        "The divisions of the Fourth and Sixth Armies that have been in the line since October",
      ],
      real:
        "On 11 November twelve and a half divisions in two army groups attacked along a front of nine miles from Messines to Reutel. The spearhead was the Prussian Guard and the 4th Division, some ten thousand men in twelve fresh battalions, " +
        "against eleven tired British battalions of about four thousand men.",
      context:
        "The divisions are the weight of the blow. Each commitment puts more of them at the point of the attack, and fewer on the rest of the line.",
    },
    {
      id: "guns", name: "The Bombardment", meter: "munitions",
      units: [
        "The heavy guns that shelled the Menin Road and the woods",
        "The field artillery that was to move forward with the infantry",
        "The ammunition columns on the roads behind",
      ],
      real:
        "The attack was preceded by a heavy bombardment and went in under morning mist. The mist let the Germans come out of it and over the British front line, but British artillery then isolated the Guards from their reinforcements.",
      context:
        "The guns open the way. Each commitment puts more of them and their shell into the first hours, and takes them from the days afterwards.",
    },
    {
      id: "reserves", name: "The Second Wave and the Reserves", meter: "manpower",
      units: [
        "The reserve behind the Guard",
        "The divisions held in the second line",
        "The battalions that were to follow up a breakthrough",
      ],
      real:
        "A gap north of the Menin Road was closed by British counter-attacks the same day, and by the afternoon a counter-attack had cleared the Germans from the wood. After that, there was no chance of a breakthrough, " +
        "because the reserves that would have been needed to widen the gap could not be brought up under the British guns.",
      context:
        "A breakthrough has to be followed. Each commitment holds more men back for the moment when the line gives, and takes them from the first blow.",
    },
    {
      id: "spirit", name: "The Men's Spirit", meter: "will",
      units: [
        "The reserve corps that were raised after the war began",
        "The volunteers whose first assaults at Langemarck went in in mass",
        "The officers who have led them and who are fewer every week",
      ],
      real:
        "The reserve corps had gone in in mass at Langemarck and lost heavily for little ground. Their spirit was high and their training was short, and by November many of the officers and non-commissioned officers who could lead them were gone.",
      context:
        "The men's belief is what carries them forward. Each commitment puts more of the army's trust in the young soldiers, and asks more of them.",
    },
  ],
  // The divisions first: the blow was struck by the Guard. The guns second. The reserves third and the men's spirit last. A game judgment, not a measurement.
  effectiveness: { divisions: 2.2, guns: 2.0, reserves: 1.6, spirit: 1.4 },
  commanders: [
    { id: "fabeck", name: "Fabeck", role: "General commanding an army group of the Fourth and Sixth Armies", category: "divisions",
      note: "He has the divisions that were brought up for the blow." },
    { id: "linsingen", name: "Linsingen", role: "General commanding the other army group", category: "reserves",
      note: "He has the divisions that are to follow up if the line gives." },
    { id: "rupprecht", name: "Rupprecht", role: "Crown Prince of Bavaria, commanding the Sixth Army", category: "guns",
      note: "He has the heavy guns, and the final word on the day." },
  ],
  approaches: [
    { id: "point", name: "Put the guns and the Guard on one narrow front, and hold the rest of the line", note: "One blow is made at the Menin Road with everything that can be brought to it.", modifiers: { divisions: 0.4, guns: 0.3, reserves: -0.3 } },
    { id: "wide", name: "Attack all along the line, to stretch the British and find the weak place", note: "The whole front is pressed at once, and the reserves are kept to follow where the line gives.", modifiers: { reserves: 0.5, spirit: 0.1, divisions: -0.4 } },
  ],
  postures: [
    { id: "thin", name: "A British line that is thin and tired", weight: 2,
      intel: "Prisoners and patrols say that the British line is held by a few tired battalions that have been fighting for three weeks, with very little behind them.",
      modifiers: { divisions: 1.2, guns: 1.1, reserves: 0.9 } },
    { id: "backed", name: "A British line with reserves close behind", weight: 1,
      intel: "Aircraft and agents report that French and British reserves have been moved up close behind the line and are ready to counter-attack.",
      modifiers: { reserves: 1.25, divisions: 0.85, guns: 1.1 } },
    { id: "woods", name: "A line hidden in the woods, with its guns well placed", weight: 1,
      intel: "Reports say that the British are holding the woods east of Ypres with rifles and machine guns, and that their artillery has been brought into positions to cover them.",
      modifiers: { guns: 1.2, spirit: 0.85, divisions: 0.95 } },
  ],
  echo: {
    node: "ohl_1915_14_gorlice",
    grade: {
      clean: "The last attack at Ypres was planned so that the divisions, the guns, the reserves and the men's spirit each had their part, and the staff knows it.",
      costly: "The last attack at Ypres was made where its weight was put, with some arms left short to pay for the rest.",
      marginal: "The plan for Ypres held together, and the line did not give as it should have.",
      total: "The last attack at Ypres was made with parts of the plan left bare, and the army has seen what that costs.",
    },
    neglected: {
      divisions: "The divisions were left short of what the blow needed.",
      guns: "The guns were left short, and the defenders were not suppressed.",
      reserves: "The reserves were left short, and the gap could not be widened.",
      spirit: "The men's spirit was left short, and the young soldiers broke.",
    },
    commander: {
      fabeck: "Fabeck's divisions are the ones that are spoken of as having struck the blow.",
      linsingen: "Linsingen's reserves are the ones that are spoken of as having waited.",
      rupprecht: "Rupprecht's guns are the ones that are spoken of as having opened it.",
    },
  },
};
