  allied: {
    id: "allied",
    seal: "SHAEF",
    name: "Allied Combined Chiefs",
    dates: "1940 — 1945",
    brief: "Direct the Western Allied war effort from Europe First to the halt on the Elbe. The industrial arithmetic favors you — the real fights are with your own coalition partner.",
    accent: "#2f4a3a",
    dynamic: true,
    start: "narvik40",
    resolveNode(id, flags, meters) {
      const nodes = {
        get narvik40() {
          return {
          date: "APRIL 1940",
          title: "Narvik",
          historicalRecord: true,
          situation:
            "Germany has invaded Norway, racing British planning that had reached nearly the same conclusion independently — both sides understood the ice-free port of Narvik and its Swedish iron ore as worth fighting over. British, French, and Polish forces land to retake the port, and by late May they in fact succeed — the first Allied land victory of the war, however briefly held. Whether Narvik can be taken isn't in doubt. Whether it can be held is, and for how long, while a much larger German attack is beginning to unfold eight hundred miles south through the Ardennes." +
            (flags.legacyEasternFront === "advancing"
              ? "\n\n[Grand Campaign] History will eventually record an Eastern Front that gives Berlin no rest once it opens — years away yet, and no comfort at all to the men holding a fjord today, but the war this command is about to fight will be shaped by a German army that never gets to fight it with its whole strength."
              : flags.legacyEasternFront === "grinding"
              ? "\n\n[Grand Campaign] History will eventually record an Eastern Front that costs Berlin dearly but never quite breaks it open — years away yet, but the war this command is about to fight will be against a German army that got to keep more of what it had."
              : "") +
            (flags.forkNarvikHeld
              ? " The garrison's own reports this week are more confident than expected — German counter-landings meant to dislodge them have so far failed, and the port itself hasn't changed hands again since the initial fighting."
              : ""),
          choices: [
            {
              label: "Hold Narvik and reinforce it — the iron ore route matters enough to commit further",
              advisor: { name: "Ironside", quote: "We have just won the first land battle of this war. I am reluctant to hand that back over a rumor from the Belgian frontier." },
              historical: false,
              setFlags: { narvik40: "hold" },
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "dunkirk40",
              outcome:
                "Holding Narvik denies Germany the port and the ore route a while longer, at the direct cost of troops and shipping the far larger crisis unfolding in France and the Low Countries will want back within days. The historical evacuation happened for a reason that doesn't go away just because this campaign lets you delay it — the trade only gets worse the longer it's deferred.",
            },
            {
              label: "Evacuate Narvik immediately — France is the crisis that actually decides this war",
              advisor: { name: "Churchill", quote: "We have proven the point and taken the port. Now we need every ship and every man for the battle that is about to matter." },
              historical: true,
              setFlags: { narvik40: "evacuate" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "dunkirk40",
              outcome:
                "Narvik's garrison — including the first Allied land victory of the war, won just weeks earlier — is evacuated within days of the German breakthrough further south, the port demolished behind them so Germany inherits rubble rather than a working supply line. It reads, and was treated at the time, as a retreat. It freed exactly the ships and troops that the war's actual crisis, unfolding on the Channel coast, was about to need far more urgently.",
            },
          ],
          };
        },

        get dunkirk40() {
          return {
          date: "MAY 1940",
          title: "Dunkirk",
          historicalRecord: true,
          situation:
            "Poland fell in weeks. Denmark and Norway are occupied. Now France is broken open — German panzers have reached the Channel coast, and the entire British Expeditionary Force, alongside the remains of the French First Army, is pinned against the sea at Dunkirk with no way out by land. The Royal Navy can lift men off the beaches. It cannot lift tanks, guns, or the war material an army needs to fight again. The question the War Cabinet actually faces isn't whether to evacuate — it's how much to risk doing it, and what happens to the French units who can't all be taken too." +
            (flags.narvik40 === "hold"
              ? " Some of the ships and men this crisis needs are still off Norway, spent holding a port this same War Cabinet is about to learn it can no longer afford to have committed anything to."
              : "") +
            (flags.forkNarvikHeld
              ? " Norway, unusually, is not the drain on ships and attention it might have been — the garrison there is still holding on its own, and this crisis is not competing with it for the fleet's time."
              : ""),
          choices: [
            {
              label: "Full evacuation effort — every available vessel, civilian and military, risk the fleet to save the army",
              advisor: { name: "Churchill", quote: "Wars are not won by evacuations. But this one will not be lost if the army that fights again is the army we save this week." },
              historical: true,
              setFlags: { dunkirk40: "full" },
              impact: { manpower: 2, fuel: -1, initiative: 0 },
              next: "halifaxCrisis40",
              outcome:
                "Operation Dynamo lifts over 338,000 men off the beaches and mole in nine days — British and French alike — using everything from destroyers to requisitioned civilian pleasure boats, under sustained Luftwaffe attack the whole time. Almost none of the heavy equipment survives; the BEF that reaches England is an army with no tanks and precious little artillery. It is, by any strict military accounting, a catastrophe. Britain treats it as something closer to a founding myth, and has ever since.",
            },
            {
              label: "Prioritize the professional core — save the trained divisions first, accept a smaller total lift",
              advisor: { name: "Gort", quote: "I would rather bring home the men who can train the next army than gamble the fleet trying to save every gun that can be replaced." },
              historical: false,
              setFlags: { dunkirk40: "prioritized" },
              impact: { manpower: -1, fuel: 1, initiative: 0 },
              next: "halifaxCrisis40",
              outcome:
                "A smaller total lift, weighted toward experienced regular divisions over reservists and territorials, at less risk to the Navy's destroyer force — several of which were lost historically to Stuka attacks close inshore. Fewer men come home. The ones who do are disproportionately the officers and NCOs the next army will really be built around.",
            },
          ],
          };
        },

        get halifaxCrisis40() {
          return {
          date: "LATE MAY 1940",
          title: "The War Cabinet Crisis",
          historicalRecord: true,
          situation:
            "With the BEF still coming off the beaches and France's collapse only weeks away, the War Cabinet meets repeatedly over three days to argue about something that has never been put to the British public: whether to explore peace terms. Lord Halifax, the Foreign Secretary, argues that a approach through Mussolini — still nominally neutral — should at least be tested, while Britain still has an army and a fleet to negotiate with rather than nothing at all. Churchill, six days into the job as Prime Minister, argues the opposite: that any approach at all signals weakness Hitler will exploit, and that the only real choice is to fight on. Chamberlain's vote, still carrying real weight in the party, is the one neither man can predict.",
          choices: [
            {
              label: "Reject any negotiation outright — Britain fights on, whatever the terms might have been",
              advisor: { name: "Churchill", quote: "Nations which go down fighting rise again, and those which surrender tamely are finished. We shall go on to the end." },
              historical: true,
              setFlags: { halifaxCrisis40: "reject" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "battleOfBritain40",
              outcome:
                "What happened, and decisively: Churchill's position carries the Cabinet, Chamberlain's support swings behind him rather than Halifax, and the approach through Mussolini is never made. Within days the argument is effectively over. What Britain actually gets for fighting on is eighteen months entirely alone — no American troops, no Soviet alliance, just the Battle of Britain, the Blitz, and a war that does not become winnable in any concrete sense until December 1941 changes everything at once.",
            },
            {
              label: "Authorize Halifax to quietly test terms through Rome, without committing to anything",
              advisor: { name: "Halifax", quote: "I am not proposing surrender. I am proposing that we find out what is actually on offer before we commit an empire to finding out the hard way." },
              historical: false,
              setFlags: { halifaxCrisis40: "explore" },
              cohesionDelta: -1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "battleOfBritain40",
              // Hidden-information choice: the situation text says Chamberlain's vote "is the one
              // neither man can predict" — concealRoll keeps that real for the player too,
              // revealing the true odds only on the OutcomeScreen after the choice resolves.
              concealRoll: true,
              uncertain: [
                {
                  weight: 25,
                  title: "The exploration goes further than intended before it collapses",
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  outcome:
                    "The disputed version of how close this in truth came: the quiet approach through Rome develops enough momentum that word begins to reach beyond the War Cabinet's own room, and Churchill has to spend real political capital shutting it down rather than simply winning an internal argument. It is shut down regardless — no historian seriously argues Hitler's actual terms in 1940 were ever acceptable, or that the Cabinet would have accepted them if tested — but the affair leaves Churchill's early premiership visibly less secure than the historical record's cleaner version suggests.",
                },
                {
                  weight: 75,
                  title: "It goes nowhere, quickly",
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  outcome:
                    "The likelier reading, and close to what the historical record actually shows: the exploration is raised, argued over for the same three days, and then dropped — Chamberlain's support moves to Churchill, Halifax does not resign over it, and the whole episode stays contained to the room it happened in. The war proceeds exactly as it did. What differs is smaller and more private: a marginally more cautious Churchill, a marginally less certain Cabinet, for a war that was never actually going to end here regardless.",
                },
              ],
            },
          ],
          };
        },

        get battleOfBritain40() {
          return {
          date: "SUMMER–AUTUMN 1940",
          title: "The Big Wing Question",
          historicalRecord: true,
          situation:
            "The Luftwaffe is attacking in strength, and Fighter Command's own senior officers are in open disagreement about how to meet it. No. 11 Group, covering the southeast where the raids in fact arrive, favors Air Vice-Marshal Park's approach — scramble smaller formations fast, meet the bombers as far forward as possible, minimize the warning time the enemy gets to work with. No. 12 Group's Leigh-Mallory, backed by the already-famous Douglas Bader, argues for massing three or five squadrons into a single 'Big Wing' before engaging — more concentrated firepower once it arrives, at the cost of the extra minutes it takes to assemble in the air." +
            (flags.forkLuftwaffeShift
              ? " One thing is different from the history books already: the expected German shift from airfields to city targets hasn't happened. Raids are still concentrated squarely on Fighter Command's own sector stations, week after week, with no sign yet of the switch that historically bought this exact command some breathing room."
              : ""),
          choices: [
            {
              label: "Back Park's doctrine — fast, forward, dispersed interception",
              advisor: { name: "Dowding", quote: "Park's pilots are in the air over Kent while Leigh-Mallory's wing is still forming over Duxford. I will not trade our only asset — warning time — for a prettier formation." },
              historical: true,
              setFlags: { battleOfBritain40: "park" },
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "europeFirst42",
              // Round 21 (2026-10-05, Craig: the Battle of Britain as the second Allied Order of
              // Battle, chosen over Dunkirk). The day modeled is 15 September 1940, the one on
              // which Park committed every squadron of 11 Group. Same pattern as Sedan and
              // Moscow: a new uncertain[] whose first outcome is the text that used to be this
              // choice's own. Facts verified 2026-10-05 (Wikipedia: Battle of Britain Day; Keith
              // Park; Dowding system; Hugh Dowding; Trafford Leigh-Mallory): the morning raid was
              // 25 Do 17s with about 120 Bf 109s; Park scrambled nine squadrons at about 11:15
              // and the Duxford Wing (five squadrons from 12 Group) at 11:20; the afternoon raid
              // was 114 bombers with about 350 fighters and came about three hours later; 276
              // RAF fighters met 475 German aircraft, with 185 fighters in 19 squadrons ready;
              // Churchill at Uxbridge asked at about 14:35 "What other reserves have we?" and
              // Park answered "There are none"; cloud between 2,000 and 12,000 feet hid the
              // targets; the British claimed 77 bombers and 29 fighters, far more than were lost;
              // Dowding was replaced on 24 November 1940 and Park on 7 December 1940, with
              // Leigh-Mallory taking over 11 Group.
              keyBattleSubgame: {
                id: "britainDay40",
                title: "Order of Battle — Battle of Britain Day",
                flavor:
                  "15 September 1940. The Luftwaffe has been flying against Fighter Command for two months, and today it will come in two waves, with the biggest escort yet. Park runs No. 11 Group from the operations room at Uxbridge, on a plot that Chain Home radar and the Observer Corps feed through Bentley Priory, and Churchill is on the viewing gallery behind him. Every squadron is in a state of readiness and the whole of 11 Group will be needed. What's decided here is how the staff effort behind Park's doctrine is weighted: how much of the fight is left to 11 Group's own squadrons, how much to the plot and the controllers who place them, whether 12 Group's Duxford Wing is called in early, and how fast squadrons are turned round on the ground between the waves, for a second raid that is already forming.",
                categories: [
                  { id: "squadrons", name: "11 Group Squadrons", meter: "manpower", glyph: "✈✈" },
                  { id: "control", name: "Radar & Ground Control", meter: "initiative", glyph: "◎" },
                  { id: "wing", name: "The Duxford Wing", meter: "fuel", glyph: "≋" },
                  { id: "turnaround", name: "Rearm & Refuel Turnaround", meter: "fuel", glyph: "↻" },
                ],
                // Squadrons highest — Park's doctrine is that the squadrons themselves do the
                // fighting; Control second — the plot is what lets a few squadrons do the work of
                // many; Turnaround third — essential but unglamorous; Wing lowest, deliberately —
                // the Duxford Wing was real and arrived, but a wing of five squadrons takes time
                // to form and this doctrine does not wait for it.
                effectiveness: { squadrons: 2.5, control: 2.3, wing: 1.7, turnaround: 1.9 },
                categoryContext: {
                  squadrons:
                    "Park's squadrons are the fighters that meet the raids over Kent and London. His doctrine is to send them up fast, forward, and in squadron strength. Each commitment here puts more of them into the air at the first warning.",
                  control:
                    "The plot at Uxbridge is built from radar, the Observer Corps and the filter room at Bentley Priory, and it tells the controllers where each raid is going. Each commitment here keeps that picture sharper and the squadrons better placed.",
                  wing:
                    "No. 12 Group's Duxford Wing, five squadrons strong, can fly south to cover London while 11 Group meets the first blow. Each commitment here gets it into the air sooner and over the capital in good time.",
                  turnaround:
                    "A squadron that has landed is worth nothing until it is refuelled and rearmed, and a second raid is coming. Each commitment here gets more of them back into the air before the second wave arrives.",
                },
                flashups: {
                  squadrons: [
                    "A pair of Hurricanes from a sector station climbs hard for altitude over the Kent coast.",
                    "A squadron of Spitfires comes down out of the sun onto the rear of a bomber formation.",
                    "Park's squadrons break up a formation of Dorniers before it reaches the capital.",
                    "A section is scrambled the moment the plot shows a new raid forming.",
                    "A squadron leader leads his men in head-on at a formation of bombers.",
                  ],
                  control: [
                    "A controller at Uxbridge turns a squadron onto a raid that is still twenty miles away.",
                    "The plot shows the raid turning north, and the squadrons are told before the pilots can see it.",
                    "An Observer Corps post reports a formation by sound in the cloud.",
                    "The filter room corrects a track and a squadron is put onto it at once.",
                    "A sector controller gives a vector and a height, and the squadron finds the bombers where he said.",
                  ],
                  wing: [
                    "The Duxford Wing forms up over its airfield, five squadrons in a long line.",
                    "The wing flies south toward London at twenty thousand feet.",
                    "A wing of Hurricanes and Spitfires comes down on a German formation over the Thames.",
                    "The wing leader reports that the raid is bigger than the plot said.",
                    "The wing turns for home, short of fuel, after a long chase.",
                  ],
                  turnaround: [
                    "Ground crews swarm over a Hurricane as it taxis in, rearming and refuelling it in minutes.",
                    "A squadron lands, and every pilot goes straight to his aircraft.",
                    "A fuel bowser races across a sector airfield between two landings.",
                    "A flight is airborne again forty minutes after it landed.",
                    "The armourers run short of belts and a lorry is sent for more.",
                  ],
                },
                reportTimes: { open: "0900", contact: "1100", cats: ["1115", "1200", "1245", "1330"], reserve: "1435", counter: "1500" },
                idleLines: {
                  squadrons: [
                    "No more squadrons are sent to meet the raid forward. They wait for the bombers over London.",
                    "11 Group's squadrons stay at readiness on the ground, and the first raid arrives unchallenged.",
                  ],
                  control: [
                    "No extra effort goes into the plot, and the controllers work from the picture they have.",
                    "The controllers are left to manage the plot alone, and the squadrons are sent where the raid was.",
                  ],
                  wing: [
                    "The Duxford Wing is not called, and 12 Group's fighters stay on the ground.",
                    "Nothing is asked of the wing, and it stays on its airfield.",
                  ],
                  turnaround: [
                    "No special effort goes into turning squadrons round. They are refuelled in the usual time.",
                    "The ground crews work at their normal pace, and the squadrons are not ready any sooner.",
                  ],
                },
                verdicts: ["Fighter Command Holds the Sky", "The Day Costs More Than the System Can Spare"],
                verdictGrades: {
                  clean: "Squadrons, controllers, wing and ground crews all worked together, and the raids were turned back with the whole of Fighter Command intact.",
                  costly: "The raids are turned back, but every part of the system was stretched further than it was built to go.",
                  marginal: "The raids are held, but not cleanly. The losses run higher than the plan allowed for, and the squadrons that fought are very tired.",
                  total: "The system holds the sky by the thinnest margin, with no reserve left and every squadron committed.",
                },
                counterattack: {
                  category: "turnaround",
                  severity: { secondWave: 2, heavyEscort: 1, cloudCover: 1 },
                  warn: {
                    1: "A second formation of German bombers is forming up over the Channel coast.",
                    2: "A second, larger wave is forming up behind the first, and 11 Group's squadrons are still on the ground refuelling.",
                  },
                  results: {
                    repulsed: "The second wave is met by squadrons already back in the air and turned away before it reaches the docks.",
                    heldAtCost: "The second wave is held off, but squadrons go up with their tanks barely full and their ammunition half-loaded.",
                    broke: "The second wave breaks through to the docks, while 11 Group's squadrons are still refuelling on the ground.",
                    gaveGround: "Park pulls his squadrons back to cover the sector stations, and the second wave reaches the docks unchallenged.",
                  },
                },
              },
              uncertain: [
                {
                  weight: modWeight(70, meters.initiative) - (flags.forkLuftwaffeShift ? 10 : 0),
                  title: "Fighter Command holds the sky",
                  setFlags: { britainDay40Result: "held" },
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  outcome:
                    "What happened, and what the Air Ministry's own postwar assessment substantially vindicated: Park's squadrons met incoming raids faster and further out, at a real cost in fighters lost piecemeal that the Big Wing's advocates never stopped citing against him. Dowding and Park won the battle. Within weeks of winning it, both were removed from their commands — a political result of the argument, not a military one, and one history has judged considerably less kindly than it judged the tactics.",
                },
                {
                  weight: 100 - (modWeight(70, meters.initiative) - (flags.forkLuftwaffeShift ? 10 : 0)),
                  title: "The day costs more than the system can spare",
                  setFlags: { britainDay40Result: "strained" },
                  impact: { manpower: -2, fuel: -1, initiative: -1 },
                  outcome:
                    "The minority projection, closer than the legend admits: the raids are turned back, but the squadrons that did it are tired and the pilots who replace the losses are barely trained. Park's system still wins the sky, because no other German plan exists, but it wins it with nothing in reserve and a thin margin, and the weeks that follow ask more of Fighter Command than the victory on paper suggests. Dowding and Park still lose their commands within weeks of winning, a political result and not a military one, and the argument over the Big Wing goes on after them.",
                },
              ],
            },
            {
              label: "Authorize the Big Wing — mass the formations before engaging, even at the cost of response time",
              advisor: { name: "Leigh-Mallory", quote: "One formation of sixty aircraft breaks a raid apart. Six squadrons trickling in one at a time simply feed the enemy targets." },
              setFlags: { battleOfBritain40: "bigWing" },
              impact: { manpower: 1, fuel: -1, initiative: -1 },
              next: "europeFirst42",
              outcome:
                "A fair account of the alternative doctrine, tested in earnest and judged unfavorably by most of the historical evidence gathered since: massed interceptions did claim higher kill totals per engagement when they actually arrived in time, but 12 Group's wings were frequently still forming when 11 Group's sector airfields were already being hit — the assembly time the doctrine required was time the raids didn't wait for. Bader's own claimed kill counts were later found significantly inflated, a detail that complicated the doctrine's reputation for decades after the battle it was meant to win.",
            },
          ],
          };
        },

        get europeFirst42() {
          return {
          date: "JANUARY 1942",
          title: "Europe First",
          historicalRecord: true,
          situation:
            "Pearl Harbor has American public opinion leaning hard toward avenging Japan directly — but Roosevelt and Churchill agreed in principle back in 1941 that Germany, not Japan, is the more dangerous long-term threat: greater industrial capacity, closer to the resources that could make it nearly unbeatable if given time. Admiral King, commanding the US Navy, is not fully persuaded — the Pacific is a naval war, and the Navy is not eager to watch its ships and marines go begging while the Army builds up in Britain for a landing that won't happen for years." +
            (flags.forkLuftwaffeShift
              ? " Fighter Command's own losses from that summer are still being felt in the squadron rosters going into this planning — a quieter cost than history's version paid, but a real one, and the sort of thing that argues for Britain needing the American buildup sooner rather than later."
              : "") +
            // Round 21 (Battle of Britain Day echo): fifteen months on, so only the neglected arm
            // or the commander's mark is written, never a line about the day's own events.
            (flags.battleOfBritain40 === "park"
              ? (flags.britainDay40Result === "strained" ? " Fighter Command came through that September with nothing in reserve, and the pilots it has now are still too few and too new." : "") +
                keyBattleEcho("britainDayLater", flags, "britainDay40")
              : ""),
          choices: [
            {
              label: "Confirm Europe First — the bulk of resources flow to the Atlantic and Europe",
              advisor: { name: "Marshall", quote: "Germany is the head of the snake. Everything else is the tail — dangerous, but not what kills the alliance if left alone too long." },
              historical: true,
              setFlags: { europeFirst42: "confirm", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "atlanticConvoys42",
              outcome:
                "The harder sell was political rather than strategic — planners on both sides agreed on Germany's priority — but King's Navy still fought a real internal battle for Pacific resources throughout 1942, winning enough to keep Guadalcanal and the Solomons campaign resourced without formally reversing the Europe First commitment.",
            },
            {
              label: "Split resources evenly — answer American public opinion with a genuine two-theater push",
              advisor: { name: "King", quote: "The public wants Japan answered and I do not disagree with the public. A war fought entirely on the Army's schedule is a war the Navy pays for twice." },
              setFlags: { europeFirst42: "split", cohesion: (flags.cohesion || 0) + (-1) },
              cohesionDelta: -1,
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: "atlanticConvoys42",
              outcome:
                "One considered account of the road not taken: splitting resources evenly satisfies the political pressure to answer Japan directly, at the cost of slowing the European buildup that both Roosevelt and Churchill privately agreed had to come first. Every division and ship sent to the Pacific this year is a division and ship the cross-Channel timetable does not have.",
            },
          ],
        };
        },
        get atlanticConvoys42() {
          return {
          date: "1942",
          title: "The Battle of the Atlantic",
          historicalRecord: true,
          situation:
            "U-boat wolfpacks are sinking Allied shipping faster than American and British yards can replace it — 1942 will end as the worst year of the tonnage war. Two scarce assets could tip the balance: very-long-range aircraft that can finally close the mid-Atlantic 'air gap' where no land-based cover reaches, and the codebreaking effort at Bletchley Park, which has recovered the ability to read German naval Enigma traffic but risks losing that advantage the moment German intelligence suspects their codes are compromised by unexplained convoy diversions.",
          choices: [
            {
              label: "Divert Bomber Command aircraft to close the air gap, over Harris's strong objection",
              advisor: { name: "Horton", quote: "Bomber Command wants every aircraft it can get for Germany's cities. I want twenty of them for the one stretch of ocean where no aircraft at all is currently flying. I do not consider this a close argument." },
              setFlags: { atlanticAir42: "diverted" },
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: "pq17_1942",
              outcome:
                "A speculative reading of the resourcing fight the Admiralty and Bomber Command actually had, resolved here in the Navy's favor a year earlier than the historical compromise arrived at it. Closing the air gap sooner measurably shortens the worst of 1942's shipping losses — at the direct cost of bombs Harris insists could have been falling on German industry instead, a trade this campaign cannot adjudicate cleanly either way.",
            },
            {
              label: "Rely on Ultra intelligence and existing escorts — hold the aircraft for the bomber offensive",
              advisor: { name: "Harris", quote: "Give the Navy every aircraft it asks for and there will be no bomber offensive left to argue about. Convoys are defense. Bombers are how this war really ends." },
              historical: true,
              setFlags: { atlanticAir42: "held" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "pq17_1942",
              uncertain: [
                {
                  weight: modWeight(78, meters.fuel),
                  title: "The codebreak holds",
                  impact: { manpower: -1, fuel: -1, initiative: 0 },
                  outcome:
                    "What happened, substantially — the air gap closed slowly through 1942 and into 1943, with codebreaking rather than aircraft numbers doing much of the early work of routing convoys around wolfpacks. B-Dienst suspected the security of naval Enigma more than once and never conclusively proved it. It came at a real cost: 1942 remained the Battle of the Atlantic's worst year for tonnage lost, easing only once escort carriers and VLR aircraft both arrived in 1943.",
                },
                {
                  weight: 100 - modWeight(78, meters.fuel),
                  title: "A blackout scare",
                  impact: { manpower: -1, fuel: -2, initiative: 0 },
                  outcome:
                    "The genuine anxiety behind the historical policy is realized rather than merely felt: German suspicion of compromised naval traffic hardens enough to force a temporary cipher change, and convoy routing goes dark for weeks exactly when the tonnage war can least afford it. Bletchley Park recovers the traffic eventually, as it always did — but the gap it leaves is paid for in ships that would otherwise have been routed around the wolfpacks.",
                },
              ],
            },
          ],
        };
        },
        get pq17_1942() {
          return {
          date: "JULY 4, 1942",
          title: "Convoy PQ-17",
          historicalRecord: false,
          situation:
            "Thirty-five merchant ships, laden with tanks, aircraft, and matériel bound for Murmansk under the Lend-Lease agreement, are two days from the most dangerous stretch of the run — within range of Luftwaffe bases in northern Norway and, First Sea Lord Pound's intelligence now suggests, moving into contact with a German surface raiding group built around the battleship Tirpitz, sortied from her fjord anchorage. What that intelligence cannot say with confidence is Tirpitz's exact position, or whether the sortie is even still underway — naval reconnaissance in these waters is patchy at best, and Pound has to decide the convoy's fate on an estimate, not a fix.",
          choices: [
            {
              label: "Scatter the convoy and withdraw the close escort — disperse against the battleship threat",
              advisor: { name: "Pound", quote: "A convoy is a single target for a ship that outguns everything sailing with it. Scattered, at least, they are thirty-five problems instead of one catastrophe. I would rather be wrong about dispersal than right about what stays behind to find out." },
              historical: true,
              setFlags: { pq17: "scatter" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "pacificPressure42",
              outcome:
                "What actually happened, and it goes about as badly as a decision made on uncertain intelligence can: Tirpitz, in fact, never presses the attack — German naval command recalls her once reconnaissance confirms the convoy has scattered, wary of risking their last major surface unit against submarines and aircraft for a diminished, dispersed target. What the scatter order actually accomplishes is stripping the convoy of any organized defense against the threat that was always the real one: U-boats and Luftwaffe torpedo bombers, working over undefended stragglers for the better part of a week. Twenty-four of thirty-five ships are sunk. Arctic convoys to the Soviet Union are suspended for months afterward, at exactly the point in the war Stalin's armies most need the material still sitting in Iceland and Scotland waiting for a route judged safe enough to sail.",
            },
            {
              label: "Hold the convoy together — keep tight formation and full escort, and accept the battleship risk",
              advisor: { name: "Tovey", quote: "We are proposing to strip these ships of every defense they have against the threat we can actually see, on the strength of a threat we cannot. I would rather escort them into a fight that might not come than abandon them to the one that certainly will." },
              checkLabel: "Fuel",
              disabledReason: meters.fuel <= -3 ? "insufficient fuel left to keep a full close escort sailing with the convoy rather than dispersing it" : undefined,
              setFlags: { pq17: "hold" },
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: "pacificPressure42",
              // Hidden-information choice — the flagship case this type was built for: the
              // situation text says outright that Pound "has to decide... on an estimate, not a
              // fix." concealRoll keeps that literally true for the player too, withholding the
              // odds until the post-hoc reveal on the OutcomeScreen.
              // Key Battle Subgame, battle #9 (round 15, "getting 10 battles"). Same
              // unconditional-add pattern as Kursk, Monte Cassino, Anzio, and Arnhem (uncertain[]
              // already existed on this choice before the subgame, so keyBattleSubgame is added
              // directly rather than spread behind KEY_BATTLE_SUBGAME_ENABLED — shipped builds
              // never read keyBattleSubgame at all, and check-battle-balance.js/
              // check-reachability.js both evaluate with the flag false, so the shipped graph is
              // unaffected either way). The uncertain[] array below, its weight, and both
              // branches' own outcome text are left exactly as they were — the battleship threat
              // they resolve is a separate question from the sustained U-boat/air attack this
              // subgame models on the same convoy, during the same voyage.
              //
              // Attached here rather than on atlanticConvoys42's own choices deliberately: that
              // earlier node is a resourcing and intelligence-security decision (divert VLR
              // aircraft, or risk Ultra's security), not a tactical engagement — nothing in it
              // resembles a convoy actually fighting off an attack. PQ-17's own voyage is the
              // real, dated, documented naval battle in this arc, the same reasoning that put
              // Monte Cassino's subgame on Monte Marrone rather than the abbey assault the node
              // named it after. Bespoke naval-archetype categories, distinct from Anzio's
              // amphibious and Arnhem's airborne sets. All facts verified 2026-09-25 (Wikipedia,
              // Convoy PQ 17): the close escort (Commander Jack Broome, Senior Officer of the
              // Escort) numbered six destroyers, two anti-aircraft auxiliary cruisers (Palomares
              // and Pozarica), corvettes, minesweepers, and armed trawlers; the covering force
              // further out, under Rear-Admiral Louis Hamilton (1st Cruiser Squadron: British
              // cruisers London and Norfolk, American cruisers Wichita and Tuscaloosa, plus
              // destroyers), stayed back from the convoy itself, screening against the battleship
              // threat rather than the convoy's immediate U-boat and air attackers; and the
              // voyage ran 27 June - 10 July 1942.
              concealRoll: true,
              keyBattleSubgame: {
                id: "pq17_1942",
                title: "Order of Battle — Holding the Convoy Together",
                flavor:
                  "Tight formation, full escort, the battleship risk accepted rather than scattering to face it in the open — the convoy holds together, which means Broome's destroyers and corvettes still have something worth defending as long as the ships stay in company. What's decided here is how the close escort, the anti-aircraft auxiliaries riding with the merchantmen, Hamilton's covering force standing off at a distance, and the signals effort tracking what's actually out there are weighed against each other before the wolfpacks and the torpedo bombers find the convoy's track.",
                categories: [
                  { id: "escorts", name: "Destroyer & Corvette Screen", meter: "manpower", glyph: "▲" },
                  { id: "aaShips", name: "Anti-Aircraft Auxiliaries", meter: "manpower", glyph: "✦" },
                  { id: "coveringForce", name: "Distant Covering Force", meter: "fuel", glyph: "≋" },
                  { id: "intelligence", name: "Signals Intelligence", meter: "fuel", glyph: "✎" },
                ],
                // Escorts highest — the close screen is the convoy's own direct defense against
                // U-boats; Covering Force second — real deterrent weight, but held back rather
                // than committed to the convoy's own fight; AA Auxiliaries third — necessary and
                // real, but two ships covering thirty-five; Intelligence lowest, deliberately —
                // real value in routing around known contacts, but it doesn't sink a U-boat or
                // down a torpedo bomber by itself, the same design choice as Anzio's Naval or
                // Arnhem's Supply Drop.
                effectiveness: { escorts: 2.6, coveringForce: 2.2, aaShips: 2.0, intelligence: 1.6 },
                categoryContext: {
                  escorts:
                    "Broome commands six destroyers and the corvette screen — the entire close protection between wolfpacks and thirty-five loaded ships. Every gun added here is a gun actually on the convoy's perimeter.",
                  aaShips:
                    "Palomares and Pozarica are the only vessels in this convoy built to fight torpedo bombers. Norway is close enough for the Luftwaffe to reach in strength. Two ships. That's the inventory.",
                  coveringForce:
                    "Hamilton's cruisers are stationed to watch for Tirpitz — close enough to matter if she commits, far enough back they're not fighting the convoy's own battle. Weight here is insurance against the threat no one can quite see.",
                  intelligence:
                    "Direction-finding plots and decrypted signals are the only way to learn where the wolfpacks gather before they're on top of the convoy. Intelligence spent here means the convoy steers around what's coming instead of just answering it.",
                },
                flashups: {
                  escorts: [
                    "A corvette drops a pattern of depth charges on a firm contact off the convoy's beam.",
                    "One of Broome's destroyers closes a straggler to shepherd it back into the column.",
                    "A trawler's asdic operator reports a contact fading below the layer.",
                    "The destroyer screen tightens as the convoy alters course together.",
                    "A corvette rescues survivors from a torpedoed merchantman's boats.",
                  ],
                  aaShips: [
                    "Pozarica's guns put up a curtain of fire as torpedo bombers come in low.",
                    "Palomares claims a hit on an He 111 breaking off its run trailing smoke.",
                    "A merchantman's own gun crew joins the barrage against a low pass.",
                    "The AA ships shift position to cover the column's most exposed flank.",
                    "A torpedo bomber presses its attack through the flak and misses astern.",
                  ],
                  coveringForce: [
                    "Hamilton's cruisers alter course to stay between the convoy's track and the fjords.",
                    "A cruiser's scout plane sweeps the horizon for any sign of Tirpitz putting to sea.",
                    "The covering force holds position, visible on radar, too far to engage today.",
                    "A destroyer detaches from the covering force to investigate a radar contact.",
                    "The cruiser squadron reports no change in the surface threat picture.",
                  ],
                  intelligence: [
                    "A direction-finding fix puts a wolfpack forming well south of the convoy's track.",
                    "A decrypt gives the convoy a few hours' warning before a shadowing aircraft finds it.",
                    "The plot room updates the convoy's course to open the distance from a reported contact.",
                    "An intercepted signal confirms a U-boat has lost contact overnight.",
                    "A fix on a shadowing aircraft lets the escort work out roughly when it will report again.",
                  ],
                },
                reportTimes: { open: "0600", contact: "0900", cats: ["1200", "1500", "1800", "2100"], reserve: "2300", counter: "0100" },
                idleLines: {
                  escorts: [
                    "The screen holds its stations and nothing more. No extra weight goes to the perimeter.",
                    "No destroyer breaks formation to chase a contact. The screen stays exactly as thin as it started.",
                  ],
                  aaShips: [
                    "The AA auxiliaries hold their positions. Nothing extra is done to thicken the flak.",
                    "No additional fire discipline is drilled into the merchant gun crews today.",
                  ],
                  coveringForce: [
                    "Hamilton's cruisers hold their distant station, unchanged. Nothing more is asked of them.",
                    "The covering force stays exactly where it already was, watching and no closer.",
                  ],
                  intelligence: [
                    "No extra effort goes into the plot. The convoy sails on its existing course, blind to what's forming.",
                    "The direction-finding watch stays at its existing pace. Nothing new comes out of it today.",
                  ],
                },
                verdicts: ["The Convoy Holds Its Course", "The Wolfpack Finds the Gaps"],
                verdictGrades: {
                  clean: "The screen, the flak, the covering force, and the plot room all held together at once — everything the convoy could ask of an escort this size.",
                  costly: "The convoy holds together, but every ship in company paid more than the plan allowed for to keep it that way.",
                  marginal: "The convoy takes losses it shouldn't have. It's still in company by nightfall, which is not nothing.",
                  total: "The convoy's own discipline doesn't break so much as never get tested properly — the losses are what there is to show for the day.",
                },
                counterattack: {
                  category: "escorts",
                  severity: { wolfpackConcentration: 2, luftwaffeStrike: 1, distantShadow: 1 },
                  warn: {
                    1: "Hydrophone effect is reported on multiple bearings around the convoy's track.",
                    2: "Multiple U-boats are closing on the convoy in what looks like a coordinated pack attack.",
                  },
                  results: {
                    repulsed: "The pack attack is broken up before it presses home, and the convoy sails on in company.",
                    heldAtCost: "The convoy holds together, at the cost of ships the escort couldn't cover in time.",
                    broke: "The pack presses home through the screen and the convoy takes losses it can't make good.",
                    gaveGround: "The escort pulls the column into a tighter, slower formation rather than fight the pack out where it struck.",
                  },
                },
              },
              uncertain: [
                {
                  weight: 78,
                  title: "The battleship threat doesn't materialize",
                  impact: { manpower: 1, fuel: 0, initiative: 0 },
                  outcome:
                    "The bet Tovey's argument implicitly made pays off: Tirpitz's actual sortie, brief and cautious, never presses close enough to threaten a convoy still sailing under organized escort, and German naval command recalls her for the same reasons they historically did — reluctance to risk a capital ship against a defended target. Held together, PQ-17 fights off U-boats and air attack the way convoys are actually built to, at real but survivable cost, and the material reaches Murmansk months earlier than the historical suspension allowed.",
                },
                {
                  weight: 22,
                  title: "The battleship threat is real, and the escort can't stop it",
                  impact: { manpower: -3, fuel: -1, initiative: -1 },
                  outcome:
                    "The rarer, harder case, and the one Pound's historical fear was never actually irrational to hold: Tirpitz does press the attack, and a convoy escort built for submarines and aircraft has no real answer for a battleship's main guns. Losses are severe, concentrated in minutes rather than spread across a week — a different catastrophe than the historical scatter produced, but not obviously a smaller one, and a stark demonstration of exactly the risk the historical order was written to avoid.",
                },
              ],
            },
          ],
        };
        },
        get australiaLifeline42() {
          return {
          date: "LATE 1942",
          title: "The Threatened Lifeline",
          historicalRecord: false,
          situation:
            "The completed Japanese airfield does exactly what King warned it would: land-based bombers now range over the sea lanes feeding Australia, and shipping losses on that route are climbing in a way MacArthur's own staff describes as approaching seriously dangerous. Europe First still holds as declared policy. What's actually being decided now is smaller and more urgent — how much, quietly, gets diverted to a theater the policy says shouldn't need it.",
          choices: [
            {
              label: "Quietly divert escort carriers and long-range aircraft anyway — Europe First survives the paperwork, not the practice",
              advisor: { name: "King", quote: "I said this would happen. I am not interested in being right about it instead of fixing it." },
              historical: false,
              setFlags: { australiaLifeline42: "divert" },
              cohesionDelta: -1,
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: "secondFront42",
              outcome:
                "The pragmatic answer that costs the policy its own credibility to save the lifeline it was never actually built to threaten: escort assets move quietly to the Pacific, the shipping route stabilizes, and Europe First survives as a phrase in the official record while the practice underneath it bends considerably further than the historical version ever needed to.",
            },
            {
              label: "Hold firm — accept the shipping losses as the declared policy's actual price",
              advisor: { name: "Marshall", quote: "We already decided what this policy costs when we adopted it. Discovering the bill is larger than expected is not a reason to stop paying it." },
              setFlags: { australiaLifeline42: "hold" },
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: "secondFront42",
              outcome:
                "The disciplined answer, and the harder one to in truth live with: shipping losses on the Australia route continue at a rate closer to dangerous than the historical campaign ever let them reach, on the theory that a policy which bends every time it costs something was never really a policy. Europe First holds exactly as declared — at a price this campaign does not pretend was free to pay.",
            },
          ],
          };
        },

        get secondFront42() {
          return {
          date: "1942",
          title: "Where the Second Front Opens",
          historicalRecord: true,
          situation:
            "The alliance's first real fracture line: Stalin is demanding a second front in Europe now, to draw German divisions off the eastern front where the Soviet Union is absorbing the overwhelming majority of the war's land casualties. General Marshall wants to answer that demand directly — a cross-Channel landing as early as 1942 (Sledgehammer) or 1943 (Roundup), concentrating Anglo-American strength against the shortest road to Germany. Churchill and General Brooke want the opposite: North Africa first (Torch), judging any 1942 cross-Channel attempt a premature disaster against a still-undefeated Wehrmacht with nowhere near enough landing craft or trained divisions assembled." +
            (meters.fuel <= -2
              ? " Marshall's answer to Stalin isn't actually available this year regardless of who wins the argument — there isn't the landing craft or shipping assembled for a cross-Channel attempt this early, whatever the alliance's politics might prefer."
              : ""),
          choices: [
            {
              label: "Marshall's plan — commit to the earliest possible cross-Channel invasion",
              advisor: { name: "Marshall", quote: "Every month we delay the real invasion is a month the Germans spend finishing the Atlantic Wall and a month the Russians spend wondering if this alliance means what it says." },
              checkLabel: "Fuel",
              disabledReason: meters.fuel <= -2 ? "insufficient landing craft and shipping assembled for a cross-Channel attempt this early" : undefined,
              setFlags: { secondFront42: "sledgehammer", cohesion: (flags.cohesion || 0) + (-2) },
              cohesionDelta: -2,
              impact: { manpower: -3, fuel: -1, initiative: 1 },
              next: "dieppe42",
              outcome:
                "The likely shape of the plan Marshall really pushed for and lost. Most postwar assessments side with Churchill and Brooke here: American forces in 1942 were green, landing craft were desperately short, and German divisions in France were not yet the hollowed-out garrison force of 1944. A 1942 landing attempted at anything like Sledgehammer's scale risks a catastrophe on the order of Dieppe, at army scale rather than raid scale.",
            },
            {
              label: "Churchill's plan — North Africa first, build toward the Mediterranean",
              advisor: { name: "Churchill", quote: "I will not throw an army into France to prove our sincerity to Stalin and watch it drown in the Channel for the gesture." },
              historical: true,
              setFlags: { secondFront42: "torch", cohesion: (flags.cohesion || 0) + (0) },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "dieppe42",
              outcome:
                "Operation Torch landed in French North Africa in November 1942, giving American troops a lower-stakes combat education against a weaker opponent while the cross-Channel buildup continued in Britain. It also opened the Mediterranean question this campaign will keep returning to — Italy, and how much of the war's remaining timetable it is worth spending there.",
            },
          ],
        };
        },
        get untestedDoctrine44() {
          return {
          date: "EARLY 1944",
          title: "Planning Without Dieppe's Data",
          historicalRecord: false,
          situation:
            "Overlord's planners are working from theory where the historical planners had Dieppe's expensive, specific answers: how naval gunfire actually performs against a defended coast, how quickly specialized armor is needed on the beach rather than behind it, how badly an under-supported frontal assault can go wrong in ways a staff exercise doesn't reveal. None of that data exists on this path. Planning around its absence is the actual task.",
          choices: [
            {
              label: "Over-insure everything the missing data might have covered — more bombardment, more specialized armor, more time",
              advisor: { name: "Montgomery", quote: "We do not know what Dieppe would have told us. So we assume the worst version of every answer, and build accordingly. It costs time. It costs less than guessing wrong on the day." },
              historical: false,
              setFlags: { untestedDoctrine44: "overinsure" },
              impact: { manpower: 1, fuel: -1, initiative: -1 },
              next: "overlordPrep44",
              outcome:
                "The cautious answer to a genuine planning gap: without Dieppe's specific lessons to calibrate against, Overlord's staff builds in margin everywhere the missing data might have mattered — more naval gunfire time, more specialized armor variants, more schedule. It costs the preparation additional months and resources the historical timeline didn't need to spend, insurance against questions nobody can now answer with confidence rather than blood.",
            },
            {
              label: "Trust the existing doctrine — theory and smaller exercises are enough to plan from",
              advisor: { name: "Eisenhower", quote: "We have raided smaller ports and studied every account the enemy's own propaganda gave us of the ones that failed. I am not convinced one more data point changes what the plan already assumes." },
              historical: false,
              setFlags: { untestedDoctrine44: "trust" },
              impact: { manpower: -1, fuel: 0, initiative: -1 },
              next: "overlordPrep44",
              outcome:
                "The leaner answer: Overlord proceeds on essentially the historical schedule, built from the same doctrine the historical planners assembled partly from Dieppe and partly from everything else they already knew. Whether the missing data point would have changed anything meaningful is a question this campaign leaves open — the historical invasion succeeded with the lesson included, and nothing here proves the lesson was the reason.",
            },
          ],
          };
        },

        get darlanDeal42() {
          return {
          date: "NOVEMBER 1942",
          title: "The Darlan Deal",
          historicalRecord: true,
          situation:
            "Operation Torch has landed in French North Africa, and Vichy French forces — honestly uncertain whether to treat the Allies as liberators or invaders — have fought back hard enough in places to cost real casualties before resistance breaks down." +
            (flags.secondFront42 === "sledgehammer"
              ? " Marshall's push for an early cross-Channel landing lost the argument this year regardless of how directly this command pressed it — Churchill's Mediterranean-first case carried the alliance's actual planning, and North Africa is the landing that happened instead."
              : flags.secondFront42 === "torch"
              ? " This is the plan this command actually argued for and got: North Africa first, the cross-Channel question deferred to a year with the landing craft and trained divisions to answer it properly."
              : "") +
            " By accident of presence, Admiral François Darlan, Vichy's naval commander-in-chief and a man with a real collaborationist record, is in Algiers when the landings happen. He offers to order a ceasefire across French North Africa in exchange for being recognized as the region's political authority. It ends the fighting immediately. It also means installing, as the Allies' own partner, a senior official of the government Free France exists to oppose.",
          choices: [
            {
              label: "Accept the deal — Darlan's ceasefire order saves lives today, whatever it costs politically",
              advisor: { name: "Eisenhower", quote: "I am fighting a war, not auditioning a government. If this man's signature stops French soldiers from dying for a country I did not come here to occupy, I am not too proud to use it." },
              historical: true,
              setFlags: { darlanDeal42: "accept" },
              cohesionDelta: -1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "casablanca43",
              outcome:
                "What happened, and it caused a real political storm on both sides of the Atlantic: the ceasefire holds within hours, French North Africa's fighting ends, and Eisenhower's own reputation absorbs weeks of press coverage over deal-making with a Vichy admiral. De Gaulle's Free French movement is, correctly, furious at being passed over for a man they consider a collaborator. The controversy resolves itself in a way no planner arranged: Darlan is assassinated by a young French monarchist in December, weeks after the deal is struck, and the question of what to do with him becomes moot before the Allies had to answer it themselves.",
            },
            {
              label: "Refuse Darlan's terms — deal only with Free French authorities, whatever the fighting costs",
              advisor: { name: "de Gaulle", quote: "You are asking France to accept, as her liberator's chosen partner, a man who spent two years serving the government that surrendered her. I decline to help you explain that to my countrymen." },
              setFlags: { darlanDeal42: "refuse" },
              cohesionDelta: 1,
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "casablanca43",
              uncertain: [
                {
                  weight: 35,
                  title: "Resistance collapses quickly regardless",
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  outcome:
                    "The more forgiving reading of a real toss-up: without Darlan's ceasefire order, French resistance in North Africa still recognizes the landings as decided within days rather than weeks — local commanders reach their own accommodations once the outcome is clearly no longer in doubt. It spares Eisenhower the controversy of legitimizing a Vichy official at a real but modest cost in additional fighting.",
                },
                {
                  weight: 65,
                  title: "Resistance holds out hard",
                  impact: { manpower: -1, fuel: 0, initiative: 1 },
                  outcome:
                    "The harder reading, and the one Darlan's actual ceasefire order was specifically credited with avoiding: without a single authority to order a stand-down, resistance continues unit by unit, at a real cost in Allied and French casualties the historical deal specifically prevented. It spares Eisenhower the controversy of legitimizing a Vichy official, and it costs Free French relations nothing at the moment those relations are already fragile. Whether the political capital saved was worth the additional lives spent taking it the harder way is exactly the trade the historical decision was criticized, from both directions, for making.",
                },
              ],
            },
          ],
          };
        },

        get casablanca43() {
          return {
          date: "JANUARY 1943",
          title: "Casablanca — Unconditional Surrender",
          historicalRecord: true,
          situation:
            "Roosevelt and Churchill meet at Casablanca to set the alliance's terms for the rest of the war. Roosevelt proposes, and Churchill accepts, a declared policy of unconditional surrender — no negotiated peace with Germany, Italy, or Japan under any government, a clean break from the armistice that ended the previous war and left room for the stab-in-the-back myth that helped bring Hitler to power. Some of Roosevelt's own advisors worry the policy will stiffen German resistance by removing any incentive to negotiate a regime change from within; others argue that ambiguity is exactly the mistake that made 1918 politically survivable for the officers who started the war in the first place." +
            (flags.halifaxCrisis40 === "explore"
              ? " There is a real irony sitting under this declaration that nobody at the table raises aloud: this same alliance's own leadership tested the alternative once before, in the desperate days of 1940, before Churchill's position ultimately carried the argument regardless — a fact the unconditional-surrender doctrine now being written down would prefer the historical record not dwell on."
              : ""),
          choices: [
            {
              label: "Declare unconditional surrender as the alliance's fixed policy",
              advisor: { name: "Roosevelt", quote: "We are not going to leave this war the way the last one ended — with an argument, thirty years later, about whether the army was really beaten in the field. This time there will be no argument." },
              historical: true,
              setFlags: { casablanca43: "unconditional" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "resistanceContact44",
              outcome:
                "What happened, and it becomes the fact standing behind nearly every German command decision for the rest of this war's parallel files — no separate peace, no negotiated exit, regardless of who holds power in Berlin. Historians remain divided on whether the policy meaningfully lengthened German resistance by foreclosing any internal incentive to negotiate a change of government; what is not disputed is that it held for the rest of the war on the Allied side without exception. Whether it holds the first time it's actually tested is the next real question.",
            },
            {
              label: "Leave room for negotiated terms with a non-Nazi German government",
              advisor: { name: "Eden", quote: "If there is a general in Berlin willing to remove Hitler and end this on terms short of total ruin, I would rather have left him a door than a wall." },
              setFlags: { casablanca43: "conditional" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "resistanceContact44",
              outcome:
                "A fair projection of the road not taken: leaving diplomatic room for a negotiated peace with an internal German opposition might, in theory, incentivize a coup attempt earlier or with broader support than the historical July 1944 plot managed. Most historians are skeptical this actually changes much — the regime's grip on the military's loyalty oath system was strong enough that ambiguous Allied terms are unlikely to have been the deciding factor for officers who otherwise stayed loyal. Whether that skepticism survives an actual approach is the next real question.",
            },
          ],
        };
        },
        get resistanceContact44() {
          return {
          date: "1944",
          title: "The Door, Tested",
          historicalRecord: true,
          situation:
            "Allen Dulles's OSS station in Bern has been quietly maintained as a listening post since 1942, and it is now receiving exactly the kind of approach the Casablanca policy was designed to answer in advance: intermediaries connected to German resistance and intelligence circles, testing whether Washington's 'no negotiation' position is truly absolute or merely the public posture. This is not a hypothetical — real contacts of this kind did reach Allied intelligence through Switzerland and Sweden across 1943 and 1944, seeking everything from information exchange to genuine political cover for a change of German government. What Bern reports back, and what Washington and London do with it, tests whether Casablanca's declared policy survives contact with an actual approach or only ever applied to hypothetical ones." +
            (flags.casablanca43 === "conditional"
              ? " The declared room for a non-Nazi government's negotiated terms makes this contact's next question sharper, not softer: if the door was left open, this is the moment to find out whether anyone is willing to walk through it."
              : ""),
          choices: [
            {
              label: "Maintain the contact for intelligence value only — no political commitments, ever",
              advisor: { name: "Dulles", quote: "I did not open this channel to negotiate. I opened it to listen. What I hear is worth keeping regardless of what Casablanca says we're allowed to offer in return." },
              historical: true,
              setFlags: { resistanceContact44: "intelligence" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "bomberDirective43",
              outcome:
                "What actually happened, in substance if not in every particular: contacts like this one were maintained and their information used, without ever crossing into the political negotiation Casablanca had foreclosed. It's a real answer to the question the policy was designed to answer in advance — the door stayed actually shut to terms, even while the intelligence value of keeping the conversation going was real and was taken.",
            },
            {
              label: "Quietly explore what a change of German government might actually be offered",
              advisor: { name: "a State Department cable, unsigned", quote: "The policy is public. This conversation does not need to be. We can learn what's possible without committing to anything Casablanca hasn't already ruled out in daylight." },
              historical: false,
              setFlags: { resistanceContact44: "explore" },
              favor: -1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "bomberDirective43",
              outcome:
                "The road Eden's own argument at Casablanca imagined, tested rather than merely proposed: quietly exploring terms beneath a public policy that rules them out is a real diplomatic risk — discovery costs coalition trust with a Soviet partner already suspicious of separate Western dealings — for information that, on the historical record of similar contacts, rarely produced anything more concrete than continued conversation. The exploration happens. What it's actually worth remains, honestly, an open question this campaign can't resolve for you.",
            },
          ],
        };
        },
        get sicilyHusky43() {
          return {
          date: "JULY – AUGUST 1943",
          title: "Sicily and the Messina Escape",
          historicalRecord: true,
          situation:
            "Operation Husky lands in Sicily in July, and the island is largely secured within weeks — but as Patton's Seventh Army and Montgomery's Eighth Army race each other toward Messina from different directions, roughly 100,000 German and Italian troops, along with a substantial amount of their heavy equipment, are evacuating across the narrow strait to the Italian mainland largely unmolested. Allied naval and air commanders have the resources to interdict the strait far more heavily than they currently are." +
            (flags.pointblank43 === "precision" ? keyBattleEcho("bomberDirective43", flags) : ""),
          choices: [
            {
              label: "Redirect naval and air assets to seal the Strait of Messina",
              advisor: { name: "Cunningham", quote: "We are racing each other to an empty city while the army we are supposed to be destroying rows across three miles of water in full view of anyone who cares to look." },
              setFlags: { messina43: "sealed", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
              impact: { manpower: 1, fuel: -1, initiative: 1 },
              next: flags.hardMode ? "tehran43" : "italyOrOverlord43",
              outcome:
                "A heavier interdiction effort plausibly traps a meaningful fraction of the roughly 100,000 troops who historically escaped to fight again on the Italian mainland — Kesselring's defense of Italy, already stubborn, would have that many fewer veteran troops to build it with. The naval and air assets this requires are real ones the historical campaign spent chasing the race to Messina itself instead.",
            },
            {
              label: "Continue the race for Messina as planned — let the evacuation continue",
              advisor: { name: "Montgomery", quote: "I intend to be in Messina before Patton. I am aware that is not the same thing as winning the campaign, and I intend to be in Messina before him anyway." },
              historical: true,
              setFlags: { messina43: "escaped", cohesion: (flags.cohesion || 0) + (-1) },
              cohesionDelta: -1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: flags.hardMode ? "tehran43" : "italyOrOverlord43",
              outcome:
                "What happened, and it is one of the more consistently criticized Allied command decisions of the Mediterranean war: the Patton–Montgomery rivalry for the symbolic prize of Messina left the strait itself under-resourced, and the German-organized evacuation moved some 100,000 men and much of their heavy equipment across largely intact — troops who then formed the core of a defense of mainland Italy that ground on for nearly two more years.",
            },
          ],
        };
        },
        get tehran43() {
          return {
          date: "NOVEMBER – DECEMBER 1943",
          title: "Tehran — The Three Meet",
          historicalRecord: true,
          situation:
            "The first meeting of all three leaders, and Stalin arrives with one question wearing many phrasings: when, exactly, is the second front — a date, a commander, a commitment that cannot be reinterpreted. Two years of Mediterranean operations have read, from Moscow, as two years of the Western Allies fighting anywhere except where it counts, and Soviet suspicion of a separate-peace West is not a debating posture; it is standing policy assumption. Churchill still carries Mediterranean alternatives in his case. What the conference commits to — and how unambiguously — sets the temperature of the alliance for the war's remainder." +
            (flags.pq17 === "scatter"
              ? " Stalin's own briefing books have not forgotten the specific grievance: a convoy scattered on incomplete intelligence, twenty-four ships lost, and months of suspended Arctic shipments at the exact point in 1942 his armies most needed what was sitting undelivered in Iceland. It is precisely the kind of concrete injury that makes an abstract promise about a second front harder to simply take on faith."
              : flags.pq17 === "hold"
              ? " The one Arctic convoy that sailed intact rather than scattering is a small, specific counterexample Stalin's delegation has not been shy about raising when the conversation turns to whether the West's promises are ever kept in full." +
                // Round 15 (battle #9 echo): only on the "hold" branch, the one where the
                // subgame was actually played.
                keyBattleEcho("pq17_1942", flags)
              : ""),
          choices: [
            {
              label: "Commit absolutely — Overlord in May, a named commander, no Mediterranean escape clauses",
              advisor: { name: "Roosevelt", quote: "Marshal Stalin has asked a plain question in front of witnesses. It gets a plain answer, or this alliance is a correspondence club." },
              historical: true,
              setFlags: { tehran43: "commit", cohesion: (flags.cohesion || 0) + (2) },
              cohesionDelta: 2,
              impact: { manpower: 0, fuel: -1, initiative: 1 },
              next: "italyOrOverlord43",
              outcome:
                "What happened, in substance: Tehran fixed Overlord for the spring, and Eisenhower's appointment followed within weeks — the unambiguous commitment Stalin had demanded since 1941, delivered at last with a date and soon a name attached. The conference marked the alliance's high-water mark of actual coordination, and Soviet planning for 1944 was built explicitly around the promise. It also marked, quietly, the point where the coalition's center of gravity finished shifting from London to Washington and Moscow — a fact Churchill felt at the table and historians have measured since.",
            },
            {
              label: "Hedge — commit in principle, preserve the Mediterranean options in the fine print",
              advisor: { name: "Churchill", quote: "I will promise the Channel with my whole heart. I merely decline to promise it with the fine print as well, while Rhodes and the Balkans still exist." },
              setFlags: { tehran43: "hedge", cohesion: (flags.cohesion || 0) + (-2) },
              cohesionDelta: -2,
              impact: { manpower: 0, fuel: 1, initiative: -1 },
              next: "italyOrOverlord43",
              outcome:
                "An honest account of the conference Churchill might have preferred: commitment in principle, flexibility in schedule, the Mediterranean file kept open. Stalin's reading of such an outcome is not speculative — his suspicion that the West intended to let the Eastern Front carry the war indefinitely was documented policy assumption, and a hedged Tehran feeds it directly. The alliance continues; its temperature drops several degrees at exactly the moment the historical conference warmed it.",
            },
          ],
        };
        },
        get italyOrOverlord43() {
          return {
          date: "LATE 1943",
          title: "The Soft Underbelly",
          historicalRecord: true,
          directive: true,
          situation:
            "Sicily has fallen and Italy has signed an armistice — but German forces immediately occupy the peninsula and the campaign grinds into exactly the mountainous, defensible terrain Allied planners feared. Churchill still calls the Mediterranean the Axis's 'soft underbelly' and wants to keep pushing north, possibly toward the Balkans. American planners increasingly see Italy as a resource drain that has already served its strategic purpose — tying down German divisions — and want everything not essential to holding the current line redirected to the buildup for the cross-Channel invasion now scheduled for 1944." +
            (flags.secondFront42 === "torch"
              ? " This is, in substance, the same argument Churchill won a year ago at the Second Front conference, fought again on new ground — the Mediterranean commitment that opened with Torch never really closed, and Italy is what it costs to keep it open a second year running."
              : flags.secondFront42 === "sledgehammer"
              ? " This is the argument Marshall thought had already been settled once, a year ago, in favor of the cross-Channel option his own plan pushed for — and it is being relitigated here on Italian ground he'd rather this command weren't still spending resources on at all."
              : ""),
          choices: [
            {
              label: "Continue the Italian campaign in strength — push north, keep German divisions pinned",
              advisor: { name: "Churchill", quote: "Italy is not a sideshow. Every division fighting us at Monte Cassino is a division that is not on the Atlantic Wall waiting for Overlord." },
              setFlags: { italy43: "continue", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "dodecanese43",
              outcome:
                "A careful extrapolation of Churchill's actual, ultimately unsuccessful argument: continued heavy investment in Italy does keep meaningful German divisions committed to the peninsula, but at a cost in landing craft, troops, and logistics that a 1944 cross-Channel invasion needs on its own tight schedule. The 'soft underbelly' turns out, as American planners warned, to be neither soft nor much of an underbelly — Italy's terrain favors defense at every river line north of Naples.",
            },
            {
              label: "Hold the current line in Italy — redirect everything else to the Overlord buildup",
              advisor: { name: "Eisenhower", quote: "Italy has done its job — it has German divisions that are not in Normandy's way. I need the landing craft it's still eating more than I need another mile of the Italian coast." },
              historical: true,
              setFlags: { italy43: "hold", cohesion: (flags.cohesion || 0) + (-1) },
              cohesionDelta: -1,
              impact: { manpower: 1, fuel: 1, initiative: -1 },
              next: "anzio44",
              outcome:
                "Close to what in fact happened — Italy continued as a grinding, under-resourced secondary front for the rest of the war precisely because its priority, correctly, dropped once Overlord's buildup began in earnest. The men fighting at Monte Cassino and Anzio through early 1944 fought a campaign that both alliance partners had already, functionally, deprioritized.",
            },
          ],
        };
        },
        get normandy44() {
          return {
          date: "AUGUST 1944",
          title: "Broad Front or Narrow Thrust",
          historicalRecord: true,
          situation:
            "The Normandy breakout has succeeded beyond most planners' expectations — German forces in France are in a rout that briefly looks like it might end the war by Christmas. Montgomery proposes a single concentrated thrust, all available fuel and supply diverted to one narrow armored spearhead — his own, north through Belgium and Holland toward the Ruhr — arguing a war-ending blow is possible now if the Allies stop advancing everywhere at once and commit fully to one place. Eisenhower's instinct, and SHAEF's standing strategy, is a broad front: every army group advancing together, no single overextended spearhead the Germans can cut off and destroy." +
            (flags.normandyDelay
              ? " That the rout arrived at all, after a week or more lost widening Omaha alone, is the part worth sitting with before Montgomery's argument gets an answer — the momentum outran its own bad start rather than being immune to it."
              : "") +
            (flags.dunkirk40 === "prioritized"
              ? " Montgomery's own case leans partly on the quality of the British veteran cadre this command chose to prioritize saving four years ago at Dunkirk — a smaller army than the historical evacuation produced, but one making exactly the confident, experienced argument that choice was meant to buy."
              : ""),
          choices: [
            {
              label: "Back Montgomery's narrow thrust — concentrate everything on one decisive spearhead",
              advisor: { name: "Montgomery", quote: "Give me the fuel every other army group is currently wasting on a broad advance that stops nowhere in particular, and I will end this war before the leaves fall." },
              historical: true,
              setFlags: { normandy44allied: "narrow", cohesion: (flags.cohesion || 0) + (-1) },
              cohesionDelta: -1,
              impact: { manpower: 0, fuel: -2, initiative: 0 },
              next: "marketGarden44",
              outcome:
                "What actually happened, in essence — SHAEF gave Montgomery enough priority to attempt Market Garden, even while formally maintaining the broad-front strategy elsewhere. The operation itself is about to test the narrow-thrust logic directly, at Arnhem's bridge.",
            },
            {
              label: "Hold Eisenhower's broad front — advance on every army group's own front simultaneously",
              advisor: { name: "Eisenhower", quote: "A single thrust that runs out of fuel two hundred miles into Germany is not a war-ending blow. It's an army group I have to rescue." },
              setFlags: { normandy44allied: "broad", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
              impact: { manpower: 2, fuel: 2, initiative: -1 },
              next: "anvilDragoon44",
              outcome:
                "No Market Garden is attempted, fuel and supply are distributed evenly across every advancing army group instead of concentrated behind one. Slower and less dramatic than the historical autumn, but it never hands the German army a single overextended spearhead to cut off — the risk Eisenhower's own doctrine was built to avoid, tested here without the one exception he historically made for Montgomery.",
            },
          ],
        };
        },
        get marketGarden44() {
          return {
          date: "SEPTEMBER 1944",
          title: "A Bridge Too Far",
          historicalRecord: true,
          situation:
            "Montgomery's plan is audacious: airborne divisions seize a chain of bridges across Holland's rivers and canals, opening a corridor for armor to cross the Rhine and outflank the Siegfried Line entirely, potentially ending the war in 1944. General Browning, who will command the airborne element, reviews the plan for the bridge at Arnhem — the furthest and most exposed of the chain — and voices a private reservation about how far the plan is reaching before giving his formal assent." +
            (flags.hardMode && (flags.cohesion || 0) <= -3
              ? " One option is already closed before the briefing starts: after everything this alliance has absorbed, SHAEF will not greenlight a plan built entirely around one field marshal's solo glory. Whatever happens at Arnhem, it will happen at a scale the coalition can survive being wrong about."
              : "") +
            (flags.normandyDelayFlagged
              ? " The Omaha report is still on file, and it says plainly that this army's margin for a plan that assumes everything goes right is thinner than the historical schedule ever had to admit." +
                // Round 13, item #9 (dev build only): a September node reacting to HOW that June
                // battle actually went, three months on — the report's own conclusion reads
                // differently depending on whether the plan barely held or came apart outright.
                (flags.omahaGrade === "total"
                  ? " Its own conclusion is blunter than the summary above lets on: the plan didn't just run late, it came apart, and only got patched back together after the fact."
                  : flags.omahaGrade === "costly"
                  ? " Its own conclusion: the plan worked, in the end, but not without paying for ground it should have taken cleaner."
                  : "")
              : "") +
            (flags.forkArnhemLucky
              ? " Aerial reconnaissance ahead of the drop zones near Arnhem has come back unusually quiet — no sign of the armor historically found refitting in the area, though planners are treating the absence with some suspicion rather than relief."
              : ""),
          choices: (() => {
            const boldGambitPossible = !(flags.hardMode && (flags.cohesion || 0) <= -3);
            const base = [];
            base.push({
              checkLabel: "Coalition Trust",
              disabledReason: boldGambitPossible ? undefined : "the coalition cannot absorb one more unilateral gambit",
              label: "Launch Market Garden as planned — full commitment to the corridor",
              advisor: { name: "Montgomery", quote: "The risk is real. The reward — a Rhine crossing and the Ruhr laid open before winter — is worth it, and I do not believe caution wins wars faster than boldness does." },
              historical: true,
              setFlags: { marketGarden44: "launched", cohesion: (flags.cohesion || 0) + (-1) },
              cohesionDelta: -1,
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "arnhemPerimeter44",
              outcome:
                "What happened, September 17th, and only the operation's opening day. The corridor's furthest bridge, at Arnhem, is not secured cleanly — 1st Airborne Division has dropped too far from its objective and landed almost on top of SS Panzer forces refitting nearby that nobody's intelligence picture flagged. Browning's private worry is about to become the operation's epitaph. What the nine days that follow actually cost, and to whom, is the next real question this campaign asks rather than skips past.",
            });
            base.push({
              label: "Scale the plan back — seize the nearer bridges only, leave Arnhem for a slower, supported advance",
              advisor: { name: "Browning", quote: "I have looked at the distance to that last bridge and the strength dug in around it. I would rather hold three bridges than risk losing the division reaching for a fourth." },
              setFlags: { marketGarden44: "scaled", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
              impact: { manpower: 2, fuel: 1, initiative: 0 },
              next: "anvilDragoon44",
              outcome:
                "A plausible projection of Browning's private reservation, taken seriously rather than voiced and overridden: a scaled-back operation secures the nearer Dutch bridges at Nijmegen and Eindhoven without the airborne assault on Arnhem, preserving 1st Airborne Division as a fighting force for 1945. The Rhine crossing and the war-shortening prize Montgomery was reaching for stay out of 1944's reach either way — this path simply doesn't spend a division finding that out.",
            });
            return base;
          })(),
        };
        },
        get arnhemPerimeter44() {
          return {
          date: "SEPTEMBER 21–25, 1944",
          title: "The Perimeter at Oosterbeek",
          historicalRecord: true,
          situation:
            "Frost's men at the bridge itself have been overwhelmed after four days without relief — the crossing 1st Airborne was dropped to seize is back in German hands. What's left of the division has consolidated into a shrinking defensive perimeter around Oosterbeek, a few kilometers west of the bridge, fighting off SS Panzer forces with dwindling ammunition and no resupply that isn't scattered by German flak before it lands. XXX Corps's armor is stalled at Nijmegen, then Elst — close enough that the gunfire is audible, far short enough that it doesn't matter. Whether Market Garden's original objective is still reachable isn't in doubt anymore. It isn't. What's left to decide is what happens to the men holding the ground it was reaching for." +
            (flags.omahaCrisis44 === "committed"
              ? " June's version of this exact question — feed more in behind a force that's taking fire it can't yet see its way clear of, or write the position off and cut losses — went the other way, on a beach rather than a riverbank. What that choice bought at Omaha doesn't transfer here; XXX Corps is stalled by ground and German armor, not by a decision anyone made."
              : "") +
            (flags.forkArnhemLucky
              ? " The SS Panzer forces that historically doomed the bridge itself were never confirmed in the area to begin with — whatever is holding XXX Corps back at Nijmegen and Elst, it isn't the armor this operation's planners feared most going in."
              : ""),
          choices: [
            {
              label: "Force the crossing — commit XXX Corps to a direct assault to relieve the perimeter",
              advisor: { name: "Horrocks", quote: "I have a corps within sight of that perimeter and men inside it who have been fighting alone for a week. I would like to at least have tried before I explain to their families why I didn't." },
              historical: false,
              setFlags: { arnhemPerimeter44: "force" },
              favor: -1,
              impact: { manpower: -2, fuel: -1, initiative: 0 },
              next: "anvilDragoon44",
              // Key Battle Subgame, battle #8 (round 15, "getting 10 battles"). Same
              // unconditional-add pattern as Kursk, Monte Cassino, and Anzio (uncertain[] already
              // existed on this choice before the subgame, so keyBattleSubgame is added directly
              // rather than spread behind KEY_BATTLE_SUBGAME_ENABLED — shipped builds never read
              // keyBattleSubgame at all, and check-battle-balance.js/check-reachability.js both
              // evaluate with the flag false, so the shipped graph is unaffected either way). The
              // uncertain[] array below, its weight formula, and both branches' own outcome text
              // are left exactly as they were.
              //
              // Bespoke airborne-archetype categories: this operation's real four moving parts
              // during the 21-25 September window are XXX Corps's stalled relief column, 1st
              // Airborne's own shrinking perimeter defense, the RAF's daylight resupply drops, and
              // the Polish 1st Independent Parachute Brigade's attempt to cross the Rhine from
              // Driel — a genuinely airborne-flavored set distinct from Anzio's amphibious one and
              // Bagration's default land set. All facts verified 2026-09-25 (Wikipedia, Battle of
              // Arnhem; Robert Henry Cain; 1st Independent Parachute Brigade): the 22 September
              // drop (164 aircraft, 390 tons attempted) recovered only 31 tons, its drop zone
              // still in German hands throughout the battle; the 23 September drop saw only 13%
              // of supplies reach British hands, with Germans using captured British marker
              // panels and flares to lure aircraft to their own positions; the Polish brigade
              // dropped near Driel on 20 September (1,003 men, 5 killed/25 wounded in the drop)
              // to find the Heveadorp ferry already scuttled; its crossing attempts recovered only
              // 35 men into the perimeter on the night of 21-22 September and 153 more on 24
              // September, against a hoped-for reinforcement several times that size; XXX Corps
              // was stalled at Nijmegen and then Elst, and the Germans cut its single supply road
              // near Koevering on 25 September, the blow that led Horrocks to conclude the
              // relief could not succeed; and Major Robert Cain of the South Staffordshire
              // Regiment (commanding survivors folded into Lonsdale Force) destroyed or drove off
              // German armor with a PIAT at close range on 21 and 22 September, then helped
              // disable a Tiger tank with a 6-pounder gun on 24 September, earning the Victoria
              // Cross for six days of continuous defense.
              concealRoll: true,
              keyBattleSubgame: {
                id: "arnhemPerimeter44",
                title: "Order of Battle — The Corridor and the Perimeter",
                flavor:
                  "Four days in, and the bridge itself is gone — Frost's men overwhelmed, the crossing back in German hands. What's left of 1st Airborne has drawn into a shrinking horseshoe around Oosterbeek, holding on artillery support and whatever gets through the ring, while Sosabowski's Poles try to cross the Rhine from the south bank in the dark and Horrocks's own corps sits close enough at Nijmegen and Elst to hear the guns and no closer. What's decided here is how the armor, the perimeter's own defense, the air resupply, and the Polish crossing effort are weighed against each other before the corridor behind all of them closes for good.",
                categories: [
                  { id: "corpsPush", name: "XXX Corps Armored Push", meter: "fuel", glyph: "▲" },
                  { id: "perimeter", name: "Oosterbeek Perimeter", meter: "manpower", glyph: "◆◆◆" },
                  { id: "resupply", name: "Supply Drop", meter: "fuel", glyph: "✈" },
                  { id: "poles", name: "Polish Parachute Brigade", meter: "manpower", glyph: "✦" },
                ],
                // Corps Push highest — the relief column is the only thing that can actually end
                // the siege; Poles second — a small, determined reinforcement effort, the same
                // shape as Monte Cassino's Paratroops or Anzio's Rangers; Perimeter third — real
                // weight, but holding ground rather than relieving it; Supply Drop lowest,
                // deliberately — necessary and real, but by the record itself mostly a casualty
                // count for the RAF rather than a lever that changes the siege, the same design
                // choice as Omaha's Air or Anzio's Naval.
                effectiveness: { corpsPush: 2.6, perimeter: 2.0, resupply: 1.6, poles: 2.2 },
                categoryContext: {
                  corpsPush:
                    "The relief column is stalled on one road between Nijmegen and Elst. Every mile forward means the Germans can cut behind that same road. Moving it forward brings relief closer. It also thins the position being held.",
                  perimeter:
                    "The division is dug into a horseshoe a few hundred yards deep in places. Major Cain's men are fighting tanks with anti-tank rifles at twenty yards. Every man pulled from the wire is a man not defending it.",
                  resupply:
                    "The RAF flies supplies in daylight through flak the German batteries put up. The Germans now have the British marker panels used for drops. Whatever gets through is what the division eats today.",
                  poles:
                    "Sosabowski's brigade sits on the south bank at Driel with no ferry and small boats for a river crossing under fire. Every man who makes it across reinforces the perimeter. Most don't.",
                },
                flashups: {
                  corpsPush: [
                    "The lead Sherman troop pushes another half-mile up the road from Elst.",
                    "A column halts to clear a roadblock before it can push on.",
                    "Forward observers report the church spire at Oosterbeek just visible from the column's furthest point.",
                    "A bridge-laying tank moves up to replace a blown culvert on the only road forward.",
                    "The column's rearguard reports German infantry probing the road behind it.",
                  ],
                  perimeter: [
                    "Major Cain's PIAT drives off another armored vehicle at twenty yards' range.",
                    "The line around the Hartenstein hotel holds against another probing attack.",
                    "A platoon falls back thirty yards to a tighter perimeter line rather than break outright.",
                    "Artillery from across the river breaks up a German company forming to attack.",
                    "A six-pounder gun crew manhandles their weapon into position against a reported Tiger.",
                  ],
                  resupply: [
                    "A Dakota comes in low through flak, its chutes opening over what used to be the drop zone.",
                    "A supply canister lands inside the perimeter for once, and the men fight over what's in it.",
                    "German troops on the old drop zone wave captured marker panels at the next flight in.",
                    "A pilot holds his run straight through the flak rather than break early and miss the zone.",
                    "The division's last mortar rounds are rationed out a few per gun.",
                  ],
                  poles: [
                    "A boat load of Poles pushes off from the south bank in the dark.",
                    "Small-arms fire finds a crossing party halfway over the river.",
                    "A handful of Poles reach the north bank and are guided into the perimeter.",
                    "The engineers report another boat holed and sinking mid-river.",
                    "Sosabowski's men prepare another crossing attempt before first light.",
                  ],
                },
                reportTimes: { open: "2100", contact: "2300", cats: ["0100", "0300", "0500", "0700"], reserve: "0900", counter: "1100" },
                idleLines: {
                  corpsPush: [
                    "The column stays halted on the road. Not another yard is made toward the river.",
                    "No armor moves forward. Whatever's between here and the perimeter stays exactly as far away.",
                  ],
                  perimeter: [
                    "Nobody reinforces the line. The horseshoe holds only as tight as it already is.",
                    "No fresh men go to the wire. Whatever's coming at the perimeter, it finds what's already there.",
                  ],
                  resupply: [
                    "No aircraft go up. Whatever the division has is what it has.",
                    "The drop is scrubbed. Nothing comes in today.",
                  ],
                  poles: [
                    "No boats go out. The brigade stays on the south bank, watching the far shore.",
                    "The crossing attempt is called off before it starts. Nobody new reaches the perimeter tonight.",
                  ],
                },
                verdicts: ["The Corridor Holds Long Enough", "The Road Closes Behind Them"],
                verdictGrades: {
                  clean: "The column, the perimeter, the air drop, and the Polish crossing all held together at once — as close as this operation gets to the plan working.",
                  costly: "The corridor holds, but every element paid more than the plan allowed for to keep it that way.",
                  marginal: "The relief stalls short of the river. The perimeter survives the day; the crossing doesn't happen.",
                  total: "The relief doesn't stall so much as never get close — the corridor is what there is to show for the day.",
                },
                counterattack: {
                  category: "perimeter",
                  severity: { corridorCut: 1, dropZoneCompromised: 1, freshPanzerReserves: 2 },
                  warn: {
                    1: "German infantry are massing for another push on the perimeter's southern sector.",
                    2: "Tanks, newly arrived, are forming up for a direct assault on the perimeter line.",
                  },
                  results: {
                    repulsed: "The assault is thrown back, PIATs and six-pounders both, and the line holds without losing ground.",
                    heldAtCost: "The line holds, and the sector that held it is down to a handful of men still standing.",
                    broke: "The German assault breaks into the perimeter and the line has to be fought back inch by inch.",
                    gaveGround: "The perimeter pulls back to a tighter line rather than fight the assault out where it lands.",
                  },
                },
              },
              uncertain: [
                {
                  weight: modWeight(15, meters.manpower),
                  title: "The narrowest possible case: the corridor opens",
                  impact: { manpower: 1, fuel: 0, initiative: 1 },
                  outcome:
                    "The rare case, and this campaign's furthest reach on this operation: a direct assault, at real cost, forces a crossing before the perimeter collapses entirely, and a meaningful fraction of 1st Airborne is relieved rather than evacuated. It does not retroactively make the wider plan sound — Arnhem's bridge is still lost, the Ruhr is still not laid open before winter — but it changes who's still standing at Oosterbeek to remember how close it came.",
                },
                {
                  weight: 100 - modWeight(15, meters.manpower),
                  title: "The likelier case: the ground doesn't yield",
                  impact: { manpower: -2, fuel: -1, initiative: -1 },
                  outcome:
                    "What every honest accounting of the terrain and the German defense concludes: a single armored corps, on one exposed road, doesn't force a crossing this heavily contested by direct assault. The attempt costs real casualties on top of the perimeter's own losses, without changing what happens to the men still holding Oosterbeek. XXX Corps ends the battle further from relieving the division than the evacuation option would have left it from saving what could still be saved.",
                },
              ],
            },
            {
              label: "Organize the night evacuation — Operation Berlin, across the Rhine, in darkness",
              advisor: { name: "Urquhart", quote: "I have a division that no longer has an objective, only a perimeter. My job now is getting as many of them home as the night allows." },
              historical: true,
              setFlags: { arnhemPerimeter44: "evacuate" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "anvilDragoon44",
              outcome:
                "What actually happened, the night of September 25th into the 26th: a carefully organized withdrawal across the Rhine in small boats, in darkness, under fire — roughly 2,400 men extracted of the nearly 10,000 who had landed nine days earlier. It is not a victory by any definition the operation's planners intended. It is, by the standard that actually applied by the ninth day, the correct call: more of the division comes home than any other version of this ending manages, and 'Operation Berlin' becomes the one part of Market Garden that went approximately as planned.",
            },
          ],
        };
        },
        get anvilDragoon44() {
          return {
          date: "AUGUST 1944",
          title: "Southern France or the Balkans",
          historicalRecord: true,
          directive: true,
          situation:
            "A second Allied landing is ready to launch — southern France, near Marseille, using divisions currently tied down in Italy. Churchill objects strenuously, one final time: redirect this force to the Balkans instead, or to a landing near Trieste, positioning Western Allied forces to reach Vienna and the Danube before Soviet troops do, shaping the postwar political map while there's still time. American planners want the straightforward answer — a landing that gives the Overlord buildup a desperately needed additional port, Marseille, still functioning while Cherbourg and the artificial Mulberry harbors strain under the weight of an entire theater's supply." +
            (flags.normandyDelayFlagged
              ? " The extra week Omaha cost the timeline hasn't stopped mattering — it's one more reason the supply staff's case for Marseille's capacity is harder to argue against now than it would have been on the schedule this campaign never actually kept."
              : "") +
            // Round 15 (battle #8 echo): only on the path where the subgame was actually played —
            // the OTHER choice at arnhemPerimeter44 (the night evacuation) also routes here, and
            // never set up a battle to echo.
            (flags.arnhemPerimeter44 === "force" ? keyBattleEcho("arnhemPerimeter44", flags) : ""),
          choices: [
            {
              label: "Proceed with the southern France landing — secure Marseille as a supply port",
              advisor: { name: "Eisenhower", quote: "I did not win the argument about Normandy's landing craft to lose it now over a port I need more than a political line on a map I don't get to draw." },
              historical: true,
              setFlags: { anvil44: "southernFrance", cohesion: (flags.cohesion || 0) + (-1) },
              cohesionDelta: -1,
              impact: { manpower: 0, fuel: 2, initiative: 0 },
              next: "scheldt44",
              outcome:
                "What happened, August 15, 1944 — Operation Dragoon. Marseille was secured largely intact and became one of the Allied supply system's most valuable ports for the rest of the war, materially easing the fuel crisis that stalled the broad-front advance that autumn. Churchill's Balkans argument was overruled, as it had been at several earlier points in the war, by the straightforward military logic of supply.",
            },
            {
              label: "Redirect to the Balkans — position Western forces to reach Vienna ahead of Soviet troops",
              advisor: { name: "Churchill", quote: "I am not asking you to refight this war. I am asking you to notice that the peace afterward is also a thing that gets decided, and it is being decided right now, in whichever direction our armies happen to be pointed." },
              setFlags: { anvil44: "balkans", cohesion: (flags.cohesion || 0) + (-2) },
              cohesionDelta: -2,
              impact: { manpower: -2, fuel: -2, initiative: 0 },
              next: "ljubljanaGap44",
              outcome:
                "One considered account of Churchill's actual, unsuccessful argument, taken seriously rather than overruled: a Balkans-directed landing plausibly gets Western forces further east by the war's end, with real implications for where the Iron Curtain eventually falls — but it forfeits Marseille's port capacity at the exact moment the broad-front advance into Germany is starving for supply, and Eisenhower's supply staff were not wrong that the fuel crisis this choice risks was the more immediate danger to the campaign actually in progress.",
            },
          ],
        };
        },
        get ljubljanaGap44() {
          return {
          date: "AUTUMN 1944",
          title: "The Ljubljana Gap",
          historicalRecord: false,
          situation:
            "The Balkan landing has committed the alliance to Churchill's map: the force ashore in the Adriatic theater now faces the route he championed to the war's end — northeast through the Ljubljana Gap toward Vienna and the Danube, arriving in central Europe ahead of Soviet forces and drawing the postwar line by presence. Between the map and Vienna stand the Dinaric Alps, a single-track railway, Kesselring-grade defensive terrain, and a logistics case every American planner called fantasy. The prize is political geography; the price list is military and long." +
            (meters.fuel <= -3
              ? " The planners who called this a fantasy turn out to have been describing this exact month — there isn't fuel enough left to attempt the drive at all, so the question of whether the mountains were worth it never gets tested."
              : ""),
          choices: [
            {
              label: "Drive for the Gap — Vienna before the Red Army, whatever the mountains cost",
              advisor: { name: "Churchill", quote: "Armies draw maps by standing on them. I would rather argue about supply through one mountain gap than about half of Europe for half a century." },
              checkLabel: "Fuel",
              disabledReason: meters.fuel <= -3 ? "insufficient fuel for a logistics case American planners already called fantasy" : undefined,
              setFlags: { ljubljana44: "drive", cohesion: (flags.cohesion || 0) + (-2) },
              cohesionDelta: -2,
              impact: { manpower: -2, fuel: -1, initiative: 0 },
              next: "ardennesResponse44",
              uncertain: [
                {
                  weight: modWeight(30, meters.fuel),
                  title: "Vienna, on the generous reading",
                  impact: { manpower: -1, fuel: -1, initiative: 1 },
                  next: "viennaStandoff44",
                  outcome:
                    "The map's most generous reading turns out to be the right one: the single rail axis holds together just long enough, and Western forces reach Vienna's approaches ahead of the Red Army — Churchill's whole political case for this theater, delivered against every American staff estimate that said it couldn't be done on this terrain and this logistics. What that presence is really worth is a question the politicians, not the mountains, now have to answer.",
                },
                {
                  weight: 100 - modWeight(30, meters.fuel),
                  title: "The mountains win the argument the staffs already made",
                  next: "gapStalled44",
                  impact: { manpower: -2, fuel: -1, initiative: 0 },
                  outcome:
                    "The American staff estimate proves correct: the advance through successive mountain lines on a single rail axis moves at the Italian campaign's pace because it's fighting the Italian campaign's terrain, and the force bogs down well short of Vienna. The political prize goes unclaimed anyway — just at a higher price than declining the gamble outright would have cost. What happens to a stalled offensive with nowhere useful left to advance is the next question.",
                },
              ],
            },
            {
              label: "Hold the Adriatic gains — a fleet-in-being on the Balkan flank, no mountain campaign",
              advisor: { name: "Alexander", quote: "The landing already did its political work: German divisions face the Adriatic that could face France. I decline to spend a campaign proving the mountains are tall." },
              setFlags: { ljubljana44: "hold", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "ardennesResponse44",
              outcome:
                "The consolidation converts the Balkan option into what its sober defenders always claimed for it: a standing threat pinning German strength on a flank, at holding cost, without the Vienna gamble's price list. The postwar line stays where the main fronts will draw it — which is to say, the political prize Churchill wanted from this theater goes unclaimed, by choice rather than by the mountains.",
            },
          ],
        };
        },
        get gapStalled44() {
          return {
          date: "WINTER 1944–45",
          title: "A Campaign With Nowhere Useful Left to Go",
          historicalRecord: false,
          situation:
            "The single rail axis that was always this operation's real constraint has done what the American estimate said it would: the advance sits well short of Vienna, dug into mountain lines that favor the defender absolutely, spending divisions on terrain that was never going to yield the political prize it was committed to reach. The Adriatic landing's original, more modest purpose — pinning German divisions on a flank — still holds. Everything spent past that purpose chasing Vienna specifically is now a campaign with no achievable objective left in front of it, only a question of how it ends.",
          choices: [
            {
              label: "Keep pressing — a stalled offensive that stops advancing stops pinning anything useful",
              advisor: { name: "Churchill", quote: "An army that has stopped moving forward has, in every sense that matters to the men facing it, stopped. I did not ask for a fortified suggestion. I asked for Vienna." },
              historical: false,
              setFlags: { gapStalled44: "press" },
              favor: -1,
              impact: { manpower: -2, fuel: -1, initiative: 0 },
              next: "ardennesResponse44",
              outcome:
                "The costlier reading of a political prize that was never really in reach: continuing to press terrain this unfavorable produces the Italian campaign's own oldest lesson, repeated at a smaller scale and later in the war — real casualties for ground that changes nothing about where the postwar line actually gets drawn, since that line was always going to be settled by the main fronts, not this one.",
            },
            {
              label: "Pull back to the original defensive line — the pinning mission was the real value all along",
              advisor: { name: "Alexander", quote: "This theater's honest job was always to hold German divisions here rather than in France. It is still doing that job perfectly well from a line we can actually supply." },
              historical: true,
              setFlags: { gapStalled44: "consolidate" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "ardennesResponse44",
              outcome:
                "The disciplined answer to a campaign that already found its ceiling: pulling back to a defensible line that still pins German strength on the Adriatic flank preserves the theater's one genuine, achievable value, and stops spending divisions chasing a political prize the mountains had already decided wasn't reachable. Vienna goes to whoever's main front actually gets there — which, on most timelines, was never going to be this one regardless of how hard the Gap was pressed.",
            },
          ],
        };
        },
        get viennaStandoff44() {
          return {
          date: "AUTUMN 1944",
          title: "The Vienna Standoff",
          historicalRecord: false,
          situation:
            "Being first to Vienna's approaches turns out to answer nothing by itself. Soviet forces are still weeks away, but Moscow's diplomats already treat Austria as settled ground — a liberated country, in Stalin's framing, not occupied territory up for negotiation. Vienna, like Berlin will be, is heading toward a divided occupation regardless of who arrived first; the only real question is how much say the West gets in drawing the lines, and how much of a fight Moscow is willing to make of a question everyone privately expects to end in four zones anyway.",
          choices: [
            {
              label: "Press the diplomatic advantage — negotiate the zones from a position of physical presence",
              advisor: { name: "Alexander", quote: "We are standing in the city they are still marching toward. That is worth exactly one thing: a better map when the lawyers finally sit down. Let's not waste it." },
              historical: false,
              setFlags: { viennaStandoff44: "press", cohesion: (flags.cohesion || 0) + (-1) },
              cohesionDelta: -1,
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "ardennesResponse44",
              outcome:
                "The reasoned case for using the position while it exists: Western negotiators arrive at the zone question already holding the ground being divided, and extract a modestly more favorable line than the historical talks produced — at the cost of a Kremlin that reads the pressing as bad faith from an ally it was already inclined to distrust after everything Poland has already cost the relationship.",
            },
            {
              label: "Hold quietly and wait for the conference — let the postwar order be negotiated, not seized",
              advisor: { name: "Eisenhower", quote: "I did not build this coalition to spend its last good year arguing over a city we already agreed would be shared. We wait for the table." },
              historical: false,
              setFlags: { viennaStandoff44: "wait", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "ardennesResponse44",
              outcome:
                "The coalition-preserving choice: Vienna's occupation is settled at the conference table on essentially the historical terms, and the alliance banks the goodwill of an ally who noticed the West could have pressed the point and chose not to. Whether that goodwill outlasts the war it was earned in is a question this campaign leaves open, along with everything else about the peace that follows it.",
            },
          ],
          };
        },

        get ardennesResponse44() {
          return {
          date: "DECEMBER 1944",
          title: "The Bulge",
          historicalRecord: true,
          situation:
            "German armor has struck through the Ardennes in the last major offensive the Wehrmacht will mount in the west, catching thinly held American lines by surprise and driving a deep salient — the 'bulge' — toward the Meuse. Bastogne, a road junction the German advance needs and cannot easily bypass, is surrounded, its garrison encircled but holding. Patton's Third Army sits to the south, positioned to wheel north and relieve the town, but doing so on the timetable he's proposing means turning an entire army ninety degrees in winter conditions on a few days' notice — a maneuver few staffs would consider realistic." +
            (flags.normandyDelay
              ? " Six months on, Omaha's cost is a line in an old report rather than a live factor in this decision — worth noting only because it's the last time this command asked how much slack it actually had before finding out the hard way."
              : "") +
            (flags.arnhemPerimeter44 === "evacuate"
              ? " This isn't the first time this winter that a decision has come down to whether an isolated force gets pulled out or reinforced in place — Arnhem's perimeter answered that question with a withdrawal. Bastogne is being asked the opposite question, and nothing about how the last one went settles which answer is right this time."
              : flags.arnhemPerimeter44 === "force"
              ? " The last time this command faced an isolated force's fate, it forced a corridor through rather than pull back — the instinct being tested again at Bastogne isn't a new one."
              : ""),
          choices: [
            {
              label: "Approve Patton's rapid wheel north to relieve Bastogne",
              advisor: { name: "Patton", quote: "I can attack in forty-eight hours. My staff has been ready for this exact contingency since before anyone asked me if I could do it." },
              historical: true,
              setFlags: { bulge44: "patton" },
              impact: { manpower: -2, fuel: -1, initiative: 2 },
              next: "yaltaFeb45",
              outcome:
                "What happened, and it remains one of the most admired operational feats of the Western war: Third Army turned ninety degrees and relieved Bastogne within days, an operation most German staff officers judged simply impossible on the timeline it was executed. It did not undo the German offensive's initial shock, but it broke the siege before the garrison's ammunition and supplies ran out.",
            },
            {
              label: "Take the more cautious, methodical relief approach — do not risk overextending Third Army",
              advisor: { name: "Bradley", quote: "I would rather relieve Bastogne a few days late with an army that is still organized than a few days early with one that isn't." },
              setFlags: { bulge44: "cautious" },
              impact: { manpower: 2, fuel: 1, initiative: -1 },
              next: "bulgeExploited44",
              outcome:
                "A speculative reading of the more conventional operational choice: a slower, better-coordinated relief effort reduces the real risk of overextending Third Army in poor winter conditions, at the cost of additional days for Bastogne's encircled garrison to hold out on dwindling supplies before relief arrives. The garrison's own determination — not the speed of the relief — was the historical margin either way. What those extra days let the German offensive attempt elsewhere is a separate question.",
            },
          ],
        };
        },
        get bulgeExploited44() {
          return {
          date: "LATE DECEMBER 1944",
          title: "What the Delay Bought Germany",
          historicalRecord: false,
          situation:
            "The slower relief effort's own logic held — Third Army arrives organized rather than exhausted — but the extra days weren't free. German forces further along the salient used the reprieve to push harder toward the Meuse than the historical timeline allowed, and a fuel-starved offensive that historically stalled just short of its river-crossing objective has, on this path, gotten measurably closer to it before finally running dry. This is the cautious relief's own bill arriving, item by item — the same choice that spared Third Army a disorganized dash north is the reason there's a salient tip left this far along to seal at all.",
          choices: [
            {
              label: "Commit additional reserves to seal the salient's tip before it reaches the Meuse",
              advisor: { name: "Montgomery", quote: "The salient has a point, not a base. Blunt the point now, properly, and the base behind it is meaningless." },
              historical: false,
              checkLabel: "Manpower",
              disabledReason: meters.manpower <= -4 ? "no reserve left uncommitted to spend sealing a salient tip the winter front can otherwise absorb" : undefined,
              setFlags: { bulgeExploited44: "commit" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "yaltaFeb45",
              outcome:
                "The direct answer to a problem the slower relief created: additional reserves seal the salient's furthest point before it reaches the river, at a real cost in strength the broader winter front could otherwise have used. The offensive's fuel would very likely have ended it here regardless — German logistics never actually had the reserves to exploit a Meuse crossing even if reached — but committing reserves to make certain of that costs more than letting the offensive's own arithmetic finish the job.",
              uncertain: [
                {
                  weight: modWeight(70, meters.manpower),
                  title: "The reserves reach the tip before the spearhead does",
                  impact: { manpower: -1, fuel: -1, initiative: 0 },
                  outcome:
                    "The commitment pays for itself exactly as intended: the salient's tip is sealed with room to spare before it comes anywhere near the river, and the offensive's fuel starvation never even gets the chance to be the thing that stops it.",
                },
                {
                  weight: 100 - modWeight(70, meters.manpower),
                  title: "The reserves arrive to find the fuel already did the job",
                  impact: { manpower: -1, fuel: 0, initiative: 0 },
                  outcome:
                    "Bradley's logic turns out to have been sound after all — the German spearhead runs dry before the committed reserves ever make contact with it. The reserves aren't wasted, exactly, but they confirm an outcome the enemy's own supply lines were already delivering for free.",
                },
              ],
            },
            {
              label: "Trust the offensive's own fuel starvation to stop it — don't spend reserves confirming what logistics already guarantees",
              advisor: { name: "Bradley", quote: "German fuel dumps cannot support what German ambition wants. I would rather be right about that and save the reserve than be cautious and waste it." },
              setFlags: { bulgeExploited44: "trust" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "yaltaFeb45",
              outcome:
                "The patient answer, and the one the actual historical logistics vindicate: the German offensive's fuel situation was never survivable regardless of how close its spearheads got, and the reserve stays intact for whatever the winter front needs next rather than being spent confirming an outcome the enemy's own supply lines were always going to deliver.",
            },
          ],
          };
        },

        get yaltaFeb45() {
          return {
          date: "FEBRUARY 1945",
          title: "Yalta",
          historicalRecord: true,
          situation:
            "Roosevelt, Churchill, and Stalin meet at Yalta to settle the shape of postwar Europe while the war still has months to run. Poland's future government is the sharpest dispute — Stalin insists on the Soviet-backed Lublin committee rather than the London government-in-exile the Western Allies have recognized throughout the war, and offers only a vague promise of 'free and unfettered' future elections. Roosevelt, visibly ill and eager to secure Stalin's promised entry into the Pacific war, is inclined to accept the ambiguity rather than press the point." +
            (flags.hardMode && (flags.cohesion || 0) >= 3
              ? " One option exists at this table that the historical conference never had: two years of managed alliance mean London and Washington arrive truly aligned — and a united Western position is the only kind Stalin has ever priced differently."
              : "") +
            (flags.bulgeExploited44 === "commit"
              ? " The reserve spent sealing the Bulge's tip a few weeks ago is a reserve this delegation doesn't have behind it as a bargaining fact, for whatever quiet difference that makes to how hard the American position can afford to push."
              : flags.bulge44 === "patton"
              ? " Bastogne relieved on Patton's own timetable rather than a slower one is, this month, mostly a settled fact rather than a live bargaining chip — the army that turned ninety degrees in December is intact and forward, and nobody at this table is asking what it cost."
              : ""),
          choices: (() => {
            const base = [];
            if (flags.hardMode && (flags.cohesion || 0) >= 3)
              base.push({
                label: "The united front — London and Washington press Poland's case as one voice, jointly and in advance",
                advisor: { name: "Eden", quote: "Alone, either of us asking is a request he can divide and decline. Together, in writing, before the plenary — that is the only shape of this question he has ever taken seriously." },
                setFlags: { yalta45: "unitedPress", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
                impact: { manpower: 0, fuel: 0, initiative: 1 },
                next: "stalinTestsTheFront45",
                outcome:
                  "Only on the table because this alliance arrived at Yalta unusually intact — a coordinated Anglo-American position, agreed in advance, presented without daylight. The projection is honest about its ceiling: the Red Army's physical presence in Poland is a fact no communiqué dissolves, and the eventual outcome likely bends rather than breaks. But the united front extracts more specific language, better-defined election machinery, and — the part the historical conference conspicuously lacked — a joint Western position Stalin must openly repudiate rather than quietly reinterpret. Whether that position actually holds once the conference ends is a separate question from whether it worked at the table.",
              });
            base.push({
              label: "Press Stalin hard on free Polish elections, risk the conference over it",
              advisor: { name: "Churchill", quote: "Poland is the reason this war began. I did not come this far to let its ending be settled by a promise I already suspect will not be kept." },
              setFlags: { yalta45: "press", cohesion: (flags.cohesion || 0) + (-1) },
              cohesionDelta: -1,
              impact: { manpower: 0, fuel: -1, initiative: 1 },
              next: "strategicBombing45",
              outcome:
                "The likely shape of the harder line Churchill truly favored and did not fully get: pressing the point risks the conference's other agreements — including Stalin's Pacific war commitment, which planners still believe will be needed to shorten the invasion of Japan — for a Polish guarantee that the Red Army's physical presence on the ground makes very difficult to in truth enforce regardless of what any document says.",
            });
            base.push({
              label: "Accept the ambiguous language — prioritize Soviet entry into the Pacific war and postwar cooperation",
              advisor: { name: "Roosevelt", quote: "I need Stalin's armies in Manchuria more than I need a sentence about Poland that his own troops are standing on top of anyway." },
              historical: true,
              setFlags: { yalta45: "accept", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: "strategicBombing45",
              outcome:
                "The 'free and unfettered' elections promised for Poland did not materialize in the form the Western Allies understood the phrase — within three years, Poland was a one-party Soviet satellite state. Whether firmer language at Yalta itself would have changed that outcome, given the Red Army's actual position on Polish soil at the time of the conference, remains a live dispute among historians; military presence, not paper agreements, did most of the deciding in Eastern Europe either way.",
            });
            return base;
          })(),
        };
        },
        get berlinDecision45() {
          return {
          date: "APRIL 1945",
          title: "The Halt on the Elbe",
          historicalRecord: true,
          situation:
            "Ninth Army has reached the Elbe, roughly sixty miles from Berlin — closer, by most staff estimates, than Soviet forces still fighting through the Seelow Heights to the east. Whether Western Allied forces could reach the city first is a live military question. Whether they should is a different one: Berlin sits inside the Soviet occupation zone already agreed at Yalta, and Eisenhower's own judgment is that the political prize is not worth the casualties a race into a city assigned to someone else's zone regardless of who captures it first." +
            (flags.hardMode && (flags.cohesion || 0) <= -3
              ? " There is also, by this point, a fact no staff memo says aloud: the coalition itself could not absorb one more unilateral American gambit inside an agreed Soviet zone. Whatever Patton would do with forty-eight hours, he isn't being given the order to try."
              : "") +
            (flags.bulge44 === "patton"
              ? " Patton's own case for speed has a real precedent behind it this time — Bastogne's relief was exactly this argument, made once already and proven right. It doesn't change Eisenhower's answer here; the zone line at Yalta isn't a tactical question Third Army's own record can argue its way past."
              : flags.bulge44 === "cautious"
              ? " The cautious instinct that governed Bastogne's relief in December is, in substance, the same instinct settling this question now — some staffs never really stop asking whether the fast option is worth what it costs."
              : ""),
          choices: (() => {
            const unilateralPushPossible = !(flags.hardMode && (flags.cohesion || 0) <= -3);
            const base = [];
            base.push({
              checkLabel: "Coalition Trust",
              disabledReason: unilateralPushPossible ? undefined : "the coalition cannot absorb one more unilateral move into an agreed Soviet zone",
              label: "Push for Berlin — reach the capital before Soviet forces, whatever the zone agreement says",
              advisor: { name: "Patton", quote: "We can be in Berlin in forty-eight hours. I am being told the political map matters more than that. I have never found that argument persuasive from a tank." },
              setFlags: { berlin45allied: "push", cohesion: (flags.cohesion || 0) + (-2) },
              cohesionDelta: -2,
              impact: { manpower: -2, fuel: -1, initiative: 0 },
              next: "berlinRace45",
              outcome:
                "A fair projection of the road Patton and others argued for and lost: a Western capture of Berlin is plausible on the military timeline alone, but it captures a city already assigned to Soviet occupation at Yalta — meaning any American or British units that took it would very likely have had to hand it back regardless, at a cost in casualties for a possession that was never going to be kept. Whether the race is even won is the next question — this campaign's deepest departure from the historical record.",
            });
            base.push({
              label: "Halt on the Elbe — let Soviet forces take Berlin, as the occupation agreement anticipates",
              advisor: { name: "Eisenhower", quote: "I am not going to spend American and British lives to plant a flag in a city we've already agreed to give away. Let the political question be decided at the table it belongs at." },
              historical: true,
              setFlags: { berlin45allied: "halt", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
              impact: { manpower: 2, fuel: 1, initiative: -1 },
              next: "germanyOccupation45",
              outcome:
                "Eisenhower's decision remains debated by historians — some argue a Western capture of Berlin would have meaningfully shaped the early Cold War's psychology even if the city were later handed over — but the military logic was sound on its own terms: the casualties of an urban assault on a heavily defended capital, fought for a prize already allocated to an ally, were a cost Eisenhower judged not worth paying. Soviet forces took the city in twelve days of the war's costliest urban combat.",
            });
            // Two routes in: the Antwerp-in-September path earned back in October, or a
            // command that simply arrives in 1945 with a surplus it never had to spend.
            if ((flags.antwerpSeptember && (meters.fuel || 0) >= 1) || ((meters.manpower || 0) >= 3 && (meters.fuel || 0) >= 3)) {
              base.push({
                label: "Take Army Group B's surrender in the Ruhr now and drive the Elbe line three weeks early — end the western war before the Berlin question has to be answered",
                advisor: { name: "Bradley", quote: "Model has three hundred thousand men in a pocket and no orders anyone can carry out. I do not need Berlin to finish this. I need somebody with authority to accept a surrender, and I need it this week." },
                setFlags: { berlin45allied: "westernCollapse" },
                impact: { manpower: 1, fuel: -1, initiative: 2 },
                next: "westernCollapse45",
                outcome:
                  "The option a supply line built in September makes available and the historical autumn never did: with fuel that was never the binding constraint, the Ruhr encirclement closes earlier and harder, and Army Group B's collapse — 300,000-odd prisoners, the largest mass surrender of the western war, and a settled historical fact on any timeline — arrives with weeks still on the clock rather than days. Berlin stops being a question about racing and becomes a question about paperwork.",
              });
            }
            return base;
          })(),
        };
        },
        get westernCollapse45() {
          return {
          date: "MARCH 1945",
          title: "The Surrender That Came Early",
          historicalRecord: false,
          speculative: true,
          situation:
            "Marked plainly: the western war did not end in March. What is historical here is the shape of it — Model's Army Group B was encircled in the Ruhr and did surrender en masse, some 300,000 men, and Model shot himself rather than sign; German command in the west genuinely disintegrated faster than any Allied planning assumption expected. What is speculative is the calendar, pulled forward by a port opened six months early and a supply line that stopped rationing the advance. Emissaries are now arriving from three separate German commands, none with authority over the others, all of them wanting terms from the Western Allies specifically — and that last detail is the entire problem, because the Combined Chiefs' position on separate surrenders has been fixed since Casablanca and Moscow is watching how it gets applied.",
          choices: [
            {
              label: "Refuse anything but unconditional surrender to all three powers together — no separate western terms, whatever it costs in days",
              advisor: { name: "Eisenhower", quote: "Every one of these men wants to surrender to me and not to the Russians, and every one of them knows exactly why they want that. The answer is the same answer it has been since Casablanca, and I would rather give it in March than explain in June why I didn't." },
              historical: true,
              setFlags: { westernCollapse45: "unconditional" },
              cohesionDelta: 2,
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "END",
              outcome:
                "The Casablanca position held under the one condition that would have made bending it tempting — a German command actively offering to hand the west everything if the west would take it separately. Holding costs days: the emissaries go back, the fighting continues in pockets, and the formal surrender waits for a text all three powers will sign. It also means the alliance that reaches the postwar table is the one that agreed what it wanted before it started winning, which is a rarer thing in coalition war than the surrender itself.",
            },
            {
              label: "Accept the local surrenders as they come — take the ground and the prisoners now, settle the diplomatic form afterwards",
              advisor: { name: "Patton", quote: "They are handing me army groups. I am being asked to hand them back until a committee agrees on the wording. I will do it, and I will not pretend I understand it." },
              setFlags: { westernCollapse45: "local" },
              cohesionDelta: -3,
              impact: { manpower: 1, fuel: 0, initiative: 1 },
              next: "END",
              outcome:
                "The fastest end available to this campaign, and the one that costs something no battlefield ledger records. Taking the surrenders as they come ends organized German resistance in the west within days and saves lives on both sides that a formal process would have spent. It also does, in miniature and in front of witnesses, precisely the thing every Allied communiqué since Casablanca promised would not be done — and Moscow, which has spent the war being told separate terms were unthinkable, draws the conclusion available to it. The war ends earlier. The peace starts colder.",
            },
          ],
        };
        },
        get berlinRace45() {
          return {
          date: "APRIL 1945",
          title: "The Race",
          historicalRecord: false,
          situation:
            "Ninth Army's spearheads are moving on Berlin against a Red Army that has committed roughly 2.5 million men, over six thousand tanks, and its own considerable urgency to reaching the capital first — Zhukov and Konev's forces are already fighting through the Seelow Heights, forty miles out, in numbers no Western formation approaches. This is the deepest departure from the historical record this campaign reaches on the western axis, and the honest odds are stated plainly: the Red Army was closer, in greater force, and racing with the political stakes of a rivalry Stalin actively encouraged between his own two marshals. What's actually open is how the attempt itself plays out, not whether it was likely to work.",
          choices: [
            {
              label: "Drive for the city center directly — accept the risk of a Soviet encounter inside Berlin itself",
              advisor: { name: "Patton", quote: "Forty-eight hours, I said, and I meant it. Every hour spent asking permission is an hour the Russians don't need to ask anyone." },
              setFlags: { berlinRace45: "direct" },
              favor: -1,
              impact: { manpower: -3, fuel: -1, initiative: 0 },
              next: "germanyOccupation45",
              uncertain: [
                {
                  weight: modWeight(8, meters.fuel),
                  title: "The rare case: the city center is reached first",
                  impact: { manpower: -1, fuel: 0, initiative: 1 },
                  outcome:
                    "The narrow case, stated as narrowly as it deserves: Western spearheads reach the Reichstag's district hours ahead of the nearest Soviet formation. The flag gets planted, the photograph gets taken — and Yalta's zone map doesn't move an inch for any of it. Within weeks the sector is handed to Soviet administration exactly as agreed, the military feat converted entirely into a Cold War talking point rather than a lasting fact on the ground.",
                },
                {
                  weight: 100 - modWeight(8, meters.fuel),
                  title: "The likelier case: the armies meet before either reaches the center",
                  impact: { manpower: -2, fuel: 0, initiative: 0 },
                  outcome:
                    "What most serious staff studies of this scenario conclude: Western and Soviet spearheads meet at some contested suburb well short of the center, both still fighting the actual German defense in front of them. Nobody plants a flag on the Reichstag first, because neither army reaches it uncontested — the war's most heavily defended objective doesn't fall to whichever ally's tanks arrive marginally sooner, it falls to whichever brings the force to actually take it, and that was never going to be Ninth Army's alone.",
                },
              ],
            },
            {
              label: "Push toward the city's edge, but hold short of contact with Soviet forces",
              advisor: { name: "Bradley", quote: "I want us close enough to matter and far enough that nobody has to explain a shooting incident with our own allies. That line exists. Find it and hold it." },
              setFlags: { berlinRace45: "edge" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "germanyOccupation45",
              outcome:
                "The cautious version of the same gambit, and an honest accounting of what it actually buys: close enough to the city to make the political point that Western forces could have pressed further, far enough back to avoid the real risk this scenario always carried — two exhausted, keyed-up armies, still nominally allies, making contact in a burning city with no established procedure for it. Nothing in the documented record suggests Eisenhower's staff considered that risk trivial, and this path doesn't either.",
            },
          ],
        };
        },
        get pacificPressure42() {
          return {
          date: "MID-1942",
          title: "The Navy's Bill Comes Due",
          historicalRecord: true,
          situation:
            "Europe First is confirmed policy — and Admiral King has never stopped treating it as a guideline with exceptions. Japanese forces are building an airfield on Guadalcanal that would threaten the entire line to Australia, and King wants an offensive to take it now, with marines, carriers, and shipping that the European buildup has already claimed on paper. The request is technically consistent with holding the line in the Pacific and practically a raid on the Atlantic ledger — and refusing the Navy outright carries its own price inside a coalition that runs on inter-service consent as much as inter-Allied.",
          choices: [
            {
              label: "Grant King his Guadalcanal offensive — Europe First bends but doesn't break",
              advisor: { name: "King", quote: "I am not asking to reverse the policy. I am asking not to lose the Pacific while we save it for later." },
              historical: true,
              setFlags: { pacific42: "grant", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: "secondFront42",
              outcome:
                "The Guadalcanal campaign began in August 1942 and became a six-month meat-grinder that ultimately broke Japanese offensive power in the south Pacific — vindication for King, purchased with shipping and attention the European timetable felt all year. The internal peace it bought mattered too: a Navy flatly refused in mid-1942 would have fought the Army over every hull for the rest of the war.",
            },
            {
              label: "Refuse — Europe First means what it says, the Pacific holds with what it has",
              advisor: { name: "Marshall", quote: "Every exception we grant becomes the precedent for the next one. The policy either governs the shipping or it governs nothing." },
              setFlags: { pacific42: "refuse", cohesion: (flags.cohesion || 0) + (-1) },
              cohesionDelta: -1,
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: "australiaLifeline42",
              outcome:
                "An honest account of the harder line: the European buildup keeps its shipping, and the Japanese airfield on Guadalcanal is completed — putting the Australia lifeline under an air threat the historical campaign existed to prevent, and buying a really embittered Navy whose cooperation every future joint operation depends on. The policy holds; the coalition that has to execute it runs hotter. What an actually-threatened lifeline to Australia costs is the next bill to arrive.",
            },
          ],
        };
        },
        get dieppe42() {
          return {
          date: "AUGUST 1942",
          title: "The Dieppe Raid",
          historicalRecord: true,
          situation:
            "Operation Jubilee is ready: a division-scale raid on the French port of Dieppe, mostly Canadian troops, intended to test whether a defended port can be seized from the sea — and to show Moscow, loudly, that the Western Allies are doing something in Europe this year. The plan's critics inside Combined Operations are blunt: a frontal assault on a defended beach, under-supported by heavy naval gunfire, against cliffs the defenders have had two years to fortify. The raid's advocates answer that some questions about opposed landings can only be answered by attempting one.",
          choices: [
            {
              label: "Launch the raid — the lessons of a real opposed landing cannot be simulated",
              advisor: { name: "Mountbatten", quote: "Everything we believe about landing on a defended coast is theory. The invasion this whole war depends on cannot be built on theory." },
              historical: true,
              setFlags: { dieppe42: "launch", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "darlanDeal42",
              outcome:
                "What happened, and it was a disaster by every immediate measure: of roughly 6,000 men landed, well over half were killed, wounded, or captured within hours — overwhelmingly Canadians, a national wound that endures. The claimed redemption is real but was purchased at terrible cost: Dieppe's failures reshaped Allied invasion doctrine — no frontal port assault, overwhelming naval bombardment, specialized armor — and planners from Overlord onward cited its lessons constantly. Whether those lessons required this tuition remains one of the war's sore debates.",
            },
            {
              label: "Cancel the raid — the plan's flaws are visible from here, at no cost in Canadians",
              advisor: { name: "McNaughton", quote: "I can list what this raid will teach us from my desk: that cliffs are high, that ports are defended, and that six thousand men is a division we no longer have. I decline the tuition." },
              setFlags: { dieppe42: "cancel", cohesion: (flags.cohesion || 0) + (-1) },
              cohesionDelta: -1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "darlanDeal42",
              outcome:
                "A careful extrapolation of the cancellation the plan's critics wanted: the division is preserved and the disaster never happens — and the questions Dieppe answered in blood get answered later, more slowly, and without the specific data a real opposed landing generated. Moscow's pressure for visible Western action in 1942 also goes unanswered by anything except the Torch landings months away — a quieter cost, paid in coalition trust. What Overlord's planners do with a doctrine built on theory instead of tuition is a question that arrives when the invasion is actually being planned, not before.",
            },
          ],
        };
        },
        get bomberDirective43() {
          return {
          date: "1943",
          title: "Pointblank — What the Bombers Are For",
          historicalRecord: true,
          situation:
            "The Casablanca conference has blessed a Combined Bomber Offensive, and the directive now needs an actual doctrine. Harris's Bomber Command is committed to area bombing of German cities by night — 'de-housing' the industrial workforce, a campaign whose civilian toll is enormous by design and whose effect on production the postwar surveys will spend decades disputing. The American daylight force wants precision attacks on chokepoint industries — ball bearings, aircraft plants, and above all oil — accepting terrible unescorted losses now on the theory that the right target list ends the Luftwaffe. The directive can weight either doctrine.",
          choices: [
            {
              label: "Weight the offensive toward precision daylight attack on chokepoint industries",
              advisor: { name: "Spaatz", quote: "Burn a city and the factory in it works again in a month. Break the oil and every German machine stops arguing with us at once." },
              setFlags: { pointblank43: "precision", cohesion: (flags.cohesion || 0) + (-1) },
              cohesionDelta: -1,
              impact: { manpower: -1, fuel: 1, initiative: 0 },
              next: "sicilyHusky43",
              // Round 15, battle #10 (Pointblank / Second Schweinfurt). Attached to this choice's
              // own already-uncertain[] rather than a separate node: the choice's outcome text
              // already names the Second Schweinfurt raid (14 October 1943) directly ("Schweinfurt's
              // second raid alone lost 60"), the same real, dated, documented engagement this
              // subgame models — a strategic-air archetype, distinct from Anzio's amphibious,
              // Arnhem's airborne, and PQ-17's naval sets. All facts verified 2026-09-25
              // (Wikipedia: Second Schweinfurt raid, Combat box, Curtis LeMay, William Ellsworth
              // Kepner, Ira C. Eaker; National WWII Museum, "Black Thursday"): nine bomb groups of
              // the 1st and 3rd Air Divisions flew the mission; P-47 escort could only cover the
              // first roughly 200 of 400 miles before turning back near Aachen, lacking drop tanks
              // with the range to go further; the "combat box" mutual-defensive-fire formation was
              // developed by then-Colonel Curtis LeMay, who was promoted to Brigadier General on
              // 28 September 1943 and became the first commander of the newly formed 3rd Air
              // Division that same month; Major General William Kepner had taken command of VIII
              // Fighter Command in September 1943; Lieutenant General Ira Eaker commanded Eighth
              // Air Force throughout this period; a diversionary feint sent B-24s toward the North
              // Sea but failed to draw German fighter controllers off the real formation's track;
              // German fighters attacked in relayed waves, landing to refuel and rearm before
              // sortying again, while twin-engine Ju 88s fired 21cm rockets from roughly 1,000
              // yards, outside the bombers' own defensive gun range; 60 B-17s were shot down of
              // roughly 72 total losses, with 600+ aircrew casualties.
              keyBattleSubgame: {
                id: "bomberDirective43",
                title: "Order of Battle — The Second Schweinfurt Mission",
                flavor:
                  "The plan is exactly what the doctrine says it should be — tight combat-box formation for mutual defensive fire, fighter escort as far as the fuel actually allows, a disciplined bomb run held steady over the ball-bearing works, and enough of a diversionary threat elsewhere to keep German fighter controllers guessing about which formation is the real one. What's decided here is how the staff effort behind each of those pieces gets weighted before Kepner's Thunderbolts reach the limit of their range near Aachen and the Luftwaffe's fighter wings — relayed in waves, landing to refuel and rearm before coming up again — find the bomber stream on its own for the rest of the way to Schweinfurt and back.",
                categories: [
                  { id: "formation", name: "Combat Box Discipline", meter: "manpower", glyph: "▣" },
                  { id: "escort", name: "Fighter Escort Coordination", meter: "fuel", glyph: "✈" },
                  { id: "targeting", name: "Precision Bomb-Run", meter: "initiative", glyph: "◎" },
                  { id: "diversion", name: "Diversionary Routing", meter: "manpower", glyph: "↝" },
                ],
                // Formation highest — LeMay's own combat box is the mission's whole defense once
                // the escort turns back, the single largest determinant of the loss rate; Escort
                // second — a real force multiplier, sharply limited by the fuel a P-47 without a
                // drop tank actually carries; Targeting third — necessary for the mission to mean
                // anything, but it doesn't keep a single bomber in the air; Diversion lowest,
                // deliberately — real value in drawing fighters off the real formation, but the
                // historical diversion drew none off at all, the same asymmetric-by-design choice
                // as PQ-17's Signals Intelligence or Kursk's Supply.
                effectiveness: { formation: 2.6, escort: 2.3, targeting: 2.0, diversion: 1.6 },
                categoryContext: {
                  formation:
                    "LeMay's combat box is the formation's entire defense once the escort turns back at Aachen. Box discipline means overlapping fire from every gun — stragglers get picked off alone. Each commitment here keeps the wings tight.",
                  escort:
                    "Kepner's Thunderbolts ride with the formation only as far as their fuel permits. No drop tanks yet to stretch that range. Every commitment here makes the handoff exact and buys whatever additional minutes of cover the range allows.",
                  targeting:
                    "General Eaker didn't dispatch nine groups to fly formation. He sent them to put bombs on the ball-bearing works. Each commitment holds the bomb run steady through the flak instead of releasing early just to escape it.",
                  diversion:
                    "The diversion force draws off exactly as many fighters as German controllers send after it. No more, no less. Worth something when committed. But never worth as much as the escort actually being there.",
                },
                flashups: {
                  formation: [
                    "A group tightens its box after a straggler starts falling behind.",
                    "Wingmen close the gap a fighter's pass opened in the formation.",
                    "A squadron leader waves his element back into tighter interval.",
                    "Gunners across the box coordinate fire onto a single fighter's pass.",
                    "A damaged Fortress is walked back into the formation's own defensive fire.",
                  ],
                  escort: [
                    "A flight of Thunderbolts peels off to break up a fighter group still forming up.",
                    "Kepner's fighters stretch past their briefed turnback point by a few precious minutes.",
                    "An escort flight catches a German fighter group still climbing for altitude.",
                    "Relief fighters arrive early enough to cover the handoff more cleanly than briefed.",
                    "A Thunderbolt pilot claims a fighter that was lining up on the lead group.",
                  ],
                  targeting: [
                    "A lead bombardier calls a correction that tightens his group's bomb pattern.",
                    "The formation holds its run through a first burst of flak rather than break early.",
                    "A navigator's course correction lines his group up cleaner for the final approach.",
                    "A group's bombs walk across the factory roofline instead of scattering short.",
                    "A second run is flown rather than waste the bombs on a spoiled first pass.",
                  ],
                  diversion: [
                    "The diversion force holds its own course, drawing fighters that never reach the main formation.",
                    "A feint toward the coast pulls a German fighter wing out of position.",
                    "The diversionary group reports fighters climbing to meet them instead of the bombers.",
                    "A spoof course change buys the main formation a few empty miles.",
                    "The diversion holds together long enough to still look like the real raid.",
                  ],
                },
                reportTimes: { open: "0715", contact: "0910", cats: ["1005", "1140", "1315", "1450"], reserve: "1620", counter: "0940" },
                idleLines: {
                  formation: [
                    "No extra effort goes into tightening the box. The formation holds whatever interval it already had.",
                    "Nothing is done to close the gaps a fighter's pass already opened.",
                  ],
                  escort: [
                    "The fighter escort flies its briefed profile and nothing more. No extra minutes are bought at the turnback line.",
                    "No additional coordination goes into the handoff. The escort turns back exactly on schedule.",
                  ],
                  targeting: [
                    "The bomb run gets no extra attention. Groups fly it exactly as briefed, nothing tightened.",
                    "No correction is called on the pattern. The run goes in however it happens to line up.",
                  ],
                  diversion: [
                    "The diversion flies its own track and nothing more elaborate is asked of it.",
                    "No extra effort goes into making the feint convincing. It draws whatever attention it draws on its own.",
                  ],
                },
                verdicts: ["The Formation Holds Together", "The Box Comes Apart"],
                verdictGrades: {
                  clean: "Formation, escort, bomb run, and diversion all held together at once — everything the mission could ask of a force this size, over a target defended this heavily.",
                  costly: "The force gets its bombs on the target and comes home in company, but every group paid more than the plan allowed for to make that happen.",
                  marginal: "The mission gets through, but not cleanly — losses mount past what the plan accounted for, and the formation that lands is not the one that took off.",
                  total: "The formation's own discipline doesn't survive contact intact — the losses are what there is to show for the day, whatever the bomb run itself achieved.",
                },
                counterattack: {
                  category: "formation",
                  severity: { headOnWaves: 2, rocketStandoff: 1, flakOverTarget: 1 },
                  warn: {
                    1: "Fighter controllers are vectoring multiple German wings onto the formation's track.",
                    2: "The lead groups report fighters massing for a coordinated pass from dead ahead.",
                  },
                  results: {
                    repulsed: "The attack is broken up before it presses home, and the formation holds its course intact.",
                    heldAtCost: "The formation holds together, at a cost in aircraft the box couldn't cover in time.",
                    broke: "The attack presses home through the box, and the formation takes losses it can't make good.",
                    gaveGround: "The lead group pulls the formation into a tighter, slower box rather than fight the attack out where it struck.",
                  },
                },
              },
              uncertain: [
                {
                  weight: 30,
                  title: "The early oil campaign draws blood",
                  impact: { manpower: -1, fuel: 2, initiative: 0 },
                  outcome:
                    "The disputed case breaks toward the doctrine's defenders: even without full escort, the early chokepoint campaign finds and damages enough of the German fuel and bearing supply chain to matter a year ahead of the historical schedule — a real, if costly, down payment on the 1944 oil campaign's eventual effect.",
                },
                {
                  weight: 70,
                  title: "The escorts that don't exist yet were the actual variable",
                  impact: { manpower: -2, fuel: 1, initiative: 0 },
                  outcome:
                    "The likelier reading, and the one most postwar analysis favors: the target logic was sound but the tool wasn't ready — 1943's unescorted daylight raids pay in bombers (Schweinfurt's second raid alone lost 60) without the sustained follow-up that only long-range escort made possible in 1944. The right idea, arriving a year before the hardware existed to make it survivable.",
                },
              ],
            },
            {
              label: "Let both doctrines run — cities by night, precision by day, no ruling between allies",
              advisor: { name: "Portal", quote: "The directive's genius is that it does not choose. Both air forces fly, both theories get tested, and no ally is told his war is wrong." },
              historical: true,
              setFlags: { pointblank43: "combined", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "sicilyHusky43",
              outcome:
                "What happened, substantially — Pointblank blessed both campaigns and adjudicated between neither. The area offensive burned German cities at a civilian cost in the hundreds of thousands across the war, and the postwar bombing surveys judged its effect on production smaller than claimed; the precision campaign found its decisive form only in 1944, once escorts arrived and oil became the priority. The directive's refusal to choose kept the coalition's air forces at peace with each other — historians still argue about what it cost in focus.",
            },
          ],
        };
        },
        get dodecanese43() {
          return {
          date: "SEPTEMBER – NOVEMBER 1943",
          title: "The Aegean Temptation",
          historicalRecord: true,
          situation:
            "With Italy's surrender, Churchill sees an Aegean door swinging open: the Italian-garrisoned Dodecanese islands — Rhodes, Kos, Leros — could be seized cheaply, pressuring Turkey toward the Allied camp and opening a Balkan flank. American planners want nothing to do with it: no carrier cover, German airpower dominant from Rhodes the moment they take it, and every landing craft in the theater already spoken for by Overlord's schedule. Churchill presses anyway, with mostly British forces. It is his Mediterranean thesis in miniature — and history's version supplies the test result." +
            (flags.forkRhodesWeak
              ? " One planning assumption looks softer than usual this week: aerial reconnaissance over Rhodes itself suggests the German garrison racing to secure it may be thinner than the historical order of battle assumed. Confidence in the estimate is, so far, limited."
              : ""),
          choices: [
            {
              label: "Launch the Aegean operation — seize the islands while the Italian surrender holds them open",
              advisor: { name: "Churchill", quote: "Rhodes for a battalion, Turkey for the war — improvisation is the whole art of the Mediterranean, and the door is open this week only." },
              historical: true,
              setFlags: { dodecanese43: "launch" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "anzio44",
              uncertain: [
                {
                  // Historical Divergence Mode: forkRhodesWeak doesn't force Rhodes to fall
                  // first, it nudges the odds — same pattern as forkEastAfricaSlow (italy),
                  // the established precedent for a fork touching an already-uncertain roll.
                  weight: modWeight(20, meters.fuel) + (flags.forkRhodesWeak ? 20 : 0),
                  title: "The improvisation lands",
                  impact: { manpower: 0, fuel: -1, initiative: 0 },
                  next: "turkishQuestion44",
                  outcome: flags.forkRhodesWeak
                    ? "The minority projection, made rather less of a minority this time: Rhodes itself is taken in the first rush — the historical operation's cardinal omission corrected, and helped along by a German garrison that turned out to be as thin as the reconnaissance suggested — and with its airfields denied to the Luftwaffe, the island chain holds. The Aegean flank becomes a standing German anxiety at modest cost, and Ankara notices exactly what Churchill wanted it to notice."
                    : "The minority projection: Rhodes itself is taken in the first rush — the historical operation's cardinal omission corrected — and with its airfields denied to the Luftwaffe, the island chain holds. The Aegean flank becomes a standing German anxiety at modest cost, and Ankara notices exactly what Churchill wanted it to notice.",
                },
                {
                  weight: 100 - (modWeight(20, meters.fuel) + (flags.forkRhodesWeak ? 20 : 0)),
                  title: "The lesson of Leros",
                  next: "aegeanReckoning43",
                  impact: { manpower: -2, fuel: -1, initiative: 0 },
                  outcome:
                    "Rhodes — the key to the whole position — was never taken; German forces secured it first, and from its airfields the Luftwaffe methodically reduced every island the British had occupied. Kos fell in a day; Leros followed after the war's last successful German airborne assault; some 4,800 British troops went into captivity, with six destroyers lost supporting them. The last clear British defeat of the war, incurred against American advice, for an object the Americans had said was not there — and Washington's response to being proven right is the next thing this command has to manage.",
                },
              ],
            },
            {
              label: "Decline the Aegean — the Mediterranean's margins stay closed, Overlord keeps its craft",
              advisor: { name: "Marshall", quote: "Not one American soldier is dying on those islands, and I would rather no British ones did either. The war is across the Channel." },
              setFlags: { dodecanese43: "decline", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "anzio44",
              outcome:
                "A plausible projection of the American veto applied in full: no Aegean operation, no Leros, and the landing craft and squadrons it consumed stay against Overlord's ledger. The historical episode's one clean lesson — that theater improvisations against land-based airpower without carrier cover end one way — goes unlearned at zero tuition, which is the best price for any lesson.",
            },
          ],
        };
        },
        get aegeanReckoning43() {
          return {
          date: "DECEMBER 1943",
          title: "What Washington Does With Being Right",
          historicalRecord: true,
          situation:
            "Marshall's staff said no carrier cover meant no operation worth attempting, in writing, before a single boot landed on Kos. Nearly five thousand British troops are now in German captivity and six destroyers are on the bottom of the Aegean, and the American position has been vindicated in the worst possible way — by the casualty list rather than the argument. The coalition's real test isn't whether the disaster happened; both capitals already know that. It's what London does with a defeat the other partner explicitly, formally, predicted.",
          choices: [
            {
              label: "Own it plainly — Churchill accepts the miscalculation to Roosevelt directly",
              advisor: { name: "Eden", quote: "The alternative to saying it ourselves is having Marshall's staff say it for us, in exactly the tone we'd deserve. Better it comes from the Prime Minister than from a memo." },
              historical: true,
              setFlags: { aegeanReckoning43: "honest" },
              cohesionDelta: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "anzio44",
              outcome:
                "The costlier short-term admission and the more durable coalition choice: acknowledging the miscalculation plainly costs real political capital at a moment London has little to spare, but it keeps the alliance's internal trust roughly where it was before Leros — which matters more than this one theater, given how many harder arguments about Italy, Overlord, and the Mediterranean's whole strategic weight are still ahead.",
            },
            {
              label: "Minimize it — frame the Aegean as a contained, low-cost probe rather than a defeat",
              advisor: { name: "Churchill", quote: "I did not survive 1940 by narrating every reverse at full volume. This was a probe. Probes sometimes fail. We will characterize it as such and move forward." },
              setFlags: { aegeanReckoning43: "minimize" },
              cohesionDelta: -1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "anzio44",
              outcome:
                "The cheaper short-term choice, and a transparent one: American planners tracked every landing craft and casualty report from this operation as closely as their own, and a British characterization of a five-thousand-man captivity list as a 'contained probe' persuades nobody in Washington who was paying attention — which, after being right in writing beforehand, is everyone who matters. The minimization costs less today and more the next time London needs to be believed.",
            },
          ],
        };
        },
        get turkishQuestion44() {
          return {
          date: "LATE 1943",
          title: "The Turkish Question",
          historicalRecord: false,
          situation:
            "An Aegean flank held against German airpower is exactly the leverage Churchill's whole Mediterranean thesis was built to produce: proof, sitting off Turkey's own coast, that the Allied position in the region is not the paper tiger Ankara has spent two years treating it as. Turkey has stayed neutral since 1939 by design, hedging against whichever side looked stronger. The Aegean flank is now a live argument for joining the war — how hard to press an argument that was never going to be settled by anything less than the war's own trajectory is what's actually on the table." +
            (flags.forkRhodesWeak
              ? " Ankara's own military attachés have noticed the same thing British planners did going in — that Rhodes fell faster than anyone briefed them to expect — and it's exactly the kind of detail that reads differently in a neutral capital weighing which side actually has the initiative."
              : ""),
          choices: [
            {
              label: "Press Ankara hard — full diplomatic weight behind Turkish belligerence now",
              advisor: { name: "Churchill", quote: "Turkey does not need to fight. Turkey needs to be seen deciding to fight, while there is still a choice left for anyone to notice." },
              historical: false,
              setFlags: { turkishQuestion44: "press" },
              cohesionDelta: -1,
              impact: { manpower: 0, fuel: -1, initiative: 1 },
              next: "turkishBelligerence44",
              outcome:
                "Turkey edges toward a declaration months before its historical February 1945 entry, mostly symbolic even here, since Ankara's own military has no intention of in fact fighting regardless of what the paperwork says. Washington reads the whole exercise as exactly the kind of political theater it always suspected Churchill's Mediterranean instincts were built from.",
            },
            {
              label: "Let the Aegean position speak for itself — no direct pressure, Turkey decides on its own clock",
              advisor: { name: "Eden", quote: "We do not need Ankara's soldiers. We need Ankara's airfields, eventually, and a country that feels courted rather than cornered gives those up more easily." },
              setFlags: { turkishQuestion44: "patient" },
              cohesionDelta: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "anzio44",
              outcome:
                "The quieter reading of the same leverage: Turkey's neutrality continues essentially on the historical schedule, unpressured and unresentful, its eventual token declaration arriving on its own clock rather than London's. Nothing about the war's outcome moves either way — Turkey's actual military contribution was always going to be nominal — but the relationship costs less to maintain than the harder press would have.",
            },
          ],
          };
        },
        get turkishBelligerence44() {
          return {
          date: "EARLY 1944",
          title: "What a Symbolic Declaration Is Actually Worth",
          historicalRecord: false,
          situation:
            "Ankara's declaration cost London real diplomatic capital and bought, on its own terms, very little — a paper belligerence Turkey's own general staff has no intention of backing with a single division. What it might buy for more capital spent is something with real strategic weight attached: Anatolian air bases near Adana would put the Ploesti oil fields, Romania's refineries and the single most heavily defended target on the strategic bombing target list, within a far shorter and less contested range than the long haul currently flown from Italian and Mediterranean fields. Whether Ankara will actually convert a symbolic declaration into basing rights on its own sovereign soil is a considerably harder ask than the declaration itself ever was.",
          choices: [
            {
              label: "Press further — formally request bomber basing rights near Adana for the Ploesti campaign",
              advisor: { name: "Eden", quote: "We have already spent the easy half of this relationship getting a signature that cost Ankara nothing. Basing rights cost them their neutrality's whole remaining value. I would not assume the second half is priced the same as the first." },
              checkLabel: "Fuel",
              disabledReason: meters.fuel <= -3 ? "insufficient fuel and construction capacity left to stand up a forward air base from nothing" : undefined,
              setFlags: { turkishBelligerence44: "pressBases" },
              impact: { manpower: 0, fuel: -2, initiative: 0 },
              next: "anzio44",
              uncertain: [
                {
                  weight: modWeight(30, meters.initiative),
                  title: "Ankara grants limited access",
                  setFlags: { turkishBasesResult: "granted" },
                  impact: { manpower: 0, fuel: 0, initiative: 1 },
                  outcome:
                    "The harder ask succeeds, narrowly and with conditions attached: a small forward field near Adana opens to bomber traffic bound for Ploesti, cutting the range and the fighter-escort problem meaningfully for exactly the raids that need it most. It is not the wholesale strategic pivot Churchill's original Mediterranean thesis imagined Turkish belligerence buying — it is one useful runway, granted by a government that made very clear this is the ceiling, not the floor.",
                },
                {
                  weight: 100 - modWeight(30, meters.initiative),
                  title: "Ankara declines — sovereignty was never the same offer as a signature",
                  setFlags: { turkishBasesResult: "refused" },
                  cohesionDelta: -1,
                  impact: { manpower: 0, fuel: -1, initiative: -1 },
                  outcome:
                    "The distinction Eden warned about turns out to be the real one: a declaration cost Ankara nothing it valued, and basing rights would have cost something it does. The request is declined, courteously and completely, and the diplomatic capital spent pressing for it doesn't come back — Ankara's neutrality was never actually for sale at the price this desk was offering.",
                },
              ],
            },
            {
              label: "Take the symbolic win and move on — don't spend more chasing rights Ankara was never going to grant",
              advisor: { name: "Churchill", quote: "A declaration on paper is worth exactly what it says on the paper, and I have learned this war not to demand a second miracle from a country that has already granted the first one for free." },
              favor: 1,
              setFlags: { turkishBelligerence44: "symbolicOnly" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "anzio44",
              outcome:
                "The more disciplined read of a relationship that already delivered what it was realistically going to deliver: the paper declaration stands as its own modest win, and nothing further gets asked of a neutral-in-practice government whose actual military contribution to this war was, by every serious estimate, always going to be nominal regardless of how the request was framed.",
            },
          ],
          };
        },

        get anzio44() {
          return {
          date: "JANUARY 1944",
          title: "Shingle — The End Run",
          historicalRecord: true,
          situation:
            "The Italian front is locked at the Gustav Line, and Monte Cassino is consuming divisions for yards. Churchill's answer is Operation Shingle: an amphibious end-run to Anzio, behind the Gustav Line, sixty kilometers from Rome — a landing that either unhinges the entire German position in central Italy or plants a besieged beachhead that has to be fed by sea for months. The plan's premise is speed off the beach; its risk is everything the word 'beachhead' has meant in this war so far." +
            (flags.turkishBasesResult === "granted"
              ? " Every bomber flying the Ploesti circuit off the new Adana field is one fewer competing for the transport and escort aircraft this landing also needs — a small, real claim on the same finite pool."
              : "") +
            (flags.secondFront42 === "torch"
              ? " Shingle is what fourteen months of the Mediterranean-first commitment this command argued for in 1942 has actually bought: enough landing craft and amphibious experience in-theater to attempt a maneuver like this one at all."
              : "") +
            (flags.forkAnzioWeak
              ? " Planners are treating one estimate with real caution rather than staking the landing's timing on it: aerial reconnaissance suggests the coastal garrison opposite the chosen beaches may be thinner than the historical planning assumption, though nobody is yet prepared to promise the beach itself stays that way."
              : ""),
          choices: [
            {
              label: "Launch Shingle — land at Anzio and unhinge the Gustav Line from behind",
              advisor: { name: "Churchill", quote: "I had hoped we were hurling a wildcat onto the shore. Let us make certain we do not instead land a stranded whale." },
              historical: true,
              setFlags: { anzio44: "launch" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: flags.dieppe42 === "cancel" ? "untestedDoctrine44" : "overlordPrep44",
              // Key Battle Subgame, battle #7 (round 15, "getting 10 battles"). Same unconditional-
              // add pattern as Kursk and Monte Cassino (uncertain[] already existed on this choice
              // before the subgame, so keyBattleSubgame is added directly rather than spread behind
              // KEY_BATTLE_SUBGAME_ENABLED — shipped builds never read keyBattleSubgame at all, and
              // check-battle-balance.js/check-reachability.js both evaluate with the flag false, so
              // the shipped graph is unaffected either way). The uncertain[] array below, its
              // weight formula, the Historical Divergence Mode fork on forkAnzioWeak, and both
              // branches' own next-routing are all left exactly as they were — this only adds an
              // allocation screen ahead of the existing roll, it doesn't change what the roll means.
              //
              // Bespoke amphibious-archetype categories, not the default land set: this is the
              // third amphibious-flavored subgame (after Omaha), and the real historical tension
              // here isn't beach resistance — the landing was almost unopposed — it's what this
              // choice's own outcome text already describes: how much of the corps pushes inland
              // while the roads are still open versus how much stays back to hold what's ashore.
              // All facts verified 2026-09-25 (Wikipedia, Battle of Anzio): H-Hour was roughly
              // 0200 on 22 January 1944, the landing achieved complete surprise against a coastal
              // garrison caught unprepared, and a US patrol reportedly reached the outskirts of
              // Rome itself before turning back; Kesselring received word at 0300 and issued
              // Operation "Richard" at 0500, ordering Kampfgruppe elements of the 4th Parachute
              // Division and the Hermann Göring Fallschirm Panzer Division to block the roads to
              // the Alban Hills via Campoleone and Cisterna; by 24 January the Germans had over
              // 40,000 troops in place, including the 3rd Panzer Grenadier and 71st Infantry
              // Divisions, and von Mackensen's 14th Army took over the defense on 25 January —
              // "within twenty-four hours, the Germans had a complete but thin defensive line
              // around the beachhead." Major General Lucian K. Truscott Jr. commanded the US 3rd
              // Infantry Division and later argued the inland thrust toward Valmontone "would have
              // accomplished in full" the operation's aims; Major General Ronald Penney commanded
              // the British 1st Infantry Division; Colonel William O. Darby's 6615th Ranger Force
              // took the port of Anzio itself on the landing's first day.
              concealRoll: true,
              keyBattleSubgame: {
                id: "anzio44",
                title: "Order of Battle — The Beachhead's First Hours",
                flavor:
                  "Ashore before dawn against almost no opposition — the surprise is total, a forward patrol reportedly reaching the outskirts of Rome itself before turning back. What happens next is the entire question Shingle was built to answer: how much of this corps pushes inland now, while the roads to the Alban Hills are still open, and how much stays back to hold the beach it will need for however long this actually takes. Somewhere behind the German lines, an order is already moving to close that door. What's decided here is how the infantry, the tanks, Darby's Rangers, and the buildup off two hundred and forty ships are weighed against each other before it does.",
                categories: [
                  { id: "assault", name: "Infantry Beachhead", meter: "manpower", glyph: "◆◆◆" },
                  { id: "armor", name: "Armored Exploitation", meter: "fuel", glyph: "▲" },
                  { id: "rangers", name: "Ranger & Commando Vanguard", meter: "manpower", glyph: "✦" },
                  { id: "naval", name: "Naval Gunfire & Buildup", meter: "fuel", glyph: "≋" },
                ],
                // Armor highest — the exploitation column is what could actually unhinge the
                // Gustav Line's rear before the roads close; Rangers second — a small, aggressive
                // vanguard, historically the first element to take an objective (the port) outright;
                // assault third — the numerical bulk of the corps, but holding ground rather than
                // taking it; naval lowest, deliberately — real and necessary (everything the corps
                // uses comes off those ships), but it is buildup and support, not what decides
                // whether the door stays open, the same design choice as Omaha's Air or Monte
                // Cassino's Supply.
                effectiveness: { assault: 1.8, armor: 2.8, rangers: 2.4, naval: 1.6 },
                categoryContext: {
                  assault:
                    "The 3rd Division and British 1st are ashore against minimal opposition. The question isn't how many men fit on the beach — it's how many stay to hold the line versus how many push forward with the rest.",
                  armor:
                    "Tanks are ashore. The roads to the Alban Hills are open now. Every hour spent deciding is an hour Kesselring's counter-order gets closer to closing that door.",
                  rangers:
                    "Darby's Rangers took the port this morning without firing. Pushed ahead of the main line, they're the fastest way to see how far this beachhead can actually run before hitting something solid.",
                  naval:
                    "Two hundred and forty ships are standing off the beach. Everything this corps eats, shoots, drives — all of it comes from those ships. Weight here is what keeps everything else moving past the first day.",
                },
                flashups: {
                  assault: [
                    "The 3rd Division's lead battalions push their line out from the beach without meeting a shot.",
                    "British 1st Division troops come ashore behind their own start line, dry and unopposed.",
                    "A forward platoon reports the ground ahead clear all the way to the first crossroads.",
                    "The beachhead perimeter pushes out another few hundred yards before digging in.",
                    "A patrol finds the road to Campoleone open and undefended, for now.",
                  ],
                  armor: [
                    "A tank column rolls off the beach and turns north on the road toward the Alban Hills.",
                    "Sherman tanks push past the start line without a German gun to answer them.",
                    "The lead armored element reports it could reach the hills by dark at this rate.",
                    "A tank platoon stops at a forward dump to refuel rather than push on unsupported.",
                    "Armor probes forward along the road to Cisterna and finds it still open.",
                  ],
                  rangers: [
                    "Darby's Rangers secure the port of Anzio before the town's garrison can react.",
                    "A Ranger patrol pushes well ahead of the main line, looking for the first sign of resistance.",
                    "Commandos clear the coast road north of the beachhead without a shot fired.",
                    "A Ranger company reports the crossroads ahead still undefended.",
                    "The vanguard element radios back that it has outrun its own flank security.",
                  ],
                  naval: [
                    "Another wave of landing craft threads through the anchorage and grounds on the beach.",
                    "A cruiser stands off the coast, guns laid on the approaches, still unfired.",
                    "The buildup continues over open beach — no port yet secured for deep-draft ships.",
                    "A supply officer reports the beachhead dump growing faster than the roads can clear it.",
                    "Destroyers screen the anchorage against the first German air reconnaissance of the day.",
                  ],
                },
                reportTimes: { open: "0200", contact: "0630", cats: ["0900", "1200", "1500", "1800"], reserve: "2000", counter: "2200" },
                idleLines: {
                  assault: [
                    "No infantry moves beyond the start line. The beachhead stays exactly its first-hour size.",
                    "The perimeter holds where it landed. Nobody is pushing it further out.",
                  ],
                  armor: [
                    "The tanks stay parked above the beach. Whatever window the roads offer, nothing is using it.",
                    "No armored column moves. The roads inland stay whatever the enemy leaves them.",
                  ],
                  rangers: [
                    "The Rangers hold the port and go no further. Nobody is out ahead finding out what's coming.",
                    "No vanguard element moves forward. The beachhead's flanks are whatever the main line already covers.",
                  ],
                  naval: [
                    "The buildup stalls. What's already ashore is what there is to work with.",
                    "No further landing craft come in. The dump behind the beach stops growing.",
                  ],
                },
                verdicts: ["The Roads Stay Open", "The Ring Closes First"],
                verdictGrades: {
                  clean: "Every arm moved together — infantry, armor, and the vanguard ahead of it — before the door had a chance to shut.",
                  costly: "The roads stay open, but holding the ground past them costs more than the plan allowed for.",
                  marginal: "The advance stalls short of the hills. The beachhead holds; the breakout doesn't.",
                  total: "The advance doesn't stall so much as never really start — the beachhead is what there is to show for the day.",
                },
                counterattack: {
                  category: "armor",
                  severity: { richardOrder: 2, windowStillOpen: 1, thinCordon: 1 },
                  warn: {
                    1: "A German blocking force is reported moving toward the roads out of the beachhead.",
                    2: "Kampfgruppe elements of the Hermann Göring and 4th Parachute Divisions are closing on the roads to Campoleone and Cisterna.",
                  },
                  results: {
                    repulsed: "The blocking force is brushed aside and the roads stay open.",
                    heldAtCost: "The roads stay open, but the column that forced them through is badly thinned doing it.",
                    broke: "The German blocking force seals the roads before the column can force them.",
                    gaveGround: "The column pulls back onto the beachhead rather than force roads that are no longer open.",
                  },
                },
              },
              uncertain: [
                {
                  // Historical Divergence Mode: forkAnzioWeak nudges this roll's odds the same
                  // way forkEastAfricaSlow (italy) established the pattern — it doesn't force
                  // the wildcat to run, it makes the plan's own premise more likely to hold.
                  weight: modWeight(35, meters.manpower) + (flags.forkAnzioWeak ? 20 : 0),
                  title: "The wildcat runs",
                  impact: { manpower: 0, fuel: -1, initiative: -1 },
                  next: "romeDividend44",
                  outcome: flags.forkAnzioWeak
                    ? "This resolves to the version the plan promised, and for once the coastal garrison estimate turns out to be the one worth trusting: the landing force drives inland off a beach even thinner-held than briefed — the historical corps commander's caution, much criticized since, replaced here by the aggression the plan's logic demanded — and the Gustav Line's rear is compromised before Kesselring can seal the beachhead. Rome falls months early, undamaged, and with divisions still intact that the historical four-month siege spent instead."
                    : "This resolves to the version the plan promised: the landing force drives inland off an undefended beach in its first days — the historical corps commander's caution, much criticized since, replaced here by the aggression the plan's logic demanded — and the Gustav Line's rear is compromised before Kesselring can seal the beachhead. Rome falls months early, undamaged, and with divisions still intact that the historical four-month siege spent instead.",
                },
                {
                  weight: 100 - (modWeight(35, meters.manpower) + (flags.forkAnzioWeak ? 20 : 0)),
                  title: "The stranded whale",
                  next: "anzioSiege44",
                  impact: { manpower: -2, fuel: -1, initiative: 0 },
                  outcome:
                    "The landing achieved total surprise — and then consolidated on the beach while Kesselring, reacting with the speed the Italian campaign had taught everyone to expect, sealed the perimeter within days. Anzio became a four-month siege of the attackers: a beachhead under continuous observation and artillery fire, supplied by sea, that unhinged nothing until the spring offensive finally linked up with it. Churchill's whale line was his own bitter verdict on the result — and the four months the verdict describes are not a footnote this campaign skips past.",
                },
              ],
            },
            {
              label: "Cancel Shingle — grind the Gustav Line frontally, keep the landing craft for Overlord",
              advisor: { name: "Marshall", quote: "Every LST in that plan is an LST the Channel needs in June. Italy is a holding attack; I decline to let it hold our invasion hostage." },
              setFlags: { anzio44: "cancel" },
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: flags.dieppe42 === "cancel" ? "untestedDoctrine44" : "overlordPrep44",
              outcome:
                "One considered account of the American preference: the landing craft — the war's true limiting currency — go north on schedule and the Italian front stays a frontal grind at Cassino, slower and grimmer but no longer betting a corps on a beach. Rome waits for summer. The Overlord buildup gains margin exactly where the historical plan spent it.",
            },
          ],
        };
        },
        get anzioSiege44() {
          return {
          date: "FEBRUARY – MAY 1944",
          title: "Four Months on the Beach",
          historicalRecord: true,
          situation:
            "The beachhead is real, and so is the ring around it — Kesselring's forces hold the high ground overlooking every square meter of the perimeter, and 'Anzio Annie,' the German railway guns, can reach any point on the beach on a schedule the garrison has learned to live by. Truscott's corps is dug in, resupplied by sea under constant artillery observation, in a position some staff officers privately compare to Gallipoli. The question that recurs every week of this siege, and never gets easier to answer: is a breakout attempt worth the losses it would cost against a ring this dug in, or does patience — waiting for the Gustav Line's own collapse to unlock the perimeter from outside — actually cost less blood in the end?" +
            (flags.forkAnzioWeak
              ? " The garrison that was reportedly thin on landing day is not the ring holding this beachhead now — whatever briefing suggested the coast was lightly held, Kesselring's reinforcement since has made the point moot for everyone still pinned down here."
              : "") +
            // Round 15 (battle #7 echo): this is the "stranded whale" branch — the ring closed
            // before the column forced the roads, which is exactly why this beachhead is a
            // four-month siege now rather than a corps already past the Alban Hills.
            keyBattleEcho("anzio44", flags),
          choices: [
            {
              label: "Attempt an early breakout — test the ring before Kesselring reinforces it further",
              advisor: { name: "Truscott", quote: "Every week we wait, that ring gets thicker, not thinner. I would rather spend men testing it now than watch it become untestable by June." },
              historical: false,
              setFlags: { anzioSiege44: "breakout" },
              favor: -1,
              impact: { manpower: -2, fuel: -1, initiative: 1 },
              next: flags.dieppe42 === "cancel" ? "untestedDoctrine44" : "overlordPrep44",
              uncertain: [
                {
                  weight: modWeight(20, meters.manpower),
                  title: "The ring has a seam",
                  impact: { manpower: -1, fuel: 0, initiative: 1 },
                  outcome:
                    "The narrower case: a probing attack finds a genuine weakness in the German line before it can be reinforced, and the beachhead's perimeter expands enough to relieve the worst of the observed-fire problem, months ahead of the historical May breakout. It doesn't end the siege — Rome is still Rome, and the Gustav Line is still the Gustav Line — but it changes what four more months on this beach actually costs.",
                },
                {
                  weight: 100 - modWeight(20, meters.manpower),
                  title: "The ring holds, at real cost",
                  impact: { manpower: -3, fuel: -1, initiative: -1 },
                  outcome:
                    "What most operational histories of Anzio conclude an early attempt would have produced: German reserves respond fast enough to seal any local gain, and the attacking force absorbs real casualties testing a ring that historical patience judged, correctly if bitterly, not yet breakable. The perimeter holds its historical shape. The corps that tested it holds less of itself than it did.",
                },
              ],
            },
            {
              label: "Hold and build strength — wait for the coordinated offensive that finally breaks the whole line",
              advisor: { name: "Alexander", quote: "This beach breaks out once, properly coordinated with the main offensive, or it bleeds itself testing the ring piecemeal for four months first. I have chosen once." },
              historical: true,
              setFlags: { anzioSiege44: "patient" },
              favor: 1,
              impact: { manpower: 1, fuel: -1, initiative: -1 },
              next: flags.dieppe42 === "cancel" ? "untestedDoctrine44" : "overlordPrep44",
              outcome:
                "What actually happened, and the historical verdict on it is more mixed than the siege's grim four months suggests: holding the perimeter, resupplying under fire, and building strength for a single coordinated breakout — timed with the Gustav Line's own collapse in May — is what finally unhinged the entire German position in central Italy at once, rather than spending the beachhead's strength in pieces against a ring that had four months to prepare for exactly that. Patience cost the siege's own long casualty list. It's a separate, harder question whether impatience would have cost less.",
            },
          ],
        };
        },
        get romeDividend44() {
          return {
          date: "SPRING 1944",
          title: "What an Early Rome Buys",
          historicalRecord: false,
          situation:
            "Rome falls months ahead of schedule, undamaged, with the divisions that historically spent four months pinned at Anzio's perimeter still intact and available. It is the rarest thing this theater ever produces: a genuine surplus, arriving with Overlord's own preparation still weeks from complete. What an Italian campaign that finished early is actually for is a problem this desk has never had to solve before." +
            // Round 15 (battle #7 echo): this is the "wildcat runs" branch — the column forced
            // the roads before the ring closed, which is the whole reason this surplus exists.
            keyBattleEcho("anzio44", flags),
          choices: [
            {
              label: "Push north hard — Florence, the Gothic Line, and see how far intact divisions can carry the momentum",
              advisor: { name: "Alexander", quote: "I have wanted this force for two years and never once had it. I am not handing it back to the reserve pool the week I finally do." },
              historical: false,
              setFlags: { romeDividend44: "push" },
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "gothicLineEarly44",
              outcome:
                "The theater commander's own instinct, given a resource he never actually had historically: the pursuit continues north with real weight behind it, and the Gothic Line — the Apennine defenses the historical campaign spent a grinding winter against — meets an Allied force arriving with momentum and manpower both, rather than the historical exhausted one. Italy still isn't where the war ends. It is, unusually, not where it stalls either.",
            },
            {
              label: "Bank the dividend — divert the freed divisions to reinforce Overlord and the southern France landing",
              advisor: { name: "Marshall", quote: "Italy was always a sideshow that happened to be necessary. An early surplus there belongs on the beach that really ends the war, not chasing another Italian ridge line." },
              historical: false,
              setFlags: { romeDividend44: "divert" },
              cohesionDelta: 1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: flags.dieppe42 === "cancel" ? "untestedDoctrine44" : "overlordPrep44",
              outcome:
                "The strategically disciplined answer, and the one every American planner who ever grumbled about the Mediterranean's claim on landing craft and divisions would recognize instantly: the freed Italian divisions redirect to the main effort, arriving in France with a strength the historical campaign's slower, costlier version never had spare to send. Rome's early fall pays its dividend somewhere else entirely — which was rather the point of demanding it be spent that way.",
            },
          ],
          };
        },
        get gothicLineEarly44() {
          return {
          date: "SPRING 1944",
          title: "The Gothic Line, Tested Early",
          historicalRecord: false,
          situation:
            "The Apennine defenses that historically absorbed a grinding, exhausted Allied army through an autumn and winter that stretched into spring 1945 are facing something they never actually had to answer this soon: a force arriving with momentum and manpower both, months ahead of the historical schedule, while a full campaigning season still lies ahead rather than behind. Kesselring's defense in depth was built to grind down whatever reached it, not to withstand a first assault at full strength this early — whether an intact army can actually break the line now, rather than simply reach it in autumn and stall the way the historical one did, is a genuinely open question the theater has never gotten to ask under these conditions." +
            (meters.fuel <= -3
              ? " The fuel arithmetic answers part of the question before the staff finishes briefing it — there isn't enough left in the tanks to sustain a full-weight breakthrough attempt against defenses this deep."
              : ""),
          choices: [
            {
              label: "Commit to a full-weight breakthrough attempt while the season is still fully open",
              advisor: { name: "Alexander", quote: "I will not get this combination of intact divisions and a whole season still ahead of me twice in one war. If the line breaks this year, it breaks now, while there's a spring and a summer left to exploit it, not in the autumn mud the historical campaign was stuck fighting in." },
              checkLabel: "Fuel",
              disabledReason: meters.fuel <= -3 ? "insufficient fuel to sustain a full-weight breakthrough attempt against defenses this deep" : undefined,
              setFlags: { gothicLineEarly44: "breakthrough" },
              impact: { manpower: -2, fuel: -2, initiative: 1 },
              next: flags.dieppe42 === "cancel" ? "untestedDoctrine44" : "overlordPrep44",
              uncertain: [
                {
                  weight: modWeight(35, meters.manpower),
                  title: "The line actually breaks",
                  setFlags: { gothicLineEarlyResult: "broken" },
                  impact: { manpower: 0, fuel: -1, initiative: 2 },
                  outcome:
                    "The genuinely rare outcome this theater's history never produced: Kesselring's defense in depth, built for a slower and more exhausted attacker arriving in autumn, doesn't hold against a full-strength assault arriving in spring with a whole season still ahead of it. The Po Valley opens ahead of the historical schedule by more than half a year — Italy's northern industrial heartland reachable while the historical campaign was still months from even reaching the line at all.",
                },
                {
                  weight: 100 - modWeight(35, meters.manpower),
                  title: "The line holds anyway — depth outlasts the extra strength",
                  setFlags: { gothicLineEarlyResult: "held" },
                  impact: { manpower: -1, fuel: 0, initiative: -1 },
                  outcome:
                    "The terrain and Kesselring's layered defense turn out to matter more than which season or which army's condition meets them: the line bends further and costs the defenders more than a fresh, unprepared position historically would have, but it holds regardless, and the theater settles into a contest that will still likely resolve closer to the historical autumn than either side would have guessed from this spring's opening position — arrived at with a stronger Allied army and a more thoroughly tested German one than history actually produced this early.",
                },
              ],
            },
            {
              label: "Advance to contact and consolidate — probe the line without committing to a full breakthrough bid",
              advisor: { name: "Clark", quote: "I have watched this theater punish full commitments before. I would rather learn what this line actually is before I spend an intact army finding out the hard way." },
              favor: 1,
              setFlags: { gothicLineEarly44: "probe" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: flags.dieppe42 === "cancel" ? "untestedDoctrine44" : "overlordPrep44",
              outcome:
                "The more cautious read of an army this theater has never had spare before: rather than spend it testing the Gothic Line's real depth in one uncertain push, the advance stops at contact, banking the terrain and the intelligence the historical campaign had to buy at much higher cost, and leaving the actual breakthrough question for the autumn this force will now meet in considerably better shape — rested, resupplied, and already dug in on ground the historical campaign spent months just fighting toward.",
            },
          ],
          };
        },

        get overlordPrep44() {
          return {
          date: "SPRING 1944",
          title: "The Transportation Plan",
          historicalRecord: true,
          situation:
            "Overlord's air preparation forces an argument with a moral dimension the planning papers state plainly: the Transportation Plan proposes systematically destroying the French and Belgian rail network — marshalling yards, bridges, junctions — to isolate Normandy from German reinforcement. It will work; the modelling is solid. It will also kill French and Belgian civilians in the towns around every target, in numbers the planners estimate in the tens of thousands. Churchill is truly disturbed and says so to Roosevelt; the airmen counter that every German division delayed is measured in Allied soldiers alive on the beaches." +
            (flags.gothicLineEarlyResult === "broken"
              ? " This planning session is competing for attention with a theater that, unusually, doesn't need any right now — the Gothic Line broke in the spring, months ahead of anyone's schedule, and Italy has stopped being the theater this room has to worry about."
              : flags.gothicLineEarlyResult === "held"
              ? " Italy is still a live claim on this planning's attention — the early Gothic Line push cost real strength without the breakthrough it was gambling on, and that theater isn't finished asking for resources this room would rather spend here."
              : ""),
          choices: [
            {
              label: "Execute the Transportation Plan in full — isolate Normandy, accept the civilian cost",
              advisor: { name: "Tedder", quote: "I can give you a battlefield the German army cannot reach for weeks. The price is written on the plan and I will not pretend otherwise." },
              historical: true,
              setFlags: { overlordPrep: "transport" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "omahaCrisis44",
              outcome:
                "The rail campaign shattered German operational mobility in the west — divisions that should have reached Normandy in days took weeks, arriving piecemeal and exhausted, and most assessments rank it among the invasion's decisive enablers. French and Belgian civilian deaths from the pre-invasion air campaign are estimated in the tens of thousands — allied civilians, killed by allied bombs, in a calculation their governments-in-exile were consulted on and accepted.",
            },
            {
              label: "Restrict the plan — hit only targets clear of population centers, accept a slower isolation",
              advisor: { name: "Churchill", quote: "We are proposing to liberate France by way of burying rather a lot of it. I ask only whether every one of these yards is worth its town." },
              setFlags: { overlordPrep: "restricted" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "omahaCrisis44",
              outcome:
                "A speculative reading of the restriction Churchill pressed for: a target list culled of its most populated environs kills fewer of the civilians the invasion comes to liberate — and isolates Normandy more slowly and less completely, which is paid for on and after the beaches in German divisions arriving days earlier than the historical schedule allowed. The moral arithmetic does not simplify in either direction; this path simply weights it differently.",
            },
          ],
        };
        },
        get omahaCrisis44() {
          return {
          date: "JUNE 6, 1944 — MORNING",
          title: "Omaha",
          historicalRecord: false,
          situation:
            "The reports reaching V Corps by mid-morning are grim. The bombers overshot, the swimming tanks that were supposed to reach the sand ahead of the infantry mostly haven't, and the defenders on the bluffs above the beach are pouring fire into a strip of sand with almost no cover. Bradley, watching from offshore, is weighing whether to divert the follow-on waves to Utah and the British beaches and write Omaha off as a coordinated landing for today. Nothing on the beach has broken yet. The men at the shingle aren't moving, the destroyers are standing off in deep water, and the landing schedule won't wait for either to change.",
          choices: [
            {
              label: "Feed the follow-on waves into Omaha regardless — commit further rather than divert",
              advisor: { name: "Bradley", quote: "I did not come this far to explain to Marshall why I left a corps to die on a beach because the morning went badly. We go in again." },
              historical: true,
              setFlags: { omahaCrisis44: "committed" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "falaise44",
              outcome:
                "The closest this campaign comes to the actual morning of June 6th: naval gunfire, and the accumulating weight of men who have nowhere else to go, eventually break the deadlock roughly on the historical timeline. It costs what it cost historically — Omaha remains the bloodiest of the five beaches by a wide margin — but the lodgment consolidates without the extended crisis the diverted path produces. History, it turns out, was already the version of this morning where the follow-on waves kept coming.",
              // Key Battle Subgame, battle #2 (round 9 — Craig: "6 (D-Day)"). Dev build ONLY: the
              // spread below is empty when KEY_BATTLE_SUBGAME_ENABLED is false, so the shipped
              // game keeps this choice exactly as it was (deterministic, straight to falaise44),
              // and the audit tools — which evaluate with the flag false — see the shipped graph.
              // Built from the Allied side rather than the German campaign's Normandy node: the
              // German choices there turn on whether anyone woke Hitler, which no allocation of
              // effort can meaningfully affect; Bradley's morning is a real resource crisis, and
              // the node's own premise (the rally that broke Omaha doesn't arrive on its own) is
              // exactly the question the subgame asks — can the weight you commit force it?
              // The failure branch routes into omahaIsolated44, the same "beach that didn't link
              // up" evening the diverted path already reaches, with flag-conditional wording
              // there so it reads right when the waves WERE committed. All facts in the config
              // verified 2026-09-21 against Wikipedia's Omaha Beach article: the second wave at
              // 07:00, the tide covering the uncleared obstacles, six of sixteen gaps cleared at
              // over 40% engineer casualties, bombers overshooting in overcast ("only three bombs
              // fell near the beach area"), 27 of 29 of one battalion's DD tanks swamped, the
              // 09:50 order sending destroyers in close, and the five draws as the only exits.
              ...(KEY_BATTLE_SUBGAME_ENABLED
                ? {
                    concealRoll: true,
                    keyBattleSubgame: {
                      id: "omaha",
                      title: "Order of Battle — Omaha, Mid-Morning",
                      flavor:
                        "Mid-morning, and the tide is coming in over the obstacles the engineers never cleared. The bombers dropped their loads inland through the overcast, most of one battalion's swimming tanks went down on the way in, and fire from the bluffs is sweeping a beach with nowhere to hide. The decision to keep the waves coming is made. What's left is how the weight behind them lands: how many more go at the sand, how close the destroyers are sent in, how much goes to the engineers and tanks trying to open the exits, and what the aircraft overhead can do through the cloud.",
                      categories: [
                        { id: "waves", name: "Follow-on Waves", meter: "manpower", glyph: "▮▮▮" },
                        { id: "naval", name: "Naval Gunfire", meter: "fuel", glyph: "≋" },
                        { id: "engineers", name: "Engineers & Tanks", meter: "fuel", glyph: "▨" },
                        { id: "air", name: "Air Support", meter: "fuel", glyph: "✈" },
                      ],
                      // Naval gunfire strongest (the destroyers closing in is what the record
                      // credits with breaking the strongpoints), engineers second (the exits are
                      // the only way off the beach), infantry baseline, air weakest (overcast).
                      effectiveness: { waves: 1.8, naval: 3, engineers: 2.6, air: 1.6 },
                      categoryContext: {
                        waves:
                          "The first waves are pinned against the shingle bank. The second came in at seven onto the same fire. Adding more men puts more on the sand. Whether it creates pressure on the bluffs depends on what's supporting them.",
                        naval:
                          "Destroyers have held offshore for fear of the shallows. Moved in close, they can fire straight into embrasures — at real risk of running aground.",
                        engineers:
                          "Gap assault teams were tasked with blowing sixteen lanes through the obstacles. Six are open now, at cost of four in ten men in those teams. The tide is covering the rest.",
                        air:
                          "The heavy bombers overshot in the overcast. Hardly a bomb fell near the beach. Fighter-bombers are overhead, but the cloud is low and the targets small.",
                      },
                      // Round 12 (Craig's item #5, "richer dispatch text"): expanded from 3
                      // variants to 5 per category, same illustrative-texture rule as Kursk's —
                      // consistent with what this node already establishes, no new specific
                      // claims invented here.
                      flashups: {
                        waves: [
                          "Another wave grounds on the sandbar and wades in under fire.",
                          "Men pile up behind the shingle bank with nowhere to go but forward.",
                          "A handful of men work up the bluff between two strongpoints.",
                          "A boat team scatters and re-forms fifty yards down the beach.",
                          "A sergeant gets a dozen men moving off the sand by himself.",
                        ],
                        naval: [
                          "A destroyer turns parallel to the beach, guns firing at the bluffs.",
                          "An embrasure on the bluff goes silent under direct fire from offshore.",
                          "Naval fire walks along the mouth of a draw.",
                          "A destroyer's keel scrapes bottom as it closes another hundred yards.",
                          "Spotters ashore correct fire onto a strongpoint by radio.",
                        ],
                        engineers: [
                          "Engineers blow another lane through the obstacles before the tide covers it.",
                          "A tank that made it ashore fires into an embrasure at point-blank range.",
                          "A demolition charge goes up early and takes its team with it.",
                          "A bulldozer tank drags wire clear of a half-opened lane.",
                          "The tide reaches a lane marked but not yet cleared.",
                        ],
                        air: [
                          "Fighter-bombers hunt for targets through gaps in the overcast.",
                          "The cloud hides the bluffs from the aircraft circling overhead.",
                          "Nothing German flies over the beach all morning.",
                          "A fighter-bomber makes a low pass at a strongpoint and finds the cloud again.",
                          "Radio traffic overhead argues about targets nobody below can mark for them.",
                        ],
                      },
                      // Round 10. The counterattack is sourced to the one that actually came
                      // (Wikipedia, Omaha Beach): "a battalion was detached from the 915th
                      // Regiment... Along with an anti-tank company... committed to a
                      // counterattack in the Colleville area in the early afternoon" — hence 1330
                      // and the heavier warning when the 352nd is the posture. The 352nd's main
                      // reserve (Kampfgruppe Meyer) was sent toward the British sector and never
                      // reached Omaha, so it deliberately isn't used here.
                      reportTimes: { open: "0930", contact: "0940", cats: ["1000", "1030", "1100", "1200"], reserve: "1245", counter: "1330" },
                      // Round 12: pooled, same as Kursk's.
                      idleLines: {
                        waves: [
                          "No new waves are coming in. The men at the shingle are on their own.",
                          "The follow-on boats hold offshore. Nobody new is landing.",
                        ],
                        naval: [
                          "The destroyers are still out in deep water. The strongpoints fire unanswered.",
                          "No naval fire is called in. The bluffs answer every strongpoint on their own.",
                        ],
                        engineers: [
                          "Nobody is clearing the obstacles. The exits stay shut.",
                          "The demolition teams stay back. The obstacle belt is untouched.",
                        ],
                        air: [
                          "Nothing overhead to call on. The bluffs are left to the men on the ground.",
                          "No aircraft answer the call for support. The overcast keeps them away.",
                        ],
                      },
                      verdicts: ["The Bluffs Are Broken", "The Beach Holds Against You"],
                      // Round 13, item #1: quality-graded subtitle under the verdict heading —
                      // same grade logic as Kursk's, see computeBattlePlanCosts.
                      verdictGrades: {
                        clean: "Every element came together at once — naval fire, engineers, and the waves behind them.",
                        costly: "The bluffs are broken, but the beach paid for every yard of it.",
                        marginal: "The beach holds, but only barely. Another wave in the right place might have turned it.",
                        total: "The beach holds, and holds hard — nothing here breaks it today.",
                      },
                      counterattack: {
                        category: "waves",
                        severity: { fieldDivision: 2, strongpointsIntact: 1, thinGarrison: 1 },
                        warn: {
                          1: "A German counterattack is forming against the men on the bluff top near Colleville.",
                          2: "A German battalion with anti-tank guns is coming in against the bluff top near Colleville.",
                        },
                        results: {
                          repulsed: "The men on the bluff top stop the counterattack cold.",
                          heldAtCost: "The bluff top holds, but the companies up there are shot to pieces.",
                          broke: "The counterattack drives the forward companies back down toward the shingle.",
                          gaveGround: "The forward companies pull back to the bluff edge and hold there.",
                        },
                      },
                    },
                    uncertain: [
                      {
                        // Round 10 (item 7, Craig: bad planning should be able to ruin the
                        // battle): base lowered from 60 to 45. Simulated at neutral Manpower: a
                        // plan suited to the posture wins ~63-73%, a balanced one ~60%, a bad
                        // one ~40%. Previously a good plan reached the 90s and almost nothing lost.
                        weight: modWeight(45, meters.manpower),
                        title: "The bluffs break by afternoon",
                        impact: { manpower: -1, fuel: 0, initiative: 0 },
                        outcome:
                          "Naval gunfire, and the weight of men with nowhere to go but forward, break the deadlock on the bluffs by early afternoon. It costs what Omaha was always going to cost — the bloodiest of the five beaches by a wide margin — but by nightfall there is a foothold on the high ground above the beach, thin in places, but real.",
                      },
                      {
                        weight: 100 - modWeight(45, meters.manpower),
                        title: "The beach holds against you into the evening",
                        setFlags: { omahaCrisis44: "stalled" },
                        next: "omahaIsolated44",
                        impact: { manpower: -2, fuel: 0, initiative: -1 },
                        outcome:
                          "The follow-on waves keep coming and the beach keeps taking them. By evening the other four beaches have joined into something like a single lodgment, and Omaha is still a narrow strip of sand under the bluffs. Keeping the waves coming was not the wrong order. The morning simply never produced the moment that broke the bluffs, and V Corps ends the day with far less ashore, and far less depth, than the plan called for.",
                      },
                    ],
                  }
                : {}),
            },
            {
              label: "Divert the follow-on strength to Utah and the British sector — leave V Corps to fight its own crisis",
              advisor: { name: "Kirk", quote: "I can put more weight ashore where it's actually moving, or I can pour it onto a beach that isn't. That's not a hard order to give. It is a hard one to live with." },
              setFlags: { omahaCrisis44: "diverted" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "omahaIsolated44",
              outcome:
                "The diversion is the harder-nosed and, on paper, the more defensible order — it puts strength where it's working rather than where it isn't. It also leaves V Corps to solve Omaha with what's already ashore, no reinforcement coming until the crisis resolves on its own terms. Utah and the British beaches consolidate close to schedule. What that decision costs shows up over the next two days, not this morning.",
            },
          ],
        };
        },
        get omahaIsolated44() {
          return {
          date: "JUNE 6, 1944 — LATE AFTERNOON",
          title: "The Beach That Didn't Link Up",
          historicalRecord: false,
          situation:
            "By evening, four of the five invasion beaches have joined into something recognizable as a single Allied lodgment. Omaha hasn't — V Corps holds perhaps a mile and a half of coastline and very little depth, its own follow-on schedule badly behind, with a real gap on the map between it and the nearest British units to the east. Naval gunfire keeps German armor from closing that gap outright — the campaign's own logic on air and naval supremacy holds here as everywhere else — but the gap is real, the survivors on the beach know it, and the question SHAEF has to answer overnight is whether Omaha gets treated as an emergency to be fixed immediately or a problem to be managed while the rest of the invasion proceeds." +
            // Round 10 (item 8): only on the dev build's stalled-battle path.
            (flags.omahaCrisis44 === "stalled" ? keyBattleEcho("omaha", flags) : ""),
          choices: [
            {
              // Round 9: omahaCrisis44 === "stalled" only exists in the dev build's Key Battle
              // Subgame path (the waves WERE committed and the beach held anyway), where "reverse
              // course" and a quote about correcting the morning's order would misdescribe what
              // happened. Unnamed staff voice rather than a new line put in Eisenhower's mouth.
              label:
                flags.omahaCrisis44 === "stalled"
                  ? "Double down — pull the divisions earmarked for the breakout phase into Omaha tonight"
                  : "Reverse course — divert the divisions earmarked for the breakout phase to force Omaha open now",
              advisor: { name: "Eisenhower", quote: "I am not fighting five beachheads for a week because I was too proud to admit the order I gave this morning needs correcting tonight." },
              // Spread AFTER the literal on purpose: check-advisor-dates.js matches the literal
              // `advisor: { name, quote }` form, and a ternary in its place silently dropped
              // Eisenhower's quote out of the date audit (557 -> 556 checked) in round 9's first
              // pass. The later key overrides the earlier one only on the stalled path.
              ...(flags.omahaCrisis44 === "stalled"
                ? { advisor: { name: "SHAEF staff", quote: "The beach has had everything we planned to give it. What it needs now is what we planned to give somewhere else." } }
                : {}),
              setFlags: { omahaIsolated44: "reinforce" },
              impact: { manpower: -1, fuel: -1, initiative: -1 },
              next: "omahaBreakthroughLate44",
              outcome:
                "The correction costs real capital — divisions meant for the exploitation phase spend themselves widening a beachhead instead — and it costs the schedule days that a smoother June 6th wouldn't have. It also works: throwing weight at the actual problem, rather than hoping it resolves itself, is usually the more expensive and more reliable answer both.",
            },
            {
              label:
                flags.omahaCrisis44 === "stalled"
                  ? "Hold what's ashore — let Omaha consolidate while the main weight builds through Utah and the British sector"
                  : "Hold the diversion — let Omaha consolidate what it has while the main weight builds through Utah and the British sector",
              advisor: { name: "Montgomery", quote: "One corps, dug in on a mile and a half of sand, is not the invasion failing. It is the invasion costing more than we budgeted for on one beach out of five. I will not unbalance the whole front to spare it a hard week." },
              setFlags: { omahaIsolated44: "hold" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "omahaToehold44",
              outcome:
                "The colder, more economical order, and the one with the harder week attached to it: Omaha gets no reinforcement beyond what was already scheduled, and V Corps spends the better part of a week fighting for ground the historical timeline secured in a day. Naval gunfire, not new divisions, is what keeps the mile and a half of beach from becoming less.",
            },
          ],
        };
        },
        get omahaBreakthroughLate44() {
          return {
          date: "JUNE 9, 1944",
          title: "The Beach Widens",
          historicalRecord: false,
          situation:
            "It takes three days longer than the historical record and a slice of the divisions meant for the breakout phase, but Omaha stops being an isolated mile and a half of sand and becomes a beachhead in the ordinary sense — joined to the British sector, with real depth for the first time. The cost is legible on every subsequent planning document: the exploitation phase inherits fewer fresh divisions than it should have, and every schedule downstream of this beach — Cherbourg, the eventual breakout, whatever comes after it — starts roughly a week later than the path where Omaha never isolated in the first place. What SHAEF's after-action paperwork says about why is a decision, not a formality.",
          choices: [
            {
              label: "Log it as a routine delay — absorb the week into the schedule, no formal flag on the cause",
              advisor: { name: "Eisenhower", quote: "Every beach ran behind its own plan by June 9th. I am not writing a special report explaining why one ran behind by more than the others." },
              historical: false,
              setFlags: { normandyDelay: "week", normandyDelayFlagged: false },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "falaise44",
              outcome:
                "The lodgment that was briefly two lodgments is now unmistakably one, at the price of a week and divisions that would otherwise have gone straight into exploitation. Falaise, when it comes, comes to a campaign running about a week behind the one that never had this crisis — a debt this campaign doesn't erase, only carries forward. Filed as routine, the crisis leaves no mark on how boldly this command is willing to gamble the next time a plan reaches further than its supply line.",
            },
            {
              label: "Flag it formally — record that a beach nearly failed, and that the margin for the next gamble is thinner",
              advisor: { name: "Bradley", quote: "I want it on paper that we came close on Omaha. Not to assign blame. So that whoever plans the next reach knows exactly how much slack this army actually has." },
              historical: false,
              setFlags: { normandyDelay: "week", normandyDelayFlagged: true },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "falaise44",
              outcome:
                "The lodgment joins into one front at the same material cost as the quieter option — a week, and divisions the exploitation phase won't have. What's different is institutional: the near-failure is now part of the record SHAEF's staff weighs before the next operation that assumes everything goes right. It won't make the next gamble safer. It may make it more honest about its own odds.",
            },
          ],
        };
        },
        get omahaToehold44() {
          return {
          date: "JUNE 11, 1944",
          title: "The Toehold",
          historicalRecord: false,
          situation:
            "Five days on, Omaha is still Omaha — a corps holding what amounts to a fortified beach rather than a proper lodgment, resupplied over open sand under intermittent fire, while the rest of the invasion has moved well past it. This is the nearest this campaign's D-Day content comes to writing the 'Dunkirk mirror' its own German-side text once promised, and it is worth being precise about why it doesn't arrive there: total naval gunfire and total air supremacy over every approach road mean no German force ever seriously threatens to reduce the beach, only to keep it small. What V Corps is fighting isn't defeat. It's five extra days of exactly the fight the historical record gave it in one. The question now is whether to end it with what's on hand or wait for the strength to end it properly.",
          choices: [
            {
              label: "Push through now — commit what's on hand rather than wait for a bigger push",
              advisor: { name: "Gerow", quote: "We have had five days to do what one day was supposed to cost us. I would like my corps to stop being a special case." },
              historical: false,
              setFlags: { normandyDelay: "prolonged", normandyDelayFlagged: false },
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "falaise44",
              outcome:
                "V Corps breaks out of its own toehold roughly five days behind every other beach's timeline, at a manpower cost the historical June 6th spread across a single brutal morning instead of a brutal week. The lodgment finishes joining itself into one front, and the rest of the campaign proceeds from a start line that arrived late rather than one that never had to. Command treats the crisis as resolved rather than instructive.",
            },
            {
              label: "Wait for a properly resourced push — bring up additional artillery and armor before committing",
              advisor: { name: "Bradley", quote: "I have already spent five days finding out what happens when this corps is asked to do more than it has. I am not going to find out again by rushing the sixth." },
              historical: false,
              setFlags: { normandyDelay: "prolongedCautious", normandyDelayFlagged: true },
              impact: { manpower: 1, fuel: -1, initiative: -2 },
              next: "falaise44",
              outcome:
                "The costlier choice in schedule, the cheaper one in lives: two additional days to mass armor and artillery properly before the push, rather than five days of grinding attrition stretching to six. Omaha finishes joining the front further behind the historical timeline than the impatient option would have left it — and with a corps that went in prepared rather than merely tired of waiting, a distinction SHAEF's staff will remember weighing the next time patience and schedule pull against each other.",
            },
          ],
        };
        },
        get falaise44() {
          return {
          date: "AUGUST 1944",
          title: "The Falaise Pocket",
          historicalRecord: true,
          situation:
            "The Normandy breakout has trapped the German Seventh Army and Fifth Panzer Army in a collapsing pocket around Falaise — and the pocket has a neck, still open, through which the survivors are streaming east under constant air attack. Closing it means Patton's spearheads driving north to meet the Canadians and Poles fighting south — across an inter-army-group boundary, into ground where two converging allied forces can easily end up firing into each other. Bradley's actual words at the time: better a solid shoulder at Argentan than a broken neck at Falaise." +
            (meters.manpower <= -4
              ? " The harder close isn't a realistic option this week regardless of the argument for it — there isn't coordinated strength left to attempt the maneuver without exactly the friendly-fire chaos it already risks even at full strength."
              : "") +
            (flags.omahaCrisis44 === "committed"
              ? " Patton's spearheads racing north for this pocket are, in a real sense, the same aggression this command rewarded once already on the Omaha bluffs in June — feeding the follow-on waves in rather than diverting them bought a beachhead that turned into exactly this kind of fast-moving army."
              : (flags.normandyDelay === "prolonged" || flags.normandyDelay === "prolongedCautious")
              ? " The two extra days Omaha's landing cost back in June are still, in a small way, baked into this week's schedule — this front reached Falaise's outskirts slightly later than the historical timeline, for the same reason it went in more carefully."
              : "") +
            // Round 10 (item 8): a won Omaha battle leaves its commander's mark (dev build only).
            (flags.omahaCrisis44 === "committed" ? keyBattleEcho("omahaLater", flags, "omaha") : ""),
          choices: [
            {
              label: "Hold the shoulder — let the boundary stand, accept that some of the pocket escapes",
              advisor: { name: "Bradley", quote: "Two armies closing a gap at speed, nose to nose, in dust and smoke — I would rather explain the Germans who escaped than the Americans and Poles we shelled." },
              historical: true,
              setFlags: { falaise44: "shoulder" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "normandy44",
              outcome:
                "The gap stayed partially open for critical days, and while the pocket's closure was still a catastrophe for the German army in the west — perhaps 50,000 captured and 10,000 dead, the roads inside a byword for destruction from the air — a meaningful fraction of personnel escaped east, cadres that rebuilt formations the autumn battles then had to fight again. Whether closing harder was worth the friendly-fire and coordination risk remains a genuine staff-college debate; Bradley never recanted.",
            },
            {
              label: "Close the neck hard — push past the boundary, seal the pocket completely",
              advisor: { name: "Patton", quote: "Let me go on to Falaise and we'll drive the British back into the sea for another Dunkirk — I said it as a joke. The half of it that isn't a joke is that I can close that gap today." },
              checkLabel: "Manpower",
              disabledReason: meters.manpower <= -4 ? "insufficient coordinated strength left to close the gap without the friendly-fire chaos this maneuver risks" : undefined,
              setFlags: { falaise44: "close" },
              impact: { manpower: -2, fuel: -1, initiative: 1 },
              next: "normandy44",
              uncertain: [
                {
                  weight: modWeight(55, meters.manpower),
                  title: "The pocket seals",
                  impact: { manpower: 0, fuel: 0, initiative: 1 },
                  outcome:
                    "The bolder call comes off: the converging forces manage the boundary chaos, the neck closes days early, and the German escape becomes a total encirclement — the cadres that historically rebuilt the autumn's defense are in the prisoner cages instead. The western German army's recovery before the frontier battles is measurably weaker on this path.",
                },
                {
                  weight: 100 - modWeight(55, meters.manpower),
                  title: "The converging armies collide",
                  impact: { manpower: -2, fuel: 0, initiative: 0 },
                  outcome:
                    "The risk Bradley named, realized: converging spearheads in dust, smoke, and mutual artillery range produce exactly the friendly-fire and coordination failures the boundary existed to prevent. The gap closes barely faster than history's version, the escape continues through the confusion — and the cost of the attempt is paid in allied casualties from allied fire, the kind of ledger entry no operational gain fully answers for.",
                },
              ],
            },
          ].concat(
            flags.hardMode && (flags.cohesion || 0) <= -2
              ? [
                  {
                    label: "Let Eisenhower's staff fix the boundary directly — no army commander's discretion this time",
                    advisor: { name: "Eisenhower", quote: "I did not spend two years building this coalition to lose it over which flag closes a gap first. The line goes where I draw it, and neither of them gets to redraw it in the field." },
                    setFlags: { falaise44: "eisenhower" },
                    cohesionDelta: 1,
                    impact: { manpower: 0, fuel: 0, initiative: -1 },
                    next: "eisenhowerIntervenes44",
                    outcome:
                      "Not a call the historical Eisenhower actually made this explicitly — but a plausible one for an alliance already too strained to survive another national-prestige argument at the boundary. SHAEF draws the line itself and orders both army commanders to hold it exactly, discretion revoked. Slower, blander, and considerably less likely to produce either a clean triumph or a friendly-fire disaster.",
                  },
                ]
              : []
          ),
        };
        },
        get eisenhowerIntervenes44() {
          return {
          date: "AUGUST 1944",
          title: "The Line SHAEF Drew",
          historicalRecord: false,
          situation:
            "The boundary holds exactly where Eisenhower's staff put it, and both Bradley and Montgomery's headquarters receive the same terse instruction: this is not a discretionary line. It closes the Falaise gap slower than either army commander's own instinct would have — but it closes it without the coordination failure that has, on other paths, cost lives to friendly fire, and without the national rivalry that has, on other occasions, cost the alliance something harder to rebuild than a bridge." +
            (flags.omahaCrisis44 === "committed"
              ? " Bradley's own instinct, the one this command trusted on the Omaha bluffs in June rather than overriding it, is the same instinct SHAEF is now formally overruling here — the difference is only that this time it isn't Bradley's call to make alone."
              : ""),
          choices: [
            {
              label: "Accept the slower, safer closure — the alliance's patience was worth more than the extra prisoners",
              advisor: { name: "Bradley", quote: "I would have closed it my way eventually. Ike's way closed it without an inquiry afterward. I can live with that trade." },
              historical: false,
              setFlags: { eisenhowerIntervenes44: "accept" },
              cohesionDelta: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "normandy44",
              outcome:
                "The pocket closes days later than either aggressive version might have managed, and a meaningfully larger fraction of the German force escapes east than the historical record shows. What doesn't happen — no friendly-fire incident, no Bradley-Montgomery recrimination that outlives the war in memoirs — is exactly what this path was built to avoid, at a real and honestly stated cost in escaped German cadres.",
            },
            {
              label: "Object through channels — a boundary drawn from above sets a precedent no field commander should welcome",
              advisor: { name: "Patton", quote: "Today it's a gap at Falaise. Tomorrow it's every river crossing for the rest of the war, decided by a man two hundred miles from the map. Someone should say so before it becomes the habit." },
              historical: false,
              setFlags: { eisenhowerIntervenes44: "object" },
              cohesionDelta: -1,
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "normandy44",
              outcome:
                "Logged, and noted, and changes nothing about this particular boundary — SHAEF's order stands, the pocket closes on Eisenhower's schedule regardless. What the objection does buy is a paper trail: the next time discretion is revoked at an inter-army boundary, it happens with the argument against it already on record, which is worth less than it sounds and more than nothing.",
            },
          ],
        };
        },
        get scheldt44() {
          return {
          date: "OCTOBER – NOVEMBER 1944",
          title: "The Scheldt Approaches",
          historicalRecord: true,
          situation:
            "Antwerp — the great port the entire autumn logistics crisis needs — fell intact in early September. It is also useless: the Scheldt estuary between Antwerp and the sea remains German-held, and no ship can reach the docks until the approaches are cleared. The historical priority went elsewhere — Market Garden claimed the resources and attention — and the Scheldt's clearing waited until October and November, a brutal campaign across flooded polders that fell largely to the First Canadian Army, while the port everyone needed sat captured and closed." +
            (flags.normandyDelay
              ? " The fuel and supply math behind this crisis has been tight since Omaha — a beach that took days longer than it should have was the first bill this theater's logistics ever ran up, and Antwerp sitting closed is the same bill arriving again, larger."
              : ""),
          choices: [
            {
              label: "The Scheldt first — everything into opening Antwerp before any further offensive",
              advisor: { name: "Cunningham", quote: "You have captured the finest port in northwest Europe and are currently using it as a museum. Every plan this autumn is a supply plan wearing a costume; open the port." },
              setFlags: { scheldt44: "priority", cohesion: (flags.cohesion || 0) + (1) },
              cohesionDelta: 1,
              impact: { manpower: 0, fuel: 2, initiative: -1 },
              next: "ardennesResponse44",
              outcome:
                "The likely shape of the priority the naval staff and Eisenhower's own logisticians argued for at the time: the estuary campaign fought in September against a German Fifteenth Army still disorganized from the retreat — rather than in October against one that had been given six weeks to dig into the polders — opens Antwerp weeks early, and the entire autumn fuel crisis eases at its source. Most postwar assessments rank the Scheldt's deferral among the campaign's costliest priority errors; this path simply doesn't make it.",
            },
            {
              label: "Clear it on the historical schedule — the autumn's offensive momentum comes first",
              advisor: { name: "Montgomery", quote: "Ports are for wars of position. I am trying to end this one by Christmas, and the Scheldt will still be there when the Rhine is behind us." },
              historical: true,
              setFlags: { scheldt44: "delayed", cohesion: (flags.cohesion || 0) + (-1) },
              cohesionDelta: -1,
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "ardennesResponse44",
              outcome:
                "The Scheldt waited while the autumn's offensives claimed priority, and when the clearing finally came it cost the First Canadian Army nearly 13,000 casualties across flooded polders against a dug-in defense — the first convoy reached Antwerp only at the end of November. The port's three lost months are the quiet arithmetic under every autumn supply crisis this campaign has already made you feel.",
            },
          ].concat([
              {
                label: "Open Antwerp in September and hold every other offensive until it is open — no Market Garden, no Rhine attempt, nothing until the ships are unloading",
                disabledReason: (meters.fuel || 0) >= 2 && (meters.manpower || 0) >= 2 ? undefined : "Requires Fuel +2, Manpower +2 — the slack to subordinate every other offensive to one port",
                advisor: { name: "Cunningham", quote: "You are asking me what the port is worth. It is worth every operation you are currently planning, and I would rather say that now than have a staff historian say it for me in ten years." },
                setFlags: { scheldt44: "priority", antwerpSeptember: true, cohesion: (flags.cohesion || 0) + (1) },
                cohesionDelta: 1,
                impact: { manpower: -1, fuel: 4, initiative: -2 },
                next: "ardennesResponse44",
                outcome:
                  "SPECULATIVE in the discipline required, not in the reasoning — this is the position Eisenhower's naval staff and his own logisticians argued at the time, and losing that argument is conventionally rated among the campaign's costliest priority errors. What no historical SHAEF had was the accumulated slack to actually impose it: subordinating every autumn offensive to a single port, and defending that choice to army commanders who all had a river they wanted to cross first. The estuary falls in September against a German Fifteenth Army still disorganized from the retreat, and Antwerp is unloading before the weather closes in. Every fuel calculation from here runs on a supply line that is, for the first time in this campaign, not the binding constraint.",
              },
            ]),
        };
        },
        get stalinTestsTheFront45() {
          return {
          date: "MARCH 1945",
          title: "Stalin Tests the Front",
          historicalRecord: false,
          situation:
            "Weeks after Yalta's joint communiqué, the first real test of the united front arrives: reports from Poland describe the Lublin committee moving to arrest and suppress non-communist Polish resistance figures, in language that reads like exactly the kind of unilateral action the joint position was supposed to make politically costly. Whether London and Washington actually treat this as the repudiation they threatened to call it, or quietly let the moment pass rather than risk the alliance over a report from a country neither can currently reach, is what's actually being tested.",
          choices: [
            {
              label: "Call it what it is — formal joint protest, naming the violation explicitly",
              advisor: { name: "Eden", quote: "We told him a violation would be named, not merely noted. If we let this one pass quietly, the united front was theater, and he will have learned that faster than we will." },
              historical: false,
              setFlags: { stalinTestsTheFront45: "protest" },
              cohesionDelta: -1,
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: "strategicBombing45",
              outcome:
                "The position is in truth spent, not merely held in reserve: a formal joint protest goes to Moscow, naming the Lublin committee's actions as exactly the violation Yalta's language was built to prevent. It changes nothing on the ground in Poland — the Red Army's presence still decides what happens there, regardless of what any protest says — but it establishes, for whatever the historical record is worth, that the united front was a real position rather than a negotiating performance.",
            },
            {
              label: "Let it pass — press privately, keep the public front intact for bigger fights still to come",
              advisor: { name: "Churchill", quote: "We have larger arguments left with him before this war ends. I am not certain this is the hill the alliance dies defending its own language on." },
              historical: false,
              setFlags: { stalinTestsTheFront45: "quiet" },
              cohesionDelta: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "strategicBombing45",
              outcome:
                "The pragmatic reading of what the united front was actually for: it was never going to change Poland's fate against the Red Army's physical presence, so spending it now on a protest that changes nothing concrete is a worse trade than banking it for the negotiations still ahead — the German surrender terms, the occupation zones, everything Yalta didn't finish deciding. Whether that's discipline or the same accommodation the historical conference is criticized for, just deferred by one news cycle, is a question this campaign leaves open.",
            },
          ],
          };
        },

        get strategicBombing45() {
          return {
          date: "FEBRUARY 1945",
          title: "The February Directives",
          historicalRecord: true,
          situation:
            "With the ground war entering Germany, the bomber offensive faces its last real targeting question — and its heaviest. The Thunderclap concept proposes massive raids on eastern German cities crowded with refugees and functioning as transit points behind the collapsing eastern front: Berlin, Leipzig, Chemnitz, Dresden. The stated rationale is aiding the Soviet advance by paralyzing German movement; the Soviets requested attacks on these communications at Yalta. The foreseeable reality is firestorms in cities whose populations have doubled with civilians fleeing east-to-west. Alternatively, the force can hold to the oil and transportation campaigns — by now demonstrably strangling what remains of the German war machine.",
          choices: [
            {
              label: "Execute the eastern-cities raids — Thunderclap, Dresden included",
              advisor: { name: "Harris", quote: "The cities of eastern Germany are the eastern front's road junctions. I did not invent that fact; I am merely the man being asked whether to act on it." },
              historical: true,
              setFlags: { dresden45: "proceed" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "berlinDecision45",
              outcome:
                "Dresden burned on the night of February 13–14 in a firestorm that killed roughly 25,000 people — the figure established by the 2010 German historical commission, against decades of both inflation and denial — in a city swollen with refugees, weeks before the war's end. The raid aided the Soviet advance marginally at most, and it became, almost immediately and permanently, the emblem of the area offensive's moral ledger: the question of what the last months of a won war permit, asked in fire and never satisfactorily answered.",
            },
            {
              label: "Hold to oil and transportation — no city raids the war's arithmetic no longer needs",
              advisor: { name: "Spaatz", quote: "The oil plan is working. The rail plan is working. I decline to burn a city full of refugees to accelerate a collapse already scheduled." },
              setFlags: { dresden45: "restricted" },
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: "berlinDecision45",
              outcome:
                "A fair projection of the restraint the oil-campaign advocates' own logic implied: the February effort stays on the targets that are demonstrably ending the war, and Dresden does not become the word it became. The military difference by February 1945 is close to nil — which is precisely the argument, made at the time by some and by history's judgment since, that the raids' defenders never adequately answered. This path takes that argument at its word.",
            },
          ],
        };
        },
        get germanyOccupation45() {
          return {
          date: "MAY – JUNE 1945",
          title: "What Germany Becomes",
          historicalRecord: true,
          situation:
            "With the surrender signed, the alliance faces the question its wartime unity let it postpone: what should defeated Germany actually be. Treasury Secretary Morgenthau has proposed, and Roosevelt at one point provisionally endorsed at the Quebec Conference, a plan to permanently dismantle German heavy industry and reduce the country to a largely agricultural state — pastoralization, intended to make a third German war of aggression physically impossible. Others, including Secretary of War Stimson, argue a deindustrialized Germany in the heart of Europe would be a permanent humanitarian and economic catastrophe that a rebuilding continent can't afford to create." +
            (flags.berlinRace45 === "direct"
              ? " Whatever happened in Berlin's streets three months ago, the occupation map now being drawn follows Yalta's zones exactly as agreed — a fact the alliance's harder arguments here will test more than that one did."
              : ""),
          choices: [
            {
              label: "Pursue a Morgenthau-style deindustrialization policy",
              advisor: { name: "Morgenthau", quote: "Germany's industry built this war twice in one lifetime. I am not interested in rebuilding the machine, however efficiently, and calling it peace." },
              setFlags: { occupation45: "morgenthau" },
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: "END",
              outcome:
                "An honest account of the plan as seriously proposed, rather than the policy in fact adopted: broad industrial dismantlement leaves occupied Germany without the capacity to feed or rebuild itself, a humanitarian crisis in the middle of a continent every other Allied economy needs functioning again. The historical version of this plan was quietly abandoned within the Roosevelt administration once its practical implications were fully costed — this path tests what happens when it isn't.",
            },
            {
              label: "Reject pastoralization — rebuild German industry under Allied occupation and oversight",
              advisor: { name: "Stimson", quote: "A starving, deindustrialized Germany in the center of Europe is not a peace. It is a slower-burning version of the same problem, and I do not believe our grandchildren will thank us for choosing it." },
              historical: true,
              setFlags: { occupation45: "rebuild" },
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: "END",
              outcome:
                "What happened, broadly — the Morgenthau Plan's harshest provisions were abandoned, and Western occupation policy shifted toward reconstruction, culminating a few years later in the Marshall Plan's investment in exactly the industrial capacity Morgenthau wanted dismantled. It is, among other things, the policy that made West Germany's postwar recovery — and the Cold War division that came with rebuilding only half the country — possible.",
            },
          ],
        };
        },
      };

      return nodes[id];
    },
    historicity(flags) {
      const HIST = {
        europeFirst42: "confirm",
        atlanticAir42: "held",
        pacific42: "grant",
        secondFront42: "torch",
        dieppe42: "launch",
        pointblank43: "combined",
        anzio44: "launch",
        dodecanese43: "launch",
        tehran43: "commit",
        overlordPrep: "transport",
        falaise44: "shoulder",
        scheldt44: "delayed",
        dresden45: "proceed",
        casablanca43: "unconditional",
        messina43: "escaped",
        italy43: "hold",
        normandy44allied: "narrow",
        marketGarden44: "launched",
        anvil44: "southernFrance",
        bulge44: "patton",
        yalta45: "accept",
        berlin45allied: "halt",
        occupation45: "rebuild",
      };
      let matched = 0,
        considered = 0;
      for (const k in HIST) {
        if (flags[k] !== undefined) {
          considered++;
          if (flags[k] === HIST[k]) matched++;
        }
      }
      return { matched, considered, ratio: considered ? matched / considered : 1 };
    },
    projectedEnd(flags, meters) {
      if (flags.relieved) {
        return { stamp: "CONFIDENCE WITHDRAWN", prose: "the coalition withdrawing its confidence", exact: false };
      }
      if (flags.westernCollapse45)
        return { stamp: "MARCH 1945 (SPECULATIVE)", prose: "March 1945", exact: false };
      // High initiative means the advance is dictating events, which for this command means an
      // earlier finish — hence the minus. OKW's identical formula runs the other way on purpose;
      // see the comment there.
      let idx = 64 - Math.round((meters.initiative || 0) * 1.2);
      idx = Math.max(58, Math.min(70, idx));
      const M = MONTH_NAMES;
      const exact = idx === 64 && this.historicity(flags).ratio >= 0.75;
      if (exact) return { stamp: "MAY 8, 1945", prose: "May 8, 1945", exact: true };
      const p = `${M[idx % 12]} ${1940 + Math.floor(idx / 12)}`;
      return { stamp: p.toUpperCase() + " (PROJECTED)", prose: p, exact: false };
    },
    positionLabel(flags, meters) {
      // First match wins, so this runs rarest-condition-first. Order is load-bearing and was
      // measured against simulated playthroughs: battleOfBritain40 and darlanDeal42 are set in
      // essentially every run, so while they sat mid-chain every title below them was
      // unreachable — ten conditions matched thousands of times each and never once won. They
      // now sit at the bottom as the fallback naming, above only the meter-derived defaults.
      if (flags.relieved) return "The Coalition Withdraws Confidence";
      // Historical Divergence Mode: only reachable when the luftwaffeShift fork fired (the
      // Luftwaffe never made the historical switch off Fighter Command's airfields) AND the
      // costlier Big Wing doctrine was chosen at battleOfBritain40 — the harder exogenous
      // pressure meeting the slower-forming defense. Placed high as the rarest combination here.
      if (flags.forkLuftwaffeShift && flags.battleOfBritain40 === "bigWing") return "Fighter Command, Nearly Spent";
      // Extreme meter states outrank the flag chain below — see the Soviet chain for the
      // reasoning. Moderate tiers stay at the bottom as fallbacks by design.
      if ((meters.manpower || 0) + (meters.fuel || 0) + (meters.initiative || 0) >= 12)
        return "A Victory That Cost Less Than the Planning Assumed";
      if (flags.westernCollapse45 === "unconditional") return "March 1945 — And Still Signed Together";
      if (flags.westernCollapse45 === "local") return "The War Ended Early, The Peace Started Colder";
      if (flags.antwerpSeptember && !flags.westernCollapse45) return "The Port That Stopped Being the Constraint";
      if (flags.hardMode && (flags.cohesion || 0) >= 3) return "The Alliance That Held";
      if (flags.stalinTestsTheFront45 === "protest") return "The United Front, Spent";
      if (flags.stalinTestsTheFront45 === "quiet") return "The United Front, Banked";
      if (flags.turkishQuestion44 === "patient") return "Ankara, Courted";
      if (flags.turkishQuestion44 === "press") return "Ankara, Pressed";
      if (flags.viennaStandoff44 === "press") return "The City We Already Held";
      if (flags.viennaStandoff44 === "wait") return "Vienna, Held Quietly";
      if (flags.romeDividend44 === "push") return "The Gothic Line, Met With Momentum";
      if (flags.romeDividend44 === "divert") return "Rome's Dividend, Spent Elsewhere";
      if (flags.falaise44 === "eisenhower") return "Discretion Revoked";
      if (flags.bulgeExploited44 === "commit") return "The Salient, Sealed Twice";
      if (flags.bulgeExploited44 === "trust") return "Logistics Did the Rest";
      if (flags.ljubljana44 === "drive") return "The Race for Vienna";
      if (flags.australiaLifeline42 === "hold") return "The Price of the Policy";
      if (flags.australiaLifeline42 === "divert") return "Europe First, in Name Only";
      if (flags.untestedDoctrine44 === "overinsure") return "Insured Against a Question Nobody Could Answer";
      if (flags.untestedDoctrine44 === "trust") return "The Lesson Assumed, Not Learned";
      if (flags.dodecanese43 === "launch") return "Churchill's Aegean Gambit";
      if (flags.hardMode && (flags.cohesion || 0) <= -4) return "Papering Over the Cracks";
      if (flags.dresden45 === "restricted") return "The Raids Not Flown";
      // darlanDeal42 and battleOfBritain40 are BOTH mandatory two-choice nodes — every Allied run
      // sets both, to one of exactly two values each. Checked as two separate sequential tiers
      // (darlan first), darlan's 100% coverage meant battleOfBritain's two lines, the h.ratio tier,
      // and the final default below were ALL permanently dead: 0/30,000 in each case, confirmed
      // empirically, not merely rare. Measured across the same sample, darlan alone is set roughly
      // 50/50 accept/refuse and battleOfBritain roughly 50/50 park/bigWing, independently of each
      // other — so nesting them recovers all four original titles as genuinely reachable (~25%
      // of runs each) instead of two live and two dead, using the same four strings, no new lore.
      if (flags.darlanDeal42 === "accept") {
        return flags.battleOfBritain40 === "bigWing" ? "The Wing That Formed Too Late" : "A Deal the Assassin Made Moot";
      }
      if (flags.darlanDeal42 === "refuse") {
        return flags.battleOfBritain40 === "park" ? "Warning Time, Spent Correctly" : "The Principled Cost";
      }
      const h = this.historicity(flags);
      const total = (meters.manpower || 0) + (meters.fuel || 0) + (meters.initiative || 0);
      // See the STAVKA chain: the intermediate meter tiers here were dead strings and were removed.
      // "Roughly As Briefed" was the same pattern again — darlan/battleOfBritain above cover 100%
      // of runs between them, so nothing past that point was ever reachable. Deleted, along with
      // its ENDINGS_GALLERY entry. The unconditional default below stays as the required fallback.
      return "The War, Fought Close to Schedule";
    },
    epilogue(flags, meters) {
      if (flags.relieved) {
        return (
          "This campaign ends here, and not on any battlefield. Coalition Cohesion has run out — not a single ally's objection, but the accumulated weight of every unilateral gambit this command spent it on, past the point the alliance could still function around. Washington and London do not announce a dismissal; supreme command in a coalition war doesn't work by dismissal, it works by a phone call that stops returning your authority to act. The war continues under whichever compromise the Combined Chiefs can still agree on without you in the room. It was never yours to run alone — every choice in this campaign that spent cohesion was, in effect, a bet that it briefly could be. This is what happens when that bet is called too many times."
        );
      }
      const total = (meters.manpower || 0) + (meters.fuel || 0) + (meters.initiative || 0);
      const end = this.projectedEnd(flags, meters);
      const h = this.historicity(flags);

      let dateClause;
      if (end.exact) {
        dateClause =
          "Germany surrenders unconditionally on May 8, 1945 — essentially the historical timeline, and the historical zones of occupation follow it into the postwar map.";
      } else if ((meters.initiative || 0) >= 2) {
        dateClause = `Victory in Europe arrives around ${end.prose} — faster than the historical May 1945, bought by the boldest options this campaign makes available to Western Allied command.`;
      } else if ((meters.initiative || 0) <= -2) {
        dateClause = `Victory in Europe arrives around ${end.prose} — slower than the historical May 1945, the price of caution at the moments this campaign offered a faster, riskier road instead.`;
      } else {
        dateClause = `Victory in Europe arrives close to the historical schedule, around ${end.prose}.`;
      }

      let costClause;
      if ((meters.manpower || 0) >= 3) {
        costClause =
          " The campaign reaches its end having spent fewer Western Allied lives than the historical record — a war fought with unusual discipline about which battles were worth the men they cost.";
      } else if ((meters.manpower || 0) <= -3) {
        costClause =
          " The campaign reaches its end having spent more Western Allied lives than the historical record — the price of the bolder, more aggressive road at several of this campaign's genuine forks.";
      } else {
        costClause = " The campaign's human cost lands close to the historical one on the Western front — lighter, by a wide margin, than the war the Soviet Union fought over the same years.";
      }

      const notes = [];
      const add = (w, t) => notes.push({ w, t });
      if (flags.tehran43 === "hedge")
        add(7, "Tehran ended hedged rather than committed — Overlord promised in principle with the Mediterranean fine print intact, and Stalin's standing suspicion of the West fed at exactly the moment the historical conference starved it.");
      if (flags.yalta45 === "unitedPress")
        add(8, "Yalta was met with a truly united Anglo-American front on Poland — the option the historical conference never had, purchased by two years of managed alliance, extracting language Stalin had to openly repudiate rather than quietly reinterpret.");
      if (flags.dodecanese43 === "decline")
        add(6, "Churchill's Aegean improvisation was vetoed in full — no Leros, no last clear British defeat of the war, and the landing craft it consumed kept against Overlord's ledger.");
      if (flags.ljubljana44 === "drive")
        add(7, "The Ljubljana Gap drive toward Vienna was actually attempted — Churchill's political-geography thesis run against the mountains and the single-track railway every American planner cited against it.");
      if (flags.dieppe42 === "cancel")
        add(7, "The Dieppe raid was cancelled — a division of mostly Canadian troops spared its historical destruction, and the opposed-landing lessons that shaped Overlord's doctrine left to be learned later, more slowly, and possibly on the invasion beaches themselves.");
      if (flags.dresden45 === "restricted")
        add(8, "The February 1945 eastern-city raids were declined — Dresden never becomes the word it became, and the oil and rail campaigns finished the war's arithmetic without it, exactly as their own advocates' logic implied they could.");
      if (flags.scheldt44 === "priority")
        add(7, "The Scheldt was cleared before the autumn's offensives rather than after — Antwerp opened weeks early, and the priority error most postwar assessments rank among the campaign's costliest was simply not made.");
      if (flags.antwerpSeptember)
        add(9, "Every autumn offensive was subordinated to one port. No Market Garden, no Rhine attempt, nothing until Antwerp was unloading — the argument Eisenhower's own logisticians made and lost in the real September, imposed here on army commanders who each had a river they wanted first. From that October onward, supply stopped being the thing that decided what was possible.");
      if (flags.westernCollapse45 === "unconditional")
        add(10, "German commands in the west offered separate terms to the Western Allies, in March, with the war visibly ending — and were refused, one after another, in favor of a text all three powers would sign. The Casablanca position was tested under the one condition that would have made bending it worth something, and it held.");
      if (flags.westernCollapse45 === "local")
        add(10, "The local surrenders were taken as they came. Organized German resistance in the west ended within days and lives were saved on both sides that a formal process would have spent — and the alliance did, in miniature and in front of witnesses, the exact thing every communiqué since Casablanca had promised would not be done. Moscow drew the conclusion available to it.");
      if (flags.falaise44 === "close")
        add(6, "The Falaise pocket's neck was closed hard, past the army-group boundary — Patton's argument taken over Bradley's shoulder, with everything the converging-forces gamble entailed.");
      if (flags.anzio44 === "cancel")
        add(6, "Shingle was cancelled and the landing craft kept for Overlord — no wildcat, no stranded whale, and a Gustav Line ground down frontally instead.");
      if (flags.overlordPrep === "restricted")
        add(6, "The Transportation Plan was restricted to targets clear of population centers — fewer of the civilians the invasion came to liberate killed in its preparation, at a price paid on the beaches in German divisions arriving days earlier.");
      if (flags.pacific42 === "refuse")
        add(5, "King's Guadalcanal request was refused outright — Europe First enforced to the letter, at a cost in Pacific position and inter-service trust the rest of the war's joint operations quietly carried.");
      if (flags.hardMode && (flags.cohesion || 0) >= 3)
        add(8, "Coalition Cohesion held solid across the war's hardest disagreements — the Western partnership that would anchor NATO within a few years was, on this path, unusually strong from the very start.");
      if (flags.hardMode && (flags.cohesion || 0) <= -4)
        add(8, "Coalition Cohesion frayed badly under Yalta Mode — friction between London, Washington, and Moscow ran hotter than the historical record, a preview of the disagreements the real alliance mostly managed to paper over.");
      if (flags.marketGarden44 === "scaled")
        add(9, "Market Garden's reach for Arnhem was scaled back before it happened rather than mourned after — Browning's private reservation taken seriously instead of overruled.");
      if (flags.messina43 === "sealed")
        add(8, "The Strait of Messina was sealed rather than left to the Patton–Montgomery race — denying Kesselring's Italian defense some of the roughly 100,000 veteran troops it historically escaped with.");
      if (flags.yalta45 === "press")
        add(8, "Stalin was pressed hard on Poland's postwar government at Yalta rather than accepted on ambiguous terms — a harder line taken exactly where the historical conference chose accommodation.");
      if (flags.occupation45 === "morgenthau")
        add(8, "The Morgenthau Plan's deindustrialization policy was actually pursued rather than quietly abandoned — testing the humanitarian and economic consequences Stimson warned about directly.");
      if (flags.secondFront42 === "sledgehammer")
        add(7, "The earliest possible cross-Channel invasion was attempted rather than deferred to Torch — the boldest and most contested strategic choice available to Western Allied command in the entire war.");
      if (flags.atlanticAir42 === "diverted")
        add(6, "Bomber Command aircraft were diverted to close the Atlantic air gap a year early, over Harris's objection — easing 1942's shipping crisis at a cost to the bomber offensive this campaign cannot cleanly weigh.");
      if (flags.normandy44allied === "narrow")
        add(6, "Montgomery's narrow-thrust strategy was backed rather than overruled — the same operational logic that produced the historical Arnhem, given the priority it argued it needed.");
      if (flags.anvil44 === "balkans")
        add(6, "Churchill's Balkans argument was taken rather than overruled — a real attempt to shape where the postwar dividing line in Europe would eventually fall.");
      if (flags.bulge44 === "cautious")
        add(5, "The relief of Bastogne took the methodical route rather than Patton's admired ninety-degree wheel — a slower operation trading speed for an army kept fully organized.");
      if (flags.casablanca43 === "conditional")
        add(5, "Unconditional surrender was softened at Casablanca — leaving diplomatic room for a negotiated exit that most historians doubt would have changed much, given the regime's grip on the military's loyalty.");
      if (flags.berlin45allied === "push")
        add(5, "Berlin was contested rather than conceded — a symbolic prize pursued despite an occupation agreement that was always going to hand the city back regardless of who reached it first.");
      notes.sort((a, b) => b.w - a.w);
      const threadText = notes
        .slice(0, 3)
        .map((n) => n.t)
        .join(" ");

      return (
        dateClause +
        costClause +
        (threadText ? " " + threadText : "") +
        " " +
        [
          "Germany's defeat was never a variable Western Allied command decisions controlled, only its timing, its cost, and the shape of the peace that followed it.",
          "No branch of this campaign reaches a different destination — the war's outcome was decided by arithmetic no single conference or campaign could overturn.",
          "What was really being decided, choice by choice, was never whether Germany lost — only what the peace on the other side of it would look like.",
        ][Math.abs((flags.cohesion || 0) + (meters.initiative || 0) + (meters.fuel || 0)) % 3]
      );
    },
    // Second stage of the multi-stage ending — broad context roughly a year past the date named
    // in epilogue(). Individual fates belong to the "where they ended up" stage, drawn from
    // ADVISOR_DOSSIERS.fate for the officers this command actually leaned on.
    oneYearLater(flags, meters) {
      if (flags.relieved) {
        return "The war ends under whichever compromise the Combined Chiefs settled on without this command in the room. A year on, the history of that final year gets written by whoever was actually present for it — supreme Allied command in a coalition war is, in the end, a chair, and the chair's occupant by V-E Day is not who occupied it when this file was opened.";
      }
      const cohesionNote =
        flags.hardMode && (flags.cohesion || 0) >= 3
          ? "the Western partnership that held together unusually well through this campaign's hardest disagreements is, a year on, already the working relationship NATO will formalize within a few years"
          : flags.hardMode && (flags.cohesion || 0) <= -4
          ? "the friction Yalta Mode surfaced between London, Washington, and Moscow has not gone away with the shooting — a preview, a year later, of exactly the disagreements the historical alliance mostly managed to postpone past V-E Day"
          : "the Anglo-American partnership moves into the occupation largely as it fought the war — allied, not identical, and already negotiating the next disagreement even as it wins this one";
      return `A year past victory in Europe, the machinery of occupation is running on the arrangements this campaign's own conferences — Tehran, Yalta, the ones this command actually attended — settled or failed to settle in advance. Four occupation zones, a shared and already strained administration in Berlin, and ${cohesionNote}. Nothing about the peace was inevitable in its details, even though the war's outcome was: what this command actually spent four years shaping was never whether Germany would lose, but what kind of Europe would exist to inherit the win.`;
    },
  },
