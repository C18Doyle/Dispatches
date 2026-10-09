  german: {
    id: "german",
    seal: "OKW",
    name: "Wehrmacht High Command",
    dates: "1940–1945",
    brief: "Direct the German war machine from the fall of France to the Reich's destiny.",
    accent: "#7a2e2e",
    dynamic: true,
    start: "norway40",
    resolveNode(id, flags, meters) {
      const preservedReserve = !!flags.preservedReserve;

      const nodes = {        get norway40() {
          return {
          date: "APRIL 1940",
          title: "Weserübung: The Norway Gamble",
          historicalRecord: true,
          situation:
            "Norway comes first, ahead of France and ahead of any question about the Channel. Swedish iron ore reaches the Reich year-round through the ice-free port of Narvik, a supply the naval staff calls irreplaceable, and Britain has its own landing force ready to seize it first if Germany hesitates. Weserübung will be the first opposed amphibious operation of the war against a power with naval superiority: destroyers running troops into fjords the Royal Navy also knows how to find.\n\nThe Kriegsmarine's surface fleet (barely rebuilt since Versailles, a fraction of the size it will need to matter later) is what has to carry this. Every ship risked here is a ship the Channel Question, six months from now, will not have." +
            (flags.forkNorwayHeld
              ? "\n\nEarly signals intelligence suggests the British landing force is further along than the standard estimate assumed: this may not be the clean surprise the plan is counting on."
              : ""),
          choices: [
            {
              label: "Commit the surface fleet fully: seize every port from Narvik to Oslo at once",
              advisor: { name: "Raeder", position: "Twenty years of rebuilding the fleet are about to be spent, and no other way to do the job can be seen." },
              historical: true,
              setFlags: { norway: "full", navyStrength: "gutted" },
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: "caseYellow40",
              outcome:
                "Total surprise secured every objective within days, but the two Battles of Narvik cost roughly half the Kriegsmarine's destroyer force, and cruisers were lost or crippled taking Bergen and Trondheim. Norway and its ore route were secured for the rest of the war, and the surface fleet that might have contested a Channel crossing that summer effectively ceased to exist. The Channel Question, when it comes, will be decided as much by this month as by anything the RAF does.",
            },
            {
              label: "Limited landings: secure the ore ports, decline to contest Narvik directly",
              advisor: { name: "Dönitz", position: "Take the ore and leave the harbor whose defense would cost the navy, because the navy will be needed for the war after this one." },
              setFlags: { norway: "limited", navyStrength: "preserved" },
              favor: 1,
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "caseYellow40",
              outcome:
                "British troops did land at Narvik in the actual campaign and held the town for weeks before the fall of France forced their withdrawal anyway. Declining to contest it directly risks a longer, more visible British lodgment on Norwegian soil, but the surface fleet, preserved rather than spent, survives intact into the summer. What that preservation is worth is a question the Channel Question will answer.",
            },
          ],
        };
        },
        get caseYellow40() {
          return {
          date: "MAY 1940",
          title: "The Manstein Plan",
          historicalRecord: true,
          situation:
            "The invasion of France and the Low Countries is days away, and OKH's standing plan is a cautious update of the old Schlieffen concept: the main weight swings through Belgium in the north, exactly where French and British planners expect it and have positioned their best mobile forces to meet it. Manstein, sidelined to a corps command for arguing against this plan too persistently, has an alternative that only reached Hitler's desk after a chance dinner, and after an aircraft carrying a partial copy of the original plan was shot down over Belgium in January, forcing a rethink regardless: send the true weight of the panzer divisions through the Ardennes, terrain French staff studies have judged unsuitable for a major armored thrust, and cut behind the Allied armies advancing into Belgium to meet a northern attack that would, in this version, be nothing but the bait." +
            (flags.forkNorwayHeld
              ? " Norway is still unresolved to the north: an open flank and an ore route neither confirmed nor lost, sitting behind this plan's entire timetable like a bill not yet due."
              : ""),
          choices: [
            {
              label: "Adopt the Manstein Plan: the armored main effort goes through the Ardennes",
              advisor: { name: "Manstein", position: "The enemy watches Belgium because Belgium is where the attack is expected, and the aim is to be behind his army before he notices which war he is fighting." },
              historical: true,
              setFlags: { caseYellow: "manstein" },
              impact: { manpower: 1, fuel: 0, initiative: 1 },
              next: "dunkirk",
              // Round 21 (2026-10-05, Craig: the first Order of Battle for the German campaign,
              // Sedan). Attached to this choice with a new uncertain[] whose first outcome is the
              // historical text that used to be the choice's own outcome. All facts verified
              // 2026-10-05 (Wikipedia, Battle of Sedan (1940); Hermann Balck; Bruno Loerzer):
              // XIX Panzer Corps (Guderian) had the 1st (Kirchner), 2nd (Veiel) and 10th (Schaal)
              // Panzer Divisions with Infantry Regiment Großdeutschland attached to 1st, in
              // Panzergruppe von Kleist; the French 55th Infantry Division (Lafontaine), a reserve
              // division, held about 20 km of the river under Second Army (Huntziger), with 103
              // bunkers, most unfinished; the air attack was changed from a single twenty-minute
              // strike to continuous attacks in small formations from 08:00 to 16:00; 81 of 96
              // rubber boats were destroyed by French artillery at Wadelincourt; the first pontoon
              // bridge stood at about 01:00 on 14 May and the first tanks crossed at 07:20; the
              // "panic of Bulson" came at about 19:00 on 13 May; X Corps' counterattack was ordered
              // for 05:00 on 14 May and reached the Bulson ridge minutes after the Germans.
              keyBattleSubgame: {
                id: "sedan40",
                title: "Order of Battle: The Crossing at Sedan",
                flavor:
                  "The Manstein Plan is a single river on a single afternoon: XIX Panzer Corps must cross the Meuse at Sedan against reserve divisions dug into the far bank, and its three panzer divisions cannot cross at all until engineers have a bridge up. The air corps will bomb the French positions from first light in rolling waves rather than one great blow, some of the corps' guns are still in the Ardennes traffic, and the first men over will go in rubber boats under fire. What's decided here is where the corps' effort goes: how much to the assault companies and pioneers who cross first, how much to the air attack that has to unnerve the defenders rather than destroy them, how much to the artillery that arrived, and how much to the bridge and the roads that every tank in the corps is waiting on.",
                categories: [
                  { id: "assault", name: "Assault Infantry & Pioneers", meter: "manpower" },
                  { id: "air", name: "Air Attack", meter: "fuel", strand: "oil" },
                  { id: "guns", name: "Artillery Preparation", meter: "fuel", strand: "ammo" },
                  { id: "bridging", name: "Bridging & Traffic", meter: "initiative", strand: "steel" },
                ],
                // Assault highest — the first men over the river and up the slope are what the
                // whole operation turns on; Air second — it did not destroy a single bunker but
                // broke the nerve of the men inside them, which was worth more; Artillery third —
                // the corps was short of guns and some of the heavy howitzers were still in the
                // Ardennes traffic; Bridging lowest, deliberately, on its own terms — a bridge
                // keeps no one alive on the far bank, though every tank must wait for it, the same
                // asymmetric-by-design choice as Kursk's Supply.
                effectiveness: { assault: 2.4, air: 2.2, guns: 1.9, bridging: 1.7 },
                orderOfBattle: {
                  assault: {
                    units: [
                      "1st Panzer Division's rifle regiments, with Infantry Regiment Großdeutschland attached",
                      "2nd and 10th Panzer Divisions' rifle regiments, crossing at Donchery and Wadelincourt",
                      "43rd Assault Engineer Battalion and 49th Panzer Engineer Battalion, with assault boats",
                    ],
                    real: "Großdeutschland and 1st Panzer had taken Hill 247 by 20:00. At Wadelincourt, French artillery destroyed 81 of the 96 assault boats, and Feldwebel Rubarth's team of the 49th Engineer Battalion cleared seven bunkers to give 10th Panzer a bridgehead.",
                  },
                  air: {
                    units: [
                      "II Fliegerkorps (Loerzer) among the air corps flying the day's attacks",
                      "VIII Fliegerkorps (Richthofen), the close-support corps with the dive bombers",
                      "About 1,470 aircraft in all: 600 medium bombers, 250 Ju 87 Stukas, 500 Bf 109s and 120 Bf 110s",
                    ],
                    real: "The plan for one twenty-minute strike gave way to continuous attacks in small formations from 08:00 to 16:00. Almost no one was hit, but the 55th Division's reservists abandoned their positions that evening in what became the 'panic of Bulson'. The Luftwaffe lost six aircraft.",
                  },
                  guns: {
                    units: [
                      "The divisional artillery of the three panzer divisions, about 141 pieces in all",
                      "The flak battalions of the three divisions, 303 anti-aircraft guns in all",
                    ],
                    real: "The Germans were outgunned, about 141 pieces to about 174 French, and 2nd Panzer's heavy howitzers were held up in the Ardennes traffic, so the artillery did less than the plan expected.",
                  },
                  bridging: {
                    units: [
                      "The bridging columns of the divisional engineer battalions",
                      "The corps' traffic control on the few roads out of the Ardennes",
                    ],
                    real: "The first pontoon bridge stood at Gaulier at about 01:00 on 14 May and the first tanks crossed at 07:20, about seven hours after the infantry. The Ardennes roads were jammed, and 2nd Panzer reached Donchery late.",
                  },
                },
                // Round 23: orders from above in the campaign's hard mode (modeled, not documented).
                hardRule: { text: "Göring has promised the Führer one great blow from the air at H-hour, and that is the order.", lockApproach: "singleBlow" },
                // Round 22. Ground and weather as they were on 13 May 1940 (the air corps flew from 08:00 to 16:00;
                // the French held the bunkers on the heights of the far bank, Wikipedia, Battle of Sedan (1940)).
                conditions: "Fine, clear weather, so the air corps can fly from first light. The French hold bunkers on the steep, wooded heights of the far bank, and the river itself is the obstacle.",
                terrainModifiers: { assault: 0.9, air: 1.1 },
                terrainNotes: { assault: "a river under fire below steep, wooded heights", air: "clear skies" },
                // Field decision: what the infantry on the far bank do on the evening of 13 May. Facts verified
                // 2026-10-05 (Wikipedia, Battle of Sedan (1940)): Hill 247 was in German hands by 20:00, the
                // "panic of Bulson" came at about 19:00, the first pontoon bridge stood at about 01:00 on 14 May,
                // and a French armoured counterattack was ordered for 05:00. The three answers are the
                // alternatives that evening offered; their payoff against each French posture is modeled.
                decisions: [
                  {
                    id: "tonightOnTheHeights",
                    time: "2000",
                    title: "The infantry on the heights",
                    prompt: "Evening on 13 May. The infantry hold Hill 247 and a shallow bridgehead, the first pontoon bridge is hours from standing, and the French behind the heights are either running or about to counterattack. No one can say which. The corps has to decide what the men on the far bank do tonight.",
                    options: [
                      {
                        id: "pushOn",
                        name: "Send the riflemen on through the night, past the heights",
                        note: "Exploit the confusion before the French settle. They go with no tanks behind them.",
                        bonus: 0,
                        bonusByPosture: { reservistsShaken: 5, gapBetweenBunkers: 3, riverArtillery: -2, armourOnTheMove: -5 },
                        reportLine: "The riflemen go on past the heights in the dark, with nothing behind them but the river.",
                      },
                      {
                        id: "holdHeights",
                        name: "Hold the heights and wait for the bridge",
                        note: "A smaller risk, and a slower night.",
                        bonus: 1,
                        bonusByPosture: { armourOnTheMove: 3, riverArtillery: 1 },
                        reportLine: "The riflemen dig in on the heights and wait for the engineers to finish the bridge.",
                      },
                      {
                        id: "coverEngineers",
                        name: "Turn the flak and field guns on the French batteries to cover the engineers",
                        note: "Costs Matériel: fuel and the day's ammunition.",
                        bonus: 0,
                        bonusByPosture: { riverArtillery: 4, armourOnTheMove: 2 },
                        meters: { fuel: -1 },
                        costReason: "Flak and guns turned to cover the bridging",
                        reportLine: "Every gun and flak piece on the near bank turns on the French batteries to cover the bridge-builders.",
                      },
                    ],
                  },
                ],
                categoryContext: {
                  assault:
                    "The first men over are rifle companies and pioneers in rubber boats, and the bunkers on the far bank have to be taken one at a time. Each commitment here puts more men in the first boats and more pioneers with flamethrowers and charges in the first rush up the slope.",
                  air:
                    "The bombers will not break a bunker. What they can do is keep the men inside them under the noise for eight hours, until the nerve goes. Each commitment here keeps the waves coming a little more often.",
                  guns:
                    "There are fewer guns than the plan wanted, and no one is sure what the French artillery will do when the boats go into the water. Each commitment here puts more of what is on the river bank onto the bunkers and the French batteries behind them.",
                  bridging:
                    "No tank crosses the Meuse until engineers have a bridge up, and the road behind it is already jammed. Each commitment here gets the pontoons to the river sooner and keeps the traffic moving toward them.",
                },
                flashups: {
                  assault: [
                    "A rifle company reaches the far bank in its rubber boats while the French are still looking at the sky.",
                    "A pioneer team works along the back of a bunker with satchel charges.",
                    "Grossdeutschland's riflemen reach the foot of Hill 247 and start up it.",
                    "A platoon finds a gap between two bunkers and goes through it unseen.",
                    "A company digs in on the far slope with the river at its back.",
                  ],
                  air: [
                    "Another small wave of bombers goes over the French line, and the men in the bunkers keep their heads down.",
                    "Stukas dive on the far bank, their sirens carrying across the river.",
                    "A bomber crew reports the French line quiet and no guns firing from it.",
                    "The air attack goes on, hour after hour, and the French telephone lines are cut.",
                    "A wave of bombers drops on a village behind the bunkers and the traffic on the road stops.",
                  ],
                  guns: [
                    "A battery of 105s fires onto a bunker at the water's edge.",
                    "The howitzers shift fire to the French guns behind the ridge.",
                    "A French battery answers, and a shell lands among the boats.",
                    "A forward observer corrects the fire onto the second line of bunkers.",
                    "The guns fall silent for a quarter of an hour, saving what shells there are.",
                  ],
                  bridging: [
                    "A column of pontoon trucks reaches the river bank behind schedule.",
                    "A traffic officer clears a jam of lorries from the one road that leads to the crossing.",
                    "The first pontoons go into the water under French fire.",
                    "Engineers work through the night on the approaches to the bridge.",
                    "A bridge section is lowered into place and the first planks are laid.",
                  ],
                },
                reportTimes: { open: "0800", contact: "1500", cats: ["1600", "1730", "1930", "2130"], reserve: "2230", counter: "0500" },
                idleLines: {
                  assault: [
                    "No extra men go into the first boats. The assault goes over with whatever is already on the river bank.",
                    "The pioneers are given nothing more to carry, and the bunkers are left to the riflemen.",
                  ],
                  air: [
                    "No extra bombers are sent. The air attack flies the number of waves it had been given.",
                    "No more is asked of the air corps. The French get whatever quiet the schedule gives them.",
                  ],
                  guns: [
                    "The guns are given no extra targets. They fire on the schedule and nothing more.",
                    "Nothing more goes to the river bank. The howitzers fire what they already have.",
                  ],
                  bridging: [
                    "No extra effort goes into the bridge. The engineers build it at the pace the plan gave them.",
                    "The road to the river is left as it is, and the traffic goes through when it can.",
                  ],
                },
                verdicts: ["The Bridgehead Holds and the Panzers Cross", "The Crossing Stalls on the Far Bank"],
                verdictGrades: {
                  clean: "The infantry took the heights, the air attack kept the French quiet, and the bridge was up for the tanks in the dark, with every part of the corps' plan working at once.",
                  costly: "The bridgehead holds and the tanks cross, but every part of the corps paid more than the plan allowed for to get them there.",
                  marginal: "The infantry hold the far bank and the bridge goes up, but the day does not go to plan, and the French have hours of warning they should not have had.",
                  total: "The infantry cling to the far bank and the bridge is late, so the corps' plan runs a day behind, whatever it achieved in the end.",
                },
                counterattack: {
                  category: "bridging",
                  severity: { armourOnTheMove: 2, riverArtillery: 1, gapBetweenBunkers: 1, reservistsShaken: 1 },
                  warn: {
                    1: "French reserve units are probing toward the bridgehead from the south.",
                    2: "French tanks, the heavy Char B1s of X Corps, are moving up toward the heights above Sedan for a counterattack at first light.",
                  },
                  results: {
                    repulsed: "The French tanks are met at the heights and broken up before the bridgehead is in danger.",
                    heldAtCost: "The bridgehead holds against the French tanks, but the units that held it have been badly mauled.",
                    broke: "The French tanks break into the bridgehead, and the fight goes on at close quarters among the houses.",
                    gaveGround: "The bridgehead gives up the high ground and holds the river bank, rather than fight the tanks out on the heights.",
                  },
                },
              },
              uncertain: [
                {
                  weight: modWeight(70, meters.initiative),
                  title: "The bridgehead holds and the breakout runs",
                  setFlags: { sedan40Result: "crossed" },
                  impact: { manpower: 1, fuel: 0, initiative: 1 },
                  outcome:
                    "What happened, and it remains one of the most audacious operational gambles of the entire war: seven panzer divisions threaded through terrain the French general staff had assessed as unsuitable for a major armored thrust, crossed the Meuse at Sedan by May 13, and reached the Channel coast by May 20: cutting off and encircling the very Allied armies that had advanced into Belgium to meet a northern attack that was, by then, revealed as the feint. France's defeat, six weeks after the campaign began, is substantially a consequence of this single operational decision.",
                },
                {
                  weight: 100 - modWeight(70, meters.initiative),
                  title: "The bridgehead is held but the crossing runs late",
                  setFlags: { sedan40Result: "contained" },
                  impact: { manpower: -1, fuel: -1, initiative: -1 },
                  outcome:
                    "The minority projection, which the day itself came closer to than the tidy version suggests: the infantry get over the Meuse and cling to the far bank, but the bridge comes up late, the tanks stand on the near bank for hours longer than planned, and the French counterattack arrives to find a bridgehead that is held and not yet secure. The breakout still comes, because French command hesitates in every version of this day, but it runs a day slower than it did in fact, and the armies in Belgium use the extra day to begin falling back on the Channel before the panzers can close behind them.",
                },
              ],
            },
            {
              label: "Hold to the original plan: the main weight advances through Belgium as OKH intended",
              advisor: { name: "Halder", position: "Manstein's plan is either the boldest stroke in modern military history or the way the panzer arm is lost in the Ardennes traffic jam of the century, and staking France on the answer is uncomfortable until it is known which." },
              setFlags: { caseYellow: "original" },
              favor: 1,
              impact: { manpower: -1, fuel: 0, initiative: -1 },
              next: "caseYellowOriginal40",
              outcome:
                "The plan Germany actually shelved: abandoned partly because a version of it had already been compromised when a courier aircraft went down in Belgium with a copy aboard in January. Advancing where French and British planners expected the main blow meets their best-prepared mobile forces head-on rather than catching them from an unguarded direction; most staff assessments, then and since, judge this version of the campaign slower and considerably more costly, without the encirclement that made the historical six-week collapse possible.",
            },
          ],
        };
        },
        get caseYellowOriginal40() {
          return {
          date: "JUNE 1940",
          title: "The Cost of Caution",
          historicalRecord: false,
          situation:
            "With the Ardennes gambit set aside, the campaign OKH actually drafted before Manstein's plan ever reached Hitler's desk unfolds on its own schedule. Army Group B's main weight grinds forward through Belgium's fortified river lines and canal country, exactly where French and British planners positioned their best mobile reserves to meet it. There is no armored dash through terrain the Allies judged impassable, and no cutting behind armies advancing to meet a feint, because there is no feint. By early June the front has reached something recognizably like the historical campaign's shape, but slower and considerably more expensive: Belgium's forts and the Dyle–Breda line extract a toll the real six-week collapse never had to pay, and no single encirclement has trapped the BEF or the French First Army the way the Ardennes thrust did.\n\nHistorians who have actually studied this branch of the war split on where it goes from here. One reading holds France still falls in 1940 regardless: its army and doctrine were outmatched however the attack arrived, and the difference is only cost and calendar. The other holds that a campaign without the shock of encirclement hands French command the one thing it never historically had: enough warning to react to a crisis it can see coming, which makes a slower campaign something other than a guaranteed win, just a guaranteed longer one.",
          choices: [
            {
              label: "Press everywhere: trade casualties for tempo, and make up in force what the plan no longer has in surprise",
              advisor: { name: "Bock", position: "There is no elegant answer left: fight them where they expect the attack, in the strength they expect, and make the difference in guns and will rather than geography." },
              setFlags: { caseYellowOriginal40: "press" },
              impact: { manpower: -2, fuel: -1, initiative: 1 },
              next: "compressedInvasionWindow40",
              outcome:
                "The attack keeps coming rather than pausing to regroup, and it works, in the sense that the line keeps bending. Belgium's defenses are ground down rather than bypassed, and the French army's cohesion breaks under sustained pressure through June and into July rather than in a single encircling stroke in May. France's government requests terms in early August: roughly six weeks later than the historical armistice, and considerably bloodier for the units that did the grinding. The BEF gets away too, but through an ordinary phased embarkation under far less pressure than the historical Dunkirk pocket ever applied: no miracle of improvised small craft was ever needed, because no trap ever closed tight enough to require one.",
            },
            {
              label: "Consolidate and regroup: accept a two-phase campaign, autumn's decision rather than summer's",
              advisor: { name: "Halder", position: "It is better to win in October with the army intact than in June, and to find out next year in Russia exactly what June cost." },
              setFlags: { caseYellowOriginal40: "consolidate" },
              impact: { manpower: 0, fuel: 0, initiative: -2 },
              next: "channel",
              outcome:
                "The pause is real, not cosmetic: exhausted divisions rest and refit rather than pressing a line that isn't breaking, and French command uses the same weeks to fall back on the Somme and the Aisne in reasonable order: the warning the historical campaign's speed never gave them. What follows in the autumn resembles the historical second-phase 'Case Red' push more than a summer blitz: methodical, resource-intensive, and slower to a decision that still arrives, but months later than the real armistice and without the panzer force paying the wear a headlong summer campaign would have cost it.",
            },
          ],
        };
        },
        get compressedInvasionWindow40() {
          return {
          date: "AUGUST 1940",
          title: "A Shorter Summer to Work With",
          historicalRecord: false,
          situation:
            "France's surrender didn't come until early August on this timeline, six weeks past the actual armistice, and every one of those weeks came directly out of whatever margin existed for a cross-Channel operation before autumn weather closes the Strait to anything the barge fleet could survive. The historical planning window was already uncomfortably tight starting from a headstart six weeks longer than this one. Nothing else about the arithmetic has improved to compensate: Fighter Command's reported strength has been wrong all summer, always in the same optimistic direction, and the barge conversions Kriegsmarine needs for any invasion fleet at all still don't exist in the numbers a real crossing would require.",
          choices: [
            {
              label: "Compress the invasion timetable: rush what the shortened season still allows",
              advisor: { name: "Raeder", position: "A fleet that did not exist in June cannot exist by September just because Paris took six extra weeks to fall. Barges can be produced on that timetable, but not the training and the weather to go with them." },
              checkLabel: "Matériel",
              disabledReason: meters.fuel <= -3 ? "insufficient fuel and shipping capacity left to rush an invasion fleet together on a compressed timetable" : undefined,
              setFlags: { compressedWindow40: "rushed" },
              impact: { manpower: -1, fuel: -2, initiative: 1 },
              next: "channel",
              uncertain: [
                {
                  weight: modWeight(40, meters.fuel),
                  title: "The scraped-together fleet is real, for whatever that's worth",
                  setFlags: { compressedWindowResult: "assembled" },
                  impact: { manpower: 0, fuel: -1, initiative: 1 },
                  outcome:
                    "The rush actually produces a barge fleet and a landing schedule by the time this desk has to answer the invasion question in earnest: a genuine option on the table this autumn, where the historical six-weeks-earlier version had one too, for what a barge fleet under tow across a contested Channel was ever really worth. Having the fleet assembled doesn't resolve whether using it is wise; it only means the choice ahead is a real one rather than a formality.",
                },
                {
                  weight: 100 - modWeight(40, meters.fuel),
                  title: "The rush produces a fleet that isn't actually ready",
                  setFlags: { compressedWindowResult: "unready" },
                  impact: { manpower: -1, fuel: -1, initiative: -1 },
                  outcome:
                    "The compressed schedule costs what compressed schedules cost: barges converted without proper trials, crews trained on a syllabus cut to fit the calendar rather than the task. Whatever gets assembled by autumn is a fleet on paper more than a fleet that could survive the crossing it exists for: the six lost weeks bought less than they cost.",
                },
              ],
            },
            {
              label: "Write off any 1940 invasion outright: the season was always this tight, six weeks or not",
              advisor: { name: "Halder", position: "It is better to tell Berlin plainly that the season is gone than to spend a fleet's worth of effort discovering it in September, with the Channel already turning." },
              favor: 1,
              setFlags: { compressedWindow40: "writeOff" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "channel",
              outcome:
                "The blunter accounting, and arguably the more honest one: a campaign that already cost six extra weeks doesn't get to spend more discovering what the historical planners already suspected about this season's odds. Whatever this autumn's Channel Question turns out to require, it goes into that decision already having decided invasion isn't happening in 1940, which changes the argument, even if the historical outcome and this one may not end up looking very different.",
            },
          ],
        };
        },
        get dunkirk() {
          return {
          date: "MAY 1940",
          title: "The Halt at Dunkirk",
          historicalRecord: true,
          situation:
            "German panzers have driven the British Expeditionary Force and remnants of the French First Army into a shrinking pocket around Dunkirk. Tank serviceability in the lead divisions is reported anywhere between 50 and 70 percent, and the whole force is needed intact for the coming push south into France.\n\nIntelligence estimates of the pocket's strength vary widely: somewhere between 300,000 and 450,000 Allied troops, though nobody can say how many are still combat-effective or how fast the Royal Navy could in fact lift them off a beach under fire. No evacuation on that scale has ever been attempted." +
            // Round 21 (Sedan echo): the crossing's result and what the battle left behind.
            (flags.sedan40Result === "contained"
              ? " The Meuse crossing cost a day more than the plan allowed, and the armies in Belgium used it: the pocket closing around Dunkirk is looser than the staff expected."
              : "") +
            keyBattleEcho("sedan40", flags),
          choices: [
            {
              label: "Order the halt: let armor rest, let the Luftwaffe finish the pocket",
              advisor: { name: "Göring", position: "Leave it to the Luftwaffe: the panzers need not bleed for a beach that can be bombed into the sea." },
              historical: true,
              setFlags: { dunkirk: "halt" },
              impact: { manpower: 0, fuel: 1, initiative: -1 },
              next: "channel",
              outcome:
                "The three-day halt (May 24–26) let a defensive perimeter form, and Göring's promise collapsed against RAF fighter cover and low cloud. The Royal Navy (with an improvised fleet of destroyers, ferries, and small civilian craft) lifted roughly 338,000 troops in nine days, at the high end of anything your staff thought possible. Churchill cautioned that wars aren't won by evacuations, but the trained core of Britain's future army got out, and that mattered for years.",
            },
            {
              label: "Press the attack: push armor into the pocket immediately",
              advisor: { name: "Guderian", position: "The enemy is beaten and boarding ships, and every hour of rest sends England's next army home." },
              setFlags: { dunkirk: "push" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "channel",
              // Hidden-information choice: the situation text above deliberately withholds a real
              // number ("intelligence estimates... vary widely: somewhere between 300,000 and
              // 450,000") rather than the odds this choice is actually contested at — concealRoll
              // keeps that gap real by suppressing the pre-choice percentage badge too, with the
              // true odds revealed only on the OutcomeScreen after the choice resolves.
              concealRoll: true,
              uncertain: [
                {
                  weight: modWeight(55, meters.fuel),
                  title: "The perimeter bends but holds",
                  setFlags: { dunkirkResult: "held" },
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  outcome:
                    "The dice of this contested call land the way the skeptics predicted: Flanders' canals channel the armor into killing zones, the RAF contests every daylight hour over the beaches, and the evacuation runs anyway: slower, bloodier, but most of the BEF still gets out. Worn panzer divisions take losses attacking prepared perimeter defenses that they'll miss in the French campaign's second act. Historians who doubted the attack option get to say they told you so.",
                },
                {
                  weight: 100 - modWeight(55, meters.fuel),
                  title: "The perimeter cracks early",
                  setFlags: { dunkirkResult: "shattered" },
                  impact: { manpower: 2, fuel: 0, initiative: 0 },
                  outcome:
                    "The contested call breaks your way: sustained armored pressure collapses the perimeter days before the lift can finish, and the evacuation total falls to perhaps half the historical figure. Britain loses a meaningful share of the veteran officers and NCOs it historically rebuilt its army around: an effect that will echo quietly through this entire file. The cost was real too: the panzer force enters the drive on Paris measurably more worn.",
                },
              ],
            },
          ],
        };
        },
        get channel() {
          return {
          date: "AUGUST 1940",
          title: "The Channel Question",
          historicalRecord: true,
          situation:
            (flags.dunkirk === "push"
              ? "Whatever the exact toll at Dunkirk, Britain's home-defense manpower is measurably thinner than it would otherwise be, though the naval and air constraints on any Channel crossing haven't changed at all. "
              : "France has fallen and the evacuated BEF is rebuilding at home. ") +
            "The RAF hasn't broken despite weeks of daylight raids: Luftwaffe intelligence keeps reporting Fighter Command down to its last two or three hundred aircraft, yet the interceptions keep coming at full strength, which means either the estimates are wrong or British production is far higher than believed (it was both).\n\nThe Kriegsmarine is blunt: no invasion is survivable without both air and naval superiority. Against the Royal Navy's Home Fleet: several times your surface strength " +
            (flags.navyStrength === "gutted"
              ? "and now further ahead after Narvik's losses"
              : "even with the fleet Norway's limited landings preserved") +
            ": you have neither guaranteed, and the invasion 'fleet' is river barges under tow." +
            (flags.compressedWindow40 === "rushed"
              ? (flags.compressedWindowResult === "assembled"
                ? " The barge fleet this desk rushed together over the summer's lost six weeks actually exists, for whatever a rushed fleet is worth against everything else on this list."
                : " The barge fleet this desk rushed together over the summer's lost six weeks exists mostly on paper: crews and craft that never got the trials a real crossing would need.")
              : flags.compressedWindow40 === "writeOff"
              ? " This desk already wrote off a 1940 crossing once, before this question was even formally on the table."
              : ""),
          choices: [
            {
              label: "Commit fully to Sea Lion: press Göring, build the invasion fleet",
              advisor: { name: "Jodl", position: "England must be made to feel that the war is lost before America and Russia can make it otherwise." },
              setFlags: { sealion: "commit" },
              impact: { manpower: flags.dunkirk === "push" ? 0 : -1, fuel: 0, initiative: 0 },
              next: "tannenbaum40",
              outcome:
                flags.dunkirk === "push"
                  ? "A thinner British home-defense force makes a landing marginally less suicidal on paper, but it changes nothing about the Kriegsmarine's actual objection: the Home Fleet, and a Luftwaffe that never won the air. The intelligence picture that mattered, RAF strength, stayed wrong all summer, always underestimating Fighter Command. Sea Lion was postponed indefinitely on September 17, 1940, in this timeline as in the real one."
                  : "This is the direction Hitler leaned through summer 1940. But Luftwaffe daylight losses forced a shift to night bombing by September: the intelligence estimates of RAF strength were consistently, badly low, so the 'almost broken' enemy kept regenerating. The barge fleet had no margin for Channel weather. Sea Lion was postponed indefinitely on September 17, 1940, and quietly never revived.",
            },
            {
              label: "Shift to attrition: Blitz and U-boats, quietly begin planning east",
              advisor: { name: "Raeder", position: "An army cannot be landed across a sea that is not controlled. The convoys should be strangled instead, the one war that can actually be fought." },
              historical: true,
              setFlags: { sealion: "attrition" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "tannenbaum40",
              outcome:
                "Close to what actually happened. Sea Lion faded without a formal cancellation announcement, the Blitz continued through Britain's winter, and Barbarossa planning began that same autumn. British civilian morale strained under the bombing but never approached the collapse the air staff kept predicting: another case of the estimate being wrong in the same optimistic direction every time.",
            },
            {
              label: "Begin Barbarossa planning now: treat Britain as contained",
              advisor: { name: "Halder", position: "England's hope is Russia. Remove Russia, and the island is a spectator to its own defeat." },
              setFlags: { sealion: "east" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "tannenbaum40",
              outcome:
                "Barbarossa study had, in fact, already begun in parallel with invasion prep by July 1940: this was never a clean either/or. Choosing this skips the Battle of Britain's costly air campaign entirely, forfeiting even the outside chance Fighter Command breaks, in exchange for an earlier, better-resourced start east.",
            },
            {
              label: "Launch Sea Lion in September regardless: order the crossing over every objection",
              advisor: { name: "Göring", position: "The RAF is finished, as the weekly reports confirm, and the army need only ferry across a Channel the Luftwaffe already owns." },
              setFlags: { sealion: "launched" },
              impact: { manpower: -3, fuel: -2, initiative: 1 },
              next: "sealionDisaster40",
              outcome:
                "The order the historical September 17 postponement was issued precisely to avoid: every Kriegsmarine study, and most later wargames including the famous 1974 Sandhurst exercise, reach the same verdict about what happens next. You are about to find out which shape the verdict takes.",
            },
          ],
        };
        },
        get tannenbaum40() {
          return {
          date: "OCTOBER 1940",
          title: "The Tannenbaum Question",
          historicalRecord: false,
          situation:
            {
              commit: "With Sea Lion still formally alive (the invasion fleet Jodl argued for is still being assembled, whatever the Kriegsmarine's own private doubts about it) and",
              attrition: "With Sea Lion shelved and",
              east: "With Sea Lion never seriously pursued past the planning stage, Barbarossa already the larger claim on staff attention, and",
              launched: "With Sea Lion attempted and broken against the Channel this September, whatever version of that story the newspapers were finally told, and",
            }[flags.sealion] +
            " the Balkans not yet urgent, OKW turns to a smaller question that has quietly sat on staff desks since the fall of France: Switzerland. General Wilhelm Ritter von Leeb has already drafted the invasion study (Fall Tannenbaum, eleven divisions attacking from three directions) at Hitler's standing request, though no order to execute it has ever been given. The case for it is real: Switzerland is now surrounded on every side by territory the Reich controls, its precision industry and the rail tunnels under the Alps have obvious military value, and a neutral state doing business with both sides at once has never sat comfortably with the men running this war.\n\nThe case against it is also real, and General Henri Guisan's Swiss army has made sure of it: publicly. The Réduit National doctrine concedes the lowland cities without a fight and pulls the entire army into the Alpine massif, trading territory for a defense that could take months to reduce even after the cities fall. Switzerland's neutrality, meanwhile, is worth more intact than conquered: gold, foreign currency, and intelligence all move through Zurich and Bern precisely because both sides can still use it as one.",
          choices: [
            {
              label: "Leave Fall Tannenbaum in the drawer: Switzerland stays neutral",
              advisor: { name: "Ribbentrop", position: "A neutral is not a rival but a door that stays open whoever else has stopped speaking to Germany, and closing it loses more than it gains." },
              historical: true,
              setFlags: { tannenbaum40: "shelved" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "balkans",
              outcome:
                "What actually happened: the study sits on file, periodically dusted off and never ordered. Switzerland's neutrality proves worth more as a working arrangement than a conquest for the rest of the war: a channel for gold, currency, and information that both sides keep using precisely because neither controls it.",
            },
            {
              label: "Execute Fall Tannenbaum: eleven divisions, three axes, before winter closes the passes",
              advisor: { name: "von Leeb", position: "The plan was drawn because orders required it, and executing it is not recommended. The terrain does not care whose staff study was more thorough." },
              checkLabel: "Matériel",
              disabledReason: meters.fuel <= -3 ? "insufficient fuel and transport left to move eleven divisions across three Alpine axes before the passes close" : undefined,
              setFlags: { tannenbaum40: "invade" },
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "balkans",
              uncertain: [
                {
                  weight: modWeight(35, meters.manpower),
                  title: "The lowlands fall fast; the Réduit does not",
                  setFlags: { tannenbaumOutcome: "quagmire" },
                  impact: { manpower: -2, fuel: -1, initiative: -1 },
                  outcome:
                    "Zurich, Bern, and Geneva fall within the first week, roughly on von Leeb's schedule. Then the war the plan couldn't account for begins: a Swiss army that gave up the cities on purpose is dug into Alpine positions prepared for years against exactly this, and every valley costs the time and men that were supposed to already be earmarked for the east. Switzerland is occupied in the sense that matters for a map. It is not pacified, and the divisions tied up finding that out are divisions Barbarossa's planners will notice are missing.",
                },
                {
                  weight: 100 - modWeight(35, meters.manpower),
                  title: "Faster than the doctrine promised",
                  setFlags: { tannenbaumOutcome: "swift" },
                  impact: { manpower: -1, fuel: -1, initiative: 0 },
                  outcome:
                    "The Réduit strategy assumed a defender's advantage the actual campaign doesn't fully deliver: supply and encirclement in terrain this compact cut both ways, and organized resistance collapses faster than Guisan's doctrine intended. It still costs more than the Low Countries did for less strategic return: precision industry and rail tunnels now under German control, at the price of men, fuel, and eleven divisions' worth of autumn that Barbarossa's planners had already pencilled in for something else.",
                },
              ],
            },
            {
              label: "Coerce without invading: demand transit rights and economic concessions under threat",
              advisor: { name: "Göring", position: "Why occupy a bank when it can be made to do business on German terms? Threaten it properly and Bern will find the paperwork for whatever is needed." },
              setFlags: { tannenbaum40: "coerce" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "balkans",
              outcome:
                "The middle option, and the one that costs least on paper: Bern gets a blunter version of the pressure it historically absorbed anyway (rail transit, expanded credit, precision-arms contracts) backed now by an explicit invasion threat rather than an implicit one. Switzerland concedes enough to avoid Tannenbaum without ever quite becoming the open channel it was for both sides in the real war; something is gained, and something the historical arrangement quietly provided is now a little more guarded.",
            },
          ],
        };
        },
        get balkans() {
          return {
          date: "APRIL 1941",
          title: "The Balkans Problem",
          historicalRecord: true,
          directive: true,
          meanwhile:
            "MEANWHILE: LONDON: Churchill has ordered troops to Greece over his own generals' objections. He, too, is trading a main effort for a flank.",
          situation:
            {
              commit: "Sea Lion's failure cost trained divisions, landing craft, and months you won't recoup. ",
              launched: "The Channel catastrophe cost the army divisions it will never stop missing, and the prestige loss echoes through every capital in Europe. ",
              attrition: "The Blitz grinds on without a decisive result, and planning has quietly shifted east. ",
              east: "Barbarossa planning has been underway since autumn, a head start most staffs won't have. ",
            }[flags.sealion] +
            "Mussolini is being routed in Greece by a much smaller Greek army, and a coup in Belgrade has just flipped Yugoslavia out of the Axis orbit. British troops (strength estimates run anywhere from 50,000 to 100,000) have landed to defend the Greek mainland, within bombing range of the Ploiești oil fields that supply the majority of the Reich's crude. Your planners can't tell you how hard the Yugoslavs will fight, or whether British bombers based in Greece would really reach Ploiești in strength. What they can tell you: every week spent here comes off the Barbarossa calendar." +
            (flags.tannenbaumOutcome === "quagmire" ? " The divisions still tied down in the Alps are divisions this Balkan question can't call on." : flags.tannenbaum40 === "invade" ? " At least the Swiss precision-arms contracts are no longer a negotiation." : ""),
          choices: [
            {
              label: "Full intervention: invade Yugoslavia and Greece before Barbarossa",
              advisor: { name: "List", position: "Given the mountain corps and five weeks, there will be no southern flank left to worry about." },
              historical: true,
              setFlags: { balkans: "full" },
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "crete41",
              outcome:
                "What actually happened, and the uncertainty resolved favorably: Yugoslavia's half-mobilized army collapsed in roughly eleven days, Greece in about three weeks, both at low cost. But it pushed Barbarossa's start from May to June 22: a five-week delay that became one of the most argued-over facts of the entire war. Historians still split on whether it mattered: spring mud might have stalled an earlier start regardless, but nobody disputes the campaigning season got shorter.",
            },
            {
              label: "Ignore the Balkans: launch Barbarossa on the original schedule",
              advisor: { name: "Halder", position: "The calendar is the enemy that never retreats, and every division sent south is two that winter sends back in December." },
              setFlags: { balkans: "skip" },
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: "hessFlight41",
              outcome:
                "Leaves Italy to collapse alone and a hostile British force within range of the oil supply the whole Ostheer depends on, and the low-end estimates of that threat may not hold. Riskier flank, but it preserves the original May timeline and several extra weeks of campaigning season before the Russian winter arrives. This is the purest time-for-risk trade in the early war.",
            },
            {
              label: "Limited intervention: commit minimal force to the Balkans",
              advisor: { name: "Jodl", position: "A reinforced corps can stiffen the Italians without unhinging the eastern timetable, so both can surely be done by halves." },
              setFlags: { balkans: "minimal" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "hessFlight41",
              outcome:
                "Splits the difference, but risks securing neither objective. No serious plan modeled a light-touch version of this campaign: a partial force risks a slower, costlier Balkans result while still absorbing much of the delay in full. The staff estimate is blunt: this buys the risks of both other options and the benefits of neither.",
            },
          ],
        };
        },
        get hessFlight41() {
          return {
          date: "MAY 10, 1941",
          title: "The Hess Flight",
          historicalRecord: true,
          situation:
            "Rudolf Hess, Deputy Führer, has flown a Messerschmitt alone to Scotland, apparently to broker peace with Britain on his own initiative. Hitler is reportedly incandescent. Stopping him isn't the issue: he's already gone. Explaining it is." +
            (flags.crete41 === "assault"
              ? (flags.crete41Result === "failed" ? " Crete was not taken, and the airborne arm is spent for nothing." : "") + keyBattleEcho("crete41", flags)
              : ""),
          choices: [
            {
              label: "Declare him insane: a lone act, disowned entirely",
              advisor: { name: "Goebbels", position: "A madman flew a plane. That is the whole statement, and the only one to be given." },
              historical: true,
              setFlags: { hess41: "insane" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "bismarckBreakout41",
              outcome:
                "Berlin's official line was immediate and total: Hess had acted alone, under delusion, with no authority. Britain got a minor propaganda gift and a confused prisoner; the war's actual trajectory didn't move an inch.",
            },
            {
              label: "Say nothing officially: let the silence do the work",
              advisor: { name: "Ribbentrop", position: "Every explanation offered is a question admitted to exist, so none should be offered." },
              historical: false,
              setFlags: { hess41: "silent" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "bismarckBreakout41",
              outcome:
                "Silence reads, to a watching world, as confirmation that something real was attempted and failed. It costs nothing militarily and something diplomatically: the speculation fills in gaps the insanity story would have closed outright.",
            },
            {
              label: "Own it: publicly frame the flight as a sanctioned peace overture, not a rogue act",
              advisor: { name: "Bormann", position: "The Führer's fury is real and also beside the point. Call it madness and it was madness; call it policy and the British must answer a policy. The question is which costs them more sleep." },
              historical: false,
              setFlags: { hess41: "embraced" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "bismarckBreakout41",
              uncertain: [
                {
                  weight: 8,
                  title: "London treats it as a genuine signal",
                  impact: { manpower: 0, fuel: 1, initiative: 1 },
                  outcome:
                    "The near-impossible outcome, and this campaign is honest that it is near-impossible: enough of the British establishment finds the overture worth quietly exploring that back-channel contact continues past the point Berlin expected it to die. It changes nothing about the war's shape yet, but 'yet' is doing real work in that sentence, and it wasn't true an hour ago.",
                },
                {
                  weight: 92,
                  title: "The regime looks unstable, not statesmanlike",
                  impact: { manpower: 0, fuel: 0, initiative: -1 },
                  outcome:
                    "The far more likely outcome, and the one every serious account of the actual Hess flight supports: owning it publicly reads as confirmation that peace talk comes from confusion and division at the top, not confident strength. Britain's resolve, if anything, hardens: a regime that sends its deputy leader off unbriefed to freelance diplomacy is not one whose terms are worth taking seriously.",
                },
              ],
            },
          ],
        };
        },
        get crete41() {
          return {
          date: "MAY 1941",
          title: "Mercury: The Airborne Gamble",
          historicalRecord: true,
          situation:
            "With the Balkan campaign concluded, Crete sits off the southern flank: British-garrisoned, within air range of the Romanian oil fields, and the last Allied position in the Aegean. Student's XI Air Corps proposes to take it in the boldest way an island has ever been attacked: entirely from the air, gliders and paratroops seizing the airfields before seaborne follow-up. The garrison is battered from the Greek evacuation but larger than intelligence believes, and, unknown to the planners, expecting the attack: British codebreaking has read the operation's outline. The airborne arm is the Reich's sharpest specialist instrument, and this plan proposes to stake all of it on one morning." +
            (flags.sealion === "launched"
              ? " The Royal Navy that would contest any seaborne follow-up here is the same fleet that spent September sinking barges in the Channel, and it has lost none of its appetite for the work."
              : flags.sealion === "east"
              ? " A Royal Navy never seriously tested by an actual Channel crossing is a fleet this operation's seaborne follow-up has to assume is at full confidence."
              : ""),
          choices: [
            {
              label: "Launch Mercury: take Crete from the air",
              advisor: { name: "Student", position: "No one has ever taken an island by air alone, which is the very argument for doing it, because the defense cannot rehearse what has never happened." },
              historical: true,
              setFlags: { crete41: "assault" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "hessFlight41",
              keyBattleSubgame: {
                id: "crete41",
                title: "Order of Battle: Operation Mercury",
                flavor: "Student's XI Fliegerkorps has the whole airborne arm of the Reich committed to one island: paratroops and gliders on the airfields at Maleme, Rethymno and Heraklion on the morning of 20 May, mountain troops to follow by air as soon as a field is held, and a sea convoy of caiques behind them if the Royal Navy can be kept away. The garrison is stronger than the planners believe, and British decrypts have told it where the blows will fall. What is decided here is how the corps' strength is weighed: how much into the paratroops who go in first, how much into the Luftwaffe that has to break the defence from the air, how much into the sea convoys, and how much into the mountain troops who are to land once a field is taken.",
                categories: [
                  { id: "paratroops", name: "The Paratroop Drop", meter: "manpower" },
                  { id: "air", name: "Luftwaffe Support", meter: "fuel", strand: "oil" },
                  { id: "sea", name: "The Sea Convoys", meter: "fuel", strand: "ship" },
                  { id: "mountain", name: "Mountain Troops by Air-Landing", meter: "manpower" },
                ],
                effectiveness: { paratroops: 2.7, air: 2.2, sea: 1.6, mountain: 2 },
                phases: ["The airdrop of 20 May", "Maleme and the sea convoys"],
                conditions: "An island with only a few airfields and ports, where everything depends on holding one of them, and where the Royal Navy controls the sea around it.",
                terrainModifiers: { sea: 0.8 },
                terrainNotes: { sea: "the Royal Navy controls the sea around the island" },
                attrition: [
                  { category: "paratroops", atLeast: 3, meter: "manpower", delta: -1, reason: "Heavy casualties among the first-wave paratroopers" },
                ],
                categoryContext: {
                  paratroops: "The paratroops and the glider troops go in first, onto three airfields held by a garrison that has been warned. Each commitment here puts more of them into the first morning's drop.",
                  air: "The Luftwaffe has 280 bombers, 150 dive-bombers and 180 fighters to break the defence and keep the Royal Navy off. Each commitment here puts more of it over the drop zones and the sea lanes.",
                  sea: "A flotilla of caiques with Italian escorts is to carry the heavy equipment, and every ship in it can be sunk by the Royal Navy. Each commitment here makes the crossing stronger and better covered.",
                  mountain: "The 5th Mountain Division is to land on an airfield as soon as one is held. Each commitment here puts more of it ready to fly in when the field is taken.",
                },
                flashups: {
                  paratroops: [
                    "A stick of paratroopers drops onto an olive grove full of New Zealanders.",
                    "A glider lands on the edge of the airfield under fire.",
                    "A company of the Assault Regiment fights its way across the dry riverbed at Maleme.",
                    "A group of paratroopers digs in on the edge of a field and waits for a relief that does not come.",
                    "A platoon takes a house on the road and holds it until dark.",
                  ],
                  air: [
                    "Stukas dive on the defenders' positions along the coast road.",
                    "Bombers attack the ships off the north coast.",
                    "A fighter group strafes the drop zone as the paratroopers land.",
                    "Dive bombers go after a cruiser steaming north in the afternoon.",
                    "The bombers return to Greece to refuel for another wave.",
                  ],
                  sea: [
                    "A flotilla of caiques leaves for Crete with a single torpedo boat as escort.",
                    "A convoy turns back in the night when warships appear on the horizon.",
                    "A caique loaded with mountain troops is sunk by a cruiser's guns.",
                    "Italian torpedo boats lay smoke between the convoy and the cruisers.",
                    "The convoy's remaining boats creep toward the coast under the cover of darkness.",
                  ],
                  mountain: [
                    "Transports queue to land on the captured end of the airfield.",
                    "A mountain battalion comes in under fire and fights its way off the field.",
                    "The first of the mountain troops lands among the wrecks of the Ju 52s.",
                    "A company of mountain troops moves inland along the hills.",
                    "A mountain regiment is flown in as soon as the runway is clear.",
                  ],
                },
                reportTimes: {
                  open: "0800",
                  contact: "0830",
                  cats: ["1000", "1215", "1630", "1730"],
                  contact2: "2000",
                  reserve: "2100",
                  counter: "0600",
                },
                idleLines: {
                  paratroops: [
                    "The paratroops are not dropped on the three airfields. The defenders are left alone.",
                    "No assault goes in on the first morning, and the island has time to prepare.",
                  ],
                  air: [
                    "The Luftwaffe does not fly over the drop zones or the sea. The garrison moves freely.",
                    "No bomber is committed to the defence, and the guns on the hills are untouched.",
                  ],
                  sea: [
                    "No convoy sails. The heavy equipment stays on the mainland.",
                    "The caiques stay in port, and nothing goes by sea.",
                  ],
                  mountain: [
                    "The mountain troops wait on the mainland airfields. There is no one to reinforce.",
                    "No air-landing is planned, and the mountain division stays in Greece.",
                  ],
                },
                verdicts: ["Crete Falls to the Airborne", "The Assault Fails"],
                verdictGrades: {
                  clean: "The paratroops, the Luftwaffe, the convoy and the mountain troops worked together, and a field was held in time.",
                  costly: "Crete falls, but the airborne arm spent far more than it could afford to take it.",
                  marginal: "A foothold is held on the airfield, but by the narrowest of margins, and at a price the corps will not forget.",
                  total: "The assault breaks up on the drop zones and the sea, with nothing held at nightfall.",
                },
                counterattack: {
                  category: "paratroops",
                  severity: { navyHunts: 2, malemeGap: 1, largerGarrison: 1, asBriefed: 1 },
                  warn: {
                    "1": "The defenders are counterattacking toward the edge of the airfield.",
                    "2": "A strong counterattack is going in on the airfield, and the paratroopers there are short of ammunition.",
                  },
                  results: {
                    repulsed: "The counterattack is beaten off, and the mountain troops go on landing.",
                    heldAtCost: "The paratroopers hold the edge of the airfield, but the units that held it are almost gone.",
                    broke: "The defenders break into the airfield, and the landings stop under fire.",
                    gaveGround: "The paratroopers give up the edge of the airfield and fall back on the hill.",
                  },
                },
                orderOfBattle: {
                  paratroops: {
                    units: [
                      "The 7th Flieger Division",
                      "Group West (Comet) under Meindl at Maleme, Group Centre (Mars) under Süssmann, and Group East (Orion) under Bräuer at Heraklion",
                    ],
                    real: "A company of III Battalion, 1st Assault Regiment lost 112 killed out of 126 men, and 400 of the 600 men in III Battalion were killed on the first day. No objective was secure by nightfall on 20 May.",
                  },
                  air: {
                    units: ["VIII Fliegerkorps (Richthofen)", "About 280 bombers, 150 dive-bombers and 180 fighters"],
                    real: "The Luftwaffe lost 284 aircraft in the battle, and its aircraft sank the cruisers Gloucester and Fiji and the destroyers Greyhound, Kelly and Kashmir.",
                  },
                  sea: {
                    units: [
                      "Two flotillas of about twenty caiques each, escorted by the Italian torpedo boats Lupo and Sagittario",
                      "Opposed by Force D (Glennie) and Force C (King) of the Royal Navy",
                    ],
                    real: "On the night of 21/22 May Force D destroyed most of the first convoy. About 2,000 Germans were lost and only about 113 reached Crete.",
                  },
                  mountain: {
                    units: [
                      "The 5th Mountain Division (Ringel), brought in by air and sea",
                      "Air-landed once the airfield at Maleme was in German hands",
                    ],
                    real: "On the night of 20/21 May the 22nd New Zealand Battalion withdrew from Hill 107 after a misunderstanding, leaving Maleme airfield open to German reinforcement.",
                  },
                },
                hardRule: { text: "The Führer's directive fixes the plan: the assault goes in on all three objectives as laid down.", lockApproach: "spreadThree" },
                decisions: [
                  {
                    id: "theWeightToMaleme",
                    time: "2030",
                    title: "Where the weight goes",
                    prompt: "Night falls on 20 May with no objective secure. The paratroopers are scattered, the mountain troops have yet to land, and Maleme airfield is still under fire from the edge of the hill beside it. Student has to decide where the weight goes tomorrow.",
                    options: [
                      {
                        id: "allToMaleme",
                        name: "Put everything into Maleme and land the mountain troops on the airfield under fire",
                        note: "The bold choice, and the one that depends on the hill being given up.",
                        bonus: 0,
                        bonusByPosture: { malemeGap: 5, navyHunts: 1 },
                        reportLine: "Student orders everything to Maleme, and the transports are sent in under fire.",
                      },
                      {
                        id: "holdThePlan",
                        name: "Keep to the plan and reinforce all three drop zones",
                        note: "A balanced effort, and a thin one everywhere.",
                        bonus: 0,
                        bonusByPosture: { malemeGap: -2, navyHunts: 1 },
                        reportLine: "Student keeps to the plan, and each of the three drop zones is reinforced.",
                      },
                      {
                        id: "airOnly",
                        name: "Hold the sea convoys back and use only the air transports",
                        note: "Costs Matériel, and keeps the convoys out of the navy's way.",
                        bonus: 0,
                        bonusByPosture: { navyHunts: 4 },
                        meters: { fuel: -1 },
                        costReason: "Extra sorties flown to replace the convoys",
                        reportLine: "The convoys are held back, and the whole reinforcement is flown in.",
                      },
                    ],
                  },
                ],
              },
              uncertain: [
                {
                  weight: modWeight(55, meters.initiative),
                  title: "Crete falls to the airborne",
                  setFlags: { crete41Result: "taken" },
                  impact: { manpower: -1, fuel: 0, initiative: 0 },
                  outcome:
                    "Crete fell in ten days, and the victory ended German large-scale airborne operations forever. The defenders, forewarned and far stronger than estimated, shot the first waves out of the sky and onto pre-registered drop zones; Maleme airfield was taken by a margin of one withdrawn hill. Fallschirmjäger casualties ran near a quarter of the force committed, and Hitler told Student the day of the paratrooper was over. The instrument won its greatest prize and was spent as a strategic weapon in the act: a fact a certain Mediterranean island question will remember next year.",
                },
                {
                  weight: 100 - modWeight(55, meters.initiative),
                  title: "The assault fails",
                  setFlags: { crete41Result: "failed" },
                  impact: { manpower: -3, fuel: -1, initiative: -1 },
                  outcome:
                    "The minority projection, which the defenders were closer to than the legend admits: the airfield is never taken, the hill is held, and the second convoy goes down with the first. The mountain troops who were to land never do, and by the third day Mercury is called off, with the paratroopers' casualties spent for nothing. Student's corps survives, but as a warning and not as an instrument, and the airborne arm's reputation ends before the island does.",
                },
              ],
            },
            {
              label: "Pass on Crete: the Aegean flank can be watched, not owned",
              advisor: { name: "Halder", position: "An island garrison that is bypassed costs reconnaissance flights, while an airborne corps spent taking it costs the only one there is." },
              setFlags: { crete41: "pass" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "hessFlight41",
              outcome:
                "A plausible projection of the restraint the airborne arm's own future would have argued for: Crete stays British (a bomber and naval base flanking the Aegean and within range of Ploiești, a real and continuing irritation) and XI Air Corps stays intact, unbloodied, and available. What an intact airborne corps is worth depends entirely on whether anything later asks for one. Something will.",
            },
          ],
        };
        },
        get bismarckBreakout41() {
          return {
          date: "MAY 1941",
          title: "The Bismarck Sails",
          historicalRecord: true,
          situation:
            "The newest and most powerful battleship afloat, Bismarck, sits ready in the Baltic with the heavy cruiser Prinz Eugen for Operation Rheinübung: a breakout into the Atlantic to hunt the convoys that keep Britain fed. Naval doctrine says a ship this size operating alone against convoy escorts and the Royal Navy's full weight is exactly the gamble Weserübung's losses were meant to teach caution about" +
            (flags.navyStrength === "gutted"
              ? ", and this campaign's own fleet is thinner for it: Norway's full commitment spent the destroyer force this operation would want screening it through the Denmark Strait."
              : flags.navyStrength === "preserved"
              ? ", though Norway's limited landings left more of that screening force intact than the historical operation actually had."
              : "") +
            (flags.sealion === "launched"
              ? " The Kriegsmarine's own written objections to Sea Lion are recent enough that Raeder pressing for another gamble with the surface fleet, so soon after the last one, is its own small act of nerve."
              : "") +
            " Raeder wants the sortie anyway: a single capital ship loose in the Atlantic forces the Royal Navy to divert battleships from every other theater just to hunt it down.",
          choices: [
            {
              label: "Launch the breakout: send Bismarck and Prinz Eugen into the Atlantic",
              advisor: { name: "Raeder", position: "One ship, correctly used, ties down a fleet. That arithmetic has been true since the age of sail and is no less true now." },
              historical: true,
              setFlags: { bismarck41: "launched" },
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: "barbarossa41",
              uncertain: [
                {
                  weight: modWeight(45, meters.fuel),
                  title: "The hunt runs long",
                  impact: { manpower: 0, fuel: 1, initiative: 0 },
                  outcome:
                    "The contested naval gamble breaks favorably, longer than it did historically: Bismarck evades the pursuing Royal Navy force for days rather than the historical three, sinking meaningful additional tonnage before a scouting aircraft finally relocates her. The diversion of British capital ships from other theaters, the actual strategic point of the sortie, is worth correspondingly more.",
                },
                {
                  weight: 100 - modWeight(45, meters.fuel),
                  title: "The Hood, then the reckoning",
                  impact: { manpower: 0, fuel: -1, initiative: 0 },
                  outcome:
                    "What substantially happened. Bismarck sank the battlecruiser Hood with a single salvo in the opening engagement (one of the Royal Navy's worst single losses of the war, all but three of her 1,418 crew killed) and the shock of it triggered a pursuit by every heavy unit the Royal Navy could spare. A torpedo strike crippled Bismarck's steering two days later; she was sunk on May 27, having sailed for barely a week. The diversion of British ships was real but brief, and the Kriegsmarine's remaining capital ship strength shrank by one of its two most powerful units.",
                },
              ],
            },
            {
              label: "Hold Bismarck in port: the risk of losing the fleet's newest capital ship outweighs the diversion it buys",
              advisor: { name: "Dönitz", position: "A battleship sunk in the Atlantic ties down nothing once it sinks, and the U-boats can quietly do what one visible ship is about to try loudly and briefly." },
              setFlags: { bismarck41: "held" },
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: "barbarossa41",
              outcome:
                "One considered account of the more conservative case Dönitz and others made at the time: keeping the fleet's newest and most powerful ship in port avoids a repeat of the Graf Spee's fate, cornered and scuttled rather than lost in glory, and preserves it as a standing threat that ties down British planning simply by existing, without ever having to survive an actual chase. The Royal Navy still has to account for Bismarck's presence in the Baltic; it just never has to really hunt her.",
            },
          ],
        };
        },

        get sealionDisaster40() {
          return {
          date: "SEPTEMBER 1940",
          title: "The Channel Crossing",
          historicalRecord: false,
          situation:
            "The order stands, over the Kriegsmarine's written protest: the barge fleet sails for the Kent and Sussex beaches. This is projection into territory the historical war refused to enter: Sea Lion was postponed precisely because every serious staff study reached the same verdict. The first waves are crossing at eight kilometers an hour in converted river barges, under an air battle that has not been won, toward a coast the Royal Navy can reach from three directions within a day.\n\nThe only genuine uncertainty is the shape of the failure, and how much of the landing force can be recovered from it.",
          choices: [
            {
              label: "Press the landings home: establish the beachhead whatever the cost",
              advisor: { name: "Raeder", position: "The objection is in writing so that history knows the navy's opinion, and the navy will now be lost proving it." },
              impact: { manpower: -3, fuel: 0, initiative: 1 },
              next: "sealionAftermath40",
              uncertain: [
                {
                  weight: modWeight(70, meters.manpower),
                  title: "Annihilation on the beaches",
                  setFlags: { sealionSeverity: "annihilation" },
                  impact: { manpower: -3, fuel: 0, initiative: -1 },
                  outcome:
                    "The staff studies all reach the same place: the Home Fleet arrives inside forty-eight hours, the barge fleet is destroyed in the Channel behind the landed waves, and the beachhead (cut off from supply, armor, and retreat) is reduced over two weeks. The equivalent of a dozen first-rate divisions and most of the invasion transport are simply gone, along with any myth of German invincibility. Every campaign after this one is fought by an army that left its best assault infantry on English shingle. What happens to the men who gave that order is the next question.",
                },
                {
                  weight: 100 - modWeight(70, meters.manpower),
                  title: "The Dunkirk mirror",
                  setFlags: { sealionSeverity: "evacuation" },
                  impact: { manpower: -2, fuel: 0, initiative: -1 },
                  outcome:
                    "The kinder variant, and it is only kinder: the beachhead survives long enough for a humiliating night evacuation: Germany's own Dunkirk, run in reverse, under Royal Navy guns. Perhaps half the landed force returns without its equipment. The strategic result is identical (Britain unconquered, the invasion fleet spent, the army wounded) merely with more survivors to remember it, and to answer for it.",
                },
              ],
            },
            {
              label: "Abort at sea: recall the fleet mid-crossing",
              advisor: { name: "Halder", position: "No dignity is left in this operation, only arithmetic, and the men should be recalled while the arithmetic still counts the living." },
              setFlags: { sealionSeverity: "aborted" },
              impact: { manpower: -1, fuel: 0, initiative: -1 },
              next: "sealionAftermath40",
              outcome:
                "The least-bad exit available: a recall under air attack costs barges, some embarked units, and every ounce of the operation's political capital, but the army survives. The autumn is spent explaining the fiasco to allies and neutrals rather than exploiting anything, and the eastern planning that historically began quietly this season begins here under the shadow of visible failure. Explaining it, and to whom, is the next question.",
            },
          ],
        };
        },
        get sealionAftermath40() {
          return {
          date: "OCTOBER 1940",
          title: "What the Channel Cost",
          historicalRecord: false,
          situation:
            {
              annihilation: "A dozen divisions and the invasion fleet are gone, and Berlin has to explain it to a public that was told this war was winning itself. This is deep projection (no version of the real war ever had to answer this question, because no version of the real war did this) but the political mechanics of a regime absorbing a catastrophic, undeniable defeat are not speculative at all. Someone will be blamed. The only real question is who, and how publicly.",
              evacuation: "Half a landing force came home without its equipment, in the dark, under naval gunfire: a story that cannot be told as victory no matter how the press office tries. This is deep projection, since the real war never let this operation launch at all, but a regime managing a visible, half-witnessed military humiliation is not new territory for propaganda. What's still open is how much of the truth survives contact with the story Berlin decides to tell.",
              aborted: "No divisions were lost to enemy action, but three hundred barges, a great deal of fuel, and the operation's entire premise were spent recalling a fleet that never reached the beaches it was sent to take. This is deep projection: the real war's version of this decision happened quietly, on paper, months earlier. Doing it visibly, with the invasion already sailing, is a different and more public kind of failure to manage.",
            }[flags.sealionSeverity || "aborted"],
          choices: [
            {
              label: "Name it plainly: a failed operation, reported with the losses attached",
              advisor: { name: "Goebbels", position: "Resolve can be sold, but not a lie this size, to a public that will count the empty barracks within the month. Tell them enough of the truth that the rest of it holds." },
              setFlags: { sealionAftermath: "honest" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "tannenbaum40",
              outcome:
                "The costlier short-term choice and the more durable one: the losses are acknowledged in terms grim enough that the foreign press can't credibly claim a cover-up, which costs real morale at home but keeps the regime's public statements roughly tethered to what its own soldiers know happened. What it buys, mostly, is that the next real setback doesn't compound this one with a second, discovered lie.",
            },
            {
              label: "Bury it: reassign the survivors quietly, control the story completely",
              advisor: { name: "Hitler", position: "This did not happen the way the navy's memoranda say it happened, and the newspapers must understand the difference." },
              setFlags: { sealionAftermath: "buried" },
              favor: -1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "tannenbaum40",
              outcome:
                "The cheaper short-term choice: officially, the operation was a reconnaissance in force, quietly concluded. The men who were there know otherwise, and so does every intelligence service watching troop movements and barge losses that don't match the announced story: the cover survives contact with nobody who was actually paying attention, which by October 1940 is most of Europe's general staffs.",
            },
            {
              label: "Make Raeder the story: the Kriegsmarine's objections become the official explanation",
              advisor: { name: "Raeder", position: "The objection was written but the order was not, and if a name is needed for this it should at least be an honest one." },
              setFlags: { sealionAftermath: "scapegoat", raederStanding: "damaged" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "tannenbaum40",
              outcome:
                "The convenient choice, and the one with a real cost attached beyond this moment: the navy's own written, prescient objection becomes the official explanation for a defeat the order itself caused, protecting the decision at the expense of the man who tried hardest to prevent it. Raeder's standing with the naval staff, and his willingness to put objections in writing again, will not be the same going forward.",
            },
          ],
        };
        },
        get barbarossa41() {
          return {
          date: "MAY – JUNE 1941",
          title: "The Eastern Decision",
          historicalRecord: true,
          situation:
            "Directive 21 was signed in December; by now over three million men, the largest invasion force in history, stand staged from Finland to Romania. The premise underneath it is the war's premise: Britain fights on because it hopes for Russia, so remove Russia and the war is won. But the premise has a counter-ledger your economics staff keeps quietly updating: under the 1940 commercial agreements, Soviet trains deliver grain, oil, manganese, and rubber transshipped from Asia, on schedule, every week. The Reich's war economy runs partly on the goodwill of the state you are about to attack.\n\nFHO's assessment of the Red Army is confident: purge-gutted officer corps, obsolete tanks, a colossus of clay that will collapse in a season. (You have seen, at Typhoon and after, what FHO's confident assessments are worth, but on this path, that education hasn't happened yet.) Cancelling now means the invasion never launches and the war becomes something no German staff has seriously planned for: a long siege of Britain, funded by trade with Moscow." +
            (flags.raederStanding === "damaged"
              ? " The strongest voice for exactly that siege war belongs to a man whose standing with this staff hasn't been the same since the Channel: Raeder's written objection to Sea Lion was accurate, and being right in writing about a disaster that got his name attached to it anyway hasn't made this room any more inclined to listen to his next argument."
              : ""),
          choices: [
            {
              label: "Launch Barbarossa as planned",
              advisor: { name: "Halder", position: "The Wehrmacht is at its peak and the Red Army at its nadir, and history does not hold doors open but slams them." },
              historical: true,
              setFlags: { barbarossa: "launched" },
              impact: { manpower: -3, fuel: 0, initiative: 0 },
              next: "japanDirection41",
              outcome:
                "What happened, June 22, 1941: the decision the entire historical war hangs from. The colossus-of-clay assessment was half right for exactly one summer: the encirclement victories were real and enormous, and then the reserves FHO said didn't exist arrived in front of Moscow in December. The war this launched consumed roughly four of every five German soldiers killed in the entire conflict.",
            },
            {
              label: "Postpone one year: invade in May 1942 with deeper preparation",
              advisor: { name: "Jodl", position: "A year buys trucks, winter equipment and trained replacements, and the assessments say it buys the enemy less." },
              setFlags: { barbarossa: "postponed" },
              favor: 1,
              impact: { manpower: 1, fuel: -2, initiative: -1 },
              next: "pearlHarbor",
              outcome:
                "A speculative reading of the road not taken, and most historians judge it a worse one: the assessments Jodl leans on were wrong in the dangerous direction. Soviet tank and aircraft production was already outpacing Germany's and accelerating; the officer corps was rebuilding; the T-34 was entering mass production. A year of German preparation buys a year of faster Soviet preparation. You will discover in 1942 which staff was right.",
            },
            {
              label: "Cancel Barbarossa outright: there will be no eastern war",
              advisor: { name: "Raeder", position: "The enemy is in London, not Moscow. Strangle the island, take the Mediterranean, and let Stalin sell the oil to do it." },
              setFlags: { barbarossa: "cancelled", pathVariant: "noBarbarossa" },
              favor: 2,
              impact: { manpower: 3, fuel: 2, initiative: -1 },
              next: "armedTruce41",
              outcome:
                "The most radical divergence this campaign contains, and from here forward everything is deep projection: no serious German planning document maps this war, because the regime's entire ideology pointed east. What can be said honestly: the army history spent in Russia stays intact, the fuel history burned there stays banked, and in exchange the Reich accepts permanent strategic dependency on Soviet deliveries, a siege war against an Anglo-American alliance whose industry is beyond reach, and an eastern neighbor whose own army grows every quarter the truce holds. Cancelling the war's central catastrophe does not buy victory. It buys a completely different road to the same destination, and that road is worth walking to see why.",
            },
            {
              label: "Delay Barbarossa: resource a full Mediterranean campaign this summer, launch east in autumn",
              advisor: { name: "Raeder", position: "The case is for sequence, not cancellation: take Suez while the desert is thin, then turn east with the season's spoils and the Mediterranean closed behind." },
              setFlags: { barbarossa: "medFirst" },
              favor: 2,
              impact: { manpower: 0, fuel: -1, initiative: 1 },
              next: "suezFirst41",
              outcome:
                "A hybrid no German staff seriously proposed, because Hitler's ideological priority made the sequencing question itself nearly unaskable, but it tests something the pure cancel/launch choice doesn't: whether the problem was the war's magnitude or its order of operations. Every division and fuel ton sent south this summer is a division and fuel ton Barbarossa's June launch will not have.",
            },
          ],
        };
        },
        get suezFirst41() {
          return {
          date: "SUMMER 1941",
          title: "The Mediterranean First",
          historicalRecord: false,
          situation:
            "Deep projection: the invasion force staged against the Soviet border sits idle while its fuel and air support redirect south. Rommel, astonished to receive an army rather than a corps, drives on Suez with resources the historical desert war never gave him. Every week gained here is a week Barbarossa's June window loses, and your logisticians are unanimous that whatever happens in the desert, the eastern invasion does not launch this year on the historical calendar.",
          choices: [
            {
              label: "Commit fully: take Suez this summer, whatever it costs the autumn campaign east",
              advisor: { name: "Rommel", position: "Given the whole summer and the fuel that was going to Russia, the Canal can be delivered before the leaves turn." },
              setFlags: { suez41: "taken" },
              impact: { manpower: -1, fuel: 1, initiative: 0 },
              next: "barbarossaAutumn41",
              outcome:
                "Reasoned projection at its most generous: a fully resourced summer campaign plausibly delivers Suez and the Middle Eastern oil route Rommel never had the strength for historically. The bill arrives on schedule regardless: the eastern invasion this buys is one that launches in October, into a season no army has ever attacked Russia in and survived the winter that follows it well.",
            },
            {
              label: "Partial effort: improve the desert position without full commitment",
              advisor: { name: "Halder", position: "Take what the desert gives easily, and do not trade the whole eastern calendar for a canal, however tempting." },
              setFlags: { suez41: "partial" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "barbarossaAutumn41",
              outcome:
                "The hedge: meaningful desert gains without Suez itself, and an autumn invasion launch that is late but not catastrophically so. Splits the difference between the two strategies without fully committing to either: the familiar shape of every allocation choice in this campaign, arriving here in its most consequential form yet.",
            },
          ],
        };
        },
        get barbarossaAutumn41() {
          return {
          date: "OCTOBER 1941",
          title: "Barbarossa, Out of Season",
          historicalRecord: false,
          situation:
            "The eastern invasion finally launches: four months late, into the rasputitsa mud season that historically only arrived after the invasion's summer momentum was already spent. There is no summer of encirclement victories on this path, no Kiev, no long advance before autumn: the campaign begins already fighting the conditions that ended the historical Typhoon offensive. Your staff's assessment is the shortest and bluntest of the war: this is close to the worst possible calendar on which to begin this campaign.",
          choices: [
            {
              label: "Launch anyway: the ideological commitment cannot be delayed further",
              advisor: { name: "Halder", position: "Every version of this calendar has been run, none is good, and this is the one that is left." },
              setFlags: { eastFront: "lateAutumn" },
              impact: { manpower: -2, fuel: -1, initiative: 2 },
              next: "rostov41",
              outcome:
                "The harshest starting position this campaign can construct: no summer offensive, no encirclement victories, straight into mud and then snow with an invasion force that has not gained a single one of the advantages the historical June launch built before winter arrived. The same December Soviet counteroffensive that stopped the historical Typhoon twenty miles from Moscow now hits a force that has covered a fraction of the historical distance.",
            },
            {
              label: "Stand down for this year: hold the Mediterranean gains, revisit next spring",
              advisor: { name: "Raeder", position: "The season is gone and pretending otherwise will not bring it back. Take what the desert gave and wait for a calendar that does not guarantee failure." },
              setFlags: { barbarossa: "delayed2", pathVariant: "noBarbarossa" },
              favor: 2,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "armedTruce41",
              outcome:
                "Folds into the armed-truce war a year late, having spent the season on the Mediterranean instead of the border. The sequencing experiment's honest verdict: reordering the war bought real desert gains and cost the eastern invasion its only viable season, which is itself an answer to the question this whole hybrid was built to test.",
            },
          ],
        };
        },
        get japanDirection41() {
          return {
          date: "JULY 1941",
          title: "Pressing Tokyo",
          historicalRecord: true,
          situation:
            "With Barbarossa a month old, Ribbentrop presses the case he has made to Tokyo for a year: strike the Soviet Far East now, while Stalin's attention and reserves are consumed in the west, and end the two-front nightmare permanently. Japan's own Kwantung Army has war-gamed exactly this under the codename Kantokuen. But Tokyo's decision was never really Berlin's to make: Japan's 1939 defeat at Nomonhan left the Imperial Army wary of the Red Army's mechanized strength, the Navy's institutional weight favors resources over ideology, and an American oil embargo is making the Dutch East Indies look far more urgent than Siberia.\n\nYour ambassadors can press. What Tokyo's Imperial Conference actually decides on July 2nd is, by every honest account, almost entirely outside German control.",
          choices: [
            {
              label: "Press Tokyo hard for Kantokuen: a northern strike against Siberia",
              advisor: { name: "Ribbentrop", position: "Every division Japan pins in Manchuria is one that does not detrain in front of Moscow in December. Tokyo has been told so and will be told again." },
              setFlags: { japan: "pressNorth" },
              impact: { manpower: 0, fuel: -1, initiative: 1 },
              next: "moscowKiev",
              uncertain: [
                {
                  weight: 15,
                  title: "Tokyo obliges",
                  setFlags: { siberianReserves: "diverted" },
                  impact: { manpower: 2, fuel: 0, initiative: 0 },
                  outcome:
                    "The rarest roll in this campaign, against a decision that was never seriously Berlin's to make: the Kwantung Army faction wins the argument in Tokyo, and Japan moves against the Soviet Far East. The consequence is enormous and specific: the Siberian divisions that historically detrained west of Moscow in December, saving the city, are fighting Japan in Manchuria instead. Whatever happens at Typhoon this winter, it will not be stopped by reserves that no longer exist to arrive.",
                },
                {
                  weight: 85,
                  title: "Tokyo goes south regardless",
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  outcome:
                    "What actually happened. The Imperial Conference of July 2, 1941 committed Japan south, toward the Dutch East Indies' oil and the resource-rich colonies the embargo made suddenly essential: a decision German pressure had essentially no measurable effect on. Nomonhan's lesson held, the Navy's institutional weight held, and the Siberian divisions Moscow will need this December remain exactly where the historical record placed them.",
                },
              ],
            },
            {
              label: "Let Tokyo choose freely: spend no diplomatic capital pressuring an ally's strategy",
              advisor: { name: "Weizsäcker", position: "Tokyo's general staff can no more be ordered than Berlin's can, so the favors owed should be saved for a request Japan can actually grant." },
              setFlags: { japan: "noPress" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "moscowKiev",
              outcome:
                "The realist's choice, and it changes nothing about Tokyo's decision, which was never much influenced by Berlin's preferences to begin with. It does, at least, avoid spending goodwill on a request that was always going to be refused.",
            },
          ],
        };
        },
        get moscowFalls41() {
          return {
          date: "DECEMBER 1941",
          title: "Moscow Falls",
          historicalRecord: false,
          situation:
            "With the Siberian divisions fighting Japan instead of detraining west of the capital, the historical December counteroffensive that saved Moscow never gathers the strength that made it work. German spearheads that in the real war stalled twenty miles short instead fight into the capital's outskirts, then the city itself, through the last days of the year.\n\nIt is the single most extreme counterfactual this campaign reaches: the answer to the question every armchair strategist eventually asks. And the honest answer arrives with the capture itself: Stalin's government apparatus, industrial base, and command structure were already relocated to Kuibyshev on the Volga in October, as a standing contingency. Moscow's fall was planned for, not feared as fatal. The war continues from a new capital, fed by factories already relocated east of the Urals since summer and by a Lend-Lease pipeline the fall of one city does nothing to close." +
            (flags.forkMoscowHolds
              ? " Whatever thinned the reserves behind the city this time, it wasn't imagined: the capture came weeks earlier than this campaign's own historical-record branch ever reaches it."
              : ""),
          choices: [
            {
              label: "Press on toward the Volga: pursue the relocated government",
              advisor: { name: "Guderian", position: "The head has been taken, but a war that grows a new one each time one is taken cannot be trusted." },
              setFlags: { moscowCaptured: true, pursuit: "volga" },
              impact: { manpower: -2, fuel: -1, initiative: 0 },
              next: "sovietFracture42",
              uncertain: [
                {
                  weight: modWeight(25, meters.fuel),
                  title: "The pursuit finds only space",
                  impact: { manpower: -2, fuel: -1, initiative: 0 },
                  next: "sovietFracture42",
                  outcome:
                    "Reasoned projection: a pursuit deeper into a country that only gets larger and colder the further east it goes achieves nothing the historical Typhoon's own failed pursuit didn't already demonstrate. The war was never shaped like a snake that dies when its head is cut off: chasing a government that can relocate again only repeats the overextension this campaign has punished at every other node.",
                },
                {
                  weight: 100 - modWeight(25, meters.fuel),
                  title: "The pursuit overreaches badly",
                  impact: { manpower: -3, fuel: -2, initiative: 0 },
                  next: "volgaOverreach42",
                  outcome:
                    "The overextension this campaign keeps warning about arrives at its worst possible moment: winter, distance, and a supply line already stretched past Moscow combine into a genuine crisis, not merely a fruitless advance. The spearheads that pushed east are the ones now in the most danger of not coming back at all.",
                },
              ],
            },
            {
              label: "Consolidate: hold Moscow, declare the symbolic victory, let winter set the pace",
              advisor: { name: "Bock", position: "The headline has been won, and the army should not be lost proving the headline true." },
              setFlags: { moscowCaptured: true, pursuit: "consolidate" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "sovietFracture42",
              outcome:
                "The disciplined choice, and the more honest one about what was actually won: a capital city, not a war. The Soviet state continues to function from the Volga, continues to receive American trucks and British tanks by convoy, and continues to out-produce Germany in tanks and aircraft every quarter from here forward. Moscow's fall becomes this campaign's most dramatic chapter title, and, in every way that mattered to the war's outcome, nothing more than that.",
            },
          ],
        };
        },
        get volgaOverreach42() {
          return {
          date: "JANUARY 1942",
          title: "The Pursuit That Went Too Far",
          historicalRecord: false,
          situation:
            "The spearheads reaching for Kuibyshev are now the war's most exposed formations: beyond any historical German advance, in weather no army in this theater has been equipped for, at the end of a supply line that was already failing at Moscow. What began as a pursuit has become a question of whether this campaign's most successful campaign is about to produce its worst disaster, in the same winter, for the same reasons the historical Typhoon already demonstrated once.",
          choices: [
            {
              label: "Order an immediate withdrawal to defensible winter lines: cut losses now",
              advisor: { name: "Guderian", position: "Pursuit was what was asked for, not Napoleon's weather as well. The army should be pulled back before the choice is made for it." },
              historical: false,
              setFlags: { volgaOverreach42: "withdraw" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "sovietFracture42",
              outcome:
                "The chastened version of the same lesson every other overextension in this campaign has taught: pulling back costs the pursuit's remaining momentum but saves the formations that made it. Moscow's capture stands; the deeper prize the pursuit reached for is quietly abandoned before it can cost what Napoleon's version of this exact geography once did.",
            },
            {
              label: "Press on regardless: the government is close enough to be worth the risk",
              advisor: { name: "Hitler", position: "Halting now would make the whole advance since June theater, so what the pursuit began must be finished." },
              historical: false,
              setFlags: { volgaOverreach42: "press" },
              impact: { manpower: -3, fuel: -1, initiative: 0 },
              next: "sovietFracture42",
              outcome:
                "The historical pattern this campaign has shown at every scale, played out at its largest: the spearheads that pressed on found the same cold, the same distance, and the same absent supply that broke every other overreach in this war, only further from home and with less of an army left to withdraw when the answer finally arrives.",
            },
          ],
        };
        },
        get sovietFracture42() {
          return {
          date: "WINTER 1941 – 1942",
          title: "The State Behind the Urals",
          historicalRecord: false,
          speculative: true,
          situation:
            "Moscow has fallen, and every armchair version of this war now has to answer the same question rather than assume it. The honest scholarly answer is stated first, because it governs the odds: the strong consensus is that the Soviet state does not collapse: the government functions from Kuibyshev, the relocated factories are already producing, Lend-Lease flows through Archangel and Persia, and the historical state survived losses in 1941 that no prewar theory said any state could survive.\n\nAgainst that consensus stands a minority argument this campaign will let you test rather than merely read about: that Moscow was not just a city but the hub of every railway, every ministry, and the myth of the regime's invincibility, and that some threshold of catastrophe exists past which even that state fractures. Anything downstream of that argument is marked for what it is: speculation beyond what the evidence supports." +
            (flags.moscowRace41 === "committed"
              ? " The city fell to a command that spent everything reaching it rather than pausing to secure the flank first: whatever this state's actual breaking point turns out to be, the approach that found it was the maximalist one, not the cautious one."
              : "") +
            (flags.pursuit === "volga"
              ? " This command didn't stop at the fallen capital either: the relocated government was chased toward the Volga rather than left to consolidate at a distance, which is exactly the kind of decision that would push a fracturing state toward the threshold this argument is asking about, if that threshold exists at all."
              : ""),
          choices: [
            {
              label: "Press the political collapse: demand capitulation in the east while the shock is total",
              advisor: { name: "Ribbentrop", position: "States are ideas held together by belief. With the capital gone and the leader governing from a river town, belief is exactly what winters like this one are for breaking." },
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "fractureResolution42",
              uncertain: [
                {
                  weight: modWeight(15, meters.manpower),
                  title: "The state fractures",
                  setFlags: { sovietState: "fractured", speculativePath: true },
                  impact: { manpower: 1, fuel: 0, initiative: 0 },
                  outcome:
                    "The minority argument came to pass, against the longest odds this campaign offers, and it is labelled accordingly. Regional commands begin treating Kuibyshev's orders as advisory; a Far Eastern grouping opens its own channel to Tokyo; and by late winter the state's ability to compel a unified war effort is visibly breaking. What Germany does with a fracturing enemy is now an actual question, and this campaign will not pretend the scholarly record supports any of what follows.",
                },
                {
                  weight: 100 - modWeight(15, meters.manpower),
                  title: "Kuibyshev holds",
                  setFlags: { sovietState: "holds" },
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  outcome:
                    "The consensus case, arriving on schedule: the Soviet state was never a snake that dies with its head. The government functions from the Volga, the Urals factories accelerate, and the demand for capitulation is answered, in the way your staff privately predicted, with silence, and then with the winter counteroffensive that was building either way. The war continues, now against an enemy that has absorbed the worst single blow this campaign can deliver and remained a state.",
                },
              ],
            },
            {
              label: "No demands: consolidate the winter line and let the capture speak militarily",
              advisor: { name: "Bock", position: "The capital has been taken, and asking the enemy to notice louder will not improve the road conditions or the temperature." },
              setFlags: { sovietState: "holds" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "pearlHarbor",
              outcome:
                "The soldier's answer to a political question: dig in, hold what was taken, and let 1942 arrive. The state behind the Urals holds, as the consensus always said it would, and the eastern war continues from a forward line history never reached, against an enemy no less determined for the loss of its capital.",
            },
          ],
        };
        },
        get fractureResolution42() {
          return {
          date: "SPRING 1942",
          title: flags.sovietState === "fractured" ? "The Eastern Armistice" : "The Winter Answer",
          historicalRecord: false,
          speculative: flags.sovietState === "fractured",
          situation:
            flags.sovietState === "fractured"
              ? "Marked plainly, up front: everything that follows is speculation beyond what the historical evidence supports: the consensus of scholarship is that the road here does not exist. On it, nonetheless: emissaries through Stockholm carry terms from a Kuibyshev leadership that can no longer compel a unified war. What is on offer is an armistice in the east (a line, roughly the Volga, behind which a diminished Soviet state persists) not a surrender, and not a peace.\n\nYour own staff's honest annex to the terms is the part no celebration in Berlin will read aloud: an armistice makes the regime's eastern project operational. What this government intends for the occupied East, spelled out in its own planning documents, is dispossession, enslavement, and mass death on a continental scale. Whatever this is, it is not a happy ending. It is the catastrophe changing hands."
              : "The demand for capitulation was answered with silence, and then with artillery: the winter counteroffensive from the Kuibyshev government's reserves arrives against your forward positions around the captured capital. It is weaker than the historical December blow, the Siberian divisions are in Manchuria, but it is unmistakably the answer to the political question: the state holds, and it is still fighting.",
          choices:
            flags.sovietState === "fractured"
              ? [
                  {
                    label: "Accept the Volga armistice: the eastern war ends on the line where it stands",
                    advisor: { name: "Halder", position: "A year has been spent watching this army bleed toward a decision. If one is really on the table, it should be taken before winter, or arithmetic withdraws the offer." },
                    setFlags: { pathVariant: "eastArmistice" },
                    impact: { manpower: 2, fuel: 1, initiative: 0 },
                    next: "volgaAftermath42",
                    outcome:
                      "The armistice is signed on the speculative page it lives on. What it ends is the shooting war in the east; what it does not end is anything else: the war against Britain and America continues, the occupied East passes under a regime whose plans for it are written down and monstrous, and in a New Mexico desert a program conceived with Germany's name on it runs on its own unbroken clock. What this command actually does with an army suddenly freed from a two-front war is the next, and last, real question this campaign asks.",
                  },
                  {
                    label: "Reject the terms: press beyond the Volga for total collapse",
                    advisor: { name: "Jodl", position: "A fractured state can re-set, and half a decision in the east is how this war came to need one." },
                    setFlags: { pathVariant: "eastOverreach" },
                    impact: { manpower: -2, fuel: -2, initiative: 0 },
                    next: "pearlHarbor",
                    outcome:
                      "The speculative branch's own overreach lesson, delivered on schedule: pressing past the Volga into a fracturing-but-vast state trades a signed line for an unbounded occupation problem across distances that broke the historical army when the state WAS unified. The fracture partially reverses under invasion pressure, nothing re-unifies a breaking state like an enemy refusing its surrender, and the eastern war resumes, deeper, thinner, and without the armistice that was briefly, speculatively, on the table.",
                  },
                ]
              : [
                  {
                    label: "Hold the forward line at Moscow through the winter",
                    advisor: { name: "Kluge", position: "It was taken and it is held, and an army that captures a capital and then leaves it has explained something to both sides." },
                    setFlags: { winterCrisis: "holdMoscow" },
                    impact: { manpower: -1, fuel: 0, initiative: 0 },
                    next: "pearlHarbor",
                    outcome:
                      "The forward positions hold through a brutal winter against a counteroffensive running on less than its historical strength. The capital stays taken: a fact of enormous symbolic weight and, as the spring assessments will quietly confirm, strikingly little strategic consequence. The state functions from the Volga; the war continues.",
                  },
                  {
                    label: "Pull back to a prepared winter line west of the city",
                    advisor: { name: "Rundstedt", position: "The city was the prize of 1941 and need not be the graveyard of 1942." },
                    setFlags: { winterCrisis: "withdrawMoscow" },
              favor: 1,
                    impact: { manpower: 1, fuel: 0, initiative: -1 },
                    next: "pearlHarbor",
                    outcome:
                      "The disciplined and deflating answer: Moscow, taken at such gamble, is yielded back to winter logistics within weeks: the symbolic capture of the war traded away by the same cold arithmetic that made the historical Typhoon stop twenty miles short. The army survives the winter in better order for it, and the entire Moscow episode settles into what the honest projection always said it was: the most dramatic chapter of this campaign, and one of the least decisive.",
                  },
                ],
        };
        },
        get volgaAftermath42() {
          return {
          date: "SPRING 1942",
          title: "What an Army Freed From One War Does With the Other",
          historicalRecord: false,
          speculative: true,
          situation:
            "Marked plainly, up front: this is the last speculative page this campaign turns before the record closes on it. The eastern war has stopped. What that actually means, in practical terms this staff has never had to plan for, is a war Reich has fought on two fronts since 1939 suddenly needing to decide what a one-front war is for. The army east of the Volga line is not disbanding (the armistice holds a front, it doesn't dissolve one) but the divisions that spent a year grinding toward Kuibyshev are, for the first time in this war, actually available for something else. What this command does with an army it has never before had the luxury of redeploying whole is the question history was never in a position to ask, because history never reached this page.",
          choices: [
            {
              label: "Turn the freed divisions west: concentrate everything against Britain and the coming American buildup",
              advisor: { name: "Jodl", position: "The whole war has been fought against two enemies with strength meant for one. For the first time one enemy can be fought with strength meant for two, and what that does should be found out before the Americans finish arming." },
              historical: false,
              setFlags: { volgaAftermath42: "west" },
              favor: -1,
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "END",
              outcome:
                "The aggressive reading of an unfamiliar position: a concentrated western buildup, using an army no historical Reich ever had free to concentrate, tests the Atlantic Wall's actual strength against an undistracted defender for real rather than only in this campaign's own separate speculative branch on that exact question. It does not stop the clock running in New Mexico, and it does not un-write what this government's own documents say about the East it now administers rather than fights across. It is, at most, a longer intermission: bought with the one asset this armistice actually generated, and spent testing whether a longer intermission is worth anything at all against an enemy with an atomic bomb and the time to finish building it.",
            },
            {
              label: "Hold everything in place: consolidate the diminished war rather than escalate a different one",
              advisor: { name: "Weizsäcker", position: "An armistice is not a victory, and one this speculative survives exactly as long as nobody tests what it is worth. It is better to administer what exists than to gamble it finding out." },
              historical: false,
              setFlags: { volgaAftermath42: "hold" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "END",
              outcome:
                "The disciplined reading, and the one this campaign's own honest accounting favors: consolidating rather than escalating treats the armistice as what it actually is: a pause purchased at odds this entire branch required stacking three separate unlikely breaks to reach, not a foundation to build a wider war on. It doesn't stop the clock in New Mexico either. Nothing on this page does. What it does is decline to spend the one rare thing this path produced testing a question the clock was always going to answer regardless of what this command chose here.",
            },
          ],
        };
        },
        get east42Launch() {
          return {
          date: "MAY 1942",
          title: "Barbarossa, One Year Late",
          historicalRecord: false,
          situation:
            "The postponed invasion stands ready: better-equipped, winter-provisioned, with a year of additional production behind it. Across the demarcation line, the year was not idle: FHO's revised order of battle shows the Red Army markedly deeper than its 1941 estimate, its new tank models arriving in numbers the 1941 files never contained, and its border deployments, burned by the visible German staging of last spring, no longer sitting forward in the vulnerable peacetime pattern that made the historical encirclements possible.\n\nThe staff argument from last May must now be settled by force: did the year favor the prepared attacker, or the recovering defender? Honest projection says the second, but this is an honestly uncertain roll of history's dice, and it is yours to throw or to refuse.",
          choices: [
            {
              label: "Launch the 1942 invasion",
              advisor: { name: "Halder", position: "Germany is stronger than it was, though it is no longer certain that this is the right comparison." },
              setFlags: { east42: "launched" },
              impact: { manpower: -2, fuel: -1, initiative: 0 },
              next: "blackMay",
              uncertain: [
                {
                  weight: modWeight(30, meters.fuel),
                  title: "The prepared blow lands",
                  impact: { manpower: -1, fuel: -1, initiative: 0 },
                  outcome:
                    "The minority case: better logistics and winter provisioning keep the 1942 offensive coherent deeper into the year than the historical 1941 managed, and the opening battles are won convincingly if less spectacularly: no repeat of the great border encirclements against an army deployed in depth. The war in the east begins anyway, one year late, against a stronger enemy, with the same continental arithmetic waiting underneath it. This path now converges toward the historical war's shape, minus its first year of easy victories.",
                },
                {
                  weight: 100 - modWeight(30, meters.fuel),
                  title: "The recovered army holds",
                  impact: { manpower: -3, fuel: -1, initiative: -1 },
                  outcome:
                    "The likelier case by some margin: the Red Army of 1942 (deployed in depth, partially re-equipped, forewarned by a year of visible staging) absorbs the opening blow without the catastrophic pocket battles of the historical 1941. The invasion grinds forward weeks, not months, before culminating far short of the Dnieper, and Germany has bought the full eastern war with none of its opening dividend. The staff argument is settled: the year favored the defender, decisively.",
                },
              ],
            },
            {
              label: "Refuse the throw: stand the invasion down permanently",
              advisor: { name: "Raeder", position: "A year ago this was a gamble and today it is a donation. Keep the army and let the truce keep Germany." },
              setFlags: { east42: "cancelled", pathVariant: "noBarbarossa" },
              favor: 2,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "bomberWar43",
              outcome:
                "The invasion dissolves back into garrisons, and this path joins the armed-truce war, but a year late, and the year was expensive: the Mediterranean window Raeder's strategy needed closed while three million men sat in Poland proving nothing. Gibraltar's moment, Franco's brief ambivalence, the thin British desert year: all spent. The truce war begins here with the strategic initiative already leaking away west.",
            },
          ],
        };
        },
        get armedTruce41() {
          return {
          date: "SUMMER – AUTUMN 1941",
          title: "The Armed Truce",
          historicalRecord: false,
          situation:
            "Deep projection now: the invasion armies disperse to garrisons and the eastern war becomes a border: the most heavily watched border on earth, but a border. Moscow's reaction, as your diplomats read it, is relief layered over suspicion layered over accelerating armament: the deliveries continue (Stalin has every reason to feed a Germany pointed west), and behind them Soviet factories relocated nowhere, disrupted by nothing, run at full peacetime tempo.\n\nThe war that remains is the one Raeder always wanted and the army never planned: Britain unbeaten, America arming her openly, and a Mediterranean where, for one more season, British strength is thin enough to contest. Your economics staff's summary is one sentence long: the Reich is now a continental fortress living on its enemy's patience and its neighbor's exports.",
          choices: [
            {
              label: "Commit to the siege of Britain: U-boats, air pressure, and time",
              advisor: { name: "Dönitz", position: "Given the boats that Barbarossa's steel would have eaten, the tonnage war can be shown as it looks when it is actually funded." },
              setFlags: { truce41: "siege" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "pearlHarbor",
              outcome:
                "Projection with a real edge: a U-boat arm funded from the east's cancelled steel quota is materially larger than the historical one, and 1941–42 in the Atlantic runs correspondingly harder for Britain. The honest ceiling remains where it always was (American shipbuilding, once it engages, out-launches any plausible sinking rate) but on this path the crisis of British imports runs deeper and longer before the curve turns.",
            },
            {
              label: "Prepare the Mediterranean strategy: the periphery is now the war",
              advisor: { name: "Raeder", position: "Gibraltar, Malta and Suez: close the sea at both ends and the British Empire becomes two empires, neither able to reach Germany." },
              setFlags: { truce41: "mediterranean" },
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: "pearlHarbor",
              outcome:
                "Raeder's actual 1940–41 proposal, finally resourced: with no eastern front to feed, the Mediterranean can receive not a corps but an army. The strategy's known dependencies come with it (Gibraltar needs Franco, who historically refused; the desert needs supply across a sea Malta contests) but for the first time in any timeline, those problems can be attacked with the Wehrmacht's full weight. The season for it is now; windows like this close.",
            },
          ],
        };
        },
        get mediterranean41() {
          return {
          date: "1942",
          title: "The Middle Sea",
          historicalRecord: false,
          situation:
            "The armed-truce war's one active theater, now resourced as a main effort: a thing the historical Mediterranean never was. Three doors present themselves, and your staff is honest that each has a lock: Gibraltar closes the western Mediterranean but requires Spanish entry, and Franco's price rises every time he is asked; Suez closes the eastern end but must be reached across a desert whose supply line Malta still bleeds; and behind both stands the fact your Atlantic staff keeps repeating: Britain's true lifeline runs around the Cape and across the ocean, and no Mediterranean victory touches it." +
            (flags.usWar === "declared"
              ? " America's entry into the war hangs over every calculation: the strategic clock that was generous in 1941 now visibly runs."
              : flags.usWar === "withheld"
              ? " The withheld American declaration buys this theater breathing room: Washington arms Britain but has not yet arrived, and every month of that delay is a month this strategy can use."
              : ""),
          choices: [
            {
              label: "Operation Felix: bring Spain in and take Gibraltar",
              advisor: { name: "Jodl", position: "The Rock falls to siege artillery and mountain corps in a month, as every study agrees, and the only fortification that matters is Franco's signature." },
              setFlags: { med41: "gibraltar" },
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "bomberWar43",
              uncertain: [
                {
                  weight: modWeight(40, meters.fuel),
                  title: "Franco signs",
                  impact: { manpower: -1, fuel: 1, initiative: 1 },
                  next: "iberianQuestion42",
                  outcome:
                    "The contested diplomatic throw lands: with no eastern war consuming German credibility and a visibly winning Reich at his border, Franco's price (grain, oil, Morocco) is met, and Felix executes close to its studies. Gibraltar falls; the western Mediterranean closes; Malta withers on a cut vine. The honest footnote arrives with the victory: Britain's Atlantic lifeline never ran through Gibraltar, and the war's real arithmetic, American industry, has not moved a decimal point. What Franco really wants for the signature is its own negotiation, separate from the siege.",
                },
                {
                  weight: 100 - modWeight(40, meters.fuel),
                  title: "Franco waits you out",
                  next: "gibraltarStalled42",
                  impact: { manpower: 0, fuel: 0, initiative: -1 },
                  outcome:
                    "The likelier throw, and the historical one: Franco, whose country is starving and whose coasts are hostage to the Royal Navy, smiles, raises his price, and signs nothing. Months of diplomatic capital and staged siege trains are spent on a door that never opens. What that stalled weight does next, rather than sitting idle at the Pyrenees indefinitely, is the next real question.",
                },
              ],
            },
            {
              label: "The Suez axis: an army, not a corps, into North Africa",
              advisor: { name: "Rommel", position: "Every battle fought here was won or lost by a supply column. Give a real army with a real fleet behind it, and Cairo becomes a staging area, not a dream." },
              setFlags: { med41: "suez" },
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "suezHorizon42",
              outcome:
                "Projection of the theater at full weight: multiple corps, theater-level air cover that finally suppresses Malta, and a 1942 drive that plausibly does what the historical shoestring version could not: Alexandria, the Canal, the oil route to Basra threatened. It is the most complete regional victory reachable anywhere in this campaign, and its ceiling is stated in the same breath: the Empire reroutes around the Cape, America's buildup continues untouched, and the Reich has conquered a periphery while the war's center (industrial, Atlantic, eventually atomic) remains exactly where it was. What a fully-resourced army actually does with a conquered Middle East is the next question.",
            },
            {
              label: "Neither: hold the truce lines everywhere and dare the Allies to come to you",
              advisor: { name: "Rundstedt", position: "Europe is held from the Pyrenees to the Bug, and the enemy can study the problem of assaulting it. The study has been made, and the assignment would not be enjoyed." },
              setFlags: { med41: "fortress" },
              impact: { manpower: 1, fuel: 1, initiative: 0 },
              next: "bomberWar43",
              outcome:
                "The pure fortress projection: maximum preservation, zero initiative. Continental Europe under German garrison is a monstrous military problem for any invader, and sitting inside it hands the Western Allies the two wars they most want: the bomber war against your industry and the blockade war against your imports, both of which they can escalate indefinitely while you cannot answer either at range. Fortresses do not lose quickly. They also do not win.",
            },
          ],
        };
        },
        get gibraltarStalled42() {
          return {
          date: "MID-1942",
          title: "The Weight That Went to Spain",
          historicalRecord: true,
          situation:
            "The siege trains are staged, the mountain corps is ready, and none of it matters without a Spanish signature that isn't coming. Franco's actual historical calculation hasn't changed just because this Reich looks stronger at his border than the real one did: his country still can't feed itself without grain the Royal Navy could cut off in a season, and a dictator who survived his own civil war by being cautious isn't spending his regime's survival on someone else's war, however well it seems to be going. What this command does with a corps-sized force staged for an operation that isn't happening is now the actual decision.",
          choices: [
            {
              label: "Redirect the staged weight south: feed it into the Suez axis instead",
              advisor: { name: "Rommel", position: "Spain's door is closed and Egypt's is not. Send what waited on the wrong side of the Pyrenees and every division of it will find a use." },
              historical: false,
              setFlags: { gibraltarStalled42: "redirect" },
              favor: 1,
              impact: { manpower: 0, fuel: -1, initiative: 1 },
              next: "bomberWar43",
              outcome:
                "The pragmatic answer: a stalled Gibraltar operation's weight doesn't have to sit idle at the Pyrenees indefinitely when a desert theater is actively short of exactly this kind of reinforcement. Redirecting it costs the redeployment time itself and forecloses Gibraltar quietly rather than dramatically, but it converts a diplomatic dead end into real strength somewhere the door is actually open.",
            },
            {
              label: "Keep the pressure staged: Franco's calculation can still change",
              advisor: { name: "Ribbentrop", position: "Franco has not said no but not yet, and a staged corps on his border is the most persuasive diplomatic instrument this office has ever been given, one it intends to keep using." },
              historical: true,
              setFlags: { gibraltarStalled42: "wait" },
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: "bomberWar43",
              outcome:
                "What Berlin actually did, and the historical record's own verdict on it is not kind: Franco's calculation never changed, not in 1941, not in 1942, not for the rest of the war: the staged pressure was never going to work on a man whose caution was the entire reason he survived to be pressured. The weight stays committed to a door that stays closed, unavailable to any theater that might have used it, for the price of a diplomatic outcome that was decided the moment the question was first asked.",
            },
          ],
        };
        },
        get iberianQuestion42() {
          return {
          date: "LATE 1942",
          title: "Franco's Actual Price",
          historicalRecord: false,
          situation:
            "The siege guns worked; the diplomacy now has to be paid for. Franco's price for Gibraltar was never really grain and oil: those were the opening terms. What Madrid actually wants is Morocco's French colonial territory folded into Spain outright, and a formal alliance that ends Spanish neutrality for good rather than the convenient fiction it's been. Granting it buys a fully committed Mediterranean partner. Refusing it risks the one diplomatic success this theater has produced souring into resentment the moment the siege guns stop being useful leverage.",
          choices: [
            {
              label: "Pay Franco's full price: Morocco, and a real alliance, not a favor owed",
              advisor: { name: "Ribbentrop", position: "He wants an empire, not a thank-you note. Give it, and Spain stops being a neutral to be bribed and becomes an ally to plan around." },
              historical: false,
              setFlags: { iberianQuestion42: "payFull" },
              impact: { manpower: -1, fuel: 1, initiative: 0 },
              next: "bomberWar43",
              outcome:
                "The maximalist read of the diplomatic victory: Franco gets his empire, and Spain becomes a genuine Axis partner rather than a favor-owed neutral: Iberian ports, Iberian resources, and a western Mediterranean that stays closed on more than a siege's momentum. It also means a new colonial administration, a new set of French colonial grievances, and a partner whose loyalty was purchased with territory rather than earned with shared risk: a foundation this campaign does not pretend is the same thing as an alliance.",
            },
            {
              label: "Pay the minimum: grain and oil as promised, decline the territorial ask",
              advisor: { name: "Jodl", position: "A fortress was paid for, not an empire, and handing over Morocco makes an enemy of every French colonial administrator who might otherwise have stayed quiet." },
              setFlags: { iberianQuestion42: "payMinimum" },
              impact: { manpower: 1, fuel: -1, initiative: 0 },
              next: "bomberWar43",
              outcome:
                "The narrower reading: Franco gets what was in truth promised and nothing more, keeping Vichy's colonial administration from a fresh grievance the historical war never had to manage. The relationship cools measurably, the one clean diplomatic win in this whole theater ages into a transaction rather than a partnership, but the western Mediterranean stays closed on the terms actually paid for, and no new colonial question opens to complicate it.",
            },
          ],
          };
        },

        get suezHorizon42() {
          return {
          date: "LATE 1942",
          title: "How Far East a Conquered Suez Reaches",
          historicalRecord: false,
          situation:
            "The Canal is held, Alexandria is a German-administered port, and your economics staff has done the one calculation that actually matters now: none of it feeds the war unless the oil route to Basra is more than a line on a map. Abadan's refinery, on the Persian side of the Gulf, is one of the largest in the world, and it is roughly a thousand kilometers of contested desert and a British-garrisoned Iraq away from a Wehrmacht that has just spent a full campaigning season taking Egypt. The Suez victory bought a position. Whether it buys fuel is a separate, harder question, and your own staff is honest that the further this goes, the more it resembles the eastern campaign's own lesson in miniature: victory over distance is not the same as victory over supply.",
          choices: [
            {
              label: "Push for Basra and the Persian oil fields: spend the momentum while it exists",
              advisor: { name: "Rommel", position: "More has been taken with less all along. Give the fuel this theater has finally earned, and the result will show what a supply line does when it is not fed to another front." },
              setFlags: { suezHorizon42: "push" },
              impact: { manpower: -2, fuel: -2, initiative: 0 },
              next: "bomberWar43",
              uncertain: [
                {
                  weight: modWeight(25, meters.fuel),
                  title: "Abadan is reached, briefly",
                  impact: { manpower: -1, fuel: 2, initiative: 0 },
                  outcome:
                    "The most contested case, and this campaign's furthest-reaching Mediterranean projection: the drive reaches Abadan before Anglo-Indian reinforcements arrive in force, and for a season the refinery is a German prize rather than a British one. What that prize is actually worth is the honest complication: the tankers to move Persian oil to a Reich still fighting a naval war it cannot win are the same tankers the U-boat arm already can't spare, and the pipeline infrastructure to move it overland doesn't exist and can't be built under the air attacks a position this exposed invites. A real strategic asset, and one this campaign cannot honestly promise gets fed to the war effort that took it.",
                },
                {
                  weight: 100 - modWeight(25, meters.fuel),
                  title: "The desert answers the way it usually does",
                  impact: { manpower: -2, fuel: -1, initiative: -1 },
                  outcome:
                    "The likelier case, and the theater's oldest lesson repeated at greater distance: a thousand kilometers of contested supply line is not meaningfully easier to hold than the historical desert war's shorter version, and Anglo-Indian forces defending their own approaches to Iraq have a shorter line to their reinforcements than this drive has to its own. The push culminates well short of Basra, in country that eats fuel faster than any convoy can replace it: Rommel's own historical complaint, recurring at a scale this campaign warned was coming.",
                },
              ],
            },
            {
              label: "Consolidate at the Canal: Egypt is the prize, and it's a real one without Persia",
              advisor: { name: "Kesselring", position: "The Suez Canal is held, and the fact deserves one full season of enjoyment before it is asked to be the start of a second desert war further from home than the first." },
              setFlags: { suezHorizon42: "consolidate" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "bomberWar43",
              outcome:
                "The disciplined answer to a real temptation to overreach: holding the Canal and the position already won, rather than spending it chasing oil this campaign's own logistics staff can't promise arrives usable. It's a smaller story than Abadan's, a fortified periphery rather than a fuel solution, but it's the version of this victory that survives contact with the Reich's actual capacity to convert distant conquest into anything the war back home can use.",
            },
          ],
        };
        },
        get bomberWar43() {
          return {
          date: "1943",
          title: "The War That Comes Anyway",
          historicalRecord: false,
          situation:
            "The truce war's central discovery, arriving on schedule: a Germany that attacks no one is still at war with the two powers it cannot reach. " +
            (flags.usWar === "withheld"
              ? "Even with the American declaration withheld into 1942, Washington's entry came (provoked, funded, and inevitable) merely months later than history's version. "
              : "") +
            "The Combined Bomber Offensive builds over the Reich exactly as it did historically, but against a Luftwaffe that is, on this path, larger: no eastern front has been devouring its squadrons. The raids grow anyway; American production makes that argument mathematically. Meanwhile the blockade tightens the ledger your economists flagged in 1941: the Reich's imports run through Soviet goodwill, and every quarter the truce holds, Moscow's terms of trade harden. The fortress is intact, besieged, and being photographed from thirty thousand feet.",
          choices: [
            {
              label: "Fighter-first: turn the Luftwaffe into a defensive weapon and make the sky unaffordable",
              advisor: { name: "Galland", position: "Given the fighters and the fuel, daylight over the Reich becomes a place American crews write home about with dread." },
              setFlags: { bomber43: "fighters" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "uranverein43",
              outcome:
                "Projection of Galland's actual argument, finally adopted at full strength: an undistracted, fighter-heavy Luftwaffe makes the 1943–44 daylight offensive brutally expensive: Schweinfurt-scale loss rates as the norm, not the scandal. The honest curve still bends one way: escort fighters arrive, American training out-produces German attrition, and air superiority is lost later rather than kept. Later, on this path, is worth having.",
            },
            {
              label: "Retaliate: vengeance weapons and a renewed Blitz against British cities",
              advisor: { name: "Göring", position: "They will stop burning German cities when theirs burn brighter. Terror is a currency, and Germany should not be the only one paying it." },
              setFlags: { bomber43: "retaliation" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "uranverein43",
              outcome:
                "The evidence points the same way at both ends: retaliation bombing did not break British production or morale in 1940–41 and does not now, while every bomber and V-weapon built is a fighter not built: the same trade the historical Reich made, and lost by. The raids buy headlines and cost the defense of the Reich its margin.",
            },
            {
              label: "Go underground–disperse and harden industry against a bombing war measured in years",
              advisor: { name: "Speer", position: "The factories the enemy can see, he will destroy. The proposal is factories he cannot see." },
              setFlags: { bomber43: "dispersal" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "uranverein43",
              outcome:
                "Projection of the program the historical Reich began desperately in 1944, started here deliberately and early: dispersal and hardening blunt the bomber war's production effects, at a steep tax in efficiency and transport strain. Industry survives to be strangled by the blockade instead: the imports the factories need still arrive by Soviet rail or not at all, and no tunnel protects a trade agreement.",
            },
          ],
        };
        },
        get uranverein43() {
          return {
          date: "LATE 1943",
          title: "The Uranium Club",
          historicalRecord: false,
          situation:
            "A funding submission reaches the desk from the Reich Research Council, and the projection is obliged to be precise about what it is describing.\n\nThe Uranverein is real, and by this date it is also, in the historical record, effectively finished as a weapons program. It was reviewed in June 1942, judged incapable of producing anything war-decisive inside the war's likely span, and quietly redirected toward reactor research at a scale measured in a few million Reichsmarks. There are structural reasons behind that verdict and none of them are money: Bothe's 1941 graphite measurement was contaminated and wrongly ruled out the moderator the Americans went on to use, committing German work to heavy water and therefore to Vemork, which the Allies have been methodically destroying. No German reactor has gone critical. There is no isotope-separation plant, and there is no design for one at industrial scale.\n\nWhat the submission asks for is the chance to change that with resources this command, uniquely on this path, still has." +
            (flags.bomber43 === "fighters"
              ? " The same reserves that could fund it are the ones currently keeping Galland's fighter arm at strength."
              : ""),
          choices: [
            {
              label: "Fund it at scale: a German Manhattan, whatever it costs the rest of the budget",
              advisor: { name: "Heisenberg", position: "The physics permits a reactor, but the calendar does not permit a weapon. Whoever wants a reactor can have one, and whoever wants a weapon should ask someone willing to promise a year that cannot be delivered." },
              setFlags: { uranverein43: "committed" },
              favor: -1,
              impact: { manpower: -2, fuel: -2, initiative: 1 },
              next: "invasionQuestion44",
              outcome:
                "There is no reward here, and the history does not support inventing one. Money was never the binding constraint on the German program and pouring it in from late 1943 does not buy back the two years already lost: the separation plants do not exist, the plant to build the plants does not exist, and the moderator error has already routed years of work through a heavy-water supply the Allies are systematically dismantling. What the commitment does buy is real and entirely negative: skilled labour, precision engineering capacity and transport allocation pulled out of the armaments economy at the exact moment the bombing campaign is testing it hardest. The war gets measurably harder to fight, in exchange for a program that will still be years from a device when the war ends, by whatever means it ends.",
            },
            {
              label: "Fund the reactor work only: keep the physics alive, spend nothing on a weapon that isn't coming",
              advisor: { name: "Speer", position: "Heisenberg was asked in June what he needed and how long, and the care of his answer on deadlines said everything, because a man who wants a weapons program does not answer that carefully. Fund the science and arm with what exists." },
              historical: true,
              setFlags: { uranverein43: "reactorOnly" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "invasionQuestion44",
              outcome:
                "What in fact happened, and by any measure the correct call on the information available: the program continued at modest scale as reactor research under Army and then Reich Research Council auspices, and never came close to a weapon. Speer's own account has him concluding from the physicists' evasiveness about timelines that there was nothing here to win the war with. The armaments economy keeps the engineers and the machine tools it would otherwise have surrendered, and the Reich's actual defense is built out of things that can be built.",
            },
            {
              label: "Shut it down entirely: release every physicist and every gram of heavy water to conventional work",
              advisor: { name: "Speer", position: "Half a program pays twice for a thing. Either it wins the war or it is a laboratory, and a laboratory can wait for peace." },
              setFlags: { uranverein43: "shutDown" },
              impact: { manpower: 1, fuel: 1, initiative: 0 },
              next: "invasionQuestion44",
              outcome:
                "Beyond the historical record in decisiveness rather than direction: the real program was starved, not cancelled, and its survival cost the war effort very little precisely because it was so small. Closing it outright recovers a marginal amount of skilled capacity and closes off a line of research that a postwar Germany would have wanted, on a path where there may not be a postwar Germany that gets to want things. The immediate military effect is slight and positive. The historical irony is not available to anyone in the room: the program being shut down was never a threat to anyone, and the fear of it was, at that moment, the single largest accelerant on the American one.",
            },
          ],
        };
        },
        get invasionQuestion44() {
          return {
          date: "1944",
          title: "The Fortress Tested",
          historicalRecord: false,
          situation:
            "This is the deepest military question this entire speculative path exists to ask, and this campaign states the honest analysis before the choices rather than after: roughly four out of five German soldiers killed in the historical war died on the eastern front, which also absorbed the large majority of the Wehrmacht's combat divisions for four straight years. None of that happened here. The army defending France on this path isn't the historical Westheer: worn thin, its best formations bled white in Russia, replacements arriving as boys and convalescents. It's close to the full Wehrmacht, rested, at something near peak strength, with every mobile reserve the East would have consumed still sitting in France, Belgium, and the Reich itself.\n\nSHAEF's planners, on the other side of this same fact, are not blind to it: Allied intelligence tracks German order-of-battle as carefully as FHO tracks theirs, and what it shows is a defender roughly two to three times the historical density, with reserves the historical Normandy campaign never had to survive making contact with. Aerial reconnaissance over Britain in the spring of 1944 shows the buildup happening anyway: an invasion fleet is assembling. Whether it is a genuine attempt or an enormous piece of theater aimed at pinning German divisions in the West while the real war stays a bombing campaign is the question this command has to answer before the fleet sails, not after.",
          choices: [
            {
              label: "Meet it at the water: full Atlantic Wall doctrine, the intact army forward on every likely beach",
              advisor: { name: "Rommel", position: "For once the request is not to gamble everything on the first day, but to use an army large enough that the first day was never going to be the only one that mattered." },
              setFlags: { invasionQuestion44: "waterline" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "easternQuestion44",
              uncertain: [
                {
                  weight: modWeight(6, meters.manpower),
                  title: "The narrowest possible case: a real lodgment, briefly",
                  next: "lodgmentReduction44",
                  impact: { manpower: -2, fuel: -1, initiative: -1 },
                  outcome:
                    "The single least likely outcome this campaign's entire speculative arm reaches, stated as narrowly as the honest odds demand: naval gunfire and total air supremacy still favor any landing attempt enough that a lodgment is actually established on this path, briefly, at one sector. It does not survive contact with what waits behind it, but what 'does not survive' actually looks like, on the ground, over the days that follow, is the next real question this campaign asks.",
                },
                {
                  weight: 100 - modWeight(6, meters.manpower),
                  title: "The overwhelming case: the water line holds",
                  impact: { manpower: 1, fuel: 0, initiative: 1 },
                  outcome:
                    "What the actual force ratio was always going to produce: a defense in the density the historical Atlantic Wall never approached meets a landing force built to overcome the historical density, not this one. The honest military conclusion, stated plainly: this was very likely never a viable operation on this timeline, and the fleet's losses confirm it before evening. Continental Europe remains what it was before the attempt: a fortress no cross-Channel invasion could responsibly try again against an undistracted Wehrmacht.",
                },
              ],
            },
            {
              label: "Hold the intact army as a mobile reserve: let any lodgment happen, then destroy it inland",
              advisor: { name: "Guderian", position: "Let them spend their navy putting men on a beach that was never going to be held at the waterline anyway. It is better to destroy an army than a landing craft." },
              setFlags: { invasionQuestion44: "reserve" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "easternQuestion44",
              outcome:
                "The doctrine an intact army can actually afford, which the historical Westheer never could: accept the landing, let it consolidate briefly, then commit reserves in force the moment the beachhead's own logistics become the target instead of its perimeter. Whether the Allies test this fortress at all is now the more interesting question than whether the test succeeds, and reconnaissance over Britain in the following weeks suggests SHAEF's planners reached the same conclusion this command did, on their side of the same order-of-battle math. The invasion fleet stands down, uncommitted. Continental Europe remains a fortress no cross-Channel invasion has been able to responsibly attempt against an undistracted Wehrmacht.",
            },
          ],
        };
        },
        get lodgmentReduction44() {
          return {
          date: "1944: 72 HOURS LATER",
          title: "What Reduction Actually Looks Like",
          historicalRecord: false,
          situation:
            "The lodgment is not going anywhere, and neither is it staying. Reserves the historical Normandy campaign never had to survive making contact with have arrived in force sufficient to end this: the only question left is how, and it is a question with real people still standing inside the answer. Several thousand Allied troops hold a shrinking perimeter with naval gunfire support that can slow the reduction but cannot reverse it. This campaign has written the 'Dunkirk mirror' once already, on a different beach, in a different year. It is worth remembering, rather than pretending this decision has no precedent.",
          choices: [
            {
              label: "Press the reduction to unconditional surrender: no evacuation permitted",
              advisor: { name: "the OKW staff", position: "A negotiated withdrawal becomes the story Britain tells about this attempt, and an unconditional end becomes the story Germany tells." },
              setFlags: { lodgmentReduction44: "total" },
              favor: -1,
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "easternQuestion44",
              outcome:
                "The harder, more complete answer: the perimeter is compressed without a negotiated pause, and the lodgment ends in mass surrender rather than a naval evacuation under truce. It is the more thorough demonstration to any future planner in London that this fortress cannot be tested again, and it is also, without much ambiguity, the choice that costs more lives to prove the same point the water line's own arithmetic already proved.",
            },
            {
              label: "Allow a negotiated evacuation: let the Royal Navy pull what's left off the beach",
              advisor: { name: "Rommel", position: "They will remember that the landing force was let leave. It is doubtful that this costs anything the historical record had not already decided, and it certainly costs fewer German men to find out." },
              setFlags: { lodgmentReduction44: "evacuation" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "easternQuestion44",
              outcome:
                "The mirror of the mirror this campaign has already written once: a negotiated pause, a naval evacuation under truce, and a demonstration that ends in a lesson delivered rather than a massacre completed. The strategic fact doesn't change (the fortress held, the attempt failed, the second front in the west is finished for this war) but how the last chapter of that specific failure gets told, on both sides of the Channel, is not a small thing this campaign chooses to treat as a footnote.",
            },
          ],
        };
        },
        get easternQuestion44() {
          return {
          date: "1944",
          title: "The Question in the East",
          historicalRecord: false,
          situation:
            "Three years of armed truce, and FHO's annual assessment of the Red Army has become the most alarming document your staff produces: undisrupted by any war, Soviet industry has fielded a force larger and better-equipped than the one Barbarossa was designed to destroy, and it keeps growing. The deliveries continue; so do the price increases, each one a quiet reminder of who needs whom.\n\nAn honest note on what history says here: the overwhelming weight of scholarship holds that Stalin sought no war with Germany in this period: the buildup is what victorious deterrence looks like from the other side of the wire. A minority tradition argues opportunism was only waiting for weakness. This campaign treats the minority case as what it is: possible, unlikely, and unknowable from your side of the border. That uncertainty is now the central fact of German strategy.",
          choices: [
            {
              label: "Strike first: launch the eastern war now, before the imbalance grows worse",
              advisor: { name: "Jodl", position: "The assessments worsened with every year of waiting, and no version of 1946 in the folder is better than 1944. That is the entire argument." },
              setFlags: { eastern44: "preempt" },
              impact: { manpower: -3, fuel: -2, initiative: 1 },
              next: "atomicReckoning45",
              outcome:
                "The assessment is grim, and generous at that: attacking the fully-built, fully-deployed Red Army of 1944 (with no purge chaos, no forward-deployed vulnerability, and a materiel superiority the 1941 files never imagined) produces the eastern war at its maximum possible disadvantage. The front that forms is closer to Warsaw than Smolensk within the year. The one strategic problem this solves is the uncertainty: you now know exactly what the Red Army was for.",
            },
            {
              label: "Fortify and deter: build the eastern wall and hold the truce at gunpoint",
              advisor: { name: "Heinrici", position: "What Stalin intends cannot be known, but his general staff's estimate of the cost can be made so large that intentions stop mattering." },
              setFlags: { eastern44: "deter" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "atomicReckoning45",
              // Hidden-information choice: the situation text says outright that whether Stalin
              // actually intends war is "unknowable from your side of the border" — concealRoll
              // keeps that unknowability real for the player too, revealing the true odds only on
              // the OutcomeScreen after the choice resolves.
              concealRoll: true,
              uncertain: [
                {
                  weight: modWeight(80, meters.manpower),
                  title: "The truce holds",
                  impact: { manpower: 1, fuel: 0, initiative: 1 },
                  outcome:
                    "Deterrence holds, and for the reason it usually does, it works because it was never truly being tested, Stalin's buildup insures against you, not toward you, and a hardened border with nothing behind it worth attacking stays quiet. The eastern question subsides into cold, armed permanence, and Germany's full attention returns to the war it actually has: the bombers, the blockade, and the year 1945.",
                },
                {
                  weight: 100 - modWeight(80, meters.manpower),
                  title: "The border catches fire",
                  impact: { manpower: -1, fuel: 0, initiative: 0 },
                  outcome:
                    "The minority case, rolled: friction along a two-thousand-kilometer armed border (a shot-down reconnaissance flight, a contested rail dispute, a local commander's initiative) escalates into open border war neither capital planned this year. It is contained, at cost, along the fortified line built for exactly this; but the truce is dead as a system, the deliveries stop, and the blockade your economists warned about in 1941 is now total.",
                },
              ],
            },
            {
              label: "Pay the price: deepen the economic settlement and buy the truce outright",
              advisor: { name: "Ribbentrop", position: "Moscow sells the means to survive and Berlin sells Moscow time, an ugly arrangement between honest enemies and the most stable kind." },
              setFlags: { eastern44: "appease" },
              favor: 2,
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: "atomicReckoning45",
              outcome:
                "Projection of dependency embraced: expanded concessions (technology transfer, sphere adjustments in the Balkans, terms of trade Moscow writes) keep the deliveries flowing and the border quiet. The fuel arrives; so does the truth underneath it, now impossible to unsee: the Reich's war economy is a hostage negotiating its own ransom annually, and the creditor's army grows either way.",
            },
          ],
        };
        },
        get atomicReckoning45() {
          return {
          date: "1945",
          title: "The Reckoning",
          historicalRecord: false,
          situation:
            "The deep projection arrives at the fact that was always waiting at its end. The Manhattan Project ran on its own clock, driven from the beginning by fear of a German bomb, and on this path, with no eastern front bleeding the Reich toward collapse, there is no Allied army in Germany to make the question moot. " +
            (flags.invasionQuestion44 === "waterline"
              ? "Continental Europe is a fortress that has already been tested once, at real cost to the force that tried it, and found to hold against an undistracted Wehrmacht; the war since has gone back to what it was before the attempt: bombers, blockade, and stalemate."
              : "Continental Europe is a fortress no cross-Channel invasion has been able to responsibly attempt against an undistracted Wehrmacht; the war is bombers, blockade, and stalemate.") +
            (flags.bomber43 === "fighters" && (meters.fuel || 0) >= 1
              ? "\n\nOne column of the ledger reads differently on this path. A weapon of this kind is delivered by a single aircraft flying very high, alone, a long way, and the historical delivery problem was solved against a Japan whose fighter defense had effectively ceased to exist by August 1945. The Reich's has not. Galland's arm is intact, jet-equipped at altitude, and sitting under the approach to every target worth using it on."
              : "") +
            "\n\nIn July, in the New Mexico desert, the stalemate ends as a concept. Intelligence fragments (a silence around certain physicists, a signature in Allied signals your cryptographers cannot parse) suggest something has changed in Washington's tone. The ultimatum, when it comes, will demand what Casablanca always demanded: unconditional surrender. The only question this campaign has left to ask is what Germany does in the shadow it cannot yet see.",
          choices: [
            {
              label: "Seek terms now: end the war before the new weapon speaks",
              advisor: { name: "Speer", position: "Every report on the German atomic program has been read, which is how the fear of the enemy's came. A war that cannot be won at any speed should end at the fastest one." },
              setFlags: { atomic45: "terms" },
              favor: 2,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "END",
              outcome:
                "The least catastrophic ending available, and it is still surrender: the Casablanca policy admits no negotiated peace, and 'terms' means unconditional capitulation with the fortress intact: occupation, dismantlement, the end of the regime, arrived at without the fire. Historians of the real war would note the bitter symmetry: this path preserved more German lives and cities than any other in this campaign, by ending in the same place with less ruin on the way.",
            },
            {
              label: "Fight on: the fortress has withstood everything else",
              advisor: { name: "Keitel", position: "The fortress holds. Whatever new bomb they have built, cities have burned before and the Reich stands, and Germany does not surrender to a rumor." },
              setFlags: { atomic45: "fightOn" },
              impact: { manpower: -2, fuel: 0, initiative: -1 },
              next: "END",
              outcome:
                "The weapon's actual history runs on to its grimmest extension: the bomb was conceived for Germany, and a Germany still fighting past the summer of 1945 meets it: one city, then the wait, then another, on the same terrible cadence the real August 1945 demonstrated, until capitulation. The fortress strategy's final ledger is written in the only currency it had left to spend, and it is not concrete.",
            },
            {
              label: "Race for parity: everything into the German atomic program, and hold out for a balance of terror",
              advisor: { name: "Heisenberg", position: "Years are being asked for and months offered. The funding will be taken, but not responsibility for the calendar." },
              setFlags: { atomic45: "race" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "END",
              outcome:
                "The physics and the record agree, and neither is kind: the historical German program was years behind by 1942 (starved, fragmented, and pointed partly down a dead end) and no 1945 crash effort closes a gap measured in reactor-years and isotope-separation plants that do not exist. The race buys nothing but delay under the bombs, conventional and then otherwise, until the same capitulation arrives with a scientific footnote attached: the balance of terror was never available to the side that started looking last.",
            },
          ].concat([
              {
                label: "Contest the delivery: everything the fighter arm has, held at altitude, for the single aircraft nobody can afford to let through",
                disabledReason: flags.bomber43 === "fighters" && (meters.fuel || 0) >= 2 ? undefined : "Requires a reserved fighter arm and Matériel +2: jets held at altitude need fuel nobody else is getting",
                advisor: { name: "Galland", position: "Two years of being told the jets were bombers have given way to a request that they intercept, at forty thousand feet, one aircraft that cannot be identified in advance, on a day that will not be announced. It is the only mission of the war worth attempting, and one that cannot be planned for." },
                setFlags: { atomic45: "contestDelivery" },
                impact: { manpower: -1, fuel: -3, initiative: -2 },
                next: "END",
                // Hidden-information choice: Galland's own quote says it plainly — "one aeroplane
                // we cannot identify in advance, on a day we will not be told about." concealRoll
                // withholds the odds until the post-hoc reveal on the OutcomeScreen.
                concealRoll: true,
                uncertain: [
                  {
                    weight: modWeight(35, meters.fuel),
                    title: "The window closes",
                    setFlags: { deliveryDelayed45: true },
                    impact: { manpower: -1, fuel: -3, initiative: 3 },
                    outcome:
                      "CONTESTED: the branch where the projection stops being able to tell you what would have happened, because the people planning it disagreed at the time. Delivering this weapon means one unescorted aircraft at extreme altitude over defended airspace, on a mission with no possibility of a second attempt that week. Against Japan in August 1945 that was close to unopposed. Against a jet-equipped fighter arm held specifically for it, American planners treated the loss of the aircraft, and of the device aboard it, as a real risk rather than a remote one. On this roll the mission is postponed rather than flown: weather, escort arithmetic, and an unwillingness to gamble a weapon there are almost none of. The war does not end in August. It runs on into a season nobody in Washington or Berlin had a plan for, and the Reich buys months it did nothing to deserve and cannot productively use.",
                  },
                  {
                    weight: 100 - modWeight(35, meters.fuel),
                    title: "It gets through",
                    impact: { manpower: -3, fuel: -1, initiative: 0 },
                    outcome:
                      "The likelier reading, and the one most assessments would back: an interception problem is not solved by having good interceptors, it is solved by knowing when and where. The mission is flown on a day of the attacker's choosing, at an altitude and on a track the defense cannot pre-position against, and the fighter arm held back for this single purpose spends the war's last months on the ground waiting for a warning that arrives with the flash. What follows is what followed in the real August 1945, on the same cadence, and the fuel spent holding a reserve for one interception is fuel the fortress had for nothing else.",
                  },
                ],
              },
            ]).concat([
              {
                label: "Disperse everything: evacuate the cities, bury the industry, make the fortress too diffuse for any single weapon to be decisive",
                disabledReason: (meters.manpower || 0) >= 5 && (meters.fuel || 0) >= 3 ? undefined : "Requires Manpower +5, Matériel +3: moving a country needs a country still able to move",
                advisor: { name: "Speer", position: "Aircraft production was moved underground while it was being bombed daily, and the rest can be moved too. What is offered is not a way to win or a way to survive but a way for this to take longer, paid for by people nobody will consult." },
                setFlags: { atomic45: "disperse", dispersedReich45: true },
                favor: 2,
                impact: { manpower: -2, fuel: -3, initiative: -3 },
                next: "END",
                outcome:
                  "The one answer to the weapon that the physics does not immediately refute, and it is not a good one. Dispersal was real German policy under Speer from 1943 onward and it demonstrably did what it attempted: armaments output rose under the heaviest bombing of the war. Extended to an entire society by a Reich that, uniquely on this path, still has the reserves to attempt it, it produces a state with no centre left worth destroying with one bomb, and therefore no single moment at which the war visibly ends. What follows is not victory and no serious projection makes it one. It is a longer war fought in a country deliberately taken apart, ending in the same capitulation later, with the difference paid for by a civilian population dispersed into the countryside ahead of a winter nobody planned rations for. Nobody involved would call it an achievement. It is simply what four years of husbanded surplus turns out to be convertible into.",
              },
            ]),
        };
        },
        get moscowKiev() {
          return {
          date: "AUGUST 1941",
          title: "Moscow or Kiev",
          historicalRecord: true,
          situation:
            {
              full: "Barbarossa launched five weeks late, on June 22, after the southern flank was secured. Army Group Center still built real momentum despite the delay. ",
              skip: "Barbarossa launched on the original May timetable, unencumbered by a Balkans campaign, but the British-backed force in Greece was never dealt with, and Ploiești has already taken a probing raid. ",
              minimal: "A limited Balkans effort secured neither objective cleanly: Barbarossa launched in early June, still weeks late, with the southern flank only partly resolved. ",
            }[flags.balkans] +
            "Army Group Center sits roughly two hundred miles from Moscow with real momentum. To the south, Fremde Heere Ost estimates the exposed Soviet force around Kiev at somewhere between 500,000 and 700,000 men across four to six armies: air reconnaissance supports the higher figure, but FHO has been wrong about Soviet strength in both directions all summer, and badly.\n\nYour logisticians add their own uncertainty: rail-gauge conversion is running behind every projection, truck attrition is worse than planned, and nobody can promise the supply system supports a Moscow drive AND flank security at once.",
          choices: (() => {
            const base = [
              {
                label: "Press directly for Moscow: exploit the momentum now",
                advisor: { name: "Guderian", position: "Moscow is the head, the heart and the railway junction of everything, and Kiev is a detour dressed as a victory." },
                setFlags: { eastFront: "moscow" },
              favor: 1,
                impact: { manpower: -3, fuel: -1, initiative: -1 },
                next: "exposedFlank",
                outcome:
                  "Guderian argued for exactly this in real time. But it leaves an enemy force of at least half a million men, possibly far more, intact beside your main axis of advance, and the logisticians' warnings were the accurate part of the intelligence picture: German supply was already past what rail-gauge conversion could sustain. There is no documented serious model where this ends well with that flank still live.",
              },
              {
                label: "Divert south: encircle and destroy the Kiev pocket first",
                advisor: { name: "Hitler", position: "The generals understand nothing of the economics of war. The grain of Ukraine and the industry of the Donets are what the war is for." },
                historical: true,
                setFlags: { eastFront: "kiev" },
                impact: { manpower: 3, fuel: 0, initiative: -1 },
                next: "rostov41",
                // Round 26 (item 1). The Kiev encirclement, 23 August to 26 September 1941. Facts checked 2026-10-08
                // (Wikipedia, Battle of Kiev (1941)): Hitler's directive of 21 August sent the 2nd Army and Panzer Group 2
                // south; Guderian crossed the Desna on 26 August at Novgorod-Seversky and had protested at being denied the
                // XLVI Motorized Corps; Kleist's Panzer Group 1 of Army Group South broke out of its bridgehead on the
                // Dnieper in September; the two met south of Lokhvitsa on 16 September, which the older comment on this
                // choice also records; Stalin had refused Zhukov's advice to leave Kiev and withdraw behind the Dnieper, and
                // had dismissed him from the General Staff; Kirponos, who commanded the Southwestern Front, was killed
                // trying to break out; 452,700 Soviet soldiers were trapped at first and only about 15,000 got out by
                // 2 October; the Soviet total was 616,304 killed, missing or captured; Soviet aircraft flew more than
                // 4,000 sorties against Panzer Group 2 between 29 August and 4 September; German supply columns averaged
                // 12 kilometres an hour and fuel was short; heavy rain turned the roads to mud.
                keyBattleSubgame: {
                  id: "kievPocket41",
                  title: "Order of Battle: The Kiev Pocket",
                  flavor:
                    "Hitler's directive of August 21 sends the panzer groups south, away from Moscow, to close a ring behind the Soviet armies at Kiev. Guderian has protested and obeyed. His Panzer Group 2 is coming down from the Desna, and Kleist's Panzer Group 1 is to come up from the Dnieper to meet it, with the infantry armies pressing the Soviet front from the west and the Luftwaffe over all of it. Stalin has refused to let the Southwestern Front withdraw, so the armies are still where they were put. The fuel is short, the rain has turned the roads to mud, and the two spearheads are a long way apart. What's decided here is how the weight is spread between the two pincers, the infantry that has to hold the ring once it is closed, and the aircraft that cover the gap.",
                  categories: [
                    { id: "northPincer", name: "Guderian's Panzer Group 2", meter: "fuel", strand: "steel" },
                    { id: "southPincer", name: "Kleist's Panzer Group 1", meter: "fuel", strand: "oil" },
                    { id: "infantry", name: "Infantry Armies", meter: "manpower" },
                    { id: "air", name: "Luftwaffe Support", meter: "initiative" },
                  ],
                  // The two pincers decide the battle and are equal; the infantry hold what they close; the aircraft least.
                  effectiveness: { northPincer: 2.4, southPincer: 2.4, infantry: 2.0, air: 1.6 },
                  orderOfBattle: {
                    northPincer: {
                      units: [
                        "Panzer Group 2 under Guderian, ordered south from the Desna by Hitler's directive of 21 August",
                        "The 2nd Army (Weichs) on its flank, coming south with it",
                      ],
                      real: "Guderian crossed the Desna on 26 August at Novgorod-Seversky, having argued against the order. His headquarters at Romny was nearly overrun by a Soviet breakout attempt in the middle of September.",
                    },
                    southPincer: {
                      units: [
                        "Panzer Group 1 under Kleist, in its bridgehead on the Dnieper at Kremenchug",
                        "The 17th Army (Stülpnagel) pressing along the river behind it",
                      ],
                      real: "Kleist broke out of the bridgehead and drove north, and his tanks met Guderian's south of Lokhvitsa on 16 September.",
                    },
                    infantry: {
                      units: [
                        "The 6th Army (Reichenau) in front of Kiev",
                        "The infantry corps that were to hold the ring when the panzers had closed it",
                      ],
                      real: "Some 452,700 Soviet soldiers were trapped at first, and only about 15,000 of them got out by 2 October.",
                    },
                    air: {
                      units: [
                        "Luftflotte 4 over the southern front",
                        "The aircraft of Army Group Centre's Luftflotte 2 that supported Panzer Group 2",
                      ],
                      real: "Soviet aircraft flew more than 4,000 sorties against Panzer Group 2 between 29 August and 4 September, and the Luftwaffe was not able to stop them.",
                    },
                  },
                  hardRule: { text: "The directive of 21 August stands as written: no part of the panzer groups is to be held back on the Moscow road, and the ring is to be closed by both of them.", lockApproach: "closeTheRing" },
                  conditions: "The end of a wet summer on the black-earth plain, with roads that turn to mud under the supply columns, which are moving at about twelve kilometres an hour.",
                  terrainModifiers: { northPincer: 0.9, southPincer: 0.9 },
                  terrainNotes: { northPincer: "wheels and tracks in the mud", southPincer: "wheels and tracks in the mud" },
                  attrition: [
                    { category: "northPincer", atLeast: 3, meter: "fuel", delta: -1, reason: "A panzer group at the end of its fuel" },
                    { category: "southPincer", atLeast: 3, meter: "fuel", delta: -1, reason: "A panzer group at the end of its fuel" },
                  ],
                  // Field decision: the days before the two groups met. Facts: the groups met on 16 September; the Soviet
                  // armies then tried to break out through the ring, and Romny was nearly overrun on the 18th and 19th.
                  // The three answers are the real options for the panzer commanders at that point; the payoff against
                  // each Soviet setup is modeled.
                  decisions: [
                    {
                      id: "theLastGap",
                      time: "1430",
                      title: "The last gap",
                      prompt: "The two groups are a day's drive apart, with Soviet armies between them that have been told not to move. Guderian's flank is open to anything that breaks out, and Kleist's tanks are running low on fuel.",
                      options: [
                        {
                          id: "closeAtOnce",
                          name: "Drive both groups together at once",
                          note: "The fastest way to close the ring, and it leaves the flanks open.",
                          bonus: 0,
                          bonusByPosture: { orderToHold: 4, riverLine: -2, reserveOnPsel: 0 },
                          reportLine: "Both panzer groups are ordered to drive straight at each other, and the flanks are left to the infantry.",
                        },
                        {
                          id: "guardTheFlank",
                          name: "Halt the northern group to guard its flank first",
                          note: "Saves the headquarters, and costs a day.",
                          bonus: 0,
                          bonusByPosture: { orderToHold: -2, riverLine: 2, reserveOnPsel: 3 },
                          meters: { initiative: -1 },
                          costReason: "A day lost on the road",
                          reportLine: "The northern group turns to face its flank, and the ring waits a day.",
                        },
                        {
                          id: "infantryInFirst",
                          name: "Send the infantry in to close the gap",
                          note: "The foot divisions are slow, and they spare the tanks' fuel.",
                          bonus: 0,
                          bonusByPosture: { orderToHold: -3, riverLine: 4, reserveOnPsel: -1 },
                          reportLine: "The infantry divisions are ordered forward to take over the gap, and the tanks are held for the last drive.",
                        },
                      ],
                    },
                  ],
                  categoryContext: {
                    northPincer:
                      "Guderian's group is the northern jaw, coming south from the Desna with its flank open and its fuel short. Each commitment here puts more of its tanks and trucks into the drive, and fewer into guarding what it leaves behind.",
                    southPincer:
                      "Kleist's group is the southern jaw, with the Dnieper at its back and a long drive north. Each commitment here puts more of its tanks into getting out of the bridgehead fast and meeting the northern group on time.",
                    infantry:
                      "The infantry armies hold the western face of the pocket and have to hold the ring once it is closed. Each commitment here puts more divisions into the line and onto the roads behind the panzers.",
                    air:
                      "The Luftwaffe covers the gap between the two groups and attacks the columns that try to move. Each commitment here puts more aircraft over the pocket and the roads to it.",
                  },
                  flashups: {
                    northPincer: [
                      "A column of Panzer IIIs crosses the Desna on a bridge the engineers finished an hour before.",
                      "A panzer company halts in a village because its fuel truck is stuck in the mud five miles back.",
                      "The leading tanks of the group go through a Soviet rear area and do not stop.",
                      "A staff officer in a command car looks for the road to Romny.",
                      "A battalion of tanks turns off the road to deal with a Soviet column that has appeared on its flank.",
                    ],
                    southPincer: [
                      "Pioneers finish a pontoon bridge on the Dnieper and the first tanks go over it.",
                      "A panzer division drives north across open wheat fields at its best speed.",
                      "A tank company halts to refuel from cans carried on the back of the tanks.",
                      "The leading tanks come on a Soviet artillery regiment limbered up on the road.",
                      "A panzer regiment reports that the ground ahead is dry, and it is the only report of the day that says so.",
                    ],
                    infantry: [
                      "A division of foot infantry marches east along a road churned up by the tanks that went before.",
                      "Infantry dig in along the line of a stream to face a Soviet attack from inside the pocket.",
                      "A battalion takes the first houses of a village the panzers had bypassed.",
                      "Horse-drawn guns are pulled out of a ditch by their crews.",
                      "A regiment takes over a stretch of the ring from a panzer unit that has been ordered on.",
                    ],
                    air: [
                      "Stukas dive on a Soviet column at a river crossing, and the bridge goes down with it.",
                      "German fighters sweep the road and find Soviet bombers going home.",
                      "A reconnaissance aircraft reports the whole of the Soviet front moving east.",
                      "Bombers attack the railway junctions behind the pocket.",
                      "An airfield is bombed and strafed, and the Luftwaffe loses aircraft on the ground.",
                    ],
                  },
                  reportTimes: { open: "0500", contact: "0700", cats: ["0900", "1130", "1330", "1530"], reserve: "1730", counter: "1930" },
                  idleLines: {
                    northPincer: [
                      "Panzer Group 2 is not pushed. It moves south at the pace its fuel allows.",
                      "No more tanks go into the drive from the north, and the jaw closes slowly.",
                    ],
                    southPincer: [
                      "Panzer Group 1 stays in its bridgehead and the gap stays wide.",
                      "The southern jaw does not close, and the northern group is alone in the field.",
                    ],
                    infantry: [
                      "The infantry are left to follow at their own pace, and the panzers go on without them.",
                      "No more divisions are put into the ring, and it is held by whatever is already in it.",
                    ],
                    air: [
                      "No more aircraft go over the gap, and the roads are open to anyone who can reach them.",
                      "The Luftwaffe flies the missions it already had, and nothing more.",
                    ],
                  },
                  verdicts: ["The Ring Closes at Lokhvitsa", "The Pocket Leaks"],
                  verdictGrades: {
                    clean: "The two groups met on time, the infantry held the ring behind them, and the whole of the Southwestern Front was trapped.",
                    costly: "The ring closes and the pocket is taken, but the panzer groups have burned their fuel and their tanks to do it.",
                    marginal: "The ring is closed late and thin, and many of the Soviet armies get out through it before it holds.",
                    total: "The two groups do not meet in time, and the Soviet armies break out of the gap before it is closed.",
                  },
                  counterattack: {
                    category: "infantry",
                    severity: { orderToHold: 2, riverLine: 0, reserveOnPsel: 1 },
                    warn: {
                      1: "Soviet columns are massing inside the pocket and probing the ring at several points.",
                      2: "The trapped Soviet armies are attacking the ring in mass, and Kirponos's headquarters is among them.",
                    },
                    results: {
                      repulsed: "The breakout is thrown back along the whole of the ring and the pocket stays shut.",
                      heldAtCost: "The ring holds, at a heavy cost in the divisions that hold it.",
                      broke: "The Soviet armies break through the ring at one point, and the road behind the panzers is cut.",
                      gaveGround: "The ring gives way at its thinnest point, and thousands of men go through it.",
                    },
                  },
                },
                // Round 13 (Craig, relaying player feedback): the outcome text described the
                // encirclement as generically "the largest in military history" without naming
                // how it was actually sealed — reading as Army Group Center acting alone, which
                // is only half the pincer. Verified (Wikipedia, Battle of Kiev (1941), 2026-09-24):
                // Kleist's 1st Panzer Group, from Army Group SOUTH, forced a Dnieper crossing near
                // Kremenchuk on 31 August, then drove north; Guderian's 2nd Panzer Group (Army
                // Group Center) pushed south from the Desna the same day, its own headquarters
                // running through Romny by mid-September — nearly overrun by a Soviet breakout
                // attempt on the 18th-19th. The two pincers linked south of Lokhvytsia on 16
                // September, closing the ring. Named here rather than left as the generic
                // "envelopment" the reviewer's feedback flagged.
                outcome:
                  "The historical choice, and the high-end intelligence estimate turned out closer to true: roughly 660,000 Soviet troops were captured or killed: the largest encirclement in military history, and not Army Group Center's doing alone. Guderian's panzers pushed south while Kleist's Panzer Group, forcing its own Dnieper crossing far to the south at Kremenchuk, drove north to meet them; the two pincers closed south of Lokhvytsia on the 16th of September, with Romny, Guderian's own headquarters through the fighting, very nearly overrun by a Soviet breakout attempt two days later. But when Army Group Center resumed toward Moscow in October (Operation Typhoon), it still failed, stopped by mud, then cold, then fresh reserves nobody's intelligence had placed. Kiev didn't cost Moscow: Moscow was likely never taking either way on this timeline.",
                uncertain: [
                    {
                      weight: modWeight(75, meters.fuel),
                      title: "The ring closes at Lokhvitsa",
                      setFlags: { kievResult: "closed" },
                      impact: { manpower: 3, fuel: 0, initiative: -1 },
                      outcome:
                        "The historical result. Guderian's tanks coming south and Kleist's coming north met south of Lokhvitsa on September 16, and the ring held: some 452,700 Soviet soldiers were trapped at first and only about 15,000 of them were out by October 2, with 616,304 killed, missing or captured over the whole battle, and Kirponos among the dead. It was the largest encirclement in the history of war, and not Army Group Centre's doing alone. But when Army Group Centre resumed toward Moscow in October (Operation Typhoon), it still failed, stopped by mud, then cold, then fresh reserves nobody's intelligence had placed.",
                    },
                    {
                      weight: 100 - modWeight(75, meters.fuel),
                      title: "The pocket leaks",
                      setFlags: { kievResult: "leaked" },
                      impact: { manpower: 1, fuel: -1, initiative: -1 },
                      outcome:
                        "Speculative. The two groups meet a few days late, and the ring is thin where the Soviet breakout strikes it: Kirponos's headquarters and a large part of three armies get out through the gap before the infantry can close it. The prisoners are still counted in the hundreds of thousands, but the Southwestern Front is not destroyed, and the divisions that got away are in front of Army Group South again within a month. The panzer groups' fuel and tanks are spent, as they were historically, and Moscow is as far away as it was.",
                    },
                ],
              },
              {
                label: "Split forces: partial support south, partial momentum toward Moscow",
                advisor: { name: "Bock", position: "If both objectives must be had, neither should be starved entirely, though half a spearhead has never been seen to pierce anything." },
                setFlags: { eastFront: "split" },
                impact: { manpower: -2, fuel: 0, initiative: -1 },
                next: "rostov41",
                outcome:
                  "Weakens both outcomes at once. A partial encirclement lets meaningful Soviet forces escape Kiev intact, trimming the historical prisoner haul by perhaps a third, while diverted panzers dilute whatever chance existed of reaching Moscow before autumn. No real-world staff study favored this as anything but the worst of both options.",
              },
            ];
            if (flags.sealion === "east" && flags.balkans === "skip") {
              base.push({
                label: "Attempt both: encircle Kiev while sustaining a real secondary thrust on Moscow",
                advisor: { name: "Halder", position: "For once the calendar owes Germany weeks. The debt should be spent now while it exists, because it will not survive the winter." },
                setFlags: { eastFront: "doubleEnvelopment" },
                impact: { manpower: -1, fuel: -2, initiative: 0 },
                next: "doubleEnvelopment",
                outcome:
                  "Only reachable by banking time twice over: skipping Sea Lion's buildout in 1940 and the Balkans campaign this spring. Even so, this is speculative: Germany never had the logistics slack for a genuine two-objective offensive at this scale, banked time or not. It's the single most resourced position reachable in this campaign, which is exactly why it's worth seeing where it in fact leads rather than assuming it wins the war.",
              });
            }
            return base;
          })(),
        };
        },
        get doubleEnvelopment() {
          return {
          date: "SEPTEMBER 1941",
          title: "The Double Envelopment",
          historicalRecord: false,
          situation:
            "Banked time from two earlier decisions makes a simultaneous push briefly plausible: encircle Kiev's exposed armies while keeping enough armor forward to contest Moscow's approaches before autumn. The intelligence picture cuts both ways: the Soviet officer corps is still visibly recovering from the late-1930s purges, but FHO admits it has no reliable count of what reserves exist east of Moscow, and no confirmation of whether Japan's posture frees Siberian formations for the west. You'd be committing to the largest simultaneous operation of the war on estimates your own intelligence staff won't put confidence intervals on.",
          choices: [
            {
              label: "Commit fully to both objectives at once",
              advisor: { name: "Guderian", position: "The impossible has been handed over together with the fuel to attempt it, and the temptation is not denied." },
              setFlags: { doubleEnvelopment: "committed" },
              impact: { manpower: 1, fuel: 0, initiative: 1 },
              next: "rostov41",
              outcome:
                "The single best-case eastern position reachable in this campaign, but it's speculative fiction built from two stacked efficiencies, not a documented near-miss. Rail-gauge conversion and fuel logistics still cap how far any of this force can actually operate, banked time or not. The bonus here is real but modest, and Moscow still isn't reachable this year by any serious accounting: the reserves FHO couldn't count were real, and they were coming.",
            },
            {
              label: "Hedge: secure Kiev properly, accept a thinner secondary push",
              advisor: { name: "Bock", position: "Prudence is called for, because the advantage will keep." },
              setFlags: { doubleEnvelopment: "hedged" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "rostov41",
              outcome:
                "Playing it safe here just reproduces the historical Kiev-then-Typhoon result almost exactly, banked time or not. The lesson is a real one: two efficiencies stacked earlier only pay off if you're willing to spend them aggressively later: hedging wastes the advantage entirely. The advantage, it turns out, does not keep.",
            },
          ],
        };
        },
        get exposedFlank() {
          return {
          date: "AUGUST – SEPTEMBER 1941",
          title: "The Exposed Flank",
          historicalRecord: false,
          situation:
            "Pressing for Moscow left the Kiev force intact, and it hasn't stayed passive: Soviet armies are counterattacking into Army Group Center's open southern flank and rear-area supply columns, the same columns already strained past their limit. Reports from the flank are fragmentary and contradictory: some sectors report probing attacks, others report multi-division assaults, and your staff can't build a coherent picture of Soviet intent from any of it.\n\nThis is projection, not the historical record, Germany never actually chose this path, but the logistics math underneath it is real.",
          choices: [
            {
              label: "Keep pushing for Moscow regardless: treat the flank as a secondary problem",
              advisor: { name: "Guderian", position: "Flank attacks are the price of every deep advance in history, and Moscow pays for them all." },
              setFlags: { winterCrisis: "pushed" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "moscowRace41",
              outcome:
                "Reasoned projection: whatever divisions you peel off for flank defense aren't advancing on Moscow, so this doesn't preserve momentum: it produces a slower advance and an under-resourced flank at once. Rear-area fuel and ammunition columns become the obvious target for a counterattacking force with nothing else to lose, and German logistics in this campaign had no slack to absorb that on top of existing strain. The race for the capital is on regardless: this campaign's deepest departure from the historical record, next.",
            },
            {
              label: "Halt the Moscow drive to deal with the flank threat now",
              advisor: { name: "Halder", position: "The Kiev battle is being conducted after all, merely later, under fire, and on the enemy's terms." },
              setFlags: { winterCrisis: "divertedLate" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "pearlHarbor",
              outcome:
                "This is effectively the Kiev decision, made late and under fire. Some of the Soviet force is destroyed or scattered, but with less of it trapped than the historical encirclement achieved, since it's had time to disperse and dig in. Moscow's window, already tight, closes further than the five-week Balkans delay alone would have caused.",
            },
            {
              label: "Order a full withdrawal to consolidate a defensible line: abandon the offensive entirely",
              advisor: { name: "Rundstedt", position: "The only sound strategy left this year is the one no one at Rastenburg will say aloud: stop." },
              setFlags: { winterCrisis: "withdrew", pathVariant: "staticEast" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "pearlHarbor",
              outcome:
                "The most cautious option, and one with no real historical analog: Hitler would not have authorized a voluntary withdrawal at this stage. It preserves the army largely intact and avoids the flank disaster. But it also forecloses everything the historical 1942–43 eastern campaign was built around: with no offensive posture, there's no Directive 45, no Case Blue, no Stalingrad. This closes off an entire chapter rather than just changing it.",
            },
          ],
        };
        },
        get moscowRace41() {
          return {
          date: "SEPTEMBER 1941",
          title: "The Race, With the Flank Still Open",
          historicalRecord: false,
          situation:
            "This is the deepest departure from the historical record this campaign reaches on the eastern axis: Germany never actually left the Kiev force intact and pressed Moscow simultaneously, and the logistics warnings from August haven't gone anywhere. But Army Group Center's spearheads are real, forward, and closer to Moscow than they will ever be again before winter closes the question for everyone. Fremde Heere Ost still can't build a coherent picture of Soviet reserves east of the city, which cuts both ways: the ignorance that made this gambit possible is the same ignorance that could end it.\n\nWhat happens next depends on how much you're willing to spend finding out." +
            (flags.forkMoscowHolds
              ? " Fremde Heere Ost's latest, still-unconfirmed read is that the reserves behind the city are thinner than every earlier estimate assumed, if true, the ignorance this gambit depends on may be working in only one direction this time."
              : ""),
          choices: [
            {
              label: "Commit everything forward: armor, fuel, and air support, all of it, now",
              advisor: { name: "Guderian", position: "This is exactly what was asked for throughout the campaign and refused until a better moment. There will be no better moment, so spend it." },
              setFlags: { moscowRace41: "committed" },
              favor: -1,
              impact: { manpower: -2, fuel: -2, initiative: 1 },
              next: "rostov41",
              uncertain: [
                {
                  // Historical Divergence Mode: the forkMoscowHolds fork doesn't force this
                  // outcome, it makes the existing rare path meaningfully more likely — a real
                  // mechanical stake, not just a flavor swap. See positionLabel's dedicated
                  // title, gated on this SAME outcome plus the fork flag together.
                  weight: modWeight(12, meters.fuel) + (flags.forkMoscowHolds ? 20 : 0),
                  title: "The gamble is the rare one that lands",
                  impact: { manpower: -1, fuel: -1, initiative: 1 },
                  next: "moscowFalls41",
                  outcome:
                    "The rare case, and this campaign says so plainly rather than pretending the odds were ever close: committed early and without the historical Kiev delay, spearheads reach Moscow's outskirts before the Siberian divisions FHO never counted can detrain in strength. It is the same destination the Japan-diplomacy path reaches by a completely different, equally improbable road, which is less a coincidence than a fact about how narrow the actual window for this outcome ever was.",
                },
                {
                  weight: 100 - (modWeight(12, meters.fuel) + (flags.forkMoscowHolds ? 20 : 0)),
                  title: "The flank collapses before the center arrives",
                  impact: { manpower: -3, fuel: -1, initiative: -1 },
                  next: "rostov41",
                  outcome:
                    "The likelier case, and the one every serious staff study of this scenario lands on: the exposed flank doesn't hold quietly while the center makes its final push. Counterattacking Soviet forces cut into rear-area supply columns already running on fumes, and the spearheads reaching for Moscow arrive weaker and later than the undivided version of this same gambit needed. Typhoon, when it comes, inherits a worse starting position than the historical version: Kiev's diversion at least secured the flank it spent.",
                },
              ],
            },
            {
              label: "Shore up the flank first, accept the delay: press for Moscow once it's secure",
              advisor: { name: "Halder", position: "An advance that outruns its own security is not an advance but an appointment with the counterattack that has not happened yet." },
              setFlags: { moscowRace41: "secured" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "rostov41",
              outcome:
                "The disciplined version of the same gambit, and an honest accounting of its cost: securing the flank first is the correct military answer to the problem the flank actually poses, and it spends the one resource this entire departure from history depended on: time. Autumn's mud and winter's cold don't wait for a secured flank any more than they waited for the historical Kiev detour. What the delay buys in safety, it spends in the season, which this campaign has punished at every other node that tried to outrun it.",
            },
          ],
        };
        },
        // Round 13 (Craig, relaying a player review's "railroading" complaint): every path
        // through the German 1941 campaign funneled straight from the August Moscow-or-Kiev fork
        // to December's "Typhoon Stalls" — eight separate `next: "typhoon"` sites, all of them
        // silent on Army Group South's own autumn. Verified (Wikipedia, Battle of Rostov (1941),
        // 2026-09-24): Kleist's 1st Panzer Army took Rostov-on-Don on 21 November; Timoshenko's
        // Southern Front hit its exposed flank on the 27th; Rundstedt ordered a withdrawal to the
        // Mius River rather than risk encirclement, Hitler countermanded it, and when Rundstedt
        // executed the withdrawal anyway, Hitler relieved him on 1 December — one of the war's
        // first dismissals over a retreat. His replacement, Reichenau, confirmed the identical
        // order within days, backed by Halder, and Hitler let it stand. Inserted here as a new
        // predecessor to `typhoon` (all eight sites above now point to this instead), so the
        // German campaign gets a real southern-front beat in the same autumn it forces Moscow's.
        get rostov41() {
          return {
          date: "NOVEMBER 1941",
          title: "The Rostov Crisis",
          historicalRecord: true,
          situation:
            "Nine hundred miles south of the argument still playing out in front of Moscow, Army Group South has just had its worst week of the war. Kleist's 1st Panzer Army took Rostov-on-Don on the 21st: the gateway to the Caucasus oil fields, and the largest Soviet city to fall so far. Six days later, Timoshenko's Southern Front hit the spearhead's exposed northern flank with a force Fremde Heere Ost hadn't placed on its board, and the army that took the city is now the one at risk of losing it back the hard way: encircled, not merely pushed out. Kleist is asking permission to fall back to the Mius River, forty miles west, before that stops being a choice available to him." +
            (flags.kievResult === "leaked"
              ? " The Kiev pocket closed late and thin, and the Soviet armies that got out of it are in front of Army Group South again."
              : flags.kievResult === "closed"
              ? " The Kiev pocket closed in the middle of September, and Army Group South has the prisoners to show for it, and has used up the time."
              : "") +
            keyBattleEcho("kievPocket41", flags),
          choices: [
            {
              label: "Authorize the withdrawal: trade Rostov for the army",
              advisor: { name: "Kleist", position: "The city was never the objective that mattered. The army left inside it is." },
              setFlags: { rostov41: "authorized" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "typhoon",
              outcome:
                "Not what happened: Hitler's actual first answer was no. Granting it here, before the argument that historically cost Rundstedt his command even starts, buys the identical retreat four days earlier and without the command crisis attached: 1st Panzer Army disengages in reasonable order, and nobody's career is spent proving what Kleist is already saying for free.",
            },
            {
              label: "Refuse: Rostov holds, no retreat authorized",
              advisor: { name: "Hitler", position: "Ground taken is ground defended, and an army was not sent to the Don to hand the city back on the strength of one bad week." },
              historical: true,
              setFlags: { rostov41: "refused", rundstedtRelieved41: true },
              impact: { manpower: -1, fuel: 0, initiative: -1 },
              next: "typhoon",
              outcome:
                "What actually happened, start to finish: refused here, and Rundstedt orders the withdrawal anyway on his own authority rather than watch the army encircled for a city. Hitler relieves him for it on the 1st of December: one of the war's first command dismissals over a retreat, and far from the last. His replacement, Reichenau, confirms the identical withdrawal order within days, backed by Halder, and Hitler lets it stand. Rostov is lost either way; refusing spent four days, a slice of the spearhead's strength, and Rundstedt's command; it bought nothing the earlier answer didn't already get for free.",
            },
          ],
        };
        },
        get typhoon() {
          return {
          date: "DECEMBER 1941",
          title: "Typhoon Stalls",
          historicalRecord: flags.eastFront === "kiev",
          meanwhile:
            "MEANWHILE: STAVKA: Zhukov has signed the counteroffensive order. The Siberian divisions your intelligence never counted are detraining west of Moscow tonight, in white winter camouflage your army does not own.",
          situation:
            (flags.eastFront === "split"
              ? "The encirclement at Kiev was only partial: a meaningful share of the Soviet force escaped east, so both the prisoner count and the attrition inflicted on Soviet reserves fall well short of the historical battle. "
              : "") +
            "German spearheads reach within twenty miles of Moscow, and then a Soviet winter counteroffensive hits, spearheaded by fresh, winter-equipped divisions your intelligence never placed. FHO's order-of-battle estimates had the Red Army essentially out of strategic reserves; instead, formations redeployed from Siberia are attacking in strength that reads like an entirely new army.\n\nMeanwhile your own troops have no winter equipment, the campaign was planned to be over by now, and temperature reports from forward units are dropping past what weapons, engines, and men were prepared for.",
          choices: [
            {
              label: "Order an all-out final push for Moscow regardless of season",
              advisor: { name: "Bock", position: "The last battalion will decide it, theirs or ours, and the army is too close to stop being told it was close." },
              historical: true,
              setFlags: { winterCrisis: "push41" },
              impact: { manpower: flags.eastFront === "split" ? -1 : 0, fuel: 0, initiative: 0 },
              next: flags.siberianReserves === "diverted" ? "moscowFalls41" : "pearlHarbor",
              outcome:
                flags.siberianReserves === "diverted"
                  ? "The reserves that historically stopped this push were never on the train: Japan's own decision, seven months and a diplomatic gamble ago, is about to be felt in front of Moscow's gates."
                  : "Attempted historically into early December before being forced to stop. Tanks froze, men suffered severe frostbite in numbers that rivaled combat losses, and the December 5th Soviet counteroffensive, built around exactly the reserves FHO said didn't exist, drove Army Group Center back as much as 150 miles in places.",
            },
            {
              label: "Halt and consolidate defensive lines for winter",
              advisor: { name: "Guderian", position: "The tanks are frozen, the men are in summer coats and the enemy has a new army, and permission is requested to fight the war that exists." },
              setFlags: { winterCrisis: "halt41" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "pearlHarbor",
              outcome:
                "Closer to what field commanders like Guderian requested. Hitler's subsequent 'stand fast' no-retreat order, issued after the initial panic, arguably prevented a full rout, though at a brutal cost from inadequate winter gear either way. The deeper lesson lands regardless: the intelligence failure on Soviet reserves was total, and it should color how much you trust the next confident estimate you're handed.",
            },
            {
              label: "Order a full withdrawal to a shorter, defensible line",
              advisor: { name: "Kluge", position: "A winter withdrawal under pressure is how Grand Armies become memoirs. It will be carried out if ordered, and ordering it is advised against." },
              setFlags: { winterCrisis: "retreat41" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "pearlHarbor",
              outcome:
                "Not seriously entertained at this stage: Hitler viewed any retreat as unacceptable, and a large voluntary withdrawal in mid-winter, under pressure, risked the same collapse-in-retreat dynamics that destroyed Napoleon's army in the same country, 129 years earlier. An orderly withdrawal is the hardest maneuver in war precisely when it's most needed.",
            },
          ],
        };
        },
        get pearlHarbor() {
          return {
          date: "DECEMBER 11, 1941",
          title: "The American Question",
          historicalRecord: true,
          situation:
            "Four days ago, Japan struck Pearl Harbor. The Tripartite Pact is defensive: Japan attacked, so no treaty obligation compels Germany to declare war on the United States. But the undeclared naval war in the Atlantic is already real: Roosevelt's navy has been escorting convoys and engaging U-boats for months, and an American destroyer has already been sunk.\n\nYour intelligence on American capacity is honestly split: estimates of how fast US war production could scale range from 'two years to matter in Europe' to figures your economists refuse to write down because they look absurd. (The absurd figures were closer to true.) Nobody is offering an estimate of what happens politically in Washington if you simply... don't declare.",
          choices: [
            {
              label: "Declare war on the United States: unleash the U-boats now",
              advisor: { name: "Ribbentrop", position: "America is already at war with Germany in everything but ink, and a declaration lets Dönitz's boats feast on an unguarded coast." },
              historical: true,
              setFlags: { usWar: "declared" },
              impact: { manpower: 0, fuel: -2, initiative: 2 },
              next: flags.pathVariant === "staticEast" ? "staticEast" : flags.pathVariant === "noBarbarossa" ? "mediterranean41" : flags.barbarossa === "postponed" ? "east42Launch" : "herkules42",
              outcome:
                "What happened, December 11, 1941. The short-term payoff was real: Operation Drumbeat's U-boats found American coastal shipping unescorted, unconvoyed, and silhouetted against lit boardwalks: one of the most one-sided stretches of the entire Atlantic war. The long-term cost was the largest industrial economy on earth formally committed to Germany-first strategy. Historians still debate whether the declaration was Hitler's single most consequential unforced decision: it solved Roosevelt's biggest political problem for him, since American opinion wanted war with Japan, not necessarily Germany.",
            },
            {
              label: "Withhold the declaration: let Washington choose its own war",
              advisor: { name: "Weizsäcker", position: "Why relieve Roosevelt of his hardest argument? Let him spend a year convincing Ohio that Berlin, not Tokyo, bombed Hawaii." },
              setFlags: { usWar: "withheld" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: flags.pathVariant === "staticEast" ? "staticEast" : flags.pathVariant === "noBarbarossa" ? "mediterranean41" : flags.barbarossa === "postponed" ? "east42Launch" : "herkules42",
              outcome:
                "Without the declaration, Roosevelt must spend political capital to bring a Japan-focused public into the European war, and the U-boats stay leashed off the American coast. Call it months of delayed American weight, not years: a real but modest gain, bought by forgoing Drumbeat's easy tonnage.",
            },
            {
              label: "No declaration, but quietly authorize unrestricted U-boat attacks on American shipping anyway",
              advisor: { name: "Dönitz", position: "Give the operational order and spare the diplomacy, because tonnage does not read newspapers." },
              setFlags: { usWar: "defacto" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: flags.pathVariant === "staticEast" ? "staticEast" : flags.pathVariant === "noBarbarossa" ? "mediterranean41" : flags.barbarossa === "postponed" ? "east42Launch" : "herkules42",
              outcome:
                "The worst of both worlds, and it's worth seeing why. Sinking American ships without a declaration hands Roosevelt the exact provocation he needs (a formal US declaration follows within weeks, on Washington's terms and timing) while the interval was too short for Drumbeat-scale results. You've bought the full cost of American entry and almost none of the benefit of striking first.",
            },
          ],
        };
        },
        get staticEast() {
          return {
          date: "1942 – 1943",
          title: "A Static Eastern Front",
          historicalRecord: false,
          situation:
            "Withdrawing to consolidate in late 1941 forecloses the offensive arc that followed historically: no Case Blue, no Stalingrad, no Kursk as it really happened. The eastern front settles into static attrition rather than offense-then-collapse. That preserves the divisions history spent, and lost, chasing Stalingrad and the Caucasus.\n\nBut it also gives the Soviet Union two uncontested years to rebuild for its own major offensives, and your intelligence can only guess at the scale of that rebuilding: FHO's production estimates for Soviet tanks and aircraft keep getting revised upward, and each revision is still too low.",
          choices: [
            {
              label: "Hold the static line: husband all reserves for the coming second front in the west",
              advisor: { name: "Rundstedt", position: "The war will be decided where the Americans land, not where the steppes end, so a west worth defending must be built." },
              setFlags: { preservedReserve: true },
              impact: { manpower: 3, fuel: 2, initiative: 0 },
              next: "atlanticWall43",
              outcome:
                "The strongest preservation path available in this campaign. No eastern offensive means no offensive losses, and two years of undisturbed rebuilding gives the western front, where the war is eventually decided regardless, a materially stronger defending force than history's version had by June 1944. The price is written in the east: when the Soviet offensive finally comes, it comes against a line that never once disrupted its preparation.",
            },
            {
              label: "Use the quiet years to rebuild for a renewed eastern offensive in 1943",
              advisor: { name: "Manstein", position: "A static front is a loan against the future, with the Soviets collecting the interest, and the choice is to strike again or admit that it never will." },
              setFlags: {},
              impact: { manpower: 0, fuel: -1, initiative: -1 },
              next: "blackMay",
              outcome:
                "Rebuilding costs real time and fuel with nothing to show for it yet, but it does put a rebuilt Wehrmacht back on the offensive footing the historical 1943 Kursk debate assumed, just two years later and without the 1942 losses that historically preceded it.",
            },
          ],
        };
        },
        get atlanticWall43() {
          return {
          date: "1943",
          title: "Building the Western Fortress",
          historicalRecord: false,
          situation:
            "A projection continuing from a projection: the husbanded army of the static-east path gives the west something history's Atlantic Wall never had: genuine depth behind the concrete." +
            (flags.sealion === "commit"
              ? " Some of that depth is quite literal: the barge yards and Organisation Todt labor Sea Lion never stopped drawing on through 1940 never really stood down, and a fair amount of that invasion-fleet construction capacity simply converted to bunkers."
              : flags.sealion === "launched"
              ? " None of that depth comes from the failed September crossing: the barges are at the bottom of the Channel, and this fortress is built from scratch, not from salvage."
              : "") +
            "\n\nThe question the historical Rommel and Rundstedt fought over now arrives early and with real resources behind it: where does the strength go? Rommel's doctrine says the invasion must die on the beaches in its first twenty-four hours, before naval gunfire and air supremacy make movement impossible, so push everything forward. Rundstedt's says no wall holds everywhere, so hold a massive central reserve and destroy the landing after it shows its hand. Both doctrines are coherent. Both were historically half-implemented, which served neither.",
          choices: [
            {
              label: "Rommel's way: everything forward, defeat the landing on the sand",
              advisor: { name: "Rommel", position: "The reserves must be committed at the water line from the first hour, because nothing can be moved by day once the Allied air forces are overhead." },
              attested: { by: "Rommel", text: "The first 24 hours of the invasion will be decisive ... for the Allies, as well as Germany, it will be the longest day.", source: "Rommel to Captain Hellmuth Lang, 22 April 1944, as recorded in Cornelius Ryan, The Longest Day (1959)" },
              setFlags: { westDoctrine: "forward" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "vWeaponsProduction44",
              outcome:
                "Reasoned projection of the doctrine Rommel actually preached: forward defense means the landing is contested at its most vulnerable hour, and it also means guessing right about WHERE, because forward-deployed strength can't redeploy under Allied air. Fortitude's deception now matters more than ever: strength massed at the wrong beach is strength lost.",
            },
            {
              label: "Rundstedt's way: a powerful central mobile reserve, destroy the beachhead after it forms",
              advisor: { name: "Rundstedt", position: "Concrete does not counterattack. Let them land, let them show where the war is, and destroy it with everything at once." },
              setFlags: { westDoctrine: "reserve" },
              impact: { manpower: 1, fuel: flags.sealion === "commit" ? 1 : 0, initiative: 0 },
              next: "vWeaponsProduction44",
              outcome:
                "Reasoned projection of the classical answer, and its known flaw, which Rommel kept naming: a central reserve must MOVE to matter, and it must move under an air force that owns every road and bridge in France in daylight. The reserve arrives; the question this doctrine gambles on is how much of it arrives, and how late." +
                (flags.sealion === "commit"
                  ? " What the converted invasion-barge capacity buys here is real, if modest: a reserve that moves on marginally better roads than the historical version had to work with."
                  : ""),
            },
          ],
        };
        },
        get herkules42() {
          return {
          date: "SPRING 1942",
          title: "Malta or Egypt",
          historicalRecord: true,
          situation:
            "The Mediterranean supply war has a fulcrum, and it's a small island. Malta-based British aircraft and submarines are sinking a share of Rommel's supply convoys that varies month to month from tolerable to catastrophic: in the worst months, more than a third of everything shipped goes to the bottom. Operation Herkules, a joint German-Italian airborne and amphibious invasion of Malta, is planned and Kesselring is pushing hard for it.\n\nRommel wants the opposite: Tobruk has fallen, the British are reeling, and he believes Egypt and the Suez Canal are open for the taking if he attacks NOW. The airborne arm hasn't forgotten Crete: the last island assault won, but at casualties Hitler called unacceptable. Estimates of Malta's garrison run from 25,000 to over 30,000, dug into rock." +
            (flags.crete41 === "assault"
              ? " And over every planning session hangs Crete: the airborne arm this assault would lead is the one Mercury spent, rebuilt on paper and unproven since: the Führer's own verdict that the day of the paratrooper is over is the plan's largest single obstacle."
              : flags.crete41 === "pass"
              ? " One asset makes this plan stronger than its historical version: the airborne corps is intact and unbloodied: Crete never happened on this path, and neither did the verdict it produced against airborne operations."
              : "") +
            (meters.manpower <= -3
              ? " One option has quietly left the table before the conference begins: with replacements this thin, the trained airborne and assault-shipping lift Herkules requires no longer exists. The island cannot be assaulted with what remains: the argument is now only about Egypt or a defensive line."
              : ""),
          choices: (() => {
            const assaultPossible = meters.manpower > -3;
            const base = [];
            base.push({
              checkLabel: "Manpower",
              disabledReason: assaultPossible ? undefined : "insufficient manpower for the airborne and assault-shipping lift",
              label: "Launch Herkules: take Malta, secure the convoy routes first",
              advisor: { name: "Kesselring", position: "Every ton Rommel will ever burn crosses a sea that Malta commands, and taking the island turns the desert war into arithmetic that can be won." },
              setFlags: { med42: "malta" },
              favor: 1,
              impact: { manpower: -1, fuel: 1, initiative: 0 },
              next: "heydrichReprisals42",
              uncertain: [
                {
                  weight: modWeight(65, meters.fuel),
                  title: "The island falls hard",
                  impact: { manpower: -1, fuel: 1, initiative: 0 },
                  next: "suezOpening42",
                  outcome:
                    "The contested assault resolves the way most historians judge it would have: Malta falls, at a paratrooper and landing-craft cost that stings but doesn't cripple. The convoy war transforms: supply losses to North Africa drop to tolerable rates for the rest of the theater's life, and the fuel starvation that historically strangled every desert offensive eases substantially. Kesselring's arithmetic was right, and now Rommel has to decide what an actually-supplied desert war looks like.",
                },
                {
                  weight: 100 - modWeight(65, meters.fuel),
                  title: "A second Crete",
                  impact: { manpower: -2, fuel: 1, initiative: 0 },
                  outcome:
                    "The contested assault resolves the ugly way: the garrison estimates were at the high end, the rocky terrain devours the airborne drop, and the island falls only after the kind of casualties that ended Crete's celebration before it began. The strategic prize is still won, the convoys still get their protected route, but the airborne arm is spent as a strategic force for the rest of the war, and the 'victory' is spoken of quietly.",
                },
              ],
            });
            base.push({
              label: "Cancel Herkules: back Rommel's dash for Egypt while the British are broken",
              advisor: { name: "Rommel", position: "The enemy is running. Give the fuel earmarked for this island adventure and the Nile can be reached in four weeks." },
              historical: true,
              setFlags: { med42: "egypt" },
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "heydrichReprisals42",
              outcome:
                "After Tobruk fell in June 1942, Rommel's momentum argument won and Herkules was shelved. The pursuit into Egypt was spectacular for weeks, and then the supply math asserted itself: a 1,500-kilometer supply line from Tripoli, harassed the entire way by an unsuppressed Malta, feeding an army at the very end of its logistical tether. You'll face the consequences of this at El Alamein.",
            });
            base.push({
              label: "Neither: adopt a defensive Mediterranean posture, feed everything to the East",
              advisor: { name: "Halder", position: "The Mediterranean is a theater for people who have forgotten where the war is: in Russia, as it always was." },
              setFlags: { med42: "defensive" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "heydrichReprisals42",
              outcome:
                "Mussolini's regime staked its prestige on North Africa, and a visibly abandoned Italian war effort accelerates exactly the Italian collapse you'll be managing in 1943 regardless.",
            });
            return base;
          })(),
        };
        },
        get suezOpening42() {
          return {
          date: "SUMMER 1942",
          title: "A Supplied Desert War",
          historicalRecord: false,
          situation:
            "Malta's fall changes the arithmetic the historical desert campaign never got to test: convoys reach Tripoli and Benghazi at close to full strength for the first time in the war, and Rommel's own chronic complaint, always almost enough fuel to finish what he started, has an answer he never actually had. Suez sits ahead, and the argument, unusually, isn't about whether the desert war can be supplied. It's about what to spend the supply on.",
          choices: [
            {
              label: "Drive for Suez immediately: the fuel is here, the British are still reeling from Tobruk",
              advisor: { name: "Rommel", position: "Two years have been spent asking for exactly this much fuel, and this month will not be spent finding a reason to wait for more." },
              historical: false,
              setFlags: { suezOpening42: "drive" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "heydrichReprisals42",
              uncertain: [
                {
                  weight: modWeight(45, meters.fuel),
                  title: "The canal comes into range",
                  impact: { manpower: -1, fuel: 0, initiative: 1 },
                  outcome:
                    "The most favorable reading a really supplied Panzerarmee could plausibly earn: the drive reaches Egypt's interior in strength history's fuel-starved version never had, and Suez itself becomes a live operational question rather than a wartime what-if. It does not end the war, no branch in this campaign does, but it is the closest this theater ever comes to mattering at the war's actual scale.",
                },
                {
                  weight: 100 - modWeight(45, meters.fuel),
                  title: "Alam Halfa holds anyway",
                  impact: { manpower: -2, fuel: -1, initiative: 0 },
                  outcome:
                    "The fuel solved one problem and not the others: British defensive preparation, Montgomery's incoming reinforcement schedule, and the sheer geography of the position at Alam Halfa all argued against the desert war ending here regardless of what the convoys carried. The historical stalemate holds even with the historical excuse for it removed: a uncomfortable finding for the theory that fuel alone was always the desert war's real ceiling.",
                },
              ],
            },
            {
              label: "Consolidate first: rebuild Panzerarmee's strength properly before spending this fuel on an offensive",
              advisor: { name: "Kesselring", position: "Never before has there been this much fuel and this little urgency to spend it badly, so the patience the convoys just bought should be used." },
              historical: false,
              setFlags: { suezOpening42: "consolidate" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "heydrichReprisals42",
              outcome:
                "The disciplined answer to an undisciplined theater's oldest problem: Panzerarmee rebuilds to genuine strength rather than spending its first real fuel surplus on an immediate gamble. It is, on the numbers, the more defensible choice, and it is also, this campaign notes without irony, exactly the kind of patience the desert war's actual commanders rarely had the fuel to afford before now.",
            },
          ],
          };
        },

        get heydrichReprisals42() {
          return {
          date: "JUNE 1942",
          title: "Lidice",
          historicalRecord: true,
          situation:
            "Reinhard Heydrich (Reich Protector of Bohemia and Moravia, and the administrator who chaired the Wannsee Conference) died on June 4th of wounds from an ambush in Prague by Czechoslovak agents trained and inserted by British intelligence. What has already happened is not a decision this desk gets to make: on Hitler's direct order, the village of Lidice was surrounded on June 10th, its men executed, its women deported, most of its children sent to their deaths at Chełmno. Ležáky followed days later. Neither village had any confirmed connection to the assassination: the target was never the specific resistance cell, but any population that might be sheltering one. That is settled, and nothing available here changes it. What remains open is the policy question sitting on this desk now: whether maximum, indiscriminate collective terror continues as the standing response to resistance across the Protectorate, or whether the occupation's methods narrow from here.",
          choices: [
            {
              label: "Continue the doctrine of maximum collective terror: any resistance act answered with indiscriminate reprisal",
              advisor: { name: "K.H. Frank", position: "Lidice was not proportionate to what one man did, and that was the entire point. A population that fears total collective punishment need not agree to inform, only be afraid enough to stop protecting anyone." },
              historical: true,
              setFlags: { protectorate42: "terror" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "caseBlue",
              outcome:
                "What actually followed: the Protectorate's occupation continued under a doctrine of maximum terror through 1945, with further reprisals of the same character when later resistance acts occurred. Whether the policy suppressed resistance more than it hardened it is a question the occupation's own intelligence assessments argued both ways at the time, and postwar historians have not settled it either. What is not disputed, and never was, is the scale of what a policy built on that premise produced.",
            },
            {
              label: "Narrow the standing policy: future reprisal targets confirmed networks rather than entire populations",
              advisor: { name: "Daluege", position: "The argument is not made from mercy. It is made because a population with nothing left to lose stops being useful as an intelligence source and becomes a liability that still has to be fed and guarded." },
              setFlags: { protectorate42: "targeted" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "caseBlue",
              outcome:
                "Not the historical policy, and a real departure from it going forward: future reprisals are scoped to networks with some confirmed connection to specific acts, rather than entire villages selected essentially at random the way Lidice and Ležáky were. It does not undo either village, nothing available to this command does, and it does not end the occupation's brutality, only narrows its aim. There is no assurance in the record, real or projected, that a narrower terror produces less resistance rather than simply a different shape of it.",
            },
          ],
        };
        },
        get caseBlue() {
          return {
          date: "JUNE 1942",
          title: "Case Blue",
          historicalRecord: flags.eastFront !== "moscow",
          meanwhile:
            "MEANWHILE: MOSCOW: Stavka reads the German buildup in the south and argues about whether it is the real blow or a feint toward Moscow.",
          situation:
            (flags.eastFront === "moscow"
              ? "The exposed-flank crisis of 1941 leaves the Wehrmacht entering the new campaigning season with less in reserve than the historical record shows. "
              : "") +
            "Directive 45 splits the summer offensive between Stalingrad, cutting the Volga supply artery, and the Caucasus oil fields at Maikop, Grozny, and Baku, simultaneously. The fuel ledger is the argument for all of it: the Reich's synthetic plants and Ploiești together cover current consumption with almost no margin, and every projection of a longer war shows the line crossing into shortage.\n\nWhat your planners cannot tell you with any confidence is Soviet strength in the south. FHO's estimates of Red Army reserves behind the Don bend have been revised three times this spring, spanning a range of nearly two to one, and after last winter, nobody trusts the low end." +
            (meters.fuel <= -2
              ? " And one thing has been settled before the conference opens: the fuel ledger has already foreclosed Directive 45 as written. Two diverging axes cannot be supplied simultaneously from stocks this thin: whatever is attempted this summer will be attempted on one axis."
              : "") +
            (flags.eastFront === "moscow"
              ? " Given how thin the reserve already is, staff officers are, atypically, openly asking whether a major offensive should be attempted at all this year."
              : "") +
            (flags.forkCaucasusThin
              ? " For once, FHO's low-end estimate turns out to be the one worth trusting: early prisoner interrogations suggest the Don-bend reserves are thinner than even the cautious planners assumed."
              : ""),
          choices: (() => {
            const afterCaseBlue = "torch42";
            const twoAxisPossible = meters.fuel > -2;
            const base = [];
            base.push({
                checkLabel: "Matériel",
                disabledReason: twoAxisPossible ? undefined : "insufficient fuel to supply two axes simultaneously",
                label: "Pursue both objectives at once, as directed",
                advisor: { name: "Hitler", position: "Without the oil of Maikop and Grozny the war must end, so Germany will have the oil and the city that bears Stalin's name." },
              attested: { by: "Hitler", text: "If I do not get the oil of Maikop and Grozny, then I must end this war.", source: "Hitler to Army Group South staff, Poltava, 1 June 1942, per Joel Hayward, Hitler's Quest for Oil (1995)" },
                historical: true,
                setFlags: { caseBlue: "both" },
                impact: flags.eastFront === "moscow" ? { manpower: -1, fuel: -1, initiative: 0 } : { manpower: 0, fuel: 0, initiative: 0 },
                next: afterCaseBlue,
                outcome:
                  flags.eastFront === "moscow"
                    ? "Reasoned projection: splitting armor and air support between two diverging axes was already cited by German staff officers as overextension in the actual campaign: starting from a thinner reserve, that overextension bites earlier and harder here."
                    : "Splitting armor and air support between two diverging axes, the fronts end up hundreds of miles apart, stretched supply and combat power thin on both. German staff officers themselves cited this, after the war, as the critical overextension of the entire eastern campaign. The uncertainty resolved badly too: Soviet reserves in the south were at the high end of every estimate.",
              });
            base.push({
                label: "Concentrate fully on the Caucasus oil fields; hold Stalingrad's flank defensively",
                advisor: { name: "List", position: "The oil is the war and the city is a name on a river, and the army knows which of the two it can burn in its tanks." },
                setFlags: { caseBlue: "caucasus" },
              favor: 1,
                impact: flags.eastFront === "moscow" ? { manpower: -2, fuel: 1, initiative: 0 } : { manpower: 0, fuel: 1, initiative: 0 },
                next: afterCaseBlue,
                outcome:
                  "Addresses the real, worsening fuel shortage at the center of the whole war economy: the one number in this decision that isn't an estimate. But it likely leaves a strong Soviet position on the Volga able to threaten the entire southern front's rear, and if FHO's high-end reserve figures are right, 'defensively holding' that flank is a thinner bet than the plan admits.",
              });
            base.push({
                label: "Concentrate fully on Stalingrad; hold the Caucasus defensively",
                advisor: { name: "Paulus", position: "Cut the Volga and the Caucasus oil cannot move north whether the wells are held or not. One objective, taken properly." },
                setFlags: { caseBlue: "stalingrad" },
              favor: 1,
                impact: flags.eastFront === "moscow" ? { manpower: -1, fuel: 0, initiative: 0 } : { manpower: 0, fuel: 0, initiative: 0 },
                next: afterCaseBlue,
                outcome:
                  "Secures the Volga crossing and rail hub, but does nothing for the fuel shortage that was the offensive's original justification: a tactical win with the strategic problem left untouched. Every month the oil question goes unanswered, the margin for every future operation shrinks.",
              });
            if (meters.fuel >= 2)
              base.push({
                label: "A sequenced offensive: the Caucasus first, then the Volga with the oil already secured",
                advisor: { name: "Manstein", position: "The directive's error is not its ambition but asking one summer to do two things at once. Fuel like this buys what the historical plan never had, an order of operations." },
                setFlags: { caseBlue: "sequenced" },
              favor: 1,
                impact: { manpower: 0, fuel: 1, initiative: 1 },
                next: afterCaseBlue,
                outcome:
                  "Only on the table because this path banked the fuel to attempt it: a two-phase campaign season is a logistics luxury the historical 1942, running on fumes, could not have scheduled. The projection is favorable but honest: sequencing avoids Directive 45's fatal split, secures the oil first, and still ends the year fighting on the Volga against the same deep Soviet reserves: better postured, later, and with the same winter coming.",
              });
            if (flags.eastFront === "moscow" || meters.manpower <= -3) {
              base.push({
                label: "Cancel major offensive operations: hold a defensive line and conserve what's left",
                advisor: { name: "Halder", position: "The army for the plans on this table no longer exists, and someone in the room should say so before the maps do." },
                setFlags: { caseBlue: "defensive", preservedReserve: true },
              favor: 2,
                impact: { manpower: 1, fuel: 1, initiative: 0 },
                next: "blackMay",
                outcome:
                  "Not a real option on the table historically, Hitler would not tolerate abandoning offensive operations in 1942, but taken purely on the merits: conserving a force already thinned by the previous year's crisis is the option best supported by the situation you're really in. This also means no Stalingrad pocket ever forms: an entire chapter closed rather than changed, since there's no city to be encircled in if you never advance on it.",
              });
            }
            return base;
          })(),
        };
        },
        get torch42() {
          return {
          date: "NOVEMBER 1942",
          title: "Torch and the Fleet at Toulon",
          historicalRecord: true,
          situation:
            "Anglo-American forces have landed across French North Africa. Vichy's forces there resist for barely two days before Admiral Darlan brokers a ceasefire and hands the territory to the Allies: a defection that ends the strategic purpose Vichy's 'Free Zone' in metropolitan France was created to serve. But one asset still sits entirely within reach: the French fleet at Toulon, some 200,000 tons of warships including capital units, anchored and waiting to see who reaches the harbor first." +
            (flags.forkTorchShift
              ? " The landing convoys themselves reportedly ran days behind their planned schedule (weather, by the same reports) which buys an unexpected few extra days for whatever happens at Toulon."
              : "") +
            (flags.forkCaucasusThin && flags.caseBlue === "both"
              ? " The southern front, for what it's worth this week, is still holding both axes it was never supposed to be able to supply at once: the thinner Soviet reserve FHO flagged in June hasn't yet forced the choice between Stalingrad and the Caucasus that the historical overextension eventually did."
              : ""),
          choices: [
            {
              label: "Occupy all of Vichy France immediately: Case Anton, as planned",
              advisor: { name: "Keitel", position: "The Free Zone served its purpose as a fiction, and the fiction has ended itself." },
              historical: true,
              setFlags: { vichy: "occupied" },
              impact: { manpower: 0, fuel: -1, initiative: 1 },
              next: flags.med42 === "egypt" ? "elAlamein" : flags.med42 === "malta" ? "maltaAftermath" : "stalingradPocket",
              outcome:
                "What happened, November 11, 1942: German and Italian forces moved into the Free Zone within three days of Torch. The move triggered exactly what it was meant to prevent: as German tanks reached Toulon's gates on November 27, French crews scuttled the fleet at anchor rather than surrender it to either side. One of the most decisive self-inflicted losses of the war for the Axis Mediterranean position, and Vichy's occupation gained territory while losing the one asset in it worth having.",
            },
            {
              label: "Race for Toulon first: seize the fleet before it can be scuttled",
              advisor: { name: "Rundstedt", position: "Two hundred thousand tons of warships are deciding for themselves whether to exist tomorrow, and every hour of hesitation is their argument for scuttling." },
              setFlags: { vichy: "toulonRace" },
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: flags.med42 === "egypt" ? "elAlamein" : flags.med42 === "malta" ? "maltaAftermath" : "stalingradPocket",
              uncertain: [
                {
                  weight: 20,
                  title: "The fleet is seized intact",
                  impact: { manpower: 0, fuel: 2, initiative: 0 },
                  outcome:
                    "Reasoned projection at its most generous, and a real historical near-miss magnified: armor reaches the harbor before scuttling charges complete, and a meaningful fraction of the fleet, including capital ships, falls into German hands, transforming the Mediterranean naval balance overnight. The historical attempt was delayed by mere hours; this is what those hours were worth.",
                },
                {
                  weight: 80,
                  title: "The fleet burns anyway",
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  outcome:
                    "The historical result repeats despite the faster approach: French crews, drilled for exactly this scenario, complete the scuttling within minutes of the order regardless of how quickly the tanks arrive. A rehearsed demolition rarely loses a race against speed alone.",
                },
              ],
            },
            {
              label: "Leave the Free Zone nominally Vichy: hold only strategic points, avoid forcing Darlan's hand",
              advisor: { name: "Weizsäcker", position: "Occupying the whole zone leaves Darlan no choice but to burn the fleet, while restraint costs the ore and grain of the south, which may still cost less than the ships." },
              setFlags: { vichy: "restrained" },
              favor: 1,
              impact: { manpower: 1, fuel: -1, initiative: 0 },
              next: flags.med42 === "egypt" ? "elAlamein" : flags.med42 === "malta" ? "maltaAftermath" : "stalingradPocket",
              outcome:
                "Reasoned projection: restraint preserves a diplomatic fiction and avoids directly forcing the scuttling order at Toulon, but an unoccupied 'Free Zone' becomes a security problem in its own right: resource extraction from southern France drops, and Allied-sympathetic administrators and resistance networks organize more freely under a thinner German presence, echoing the partisan war Italy will present a year from now.",
            },
          ],
        };
        },
        get maltaAftermath() {
          return {
          date: "AUTUMN 1942",
          title: "The Supplied Desert",
          historicalRecord: false,
          situation:
            "Alternative history in earnest now: with Malta taken, the convoy war has inverted. Rommel's Panzerarmee is receiving fuel and vehicles at rates the historical desert war never saw, and the question the historical record never got to ask arrives on your desk.\n\nEighth Army is digging in at El Alamein behind the same sea-and-depression bottleneck, being rebuilt via the Cape route regardless of anything happening in the Mediterranean, under a new commander who will not move until his superiority is overwhelming. A supplied Rommel is a different animal, but the bottleneck is still a bottleneck, and the British buildup clock still runs.",
          choices: [
            {
              label: "The supplied offensive: break the Alamein position before Montgomery's buildup completes",
              advisor: { name: "Rommel", position: "Two years of this war have been fought on captured petrol and promises. Give one battle with full tanks and see what it was always supposed to look like." },
              setFlags: { maltaPath: "offensive" },
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: flags.dunkirkResult === "shattered" && flags.usWar !== "declared" ? "britishCrisis42" : "stalingradPocket",
              outcome:
                "Reasoned projection, honestly bounded: a fully fueled Panzerarmee makes the Alam Halfa gambit a genuine battle rather than a fuel-starved lunge, and plausibly cracks the position before Montgomery's superiority peaks: the best desert outcome reachable in this campaign. But the Cape-route buildup means even a lost Alamein doesn't end British power in Egypt; it buys the theater a year, not a verdict, and every division succeeding here is a division the Eastern Front is bleeding without.",
            },
            {
              label: "Hold at Alamein supplied and fortified: make the desert a fortress, not a racetrack",
              advisor: { name: "Kesselring", position: "The island was taken so this army could stop gambling, and a supplied defense here costs the British two years and costs Germany almost nothing." },
              setFlags: { maltaPath: "fortress" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: flags.dunkirkResult === "shattered" && flags.usWar !== "declared" ? "britishCrisis42" : "stalingradPocket",
              outcome:
                "Reasoned projection of the conservative dividend: a properly supplied defensive line at the war's best natural chokepoint is truly formidable, and Montgomery's methodical style obliges by taking the time to be overwhelming. The theater stabilizes for a year or more at minimal cost: the quiet best-value outcome of the entire Mediterranean war, purchased by an island assault most timelines never attempted.",
            },
          ],
        };
        },
        get britishCrisis42() {
          return {
          date: "AUTUMN 1942",
          title: "The Coalition Question",
          historicalRecord: false,
          speculative: true,
          situation:
            "Two of the least likely turns in this campaign have already happened here: Dunkirk's pocket was crushed rather than evacuated, Britain's field army lost rather than saved, and the Mediterranean has been strangled since Malta fell. The scholarly consensus is stated first, because it sets the odds: Churchill's position was, by every serious account, close to unassailable, and the war cabinet crisis of May 1940, the one moment the Halifax faction tested the question of terms, ended with negotiation politically dead. Britain under strangulation in this projection is battered, not broken; the Empire's lifeline runs the Cape route no Mediterranean defeat touches; and America, though not yet a belligerent on this path, arms her more heavily every quarter.\n\nAgainst that consensus, the minority argument this campaign will let you test: that some combination of the lost army, the strangled sea, and a second winter of it revives the faction that asked about terms once before. Everything downstream of that argument is marked as what it is: speculation past the edge of the evidence." +
            (flags.hess41 === "embraced"
              ? " There is an uncomfortable precedent already sitting in the file: a deputy Führer's unauthorized peace flight, publicly embraced rather than disowned. Whatever this desk proposes now through Stockholm inherits some of that episode's credibility problem before a single word is sent."
              : ""),
          choices: [
            {
              label: "Extend discreet feelers through Stockholm: offer an armistice while the strangle bites",
              advisor: { name: "Weizsäcker", position: "The offer is not defeat but the word pause, at the moment their newspapers have run out of other words, and diplomacy has been built on less." },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "crisisResolution42",
              uncertain: [
                {
                  weight: modWeight(12, meters.manpower),
                  title: "The coalition cracks",
                  setFlags: { ukTerms: "crisis", speculativePath: true },
                  impact: { manpower: 0, fuel: 1, initiative: 0 },
                  outcome:
                    "The minority case, against long odds, came to pass, and it's labelled for what it is: a political outcome the actual historical record gives little support for at any weight of military pressure. A confidence crisis breaks the wartime coalition's unity; a new government, formed around the faction that asked about terms in May 1940, signals through Stockholm that an armistice conversation can occur. Not surrender, Britain is unbeaten at home and unbeatable at sea, an armistice: the word 'pause,' with everything unresolved inside it.",
                },
                {
                  weight: 100 - modWeight(12, meters.manpower),
                  title: "Churchill holds",
                  setFlags: { ukTerms: "refused" },
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  outcome:
                    "The consensus case: the feelers reach London and die there, as every historical feeler did. The coalition's answer to a lost army and a strangled sea is the answer of 1940 with more anger behind it, and the leaked fact of the approach hardens American opinion measurably. The war continues, with the Stockholm channel now burned for any future use.",
                },
              ],
            },
            {
              label: "No feelers: let military pressure alone do whatever talking gets done",
              advisor: { name: "Jodl", position: "Feelers that are refused are called weakness in every capital that hears of them, so the tonnage charts must make the argument or nothing will." },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "stalingradPocket",
              uncertain: [
                {
                  weight: modWeight(30, meters.fuel),
                  title: "The pressure alone nearly does it",
                  setFlags: { ukTerms: "unsolicited" },
                  impact: { manpower: 0, fuel: 1, initiative: 0 },
                  next: "stalingradPocket",
                  outcome:
                    "No approach was made, and one comes anyway: with no Stockholm channel to point to as evidence of German weakness, a harder-line case reaches the war cabinet on its own: the strangulation, not diplomacy, forces the question London tried to avoid answering in the feelers timeline. It goes nowhere formally, Churchill's position holds as the consensus says it should, but the fact that pressure alone produced what an actual approach didn't is not lost on Berlin's planners.",
                },
                {
                  weight: 100 - modWeight(30, meters.fuel),
                  title: "Nothing moves without a political opening",
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  next: "stalingradPocket",
                  outcome:
                    "The pressure continues without a political dimension, and the moment, whatever it was or wasn't worth, passes without incident. The eastern war's autumn is waiting regardless, unaffected by a conversation that never happened.",
                },
              ],
            },
          ],
        };
        },
        get crisisResolution42() {
          return {
          date: "WINTER 1942",
          title: flags.ukTerms === "crisis" ? "The Western Armistice" : "The Answer From London",
          historicalRecord: false,
          speculative: flags.ukTerms === "crisis",
          situation:
            flags.ukTerms === "crisis"
              ? "Marked plainly, up front: this is speculation beyond what the evidence supports: the consensus of scholarship holds that no military pressure produced a British government willing to sign anything. All the same: draft armistice terms through Stockholm. A cessation in the west; no occupation of Britain, which no one can enforce anyway; colonial and naval questions deferred to a conference both sides privately expect never to convene.\n\nYour staff's honest annex, again the part no celebration reads aloud: an armistice in the west leaves the regime governing occupied Europe (with everything its own documents say that means, continuing) while America, unattacked and now openly hostile, accelerates a weapons program conceived with Germany's name on it. This is not a peace. It is an intermission with a clock running under it."
              : "The feelers were made, refused, and, worse, published. Washington's rearmament debate shortens by months; London's coalition closes ranks around the refusal. The war continues with the political option not merely closed but seen to be closed.",
          choices:
            flags.ukTerms === "crisis"
              ? [
                  {
                    label: "Sign the armistice: the western war stops on the line where it stands",
                    advisor: { name: "Weizsäcker", position: "Sign it before someone in either capital thinks a week longer about what it does not say." },
                    setFlags: { pathVariant: "armisticeWest" },
                    impact: { manpower: 1, fuel: 1, initiative: 0 },
                    next: "westArmisticeAftermath42",
                    outcome:
                      "Signed, on the speculative page it lives on. The shooting in the west stops; nothing else does. The eastern war, already burning on this path, continues alone; occupied Europe remains occupied by a regime whose intentions are documented and monstrous; and the American program that will end every version of this war that lasts long enough runs on, now against a Germany that has handed it undivided attention. What this command actually does with a war suddenly halved is the next, and last, real question this campaign asks.",
                  },
                  {
                    label: "Escalate the terms: demand naval limits and colonial concessions while London is weak",
                    advisor: { name: "Ribbentrop", position: "They came to the table, and tables are where things are taken." },
                    setFlags: { ukTerms: "overreached" },
                    impact: { manpower: 0, fuel: -1, initiative: 0 },
                    next: "stalingradPocket",
                    outcome:
                      "The speculative branch teaches this campaign's oldest lesson in its newest setting: the crisis government's entire fragile mandate was 'an honorable pause,' and demands that make the pause look like defeat collapse it overnight. The coalition re-forms around resistance, the armistice window shuts, and the approach's only lasting product is a harder Britain and a faster America. Overreach, this campaign's most reliable engine, works on diplomacy too.",
                  },
                ]
              : [
                  {
                    label: "Return to the war in silence: no comment, no attempt to spin the leak",
                    advisor: { name: "Halder", position: "The east did not pause while the question was asked, and it never does. Say nothing further and let the silence be the only dignity left in it." },
                    setFlags: { feelers42Outcome: "silent" },
                    impact: { manpower: 0, fuel: 0, initiative: -1 },
                    next: "stalingradPocket",
                    uncertain: [
                      {
                        weight: 70,
                        title: "The silence reads as discipline",
                        impact: { manpower: 0, fuel: 0, initiative: 0 },
                        outcome:
                          "Berlin says nothing further, and nothing further needs saying: a regime that doesn't dignify a refused approach with commentary reads, to the home front and to neutral observers alike, as one still confident in its position. The autumn's eastern crisis is waiting regardless, but at least this quarter's silence cost nothing and bought a measure of the composure a war this long increasingly can't take for granted.",
                      },
                      {
                        weight: 30,
                        title: "The silence reads as nothing happened at all",
                        impact: { manpower: 0, fuel: 0, initiative: 0 },
                        outcome:
                          "The restraint that was meant to read as dignity mostly just reads as absence: with no framing offered in either direction, the Stockholm story fades from notice within weeks, unremembered by the public that never heard Berlin's side and unremarked upon by a home front given nothing to feel resolved about. The autumn's eastern crisis is waiting regardless, and this quarter leaves no mark on anything.",
                      },
                    ],
                  },
                  {
                    label: "Turn the refusal into propaganda: frame London's answer as proof the enemy wants annihilation, not peace",
                    advisor: { name: "Goebbels", position: "They were offered an end and chose more war, and every home front needs to hear exactly that, in exactly those words, before winter." },
                    setFlags: { feelers42Outcome: "propaganda" },
                    favor: 1,
                    impact: { manpower: 0, fuel: 0, initiative: 1 },
                    next: "stalingradPocket",
                    outcome: "The refusal becomes the domestic story instead of the approach itself: a war-weary home front is told the enemy chose annihilation over terms, which buys a season's worth of resolve at the cost of a claim easily checked and easily disbelieved once the war continues to go badly. The autumn's eastern crisis doesn't wait for the propaganda office to finish either way.",
                  },
                ],
        };
        },
        get westArmisticeAftermath42() {
          return {
          date: "WINTER 1942",
          title: "A War Suddenly Halved",
          historicalRecord: false,
          speculative: true,
          situation:
            "Marked plainly, up front: this is the last speculative page this campaign turns before the record closes on it. Six years of preparing for a two-front war, and this staff has never once had to plan what to do with a one-front one. The Royal Navy no longer needs answering; the Channel no longer needs defending; the divisions that garrisoned an invasion nobody was going to attempt are, for the first time in this war, actually free. The eastern war (the one this armistice didn't touch, the one still consuming men and fuel at the historical rate against a state that has absorbed everything and remained a state) is still there, still burning, still asking for exactly what this freed strength could now provide. What this command does with it is the question history was never in a position to ask, because history never reached this page.",
          choices: [
            {
              label: "Turn the freed divisions east: commit fully to finishing the eastern war outright",
              advisor: { name: "Halder", position: "The whole war has been fought on two fronts with strength meant for one and a half. For the first time there is strength meant for two aimed at a war still fought with one, and what that changes should be found out before the answer expires." },
              historical: false,
              setFlags: { westArmisticeAftermath42: "east" },
              favor: -1,
              impact: { manpower: -2, fuel: 0, initiative: 1 },
              next: "END",
              outcome:
                "The aggressive reading of an unprecedented position: a fully reinforced eastern front, fed by an army no historical Reich ever had free to send, tests the Kuibyshev government's actual resilience against a concentration of force the historical war's two-front arithmetic never allowed. It doesn't change what the western armistice already conceded to reach this point, and it doesn't stop the clock running in New Mexico: this campaign's honest accounting of the reinforcement's real ceiling: a harder eastern war, not a won one, fought by a Reich that has spent its one western peace testing whether a second front's absence was ever really the problem.",
            },
            {
              label: "Hold the freed strength in reserve: consolidate the western peace rather than gamble it on the east",
              advisor: { name: "Weizsäcker", position: "An armistice is not a victory, and one this speculative survives exactly as long as nobody spends the peace testing what else it can buy. It is better to administer what exists than to wager it on a front it was never signed to help." },
              historical: false,
              setFlags: { westArmisticeAftermath42: "hold" },
              favor: 1,
              impact: { manpower: 1, fuel: 1, initiative: -1 },
              next: "END",
              outcome:
                "The disciplined reading, and the one this campaign's own honest accounting favors: keeping the freed strength in reserve treats the western armistice as what it actually is: a pause purchased at odds this entire branch required stacking multiple unlikely breaks to reach, not a war chest to spend escalating the one front it left burning. The eastern war continues on its own historical terms, unreinforced by a peace that was never fought to help it. What consolidation actually preserves is the one uncommon thing this path produced, an intact western peace, rather than spending it finding out whether a harder eastern war was worth the risk to it.",
            },
          ],
        };
        },
        get elAlamein() {
          return {
          date: "JULY – NOVEMBER 1942",
          title: "The End of the Tether",
          historicalRecord: true,
          situation:
            "Rommel's pursuit has reached El Alamein, sixty miles from Alexandria, and stopped. The position ahead is the one bottleneck in the whole desert: sea on one flank, the impassable Qattara Depression on the other, no room for the sweeping maneuvers that won every previous battle.\n\nBehind you, the supply situation is exactly what the Malta decision made it: convoys are losing tonnage at rates your quartermasters describe as 'unsustainable within weeks,' fuel deliveries cover a fraction of consumption, and captured British stocks, the pursuit's actual fuel supply, are running out. British reinforcement convoys are arriving via the Cape route in strength estimated anywhere from 'replacement level' to 'a wholly rebuilt army,' and a new British commander is reportedly refusing to attack until his buildup is overwhelming." +
            (flags.forkTorchShift
              ? " Whatever the delay at the Torch beaches was worth, it hasn't reached this theater: the arithmetic here is the same one every other version of this campaign has faced."
              : ""),
          choices: [
            {
              label: "One more push: break through to Alexandria before the British rebuild",
              advisor: { name: "Rommel", position: "The army is sixty miles from ending the desert war forever, and armies this close to Alexandria do not turn around and call it wisdom." },
              historical: true,
              setFlags: { alamein: "push" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "stalingradPocket",
              outcome:
                "Essentially what happened, in stages: Alam Halfa in September, then grinding defense until Montgomery's October offensive broke the position. The supply estimates were the accurate ones: Panzerarmee Afrika attacked into prepared defenses on fumes, and the high-end estimates of British reinforcement were correct. The retreat that followed ran two thousand kilometers and never really stopped until Tunisia, where the army was finally lost entirely in May 1943: a quarter-million Axis prisoners, a second Stalingrad that history remembers less.",
              // Key Battle Subgame, battle #4 (round 15). Dev build only, same
              // KEY_BATTLE_SUBGAME_ENABLED-gated spread as Omaha/Stalingrad — shipped builds keep
              // this choice exactly as it already was (deterministic, straight to
              // stalingradPocket). Models the actual push, the Battle of Alam Halfa (30 August –
              // 5 September 1942) — the "in stages" the outcome text above already gestures at.
              // All facts verified 2026-09-24/25 (Wikipedia: Battle of Alam el Halfa,
              // Fliegerführer Afrika; historyofwar.org: Battle of Alam Halfa): Rommel's own
              // after-action message cited "lack of fuel, Allied air superiority and the loss of
              // surprise" for calling it off on 2 September — the same three pressures this
              // subgame's categories and postures are built around. Order of battle: 93 Panzer
              // III, 73 Panzer III Special (long 50mm), 10 Panzer IV, 27 Panzer IV Special (long
              // 75mm) in the two panzer divisions, 243 mostly-obsolete tanks in the two Italian
              // armoured divisions, 298 Luftwaffe + 460 Italian aircraft against a Desert Air
              // Force that flew 167 bomber and 501 fighter sorties on 2 September alone.
              concealRoll: true,
              ...(KEY_BATTLE_SUBGAME_ENABLED
                ? {
                    keyBattleSubgame: {
                      id: "elAlamein",
                      title: "Order of Battle: The Push to Alam Halfa",
                      flavor:
                        "Sixty miles from Alexandria and this is the ground that decides it: sea on one flank, the Qattara Depression on the other, no room to maneuver around the British line the way every earlier battle in this desert allowed. The plan is a night march south around the minefields, then a hard turn north behind the Alam Halfa ridge before the sun comes up and the Desert Air Force owns the sky over open ground. Every vehicle in this army is already running on requisitioned and captured fuel that isn't being replaced at the rate it's being burned: what's decided here is how much of what's left drives, how much walks, what the Luftwaffe can put over the column, and how much gets held back rather than spent finding the gap.",
                      effectiveness: { divisions: 2.0, armour: 2.4, air: 1.4, supply: 2.8 },
                      orderOfBattle: {
                        divisions: {
                          units: [
                            "The Italian infantry corps under Navarini, holding the line the panzers cleared",
                            "The German 90th Light Division and the 164th Infantry Division",
                          ],
                          real: "The infantry's task was to hold the northern line while the mobile forces made the southern sweep.",
                        },
                        armour: {
                          units: [
                            "The Afrika Korps: 15th and 21st Panzer Divisions",
                            "The Italian XX Motorised Corps: the Ariete and Littorio armoured divisions",
                          ],
                          real: "The minefields proved deep: General von Bismarck of 21st Panzer was killed and General Nehring wounded, and the axis forces turned north earlier than planned because of delays, heavy fuel consumption over bad going, and the fuel shortage.",
                        },
                        air: {
                          units: [
                            "Fliegerführer Afrika (Seidemann) and Italian air units",
                            "Against the Desert Air Force, which bombed the columns by day and by night",
                          ],
                          real: "Albacores and Wellingtons bombed the columns through the night of 31 August and 1 September.",
                        },
                        supply: {
                          units: [
                            "The tankers the Italian navy promised for the offensive",
                            "Fuel captured and requisitioned in the desert",
                          ],
                          real: "More than half of the supply ships sank, and only 1,500 tons of fuel arrived of the 6,000 requested.",
                        },
                      },
                      // Round 23: orders from above in the campaign's hard mode (modeled, not documented).
                      hardRule: { text: "Rome and OKW have promised fuel for one push only, so the fast approach is ordered.", lockApproach: "raceTheDawn" },
                      // Round 22. Verified 2026-10-05 (Wikipedia, Battle of Alam el Halfa): the minefields proved deep, the
                      // axis forces turned north earlier than planned because of delays, heavy consumption over bad
                      // going and fuel, 22nd Armoured Brigade (Grants and light tanks) was dug in on the ridge, and the
                      // Desert Air Force bombed the columns by night and by day. The three answers are the options at the
                      // turn; their payoffs against each British posture are modeled.
                      conditions: "Sixty miles from Alexandria, with the sea on one flank and the Qattara Depression on the other, soft going south of the British minefields, and the Desert Air Force overhead.",
                      terrainModifiers: { supply: 0.85, armour: 0.9 },
                      terrainNotes: { supply: "fuel burned on soft sand and detours", armour: "deep minefields and bad going" },
                      decisions: [
                        {
                          id: "theTurnNorth",
                          time: "1130",
                          title: "The turn north",
                          prompt: "The night march has cost more time and fuel than the plan allowed. The minefields were deep, the going is bad, and the British are hitting the column from the air. The wheel north toward the Alam Halfa ridge was to come further east. It has to be decided now where it comes.",
                          options: [
                            {
                              id: "turnNow",
                              name: "Turn north at once, toward the Alam Halfa ridge",
                              note: "Save fuel and time, and meet whatever is on the ridge.",
                              bonus: 0,
                              bonusByPosture: {deepMinefields: 3, hullDownLine: -4},
                              reportLine: "The column wheels north, short of the planned line, toward the Alam Halfa ridge.",
                            },
                            {
                              id: "sweepWide",
                              name: "Continue the wide sweep to the east before turning",
                              note: "As planned, and with fuel that is running short.",
                              bonus: 0,
                              bonusByPosture: {hullDownLine: 3, deepMinefields: -4, airSuperiority: -2},
                              reportLine: "The column holds its course east, further around the British line, before it turns.",
                            },
                            {
                              id: "haltForFuel",
                              name: "Halt, and call for fuel and fighters",
                              note: "Costs Matériel, and gives the British time.",
                              bonus: 0,
                              bonusByPosture: {airSuperiority: 3, hullDownLine: 1},
                              meters: {fuel: -1},
                              costReason: "A halt in the open for fuel and air cover",
                              reportLine: "The column halts in the open, calling for fuel and for fighters over the desert.",
                            },
                          ],
                        },
                      ],
                      categoryContext: {
                        divisions:
                          "Six divisions against their four sounds like advantage, until you count the Italian infantry formations lacking transport for a night march this fast. Navarini's corps can hold whatever the armor takes, provided it arrives in time to hold it.",
                        armour:
                          "Two hundred gun-armed tanks across both panzer divisions, including twenty-seven of the new long-barreled Panzer IV. Von Vaerst notes the 75mm can open engagement at ranges the British aren't yet equipped to answer: assuming the tanks themselves remain running.",
                        air:
                          "Two hundred ninety-eight Luftwaffe sorties possible, four hundred sixty more from the Italians, ranged against the Desert Air Force that has owned the sky since Gazala. Seidemann takes command of Fliegerführer Afrika this morning: the same morning the attack begins. A new commander inheriting a battle he didn't plan for, without promise he can hold it.",
                        supply:
                          "The quartermasters delivered half of what was requested. Whatever fuel sits in the tanks now is all this army has for the entire operation. Around minefields, each mile adds distance that won't be recovered from a depot that's already spread thin.",
                      },
                      flashups: {
                        divisions: [
                          "An Italian infantry column force-marches to keep the night schedule.",
                          "A motorized company stops to help tow a truck stuck to its axles in soft sand.",
                          "The line infantry digs in on ground the tanks have already crossed.",
                          "A forward company reports contact with a position that wasn't on the map.",
                          "Stragglers from a scattered platoon catch up with the column at first light.",
                        ],
                        armour: [
                          "The panzer spearhead probes the minefield's edge, looking for a lane already cleared.",
                          "A long-barreled Panzer IV opens fire at a range that catches the defenders off guard.",
                          "A tank runs dry short of the ridge and is left where it stopped.",
                          "The column loses an hour finding a way around ground that shouldn't have been mined.",
                          "Two tanks brew up in quick succession crossing the same stretch of open sand.",
                        ],
                        air: [
                          "A flight of Stukas works over the ridge ahead of the advance.",
                          "Fairey Albacores drop flares over the column, turning night into a lit target.",
                          "A dogfight breaks up high overhead without either side losing the sky.",
                          "Wellingtons work the column by the light the flares left behind.",
                          "Flak claims one of the escorting fighters on a low pass.",
                        ],
                        supply: [
                          "A fuel truck is drained into the tanks still capable of moving forward.",
                          "An ammunition column falls behind the pace the armor is setting.",
                          "Engineers lift a string of mines from a lane the column needs by dawn.",
                          "A water ration is cut in half for the men on the column's tail.",
                          "A quartermaster reports the reserve dump is already thinner than briefed.",
                        ],
                      },
                      reportTimes: { open: "1900", contact: "2130", cats: ["0100", "0430", "0730", "1000"], reserve: "1300", counter: "1500" },
                      idleLines: {
                        divisions: [
                          "The infantry corps stays on its start line. Nothing is following the armor forward.",
                          "No infantry moves up behind the spearhead. Whatever it takes, it holds alone.",
                        ],
                        armour: [
                          "The panzer reserve sits fueled and idle behind the line. Nothing is finding the gap.",
                          "No armored thrust goes forward. The night march has nothing leading it.",
                        ],
                        air: [
                          "Nothing flies over the column. Whatever finds it in the open finds it alone.",
                          "The airfields behind the line stay quiet through the advance.",
                        ],
                        supply: [
                          "Nothing extra is loaded before the march. The column carries only what it already had.",
                          "The reserve dump stays put, untouched, behind a line that needed it forward.",
                        ],
                      },
                      verdicts: ["The Ridge Falls", "The Attack Runs Dry"],
                      verdictGrades: {
                        clean: "Every arm reached the ridge together, and the line in front of it simply wasn't strong enough to hold.",
                        costly: "The ridge falls, but the fuel and the daylight it cost to take it are gone for good.",
                        marginal: "The column stalls short of the ridge. The plan held together; the ground and the clock didn't.",
                        total: "The column doesn't stall so much as burn out in the open, in full view of the Desert Air Force.",
                      },
                      counterattack: {
                        category: "armour",
                        severity: { deepMinefields: 1, airSuperiority: 1, hullDownLine: 2 },
                        warn: {
                          1: "British armour is massing behind the ridge, waiting rather than maneuvering.",
                          2: "The whole of the ridge's dug-in armour and anti-tank line is waiting behind hull-down positions for the panzers to close the range.",
                        },
                        results: {
                          repulsed: "The panzer screen answers the fire and holds its ground; the ridge stays contested.",
                          heldAtCost: "The armor holds the ground it's on, barely, and half the tanks that held it won't move again today.",
                          broke: "The dug-in guns break the panzer spearhead before it ever closes the range.",
                          gaveGround: "The armor pulls back off the ridge's open ground rather than fight the gun line at close range.",
                        },
                      },
                    },
                    uncertain: [
                      {
                        // Slightly under a coin flip, matching Rommel's own after-action
                        // reasoning (fuel, air superiority, lost surprise) rather than the node's
                        // own "essentially what happened" framing a plain failure — the subgame
                        // exists to let a well-run plan beat those odds the way the historical
                        // attempt, with its accurate British estimates, could not.
                        weight: modWeight(45, meters.fuel),
                        title: "The Panzers Break the Ridge",
                        setFlags: { alameinPush: "breakthrough" },
                        impact: { manpower: 1, fuel: 0, initiative: 1 },
                        outcome:
                          "What Rommel's own plan called for and the real attempt, on fumes and against accurate British estimates, could not deliver: the ridge falls before the buildup Montgomery was banking on ever completes. Sixty miles from Alexandria becomes the war's actual hinge rather than its high-water mark: the retreat that historically ran two thousand kilometers to Tunisia never has to start.",
                      },
                      {
                        weight: 100 - modWeight(45, meters.fuel),
                        title: "The Attack Runs Dry",
                        setFlags: { alameinPush: "stalled" },
                        impact: { manpower: -3, fuel: -2, initiative: -1 },
                        outcome:
                          "The fuel arithmetic Rommel cited in his own after-action message catches this attempt exactly where it caught the historical one: stalled short of the ridge, in the open, under a sky the Desert Air Force never stopped owning. What follows is the retreat the outer choice already describes: two thousand kilometers, ending in Tunisia.",
                      },
                    ],
                  }
                : {}),
            },
            {
              label: "Halt and dig in at El Alamein: make the British come to you",
              advisor: { name: "Bayerlein", position: "The position is the best in Africa and the army the worst supplied in Africa, and those two facts should be left to fight each other while the ground can still be chosen." },
              setFlags: { alamein: "hold" },
              impact: { manpower: 1, fuel: 1, initiative: -1 },
              next: "stalingradPocket",
              outcome:
                "Rommel effectively tried a version of this after Alam Halfa, and the position's geography truly favored defense. But holding at the end of a strangled supply line only delays the arithmetic: the British buildup compounds monthly while yours doesn't, and the eventual offensive hits with whatever superiority Montgomery decides to wait for. Defensible in the short term; the theater is still lost on logistics.",
            },
            {
              label: "Withdraw to a supportable line in Libya: trade the conquest for the army",
              advisor: { name: "Westphal", position: "Every map in this headquarters shows how far the army came, and none shows how it is to be fed. That argues for the retreat everyone will hate." },
              setFlags: { alamein: "withdraw" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "stalingradPocket",
              outcome:
                "Fall back toward the supply ports until the line is actually sustainable, preserving Panzerarmee Afrika as a force in being. Politically explosive, abandoning Egypt after coming sixty miles from Alexandria, but it's the only option here that doesn't end with the army itself in Allied prisoner cages within a year. Sometimes the estimate everyone hates is the correct one.",
            },
          ],
        };
        },
        get stalingradPocket() {
          return {
          date: "NOVEMBER 1942",
          title: "The Stalingrad Pocket",
          historicalRecord: flags.eastFront !== "moscow",
          meanwhile:
            "MEANWHILE: STAVKA: Operation Uranus has closed faster than Vasilevsky's staff estimated. They are waiting to see what you do.",
          situation:
            (flags.eastFront === "moscow"
              ? "Entering this encirclement with less in reserve than history's version, "
              : "") +
            "Operation Uranus strikes the Romanian-held flanks north and south of Stalingrad and closes behind Sixth Army within days. First reports of the encircled strength are chaotic: staff estimates run from 200,000 to over 290,000 men, and the number you plan around determines everything.\n\nGöring is promising the Luftwaffe can supply the pocket by air: the army's own quartermasters calculate a minimum of 500 tons a day, more realistically 700, while the Luftwaffe's honest internal assessment, which is not the one being briefed to Hitler, puts achievable delivery at a fraction of that in winter weather." +
            (flags.med42 === "defensive"
              ? " The divisions saved from the Mediterranean this spring stand in the southern line: one reason the situation, bad as it is, is not worse."
              : "") +
            (meters.manpower <= -4
              ? " And the southern front's reserves are already so thin going into this that whatever happens to Sixth Army, there may not be enough left to hold the line either way."
              : ""),
          choices: [
            {
              label: "Order an immediate breakout attempt",
              advisor: { name: "Paulus", position: "Freedom of action is requested. The army can still fight its way west as an army, but in two weeks it will only be able to starve as one." },
              setFlags: { stalingrad: "breakout" },
              favor: 2,
              impact: { manpower: 3, fuel: 1, initiative: 0 },
              next: "reconstituted",
              outcome:
                "This is what General Paulus actually requested, and Hitler refused it, ordering the army to hold as a 'fortress' instead. Later wargaming suggests a breakout attempted before the encirclement fully solidified had real odds of extracting a meaningful fraction of the force: a window that closed within days. The airlift numbers everyone would later argue about become irrelevant if the army simply isn't in the pocket.",
              // Key Battle Subgame, battle #3 (round 15). Dev build only, same
              // KEY_BATTLE_SUBGAME_ENABLED-gated spread as Omaha — shipped builds keep this choice
              // exactly as it already was (deterministic, straight to reconstituted). Built on
              // the counterfactual breakout Paulus actually requested and Hitler refused, in the
              // first days after Uranus closed — before the pocket's ring hardened, and weeks
              // before Manstein's real relief attempt (Operation Winter Storm) ran into the fuel
              // wall that later doomed it. All facts verified 2026-09-24 (Wikipedia: Operation
              // Winter Storm, Hans-Valentin Hube, Walther von Seydlitz-Kurzbach, Martin Fiebig):
              // Colonel Wilhelm Adam's own account of the December relief attempt records that
              // "the 6th Army tanks only had fuel for 30 km" before needing more flown in, against
              // a gap to Kirchner's LVII Panzer Corps that never closed below 48 km — the same
              // fuel arithmetic a breakout attempted here would face early rather than late.
              concealRoll: true,
              ...(KEY_BATTLE_SUBGAME_ENABLED
                ? {
                    keyBattleSubgame: {
                      id: "stalingrad",
                      title: "Order of Battle: The Breakout West",
                      flavor:
                        "The ring has closed, but it hasn't set. Staff estimates of the trapped strength still range from 200,000 to well over that, the same uncertainty the airlift planners are about to build their own numbers on, but for a breakout ordered now, in these first days, the harder number is fuel: whatever isn't already inside the pocket isn't coming, and every kilometer west spends it. What's decided here is how the army moves while it still can: how much of the panzer reserve leads the way west, how much of the infantry mass comes with it, what the Luftwaffe can fly in over the column, and how much fuel and ammunition gets carried forward instead of destroyed in place before the retreat starts.",
                      effectiveness: { divisions: 2.0, armour: 2.2, air: 1.6, supply: 3.0 },
                      orderOfBattle: {
                        divisions: {
                          units: [
                            "LI Corps (Seydlitz-Kurzbach): three infantry divisions",
                            "The rest of Sixth Army's infantry inside the pocket, 200,000 men or more by the staff's estimate",
                          ],
                          real: "Seydlitz was among the generals who argued for a breakout. No breakout was ordered: Hitler refused, and the army stayed in the pocket.",
                        },
                        armour: {
                          units: [
                            "XIV Panzer Corps (Hube): the panzer strength that survived Uranus inside the pocket",
                          ],
                          real: "The pocket's tanks had fuel for only a short march, which was at the heart of the case against attempting a breakout.",
                        },
                        air: {
                          units: [
                            "VIII Fliegerkorps (Fiebig)",
                            "The transport groups of the airlift",
                          ],
                          real: "The airlift never delivered what the Luftwaffe had promised the pocket.",
                        },
                        supply: {
                          units: [
                            "The fuel and ammunition inside the pocket, with nothing more coming in",
                            "Depots to be stripped or destroyed before a march",
                          ],
                          real: "The pocket's supplies were spent in place, and the airlift fell far short of what the army needed.",
                        },
                      },
                      // Round 23: orders from above in the campaign's hard mode (modeled, not documented).
                      hardRule: { text: "Hitler's order is that the army holds what it holds: no ground is to be given on the march.", noGiveGround: true },
                      // Round 22. Deep winter on the open steppe. Field decision about the equipment the column cannot
                      // carry and still move; the payoffs against each Soviet posture are modeled.
                      conditions: "Deep winter on the open steppe: snow, hard frost and short days, with fuel enough for only a short march.",
                      terrainModifiers: { armour: 0.9 },
                      terrainNotes: { armour: "tracked vehicles in deep snow" },
                      decisions: [
                        {
                          id: "whatToCarry",
                          time: "1300",
                          title: "What the column carries",
                          prompt: "The breakout has begun, and the column is slower than the plan allowed. The heavy guns and vehicles use the fuel that the whole army needs to march on. The commanders have to decide what goes and what stays, before the Soviet cordon can close around the column.",
                          options: [
                            {
                              id: "marchLight",
                              name: "Destroy the heavy equipment and march light",
                              note: "A faster column, and an army without its guns.",
                              bonus: 0,
                              bonusByPosture: {deepWinter: 4, ringHardening: 1, softSpot: -1},
                              meters: {fuel: -1},
                              costReason: "Heavy equipment destroyed to speed the march",
                              reportLine: "The heavy guns and the vehicles that cannot keep up are destroyed, and the column moves on light.",
                            },
                            {
                              id: "carryGuns",
                              name: "Carry the heavy guns, and move at their pace",
                              note: "Slow, and able to fight its way through a hard ring.",
                              bonus: 1,
                              bonusByPosture: {ringHardening: 3, deepWinter: -3, softSpot: 1},
                              reportLine: "The column keeps its heavy guns and moves at the pace they allow.",
                            },
                            {
                              id: "tanksAhead",
                              name: "Send the tanks ahead to hold the gap open",
                              note: "Fast, if there is a gap, and a column without its screen if there is not.",
                              bonus: 0,
                              bonusByPosture: {softSpot: 4, ringHardening: -3, deepWinter: -2},
                              reportLine: "The tanks go ahead of the column to hold open whatever gap they find.",
                            },
                          ],
                        },
                      ],
                      categoryContext: {
                        divisions:
                          "Most of the army's remaining infantry divisions could march out under their own power, if movement happens before the ring tightens completely. The transport shortage means a choice: what the men can carry comes, what they can't gets left on the ground they're standing on.",
                        armour:
                          "Panzer strength that survived Uranus remains concentrated enough to lead westward, but fuel is absolute. Hube would rather spend it driving than watching captured tanks burn. Every kilometer driven is a kilometer not coming back from a supply line that can't resupply.",
                        air:
                          "VIII Fliegerkorps can cover a moving column the way it's covered the city. Fiebig made clear to Berlin that flying cargo into a static pocket is a different problem than providing cover for a column breaking out. Different problem. Different outcomes.",
                        supply:
                          "This calculation decides it, not enemy action. Every wagon, truck, fuel can loaded before the order becomes something this army carries on the march. Everything destroyed in place to deny the enemy is lost to this army a hundred kilometers from here.",
                      },
                      flashups: {
                        divisions: [
                          "A column of infantry forms up in the dark, packs as heavy as a man can carry.",
                          "A rearguard company digs in behind the retreating column's line of march.",
                          "Stragglers from a scattered platoon fall in with the nearest formed unit.",
                          "An officer redistributes ammunition from a company that's run short.",
                          "The column halts twice in an hour for men who can't keep the pace.",
                        ],
                        armour: [
                          "The panzer screen probes west, looking for the softest line to push through.",
                          "A tank runs dry a kilometer short of the fuel dump and is towed rather than abandoned.",
                          "The armored spearhead brushes aside a blocking position without slowing.",
                          "Two tanks collide in the dark on a road never meant for a night march.",
                          "The lead company reports open ground ahead, for now.",
                        ],
                        air: [
                          "A flight of transports drops canisters near the marching column's last reported position.",
                          "Fighters sweep the column's line of march, looking for trouble before it arrives.",
                          "A supply drop scatters wide of the column in the dark and is only partly recovered.",
                          "Soviet aircraft find a stretch of open road and the column pays for it.",
                          "The airfield behind the line launches one more sortie than the schedule allows.",
                        ],
                        supply: [
                          "A fuel can is siphoned from a truck that won't be moving again to one that will.",
                          "Engineers rig the depot for demolition, then unrig half of it when the order changes.",
                          "A horse-drawn column falls behind the motorized one and is left to catch up on its own.",
                          "The last ammunition train west is loaded past its rated capacity and moves anyway.",
                          "A quartermaster argues, and loses, for five more minutes of loading time.",
                        ],
                      },
                      reportTimes: { open: "0500", contact: "0620", cats: ["0730", "0900", "1030", "1200"], reserve: "1400", counter: "1600" },
                      idleLines: {
                        divisions: [
                          "The infantry mass stays where it was briefed to stay. Nobody is marching yet.",
                          "No column forms up. The order hasn't reached the men who'd have to carry it out.",
                        ],
                        armour: [
                          "The panzer reserve sits fueled and idle. Nothing is leading anybody west.",
                          "No armored screen goes forward. The column, if there is one, moves without cover.",
                        ],
                        air: [
                          "Nothing flies over the line of march. Whatever finds the column finds it alone.",
                          "The airfields stay quiet. No cover, no resupply drop, nothing overhead at all.",
                        ],
                        supply: [
                          "Nothing extra is loaded before the march. The column carries only what it already had.",
                          "The depots are neither stripped nor destroyed. They're simply left, whole, behind the line.",
                        ],
                      },
                      verdicts: ["The Army Marches Out", "The Column Is Run to Ground"],
                      verdictGrades: {
                        clean: "Every arm moved together, and the ring wasn't hard enough yet to stop it.",
                        costly: "The army gets out, but the ground it crossed to do it cost more than the plan allowed for.",
                        marginal: "The column stalls short of open country. The plan held together; the ring, this time, held tighter.",
                        total: "The column doesn't stall so much as come apart on the march.",
                      },
                      counterattack: {
                        category: "divisions",
                        severity: { ringHardening: 2, softSpot: 1, deepWinter: 1 },
                        warn: {
                          1: "Soviet cavalry is probing the column's flank as it moves.",
                          2: "A Soviet mobile corps, freed up from closing the ring, is coming in against the column's flank and rear in strength.",
                        },
                        results: {
                          repulsed: "The flank guard throws the attack back and the column keeps moving.",
                          heldAtCost: "The flank holds, barely, and the rearguard that held it is nearly used up.",
                          broke: "The attack breaks into the column's rear before the flank guard can stop it.",
                          gaveGround: "The rearguard falls back into the column rather than fight it out, and the march loses its order doing it.",
                        },
                      },
                    },
                    uncertain: [
                      {
                        // Neutral base slightly better than a coin flip, matching the node's own
                        // outcome text ("real odds of extracting a meaningful fraction") without
                        // overstating it as a sure thing — the ring is soft, not absent.
                        weight: modWeight(55, meters.fuel),
                        title: "The army marches out",
                        setFlags: { stalingradBreakout: "escaped" },
                        impact: { manpower: 3, fuel: 0, initiative: 0 },
                        outcome:
                          "The order goes out before the ring has fully hardened, and it works, not cleanly, not without cost, but Sixth Army comes out of the pocket as an army rather than a surrender roll three months later. What Paulus actually requested, and was actually refused, here gets the chance the real war never tested it against.",
                      },
                      {
                        weight: 100 - modWeight(55, meters.fuel),
                        title: "The column is run to ground",
                        setFlags: { stalingradBreakout: "destroyed" },
                        next: "easternCollapse1943",
                        impact: { manpower: -4, fuel: -1, initiative: -1 },
                        outcome:
                          "The fuel arithmetic that would strand Manstein's own relief column three weeks later catches this breakout earlier and just as completely: a column in the open, without the pocket's own perimeter to fall back on, is not obviously safer than a fortress that at least has walls. What's left of Sixth Army is run down in the snow rather than starved in the ruins, a worse end reached by a different road, and Army Group South's line loses the same divisions either way.",
                      },
                    ],
                  }
                : {}),
            },
            meters.manpower <= -4
              ? {
                  label: "Resupply by air; hold in place",
                  advisor: { name: "Göring", position: "The Luftwaffe will supply the fortress, and the Führer has been given his word." },
                  historical: true,
                  setFlags: { stalingrad: "airlift", pathVariant: "earlyCollapse" },
                  impact: { manpower: -3, fuel: -2, initiative: -1 },
                  next: "easternCollapse1943",
                  outcome:
                    "The historical choice, but arriving here with manpower already this depleted, the loss of Sixth Army isn't an isolated disaster the front can absorb the way it did historically. The airlift delivers exactly what the Luftwaffe's honest assessment predicted, a fraction of the minimum, and when the pocket falls, Army Group South's line goes with it. There's no scaled-back Kursk to fight this time; the eastern front effectively collapses in early 1943, more than two years ahead of the real war's ending.",
                }
              : {
                  label: "Resupply by air; hold in place",
                  advisor: { name: "Göring", position: "The Luftwaffe will supply the fortress, and the Führer has been given his word." },
                  historical: true,
                  setFlags: { stalingrad: "airlift" },
                  impact: { manpower: -3, fuel: -2, initiative: -1 },
                  next: "backhandBlow43",
                  outcome:
                    "The historical choice. Göring promised 500 tons a day; the airlift averaged closer to 100, against a stated minimum of 500-700, and the Luftwaffe lost nearly 500 transport aircraft trying, a fleet it never rebuilt. Sixth Army surrendered in February 1943: roughly 91,000 survivors of the encircled quarter-million marched into captivity, of whom perhaps 5,000 ever came home. The estimate that mattered, deliverable tonnage, was known internally to be fantasy before the decision was made.",
                },
            {
              label: "Order an early withdrawal before the pocket forms",
              advisor: { name: "Manstein", position: "The Volga is not worth an army, nor is anything else on this map, and the army should be withdrawn while the word still means something." },
              setFlags: { stalingrad: "early" },
              favor: 2,
              impact: { manpower: 4, fuel: 1, initiative: -1 },
              next: "reconstituted",
              outcome:
                "Would mean abandoning Stalingrad before Uranus closes: politically unthinkable to Hitler given the city's name, but militarily the option that best preserved Sixth Army as a fighting force for the rest of the war. Every option in this campaign that requires Hitler to accept a visible retreat carries the same asterisk: correct on the merits, unreachable in the real command structure.",
            },
          ],
        };
        },
        get easternCollapse1943() {
          return {
          date: "EARLY 1943",
          title: "The Eastern Front Collapses",
          historicalRecord: false,
          situation:
            "The compounding losses since 1941 leave Sixth Army's destruction the blow the front can't absorb. Army Group South's line disintegrates faster than any historical retreat: this isn't the slow 1943–45 grind of the real war, it's a rout, and the reports arriving hourly can't even agree where the front line currently is. There's no Kursk to fight here and no long buildup to Normandy on the historical terms: the war in the east is effectively lost more than two years before Berlin in fact fell in 1945." +
            (flags.stalingradBreakout === "destroyed" ? keyBattleEcho("stalingrad", flags) : ""),
          choices: [
            {
              label: "Order a fighting withdrawal: try to shorten the line and save what's left",
              advisor: { name: "Manstein", position: "Where this ends can no longer be chosen, only whether an army or a mob arrives there." },
              setFlags: { finalStand: "withdraw" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "END",
              uncertain: [
                {
                  weight: modWeight(65, meters.fuel),
                  title: "The withdrawal holds its shape",
                  impact: { manpower: 1, fuel: 0, initiative: 0 },
                  outcome:
                    "The more defensible choice given the situation, though it changes little about the timeline: the front has already lost the depth to stabilize anywhere short of Germany's own prewar borders, and Soviet forces reach them far sooner than they did historically. What survives, at least, survives as an army.",
                },
                {
                  weight: 100 - modWeight(65, meters.fuel),
                  title: "The rout outpaces the order",
                  impact: { manpower: -2, fuel: 0, initiative: 0 },
                  outcome:
                    "The order to withdraw in good order arrives into a front that has already stopped being one: some formations execute a real fighting retreat, others simply dissolve, and from Stavka's side of the map the two look identical by the time the reports arrive. A rout this total doesn't wait for permission to be a rout.",
                },
              ],
            },
            {
              label: "Hold in place as ordered: no withdrawal",
              advisor: { name: "Keitel", position: "The Führer's order is unambiguous: every position holds." },
              setFlags: { finalStand: "hold" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "END",
              outcome:
                "Consistent with how Hitler actually responded to bad news on this front throughout the war: every real stand-fast order of the historical retreat, applied here to a collapse two years earlier and total in a way the actual 1943–45 withdrawal never was. There is no fighting withdrawal to write an uncertain outcome for, because none was ordered: encircled, immobile formations get destroyed in place rather than fought with, army by army, on a timetable this campaign didn't invent, only moved forward. What ends here isn't a battle. It's the war in the east, roughly two years before Berlin in fact fell.",
            },
          ],
        };
        },
        // Round 26 (item 1): the German winter of 1943, which had no report between the end of Stalingrad and Kursk. Facts
        // checked 2026-10-08 (Wikipedia, Third Battle of Kharkov).
        get backhandBlow43() {
          return {
          date: "FEBRUARY – MARCH 1943",
          title: "The Backhand Blow",
          historicalRecord: true,
          situation:
            "Sixth Army has surrendered, and the Red Army has not stopped: Kursk, Belgorod and Kharkov have been retaken by spearheads that have run a long way ahead of their fuel and their reserves, and the divisions in front of Manstein's army group average three or four thousand men. Hausser's SS Panzer Corps was ordered to hold Kharkov to the last man, and left it on February 15 rather than lose the corps, against Hitler's order. Hitler has come to Army Group South's headquarters, and has been shown a map. Manstein wants the freedom to give up ground, and then to strike the Soviet spearheads in the flank when their fuel is gone; the Führer's order is that no more ground is to be given at all. The thaw will come within weeks." +
            (flags.med42 === "defensive"
              ? " The divisions kept out of the Mediterranean last spring are in the southern line, and Manstein has more to work with than his predecessors in a winter like this one."
              : "") +
            (meters.fuel <= -2
              ? " The fuel for a counterblow is thin, and Manstein's own staff know it; whatever is attempted has to be done with what is already in the tanks."
              : ""),
          choices: [
            {
              label: "Give up ground, then strike the over-extended spearheads in the flank: the backhand blow",
              advisor: { name: "Manstein", position: "A front forbidden to bend can only break, and one that is allowed to give ground can be used to draw the Soviet armies on until they are out of fuel and then to cut them off." },
              historical: true,
              setFlags: { backhand43: "strike" },
              impact: { manpower: -1, fuel: -1, initiative: 2 },
              next: "blackMay",
              // Round 26 (item 1). The Third Battle of Kharkov, 19 February to 15 March 1943. Facts checked 2026-10-08
              // (Wikipedia, Third Battle of Kharkov): Manstein's "backhand" counterattack on the over-extended Soviet
              // spearheads; II SS Panzer Corps under Hausser (the 1st, 2nd and 3rd SS Panzer Divisions), Hoth's 4th Panzer
              // Army and Mackensen's 1st Panzer Army, 120,000 to 130,000 men and about 350 tanks against Soviet divisions
              // averaging 3,500 to 4,000 men; Hausser left Kharkov on 15 February against Hitler's order to hold it; the
              // 1st Panzer Army surrounded Popov's Mobile Group by 24 February; Fourth Air Fleet's sorties rose from an
              // average of 350 in January to 1,000 in February; the direct assault on Kharkov was ordered on 10 March,
              // with house-to-house fighting from the 11th to the 15th, when the Leibstandarte took it; Belgorod was
              // retaken the next day or soon after; the spring thaw (rasputitsa) and fuel shortages threatened the
              // operations of both sides.
              keyBattleSubgame: {
                id: "kharkovBackhand43",
                title: "Order of Battle: Manstein's Backhand Blow",
                flavor:
                  "The Soviet winter offensive has run out of fuel and men at the end of a long advance, and Manstein has been given the freedom to do what he always wanted: give ground, let the Soviet spearheads run on, and strike them in the flank. Hausser's SS Panzer Corps has already left Kharkov against orders. Hoth's 4th Panzer Army and Mackensen's 1st are gathering to the south, and the Soviet divisions in front of them are down to three or four thousand men each. The thaw is a few weeks away. What's decided here is how the blow is shared between the SS divisions that will go for the city, the panzer armies that go for the flank, the infantry that hold the line while the panzers gather, and the aircraft that have to do the work of the missing artillery.",
                categories: [
                  { id: "ssCorps", name: "II SS Panzer Corps", meter: "manpower" },
                  { id: "panzerArmy", name: "The Panzer Armies", meter: "fuel", strand: "oil" },
                  { id: "infantry", name: "Infantry Holding the Line", meter: "manpower" },
                  { id: "air", name: "Fourth Air Fleet", meter: "initiative" },
                ],
                // The SS corps and the panzer armies carry the blow; the infantry hold the ground it is struck from; the aircraft least.
                effectiveness: { ssCorps: 2.6, panzerArmy: 2.6, infantry: 1.8, air: 1.8 },
                orderOfBattle: {
                  ssCorps: {
                    units: [
                      "II SS Panzer Corps under Hausser: the Leibstandarte, Das Reich and Totenkopf divisions",
                      "The corps' own reconnaissance and engineer battalions",
                    ],
                    real: "Hausser left Kharkov on 15 February against Hitler's order to hold it, and took the city back on 15 March, when the Leibstandarte entered it after five days of house-to-house fighting.",
                  },
                  panzerArmy: {
                    units: [
                      "The 4th Panzer Army (Hoth), with XLVIII Panzer Corps",
                      "The 1st Panzer Army (Mackensen), which had to strike the Soviet spearheads from the south",
                    ],
                    real: "The 1st Panzer Army surrounded Popov's Mobile Group by 24 February. Both armies were short of fuel, and the thaw was coming.",
                  },
                  infantry: {
                    units: [
                      "The infantry divisions on the line of the Donets, holding ground while the panzers gathered behind them",
                      "The security and rear-area units pulled forward to take over quiet stretches of the front",
                    ],
                    real: "The Soviet divisions in front of them averaged 3,500 to 4,000 men. The German line held in places and bent in others while Manstein got his armour into position.",
                  },
                  air: {
                    units: [
                      "Fourth Air Fleet over the southern front",
                      "The Ju 87 dive-bomber groups, which were often the only artillery the panzers had",
                    ],
                    real: "The Fourth Air Fleet's sorties rose from an average of 350 in January to 1,000 in February, and gave the Germans control of the air in the south.",
                  },
                },
                hardRule: { text: "Hitler's order of the middle of February stands: Kharkov is to be held at all costs, and no ground is to be given on the way to the counterattack.", noGiveGround: true },
                conditions: "The end of a Ukrainian winter, with hard frost at night and the first thaw by day, and roads that are firm in the morning and mud by the afternoon.",
                terrainModifiers: { panzerArmy: 0.9 },
                terrainNotes: { panzerArmy: "the first thaw on the roads" },
                attrition: [
                  { category: "panzerArmy", atLeast: 3, meter: "fuel", delta: -1, reason: "The panzer armies run short of fuel in the thaw" },
                ],
                // Field decision: the way into Kharkov itself. Facts: the 4th Panzer Army ordered a direct assault on
                // the city on 10 March, and the fighting in the streets lasted from the 11th to the 15th. The three
                // answers are the options before the commanders; the payoff against each Soviet setup is modeled.
                decisions: [
                  {
                    id: "theCityItself",
                    time: "1500",
                    title: "The city itself",
                    prompt: "The Soviet spearheads have been cut off and the flank is open, and the SS divisions are at the edge of Kharkov. A direct assault will cost them dearly, and going round the city will give the garrison time to dig in.",
                    options: [
                      {
                        id: "straightIn",
                        name: "Storm the city from the north and west at once",
                        note: "Fastest, and the most expensive in men.",
                        bonus: 0,
                        bonusByPosture: { spearheadsSpent: 3, reservesComing: -3, moppingUp: 2 },
                        meters: { manpower: -1 },
                        costReason: "Street fighting for a city",
                        reportLine: "The SS divisions go straight into the city from the north and west.",
                      },
                      {
                        id: "goRound",
                        name: "Go round the city and cut it off from the east",
                        note: "Saves men, and needs fuel the panzers do not have.",
                        bonus: 0,
                        bonusByPosture: { spearheadsSpent: -1, reservesComing: 2, moppingUp: -2 },
                        reportLine: "The armour swings east of the city to cut the roads out of it.",
                      },
                      {
                        id: "waitForTheGuns",
                        name: "Hold at the edge and bring up the guns",
                        note: "A slower and surer assault, with the thaw getting nearer.",
                        bonus: 0,
                        bonusByPosture: { spearheadsSpent: 0, reservesComing: 3, moppingUp: -3 },
                        reportLine: "The assault is held at the edge of the city while the guns are brought up.",
                      },
                    ],
                  },
                ],
                categoryContext: {
                  ssCorps:
                    "The SS divisions are the best-equipped formations in the south, and they have already taken the decision to leave Kharkov once. Each commitment here puts more of them into the attack on the city and the flank, and fewer into holding what they have.",
                  panzerArmy:
                    "The panzer armies are to strike the Soviet spearheads from the south and cut them off from their own side. Each commitment here puts more tanks and fuel into the flank blow while the roads will still bear them.",
                  infantry:
                    "The infantry hold the line the blow is struck from, against Soviet divisions that are weak but still attacking. Each commitment here puts more of the divisions in the line and fewer of them behind it.",
                  air:
                    "The Fourth Air Fleet gives the panzers the cover and the fire the artillery cannot. Each commitment here puts more of its groups over the roads and the Soviet columns.",
                },
                flashups: {
                  ssCorps: [
                    "A battalion of Panzergrenadiers rides forward on half-tracks into the northern suburbs.",
                    "A Tiger company of the Leibstandarte clears a road block on the way into the city.",
                    "SS engineers blow a hole in the wall of a factory yard.",
                    "A Panzer IV is hit in a side street and its crew bails out under fire.",
                    "The 2nd SS Panzer Division takes the high ground to the west and looks down on the city.",
                  ],
                  panzerArmy: [
                    "A column of tanks turns north off the Donets road in the first light.",
                    "A tank company halts on a ridge to wait for its fuel truck.",
                    "The leading tank of a panzer regiment reports the Soviet column it has come on is out of fuel.",
                    "A panzer division crosses a frozen river just before the ice goes soft.",
                    "A staff car with a corps commander drives along the column and tells it to hurry.",
                  ],
                  infantry: [
                    "A company of infantry holds a village against a Soviet attack in the snow.",
                    "A battalion takes over a long stretch of the line from a division that has been ordered away.",
                    "A regiment digs in on the reverse slope of a ridge and waits.",
                    "A column of ammunition carts arrives at the line at dusk.",
                    "A platoon of infantry rides on the back of an assault gun into a village.",
                  ],
                  air: [
                    "Stukas dive on a Soviet tank column that has halted on the road.",
                    "German fighters drive off a flight of Il-2s heading for the panzers.",
                    "A reconnaissance aircraft finds a column of Soviet tanks without fuel.",
                    "A bomber group attacks the railway at a junction behind the Soviet spearhead.",
                    "A flight of Ju 52s drops supplies to a battalion cut off in a village.",
                  ],
                },
                reportTimes: { open: "0600", contact: "0800", cats: ["1000", "1200", "1400", "1600"], reserve: "1800", counter: "2000" },
                idleLines: {
                  ssCorps: [
                    "The SS divisions are held where they stand, and they are not sent into the city.",
                    "No more of the SS corps goes forward, and the attack is made with the divisions already committed.",
                  ],
                  panzerArmy: [
                    "The panzer armies are not pushed, and the Soviet spearheads are left to run on.",
                    "No more tanks go into the flank blow, and the roads are used by supply columns instead.",
                  ],
                  infantry: [
                    "The infantry are left to hold the line with what they have, and no more divisions are sent to them.",
                    "No reinforcements go to the front line, and its thin stretches are left thin.",
                  ],
                  air: [
                    "The Fourth Air Fleet flies what it was already flying, and nothing more.",
                    "No extra aircraft go over the roads, and the panzers move under whatever cover they have.",
                  ],
                },
                verdicts: ["Kharkov Is Retaken", "The Counterblow Runs Out of Road"],
                verdictGrades: {
                  clean: "The flank blow and the assault on the city went in together, and the Soviet spearheads were cut off and Kharkov was taken.",
                  costly: "Kharkov is retaken and the spearheads are cut off, but the SS divisions that did it are worn down.",
                  marginal: "The flank blow cuts off part of the Soviet force and the city is not taken before the thaw.",
                  total: "The counterblow does not reach the Soviet spearheads, and the thaw brings it to a halt in front of the city.",
                },
                counterattack: {
                  category: "infantry",
                  severity: { spearheadsSpent: 0, reservesComing: 2, moppingUp: 1 },
                  warn: {
                    1: "Soviet tanks that were thought finished are attacking the line from the east.",
                    2: "Fresh Soviet reserves have arrived on the Donets and are attacking the flank of the counterblow in strength.",
                  },
                  results: {
                    repulsed: "The Soviet attack on the flank is beaten off, and the counterblow goes on.",
                    heldAtCost: "The flank holds against the Soviet attack, at a heavy cost in the infantry that held it.",
                    broke: "The Soviet tanks break into the flank of the counterblow, and the panzers have to turn to meet them.",
                    gaveGround: "The line on the flank gives ground, and the counterblow has to be narrowed to protect it.",
                  },
                },
              },
              outcome:
                "What happened. Hitler agreed, and from February 19 the counterblow went in: the 4th Panzer Army and the 1st Panzer Army hit the Soviet spearheads from the south, and the 1st Panzer Army had surrounded Popov's Mobile Group by February 24. The Fourth Air Fleet's sorties rose from an average of 350 in January to 1,000 in February. The SS divisions went into Kharkov on March 10, after a direct assault was ordered, and the city was retaken on March 15 after five days of street fighting; Belgorod followed within two days. The Germans lost about 11,500 men in the SS corps alone and the Soviet side about 86,000. It was the last great German victory in the East, and the thaw ended it.",
              uncertain: [
                  {
                    weight: modWeight(70, meters.fuel),
                    title: "Kharkov is retaken",
                    setFlags: { kharkovResult: "retaken" },
                    impact: { manpower: -1, fuel: -1, initiative: 2 },
                    outcome:
                      "The historical result, on the plan Manstein wanted. From February 19 the 4th Panzer Army and the 1st Panzer Army hit the Soviet spearheads from the south, and the 1st Panzer Army had surrounded Popov's Mobile Group by February 24. The SS divisions went into Kharkov on March 10 and the Leibstandarte took the city on March 15, after five days of street fighting; Belgorod followed within two days. The Germans lost about 11,500 men in the SS corps and the Soviet side about 86,000. It was the last great German victory in the East, and the thaw ended it.",
                  },
                  {
                    weight: 100 - modWeight(70, meters.fuel),
                    title: "The counterblow runs out of road",
                    setFlags: { kharkovResult: "stalled" },
                    impact: { manpower: -2, fuel: -1, initiative: 1 },
                    outcome:
                      "Speculative. The flank blow cuts off part of the Soviet force and then stops: the panzers are short of fuel, the roads are going soft, and the SS divisions stand at the edge of Kharkov without the strength to take it before the thaw. The Soviet armies, which were out of fuel themselves, dig in on the line they have reached. The front is held, but the city stays in Soviet hands through the spring and the front that Manstein hoped to straighten is as crooked as it was.",
                  },
              ],
            },
            {
              label: "Hold every position, as the Führer orders: no more ground until the spring",
              advisor: { name: "Hitler", position: "Not another step is to be given, because the ground that is lost in the winter has to be paid for in the summer, and Kharkov has to be held." },
              setFlags: { backhand43: "hold" },
              impact: { manpower: -3, fuel: 0, initiative: -2 },
              next: "blackMay",
              outcome:
                "Not what happened: in the real war Hausser disobeyed the order. Here it is carried out, and the SS Panzer Corps is left in Kharkov with the Soviet armies on three sides. The panzer armies cannot gather for a flank blow because every division is tied to the line it was told to hold, and the Soviet spearheads, short of fuel as they are, are not given the opening that would have destroyed them. The corps is surrounded in the city, and what comes out of it is a fraction of what went in. The front south of Kharkov is held, and the army group has nothing left to hit back with.",
            },
          ],
        };
        },
        get blackMay() {
          return {
          date: "MAY 1943",
          title: "Black May in the Atlantic",
          historicalRecord: true,
          situation:
            "The Atlantic has turned, suddenly and totally. In a single month, forty-one U-boats have been lost: against tonnage sunk that no longer remotely justifies it.\n\nDönitz's staff can measure the losses precisely but can only guess at the cause: some combination of escort carriers closing the mid-Atlantic air gap, new centimetric radar the boats can't detect, apparently limitless escort numbers, and something in Allied convoy routing that keeps anticipating wolfpack positions with unsettling accuracy. (That last one was Bletchley Park reading naval Enigma: a possibility B-Dienst assessed and officially dismissed as impossible.) The U-boat arm's casualty rate is on its way to becoming the worst of any service branch in any nation in the war: roughly three in four crewmen will not survive it." +
            (flags.usWar === "declared"
              ? " One ledger entry stands against the gloom: Drumbeat's early-1942 harvest off the American coast, bought by the December declaration, was the arm's high-water mark. It is already a memory."
              : flags.usWar === "withheld"
              ? " And a bitter footnote to the withheld declaration: the boats never got their American hunting season, so the arm arrives at this reckoning without even Drumbeat's harvest behind it."
              : ""),
          choices: [
            {
              label: "Withdraw from the North Atlantic: concede the convoy routes, preserve the crews",
              advisor: { name: "Dönitz", position: "The Battle of the Atlantic has been lost, and that will not be said in public or denied in this room." },
              historical: true,
              setFlags: { atlantic: "withdraw" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "vlasov43",
              outcome:
                "What Dönitz actually did on May 24, 1943, and one of the few clear-eyed loss-cutting decisions of the German war. The Battle of the Atlantic was effectively decided that month: Allied shipping, men, and materiel now cross to Britain at whatever rate American shipyards can launch, and those shipyards are launching Liberty ships faster than any U-boat campaign could ever have sunk them.",
            },
            {
              label: "Continue wolfpack operations: the tonnage war must be won or the West is lost",
              advisor: { name: "Godt", position: "Every month the convoys are conceded, a million tons of war crosses unopposed. The boats exist to sink it or they exist for nothing." },
              setFlags: { atlantic: "continue" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: "atlanticAttrition43",
              outcome:
                "The likely shape of Dönitz's own logic taken past its breaking point: he believed to the end that the tonnage war was the war. Continuing into the teeth of May 1943's conditions feeds trained crews into a technological mismatch the boats cannot survive: every month of continuation is another cohort of the most experienced submariners lost, without moving the Allied buildup curve at all.",
            },
            {
              label: "Withdraw AND redirect the U-boat program: everything into the new Type XXI boats",
              advisor: { name: "Dönitz", position: "The old boats are coffins in this new Atlantic. If the ocean must be left, the return should be in something that can live there." },
              setFlags: { atlantic: "typeXXI" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "kursk",
              outcome:
                "A fair projection of an accelerated version of what partly happened. The Type XXI 'electro-boat' was revolutionary, but its historical program was crippled by exactly the industrial disruption and design-by-committee problems that a 1943 crash program would face under intensifying bombing. Even a best-case acceleration puts meaningful numbers to sea in late 1944 at the earliest, against an anti-submarine system that has been improving the whole time. The honest assessment: this preserves crews and buys a threat-in-being, not a reversal.",
            },
          ],
        };
        },
        get atlanticAttrition43() {
          return {
          date: "SUMMER 1943",
          title: "The Arm Bleeds Out",
          historicalRecord: false,
          situation:
            "The order to continue is obeyed, and the Atlantic keeps its verdict from May regardless of the order: boats sail into an ocean that finds them by radar they can't detect and aircraft that appear from nowhere over the mid-ocean gap. Losses through the summer run at rates the historical withdrawal was specifically issued to stop. Somewhere in Dönitz's own staff, the numbers are being compared to his son's death aboard U-954 in May: a loss the Grand Admiral absorbed in near-silence and never once let show in a war conference." +
            (meters.manpower <= -4
              ? " There is a version of this staff meeting where the numbers alone would have ended it by now. This is not that version."
              : ""),
          choices: [
            {
              label: "Finally order the withdrawal: months later, and months more expensive",
              advisor: { name: "Dönitz", position: "This should have been said in May. It is being said now, without interest in an accounting of what the delay cost, which is already known." },
              historical: false,
              setFlags: { atlanticAttrition43: "withdrawLate" },
              favor: 1,
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "kursk",
              outcome:
                "The withdrawal that always had to come, arriving a full season late. The crews and boats spent in the interval bought exactly nothing the historical record shows the earlier withdrawal didn't already achieve for free: a costly demonstration, if anyone needed one, that Godt's tonnage-war logic had stopped describing the actual war some time before May ended.",
            },
            {
              label: "Hold course to the bitter end: the arm is spent trying to prove the doctrine right",
              advisor: { name: "Godt", position: "One catastrophic month is no reason to abandon the doctrine. It should be abandoned when it stops being the war's answer, and that has not yet been shown." },
              setFlags: { atlanticAttrition43: "holdCourse" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: "kursk",
              outcome:
                "The doctrine is proven wrong by the only means that ever really proves a doctrine wrong: total exhaustion. By the time the boats stop sailing in numbers, there are simply not enough trained crews left to argue the point further. The U-boat arm's historical casualty rate, roughly three in four men lost, is not a ceiling on this path. It is closer to a floor.",
            },
          ],
        };
        },
        get reconstituted() {
          return {
          date: "1943",
          title: "A Reconstituted Southern Front",
          historicalRecord: false,
          situation: `Sixth Army wasn't lost at Stalingrad in this timeline: its survivors, reorganized, give the southern front real divisions the historical record never had at this point. Fuel reserves are ${
            meters.fuel <= -2 ? "critically low" : meters.fuel <= 0 ? "thin" : "holding steady"
          }. Two live problems compete for those divisions: the salient at Kursk, where air reconnaissance shows Soviet fortification on a scale nobody has seen before, and Italy, where every intelligence channel agrees an armistice is coming: the estimates disagree only on whether it's weeks or months away.` +
            (flags.stalingradBreakout === "escaped" ? keyBattleEcho("stalingrad", flags) : ""),
          choices: [
            {
              label: "Reinforce Kursk: launch a larger Operation Citadel with the extra divisions",
              advisor: { name: "Zeitzler", position: "The salient is an invitation, and with the divisions saved from the Volga it becomes one that can finally be afforded." },
              setFlags: { southernFront1943: "reinforceKursk" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "vWeaponsProduction44",
              outcome:
                "Reasoned projection: the Kursk salient's defense-in-depth was built to absorb far more armor than Germany really threw at it historically. Extra divisions likely raise Soviet losses somewhat, but the same minefields, anti-tank gun density, and reserves that stopped the historical Citadel don't stop existing just because more tanks arrive: this still ends as an attritional loss, only a larger one.",
            },
            {
              label: "Skip Kursk entirely: hold the extra divisions in elastic defense",
              advisor: { name: "Manstein", position: "One army was saved from one fortress, and it should not be fed into a minefield with better publicity." },
              setFlags: { southernFront1943: "elasticDefense", preservedReserve: true },
              impact: { manpower: 2, fuel: 1, initiative: 0 },
              next: "vWeaponsProduction44",
              outcome:
                "The strongest preservation option available on this branch. No offensive means no offensive losses, and the reconstituted divisions sit in reserve rather than being spent: at the cost of ceding the initiative to the Red Army even more completely than the historical defensive-minded critics of Citadel wanted.",
            },
            {
              label: "Redirect the divisions to pre-emptively secure Italy ahead of its expected armistice",
              advisor: { name: "Kesselring", position: "Italy will change sides and only the date is in dispute. Divisions positioned before the announcement are worth three sent after it." },
              setFlags: { southernFront1943: "italyRedirect" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "vWeaponsProduction44",
              outcome:
                "Historically, Germany did have to rush divisions into Italy after its September 1943 armistice (Operation Achse) to disarm Italian forces and hold the peninsula. Getting ahead of that here is plausible and addresses a real problem, but it does nothing for the eastern front, where Kursk proceeds at the historically reduced scale regardless.",
            },
          ],
        };
        },
        get vlasov43() {
          return {
          date: "1943",
          title: "The Vlasov Question",
          historicalRecord: false,
          situation:
            "Andrey Vlasov (a Soviet general captured after his army's collapse at Volkhov last summer, and by any honest reading one of the more capable commanders the Red Army has fielded) has offered something no defector before him has: not just himself, but a political argument for turning captured and disaffected Soviet soldiers into an actual army against Stalin. Real numbers of prisoners and deserters already exist to draw from" +
            (flags.eastFront === "kiev"
              ? ": the encirclement pocket the 1941 campaign chose to close at Kiev rather than push straight for Moscow is a meaningful share of exactly this pool."
              : flags.eastFront === "moscow"
              ? ", though a smaller pool than the encirclement-heavy version of 1941 would have produced: the drive on Moscow that autumn took ground, not prisoners in Kiev's numbers."
              : "") +
            ". What doesn't exist yet is agreement inside this command about what Vlasov's movement should actually be. Himmler's doctrine holds that arming large Slavic formations at all is ideologically unthinkable regardless of the manpower math. Others argue the war has reached a point where that math is the only argument this staff can still afford to lose.",
          choices: [
            {
              label: "Keep Vlasov as propaganda only: a name and a newspaper, no real command of troops",
              advisor: { name: "Himmler", position: "Germany is not so desperate as to arm the very people the war was fought to subordinate. His face on a leaflet costs nothing, but at the head of a division it costs the point of fighting at all." },
              historical: true,
              setFlags: { vlasov43: "propaganda" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "kursk",
              outcome:
                "What actually happened, and for most of the war's remaining length: Vlasov's movement exists mostly on paper and in leaflets dropped over Soviet lines, its actual troops scattered in small units under German command rather than assembled into anything resembling the army he was promised. The formal Russian Liberation Army isn't organized as real divisions until November 1944: too late to matter militarily, in time only to surrender to the Americans rather than fight to the end for a cause that was never given the chance to be tested.",
            },
            {
              label: "Commit to Vlasov's army in earnest: real divisions, real equipment, real command authority",
              advisor: { name: "Vlasov", position: "Give the men already in the camps and deserting at the front, and they become formations that fight Stalin for reasons German troops have stopped believing in. Give nothing, and a resource neither side can afford to waste is wasted." },
              checkLabel: "Initiative",
              disabledReason: meters.initiative <= -3 ? "not enough political standing left to force a departure from doctrine this radical past Himmler's own security services" : undefined,
              setFlags: { vlasov43: "committed" },
              impact: { manpower: 1, fuel: -1, initiative: 0 },
              next: "kursk",
              outcome:
                "Not the historical policy, and a genuine departure from Nazi racial doctrine that costs real political capital inside the regime to force through. Real Russian Liberation divisions, organized now rather than in the war's final months, plausibly free up German manpower elsewhere, though how much of that gain survives contact with the same ideological mistrust that shaped the historical policy in the first place is a question this command's own security services never stop quietly raising.",
              uncertain: [
                {
                  weight: modWeight(45, meters.initiative),
                  title: "The formations hold together under fire",
                  setFlags: { vlasovResult: "holds" },
                  impact: { manpower: 1, fuel: 0, initiative: 0 },
                  outcome:
                    "Whatever the security services warned, the new divisions fight: Soviet propaganda aimed at them lands with noticeably less force than it does on ordinary Ostheer units, and the manpower this frees up elsewhere turns out to be real rather than theoretical.",
                },
                {
                  weight: 100 - modWeight(45, meters.initiative),
                  title: "Himmler's doctrine gets its own vindication, quietly",
                  setFlags: { vlasovResult: "distrusted" },
                  impact: { manpower: 0, fuel: 0, initiative: -1 },
                  outcome:
                    "The formations are stood up, on paper exactly as promised, and then bled of their better officers, split into small units, and watched by security details that never stop treating them as a liability rather than an asset. The manpower gain this choice was supposed to buy mostly evaporates into the same mistrust that shaped the historical policy in the first place.",
                },
              ],
            },
          ],
        };
        },
        get kursk() {
          return {
          date: "1943",
          title: "Kursk: Strike Early or Wait",
          historicalRecord: true,
          situation:
            "A visible Soviet-prepared salient sits at Kursk, and the intelligence problem, this time, isn't finding the enemy: it's believing what you can see. Air reconnaissance and signals intercepts show fortification in depth that exceeds anything previously encountered: minefield densities estimated at up to 2,500 anti-personnel and 2,200 anti-tank mines per kilometer of front in key sectors, anti-tank gun belts arranged in mutually supporting layers, and defensive zones extending back 100 kilometers or more.\n\nManstein wants to strike as soon as possible, before this system finishes maturing. Hitler wants to wait for new Panther tanks to reach strength first, but the Panthers arriving now are breaking down and catching fire in trials, and the workshops can't say when that will stop.\n\nOne thing sits badly under every estimate: the Soviets seem to be expecting this, where, and roughly when. If the plans are leaking, nobody has found the leak." +
            (flags.med42 === "malta"
              ? " One quiet difference from the historical ledger: with Malta taken and the convoy war won, fuel for the assault divisions, unusually, is not the limiting worry."
              : "") +
            (meters.fuel <= -3
              ? " And the largest fact at this conference is the one nobody has written on the map: the fuel for a Citadel-scale armored offensive does not exist. Whatever the merits of striking early or waiting for the Panthers, this year's ledger has already decided the question: the panzer arm can defend, and that is all it can do."
              : "") +
            (flags.vlasovResult === "holds"
              ? " The Vlasov divisions committed this spring are, for whatever it is worth in a battle this size, one formation Soviet political officers can't fully rely on turning."
              : flags.vlasovResult === "distrusted"
              ? " The Vlasov divisions are technically on the order of battle somewhere behind this front, which is close to the only thing that can honestly be said about them."
              : "") +
            (flags.eastFront === "moscow"
              ? " The panzer divisions massing on both shoulders of this salient are, in no small part, the ones the 1941 push for Moscow spent rather than saved: this front has never fully recovered the depth that gamble cost it."
              : flags.eastFront === "kiev"
              ? " The reserve this offensive draws on owes something to 1941's own choice to take the southern prize first rather than gamble everything on Moscow that autumn."
              : "") +
            (flags.forkPanthersFixed
              ? "\n\nOne mechanical variable breaks the other way this time: the worst of the early Panther's engine-fire problem has, unusually, been chased down and fixed in the workshops before a single one goes into action."
              : "") +
            (flags.backhand43 === "hold"
              ? " The SS Panzer Corps that was left to hold Kharkov in the winter is not on the order of battle for this offensive in any form worth the name."
              : flags.kharkovResult === "retaken"
              ? " Kharkov was retaken in March, and the salient this conference is looking at exists because that counterblow stopped where the thaw stopped it."
              : flags.kharkovResult === "stalled"
              ? " The counterblow at Kharkov ran out of road in March before the city was retaken, and the front south of the salient has not been straightened."
              : "") +
            keyBattleEcho("kharkovBackhand43", flags),
          choices: (() => {
            const offensivePossible = meters.fuel > -3;
            const base = [];
            base.push({
              checkLabel: "Matériel",
              disabledReason: offensivePossible ? undefined : "insufficient fuel for a Citadel-scale armored offensive",
              label: "Strike now, in spring, with the tanks already on hand",
              advisor: { name: "Manstein", position: "Every week spent rehearsing is a week they dig. Attack in May and the defenses are fought, attack in July and the finished fortress is." },
              setFlags: { kursk: "earlyStrike" },
              favor: 1,
              impact: { manpower: -2, fuel: -1, initiative: 1 },
              next: "kurskBreach43",
              // Hidden-information choice: the situation text says the Soviets "seem to be
              // expecting this" and that nobody has found the leak — concealRoll keeps that
              // compromised picture real for the player too, withholding the odds before the
              // choice. (Round 10: that line used to state the leak as fact, which the German
              // command couldn't have known; rewritten as the suspicion it would actually be.)
              concealRoll: true,
              // Key Battle Subgame prototype (KEY_BATTLE_SUBGAME_ENABLED only — see
              // BATTLE_ALLOCATION_CATEGORIES for the full design rationale, including round 2's
              // swap from Positioning & Intelligence to Supply). Mechanised Armour is the
              // strongest lever here, matching the node's own emphasis on Panther reliability and
              // armored tempo as the battle's real swing factor; Supply (breaching and sustaining
              // a push through the defensive belts' mine density, per the situation text above)
              // is the clear second-strongest, ahead of Air, with Divisions as the baseline.
              // categoryContext supplies the per-category "what does this represent" expansion
              // panel — see BattleAllocationScreen — sourced from the Battle of Kursk order of
              // battle and infobox figures (Wikipedia, cross-checked 2026-09-19); the mine-density
              // figure matches what the situation text above already states, not a new claim.
              // Round 3: these four values raised ~1.8x (see BATTLE_ALLOCATION_CATEGORIES comment)
              // to reach the new, higher clamp on a full commitment; relative ordering unchanged.
              keyBattleSubgame: {
                id: "kursk",
                title: "Order of Battle: The Kursk Salient",
                // Round 4 (Craig: "the opening battle paragraph needs to be more specific to
                // Kursk, maybe mention the weather"). Verified via Wikipedia (Operation Citadel,
                // Rasputitsa, 2026-09-19): the historical offensive was originally slated for
                // early May 1943, and "as the spring rasputitsa (mud) season came to an end in
                // 1943, both the German and Soviet commands considered their plans" — an early
                // strike lands in the tail of that thaw, not clear of it. The region's chernozem
                // soil is specifically what makes the mud so bad (it "acts as a sponge"), and
                // tanks are, factually, "less useful in spring and autumn" than in summer or
                // winter — which is exactly the real logistical tension this choice's own failure
                // branch already dramatizes ("spring ground conditions bog the assault
                // formations... mud and the breakdowns"). This isn't new content, just making the
                // opening paragraph state outright the same risk the mechanics already model.
                flavor:
                  "Early May, and the rasputitsa has only just loosened its grip. Weeks of thaw have turned this region's black chernozem into the kind of mud that swallows road wheels and tank treads alike: tanks are never at their best in the gap between winter's hard ground and summer's dry earth, and this order asks the panzer arm to move through exactly that gap. Before it goes out, the staff wants to know where the weight actually falls against ground and enemy both: which divisions lead, how much of the armored reserve commits while the mud still has a say in it, what the Luftwaffe can put over the breach point, and how much ammunition and engineering effort is set aside just to open a path through what's ahead.",
                effectiveness: { divisions: 1.8, armour: 3, air: 2.2, supply: 2.6 },
                orderOfBattle: {
                  divisions: {
                    units: [
                      "Army Detachment Kempf: III Panzer Corps with two infantry corps, XI and XLII, six infantry divisions in all",
                      "The infantry corps of 4th Panzer Army behind the panzers",
                    ],
                    real: "Kempf's III Panzer Corps crossed the Northern Donets to protect 4th Panzer Army's eastern flank.",
                  },
                  armour: {
                    units: [
                      "4th Panzer Army (Hoth), the main armoured spearhead, with roughly 700 tanks committed",
                      "Panzerkeil formations: Tigers forward, Panzer IIIs, IVs and assault guns fanning to the flanks and rear",
                    ],
                    real: "Hoth had discussed with Manstein, since early May, turning toward Prokhorovka, because he expected large Soviet armoured reserves from the east.",
                  },
                  air: {
                    units: [
                      "Luftflotte 4, under Richthofen until later in 1943",
                      "The Hs 129 tank-busters of Schlachtgeschwader 1",
                    ],
                    real: "Three Soviet air armies, the 2nd, 16th and 17th, were committed, the 2nd and 17th on the southern face, and the Hs 129s inflicted heavy losses on Soviet tanks.",
                  },
                  supply: {
                    units: [
                      "Army engineers clearing mine lanes ahead of the assault, the only documented night activity, on 4/5 July",
                      "The railheads and the mud-bound roads behind the salient",
                    ],
                    real: "The Soviet belts were built around anti-tank ditches and gun emplacements, the Pakfront of mutually covering anti-tank groups, so the engineers' lanes led into prepared defences.",
                  },
                },
                // Round 23: orders from above in the campaign's hard mode (modeled, not documented).
                hardRule: { text: "Hitler insists on a Panzer-led attack with the new Tigers and Panthers in front.", lockApproach: "spearhead" },
                // Round 22. Conditions (the mud is already a terrainModifier below). Field decision: the turn
                // toward Prokhorovka, which Hoth had discussed with Manstein since early May (Wikipedia, Battle of
                // Prokhorovka, as noted on the commander roster). The payoff against each Soviet posture is modeled.
                conditions: "The spring thaw, the rasputitsa, has turned the roads to mud, and the Soviet defence has had months to dig in depth across the salient.",
                decisions: [
                  {
                    id: "prokhorovkaTurn",
                    time: "1200",
                    title: "The turn east",
                    prompt: "The southern pincer has fought its way through the first belts. Hoth has discussed with Manstein since early May whether the SS panzer corps should turn east, toward Prokhorovka, to meet the Soviet armour he expects from that direction, instead of pressing on north toward Oboyan and the link with the northern pincer. The decision cannot wait for a better map.",
                    options: [
                      {
                        id: "turnEast",
                        name: "Turn the SS panzer corps east toward Prokhorovka",
                        note: "Meet the Soviet armour in open ground, away from the strongest belts.",
                        bonus: 0,
                        bonusByPosture: {antiTankFirst: 3, reservesDeep: -3, airForward: 0},
                        reportLine: "The SS panzer corps swings east, toward Prokhorovka, with the Soviet armour somewhere ahead.",
                      },
                      {
                        id: "pressNorth",
                        name: "Keep pressing north on the original axis, through the belts",
                        note: "The plan as written, and the link with the northern pincer.",
                        bonus: 0,
                        bonusByPosture: {reservesDeep: 4, antiTankFirst: -4, airForward: -1},
                        reportLine: "The panzers keep their axis north, driving through the belts toward the link with the northern pincer.",
                      },
                      {
                        id: "haltForAir",
                        name: "Halt for a day to bring the flak and the fighters forward",
                        note: "Costs Matériel, and the Soviet reserves get a day.",
                        bonus: 0,
                        bonusByPosture: {airForward: 4, antiTankFirst: 1},
                        meters: {fuel: -1},
                        costReason: "A day's pause to bring up flak and fighters",
                        reportLine: "The advance halts for a day while the flak and the fighters are brought forward over the front.",
                      },
                    ],
                  },
                ],
                // Round 13, Craig's item #6 ("weather/terrain mechanically matters"). The opening
                // flavor paragraph above already states this as fact, sourced (Wikipedia,
                // Rasputitsa): the offensive lands in the tail end of the spring thaw, and tanks
                // are "less useful in spring and autumn" than on hard or frozen ground. Previously
                // that was scenery the mechanics never touched — Armour's effectiveness was 3,
                // full stop, mud or no mud. This is a static, KNOWN multiplier (unlike the hidden
                // enemy posture) applied in effectiveWeight() — the player can see and plan around
                // it the same way they can read the flavor text, rather than it being one more
                // hidden roll. 0.85 (a 15% cut) is deliberately mild: nowhere near the -0.5 an
                // approach's own tradeoff can apply, since the mud is a condition of the ground,
                // not a doctrine choice, and shouldn't be able to out-punish an actual plan. Omaha
                // gets no equivalent field — its weather cost is already the reason Air's base
                // effectiveness (1.6) is the lowest of that battle's four categories, so adding a
                // second, separate terrain penalty on top would double-count the same historical
                // fact. check-battle-balance.js's weightFor was updated to apply this too.
                terrainModifiers: { armour: 0.85 },
                terrainNotes: { armour: "slowed by the rasputitsa mud" },
                // Round 4 (Craig, mobile playtest: "should be done as a situation report and
                // written in the right perspective — Sir, we have..."). Rewritten as an
                // intelligence officer's spoken report to the commander rather than reference
                // prose — same sourced figures as round 2, word for word on every number, just
                // reframed as dialogue. One correction worth flagging: these are Soviet (enemy)
                // strength estimates, not German strength — "Sir, we have 1.9 million troops"
                // would misstate whose army that figure describes, so each line reports it as
                // "their" / "Soviet" strength, the way a staff officer actually would.
                categoryContext: {
                  divisions:
                    "Reconnaissance and signals intercepts place Soviet strength across the Central and Voronezh Fronts at roughly 1.9 million troops: before counting the reserve armies held entirely out of the initial defense. They're positioned for counterattack after the initial German assault has spent itself, not to hold the line today.",
                  armour:
                    "Soviet armor reserves run to something like 4,900 tanks and self-propelled guns behind these lines. One-third lighter T-60s and T-70s; the rest mostly T-34. Much of it is already dug in as gun emplacements rather than held for maneuver.",
                  air:
                    "Nearly 2,800 Soviet aircraft are massed for this operation: essentially the VVS's entire front-line strength committed to one battle. The Luftwaffe should own the sky over the southern face when the attack opens. How long it holds it remains an open question.",
                  supply:
                    "Defensive belts 130 to 150 kilometers deep guard either side of the salient, backed by upward of 25,000 guns and mortars. Mine densities reach 2,500 anti-personnel and 2,200 anti-tank per kilometer of front: six times what was in front of Moscow in '41.",
                },
                // Round 6 (Craig: "two bars... move backward and forwards... doing flashups of
                // what may have happened"). Short battlefield vignettes drawn during
                // BattleSimulationScreen's animated reveal, weighted toward whichever category
                // the player actually put chits in — see that component. Deliberately a
                // different bar from categoryContext/situation text above: these are illustrative
                // texture for a few real, sourced details already established elsewhere in this
                // node (Tigers leading the wedge, the AT-gun "Pakfront" belts, the minefields, a
                // genuinely contested sky), not new individually-sourced claims — no unit numbers,
                // named officers, or specific events invented here, just plausible generic beats
                // consistent with what the node's own verified text already says.
                // Round 12 (Craig's item #5, "richer dispatch text"): expanded from 3 variants to
                // 5 per category so a replayed battle doesn't keep showing the same handful of
                // lines. Same rule as the original round-6 set: illustrative texture consistent
                // with what this node's own verified text already establishes (Tigers leading
                // the wedge, the Pakfront belts, the minefields, a contested sky) — no new unit
                // numbers, named officers, or specific events invented here.
                flashups: {
                  divisions: [
                    "The infantry pushes into the first trench line, yard by yard.",
                    "A forward company loses cohesion under artillery fire: the line holds anyway.",
                    "Reserves move up behind the lead battalions.",
                    "A trench changes hands twice in an hour before it holds.",
                    "Pioneers clear a communications trench room by room.",
                  ],
                  armour: [
                    "The armored wedge grinds forward, drawing the Pakfront's fire onto its glacis.",
                    "A tank brews up in the antitank belt; the column presses on regardless.",
                    "The spearhead reaches the second defensive line.",
                    "A Tiger's frontal armor shrugs off two hits and keeps closing.",
                    "The column loses momentum picking a way around a minefield's edge.",
                  ],
                  air: [
                    "Stukas work over the gun line ahead of the advance.",
                    "A flight of Soviet ground-attack aircraft catches a column in the open.",
                    "The sky over the breach is contested: neither side holds it for long.",
                    "A dogfight breaks up high overhead; nobody on the ground looks up long.",
                    "Flak claims one of the escort fighters on its second pass.",
                  ],
                  supply: [
                    "Engineers lift another string of mines from the lane ahead.",
                    "An ammunition column finally catches up to the forward companies.",
                    "A fuel truck goes up on a mine meant for something bigger.",
                    "A cleared lane is reseeded by Soviet engineers under cover of dark before dawn.",
                    "The forward dressing station is already short of morphine.",
                  ],
                },
                // Round 10 (Craig's items 2, 3, 5). reportTimes stamp each battle-report line as a
                // dispatch; idleLines replace round 7's out-of-world "No chits went to X" with what
                // an uncommitted arm actually looks like from headquarters; verdicts replace "The
                // Odds Broke Your Way" (game language — and the report no longer shows odds at
                // all, since a general wouldn't know the road not taken). counterattack: the
                // battle's second mid-battle decision. Sourced: Hoth "expected large Soviet
                // armoured reserve forces to arrive from the east" (Wikipedia, Battle of
                // Prokhorovka), and the flank east of his advance was exactly where Kempf's corps
                // was meant to cover him — so the counterattack tests Divisions (the infantry
                // holding the flank), not Armour. That also means the old all-armour plan is now
                // exposed on the flank, which is the point. Heavier when the Soviet armour was
                // held deep (reservesDeep), since that reserve IS the counterattack.
                reportTimes: { open: "0430", contact: "0515", cats: ["0600", "0730", "0900", "1100"], reserve: "1300", counter: "1500" },
                // Round 12: each idle line is now a small pool, not a single fixed sentence, so
                // an uncommitted arm doesn't read identically on every replay (see BattleSimulationScreen's
                // idleLine picker).
                idleLines: {
                  divisions: [
                    "No infantry behind the tanks. There's nobody to hold what they take.",
                    "The infantry stays in its jump-off trenches. Nothing moves behind the armor.",
                  ],
                  armour: [
                    "The panzers are still in their assembly areas. Nothing is breaking the gun line.",
                    "The tanks sit idling behind the start line, engines running, going nowhere.",
                  ],
                  air: [
                    "No Luftwaffe over the breach. Soviet aircraft have the sky to themselves.",
                    "The airfields behind the line stay quiet all morning.",
                  ],
                  supply: [
                    "No engineers at the minefields. The lanes stay closed.",
                    "The ammunition dumps stay put. Nothing moves forward to feed the attack.",
                  ],
                },
                verdicts: ["The Breach Is Open", "The Attack Bogs Down"],
                // Round 13, item #1: quality-graded subtitle under the verdict heading — see
                // computeBattlePlanCosts's grade comment for exactly what earns which label.
                verdictGrades: {
                  clean: "Every arm did its job at once, and the line simply gave way.",
                  costly: "The breach is open, but it cost more than the plan allowed for.",
                  marginal: "The attack stalls a yard short of the wire. The plan held up; the day didn't.",
                  total: "The attack doesn't stall so much as come apart.",
                },
                counterattack: {
                  category: "divisions",
                  severity: { antiTankFirst: 1, airForward: 1, reservesDeep: 2 },
                  warn: {
                    1: "Soviet tank brigades are coming in against the right flank of the breach.",
                    2: "The Soviet tank armies held back east of the salient are coming in against the right flank, in strength.",
                  },
                  results: {
                    repulsed: "The flank holds. The Soviet tanks are thrown back with heavy losses.",
                    heldAtCost: "The flank holds, just, and the infantry on it are badly cut up.",
                    broke: "The Soviet tanks break into the flank before anyone can stop them.",
                    gaveGround: "The flank pulls back and gives up ground to keep the line intact.",
                  },
                },
              },
              uncertain: [
                {
                  // Historical Divergence Mode: forkPanthersFixed nudges this same roll rather
                  // than adding a separate branch — the mud-and-breakdowns failure mode below
                  // explicitly cites Panther engine fires as part of what tips it, so a fixed
                  // reliability problem is a legitimate thumb on this exact scale. Same pattern
                  // established by forkEastAfricaSlow (italy).
                  weight: modWeight(50, meters.fuel) + (flags.forkPanthersFixed ? 15 : 0),
                  title: "The incomplete fortress",
                  setFlags: { kurskResult: "breach" },
                  impact: { manpower: 0, fuel: 0, initiative: 1 },
                  outcome: flags.forkPanthersFixed
                    ? "The spring attack catches the defensive system with its third belt unfinished and its armored reserves not yet assembled, and, without the engine fires historically thinning the panzer regiments before they even reached contact, the salient's neck is pinched at costs the panzer force can actually bear. Not a war-turning victory, the Red Army's depth absorbs even this, but the panzer reserve survives the year as a fighting force, which the historical July attack cannot say. Manstein's clock argument, vindicated twice over, and now there is a real question of what to do with the opening it bought."
                    : "The spring attack catches the defensive system with its third belt unfinished and its armored reserves not yet assembled, and the salient's neck is pinched at costs the panzer force can actually bear. Not a war-turning victory, the Red Army's depth absorbs even this, but the panzer reserve survives the year as a fighting force, which the historical July attack cannot say. Manstein's clock argument, vindicated, and now there is a real question of what to do with the opening it bought.",
                },
                {
                  weight: 100 - (modWeight(50, meters.fuel) + (flags.forkPanthersFixed ? 15 : 0)),
                  title: "The mud and the breakdowns",
                  setFlags: { kurskResult: "bogged" },
                  impact: { manpower: -2, fuel: 0, initiative: 0 },
                  outcome: flags.forkPanthersFixed
                    ? "Spring ground conditions bog the assault formations exactly as the wait-faction warned, and the 'incomplete' defenses turn out to have been complete enough: the fixed engine problem spares the panzer force one specific failure mode, but not the mud, and not the belts that were finished after all. The offensive is broken off with the panzer reserve bloodied for even less than the historical battle bought."
                    : "Spring ground conditions bog the assault formations exactly as the wait-faction warned, the early-production Panthers shed engines and catch fire at rates even worse than their historical July debut, and the 'incomplete' defenses turn out to have been complete enough. Historians who argue the early strike was a mirage, that ANY attack into that salient fails, get their evidence. The offensive is broken off with the panzer reserve bloodied for even less than the historical battle bought.",
                },
              ],
            });
            base.push({
              checkLabel: "Matériel",
              disabledReason: offensivePossible ? undefined : "insufficient fuel for a Citadel-scale armored offensive",
              label: "Wait for the Panthers, launch in July as planned",
              advisor: { name: "Hitler", position: "The new weapons will decide it, so the attack must not fail and therefore must not go before the Panthers are ready." },
              historical: true,
              setFlags: { kursk: "attack" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "twoFires1943",
              outcome:
                "The wait let the Red Army deepen the most heavily mined, most heavily fortified defensive system it had ever built: every week of delay made the reconnaissance photos worse. Losses in armor and veteran crews were severe, dozens of the new Panthers were lost to breakdowns and fires before reaching the enemy, and the battle effectively ended German strategic offensive capacity in the east for the rest of the war.",
            });
            base.push({
              label: "Cancel the offensive entirely; shift to elastic defense",
              advisor: { name: "Guderian", position: "Whether Kursk is worth attacking at all this year is open to doubt, and he puts that to Hitler directly." },
              attested: { by: "Guderian", text: "How many people do you think even know where Kursk is?", source: "Guderian, Panzer Leader (1952), his account of the conference with Hitler in early May 1943" },
              setFlags: { kursk: "cancelDefend", preservedReserve: true },
              favor: 1,
              impact: { manpower: 2, fuel: 1, initiative: 0 },
              next: "twoFires1943",
              outcome: offensivePossible
                ? "Guderian's actual argument, nearly verbatim. A pure defensive posture preserves the panzer reserve rather than spending it against prepared positions, at the cost of permanently ceding the initiative to the Red Army. Most commanders still argued for some version of the attack, which is worth remembering when weighing how 'obvious' the right answer looks from here."
                : "Guderian's argument, adopted here by the fuel ledger rather than by persuasion: with stocks this depleted there was never an offensive to cancel, only a defensive posture to organize well or badly. The one mercy of resource exhaustion is that it forecloses the mistakes as thoroughly as the opportunities.",
            });
            return base;
          })(),
        };
        },
        get kurskBreach43() {
          return {
          date: "MAY 1943",
          title: "The Breach",
          historicalRecord: false,
          situation:
            (flags.kurskResult === "breach"
              ? "The salient's neck is pinched, its third defensive belt still unfinished when the panzer spearheads reach it. For a handful of days, something the historical July offensive never achieved is real: open ground, a defense still assembling its depth, and reserves that haven't arrived yet. It will not last, the Red Army's own reserves are already moving to close it, but for now the choice is real: push through while the gap exists, or take what's already been won and pull back before those reserves arrive."
              : "The spring offensive is broken off: mud, mechanical failure, and defenses that turned out to be complete enough have settled the question before it could really be asked. There is little left to decide here except how cleanly the withdrawal is managed.") +
            (flags.forkPanthersFixed && flags.kurskResult === "breach"
              ? " The panzer regiments running this exploitation are, notably, not the ones losing tanks to engine fires the way the historical battle's early Panther units did: whatever this offensive runs out of first, it won't be armor lost to its own machinery."
              : "") +
            // Round 10 (item 8): how the Order of Battle was fought, if it was (dev build only).
            keyBattleEcho("kursk", flags),
          choices:
            flags.kurskResult === "breach"
              ? [
                  {
                    label: "Push through the gap: commit the reserve before it closes",
                    advisor: { name: "Manstein", position: "This is the entire argument for striking early, made physical. Not spending the opening now means the early strike was spent for nothing." },
                    setFlags: { kurskBreach: "exploited" },
                    impact: { manpower: -1, fuel: -1, initiative: 1 },
                    next: "twoFires1943",
                    uncertain: [
                      {
                        weight: modWeight(35, meters.fuel),
                        title: "The breach widens",
                        impact: { manpower: 1, fuel: -1, initiative: 1 },
                        next: "kurskAftermath43",
                        outcome:
                          "The push pays off beyond the cautious case: the gap widens before Soviet reserves can seal it, and a meaningful slice of the salient's defenders are cut off rather than merely mauled. It is the single best tactical result the eastern war reaches anywhere on this campaign that doesn't require a rare diplomatic roll to unlock: bought entirely by a general willing to spend a fragile advantage before it could evaporate. What OKW does with a genuine eastern success, a rare one, is its own question.",
                      },
                      {
                        weight: 100 - modWeight(35, meters.fuel),
                        title: "The reserves arrive anyway",
                        impact: { manpower: -2, fuel: 0, initiative: 0 },
                        outcome:
                          "The push runs into exactly what Soviet planning intended it to run into: fresh reserves arriving on schedule to seal a gap their own defense-in-depth doctrine assumed would open somewhere. The exploitation costs more than the early strike's opening advantage was worth: a reminder that this campaign's deepest lesson about overextension applies even to earned advantages, not just reckless ones.",
                      },
                    ],
                  },
                  {
                    label: "Consolidate: bank the win, withdraw before the reserves close the gap",
                    advisor: { name: "Model", position: "A window was given, not a door. Take the prisoners and the guns already in hand and be satisfied that the moment was chosen at all." },
                    setFlags: { kurskBreach: "banked" },
                    impact: { manpower: 1, fuel: 0, initiative: 0 },
                    next: "twoFires1943",
                    outcome:
                      "The disciplined answer: the tactical win from the early strike is banked rather than gambled forward, the panzer reserve withdraws intact, and the offensive ends as a clean, moderate success instead of a coin flip for a larger one. Less dramatic than pushing further, and the more repeatable kind of victory this war rarely offered.",
                  },
                ]
              : [
                  {
                    label: "Withdraw in good order: take the time to bring out the wounded and the salvageable equipment",
                    advisor: { name: "Manstein", position: "The attempt failed, which is not the same as failing to learn from it. Get the survivors out cleanly and everything worth keeping with them." },
                    setFlags: { kurskWithdrawal43: "clean" },
                    impact: { manpower: 1, fuel: -1, initiative: -1 },
                    next: "twoFires1943",
                    outcome:
                      "The slower option: a deliberate withdrawal that costs fuel and time neither side has much of to spare, in exchange for bringing out wounded who'd otherwise be left and equipment that would otherwise be abandoned to the mud. There is little drama to it, the spring gamble's failure was decided by mud and metallurgy before command judgment could enter into it, but what comes out the other side of this retreat is a formation, not a rout.",
                  },
                  {
                    label: "Break contact fast: leave the slower vehicles and the wounded transport behind",
                    advisor: { name: "Model", position: "A clean retreat and a fast one are different orders, and only one of them is affordable this month." },
                    setFlags: { kurskWithdrawal43: "fast" },
                    impact: { manpower: -1, fuel: 1, initiative: -1 },
                    next: "twoFires1943",
                    outcome:
                      "The faster option, and the harder one to write plainly: a rapid disengagement gets the bulk of the force clear before Soviet reserves can interfere, at a manpower cost the slower withdrawal wouldn't have paid: men and equipment that a few more hours of deliberate movement would have brought out instead. The mud and the metallurgy decided the offensive's failure. This decides who pays for the retreat from it.",
                  },
                ],
        };
        },
        get kurskAftermath43() {
          return {
          date: "JUNE 1943",
          title: "A Rare Eastern Confidence",
          historicalRecord: false,
          situation:
            "A genuine tactical win at Kursk: rare enough on this front by 1943 that it briefly changes the tone of the briefing room rather than just the map. The temptation it creates is exactly the one this campaign has punished at every larger scale: does a real, earned local success argue for pressing the advantage further east, or is the correct lesson that one good week doesn't change what three years of arithmetic have already decided?",
          choices: [
            {
              label: "Press the advantage: commit toward a wider summer offensive while morale actually favors it",
              advisor: { name: "Manstein", position: "Two years of hearing the war cannot be won, and one week of a genuine local victory. Test what the second fact is worth before the first reasserts itself." },
              historical: false,
              setFlags: { kurskAftermath43: "press" },
              favor: 1,
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "expandedOffensive43",
              outcome:
                "The tactical win buys one real thing before the pattern reasserts itself: a genuine choice about how far to spend it, rather than the immediate overextension every other version of this temptation has produced. What that choice is actually worth is the next question: this campaign's deepest operational departure from the historical record on the eastern axis after Kursk itself.",
            },
            {
              label: "Bank it and hold: treat the win as what it is, a good week rather than a turning point",
              advisor: { name: "Model", position: "Two years have produced one good week, and it should be treated as one good week." },
              setFlags: { kurskAftermath43: "hold" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "twoFires1943",
              outcome:
                "The disciplined reading, and the rarer one: the tactical win is banked without being asked to mean more than it does, the line stabilizes on really improved terms, and the front avoids the overextension that a less careful command would have found almost impossible to resist reaching for. It is, on this campaign's own terms, the correct answer nearly every time this exact temptation appears, which is precisely why it is so rarely the one in truth chosen.",
            },
          ],
          };
        },

        get expandedOffensive43() {
          return {
          date: "JULY 1943",
          title: "How Far a Good Week Reaches",
          historicalRecord: false,
          situation:
            "This is the deepest operational departure from the historical record this campaign reaches after Kursk: Germany never actually had a tactical win here to spend, so nothing about what follows is documented, only reasoned forward from real 1943 order-of-battle. The panzer reserve that survived this timeline's early strike is real and forward. So is everything that made every other eastern offensive since 1941 eventually fail: Soviet reserves the intelligence picture never fully counts, a production gap that widens every quarter, and a supply system that was never built for exploitation this deep. Whether those facts still apply isn't in doubt: they do. What's open is how much ground a hard-earned advantage buys before they catch up.",
          choices: [
            {
              label: "Drive on Kursk's railhub approaches: turn a tactical win into an operational one",
              advisor: { name: "Manstein", position: "The argument is over spending an advantage that will not exist next week regardless, so spend it now while the arithmetic still permits the question." },
              setFlags: { expandedOffensive43: "drive" },
              impact: { manpower: -2, fuel: -2, initiative: 1 },
              next: "twoFires1943",
              uncertain: [
                {
                  weight: modWeight(20, meters.fuel),
                  title: "The rare case: the offensive outruns its own expiration date",
                  impact: { manpower: 1, fuel: -1, initiative: 1 },
                  outcome:
                    "The narrow case, stated as narrowly as it deserves: fresh Soviet reserves are still assembling rather than already committed, and the drive reaches meaningfully further than any version of this campaign's eastern offensives has gone since 1941: a real operational gain, not just a tactical one. It does not change the war. Production totals and the reserves still forming behind this gap ensure that. What it buys is a better defensive position for the winter this front is always, eventually, fighting toward.",
                },
                {
                  weight: 100 - modWeight(20, meters.fuel),
                  title: "The likelier case: the arithmetic arrives on schedule",
                  impact: { manpower: -2, fuel: -1, initiative: 0 },
                  outcome:
                    "What every serious accounting of this scenario concludes: the same Soviet reserves that stopped every other eastern ambition since Moscow are already moving, whether or not this year's intelligence has found them yet, and a tactical win at Kursk was never going to change the underlying arithmetic of 1943. The drive stalls into the same overextension this campaign has punished at every larger scale: smaller this time, and no less familiar.",
                },
              ],
            },
            {
              label: "Take the salient's shoulders and stop: a bounded gain, not an open-ended push",
              advisor: { name: "Model", position: "The whole summer was never asked for, only the ground immediately in front, taken cleanly, and then a line that can be held through the winter." },
              setFlags: { expandedOffensive43: "bounded" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "twoFires1943",
              outcome:
                "The disciplined answer to an unresolved question: a bounded objective, taken and then held rather than exploited past what the supply lines and the still-forming Soviet reserves would tolerate. It's a smaller story than the drive's best case, and a more repeatable one: this campaign's real lesson about earned advantages, applied once more at the one scale where applying it costs the least.",
            },
          ],
        };
        },
        get twoFires1943() {
          return {
          date: "SEPTEMBER 1943",
          title: "Two Fires at Once",
          historicalRecord: true,
          situation:
            "Italy has signed an armistice and defected from the Axis. Occupying the peninsula and disarming Italian forces (Operation Achse) needs divisions: the same divisions the Dnieper line in Ukraine needs to keep from buckling under sustained Soviet pressure following Kursk. There isn't a reserve large enough to fully answer both at once.\n\nThis isn't a question of boldness versus caution: it's simply which real, ongoing crisis gets the next available division first, decided on estimates: how fast Italian units will resist or dissolve (unknown), and how long the Dnieper holds unreinforced (your army group commanders say weeks; they have said that before)." +
            (flags.vlasov43 === "committed"
              ? " The Russian Liberation divisions this command chose to organize in earnest are, this month, exactly the kind of reserve that wasn't supposed to exist, not enough to make either fire fully answerable, but enough to make the choice between them slightly less brutal than it would otherwise be."
              : "") +
            (flags.kursk === "cancelDefend"
              ? " The panzer reserve Guderian argued for preserving rather than spending at Kursk is the only reason there's a real division to argue about sending either direction at all."
              : flags.kursk === "attack"
              ? " What's left of the armor that waited for the Panthers and then spent itself against Kursk's defenses in July is not, this month, a reserve either crisis can actually draw on." +
                // Round 13, item #9 (dev build only): a second, later node reacting to HOW the
                // Order of Battle went at Kursk, not just that it happened — a clean breakthrough
                // left more intact by September than a costly one did, and a total collapse left
                // less than the base sentence above already assumes.
                (flags.kurskGrade === "clean"
                  ? " What did come out of the breach came out whole, at least: this isn't quite the empty cupboard it could have been."
                  : flags.kurskGrade === "total"
                  ? " What's left isn't much more than the divisions that never went in at all."
                  : "")
              : ""),
          choices: [
            {
              label: "Prioritize Italy first: secure the peninsula before reinforcing the east",
              advisor: { name: "Kesselring", position: "An unsecured Italy is an Allied highway pointed at the Reich's soft border. The Dnieper is a river and the Alps are a wall, but only if what stands in front of them is held." },
              historical: true,
              setFlags: { priority1943: "italyFirst" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "mussoliniRescue43",
              outcome:
                "Close to what actually happened: pre-positioned forces under Kesselring and Rommel disarmed most Italian units within days of the armistice, a genuine German success. But it meant the Dnieper line got reinforced late, and Soviet forces advanced through Ukraine somewhat faster in the second half of 1943 than they would have with earlier eastern reinforcement.",
            },
            {
              label: "Prioritize the East first: stabilize the Dnieper, manage Italy with what's left",
              advisor: { name: "Manstein", position: "Italy defects with or without German divisions, while the Dnieper holds only with them, so the ranking is not difficult." },
              setFlags: { priority1943: "eastFirst" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "dnieperStabilized",
              outcome:
                "Not the historical choice: Germany's actual response to Italy's armistice was fast and pre-planned. Slowing that down to reinforce Ukraine first plausibly firms up the Dnieper line somewhat, but leaves Italy's occupation less complete and more contested, a problem that lingers on the southern flank rather than being resolved quickly.",
            },
            {
              label: "Split reserves evenly between both fronts",
              advisor: { name: "Jodl", position: "Both fires are real, so half a fire brigade goes to each, and no other arithmetic is available." },
              setFlags: { priority1943: "split" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "vWeaponsProduction44",
              outcome:
                "The same overextension lesson as Case Blue the year before, just as a pure allocation problem rather than an aggressive gamble: a reserve too thin to fully answer either crisis ends up not fully answering either one.",
            },
          ],
        };
        },
        get mussoliniRescue43() {
          return {
          date: "SEPTEMBER 12, 1943",
          title: "Gran Sasso",
          historicalRecord: false,
          situation:
            "Mussolini has been under arrest since the Fascist Grand Council voted him out on July 25th, moved between locations by Badoglio's new government and currently held at a mountaintop hotel on the Gran Sasso massif, reachable only by cable car. Hitler wants him found and extracted, not for any military value the man himself still has, but for what a rescued and reinstalled Duce is worth as a political fact: continued Italian collaboration, a legal fiction of Fascist governance in whatever of the peninsula stays under German control, and a public answer to Badoglio's armistice that isn't simply silence. Otto Skorzeny's commando unit has a plan (a glider assault directly onto the hotel's mountainside, no approach road to secure) that several officers in this room consider closer to a stunt than an operation.",
          choices: [
            {
              label: "Authorize the Gran Sasso raid: rescue Mussolini and install him as head of a reconstituted Fascist state",
              advisor: { name: "Skorzeny", position: "Give the gliders and he will be in Vienna by morning. Give a division instead and the gliders will still be needed." },
              historical: true,
              setFlags: { mussolini43: "rescued" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "italyPartisans",
              outcome:
                "What actually happened: a hundred-odd commandos land by glider directly on the mountainside, and the Italian garrison guarding the hotel doesn't fire a shot. Mussolini is flown out on an overloaded light aircraft that barely clears the ridge on takeoff, delivered to Hitler within days, and installed as nominal head of the Italian Social Republic at Salò: a state with an army, a currency, and almost no independent authority, since German forces run the peninsula's actual military and security decisions regardless of what Salò's ministries claim. Mussolini himself, by every account from those who see him afterward, governs it as a diminished man performing a role rather than exercising power. What the rescue buys is a name to put on Italian collaboration. It does not buy back the Duce who existed before July 25th.",
            },
            {
              label: "Let him be: don't spend the operation, administer northern Italy directly instead",
              advisor: { name: "Rommel", position: "His signature is not needed on occupation orders, and the divisions this raid claims to free up will not be freed either way, so the theater can be skipped." },
              setFlags: { mussolini43: "abandoned" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "italyPartisans",
              outcome:
                "The commandos stay uncommitted, and Mussolini remains exactly where Badoglio's government left him: a prisoner, then eventually an Allied one, his political relevance ending roughly where his arrest began it. Northern Italy still gets occupied and administered exactly as it does regardless of whether a puppet Duce sits nominally atop it; what's actually lost is the propaganda value of a reconstituted Fascist state and whatever collaborationist recruitment his name still carries in September 1943, which by most contemporary estimates was already thinner than Berlin wanted to believe.",
            },
          ],
        };
        },
        get italyPartisans() {
          return {
          date: "LATE 1943",
          title: "The Cost of a Secured Italy",
          historicalRecord: true,
          situation:
            "Italy was secured fast, but a fast occupation isn't a quiet one: organized partisan resistance is growing in the mountains and the industrial north, exactly as it did historically. Estimates of partisan strength are almost meaningless: they range from a few thousand active fighters to fifty thousand or more depending on how you count, and the number grows every time an Allied supply drop lands. What's certain is the direction: it will keep drawing security divisions away from other fronts for the rest of the war regardless of what's decided here." +
            (flags.mussolini43 === "rescued"
              ? " The Salò Republic's own Black Brigades give this occupation something the alternative wouldn't have had, Italian manpower willing to fight other Italians, though what they cost in reliability and local legitimacy is a separate ledger from what they add in raw numbers."
              : flags.mussolini43 === "abandoned"
              ? " With no reinstalled Fascist government to supply even nominally Italian security forces, this occupation runs on German manpower alone: fewer complications of divided loyalty and local legitimacy, and correspondingly fewer bodies available for the mountains."
              : ""),
          choices: [
            {
              label: "Commit dedicated security divisions to suppress it now",
              advisor: { name: "Kesselring", position: "Behind the front line there must be quiet or there is no front line, and the mountains must be dealt with." },
              historical: true,
              setFlags: { italyOutcome: "suppressed" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "italianLine43",
              outcome:
                "What actually happened. German anti-partisan operations in Italy tied down real manpower through 1944 and into 1945: a standing tax on the western reserve that never fully goes away for the rest of the war, no matter what else is decided.",
            },
            {
              label: "Rely on a minimal garrison; accept ongoing instability instead",
              advisor: { name: "Westphal", position: "Chasing bands through the Apennines is how divisions disappear without a battle to show for it. Garrison the roads and save the rest for a front that counts." },
              setFlags: { italyOutcome: "unstable" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "italianLine43",
              outcome:
                "A lighter garrison frees more manpower for the west sooner. But Italian partisan networks (increasingly supported by Allied liaison officers and supply drops, as they historically were) grow bolder under a thin occupation, and the divisions this choice tried to save get pulled back in eventually anyway, later and under worse terms.",
            },
          ],
        };
        },
        get dnieperStabilized() {
          return {
          date: "LATE 1943",
          title: "Holding the Dnieper",
          historicalRecord: false,
          situation:
            "Reinforcing the Dnieper line ahead of Italy bought real stability through the autumn, but the Red Army is testing it with a major crossing attempt near Kiev itself, the same city fought over two years earlier. Signals intelligence puts the crossing force at anywhere from two armies to a full front: a range too wide to plan against, which is itself the finding. Meanwhile Italy's occupation, undermanned, is generating more organized partisan resistance than the historical record saw, tying down security forces that would otherwise be freed up." +
            (flags.kursk === "cancelDefend"
              ? " The mobile reserve available to answer this crossing exists in real strength for one reason: Kursk was never spent trying to break a salient this command's own tank general argued against attacking in the first place."
              : flags.kursk === "earlyStrike"
              ? " Whatever this line can commit to sealing the crossing is thinner for it: the early gamble at Kursk spent armor this front could use back now."
              : ""),
          choices: [
            {
              label: "Commit the last mobile reserve to seal the Dnieper crossing",
              advisor: { name: "Manstein", position: "A river line with a hole in it is not a line. Seal it now with everything, or begin drawing next year's maps further west." },
              setFlags: { dnieper: "sealed" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "firmestLine43",
              outcome:
                "Reasoned projection: this is the single firmest eastern line reachable anywhere in this campaign: a genuine counterfactual improvement over the historical autumn of 1943. It comes at the direct cost of the mobile reserve that would otherwise matter more later, in the west, and a stable eastern front, unfamiliar as that is, raises its own question about what it's in fact for.",
            },
            {
              label: "Let the local crossing succeed; preserve the reserve for the west instead",
              advisor: { name: "Rundstedt", position: "The east is a wound being managed and the west is the verdict. Bank the reserve and spend it where the war is decided." },
              setFlags: { dnieper: "conceded", preservedReserve: true },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "vWeaponsProduction44",
              outcome:
                "Trades a real but local eastern setback for exactly the kind of reserve preservation that pays off later, at Normandy and potentially the Ardennes, rather than being spent sealing a crossing that history's own timeline would see contested again soon regardless.",
            },
          ],
        };
        },
        get italianLine43() {
          return {
          date: "OCTOBER – NOVEMBER 1943",
          title: "Where Italy Is Held",
          historicalRecord: true,
          contested: true,
          situation:
            "With the peninsula occupied, the question becomes where to actually defend it, and the two officers holding the file disagree completely.\n\nRommel, commanding in the north, wants southern and central Italy given up without a serious fight and the line drawn in the northern Apennines: short, close to the Alps, defensible by fewer divisions, with the freed formations sent where the war is actually being decided. Kesselring wants the opposite: a forward defense holding south of Rome, on the argument that Italian terrain favors a defender so heavily that a determined stand costs the Allies far more than it costs the Reich, and keeps their bombers off the southern approaches.\n\nBoth cases are serious and the record does not settle between them. Kesselring got the decision historically, and his campaign is conventionally rated the most effective sustained delaying action of the war: twenty months from Salerno to the Po. Whether those months were worth what the divisions holding them might have done elsewhere is argued in both directions to this day.",
          choices: [
            {
              label: "Kesselring's line: forward defense south of Rome, and make them pay for every ridge",
              advisor: { name: "Kesselring", position: "The country was built for defense and Kesselring intends to present the bill. Give him the divisions and he will sell ground by the yard at a price no attacker has budgeted for." },
              historical: true,
              setFlags: { italianLine43: "forward" },
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "stockholmFeelers43",
              outcome:
                "What Hitler decided, and on its own terms it worked: successive prepared lines (Volturno, Gustav, Gothic) held for twenty months, tying down substantial Allied forces in a theatre that never became the decisive one, and making Cassino and Anzio mean what they now mean. The bill is the one Rommel predicted and Kesselring's defenders still contest: those divisions were in Italy, and therefore not in France in June or on the Vistula in July.",
            },
            {
              label: "Rommel's line: abandon the south, hold the northern Apennines, send the difference where the war is decided",
              advisor: { name: "Rommel", position: "Kesselring proposes to sell Italy slowly, and the question is what is to be bought with the proceeds when the east is losing the war while ridges outside Naples are discussed." },
              setFlags: { italianLine43: "apennines", rommelLine43: true },
              impact: { manpower: 2, fuel: 1, initiative: -1 },
              next: "stockholmFeelers43",
              outcome:
                "CONTESTED: the argument Rommel actually made, and its consequences run both ways in a manner no assessment fully resolves. The short northern line genuinely needs fewer divisions, and the formations released are real ones arriving somewhere they may matter more. What is surrendered is equally real: the southern airfields, from which Allied bombers reach targets the Reich had assumed were beyond range, and the twenty months of Allied attention Kesselring's campaign in fact consumed. Whether the trade is favorable depends entirely on what the released divisions get spent on.",
            },
          ],
        };
        },
        get stockholmFeelers43() {
          return {
          date: "SEPTEMBER – DECEMBER 1943",
          title: "The Stockholm Channel",
          historicalRecord: true,
          contested: true,
          situation:
            "A report arrives through the Ostministerium that the Foreign Office would prefer not to have in writing.\n\nPeter Kleist, an official with eastern-policy responsibilities, has been meeting Edgar Clauss, a Baltic German businessman in Stockholm with genuine access to the Soviet legation, who says Moscow is willing to discuss terms. Contacts of this kind are real and documented: they run across 1943, they touch Alexandrov of the Soviet foreign ministry's Central European desk, and Ribbentrop tolerated the exploration without ever being permitted to pursue it, because Hitler refused.\n\nWhat is genuinely disputed is what Stalin was doing. One reading has Moscow seriously testing a separate peace in a year when the second front kept not arriving and the Red Army was still absorbing enormous casualties. The other has the feelers as deliberate leverage, conducted loudly enough for London and Washington to hear, to extract commitments from allies Stalin did not trust. Serious historians hold both positions and the archives have not closed the question." +
            (flags.rommelLine43
              ? " One asymmetry is worth stating: the divisions released from Italy make any eastern line offered here more credible, because there is, this time, something standing behind the offer."
              : ""),
          choices: [
            {
              label: "Authorize the channel: explore an eastern armistice seriously, whatever Berlin has to be told afterwards",
              advisor: { name: "Kleist", position: "These meetings have been described as accidental and they are not. The man across the table has a legation behind him, and he asks questions that only matter if someone intends to answer them." },
              setFlags: { stockholm43: "pursued" },
              favor: -2,
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "firmestLine43",
              uncertain: [
                {
                  weight: modWeight(20, meters.manpower),
                  title: "Moscow was listening",
                  setFlags: { stockholmSerious43: true },
                  impact: { manpower: 2, fuel: 1, initiative: 3 },
                  next: "firmestLine43",
                  outcome:
                    "SPECULATIVE: no separate peace happened, and the majority historical reading is that none was ever truly available. On this roll the minority reading is the true one: Moscow was testing rather than performing, and an approach willing to trade eastern territory for an end to the eastern war finds a counterparty prepared to talk. What that produces is not peace in any ordinary sense, and not yet an armistice: it is a channel that is now real, known to be real by the people in it, and carrying terms that will have to be either taken or abandoned while the war goes on around them.",
                },
                {
                  weight: 100 - modWeight(20, meters.manpower),
                  title: "Leverage, and the file closes",
                  setFlags: { stockholmLeverage43: true },
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  next: "firmestLine43",
                  outcome:
                    "The majority reading, and what the documented contacts in fact produced: nothing. The channel stays open exactly as long as it is useful to Moscow, as something the Western allies can be permitted to hear about, and then goes quiet without ever having been a negotiation. Hitler's refusal to countenance the approach turns out to have cost nothing real, which is not the same as it having been correct. What the exploration does cost is standing, in a regime where the discovery that terms were discussed at all is not survivable for whoever discussed them.",
                },
              ],
            },
            {
              label: "Shut the channel down and report it: Casablanca demands unconditional surrender, and Berlin will hear of this regardless",
              advisor: { name: "Ribbentrop", position: "This has been allowed to run longer than the speaker's own position can bear. It stops now, with a paper trail showing who stopped it." },
              historical: true,
              setFlags: { stockholm43: "closed" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "firmestLine43",
              outcome:
                "What actually happened. The contacts were never authorized as negotiations, Hitler refused every approach on principle, and the file closed with nothing gained and nothing risked. It is worth being exact about what was theoretically declined here: the Allied position since Casablanca in January 1943 was unconditional surrender, declared jointly, and any separate eastern armistice required Stalin to break with it publicly. He did not, and the weight of the evidence is that he was never going to.",
            },
          ],
        };
        },
        get firmestLine43() {
          return {
          date: "WINTER 1943–44",
          title: "What a Firm Line Is For",
          historicalRecord: false,
          situation:
            "The Dnieper holds (truly, not as a propaganda phrase) and for the first time since 1941 the eastern staff has a front that isn't a running argument about where the next collapse happens. The mobile reserve spent sealing it is gone, but the line itself doesn't need defending hour to hour anymore, and a staff unused to that particular kind of quiet immediately starts arguing about what to do with it.",
          choices: [
            {
              label: "Treat it as a genuine opportunity: probe for a local counterstroke while the line holds",
              advisor: { name: "Manstein", position: "A firm line is a base to strike from and not a gift to be admired, and the reserve was not spent sealing it just to stand politely behind it." },
              historical: false,
              setFlags: { firmestLine43: "probe" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "vWeaponsProduction44",
              outcome:
                "The aggressive read of a rare eastern stability: a local counterstroke is attempted from the newly firm line, on the theory that a genuine defensive success is wasted if it's only ever used defensively. It finds the same production arithmetic every other eastern ambition in this campaign has found: a firm line changes what's possible locally, not what the war's totals already decided.",
            },
            {
              label: "Bank it purely as a defensive asset: the stability itself is the win, don't spend it chasing more",
              advisor: { name: "Rundstedt", position: "The reserve was spent to stop the argument about this front, so a new argument about it should not start at once." },
              setFlags: { firmestLine43: "bank" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "vWeaponsProduction44",
              outcome:
                "The disciplined answer: the line's stability is treated as the entire achievement, not a springboard for something more ambitious. It holds through the winter essentially unmolested, rare for this front at this point in the war, while the question of what a quiet eastern front might have been worth to the harder fight still coming in the west goes, deliberately, untested.",
            },
          ],
          };
        },

        get vWeaponsProduction44() {
          return {
          date: "SPRING 1944",
          title: "The Vengeance Weapons",
          historicalRecord: false,
          situation:
            "The V-1 flying bomb is weeks from operational readiness, the V-2 rocket not far behind it, and Hitler wants both scaled to maximum production: retaliation weapons for a public that has absorbed years of Allied bombing with no answer to point to. Speer's own production ministry has run the numbers and reached a conclusion he is not certain this room wants to hear: the resources committed to the V-2 program alone, in skilled labor and material, rival what the entire Reich has spent on any single weapons project of the war, for a payload smaller than a single heavy bomber's and an accuracy measured in miles rather than yards. What that same allocation could instead buy in fighter aircraft or army equipment is not a hypothetical: it's a number his ministry has already calculated.",
          choices: [
            {
              label: "Commit to maximum V-weapon production: the retaliation program as planned, resources found regardless",
              advisor: { name: "Hitler", position: "The German people have absorbed the bombing without an answer for too long, and will now have one. The workers and material must be found wherever they are." },
              historical: true,
              setFlags: { vWeapons44: "maximum" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "normandy",
              outcome:
                "What actually happened: both programs proceed at scale, consuming skilled labor and material: much of it, for the V-2 specifically, from concentration camp workers at Mittelwerk, worked and treated in conditions that killed more people building the rockets than the rockets ever killed landing. Over the war's remaining year, roughly 10,000 V-1s and 3,000 V-2s are launched at London and Antwerp, killing several thousand civilians: a real toll, and a fraction of what postwar analysis concludes the same resources would have achieved as fighters or army equipment instead.",
            },
            {
              label: "Cap the program: fund V-weapon development but redirect the bulk of the resources to fighter production",
              advisor: { name: "Speer", position: "The weapon itself is not opposed, only what it costs to build at the scale demanded. Every ministry has a number it would rather not have read aloud, and this is his." },
              setFlags: { vWeapons44: "capped" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "normandy",
              outcome:
                "The redirection Speer's own ministry argued for and never fully received historically: a smaller, still-real retaliation program alongside a meaningfully larger fighter output over the war's final year. It does not change the war's trajectory, by spring 1944 no single production decision does, but it is, on the ministry's own arithmetic, the more defensible allocation of a resource base that has nothing to spare either way.",
            },
          ],
        };
        },
        get normandy() {
          return {
          date: "JUNE 1944",
          title: "Normandy",
          historicalRecord: !preservedReserve,
          meanwhile:
            "MEANWHILE: SHAEF: Eisenhower's weather officer has given him a thirty-six-hour window and he has taken it. The deception planners are watching Fifteenth Army at Calais, and noting, with satisfaction, that it is not moving.",
          situation:
            (preservedReserve && meters.fuel <= -3
              ? "This path preserved an armored reserve the historical June never had, and the fuel ledger has stranded it: allocations this spring could not cover both the reserve's readiness and the front's daily consumption, and a counterstroke that cannot reach the battle is a counterstroke in name only. The reserve exists on the map. It will not appear on this one. "
              : "") +
            (preservedReserve
              ? "Allied forces have landed in Normandy. Command debates whether this is the invasion or a diversion: Fifteenth Army remains held near Calais. Because armor was preserved rather than spent earlier in the war, you have more of a reserve to respond with than the historical record did. "
              : "Allied forces have landed in Normandy. Command debates whether this is the invasion or a diversion: Fifteenth Army remains held near Calais, awaiting what Allied deception has convinced them is the 'real' landing. ") +
            "\n\nThe intelligence picture is the trap itself: FHW's order-of-battle assessment credits the Allies with roughly 75 to 90 divisions in Britain: enough for the Normandy landing to be a feint AND a second, larger blow at Calais. The real figure is closer to 50. The phantom divisions, the fictional army group under Patton, the double agents confirming it all: every channel you trust is feeding you the same wrong number, which is precisely why it's convincing." +
            (flags.westDoctrine === "forward"
              ? " Your forward-deployed doctrine now meets its test: if the strength was positioned at the right beaches, the landing is contested at the waterline; if Fortitude fooled the deployment too, it's positioned at Calais watching an empty sea."
              : "") +
            (flags.usWar === "withheld"
              ? " One genuine difference on this path: with the American declaration delayed in 1941-42, the US buildup in Britain ran months behind the historical pace: the force ashore is real, but its follow-on echelons are thinner than the historical record's."
              : "") +
            (flags.italyOutcome === "unstable"
              ? " Security divisions that might have thickened this front remain tied down against the Italian partisan war a thin garrison bought."
              : "") +
            (flags.vWeapons44 === "capped"
              ? " The fighters this spring's production decision kept out of the V-weapon program are, this week, over Normandy rather than over England: a marginal difference against total Allied air superiority, but not a nonexistent one."
              : "") +
            (flags.dunkirk === "push"
              ? " The British sector, facing Sword and Gold beaches, is still manned by formations rebuilding the veteran leadership cadre lost four years ago at Dunkirk: thinner in experience than the historical record."
              : " The British sector, facing Sword and Gold beaches, includes formations with real 1940 combat experience: the dividend of a largely intact evacuation four years ago at Dunkirk."),
          choices: (() => {
            const base = [
              {
                label: "Release Panzer reserves toward Normandy immediately",
                advisor: { name: "Rommel", position: "If this is the invasion, the war is decided today on those beaches before dark. Release everything, and wake him." },
                setFlags: { normandy: "release" },
              favor: 1,
                impact: { manpower: 0, fuel: 0, initiative: 1 },
                next: "normandyCounterattack44",
                // Hidden-information choice: the situation text says the order-of-battle assessment
                // is Fortitude's trap itself — "every channel you trust is feeding you the same
                // wrong number." Whether this is the real invasion is exactly what the room can't
                // know; concealRoll keeps the odds hidden until the OutcomeScreen's reveal.
                concealRoll: true,
                uncertain: [
                  {
                    weight: modWeight(20, meters.manpower),
                    title: "Woken in time",
                    setFlags: { hitlerWoken: true },
                    impact: { manpower: 0, fuel: 0, initiative: 1 },
                    outcome:
                      "The rare case: staff find the nerve to wake him, the authorization comes before dawn rather than after, and the reserve actually moves while the beachhead is still thin enough for it to matter. This is not the historical morning: in the real one, nobody woke him at all. What a panzer counterattack actually arriving in time looks like is the next question, and it's a real one.",
                  },
                  {
                    weight: 100 - modWeight(20, meters.manpower),
                    title: "The historical paralysis, repeated",
                    impact: { manpower: -1, fuel: 0, initiative: -1 },
                    outcome:
                      "What the record actually shows: nobody on staff is willing to wake him, the authorization arrives hours late regardless of the order given here, and the reserve moves into an Allied air supremacy that has had all morning to prepare for exactly this. Ordering the release doesn't change who's willing to act on the order at 4 a.m.: this campaign's honest accounting of a paralysis that was institutional, not a single man's decision to make differently.",
                  },
                ],
              },
              {
                label: "Hold reserves: wait for confirmation this isn't a feint toward Calais",
                advisor: { name: "Jodl", position: "Every assessment points to the main blow at Calais, so the strategic reserve is not spent on the diversion." },
                historical: true,
                setFlags: { normandy: "hold" },
                impact: { manpower: 0, fuel: 0, initiative: -2 },
                next: "normandyConsolidation44",
                outcome:
                  "What actually happened, and given the intelligence you had, arguably the 'rational' choice, which is the most instructive thing about it. Operation Fortitude's phantom army held Fifteenth Army at Calais for WEEKS after D-Day, waiting for a second invasion that never existed. The wait let the beachhead consolidate before serious armored counterattack. Sometimes the failure isn't the decision; it's the intelligence system the decision correctly trusted. Watching that consolidation happen, day by day, is the next thing this command has to do.",
              },
            ];
            if (flags.westDoctrine === "forward") {
              base.unshift({
                label: "The doctrine's moment: fight the landing at the waterline with the forward-deployed divisions",
                advisor: { name: "Rommel", position: "This is the twenty-four hours the whole coast was built for, and whatever stands on those beaches by dark decides the war." },
                setFlags: { normandy: "waterline" },
                impact: { manpower: -1, fuel: 0, initiative: 0 },
                next: "normandyConsolidation44",
                uncertain: [
                  {
                    weight: modWeight(45, meters.manpower),
                    title: "The strength was at the right beaches",
                    impact: { manpower: 0, fuel: 0, initiative: 2 },
                    outcome:
                      "The dice break your way: enough of the forward-deployed strength sits behind the actual invasion beaches to make the first day truly murderous. Omaha's near-failure becomes the pattern rather than the exception, two beachheads link days late, and the lodgment that historically consolidated in a week takes a month to become secure. The landing still succeeds, naval gunfire and total air supremacy see to that, but at a cost in time and blood that echoes through the rest of 1944. The best D-Day outcome this campaign can honestly offer, and what happens in the weeks it buys is the next real question.",
                  },
                  {
                    weight: 100 - modWeight(45, meters.manpower),
                    title: "Fortitude fooled the deployment too",
                    impact: { manpower: -2, fuel: 0, initiative: 0 },
                    outcome:
                      "The dice expose the doctrine's known flaw: forward-deployed strength is a bet on WHERE, and the deception won that bet: the weight of the coastal divisions sits at Calais, watching an empty sea, while Normandy's actual beaches are held near historical strength. Worse than the historical result, in fact: the forward doctrine stripped the central reserve that history at least had available to feed in late. Rommel's twenty-four decisive hours pass with the decisive divisions two hundred kilometers from the battle.",
                  },
                ],
              });
            }
            if (preservedReserve && meters.fuel > -3) {
              const massed = flags.westDoctrine === "reserve";
              base.push({
                label: massed
                  ? "The doctrine's moment: commit the massed central reserve against the beachhead as one blow"
                  : "Launch an immediate, fully-resourced counter-attack against the beachhead",
                advisor: massed
                  ? { name: "Rundstedt", position: "The war has now been shown where it is, so everything goes in at once before the beachhead becomes a front." }
                  : { name: "Rommel", position: "The reserve begged of history has been given, there is exactly one morning on which it purchases anything, and this is the morning." },
                setFlags: { normandy: "counterattack" },
                impact: massed ? { manpower: -1, fuel: -1, initiative: 1 } : { manpower: -1, fuel: -1, initiative: 0 },
                next: "bagration44",
                outcome: massed
                  ? "The Rundstedt doctrine executed as designed, and the projection is honest about both halves: the massed reserve, husbanded for exactly this, is the strongest armored counterstroke the western war can produce, and it must reach the battle across a France where Allied air owns every road, bridge, and rail junction in daylight. Perhaps half of it arrives in fighting condition, late; that half hits harder than anything the historical campaign managed, pins the beachhead against the sea for weeks, and still cannot push it into it. The doctrine's answer, delivered, and the war's answer, unchanged."
                  : "A materially different attempt than history's thinner counterattacks near Sword Beach, but it still runs into the same wall: Allied naval gunfire ranging in from offshore (battleship main batteries reach 20 miles inland), and total Allied air supremacy over the battlefield. A better-resourced attack contests the beachhead a little longer and costs the Allies somewhat more, but doesn't reverse the landing.",
              });
            }
            return base;
          })(),
        };
        },
        get normandyCounterattack44() {
          return {
          date: "JUNE 6, 1944: AFTERNOON",
          title: "The Counterattack That Almost Wasn't",
          historicalRecord: false,
          situation: flags.hitlerWoken
            ? "This is the narrow case this campaign reaches on D-Day itself: a panzer reserve actually moving while the beachhead is still hours old, something the real morning of June 6th never produced. Allied naval gunfire and total air supremacy over every approach road haven't gone anywhere, and neither has the fact that this counterattack is still outnumbered and outgunned in the air by a wide margin. What's real is that it exists at all, moving, before the lodgment has time to consolidate."
            : "The reserve is moving now, hours later than it needed to, into a beachhead that has had the entire day to dig in, bring armor ashore, and call in naval gunfire on anything that approaches in daylight. This is close to what the historical afternoon of June 6th actually looked like on the rare occasions a counterattack did reach the coast: arriving to find the moment it needed had already passed.",
          choices: flags.hitlerWoken
            ? [
                {
                  label: "Drive for the beach at Sword: split the British lodgment before it links with the others",
                  advisor: { name: "Rommel", position: "One armored spearhead reaching salt water ends the argument about whether the invasion succeeds, and there are twelve hours, perhaps fewer, to make that argument in steel." },
                  checkLabel: "Matériel",
                  disabledReason: meters.fuel <= -3 ? "insufficient fuel left to run an armored spearhead the length of the lodgment in a single push" : undefined,
                  setFlags: { normandyCounterattack: "drive" },
                  impact: { manpower: -2, fuel: -1, initiative: 0 },
                  next: "bagration44",
                  uncertain: [
                    {
                      weight: modWeight(15, meters.manpower),
                      title: "The narrowest possible case: the spearhead reaches the water",
                      impact: { manpower: -1, fuel: 0, initiative: 1 },
                      outcome:
                        "The single best result this campaign's D-Day content reaches anywhere, stated as narrowly as the odds that produced it: a panzer spearhead actually reaches the coast between two beach sectors before naval gunfire and air attack can mass against it. It does not undo the invasion, five sectors are ashore and the follow-on echelons keep coming regardless, but it costs the Allied buildup real time and forces a fight to reopen a corridor that historically never closed. The war's largest amphibious operation gets its one bad day.",
                    },
                    {
                      weight: 100 - modWeight(15, meters.manpower),
                      title: "The likelier case: the drive doesn't survive the daylight",
                      impact: { manpower: -3, fuel: -1, initiative: 0 },
                      outcome:
                        "What every honest accounting of Allied air supremacy over Normandy concludes: armor moving in daylight against a beachhead with total naval and air support overhead doesn't reach its objective, it reaches a series of burning columns well short of it. The reserve that moved faster than the historical record still arrives at the same conclusion the historical record reached, only at a higher cost, for having tried harder to avoid it.",
                    },
                  ],
                },
                {
                  label: "Hold the counterattack for dusk: attack under cover of darkness instead",
                  advisor: { name: "Guderian's doctrine, invoked by staff", position: "Armor in daylight against that much naval gunfire is arithmetic, not audacity, and the arithmetic is published. Wait for dark." },
                  setFlags: { normandyCounterattack: "dusk" },
                  favor: 1,
                  impact: { manpower: 1, fuel: 0, initiative: -1 },
                  next: "bagration44",
                  outcome:
                    "The disciplined answer, and the one that trades this afternoon's narrow window for a safer one that no longer exists by the time it arrives: waiting for dark keeps the reserve intact through the hours naval gunfire owns completely, but the beachhead spends those same hours consolidating, and the corridor that might have been split at 2 p.m. is fully linked by nightfall. The reserve survives the day. The day's one real opportunity does not survive with it.",
                },
              ]
            : [
                {
                  label: "Commit the reserve anyway: better late than not tried at all",
                  advisor: { name: "Rommel", position: "The reserve was asked for at dawn and handed over at dusk. It will be used regardless, since the alternative is explaining why it was requested and then left alone." },
                  setFlags: { normandyCounterattack: "lateCommit" },
                  impact: { manpower: -2, fuel: -1, initiative: 0 },
                  next: "bagration44",
                  outcome:
                    "The reserve moves into a beachhead that finished consolidating hours ago, and the result matches the handful of real German counterattacks that actually reached the Normandy coast on June 6th: real losses, no reopened corridor, and a panzer force that would have mattered more held in reserve for the harder fighting still ahead at Caen.",
                },
                {
                  label: "Stand the reserve down: the window that mattered is already gone",
                  advisor: { name: "Rundstedt", position: "No version of this order arrives in time now, so the divisions should be saved for the battle that can still be fought." },
                  setFlags: { normandyCounterattack: "stoodDown" },
                  favor: 1,
                  impact: { manpower: 1, fuel: 0, initiative: 0 },
                  next: "bagration44",
                  outcome:
                    "The honest reading of a window that closed hours before this order could act on it: the reserve stands down intact, preserved for the containment battle at Caen that's coming regardless of what happens this afternoon. Nothing about the invasion's first day changes. What does change is which divisions are still whole when the harder fighting starts.",
                },
              ],
        };
        },
        get normandyConsolidation44() {
          return {
          date: "JUNE 1944: WEEK ONE",
          title: "The Week the Beachhead Wins",
          historicalRecord: flags.normandy === "hold",
          situation:
            (flags.normandy === "waterline"
              ? "The first day's fighting is over and the arithmetic is exactly what naval gunfire and total air supremacy always promised: costly for the Allies, and still a landing that succeeded. What the forward doctrine bought is time, not a different outcome: real time, real Allied losses, but a beachhead that is still, at the end of week one, going to become permanent. "
              : "Fifteenth Army is still at Calais, still waiting for a second invasion that Fortitude has made entirely convincing, and the historical week that let Normandy's beachhead consolidate almost undisturbed is unfolding here exactly as it did in the real June 1944. ") +
            "Every division not committed to containing the beach is a division that could, in principle, still be moved: the roads are cratered, the Allied air forces own the daylight over anything that tries, but movement at night, in stages, remains realistically possible for a few more days before the lodgment's own perimeter defenses make it moot. What this command does with that shrinking window is the last real decision before this becomes a battle of position rather than maneuver.",
          choices: [
            {
              label: "Commit everything still mobile to one decisive counter-stroke, now, before the window closes",
              advisor: { name: "Rommel", position: "There is one week, perhaps fewer, before this stops being a battle that can be won or lost and becomes a siege that can only be managed. Spend everything mobile while the word decisive still means something." },
              historical: false,
              setFlags: { normandyConsolidation44: "strike" },
              favor: -1,
              impact: { manpower: -2, fuel: -1, initiative: 0 },
              next: "bagration44",
              outcome:
                "The gambler's read of a fast-closing window: committing every still-mobile formation to a single concentrated counter-stroke is the last version of this battle that could plausibly be called maneuver rather than siege. Allied air interdiction makes daylight movement suicidal and night movement slow, and the honest odds of a concentrated blow actually landing coherently, this late, are worse than the ones a fresher army faced on June 6th itself. It is tried anyway, because the alternative, watching the window close without having tried, is its own kind of answer.",
            },
            {
              label: "Begin the deliberate fighting withdrawal to a shorter, more defensible interior line",
              advisor: { name: "Rundstedt", position: "There is a version of this campaign in which the army is spent finding out the window has already closed. Better to hold a line chosen than one the beachhead's own growth chose." },
              historical: true,
              setFlags: { normandyConsolidation44: "withdraw" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "bagration44",
              outcome:
                "The disciplined reading, and closer to what actually happened than the alternative: accepting that the maneuver phase is effectively over, and beginning the deliberate consolidation onto ground this command chooses rather than ground the beachhead's growth dictates. It concedes the week's one real opportunity in exchange for an army that enters the coming containment battle, the fight this campaign has already written in real depth around Caen, with more of itself intact and in better order than the gambler's version leaves behind.",
            },
          ],
        };
        },
        get bagration44() {
          return {
          date: "JUNE 1944",
          title: "Where Will the Soviet Blow Fall",
          historicalRecord: true,
          meanwhile:
            "MEANWHILE: MOSCOW: The maskirovka directorate files its report: German reserves are watching the wrong front. The false radio nets in the south will keep transmitting until the guns make them unnecessary.",
          situation:
            "The Soviet summer offensive is coming: the only question is where, and it's worth everything. Fremde Heere Ost, now under Gehlen, assesses with high confidence that the main blow will fall in the south, against Army Group North Ukraine, aimed at the Balkans and Romania's oil: the terrain logic is sound, the strategic prize is obvious, and the signals intelligence seems to confirm it. Army Group Center's sector, by contrast, is assessed as quiet: its front bulging east in a salient Hitler has ordered held via 'fortified places,' cities designated to stand even if surrounded.\n\nWhat FHO's confident assessment doesn't know: the Soviet maskirovka effort for this offensive is the largest of the war, radio traffic in the south is theater, and roughly 2.3 million men with overwhelming armor and air support are massing in secret against Army Group Center's estimated 800,000. You are being played by professionals, and the assessment on your desk reads as your most reliable of the war." +
            (preservedReserve
              ? " And unlike the historical June, a real armored reserve exists to allocate, which makes this assessment matter even more than it did in the real war."
              : "") +
            (flags.suez41 === "taken" && flags.crete41 === "assault" && flags.japan === "pressNorth" && flags.siberianReserves === "diverted"
              ? " Three years on, the Mediterranean still shapes what's available here: Suez, Crete, and a diplomatic push that briefly bought Soviet reserves in Manchuria all drew down the reserve this front now needs most, and this front is still short the divisions that never came back from any of it."
              : flags.suez41 === "taken" && flags.med42 === "malta"
              ? " The desert war's long shadow reaches this front too: divisions that spent 1941 and 1942 in Africa and the central Mediterranean are veterans now, but they're veterans of a theater that's given nothing back to this one."
              : "") +
            (flags.eastFront === "moscow"
              ? " Army Group Center's salient is, in a real sense, the last visible shape of the 1941 gamble that pushed straight for Moscow: three years on, this is still the front that bet everything on that single autumn."
              : flags.eastFront === "kiev"
              ? " Army Group Center's line owes its current position to a 1941 campaign that spent its opening momentum in the south, at Kiev, rather than driving on this sector first."
              : ""),
          choices: (() => {
            const base = [
            {
              label: "Weight the reserves south, behind Army Group North Ukraine, as FHO assesses",
              advisor: { name: "Gehlen", position: "Every indicator points to the south, and no assessment has ever been signed with more corroboration behind it." },
              historical: true,
              setFlags: { bagration: "south" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: meters.manpower <= -5 ? "collapse1944" : "july20Plot44",
              outcome:
                "What happened, and the worst German intelligence failure of the war. Operation Bagration hit Army Group Center on June 22, three years to the day after Barbarossa, and effectively destroyed it: 28 divisions gone, casualties estimated between 300,000 and 450,000, a hole torn in the front that never closed. The 'fortified places' doctrine turned retreating divisions into surrounded ones. By most measures this, not Stalingrad, was the single most destructive defeat the German army ever suffered.",
            },
            {
              label: "Hedge: distribute the reserves evenly across both army groups",
              advisor: { name: "Model", position: "When every indicator agrees this perfectly it suggests an author, not an enemy, so split the reserve and insult both possibilities equally." },
              setFlags: { bagration: "hedge" },
              impact: { manpower: -2, fuel: -1, initiative: 0 },
              next: meters.manpower <= -5 ? "collapse1944" : "july20Plot44",
              // Hidden-information choice: the situation text is explicit — "What FHO's confident
              // assessment doesn't know... You are being played by professionals, and the
              // assessment on your desk reads as your most reliable of the war." concealRoll keeps
              // that deception real for the player too, revealing the true odds only afterward.
              concealRoll: true,
              uncertain: [
                {
                  weight: modWeight(35, meters.manpower),
                  title: "The hedge earns its cost",
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  next: "centerArmyPreserved44",
                  outcome:
                    "The favorable case lands: the redistributed reserve, thin as it is, buys enough to turn several of the historical war's total encirclements into fighting withdrawals instead. Belarus is still lost, the force ratio never stopped meaning that, but Army Group Center survives June 1944 as an army rather than a casualty list, which the historical version of this exact hedge never quite managed. What that surviving army is really for is now someone's decision to make.",
                },
                {
                  weight: 100 - modWeight(35, meters.manpower),
                  title: "The hedge insults both fronts equally",
                  impact: { manpower: -2, fuel: 0, initiative: 0 },
                  outcome:
                    "Reasoned projection at its least generous, and the likelier case: hedging against your own intelligence softens the blow without stopping it. Even a perfectly forewarned Army Group Center faces nearly three-to-one odds in men and worse in armor and aircraft: the distributed reserve weakens the southern sector against a feint while the central sector is overwhelmed regardless, just somewhat more slowly and at higher Soviet cost.",
                },
              ],
            },
            {
              label: "Reject the assessment: weight Center, and abandon the fortified-places doctrine for elastic defense",
              advisor: { name: "Busch", position: "The front is quiet the way a held breath is quiet. Something is out there whatever the assessments say, and the fortress orders will make graves of the divisions if it comes." },
              setFlags: { bagration: "center" },
              favor: 1,
              impact: { manpower: -1, fuel: -1, initiative: 2 },
              next: meters.manpower <= -5 ? "collapse1944" : "eastStand44",
              outcome:
                "The counterfactual best case, and an honest accounting of it: correctly weighting Center AND freeing commanders to trade space saves a meaningful fraction of the army group: the encirclements that historically consumed whole corps become fighting retreats instead. But 'saves a fraction' is the ceiling. The force ratios mean Belarus is lost on any version of this timeline; the difference is whether Army Group Center survives as an army or as a list of destroyed divisions. Also worth naming: rejecting your best-sourced intelligence assessment of the war, on a hunch, is not a repeatable decision procedure.",
            },
            ];
            if (meters.manpower >= 3 && meters.initiative >= 3) {
              base.push({
                label: "Spend the banked strength directly: reinforce Center now, on top of rejecting FHO's assessment",
                advisor: { name: "Guderian", position: "Three years of husbanded divisions were saved for exactly this morning, and if they cannot be spent here the morning worth more should be named." },
                setFlags: { bagration: "center", bagrationReinforced: true },
                favor: 2,
                impact: { manpower: 1, fuel: -1, initiative: 1 },
                next: meters.manpower <= -5 ? "collapse1944" : "eastStand44",
                outcome:
                  "The option only an unusually well-managed war can put on the table: rejecting FHO's confident-but-wrong assessment is the counterfactual best case on its own, and this path pairs it with real reserves the historical German army of June 1944 never had to allocate: the fruit of years spent not spending everything as it arrived. Army Group Center still gives ground; 2.3 million attackers see to that. But it retreats as a reinforced army rather than a thin one, and the difference shows in every fight this front has left.",
              });
            }
            return base;
          })(),
        };
        },
        get eastStand44() {
          return {
          date: "AUGUST 1944",
          title: "The Fighting Retreat",
          historicalRecord: false,
          situation:
            "Alternative history compounding: because the reserves were weighted correctly and the fortress doctrine abandoned, Army Group Center is retreating as an army rather than dissolving as a casualty list. It's still retreating, 2.3 million attackers guarantee that, but three hundred kilometers west of where history's rout ended, a real question exists that the historical summer never got to ask: where does the fighting retreat anchor, and does it turn?\n\nSoviet spearheads have outrun their supply exactly as deep offensives always do; your commanders can see it happening. Estimates of how overextended they are range from 'vulnerable for a week' to 'vulnerable until the rains.'",
          choices: [
            {
              label: "Anchor on the Vistula river line: dig in behind the last great river before the Reich",
              advisor: { name: "Model", position: "Rivers neither run away nor need fuel. Put the army behind the Vistula and make Ivan solve a problem with no maneuver answer." },
              setFlags: { eastStand: "vistula" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "romaniaDefects44",
              outcome:
                "Reasoned projection of the conservative dividend: the Vistula was where the historical Soviet offensive culminated ANYWAY, out of fuel and ammunition: a preserved army group meeting them there holds the line months earlier and in far better order than the historical scraped-together front. The eastern war continues, but for the first time since Kursk, on a line chosen rather than imposed.",
            },
            {
              label: "The backhand blow: counterattack the overextended Soviet spearheads Manstein-style",
              advisor: { name: "Manstein", position: "Kharkov on a grander scale: let the flood overreach, then cut it at the wrist, since their spearheads are further from home than any ever were." },
              setFlags: { eastStand: "backhand" },
              favor: 1,
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "romaniaDefects44",
              outcome:
                "Reasoned projection of the most seductive option in the eastern war's endgame: the 1943 Kharkov counterstroke proved the pattern can work. Against 1944's Red Army the honest version is smaller: the overextended lead elements are mauled, several tank corps' worth, and the offensive stops early, but this Red Army absorbs a Kharkov the way 1943's absorbed a bad week. A real tactical victory, purchased with fuel and armor the west will shortly be asking about.",
            },
            {
              label: "Trade Poland entirely: pull all the way back to the Reich's own border fortifications now",
              advisor: { name: "Guderian", position: "Every kilometer held out here is a kilometer of Germany that cannot be fortified. The war is coming home, and it should find the door locked." },
              setFlags: { eastStand: "reichLine" },
              favor: 2,
              impact: { manpower: 1, fuel: 1, initiative: -1 },
              next: "romaniaDefects44",
              outcome:
                "Reasoned projection of the coldest arithmetic: abandoning Poland without a fight preserves the most strength and shortens the line the most, and hands the Soviet Union months of unearned advance, with everything that implies for how far west the postwar map gets drawn. Militarily the thriftiest option on this list; strategically, it concedes the very thing the extra strength was supposed to contest.",
            },
          ],
        };
        },
        get collapse1944() {
          return {
          date: "SUMMER – AUTUMN 1944",
          title: "The Front Comes Apart",
          historicalRecord: false,
          situation:
            "Bagration has landed on an army already bled past the point of absorption by the years of decisions behind it. The historical version of this catastrophe destroyed one army group and left the rest of the front standing; this version has no rest-of-the-front worth the name. Reports of Soviet spearheads now arrive from sectors the situation map still shows as German-held, army group boundaries exist mostly on paper, and the western front, hearing all of it, is beginning to fight like men who know the east has already decided the war. This is a general collapse, roughly nine months ahead of the historical one, and the choices left are about its shape, not its fact.",
          choices: [
            {
              label: "Fight a general withdrawal: trade all of Poland for a line on the Oder",
              advisor: { name: "Model", position: "He has been called the Führer's fireman. There is no putting this out, but a fire brigade can still choose what it carries from the building." },
              setFlags: { finalStand: "oderLine", pathVariant: "collapse44" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "END",
              uncertain: [
                {
                  weight: modWeight(70, meters.fuel),
                  title: "The line holds together",
                  impact: { manpower: 1, fuel: 0, initiative: 0 },
                  outcome:
                    "The defensible version of losing: a continuous fighting withdrawal keeps formations intact as formations, and whatever reaches the Oder arrives as an army rather than as stragglers. It shortens the war by months compared to history, Soviet forces reach Germany's borders in autumn 1944 rather than spring 1945, but more of the army survives to surrender at the end of it.",
                },
                {
                  weight: 100 - modWeight(70, meters.fuel),
                  title: "The withdrawal partially unravels",
                  impact: { manpower: -1, fuel: 0, initiative: 0 },
                  outcome:
                    "The intent was orderly; the execution, under this much pressure with this little left to hold a line with, isn't fully. Pockets form anyway at the seams between retreating formations, even without a fortress order causing them: a fighting withdrawal this late in a collapse this total was always a target for the disciplined army it assumed still existed, not a guarantee.",
                },
              ],
            },
            {
              label: "Declare fortress cities across Poland: hold everywhere, yield nothing",
              advisor: { name: "Keitel", position: "The Führer has designated the fortress places, and they will hold to the last as ordered." },
              setFlags: { finalStand: "fortresses", pathVariant: "collapse44" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "END",
              outcome:
                "The fortified-places doctrine applied to a collapsing front, which is where it always led: each 'fortress' becomes a pocket, each pocket a surrender, and the Soviet advance flows around them barely slowed. The war ends on nearly the same accelerated schedule (the fortresses buy days, not months) but far more of the army ends it in encirclements rather than on a line.",
            },
          ],
        };
        },
        get centerArmyPreserved44() {
          return {
          date: "JULY 1944",
          title: "What the Preserved Army Is For",
          historicalRecord: false,
          situation:
            "A really rare asset by this point in the war: an intact eastern field army, where history has only a casualty list. Belarus is still lost and the front has still bent badly, but there is an army to bend it with, rather than a gap. Meanwhile Normandy has broken open in the west, and Berlin's staff maps now show two fronts each capable of using every division this campaign has managed to preserve.",
          choices: [
            {
              label: "Hold it in the east: the front that just nearly collapsed needs it more than the one that's merely losing",
              advisor: { name: "Model", position: "The west is losing a campaign while the east nearly lost the war outright three weeks ago, and it is clear which fire needs the fire brigade more." },
              historical: false,
              setFlags: { centerArmyPreserved44: "holdEast" },
              impact: { manpower: 1, fuel: -1, initiative: 0 },
              next: "july20Plot44",
              outcome:
                "The eastern-front logic, applied to a resource the historical war never had spare to apply it with: the preserved army stabilizes a front that came within one worse roll of total collapse, buying real time against the next Soviet push at the direct cost of reinforcements the crumbling Normandy front will now do without.",
            },
            {
              label: "Transfer west: Normandy is the front that can still be argued about; the east is already decided",
              advisor: { name: "Rundstedt", position: "The east is arithmetic now whatever is sent to it, while the west, for a few more weeks, might still be argued." },
              historical: false,
              setFlags: { centerArmyPreserved44: "transferWest" },
              favor: 1,
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "july20Plot44",
              outcome:
                "The harder-nosed strategic read: an army preserved in the east is spent reinforcing the west, on the theory that the eastern war's outcome is no longer contestable by any reserve this campaign could produce, while Normandy's is, for a little longer, still a fight rather than a formality. The transfer buys the western front real strength the historical summer never had. What it costs the east is a question this campaign will keep asking for the rest of the war.",
            },
          ],
          };
        },

        get romaniaDefects44() {
          return {
          date: "AUGUST 23, 1944",
          title: "The Coup in Bucharest",
          historicalRecord: false,
          situation:
            "King Michael has had Marshal Antonescu arrested at the palace and announced, by radio, that Romania is switching sides: effective immediately, with Romanian troops now ordered to fire on the German units that were, an hour earlier, allies occupying their own soil. The strategic damage is not abstract or delayed: Romania's oil fields at Ploiești supply roughly a third of the Reich's crude, and the road south into the Balkans that this army group has spent three years securing is, as of this morning's broadcast, no longer secured by anyone friendly. German garrison forces in Bucharest are cut off, under fire, and asking what this headquarters wants them to do with the hours they have left before Soviet spearheads exploit the opening.",
          choices: [
            {
              label: "Order the Bucharest garrison to fight its way out: extract what can be saved",
              advisor: { name: "Friessner", position: "There are men in that city with no line back and a government that was an ally yesterday now shooting at them. Permission is asked to bring out whom can be brought before that stops being possible." },
              historical: true,
              setFlags: { romania44: "extract" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "july20Plot44",
              outcome:
                "Close to what happened: German forces in and around Bucharest fight a chaotic, costly withdrawal north, harried by Romanian units that were comrades days earlier. Most of the Ploiești fields' output is lost within weeks regardless of the fighting's outcome (the coup, not the withdrawal, is what actually decides that question) and the road into the Balkans that Romania's alliance secured for three years is simply gone, open now to whichever army reaches it first.",
            },
            {
              label: "Order the garrison to hold Bucharest and await relief: treat the coup as reversible",
              advisor: { name: "Guderian", position: "No relief column can arrive before the men in question are dead or captured, and ordering them to hold is ordering them to die for a position that cannot be reinforced." },
              setFlags: { romania44: "hold" },
              impact: { manpower: -2, fuel: -1, initiative: 0 },
              next: "july20Plot44",
              outcome:
                "The costlier and, by every honest staff assessment, the less realistic order: a garrison told to hold a capital with no relief column able to reach it in time simply gets overrun rather than withdrawn, and the men an earlier extraction order would have brought out are lost with the position instead. Ploiești's fields are no more retained by this choice than by the alternative: Romania's defection decided that the moment it was announced, not in whatever this garrison does in the days after.",
            },
          ],
        };
        },
        get july20Plot44() {
          return {
          date: "JULY 20, 1944",
          title: "The Blast at the Wolf's Lair",
          historicalRecord: true,
          situation:
            "A bomb has detonated in the briefing hut at the Wolf's Lair. The first reports reaching this headquarters are contradictory and thin: a serious attempt on Hitler's life, an unclear outcome, and a chain of command in Berlin that doesn't yet know which version of the next hour it's operating in. What actually happened in that hut, a heavy oak table leg positioned by chance between Hitler and the blast, is not something this command can influence or even confirm yet. What it can decide, in these first confused minutes, is how it responds while the answer is still unknown." +
            (flags.sealionAftermath === "buried"
              ? " Four years on, the pattern this regime set for handling its own bad news is still the one officers in this room are quietly measuring the first reports against."
              : flags.sealionAftermath === "honest"
              ? " Whatever else has changed since 1940, this command's early habit of naming its own failures plainly is, this time, working in its favor: the confusion in these reports reads as genuine, not as a story already being managed."
              : ""),
          choices: [
            {
              label: "Hold to the chain of command: await Berlin's confirmation before acting on anything",
              advisor: { name: "Jodl", position: "What happened an hour ago in a briefing hut four hundred kilometers away is not known. Act on confirmation, not rumor, whatever the rumor turns out to be." },
              historical: true,
              setFlags: { wolfsLair44: "wait" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "july20PlotFails44",
              uncertain: [
                {
                  weight: 100 - modWeight(10, 0),
                  title: "Confirmed: the Führer survives",
                  next: "july20PlotFails44",
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  outcome:
                    "What actually happened: Hitler survives with relatively minor injuries: burst eardrums, minor burns, a shredded uniform kept afterward as something close to a relic. The plot, and the reckoning it triggers, unfolds from here exactly as the historical record describes it.",
                },
                {
                  weight: modWeight(10, 0),
                  title: "The narrowest possible case: the Führer does not survive",
                  next: "hitlerDead44",
                  impact: { manpower: 0, fuel: 0, initiative: 1 },
                  outcome:
                    "The margin by which Hitler actually survived was measured in a single piece of oak furniture and the decision, made hours earlier for unrelated reasons, to hold the briefing in a wooden hut with open windows rather than the reinforced concrete bunker nearby: a decision that dispersed the blast enough to let him live. This is the rare case where that margin runs the other way. What this headquarters does in the hours that follow is now the most consequential decision of the entire war.",
                },
              ],
            },
            {
              label: "Move to secure this headquarters' own position regardless of what Berlin confirms",
              advisor: { name: "a staff officer, unnamed in the record", position: "Whatever the truth, this command should control its own perimeter, rather than be told in an hour that it should have." },
              setFlags: { wolfsLair44: "secure" },
              favor: -1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "july20PlotFails44",
              uncertain: [
                {
                  weight: 100 - modWeight(10, 0),
                  title: "Confirmed: the Führer survives",
                  next: "july20PlotFails44",
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  outcome:
                    "What actually happened, with this headquarters having spent the confused hour securing its own perimeter for a crisis that turns out to already be resolving: Hitler survives with relatively minor injuries, and the independent security measures read, in retrospect, as either commendable caution or a faintly suspicious anticipation of a Führer who was not, after all, dead.",
                },
                {
                  weight: modWeight(10, 0),
                  title: "The narrowest possible case: the Führer does not survive",
                  next: "hitlerDead44",
                  impact: { manpower: 0, fuel: 0, initiative: 1 },
                  outcome:
                    "The margin by which Hitler actually survived was measured in a single piece of oak furniture. This is the case, against real odds, where that margin runs the other way, and this headquarters, having already moved to secure its own position rather than wait on Berlin, is unusually well positioned for whatever the next few hours actually require of it.",
                },
              ],
            },
          ],
        };
        },
        get july20PlotFails44() {
          return {
          date: "JULY 1944",
          title: "The Plot Against Hitler",
          historicalRecord: true,
          situation:
            "A bomb detonates in the briefing hut at the Wolf's Lair. Hitler survives with minor injuries: a heavy oak table leg, positioned between him and the blast by chance, becomes within hours the subject of furious talk in Berlin about fate and providence. The conspiracy behind it, when it unravels over the following days, reaches deep into the officer corps: men who concluded, watching two more years of the war's arithmetic play out exactly as this campaign's own numbers have, that only removing Hitler could end it before total ruin.\n\nThe plot fails. What follows is not a battle: it is an internal reckoning, and it will cost the Wehrmacht some of its most experienced commanders regardless of how directly involved each one actually was.",
          choices: [
            {
              label: "Support the purge in full, as ordered: every implicated officer, however senior",
              advisor: { name: "Keitel", position: "The Führer's order is unambiguous, as after Stalingrad and after every retreat this campaign has recorded, and loyalty is tested precisely when it is inconvenient." },
              historical: true,
              setFlags: { july20: "purge" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "rommelFate44",
              outcome:
                "The People's Court convicted and executed thousands in the following months: a purge that reached deep into the officer corps' most experienced ranks, entirely apart from the moral weight of each individual case. One name on the implicated list belongs to a man whose actual degree of involvement remains debated by historians to this day, and whose public standing makes his case a decision of its own.",
            },
            {
              label: "Quietly shield essential commanders from the worst of the purge where possible",
              advisor: { name: "Model", position: "He did not sign the plot and will not sign every name handed to him either, since some of these officers are needed for the war that is still being fought." },
              setFlags: { july20: "shield" },
              favor: 2,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "gestapoInquiry44",
              outcome:
                "An honest account of the narrow mercy that a real war effort under real pressure rarely allowed: a handful of operationally essential officers are quietly reassigned or protected rather than fully purged, at genuine political risk to whoever arranges it. It does nothing to undo the purge's broader human cost, which this campaign does not attempt to minimize, but it keeps a few more experienced commanders in the field for whatever remains of the war. The Gestapo's investigation, in the actual historical record, did not stay closed for long.",
            },
          ],
        };
        },
        get rommelFate44() {
          return {
          date: "OCTOBER 1944",
          title: "The Emissaries to Herrlingen",
          historicalRecord: true,
          situation:
            "Field Marshal Rommel's name has surfaced in the widening inquiry: his actual degree of involvement in the plot is, and remains to this day, honestly disputed among historians who have studied the same evidence and reached different conclusions. What isn't disputed is his standing: the most publicly celebrated German commander of the war, a name the regime's own propaganda spent years building into a myth of clean, skillful soldiering distinct from the SS's crimes. A public trial and disgrace of that name is not the same political event as trying any other implicated officer. The regime has to decide whether Rommel's case gets the same process as everyone else's, or a different one.",
          choices: [
            {
              label: "Offer Rommel a private arrangement: quiet suicide framed as natural death, his family protected",
              advisor: { name: "Burgdorf", position: "Mercy is not proposed. What is proposed is that the regime cannot afford what a public trial of this name would cost it, and Rommel understands that arithmetic as well as anyone in the room." },
              historical: true,
              setFlags: { rommelFate44: "quiet" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "caenAttrition",
              outcome:
                "What actually happened: two generals arrive at Rommel's home in Herrlingen on October 14th with the offer and its unstated alternative: take the cyanide, receive a state funeral and an official death by heart failure, and his family keeps its pension and its safety, or face the People's Court and whatever it decides for all three. Rommel chooses the former. The public is told the Desert Fox died of injuries from an earlier strafing attack, and Hitler sends an official wreath to the funeral of a man his own regime just had killed. The myth survives intact. The man does not.",
            },
            {
              label: "Treat Rommel identically to every other implicated officer: public inquiry, no private exception",
              advisor: { name: "Himmler", position: "Every exception for a famous name teaches every officer watching that reputation is its own kind of immunity, and losing the propaganda value is better than teaching that lesson twice." },
              setFlags: { rommelFate44: "trial" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "caenAttrition",
              outcome:
                "Not the historical choice, and one the regime's own propaganda ministry argues hardest against: subjecting the war's most publicly celebrated commander to the same process as every other implicated officer removes the appearance of favoritism at the direct cost of the myth that name was built to sustain. Whether Rommel was in fact more or less involved than the officers already convicted is a question a public proceeding would have to actually litigate rather than quietly avoid, and Goebbels's ministry spends real effort afterward managing a story it no longer fully controls.",
            },
          ],
        };
        },
        get hitlerDead44() {
          return {
          date: "JULY 20, 1944: THE FOLLOWING HOURS",
          title: "Valkyrie, Actually Live",
          historicalRecord: false,
          situation:
            "This is the single largest departure from the historical record this entire campaign reaches, on either front. In the real July 20th, Hitler survived, called Berlin personally, and a Guard Battalion commander named Remer (hearing that voice, unmistakably alive) turned against the plotters within the hour and crushed Operation Valkyrie by evening. That phone call is the hinge historians identify as the plot's actual failure point, more than any single tactical mistake the conspirators made. It cannot happen here. Radio traffic from Berlin now carries two contradictory stories at once: Valkyrie's own cover narrative (that the SS has moved against the state, and the Replacement Army is restoring order) and a second, thinner stream of loyalist confusion from officials who don't yet know which story is true. What every serious counterfactual study of this exact moment agrees on: without Hitler's voice on the phone, Valkyrie's actual chances were real, not decisive: the officer corps' loyalty oaths ran deep, but so did four years of watching this war's arithmetic turn against everything those oaths were sworn to.",
          choices: [
            {
              label: "Recognize the Replacement Army's authority: back the government seeking to end the war",
              advisor: { name: "Stauffenberg's own proclamation, relayed", position: "The proclamation declares the Führer dead and a new German government, under military authority, acting to save what can be saved, beginning with an end to a war that arithmetic like yours has called lost for two years." },
              historical: false,
              setFlags: { hitlerDead44: "backValkyrie" },
              favor: 2,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "caenAttrition",
              uncertain: [
                {
                  weight: modWeight(35, meters.manpower),
                  title: "The plot's own goal, actually reached",
                  setFlags: { hitlerDead44: "valkyrieSucceeds" },
                  next: "valkyrieGovernment44",
                  impact: { manpower: 2, fuel: 1, initiative: 1 },
                  outcome:
                    "The plotters' actual stated aim, achieved on odds this campaign judges real rather than certain: enough of the officer corps recognizes the new government for Valkyrie to hold Berlin and the western military districts, and within weeks a military government opens armistice contact with the Western Allies: Stauffenberg, Beck, and Goerdeler's circle were never unified on postwar terms, but ending the war before total occupation was the one goal every conspirator shared. This is not the earliest exit this campaign reaches (both armistice branches sign two years sooner, on their own separate roads) but it is the only one reached through actual regime change rather than the same government simply choosing differently, and it is reached by the one road no historical planning document ever mapped: a bomb, a table leg, and this campaign's own honest coin landing the other way.",
                },
                {
                  weight: 100 - modWeight(35, meters.manpower),
                  title: "The oath holds anyway",
                  setFlags: { hitlerDead44: "valkyrieCrushed" },
                  next: "caenAttrition",
                  impact: { manpower: -1, fuel: -1, initiative: -1 },
                  outcome:
                    "The harder-edged historical judgment, and the one most serious studies of this scenario actually favor: even without Hitler's voice on the phone, the officer corps' loyalty oath, four years of habituated obedience, and simple confusion about which story to believe hold enough of the military apparatus in place for loyalist officials (Himmler foremost among them, moving fast to claim the succession his SS already gives him the machinery to enforce) to isolate and crush the Berlin plotters within days rather than hours. The war continues, under a leadership now openly fractured between Himmler's SS apparatus and what's left of the Wehrmacht's own chain of command.",
                },
              ],
            },
            {
              label: "Refuse Valkyrie's authority: this headquarters answers to whoever the Party confirms, not a radio proclamation",
              advisor: { name: "a loyalist colonel, unnamed in the record", position: "An oath was taken to a man, and until a body or a Party-confirmed successor is shown, this command will not be handed to whoever spoke first on the radio." },
              historical: false,
              setFlags: { hitlerDead44: "loyalist" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "caenAttrition",
              outcome:
                "The reasoning that, on the balance of most serious counterfactual analysis, actually carries the officer corps: four years of oath and habit are a real force even against a bomb this campaign judges fully capable of killing him, and this headquarters' refusal to recognize a proclamation over confirmed succession is echoed widely enough that Valkyrie stalls outside Berlin. The war continues, but it continues under a leadership already visibly fractured, Himmler and the surviving party apparatus improvising an authority Hitler's own decree named but never expected to actually need this soon, on top of everything else this campaign has already cost.",
            },
          ],
        };
        },
        get valkyrieGovernment44() {
          return {
          date: "AUGUST 1944",
          title: "What the New Government Actually Does",
          historicalRecord: false,
          speculative: true,
          situation:
            "SPECULATIVE: this node exists entirely downstream of a coin this campaign has already told you landed the conspirators' way; nothing below claims historical grounding beyond the counterfactual literature's own best reasoning about what a Stauffenberg-Beck-Goerdeler military government would have actually done next. Berlin and the western military districts recognize the new government's authority. What that government was never unified on, in life or in this file, is what to do with it: Goerdeler's own circle intended a West-only separate peace, holding the eastern front while negotiating with London and Washington alone. Every serious study of this exact question returns the same hard fact standing in that plan's way: the Casablanca declaration and Roosevelt's own private assurances to Stalin bound the Western Allies against exactly this kind of separate deal, precisely to deny any future German government the stab-in-the-back myth a separate peace would hand it.",
          choices: [
            {
              label: "Pursue Goerdeler's actual plan: hold the East, seek terms with the West alone",
              advisor: { name: "Goerdeler's own circle, relayed", position: "The one man no Allied government would negotiate with has been removed, and that was not done in order to ask three governments for terms when two of them were never going to answer." },
              historical: false,
              setFlags: { valkyrieGovernment44: "westOnly" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "caenAttrition",
              uncertain: [
                {
                  weight: modWeight(30, meters.initiative),
                  title: "A back-channel opens despite the declared policy",
                  setFlags: { valkyrieGovernment44Result: "westOpens" },
                  next: "END",
                  impact: { manpower: 1, fuel: 1, initiative: 1 },
                  outcome:
                    "The minority case, and the one the original coin-flip's own outcome text already described: enough of Washington and London's working-level contacts read the regime change as real, rather than as a negotiating trick, that armistice contact opens on the western front alone: Roosevelt's assurances to Stalin notwithstanding. The eastern war continues entirely unchanged; what ends here is only ever the western half.",
                },
                {
                  weight: 100 - modWeight(30, meters.initiative),
                  title: "The declared policy holds, exactly as it was designed to",
                  setFlags: { valkyrieGovernment44Result: "refused" },
                  impact: { manpower: -1, fuel: 0, initiative: -1 },
                  outcome:
                    "The harder and, on the weight of the actual documentary record, more likely answer: the Casablanca commitment against separate deals was made precisely to prevent this exact maneuver, and it holds. Washington and London decline to treat with a government that removed Hitler but not the war on two fronts he started. Regime change in Berlin turns out not to be the same thing as an end to the war: the new government has real authority and nowhere yet to spend it.",
                },
              ],
            },
            {
              label: "Seek terms on every front, East included, and accept that Moscow likely says nothing back",
              advisor: { name: "a Kreisau Circle voice, relayed", position: "A peace offered to two of three enemies is arithmetic, not principle, because it excludes the enemy nearest the border. Ask everyone, and let the answer, or the silence, be honest." },
              historical: false,
              favor: 2,
              setFlags: { valkyrieGovernment44: "allFronts" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "END",
              outcome:
                "The costlier-looking path turns out to be the steadier one: Stalin's own well-documented suspicion of exactly this scenario, a Wehrmacht-officer coup cutting a separate deal with the West against Soviet interests, never gets the chance to harden into policy, because the new government never gave him grounds to accuse it of trying. Moscow doesn't answer, and the eastern war grinds on under whatever command structure survives the transition. But Washington and London, watching a government make the harder, more exposed offer rather than the convenient one, extend a working trust the West-only gambit was never going to earn: the one thing this file's various armistice branches all needed and didn't always get for free.",
            },
          ],
        };
        },
        get gestapoInquiry44() {
          return {
          date: "AUTUMN 1944",
          title: "The Inquiry Widens",
          historicalRecord: false,
          situation:
            "The Gestapo's investigation into July 20th, as it did historically, does not stay contained to the men who signed anything. Months later, a name comes back with a question attached: an officer this headquarters quietly reassigned rather than surrendered to the purge is now the subject of renewed inquiry, and the file makes clear the protection is not as forgotten as it needed to be." +
            (flags.protectorate42 === "terror"
              ? " The security apparatus doing the asking is the same one this command chose, two years ago, to run on maximum collective pressure rather than narrower targeting: a doctrine built for terrorizing occupied populations that turns out to work exactly as well on the officer corps it now investigates."
              : flags.protectorate42 === "targeted"
              ? " The inquiry, at least, reflects the narrower doctrine this command chose two years ago: a security service built to follow specific threads rather than cast a net over everyone in reach, for whatever small mercy that distinction is worth to the officer now under it."
              : ""),
          choices: [
            {
              label: "Protect them again: spend whatever standing is left to close the file a second time",
              advisor: { name: "Model", position: "He was not shielded once only to be abandoned when the account comes due again, and whatever this costs, it costs less than losing him now." },
              historical: false,
              setFlags: { gestapoInquiry44: "protectAgain" },
              favor: 2,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "caenAttrition",
              outcome:
                "The mercy is spent twice, which is rarer and more expensive than spending it once: the inquiry closes again, quietly, at a cost in standing that a headquarters this deep into the war can less afford to lose than it could in July. The officer survives the war in the field rather than in a cell. What the second favor in truth bought, beyond that one fact, is not something this campaign can price.",
            },
            {
              label: "Let the inquiry run its course: the risk of protecting them twice is no longer worth it",
              advisor: { name: "Keitel", position: "One mercy was permitted under the circumstances of July, and a second is not mercy but complicity, which the file will eventually say whatever the intention." },
              historical: false,
              setFlags: { gestapoInquiry44: "letRun" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "caenAttrition",
              outcome:
                "The harder, more self-protective choice: the inquiry proceeds without further interference, and an officer this headquarters once judged worth saving is not saved a second time. Whatever the war still needed from him, it does without, and the file records, without further comment, that the mercy shown in July had a limit, and this is where it was found.",
            },
          ],
          };
        },

        get caenAttrition() {
          return {
          date: "JULY 1944",
          title: "The Battle for Caen",
          historicalRecord: true,
          situation:
            "Six weeks since the landings, and the fighting in Normandy has settled into grinding attrition around Caen. Montgomery's forces have thrown three major offensives at the city (Epsom, then Charnwood, now Goodwood, over 400 tanks committed in a single push down the Orne valley) and the city is a ruin, mostly held, at a cost neither side is finished paying. The hedgerow country west of the city (bocage, the maps call it: a landscape built by nine hundred years of farmers, not tacticians, and it eats infantry) is where the American sector grinds forward a field at a time.\n\nRommel is not in this room. A strafing attack on his staff car two days ago left him hospitalized, and Kluge, recalled from the east to take Army Group B along with the overall western command, has inherited both the front and the argument Rommel spent six weeks making to a Berlin that kept deferring it: the armor concentrated in front of the British and Canadians at Caen is exactly the armor not watching the American sector, and an American breakout, if one comes, will come where the tanks are not." +
            (flags.normandy === "release" || flags.normandy === "counterattack" || flags.normandy === "waterline"
              ? " The reserve spent in the first week bought time then; there is less of it left to spend now."
              : " The reserve withheld in the first week is largely still intact: worn by six weeks of Allied air attack on anything that moves by daylight, but intact.") +
            (flags.dunkirk === "push"
              ? " The British and Canadian formations pressing Caen are the same rebuilt divisions thinner in veteran leadership since 1940: replacements filling gaps experience used to fill."
              : ""),
          choices: [
            {
              label: "Commit everything to holding Caen: the city is the fight, and Montgomery must be made to pay for every street of it",
              advisor: { name: "Kluge", position: "He inherited this argument and not the army's choices before him. Hold Caen and the war's attention is held where it can still be afforded, since the arithmetic has not changed with the command." },
              historical: true,
              setFlags: { caen: "holdFull" },
              impact: { manpower: -2, fuel: -1, initiative: 1 },
              next: "falaiseGerman",
              outcome:
                "What happened, roughly. Caen's defense consumed the panzer divisions historically concentrated there through July, and it worked on its own narrow terms: Montgomery's tanks paid dearly for Goodwood's ground, and the city held past every Allied schedule for it. What holding bought was time, not safety: the armor spent defending Caen is the armor not covering the American sector at Saint-Lô, and Bradley's Operation Cobra is about to find out exactly how thin that leaves the line it breaks.",
            },
            {
              label: "Thin Caen deliberately: shift armor west to where the real breakout risk sits",
              advisor: { name: "Rundstedt's staff", position: "Every division watching the British is one not watching the road to Avranches, and the man who ends this campaign quickly is Bradley, not Montgomery." },
              setFlags: { caen: "thinned" },
              favor: 1,
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "falaiseGerman",
              outcome:
                "The counterfactual correction, and an honest one about its own cost: weighting the American sector earlier does slow Cobra's breakout when it comes in late July, at the price of Caen falling sooner and cheaper than the historical fight cost the British and Canadians. There is no version of this July where both sectors hold. This one bets the more dangerous breakout is worth the less prestigious city: a bet the actual German command never quite let itself make in time.",
            },
            {
              label: "Fighting withdrawal from Caen's ruins: trade the city for a shorter line behind the Orne",
              advisor: { name: "Speidel", position: "A city is stone, and an army cannot be replaced on the same schedule. Better to explain why Caen fell than why the army defending it did not survive, and patience with orders that do not distinguish between the two is wearing thin." },
              setFlags: { caen: "withdraw" },
              favor: 2,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "falaiseGerman",
              outcome:
                "The option Hitler's standing orders never permitted in practice: a deliberate, planned withdrawal to a shorter line, preserving the army at the cost of the ground and the political statement holding it was meant to make. Berlin's directive is explicit: no withdrawal without authorization, and authorization does not come. What this path spends in defying that order, it recovers in an army that reaches August with more of itself intact than the historical version had.",
            },
          ],
          };
        },
        get falaiseGerman() {
          return {
          date: "AUGUST 1944",
          title: "The Pocket Closes",
          historicalRecord: true,
          situation:
            "The gap Patton's spearheads and the Canadians and Poles have been racing to close is nearly shut. Seventh Army and Fifth Panzer Army: the same formations that spent July " +
            (flags.caen === "holdFull"
              ? "burning strength to hold Caen"
              : flags.caen === "thinned"
              ? "split between Caen and the sector Cobra eventually broke"
              : "trading Caen for a line that didn't survive contact with Cobra either") +
            ": are streaming east through a shrinking neck under constant Allied air attack, the roads inside it already a byword among the men still on them. Hitler's standing order is to hold and counterattack toward Avranches, a directive several corps commanders are, at this hour, simply not transmitting further down their own chains of command.\n\nWhat's still open: how much of the army inside the pocket reaches the Seine before the neck closes for good, and whether it arrives as formations or as stragglers.",
          choices: [
            {
              label: "Order an immediate breakout: every formation for itself, east, now",
              advisor: { name: "Hausser", position: "No version of holding here ends with an army still existing tomorrow, and three divisions that can really attack are worth more than nine that can only apologize for not being ordered to." },
              historical: true,
              setFlags: { falaiseGerman: "breakout" },
              impact: { manpower: 1, fuel: -1, initiative: 0 },
              next: "arnhem44",
              outcome:
                "Substantially what happened, corps by corps rather than as one coordinated order: historians put the pocket's total at somewhere between 80,000 and 100,000 men, of whom an estimated 10,000 died and 50,000 were captured: leaving some 20,000 to 40,000 who escaped east through the closing gap in the pocket's final days, many as disorganized remnants rather than intact units, and most of the heavy equipment left behind. Costly, and still the better outcome available: the cadres that escape are what the autumn's defense along the German border gets built around.",
            },
            {
              label: "Hold and counterattack toward Avranches, exactly as ordered",
              advisor: { name: "Hitler", position: "The pocket is not a trap but a staging area for the counterattack that reopens the whole front, so transmit the order again in full to every command that has failed to acknowledge it." },
              setFlags: { falaiseGerman: "holdOrdered" },
              impact: { manpower: -3, fuel: -1, initiative: 0 },
              next: "arnhem44",
              outcome:
                "The order obeyed as given, against every corps commander's own read of the ground: the counterattack toward Avranches attacks into an Allied force that outnumbers it many times over and owns the air above the whole battlefield completely. Almost nothing escapes. The pocket closes with most of two field armies still inside it: the worst single loss the German army in the west suffers in the entire campaign, and one Berlin's own order made materially worse than the encirclement alone would have.",
            },
            {
              label: "Staggered withdrawal: hold the shoulders open as long as possible, funnel formations through in sequence",
              advisor: { name: "Model", position: "Not everyone at once and not no one, but a funnel and not a stampede: the shoulders hold while the center empties, corps by corps, in the order named." },
              favor: 2,
              setFlags: { falaiseGerman: "staggered" },
              impact: { manpower: 2, fuel: -1, initiative: 1 },
              next: "arnhem44",
              uncertain: [
                {
                  weight: modWeight(45, meters.manpower),
                  title: "The funnel holds its order",
                  impact: { manpower: 1, fuel: 0, initiative: 0 },
                  outcome:
                    "The harder discipline pays: a staged withdrawal, corps releasing in sequence while the shoulders hold, gets meaningfully more of the trapped force out as organized formations rather than stragglers: the difference between an army that can be reconstituted behind the Seine and one that has to be. Not free; the shoulders holding longer costs the units left holding them. But the pocket's final ledger reads better than either the historical scramble or the ordered counterattack.",
                },
                {
                  weight: 100 - modWeight(45, meters.manpower),
                  title: "The funnel collapses into the scramble anyway",
                  impact: { manpower: -1, fuel: 0, initiative: 0 },
                  outcome:
                    "The plan a closing pocket under constant air attack rarely survives contact with: the sequenced withdrawal breaks down into the same disorganized scramble the historical retreat produced, the shoulders give before the center empties, and the orderly funnel this path intended becomes, in practice, close to what happened anyway.",
                },
              ],
            },
          ],
          };
        },
        get arnhem44() {
          return {
          date: "SEPTEMBER 1944",
          title: "The Corridor and the Estuary",
          historicalRecord: true,
          situation:
            "The Western Allies have thrown a full airborne army at a single road: three-plus divisions dropped along a sixty-mile corridor through Holland, aimed at seizing the Rhine bridge at Arnhem and turning the whole Westwall. By luck or providence, II SS Panzer Corps is refitting near Arnhem itself: battered, but real armor sitting nearly on top of the furthest drop zone.\n\nMeanwhile a second, quieter question sits on the same map: Antwerp's port fell intact days ago, but the Allies can't use it while German forces hold the Scheldt estuary approaches, and every week Antwerp stays closed, the entire Allied advance runs on supply lines stretching back to Normandy." +
            (flags.normandy === "counterattack" || flags.normandy === "waterline"
              ? " The contested landing you fought in June bought this front its current shape: the Allied advance arrived here later and leaner than the historical September, which is part of why both of these defensive options exist at all."
              : ""),
          choices: [
            {
              label: "Throw everything at the corridor: crush the airborne carpet and hold Arnhem",
              advisor: { name: "Model", position: "An army has been landed on top of the headquarters and strung along one road, and a road is a thing he knows how to cut." },
              historical: true,
              setFlags: { arnhem: "corridor" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "ardennes",
              outcome:
                "Essentially what happened, and one of the last clear German defensive victories of the war: Model's improvised response cut the corridor repeatedly, and the British 1st Airborne at Arnhem was destroyed as a fighting force: roughly three-quarters of it killed or captured. The Rhine stayed uncrossed here until 1945.",
            },
            {
              label: "Contain the corridor economically: put the real weight into the Scheldt estuary garrisons",
              advisor: { name: "Student", position: "The bridge is dramatic, but the estuary is decisive, and an Allied army that cannot be supplied does not need to be defeated." },
              setFlags: { arnhem: "scheldt" },
              impact: { manpower: 0, fuel: 1, initiative: -1 },
              next: "ardennes",
              uncertain: [
                {
                  weight: modWeight(60, meters.fuel),
                  title: "The estuary holds past its historical date",
                  impact: { manpower: 0, fuel: 1, initiative: 1 },
                  outcome:
                    "The Scheldt garrisons historically held into November, keeping Antwerp closed and the Allied supply crisis alive for months: arguably a bigger strategic effect than Arnhem. Weighting the estuary harder extends that closure further; an intact bridge at Arnhem matters less to the Allies when nothing can be supplied across it at scale.",
                },
                {
                  weight: 100 - modWeight(60, meters.fuel),
                  title: "The garrisons are outfought regardless",
                  impact: { manpower: -1, fuel: 0, initiative: 0 },
                  outcome:
                    "The genuine uncertainty here lands the other way: the First Canadian Army's historical campaign to clear the Scheldt was itself hard-fought and eventually successful against exactly this kind of reinforced garrison. Extra weight here delays the port's opening, but doesn't prevent it: Antwerp still opens, just later than the historical schedule rather than not at all.",
                },
              ],
            },
            {
              label: "Split between both: hold the corridor and the estuary with divided forces",
              advisor: { name: "Rundstedt", position: "Two vital points and one reserve means both will be defended adequately, which is to say neither sufficiently." },
              setFlags: { arnhem: "split" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "ardennes",
              outcome:
                "The allocation trap again, in miniature: two half-answers. The corridor battle grinds on longer without the concentrated counterattacks that historically broke it, and the Scheldt garrisons hold on the historical schedule rather than beyond it. Not a disaster, just the quiet, familiar cost of refusing to choose.",
            },
          ],
        };
        },
        get ardennes() {
          return {
          date: "DECEMBER 1944",
          title: "The Ardennes",
          historicalRecord: !preservedReserve,
          meanwhile:
            flags.arnhem === "scheldt"
              ? "MEANWHILE (SHAEF: The supply conference has turned bitter) Antwerp, months captured, still unloads nothing past your estuary garrisons, and every plan on the table starves for it."
              : "MEANWHILE: SHAEF: Allied intelligence has noticed the radio silence in the Eifel and filed it as defensive redeployment.",
          situation:
            (meters.fuel <= -3
              ? "One last major western reserve remains in terms of men, but fuel reserves are too depleted to move it anywhere on the offensive. OKW's own logistics staff rule out any attack before it can even be proposed to Hitler; there simply isn't fuel to reach Antwerp or anywhere close to it."
              : (preservedReserve
                  ? "One last major western reserve remains, larger than the historical record thanks to divisions preserved earlier in the war. Hitler wants a single decisive offensive to split Allied lines and retake the port of Antwerp. "
                  : "One last major western reserve remains. Hitler wants a single decisive offensive to split Allied lines and retake the port of Antwerp. ") +
                "\n\nThe plan's own fuel annex is its confession: the attacking armies carry enough for roughly half the distance to Antwerp, with the balance to be captured from American dumps along the way: a supply plan that depends on the enemy's cooperation. Weather is the other estimate: the offensive needs sustained overcast to ground Allied air power, and the forecasters can promise days of it, not weeks.") +
            (flags.arnhem === "scheldt"
              ? " And one strategic irony shapes the target list: your Scheldt garrisons kept Antwerp closed so long that the port this offensive is designed to retake has barely begun unloading for the enemy: the prize, by your own prior success, is worth less than the plan assumes."
              : "") +
            (flags.falaiseGerman === "holdOrdered"
              ? " The reserve itself carries the summer's cost forward: Falaise's ordered stand rather than a real breakout cost this army most of two field armies, and 'one last major western reserve' is a smaller, thinner claim on this path than the historical December ever had to make."
              : flags.falaiseGerman === "staggered"
              ? " The reserve is real, and it is real partly because of a disciplined choice made at Falaise: a staged withdrawal that got meaningfully more of that pocket's strength out as formations rather than stragglers, strength this offensive is now spending."
              : "") +
            (flags.dunkirk === "push"
              ? " British XXX Corps, which historically helped seal the Meuse crossings against the northern shoulder of this offensive, draws on the same rebuilt formations still thinner in veteran leadership since Dunkirk: four and a half years and every decision since haven't fully closed that gap."
              : " British XXX Corps, which historically helped seal the Meuse crossings against the northern shoulder of this offensive, is built substantially around units that trace back to the intact 1940 evacuation: one of the longer-running dividends of that first decision in this campaign."),
          choices: (() => {
            const fuelExhausted = meters.fuel <= -3;
            const base = [];
            {
              base.push({
                checkLabel: "Matériel",
                disabledReason: fuelExhausted ? "insufficient fuel to reach Antwerp or attempt any offensive" : undefined,
                label: "Launch the Ardennes offensive",
                advisor: { name: "Hitler", position: "One blow through the Ardennes, as in 1940, will crack the enemy coalition along its seam, because wars are won by will." },
                historical: true,
                setFlags: { ardennes: "launch" },
                impact: { manpower: -3, fuel: -2, initiative: 1 },
                next: "hungaryGamble45",
                // Round 26 (item 1). The German side of the Ardennes offensive, from 16 December 1944. Facts checked
                // 2026-10-08 (Wikipedia, Battle of the Bulge): Unternehmen Wacht am Rhein, with Antwerp as its objective and
                // the Meuse to be reached between Liège and Dinant by the third day; Army Group B under Model, with the Sixth
                // SS Panzer Army (Dietrich), the Fifth Panzer Army (Manteuffel) and the Seventh Army (Brandenberger); 406,342
                // men, 557 tanks, 667 tank destroyers and assault guns and 4,224 anti-tank and artillery pieces at the start,
                // in 13 infantry divisions, 7 armoured divisions and an armoured brigade; the plan depended on capturing Allied
                // fuel, and on fog and low cloud grounding the Allied air forces; Kampfgruppe Peiper led the Sixth SS Panzer
                // Army's advance; Skorzeny's Operation Greif and the paratroop drop of Operation Stösser were part of the
                // plan; the siege of Bastogne was ended on 26 December by the lead of Patton's Third Army, and the offensive
                // was effectively broken by 27 December.
                keyBattleSubgame: {
                  id: "ardennesWacht44",
                  title: "Order of Battle: Watch on the Rhine",
                  flavor:
                    "Hitler's last offensive in the west is to go through the Ardennes in the dark of the year and reach Antwerp, splitting the Americans from the British, with the weather to keep the Allied aircraft on the ground. Model's Army Group B has three armies for it, the Sixth SS Panzer on the northern shoulder, Manteuffel's Fifth Panzer in the centre and Brandenberger's Seventh on the southern flank, and fuel for roughly half the distance, the rest to be taken from American dumps. The front they will hit is held by a few American divisions, some green and some tired. What's decided here is how the weight is spread between the two panzer armies, the infantry army that has to cover the southern flank, and the fuel columns and captured dumps the whole plan lives on.",
                  categories: [
                    { id: "sixthSS", name: "Sixth SS Panzer Army", meter: "fuel", strand: "steel" },
                    { id: "fifthPanzer", name: "Fifth Panzer Army", meter: "fuel", strand: "oil" },
                    { id: "seventhArmy", name: "Seventh Army", meter: "manpower" },
                    { id: "fuelColumns", name: "Fuel Columns and Captured Dumps", meter: "fuel" },
                  ],
                  // The two panzer armies carry the offensive, the northern a little more as the main effort; the flank army and the fuel least.
                  effectiveness: { sixthSS: 2.6, fifthPanzer: 2.4, seventhArmy: 1.7, fuelColumns: 1.9 },
                  orderOfBattle: {
                    sixthSS: {
                      units: [
                        "The Sixth SS Panzer Army under Dietrich, the main effort on the northern shoulder",
                        "Kampfgruppe Peiper, the armoured spearhead that led its advance",
                      ],
                      real: "Peiper's group was at the head of the advance and was held up by blown bridges and by the shortage of fuel.",
                    },
                    fifthPanzer: {
                      units: [
                        "The Fifth Panzer Army under Manteuffel, in the centre, aimed at the Meuse",
                        "The panzer divisions that had to take or bypass Bastogne",
                      ],
                      real: "Manteuffel's army surrounded Bastogne, and the siege was ended on 26 December by the lead elements of Patton's Third Army.",
                    },
                    seventhArmy: {
                      units: [
                        "The Seventh Army under Brandenberger on the southern flank",
                        "The infantry divisions that were to build a wall against an American counterattack from the south",
                      ],
                      real: "The Seventh Army had few tanks and little transport, and its job was to hold the shoulder while the panzer armies went through.",
                    },
                    fuelColumns: {
                      units: [
                        "The supply columns, carrying enough fuel for roughly half of the distance to Antwerp",
                        "The units detailed to capture and use American fuel dumps",
                      ],
                      real: "The captured fuel never came in the quantities the plan assumed, and fuel was a limit on the offensive from the first week.",
                    },
                  },
                  hardRule: { text: "Hitler's plan is not to be altered: the main weight stays with the Sixth SS Panzer Army on the northern route, and Antwerp is the only objective.", lockApproach: "northernWeight" },
                  conditions: "Winter in the Ardennes, with fog and low cloud, narrow roads in forest and valley, and snow beginning to fall.",
                  terrainModifiers: { sixthSS: 0.9, fifthPanzer: 0.95 },
                  terrainNotes: { sixthSS: "narrow roads and blown bridges", fifthPanzer: "narrow roads in forest and valley" },
                  attrition: [
                    { category: "sixthSS", atLeast: 3, meter: "fuel", delta: -1, reason: "An armoured spearhead burning its fuel on the way" },
                  ],
                  // Field decision: Bastogne. Facts: the Fifth Panzer Army surrounded the town on 20 December and it was
                  // not taken; the siege ended on 26 December. The three answers are the options before Manteuffel's
                  // commanders at the crossroads; the payoff against each American setup is modeled.
                  decisions: [
                    {
                      id: "theCrossroads",
                      time: "1330",
                      title: "The crossroads",
                      prompt: "The leading divisions have reached the road junction at Bastogne ahead of the Americans' reserves. A garrison is there already. The Meuse is a day and a half away, and the fuel will not last for much more than that.",
                      options: [
                        {
                          id: "takeTheTown",
                          name: "Storm the town at once",
                          note: "The roads are needed, and the garrison is thin for now.",
                          bonus: 0,
                          bonusByPosture: { thinAndGreen: 4, reserveNearby: -4, warnedInTime: -2 },
                          reportLine: "The leading divisions are ordered to storm the town before more Americans can reach it.",
                        },
                        {
                          id: "bypassIt",
                          name: "Leave a screen and go on to the Meuse",
                          note: "Saves time and fuel, and leaves a town behind the spearhead.",
                          bonus: 0,
                          bonusByPosture: { thinAndGreen: 0, reserveNearby: 3, warnedInTime: 1 },
                          reportLine: "A screen is left in front of the town and the panzer divisions turn on toward the river.",
                        },
                        {
                          id: "encircleIt",
                          name: "Surround the town and wait for the infantry",
                          note: "Slow and sure, and it gives the Americans a week.",
                          bonus: 0,
                          bonusByPosture: { thinAndGreen: -2, reserveNearby: 1, warnedInTime: 3 },
                          meters: { initiative: -1 },
                          costReason: "A week given to the Americans",
                          reportLine: "The town is surrounded on all sides, and the panzers wait for the infantry divisions to come up and take it.",
                        },
                      ],
                    },
                  ],
                  categoryContext: {
                    sixthSS:
                      "The Sixth SS Panzer Army is the main effort of the plan, on the northern shoulder, where the roads are narrowest and the Americans are strongest. Each commitment here puts more of its tanks and Panzergrenadiers into the first push.",
                    fifthPanzer:
                      "The Fifth Panzer Army has the best chance of getting through, on the ground the Americans hold lightly. Each commitment here puts more of its panzer divisions into the drive to the Meuse.",
                    seventhArmy:
                      "The Seventh Army is mostly infantry, and its task is to hold the southern flank against whatever the Americans bring up. Each commitment here puts more of its divisions on the line from which the panzers will be covered.",
                    fuelColumns:
                      "The fuel columns and the captured dumps are the thing the whole plan depends on. Each commitment here puts more trucks and more men into bringing fuel up behind the spearheads and into taking it where it lies.",
                  },
                  flashups: {
                    sixthSS: [
                      "A column of Panzer Vs and Panzer IVs pushes west along a forest road in the fog.",
                      "A Panzergrenadier company halts at a blown bridge while the engineers argue about the river.",
                      "Peiper's leading tank turns a corner and finds an American fuel dump burning.",
                      "A Tiger II halts on a hill road because its engine has run dry.",
                      "A tank is hit by a bazooka in a village street, and the column behind it halts.",
                    ],
                    fifthPanzer: [
                      "Manteuffel's leading panzers move through a village the Americans left in the night.",
                      "A panzer company drives west along a road that no map showed to be open.",
                      "A tank battalion halts because a column of American vehicles is burning across the road.",
                      "A staff car drives forward to a crossroads and finds the leading tanks already past it.",
                      "A reconnaissance battalion reports an unguarded bridge over a small river.",
                    ],
                    seventhArmy: [
                      "A division of infantry digs in on a ridge above the southern road.",
                      "A regiment wades a stream in the dark and takes a village without a shot.",
                      "A battalion attacks an American position in the forest and is thrown back.",
                      "Horse-drawn artillery halts on a slope because the road is blocked ahead.",
                      "A company takes a hundred prisoners from a headquarters in a farm.",
                    ],
                    fuelColumns: [
                      "A column of fuel trucks stands in a queue behind a broken bridge.",
                      "A fuel dump is taken intact by a leading company, and the tanks are filled from it within the hour.",
                      "A fuel dump is found burning, set alight by its American guard.",
                      "A staff officer counts the barrels in a depot and finds half of what the plan said.",
                      "A convoy loses its way in the forest roads and arrives a day late.",
                    ],
                  },
                  reportTimes: { open: "0530", contact: "0700", cats: ["0930", "1130", "1300", "1500"], reserve: "1700", counter: "1900" },
                  idleLines: {
                    sixthSS: [
                      "The Sixth SS Panzer Army is not pushed, and its tanks wait on the roads.",
                      "No more of the northern army goes into the first push, and it moves at the pace of its supply.",
                    ],
                    fifthPanzer: [
                      "The Fifth Panzer Army is not given more, and its divisions move slowly through the forest.",
                      "No more of the central army goes into the drive, and it goes on with what it had.",
                    ],
                    seventhArmy: [
                      "The Seventh Army is left to hold what it can, and the southern flank is covered thinly.",
                      "No more infantry go to the southern shoulder, and the line is left to the divisions already there.",
                    ],
                    fuelColumns: [
                      "No more fuel is brought forward, and the spearheads drive on what they carry.",
                      "The fuel columns are left to find their own way, and the dumps are not sought.",
                    ],
                  },
                  verdicts: ["The Meuse Is Reached", "The Offensive Runs Dry"],
                  verdictGrades: {
                    clean: "The armies went through together, the fuel kept pace with them, and the spearheads reached the Meuse in the time the plan allowed.",
                    costly: "The Meuse is reached, but the armies that reached it are spent, and the fuel is gone.",
                    marginal: "The offensive makes ground but stops short of the river, and the Allied reserves are coming up.",
                    total: "The offensive stops in the forest within sight of its start line, out of fuel and under the returning aircraft.",
                  },
                  counterattack: {
                    category: "seventhArmy",
                    severity: { thinAndGreen: 0, reserveNearby: 2, warnedInTime: 1 },
                    warn: {
                      1: "American armour is appearing on the southern flank in small groups.",
                      2: "The Third Army has turned north and is attacking the southern flank of the offensive in strength.",
                    },
                    results: {
                      repulsed: "The American attack on the southern flank is thrown back, and the shoulder holds.",
                      heldAtCost: "The southern flank holds against the Americans, at a heavy cost in the divisions that hold it.",
                      broke: "The Americans break through the southern flank, and the Fifth Panzer Army has to turn to meet them.",
                      gaveGround: "The southern flank gives ground, and the whole of the offensive is narrowed to protect it.",
                    },
                  },
                },
                outcome:
                  "Surprise and bad weather grounding Allied air support produced early gains, and then both estimates failed on schedule: the captured-fuel plan yielded far less than needed, and the skies cleared. The advance stalled well short of the Meuse, let alone Antwerp, and once Allied air power returned the offensive was broken within weeks. Germany's last mobile reserve in the west, spent for a bulge on a map.",
                uncertain: [
                    {
                      weight: modWeight(15, meters.fuel),
                      title: "The spearheads reach the Meuse",
                      setFlags: { ardennesResult: "meuse" },
                      impact: { manpower: -2, fuel: -2, initiative: 2 },
                      outcome:
                        "Speculative. The weather holds, the fuel from the first dumps is enough, and the leading panzers reach the Meuse between Liège and Dinant on the third day, as the plan required, with the bridges still standing. It does not take Antwerp, for which the plan did not have the fuel or the men, and the Allied reserves are already moving, but it gives the offensive a week and a bridgehead that the real one never had, at the price of every panzer division the army has left in the west.",
                    },
                    {
                      weight: 100 - modWeight(15, meters.fuel),
                      title: "The offensive runs dry",
                      setFlags: { ardennesResult: "stalled" },
                      impact: { manpower: -3, fuel: -2, initiative: 1 },
                      outcome:
                        "What happened. Surprise and bad weather grounding Allied air support produced early gains, and then both estimates failed on schedule: the captured-fuel plan yielded far less than needed, and the skies cleared. Bastogne held until Patton's lead elements reached it on December 26, and the offensive was broken by the 27th, well short of the Meuse, let alone Antwerp. Germany's last mobile reserve in the west, spent for a bulge on a map, at a cost of between 63,000 and 104,000 casualties.",
                    },
                ],
              });
            }
            base.push({
              label: "Hold remaining reserves for defense of the Rhine",
              advisor: { name: "Model", position: "The plan does not have a leg to stand on, and that is said by the man ordered to make it march to Antwerp." },
              setFlags: { ardennes: "hold" },
              favor: 1,
              impact: { manpower: 1, fuel: 1, initiative: 0 },
              next: "hungaryGamble45",
              outcome: fuelExhausted
                ? "Not really a choice at all by this point: there was never enough fuel banked to attempt an offensive, so holding in place is the only option OKW's own staff would put forward. The fuel shortage that merely stalled the historical offensive short of Antwerp forecloses it outright here."
                : "Model's actual verdict on the plan, nearly word for word, and militarily the more defensible choice: it preserves forces to slow the Allied advance into Germany itself rather than gambling them on an offensive whose own planning documents admitted the fuel wasn't there.",
            });
            if (preservedReserve && !fuelExhausted) {
              base.push({
                label: "A reinforced combined-arms offensive, using the divisions preserved earlier in the war",
                advisor: { name: "Manteuffel", position: "With real strength behind it, the plan's first hundred kilometers are achievable, but nobody can be promised the second hundred." },
                setFlags: { ardennes: "reinforced" },
                impact: { manpower: -1, fuel: -2, initiative: 0 },
                next: "hungaryGamble45",
                outcome: `With fuel reserves ${
                  meters.fuel <= -2 ? "already critically low" : meters.fuel <= 1 ? "thin but present" : "in comparatively good shape"
                }, extra divisions push the spearhead further into Belgium than the historical offensive managed. But the binding constraint was never manpower, it was fuel, and a bigger attack burns through what's left faster. It still stalls, just deeper into the advance and at a higher cost when it does.`,
              });
            }
            return base;
          })(),
        };
        },
        get hungaryGamble45() {
          return {
          date: "JANUARY – MARCH 1945",
          title: "The Last Reserve",
          historicalRecord: true,
          situation:
            "One question remains that is truly yours to decide, and it's the same question the war opened with: oil. Sixth SS Panzer Army, the last coherent armored reserve in the Reich, can go one of two places. Guderian is nearly shouting in conferences: the Soviets are on the Oder, sixty kilometers from Berlin, and every tank belongs there.\n\nHitler's answer is Hungary: the Nagykanizsa oil fields near Lake Balaton are the last crude the Reich controls, the synthetic plants are rubble under round-the-clock bombing, and an army with no fuel defends nothing. Both arguments are arithmetically true. Your fuel ledger says weeks of mobile operations remain at current consumption; your intelligence estimate of Soviet strength on the Oder has given up giving a number: it just reads 'overwhelming' now." +
            (flags.ardennes === "hold"
              ? " Because the Ardennes reserve was never spent, Sixth SS Panzer is not the last coherent formation: merely the last uncommitted one. The argument is the same; the stakes are marginally less absolute."
              : "") +
            (flags.ardennesResult === "meuse"
              ? " The Meuse was reached in December, and the army that reached it has not been replaced."
              : "") +
            keyBattleEcho("ardennesWacht44", flags),
          choices: [
            {
              label: "Send Sixth SS Panzer Army to Hungary: hold the last oil, as ordered",
              advisor: { name: "Hitler", position: "Without the Hungarian oil there is no war to lose, so the army goes to Balaton and the discussion is over." },
              historical: true,
              setFlags: { lastReserve: "hungary" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: flags.ardennes === "hold" ? "rhineDefense45" : (meters.manpower || 0) >= -1 ? "reichStand45" : "END",
              outcome:
                "Operation Spring Awakening, the last German offensive of the war, attacked at Lake Balaton in March 1945, into terrain the spring thaw had turned to marsh, and failed within two weeks. The oil fields were lost anyway, the last armored reserve was spent hundreds of kilometers from Berlin, and Guderian was dismissed for continuing to object. The war's final major decision repeated the pattern of a dozen before it: the resource argument won, and the resource was lost regardless.",
            },
            {
              label: "Hold Sixth SS Panzer on the Oder: defend Berlin, concede the oil",
              advisor: { name: "Guderian", position: "The Eastern Front is a house of cards with the enemy sixty kilometers from this room. The oil being defended cannot even be refined anymore, and the army belongs here." },
              setFlags: { lastReserve: "oder" },
              favor: 2,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: flags.ardennes === "hold" ? "rhineDefense45" : (meters.manpower || 0) >= -1 ? "reichStand45" : "END",
              outcome:
                "Guderian's position: a full SS panzer army on the Oder makes the Soviet drive on Berlin slower and costlier (weeks, plausibly, not months) and the honest fuel accounting undercuts the counterargument, since Hungarian crude could no longer be refined and distributed at scale under the bombing anyway. Berlin still falls; the question this choice actually decides is how many soldiers die in the time bought, and whether the front holds long enough for more of the army and population to move west before the end.",
            },
            {
              label: "Split the army: a corps to Hungary, the balance to the Oder",
              advisor: { name: "Jodl", position: "A compromise formation sent to Hungary might satisfy the Führer while the mass remains in the east, and it has the virtue of being approvable." },
              setFlags: { lastReserve: "split" },
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: flags.ardennes === "hold" ? "rhineDefense45" : (meters.manpower || 0) >= -1 ? "reichStand45" : "END",
              outcome:
                "The allocation trap one final time, at the smallest scale yet: a single corps can neither hold the Hungarian oil region nor meaningfully change the Oder balance. This war has offered the choice between concentration and dispersion perhaps ten times in this campaign, and dispersion has never once been the right answer. It isn't here either.",
            },
          ],
        };
        },
        get rhineDefense45() {
          return {
          date: "MARCH 1945",
          title: "The Rhine and the Bridge",
          historicalRecord: false,
          situation:
            "Only reachable because the Ardennes reserve was held rather than spent: the projection now diverges from a winter the historical record filled with a doomed offensive. The Western Allies have reached the Rhine along its length, and at Remagen, astonishingly, the Ludendorff railway bridge has fallen into American hands intact: a bridgehead growing by the hour on the east bank.\n\nThe historical version of this month was fought with the burnt-out survivors of the Bulge; you have something history didn't: the preserved western reserve, intact, fueled, and within striking distance. Your staff's estimates of the bridgehead's strength are hours out of date the moment they're written'a regiment' this morning, 'a division with armor crossing' by tonight. Whatever you intend to do about Remagen, the window is measured in days." +
            (meters.manpower <= -4
              ? " One option is already gone before the briefing ends: the 'preserved reserve' this month's whole premise depends on has been spent down by everything that came before it. There is no concentrated force left to counterattack with, only enough to man the defense in depth this staff was already going to recommend."
              : ""),
          choices: (() => {
            const reserveExists = meters.manpower > -4;
            const base = [];
            base.push({
              checkLabel: "Reserve",
              disabledReason: reserveExists ? undefined : "the preserved reserve has been spent down elsewhere",
              label: "Strike the Remagen bridgehead now with the preserved reserve: throw it back across the Rhine",
              advisor: { name: "Model", position: "A bridgehead is an infant to be killed in the cradle or raised as an enemy, and perhaps four days of cradle remain." },
              setFlags: { rhine45: "remagen" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: (meters.manpower || 0) >= -1 ? "reichStand45" : "END",
              uncertain: [
                {
                  weight: modWeight(40, meters.fuel),
                  title: "The cradle blow lands",
                  impact: { manpower: -1, fuel: -1, initiative: 2 },
                  outcome:
                    "The dice favor speed: the reserve reaches Remagen before the bridgehead can anchor, and a concentrated armored blow, the kind the historical March could only dream of, crushes the east-bank lodgment against the river. The bridge itself, already bomb-damaged, is finally dropped. It's the last clear German operational victory available anywhere in this campaign, and its honest price tag follows immediately: the Rhine is crossed elsewhere within weeks by deliberate assault, as it always would have been. A month bought, magnificently, and only a month.",
                },
                {
                  weight: 100 - modWeight(40, meters.fuel),
                  title: "The bridgehead wins the race",
                  impact: { manpower: -2, fuel: -1, initiative: 0 },
                  outcome:
                    "The dice side with the clock: American engineers throw pontoon bridges beside the damaged span faster than the reserve can concentrate under an air force that owns every approach road. The counterattack goes in against a bridgehead already corps-strength and dug in: the same fate as the historical Remagen counterattacks, just with a bigger force to lose. The preserved reserve, husbanded across years of disciplined choices, is spent in a week against a river line already breached.",
                },
              ],
            });
            base.push({
              label: "Concede Remagen: build the defense in depth behind the Ruhr's approaches instead",
              advisor: { name: "Heinrici", position: "The river is lost the moment a single bridge stands, so fight them in the country beyond it, where their navy cannot follow and their engineers cannot help." },
              setFlags: { rhine45: "depth" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: (meters.manpower || 0) >= -1 ? "reichStand45" : "END",
              outcome:
                "The conservative answer, and probably the correct one: no counterattack in March 1945 changes whether the Rhine is crossed, only where the reserve dies. A defense in depth east of the river (mobile, elastic, never encircled) slows the Western advance more per division than any riverbank stand, and keeps the reserve existing as a force the enemy must plan around. The Ruhr is still lost; the army defending it, against the pattern, is not lost with it.",
            });
            base.push({
              label: "Stand in the Ruhr itself: the arsenal of the Reich must be held, whatever surrounds it",
              advisor: { name: "Keitel", position: "The Führer has declared the Ruhr a fortress. Its industry is the war and its loss is the end, so the army stays with the factories." },
              setFlags: { rhine45: "ruhrPocket" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: (meters.manpower || 0) >= -1 ? "reichStand45" : "END",
              outcome:
                "It runs the script the historical war already wrote: the historical Ruhr defense ended in April 1945 as the largest encirclement of the entire western war: over 300,000 men in the pocket, and Model, refusing to surrender an army group or to preside over its death, dissolving it by order and walking into a forest with his pistol. Tying the preserved reserve to fixed industry repeats the fortress mistake one final time, at the largest possible scale, in the war's last month.",
            });
            return base;
          })(),
        };
        },
        get reichStand45() {
          return {
          date: "FEBRUARY 1945",
          title: "Where the Reich Stands",
          historicalRecord: false,
          situation:
            "Only reachable because this path still has an army worth allocating, and for the first time since 1940, the war's largest question is truly open in a way the historical February 1945 never allowed itself to ask out loud. Soviet forces stand on the Oder; the Western Allies close on the Rhine. The Reich cannot hold both. The historical answer was to pretend otherwise (fight everywhere, by standing order) while individual soldiers and eventually whole commands quietly weighted themselves east and hoped to surrender west.\n\nYour staff puts the actual choice on the table: pick the front. Every division facing one enemy is a division not facing the other, and the two occupations that follow this war will not be the same occupation. There is also a third file, mostly unopened since 1940: Festung Norwegen: nearly 350,000 men, intact, garrisoning a Norway no one has invaded, the largest unspent force the Reich still owns.",
          choices: [
            {
              label: "Weight the defense east: hold the Oder, let the western front thin",
              advisor: { name: "Heinrici", position: "Every soldier fights the enemy in front of him, but if the question is where Germany's women and children need the line to hold longest, the answer is not the Rhine." },
              setFlags: { reichStand: "east" },
              impact: { manpower: -1, fuel: 0, initiative: -1 },
              next: "oderDefense45",
              outcome:
                "This follows the instinct the war's final months made semi-official in practice if never in orders: resistance in the west thins toward the nominal while everything coherent turns east. The Anglo-American advance accelerates across a dissolving front, and every mile it gains is a mile more of Germany that ends the war under western occupation, with everything the next forty years made that distinction mean.",
            },
            ...(meters.fuel > -3
              ? [
                  {
                    label: "Weight the defense west: hold the Rhine hard, accept the Oder cannot be held long",
                    advisor: { name: "Model", position: "The western armies are the ones that can still be maneuvered against. The Rhine can be made expensive, but nobody in the room can make the Oder anything but brief." },
                    setFlags: { reichStand: "west" },
              favor: 2,
                    impact: { manpower: 0, fuel: -1, initiative: 0 },
                    next: "westWall45",
                    outcome:
                      "The cold ledger, stated without flinching: a mobile defense in the west is militarily the more executable operation, and every week it succeeds, Soviet forces drive deeper into a thinning east. This choice trades ground in the direction the historical instinct spent the war's final months desperately trading away from. The armies can be ordered to do it. The map that results is the price.",
                  },
                ]
              : []),
            {
              label: "Activate Festung Norwegen: evacuate what can move to the northern fortress and stand there",
              advisor: { name: "Böhme", position: "A third of a million men have fired barely a shot since 1940. If the Reich intends to keep an army intact past the end, it already has one, in Norway." },
              setFlags: { reichStand: "north" },
              favor: 2,
              impact: { manpower: 1, fuel: -1, initiative: 0 },
              next: "fortressNorth45",
              outcome:
                "The strangest real file in the OKW's cabinet, activated: Norway's garrison existed at this strength and sat out the war's end nearly untouched: Hitler's fixation on a British invasion of Norway that never came kept it there through every crisis that begged for it elsewhere. Moving anything more to it in 1945 means shipping across a Skagerrak the Royal Navy owns, at night, in whatever still floats.",
            },
            ...(meters.manpower >= 3
              ? [
                  {
                    label: "Contest both: the reserve this path banked is real enough to hold pieces of each front at once",
                    advisor: { name: "Heinrici", position: "Nobody in this war has been able to say that sentence and mean it, and it can be said now only because of what was not spent to get here." },
                    setFlags: { reichStand: "both" },
                    favor: 3,
                    impact: { manpower: -2, fuel: -1, initiative: 1 },
                    next: "oderDefense45",
                    outcome:
                      "The choice no historical February 1945 could have written down, because the army it required didn't exist by then. This path's did: years of decisions that didn't spend everything the moment they arrived leave a reserve real enough to reinforce the Oder without formally abandoning the Rhine. It doesn't change the war's arithmetic; nothing left in 1945 does. But for the first time this campaign, the choice isn't forced by what's already gone.",
                  },
                ]
              : []),
          ],
        };
        },
        get westWall45() {
          return {
          date: "MARCH 1945",
          title: "The Western Stand",
          historicalRecord: false,
          situation:
            "The posture no German command ever formally adopted, now in effect: the west is the priority front. The mobile forces this path preserved meet the Rhine crossings as a coherent defense rather than the historical scattering of burnt-out battlegroups, and every day the line holds, the reports from the east read worse. Soviet forces are across the Oder in strength against a deliberately thinned defense; the distance from their bridgeheads to Berlin is a morning's drive against what remains.",
          choices: [
            {
              label: "Elastic defense of the Rhine: trade river lines for time, keep the army intact",
              advisor: { name: "Model", position: "Delaying actions have been fought since Rzhev, and leave is asked to fight this one properly, by giving ground where ground is all it costs." },
              setFlags: { westStand: "elastic" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "flensburg45",
              outcome:
                "The most professionally executed version of it: an elastic defense makes the Rhine and every river behind it expensive without ever letting the army be pinned and destroyed: the longest coherent western resistance any path in this campaign can produce. Its consequence arrives on the same schedule: Berlin falls to Soviet assault with the west's best divisions three hundred miles away, facing the wrong enemy, by their own government's choice.",
            },
            {
              label: "Stand on the Rhine itself: no withdrawal from the river line",
              advisor: { name: "Kesselring", position: "The Rhine is the last terrain feature in Germany worth the word barrier. Behind it there is only geography, which has never stopped anyone." },
              setFlags: { westStand: "rigid" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: "flensburg45",
              outcome:
                "The war's oldest lesson repeats one final time, in its final month: a rigid river line against an enemy with total air supremacy and endless bridging equipment holds until it is crossed somewhere, and then everything committed to holding it is committed to a pocket. The western priority is spent on the defense most likely to destroy the very army it was chosen to preserve.",
            },
          ],
        };
        },
        get fortressNorth45() {
          return {
          date: "APRIL – MAY 1945",
          title: "Festung Norwegen",
          historicalRecord: false,
          situation:
            "The northern fortress, activated: Norway's 350,000-man garrison, reinforced by whatever the night convoys across the Skagerrak delivered, stands intact as the Reich's last coherent army: defending a country nobody is attacking. The war on the continent proceeds to its end without them. The question this fortress was never designed to answer now arrives on schedule: what, exactly, is an intact army for, once the state it serves has ceased to exist?\n\nThe honest strategic assessment fits in one line: Norway's garrison can prolong its own existence, not the war. No Allied planner needs to invade it; they need only accept its surrender a few weeks after everyone else's.",
          choices: [
            {
              label: "Hold the fortress past the continental surrender: the army capitulates last, intact, on its own terms",
              advisor: { name: "Böhme", position: "Surrender will come when ordered by a government that exists, to an enemy that has actually arrived, and until one of those conditions is met this command stands." },
              setFlags: { northStand: "held" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "END",
              outcome:
                "Substantially what the real Festung Norwegen did, extended by this path's deliberate weight behind it: the garrison outlasted the Reich itself, surrendering intact and unbeaten in the field days after the continental capitulation: the largest German force to end the war without ever being defeated. And the projection's honest coda: it changed nothing, because an army that is never engaged decides nothing. The fortress kept its men alive and its powder dry for a verdict that was rendered entirely elsewhere, which is, depending on the day you ask, either the emptiest result in this campaign or the most humane one.",
            },
            {
              label: "Open surrender talks early: hand the intact army over cleanly before the continental collapse completes",
              advisor: { name: "Terboven's staff officer", position: "Every week of waiting is a surrender to a harder peace as a smaller footnote, while surrender now, intact and orderly, has the men home by autumn." },
              setFlags: { northStand: "early" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "END",
              outcome:
                "The cleaner exit: an early, orderly capitulation of the northern fortress, before the continental surrender rather than after it, hands the Allies an occupation they never had to fight for and hands 350,000 men the shortest possible road home. It renders the entire northern strategy retroactively pointless, which the staff officer proposing it would note was always going to be true; the only choice was whether to admit it early or late.",
            },
          ],
        };
        },
        get oderDefense45() {
          return {
          date: "APRIL 1945",
          title: "Seelow Heights",
          historicalRecord: true,
          situation:
            "Only reachable because the army you've husbanded is still coherent enough to fight a set-piece defensive battle this late: the historical version of this front was far more improvised. Zhukov's offensive across the Oder is coming, and the intelligence, unusually, is precise: a captured Soviet soldier has given the attack's exact hour, and Heinrici, the Wehrmacht's acknowledged master of defense, believes him.\n\nHis proposal is characteristic: quietly pull the infantry off the first trench line hours before the attack, let the largest artillery bombardment of the war fall on empty positions, then meet the assault from the second line while Zhukov's own searchlights, meant to blind the defenders, silhouette his infantry against the night. Hitler's standing doctrine says the opposite: not one step back from the forward line.",
          choices: [
            {
              label: "Approve Heinrici's withdrawal trick: let the bombardment hit empty trenches",
              advisor: { name: "Heinrici", position: "Zhukov will spend a million shells killing empty dirt, and he will be allowed to." },
              historical: true,
              setFlags: { seelow: "heinrici" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: (meters.manpower || 0) >= 1 && (meters.fuel || 0) >= 0 ? "berlinDefense45" : "finalWeek45",
              outcome:
                "What Heinrici in fact did, and it worked: the opening bombardment fell largely on vacated positions, the searchlights backlit the attackers, and Seelow Heights cost Zhukov several days and casualty figures usually put above thirty thousand for a battle he expected to win in one morning. It changed the war's ending by days, not weeks, but it stands as the last demonstration that the army could still fight a battle on its own terms when its commanders were allowed to.",
            },
            {
              label: "Hold the forward line as doctrine demands: meet the bombardment in place",
              advisor: { name: "Krebs", position: "The Führer's standing order admits no withdrawals, anticipatory or otherwise, and the first line holds the first line." },
              setFlags: { seelow: "forward" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: (meters.manpower || 0) >= 1 && (meters.fuel || 0) >= 0 ? "berlinDefense45" : "finalWeek45",
              outcome:
                "The doctrine-compliant projection, and its arithmetic is short: the heaviest artillery concentration of the entire war, Zhukov massed guns at densities of hundreds per kilometer, lands on fully manned positions. The defense of the Heights is broken in the opening day rather than the fourth, and the troops lost in the bombardment are the same ones who historically made the delaying battle possible.",
            },
            {
              label: "Skip the Heights: pull everything back to Berlin's outer defense ring now",
              advisor: { name: "Weidling", position: "The Heights buy days, while the city could bleed them for weeks. Give him the divisions inside the ring while they are still divisions." },
              setFlags: { seelow: "berlinRing" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: (meters.manpower || 0) >= 1 && (meters.fuel || 0) >= 0 ? "berlinDefense45" : "finalWeek45",
              outcome:
                "Urban defense in depth is the one fight where the attacker's artillery and air superiority matter least. But it surrenders the Oder line's delaying value for nothing in exchange (Berlin's ring gets the same defenders either way, just sooner) and the days Seelow historically bought were days in which real people moved west. Time was the only thing left worth buying, and this choice sells it.",
            },
          ],
        };
        },
        get berlinDefense45() {
          return {
          date: "APRIL 1945",
          title: "Volkssturm and the Last Muster",
          historicalRecord: true,
          situation:
            "The ring around Berlin is closing, but this path has preserved something most of the collapsing German war effort by April 1945 did not: enough organized strength that the city's defense is a real question of allocation, not just improvisation. Goebbels, as the Reich Defense Commissioner for Berlin, has already ordered the Volkssturm (the last-ditch militia of Hitler Youth boys as young as twelve and men in their sixties, armed with whatever rifles and Panzerfausts remain) into the line alongside what's left of the regular Wehrmacht and SS. The choice in front of you is how far to lean on that militia rather than the trained forces this path has actually kept intact.",
          choices: [
            {
              label: "Commit the Volkssturm and Hitler Youth units to the perimeter alongside regular forces",
              advisor: { name: "Goebbels", position: "The Führer has asked Berlin to defend itself, and every rifle in the city answers that question, whoever is holding it." },
              historical: true,
              setFlags: { berlinDefense45: "volkssturm" },
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "finalWeek45",
              outcome:
                "What happened, and it is among the most somber facts the historical Battle of Berlin contains: boys as young as twelve fought and died defending a perimeter built partly on their conscription, alongside men well past conventional fighting age. It bought the defense real additional days, the ring held longer than its trained-troop strength alone would have managed, at a human cost the extra time does not offset, whatever this campaign's meters record.",
            },
            {
              label: "Limit the defense to trained regular forces: stand down the Volkssturm and Hitler Youth units",
              advisor: { name: "Weidling", position: "He commands soldiers, and did not become Berlin's defense commander to spend children buying days the war no longer has any use for." },
              setFlags: { berlinDefense45: "regulars" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "finalWeek45",
              outcome:
                "Not the historical order, but Weidling's own postwar testimony suggests real reservations about the militia's use that he never acted on at the time. Releasing the least-trained conscripts from the line shortens the perimeter's defense by some days, which this campaign's meters record as a 'loss' of time. It is the one choice on this entire timeline that treats extending the war by a single further day as not straightforwardly worth its cost.",
            },
          ],
        };
        },
        get finalWeek45() {
          return {
          date: "LATE APRIL 1945",
          title: "The Final Week",
          historicalRecord: true,
          situation:
            "Berlin is encircled or days from it, and one formation is left with freedom of action: Wenck's Twelfth Army, west of the city, young and improvised but intact. The order from the bunker is to relieve Berlin.\n\nWenck's staff has run the arithmetic and knows relief is impossible, but they've also noticed what IS possible: their front touches the Elbe, where the Americans have halted, and every hour they hold a corridor open, soldiers and civilians stream west across it to surrender to an army that isn't the one they've spent four years fighting. There are no meters left that matter here. This decision moves no lines on any map that will exist in a month. It's the last order, and it's only about people.",
          choices: [
            {
              label: "Order Twelfth Army to fight into Berlin: the relief attempt, as commanded",
              advisor: { name: "Keitel", position: "The Führer expects Twelfth Army in Berlin, and history is watching what German soldiers do with their capital." },
              setFlags: { finalWeek: "relief" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "flensburg45",
              outcome:
                "The order as given, taken literally: a projection in which Wenck's army spends itself against Soviet rings that outweigh it many times over, achieving nothing the bunker's maps imagined. Historically, Wenck attacked just far enough toward Potsdam to open an escape route for troops trapped there, then deliberately stopped, because his real judgment was the other choice on this list.",
            },
            {
              label: "Hold the Elbe corridor open: cover the flight west for as long as the line lasts",
              advisor: { name: "Wenck", position: "The city can no longer be saved, but the people walking out of it still can, and that is the army's last mission whatever the last order says." },
              historical: true,
              setFlags: { finalWeek: "elbe" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "flensburg45",
              outcome:
                "Substantially what Wenck actually did, and arguably the last defensible order of the German war: Twelfth Army held its bridgeheads while somewhere on the order of a hundred thousand or more soldiers and uncounted civilians crossed the Elbe into American captivity before the front dissolved. It shortened nothing and won nothing, the war was already over in every sense but the signature, but it decided, at the very end, what the remaining hours were for.",
            },
          ],
        };
        },
        get flensburg45() {
          return {
          date: "MAY 1945",
          title: "The Flensburg Government",
          historicalRecord: true,
          situation:
            "Hitler is dead by his own hand in the Berlin bunker; his political testament names Grand Admiral Dönitz as his successor. What Dönitz inherits from a schoolhouse headquarters in Flensburg is not a government in any working sense: it is the authority to decide exactly how the surrender happens, and nothing else.\n\nThe Casablanca Conference declared, back in January 1943, that the Allies would accept nothing short of unconditional surrender: a policy that was never aimed only at Hitler's regime specifically. It applies to whichever government holds the authority to sign, this one included. The only real decision left is how that signature is arranged, and how many more people cross into Allied lines before it is.",
          choices: [
            {
              label: "Attempt a surrender to the Western Allies only: keep fighting the Soviets to buy time in the east",
              advisor: { name: "Dönitz", position: "Every day this can be held open in the west is a day more of the people walk out of the east instead of being caught in it, and the little authority left will be spent on exactly that." },
              historical: true,
              setFlags: { surrenderPath: "westOnly" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "END",
              outcome:
                "What Dönitz really attempted. Eisenhower flatly refused a partial surrender and threatened to close the western front to any further German refugees unless the capitulation covered all fronts simultaneously. Dönitz's delegation signed at Reims on May 7, but in the days of partial, informal surrenders that preceded it (Army Group G on May 5, German forces in the Netherlands, northwest Germany, and Denmark to Montgomery on May 4), a real, if uncounted, number of soldiers and refugees crossed west ahead of the Soviet advance. Stalin, unsatisfied that a French schoolhouse was where his war should be formally ended, insisted on a second ratification in Soviet-occupied Berlin on May 8–9: the ceremony now remembered as Karlshorst.",
            },
            {
              label: "Sign a full, simultaneous surrender on all fronts immediately",
              advisor: { name: "Jodl", position: "The partial surrender was always going to be refused, so sign the whole thing now and stop pretending to leverage that does not exist." },
              setFlags: { surrenderPath: "full" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "END",
              outcome:
                "A careful extrapolation of the more clear-eyed reading of the Allies' position: rather than spending days on a partial surrender that history shows was always going to be refused, capitulation is offered on every front at once from the start. The war ends a little sooner and with less last-minute confusion, and correspondingly fewer of the refugees and soldiers still east of the line have the extra days the historical delay bought them to reach the west instead.",
            },
            {
              label: "Order the government and remaining forces into the Alpine Redoubt: continue resistance from the mountains",
              advisor: { name: "Kesselring", position: "Bavaria and the Tyrol have mountains, tunnels and supply dumps stocked for a year, and the propaganda has called it a fortress. Let it be found out whether it is one." },
              setFlags: { surrenderPath: "redoubt" },
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "alpineRedoubt45",
              outcome:
                "The regime's own propaganda spent a year building the Alpine Redoubt into a fortress of fanatical last resistance: mountain divisions, hidden factories, months of holdout. It was mostly a story, one Allied intelligence took seriously enough to divert real divisions guarding against a threat that barely existed. Ordering the retreat means finding out, in person, which version was true.",
            },
          ],
        };
        },
        get alpineRedoubt45() {
          return {
          date: "MAY 1945",
          title: "The Redoubt That Wasn't",
          historicalRecord: false,
          situation:
            "The mountains hold scattered supply dumps and disorganized units, not the fortress of the propaganda reels. There are no hidden factories, no mountain divisions waiting in prepared positions, no plan beyond the word 'redoubt' itself. Troops arriving in Bavaria and the Tyrol are, overwhelmingly, men who have already privately decided the war is over: the myth was always more useful to the regime as an idea than it was ever going to be as a defense.",
          choices: [
            {
              label: "Order the last resistance anyway, as the propaganda promised",
              advisor: { name: "Kesselring", position: "The order was given, and there is no pretending in this room that it will be obeyed the way an order once was." },
              setFlags: { redoubtOutcome: "attempted" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "END",
              outcome:
                "The myth collapses within days, as its own logistics always guaranteed it would. Most units surrender the moment Allied forces actually arrive: there is no supply to sustain a holdout, no fortified line to man, and vanishingly little will left for either. The Alpine Redoubt's real historical function was as an American intelligence estimate, not a German defense; ordering it into being here only confirms which of those two things it actually was.",
            },
            {
              label: "Abandon the plan quietly: surrender with everyone else",
              advisor: { name: "Kesselring", position: "The mountains were always a better story than a fortress, and there is no shame in admitting it before more men die finding it out." },
              setFlags: { redoubtOutcome: "abandoned" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "END",
              outcome:
                "The clear-eyed recognition that the mountain fortress was always more valuable to the regime as an Allied fear than as a German asset. Standing it down quietly costs nothing further and spares the last days of the war a final, pointless chapter.",
            },
          ],
        };
        },
      };

      return nodes[id];
    },
    historicity(flags) {
      const HIST = {
        dunkirk: "halt", sealion: "attrition", norway: "full", caseYellow: "manstein", balkans: "full", crete41: "assault", bismarck41: "launched", barbarossa: "launched", vichy: "occupied", july20: "purge", eastFront: "kiev",
        winterCrisis: "push41", usWar: "declared", med42: "egypt", caseBlue: "both",
        alamein: "push", stalingrad: "airlift", atlantic: "withdraw", kursk: "attack",
        priority1943: "italyFirst", italyOutcome: "suppressed", normandy: "hold",
        bagration: "south", arnhem: "corridor", ardennes: "launch", lastReserve: "hungary",
        seelow: "heinrici", finalWeek: "elbe", surrenderPath: "westOnly",
        backhand43: "strike",
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
      const M = MONTH_NAMES;
      if (flags.dismissed) {
        return { stamp: "PATTERN NOTICED", prose: "the pattern finally noticed", exact: false };
      }
      if (flags.pathVariant === "earlyCollapse") {
        const p = flags.finalStand === "withdraw" ? "Autumn 1943" : "Summer 1943";
        return { stamp: p.toUpperCase() + " (PROJECTED)", prose: p, exact: false };
      }
      if (flags.pathVariant === "collapse44") {
        const p = flags.finalStand === "oderLine" ? "February 1945" : "January 1945";
        return { stamp: p.toUpperCase() + " (PROJECTED)", prose: p, exact: false };
      }
      if (flags.pathVariant === "armisticeWest")
        return { stamp: "WINTER 1942 (SPECULATIVE)", prose: "the winter of 1942", exact: false };
      if (flags.pathVariant === "eastArmistice")
        return { stamp: "SPRING 1942 (SPECULATIVE)", prose: "the spring of 1942", exact: false };
      if (flags.hitlerDead44 === "valkyrieSucceeds" && flags.valkyrieGovernment44Result !== "refused")
        return { stamp: "AUGUST 1944 (SPECULATIVE)", prose: "August 1944: regime change, not schedule, ends this war", exact: false };
      if (flags.pathVariant === "noBarbarossa") {
        const p =
          flags.atomic45 === "terms"
            ? "Summer 1945"
            : flags.atomic45 === "fightOn"
            ? "Autumn 1945"
            : flags.atomic45 === "disperse"
            ? "Spring 1946"
            : "Winter 1945–46";
        return { stamp: p.toUpperCase() + " (PROJECTED)", prose: p, exact: false };
      }
      if (flags.dispersedReich45)
        return { stamp: "SPRING 1946 (SPECULATIVE)", prose: "the spring of 1946", exact: false };
      // OKW's end date is NOT derived from the initiative meter, unlike STAVKA's and SHAEF's.
      // For those two, pressing the tempo brings the end forward and the mapping is monotonic.
      // For Germany it is not: this command lengthens its war by yielding — depth, dispersal,
      // elastic defense — and shortens it by attacking, which early on meant winning sooner and
      // late on meant losing sooner. Initiative and duration are frequently opposed here and
      // sometimes aligned, so no single sign is correct across the campaign. Rather than encode
      // an incoherence, duration is read from the flags that actually record it — how the war
      // was ended, and how much depth was traded for time. Initiative stays what it says it is:
      // a measure of whether this command was setting the terms. The date stamp carries the
      // calendar on its own.
      const endurance = this.endurance(flags, meters);
      let idx = 64 + Math.max(-7, Math.min(7, endurance));
      idx = Math.max(57, Math.min(71, idx));
      const exact = idx === 64 && this.historicity(flags).ratio >= 0.75;
      if (exact) return { stamp: "MAY 8, 1945", prose: "May 8, 1945", exact: true };
      const p = `${M[idx % 12]} ${1940 + Math.floor(idx / 12)}`;
      return { stamp: p.toUpperCase() + " (PROJECTED)", prose: p, exact: false };
    },
    // How long this war ran, as distinct from how much initiative was held. See the note in
    // projectedEnd: for OKW those are different questions and often opposed ones.
    endurance(flags, meters) {
      return (
        (flags.dispersedReich45 ? 3 : 0) +
        (flags.deliveryDelayed45 ? 2 : 0) +
        (flags.atomic45 === "fightOn" ? 1 : 0) +
        (flags.atomic45 === "terms" ? -2 : 0) +
        (flags.finalStand === "withdraw" ? 1 : 0) +
        (flags.finalStand === "oderLine" ? 1 : 0) +
        (flags.finalStand === "hold" ? -2 : 0) +
        (flags.finalStand === "fortresses" ? -1 : 0) +
        (flags.northStand === "held" ? 1 : 0) +
        (flags.northStand === "early" ? -1 : 0) +
        (flags.surrenderPath === "redoubt" ? 1 : 0) +
        (flags.surrenderPath === "full" ? -1 : 0) +
        (flags.stockholm43 === "pursued" ? -1 : 0) +
        // Manpower is the one meter that genuinely does buy duration for this command: an army
        // that still exists can keep conducting a defense, whatever posture it took to get there.
        Math.round((meters.manpower || 0) * 0.4)
      );
    },
    positionLabel(flags, meters) {
      // First match wins. Order is load-bearing and was measured against simulated playthroughs —
      // sorting these alphabetically or by narrative date makes most of the list unreachable.
      // Three tiers: (1) campaign-shape overrides that redefine the whole war, (2) endgame
      // outcomes, which should out-rank a mid-war choice when naming a run, (3) everything else
      // rarest-first, so the title names the most distinctive thing the player actually did.
      // Previously atomic45 and finalStand sat below broad mid-war flags and could never win
      // despite matching thousands of runs each.
      if (flags.dismissed) return "The Pattern, Noticed";
      // Historical Divergence Mode: only reachable when the moscowHolds fork fired AND Moscow
      // was actually captured through moscowRace41's own (still-uncertain) roll — the fork
      // doesn't force this outcome, it makes the existing rare path more likely and gives the
      // result flowing from it a distinct title. Placed this high because the combination is
      // rarer than anything else in this chain.
      if (flags.forkMoscowHolds && flags.moscowCaptured) return "The Winter That Wasn't Supposed to Happen";
      // Round 20: forkPanthersFixed nudges the same Kursk roll rather than forcing a result —
      // reachable only on the "breach" branch, the same rare-combination logic as forkMoscowHolds
      // above, so it sits at the same priority.
      if (flags.forkPanthersFixed && flags.kurskResult === "breach") return "Citadel, Fought With Tanks That Didn't Burn";
      // Round 20: forkCaucasusThin doesn't change what Case Blue's own choice produces — "both"
      // is a player choice available with or without the fork — it just makes the overextension
      // that historically followed less inevitable. Only reachable on that specific choice.
      if (flags.forkCaucasusThin && flags.caseBlue === "both") return "The Overextension That Didn't Bite";
      // Extreme meter states outrank the flag chain below — see the Soviet chain for the
      // reasoning. Moderate tiers stay at the bottom as fallbacks by design.
      // Only the POSITIVE extreme is promoted. A German army that finished the war essentially
      // intact is genuinely the most remarkable fact about such a run. The negative extreme is
      // deliberately NOT promoted: low-manpower runs are exactly the collapse endings, and those
      // already have specific titles (finalStand, atomic45) that describe them far better than a
      // meter reading would. Promoting it stole those endings — measured, then reverted.
      if ((meters.manpower || 0) >= 7) return "An army that barely resembles the historical one";
      // iberianQuestion42 was promoted once already (see the removed comment above) but a second
      // regression crept back in: reaching that node turned out to correlate at 100% with one of
      // the atomic45/finalStand/pathVariant/surrenderPath/northStand flags below also being set —
      // so it went dead again without ever moving in the source. Measured across 40,000 runs: 0/2,000
      // iberianQuestion42-set runs ever reached this check when it sat below that block. Promoted
      // a second time, now ahead of the whole endgame-outcomes tier rather than behind part of it.
      if (flags.iberianQuestion42 === "payMinimum") return "The Transaction, Not the Alliance";
      if (flags.iberianQuestion42 === "payFull") return "An Empire for a Signature";
      // atomic45 and finalStand are sub-outcomes NESTED INSIDE a pathVariant branch — measured
      // across simulated runs, atomic45 is only ever set on the noBarbarossa path and finalStand
      // only on the collapse path, both at 100% co-occurrence. So they must rank ABOVE their own
      // parent pathVariant: the specific way a war ended is a better title than the shape of the
      // war that contained it. The pathVariant labels below still catch runs that reached the
      // branch without resolving one of these endings.
      if (flags.stockholmSerious43) return "The Channel That Was Real";
      if (flags.stockholmLeverage43) return "A Conversation Moscow Wanted Overheard";
      if (flags.rommelLine43) return "Italy, Sold Cheaply and On Purpose";
      if (flags.deliveryDelayed45) return "The Mission That Was Not Flown";
      if (flags.atomic45 === "contestDelivery") return "The Interception Nobody Could Plan";
      if (flags.atomic45 === "disperse") return "A Country Taken Apart to Last Longer";
      if (flags.atomic45 === "terms") return "Surrender Without the Fire";
      if (flags.atomic45 === "fightOn") return "The Fortress Meets the Bomb";
      if (flags.atomic45 === "race") return "The Race Never Run";
      if (flags.finalStand === "oderLine") return "The Army That Reached the Oder";
      if (flags.finalStand === "fortresses") return "Pockets, Not a Line";
      if (flags.finalStand === "withdraw") return "The Retreat That Held Together";
      if (flags.finalStand === "hold") return "Destroyed in Place";
      if (flags.pathVariant === "earlyCollapse" || flags.pathVariant === "collapse44")
        return "Collapse ahead of schedule";
      if (flags.pathVariant === "noBarbarossa") return "The war that never went east";
      if (flags.pathVariant === "armisticeWest") return "The Western Armistice: Speculative";
      if (flags.pathVariant === "eastArmistice") return "The Volga Line: Speculative";
      if (flags.hitlerDead44 === "valkyrieSucceeds" && flags.valkyrieGovernment44Result !== "refused") return "The Bomb, The Table Leg, The Coin: Speculative";
      if (flags.surrenderPath === "redoubt")
        return flags.redoubtOutcome === "attempted" ? "The Redoubt That Wasn't" : "The Myth Stood Down";
      if (flags.surrenderPath === "westOnly") return "Flensburg: Signed Twice";
      if (flags.surrenderPath === "full") return "Reims, Once, in Full";
      if (flags.northStand === "held") return "The Untouched Army";
      if (flags.northStand === "early") return "The Fortress That Conceded";
      if (flags.volgaOverreach42 === "press") return "Napoleon's Weather, Repeated";
      if (flags.kurskAftermath43 === "press") return "The Good Week, Spent Anyway";
      if (flags.kurskAftermath43 === "hold") return "One Good Week, Left as One";
      if (flags.firmestLine43 === "probe") return "The Firm Line, Spent Trying for More";
      if (flags.firmestLine43 === "bank") return "The Quiet Winter";
      if (flags.centerArmyPreserved44 === "transferWest") return "Spent in Normandy Instead";
      if (flags.centerArmyPreserved44 === "holdEast") return "The Army That Held the East";
      if (flags.suezOpening42 === "consolidate") return "The Patience Fuel Bought";
      if (flags.suezOpening42 === "drive") return "The Canal in Sight";
      if (flags.atlanticAttrition43 === "withdrawLate") return "The Withdrawal, Delayed";
      if (flags.atlanticAttrition43 === "holdCourse") return "The Arm Bled Dry";
      if (flags.gestapoInquiry44 === "letRun") return "Where the Mercy Ended";
      if (flags.gestapoInquiry44 === "protectAgain") return "The Mercy Spent Twice";
      const h = this.historicity(flags);
      // This names how long the war ran, which for OKW is endurance rather than initiative.
      // A dispersed, yielding Reich lasts longest; an aggressive one ends sooner, whichever way
      // that ending goes. Keying it to the posture meter had it backwards for most runs.
      const dur = this.endurance(flags, meters);
      // The four POSITIVE-endurance titles that used to sit here (h.ratio-near-1/dur-near-0,
      // dur>=4, dur>=2, dur>=1) were measured out: endurance()'s positive contributions come
      // from dispersedReich45/deliveryDelayed45/atomic45=fightOn|terms/finalStand=withdraw|
      // oderLine — the exact flags checked with higher priority above. Any run with dur>=1 has,
      // by construction, already matched one of those and returned. 0/6,029 dur>=1 runs across
      // 40,000 simulated playthroughs ever reached this point. Deleted, along with the three of
      // their four ENDINGS_GALLERY entries that existed (the fourth was never listed there
      // either). The negative tier below has no such circularity — dur<=-4 can
      // and does arise from low manpower alone, which isn't checked earlier — and stays.
      if (dur <= -4) return "The Debt Called Early";
      if ((meters.initiative || 0) >= 6) return "The Command That Set the Terms";
      if ((meters.initiative || 0) <= -6) return "Answering, Never Asking";
      if (meters.manpower >= 7) return "An army that barely resembles the historical one";
      // "The Army That Came Home Whole" (manpower>=3) sat here and never fired: manpower this
      // positive almost always comes paired with one of the endgame-outcome flags above (finalStand
      // ="oderLine", northStand="held", centerArmyPreserved44, etc.) that already claimed the
      // title. 0/4,099 qualifying runs across 40,000 playthroughs reached this line. Deleted,
      // along with its ENDINGS_GALLERY entry.
      if (meters.manpower <= -6) return "An army that stopped existing as an army";
      if (meters.manpower <= -3) return "The Bill History Didn't Write";
      return "The Same War, Differently Accounted";
    },
    epilogue(flags, meters) {
      if (flags.dismissed) {
        return (
          "This campaign ends here, and not on any front. Führer Mode's political capital was never the actual danger: spending it was the mechanic working exactly as intended. The danger was always the pattern underneath the spending: an officer whose file shows this much accumulated independence, however each individual act was justified at the time, is not an officer this regime lets keep a command. There is no single order, no single refusal, that did this. There is only the sum of them, noticed all at once, the way these things were in truth noticed. The war continues under whoever replaces you. It does not pause to explain the replacement."
        );
      }
      const meterLine = `Final position: Manpower: ${
        meters.manpower > 0 ? "+" + meters.manpower : meters.manpower
      } · Matériel: ${meters.fuel > 0 ? "+" + meters.fuel : meters.fuel} · Initiative: ${
        meters.initiative > 0 ? "+" + meters.initiative : meters.initiative
      }.`;
      const end = this.projectedEnd(flags, meters);
      const hist = this.historicity(flags);

      // Name the road that led to a collapse ending.
      const causes = [];
      if (flags.eastFront === "moscow") causes.push("the Moscow gamble and the flank it exposed");
      if (flags.winterCrisis === "pushed") causes.push("the winter push that bled the army in the snow");
      if (flags.caseBlue === "both" && flags.eastFront === "moscow")
        causes.push("Directive 45's two diverging axes, funded from a reserve that could not pay for one");
      if (flags.alamein === "push") causes.push("the Egyptian overreach at the end of a strangled supply line");
      if (flags.atlantic === "continue") causes.push("the wolfpack crews fed into Black May's teeth");
      if (flags.bagration === "south" || flags.bagration === "hedge")
        causes.push("reserves watching the wrong front when the summer blow fell");
      if (flags.rundstedtRelieved41)
        causes.push("the command purge at Rostov, spent proving a retreat Berlin approved four days too late");
      const causeClause = causes.length
        ? ` The road here ran through ${causes.slice(0, 2).join(", and through ")}.`
        : "";

      if (flags.pathVariant === "armisticeWest") {
        return (
          "SPECULATIVE BRANCH: this ending lies beyond what historical evidence supports, reached only through consecutive low-probability breaks the scholarly consensus argues against at every step. The western armistice of 1942 stops the shooting between Germany and Britain and settles nothing: the eastern war burns on alone, consuming the army at the historical rate against a state that has absorbed everything and remained a state. Occupied Europe stays occupied, and this campaign will not launder what that means: the regime's persecution and industrialized murder of Europe's Jews, and its documented plans for the peoples of the East, continue under the armistice exactly as before it, now unobserved by any western front. America, unattacked and openly hostile, accelerates a weapons program that was conceived with Germany's name on it; every year the 'pause' holds, that clock runs. The armistice is not a victory. It is an intermission purchased at odds this campaign computes below, in a war whose remaining roads still bend toward the same reckoning: later, larger, and by then possibly atomic." +
          (flags.westArmisticeAftermath42 === "east"
            ? " The strength the armistice freed went east, testing what a fully reinforced eastern front could do that the historical two-front war never allowed: a harder war against Kuibyshev, not a won one, fought at the cost of the one western peace this branch had just spent three stacked improbabilities to reach."
            : flags.westArmisticeAftermath42 === "hold"
            ? " The strength the armistice freed stayed in reserve, this branch's own final answer that the peace itself was worth more intact than spent: the one choice available that didn't wager what the armistice had just, improbably, bought."
            : "") +
          " " +
          meterLine
        );
      }
      if (flags.pathVariant === "eastArmistice") {
        return (
          "SPECULATIVE BRANCH: this ending lies beyond what historical evidence supports: it required Japan's improbable northern turn, Moscow's fall, and a state fracture the strong scholarly consensus holds did not await any military outcome. The Volga armistice ends the shooting war in the east and hands the regime the thing history never gave it, and this campaign states plainly what its own planning documents say that thing was for: the occupied East under this government means dispossession, enslavement, and mass death on a continental scale, beginning, not ending, with the armistice's signature. Meanwhile the war does not pause: Britain unbeaten, America arming, and a program in the New Mexico desert running on its own unbroken clock toward the summer of 1945: conceived for Germany, and on this path still aimed there. The eastern armistice is the rarest branch this campaign contains, and its honest summary is the darkest: not a German victory, but the catastrophe changing hands, on a clock." +
          (flags.volgaAftermath42 === "west"
            ? " The army freed by the armistice turned west, testing an undistracted Atlantic Wall for the first and only time this campaign reaches that exact question: a longer intermission, purchased with the rarest asset this branch produced, against a clock that kept running regardless of the test."
            : flags.volgaAftermath42 === "hold"
            ? " The army freed by the armistice stayed in place, this branch's own final answer that consolidation was worth more than a wider gamble: the one choice available that didn't spend what three stacked improbabilities had just bought."
            : "") +
          " " +
          meterLine
        );
      }
      if (flags.hitlerDead44 === "valkyrieSucceeds" && flags.valkyrieGovernment44Result !== "refused") {
        return (
          "SPECULATIVE BRANCH: this ending lies beyond what historical evidence supports, and it is reached by a narrower door than either armistice branch: not a strategic choice compounding over years, but a single afternoon's margin, run the other way, on July 20, 1944. Hitler's actual survival came down to a table leg and a decision made hours earlier for unrelated reasons to hold a briefing in a wooden hut rather than the reinforced bunker nearby. Here, that margin didn't hold. What follows plausibly could have happened on the historical timeline (this campaign's own honest reading of the counterfactual literature says Valkyrie's chances without Hitler's phone call to Berlin were real, not decisive) and on this path, the coin landed on the conspirators' side. A military government under Stauffenberg's circle holds Berlin and the western military districts and opens armistice contact with the Western Allies." +
          (flags.valkyrieGovernment44 === "allFronts"
            ? " That contact came the harder way, too: this government asked Moscow for terms alongside London and Washington, got the silence back that Stalin's own well-documented suspicion of exactly this kind of coup made all but certain, and earned Western trust precisely by not trying to game the difference."
            : " That contact came on the second attempt: the West-only separate peace Goerdeler's own circle actually intended was refused once, on the Casablanca policy's own terms, before a working channel finally opened anyway.") +
          " It is not the earliest exit this campaign reaches (both armistice branches sign two years sooner, on their own separate roads) but it is the only ending reached through the regime itself changing hands rather than the same government simply choosing differently. What it does not undo: the eastern war, the occupied territories, or a New Mexico desert program that was never contingent on who signed a western armistice to keep running. A different door, opened by the narrowest margin this campaign models anywhere, not a better one." +
          " " +
          meterLine
        );
      }
      if (flags.pathVariant === "noBarbarossa") {
        const medNote =
          flags.med41 === "suez"
            ? " The Suez axis delivered the most complete regional victory in this campaign, and demonstrated its own ceiling, since no Mediterranean conquest touched the Atlantic or the arithmetic behind it."
            : flags.med41 === "gibraltar"
            ? " The Gibraltar gambit staked the Mediterranean strategy on Franco's signature: the campaign's decisive battle was diplomatic, and it was fought in Madrid."
            : flags.med41 === "fortress"
            ? " The pure fortress posture preserved everything and contested nothing: handing the Western Allies the two escalating wars, bombing and blockade, that suited them best."
            : flags.truce41 === "siege"
            ? " The funded U-boat siege ran the Atlantic war harder and longer than history's version: against the same shipyard arithmetic, which it deepened but never reversed."
            : "";
        const eastNote =
          flags.eastern44 === "preempt"
            ? " The 1944 preemptive strike answered the eastern question by detonating it: the invasion Barbarossa's cancellation had spared, fought at its maximum possible disadvantage against the fully built Red Army."
            : flags.eastern44 === "appease"
            ? " The deepened settlement with Moscow kept the trains running and made the dependency explicit: a war economy negotiating its own ransom annually while the creditor's army grew."
            : flags.eastern44 === "deter"
            ? " The fortified truce held the eastern question at gunpoint: deterrence as permanent institution, the border war that never quite came defining a Europe armed to its median line."
            : "";
        const bomberNote =
          flags.bomber43 === "fighters"
            ? " Galland's fighter-first defense made the daylight bombing offensive brutally expensive and bought the fortress its extra seasons"
            : flags.bomber43 === "dispersal"
            ? " Speer's early dispersal kept industry producing under the bombs and left it to be strangled by blockade instead"
            : " The retaliation campaign repeated the historical Reich's worst air-war trade, buying headlines with the fighters the defense needed";
        const ending =
          flags.atomic45 === "terms"
            ? `capitulation came around ${end.prose}, sought before the new weapon spoke: unconditional surrender with the fortress intact: of every path in this campaign, the one that ends with the most German cities standing and the most people alive, and it is still total defeat.`
            : flags.atomic45 === "fightOn"
            ? `the fortress fought on into the shadow it could not see, and around ${end.prose} the weapon conceived for Germany was used on Germany (one city, the wait, another) until the same unconditional capitulation arrived by the worst of all available roads.`
            : `the atomic race consumed the war's final year and closed nothing, the gap was measured in reactor-years that did not exist, and capitulation arrived around ${end.prose} under conventional and then atomic pressure, with a scientific footnote where a strategy should have been.`;
        return (
          "This was the war that never went east: the deepest projection this campaign contains, since no German planning document ever seriously mapped it: the regime's entire ideology pointed at the decision you cancelled. What followed was a siege, not a campaign. The army history destroyed in Russia stayed intact and unused; the Soviet Union grew stronger every uncontested quarter; and the Anglo-American war arrived anyway, by air and by blockade, against industry it could reach and imports it could throttle." +
          bomberNote +
          " but the strategic position never changed, because it could not: the fortress had no way to reach the powers besieging it." +
          medNote +
          eastNote +
          ` In the end, ${ending}` +
          " No branch of this path reaches a German victory or a negotiated peace either: cancelling the eastern war removed the historical road to defeat and revealed the other roads that were always underneath it. " +
          meterLine
        );
      }
      if (flags.pathVariant === "collapse44") {
        const shape =
          flags.finalStand === "oderLine"
            ? " The fighting withdrawal you ordered preserved the army's shape even as it lost the war's remaining ground: what reached the Oder surrendered as formations, not fragments."
            : " The fortress-cities order shaped the end the way it always did: pockets, encirclements, and an army that finished the war mostly behind Soviet wire rather than on a line.";
        return (
          `The front came apart in the summer of 1944: Bagration landed on an army that years of prior decisions had already bled past the point of absorption, and this time there was no rest-of-the-front to stabilize behind. Soviet forces reached Germany's borders in autumn 1944 and its interior by winter; the end comes around ${end.prose}, roughly a quarter-year of war erased from the historical calendar.` +
          causeClause +
          shape +
          " Everything past the summer of 1944 on this path was a reasoned projection of general collapse, not a record of events that occurred. " +
          meterLine
        );
      }
      if (flags.pathVariant === "earlyCollapse") {
        const dunkirkAside =
          flags.dunkirk === "push"
            ? " Notably, this collapse arrives so early that even the Dunkirk decision back in May 1940 never got the chance to matter the way it does on longer paths: some threads only pay off, for better or worse, if the war lasts long enough to reach them."
            : "";
        return (
          `The eastern front collapses in early 1943: Sixth Army's loss at Stalingrad landed on reserves already too thin to absorb it. There is no Kursk to fight and no buildup to Normandy on this path: the war ends around ${end.prose}, roughly two years ahead of the real schedule, with Soviet forces deep inside Germany and Western Allied forces racing to claim what they can before the meeting.` +
          causeClause +
          " The war still ends in unconditional surrender, that was never in question, it simply ends far sooner and far more one-sidedly than it actually did. Everything past the Stalingrad decision on this path was a reasoned projection of compounding failure, not a record of events that occurred." +
          dunkirkAside +
          " " +
          meterLine
        );
      }

      // ---- Main-path ending, composed from independent clauses ----

      // 1) When the war ends (time).
      let dateClause;
      const dur = this.endurance(flags, meters);
      if (dur >= 4) {
        dateClause = `Organized resistance on this path continues to around ${end.prose}: months past the historical surrender, one of the longest defenses this campaign can honestly construct.`;
      } else if (dur >= 2) {
        dateClause = `The end comes around ${end.prose}, behind the historical schedule: time bought at nearly every gate where it was for sale.`;
      } else if (dur <= -2) {
        dateClause = `The end comes early, around ${end.prose}: the calendar itself the clearest casualty of this path's decisions.`;
      } else if (end.exact) {
        dateClause =
          "Berlin falls to Soviet forces in late April, and Germany surrenders unconditionally on May 8, 1945: the historical timeline, arrived at by essentially the historical weight of decisions: the same rivers crossed in the same months, the same signature at Reims on May 7 and, at Stalin's insistence that a French schoolhouse wasn't where his war should end, the second ratification the next day at Karlshorst in Berlin.";
      } else if (hist.ratio < 0.6) {
        dateClause = `The end lands around ${end.prose}, close to the historical schedule, but it arrives by a very different road: this was a different war that converged on a similar ledger, not the historical one replayed.`;
      } else {
        dateClause = `The end lands around ${end.prose}, close to the historical schedule.`;
      }

      // 2) The condition of the army at the end (manpower).
      let armyClause;
      if (meters.manpower >= 4) {
        armyClause =
          "The army that surrenders is, by 1945 standards, astonishingly intact: formations with names, commanders, and ammunition, laying down arms as units rather than dissolving as crowds.";
      } else if (meters.manpower >= 2) {
        armyClause =
          "The army ends the war worn but coherent: thinner than it began, but still an army in every sense that mattered to the men inside it.";
      } else if (meters.manpower >= -1) {
        armyClause = "The army ends the war roughly as history left it: exhausted, hollowed, still holding a shape.";
      } else if (meters.manpower >= -3) {
        armyClause =
          "The army that reaches the end is burnt down to battlegroups and stragglers: divisions in name, companies in practice.";
      } else {
        armyClause = "What surrenders at the end is less an army than a casualty ledger with a rear echelon.";
      }

      // 3) Whether it could still move (fuel, only when it defined the war).
      let fuelClause = "";
      if (meters.fuel >= 2) {
        fuelClause =
          " And it could still move: fuel husbanded across the war meant the final battles were fought by a force that could maneuver, something the historical 1945 could not claim.";
      } else if (meters.fuel <= -2) {
        fuelClause =
          " And it ended immobile: whatever strength remained stood where it stood, out of fuel, defending only what it could walk to.";
      }

      // 4) The occupation map.
      let occClause;
      if (flags.reichStand === "west") {
        occClause =
          "Weighting the final defense west redrew the occupation map in the direction no historical German instinct pointed: the Anglo-American advance was held while the deliberately thinned east gave way, and Soviet forces stand correspondingly deeper into Germany at the end: a border moved by choice, with everything the following decades made that border mean.";
      } else if (flags.reichStand === "east") {
        occClause =
          "Opening the west while fighting east redrew the occupation map the other way: Anglo-American forces crossed a dissolving western front and stand deeper into Germany than the historical meeting line, and far more soldiers and civilians ended the war on the western side of it: the map this path's final choice was explicitly made to draw.";
      } else if (flags.reichStand === "north") {
        occClause =
          "The occupation map on the continent lands close to its historical lines (the northern strategy moved men to Norway, not the front lines that drew the zones) with one anomaly the historical war also produced, here at greater scale: an intact German army in Norway that the occupation had to receive rather than defeat.";
      } else if (flags.reichStand === "both") {
        occClause =
          "Contesting both fronts at once, the option an actually banked reserve made possible, leaves the occupation map close to its historical shape: neither advance was ever going to be stopped, only slowed on the margins, and the final meeting line lands within reach of where it always would have.";
      } else if (meters.manpower <= -5) {
        occClause =
          "So little organized force remained by the end that both Allied advances accelerated freely: the final meeting line lands wherever logistics, not resistance, decided.";
      } else if (dur >= 2) {
        occClause =
          "The slower, costlier Soviet advance redraws the occupation map: Western Allied forces plausibly stand on the Elbe months early and cross it, holding ground, perhaps parts of Saxony and Thuringia, that the historical record ceded. The ending is the same ending; who arrives where first, and what that means for forty years of postwar Europe, is not.";
      } else if (dur <= -2) {
        occClause =
          "The accelerated collapse redraws the occupation map the other way: Soviet forces stand deeper inside Germany before Western troops can advance as far east as they historically did: a difference measured in postwar decades, not wartime months.";
      } else {
        occClause =
          "The occupation map lands close to its historical lines: the Elbe as the meeting place, the zones roughly as drawn.";
      }

      const atomicNote =
        dur >= 4
          ? " And a war stretching past the summer of 1945 raises one possibility the historical Reich never faced: the first atomic bomb was originally conceived with Germany in mind, and a Germany still fighting in August 1945 plausibly, rather than Japan alone, meets it."
          : "";

      let divergenceNote = "";
      if (flags.pathVariant === "staticEast") {
        divergenceNote =
          " Your command foreclosed the entire 1942–43 offensive chapter in August 1941: Case Blue, Stalingrad, and the historical Kursk never happened on this path; everything after that point was reasoned projection.";
      } else if (flags.eastFront === "moscow") {
        divergenceNote =
          " Your command diverged from the historical record at the Kiev decision in August 1941: every stage after it was reasoned projection grounded in known logistics, terrain, and force ratios.";
      }

      // 5) Thread notes — surface the three or four decisions that defined THIS war.
      const notes = [];
      const add = (w, t) => notes.push({ w, t });
      if (meters.manpower <= -4 && flags.rhine45 === "depth")
        add(6, "By Remagen, manpower was too thin for a counterattack even to be offered: the choice fell to Heinrici's defense in depth by resource exhaustion, not deliberation.");
      if (flags.stockholmSerious43)
        add(10, "The Stockholm channel turned out to be a real one. On the weight of the evidence it should not have been, the documented contacts produced nothing and most readings hold that nothing was ever on offer, but this war found the minority case, and a conversation nobody was authorized to have became the only one that mattered.");
      if (flags.stockholmLeverage43)
        add(7, "Terms were explored in Stockholm and found to be what most historians think they always were: a conversation Moscow wanted the Western allies to overhear. It cost nothing except the standing of everyone who took part, which in this regime was not a small currency.");
      if (flags.stockholm43 === "closed")
        add(5, "The eastern channel was closed and reported rather than explored: the historical response, and one that risked nothing because there was, on the balance of the evidence, nothing there to risk.");
      if (flags.rommelLine43)
        add(8, "Southern Italy was given up without a serious fight and the line drawn in the northern Apennines, as Rommel argued and was overruled on. The divisions Kesselring would have spent selling ground by the yard went east instead: along with the southern airfields, handed over, from which the bombers then flew.");
      if (flags.italianLine43 === "forward")
        add(6, "Kesselring got Italy and did with it what he promised: twenty months, Cassino, Anzio, and a theatre that consumed Allied divisions without ever becoming the decisive one. The divisions holding those ridges were not available anywhere else, which was always the counter-argument and was never settled.");
      if (flags.uranverein43 === "committed")
        add(8, "The uranium program was funded at scale in late 1943: skilled labour, precision tooling and transport allocation pulled out of an armaments economy already under maximum bombing, for a device that was never going to arrive in time. Money was never what that program was short of. The bill came due in aircraft that were not built.");
      if (flags.uranverein43 === "shutDown")
        add(6, "The Uranium Club was closed outright rather than merely starved. The military effect was slight either way, and the irony was unavailable to everyone in the room: fear of that program was the single largest accelerant on the American one.");
      if (flags.deliveryDelayed45)
        add(10, "The fighter arm was held at altitude for one aircraft on a day nobody would announce, and the mission was postponed rather than risked. The war ran past the summer into months no plan on either side had budgeted for, bought by a defense that could not be repeated and could not be spent on anything else.");
      if (flags.atomic45 === "contestDelivery" && !flags.deliveryDelayed45)
        add(9, "Everything the fighter arm had was held back to intercept a single aeroplane. It came at a time and on a track the defense could not pre-position against, and the reserve waiting for a warning received none until the flash.");
      if (flags.dispersedReich45)
        add(10, "The answer to the bomb was to stop being a target: cities evacuated, industry buried, a state deliberately taken apart until there was no centre left whose destruction would end anything. It worked, in the narrow sense that dispersal always worked for Speer, and it bought months measured against a civilian population moved into the countryside ahead of a winter for which nobody had planned rations. This campaign's longest war is also the one where the distance between a strategy succeeding and it being worth doing is widest.");
      if (flags.reichStand === "west")
        add(9, "The final defense was weighted west: the one strategic posture no German command of 1945 ever chose on purpose, taken here with open eyes about which occupation map it draws.");
      if (flags.reichStand === "north")
        add(9, "Festung Norwegen was activated as the Reich's actual final strategy: 350,000 intact men defending a country nobody attacked, the war's strangest real file opened all the way.");
      if (flags.reichStand === "both")
        add(9, "Both fronts were contested at once in February 1945: a choice no historical German command had the reserve left to make, and this one only had because of what wasn't spent to get here.");
      if (flags.westStand === "elastic")
        add(6, "Model's elastic Rhine defense was the longest coherent western resistance any path in this campaign produces: professionally immaculate, and pointed at the wrong enemy by its own government's decision.");
      if (flags.caseYellow === "original")
        add(10, "The Manstein Plan was set aside for the safer Schlieffen-derived original: the single earliest and most consequential divergence this campaign can reach, before the war was six weeks old.");
      if (flags.caseYellowOriginal40 === "press")
        add(8, "Without the Ardennes encirclement, France was ground down rather than trapped: a costlier, six-weeks-later collapse with no Dunkirk pocket ever forming, and a BEF that walked home rather than being lifted off a beach under fire.");
      if (flags.caseYellowOriginal40 === "consolidate")
        add(8, "The pause after Belgium was real: an autumn 'Case Red' in place of a summer blitz, France still falling in the end but months later and with a panzer force that never paid the historical campaign's wear.");
      if (flags.crete41 === "pass")
        add(6, "Crete was bypassed rather than assaulted: the airborne arm never spent at Mercury, Hitler's verdict against paratroopers never rendered, and an intact instrument kept for whatever later asked for one.");
      if (flags.bismarck41 === "held")
        add(6, "The Bismarck never sailed: held in port rather than risked on the Atlantic breakout that historically cost the Royal Navy the Hood and cost the Kriegsmarine the ship itself within a week.");
      if (flags.berlinDefense45 === "regulars")
        add(9, "Berlin's Volkssturm and Hitler Youth conscripts were stood down from the final defense rather than committed: the one point in this entire file where extending the war further was treated as not worth what doing so would have cost.");
      if (flags.moscowCaptured)
        add(10, "Moscow itself fell in the winter of 1941: the rarest divergence reachable in this campaign, requiring Japan to strike north instead of south. It changed nothing that mattered: the government, the factories, and the war continued from the Volga exactly as the historians who dismiss 'Moscow would have ended it' always said it would.");
      if (flags.surrenderPath === "westOnly")
        add(9, "Dönitz's actual attempt at a western-only surrender was made and refused, but the days it bought before the full capitulation at Reims and Karlshorst carried real people west ahead of the Soviet advance who otherwise would not have made it.");
      if (flags.surrenderPath === "redoubt")
        add(9, "The Alpine Redoubt was ordered into being rather than quietly abandoned: testing the regime's own propaganda against a reality that had almost nothing behind it.");
      if (flags.july20 === "shield")
        add(6, "After the July 20 plot, essential commanders were quietly shielded rather than fully purged: a narrow mercy the actual chaos of 1944 rarely allowed for.");
      if (flags.vichy === "toulonRace" && flags.med42)
        add(9, "The race for Toulon was run: whichever way its dice fell, it was the sharpest what-if the Mediterranean war offers: a fleet that could have flipped the naval balance, decided by hours.");
      if (flags.kurskBreach === "exploited")
        add(8, "The Kursk breach was pushed rather than banked: the boldest tactical gamble the eastern war's endgame offers, spending a fragile advantage before it could close.");
      if (flags.barbarossa === "medFirst")
        add(9, "The Mediterranean-first sequencing experiment answered a question no German staff seriously asked: the desert gained real strength, and the eastern invasion lost the only season that ever gave it a chance.");
      if (flags.norway === "limited")
        add(5, "The limited Norway landings preserved the surface fleet Weserübung otherwise spent: a quiet naval thread running under the whole Channel Question that followed it.");
      if (flags.japan === "pressNorth" && flags.siberianReserves !== "diverted")
        add(3, "Tokyo was pressed hard toward Siberia and went south anyway: a reminder that not every diplomatic effort in this campaign was ever going to bend the decision it targeted.");
      if (flags.med42 === "malta")
        add(8, "Taking Malta rewrote the Mediterranean's arithmetic for the rest of the war: the one theater where a single island really was the fulcrum its advocates claimed.");
      if (flags.usWar === "withheld")
        add(8, "The withheld declaration of December 1941 ran quietly under everything after it: American weight arrived months late: one of the few favorable long-range trades in this campaign, though it delayed, never prevented, the same ending.");
      if (flags.bagration === "center")
        add(8, "Rejecting FHO's confident summer 1944 assessment saved a meaningful fraction of Army Group Center: the largest single divergence-for-the-better available, and the least repeatable, since it meant overruling your best-sourced intelligence on instinct.");
      if (flags.rhine45 === "remagen")
        add(8, "The Remagen gamble, spending the preserved western reserve against the bridgehead, was this path's boldest hour, whichever way its dice fell: the one moment the husbanded strength was asked to do more than delay.");
      if (flags.eastFront === "moscow")
        add(7, "The Kiev refusal in August 1941 was the great divergence of this campaign: every eastern battle after it was fought on a projected map.");
      if (flags.eastFront === "doubleEnvelopment")
        add(7, "The double envelopment of 1941, reachable only by banking time twice, was the most resourced gamble any timeline of this war contains.");
      if (flags.stalingrad === "breakout" || flags.stalingrad === "early")
        add(7, "Sixth Army left the Volga as an army: the single largest body of men any decision in this campaign moves from the dead column to the living.");
      if (flags.dunkirk === "push")
        add(7, "One thread runs the full length of this campaign back to May 1940: pressing the attack at Dunkirk thinned the veteran leadership Britain historically rebuilt around: a quiet effect, still present in the British sector a dozen decisions later.");
      if (flags.normandy === "waterline")
        add(7, "Rommel's waterline doctrine met its one morning at Normandy: a whole coastline built for twenty-four hours, and everything staked on WHERE.");
      if (flags.rhine45 === "ruhrPocket")
        add(7, "The Ruhr fortress order repeated the war's oldest mistake at its largest possible scale: an intact reserve, husbanded across years, encircled with the factories it was chained to.");
      if (flags.lastReserve === "oder")
        add(7, "Holding the last panzer reserve on the Oder rather than spending it in Hungary made the final defense of Berlin slower and costlier for the attackers: the war's last decision, decided against its historical grain.");
      if (flags.usWar === "defacto")
        add(6, "The December 1941 half-measure, sinking American ships without declaring war, bought the full cost of US entry with almost none of Drumbeat's compensating tonnage: gray options between war and peace rarely stay gray.");
      if (flags.atlantic === "continue")
        add(6, "The wolfpacks were kept in the North Atlantic past Black May: the tonnage war lost twice, the second time with crews.");
      if (flags.kursk === "earlyStrike")
        add(6, "Kursk was struck early, on Manstein's clock: one of the war's few decisions where the dice, not the ledger, had the final word.");
      if (flags.eastStand === "backhand")
        add(6, "The 1944 backhand blow gave the eastern war one last Kharkov: a genuine tactical masterpiece the strategic ledger absorbed without changing its total.");
      if (flags.ardennes === "hold")
        add(6, "The Ardennes offensive was never launched on this path: the Bulge remains a forest, and the reserve it historically consumed lived to fight the war's final winter.");
      if (flags.rhine45 === "depth")
        add(6, "Conceding Remagen to fight in depth beyond the Rhine was the quiet, correct heresy of this path's final winter: the reserve preserved one last time, and worth more for it.");
      if (flags.seelow === "heinrici")
        add(6, "At Seelow Heights, Heinrici's empty-trench gambit bought the war's final days at Zhukov's expense: reachable at all only because this path kept an army coherent enough to fight a set-piece battle in April 1945.");
      if (flags.finalWeek === "elbe")
        add(6, "And the last order given on this path was Wenck's real one: the Elbe corridor held open while the war ended around it: a decision that moved no lines and mattered anyway.");
      if (flags.caseBlue === "defensive")
        add(6, "Cancelling the 1942 offensive closed the Stalingrad chapter before it opened: the war's most famous pocket never formed on this path.");
      if (flags.maltaPath === "offensive")
        add(5, "The supplied desert offensive was the best North Africa reachable anywhere in this campaign, and still bought the theater a year, not a verdict.");
      if (flags.maltaPath === "fortress")
        add(5, "The supplied fortress at Alamein quietly became the best-value theater of the war: purchased by an island assault most timelines never attempted.");
      if (flags.alamein === "withdraw")
        add(5, "Walking back from Egypt saved Panzerarmee Afrika from the prisoner cages of Tunisia: the retreat everyone hated, vindicated.");
      if (flags.kursk === "cancelDefend")
        add(5, "Citadel was cancelled outright: Guderian's question about whether anyone even knew where Kursk was, answered by never fighting there.");
      if (flags.atlantic === "typeXXI")
        add(5, "The U-boat arm was pulled back and rebuilt around the Type XXI: a threat-in-being preserved instead of crews spent.");
      if (flags.normandy === "counterattack")
        add(5, "The preserved reserve was spent against the Normandy beachhead in its first days: the strongest counterstroke the western war could produce, and still not enough.");
      if (flags.westDoctrine === "reserve")
        add(5, "The west was built to Rundstedt's doctrine: the massed reserve, held back for one annihilating blow, delivered through skies the enemy owned.");
      if (flags.arnhem === "scheldt")
        add(5, "Weighting the Scheldt over Arnhem kept Antwerp closed longer than history managed: the quiet estuary worth more than the famous bridge.");
      if (flags.eastStand === "vistula")
        add(5, "Anchoring the fighting retreat on the Vistula gave the eastern war a chosen line for the first time since Kursk.");
      if (flags.eastStand === "reichLine")
        add(5, "Trading Poland without a fight preserved the most strength, and drew the postwar map further west than any battle would have.");
      if (flags.finalWeek === "relief")
        add(5, "Twelfth Army was spent against Berlin's rings as ordered: the last reserve answering the last order literally.");
      if (flags.ardennes === "reinforced")
        add(5, "The reinforced Ardennes offensive drove deeper into Belgium than history's, and stalled on the same fuel arithmetic, just further from home.");
      if (flags.balkans === "skip")
        add(4, "Skipping the Balkans banked five weeks against a live threat to Ploiești: the purest time-for-risk trade of the early war, taken.");
      if (flags.caseBlue === "sequenced")
        add(6, "The 1942 offensive was run in sequence (Caucasus first, then the Volga) a logistics luxury only reachable on a path that banked the fuel Directive 45's historical version never had.");
      if (flags.caseBlue === "caucasus")
        add(4, "Concentrating on the Caucasus answered the fuel ledger the historical split never did.");
      if (flags.priority1943 === "eastFirst")
        add(4, "The Dnieper got its divisions before Italy did: the east prioritized at the price of a contested peninsula.");
      if (flags.dnieper === "sealed")
        add(4, "The Dnieper crossing was sealed with the last mobile reserve: the firmest eastern line this campaign can reach.");
      if (flags.dnieper === "conceded")
        add(4, "The Kiev crossing was conceded to bank the reserve for the west: a local defeat purchased on purpose.");
      if (flags.bagration === "hedge")
        add(4, "The 1944 reserves were split against FHO's advice: the blow softened, not stopped.");
      if (flags.seelow === "berlinRing")
        add(4, "Skipping Seelow for Berlin's ring traded the Oder's delaying days for an earlier siege: time, the last currency, spent at a discount.");
      if (flags.lastReserve === "split")
        add(4, "The last reserve was split between Hungary and the Oder: the allocation trap sprung one final time, at the smallest possible scale.");
      if (flags.sealion === "launched")
        add(8, "Sea Lion was actually launched, the September crossing every staff study warned against, and the army fought the rest of the war missing the assault divisions it left on English shingle.");
      if (flags.barbarossa === "postponed")
        add(8, "Barbarossa was postponed a year, settling the great staff argument by force: the year favored the recovering defender, and the eastern war began without its opening dividend.");
      if (flags.sealion === "commit")
        add(3, "The Sea Lion summer cost trained divisions and a season preparing an invasion that was never survivable against the Home Fleet.");
      if (flags.sealion === "east")
        add(3, "Turning east early banked a season the historical war spent over the Channel: time that shaped everything 1941 could attempt.");
      if (flags.italyOutcome === "unstable")
        add(3, "The thin Italian garrison saved divisions in 1943 and paid them back with interest as the partisan war grew.");
      if (flags.dunkirk === "halt")
        add(1, "And one thread runs back to May 1940: the halt at Dunkirk let Britain's army escape intact: the historical baseline every later British formation in this campaign quietly stands on.");
      if (flags.bagrationReinforced)
        add(9, "Center didn't just get the correct call against FHO's assessment: it got real reserves behind that call, years of husbanded strength spent on the single morning this campaign argues was worth more than any other. The retreat that follows is still a retreat. It is not a rout.");
      if (flags.east42 === "launched")
        add(8, "The postponed invasion was launched anyway, a year late rather than never: settling the staff's argument by force. The extra year of preparation bought a coherent opening. It did not buy back the dividend that only the historical 1941's unprepared defender had to give.");
      if (flags.southernFront1943 === "reinforceKursk")
        add(6, "Sixth Army's survivors went into Kursk instead of a grave, and Citadel absorbed them the same way it absorbed everything else thrown at that salient, a larger attritional loss rather than a different result.");
      if (flags.southernFront1943 === "elasticDefense")
        add(6, "The divisions saved from the Volga were banked rather than spent at Kursk: no offensive, no offensive losses, and a southern front that ceded the initiative on purpose rather than by attrition.");
      if (flags.southernFront1943 === "italyRedirect")
        add(6, "The reconstituted southern divisions went to Italy ahead of its armistice rather than into the Kursk salient: getting ahead of Achse a season early, and doing nothing at all for the eastern front doing the actual bleeding.");
      if (flags.romania44 === "extract")
        add(6, "When Bucharest changed sides overnight, the garrison was ordered out rather than held: a costly, chaotic withdrawal, and still the men who came out of it were men, not a casualty list added to a position already lost regardless of what the garrison did.");
      if (flags.romania44 === "hold")
        add(6, "The Bucharest garrison was ordered to hold a capital with no relief column able to reach it: Ploiești was never going to stay German either way, and this is the version where the order cost the men as well as the oil.");
      if (flags.normandyCounterattack === "drive")
        add(7, "The panzer reserve didn't wait for dusk on June 6th: it drove for Sword in daylight, into naval gunfire and total air supremacy, on the theory that one afternoon was the only window this invasion was ever going to leave open.");
      if (flags.normandyCounterattack === "dusk")
        add(6, "The panzer reserve waited for dark on June 6th rather than drive into daylight naval gunfire, and by the time dusk actually arrived, the corridor it might have split at 2 p.m. was already closed. The reserve survived the day. The day's one opening did not survive with it.");
      if (flags.normandyCounterattack === "lateCommit")
        add(5, "The reserve was committed hours late anyway, into a beachhead that had already finished consolidating, for the same reason most of the real German counterattacks that reached the Normandy coast on June 6th did: because ordering something and explaining why it wasn't tried are different costs, and this command chose the first.");
      if (flags.normandyCounterattack === "stoodDown")
        add(5, "The reserve was stood down rather than spent on a window that had already closed by the time the order could act on it: preserved instead for the containment fight at Caen that was coming regardless of what happened on the afternoon of June 6th.");
      if (flags.kurskWithdrawal43 === "clean")
        add(5, "The failed spring gamble at Kursk was followed by a deliberate withdrawal: slower, and it cost fuel neither side could spare, but what came out the other side of that retreat was a formation, not a rout, and it brought its wounded with it.");
      if (flags.kurskWithdrawal43 === "fast")
        add(5, "The failed spring gamble at Kursk was followed by a fast break-contact rather than an orderly one: the bulk of the force got clear before Soviet reserves could interfere, at a cost in men and equipment a few more hours of deliberate movement would have spared.");
      if (flags.wolfsLair44 === "secure")
        add(4, "In the confused hour after the Wolf's Lair blast, this headquarters moved to secure its own position rather than wait on Berlin's confirmation: a decision that read afterward as either commendable foresight or a faintly suspicious readiness for a Führer who was not, in the end, dead.");
      if (flags.feelers42Outcome === "silent")
        add(5, "London's answer to the Stockholm approach was met with official silence rather than spin: the cheaper kind of dignity, and one that cost nothing because there was, by autumn, nothing left to spend it on.");
      if (flags.feelers42Outcome === "propaganda")
        add(5, "The refusal in Stockholm was turned into the domestic story instead of the approach itself: a season's resolve bought on a claim easily checked and easily disbelieved once the war kept going badly regardless.");
      notes.sort((a, b) => b.w - a.w);
      const threadText = notes
        .slice(0, 4)
        .map((n) => n.t)
        .join(" ");

      // 6) The ceiling, stated plainly.
      let closing;
      if (flags.pathVariant === "staticEast") {
        closing =
          "No version of this path was ever going to end in a German victory or a negotiated peace: husbanding an army changes how the war ends, never whether.";
      } else if (hist.ratio >= 0.75) {
        closing =
          "None of these paths were ever going to end in a German victory or a negotiated peace: the combined industrial, manpower, and material advantage of the Allied and Soviet war effort by 1943 was not something choices at the OKW level could close.";
      } else {
        closing = [
          "However far this war diverged, its destination never moved: no branch in this campaign reaches a German victory or a negotiated peace, because the industrial arithmetic of the Allied and Soviet war effort was never a variable OKW decisions could touch.",
          "Every road in this campaign bends the same way in the end: toward defeat, not around it. What changed was never whether, only when and at what cost.",
          "OKW could shape the shape of the loss. It was never in a position to change the fact of it.",
        ][Math.abs((meters.manpower || 0) + (meters.fuel || 0) + (meters.initiative || 0)) % 3];
      }

      const werwolfNote =
        end.exact || (meters.initiative || 0) > -4
          ? " One last note the regime's own propaganda would not have wanted written down: the 'Werwolf' resistance it promised for the occupation that followed never materialized as an organized insurgency. It was, in the end, mostly a broadcast: a distinction, by 1945, between what the regime could still claim and what it could still in fact do."
          : "";

      return [dateClause, armyClause + fuelClause, occClause + atomicNote + divergenceNote, threadText, closing + werwolfNote]
        .filter(Boolean)
        .join(" ");
    },
    // Second stage of the multi-stage ending: roughly twelve months past the date named in
    // epilogue(). Deliberately kept to broad national-level context — occupation, the emerging
    // war-crimes process, the first cracks in the wartime alliance — rather than any individual's
    // fate, which is the "where they ended up" stage's job (drawn from ADVISOR_DOSSIERS.fate).
    oneYearLater(flags, meters) {
      if (flags.dismissed) {
        return "The war this command no longer ran ends the way it was always going to: in unconditional surrender, under whoever inherited the file. A year on, the tribunal now sitting at Nuremberg has no seat reserved for an officer removed from command before the end–dismissal was not a defense the court recognized for the men who did stay, and it is unlikely to have counted for much in the version of events this branch didn't get to see either.";
      }
      if (flags.pathVariant === "armisticeWest") {
        return "SPECULATIVE: a year past the western armistice, the intermission is still holding on paper and fraying underneath it: the eastern war has consumed another year of men and rolling stock regardless of what quiet the west bought, and the program in the New Mexico desert is twelve months closer to a test it was never contingent on Berlin's western signature to reach. Nothing about the pause has become permanent. It has only become older.";
      }
      if (flags.pathVariant === "eastArmistice") {
        return "SPECULATIVE: a year past the Volga armistice, the occupied East is administered exactly as the regime's own planning documents said it would be, and the western war is unresolved: Britain unbeaten, America fully mobilized, and a weapon a year closer to ready. Whatever this armistice bought, it was never a year of safety. It was a year of the same clock running on a different front.";
      }
      if (flags.hitlerDead44 === "valkyrieSucceeds" && flags.valkyrieGovernment44Result !== "refused") {
        return "SPECULATIVE: a year past July 20, 1944, the military government that took Berlin is still an open question rather than a settled one: no Allied government fought a war for unconditional surrender and then had firm doctrine ready for a German regime that removed its own head of state. Some of Stauffenberg's circle are at the negotiating table; the harder argument, a year on, is still whether the men the Western Allies are talking to are being treated as a government or as defendants who haven't been arrested yet." +
          (flags.valkyrieGovernment44 === "allFronts"
            ? " Moscow still hasn't answered the offer this government actually made it a year ago: silence, it turns out, was never a real reply to expect, only the honest one."
            : "");
      }
      if (flags.pathVariant === "noBarbarossa") {
        return flags.atomic45 === "terms"
          ? "A year past capitulation, occupied Germany looks closer to the historical postwar photographs than any other branch this campaign reaches: a surrender sought and accepted before the new weapon was used in anger, with more cities standing to be occupied and more of a population left to administer the peace among."
          : flags.atomic45 === "fightOn"
          ? "A year past the atomic strikes that finally ended the fortress war, the occupied ground is administered around craters history's Germany never had to include in its own accounting: a peace built on the one use of the weapon this campaign's cancelled eastern front never prevented, only postponed."
          : "A year past a capitulation that arrived by conventional exhaustion with an atomic footnote attached, the postwar administration is assembling over a Germany whose final year was a siege rather than a front: a different ledger of damage than the historical one, not a lighter one.";
      }
      if (flags.pathVariant === "collapse44") {
        return "A year past a surrender that landed roughly a quarter-year ahead of the historical calendar, occupied Germany is already through its first winter under administration: denazification tribunals convening on the same accelerated schedule as everything else that came before them, and a documented record of the Reich's crimes that reached Allied hands with rather less time to be dispersed or destroyed than the historical record had.";
      }
      if (flags.pathVariant === "earlyCollapse") {
        return "A year past a surrender roughly two years ahead of the historical one, the postwar world this branch reaches is one the actual historians of 1945 never had to describe: occupation zones settling over a Europe where the war in the Pacific, unaffected by any of this, is still years from its own end: Germany's war and the wider World War having come apart from each other at a seam the historical record never had to name.";
      }
      const dur = this.endurance(flags, meters);
      const admin =
        dur >= 4
          ? "The occupation, arriving months later than the historical one, inherits a Germany with less time between the last shot and the first tribunal date: the paperwork and the rubble equally fresh."
          : dur <= -2
          ? "The occupation arrives early enough that its first year runs alongside fighting still active elsewhere in Europe: administration and combat overlapping in a way the historical, more sequential ending mostly avoided."
          : "The occupation follows close to the historical sequence: four zones, a shared administration in Berlin already showing the friction that will hardly stay contained to Germany, and a tribunal being assembled at Nuremberg to try the leadership this command answered to.";
      return `${admin} Within the year, war-crimes proceedings open against the surviving political and military leadership: a process this file's own advisor dossiers already carry forward for the men this command actually dealt with. What doesn't wait a year: the occupation zones agreed at Yalta hardening into the division that will define Europe's next half-century, a fact no branch of this campaign's choices was ever positioned to prevent.`;
    },
  },

