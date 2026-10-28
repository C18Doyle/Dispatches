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

CAMPAIGNS.ohl.startNode = "ohl_1914_16_kaiser";

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
  ohl_1914_16_kaiser: {
    year: 1914, date: "1914-08-01", city: "Berlin",
    title: "The Kaiser's Question",
    advisors: ["moltke", "tappen"],
    situation:
      "Mobilisation has been ordered, and the Chief of the General Staff is on his way to the " +
      "palace with the order for the trains to begin. In the afternoon a telegram arrives from " +
      "the ambassador in London: if Germany does not attack France, Britain will keep France out " +
      "of the war. The Kaiser takes it as a gift, and sends for the Chief.\n\n" +
      "He asks whether the whole army can be sent east against Russia, and the French left " +
      "alone. The railway division has an old plan for it, revised each year until 1913. The " +
      "plan for the west, with its timetable, is the one the whole army has been trained to carry out.",
    choices: [
      {
        id: "west",
        label: "Tell the Kaiser that the deployment against France cannot be improvised, and let the trains run",
        historical: true,
        advisor: { name: "Moltke", position:
          "An army of a million men cannot be turned round in an evening. The plan for the west is the only one that is ready, and an army turned east would be a mob without supplies." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { ohl_kaiser: "west" },
        next: "ohl_1914_01_aufmarsch",
        outcome:
          "Moltke refuses. He tells the Kaiser that a deployment of that size cannot be changed in an " +
          "evening, and the Kaiser, who says that Moltke's uncle would have answered differently, gives " +
          "way. That night King George sends word that the ambassador must have misunderstood, and the " +
          "offer from London is gone. The trains begin to run on the old timetable, and Moltke, who " +
          "has won the argument, has lost something of the Kaiser's confidence.",
      },
      {
        id: "east",
        label: "Turn part of the army east on the old plan, and keep the rest on the timetable for the west",
        advisor: { name: "Tappen", position:
          "The Kaiser is the Supreme War Lord. A compromise that sends some of the army each way can be ordered tonight, and the railway division has the old plan in its files." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        dispute:
          "The head of the railway division, Hermann von Staab, argued after the war that the army could have " +
          "been turned east at a day's notice, and Moltke argued that it could not. Historians still debate it. " +
          "The two timetables were not made to be mixed.",
        uncertain: [
          { weight: 50, title: "The compromise costs a day",
            impact: { manpower: -1, munitions: 0, will: 0 },
            setFlags: { ohl_kaiser: "east1" },
            next: "ohl_1914_01_aufmarsch",
            outcome:
              "Speculative. The railway division turns two armies' trains east and leaves the rest on the " +
              "old timetable. It is done, with a day lost and a number of trains standing in the wrong " +
              "stations, and the armies in the west are late to their start. Britain's offer is withdrawn " +
              "the same evening, and the eastern armies have been sent to meet an enemy that is not yet in " +
              "the field." },
          { weight: 50, title: "The compromise costs three days",
            impact: { manpower: -2, munitions: -1, will: -1 },
            setFlags: { ohl_kaiser: "east3" },
            next: "ohl_1914_01_aufmarsch",
            outcome:
              "Speculative. The two timetables cross at the great junctions of the Rhine, and trains " +
              "stand for hours in the stations. It takes three days to sort them out, and the right " +
              "wing, which the whole plan depends on, is not at its start line when the army is meant " +
              "to cross the Belgian frontier. Moltke is told that he has been right, and it does not help him." },
        ],
      },
      {
        id: "wait",
        label: "Hold the order for a day to see whether London's offer is real",
        advisor: { name: "Moltke", position:
          "A day's delay is a day of the timetable, and the timetable has none to spare. But the Kaiser has asked, and a Chief who refuses to wait may be asked to explain it later." },
        gate: (m) => m.will >= -2,
        disabledReason: "The Kaiser has already signed, and the order is on its way to the railway division",
        impact: { manpower: 0, munitions: -1, will: 0 },
        setFlags: { ohl_kaiser: "wait" },
        next: "ohl_1914_01_aufmarsch",
        outcome:
          "Speculative. Moltke holds the order for a day, and the offer from London is withdrawn " +
          "before it is over. The army begins to deploy on the 2nd and not on the 1st. Every corps is a " +
          "day behind the timetable that had no day in it, and the staff, which has just been told " +
          "that it was right, spends the first week of the war trying to recover the time that the " +
          "Kaiser's question cost.",
      },
    ],
  },

  ohl_1914_01_aufmarsch: {
    year: 1914, date: "1914-08-04", city: "Koblenz",
    title: "The Weight on the Right",
    advisors: ["moltke", "tappen"],
    situation: (flags) =>
      "The deployment rests on one proposition inherited from Schlieffen and modified " +
      "every year since: that the decisive weight falls on the right, swings wide " +
      "through Belgium, and that everything else in the line exists to make that " +
      "possible. Belgian neutrality is guaranteed by treaty, and the guarantee is " +
      "British.\n\n" +
      "Lorraine is the difficulty. The French will attack there, and the armies on the " +
      "left want to meet them and win something. Every corps that goes to Lorraine is " +
      "a corps not on the right, and the plan was never designed to do both." +
      (flags.ohl_kaiser === "east1"
        ? "\n\nThe attempt to turn part of the army east has cost a day, and the armies in the west start late."
        : flags.ohl_kaiser === "east3"
        ? "\n\nThe attempt to turn part of the army east has cost three days, and the right wing is not at its start line."
        : flags.ohl_kaiser === "wait"
        ? "\n\nThe order was held for a day, and every corps is a day behind the timetable."
        : ""),
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
          "The right goes forward at the weight the plan requires. Lorraine gives " +
          "ground it was always expected to give, and the newspapers there will have to " +
          "be managed. The left wing's commanders, who wanted to meet the French and " +
          "win something, are told to hold and wait, and they do not forget it. " +
          "Everything now depends on the right wing reaching Paris before its men and " +
          "horses reach the end of what they can do.",
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
          "Corps go south. There is fighting in Lorraine that the plan did not ask for, " +
          "and a French attack is met and beaten there, which is reported at home as a " +
          "victory. The right wing goes forward lighter than the plan assumed, by " +
          "exactly the corps that went south. Nobody in this building can yet say what that will cost.",
      },
      {
        id: "east",
        label: "Put the Kaiser's question to the railways: ask what it would take to send the whole army east",
        advisor: { name: "Tappen", position:
          "The Kaiser has asked for it in plain words. The railway department should be asked what it would cost, and he should be answered in figures and not in a refusal." },
        impact: { manpower: -1, munitions: -1, will: -1 },
        next: "ohl_1914_14_timetable",
        outcome:
          "Speculative. The question goes to the railway department the same evening, and the " +
          "answer comes back as a sheet of arithmetic: the trains that carry seven armies west " +
          "have been written down to the hour, and running them the other way means writing " +
          "them again. The Kaiser is shown the figures. The mobilisation of the west goes on in " +
          "the meantime, and for two days nobody in the building is sure which war is being " +
          "deployed.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-08 (a detour: the question put to the railways)
  ohl_1914_14_timetable: {
    year: 1914, date: "1914-08-06", city: "Koblenz",
    title: "Two Days of Argument",
    advisors: ["moltke", "tappen"],
    situation:
      "The mobilisation is under way, and the first trains of the western armies are " +
      "crossing the Rhine bridges. The Kaiser has not let the question go. He has told " +
      "the Chief of the General Staff that the army can be turned on Russia, and that " +
      "the French can be left alone if the British will keep them quiet.\n\n" +
      "The railway department has said that it can be done, in a number of days that " +
      "the plan does not have to spare. Moltke has said that an army improvised on " +
      "the railways is a crowd. What has to be settled now is how much the Kaiser's " +
      "request may be allowed to disturb a mobilisation that is already moving.",
    choices: [
      {
        id: "hold",
        label: "Tell the Kaiser that the deployment cannot be reversed, and let the western mobilisation go on",
        historical: true,
        advisor: { name: "Moltke", position:
          "A deployment is one plan and not a menu. A better order cannot recover an army that has been sent the wrong way on the railways." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { ohl_timetable: "asked" },
        next: "ohl_1914_12_twocorps",
        outcome:
          "Speculative. The answer to the Kaiser is the one the railway department's " +
          "arithmetic supports. The western armies go on to their railheads in the order " +
          "the plan gave, and the argument leaves a Chief of the General Staff who has said " +
          "no to his Emperor and will be reminded of it. Two days have been spent, and the " +
          "plan had little slack; the right wing will cross the frontier a little later " +
          "than its timetable said it would.",
      },
      {
        id: "half",
        label: "Divert part of the deployment east as a hedge, and thin the right wing by what the trains can spare",
        advisor: { name: "Tappen", position:
          "The east will be invaded whatever happens in the west. A hedge costs the right wing a corps or two, and it gives the Kaiser an answer that is not a refusal." },
        impact: { manpower: -1, munitions: 0, will: 0 },
        setFlags: { ohl_timetable: "slipped" },
        next: "ohl_1914_12_twocorps",
        outcome:
          "Speculative. Trains already made up for the western railheads are re-routed east " +
          "at Cologne and Hanover, and for three days the lines through the Rhineland " +
          "carry traffic that no timetable provided for. Some units reach the right place. " +
          "Others sit in sidings while the staff works out where they belong. The right " +
          "wing goes forward weaker than the plan asked, and the east has a hedge that " +
          "was bought at the price of order.",
      },
      {
        id: "whole",
        label: "Order the whole deployment turned east, and take the consequences",
        advisor: { name: "Moltke", position:
          "If it is ordered I will carry it out. I will say in writing what it will do to the armies on the Rhine, and what the French will do while we do it." },
        impact: { manpower: -1, munitions: -1, will: -1 },
        dispute:
          "Moltke told the Kaiser that the western deployment could not be altered. Some " +
          "historians accept that: the timetable had been fixed for years, and the plan " +
          "for a deployment in the east had been given up. Others think the claim was " +
          "overstated, and that the General Staff never tried to find out what a change " +
          "would cost. No one argues that a turn of the whole army would have been " +
          "painless; what is disputed is how bad it would have been.",
        uncertain: [
          { weight: 45, title: "The lines through the Rhineland jam, and the days are lost",
            impact: { manpower: -2, munitions: -1, will: -1 },
            setFlags: { ohl_timetable: "slipped" },
            next: "ohl_1914_12_twocorps",
            outcome:
              "Speculative. The turn is ordered and the railways cannot bear it. Trains " +
              "meet trains at the junctions, units arrive without their horses and horses " +
              "without their units, and in the second week the Chief has to countermand " +
              "the order and send what he can back toward the Belgian frontier. The west " +
              "is deployed late and in pieces. The Kaiser has been given what he asked " +
              "for, and has seen what it cost." },
          { weight: 35, title: "The turn is carried out, and the armies reach the east in order",
            impact: { manpower: 0, munitions: -1, will: 0 },
            setFlags: { ohl_timetable: "slipped" },
            next: "ohl_1914_12_twocorps",
            outcome:
              "Speculative. The railway staff does what Moltke said it could not. The " +
              "eastern armies are reinforced in the first weeks of the war, and a " +
              "weaker right wing in the west is given a smaller task. The French and " +
              "the British are not yet in the position of an enemy who has been " +
              "attacked, and what they will do with the time is the question that " +
              "headquarters cannot answer. The decision has been made and cannot be " +
              "unmade." },
          { weight: 20, title: "The Kaiser countermands within two days",
            impact: { manpower: -1, munitions: 0, will: -1 },
            setFlags: { ohl_timetable: "asked" },
            next: "ohl_1914_12_twocorps",
            outcome:
              "Speculative. The first orders go out and the Kaiser, shown a map of the " +
              "Rhine bridges and told how many trains are already beyond them, withdraws " +
              "his request. The armies are sent to the places the plan named, a few days " +
              "behind where they should be. The Chief of the General Staff has learned " +
              "that his Emperor can change his mind, and the Emperor that his Chief " +
              "can be made to." },
        ],
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
          "Speculative. Both corps stay where the plan put them. The new command in " +
          "East Prussia fights with the army it has, and the right wing goes forward at " +
          "a strength the plan could count on. The province goes on being overrun while the matter is argued, and every report from East Prussia asks for more men than the army there has.",
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
      (flags.ohl_timetable === "slipped"
        ? "\n\nThe days lost to the argument over the railways in the first week have never " +
          "been made up, and the armies on the right are marching on a timetable that started late."
        : "") +
      "\n\nWhat to order is not the difficulty. Knowing what to order is." +
      (flags.xc_marne_french === "delayed" ? "\n\nThere is no French attack on the flank. The armies on the left are still withdrawing, and the only pressure on the gap is the one the German armies have made themselves." : ""),
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
              "different hours, some of them with the enemy close behind. The line on the " +
              "Aisne is held, but the cost of getting to it is higher than it needed to be, " +
              "and the recriminations start before the digging does. The officers who were " +
              "not told in time say so, loudly. The Chief's authority over the armies, " +
              "already thin, is thinner at the end of it." },
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
          "Aisne happens regardless, since the gap is there whoever sees it; only the " +
          "authorship changes. The officers at headquarters are left to explain to the " +
          "Kaiser where the Chief has gone.",
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
      "\n\nThe new Chief brings no new plan. He brings the recognition that the old one has been spent, and that the war now has to be won by some " +
      "method nobody in this building has yet described.",
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
          "this building. In the meantime the divisions that might have gone east to " +
          "finish a Russian army go into the line in France instead, and the war " +
          "settles into the shape the new Chief expects: a long struggle for a decision " +
          "on the one front where he believes one is possible.",
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
          "responsibility that comes with them. The west is held thinner than it was, " +
          "by an army that has just been stopped on the Marne and is digging in. " +
          "Whether Russia can be finished with the extra divisions is the whole bet, " +
          "and the record gives no answer.",
      },
      {
        id: "aisne",
        label: "Order the armies to dig in on the Aisne, and leave the choice of theatre until the line is held",
        advisor: { name: "Tappen", position:
          "The armies are tired and the line has to be made safe before any plan is made. The theatre can be chosen when the line holds, and not before." },
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { ohl_theatre: "waited" },
        next: "ohl_1914_13_ypres",
        outcome:
          "Speculative. The armies are ordered to entrench where they stand, and the new Chief names no " +
          "theatre for the weight of the war. The line on the Aisne is made strong and the exhausted " +
          "corps are given a few days. The army commanders, left without a plan, try to turn each " +
          "other's flanks to the north, as they did in fact, and the east, which asked for an " +
          "answer, is told to wait. The decision is put off, and the war chooses a theatre in the meantime.",
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
    choices: [
      {
  id: "press",
  label: "Make one more concentrated attack at Ypres before the winter",
  historical: true,
  advisor: { name: "Falkenhayn", position:
    "The coast is the one place in the west where a result is still possible. If it is not taken now it will not be taken." },
  keyBattleSubgame: { id: "ypresGerman" },
  impact: { manpower: -1, munitions: -1, will: 0 },
  setFlags: { ohl_flanders: "pressed" },
  dispute:
    "Historians differ about how close the German attack came to a breakthrough at " +
    "Ypres in the autumn of 1914. British accounts of the crisis of 31 October stress " +
    "how thin the line was and how little stood behind it. German accounts stress the " +
    "exhaustion of the reserve corps and the want of reserves behind the attack. Both " +
    "can be true of the same days.",
  uncertain: [
    { weight: 65, title: "The attack makes ground and not the breakthrough", historicalBranch: true,
      impact: { manpower: -1, munitions: -1, will: 0 },
      next: "ohl_1915_14_gorlice",
      outcome:
        "The last concentrated attack goes in in the second week of November, with " +
        "fresh divisions and a heavy bombardment. It makes ground at several points " +
        "and does not make the breakthrough, and the local fighting dies away by the " +
        "end of the month. The front in Flanders has settled into lines that will " +
        "move very little for years. The reserve corps that made the attack are left " +
        "to bury what remains of them." },
    { weight: 35, title: "The line gives for two days, and is closed",
      impact: { manpower: -2, munitions: -1, will: 1 },
      next: "ohl_1915_14_gorlice",
      outcome:
        "Speculative. The attack goes in on the 11th and the line gives where it was " +
        "thinnest, in the woods east of Ypres. A gap opens, and for two days there is " +
        "nothing behind it that the British can put in. Reserves are brought up and " +
        "the gap is closed, at a price in men that the German reserve corps can no " +
        "more afford than the British. The ground is held, and the ports are no nearer " +
        "than the Chief expected at the start." },
  ],
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
          "the autumn left it, and the coast is never again as open as it is this week.",
      },
      {
        id: "dig",
        label: "Hold what has been won at Ypres, dig in, and keep the divisions in Flanders for the winter",
        advisor: { name: "Tappen", position:
          "A line held through the winter by fresh divisions is a line a spring offensive can start from. Another assault now spends them on ground the weather will take back." },
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { ohl_flanders: "held" },
        next: "ohl_1915_14_gorlice",
        outcome:
          "Speculative. The attack is not renewed and the divisions are not sent away. They dig " +
          "in where the first weeks left them, and the line at Ypres becomes the line that will " +
          "be held through the winter. The Channel ports are still behind the British, and the " +
          "Chief has spent nothing in trying for them. At home it is read as a pause, and the " +
          "newspapers are told that the position is being consolidated, which is true.",
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
    choices: [
      {
        id: "gorlice",
        label: "Form a new army under Mackensen and break through at Gorlice and Tarnów",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "An ally that collapses takes the whole eastern front with it. A breakthrough relieves it and costs a fraction of what a campaign in Russia would." },
        impact: { manpower: 0, munitions: -1, will: 1 },
        setFlags: { ohl_gorlice: "mackensen", xc_gorlice: "mackensen" },
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
        setFlags: { ohl_gorlice: "envelop", xc_gorlice: "envelop" },
        erodes: "spend_will",
        next: "ohl_1915_15_serbia",
        outcome:
          "Speculative. Divisions are drawn east in larger numbers than the Galician " +
          "plan needed, for an operation whose object is to encircle the Russian armies " +
          "in Poland. The Austro-Hungarian front has to hold with what it has in the " +
          "meantime, and the west is left with whatever is not needed elsewhere. An " +
          "envelopment needs the enemy to stay where he is until it closes, and that is " +
          "the part nobody here can promise.",
      },
      {
        id: "carpathians",
        label: "Send German divisions to the Carpathians as Conrad asks, and attempt nothing larger",
        advisor: { name: "Tappen", position:
          "The ally can be held up where he stands with what has already been promised. A new army is a larger bet than the Carpathians need." },
        impact: { manpower: -1, munitions: 0, will: 0 },
        setFlags: { ohl_gorlice: "carpathians" },
        next: "ohl_1915_15_serbia",
        outcome:
          "Speculative. German divisions are put into the Carpathian line beside the " +
          "Austro-Hungarian army, and the retreat stops. Nothing is attempted beyond holding " +
          "it. Russia keeps the initiative in Poland through the spring. The ally is propped " +
          "and not relieved, and Vienna will ask again before the summer is out, with less " +
          "patience and a worse position than it has today.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-09
  ohl_1915_15_serbia: {
    year: 1915, date: "1915-09-06", city: "Belgrade",
    title: "A Road to Constantinople",
    advisors: ["falkenhayn", "tappen"],
    situation: (flags) =>
      "Bulgaria has signed with the Central Powers. The military convention puts " +
      (flags.xc_pless === "own"
        ? "the German and Bulgarian armies under Mackensen, with the Austro-Hungarian Third Army keeping its own commander and taking its orders from AOK, "
        : "German, Austro-Hungarian and Bulgarian armies under Mackensen, ") +
      "with the task of " +
      "defeating the Serbian army and opening a land connection between Hungary and " +
      "Bulgaria.\n\n" +
      "That connection is the only way to get German guns and shells to the Ottoman " +
      "Empire, which has held the Dardanelles since the landings in April and is short " +
      "of both.\n\n" +
      "The price is divisions taken from other fronts in the season when the Allies " +
      "attack in the west.",
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
          "Bulgarian armies, from the east. Belgrade falls within days. The Serbian " +
          "army and a long column of civilians retreat west and south over the " +
          "mountains of Albania in the winter. By the new year German supplies are " +
          "moving to Constantinople by rail, and the Ottoman army has the guns it was " +
          "short of. Serbia is gone as a front.",
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
          "army goes on short of what Germany could have sent it, guns and shells above " +
          "all. The Allies attack in the west in the autumn against a line that has all " +
          "its divisions in it. Bulgaria, having signed, is left with nothing to do but " +
          "wait.",
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
    choices: [
      {
        id: "attrition",
        keyBattleSubgame: { id: "verdunGerman" },
        label: "Make the object the French army — hold the ground, let them counter-attack into the guns",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "They will not give up Verdun. We do not need the city if they will spend the army defending it." },
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
              "The guns do the work and the infantry is not spent taking ground for its own " +
              "sake. The French come on to the artillery as expected, in counter-attacks " +
              "that cost them far more than the ground is worth. The ledger is grim on both " +
              "sides and the German column of it is smaller than it might have been. The operation does what the memorandum said it would." },
          { weight: 55, title: "Fifth Army reads the directive as an order to take the fortress", historicalBranch: true,
            impact: { manpower: -2, will: -1 },
            setFlags: { ohl_verdunExec: "fortress" },
            next: "ohl_1916_14_somme",
            outcome:
              "The Crown Prince's headquarters takes the instruction to mean the city, and " +
              "the operation becomes what the directive was meant to avoid: German infantry " +
              "attacking prepared positions on ground that has no value except that the " +
              "attack has already been made for it. The distinction between the two " +
              "readings stops mattering somewhere in March, and by then the army that was " +
              "meant to bleed the French is bleeding beside them." },
        ],
      },
      {
        id: "elsewhere",
        label: "Decline the Meuse — hold in the west and wait for the enemy to attack first",
        advisor: { name: "Crown Prince Wilhelm", position:
          "If the object is the French army and not the city, say so, or do not begin." },
        impact: { manpower: 1, munitions: 1, will: -2 },
        gate: (m) => m.will >= 1,
        disabledReason: "A year without an offensive cannot be explained at home from here",
        setFlags: { ohl_verdun: "declined" },
        erodes: "spend_will",
        next: "ohl_1916_14_somme",
        outcome:
          "Speculative. No offensive on the Meuse. The shells and the five divisions " +
          "stay in hand and the army in the west spends 1916 waiting, which is a " +
          "coherent strategy and an intolerable one to explain to a country that has " +
          "been told the war is being won. When the British and French attack in the " +
          "summer they find a line with its reserves behind it. The Chief has kept his " +
          "army and has nothing to show for it.",
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
      "bombardment. In most places the German line has held. At the southern end, where French and British lines meet, it has not: ground has already been lost.\n\n" +
      (flags.ohl_verdun === "declined"
        ? "No German army is committed on the Meuse, so the reserves are in hand. They " +
          "are also the only reserves there are."
        : "The reserves are on the Meuse, where the offensive is still being fed. What " +
          "can be spared for the Somme is what the Meuse does not need, which is very " +
          "little.") +
      "\n\nThe question put to the Chief is a rule rather than an operation. Either " +
      "every yard lost is to be retaken at once, or the line may bend.",
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
          "at home as something other than a defeat. The officers who hold that no yard may be given up say so.",
      },
      {
        id: "verdun",
        label: "Stop the offensive on the Meuse and send its reserves to the Somme",
        advisor: { name: "Tappen", position:
          "The Meuse has cost more than it has taken, and the Somme is where the enemy is strongest. The reserves belong where the line is bending, and not where the offensive has run down." },
        impact: { manpower: 0, munitions: -1, will: -1 },
        setFlags: { ohl_somme: "shifted" },
        next: "ohl_1916_05_relief",
        outcome:
          "Speculative. The offensive at Verdun is stopped in the first days of July, and the divisions " +
          "that were feeding it are sent to the Somme. The ground lost at the south end is counter-attacked " +
          "with fresh troops and not retaken piecemeal, and the French, no longer pressed on the Meuse, " +
          "are free to find more men for the Somme. The Chief has given up the object he chose in the winter.",
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
          "being answered somewhere other than in this building, in the arithmetic of " +
          "ships and tonnage. For the first time since 1914 this headquarters has a " +
          "reserve and no plan to spend it on.",
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
          "would have been rebuilt are not rebuilt, and the shell reserve that was " +
          "meant to last the winter goes into the mud in November. The new Chiefs have " +
          "kept the old Chief's policy for the sake of consistency, and will be asked " +
          "in the spring what it bought.",
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
          "The programme is issued at the end of August, and the Auxiliary Service " +
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
    title: "Five Months, by Arithmetic",
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
      "is out inside five months — before American strength could be raised, shipped " +
      "and brought to bear. The paper has the appearance of arithmetic and the " +
      "backing of every senior soldier in the Empire.\n\n" +
      "The Chancellor's objection is the United States: this brings them in, the figures assume everything runs as projected, and " +
      "that if the five months pass without Britain breaking, there is no second plan " +
      "and a new enemy with no upper limit on its manpower.",
    choices: [
      {
        id: "unrestricted",
        label: "Unrestricted submarine warfare from 1 February",
        historical: true,
        advisor: { name: "Holtzendorff", position:
          "The tonnage figures are conservative and the timetable holds. Six months is not a hope, it is a calculation." },
        impact: { manpower: 0, munitions: 1, will: 2 },
        setFlags: { ohl_usw: "unrestricted", ohl_usEntry: "certain", xc_usw: "unrestricted" },
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
          "If the five months pass and Britain is still in, we will have added an enemy and have nothing left to add ourselves." },
        impact: { manpower: 0, munitions: -1, will: -2 },
        gate: (m) => m.will >= -1,
        disabledReason: "The Supreme Command no longer has the standing to overrule the naval staff",
        setFlags: { ohl_usw: "restricted", ohl_usEntry: "deferred", xc_usw: "restricted" },
        erodes: "spend_will",
        next: "ohl_1917_12_alberich",
        outcome:
          "Speculative. The U-boats stay under prize rules, American neutrality is not " +
          "forced, and the war in the west continues on the ground with no instrument " +
          "for changing it. The Supreme Command has declined the only decisive-looking " +
          "option it had and now has to find another. The Chancellor has won the argument, and the soldiers who lost it know who won it.",
      },
      {
        id: "sharpened",
        label: "Sharpen the submarine war inside the cruiser rules: a wider zone, and no warning for armed ships only",
        advisor: { name: "Bethmann Hollweg", position:
          "A zone drawn wide, with the rules kept for neutral ships and liners, gives the Navy a great deal and gives the Americans nothing to declare war on." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { ohl_usw: "sharpened", ohl_usEntry: "deferred", xc_usw: "restricted" },
        next: "ohl_1917_12_alberich",
        outcome:
          "Speculative. The Navy is given a larger zone and leave to sink armed ships without " +
          "warning. Neutral ships and passenger liners stay under the old rules. The tonnage " +
          "sunk rises, but not to the figure in the memorandum, and Holtzendorff's five months " +
          "run out with Britain's convoys still untried. The Americans do not declare war " +
          "in February. The soldiers hold that the compromise has put the lives of U-boat " +
          "crews into a half measure.",
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
          "The ground can be given up without being destroyed. The destruction harms the Empire's prestige and the discipline of the troops more than it harms the enemy." },
        impact: { manpower: 2, munitions: 0, will: 0 },
        setFlags: { ohl_alberich: "spared" },
        next: "ohl_1917_07_chancellor",
        outcome:
          "Speculative. The army goes back to the new line, and the villages and roads " +
          "behind it are left standing. The enemy moves up faster than he did, over " +
          "roads and through towns that are whole. The retirement frees the divisions " +
          "it was meant to free, and no report of burned villages goes to the neutral " +
          "press. What the army gains in good name it loses in the weeks it would have " +
          "gained by delaying the pursuit.",
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
          "Speculative. The army stays in the bulge. The new line is finished and empty " +
          "behind it. The enemy attacks the old line in the spring, with the divisions " +
          "that would have been freed still in it, and the army holds the ground it was " +
          "told not to give up at a cost that the commanders who proposed the " +
          "withdrawal had already put in writing. Ludendorff has kept his ground and " +
          "spent his reserve.",
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
          "failure from here belongs to this headquarters whether it caused it or not. " +
          "The Reichstag passes its resolution anyway, and the Chancellor who might " +
          "have answered it is gone.",
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
          "subordinate, and an argument to lose every time it wants something. The " +
          "Reichstag resolution goes through, and the army is told by its own " +
          "government what the war is for. Ludendorff and Hindenburg have to decide " +
          "whether they will go on serving a government they tried to remove.",
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
    choices: [
      {
        id: "send",
        label: "Send German divisions to the Isonzo and take command of the offensive",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "Austria-Hungary has to be kept in the war. A blow on the Isonzo is the cheapest way of doing it." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { ohl_caporetto: "sent", xc_caporetto: "sent" },
        next: "ohl_1918_12_faustschlag",
        outcome:
          "A Fourteenth Army is made up of German and Austro-Hungarian divisions under " +
          "Otto von Below. The offensive opens on 24 October and the Italian line at " +
          "Caporetto breaks. The Italians retreat to the Piave, and the Allies send " +
          "divisions to hold them. Austria-Hungary does not leave the war, and Germany " +
          "has bought it a winter at the price of six or seven divisions and a good " +
          "deal of its own attention.",
      },
      {
        id: "refuse", ally: "Vienna",
        label: "Send guns and staff officers but no divisions",
        impact: { manpower: 1, munitions: -1, will: 0 },
        setFlags: { ohl_caporetto: "refused", xc_caporetto: "refused" },
        next: "ohl_1918_12_faustschlag",
        outcome:
          "Speculative. Vienna gets the artillery it asked for and not the divisions. " +
          "The Isonzo line holds, or it does not, on the strength of an army that has " +
          "been strained to the limit. Whatever happens there, the divisions stay in " +
          "Flanders, where the British are still attacking. The Emperor has asked his ally for a great deal and been given a little, and he has noted the proportion.",
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
        ? "The German divisions sent to Italy have come out of it."
        : "The divisions that did not go to Italy are where they were.") +
      " Every division that stays in the east is one that is not in France in March." +
      (flags.xc_ukraine === "kept" ? "\n\nVienna has told Berlin that no Austro-Hungarian division will go into Ukraine. The occupation, and the grain, will be German work alone." : ""),
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
          "fighting, by rail where the lines are whole. Minsk is taken on the 21st, and " +
          "Kiev on 2 March. On 3 March the Russian government signs the treaty that it " +
          "refused to sign on the 10th. The army has what it marched for, and has to " +
          "garrison it.",
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
      {
        id: "narva",
        label: "Advance only to the line of the Narva, Pskov and the Dvina, and halt there",
        advisor: { name: "Hindenburg", position:
          "A line that can be held, taken quickly, gives the army what it needs in the Baltic and keeps the divisions for the west." },
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { ohl_faust: "narva" },
        next: "ohl_1918_08_brest",
        outcome:
          "Speculative. The armies advance to the Dvina and Pskov and halt. Ukraine is left to " +
          "the agreements already made with Kiev, and the line that has been taken is shorter " +
          "than the line the full advance would have drawn. More divisions are free for " +
          "France in March. The annexationists at home complain of an opportunity half used, " +
          "and the treaty, when it comes, is signed on terms drawn by an army that stopped " +
          "where it chose.",
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
    choices: [
      {
        id: "harsh",
        label: "Take the full settlement — hold what the treaty gives",
        historical: true,
        advisor: { name: "Ludendorff", position:
          "We will not get a second chance at the east. Take it now and garrison it, and the west will still have enough." },
        impact: { manpower: 2, munitions: 1, will: 1 },
        setFlags: { ohl_brest: "maximal" },
        erodes: "spend_will",
        next: "ohl_1918_09_michael",
        outcome:
          "The terms are severe and the territory is enormous. Around fifty divisions " +
          "come west; by the twenty-first of March a hundred and ninety-two of the " +
          "army's divisions are on the Western Front. The rest are administering the " +
          "prize, and they stay there. The Chief has what the annexationists wanted, " +
          "and the divisions he would have wanted in France are in Ukraine and the " +
          "Baltic, counting grain and signing receipts.",
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
          "that did not want it. The army has the weight it asked for in the spring. " +
          "Whether it is enough to win, or only enough to lose more slowly, is not a " +
          "question the figures settle.",
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
    choices: [
      {
        id: "adaptive",
        keyBattleSubgame: { id: "michaelGerman" },
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
              "Sixty-five kilometres of ground and the largest breakthrough since the line " +
              "stopped moving. Amiens is threatened and not taken. The armies on the flanks " +
              "are too worn to widen the front, the direction of the advance no longer " +
              "serves the envelopment it was meant to serve, and what has been gained is a " +
              "salient exposed on every side. Losses among the best divisions are far " +
              "beyond what can be replaced." },
          { weight: 40, title: "The exploitation reaches the junction",
            impact: { manpower: -1, munitions: -1, will: 1 },
            setFlags: { ohl_michaelResult: "amiens" },
            next: "ohl_1918_13_aisne",
            outcome:
              "Speculative. The adaptive method finds the seam and the exploitation carries " +
              "to the junction. The British and French are separated on the ground. What " +
              "that is worth depends entirely on what can be moved through the gap before " +
              "it closes, and the answer to that is not encouraging: the railways behind " +
              "the advance are broken, the horses are starving, and the divisions at the " +
              "head of it have been marching for a week." },
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
          "before the enemy does. The divisions that would have gone wherever the line " +
          "gave way are held for the one objective, and the Chief has staked the whole " +
          "offensive on a single railway junction, without any second plan if the road " +
          "to it proves too long.",
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
      "advance." +
      (flags.xc_command1918 === "national" ? "\n\nIntelligence from the other side shows two Allied commands still giving separate orders, and the reserves going where each thinks best, not where the whole front needs them." : ""),
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
          "Speculative. The army stops where the plan said it should, with a gain that " +
          "was never in the plan, and the reserves go back to the north. The attack in " +
          "Flanders goes ahead as designed, against a British army that has had time to " +
          "prepare for it. Paris is not threatened, and the country is told so.",
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
      "Giving up ground bought at this price raises the problem of what can be said at home.",
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
          "first time since March, and no communiqué makes that mean anything else. The " +
          "army has more men in September than it would otherwise have had, and the " +
          "country has less faith. A retirement is easier to order than to explain, and " +
          "the explaining falls to this headquarters.",
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
          "by this headquarters. The ground taken in the spring is given up anyway, but " +
          "at the cost of the divisions that held it through the summer, and the army " +
          "that has to fall back in the autumn is a smaller one than the army that " +
          "could have fallen back in July.",
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
      "in the west." +
      (flags.xc_command1918 === "national" ? "\n\nThe attack at Amiens fell on a front where the British and French commands had not been put under one hand, and it shows in how slowly the French reserves came up." : ""),
    choices: [
      {
        id: "defensive",
        label: "Go over to the strategic defensive and let the Foreign Secretary open an approach",
        historical: true,
        advisor: { name: "Hintze", position:
          "A defensive in the west has to go with an approach to the enemy. The army alone cannot end this." },
        attested: { by: "Ludendorff", text: "the black day of the German Army",
          source: "Ludendorff, My War Memories, on 8 August 1918" },
        impact: { manpower: 2, munitions: 0, will: -1 },
        setFlags: { ohl_blackday: "defensive" },
        next: "ohl_1918_11_request",
        outcome:
          "The council agrees on a defensive in the west, with the aim of making the " +
          "enemy tired of fighting. The Foreign Secretary is asked to find out, through " +
          "neutral channels, what terms are possible. The army goes on giving ground in " +
          "orderly stages through September. The decision is not announced, and the " +
          "country goes on reading communiqués that describe a different war from the " +
          "one it is losing.",
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
          "Speculative. Another attack is prepared for September, with divisions taken " +
          "from the quiet sectors. It is a smaller operation than any of the spring's, " +
          "and it is aimed at a front that the enemy has had time to reinforce. The " +
          "divisions are drawn from sectors that were holding only because they were " +
          "quiet, and the Chief has chosen to spend them on one more attempt rather " +
          "than keep them to fall back on.",
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
      "of an enemy it can still hurt. The army is still there. What has gone is the possibility of any outcome except a worse one later.\n\n" +
      (flags.ohl_salient === "shortened"
        ? "The line is short and held, and the reserve exists. It buys months. It does not buy a different answer."
        : "The divisions that took the salients in the spring are the divisions that were spent holding them.") +
      "\n\nWhether an armistice is sought is already settled. What is decided now is who is recorded as having sought it.",
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
          "Within a few years a great many people who were in this building will " +
          "explain that the army was never beaten and that the request came from " +
          "somewhere else. The army goes on retreating in order, and the country learns " +
          "from a note to an American President what its own headquarters decided a " +
          "week ago. It is the last decision that is entirely this headquarters' own.",
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
          "it lasts as long as the line does. The government that has not been asked to " +
          "ask for anything goes on governing a population that is eating turnips. The " +
          "Chief has kept the choice for himself, and the people behind him have not " +
          "been consulted about the price.",
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
          "unbroken, from a position that can still be described as strong. The enemy " +
          "governments have to decide whether to treat with an army that has not been " +
          "beaten in the field, and whether to believe an offer that comes from the " +
          "Supreme Command rather than from a government. Nothing the record shows can " +
          "say what they would have answered, and the ending does not pretend to.",
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
          "resignation and keeps Hindenburg. Ludendorff is replaced by Groener, and the " +
          "armistice request stands. The army is told one thing by its headquarters and " +
          "another by its government, in the same week.",
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
          "end. What the army is told about the negotiation is left to the Chancellor, " +
          "who tells it what he thinks it can bear. The Supreme Command has given up " +
          "the last instrument it had of independent action, and it has done so in the " +
          "week when the army most needs to believe it has one.",
      },
    ],
  },

  // ---------------------------------------------------------------- endings
  ohl_end_armistice: {
    year: 1918, date: "1918-11-11", city: "Spa",
    title: "The Request",
    advisors: ["hindenburg"],
    situation: (flags) =>
      "In the sense the word is used in staff colleges the army in the west is not broken: it is retreating in order, on ground it still holds, in front of an " +
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
      "The deployment, August 1914: " + (flags.ohl_timetable === "slipped" ? "the Kaiser's question put to the railways, and days lost." : flags.ohl_timetable === "asked" ? "the Kaiser's question put to the railways, and answered." : "as the plan was written.") + "\n" +
      "Lorraine, August 1914: " + (flags.ohl_lorraine === "reinforced" ? "reinforced." : "conceded, as the plan required.") + "\n" +
      "The Marne: " + (flags.ohl_marne === "inperson" ? "judged in person at the front." : "delegated forward under plenipotentiary authority.") + "\n" +
      "Two corps for the east: " + (flags.ohl_twocorps === "kept" ? "kept on the right." : "sent to East Prussia by rail.") + "\n" +
      "Ypres, November 1914: " + (flags.ohl_flanders === "broken" ? "broken off." : flags.ohl_flanders === "held" ? "no new attack, and the line dug in." : "one more concentrated attack.") + "\n" +
      "The eastern front, 1915: " + (flags.ohl_gorlice === "envelop" ? "a wide envelopment." : flags.ohl_gorlice === "carpathians" ? "German divisions in the Carpathians and nothing larger." : "a breakthrough at Gorlice.") + "\n" +
      "Serbia: " + (flags.ohl_serbia === "declined" ? "declined." : "attacked in October 1915.") + "\n" +
      "The Meuse: " + (flags.ohl_verdun === "declined" ? "declined." : (flags.ohl_verdunExec === "fortress" ? "fought as a battle for the fortress." : "fought as the directive was written.")) + "\n" +
      "The Somme: " + (flags.ohl_somme === "elastic" ? "ground given where it was dear." : flags.ohl_somme === "shifted" ? "the Meuse offensive stopped and its reserves sent south." : "no ground to be given up.") + "\n" +
      "The Hindenburg Programme: " + (flags.ohl_programme === "moderate" ? "a smaller programme." : "adopted at full size.") + "\n" +
      "The submarines: " + (flags.ohl_usw === "restricted" ? "held under prize rules." : flags.ohl_usw === "sharpened" ? "sharpened inside the cruiser rules." : "unrestricted from 1 February 1917.") + "\n" +
      "Weight of effort after the Marne: " + (flags.ohl_theatre === "east" ? "shifted east." : flags.ohl_theatre === "waited" ? "left undecided for a time, and held in the west." : "held in the west.") + "\n" +
      "Posture for 1917: " + (flags.ohl_1917posture === "offensive" ? "continued offensive effort." : "defensive, rebuilding.") + "\n" +
      "American entry: " + (flags.ohl_usEntry === "deferred" ? "deferred." : "brought on by the decision of 9 January 1917.") + "\n" +
      "The retirement to the Siegfried Line: " + (flags.ohl_alberich === "held" ? "refused." : flags.ohl_alberich === "spared" ? "made, with the ground left standing." : "made, with the ground destroyed.") + "\n" +
      "Italy, autumn 1917: " + (flags.ohl_caporetto === "refused" ? "guns and staff officers, no divisions." : "German divisions and the offensive at Caporetto.") + "\n" +
      "February 1918: " + (flags.ohl_faust === "declared" ? "the Russian declaration accepted." : flags.ohl_faust === "narva" ? "the advance stopped at the Narva, Pskov and Dvina line." : "the advance resumed on the 18th.") + "\n" +
      "Brest-Litovsk: " + (flags.ohl_brest === "narrow" ? "narrow settlement, divisions released west." : "maximal settlement, divisions retained in garrison.") + "\n" +
      "Spring 1918: " + (flags.ohl_michael === "amiensfirst" ? "Amiens named as the objective." : "breakthrough taken as the objective.") + "\n" +
      "The Aisne, May 1918: " + (flags.ohl_aisne === "halted" ? "halted on the Vesle." : "exploited to the Marne.") + "\n" +
      "After 8 August: " + (flags.ohl_blackday === "offensive" ? "another offensive planned." : "the strategic defensive.") + "\n" +
      "September 1918: " + (flags.ohl_request === "refused" ? "the request was refused." : flags.ohl_request === "early" ? "terms were sought early." : "requested through a new civil government.") + "\n" +
      "The third American note: " + (flags.ohl_wilson === "accepted" ? "left to the government." : "answered by an order to the army, and Ludendorff's resignation.") + "\n\n" +
        "What actually happened: The request went to President Wilson on 3 and 4 " +
        "October, the Kaiser's abdication was announced on 9 November, and the " +
        "armistice was signed at Compiègne on the morning of 11 November. The peace " +
        "was signed at Versailles on 28 June 1919. The Supreme Command's account, " +
        "that an undefeated army had been betrayed at home, was in print within a " +
        "year.",
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
      "front for a country that had stopped being able to supply one.\n\nWhat " +
      "actually happened: The army retreated in order to the end. The collapse came " +
      "from behind it: the sailors' mutiny at Kiel at the start of November, " +
      "councils of workers and soldiers spreading through the cities, and the " +
      "Kaiser's abdication on 9 November, when a republic was proclaimed in Berlin. " +
      "The blockade had been felt in hunger since the turnip winter of 1916 and " +
      "1917. The claim that an undefeated army had been stabbed in the back by its " +
      "own home front grew out of exactly this. The Treaty of Versailles, signed on " +
      "28 June 1919, was then presented in Germany as a peace imposed on a country " +
      "that had never been beaten.",
  },

  ohl_end_armyfirst: {
    year: 1918, date: "1918-10-20", city: "Spa",
    title: "The Front Gives",
    advisors: ["hindenburg"],
    situation:
      "This is the outcome the Supreme Command spent four years arranging not to have: " +
      "a break in the field, in daylight, with nothing behind it. The divisions asked " +
      "to close it are the divisions that were used up making and then holding the " +
      "spring's ground.\n\nNobody here argues about whether the army is beaten. Everyone can see where it happened.",
    ending: { family: "army-collapse-first", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The historical German army retreated in order to the end and " +
      "was never broken open in the field. Spending it harder than it was spent " +
      "leaves nothing for anyone to reinterpret afterwards.\n\nWhat actually " +
      "happened: The army never broke open in the field. Between July and November " +
      "it fell back from the Marne to the Meuse and the Scheldt, giving up ground " +
      "and prisoners, but it kept a front, and its units marched home in order " +
      "after the armistice. That the army could be said to have been undefeated, " +
      "and that its leaders afterwards said so, depended on the front never having " +
      "been breached in daylight, which this ending takes away. The officers who " +
      "made that claim in the years after the war were describing a front that, in " +
      "the days of the armistice, they still held.",
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
      "having been held.\n\nWhat actually happened: There was no winter line. The " +
      "request went to President Wilson in the first week of October, his replies " +
      "made the Allied terms plain by the end of the month, and the armistice was " +
      "signed on 11 November. The Allies had a larger campaign in preparation for " +
      "1919, with more tanks and a growing American army, and it was never needed. " +
      "Whether the German front could have held through the winter was never " +
      "tested. The terms of the armistice were severe, but they were the terms of " +
      "an army that still had a front, which was one reason the war ended when it " +
      "did.",
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
      "Entente's willingness to treat with an unbeaten German army in September " +
      "1918 is not something the record can settle, and this ending does not " +
      "pretend it can.\n\nWhat actually happened: No approach was made in " +
      "September. The first request to Wilson went on 3 and 4 October, from a new " +
      "government under Prince Max of Baden, after Ludendorff had told a council at " +
      "Spa on 29 September that the army could not wait. Wilson replied three times " +
      "and each reply set a harder condition. The Allies never had to answer an " +
      "offer from an army that was still intact, because none was made. The Allies' " +
      "public position throughout was that there could be no talk of peace with the " +
      "old system of government in Germany, and that decided the order in which " +
      "things happened.",
  },

  ohl_end_worseterms: {
    year: 1918, date: "1918-11-11", city: "Compiègne",
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
      "Speculative. The terms depend on more than the armies: they are made by what the asking side still has when it asks.\n\nWhat actually happened: The armistice " +
      "was signed in the railway carriage at Compiègne at about five in the morning " +
      "of 11 November, by a delegation led by the civilian politician Matthias " +
      "Erzberger and not by a soldier, who had been given seventy-two hours to " +
      "accept. The terms required the evacuation of occupied territory and of the " +
      "left bank of the Rhine, the surrender of guns, aircraft, submarines and much " +
      "of the fleet, and kept the blockade in force until the peace. The delegation " +
      "had no authority to bargain and little to bargain with, and the few " +
      "concessions it did obtain, among them a reduction in the numbers of guns and " +
      "machine guns to be surrendered, did not change the character of the terms.",
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
      "different amount.\n\nWhat actually happened: Neither condition was met. The " +
      "eastern settlement was the harsh one, and about fifty divisions came west " +
      "from it, not all that might have. The salients were held through July and " +
      "the army that asked for an armistice in the autumn was a worn army with few " +
      "reserves. The armistice required it to leave France, Belgium and " +
      "Alsace-Lorraine within fifteen days and to give up its heavy equipment, " +
      "whatever state it was in. The army's condition was not the thing that made " +
      "the terms, which were made by the Allies' own view of what they needed in " +
      "order not to fight again.",
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
      "Speculative. Territory is only an asset if it can be held with fewer men " +
      "than it releases.\n\nWhat actually happened: Germany did hold the east when " +
      "the war ended, with Brest-Litovsk in force and its troops in the Baltic " +
      "provinces and Ukraine. The armistice annulled the treaty and told the troops " +
      "in the former Russian territories to withdraw when the Allies judged the " +
      "moment suitable. Many stayed, in the Baltic, into 1919, where Freikorps " +
      "units fought against the Bolsheviks and the new Baltic governments. The " +
      "prize was held for a winter after the war that was meant to secure it. The " +
      "eastern settlement that the Supreme Command spent the war trying to secure " +
      "was undone in a single clause, and the armies that were to hold it were the " +
      "same armies that went home.",
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
      "The office continues without its occupant.\n\nWhat actually happened: " +
      "Ludendorff was dismissed on 26 October 1918, after the order to the army " +
      "that answered Wilson's third note, and Hindenburg stayed. Groener took his " +
      "place as First Quartermaster General, and on 9 November he told the Kaiser " +
      "at Spa that the army no longer stood behind him. The Kaiser left for the " +
      "Netherlands the next day. The office went on after its occupants had gone, " +
      "as the epilogue says. Ludendorff left for Sweden, in civilian clothes and " +
      "dark glasses, afterwards, and Hindenburg remained at his post " +
      "until the army was home. The Supreme Command that had set out in 1916 to win " +
      "the war by force of will ended it as the object of a quarrel among the " +
      "people it had governed.",
  },
};

