// =============================================================================
// GERMAN OHL — HISTORICAL SPINE
// =============================================================================
//
// Twenty-three decision nodes, 1914 to the armistice, and nine endings. Facts and
// the attested wording of each choice are logged in claims/ as they are written.
//
// SOURCING NOTE. Advisors carry `position`, not `quote`. Nothing in this file
// puts words in quotation marks in a real person's mouth unless the wording is
// attested. See the note in CLAUDE.md — this is a deliberate departure from the
// 1940/1941 convention.
// =============================================================================

CAMPAIGNS.ohl.startNode = "ohl_1914_01_aufmarsch";

CAMPAIGNS.ohl.commanders = [
  { id: "moltke", name: "Moltke", title: "Chief of the General Staff",
    from: "1914-08-01", to: "1914-09-14" },
  { id: "falkenhayn", name: "Falkenhayn", title: "Chief of the General Staff",
    from: "1914-09-15", to: "1916-08-29" },
  { id: "hl", name: "Hindenburg and Ludendorff", title: "Third Supreme Command",
    from: "1916-08-30", to: "1918-11-11" },
];

CAMPAIGNS.ohl.advisors = [
  { id: "moltke", name: "Moltke", from: "1914-08-01", to: "1914-09-14",
    dossier: { role: "Chief of the General Staff, 1906-1914",
      bio: "Held the General Staff for eight years and inherited a deployment plan built around a decisive right wing. Directed the opening campaign from Luxembourg, far from armies he could not reliably reach by wire.",
      fate: "Relieved on 14 September 1914 and given the deputy General Staff in Berlin. Died in Berlin in June 1916." } },
  { id: "hentsch", name: "Hentsch", from: "1914-08-01", to: "1914-09-14",
    dossier: { role: "Lieutenant Colonel, intelligence section, OHL",
      bio: "Sent to the army headquarters on the right in September 1914 with oral instructions, because the Supreme Command could not see the front and could not reliably signal it.",
      fate: "OHL later confirmed he had acted correctly in ordering the withdrawal. Some senior officers never accepted it." } },
  { id: "falkenhayn", name: "Falkenhayn", from: "1914-09-14", to: "1916-08-29",
    dossier: { role: "Prussian Minister of War; Chief of the General Staff, 1914-1916",
      bio: "Took the General Staff after the Marne while still Minister of War. Doubted a decisive result was available in the east and looked for one in the west.",
      fate: "Removed on 29 August 1916. Later held field commands in Romania and the Ottoman theatre. Died in 1922." } },
  { id: "knobelsdorf", name: "Schmidt von Knobelsdorf", from: "1914-09-15", to: "1916-08-29",
    dossier: { role: "Chief of Staff, Fifth Army",
      bio: "Chief of staff to the Crown Prince's Fifth Army and the officer who had to turn the Meuse directive into an operation.",
      fate: "Recorded Falkenhayn using the language of exsanguination in planning the offensive." } },
  { id: "crownprince", name: "Crown Prince Wilhelm", from: "1914-09-15", to: "1918-11-11",
    dossier: { role: "Commander, Fifth Army",
      bio: "Commanded the army given the Meuse. Read the directive as an instruction to take the fortress, and said afterwards that no strategy of exhaustion had been explained to him.",
      fate: "Went into exile in the Netherlands after the war." } },
  { id: "hindenburg", name: "Hindenburg", from: "1916-08-29", to: "1918-11-11",
    dossier: { role: "Chief of the General Staff from August 1916",
      bio: "Brought west from the eastern command with Ludendorff after Verdun stalled, the Somme opened, Brusilov's offensive broke the Austrian front and Romania entered the war.",
      fate: "Later President of the Republic." } },
  { id: "ludendorff", name: "Ludendorff", from: "1916-08-29", to: "1918-11-11",
    dossier: { role: "First Quartermaster General",
      bio: "Formally Hindenburg's subordinate and in practice the operational will of the Third Supreme Command.",
      fate: "Left for Sweden in November 1918." } },
  { id: "holtzendorff", name: "Holtzendorff", from: "1915-09-01", to: "1918-08-11",
    dossier: { role: "Chief of the Admiralty Staff",
      bio: "Authored the memorandum of 22 December 1916 arguing that unrestricted submarine warfare could force Britain out within months.",
      fate: "The tonnage projections were not met. Left the Admiralty Staff in 1918." } },
  { id: "bethmann", name: "Bethmann Hollweg", from: "1914-08-01", to: "1917-07-13",
    dossier: { role: "Imperial Chancellor",
      bio: "Argued through 1916 that unrestricted submarine warfare would bring the United States into the war and that the decision rested with the Kaiser rather than the Supreme Command.",
      fate: "Left the chancellorship in July 1917." } },
  { id: "kuhl", name: "Kuhl", from: "1916-08-29", to: "1918-11-11",
    dossier: { role: "Chief of Staff, Army Group Crown Prince Rupprecht",
      bio: "Chief of staff to the army group on the British front from the autumn of 1916. Argued for giving up the Somme bulge and going back to the new position behind it, and planned the withdrawal that followed.",
      fate: "Wrote extensively on the war and its operations after it. Died in 1958." } },
  { id: "tappen", name: "Tappen", from: "1914-08-01", to: "1916-08-29",
    dossier: { role: "Head of the Operations Division, OHL",
      bio: "Retained at the head of operations across the change of Chief in 1914, one of the few continuities through the transition.",
      fate: "Moved to a field command." } },
];

CAMPAIGNS.ohl.bulletinVoice = {
  source: "Official communiqué of the Supreme Command, as carried by the German press under wartime censorship",
  register: "Impersonal, forward-looking, never conceding a reverse in the language of a reverse",
  defined: true,
};

CAMPAIGNS.ohl.hardMode.forcedEndingId = "ohl_end_relieved";
// Set from measured distribution (measure-erosion.js, montecarlo.js hard): 13 of 48
// choices are erosion-tagged and the historical line carries five of them, so at 7
// the historical run survives and a player who keeps spending standing is relieved.
CAMPAIGNS.ohl.hardMode.erosionMax = 7;

CAMPAIGNS.ohl.nodes = {

  // ---------------------------------------------------------------- 1914-08
  ohl_1914_01_aufmarsch: {
    year: 1914, date: "1914-08-04", city: "Koblenz",
    title: "The Weight on the Right",
    advisors: ["moltke", "tappen"],
    situation:
      "The deployment rests on one proposition inherited from Schlieffen and modified " +
      "every year since: that the decisive weight falls on the right, swings wide " +
      "through Belgium, and that everything else in the line exists to make that " +
      "possible. Belgian neutrality is guaranteed by treaty, and the guarantee is " +
      "British.\n\n" +
      "Lorraine is the difficulty. The French will attack there, and the armies on the " +
      "left want to meet them and win something. Every corps that goes to Lorraine is " +
      "a corps not on the right, and the plan was never designed to do both.",
    context:
      "Supreme Command will direct this from Koblenz, and later from Luxembourg — " +
      "hundreds of kilometres behind armies it cannot see. There is no army group " +
      "headquarters between the Chief and seven army commanders. Wireless between the " +
      "Supreme Command and the individual armies is not reliably established, and what " +
      "there is will contend with interference from Paris.",
    choices: [
      {
        id: "right",
        label: "Hold the right at the weight the plan requires — give ground in Lorraine",
        historical: true,
        advisor: { name: "Moltke", position:
          "The plan has one idea in it. Anything that dilutes the right dilutes the only idea." },
        impact: { manpower: 0, munitions: -1, will: 0 },
        setFlags: { ohl_lorraine: "conceded" },
        next: "ohl_1914_12_twocorps",
        outcome:
          "The right goes forward at weight. Lorraine gives ground it was always " +
          "expected to give, and the newspapers there will have to be managed.",
      },
      {
        id: "lorraine",
        label: "Reinforce Lorraine — take the victory the left is offering",
        advisor: { name: "Tappen", position:
          "A beaten French army in Lorraine is a real result. The right can be strong enough without being everything." },
        impact: { manpower: -1, munitions: 0, will: 1 },
        setFlags: { ohl_lorraine: "reinforced" },
        erodes: "spend_will",
        next: "ohl_1914_12_twocorps",
        outcome:
          "Corps go south. There is fighting in Lorraine that the plan did not ask " +
          "for, and the right wing goes forward lighter than the plan assumed.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-08
  ohl_1914_12_twocorps: {
    year: 1914, date: "1914-08-25", city: "Koblenz",
    title: "Two Corps for the East",
    advisors: ["moltke", "tappen"],
    situation: (flags) =>
      "The news from East Prussia comes in pieces and none of it is good. Eighth Army has " +
      "had a new commander and a new chief of staff for two days. Russian armies are " +
      "across the frontier in two places, and the province is emptying of people ahead " +
      "of them.\n\n" +
      "In the west the reports are of victory on every sheet. Namur has fallen. The " +
      "French are falling back along the whole front, and the right wing is still " +
      "advancing, at the end of what its men and horses can do.\n\n" +
      (flags.ohl_lorraine === "reinforced"
        ? "The corps sent to Lorraine are not on the right to be counted, so anything " +
          "taken from it now is taken from a wing that was already lighter than the plan assumed."
        : "The right went forward at the weight the plan asked for, so any corps taken " +
          "from it now is a corps the plan counted on."),
    context:
      "The Supreme Command holds no reserve of its own. Anything sent east has to be " +
      "taken from an army in the line and put on a train, and a corps on a train is " +
      "fighting nowhere for as long as the journey lasts.",
    choices: [
      {
        id: "send",
        label: "Send the Guard Reserve Corps and XI Corps east by rail",
        historical: true,
        advisor: { name: "Moltke", position:
          "The war in the west is as good as won, and a province of the Empire is being overrun. Two corps from the winning wing is not too much to ask." },
        impact: { manpower: -1, munitions: 0, will: 0 },
        setFlags: { ohl_twocorps: "sent" },
        next: "ohl_1914_02_marne",
        outcome:
          "The Guard Reserve Corps comes out of Second Army and XI Corps out of Third, and " +
          "both are on the railways the same day. The battle in East Prussia is fought and " +
          "won without them; they detrain after it is over. The right wing goes on in the " +
          "west two corps lighter than it was on the morning the order was written.",
      },
      {
        id: "keep",
        label: "Keep both corps on the right wing and leave the east to the army already there",
        advisor: { name: "Tappen", position:
          "A corps taken off the right is a corps the plan counted on. The east can be held on the ground it has. The west can only be won at weight." },
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { ohl_twocorps: "kept" },
        next: "ohl_1914_02_marne",
        outcome:
          "Speculative. Both corps stay where the plan put them. The new command in East " +
          "Prussia fights with the army it has, and the right wing goes forward at a " +
          "strength the plan could count on.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-09
  ohl_1914_02_marne: {
    year: 1914, date: "1914-09-08", city: "Luxembourg",
    title: "A Gap No One at Headquarters Can See",
    advisors: ["moltke", "hentsch"],
    bulletin: {
      voice: "ohl", date: "1914-09-07", source: "Official communiqué",
      text:
        "The armies in France continue their advance according to plan. The enemy " +
        "withdraws before them. Reports of a French concentration before Paris are " +
        "without operational significance.",
    },
    situation: (flags) =>
      "First and Second Armies have opened a gap between them wide enough to march " +
      "an army through, and the French have found it. Supreme Command is a hundred " +
      "and fifty miles away with no reliable wire to the armies concerned and no " +
      "means of seeing the ground.\n\n" +
      (flags.ohl_lorraine === "reinforced"
        ? "The right was never at the strength the plan assumed. What is happening now " +
          "was implicit in the corps sent to Lorraine six weeks ago."
        : "The right went forward at full weight and has arrived at the end of what " +
          "men and horses can do.") +
      (flags.ohl_twocorps === "sent"
        ? "\n\nTwo corps that would have stood on the right are in East Prussia, and the " +
          "wing is thinner by that much."
        : flags.ohl_twocorps === "kept"
          ? "\n\nBoth corps the east asked for stayed on the right, and the wing is at " +
            "the strength the plan asked for."
          : "") +
      "\n\nWhat to order is not the difficulty. Knowing what to order is.",
    context:
      "An officer sent forward with oral instructions and the authority of the " +
      "Supreme Command can act on what he finds. He can also close the campaign " +
      "on his own judgment, in the Chief's name, before the Chief has heard of it.",
    choices: [
      {
        id: "hentsch",
        label: "Send Hentsch forward with plenipotentiary authority and oral instructions",
        historical: true,
        advisor: { name: "Hentsch", position:
          "I know the sector already. I will need to be able to act on what I find, not report it and wait." },
        impact: { manpower: -1, munitions: 0, will: -1 },
        setFlags: { ohl_marne: "delegated" },
        dispute:
          "Historians divide on where responsibility for the Marne withdrawal lies. " +
          "One line holds that Moltke had lost control of the armies during August and " +
          "could not react when the battle developed; another places the immediate cause " +
          "with Kluck's First Army losing contact with Bülow's Second and opening the gap. " +
          "Whether Hentsch's intervention rescued a collapsing position or ended a " +
          "recoverable one was disputed by senior officers at the time and is disputed still.",
        uncertain: [
          { weight: 55, title: "The withdrawal is ordered and the armies come out intact", historicalBranch: true,
            impact: { manpower: 0, will: -1 },
            setFlags: { ohl_marneResult: "orderly" },
            next: "ohl_1914_03_succession",
            outcome:
              "Hentsch reaches Second Army, finds Bülow already resolved on withdrawal to " +
              "close the gap, and agrees. First and Third Armies are compelled to conform. " +
              "The armies come back to the Aisne in order and begin to dig. Whether they " +
              "were rescued or robbed is argued about at every level of the officer corps, " +
              "and will be argued about long after everyone involved is dead." },
          { weight: 45, title: "The order arrives late and the withdrawal is ragged",
            impact: { manpower: -1, will: -2 },
            setFlags: { ohl_marneResult: "ragged" },
            next: "ohl_1914_03_succession",
            outcome:
              "The instruction reaches the armies unevenly and they break contact at " +
              "different hours. The line on the Aisne is held, but the cost of getting to " +
              "it is higher than it needed to be, and the recriminations start before the " +
              "digging does." },
        ],
      },
      {
        id: "goforward",
        label: "Go forward to the armies yourself and judge the ground in person",
        advisor: { name: "Moltke", position:
          "If the decision is this large it should not be taken by a lieutenant colonel carrying my authority in his pocket." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        gate: (m) => m.manpower >= 0,
        disabledReason: "The armies cannot be left unattended at this strength",
        setFlags: { ohl_marne: "inperson" },
        next: "ohl_1914_03_succession",
        outcome:
          "Speculative. Supreme Command leaves Luxembourg for the front. Whatever is " +
          "gained in judgment is lost in the days it takes to get there and the hours " +
          "in which no one at all is directing seven armies. The withdrawal to the " +
          "Aisne happens regardless; only the authorship changes.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-09
  ohl_1914_03_succession: {
    year: 1914, date: "1914-09-14", city: "Luxembourg",
    title: "The Seat Changes Hands",
    advisors: ["falkenhayn", "tappen"],
    situation: (flags) =>
      "The Military Cabinet informs Moltke that His Majesty considers it too painful " +
      "for him to continue directing operations. Falkenhayn, the Prussian Minister of " +
      "War, takes the General Staff — informally now, formally in October — and holds " +
      "both offices at once.\n\n" +
      (flags.ohl_marneResult === "ragged"
        ? "The manner of the withdrawal has made the change easier to justify and " +
          "harder to survive politically."
        : "The armies are intact on the Aisne. The change is made anyway.") +
      "\n\nWhat arrives with the new Chief is not a new plan. It is the recognition " +
      "that the old one has been spent, and that the war now has to be won by some " +
      "method nobody in this building has yet described.",
    context:
      "Tappen stays at the head of the Operations Division across the transition. " +
      "The office continues; the man does not. Every commitment made before today is " +
      "inherited whole.",
    choices: [
      {
        id: "west",
        label: "Look for the decision in the west — the enemy that can actually be beaten",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "Russia can be pushed back a very long way without ever being finished. Britain and France can be finished. That is where the war is." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { ohl_theatre: "west" },
        next: "ohl_1914_13_ypres",
        outcome:
          "The Supreme Command's weight stays in the west. The eastern command will " +
          "argue against this for two years, and will eventually argue its way into " +
          "this building.",
      },
      {
        id: "east",
        label: "Shift the weight east — finish Russia first",
        advisor: { name: "Hindenburg", position:
          "Space in the east is not an argument against victory there. It is the reason victory there is possible." },
        impact: { manpower: -1, munitions: -1, will: 1 },
        setFlags: { ohl_theatre: "east" },
        erodes: "spend_will",
        next: "ohl_1914_13_ypres",
        outcome:
          "Speculative. Divisions go east that historically stayed west. The eastern " +
          "command gets the resources it spent two years demanding, and acquires the " +
          "responsibility that comes with them.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-11
  ohl_1914_13_ypres: {
    year: 1914, date: "1914-11-04", city: "Ypres",
    title: "The Channel Ports",
    advisors: ["falkenhayn", "tappen"],
    situation:
      "Antwerp has fallen and the race to the sea has ended without a result. What is " +
      "left of the plan is the coast. If the line can be broken at Ypres, the Channel " +
      "ports lie behind it, and so do the British army's communications with them.\n\n" +
      "Fourth Army is made up largely of reserve corps raised since August, men with a " +
      "few weeks' training behind them. Their first assaults near Langemarck went in in " +
      "mass and lost very heavily for little ground.\n\n" +
      "The east is asking for every corps that can be spared. Winter is close, and with " +
      "it the end of the season for attacking anywhere.",
    context:
      "Falkenhayn took the General Staff to find a way of winning, and the coast is the " +
      "last open place for it in the west. A Chief who stops here has to say what he " +
      "will do instead.",
    choices: [
      {
        id: "press",
        label: "Make one more concentrated attack at Ypres before the winter",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "The coast is the one place in the west where a result is still possible. If it is not taken now it will not be taken." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        setFlags: { ohl_flanders: "pressed" },
        next: "ohl_1915_14_gorlice",
        outcome:
          "The last concentrated attack goes in in the second week of November, with fresh " +
          "divisions and a heavy bombardment. It makes ground at several points and does " +
          "not make the breakthrough, and the local fighting dies away by the end of the " +
          "month. The front in Flanders has settled into lines that will move very little " +
          "for years.",
      },
      {
        id: "break",
        label: "Break off in Flanders and send the fresh divisions east for the winter",
        advisor: { name: "Hindenburg", position:
          "The east is the front where Russia can still be hurt this year. A division in Flanders is a division the eastern armies do not have." },
        impact: { manpower: 1, munitions: 1, will: 0 },
        setFlags: { ohl_flanders: "broken" },
        next: "ohl_1915_14_gorlice",
        outcome:
          "Speculative. The attack is cancelled with the Channel ports still behind the " +
          "British line, and the fresh divisions go east by rail. The eastern armies go " +
          "into the winter stronger than they were. The front in the west stays where " +
          "the autumn left it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-04
  ohl_1915_14_gorlice: {
    year: 1915, date: "1915-04-15", city: "Gorlice",
    title: "Where the Ally Is Breaking",
    advisors: ["falkenhayn", "tappen"],
    situation: (flags) =>
      "The Austro-Hungarian army fought through the winter in the Carpathians at heavy " +
      "cost. Przemyśl has fallen with its whole garrison. Conrad has told Berlin that " +
      "the army cannot hold the Carpathians without German help, and Falkenhayn fears " +
      "that if it does not get it Vienna will look for a separate peace.\n\n" +
      (flags.ohl_theatre === "east"
        ? "The weight of the Supreme Command is already in the east, and the argument is " +
          "about how it is to be used."
        : "The weight of the Supreme Command is in the west, and anything sent east is " +
          "taken from it.") +
      "\n\nHindenburg and Ludendorff want an offensive out of East Prussia and Courland " +
      "to cut off the Russian armies in Poland. Falkenhayn thinks it would take more " +
      "divisions than he can spare and commit the army to the depths of Russia, where " +
      "no end can be reached.",
    context:
      "A breakthrough pushes the enemy back. An envelopment, if it works, destroys him. " +
      "The first costs a few corps and a few weeks. The second costs more of both, and " +
      "needs the enemy to stay where he is while it is prepared.",
    choices: [
      {
        id: "gorlice",
        label: "Form a new army under Mackensen and break through at Gorlice and Tarnów",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "An ally that collapses takes the whole eastern front with it. A breakthrough relieves it and costs a fraction of what a campaign in Russia would." },
        impact: { manpower: 0, munitions: -1, will: 1 },
        setFlags: { ohl_gorlice: "mackensen" },
        next: "ohl_1915_15_serbia",
        outcome:
          "An Eleventh Army is made up under Mackensen and moved to Galicia by rail. The " +
          "offensive opens on 2 May and the Russian front in western Galicia gives way. By " +
          "the end of the summer Russia has lost Poland and part of the Baltic provinces, " +
          "and its armies have been driven back some hundreds of miles without being " +
          "destroyed. Hindenburg and Ludendorff count it as a victory that was not used " +
          "for an encirclement; Falkenhayn counts it as the result the operation was " +
          "designed to produce.",
      },
      {
        id: "envelop",
        label: "Back Hindenburg's plan: a wide envelopment out of East Prussia and Courland",
        advisor: { name: "Hindenburg", position:
          "Break the Russian front where it stands and the Russian army walks away. Go round it, and it does not." },
        gate: (m) => m.manpower >= -1,
        disabledReason: "There are not the divisions for both a relief of the ally and an envelopment",
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { ohl_gorlice: "envelop" },
        erodes: "spend_will",
        next: "ohl_1915_15_serbia",
        outcome:
          "Speculative. Divisions are drawn east in larger numbers than the Galician plan " +
          "needed, for an operation whose object is to encircle the Russian armies in " +
          "Poland. The Austro-Hungarian front has to hold with what it has in the " +
          "meantime, and the west is left with whatever is not needed elsewhere.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-09
  ohl_1915_15_serbia: {
    year: 1915, date: "1915-09-06", city: "Belgrade",
    title: "A Road to Constantinople",
    advisors: ["falkenhayn", "tappen"],
    situation:
      "Bulgaria has signed with the Central Powers. The military convention puts " +
      "German, Austro-Hungarian and Bulgarian armies under Mackensen, with the task of " +
      "defeating the Serbian army and opening a land connection between Hungary and " +
      "Bulgaria.\n\n" +
      "That connection is the only way to get German guns and shells to the Ottoman " +
      "Empire, which has held the Dardanelles since the landings in April and is short " +
      "of both.\n\n" +
      "The price is divisions taken from other fronts in the season when the Allies " +
      "attack in the west.",
    context:
      "The Serbian army has turned back three Austro-Hungarian invasions. A campaign " +
      "against it has to be fast, and finished before the weather closes the mountain " +
      "roads.",
    choices: [
      {
        id: "serbia",
        label: "Agree the campaign: attack Serbia under Mackensen in October",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "A line open to Constantinople shuts the Balkans against the Entente and feeds the Turks. It takes a handful of divisions and a month." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { ohl_serbia: "attacked" },
        next: "ohl_1916_04_verdun",
        outcome:
          "The attack opens in the first week of October, from the north and, with the " +
          "Bulgarian armies, from the east. Belgrade falls within days. The Serbian army " +
          "and a long column of civilians retreat west and south over the mountains of " +
          "Albania in the winter. By the new year German supplies are moving to " +
          "Constantinople by rail.",
      },
      {
        id: "wait",
        label: "Decline the Balkan commitment and keep every division in the west for the autumn",
        advisor: { name: "Tappen", position:
          "The Allies attack in the west in the autumn. A division sent to Serbia is a division the line will want in October." },
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { ohl_serbia: "declined" },
        next: "ohl_1916_04_verdun",
        outcome:
          "Speculative. The Serbian army is left alone and the divisions stay in France " +
          "and Belgium. The land route to Constantinople stays closed, and the Ottoman " +
          "army goes on short of what Germany could have sent it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-02
  ohl_1916_04_verdun: {
    year: 1916, date: "1916-02-21", city: "Verdun",
    title: "The Meuse",
    advisors: ["falkenhayn", "knobelsdorf", "crownprince"],
    bulletin: {
      voice: "ohl", date: "1916-02-20", source: "Official communiqué",
      text:
        "Local operations are in preparation on the Meuse. The Supreme Command has " +
        "no announcement to make regarding their scope.",
    },
    situation:
      "The French have stripped the fortress belt around Verdun of heavy guns and " +
      "men. More than a dozen railways can feed the sector. The ground is available.\n\n" +
      "What is not agreed, inside this headquarters, is what the operation is for. " +
      "One reading is that the Meuse is where the French army can be drawn in and " +
      "destroyed by artillery — that the objective is the French army rather than the " +
      "city. The other is that Verdun is a fortress and fortresses are taken. The " +
      "Fifth Army has been given a directive that can be read either way, and its " +
      "commander has read it the second way.",
    context:
      "Two and a half million shells are laid up. Five divisions are promised to " +
      "Fifth Army. Whichever reading is correct, the artillery programme is the same " +
      "for the first week — which is exactly why the ambiguity has survived this long.",
    choices: [
      {
        id: "attrition",
        label: "Make the object the French army — hold the ground, let them counter-attack into the guns",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "They will not give up Verdun. That is the point of choosing it. We do not need the city if they will spend the army defending it." },
        impact: { manpower: -1, munitions: -2, will: -1 },
        setFlags: { ohl_verdun: "attrition" },
        dispute:
          "Falkenhayn's own account rests on a memorandum he says he gave the Kaiser " +
          "around Christmas 1915. The original has never been found; the Prussian army " +
          "archives burned in 1945 and definitive confirmation is no longer possible. " +
          "Some historians treat it as postwar self-justification for an attack that " +
          "simply failed. Foley's reconstruction sets the memorandum aside entirely and " +
          "builds the case from other evidence. Against that, Knobelsdorf, the Crown " +
          "Prince and the Kaiser's adjutant Plessen each separately recorded Falkenhayn " +
          "using the language of exsanguination while planning the offensive.",
        uncertain: [
          { weight: 45, title: "Fifth Army executes the directive as written",
            impact: { manpower: 0 },
            setFlags: { ohl_verdunExec: "asdirected" },
            next: "ohl_1916_14_somme",
            outcome:
              "The guns do the work and the infantry is not spent taking ground for its " +
              "own sake. The French come on to the artillery as expected. The ledger is " +
              "grim on both sides and the German column of it is smaller than it might " +
              "have been." },
          { weight: 55, title: "Fifth Army reads the directive as an order to take the fortress", historicalBranch: true,
            impact: { manpower: -2, will: -1 },
            setFlags: { ohl_verdunExec: "fortress" },
            next: "ohl_1916_14_somme",
            outcome:
              "The Crown Prince's headquarters takes the instruction to mean the city, " +
              "and the operation becomes what the directive was meant to avoid: German " +
              "infantry attacking prepared positions on ground that has no value except " +
              "that the attack has already been made for it. The distinction between " +
              "the two readings stops mattering somewhere in March." },
        ],
      },
      {
        id: "elsewhere",
        label: "Decline the Meuse — hold in the west and wait for the enemy to attack first",
        advisor: { name: "Crown Prince Wilhelm", position:
          "If the object is really the French army and not the city, then say so plainly, or do not begin." },
        impact: { manpower: 1, munitions: 1, will: -2 },
        gate: (m) => m.will >= 1,
        disabledReason: "A year without an offensive cannot be explained at home from here",
        setFlags: { ohl_verdun: "declined" },
        erodes: "spend_will",
        next: "ohl_1916_14_somme",
        outcome:
          "Speculative. No offensive on the Meuse. The shells and the five divisions " +
          "stay in hand and the army in the west spends 1916 waiting — which is a " +
          "coherent strategy and an intolerable one to explain to a country that has " +
          "been told the war is being won.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-07
  ohl_1916_14_somme: {
    year: 1916, date: "1916-07-02", city: "Charleville",
    title: "No Ground to Give",
    advisors: ["falkenhayn", "tappen"],
    situation: (flags) =>
      "The British and French attacked on the Somme yesterday, after a week of " +
      "bombardment. In most places the German line has held. At the southern end, " +
      "where French and British lines meet, it has not, and Second Army has to say what " +
      "it will do about ground it has already lost.\n\n" +
      (flags.ohl_verdun === "declined"
        ? "No German army is committed on the Meuse, so the reserves are in hand. They " +
          "are also the only reserves there are."
        : "The reserves are on the Meuse, where the offensive is still being fed. What " +
          "can be spared for the Somme is what the Meuse does not need, which is very " +
          "little.") +
      "\n\nThe question put to the Chief is a rule rather than an operation. Either " +
      "every yard lost is to be retaken at once, or the line may bend.",
    context:
      "A position that is retaken the day after it is lost is held at the price of the " +
      "counter-attack. A position that is given up is held by fewer men, but only if " +
      "the line behind it is ready.",
    choices: [
      {
        id: "hold",
        label: "Order that no ground is to be given up and any ground lost is to be retaken at once",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "A line that gives way once will be asked to give way again. The rule has to be that it does not." },
        impact: { manpower: -2, munitions: -1, will: 0 },
        setFlags: { ohl_somme: "held" },
        next: "ohl_1916_05_relief",
        outcome:
          "The order goes to Second Army in the first days of July. Counter-attacks are " +
          "made at once and, because they are made at once, most of them are made " +
          "piecemeal, against ground the enemy has already begun to fortify. The line holds through the " +
          "summer and the autumn. The cost, counted in the divisions that pass through " +
          "it, is among the heaviest of the war.",
      },
      {
        id: "elastic",
        label: "Let Second Army give up ground where holding it costs more than it is worth",
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { ohl_somme: "elastic" },
        next: "ohl_1916_05_relief",
        outcome:
          "Speculative. Ground is given where it cannot be held cheaply and a second " +
          "line is built behind it. The front moves back by a few kilometres in places. " +
          "Fewer men are lost in counter-attacks, and the retreat has to be explained " +
          "at home as something other than a defeat.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-08
  ohl_1916_05_relief: {
    year: 1916, date: "1916-08-29", city: "Pless",
    title: "Four Things at Once",
    advisors: ["hindenburg", "ludendorff", "falkenhayn"],
    situation: (flags) =>
      "Verdun has not produced what was promised for it. The Somme has opened. " +
      "Brusilov's offensive has broken the Austrian front and had to be shored up " +
      "with German divisions. Romania has come in against us.\n\n" +
      (flags.ohl_verdun === "declined"
        ? "There was no Meuse offensive to fail, which removes one charge and leaves " +
          "the harder one: a year in the west spent waiting, and three reverses " +
          "elsewhere anyway."
        : "Any one of the four could be absorbed. The four together end Falkenhayn's " +
          "tenure on 29 August.") +
      "\n\nHindenburg takes the General Staff. Ludendorff comes with him as First " +
      "Quartermaster General, formally subordinate, in practice not.",
    context:
      "The plan to win the war before 1917 is finished. What replaces it is not a " +
      "plan to win in 1917 but a decision about what the army is for now that it " +
      "cannot force a result on the ground.",
    choices: [
      {
        id: "defensive",
        label: "Go over to the defensive in the west and rebuild — shorten the line",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "We cannot attack in the west next year. Everything follows from admitting that first." },
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { ohl_1917posture: "defensive" },
        next: "ohl_1916_15_programme",
        outcome:
          "The army in the west stops attacking and starts building. The line is " +
          "shortened and the ground given up is left useless behind it. Divisions are " +
          "freed. What they are to be used for is the next question and it is already " +
          "being answered somewhere other than in this building.",
      },
      {
        id: "press",
        label: "Continue the offensive effort in the west through the winter",
        advisor: { name: "Falkenhayn", position:
          "Stopping now concedes that everything spent since February bought nothing." },
        impact: { manpower: -2, munitions: -2, will: 0 },
        gate: (m) => m.munitions >= -1,
        disabledReason: "The shell reserve will not carry a winter offensive",
        setFlags: { ohl_1917posture: "offensive" },
        erodes: "spend_will",
        next: "ohl_1916_15_programme",
        outcome:
          "Speculative. The effort continues into weather and against a Somme front " +
          "that is being reinforced faster than it is being broken. The divisions that " +
          "would have been rebuilt are not rebuilt.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-09
  ohl_1916_15_programme: {
    year: 1916, date: "1916-08-31", city: "Pless",
    title: "Twice the Guns by Spring",
    advisors: ["hindenburg", "ludendorff"],
    situation: (flags) =>
      "The Third Supreme Command has looked at what the army fires and what the " +
      "factories make, and has found them a long way apart. " +
      (flags.ohl_somme === "held"
        ? "The Somme is consuming shells faster than they are being filled."
        : "The Somme is consuming shells at a rate no one had planned for.") +
      "\n\nLudendorff's programme asks for munitions output to be doubled and the " +
      "supply of guns and machine guns to be tripled by the spring of 1917. Doing it " +
      "means skilled men taken from the front and put back in the factories, and every " +
      "man and woman of working age put under an obligation to work, which only a " +
      "law can do.\n\n" +
      "The War Ministry and the industrialists say the targets cannot be met. The " +
      "railways and the coal supply are already stretched.",
    context:
      "A programme this size will be tested not against what factories can make, but " +
      "against the coal that heats them, the wagons that move the coal, and the food " +
      "the workers eat. The Supreme Command has authority over none of the three.",
    choices: [
      {
        id: "full",
        label: "Adopt the programme at full size and ask the Reichstag for a labour service law",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "The war will be decided by what each side can put in the field next year. We have to produce more than the enemy, whatever it takes to do it." },
        impact: { manpower: 0, munitions: 2, will: -1 },
        setFlags: { ohl_programme: "full" },
        next: "ohl_1917_06_pless",
        outcome:
          "The programme is issued on 31 August, and the Auxiliary Service " +
          "Law passes the Reichstag in December, though with amendments that the " +
          "Supreme Command did not want. Output rises, but nowhere near the targets. " +
          "The winter of 1916 and 1917 brings a failed potato harvest, a coal famine " +
          "and a railway system that cannot move what is made. It is remembered as the " +
          "turnip winter.",
      },
      {
        id: "moderate",
        label: "Adopt a smaller programme that the railways and the coal supply can carry",
        advisor: { name: "Tappen", position:
          "A target that cannot be met is worse than a smaller one that can. The army needs the shells it is promised." },
        impact: { manpower: 1, munitions: -1, will: 1 },
        setFlags: { ohl_programme: "moderate" },
        next: "ohl_1917_06_pless",
        outcome:
          "Speculative. The targets are set below what the Supreme Command asked for " +
          "and nearer what the economy could deliver. Fewer skilled men are taken from " +
          "the front, and less is demanded of the railways. The army has fewer guns in " +
          "the spring than it would have had if the programme had been met, and it has " +
          "fewer than it was told to expect.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-01
  ohl_1917_06_pless: {
    year: 1917, date: "1917-01-09", city: "Pless",
    title: "Six Months, by Arithmetic",
    advisors: ["holtzendorff", "bethmann", "ludendorff", "hindenburg"],
    bulletin: {
      voice: "ohl", date: "1917-01-05", source: "Official communiqué",
      text:
        "The peace offer of December has been declined by the enemy governments. The " +
        "Supreme Command notes that the responsibility for the continuation of the war " +
        "now rests where the refusal was made.",
    },
    situation:
      "Holtzendorff's memorandum of 22 December sets out the case in figures: " +
      "unrestricted submarine warfare, six hundred thousand tons a month, and Britain " +
      "is out inside six months — before American strength could be raised, shipped " +
      "and brought to bear. The paper has the appearance of arithmetic and the " +
      "backing of every senior soldier in the Empire.\n\n" +
      "The Chancellor's objection is not about tonnage. It is that this brings the " +
      "United States in, that the figures assume everything runs as projected, and " +
      "that if the six months pass without Britain breaking, there is no second plan " +
      "and a new enemy with no upper limit on its manpower.",
    context:
      "Bethmann Hollweg has maintained throughout that the decision belongs to the " +
      "Kaiser rather than to the Supreme Command. The Crown Council at Pless is the " +
      "form that insistence finally takes. The Kaiser had resisted the memorandum; " +
      "the Entente's rejection of the December peace offer moved him.",
    choices: [
      {
        id: "unrestricted",
        label: "Unrestricted submarine warfare from 1 February",
        historical: true,
        advisor: { name: "Holtzendorff", position:
          "The tonnage figures are conservative and the timetable holds. Six months is not a hope, it is a calculation." },
        impact: { manpower: 0, munitions: 1, will: 2 },
        setFlags: { ohl_usw: "unrestricted", ohl_usEntry: "certain" },
        next: "ohl_1917_12_alberich",
        outcome:
          "The order is signed on the evening of 9 January and the campaign opens on " +
          "1 February. The early months exceed the projection — April alone runs past " +
          "eight hundred thousand tons. Britain does not leave the war. The United " +
          "States enters it. Both of those were foreseen in this room by different " +
          "people, and the arithmetic was believed over the objection.",
      },
      {
        id: "restricted",
        label: "Hold to restricted warfare and keep the Americans out",
        advisor: { name: "Bethmann Hollweg", position:
          "If the six months pass and Britain is still in, we will have added an enemy and have nothing left to add ourselves." },
        impact: { manpower: 0, munitions: -1, will: -2 },
        gate: (m) => m.will >= -1,
        disabledReason: "The Supreme Command no longer has the standing to overrule the naval staff",
        setFlags: { ohl_usw: "restricted", ohl_usEntry: "deferred" },
        erodes: "spend_will",
        next: "ohl_1917_12_alberich",
        outcome:
          "Speculative. The U-boats stay under prize rules, American neutrality is not " +
          "forced, and the war in the west continues on the ground with no instrument " +
          "for changing it. The Supreme Command has declined the only decisive-looking " +
          "option it had and now has to find another.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-02
  ohl_1917_12_alberich: {
    year: 1917, date: "1917-02-04", city: "Pless",
    title: "Back to the Siegfried Line",
    advisors: ["kuhl", "ludendorff"],
    bulletin: {
      voice: "ohl", date: "1917-02-02", source: "Official communiqué",
      text:
        "The Supreme Command has taken every measure for the security of the western " +
        "front through the coming spring. No change in the position is contemplated.",
    },
    situation: (flags) =>
      "Behind the Somme front, since September, a new position has been under " +
      "construction: concrete, wire and deep dugouts, on a line that cuts across the " +
      "base of the great bulge the front now makes between Arras and the Aisne. It is " +
      "shorter by some forty kilometres and needs thirteen or fourteen fewer divisions " +
      "to hold it.\n\n" +
      "Crown Prince Rupprecht's army group has asked for permission to go back to it. " +
      "The army commanders in the bulge do not want to go. Ludendorff has resisted " +
      "giving up ground that cost so much to hold.\n\n" +
      (flags.ohl_usw === "unrestricted"
        ? "The submarine campaign began on 1 February, and the army's part in it is to " +
          "free divisions for the spring. A shortened line would do that."
        : "The army has no new instrument for ending the war, and the next campaign has " +
          "to be fought with what the line can spare.") +
      "\n\nIf the army goes back, the ground it leaves will be of use to whoever " +
      "follows it. The only argument is about whether it should be.",
    context:
      "The retirement would take about six weeks to prepare. What is left behind has " +
      "to be decided before it begins, since the order will have to go out down to the " +
      "pioneers who carry it out.",
    choices: [
      {
        id: "devastate",
        label: "Withdraw to the new line and destroy what the enemy could use in the ground left behind",
        historical: true,
        advisor: { name: "Kuhl", position:
          "To go on holding the bulge is to wear out the divisions holding it. A shorter line gives them back." },
        impact: { manpower: 3, munitions: 0, will: -1 },
        setFlags: { ohl_alberich: "devastated" },
        next: "ohl_1917_07_chancellor",
        outcome:
          "The Kaiser's order is signed on 4 February, and the army begins to go back " +
          "in March. Roads are mined, wells fouled, villages burned, orchards cut and " +
          "the civilian population sent away. The British and French follow into " +
          "empty country and take weeks to bring up their railways. The destruction " +
          "is reported across neutral countries, and it does the army's name no good.",
      },
      {
        id: "spare",
        label: "Withdraw to the new line, leaving the ground as it is",
        advisor: { name: "Crown Prince Rupprecht", position:
          "The ground can be given up without being destroyed. The destruction harms Germany's name abroad more than it harms the enemy." },
        impact: { manpower: 2, munitions: 0, will: 0 },
        setFlags: { ohl_alberich: "spared" },
        next: "ohl_1917_07_chancellor",
        outcome:
          "Speculative. The army goes back to the new line, and the villages and roads " +
          "behind it are left standing. The enemy moves up faster than he did. The " +
          "retirement frees the divisions it was meant to free, and no report of " +
          "burned villages goes to the neutral press.",
      },
      {
        id: "stay",
        label: "Refuse the withdrawal and hold the bulge through the summer",
        advisor: { name: "Ludendorff", position:
          "Ground that has been paid for in blood should not be given up without a battle." },
        gate: (m) => m.manpower >= 0,
        disabledReason: "The divisions that would hold the longer line are not there",
        impact: { manpower: -2, munitions: -1, will: 0 },
        setFlags: { ohl_alberich: "held" },
        erodes: "spend_will",
        next: "ohl_1917_07_chancellor",
        outcome:
          "Speculative. The army stays in the bulge. The new line is finished and " +
          "empty behind it. The enemy attacks the old line in the spring, with the " +
          "divisions that would have been freed still in it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-07
  ohl_1917_07_chancellor: {
    year: 1917, date: "1917-07-13", city: "Berlin",
    title: "A Civilian Who Says No",
    advisors: ["ludendorff", "hindenburg", "bethmann"],
    bulletin: {
      voice: "ohl", date: "1917-07-11", source: "Official communiqué",
      text:
        "The Supreme Command has laid before His Majesty its view of the requirements " +
        "of the military situation. It regards the unity of the war effort as the " +
        "first of those requirements.",
    },
    situation: (flags) =>
      "The Reichstag is drafting a resolution for a peace without annexations. The " +
      "Chancellor will not fight it, and the Supreme Command has concluded that a " +
      "Chancellor who will not fight it cannot remain.\n\n" +
      (flags.ohl_usw === "unrestricted"
        ? "Bethmann Hollweg opposed the submarine decision in January and was overruled. " +
          "Six months on, the tonnage has not produced a British collapse and the " +
          "Americans have declared. His judgment is looking better than the arithmetic " +
          "that beat it, which is its own kind of problem for this headquarters."
        : "Bethmann Hollweg carried the January council and the Americans stayed out. " +
          "The Supreme Command lost that argument and has not forgotten it."),
    context:
      "Removing a Chancellor is not a military act and the General Staff has no " +
      "constitutional power to do it. What it has is the threat of resignation by the " +
      "two men whose names the country believes in, and the knowledge that the throne " +
      "will not survive choosing a civilian over them.",
    choices: [
      {
        id: "force",
        label: "Press for the Chancellor's removal",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "The war cannot be run from two buildings that disagree. One of them has to stop." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { ohl_chancellor: "removed" },
        erodes: "spend_will",
        next: "ohl_1917_13_caporetto",
        outcome:
          "Bethmann Hollweg leaves the chancellorship in July. His successors govern " +
          "with the Supreme Command's approval and without much else. The military " +
          "direction of the war is now the direction of the war, and every domestic " +
          "failure from here belongs to this headquarters whether it caused it or not.",
      },
      {
        id: "tolerate",
        label: "Leave the Chancellor in place and accept the resolution",
        advisor: { name: "Bethmann Hollweg", position:
          "A resolution the Reichstag has voted for is worth more to the country than one the army permits it to vote for." },
        impact: { manpower: 0, munitions: 0, will: 2 },
        setFlags: { ohl_chancellor: "kept" },
        next: "ohl_1917_13_caporetto",
        outcome:
          "Speculative. The civil government survives the summer with its authority " +
          "intact, which means the Supreme Command has a colleague rather than a " +
          "subordinate, and an argument to lose every time it wants something.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-09
  ohl_1917_13_caporetto: {
    year: 1917, date: "1917-09-10", city: "Kreuznach",
    title: "Help for Vienna",
    advisors: ["ludendorff", "hindenburg"],
    situation: (flags) =>
      "Eleven battles on the Isonzo have brought the Austro-Hungarian army close to the " +
      "end of what it can do, and another Italian attack is expected before the winter. " +
      "The Emperor Charles has asked Berlin for help: heavy guns, and divisions to take " +
      "over in the east so that Austrian ones can be moved to Italy.\n\n" +
      "Ludendorff has judged that six to eight German divisions can be spared until " +
      "the winter, now that the east has gone quiet. " +
      (flags.ohl_chancellor === "removed"
        ? "There is a new Chancellor, chosen with the Supreme Command's approval, and " +
          "the Chancellery's view carries little weight in this room."
        : "The Chancellor remains, and the Supreme Command has to take his government's " +
          "view of the matter into account.") +
      "\n\nDivisions sent to Italy are divisions not in reserve behind the line in " +
      "Flanders, where the British have been attacking since July.",
    context:
      "An Italian collapse would not end the war. It might keep Austria-Hungary in it. " +
      "The alternative is to leave Vienna to its own front and decide later what that " +
      "costs.",
    choices: [
      {
        id: "send",
        label: "Send German divisions to the Isonzo and take command of the offensive",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "Austria-Hungary has to be kept in the war. A blow on the Isonzo is the cheapest way of doing it." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { ohl_caporetto: "sent" },
        next: "ohl_1918_12_faustschlag",
        outcome:
          "A Fourteenth Army is made up of German and Austro-Hungarian divisions under " +
          "Otto von Below. The offensive opens on 24 October and the Italian line at " +
          "Caporetto breaks. The Italians retreat to the Piave, and the Allies send " +
          "divisions to hold them. Austria-Hungary does not leave the war.",
      },
      {
        id: "refuse",
        label: "Send guns and staff officers but no divisions",
        impact: { manpower: 1, munitions: -1, will: 0 },
        setFlags: { ohl_caporetto: "refused" },
        next: "ohl_1918_12_faustschlag",
        outcome:
          "Speculative. Vienna gets the artillery it asked for and not the divisions. " +
          "The Isonzo line holds, or it does not, on the strength of an army that has " +
          "been strained to the limit. Whatever happens there, the divisions stay in " +
          "Flanders.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-02
  ohl_1918_12_faustschlag: {
    year: 1918, date: "1918-02-13", city: "Bad Homburg",
    title: "Neither War nor Peace",
    advisors: ["ludendorff", "hindenburg"],
    situation: (flags) =>
      "On 10 February the Russian delegation at Brest-Litovsk declared that Russia " +
      "would not sign the treaty and considered the war over. It then went home. " +
      "There is no treaty, and the armistice that covers the line will run out on " +
      "the 17th.\n\n" +
      "The Kaiser has called a council at Bad Homburg. The Foreign Secretary and the " +
      "Chancellor are troubled by the size of what the military and the nationalists " +
      "want to take in the east. The soldiers want to move at once, while the " +
      "Russian army is dissolving and the Baltic provinces and Ukraine are open.\n\n" +
      (flags.ohl_caporetto === "sent"
        ? "The German divisions sent to Italy have come out of it, and the army has to " +
          "decide where to use them."
        : "The divisions that did not go to Italy are where they were, and the army has " +
          "to decide where to use them.") +
      " Every division that stays in the east is one that is not in France in March.",
    context:
      "The advance, if it is made, needs no plan. The Russian army is not resisting. " +
      "What it needs is a decision about how much of the east the Empire will hold " +
      "when it stops.",
    choices: [
      {
        id: "advance",
        label: "End the armistice and resume the advance on the 18th",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "The Russians have refused to sign. They will sign when they see what refusing costs them." },
        impact: { manpower: 0, munitions: 1, will: 1 },
        setFlags: { ohl_faust: "advanced" },
        next: "ohl_1918_08_brest",
        outcome:
          "The advance begins on 18 February, along the whole front from the Baltic to " +
          "Ukraine. German and Austro-Hungarian divisions go forward with almost no " +
          "fighting. Minsk is taken on the 21st, and Kiev on 2 March. On 3 March the " +
          "Russian government signs the treaty that it refused to sign on the 10th.",
      },
      {
        id: "accept",
        label: "Accept the declaration and let the armistice run out without advancing",
        advisor: { name: "Kühlmann", position:
          "Russia will have to be part of any settlement in Europe. A peace taken at the point of an advance is a peace that will have to be revised." },
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { ohl_faust: "declared" },
        next: "ohl_1918_08_brest",
        outcome:
          "Speculative. The armies stay where they are. The Russian government has " +
          "declared the war ended, and there is no treaty and no further advance. " +
          "Divisions that would have been marching are free to be moved. The Baltic " +
          "provinces and Ukraine stay open and uncertain, and the annexationists at " +
          "home regard the opportunity as thrown away.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-03
  ohl_1918_08_brest: {
    year: 1918, date: "1918-03-03", city: "Brest-Litovsk",
    title: "What the East Is Worth",
    advisors: ["ludendorff", "hindenburg"],
    bulletin: {
      voice: "ohl", date: "1918-03-01", source: "Official communiqué",
      text:
        "Negotiations in the east proceed. The Supreme Command is satisfied that the " +
        "security of the eastern territories will be established on a lasting footing.",
    },
    situation: (flags) =>
      (flags.ohl_faust === "declared"
        ? "Russia has declared the war over and gone home. There is no treaty, and what " +
          "the army holds in the east is what it held when the armistice ran out. "
        : "Russia is out. ") +
      "What follows is not a military question but it will be answered " +
      "in divisions: every square mile taken in the east has to be held, and every " +
      "garrison left behind is a division not on the Western Front in the spring.\n\n" +
      "The army has two hundred and forty-one divisions. The number that can be in " +
      "France in March is the whole of the coming year's argument.",
    context:
      "Roughly fifty divisions can be moved west if the eastern settlement is kept " +
      "narrow. A settlement that takes everything available to be taken will need a " +
      "large part of them to stay where they are and administer it.",
    choices: [
      {
        id: "harsh",
        label: "Take the full settlement — hold what the treaty gives",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "We will not get a second chance at the east. Take it now and garrison it, and the west will still have enough." },
        impact: { manpower: 1, munitions: 1, will: 1 },
        setFlags: { ohl_brest: "maximal" },
        erodes: "spend_will",
        next: "ohl_1918_09_michael",
        outcome:
          "The terms are severe and the territory is enormous. Around fifty divisions " +
          "come west; by the twenty-first of March a hundred and ninety-two of the " +
          "army's divisions are on the Western Front. The rest are administering the " +
          "prize, and they stay there.",
      },
      {
        id: "narrow",
        label: "Take a narrow settlement — release the maximum for the west",
        advisor: { name: "Hindenburg", position:
          "The territory is worth nothing if the war is lost in France while we are counting it." },
        impact: { manpower: 2, munitions: 0, will: -1 },
        setFlags: { ohl_brest: "narrow" },
        next: "ohl_1918_09_michael",
        outcome:
          "Speculative. Less is taken and less has to be held. More divisions reach " +
          "France than historically did, and a settlement the annexationists at home " +
          "regard as a betrayal has to be defended in the Reichstag by a government " +
          "that did not want it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-03
  ohl_1918_09_michael: {
    year: 1918, date: "1918-03-21", city: "Saint-Quentin",
    title: "A Hole, and Then",
    advisors: ["ludendorff", "hindenburg"],
    bulletin: {
      voice: "ohl", date: "1918-03-20", source: "Official communiqué",
      text:
        "His Majesty has arrived at the front. The Supreme Command has no statement " +
        "to make concerning operations in preparation.",
    },
    situation:
      "The decision to attack was taken in January and the preparation has been " +
      "meticulous: Bruchmüller's artillery programme, divisions trained in infiltration, " +
      "surprise preserved across a forty-mile front. For the first time since 1914 " +
      "there are more German divisions in France than Allied ones, and the advantage " +
      "expires the moment American strength arrives in quantity.\n\n" +
      "The preparation is not the difficulty. The objective is. Break between Arras and " +
      "the Oise, wheel north, roll the British against the Channel and destroy them — " +
      "that is the operational plan. There is also a view in this headquarters that the " +
      "breakthrough is the plan, that a hole is made and what follows will follow.",
    context:
      "Amiens is a railway junction, and taking it separates the British from the " +
      "French. It is one of the few objectives on this front whose capture would decide " +
      "something rather than merely gain ground.",
    choices: [
      {
        id: "adaptive",
        label: "Make the breakthrough the objective — exploit wherever the line gives",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "Punch the hole and the rest will develop. That is how it was done in the east." },
        impact: { manpower: -2, munitions: -2, will: 1 },
        setFlags: { ohl_michael: "adaptive" },
        dispute:
          "The operational criticism of the 1918 offensives is well established — that " +
          "Ludendorff pursued tactical success at the expense of the campaign's stated " +
          "aims, redirecting effort daily and dissipating a force sufficient for only " +
          "one decisive frontal blow. Against that, the German army did achieve the " +
          "largest breakthrough of the positional war and came nearer Paris than at any " +
          "point since 1914; whether an Amiens-first plan was executable with the " +
          "logistics available, or whether the offensives were doomed by American " +
          "arithmetic whatever the objective, is not settled.",
        uncertain: [
          { weight: 60, title: "Tactical triumph, operational nothing", historicalBranch: true,
            impact: { manpower: -1, will: -1 },
            setFlags: { ohl_michaelResult: "salient" },
            next: "ohl_1918_13_aisne",
            outcome:
              "Sixty-five kilometres of ground and the largest breakthrough since the " +
              "line stopped moving. Amiens is threatened and not taken. The armies on " +
              "the flanks are too worn to widen the front, the direction of the advance " +
              "no longer serves the envelopment it was meant to serve, and what has been " +
              "gained is a salient exposed on every side." },
          { weight: 40, title: "The exploitation reaches the junction",
            impact: { manpower: -1, munitions: -1, will: 1 },
            setFlags: { ohl_michaelResult: "amiens" },
            next: "ohl_1918_13_aisne",
            outcome:
              "Speculative. The adaptive method finds the seam and the exploitation " +
              "carries to the junction. The British and French are separated on the " +
              "ground. What that is worth depends entirely on what can be moved through " +
              "the gap before it closes, and the answer to that is not encouraging." },
        ],
      },
      {
        id: "amiens",
        label: "Name Amiens as the objective and refuse every diversion from it",
        advisor: { name: "Hindenburg", position:
          "One place, taken, splits their armies. Ground taken anywhere else is only ground." },
        gate: (m) => m.munitions >= -2,
        disabledReason: "A single-objective offensive cannot be sustained on this reserve",
        impact: { manpower: -2, munitions: -3, will: 0 },
        setFlags: { ohl_michael: "amiensfirst" },
        next: "ohl_1918_13_aisne",
        outcome:
          "Speculative. Effort is concentrated and diversions refused. Whether the " +
          "junction can be reached and held is a question the logistics may answer " +
          "before the enemy does.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-05
  ohl_1918_13_aisne: {
    year: 1918, date: "1918-05-29", city: "Avesnes",
    title: "Past the Vesle",
    advisors: ["ludendorff", "hindenburg"],
    situation: (flags) =>
      "The attack on the Aisne was meant to be a diversion. Its purpose was to draw " +
      "Allied reserves south, away from Flanders, where the real blow against the " +
      "British was to fall in July.\n\n" +
      "It has gone far better than planned. The French line broke on the first day, " +
      "and by the second the German armies were over the Vesle, which was where the " +
      "plan said they should stop. Soissons fell today. The Marne is a day's march " +
      "away, and beyond it, Paris.\n\n" +
      (flags.ohl_michaelResult === "amiens"
        ? "The junction at Amiens was reached in March, and the British are still in the " +
          "war. What was won there did not end it."
        : "The March offensive did not end the war, and this is the second time in " +
          "ten weeks that the army has broken a line without being able to end the " +
          "fight.") +
      "\n\nDivisions held back for Flanders have already been sent south to feed the " +
      "advance.",
    context:
      "A diversion that succeeds becomes a second main effort, and takes the divisions " +
      "meant for the first. What is spent here cannot be used in Flanders.",
    choices: [
      {
        id: "exploit",
        label: "Exploit the breakthrough and send the army on to the Marne",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "The French line has gone. An opportunity like this does not come twice, and it would be a crime not to use it." },
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { ohl_aisne: "exploited" },
        erodes: "spend_will",
        next: "ohl_1918_10_salient",
        outcome:
          "The advance goes on beyond the Vesle to the Ourcq and the Marne, which the " +
          "leading units reach on 30 May. It makes a deep salient, with a long and " +
          "narrow base, held by divisions that were being kept for the attack in " +
          "Flanders. When the advance stops in early June, the Flanders attack is " +
          "put off, and then put off again.",
      },
      {
        id: "halt",
        label: "Halt on the Vesle as planned and keep the reserves for Flanders",
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { ohl_aisne: "halted" },
        next: "ohl_1918_10_salient",
        outcome:
          "Speculative. The army stops where the plan said it should, with a gain " +
          "that was never in the plan, and the reserves go back to the north. The " +
          "attack in Flanders goes ahead as designed, against a British army " +
          "that has had time to prepare for it. Paris is not threatened, and the " +
          "country is told so.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-07
  ohl_1918_10_salient: {
    year: 1918, date: "1918-07-18", city: "Soissons",
    title: "The Widest Line We Have Ever Held",
    advisors: ["ludendorff", "hindenburg"],
    bulletin: {
      voice: "ohl", date: "1918-07-16", source: "Official communiqué",
      text:
        "The territory under the protection of German arms in the west is greater than " +
        "at any time since 1914. The Supreme Command has every confidence in the " +
        "positions held.",
    },
    situation: (flags) =>
      "By mid-July the German position in the west is the largest it has ever been " +
      "and among the worst it has ever been. " +
      (flags.ohl_michaelResult === "amiens"
        ? "The junction was reached; holding it has cost more than taking it."
        : "The offensives took ground in four directions and decided nothing in any of them.") +
      (flags.ohl_aisne === "exploited"
        ? "\n\nThe salient on the Marne has the longest flank of all, and the army that " +
          "made it is the army holding it."
        : "") +
      "\n\nThe salients are deep, the flanks are long, the divisions that made them " +
      "are the divisions that were supposed to hold them, and American formations are " +
      "now arriving faster than they can be counted.\n\n" +
      "Giving up ground bought at this price is not a military problem. It is a " +
      "problem of what can be said afterwards.",
    context:
      "A shortened line can be held by fewer men, with the reserve restored. It also " +
      "concedes, in front of the whole country, that the spring bought nothing.",
    choices: [
      {
        id: "shorten",
        label: "Shorten the line — give up the salients and rebuild the reserve",
        advisor: { name: "Hindenburg", position:
          "The ground was never the point. An army that still exists in September is the point." },
        impact: { manpower: 2, munitions: 1, will: -3 },
        setFlags: { ohl_salient: "shortened" },
        next: "ohl_1918_14_blackday",
        outcome:
          "Speculative. The armies come back to a line they can hold and a reserve " +
          "exists again. At home, the maps in the newspapers move backwards for the " +
          "first time since March, and no communiqué makes that mean anything else.",
      },
      {
        id: "hold",
        label: "Hold the ground taken",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "We do not hand back in July what was paid for in March." },
        impact: { manpower: -3, munitions: -1, will: 0 },
        setFlags: { ohl_salient: "held" },
        erodes: "spend_will",
        next: "ohl_1918_14_blackday",
        outcome:
          "The salients are held and the divisions holding them are consumed doing it. " +
          "The retreat, when it comes, comes at a time chosen by the enemy rather than " +
          "by this headquarters.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-08
  ohl_1918_14_blackday: {
    year: 1918, date: "1918-08-14", city: "Spa",
    title: "The Black Day",
    advisors: ["ludendorff", "hindenburg"],
    situation: (flags) =>
      "On 8 August British, Australian and Canadian troops attacked east of Amiens " +
      "with tanks, aircraft and a short, sudden bombardment. The German line gave way " +
      "on a wide front, and some divisions did not fight. Thousands of men were taken " +
      "prisoner. Ludendorff called it the black day of the German army.\n\n" +
      (flags.ohl_salient === "shortened"
        ? "The line had been shortened in July and the reserve restored, which is why " +
          "the break was closed. It is still a break."
        : "The salients held in July are the ground the attack came through. Divisions " +
          "that should have been resting were holding them.") +
      "\n\nThe Kaiser is at Spa, and the council meets today. The Foreign Secretary is " +
      "there, and so are the two soldiers who spent the spring promising a decision " +
      "in the west.",
    context:
      "A command that declares the offensive over has to say what it will do instead. " +
      "One answer is to stand on the defensive and let the country find out why. The " +
      "other is to try again before the Americans arrive in strength.",
    choices: [
      {
        id: "defensive",
        label: "Go over to the strategic defensive and let the Foreign Secretary open an approach",
        historical: true,
        advisor: { name: "Hintze", position:
          "A defensive in the west has to go with an approach to the enemy. The army alone cannot end this." },
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { ohl_blackday: "defensive" },
        next: "ohl_1918_11_request",
        outcome:
          "The council agrees on a defensive in the west, with the aim of making the " +
          "enemy tired of fighting. The Foreign Secretary is asked to find out, through " +
          "neutral channels, what terms are possible. The army goes on giving ground in " +
          "orderly stages through September. The decision is not announced.",
      },
      {
        id: "offensive",
        label: "Plan another offensive before the Americans arrive in strength",
        impact: { manpower: -2, munitions: -1, will: 1 },
        gate: (m) => m.manpower >= -3,
        disabledReason: "There are not the divisions left for another offensive",
        setFlags: { ohl_blackday: "offensive" },
        erodes: "spend_will",
        next: "ohl_1918_11_request",
        outcome:
          "Speculative. Another attack is prepared for September, with divisions " +
          "taken from the quiet sectors. It is a smaller operation than any of the " +
          "spring's, and it is aimed at a front that the enemy has had time to " +
          "reinforce.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-09
  ohl_1918_11_request: {
    year: 1918, date: "1918-09-29", city: "Spa",
    title: "Who Asks",
    advisors: ["ludendorff", "hindenburg"],
    bulletin: {
      voice: "ohl", date: "1918-09-27", source: "Official communiqué",
      text:
        "Operations in the west proceed according to the intentions of the Supreme " +
        "Command. Adjustments of the line are made where the situation requires them.",
    },
    situation: (flags) =>
      "The army in the west is retreating in order, on ground it still holds, in front " +
      "of an enemy it can still hurt. What has gone is not the army. It is the " +
      "possibility of any outcome except a worse one later.\n\n" +
      (flags.ohl_salient === "shortened"
        ? "The line is short and held, and the reserve exists. It buys months. It does not buy a different answer."
        : "The divisions that took the salients in the spring are the divisions that were spent holding them.") +
      "\n\nWhat is decided now is not whether an armistice is sought. It is who is " +
      "recorded as having sought it.",
    context: (flags) =>
      flags.ohl_chancellor === "removed"
        ? "There is no civil authority left with standing of its own. It was removed in " +
          "July, by this headquarters, precisely so that it could not act independently — " +
          "and now something is needed that only an independent civil authority can do."
        : "A civil government with its own authority still exists, and can carry a " +
          "request that does not belong to the army alone.",
    choices: [
      {
        id: "military",
        label: "The Supreme Command requests it, and a new civil government carries it",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "The request must go now, and it must go through a government that can sign it." },
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { ohl_request: "throughcivil" },
        nextIf: (m, flags) =>
          m.will <= -6 ? "ohl_end_homefirst"
          : m.manpower <= -6 ? "ohl_end_armyfirst"
          : (flags.ohl_brest === "narrow" && flags.ohl_salient === "shortened") ? "ohl_end_intact"
          : null,
        next: "ohl_1918_15_wilson",
        outcome:
          "The request goes forward. A government is assembled to carry it and does. " +
          "Within a few years a great many people who were in this building will explain " +
          "that the army was never beaten and that the request came from somewhere else.",
      },
      {
        id: "fight",
        label: "Refuse the request — fight on into 1919 behind a shortened line",
        advisor: { name: "Hindenburg", position:
          "A defensive line in the west and a winter may produce terms that this month will not." },
        gate: (m) => m.manpower >= -4,
        disabledReason: "There are not enough divisions left to hold any line through a winter",
        impact: { manpower: -3, munitions: -2, will: -2 },
        setFlags: { ohl_request: "refused" },
        nextIf: (m, flags) =>
          m.will <= -5 ? "ohl_end_homefirst"
          : m.manpower <= -7 ? "ohl_end_armyfirst"
          : flags.ohl_brest === "maximal" ? "ohl_end_dictated"
          : null,
        next: "ohl_end_holdout",
        outcome:
          "Speculative. No request is made. The army falls back on a line it intends to " +
          "hold through the winter, and the question becomes whether the country behind " +
          "it lasts as long as the line does.",
      },
      {
        id: "openterms",
        label: "Seek terms directly and early, before the line moves again",
        advisor: { name: "Hindenburg", position:
          "Every week we wait, the terms available get worse. They will not improve by themselves." },
        gate: (m) => m.will >= -3,
        disabledReason: "The Supreme Command has no standing left to open a negotiation in its own name",
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { ohl_request: "early" },
        nextIf: (m) => (m.will <= -4 ? "ohl_end_worseterms" : null),
        next: "ohl_end_negotiated",
        outcome:
          "Speculative. An approach is made while the line in the west is still " +
          "unbroken, from a position that can still be described as strong.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-10
  ohl_1918_15_wilson: {
    year: 1918, date: "1918-10-24", city: "Spa",
    title: "A Reply Wilson Will Not Take",
    advisors: ["ludendorff", "hindenburg"],
    situation:
      "The request went out in the first week of October, over the signature of a new " +
      "Chancellor, Prince Max of Baden. President Wilson has replied three times. The " +
      "third reply, on 23 October, says that the United States will deal only with " +
      "representatives of the German people, and will demand terms that make it " +
      "impossible for Germany to renew the war.\n\n" +
      "Ludendorff, who asked for an armistice on 29 September, has changed his mind. " +
      "He reads the reply as a demand for surrender, and he believes the army can still " +
      "hold a line through the winter.\n\n" +
      "Prince Max holds the exchange of notes to be the government's business and not " +
      "the army's.\n\n" +
      "Telegrams to the armies go out over the Supreme Command's signature, and nobody " +
      "else's.",
    context:
      "An order to the army that contradicts the government's course is a political " +
      "act. It is also something the Supreme Command has the power to issue without " +
      "anyone's agreement.",
    choices: [
      {
        id: "order",
        label: "Issue an order to the army rejecting the terms and calling for resistance",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "The army has to know that these terms are unacceptable, and that it is to go on fighting while it is still in a position to." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { ohl_wilson: "order" },
        erodes: "spend_will",
        dispute:
          "The order is dated 24 October in most accounts and 25 October in some. " +
          "Accounts also differ about its purpose. Ludendorff's position afterwards " +
          "was that the third note had changed the situation and that the army had to " +
          "be told so. The government read it as an attempt to wreck the negotiation " +
          "by going over its head to the army, and the Chancellor demanded his " +
          "dismissal.",
        next: "ohl_end_armistice",
        outcome:
          "The order goes out to the armies without the Chancellor's knowledge. It " +
          "reaches the press, and the Chancellor demands that Ludendorff be dismissed " +
          "or he will go himself. On the 26th the Kaiser accepts Ludendorff's " +
          "resignation and keeps Hindenburg. Ludendorff is replaced by Groener, and " +
          "the armistice request stands.",
      },
      {
        id: "accept",
        label: "Leave the reply to the government and tell the army only what the Chancellor allows",
        advisor: { name: "Hindenburg", position:
          "The notes are a matter for the government. The army's business is to hold its ground while they are answered." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { ohl_wilson: "accepted" },
        next: "ohl_end_armistice",
        outcome:
          "Speculative. No order is issued. The government answers the third note " +
          "without a quarrel with the army, and Ludendorff stays in his post to the " +
          "end. What the army is told about the negotiation is left to the Chancellor.",
      },
    ],
  },

  // ---------------------------------------------------------------- endings
  ohl_end_armistice: {
    year: 1918, date: "1918-11-11", city: "Spa",
    title: "The Request",
    advisors: ["hindenburg"],
    situation: (flags) =>
      "The army in the west is not broken in the sense the word is used in staff " +
      "colleges. It is retreating in order, on ground it still holds, in front of an " +
      "enemy it can still hurt. What has gone is the possibility of any outcome except " +
      "a worse one later.\n\n" +
      (flags.ohl_usw === "unrestricted"
        ? "The submarine campaign did what its critics said it would do and did not do " +
          "what its authors promised. The Americans are here in numbers, and the six " +
          "months in the memorandum expired a long time ago."
        : "The Americans came late and in smaller numbers, and it made a difference of " +
          "months rather than of outcome.") +
      "\n\nThe request goes forward from the Supreme Command. It is a military " +
      "judgment, made by soldiers, and within a few years a great many people who " +
      "were in this building will say it was made by someone else.",
    ending: {
      family: "armistice-requested",
      badge: BADGES.SETTLED,
    },
    epilogue: (flags) =>
      "Chief of the General Staff at the close: Hindenburg. The war ends on the " +
      "eleventh of November.\n\n" +
      "Lorraine, August 1914: " + (flags.ohl_lorraine === "reinforced" ? "reinforced." : "conceded, as the plan required.") + "\n" +
      "The Marne: " + (flags.ohl_marne === "inperson" ? "judged in person at the front." : "delegated forward under plenipotentiary authority.") + "\n" +
      "Two corps for the east: " + (flags.ohl_twocorps === "kept" ? "kept on the right." : "sent to East Prussia by rail.") + "\n" +
      "Ypres, November 1914: " + (flags.ohl_flanders === "broken" ? "broken off." : "one more concentrated attack.") + "\n" +
      "The eastern front, 1915: " + (flags.ohl_gorlice === "envelop" ? "a wide envelopment." : "a breakthrough at Gorlice.") + "\n" +
      "Serbia: " + (flags.ohl_serbia === "declined" ? "declined." : "attacked in October 1915.") + "\n" +
      "The Meuse: " + (flags.ohl_verdun === "declined" ? "declined." : (flags.ohl_verdunExec === "fortress" ? "fought as a battle for the fortress." : "fought as the directive was written.")) + "\n" +
      "The Somme: " + (flags.ohl_somme === "elastic" ? "ground given where it was dear." : "no ground to be given up.") + "\n" +
      "The Hindenburg Programme: " + (flags.ohl_programme === "moderate" ? "a smaller programme." : "adopted at full size.") + "\n" +
      "The submarines: " + (flags.ohl_usw === "restricted" ? "held under prize rules." : "unrestricted from 1 February 1917.") + "\n" +
      "Weight of effort after the Marne: " + (flags.ohl_theatre === "east" ? "shifted east." : "held in the west.") + "\n" +
      "Posture for 1917: " + (flags.ohl_1917posture === "offensive" ? "continued offensive effort." : "defensive, rebuilding.") + "\n" +
      "American entry: " + (flags.ohl_usEntry === "deferred" ? "deferred." : "brought on by the decision of 9 January 1917.") + "\n" +
      "The retirement to the Siegfried Line: " + (flags.ohl_alberich === "held" ? "refused." : flags.ohl_alberich === "spared" ? "made, with the ground left standing." : "made, with the ground destroyed.") + "\n" +
      "Italy, autumn 1917: " + (flags.ohl_caporetto === "refused" ? "guns and staff officers, no divisions." : "German divisions and the offensive at Caporetto.") + "\n" +
      "February 1918: " + (flags.ohl_faust === "declared" ? "the Russian declaration accepted." : "the advance resumed on the 18th.") + "\n" +
      "Brest-Litovsk: " + (flags.ohl_brest === "narrow" ? "narrow settlement, divisions released west." : "maximal settlement, divisions retained in garrison.") + "\n" +
      "Spring 1918: " + (flags.ohl_michael === "amiensfirst" ? "Amiens named as the objective." : "breakthrough taken as the objective.") + "\n" +
      "The Aisne, May 1918: " + (flags.ohl_aisne === "halted" ? "halted on the Vesle." : "exploited to the Marne.") + "\n" +
      "After 8 August: " + (flags.ohl_blackday === "offensive" ? "another offensive planned." : "the strategic defensive.") + "\n" +
      "September 1918: " + (flags.ohl_request === "refused" ? "the request was refused." : flags.ohl_request === "early" ? "terms were sought early." : "requested through a new civil government.") + "\n" +
      "The third American note: " + (flags.ohl_wilson === "accepted" ? "left to the government." : "answered by an order to the army, and Ludendorff's resignation."),
  },


  ohl_end_homefirst: {
    year: 1918, date: "1918-11-09", city: "Berlin",
    title: "The Country Goes First",
    advisors: ["hindenburg"],
    situation:
      "The front is still a front. The armies are on ground they hold and the enemy " +
      "has not walked through them.\n\nWhat has stopped is behind it. Four winters of " +
      "the blockade, a food supply that has been arithmetic rather than diet for two " +
      "years, and a political authority that this headquarters spent and then needed. " +
      "There is no order that reaches this and no reserve that can be moved to it.",
    ending: { family: "home-front-collapse-first", badge: BADGES.CONTESTED },
    epilogue: () =>
      "The army did not break in the field. It was never going to be able to hold a " +
      "front for a country that had stopped being able to supply one.",
  },

  ohl_end_armyfirst: {
    year: 1918, date: "1918-10-20", city: "Spa",
    title: "The Front Gives",
    advisors: ["hindenburg"],
    situation:
      "This is the outcome the Supreme Command spent four years arranging not to have: " +
      "a break in the field, in daylight, with nothing behind it. The divisions asked " +
      "to close it are the divisions that were used up making and then holding the " +
      "spring's ground.\n\nThere is no argument to be had afterwards about whether the " +
      "army was beaten. Everyone can see where it happened.",
    ending: { family: "army-collapse-first", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The historical German army retreated in order to the end and was " +
      "never broken open in the field. Spending it harder than it was spent leaves " +
      "nothing for anyone to reinterpret afterwards.",
  },

  ohl_end_holdout: {
    year: 1918, date: "1918-11-11", city: "Antwerp",
    title: "A Line for the Winter",
    advisors: ["hindenburg"],
    situation:
      "No request goes forward. The armies come back to a short line, dig, and hold " +
      "it — and holding it works, in the narrow sense that the enemy does not come " +
      "through.\n\nEverything else continues. The blockade continues. The Americans " +
      "continue to arrive. The winter is bought at the price of every division that " +
      "might have been rebuilt in it, and the terms available in the spring are the " +
      "terms available now, minus a winter.",
    ending: { family: "fight-on-into-1919", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The line held. What the line was for did not become clearer for " +
      "having been held.",
  },

  ohl_end_negotiated: {
    year: 1918, date: "1918-09-30", city: "Spa",
    title: "From a Line Still Held",
    advisors: ["hindenburg"],
    situation:
      "The approach is made while the front is unbroken and the maps still show ground " +
      "that was taken rather than ground that was lost. There is a difference between " +
      "negotiating from a position and negotiating after one, and it is the whole of " +
      "the difference available here.\n\nWhether the other side is interested in the " +
      "distinction is a separate matter, and not one this headquarters controls.",
    ending: { family: "earlier-negotiated-outcome", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. No German approach on these lines was made at this date. The " +
      "Entente's willingness to treat with an unbeaten German army in September 1918 " +
      "is not something the record can settle, and this ending does not pretend it can.",
  },

  ohl_end_worseterms: {
    year: 1918, date: "1918-11-11", city: "Compiegne",
    title: "Terms, Later",
    advisors: ["hindenburg"],
    situation:
      "The approach was made from a headquarters with nothing left to bring to it. " +
      "There is a version of this negotiation in which Germany arrives with an " +
      "unbroken front, an intact reserve and a government that speaks for itself, and " +
      "that version was available earlier at a price this command declined to pay.\n\n" +
      "What arrives instead is a delegation with a signature and no position.",
    ending: { family: "armistice-on-worse-terms", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Terms are not made only by armies. They are made by what the " +
      "asking side still has when it asks.",
  },

  ohl_end_intact: {
    year: 1918, date: "1918-11-11", city: "Spa",
    title: "An Army That Still Exists",
    advisors: ["hindenburg"],
    situation:
      "The eastern settlement was kept narrow and the divisions it would have " +
      "garrisoned came west. The salients were given up in July while giving them up " +
      "was still a decision rather than a consequence. The line is short, the reserve " +
      "is real, and the army that requests an armistice is an army rather than the " +
      "memory of one.\n\nNone of it changes the answer. It changes what is left of " +
      "Germany when the answer arrives.",
    ending: { family: "armistice-from-strength", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Both decisions were available and neither was taken. The " +
      "counterfactual is not that Germany wins; it is that the same defeat costs a " +
      "different amount.",
  },

  ohl_end_dictated: {
    year: 1918, date: "1918-11-11", city: "Kiev",
    title: "Holding the Prize",
    advisors: ["hindenburg"],
    situation:
      "The eastern territories are still garrisoned. The treaty that took them is " +
      "still in force, on paper, and the divisions administering it are still there, " +
      "doing that, while the west is decided without them.\n\nThe Supreme Command " +
      "took everything the east could be made to give and then spent the war holding " +
      "it down. Both halves of that were the same decision.",
    ending: { family: "east-held-west-lost", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Territory is only an asset if it can be held with fewer men than " +
      "it releases.",
  },

  ohl_end_relieved: {
    year: 1918, date: "1918-10-26", city: "Berlin",
    title: "A File Too Thick",
    advisors: ["hindenburg"],
    situation:
      "There is no single order that did this and no single refusal. There is a file, " +
      "and in it a pattern of a Chief who spent the Supreme Command's standing at home " +
      "to buy results in the field, and went on spending it after the results stopped " +
      "arriving.\n\n" +
      "A command that has consumed that much of the country's patience does not get " +
      "to choose the moment it stops. Somebody else chooses, and they choose now.",
    ending: {
      family: "hard-mode-relieved",
      badge: BADGES.CONTESTED,
      hardModeOnly: true,
    },
    epilogue: () =>
      "The office continues. The occupant does not.",
  },
};

