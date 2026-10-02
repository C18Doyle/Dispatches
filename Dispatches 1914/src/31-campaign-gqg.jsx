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

CAMPAIGNS.gqg.startNode = "gqg_1914_01_frontieres";

CAMPAIGNS.gqg.commanders = [
  { id: "joffre", name: "Joffre", title: "Commander-in-Chief", from: "1914-08-01", to: "1916-12-12" },
  { id: "nivelle", name: "Nivelle", title: "Commander-in-Chief", from: "1916-12-12", to: "1917-05-15" },
  { id: "petain", name: "Petain", title: "Commander-in-Chief", from: "1917-05-15", to: "1918-11-11" },
];

CAMPAIGNS.gqg.advisors = [
  { id: "joffre", name: "Joffre", from: "1914-08-01", to: "1916-12-12",
    dossier: { role: "Commander-in-Chief, 1914-1916",
      bio: "Directed the armies from the Frontiers through the Marne, the 1915 offensives, Verdun and the Somme. Advocated concerted allied attack throughout.",
      fate: "Relieved in December 1916 and made a Marshal of France." } },
  { id: "castelnau", name: "de Castelnau", from: "1914-08-01", to: "1918-11-11",
    dossier: { role: "Army and army group commander; chief of staff at GQG",
      bio: "Present at most of the war's decisions on the French side without ever holding the top command.",
      fate: "Survived the war. Not made a Marshal." } },
  { id: "gallieni", name: "Gallieni", from: "1914-08-01", to: "1916-05-27",
    dossier: { role: "Military Governor of Paris; later Minister of War",
      bio: "Held Paris in September 1914 and pressed for the counterattack against the exposed German flank.",
      fate: "Left the war ministry in 1916 on grounds of health and died that May." } },
  { id: "petain", name: "Petain", from: "1914-08-01", to: "1918-11-11",
    dossier: { role: "Commander at Verdun; Commander-in-Chief from May 1917",
      bio: "Made his reputation on the defence of Verdun and the rotation system that fed the army through it. Took the command in May 1917 with the army in open indiscipline.",
      fate: "Restored the army through leave, rest and limited-objective operations. His later history is not this war's." } },
  { id: "nivelle", name: "Nivelle", from: "1916-12-12", to: "1917-05-15",
    dossier: { role: "Commander-in-Chief, December 1916 to May 1917",
      bio: "Came to prominence at Verdun in late 1916 and offered the governments what they wanted to hear: a rupture of the German line in forty-eight hours at a cost of around ten thousand men.",
      fate: "Relieved on 15 May 1917 and sent to North Africa." } },
  { id: "mangin", name: "Mangin", from: "1914-08-01", to: "1918-11-11",
    dossier: { role: "Corps and army commander",
      bio: "Supported the Nivelle plan and fell with it in April 1917. Returned to command and led the counterattack of July 1918.",
      fate: "Survived the war." } },
  { id: "painleve", name: "Painleve", from: "1917-03-20", to: "1917-11-16",
    dossier: { role: "Minister of War from March 1917",
      bio: "Sceptical of the Nivelle plan from the start. Extracted the promise that the offensive would stop if it had not broken through in forty-eight hours.",
      fate: "Briefly Prime Minister in late 1917." } },
  { id: "foch", name: "Foch", from: "1914-08-01", to: "1918-11-11",
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
// Erosion cap set after measurement, same method as OHL. See measure-erosion.js.
CAMPAIGNS.gqg.hardMode.erosionMax = 5;

CAMPAIGNS.gqg.nodes = {

  gqg_1914_01_frontieres: {
    year: 1914, date: "1914-08-14", city: "Vitry-le-Francois",
    title: "Into Lorraine",
    advisors: ["joffre", "castelnau"],
    situation:
      "The plan is an attack into Lorraine and the Ardennes, into the provinces lost " +
      "in 1871, on the shortest line to the frontier. It is built on the conviction " +
      "that the decisive quality in this war will be the willingness to attack, and it " +
      "assumes the German right will not be strong enough to matter.\n\n" +
      "Reports from Belgium suggest the German right is very much strong enough to " +
      "matter. Acting on those reports means abandoning the attack before it has been " +
      "made and conceding that the army's whole doctrine was wrong on the first page.",
    context:
      "Reserve formations are the question underneath the question. The plan assumes " +
      "the Germans will not put reserve corps in the front line. If they do, the right " +
      "wing sweeping through Belgium is half again as strong as anyone has allowed for.",
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
        next: "gqg_1914_02_marne",
        outcome:
          "The attacks go in and are stopped in front of positions the doctrine said " +
          "would give way. The Battle of the Frontiers costs the army more men in three " +
          "weeks than anyone in this building has budgeted for a year, and the German " +
          "right comes on through Belgium regardless.",
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
        next: "gqg_1914_02_marne",
        outcome:
          "Speculative. Formations move left earlier than they historically did. Fewer " +
          "men are spent on the frontier and more are in front of the sweep, at the " +
          "price of an army told on its first day that its doctrine was mistaken.",
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
          "and attack tomorrow. Whether they can is a question about men, not maps."),
    context:
      "The Military Government of Paris has been arguing for the attack for two days. " +
      "The armies that would make it are the armies that have been walking backwards " +
      "since Charleroi.",
    choices: [
      {
        id: "attack",
        label: "Turn and attack the exposed flank",
        historical: true,
        advisor: { name: "Gallieni", position:
          "The flank is there now. It will not be there next week, and neither will the initiative." },
        impact: { manpower: -1, munitions: -1, will: 3 },
        setFlags: { gqg_marne: "attacked" },
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
            next: "gqg_1915_03_grignotage",
            outcome:
              "The armies turn. The gap between the German First and Second Armies opens " +
              "and is exploited, and the invasion stops short of the decision it needed. " +
              "The war that follows is a different war from the one everyone prepared for, " +
              "and it will last four years." },
          { weight: 35, title: "The counterattack is contained and the line settles further south",
            impact: { manpower: -1, will: -1 },
            setFlags: { gqg_marneResult: "contained" },
            next: "gqg_1915_03_grignotage",
            outcome:
              "Speculative. The turn is made and does not achieve the separation it " +
              "needed. The invasion is stopped, later and further south, and the line " +
              "that congeals runs across more of France than it historically did." },
        ],
      },
      {
        id: "continue",
        label: "Continue the withdrawal and attack when the armies are rested",
        advisor: { name: "Joffre", position:
          "An attack made with troops in this condition can fail once and finish everything." },
        gate: (m) => m.manpower >= -2,
        disabledReason: "There is no line further back that can be held with what is left",
        impact: { manpower: 1, munitions: 0, will: -3 },
        setFlags: { gqg_marne: "delayed" },
        next: "gqg_1915_03_grignotage",
        outcome:
          "Speculative. The withdrawal continues past the Marne and the flank closes. " +
          "The army is in better condition and the ground behind it is French, and " +
          "there is markedly less of it.",
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
    context:
      "There is a school inside the army arguing that the material simply is not there " +
      "yet for a rupture, and that offensives should be limited to what artillery can " +
      "actually guarantee. It is not a popular school.",
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
        next: "gqg_1916_04_verdun",
        outcome:
          "Artois and Champagne are fought and the second position holds both times. " +
          "The line moves by yards. The cost is entered in a ledger that the Chamber " +
          "will eventually read.",
      },
      {
        id: "limited",
        label: "Limit operations to what the guns can guarantee and build the artillery park",
        advisor: { name: "Petain", position:
          "Fire wins ground and men hold it. In that order, or not at all." },
        gate: (m) => m.will >= -1,
        disabledReason: "A year without an attempt to liberate the occupied departments cannot be defended in the Chamber",
        impact: { manpower: 2, munitions: -1, will: -2 },
        setFlags: { gqg_1915: "limited" },
        next: "gqg_1916_04_verdun",
        outcome:
          "Speculative. The offensives are scaled to the artillery available. The army " +
          "enters 1916 stronger and the government enters it having explained for twelve " +
          "months why nothing was attempted.",
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
    situation:
      "The guns were taken out of the Verdun forts and sent to the field army, which " +
      "was defensible when the sector was quiet and is now the situation. The Germans " +
      "are attacking into a fortress zone that is a fortress mainly on the map.\n\n" +
      "There is a case for shortening the line, giving up the east bank, and refusing " +
      "the battle on ground of the enemy's choosing. It is militarily coherent. It " +
      "would also mean announcing that Verdun has been abandoned, and no government in " +
      "France survives that announcement.",
    context:
      "One road runs into the sector. Everything that reaches Verdun — men, shells, " +
      "food — reaches it along that road, and the battle will be as long as the road " +
      "can be kept working.",
    choices: [
      {
        id: "hold",
        label: "Hold both banks and feed the sector through the road",
        historical: true,
        advisor: { name: "Petain", position:
          "The sector can be held if units are rotated through it rather than left in it. Nothing else about this is negotiable." },
        impact: { manpower: -3, munitions: -2, will: 2 },
        setFlags: { gqg_verdun: "held" },
        next: "gqg_1916_05_somme",
        outcome:
          "Verdun is held, and held by rotation: divisions go in, are used, and come " +
          "out, and most of the French army passes through the sector before the year " +
          "is done. That rotation is why the army survives 1916 and why so much of it " +
          "has personally been to Verdun by 1917.",
      },
      {
        id: "shorten",
        label: "Give up the east bank and hold a shorter line further back",
        advisor: { name: "de Castelnau", position:
          "Ground is not the same as position. We are being invited to defend a name." },
        gate: (m) => m.will >= 2,
        disabledReason: "Abandoning Verdun cannot be survived politically from here",
        impact: { manpower: 2, munitions: 1, will: -4 },
        setFlags: { gqg_verdun: "shortened" },
        next: "gqg_1916_05_somme",
        outcome:
          "Speculative. The line is shortened and the battle the enemy wanted is " +
          "declined. The army is materially stronger for it and the government that " +
          "authorised it does not last the spring.",
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
      "\n\nThe British will attack either way. What is at stake is whether they " +
      "attack beside an ally or in place of one, and what that does to the alliance " +
      "for the remaining years of the war.",
    context:
      "Relieving Verdun is one argument for the Somme. Keeping the coalition intact is " +
      "the other, and it is the one that will still matter in 1918.",
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
        next: "gqg_1916_06_nivelle",
        outcome:
          "The French share of the Somme is smaller than promised and is made. Pressure " +
          "comes off Verdun. The alliance holds, and the ledger grows.",
      },
      {
        id: "defer",
        label: "Defer the French contribution and let the British attack alone",
        advisor: { name: "Joffre", position:
          "We cannot fight two battles of this size in one summer. One of them has to be someone else's." },
        impact: { manpower: 1, munitions: 1, will: -2 },
        setFlags: { gqg_somme: "deferred" },
        next: "gqg_1916_06_nivelle",
        outcome:
          "Speculative. The British attack on the Somme substantially alone. Divisions " +
          "are preserved. What is spent instead is the assumption, on the other side of " +
          "the Channel, that France will be there when the plan says so.",
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
      "at a cost he puts around ten thousand. The alternative on the table is Petain's, " +
      "which is that the war cannot be won quickly and should be fought accordingly.",
    context:
      "The Minister of War will not carry the Nivelle plan and will resign rather than " +
      "do it. That is a warning available to anyone who wants to read it as one.",
    choices: [
      {
        id: "nivelle",
        label: "Back Nivelle and the forty-eight hour plan",
        historical: true,
        advisor: { name: "Nivelle", position:
          "The formula worked at Verdun on a small front. There is no reason of principle it cannot work on a large one." },
        impact: { manpower: 0, munitions: 0, will: 2 },
        setFlags: { gqg_command: "nivelle" },
        next: "gqg_1917_07_chemin",
        outcome:
          "Nivelle takes the command in December. Lyautey leaves the war ministry " +
          "rather than sign the plan, and is replaced in March by Painleve, who is no " +
          "more convinced but stays to argue.",
      },
      {
        id: "petain",
        label: "Give the command to Petain and the doctrine of limited objectives",
        advisor: { name: "Petain", position:
          "I can promise the government ground taken at a price it can afford. I cannot promise it the war in two days." },
        gate: (m) => m.will >= -1,
        disabledReason: "A commander offering only a long war cannot be sold to this Chamber",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { gqg_command: "petain" },
        next: "gqg_1917_07_chemin",
        outcome:
          "Speculative. The limited-objective doctrine takes the top command a year " +
          "early. There is no forty-eight hour promise to fail, and no government " +
          "receives the victory it was told to expect.",
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
      "the ridge pay for the promise.",
    context:
      "The army has been told this attack ends the war. It has been told that " +
      "explicitly, by name, in orders. Whatever happens on this ridge happens to an " +
      "army that was given a date.",
    choices: [
      {
        id: "continue",
        label: "Continue the offensive",
        historical: true,
        advisor: { name: "Nivelle", position:
          "The rupture is one more effort away. Stopping now converts a delay into a defeat." },
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
            next: "gqg_1917_08_mutinies",
            outcome:
              "The offensive is halted on 9 May having taken ground and not the ridge, " +
              "at a cost around a hundred and eighty-seven thousand French casualties. " +
              "What follows is not a collapse of the front. Units refuse to move up to " +
              "attack while continuing to hold the line they are in — and it spreads." },
          { weight: 40, title: "Indiscipline stays local and is contained",
            impact: { will: -1 },
            setFlags: { gqg_mutinyScale: "contained" },
            next: "gqg_1917_08_mutinies",
            outcome:
              "Speculative. Refusals appear in the divisions worst used and do not " +
              "propagate beyond them. The crisis is real, smaller, and survivable " +
              "without a change of doctrine." },
        ],
      },
      {
        id: "halt",
        label: "Halt at the undertaking given — stop the offensive",
        advisor: { name: "Painleve", position:
          "The promise was forty-eight hours. It is the third day. There is nothing further to discuss." },
        impact: { manpower: -1, munitions: -1, will: -1 },
        setFlags: { gqg_chemin: "halted", gqg_mutinyScale: "contained" },
        next: "gqg_1917_08_mutinies",
        outcome:
          "Speculative. The attack is broken off on the undertaking that was given. The " +
          "army is told the truth on the third day rather than the twenty-third, and the " +
          "commander who made the promise has to survive having kept it.",
      },
    ],
  },

  gqg_1917_08_mutinies: {
    year: 1917, date: "1917-05-29", city: "Compiegne",
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
      "What they are is the difficulty. These men are not deserting and not " +
      "fraternising. They are holding the line against attack and refusing orders to " +
      "go forward, and their demands are leave, food, rest, and what happens to their " +
      "families. It resembles a strike more than it resembles a collapse.\n\n" +
      "An army that will defend but will not attack is still an army. It is not an " +
      "army that can be ordered to do anything.",
    context:
      "The affair is being kept out of the press entirely. The full extent will not be " +
      "established until archives open two-thirds of a century from now. That secrecy " +
      "is a decision, and it is being taken now, and it means whatever is done here is " +
      "done without any public account of why.",
    choices: [
      {
        id: "both",
        label: "Concede the grievances and try the ringleaders",
        historical: true,
        advisor: { name: "Petain", position:
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
          "what most accounts credit with ending the crisis in six weeks.",
      },
      {
        id: "report",
        label: "Report to the government that the army cannot be relied on to attack",
        advisor: { name: "Painleve", position:
          "If that is the true state of the army then the Ministry has to be told, whatever it decides to do with the information." },
        gate: (m) => m.will <= -2,
        disabledReason: "The army's condition does not yet warrant telling the government the offensive instrument is gone",
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { gqg_mutinyResponse: "reported" },
        next: "gqg_end_negotiated",
        outcome:
          "Speculative. The condition of the army is put in writing to the Ministry " +
          "rather than managed inside the command. What a government does with that " +
          "information is no longer a military question.",
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
    context:
      "Clemenceau takes the government in November committed to prosecuting the war " +
      "without negotiation, and to the proposition that the command answers to the " +
      "civil power. Both halves of that are about to matter.",
    choices: [
      {
        id: "limited",
        label: "Attack with a limited objective and stop at it",
        historical: true,
        advisor: { name: "Petain", position:
          "The men will be told exactly where the attack stops, and then it will stop there. That is the whole of the method." },
        impact: { manpower: -1, munitions: -2, will: 3 },
        setFlags: { gqg_malmaison: "limited" },
        next: "gqg_1918_10_doullens",
        outcome:
          "The fort and village are taken and the operation stops on its objective. The " +
          "Germans give up the remainder of the ridge and go back across the Ailette. " +
          "The cost is a fraction of April's and the ground is greater. The army " +
          "notices, which is the point of it.",
      },
      {
        id: "exploit",
        label: "Take the objective and exploit beyond it while the line is broken",
        advisor: { name: "Mangin", position:
          "A broken line is an opportunity. Announcing in advance that we will not use it is a strange way to fight." },
        gate: (m) => m.munitions >= -3,
        disabledReason: "The artillery cannot support an advance beyond the announced objective",
        impact: { manpower: -2, munitions: -1, will: -3 },
        setFlags: { gqg_malmaison: "exploited" },
        erodes: "costly_offensive",
        next: "gqg_1918_10_doullens",
        outcome:
          "Speculative. The attack goes past the line it announced. Whatever ground " +
          "that gains, it costs the one thing the summer was spent rebuilding: the " +
          "army's belief that when this command names a limit, the limit is real.",
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
    situation:
      "The German offensive has opened a gap on the British front and the two armies " +
      "are being pushed apart. Each has a line of retreat, and the two lines diverge: " +
      "the British toward the Channel ports, the French toward Paris. Followed " +
      "separately, they lose the war between them without either being beaten.\n\n" +
      "Holding them together requires one authority over both, which means a French " +
      "commander accepting that his armies can be committed by someone other than " +
      "himself, or a British one accepting the same. Nobody has been willing to concede " +
      "this in three and a half years.",
    context:
      "The Americans are arriving and the question of who commands them is the same " +
      "question, deferred. Whatever is agreed here sets the shape of it.",
    choices: [
      {
        id: "unified",
        label: "Accept unified command — Foch coordinates both armies",
        historical: true,
        advisor: { name: "Foch", position:
          "The two armies must be one instrument or they will be two retreats. I do not need to command them. Somebody does." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { gqg_command1918: "unified" },
        next: "gqg_1918_11_counteroffensive",
        outcome:
          "Coordinating authority over the Allied armies goes to Foch, and grows into " +
          "general command. The two retreats become one defence. What has been given up " +
          "is the independence of the French command, and it is not given back.",
      },
      {
        id: "national",
        label: "Keep national command and coordinate by agreement",
        advisor: { name: "Petain", position:
          "I will not have French divisions committed to cover a British withdrawal by a man who does not answer to France." },
        gate: (m) => m.will >= -2,
        disabledReason: "The crisis is past the point where coordination by agreement can be defended",
        impact: { manpower: -2, munitions: 0, will: 1 },
        setFlags: { gqg_command1918: "national" },
        erodes: "costly_offensive",
        nextIf: (m) => (m.manpower <= -6 ? "gqg_end_coalitionfails" : null),
        next: "gqg_1918_11_counteroffensive",
        outcome:
          "Speculative. Command stays national and coordination stays a matter of " +
          "agreement between headquarters that disagree. The gap between the two armies " +
          "is now a matter of goodwill under artillery fire.",
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
      "months ago.",
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
        nextIf: (m, flags) =>
          m.will <= -6 ? "gqg_end_armybreaks"
          : (flags.gqg_command1918 === "national") ? "gqg_end_costlier"
          : (flags.gqg_mutinyResponse === "both" && m.manpower >= -3) ? "gqg_end_intact"
          : null,
        next: "gqg_end_victory",
        uncertain: [
          { weight: 70, title: "The initiative changes hands and does not change back", historicalBranch: true,
            impact: { will: 1 },
            setFlags: { gqg_1918Result: "turned" },
            outcome:
              "The counterattack goes in out of the forest and the salient begins to " +
              "close. The initiative changes hands and does not change back. From here " +
              "the fighting is continuous, and it is going one way." },
          { weight: 30, title: "The blow lands on an enemy already withdrawing",
            impact: { manpower: -1 },
            setFlags: { gqg_1918Result: "coincided" },
            outcome:
              "Speculative. The reserve is committed against a salient that was being " +
              "given up regardless. The ground comes back and the last fresh divisions " +
              "in France are spent taking what was going to be evacuated." },
        ],
      },
      {
        id: "hold",
        label: "Hold the reserve and let the offensives exhaust themselves",
        advisor: { name: "Petain", position:
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
          "taking it was the thing declined.",
      },
    ],
  },

  // ---------------------------------------------------------------- endings
  gqg_end_victory: {
    year: 1918, date: "1918-11-11", city: "Compiegne",
    title: "The Ten Departments",
    advisors: ["foch", "clemenceau"],
    situation:
      "The armistice is signed in a railway carriage in the forest at Compiegne and " +
      "the occupied departments come back. That was the war aim from the first week " +
      "and it has been achieved, and there is no version of this morning that feels " +
      "like the word victory is doing honest work.\n\n" +
      "The ledger is not a thing to be softened here and will not be. The generation " +
      "that held Verdun and would not attack in 1917 and attacked in 1918 is the " +
      "generation that is not coming back.",
    ending: { family: "victory-that-does-not-feel-like-one", badge: BADGES.SETTLED },
    epilogue: (flags) =>
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
      "1918 command: " + (flags.gqg_command1918 === "national" ? "national throughout." : "unified from March."),
  },

  gqg_end_armybreaks: {
    year: 1918, date: "1918-06-01", city: "Compiegne",
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
      "deliberately kept narrow. Removing half of that pairing is the counterfactual, " +
      "and the evidence points where this ending points.",
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
      "involved could see what refusing it would cost.",
  },

  gqg_end_costlier: {
    year: 1918, date: "1918-11-11", city: "Compiegne",
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
      "difference is measured in the only currency that has been counted here.",
  },

  gqg_end_intact: {
    year: 1918, date: "1918-11-11", city: "Compiegne",
    title: "An Army That Was Kept",
    advisors: ["petain", "foch"],
    situation:
      "The army that stands at the armistice was rebuilt after 1917 rather than " +
      "merely disciplined, was not spent to prove points in the autumn, and was " +
      "committed once, at the right moment, under a command that could move it.\n\n" +
      "The departments come back. So do more of the men who took them, and that is the " +
      "whole of what was available to be won here.",
    ending: { family: "victory-with-the-army-preserved", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The outcome of the war was not in the gift of this headquarters " +
      "by 1918. What the ledger looked like at the end of it was.",
  },

  gqg_end_defensive: {
    year: 1918, date: "1918-11-11", city: "Chantilly",
    title: "Waiting Correctly",
    advisors: ["petain"],
    situation:
      "The German offensives stopped without being counterattacked, which is what they " +
      "were going to do. The reserve was preserved, the line held, and the initiative " +
      "was left where it lay.\n\n" +
      "It was not wrong. The army is intact and the front is unbroken and the argument " +
      "for waiting was sound every single time it was made. The war simply goes on " +
      "being fought by whoever is willing to start something.",
    ending: { family: "defensive-into-1919", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Husbanding an army is a defensible doctrine and this is what it " +
      "produces when nobody spends it.",
  },

  gqg_end_negotiated: {
    year: 1917, date: "1917-08-01", city: "Paris",
    title: "The Conversation Nobody Was Allowed to Have",
    advisors: ["painleve"],
    situation:
      "With the army in open indiscipline and the Chamber told none of it, an approach " +
      "is made. It is made from a country holding a line it can hold, with ten " +
      "departments still under occupation, which is the whole difficulty: any terms " +
      "available now leave some of France where it currently is.\n\n" +
      "That is why this was never seriously attempted. It is not that nobody thought of " +
      "it.",
    ending: { family: "earlier-negotiated-outcome", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. No French government of 1917 could have signed terms leaving the " +
      "occupied departments in German hands and survived the signing.",
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
      "Speculative. The historical German offensives came near enough to Paris to be " +
      "shelled from range and no nearer. What kept them there was reserves committed " +
      "at moments somebody chose.",
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
      "Command in a republic is held on terms. The terms were always the casualty list.",
  },
};

