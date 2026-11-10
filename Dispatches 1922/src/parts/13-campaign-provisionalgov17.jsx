CAMPAIGNS.provisionalGov17 = {
  id: "provisionalGov17",
  label: "The Provisional Government",
  coalition: "provisional",
  shortTag: "PG",
  commander: "Alexander Kerensky, Minister of War",
  seat: "Mariinsky Palace, Petrograd",
  thesis:
    "Dual power, one palace: hold a coalition together against a war the front no longer wants to fight, a Soviet that can make any decree meaningless in the street, and a right that increasingly says the whole experiment should end. Not a campaign about winning the revolution — one about whether this government still exists by October.",
  start: "aprilCrisis17",
  hasFrontMap: false, // Petrograd, 1917 is one city and a handful of institutions, not a multi-front war -- the shared front-map/atlas-geography system this file uses for the other three campaigns doesn't fit here, and building a bespoke version of it is out of scope for this round. BriefingScreen checks this flag and hides "VIEW FRONT MAP" accordingly.

  initialMeters: {
    authority: 0,
    frontDiscipline: 0,
    sovietRelations: 0,
  },
  triangleAxes: [
    { key: "authority", label: "STATE AUTHORITY" },
    { key: "frontDiscipline", label: "FRONT DISCIPLINE" },
    { key: "sovietRelations", label: "SOVIET RELATIONS" },
  ],
  initialLegitimacy: 0,
  plannedEnding: {
    date: "NOVEMBER 1917",
    title: "The Winter Palace Falls",
    note:
      "The historical terminus, not a defeat this command can avert by playing well -- every choice in this campaign shapes how isolated the government is when the rising comes, not whether it comes. That's deliberate: a version of this campaign where good play prevents the Bolshevik seizure of power would contradict what every other campaign in this file already treats as settled fact.",
  },
  hardMode: {
    key: "decreeCapital",
    label: "Rule By Decree",
    capitalName: "BONAPARTIST MODE",
    capitalLabel: "DECREE CAPITAL",
    description:
      "No rewind, no meter dashboard -- only cabinet minutes. Five points of Decree Capital to spend ruling by ministerial emergency power instead of negotiating with the Soviet Executive Committee's own delegates. Spend all five and the government hasn't out-argued the Soviet, it has stopped pretending dual power was ever a partnership -- named for the word Kerensky's own allies on the moderate left used, from the first coalition onward, for exactly the outcome they hoped backing him would prevent.",
    buttonLabel: "OPEN CABINET",
    maxCap: 5,
    maxEndingId: "endingDecreeCabinet17",
  },

  NEWSPAPER_MASTHEAD: "VESTNIK VREMENNOGO PRAVITELSTVA",
  NEWSPAPER_SUBHEAD: "Herald of the Provisional Government -- as read at the Mariinsky Palace",

  ADVISOR_DOSSIERS: {
    kerensky: {
      role: "Minister of War, later Minister-Chairman",
      bio:
        "A lawyer and Duma deputy before 1917, the only man to hold high office simultaneously in the Provisional Government and, in its first months, as a deputy chairman of the Petrograd Soviet -- dual power's contradictions embodied in one person rather than argued between two institutions. Became Minister of War in the first coalition formed after this campaign's opening crisis, then Minister-Chairman from July after the second.",
      fate:
        "Fled Petrograd by car on 7 November to rally General Krasnov's Cossacks at the front; the counter-attack collapsed at Pulkovo within days, and he never returned to Russian soil in a position of power. Lived another fifty-three years in exile, mostly in France and the United States, and died in New York in 1970 -- long enough to see nearly the entire war this file's other campaigns describe fought and finished.",
      faction: "Provisional Government, Coalition Cabinet",
      rank: 0,
    },
    kornilov: {
      role: "Supreme Commander-in-Chief (from 31 July 1917)",
      bio:
        "An escaped Austrian prisoner of war with a real battlefield reputation, appointed Supreme Commander by Kerensky himself after the Kerensky Offensive's collapse, on Kornilov's own condition that the government back restoring the death penalty and formal discipline at the front. What exactly Kerensky authorized before Kornilov's own advance on Petrograd in early September is still disputed -- an intermediary, Vladimir Lvov, carried proposals between them that each man afterward described differently, and whether this was a deliberate coup from the start or a plan Kerensky first encouraged and then publicly recast as mutiny is a real historians' argument, not settled the way the coup's failure itself is.",
      fate:
        "Arrested and held with the other generals implicated at Bykhov Monastery, under a guard lenient enough that he escaped in the chaos of the Bolshevik seizure of power that December, disguised as a Turkoman soldier. Made his way south to the Don. See the Armed Forces of South Russia campaign for what he does next -- and how it ends.",
      faction: "Supreme Command, Army General Staff",
      rank: 0,
    },
    tsereteli: {
      role: "Petrograd Soviet Executive Committee; Minister of Posts and Telegraphs, later Interior",
      bio:
        "A Georgian Menshevik released from Siberian exile in March 1917, and the real architect of the coalition this campaign's opening crisis produces -- the leading voice of 'revolutionary defencism' (hold the front, seek a negotiated peace without annexations, and work with the Provisional Government rather than against it) against the Soviet's own more radical minority. The government's ability to speak with the Soviet's actual majority at all runs through him more than through Kerensky.",
      fate:
        "Opposed the July rising as recklessness that could only help the government's enemies, then opposed the Bolshevik seizure of power in November just as firmly. Left Russia in 1921 after the Georgian Menshevik republic he helped lead was itself overrun by the Red Army, and died in exile in New York in 1959.",
      faction: "Petrograd Soviet, Menshevik-SR Majority",
      rank: 1,
    },
    miliukov: {
      role: "Foreign Minister (until the April Crisis)",
      bio:
        "A historian by training and the Kadet (Constitutional Democrat) party's leading figure for two decades before 1917, and the most articulate voice in this Cabinet for the argument that the new government's legitimacy abroad depends on honoring the old empire's commitments, war aims included -- the position the note bearing his name states plainly enough that its publication becomes this campaign's opening crisis.",
      fate:
        "Resigned days after the note's publication rather than soften its language. Remained active in Kadet politics through 1917 and the years after, opposed both the Bolsheviks and, eventually, most of the White movement's own leadership on questions of what postwar Russia should look like, and died in exile in France in 1943.",
      faction: "Kadet Party, First Coalition Cabinet",
      rank: 1,
    },
    savinkov: {
      role: "Deputy Minister of War (from the summer of 1917)",
      bio:
        "A Socialist Revolutionary who had organized the assassinations of the interior minister Plehve in 1904 and of Grand Duke Sergei in 1905. In 1917 he served as a commissar with the army and then as Kerensky's deputy at the War Ministry. He was one of those who pressed for Kornilov to be made Supreme Commander.",
      fate:
        "Left the War Ministry in September, after the Kornilov affair. He fought the Bolsheviks in 1918, lived in exile in Europe, and was arrested after crossing back into the Soviet Union in 1924. He was sentenced to death, the sentence was reduced to ten years, and he died in the Lubyanka on 7 May 1925. The official finding was suicide.",
      faction: "Provisional Government, War Ministry",
      rank: 1,
    },
  },

  NODE_ATLAS: [
    { id: "aprilCrisis17", date: "MAY 1917", title: "Petrograd: The Note That Became Public" },
    { id: "armyCommissars17", date: "MAY 1917", title: "The Ministry of War: Committees, Commissars and a Declaration" },
    { id: "juneOffensive17", date: "JULY 1917", title: "The Southwestern Front: An Offensive With a Government's Name On It" },
    { id: "julyDays17", date: "JULY 1917", title: "Petrograd: The Days the Machine Guns Came Out" },
    { id: "supremeCommand17", date: "JULY 1917", title: "Stavka: Who Commands the Army" },
    { id: "moscowConference17", date: "AUGUST 1917", title: "Moscow: The State Conference" },
    { id: "kornilovAffair17", date: "SEPTEMBER 1917", title: "Petrograd: The General's Trains" },
    { id: "directory17", date: "SEPTEMBER 1917", title: "Petrograd: Five Ministers and a Republic" },
    { id: "democraticConference17", date: "SEPTEMBER 1917", title: "Petrograd: The Democratic Conference" },
    { id: "octoberStand17", date: "NOVEMBER 1917", title: "Petrograd: The Morning of 6 November" },
  ],
  NODE_TOTAL: 10,
  ENDINGS_GALLERY: [
    { id: "endingWinterPalaceFalls17", title: "The Winter Palace Falls", classification: "historical" },
    { id: "endingKornilovsRepublic17", title: "The General's Republic", classification: "speculative" },
    { id: "endingDecreeCabinet17", title: "The Cabinet That Governed Alone", classification: "speculative" },
  ],
  ENDING_CLASSIFICATION: {
    endingWinterPalaceFalls17: "historical",
    endingKornilovsRepublic17: "speculative",
    endingDecreeCabinet17: "speculative",
  },

  resolveNode(nodeId, flags = {}, meters = {}) {
    switch (nodeId) {
      // -----------------------------------------------------------------
      case "aprilCrisis17":
        return {
          date: "MAY 1917",
          title: "Petrograd: The Note That Became Public",
          bulletin: {
            headline: "AN EMPIRE ENDS WITHOUT A COMMAND STRUCTURE TO END IT",
            body:
              "Seven weeks ago there was a Tsar. The abdication itself -- 15 March, at Pskov, after five days of strikes, a garrison mutiny, and a Duma committee that formed to fill the vacuum before anyone had decided it should -- wasn't a decision this government made; it inherited the result. Power split on arrival between this Cabinet, appointed by the old Duma's committee, and the Petrograd Soviet of Workers' and Soldiers' Deputies, elected in the same chaotic week and controlling the garrison, the railways, and the printing presses this government needs to be obeyed at all. Neither side calls the other illegitimate. Neither side can act without the other's cooperation, either.",
            meanwhile: {
              southRussia: "Does not exist yet as a command. The Volunteer Army's founders are still serving officers of an army that answers, for now, to this government.",
              siberia: "Does not exist yet as a command. The Czechoslovak Legion is still an Allied unit in transit through Russian territory, over a year from the revolt that will make Siberia a front at all.",
              bolsheviks: "Lenin is still in Zurich. The Bolshevik faction inside the Petrograd Soviet is a small, radical minority, not yet the majority that any of this campaign's choices will help build.",
            },
          },
          historicalRecord: true,
          situation:
            "Foreign Minister Miliukov's note to the Allies, reaffirming this government's commitment to the war and to the territorial gains the old regime promised itself, has leaked into print exactly as written -- with none of the 'peace without annexations' language the Soviet's own Executive Committee has spent weeks getting this Cabinet to publicly accept. Armed soldiers and workers are demonstrating outside the Mariinsky Palace. A counter-demonstration of officers and cadets has also formed. Nobody has fired anything yet. Miliukov is not offering to resign on his own.",
          choices: [
            {
              label: "Back Miliukov. The note states this government's actual policy; reversing it because a crowd formed outside the palace teaches every future crowd that a crowd is how policy gets made here.",
              advisor: {
                name: "Miliukov",
                position: "Miliukov holds that the note states the government's policy, that withdrawing it in front of a crowd teaches every later crowd the same lesson, and that he would resign rather than sign a clarification.",
              },
              historical: false,
              setFlags: { aprilCrisisChoice: "standFirm" },
              impact: { authority: -2, sovietRelations: -3 },
              next: "armyCommissars17",
              outcome:
                "The note stands as written. The demonstrations don't stop; they harden, and the officer counter-demonstration hardens with them. Miliukov keeps his portfolio for now, at the cost of a Soviet Executive Committee that no longer takes this Cabinet's public commitments at face value.",
            },
            {
              label: "Accept the Soviet's terms: clarify the note's language, and bring Soviet-aligned socialists into the Cabinet itself rather than governing over their objections.",
              advisor: {
                name: "Tsereteli",
                position: "Tsereteli argues that a coalition is the only form of this government whose orders will be obeyed beyond the palace gates, and that sharing the cabinet is better than holding all of it with none of the authority.",
              },
              historical: true,
              setFlags: { aprilCrisisChoice: "coalition" },
              impact: {},
              next: "armyCommissars17",
              outcome:
                "Miliukov and War Minister Guchkov resign within days. On 18 May a reorganized coalition cabinet is sworn in with six socialist ministers, Kerensky moving from Justice to War among them -- the first time the Soviet's own people sit in the government rather than merely supervising it from outside.",
            },
          ],
        };

      // -----------------------------------------------------------------
      // May 1917. Documented: each field army and front was given commissars from the
      // Provisional Government, the Petrograd Soviet and the soldiers' committees, who could
      // countersign orders and recommend the removal of officers. Kerensky's Declaration of
      // Soldiers' Rights was modified so that committees could not elect officers and officers
      // kept control of operations, training and supply. Brusilov replaced Alekseev as Supreme
      // Commander in late May. The exact date of the Declaration is not claimed here.
      // Sources: claims/provisional-government-round1.md
      case "armyCommissars17":
        return {
          date: "MAY 1917",
          title: "The Ministry of War: Committees, Commissars and a Declaration",
          bulletin: {
            headline: "THE ARMY NOW HAS THREE KINDS OF AUTHORITY",
            body:
              "Every regiment has an elected soldiers' committee. Every field army and front now has commissars named by the Provisional Government, the Petrograd Soviet and the soldiers' committees. They can countersign orders and recommend that an officer be removed. The officers say the army cannot attack under this arrangement. The committees say the officers want the old army back.",
            meanwhile: {
              southRussia: "Does not exist yet as a command. General Alekseev, the Supreme Commander, will raise the Volunteer Army on the Don after the November rising.",
              siberia: "Does not exist yet as a command. The Czechoslovak units are still part of the Russian army.",
              bolsheviks: "Lenin has been back in Petrograd since 16 April and argues for all power to the Soviets. The Bolsheviks are a minority in the Soviet.",
            },
          },
          historicalRecord: true,
          situation:
            "You are Minister of War. The army has to attack in the summer if Russia is to keep its place beside the Allies, and it has to attack with a soldiers' committee in every regiment. The officers want the committees confined to supply and welfare. The Soviet wants the soldiers' rights written into law. You have to decide what the army is allowed to be before you ask it to fight." +
            (flags.aprilCrisisChoice === "standFirm"
              ? " The Soviet Executive Committee has no minister of its own in the cabinet to speak for the committees, and says so."
              : " The Soviet's ministers sit in the cabinet and will read whatever you issue."),
          choices: [
            {
              label: "Issue the Declaration of Soldiers' Rights, with the commissars in place. Committees may not elect officers. Officers keep command of operations, training and supply.",
              advisor: {
                name: "Tsereteli",
                position: "Tsereteli argues that soldiers will take orders only from a government they can see the Soviet standing behind.",
              },
              historical: true,
              setFlags: { armyPolicy: "declaration" },
              impact: {},
              next: "juneOffensive17",
              outcome:
                "The Declaration goes out over your signature. Soldiers keep their civil rights and their committees. They lose the right to elect their officers, and officers get back command of operations, training and supply. The commissars stay with the armies.",
              aftermath:
                "Brusilov took over as Supreme Commander in late May 1917, when Alekseev was removed.",
            },
            {
              label: "Hold the Declaration back. Confine the committees to supply and welfare by order, and keep the commissars as observers.",
              advisor: {
                name: "Kornilov",
                position: "Kornilov argues that committees which can discuss orders have already ended command, and that the army will attack only when they are confined to the mess and the stores.",
              },
              historical: false,
              costsCapital: true,
              setFlags: { armyPolicy: "withheld" },
              impact: { frontDiscipline: 2, sovietRelations: -3, authority: -1 },
              next: "juneOffensive17",
              outcome:
                "A modeled alternative. The order goes to the armies as a telegram from the Ministry. Officers act on it at once. Many committees refuse to recognize it, and the Soviet Executive Committee asks by what authority the Ministry issued it.",
            },
          ],
        };

      // -----------------------------------------------------------------
      // Reached by both armyCommissars17 choices with no flags-conditional
      // branch here — check-continuity.js flags this every run, and it's a
      // deliberate, accepted convergence, not a gap: this is a 4-node
      // chain, not a wide tree, and April's choice is already read forward
      // (see julyDays17's situation text) rather than forked into two
      // separate versions of June that would say the same thing anyway.
      case "juneOffensive17":
        return {
          date: "JULY 1917",
          title: "The Southwestern Front: An Offensive With a Government's Name On It",
          bulletin: {
            headline: "THE FIRST FREE PRESS IN THE EMPIRE'S HISTORY IS ALSO ARGUING FOR THE ARMY TO STOP FIGHTING",
            body:
              "Censorship lifted with the old regime, and the range of what Russian newspapers now openly print, from Kadet papers demanding the offensive to Bolshevik ones calling every day of continued war a crime against the men fighting it, is itself something the old empire never had to govern through. The army's own soldier committees -- elected, and empowered by the Soviet's own Order No. 1 to countermand officers -- are reading all of it.",
            meanwhile: {
              southRussia: "Brusilov is still Supreme Commander for one more month; the officers who will found the Volunteer Army are watching the front committees test how much authority survives contact with an elected soldier vote.",
              siberia: "Does not exist yet as a command. Still over a year from the Czechoslovak Legion's revolt.",
              bolsheviks: "Not yet a command, and not yet arguing this from inside a government -- the Bolsheviks' position that the offensive is a crime against the men fighting it is currently a minority opinion in the Soviet, not yet the policy of anything.",
            },
          },
          historicalRecord: true,
          situation:
            "As the new War Minister, you campaigned across the front for this offensive personally, on the argument that Russia keeps its seat among the Allies -- and its claim on any postwar settlement -- only by fighting, not merely by surviving. The Southwestern Front attacks at dawn on 1 July. The first two days go well: real ground, real prisoners. What happens after that is not yet written." +
            (flags.armyPolicy === "withheld"
              ? " The committees have not accepted the May order. Several regiments on the line have voted on whether to attack at all."
              : flags.armyPolicy === "declaration"
              ? " Under the Declaration the committees keep their civil rights and the commissars countersign the orders. Officers command the attack."
              : ""),
          choices: [
            {
              label: "Commit the reserves forward the moment the initial advance succeeds, to turn a local gain into an actual breakthrough before the front stabilizes again.",
              keyBattleSubgame: { id: "juneOffensive" },
              advisor: {
                name: "Kerensky",
                position: "Kerensky argues that a gain not pressed on the day it starts to work will have been spent for nothing, after three weeks of telling tired men why the offensive matters.",
              },
              historical: true,
              setFlags: { offensiveChoice: "pressForward" },
              impact: { frontDiscipline: 1 },
              next: "julyDays17",
              outcome:
                "The reserves go in. What the roll below decides is not whether the offensive succeeds in the end -- it doesn't -- but how much of the army survives finding that out.",
              uncertain: (() => {
                const holdsWeight = modWeight(30, meterPct(meters.frontDiscipline));
                return [
                  {
                    weight: holdsWeight,
                    title: "The advance stalls in good order",
                    setFlags: { offensiveOutcome: "contained" },
                    impact: { frontDiscipline: 1 },
                    outcome:
                      "The German-Austrian counterattack on 19 July still breaks the front near Tarnopol, exactly as it did in the record -- committing the reserve doesn't change that. It does mean the retreat that follows is a retreat, with formations still answering to their officers, rather than the wholesale collapse the same counterattack produced where units had already stopped listening to anyone.",
                  },
                  {
                    weight: 100 - holdsWeight,
                    title: "The retreat becomes a rout",
                    setFlags: { offensiveOutcome: "routed" },
                    impact: { frontDiscipline: -4, authority: -1 },
                    outcome:
                      "The reserve is caught up in the same collapse it was meant to prevent. Entire divisions stop being military units capable of receiving orders, in numbers even the front committees can't spin as discipline holding. The word for what the newspapers do with this by the second week of July is not 'setback.'",
                  },
                ];
              })(),
            },
            {
              label: "Hold the reserves back and consolidate the initial gain, rather than gambling everything on turning two good days into something larger.",
              advisor: {
                name: "Kornilov",
                position: "Kornilov argues that an army this ready to stop fighting does not improve with caution, and that each day the offensive fails to succeed visibly is a day the men decide it has already failed.",
              },
              historical: false,
              setFlags: { offensiveChoice: "consolidate", offensiveOutcome: "consolidated" },
              impact: { frontDiscipline: 2, authority: -1 },
              next: "julyDays17",
              outcome:
                "The offensive halts on its own initial gains rather than reaching for more. It reads, within days, as an admission that the government's own showpiece attack didn't believe in itself past the second day -- which does less damage to the army in the field than the historical collapse, and considerably more to the government's standing with everyone hoping this offensive would prove the new order could still fight a war.",
            },
          ],
        };

      // -----------------------------------------------------------------
      case "julyDays17":
        return {
          date: "JULY 1917",
          title: "Petrograd: The Days the Machine Guns Came Out",
          bulletin: {
            headline:
              flags.offensiveOutcome === "routed"
                ? "THE FRONT'S COLLAPSE REACHES THE CAPITAL"
                : "THE OFFENSIVE'S NEWS REACHES THE CAPITAL BEFORE THE ARMY DOES",
            body:
              flags.offensiveOutcome === "routed"
                ? "Word of the rout at the front has beaten the wounded home, and the First Machine Gun Regiment -- under orders to reinforce a front it has no confidence in -- is the spark rather than a footnote. Armed soldiers, sailors from Kronstadt, and factory workers are in the streets demanding the Soviet itself take power outright, not merely negotiate with this Cabinet."
                : "Word that the offensive has stalled rather than broken through is enough on its own. Armed soldiers, sailors from Kronstadt, and factory workers are in the streets demanding the Soviet itself take power outright, not merely negotiate with this Cabinet.",
            meanwhile: {
              bolsheviks: "The Party's own Central Committee did not order this and is not fully in control of it -- Lenin is not even in the city when it starts. That will not be the story told about it afterward.",
              southRussia: "Does not exist yet as a command. The garrison units this Cabinet is deciding whether it can even still rely on are, for now, still the same imperial army the Volunteer Army's founders currently still serve in.",
              siberia: "Does not exist yet as a command. The Czechoslovak Legion is still an Allied unit in transit through Russian territory, over a year from the revolt that will make it a front.",
            },
          },
          historicalRecord: true,
          situation:
            "For four days the city has been armed and in the streets, and the rising has no single command giving it direction -- which makes it harder to negotiate with and, this Cabinet's staff believe, easier to break, if there are still loyal units left to do the breaking with." +
            (flags.aprilCrisisChoice === "standFirm"
              ? " The coalition that never formed in May is being felt now: there is no socialist minister in this room whose own presence might have kept the Soviet's moderate majority talking instead of watching the streets to see who wins."
              : ""),
          choices: [
            {
              label: "Bring in loyal front-line units to clear the streets, arrest the Bolshevik leadership reachable in the city, and shut down the Party's press -- but stop short of an outright ban on the party itself.",
              advisor: {
                name: "Tsereteli",
                position: "Tsereteli argues that breaking the rising is not the same decision as outlawing everyone who marched in it. The Soviet's moderate majority wants order restored. A ban would make martyrs of people the government may still need to talk to.",
              },
              historical: true,
              setFlags: { julyDaysChoice: "targetedCrackdown" },
              impact: { sovietRelations: 1, frontDiscipline: -1 },
              next: "supremeCommand17",
              outcome:
                "Loyalist units restore order within days. Trotsky is arrested; Lenin, warned in time, goes into hiding and crosses into Finland within days, not returning to the city until October. The Bolshevik press is shut down for a matter of weeks, not permanently, and the party itself is never formally outlawed -- a targeted defeat, not an eradication.",
            },
            {
              label: "Use the moment to move against the Bolshevik party as an organization outright -- outlaw it, not merely its individual leaders, while the rising has discredited it in front of the Soviet's own moderate majority.",
              advisor: {
                name: "Kerensky",
                position: "Kerensky grants the case for restraint but says he is less persuaded by it each week the party organizes against a government it does not mean to recognize.",
              },
              historical: false,
              gate: (m) => m.authority >= -3,
              disabledReason:
                "the Cabinet's own authority to make a decree like this actually stick is already too thin -- an outright ban announced by a government this weak reads as a threat it cannot enforce, not a real one.",
              costsCapital: true,
              setFlags: { julyDaysChoice: "outrightBan" },
              impact: { sovietRelations: -3, authority: 1 },
              next: "supremeCommand17",
              outcome:
                "The ban is issued. It costs the Soviet Executive Committee's own patience more than it costs the Bolsheviks any real capacity -- a party used to operating illegally under the old regime does not stop existing because this government's decree says it should, and the moderate socialists whose cooperation this Cabinet needs for everything else now have their own reasons to wonder what 'temporary emergency measure' will be reached for next.",
            },
          ],
        };

      // -----------------------------------------------------------------
      // July 1917. Documented: Kornilov, in command of the Southwestern Front from 8 July (OS),
      // asked for the death penalty behind the lines and for the removal of General Cheremisov;
      // Kerensky agreed to move Cheremisov provided Kornilov pledged to answer to the government;
      // Savinkov was among those who pressed for Kornilov; Kornilov replaced Brusilov as Supreme
      // Commander. Kerensky's account says the reforms were acceptable in substance but were put
      // in a form he could not accept; that is one side of the dispute.
      case "supremeCommand17":
        return {
          date: "JULY 1917",
          title: "Stavka: Who Commands the Army",
          bulletin: {
            headline: "THE FRONT BROKE AT TARNOPOL. THE SUPREME COMMANDER IS TO CHANGE.",
            body:
              "The German and Austrian counterattack of 19 July broke the Southwestern Front near Tarnopol. The government has restored the death penalty at the front. General Kornilov, who took the Southwestern Front on 21 July, has told the government what he will need as Supreme Commander. He asks for the death penalty behind the lines as well, and for the removal of General Cheremisov.",
            meanwhile: {
              southRussia: "Does not exist yet as a command. General Denikin commands the Western Front and is about to be given the Southwestern Front that Kornilov is leaving.",
              siberia: "Does not exist yet as a command. The Czechoslovak units are still part of the Russian army.",
              bolsheviks: "Lenin is in hiding after the July Days. Warrants have been issued for the Bolshevik leaders.",
            },
          },
          historicalRecord: true,
          situation:
            "Prince Lvov has resigned. You are Minister-Chairman as well as Minister of War. Brusilov is to be replaced as Supreme Commander. Savinkov, your deputy at the War Ministry, wants Kornilov. The Soviet's left objects to him. Kornilov will take the post, but on conditions." +
            (flags.julyDaysChoice === "outrightBan"
              ? " The ban on the Bolshevik party has already cost you the patience of the Executive Committee, and a general with a reputation for harshness will not help."
              : ""),
          choices: [
            {
              label: "Appoint Kornilov. Agree to move Cheremisov, but only against Kornilov's written pledge that he answers to the government.",
              advisor: {
                name: "Savinkov",
                position: "Savinkov argues that only Kornilov can restore discipline at the front, and that the government should take him.",
              },
              historical: true,
              setFlags: { supremeCommand: "written_pledge" },
              impact: {},
              next: "moscowConference17",
              outcome:
                "Kornilov takes the post. His pledge is in writing. It says he answers to the government, and Cheremisov is moved.",
              aftermath:
                "Kerensky's later account says the reforms Kornilov asked for were acceptable in substance but were put in a form he could not accept. That account is one side of the dispute.",
            },
            {
              label: "Appoint Kornilov on his own terms: the death penalty behind the lines, the committees cut back, Cheremisov dismissed, and no written pledge.",
              advisor: {
                name: "Kornilov",
                position: "Kornilov argues that a Supreme Commander who must clear every order with ministers cannot hold a front that is already breaking.",
              },
              historical: false,
              costsCapital: true,
              setFlags: { supremeCommand: "on_his_terms" },
              impact: { frontDiscipline: 2, sovietRelations: -2, authority: -2 },
              next: "moscowConference17",
              outcome:
                "A modeled alternative. The telegram accepting his terms goes to Mogilev the same night. The Soviet's left reads it as the government handing the army to the officers.",
            },
          ],
        };

      // -----------------------------------------------------------------
      // August 1917. Documented: the Moscow State Conference met from 12 August (OS); it opened
      // under a strike called by the Bolsheviks; Kerensky told the delegates that resistance to the
      // government would be put down with iron and blood; Kornilov was cheered by half the hall and
      // met with hostile silence by the rest; his program asked for the death penalty behind the
      // lines and martial law on the railways and in defence factories, with strikes and meetings
      // banned there. Kerensky convened the Conference to rebuild a middle ground.
      case "moscowConference17":
        return {
          date: "AUGUST 1917",
          title: "Moscow: The State Conference",
          bulletin: {
            headline: "A CONFERENCE OPENS UNDER A STRIKE",
            body:
              "The State Conference meets in Moscow from 25 August. Delegates come from the Duma, the Soviets, the army, the banks, the cooperatives and the Cossack hosts. It opens under a strike called by the Bolsheviks. You tell the delegates that any attempt to resist the government will be put down with iron and blood.",
            meanwhile: {
              southRussia: "Kornilov and General Alekseev are among the generals in Moscow. Kaledin, ataman of the Don Host, speaks for the Cossacks.",
              siberia: "Does not exist yet as a command. The Czechoslovak units are still part of the Russian army.",
              bolsheviks: "The Bolsheviks have called a strike in Moscow against the Conference.",
            },
          },
          historicalRecord: true,
          situation:
            "Kornilov has sent you his program. He wants the death penalty extended behind the lines. He wants martial law on the railways and in the factories that work for the front, with strikes and meetings banned there. You agree with part of it and dislike its tone. The Conference is the one room in Russia where the generals, the Soviets and the banks sit together." +
            (flags.supremeCommand === "written_pledge"
              ? " He has given you a written pledge that he answers to the government."
              : flags.supremeCommand === "on_his_terms"
              ? " You gave him his terms in July without a written pledge, and he writes to you as an equal."
              : ""),
          choices: [
            {
              label: "Open the Conference yourself, ask for support against both extremes, and keep Kornilov's program in committee.",
              advisor: {
                name: "Kerensky",
                position: "Kerensky wants the Conference to show the country that the government has a majority between the extremes.",
              },
              historical: true,
              setFlags: { moscowChoice: "program_in_committee" },
              impact: {},
              next: "kornilovAffair17",
              outcome:
                "You open the Conference and speak against both extremes. Kornilov is greeted with an ovation from half the hall and a hostile silence from the rest. In his speech he names the laws passed since the monarchy fell as the main cause of the army's collapse. The Conference adopts nothing on his program.",
              aftermath:
                "The Conference did not settle the split between the government and the generals. Within two weeks Kornilov moved troops toward Petrograd.",
            },
            {
              label: "Declare martial law on the railways and in the war factories by decree before the Conference closes, and extend the death penalty behind the front.",
              advisor: {
                name: "Savinkov",
                position: "Savinkov argues that part of Kornilov's program is the government's own business and should be done by the government, not left for the general to demand.",
              },
              historical: false,
              costsCapital: true,
              setFlags: { moscowChoice: "decree" },
              impact: { frontDiscipline: 2, sovietRelations: -4 },
              next: "kornilovAffair17",
              outcome:
                "A modeled alternative. The decrees are published in Moscow while the delegates are still in the hall. The Soviet delegates call them the end of the revolution's gains, and the strike in the city grows.",
            },
            {
              label: "Keep the generals out of politics. Kornilov reports to the cabinet in Petrograd and does not address the Conference.",
              advisor: {
                name: "Tsereteli",
                position: "Tsereteli argues that a speech by the Supreme Commander in front of the delegates is a political act, and that the Soviet delegates will not sit through it.",
              },
              historical: false,
              setFlags: { moscowChoice: "generals_kept_off" },
              impact: { authority: -1, frontDiscipline: -1, sovietRelations: 2 },
              next: "kornilovAffair17",
              outcome:
                "A modeled alternative. The order reaches Mogilev and Kornilov does not come. The officers' unions in the capital protest, and Kornilov's staff tell the press why he stayed away.",
            },
          ],
        };

      // -----------------------------------------------------------------
      case "kornilovAffair17":
        return {
          date: "SEPTEMBER 1917",
          title: "Petrograd: The General's Trains",
          bulletin: {
            headline: "THE COMMANDER YOU APPOINTED IS MOVING ON THE CAPITAL",
            body:
              "Six weeks ago you made Kornilov Supreme Commander yourself, over the objections of the Soviet's own left, because the front needed someone the officer corps still believed in. What passed between you and him through the intermediary Lvov this past week -- an agreed plan to suppress a Bolshevik rising nobody has actually staged yet, or a coup you encouraged and are now publicly disowning -- is a question the two of you will spend the rest of your lives answering differently. What isn't in dispute: General Krymov's Third Cavalry Corps is moving on Petrograd by rail, and you have just publicly dismissed Kornilov and called it mutiny." +
              (flags.offensiveChoice === "pressForward"
                ? " Kornilov's own case for the appointment always ran through the offensive -- that a War Minister who pressed it forward understood, as he did, that an army without discipline stops being an army. He is, in effect, invoking your own June decision against you now."
                : " Kornilov never had much use for the Offensive's caution, and says so to anyone who asks -- an army you preferred to consolidate rather than push, in his account, is exactly the kind of army you're now relying on to stop him.") +
              (flags.supremeCommand === "written_pledge"
                ? " In July he gave you a written pledge that he answers to the government. He has now acted without you."
                : flags.supremeCommand === "on_his_terms"
                ? " In July you gave him his terms without a written pledge. Nothing in writing binds him now."
                : "") +
              (flags.moscowChoice === "decree"
                ? " The decrees you issued in Moscow were his program, and he says the government has not carried out the rest."
                : flags.moscowChoice === "generals_kept_off"
                ? " You kept him off the platform in Moscow, and he has not forgotten it."
                : ""),
            meanwhile: {
              bolsheviks: "Not yet a command. Trotsky is in prison; Lenin is in Finland. Whether the Party's own moment is still to come depends more on how this crisis resolves than on anything the Central Committee decides on its own this month.",
              southRussia: "Does not exist yet as a command. Kornilov's own officers -- Denikin among them -- are watching this crisis from the front, and several will follow him into whatever comes next regardless of how it ends here.",
              siberia: "Does not exist yet as a command. Still over a year from the Czechoslovak Legion's revolt that will make Siberia a front at all.",
            },
          },
          historicalRecord: true,
          situation:
            "The garrison alone may not be enough to stop an advancing cavalry corps. The Soviet Executive Committee -- including the Bolsheviks you moved against three weeks ago -- is offering to arm every willing hand in the city, Red Guards included, to help stop it." +
            (flags.julyDaysChoice === "outrightBan"
              ? " The Executive Committee's offer comes anyway, which is either proof the Soviet's moderate majority separates this crisis from last month's ban on principle, or proof this Cabinet has nothing left to bargain with and the Soviet knows it."
              : ""),
          choices: [
            {
              label: "Accept the Soviet's offer. Arm everyone willing to fight, including the Bolshevik Red Guards, and worry about what that arming makes possible afterward.",
              advisor: {
                name: "Tsereteli",
                position: "Tsereteli grants that arming the Red Guards is dangerous, and argues that the alternative is to find out in person whether Krymov's corps stops itself.",
              },
              historical: true,
              impact: {},
              next: "directory17",
              outcome:
                "Word is enough. Railway workers refuse to move Krymov's trains; soldiers' committees the general is counting on send delegations to negotiate instead of fighting. The advance dissolves without a real battle, over three days, and Kornilov is arrested at Mogilev. Nobody had to test whether the Red Guards you just armed would give the weapons back.",
            },
            {
              label: "Refuse the Soviet's Red Guards. Rely on whatever units still answer directly to this government, and try to negotiate Kornilov down instead.",
              advisor: {
                name: "Kerensky",
                position: "Kerensky argues that he has just removed one general for exceeding his authority, and does not want to arm the men most likely to decide, once that general is stopped, that they need not return their rifles.",
              },
              historical: false,
              gate: (m) => m.sovietRelations >= -6 && m.frontDiscipline >= -2,
              disabledReason:
                "there is no longer a loyal garrison left to rely on instead -- every choice that damaged relations with the Soviet also cost the units that were never going to fight for this government without the Soviet's own backing behind the order, and a front that's already come apart doesn't leave a garrison worth relying on regardless.",
              costsCapital: true,
              setFlags: { kornilovAffairChoice: "refusedRedGuards" },
              impact: { sovietRelations: -2, authority: 1 },
              outcome:
                "The order goes out to rely on the garrison alone. Whether that garrison actually holds against a cavalry corps this government has no independent way to stop is not something cabinet minutes get to decide.",
              uncertain: (() => {
                const holdsWeight = modWeight(35, meterPct(meters.frontDiscipline));
                return [
                  {
                    weight: holdsWeight,
                    title: "The garrison holds without them",
                    setFlags: { kornilovOutcome: "garrisonHeld" },
                    impact: { frontDiscipline: 1 },
                    next: "directory17",
                    outcome:
                      "It's close enough that staff afterward disagree about whether it was ever really in doubt, but the garrison and the same railway refusals that happened in the record are enough on their own. Kornilov is arrested. The Soviet notices, plainly, that it was asked to stand aside from its own defense of the capital -- and remembers it.",
                  },
                  {
                    weight: 100 - holdsWeight,
                    title: "Krymov's Cossacks reach the city",
                    setFlags: { kornilovOutcome: "cityFell" },
                    impact: { authority: -4 },
                    next: "endingKornilovsRepublic17",
                    outcome:
                      "The garrison that was supposed to hold does not, and there is no armed Soviet militia in reserve to make up the difference this time. Krymov's corps reaches central Petrograd inside the week.",
                  },
                ];
              })(),
            },
          ],
        };

      // -----------------------------------------------------------------
      // 1 September 1917. Documented: a decree signed by Kerensky proclaimed the Russian Republic
      // on 1 September (OS) and a Directory of five, with Kerensky as president, held power until
      // 25 September; the Kadet ministers had resigned during the Kornilov affair.
      case "directory17":
        return {
          date: "SEPTEMBER 1917",
          title: "Petrograd: Five Ministers and a Republic",
          bulletin: {
            headline: "RUSSIA IS PROCLAIMED A REPUBLIC",
            body:
              "On 14 September a decree signed by Kerensky proclaims the Russian Republic. Executive power passes to a Directory of five, with Kerensky as president. The Kadet ministers have resigned from the cabinet. Part of the Soviet Executive Committee wants a government of socialists only.",
            meanwhile: {
              southRussia: "Kornilov and the generals who backed him are under arrest.",
              siberia: "Does not exist yet as a command. The Czechoslovak units are still part of the Russian army.",
              bolsheviks: "On 13 September the Petrograd Soviet passed a Bolshevik resolution for the first time. Trotsky is still in prison.",
            },
          },
          historicalRecord: true,
          situation:
            "Kornilov's advance has collapsed. You have named yourself Supreme Commander in his place. The Kadet ministers have resigned and the cabinet is half empty. A government has to be named this week, and the republic has to be proclaimed.",
          choices: [
            {
              label: "Proclaim the republic and govern through a Directory of five, with yourself as president.",
              advisor: {
                name: "Kerensky",
                position: "Kerensky argues that a small body can decide in a day what a coalition takes a month to agree.",
              },
              historical: true,
              costsCapital: true,
              setFlags: { governmentForm: "directory" },
              impact: {},
              next: "democraticConference17",
              outcome:
                "The decree is published. The Directory is you, Tereshchenko, Verkhovsky, Verderevsky and Nikitin. It governs by decree until a wider body can be called.",
              aftermath:
                "The Directory sat from 14 September to 8 October.",
            },
            {
              label: "Ask the Kadet ministers to return at once, on the terms on which they left.",
              advisor: {
                name: "Miliukov",
                position: "Miliukov argues that the Kadets left over the handling of the Kornilov affair and not over a program, and that the country wants a government that can keep order.",
              },
              historical: false,
              gate: (m) => m.sovietRelations >= -6,
              disabledReason:
                "the Soviet Executive Committee will not sit in a cabinet that brings back the ministers who resigned during the Kornilov affair, and the cabinet cannot govern without it.",
              setFlags: { governmentForm: "kadets_back" },
              impact: { authority: 2, sovietRelations: -3 },
              next: "democraticConference17",
              outcome:
                "A modeled alternative. The Kadets return to the cabinet. The Soviet Executive Committee reads it as the cabinet siding with the right.",
            },
            {
              label: "Ask the Soviet's moderate majority to name a government of socialists only.",
              advisor: {
                name: "Tsereteli",
                position: "Tsereteli warns that a cabinet of socialists alone cannot be formed without losing the banks, the officers and the railways, and says so against the left of his own party.",
              },
              historical: false,
              setFlags: { governmentForm: "socialist_cabinet" },
              impact: { sovietRelations: 3, authority: -2, frontDiscipline: -1 },
              next: "democraticConference17",
              outcome:
                "A modeled alternative. The Executive Committee names a cabinet of socialists. The Kadets, the banks and the officers' unions withhold their support from it.",
            },
          ],
        };

      // -----------------------------------------------------------------
      // September 1917. Documented: the Democratic Conference voted 766 to 688, with 38 abstentions,
      // for a coalition with the propertied parties; the cabinet formed on 25 September had six
      // socialist, six liberal and six non-party ministers; a Council of the Republic (the
      // Pre-Parliament) sat at the Mariinsky Palace.
      case "democraticConference17":
        return {
          date: "SEPTEMBER 1917",
          title: "Petrograd: The Democratic Conference",
          bulletin: {
            headline: "A CONFERENCE OF DELEGATES VOTES ON COALITION",
            body:
              "The All-Russian Democratic Conference meets in Petrograd in September. It votes 766 to 688, with 38 abstentions, for a coalition with the propertied parties. The vote splits the delegates almost evenly.",
            meanwhile: {
              southRussia: "Does not exist yet as a command. Kornilov is under arrest.",
              siberia: "Does not exist yet as a command. The Czechoslovak units are still part of the Russian army.",
              bolsheviks: "Lenin is hiding in Finland. In letters to the Central Committee he argues that the party should take power.",
            },
          },
          historicalRecord: true,
          situation:
            "The Conference has voted for a coalition, narrowly. A cabinet has to be named that the delegates, the Kadets and the Soviet will all put up with." +
            (flags.governmentForm === "kadets_back"
              ? " The Kadets are already back in the cabinet, and the delegates who voted against coalition say so."
              : flags.governmentForm === "socialist_cabinet"
              ? " A cabinet of socialists is already in office, and the vote asks it to take in the parties it excluded."
              : flags.governmentForm === "directory"
              ? " The Directory has governed for two weeks, and the delegates know it."
              : ""),
          choices: [
            {
              label: "Form the coalition: socialists, liberals and ministers without party, with the Kadets inside, and create a Council of the Republic to advise it.",
              advisor: {
                name: "Tsereteli",
                position: "Tsereteli argues that the vote, narrow as it is, gives the cabinet the Soviet's consent to include the propertied parties.",
              },
              historical: true,
              setFlags: { conferenceChoice: "coalition_with_kadets" },
              impact: {},
              next: "octoberStand17",
              outcome:
                "On 8 October the new cabinet is sworn in. It has six socialist ministers, six liberals and six without party. The Council of the Republic, called the Pre-Parliament, meets at the Mariinsky Palace.",
              aftermath:
                "The Directory ended on 8 October, when this cabinet was formed.",
            },
            {
              label: "Keep the Directory. Tell the Conference that it advises and does not appoint.",
              advisor: {
                name: "Miliukov",
                position: "Miliukov argues that a conference of delegates elected by no one cannot choose a government, and that the government should rule until the Constituent Assembly meets.",
              },
              historical: false,
              costsCapital: true,
              setFlags: { conferenceChoice: "directory_continues" },
              impact: { authority: 1, sovietRelations: -3 },
              next: "octoberStand17",
              outcome:
                "A modeled alternative. The Directory stays in office. The delegates go home with a vote and no cabinet to show for it.",
            },
          ],
        };

      // -----------------------------------------------------------------
      // 6 November 1917 (24 October Old Style). Documented: at dawn on 24 October (OS) cadets were sent to close the plant
      // that printed the Bolshevik paper Rabochii Put; the Military Revolutionary Committee ordered
      // it reopened and sent the Lithuanian Regiment and a reserve sapper battalion to guard it;
      // Kerensky spoke to the Pre-Parliament that day and Dan answered him; Kerensky left
      // Petrograd by car for Pskov on the morning of the 25th. The Bolshevik Central Committee
      // had voted ten to two for an armed uprising on 10 October.
      case "octoberStand17":
        return {
          date: "NOVEMBER 1917",
          title: "Petrograd: The Morning of 6 November",
          bulletin: {
            headline: "THE GOVERNMENT TRIES TO CLOSE TWO NEWSPAPERS",
            body:
              "At dawn on 6 November cadets arrive to close the plant that prints the Bolshevik newspaper Rabochii Put. The Military Revolutionary Committee of the Petrograd Soviet orders the plant reopened and sends the Lithuanian Regiment and a reserve sapper battalion to guard it.",
            meanwhile: {
              southRussia: "Kornilov and the generals are still held under arrest.",
              siberia: "Does not exist yet as a command. The Czechoslovak units are still part of the Russian army.",
              bolsheviks: "On 23 October the Bolshevik Central Committee voted ten to two for an armed uprising. Kamenev and Zinoviev voted against.",
            },
          },
          historicalRecord: true,
          situation:
            "The Military Revolutionary Committee was formed in the Petrograd Soviet to control the garrison, and it now has commissars in most regiments. You have the cadets, some Cossacks and what is left of the loyal garrison. The front is days away by rail. The Pre-Parliament sits this afternoon." +
            (flags.conferenceChoice === "directory_continues"
              ? " It sits only to advise, and it knows that."
              : flags.conferenceChoice === "coalition_with_kadets"
              ? " The coalition cabinet is a month old."
              : ""),
          choices: [
            {
              label: "Strike first. Close the Bolshevik presses, order the cadets and Cossacks to the bridges, and arrest the Military Revolutionary Committee.",
              advisor: {
                name: "Savinkov",
                position: "Savinkov argues that a government which waits for a rising to begin has already lost the first day.",
              },
              historical: false,
              costsCapital: true,
              setFlags: { octoberChoice: "strike_first" },
              impact: { authority: 1, sovietRelations: -3 },
              next: "endingWinterPalaceFalls17",
              outcome:
                "A modeled alternative. The presses are closed at dawn, as in the record. The order to arrest the committee goes to the cadets at noon.",
            },
            {
              label: "Stay in the capital and stake the government on a vote of the Pre-Parliament.",
              advisor: {
                name: "Tsereteli",
                position: "Tsereteli argues that only a vote of the Pre-Parliament can bring the garrison back under the Soviet's own leaders.",
              },
              historical: false,
              setFlags: { octoberChoice: "stake_on_vote" },
              impact: { sovietRelations: 1 },
              next: "endingWinterPalaceFalls17",
              outcome:
                "A modeled alternative. You speak to the Pre-Parliament that afternoon. Dan answers for the Executive Committee, and the debate runs into the evening.",
            },
            {
              label: "Leave for the front to bring loyal troops to Petrograd, and leave the cabinet to hold the Winter Palace.",
              advisor: {
                name: "Kerensky",
                position: "Kerensky holds that the garrison cannot be relied on and that only troops brought from the front can defend the government.",
              },
              historical: true,
              setFlags: { octoberChoice: "leave_for_front" },
              impact: {},
              next: "endingWinterPalaceFalls17",
              outcome:
                "On the morning of 7 November you leave Petrograd by car for Pskov. The ministers stay in the Winter Palace.",
              aftermath:
                "Kerensky spoke to the Pre-Parliament on 6 November and left the capital the next morning. The Winter Palace was taken in the night of 7 to 8 November.",
            },
          ],
        };

      // -----------------------------------------------------------------
      // ENDING -- the historical terminus. Everything this text asserts as
      // fact is already load-bearing backstory in every other campaign in
      // this file; nothing here is new information, only the close-up view
      // of an event the other three treat as settled and offstage.
      // -----------------------------------------------------------------
      case "endingWinterPalaceFalls17":
        return {
          isEnding: true,
          title: "The Winter Palace Falls",
          date: "NOVEMBER 1917",
          badge: "◆ HISTORICAL RECORD",
          classification: "historical",
          epilogue:
            "Whatever this Cabinet did differently through the summer, the rising does not move. The Kornilov Affair's real casualty was never the general's advance, which dissolved in three days without much of a fight -- it was the last plausible argument that this government still had the right's confidence and the left's cooperation at the same time. Arming the Soviet's Red Guards to stop Kornilov left several thousand rifles in Bolshevik-organized hands that were never collected back, and a Petrograd Soviet whose Bolshevik share of seats, negligible in May, is now a majority. On the night of 6–7 November the Military Revolutionary Committee -- a Soviet body, not this Cabinet's -- takes the telephone exchange, the State Bank, the bridges, and the Winter Palace itself by the early hours of 8 November, with barely a shot fired in its actual defense. Kerensky is already gone, driving south in a borrowed car to find loyal troops that mostly do not exist anymore.\n\nEverything the rest of this file's campaigns take as their own opening backstory starts here: the Council of People's Commissars formed that same week; the Constituent Assembly elected in November and dissolved by force in January when it returns a non-Bolshevik majority; Brest-Litovsk signed in March, ceding a quarter of the empire to end a war this government spent this whole campaign trying to keep fighting; and, within weeks of that peace, the civil war that the Armed Forces of South Russia, the Siberian government, and the Revolutionary Military Council fight through 1922. None of that changes no matter how well or badly this Cabinet is played. What changes is only how much warning the men who found the Volunteer Army in the Don that winter had, and how isolated a government it was that fell." +
            (flags.kornilovAffairChoice === "refusedRedGuards" && flags.kornilovOutcome === "garrisonHeld"
              ? "\n\nThe Soviet's Red Guards were never actually armed for this crisis, in this branch -- the garrison held on its own, on the same railway refusals that happened in the record. It changes remarkably little about the rising. The Bolsheviks' rifles come from elsewhere over the following two months regardless, and a Soviet Executive Committee that watched this Cabinet decline its help once, and survive anyway, extends noticeably less benefit of the doubt the second time its cooperation is asked for."
              : "") +
            (flags.armyPolicy === "withheld"
              ? "\n\nThe committees never accepted the May order that confined them to supply and welfare. In November the regiments in the capital took their instructions from the Soviet's own committee."
              : "") +
            (flags.conferenceChoice === "directory_continues"
              ? "\n\nThe Directory never gave way to a wider cabinet. The Pre-Parliament that sat in October advised a government it had not chosen."
              : "") +
            (flags.octoberChoice === "strike_first"
              ? "\n\nIn this telling the cabinet ordered the Military Revolutionary Committee arrested on 6 November. The cadets could not carry the order out, and the Palace fell on the same night as in the record."
              : flags.octoberChoice === "stake_on_vote"
              ? "\n\nIn this telling the cabinet put its fate to a vote of the Pre-Parliament. The debate lasted the afternoon, and the Palace fell that night."
              : ""),
        };

      // -----------------------------------------------------------------
      // ENDING -- the one genuinely open counterfactual this campaign
      // carries. Reached only via the "refuse the Red Guards" branch AND an
      // unlucky roll (or via hard mode's Decree Capital running out).
      // Deliberately explicit that this is not a "better" outcome for
      // anyone in it, and that it erases the premise the other three
      // campaigns in this file are built on -- said outright, not implied.
      // -----------------------------------------------------------------
      case "endingKornilovsRepublic17":
        return {
          isEnding: true,
          title: "The General's Republic",
          date: "SEPTEMBER 1917",
          badge: "◇ SPECULATIVE -- DOWNSTREAM OF DIVERGENCE",
          classification: "speculative",
          epilogue:
            "Krymov's Third Cavalry Corps was perhaps fifteen thousand men against a capital of over two million -- the real historical margin was that thin, and it held on railway refusals and soldier committees that simply declined to fight, not on any garrison actually stopping the advance by force. Take the Soviet's Red Guards out of the defense and that thin margin does not hold. Krymov's Cossacks reach central Petrograd; Kornilov, following behind, is not arrested at Mogilev but is in the capital inside the week, and this Cabinet is not the government that survives the encounter.\n\nWhat forms afterward is not the historical dictatorship the word 'Bonapartist' was already being used to warn against that same month -- Kornilov's own program, so far as he ever stated one plainly, was closer to a military-backed government of national unity than personal rule, with the death penalty and labor conscription he'd wanted since taking command extended well past the front. Kerensky's own fate in this branch is unresolved by anything the record can settle: arrested alongside the rest of the Cabinet is the most likely outcome contemporaries would have expected, though nothing here should be read as claiming more certainty about that than the record actually supports.\n\nSay plainly what this branch means for the rest of this file: it does not happen. There is no Bolshevik seizure of power in November, because the Petrograd Soviet that would have staged it has just watched a military government take the capital by force with the left's own militia unable or unwilling to stop it. No Council of People's Commissars, no Brest-Litovsk, no Constituent Assembly dissolved by a Bolshevik decree instead of a Cossack one. Whatever civil war follows a Kornilov government's attempt to actually govern a country still fighting a war it cannot win is not the war the Armed Forces of South Russia, the Siberian government, or the Revolutionary Military Council in this file were built to fight -- it is a different war, against a different opponent, that this file does not contain. That is not a coy way of saying 'to be continued.' It means this branch's ending is genuinely the end of what this file can tell you about what happens next.",
        };

      // -----------------------------------------------------------------
      // HARD MODE ENDING -- reached when the fifth point of Decree Capital is spent, at whatever
      // report the player is on. Not a historical event: the record shows the government losing the
      // Soviet's confidence by degrees, never breaking with it in form.
      case "endingDecreeCabinet17":
        return {
          isEnding: true,
          title: "The Cabinet That Governed Alone",
          date: "DATE VARIES: THE FIFTH DECREE",
          badge: "◇ SPECULATIVE -- HARD MODE",
          classification: "speculative",
          epilogue:
            "A modeled alternative. The cabinet takes its fifth emergency decree without the consent of the Soviet Executive Committee. Each earlier decree had a reason that could be written down: the army, the railways, the presses. The fifth has none that the Executive Committee accepts, and it stops sending delegates to the cabinet. From that day the government rules by ministerial order in Petrograd and nowhere else, and the regiments of the garrison take their orders from the Soviet.\n\nThis is not what happened. In the record the government never broke with the Soviet in form. It lost the Soviet's confidence between May and November, a little at a time. No source says what a formal break would have led to.",
        };

      default:
        return null;
    }
  },
};

