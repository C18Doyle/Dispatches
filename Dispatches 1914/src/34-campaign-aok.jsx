// =============================================================================
// AUSTRO-HUNGARIAN AOK — HISTORICAL SPINE
// =============================================================================
//
// The campaign's identity (spec §2.5): an army whose internal loyalty is itself the
// strategic variable, and whose every acceptance of German direction buys survival
// and costs autonomy. Each such acceptance is tagged for hard mode (cede_sovereignty).
//
// RESEARCH GATE. Closed on 2026-10-04: the spine was checked against English-language
// sources node by node before writing (see claims/aok.json). The spec's rule stands: a
// node that cannot be sourced is cut, not written around.
//
// SOURCING NOTE. Advisors carry `position`, not `quote`, and a position is attributed
// to a named person only where the record supports it.
// =============================================================================

CAMPAIGNS.aok.startNode = "aok_1914_01_serbia";

CAMPAIGNS.aok.commanders = [
  { id: "conrad", name: "Conrad von Hotzendorf", title: "Chief of the General Staff",
    from: "1914-07-28", to: "1917-02-28" },
  { id: "arz", name: "Arz von Straussenburg", title: "Chief of the General Staff",
    from: "1917-03-01", to: "1918-11-03" },
];

CAMPAIGNS.aok.advisors = [
  { id: "conrad", name: "Conrad", from: "1914-07-28", to: "1917-02-28",
    dossier: { role: "Chief of the General Staff, 1906-1917",
      bio: "Planned the army's deployment against both Serbia and Russia and believed throughout in the offensive. His relations with the German Chief of Staff were poor, and he went to war in 1916 against Italy without German support.",
      fate: "Dismissed by Emperor Karl on 1 March 1917. Commanded an army group in the Tyrol until July 1918, when he was dismissed again." } },
  { id: "friedrich", name: "Archduke Friedrich", from: "1914-07-28", to: "1916-12-01",
    dossier: { role: "Supreme Commander of the Army, 1914-1916",
      bio: "Held the supreme command in name, with Conrad directing operations beneath him.",
      fate: "Replaced as Supreme Commander by the new Emperor on 2 December 1916." } },
  { id: "potiorek", name: "Potiorek", from: "1914-07-28", to: "1914-12-08",
    dossier: { role: "Military Governor of Bosnia; commander of the forces against Serbia",
      bio: "Commanded the Balkan forces in the opening invasions of Serbia, all of which failed.",
      fate: "Relieved in December 1914 after the defeat on the Kolubara." } },
  { id: "karl", name: "Karl I", from: "1916-11-21", to: "1918-11-11",
    dossier: { role: "Emperor-King from 21 November 1916; Supreme Commander from 2 December",
      bio: "Succeeded his great-uncle in the third winter of the war, took the supreme command himself and wanted a peace that would keep the monarchy together. His secret approach to France through his brother-in-law was exposed in April 1918.",
      fate: "Relinquished any share in the government of Austria on 11 November 1918 and left for exile. Died in Madeira in 1922." } },
  { id: "arz", name: "Arz von Straussenburg", from: "1917-03-01", to: "1918-11-03",
    dossier: { role: "Chief of the General Staff, March 1917 to November 1918",
      bio: "Chosen by the new Emperor for a conciliatory manner and not for his strategic independence. Accepted responsibility for the failure of the June 1918 offensive and offered his resignation, which was refused.",
      fate: "Resigned on 3 November 1918. Died in Budapest in 1935." } },
  { id: "czernin", name: "Czernin", from: "1916-12-22", to: "1918-04-14",
    dossier: { role: "Foreign Minister, December 1916 to April 1918",
      bio: "Served an Emperor who wished for peace and an alliance that did not allow it. Resigned after the exposure of the Emperor's letters to France.",
      fate: "Left office on 14 April 1918." } },
  { id: "tisza", name: "Tisza", from: "1914-07-28", to: "1917-05-23",
    dossier: { role: "Prime Minister of Hungary, 1913-1917",
      bio: "Held the Hungarian half of the monarchy to the war, and was the strongest voice in the common ministers' councils against concessions to the Slav nationalities.",
      fate: "Resigned in May 1917. Assassinated in October 1918." } },
  { id: "boroevic", name: "Boroevic", from: "1915-05-23", to: "1918-11-03",
    dossier: { role: "Commander on the Isonzo front; army group commander in 1918",
      bio: "A Croat from the old military border who held the Isonzo through eleven battles, and quarrelled with Conrad over the plan for the offensive of June 1918.",
      fate: "Retired in 1919." } },
];

CAMPAIGNS.aok.bulletinVoice = {
  source: "Communique of the Imperial and Royal General Staff, as printed in the Vienna and Budapest press",
  register: "Courteous, formal and sparing; reverses become 'movements', and the allied army is mentioned warmly",
  defined: true,
};

CAMPAIGNS.aok.hardMode.forcedEndingId = "aok_end_relieved";
// Set from measurement (montecarlo.js hard, check-historical-ending.js): the historical line carries three cede_sovereignty choices and survives at 4; about one random run in five is relieved.
CAMPAIGNS.aok.hardMode.erosionMax = 4;
CAMPAIGNS.aok.researchGate = { open: false, note: "Closed on 2026-10-04 after a node-by-node sourcing check; see claims/aok.json." };

CAMPAIGNS.aok.nodes = {

  // ---------------------------------------------------------------- 1914-08
  aok_1914_01_serbia: {
    year: 1914, date: "1914-08-01", city: "Vienna",
    title: "The Swing Force",
    advisors: ["conrad", "potiorek", "tisza"],
    situation:
      "The monarchy is at war with Serbia, and Russia mobilised on 30 July. The army's " +
      "deployment is built on a division of the force into three: a Balkan group for " +
      "Serbia, a larger group in Galicia for Russia, and a swing force between them " +
      "that can be sent to either, depending on whether Russia comes in.\n\n" +
      "Russia is coming in. What is not settled is where the swing force, the Second " +
      "Army, is to go first. The Chief of the General Staff has planned a war on " +
      "two fronts, and the war on the second front has already begun.",
    context:
      "The railways have been timetabled for months, and a train that is sent the " +
      "wrong way cannot easily be sent back. An army that goes to Serbia first is " +
      "not in Galicia when the Russians cross the frontier.",
    choices: [
      {
        id: "serbia",
        label: "Send the swing force to Serbia first, as the plan says, and settle that war quickly",
        historical: true,
        advisor: { name: "Potiorek", position:
          "Serbia has to be dealt with at once. With the swing force the Balkan army can finish it before Russia is ready." },
        impact: { manpower: -1, munitions: 0, will: 0 },
        setFlags: { aok_serbia: "first" },
        next: "aok_1914_02_recall",
        outcome:
          "The swing force is sent to the Serbian frontier and the invasion goes in on " +
          "12 August, with some 460,000 men in the Balkan armies. It is a poor " +
          "campaign: the force is stopped by the Serbian army and loses a great " +
          "deal for no result. After about ten days of inactivity the swing force is " +
          "ordered north, to a front that has by then started without it.",
      },
      {
        id: "galicia",
        label: "Send the swing force to Galicia from the start and hold Serbia with the Balkan group alone",
        advisor: { name: "Tisza", position:
          "The danger is Russia, and the army has to be where the danger is. Serbia can wait." },
        gate: (m) => m.will >= -3,
        disabledReason: "The monarchy has gone to war to punish Serbia, and the war on Serbia cannot be seen to wait",
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { aok_serbia: "galicia" },
        next: "aok_1914_02_recall",
        outcome:
          "Speculative. The swing force goes north at once and the Balkan group holds the " +
          "Serbian frontier on its own. The army in Galicia is stronger when the Russians " +
          "arrive, and the punishment of Serbia is postponed. The Hungarian and Austrian " +
          "governments, who have declared war for exactly that purpose, have to decide " +
          "whether they will accept an army that is looking the other way.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-08
  aok_1914_02_recall: {
    year: 1914, date: "1914-08-18", city: "Przemysl",
    title: "Too Late to Be Wanted",
    advisors: ["conrad", "potiorek"],
    situation: (flags) =>
      "The Russian armies are across the frontier in Galicia in greater strength than the " +
      "General Staff had allowed for. " +
      (flags.aok_serbia === "galicia"
        ? "The swing force is already in Galicia, and the Balkan group is watching Serbia alone."
        : "The swing force has been in the south for ten days and has done nothing there.") +
      "\n\nThe Chief of the General Staff has to decide whether the Second Army is to be " +
      "taken out of the Balkan campaign and sent north. It will take days by rail, and " +
      "the Balkan commander has asked that it be allowed to finish what it has begun.",
    context:
      "An army that leaves one campaign for another arrives with its men tired by " +
      "the journey and its place in the line already taken by the formations that " +
      "were there.",
    choices: [
      {
        id: "recall",
        label: "Recall the Second Army from the Serbian front and send it north",
        historical: true,
        advisor: { name: "Conrad", position:
          "The decisive war is in Galicia. The Second Army must be in it, whatever has to be given up in the south." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { aok_recall: "recalled" },
        next: "aok_1914_03_galicia",
        outcome:
          "The Second Army is taken out of the Balkan force and sent north by rail. It " +
          "reaches Galicia too late to take part in the first battles, and its absence " +
          "from the Serbian front lets the Serbs gather themselves for the next " +
          "campaign. The troops have been marched, entrained and sent a long way for " +
          "neither of the two fronts, and the army has lost a fortnight it could not afford.",
      },
      {
        id: "stay",
        label: "Leave the Second Army in Serbia to finish the campaign",
        advisor: { name: "Potiorek", position:
          "The campaign is not finished. To take the Second Army away now is to give up what has been paid for." },
        gate: (m) => m.manpower >= -4,
        disabledReason: "The front in Galicia cannot be held without the Second Army",
        impact: { manpower: -1, munitions: -1, will: 1 },
        setFlags: { aok_recall: "stayed" },
        next: "aok_1914_03_galicia",
        outcome:
          "Speculative. The Second Army stays in the south and the Balkan campaign is " +
          "pushed on. The army in Galicia meets the Russians without it. Whether " +
          "Serbia is beaten in the time that the Second Army has is not something the " +
          "record can say, and the northern front is thinner than the General Staff " +
          "expected it to be.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-08
  aok_1914_03_galicia: {
    year: 1914, date: "1914-08-22", city: "Przemysl",
    title: "Into Russian Poland",
    advisors: ["conrad", "friedrich"],
    bulletin: {
      voice: "aok", date: "1914-08-21", source: "Communique of the General Staff",
      text:
        "The Imperial and Royal armies have begun operations on the northern front. " +
        "The troops are in the highest spirits. Details cannot be given at present.",
    },
    situation: (flags) =>
      "Conrad has concentrated the First, Third and Fourth Armies in Galicia along a " +
      "front of some 280 kilometres, with about 950,000 men. " +
      (flags.aok_recall === "stayed"
        ? "The Second Army is still in Serbia, and the northern armies are without it."
        : "The Second Army is on its way from the south.") +
      "\n\nHis plan is an offensive north into Russian Poland, to strike the Russian " +
      "armies as they come forward, before they have concentrated. The Russians are " +
      "stronger than he expected and have two armies on his southern flank that his plan " +
      "has not accounted for. The alternative is to wait behind the San and let them come.",
    context:
      "The army was built to attack, and its training, its doctrine and its Chief " +
      "of Staff believe in it. The army that waits behind a river is not the army " +
      "that has been prepared.",
    choices: [
      {
        id: "offensive",
        label: "Launch the offensive north into Russian Poland",
        historical: true,
        advisor: { name: "Conrad", position:
          "The initiative has to be taken before the Russians are ready. An army that waits has already lost the first battle." },
        impact: { manpower: -3, munitions: -1, will: -1 },
        setFlags: { aok_galicia: "offensive" },
        dispute:
          "Why the Galician campaign failed is argued. One view blames Conrad's plan, which " +
          "left the southern flank exposed. Another blames the Russian strength, which the " +
          "General Staff had underestimated. The casualty figures for the battle are " +
          "themselves disputed, from about 420,000 men in Herwig's reckoning to 324,000 in " +
          "Buttar's.",
        uncertain: [
          { weight: 70, title: "Early victories, then the collapse before Lemberg", historicalBranch: true,
            impact: { manpower: -1, will: -1 },
            setFlags: { aok_galiciaResult: "lemberg" },
            next: "aok_1914_04_rawa",
            outcome:
              "The First Army wins at Krasnik, taking some 6,000 prisoners, and the Fourth " +
              "wins at Komarow, taking some 20,000. Then the southern flank gives way: " +
              "the Russians under Brusilov and Ruzsky break the Third Army at the Gnila Lipa " +
              "and take Lemberg. The army falls back a hundred miles to the Carpathians, " +
              "leaving the fortress of Przemysl behind it, and has lost a great part of its " +
              "regular officers and men." },
          { weight: 30, title: "The offensive is checked early and the army keeps its line",
            impact: { manpower: 1 },
            setFlags: { aok_galiciaResult: "checked" },
            next: "aok_1914_04_rawa",
            outcome:
              "Speculative. The offensive meets the Russians earlier and in greater strength " +
              "than it did, and is checked before the flank is turned. The army falls back " +
              "less far and with fewer losses, and Lemberg is held for some weeks longer. " +
              "It is a defeat that can be called a withdrawal, and the General Staff, " +
              "which believed in the attack, has been shown what it can do." },
        ],
      },
      {
        id: "san",
        label: "Stand on the defensive behind the San and let the Russians come on",
        advisor: { name: "Archduke Friedrich", position:
          "The army is in a position to wait. It does not have to attack before it knows what the Russians have." },
        gate: (m) => m.will >= -3,
        disabledReason: "The General Staff's doctrine and the German ally's expectation both call for an offensive",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { aok_galicia: "defensive" },
        next: "aok_1914_04_rawa",
        outcome:
          "Speculative. The army stands behind the San and takes the Russian attack there, " +
          "with the fortress of Przemysl on its flank. It loses fewer men in the first " +
          "weeks than in the offensive, and the Russians come on at their own pace. The " +
          "Germans, who were told that the Austro-Hungarian army would take the " +
          "initiative in the south, are told instead that it will defend.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-09
  aok_1914_04_rawa: {
    year: 1914, date: "1914-09-06", city: "Przemysl",
    title: "A Decisive Blow Meets Another",
    advisors: ["conrad", "friedrich"],
    situation:
      "On 6 September the armies are three days into the great battle in Galicia. " +
      "Conrad's plan is a decisive blow by Auffenberg's Fourth Army, which has turned " +
      "south-east to deliver it, and the army to its left, under Archduke Joseph " +
      "Ferdinand, has been left with four infantry and two cavalry divisions to face " +
      "north.\n\n" +
      "The Russians have turned too. Ruzsky's Third Army, persuaded to swing north-west, " +
      "is coming straight at Auffenberg, so that the blow and the Russian advance meet " +
      "head on. The Austro-Hungarian armies are outnumbered by two to one, and on " +
      "the northern flank Plehve's Fifth Army is advancing from Komarow and the " +
      "Russian Twenty-first Corps reaches beyond the left of the line.",
    context:
      "Breaking off now is a retreat in the middle of the first great battle, with " +
      "the northern flank open and the fortress of Przemysl behind it. Going on is a " +
      "gamble that the Fourth Army wins before the flank is turned.",
    choices: [
      {
        id: "blow",
        label: "Let the blow go on: the Fourth Army attacks as ordered",
        historical: true,
        advisor: { name: "Conrad", position:
          "A battle of this size is decided by one army breaking another, and the Fourth Army is the one that can do it. A retreat now would give the Russians the victory for nothing." },
        impact: { manpower: 0, munitions: -1, will: 0 },
        setFlags: { aok_rawa: "blow" },
        next: "aok_1914_05_kolubara",
        outcome:
          "The blow meets the Russian advance and does not break it. On 9 September " +
          "Auffenberg begins to retreat west toward the San, outnumbered two to one " +
          "and with his northern flank exposed, and the armies fall back to the " +
          "Dunajec and the Biala. Przemysl is left behind them to be besieged by " +
          "the Russians. The plan has been tried in the place where it was meant " +
          "to work, and it has not worked.",
      },
      {
        id: "breakoff",
        label: "Break off the battle now and fall back behind the San",
        advisor: { name: "Friedrich", position:
          "If the northern flank is open and the enemy is twice our number, then the army should leave the field while it is still an army and fight again behind the river." },
        gate: (m) => m.will >= -3,
        disabledReason: "The command will not order a retreat in the middle of its first great battle",
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { aok_rawa: "brokeoff" },
        next: "aok_1914_05_kolubara",
        outcome:
          "Speculative. The orders go out on 6 September for the armies to disengage and " +
          "fall back behind the San before the Russian flank closes. The Fourth " +
          "Army is intact, the northern wing has not been turned, and the retreat is " +
          "made in order, three days earlier than it was. The fortress is besieged " +
          "all the same. What the army has lost is the battle it did not fight, " +
          "and the hope that it would have won it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-10
  aok_1914_05_kolubara: {
    year: 1914, date: "1914-10-10", city: "Vienna",
    title: "A Third Invasion",
    advisors: ["conrad", "potiorek"],
    situation:
      "In the first days of October the Emperor has personally authorised a third " +
      "invasion of Serbia, after two had failed and after the high command had " +
      "hesitated. Potiorek, who commands the Balkan forces, means to go in " +
      "at the beginning of November.\n\n" +
      "Every division that goes into Serbia is a division that is not in Galicia, " +
      "where the Russians have driven the armies back since the Rawa battle.",
    context:
      "A third attempt on Serbia is the one the monarchy went to war to make. " +
      "Declining it means telling the Emperor that the war's first purpose " +
      "has to wait.",
    choices: [
      {
        id: "invade",
        label: "Authorise Potiorek's third invasion of Serbia",
        historical: true,
        advisor: { name: "Potiorek", position:
          "Serbia is the reason for the war, and the Serbian army has been beaten twice back from its own ground. A third blow, with the whole of the Balkan force, will finish it." },
        impact: { manpower: -1, munitions: 0, will: 0 },
        setFlags: { aok_kolubara: "invaded" },
        next: "aok_1915_04_carpathians",
        outcome:
          "The offensive opens on 6 November and reaches the Kolubara on 16 November. " +
          "The Serbs give up Belgrade at the end of the month and the Austro-Hungarians " +
          "enter it on 1 December; on 2 December the Serbs counterattack, and by " +
          "15 December the capital is theirs again. The army has lost more than two " +
          "hundred thousand men, the monarchy's prestige has suffered badly, and " +
          "Potiorek is relieved on 22 December.",
      },
      {
        id: "decline",
        label: "Decline the invasion and hold the Balkan divisions for Galicia",
        advisor: { name: "Conrad", position:
          "The war will be decided against Russia. Every division spent in the Balkans is one that the Galician front will need before the winter is out." },
        gate: (m) => m.will >= -3,
        disabledReason: "The Emperor has already given his word for the invasion",
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { aok_kolubara: "declined" },
        next: "aok_1915_04_carpathians",
        outcome:
          "Speculative. The Emperor's authorisation is put aside, and the Balkan force " +
          "stands on the Drina and the Sava while the divisions that can be spared go " +
          "north. Serbia is left unbeaten and Potiorek unrewarded, and Budapest, " +
          "which wanted Serbia, says so. Galicia has the divisions, and the monarchy " +
          "has the army it would have lost in the mountains of Serbia in the winter.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-01
  aok_1915_04_carpathians: {
    year: 1915, date: "1915-01-23", city: "Teschen",
    title: "Relieving a Fortress Through the Snow",
    advisors: ["conrad", "friedrich"],
    bulletin: {
      voice: "aok", date: "1915-01-21", source: "Communique of the General Staff",
      text:
        "The fortress of Przemysl continues to hold. In the Carpathians our troops " +
        "have repulsed several attacks. The weather is severe.",
    },
    situation: (flags) =>
      "Przemysl has been surrounded by the Russians since the autumn, with a garrison " +
      "of about 127,000 soldiers and 18,000 civilians. " +
      (flags.aok_galiciaResult === "checked"
        ? "The army was not driven back so far in the summer, and has more to attempt with."
        : "The army fell back in September to the Carpathians and has been there since.") +
      "\n\nConrad wants to relieve it, by an offensive through the mountains in the " +
      "dead of winter, over passes under snow, with troops that have fought since " +
      "August and are short of everything. The fortress's supplies are running down, and the " +
      "army's honour, as the General Staff reads it, is in the garrison.",
    context:
      "The fortress is useless if it is not relieved and a disaster if it falls. The " +
      "relief may cost more men than the fortress holds.",
    choices: [
      {
        id: "relieve",
        label: "Press the winter offensive through the Carpathians to relieve Przemysl",
        historical: true,
        advisor: { name: "Conrad", position:
          "The garrison has to be relieved. An army that leaves 130,000 men to be taken has lost more than the battle." },
        impact: { manpower: -3, munitions: -1, will: 0 },
        setFlags: { aok_carpathians: "pressed" },
        next: "aok_1915_07_przemysl",
        outcome:
          "The offensives through the mountains go on from January to April and fail. " +
          "Austro-Hungarian casualties in the Carpathians in those months are reported as " +
          "some 800,000, most of them from the weather and disease, and the garrison of " +
          "Przemysl surrenders on 22 March with some 117,000 men. About half of the army " +
          "that went to war in 1914 is gone, and what is left is a mixture of the old " +
          "regiments and raw drafts.",
      },
      {
        id: "hold",
        label: "Hold the passes with what the army has and leave the fortress to break out or surrender",
        advisor: { name: "Archduke Friedrich", position:
          "The army cannot do more in the mountains in winter than it has done. The garrison has to decide for itself." },
        gate: (m) => m.will >= -4,
        disabledReason: "The General Staff cannot be seen to abandon the fortress",
        impact: { manpower: 1, munitions: 1, will: -2 },
        setFlags: { aok_carpathians: "held" },
        next: "aok_1915_07_przemysl",
        outcome:
          "Speculative. The relief is not attempted and the army holds the line of the " +
          "passes. The garrison breaks out, or it does not, and surrenders in the spring " +
          "with its stores gone. The army has kept the men that the Carpathian winter would " +
          "have cost it, and has told the monarchy that the fortress it was told to be proud " +
          "of was not worth the winter.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-02
  aok_1915_07_przemysl: {
    year: 1915, date: "1915-02-27", city: "Teschen",
    title: "Telling the Fortress",
    advisors: ["conrad", "friedrich"],
    situation: (flags) =>
      "The fortress of Przemysl has been shut in for months, with a garrison of well " +
      "over a hundred thousand men, and the winter in the Carpathians is costing " +
      "the army heavily, mostly in cold and sickness.\n\n" +
      (flags.aok_carpathians === "held"
        ? "The passes were held in January and the fortress left to itself, and the " +
          "commandant, Kusmanek, has heard it from nobody. "
        : "The relief attempts have been made through the snow, and Boroevic's Third " +
          "Army has pressed forward again in February without breaking through. ") +
      "By the end of the month Conrad has to tell Kusmanek whether any further " +
      "attempt to relieve him will be made.",
    context:
      "Telling a garrison that nothing more is coming is telling it to " +
      "surrender or break out. Not telling it is leaving it to eat its stores while " +
      "the army that would relieve it is spent in the passes.",
    choices: [
      {
        id: "none",
        label: "Tell the fortress that no further relief will be attempted",
        historical: true,
        advisor: { name: "Conrad", position:
          "The army cannot be spent in the passes any longer. The fortress has to be told the truth, so that its commandant can do what he can with it." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { aok_przemyslend: "none" },
        next: "aok_1915_05_gorlice",
        outcome:
          "Conrad tells Kusmanek by the end of February that no further relief will " +
          "be tried. On 19 March the commandant orders a breakout, which is " +
          "repelled, and on 22 March he surrenders with some 117,000 men. The " +
          "expected Russian advance into Hungary does not come, but the loss is a " +
          "serious blow to the army's morale.",
      },
      {
        id: "third",
        label: "Order a third relief attempt through the passes",
        advisor: { name: "Friedrich", position:
          "A fortress with a hundred thousand men in it is worth another attempt. The army is better spent in the mountains than given up behind the walls." },
        gate: (m, flags) => m.manpower >= -4 && flags.aok_carpathians !== "held",
        disabledReason: "There is no army left in the passes to send, or the passes were never contested",
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { aok_przemyslend: "third" },
        next: "aok_1915_05_gorlice",
        outcome:
          "Speculative. A third attempt goes in at the end of the winter, with what the " +
          "second left of the army, over the same snow. Whether it reaches the " +
          "fortress is something nobody knows, and the garrison is told to hold " +
          "until it comes. The army that makes it is smaller than the one that " +
          "made the second, and the spring, when the Russians come on again, " +
          "finds it so.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-04
  aok_1915_05_gorlice: {
    year: 1915, date: "1915-04-13", city: "Teschen",
    title: "A German Commander for the Offensive",
    advisors: ["conrad", "friedrich"],
    situation: (flags) =>
      "The army has lost about half of the force that entered the war. " +
      (flags.aok_carpathians === "held"
        ? "The Carpathian winter was not fought through, and the army is stronger than it would have been, though still beaten."
        : "The Carpathian winter has taken what the autumn left.") +
      "\n\nConrad has told Berlin that the monarchy cannot go on without help, and the German " +
      "Chief of Staff, Falkenhayn, has concluded that Vienna may look for a separate " +
      "peace if it is not given some. Falkenhayn's plan is a concentrated German " +
      "offensive in western Galicia, at Gorlice and Tarnow, under a German commander. " +
      "The Austro-Hungarian Fourth Army is to be placed under the new German army." +
      (flags.xc_gorlice === "envelop" ? "\n\nBerlin has not accepted Falkenhayn's plan. The weight of the German effort is going north, to an envelopment out of East Prussia and Courland, and what is offered in Galicia is smaller." : ""),
    context:
      "The army that accepts a German commander is saved by him. It is also an army " +
      "that has been shown it cannot defend its own frontier, and the shadow of that does " +
      "not go away.",
    choices: [
      {
        id: "accept",
        label: "Accept the offensive under Mackensen, with the Fourth Army placed under German command",
        historical: true,
        advisor: { name: "Conrad", position:
          "The army cannot stand another winter like this one. If the price of relief is a German commander, it has to be paid." },
        impact: { manpower: 1, munitions: 1, will: 1 },
        setFlags: { aok_gorlice: "german" },
        erodes: "cede_sovereignty",
        next: "aok_1915_06_isonzo",
        outcome:
          "The offensive opens on 2 May under a German general with a German army at its " +
          "head. By 6 May Mackensen reports 60,000 prisoners, and by June the Russians have " +
          "been driven out of Galicia, with Lemberg retaken on 22 June. Austria-Hungary " +
          "is saved. It is saved by an ally who now commands the operations on its own " +
          "territory, and the arrangement is not undone for the rest of the war.",
      },
      {
        id: "own",
        label: "Insist that the offensive be commanded by an Austro-Hungarian general",
        advisor: { name: "Archduke Friedrich", position:
          "The monarchy's armies cannot be commanded by a foreigner on the monarchy's own ground. The alliance is not a protectorate." },
        gate: (m) => m.will >= -3,
        disabledReason: "The Germans have said the offensive will be German-led or it will not be made",
        impact: { manpower: -1, munitions: -1, will: 0 },
        setFlags: { aok_gorlice: "own" },
        next: "aok_1915_06_isonzo",
        outcome:
          "Speculative. Austria-Hungary asks for an offensive under an Austro-Hungarian " +
          "commander and is told that the Germans will not make it on those terms, or makes " +
          "it with a smaller force. The army goes into the summer with the Russians still " +
          "in the passes, and the monarchy's command of its own armies is intact and " +
          "untested.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-05
  aok_1915_06_isonzo: {
    year: 1915, date: "1915-05-23", city: "Teschen",
    title: "A Third Enemy",
    advisors: ["conrad", "boroevic"],
    situation:
      "Italy has declared war on the monarchy today, after nine months of bargaining " +
      "over what she would take for staying neutral. The front on the Isonzo and in the " +
      "Tyrol is held by a few weak formations and the frontier garrisons, because the " +
      "army that would have held it is in Galicia.\n\n" +
      "Conrad has never believed that Italy would stay out and has wanted a war with " +
      "her for years. He has not got the army for it now. What has to be decided is what to move " +
      "south, and how much of the Galician front to give up to move it.",
    context:
      "The ground on the Isonzo favours the defender, and the Italians have a long " +
      "way to climb. An army that holds there can be small, and one that attacks " +
      "from the Tyrol has to be much larger.",
    choices: [
      {
        id: "isonzo",
        label: "Hold the Isonzo line with the army that can be spared, under Boroevic, and attack nowhere",
        historical: true,
        advisor: { name: "Boroevic", position:
          "The Isonzo is a position that a small army can hold if it holds it with its whole heart. It must not be spent in attacks." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        setFlags: { aok_isonzo: "held" },
        next: "aok_1915_08_pless",
        outcome:
          "Boroevic's army digs in on the heights above the Isonzo and holds them against " +
          "the Italian attacks that begin in June. There are eleven battles on the Isonzo " +
          "before the autumn of 1917, and each is fought on ground that the defender has " +
          "had time to prepare. The front is held, and costs the army a great many men " +
          "and the monarchy a great deal of its patience.",
      },
      {
        id: "attack",
        label: "Move a strong force south at once and attack Italy before she is ready",
        advisor: { name: "Conrad", position:
          "Italy must be struck at once, before she has mobilised, and not left to choose her time." },
        gate: (m) => m.manpower >= -4,
        disabledReason: "There is no army to spare from Galicia for an offensive in the south",
        impact: { manpower: -3, munitions: -1, will: 0 },
        setFlags: { aok_isonzo: "attacked" },
        next: "aok_1915_08_pless",
        outcome:
          "Speculative. A strong force is sent to the south and attacks across the frontier " +
          "in the first weeks of the war with Italy. It takes some ground and is stopped " +
          "by the Italian army, which has had time to mobilise, and the troops taken from " +
          "Galicia have to be replaced by Germans. The monarchy has now two active " +
          "fronts and is further in debt to its ally.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-09
  aok_1915_08_pless: {
    year: 1915, date: "1915-09-08", city: "Pless",
    title: "A Convention at Pless",
    advisors: ["conrad", "friedrich"],
    situation: (flags) =>
      "On 8 September Falkenhayn and Conrad meet at Pless to sign a military " +
      "convention that calls for an immediate attack on Serbia. The plan on the " +
      "table puts it under a German field marshal, Mackensen, with a German army, " +
      "the Austro-Hungarian Third Army under Kovess, and, if Bulgaria comes in, " +
      "a Bulgarian one beneath him.\n\n" +
      (flags.aok_gorlice === "own"
        ? "At Gorlice an Austro-Hungarian command was insisted on, and it is a " +
          "precedent that Berlin has not forgotten. "
        : "At Gorlice a German commander was accepted, and this would be the second " +
          "time. ") +
      "Serbia has been beaten off three times by the monarchy's own " +
      "armies, and nobody at the table has to be reminded of it.",
    context:
      "A German commander over Austro-Hungarian troops is a thing the " +
      "monarchy has said it would not accept, and has accepted. The case " +
      "for refusing is that the attack on Serbia is the monarchy's own " +
      "war. The case for accepting is that Falkenhayn has the divisions " +
      "and the monarchy has not.",
    choices: [
      {
        id: "mackensen",
        label: "Sign: Mackensen commands the attack, with the Third Army under him",
        historical: true,
        advisor: { name: "Conrad", position:
          "The monarchy has failed three times alone. The Germans have the divisions and the Bulgarians are being brought in, and the war with Serbia must be ended." },
        impact: { manpower: 0, munitions: 1, will: -1 },
        setFlags: { aok_pless: "mackensen" },
        next: "aok_1916_06_montenegro",
        outcome:
          "Mackensen takes the supreme command over the German Eleventh Army, the " +
          "Austro-Hungarian Third Army and the Bulgarian First. The attack opens on 6 " +
          "October and Austro-Hungarian troops enter Belgrade on 8 October; Bulgaria " +
          "declares war on 14 October. In November the Serbian army withdraws across " +
          "the mountains of Albania and Montenegro. Serbia is eliminated as a " +
          "threat, and a land route to the Ottoman Empire is open.",
      },
      {
        id: "own",
        label: "Sign only if the Third Army keeps its own commander and AOK's orders",
        advisor: { name: "Friedrich", position:
          "Serbia is the monarchy's quarrel and the monarchy's army should end it. A command that is German takes the credit for it." },
        gate: (m) => m.will >= -3,
        disabledReason: "Berlin has already named the commander, and AOK cannot now refuse it",
        impact: { manpower: -1, munitions: 0, will: 1 },
        setFlags: { aok_pless: "own" },
        next: "aok_1916_06_montenegro",
        outcome:
          "Speculative. Falkenhayn does not agree to everything, and the convention " +
          "that is signed at Pless has two commanders where the other had one. The " +
          "attack is made later and by less, and the Austro-Hungarian army is " +
          "again on the ground that has broken it three times. Whether it wins, " +
          "with the Bulgarians coming in, is not something the convention can " +
          "say. The monarchy has kept what it asked to keep.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-01
  aok_1916_06_montenegro: {
    year: 1916, date: "1916-01-04", city: "Teschen",
    title: "The Mountains Beyond Serbia",
    advisors: ["conrad", "friedrich"],
    situation:
      "Serbia has been overrun, and its army, with the King, a great many civilians " +
      "and the government, is making its way through the mountains of Albania " +
      "toward the Adriatic coast, in the winter, in a retreat in which many tens " +
      "of thousands will die. Montenegro, which stayed in the war, has not followed " +
      "them into exile.\n\n" +
      "Conrad has other plans for the spring, in the Trentino. The divisions that " +
      "would take Montenegro are divisions that cannot be moved to Italy, and " +
      "the campaign would open tomorrow.",
    context:
      "Montenegro is small and its army is not large, and the campaign " +
      "against it would be short. A short campaign still costs the divisions " +
      "that are in the Balkans something, and a month.",
    choices: [
      {
        id: "attack",
        label: "Open the campaign against Montenegro at once",
        historical: true,
        advisor: { name: "Conrad", position:
          "The Balkans are to be finished while the Serbs are in flight and the Montenegrins alone. The divisions go north when it is done." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { aok_montenegro: "attacked" },
        next: "aok_1916_07_strafe",
        outcome:
          "The campaign opens on 5 January. The Montenegrins win at Mojkovac and are " +
          "defeated within two weeks, and their army does not follow the Serbs into " +
          "exile. The monarchy has taken a second kingdom. The divisions that did it " +
          "are in the mountains in the middle of the winter, a long way from the " +
          "Trentino.",
      },
      {
        id: "halt",
        label: "Stop at the frontier and move the divisions toward the Italian front",
        advisor: { name: "Friedrich", position:
          "The Serbs are beaten and Montenegro will not move. The divisions are wanted in the Trentino, and every week they spend in the Albanian snow is a week the spring offensive loses." },
        gate: (m) => m.will >= -3,
        disabledReason: "The Balkan command has been promised the campaign",
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { aok_montenegro: "halted" },
        next: "aok_1916_07_strafe",
        outcome:
          "Speculative. The divisions stay on the frontier and are moved north, and " +
          "Montenegro is left with its army and its king. The western Balkans are " +
          "not closed and the Adriatic is not Austrian from end to end. The " +
          "spring offensive in the Trentino has its divisions rested and earlier, " +
          "and the little kingdom, if it is still at war in March, has to be " +
          "watched.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-05
  aok_1916_07_strafe: {
    year: 1916, date: "1916-05-14", city: "Teschen",
    title: "The Punishment Expedition",
    advisors: ["conrad", "friedrich"],
    bulletin: {
      voice: "aok", date: "1916-05-12", source: "Communique of the General Staff",
      text:
        "The situation on all fronts is unchanged. On the Isonzo the artillery is " +
        "active. Our troops in the Tyrol are in good condition.",
    },
    situation: (flags) =>
      "Conrad has prepared an offensive from the Trentino, down onto the Venetian plain " +
      "behind the Italian armies on the Isonzo, to be launched tomorrow. He asked " +
      "Falkenhayn for German divisions for it, and Falkenhayn refused: he is attacking " +
      "at Verdun, and did not consult Conrad about it either.\n\n" +
      (flags.aok_gorlice === "own"
        ? "The Eastern Front is held by an army that has kept its command and has had less help."
        : "The Eastern Front is quiet, and held by an army the Germans have taught the habit of leaning on.") +
      " To make the attack with Austro-Hungarian troops alone Conrad has taken six or eight " +
      "of his best divisions out of Galicia, with all his mountain artillery, and " +
      "put raw recruits in their places.",
    context:
      "The Russians have not attacked since the summer of 1915, and the General Staff " +
      "believes that they cannot. If it is right, the offensive in the Tyrol is a " +
      "bargain. If it is wrong, the Galician front has been left bare.",
    choices: [
      {
        id: "strafe",
        label: "Launch the Trentino offensive with the army's own troops, taking the divisions from Galicia",
        historical: true,
        advisor: { name: "Conrad", position:
          "Italy has to be punished for the betrayal, and the Galician front is quiet enough to be thinned. This is the chance." },
        impact: { manpower: -2, munitions: -1, will: 0 },
        setFlags: { aok_strafe: "launched" },
        next: "aok_1916_08_brusilov",
        outcome:
          "On 15 May some 2,000 guns open on the Italian lines and the infantry attacks " +
          "along a front of fifty kilometres. For the first days it succeeds, since it has " +
          "surprise. Then it slows in the mountains and meets the Italian reserves, and it is " +
          "still in the mountains when the Russians attack in Galicia, against a front that " +
          "has been stripped of its best divisions and filled with the newest.",
      },
      {
        id: "keep",
        label: "Cancel the offensive and keep the divisions in Galicia",
        advisor: { name: "Archduke Friedrich", position:
          "The army has no strength to waste on an attack that its ally will not support. The Russian front is what matters." },
        gate: (m) => m.will >= -3,
        disabledReason: "The offensive has been prepared for months and the Emperor and the General Staff have staked their name on it",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { aok_strafe: "cancelled" },
        next: "aok_1916_08_brusilov",
        outcome:
          "Speculative. The offensive in the Trentino is not made, and the divisions " +
          "stay where they are in Galicia. The Italians are left alone on the Isonzo, " +
          "and the General Staff has to tell the monarchy that the punishment of Italy " +
          "has been put off. When the Russians attack in June they find the divisions " +
          "that have not gone.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-06
  aok_1916_08_brusilov: {
    year: 1916, date: "1916-06-16", city: "Teschen",
    title: "The Front Gives Way",
    advisors: ["conrad", "friedrich"],
    situation: (flags) =>
      "The Russians attacked on 4 June along the whole front from the Styr to the " +
      "Bukovina, and in ten days they have driven a wedge ninety kilometres wide and " +
      "sixty deep, taking some 133,600 prisoners. The Fourth and Seventh Armies are coming " +
      "apart. " +
      (flags.aok_strafe === "cancelled"
        ? "The divisions that were kept in Galicia have held better than the raw recruits would have, and the front is bending and not breaking."
        : "The divisions that would have held the line are in the Tyrol, and the raw recruits in their places have not held.") +
      "\n\nThe offensive in the Trentino is still going on, in mountains and rain. The German " +
      "command is pressing Conrad to stop it and send his divisions back.",
    context:
      "A front that has broken has to be mended from somewhere, and the only place " +
      "with troops is the one the army was trying to win. An ally that has been " +
      "refused is now being asked for help.",
    choices: [
      {
        id: "halt",
        label: "Halt the Trentino offensive and send the divisions back to Galicia",
        historical: true,
        advisor: { name: "Conrad", position:
          "The attack in the south has to be given up. The front in the east is the one that matters, and it is giving way." },
        impact: { manpower: -2, munitions: 0, will: -1 },
        setFlags: { aok_brusilov: "halted" },
        next: "aok_1916_09_supreme",
        outcome:
          "Conrad stops the Trentino offensive on 16 June and sends divisions back to " +
          "Galicia. German divisions are sent to the Austro-Hungarian front as well, and " +
          "mixed with Austro-Hungarian formations so as to hold them together. The Fourth " +
          "and Seventh Armies are almost destroyed, and the army never again has the " +
          "strength to make an offensive of its own. The blow to the monarchy's " +
          "prestige is lasting, particularly among its Slav subjects.",
      },
      {
        id: "continue",
        label: "Press on in the Trentino and ask the Germans to hold Galicia",
        advisor: { name: "Archduke Friedrich", position:
          "The attack in the south is on the point of success. It would be a mistake to abandon it now." },
        gate: (m) => m.will >= -4,
        disabledReason: "The Germans have refused, and there is nothing left in Galicia to hold the line with",
        impact: { manpower: -3, munitions: -1, will: 1 },
        setFlags: { aok_brusilov: "continued" },
        erodes: "cede_sovereignty",
        next: "aok_1916_09_supreme",
        outcome:
          "Speculative. The offensive in the south is kept up and the Germans are asked to " +
          "hold the East. They send what they have, and take control of the front in return. " +
          "The Italians are driven back a little farther, and the Russians a great deal " +
          "farther. The army has staked everything on a single front and has asked an ally " +
          "to cover its loss on the other.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-09
  aok_1916_09_supreme: {
    year: 1916, date: "1916-09-03", city: "Teschen",
    title: "One Supreme Command",
    advisors: ["conrad", "tisza", "friedrich"],
    situation: (flags) =>
      "Hindenburg and Ludendorff took over the German command on 29 August, and they " +
      "want a single supreme command for all the armies of the Central Powers, under the " +
      "German Emperor. " +
      (flags.aok_brusilov === "halted"
        ? "The Austro-Hungarian front has been broken in the summer and is held up by German divisions."
        : "The Austro-Hungarian front is held by a mixture of formations with German troops among them.") +
      "\n\nThe Archduke and Conrad are ambivalent: the proposal would end the " +
      "pretence that the monarchy commands its own armies, though it would only " +
      "put into words what the summer has made plain. The Hungarian Prime Minister does " +
      "not want the Hungarian regiments under a foreign commander.",
    context:
      "To refuse is to keep a command that cannot be used. To accept is to say, " +
      "in writing and in front of the other allies, that the monarchy's army is " +
      "no longer commanded from Vienna.",
    choices: [
      {
        id: "accept",
        label: "Agree to the Supreme War Command under the German Emperor",
        historical: true,
        advisor: { name: "Conrad", position:
          "It is what the position already is. There is more to be gained from having it said than from denying it." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { aok_supreme: "accepted" },
        erodes: "cede_sovereignty",
        next: "aok_1917_10_sixtus",
        outcome:
          "Austria-Hungary agrees on 3 September, Bulgaria and the Ottoman Empire on the " +
          "6th, and the Supreme War Command is set up on the 7th. From then on the German " +
          "Emperor is formally the supreme commander of the armed forces of the Central " +
          "Powers, and Hindenburg holds the effective command. The monarchy has " +
          "agreed to have its army directed from Berlin and keeps its own staff to carry " +
          "out the orders.",
      },
      {
        id: "refuse",
        label: "Refuse, and keep the monarchy's armies under their own command",
        advisor: { name: "Tisza", position:
          "The Hungarian regiments cannot be commanded by a foreigner. The monarchy has to keep the control of its own army." },
        gate: (m) => m.will >= -3,
        disabledReason: "The monarchy depends on German divisions and German supplies, and cannot refuse the German terms",
        impact: { manpower: -1, munitions: -1, will: 1 },
        setFlags: { aok_supreme: "refused" },
        next: "aok_1917_10_sixtus",
        outcome:
          "Speculative. The proposal is refused and the monarchy keeps its own command. The " +
          "Germans are not pleased, and arrange the support of the front in the east " +
          "less generously than they might. The army is still commanded from Vienna, " +
          "and depends for what it has on the goodwill of an ally that has been told " +
          "it is not trusted.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-03
  aok_1917_10_sixtus: {
    year: 1917, date: "1917-03-24", city: "Baden",
    title: "The Emperor's Letter",
    advisors: ["arz", "karl", "czernin"],
    bulletin: {
      voice: "aok", date: "1917-03-22", source: "Communique of the General Staff",
      text:
        "The situation on all fronts is unchanged. His Majesty the Emperor and King has " +
        "been pleased to visit the headquarters, and has expressed his satisfaction.",
    },
    situation: (flags) =>
      "Karl has been Emperor for four months, and took the supreme command himself on " +
      "2 December. He dismissed Conrad on 1 March, and put Arz of Straussenburg in his " +
      "place, a man who does not argue with him. " +
      (flags.aok_supreme === "accepted"
        ? "The monarchy's army is under the German Supreme War Command."
        : "The monarchy still commands its own army, to the annoyance of its ally.") +
      "\n\nHe believes the war cannot be won, and that if it goes on the monarchy will come " +
      "apart. Through his brother-in-law, Prince Sixtus of Bourbon-Parma, an officer " +
      "in the Belgian army, he has opened a channel to the French President. He is " +
      "about to write a letter, and he has told the army and the foreign minister.",
    context:
      "A peace that Berlin does not know about is a peace made behind an ally's back. " +
      "A peace that Berlin does know about does not happen.",
    choices: [
      {
        id: "secret",
        label: "Support the Emperor's approach to France and keep it from the German command",
        historical: true,
        advisor: { name: "Czernin", position:
          "The monarchy cannot hold out another winter. The Emperor is right to try, and it cannot be done in front of Berlin." },
        attested: { by: "Karl I", text: "the just claims of France relating to Alsace-Lorraine",
          source: "Letter to Prince Sixtus of Bourbon-Parma, 24 March 1917 (in translation)" },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { aok_sixtus: "secret" },
        dispute:
          "Karl's letter of 24 March 1917 told the French President that he would support " +
          "France's just claim to Alsace-Lorraine. When Clemenceau published one of the letters " +
          "in April 1918 Karl denied that he had written it, and the dispute over what he had " +
          "meant, and what Czernin knew, was never settled. The letters themselves are " +
          "generally accepted as genuine.",
        next: "aok_1917_11_caporetto",
        outcome:
          "The letter goes on 24 March and nothing comes of it: the French want a " +
          "price in Alsace-Lorraine and in Italian territory that the monarchy " +
          "cannot pay. In April 1918 Clemenceau publishes the letters, and Karl " +
          "denies them. Czernin resigns, and the German command, which had not been " +
          "told, has been given the reason to treat Vienna as an ally to be watched.",
      },
      {
        id: "separate",
        label: "Make Austria's willingness to leave the war known to Berlin, as the price of going on",
        advisor: { name: "Arz von Straussenburg", position:
          "If the Emperor means to leave the war, the German command should be told, and the alliance can then decide what it will do." },
        gate: (m) => m.will >= -3,
        disabledReason: "The monarchy cannot threaten its ally with a separate peace while it is held up by that ally's divisions",
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { aok_sixtus: "separate" },
        nextIf: (m) => (m.will >= -3 ? "aok_end_separate" : null),
        next: "aok_1917_11_caporetto",
        outcome:
          "Speculative. The Emperor tells Berlin that the monarchy needs peace and means to " +
          "have it, and the German command has to decide whether to meet him or to " +
          "overrule him. The French, who have heard the same message by another road, " +
          "are in no hurry to answer. The alliance, which had been held together " +
          "by what neither partner said to the other, has to survive the saying of it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-09
  aok_1917_11_caporetto: {
    year: 1917, date: "1917-09-01", city: "Baden",
    title: "Help on the Isonzo",
    advisors: ["arz", "boroevic", "karl"],
    situation: (flags) =>
      "Eleven battles on the Isonzo have brought the army to the end of what it can do on " +
      "that front, and another Italian attack is expected before the winter. The " +
      "Emperor has written to the German Emperor and asked for help: heavy guns, and " +
      "divisions to take over in the east so that Austrian ones can be moved to Italy.\n\n" +
      "Ludendorff says that six to eight German divisions can be spared until the " +
      "winter. They would form a new army, under a German general, with Austro-Hungarian " +
      "divisions in it, and attack at the northern end of the Isonzo front." +
      (flags.xc_caporetto === "refused" ? "\n\nBerlin has already answered that it will send guns and staff officers and no divisions, so what is left to settle is whether the army can do anything on the Isonzo alone." : ""),
    context:
      "An army that asks for help on a front that it has held alone for two years " +
      "is asking the ally to take the front's best success from it.",
    choices: [
      {
        id: "german",
        label: "Ask for German divisions and accept a German-commanded army at Caporetto",
        historical: true,
        advisor: { name: "Arz von Straussenburg", position:
          "The army cannot hold another battle on the Isonzo by itself. A German-led blow is the best chance of keeping the front." },
        impact: { manpower: 1, munitions: 1, will: 1 },
        setFlags: { aok_caporetto: "german" },
        erodes: "cede_sovereignty",
        next: "aok_1917_12_pursuit",
        outcome:
          "A Fourteenth Army is made up of German and Austro-Hungarian divisions, under " +
          "the German general Otto von Below. The offensive opens on 24 October and the " +
          "Italian line at Caporetto breaks. The Italians retreat to the Piave, and the " +
          "Allies send divisions to hold them. The monarchy is saved from the Italian " +
          "armies once more, and has been shown again that it is saved by someone else.",
      },
      {
        id: "defend",
        label: "Stay on the defensive on the Isonzo and ask only for guns",
        advisor: { name: "Boroevic", position:
          "The Isonzo can be held, as it has been before, if the army is given the guns and left to do it." },
        gate: (m) => m.manpower >= -6,
        disabledReason: "The army has not the divisions left to hold a twelfth battle on its own",
        impact: { manpower: -2, munitions: -1, will: -1 },
        setFlags: { aok_caporetto: "defend" },
        next: "aok_1917_12_pursuit",
        outcome:
          "Speculative. The Germans send guns and staff officers and no divisions, and the " +
          "army meets the next Italian attack on the Isonzo with what it has. The line " +
          "holds or it does not, on the strength of troops who have been defending it " +
          "since 1915. Whatever happens, the Emperor has not asked again for the help that " +
          "the monarchy needed.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-11
  aok_1917_12_pursuit: {
    year: 1917, date: "1917-11-10", city: "Baden",
    title: "The Line Is the Piave",
    advisors: ["arz", "boroevic", "karl"],
    situation:
      "By 10 November the Italians have made a stand on the Piave and on Monte Grappa. " +
      "Since 24 October the armies have advanced more than a hundred kilometres toward " +
      "Venice, some units twenty-five kilometres on the first day.\n\n" +
      "The supply lines are stretched to breaking, and the troops are tired and " +
      "short of food; the Germans who made the breakthrough have the same trouble. " +
      "The question for the Emperor's staff is whether the line that has been reached " +
      "is the line to hold.",
    context:
      "An army that stops lets the enemy dig in and rebuild. An army that goes on " +
      "has to do it from the end of a railway that cannot carry what it needs, " +
      "against an enemy that is now fighting on its own ground.",
    choices: [
      {
        id: "push",
        label: "Mount one more push over the Piave and on Monte Grappa",
        historical: true,
        advisor: { name: "Boroevic", position:
          "The enemy is beaten and has not yet dug in. A pause now gives him the weeks he needs, and a line that is not pushed will have to be fought for later." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        setFlags: { aok_pursuit: "push" },
        next: "aok_1918_14_ukraine",
        outcome:
          "The last push runs from 15 November to 23 December and is repelled at the " +
          "First Battle of Monte Grappa, which secures the Italian positions south of " +
          "the Piave. Cadorna has been replaced by Diaz, and the Italian army, much " +
          "reduced, is rebuilt behind the river. The front, from here to the end, is " +
          "on the Piave.",
      },
      {
        id: "halt",
        label: "Halt on the line already won and dig in for the winter",
        advisor: { name: "Arz", position:
          "The army has been three weeks on the road, with its supply a hundred kilometres behind it. What it has won is worth holding, and it is not worth spending it to win a little more." },
        gate: (m) => m.will >= -4,
        disabledReason: "The Emperor will not hear of stopping while the Italians are in flight",
        impact: { manpower: 1, munitions: 1, will: 0 },
        setFlags: { aok_pursuit: "halted" },
        next: "aok_1918_14_ukraine",
        outcome:
          "Speculative. The armies halt on the line they have reached and the engineers " +
          "come forward with the railway. The winter is spent on ground that was " +
          "Italian a month ago, with the Italians using the same weeks to rebuild what " +
          "they lost. The army has not been spent on the last push, and it has not " +
          "taken the last ground either, and what it will be asked to do in the " +
          "summer is the same thing.",
      },
    ],
  },


  // ---------------------------------------------------------------- 1918-02
  aok_1918_14_ukraine: {
    year: 1918, date: "1918-02-12", city: "Baden",
    title: "Grain From the East",
    advisors: ["arz", "karl", "czernin"],
    situation:
      "On 9 February the Central Powers signed a treaty with the Ukrainian People's " +
      "Republic, and the Rada has invited German and Austro-Hungarian troops into " +
      "Ukraine. The Central Powers have accepted, to secure food supplies for their " +
      "armies and their populations.\n\n" +
      "The monarchy is short of food. The divisions that would go east are " +
      "divisions that are not on the Italian front, where an offensive is " +
      "wanted for the summer.",
    context:
      "The grain is in Ukraine and will be taken by somebody. A German occupation " +
      "alone takes what the Germans need first. An Austro-Hungarian army in " +
      "the country has a claim to some, and it is paid for in divisions.",
    choices: [
      {
        id: "occupy",
        label: "Send Austro-Hungarian divisions into Ukraine to secure the grain",
        historical: true,
        advisor: { name: "Czernin", position:
          "The peace with Ukraine was made for bread. If the monarchy is not in the country when the grain is taken, then the Germans will have it and the towns will go without." },
        impact: { manpower: 0, munitions: 1, will: 1 },
        setFlags: { aok_ukraine: "occupied" },
        next: "aok_1918_12_piave",
        outcome:
          "Austro-Hungarian troops go into Ukraine in the weeks that follow, and on " +
          "13 March, with Ukrainian troops, they secure Odessa. The occupation is " +
          "meant to secure food supplies for the armies and the populations, and " +
          "the divisions that make it are not available for any other front. " +
          "The army that goes east is the monarchy's own, and it goes for the grain.",
      },
      {
        id: "keep",
        label: "Keep the divisions for the Italian front and leave Ukraine to the Germans",
        advisor: { name: "Arz", position:
          "The summer offensive is the army's last chance to end the war in the south, and it needs every division it has. The bread has to come by another road." },
        gate: (m) => m.manpower >= -4,
        disabledReason: "The towns cannot be told that the army will not go for the grain",
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { aok_ukraine: "kept" },
        next: "aok_1918_12_piave",
        outcome:
          "Speculative. The divisions stay on the Italian side and the occupation of " +
          "Ukraine is a German affair, with the Germans taking the first share of the " +
          "grain. The towns of the monarchy have what the Germans send, and the " +
          "army has the divisions the offensive needs. " +
          "The summer comes with the army larger and the cities colder and " +
          "hungrier than they might have been.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-05
  aok_1918_12_piave: {
    year: 1918, date: "1918-05-20", city: "Baden",
    title: "Two Thrusts, Two Generals",
    advisors: ["arz", "boroevic", "karl"],
    bulletin: {
      voice: "aok", date: "1918-05-18", source: "Communique of the General Staff",
      text:
        "On the Italian front there is nothing of importance to report. The troops are " +
        "being rested and supplied. Our allies are making good progress in France.",
    },
    situation: (flags) =>
      "Karl approved the plan for a final offensive against Italy after a meeting at " +
      "Bolzano in February, and Ludendorff strongly recommended it, hoping to draw " +
      "Allied troops from France. " +
      (flags.aok_caporetto === "german"
        ? "The army has the memory of Caporetto to go on, and the Germans have taken their divisions away again."
        : "The army has the memory of eleven defensive battles and no victory to go on.") +
      "\n\nConrad, commanding in the Tyrol, wants to attack from the mountains toward Asiago and " +
      "Vicenza. Boroevic, on the Piave, wants to attack across the river. Each says " +
      "his is the right way. They cannot be reconciled, and the army has one army's " +
      "worth of reserves.",
    context:
      "An offensive on two fronts with half the force on each is two attacks that " +
      "may be too weak. One that goes on a single axis means one of the two commanders " +
      "has been refused.",
    choices: [
      {
        id: "divide",
        label: "Give each commander his own thrust and divide the forces equally",
        historical: true,
        advisor: { name: "Arz von Straussenburg", position:
          "The Emperor and I cannot choose between the two plans. Each will have what he asks for." },
        impact: { manpower: -3, munitions: -2, will: -2 },
        setFlags: { aok_piave: "divided" },
        dispute:
          "Whether a concentrated attack would have succeeded is argued. The Italian command " +
          "had been warned of the exact day and was ready, which suggests that any plan " +
          "would have failed. Others hold that the division of the forces between two " +
          "unrelated thrusts made certain what was only likely, and that Arz's attempt " +
          "to satisfy two strong personalities was the cause.",
        uncertain: [
          { weight: 70, title: "Both thrusts fail and the army loses its last strength", historicalBranch: true,
            impact: { manpower: -1, will: -1 },
            setFlags: { aok_piaveResult: "failed" },
            next: "aok_1918_13_vittorio",
            outcome:
              "The offensive opens at 3 a.m. on 15 June. The Italian commander, forewarned of " +
              "the day, opens his bombardment at 2.30 on the crowded trenches. The army loses " +
              "118,042 men, of whom 11,643 are killed, against Italian losses of 87,181. The " +
              "Emperor orders the retreat on 20 June, and by the 23rd the Italians have " +
              "recovered all they lost. Arz offers his resignation and is refused, and " +
              "Conrad is dismissed on 15 July." },
          { weight: 30, title: "One thrust gets across the river and holds a bridgehead",
            impact: { manpower: 1 },
            setFlags: { aok_piaveResult: "bridgehead" },
            next: "aok_1918_13_vittorio",
            outcome:
              "Speculative. One of the two attacks gets over the river in strength and holds a " +
              "bridgehead for some weeks before it is thrown back. The losses are heavy and " +
              "smaller than they were, and the army has something to show for them. It is " +
              "not enough to change the war, and it is enough to keep the Emperor's " +
              "government from asking at once for terms." },
        ],
      },
      {
        id: "concentrate",
        label: "Choose one thrust, and concentrate every available division on it",
        advisor: { name: "Boroevic", position:
          "Only one plan can be carried out with the army that is left. The Piave is the place, and the whole army should be put into it." },
        gate: (m) => m.manpower >= -6,
        disabledReason: "The army has not the reserves to hold a concentrated attack and a defensive front at once",
        impact: { manpower: -3, munitions: -2, will: -1 },
        setFlags: { aok_piave: "concentrated" },
        nextIf: (m) => (m.will >= -3 ? "aok_end_piave" : null),
        next: "aok_1918_13_vittorio",
        outcome:
          "Speculative. All the available divisions are put into a single attack, and Conrad's " +
          "army in the mountains is left on the defensive. The Italian command is " +
          "forewarned, and faces one attack and not two. Whether it breaks through, or fails " +
          "in a more concentrated way, is something the record cannot show. One of the two " +
          "commanders has been overruled, and has to be told.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-10
  aok_1918_13_vittorio: {
    year: 1918, date: "1918-10-28", city: "Baden",
    title: "Units That No Longer Obey",
    advisors: ["arz", "boroevic", "karl"],
    situation: (flags) =>
      "On 16 October the Emperor issued a proclamation making the Austrian half of the " +
      "monarchy a federal union, and it was too late to hold anything together. " +
      (flags.aok_piave === "concentrated"
        ? "The army made one great attack in June and is weaker than it would have been."
        : "The army lost the June offensive and has never recovered.") +
      "\n\nThe Italians attacked on 24 October, the anniversary of Caporetto, and the " +
      "units of the army are refusing orders, one nationality after another. Boroevic's " +
      "counter-attack on the 27th failed because his troops would not obey. " +
      "The Chief of the General Staff has to say what the army is to do.",
    context:
      "An army that cannot be ordered to attack can still be ordered to retire. One " +
      "that cannot be ordered to do either is asking for terms in the only way it " +
      "can, by dissolving.",
    choices: [
      {
        id: "armistice",
        label: "Order the general retreat and ask for an armistice at once",
        historical: true,
        advisor: { name: "Arz von Straussenburg", position:
          "The army can no longer be made to fight. The only thing left to do is to bring it out in order and to ask for terms." },
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { aok_vittorio: "armistice" },
        nextIf: (m, flags) =>
          m.will <= -9 ? "aok_end_dissolution"
          : flags.aok_serbia === "galicia" ? "aok_end_galiciafirst"
          : flags.aok_piave === "concentrated" ? "aok_end_piave"
          : flags.aok_sixtus === "separate" ? "aok_end_separate"
          : null,
        next: "aok_end_dissolution",
        outcome:
          "The high command orders a general retreat on 28 October and asks the Italians for " +
          "an armistice. The armistice of Villa Giusti is signed on 3 November at 3.20 in " +
          "the afternoon, to take effect twenty-four hours later, after the Italian general " +
          "refuses to stop the fighting at once. The Italians take some 448,000 prisoners, " +
          "about a third of the army, with 24 generals. Arz resigns on 3 November.",
      },
      {
        id: "german",
        label: "Ask the German command to take over the front and fight on with the troops that will still obey",
        advisor: { name: "Karl I", position:
          "The army is the one thing left that the monarchy has. If the Germans can hold the line with it, it should be held." },
        gate: (m) => m.will >= -6,
        disabledReason: "There is no German reserve left to take over a front, and the army will not wait for one",
        impact: { manpower: -2, munitions: 0, will: 1 },
        setFlags: { aok_vittorio: "german" },
        erodes: "cede_sovereignty",
        nextIf: (m) => (m.manpower >= -6 ? "aok_end_satellite" : null),
        next: "aok_end_dissolution",
        outcome:
          "Speculative. The Emperor asks the German Emperor to take the front, and the " +
          "German command takes over what it can of it. The army's units that will still " +
          "obey are put under German officers, and the rest are sent home. The monarchy " +
          "continues to exist, as a country whose armies are commanded from Berlin and " +
          "whose government is a guest of the alliance.",
      },
    ],
  },

  // ---------------------------------------------------------------- endings
  aok_end_dissolution: {
    year: 1918, date: "1918-11-03", city: "Villa Giusti",
    title: "The Army Goes Home",
    advisors: ["arz"],
    situation:
      "The armistice is signed in a villa near Padua, and the army that signed it is " +
      "no longer an army. The Czechs, the Poles, the South Slavs and the Hungarians have " +
      "gone home as regiments, with their weapons, to the countries that they now " +
      "belong to. What is left is a staff, a number of Austrian German and " +
      "Hungarian regiments in good order, and several hundred thousand prisoners.\n\n" +
      "The monarchy ends as the army did: not with a battle, but because each part of " +
      "it decided it had a better place to be.",
    ending: { family: "dissolution", badge: BADGES.SETTLED },
    epilogue: (flags) =>
      "Serbia and Galicia, 1914: " + (flags.aok_serbia === "galicia" ? "the swing force sent to Galicia first." : "the swing force sent to Serbia first, then recalled.") + "\n" +
      "The offensive into Russian Poland: " + (flags.aok_galicia === "defensive" ? "refused, and the army stood behind the San." : flags.aok_galiciaResult === "checked" ? "launched, and checked before the flank was turned." : "launched, and ended at Lemberg.") + "\n" +
      "Rawa, September 1914: " + (flags.aok_rawa === "brokeoff" ? "the battle broken off and the army drawn back behind the San." : "the decisive blow left to go on, and the retreat to the Dunajec.") + "\n" +
      "Serbia, autumn 1914: " + (flags.aok_kolubara === "declined" ? "the third invasion declined." : "the third invasion made, and Belgrade lost again.") + "\n" +
      "Przemysl, 1915: " + (flags.aok_carpathians === "held" ? "the passes held, and the fortress left to its fate." : "relief pressed through the Carpathian winter.") + "\n" +
      "Przemysl, February 1915: " + (flags.aok_przemyslend === "third" ? "a third relief attempt ordered." : "the fortress told that no more relief would come.") + "\n" +
      "Gorlice: " + (flags.aok_gorlice === "own" ? "an Austro-Hungarian command insisted on." : "a German commander accepted.") + "\n" +
      "Italy: " + (flags.aok_isonzo === "attacked" ? "attacked at once." : "the Isonzo held.") + "\n" +
      "Serbia, September 1915: " + (flags.aok_pless === "own" ? "the attack made under AOK's own orders." : "the attack made under Mackensen.") + "\n" +
      "Montenegro, January 1916: " + (flags.aok_montenegro === "halted" ? "left alone, and the divisions moved north." : "the campaign opened at once.") + "\n" +
      "The Trentino, May 1916: " + (flags.aok_strafe === "cancelled" ? "the offensive cancelled." : "launched, with the Galician divisions taken for it.") + "\n" +
      "June 1916: " + (flags.aok_brusilov === "continued" ? "the offensive in the south kept up." : "the offensive halted and the divisions sent back.") + "\n" +
      "The Supreme War Command: " + (flags.aok_supreme === "refused" ? "refused." : "accepted.") + "\n" +
      "March 1917: " + (flags.aok_sixtus === "separate" ? "the Emperor's wish for peace put to Berlin." : "the Emperor's approach to France kept from the German command.") + "\n" +
      "Caporetto: " + (flags.aok_caporetto === "defend" ? "the Isonzo defended without German divisions." : "a German-commanded army accepted.") + "\n" +
      "November 1917: " + (flags.aok_pursuit === "halted" ? "the armies halted on the line they had won." : "one more push over the Piave and on Monte Grappa.") + "\n" +
      "February 1918: " + (flags.aok_ukraine === "kept" ? "the divisions kept for the Italian front." : "divisions sent into Ukraine for the grain.") + "\n" +
      "June 1918: " + (flags.aok_piave === "concentrated" ? "one thrust, with the whole army." : flags.aok_piaveResult === "bridgehead" ? "two thrusts, one of which held a bridgehead for a time." : "two thrusts, and the forces divided.") + "\n" +
      "October 1918: " + (flags.aok_vittorio === "german" ? "the German command asked to take the front." : "the retreat ordered and an armistice asked for.") + "\n\n" +
      "What actually happened: The armistice of Villa Giusti came into effect on 4 November 1918. The Italians had taken about 448,000 prisoners, a third of the army, and some 5,600 guns. Emperor Karl issued a proclamation on 11 November that recognised the right of the Austrian people to decide the form of the state, without using the word abdication. The monarchy was succeeded by Austria, Hungary, Czechoslovakia and the Kingdom of Serbs, Croats and Slovenes.",
  },

  aok_end_separate: {
    year: 1917, date: "1917-07-15", city: "Vienna",
    title: "Out, Early",
    advisors: ["karl"],
    situation:
      "The Emperor told his ally what he intended, and the ally has to decide what to do " +
      "about it. The German command has the power to occupy the monarchy and does not " +
      "use it. The French and the British, who were not waiting for the offer, have to " +
      "consider whether they believe it, and whether a peace on those terms leaves them " +
      "with an enemy or with an ally.\n\n" +
      "The monarchy has ceased to be a belligerent in all but name.",
    ending: { family: "earlier-separate-peace", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The Emperor's letters to France did not lead to a separate " +
      "peace. What actually happened: the letter of 24 March 1917 was followed by " +
      "meetings and messages through the spring, and nothing was agreed, since the " +
      "French wished for concessions to Italy that Vienna would not make. The " +
      "Austro-Hungarian army went on fighting until October 1918, and in April 1918 " +
      "Clemenceau published the letters, and Czernin resigned. The German command " +
      "never fully trusted Vienna again. The Sixtus affair is one of the few " +
      "episodes of the war in which a counterfactual is not idle: the Emperor did " +
      "try, and the obstacle was the price asked in territory and the ally he could " +
      "not leave. The attempt made the German command wary of Vienna, and the " +
      "Emperor's denial in 1918 damaged his word with both sides.",
  },

  aok_end_satellite: {
    year: 1918, date: "1918-11-03", city: "Baden",
    title: "A Province of the Alliance",
    advisors: ["karl"],
    situation:
      "The German command took over the front, and the army that was left was put " +
      "under German officers, who had no idea of the languages in which their " +
      "soldiers spoke and no time to learn them. The monarchy's governments were " +
      "consulted about the occupation and not asked.\n\n" +
      "It survives, in a form that no one in Vienna imagined in 1914: a state with a " +
      "court, a parliament and a foreign minister, and no army of its own.",
    ending: { family: "survival-as-a-satellite", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The Emperor did not ask the German command to take over the " +
      "Italian front in October 1918. What actually happened: the Germans had no " +
      "reserve to give, and were themselves asking for an armistice by the second " +
      "week of November. The dependence on Germany that had grown since Gorlice in " +
      "May 1915, through the Supreme War Command of September 1916 and the " +
      "German-commanded army at Caporetto, was already complete, and ended with the " +
      "Central Powers' defeat. The monarchy's armies were never formally put under " +
      "German command, but each acceptance of a German commander or a German plan, " +
      "from Mackensen's army in 1915 to the Fourteenth Army in 1917, took something " +
      "from what the Austro-Hungarian General Staff decided for itself. The " +
      "historians who call the monarchy a satellite by 1918 are describing that " +
      "process.",
  },

  aok_end_galiciafirst: {
    year: 1918, date: "1918-11-03", city: "Villa Giusti",
    title: "The Right War First",
    advisors: ["arz"],
    situation:
      "The swing force went to Galicia, and the army that met the Russians in August 1914 " +
      "was stronger by a whole army. The first battles were fought on equal terms, and " +
      "the losses of the autumn were smaller.\n\n" +
      "Serbia was left alone for a year. The monarchy had gone to war to punish her, and " +
      "the war went on without it. In the end the army reached the same armistice by a " +
      "road that cost it less.",
    ending: { family: "galicia-first", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The Second Army was sent to Serbia first, and then recalled. " +
      "What actually happened: the Balkan campaign of August 1914 cost the army " +
      "heavily and gained nothing. The Second Army was recalled to Galicia, where " +
      "it arrived too late for the first battles, and Conrad lost a great part of " +
      "the army's regular strength in the first six months of the war. The " +
      "monarchy's armies were never again as strong as they had been when they " +
      "marched in August. The decision to divide the army in the first month of the " +
      "war, between a punitive campaign in the south and the real war in the north, " +
      "is the one most often called the monarchy's original mistake. It meant that " +
      "neither campaign was fought with the whole army, and it is hard to find a " +
      "historian who defends it.",
  },

  aok_end_piave: {
    year: 1918, date: "1918-11-03", city: "Villa Giusti",
    title: "One Blow",
    advisors: ["boroevic"],
    situation:
      "The army put its whole strength into one attack, and it was a great one. It did " +
      "not break the Italian line, and it was not entirely beaten. It took more of the " +
      "ground, and held it longer than the other had, and the army that was left at the " +
      "end of the summer had still something to hold together.\n\n" +
      "The war ended in November, as it was going to end.",
    ending: { family: "concentrated-offensive", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The offensive of June 1918 was made in two thrusts, and failed. " +
      "What actually happened: the Italian command was forewarned of the day and " +
      "opened its bombardment half an hour before the Austro-Hungarian guns, and " +
      "the army lost 118,042 men, against Italian losses of 87,181. The retreat was " +
      "ordered on 20 June and by the 23rd the Italians had recovered all that they " +
      "had lost. The failure struck, in the words of one account, a major blow to " +
      "the army's morale and cohesion. The offensive of June 1918 was the last the " +
      "monarchy made, and the army that made it had been promised that it would be " +
      "the one that ended the war. The failure was followed by dismissals, by the " +
      "first open refusals of orders among the national units, and by the Emperor's " +
      "attempt, in October, to remodel the state.",
  },

  aok_end_relieved: {
    year: 1918, date: "1918-06-25", city: "Baden",
    title: "The Emperor Changes His Chief",
    advisors: ["karl"],
    situation:
      "There was no single decision that did it. There was a series of agreements to German " +
      "direction, each of which could be defended and each of which was a little less " +
      "of the army's command, until the day came when it was hardly worth the name.\n\n" +
      "The Emperor decides that he needs a Chief of Staff who can say no to the Germans, " +
      "and has none to hand.",
    ending: { family: "hard-mode-relieved", badge: BADGES.CONTESTED, hardModeOnly: true },
    epilogue: () =>
      "What actually happened: Arz remained Chief of the General Staff until 3 " +
      "November 1918, after offering his resignation over the failure of the June " +
      "offensive, which the Emperor refused. Conrad was dismissed on 15 July. The " +
      "Emperor did not find a Chief of Staff who could say no to the Germans, since " +
      "the army's dependence on them was not a matter that a change of Chief could " +
      "undo, and by the end of the war it was the Emperor himself who had no " +
      "command left to give. The Chief of the General Staff had few choices of his " +
      "own by 1918: the Emperor ruled in the army's name, the Germans directed its " +
      "operations, and the army's regiments increasingly answered to the national " +
      "councils at home. Arz's resignation, when it came on 3 November, was a " +
      "matter of form.",
  },
};
