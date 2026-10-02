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
    date: "OCTOBER 1917",
    title: "The Winter Palace Falls",
    note:
      "The historical terminus, not a defeat this command can avert by playing well -- every choice in this campaign shapes how isolated the government is by October, not whether October happens. That's deliberate: a version of this campaign where good play prevents the Bolshevik seizure of power would contradict what every other campaign in this file already treats as settled fact.",
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
    maxEndingId: "endingKornilovsRepublic17",
  },

  NEWSPAPER_MASTHEAD: "VESTNIK VREMENNOGO PRAVITELSTVA",
  NEWSPAPER_SUBHEAD: "Herald of the Provisional Government -- as read at the Mariinsky Palace",

  ADVISOR_DOSSIERS: {
    kerensky: {
      role: "Minister of War, later Minister-Chairman",
      bio:
        "A lawyer and Duma deputy before 1917, the only man to hold high office simultaneously in the Provisional Government and, in its first months, as a deputy chairman of the Petrograd Soviet -- dual power's contradictions embodied in one person rather than argued between two institutions. Became Minister of War in the first coalition formed after this campaign's opening crisis, then Minister-Chairman from July after the second.",
      fate:
        "Fled Petrograd by car on 25 October (7 November NS) to rally General Krasnov's Cossacks at the front; the counter-attack collapsed at Pulkovo within days, and he never returned to Russian soil in a position of power. Lived another fifty-three years in exile, mostly in France and the United States, and died in New York in 1970 -- long enough to see nearly the entire war this file's other campaigns describe fought and finished.",
      faction: "Provisional Government, Coalition Cabinet",
      rank: 0,
    },
    kornilov: {
      role: "Supreme Commander-in-Chief (from 19 July/1 August 1917)",
      bio:
        "An escaped Austrian prisoner of war with a real battlefield reputation, appointed Supreme Commander by Kerensky himself after the June Offensive's collapse, on Kornilov's own condition that the government back restoring the death penalty and formal discipline at the front. What exactly Kerensky authorized before Kornilov's own advance on Petrograd in late August is still disputed -- an intermediary, Vladimir Lvov, carried proposals between them that each man afterward described differently, and whether this was a deliberate coup from the start or a plan Kerensky first encouraged and then publicly recast as mutiny is a real historians' argument, not settled the way the coup's failure itself is.",
      fate:
        "Arrested and held with the other generals implicated at Bykhov Monastery, under a guard lenient enough that he escaped in the chaos of the Bolshevik seizure of power that November, disguised as a Turkoman soldier. Made his way south to the Don. See the Armed Forces of South Russia campaign for what he does next -- and how it ends.",
      faction: "Supreme Command, Army General Staff",
      rank: 0,
    },
    tsereteli: {
      role: "Petrograd Soviet Executive Committee; Minister of Posts and Telegraphs, later Interior",
      bio:
        "A Georgian Menshevik released from Siberian exile in March 1917, and the real architect of the coalition this campaign's opening crisis produces -- the leading voice of 'revolutionary defencism' (hold the front, seek a negotiated peace without annexations, and work with the Provisional Government rather than against it) against the Soviet's own more radical minority. The government's ability to speak with the Soviet's actual majority at all runs through him more than through Kerensky.",
      fate:
        "Opposed the July rising as recklessness that could only help the government's enemies, then opposed the Bolshevik seizure of power in October just as firmly. Left Russia in 1921 after the Georgian Menshevik republic he helped lead was itself overrun by the Red Army, and died in exile in New York in 1959.",
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
  },

  NODE_ATLAS: [
    { id: "aprilCrisis17", date: "APRIL 1917", title: "Petrograd: The Note That Became Public" },
    { id: "juneOffensive17", date: "JUNE 1917", title: "The Southwestern Front: An Offensive With a Government's Name On It" },
    { id: "julyDays17", date: "JULY 1917", title: "Petrograd: The Days the Machine Guns Came Out" },
    { id: "kornilovAffair17", date: "AUGUST 1917", title: "Petrograd: The General's Trains" },
  ],
  NODE_TOTAL: 4,
  ENDINGS_GALLERY: [
    { id: "endingWinterPalaceFalls17", title: "The Winter Palace Falls", classification: "historical" },
    { id: "endingKornilovsRepublic17", title: "The General's Republic", classification: "speculative" },
  ],
  ENDING_CLASSIFICATION: {
    endingWinterPalaceFalls17: "historical",
    endingKornilovsRepublic17: "speculative",
  },

  resolveNode(nodeId, flags = {}, meters = {}) {
    switch (nodeId) {
      // -----------------------------------------------------------------
      case "aprilCrisis17":
        return {
          date: "APRIL 1917",
          title: "Petrograd: The Note That Became Public",
          bulletin: {
            headline: "AN EMPIRE ENDS WITHOUT A COMMAND STRUCTURE TO END IT",
            body:
              "Nine weeks ago there was a Tsar. The abdication itself -- 2 March, at Pskov, after five days of strikes, a garrison mutiny, and a Duma committee that formed to fill the vacuum before anyone had decided it should -- wasn't a decision this government made; it inherited the result. Power split on arrival between this Cabinet, appointed by the old Duma's committee, and the Petrograd Soviet of Workers' and Soldiers' Deputies, elected in the same chaotic week and controlling the garrison, the railways, and the printing presses this government needs to be obeyed at all. Neither side calls the other illegitimate. Neither side can act without the other's cooperation, either.",
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
                quote: "I have not lied to the Allies about what we intend. I am being asked to lie to them instead, and to call the lie clarification. I would rather resign than sign my name to it.",
              },
              historical: false,
              setFlags: { aprilCrisisChoice: "standFirm" },
              impact: { authority: -2, sovietRelations: -3 },
              next: "juneOffensive17",
              outcome:
                "The note stands as written. The demonstrations don't stop; they harden, and the officer counter-demonstration hardens with them. Miliukov keeps his portfolio for now, at the cost of a Soviet Executive Committee that no longer takes this Cabinet's public commitments at face value.",
            },
            {
              label: "Accept the Soviet's terms: clarify the note's language, and bring Soviet-aligned socialists into the Cabinet itself rather than governing over their objections.",
              advisor: {
                name: "Tsereteli",
                quote: "A coalition is not a concession. It is the only version of this government that can actually issue an order and have it obeyed past the palace gates. I would rather share the Cabinet than keep the whole of it and none of the authority that comes with it.",
              },
              historical: true,
              setFlags: { aprilCrisisChoice: "coalition" },
              impact: {},
              next: "juneOffensive17",
              outcome:
                "Miliukov and War Minister Guchkov resign within days. On 5 May a reorganized coalition cabinet is sworn in with six socialist ministers, Kerensky moving from Justice to War among them -- the first time the Soviet's own people sit in the government rather than merely supervising it from outside.",
            },
          ],
        };

      // -----------------------------------------------------------------
      // Reached by both aprilCrisis17 choices with no flags-conditional
      // branch here — check-continuity.js flags this every run, and it's a
      // deliberate, accepted convergence, not a gap: this is a 4-node
      // chain, not a wide tree, and April's choice is already read forward
      // (see julyDays17's situation text) rather than forked into two
      // separate versions of June that would say the same thing anyway.
      case "juneOffensive17":
        return {
          date: "JUNE 1917",
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
            "As the new War Minister, you campaigned across the front for this offensive personally, on the argument that Russia keeps its seat among the Allies -- and its claim on any postwar settlement -- only by fighting, not merely by surviving. The Southwestern Front attacks at dawn on 18 June. The first two days go well: real ground, real prisoners. What happens after that is not yet written.",
          choices: [
            {
              label: "Commit the reserves forward the moment the initial advance succeeds, to turn a local gain into an actual breakthrough before the front stabilizes again.",
              advisor: {
                name: "Kerensky",
                quote: "I did not spend three weeks telling exhausted men why this offensive matters so that we could stop the day it started working. A gain we don't press is a gain we'll have spent for nothing at all.",
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
                      "The German-Austrian counterattack on 6 July still breaks the front near Tarnopol, exactly as it did in the record -- committing the reserve doesn't change that. It does mean the retreat that follows is a retreat, with formations still answering to their officers, rather than the wholesale collapse the same counterattack produced where units had already stopped listening to anyone.",
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
                name: "General Kornilov",
                quote: "An army this ready to stop fighting on its own does not get better with caution. Every day this offensive doesn't visibly succeed is a day the men decide for themselves that it already failed.",
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
              ? " The coalition that never formed in April is being felt now: there is no socialist minister in this room whose own presence might have kept the Soviet's moderate majority talking instead of watching the streets to see who wins."
              : ""),
          choices: [
            {
              label: "Bring in loyal front-line units to clear the streets, arrest the Bolshevik leadership reachable in the city, and shut down the Party's press -- but stop short of an outright ban on the party itself.",
              advisor: {
                name: "Tsereteli",
                quote: "Breaking the rising is not the same decision as outlawing every man who marched in it. One is restoring order the Soviet's own moderate majority already wants restored. The other makes martyrs of people this government may need to still be talking to in a month.",
              },
              historical: true,
              setFlags: { julyDaysChoice: "targetedCrackdown" },
              impact: { sovietRelations: 1, frontDiscipline: -1 },
              next: "kornilovAffair17",
              outcome:
                "Loyalist units restore order within days. Trotsky is arrested; Lenin, warned in time, goes into hiding and crosses into Finland within days, not returning to the city until October. The Bolshevik press is shut down for a matter of weeks, not permanently, and the party itself is never formally outlawed -- a targeted defeat, not an eradication.",
            },
            {
              label: "Use the moment to move against the Bolshevik party as an organization outright -- outlaw it, not merely its individual leaders, while the rising has discredited it in front of the Soviet's own moderate majority.",
              advisor: {
                name: "Kerensky",
                quote: "I understand the argument for restraint. I am less persuaded of it every week this party spends organizing against a government it has no intention of ever recognizing as legitimate.",
              },
              historical: false,
              gate: (m) => m.authority >= -3,
              disabledReason:
                "the Cabinet's own authority to make a decree like this actually stick is already too thin -- an outright ban announced by a government this weak reads as a threat it cannot enforce, not a real one.",
              setFlags: { julyDaysChoice: "outrightBan" },
              impact: { sovietRelations: -3, authority: 1 },
              next: "kornilovAffair17",
              outcome:
                "The ban is issued. It costs the Soviet Executive Committee's own patience more than it costs the Bolsheviks any real capacity -- a party used to operating illegally under the old regime does not stop existing because this government's decree says it should, and the moderate socialists whose cooperation this Cabinet needs for everything else now have their own reasons to wonder what 'temporary emergency measure' will be reached for next.",
            },
          ],
        };

      // -----------------------------------------------------------------
      case "kornilovAffair17":
        return {
          date: "AUGUST 1917",
          title: "Petrograd: The General's Trains",
          bulletin: {
            headline: "THE COMMANDER YOU APPOINTED IS MOVING ON THE CAPITAL",
            body:
              "Six weeks ago you made Kornilov Supreme Commander yourself, over the objections of the Soviet's own left, because the front needed someone the officer corps still believed in. What passed between you and him through the intermediary Lvov this past week -- an agreed plan to suppress a Bolshevik rising nobody has actually staged yet, or a coup you encouraged and are now publicly disowning -- is a question the two of you will spend the rest of your lives answering differently. What isn't in dispute: General Krymov's Third Cavalry Corps is moving on Petrograd by rail, and you have just publicly dismissed Kornilov and called it mutiny." +
              (flags.offensiveChoice === "pressForward"
                ? " Kornilov's own case for the appointment always ran through June -- that a War Minister who pressed the offensive forward understood, as he did, that an army without discipline stops being an army. He is, in effect, invoking your own June decision against you now."
                : " Kornilov never had much use for the June Offensive's caution, and says so to anyone who asks -- an army you preferred to consolidate rather than push, in his account, is exactly the kind of army you're now relying on to stop him."),
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
                quote: "You are asking whether arming them is dangerous. It is. The alternative is finding out in person whether Krymov's corps stops itself, and I do not like that answer any better.",
              },
              historical: true,
              impact: {},
              next: "endingWinterPalaceFalls17",
              outcome:
                "Word is enough. Railway workers refuse to move Krymov's trains; soldiers' committees the general is counting on send delegations to negotiate instead of fighting. The advance dissolves without a real battle, over three days, and Kornilov is arrested at Mogilev. Nobody had to test whether the Red Guards you just armed would give the weapons back.",
            },
            {
              label: "Refuse the Soviet's Red Guards. Rely on whatever units still answer directly to this government, and try to negotiate Kornilov down instead.",
              advisor: {
                name: "Kerensky",
                quote: "I removed one general this month for exceeding his authority. I am not eager to arm the men most likely to decide, having stopped him, that they don't need to hand the rifles back to a government that only trusted them once.",
              },
              historical: false,
              gate: (m) => m.sovietRelations >= -6 && m.frontDiscipline >= -2,
              disabledReason:
                "there is no longer a loyal garrison left to rely on instead -- every choice that damaged relations with the Soviet also cost the units that were never going to fight for this government without the Soviet's own backing behind the order, and a front that's already come apart doesn't leave a garrison worth relying on regardless.",
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
                    next: "endingWinterPalaceFalls17",
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
      // ENDING -- the historical terminus. Everything this text asserts as
      // fact is already load-bearing backstory in every other campaign in
      // this file; nothing here is new information, only the close-up view
      // of an event the other three treat as settled and offstage.
      // -----------------------------------------------------------------
      case "endingWinterPalaceFalls17":
        return {
          isEnding: true,
          title: "The Winter Palace Falls",
          date: "OCTOBER 1917",
          badge: "◆ HISTORICAL RECORD",
          classification: "historical",
          epilogue:
            "Whatever this Cabinet did differently through the summer, October does not move. The Kornilov Affair's real casualty was never the general's advance, which dissolved in three days without much of a fight -- it was the last plausible argument that this government still had the right's confidence and the left's cooperation at the same time. Arming the Soviet's Red Guards to stop Kornilov left several thousand rifles in Bolshevik-organized hands that were never collected back, and a Petrograd Soviet whose Bolshevik share of seats, negligible in April, is now a majority. On the night of 24-25 October the Military Revolutionary Committee -- a Soviet body, not this Cabinet's -- takes the telephone exchange, the State Bank, the bridges, and the Winter Palace itself by the early hours of the 26th, with barely a shot fired in its actual defense. Kerensky is already gone, driving south in a borrowed car to find loyal troops that mostly do not exist anymore.\n\nEverything the rest of this file's campaigns take as their own opening backstory starts here: the Council of People's Commissars formed that same week; the Constituent Assembly elected in November and dissolved by force in January when it returns a non-Bolshevik majority; Brest-Litovsk signed in March, ceding a quarter of the empire to end a war this government spent this whole campaign trying to keep fighting; and, within weeks of that peace, the civil war that the Armed Forces of South Russia, the Siberian government, and the Revolutionary Military Council fight through 1922. None of that changes no matter how well or badly this Cabinet is played. What changes is only how much warning the men who found the Volunteer Army in the Don that winter had, and how isolated a government it was that fell." +
            (flags.kornilovAffairChoice === "refusedRedGuards" && flags.kornilovOutcome === "garrisonHeld"
              ? "\n\nThe Soviet's Red Guards were never actually armed for this crisis, in this branch -- the garrison held on its own, on the same railway refusals that happened in the record. It changes remarkably little about October. The Bolsheviks' rifles come from elsewhere over the following two months regardless, and a Soviet Executive Committee that watched this Cabinet decline its help once, and survive anyway, extends noticeably less benefit of the doubt the second time its cooperation is asked for."
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
          date: "AUGUST 1917",
          badge: "◇ SPECULATIVE -- DOWNSTREAM OF DIVERGENCE",
          classification: "speculative",
          epilogue:
            "Krymov's Third Cavalry Corps was perhaps fifteen thousand men against a capital of over two million -- the real historical margin was that thin, and it held on railway refusals and soldier committees that simply declined to fight, not on any garrison actually stopping the advance by force. Take the Soviet's Red Guards out of the defense and that thin margin does not hold. Krymov's Cossacks reach central Petrograd; Kornilov, following behind, is not arrested at Mogilev but is in the capital inside the week, and this Cabinet is not the government that survives the encounter.\n\nWhat forms afterward is not the historical dictatorship the word 'Bonapartist' was already being used to warn against that same month -- Kornilov's own program, so far as he ever stated one plainly, was closer to a military-backed government of national unity than personal rule, with the death penalty and labor conscription he'd wanted since taking command extended well past the front. Kerensky's own fate in this branch is unresolved by anything the record can settle: arrested alongside the rest of the Cabinet is the most likely outcome contemporaries would have expected, though nothing here should be read as claiming more certainty about that than the record actually supports.\n\nSay plainly what this branch means for the rest of this file: it does not happen. There is no Bolshevik seizure of power in October, because the Petrograd Soviet that would have staged it has just watched a military government take the capital by force with the left's own militia unable or unwilling to stop it. No Council of People's Commissars, no Brest-Litovsk, no Constituent Assembly dissolved by a Bolshevik decree instead of a Cossack one. Whatever civil war follows a Kornilov government's attempt to actually govern a country still fighting a war it cannot win is not the war the Armed Forces of South Russia, the Siberian government, or the Revolutionary Military Council in this file were built to fight -- it is a different war, against a different opponent, that this file does not contain. That is not a coy way of saying 'to be continued.' It means this branch's ending is genuinely the end of what this file can tell you about what happens next.",
        };

      default:
        return null;
    }
  },
};

