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
