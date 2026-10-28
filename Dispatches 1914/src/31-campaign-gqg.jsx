// =============================================================================
// FRENCH GQG — HISTORICAL SPINE
// =============================================================================
//
// The 1917 mutinies are the campaign's centrepiece. Design constraint, stated
// explicitly: the repression is NARRATED, never dialled. The player does not set
// a number of executions. The choice is concession, discipline, or both — which
// is the choice the command actually faced. The execution count is itself
// disputed in the literature and the game says so rather than picking one.
// =============================================================================

CAMPAIGNS.gqg.startNode = "gqg_1914_17_covering";

CAMPAIGNS.gqg.commanders = [
  { id: "joffre", name: "Joffre", title: "Commander-in-Chief", from: "1914-07-30", to: "1916-12-12" },
  { id: "nivelle", name: "Nivelle", title: "Commander-in-Chief", from: "1916-12-12", to: "1917-05-15" },
  { id: "petain", name: "Pétain", title: "Commander-in-Chief", from: "1917-05-15", to: "1918-11-11" },
];

CAMPAIGNS.gqg.advisors = [
  { id: "joffre", name: "Joffre", from: "1914-07-30", to: "1916-12-12",
    dossier: { role: "Commander-in-Chief, 1914-1916",
      bio: "Directed the armies from the Frontiers through the Marne, the 1915 offensives, Verdun and the Somme. Advocated concerted allied attack throughout.",
      fate: "Relieved in December 1916 and made a Marshal of France." } },
  { id: "castelnau", name: "de Castelnau", from: "1914-07-30", to: "1918-11-11",
    dossier: { role: "Army and army group commander; chief of staff at GQG",
      bio: "Present at most of the war's decisions on the French side without ever holding the top command.",
      fate: "Survived the war. Not made a Marshal." } },
  { id: "gallieni", name: "Gallieni", from: "1914-07-30", to: "1916-05-27",
    dossier: { role: "Military Governor of Paris; later Minister of War",
      bio: "Held Paris in September 1914 and pressed for the counterattack against the exposed German flank.",
      fate: "Left the war ministry in 1916 on grounds of health and died that May." } },
  { id: "petain", name: "Pétain", from: "1914-07-30", to: "1918-11-11",
    dossier: { role: "Commander at Verdun; Commander-in-Chief from May 1917",
      bio: "Made his reputation on the defence of Verdun and the rotation system that fed the army through it. Took the command in May 1917 with the army in open indiscipline.",
      fate: "Restored the army through leave, rest and limited-objective operations. He later headed the Vichy regime." } },
  { id: "nivelle", name: "Nivelle", from: "1916-12-12", to: "1917-05-15",
    dossier: { role: "Commander-in-Chief, December 1916 to May 1917",
      bio: "Came to prominence at Verdun in late 1916 and offered the governments what they wanted to hear: a rupture of the German line in forty-eight hours at a cost of around ten thousand men.",
      fate: "Relieved on 15 May 1917 and sent to North Africa." } },
  { id: "mangin", name: "Mangin", from: "1914-07-30", to: "1918-11-11",
    dossier: { role: "Corps and army commander",
      bio: "Supported the Nivelle plan and fell with it in April 1917. Returned to command and led the counterattack of July 1918.",
      fate: "Survived the war." } },
  { id: "painleve", name: "Painlevé", from: "1917-03-20", to: "1917-11-16",
    dossier: { role: "Minister of War from March 1917",
      bio: "Sceptical of the Nivelle plan from the start. Extracted the promise that the offensive would stop if it had not broken through in forty-eight hours.",
      fate: "Briefly Prime Minister in late 1917." } },
  { id: "foch", name: "Foch", from: "1914-07-30", to: "1918-11-11",
    dossier: { role: "Army group commander; Allied generalissimo from 1918",
      bio: "Given coordinating authority over the Allied armies in the crisis of March 1918 and general command thereafter.",
      fate: "Marshal of France." } },
  { id: "clemenceau", name: "Clemenceau", from: "1917-11-16", to: "1918-11-11",
    dossier: { role: "Prime Minister from November 1917",
      bio: "Took office committed to prosecuting the war without negotiation and to subordinating the command to the civil power rather than the reverse.",
      fate: "Led the French delegation at the peace conference." } },
  { id: "lyautey", name: "Lyautey", from: "1916-12-12", to: "1917-03-20",
    dossier: { role: "Minister of War, December 1916 to March 1917",
      bio: "Opposed the Nivelle plan and resigned rather than carry it.",
      fate: "Returned to Morocco." } },
];

CAMPAIGNS.gqg.bulletinVoice = {
  source: "Communique officiel of the Grand Quartier General, as printed in the Paris press under censorship",
  register: "Terse, geographic, understating everything; the word 'nibbling' does more work than any adjective",
  defined: true,
};

CAMPAIGNS.gqg.hardMode.forcedEndingId = "gqg_end_relieved";
// Erosion cap set after measurement (measure-erosion.js, montecarlo.js hard): the historical line carries five of the 11 erosion-tagged choices, so at 6 the historical run survives and about one random run in ten is relieved.
CAMPAIGNS.gqg.hardMode.erosionMax = 6;

CAMPAIGNS.gqg.nodes = {

  gqg_1914_17_covering: {
    year: 1914, date: "1914-07-30", city: "Paris",
    title: "Ten Kilometres",
    advisors: ["joffre", "castelnau"],
    situation:
      "Germany has declared a state of imminent danger of war, and the army has been brought up " +
      "to strength along the frontier. The government has done what it can to be seen as the " +
      "party that did not want war: it has ordered the covering troops to fall back ten kilometres " +
      "from the frontier, so that no patrol can start a fight, and so that Britain can see it.\n\n" +
      "The Commander-in-Chief thinks the order is a mistake, since it gives ground that will not " +
      "be easy to take back, and it delays the order to mobilise, which cannot wait.",
    choices: [
      {
        id: "obey",
        label: "Obey, and withdraw the covering troops ten kilometres, while pressing the Cabinet for the order to mobilise",
        historical: true,
        advisor: { name: "Joffre", position:
          "The government is entitled to be obeyed, and Britain's opinion is worth ten kilometres. The cost is a day." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { gqg_covering: "obeyed" },
        next: "gqg_1914_01_frontieres",
        outcome:
          "The covering troops fall back ten kilometres from the frontier on 30 July, and not a shot " +
          "is fired along it. Joffre presses the Cabinet on the 31st to order mobilisation, " +
          "and the order for general mobilisation is given on the afternoon of 1 August. France " +
          "can say that it did not begin the war, and the army starts the war a few kilometres " +
          "farther from its objective than it had planned.",
      },
      {
        id: "stay",
        label: "Leave the covering troops where they are, and do not tell the Cabinet",
        advisor: { name: "Castelnau", position:
          "The ten kilometres are the ground the plan depends on. A covering force that has fallen back cannot cover, and an order that cannot be carried out should not be carried out." },
        gate: (m) => m.will >= -2,
        disabledReason: "The Minister of War has repeated the order, and the President has been told it is being obeyed",
        impact: { manpower: 0, munitions: 0, will: -1 },
        dispute:
          "Whether a few kilometres would have made any difference to the opening of the war is argued. " +
          "The covering troops were not the army, and the frontier battles were fought a good deal farther back.",
        uncertain: [
          { weight: 70, title: "The disobedience goes unremarked",
            impact: { manpower: 0, munitions: 0, will: 0 },
            setFlags: { gqg_covering: "stayed" },
            next: "gqg_1914_01_frontieres",
            outcome:
              "Speculative. The covering troops stay where they are, and the German patrols stay " +
              "on their own side. The Cabinet, which believes that its order has been obeyed, is not " +
              "told, and the army begins the war on the ground that the plan assumed. Joffre has " +
              "kept a few kilometres and has made himself the man who decides which of the " +
              "government's orders are carried out." },
          { weight: 30, title: "A frontier clash is made public",
            impact: { manpower: -1, munitions: 0, will: -2 },
            setFlags: { gqg_covering: "clash" },
            next: "gqg_1914_01_frontieres",
            outcome:
              "Speculative. A German patrol is met on French ground, and the shots are reported " +
              "in Berlin and in London as a French provocation. The Cabinet learns that its order " +
              "was not obeyed from the newspapers, and Britain's ministers, who have been told that " +
              "France has taken care to give no pretext, have to ask whether that is so. Joffre is " +
              "summoned to explain." },
        ],
      },
      {
        id: "ask",
        label: "Ask the Cabinet to mobilise at once and not to wait for Germany",
        advisor: { name: "Joffre", position:
          "Every hour lost now is an hour lost to the concentration. The Germans have not waited, and France cannot afford to be the last to move." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_covering: "asked" },
        next: "gqg_1914_01_frontieres",
        outcome:
          "Speculative. Joffre goes to the ministers and says that every day of delay costs the army " +
          "a day of its concentration. The Cabinet will not move until Germany has, and until " +
          "Britain can be shown that France was the party that waited. The order is given on " +
          "1 August, when it would have been given anyway, and the Commander-in-Chief is known to " +
          "the ministers as a soldier who will say what he thinks of an order he has been given.",
      },
    ],
  },

  gqg_1914_01_frontieres: {
    year: 1914, date: "1914-08-14", city: "Vitry-le-Francois",
    title: "Into Lorraine",
    advisors: ["joffre", "castelnau"],
    situation: (flags) =>
      "The plan is an attack into Lorraine and the Ardennes, into the provinces lost " +
      "in 1871, on the shortest line to the frontier. It is built on the conviction " +
      "that the decisive quality in this war will be the willingness to attack, and it " +
      "assumes the German right will not be strong enough to matter.\n\n" +
      "Reports from Belgium suggest the German right is very much strong enough to " +
      "matter. Acting on those reports means abandoning the attack before it has been " +
      "made and conceding that the army's whole doctrine was wrong on the first page." +
      (flags.gqg_covering === "stayed"
        ? "\n\nThe covering troops never fell back the ten kilometres that the government ordered, and the Cabinet does not know it."
        : flags.gqg_covering === "clash"
        ? "\n\nA frontier clash in the last days of July has been laid at France's door, and the Cabinet is not pleased with the army."
        : ""),
    choices: [
      {
        id: "attack",
        label: "Attack as planned — Lorraine and the Ardennes",
        historical: true,
        advisor: { name: "Joffre", position:
          "The plan is not a suggestion. Armies that hesitate at the frontier do not recover the initiative later." },
        impact: { manpower: -2, munitions: -1, will: 0 },
        setFlags: { gqg_opening: "asplanned" },
        erodes: "costly_offensive",
        next: "gqg_1914_12_retreat",
        outcome:
          "The attacks go in and are stopped in front of positions the doctrine said " +
          "would give way. The Battle of the Frontiers costs the army more men in three " +
          "weeks than anyone in this building has budgeted for a year, and the German " +
          "right comes on through Belgium regardless. The regiments that went forward in red trousers learn what machine guns and heavy howitzers do to a bayonet charge.",
      },
      {
        id: "shift",
        label: "Break off in Lorraine and move weight left to meet the Belgian sweep",
        advisor: { name: "de Castelnau", position:
          "If the reports are right, the war is being decided on our left while we are attacking on our right." },
        gate: (m) => m.will >= 0,
        disabledReason: "The plan cannot be abandoned before it has been tried without losing the army's confidence",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { gqg_opening: "shifted" },
        next: "gqg_1914_12_retreat",
        outcome:
          "Speculative. Formations move left earlier than they historically did. Fewer " +
          "men are spent on the frontier and more are in front of the sweep, at the " +
          "price of an army told on its first day that its doctrine was mistaken. The " +
          "officers who built their careers on the attack have to be persuaded that the " +
          "plan they were taught is the wrong one, and some of them will not be, " +
          "whatever the reports from Belgium say.",
      },
      {
        id: "week",
        label: "Hold the offensive for a week, send the cavalry and the aeroplanes to find the German right, and decide on what they report",
        advisor: { name: "de Castelnau", position:
          "A week is cheap beside a battle fought on the wrong front. The aeroplanes can tell us where the German right is, and we can decide once we know." },
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { gqg_week: "looked" },
        next: "gqg_1914_16_week",
        outcome:
          "Speculative. The orders for Lorraine are held and the aeroplanes go up. Within days " +
          "the reports describe columns of the German right wing on the roads of Belgium, " +
          "west of the Meuse, in greater strength than the plan allowed for. The offensive " +
          "has not been given up, only put off, and the officers who built the plan for the " +
          "frontier battle hear their Commander-in-Chief ask for a week in which nothing " +
          "is attacked.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-08 (a detour: the week of looking)
  gqg_1914_16_week: {
    year: 1914, date: "1914-08-21", city: "Vitry-le-Francois",
    title: "A Week of Looking",
    advisors: ["joffre", "castelnau"],
    situation:
      "The cavalry and the aeroplanes have been over the ground, and what they report is " +
      "not what the plan was built for: strong columns of German infantry, reserve " +
      "formations among them, west of the Meuse and moving south-west. The armies in " +
      "Lorraine are in position and the order to attack has been held.\n\n" +
      "Every day of the delay is a day the German right comes on. What is not known is " +
      "whether it is the main blow or only a flank guard, and nobody who has flown over " +
      "it will say so with certainty.",
    choices: [
      {
        id: "attack",
        label: "Release the attack in Lorraine and the Ardennes now, a week late, with the left reinforced from what the week has freed",
        historical: true,
        advisor: { name: "Joffre", position:
          "The reports are reports. The plan is a plan. An army that has been told to attack and is then told to wait loses more than a week." },
        impact: { manpower: -2, munitions: -1, will: 0 },
        setFlags: { gqg_opening: "asplanned" },
        erodes: "costly_offensive",
        next: "gqg_1914_12_retreat",
        outcome:
          "Speculative. A week late, the armies in Lorraine and the Ardennes attack, and " +
          "are stopped in front of positions the doctrine said would give way. The week " +
          "has told the staff how strong the German right is and has changed nothing " +
          "about what the attacks cost. The left is stronger by the divisions that " +
          "arrived during the week, and the German right is a week further on.",
      },
      {
        id: "move",
        label: "Break off the Lorraine attack and begin moving the weight left at once",
        advisor: { name: "de Castelnau", position:
          "If the reports are right, the war is being decided on our left. Every division that stays in Lorraine is a division that is not there." },
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { gqg_opening: "shifted" },
        next: "gqg_1914_12_retreat",
        outcome:
          "Speculative. The Lorraine attack is cancelled and the railways turn west. Fewer " +
          "men are spent on the frontier and more stand in front of the sweep, at the price " +
          "of an army told that its doctrine was a week from being proved wrong. The " +
          "officers who built their careers on the attack have to be persuaded, and the " +
          "reports from the air, which they distrust, are what they are asked to believe.",
      },
      {
        id: "probe",
        label: "Attack in Lorraine with a smaller force, and use the rest to cover the left",
        advisor: { name: "Joffre", position:
          "A smaller attack keeps the Germans in Lorraine looking over their shoulders. The rest of the army can be where the reports say it is needed." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        dispute:
          "Historians differ on how flexible the French plan was in August 1914. Some " +
          "hold that the staff was bound to the attack by doctrine and could not have " +
          "changed course. Others point out that Joffre did alter the deployment in the " +
          "first weeks, and that what is argued is how early he was willing to. Whether a " +
          "divided effort would have strengthened the left or weakened both wings is " +
          "argued without result.",
        uncertain: [
          { weight: 50, title: "The smaller attack holds the Germans, and the left is covered",
            impact: { manpower: 0, munitions: 0, will: 1 },
            setFlags: { gqg_opening: "shifted" },
            next: "gqg_1914_12_retreat",
            outcome:
              "Speculative. The attack in Lorraine goes in with fewer divisions and takes " +
              "less ground, and it still draws German reserves toward it. The divisions " +
              "that were held back are in front of the sweep when it comes, and the left " +
              "is stronger than the plan would have made it. Neither wing has what it " +
              "wanted. Both have more than they would have had if the whole army had gone " +
              "one way." },
          { weight: 50, title: "Neither force is strong enough for what it was given",
            impact: { manpower: -2, munitions: -1, will: -1 },
            setFlags: { gqg_opening: "asplanned" },
            next: "gqg_1914_12_retreat",
            outcome:
              "Speculative. The smaller attack is stopped in a day, and the divisions on " +
              "the left are too few to hold the Sambre and too many to be lost without " +
              "being missed. The army has been divided between two aims and has not " +
              "achieved either. The officers who wanted the whole weight in Lorraine and " +
              "those who wanted it all on the left each have an account of what went " +
              "wrong, and each is partly right." },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-08
  gqg_1914_12_retreat: {
    year: 1914, date: "1914-08-25", city: "Vitry-le-Francois",
    title: "The Order to Go Back",
    advisors: ["joffre", "castelnau"],
    situation: (flags) =>
      "The attacks in Lorraine and the Ardennes have been stopped. On the left, the " +
      "Fifth Army has been beaten on the Sambre and the British at Mons, and Namur has " +
      "fallen. German columns are coming through Belgium on a front wider than anyone " +
      "here allowed for.\n\n" +
      (flags.gqg_opening === "shifted"
        ? "Formations were moved left before the frontier battles, and the left is " +
          "stronger than it would have been. It is still being outflanked."
        : "The attacks on the frontier took the divisions that the left would have wanted.") +
      "\n\nThe armies cannot be held where they stand, because the line is being turned. " +
      "They can be taken back in order, to a line from which they can fight again, and " +
      "a new army can be made from the divisions that Lorraine no longer needs.",
    choices: [
      {
        id: "withdraw",
        label: "Order the withdrawal of the armies and form a new army on the left",
        historical: true,
        advisor: { name: "Joffre", position:
          "A battle lost with the armies destroyed ends the war. A retreat in order only postpones the battle." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_retreat: "ordered" },
        next: "gqg_1914_13_sack",
        outcome:
          "General Instruction No. 2 goes out on 25 August. The armies are to fall back, " +
          "first to the Somme and later to the Marne, and a new Sixth Army is to be made up " +
          "by rail and assembled near Amiens. The withdrawal is long and hard, but the " +
          "armies come out of it in a shape to fight, and the Germans have to follow them " +
          "a long way from their railheads.",
      },
      {
        id: "stand",
        label: "Make a stand on the Sambre and the Meuse and fight where the armies are",
        gate: (m) => m.manpower >= -1,
        disabledReason: "The armies cannot take another battle on this line",
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { gqg_retreat: "stand" },
        erodes: "costly_offensive",
        next: "gqg_1914_13_sack",
        outcome:
          "Speculative. No withdrawal is ordered, and the armies fight another battle " +
          "where they stand while the German right wing goes round them. If the line " +
          "holds, the army has kept its ground. If it does not, there is nothing behind " +
          "it to fall back on, and the Commander-in-Chief has lost the war's first " +
          "month's armies in a single afternoon, with the capital open behind them and " +
          "the government still in it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-09
  gqg_1914_13_sack: {
    year: 1914, date: "1914-09-03", city: "Bar-sur-Aube",
    title: "The Generals Who Failed",
    advisors: ["joffre", "castelnau"],
    situation: (flags) =>
      "The retreat has gone on for ten days and several of the officers who were given " +
      "armies and corps in August have not been equal to them. The Fifth Army's " +
      "commander has argued with the Commander-in-Chief and with the British and has " +
      "told anyone who would listen that the plan was wrong.\n\n" +
      (flags.gqg_retreat === "stand"
        ? "The armies fought a battle they might have avoided, and the officers who lost it are the ones " +
          "now being asked to fight the next."
        : "The armies have come back in order, and the officers who brought them back are " +
          "among those the Commander-in-Chief is now weighing.") +
      "\n\nThe army was built on the belief that the attack would win the war, and the " +
      "officers promoted by that belief are the ones it failed. Removing them says that " +
      "the doctrine failed too.",
    choices: [
      {
        id: "relieve",
        label: "Relieve the commanders who have failed, by name and at once",
        historical: true,
        advisor: { name: "Joffre", position:
          "An officer who cannot carry out the plan has to be replaced by one who can, and the army needs to see that it is done." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { gqg_sack: "relieved" },
        next: "gqg_1914_02_marne",
        outcome:
          "Lanrezac is relieved of the Fifth Army on 3 September and replaced by Franchet " +
          "d'Espèrey. In the first months of the war three army commanders, ten corps " +
          "commanders and thirty-eight division commanders are removed, and officers such " +
          "as Foch, Pétain and Nivelle rise to fill their places. The army learns that " +
          "failure costs a command, and the officers who remain act as men who know it.",
      },
      {
        id: "keep",
        label: "Keep the commanders in place and send staff officers to correct them",
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { gqg_sack: "kept" },
        next: "gqg_1914_02_marne",
        outcome:
          "Speculative. The commanders stay, with officers from General Headquarters " +
          "beside them to see that the orders are carried out. Nobody is publicly " +
          "blamed, and the army keeps the leaders it has. The orders arrive at the " +
          "armies through two channels, and in the first week of September both are " +
          "needed. The officers who failed in August are still giving orders.",
      },
    ],
  },

  gqg_1914_02_marne: {
    year: 1914, date: "1914-09-05", city: "Paris",
    title: "The Flank in the Open",
    advisors: ["joffre", "gallieni"],
    bulletin: {
      voice: "gqg", date: "1914-09-04", source: "Communique officiel",
      text:
        "Our armies continue their movement in accordance with the intentions of the " +
        "high command. No engagement of importance is reported on the front as a whole.",
    },
    situation: (flags) =>
      "The retreat has been long and orderly and the government has left Paris. The " +
      "German First Army has turned inside the capital rather than around it, and its " +
      "flank is now in the open, in front of a garrison and a field army that have not " +
      "yet been used.\n\n" +
      (flags.gqg_opening === "shifted"
        ? "The formations shifted left in August are in hand and rested. The " +
          "counterattack, if it is made, is made from strength."
        : "The armies have been retreating for two weeks and are being asked to turn " +
          "and attack tomorrow. Whether they can is a question about men, not maps.") +
      (flags.gqg_sack === "relieved"
        ? "\n\nThe commanders who were not equal to August are gone, and the men who " +
          "replaced them were chosen for the moment that has come."
        : flags.gqg_sack === "kept"
          ? "\n\nThe commanders who were not equal to August are still in their commands."
          : ""),
    choices: [
      {
        id: "attack",
        label: "Turn and attack the exposed flank",
        historical: true,
        advisor: { name: "Gallieni", position:
          "The flank is there now. It will not be there next week, and neither will the initiative." },
        impact: { manpower: -1, munitions: -1, will: 3 },
        setFlags: { gqg_marne: "attacked", xc_marne_french: "attacked" },
        keyBattleSubgame: { id: "marneFrench" },
        dispute:
          "Responsibility for the German halt on the Marne is contested from the other " +
          "side of the hill. One tradition holds that German command control had already " +
          "broken down during August and that the withdrawal was self-inflicted; another " +
          "places the immediate cause with the divergence of the German First and Second " +
          "Armies and the gap it opened; a third credits the French counterattack itself. " +
          "How much the outcome was made here and how much at Luxembourg is not settled.",
        uncertain: [
          { weight: 65, title: "The gap opens and the invasion goes back", historicalBranch: true,
            impact: { will: 1 },
            setFlags: { gqg_marneResult: "exploited" },
            next: "gqg_1914_14_race",
            outcome:
              "The armies turn. The gap between the German First and Second Armies opens " +
              "and is exploited, and the invasion stops short of the decision it needed. " +
              "The French army that attacks on the Marne is exhausted, short of shells and not sure of its own success. Joffre's order of the day tells every unit that one which cannot advance must hold its ground and die there rather than fall back." },
          { weight: 35, title: "The counterattack is contained and the line settles further south",
            impact: { manpower: -1, will: -1 },
            setFlags: { gqg_marneResult: "contained" },
            next: "gqg_1914_14_race",
            outcome:
              "Speculative. The turn is made and does not achieve the separation it needed. " +
              "The invasion is stopped, later and further south, and the line that congeals " +
              "runs across more of France than it historically did. The government is back " +
              "in Bordeaux, and Paris is shelled. The army has fought a great battle and kept the capital, and is still giving up villages." },
        ],
      },
      {
        id: "continue",
        label: "Continue the withdrawal and attack when the armies are rested",
        advisor: { name: "Joffre", position:
          "An attack made with troops in this condition can fail once and finish everything." },
        gate: (m) => m.manpower >= -1,
        disabledReason: "There is no line further back that can be held with what is left",
        impact: { manpower: 1, munitions: 0, will: -3 },
        setFlags: { gqg_marne: "delayed", xc_marne_french: "delayed" },
        next: "gqg_1914_14_race",
        outcome:
          "Speculative. The withdrawal continues past the Marne and the flank closes. " +
          "The army is in better condition and the ground behind it is French, and " +
          "there is markedly less of it. The Germans reach the Seine, and the capital " +
          "is invested or abandoned. The Commander-in-Chief has kept his army in being " +
          "and lost the chance the Military Governor of Paris was pressing on him, " +
          "which does not come back.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-09
  gqg_1914_14_race: {
    year: 1914, date: "1914-09-24", city: "Chatillon-sur-Seine",
    title: "To the Sea",
    advisors: ["joffre", "foch"],
    situation: (flags) =>
      "The Germans have been stopped on the Marne and have dug in on the Aisne, and " +
      "the French attacks on the Aisne have not moved them. " +
      (flags.gqg_marneResult === "contained"
        ? "The line stopped further south than it might have, and there is less ground to work with."
        : "The line is where the armies stopped them, and it is open at the north.") +
      "\n\nNeither side has a flank it can turn except in the north, between the Oise and " +
      "the sea. Whoever extends the line first with fresh troops can outflank the other " +
      "on that side, and both headquarters have seen it. The French Second Army, under " +
      "Castelnau, is being brought from Lorraine to do it.",
    choices: [
      {
        id: "extend",
        label: "Bring the Second Army north and keep extending the left toward the sea",
        historical: true,
        advisor: { name: "Joffre", position:
          "The north is open and the Channel ports and the mines lie in it. Whoever gets there first keeps them." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { gqg_race: "extended" },
        next: "gqg_1915_03_grignotage",
        outcome:
          "Castelnau's Second Army forms south of Amiens and begins to advance on 22 " +
          "September, with the Sixth Army alongside from the 23rd. When the Germans arrive " +
          "at Arras, Joffre detaches the northern part of the Second Army as a new Tenth Army " +
          "and puts both under Foch, who from 5 October forbids a retirement from the town. " +
          "Neither side turns the other's flank. By the middle of October the line runs to " +
          "the sea.",
      },
      {
        id: "dig",
        label: "Stop manoeuvring and dig in along the Aisne",
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { gqg_race: "dug" },
        next: "gqg_1915_03_grignotage",
        outcome:
          "Speculative. The Second Army stays in Lorraine and the left wing is not " +
          "extended. The line is shorter, and the north is open to the German army for " +
          "as long as it takes the Allies to close it. The Channel ports and the " +
          "coalfields are within reach of an enemy that has just been stopped, and the " +
          "British, who are moving north themselves, find the ground they meant to hold " +
          "already contested, with no French army beside them to share it.",
      },
      {
        id: "aisne",
        label: "Make one more attack on the Aisne heights with the army already there, before extending the line",
        advisor: { name: "Foch", position:
          "The Germans are tired and thin on the heights. An attack there now costs less than a race to the sea, and it might still decide the matter." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        dispute:
          "Historians differ on whether the Allied attacks on the Aisne in September 1914 " +
          "came near a result or only repeated the cost of the frontier battles. The German " +
          "positions on the heights were strong and their guns could not be found. Whether " +
          "a stronger effort, earlier, would have done more than the actual attacks is " +
          "argued without result.",
        uncertain: [
          { weight: 65, title: "The heights hold, and the north stays open another week",
            impact: { manpower: -2, munitions: -1, will: -1 },
            setFlags: { gqg_race: "aisne" },
            next: "gqg_1915_03_grignotage",
            outcome:
              "Speculative. The attack goes in on the plateau north of the river and is stopped " +
              "by guns the aeroplanes did not find, on the same ground and in the same weather as " +
              "the attacks that failed in the first week. Another week has been spent. The " +
              "Second Army is still moving north, and the Germans who held the Aisne are " +
              "moving north as well." },
          { weight: 35, title: "A foothold is won on the plateau and held",
            impact: { manpower: -1, munitions: -1, will: 1 },
            setFlags: { gqg_race: "aisne" },
            next: "gqg_1915_03_grignotage",
            outcome:
              "Speculative. A foothold is won on the plateau above the river and held against " +
              "the counter-attacks, at a heavy price. It is not a breakthrough. The Germans " +
              "bring reserves to it which the extension of the left toward the sea would not " +
              "have forced them to bring, and the race to the north starts a week later for " +
              "both sides." },
        ],
      },
    ],
  },

  gqg_1915_03_grignotage: {
    year: 1915, date: "1915-09-25", city: "Chantilly",
    title: "Nibbling",
    advisors: ["joffre", "castelnau", "petain"],
    bulletin: {
      voice: "gqg", date: "1915-09-24", source: "Communique officiel",
      text:
        "Artillery preparation continues in Artois and in Champagne. Our positions " +
        "have been improved at several points.",
    },
    situation:
      "The line runs from the sea to Switzerland and cannot be turned, so it has to be " +
      "broken, and breaking it is what the year has been spent attempting. Artois in " +
      "the spring, Champagne in the autumn, and each time the first position is taken " +
      "and the second is not.\n\n" +
      "Ten departments are under occupation. Waiting is a strategy available to a " +
      "country whose territory is not being administered by the enemy, and France is " +
      "not that country. That fact has decided every offensive of this year and will " +
      "be produced again whenever the arithmetic is raised.",
    choices: [
      {
        id: "press",
        label: "Continue the offensives — the occupied departments will not wait",
        historical: true,
        advisor: { name: "Joffre", position:
          "Every month of quiet is a month the enemy fortifies and a month France is administered from Berlin." },
        impact: { manpower: -2, munitions: -2, will: 0 },
        setFlags: { gqg_1915: "offensive" },
        erodes: "costly_offensive",
        next: "gqg_1915_14_salonika",
        outcome:
          "Artois and Champagne are fought and the second position holds both times. " +
          "The line moves by yards. The soldiers who go forward in the autumn go with no illusion left about what the first day will give them. The occupied " +
          "departments are no nearer, and the Commander-in-Chief has no other policy to " +
          "put in place of the one that has not worked.",
      },
      {
        id: "limited",
        label: "Limit operations to what the guns can guarantee and build the artillery park",
        advisor: { name: "Pétain", position:
          "Fire wins ground and men hold it. In that order, or not at all." },
        gate: (m) => m.will >= -1,
        disabledReason: "A year without an attempt to liberate the occupied departments cannot be defended in the Chamber",
        impact: { manpower: 2, munitions: -1, will: -2 },
        setFlags: { gqg_1915: "limited" },
        next: "gqg_1915_14_salonika",
        outcome:
          "Speculative. The offensives are scaled to the artillery available. The army " +
          "enters 1916 stronger and the government enters it having explained for " +
          "twelve months why nothing was attempted. The enemy fortifies the occupied " +
          "departments undisturbed, and the British, who have begun raising their great " +
          "army, are told that the French have decided to wait for them. Whether the " +
          "alliance can bear a French year of waiting is the question.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-10
  gqg_1915_14_salonika: {
    year: 1915, date: "1915-10-05", city: "Chantilly",
    title: "Divisions for the Balkans",
    advisors: ["joffre", "castelnau"],
    situation: (flags) =>
      "Bulgaria has signed with the Central Powers and German, Austro-Hungarian and " +
      "Bulgarian armies are about to attack Serbia. The French government has decided " +
      "to send troops to Salonika to support Serbia.\n\n" +
      "General Joffre regards the expedition as a diversion of divisions from the " +
      "front in France. " +
      (flags.gqg_1915 === "limited"
        ? "The army has been building its artillery rather than attacking, and divisions are available."
        : "The divisions are being used in Champagne, where the autumn offensive is being fought.") +
      "\n\nThe officer proposed to command the force is General Sarrail, whom Joffre " +
      "dismissed from the Third Army in July. Sarrail has friends in the Chamber, and " +
      "the government would rather not quarrel with them.",
    choices: [
      {
        id: "send",
        label: "Carry out the government's decision and detach divisions for Salonika",
        historical: true,
        advisor: { name: "Joffre", position:
          "A division in the Balkans is a division that is not in France. I have said so, and I will do what the government decides." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { gqg_salonika: "sent" },
        next: "gqg_1915_15_chantilly",
        outcome:
          "The first Allied troops land at Salonika on 5 October, and Sarrail arrives on " +
          "the 12th to command them. They are too late and too few to save Serbia, whose " +
          "army and many civilians withdraw through the mountains of Albania in the winter. " +
          "The force stays at Salonika as the Army of the Orient for the rest of the war, " +
          "and for the rest of the war it is argued about.",
      },
      {
        id: "refuse",
        label: "Decline to detach divisions and keep every formation on the western front",
        gate: (m) => m.will >= 0,
        disabledReason: "The command cannot refuse a decision of the government and keep its place",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { gqg_salonika: "refused" },
        next: "gqg_1915_15_chantilly",
        outcome:
          "Speculative. No force is sent, or one too small to matter. The divisions " +
          "stay in France, and the government has been told by its general that he will " +
          "not carry out what it decided. Serbia is left to the armies that invade it. " +
          "The ministry and the Chamber, which have been trying for months to bring the " +
          "Commander-in-Chief under their authority, are given the best reason they " +
          "have yet had for doing it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-12
  gqg_1915_15_chantilly: {
    year: 1915, date: "1915-12-06", city: "Chantilly",
    title: "Everyone Attacks at Once",
    advisors: ["joffre", "castelnau"],
    situation: (flags) =>
      "The Allies attacked separately in 1915, each when it could, and the Germans " +
      "moved their reserves from one front to the other on interior lines and met each " +
      "attack in turn. " +
      (flags.gqg_1915 === "limited"
        ? "The French army spent the year building its guns instead of attacking, so the " +
          "argument is made from a position of less loss."
        : "The French army attacked in Artois and Champagne at heavy cost.") +
      "\n\nThe Commander-in-Chief has called a conference at General Headquarters of the " +
      "military representatives of France, Britain, Russia, Italy and Serbia. His proposal " +
      "is to attack on every front at about the same time in 1916, so that the Germans " +
      "cannot move their reserves from one to the other.",
    choices: [
      {
        id: "combined",
        label: "Propose simultaneous offensives on every front in 1916",
        historical: true,
        advisor: { name: "Joffre", position:
          "Separate attacks lose to interior lines. If every front pushes at once, the Germans cannot answer all of them." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { gqg_chantilly: "combined" },
        next: "gqg_1916_04_verdun",
        outcome:
          "The conference of 6 to 8 December unanimously supports the proposal. The " +
          "French, British, Russian and Italian armies are to attack together in 1916, " +
          "and the Franco-British share is to be on the Somme. It is a plan that depends " +
          "on all four armies being ready in the same summer, and it is made two months " +
          "before the Germans attack at Verdun.",
      },
      {
        id: "free", ally: "the Allied missions",
        label: "Keep French freedom of action and attack when and where the army chooses",
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { gqg_chantilly: "free" },
        next: "gqg_1916_04_verdun",
        outcome:
          "Speculative. The conference ends without a fixed scheme for 1916. Each army " +
          "plans its own campaign, and the French army is free to choose its time and " +
          "place. The Germans keep the advantage of interior lines, and the French keep " +
          "the freedom to refuse a battle that has been fixed in advance. The Russians " +
          "and the Italians, who came to be told when to attack, go home without a " +
          "date, and the British wonder what the French will do alone.",
      },
    ],
  },

  gqg_1916_04_verdun: {
    year: 1916, date: "1916-02-25", city: "Verdun",
    title: "The Fortress Has Already Been Stripped",
    advisors: ["petain", "joffre", "castelnau"],
    bulletin: {
      voice: "gqg", date: "1916-02-24", source: "Communique officiel",
      text:
        "A violent attack has been delivered north of Verdun. Our troops have carried " +
        "out the movements ordered. The struggle continues with the greatest vigour.",
    },
    situation: (flags) =>
      "The guns were taken out of the Verdun forts and sent to the field army, which " +
      "was defensible when the sector was quiet and is now the situation. The Germans " +
      "are attacking into a fortress zone that is a fortress mainly on the map.\n\n" +
      "There is a case for shortening the line, giving up the east bank, and refusing " +
      "the battle on ground of the enemy's choosing. It is militarily coherent. It " +
      "would also mean announcing that Verdun has been abandoned, and no government in " +
      "France survives that announcement." +
      (flags.xc_naroch === "refused" ? "\n\nJoffre has asked the Russians for an offensive and been told that it will come with the others in the summer, not before. Until then the Germans can take what they need from the east." : ""),
    choices: [
      {
        id: "hold",
        label: "Hold both banks and feed the sector through the road",
        historical: true,
        advisor: { name: "Pétain", position:
          "The sector can be held if units are rotated through it rather than left in it. Nothing else about this is negotiable." },
        impact: { manpower: -3, munitions: -2, will: 2 },
        setFlags: { gqg_verdun: "held" },
        next: "gqg_1916_05_somme",
        outcome:
          "Verdun is held, and held by rotation: divisions go in, are used, and come " +
          "out, and most of the French army passes through the sector before the year " +
          "is done. That rotation is why the army survives 1916 and why so much of it " +
          "has personally been to Verdun by 1917. The cost in men is terrible, and " +
          "spread across the army rather than falling on a few divisions, so the army " +
          "that comes out is not the army that went in.",
      },
      {
        id: "shorten",
        label: "Give up the east bank and hold a shorter line further back",
        advisor: { name: "de Castelnau", position:
          "Ground is not the same as position. We are being invited to defend a name." },
        gate: (m) => m.will >= -2,
        disabledReason: "Abandoning Verdun cannot be survived politically from here",
        impact: { manpower: 2, munitions: 1, will: -4 },
        setFlags: { gqg_verdun: "shortened" },
        next: "gqg_1916_05_somme",
        outcome:
          "Speculative. The line is shortened and the battle the enemy wanted is " +
          "declined. The army is materially stronger for it and the government that " +
          "authorised it does not last the spring. The fortress, which stood for the " +
          "whole nation, is given up without the defence it expected, and the country " +
          "learns of it from a communiqué. What the Germans take cheaply they hold, and " +
          "the symbol they were seeking is theirs.",
      },
    ],
  },

  gqg_1916_05_somme: {
    year: 1916, date: "1916-07-01", city: "Chantilly",
    title: "The Offensive We Agreed To",
    advisors: ["joffre", "foch"],
    situation: (flags) =>
      "The combined offensive on the Somme was agreed at Chantilly when the French " +
      "contribution was to be the larger one. " +
      (flags.gqg_verdun === "shortened"
        ? "The line was shortened in February and the divisions exist. The original French share is still possible."
        : "Verdun has consumed the divisions that were to make it. What France can now put into the Somme is a fraction of what was promised.") +
      "\n\nThe British will attack either way. They attack either beside an ally or in place of one." +
      (flags.xc_chantilly === "declined" ? "\n\nThe Russian representative at Chantilly gave no date for an offensive in the east, and the Somme is the only combined blow the Allies are certain to make." : ""),
    choices: [
      {
        id: "commit",
        label: "Commit what can be found and attack alongside the British",
        historical: true,
        advisor: { name: "Foch", position:
          "A coalition that attacks separately is two armies. One that attacks together is an alliance." },
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { gqg_somme: "committed" },
        erodes: "costly_offensive",
        next: "gqg_1916_14_douaumont",
        outcome:
          "The French share of the Somme is smaller than promised and is made. Pressure " +
          "comes off Verdun, where the Germans have to send their reserves north, and " +
          "the alliance holds, with the British learning to attack at the cost of their " +
          "volunteer army. The ledger grows. The French divisions on the Somme take " +
          "ground on the southern flank and are not asked to do the impossible, but " +
          "they are asked to do it a second time within the year.",
      },
      {
        id: "defer", ally: "Haig",
        label: "Defer the French contribution and let the British attack alone",
        advisor: { name: "Joffre", position:
          "We cannot fight two battles of this size in one summer. One of them has to be someone else's." },
        impact: { manpower: 1, munitions: 1, will: -2 },
        setFlags: { gqg_somme: "deferred" },
        next: "gqg_1916_14_douaumont",
        outcome:
          "Speculative. The British attack on the Somme substantially alone. Divisions " +
          "are preserved. What is spent instead is the assumption, on the other side of " +
          "the Channel, that France will be there when the plan says so. The British " +
          "army, which has raised its great force for this battle, takes the first " +
          "day's losses without a French attack beside it, and the alliance is asked " +
          "how the plan agreed at Chantilly came to be kept by one partner only.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-10
  gqg_1916_14_douaumont: {
    year: 1916, date: "1916-10-21", city: "Verdun",
    title: "Taking Back the Fort",
    advisors: ["petain", "mangin", "joffre"],
    bulletin: {
      voice: "gqg", date: "1916-10-20", source: "Communique officiel",
      text:
        "Artillery activity on the right bank of the Meuse is reported at the normal " +
        "level for the season. The situation is unchanged.",
    },
    situation: (flags) =>
      "Fort Douaumont has been in German hands since 25 February, and Fort Vaux since " +
      "June. The German army has not been able to go on at Verdun since the summer, and " +
      "the French army holds the line in front of both forts.\n\n" +
      (flags.gqg_verdun === "shortened"
        ? "The east bank was given up in February, and the forts lie in ground the army " +
          "would have to retake before it could think of taking them."
        : "Both banks were held, by rotation, and most of the army has been through the " +
          "sector.") +
      "\n\nGeneral Mangin, who commands the part of the line from Fleury to the Meuse, " +
      "proposes to retake Douaumont with three divisions behind a creeping barrage after " +
      "a bombardment of several days. It would be the first French attack at Verdun that " +
      "was meant to win ground rather than to hold it.",
    choices: [
      {
  id: "retake",
  label: "Authorise Mangin's attack to retake Douaumont",
  historical: true,
  advisor: { name: "Mangin", position:
    "The fort can be taken back if the guns do their work first and the infantry stays close behind the barrage." },
  impact: { manpower: 0, munitions: 0, will: 2 },
  setFlags: { gqg_douaumont: "retaken" },
  dispute:
    "The success of 24 October is usually credited to Mangin's creeping barrage, to " +
    "the fog, and to the weakness of the German garrison, since German divisions had " +
    "been taken from Verdun for the Somme and for Romania. How much each mattered is " +
    "disputed, and so is how near the attack came to failing.",
  uncertain: [
    { weight: 75, title: "Douaumont is French again", historicalBranch: true,
      impact: { manpower: 0, munitions: 0, will: 2 },
      next: "gqg_1916_06_nivelle",
      outcome:
        "The bombardment begins on 21 October and the infantry goes forward on the 24th. " +
        "By the evening Douaumont is French again and some six thousand prisoners have " +
        "been taken, and Vaux follows by 2 November. A second blow on 15 December pushes " +
        "the line back almost to where it stood in February, with more than eleven " +
        "thousand prisoners. The army that had been told to hold at Verdun now knows it can also " +
        "take ground there." },
    { weight: 25, title: "The attack is held on the slope below the fort",
      impact: { manpower: -2, munitions: -1, will: -1 },
      setFlags: { gqg_douaumont: "failed" },
      next: "gqg_1916_06_nivelle",
      outcome:
        "Speculative. The bombardment misses the casemates where the garrison shelters, " +
        "and the infantry goes forward behind a barrage that has already moved on. The " +
        "attack is held on the slope below the fort with the loss of most of its " +
        "officers. Verdun goes into the winter with Douaumont still German, and a " +
        "Commander-in-Chief whose critics now have a failed autumn to put beside a " +
        "failed summer." },
  ],
},
      {
        id: "wait",
        label: "Stay on the defensive at Verdun and keep the divisions for the spring",
        gate: (m) => m.will >= 0,
        disabledReason: "Another winter with the forts in German hands cannot be explained to the country",
        impact: { manpower: 1, munitions: 1, will: -2 },
        setFlags: { gqg_douaumont: "waited" },
        next: "gqg_1916_06_nivelle",
        outcome:
          "Speculative. No attack is made. The divisions are rested and the shells are " +
          "kept for the spring, and the forts stay where they are through the winter. " +
          "The Commander-in-Chief goes into December without the success that would " +
          "have helped him to keep his command, and the ministers who are looking for a " +
          "reason to replace him are given an empty autumn to put in front of the " +
          "Chamber. The soldiers at Verdun spend another winter looking at Douaumont.",
      },
    ],
  },

  gqg_1916_06_nivelle: {
    year: 1916, date: "1916-12-12", city: "Paris",
    title: "Somebody Who Says It Can Be Quick",
    advisors: ["nivelle", "lyautey", "petain"],
    bulletin: {
      voice: "gqg", date: "1916-12-11", source: "Communique officiel",
      text:
        "The Government has under consideration the organisation of the high command. " +
        "The armies of the north and north-east continue to hold their positions.",
    },
    situation:
      "Two million French casualties in twenty-eight months have exhausted the " +
      "government's tolerance for being told that the war will be long. Joffre goes, " +
      "with a Marshal's baton to make the going look like something else.\n\n" +
      "Nivelle came out of Verdun with a reputation and a method, and he is offering " +
      "what nobody else will offer: rupture of the German line in forty-eight hours, " +
      "at a cost he puts around ten thousand. The alternative on the table is Pétain's, " +
      "which is that the war cannot be won quickly and should be fought accordingly.",
    choices: [
      {
        id: "nivelle",
        label: "Back Nivelle and the forty-eight hour plan",
        historical: true,
        advisor: { name: "Nivelle", position:
          "The formula worked at Verdun on a small front. There is no reason of principle it cannot work on a large one." },
        impact: { manpower: 0, munitions: 0, will: 2 },
        setFlags: { gqg_command: "nivelle" },
        next: "gqg_1917_12_calais",
        outcome:
          "Nivelle takes the command in December. Lyautey leaves the war ministry after a quarrel in the Chamber " +
          "in March and is replaced by Painlevé, who is no " +
          "more convinced but stays to argue. The army is told that the rupture will " +
          "take forty-eight hours, and it believes what it is told, because it has been " +
          "waiting two and a half years to be told it. The promise that is made is the " +
          "one that will be broken, in front of the soldiers.",
      },
      {
        id: "petain",
        label: "Give the command to Pétain and the doctrine of limited objectives",
        advisor: { name: "Pétain", position:
          "I can promise the government ground taken at a price it can afford. I cannot promise it the war in two days." },
        gate: (m) => m.will >= -1,
        disabledReason: "A commander offering only a long war cannot be sold to this Chamber",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { gqg_command: "petain" },
        next: "gqg_1917_12_calais",
        outcome:
          "Speculative. The limited-objective doctrine takes the top command a year " +
          "early. There is no forty-eight hour promise to fail, and no government " +
          "receives the victory it was told to expect. The politicians who wanted a " +
          "decisive result get a patient general, and a patient general is the one the " +
          "Chamber has not been asking for. The army avoids the Aisne, and has to find " +
          "out whether the waiting is bearable without a miracle in prospect.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-02
  gqg_1917_12_calais: {
    year: 1917, date: "1917-02-26", city: "Calais",
    title: "The British Under a French General",
    advisors: ["nivelle", "lyautey"],
    situation: (flags) =>
      "The conference at Calais is ostensibly about the railways that will carry the " +
      "spring offensive. In practice it is about command. Lloyd George, with the " +
      "approval of the British war cabinet, proposes that for the duration of the " +
      "offensive the British army should be placed under Nivelle's direction. He has " +
      "not told Haig or Robertson.\n\n" +
      "Nivelle's plan depends on the British attack at Arras and on a single will " +
      "directing both armies. He has argued for it since taking the command, and the " +
      "British prime minister is offering it to him." +
      (flags.xc_calais === "refused" ? "\n\nThe British Commander-in-Chief and the Chief of the Imperial General Staff have already told London that they will not serve under a French general, and Nivelle has to settle how far he can go without them." : ""),
    choices: [
      {
        id: "accept",
        label: "Accept the British army under Nivelle's direction for the offensive",
        historical: true,
        advisor: { name: "Nivelle", position:
          "Two armies attacking the same line must be one instrument for as long as the attack lasts." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { gqg_calais: "subordinated" },
        next: "gqg_1917_07_chemin",
        outcome:
          "By the Calais agreement of 27 February Haig is formally subordinated to Nivelle for " +
          "the duration of the offensive. The next day Haig and Robertson tell Lloyd George " +
          "they will resign rather than carry it out, and the arrangement is watered down " +
          "with more freedom for the British commander. The conference leaves mistrust between the British government and its generals.",
      },
      {
        id: "agreement", ally: "the British government",
        label: "Decline the subordination and coordinate with Haig by agreement",
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_calais: "agreement" },
        next: "gqg_1917_07_chemin",
        outcome:
          "Speculative. No arrangement is made over the British commander's head. The " +
          "two armies coordinate by agreement between headquarters, as they have since " +
          "1914, and the offensive is fitted to what Haig will agree to. Nivelle goes " +
          "into the spring with the plan he proposed and less control over the part " +
          "that was to be British. The generals keep their authority over their own " +
          "armies, and the politicians who wanted to supervise them are left with " +
          "nothing to supervise.",
      },
    ],
  },

  gqg_1917_07_chemin: {
    year: 1917, date: "1917-04-18", city: "Chemin des Dames",
    title: "Forty-Eight Hours, and the Third Day",
    advisors: ["nivelle", "painleve", "mangin"],
    bulletin: {
      voice: "gqg", date: "1917-04-17", source: "Communique officiel",
      text:
        "Our troops attacked this morning between Soissons and Reims. The first German " +
        "positions have been carried at several points. Operations continue.",
    },
    situation: (flags) =>
      (flags.gqg_command === "petain"
        ? "There is no forty-eight hour promise. There is a limited-objective attack on " +
          "the Aisne, planned to take the first position and stop.\n\n"
        : "The promise was forty-eight hours and around ten thousand casualties. The " +
          "first day cost something near forty thousand.\n\n") +
      "The German second position is intact on the ridge, the defenders are in " +
      "quarries that the barrage did not reach, and the machine guns are sited to " +
      "cover every approach. The undertaking given to the Minister of War was that " +
      "this attack would stop if it had not broken through.\n\n" +
      "Stopping means admitting the promise was worthless. Continuing means the men on " +
      "the ridge pay for the promise." +
      (flags.xc_petrograd === "promised" ? "\n\nThe Allied missions at Petrograd were given a date for a Russian offensive in the spring, and the staff in Paris expects it in the east in these same weeks. An attack stopped here is stopped while the Allies have been told to expect two." : ""),
    choices: [
      {
        id: "continue",
        label: "Continue the offensive",
        historical: true,
        advisor: { name: "Nivelle", position:
          "The rupture is one more effort away. Stopping now converts a delay into a defeat." },
        keyBattleSubgame: { id: "cheminFrench" },
        impact: { manpower: -3, munitions: -2, will: -3 },
        setFlags: { gqg_chemin: "continued" },
        erodes: "costly_offensive",
        dispute:
          "How much of the 1917 crisis belongs to the offensive itself and how much to " +
          "the promise attached to it remains open. Leonard Smith's reading treats " +
          "the mutinies as closer to industrial action than to military collapse — " +
          "bargaining over leave, food, rest and the treatment of families, by men who " +
          "went on holding the line against attack. On that reading the trigger was the " +
          "breach of an explicit undertaking rather than casualties as such, which were " +
          "not without precedent in this army. Others weight the raw loss more heavily. " +
          "The offensive was not halted at forty-eight hours as promised, and the two " +
          "explanations are not fully separable.",
        uncertain: [
          { weight: 60, title: "The army stops obeying orders to attack", historicalBranch: true,
            impact: { will: -3 },
            setFlags: { gqg_mutinyScale: "widespread" },
            next: "gqg_1917_13_directive",
            outcome:
              "The offensive is halted on 9 May having taken ground and not the ridge, at a " +
              "cost around a hundred and eighty-seven thousand French casualties. What " +
              "follows is not a collapse of the front. Units refuse to move up to attack " +
              "while continuing to hold the line they are in, and it spreads. The men are bargaining rather than deserting: their demands are leave, food and the promise that no one will be sent forward like that again." },
          { weight: 40, title: "Indiscipline stays local and is contained",
            impact: { will: -1 },
            setFlags: { gqg_mutinyScale: "contained" },
            next: "gqg_1917_13_directive",
            outcome:
              "Speculative. Refusals appear in the divisions worst used and do not " +
              "propagate beyond them. The crisis is real, smaller, and survivable without a " +
              "change of doctrine. The command punishes a few units and moves on, and the " +
              "lesson that the army cannot be asked for another rupture is learned in a few " +
              "places rather than across the whole front. The Commander-in-Chief who made " +
              "the promise is blamed for the failure and not for the army's condition." },
        ],
      },
      {
        id: "halt",
        label: "Halt at the undertaking given — stop the offensive",
        advisor: { name: "Painlevé", position:
          "The promise was forty-eight hours. It is the third day. There is nothing further to discuss." },
        impact: { manpower: -1, munitions: -1, will: -1 },
        setFlags: { gqg_chemin: "halted", gqg_mutinyScale: "contained" },
        next: "gqg_1917_13_directive",
        outcome:
          "Speculative. The attack is broken off on the undertaking that was given. The " +
          "army is told the truth on the third day rather than the twenty-third, and " +
          "the commander who made the promise has to survive having kept it. The " +
          "casualties are fewer, and the army that comes out of April is angry with its " +
          "general and not yet with its government.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-05
  gqg_1917_13_directive: {
    year: 1917, date: "1917-05-19", city: "Compiègne",
    title: "Battles That Can Be Won",
    advisors: ["petain", "painleve"],
    situation: (flags) =>
      "Pétain has been Commander-in-Chief for four days. Nivelle has gone, and Foch is " +
      "Chief of the General Staff. " +
      (flags.gqg_chemin === "halted"
        ? "The offensive was stopped at the undertaking the government had been given."
        : "The offensive went on past the forty-eight hours it was supposed to run.") +
      " Units have begun to refuse orders to go back to the line.\n\n" +
      "What the army is to be asked to do this summer has to be decided before anything " +
      "else, because every plan depends on it. One school wants a great offensive kept " +
      "in view, so that the army and the Allies see that France still intends to attack. " +
      "The other holds that the army can do no more than attacks with limited " +
      "objectives, where the guns do the work and the infantry stops at what it has " +
      "taken." +
      (flags.xc_usw === "restricted" ? "\n\nThe Americans are not in the war and will not be, which leaves the recovery of the army to France's own resources alone." : ""),
    choices: [
      {
        id: "limited",
        label: "Issue the directive: limited objectives only, until the army has recovered",
        historical: true,
        advisor: { name: "Pétain", position:
          "The army must be given battles it can win, with the guns doing most of the work. It cannot be given another rupture to attempt." },
        impact: { manpower: 1, munitions: 0, will: 1 },
        setFlags: { gqg_directive: "limited" },
        next: "gqg_1917_08_mutinies",
        outcome:
          "Directive No. 1 is dated 19 May. It sets out the method of limited-objective " +
          "attacks, on narrow fronts and with the guns doing most of the work, and it " +
          "ends the plan for a breakthrough. Other directives follow on the use of the " +
          "tanks and aircraft that are reaching the front. It is the part of the remedy " +
          "that the staff will read, and the army will judge it by whether the " +
          "attacks it describes are made as described.",
      },
      {
        id: "offensive",
        label: "Keep a great offensive in preparation for the summer",
        gate: (m) => m.will >= -2,
        disabledReason: "An army in this condition cannot be ordered to prepare another great offensive",
        impact: { manpower: -2, munitions: -1, will: -1 },
        setFlags: { gqg_directive: "offensive" },
        erodes: "costly_offensive",
        next: "gqg_1917_08_mutinies",
        outcome:
          "Speculative. The army is told to prepare for another attempt in the summer. " +
          "Units that have refused to return to the line are asked to prepare to " +
          "attack, and the grievances that sent them there are still there when the " +
          "order arrives. The new Commander-in-Chief has promised the soldiers that " +
          "they will not be used as they were in April, and breaks the promise within a " +
          "month. The army, which has been counting on him, decides what to make of it.",
      },
    ],
  },

  gqg_1917_08_mutinies: {
    year: 1917, date: "1917-05-29", city: "Compiègne",
    title: "The Army Is Bargaining",
    advisors: ["petain", "painleve", "mangin"],
    bulletin: {
      voice: "gqg", date: "1917-05-28", source: "Communique officiel",
      text:
        "The front is calm. Local artillery activity is reported in the sector of the " +
        "Aisne. There is nothing further to signal.",
    },
    situation: (flags) =>
      (flags.gqg_mutinyScale === "widespread"
        ? "By the end of May the refusals have reached something close to half the " +
          "infantry divisions on the Western Front. Pedroncini's archival count is " +
          "forty-nine divisions destabilised — nine gravely, fifteen seriously, " +
          "twenty-five with isolated but repeated incidents — out of a hundred and " +
          "thirteen. Between thirty and forty thousand men are involved by most counts.\n\n"
        : "The refusals are confined to the divisions worst used on the Aisne. They are " +
          "real, they are repeated, and they have not spread.\n\n") +
      "What they are is the difficulty. These men hold the line against attack and refuse orders to go forward, and their demands are leave, food, rest, and what happens to their " +
      "families. It resembles a strike more than it resembles a collapse.\n\n" +
      "An army that will defend but will not attack is still an army. It is not an " +
      "army that can be ordered to do anything.",
    choices: [
      {
        id: "both",
        label: "Concede the grievances and try the ringleaders",
        historical: true,
        advisor: { name: "Pétain", position:
          "Repression applied without remedy produces a second mutiny. Remedy without repression produces no army at all. It has to be both, and the remedy has to be visible first." },
        impact: { manpower: 1, munitions: 0, will: 3 },
        setFlags: { gqg_mutinyResponse: "both" },
        next: "gqg_1917_09_malmaison",
        outcome:
          "Regular home leave is organised, rest is made real, the food improves, and " +
          "the promise is given that there will be no more offensives of the April " +
          "kind. Alongside it there are around three thousand four hundred courts " +
          "martial and five hundred and fifty-four death sentences, the great majority " +
          "commuted. How many were carried out is disputed in the literature — " +
          "Pedroncini documents forty-three, Rolland puts it near thirty, other counts " +
          "run lower or higher, and the files were closed for a century. The army comes " +
          "back. It comes back to a commander who has promised it something.",
      },
      {
        id: "discipline",
        label: "Restore discipline first and address the grievances afterwards",
        advisor: { name: "Mangin", position:
          "An army that negotiates once will negotiate again. Order first, and the rest when there is order." },
        gate: (m) => m.will >= -4,
        disabledReason: "There is not enough authority left to attempt repression without remedy",
        impact: { manpower: -2, munitions: 0, will: -4 },
        setFlags: { gqg_mutinyResponse: "discipline" },
        erodes: "costly_offensive",
        nextIf: (m) => (m.will <= -7 ? "gqg_end_armybreaks" : null),
        next: "gqg_1917_09_malmaison",
        outcome:
          "Speculative. Discipline is applied without the leave rotation and the " +
          "promise. The historical evidence runs the other way on whether this works: " +
          "the restraint of the repression, and its pairing with real concession, is " +
          "what most accounts credit with ending the crisis in six weeks. A command " +
          "that offers nothing and punishes everything has asked an army that is " +
          "bargaining to choose between bargaining and breaking, and the army has not " +
          "yet chosen.",
      },
      {
        id: "report",
        label: "Report to the government that the army cannot be relied on to attack",
        advisor: { name: "Painlevé", position:
          "If that is the true state of the army, the Ministry must be told." },
        gate: (m) => m.will <= -2,
        disabledReason: "The army's condition does not yet warrant telling the government the offensive instrument is gone",
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { gqg_mutinyResponse: "reported" },
        next: "gqg_end_negotiated",
        outcome:
          "Speculative. The condition of the army is put in writing to the Ministry " +
          "rather than managed inside the command. What a government does with that " +
          "information is no longer a military question. The ministers who read it have " +
          "to decide whether to tell the Chamber, the Allies or the enemy, and each " +
          "choice is a political risk. The Commander-in-Chief has declared that he " +
          "cannot do what he was appointed to do, and has handed the decision to " +
          "someone else.",
      },
    ],
  },

  gqg_1917_09_malmaison: {
    year: 1917, date: "1917-10-23", city: "La Malmaison",
    title: "A Small Attack That Works",
    advisors: ["petain", "mangin"],
    bulletin: {
      voice: "gqg", date: "1917-10-22", source: "Communique officiel",
      text:
        "Artillery preparation continues on the western portion of the Chemin des " +
        "Dames. Our batteries have registered on the objectives designated.",
    },
    situation: (flags) =>
      (flags.gqg_mutinyResponse === "discipline"
        ? "The army obeys. What it has stopped doing is anything more than obeying.\n\n"
        : "The army has been rested, fed, given leave and promised that it will not be " +
          "asked to do April again. The promise now has to be honoured in a way the men " +
          "can see.\n\n") +
      "The Chemin des Dames is still German. Taking the west end of it with an " +
      "operation limited to what the artillery can guarantee is the doctrine's test " +
      "case: an attack with an announced objective, which stops when it reaches it.\n\n" +
      "It is also, quietly, the only kind of offensive this army will currently accept.",
    choices: [
      {
        id: "limited",
        label: "Attack with a limited objective and stop at it",
        historical: true,
        advisor: { name: "Pétain", position:
          "The men will be told exactly where the attack stops, and then it will stop there." },
        impact: { manpower: -1, munitions: -2, will: 3 },
        setFlags: { gqg_malmaison: "limited" },
        next: "gqg_1918_12_link",
        outcome:
          "The fort and village are taken and the operation stops on its objective. The " +
          "Germans give up the remainder of the ridge and go back across the Ailette. " +
          "The cost is a fraction of April's and the ground is greater. The army notices. The soldiers who were promised battles " +
          "they could win are given one, and a French attack does what the staff said " +
          "it would.",
      },
      {
        id: "exploit",
        label: "Take the objective and exploit beyond it while the line is broken",
        advisor: { name: "Mangin", position:
          "A broken line is an opportunity. Announcing in advance that we will not use it is a strange way to fight." },
        gate: (m) => m.munitions >= -5,
        disabledReason: "The artillery cannot support an advance beyond the announced objective",
        impact: { manpower: -2, munitions: -1, will: -3 },
        setFlags: { gqg_malmaison: "exploited" },
        erodes: "costly_offensive",
        next: "gqg_1918_12_link",
        outcome:
          "Speculative. The attack goes past the line it announced. Whatever ground " +
          "that gains, it costs the one thing the summer was spent rebuilding: the " +
          "army's belief that when this command names a limit, the limit is real. The " +
          "divisions that were told they would stop on the objective find themselves " +
          "ordered to go on, and the officers who gave them the promise have to decide " +
          "whether to carry out the order or to tell them the truth.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-03
  gqg_1918_12_link: {
    year: 1918, date: "1918-03-24", city: "Dury",
    title: "Which Way to Fall Back",
    advisors: ["petain", "clemenceau"],
    situation:
      "The German offensive opened on the British Fifth and Third Armies on 21 March, " +
      "and the British are being driven back. Haig asked Pétain on the first evening for " +
      "three divisions, and the French Fifth Corps was sent. On the 22nd he asked for " +
      "three more and Pétain ordered the Third Army forward. Haig now asks for twenty " +
      "divisions at Amiens.\n\n" +
      "Pétain is afraid that the attack on the British is a diversion and that the " +
      "main blow will fall on the French in Champagne. By Haig's account, the " +
      "government has told him to cover Paris. If the British keep falling back, the French will have to choose " +
      "between staying in contact with them and covering the capital, and the two lie " +
      "in different directions.",
    choices: [
      {
        id: "reserve",
        label: "Put two armies in reserve in the Somme valley and refuse the twenty divisions",
        historical: true,
        advisor: { name: "Pétain", position:
          "I can give what I can spare. I cannot strip Champagne and the road to Paris on the strength of one attack." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_link: "reserve" },
        dispute:
          "The account of the meeting at Dury on the evening of 24 March comes mainly " +
          "from Haig's diary and reports, in which Pétain, back from a Cabinet meeting " +
          "at which he had been told to cover Paris, says he may have to break contact with " +
          "the British. French accounts and later historians differ about whether he " +
          "threatened it or only explained the limits that the government's order and " +
          "the risk in Champagne put on him. What is not disputed is that he placed two " +
          "armies under Fayolle in reserve in the Somme valley and that he refused the " +
          "twenty divisions.",
        next: "gqg_1918_10_doullens",
        outcome:
          "Two French armies under Fayolle are placed in reserve in the Somme valley, and " +
          "Pétain presses the British Fifth Army to keep in touch with the French Fifth " +
          "Corps on its right. The twenty divisions are not sent. Haig comes away believing " +
          "that the French may let the link go to cover Paris. The question of a single " +
          "commander for both armies is put at Doullens two days later.",
      },
      {
        id: "allin",
        label: "Send the whole reserve north to keep contact with the British at once",
        gate: (m) => m.manpower >= -3,
        disabledReason: "There is not the reserve to cover both the link and Paris",
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { gqg_link: "allin" },
        erodes: "costly_offensive",
        next: "gqg_1918_10_doullens",
        outcome:
          "Speculative. Every division that can be moved goes north, and the junction " +
          "with the British holds. Champagne and the road to Paris are left to what " +
          "remains. If the main blow falls there, the French army has nothing to meet it with. The two armies stay in touch, and Amiens is not lost. If the blow does not fall there, the Commander-in-Chief has won.",
      },
      {
        id: "paris",
        label: "Cover Paris first: tell Haig in writing that the French reserve will fall back on the capital if the retreat goes on",
        advisor: { name: "Pétain", position:
          "The government's order is to cover Paris. If it comes to a choice, I shall have to obey it, and Haig must be told so." },
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { gqg_link: "paris" },
        next: "gqg_1918_10_doullens",
        outcome:
          "Speculative. The warning goes to Haig in writing and not in conversation. He reads " +
          "it as an intention and sends it to London that night. The British Cabinet, which " +
          "has been looking for a way to put a French general over both armies, finds one in " +
          "the French army's own statement that it may step aside. Foch is sent for to " +
          "Doullens, and Pétain's letter will be quoted against him there for as long as the " +
          "argument over the command goes on.",
      },
    ],
  },

  gqg_1918_10_doullens: {
    year: 1918, date: "1918-03-26", city: "Doullens",
    title: "Somebody Has to Be in Charge of Both",
    advisors: ["foch", "petain", "clemenceau"],
    bulletin: {
      voice: "gqg", date: "1918-03-25", source: "Communique officiel",
      text:
        "The battle continues on the whole front between the Somme and the Oise. Our " +
        "troops, in liaison with the British forces, are carrying out the movements " +
        "required by the situation.",
    },
    situation: (flags) =>
      "The German offensive has opened a gap on the British front and the two armies " +
      "are being pushed apart. Each has a line of retreat, and the two lines diverge: " +
      "the British toward the Channel ports, the French toward Paris. Followed " +
      "separately, they lose the war between them without either being beaten.\n\n" +
      "Holding them together requires one authority over both, which means a French " +
      "commander accepting that his armies can be committed by someone other than " +
      "himself, or a British one accepting the same. Nobody has been willing to concede " +
      "this in three and a half years." +
      (flags.gqg_link === "reserve"
        ? "\n\nTwo French armies are in reserve in the Somme valley, and Haig has been told " +
          "that the French may not be able to keep the link."
        : flags.gqg_link === "allin"
          ? "\n\nThe French reserve has gone north to keep the link, and Champagne is open."
          : flags.gqg_link === "paris"
            ? "\n\nHaig has been told in writing that the French reserve may fall back on Paris, " +
              "and the warning is already in London."
            : ""),
    choices: [
      {
        id: "unified",
        label: "Accept unified command — Foch coordinates both armies",
        historical: true,
        advisor: { name: "Foch", position:
          "The two armies must be one instrument or they will be two retreats. I do not need to command them. Somebody does." },
        attested: { by: "Foch", text: "I would fight in front of Amiens. I would fight in Amiens.",
          source: "At Doullens, 26 March 1918, as recorded" },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_command1918: "unified", xc_command1918: "unified" },
        next: "gqg_1918_13_aisne",
        outcome:
          "Coordinating authority over the Allied armies goes to Foch, and grows into " +
          "general command. The two retreats become one defence. What has been given up " +
          "is the independence of the French command, and it is not given back. Pétain " +
          "goes on commanding the French armies, and Foch decides where they and the " +
          "British will fight. Haig accepts the arrangement, because he is losing, and " +
          "the arrangement lasts because it works.",
      },
      {
        id: "national",
        label: "Keep national command and coordinate by agreement",
        advisor: { name: "Pétain", position:
          "I will not have French divisions committed to cover a British withdrawal by a man who does not answer to France." },
        gate: (m) => m.will >= -2,
        disabledReason: "The crisis is past the point where coordination by agreement can be defended",
        attested: { by: "Clemenceau", text: "Je fais la guerre.",
          source: "Speech to the Chamber, 8 March 1918" },
        impact: { manpower: -2, munitions: 0, will: 1 },
        setFlags: { gqg_command1918: "national", xc_command1918: "national" },
        erodes: "costly_offensive",
        nextIf: (m) => (m.manpower <= -6 ? "gqg_end_coalitionfails" : null),
        next: "gqg_1918_13_aisne",
        outcome:
          "Speculative. Command stays national and coordination stays a matter of " +
          "agreement between headquarters that disagree. The gap between the two armies " +
          "is now a matter of goodwill under artillery fire. Each commander commits his " +
          "reserves according to his own judgment of his own danger, and each is right " +
          "to do so. The two retreats go on diverging, and the Germans, who have been " +
          "looking for exactly that, are given the time to find it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-05
  gqg_1918_13_aisne: {
    year: 1918, date: "1918-05-26", city: "Provins",
    title: "The Front Line Is Full",
    advisors: ["petain", "foch"],
    situation: (flags) =>
      "A German attack is expected between Reims and Soissons, and the Chemin des Dames, " +
      "where the offensive of 1917 was fought, is a sector likely to take it. " +
      (flags.gqg_command1918 === "unified"
        ? "There is a single Allied command now, and Foch is directing reserves from one end of the front to the other."
        : "The two commands are coordinating, and the reserves are where each put them.") +
      "\n\nPetain's order is defence in depth: a lightly held front line, and the battle " +
      "fought behind it, out of reach of the guns. The commander of the Sixth Army, " +
      "General Duchêne, does not accept it. He has packed his divisions into the front " +
      "line, because he is not willing to give up an inch of French ground without a " +
      "fight.",
    choices: [
      {
        id: "leave",
        label: "Leave the Sixth Army's dispositions as its commander has made them",
        historical: true,
        advisor: { name: "Pétain", position:
          "The order is clear, and I have given it. Whether it is being carried out is for the army commander to answer for." },
        impact: { manpower: -1, munitions: 0, will: -1 },
        setFlags: { gqg_aisne: "forward" },
        next: "gqg_1918_11_counteroffensive",
        outcome:
          "The bombardment on 27 May falls on a front line packed with men. The line " +
          "breaks, and the Germans cross the Aisne and take nineteen kilometres in " +
          "three days, with Paris within their reach. Duchêne is relieved of his " +
          "command by Clemenceau on 9 June. The order that would have prevented it had " +
          "been given, and not obeyed. The army learns again what a bombardment does to " +
          "a trench that is full, and the lesson costs it a great many men.",
      },
      {
        id: "depth",
        label: "Enforce defence in depth and have the front line thinned before the attack",
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_aisne: "depth" },
        next: "gqg_1918_11_counteroffensive",
        outcome:
          "Speculative. The front line is cleared of all but a screen, and the " +
          "divisions are moved back behind the ridge. The bombardment falls on little " +
          "and the attack still comes and still gains ground, but it comes on into " +
          "depth, and the army is not broken on the first morning. Duchêne is told to " +
          "carry out an order he has publicly despised, and may do so unwillingly.",
      },
      {
        id: "relieve",
        label: "Relieve the Sixth Army's commander tonight and put in a man who will carry out the order",
        advisor: { name: "Foch", position:
          "A commander who will not obey on the eve of the battle cannot be left in command of it. His successor will not know the ground, but he will know the order." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_duchene: "relieved" },
        dispute:
          "Whether defence in depth could have been enforced at the last moment is disputed. " +
          "Those around Pétain say the order was clear and that only disobedience lost the " +
          "Aisne. Others say that the French army had little practice in an elastic defence, " +
          "and that a hurried change of command would have done no more good than the order " +
          "did.",
        uncertain: [
          { weight: 55, title: "The front line is thinned in time",
            impact: { manpower: 0, munitions: 0, will: 0 },
            setFlags: { gqg_aisne: "depth" },
            next: "gqg_1918_11_counteroffensive",
            outcome:
              "Speculative. The new commander reaches Sixth Army headquarters at midnight and " +
              "orders the front line cleared of all but a screen. By the morning of the 27th " +
              "most of the divisions are behind the ridge. The bombardment falls on little, " +
              "and the attack still comes and still gains ground, but it comes on into depth " +
              "and the army is not broken on the first morning." },
          { weight: 45, title: "The change of command is itself the confusion",
            impact: { manpower: -1, munitions: 0, will: -1 },
            setFlags: { gqg_aisne: "forward" },
            next: "gqg_1918_11_counteroffensive",
            outcome:
              "Speculative. The new commander has a day and a night, and the corps under him " +
              "do not know whom to obey. The front line is half cleared when the bombardment " +
              "begins, and the divisions caught between the two dispositions suffer the " +
              "worst of both. The line breaks as it would have done, and the army has the " +
              "added bitterness of having changed its commander on the eve of the battle." },
        ],
      },
    ],
  },

  gqg_1918_11_counteroffensive: {
    year: 1918, date: "1918-07-18", city: "Villers-Cotterets",
    title: "The Turn",
    advisors: ["foch", "mangin", "petain"],
    bulletin: {
      voice: "gqg", date: "1918-07-17", source: "Communique officiel",
      text:
        "The enemy attack east and west of Reims has been contained. Our line is " +
        "everywhere intact. The situation is favourable.",
    },
    situation: (flags) =>
      "The German offensives have taken more ground than anything since 1914 and are " +
      "standing in salients they do not have the men to hold. " +
      (flags.gqg_command1918 === "unified"
        ? "There is one command over the Allied armies and it can move reserves from anywhere to anywhere."
        : "There are two commands, and a counterattack requires them to agree in the time available.") +
      "\n\nThe flank of the Marne salient is open, out of the forest at " +
      "Villers-Cotterets, and the reserve to strike it exists. Committing it now spends " +
      "the last fresh divisions in France on a judgment about an enemy who has " +
      "attacked five times this year.\n\n" +
      "The army being asked to attack is the army that would not attack fourteen " +
      "months ago." +
      (flags.gqg_aisne === "forward"
        ? "\n\nThe Aisne broke on 27 May, and the salient this attack is aimed at is the one that " +
          "came out of it."
        : flags.gqg_aisne === "depth"
          ? "\n\nThe German attack in May went in against a front held in depth, and it gained " +
            "less ground than it might have."
          : ""),
    choices: [
      {
        id: "strike",
        label: "Commit the reserve against the salient flank",
        historical: true,
        advisor: { name: "Mangin", position:
          "They are in the open and out of reserves. There will not be a better morning than tomorrow." },
        impact: { manpower: -2, munitions: -2, will: 2 },
        setFlags: { gqg_1918: "counterattacked" },
        dispute:
          "Whether the July counterattack seized the initiative or merely arrived as the " +
          "German offensives were exhausting themselves is a live question. The " +
          "operational critique of Ludendorff holds that the spring offensives had " +
          "already failed strategically by mid-July and left an army in exposed salients " +
          "with no reserve, which would suggest the turn was coming regardless. The " +
          "counter-reading is that an unpressed enemy in a salient consolidates, and that " +
          "the timing of the blow is precisely what denied that.",
        nextIf: (m) => (m.will <= -6 ? "gqg_end_armybreaks" : null),
        next: "gqg_1918_14_americans",
        uncertain: [
          { weight: 70, title: "The initiative changes hands and does not change back", historicalBranch: true,
            impact: { will: 1 },
            setFlags: { gqg_1918Result: "turned" },
            outcome:
              "The counterattack goes in out of the forest and the salient begins to close. " +
              "The initiative changes hands and does not change back. From here the " +
              "fighting is continuous, and it is going one way. The Germans, who have " +
              "attacked five times since March, find themselves counting divisions they do " +
              "not have, and the army that would not attack fourteen months ago goes " +
              "forward behind its tanks and its guns with something close to confidence." },
          { weight: 30, title: "The blow lands on an enemy already withdrawing",
            impact: { manpower: -1 },
            setFlags: { gqg_1918Result: "coincided" },
            outcome:
              "Speculative. The reserve is committed against a salient that was being given " +
              "up regardless. The ground comes back and the last fresh divisions in France " +
              "are spent taking what was going to be evacuated. The credit goes to the " +
              "Commander who gave the order, and the cost is borne by the divisions that " +
              "carried it out. The Allied armies will go on attacking, but they will do so " +
              "with fewer fresh troops than they would have had if the blow had waited." },
        ],
      },
      {
        id: "hold",
        label: "Hold the reserve and let the offensives exhaust themselves",
        advisor: { name: "Pétain", position:
          "They will run out without our help. Spending the last reserve to prove a point we can wait for is how this army was ruined before." },
        impact: { manpower: 1, munitions: 1, will: -2 },
        setFlags: { gqg_1918: "husbanded" },
        nextIf: (m) =>
          m.will <= -5 ? "gqg_end_armybreaks"
          : m.manpower <= -4 ? "gqg_end_paris"
          : null,
        next: "gqg_end_defensive",
        outcome:
          "Speculative. The reserve stays in hand and the German offensives stop on " +
          "their own, as they were going to. The initiative is not taken, because " +
          "taking it was the thing declined. The army that has been rebuilt since 1917 " +
          "is kept as a reserve rather than spent as an instrument, and the Germans are " +
          "left to fall back on their own schedule, with their own divisions, and to " +
          "find a new line, which they do.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-09
  gqg_1918_14_americans: {
    year: 1918, date: "1918-09-02", city: "Bombon",
    title: "An American Army, or American Divisions",
    advisors: ["foch", "petain"],
    situation:
      "The American First Army is preparing to attack the Saint-Mihiel salient. On 30 " +
      "August Foch told Pershing that the attack should be reduced to little more than a " +
      "demonstration, and that two thirds of the First Army's troops should be given to " +
      "Haig and to the French generals to be used where the fighting is.\n\n" +
      "Pershing will not accept it. He has said throughout that the Americans will fight " +
      "as an army. The French and British armies are tired, and every American division " +
      "that is put into their lines is a division they do not have to find.",
    choices: [
      {
        id: "army",
        label: "Back Pershing: an American army with its own sector in the Meuse and the Argonne",
        historical: true,
        advisor: { name: "Pétain", position:
          "The Americans will do more as an army with a front of their own than as battalions scattered through other armies." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { gqg_americans: "army" },
        next: "gqg_1918_15_grand",
        outcome:
          "On 2 September Pétain and Pershing meet Foch. Supported by Pétain, Pershing " +
          "offers to take responsibility for the whole sector from Pont-a-Mousson, " +
          "through the valley of the Meuse, to the Argonne forest, and the dispute is " +
          "resolved on that basis. The American First Army pinches out the Saint-Mihiel " +
          "salient on 12 September and moves to attack in the Meuse-Argonne. The tired " +
          "armies of the Allies get a new ally that fights under its own flag.",
      },
      {
        id: "split",
        label: "Hold to the plan: distribute the American divisions among the Allied armies",
        advisor: { name: "Foch", position:
          "The battle is where the fighting is, and the divisions should be used there. A demonstration at Saint-Mihiel is worth less than that." },
        gate: (m) => m.will >= -2,
        disabledReason: "The coalition cannot take another quarrel over the American army",
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { gqg_americans: "split" },
        next: "gqg_1918_15_grand",
        outcome:
          "Speculative. The American divisions are put into the British and French " +
          "armies. The tired armies are reinforced at once, and the Americans fight in " +
          "other commanders' battles. The American government has said it will not " +
          "allow this to be done, and it has to be told the answer. The coalition has " +
          "gained the divisions and lost the goodwill of the one partner it cannot do " +
          "without, and the cost of that appears in the autumn.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-09
  gqg_1918_15_grand: {
    year: 1918, date: "1918-09-12", city: "Bombon",
    title: "Everyone Into the Battle",
    advisors: ["foch", "petain"],
    situation: (flags) =>
      "The Americans have pinched out the Saint-Mihiel salient today. " +
      (flags.gqg_americans === "split"
        ? "The American divisions are in the Allied armies, and the Allied armies are the stronger for them."
        : "The American First Army stands on its own sector, and is about to attack on it.") +
      "\n\nSince July the Germans have been going back, and since 8 August the " +
      "British have been attacking at Amiens. Foch has a plan to put it all together: a " +
      "series of great attacks along the whole front, each aimed at cutting the " +
      "German lines of communication, so that the success of any one of them lets the " +
      "whole line advance.\n\n" +
      "The French army is asked to attack with the rest, and it is the army that was " +
      "nursed through the summer of 1917 that has to do it.",
    choices: [
      {
        id: "concentric",
        label: "Order the concentric offensives: four attacks from 26 September",
        historical: true,
        advisor: { name: "Foch", position:
          "A single attack the Germans can meet with their reserves. Four attacks on four fronts in four days they cannot meet at all." },
        impact: { manpower: -1, munitions: -1, will: 2 },
        setFlags: { gqg_grand: "concentric" },
        erodes: "costly_offensive",
        next: "gqg_1918_16_senlis",
        outcome:
          "The attacks open on 26 September with the Americans in the Meuse-Argonne, on " +
          "the 27th with the British First and Third Armies toward Cambrai, on the 28th in " +
          "Flanders, and on the 29th against the Hindenburg Line on the Saint-Quentin canal, " +
          "by the British Fourth Army and the French First. German reserves are pulled " +
          "across the whole front, and by the beginning of October it is giving way.",
      },
      {
        id: "limited",
        label: "Go on with limited attacks, one front at a time, and keep the army in hand",
        gate: (m) => m.manpower >= -3,
        disabledReason: "The Allied governments will not accept an autumn without a general offensive",
        impact: { manpower: 1, munitions: 1, will: -2 },
        setFlags: { gqg_grand: "limited" },
        next: "gqg_1918_16_senlis",
        outcome:
          "Speculative. The attacks go on as they have since August, each on its own " +
          "front and its own date. The Germans can move their reserves from one to " +
          "another, and the winter comes with the line still on German ground. The " +
          "armies are spared the heavy cost of a general offensive and the Allied " +
          "governments are asked to explain a pause that the enemy does not take.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-10
  gqg_1918_16_senlis: {
    year: 1918, date: "1918-10-25", city: "Senlis",
    title: "What to Ask For",
    advisors: ["foch", "petain", "clemenceau"],
    situation:
      "The Germans have asked President Wilson for an armistice, and the Allied " +
      "governments have asked their generals what terms the armies need. Foch has " +
      "called a conference at Senlis and has put the question to each of the " +
      "commanders in turn.\n\n" +
      "Haig has urged moderation, telling the British government that the German army " +
      "is far from beaten. Pétain's view is harder than Haig's. Pershing's is harder " +
      "than either: he would push the Germans back into Germany, so that the people at " +
      "home understand that their army has been beaten in the field.\n\n" +
      "The terms have to be strong enough that the Germans cannot go back to the war, " +
      "and not so strong that they refuse them.",
    choices: [
      {
        id: "bridgeheads",
        label: "Ask for the occupation of the Rhine bridgeheads and a heavy surrender of equipment",
        historical: true,
        advisor: { name: "Foch", position:
          "An armistice has to leave the Germans unable to resume the war. A line on the Rhine does that, and nothing less does." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { gqg_senlis: "bridgeheads" },
        nextIf: (m, flags) =>
          m.will <= -6 ? "gqg_end_armybreaks"
          : (flags.gqg_command1918 === "national") ? "gqg_end_costlier"
          : (flags.gqg_mutinyResponse === "both" && m.manpower >= -3) ? "gqg_end_intact"
          : null,
        next: "gqg_end_victory",
        outcome:
          "With Clemenceau's agreement Foch takes the soldiers' views and then, acting " +
          "on his own authority as Allied commander, makes his own list of terms. The " +
          "armistice conditions include the occupation of strategic positions, with the " +
          "bridgeheads over the Rhine, so that the Allies hold military superiority " +
          "while the peace is made. The Germans, who asked for terms, are given " +
          "conditions that would make a resumption of the war impossible, and they " +
          "sign.",
      },
      {
        id: "moderate",
        label: "Ask for terms the German army can accept, as Haig urged",
        advisor: { name: "Haig", position:
          "The German army is far from beaten. Terms it cannot accept will be refused and the war will go on." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_senlis: "moderate" },
        nextIf: (m, flags) =>
          m.will <= -6 ? "gqg_end_armybreaks"
          : (flags.gqg_command1918 === "national") ? "gqg_end_costlier"
          : (flags.gqg_mutinyResponse === "both" && m.manpower >= -3) ? "gqg_end_intact"
          : null,
        next: "gqg_end_victory",
        outcome:
          "Speculative. The terms asked for are those that the British commander " +
          "thought the German army could accept, with fewer demands for positions on " +
          "the Rhine. The armistice is easier to sign and gives the Allies less to hold " +
          "while the peace is made. The French, who want a frontier they can defend, " +
          "find that the terms leave Germany with an army, a river and a case that it " +
          "was never beaten in the field.",
      },
    ],
  },

  // ---------------------------------------------------------------- endings
  gqg_end_victory: {
    year: 1918, date: "1918-11-11", city: "Compiègne",
    title: "The Ten Departments",
    advisors: ["foch", "clemenceau"],
    situation:
      "The armistice is signed in a railway carriage in the forest at Compiègne and " +
      "the occupied departments come back. That was the war aim from the first week " +
      "and it has been achieved, and there is no version of this morning that feels " +
      "like the word victory is doing honest work.\n\n" +
      "The ledger is not a thing to be softened here and will not be. The generation " +
      "that held Verdun and would not attack in 1917 and attacked in 1918 is the " +
      "generation that is not coming back.",
    ending: { family: "victory-that-does-not-feel-like-one", badge: BADGES.SETTLED },
    epilogue: (flags) =>
      (flags.gqg_week === "looked" ? "The first week: the offensive was held for a week while the cavalry looked.\n" : "") +
      "August 1914: " + (flags.gqg_opening === "shifted" ? "the plan was abandoned before it was tried." : "the plan was executed as written.") + "\n" +
      "The Marne: " + (flags.gqg_marne === "delayed" ? "the counterattack was deferred." : flags.gqg_marneResult === "contained" ? "attacked, and contained short of a separation." : "the flank was attacked and the gap exploited.") + "\n" +
      "July 1918: " + (flags.gqg_1918Result === "coincided" ? "the blow landed on an enemy already going back." : flags.gqg_1918 === "husbanded" ? "the reserve was held." : "the reserve took the initiative at Villers-Cotterets.") + "\n" +
      "Verdun: " + (flags.gqg_verdun === "shortened" ? "the east bank was given up." : "both banks held, by rotation.") + "\n" +
      "The Aisne: " + (flags.gqg_chemin === "halted" ? "halted on the undertaking given." : "continued past forty-eight hours.") + "\n" +
      "The crisis of 1917: " + (flags.gqg_mutinyResponse === "discipline" ? "answered with discipline first." : "answered with remedy and repression together.") + "\n" +
      "March 1918: " + (flags.gqg_command1918 === "national" ? "command remained national." : "command was unified under Foch.") + "\n" +
      "1915: " + (flags.gqg_1915 === "limited" ? "operations limited to the artillery available." : "offensives in Artois and Champagne.") + "\n" +
      "The Somme: " + (flags.gqg_somme === "deferred" ? "the French contribution was deferred." : "committed alongside the British.") + "\n" +
      "La Malmaison: " + (flags.gqg_malmaison === "exploited" ? "the announced limit was exceeded." : "stopped on its objective.") + "\n" +
      "The order to go back: " + (flags.gqg_retreat === "stand" ? "a stand on the Sambre and the Meuse." : "the withdrawal ordered on 25 August.") + "\n" +
      "The commanders: " + (flags.gqg_sack === "kept" ? "kept in place." : "the failures relieved.") + "\n" +
      "The race to the sea: " + (flags.gqg_race === "dug" ? "stopped on the Aisne." : flags.gqg_race === "aisne" ? "one more attack on the Aisne heights first, and then the extension." : "the left extended to the sea.") + "\n" +
      "Salonika: " + (flags.gqg_salonika === "refused" ? "no divisions sent." : "the Army of the Orient sent.") + "\n" +
      "Chantilly: " + (flags.gqg_chantilly === "free" ? "French freedom of action kept." : "simultaneous offensives proposed for 1916.") + "\n" +
      "Douaumont: " + (flags.gqg_douaumont === "waited" ? "left in German hands for the winter." : flags.gqg_douaumont === "failed" ? "the attack of October 1916 failed." : "retaken in October 1916.") + "\n" +
      "Calais: " + (flags.gqg_calais === "agreement" ? "the British army left under its own commander." : "the British army placed under Nivelle for the offensive.") + "\n" +
      "May 1917: " + (flags.gqg_directive === "offensive" ? "a great offensive kept in preparation." : "limited objectives, by Directive No. 1.") + "\n" +
      "March 1918, the link: " + (flags.gqg_link === "allin" ? "the whole reserve sent north." : flags.gqg_link === "paris" ? "Haig told in writing that the reserve might fall back on Paris." : "two armies in reserve in the Somme valley, twenty divisions refused.") + "\n" +
      "The Aisne, May 1918: " + (flags.gqg_aisne === "depth" ? "defence in depth enforced." : "the front line left full.") + "\n" +
      (flags.gqg_duchene === "relieved" ? "The Sixth Army's commander: relieved on the eve of the attack.\n" : "") +
      "The Americans: " + (flags.gqg_americans === "split" ? "divided among the Allied armies." : "an army with its own sector.") + "\n" +
      "The autumn offensives: " + (flags.gqg_grand === "limited" ? "limited attacks, front by front." : "four concentric offensives from 26 September.") + "\n" +
      "The armistice terms: " + (flags.gqg_senlis === "moderate" ? "the moderate terms Haig urged." : "the Rhine bridgeheads and heavy surrender of equipment.") + "\n" +
      "1918 command: " + (flags.gqg_command1918 === "national" ? "national throughout." : "unified from March.") + "\n\n" +
        "What actually happened: The armistice came into force at eleven o'clock on " +
        "the morning of 11 November 1918. France recovered Alsace-Lorraine and the " +
        "occupied departments, and about 1.4 million French soldiers had been " +
        "killed. Foch received his baton as Marshal of France and Pétain his in " +
        "December; Clemenceau, who had held the government together, lost the " +
        "presidential election of January 1920 and left politics.",
  },

  gqg_end_armybreaks: {
    year: 1918, date: "1918-06-01", city: "Compiègne",
    title: "It Does Not Come Back",
    advisors: ["petain"],
    situation:
      "The crisis of 1917 was survivable and was not survived. What made it survivable " +
      "was that the men refusing orders were bargaining rather than breaking, and a " +
      "bargain requires the other side to offer something.\n\n" +
      "An army given nothing does not return to the condition it was in before it " +
      "asked. It holds, less each month, until it is asked to do something it will not " +
      "do at a moment when the enemy is watching.",
    ending: { family: "army-does-not-recover-from-1917", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The historical army recovered inside six weeks. Most accounts " +
      "credit the pairing — leave, rest, and the promise, alongside a repression " +
      "deliberately kept narrow. Removing half of that pairing is the " +
      "counterfactual, and the evidence points where this ending points.\n\nWhat " +
      "actually happened: The army recovered in weeks. Pétain stopped the " +
      "offensives, gave the men regular leave and better food, visited the " +
      "divisions himself and listened to the grievances, and the courts-martial of " +
      "the summer handed down several hundred death sentences, of which between twenty-six and forty-nine, by different counts, " +
      "were carried out. The exact count is still argued about. The army that " +
      "returned to the line in the autumn of 1917 attacked at La Malmaison, and in " +
      "1918 it counterattacked. Pétain's reputation, in the army and in France, was " +
      "made in these weeks by what he refused to do as much as by what he did.",
  },

  gqg_end_coalitionfails: {
    year: 1918, date: "1918-04-15", city: "Amiens",
    title: "Two Retreats",
    advisors: ["petain"],
    situation:
      "Each army withdrew toward what it could not afford to lose. The British went " +
      "toward their ports and the French toward their capital, and the gap between " +
      "them widened with every mile because both were behaving correctly by their own " +
      "lights.\n\n" +
      "Neither army was beaten. The space between them was.",
    ending: { family: "coalition-fracture", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Unified command was conceded historically, in this month, under " +
      "exactly this pressure. It is the counterfactual precisely because everyone " +
      "involved could see what refusing it would cost.\n\nWhat actually happened: " +
      "At Doullens on 26 March 1918 Foch was given the coordination of the Allied " +
      "armies on the Western Front, and the front held in front of Amiens. His " +
      "powers were widened in the weeks that followed, and in April he was given " +
      "the title of Commander-in-Chief of the Allied armies. The British and French " +
      "armies stayed joined, and the two retreats that this ending describes did " +
      "not happen. Haig, who had been reluctant, accepted the arrangement, and " +
      "Pershing, when the Americans were brought in, agreed to it with " +
      "qualifications of his own.",
  },

  gqg_end_costlier: {
    year: 1918, date: "1918-11-11", city: "Compiègne",
    title: "The Same Ending, Later",
    advisors: ["foch"],
    situation:
      "The war is won and the departments come back, and it takes longer and costs " +
      "more than it needed to because two headquarters spent the spring agreeing with " +
      "each other in writing.\n\n" +
      "Every reserve moved late, every counterattack mounted a week after the moment " +
      "for it, every liaison officer riding between two staffs who each had the " +
      "authority to say no.",
    ending: { family: "victory-at-higher-cost", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Unity of command did not win the war. It shortened it, and the " +
      "difference is measured in the only currency that has been counted " +
      "here.\n\nWhat actually happened: The unified command moved reserves between " +
      "the British and French sectors through the spring and summer, and the autumn " +
      "offensives were planned as a single design, which the national commanders in " +
      "this ending do not have. The war ended in November 1918, a year before the " +
      "Allies' own planners expected it to. Some 1.4 million French soldiers had " +
      "been killed by the end of it. Foch's authority was extended in stages and " +
      "was never unlimited, but it was enough to make a single plan out of what had " +
      "been two. It was the first time in the war that a single will directed the " +
      "whole Allied front.",
  },

  gqg_end_intact: {
    year: 1918, date: "1918-11-11", city: "Compiègne",
    title: "An Army That Was Kept",
    advisors: ["petain", "foch"],
    situation:
      "The army that stands at the armistice was rebuilt after 1917 rather than " +
      "merely disciplined, was not spent to prove points in the autumn, and was " +
      "committed once, at the right moment, under a command that could move it.\n\n" +
      "The departments come back. So do more of the men who took them.",
    ending: { family: "victory-with-the-army-preserved", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The outcome of the war was not in the gift of this headquarters " +
      "by 1918.\n\nWhat actually " +
      "happened: The French army that fought in 1918 had been rebuilt after the " +
      "mutinies, but it was short of men, and its commanders husbanded it in the " +
      "summer and spent it in the autumn. France ended the war with some 1.4 " +
      "million dead, among the largest shares of its young men that any great power " +
      "lost. An army kept intact is one that was not asked, in 1918, for what the " +
      "autumn offensives asked of it, and this ending is built on that not having " +
      "happened. The question of whether it was spent too freely in the last weeks, " +
      "or not freely enough, was argued about by veterans and historians for " +
      "decades afterwards.",
  },

  gqg_end_defensive: {
    year: 1918, date: "1918-11-11", city: "Chantilly",
    title: "Waiting Correctly",
    advisors: ["petain"],
    situation:
      "The German offensives stopped without being counterattacked. The reserve was preserved, the line held, and the initiative " +
      "was left where it lay.\n\n" +
      "It was not wrong. The army is intact and the front is unbroken and the argument " +
      "for waiting was sound every single time it was made. The war goes on being fought by whoever is willing to start something.",
    ending: { family: "defensive-into-1919", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Husbanding an army is a defensible doctrine and this is what it " +
      "produces when nobody spends it.\n\nWhat actually happened: The German " +
      "offensives of 1918 did end, as this ending says, but the Allies did not wait " +
      "for them to. The counterattack of 18 July, the British attack at Amiens on 8 " +
      "August and the great offensives of late September brought the war to an end " +
      "in November. The Allied staffs had been preparing a larger campaign for " +
      "1919, with tanks and a growing American army, and it was never needed. Foch " +
      "and the Allied governments did not accept the waiting that this ending " +
      "describes, and the argument between caution and attack was settled by the " +
      "German collapse before it could be settled by anyone else.",
  },

  gqg_end_negotiated: {
    year: 1917, date: "1917-08-01", city: "Paris",
    title: "The Conversation Nobody Was Allowed to Have",
    advisors: ["painleve"],
    situation:
      "With the army in open indiscipline and the Chamber told none of it, an approach " +
      "is made. It is made from a country holding a line it can hold, with ten departments still under occupation: any terms " +
      "available now leave some of France where it currently is.\n\n" +
      "That is why this was never seriously attempted. It is not that nobody thought of " +
      "it.",
    ending: { family: "earlier-negotiated-outcome", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. No French government of 1917 could have signed terms leaving " +
      "the occupied departments in German hands and survived the signing.\n\nWhat " +
      "actually happened: No French government approached Germany in 1917. The " +
      "spring brought the Sixtus affair, a private approach by the Austrian Emperor " +
      "through his brother-in-law, Prince Sixtus of Bourbon-Parma, which came to " +
      "nothing and was exposed in April 1918. Painlevé's brief ministry in the " +
      "autumn of 1917 gave way to Clemenceau's on 16 November, which was formed to " +
      "make war to the end and did. A negotiated peace in 1917 would have left " +
      "Germany in occupation of northern France and most of Belgium, and no French " +
      "cabinet could have signed it and remained in office. The idea that peace " +
      "might have been had in that year survived in French politics as an " +
      "accusation for years.",
  },

  gqg_end_paris: {
    year: 1918, date: "1918-06-10", city: "Paris",
    title: "The Government Leaves Again",
    advisors: ["petain", "foch"],
    situation:
      "The offensives were not counterattacked and were not contained early, and the " +
      "line has come south far enough that the ministries are being packed for the " +
      "second time in this war.\n\n" +
      "The army is not broken and the front is not open. Neither of those facts is " +
      "what anyone in the country is looking at.",
    ending: { family: "german-1918-reaches-further", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The historical German offensives came near enough to Paris to " +
      "be shelled from range and no nearer. They were held there by reserves " +
      "committed where the French staff judged the danger greatest.\n\nWhat actually happened: The German " +
      "offensive of the spring reached the Marne at Chateau-Thierry at the end of " +
      "May, within about sixty kilometres of Paris, and was stopped in early June " +
      "by French and American divisions. Paris was shelled by a long-range gun from " +
      "the end of March and bombed from the air, and many people left. The " +
      "government did not leave. Clemenceau stayed in the capital, and the " +
      "offensives were halted short of it. The Germans were stopped on the Marne, " +
      "and in July the counterattack began that turned the year.",
  },

  gqg_end_relieved: {
    year: 1918, date: "1918-06-15", city: "Paris",
    title: "The Chamber Reads the Ledger",
    advisors: ["clemenceau"],
    situation:
      "No single offensive did this. There is a column of figures covering four years " +
      "and a pattern in it: a command that answered every problem with an attack and " +
      "went on answering after the attacks had stopped producing anything but the " +
      "figures.\n\n" +
      "In this Republic the army does not outlast the civil power's patience with it. " +
      "That was settled a long time before this war and it is being demonstrated again " +
      "now.",
    ending: { family: "hard-mode-relieved", badge: BADGES.CONTESTED, hardModeOnly: true },
    epilogue: () =>
      "The government removes its Commander-in-Chief, and the casualty list is the " +
      "reason it gives.\n\nWhat actually happened: Clemenceau removed General Duchêne after " +
      "the Aisne but kept Pétain as Commander-in-Chief of the French armies to the " +
      "end of the war, under Foch. The Chamber's committees went on supervising the " +
      "command closely, and the Prime Minister visited the front. The fall that " +
      "this ending describes did not happen. France went into the autumn of 1918 " +
      "with the command and the government working, as they had to, in a mutual " +
      "suspicion that neither side ever fully dropped. Clemenceau had said that the " +
      "war was too serious to be left to the generals, and he acted on it, but he " +
      "never removed the man whom the army trusted most.",
  },
};

