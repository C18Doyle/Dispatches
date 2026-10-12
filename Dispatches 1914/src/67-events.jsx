// =============================================================================
// SPECIAL EVENTS
// =============================================================================
//
// A special event is a piece of context that the state of the file brings to a headquarters between two reports: a hunger winter, a strike, an
// emperor's death, a lorry road that is the whole of a supply line. It is not a decision and it changes no meter; it is shown once, on its own
// screen, before the first report whose date falls in its window, if the file's state (a meter, a flag) calls for it. Many files never see some
// of them, and every file sees the ones its own course earned.
//
// The windows are in each command's own calendar, as the reports' dates are (the Russian command's are Old Style). `anchor` is a report inside
// the window: its claims register carries the event's claims (claims/<command>.json) and check-events.js proves the anchor falls in the window.
// Nothing here is spoken by a person in quotation marks; the events are narrated.
// =============================================================================

export const EVENTS = [
  {
    id: "ohl_turnip", campaign: "ohl", kind: "The home front", anchor: "ohl_1917_06_pless",
    from: "1917-01-01", to: "1917-04-30", date: "1917-01-15",
    title: "The Turnip Winter",
    when: (f, m) => m.will <= -2,
    paras: [
      "The potato harvest of 1916 failed, and the cities are fed on swedes. Bread, meat, fat and coal are rationed, and the ration is smaller each month. The staff's own reports from the home districts count the hungry by the street.",
      "The army is fed before the cities are, and every man who writes home knows it. The winter will be remembered as the worst of the war for the people behind the lines.",
    ],
  },
  {
    id: "ohl_strikes", campaign: "ohl", kind: "The home front", anchor: "ohl_1917_07_chancellor",
    from: "1917-04-01", to: "1917-07-31", date: "1917-04-16",
    title: "The April Strikes",
    when: (f, m) => m.will <= -3,
    paras: [
      "After the bread ration is cut again, workers stop work in Berlin and Leipzig. Hundreds of thousands of them come out in the munitions factories, and they ask for bread, for an end to the state of siege, and for the government to say what it wants from the war.",
      "The strikes end in a few days, with some promises, and the strike leaders are called up for service. The generals notice that the workers' demands have begun to sound like the demands of the Reichstag.",
    ],
  },
  {
    id: "ohl_influenza", campaign: "ohl", kind: "The army", anchor: "ohl_1918_10_salient",
    from: "1918-06-01", to: "1918-09-30", date: "1918-06-20",
    title: "The Sickness in the Ranks",
    when: (f, m) => m.manpower <= -2,
    paras: [
      "An influenza, the first wave of a pandemic that no one yet understands, reaches the German army in the summer. The sick lists of the divisions in the line lengthen by the week, and the army's doctors can offer rest and little else.",
      "The staff's reports note it among the reasons that the divisions are not what they were. It is one more thing that cannot be ordered away.",
    ],
  },
  {
    id: "gqg_casualties", campaign: "gqg", kind: "The army", anchor: "gqg_1914_12_retreat",
    from: "1914-08-20", to: "1914-08-31", date: "1914-08-23",
    title: "The Casualty Lists of 22 August",
    when: () => true,
    paras: [
      "The first lists come in from the battles on the frontier. The day of 22 August will cost the French army about 27,000 dead, the heaviest loss in a single day in its history. Whole regiments went forward in red trousers into machine-gun fire.",
      "The staff cannot yet add the numbers up, and the commanders in the field are reporting that the attacks have to stop. The army's doctrine was built on the belief that this price was worth paying.",
    ],
  },
  {
    id: "gqg_clemenceau", campaign: "gqg", kind: "Politics", anchor: "gqg_1918_12_link",
    from: "1917-11-16", to: "1918-03-31", date: "1917-11-17",
    title: "A New Government in Paris",
    when: (f, m) => m.will <= -1,
    paras: [
      "After the mutinies and a year of ministries that fell, Georges Clemenceau becomes Premier on 16 November 1917. He is seventy-six years old, and he has made his reputation by attacking governments that make war weakly.",
      "He promises war to the end and visits the trenches to say so. He also expects the commander-in-chief to answer to him, and he has the power to say who that is.",
    ],
  },
  {
    id: "stavka_shells", campaign: "stavka", kind: "The army", anchor: "stavka_1915_04_command",
    from: "1915-04-15", to: "1915-09-05", date: "1915-05-20",
    title: "The Shell Shortage",
    when: (f, m) => m.munitions <= -2,
    paras: [
      "The front commanders are rationing their guns to a few shells a day, and the Germans are firing many times that. Rifles are short as well, and some regiments go into the line with a rifle to every two men, the rest to be picked up from the dead.",
      "The War Minister Sukhomlinov is dismissed in June, and committees of industrialists are called in to help. It will be a year before the factories begin to deliver what the army needs.",
    ],
  },
  {
    id: "stavka_refugees", campaign: "stavka", kind: "The home front", anchor: "stavka_1915_05_sventsiany",
    from: "1915-06-01", to: "1915-12-31", date: "1915-08-01",
    title: "The Roads Behind the Front",
    when: (f, m) => m.will <= 0,
    paras: [
      "The army is falling back, and the roads and railways behind it are full of people. Many have been ordered out by the army itself, with their villages burned, and many more have simply fled.",
      "The towns of the interior cannot house or feed them, and the trains the army needs for its supplies are blocked by trains of refugees. The ministers in Petrograd say plainly what the war is doing to the country.",
    ],
  },
  {
    id: "bef_zeppelins", campaign: "bef", kind: "The home front", anchor: "bef_1915_06_loos",
    from: "1915-05-30", to: "1915-12-31", date: "1915-05-31",
    title: "Zeppelins over London",
    when: (f, m) => m.will <= -2,
    paras: [
      "German airships have bombed the east coast since January, and on the night of 31 May they bomb London. A few people are killed and the damage is small, but the press and the public are angry that the country has no defence.",
      "The government is asked why the fleet and the army cannot stop them, and the question comes to the soldiers, who have guns and fighter aircraft that the home defence wants.",
    ],
  },
  {
    id: "bef_rising", campaign: "bef", kind: "Politics", anchor: "bef_1916_11_somme",
    from: "1916-04-24", to: "1916-06-30", date: "1916-04-24",
    title: "The Rising in Dublin",
    when: () => true,
    paras: [
      "On Easter Monday about a thousand Irish rebels seize buildings in Dublin and proclaim a republic. The army puts the rising down in six days, with artillery that is badly needed in France, and the leaders are shot in the weeks that follow.",
      "The Cabinet has a second and nearer war to think about for a week, and the executions turn much of Irish opinion against the government. The army is asked for troops it can hardly spare.",
    ],
  },
  {
    id: "aok_emperor", campaign: "aok", kind: "Politics", anchor: "aok_1917_10_sixtus",
    from: "1916-11-21", to: "1917-03-24", date: "1916-11-21",
    title: "The Death of the Emperor",
    when: () => true,
    paras: [
      "Franz Joseph dies on 21 November 1916, at the age of eighty-six, after sixty-eight years on the throne. He is succeeded by his great-nephew Karl, who is twenty-nine and has not been brought up to rule.",
      "The old Emperor was the one thing that held the peoples of the monarchy together, and the army swore its oath to him. The new Emperor takes the supreme command himself, and wants peace.",
    ],
  },
  {
    id: "aok_strikes", campaign: "aok", kind: "The home front", anchor: "aok_1918_14_ukraine",
    from: "1918-01-14", to: "1918-02-20", date: "1918-01-18",
    title: "The January Strikes",
    when: (f, m) => m.will <= -2,
    paras: [
      "The flour ration is halved in the middle of January, and the workers of Wiener Neustadt stop work. The strike spreads to Vienna, to Budapest and to the industrial towns of Bohemia, with demands for bread, for peace, and for a vote.",
      "Workers' councils spring up in imitation of the Russian ones. The strike is ended in about a week by promises, and the army is called on to keep order in places where it has no men to spare.",
    ],
  },
  {
    id: "otto_tunnels", campaign: "otto", kind: "The army", anchor: "otto_1915_03_kut",
    from: "1914-12-18", to: "1916-12-31", date: "1915-01-05",
    title: "The Gaps in the Railway",
    when: (f, m) => m.munitions <= -2,
    paras: [
      "The railway to Syria, Palestine and Mesopotamia has not been finished: the tunnels through the Taurus and the Amanus mountains are incomplete, and everything for the southern armies must be unloaded, carried over the mountains by cart and camel, and loaded again.",
      "A shipment that leaves Constantinople takes weeks to reach the Suez front and months to reach Baghdad. Every gun, shell and uniform the General Staff orders arrives late.",
    ],
  },
  {
    id: "otto_disease", campaign: "otto", kind: "The army", anchor: "otto_1915_03_kut",
    from: "1915-01-01", to: "1916-12-31", date: "1915-02-10",
    title: "Typhus in the Army",
    when: (f, m) => m.manpower <= -2,
    paras: [
      "Typhus, cholera and dysentery are in the army in every theatre, and the army has few doctors and little soap. The disease follows the soldiers home and spreads into the towns the troops pass through.",
      "More Ottoman soldiers die of sickness than of the enemy's fire. The General Staff counts divisions that exist on paper and are fit for little in the field.",
    ],
  },
];

/**
 * The event due before a report, or null: the first of the command's events, in the order above, that has not been shown in this file (its
 * flag ev_<id> is not set), whose window holds the report's date and whose condition holds for the file's state.
 */
export function dueEvent(campaignId, nodeId, flags, meters) {
  const node = CAMPAIGNS[campaignId] && CAMPAIGNS[campaignId].nodes[nodeId];
  if (!node || node.ending) return null;
  for (const e of EVENTS) {
    if (e.campaign !== campaignId || (flags && flags["ev_" + e.id])) continue;
    if (node.date < e.from || node.date > e.to) continue;
    if (e.when(flags || {}, meters)) return e;
  }
  return null;
}
