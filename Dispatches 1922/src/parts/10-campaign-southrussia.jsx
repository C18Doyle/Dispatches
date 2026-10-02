  southRussia: {
    id: "southRussia",
    label: "Armed Forces of South Russia",
    coalition: "white", // nominally under Kolchak's Supreme Ruler authority from June 1919 -- see Denikin/Kolchak dossiers. Practically independent throughout.
    shortTag: "AFSR", // identity — fixed regardless of skin choice
    commander: "General Anton Denikin",
    seat: "AFSR General Staff, Tsaritsyn",
    thesis: "One war. A White movement nominally united under Kolchak but fought, in practice, as an independent campaign — managing the shape of a defeat, not chasing an alternate victory.",
    start: "kornilovsDeath18",

    initialMeters: {
      manpower: 0,
      materiel: 0,
      rail: 0,
    },
    triangleAxes: [
      { key: "manpower", label: "MANPOWER" },
      { key: "materiel", label: "FOREIGN MATÉRIEL" },
      { key: "rail", label: "RAIL CONTROL" },
    ],
    initialLegitimacy: 0, // zero-baseline, same convention as the triangle — historical choices carry {} here too
    plannedEnding: {
      date: "NOVEMBER 1920",
      title: "The Crimea Evacuation",
      note:
        "Not Denikin's April 1920 resignation — that's a command handover mid-story. Wrangel's final evacuation from Crimea is the real terminus: the last organized White military-political entity in European Russia physically leaves. Should land after his land-reform gambit pays off or fails, so a player who backed reform feels it mattered even in defeat.",
    },
    hardMode: {
      key: "cohesionStrain",
      label: "Volunteer Army Cohesion",
      capitalName: "KALABUKHOV MODE",
      capitalLabel: "COHESION CAPITAL",
      description:
        "No rewind, no meter dashboard — only staff reports. Five points of Cohesion Capital to spend on centralizing choices that override the Cossack Hosts' objections. Spend all five and the coalition doesn't survive it — Cossack contingents desert or turn on the rearguard at the fifth override, the campaign ending in mutiny, not battlefield defeat. Named for the Kuban Rada chairman hanged in November 1919 for the crime of negotiating separately — the same instinct, spent five times running.",
      buttonLabel: "OPEN COMMAND",
      maxCap: 5,
      maxEndingId: "endingCossackMutiny",
    },

    NEWSPAPER_MASTHEAD: "VELIKAYA ROSSIYA",
    NEWSPAPER_SUBHEAD: "Great Russia — as read at AFSR field headquarters",
    ADVISOR_DOSSIERS: {
      kornilov: {
        role: "Commander-in-Chief, Volunteer Army (until April 13, 1918)",
        bio:
          "Former commander of the Petrograd Military District under the Provisional Government, arrested and imprisoned after his failed August 1917 attempt to establish a military dictatorship. Escaped to organize the Volunteer Army in the Don region with Alekseev after the Bolshevik seizure of power.",
        fate:
          "Killed on April 13, 1918, when a Red artillery shell struck the single room of his farmhouse headquarters near Ekaterinodar. His death was concealed from the army for a time to prevent a collapse in morale; he was buried in secret.",
        faction: "Volunteer Army Founding Command",
        rank: 0,
      },
      alekseev: {
        role: "Political leader, Volunteer Army",
        bio:
          "Former Chief of Staff of the Imperial Russian Army under the Tsar and briefly Supreme Commander-in-Chief under the Provisional Government. Co-founded the Volunteer Army with Kornilov, taking political leadership while Kornilov held military command.",
        fate:
          "Died of heart failure in Ekaterinodar in October 1918, six months after Kornilov, having lived just long enough to see the Volunteer Army retake the city it had failed to capture under his and Kornilov's joint leadership.",
        faction: "Volunteer Army Founding Command",
        rank: 0,
      },
      denikin: {
        role: "Commander-in-Chief, AFSR — nominally subordinate to Kolchak's Supreme Ruler government from June 1919",
        bio:
          "Career Imperial Army officer of humble birth, risen on merit rather than aristocratic connection. Committed to a unified, centrally-governed Russia and instinctively suspicious of regional autonomy movements — a position that put him at odds with the Cossack Hosts and Ukrainian nationalists whose cooperation his campaign depended on. On June 12, 1919, he formally submitted to Kolchak's authority, telegraphing: 'Safety of cause lies in a single high commander-in-chief... I yield to Admiral Kolchak and recognize him as Supreme Governor Russian state and commander-in-chief Russia Army.' The recognition was real but purely symbolic — it changed nothing about AFSR's operational independence, which every later decision from this command reflects.",
        fate:
          "Named Kolchak's successor as Supreme Ruler in December 1919; briefly held that title himself, in name only, from January to April 1920 — while personally commanding the Novorossiysk evacuation and the retreat that followed. Resigned command in April 1920 after the retreat into Crimea, handing over to Wrangel. Died in exile in the United States in 1947, having spent his final years urging émigrés not to side with Nazi Germany against the USSR.",
        faction: "AFSR High Command",
        rank: 0,
      },
      wrangel: {
        role: "Commander, Caucasus Army",
        bio:
          "Opposed the Moscow Directive's broad-front advance from the outset, arguing for concentrating the Whites' considerable cavalry strength on the Volga axis and securing the rear before pushing further. Privately dismissive of the directive's chances.",
        fate:
          "Succeeded Denikin as Commander-in-Chief in April 1920, held Crimea for six more months, and organized the November 1920 evacuation of the remaining White forces. Died in Brussels in 1928.",
        faction: "AFSR High Command",
        rank: 1,
      },
      shatilov: {
        role: "Chief of Staff, Armed Forces of South Russia / Russian Army (from April 1920)",
        bio:
          "Wrangel's closest staff officer and confidant, serving as his chief of staff through the entire Crimean period. Co-signed, with Konovalets, the letter proposing cooperation to Makhno's insurgent staff in June 1920 — an overture Makhno's own council answered by executing the messenger who delivered it.",
        fate:
          "Evacuated with the rest of the command in November 1920. Remained one of Wrangel's closest associates in emigration, active in the Russian All-Military Union alongside Kutepov. Died in Cannes in 1954, one of the few senior AFSR/Russian Army commanders to die of natural causes rather than assassination, execution, or violence.",
        faction: "AFSR High Command",
        rank: 1,
      },
      kutepov: {
        role: "Commander, 1st Army Corps; head of the Novorossiysk/Crimea evacuation effort",
        bio:
          "A straightforward, respected combat officer with no real background in politics or administration — as Governor-General of the Black Sea region in 1918 he executed suspected looters and pogrom perpetrators without much regard for legal process. Oversaw the evacuation commission at Novorossiysk in 1920.",
        fate:
          "Evacuated to Gallipoli with his corps after Crimea fell, eventually settling in Paris as chairman of the Russian All-Military Union, an émigré veterans' organization that ran sabotage operations into the USSR. Kidnapped off a Paris street by Soviet OGPU agents on January 26, 1930; died of a heart attack during the struggle. His body was never found.",
        faction: "AFSR High Command",
        rank: 1,
      },
      krivoshein: {
        role: "Head of Government, South Russia (from April 1920)",
        bio:
          "Agriculture minister under Nicholas II and Stolypin's closest collaborator on the land reforms of 1906–11, which broke up the peasant commune and created a class of individual smallholders. Brought in by Wrangel in April 1920 to give the Crimea a civil government, he wrote the land law of May 1920 — peasants purchasing, through the state, the land they already worked. It was the measure White commanders had been advised to adopt since 1918 and had refused every time.",
        fate:
          "The law had seven months to work in a peninsula under siege, which was not enough to test whether it would have changed anything in 1918. Evacuated with the rest in November 1920. Died in Berlin in 1921, a year after the government he had been brought in to build.",
        faction: "Crimean Government",
        rank: 1,
      },
      ulagai: {
        role: "Commander, Kuban Expeditionary Force",
        bio:
          "Led the roughly 4,500-man landing across the Sea of Azov in August 1920, timed to coincide with the land law's rollout in the hope of linking up with Kuban partisan networks and widening the Northern Tauride offensive.",
        fate:
          "The expedition lasted barely three weeks before being forced to withdraw — the hoped-for peasant and Cossack rising in the Kuban never materialized at the scale needed to hold the bridgehead.",
        faction: "AFSR High Command",
        rank: 2,
      },
      holman: {
        role: "Brigadier-General, head of the British Military Mission to South Russia",
        bio:
          "Led Britain's military mission from mid-1919, overseeing the delivery of over 200,000 rifles and substantial artillery to the AFSR. At Novorossiysk personally promised Denikin that British forces would see the women and children of White officers evacuated safely, and stood on the harbor mole through the night of March 26 supervising the Don Cossacks' embarkation himself.",
        fate:
          "Left South Russia with the evacuation's completion. His personal emotional investment in the people he'd promised to save was noted by those who served under him — described by one contemporary as visibly overwhelmed by what he witnessed on the docks.",
        faction: "British Military Mission",
        rank: 2,
      },
    },

    NODE_ATLAS: [
      { id: "kornilovsDeath18", date: "APRIL 1918", title: "Ekaterinodar: The Shell That Changed Command" },
      { id: "ekaterinodarAssault18", date: "APRIL 1918", title: "Ekaterinodar: One More Day" },
      { id: "afterEkaterinodar18", date: "APRIL 1918", title: "Ekaterinodar: What the Foothold Bought" },
      { id: "moscowDirective19", date: "JULY 1919", title: "Tsaritsyn: The Directive" },
      { id: "kievConvergence19", date: "AUGUST 1919", title: "Kiev: Whose Flag" },
      { id: "volgaThrust19", date: "AUGUST 1919", title: "The Volga: How Far" },
      { id: "volgaOverextension19", date: "SEPTEMBER 1919", title: "The Volga: An Empty Rendezvous" },
      { id: "rearSecurity19", date: "SEPTEMBER 1919", title: "Ukraine: The Insurgent Rear" },
      { id: "peregonovka19", date: "SEPTEMBER 1919", title: "Peregonovka: The Trap That Broke" },
      { id: "makhnosAftermath19", date: "OCTOBER 1919", title: "Peregonovka: What the Depot Bought" },
      { id: "orelCulmination19", date: "OCTOBER 1919", title: "Orel: The Culmination" },
      { id: "cossackDesertion19", date: "NOVEMBER 1919", title: "The Don: Going Home" },
      { id: "volgaCossackDesertion19", date: "NOVEMBER 1919", title: "The Volga: Riding for Home" },
      { id: "kubanCoup19", date: "NOVEMBER 1919", title: "Ekaterinodar: The Rada's Price" },
      { id: "kubanRadaReorganized19", date: "DECEMBER 1919", title: "Ekaterinodar: A Rada That Says Yes" },
      { id: "kharkovLine19", date: "DECEMBER 1919", title: "Kharkov: A Line That Might Hold" },
      { id: "kharkovEncirclement19", date: "DECEMBER 1919", title: "Kharkov: The Threat of the Ring" },
      { id: "afterTheCavalryStrike19", date: "DECEMBER 1919", title: "Kharkov: The Cavalry's Aftermath" },
      { id: "kubanQuotaAftermath19", date: "JANUARY 1920", title: "Ekaterinodar: The Gap on the Record" },
      { id: "novorossiysk20", date: "MARCH 1920", title: "Novorossiysk: The Ships" },
      { id: "voroshilovsCavalry20", date: "MARCH 1920", title: "The Mole: Whoever Holds It Last" },
      { id: "moleRearguardFate20", date: "MARCH 1920", title: "The Mole: The Rearguard's Own Minutes" },
      { id: "wrangelsDismissal20", date: "FEBRUARY 1920", title: "Sevastopol: The Baron's Letter" },
      { id: "wrangelsReassignment20", date: "FEBRUARY 1920", title: "Field Command: A Quieter Argument" },
      { id: "sevastopolCouncil20", date: "APRIL 1920", title: "Sevastopol: The Council of Commanders" },
      { id: "landLawDecision20", date: "MAY 1920", title: "Sevastopol: The Land Law" },
      { id: "northernTauride20", date: "JUNE 1920", title: "Tauride: Neither Bayonets Nor Deeds" },
      { id: "wrangelsEnvoy20", date: "JULY 1920", title: "Vrem'evka: The Letter to Makhno" },
      { id: "crimeaDefensePrep20", date: "OCTOBER 1920", title: "Sevastopol: Preparing for the End" },
    ],
    NODE_TOTAL: 29,
    ENDINGS_GALLERY: [
      { id: "endingBizerte", title: "The Bizerte Fleet", classification: "historical" },
      { id: "endingTheCouncilAtSevastopol20", title: "The Council at Sevastopol", classification: "speculative" },
      { id: "endingSecondNovorossiysk", title: "Second Novorossiysk", classification: "speculative" },
      { id: "endingArmyDissolved20", title: "The Army That Dissolved", classification: "speculative" },
      { id: "endingCossackMutiny", title: "The Mutiny", classification: "speculative" },
      { id: "endingTheArmyThatDidNotComeBack18", title: "The Army That Did Not Come Back", classification: "speculative" },
      { id: "endingTheLineThatBroke19", title: "The Line That Broke", classification: "speculative" },
    ],
    ENDING_CLASSIFICATION: {
      endingBizerte: "historical",
      endingTheCouncilAtSevastopol20: "speculative",
      endingSecondNovorossiysk: "speculative",
      endingArmyDissolved20: "speculative",
      endingCossackMutiny: "speculative",
      endingTheArmyThatDidNotComeBack18: "speculative",
      endingTheLineThatBroke19: "speculative",
    },

    resolveNode(nodeId, flags = {}, meters = {}) {
      switch (nodeId) {
        // -------------------------------------------------------------------
        case "kornilovsDeath18":
          return {
            date: "APRIL 1918",
            title: "Ekaterinodar: The Shell That Changed Command",
            bulletin: {
              headline: "PEACE WITH GERMANY, SIX WEEKS OLD",
              body: "Brest-Litovsk, signed 3 March: Poland, Finland, the Baltics, and all of Ukraine surrendered to German occupation — a quarter of the old empire. Trotsky's own delegation walked out twice before signing. Lenin's argument carried the room: a government that does not survive the winter builds socialism nowhere. That government is what this command now exists to fight.",
              meanwhile: {
                siberia: "No organized front here yet. The Czechoslovak Legion — 50,000 men working their way east along the Trans-Siberian under an agreement with the Bolsheviks to evacuate peacefully — is still six weeks from the clash that will end that agreement and open this front entirely.",
                bolsheviks: "The peace bought survival, not consensus. The Left Socialist-Revolutionaries who shared power with the Bolsheviks broke over the treaty within weeks, and their own uprising against the government they helped form is still four months off.",
              },
            },
            historicalRecord: true,
            situation:
              "A Red artillery shell has found the one room in the farmhouse headquarters where Kornilov was standing. He is dead — a fact his own staff are keeping from the Volunteer Army for now, for fear that losing the man who founded this movement will collapse what little cohesion four thousand exhausted men retreating across frozen steppe still have. Command has passed to you. Kornilov's assault on Ekaterinodar, the Kuban Cossack capital, is five days old and has made no real progress against a Red garrison more than twice the Volunteers' number.",
            choices: [
              {
                label: "Call off the assault. Withdraw north toward the Don rather than continue a fight Kornilov's death has made yours to lose or preserve.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I did not ask for this command in the middle of a battle I did not plan. What I will not do is spend the army that's left on a city we do not currently have the strength to take, in a fight that was already going badly before this morning.",
                },
                historical: true,
                setFlags: { ekaterinodarChoice: "withdraw" },
                impact: {},
                next: "moscowDirective19",
                outcome:
                  "The withdrawal begins that evening — the retreat that becomes known as the Ice March, back across the frozen Kuban steppe toward the Don. It is not the last time this army fights for Ekaterinodar: reinforced and reorganized, it returns to take the city for real in August. By January 1919 the Volunteer Army has unified with the Don Cossack forces into the Armed Forces of South Russia, and this command's real campaign — the one that reaches its high-water mark at Tsaritsyn a year from now — begins in earnest.",
              },
              {
                label: "Press the assault. Honor Kornilov's plan and gamble that the city falls before the army does.",
                advisor: {
                  name: "Alekseev",
                  quote:
                    "Abandoning the fight the same day our commander dies looks like exactly the weakness this movement cannot afford to show. I have heard that argument made with real conviction. I have not yet heard anyone explain how it survives contact with a garrison twice our number, under a man who has held command for a single day and did not draw up this attack.",
                },
                historical: false,
                setFlags: { ekaterinodarChoice: "press" },
                gate: (m) => m.manpower >= -4,
                disabledReason: "Pressing a second day against a garrison this size requires an army that can still absorb the losses. This one cannot.",
                impact: { manpower: -3 },
                next: "ekaterinodarAssault18",
                outcome:
                  "The assault continues under a commander who inherited a battle plan he didn't design, against a garrison that outnumbers his own force more than two to one.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of pressing Kornilov's assault.
        // historicalRecord false throughout: nothing about this specific
        // continuation happened. Both choices are speculative; the roll
        // reflects genuine uncertainty about whether pressing further, this
        // outnumbered, this early into an unplanned command, could plausibly
        // gain anything.
        case "ekaterinodarAssault18":
          return {
            date: "APRIL 1918",
            title: "Ekaterinodar: One More Day",
            bulletin: {
              headline: "THE WAR IN THE WEST GOES ON WITHOUT US",
              body: "Germany's spring offensive has been running on the Western Front since 21 March — fifty divisions transferred from the east, freed by the peace Russia signed at Brest-Litovsk three weeks earlier. The Allies are being pushed back toward Amiens by men who were facing Russian guns in November. Every officer in this army understands the arithmetic: the troops now breaking the British Fifth Army are there because Russia left the war. It is the central grievance of the White movement and the reason Allied support for it will exist at all.",
              meanwhile: {
                siberia: "No front here yet. The Czechoslovak Legion is still moving east along the Trans-Siberian under Bolshevik agreement, six weeks from the Chelyabinsk clash that opens this theatre.",
                bolsheviks: "The government has moved the capital from Petrograd to Moscow in March, out of reach of the German advance the peace was supposed to have stopped.",
              },
            },
            historicalRecord: false,
            situation:
              "A second day of assault has gained a foothold on the city's outskirts but nothing resembling a breakthrough. The garrison's numbers haven't meaningfully thinned. Every hour spent pressing is an hour the army isn't using to withdraw in good order while it still can.",
            choices: [
              {
                label: "Press one more day. The foothold gained might be the beginning of something, not the end of it.",
                advisor: {
                  name: "Alekseev",
                  quote:
                    "I have already told you what I think the odds are. I am telling you now that a foothold thrown away a day early is a foothold we never actually get to test the value of.",
                },
                historical: false,
                impact: { manpower: -3 },
                next: "afterEkaterinodar18",
                outcome:
                  "The extra day is spent. Whether it was ever going to turn a foothold into a breakthrough against a garrison this size, nothing in the record settles. The roll does.",
                uncertain: (() => {
                  const paysOffWeight = modWeight(25, meterPct(meters.manpower));
                  return [
                    {
                      weight: paysOffWeight,
                      title: "The foothold expands",
                      setFlags: { secondDayOutcome: "expanded" },
                      impact: { manpower: 3, rail: 2 },
                      outcome:
                        "Against real odds, the extra pressure opens a genuine gap in the garrison's line. It isn't the city falling — but it's enough of a foothold that the eventual withdrawal happens from a stronger position than the assault's second day looked like it would leave.",
                    },
                    {
                      weight: 100 - paysOffWeight,
                      title: "The foothold costs more than it holds",
                      setFlags: { secondDayOutcome: "collapsed" },
                      impact: { manpower: -3 },
                      outcome:
                        "The garrison's numbers simply outlast the pressure. The foothold doesn't expand — it erodes, and the eventual withdrawal happens later and from a worse position than calling it a day earlier would have left.",
                    },
                  ];
                })(),
              },
              {
                label: "Withdraw now. A foothold that hasn't become a breakthrough after two days isn't going to on the third.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I said at the outset I would not spend this army on a city we cannot currently take. Two days of proof that the garrison holds is enough proof. I am not waiting for a third.",
                },
                historical: false,
                impact: { manpower: 2 },
                next: "moscowDirective19",
                outcome:
                  "The withdrawal begins a day later than it would have if the assault had been called off immediately after Kornilov's death — thinner and later than the historical Ice March, but not thinner still for having gambled a third day on a foothold that was never likely to become more than that.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — genuinely different immediate aftermath
        // depending on whether the foothold expanded or collapsed.
        // historicalRecord false throughout, entirely counterfactual.
        case "afterEkaterinodar18":
          if (flags.secondDayOutcome === "expanded") {
            return {
              date: "APRIL 1918",
              title: "Ekaterinodar: What the Foothold Bought",
              historicalRecord: false,
              situation:
                "The gap in the garrison's line is real, and it's tempting — a genuine opening this army did not have two days ago. It is also the kind of opening a battered, newly-commanded force could easily overreach trying to exploit. Whether to push through it now, while it's real but the army holding it is exhausted, or consolidate the gain and begin the withdrawal from a stronger position than the historical retreat had, is the actual choice this rare piece of good news has created.",
              choices: [
                {
                  label: "Push through the gap now, while it's open. An exhausted army that hesitates may lose the opening entirely.",
                  advisor: {
                    name: "Alekseev",
                    quote:
                      "I did not argue for the extra day so that we could stop the moment it actually worked. The gap is real. Gaps this size do not stay open for commanders who wait to be certain.",
                  },
                  historical: false,
                  setFlags: { footholdChoice: "push_through" },
                  impact: { manpower: -2, rail: 1 },
                  next: "moscowDirective19",
                  outcome:
                    "The push goes through the gap. It is a gamble on an exhausted army — and it is the kind of gamble that, win or lose, this command will still be living with the consequences of a year from now.",
                },
                {
                  label: "Consolidate the gain. Begin the withdrawal now, from a genuinely stronger position than the historical retreat ever had.",
                  advisor: {
                    name: "Denikin",
                    quote:
                      "I would rather withdraw from a position we actually hold than gamble it chasing more than we have any right to expect an exhausted army to take. The gain is real. I intend to keep it real rather than risk it becoming another overreach.",
                  },
                  historical: false,
                  setFlags: { footholdChoice: "consolidate" },
                  impact: { manpower: 2 },
                  next: "moscowDirective19",
                  outcome:
                    "The withdrawal begins from the strongest position this counterfactual branch has managed — a modest improvement over the historical Ice March's own starting conditions, banked rather than risked on a further push.",
                },
              ],
            };
          }
          return {
            date: "APRIL 1918",
            title: "Ekaterinodar: What the Collapse Cost",
            historicalRecord: false,
            situation:
              "The foothold eroded rather than held, and the third day's losses are worse than the second's. What's left of the assault force now has to withdraw from a genuinely weaker position than even the historical retreat started from — the question is whether to attempt an immediate, urgent withdrawal while any organization remains, or take a day to reorganize first, at the cost of the garrison's continued pressure.",
            choices: [
              {
                label: "Withdraw immediately, disorganized or not. Every additional hour under this pressure costs more than reorganizing would save.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I would rather retreat badly organized than lose more of this army to a garrison that has already proven it can outlast whatever pressure we bring to bear. We go now.",
                },
                historical: false,
                setFlags: { collapseChoice: "immediate_withdrawal" },
                impact: { manpower: -1 },
                next: "moscowDirective19",
                outcome:
                  "The withdrawal happens at once, in worse order than the historical Ice March managed. This counterfactual branch begins its own year of campaign history from a harder starting point than the retreat that happened — a real, compounding cost from a gamble that didn't pay off.",
              },
              {
                label: "Take a day to reorganize first, accepting the continued pressure in exchange for a more orderly withdrawal.",
                advisor: {
                  name: "Alekseev",
                  quote:
                    "I was wrong about the foothold. I am not certain compounding that mistake with a disorganized retreat is the correction it looks like — a day spent reorganizing under pressure is costly, but a retreat that falls apart entirely is costlier still.",
                },
                historical: false,
                setFlags: { collapseChoice: "reorganize_first" },
                impact: { manpower: -3, materiel: -1 },
                uncertain: [
                  {
                    weight: 65,
                    title: "The reorganisation holds and the army gets clear",
                    setFlags: { ekaterinodarSurvival: "extracted" },
                    impact: {},
                    next: "moscowDirective19",
                    outcome:
                      "The extra day under pressure costs more men, and the withdrawal that follows holds together because of it. The army gets clear of Ekaterinodar as an army. Whether the trade was worth it stays unresolved, and this branch carries the question forward into the year still ahead of it.",
                  },
                  {
                    weight: 35,
                    title: "Sorokin's counterattack catches the reorganisation",
                    setFlags: { ekaterinodarSurvival: "destroyed" },
                    impact: { manpower: -3 },
                    next: "endingTheArmyThatDidNotComeBack18",
                    outcome:
                      "The day spent reorganising is the day the garrison uses. Sorokin's forces come out of Ekaterinodar against a force still forming up to leave, and what was a withdrawal becomes a pursuit across open steppe with nothing prepared behind it.",
                  },
                ],
                next: "moscowDirective19",
                outcome:
                  "The order goes out to hold one more day and reorganise before withdrawing, with the garrison still pressing.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // ---------------------------------------------------------------------
        // ENDING — April 1918. Until this existed, this campaign's earliest
        // ending was April 1920: two full years in which the Volunteer Army
        // could not actually be destroyed no matter what was done to it. It
        // came far closer than that. historicalRecord false for the
        // destruction; everything describing the real Ice March is documented.
        // ---------------------------------------------------------------------
        // ENDING — the mid-war collapse. Until this existed the campaign had
        // nothing terminal between April 1918 and April 1920, which meant two
        // years of accumulated rail and manpower damage with no consequence
        // attached to it. Reached only by arriving at the Kharkov encirclement
        // with the rail net already wrecked AND choosing to fight it out
        // rather than withdraw — a decision the meters make genuinely
        // unaffordable rather than merely unwise.
        case "endingTheLineThatBroke19":
          return {
            isEnding: true,
            title: "The Line That Broke",
            date: "DECEMBER 1919",
            badge: "\u25c7 SPECULATIVE — DOWNSTREAM OF DIVERGENCE",
            classification: "speculative",
            epilogue:
              "There is no retreat to the Kuban, no Novorossiysk, and no Crimea, because the army does not get that far as an army. Budyonny's cavalry closes both flanks around Kharkov while this command is still committing its own reserves to the centre, and the encirclement holds. What comes out the other side is not a fighting force conducting a withdrawal — it is columns moving south independently, without a rail net to move them on and without the matériel to fight for the ground they cross.\n\nThe historical AFSR retreated from Kharkov in December 1919 badly, and survived it. The difference here is not the decision at Kharkov alone: it is arriving at that decision with the railways already too degraded to move a reserve, too little matériel to hold a line, and a cavalry arm already spent. The historical army had margin for one bad choice at Kharkov. This one had none, and spent it anyway.\n\nDenikin does not resign at Sevastopol in April, because there is no Sevastopol council to convene — no organised remnant reaches the Crimea to be argued over. Wrangel's Russian Army, the land law, the Northern Tauride, the November evacuation that got a hundred and forty-six thousand people out: none of it happens. The southern front simply ends in Ukraine in the last month of 1919, four months early, and the Red Army turns its full weight east and west a season sooner than the record shows."
          };

        case "endingTheArmyThatDidNotComeBack18":
          return {
            isEnding: true,
            title: "The Army That Did Not Come Back",
            date: "APRIL 1918",
            badge: "\u25c7 SPECULATIVE — DOWNSTREAM OF DIVERGENCE",
            classification: "speculative",
            epilogue:
              "The Volunteer Army does not survive Ekaterinodar. There is no second campaign, no Moscow Directive, no Orel, no Novorossiysk, and no Crimea — none of it occurs, because the force it would have been fought by is broken on the Kuban steppe in April 1918 by a garrison it should not have spent a third day in front of.\n\nThe real margin here was thin enough that this is not a large counterfactual. Kornilov was killed by a shell at his headquarters at Elizavetinskaya on 13 April 1918; Denikin called off the assault and extracted roughly four thousand men, and the First Kuban Campaign — the Ice March — reached the Don in May with the army intact but barely. Everything the AFSR later became grew from those four thousand. An army that stayed one day longer in front of Sorokin's garrison is not a different army by much. It is the same army, minus the extraction.\n\nWhat follows is what the White movement in south Russia looked like without a Volunteer Army at its centre: Cossack hosts defending their own territory and negotiating separately, German-backed formations in the Ukraine with their own priorities, and no unified command for the Allies to recognise, supply, or blame. Denikin, if he is among the four thousand who do not get clear, does not write the five volumes. There is no Novorossiysk to answer for, and no Bizerte to sail to.\n\nThe war is still won by the same side. It is won faster, against opponents who never combine, and the version of it that gets written afterward has no southern front worth arguing about — which is its own kind of erasure, and not obviously a kinder one than the record the historical army earned.",
          };

        case "moscowDirective19":
          return {
            date: "JULY 1919",
            title: "Tsaritsyn: The Directive",
            bulletin: {
              headline: "FOURTEEN MONTHS OF NEWS, LATE",
              body: "Two items this front's own dispatches have been too consumed by the fighting to properly register. November: an armistice ends the war in Europe — not a victory for either side, and Allied troops remain on Russian soil with no reason for it committed to paper. March: Moscow declares itself the seat of a new Communist International, on the record for carrying revolution past Russia's own borders. No single battle this year has done more to keep Allied funding flowing than that declaration.",
              meanwhile: {
                siberia: "Kolchak's own spring offensive, which briefly reached the Volga in April, has already broken. The Red counteroffensive out of Buguruslan has his armies falling back toward the Urals — the collapse that becomes general by autumn.",
                bolsheviks: "The Eighth Party Congress's internal fight over military policy was formally settled in March by compromise commission. It settled less than the resolution suggests; this southern front, now advancing, is what actually occupies Moscow's attention.",
              },
            },
            historicalRecord: true,
            situation:
              "Tsaritsyn has fallen. In five weeks the AFSR has taken Kharkov, Ekaterinoslav, and now the Volga bastion. The question on every staff officer's desk is what comes next. Wrangel wants the offensive concentrated — mass the cavalry, secure the flanks, advance methodically up the Volga. You are drafting Directive No. 08878." +
              (flags.ekaterinodarSurvival === "extracted"
                ? " This command reached Tsaritsyn a year later than it would have if Ekaterinodar in 1918 had gone differently, and by a harder road — the extra day spent reorganising the withdrawal is still the reason the order of battle behind this directive looks the way it does."
                : ""),
            choices: [
              {
                label: "Issue the broad-front directive: converge on Moscow from Kharkov, Tsaritsyn, and the Don simultaneously.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "Every man in this army has dreamed of marching on Moscow since the day the Volunteer Army was founded. We do not have the luxury of a methodical campaign — momentum is the only weapon that has not failed us yet.",
                },
                historical: true,
                setFlags: { directiveIssued: "broad" },
                impact: {},
                next: "kievConvergence19",
                outcome:
                  "The directive goes out on three axes at once. Poltava falls within the month. But the supply lines behind the advance stretch thinner with every mile, and the single-track rail network south of Kursk is already showing signs of strain.",
              },
              {
                label: "Overrule the broad front. Concentrate the cavalry on the Volga axis first, as Wrangel proposes.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "Give me every mounted division you can spare and secure Astrakhan on my flank, and I will put fifty thousand sabres somewhere the Red Army cannot ignore. Spread the same men across three fronts and none of them will be strong enough to matter.",
                },
                historical: false,
                setFlags: { directiveIssued: "concentrated" },
                impact: { manpower: 1, materiel: 1, rail: 3 },
                next: "volgaThrust19",
                outcome:
                  "Wrangel gets his concentration order, over open objection from officers who see it as favoring the Caucasus Army's own commander. The advance is slower out of the gate, but the rail lines behind it stay intact.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // NEW round 22 — the "Kiev convergence," a real gap identified in
        // round21 research and only cleared to write once a second
        // independent source (Wikipedia's dedicated "Ukrainian anti-Soviet
        // campaign (1919)" article, corroborating the dedicated "Capture of
        // Kiev by the White Army" article) confirmed the node-grade facts:
        // Bredov's White advance guard and Kravs's/Petliura's UPR corps
        // reached Kiev within hours of each other on 30-31 August 1919, a
        // flag incident during the Ukrainian victory parade produced an
        // exchange of fire, and Bredov's ultimatum forced roughly 3,000
        // Ukrainian troops disarmed and the rest withdrawn 25km west, with
        // negotiated prisoner/weapon exchanges. Only the historical choice
        // below (A) is drawn directly from that record; B and C are
        // plausible alternate command decisions at the same crossroads,
        // consistent with Denikin's and Wrangel's already-documented
        // positions elsewhere in this file, not additional historical
        // claims. downstream continuity in rearSecurity19 reads
        // flags.kievApproach.
        case "kievConvergence19":
          return {
            date: "AUGUST 1919",
            title: "Kiev: Whose Flag",
            historicalRecord: true,
            situation:
              "The broad-front advance has reached Kiev from the south just as Ukrainian People's Republic forces close on it from the west — General Antin Kravs's Galician and Zaporizhzhia corps, some eighteen thousand men under Petliura's overall command, have already skirmished their way into the outskirts and are planning a victory parade for the morning of the 31st. Lieutenant-General Nikolai Bredov's advance guard, roughly six thousand strong, is a day behind them and closing on the same bridges. Two armies that have never coordinated a single operation between them are about to occupy the same city within hours of each other, and nobody on either side has decided what happens when they meet.",
            choices: [
              {
                label: "Let Bredov use his own judgment: enter alongside the Ukrainian parade, then demand Kravs's army disarm and withdraw the moment friction gives grounds for it.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "Petliura's government has never been recognized by this command and will not be now, on the strength of a parade. If his troops are inside Kiev when Bredov arrives, they leave Kiev — armed or not, however that has to happen.",
                },
                historical: true,
                setFlags: { kievApproach: "assert_exclusive" },
                impact: {},
                next: "rearSecurity19",
                outcome:
                  "It happens almost exactly as feared. Ukrainian troops marching on Duma Square and Bredov's volunteers entering the city collide within the same hour on the 31st; when Colonel Salsky's men pull down the Russian tricolor someone had raised beside their own flag, a White cavalryman is shot dead in the scuffle that follows. Bredov's ultimatum goes out that afternoon. By evening some three thousand of Kravs's men have been disarmed, and what's left of the Ukrainian force is negotiating a twenty-five-kilometer withdrawal west, under a mutual exchange of prisoners and weapons Bredov didn't have to offer and did anyway. Petliura's army — the one force in the theater that might have kept fighting the Reds alongside this one — is now an enemy instead, exactly the outcome Denikin's own instinct for a unified command has produced at every turn so far.",
              },
              {
                label: "Restrain Bredov. Hold outside the city overnight and negotiate a provisional joint arrangement rather than enter alongside the parade at all.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "We do not have eighteen thousand extra men to spend making a point about whose flag flies over a city hall. Let Kravs have his parade. An army that fights the Reds without us costs this command less than a city that fights us instead.",
                },
                historical: false,
                setFlags: { kievApproach: "provisional_accommodation" },
                impact: { manpower: 1, materiel: -2, rail: -1 },
                next: "rearSecurity19",
                outcome:
                  "Bredov holds his lead elements at the Chain Bridge overnight rather than crossing into the parade. It buys an uneasy standoff instead of a shooting one — no cavalryman dies over a flag, and Kravs's force stays intact rather than being disarmed. It also means none of the roughly three thousand rifles that came with those disarmed men ever reaches AFSR stores, and Denikin's own staff spend the next fortnight arguing with a joint administration over which side's gendarmerie actually runs the city — an argument this command is no better equipped to win than it was to avoid.",
              },
              {
                label: "Preempt entirely. Push Bredov's advance guard forward a day early to deny Kravs's corps the city outright, before any parade can happen.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "Whoever is inside the walls when the other side arrives makes the rules for what happens next. I would rather Bredov's men be inside those walls a day early than negotiate anything with a force that got there first.",
                },
                historical: false,
                setFlags: { kievApproach: "preempt" },
                gate: (m) => m.manpower >= -3,
                disabledReason: "An accelerated forced march on Kiev, contesting the approach roads before Kravs's corps completes its occupation, is not something an army already this depleted can mount.",
                impact: { manpower: -4, materiel: 1, rail: 1 },
                next: "rearSecurity19",
                outcome:
                  "Bredov pushes the advance guard forward a day early, forcing the pace along roads Kravs's own corps was still using to close on the city. It costs the column real strength — men and horses spent winning a footrace rather than negotiating one. It also means there is no parade to interrupt and no flag to fight over: the Ukrainian force finds White pickets already on the Chain Bridge and turns west without ever formally entering the city it spent four days marching to reach. Kravs's corps survives intact, at large, and entirely unreconciled to a command that never gave it the chance to negotiate anything.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of the speculative Moscow Directive
        // choice. Both choices here are historical:false — there is no "real"
        // resolution to compare against once you're this far into a
        // counterfactual, so historicalRecord is false for the whole node and
        // neither option carries the historical:true flag.
        case "volgaThrust19":
          return {
            date: "AUGUST 1919",
            title: "The Volga: How Far",
            historicalRecord: false,
            situation:
              "Wrangel's concentrated cavalry has done what the broad front never managed — a narrow but unmistakable breakthrough up the Volga axis, with supply lines still largely intact. Denikin's own letters to Kolchak have spoken of a hoped-for junction near Saratov. The question is whether to press that hope now, while the breakthrough is real, or consolidate the gain and accept that a link-up this ambitious was never likely to hold even if reached.",
            choices: [
              {
                label: "Press north toward Saratov, chasing the junction with Kolchak's retreating forces.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I said at Tsaritsyn that concentration would buy us something the broad front couldn't. I did not say it would buy us everything Denikin has been writing to Omsk about. Pressing this far outruns the supply we actually have.",
                },
                historical: false,
                impact: { manpower: -3, rail: -4 },
                next: "volgaOverextension19",
                outcome:
                  "The advance presses north. By the time it's clear Kolchak's own army is already collapsing faster than any junction could reach it, the overextension has cost real ground back at the original breakthrough point.",
              },
              {
                label: "Consolidate the Volga gains rather than chase a junction that was never likely to hold.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "A real gain we can hold is worth more than a hoped-for one we cannot. I did not argue for concentration so we could spend the advantage it bought chasing a rendezvous with an army that may not exist by the time we get there.",
                },
                historical: false,
                impact: { manpower: 2, rail: 2 },
                next: "volgaCossackDesertion19",
                outcome:
                  "The gain holds, briefly. It does not change the outcome of the war Kolchak's own campaign is already losing on the other side of this history — but it costs less than the reach for Saratov would have.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of pressing the Volga thrust north.
        // historicalRecord false: this is a real cross-campaign consequence,
        // not an invented one — Kolchak's own retreat past the Urals is
        // already written into Siberia's chain on this same timeline, so an
        // advance chasing his army finds it genuinely wasn't there to find.
        case "volgaOverextension19":
          return {
            date: "SEPTEMBER 1919",
            title: "The Volga: An Empty Rendezvous",
            historicalRecord: false,
            situation:
              "The advance has reached the point where Denikin's letters imagined meeting Kolchak's forces. There is nothing there to meet — Kolchak's own army, on the other side of this same war, is already well past the Urals and still retreating. The overextended line has bought a junction with an army that was never actually going to arrive, and now has to decide how to get itself back before that overextension costs more than the gesture toward Omsk was ever worth.",
            choices: [
              {
                label: "Withdraw immediately, in whatever order can be managed, rather than hold ground that never had a purpose beyond the junction.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I did not argue against this thrust to watch us compound the error by holding the empty end of it a day longer than necessary. Pull back now, while the withdrawal is still a choice rather than something the Reds make for us.",
                },
                historical: false,
                setFlags: { volgaOverextensionChoice: "withdraw_immediate" },
                impact: { manpower: 2 },
                next: "volgaCossackDesertion19",
                outcome:
                  "The withdrawal begins at once. It is not clean — nothing about this thrust was ever going to end clean — but it happens before the overextended position becomes a trap rather than merely an expensive gesture.",
              },
              {
                label: "Hold the position briefly, on the theory that abandoning ground immediately after reaching it looks worse than a short, deliberate pause.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I understand the appeal of not looking like we panicked the moment we discovered the junction was empty. I do not think the appearance of composure is worth the actual exposure it costs to maintain it here, this far from anything resembling support.",
                },
                historical: false,
                setFlags: { volgaOverextensionChoice: "brief_hold" },
                impact: { manpower: -3, rail: -2 },
                next: "volgaCossackDesertion19",
                outcome:
                  "The brief hold costs exactly what holding an exposed, purposeless position costs. The eventual withdrawal happens anyway, from a worse position than an immediate one would have, for the sake of an appearance that doesn't actually survive contact with how thin this line already was.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of the Volga-axis consolidation.
        // Deliberately its own node rather than a re-route into
        // cossackDesertion19: that node's prose is written for the
        // Orel-axis retreat specifically ("the retreat from Orel has not
        // stopped at Kursk"), and Wrangel's concentrated cavalry on this
        // branch never went near Orel. Same desertion dynamic, different
        // cause and different command voice reaching it.
        case "volgaCossackDesertion19":
          return {
            date: "NOVEMBER 1919",
            title: "The Volga: Riding for Home",
            historicalRecord: false,
            situation:
              "Wrangel's cavalry never reached Orel and never retreated from it — but the general collapse of the AFSR's central front has left the Volga gains isolated regardless, and the same Cossack units that made the breakthrough possible are now within reach of their own Don and Kuban villages for the first time since the advance began. They are not waiting for orders to go home. Wrangel's own command is watching men who broke the Red center a season ago simply ride south without him." +
              (flags.volgaOverextensionChoice === "brief_hold"
                ? " The brief hold at the empty rendezvous is fresh in every trooper's memory: days spent standing on ground chosen for a junction with an army that was never coming. Men who have just been asked to hold nothing for the sake of appearances are not in a receptive frame of mind about what they are asked to hold next."
                : flags.volgaOverextensionChoice === "withdraw_immediate"
                ? " The withdrawal from the empty rendezvous was ordered the moment it was clear there was nothing there to meet. It cost less than holding would have, and it also confirmed for every Cossack in the column that this command will not spend them on gestures — which is a reputation worth something, though not obviously enough to keep a man from riding home."
                : ""),
            choices: [
              {
                label: "Order the Cossack Hosts held in the line under threat of court-martial for desertion.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "Wrangel's axis or the center, it makes no difference — an army that answers to its own province before its own command is not an army I can plan around. Hold them by discipline, wherever the breach opens.",
                },
                historical: false,
                setFlags: { volgaCossackDiscipline: "enforced" },
                impact: {},
                costsCapital: true,
                next: "wrangelsDismissal20",
                outcome:
                  "The order reaches Wrangel's staff the same way it reached the center's — as instruction from a headquarters that no longer controls the ground between itself and the men it's ordering. Whether it holds a single rider in place is a separate question from whether it was issued.",
              },
              {
                label: "Let Wrangel handle it his own way — release the Cossacks formally rather than contest a departure already underway.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I built this axis on their sabres. I am not going to answer their going home with a court-martial order from a command that was never out here with us. Release them, and let what's left of this army be the men who chose to stay.",
                },
                historical: false,
                setFlags: { volgaCossackDiscipline: "released" },
                impact: { manpower: -2 },
                next: "wrangelsDismissal20",
                outcome:
                  "Wrangel releases them himself, ahead of any order from the center — the same substance as the broad front's decision, reached independently, for reasons specific to an axis the rest of the AFSR's command was never present on.",
              },
            ],
          };


        case "rearSecurity19":
          return {
            date: "SEPTEMBER 1919",
            title: "Ukraine: The Insurgent Rear",
            bulletin: {
              headline: "VERSAILLES SETTLES EUROPE. RUSSIA IS NOT IN THE ROOM.",
              body: "The treaty signed at Versailles on 28 June formally ended the war Russia entered in 1914 and left in 1918. No Russian government of any description was represented — not this command, not Omsk, not Moscow. Article 116 voids the Brest-Litovsk treaty outright and obliges Germany to respect the independence of territories that were Russian on 1 August 1914. The borders of the empire this army is fighting to restore are being determined by a conference none of its claimants attended.",
              meanwhile: {
                siberia: "Kolchak\'s front is in general retreat toward the Urals after the failure of the spring offensive; the Allied recognition Omsk was promised in exchange for a commitment to the Constituent Assembly has not materialised in any binding form.",
                bolsheviks: "Moscow was excluded from Versailles entirely and treats its exclusion as confirmation of what the Comintern declared in March — that this order is one to be overturned, not joined.",
              },
            },
            historicalRecord: true,
            situation:
              "Makhno's Revolutionary Insurgent Army has broken out behind the front, striking rail depots and supply columns across the AFSR's rear areas in Ukraine. Every division pulled back to hunt insurgents is a division not advancing on Moscow. Every division left forward is a rail line left undefended." +
              (flags.kievApproach === "assert_exclusive"
                ? " Kiev itself is quiet for the moment — the ultimatum that cleared Petliura's army from the city three weeks ago left this command holding it outright, but also left Makhno's insurgents the one force in this rear area still willing to fight rather than negotiate."
                : flags.kievApproach === "provisional_accommodation"
                ? " Kiev's joint administration is still an open argument, and it is consuming staff time this rear-security crisis can't spare — a second irregular problem competing with Makhno's for attention neither has enough of."
                : flags.kievApproach === "preempt"
                ? " Kiev held without a fight, but the forced march that secured it left the divisions that made it there in no shape to also chase insurgents through this same rear area now."
                : ""),
            choices: [
              {
                label: "Divert two divisions to secure the rear. The advance can afford to slow.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "A line of supply that can be cut at will is not a line of supply. I would rather arrive at Moscow a month late with the army intact than arrive on schedule and starving.",
                },
                historical: false,
                setFlags: { rearSecured: true },
                gate: (m) => m.rail >= -5,
                disabledReason: "Rail capacity too degraded to redeploy two divisions rearward without stripping the front's own supply movement.",
                impact: { manpower: -2, materiel: 2, rail: 3 },
                next: "peregonovka19",
                outcome:
                  "The diversion buys the rail network breathing room, but it is two fewer divisions on the line that matters when the Red counteroffensive begins.",
              },
              {
                label: "Keep every division on the offensive. Accept the losses to rail and supply as the cost of momentum.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "Momentum is the one advantage we still hold over an enemy who outnumbers us on every front. Trade it for rear-area policing against irregulars and we have handed Trotsky the only thing he was missing.",
                },
                historical: true,
                setFlags: { rearSecured: false },
                impact: {},
                next: "orelCulmination19",
                outcome:
                  "The offensive continues at full strength. Behind it, insurgent raids on the Ekaterinoslav–Kharkov line go unanswered, and matériel bound for the front sits in depots the rail network can no longer reliably reach.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of diverting divisions to hunt
        // Makhno's insurgents. historicalRecord true: the attempted
        // encirclement near Peregonovka and its outcome are real, regardless
        // of exactly how command handles the moment the trap starts to leak.
        case "peregonovka19":
          return {
            date: "SEPTEMBER 1919",
            title: "Peregonovka: The Trap That Broke",
            historicalRecord: true,
            situation:
              "The diverted divisions have Makhno's exhausted Insurgent Army encircled near the village of Peregonovka after a four-hundred-mile pursuit — by every visible measure this should be a rout in the AFSR's favor. But reports overnight describe unusual movement inside the pocket, and the encircling line, thinned by the pursuit itself, has gaps nobody has had time to reinforce before dawn.",
            choices: [
              {
                label: "Press the attack at dawn as planned. The numerical advantage should close the pocket before Makhno can organize anything.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "We did not divert two divisions from the front to hesitate at the moment they finally have him cornered. Close the ring at first light.",
                },
                historical: true,
                setFlags: { peregonovkaChoice: "press" },
                impact: {},
                next: "orelCulmination19",
                outcome:
                  "The attack presses forward — directly into a counterattack Makhno has been organizing in the dark. The encircling line breaks. What follows is one of the more complete reversals either side manages in this whole campaign: an ammunition depot destroyed, rail lines behind the front severed, and the two divisions diverted to end this problem instead badly mauled by it.",
              },
              {
                label: "Pull the weakest sections of the line back overnight to consolidate, even if it lets part of Makhno's force slip out.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "A cornered force that senses weakness in the ring finds it. I would rather close this trap a little later with a line that actually holds than lose the encirclement entirely to a gap we saw and chose not to fix.",
                },
                historical: false,
                setFlags: { peregonovkaChoice: "consolidate" },
                impact: { manpower: 2 },
                next: "makhnosAftermath19",
                outcome:
                  "The consolidation happens overnight. Whether reinforcing the visible gaps holds against a commander whose whole reputation was built on finding the gaps nobody reinforced in time is a real point of uncertainty — the historical record shows what pressing the attack cost. It does not show whether caution would have cost less.",
                uncertain: (() => {
                  const heldWeight = modWeight(35, meterPct(meters.manpower));
                  return [
                    {
                      weight: heldWeight,
                      title: "The consolidated line holds",
                      setFlags: { peregonovkaOutcome: "held" },
                      impact: { manpower: 3, materiel: 2 },
                      outcome:
                        "The reinforced line absorbs the breakout attempt without collapsing outright. It costs the operation its decisive victory — Makhno's force fragments and scatters rather than being destroyed wholesale, but the depot and the rail line behind the front survive intact.",
                    },
                    {
                      weight: 100 - heldWeight,
                      title: "Makhno finds the gap anyway",
                      setFlags: { peregonovkaOutcome: "broke_through" },
                      impact: { manpower: -4, rail: -3 },
                      outcome:
                        "The consolidation isn't enough. Makhno's breakout finds a seam in the reinforced line regardless, and the result is close enough to the historical rout that the caution bought little beyond the illusion of having tried something different.",
                    },
                  ];
                })(),
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — genuinely different content depending on which
        // uncertain outcome the consolidation roll produced. historicalRecord
        // false throughout: downstream of an already-speculative response to
        // a real battle.
        case "makhnosAftermath19":
          if (flags.peregonovkaOutcome === "held") {
            return {
              date: "OCTOBER 1919",
              title: "Peregonovka: What the Depot Bought",
              historicalRecord: false,
              situation:
                "The depot and rail line survived intact — an incomplete success against a commander this front has learned to fear for good reason. Makhno's scattered forces haven't been destroyed, only dispersed, and reports are already coming in of small raiding parties re-forming along the same rail corridor the depot was built to protect. Whether to pursue the scattered remnants while they're weak, or accept the partial win and redirect the effort that pursuit would cost toward the front proper, is a real choice this unusual success has created.",
              choices: [
                {
                  label: "Pursue the scattered remnants. A commander this dangerous left even partially intact tends not to stay that way for long.",
                  advisor: {
                    name: "Wrangel",
                    quote:
                      "We have not actually beaten him. We have inconvenienced him, and a man with his record does not stay inconvenienced. I would rather spend the effort finishing this now than explain, in three months, why we let him reconstitute.",
                  },
                  historical: false,
                  setFlags: { makhnoPursuit: "pursued" },
                  impact: { manpower: -2, rail: 1 },
                  next: "orelCulmination19",
                  outcome:
                    "The pursuit goes out after the scattered remnants. It costs effort the front proper could have used — and it is, in its way, an acknowledgment that the depot's survival was never the same thing as Makhno's defeat.",
                },
                {
                  label: "Accept the partial win. Redirect the effort toward the front rather than chase scattered raiders.",
                  advisor: {
                    name: "Denikin",
                    quote:
                      "I did not commit divisions to this operation to spend more of them chasing raiders through country we do not fully control. The depot held. That is the result we can actually use, and I intend to use it where it matters most right now.",
                  },
                  historical: false,
                  setFlags: { makhnoPursuit: "not_pursued" },
                  impact: { manpower: 2, materiel: -1 },
                  next: "orelCulmination19",
                  outcome:
                    "The effort redirects to the front instead. Makhno's scattered forces are left to reconstitute on their own schedule — a deferred cost, traded for resources the actual crisis at Orel needs more urgently right now.",
                },
              ],
            };
          }
          return {
            date: "OCTOBER 1919",
            title: "Peregonovka: Counting What's Left",
            historicalRecord: false,
            situation:
              "The breakout found its gap regardless of the consolidation, and what follows is close enough to the historical rout that the difference barely registers on the ledger — the depot damaged, the rail line behind the front cut, the two divisions diverted to end this problem instead mauled by it. The question now isn't whether this was a defeat. It's whether the divisions that survived it are still capable of contributing to the front, or whether they need to be written off as combat-ineffective for the near term.",
            choices: [
              {
                label: "Commit what's left of the divisions to the front regardless of their condition. There isn't time to wait for them to recover.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I know exactly what condition they're in. Orel is not going to wait politely for them to recover from it, and I will not let a defeat we already paid for cost us the divisions on top of the depot.",
                },
                historical: false,
                setFlags: { makhnoAftermathChoice: "commit_regardless" },
                impact: { manpower: -2 },
                next: "orelCulmination19",
                outcome:
                  "The divisions go to the front under strength, still absorbing what Peregonovka cost them. It is not the reinforcement the front needed — it is what's actually available, sent anyway, because the alternative was sending nothing.",
              },
              {
                label: "Write them off as combat-ineffective for now. Rebuild before committing them rather than compound the loss.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "Sending divisions this mauled into the next fight does not make them useful sooner. It makes the next defeat theirs as well, on top of this one. I would rather have fewer effective divisions at Orel than the same number in name only.",
                },
                historical: false,
                setFlags: { makhnoAftermathChoice: "rebuild_first" },
                impact: { manpower: 1, materiel: -1 },
                next: "orelCulmination19",
                outcome:
                  "The divisions are held back to rebuild rather than committed under strength. The front proceeds to Orel without them — one more piece of the campaign's overall strength that Peregonovka's actual cost, not just its narrated outcome, has quietly removed from the board.",
              },
            ],
          };

        // -------------------------------------------------------------------
        case "orelCulmination19":
          return {
            date: "OCTOBER 1919",
            title: "Orel: The Culmination",
            bulletin: {
              headline: "THE REPUBLIC'S WORST MONTH",
              body: "By most later accounts, this month is the closest the Soviet government comes to losing the war outright — not on one front but three, in the same few weeks, by circumstance rather than by any coordination between the White commands.",
              meanwhile: {
                siberia: "Kolchak's spring offensive, which briefly reached the Volga in the west, has been reversed entirely. His armies are falling back toward Omsk with no defensive line holding, in a retreat that will not really stop until Chita, a year and two thousand miles later.",
                bolsheviks: "General Yudenich's separate White army has reached the outskirts of Petrograd itself — close enough that the city's fall was treated inside the Council of People's Commissars as a genuine possibility, not a remote one. Trotsky personally organizes the city's defense.",
              },
            },
            historicalRecord: true,
            context:
              "Orel is 250 miles from Moscow. The AFSR has advanced roughly 400 miles in four months on an offensive that began at Tsaritsyn in June, and its line now runs some 700 miles from Kiev to Tsaritsyn, held by fewer than 100,000 combat effectives. The Red Southern Front opposing it has been reorganized under Alexander Yegorov, with Stalin as its senior political member, and is concentrating a strike group south of Orel — Latvian riflemen, a Estonian brigade, and Primakov's cavalry — specifically to cut the salient at its base rather than meet it head-on.",
            situation:
              "Orel has fallen — two hundred miles from Moscow, the deepest the Volunteer Army will ever reach. The Red Southern Front has been reorganized under new command and is throwing everything it has into a counteroffensive. Kuban Cossack officers are asking, openly now, whether they are fighting for Moscow or for Denikin's Moscow." +
              (flags.directiveIssued === "broad"
                ? " Orel was reached on three axes at once, which is why it was reached at all and why there is nothing concentrated anywhere to hold it with."
                : "") +
              (flags.peregonovkaChoice === "press"
                ? " The divisions that pressed the attack at Peregonovka arrived here already spent, and are the ones now being asked to hold the furthest point of the advance."
                : flags.peregonovkaChoice === "consolidate"
                ? " Consolidating at Peregonovka kept these divisions in better condition than they would otherwise be. It also let a portion of Makhno's force out of the pocket, and the rear behind Orel has been feeling it since."
                : "") +
              (flags.makhnoAftermathChoice === "commit_regardless"
                ? " The divisions mauled at Peregonovka were sent forward without rebuilding, and they are here, under strength, counted in the order of battle at full value."
                : flags.makhnoAftermathChoice === "rebuild_first"
                ? " The divisions mauled at Peregonovka were written off as combat-ineffective and held back to rebuild. They are not here, and the formations that are have absorbed their share of the front accordingly."
                : ""),
            choices: [
              {
                label: "Order the Kornilov Division to hold Orel at all costs. No withdrawal.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "We did not come two hundred miles to give it back without a fight. Hold Orel and the whole character of this war changes.",
                },
                historical: true,
                setFlags: { orelHeld: "attempted" },
                impact: {},
                aftermath:
                  "Orel was retaken by the Red Army on 20 October 1919, eight days after it fell. The Kornilov Division — one of the AFSR's four named 'coloured' regiments and among its most reliable formations — was badly cut up holding it. Neither the Volunteer Army nor any other White force came closer to Moscow at any point in the war. The line from Orel to the Black Sea did not stabilise again.",
                costsCapital: true,
                next: "cossackDesertion19",
                outcome:
                  "The order to hold is given. What happens at Orel over the following two weeks is the actual hinge of the whole campaign — written next.",
              },
              {
                label: "Order a fighting withdrawal to the Kursk–Kharkov line instead. Preserve the army over the ground.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "Ground we can retake. An army we cannot. Hold Orel with exhausted troops against a rested counteroffensive and you will lose both the city and the men in it.",
                },
                historical: false,
                setFlags: { orelHeld: "withdrawn" },
                impact: { manpower: 1, rail: 1 },
                aftermath:
                  "No fighting withdrawal from Orel was ordered historically; the city was held and lost. What the record does show is what happened to the AFSR's retreats once they began without prepared positions behind them — the withdrawal from Kharkov in December and the retreat to Novorossiysk in March both degraded from ordered movement into something closer to rout within weeks. A withdrawal ordered early is betting that this one would behave differently.",
                next: "kharkovLine19",
                outcome:
                  "The withdrawal order goes out over Denikin's private reservations. Whether an orderly fighting withdrawal is something exhausted, badly-coordinated Cossack and Volunteer units can actually execute under counteroffensive pressure — as opposed to sliding into the kind of rout that historically overtook the retreat months later at Novorossiysk — is disputed among historians of the campaign; the roll stands in for their disagreement.",
                // Round 23: was two independent modWeight(X, 50) literals
                // that only summed to 100 by coincidence of both hardcoding
                // the same neutral meterValue. Rewritten to the shared-
                // variable/complement pattern used everywhere else in this
                // file, so the two outcomes stay complementary once the
                // meterValue argument is actually live.
                uncertain: (() => {
                  const holdsWeight = modWeight(55, meterPct(meters.manpower));
                  return [
                    {
                      weight: holdsWeight,
                      title: "The withdrawal holds together",
                      setFlags: { withdrawalOutcome: "orderly" },
                      impact: { manpower: 2, rail: 1 },
                      outcome:
                        "The line falls back to Kursk in reasonable order. It costs ground, not the army — a rare piece of good news amid a campaign running out of it.",
                    },
                    {
                      weight: 100 - holdsWeight,
                      title: "The withdrawal frays",
                      setFlags: { withdrawalOutcome: "disorderly" },
                      impact: { manpower: -3, materiel: -1 },
                      outcome:
                        "Coordination between the Volunteer divisions and the Cossack rearguard breaks down within days. What was meant to be an orderly fallback becomes, in places, indistinguishable from the retreat Wrangel was trying to avoid.",
                    },
                  ];
                })(),
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of withdrawing from Orel rather than
        // holding it. historicalRecord false throughout: this is what the
        // preserved-but-battered army does next, not a real recorded event.
        case "kharkovLine19":
          return {
            date: "DECEMBER 1919",
            title: "Kharkov: A Line That Might Hold",
            historicalRecord: false,
            situation:
              "The army that survived the withdrawal from Orel is bruised but intact, falling back toward Kharkov and Kursk with its cavalry still largely together. Whether that's enough to stop the Red advance here, rather than simply postpone it, is unclear — the rear-area insurgency and the Cossacks' own war-weariness were never contingent on what happened at Orel specifically, and neither has gone away." +
              (flags.rearSecured === true
                ? " The two divisions diverted to the rear earlier in the autumn are the reason the Ekaterinoslav–Kharkov line is still carrying matériel at all. They are also two divisions not in front of Budyonny now."
                : flags.rearSecured === false
                ? " Nothing was ever diverted to secure the rear, and the supply line behind this position has been cut and repaired often enough that its capacity is now a guess rather than a figure."
                : ""),
            choices: [
              {
                label: "Commit the preserved cavalry to a real defensive stand at the Kharkov-Kursk line.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "We preserved this army specifically so it would still be capable of a fight when it mattered. If Kharkov is not where it matters, I do not know what would qualify — but I will not pretend the rear-area problems that were never about Orel have solved themselves in the meantime.",
                },
                historical: false,
                setFlags: { kharkovLine: "stand" },
                impact: { manpower: -3, rail: 2 },
                next: "kharkovEncirclement19",
                gate: (m) => m.manpower >= -3 && m.materiel >= -5,
                disabledReason: "A set-piece defensive stand needs both an army capable of standing and the shells to hold with — this command is short of one or both.",
                outcome:
                  "The stand is made. It buys real time — weeks the historical retreat didn't have — before the broader collapse catches up with the line anyway.",
              },
              {
                label: "Continue the withdrawal further south rather than commit to another costly stand.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I have watched this army spend itself on lines that were never going to hold indefinitely. Preserving the army a second time, rather than spending it again on a position I am not convinced we can actually keep, is not cowardice. It may be the only strategy left that hasn't already failed once.",
                },
                historical: false,
                setFlags: { kharkovLine: "withdraw" },
                impact: { manpower: 3, materiel: 1 },
                next: "wrangelsDismissal20",
                outcome:
                  "The withdrawal continues without a stand at Kharkov. More of the army reaches the eventual Crimean evacuation intact — at the cost of every mile of Ukraine given up without a fight, and everything that implies about the campaign's remaining credibility.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of standing at Kharkov. historical-
        // Record true: this is where the speculative "preserved army" thread
        // rejoins the real December 1919 Kharkov operation — real numbers
        // (roughly 47,000 White infantry and 23,000 cavalry against 58,000
        // Red infantry and 13,000 cavalry, per Soviet Southern Front
        // records), real commanders, and the real, documented dynamic: it
        // was specifically the threat of encirclement, not simple weight of
        // numbers, that broke the historical defense and turned an orderly
        // withdrawal into a disorderly one.
        case "kharkovEncirclement19":
          return {
            date: "DECEMBER 1919",
            title: "Kharkov: The Threat of the Ring",
            historicalRecord: true,
            situation:
              "The line is holding against direct pressure — but Budyonny's cavalry and the 14th Army under Uborevich are maneuvering around both flanks, exactly the encirclement that broke the historical defense here regardless of how hard the center held. The choice isn't whether the line can take another day of frontal pressure. It's whether to commit the preserved cavalry to breaking the flanking threat before the ring closes, or accept the historical logic and withdraw while the door is still open." +
              (flags.withdrawalOutcome === "orderly"
                ? " The withdrawal from Orel held together, which is the only reason there is a coherent line here to be flanked rather than a rout already in progress."
                : flags.withdrawalOutcome === "disorderly"
                ? " The withdrawal from Orel came apart on the way here. The line holding against frontal pressure is doing so with units that arrived out of order and have not been fully sorted since."
                : ""),
            choices: [
              {
                label: "Commit the cavalry to strike Budyonny's flanking force directly, betting on breaking the encirclement before it closes.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "A ring that never closes is not a ring. If we can break the force forming it before the flanks meet, we have not merely held Kharkov — we have taken the initiative away from the one commander on that side who has consistently had it. I do not think the odds are good. I think they are worth taking.",
                },
                historical: false,
                setFlags: { kharkovEncirclementChoice: "counterattack" },
                // The counterattack is survivable with a functioning rear.
                // Without one it is where the campaign ends.
                // Thresholds set from measured distributions at this node:
                // manpower reaches -6 at the low end, materiel similarly. Rail is
                // NEVER negative here (measured min +2), so gating on rail made
                // this ending literally unreachable.
                // Single axis, deliberately. A compound AND across two axes made
                // this unreachable in 6000 simulated runs: the gate above already
                // requires manpower >= -4 to select, and southRussia materiel only
                // moves 9 times in the whole campaign, so it rarely reaches -3.
                // This choice costs 4 manpower, so post-choice <= -6 is reachable
                // from any pre-choice value of -2 or worse.
                nextIf: (m) => (m.manpower <= -6 ? "endingTheLineThatBroke19" : null),
                impact: { manpower: -4 },
                next: "afterTheCavalryStrike19",
                gate: (m) => m.manpower >= -4,
                disabledReason: "committing cavalry to a deliberate strike requires a force that can still absorb the loss of one — this command's manpower is already too depleted to risk it.",
                outcome:
                  "The counterattack goes in against Budyonny's own cavalry — arguably the single most dangerous force on the entire Southern Front to have picked this fight with. Whether striking first breaks the encirclement, or simply spends the preserved cavalry against the one Red formation built and commanded specifically to win exactly this engagement, the record does not settle. The dice carry it.",
                uncertain: (() => {
                  const breaksWeight = modWeight(25, meterPct(meters.manpower));
                  return [
                    {
                      weight: breaksWeight,
                      title: "The flanking force is genuinely disrupted",
                      setFlags: { kharkovEncirclementOutcome: "disrupted" },
                      impact: { manpower: 2, rail: 3 },
                      outcome:
                        "Against real odds, the strike catches Budyonny's formation still maneuvering into position and buys a measurable delay. Kharkov doesn't hold indefinitely — nothing was ever going to make it hold indefinitely — but the withdrawal that eventually follows happens on this army's own schedule, not one forced by a closing ring.",
                    },
                    {
                      weight: 100 - breaksWeight,
                      title: "Budyonny's cavalry does exactly what it is built to do",
                      setFlags: { kharkovEncirclementOutcome: "routed" },
                      impact: { manpower: -3, rail: -2 },
                      outcome:
                        "The counterattack meets a cavalry force that has broken every White formation it has faced this autumn, and does so again. What follows is close to the historical record's own description of what happens after Kharkov falls: an orderly retreat becoming a disorderly one, with less of the army intact to make it than the historical timeline had.",
                    },
                  ];
                })(),
              },
              {
                label: "Withdraw now, while the flanks haven't closed, rather than gamble the preserved cavalry on breaking them.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I have already said what I think of spending this army further on ground I am not convinced we can keep. I think that argument applies with more force, not less, when the enemy doing the threatening is the one cavalry commander on that front who has not yet been wrong about what he can actually accomplish.",
                },
                historical: true,
                setFlags: { kharkovEncirclementChoice: "withdraw_early" },
                impact: {},
                next: "wrangelsDismissal20",
                outcome:
                  "The withdrawal begins before the ring closes — matching, in substance, what the historical record shows actually happened: the threat of encirclement, not a battle lost outright, is what ends the defense of Kharkov. The city falls on schedule, in mid-December. The army that pulls back from it is bruised rather than shattered, which is the whole reason this branch preserved it in the first place.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of the cavalry strike against
        // Budyonny, genuinely different content depending on which uncertain
        // outcome the roll produced. historicalRecord false throughout: this
        // whole thread is counterfactual from kharkovLine19 onward, but the
        // choice here is shaped by real, earned consequences of the roll
        // rather than converging on identical content regardless of outcome.
        case "afterTheCavalryStrike19":
          if (flags.kharkovEncirclementOutcome === "disrupted") {
            return {
              date: "DECEMBER 1919",
              title: "Kharkov: A Withdrawal on Its Own Schedule",
              historicalRecord: false,
              situation:
                "The disrupted flanking force has bought something rare in this whole campaign: a withdrawal happening on this army's own timeline rather than one forced by a closing ring. The cavalry that won that delay is spent and needs weeks it may not get before it's fit for another engagement. Whether to give it those weeks, at the cost of momentum in the wider retreat, or fold it back into the line under strength, is a real choice this unusual breathing room has actually created.",
              choices: [
                {
                  label: "Give the cavalry the recovery time. A force this depleted committed too soon is a force wasted twice.",
                  advisor: {
                    name: "Wrangel",
                    quote:
                      "We spent this cavalry to buy exactly this kind of choice — the ability to decide our own pace instead of having Budyonny decide it for us. I would rather use the time we bought than spend it proving we didn't actually need it.",
                  },
                  historical: false,
                  setFlags: { cavalryRecovery: "granted" },
                  impact: { manpower: 2 },
                  next: "wrangelsDismissal20",
                  outcome:
                    "The recovery time is given. The wider retreat moves without its strongest cavalry component for several weeks — a cost paid deliberately, for a formation that reaches Novorossiysk in better condition than it would have otherwise.",
                },
                {
                  label: "Fold it back into the line under strength. The wider retreat can't afford to wait on any single formation's recovery.",
                  advisor: {
                    name: "Denikin",
                    quote:
                      "I understand what that cavalry bought us. I am not convinced the rest of this retreat can afford to pay it back in weeks we may not actually have before the next crisis this war hands us.",
                  },
                  historical: false,
                  setFlags: { cavalryRecovery: "denied" },
                  impact: { manpower: -1, rail: 1 },
                  next: "wrangelsDismissal20",
                  outcome:
                    "The cavalry returns to the line under strength, its rare breathing room spent almost as soon as it was won. The wider retreat moves faster for it — at the cost of a formation that never quite recovers what the strike against Budyonny cost it.",
                },
              ],
            };
          }
          return {
            date: "DECEMBER 1919",
            title: "Kharkov: What the Cavalry Cost",
            historicalRecord: false,
            situation:
              "Budyonny's cavalry did what it was built to do, and what's left of the formation that struck at it is not fit to fight again soon. The retreat toward Novorossiysk now has a real gap where a cavalry screen should be — the same kind of exposure Peregonovka and Chelyabinsk have already shown what happens when reconnaissance and flank cover simply aren't there. Whether to slow the whole retreat to compensate, or accept the exposure and press on at the pace the broader collapse already demands, is the actual choice left by a gamble that didn't pay off.",
            choices: [
              {
                label: "Slow the retreat to compensate for the missing cavalry screen, even though time is exactly what this army doesn't have.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "Slowing down against an enemy who has no intention of slowing down is one kind of expensive. Marching past a cavalry force we have just proven we cannot outfight, blind, with no screen, is a different and worse kind. I know which one I am choosing.",
                },
                historical: false,
                setFlags: { cavalryLossResponse: "slow_down" },
                impact: { manpower: -1 },
                next: "wrangelsDismissal20",
                outcome:
                  "The retreat slows to compensate for the gap. It is a partial hedge against the exposure — and it spends time this army was already running out of before this gamble cost it a cavalry screen on top of everything else.",
              },
              {
                label: "Press on at the pace the collapse already demands. There isn't a version of this retreat that has time to spare regardless.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I will not pretend the exposure is acceptable. I will say that a retreat which slows itself down every time something goes wrong was never going to reach the coast in any condition worth calling an army, and something has been going wrong in this war for months.",
                },
                historical: false,
                setFlags: { cavalryLossResponse: "press_on" },
                impact: { manpower: -2, rail: -1 },
                next: "wrangelsDismissal20",
                outcome:
                  "The retreat presses on without compensating for the gap. The exposure the missing cavalry screen created doesn't produce a specific new disaster before reaching Novorossiysk — but it's one more accumulated cost on an army that has been absorbing them since well before Kharkov, on top of whatever this specific gamble already took from it.",
              },
            ],
          };

        // -------------------------------------------------------------------
        case "cossackDesertion19":
          return {
            date: "NOVEMBER 1919",
            title: "The Don: Going Home",
            historicalRecord: true,
            situation:
              "The retreat from Orel has not stopped at Kursk. As it passes back through Don and Kuban territory, whole Cossack units are simply leaving the line — not mutinying, not surrendering, just riding home to defend their own farms and villages now that the front has come to them. The Volunteer Army divisions still in the line are asking why they should hold ground the Cossacks themselves have abandoned.",
            choices: [
              {
                label: "Order the Cossack Hosts held in the line under threat of court-martial for desertion.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "An army where each contingent fights only for its own province is not an army — it is an alliance of convenience, and alliances of convenience dissolve at the first serious pressure. I would rather hold them by discipline than lose the line by their absence.",
                },
                historical: true,
                setFlags: { cossackDiscipline: "enforced" },
                impact: {},
                costsCapital: true,
                next: "wrangelsDismissal20",
                outcome:
                  "The order is issued. Whether it stops a Cossack rider from turning his horse toward the Don when the front is his own front now is a separate question from whether the order was given.",
              },
              {
                label: "Formally release Cossack units to defend their home territories, folding it into the operational plan.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "They are leaving whether we authorize it or not. The only choice left to us is whether that departure happens as a coordinated withdrawal we can still direct, or as the kind of collapse that takes the men still willing to fight with it.",
                },
                historical: false,
                setFlags: { cossackDiscipline: "released" },
                impact: { manpower: -3 },
                next: "kubanCoup19",
                outcome:
                  "The release is formalized rather than fought. The line gets thinner by the same number of men either way — but the army that remains knows its command told them the truth about what was happening, rather than issuing an order everyone could see would not hold.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of formally releasing Cossack units
        // rather than disciplining them. The leniency emboldens exactly the
        // autonomy movement Denikin already distrusted.
        case "kubanCoup19":
          return {
            date: "NOVEMBER 1919",
            title: "Ekaterinodar: The Rada's Price",
            historicalRecord: true,
            situation:
              "The concession at the front has emboldened the Kuban Rada's separatist Black Sea faction to move faster than anyone expected — open talk of a separate peace, a delegation already treating with Ukraine's government as though the Rada were its own state. General Pokrovsky has surrounded the Rada's chambers with troops and demanded the surrender of the faction's leaders, Alexei Kalabukhov chief among them, on charges of treason. Wrangel is present and has made his approval of the move plain.",
            choices: [
              {
                label: "Let the coup proceed. Kalabukhov and the Black Sea faction's leaders are handed over for court-martial.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I said releasing them from the line rather than disciplining them would cost us something. It cost us exactly this — a Rada that believed leniency meant we had lost the authority to answer a coup with force. We have not.",
                },
                historical: true,
                setFlags: { kubanCoup: "proceeds" },
                impact: {},
                costsCapital: true,
                next: "kubanRadaReorganized19",
                outcome:
                  "Kalabukhov is hanged on November 7, a sign reading 'For treason to the Motherland and Cossackdom' left on his chest. The Rada is reorganized under Denikin loyalists. It does not restore the trust the earlier leniency was meant to buy — a considerable portion of the Kuban Cossacks still in the army's ranks do not forgive this either.",
              },
              {
                label: "Overrule Pokrovsky. Negotiate with the Rada's separatist faction rather than crush it by force.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I have spent this entire campaign arguing that a unified command cannot tolerate a private peace negotiated behind its back. Say it now, after already choosing leniency once, and it reads as inconsistency rather than principle. I am honestly not certain the reading is wrong.",
                },
                historical: false,
                setFlags: { kubanCoup: "negotiated" },
                impact: { manpower: 1 },
                next: "wrangelsDismissal20",
                outcome:
                  "The coup is called off. Whether genuine tolerance of Kuban autonomy, this late and this inconsistently applied, holds the coalition together better than Pokrovsky's crackdown did is a real question — the historical record shows what the crackdown cost. It does not show whether the alternative would have cost less — so that half is rolled.",
                uncertain: (() => {
                  const holdsWeight = modWeight(35, meterPct(meters.manpower));
                  return [
                    {
                      weight: holdsWeight,
                      title: "The coalition actually holds",
                      setFlags: { kubanNegotiationOutcome: "holds" },
                      impact: { manpower: 2 },
                      outcome:
                        "The Rada's separatist faction, taken seriously rather than crushed, actually stands down. It is a rare moment where restraint reads as strength rather than weakness — though how long it lasts, with the broader retreat still coming, is its own open question.",
                    },
                    {
                      weight: 100 - holdsWeight,
                      title: "The faction reads restraint as an opening, not a concession",
                      setFlags: { kubanNegotiationOutcome: "emboldened" },
                      impact: { manpower: -3 },
                      outcome:
                        "The negotiated tolerance doesn't hold. Emboldened rather than reassured, the separatist faction pushes further — exactly the outcome Denikin's own private reservations about inconsistency warned this choice risked.",
                    },
                  ];
                })(),
              },
              {
                label: "Go further than Pokrovsky asked to go. Dissolve the Rada outright and skip the court-martial — have them shot.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "You are describing exactly what Pokrovsky proposed to me directly, and exactly what your own commander-in-chief told him in person he would not permit. I am not going to pretend I heard that instruction if you are asking me to help you overrule it a second time.",
                },
                historical: false,
                setFlags: { kubanCoup: "dissolved_outright" },
                impact: { manpower: -2 },
                next: "wrangelsDismissal20",
                outcome:
                  "Denikin's own memoir records the version of this that actually happened: Pokrovsky asked for exactly this — a coup, dissolution, arrests, shootings without trial — and was told directly and personally that it would not be permitted. Here, it is permitted. There is no Rada left to reorganize, loyalist or otherwise, because there is no Rada left. What replaces it in the Kuban districts, for the rest of this war, is a military administration answering to nobody the Cossacks themselves elected, and the manpower cost of that is not a one-time figure — it compounds through every subsequent request this command makes of a people who no longer have a body to make requests through.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of the Kalabukhov hanging and Rada
        // reorganization. historicalRecord false: this is what the
        // reorganized body's actual reliability looks like in practice, not
        // a documented event — but grounded in the real, well-established
        // pattern that installed loyalist bodies of this kind frequently
        // proved compliant on paper while doing little to actually deliver
        // the Cossack manpower and cooperation the reorganization was meant
        // to secure.
        case "kubanRadaReorganized19":
          return {
            date: "DECEMBER 1919",
            title: "Ekaterinodar: A Rada That Says Yes",
            historicalRecord: false,
            situation:
              "The reorganized Rada, purged of its separatist faction and staffed with Denikin loyalists, votes exactly as asked at every session. Mobilization orders for the Kuban Host go out through it without formal objection. Whether that formal compliance is translating into Cossack units actually reporting for duty, rather than simply a body that says yes while its own constituency quietly doesn't, is a separate question command hasn't yet tested directly." +
              (flags.kubanCoup === "proceeds"
                ? " Kalabukhov was hanged in November with a placard on his chest. The men now voting yes attended that, and so did the constituency they answer to."
                : flags.kubanCoup === "negotiated"
                ? " The Rada was reorganized without a hanging, which leaves its loyalist majority holding its seats by arrangement rather than by fear. Whether that makes their compliance worth more or simply easier to withdraw is untested."
                : ""),
            choices: [
              {
                label: "Test it directly. Order the reorganized Rada to deliver a specific mobilization quota within the month.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "A Rada that votes correctly and a Host that actually reports for duty are not the same thing, and I would rather find out which one we have now than discover the gap once we're depending on it at the front.",
                },
                historical: false,
                setFlags: { kubanQuotaTest: "ordered" },
                impact: { manpower: -1 },
                next: "kubanQuotaAftermath19",
                outcome:
                  "The quota is set and the answer comes back within weeks: the reorganized Rada's compliance was real on paper and considerably thinner in the villages asked to supply the men. It isn't outright refusal — it's the kind of quiet shortfall that doesn't announce itself as defiance but adds up the same way.",
                uncertain: (() => {
                  const deliversWeight = modWeight(30, meterPct(meters.manpower));
                  return [
                    {
                      weight: deliversWeight,
                      title: "The quota is substantially met",
                      setFlags: { kubanQuotaOutcome: "met" },
                      impact: { manpower: 3 },
                      outcome:
                        "Against the more cynical expectation, the reorganized body's authority turns out to carry real weight in the villages after all — the mobilization quota comes in close to what was asked.",
                    },
                    {
                      weight: 100 - deliversWeight,
                      title: "The quota falls well short",
                      setFlags: { kubanQuotaOutcome: "shortfall" },
                      impact: { manpower: -4 },
                      outcome:
                        "The quota comes in at a fraction of what was ordered. The Rada's compliance, it turns out, extended exactly as far as the vote and no further — the villages it nominally speaks for were never actually asked, and don't especially feel bound by an answer given on their behalf.",
                    },
                  ];
                })(),
              },
              {
                label: "Don't test it. A demand that exposes the gap is worse than an untested assumption that the arrangement is working.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "Not asking the question is its own kind of answer, and I know it. I would still rather retreat with an untested arrangement than retreat having proven, formally and on the record, that the Kuban no longer actually supplies this army.",
                },
                historical: false,
                setFlags: { kubanQuotaTest: "avoided" },
                impact: {},
                next: "wrangelsDismissal20",
                outcome:
                  "No quota is set, no gap is formally exposed. Whatever the reorganized Rada's authority is worth in the villages remains untested — which means it also remains, for now, whatever anyone still needs to believe it is.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — genuinely different content depending on
        // whether the mobilization quota was actually met. historicalRecord
        // false throughout.
        case "kubanQuotaAftermath19":
          if (flags.kubanQuotaOutcome === "met") {
            return {
              date: "JANUARY 1920",
              title: "Ekaterinodar: A Body Worth Trusting, Maybe",
              historicalRecord: false,
              situation:
                "The quota came in close to what was asked — a surprise, and one that raises its own question. Does the reorganized Rada's demonstrated authority mean it's worth relying on for further requests as the retreat continues, or was this one quota an exception that a second, harder demand won't repeat?" +
                (flags.kubanQuotaTest === "ordered"
                  ? " The quota was ordered deliberately to find this out rather than assumed, which means the answer is now on the record where every other regional body can read it too."
                  : ""),
              choices: [
                {
                  label: "Press a second, larger request while the arrangement is proving itself. Test the ceiling, not just the floor.",
                  advisor: {
                    name: "Wrangel",
                    quote:
                      "One quota met tells us the arrangement can work. It does not tell us how far it stretches, and I would rather find that limit now, while we still have some choice in the timing, than discover it later when we don't.",
                  },
                  historical: false,
                  setFlags: { kubanSecondRequest: "pressed" },
                  impact: { manpower: 2 },
                  next: "wrangelsDismissal20",
                  outcome:
                    "The second request goes out, larger than the first. Whether the reorganized Rada's real authority extends this far is a question this decision has now forced into the open a second time, sooner than the arrangement had necessarily earned the right to be tested again.",
                },
                {
                  label: "Don't press further. One successful quota is a real result — spending it testing for a ceiling risks losing what was actually gained.",
                  advisor: {
                    name: "Denikin",
                    quote:
                      "I would rather bank one genuine success than risk it chasing a second that may simply prove the first was luck rather than a working arrangement. We can test the ceiling later, if there's a later left to test it in.",
                  },
                  historical: false,
                  setFlags: { kubanSecondRequest: "not_pressed" },
                  impact: { manpower: 2 },
                  next: "wrangelsDismissal20",
                  outcome:
                    "No second request follows. The one genuine success stands on its own, untested further — a modest gain banked rather than risked on a ceiling nobody can currently be certain is there.",
                },
              ],
            };
          }
          return {
            date: "JANUARY 1920",
            title: "Ekaterinodar: The Gap on the Record",
            historicalRecord: false,
            situation:
              "The shortfall is now formally documented — the reorganized Rada asked for men it could not deliver, and everyone from Ekaterinodar to the front knows it. Whether to discipline the Rada's leadership publicly for the failure, or quietly absorb the shortfall and avoid a second confrontation this army can't currently afford, is the real choice a documented failure has now created.",
            choices: [
              {
                label: "Discipline the Rada's leadership publicly. A quota this badly missed can't go unaddressed without teaching every other body watching that quotas are optional.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I understand the argument for quiet absorption. I do not think it survives contact with every other regional body currently deciding whether its own quotas are enforceable, based entirely on what happens to this one.",
                },
                historical: false,
                setFlags: { kubanShortfallResponse: "disciplined" },
                impact: { manpower: -1 },
                costsCapital: true,
                next: "wrangelsDismissal20",
                outcome:
                  "The discipline is public. It answers the question of whether quotas are enforceable — at a cost, measured in exactly the kind of Cossack resentment this whole reorganization was supposed to be moving past rather than compounding.",
              },
              {
                label: "Absorb the shortfall quietly. A second confrontation with the Kuban isn't one this retreat can currently afford.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "Letting this go unanswered teaches every other body watching exactly the wrong lesson. It teaches it anyway. A second open confrontation with the Kuban, on top of everything this retreat is already managing, is a point I do not currently have the army left to afford making.",
                },
                historical: false,
                setFlags: { kubanShortfallResponse: "absorbed" },
                impact: { manpower: 1, materiel: -1 },
                next: "wrangelsDismissal20",
                outcome:
                  "The shortfall is absorbed without public consequence. It costs nothing immediate — and it teaches every other body watching exactly the lesson Wrangel warned it would, quietly, without anyone having to say so directly.",
              },
            ],
          };

        // -------------------------------------------------------------------
        case "novorossiysk20":
          return {
            date: "MARCH 1920",
            title: "Novorossiysk: The Ships",
            historicalRecord: true,
            situation:
              "The retreat has run out of road. Over a hundred thousand troops, Cossacks, and civilian refugees are crowded into Novorossiysk with the Red Army days away, and the British have told you plainly that their ships can carry perhaps five or six thousand people at a time. Kutepov's evacuation commission has to decide, in practice, who those ships are for — there is no version of this that gets everyone out." +
              (flags.cossackDiscipline === "enforced"
                ? " The court-martial order issued against the departing Cossack Hosts is still nominally in force. It is being enforced by nobody, against men who are standing on the same docks asking for the same berths."
                : flags.cossackDiscipline === "released"
                ? " The Cossack Hosts were formally released to their own territories rather than held. A portion of them are here anyway, having found the front waiting for them at home, and they arrive with no particular claim on ships allocated to units that stayed."
                : "") +
              (flags.orelHeld === "attempted"
                ? " The Kornilov Division, ordered to hold Orel at all costs, is not among the formations queuing for embarkation at full strength."
                : "") +
              (flags.kubanCoup === "dissolved_outright"
                ? " There has been no Kuban Rada to answer to since November, and the military administration that replaced it has no standing to tell any Cossack unit that its claim on these ships is any better or worse than another's."
                : ""),
            choices: [
              {
                label: "Prioritize the Volunteer Army's combat units. Cossack formations, horses, and heavy equipment are left to fend for themselves.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I will not pretend to you that this is a decision I can defend on paper. It is the decision that gets the core of a fighting force to Crimea instead of losing all of it here. I do not expect it to be forgiven, by the men we leave or by history.",
                },
                historical: true,
                setFlags: { novorossiyskPolicy: "volunteer_priority" },
                impact: {},
                next: "sevastopolCouncil20",
                outcome:
                  "Roughly forty thousand make it onto the ships. Tens of thousands more — Kuban Cossacks prominent among them, along with soldiers separated from their units in the chaos and civilians who reached the docks too late — do not. Denikin's own later account of the scenes on the quayside does not soften what happened here, and this history will not soften it either.",
              },
              {
                label: "Hold a defensive perimeter longer to run more evacuation waves, accepting the risk of being overrun before the last ships leave.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "Every additional hour we hold this perimeter is an hour bought with men who are, by definition, not on a ship. I am not going to pretend that arithmetic troubles me less than it should. It is still the arithmetic. Once the Reds are within artillery range of the harbor, holding longer stops being generosity and starts being a second disaster stacked on the first.",
                },
                historical: false,
                setFlags: { novorossiyskPolicy: "extended_perimeter" },
                impact: { manpower: -4, materiel: -3 },
                next: "voroshilovsCavalry20",
                gate: (m) => m.manpower >= -3,
                disabledReason: "holding an extended perimeter requires troops to hold it — this army's manpower is already too depleted to spare a rearguard this size.",
                outcome:
                  "The perimeter holds a day and a half longer than it did historically. Whether that window gets meaningfully more people onto ships, or simply costs the rearguard that bought it without changing how many boats were ever going to be available, is not a question this decision resolves cleanly either way.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of holding the extended perimeter.
        // historicalRecord true: the cavalry breakthrough that actually took
        // the port on March 27 is real, commanded by the same Voroshilov
        // whose Tsaritsyn conduct this campaign's Bolshevik counterpart may
        // already have addressed — or left unaddressed — eighteen months
        // earlier.
        case "voroshilovsCavalry20":
          return {
            date: "MARCH 27, 1920",
            title: "The Mole: Whoever Holds It Last",
            historicalRecord: true,
            situation:
              "The extended perimeter has bought its day and a half — and now Voroshilov's cavalry is through the line, closing on the harbor itself while General Holman personally supervises the Don Cossacks' embarkation on the mole. Denikin has already ordered the Volunteer Army's remaining units rushed aboard first, leaving the far more numerous Don Cossacks to wait their turn on a dock that may not have a turn left to give them.",
            choices: [
              {
                label: "Hold the mole with whatever rearguard remains, buying the last possible minutes for the Don Cossacks still waiting to board.",
                advisor: {
                  name: "Holman",
                  quote:
                    "I have made promises on this dock I intend to keep as far as it is physically possible to keep them. If a rearguard can buy the time to get more of these men aboard, I will ask for exactly that, knowing what it costs the men who provide it.",
                },
                historical: true,
                setFlags: { moleChoice: "held" },
                impact: {},
                next: "moleRearguardFate20",
                outcome:
                  "The rearguard holds as long as it can. Cossacks arriving without their horses shoot them on the dock rather than leave them to the Reds — the docks fill with the sound and the sight of it, a detail contemporary accounts don't soften and this one won't either. Voroshilov's cavalry takes the port on the 27th regardless. What the rearguard bought was measured in boarding slots, not in the battle's outcome.",
              },
              {
                label: "Order the last ships to cast off now rather than wait for a rearguard that may not survive to matter.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "A ship that waits for a rearguard that breaks anyway saves no one. It only risks the men already aboard for the sake of a gesture. I have made harder calls than this one on less certainty, and I am not going to dress this one up as anything more complicated than it is: leave with what we have.",
                },
                historical: false,
                setFlags: { moleChoice: "departed" },
                impact: { manpower: 3 },
                next: "sevastopolCouncil20",
                outcome:
                  "The last ships cast off without waiting on the rearguard's outcome. Fewer of the Don Cossacks still on the mole make it aboard — the decision trades a chance at marginally more evacuees for the certainty of not losing the ones already loaded. Voroshilov's cavalry takes an emptier port than it otherwise would have, which was never really the point of the choice either way.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of holding the rearguard at the
        // mole. historicalRecord false: the specific choice about how to use
        // the rearguard's own remaining minutes is invented texture, not a
        // documented order — but it follows directly from the real,
        // established fact that the rearguard's holding action bought
        // boarding time rather than a battlefield outcome.
        case "moleRearguardFate20":
          return {
            date: "MARCH 27, 1920",
            title: "The Mole: The Rearguard's Own Minutes",
            historicalRecord: false,
            situation:
              "The rearguard has done what it was asked — bought minutes, not the battle. Voroshilov's cavalry is closing on its position now, not just the harbor behind it. Whether those last minutes belong to an orderly scramble for the rearguard's own boarding, or to holding discipline long enough to cover whichever Don Cossacks are still crossing the mole, is a decision that has to be made by the men holding the line, not by anyone still safely aboard a ship." +
              (flags.moleChoice === "held"
                ? " The ships were held rather than cast off, which is what bought these minutes and what makes the men on the mole worth something more than a gesture. It also means the ships are still within range of what is coming."
                : ""),
            choices: [
              {
                label: "Signal the rearguard to break for the boats now, while there may still be room.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "They have already done what was asked of them. I will not ask a rearguard for one more minute of discipline on the theory that it serves anyone but my own conscience about how this reads afterward. Signal them to break.",
                },
                historical: false,
                setFlags: { rearguardFate: "signaled_to_break" },
                impact: { manpower: 2 },
                next: "sevastopolCouncil20",
                outcome:
                  "The signal goes out. Some of the rearguard makes it aboard in the scramble that follows — not cleanly, not in order, but more of them than a straight sacrifice would have saved. What it costs is the last few Don Cossack stragglers who were counting on the rearguard's discipline holding a few minutes longer than it did.",
              },
              {
                label: "Hold discipline. The rearguard's job was to cover the crossing, and the crossing isn't finished yet.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "I have spent this entire evacuation deciding who gets a place on a ship and who doesn't. I am not going to spend the rearguard's own discipline on the theory that they have already earned the right to stop covering the men still behind them.",
                },
                historical: false,
                setFlags: { rearguardFate: "held_discipline" },
                impact: { manpower: -2 },
                next: "sevastopolCouncil20",
                outcome:
                  "Discipline holds. More of the crossing Don Cossacks make it to the boats for it — and fewer of the rearguard itself does. It is the arithmetic every rearguard action in this war has come down to eventually, stated plainly rather than left as an implication.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // ---------------------------------------------------------------------
        // The command crisis after Novorossiysk. Every existing ending in this
        // campaign happens at the 1920 evacuation and is a variant of the same
        // military outcome; this node opens the only other kind of ending the
        // record actually offers — being removed rather than defeated.
        // historicalRecord true: Denikin convened senior commanders at
        // Sevastopol on 4 April 1920 in the wake of Novorossiysk, the council
        // named Wrangel, and Denikin resigned and left for Constantinople the
        // same day aboard a British destroyer.
        // ---------------------------------------------------------------------
        // The decision Denikin actually faced weeks before the council he's
        // already forced into by novorossiysk20's own outcome. historicalRecord
        // true: Wrangel wrote and circulated a report blaming Denikin's own
        // strategy for the Moscow campaign's failure — he had called the
        // Moscow Directive a "death sentence" back in 1919 — and Denikin
        // dismissed him along with Lukomsky and Shatilov in early February.
        // Wrangel left for Constantinople on 8 February. He is recalled from
        // there, not simply reassigned in-theatre, which the existing
        // sevastopolCouncil20 context already states but this is the node
        // where that choice actually gets made rather than just reported.
        case "wrangelsDismissal20":
          return {
            date: "FEBRUARY 1920",
            title: "Sevastopol: The Baron's Letter",
            bulletin: {
              headline: "THE SAME MONTH, TWO THOUSAND MILES EAST",
              body: "This command must settle its own dispute with a critical general in the same weeks a far harsher verdict is being carried out, two thousand miles east, against the man who was on paper its own nominal senior. That seniority was never worth anything in practice, and is about to be worth nothing at all.",
              meanwhile: {
                siberia: "Admiral Kolchak — recognized by this command's own Commander-in-Chief as Supreme Ruler of Russia — was shot at Irkutsk on 7 February, handed over by the Czechoslovak Legion in exchange for its own safe passage. What remains of his government dissolves with him.",
                bolsheviks: "With Kolchak's execution and this front's own collapse now visible, Moscow's attention is beginning to turn toward the question that will define the rest of the year: how far west the Red Army's own ambitions should now reach.",
              },
            },
            historicalRecord: true,
            context:
              "Wrangel has done what serving officers are not supposed to do: written a report blaming this command's own strategy for the Moscow campaign's collapse, and let it circulate among enough senior officers that half the room already knows its contents by heart. He called the Moscow Directive a 'death sentence' when it was issued last year. He was right about the outcome, if not necessarily for the reasons he gave, and being right in writing, in front of an audience, is its own kind of insubordination regardless of the accuracy.",
            situation:
              "Novorossiysk has not happened yet, but everyone in this room can see the shape of what is coming. Wrangel's report is not wrong about the strategic picture. Whether that makes it more dangerous to leave unanswered or less deserves an actual answer, rather than an instinct, is the whole of what has to be decided here.",
            choices: [
              {
                label: "Dismiss him. A command that tolerates a general publishing his own case against it in front of the officer corps has already lost something no reassignment gets back.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I am not punishing him for being right. I am removing him because an army whose senior officers believe they may simply publish their disagreements and be heard over their own commander's head is an army that has already stopped being a single command in anything but name.",
                },
                historical: true,
                setFlags: { wrangelDismissal: "dismissed" },
                impact: { manpower: -1 },
                next: "novorossiysk20",
                aftermath:
                  "Wrangel is dismissed alongside Lukomsky and Shatilov, and sails for Constantinople on 8 February. He is not the only general this decision removes, and Novorossiysk — three weeks away — will make the removal of exactly this kind of criticism look considerably worse in hindsight than it looked in the room where it was decided.",
                outcome:
                  "The dismissal order goes out. Wrangel leaves for exile within days, a Commander-in-Chief this command still formally answers to, now watching the war he predicted from a hotel room on the Bosphorus.",
              },
              {
                label: "Keep him. Bring the criticism into the planning room instead of pushing the man who made it out of it.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I did not write that report to be dismissed for it. I wrote it because I believe the strategy is wrong and I am prepared to say so to your face rather than only in a document that circulates behind it. If you want a different answer from me, put me somewhere I can actually give one.",
                },
                historical: false,
                setFlags: { wrangelDismissal: "retained" },
                impact: { manpower: 1 },
                next: "novorossiysk20",
                outcome:
                  "Wrangel keeps his command. It does not resolve the underlying dispute — he still believes the strategy is wrong, and the strategy has not changed — but it keeps a capable, difficult general inside the tent rather than writing about it from outside one, for whatever that turns out to be worth once Novorossiysk actually arrives.",
              },
              {
                // Added round 22 — southRussia had only 1 of 27 nodes with a
                // third option, against siberia 2/19 and bolsheviks 5/21.
                // This is a plausible middle course on a real, well-documented
                // dispute (Wrangel's report and its content are real; a
                // reassignment-rather-than-exile response is an ordinary
                // administrative option this command had and didn't take —
                // not a claim about what it actually did), leading to its own
                // downstream fork per the FORK PRINCIPLE, not just a numbers
                // variant that reconverges immediately.
                label: "Reassign him to a subordinate field command instead. Remove him from the room where the report was read, not from the army.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "Dismissal answers the insubordination. It does not answer whether he was right, and I am not yet convinced those are the same question. Give him a corps to prove his case with, if he believes it that strongly, and let the results argue for him instead of a memorandum.",
                },
                historical: false,
                setFlags: { wrangelDismissal: "reassigned" },
                impact: { manpower: 1, materiel: -1 },
                next: "wrangelsReassignment20",
                outcome:
                  "Wrangel is neither dismissed nor kept where he was. He is handed a field command and told, in substance, to make his argument with results instead of memoranda — a middle course that answers the insubordination without discarding the general or the criticism outright.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // NEW round 22 — deep fork downstream of reassigning rather than
        // dismissing or retaining Wrangel at the February council.
        // historicalRecord false throughout: this specific command
        // arrangement is invented, a plausible administrative middle course
        // on a real dispute, not a documented historical event. Converges
        // back into novorossiysk20, same as the other two branches from
        // wrangelsDismissal20.
        case "wrangelsReassignment20":
          return {
            date: "FEBRUARY 1920",
            title: "Field Command: A Quieter Argument",
            historicalRecord: false,
            situation:
              "Wrangel has his corps. The question the reassignment didn't actually settle is what kind of corps to give a general whose whole public argument is that this command's strategy has been wrong — a real formation with the strength to prove his case, or a nominal one that keeps him occupied without giving the criticism anything to point to if it turns out he was right.",
            choices: [
              {
                label: "Give him a genuine formation, understrength but real, and let his handling of it answer the argument either way.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I did not write that report to be handed a name and no men behind it. Give me something real to command and I will either prove the criticism or prove myself wrong — either result is more useful to this army than a memorandum nobody has to test.",
                },
                historical: false,
                // Round 23: gated — this is a real (if thin) formation pulled
                // out of the line, which an army already bleeding manpower
                // cannot spare for an internal political experiment, however
                // useful the answer would be. Threshold matches this
                // campaign's usual manpower-gate cluster (-3 to -4).
                gate: (m) => m.manpower >= -4,
                disabledReason: "a real formation means real troops pulled out of the line — this command's manpower is already too depleted to spare them for an internal political test.",
                setFlags: { wrangelReassignmentScale: "real_command" },
                impact: { manpower: 2, rail: -1 },
                next: "novorossiysk20",
                outcome:
                  "The corps is real, if thin. Wrangel commands it the way he commanded the Caucasus Army — competently, and without ever stopping being the general whose criticism this whole arrangement was built to answer without fully accepting.",
              },
              {
                label: "Give him a nominal post instead — occupied, visibly still serving, without the strength to prove anything either way.",
                advisor: {
                  name: "Shatilov",
                  quote:
                    "A real command answers his criticism by testing it, which is a risk if he happens to be right. A nominal one answers it by never letting the test happen at all — quieter, and considerably less likely to hand him a victory to point to afterward.",
                },
                historical: false,
                setFlags: { wrangelReassignmentScale: "nominal_post" },
                impact: { manpower: -1 },
                next: "novorossiysk20",
                outcome:
                  "The post is real enough to satisfy the letter of the reassignment and thin enough to prove nothing. Wrangel serves, visibly, without ever getting the formation that would have let his argument be tested rather than merely repeated — which settles the immediate insubordination question at the cost of leaving the strategic one exactly where it was.",
              },
            ],
          };

        case "sevastopolCouncil20":
          return {
            date: "APRIL 1920",
            title: "Sevastopol: The Council of Commanders",
            bulletin: {
              headline: "TWO FRONTS CHANGE SHAPE AT ONCE",
              // Conditional on the February decision, which is settled by the
              // time this fires. The earlier version asserted the succession
              // was already resolved — it is the very thing this node decides.
              body:
                "The same week this command's own succession is put to a council, a new war two thousand miles to the west is being decided — and will do more to determine this army's remaining lifespan than anything said in this room." +
                (flags.wrangelDismissal === "dismissed"
                  ? " The general most of the room expects to be named was dismissed in February and has spent the interval in Constantinople."
                  : flags.wrangelDismissal === "retained"
                  ? " The general most of the room expects to be named never left, having been kept on in February over the objection of everyone who wanted him gone."
                  : flags.wrangelDismissal === "reassigned"
                  ? " The general most of the room expects to be named spent February and March commanding a field formation instead of a headquarters desk — neither exiled nor kept in the room where his report was read."
                  : ""),
              meanwhile: {
                siberia: "Admiral Kolchak was shot at Irkutsk two months ago. What remains of his Siberian armies is a leaderless retreat converging on Transbaikal, increasingly dependent on the same Ataman Semyonov most of its own officers despise.",
                bolsheviks: "Polish forces under Piłsudski are about to launch a major offensive into Ukraine, taking Kiev within the month. The war that results will occupy a substantial share of the Red Army's own reserves for the rest of this year — reserves that would otherwise be free to concentrate against the Crimea sooner.",
              },
            },
            historicalRecord: true,
            context:
              "Novorossiysk cost the AFSR its cohesion as much as its numbers: tens of thousands left on the quays, the Don and Kuban formations broken as organised bodies, and a command whose authority over the Cossack hosts had been the war's central political problem since 1918. What remains has reached the Crimea. The senior commanders have been summoned to Sevastopol." +
              (flags.wrangelDismissal === "dismissed"
                ? " Wrangel — dismissed from the army in February after months of open criticism of the Moscow Directive — is back in the peninsula, recalled from exile in Constantinople, and is the name every officer in the room already knows is the alternative."
                : flags.wrangelDismissal === "retained"
                ? " Wrangel never left. He is in the room as the general whose February report predicted exactly this outcome, still in command, and is the name every officer in the room already knows is the alternative — with the added weight of having been kept rather than recalled."
                : flags.wrangelDismissal === "reassigned"
                ? (flags.wrangelReassignmentScale === "real_command"
                    ? " Wrangel spent the interval commanding a real formation rather than sitting in exile or at this headquarters — and whatever the field results actually were, he arrives at this council as a general who was tested rather than merely retained or removed."
                    : " Wrangel spent the interval in a post real enough to satisfy the letter of his reassignment and thin enough to settle nothing — neither vindicated nor discredited, which leaves the room no clearer verdict on his February criticism than it had in February.")
                : ""),
            situation:
              "The council is not a mutiny and nobody in the room pretends otherwise. It is a room of men who have just watched an evacuation go the way Novorossiysk went, being asked, in effect, whether the command that presided over it should continue. Wrangel has not asked for the position and does not need to. The question is whether to put it to them and abide by the answer, or to remain and fight the Crimea's defence as the man who lost Novorossiysk — with everything that means for what any subsequent order is worth.",
            choices: [
              {
                label: "Put the succession to the council and abide by it. Resign if they name Wrangel.",
                advisor: {
                  name: "Denikin",
                  quote:
                    "I have commanded this army since Kornilov died in front of Ekaterinodar. I will not command it as a man they have agreed among themselves to tolerate. If they want Wrangel, they should say so to my face and I will go the same day.",
                },
                historical: true,
                setFlags: { sevastopolCouncil: "resigned" },
                impact: {},
                aftermath:
                  "Denikin put the succession to the council on 4 April 1920, accepted its answer, resigned the same day and sailed for Constantinople aboard a British destroyer. He never held command again and spent the rest of his life writing the war's history rather than fighting it — dying in Michigan in 1947, having refused German offers to front a Russian force against the Soviet Union. The war continued for another seven months under Wrangel.",
                next: "landLawDecision20",
                outcome:
                  "The council names Wrangel. The resignation follows within hours and the destroyer sails the same day. What is left of this command passes intact to a successor who has spent a year arguing it was being handled wrongly — and now has the Crimea, the summer, and the chance to prove it.",
              },
              {
                label: "Remain in command. Refuse to make the Crimea's defence hostage to a council of subordinates.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "Frunze will be at Perekop before the summer is out. I would rather answer to a commander the army has doubts about than spend the spring establishing which of us the army prefers while the isthmus goes unprepared.",
                },
                historical: false,
                setFlags: { sevastopolCouncil: "remained" },
                impact: { manpower: -1 },
                aftermath:
                  "No such refusal happened. What the record does show is what the succession actually bought: a reorganised army under a new name, the Krivoshein land law, the Northern Tauride offensive, and an evacuation in November that got nearly 146,000 people out of the Crimea in good order — the thing Novorossiysk had failed to do six weeks earlier. All of it required a commander the army had agreed to follow.",
                next: "endingTheCouncilAtSevastopol20",
                outcome:
                  "The refusal is stated plainly and changes nothing about the room it is stated in.",
              },
            ],
          };

        // ---------------------------------------------------------------------
        // ENDING — reached only by resigning at the Sevastopol council. This is
        // the campaign's one non-military ending: the command does not lose a
        // battle here, it loses the room.
        case "endingTheCouncilAtSevastopol20":
          return {
            isEnding: true,
            title: "The Council at Sevastopol",
            date: "APRIL 1920",
            badge: "◇ SPECULATIVE — DOWNSTREAM OF DIVERGENCE",
            classification: "speculative",
            epilogue:
              "There is no last stand to describe and no evacuation under fire. The command simply stops being obeyed.\n\nHistorically Denikin put the succession to the council, accepted its answer, resigned the same day and sailed for Constantinople aboard a British destroyer — and the war went on for another seven months under Wrangel, who reorganised the army, published Krivoshein's land law in May, took the Northern Tauride in June, and in November got nearly 146,000 people out of the Crimea in the good order Novorossiysk had failed to manage. All of that required a commander the army had agreed to follow, arrived at in a room in Sevastopol on 4 April 1920.\n\nRefusing that room does not prevent the succession; it only removes the part where it is done cleanly. Orders continue to be issued from this headquarters and continue to be read as the position of a man the senior commanders have already decided about. Wrangel is not in the peninsula to take over, because he left rather than sit as a standing alternative, and there is no orderly moment later at which he can be brought back. Perekop is prepared by a staff that does not know whose signature matters. What the historical AFSR salvaged in November was salvaged by a chain of command that had settled the question in April, and this one never does.\n\nDenikin lived until 1947 and wrote five volumes about this war, and refused in the Second World War to lend his name to a German-sponsored Russian force on the grounds that he had never fought for anything except Russia. That epitaph belongs to the man who went quietly. It is not obviously available to the one who didn't.",
          };

        case "landLawDecision20":
          return {
            date: "MAY 1920",
            title: "Sevastopol: The Land Law",
            bulletin: {
              headline: "LONDON WITHDRAWS. THE SUPPLIES STOP WITH IT.",
              body: "British support, which sustained this army through 1919 — the rifles, the shells, the uniforms, the tanks at Tsaritsyn — is being wound down. The British mission has advised plainly that continuing the war can have only one outcome and has pressed for negotiation with Moscow instead. The material that arrived through Novorossiysk for a year arrives no longer. Whatever this government does about the land question, it now does with what it already holds.",
              meanwhile: {
                siberia: "What remains of the eastern front has crossed into Manchuria or is converging on Chita under Japanese-backed protection; the Allied intervention there is winding down on the same logic.",
                bolsheviks: "Poland invaded Ukraine in April and took Kiev in May. The Red Army\'s counteroffensive is beginning — and every division committed to it is a division not yet turned toward the Crimea.",
              },
            },
            historicalRecord: true,
            situation:
              "Wrangel has replaced Denikin, and Krivoshein — his new Prime Minister, once the most liberal minister the Tsar ever had — is pushing a land law: peasants can purchase, through the state as intermediary, the land they already work. A White general in exile will later say plainly that if Denikin had published this exact law two years earlier, the outcome of the whole war might have been different. It is May 1920. There is no more time left to test that theory gently." +
              (flags.sevastopolCouncil === "resigned"
              ? " The law arrives over a signature the army agreed on at Sevastopol three weeks ago, which is the only reason a measure this radical can be issued at all without the Kuban reading it as a trick."
              : "") +
            (flags.novorossiyskPolicy === "volunteer_priority"
                ? " The Cossack formations left on the Novorossiysk mole six weeks ago are a matter of record in every stanitsa this law would need to reach. Krivoshein is aware of it and is proposing the law anyway."
                : flags.novorossiyskPolicy === "extended_perimeter"
                ? " Holding an extended perimeter at Novorossiysk got more people onto the ships and cost the rearguard that did the holding. The districts this law has to be administered through are being garrisoned by whoever came back."
                : ""),
            choices: [
              {
                label: "Adopt the Land Law as Krivoshein has drafted it: peasant purchase through state intermediation, landowners compensated.",
                advisor: {
                  name: "Krivoshein",
                  quote:
                    "This does not make us the party of the peasant. It makes us the government that stopped asking the peasant to fight for men who still owned the land under his feet — which may be the only thing left in this war we still have the standing to do something about.",
                },
                historical: true,
                setFlags: { landLawPolicy: "purchase_model" },
                impact: {},
                next: "northernTauride20",
                outcome:
                  "The Land Law is published. It is more than Denikin ever offered, and far too late to matter to most of the peasants it targets. Among the Volunteer Army's own officer corps — many of them landowners themselves — it does not go without resentment.",
              },
              {
                label: "Push further. Confiscate and redistribute immediately, without payment or state intermediation.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "A purchase requirement is what keeps this from being indistinguishable from what the Bolsheviks already hand out for free — I grant the argument. What I doubt is that we have the time left to preserve that distinction at the pace of a formal land registry. We are not negotiating on a schedule that rewards patience.",
                },
                historical: false,
                setFlags: { landLawPolicy: "immediate_confiscation" },
                impact: { manpower: 2 },
                costsCapital: true,
                next: "northernTauride20",
                outcome:
                  "The radical version is announced instead. It buys real peasant goodwill faster than the historical law ever did — and it costs the officer corps' own patience with Wrangel's government almost immediately, several resigning in protest within the month.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // Shared waypoint for both landLawDecision20 branches — the Northern
        // Tauride operation happened regardless of the exact reform's shape,
        // so this is where the peasant/Green dimension of the war finally
        // gets real weight, not just a Cossack- and officer-corps-focused
        // story. historicalRecord true: the operation, Ulagai's expedition,
        // and their failure are all real.
        case "northernTauride20":
          return {
            date: "JUNE 1920",
            title: "Tauride: Neither Bayonets Nor Deeds",
            historicalRecord: true,
            situation:
              "Wrangel's forces have broken out of the Crimean bottleneck into Tauride province — real ground, and the exact territory where the land law is supposed to prove itself faster than bayonets ever could. General Ulagai is proposing an expeditionary force across the Sea of Azov to the Kuban, to link with White partisan networks and widen the offensive before the Red Army can concentrate against it. The alternative is to hold what's been taken and let the reform actually be tested here first.",
            choices: [
              {
                label: "Commit Ulagai's force to the Kuban expedition. Widen the offensive while the initiative is real.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "We do not have the men to hold Tauride and wait patiently for a land law to change peasant opinion on its own schedule. If Ulagai can bring the Kuban's own partisan networks into this, the reform gets an army behind it instead of a pamphlet.",
                },
                historical: true,
                setFlags: { taurideChoice: "kuban_expedition" },
                gate: (m) => m.rail >= -3,
                disabledReason: "Mounting an amphibious expedition to the Kuban requires the rail and port capacity to stage it. Neither is available.",
                impact: {},
                next: "wrangelsEnvoy20",
                outcome:
                  "Ulagai's 4,500 men land in the Kuban. The expedition lasts three weeks before it's forced to withdraw — and in Tauride and Ukraine alike, the peasants the whole operation was supposed to win over simply don't rally to the White cause. Not out of active hostility in every case. Out of a settled distrust that one land law, arriving this late, was never going to undo.",
              },
              {
                label: "Hold the Tauride gains. Let the land law's actual effects on the ground be tested before overextending further.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "Momentum has its appeal, I won't deny it. A reform announced three weeks ago has not had time to change a single mind in the Kuban, and sending Ulagai chasing partisan networks there doesn't buy that reform more time to work — it spends men we need to hold what's already ours.",
                },
                historical: false,
                setFlags: { taurideChoice: "consolidate" },
                impact: { manpower: 2 },
                next: "wrangelsEnvoy20",
                outcome:
                  "The Kuban expedition never sails. Tauride is held a little more securely for it — and the land law's reception among the peasantry there is no warmer for the caution. The deeper problem was never really timing alone; it was three years of White governance the peasantry had already learned not to trust, and no single policy, however well defended, was going to undo that on its own.",
              },
            ],
          };

        // ---------------------------------------------------------------------
        // The other prong of "widening the offensive": not military
        // reinforcement but a political one. historicalRecord true for both
        // the letter and its reception — Wrangel really did send this,
        // Makhno really did execute the messenger. Fills a genuine gap: the
        // campaign previously jumped straight from June 1920 to October with
        // nothing between, and this is a real, precisely dated event sitting
        // exactly in that gap.
        case "wrangelsEnvoy20":
          return {
            date: "JULY 1920",
            title: "Vrem'evka: The Letter to Makhno",
            historicalRecord: true,
            context:
              "By April 1920 the British had told Wrangel plainly that continuing the war bought him no further support — General Percy's mission warned that prolonging the struggle 'can have only one result,' and pressed him toward negotiating with the Bolsheviks directly. Wrangel refused, at whatever cost, and instead widened his own search for allies: overtures to the Don and Kuban Cossacks, an offer of cooperation to Poland and Petliura's Ukraine, and now — on the strength of nothing more than the Soviet press's own repeated, and false, claims that Makhno was already secretly working with him — a letter to the one force in south Russia that has spent three years fighting everybody, Reds and Whites alike, with equal conviction." +
              (flags.taurideChoice === "kuban_expedition"
                ? " Ulagai's own landing in the Kuban was itself a search for exactly this kind of ally — this letter is a second front of the same logic, not a departure from it."
                : flags.taurideChoice === "consolidate"
                ? " Having chosen to consolidate rather than widen the offensive into the Kuban, this letter is the one place this command is still reaching for an ally beyond the ground it already holds."
                : ""),
            situation:
              "Shatilov and Konovalets have drafted a letter to 'the Ataman of the insurrectionary troops, Makhno,' proposing arms, ammunition, and specialists in exchange for coordinated action against the Bolsheviks — sealed at Melitopol on 18 June. Whether to actually send it is still, technically, an open question. Makhno has never given this command the smallest reason to expect anything but contempt in return.",
            choices: [
              {
                label: "Send it. If there is any chance Makhno answers, the offensive needs every ally it can find.",
                advisor: {
                  name: "Shatilov",
                  quote:
                    "I have drafted the letter myself, and I will tell you plainly I do not expect an answer worth having. I also do not think we can afford to have declined an opening we never actually tested, if this offensive runs out of men before it runs out of ground.",
                },
                historical: true,
                setFlags: { makhnoOutreach: "sent" },
                impact: {},
                next: "crimeaDefensePrep20",
                aftermath:
                  "The messenger, a twenty-eight-year-old named Ivan Mikhailov, delivers the letter to the Makhnovist staff at Vrem'evka on 9 July. Makhno's own recorded answer is immediate: 'Any delegate sent from Wrangel, or from anyone on the right, should be executed on the spot, and no answer will be given.' Mikhailov is shot within the hour. The Makhnovists publish both the letter and their reply in their own press specifically to put the record straight — Soviet newspapers had been claiming a secret Makhno-Wrangel alliance for weeks, and this is the answer to that claim as much as it is an answer to Wrangel.",
                outcome:
                  "The letter goes out under Shatilov and Konovalets's signatures. What comes back is not a reply.",
              },
              {
                label: "Don't send it. Whatever this buys against the Bolsheviks isn't worth the propaganda if it fails badly.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I have read what the Soviet papers are already saying about an alliance between us that has never existed. Sending this letter and having it answered with an execution does not disprove that story to anyone inclined to believe it — it simply gives them a fresher version of the same lie to print.",
                },
                historical: false,
                setFlags: { makhnoOutreach: "withheld" },
                impact: {},
                next: "crimeaDefensePrep20",
                outcome:
                  "The letter is drafted and never sent. Makhno never has occasion to answer an offer that never reaches him, and Trotsky's Southern Front never gets the specific, embarrassing proof — a hanged messenger, publicly announced — that the alliance the Soviet press has been inventing for weeks was fiction all along. The rumor persists a little longer for want of the one thing that would have killed it outright.",
              },
            ],
          };

        // -------------------------------------------------------------------
        case "crimeaDefensePrep20":
          return {
            date: "OCTOBER 1920",
            title: "Sevastopol: Preparing for the End",
            bulletin: {
              headline: "THE LAST TWO WHITE FRONTS, THE SAME MONTH",
              body: "This is the last month any organized White force still holds ground anywhere in Russia. Here and two thousand miles east, both fronts are converging on the same ending at almost the same time — the first and only occasion this war has synchronized that way.",
              meanwhile: {
                siberia: "The Far Eastern Republic — the Bolshevik-tolerated buffer state formed in April — has just moved its capital to Chita itself, as Japanese forces complete their withdrawal from Transbaikal. What remains of the White retreat there is converging on the same city.",
                bolsheviks: "The Polish war has just concluded with an armistice; formal peace talks are underway at Riga. Frunze's Southern Front, no longer needing to share reserves with the Polish front, is free to turn its full attention to Perekop.",
              },
            },
            historicalRecord: true,
            situation:
              "Frunze's Southern Front is massing against Perekop and the Sivash crossings — the same offensive already being planned on the other side of this history. Every ship, every dock allocation, every logistics officer spent now on preparing a possible evacuation is a resource not spent reinforcing the isthmus defenses. Novorossiysk happened because no one prepared for it in advance. There is still time not to repeat that." +
              (flags.taurideChoice === "kuban_expedition"
                ? " Ulagai's expedition to the Kuban has already come back, and what it came back with is a shorter list of formations available to hold the isthmus than the one this decision was supposed to be choosing from."
                : flags.taurideChoice === "consolidate"
                ? " Holding the Tauride gains rather than widening the offensive means the formations are at least where they are needed. It has not bought enough of them to make the isthmus defensible and prepare an evacuation at the same time."
                : "") +
              (flags.makhnoOutreach === "sent"
                ? " The Soviet press has had a genuine hanged messenger to print since July instead of an invented alliance, and Frunze's own Southern Front headquarters have made full use of it — proof, in their telling, that this command reached for the one ally in south Russia disqualified by every principle it claims to be fighting for."
                : ""),
            choices: [
              {
                label: "Quietly begin organizing evacuation logistics now, in parallel with the defense, before the line actually breaks.",
                advisor: {
                  name: "Wrangel",
                  quote:
                    "I do not intend to explain to the men on that isthmus that I was drawing up passenger manifests while they held the line. I also do not intend to preside over a second Novorossiysk because I refused to plan for the version of this that has already happened once.",
                },
                historical: true,
                setFlags: { evacuationPrep: "advance" },
                impact: {},
                next: "finalReckoning20",
                outcome:
                  "The preparation happens quietly, alongside the defense rather than instead of it. It is the reason the eventual Crimean evacuation moves some 145,000 people off the peninsula in reasonable order — the one piece of this whole campaign that does not end in the kind of chaos Novorossiysk did.",
              },
              {
                label: "Commit every available resource to the defense itself. No evacuation planning until the line is actually broken.",
                advisor: {
                  name: "Kutepov",
                  quote:
                    "I understand the caution after Novorossiysk. I am telling you that every dock official and every requisitioned ship spent on a evacuation we may not need is a rifle, a shell, or a horse the isthmus does not get — and the isthmus is what decides whether we need the ships at all.",
                },
                historical: false,
                setFlags: { evacuationPrep: "none" },
                impact: { manpower: 2 },
                next: "finalReckoning20",
                outcome:
                  "Every spare resource goes to the defense instead. It marginally strengthens the line at Perekop — and if that line breaks anyway, as it does on the other side of this history, whatever evacuation follows will have to be improvised from nothing, the way Novorossiysk was.",
              },
            ],
          };

        // ---------------------------------------------------------------------
        // CHECKPOINT — not a real decision, a decision-gated routing node.
        // Gate was originally the accumulated manpower meter (<= -6). Changed
        // deliberately: raw meter arithmetic could be triggered by a string
        // of unrelated small losses that have nothing to do with the army
        // actually dissolving as an organized body, and it let the triangle
        // — meant to track logistics, not drive the plot — decide which of
        // three fundamentally different endings this run gets. The dissolved
        // ending is now earned specifically by the reckless-gamble chain at
        // Ekaterinodar: pressing Kornilov's doomed assault, and having that
        // gamble actually fail. Two real decisions in direct sequence, not
        // an arithmetic side-effect of the whole campaign.
        case "finalReckoning20":
          if (flags.ekaterinodarChoice === "press" && flags.secondDayOutcome === "collapsed") {
            return this.resolveNode("endingArmyDissolved20");
          }
          return this.resolveNode(flags.evacuationPrep === "advance" ? "endingBizerte" : "endingSecondNovorossiysk");

        // ---------------------------------------------------------------------
        // ENDING — reachable only via a specific decision chain: pressing
        // Kornilov's doomed assault at Ekaterinodar, and having it fail.
        // historicalRecord false: no organized evacuation attempt this small
        // in scale is documented; what's real is the underlying dynamic —
        // an army gutted by its own command's opening gamble, two and a
        // half years before the evacuation this ending replaces, never
        // fully recovers the manpower base the historical AFSR had.
        case "endingArmyDissolved20":
          return {
            isEnding: true,
            title: "The Army That Dissolved",
            date: "OCTOBER–NOVEMBER 1920",
            badge: "SPECULATIVE — PLAUSIBLE, NOT SETTLED",
            classification: "speculative",
            epilogue:
              "There is no evacuation to describe, orderly or otherwise, because by the time Frunze's offensive reaches Perekop there is no longer a coherent army left to evacuate. The damage traces back to a single decision two and a half years earlier: pressing Kornilov's assault on Ekaterinodar rather than calling it off the day he died, and watching that gamble fail outright. An army that started that many men short of its historical strength never closed the gap — every later choice, good or bad, was made by a smaller command than the one that actually fought this war. Units break contact independently rather than as a retreating force. Some reach the coast in scattered groups and find passage where they can. Most don't.\n\nThis is not the historical record — the real AFSR, battered as it was, remained a fighting force capable of Wrangel's genuinely organized evacuation all the way to the end. Kornilov's death broke the assault off immediately in that history; what's speculative here is a command that chose to honor his plan instead, and never stopped paying for it." +
              (flags.collapseChoice === "reorganize_first"
                ? "\n\nThe extra day taken to reorganize before withdrawing from Ekaterinodar bought a more orderly retreat out of a failed assault. It did not buy back the men the assault had already cost, and the arithmetic that ends here was fixed before that reorganization began."
                : flags.collapseChoice === "immediate_withdrawal"
                ? "\n\nThe immediate withdrawal from Ekaterinodar was the right call made too late to matter. It saved what could still be saved from a decision that had already spent what could not."
                : "") +
              (flags.volgaCossackDiscipline
                ? "\n\nThe Cossacks on the Volga axis went home regardless of whether they were ordered to stay or released to go. On this path it made no difference which: an army already this far below the strength it needed had nothing to hold them with except an order, and an order was never what was keeping them."
                : ""),
          };

        // ---------------------------------------------------------------------
        // ENDINGS
        // ---------------------------------------------------------------------
        case "endingBizerte":
          return {
            isEnding: true,
            title: "The Bizerte Fleet",
            date: "NOVEMBER 1920 – FEBRUARY 1921",
            badge: "HISTORICAL RECORD",
            classification: "historical",
            epilogue:
              "The evacuation Wrangel spent months quietly preparing empties Crimea in five days: some 145,000 soldiers, officials, and civilians aboard over a hundred ships, bound first for Constantinople. Judged against everything else this war has been, it is orderly — the one evacuation in this war that does not become a byword for chaos the way Novorossiysk did. The warships continue on to Bizerte in French Tunisia, interned there until 1924, when France recognizes the Soviet government and the fleet is sold for scrap where it sits at anchor.\n\nThe people are a separate problem than the ships. France finances refugee camps at Gallipoli and on Lemnos, roughly 24,000 in the first and over 10,000 in the second by that November — conditions in both are harsh, typhoid and starvation among them. The two camps produce two different outcomes. At Gallipoli, Kutepov imposes a brutal discipline that holds the First Army Corps together as a body, later mythologized among émigrés as the 'Gallipoli miracle.' On Lemnos, no such regime takes hold; morale collapses, and many of the Cossack units there accept repatriation to Soviet Russia rather than face indefinite exile. The same evacuation produces both a myth of resilience and a wave of men choosing to go back to the country that was, by every other measure, still hunting people like them.\n\nGetting the fleet out clean was never the same question as what happened to the people left on the dock. Behind the evacuation, in Crimea itself, a Red Terror follows under Béla Kun and Rosalia Zemlyachka — historians' estimates of the executions range from roughly 12,000 to well over 50,000, many of them soldiers who surrendered on the promise of an amnesty that was never honored."
              + (flags.landLawPolicy === "immediate_confiscation"
                  ? "\n\nAmong the émigré communities that form around these camps, the radical Land Law is remembered in a way the historical purchase-model version never was — not as vindication, since the war was lost either way, but as the one policy in this whole campaign that arrived without a landowner's asterisk attached to it. It does not change where anyone ended up. It changes, slightly, what the survivors tell themselves about whether the Whites ever actually meant it about the peasant."
                  : "\n\nThe Land Law, in whichever form it took, becomes one more entry in the long postwar argument among émigrés about what, if anything, could have been done differently. It settles nothing.")
              + " Wrangel learned Denikin's lesson about preparing for defeat. It did not extend to the people this evacuation could not carry, and it did not decide, for the ones it did, whether exile would harden them or break them." +
              (flags.rearguardFate === "held_discipline"
                ? "\n\nThe rearguard on the Novorossiysk mole held discipline to the end and covered the crossing rather than breaking for the boats. Almost none of them are in Bizerte. The men who are know it, and the fact sits in the fleet's own accounting of itself for as long as the fleet exists — the ships were filled, in part, by men who chose not to run for them."
                : flags.rearguardFate === "signaled_to_break"
                ? "\n\nThe rearguard was signaled to break for the boats while there was still time, and some of them made it. What that decision cost was the Don Cossacks still crossing behind them, and that arithmetic is not one the fleet's officers discuss in Bizerte. Everyone aboard understands the trade that was made on their behalf."
                : "") +
              (flags.kharkovEncirclementChoice === "counterattack"
                ? "\n\nThe cavalry spent against Budyonny at Kharkov is not in these ships either. It bought the withdrawal that made this evacuation reachable, and it did so by ceasing to exist as a formation. The Bizerte rolls list units that arrived at strength and units that arrived as names."
                : ""),
          };

        case "endingSecondNovorossiysk":
          return {
            isEnding: true,
            title: "Second Novorossiysk",
            date: "NOVEMBER 1920",
            badge: "SPECULATIVE — PLAUSIBLE, NOT SETTLED",
            classification: "speculative",
            epilogue:
              "Without an evacuation already in motion when the Perekop line finally breaks, the withdrawal to the docks happens the way Novorossiysk did nine months earlier — improvised, overcrowded, working from ships that were never actually requisitioned in advance. Fewer of the roughly 145,000 who historically made it out get a berth this time. More are left behind for the Red Terror under Béla Kun and Rosalia Zemlyachka that follows regardless of how the evacuation itself went — that atrocity was never contingent on this choice, only its scale plausibly was."
              + (flags.ekaterinodarChoice === "press"
                  ? "\n\nThis is a command that has been running a deficit since Ekaterinodar in April 1918 — pressing Kornilov's assault against a garrison twice its size cost it a deeper hole to climb out of than the historical retreat ever had, and two and a half years later, at the other end of the war, that deficit hasn't closed. It has compounded. The generals who evacuate Crimea unprepared this time are, in a real sense, the same command that never fully recovered from choosing to press an unwinnable second day outside a city that was never the war's actual turning point."
                  : "\n\nThis command withdrew from Ekaterinodar in good order in April 1918, at the very start, when Denikin first inherited a battle he didn't plan. That early discipline bought it nothing durable by November 1920 — the same unprepared scramble at the docks, the same reputation lost in a single uncoordinated week. Some costs in this war were never really about which choices you made. They were about how much time the war itself was willing to give any choice to matter.")
              + "\n\nWrangel's reputation as the general who learned Denikin's lesson does not survive contact with a defeat he chose not to finish preparing for in time. This is not the historical record. It is what a serious accounting of the war would call a plausible cost of the alternative — not a certainty, but not a stretch either." +
              (flags.cavalryLossResponse === "press_on"
                ? "\n\nThe retreat was pressed on at the pace the collapse demanded rather than slowed to compensate for the missing cavalry screen. More of the army reached the coast. Less of it arrived in any condition to be embarked in an order anyone had planned, which is a distinction that matters enormously on a quay and not at all on a map."
                : flags.cavalryLossResponse === "slow_down"
                ? "\n\nThe retreat was slowed to compensate for the missing cavalry screen, and the army that reached the coast was more coherent than the one that would have arrived at speed. It was also smaller, and it arrived later, into a harbor where the ships had already begun making their own decisions about who to wait for."
                : "") +
              (flags.kharkovLine === "stand"
                ? "\n\nThe stand at the Kharkov–Kursk line is the reason there was still a formed army to evacuate rather than a crowd. It is also the reason the evacuation happened here, improvised, instead of somewhere further south with time to prepare it."
                : ""),
          };

        // ---------------------------------------------------------------------
        // HARD MODE ENDING — triggers whenever Volunteer Army Cohesion
        // (cohesionStrain) reaches 100, at whatever node the player happens
        // to be on. Not tied to a single historical event — it's the
        // culmination of the real, repeated pattern this campaign's own
        // content already documents: the Kalabukhov hanging, disciplinary
        // crackdowns on Cossack units, centralizing overrides of Cossack
        // objections, accumulated past the point the coalition can absorb.
        case "endingCossackMutiny":
          return {
            isEnding: true,
            title: "The Mutiny",
            date: "DATE VARIES — TRIGGERED BY ACCUMULATED COHESION STRAIN",
            badge: "SPECULATIVE — HARD MODE COLLAPSE",
            classification: "speculative",
            epilogue:
              "It does not happen all at once, and it is not a single order anyone gives. It is the accumulated weight of every choice that answered a Cossack Host's objection with central authority instead of accommodation — the Kalabukhov hanging, the discipline enforced on units that wanted to go home, every moment the chain of command chose control over consent. Somewhere on the retreat, a Kuban or Don contingent that has simply had enough turns on the rearguard it was supposed to be protecting, or rides for home in numbers too large to discipline.\n\nThis is not what happened historically — the real AFSR held together, badly and at real cost, all the way to Crimea. It is what an accumulation of exactly this kind of choice makes plausible: a command that never lost a decisive battle to the Red Army, undone instead by an army that stopped trusting it. The war doesn't end here. This command's part in it does.\n\nWhat follows for the Cossacks themselves is not speculative. The Don and Kuban Hosts that rode home to defend their own stanitsas found the front arriving there anyway, and the Soviet policy of decossackization — the January 1919 directive and everything that followed from it — did not distinguish between Cossacks who had fought to the end and Cossacks who had gone home early. Those who reached the coast in time joined the emigration; those who did not were absorbed into a Soviet order that spent the next decade dismantling the Host system as a category. Leaving the line bought individual men time. It did not buy the thing they left to protect." +
              (flags.kubanShortfallResponse === "disciplined"
                ? "\n\nThe Kuban Rada's leadership was disciplined publicly for the quota it failed to deliver. Every stanitsa that heard about it filed the lesson away, and the men who eventually turned on the rearguard did not need to be told twice what this command did to Kuban bodies that disappointed it."
                : flags.kubanShortfallResponse === "absorbed"
                ? "\n\nThe Kuban quota shortfall was absorbed quietly rather than punished. It bought nothing in the end — a command that had already answered enough Cossack objections with force did not get credit for the one time it didn't."
                : "") +
              (flags.kubanNegotiationOutcome === "emboldened"
                ? "\n\nThe Rada's separatist faction, negotiated with rather than crushed, read the restraint as weakness and moved further. What breaks here was already breaking then; this is only where it finished."
                : ""),
          };

        default:
          return null;
      }
    },
  },

  // =========================================================================
  // SIBERIA — Kolchak, Provisional All-Russian Government
  // =========================================================================
