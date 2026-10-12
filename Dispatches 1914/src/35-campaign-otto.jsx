// =============================================================================
// OTTOMAN GENERAL STAFF — HISTORICAL SPINE
// =============================================================================
//
// The campaign's identity (spec §2.6): an empire fighting in more places than it can supply, with
// German officers and matériel in place of a German command. The structural question is the periphery
// against the core. Each commitment beyond what the railways and the stores can carry is tagged for
// hard mode (overextend).
//
// RESEARCH GATES. The Rumi calendar: the Rumi was the Julian calendar with the year counted from
// 1 March (and numbered from the Hijra, Gregorian year less 584 from March to December), thirteen
// days behind the Western calendar until it was realigned with it on 1 March 1917. This file gives
// Western dates throughout and the Rumi date once, at the first mention (otto_1914_02_blacksea). It
// has NOT been confirmed what the General Staff itself dated its documents in, so the file says only
// that the state used the calendar. The sourcing: claims/otto.json, built from the sources in
// claims/sources.json; most positions are `drafted` and are for the fact-check.
//
// SPEC §9. The Armenian genocide is narrated as settled fact in the node for 24 April 1915 and again
// in the closing epilogue. It is never a choice, a flag or a meter effect; no order in the file can
// prevent it; and the command the player holds bears responsibility for it. See the PR that added
// this file for the handling, which is for the author's review.
// =============================================================================

CAMPAIGNS.otto.startNode = "otto_1914_04_offer";

CAMPAIGNS.otto.commanders = [
  { id: "enver", name: "Enver Pasha", title: "Minister of War and Deputy Commander-in-Chief",
    from: "1914-07-29", to: "1918-10-13" },
  { id: "izzet", name: "Ahmed Izzet Pasha", title: "Grand Vizier and Minister of War",
    from: "1918-10-14", to: "1918-11-08" },
];

CAMPAIGNS.otto.advisors = [
  { id: "enver", name: "Enver", from: "1914-07-29", to: "1918-10-13",
    dossier: { role: "Minister of War from January 1914; Deputy Commander-in-Chief",
      bio: "The architect of the German alliance and of the empire's entry into the war. Ordered the raid on the Russian Black Sea ports, planned and took command of the winter offensive at Sarikamis, and later sent the Army of Islam into the Caucasus. After Sarikamis he blamed the Armenians for the defeat.",
      fate: "Dismissed as Minister of War in October 1918. Left Constantinople on 1 or 2 November aboard a German submarine. Killed in Central Asia on 4 August 1922." } },
  { id: "liman", name: "Liman von Sanders", from: "1914-07-29", to: "1918-10-30",
    dossier: { role: "German general at the head of the military mission; commander of the Fifth Army at Gallipoli; commander of the Yildirim Army Group from February 1918",
      bio: "Held the Fifth Army's reserve inland at Gallipoli, ready to be moved to wherever the Allies landed. In September 1918 he refused the Eighth Army leave to withdraw before the attack in Palestine. His headquarters at Nazareth was overrun on 20 September and he escaped.",
      fate: "Handed the army group to Mustafa Kemal at the end of October 1918." } },
  { id: "djemal", name: "Djemal", from: "1914-07-29", to: "1918-10-14",
    dossier: { role: "Minister of the Navy; commander of the Fourth Army in Syria",
      bio: "Held military and civil power in Syria from 1915 and led the first attack on the Suez Canal. Later he favoured reinforcing Sinai and Palestine over the plan to retake Baghdad.",
      fate: "Left office when the Talat cabinet resigned in October 1918 and fled the country. Assassinated in Tbilisi on 21 July 1922." } },
  { id: "kemal", name: "Mustafa Kemal", from: "1915-02-01", to: "1918-11-07",
    dossier: { role: "Division commander at Gallipoli; commander of the Seventh Army in Palestine in 1918",
      bio: "Commanded the 19th Division at Gallipoli and believed the defenders were spread too thin. At the end of the war he commanded the Seventh Army in Palestine and withdrew it from Nablus in September 1918.",
      fate: "Commanded the Yildirim Army Group from the end of October 1918 until it was dissolved. Became the first President of the Turkish Republic in 1923 and died in 1938." } },
  { id: "falkenhayn", name: "Falkenhayn", from: "1917-05-07", to: "1918-02-24",
    dossier: { role: "German general; commander of the Yildirim Army Group, 1917-1918",
      bio: "The former German Chief of the General Staff. Came to Constantinople in May 1917 to organise an army group for the recapture of Baghdad, warned that the Sinai front had to be secured first, and in September 1917 redirected the group to Palestine.",
      fate: "Replaced by Liman von Sanders in February 1918. Died in 1922." } },
  { id: "kress", name: "Kress von Kressenstein", from: "1914-11-18", to: "1917-12-31",
    dossier: { role: "Bavarian colonel; chief of staff of the VIII Corps and the Fourth Army; commander of the Eighth Army in 1917",
      bio: "Arrived in Palestine on 18 November 1914 and planned the crossing of Sinai. Called the attack on the Suez Canal a forcible reconnaissance. Commanded the Eighth Army in the retreat from Gaza.",
      fate: "Relieved by Djevad Pasha at the end of November 1917." } },
  { id: "fakhri", name: "Fakhri Pasha", from: "1916-06-01", to: "1919-01-10",
    dossier: { role: "Commander of the Ottoman garrison at Medina",
      bio: "Held Medina against the Arab revolt and the raids on the Hejaz railway for more than two years. Refused to surrender the city after the armistice of Mudros.",
      fate: "Arrested on 10 January 1919, 72 days after the armistice, after the British had bribed some of his soldiers. The garrison, about 8,000 men, was taken to Egypt." } },
  { id: "izzet", name: "Ahmed Izzet Pasha", from: "1918-10-14", to: "1918-11-08",
    dossier: { role: "Grand Vizier and Minister of War, 14 October to 8 November 1918",
      bio: "A soldier who had been Minister of War in 1913 and had commanded the armies in the Caucasus. Formed the government that signed the armistice of Mudros, and kept the ministry of war for himself.",
      fate: "Dismissed on 8 November 1918 after a term of 25 days. Died in Constantinople in 1937." } },
];

CAMPAIGNS.otto.bulletinVoice = {
  source: "Communique of the Ottoman Headquarters, as printed in the Constantinople press",
  register: "Terse and confident; reverses become 'withdrawals to prepared positions', and the German ally is named as a comrade-in-arms",
  defined: true,
};

CAMPAIGNS.otto.hardMode.forcedEndingId = "otto_end_overextended";
CAMPAIGNS.otto.hardMode.erosionMax = 4;
CAMPAIGNS.otto.researchGate = { open: false, note: "Sourcing checked node by node against English-language sources (claims/otto.json). The Rumi dating of the General Staff itself is the part left open: see the note in CALENDARS.rumi." };
CAMPAIGNS.otto.blockingIssue = { resolved: true, ref: "DISPATCHES_1918_DESIGN_SPEC.md §9 (resolved: narrated as settled fact in otto_1915_02_gallipoli and the epilogues; never a choice, flag or meter effect)" };

CAMPAIGNS.otto.nodes = {

  // ---------------------------------------------------------------- 1914-08
  otto_1914_04_offer: {
    year: 1914, date: "1914-07-29", city: "Constantinople",
    title: "The Offer from Berlin",
    advisors: ["enver", "djemal"],
    situation:
      "A week ago Enver, the Minister of War, proposed an alliance to the German ambassador, and " +
      "the ambassador has telegraphed Berlin. Austria-Hungary is at war with Serbia, and Russia " +
      "is beginning to mobilise. The empire is poor, its army is half rebuilt after the Balkan wars, " +
      "and not one of the great powers has promised to guarantee its frontiers.\n\n" +
      "Only a handful of ministers know of the offer, and the cabinet has not met. The " +
      "treaty that Germany has drafted is a defensive one, and it commits the empire to fight " +
      "beside Germany if Russia attacks her.",
    context:
      "An alliance with the strongest army in Europe is a protection the empire cannot buy " +
      "anywhere else. It is also a promise to go to war on the word of another government, and " +
      "the army that would have to keep it is not ready.",
    choices: [
      {
        id: "sign",
        label: "Sign the alliance with Germany, and keep the empire neutral in public until the army is ready",
        historical: true,
        advisor: { name: "Enver", position:
          "The empire has no friend among the Entente, and Germany is the one power that will give it arms and officers. A treaty is the price of being armed, and it can be kept secret while the army mobilises." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { otto_offer: "signed" },
        next: "otto_1914_01_straits",
        outcome:
          "The treaty is signed in secret in the first days of August, by the Grand Vizier and the " +
          "German ambassador, and a few ministers know of it. The empire ordered a general " +
          "mobilisation on the 2nd and declared its neutrality on the 3rd. Germany has an ally " +
          "that cannot yet fight, and the empire has a promise from the strongest army in Europe " +
          "that it will be protected, and a promise of its own that it will fight.",
      },
      {
        id: "delay",
        label: "Hold off for a week, until more of the army is mobilised, and then decide",
        advisor: { name: "Djemal", position:
          "The army is not ready, and a treaty signed now binds the empire to a war that it cannot fight. A week of mobilisation changes what the empire is worth to Germany, and what it can demand." },
        gate: (m) => m.will >= -2,
        disabledReason: "Berlin has been told that the cabinet has agreed, and the ambassador has asked for the signature",
        impact: { manpower: 0, munitions: 0, will: -1 },
        dispute:
          "Whether Germany would have waited, and whether it would have given more for an ally that was " +
          "better armed, is argued. The ambassador was pressing for a signature, and the German " +
          "general staff wanted the empire in the war as soon as it could be got.",
        uncertain: [
          { weight: 50, title: "Berlin agrees to wait",
            impact: { manpower: 0, munitions: 0, will: 0 },
            setFlags: { otto_offer: "late" },
            next: "otto_1914_01_straits",
            outcome:
              "Speculative. The ambassador telegraphs that the empire needs a week, and Berlin, which " +
              "has other things to think about, agrees. The treaty is signed on 6 August, with the " +
              "mobilisation a good deal further advanced, and the empire has had a few days in which " +
              "it was not committed to anything. The Germans have not forgotten that it hesitated." },
          { weight: 50, title: "Berlin takes the delay for a refusal",
            impact: { manpower: 0, munitions: -1, will: -1 },
            setFlags: { otto_offer: "worse" },
            next: "otto_1914_01_straits",
            outcome:
              "Speculative. The ambassador tells Berlin that the empire cannot be counted on, and " +
              "Berlin, which has been waiting for an answer, makes its promises thinner. The treaty is " +
              "signed on 5 August with fewer German guns promised than were offered a week " +
              "before, and Enver, who asked for time to be better armed, has less to arm with." },
        ],
      },
      {
        id: "entente",
        label: "Ask Britain, France and Russia what they would guarantee, before signing anything",
        advisor: { name: "Djemal", position:
          "Djemal has friends in Paris, and the empire's debt is held there. An offer from the Entente to guarantee its frontiers would cost it nothing, and would show what Germany is worth." },
        gate: (m) => m.will >= -2,
        disabledReason: "The ambassador has told Berlin that the empire will sign, and Berlin has told the Kaiser",
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { otto_offer: "entente" },
        next: "otto_1914_01_straits",
        outcome:
          "Speculative. An envoy goes to the three Entente embassies to ask what they would give for " +
          "the empire's neutrality, and the answer is slow and conditional. The ambassador in " +
          "Constantinople hears of the approach, and Berlin presses harder. The treaty is " +
          "signed on 4 August, before the Entente has answered, and it has been shown that the empire " +
          "was willing to listen to both sides.",
      },
    ],
  },

  otto_1914_01_straits: {
    year: 1914, date: "1914-08-10", city: "Constantinople",
    title: "Two Ships at the Dardanelles",
    advisors: ["enver", "djemal"],
    situation: (flags) =>
      "The empire has a secret alliance with Germany, signed " +
      (flags.otto_offer === "late"
        ? "on 6 August, after a week's delay"
        : flags.otto_offer === "worse"
        ? "on 5 August, with fewer German promises than were first offered"
        : flags.otto_offer === "entente"
        ? "on 4 August, before the Entente had answered"
        : "on 1 August") +
      ", and a declaration " +
      "of neutrality made on the 3rd. It ordered a general mobilisation on the 2nd, which " +
      "will take about four weeks. The German battle cruiser Goeben and the light cruiser " +
      "Breslau are off the Dardanelles and have asked to be let in.\n\n" +
      "The cabinet voted unanimously on 6 August to open the Straits to them. On the 9th the " +
      "Grand Vizier asked Berlin to pretend that the Goeben had been sold to the Ottoman " +
      "navy, so that her entry would look like a purchase; Berlin refused. The ships are " +
      "waiting for an answer.",
    context:
      "A neutral state that lets a belligerent's warships pass its Straits has stopped being " +
      "neutral, and the Entente will say so. The empire's debt of about 716 million dollars " +
      "is held mostly in France, and its navy cannot match the Greek one. Two modern ships " +
      "with trained crews are worth a great deal to an empire that has neither.",
    choices: [
      {
        id: "admit",
        label: "Open the Straits to the Goeben and the Breslau and take them into the navy",
        historical: true,
        advisor: { name: "Enver", position:
          "The alliance has to be given something to show for itself, and two ships that the navy cannot buy are the most that Berlin can send quickly." },
        impact: { manpower: 0, munitions: 1, will: -1 },
        setFlags: { otto_straits: "admitted" },
        next: "otto_1914_02_blacksea",
        outcome:
          "Enver authorises the entry on 10 August and the ships reach Constantinople on " +
          "the 11th. On the 16th they are commissioned in the Ottoman navy as the Yavuz Sultan " +
          "Selim and the Midilli, with their German crews now in Ottoman uniform. The Entente " +
          "asks how a neutral state has bought two warships in a week. The empire has a fleet " +
          "and a German admiral, and the neutrality it declared a week ago no longer means " +
          "very much to anyone.",
      },
      {
        id: "refuse",
        label: "Refuse the ships entry to the Straits and keep the neutrality",
        advisor: { name: "Djemal", position:
          "The army is not mobilised and the Entente can reach Constantinople by sea. An empire that has not yet chosen should not take the ships of the side it has not yet joined." },
        gate: (m) => m.will >= -3,
        disabledReason: "The cabinet has voted to open the Straits, and Berlin has been told so",
        impact: { manpower: 1, munitions: -1, will: 0 },
        setFlags: { otto_straits: "closed" },
        next: "otto_1914_02_blacksea",
        outcome:
          "Speculative. The Straits stay shut to the German ships, which turn away into the " +
          "Aegean or are held in the Dardanelles under guard. Berlin, which signed an alliance " +
          "with the empire a week ago, is told that it will be neutral until it has been paid " +
          "for. The Entente's ambassadors are polite. Neither side has been given a reason to " +
          "trust the neutrality. It has bought a few weeks, and nothing that would make them safe.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-10
  otto_1914_02_blacksea: {
    year: 1914, date: "1914-10-25", city: "Constantinople",
    title: "An Order Given in Secret",
    advisors: ["enver", "liman"],
    bulletin: {
      voice: "otto", date: "1914-10-24", source: "Communique of the Ottoman Headquarters",
      text:
        "The fleet continues its exercises in the Black Sea. The troops have completed " +
        "their concentration in the provinces. All is quiet on the frontiers.",
    },
    situation:
      "On 25 October, which the Rumi calendar of the state's papers dates as 12 Tesrinievvel " +
      "1330, it is twelve weeks since the empire mobilised and declared its neutrality. The " +
      "Ottoman official calendar is the Julian one, thirteen days behind the Western, with " +
      "the year counted from 1 March. This file gives Western dates.\n\n" +
      "Three days ago Enver issued a secret order to attack the Russian navy without a " +
      "declaration of war, and today he has told Admiral Souchon, who commands the fleet, to " +
      "attack if a suitable opportunity arises. The cabinet, the Grand Vizier among them, has " +
      "not been told. The Germans want the war opened now, while the Russian fleet in the " +
      "Black Sea is unready.",
    context:
      "A declaration of war would need the cabinet. An attack by a squadron at sea needs " +
      "only an admiral. Once the first shell is fired at a Russian port the cabinet's views " +
      "will no longer matter, and Enver knows it.",
    choices: [
      {
        id: "raid",
        label: "Let the fleet go into the Black Sea and attack the Russian navy and its ports",
        historical: true,
        advisor: { name: "Enver", position:
          "Russia will come in with the Entente whatever the cabinet decides. The fleet should strike while it can, with German officers and German ships, and before the Russians are ready." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { otto_blacksea: "raid" },
        next: "otto_1914_03_sarikamis",
        outcome:
          "On the morning of 29 October the squadron shells Sevastopol, Theodosia and Odessa, " +
          "and mines are laid off Novorossiysk. Russia declares war on 1 November, and " +
          "Britain and France on the 5th. The Grand Vizier and the finance minister, Cavit, " +
          "protest to Enver that it was a provocation, and several ministers offer to " +
          "resign. The empire has gone to war by the act of one minister and one German admiral, " +
          "and the rest of the government is left to catch up.",
      },
      {
        id: "hold",
        label: "Keep the fleet in the Bosphorus and put the Entente's offers to the cabinet",
        advisor: { name: "Liman von Sanders", position:
          "The army is not ready and the winter is coming. A war begun by an admiral's raid is a war begun at the Germans' hour, and not at the empire's." },
        gate: (m) => m.will >= -3,
        disabledReason: "Berlin has been promised action, and the minister of war has given his order",
        impact: { manpower: 1, munitions: 0, will: 0 },
        setFlags: { otto_blacksea: "held" },
        next: "otto_1914_03_sarikamis",
        outcome:
          "Speculative. The fleet stays at its moorings and Enver's order is not carried out. " +
          "The Germans, who have lent the officers and the guns, are told to wait. The Entente " +
          "offers what it can, and a promise to respect the empire's territory is among it. " +
          "At the end of October the empire is still neutral, in a Europe where neutrality " +
          "has no friends. The war reaches it all the same, a little later and on a day " +
          "that is not chosen in Berlin.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-12
  otto_1914_03_sarikamis: {
    year: 1914, date: "1914-12-18", city: "Constantinople",
    title: "The Envelopment in the Snow",
    advisors: ["enver", "liman"],
    situation:
      "The Third Army holds the frontier with Russia in the high country round Erzurum, " +
      "and the Russians have a railway to within about 24 kilometres of the border at " +
      "Sarikamis. Enver has a plan to destroy the Russian Caucasus Army in one stroke: the " +
      "XI Corps is to hold the Russians in place, and the X and IX Corps, some 68,000 men " +
      "between them, are to cross the mountains by night and fall on their flank and rear.\n\n" +
      "The mountains are 1,500 to 2,000 metres high and it is the middle of December. The " +
      "men have no winter clothing and are to carry dry bread and olives. The Third Army's " +
      "commander, Hasan Izzet, has told Enver he doubts the plan and asked on the 18th to " +
      "be relieved. Enver has said that he will command it himself.",
    context:
      "The plan is a good one on a map and was drawn up from German principles. Everything " +
      "that can go wrong with it is a matter of weather and supply, and the weather " +
      "will not be consulted. The alternative is to wait for the Russians in the fortress " +
      "line at Erzurum, which means leaving the winter to them.",
    choices: [
      {
  id: "launch",
  label: "Take command and send the X and IX Corps over the mountains",
  historical: true,
  advisor: { name: "Enver", position:
    "The Russians do not expect an attack in the snow, and an army that has not yet fought needs a victory. It is the only way to destroy their army, not just to hold it off." },
  impact: { manpower: -3, munitions: 0, will: -1 },
  erodes: "overextend",
  setFlags: { otto_sarikamis: "launched" },
  dispute:
    "Historians differ on whether the plan at Sarikamis could have succeeded. Some " +
    "hold that it was impossible in that season and on that ground. Others point to " +
    "the confusion of the Russian command in the first days, when one corps " +
    "commander wanted to fall back on Kars, and argue that better preparation " +
    "might have turned a near thing into a victory.",
  uncertain: [
    { weight: 80, title: "The columns are caught in the snow", historicalBranch: true,
      impact: { manpower: -3, munitions: 0, will: -1 },
      next: "otto_1915_01_suez",
      outcome:
        "The offensive begins on 22 December. A snowstorm on the 25th and 26th catches the " +
        "columns on the heights and the Russians hold Sarikamis. On 4 January the IX Corps " +
        "surrenders, and the X Corps withdraws that night. Enver leaves the army in the " +
        "second week of January. Estimates of the army's losses run from 30,000 to 80,000, " +
        "most of them from cold and disease and many from typhus in the hospitals. " +
        "The Third Army has ceased to be able to attack anywhere." },
    { weight: 20, title: "The Russians give up Sarikamis, and the army freezes on the heights",
      impact: { manpower: -2, munitions: 0, will: 1 },
      next: "otto_1915_01_suez",
      outcome:
        "Speculative. The columns reach the heights above the railway before the storm " +
        "and find the town thinly held. The Russian corps commander wants to fall back " +
        "on Kars, and for two days the army group that was to be destroyed is leaving. " +
        "Then the storm closes the passes, the cold takes the columns, and the Russian " +
        "reserves come up by rail. The army has won a few days and a town, and has " +
        "paid for both with half the men it took into the snow." },
  ],
},
      {
        id: "wait",
        label: "Hold the Erzurum line through the winter and let the Russians come to it",
        advisor: { name: "Liman von Sanders", position:
          "An army that goes into the mountains in December without winter clothing will lose its men to the weather before it meets an enemy. The fortress line costs nothing to hold." },
        gate: (m) => m.will >= -3,
        disabledReason: "Enver has staked his name on the plan and has taken the command",
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { otto_sarikamis: "held" },
        next: "otto_1915_01_suez",
        outcome:
          "Speculative. The Third Army stays in the fortress line and no one marches. The " +
          "Russians, who have a railway and winter clothing, do not attack in the snow either. " +
          "The empire's army is smaller than it ought to be in January 1915 and not nearly as " +
          "small as it would have been after the mountains. Enver, who wanted a victory, " +
          "has none to show for the winter, and the Germans have to be told why.",
      },
      {
        id: "postpone",
        label: "Postpone the offensive until the corps can be given winter clothing, boots and proper rations",
        advisor: { name: "Liman von Sanders", position:
          "A month spent on boots and bread is cheap against an army lost in the snow. The plan will keep, and the Russians will not expect it later either." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { otto_sarikamis: "postponed" },
        next: "otto_1915_04_clothing",
        outcome:
          "Speculative. Enver agrees to a month. The quartermasters are given until the middle " +
          "of January to find coats, boots and mules, and the staff is told to plan again for " +
          "the corps that will march. The Russians, who read a calendar as well as anybody, " +
          "use the same weeks to bring up a corps by the railway. The Third Army will be " +
          "better fit to march and the plan harder to surprise, and Enver has to say why a " +
          "victory has been put off.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-01 (a detour: a month for the boots)
  otto_1915_04_clothing: {
    year: 1915, date: "1915-01-12", city: "Constantinople",
    title: "A Month for the Boots",
    advisors: ["enver", "liman"],
    situation:
      "The offensive has been put off, and the month has been spent. The X and IX Corps " +
      "have winter coats and boots, rations that are more than dry bread and olives, and " +
      "mules for the mountain tracks. The staff has planned again for the passes the " +
      "columns will use.\n\n" +
      "The Russians have used the month as well. A new corps has come up by the railway " +
      "to Sarikamis, and their patrols have been found on the tracks that the plan " +
      "needs. The month has made the army better fit to march and the plan harder to " +
      "surprise.",
    context:
      "A plan that depends on surprise loses what it depends on when it is delayed, and " +
      "gains what an army needs to march at all. Which matters more in the high country in " +
      "January is not something that can be settled from a map.",
    choices: [
      {
        id: "hold",
        label: "Cancel the offensive and hold the Erzurum line with an army that has been clothed and fed",
        historical: true,
        advisor: { name: "Liman von Sanders", position:
          "The Russians have reinforced, and the surprise is gone. An army that is clothed and fed behind its own forts is worth more than a doubtful attack." },
        impact: { manpower: 1, munitions: 0, will: -1 },
        next: "otto_1915_01_suez",
        outcome:
          "Speculative. The offensive is given up and the Third Army stays in the fortress " +
          "line. It is the best-equipped army the empire has in the east and it is not " +
          "asked to do anything. The Russians, who have a railway and winter clothing, " +
          "do not attack in the snow either. Enver, who wanted a victory, has none to " +
          "show for the winter, and the Germans are told that the army is intact.",
      },
      {
        id: "go",
        label: "Go over the mountains in January on the original plan, with the corps clothed and fed",
        advisor: { name: "Enver", position:
          "The army that went in December would have been lost to the cold. The army that goes now is clothed. The plan is the same plan, and the Russians still do not expect it." },
        impact: { manpower: -2, munitions: 0, will: 0 },
        dispute:
          "Historians differ on whether the Sarikamis plan could have succeeded with " +
          "better preparation or was impossible in the season and on the ground. Russian " +
          "accounts stress the confusion of their own command in the first days, " +
          "Ottoman accounts the weather. A delay of a month would have helped the " +
          "marching and the Russians equally.",
        uncertain: [
          { weight: 40, title: "The columns reach the heights above the railway",
            impact: { manpower: -2, munitions: 0, will: 2 },
            next: "otto_1915_01_suez",
            outcome:
              "Speculative. The columns, clothed and fed, cross the mountains by night and " +
              "reach the heights above Sarikamis, where the Russian line has been thinned " +
              "to feed the corps that came up by rail. The battle that follows is not the " +
              "destruction of an army. It is a hard fight in the snow that the Russians " +
              "lose by a little, and the Third Army has its victory at the price of a " +
              "third of its men." },
          { weight: 60, title: "The Russians are forewarned and hold the passes",
            impact: { manpower: -1, munitions: 0, will: -1 },
            next: "otto_1915_01_suez",
            outcome:
              "Speculative. The columns find the passes held and the patrols that the " +
              "plan feared. The attack is made and stopped in the high ground, with fewer " +
              "men lost to the cold than in the record and more to the Russian guns. The " +
              "army withdraws in order to the Erzurum line, clothed and fed, and Enver " +
              "has the defeat the plan always risked, at a lower price." },
        ],
      },
      {
        id: "olti",
        label: "Use the month to strengthen the Third Army and attack the Russian left at Olti instead",
        advisor: { name: "Enver", position:
          "The railway is where the Russians are strong. Their left on the Olti road has no railway and no winter clothing, and an army that is clothed can reach it." },
        impact: { manpower: -1, munitions: 0, will: 0 },
        next: "otto_1915_01_suez",
        outcome:
          "Speculative. The Third Army moves north against the Russian left in the " +
          "country round Olti, away from the railway and the corps that came up by it. The " +
          "attack takes ground, and the Russians have to turn to meet it. It is not the " +
          "envelopment that was planned in December, and it is not the disaster either. " +
          "The army has a limited success in the mountains and the Russians a " +
          "reason to look to their left.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-01
  otto_1915_01_suez: {
    year: 1915, date: "1915-01-20", city: "Damascus",
    title: "A Reconnaissance in Force",
    advisors: ["djemal", "kress"],
    situation: (flags) =>
      "The Fourth Army has gathered about 20,000 men in southern Palestine for an attack on " +
      "the Suez Canal. The plan was drawn up by the army commander, Zeki Pasha, and is " +
      "backed by Djemal, who commands in Syria. The Bavarian colonel Kress von Kressenstein, " +
      "who has been chief of staff of the VIII Corps since November, has laid out the route: " +
      "three columns across Sinai, the main body by the middle road from Beersheba toward " +
      "Ismailia. It will take ten days, with water at the wells and nothing else on the way.\n\n" +
      "The British have 30,000 men on the canal and a number of aeroplanes. The hope behind " +
      "the plan is that a blow at the canal will bring Egypt out against the British." +
      (flags.otto_sarikamis === "postponed"
        ? "\n\nThe Third Army has spent a month in the Erzurum line being clothed and fed, and the " +
          "winter offensive in the Caucasus has been settled one way or the other. The empire's " +
          "attention is turning south."
        : ""),
    context:
      "The canal is the road to India and the object of the whole attack. An army that " +
      "reaches it at the end of a supply line of that length can do very little once there. " +
      "Kress himself thinks of it as a forcible reconnaissance, and not an invasion.",
    choices: [
      {
  id: "attack",
  label: "Send the force across Sinai and attempt to cross the canal",
  historical: true,
  advisor: { name: "Djemal", position:
    "Egypt is where the British are weakest and where a blow draws their troops from Europe. An attack on the canal is the only thing the empire can do for the alliance in the south." },
  impact: { manpower: -1, munitions: -1, will: -1 },
  setFlags: { otto_suez: "attacked" },
  dispute:
    "Kress von Kressenstein thought of the attack as a forcible reconnaissance and " +
    "not an invasion, while Djemal spoke of it as a blow that would raise Egypt. How " +
    "near the force came to establishing a bridgehead, and what it would have done " +
    "with one, is argued. The British knew of the advance from aeroplanes and " +
    "from local reports for days before the attack.",
  uncertain: [
    { weight: 85, title: "The pontoons are destroyed and the force withdraws", historicalBranch: true,
      impact: { manpower: -1, munitions: -1, will: -1 },
      next: "otto_1915_02_gallipoli",
      outcome:
        "The columns reach the canal on 2 February, after being followed by aeroplanes " +
        "for much of the march. On the morning of the 3rd the pontoons are fired on and " +
        "destroyed, and only two companies cross. The force withdraws that evening. Its " +
        "losses are about 1,500, including 716 prisoners, against about 150 for the " +
        "British. The uprising in Egypt, which the plan counted on, does not come. " +
        "The empire has shown the British where it can be threatened." },
    { weight: 15, title: "A bridgehead is held for a day",
      impact: { manpower: -2, munitions: -1, will: 1 },
      next: "otto_1915_02_gallipoli",
      outcome:
        "Speculative. A battalion gets across at the Tussum post on the morning of the " +
        "3rd and holds the east bank of the canal until dark. The British shell it " +
        "from the water and from the ships, and it is withdrawn at night with its " +
        "dead. It is not a crossing. The empire can say that its flag stood on the " +
        "canal for a day, and the British have to ask how many more battalions will " +
        "come." },
  ],
},
      {
        id: "keep",
        label: "Keep the Fourth Army in Palestine and Syria and send a division to the Caucasus",
        advisor: { name: "Kress von Kressenstein", position:
          "A force that arrives at the canal at the end of ten days with no water and no reserve is a force that has been used up in coming. The Fourth Army is worth more as a threat than as an attack." },
        gate: (m) => m.munitions >= -3,
        disabledReason: "Berlin has been told that the canal will be attacked, and the guns are already at Beersheba",
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { otto_suez: "kept" },
        next: "otto_1915_02_gallipoli",
        outcome:
          "Speculative. The Fourth Army stays where it is and the British on the canal are " +
          "left to wonder what it intends. The 30,000 men and the aeroplanes stay on guard and " +
          "are not sent anywhere else. The Ottoman force is not diminished by the march, " +
          "and Djemal, who has been promised an operation, has to explain to Enver " +
          "and to Berlin why there has not been one.",
      },
      {
        id: "raid",
        label: "Send a small column of a few thousand to raid the canal, and keep the main body at Beersheba",
        advisor: { name: "Kress von Kressenstein", position:
          "A raid costs a few thousand men and shows the British what the empire can do. The main body is kept for the day it is needed." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { otto_suez: "raided" },
        next: "otto_1915_02_gallipoli",
        outcome:
          "Speculative. A column of a few thousand crosses Sinai and fires on the canal and " +
          "the ships on it, and falls back before the British can come out to meet it. The " +
          "main body stays at Beersheba and loses no men to the march. The British know " +
          "that the empire can reach the canal, and they keep their divisions there. The " +
          "alliance has been shown a gesture and not an attack, and Djemal is asked what " +
          "a gesture cost.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-04
  otto_1915_02_gallipoli: {
    year: 1915, date: "1915-04-24", city: "Constantinople",
    title: "Where the Landing Comes",
    advisors: ["liman", "kemal"],
    bulletin: {
      voice: "otto", date: "1915-03-19", source: "Communique of the Ottoman Headquarters",
      text:
        "Yesterday the enemy fleet attempted to force the Straits and was repulsed by " +
        "our batteries. Several of his ships were sunk or damaged.",
    },
    situation: (flags) =>
      "On 18 March the Allied fleet attacked the Narrows and lost three battleships, most " +
      "of them to a field of mines laid ten days earlier by the minelayer Nusret. " +
      (flags.otto_suez === "attacked"
        ? "The force that crossed Sinai in January is back in Palestine, smaller than it left. "
        : "The Fourth Army is still whole in Palestine. ") +
      "An army is now gathering in Egypt and on Lemnos for a landing.\n\n" +
      "The Fifth Army, under the German general Liman von Sanders, has five divisions and a " +
      "sixth on the way, some 60,000 men. About a third of them are on the Asiatic shore, " +
      "two divisions are at Bulair at the neck of the peninsula, and the rest, with the 19th " +
      "Division of Mustafa Kemal, are inland as a reserve to be moved to wherever the " +
      "Allies land. Kemal, and others, think the beaches are too thinly held.\n\n" +
      "On the night of 23 to 24 April, in Constantinople, the government begins the arrest " +
      "of hundreds of Armenian political and community leaders, in the capital and across " +
      "the empire. It is the start of the deportations and the massacres in which about a " +
      "million Armenians would die: a genocide. The Ministry of the Interior under Talat and the " +
      "party that rules the empire direct it, and units of the army take part. It is the " +
      "same government that is deciding how to meet the landings. The command whose file this " +
      "is bears its share of the responsibility, and nothing in the choices below can touch " +
      "it, because the office never offered one.",
    context:
      "Sanders can keep his reserve far from the beaches, so that it is not destroyed by " +
      "the fleet's guns and can reach the landing wherever it comes. That depends on " +
      "moving men and orders quickly over bad roads, and on the commander being where he " +
      "is needed. The other course is to put the divisions on the heights above every beach.",
    choices: [
      {
        id: "reserve",
        label: "Keep the reserve inland and move it to the landing when it comes",
        historical: true,
        advisor: { name: "Liman von Sanders", position:
          "No one knows where the landing will come. A mobile reserve can meet it anywhere. Divisions on every beach would be defeated one at a time." },
        impact: { manpower: -1, munitions: -1, will: 1 },
        keyBattleSubgame: { id: "gallipoliOttoman" },
        dispute:
          "Whether a different placement would have beaten the landings is argued. Liman von " +
          "Sanders kept most of the Fifth Army inland and was himself at Bulair on the first " +
          "day, which disrupted the chain of command. Mustafa Kemal and others thought the " +
          "army too dispersed. The landings were contained at a heavy cost, and how near they " +
          "came to breaking the defence is something the accounts do not agree on.",
        uncertain: [
          { weight: 88, title: "The landings are contained", historicalBranch: true,
            impact: { manpower: -1, munitions: -1, will: 1 },
            setFlags: { otto_gallipoli: "reserve" },
            next: "otto_1915_03_kut",
            outcome:
              "The Allies land at Cape Helles and at Anzac on 25 April. Kemal's 19th Division is " +
              "thrown against the heights above the beach, and the reserves are brought forward as " +
              "they arrive. Within days the landings are contained and the campaign settles " +
              "into trenches that neither side leaves. Each side loses about 250,000 men in " +
              "all. The Allies leave in December and January, and the last of them go on " +
              "9 January 1916." },
          { weight: 12, title: "The landing breaks through to the Narrows",
            impact: { manpower: -3, munitions: -2, will: -3 },
            setFlags: { otto_gallipoli: "reserve" },
            next: "otto_end_straits",
            outcome:
              "Speculative. The reserve reaches the heights too late, and the Allies break out " +
              "from the beach and seize the ground overlooking the forts. Within days their " +
              "guns can command the Narrows from the land. The fleet's mine-sweepers go to work " +
              "on the minefield. The Straits, which the empire had counted on holding, " +
              "are open to the guns of the Allied army within weeks." },
        ],
      },
      {
        id: "forward",
        label: "Put the divisions on the heights above every beach",
        advisor: { name: "Mustafa Kemal", position:
          "The reserve cannot be moved quickly enough over those roads. The divisions should be where the guns will be, on the high ground above the beaches." },
        gate: (m) => m.manpower >= -1,
        disabledReason: "The army does not have the men to hold every beach, and the commander has ordered otherwise",
        impact: { manpower: -2, munitions: -1, will: 0 },
        setFlags: { otto_gallipoli: "forward" },
        next: "otto_1915_03_kut",
        outcome:
          "Speculative. The divisions dig in above the beaches, where the fleet's guns " +
          "can reach them, and the reserve is a good deal smaller than it was. The " +
          "Allies land where they choose, and meet the defenders on the first day with " +
          "nothing behind them to be brought forward. What the landings find is a thin " +
          "front line, and what is behind it is a long way inland.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-12
  otto_1915_03_kut: {
    year: 1915, date: "1915-12-12", city: "Constantinople",
    title: "A British Army Shut Up in a Bend of the Tigris",
    advisors: ["enver"],
    situation:
      "A British Indian division under Townshend has fallen back from Ctesiphon, below " +
      "Baghdad, to the town of Kut, in a bend of the Tigris. The Ottoman Sixth Army, newly " +
      "formed in October under the German field marshal Colmar von der Goltz, has followed it. " +
      "The pursuing force reached Kut on 7 December and has made three attacks on the " +
      "town, and has not taken it.\n\n" +
      "The British garrison numbers somewhere between 8,000 and 13,000 men. A relief " +
      "force is being gathered at Basra. In the west the Allies are leaving Gallipoli, which " +
      "will free the divisions of the Fifth Army, and the Russians are pressing on " +
      "the Third Army in the Caucasus.",
    context:
      "A town that is stormed can be taken in days and at a cost in lives. A town that is " +
      "besieged keeps the army tied to it for as long as the garrison can eat. Either way, " +
      "the divisions that are used at Kut cannot be used in the east, and the east is " +
      "also asking.",
    choices: [
      {
        id: "siege",
        keyBattleSubgame: { id: "kutOttoman" },
        label: "Stop the assaults, build siege lines round Kut and meet the relief force on the river",
        historical: true,
        advisor: { name: "Enver", position:
          "A garrison that cannot be taken cheaply can be starved, and a relief force that has to fight up a river is easier to beat than a town. Mesopotamia must not take the divisions Anatolia needs." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        dispute:
          "Accounts differ on how close the relief came to reaching Kut, and on whether the town " +
          "could have been taken sooner. The British made five attempts between January and " +
          "April and took ground at heavy cost; the Ottoman side held each position until " +
          "the garrison's supplies gave out. How close any of the attempts came is argued.",
        uncertain: [
          { weight: 85, title: "The relief fails and Kut surrenders", historicalBranch: true,
            impact: { manpower: 0, munitions: 0, will: 2 },
            setFlags: { otto_kut: "siege", otto_kutResult: "surrendered" },
            next: "otto_1916_01_erzurum",
            outcome:
              "The British attempts to relieve Kut fail at Sheikh Sa'ad, at the Wadi, at Hanna and " +
              "at Dujaila. Goltz dies of disease about a week before the end. A ceasefire on " +
              "26 April is followed by the surrender on the 29th, after 147 days. About 13,000 " +
              "men go into captivity, a clear Ottoman victory, won " +
              "at the price of a winter." },
          { weight: 15, title: "The relief breaks through",
            impact: { manpower: -1, munitions: -1, will: -1 },
            setFlags: { otto_kut: "siege", otto_kutResult: "relieved" },
            next: "otto_1916_01_erzurum",
            outcome:
              "Speculative. The relief force takes the positions on the Tigris one after the " +
              "other, and reaches the town before the stores are gone. The garrison walks out " +
              "with its arms, and the Sixth Army falls back toward Baghdad with its losses " +
              "unrepaired. The siege, which was to be the winter's victory, ends as another " +
              "retreat on the river, and the empire's army in Mesopotamia is no longer thought " +
              "able to hold what it has." },
        ],
      },
      {
        id: "storm",
        label: "Order a general assault and take Kut before the relief arrives",
        advisor: { name: "Enver", position:
          "Every week at Kut is a week in which the British bring more men up the river. The town should be taken while the garrison is weak and the relief is far away." },
        gate: (m) => m.manpower >= -3,
        disabledReason: "The Sixth Army is too weak to take the town by assault",
        impact: { manpower: -2, munitions: -2, will: 1 },
        setFlags: { otto_kut: "storm" },
        next: "otto_1916_01_erzurum",
        outcome:
          "Speculative. The Sixth Army attacks the town again, in strength and without waiting " +
          "for the siege works. The garrison fights from behind its walls and the attackers " +
          "pay for every house. When Kut falls it is weeks earlier than the siege would have " +
          "taken, and the army that took it is smaller by thousands of men. The relief force " +
          "arrives to find the town in Ottoman hands and has no reason to stay in the bend.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-01
  otto_1916_01_erzurum: {
    year: 1916, date: "1916-01-30", city: "Constantinople",
    title: "A Winter Offensive Nobody Expected",
    advisors: ["enver"],
    bulletin: {
      voice: "otto", date: "1916-01-28", source: "Communique of the Ottoman Headquarters",
      text:
        "On the Caucasus front the enemy has attempted reconnaissances in the region of " +
        "Hasankale. They have been repulsed. Our positions are firm.",
    },
    situation:
      "The Russian army in the Caucasus, under Yudenich, has attacked in the middle of " +
      "winter. It took the Azapkei positions on 31 December and fought at Hasankale on " +
      "18 and 19 January. The Ottoman high command had not expected an offensive in the " +
      "snow. The Third Army, with some 80,000 men in the region, is falling back on the " +
      "fortress of Erzurum, which has more than 200 guns. Its commander, Mahmut Kamil, " +
      "returned from Constantinople on the 29th.\n\n" +
      "The Russians have 130,000 infantry and 35,000 cavalry, and 160,000 more in reserve. " +
      "They are moving on a wide front, and the nearest reserves are a long way off.",
    context:
      "A fortress holds an army in place and protects the road behind it for as long as the " +
      "army inside is not cut off. Fortresses have a way of becoming the places where " +
      "armies are lost. Behind Erzurum there is nothing to stop the Russians until the " +
      "coast and the plains of Anatolia.",
    choices: [
      {
        id: "defend",
        label: "Hold the fortress of Erzurum and fight the Russians at its forts",
        historical: true,
        advisor: { name: "Enver", position:
          "Erzurum is the key to eastern Anatolia and the fortress has the guns. If it is given up there is nothing between the Russians and the heart of the empire." },
        impact: { manpower: -1, munitions: -1, will: -1 },
        setFlags: { otto_erzurum: "defended" },
        next: "otto_1916_02_medina",
        outcome:
          "The Russians attack the outer forts on 11 and 12 February at Deve-boyun, and on the " +
          "14th Fort Tafet falls. They enter Erzurum on the 16th. About 66,000 Ottoman " +
          "soldiers are killed, wounded or captured in the campaign, among them nearly 13,000 " +
          "prisoners in the fortress. The Third Army has ceased to exist as a single force, " +
          "and the Russians are in Anatolia.",
      },
      {
        id: "withdraw",
        label: "Pull the Third Army back west of Erzurum and give up the fortress",
        advisor: { name: "Enver", position:
          "An army that is shut in a fortress is an army that can be surrounded. It should be kept in being, in the open country behind, and the Russians left to find the fortress empty." },
        gate: (m) => m.will >= -1,
        disabledReason: "Giving up Erzurum without a fight would be the end of the Third Army's command",
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { otto_erzurum: "withdrew" },
        next: "otto_1916_02_medina",
        outcome:
          "Speculative. The Third Army marches out of Erzurum in the snow, leaving the fortress " +
          "and its guns to the Russians, who enter an empty city. The army is smaller than it " +
          "was, but whole, and it holds a line some distance to the west. The fortress, " +
          "whose fall would have been the defeat of the winter, is given up as a loss of " +
          "ground only. Constantinople has to explain to the east why it left the town.",
      },
      {
        id: "counter",
        label: "Counter-attack the Russian columns on the road at Koprukoy, with the Third Army outside the fortress",
        advisor: { name: "Enver", position:
          "A fortress is a place to be besieged in. The Russians are strung out in the snow, and an army that waits behind its forts gives up the chance to hit them on the road." },
        impact: { manpower: -2, munitions: -1, will: 0 },
        dispute:
          "Historians differ on whether the Third Army could have beaten the Russian columns in the open: it was " +
          "weaker, badly clothed and short of guns, but the Russians were also extended. What a battle outside " +
          "the fortress would have done is not known.",
        uncertain: [
          { weight: 30, title: "The columns are checked and the army falls back whole",
            impact: { manpower: -2, munitions: -1, will: 1 },
            setFlags: { otto_erzurum: "fought" },
            next: "otto_1916_02_medina",
            outcome:
              "Speculative. The Third Army turns on the leading Russian columns at Koprukoy and checks them " +
              "for a week in the snow. It falls back to Erzurum afterwards with a third of its men gone, and " +
              "the fortress is held a little longer, with an army inside it that still has some fight left. " +
              "The Russians have lost time, and when they come to the forts they come to a garrison that knows the ground." },
          { weight: 70, title: "The army is beaten in the open",
            impact: { manpower: -3, munitions: -2, will: -2 },
            setFlags: { otto_erzurum: "fought" },
            next: "otto_1916_02_medina",
            outcome:
              "Speculative. The Third Army meets the Russians in the open and is beaten, with its guns lost in " +
              "the snow and its men hardly able to move in their rags. It falls back on the fortress in " +
              "disorder, and the Russians arrive before the forts have been made ready. Erzurum falls sooner " +
              "than it did in the record, and the army that is left to defend the road to the west is smaller." },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-06
  otto_1916_02_medina: {
    year: 1916, date: "1916-06-20", city: "Damascus",
    title: "The Railway to Medina",
    advisors: ["djemal", "fakhri"],
    situation:
      "On 10 June the Sharif of Mecca, Hussein, has risen against the Ottoman government with " +
      "the tribes of the Hejaz, and the Arab revolt has begun. The Ottoman garrison " +
      "at Mecca is besieged. The holy city of Medina is held by a small force under " +
      "Fakhri Pasha, and the only line of supply to it is the Hejaz railway, a single " +
      "track of some thirteen hundred kilometres from Damascus.\n\n" +
      "Fakhri will need more men, and so will the Fourth Army in Syria, where Djemal " +
      "governs with full powers. The railway can carry only a small part of what both " +
      "need. The revolt is a rising against the sultan-caliph by the guardian of " +
      "the holy places, and the empire has declared a holy war.",
    context:
      "A city held at the end of a single railway can be cut by a few men with explosives " +
      "and a few camels. The garrison it takes to hold the line is a force that the rest " +
      "of the empire does without.",
    choices: [
      {
        id: "hold",
        label: "Reinforce the Hejaz and hold Medina and the railway",
        historical: true,
        advisor: { name: "Fakhri Pasha", position:
          "Medina is the second holy city of Islam and cannot be given up while the sultan is caliph. The railway can be held if the garrisons are strong enough." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        erodes: "overextend",
        setFlags: { otto_medina: "held" },
        next: "otto_1916_03_romani",
        outcome:
          "Medina is held. The Arab forces, some 30,000 at first, besiege the city and raid " +
          "the railway: more than a hundred major attacks in 1917 and many more in 1918. " +
          "The garrison is supplied with difficulty, and a force of thousands is " +
          "tied down in the desert for the rest of the war. At the end it is about 8,000 " +
          "men, still in the city, and still under Fakhri.",
      },
      {
        id: "evacuate",
        label: "Evacuate the Hejaz and hold the railway only as far as Ma'an",
        advisor: { name: "Djemal", position:
          "The holy cities are not worth an army. A short line, held in strength, is worth more than a long one held by garrisons that cannot help each other." },
        gate: (m) => m.will >= -2,
        disabledReason: "The sultan-caliph cannot be seen to give up the holy city",
        impact: { manpower: 1, munitions: 1, will: -3 },
        setFlags: { otto_medina: "evacuated" },
        next: "otto_1916_03_romani",
        outcome:
          "Speculative. The Ottoman garrisons in the Hejaz withdraw up the railway and Medina is " +
          "left to the Sharif. The army has a shorter line to defend, and the thousands " +
          "it would have spent in the desert are available in Syria. The empire has given " +
          "up the guardianship of the holy cities, which was the foundation of the sultan's " +
          "claim to lead the Muslim world, and the claim does not survive it.",
      },
    ],
  },

  otto_1916_03_romani: {
    year: 1916, date: "1916-07-22", city: "Beersheba",
    title: "The Road to Romani",
    advisors: ["kress", "djemal"],
    situation: (flags) =>
      "The British have spent the spring and summer laying a railway and a pipeline for fresh " +
      "water across northern Sinai, and their outposts have reached Romani, some forty " +
      "kilometres from the canal. Kress von Kressenstein, who commands the Ottoman force in " +
      "Sinai, has about sixteen thousand men, among them the 3rd Division, which fought at " +
      "Gallipoli, and some batteries of heavy guns lent by the Germans and Austrians. The ground " +
      "between is soft sand, and nearly every well on it has been blown up.\n\n" +
      "Each month the British come on, they bring more water and more guns with them, and " +
      "the empire's only chance to meet them near its own wells is to do it now." +
      (flags.otto_medina === "held"
        ? "\n\nThe Hejaz railway and Medina are taking the troops that Djemal might have sent here."
        : ""),
    context:
      "A force that marches at night over sand with the water it can carry has a few days " +
      "of fighting in it. If the British are not beaten in those days, the march home is " +
      "the real battle.",
    choices: [
      {
        id: "strike",
        label: "Send Kress's force across the sand to attack the British at Romani before their railway is finished",
        historical: true,
        advisor: { name: "Kress von Kressenstein", position:
          "The British will be strong enough to attack within weeks. The only chance is to strike at the end of their line while it is short, before the pipeline and the railway can give them the water." },
        impact: { manpower: -2, munitions: -1, will: -1 },
        setFlags: { otto_romani: "struck" },
        dispute:
          "Accounts of the battle of 3 to 5 August differ in the numbers on both sides and in the losses, " +
          "and on whether Kress's retreat was well ordered. What is agreed is that the British mounted " +
          "troops held, that the Ottoman force ran short of water, and that the attack was beaten.",
        uncertain: [
          { weight: 75, title: "The attack is beaten and the force falls back to El Arish", historicalBranch: true,
            impact: { manpower: -2, munitions: -1, will: -1 },
            next: "otto_1917_03_baghdad",
            outcome:
              "The force crosses the sand by night and attacks the British outposts at Romani on " +
              "3 August. It is held by the Anzac mounted troops, with infantry behind them, and the " +
              "sun comes up on men short of water in open ground under the British guns. By " +
              "5 August Kress is in retreat, and the force falls back some hundred kilometres to " +
              "El Arish. It has lost thousands of men, about four thousand of them taken. The " +
              "British railway and pipeline go on across Sinai." },
          { weight: 25, title: "The outposts are overrun and the British fall back",
            impact: { manpower: -1, munitions: -1, will: 1 },
            next: "otto_1917_03_baghdad",
            outcome:
              "Speculative. The attack falls on the outposts before the British mounted troops are " +
              "in place, and the guns and infantry take the high ground above the railhead. The " +
              "British pull back toward the canal, and the pipeline is cut for some days. It is not " +
              "the end of their advance, but it costs them months, and the Ottoman force, still " +
              "short of water, has to hold what it has taken." },
        ],
      },
      {
        id: "wells",
        label: "Stay at Katia and Bir el Abd, where the wells are, and make the British come to the force",
        advisor: { name: "Kress von Kressenstein", position:
          "A force that waits beside its water cannot be made to fight in the sand, and the British have to come on at the pace of their railway." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { otto_romani: "waited" },
        next: "otto_1917_03_baghdad",
        outcome:
          "Speculative. Kress stays by the wells and waits. The British come on at the pace of " +
          "their railway and their pipeline, a few kilometres at a time, and stop at Romani to " +
          "build up their strength. When they attack, it is with their guns and their water " +
          "behind them, and the Ottoman force falls back on El Arish in good order and with " +
          "nearly all its men. It has not been defeated, and it has not stopped anything.",
      },
      {
        id: "hejaz",
        label: "Leave a covering force in Sinai and send the divisions to the Hejaz to put down the revolt",
        advisor: { name: "Djemal", position:
          "The danger is the revolt, because it takes the holy places. Sinai can be covered from El Arish, and the canal will not be attacked again." },
        gate: (m) => m.will >= -3,
        disabledReason: "The Sultan's government has told Berlin that Sinai will be held, and the guns are at Beersheba",
        impact: { manpower: 0, munitions: -1, will: -1 },
        setFlags: { otto_romani: "hejaz" },
        next: "otto_1917_03_baghdad",
        outcome:
          "Speculative. The divisions that would have marched to Romani go by rail to the Hejaz, " +
          "and the revolt is met by more men than the Sharif can answer. Medina and the railway are " +
          "held with less strain. In Sinai the British advance as far as El Arish with hardly a " +
          "shot, and the canal is no longer a front. Djemal has chosen which of his two wars to " +
          "lose slowly.",
      },
    ],
  },

  otto_1917_03_baghdad: {
    year: 1917, date: "1917-03-02", city: "Baghdad",
    title: "The City on the Tigris",
    advisors: ["enver", "liman"],
    situation:
      "The Ottoman force left Kut on 24 February, and the British under Maude, with a force " +
      "that outnumbers the Sixth Army several times over, are advancing up the Tigris on Baghdad. " +
      "The Sixth Army, under Khalil Pasha, is short of men, boots and transport, and the " +
      "prisoners of Kut, taken a year ago, have not been replaced. Khalil began to dig in at " +
      "Ctesiphon, below the city, and has not finished.\n\n" +
      "He has three courses: to stand in front of Baghdad, to meet the British below it, or to " +
      "give the city up and save the army. Constantinople has to say which it wants.",
    context:
      "A city on a river can be held for a few days by an army that is not strong enough to " +
      "hold it for a month. What matters is what is left of the army when the days are over.",
    choices: [
      {
        id: "diyala",
        label: "Let Khalil hold the Diyala, in front of Baghdad, and fall back if the line is turned",
        historical: true,
        advisor: { name: "Enver", position:
          "Baghdad is the empire's chief city in Mesopotamia and must be defended where it stands, on the river in front of it, with the army the empire has." },
        impact: { manpower: -1, munitions: -1, will: -1 },
        setFlags: { otto_baghdad: "diyala" },
        next: "otto_1917_04_gaza",
        outcome:
          "Khalil holds the line of the Diyala, south-east of the city, in fighting that begins on " +
          "8 March, and the British force the crossing. On the 10th he evacuates Baghdad, and the " +
          "British enter it on the 11th. The Sixth Army falls back on Samarra and Mosul, with what " +
          "it can carry. The empire's chief city in Mesopotamia is lost, and the army that is " +
          "left to defend the north is a good deal smaller than the one that was left at Kut.",
      },
      {
        id: "ctesiphon",
        label: "Fight the decisive battle below the city, at Ctesiphon, with the whole Sixth Army",
        advisor: { name: "Enver", position:
          "A battle at Ctesiphon, where the army beat Townshend in 1915, may stop the British, and the army that does not fight there will not fight anywhere." },
        impact: { manpower: -2, munitions: -1, will: 0 },
        erodes: "overextend",
        setFlags: { otto_baghdad: "ctesiphon" },
        dispute:
          "Historians disagree on the numbers on both sides, and on whether Khalil had any good " +
          "choice. His own indecision, between standing at Ctesiphon, at Baghdad and falling " +
          "back, is itself a matter of dispute.",
        uncertain: [
          { weight: 30, title: "The stand holds for a week",
            impact: { manpower: -2, munitions: -1, will: 1 },
            next: "otto_1917_04_gaza",
            outcome:
              "Speculative. The Sixth Army holds its ground below the city for six days, and the " +
              "British have to bring up their guns and fight for each stretch of the line. It is a " +
              "delay and not a victory. The stand costs the army a third of its men, and Baghdad " +
              "falls a week later than it did in the record, to an army that has less left to retreat " +
              "with." },
          { weight: 70, title: "The army is outflanked and broken",
            impact: { manpower: -3, munitions: -2, will: -2 },
            next: "otto_1917_04_gaza",
            outcome:
              "Speculative. The British turn the line from the east, and the Sixth Army is caught " +
              "between the river and the desert. Thousands are taken and most of the guns are lost. " +
              "Baghdad falls on the 11th, as it did in the record, but the army that fell back on " +
              "Mosul in the record is now a remnant, and the north is open." },
        ],
      },
      {
        id: "mosul",
        label: "Give up Baghdad at once and march the Sixth Army to Samarra and Mosul with its guns",
        advisor: { name: "Liman von Sanders", position:
          "An army that cannot beat the British cannot be spent holding a city. The Sixth Army is worth more intact at Mosul than lost at Baghdad." },
        gate: (m) => m.will >= -3,
        disabledReason: "The Sultan cannot be seen to give up a great city without a fight",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { otto_baghdad: "mosul" },
        next: "otto_1917_04_gaza",
        outcome:
          "Speculative. Khalil is ordered to leave Baghdad at once, and the Sixth Army marches north " +
          "with its guns, its stores and nearly all its men. The British enter the city a few days " +
          "earlier than in the record and without a shot. The army that falls back on Mosul is the " +
          "whole Sixth Army, and the empire has given up its chief city in Mesopotamia without a " +
          "battle, which Enver, who wanted to fight, has to explain.",
      },
    ],
  },

  otto_1917_04_gaza: {
    year: 1917, date: "1917-04-22", city: "Gaza",
    title: "The Line That Held",
    advisors: ["kress", "djemal"],
    situation: (flags) =>
      "Twice in a month the British have attacked Gaza and been beaten. The first attack, on " +
      "26 March, was called off when it might have succeeded. The second, from 17 to 19 April, " +
      "came with tanks and gas and cost the British about six and a half thousand men for no " +
      "ground. Kress, the chief of staff of the Fourth Army and the German at Gaza, " +
      "has held the town with a few divisions and a line of redoubts." +
      (flags.otto_romani === "struck"
        ? " The army that was beaten at Romani last summer has held here, behind trenches."
        : "") +
      "\n\nThe line now runs from Gaza on the coast to Beersheba, some forty kilometres inland, " +
      "and it is thin at the eastern end, where the desert is. Two more divisions are on the way. " +
      "The British have lost a battle and not the war, and they will be back.",
    context:
      "A line that is held by redoubts and few men is strong where it has been attacked and " +
      "weak where it has not. What is done with the divisions that are coming decides where " +
      "the next attack will fall.",
    choices: [
      {
        id: "line",
        label: "Hold the line from Gaza to Beersheba and strengthen it with the two new divisions",
        historical: true,
        advisor: { name: "Kress von Kressenstein", position:
          "The line has held twice and can hold again if it is strengthened. Gaza is the gate to Jerusalem, and the British have to come to it." },
        impact: { manpower: 0, munitions: -1, will: 1 },
        setFlags: { otto_gaza: "line" },
        next: "otto_1917_05_aqaba",
        outcome:
          "After the second battle the line is lengthened to Beersheba, with a chain of redoubts " +
          "and strongpoints, and two divisions reinforce the Fourth Army. Gaza is the strongest " +
          "place in it, and Beersheba, at the desert end, is held by outposts. The British do not " +
          "attack again for six months. When they do, at the end of October, it is at Beersheba.",
      },
      {
        id: "shorten",
        label: "Draw the army back from Gaza to a shorter line in the hills toward Jerusalem",
        advisor: { name: "Djemal", position:
          "The line from Gaza to Beersheba is too long for the men there, and the British will find the weak place. A shorter line in the hills can be held in strength." },
        gate: (m) => m.will >= -3,
        disabledReason: "Gaza has been held twice and cannot be given up while it can be held",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { otto_gaza: "shortened" },
        next: "otto_1917_05_aqaba",
        outcome:
          "Speculative. The army leaves Gaza and falls back into the hills, to a line that runs " +
          "from the coast near Jaffa to the hills above Hebron. The line is shorter and the " +
          "divisions on it are denser. The British have Gaza, the plain and the railhead, and the " +
          "Ottoman victory that has just been won is given up without a battle. The country " +
          "round Jerusalem is the front.",
      },
      {
        id: "strike",
        label: "Follow the victory with an attack on the British railhead before they are ready again",
        advisor: { name: "Djemal", position:
          "The British have lost heavily and are not ready to fight again. A blow at their railhead now would give the empire a bridgehead in Sinai." },
        impact: { manpower: -2, munitions: -1, will: 0 },
        erodes: "overextend",
        setFlags: { otto_gaza: "struck" },
        dispute:
          "Historians differ on whether the British were as weak after the second battle as the " +
          "Ottoman commanders hoped. They had lost heavily, but they had the railway and the " +
          "pipeline behind them, and the force that could have attacked them was thin.",
        uncertain: [
          { weight: 25, title: "The British outposts are driven in",
            impact: { manpower: -2, munitions: -1, will: 2 },
            next: "otto_1917_05_aqaba",
            outcome:
              "Speculative. A column of horse and infantry moves out of Gaza at night and drives " +
              "in the British outposts on the Wadi Ghazze. The British fall back some " +
              "kilometres and the railhead is shelled for a night. It is a raid that is not followed " +
              "up, because the divisions that would have to follow it are the ones that hold the " +
              "line, and the Ottoman line is longer and thinner than it was." },
          { weight: 75, title: "The attack is met in the open and driven back",
            impact: { manpower: -3, munitions: -1, will: -2 },
            next: "otto_1917_05_aqaba",
            outcome:
              "Speculative. The column is met in the open by British mounted troops and guns " +
              "that have been brought up in the days since the battle. It loses a good part of its " +
              "strength, and the line it left is weaker for the divisions it took. The British know " +
              "now how few men there are on the Gaza line." },
        ],
      },
    ],
  },

  otto_1917_05_aqaba: {
    year: 1917, date: "1917-06-25", city: "Damascus",
    title: "The Port the Revolt Needs",
    advisors: ["djemal", "fakhri"],
    situation: (flags) =>
      "In January the Arab forces took Wejh on the Red Sea coast, with the help of the British navy, and " +
      "since then they have raided the Hejaz railway on most nights. The one port that could give them " +
      "a base in touch with the British in Sinai is Aqaba, at the head of the gulf. It is held by a " +
      "battalion or less, with a few outposts in the hills behind it.\n\n" +
      "The road to it from the desert side runs through the Wadi Itm and the pass at Abu el Lissan, " +
      "where there is a blockhouse. The nearest force of any size is at Ma'an, some days away, and " +
      "the army in Palestine, where the British are expected to attack again, wants every man." +
      (flags.otto_medina === "held" ? "\n\nThe garrison of Medina is at the other end of the same railway, and the same raiders are cutting it." : ""),
    context:
      "A port is worth what can be landed in it. In Arab hands Aqaba would take stores and guns from " +
      "the British in Egypt, and the railway would be struck from its landward side as well as from the desert.",
    choices: [
      {
        id: "leave",
        label: "Leave Aqaba with its small garrison and its outposts as they are, and keep the main force at Ma'an",
        historical: true,
        advisor: { name: "Djemal", position:
          "Aqaba is a port with no good road behind it. A battalion is enough to hold it, and the men that a stronger garrison would take are wanted in Palestine." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { otto_aqaba: "fell" },
        next: "otto_1917_01_yildirim",
        outcome:
          "In the first days of July Arab irregulars under Auda abu Tayi, with Lawrence and the Sharif " +
          "Nasir, come across the desert from the north-east and defeat a Turkish battalion at Abu el " +
          "Lissan on 2 July. The posts in the Wadi Itm fall in the next days, and on 6 July the Aqaba " +
          "garrison surrenders, about 300 men giving up the post at Khadra. The Arab revolt has a port " +
          "in touch with the British in Sinai, and the railway has a second enemy on its flank.",
      },
      {
        id: "pass",
        label: "Move a battalion and two guns forward to the Wadi Itm and the pass at Abu el Lissan, and put Ma'an on alert",
        advisor: { name: "Fakhri Pasha", position:
          "The way to Aqaba is the pass, and the pass can be held by a battalion with guns. A garrison that waits in the port will be cut off in it." },
        gate: (m) => m.manpower >= -3,
        disabledReason: "The Fourth Army has no battalion to spare while Gaza is threatened",
        impact: { manpower: -1, munitions: -1, will: 0 },
        dispute:
          "Whether a stronger force at the pass would have stopped the Arab column is argued. The column came " +
          "by a long desert route, and it was lightly equipped, but it had surprise, and its leaders knew the ground.",
        uncertain: [
          { weight: 40, title: "The pass holds and the column turns back",
            impact: { manpower: -1, munitions: -1, will: 1 },
            setFlags: { otto_aqaba: "pass" },
            next: "otto_1917_01_yildirim",
            outcome:
              "Speculative. The battalion and its guns are in the pass when the Arab column comes up, and " +
              "the first charge is met with fire it did not expect. The column draws off and tries the " +
              "northern road, and the garrison at Ma'an, which has been alerted, moves out to meet it. " +
              "Aqaba stays in Ottoman hands through the summer, and the Arabs are left with a longer " +
              "road to the sea than they hoped." },
          { weight: 60, title: "The battalion is cut off and Aqaba falls anyway",
            impact: { manpower: -2, munitions: -1, will: -1 },
            setFlags: { otto_aqaba: "pass" },
            next: "otto_1917_01_yildirim",
            outcome:
              "Speculative. The column goes round the pass by a path the Turkish staff did not know, and " +
              "the battalion in it finds the Arabs behind it. It is cut off from Ma'an and from the port, and " +
              "surrenders with its guns. Aqaba falls a few days later, as it did in the record, to an " +
              "attacker that has taken more men and more rifles on the way." },
        ],
      },
      {
        id: "abandon",
        label: "Give up Aqaba, bring the garrison back to Ma'an, and make the railway the line",
        advisor: { name: "Djemal", position:
          "A port that cannot be held is better given up with its garrison than lost with it. The line that matters is the railway, and Ma'an is its keystone." },
        gate: (m) => m.will >= -3,
        disabledReason: "The Sultan's government has told Berlin that the Red Sea ports will be held",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { otto_aqaba: "abandoned" },
        next: "otto_1917_01_yildirim",
        outcome:
          "Speculative. The garrison and its guns are brought back to Ma'an in June, and Aqaba is left to " +
          "the Arabs when they come. The force at Ma'an is stronger by a battalion, and the railway has a " +
          "shorter flank to watch. The Arabs and the British have their port a few weeks earlier than " +
          "in the record, and without a shot being fired for it, which is an easier thing to " +
          "explain to the Sultan than a surrender.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-09
  otto_1917_01_yildirim: {
    year: 1917, date: "1917-09-05", city: "Aleppo",
    title: "Baghdad, or Palestine",
    advisors: ["falkenhayn", "enver"],
    situation: (flags) =>
      (flags.otto_baghdad === "mosul"
        ? "Baghdad was given up in March without a battle, and the Sixth Army fell back on Mosul whole. "
        : flags.otto_baghdad === "ctesiphon"
        ? "Baghdad fell in March after the Sixth Army fought and was broken below the city. "
        : "Baghdad fell on 11 March, with some 15,000 Ottoman soldiers taken in the confusion " +
          "of the retreat. ") +
      "Enver wants it back. In May the German general Falkenhayn arrived in " +
      "Constantinople to organise an army group for the purpose, the Yildirim, which the " +
      "Sultan approved in July and which is made up of the Sixth and Seventh Armies and a " +
      "German corps. It is to go down the Euphrates and take the British in the flank.\n\n" +
      "Falkenhayn has warned that to advance on Baghdad without first securing the Sinai " +
      "front would be unwise. Djemal agrees and wants the army group in Palestine. " +
      (flags.otto_gaza === "shortened"
        ? "The British are about to attack the line in the hills."
        : flags.otto_gaza === "struck"
        ? "The British, who were beaten at Gaza in April, are about to attack again."
        : "The British are about to attack at Gaza."),
    context:
      "The railway to Baghdad is unfinished, and the last of the way is a road across " +
      "the desert. Supplying an army group that far is a different campaign from " +
      "fighting one. In Palestine the railways are shorter, and so is the distance " +
      "from the British.",
    choices: [
      {
        id: "palestine",
        label: "Send the Yildirim Army Group to Palestine and defend the Gaza line",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "An army group that goes to Baghdad leaves the road to Jerusalem open. Sinai and Palestine must be secured first, and the Yildirim should go there." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { otto_yildirim: "palestine" },
        next: "otto_1917_06_hejaz",
        outcome:
          "In September 1917 Falkenhayn redirects the group to Sinai and Palestine. The command " +
          "is reorganised: Kress von Kressenstein receives the Eighth Army for the Gaza front, Djemal " +
          "the Fourth, and Falkenhayn himself the Sixth, Seventh and Eighth, with " +
          "responsibility for Jerusalem. Enver gives up the plan to retake Baghdad. The " +
          "army group arrives in Palestine in time for the British attack, and not in time " +
          "to prepare for it.",
      },
      {
        id: "baghdad",
        label: "Send the Yildirim Army Group down the Euphrates to retake Baghdad",
        advisor: { name: "Enver", position:
          "Baghdad is the empire's second city in the east, and the Germans have promised the guns for it. The army group was raised for this and should be used for it." },
        gate: (m) => m.munitions >= -3,
        disabledReason: "Falkenhayn has warned that the army group cannot be supplied that far",
        impact: { manpower: -2, munitions: -2, will: 1 },
        erodes: "overextend",
        setFlags: { otto_yildirim: "baghdad" },
        next: "otto_1917_06_hejaz",
        outcome:
          "Speculative. The army group sets out down the Euphrates, with the German guns and " +
          "a supply line that will not stretch to the objective. The road is long and there " +
          "is little water on it. The British in Mesopotamia fall back to meet it, and the " +
          "British in Palestine, who have been left alone, attack at Gaza in October with " +
          "the Ottoman line weaker than it was when the army group was ordered east.",
      },
      {
        id: "both",
        label: "Divide the Yildirim Army Group: part to Palestine, part down the Euphrates",
        advisor: { name: "Enver", position:
          "Both fronts have to be held, and Baghdad has to be tried. A force sent to each does what a force sent to one cannot." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        setFlags: { otto_yildirim: "divided" },
        next: "otto_1917_06_hejaz",
        outcome:
          "Speculative. The army group is divided, and part of it goes by the railway to " +
          "Palestine and part down the Euphrates. Neither has what it needs. The force " +
          "in Palestine is weaker than the force the British are about to meet at Gaza, " +
          "and the force on the Euphrates is too small to retake Baghdad and too far from " +
          "its railway to do anything else. Falkenhayn, who warned against dividing the " +
          "effort, has done what he was asked to do.",
      },
    ],
  },

  otto_1917_06_hejaz: {
    year: 1917, date: "1917-10-12", city: "Damascus",
    title: "Flour and Firewood",
    advisors: ["djemal", "fakhri"],
    situation: (flags) =>
      "On 4 October Fakhri Pasha reported that the wheat and the food in Medina were nearly gone, and that " +
      "he could no longer rely on the railway, which the Arab raiders cut again and again. The staff at " +
      "Damascus has told him that he is responsible for his own fuel, and may pull down the houses of the " +
      "city, the holy places excepted.\n\n" +
      "The army in Palestine, where the British are about to attack, needs every truck and every ton " +
      "of coal on the same line. At the far end of thirteen hundred kilometres of single track " +
      "a garrison of thousands has about a month of bread." +
      (flags.otto_aqaba === "fell" || flags.otto_aqaba === "pass"
        ? "\n\nAqaba is in Arab hands, and the railway is struck now from the south-west as well as from the desert."
        : flags.otto_aqaba === "abandoned"
        ? "\n\nAqaba was given up in the summer, and the Arabs and the British have the port."
        : ""),
    context:
      "A garrison that is fed from a railway lives as long as the railway runs. Trucks sent to Medina " +
      "are trucks not sent to Gaza, and a garrison brought out is a garrison that has given up the city " +
      "that the Sultan's claim to be caliph rests on.",
    choices: [
      {
        id: "live",
        label: "Tell Fakhri to live on what the district can give him, and keep the railway for Palestine",
        historical: true,
        advisor: { name: "Djemal", position:
          "The army that has to fight the British is the one that matters. The garrison of Medina can live on the district, and on the houses of the city, until the front is safe." },
        impact: { manpower: -1, munitions: 0, will: -1 },
        setFlags: { otto_hejaz: "held" },
        next: "otto_1917_02_jerusalem",
        outcome:
          "The staff answers Fakhri that he must find his own fuel, and may take down the buildings of " +
          "Medina except the holy places, and the railway goes on carrying what Palestine needs. In " +
          "November, with the line at Gaza lost, Djemal tells him that if Jerusalem falls the garrison " +
          "is to be taken out. The programme, which would have taken seventy-five days, is " +
          "never carried out, for want of rolling stock and fuel. The garrison stays.",
      },
      {
        id: "convoy",
        label: "Send three trains of flour and fuel to Medina, and take the trucks from Palestine",
        advisor: { name: "Fakhri Pasha", position:
          "A garrison that is not fed will not hold. The holy city cannot be left to starve, and three trains of flour will keep it until the spring." },
        gate: (m) => m.munitions >= -3,
        disabledReason: "The Palestine army has told Damascus that it cannot lose a single truck",
        impact: { manpower: 0, munitions: -2, will: 1 },
        setFlags: { otto_hejaz: "fed" },
        next: "otto_1917_02_jerusalem",
        outcome:
          "Speculative. Three trains of flour and fuel are made up at Damascus and sent south. They " +
          "reach Medina with the help of a column that clears the line, and the garrison has bread " +
          "through the winter. The trucks that carried them are not at Gaza when the British come, and " +
          "the army in Palestine is the poorer by a few thousand tons of supplies, and by the men " +
          "who guarded the trains.",
      },
      {
        id: "evacuate",
        label: "Order the Hejaz force out of Medina now, by the railway, before the winter",
        advisor: { name: "Djemal", position:
          "Medina is a gangrened finger, and it will spread to Ma'an and to Syria if it is not cut off. The force in it is worth more in Palestine than in a city it cannot feed." },
        gate: (m) => m.will >= -2,
        disabledReason: "The Sultan-caliph cannot be seen to give up the Prophet's city, and Fakhri has said he will not leave",
        impact: { manpower: 1, munitions: -1, will: -3 },
        erodes: "overextend",
        dispute:
          "Whether the garrison could have been brought out is argued. The line was single, the trucks were few, " +
          "the fuel was short, and the Arab raiders cut the track every few days, so that an evacuation planned " +
          "for seventy-five days might have taken a good deal longer.",
        uncertain: [
          { weight: 35, title: "The first trains get the garrison out",
            impact: { manpower: 1, munitions: -1, will: -2 },
            setFlags: { otto_hejaz: "evacuated" },
            next: "otto_1917_02_jerusalem",
            outcome:
              "Speculative. The first trains leave Medina in October with the sick and the guns, and most " +
              "of the force follows in three weeks, with the Arab raiders kept off the line by columns from " +
              "Ma'an. Fakhri leaves last, and under protest. The city is open to the Arabs, and the " +
              "men who held it are in Syria in time for the British attack." },
          { weight: 65, title: "The railway breaks and the garrison is strung out along it",
            impact: { manpower: -2, munitions: -1, will: -3 },
            setFlags: { otto_hejaz: "evacuated" },
            next: "otto_1917_02_jerusalem",
            outcome:
              "Speculative. The trains run out of fuel at the first long gradient, and the Arabs blow the " +
              "track in half a dozen places. The garrison is spread over four hundred kilometres of " +
              "line in stalled trains and camps, short of food and water, and the Arabs take the " +
              "stragglers at their leisure. Medina is lost, and a good part of the force with it." },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-11
  otto_1917_02_jerusalem: {
    year: 1917, date: "1917-11-16", city: "Nablus",
    title: "The Holy City on the Road",
    advisors: ["falkenhayn", "kress"],
    bulletin: {
      voice: "otto", date: "1917-11-14", source: "Communique of the Ottoman Headquarters",
      text:
        "On the Palestine front our troops have withdrawn according to plan to positions " +
        "prepared in advance. The enemy has not been able to cut our lines.",
    },
    situation:
      "The British attacked at Beersheba on 31 October and broke the Gaza line. The " +
      "Eighth Army, under Kress, has fallen back across the coastal plain and Jaffa is " +
      "about to fall; the Seventh Army has retreated into the Judean hills. Falkenhayn " +
      "moved his headquarters from Jerusalem to Nablus on the 14th. Eleven Ottoman " +
      "infantry divisions have lost some 28,000 men and 100 guns.\n\n" +
      "The question for the army group is Jerusalem. Defended, it holds the road to Nablus " +
      "and the holy city; given up, it saves the army from a battle fought for a name.",
    context:
      "The city has shrines holy to three faiths, and fighting among them will be held " +
      "against whoever fights. An army that stays to defend it will be shelled by an " +
      "enemy who has more guns, and it will not be able to retreat if the hills behind it " +
      "are cut.",
    choices: [
      {
        id: "withdraw",
        label: "Withdraw into the hills north of Jerusalem and leave the city undefended",
        historical: true,
        advisor: { name: "Falkenhayn", position:
          "A battle for the city would be fought on the British guns' terms. The Seventh Army should be kept in being on the Nablus road, with the city left open." },
        impact: { manpower: 0, munitions: -1, will: -2 },
        setFlags: { otto_jerusalem: "withdrew" },
        next: "otto_1917_07_erzincan",
        outcome:
          "The Seventh Army retreats in the evening of 8 December, in rain. On the 9th the " +
          "governor surrenders the city, in writing, citing the danger to the holy places from " +
          "shellfire. Allenby enters Jerusalem on foot by the Jaffa Gate on the 11th. At the " +
          "end of the month Falkenhayn attacks to recover it, and is repulsed. He is " +
          "replaced by Liman von Sanders in the winter.",
      },
      {
        id: "hold",
        label: "Defend Jerusalem and make the British fight for the city",
        advisor: { name: "Kress von Kressenstein", position:
          "The city is the empire's, and the army has to be seen to defend it. A line that goes back every week will have nothing left to go back to." },
        gate: (m) => m.manpower >= -3,
        disabledReason: "The Seventh Army has too few men left to stand in front of the city",
        impact: { manpower: -2, munitions: -1, will: 1 },
        erodes: "overextend",
        setFlags: { otto_jerusalem: "held" },
        next: "otto_1917_07_erzincan",
        outcome:
          "Speculative. The army digs in in front of the city and the British guns open on it. " +
          "The battle that follows is fought in the streets and among the shrines, and the " +
          "army that fights it is cut off from the road north when the British turn its " +
          "flank. The city is lost, with the army that held it, and Falkenhayn has " +
          "a good deal less to show for the winter.",
      },
    ],
  },

  otto_1917_07_erzincan: {
    year: 1917, date: "1917-12-14", city: "Constantinople",
    title: "A Pause in the Snow",
    advisors: ["enver", "djemal"],
    situation:
      "The Russian army in the Caucasus is coming apart. After the October revolution its soldiers are " +
      "going home, and the front is held by Armenian and Georgian units and by what is left of the rest. " +
      "Vehib Pasha, who commands the Third Army, has proposed a ceasefire, and the Transcaucasian " +
      "authorities have said they will talk.\n\n" +
      "Jerusalem fell on 9 December, and Djemal and the Germans want every division that can be spared " +
      "in Palestine. The Third Army is hungry, ill-clothed and half the size on paper that it was, " +
      "and it is the winter in the mountains.",
    context:
      "An enemy that is going home is an enemy that cannot be fought and cannot be trusted to stay " +
      "gone. A ceasefire gives the Third Army the winter, and the Russians the same, and what " +
      "the spring brings is not something that can be known now.",
    choices: [
      {
        id: "sign",
        label: "Sign the ceasefire at Erzincan, and hold the Third Army where it is while the Russians go home",
        historical: true,
        advisor: { name: "Enver", position:
          "The army cannot fight in the snow and has no need to. A ceasefire holds the line for the winter, and the Russians will not come back." },
        impact: { manpower: 1, munitions: 0, will: 1 },
        setFlags: { otto_erzincan: "signed" },
        next: "otto_1918_01_caucasus",
        outcome:
          "The ceasefire is signed at Erzincan on 18 December, between the Third Army and the Transcaucasian " +
          "authorities, and the fighting on the Caucasus and Persian fronts stops until February. The " +
          "empire treats the other side as a state on its own, and the other side does not. The Third " +
          "Army has the winter to rest in, and the Russian army goes home.",
      },
      {
        id: "advance",
        label: "Refuse any pause and advance into the collapsing front now, in the snow",
        advisor: { name: "Enver", position:
          "An enemy that is falling apart should be pushed, and not given the winter to put itself together. The army that waits will have to fight in the spring what it could take now." },
        gate: (m) => m.manpower >= -3,
        disabledReason: "The Third Army has told Constantinople that it cannot march without boots",
        impact: { manpower: -2, munitions: -1, will: 0 },
        erodes: "overextend",
        dispute:
          "Historians disagree on whether the Ottoman army could have gone far in the winter of 1917 to 1918. " +
          "It had little transport, and the roads were closed by snow, but the front in front of it was nearly empty.",
        uncertain: [
          { weight: 50, title: "The army walks into an empty front",
            impact: { manpower: -2, munitions: -1, will: 2 },
            setFlags: { otto_erzincan: "advance" },
            next: "otto_1918_01_caucasus",
            outcome:
              "Speculative. The Third Army marches into the snow and meets almost no one. Whole divisions of " +
              "the Russian army have gone home, and the Armenian and Georgian units that are left fall " +
              "back. The army reaches Erzurum in weeks, with men dead of cold on the road, and it holds " +
              "ground that it would have had in the spring in any case." },
          { weight: 50, title: "The advance stalls in the snow",
            impact: { manpower: -3, munitions: -1, will: -1 },
            setFlags: { otto_erzincan: "advance" },
            next: "otto_1918_01_caucasus",
            outcome:
              "Speculative. The advance is stopped in the passes by snow and by the Armenian units, who " +
              "hold the narrow roads with what guns they have. The army has no boots and no food for " +
              "a march, and it loses more men to the cold than to the enemy. It falls back to " +
              "its winter quarters in February, a good deal smaller." },
        ],
      },
      {
        id: "palestine",
        label: "Sign the ceasefire, and send two divisions of the Third Army to Palestine",
        advisor: { name: "Djemal", position:
          "The British are on the road to Damascus. The Third Army can hold the mountains with a ceasefire and half its strength, and the other half is needed where the war is." },
        gate: (m) => m.manpower >= -3,
        disabledReason: "The Third Army is already below the strength that the mountains need",
        impact: { manpower: -1, munitions: 0, will: 0 },
        setFlags: { otto_erzincan: "palestine" },
        next: "otto_1918_01_caucasus",
        outcome:
          "Speculative. The ceasefire is signed, and two divisions of the Third Army go by Aleppo to " +
          "Palestine, where they arrive in the new year. The line in the mountains is thinner, and the " +
          "Armenians and the Georgians see it. The Palestine army has two divisions more when the " +
          "British come on, and the Third Army has fewer when the Russians have gone and the spring comes.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-07
  otto_1918_01_caucasus: {
    year: 1918, date: "1918-07-10", city: "Constantinople",
    title: "The Road to Baku",
    advisors: ["enver", "liman"],
    situation: (flags) =>
      "Russia made peace at Brest-Litovsk on 3 March, and the empire has taken back the " +
      "districts of Kars, Ardahan and Batum that it lost forty years ago. On 4 June it " +
      "signed the treaty of Batum with the new republics of Armenia, Azerbaijan and " +
      "Georgia. Nuri Pasha reached Ganja on 25 May and has been gathering an army of " +
      "Muslim volunteers and Ottoman regulars: the Army of Islam, which has about 20,000 " +
      "men and no German officers in it.\n\n" +
      "Enver wants Baku, its oil, and the Muslims of the Caspian coast. The Germans want " +
      "the oil for themselves and have told him to keep out of southern Russia. " +
      "In Palestine, Liman von Sanders is asking for every division he can get." +
      (flags.otto_erzincan === "advance"
        ? "\n\nThe Third Army has been in the field since the winter, and it is smaller than it was."
        : flags.otto_erzincan === "palestine"
        ? "\n\nTwo divisions of the Third Army went to Palestine in January, and the Caucasus is held more thinly."
        : ""),
    context:
      "Baku is five hundred kilometres from the nearest Ottoman railway, and a long way " +
      "from any front where the war will be decided. The divisions that are sent to the " +
      "Caspian are divisions that Palestine does not have, in the summer that the British " +
      "are expected to attack there.",
    choices: [
      {
        id: "baku",
        label: "Send the Army of Islam against Baku",
        historical: true,
        advisor: { name: "Enver", position:
          "Russia has gone, and the Muslims of the Caucasus are waiting. The empire will not have this chance again, and the oil of Baku is worth more than another division in Palestine." },
        impact: { manpower: 0, munitions: -1, will: 2 },
        erodes: "overextend",
        setFlags: { otto_caucasus: "baku" },
        next: "otto_1918_02_megiddo",
        outcome:
          "The attacks on the hills north-west of Baku fail on 31 July, 2 August and 5 August. " +
          "The Germans object, and Seeckt is sent to Batum to talk to Enver, and the " +
          "commander of the Third Army is removed. The final assault goes in at 1 in the " +
          "morning of 14 September, and the British leave that day. The Army of Islam enters " +
          "Baku on the 15th, four days before the British attack in Palestine.",
      },
      {
        id: "hold",
        label: "Halt at the frontier of Batum and send the Caucasus divisions to Palestine",
        advisor: { name: "Liman von Sanders", position:
          "The war will be decided in Syria, not on the Caspian. Every division that can be moved to Palestine should be, before the British attack there." },
        gate: (m) => m.will >= -2,
        disabledReason: "Enver has given the order, and the Germans' objections have not shaken him",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { otto_caucasus: "held" },
        next: "otto_1918_02_megiddo",
        outcome:
          "Speculative. The Army of Islam halts at the Batum frontier, and the divisions that " +
          "have been gathering at Ganja are sent west and south. Enver is told that Baku " +
          "will have to wait. The oil goes on being the Germans' concern. In Palestine, " +
          "Liman von Sanders has a few thousand more men than he would have had, and " +
          "the empire has kept the gains that the treaty of Brest-Litovsk gave it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-09
  otto_1918_02_megiddo: {
    year: 1918, date: "1918-09-17", city: "Nazareth",
    title: "The Line Before the Blow",
    advisors: ["liman", "kemal"],
    bulletin: {
      voice: "otto", date: "1918-09-15", source: "Communique of the Ottoman Headquarters",
      text:
        "On the Palestine front there has been the usual activity of patrols and artillery. " +
        "The troops are in good spirits and hold their positions with confidence.",
    },
    situation:
      "Liman von Sanders has commanded the army group since the spring. His three armies " +
      "have 32,000 infantry and 402 guns on a front from the sea to the Jordan: the Eighth " +
      "under Jevad on the coast, the Seventh under Mustafa Kemal in the hills, and the " +
      "Fourth under Djemal Mersinli east of the Jordan. Allenby has 57,000 infantry, 12,000 " +
      "mounted men and 540 guns, and has concentrated nearly five to one on the coast. " +
      "Liman has two German regiments and two weak cavalry divisions in reserve.\n\n" +
      "The commander of the XXII Corps on the coast, Refet, thinks an attack is coming " +
      "and wants to withdraw his corps to a shorter line before it begins. Liman believes " +
      "the information is a bluff.",
    context:
      "A corps that retires without being attacked gives ground it might have held, and a " +
      "corps that does not retire may be destroyed where it stands. Behind the line there " +
      "are two roads, a railway, and 150 kilometres to Damascus.",
    choices: [
      {
  id: "hold",
  keyBattleSubgame: { id: "megiddoOttoman" },
  label: "Forbid the withdrawal and hold the line as it stands",
  historical: true,
  advisor: { name: "Liman von Sanders", position:
    "There is no sign that the attack is coming where Refet says. A withdrawal on a rumour would give the British the ground without a fight." },
  impact: { manpower: -2, munitions: -1, will: -2 },
  setFlags: { otto_megiddo: "held" },
  dispute:
    "Historians differ on how far the collapse in Palestine in September 1918 was " +
    "the result of Allenby's deception and his concentration against the coast, and " +
    "how far of the state of the Ottoman army, which was short of men, food and " +
    "boots and had been losing soldiers to desertion for a year. How long a better " +
    "disposed line could have held, and whether the army could have got away, is " +
    "argued still.",
  uncertain: [
    { weight: 85, title: "The line breaks on the coast and the army group is destroyed", historicalBranch: true,
      impact: { manpower: -2, munitions: -1, will: -2 },
      next: "otto_1918_03_mudros",
      outcome:
        "The attack comes at 4.30 on the morning of 19 September, behind 385 guns. A bomber " +
        "has cut the telephone exchange at Afula, and the army group is without orders for " +
        "two days. Liman's headquarters at Nazareth is overrun on the 20th. The Seventh Army " +
        "is destroyed in the Wadi Fara by aeroplanes on the 21st. Damascus falls on 1 October " +
        "and Aleppo on 26 October. About 75,000 Ottoman soldiers are taken before Damascus." },
    { weight: 15, title: "The line bends for two days and the Eighth Army gets its guns away",
      impact: { manpower: -1, munitions: 0, will: -1 },
      next: "otto_1918_03_mudros",
      outcome:
        "Speculative. The attack comes at 4.30 and breaks the line on the coast. The " +
        "telephone is cut, and the army group is without orders. Some corps hold on " +
        "the second day, and the Eighth Army gets its guns back along the road to the " +
        "north before the cavalry can cut it. Damascus falls, and Aleppo, but the " +
        "army that reaches them is larger than it would have been, and has artillery. " +
        "The war is lost in the same weeks." },
  ],
},
      {
        id: "withdraw",
        label: "Allow Refet to withdraw the XXII Corps to a shorter line before the attack",
        advisor: { name: "Mustafa Kemal", position:
          "The army has too few men to hold a line this long against a blow at one point. It should be shortened while there is time, and kept in being." },
        gate: (m) => m.manpower >= -4,
        disabledReason: "The commander of the army group has forbidden the withdrawal",
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { otto_megiddo: "withdrew" },
        next: "otto_1918_03_mudros",
        outcome:
          "Speculative. The XXII Corps falls back in good order the night before the attack, and " +
          "the British find the coast line empty. The blow falls on ground that has been " +
          "given up, and the pursuit has to be made on the roads and the railway. The army " +
          "group is pushed back, and it is not destroyed. The line in front of Damascus, " +
          "which is held for a few weeks longer, is held by an army that still has its guns.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-10
  otto_1918_03_mudros: {
    year: 1918, date: "1918-10-27", city: "Constantinople",
    title: "Terms at Lemnos",
    advisors: ["izzet", "fakhri"],
    situation: (flags) =>
      "Talat's government resigned on the 13th, and Ahmed Izzet Pasha has formed another, " +
      "taking the ministry of war himself. Bulgaria has made peace, Germany is asking for " +
      "an armistice, and the army has been beaten in Palestine and Mesopotamia. " +
      (flags.otto_caucasus === "baku"
        ? "The Army of Islam, which took Baku in September, is far to the east and cut off from the rest."
        : "The divisions that were kept from the Caucasus are in Syria, and have been beaten there.") +
      "\n\nThe Minister of Marine, Rauf, has been sent to Lemnos to talk to the British " +
      "admiral, Calthorpe, aboard the Agamemnon. The French have been kept out of the room. " +
      "The British terms demand that the garrisons outside Anatolia surrender, that the " +
      "Straits forts be occupied, that the army be demobilised, and that the Allies " +
      "may occupy any territory in the event of disorder. The delegation has asked for " +
      "instructions.",
    context:
      "The terms are hard and loosely drawn. The government is told it can refuse them and " +
      "fall back on Anatolia, which it has no army to defend, or sign them and trust what " +
      "the British say about the intentions behind them.",
    choices: [
      {
        id: "sign",
        label: "Authorise the delegation to sign the armistice on the British terms",
        historical: true,
        advisor: { name: "Ahmed Izzet Pasha", position:
          "The army is beaten and the empire cannot fight on. The terms are hard, but they are the best that will be offered, and they end the war." },
        impact: { manpower: 0, munitions: 0, will: -2 },
        nextIf: (m, flags) =>
          [flags.otto_sarikamis === "held", flags.otto_suez === "kept", flags.otto_medina === "evacuated", flags.otto_caucasus === "held", flags.otto_erzurum === "withdrew"].filter(Boolean).length >= 3 ? "otto_end_core"
          : null,
        next: "otto_end_mudros",
        outcome:
          "The armistice is signed on board the Agamemnon on 30 October and takes effect at noon " +
          "on the 31st. The garrisons outside Anatolia are to surrender, the forts on the " +
          "Straits are to be occupied, the army is to be demobilised, and the Allies may occupy " +
          "any territory in a case of disorder. Few in Constantinople yet understand how " +
          "much of that last clause the Allies mean to use. On 2 November Enver and the leaders " +
          "of the party leave by German submarine.",
      },
      {
        id: "refuse",
        label: "Refuse the terms and fall back on Anatolia to fight on",
        advisor: { name: "Fakhri Pasha", position:
          "A garrison that has held a city for two years does not give it up because a ministry in Constantinople has asked for terms. The empire can still fight, in the country it knows." },
        gate: (m) => m.manpower >= -5,
        disabledReason: "There is no army left to fight on, and the Allies are already at the frontier of Anatolia",
        impact: { manpower: -2, munitions: -2, will: -1 },
        next: "otto_end_stand",
        outcome:
          "Speculative. The delegation is told to break off, and the government falls back on " +
          "the interior. The army that is left, perhaps a few divisions in good order, is " +
          "ordered to hold the passes into Anatolia. The Allies have the Straits, the " +
          "ports and the railways of Syria, and the war in the east goes on for the " +
          "winter, in a country that has no armies and nothing to feed them.",
      },
    ],
  },

  // ---------------------------------------------------------------- endings
  otto_end_mudros: {
    year: 1918, date: "1918-10-30", city: "Mudros",
    title: "The Armistice on Lemnos",
    advisors: ["izzet"],
    situation:
      "The armistice is signed in the harbour of Mudros on 30 October, aboard a British " +
      "battleship, by the delegation of an empire whose armies have been beaten on every " +
      "front it has fought on. The Straits are open to the Allies, the army is to go home " +
      "and the garrisons in Arabia, Syria and Mesopotamia are to surrender.\n\n" +
      "The war that the empire entered at the order of one minister and one German admiral ends " +
      "with the empire's capital under Allied guns, and with a population that was told, for " +
      "four years, that it was winning.",
    ending: { family: "armistice", badge: BADGES.SETTLED },
    epilogue: (flags) =>
      "The German ships, August 1914: " + (flags.otto_straits === "closed" ? "kept out of the Straits." : "admitted to the Straits and taken into the navy.") + "\n" +
      "Entering the war, 1914: " + (flags.otto_blacksea === "held" ? "the fleet kept in the Bosphorus." : "the Black Sea raid, and war with Russia.") + "\n" +
      "Sarikamis, December 1914: " + (flags.otto_sarikamis === "held" ? "the Erzurum line held through the winter." : flags.otto_sarikamis === "postponed" ? "the offensive postponed for a month for clothing, and then decided on the new facts." : "the offensive in the snow.") + "\n" +
      "The Suez Canal, February 1915: " + (flags.otto_suez === "kept" ? "the Fourth Army kept in Palestine." : flags.otto_suez === "raided" ? "a small column sent to raid the canal." : "the attack across Sinai.") + "\n" +
      "Gallipoli, April 1915: " + (flags.otto_gallipoli === "forward" ? "the divisions placed above the beaches." : "the reserve kept inland, and the landings contained.") + "\n" +
      "Kut, winter of 1915-16: " + (flags.otto_kut === "storm" ? "the town stormed." : flags.otto_kutResult === "relieved" ? "the siege broken by the relief force." : "the siege kept, and the British surrender.") + "\n" +
      "Erzurum, 1916: " + (flags.otto_erzurum === "withdrew" ? "the fortress given up and the army saved." : flags.otto_erzurum === "fought" ? "the army fought the Russians outside the fortress." : "the fortress held until it fell.") + "\n" +
      "The Hejaz, 1916: " + (flags.otto_medina === "evacuated" ? "evacuated." : "Medina held to the end of the war.") + "\n" +
      "Sinai, 1916: " + (flags.otto_romani === "waited" ? "the force kept by its wells." : flags.otto_romani === "hejaz" ? "the divisions sent to the Hejaz." : "the attack at Romani.") + "\n" +
      "Baghdad, 1917: " + (flags.otto_baghdad === "ctesiphon" ? "the stand below the city." : flags.otto_baghdad === "mosul" ? "the city given up and the army saved." : "the line of the Diyala.") + "\n" +
      "Gaza, 1917: " + (flags.otto_gaza === "shortened" ? "the army drawn back to the hills." : flags.otto_gaza === "struck" ? "the British railhead attacked." : "the line held and lengthened to Beersheba.") + "\n" +
      "Aqaba, 1917: " + (flags.otto_aqaba === "abandoned" ? "the port given up." : flags.otto_aqaba === "pass" ? "the pass defended." : "the port lost to the Arab column.") + "\n" +
      "Medina, autumn 1917: " + (flags.otto_hejaz === "evacuated" ? "the garrison ordered out." : flags.otto_hejaz === "fed" ? "fed by trains from Syria." : "left to live on the district.") + "\n" +
      "The Yildirim, 1917: " + (flags.otto_yildirim === "baghdad" ? "sent against Baghdad." : flags.otto_yildirim === "divided" ? "divided between Palestine and the Euphrates." : "sent to Palestine.") + "\n" +
      "Jerusalem, 1917: " + (flags.otto_jerusalem === "held" ? "the city defended." : "the city left undefended.") + "\n" +
      "Erzincan, December 1917: " + (flags.otto_erzincan === "advance" ? "the advance in the snow." : flags.otto_erzincan === "palestine" ? "the ceasefire, and two divisions sent to Palestine." : "the ceasefire signed.") + "\n" +
      "The Caucasus, 1918: " + (flags.otto_caucasus === "held" ? "the army halted at Batum." : "the Army of Islam sent to Baku.") + "\n" +
      "Palestine, September 1918: " + (flags.otto_megiddo === "withdrew" ? "the corps withdrawn before the attack." : "the line held.") + "\n\n" +
      "What actually happened: the armistice of Mudros was signed on 30 October 1918 and took " +
      "effect on 31 October. The Ottoman army and navy were demobilised and the Straits " +
      "forts occupied. The Ottoman Armenians had been deported and killed from 1915; about a " +
      "million died, in a genocide carried out by the government and the party that ran " +
      "the war, and by units of the army. The British entered Mosul on 14 November, after " +
      "the armistice. The Allies occupied Constantinople on 13 November 1918.",
  },

  otto_end_straits: {
    year: 1915, date: "1915-05-02", city: "Constantinople",
    title: "The Narrows Under Allied Guns",
    advisors: ["liman"],
    situation:
      "The Allies broke out of the beaches and seized the heights above the forts, and from " +
      "them their guns look down on the Narrows. The minefield cannot be kept while it " +
      "is being shot at, and the fleet is at the entrance.\n\n" +
      "The empire's capital is a day's steaming from a fleet that cannot now be stopped, and " +
      "the Ottoman government has to decide whether to leave it. Whatever it decides, " +
      "the war in the Straits is lost.",
    ending: { family: "straits-lost", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The Allied landings of 25 April were contained. What actually happened: " +
      "the Fifth Army held the beaches and then the heights, and the campaign settled into " +
      "trenches. Each side lost about 250,000 men. The Allies evacuated in December 1915 " +
      "and January 1916, the last of them going on 9 January 1916. The Straits were not " +
      "forced in the war, and the Ottoman victory there made Mustafa Kemal's name. A " +
      "defeat in April 1915 would have put Constantinople in danger within weeks, " +
      "isolated the empire from its German ally, and opened a sea route to Russia that " +
      "was never opened. The deportations of the Armenians had begun on the night of 23 " +
      "April; the same government carried them out, whichever way the landings went.",
  },

  otto_end_core: {
    year: 1918, date: "1918-10-30", city: "Mudros",
    title: "A Smaller War",
    advisors: ["izzet"],
    situation:
      "The armistice is signed on the same day, and the army that signs it is a different " +
      "one. It did not march into the mountains in December 1914, it did not cross Sinai, " +
      "it did not hold the Hejaz and it did not go to the Caspian. It has fewer fronts " +
      "and more men, and it is still beaten.\n\n" +
      "The empire that comes out of the war is smaller than the one that went into it, " +
      "and a good deal less exhausted. It has not been asked to do what it could not do, " +
      "and it has been asked to do a great deal less of what it could.",
    ending: { family: "core-defence", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The empire's army fought the war on every front it could reach. What " +
      "actually happened: the offensive at Sarikamis, the attack on the canal, the garrison " +
      "of the Hejaz and the Army of Islam were all commitments beyond what the railways and " +
      "the stores could carry, and each cost men the empire could not replace. Whether " +
      "a war confined to Anatolia and the Straits would have saved the empire cannot " +
      "be known; the armistice terms and the occupation that followed would have fallen " +
      "on any state that signed it. The Armenian genocide of 1915 was carried out by " +
      "the government that took the empire into the war, and no choice about the " +
      "campaigns would have altered it.",
  },

  otto_end_stand: {
    year: 1918, date: "1918-10-30", city: "Eskisehir",
    title: "The Last Line in the Interior",
    advisors: ["fakhri"],
    situation:
      "The delegation at Lemnos was told to break off. The government has left Constantinople " +
      "for the interior, and the army that is left is on the passes of the Taurus and in the " +
      "country about Eskisehir. The Allies hold the Straits and the ports. They do not yet " +
      "hold the plateau.\n\n" +
      "The empire is at war for another winter with a country that cannot feed its " +
      "armies and an enemy that is not hurrying.",
    ending: { family: "last-stand", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The government did not refuse the terms. What actually happened: the " +
      "armistice of Mudros was signed on 30 October and took effect on the 31st; the " +
      "Ottoman army was demobilised and Fakhri Pasha held Medina for 72 days after it, " +
      "until he was arrested on 10 January 1919. The Allies occupied Constantinople on " +
      "13 November. The national movement that began in Anatolia in 1919 was organised " +
      "by officers, Mustafa Kemal among them, after the army had been demobilised, and " +
      "not by the ministry that had asked for terms. A government that fell back on " +
      "the interior in October 1918 would have had no army to do it with.",
  },

  otto_end_overextended: {
    year: 1918, date: "1918-10-04", city: "Constantinople",
    title: "The Minister Is Dismissed",
    advisors: ["enver"],
    situation:
      "There was no single order that did it. There was an offensive in the snow, an attack " +
      "across a desert, a garrison in the holy cities and an army at the Caspian, each of " +
      "which could be defended and each of which took something the empire did not have.\n\n" +
      "The Sultan decides that he needs a minister of war who can say no to Enver, and has " +
      "none to hand.",
    ending: { family: "hard-mode-overextended", badge: BADGES.CONTESTED, hardModeOnly: true },
    epilogue: () =>
      "What actually happened: the Sultan dismissed Enver as Minister of War on 4 October " +
      "1918, and the rest of Talat's government resigned on 13 October. Ahmed Izzet " +
      "Pasha formed another, and kept the ministry of war himself. An empire that had " +
      "fought on the Caucasus, Sinai, the Hejaz, Mesopotamia, Palestine and the " +
      "Straits at once was not saved by a change of minister. The armistice of Mudros " +
      "followed on 30 October. Enver left on a German submarine on 1 or 2 November. " +
      "The government he served had carried out the Armenian genocide from 1915, " +
      "and neither the dismissal nor the armistice undid any part of it.",
  },
};
