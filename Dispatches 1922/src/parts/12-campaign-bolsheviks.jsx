CAMPAIGNS.bolsheviks = {
  id: "bolsheviks",
  label: "Revolutionary Military Council of the Republic",
  coalition: "red",
  shortTag: "RVS", // identity — fixed regardless of skin choice
  commander: "Leon Trotsky, People's Commissar for War",
  seat: "Revvoensoviet Staff Train",
  thesis: "One war. A Red Army under central command — not the shape of a defeat but the cost of winning: what the Revolution's victory actually required, and of whom.",
  start: "revvoensovietFormed18",

  initialMeters: {
    mobilization: 0,
    warIndustry: 0,
    reliability: 0,
  },
  triangleAxes: [
    { key: "mobilization", label: "MOBILIZATION" },
    { key: "warIndustry", label: "WAR INDUSTRY" },
    { key: "reliability", label: "POLITICAL RELIABILITY" },
  ],
  initialLegitimacy: 0, // "Worker-Peasant Support" — zero-baseline, same convention as the triangle
  plannedEnding: {
    date: "MARCH 1921",
    title: "Kronstadt",
    note:
      "Deliberately past 'the war ends.' This campaign's whole thesis is the cost of winning, not the shape of a defeat — ending at Wrangel's evacuation would let it close on a clean military victory and dodge that. Kronstadt is the moment the war's winners answer to their own sailors and workers for what winning cost. That's the real ending, not the tidy one.",
  },
  hardMode: {
    key: "centralizationBacklash",
    label: "Centralization Backlash",
    capitalName: "ORGBURO MODE",
    capitalLabel: "AUTHORITY CAPITAL",
    description:
      "No rewind, no meter dashboard — only staff reports. Five points of Authority Capital to spend overriding regional Party figures who distrust centralized command — Stalin and Voroshilov's real conflict with Trotsky at Tsaritsyn is the textbook case. Spend all five and the Central Committee moves against you at the fifth override — the campaign ending in political removal, not battlefield defeat. Named for the Orgburo, the real Party body whose job was exactly this: deciding, administratively and without a battlefield involved, who stays in a post and who doesn't.",
    buttonLabel: "OPEN COMMAND",
    maxCap: 5,
    maxEndingId: "endingCentralCommitteeMoves",
  },

  NEWSPAPER_MASTHEAD: "IZVESTIA",
  NEWSPAPER_SUBHEAD: "News — organ of the All-Russian Central Executive Committee",
  ADVISOR_DOSSIERS: {
    trotsky: {
      role: "Chairman, Revolutionary Military Council; People's Commissar for War",
      bio:
        "Built the Red Army from near-total collapse by insisting on conventional military discipline, unified command, and — most controversially within his own party — reliance on ex-Imperial officers ('military specialists') under Bolshevik commissar oversight, over the objection of Party members who saw this as a betrayal of revolutionary principle.",
      fate:
        "Chaired the Revvoensoviet until January 1925. Expelled from the Party in 1927, exiled from the USSR in 1929. Assassinated in Mexico City in August 1940 on Stalin's order.",
      faction: "Revvoensoviet",
      rank: 0,
    },
    stalin: {
      role: "Political Commissar, Southern Front (Tsaritsyn)",
      bio:
        "Sent to Tsaritsyn in June 1918 to secure grain shipments, he stayed to take a direct hand in the city's military defense alongside Voroshilov — openly contemptuous of the ex-Tsarist 'specialists' Trotsky's doctrine depended on, and willing to appeal past Trotsky directly to Lenin when overruled.",
      fate:
        "Recalled from Tsaritsyn in October 1918 after Trotsky threatened Voroshilov with court-martial. The conflict was not forgotten by either man. Stalin became General Secretary of the Party in 1922 and, after Lenin's death, systematically removed Trotsky from power.",
      faction: "Southern Front / Party",
      rank: 1,
    },
    tukhachevsky: {
      role: "Commander, Western Front (Polish war, 1920); Commander, Suppression of Kronstadt (1921)",
      bio:
        "A Guards lieutenant before the war and a German prisoner who escaped on his fifth attempt, he joined the Bolsheviks in 1918 and had an army at twenty-five. His advance to the Vistula in August 1920 covered nearly 400 miles in six weeks and stopped at the gates of Warsaw with his left flank uncovered — the Cavalry Army it needed was committed at Lwów under a different front. He commanded the assault across the ice at Kronstadt seven months later.",
      fate:
        "Blamed the loss of Warsaw on the South-Western Front's refusal to release the Cavalry Army; Stalin, that front's political member, blamed Tukhachevsky's overextension. The two men argued it in print through the 1920s and never settled it. Tukhachevsky became a Marshal of the Soviet Union in 1935 and was arrested, convicted in a closed proceeding, and shot in June 1937. Budyonny and Voroshilov — the other principals in the Vistula argument — sat on the tribunal that condemned him. He was posthumously exonerated in 1957.",
      faction: "Western Front",
      rank: 2,
    },
    budyonny: {
      role: "Cavalry Corps Commander, Southern Front",
      bio:
        "A former Imperial Army cavalry NCO, one of the few senior Red cavalry commanders who rose from the ranks rather than through the voenspetsy system. Pushed hard for concentrating scattered cavalry divisions into a single strategic-scale formation rather than parceling them out to individual infantry armies.",
      fate:
        "Commanded the First Cavalry Army through its formation in November 1919 and its decisive role in breaking Denikin's retreat. Survived the purges of the 1930s that killed most of his fellow Civil War-era commanders, becoming one of the Soviet Union's first Marshals.",
      faction: "Southern Front Cavalry",
      rank: 2,
    },
    frunze: {
      role: "Commander, Southern Front (from 1920)",
      bio:
        "A career revolutionary rather than a military specialist by original training, he proved to be one of the Red Army's most effective operational commanders — the Perekop-Sivash operation against Wrangel's Crimea defenses is generally regarded as his signature achievement of the war.",
      fate:
        "Went on to lead Soviet military reforms in the early 1920s and briefly headed the Revvoensoviet after Trotsky. Died in October 1925 during surgery Stalin had pressured him to undergo — a death Boris Pilnyak's fictionalized account later suggested was no accident, though this remains disputed among historians rather than established fact.",
      faction: "Southern Front",
      rank: 2,
    },
    kamenev: {
      role: "Commander-in-Chief of the Red Army (from July 1919)",
      bio:
        "A former Imperial Army colonel who replaced Vatsetis as Commander-in-Chief, generally credited (though the exact authorship of the competing plans is still disputed by historians) with the Southern Front strategy that eventually broke Denikin's advance.",
      fate:
        "Remained a senior Red Army commander through the 1920s and early 1930s. Died of natural causes in 1936, shortly before the purges that would very likely have killed him had he lived a few years longer.",
      faction: "Red Army High Command",
      rank: 1,
    },
    smirnov: {
      role: "Leader, Military Opposition faction",
      bio:
        "A former factory worker and Old Bolshevik who had never held a weapon before the Civil War forced him to. Commanded real respect from the soldiers who served under him at Sviyazhsk in 1918, and later played a direct role in the operations that led to Kolchak's defeat and execution. Led the Military Opposition's genuine, if ultimately unsuccessful, push at the 8th Congress to limit reliance on ex-Tsarist specialist officers.",
      fate:
        "Later joined the Left Opposition and was expelled from the Party in 1927. Arrested in 1933, brought before the first Moscow Trial in August 1936 on fabricated charges of plotting with Trotsky against Stalin, and executed the same month.",
      faction: "Military Opposition",
      rank: 2,
    },
    kalinin: {
      role: "Chairman, All-Russian Central Executive Committee",
      bio:
        "The Soviet state's nominal head, from a peasant background himself — sent to Kronstadt on March 1, 1921, to address the sailors directly, alongside Fleet Commissar Kuzmin. The government's own account of that meeting concedes it went badly, hardening the rebellion rather than calming it.",
      fate:
        "Remained the USSR's ceremonial head of state until 1946, a rare senior Bolshevik of his generation to die of natural causes rather than execution or purge, in June 1946.",
      faction: "Central Executive Committee",
      rank: 1,
    },
    lenin: {
      role: "Chairman, Council of People's Commissars",
      bio:
        "Backed Trotsky's authority over the Southern Front's own chain of command in the Tsaritsyn dispute, and over the Military Opposition at the 8th Congress — while remaining, throughout, the one figure both Trotsky and Stalin needed to stay on good terms with rather than each other.",
      fate:
        "Suffered a severe stroke in May 1922, a second in December 1922, and a third in March 1923 that left him unable to speak. Died on January 21, 1924, having spent his final year largely incapacitated while Stalin, Trotsky, and others maneuvered for succession around him.",
      faction: "Council of People's Commissars",
      rank: 0,
    },
  },

  NODE_ATLAS: [
    { id: "revvoensovietFormed18", date: "SEPTEMBER 1918", title: "The Staff Train: A Council of War" },
    { id: "tsaritsynCrisis18", date: "OCTOBER 1918", title: "Tsaritsyn: A Question of Command" },
    { id: "tsaritsynAftermath18", date: "NOVEMBER 1918", title: "Tsaritsyn: What Comes of the First Decision" },
    { id: "stalinsRecall18", date: "DECEMBER 1918", title: "Moscow: A Second Recall" },
    { id: "grainRequisition18", date: "DECEMBER 1918", title: "The Grain Committees" },
    { id: "stalinsNewPosting18", date: "JANUARY 1919", title: "Moscow: How Real a Posting" },
    { id: "supplyShortfall19", date: "JANUARY 1919", title: "The Shell Ledger" },
    { id: "supplyRationingConsequence19", date: "FEBRUARY 1919", title: "Moscow: Two Commanders, One Complaint" },
    { id: "militaryOppositionCongress19", date: "MARCH 1919", title: "The Eighth Congress: A Vote Twice" },
    { id: "congressFallout19", date: "MARCH 1919", title: "After the Vote: What to Do With the Defeated" },
    { id: "smirnovReassignment19", date: "MARCH 1919", title: "Moscow: What to Do With a Marginalized Commander" },
    { id: "southernFrontPlan19", date: "JULY 1919", title: "Moscow: Two Plans, One Front" },
    { id: "donbasMobilization19", date: "AUGUST 1919", title: "Yuzovka: Miners, Not Soldiers" },
    { id: "donbasAttrition19", date: "SEPTEMBER 1919", title: "Yuzovka: What's Left of the Battalions" },
    { id: "reinforcedBattalionsTest19", date: "OCTOBER 1919", title: "Yuzovka: The Name Under Fire" },
    { id: "cavalryArmyDebate19", date: "NOVEMBER 1919", title: "Voronezh: One Army or Many" },
    { id: "distributedPursuit19", date: "DECEMBER 1919", title: "The Screen That Wasn't There" },
    { id: "polishWar20", date: "AUGUST 1920", title: "The Vistula: Warsaw or Lwów" },
    { id: "perekopAssault20", date: "NOVEMBER 1920", title: "Perekop: The Last Isthmus" },
    { id: "compressedEvacuation20", date: "NOVEMBER 1920", title: "The Clock Wrangel Didn't Have" },
    { id: "kronstadt21", date: "MARCH 1921", title: "Kronstadt: Soviets Without Us" },
  ],
  NODE_TOTAL: 21,
  ENDINGS_GALLERY: [
    { id: "endingIceBroken", title: "The Ice Broken", classification: "historical" },
    { id: "endingTheVistula20", title: "The Vistula", classification: "historical" },
    { id: "endingTheAutumnCrisis19", title: "The Autumn Crisis", classification: "speculative" },
    { id: "endingTheIsland21", title: "The Island", classification: "speculative" },
    { id: "endingHollowVictory21", title: "A Hollow Victory", classification: "speculative" },
    { id: "endingUnlikelyPrecedent", title: "An Unlikely Precedent", classification: "speculative" },
    { id: "endingCentralCommitteeMoves", title: "The Central Committee Moves", classification: "speculative" },
  ],
  ENDING_CLASSIFICATION: {
    endingIceBroken: "historical",
    endingTheVistula20: "historical",
    endingTheAutumnCrisis19: "speculative",
    endingTheIsland21: "speculative",
    endingHollowVictory21: "speculative",
    endingUnlikelyPrecedent: "speculative",
    endingCentralCommitteeMoves: "speculative",
  },

  resolveNode(nodeId, flags = {}, meters = {}) {
    switch (nodeId) {
      // ---------------------------------------------------------------------
      case "revvoensovietFormed18":
        return {
          date: "SEPTEMBER 1918",
          title: "The Staff Train: A Council of War",
          bulletin: {
            headline: "PEACE BOUGHT TIME, NOT CONSENSUS",
            body: "Brest-Litovsk, March: a quarter of the old empire's population and most of its heavy industry, ceded to Germany over furious internal opposition. Trotsky's own delegation walked out twice before Lenin's argument won the room — a government destroyed by continuing the war builds socialism nowhere. The intervention came anyway. British, French, now American and Japanese troops have landed at Archangel and Vladivostok this same month, declared purpose the Legion's evacuation and Allied matériel. In practice: material support for whichever anti-Soviet force each army happens to be standing near.",
            meanwhile: {
              southRussia: "The Volunteer Army survives Kornilov's death at Ekaterinodar back in April and is rebuilding under Denikin — still a modest, Kuban-based force, not yet unified under the AFSR name that arrives in January.",
              siberia: "The Czechoslovak Legion's May revolt has broken Bolshevik authority across Siberia entirely. A moderate coalition government — the Ufa Directory — is forming this same month to unite the region's anti-Bolshevik factions, though it will not survive the winter either.",
            },
          },
          historicalRecord: true,
          situation:
            "The Republic has been declared a single armed camp. You chair the new Revolutionary Military Council with sweeping authority over every front — and an army built from a collapsed one, led in most technical respects by men who fought for the Tsar. The Military Opposition faction argues that trusting former Imperial officers, even under commissar watch, betrays the revolution that just overthrew them.",
          choices: [
            {
              label: "Commit to the voenspetsy system: ex-Imperial officers under Bolshevik commissar oversight, army-wide.",
              advisor: {
                name: "Trotsky",
                quote:
                  "We did not abolish the General Staff's competence when we abolished its politics. A commissar at every officer's shoulder costs us nothing we cannot afford and saves us everything an army built from enthusiasm alone would lose on the first real battlefield.",
              },
              historical: true,
              setFlags: { specialistPolicy: "voenspetsy" },
              impact: {},
              next: "tsaritsynCrisis18",
              outcome:
                "The policy is confirmed and expanded. Competent command returns to units that had none — at the cost of trust the Party's own base does not yet extend to men who wore the Tsar's uniform a year ago.",
            },
            {
              label: "Reject wholesale reliance on specialists. Build command up from proven revolutionary cadres instead.",
              advisor: {
                name: "Stalin",
                quote:
                  "Ruthless competence from a man who despises everything this army stands for is not competence we can rely on when it matters. I would rather have officers who bleed for the revolution than ones who merely tolerate it.",
              },
              historical: false,
              setFlags: { specialistPolicy: "cadres" },
              impact: { mobilization: 2, warIndustry: -3, reliability: 4 },
              next: "militaryOppositionCongress19",
              outcome:
                "The Military Opposition's position wins ground it did not historically hold. Political reliability rises — so does the number of fronts commanded by men learning tactics under fire, against opponents who are not.",
            },
            {
              label: "Split the difference: specialists at senior staff and planning level only, revolutionary cadres in direct troop command.",
              advisor: {
                name: "Lenin",
                quote:
                  "A clean policy in either direction has its appeal — I understand why both sides want one. What the army actually needs is not obviously the same thing. A former Imperial colonel drafting the operational plan and a man the troops actually trust leading them into it are not incompatible positions, whatever this argument between Trotsky and the Opposition would like to pretend.",
              },
              historical: false,
              setFlags: { specialistPolicy: "split_command" },
              impact: { mobilization: 1, warIndustry: -1, reliability: 2 },
              next: "tsaritsynCrisis18",
              outcome:
                "The split holds in principle — specialists plan, cadres command — and immediately runs into the same problem it was meant to avoid: a plan a field commander doesn't trust the author of is a plan that gets modified, ignored, or quietly not executed the moment the fighting starts. The compromise reduces the scale of the trust problem. It does not resolve it.",
            },
          ],
        };

      // ---------------------------------------------------------------------
      // -----------------------------------------------------------------------
      // DIVERGENT BRANCH — downstream of backing the Military Opposition's
      // line at the Revvoensoviet's formation. historicalRecord true here,
      // unusually, because the Congress itself and its vote margins are real
      // regardless of which policy line the player backed beforehand — what's
      // speculative is that this player has more standing in the room than
      // history gave the Opposition, having already committed to their line.
      case "militaryOppositionCongress19":
        return {
          date: "MARCH 1919",
          title: "The Eighth Congress: A Vote Twice",
          bulletin: {
            headline: "THE SAME CONGRESS SEASON FOUNDS AN INTERNATIONAL",
            body: "This Congress's own fight over military policy runs in the same city, the same month, as a larger declaration: the founding of a Communist International, on the record for carrying revolution beyond Russia's borders. Foreign delegate attendance was thin, several parties represented in name only — but no single battle this year will do more to convince the Allied governments this war is worth continuing to fund against.",
            meanwhile: {
              southRussia: "Denikin's forces are regrouping through the winter, still short of the offensive strength that produces the Moscow Directive in July.",
              siberia: "Kolchak's own spring offensive is underway, launched this same month — briefly reaching toward the Volga before the Red counteroffensive out of Buguruslan reverses it by early summer.",
            },
          },
          historicalRecord: true,
          situation:
            "The Military Opposition — delegates uneasy with the Party's shrinking control over an army increasingly led by ex-Tsarist officers and filled with conscripted peasants — has forced the military question onto the floor of the Party's Eighth Congress. In the closed military-section vote, their position actually wins, 37 to 20. The full Congress still has to vote. Having already sided with their line in September, you have real standing in this room that the historical Opposition never had.",
          choices: [
            {
              label: "Press the advantage from the closed-session win. Push for the Opposition's platform in the full Congress vote.",
              advisor: {
                name: "Smirnov",
                quote:
                  "We won the room that actually understands the army's condition. If we cannot carry that into the full Congress, the closed vote was worth nothing but the appearance of a debate we were always going to lose anyway.",
              },
              historical: false,
              setFlags: { congressChoice: "press" },
              // Threshold tightened round 22 (-4 -> -2): simulation showed
              // this campaign's three gated axes binding in only ~13-14% of
              // runs against southRussia's ~45-51% and siberia's ~18-19%,
              // meaning choices here carried less real consequence than the
              // other two campaigns. See dispatches-1922-round22-recommendations.md.
              gate: (m) => m.reliability >= -2,
              disabledReason: "Political reliability too low to press an advantage — a command this distrusted does not win a floor fight, it becomes one.",
              impact: { reliability: 3, mobilization: -2 },
              next: "congressFallout19",
              outcome:
                "The push happens — and the full Congress votes it down anyway, 174 to 95, the same margin history recorded regardless of the closed session's result. What's different is that this defeat lands harder, on delegates who genuinely believed the closed-session win meant something more than a symbolic concession.",
            },
            {
              label: "Take the closed-session win as leverage for a negotiated concession rather than forcing an unwinnable floor fight.",
              advisor: {
                name: "Trotsky",
                quote:
                  "You have already shown me the closed vote can go against my policy. I am telling you plainly that more red commanders trained at the Academy is a concession I can actually make. A floor fight I have to win by 79 votes is not a negotiation — it's a formality neither of us needs.",
              },
              historical: true,
              setFlags: { congressChoice: "negotiate" },
              impact: {},
              next: "southernFrontPlan19",
              outcome:
                "The negotiated path holds. It produces, historically, exactly the concession Trotsky describes — increased training of proletarian 'red commanders' at the General Staff Academy — without forcing a floor fight neither side was fully certain of winning cleanly.",
            },
          ],
        };

        // -----------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of pressing the Opposition's advantage
        // into a full-Congress defeat. historicalRecord false: the specific
        // aftermath scene is invented, since the historical path (negotiate)
        // never produced this defeat to have an aftermath from.
        case "congressFallout19":
          return {
            date: "MARCH 1919",
            title: "After the Vote: What to Do With the Defeated",
            historicalRecord: false,
            situation:
              "The floor defeat is worse for morale than a clean loss would have been — delegates who believed the closed-session win meant something are now watching Smirnov's faction absorb a public rebuke instead. How you handle the Opposition's leadership in the weeks after matters for whether this becomes a closed chapter or an open wound.",
            choices: [
              {
                label: "Marginalize the Opposition's leadership publicly. Make clear that further factional organizing won't be tolerated.",
                advisor: {
                  name: "Trotsky",
                  quote:
                    "A defeated faction that is allowed to regroup as though nothing happened will simply relitigate this fight at the next Congress. I would rather close this argument decisively now than refight it every six months.",
                },
                historical: false,
                setFlags: { congressFallout: "marginalized" },
                impact: { reliability: -3 },
                costsCapital: true,
                next: "smirnovReassignment19",
                outcome:
                  "Smirnov and his allies are sidelined from further military-policy influence. The argument doesn't resurface at the next Congress — it simply goes underground, resentment intact, waiting for a moment less favorable to central authority than this one.",
              },
              {
                label: "Quietly fold some of the Opposition's concerns into policy without public concessions, defusing resentment without a rematch.",
                advisor: {
                  name: "Smirnov",
                  quote:
                    "I do not need a victory lap. I need to know the men who voted for us in the closed session aren't simply going to watch their concerns disappear because the full floor happened to go the other way.",
                },
                historical: false,
                setFlags: { congressFallout: "absorbed" },
                impact: { reliability: 2, mobilization: -1 },
                next: "southernFrontPlan19",
                outcome:
                  "Quiet accommodation replaces public discipline. It costs a little operational efficiency — some of the Opposition's preferences do make it into practice, informally, in ways the historical negotiated settlement never had to accommodate — and it buys something closer to real reconciliation than a formal defeat would have.",
              },
            ],
          };

        // -----------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of marginalizing Smirnov's faction.
        // historicalRecord false: this specific reassignment decision is
        // invented, but it tests a real tension already established in his
        // own dossier — Smirnov was a genuinely capable field commander
        // (Sviyazhsk, 1918) as well as a political dissenter, and marginal-
        // izing the politician doesn't make the competent officer disappear.
        case "smirnovReassignment19":
          return {
            date: "MARCH 1919",
            title: "Moscow: What to Do With a Marginalized Commander",
            historicalRecord: false,
            situation:
              "Smirnov is politically sidelined, but the Southern Front still needs commanders who can deliver results in the field, and his record at Sviyazhsk the previous year is not in serious dispute even among the people who just voted down his politics. Leaving him without a real command wastes a genuine asset. Giving him one hands a marginalized dissenter exactly the kind of visible field success that rebuilds political standing.",
            choices: [
              {
                label: "Assign him a real field command anyway. The Front needs competent officers more than it needs a tidy political narrative.",
                advisor: {
                  name: "Lenin",
                  quote:
                    "I did not spend my own career choosing between competence and loyalty when I could help it, and I am not going to start recommending it now on someone else's behalf. Use the man. Watch him. Those are not mutually exclusive instructions.",
                },
                historical: false,
                setFlags: { smirnovAssignment: "field_command" },
                impact: { mobilization: 2 },
                next: "southernFrontPlan19",
                outcome:
                  "Smirnov gets a field command, and performs in it about as well as his record predicted. The marginalization holds politically — he is not restored to military-policy influence — but the Front is better for having a genuinely capable officer in a genuinely operational role, whatever that means for how cleanly this decision reads on paper.",
              },
              {
                label: "Keep him away from field command as well. A marginalization that still hands him visible successes isn't really a marginalization.",
                advisor: {
                  name: "Trotsky",
                  quote:
                    "What we lose operationally is real, and I am not pretending otherwise. What it costs the argument we just won — watching the man we just defeated politically become, inside a month, the name attached to this Front's next real victory — is worse, and considerably harder to explain at the next Congress.",
                },
                historical: false,
                setFlags: { smirnovAssignment: "sidelined" },
                impact: { mobilization: -2, reliability: -1 },
                next: "southernFrontPlan19",
                outcome:
                  "Smirnov stays away from field command. The political marginalization holds cleanly — and the Front does without a commander whose competence nobody in the room, including the people who just voted against him, seriously disputed.",
              },
            ],
          };

      case "tsaritsynCrisis18":
        return {
          date: "OCTOBER 1918",
          title: "Tsaritsyn: A Question of Command",
          bulletin: {
            headline: "GERMANY IS COLLAPSING. THE PEACE THAT COST US UKRAINE MAY NOT OUTLIVE HER.",
            body: "Bulgaria has capitulated; the Ottoman position is disintegrating; the German army is falling back across the Western Front and Berlin has begun approaching Washington about terms. If Germany surrenders, the Brest-Litovsk treaty that cost the Republic Ukraine, the Baltics, and a quarter of its population becomes a dead letter — annulled by the victors, not by us. The peace Lenin was denounced across the Party for signing may be voided within weeks by events entirely outside this government\'s control.",
            meanwhile: {
              southRussia: "Denikin\'s Volunteer Army has taken the Kuban and is consolidating; German withdrawal from Ukraine will open ground that the AFSR is better placed to occupy than the Republic is.",
              siberia: "A moderate coalition government at Ufa is being pushed aside; within weeks an admiral in Omsk will be Supreme Ruler, and the eastern front will have a single command for the first time.",
            },
          },
          historicalRecord: true,
          situation:
            "Stalin and Voroshilov have secured Tsaritsyn against Krasnov's Don Cossacks — the same city Wrangel's Caucasus Army will fight to take from the Red 10th Army eight months from now. But they have done it by sidelining the specialist officers your own policy sent them, and now telegraph Lenin directly, over your head, accusing your command of incompetence." +
            (flags.specialistPolicy === "split_command"
              ? " The compromise policy was supposed to keep exactly this from happening — specialists confined to staff and planning, revolutionary cadres in direct troop command, so neither side would have grounds to route around the other. It hasn't worked at Tsaritsyn: Voroshilov commands the city outright, and the planning officers this command did send report being consulted only after decisions are already made."
              : ""),
          choices: [
            {
              label: "Assert central authority. Threaten Voroshilov with court-martial and have Stalin recalled from the front.",
              advisor: {
                name: "Trotsky",
                quote:
                  "Tsaritsyn obeys the Revvoensoviet, or it explains to the Republic why it does not. I did not build a unified command to watch it dissolve into a dozen private armies the moment a Party figure decides his instincts outrank the General Staff.",
              },
              historical: true,
              setFlags: { tsaritsynOutcome: "recalled" },
              impact: {},
              costsCapital: true,
              next: "grainRequisition18",
              outcome:
                "The recall order goes through Lenin, who backs the Revvoensoviet's authority over the Southern Front's own chain of command. Stalin leaves Tsaritsyn — the dispute itself does not end here, and will not be forgotten by either man. Whether Voroshilov's own forces treat a recall of his patron as an order to fall in line or as one more reason to resent a command that was never out here with them is a separate, genuinely open question.",
              // Added round 22 — bolsheviks previously had only 1 uncertain
              // choice in the whole campaign (vs. 7 in southRussia, 4 in
              // siberia). The recall itself is fixed historical fact; how
              // cleanly Voroshilov's own command actually absorbs it is the
              // kind of secondary detail the record doesn't settle.
              uncertain: (() => {
                const smoothWeight = modWeight(55, meterPct(meters.reliability));
                return [
                  {
                    weight: smoothWeight,
                    title: "Voroshilov falls in line",
                    setFlags: { voroshilovCompliance: "smooth" },
                    impact: { mobilization: 1 },
                    outcome:
                      "Whatever Voroshilov says privately, Tsaritsyn's defenses pass to the officers the Revvoensoviet actually sent without a second confrontation. The recall holds as more than a piece of paper.",
                  },
                  {
                    weight: 100 - smoothWeight,
                    title: "The city quietly keeps answering to Voroshilov anyway",
                    setFlags: { voroshilovCompliance: "friction" },
                    impact: { mobilization: -2, reliability: -1 },
                    outcome:
                      "The recall order is obeyed on paper. In practice, the officers arriving to take up the posts it specifies find a garrison that still checks with Voroshilov before it checks with them — a chain of command that was never really broken, just made harder to see.",
                  },
                ];
              })(),
            },
            {
              label: "Conciliate. Let Tsaritsyn's command stand as it is rather than force a rupture with Stalin.",
              advisor: {
                name: "Stalin",
                quote:
                  "The city held. That is the only test that matters to the men who fought for it, and it should be the only test that matters to you. Discipline a commander for winning and you will find fewer of them willing to win the next city.",
              },
              historical: false,
              setFlags: { tsaritsynOutcome: "conciliated" },
              impact: { reliability: -3, mobilization: 2 },
              next: "tsaritsynAftermath18",
              outcome:
                "The authority of the Revvoensoviet goes untested at Tsaritsyn. The precedent is not lost on every other front commander watching to see what centralized command actually means in practice.",
            },
            {
              label: "Separate the two questions. Discipline Voroshilov specifically for bypassing the specialists — but leave Stalin's political oversight of the city in place.",
              advisor: {
                name: "Lenin",
                quote:
                  "The complaint against Tsaritsyn was always really two complaints wearing one telegram — a military commander who ignored the General Staff, and a political commissar who backed him. I am not convinced both problems require the same solution, or that solving them together is actually simpler than solving them apart.",
              },
              historical: false,
              setFlags: { tsaritsynOutcome: "split_discipline" },
              impact: { reliability: -1, mobilization: 1 },
              next: "tsaritsynAftermath18",
              outcome:
                "Voroshilov is formally reprimanded for the specialist question specifically; Stalin's political role at Tsaritsyn goes untouched. It is a narrower assertion of authority than the full recall, and a less complete concession than leaving both men alone — whether splitting the two questions actually resolves either one, or just produces a result nobody involved reads as a clear outcome, is genuinely unclear even to the people making the decision.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // DIVERGENT BRANCH — downstream of leaving Stalin and Voroshilov's
      // command at Tsaritsyn unchecked. historicalRecord false: the specific
      // scene is invented, but it's grounded in the well-established, broadly
      // uncontested characterization of the Tsaritsyn group's real hostility
      // to voenspetsy coordination in this period.
      case "tsaritsynAftermath18":
        // Genuinely different situation text depending on which upstream
        // choice led here — a real continuity bug, not a stylistic gap.
        // "conciliated" means Voroshilov was never actually disciplined, so
        // "left unchecked" is accurate. "split_discipline" means Voroshilov
        // WAS already reprimanded on the specialist question specifically —
        // describing him as still operating completely unchecked
        // contradicts what that choice's own outcome text just said.
        if (flags.tsaritsynOutcome === "split_discipline") {
          return {
            date: "NOVEMBER 1918",
            title: "Tsaritsyn: What a Narrow Reprimand Didn't Reach",
            historicalRecord: false,
            situation:
              "Voroshilov's formal reprimand covered the specialist question specifically — the exact orders he was disciplined for bypassing. It didn't cover the broader pattern underneath it: Stalin's own political authority at Tsaritsyn, left untouched by design, still favors loyalists over men who know the terrain in every appointment that isn't the one narrow issue already addressed. A voenspets colonel assigned to the sector has just resigned rather than continue serving under a command that routes around his orders in every way except the one that was formally corrected.",
            choices: [
              {
                label: "Extend the reprimand's logic. Address the broader pattern, not just the single incident already corrected.",
                advisor: {
                  name: "Trotsky",
                  quote:
                    "A narrow correction that leaves the underlying pattern untouched was never going to hold past the first new resignation. I would rather finish the argument now than relitigate it one voenspets colonel at a time.",
                },
                historical: false,
                setFlags: { tsaritsynAftermath: "extended" },
                impact: { reliability: 3, mobilization: -2 },
                next: "stalinsRecall18",
                outcome:
                  "The intervention widens past the single reprimand into the broader pattern it was always going to eventually have to address. It costs more now than addressing it fully the first time would have — narrow corrections rarely stay narrow once the underlying problem resurfaces.",
              },
              {
                label: "Let the narrow reprimand stand as the full response. A second intervention risks looking like the first one wasn't real.",
                advisor: {
                  name: "Stalin",
                  quote:
                    "You already drew a line once. Redrawing it now, wider, tells every command watching that the first line was never the real one — which is a worse lesson than one more resignation over an appointment that was always going to favor trust over unfamiliarity.",
                },
                historical: false,
                setFlags: { tsaritsynAftermath: "held_narrow" },
                impact: { reliability: -2, mobilization: 1 },
                next: "grainRequisition18",
                outcome:
                  "The narrow reprimand stands as the complete response. The broader pattern it didn't reach continues — a coordination gap the specific correction was never going to close on its own.",
              },
            ],
          };
        }
        return {
          date: "NOVEMBER 1918",
          title: "Tsaritsyn: The Cost of Being Right",
          historicalRecord: false,
          situation:
            "Left unchecked, Stalin and Voroshilov's command at Tsaritsyn has kept doing what it was already doing before you declined to intervene — sidelining the specialist officers assigned to coordinate rail movement and artillery placement in favor of men they trust politically over men who actually know the terrain. A voenspets colonel assigned to the sector has just resigned rather than continue serving under a command that routes around his orders. His replacement is a political appointee with no comparable experience.",
          choices: [
            {
              label: "Reassert Revvoensoviet authority now, even though the moment to do it cleanly at Tsaritsyn has already passed.",
              advisor: {
                name: "Trotsky",
                quote:
                  "I let this stand once already. I am not required to let a second resignation pass unanswered simply because the first one did. This is precisely the drift a unified command exists to stop.",
              },
              historical: false,
              setFlags: { tsaritsynAftermath: "reasserted" },
              impact: { reliability: 4, mobilization: -3 },
              next: "stalinsRecall18",
              outcome:
                "The intervention comes late enough to look like it, and costs more political capital than acting at Tsaritsyn itself would have. Stalin does not forget being overruled twice on the same question.",
            },
            {
              label: "Let it stand. A second intervention this soon would look like the first decision was a mistake.",
              advisor: {
                name: "Stalin",
                quote:
                  "You already decided this question once. Reversing yourself now teaches every front commander watching that your decisions are provisional until someone complains loudly enough — which is a worse lesson for the army than one voenspets colonel's resignation.",
              },
              historical: false,
              setFlags: { tsaritsynAftermath: "unaddressed" },
              impact: { reliability: -4, mobilization: 1 },
              next: "grainRequisition18",
              outcome:
                "The resignation stands unaddressed. The coordination gap it leaves behind is small but structural — the kind that compounds quietly rather than announcing itself as a single costly failure.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // DIVERGENT BRANCH — downstream of overruling Stalin a second time.
      // historicalRecord false: this specific recall scene is invented, but
      // it's grounded in a real, well-documented fact — Stalin's actual
      // recall from the Southern Front happened in this same general window,
      // and the personal friction with Trotsky it hardened outlasted the
      // Civil War itself by decades.
      case "stalinsRecall18":
        return {
          date: "DECEMBER 1918",
          title: "Moscow: A Second Recall",
          historicalRecord: false,
          situation:
            "The order recalling Stalin from the Southern Front a second time has gone through Lenin without objection — the Revvoensoviet's authority holds, again, on paper. Whether it costs more than it buys is a separate question from whether it was won.",
          choices: [
            {
              label: "Reassign Stalin to a role with real responsibility, rather than let the recall read as pure punishment.",
              advisor: {
                name: "Lenin",
                quote:
                  "A capable man humiliated twice in one year is not a man who forgets it quietly. Give him something real to do and the recall reads as reassignment. Give him nothing and it reads exactly like what it is.",
              },
              historical: false,
              setFlags: { stalinRecallHandling: "reassigned" },
              impact: { reliability: 2 },
              next: "stalinsNewPosting18",
              outcome:
                "Stalin is given a genuine new posting rather than left idle. It does not undo the resentment — nothing was ever going to — but it denies the recall the cleanest possible reading as a pure humiliation.",
            },
            {
              label: "Leave the reassignment unresolved. The recall itself is the message; a new posting can wait.",
              advisor: {
                name: "Trotsky",
                quote:
                  "I am not in the business of softening a decision I believe was correct. If the message is uncomfortable, it should be — that is what makes it a message rather than a formality.",
              },
              historical: false,
              setFlags: { stalinRecallHandling: "unresolved" },
              impact: { reliability: -2 },
              costsCapital: true,
              next: "grainRequisition18",
              outcome:
                "The recall stands with no immediate reassignment. Whatever this costs in Stalin's own long memory of the incident is not a cost this war's own timeline gets to see paid — but the ledger, whoever eventually reads it, will show it was opened here.",
            },
          ],
        };

        // -----------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of giving Stalin a genuine new
        // posting rather than leaving the recall unresolved. historicalRecord
        // false: the specific posting and its handling here are invented,
        // testing what "real responsibility" actually requires of the people
        // who have to decide how much genuine authority to attach to it.
        case "stalinsNewPosting18":
          return {
            date: "JANUARY 1919",
            title: "Moscow: How Real a Posting",
            historicalRecord: false,
            situation:
              "The new posting holds up on paper — a role with content, not a face-saving formality. Whether it comes with the authority the title implies, or with enough oversight attached that everyone involved understands it's still probationary, is a decision that hasn't been made yet. The distinction matters more to how this plays out than the posting's name does." +
              (flags.stalinRecallHandling === "unresolved"
                ? " The recall itself was left to stand as the whole of the message, which means this posting is the first thing said to him since. It will be read as the answer to a question nobody formally asked."
                : ""),
            choices: [
              {
                label: "Give the posting real authority, with minimal additional oversight beyond what any comparable role would get.",
                advisor: {
                  name: "Lenin",
                  quote:
                    "A reassignment that comes wrapped in obvious extra scrutiny is not actually a reassignment — it is the recall, continued, with better paperwork. If we are going to do this, we should do it in a way he can't reasonably read as another humiliation.",
                },
                historical: false,
                setFlags: { postingAuthority: "real" },
                impact: { reliability: 3, mobilization: -1 },
                next: "grainRequisition18",
                outcome:
                  "The posting carries genuine authority. It costs a measure of central oversight over a man the Revvoensoviet has already clashed with twice — a trust extended, not merely gestured at.",
              },
              {
                label: "Attach real but discreet oversight. The posting is genuine; so is the reasonable caution around handing it over cleanly.",
                advisor: {
                  name: "Trotsky",
                  quote:
                    "I am willing to call this a real posting. I am not willing to pretend two prior conflicts didn't happen simply because we're both being polite about the reassignment. The oversight stays — quietly, but it stays.",
                },
                historical: false,
                setFlags: { postingAuthority: "supervised" },
                impact: { reliability: -1, mobilization: 1 },
                next: "grainRequisition18",
                outcome:
                  "The oversight stays, discreetly. The posting is real enough to deny it's a pure humiliation, supervised enough that it never quite becomes the clean trust Lenin's own instinct argued for — a genuine middle position, and one that satisfies neither the full-trust nor the full-caution argument completely.",
              },
            ],
          };

      // ---------------------------------------------------------------------
      case "grainRequisition18":
        return {
          date: "DECEMBER 1918",
          title: "The Grain Committees",
          historicalRecord: true,
          situation:
            "The cities are starving and the army cannot be fed on requisition quotas that keep falling short. The Committees of Poor Peasants and the food-requisitioning detachments can be pushed harder in newly held territory — grain the Republic needs, taken from villages that increasingly see the detachments as a second occupying army." +
            (flags.tsaritsynOutcome === "recalled"
              ? " Tsaritsyn is being administered by a command that has just been publicly overruled from Moscow, and its grain is being counted by men who noticed." +
                (flags.voroshilovCompliance === "friction"
                  ? " The garrison's own requisition returns are late and thin — the same quiet non-compliance that greeted the recall order itself, applied now to the grain count."
                  : "")
              : flags.tsaritsynAftermath === "unaddressed"
              ? " Tsaritsyn's own arrangement was left to stand. The requisition apparatus there answers, in practice, to Stalin and Voroshilov rather than to this office, and the figures it reports should be read accordingly."
              : ""),
          choices: [
            {
              label: "Intensify requisitioning in reconquered territory. The army and the cities eat first.",
              advisor: {
                name: "Trotsky",
                quote:
                  "An army that starves does not win the argument about how grain should be distributed — it simply loses, and the argument is settled by Denikin instead. This is not a policy I am fond of. It is the one that keeps the front supplied through the winter.",
              },
              historical: true,
              setFlags: { requisitionPolicy: "intensified" },
              // Threshold tightened round 22 (-6 -> -3), same bite-rate
              // rationale as above -- kept more conservative than the
              // historical:false gates since this is the historical choice
              // itself (walked by walk-historical.js).
              gate: (m) => m.reliability >= -3,
              disabledReason: "Intensified requisitioning depends on detachments that follow orders in hostile villages. These would not come back.",
              impact: {},
              next: "southernFrontPlan19",
              outcome:
                "The quotas rise. Grain moves to the cities and the front in the short term — and in villages the detachments pass through twice, the distinction between 'the Revolution' and 'the men taking our harvest' is getting harder to draw.",
              // Added round 22, same bolsheviks-uncertain-mechanic rationale
              // as tsaritsynCrisis18 above. The intensification itself is
              // fixed historical policy; whether a given district's
              // resentment stays sullen or tips into open resistance to the
              // detachments is the genuinely contested part — peasant
              // uprisings against requisitioning were a real, recurring
              // feature of this period, not a uniform response.
              uncertain: (() => {
                const containedWeight = modWeight(55, meterPct(meters.reliability));
                return [
                  {
                    weight: containedWeight,
                    title: "Resentment stays sullen, not open",
                    setFlags: { requisitionUnrest: "contained" },
                    impact: { mobilization: 1 },
                    outcome:
                      "The detachments meet the usual hostility and nothing worse. Villages hide grain, drag their feet, and comply — and the quotas, this winter, are met.",
                  },
                  {
                    weight: 100 - containedWeight,
                    title: "A district goes over to open resistance",
                    setFlags: { requisitionUnrest: "revolt" },
                    impact: { mobilization: -2, reliability: -2 },
                    outcome:
                      "One reconquered district doesn't just resent the second pass — it fights it. A requisitioning detachment is driven out at gunpoint before Cheka units restore control, and the episode is the kind villages two counties over hear about within the week.",
                  },
                ];
              })(),
            },
            {
              label: "Ease requisitioning in newly held areas. Buy peasant tolerance at the cost of the supply shortfall.",
              advisor: {
                name: "Stalin",
                quote:
                  "Squeeze a village twice in one winter and you will not need Denikin's army to lose it — it will simply stop being ours in anything but name. There is a cost to that arithmetic too, even if it does not show up on a supply ledger.",
              },
              historical: false,
              setFlags: { requisitionPolicy: "eased" },
              impact: { mobilization: -3, warIndustry: -3 },
              next: "supplyShortfall19",
              outcome:
                "The detachments pull back from their harshest quotas. Whether that buys lasting tolerance or merely delays the same unrest by a season is not a settled question — it is the question the next several years of this policy will actually answer.",
            },
            {
              label: "Dissolve the Committees of Poor Peasants. Fold requisitioning into the regular local Soviets instead.",
              advisor: {
                name: "Kalinin",
                quote:
                  "The kombedy were built to fight the village soviets, not to feed the cities, and in most districts that is exactly and only what they have accomplished. Merge them back into the soviets they were set up to override, and let the requisitioning answer to a body the village has some standing to argue with.",
              },
              historical: false,
              setFlags: { requisitionPolicy: "restructured" },
              impact: { mobilization: 1 },
              next: "southernFrontPlan19",
              outcome:
                "The decree goes out and the kombedy are folded into the re-elected local soviets over the following weeks — this reform is real and dated to this exact winter, though the game follows the intensification thread as its main line; here, this command chose the administrative fix instead. Quotas do not fall. Whether a peasant can tell the difference between a committee and a soviet once both are taking the same grain is a separate question from whether the Republic can.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // DIVERGENT BRANCH — downstream of easing requisitioning. The peasant-
      // tolerance trade-off has a concrete operational cost: thinner reserves
      // heading into a winter with two active fronts. historicalRecord false
      // — this specific rationing scene is invented, grounded in the broadly
      // uncontested fact that Red Army supply was genuinely strained across
      // multiple simultaneous fronts through this period.
      case "supplyShortfall19":
        return {
          date: "JANUARY 1919",
          title: "The Shell Ledger",
          historicalRecord: false,
          situation:
            "The eased quotas have left magazine reserves thinner than planned heading into a winter where both the Southern Front against Denikin and the Eastern Front against Kolchak need resupply simultaneously. The war industry commissariat's honest assessment is that it can fully equip one front's spring operations, or partially equip both — not both fully." +
            (flags.requisitionPolicy === "intensified"
              ? " The detachments were pushed harder in reconquered territory, and the shortfall arrived anyway. What intensification bought was not grain but a countryside that now treats the requisition parties as an enemy formation."
              : flags.requisitionPolicy === "restructured"
              ? " The kombedy were folded into the local soviets rather than pushed harder, which changed who answers for the quota without changing the quota. The shortfall is the same one every path through this decision arrives at — institutional reform was never going to be a substitute for grain that does not exist."
              : ""),
          choices: [
            {
              label: "Prioritize the Southern Front. Denikin's advance is the more immediate threat to the capital.",
              advisor: {
                name: "Trotsky",
                quote:
                  "Kolchak is further from Moscow in every sense that matters militarily. If we starve one front of shells this spring, it should not be the one closest to deciding the whole war by summer.",
              },
              historical: false,
              setFlags: { supplyPriority: "south" },
              impact: { warIndustry: 3, reliability: -2 },
              next: "southernFrontPlan19",
              outcome:
                "The South gets priority. The Eastern Front's spring operations against Kolchak go forward under-supplied — a cost, even if it isn't the one that determines how this war's own chapter, on this front, ends.",
            },
            {
              label: "Split supply evenly between both fronts rather than gamble the war on prioritizing one direction.",
              advisor: {
                name: "War Industry Commissariat Official",
                quote:
                  "I would rather have two fronts slightly underequipped than one front confident and one front collapsing. An even split does not win either campaign quickly. It also does not lose either one for a shortage we could have prevented.",
              },
              historical: false,
              setFlags: { supplyPriority: "split" },
              impact: { warIndustry: -1, mobilization: 1 },
              next: "supplyRationingConsequence19",
              outcome:
                "The split holds. Neither front gets what a full-priority allocation would have bought it — the Southern Front's own campaign against Denikin proceeds with exactly the margin this choice left it, no more.",
            },
          ],
        };

        // -----------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of splitting supply evenly rather
        // than prioritizing one front. historicalRecord false: this specific
        // consequence is invented, testing what an even split actually costs
        // in practice once both fronts discover neither got what a full
        // allocation would have.
        case "supplyRationingConsequence19":
          return {
            date: "FEBRUARY 1919",
            title: "Moscow: Two Commanders, One Complaint",
            historicalRecord: false,
            situation:
              "Both front commanders have now formally objected to the split allocation — not because either believes the other front deserves nothing, but because each is certain his own front is the one that actually needed the full quota. Whether to hold the split as policy or quietly favor whichever front's complaint sounds more urgent this week is now a recurring administrative choice rather than a single decision already made." +
              (flags.supplyPriority === "split"
                ? " The split was chosen deliberately over giving either front its full quota. Both commanders know that, which is why neither is treating his objection as a request rather than a grievance."
                : ""),
            choices: [
              {
                label: "Hold the split as firm policy. Neither front gets to argue its way into a larger share through persistence.",
                advisor: {
                  name: "Trotsky",
                  quote:
                    "A policy that bends every time a front commander complains loudly enough is not a policy — it is an invitation to complain loudly. I would rather hold an imperfect split than reward whichever commander is most persistent this month.",
                },
                historical: false,
                setFlags: { rationingConsequence: "held_firm" },
                impact: { reliability: 2, warIndustry: -1 },
                next: "southernFrontPlan19",
                outcome:
                  "The split holds regardless of complaint. Both fronts learn, over the following weeks, that the allocation is not actually negotiable — which costs some goodwill and buys a predictability neither front had reason to expect otherwise.",
              },
              {
                label: "Quietly adjust allocation toward whichever front's need looks most acute in the moment.",
                advisor: {
                  name: "War Industry Commissariat Official",
                  quote:
                    "I understand the argument for a fixed policy. I am the one who has to explain to whichever front is actually collapsing this week why the ledger says the allocation was decided in January and isn't up for revision in February.",
                },
                historical: false,
                setFlags: { rationingConsequence: "adjusted" },
                impact: { warIndustry: 2, reliability: -2 },
                next: "southernFrontPlan19",
                outcome:
                  "The allocation flexes toward whichever front's need is most acute this week. It's more responsive than the firm split — and it means neither commander can actually plan against a fixed number, which has its own real cost that doesn't show up on the same ledger the flexibility was meant to protect.",
              },
            ],
          };

      // ---------------------------------------------------------------------
      case "southernFrontPlan19":
        return {
          date: "JULY 1919",
          title: "Moscow: Two Plans, One Front",
          bulletin: {
            headline: "VERSAILLES REDRAWS EUROPE. THE REPUBLIC IS NOT INVITED.",
            body: "The treaty signed at Versailles on 28 June settles the war Russia bled in for three years, and no Russian delegation of any kind attended. Article 116 obliges Germany to abandon Brest-Litovsk and to respect the independence of every territory that was Russian in August 1914 — a clause written for the Republic\'s benefit by governments currently arming the armies trying to destroy it. The Comintern\'s argument in March, that this order will not admit a workers\' state and must be overturned rather than joined, has been answered in the most direct terms available.",
            meanwhile: {
              southRussia: "Denikin took Kharkov in June and has issued the Moscow Directive — a broad-front advance on the capital, the most ambitious White order of the war.",
              siberia: "Kolchak\'s front is in retreat toward the Urals, and the Allied recognition Omsk was offered came attached to conditions about a Constituent Assembly it has no position to convene.",
            },
          },
          historicalRecord: true,
          situation:
            "Denikin's Moscow Directive is spreading across every axis of the Southern Front at once — the same order the AFSR's own staff drafted at Tsaritsyn. Lenin has just demanded the Republic become 'a single armed camp' against it. Sergei Kamenev, newly installed as Commander-in-Chief, proposes concentrating the Republic's reserves toward Tsaritsyn and the Kuban Cossack lands — uncertain territory, but a direct strike at the base Denikin's whole campaign depends on. Several of your own commissars argue instead for the Donbas: denser rail, a Ukrainian industrial workforce presumed friendlier to the Revolution, and none of the risk of marching Red conscripts through hostile Cossack country. Even historians who have gone through the surviving orders still dispute which plan was actually whose." +
              (flags.specialistPolicy === "voenspetsy"
                ? " Kamenev holds his post because this command committed to the specialist system army-wide. The plan carries the authority of that decision and the resentment it generated in equal measure."
                : flags.specialistPolicy === "cadres"
                ? " Kamenev is proposing this to a command that rejected wholesale reliance on ex-Imperial officers. His professional judgment arrives with less institutional weight behind it than the office would normally carry."
                : flags.specialistPolicy === "split_command"
                ? " Kamenev occupies exactly the senior planning role the split-command compromise reserved for specialists. Whether that compromise means his plan gets executed as written by cadre commanders in the field is the question this decision is about to test."
                : "") +
              (flags.requisitionUnrest === "revolt"
                ? " The grain detachments' open clash with a reconquered district this past winter is still fresh enough that every plan touching Ukrainian ground gets read, this week, against that news."
                : flags.requisitionUnrest === "contained"
                ? " The requisitioning push that fed this front over the winter held without open revolt — one less complication in a plan that has enough already."
                : ""),
          choices: [
            {
              label: "Back Kamenev. Concentrate the reserves toward Tsaritsyn and the Kuban.",
              advisor: {
                name: "Trotsky",
                quote:
                  "Every argument for the Donbas route assumes the workers there rise to meet us the moment we arrive. I would rather stake this offensive on ground we can actually take than on a rising we can only hope for.",
              },
              historical: true,
              setFlags: { southernPlan: "tsaritsyn" },
              impact: {},
              costsCapital: true,
              next: "cavalryArmyDebate19",
              outcome:
                "The plan is approved. It does not stop Orel from falling in October — the same defeat already written into the record on the other side of this front — but it is the plan the Republic actually fought behind, whichever staff officer's name history eventually settles on it belonging to.",
            },
            {
              label: "Overrule Kamenev. Concentrate through the Donbas instead, on the denser rail and the industrial workforce.",
              advisor: {
                name: "Unnamed Southern Front Commissar",
                quote:
                  "We keep asking Cossack villages to be neutral ground for an army they have every reason to distrust. The Donbas does not require that leap of faith from anyone — the rail is ours, and so, mostly, are the workers standing next to it.",
              },
              historical: false,
              setFlags: { southernPlan: "donbas" },
              impact: { mobilization: -1, warIndustry: 2 },
              next: "donbasMobilization19",
              outcome:
                "The reserves shift north instead. Denikin's Moscow Directive and the Southern Front's response were never actually decided against each other this way — whether trading the Kuban's uncertainty for the Donbas's rail lines would have blunted the advance any faster than what actually happened at Orel is not something history left any way to find out.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // DIVERGENT BRANCH — downstream of the Donbas concentration plan.
      // historicalRecord false: this specific mobilization scene is invented,
      // grounded in the broadly documented (if less individually famous than
      // Peregonovka or Chelyabinsk) practice of raising worker battalions
      // from Donbas mining and industrial towns during this period.
      case "donbasMobilization19":
        return {
          date: "AUGUST 1919",
          title: "Yuzovka: Miners, Not Soldiers",
          historicalRecord: false,
          situation:
            "The Donbas concentration has the rail and the industry behind it — and hard limits. The miners and factory workers being raised into worker battalions to reinforce the line are committed revolutionaries in a way conscripted peasants often aren't, but they are not trained infantry, and Denikin's approaching regulars are." +
            (flags.southernPlan === "donbas"
              ? " This is the axis this command chose over Kamenev's Tsaritsyn plan. The worker battalions are the resource that choice assumed would be there, and this is the first look at what it actually consists of."
              : ""),
          choices: [
            {
              label: "Commit the worker battalions to the line as front-line infantry, trusting political commitment to offset the training gap.",
              advisor: {
                name: "Unnamed Southern Front Commissar",
                quote:
                  "These men have more reason to hold this ground than any conscript brought in from outside the region. I would rather trust that than hold them back and explain to Denikin's army why we declined the help.",
              },
              historical: false,
              setFlags: { donbasChoice: "front_line" },
              // Threshold tightened round 22 (-5 -> -2), same bite-rate
              // rationale as the reliability gates above.
              gate: (m) => m.warIndustry >= -2,
              disabledReason: "War industry cannot arm the worker battalions for front-line use — committing them unequipped is not mobilization, it is disposal.",
              impact: { mobilization: 3, reliability: 2 },
              next: "donbasAttrition19",
              outcome:
                "The battalions go into the line directly. Commitment is real — competence against regular infantry takes longer to build than either side has time for, and the cost shows in the casualty returns before it shows anywhere else.",
            },
            {
              label: "Use the battalions for rear-area and rail defense instead, keeping trained units on the front line.",
              advisor: {
                name: "Frunze",
                quote:
                  "Enthusiasm is not a substitute for the drill that keeps a line from breaking under pressure it has never actually faced. Let them hold what they can actually hold, and put the men who already know how to do this where the fighting is hardest.",
              },
              historical: false,
              setFlags: { donbasChoice: "rear_area" },
              impact: { warIndustry: 2, mobilization: -2 },
              next: "cavalryArmyDebate19",
              outcome:
                "The battalions take rear-area and rail-defense duty instead, freeing trained units for the front proper. It's the more cautious use of a genuinely motivated force — and it means the Donbas's own worker mobilization ends up contributing less directly to the actual fighting than its architects had hoped.",
            },
          ],
        };

        // -----------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of committing the worker battalions
        // to the front line. historicalRecord false: this specific attrition
        // scene is invented, grounded in the broadly documented pattern that
        // worker/militia formations raised for revolutionary commitment
        // rather than training routinely suffered heavy losses and were
        // absorbed into regular units once their original cohesion broke
        // down under sustained combat.
        case "donbasAttrition19":
          return {
            date: "SEPTEMBER 1919",
            title: "Yuzovka: What's Left of the Battalions",
            historicalRecord: false,
            situation:
              "Three weeks of front-line fighting have done what everyone privately expected: the worker battalions have taken losses regular formations with real training wouldn't have, and the survivors are scattered across understrength companies that no longer function as the distinct units the Donbas mobilization was built around. Whether to keep them nominally intact — a symbol worth preserving even at reduced effectiveness — or formally merge the survivors into regular infantry is now an administrative decision rather than a hypothetical one." +
              (flags.donbasChoice === "front_line"
                ? " They were committed to the front line rather than held for rear-area duty, which is why this decision exists at all. Nobody who argued for that commitment is arguing now that the losses were unforeseeable."
                : ""),
            choices: [
              {
                label: "Merge the survivors into regular infantry formations. Effectiveness now matters more than the symbol.",
                advisor: {
                  name: "Frunze",
                  quote:
                    "I did not want them on the line in the first place, and I am not going to argue for keeping a symbolic formation together now that keeping it together costs actual combat effectiveness. Merge them where they'll do the most good.",
                },
                historical: false,
                setFlags: { donbasAttritionChoice: "merged" },
                impact: { mobilization: -1, warIndustry: 1 },
                next: "cavalryArmyDebate19",
                outcome:
                  "The survivors are folded into regular units. The Donbas worker battalions, as a distinct formation, effectively cease to exist within the month — the men who fought in them don't, and many carry the experience into whatever unit absorbs them next.",
              },
              {
                label: "Keep the battalions nominally intact, reinforced with fresh conscripts, even at reduced combat value.",
                advisor: {
                  name: "Unnamed Southern Front Commissar",
                  quote:
                    "These men earned the name on the unit rolls with actual blood. I am not prepared to dissolve that into an anonymous infantry company because it would be more administratively tidy. Reinforce them and keep the name.",
                },
                historical: false,
                setFlags: { donbasAttritionChoice: "reinforced" },
                impact: { mobilization: 1, warIndustry: -1 },
                next: "reinforcedBattalionsTest19",
                outcome:
                  "The battalions stay nominally intact, refilled with conscripts who weren't part of the original mobilization. The name and the symbolic continuity survive; the specific character of a genuinely worker-raised formation, refilled with men mobilized the ordinary way, largely doesn't.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of reinforcing rather than merging.
        // historicalRecord false: this specific test is invented, grounded
        // in the plain, unsentimental question the reinforcement decision
        // actually raised — a unit refilled with ordinary conscripts either
        // performs like the formation whose name it carries, or it doesn't.
        case "reinforcedBattalionsTest19":
          return {
            date: "OCTOBER 1919",
            title: "Yuzovka: The Name Under Fire",
            historicalRecord: false,
            situation:
              "The reinforced battalions have taken their first real engagement since being refilled, and the results are what an honest assessment would have predicted: competent, ordinary infantry performance, nothing like the committed, disproportionate fighting the original worker mobilization was known for. The name on the unit rolls is doing more work now than the men wearing it — whether to keep pretending the distinction still means something, or quietly stop treating the formation as anything other than a regular unit that happens to carry a symbolic name, is the actual choice the test has forced.",
            choices: [
              {
                label: "Keep the symbolic treatment. The name still matters for morale and recruitment even if the fighting record no longer distinguishes it.",
                advisor: {
                  name: "Unnamed Southern Front Commissar",
                  quote:
                    "The name was never really about this specific engagement's casualty ratio. It is about what recruiting posters and Party newspapers can still say honestly about where these men came from — and that much is still true, whatever the fighting looked like this time.",
                },
                historical: false,
                setFlags: { battalionNameTreatment: "symbolic_kept" },
                impact: { mobilization: 1 },
                next: "cavalryArmyDebate19",
                outcome:
                  "The symbolic treatment continues. The gap between the name's meaning and the unit's actual character widens quietly, unaddressed, the way most administrative fictions do when nobody has an immediate reason to correct them.",
              },
              {
                label: "Stop the pretense. Reclassify the formation as an ordinary unit rather than maintain a distinction the fighting no longer supports.",
                advisor: {
                  name: "Frunze",
                  quote:
                    "I would rather have an honest ledger than a flattering one. If the unit fights like ordinary infantry, it should be carried on the rolls as ordinary infantry — the name was never going to change what actually happens on the line either way.",
                },
                historical: false,
                setFlags: { battalionNameTreatment: "reclassified" },
                impact: { mobilization: -2, reliability: 1 },
                next: "cavalryArmyDebate19",
                outcome:
                  "The formation is formally reclassified. It costs some of the recruiting and morale value the name still carried — and it settles, honestly rather than symbolically, exactly the question the merge-or-reinforce decision was always actually about.",
              },
            ],
          };

      // ---------------------------------------------------------------------
      case "cavalryArmyDebate19":
        return {
          date: "NOVEMBER 1919",
          title: "Voronezh: One Army or Many",
          bulletin: {
            headline: "BOTH WHITE FRONTS BREAKING AT ONCE",
            body: "The Whites' furthest advance of the entire war has just been reversed here. Two thousand miles east, the same collapse hits the other front, the same weeks, for largely unrelated reasons.",
            meanwhile: {
              southRussia: "Orel, the deepest point the AFSR ever reached, was retaken on 20 October. Denikin's forces are now in a general retreat that will not meaningfully stop until Novorossiysk, five months from now.",
              siberia: "Omsk itself, Kolchak's own capital, is being evacuated this month as his government falls back along the Trans-Siberian. The eastern front is collapsing in parallel with the southern one, on its own timetable, without either command coordinating the timing.",
            },
          },
          historicalRecord: true,
          context:
            "The Red Army's cavalry problem is structural: the Cossack hosts, historically the empire's mounted arm, largely went to the Whites, leaving the Republic to build mounted formations from peasants, ex-Imperial troopers, and whoever could ride. Budyonny's 1st Cavalry Corps has operated as an oversized independent formation since June and performed well at Voronezh and Kastornoye in October. What is being proposed is not new units but a change in doctrine — a permanent army-level cavalry command, the first in modern European practice.",
          situation:
            "Orel and Voronezh have broken Denikin's advance — the same collapse already written into the record on the other side of this front. Budyonny and Voroshilov are pressing you to formally concentrate the scattered cavalry corps into a single unified Cavalry Army under centralized command, arguing that mounted formations parceled out piecemeal to infantry armies have consistently underperformed what a concentrated cavalry force could do against a retreating enemy." +
              (flags.southernPlan === "tsaritsyn"
                ? " They are making the argument from a Tsaritsyn axis this command already chose to concentrate on, which makes it harder to answer — Budyonny is asking for cavalry command in the theater he has just been proven right about."
                : flags.southernPlan === "donbas"
                ? " They are making the argument having been overruled once already on the Donbas question. Budyonny is not raising that, and is clearly aware he does not need to."
                : ""),
          choices: [
            {
              label: "Approve the unified Cavalry Army under Budyonny's command.",
              advisor: {
                name: "Budyonny",
                quote:
                  "Hitch my divisions to an infantry army and you get an infantry army's war fought at an infantry army's walking pace — I have watched it happen twice already and buried good men to it both times. Give me the corps together, one command, my command, and I will show this front what cavalry actually does when nobody is holding its reins.",
              },
              historical: true,
              setFlags: { cavalryDoctrine: "unified" },
              aftermath:
                "The 1st Cavalry Army was formed on 17 November 1919 under Budyonny, with Voroshilov and Shchadenko on its revolutionary military council. It became the war's decisive manoeuvre formation — driving the AFSR from Rostov, and later fighting in the Polish war of 1920, where it was also blamed for the failure at Warsaw. Its command group mattered well past the Civil War: Budyonny and Voroshilov both became Marshals of the Soviet Union, and both survived the purges that removed most of the officers who had criticised them.",
              impact: {},
              next: "perekopAssault20",
              outcome:
                "The First Cavalry Army is formally constituted. It becomes the instrument that turns Denikin's retreat from a fighting withdrawal into a rout — exploiting exactly the kind of open, disorganized retreat the concentration argument was built to punish.",
              // Added round 22, same bolsheviks-uncertain-mechanic rationale
              // as above. The formation itself, and its eventual role, are
              // fixed by the aftermath text below — the roll only varies how
              // quickly the newly concentrated command actually gets moving,
              // which doesn't contradict anything the aftermath states.
              uncertain: (() => {
                const decisiveWeight = modWeight(60, meterPct(meters.mobilization));
                return [
                  {
                    weight: decisiveWeight,
                    title: "The concentration pays off immediately",
                    setFlags: { cavalryPursuitTempo: "decisive" },
                    impact: { mobilization: 2 },
                    outcome:
                      "Budyonny's staff have the scattered corps acting as one formation within days, not weeks. The pursuit outruns Denikin's own retreat almost from the start.",
                  },
                  {
                    weight: 100 - decisiveWeight,
                    title: "The new command takes weeks to actually function as one army",
                    setFlags: { cavalryPursuitTempo: "lagging" },
                    impact: { mobilization: -1, warIndustry: -1 },
                    outcome:
                      "Combining corps that spent the summer operating separately into one functioning command isn't instant — supply columns built for smaller formations, staffs unused to coordinating at this scale. The Army that will eventually decide this front takes real time to become the thing its own founding argument promised.",
                  },
                ];
              })(),
            },
            {
              label: "Keep cavalry distributed among the infantry armies as integral support rather than a separate strategic arm.",
              advisor: {
                name: "Southern Front Staff Officer",
                quote:
                  "An infantry army without its own cavalry screen is blind on its flanks the moment the enemy moves faster than it does. I understand the argument for concentration. I do not think every infantry commander who loses his cavalry to a separate command will agree it was worth it.",
              },
              historical: false,
              setFlags: { cavalryDoctrine: "distributed" },
              // Leaving cavalry dispersed is defensible on its own. It is not
              // defensible with the war industry gone and the army unreliable.
              // Measured at this node: warIndustry p10 = -3, reliability p10 = -5.
              // The old -5/-4 pair required two near-worst-case values at once and
              // fired in 0.1% of runs.
              // Single axis. The compound version fired in 0.08% of runs: this
              // choice ADDS +1 reliability, so a post-choice value of -5 required
              // a pre-choice -6 AND a simultaneous warIndustry low. Reliability
              // alone is the axis this decision is actually about.
              nextIf: (m) => (m.reliability <= -4 ? "endingTheAutumnCrisis19" : null),
              impact: { mobilization: -2, reliability: 1 },
              next: "distributedPursuit19",
              outcome:
                "The cavalry stays distributed. Whether a concentrated Cavalry Army would have exploited Denikin's collapse any faster than divisions still tied to their infantry armies' pace is exactly the kind of operational counterfactual no record settles — the historical record shows what the concentrated version did. It does not show what the alternative would have.",
            },
            {
              label: "Concentrate the two strongest corps into one reinforced corps — short of a full, separately-commanded Army.",
              advisor: {
                name: "Kamenev",
                quote:
                  "Budyonny is not wrong that piecemeal cavalry underperforms. I am not convinced the answer has to be an Army-scale command answering over the Front's own head to the center. A reinforced corps tests his argument without settling, in the same order, a much larger question about who commands what.",
              },
              historical: false,
              setFlags: { cavalryDoctrine: "reinforced_corps" },
              impact: { mobilization: -1, reliability: 2 },
              next: "perekopAssault20",
              outcome:
                "The middle path is taken. The reinforced corps performs better than fully distributed cavalry would have and worse than Budyonny's own later claims for the full Cavalry Army suggest it might have — a real improvement, not the singular instrument the historical Cavalry Army became, and one that leaves the larger command question this choice was partly about still unresolved rather than decided by circumstance.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // DIVERGENT BRANCH — downstream of keeping cavalry distributed among
      // infantry armies rather than concentrating it. historicalRecord false:
      // this specific engagement is invented, testing the real operational
      // trade-off the Southern Front staff officer's own quote raises.
      case "distributedPursuit19":
        return {
          date: "DECEMBER 1919",
          title: "The Screen That Wasn't There",
          historicalRecord: false,
          situation:
            "An infantry army pursuing Denikin's retreat has outrun its own reconnaissance — the cavalry that would normally screen its flank is still attached elsewhere, exactly the gap the distributed-cavalry argument was supposed to prevent by keeping each army's own horsemen close. A White rearguard cavalry detachment has been spotted maneuvering somewhere on that unscreened flank, and nobody can currently say exactly where.",
          choices: [
            {
              label: "Halt the pursuit until cavalry reconnaissance can be arranged, even if it costs the army its momentum.",
              advisor: {
                name: "Southern Front Staff Officer",
                quote:
                  "I argued for keeping the cavalry close specifically so this wouldn't happen. Having made that argument, I am not prepared to press an advance blind into ground where I can't currently say what's actually out there.",
              },
              historical: false,
              setFlags: { distributedPursuitChoice: "halt" },
              impact: { mobilization: -2 },
              next: "polishWar20",
              outcome:
                "The pursuit halts until the flank is actually screened. It costs real time against a retreating enemy who doesn't wait politely for reconnaissance — exactly the trade-off distributing the cavalry was supposed to avoid, showing up anyway in a different form.",
            },
            {
              label: "Press the pursuit regardless. The retreating force is unlikely to risk a serious counterattack this late in its collapse.",
              advisor: {
                name: "Unnamed Infantry Army Commander",
                quote:
                  "Denikin's army is coming apart. I am not going to hand it a week's grace because we can't currently locate one rearguard cavalry detachment that is, by every reasonable estimate, more interested in escaping than in attacking us.",
              },
              historical: false,
              setFlags: { distributedPursuitChoice: "press" },
              impact: { mobilization: 2 },
              next: "perekopAssault20",
              outcome:
                "The pursuit continues. The estimate holds — the White detachment is retreating, not attacking — but the gap in reconnaissance was real regardless of how this particular gamble resolved, and it is exactly the gap a concentrated Cavalry Army was built specifically not to have.",
            },
          ],
        };

      // ---------------------------------------------------------------------
      case "perekopAssault20":
        return {
          date: "NOVEMBER 1920",
          title: "Perekop: The Last Isthmus",
          bulletin: {
            headline: "THE LAST TWO WHITE FRONTS END TOGETHER",
            body: "What happens here, from the other side, is the same event: Wrangel's own staff are watching this exact assault from inside the peninsula it is aimed at.",
            meanwhile: {
              southRussia: "This is Wrangel's own account of this exact battle, seen from the losing side — the Sivash crossing, the isthmus turned from the flank, and the evacuation order that follows within days.",
              siberia: "The Far Eastern Republic is now the sole authority in Transbaikal, its capital just relocated to Chita as Japanese forces withdraw. What remains of the White retreat there has either already crossed into Manchuria or is making its final approach to the border.",
            },
          },
          historicalRecord: true,
          situation:
            "Wrangel's remnant is fortified behind the Turkish Wall at Perekop and the Chongar crossings — the last dry-land approach into Crimea, the same peninsula whose evacuation is already the terminus written into the other side of this history. Frunze's plan calls for a frontal assault on the Wall timed with something riskier: a night crossing of the Sivash, the shallow, wind-exposed 'Rotten Sea,' to turn the White defense from a direction no one has fortified." +
              (flags.cavalryDoctrine === "unified"
                ? " The Cavalry Army approved a year ago is available for the exploitation phase, which is the part of this plan that only works if something is waiting behind the Wall once it breaks."
                : flags.cavalryDoctrine === "reinforced_corps"
                ? " The reinforced corps is what there is for the exploitation phase — enough to follow a breakthrough, not enough to turn one into the encirclement Frunze's plan assumes on paper."
                : flags.cavalryDoctrine === "distributed"
                ? " The cavalry remains parceled out among the infantry armies. Frunze's plan assumes a concentrated exploitation force behind the breakthrough, and this front does not have one."
                : "") +
              (flags.cavalryPursuitTempo === "decisive"
                ? " A year on, the Cavalry Army still moves the way it did from its first week under concentrated command — fast, and as one formation rather than several."
                : flags.cavalryPursuitTempo === "lagging"
                ? " The Cavalry Army took real time to gel as a single command a year ago, and some of that early coordination friction has never fully gone away."
                : ""),
          choices: [
            {
              label: "Commit to the combined plan — the frontal assault on Perekop timed with the night crossing of the Sivash.",
              advisor: {
                name: "Frunze",
                quote:
                  "The Wall is built to stop an army that comes straight at it. It was not built to stop one that doesn't. Wading the Sivash at night, in November, is going to cost lives — I'm not going to dress that up. So does another winter spent besieging Perekop head-on. I know which cost I'd rather explain afterward.",
              },
              historical: true,
              setFlags: { perekopPlan: "sivash_crossing" },
              // Threshold tightened round 22 (-5 -> -3) -- historical choice,
              // kept more conservative than the historical:false gates.
              gate: (m) => m.reliability >= -3,
              disabledReason: "A night crossing of the Sivash requires formations that will not dissolve in the dark. These will.",
              impact: {},
              next: "kronstadt21",
              outcome:
                "The crossing succeeds. Blücher's division fords the Sivash overnight and turns the Perekop defense from the rear — the maneuver that actually breaks Wrangel's line and starts the retreat that ends, on the other side of this history, at the Crimean docks.",
            },
            {
              label: "Rely on a massed frontal assault against the Turkish Wall alone. Skip the Sivash crossing's risk.",
              advisor: {
                name: "Southern Front Staff Officer",
                quote:
                  "I am not questioning that the crossing worked. I am pointing out that it worked — it was not guaranteed to, and an army that drowns fording an inlet at night in November has not flanked anything. There is a version of this plan that doesn't require the Sivash to cooperate.",
              },
              historical: false,
              setFlags: { perekopPlan: "frontal_only" },
              impact: { mobilization: -3, reliability: 1 },
              next: "compressedEvacuation20",
              // Deliberately ungated. Every other choice at this node carries a
              // gate, so gating this one too can leave the node with zero
              // available choices — an actual softlock, observed in simulation
              // before this was removed. The frontal assault is the desperate
              // fallback: always available, precisely because it is the option
              // that needs no advantage to attempt.
              outcome:
                "The Wall is taken by weight of numbers alone, without the flanking maneuver. It costs more men and more time than the historical crossing did — Wrangel's defense holds a little longer, and the evacuation it eventually forces happens on a delayed clock rather than the one already written into the record.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // DIVERGENT BRANCH — downstream of the delayed, frontal-only Perekop
      // assault. historicalRecord true: the real evacuation timeline this
      // delay compresses is documented down to the day — Red forces broke
      // through on November 11, Wrangel's evacuation order went out on the
      // 13th, and the entire operation was complete by the 16th. There was
      // almost no slack in that schedule even in the version that actually
      // happened.
      case "compressedEvacuation20":
        return {
          date: "NOVEMBER 1920",
          title: "The Ports: What the Pursuit Is For",
          historicalRecord: false,
          context:
            "Perekop has fallen and Wrangel's evacuation is under way from five Crimean ports. Historically the Southern Front did not race the ships: Frunze had already offered Wrangel's officers an amnesty by radio on 11 November, and the Red advance into the peninsula was rapid but did not seriously contest the embarkation. Some 145,693 people left on 126 vessels between 13 and 16 November, and the Republic let them go.",
          situation:
            "The delay at Perekop has compressed a schedule that had almost no slack in it. Wrangel's staff are loading against a clock that is shorter than the one they actually had, and the Southern Front is close enough to the ports to make the difference between an evacuation and a rout — if it presses. What has to be decided here is not how the Whites load their ships. It is whether the Republic spends the men and the days required to reach the quays before they finish, or lets the Crimea empty and takes the peninsula without a fight for it.",
          choices: [
            {
              label: "Press the pursuit to the ports. Take the quays before the loading finishes.",
              advisor: {
                name: "Frunze",
                quote:
                  "I offered them an amnesty and I meant it, but an amnesty is a political instrument and the men on those ships are the ones who will be back with French guns in three years if they are anywhere at all. If we can reach the quays, I would rather this ended in the Crimea than in Constantinople.",
              },
              historical: false,
              setFlags: { compressedEvacuation: "press_ports" },
              // Threshold tightened round 22 (-5 -> -2), same bite-rate
              // rationale as the reliability/warIndustry gates above.
              gate: (m) => m.mobilization >= -2,
              disabledReason: "Racing an evacuation to the quays requires formations able to force a march. This front has none to spare.",
              impact: { mobilization: 1 },
              next: "kronstadt21",
              outcome:
                "The pursuit is pressed to the water. Whether a Red Army arriving at a loading quay produces a captured evacuation or the kind of chaos Novorossiysk became eight months ago has no settled answer. The roll supplies one.",
              uncertain: (() => {
                const holdsWeight = modWeight(45, meterPct(meters.mobilization));
                return [
                  {
                    weight: holdsWeight,
                    title: "The quays are reached and the evacuation is cut short",
                    setFlags: { compressedEvacOutcome: "cut_short" },
                    impact: { mobilization: 2 },
                    outcome:
                      "Advance elements reach two of the five ports while loading is still under way. Substantially fewer than the historical 145,693 get out. What the Republic gains is an emigration too small to organise itself abroad; what it acquires is responsibility for everyone left standing on the quay.",
                  },
                  {
                    weight: 100 - holdsWeight,
                    title: "The pursuit arrives to find the ships already gone",
                    setFlags: { compressedEvacOutcome: "arrived_late" },
                    impact: { mobilization: -3, warIndustry: -1 },
                    outcome:
                      "The pursuit is pressed hard, costs the formations doing it, and reaches the ports after the last vessels have cleared. The Crimea is taken either way. The difference is that it is taken by an army that has just spent itself racing an evacuation it did not catch.",
                  },
                ];
              })(),
            },
            {
              label: "Let them go. Take the Crimea without contesting the embarkation.",
              advisor: {
                name: "Kamenev",
                quote:
                  "The peninsula is the objective and the peninsula is ours in either case. Storming a loading quay against men with nothing left to lose costs us formations we will want in the spring, in exchange for prisoners we would then have to feed.",
              },
              historical: true,
              setFlags: { compressedEvacuation: "let_them_go" },
              impact: {},
              aftermath:
                "This is what happened. The Southern Front did not seriously contest the embarkation; 145,693 people left on 126 vessels between 13 and 16 November 1920, and the fleet reached Constantinople. What followed for those who stayed is a separate matter: the Crimean repressions under Béla Kun and Rozalia Zemlyachka killed a disputed number of remaining officers and civilians over the following months, with estimates ranging from several thousand to tens of thousands.",
              next: "kronstadt21",
              outcome:
                "The ports are left alone. The last vessels clear on 16 November and the Crimea is occupied without a fight for the quays — the Civil War's European front effectively over, at a cost the Republic did not have to pay in men.",
            },
          ],
        };

      // ---------------------------------------------------------------------
      // -----------------------------------------------------------------------
      // The Polish war. Every other ending in this campaign is a variant of
      // Kronstadt in March 1921 — the Republic winning, and the argument being
      // about what winning cost. This node is the one place the record offers
      // an unambiguous Soviet defeat, and it happens four months earlier and
      // against an external enemy rather than its own sailors.
      // historicalRecord true: the advance on Warsaw, the argument over the
      // Cavalry Army's axis, and Tukhachevsky's own later account of it.
      case "polishWar20":
        return {
          date: "AUGUST 1920",
          title: "The Vistula: Warsaw or Lwów",
          historicalRecord: true,
          context:
            "The Polish–Soviet war has run since spring. Piłsudski took Kiev in May; the counteroffensive threw him back nearly 400 miles, and by August Tukhachevsky's Western Front is at the Vistula with Warsaw in front of it. Lenin's calculation is explicit and political: a Red Army entering Warsaw brings the revolution to Germany. The 1st Cavalry Army, under Budyonny with Stalin as the South-Western Front's political member, is committed at Lwów, 250 miles to the south — and Tukhachevsky's exposed left flank needs it at Warsaw.",
          situation:
            "The order to transfer the Cavalry Army north has been issued and is not being obeyed with any urgency. Lwów is close to falling and the men in front of it can see that; Warsaw is a different front's problem. Command has to decide whether to force the transfer against a front command that plainly does not want to make it, or accept the southern axis and let Tukhachevsky close on Warsaw with his flank as it is.",
          choices: [
            {
              label: "Force the transfer. The Cavalry Army goes north to Warsaw regardless of what Lwów costs.",
              advisor: {
                name: "Tukhachevsky",
                quote:
                  "My left flank is open and everyone in this room knows which formation is supposed to be covering it. If Lwów falls a month later than it might have, the Republic survives that. If the Vistula goes badly with the cavalry 250 miles away, I would like it on the record whose decision that was.",
              },
              historical: false,
              setFlags: { polishAxis: "north" },
              impact: { mobilization: -2 },
              aftermath:
                "The transfer was ordered and was not carried out in time; the Cavalry Army remained engaged at Lwów through the decisive days. Whether its presence at Warsaw would have changed the outcome is one of the genuinely open questions of the war — Piłsudski's counterstroke from the Wieprz struck a gap that existed for reasons beyond one formation's position, and Soviet cipher security had been broken by Polish cryptanalysts throughout.",
              next: "endingTheVistula20",
              outcome:
                "The cavalry turns north, late and under protest. It arrives into a battle already being decided by Piłsudski's counterstroke out of the Wieprz, and the Western Front's collapse is not prevented by it — only witnessed by more of the Republic's best cavalry than would otherwise have been there.",
            },
            {
              label: "Accept the southern axis. Take Lwów, and let the Western Front carry Warsaw on its own.",
              advisor: {
                name: "Stalin",
                quote:
                  "The South-Western Front has an objective in front of it and the men to take it. I am not going to break off an operation that is working in order to reinforce one that may not, on the argument that Warsaw is worth more than Galicia because Warsaw is closer to Berlin.",
              },
              historical: true,
              setFlags: { polishAxis: "south" },
              impact: {},
              aftermath:
                "This is what happened. The Cavalry Army stayed south, Warsaw was lost between 12 and 25 August in what Polish accounts call the Miracle on the Vistula, and the Western Front was driven back several hundred miles. The Treaty of Riga in March 1921 fixed a border well east of the Curzon Line. The recriminations over whose decision lost Warsaw ran in Soviet military print for years afterward and were never settled on the merits.",
              next: "endingTheVistula20",
              outcome:
                "Lwów holds the Cavalry Army's attention. Warsaw is decided without it, and decided against the Republic.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // ENDING — the Republic's one clear defeat, and the campaign's only
      // ending that is not about Kronstadt.
      // -----------------------------------------------------------------------
      // ENDING — the Republic's own mid-war collapse. Every other bolshevik
      // ending sits in 1920-21 and assumes the war is won; October 1919 is
      // the month it very nearly was not, and the campaign had no way to
      // represent that. Reached by arriving at the Orel crisis with the
      // war industry exhausted and the army politically unreliable.
      case "endingTheAutumnCrisis19":
        return {
          isEnding: true,
          title: "The Autumn Crisis",
          date: "OCTOBER 1919",
          badge: "\u25c7 SPECULATIVE — DOWNSTREAM OF DIVERGENCE",
          classification: "speculative",
          epilogue:
            "Orel does not hold. The Southern Front gives way along the Kursk axis while Yudenich's separate army is still inside sight of Petrograd, and for a period of weeks the Republic is fighting for Moscow and Petrograd simultaneously with formations it cannot equip and cannot fully trust.\n\nHistorically this month is the closest the Soviet government came to losing the war, and it held — barely, and for reasons that were as much about White disorganisation as Red strength. Denikin's three axes never coordinated; Yudenich's advance ran out of supply at the gates; the Latvian riflemen and Primakov's cavalry arrived at Orel in time. Remove the war industry that armed those formations and the political reliability that held them together, and the same month goes the other way.\n\nWhat follows is not a White victory in any clean sense — no White commander was in a position to govern what they were taking, and the historical record makes that abundantly clear. It is the end of this particular government, and the beginning of something considerably less legible: a Russia without a Bolshevik state and without any settled alternative to it, fought over by armies whose only real point of agreement was what they were against. The Civil War does not end in 1921 on this path. Nobody involved would recognise the question of when it ended."
        };

      case "endingTheVistula20":
        return {
          isEnding: true,
          title: "The Vistula",
          date: "AUGUST 1920 – MARCH 1921",
          badge: "◆ HISTORICAL RECORD",
          classification: "historical",
          epilogue:
            "The Red Army does not enter Warsaw. Between 12 and 25 August 1920, Piłsudski's counterstroke out of the Wieprz cuts into the gap on Tukhachevsky's left and rolls the Western Front back several hundred miles; tens of thousands of Red Army men are taken prisoner, and tens of thousands more are interned across the East Prussian border. The revolution does not reach Germany by this route or any other.\n\nThe Treaty of Riga, signed in March 1921 in the same month as Kronstadt, fixes a Soviet–Polish border well east of the line Britain had proposed, and the Republic accepts it because it has nothing left to spend on refusing. This is the Civil War's one unambiguous defeat for the side that won the Civil War.\n\nNo one involved accepts responsibility for it." +
            (flags.polishAxis === "north"
              ? " The order to transfer the Cavalry Army was given; it was not executed with any urgency, and it reached Warsaw after the battle that mattered. Tukhachevsky's staff call it a refusal in every account written afterward. The South-Western Front calls it an order arriving too late for an army already fully engaged at Lwów to disengage cleanly from — a different failure than the one it gets blamed for, and a distinction that convinces nobody outside the room where it's made."
              : " Tukhachevsky's Western Front blames the South-Western Front's outright refusal to release the Cavalry Army; the South-Western Front blames a Western Front that overextended 400 miles from its supply and lost its own left flank before the cavalry question was even decided.") +
            " Both arguments are still being made in print years afterward, by men who will spend the rest of their careers in the same rooms as each other.",
        };

      case "kronstadt21":
        return {
          date: "MARCH 1921",
          title: "Kronstadt: Soviets Without Us",
          bulletin: {
            headline: "THE ONLY WAR STILL RUNNING",
            body: "The Civil War's other two major fronts have already ended. Whatever this fortress represents, it is not a continuation of the war against organized White armies. That war is over.",
            meanwhile: {
              southRussia: "Finished four months ago. Wrangel's fleet reached Constantinople in November; close to 150,000 people evacuated with it. No organized White force remains west of the Urals.",
              siberia: "Also effectively finished. What survived the retreat crossed into Manchuria months ago, disarmed at the border by Chinese authorities regardless of which White command it had answered to. The Far Eastern Republic, the Bolshevik-tolerated buffer state, is currently holding its own Constituent Assembly — a state doing through negotiation what this fortress is asking the Republic to do by force of demand.",
            },
          },
          historicalRecord: true,
          situation:
            "The White armies are beaten — Wrangel's Crimea already fell four months ago, on the other side of this history. This is not that war. The sailors of the Kronstadt naval garrison, who backed the October Revolution as firmly as anyone in this room, have raised a Provisional Revolutionary Committee and issued fifteen demands: free Soviet elections, an end to grain requisitioning, release of imprisoned socialists. They are not White. They are asking the Revolution to keep the promises it made to people like them in 1917." +
            (flags.polishAxis === "north"
              ? " The Cavalry Army was pulled north to the Vistula and arrived too late to matter. Formations that spent August on the Polish border are among those now being ordered onto the ice, and they have already been asked once this year to win something the Republic then lost anyway."
              : flags.polishAxis === "south"
              ? " The Cavalry Army stayed at Lw\u00f3w while Warsaw was lost. Every senior man in this room has spent the winter being asked, in print and in committee, whose decision that was — and arrives at Kronstadt with an appetite for a result nobody can argue about."
              : "") +
            (flags.perekopPlan === "sivash_crossing"
              ? " The Sivash crossing worked. The men who waded the Rotten Sea in November are, in some cases, the same men now being ordered across the ice at Kronstadt against sailors who are not Wrangel."
              : flags.perekopPlan === "frontal_only"
              ? " Perekop was taken frontally, at a cost the Sivash crossing was designed to avoid. The formations available for an assault across the ice are thinner for it, and this one has to be made anyway."
              : ""),
          choices: [
            {
              label: "Demand unconditional surrender. Order Tukhachevsky to take the fortress by force across the ice before the spring thaw.",
              advisor: {
                name: "Trotsky",
                quote:
                  "I know exactly who is inside that fortress and what they fought for in 1917 — better than most of the men now arguing for patience. None of that changes the arithmetic. A rebellion at Kronstadt, this close to Petrograd, with the ice still crossable, is not a grievance the Republic has the luxury of negotiating on their timeline instead of ours.",
              },
              historical: true,
              setFlags: { kronstadtChoice: "assault" },
              impact: {},
              costsCapital: true,
              next: "kronstadtReckoning21",
              outcome:
                "The ultimatum goes out — surrender or be 'shot like partridges.' The first assault on March 8 fails badly enough that one regiment mutinies rather than continue it. The second, on March 17-18, succeeds. Somewhere between 1,200 and 2,000 are executed after the surrender, mostly without trial; thousands more are sent to the Solovki camp. Some who fled across the ice to Finland are later lured back by an amnesty that is not honored.",
            },
            {
              label: "Open real negotiations on the demands themselves rather than issue an ultimatum.",
              advisor: {
                name: "Kalinin",
                quote:
                  "I do not think 'Soviets without Communists' is a demand this government can simply grant — but free elections and an end to requisitioning are not White Guard demands, whatever we are calling this in the newspapers. I think we owe it to the men who made the Revolution possible to at least test whether this is negotiable before we decide it isn't.",
              },
              historical: false,
              setFlags: { kronstadtChoice: "negotiate" },
              impact: { reliability: 3, mobilization: -2 },
              next: "kronstadtReckoning21",
              outcome:
                "Negotiations open instead of an ultimatum. Whether this fortress, this close to Petrograd, this armed, stands down through negotiation rather than force is not a question the record answers with confidence — the historical record shows what the ultimatum produced. It does not show what genuine negotiation would have.",
            },
            {
              label: "Neither yet. Wait for the thaw — an assault becomes impossible, but so does the fortress's link to Petrograd.",
              advisor: {
                name: "Kamenev",
                quote:
                  "In three weeks the ice is gone and nobody crosses it in either direction. They cannot march on Petrograd and we cannot storm them, and a garrison on an island with no relief and no harvest is a different negotiating partner in May than it is in March. The cost of waiting is that the Congress watches us wait.",
              },
              historical: false,
              setFlags: { kronstadtChoice: "wait_for_thaw" },
              impact: { mobilization: -2, reliability: 1 },
              aftermath:
                "The thaw was the reason the assault happened when it did rather than an alternative to it: the ice was the only approach, and Tukhachevsky's timetable was set by how long it would hold. Waiting was argued in the sense that several members pressed for negotiation while the ice lasted, but no proposal to deliberately let the crossing close and besiege the island through the summer was adopted. What the record does show is that the fortress had limited provisions and the Baltic Fleet's own coal stocks were nearly exhausted.",
              next: "kronstadtReckoning21",
              outcome:
                "The ultimatum is not issued and the assault is not ordered. The ice goes out in the last week of March and takes the question with it — Kronstadt becomes an island the Republic cannot reach and cannot be threatened from, holding fifteen demands nobody has answered, through a summer in which the NEP quietly grants the largest of them.",
            },
          ],
        };

      // -----------------------------------------------------------------------
      // CHECKPOINT — decision-gated routing, not a meter check. The
      // historical assault happens regardless of what came before it —
      // that part isn't contingent on the player. What genuinely differs is
      // how it reads: a command that answered every earlier regional
      // objection with centralized force rather than accommodation has no
      // reservoir of goodwill left for the NEP concession to draw on, and
      // the suppression reads as naked capitulation-by-force rather than
      // the real historical "wins by force, concedes by policy" complexity
      // — a distinct ending, not a text variant. Gate was originally the
      // accumulated legitimacy meter (<= -6) alongside the assault flag;
      // changed to specific centralizing decisions, for the same reason as the
      // other two campaigns' checkpoints — the triangle shouldn't be what
      // decides which ending a run gets. Either decision is enough: the grain
      // committees' intensified requisitioning (grainRequisition18) or pressing
      // the Eighth Congress (militaryOppositionCongress19). They sit on opposite
      // branches of this campaign, so a run can only ever make one of them; the
      // original "both" condition made this ending unreachable.
      case "kronstadtReckoning21":
        if (flags.kronstadtChoice === "wait_for_thaw") {
          return this.resolveNode("endingTheIsland21");
        }
        if (flags.kronstadtChoice === "assault" && (flags.requisitionPolicy === "intensified" || flags.congressChoice === "press")) {
          return this.resolveNode("endingHollowVictory21");
        }
        return this.resolveNode(flags.kronstadtChoice === "assault" ? "endingIceBroken" : "endingUnlikelyPrecedent");

      // -----------------------------------------------------------------------
      // ENDING — the fortress neither stormed nor negotiated with, left on the
      // far side of open water. Distinct from endingUnlikelyPrecedent, which is
      // a negotiated settlement: this one settles nothing and lets the question
      // expire instead.
      case "endingTheIsland21":
        return {
          isEnding: true,
          title: "The Island",
          date: "MARCH – SEPTEMBER 1921",
          badge: "\u25c7 SPECULATIVE — DOWNSTREAM OF DIVERGENCE",
          classification: "speculative",
          epilogue:
            "The ice goes out in the last week of March and the question goes with it. No ultimatum is issued, no assault is ordered, and the Provisional Revolutionary Committee finds itself governing an island that cannot be reached and cannot reach anywhere else. Fifteen demands remain on the table with nobody obliged to answer them.\n\nHistorically the ice was the whole timetable. Tukhachevsky's assault went in on 17–18 March because the crossing would not hold much longer, and the fortress fell before the thaw could make the question academic. Letting it become academic instead costs the Republic the thing the assault was actually for, which was never the island: it was the demonstration that a Soviet could not overrule the Party and survive the experience. Kronstadt spends the summer as a standing example that it can.\n\nWhat undercuts the garrison is not force. The Tenth Party Congress, sitting the same month, ends grain requisitioning — the sailors' first and largest demand — and the New Economic Policy grants in April what the fortress asked for in March. By August the committee is arguing about what it is still for, in a garrison on short rations with the Baltic Fleet's coal nearly gone. The demands about free elections and imprisoned socialists are not granted and are not refused; they simply stop being urgent to anyone on the mainland.\n\nSome of the garrison leaves for Finland over the summer in small boats. Some stay. There is no massacre to record, no Solovki transports, and no amnesty dishonoured, because there is no surrender to dishonour it after. There is also no moment at which the Revolution has to say out loud what it would do to people who were on its own side in 1917 — which is either mercy or evasion, and this Revolution has spent three years demonstrating how hard those two are to tell apart from the inside.",
        };

      // -----------------------------------------------------------------------
      // ENDING — reachable only via the historical assault choice combined
      // with two specific centralizing decisions: intensifying requisitioning
      // in reconquered territory, and pressing the Congress floor fight
      // rather than negotiating. historicalRecord false: the assault and its
      // casualty figures are real and identical to endingIceBroken's — what's
      // speculative is the domestic and international reading of it, which
      // the real record doesn't separately track by which policy path a
      // government took to get there.
      case "endingHollowVictory21":
        return {
          isEnding: true,
          title: "A Hollow Victory",
          date: "MARCH 1921",
          badge: "SPECULATIVE — SAME EVENT, DIFFERENT RECKONING",
          classification: "speculative",
          epilogue:
            "The assault happens exactly as it did historically — the failed March 8 attempt, the mutiny, the successful second assault on the 17th-18th, the executions, Solovki. None of that is different. What's different is that this command arrives at Kronstadt having chosen intensified requisitioning over restraint in reconquered territory, and having pressed the Congress floor fight rather than folding the Opposition's concerns in quietly. Two decisions, not an accumulated total — but the two that mattered most for whether anyone still extends this government the benefit of the doubt. There is no reservoir of revolutionary goodwill left for the NEP announcement, in the same month, to draw on.\n\nHistorically, even sympathetic observers can read Lenin's NEP as a genuine, if late, course correction — grain requisitioning ended in the same breath as the sailors who died protesting it were executed, an uncomfortable but real complexity. Here, with those two decisions already on the record, nobody extends that same benefit of the doubt. The concession reads as exactly what it looks like on its surface: capitulation dressed as policy, offered only after the guns had already answered the actual argument. The Revolution wins Kronstadt by force either way. Only one version of this command still gets to claim it conceded anything freely." +
            (flags.smirnovAssignment === "sidelined"
              ? "\n\nSmirnov was kept away from field command as well as policy — marginalized completely rather than partially. The Military Opposition's people learned from it what the sailors are learning now: that disagreement inside this structure is not answered, it is administered. They arrived at the same conclusion two years apart, by the same route."
              : flags.smirnovAssignment === "field_command"
              ? "\n\nSmirnov was given a real field command despite the political marginalization, and performed in it. It was the one moment this command distinguished between a man's disagreement and a man's usefulness. Nobody at Kronstadt is being offered that distinction."
              : "") +
            (flags.rationingConsequence === "held_firm"
              ? "\n\nThe supply split was held as firm policy against both fronts' objections. Consistency of that kind is a virtue in an allocation table and something else entirely when it becomes the only answer this command knows how to give."
              : ""),
        };

      // ---------------------------------------------------------------------
      // ENDINGS
      // ---------------------------------------------------------------------
      case "endingIceBroken":
        return {
          isEnding: true,
          title: "The Ice Broken",
          date: "MARCH 1921",
          badge: "HISTORICAL RECORD",
          classification: "historical",
          epilogue:
            "The second assault takes the fortress on March 17–18, after the first attempt on March 8 fails badly enough that one regiment mutinies rather than continue it. Somewhere between 1,200 and 2,000 rebels are executed afterward, most without trial; thousands more are sent to Solovki, the first major Soviet concentration camp. Some who escaped across the ice to Finland are later lured home by an amnesty that is not honored."
            + (flags.congressFallout === "marginalized" || flags.tsaritsynOutcome === "recalled"
                ? "\n\nNone of that surprises anyone who watched this command's pattern from the beginning — Tsaritsyn, the Congress fallout, every regional objection answered the same way. Kronstadt is not a break from how this command has governed. It is that pattern's largest, and last, application."
                : "\n\nEven a command that chose accommodation more often than not, when it had the choice, arrives at the same ultimatum in the end — a reminder that not every outcome in this war actually turned on what came before it, however much most of the earlier ones did.")
            + (flags.compressedEvacOutcome === "arrived_late"
                ? "\n\nThe pursuit to the Crimean ports was pressed hard four months ago and arrived after the ships had cleared — a formation spent racing something it did not catch. The same appetite for a decisive result, and the same willingness to spend men reaching for one, is what puts this command on the ice at Kronstadt rather than at a negotiating table."
                : flags.compressedEvacOutcome === "cut_short"
                ? "\n\nThe pursuit reached two of the five Crimean ports before the loading finished, and the emigration that left was too small to organise itself abroad. It worked. A command that has recently been proved right about pressing an advantage to the water is not a command inclined to hear that a fortress full of sailors is a different kind of problem."
                : "")
            + "\n\nIn the same month, at the same Party Congress that ratifies the suppression, Lenin also introduces the New Economic Policy — ending the forced grain requisitioning that was the sailors' own core grievance. The Revolution wins the argument by force and concedes it by policy in the same breath. The question was never whether the Bolsheviks would win the Civil War. It was what winning actually cost, and to whom. This is the answer." +
            (flags.compressedEvacuation === "press_ports"
              ? "\n\nThe Crimean quays were contested four months ago rather than conceded. Whatever the pursuit caught, what it established was that this command does not let an enemy leave when it has the means to stop them — and the sailors in the fortress are, by the Party's own account of them, no longer being counted as anything but an enemy."
              : flags.compressedEvacuation === "let_them_go"
              ? "\n\nWrangel's people were let go from the Crimean ports four months ago without a fight for the quays: a hundred and forty-five thousand of them, on the reasoning that the peninsula was the objective and prisoners were a burden. That restraint was extended to a defeated enemy army. It is not extended here, to men who were on this side of the war in 1917 and are asking the Revolution to keep its word."
              : "") +
            (flags.distributedPursuitChoice === "press"
              ? "\n\nThe pursuit after Orel was pressed without cavalry reconnaissance, on the reasoning that a retreating enemy is not a dangerous one. The habit of assuming a broken opponent stays broken is the same habit that reads fifteen demands from Kronstadt as a White plot."
              : ""),
        };

      case "endingUnlikelyPrecedent":
        return {
          isEnding: true,
          title: "An Unlikely Precedent",
          date: "MARCH 1921",
          badge: "SPECULATIVE — PLAUSIBLE, NOT WISH-FULFILLMENT",
          classification: "speculative",
          epilogue:
            "Negotiation is genuinely attempted instead of an ultimatum. Whether an armed garrison this close to Petrograd, with the ice still crossable and the Party's own authority stretched thin by three years of civil war, could actually have been talked down rather than assaulted is a real point of dispute among historians — the sailors' core demand, 'Soviets without Communists,' asked the Party to surrender exactly the thing it was least willing to give up. Even historians sympathetic to the rebels mostly conclude a negotiated outcome was unlikely to hold for long, not that it was impossible to attempt."
            + (flags.congressChoice === "negotiate"
                ? "\n\nThis isn't the first time this command has chosen negotiation over an ultimatum with an internal faction it had the raw authority to simply crush. The Military Opposition got the same treatment back at the Eighth Congress, and it held — a genuine concession, not a collapse. Whether that same instinct can talk down an armed garrison the way it once talked down a losing faction in a closed committee room is the actual question this ending is testing, and it's a harder one than the Congress ever posed."
                : "\n\nThis command pressed its advantage at the Eighth Congress rather than negotiate the last time an internal faction pushed back — and won that fight in the end, if at real cost to the delegates who believed the closed-session result meant something. Attempting negotiation now, at Kronstadt, is a genuine departure from that pattern, not a continuation of it. Whether it's a departure this command can actually sustain under a fortress's guns is precisely what the historical record doesn't get to answer.")
            + "\n\nNo one gets to find out for certain whether it would have worked. What remains is the question the historical ultimatum foreclosed the moment it went out." +
            (flags.postingAuthority === "real"
              ? "\n\nThere is one prior data point. Stalin's reassignment after Tsaritsyn was given real authority rather than supervised authority — a genuine restoration of trust to a man this command had every institutional reason to keep on a short leash. It was the same instinct that is being extended to Kronstadt now, on a far larger scale and with far less margin for being wrong about it."
              : flags.postingAuthority === "supervised"
              ? "\n\nThere is one prior data point, and it cuts the other way. Stalin's reassignment after Tsaritsyn came with discreet oversight attached — trust extended and quietly hedged at the same time. Whether an offer of negotiation from a command with that habit reads as genuine to men who have been on the receiving end of the Revolution's hedged trust is not a question the fortress is obliged to answer generously."
              : ""),
        };

      // -----------------------------------------------------------------------
      // HARD MODE ENDING — triggers whenever Centralization Backlash reaches
      // 100, at whatever node the player happens to be on. Not tied to a
      // single date — it's the culmination of the real, repeated pattern
      // this campaign's own content documents: Tsaritsyn, the Congress
      // fallout, every override of a regional commander's judgment in favor
      // of central authority, accumulated past what the Party will tolerate.
      case "endingCentralCommitteeMoves":
        return {
          isEnding: true,
          title: "The Central Committee Moves",
          date: "DATE VARIES — TRIGGERED BY ACCUMULATED CENTRALIZATION BACKLASH",
          badge: "SPECULATIVE — HARD MODE COLLAPSE",
          classification: "speculative",
          epilogue:
            "It is not a purge, and it does not need to be dramatic to be final. It is the accumulated weight of every regional commander overruled, every faction's objection answered with central authority rather than accommodation, every Tsaritsyn-style conflict resolved the same way — until enough of the men whose cooperation this command actually depends on have concluded that centralization has stopped being a wartime necessity and started being the point. The Central Committee doesn't need a battlefield defeat to remove a chairman who has made that many enemies among people whose support he needs to keep functioning.\n\nThis is not the historical Trotsky's fate in 1919 — his real removal came years later, for different reasons, after this war was already won. It is what an accumulation of exactly this kind of decision makes plausible: a command that never lost the war to the Whites, undone instead by the same Party apparatus it was built to serve.\n\nRemoval in 1919 or 1920 is not removal in 1927. There are no show trials yet, no expulsions from the Party, no ice axe. A chairman removed at this point is reassigned — a commissariat, a diplomatic posting, a committee with a long name and no army attached to it. The war goes on and is won without him, and the official histories written afterward find it steadily easier not to mention which specific decisions the Revvoensoviet's first chairman made or when. That is its own kind of ending: not a defeat, not a purge, simply a career redirected early enough that the record has room to close over it." +
            (flags.battalionNameTreatment === "symbolic_kept"
              ? "\n\nThe worker battalions kept their name after the men who earned it were gone, refilled with conscripts who had never been miners. Maintaining a symbol past the point where it described anything real is the same administrative reflex that ends this command's career: the form preserved, the substance quietly replaced, and everyone involved agreeing not to mention the gap."
              : flags.battalionNameTreatment === "reclassified"
              ? "\n\nThe worker battalions were reclassified honestly as ordinary units once the original mobilization was gone. It was the correct call and it cost something — a command willing to say plainly that a symbol had stopped meaning anything is a command that accumulates people who would rather it hadn't."
              : "") +
            (flags.donbasAttritionChoice === "reinforced"
              ? "\n\nThe Donbas battalions were reinforced and kept in the line rather than merged away. The regional Party figures who raised those men have long memories about who spent them, and some of them are in the room when this decision gets made."
              : ""),
        };

      default:
        return null;
    }
  },
};

// =============================================================================
// PROVISIONAL GOVERNMENT — Petrograd, 1917 (Round 24 — first slice, NOT a
// finished campaign; see the BACKLOG note and the Round 24 build log doc for
// what this covers and what it deliberately does not yet)
// =============================================================================
// Design note: every other campaign in this file starts at 0 on all three
// triangle axes and treats 0 as "what actually happened." This campaign is
// the one place in the file where "what actually happened" is *itself* the
// event the other three campaigns already take as fixed, unquestioned
// backstory (Kornilov's failed coup and arrest, in the AFSR dossier; the
// Bolshevik seizure of power, in every campaign's early bulletins). That
// means the historical choice at every node here MUST resolve to the same
// facts already written into those three campaigns' text — this campaign
// does not get to quietly rewrite what they already assert as settled. Only
// the divergent branch (Kornilov's advance actually reaching Petrograd) is
// free to go somewhere those three campaigns don't already describe — and
// where it goes, it goes somewhere that makes the other three campaigns'
// entire premise not happen, which the ending for that branch says outright
// rather than glossing over.
//
// Scope, stated plainly: this covers the April Crisis through the Kornilov
// Affair (April-August 1917) from the Provisional Government's own seat —
// not the Petrograd Soviet's or the Bolsheviks' side of the same months, and
// not the February Revolution itself (which was a leaderless street event no
// single seat of command actually directed — see the bulletin recap below
// for how it's handled instead) or the October Revolution as a playable
// node (it is this campaign's terminus, not a node inside it, for the same
// reason: by the time it happens the Provisional Government is not
// commanding the outcome, it is failing to survive it).
