// =============================================================================
// RUSSIAN STAVKA — HISTORICAL SPINE
// =============================================================================
//
// DATES ARE JULIAN (Old Style) to 31 January 1918, per spec §13.1 and the
// campaign's calendar field. Western dates appear in parentheses on first
// mention within a node, never on every mention. Brest-Litovsk is dated New
// Style because Russia changed calendars in February 1918 — the change happens
// inside the campaign and the dates reflect it.
//
// Terminal nodes hand into the situation Dispatches 1922 opens from.
// =============================================================================

CAMPAIGNS.stavka.startNode = "stavka_1914_01_prussia";

CAMPAIGNS.stavka.commanders = [
  { id: "grandduke", name: "Grand Duke Nikolai Nikolaevich", title: "Supreme Commander",
    from: "1914-07-19", to: "1915-08-23" },
  { id: "tsar", name: "Nicholas II", title: "Supreme Commander",
    from: "1915-08-23", to: "1917-03-02" },
  { id: "provisional", name: "the Provisional Government's command", title: "Supreme Command",
    from: "1917-03-02", to: "1918-03-03" },
];

CAMPAIGNS.stavka.advisors = [
  { id: "grandduke", name: "Grand Duke Nikolai Nikolaevich", from: "1914-07-19", to: "1915-09-13",
    dossier: { role: "Supreme Commander, 1914-1915",
      bio: "Held the supreme command under regulations granting extraordinary authority answerable only to the Emperor — which also placed him to absorb all the blame when 1915 went as it did.",
      fate: "Removed in August 1915 and appointed Viceroy of the Caucasus." } },
  { id: "zhilinsky", name: "Zhilinsky", from: "1914-07-19", to: "1914-09-17",
    dossier: { role: "Commander, North-Western Front",
      bio: "Directed the two armies sent into East Prussia and the coordination between them that did not occur.",
      fate: "Removed from the front command in September 1914." } },
  { id: "samsonov", name: "Samsonov", from: "1914-07-19", to: "1914-08-17",
    dossier: { role: "Commander, Second Army",
      bio: "Took the Second Army into East Prussia from the south, out of wireless contact and ahead of its supply.",
      fate: "Died during the destruction of his army in August 1914." } },
  { id: "rennenkampf", name: "Rennenkampf", from: "1914-07-19", to: "1914-11-01",
    dossier: { role: "Commander, First Army",
      bio: "Commanded the northern of the two armies in East Prussia. The failure of the two to combine is the centre of every account of the campaign.",
      fate: "Removed from command in late 1914." } },
  { id: "sukhomlinov", name: "Sukhomlinov", from: "1914-07-19", to: "1915-06-13",
    dossier: { role: "Minister of War to 1915",
      bio: "Presided over the munitions position with which Russia entered the war and the shortage that followed.",
      fate: "Dismissed in June 1915 and later prosecuted." } },
  { id: "polivanov", name: "Polivanov", from: "1915-06-13", to: "1916-03-15",
    dossier: { role: "Minister of War, 1915-1916",
      bio: "Took the war ministry during the retreat and worked with the public bodies and war-industry committees the court distrusted.",
      fate: "Dismissed in March 1916." } },
  { id: "alekseyev", name: "Alekseyev", from: "1915-08-23", to: "1917-09-09",
    dossier: { role: "Chief of Staff at Stavka, 1915-1917; Supreme Commander, March to May 1917",
      bio: "Appointed when the Emperor took the supreme command and given charge of operations; by most accounts the effective commander from that point. Held the supreme command under the Provisional Government from March to May 1917 and returned briefly as Chief of Staff at the end of August.",
      fate: "Went to Novocherkassk in November 1917 and began forming the officer organisation that became the Volunteer Army. Died in 1918." } },
  { id: "dukhonin", name: "Dukhonin", from: "1917-08-30", to: "1917-11-20",
    dossier: { role: "Chief of Staff from September 1917; de facto Supreme Commander after October",
      bio: "Took the command by default when the head of the Provisional Government fled, over an army he had very little control of. Declined the new authority's order to open armistice negotiations on the ground that such an order could only come from a government sustained by the army and the country.",
      fate: "Dismissed by wireless and killed by a mob at Mogilev in November 1917." } },
  { id: "brusilov", name: "Brusilov", from: "1914-07-19", to: "1917-07-19",
    dossier: { role: "Army and front commander; Supreme Commander in 1917",
      bio: "Reported in 1915 that a third of the men in some engagements went into action without rifles and waited for casualties to supply them. Devised the 1916 offensive on the South-Western Front.",
      fate: "Held the supreme command briefly in 1917 and later served the Soviet state." } },
  { id: "ruzsky", name: "Ruzsky", from: "1914-07-19", to: "1917-04-25",
    dossier: { role: "Front commander",
      bio: "Commanded the Northern Front and was present at Pskov in March 1917 when the front commanders were canvassed on the abdication.",
      fate: "Left the army in 1917." } },
  { id: "kerensky", name: "Kerensky", from: "1917-03-02", to: "1917-10-25",
    dossier: { role: "Minister of War, later head of the Provisional Government",
      bio: "Attempted to prosecute the war with an army that had already been told, by decree, that its orders were subject to committee.",
      fate: "Left Russia after October." } },
];

CAMPAIGNS.stavka.bulletinVoice = {
  source: "Communique of the Staff of the Supreme Commander, as carried in the Petrograd press under censorship",
  register: "Formal, devotional in its framing, geographic where it can be and silent where it cannot",
  defined: true,
};

CAMPAIGNS.stavka.hardMode.forcedEndingId = "stavka_end_relieved";
// erosionMax set AFTER measurement for this campaign. See measure-erosion.js.
CAMPAIGNS.stavka.hardMode.erosionMax = 4;

CAMPAIGNS.stavka.nodes = {

  stavka_1914_01_prussia: {
    year: 1914, date: "1914-08-04", city: "Baranovichi",
    title: "Before the Concentration Is Finished",
    advisors: ["grandduke", "zhilinsky", "samsonov"],
    bulletin: {
      voice: "stavka", date: "1914-08-02", source: "Communique of the Staff",
      text:
        "The mobilisation proceeds throughout the Empire in exemplary order. The " +
        "armies of the Supreme Commander stand ready upon the western frontier.",
    },
    situation:
      "The French are asking for an offensive into East Prussia now — today, 4 August " +
      "(17 August in the west) — and the undertaking to make one was given before the " +
      "war, in writing, as the price of the alliance and the loans that built the " +
      "railways this army is riding on.\n\n" +
      "The concentration is not finished. Two armies are to go in either side of the " +
      "Masurian Lakes, which means they cannot support one another until they have " +
      "converged past them, and the wireless discipline between them is not what it " +
      "should be.",
    context:
      "Waiting three weeks produces two armies that can operate together. It also " +
      "means the French fight the opening of the war alone, having been promised they " +
      "would not, and they are not likely to forget which it was.",
    choices: [
      {
        id: "advance",
        label: "Advance now — the undertaking to the French was given",
        historical: true,
        advisor: { name: "Grand Duke Nikolai Nikolaevich", position:
          "The alliance is the reason this army has railways. We will keep the promise and take the consequences of keeping it." },
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { stavka_prussia: "early" },
        next: "stavka_1914_12_tannenberg",
        outcome:
          "Both armies cross the frontier ahead of their supply. The First Army comes " +
          "on from the north-east and the Second from the south, and between them lie " +
          "the lakes and a railway network the enemy can use and they cannot. The " +
          "French are told that the promise has been kept, and it has, to the letter. " +
          "The cost of keeping it will be counted in the first fortnight, by two armies " +
          "that cannot reach each other.",
      },
      {
        id: "concentrate",
        label: "Complete the concentration first",
        advisor: { name: "Zhilinsky", position:
          "Two armies that cannot reach each other are not a front. They are two opportunities offered separately." },
        gate: (m) => m.will >= 0,
        disabledReason: "The undertaking to the French cannot be broken in the first fortnight of the war",
        impact: { manpower: 2, munitions: 0, will: -3 },
        setFlags: { stavka_prussia: "concentrated" },
        next: "stavka_1914_12_tannenberg",
        outcome:
          "Speculative. The advance waits for the armies to be ready to make it " +
          "together. The instrument is better and the alliance is worse, and the second " +
          "of those will be raised at every conference for the rest of the war. The " +
          "French, who were promised an offensive in the first fortnight, fight the " +
          "opening battles with the Germans' whole attention on them, and they are told " +
          "by their ally that the army is not yet ready.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-08
  stavka_1914_12_tannenberg: {
    year: 1914, date: "1914-08-08", city: "Baranovichi",
    title: "The Second Army Is Marching Away From Its Bread",
    advisors: ["grandduke", "zhilinsky", "samsonov"],
    situation: (flags) =>
      "The First Army crossed the frontier on the 4th. The Second, coming up from the " +
      "south, is going in today, 8 August (21 August in the west). " +
      (flags.stavka_prussia === "concentrated"
        ? "The concentration was finished before the advance, and the Second Army has more behind it than it would have had."
        : "It went in before its concentration was finished and before its supply could follow.") +
      "\n\nGeneral Zhilinsky, who commands both armies from the North-Western Front, wants " +
      "the German Eighth Army pressed hard after the first battle at Gumbinnen and is " +
      "not satisfied with the pace. The corps commanders of the Second Army complain " +
      "that they are marching away from their railheads and their bread. The two armies " +
      "are too far apart to help each other, and the wireless messages that pass between " +
      "them are sent in clear.",
    context:
      "The question put to this headquarters is whether to let the orders of the front " +
      "commander stand. Nothing in the situation will be clearer in a week than it is today.",
    choices: [
      {
        id: "press",
        label: "Leave Zhilinsky's orders in force: both armies press on",
        historical: true,
        advisor: { name: "Zhilinsky", position:
          "The enemy is going back and has to be kept going. Stopping to bring up supply gives him time to turn." },
        impact: { manpower: 0, munitions: -1, will: 0 },
        setFlags: { stavka_tannenberg: "pressed" },
        next: "stavka_1914_02_galicia",
        outcome:
          "The Second Army goes on north. Between 13 and 17 August (26 and 30 August in " +
          "the west) the German Eighth Army surrounds it and almost destroys it, and " +
          "General Samsonov shoots himself. The First Army, which could not help, is " +
          "turned back a fortnight later. The invasion of East Prussia, begun to keep a " +
          "promise to the French, ends with the Second Army gone.",
      },
      {
        id: "halt",
        label: "Halt the Second Army at the frontier until its supply and the First Army come up",
        gate: (m) => m.will >= -1,
        disabledReason: "A halt in the first week of the invasion cannot be explained to the French",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { stavka_tannenberg: "halted" },
        next: "stavka_1914_02_galicia",
        outcome:
          "Speculative. The Second Army stops where it is and the invasion loses a " +
          "week. The German Eighth Army has that week to decide what to do about two " +
          "Russian armies that have stopped, and the French have been told by their " +
          "ally that the offensive they asked for is not coming at the pace promised. " +
          "The army gets its bread and its wireless sorted out, and it pays for both " +
          "with the time that was the whole purpose of the invasion.",
      },
    ],
  },

  stavka_1914_02_galicia: {
    year: 1914, date: "1914-08-25", city: "Lvov",
    title: "Two Fronts of Our Own",
    advisors: ["grandduke", "brusilov", "rennenkampf"],
    bulletin: {
      voice: "stavka", date: "1914-08-23", source: "Communique of the Staff",
      text:
        "Upon the South-Western Front our troops have carried the enemy positions and " +
        "advance upon Lemberg. In the Prussian theatre operations continue. The Staff " +
        "does not consider it useful to particularise.",
    },
    situation: (flags) =>
      (flags.stavka_prussia === "early"
        ? "East Prussia has gone as it was always liable to go. The Second Army was " +
          "surrounded and destroyed in the country south of the lakes and its commander " +
          "is dead. "
        : "East Prussia was entered late and in order, and the Germans were ready. ") +
      "Against that, Galicia is going extremely well: the Austrians are being pushed " +
      "out of Lemberg and back toward the Carpathians, and the front there is the one " +
      "place in this war where the Russian army is beating somebody.\n\n" +
      "Reinforcing success in Galicia means accepting that East Prussia stays a " +
      "German victory. Renewing in the north means taking the better front's divisions " +
      "to repair the worse one.",
    context:
      "Austria-Hungary can be beaten and Germany, on present evidence, cannot. That is " +
      "an argument for Galicia and it is also an argument for a war that never touches " +
      "the enemy who matters.",
    choices: [
      {
        id: "galicia",
        label: "Reinforce Galicia and press the Austrians",
        historical: true,
        advisor: { name: "Brusilov", position:
          "The Austrians will break where the Germans will not. That is not a reason to stop pushing the Austrians." },
        impact: { manpower: -1, munitions: -2, will: 2 },
        setFlags: { stavka_1914theatre: "galicia" },
        next: "stavka_1914_03_przemysl",
        outcome:
          "The South-Western Front takes Lemberg and drives toward the passes. It is " +
          "the largest Russian success of the war so far and it is against the wrong " +
          "empire, and everyone in this building knows it. The Austrian army has been " +
          "beaten and thrown back, and the prisoners and the captured guns are real. " +
          "The Germans, who are the enemy that matters, are fighting in the north on a " +
          "front that no one has reinforced.",
      },
      {
        id: "prussia",
        label: "Renew the effort in East Prussia with divisions from the south",
        advisor: { name: "Rennenkampf", position:
          "A defeat that is not answered becomes a permanent fact. We have one front where the enemy expects nothing further from us." },
        gate: (m) => m.manpower >= 0,
        disabledReason: "The northern armies cannot absorb reinforcement at this strength",
        impact: { manpower: -2, munitions: -2, will: 0 },
        setFlags: { stavka_1914theatre: "prussia" },
        next: "stavka_1914_03_przemysl",
        outcome:
          "Speculative. Divisions go north from a front that was winning to a front " +
          "that was not. The Austrians get the winter to recover in and the Germans get " +
          "a second opportunity on ground they have already fought over. The army that " +
          "was driving toward the passes is told to stop, and the army that was beaten " +
          "in East Prussia is given the divisions it asked for, with an enemy in front " +
          "of it that has just destroyed one Russian army and is looking for another.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-10
  stavka_1914_03_przemysl: {
    year: 1914, date: "1914-10-28", city: "Baranovichi",
    title: "The Fortress Behind Our Lines",
    advisors: ["grandduke", "brusilov"],
    situation: (flags) =>
      "On 28 October (10 November in the west) the Austro-Hungarian fortress of Przemysl " +
      "is cut off again, with a garrison of about 120,000 men inside it. The first siege " +
      "was lifted when the relieving army came up, and the assault the Third Army ordered " +
      "before that, after a short bombardment, got nowhere and cost some forty thousand men in " +
      "three days.\n\n" +
      "The fortress sits on the main railway between Lvov and Cracow, and the Austrians " +
      "will try to relieve it again. The guns that could reduce it quickly are not here, " +
      "and the army that would storm it is the army that is needed to hold the line " +
      "outside." +
      (flags.xc_kolubara === "declined" ? "\n\nRussian intelligence reports that the Austro-Hungarian divisions meant for a third invasion of Serbia have been kept in Galicia, and that the relief of the fortress will be made in more strength than it would otherwise have been." : ""),
    context:
      "A fortress that is starved costs the besiegers an army and a winter. A fortress " +
      "that is stormed costs them men, and the first attempt showed what that price " +
      "is. Neither is free, and the garrison inside will eat the winter's stores " +
      "while the choice is argued.",
    choices: [
      {
        id: "invest",
        label: "Invest the fortress and starve it out, with no frontal assaults",
        historical: true,
        advisor: { name: "Brusilov", position:
          "Men are not shells. Without the guns to break the forts, an assault is only a way of spending the army, and the garrison cannot eat what it does not have." },
        impact: { manpower: 0, munitions: -1, will: 0 },
        setFlags: { stavka_przemysl: "invested" },
        next: "stavka_1914_04_lodz",
        outcome:
          "The Eleventh Army settles round the fortress and does not attack it. The " +
          "garrison eats through its stores over the winter, the relief attempts through " +
          "the Carpathians fail in the snow, and the commandant surrenders on 9 March " +
          "(22 March in the west) with well over a hundred thousand men. It is slow, and " +
          "it keeps an army tied to the place for the whole winter, but it spends no " +
          "more men on the forts than the first assault did.",
      },
      {
        id: "storm",
        label: "Take it by assault before the Austrians can come back",
        advisor: { name: "Grand Duke Nikolai Nikolaevich", position:
          "A hundred and twenty thousand men are inside it and the railway to Cracow runs past its walls. The fortress has to be taken, and the sooner the better." },
        gate: (m) => m.manpower >= -4,
        disabledReason: "There are not the men to spare for a second assault on the forts",
        impact: { manpower: -1, munitions: 0, will: 1 },
        setFlags: { stavka_przemysl: "stormed" },
        next: "stavka_1914_04_lodz",
        outcome:
          "Speculative. The assault goes in before the relieving army is back and before " +
          "the guns are, on the same forts that stopped the first one. Some of the " +
          "outer works fall and the rest do not, and the casualty lists that come back " +
          "are the ones the earlier assault produced, with the added knowledge that " +
          "this was known. The fortress holds into the winter all the same, and the " +
          "army that stormed it is smaller when the Austrians return.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-11
  stavka_1914_04_lodz: {
    year: 1914, date: "1914-11-03", city: "Baranovichi",
    title: "An Army Turned North",
    advisors: ["grandduke", "ruzsky"],
    bulletin: {
      voice: "stavka", date: "1914-11-01", source: "Communique of the Staff",
      text:
        "Our troops continue their advance on the left bank of the Vistula. In the " +
        "region of Wloclawek the enemy has been in contact with our forces.",
    },
    situation:
      "On 3 November (16 November in the west) the offensive into Silesia is two days " +
      "old. Ruzsky's armies, the Second, Fifth and Fourth, are to cross the German " +
      "frontier, and the Grand Duke has approved the plan.\n\n" +
      "Meanwhile the German Ninth Army has been moved by rail to the Thorn area and has " +
      "struck the right flank of the Russian line, in the neighbourhood of Wloclawek " +
      "and Kutno. It is aimed at the city of Lodz, at cutting it off from Warsaw and " +
      "surrounding the troops in it. The Fifth Army, under Plehve, is the one that can " +
      "meet it, and it is facing the wrong way.",
    context:
      "Turning the Fifth Army north gives up the invasion of Silesia on the day it " +
      "begins, and it asks a hundred kilometres of marching of men who are not " +
      "expecting it. Going on into Silesia leaves the Second Army to meet a German " +
      "army with what it has.",
    choices: [
      {
        id: "turn",
        label: "Turn the Fifth Army north against the German thrust and give up the Silesian offensive",
        historical: true,
        advisor: { name: "Grand Duke Nikolai Nikolaevich", position:
          "The German army is on our flank and Lodz is the point. Silesia can wait until the flank is safe, and the Fifth Army is the only one near enough to make it safe." },
        dispute:
          "Lodz is read two ways. On the field the Russian armies avoided the " +
          "encirclement that was intended for them and a German corps was surrounded " +
          "and broke out; the Russians kept the city until they chose to leave it and " +
          "fell back to the Bzura only at the end of November. At the level of the " +
          "campaign the invasion of Germany was stopped and Russia never again came so " +
          "close to German soil. Both are true, and the weight given to either decides " +
          "whether the battle is called a Russian victory or a German one.",
        uncertain: [
          { weight: 60, title: "The army escapes and the offensive is lost", historicalBranch: true,
            impact: { manpower: -1, munitions: 0, will: 0 },
            setFlags: { stavka_lodzResult: "escaped" },
            next: "stavka_1915_01_masuria",
            outcome:
              "The Fifth Army covers some hundred and sixteen kilometres in two days and " +
              "strikes the German flank. The Germans are not able to close the ring " +
              "round Lodz, and one of their own corps is nearly surrounded and " +
              "breaks out. At the end of November the Russian line falls back to the " +
              "Bzura and the Rawka. The Silesian offensive is not made, and the winter " +
              "will be spent on the defensive. The army has kept itself and lost its chance." },
          { weight: 40, title: "The flank is covered and the offensive is only delayed",
            impact: { manpower: 0, munitions: 0, will: 1 },
            setFlags: { stavka_lodzResult: "covered" },
            next: "stavka_1915_01_masuria",
            outcome:
              "Speculative. The Fifth Army reaches the flank in time to turn the " +
              "German attack back instead of only absorbing it, and the Second Army is " +
              "not made to give ground. The Silesian offensive is put off for a few weeks " +
              "and not abandoned, and the two armies that were to make it are still in " +
              "being when the winter closes the roads. Whether it can then be made at " +
              "all is a different question, and nothing in the autumn answers it." },
        ],
      },
      {
        id: "silesia",
        label: "Press on into Silesia and let the Second Army hold Lodz with what it has",
        advisor: { name: "Ruzsky", position:
          "The way to answer a blow at our flank is to be in Germany before it lands. The plan was to cross the frontier, and the army that crosses it is the one the enemy has to answer." },
        gate: (m) => m.will >= -3,
        disabledReason: "Nobody at headquarters will answer for leaving the flank open",
        impact: { manpower: -1, munitions: -1, will: 2 },
        setFlags: { stavka_lodz: "silesia" },
        next: "stavka_1915_01_masuria",
        outcome:
          "Speculative. The Fifth Army crosses the frontier and the Second is left to meet " +
          "the German Ninth Army alone at Lodz. It is a gamble on the two armies " +
          "passing in the night, and the Germans, who had expected the Russians to " +
          "turn, have to decide what to do. A Russian army on German soil is something " +
          "the war has not seen, and whether it can stay there is " +
          "something the war does not get to find out.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-01
  stavka_1915_01_masuria: {
    year: 1915, date: "1915-01-24", city: "Baranovichi",
    title: "A Warning From the Tenth Army",
    advisors: ["grandduke", "ruzsky"],
    situation:
      "On 24 January (6 February in the west) the commander of the Tenth Army, " +
      "Sievers, has warned the Northwest Front that an attack is coming. His army " +
      "holds a long line on the East Prussian border, with the Twentieth Corps in the " +
      "forests round Augustow, and it could be drawn back to the Niemen.\n\n" +
      "The front commander, Ruzsky, is not persuaded. The border line is the anchor of " +
      "the whole position in East Prussia, and Plehve's Twelfth Army is assembling " +
      "a hundred kilometres to the south-west to take the offensive in its turn.",
    context:
      "Giving up the border gives up the anchor that Stavka has been planning " +
      "round, and gives it up on a warning. Holding it risks the army that holds " +
      "it, in forest, in winter, and a long way from the nearest road that would " +
      "carry it out.",
    choices: [
      {
        id: "hold",
        label: "Hold the border line and trust the front commander's judgment",
        historical: true,
        advisor: { name: "Ruzsky", position:
          "The border is the line the plan is built on. A warning is not an attack, and an army that retreats on every one has no line at all." },
        impact: { manpower: -1, munitions: -1, will: -1 },
        setFlags: { stavka_masuria: "held" },
        next: "stavka_1915_12_carpathians",
        outcome:
          "On 25 January (7 February in the west) the Germans attack in a snowstorm and " +
          "within ten days have outflanked the Tenth Army and driven it out of East " +
          "Prussia. The Twentieth Corps is cut off in the forest near Augustow and " +
          "surrenders on 9 February (22 February in the west), with its losses put at " +
          "some 34,000 men. Much of the Tenth Army gets away. The quartermaster-general " +
          "afterwards calls it a great German success: it cost Russia the anchor it had " +
          "planned around.",
      },
      {
        id: "pull",
        label: "Draw the Tenth Army back to the Niemen before the blow falls",
        advisor: { name: "Grand Duke Nikolai Nikolaevich", position:
          "If the Tenth Army says it is going to be struck, then it should not be where the blow will fall. A line can be taken again and a corps cannot." },
        gate: (m) => m.will >= -2,
        disabledReason: "Giving up the border on a subordinate's warning is not something the front commander will accept",
        impact: { manpower: 0, munitions: 1, will: -1 },
        setFlags: { stavka_masuria: "pulled" },
        next: "stavka_1915_12_carpathians",
        outcome:
          "Speculative. The Tenth Army falls back toward the Niemen before the blow, and " +
          "the Germans, when they attack, find less to surround. The " +
          "Twentieth Corps is out of the forest and in the line, and the border that " +
          "was to be the anchor of the position is given up without a battle. It " +
          "is a retreat made on a subordinate's warning, which is what the front " +
          "commander said it would be.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-03
  stavka_1915_12_carpathians: {
    year: 1915, date: "1915-03-09", city: "Baranovichi",
    title: "Przemysl Has Fallen",
    advisors: ["grandduke", "brusilov"],
    situation: (flags) =>
      "Przemysl has fallen today, 9 March (22 March in the west), after a siege that " +
      "began in September. About 117,000 men and nine generals are taken. " +
      (flags.stavka_1914theatre === "prussia"
        ? "Divisions were taken from the south in the autumn for the northern effort, and the Carpathian armies are thinner than they would have been."
        : "Galicia was reinforced in the autumn, and the Carpathian armies are as strong as they have been.") +
      "\n\nThrough the winter the Austrian armies have been trying to relieve the fortress " +
      "across the mountains, and the Russian armies have been fighting them in the " +
      "Carpathian passes. The cost of it to the Austro-Hungarian army alone is put " +
      "at about 800,000 men between January and April, and most of the loss is to " +
      "weather and disease. The Russian armies' own losses are nearly as high, and " +
      "easier to make good.\n\n" +
      "The question for Stavka is what the armies in the mountains are to do now that " +
      "the fortress they were covering is gone.",
    context:
      "A crossing of the Carpathians would put Russian armies on the Hungarian plain. " +
      "It would also stretch a line that is short of shells and short of rifles, over " +
      "passes that are blocked with snow.",
    choices: [
      {
        id: "press",
        label: "Press on over the Carpathians into Hungary",
        historical: true,
        impact: { manpower: 0, munitions: -1, will: 2 },
        setFlags: { stavka_carpathians: "pressed" },
        next: "stavka_1915_03_retreat",
        outcome:
          "The armies in the mountains go on through the spring, with the passes full of " +
          "snow and the guns short of shells. The Austro-Hungarian army loses about " +
          "800,000 men in the Carpathians between January and April, and Russian losses " +
          "are nearly as high. The ground gained there is not held for long: the German " +
          "attack in May turns the whole of it.",
      },
      {
        id: "halt",
        label: "Halt in the passes and use the spring to refit",
        impact: { manpower: 1, munitions: 1, will: -1 },
        setFlags: { stavka_carpathians: "halted" },
        next: "stavka_1915_03_retreat",
        outcome:
          "Speculative. The armies hold the passes they have and stop attacking. The " +
          "rifles and shells that would have been spent in the snow are kept, and the " +
          "Austrians have the spring to recover. Przemysl has been taken and nothing " +
          "more is asked of it. The army is less tired when the German blow comes in " +
          "May, and no one will be able to say whether it would have held, because the " +
          "shells it saved would not have been enough.",
      },
    ],
  },

  stavka_1915_03_retreat: {
    year: 1915, date: "1915-04-19", city: "Gorlice",
    title: "A Third of the Men Have No Rifle",
    advisors: ["grandduke", "sukhomlinov", "brusilov"],
    bulletin: {
      voice: "stavka", date: "1915-04-17", source: "Communique of the Staff",
      text:
        "In the Carpathian region our troops maintain their positions. Enemy attacks " +
        "in the Gorlice sector have been met. The Supreme Commander has every " +
        "confidence in the valour of the army.",
    },
    situation:
      "The breakthrough at Gorlice-Tarnow is being made with an artillery weight this " +
      "army cannot answer, and it cannot answer it because the shells are not there. " +
      "Brusilov reports men going into action without rifles, waiting for casualties " +
      "among their comrades to supply them.\n\n" +
      "The line in Poland is a salient and holding it is a decision to lose armies in " +
      "it. Giving it up means giving up Warsaw and a great deal of the Empire's western " +
      "territory, and saying so to a court that regards territory as the thing being " +
      "defended.",
    context:
      "The war ministry that presided over the munitions position is still in office. " +
      "The public bodies and war-industry committees offering to fix it are exactly the " +
      "organisations the court most distrusts, because organising anything creates " +
      "people who have organised something.",
    choices: [
      {
        id: "withdraw",
        label: "Give up the Polish salient — trade space for the army",
        historical: true,
        advisor: { name: "Brusilov", position:
          "We can replace ground. We are, at this moment, unable to replace rifles." },
        impact: { manpower: -2, munitions: -2, will: -3 },
        setFlags: { stavka_1915: "withdrew" },
        next: "stavka_1915_04_command",
        outcome:
          "The Great Retreat gives up Poland, Lithuania and much of the western " +
          "provinces and keeps the army in being. It is the correct decision and it " +
          "looks, from Petrograd, exactly like losing the war. The armies fall back " +
          "through the summer, burning what they cannot carry, with the population " +
          "moving east in front of them. By the autumn the front has shortened and the " +
          "army has survived, and the Emperor has found someone to blame for the loss.",
      },
      {
        id: "hold",
        label: "Hold the salient — the western provinces are the Empire",
        advisor: { name: "Sukhomlinov", position:
          "An empire that withdraws from its own territory in the first year explains that to its subjects for the rest of the war." },
        gate: (m) => m.munitions >= -2,
        disabledReason: "The salient cannot be held without shells that do not exist",
        impact: { manpower: -4, munitions: -1, will: 1 },
        setFlags: { stavka_1915: "held" },
        erodes: "expose_regime",
        next: "stavka_1915_04_command",
        outcome:
          "Speculative. The salient is held for as long as it can be and the armies in " +
          "it are consumed doing it. The map in Petrograd looks better for some months " +
          "and the army behind the map does not. The shell shortage that a retreat " +
          "would have escaped is met in front of the guns, and the divisions that are " +
          "lost in the salient are the ones that would have been the army's reserve in " +
          "the autumn. The Germans are left to choose their moment.",
      },
    ],
  },

  stavka_1915_04_command: {
    year: 1915, date: "1915-08-23", city: "Mogilev",
    title: "The Emperor Takes the Command",
    advisors: ["grandduke", "alekseyev", "polivanov"],
    bulletin: {
      voice: "stavka", date: "1915-08-21", source: "Communique of the Staff",
      text:
        "His Imperial Majesty has been pleased to visit the Staff of the Supreme " +
        "Commander. The armies continue to occupy the positions assigned to them.",
    },
    situation:
      "On 23 August (5 September in the west) the Emperor assumes the supreme command " +
      "in person, and the Grand Duke goes to the Caucasus.\n\n" +
      "The Council of Ministers has protested nearly to a man and been overruled, and " +
      "several of them will shortly be dismissed for it. The case against is simple: " +
      "the Emperor has no experience of war, and from this day forward every reverse " +
      "at the front is a reverse belonging personally to the throne rather than to a " +
      "commander who can be replaced.\n\n" +
      "The case for is not nothing. The Grand Duke's authority was extraordinary and " +
      "answerable to nobody except the Emperor. Civil and military authority in the " +
      "border regions have not been coordinated at all.",
    context:
      "Whoever holds the title, Alekseyev will run the operations. What actually " +
      "changes with this decision is not where orders come from. It is where blame " +
      "goes, and what happens in the capital while the Emperor is four hundred miles " +
      "away at headquarters.",
    choices: [
      {
        id: "assume",
        label: "The Emperor assumes the command",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "I will conduct the operations. His Majesty's presence at headquarters is a question about the throne, not about the front." },
        impact: { manpower: 0, munitions: 1, will: -2 },
        setFlags: { stavka_command: "tsar" },
        erodes: "expose_regime",
        dispute:
          "The standard verdict is that this was ruinous: it bound the dynasty to " +
          "every military failure and left the capital to the Empress and to Rasputin's " +
          "nominees, with ministers replaced in rapid succession and the court widely " +
          "suspected of treachery. A revisionist line holds that the operational effect " +
          "was slight — Alekseyev ran the front and there is little sign the Emperor " +
          "imposed strategy on him — and that the real causes of collapse lie in " +
          "industrial and administrative weakness that predated 1915. Historians " +
          "continue to divide on how much of the monarchy's fall to assign to the " +
          "autocratic system, to wartime dislocation, and to this man's personality.",
        uncertain: [
          { weight: 60, title: "The front steadies and the capital does not", historicalBranch: true,
            impact: { will: -2 },
            setFlags: { stavka_commandResult: "capitallost" },
            next: "stavka_1915_05_sventsiany",
            outcome:
              "Alekseyev takes charge of operations and the line stabilises through the " +
              "autumn. Four hundred miles away, competent ministers are dismissed and " +
              "replaced by the Empress's nominees, and the belief that the court is working " +
              "against the war spreads through people who are not revolutionaries and were " +
              "not going to be. The Emperor is now answerable for every defeat at the " +
              "front, and the capital is run by people he cannot supervise." },
          { weight: 40, title: "The presence steadies both",
            impact: { will: 1 },
            setFlags: { stavka_commandResult: "steadied" },
            next: "stavka_1915_05_sventsiany",
            outcome:
              "Speculative. The Emperor at headquarters is visible to the army in a way he " +
              "has not been, the operations are conducted by a professional, and the " +
              "arrangements in the capital hold together better than they historically did. " +
              "It requires the court to behave differently, which is the part of this that " +
              "is speculation. The ministers who warned him against going to the front have " +
              "to be shown wrong, and the Empress, who has been left in charge, has to be " +
              "content with her part." },
        ],
      },
      {
        id: "keep",
        label: "Keep the Grand Duke in the supreme command",
        advisor: { name: "Polivanov", position:
          "So long as the command can be replaced, the failures belong to the commander. Once it cannot, they belong to the throne." },
        gate: (m) => m.will >= -2,
        disabledReason: "The court will not be told a second time",
        impact: { manpower: 0, munitions: 0, will: 2 },
        setFlags: { stavka_command: "grandduke" },
        next: "stavka_1915_05_sventsiany",
        outcome:
          "Speculative. The Grand Duke stays and the Emperor stays in Petrograd. There " +
          "remains a commander who can be dismissed if 1916 goes badly, and a sovereign " +
          "in his capital while the arrangements there are made. The Grand Duke, whom " +
          "the court distrusts, is left in command of an army that is retreating, and " +
          "the blame for the retreat falls where it has been falling, on a man who is " +
          "not the Emperor and cannot be replaced from outside.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-08
  stavka_1915_05_sventsiany: {
    year: 1915, date: "1915-08-29", city: "Mogilev",
    title: "A Gap Fifty Kilometres Wide",
    advisors: ["alekseyev", "polivanov"],
    situation:
      "In the last days of August (the second week of September in the west) the " +
      "Germans have broken through at Sventsiany, where the Fifth and Tenth Armies " +
      "join. Six cavalry divisions have gone through north of Vilkomir, pushed back " +
      "the little Russian cavalry in the way, and are riding for Vileika and " +
      "Molodechno. A gap some fifty kilometres wide has opened between the two " +
      "fronts.\n\n" +
      "The Emperor has been in command for six days. The only force at hand to send " +
      "against the breach is a newly raised army that has not yet been under fire.",
    context:
      "Cavalry with no infantry or artillery to support it runs out of strength " +
      "quickly. It also runs a long way before it does, and into ground where the " +
      "railway the army depends on is only a day's ride off.",
    choices: [
      {
        id: "counter",
        label: "Counterattack at once with the new army and close the gap",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "Cavalry without infantry cannot hold what it has run through. The answer to a gap is to go in at its neck with what we have, not to give up the ground behind it." },
        impact: { manpower: 1, munitions: 0, will: 1 },
        setFlags: { stavka_sventsiany: "counterstroke" },
        next: "stavka_1915_06_chantilly",
        outcome:
          "Detachments of the newly raised Second Army stop the German cavalry on 2 and 3 " +
          "September (15 and 16 September in the west), when it has been without " +
          "infantry or guns for some days, and the counterstroke throws it back from " +
          "the Molodechno district. The breach itself is closed on 19 September " +
          "(2 October in the west). The Germans have got into the rear again and " +
          "have not been able to hold what they got, and the front, from here, " +
          "settles into trenches.",
      },
      {
        id: "withdraw",
        label: "Let the cavalry run out and withdraw the line to a shorter front",
        advisor: { name: "Polivanov", position:
          "The new army is the only reserve at hand, and it has never been tried. If it is lost there is little behind it. A shorter line can be held with what is left." },
        gate: (m) => m.will >= -2,
        disabledReason: "The court will not hear of another withdrawal six days after the Emperor took the command",
        impact: { manpower: 0, munitions: 1, will: -1 },
        setFlags: { stavka_sventsiany: "withdrew" },
        next: "stavka_1915_06_chantilly",
        outcome:
          "Speculative. The line falls back behind the breach and the new army stays " +
          "out of it. The cavalry, left to itself, does what cavalry does for a few " +
          "days and then stops for want of anything to carry on with, and the front " +
          "is shorter and worse placed than the one that was given up. The army has " +
          "its reserve, untried, and the Emperor, six days into the command, has a " +
          "retreat to his name that was not forced on him.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-11
  stavka_1915_06_chantilly: {
    year: 1915, date: "1915-11-23", city: "Mogilev",
    title: "A Plan for Every Front at Once",
    advisors: ["alekseyev", "polivanov"],
    situation:
      "In the first week of December in the west, Joffre has called the Allied " +
      "military representatives to his headquarters at Chantilly: France, Britain, " +
      "Italy, Serbia and Russia. His plan is that in 1916 the Allies attack on all " +
      "fronts at once, so that the Germans cannot move troops from one threatened " +
      "front to the next. Until then each is to wear the enemy down by active " +
      "operations.\n\n" +
      "The conference sets no date. The Russian representative is being asked to " +
      "accept the principle. In 1915, when the Russian line broke at Gorlice, the " +
      "Western Allies were not ready to help.",
    context:
      "Russia can say yes and mean it as an obligation, or say yes and mean it as an " +
      "aspiration, and the French will take it as the first. Saying no leaves the " +
      "armies of the largest ally outside the plan, at the moment when they have " +
      "just lost Poland.",
    choices: [
      {
        id: "commit",
        label: "Accept the plan: Russia will attack when the others do",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "In 1915 the Germans were free to choose their front. In 1916 they should be made to choose among several, and Russia has to be one of them." },
        impact: { manpower: 0, munitions: 1, will: 1 },
        setFlags: { stavka_chantilly: "committed", xc_chantilly: "committed" },
        next: "stavka_1916_02_naroch",
        outcome:
          "The Russian representative accepts the principle of simultaneous " +
          "offensives, and the conference agrees that when any of the allies is " +
          "threatened the others will attack to draw the pressure off. It fixes no " +
          "timetable. Within weeks Joffre and Haig turn it into a joint offensive on " +
          "the Somme. Russia has been put in the plan, and the French will ask for it " +
          "to be kept in the spring.",
      },
      {
        id: "decline",
        label: "Decline to commit until the army has been re-equipped",
        advisor: { name: "Polivanov", position:
          "An army that has lost its guns and half its rifles cannot make a promise to attack by a date, and a promise it cannot keep is worse than the refusal." },
        gate: (m) => m.munitions <= -2,
        disabledReason: "The army's stores are not low enough for a refusal to be believed",
        impact: { manpower: 1, munitions: 1, will: 0 },
        setFlags: { stavka_chantilly: "declined", xc_chantilly: "declined" },
        next: "stavka_1916_02_naroch",
        outcome:
          "Speculative. The Russian representative takes the plan home and the " +
          "French get an answer that is neither yes nor no. There is a spring of " +
          "refitting where the other would have been a spring of promises, and the " +
          "alliance, which has just lost Poland, is told by its largest partner " +
          "that it will fight when it can. The Allies make their plans without a " +
          "date from the east.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-02
  stavka_1916_02_naroch: {
    year: 1916, date: "1916-02-24", city: "Mogilev",
    title: "Verdun Asks for an Offensive",
    advisors: ["alekseyev", "polivanov", "brusilov"],
    situation:
      "The Germans have attacked at Verdun, and Joffre has asked Alekseyev directly " +
      "for a Russian offensive that will make them move divisions east. It is what " +
      "the Chantilly agreement promised, a few months early and without a date.\n\n" +
      "Alekseyev has put the question to the three front commanders. After the " +
      "winter's losses on the South-Western Front, any attack would have to come " +
      "from one or both of the others. The place chosen is the junction of the Northern " +
      "and Western Fronts, round Lake Naroch, where Kuropatkin has 266,000 infantry " +
      "and Evert 643,000, against some 495,000 Germans, behind lakes and marsh " +
      "that are still frozen.",
    context:
      "The ground is a thaw away from impassable. The French are fighting for their " +
      "lives and have a claim on the alliance. The Chantilly undertaking was to " +
      "attack together in the summer, and this would be an offensive made months " +
      "ahead of it.",
    choices: [
      {
        id: "launch",
        label: "Attack at Lake Naroch in March, for the French",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "The French asked, and the alliance rests on what each does when the other is in trouble. It will not be a good attack, but it will be an attack." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        setFlags: { stavka_naroch: "launched", xc_naroch: "launched" },
        next: "stavka_1916_05_brusilov",
        outcome:
          "The guns open on 5 March (18 March in the west), but the bombardment does not " +
          "cut the German defences, and the columns find them mostly intact and are " +
          "swept from the flank. The Second Army loses some 15,000 men on the first " +
          "day. The Russians take a stretch of the front line and cannot hold the " +
          "ground behind it. On 16 March (29 March in the west) Alekseyev ends the " +
          "assault, and the thaw and the rains halt the rest. It has not helped " +
          "the French.",
      },
      {
        id: "refuse",
        label: "Tell the French that the army will keep its strength for the summer",
        advisor: { name: "Brusilov", position:
          "An offensive made in a hurry, on frozen lakes, is not a gift to the French. The summer is when it can be made to count." },
        gate: (m) => m.will >= -3,
        disabledReason: "The alliance cannot be told no while Verdun is under attack",
        impact: { manpower: 1, munitions: 1, will: 0 },
        setFlags: { stavka_naroch: "refused", xc_naroch: "refused" },
        next: "stavka_1916_05_brusilov",
        outcome:
          "Speculative. The answer to Joffre is that Russia will attack with the " +
          "others in the summer, as agreed at Chantilly, and not before. The French, " +
          "who are fighting at Verdun, are not given what they asked for. The army " +
          "keeps the men and the shells that Naroch would have used, and it goes " +
          "into the summer a little stronger.",
      },
    ],
  },

  stavka_1916_05_brusilov: {
    year: 1916, date: "1916-05-22", city: "Berdichev",
    title: "An Offensive Without a Concentration",
    advisors: ["brusilov", "alekseyev"],
    bulletin: {
      voice: "stavka", date: "1916-05-20", source: "Communique of the Staff",
      text:
        "Preparations proceed upon the South-Western Front. Enemy positions have been " +
        "subjected to fire at a number of points.",
    },
    situation:
      "Brusilov proposes to attack without the usual massing that tells the enemy " +
      "where the blow is coming: broad-front preparation, several simultaneous " +
      "assaults, no single obvious point of main effort. It denies the defence its " +
      "reserves rather than trying to outweigh them.\n\n" +
      "The other fronts are meant to attack in support. Whether they will is a " +
      "question about the men commanding them, not about the plan.",
    context:
      "This is the one offensive design of the war that solves the problem everyone " +
      "has been failing at. Whether it can be exploited depends entirely on whether " +
      "the rest of the army moves when this front does.",
    choices: [
      {
        id: "support",
        label: "Order the other fronts to attack in support and enforce it",
        advisor: { name: "Brusilov", position:
          "The method will make a hole in the Austrian line. Holding it open is somebody else's front and somebody else's orders." },
        gate: (m) => m.will >= -3,
        disabledReason: "Stavka does not currently have the authority to compel front commanders who do not wish to attack",
        impact: { manpower: -3, munitions: -3, will: 2 },
        setFlags: { stavka_brusilov: "supported" },
        next: "stavka_1916_12_kovel",
        outcome:
          "Speculative. The supporting attacks are made and made seriously. The " +
          "Austrian front does not merely bend, and the German divisions sent to shore " +
          "it up come from somewhere they were needed. The other front commanders, who " +
          "have said they will not be ready, are overruled by Stavka and told to attack " +
          "on the day, and whether they obey, and with what, is the whole of the risk. " +
          "The offensive is no longer the work of one front.",
      },
      {
        id: "alone",
        label: "Let the South-Western Front attack alone",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "The other fronts will attack when they are ready. I am not able to make them ready by ordering it." },
        impact: { manpower: -3, munitions: -2, will: 1 },
        setFlags: { stavka_brusilov: "alone" },
        dispute:
          "What the 1916 offensive cost Russia relative to what it bought is argued. " +
          "One reading holds it as the war's most successful Russian operation and a " +
          "material contribution to the coalition, drawing German divisions east and " +
          "helping to break the Austrian army as an independent force. Another holds " +
          "that unsupported exploitation consumed precisely the trained and willing " +
          "formations the army could least replace, and that the units which would " +
          "still attack in 1917 were the ones that had not been spent here. The two " +
          "readings are not exclusive and the balance between them is not settled.",
        uncertain: [
          { weight: 55, title: "The Austrian front breaks and the cost is borne by the best divisions", historicalBranch: true,
            impact: { manpower: -1, will: 1 },
            setFlags: { stavka_brusilovResult: "costly" },
            next: "stavka_1916_12_kovel",
            outcome:
              "The offensive succeeds beyond anything this army has managed and breaks the " +
              "Austrian front, forcing German divisions east to hold it. The supporting " +
              "attacks are not pressed. It is exploited as far as one front can exploit " +
              "anything alone, and the divisions that did it are the divisions that will " +
              "not be there next year. Brusilov has done what no one thought could be done " +
              "with the army he had, and he has done it once." },
          { weight: 45, title: "The breakthrough is banked rather than pushed",
            impact: { munitions: -1, will: 1 },
            setFlags: { stavka_brusilovResult: "banked" },
            next: "stavka_1916_12_kovel",
            outcome:
              "Speculative. The front takes what the method wins and stops when the " +
              "exploitation stops paying. The Austrian line is broken, the German divisions " +
              "still come east, and the formations that did it are still formations at the " +
              "end of it. The offensive is smaller than the historical one and costs less, " +
              "and Brusilov is not the figure in the army that the historical one made him. " +
              "Romania, watching, has less to go on, and may come in later or not at all." },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-07
  stavka_1916_12_kovel: {
    year: 1916, date: "1916-07-10", city: "Mogilev",
    title: "The Road to Kovel",
    advisors: ["alekseyev", "brusilov"],
    situation: (flags) =>
      "The South-Western Front attacked on 22 May (4 June in the west) and broke the " +
      "Austrian line. " +
      (flags.stavka_brusilov === "supported"
        ? "The other fronts attacked in support, as the order said, and the Germans have had to find reserves for each of them."
        : "The Western Front did not move until ten days later, and its own attack in July took five kilometres and about 80,000 men.") +
      "\n\nAlekseyev has given Brusilov a third army and the Guards, and the front now " +
      "holds some 700,000 men against about 421,000. Brusilov wants to go on for Kovel, " +
      "the railway junction that would carry the front west toward Brest-Litovsk. The " +
      "ground in front of it is marsh and river, and the Germans have been bringing " +
      "divisions to hold it.",
    context:
      "The offensive has already done more than anyone expected of it. Going on costs " +
      "the Guards, who are the best troops left in the army.",
    choices: [
      {
        id: "kovel",
        label: "Order the Guards and the Special Army to take Kovel",
        historical: true,
        advisor: { name: "Brusilov", position:
          "The enemy is still off balance. The junction at Kovel would give the front a road to the west." },
        impact: { manpower: 0, munitions: -1, will: 0 },
        setFlags: { stavka_kovel: "attacked" },
        next: "stavka_1916_13_romania",
        outcome:
          "The preparation begins on 11 July (24 July in the west) and the main attacks " +
          "go in from the 15th (28 July), across the marshes of the Stokhod. By the 26th " +
          "(8 August) the Germans and Austro-Hungarians have stopped them, and on the " +
          "27th (9 August) Brusilov suspends the operation. Kovel is not taken, and the " +
          "Guards, who were the army's best reserve, have been spent on the marsh.",
      },
      {
        id: "hold",
        label: "Stop offensive operations on the Kovel front and hold what has been taken",
        impact: { manpower: 1, munitions: 1, will: -1 },
        setFlags: { stavka_kovel: "held" },
        next: "stavka_1916_13_romania",
        outcome:
          "Speculative. The front holds the ground it has won and the Guards are kept " +
          "in reserve. Brusilov's offensive ends where it stood in July, without the " +
          "attempt on the junction. The Germans use the pause to bring up more " +
          "divisions, and the Guards, who would have been spent on the marshes, are " +
          "still there in the winter when the army needs them. The Commander who has " +
          "been asked for one more effort is told, instead, that the effort is over.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-08
  stavka_1916_13_romania: {
    year: 1916, date: "1916-08-14", city: "Mogilev",
    title: "A New Ally With a Long Frontier",
    advisors: ["alekseyev", "brusilov"],
    situation: (flags) =>
      "Romania enters the war today, 14 August (27 August in the west), encouraged " +
      "by the success of the offensive in Galicia. " +
      (flags.stavka_kovel === "attacked"
        ? "The Guards are on the Stokhod and the front's best reserve is spent."
        : "The Guards are in reserve behind the front.") +
      "\n\nThe Romanian army will attack into Transylvania, while German, Austro-" +
      "Hungarian and Bulgarian forces gather to the north and the south of it. Romania " +
      "has a long frontier and an army that is short of guns and of the experience of " +
      "the war. Russia has promised to help, and the help has to come from the same " +
      "armies that are fighting in Galicia.",
    context:
      "A force sent to Romania is a force taken from the front, where Brusilov has been " +
      "told to stop. A force not sent is an ally left to its own frontier.",
    choices: [
      {
        id: "small",
        label: "Send a small force and promise more if it is needed",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "The Romanian front is a sideshow and cannot be allowed to take the armies from the main one." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { stavka_romania: "small" },
        next: "stavka_1916_14_romfront",
        outcome:
          "Three Russian divisions are sent, and they are not properly equipped. The " +
          "Romanian plans go wrong, and the Germans take Bucharest on 23 November (6 " +
          "December in the west). Russia then has to send large reinforcements to keep " +
          "the Germans from the south of the country, and in the weeks that follow the " +
          "front settles in Moldavia, held by a great many Russian divisions that have " +
          "been taken from somewhere else.",
      },
      {
        id: "army",
        label: "Send an army to Romania at once and shorten the line in Galicia to find it",
        gate: (m) => m.manpower >= -3,
        disabledReason: "The army cannot find a force for Romania without breaking the Galician front",
        impact: { manpower: -3, munitions: -2, will: 1 },
        setFlags: { stavka_romania: "army" },
        erodes: "expose_regime",
        next: "stavka_1916_14_romfront",
        outcome:
          "Speculative. A Russian army is sent to Romania in the first weeks, and the " +
          "Galician line is shortened to pay for it. The Romanian front opens with " +
          "stronger support and the Galician front with less, and the army has to find " +
          "the troops in the autumn that it historically found in the winter. Stavka " +
          "has chosen the ally over the front, and the Romanian general staff, who " +
          "never saw the Russians as friends, have to decide whether to accept the " +
          "help.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-11
  stavka_1916_14_romfront: {
    year: 1916, date: "1916-11-29", city: "Mogilev",
    title: "A Front That Is Not Ours",
    advisors: ["alekseyev", "brusilov"],
    situation: (flags) =>
      "On 29 November (12 December in the west) Bucharest has fallen to the army of " +
      "Mackensen, and what is left of the Romanian army is in western Moldavia, with " +
      "the Carpathians behind it and a German-led army coming on from the south.\n\n" +
      (flags.stavka_romania === "army"
        ? "An army was sent to Romania in the summer, at the first request, and it is " +
          "already in the line. "
        : "Three divisions were sent to Romania in the summer, and Alekseyev, who had " +
          "doubted that Romania's entry would be worth having, has seen what it costs. ") +
      "A great movement of Russian troops is under way through November, " +
      "and what it is for is not settled: it may hold the Romanian front, " +
      "under a command that is partly Romanian, or only the Russian frontier " +
      "behind it.",
    context:
      "Taking over the Romanian front lengthens the line the army has to hold, " +
      "in the middle of a winter, with the divisions that were to be spared for the " +
      "spring. Not taking it over leaves the Romanians to be overrun, and the " +
      "alliance that brought them in is the alliance that is asked to rescue them.",
    choices: [
      {
        id: "take",
        label: "Take over the defence of Moldavia and form a Romanian Front under the King",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "I did not want them in the war. They are in it, and the front that stands in Moldavia is our flank. We hold it, or we hold it later with less." },
        impact: { manpower: 0, munitions: -1, will: 1 },
        setFlags: { stavka_romfront: "formed" },
        next: "stavka_1917_01_petrograd",
        outcome:
          "In mid-December the Romanian Front is formed out of the headquarters of the " +
          "Danube Army and the remnants of the Romanian army, nominally under the " +
          "King, with the Russian commander, Sakharov, serving under him. Thirty-six " +
          "infantry and eleven cavalry divisions are said to have been moved " +
          "south in November alone. By the end of the year the line has " +
          "stopped along the Carpathians, the lower Siret and the Danube. Russia has " +
          "a front it did not want, and it holds.",
      },
      {
        id: "limit",
        label: "Hold only the Russian frontier and the Prut, and leave the rest to the Romanians",
        advisor: { name: "Brusilov", position:
          "Every division sent south is a division not sent against the Austrians in the spring. The frontier we have to hold is our own." },
        gate: (m) => m.manpower <= -2,
        disabledReason: "The army is not yet so short of men that the Romanians can be told they are on their own",
        impact: { manpower: 0, munitions: 1, will: -1 },
        setFlags: { stavka_romfront: "limited" },
        next: "stavka_1917_01_petrograd",
        outcome:
          "Speculative. The Russian armies stand on their own frontier and the " +
          "Romanian army, with what it has, holds the little of the country that is " +
          "left. The divisions are kept for the spring. The Romanians, who came in on " +
          "the promise of help and had a share of it, are told that the help " +
          "stops at the Prut, and the alliance, which was made up of such promises, has " +
          "one fewer that anyone believes.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-01
  stavka_1917_01_petrograd: {
    year: 1917, date: "1917-01-20", city: "Mogilev",
    title: "The Allied Missions Arrive",
    advisors: ["alekseyev", "ruzsky", "brusilov"],
    bulletin: {
      voice: "stavka", date: "1917-01-18", source: "Communique of the Staff",
      text:
        "On the Romanian front and in the Carpathian region there is no change. " +
        "Along the remainder of the front our scouts have been active.",
    },
    situation:
      "On 20 January (2 February in the west) the Allied missions are at Petrograd: " +
      "the British, led by Lord Milner, who has come to settle two things with the " +
      "Russian government, how the summer's offensives are to be coordinated and how " +
      "Russia is to be supplied with the equipment it has been asking for. At Port " +
      "Romanov thousands of tons of munitions are lying on the docks.\n\n" +
      "Stavka is asked what to tell them about the spring. The Allies want a Russian " +
      "offensive to go in with their own, and the High Command has to say whether " +
      "it can be made.",
    context:
      "The conference is meant to do the thing Chantilly did not: to put dates on " +
      "the promises. Russia is the one partner whose answer depends on the " +
      "weather, the railways and the temper of the capital, and the delegates know " +
      "it, and have come to judge for themselves.",
    choices: [
      {
        id: "postpone",
        label: "Tell the missions that the great offensives must wait until the army is ready",
        historical: true,
        advisor: { name: "Alekseyev", position:
          "The army will take the field when it has the guns, the rifles and the railway to carry them, and not on a date written in Petrograd." },
        impact: { manpower: 1, munitions: 1, will: -1 },
        setFlags: { stavka_petrograd: "postponed", xc_petrograd: "postponed" },
        next: "stavka_1917_06_february",
        outcome:
          "General Gurko, speaking for the High Command, tells the conference that " +
          "the great offensives are to be put off. The Allied delegates are " +
          "disappointed, and the conference, which was meant to settle the dates, ends " +
          "with poor results. Less than six weeks later the Emperor abdicates, and " +
          "the question of what the army would have done in the spring is " +
          "put to a different government.",
      },
      {
        id: "promise",
        label: "Promise the missions a Russian offensive in the spring, on the date they ask",
        advisor: { name: "Brusilov", position:
          "A promise that is kept is worth more than a delay that is explained. The army can attack on the south-western front, and the Allies' wish is a reason to do it." },
        gate: (m) => m.will >= -2,
        disabledReason: "Headquarters will not put its name to a date that the railways cannot keep",
        impact: { manpower: 0, munitions: -1, will: 1 },
        setFlags: { stavka_petrograd: "promised", xc_petrograd: "promised" },
        next: "stavka_1917_06_february",
        outcome:
          "Speculative. The mission goes home with a date and a promise, and the " +
          "Allied staffs plan round both. The offensive that is made in the spring " +
          "is made by an army that was told to expect it, and by a country that " +
          "has been told it will be, in a winter that is not a good one for either. " +
          "Whether the Emperor is still on the throne when the date comes is a " +
          "question that the missions do not ask and nobody answers.",
      },
    ],
  },

  stavka_1917_06_february: {
    year: 1917, date: "1917-03-02", city: "Pskov",
    title: "The Front Commanders Are Asked",
    advisors: ["alekseyev", "ruzsky", "brusilov"],
    bulletin: {
      voice: "stavka", date: "1917-02-28", source: "Communique of the Staff",
      text:
        "Upon the northern and western fronts, scouting activity. The Staff has no " +
        "further communication to make.",
    },
    situation:
      "The capital is in the hands of crowds and of a garrison that will not fire on " +
      "them. The Emperor's train has been stopped at Pskov. From the capital comes a " +
      "question addressed to the army: do the front commanders advise abdication.\n\n" +
      "This is not a military question and there is no version of it in which the army " +
      "is neutral. Advising abdication makes the high command an agent in the fall of " +
      "the dynasty it swore to. Refusing makes it the last institution standing " +
      "between the crowds and the throne, which is a war behind the front while there " +
      "is a war in front of it.",
    context:
      "Whatever government follows will issue orders to this army. Within days, one " +
      "of them will make the authority of officers subject to soldiers' committees. " +
      "Nobody in this room knows that yet, and everybody in it can see the shape of it.",
    choices: [
      {
        id: "advise",
        label: "Advise abdication",
        historical: true,
        advisor: { name: "Ruzsky", position:
          "The alternative is turning the army round to face Petrograd. There is no third thing." },
        impact: { manpower: 0, munitions: 0, will: -3 },
        setFlags: { stavka_february: "advised" },
        next: "stavka_1917_07_kerensky",
        outcome:
          "The front commanders advise abdication and the abdication follows. The army " +
          "has participated in the removal of its sovereign and will spend what is left " +
          "of its existence being told so by people who wanted it done and by people " +
          "who did not. The generals have acted in the interest of the war, as they " +
          "understood it, and the officers who took the oath to the Emperor are asked " +
          "what it was worth, by their own men.",
      },
      {
        id: "refuse",
        label: "Refuse — the army does not decide who reigns",
        advisor: { name: "Alekseyev", position:
          "If the army answers this question once, it will be asked every question after it." },
        gate: (m) => m.will >= -4,
        disabledReason: "The army no longer has the cohesion to be used against the capital",
        impact: { manpower: -2, munitions: 0, will: -2 },
        setFlags: { stavka_february: "refused" },
        erodes: "expose_regime",
        nextIf: (m) =>
          m.will <= -9 ? "stavka_end_disintegration"
          : m.munitions <= -8 ? "stavka_end_separate"
          : null,
        next: "stavka_1917_07_kerensky",
        outcome:
          "Speculative. The high command declines to advise and the question goes back " +
          "to the capital unanswered. What follows depends on whether any formation " +
          "will march on Petrograd, and on very little else. The generals have kept the " +
          "army out of the question of who reigns, and have left the question to the " +
          "people who were already settling it. No one at headquarters is ready to say " +
          "what the army would do if the capital asked it to restore order.",
      },
    ],
  },

  stavka_1917_07_kerensky: {
    year: 1917, date: "1917-06-16", city: "Tarnopol",
    title: "An Order Is Now a Proposal",
    advisors: ["kerensky", "brusilov"],
    bulletin: {
      voice: "stavka", date: "1917-06-14", source: "Communique of the Staff",
      text:
        "The armies of the South-Western Front stand in readiness. Meetings have been " +
        "held in a number of units at which the duty of the free Russian soldier was " +
        "explained.",
    },
    situation:
      "The government wants an offensive. It wants it to prove to the allies that " +
      "Russia is still in the war and to prove to Russia that the government can do " +
      "something.\n\n" +
      "The army it wants to use has been told by decree that the authority of its " +
      "officers is subject to committees of its soldiers. Units debate orders before " +
      "executing them, and some debate them instead. An offensive requires men to " +
      "leave a trench and walk toward machine guns because they were told to, and the " +
      "mechanism by which men are told to do that has been formally dismantled.",
    context:
      "The command's position is that this cannot be done. The government's position " +
      "is that the alternative is a government that has done nothing, in a capital " +
      "where doing nothing is being noticed by people with a plan.",
    choices: [
      {
        id: "attack",
        label: "Make the offensive the government has asked for",
        historical: true,
        advisor: { name: "Kerensky", position:
          "The revolution has to be shown to be capable of defending itself. An army that will not attack cannot demonstrate that." },
        impact: { manpower: -3, munitions: -2, will: -3 },
        setFlags: { stavka_kerensky: "attacked" },
        erodes: "expose_regime",
        dispute:
          "Whether the June offensive destroyed what remained of the army's cohesion " +
          "or merely revealed that it had already gone is argued. On one reading the " +
          "failure and the retreat that followed converted a disorganised army into a " +
          "disintegrating one and made October possible. On another, an army whose " +
          "orders were already subject to committee had ceased to be a usable " +
          "instrument in March, and the offensive demonstrated that rather than causing " +
          "it.",
        uncertain: [
          { weight: 70, title: "Initial success, then the units stop", historicalBranch: true,
            impact: { manpower: -2, will: -3 },
            setFlags: { stavka_kerenskyResult: "collapsed" },
            next: "stavka_1917_12_deathpenalty",
            outcome:
              "The first days go well where the artillery is good and the units are " +
              "willing. Then the willing units are used up, the rest decline to replace " +
              "them, and the counterattack finds a front that is arguing with itself. What " +
              "comes back is not an army that failed at an offensive. It is an army that " +
              "has stopped. The Provisional Government, which ordered the attack, is left " +
              "with a retreat that no committee will agree to halt." },
          { weight: 30, title: "The offensive achieves a limited gain and stops",
            impact: { manpower: -1, will: -1 },
            setFlags: { stavka_kerenskyResult: "limited" },
            next: "stavka_1917_12_deathpenalty",
            outcome:
              "Speculative. The attack takes ground where the committees agreed to it and " +
              "stops where they did not. The government has something to show the allies " +
              "and the army has not been destroyed proving it. The commanders who were told " +
              "that an order is now a proposal discover how much of a proposal can be " +
              "turned into an advance, and the answer is some, in some places, for a short " +
              "time." },
        ],
      },
      {
        id: "refuse",
        label: "Tell the government the army cannot attack",
        advisor: { name: "Brusilov", position:
          "I can report what these units will do. I cannot make them into units that will do something else by signing an order." },
        gate: (m) => m.will >= -5,
        disabledReason: "The command has no standing left to refuse the government anything",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { stavka_kerensky: "refused" },
        next: "stavka_1917_12_deathpenalty",
        outcome:
          "Speculative. The command puts in writing that the army is not capable of " +
          "offensive operations. The divisions are not spent. The government is left " +
          "holding a war it cannot prosecute and cannot leave. The Allies, who lent the " +
          "money for the offensive, are told in writing that it will not be made, and " +
          "the commander who signed the paper has to wait for the government to decide " +
          "whether it can afford to keep him.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-07
  stavka_1917_12_deathpenalty: {
    year: 1917, date: "1917-07-12", city: "Mogilev",
    title: "Shooting at the Front",
    advisors: ["brusilov", "kerensky"],
    situation: (flags) =>
      "The offensive begun in June has turned into a retreat in Galicia, and units " +
      "are leaving their positions without orders. " +
      (flags.stavka_kerensky === "refused"
        ? "The army had said it could not attack, and the government has not been able to make it do so."
        : "The offensive that was made has ended as the commanders feared it would.") +
      "\n\nThe commander of the South-Western Front has sent the government an " +
      "ultimatum demanding that the death penalty be restored at the front, which " +
      "the Provisional Government abolished in March. The army's committees are " +
      "against it. The Minister of War is being asked whether the orders of the " +
      "command can still be enforced, and the committees will take the answer as " +
      "an answer to the question of who commands the army.",
    context:
      "A penalty that is ordered and not carried out is worse than none. A penalty " +
      "that is carried out by an officer on a soldier who belongs to a committee has " +
      "consequences that the order does not describe.",
    choices: [
      {
        id: "restore",
        label: "Restore the death penalty at the front and set up courts-martial",
        historical: true,
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { stavka_deathpenalty: "restored" },
        next: "stavka_1917_09_riga",
        outcome:
          "Kerensky sends telegraphic orders on 12 July instituting the death penalty " +
          "at the front, in response to the ultimatum. A few days later Kornilov, who " +
          "made the demand, is made Supreme Commander in place of Brusilov. The army's " +
          "committees are against the order, and it widens the distance between them " +
          "and the command. The officers, who wanted the penalty, now have it, and find " +
          "that using it on a unit that has voted against it is a different thing.",
      },
      {
        id: "refuse",
        label: "Refuse to restore it and rely on the commissars and the committees",
        gate: (m) => m.will >= -3,
        disabledReason: "The command cannot hold the retreat together on persuasion alone",
        impact: { manpower: -1, munitions: 0, will: 1 },
        setFlags: { stavka_deathpenalty: "refused" },
        next: "stavka_1917_09_riga",
        outcome:
          "Speculative. The penalty is not restored. The retreat in Galicia is left to " +
          "the commissars and the committees, and the commander who made the ultimatum " +
          "has to be answered. The Supreme Command stays with the officers who say that " +
          "discipline can be built on consent. The units that would have been steadied " +
          "by the threat have to be steadied by argument, and the Galician front falls " +
          "back, as it was going to, at its own pace.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-08
  stavka_1917_09_riga: {
    year: 1917, date: "1917-08-19", city: "Mogilev",
    title: "The Daugava Is Crossed",
    advisors: [],
    situation:
      "On 19 August (1 September in the west) the Germans attack at Riga after a " +
      "bombardment of explosive and gas shells, and cross the Daugava south of " +
      "Ikskile. The Twelfth Army, under Parsky, is part of Klembovsky's Northern " +
      "Front, and on paper it outnumbers the force that has attacked it.\n\n" +
      "The Supreme Commander wants Riga held. The commanders on the spot want " +
      "to take the army out of it before it is surrounded, and a rearguard " +
      "of the Forty-third Corps would have to do the holding.",
    context:
      "Riga is a city, a bridge and a symbol, and the Supreme Commander has judged " +
      "most of the infantry to be in poor condition and likely to run. To " +
      "hold it is to find out whether that is true, with the army that has the " +
      "most to lose by the answer.",
    choices: [
      {
        id: "withdraw",
        label: "Let the Twelfth Army withdraw from Riga, covered by a rearguard",
        historical: true,
        advisor: { name: "Klembovsky", position:
          "The army can be taken out of Riga or it can be lost in Riga. A city is worth less than the army that would be left to hold it." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { stavka_riga: "withdrew" },
        next: "stavka_1917_13_kornilov",
        outcome:
          "On 20 August (2 September in the west) Parsky orders Riga abandoned and " +
          "tells the Forty-third Corps to delay the Germans while the army gets away. " +
          "The Twelfth Army escapes encirclement and many guns are left behind. " +
          "The rearguard has heavy losses, and the Latvian Riflemen lose more than " +
          "half their strength. Russian casualties are about 25,000, with " +
          "some 9,000 to 15,000 of them prisoners. Riga is in German hands on 21 " +
          "August (3 September in the west).",
      },
      {
        id: "hold",
        label: "Order the Twelfth Army to hold Riga",
        advisor: { name: "Kornilov", position:
          "Riga should be held. If the infantry will not hold it, the army is in worse shape than the government has been willing to say." },
        gate: (m) => m.manpower >= -4,
        disabledReason: "There are not the men on the Daugava to hold a city against a German army",
        impact: { manpower: -2, munitions: -1, will: 1 },
        erodes: "expose_regime",
        setFlags: { stavka_riga: "held" },
        next: "stavka_1917_13_kornilov",
        outcome:
          "Speculative. The Twelfth Army is ordered to stand, and what stands is a " +
          "fraction of what is on the books. The bombardment and the crossing " +
          "do what they did to the army that withdrew, to an army that has been " +
          "told to remain, and the line behind it is not yet a line. Whether " +
          "the infantry could have held is answered the hard way. The risk is " +
          "an army encircled in a city it was ordered to hold.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-08
  stavka_1917_13_kornilov: {
    year: 1917, date: "1917-08-27", city: "Mogilev",
    title: "The Supreme Commander Is Dismissed by Telegram",
    advisors: ["alekseyev", "kerensky"],
    situation: (flags) =>
      "Riga has fallen. The Supreme Commander, General Kornilov, who has held the post " +
      "since 18 July (31 July in the west), believes that a Bolshevik rising in " +
      "Petrograd is near, and he has ordered General Krymov's Third Cavalry Corps to " +
      "move toward the capital.\n\n" +
      "This morning, 27 August (9 September in the west), Kerensky telegraphed " +
      "Kornilov's dismissal, believing that the movement of the corps is the beginning of " +
      "a coup. " +
      (flags.stavka_deathpenalty === "restored"
        ? "The Supreme Commander is the officer who made the demand on which the death penalty was restored."
        : "The Supreme Commander is the officer whose demand was refused in July.") +
      "\n\nKornilov is at this headquarters, and the corps is on the road. The order to " +
      "stop it can come from one of two men, and they are not speaking to each other.",
    context:
      "Whether this is a coup or a misunderstanding is not clear from here, and is not " +
      "going to be settled in the next three days. The corps will arrive at Petrograd " +
      "or it will not.",
    choices: [
      {
        id: "refuse",
        label: "Refuse the dismissal and let the cavalry corps go on",
        historical: true,
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { stavka_kornilov: "refused" },
        dispute:
          "Whether Kornilov meant to take power or to carry out an arrangement made " +
          "with the government is disputed. Kerensky took the movement of the corps " +
          "for a coup, after an exchange of messages through an intermediary that the " +
          "two men understood differently, and Kornilov afterwards denied that he meant " +
          "to overthrow the government.",
        next: "stavka_1917_08_october",
        outcome:
          "The movement of 28 to 31 August (10 to 13 September in the west) collapses " +
          "without a battle. The Petrograd Soviet sets up a Committee for the Struggle " +
          "Against Counter-Revolution on the 28th, and the corps comes apart through low " +
          "morale and desertion. By the 30th the affair is over, Kornilov is under " +
          "arrest, and Alekseyev has come back as Chief of Staff. The Bolsheviks, who " +
          "were being blamed for July, come out of it with far more prestige.",
      },
      {
        id: "obey",
        label: "Obey the dismissal and recall the cavalry",
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { stavka_kornilov: "obeyed" },
        next: "stavka_1917_08_october",
        outcome:
          "Speculative. The dismissal is accepted and the corps is turned back before " +
          "it reaches the capital. There is no march and no collapse of one. The " +
          "officers of the army have seen their commander dismissed by a telegram, and " +
          "the soviets have not been called out to defend anything. The Provisional " +
          "Government has been spared the test of what the army would have done, and " +
          "the army has been spared learning that its generals could not be trusted " +
          "with it.",
      },
    ],
  },

  stavka_1917_08_october: {
    year: 1917, date: "1917-10-25", city: "Mogilev",
    title: "Orders From a Building That Changed Hands",
    advisors: ["dukhonin"],
    bulletin: {
      voice: "stavka", date: "1917-10-23", source: "Communique of the Staff",
      text:
        "The Staff continues to direct the armies of the front. Communication with " +
        "Petrograd is intermittent. Units are instructed to remain in their positions " +
        "and to await orders through the usual channels.",
    },
    situation: (flags) =>
      "The government in Petrograd has been removed by people who intend to leave the " +
      "war, and the front is still a front, and the men in it are going home in " +
      "numbers that no longer require a decision from anybody.\n\n" +
      (flags.stavka_kerenskyResult === "collapsed"
        ? "The June offensive used up the formations that would still obey and returned nothing."
        : "Such formations as will still obey are intact, which is a smaller number than it sounds.") +
      (flags.stavka_kornilov === "refused"
        ? "\n\nThe Supreme Commander of the summer was arrested after the August affair, and " +
          "the army's officers have not forgotten it."
        : flags.stavka_kornilov === "obeyed"
          ? "\n\nThe Supreme Commander of the summer obeyed his dismissal in August, and the " +
            "army's officers have not forgotten that either."
          : "") +
      "\n\nWhat is left to decide is what this headquarters does with the fact that " +
      "it no longer has a government it recognises and still has an enemy in front of " +
      "it.",
    context:
      "Whatever is chosen, the officers in this building will shortly be choosing " +
      "sides in a different war, on ground that runs from the Don to Siberia. Some of " +
      "them are already choosing.",
    choices: [
      {
        id: "standdown",
        label: "Hold the line and take no part in the political question",
        historical: true,
        advisor: { name: "Dukhonin", position:
          "The units stay where they are, facing the enemy, and take no side. That is the most this headquarters can still order and be obeyed." },
        impact: { manpower: -2, munitions: -2, will: -2 },
        setFlags: { stavka_october: "standdown" },
        nextIf: (m, flags) =>
          m.will <= -9 ? "stavka_end_disintegration"
          : m.manpower <= -10 ? "stavka_end_dissolved"
          : flags.stavka_commandResult === "steadied" ? "stavka_end_steadied"
          : (flags.stavka_kerensky === "refused" && m.manpower >= -6) ? "stavka_end_holds"
          : (flags.stavka_prussia === "early" && flags.stavka_brusilov === "supported") ? "stavka_end_alliance"
          : null,
        next: "stavka_1917_14_armistice",
        outcome:
          "The headquarters holds what it can hold and takes no side, which turns out " +
          "not to be a position that exists. The front dissolves by desertion rather " +
          "than by defeat, and the officer corps disperses toward the places where the " +
          "next war is being organised. The men go home with their rifles, and the " +
          "Germans, who have no need to attack, are content to watch. The army is not " +
          "defeated. It is demobilised without anyone having given the order.",
      },
      {
        id: "resist",
        label: "Refuse to recognise the new authority and hold the army together against it",
        advisor: { name: "Dukhonin", position:
          "An order to open negotiations can only come from a government sustained by the army and the country. This one is sustained by neither." },
        gate: (m) => m.manpower >= -5,
        disabledReason: "There are not enough reliable formations left to hold anything together",
        impact: { manpower: -3, munitions: -1, will: -1 },
        setFlags: { stavka_october: "resisted" },
        erodes: "expose_regime",
        next: "stavka_end_civilwar",
        outcome:
          "Speculative. The headquarters declines to recognise the new authority. " +
          "Formations divide according to what their soldiers' committees decide, which " +
          "is the same thing as saying the war at the front has become the war behind " +
          "it, several months earlier than it historically did. The officers who go to " +
          "the Don with their men carry the German war with them as an afterthought, " +
          "and the Germans, who see an army turn on itself, wait for it to finish.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-11
  stavka_1917_14_armistice: {
    year: 1917, date: "1917-11-09", city: "Mogilev",
    title: "The Order to Open Talks",
    advisors: ["dukhonin"],
    situation:
      "The Council of People's Commissars has telephoned the Chief of Staff, who is now " +
      "acting as Supreme Commander. The order is to approach the German command " +
      "at once and propose an armistice on the whole front.\n\n" +
      "The front is held by men who are mostly going home, and the headquarters " +
      "commands them by the courtesy of their committees. The men who gave the order " +
      "say they speak for the soldiers and the people, and the soldiers' committees " +
      "have not said that they do not.",
    context:
      "To obey is to recognise the new authority and to open a negotiation the army " +
      "cannot stop. To refuse is to be dismissed, and a headquarters that has been " +
      "dismissed by wireless has nobody it can command.",
    choices: [
      {
        id: "refuse",
        label: "Decline the order: it can come only from a government the army and the country support",
        historical: true,
        advisor: { name: "Dukhonin", position:
          "An order to open negotiations has to come from a government that the army and the country stand behind, and this one has not shown that it does." },
        attested: { by: "Dukhonin", text: "a government sustained by the army and the country",
          source: "Reply to the Council of People's Commissars, 9 November 1917 (Old Style)" },
        impact: { manpower: -1, munitions: 0, will: -2 },
        setFlags: { stavka_armistice: "refused" },
        next: "stavka_end_brest",
        outcome:
          "Dukhonin gives evasive answers and then a refusal, and is dismissed on the " +
          "telephone line, and the commissars announce that Ensign Krylenko is " +
          "Supreme Commander in his place. Krylenko comes to Mogilev with sailors. On " +
          "20 November (3 December in the west) Dukhonin gives himself up and is " +
          "killed by a mob at the railway station, despite Krylenko's attempt to stop it.",
      },
      {
        id: "obey",
        label: "Carry out the order and approach the German command",
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { stavka_armistice: "obeyed" },
        next: "stavka_end_brest",
        outcome:
          "Speculative. The headquarters sends the proposal to the German command under " +
          "its own name. The new government has what it asked for and the army has a " +
          "commander it has not dismissed. The officers who would not have done it " +
          "leave for the Don, where Alekseyev is already beginning to gather them. The " +
          "headquarters has recognised an authority that it did not choose, and its " +
          "Chief of Staff is alive at the end of the month.",
      },
    ],
  },

  // ---------------------------------------------------------------- endings
  stavka_end_brest: {
    year: 1918, date: "1918-03-03", city: "Brest-Litovsk",
    title: "Signed at Brest-Litovsk",
    situation:
      "The treaty is signed on 3 March 1918, and the date is New Style because the " +
      "calendar changed in February along with everything else.\n\n" +
      "It gives up Poland, the Baltic provinces, Finland, Ukraine — territory holding " +
      "a large part of the Empire's population, coal and grain. It is signed because " +
      "there is no army left with which to decline it. The front that could not be " +
      "held in 1915 without shells could not be held in 1918 without men, and the men " +
      "walked home.",
    ending: { family: "collapse-into-revolution", badge: BADGES.SETTLED },
    epilogue: (flags) =>
      "East Prussia: " + (flags.stavka_prussia === "concentrated" ? "entered after the concentration was complete." : "entered early, on the undertaking to France.") + "\n" +
      "1915: " + (flags.stavka_1915 === "held" ? "the Polish salient was held." : "the salient was given up and the army kept.") + "\n" +
      "August 1915: " + (flags.stavka_command === "grandduke" ? "the Grand Duke retained the supreme command." : "the Emperor assumed the supreme command in person.") + "\n" +
      "1916: " + (flags.stavka_brusilov === "supported" ? "the other fronts attacked in support." : flags.stavka_brusilovResult === "banked" ? "the South-Western Front attacked alone and stopped when exploitation stopped paying." : "the South-Western Front attacked alone and spent its best divisions doing it.") + "\n" +
      "March 1917: " + (flags.stavka_february === "refused" ? "the front commanders declined to advise." : "the front commanders advised abdication.") + "\n" +
      "June 1917: " + (flags.stavka_kerensky === "refused" ? "the offensive was refused." : "the offensive was made.") + "\n" +
      "Autumn 1914: " + (flags.stavka_1914theatre === "prussia" ? "the northern effort was renewed." : "Galicia was reinforced.") + "\n" +
      "The Emperor at headquarters: " + (flags.stavka_commandResult === "steadied" ? "the capital held together in his absence." : flags.stavka_commandResult === "capitallost" ? "the capital did not hold together in his absence." : "the question did not arise.") + "\n" +
      "The Second Army, August 1914: " + (flags.stavka_tannenberg === "halted" ? "halted at the frontier for its supply." : "left to press on.") + "\n" +
      "The Carpathians, March 1915: " + (flags.stavka_carpathians === "halted" ? "halted in the passes to refit." : "pressed on into the mountains.") + "\n" +
      "The Guards, summer 1916: " + (flags.stavka_kovel === "held" ? "kept in reserve." : "sent at the Stokhod for Kovel.") + "\n" +
      "Romania: " + (flags.stavka_romania === "army" ? "an army sent at once." : "three divisions sent.") + "\n" +
      "The death penalty: " + (flags.stavka_deathpenalty === "refused" ? "not restored." : "restored at the front on 12 July 1917.") + "\n" +
      "The Kornilov affair: " + (flags.stavka_kornilov === "obeyed" ? "the dismissal obeyed." : "the dismissal refused, and the march collapsed.") + "\n" +
      "Przemysl, winter 1914: " + (flags.stavka_przemysl === "stormed" ? "assaulted." : "invested and starved out.") + "\n" +
      "Lodz, November 1914: " + (flags.stavka_lodz === "silesia" ? "the Silesian offensive pressed on." : flags.stavka_lodzResult === "covered" ? "the Fifth Army turned north and covered the flank." : "the Fifth Army turned north and the Silesian offensive was given up.") + "\n" +
      "East Prussia, February 1915: " + (flags.stavka_masuria === "pulled" ? "the Tenth Army was drawn back to the Niemen." : "the border line was held and the Twentieth Corps lost.") + "\n" +
      "Sventsiany, September 1915: " + (flags.stavka_sventsiany === "withdrew" ? "the line was shortened." : "the breach was met by counterattack.") + "\n" +
      "Chantilly, December 1915: " + (flags.stavka_chantilly === "declined" ? "no commitment was made." : "Russia joined the plan for simultaneous offensives.") + "\n" +
      "Lake Naroch, March 1916: " + (flags.stavka_naroch === "refused" ? "the French request was declined." : "the offensive was made.") + "\n" +
      "The Romanian Front, December 1916: " + (flags.stavka_romfront === "limited" ? "only the Russian frontier was held." : "a front was formed in Moldavia under the King.") + "\n" +
      "The Allied missions, January 1917: " + (flags.stavka_petrograd === "promised" ? "a spring offensive was promised." : "the great offensives were put off.") + "\n" +
      "Riga, August 1917: " + (flags.stavka_riga === "held" ? "the Twelfth Army was ordered to hold." : "the Twelfth Army withdrew.") + "\n" +
      "The order to open talks: " + (flags.stavka_armistice === "obeyed" ? "carried out." : "declined; Dukhonin dismissed and killed.") + "\n" +
      "October 1917: " + (flags.stavka_october === "resisted" ? "the new authority was refused recognition." : "the headquarters took no side.") + "\n\n" +
      "The officers of this headquarters disperse toward the Don, toward Siberia, and " +
      "toward the new Republic's own army. What they do next is not this war." +
      "\n\n" +
      "What actually happened: The treaty was signed on 3 March 1918 and ratified " +
      "in the weeks after. It was annulled by the armistice of 11 November, and " +
      "the Soviet government repudiated it on 13 November. Poland, Finland and " +
      "the Baltic states became independent, and the rest of the lost territory " +
      "was fought over in the civil war that was already under way."
  },

  stavka_end_disintegration: {
    year: 1917, date: "1917-11-15", city: "Mogilev",
    title: "It Stops Being an Army",
    situation:
      "There is no moment at which this is decided. There are trains, and men on them, " +
      "and each individual departure is a private decision that nobody has the " +
      "authority to prevent.\n\n" +
      "The front is not broken. It is vacated.",
    ending: { family: "disintegration-without-defeat", badge: BADGES.CONTESTED },
    epilogue: () =>
      "An army is an agreement about who gives orders. Once that agreement lapses, " +
      "nothing in the field replaces it.\n\nWhat actually happened: The front did " +
      "dissolve. Desertion had been heavy since the summer, and after the " +
      "revolution of October the armistice signed at Brest-Litovsk on 2 December " +
      "(15 December in the west) only recognised what had occurred. The old army " +
      "was demobilised by decree over the winter of 1917 and 1918, and the men went " +
      "home. Nobody knows how many deserted, and the figures that are given are " +
      "estimates made by people who had reasons to make them large or small. What " +
      "remained of the front's formations was handed to the new government's " +
      "commissars, and some of its officers took what they could and went south.",
  },

  stavka_end_dissolved: {
    year: 1918, date: "1918-01-20", city: "Mogilev",
    title: "Nothing Left to Sign With",
    situation:
      "The formations that remained were spent in a year that had nothing to spend " +
      "them on. What signs at Brest-Litovsk is a delegation representing a state with " +
      "no instrument at all, and the terms reflect it.",
    ending: { family: "harsher-terms-at-brest", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The historical terms were severe. They were signed by people " +
      "who still had something, if only the ability to walk out of the " +
      "room.\n\nWhat actually happened: The Soviet delegation signed the treaty at " +
      "Brest-Litovsk on 3 March 1918, after the German advance of 18 February had " +
      "shown that nothing stood in its way. Russia gave up Poland, the Baltic " +
      "provinces and Ukraine and recognised Finland. Lenin insisted on signing " +
      "against the objections of the colleagues who wanted to go on with a " +
      "revolutionary war, and the terms were as heavy as they were because the " +
      "signatories had so little to bargain with. The treaty took away roughly a " +
      "third of the Empire's population and a great part of its coal, iron and " +
      "grain, and Russia was left with what was behind the line the Germans had " +
      "reached.",
  },

  stavka_end_civilwar: {
    year: 1917, date: "1917-11-20", city: "Novocherkassk",
    title: "The Next War, Early",
    situation:
      "The headquarters refused recognition and the army divided along the line of " +
      "who its soldiers would obey. Formations went south and east with their officers " +
      "or dissolved around them.\n\n" +
      "The German army is still in front of what is left. It will not be the enemy " +
      "that most of these men die fighting.",
    ending: { family: "civil-war-begins-early", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The historical civil war began from the same material a few " +
      "months later. Beginning it here means beginning it with the Germans still in " +
      "the field and the front not yet settled by treaty.\n\nWhat actually " +
      "happened: Alekseyev went to Novocherkassk in November, after the October " +
      "rising, and began to gather the officers who became the Volunteer Army. " +
      "Kornilov escaped from the prison at Bykhov and made his way to the Don. The " +
      "civil war began on the Don that winter, while the German front was left to " +
      "the armistice. The war that most of these officers died in was the one that " +
      "started early in the south, and not the one at the front. The generals' war " +
      "was against the soviets, and in some regions it lasted until 1920 and later.",
  },

  stavka_end_holds: {
    year: 1918, date: "1918-03-03", city: "Mogilev",
    title: "A Front That Was Still There",
    situation:
      "The army was not spent in June and was not asked to answer a political question " +
      "it could not survive answering. It is a smaller army and a worse one than 1914's " +
      "and it is in the field.\n\n" +
      "It does not change what is signed. It changes what the people signing it have " +
      "behind them while they do.",
    ending: { family: "army-holds-into-1918", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. No Russian army of March 1918 was in a condition to affect the " +
      "terms. This ending supposes one marginally less far gone, and claims nothing " +
      "beyond the margin.\n\nWhat actually happened: No part of the front held. The " +
      "Germans resumed the advance on 18 February 1918, when the armistice had run " +
      "out, and the Russian formations that remained, with few officers and fewer " +
      "men, did not resist. Minsk was taken on 21 February, and Kiev on 2 March, " +
      "almost without fighting, and the treaty was signed on 3 March. The army of " +
      "this ending is one that was still there when the Germans arrived, and it was " +
      "not. The treaty that followed was the same treaty, with the same terms, and " +
      "was signed by a government that had been left with the same options.",
  },

  stavka_end_separate: {
    year: 1917, date: "1917-01-15", city: "Petrograd",
    title: "Out, Early, and Alone",
    situation:
      "An approach is made before the capital goes, from an empire that still has a " +
      "front and a government and an army in some order. The terms available are bad. " +
      "They are better than March 1918's, and they cost the alliance permanently.\n\n" +
      "The territory conceded is territory. The alternative on the present trajectory " +
      "is the same territory conceded later by people with nothing to offer.",
    ending: { family: "separate-peace-earlier", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Separate-peace soundings existed and none came to anything. The " +
      "obstacle was never arithmetic. It was that the dynasty could not sign such a " +
      "thing and remain the dynasty.\n\nWhat actually happened: Russia did not " +
      "leave the war on its own initiative in 1917. It was taken out of it by " +
      "revolution, first in March, when the Provisional Government that replaced " +
      "the monarchy pledged to continue the war with the Allies, and again in " +
      "November, when the government that replaced that one did not. The Emperor, " +
      "who in this ending makes a separate peace, did not do so, and the Allies' " +
      "loans went on until the revolution. A separate peace was talked about in the " +
      "Empire's last years, and the talk was one of the things that discredited the " +
      "court.",
  },

  stavka_end_steadied: {
    year: 1918, date: "1918-03-03", city: "Mogilev",
    title: "The Capital Held Together",
    situation:
      "The arrangements in Petrograd did not come apart in the particular way they " +
      "historically did, and the front was not asked to compensate for a government " +
      "that had stopped functioning.\n\n" +
      "The war is still lost in the east and the Empire is still exhausted. What is " +
      "different is that the exhaustion arrives at a state rather than at a vacuum.",
    ending: { family: "political-order-survives-the-war", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative, and the most speculative ending here. It requires the court to " +
      "have behaved differently over eighteen months, which is a great deal to ask " +
      "of a counterfactual.\n\nWhat actually happened: The capital did not hold " +
      "together. The strikes and the mutiny of the Petrograd garrison at the end of " +
      "February, Old Style, brought down the monarchy within about a week, and the " +
      "Emperor abdicated on 2 March (15 March in the west), while he was on his way " +
      "from headquarters to the capital. The political order that this ending " +
      "preserves did not survive the winter, and the army was told afterwards that " +
      "its command had advised it. The army heard of the abdication from its own " +
      "commanders, and its attitude to the Provisional Government that followed was " +
      "formed in the weeks after.",
  },

  stavka_end_alliance: {
    year: 1917, date: "1917-03-02", city: "Pskov",
    title: "Kept Every Promise",
    situation:
      "Every undertaking to the alliance was honoured on the date it was given. East " +
      "Prussia in the first fortnight, the Carpathians in the winter, the supporting " +
      "attacks in 1916, the offensive in the summer of 1917 — each one made when it " +
      "was asked for and with what was to hand.\n\n" +
      "France was not left to fight 1914 alone and Verdun was not left unrelieved. " +
      "The army that did all of it does not exist any more, and the two facts are the " +
      "same fact.",
    ending: { family: "coalition-obligations-honoured", badge: BADGES.CONTESTED },
    epilogue: () =>
      "Whether Russia was spent for the alliance or by its own arrangements is the " +
      "oldest argument about this front. It is not going to be settled " +
      "here.\n\nWhat actually happened: Russia kept its obligations to the Allies " +
      "through 1917. The Provisional Government pledged to fight on and ordered the " +
      "offensive of June, whose failure left the army incapable of another, and the " +
      "Allies continued to supply it and to lend to its government until the " +
      "revolution of November. The army that honoured the promise made to the " +
      "French in 1914 and again in 1917 was not left in a condition to honour " +
      "another. That the Allies' own governments had not done more to equip the " +
      "Russian army before 1917 was a complaint on the Russian side for years.",
  },

  stavka_end_relieved: {
    year: 1917, date: "1917-04-25", city: "Mogilev",
    title: "The Command Is Reorganised",
    situation:
      "No single order did this. There is a record covering three years in which this " +
      "headquarters attached the throne to each successive military outcome, and then " +
      "another authority arrived that had watched it happen.\n\n" +
      "A command that spent the regime's standing to buy operations is not a command " +
      "the successor regime keeps.",
    ending: { family: "hard-mode-relieved", badge: BADGES.CONTESTED, hardModeOnly: true },
    epilogue: () =>
      "The staff is dispersed to other duties. The war continues without them and " +
      "does not go better.\n\nWhat actually happened: Alekseyev was Supreme " +
      "Commander from 2 March to 22 May 1917, when Brusilov replaced him. Brusilov " +
      "was replaced by Kornilov in July, and Kornilov was dismissed in August and " +
      "arrested. The Supreme Command changed hands several times in six months, and " +
      "each change was a political act. The reorganisations this ending describes " +
      "came as the war's own course and did not depend on any one decision. The " +
      "Provisional Government's difficulty in finding a Supreme Commander who both " +
      "the army and the ministers trusted was one of the signs of its weakness. " +
      "None of them held the post long enough to carry out a plan of his own, and " +
      "the army noticed.",
  },
};
