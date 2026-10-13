// ORDERS OF BATTLE: configs, the planning screen and the after-action report
// =============================================================================
//
// The engagements that open on the Order of Battle screen. The arithmetic is in src/battle.ts. Each config is registered under the id of the
// `keyBattleSubgame` of the choice that hosts it, and that choice has two contested outcomes: `winBranch` is the index of the better one.
// Facts (units, dates, strengths) come from the pages named in claims/battles-round1.md. What is modelled and not documented, the weights
// above all and the enemy's dispositions, is a game judgment and the config says so in `modelled`.
//
//   categories     the arms the pool is placed across: { id, name, meter (the meter a heavy commitment costs), units, real, context }
//   effectiveness  the weight of one counter in each arm, before officer, approach and the enemy's setup
//   commanders     { id, name, role, category (the arm the officer led), note }
//   approaches     { id, name, note, modifiers: { arm: added weight } }
//   postures       the enemy's setup, drawn hidden: { id, name, intel, modifiers: { arm: multiplier }, weight }
//   echo           what the next report says (node, grade[clean|costly|marginal|total], neglected[arm], commander[id])
// =============================================================================

const BATTLES = {};

BATTLES.juneOffensive = {
  id: "juneOffensive",
  host: { node: "juneOffensive17", choice: 0 },
  winBranch: 0,
  campaign: "provisionalGov17",
  cleanMeter: "frontDiscipline",
  title: "Order of Battle: the June Offensive",
  flavor:
    "The Southwestern Front is to attack toward Lemberg. The barrage began on 16 June. There are shock battalions raised this spring from volunteers, regiments with elected committees, and an Eighth Army under General Kornilov on the southern wing.",
  conditions:
    "The attack goes in on 18 June. Three armies of the Southwestern Front take part: the Seventh, the Eleventh and the Eighth. The staff do not know which divisions the Central Powers have behind their line.",
  modelled:
    "The sources give the armies, the dates and the results. They do not give the enemy's dispositions or the weight of fire. The enemy's setup and every weight in this battle are game judgments.",
  record:
    "The Eighth Army advanced 15 to 20 miles, the most of any army in the offensive. The Eleventh advanced about two miles on average, and the Seventh much less. By 3 and 4 July the offensive had collapsed. On 19 July the Central Powers broke through the Southwestern Front near Zboriv, and Tarnopol fell on 25 July.",
  categories: [
    {
      id: "shock", name: "The shock battalions", meter: "frontDiscipline",
      units: ["Volunteer shock battalions raised by the Provisional Government in the spring of 1917"],
      real: "The shock battalions led the first breakthrough. There were too few of them to hold the ground against a counterattack, and the regular infantry were less reliable.",
      context: "The shock battalions are the arm most likely to break through on the first day. Each counter puts more volunteers in the first wave and leaves the line with fewer of its best men.",
    },
    {
      id: "line", name: "The committee regiments", meter: "sovietRelations",
      units: ["Regiments of the Seventh and Eleventh Armies, each with an elected soldiers' committee"],
      real: "The Eleventh Army's attack advanced about two miles on average, and the Seventh Army's much less. Soldiers soon refused to leave their trenches, and by 3 and 4 July the offensive had collapsed.",
      context: "The line regiments are most of the army. Each counter asks more of men whose committees have a say in whether they go forward.",
    },
    {
      id: "eighth", name: "The Eighth Army", meter: "authority",
      units: ["The Eighth Army under General Kornilov, the southern wing of the attack"],
      real: "The Eighth Army was the most successful army of the offensive. It advanced 15 to 20 miles, and sources record that Galich and Kalush were taken.",
      context: "The southern wing is where an advance is most likely to be made. Each counter puts more weight behind Kornilov's army and makes his standing with the government larger.",
    },
    {
      id: "guns", name: "The artillery", meter: "authority",
      units: ["The artillery of the three armies"],
      real: "The preliminary barrage began on 16 June (Old Style). The sources do not give the number of guns or how long it lasted.",
      context: "The guns open the way for every other arm and decide none of them. Each counter puts more batteries and shells forward.",
    },
  ],
  // The Eighth Army and the shock battalions made the offensive's gains in the record; the guns and the line followed. A game judgment.
  effectiveness: { eighth: 2.3, shock: 2.1, guns: 1.4, line: 1.2 },
  commanders: [
    { id: "kornilov", name: "Kornilov", role: "Commander of the Eighth Army", category: "eighth", note: "He commands the army on the southern wing." },
    { id: "erdeli", name: "Erdeli", role: "Commander of the Eleventh Army", category: "line", note: "He commands one of the two armies of the main attack." },
  ],
  approaches: [
    { id: "south", name: "Back the southern thrust", note: "Everything goes behind the army that is most likely to advance. The others hold.", modifiers: { eighth: 0.4, shock: 0.2, line: -0.3 } },
    { id: "front", name: "Attack along the whole front", note: "Every army attacks at once, with no single point of main effort.", modifiers: { line: 0.4, guns: 0.3, eighth: -0.3, shock: -0.2 } },
  ],
  postures: [
    { id: "thin", name: "A thinly held Austrian line", weight: 2,
      intel: "Prisoners say the Austrian regiments in front are under strength and short of food.",
      modifiers: { eighth: 1.2, shock: 1.1, line: 1.1 } },
    { id: "german", name: "German divisions behind the line", weight: 1,
      intel: "Aeroplanes and deserters report German divisions arriving behind the Austrian front.",
      modifiers: { shock: 0.9, line: 0.75, guns: 1.1, eighth: 0.9 } },
  ],
  echo: {
    node: "julyDays17",
    grade: {
      clean: "The offensive was fought with each part of the front given its work.",
      costly: "The offensive was fought with some parts of the front short to pay for the rest.",
      marginal: "The plan held together and the offensive still failed. Nobody at the Ministry can say what was left undone.",
      total: "The offensive was fought with parts of the front left bare, and the army has seen what that costs.",
    },
    neglected: {
      shock: "The shock battalions were left short.",
      line: "The line regiments were left short.",
      eighth: "The Eighth Army was left short.",
      guns: "The guns were left short.",
    },
    commander: {
      kornilov: "Kornilov's army is the one the newspapers write about.",
      erdeli: "Erdeli's army had its part in the plan.",
    },
  },
};

BATTLES.ekaterinodar = {
  id: "ekaterinodar",
  host: { node: "ekaterinodarAssault18", choice: 0 },
  winBranch: 0,
  campaign: "southRussia",
  cleanMeter: "manpower",
  title: "Order of Battle: Ekaterinodar",
  flavor:
    "The Volunteer Army has reached Ekaterinodar, the capital of the Kuban and of the North Caucasian Soviet Republic, after seven weeks on the steppe. It has about six thousand men, some two thousand of them Don Cossacks, and fourteen guns. Two days of assault have gained a foothold on the outskirts.",
  conditions:
    "The attack began on 10 April. The defenders are more than twice the Volunteers' number, and they have armoured trains on the railway.",
  modelled:
    "The sources give the Volunteers' strength, the size of the defence and the course of the five days. They do not say where the defenders stood. The enemy's setup and every weight in this battle are game judgments.",
  record:
    "The attack began on 10 April. Kornilov was killed on 13 April when a shell hit the farmhouse where he had set up his headquarters. Denikin took command, abandoned the assault after five days of fighting and withdrew north. The forced march began on the evening of 13 April.",
  categories: [
    {
      id: "infantry", name: "The infantry brigades", meter: "manpower",
      units: ["The 1st Infantry Brigade under General Markov", "The 2nd Infantry Brigade under General Bogaevsky"],
      real: "The infantry did the fighting for five days against defenders more than twice their number. The army's losses in the battle were heavy, and the sources give widely different figures for them.",
      context: "The brigades are the army. Each counter puts more of them into the fight for the city and leaves fewer to cover a withdrawal.",
    },
    {
      id: "mounted", name: "The mounted brigade", meter: "manpower",
      units: ["The mounted brigade, under General Erdeli in one account"],
      real: "The sources name the mounted brigade and do not describe its part in the assault.",
      context: "The horsemen can strike at a weak point or cover a flank. Each counter takes riders from the road out.",
    },
    {
      id: "guns", name: "The guns", meter: "materiel",
      units: ["The army's artillery, 14 pieces"],
      real: "The army had 14 artillery pieces. The sources do not give its stock of shells.",
      context: "Fourteen guns cannot batter a city. Each counter spends shells that cannot be replaced.",
    },
  ],
  // The infantry carried the attack; the guns were too few to decide it; the mounted arm had no recorded part. A game judgment.
  effectiveness: { infantry: 1.9, guns: 1.7, mounted: 1.5 },
  commanders: [
    { id: "markov", name: "Markov", role: "Commander of the 1st Infantry Brigade", category: "infantry", note: "His brigade is built on the officers' regiments." },
    { id: "bogaevsky", name: "Bogaevsky", role: "Commander of the 2nd Infantry Brigade", category: "infantry", note: "He brought the Don Cossacks into the army." },
    { id: "erdeli", name: "Erdeli", role: "Commander of the mounted brigade", category: "mounted", note: "The army's cavalry is under his hand." },
  ],
  approaches: [
    { id: "storm", name: "Storm the city at once", note: "Everything goes into the infantry. The guns support and the horse watch the flanks.", modifiers: { infantry: 0.3, guns: 0.2, mounted: -0.3 } },
    { id: "batter", name: "Batter the defences first", note: "The guns fire before the infantry go in, and the assault waits for them.", modifiers: { guns: 0.5, infantry: -0.2, mounted: -0.1 } },
  ],
  postures: [
    { id: "dug", name: "The garrison dug in on the outskirts", weight: 2,
      intel: "Scouts report the garrison dug in along the edge of the city, with armoured trains on the railway.",
      modifiers: { infantry: 0.8, guns: 1.15, mounted: 0.85 } },
    { id: "sortie", name: "A Red sortie against the flank", weight: 1,
      intel: "Scouts report Red columns forming near the station for a sortie.",
      modifiers: { infantry: 1.05, mounted: 1.25, guns: 0.9 } },
    { id: "thin", name: "A weak side of the city", weight: 1,
      intel: "Scouts report that the garrison on the western edge is weaker than on the rest.",
      modifiers: { infantry: 1.1, mounted: 1.2, guns: 1.0 } },
  ],
  echo: {
    node: "afterEkaterinodar18",
    grade: {
      clean: "The assault was planned with every arm given its work, and the staff knows what that is worth.",
      costly: "The assault was won in its day with some arms short, and the army remembers which.",
      marginal: "The plan held together and the city did not fall. No one at headquarters can say what was left undone.",
      total: "The assault was fought with arms left bare, and the army has seen what that costs.",
    },
    neglected: {
      infantry: "The infantry were left short.",
      mounted: "The mounted brigade was left short.",
      guns: "The guns were left short of shells.",
    },
    commander: {
      markov: "Markov's brigade carried the assault.",
      bogaevsky: "Bogaevsky's brigade carried the assault.",
      erdeli: "Erdeli's horsemen were given their part.",
    },
  },
};

BATTLES.peregonovka = {
  id: "peregonovka",
  host: { node: "peregonovka19", choice: 1 },
  winBranch: 0,
  campaign: "southRussia",
  cleanMeter: "manpower",
  title: "Order of Battle: Peregonovka",
  flavor:
    "The White corps, twelve to fifteen thousand men, have been fighting the Insurgent Army of Makhno since 22 September. The insurgents, six to eight thousand strong, are in hills and ravines between the Syniukha and the Iatran, with dense forest along both rivers. The only crossings are at Novoarkhanhelsk and Ternivka.",
  conditions:
    "Late September. The usual date for the main battle is 26 September, and other accounts give the 25th and the 27th. The fighting began at three in the morning.",
  modelled:
    "The sources give the forces, the ground and the course of the day. They do not say how the White commanders divided their men. The arms, the enemy's setups and every weight in this battle are game judgments.",
  record:
    "An insurgent brigade staged a feint at Krutenkoe that drew the Whites west while the main army moved back east. Explosives signalled the attack, and Makhno led his sotnia in a flanking charge with sabres that broke the Whites. Accounts give about 10,000 White dead and up to 5,000 prisoners. The insurgents captured 23 field guns and 100 machine guns. The White advance on Moscow was halted about 200 kilometres from the city.",
  categories: [
    {
      id: "right", name: "The right flank", meter: "manpower",
      units: ["The White right flank, along the Iatran"],
      real: "Makhno regrouped on the right bank of the Iatran, opposite the weakened White right flank.",
      context: "The right flank is the side nearest the river crossings. Each counter makes it harder to turn.",
    },
    {
      id: "centre", name: "The centre on the heights", meter: "manpower",
      units: ["The main White body, facing the heights east of Krutenkoe and Rogovo"],
      real: "A feint at Krutenkoe drew the Whites west while the insurgent main army moved back east.",
      context: "The centre faces the ground the insurgents hold. Each counter makes it harder to draw away.",
    },
    {
      id: "officers", name: "The officer regiments", meter: "manpower",
      units: ["The Simferopol Officer Regiment", "The units under Sklyarov, advancing toward Uman"],
      real: "Sklyarov's units, advancing toward Uman, were separated from the Simferopol Officer Regiment. A unit under Almendinger was reduced to about 100 men from six companies.",
      context: "The officers are the corps' best infantry and its reserve. Each counter keeps more of them in hand.",
    },
    {
      id: "guns", name: "The guns and machine guns", meter: "materiel",
      units: ["The corps' field guns and machine guns"],
      real: "The insurgents captured 23 field guns and 100 machine guns.",
      context: "The guns and the machine guns hold the ravines. Each counter puts more of them where the ground is narrow.",
    },
  ],
  // The sources describe a flank attack and a feint; the White arms are weighted by how much each could do about that. A game judgment.
  effectiveness: { right: 1.8, centre: 1.9, officers: 2.0, guns: 1.5 },
  commanders: [
    { id: "slashchov", name: "Slashchov", role: "White commander at Peregonovka", category: "centre", note: "He had earlier relieved a trapped White division at Novoukrainka." },
    { id: "shilling", name: "Shilling", role: "White commander at Peregonovka", category: "right", note: "He shares the command with Slashchov." },
  ],
  approaches: [
    { id: "close", name: "Draw in and close up", note: "The line shortens and the flanks come in toward the centre.", modifiers: { right: 0.4, centre: 0.3, officers: -0.2, guns: -0.2 } },
    { id: "reserve", name: "Hold a strong reserve", note: "The officer regiments are kept back and the line is held thin.", modifiers: { officers: 0.5, guns: 0.2, right: -0.3, centre: -0.2 } },
  ],
  postures: [
    { id: "feint", name: "A feint in the west and the blow on the right flank", weight: 2,
      intel: "Scouts report insurgent columns massing on the far bank of the Iatran, opposite the right flank.",
      modifiers: { right: 0.7, centre: 1.1, officers: 1.0, guns: 1.0 } },
    { id: "stand", name: "A stand on the high ground", weight: 1,
      intel: "Scouts report the insurgents dug in on the heights east of Krutenkoe and Rogovo.",
      modifiers: { centre: 0.8, right: 1.1, guns: 1.2, officers: 1.0 } },
    { id: "slip", name: "The insurgents slip away to the east", weight: 1,
      intel: "Scouts report insurgent wagons and guns moving off toward the east.",
      modifiers: { right: 1.1, centre: 1.1, officers: 1.2, guns: 0.8 } },
  ],
  echo: {
    node: "makhnosAftermath19",
    grade: {
      clean: "The line at Peregonovka was drawn back with each arm given its work.",
      costly: "The line at Peregonovka was drawn back with some arms short to pay for the rest.",
      marginal: "The plan at Peregonovka held together and the battle did not go the way it should have.",
      total: "The line at Peregonovka was drawn back with arms left bare, and the corps has seen what that costs.",
    },
    neglected: {
      right: "The right flank was left short.",
      centre: "The centre was left short.",
      officers: "The officer regiments were left short.",
      guns: "The guns were left short.",
    },
    commander: {
      slashchov: "Slashchov's part in the plan is remembered in the corps.",
      shilling: "Shilling's part in the plan is remembered in the corps.",
    },
  },
};

BATTLES.orel = {
  id: "orel",
  host: { node: "orelCulmination19", choice: 1 },
  winBranch: 0,
  campaign: "southRussia",
  cleanMeter: "manpower",
  title: "Order of Battle: Orel",
  flavor:
    "The Volunteer Army's drive on Moscow is stopping at Orel. The Red Southern Front has been attacking since 11 October with, by one count, 52,000 infantry, 7,000 cavalry and 278 guns, against about 19,000 White infantry and 5,000 cavalry. Kutepov's I Corps has to get its brigades back to the Kursk and Kharkov line without losing them.",
  conditions:
    "October 1919. The regiment strengths below are from a snapshot of 18 October, and they were falling fast.",
  modelled:
    "The sources give the regiments, their strengths and the Red order of battle. They do not say how a withdrawal was divided between them. The arms, the enemy's setups and every weight in this battle are game judgments.",
  record:
    "The Red Southern Front won the battle. The Latvian Rifle Division led the Red shock group, which was moved from the 13th Army to the 14th during the operation as the 13th began to disintegrate. With Budyonny's breakthrough near Voronezh, the operation ended the Armed Forces of South Russia's drive on Moscow.",
  categories: [
    {
      id: "kornilov", name: "The Kornilov Brigade", meter: "manpower",
      units: ["1st Kornilov Shock Regiment, 945 bayonets", "2nd Kornilov Shock Regiment, 1,150 bayonets", "3rd Kornilov Shock Regiment, 1,279 bayonets"],
      real: "The brigade began the campaign with over 6,000 bayonets. By the 18 October snapshot it had about 3,400 in its three regiments.",
      context: "The Kornilov regiments are shock troops. Each counter makes them the rear guard of the whole corps.",
    },
    {
      id: "markov", name: "The Markov Brigade", meter: "manpower",
      units: ["1st Markov Officer Regiment, 882 bayonets", "2nd Markov Officer Regiment, 1,174 bayonets", "3rd Markov Officer Regiment, newly formed, 618 bayonets"],
      real: "The brigade had about 2,700 bayonets in three regiments at the 18 October snapshot, the third of them newly formed.",
      context: "The Markov regiments are the corps' other officer brigade. Each counter leaves it covering more of the road.",
    },
    {
      id: "drozdov", name: "The Drozdovsky regiments and the Samursky", meter: "manpower",
      units: ["1st Drozdovsky Regiment, 1,352 bayonets", "2nd Drozdovsky Regiment, 1,309 bayonets", "3rd Drozdovsky Regiment, forming, 1,130 bayonets", "83rd Samursky Regiment, 1,304 bayonets"],
      real: "The 3rd Division had about 5,100 bayonets in four regiments at the 18 October snapshot, the third Drozdovsky regiment still forming.",
      context: "The 3rd Division is the largest body in the corps. Each counter gives it more of the withdrawal to carry.",
    },
    {
      id: "guns", name: "The guns and armoured trains", meter: "materiel",
      units: ["1st Artillery Brigade, 14 light guns and 11 howitzers", "3rd Artillery Brigade, 20 light guns and 6 howitzers", "The 2nd and 9th Armoured Train Divisions"],
      real: "The corps also had five tanks and heavy guns, which the order of battle's author judges played little part.",
      context: "The guns and the trains hold the rail line. Each counter ties the withdrawal more closely to the railway.",
    },
  ],
  // The Kornilov and Drozdovsky regiments were the corps' strongest; the Markov Brigade was smaller; the guns could not hold ground. A game judgment.
  effectiveness: { kornilov: 2.0, drozdov: 2.0, markov: 1.6, guns: 1.3 },
  commanders: [
    { id: "skoblin", name: "Skoblin", role: "Colonel, Kornilov Brigade", category: "kornilov", note: "His brigade began the campaign with over 6,000 bayonets." },
    { id: "tretyakov", name: "Tretyakov", role: "Major-General, Markov Brigade", category: "markov", note: "He commands the three Markov regiments." },
    { id: "turkul", name: "Turkul", role: "Colonel, 2nd Drozdovsky Regiment", category: "drozdov", note: "His regiment is one of the three in the 3rd Division's Drozdovsky group." },
  ],
  approaches: [
    { id: "echelons", name: "Withdraw by echelons", note: "One brigade covers another as each falls back, and the guns go early.", modifiers: { kornilov: 0.3, markov: 0.3, drozdov: 0.3, guns: -0.3 } },
    { id: "rail", name: "Hold the rail line and withdraw by train", note: "The guns and armoured trains hold the line while the infantry entrain.", modifiers: { guns: 0.5, drozdov: -0.2, kornilov: -0.2 } },
  ],
  postures: [
    { id: "latvians", name: "The Latvian division presses the centre", weight: 2,
      intel: "Prisoners say the Latvian Rifle Division leads the Red attack.",
      modifiers: { kornilov: 0.9, markov: 0.9, drozdov: 0.85, guns: 1.1 } },
    { id: "slow", name: "A slow and careful Red advance", weight: 1,
      intel: "Reports say the Red columns are advancing slowly and in order.",
      modifiers: { kornilov: 1.15, markov: 1.15, drozdov: 1.15, guns: 1.0 } },
    { id: "cavalry", name: "A cavalry thrust round the flank", weight: 1,
      intel: "Aeroplanes report Red cavalry moving round the eastern flank.",
      modifiers: { kornilov: 0.9, markov: 0.9, drozdov: 1.0, guns: 0.8 } },
  ],
  echo: {
    node: "kharkovLine19",
    grade: {
      clean: "The withdrawal from Orel was fought with every brigade given its work.",
      costly: "The withdrawal from Orel was carried out with some brigades short to pay for the rest.",
      marginal: "The plan for Orel held together and the withdrawal still frayed. No one can say what was left undone.",
      total: "The withdrawal from Orel was carried out with brigades left bare, and the corps has seen what that costs.",
    },
    neglected: {
      kornilov: "The Kornilov Brigade was left short.",
      markov: "The Markov Brigade was left short.",
      drozdov: "The 3rd Division was left short.",
      guns: "The guns and trains were left short.",
    },
    commander: {
      skoblin: "Skoblin's brigade is remembered as the rear guard.",
      tretyakov: "Tretyakov's brigade is remembered as the one that held.",
      turkul: "Turkul's regiment is remembered at Orel.",
    },
  },
};

/** The battle a choice hosts, or null. */
function battleOf(choice) {
  const id = choice && choice.keyBattleSubgame && choice.keyBattleSubgame.id;
  return (id && BATTLES[id]) || null;
}

/** The label of a campaign meter, for the report. */
function meterWord(campaignId, key) {
  const a = (CAMPAIGNS[campaignId].triangleAxes.find((x) => x.key === key) || {}).label;
  return (a || key).toLowerCase();
}

const GRADE_WORDS = {
  clean: "A clean battle: every arm had its part, and the plan was won.",
  costly: "A costly victory: the plan was won, but an arm was left short or a heavy commitment was paid for.",
  marginal: "A plan that held, and a battle that did not go its way.",
  total: "A plan that gave out: two or more arms were left short, and the battle was lost.",
};

/** The planning screen: who leads, how it is fought, where the counters go. */
function BattleScreen({ campaignId, config, choice, meters, easyMode, onCommit, onBack }) {
  const c = CAMPAIGNS[campaignId];
  const skin = skinFor(campaignId);
  const pool = React.useMemo(() => battlePoolSize(meters), []);
  const [posture] = useState(() => pickBattlePosture(config));
  const [intel] = useState(() => battleIntel(config, posture));
  const empty = React.useMemo(() => Object.fromEntries(config.categories.map((k) => [k.id, 0])), [config]);
  const [allocation, setAllocation] = useState(empty);
  const [commanderId, setCommanderId] = useState(null);
  const [approachId, setApproachId] = useState(null);
  const hasCommanders = (config.commanders || []).length > 0;
  const needsApproach = (config.approaches || []).length > 0;
  const steps = React.useMemo(() => [hasCommanders && "officer", needsApproach && "approach", "counters"].filter(Boolean), [hasCommanders, needsApproach]);
  const [si, setSi] = useState(0);
  const step = steps[si];
  const placed = config.categories.reduce((s, k) => s + (allocation[k.id] || 0), 0);
  const left = pool - placed;
  const ready = left === 0 && (!needsApproach || !!approachId);
  const commander = (config.commanders || []).find((x) => x.id === commanderId) || null;
  const approach = (config.approaches || []).find((x) => x.id === approachId) || null;
  const bump = (id, d) =>
    setAllocation((a) => {
      const n = (a[id] || 0) + d;
      if (n < 0 || (d > 0 && left <= 0)) return a;
      return { ...a, [id]: n };
    });
  const byStaff = () => {
    const s = staffPlanFor(config, pool);
    setAllocation({ ...empty, ...s.allocation });
    setApproachId(s.approachId);
    setCommanderId(null);
    setSi(steps.length - 1);
  };
  const plan = { allocation, commanderId, approachId, postureId: posture ? posture.id : null, pool };
  const shown = intel.shown || null;
  const staffOdds = React.useMemo(() => battlePlanOdds(choice.uncertain, config, null, shown, pool), [choice, config, shown, pool]);
  const myOdds = React.useMemo(() => (ready ? battlePlanOdds(choice.uncertain, config, plan, shown, pool) : null), [choice, config, shown, pool, ready, allocation, commanderId, approachId]);
  const weights = easyMode ? Object.fromEntries(config.categories.map((k) => [k.id, battleArmWeight(config, k.id, commander, approach, null)])) : null;
  const summary = {
    officer: commander ? commander.name : "No particular emphasis",
    approach: approach ? approach.name : "Not chosen yet",
    counters: `${placed} of ${pool} placed`,
  };
  const heading = { officer: "Name an officer", approach: "Choose the approach", counters: "Place the counters" };
  const last = si === steps.length - 1;
  const mono = { ...monoFontStyle(skin) };
  const muted = { ...monoFontStyle(skin), ...mutedTextStyle(skin) };
  const pick = (on) => ({ borderColor: on ? skin.accent : (skin.dark ? skin.paperDim : skin.ink), borderWidth: on ? 3 : 2, borderStyle: "solid" });
  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" screenTitle={config.title} onClose={onBack} />
      <div className="p-6">
        <div className="text-xs font-bold tracking-widest" style={{ ...mono, ...accentTextStyle(skin) }}>ORDER OF BATTLE</div>
        <div className="text-2xl font-bold mt-1" style={displayFontStyle(skin)} role="heading" aria-level={2}>{config.title}</div>
        <div className="text-sm mt-3 leading-relaxed">{config.flavor}</div>
        <details className="mt-3">
          <summary className="text-xs font-bold cursor-pointer" style={{ ...mono, ...accentTextStyle(skin) }}>CONDITIONS ON THE DAY</summary>
          <div className="text-xs mt-2 leading-relaxed" style={muted}>{config.conditions}</div>
        </details>

        <div className="border-2 mt-4 p-3 text-xs" style={{ borderColor: skin.accent, ...mono }}>
          <div className="font-bold" style={accentTextStyle(skin)}>INTELLIGENCE SUMMARY</div>
          <div className="mt-1 leading-relaxed">{intel.shown ? intel.shown.intel : "Nothing is known of the enemy's setup."}</div>
          <div className="mt-1" style={mutedTextStyle(skin)}>The staff's reading is right about three times in four.</div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={byStaff} className="flex-1 border-2 py-2 text-xs font-bold" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...mono }}>
            LET THE STAFF PLAN IT
          </button>
          <button
            onClick={() => { setAllocation(empty); setCommanderId(null); setApproachId(null); setSi(0); }}
            className="flex-1 border-2 py-2 text-xs font-bold"
            style={{ borderColor: skin.dark ? skin.paperDim : skin.ink, ...mono }}
          >
            CLEAR THE PLAN
          </button>
        </div>

        <ol className="mt-4" aria-label="The steps of the plan" style={{ listStyle: "none", padding: 0 }}>
          {steps.map((s, i) => (
            <li key={s} className="mb-2">
              <button
                onClick={() => setSi(i)}
                aria-current={i === si ? "step" : undefined}
                className="w-full text-left p-2 text-xs"
                style={{ ...pick(i === si), ...mono }}
              >
                <b>{i + 1}. {heading[s]}</b>
                <div style={mutedTextStyle(skin)}>{summary[s]}</div>
              </button>
            </li>
          ))}
        </ol>

        <section aria-label={heading[step]} className="mt-4">
          <div className="text-lg font-bold" style={displayFontStyle(skin)} role="heading" aria-level={3}>{heading[step]}</div>
          {step === "officer" && (
            <>
              <div className="text-xs mt-1" style={muted}>A named officer adds weight to the arm he led. You may name none.</div>
              <div role="group" aria-label="Officer" className="mt-2">
                <button onClick={() => setCommanderId(null)} aria-pressed={commanderId === null} className="w-full text-left p-3 mb-2 text-sm" style={pick(commanderId === null)}>
                  <b>No particular emphasis</b>
                </button>
                {config.commanders.map((m) => (
                  <button key={m.id} onClick={() => setCommanderId(m.id)} aria-pressed={commanderId === m.id} className="w-full text-left p-3 mb-2 text-sm" style={pick(commanderId === m.id)}>
                    <b>{m.name}, {m.role}</b>
                    <div className="text-xs mt-1" style={muted}>{m.note}</div>
                  </button>
                ))}
              </div>
            </>
          )}
          {step === "approach" && (
            <div role="group" aria-label="Approach" className="mt-2">
              {config.approaches.map((a) => (
                <button key={a.id} onClick={() => setApproachId(a.id)} aria-pressed={approachId === a.id} className="w-full text-left p-3 mb-2 text-sm" style={pick(approachId === a.id)}>
                  <b>{a.name}</b>
                  <div className="text-xs mt-1" style={muted}>{a.note}</div>
                </button>
              ))}
            </div>
          )}
          {step === "counters" && (
            <>
              <div className="text-xs mt-1" style={muted} role="status" aria-live="polite">
                {left > 0 ? `${left} of ${pool} counters left to place.` : `All ${pool} counters are placed.`} An arm left with less than its fair share costs the plan.
              </div>
              {config.categories.map((k) => (
                <div key={k.id} className="border-2 mt-3 p-3" style={{ borderColor: skin.dark ? skin.paperDim : skin.ink }}>
                  <div className="flex items-center justify-between">
                    <b className="text-sm">{k.name}</b>
                    <span className="flex items-center gap-2" style={mono}>
                      <button className="border-2 px-3 py-1 font-bold" aria-label={`Fewer in ${k.name}`} disabled={!allocation[k.id]} onClick={() => bump(k.id, -1)} style={{ ...accentBorderStyle(skin), opacity: allocation[k.id] ? 1 : 0.4 }}>−</button>
                      <span className="w-6 text-center font-bold" aria-label={`${k.name}: ${allocation[k.id] || 0} counters`}>{allocation[k.id] || 0}</span>
                      <button className="border-2 px-3 py-1 font-bold" aria-label={`More in ${k.name}`} disabled={left <= 0} onClick={() => bump(k.id, 1)} style={{ ...accentBorderStyle(skin), opacity: left > 0 ? 1 : 0.4 }}>+</button>
                    </span>
                  </div>
                  <div className="text-xs mt-2 leading-relaxed" style={muted}>{k.context}</div>
                  {easyMode && <div className="text-xs mt-1" style={{ ...mono, ...accentTextStyle(skin) }}>EASY: each counter here carries {weights[k.id].toFixed(1)} before the enemy's setup.</div>}
                  <details className="mt-2">
                    <summary className="text-xs font-bold cursor-pointer" style={{ ...mono, ...accentTextStyle(skin) }}>THE FORMATIONS</summary>
                    <ul className="text-xs mt-1 leading-relaxed" style={{ ...muted, paddingLeft: 16, listStyle: "disc" }}>{k.units.map((u) => <li key={u}>{u}</li>)}</ul>
                  </details>
                </div>
              ))}
            </>
          )}
        </section>

        <div className="border-2 mt-5 p-3 text-xs" style={{ borderColor: skin.accent, ...mono }} role="group" aria-label="Your plan">
          <div className="flex justify-between">
            <span style={mutedTextStyle(skin)}>COUNTERS</span>
            <b aria-live="polite">{left} left</b>
          </div>
          <div className="flex justify-between mt-1">
            <span style={mutedTextStyle(skin)}>THE ODDS</span>
            <b>{myOdds ? myOdds.word : "Plan not complete"}</b>
          </div>
          <div className="mt-1" style={mutedTextStyle(skin)}>The staff's plan: {staffOdds.word}</div>
        </div>
        {last ? (
          <button
            disabled={!ready}
            onClick={() => onCommit({ ...plan, intelRight: intel.right })}
            className="mt-3 w-full font-bold py-3"
            style={{ ...accentBgStyle(skin), ...displayFontStyle(skin), opacity: ready ? 1 : 0.5 }}
          >
            ISSUE THE PLAN
          </button>
        ) : (
          <button onClick={() => setSi((i) => Math.min(steps.length - 1, i + 1))} className="mt-3 w-full border-2 font-bold py-3" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...mono }}>
            NEXT: {heading[steps[si + 1]].toUpperCase()}
          </button>
        )}
        {!ready && last && (
          <div className="text-xs mt-2" style={muted}>{left > 0 ? `Place the remaining ${left} counters.` : "Choose the approach."}</div>
        )}
        <button onClick={onBack} className="mt-3 w-full border-2 font-bold py-3 text-sm" style={{ borderColor: skin.dark ? skin.paperDim : skin.ink, ...mono }}>
          BACK TO THE ORDER
        </button>
      </div>
    </div>
  );
}

/** The after-action report shown with the outcome of a battle. */
function BattleReport({ campaignId, battle, skin }) {
  const config = BATTLES[battle.id];
  if (!config) return null;
  const posture = (config.postures || []).find((p) => p.id === battle.posture);
  const plan = battle.plan;
  const placed = plan ? config.categories.filter((k) => plan.allocation[k.id]).map((k) => `${k.name} ${plan.allocation[k.id]}`).join(", ") : null;
  const commander = plan && (config.commanders || []).find((m) => m.id === plan.commanderId);
  const approach = plan && (config.approaches || []).find((a) => a.id === plan.approachId);
  const moved =
    battle.bonus === 0
      ? "The plan did as the staff's would have: the odds were the record's."
      : battle.bonus > 0
      ? `The plan moved the odds ${battle.bonus} points toward the better outcome.`
      : `The plan moved the odds ${-battle.bonus} points away from the better outcome.`;
  const muted = { ...monoFontStyle(skin), ...mutedTextStyle(skin) };
  return (
    <section className="border-2 mt-5 p-3 text-xs leading-relaxed" style={{ borderColor: skin.accent, ...monoFontStyle(skin) }} aria-label="After-action report">
      <div className="font-bold tracking-widest" style={accentTextStyle(skin)} role="heading" aria-level={2}>AFTER-ACTION REPORT</div>
      {posture && <div className="mt-2">The enemy's setup was this: {posture.name}.{battle.intelRight === false ? " The staff's intelligence summary had described another setup." : " The staff's intelligence summary was right."}</div>}
      {plan && <div className="mt-2" style={mutedTextStyle(skin)}>The plan: {placed}{approach ? `; ${approach.name.toLowerCase()}` : ""}{commander ? `; ${commander.name} named` : ""}.</div>}
      <div className="mt-2">{moved}</div>
      <div className="mt-2">{GRADE_WORDS[battle.grade]}</div>
      {battle.lines.length > 0 && (
        <ul className="mt-2" style={{ paddingLeft: 16, listStyle: "disc" }}>
          {battle.lines.map((l, i) => (
            <li key={i}>{l.reason}: {l.delta > 0 ? "+" : "−"}1 {meterWord(campaignId, l.meter)}</li>
          ))}
        </ul>
      )}
      <details className="mt-2">
        <summary className="font-bold cursor-pointer" style={accentTextStyle(skin)}>WHAT HAPPENED ON THE DAY</summary>
        {config.record && <p className="mt-2">{config.record}</p>}
        {config.categories.map((k) => (
          <p key={k.id} className="mt-2" style={mutedTextStyle(skin)}><b>{k.name}.</b> {k.real}</p>
        ))}
        <p className="mt-2 italic" style={mutedTextStyle(skin)}>{config.modelled}</p>
      </details>
    </section>
  );
}
