  japan: {
    id: "japan",
    seal: "IGHQ",
    name: "Imperial General Headquarters",
    dates: "Beginning 1940",
    brief: "Direct Japan's war from the road to the Tripartite Pact to the surrender debate.",
    teaser: "A war chosen in confidence, fought in doubt.",
    accent: "#5c1a1a",
    dynamic: true,
    intro: "September 1940. The alliance with Germany and Italy is on the table. China is unresolved after three years of war, and the oil and rubber of the Southern Resource Area lie behind every argument in the room.",
    start: "chinaPeaceQuestion40",
    resolveNode(id, flags, meters) {
      const carriersUntouched = !!flags.usCarriersUntouched;

      const nodes = {
        get chinaPeaceQuestion40() {
          return {
          date: "1940",
          title: "The China Question, Unsolved",
          historicalRecord: true,
          situation:
            "Three years into a war against Chiang Kai-shek's government that was supposed to be finished in months, the China war is consuming divisions and a budget that the Southern Operation's planners want for themselves. A negotiated settlement is not fantasy. Contacts through intermediaries in Hong Kong and Shanghai have floated terms more than once, and officers inside the Army itself say that a China still fighting is the biggest drain on everything Japan wants to do next. The alternative, and the policy in force, is a puppet government under Wang Jingwei in Nanjing, set up in March 1940 and recognized by almost nobody but Tokyo, while the war against Chiang's Nationalists, and increasingly Mao's Communists, continues without resolution.",
          choices: [
            {
              label: "Continue backing the Wang Jingwei government: pursue victory over Chiang rather than terms with him",
              advisor: { name: "Tojo", position: "Chiang has turned down every set of terms because he expects America to fight for him in the end, so more concessions will change nothing and finishing the war is the only answer." },
              historical: true,
              setFlags: { chinaPeacePath: "continueWar" },
              impact: { readiness: 0, pipeline: -1, initiative: 0 },
              next: "tripartitePact40",
              outcome:
                "China's war grinds on with no resolution, consuming roughly a million men Japan will spend the rest of the war wishing it had for the Southern Operation and, later, for the mainland crisis of 1944. Tokyo recognizes Wang Jingwei's government in November 1940, Germany and Italy in 1941, and almost no one else ever does.",
            },
            {
              label: "Pursue a genuine negotiated settlement with Chiang, offering real terms rather than a puppet government",
              advisor: { name: "Konoe", position: "Refusing to deal with Chiang's government has failed for three years, and continuing to refuse is the real weakness, however much saying so now sounds like weakness." },
              setFlags: { chinaPeacePath: "negotiate", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 1, initiative: -1 },
              next: "tripartitePact40",
              uncertain: [
                {
                  weight: modWeight(40, meters.readiness),
                  title: "Chiang takes the terms seriously",
                  setFlags: { chinaPeaceResult: "accepted" },
                  impact: { readiness: 1, pipeline: 0, initiative: 0 },
                  outcome:
                    "Speculative. With real terms on the table instead of a puppet government, Chiang's government engages seriously, and the divisions the war has consumed for three years begin to come home instead of digging in further.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "Chiang holds out for outside support",
                  setFlags: { chinaPeaceResult: "rejected" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome. Chiang, still expecting American or Soviet backing, reads real terms as a sign that Japan is tiring of the war and holds out. The effort costs diplomatic capital and buys nothing.",
                },
              ],
              outcome:
                "A modeled alternative. In January 1938 Konoe's own government declared that it would no longer deal with Chiang's government, which closed off a settlement while the terms available were still fairly generous. Whether Chiang would have taken real terms seriously in 1940 is uncertain. Divisions freed by a settlement would change the arithmetic behind everything that follows.",
            },
            {
              label: "Escalate the military pressure while quietly keeping a back channel open: force better terms rather than choosing between war and peace",
              advisor: { name: "Sugiyama", position: "Pressure alone has not produced terms in three years, so the army should press and keep a back channel open, and try both before conceding that either has failed." },
              setFlags: { chinaPeacePath: "pressureAndTalk" },
              impact: { readiness: -1, pipeline: 0, initiative: 1 },
              next: "tripartitePact40",
              outcome:
                "A harder push against Chiang's remaining strongholds, paired with an intermediary channel neither side treats as a real offer yet. It satisfies neither the Army's wish for a decisive campaign nor Konoe's case for genuine terms, and it reproduces the war as it was: pressure without resolution, a channel that is never seriously used, and the same million men committed to a war that was supposed to be over in months.",
            },
          ],
        };
        },
        get tripartitePact40() {
          return {
          date: "SEPTEMBER 1940",
          title: "The Tripartite Pact",
          historicalRecord: true,
          situation:
            "Foreign Minister Matsuoka has pushed hard for a formal alliance with Germany and Italy, on the theory that a three-power pact makes Washington think twice about opposing Japan's ambitions in Asia: deterrence through the threat of a two-front war America would rather avoid. The Navy's own leadership isn't convinced. Yamamoto in particular has told his superiors, in terms they found unwelcome, that an alliance meant to intimidate the United States risks provoking the confrontation it is meant to prevent, against an industrial base Japan cannot outproduce in a long war." +
            (flags.chinaPeaceResult === "accepted"
              ? " This argument is being made by a government that just freed roughly a million men from a China war Chiang actually agreed to settle, a fact Matsuoka's own case for deterrence-through-strength doesn't quite know what to do with: the strength on offer is suddenly real rather than theoretical, and Yamamoto's skepticism has less to stand on than it would have a season ago."
              : flags.chinaPeaceResult === "rejected"
              ? " This argument is being made by a government that just watched a negotiating effort with Chiang fail, a million men still committed to a war with no resolution in sight, which does nothing to help Matsuoka's case that Japan is negotiating from strength rather than searching for it."
              : ""),
          choices: [
            {
              label: "Sign the Tripartite Pact, formalizing the alliance with Germany and Italy",
              advisor: { name: "Matsuoka", position: "America respects strength and despises weakness, and a pact of three powers shows strength without a shot fired, so signing it keeps the peace." },
              historical: true,
              setFlags: { tripartitePath: "signed" },
              impact: { readiness: 0, pipeline: 0, initiative: 1 },
              next: "unificationQuestion40",
              outcome:
                "September 27, 1940: the pact is signed. Washington reads it as a hostile alignment, and American opposition hardens instead of weakening. Roosevelt's administration takes it as confirmation that Japan has chosen its side, and over the following year the room to maneuver that Matsuoka expected the alliance to buy gets smaller.",
            },
            {
              label: "Decline the pact, keeping Japan's diplomatic hands free rather than binding to Germany's fortunes",
              advisor: { name: "Yamamoto", position: "The Navy would have to plan a war against the country that supplies half of what it needs to fight, and that should be weighed before the pact is signed, not after." },
              setFlags: { tripartitePath: "declined" },
              impact: { readiness: 1, pipeline: 1, initiative: -1 },
              next: "unificationQuestion40",
              outcome:
                "A modeled alternative, built on the argument the Navy's leadership made and lost. Matsuoka's deterrence theory is never tested, and Japan has no formal alliance to shape its largely uncoordinated dealings with Berlin for the rest of the war. Whether Washington reads Japan's intentions any differently is uncertain. The embargo that comes next was triggered by Indochina more than by Berlin.",
            },
            {
              label: "Negotiate a narrower agreement: technical and economic cooperation with Germany, without the mutual military defense commitment",
              advisor: { name: "Yonai", position: "Germany's engineering is welcome. A clause that puts Japan's war decisions on a timetable Berlin sets is not, so the technology should be taken and the obligation declined." },
              setFlags: { tripartitePath: "limited" },
              impact: { readiness: 1, pipeline: 0, initiative: 0 },
              next: "unificationQuestion40",
              outcome:
                "A modeled alternative: German aircraft and submarine technology without the mutual-defense clause that turns a trade relationship into a shared war. Berlin wanted the full pact and would not easily accept a partner that takes the engineering and declines the obligation. If it did accept, Japan would get the technical benefit without the alliance that narrowed its diplomatic room.",
            },
          ],
        };
        },
        get unificationQuestion40() {
          return {
          date: "LATE 1940",
          title: "Two Services, Two Wars",
          historicalRecord: true,
          situation:
            "The Army and Navy run separate codebreaking bureaus that rarely share results, separate aircraft procurement programs that duplicate engines and airframes neither service will let the other use, and separate intelligence networks that have, more than once, produced contradictory assessments of the same enemy fleet movement. Everyone in Imperial Headquarters knows it. It is a standing joke with operational costs, and before the war starts there is still time to fix some of it.",
          choices: [
            {
              label: "Leave the services running parallel: unification fights are for peacetime, not for a staff about to plan a war",
              advisor: { name: "Sugiyama", position: "The services should keep running in parallel, because a fight over which of them reads a decrypt first is no way to spend the months before the war." },
              historical: true,
              setFlags: { unificationPath: "parallel" },
              impact: { readiness: 0, pipeline: 0, initiative: 1 },
              next: "hokushinDebate41",
              outcome:
                "Separate codebreaking, separate intelligence assessments and separate aircraft programs that never converge on shared standards: this is how the Army and Navy fight the whole war. It drags on the war effort throughout, and no single day shows the cost, which is spread across four years.",
            },
            {
              label: "Force a genuine joint command structure now, before the shooting starts",
              advisor: { name: "Nagano", position: "The fight over a joint command is unpopular in both services and still right, and the coming war will not forgive the years spent not fixing it." },
              setFlags: { unificationPath: "forced", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 1, initiative: -1 },
              next: "hokushinDebate41",
              outcome:
                "A reform that neither service accepted in the real war without years of pressure. Shared codebreaking, common aircraft standards and one intelligence assessment instead of two are dull administrative work with a real operational gain, bought with goodwill between the services that later decisions will have to draw on.",
            },
          ],
        };
        },
        get hokushinDebate41() {
          return {
          date: "JULY 1941",
          title: "Kantokuen: The Road Not Taken North",
          historicalRecord: true,
          situation:
            "Germany's invasion of the Soviet Union, begun on June 22, appears from every report reaching Tokyo to be succeeding faster than anyone expected. Army Group Center is already deep into Soviet territory, and if Moscow falls this year, the Kwantung Army's staff argue that Siberia becomes an undefended prize rather than the hardened frontier it's been since the humiliating defeat at Nomonhan two years ago. Kantokuen, the Kwantung Special Maneuvers, has quietly mobilized about 700,000 men on the Manchurian border under cover of an exercise, ready to strike north once Soviet forces in Siberia are thin enough. This is the last live moment in the old argument between the Army's northern strike and the Navy's southern one: whether Japan's war is against the Soviet Union, as the Army has preferred, or against the resource-rich south, as the Navy has needed.",
          choices: [
            {
              label: "Hold to the Southern Operation: the resources that actually solve the oil problem are south, not north",
              advisor: { name: "Nagano", position: "Kantokuen solves a problem Japan does not have. The shortage is fuel, which will bite in about eighteen months, and there is no fuel in Siberia worth the fleet's time." },
              historical: true,
              setFlags: { hokushinPath: "south", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 0, pipeline: 1, initiative: 0 },
              next: "indochinaOccupation41",
              outcome:
                "On August 9 the General Staff concludes that Soviet strength in the Far East has not fallen enough to attack this year, and Kantokuen is stood down. The Kwantung Army's mobilized divisions go back to garrison duty, and some are later sent south. Japan's war, when it comes, will be fought in the south.",
            },
            {
              label: "Execute Kantokuen: strike north into Siberia while Soviet attention is fixed on Germany",
              advisor: { name: "Tojo", position: "The Army has waited a decade to answer Nomonhan, and the staff estimates say this is the year the Soviet Union can least afford to fight on two fronts." },
              setFlags: { hokushinPath: "north" },
              impact: { readiness: -2, pipeline: -2, initiative: 1 },
              next: "kantokuenOffensive41",
              outcome:
                "Speculative, and the largest departure from the record in the game. A Japan at war with the Soviet Union instead of the United States is a different war, on different ground, against a different production base. The Kwantung Army's staff, encouraged by Germany's early advance, has to decide how deep into Siberia the offensive goes.",
            },
            ...(meters.pipeline >= 3
              ? [
                  {
                    label: "Hold to the Southern Operation, but run a limited northern reconnaissance-in-force to test Soviet weakness rather than guess at it",
                    advisor: { name: "Nagano", position: "The staff should stop arguing about Soviet weakness from rumor and Berlin's optimism and look across the border, on a scale that costs nothing if the answer is unfavorable." },
                    setFlags: { hokushinPath: "southWithProbe" },
                    impact: { readiness: -1, pipeline: -1, initiative: 1 },
                    next: "indochinaOccupation41",
                    outcome:
                      "A position the actual 1941 staff debate never had the fuel margin to seriously entertain: pursuing the Southern Operation as planned while still affording a genuine reconnaissance-in-force across the Manchurian border, real intelligence on Soviet Far East strength rather than the mix of rumor and German optimism the historical decision was really made on. It settles the same strategic argument the Navy had been winning for a decade, just with better information behind the settling than history's own version had.",
                  },
                ]
              : []),
          ],
        };
        },
        get kantokuenOffensive41() {
          return {
          date: "AUGUST 1941",
          title: "The Kwantung Army's Wager",
          historicalRecord: false,
          situation:
            "Speculative: the actual Kantokuen was stood down before it crossed the border. Here the Kwantung Army has crossed it, and the first weeks bring more resistance than staff estimates allowed for. Soviet garrison divisions dug in along the Trans-Siberian Railway are fighting with discipline that officers who remember Nomonhan did not expect from a high command distracted by Germany. Everything from here is extrapolated from staff plans and from what Nomonhan showed about an offensive that outruns its supply.",
          choices: [
            {
              label: "Push deep: drive for the Trans-Siberian Railway itself, cutting the Soviet Far East off from resupply entirely",
              advisor: { name: "Tojo", position: "Nomonhan showed the cost of fighting Zhukov on ground he chose. This time the army chooses, and the Trans-Siberian Railway, not a fortified line, is the objective." },
              setFlags: { kantokuenPath: "deep" },
              impact: { readiness: -4, pipeline: -3, initiative: 2 },
              disabledReason: meters.pipeline <= -3 ? "There isn't rail capacity left to sustain a drive this deep into Siberia. The border gains can be held, but the railway itself is out of reach at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "siberianReckoning42",
              outcome:
                "Supply, the weakest part of any Kwantung Army estimate, is stretched past what Manchuria's railways can carry this far from the border, against a Soviet defense in depth much like the one that beat the Kwantung Army at Nomonhan two years earlier. An army whose staff studies never solved Nomonhan's supply problem has not solved it at three times the distance.",
            },
            {
              label: "Limit the objective: seize the border regions and key resource areas, decline the deeper drive",
              advisor: { name: "Nagano", position: "The offensive will not answer Nomonhan by repeating Nomonhan's mistake on a larger scale, so the army should take what the border gives and leave the railway alone." },
              setFlags: { kantokuenPath: "limited" },
              impact: { readiness: -1, pipeline: -1, initiative: -1 },
              next: "siberianReckoning42",
              outcome:
                "A more cautious version of the same gamble: the border regions and a shorter, more defensible line, giving up the railway for a supply line the army's logisticians can sustain. The basic problem remains. This is a second front against an enemy Japan had chosen not to fight, and a limited objective limits the exposure without removing it.",
            },
            ...(meters.readiness >= 6
              ? [
                  {
                    label: "Hold the border and wait: commit nothing further until the Kwantung Army actually reaches the two-to-one edge its own staff studies say the offensive needs",
                    advisor: { name: "Nagano", position: "American intelligence puts Japan at rough parity with the Siberian army, while the staff's own studies call for two to one, and the army should have that margin before it spends men finding out it does not." },
                    setFlags: { kantokuenPath: "waitForEdge" },
                    impact: { readiness: 2, pipeline: -1, initiative: -2 },
                    next: "siberianReckoning42",
                    outcome:
                      "American military intelligence assessed the Kwantung Army and the Soviet Far Eastern forces at close to parity in October 1941, roughly 682,000 men against 684,000, and Japanese staff doctrine itself held that a two-to-one combat superiority was the real precondition for an offensive to make sense, regardless of what Tokyo's policy wanted. The Kwantung Army had already doubled in strength since July, reinforced quietly under cover of the so-called Special Maneuvers. Waiting for that buildup to actually reach the threshold this army's own doctrine required, rather than committing at parity, is the harder discipline this offensive was missing from the start.",
                  },
                ]
              : []),
          ],
        };
        },
        get siberianReckoning42() {
          return {
          date: "1942",
          title: "A War on Two Fronts, By Choice",
          historicalRecord: false,
          situation:
            "Speculative. Winter has come to Siberia on top of a supply problem that was never solved, only made larger or smaller by how deep the Kwantung Army pushed. Germany's war against the Soviet Union has stalled short of the quick collapse Tokyo's planners assumed. Moscow has not fallen, and a Soviet high command that can spare divisions for a counteroffensive in the east is a harder opponent than the distracted one this operation was built to exploit. Imperial Headquarters has to decide what the second front is worth." +
            (flags.kantokuenPath === "deep"
              ? " The push for the Trans-Siberian Railway itself means the supply line stretched thinnest is also the one now most exposed to whatever the Soviets can spare to throw at it."
              : flags.kantokuenPath === "limited"
              ? " The more limited objective chosen at the outset means less railway captured, but also a shorter, less exposed line to actually hold through a winter counteroffensive."
              : flags.kantokuenPath === "waitForEdge"
              ? " The patience to wait for a two-to-one edge before committing at all means this army enters its first winter having never actually tested whether that edge, once reached, would have been enough. The question this discipline was supposed to settle is still open."
              : ""),
          choices: [
            {
              label: "Hold the gains and dig in for a long war of attrition against the Soviet Far East",
              advisor: { name: "Tojo", position: "One hard winter is no reason to withdraw from a war Japan chose to start, so the army holds what it has taken." },
              setFlags: { siberianPath: "holdGains" },
              impact: { readiness: -3, pipeline: -2, initiative: 0 },
              disabledReason: meters.pipeline <= -3 ? "There isn't the winter supply capacity to hold this ground through an attrition campaign. A dug-in position this exposed needs sustainment this pipeline level can't provide." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "twoFrontStrain44",
              outcome:
                "Japan is now committed to a ground war against the Soviet Union, on ground that broke its army's confidence once already, beside a German offensive that is not producing the quick Soviet collapse the whole operation assumed. The Southern Resource Area, the oil and rubber the war was meant to secure, stays untouched while the empire fights a serious war in the north and manages an embargo.",
            },
            {
              label: "Cut losses: negotiate a local ceasefire with Soviet forces and withdraw to the original border",
              advisor: { name: "Nagano", position: "The war was meant to be over before the snow and it is not, and it is better to explain a withdrawal to the Emperor than a resource war that has become a two-front war." },
              setFlags: { siberianPath: "withdraw" },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "twoFrontStrain44",
              outcome:
                "The army withdraws to the original frontier. The Navy's case for a southern war rather than a northern one has now been settled by experience instead of staff debate. Everything Japan does about the Southern Resource Area and the oil embargo comes a year later than it did in the real war, and the army has spent a year and real casualties learning what Nomonhan in 1939 had already taught it.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Press for the actual German objective: drive west toward a link-up on the Trans-Siberian line before the window closes",
                    advisor: { name: "Tojo", position: "Ribbentrop's telegram named the goal as a meeting of German and Japanese forces on the Trans-Siberian Railway, and every month spent digging in puts that goal further out of reach." },
                    setFlags: { siberianPath: "pressWest" },
                    impact: { readiness: -4, pipeline: -3, initiative: 3 },
                    disabledReason: meters.pipeline <= -2 ? "There isn't fuel or rail capacity to drive west at all, let alone far enough to matter. A push toward a link-up that never gets close enough to attempt isn't a push, it's a further withdrawal in slow motion." : undefined,
                    gateCheck: { meter: "pipeline", threshold: -2, label: "Pipeline" },
                    next: "twoFrontStrain44",
                    outcome:
                      "A real German aim. In a telegram to the Tokyo embassy on July 10, 1941, Ribbentrop wrote that Germany and Japan should join hands on the Trans-Siberian railroad before winter. The distance, thousands of kilometers of Siberian terrain that neither army's logistics could have crossed, shows how far the alliance's war aims were from military fact. This push doesn't reach anything resembling a link-up. It reaches somewhat further west than the historical Kwantung Army ever operated, at a cost this front's own supply situation was never built to absorb, chasing a meeting point neither Axis power's actual military position in 1942 made remotely achievable.",
                  },
                ]
              : []),
          ],
        };
        },
        get twoFrontStrain44() {
          return {
          date: "1943 – 1944",
          title: "The Southern Operation, Delayed",
          historicalRecord: false,
          situation:
            "Speculative. Whatever the Siberian adventure cost, a held front or a chastened withdrawal, the Southern Resource Area's oil and rubber are as untouched as in 1941, and the embargo clock has run two more years while Tokyo looked north. IGHQ now turns to the southern war, years late, with an army whose confidence and readiness the detour has spent." +
            (flags.siberianPath === "holdGains"
              ? " That army is still committed north, dividing whatever the Southern Operation gets to work with."
              : flags.siberianPath === "pressWest"
              ? " That army is scattered somewhere west of where it started, chasing a link-up with German forces that never got remotely close to happening, in worse shape to redeploy south than either a dug-in defense or a clean withdrawal would have left it."
              : " That army is at least undivided now."),
          choices: [
            {
              label: "Launch the delayed Southern Operation at full urgency: race to close a two-year gap the embargo clock never paused for",
              advisor: { name: "Tojo", position: "The deliberate timetable of 1941 is a luxury the army no longer has, and each month of delay brings the fuel crisis the war was meant to solve closer." },
              setFlags: { delayedSouthPath: "rushed", speculativePath: true },
              impact: { readiness: -2, pipeline: -1, initiative: 2 },
              disabledReason: meters.pipeline <= -4 ? "There isn't fuel to compress this timetable at all. A rushed operation needs a margin to rush with, and this pipeline level has none left." : undefined,
              gateCheck: { meter: "pipeline", threshold: -4, label: "Pipeline" },
              next: "theDelayedStrike44",
              outcome:
                "Speculative. A compressed, urgent Southern Operation, rushed and less prepared than the real one, starting from a worse oil position than in 1941 after two more years of consumption with no supply from the resource area. Whether speed makes up for the fuel deficit is the last open question on this path.",
            },
            {
              label: "Proceed deliberately: apply the caution the Siberian front's own hard lessons argue for, despite the compounding fuel deficit",
              advisor: { name: "Nagano", position: "The Siberian front has just shown what follows when the staff assumes a timetable that the terrain and the enemy do not accept, and that lesson should be applied here." },
              setFlags: { delayedSouthPath: "deliberate", speculativePath: true },
              impact: { readiness: 1, pipeline: -2, initiative: -1 },
              next: "theDelayedStrike44",
              outcome:
                "Speculative. A more careful Southern Operation, planned with the caution that Siberia taught, at the cost of time that this timeline can least afford, with the embargo clock two years further along than in the real war.",
            },
          ],
        };
        },
        get theDelayedStrike44() {
          return {
          date: "1943 – 1944",
          title: "A Fleet That Was Never Attacked",
          historicalRecord: false,
          situation:
            "Speculative. The fleet this operation is about to strike is not the one the real attack found at anchor. The Two-Ocean Navy Act, signed in July 1940 after the fall of France, authorized eighteen fleet carriers, seven battleships and more than a hundred destroyers, and two and a half more years of that program have produced ships that the real attack never faced at full strength. The undeclared naval war in the Atlantic has had two more years to cool or to escalate, and Tokyo cannot know which. Whatever is struck here is struck without the condition on which the real plan depended: an America with no reason yet to think of Japan as an enemy." +
            (flags.delayedSouthPath === "rushed"
              ? " The rushed timetable means this fleet goes in with less reconnaissance on what that Two-Ocean construction has actually produced by now than the historical planners had on a fleet they'd been watching for years."
              : " The deliberate timetable at least bought reconnaissance on what two and a half years of undisturbed American shipbuilding looks like."),
          choices: [
            {
              label: "Strike the fleet directly: whatever it has become, hitting it before it can be used is still the whole strategic logic of this operation",
              advisor: { name: "Toyoda", position: "A fleet that has never been struck has no reason to expect it, and that is the one advantage two and a half years of delay has not cost Japan, whatever the fleet has become." },
              setFlags: { delayedStrikePath: "strike" },
              impact: { readiness: -3, pipeline: -2, initiative: 3 },
              next: "theUndemolishedFields44",
              outcome:
                "Speculative. Surprise, the one asset the delay has not spent, holds: an unwarned fleet is unwarned whatever its size. What the strike achieves against a force that may have more than double the real fleet's carrier strength is a different question from what the real attack achieved, and no wargame had data to answer it.",
            },
            {
              label: "Reconnoiter first: confirm what the fleet has actually become before committing to a strike built on two-and-a-half-year-old intelligence",
              advisor: { name: "Nagano", position: "Nobody has properly observed the fleet since the detour began, so the navy should have one real look at what it is striking before it commits." },
              setFlags: { delayedStrikePath: "reconnoiter" },
              impact: { readiness: 1, pipeline: -1, initiative: -2 },
              disabledReason: meters.initiative <= -4 ? "There isn't the operational tempo left to reconnoiter and still strike before the fleet's own position shifts again. This delay has already cost more of that margin than this staff can spare a second time." : undefined,
              gateCheck: { meter: "initiative", threshold: -4, label: "Initiative" },
              next: "theUndemolishedFields44",
              outcome:
                "Speculative. A close look at two and a half years of undisturbed construction costs the one advantage the operation had: a fleet that has had one more chance to notice it is being watched. The scale of the Two-Ocean Navy Act's output, confirmed and not estimated, does not make the operation easier to justify.",
            },
          ],
        };
        },
        get theUndemolishedFields44() {
          return {
          date: "1944",
          title: "The Fields Nobody Burned",
          historicalRecord: false,
          situation:
            "Speculative. In the real war the Dutch had a demolition plan ready before Japanese troops landed, and the oil facilities at Balikpapan and Tarakan were wrecked rather than handed over, which cut Japanese output to a fraction of capacity. In this timeline the Dutch have had two and a half more years to refine the plan on a war footing, with no Japanese fleet to trigger it. Whether that means a more thorough demolition, or readiness that has lapsed in two and a half undisturbed years, cannot be settled from the air.",
          choices: [
            {
              label: "Move fast: land ahead of any warning the fleet's own approach might give the demolition teams time to act on",
              advisor: { name: "Terauchi", position: "The Dutch have had two and a half years to prepare demolitions, so the landings should come with less warning than that preparation assumes." },
              setFlags: { resourceFieldsPath: "moveFast" },
              impact: { readiness: -2, pipeline: 1, initiative: 1 },
              next: "theFuelLedger44",
              outcome:
                "Speculative. The same bet that failed to prevent demolition in the real war, tried again with whatever margin speed can buy against administrators who have had two and a half more years to plan. Whether the fields are found intact or wrecked is learned at the landing.",
            },
            {
              label: "Accept the likely demolition and plan around a damaged resource area from the start, rather than bet the operation's own fuel math on an intact one",
              advisor: { name: "Nagano", position: "The staff should plan for the fields it is likely to get, damaged after two and a half years of Dutch preparation, and not for the fields it hopes for." },
              setFlags: { resourceFieldsPath: "planForDamage" },
              impact: { readiness: 1, pipeline: -2, initiative: -1 },
              next: "theFuelLedger44",
              outcome:
                "Speculative. The conservative assumption: two and a half more years of war-footing preparation point to a more thorough demolition. Restoration crews go in planned for damaged wells and wrecked refineries and do not discover the gap on arrival.",
            },
          ],
        };
        },
        get theFuelLedger44() {
          return {
          date: "1944",
          title: "The Fuel Ledger Between Two Fronts",
          historicalRecord: false,
          situation:
            "Speculative. Whatever the delayed Southern Operation achieved, the fleet and the Kwantung Army are drawing on the same shrinking fuel reserve, and Combined Fleet staff report that it cannot cover both a Siberian garrison and a Pacific naval presence at the levels either front's commanders consider adequate. This is the arithmetic Nagano warned of in 1941: a two-front empire spending fuel that a one-front war would never have had to divide." +
            (flags.delayedStrikePath === "strike"
              ? " The strike went in on the surprise this operation still had left rather than a confirmed picture of what it actually hit, and this staff is now allocating fuel against results it can't yet fully verify."
              : flags.delayedStrikePath === "reconnoiter"
              ? " The reconnaissance this staff insisted on came back, and the picture it confirmed of a Two-Ocean Navy Act two and a half years further along than the historical attack ever had to face isn't the kind of intelligence that makes this fuel allocation easier to justify either way it's spent."
              : "") +
            (flags.resourceFieldsPath === "moveFast"
              ? " Whether the fast landing actually beat the demolition teams to the fields is the number this whole ledger is really waiting on, and it isn't confirmed yet."
              : flags.resourceFieldsPath === "planForDamage"
              ? " This ledger was built assuming damaged fields from the start, which at least means today's numbers aren't a downward surprise on top of everything else already being allocated against a two-front shortfall."
              : ""),
          choices: [
            {
              label: "Prioritize the fleet: the Pacific war is still the one this navy actually needs to fight",
              advisor: { name: "Toyoda", position: "The Pacific war is the one the Navy needs to win, and the fleet needs fuel to remain a fleet more than the army needs it for garrison duty in Siberia." },
              setFlags: { fuelLedgerPath: "fleet" },
              impact: { readiness: 1, pipeline: -1, initiative: 0 },
              next: "aSecondArmisticeQuestion44",
              uncertain: [
                {
                  weight: modWeight(40, meters.pipeline),
                  title: "The reallocation actually stretches the Pacific war meaningfully",
                  setFlags: { fuelLedgerResult: "helped" },
                  impact: { readiness: 1, pipeline: 0, initiative: 0 },
                  outcome:
                    "Fuel diverted from the Siberian garrison buys the Pacific fleet real additional weeks of operational tempo, the trade Yamamoto's argument assumed would matter more than a static northern garrison.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.pipeline); return Math.max(5, 100 - w); })(),
                  title: "The Kwantung Army's drawdown costs more than the fleet gains",
                  setFlags: { fuelLedgerResult: "costly" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome. The fuel diverted south buys the fleet a small, hard-to-measure gain, while the Kwantung Army's thinner Siberian position becomes a real vulnerability once Soviet attention turns east, a cost the reallocation did not account for.",
                },
              ],
              outcome:
                "Speculative. The fleet gets priority, and the Kwantung Army's Siberian position is no longer held at full strength. One front's readiness is quietly reduced to preserve the other's fuel.",
            },
            {
              label: "Prioritize the army: the northern front IGHQ chose to open still has to be sustained on its own terms",
              advisor: { name: "Tojo", position: "A second front does not get starved the moment it becomes inconvenient to the Navy, and the army must have what it needs to hold what it was ordered to hold." },
              setFlags: { fuelLedgerPath: "army" },
              impact: { readiness: -1, pipeline: 1, initiative: 0 },
              next: "aSecondArmisticeQuestion44",
              outcome:
                "Speculative. The army holds its allocation and the fleet's reserves narrow instead. It keeps faith with the decision to open a northern front, at a direct cost to the naval war everywhere else. By now both fronts are running on borrowed fuel, whichever one gets the marginal priority.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Force genuine unified allocation: break the structural split where the Army controls captured oil and the Navy consumes most of it",
                    advisor: { name: "Nagano", position: "The Army administers the oilfields and the fleet burns most of what comes out of them. That arrangement was never designed, it costs fuel neither service can account for, and it needs one ledger instead of two." },
                    setFlags: { fuelLedgerPath: "unified" },
                    impact: { readiness: -2, pipeline: 2, initiative: -1 },
                    next: "aSecondArmisticeQuestion44",
                    outcome:
                      "A real, documented dysfunction, not an invented one: captured oil infrastructure in the resource area fell under Army administrative control from the occupation onward, while the Navy's own peacetime consumption estimate, 17.6 million barrels a year against the Army's 5.7 million, made it by far the larger claimant on what that infrastructure actually produced. Two separate procurement systems, two separate depot networks, and by some documented accounts entire cargoes withheld by one service from the other rather than pooled, wasted fuel neither front's own shortage could actually afford. Forcing a single ledger doesn't create fuel that doesn't exist. It stops losing what already does to an administrative seam nobody originally intended.",
                  },
                ]
              : []),
          ],
        };
        },
        get aSecondArmisticeQuestion44() {
          return {
          date: "1944",
          title: "A Second Front's Own Bill Comes Due",
          historicalRecord: false,
          situation:
            "Speculative. Whether the delayed Southern Operation was rushed or deliberate, its results confirm what the detour has been building toward since Kantokuen was approved: a war fought in two sequential pieces does worse on both fronts than one undivided war. IGHQ's remaining choice is less about strategy than about how honestly to account for the position two years of sequential wars have produced." +
            (flags.fuelLedgerResult === "helped"
              ? " The fuel gamble at least paid off: the Pacific fleet got real weeks out of what the Kwantung Army gave up, one of the few line items in this whole two-front reckoning that came back showing a genuine return rather than a straight loss."
              : flags.fuelLedgerResult === "costly"
              ? " The fuel gamble didn't pay off: the Kwantung Army's thinner Siberian position bought the fleet a gain too marginal to show clearly in this accounting, one more line item in a two-front war's ledger that reads as cost without a matching return."
              : ""),
          choices: [
            {
              label: "Commission a full accounting of what the two-front choice cost, however uncomfortable the answer",
              advisor: { name: "Nagano", position: "The staff should have in writing what the choice of Kantokuen over the Southern Operation's first timetable has cost, uncomfortable or not, because it will be useful." },
              setFlags: { armisticeQuestionPath: "accounting" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "theBelatedReckoning45",
              outcome:
                "Speculative. An internal accounting of what fighting two wars instead of one has cost gives the next decision a clearer basis than the optimistic staff estimates that started the detour in the summer of 1941.",
            },
            {
              label: "Decline the accounting: press forward without dwelling on what the delay and division already cost",
              advisor: { name: "Tojo", position: "A ledger of what has been spent helps nobody, and what matters is what the army does next, with the accounting left to historians if any are left." },
              setFlags: { armisticeQuestionPath: "pressForward" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: "theBelatedReckoning45",
              outcome:
                "Speculative. The command keeps moving instead of reckoning with the cost of its own decisions. It is understandable under wartime pressure, and it is the unexamined momentum that let the optimism behind Kantokuen go untested against Nomonhan's lessons.",
            },
            ...(meters.readiness >= 6
              ? [
                  {
                    label: "Commission the accounting and commit in advance to acting on it, whatever it shows",
                    advisor: { name: "Nagano", position: "The staff should order the accounting and commit in advance to act on it. In the summer of 1941 a government institute told the cabinet that a war with America ends in defeat, and the report was filed and ignored." },
                    setFlags: { armisticeQuestionPath: "boundInAdvance" },
                    impact: { readiness: -1, pipeline: 1, initiative: -1 },
                    next: "theBelatedReckoning45",
                    outcome:
                      "The Total War Research Institute, a genuine Cabinet Office body of Japan's own top mid-career analysts, gathered in the summer of 1941 and told the actual Japanese cabinet directly that a war against the United States would end in defeat, a prediction that turned out accurate down to details its own authors had no way to know, everything short of the atomic bomb. The report was heard, in full, over two days, and changed nothing about the decision already being made. Binding this command to act on its own accounting in advance, rather than letting the finding arrive and quietly go nowhere the way the real one did, is the one thing the historical version of this moment never actually tried.",
                  },
                ]
              : []),
          ],
        };
        },
        get theBelatedReckoning45() {
          return {
          date: "1945",
          title: "A War Two Years Behind Its Own Clock",
          historicalRecord: false,
          noFlavor: true,
          situation:
            "Speculative. Japan reaches 1945 having fought two wars in sequence: a Siberian gambit" +
            (flags.siberianPath === "holdGains" ? ", held through a hard winter at real cost, " : flags.siberianPath === "withdraw" ? ", conceded once the winter made the cost clear, " : flags.siberianPath === "pressWest" ? ", pushed toward a German link-up several thousand kilometers of Siberian terrain never let it reach, " : ", ") +
            "then a Southern Operation launched years behind the embargo clock." +
            (flags.delayedStrikePath === "strike"
              ? " That operation opened on the same surprise the historical attack used, against a fleet the real Two-Ocean Navy Act had two and a half more years to build than the historical one ever faced."
              : flags.delayedStrikePath === "reconnoiter"
              ? " That operation opened only after real reconnaissance confirmed what the delay had already cost it in surprise."
              : "") +
            (flags.resourceFieldsPath === "moveFast"
              ? " Whether the resource fields were reached before their own demolition or after was answered by the landing itself, not by this staff's own planning assumptions."
              : flags.resourceFieldsPath === "planForDamage"
              ? " The resource fields were planned for as damaged from the outset, whatever they actually turned out to be, and that planning discipline is the one part of this operation's fuel math that wasn't left to hope."
              : " Whatever oil and rubber the resource area eventually provided arrived too late to offset what a delayed war and a divided, twice-committed army both cost.") +
            "" +
            (flags.armisticeQuestionPath === "accounting"
              ? " The staff at least knows, in writing, what the two-front choice really cost. Whatever gets decided from here starts from an honest number instead of an optimistic guess."
              : flags.armisticeQuestionPath === "boundInAdvance"
              ? " This staff commissioned that accounting already bound to act on it, the one thing the real 1941 version of this moment never actually tried. Whatever gets decided from here isn't just informed by the honest number. It's already committed to following where that number points."
              : ""),
          choices: [
            {
              label: "Seek terms: a delayed, diminished war looking for an exit before the arithmetic gets worse",
              advisor: { name: "Togo", position: "Japan has fought two wars back to back instead of the one it needed to win, and it is better to ask for terms from here than to wait for a third." },
              setFlags: { kantokuenLegacyPath: "seekTerms" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "kantokuenFinalWord46",
              outcome:
                "Speculative. Japan seeks terms from a different exhaustion than the real one: two sequential wars, a divided army and an embargo clock that outlasted every plan to manage it. Whether Washington is even at war with Japan in this timeline is a question the earlier chapters never settled.",
            },
            {
              label: "Fight on: commit whatever remains to finishing the Southern Operation's original promise, however late",
              advisor: { name: "Tojo", position: "Late is not failed, and the war should be finished on whatever timeline it takes." },
              setFlags: { kantokuenLegacyPath: "fightOn" },
              impact: { readiness: -2, pipeline: -1, initiative: 1 },
              next: "theUnbloodiedFleets45",
              outcome:
                "Speculative. Japan is still fighting for the Southern Resource Area's original promise, years behind the timeline it was built on, with an army and a fuel position that have narrowed instead of grown. What is left to decide is posture more than strategy.",
            },
            ...(meters.readiness <= -6
              ? [
                  {
                    label: "Let the war ministry's hardest faction settle it: sideline whoever is still arguing for terms and commit to fighting past the point civilian government can still order otherwise",
                    advisor: { name: "Anami", position: "Two governments in turn have run out of authority to end a war on their own terms, and there is little reason to expect a third attempt at terms to do better." },
                    setFlags: { kantokuenLegacyPath: "hardlinerSeizure" },
                    impact: { readiness: -3, pipeline: 0, initiative: 2 },
                    next: "kantokuenFinalWord46",
                    outcome:
                      "The real historical version of this instinct, the Kyujo incident, an actual coup attempt against the Emperor's own surrender broadcast, came within hours of succeeding using officers who had fought one exhausting war, not two. An army and a war ministry worn down by a Siberian gambit and a Southern Operation both is, if anything, a more receptive audience for exactly this argument than the historical one was, not a less receptive one. Whether that makes the outcome more likely to succeed or simply louder on its way to the same failure the historical attempt met is a question this timeline's own exhaustion doesn't get to answer any more clearly than the real one did.",
                  },
                ]
              : []),
          ],
        };
        },
        get theUnbloodiedFleets45() {
          return {
          date: "1945",
          title: "Two Fleets, Neither Blooded",
          historicalRecord: false,
          situation:
            "Speculative. Two fleets meet that neither side's doctrine was built to fight. Japan's carrier air groups are still the elite prewar force that never bled at Midway or in the Solomons, but they have not improved: the Japanese naval air training system was never expanded beyond what a short war needed, because this timeline never produced the crisis that forced Tokyo to expand it. American naval aviation has had two and a half more years of a wartime aircraft industry and a training program that turns out many more pilots. Neither air group has fought the other.",
          choices: [
            {
              label: "Trust the veterans: commit the fleet's experienced aircrew to a decisive engagement on skill this timeline never let America's newer pilots prove against Japan specifically",
              advisor: { name: "Ozawa", position: "The aircrews that fought over Malaya and the Indian Ocean have never met American carrier aviation, and that gap may favor them more than the American aircraft numbers suggest." },
              setFlags: { unbloodiedFleetsPath: "trustVeterans" },
              impact: { readiness: -3, pipeline: -2, initiative: 2 },
              next: "kantokuenFinalWord46",
              outcome:
                "Speculative. Japan's prewar naval aviators were among the best carrier pilots of the war, the asset the real navy had spent by 1943. Whether elite skill in aircraft that stopped improving after 1941 beats adequate skill in aircraft that kept improving for two and a half more years has no historical answer.",
            },
            {
              label: "Decline the engagement: preserve the veteran air groups rather than test them against an unknown quantity in unfamiliar aircraft",
              advisor: { name: "Nagano", position: "The air groups have no equal in skill and no experience against this fleet, and they are worth more kept intact and untested than spent finding out in one afternoon." },
              setFlags: { unbloodiedFleetsPath: "decline" },
              impact: { readiness: 1, pipeline: 1, initiative: -3 },
              disabledReason: meters.pipeline <= -5 ? "There isn't fuel to maintain a fleet in being and decline this engagement indefinitely. Declining costs time this pipeline level doesn't have left to spend." : undefined,
              gateCheck: { meter: "pipeline", threshold: -5, label: "Pipeline" },
              next: "kantokuenFinalWord46",
              outcome:
                "Speculative. The cautious wager: an untested air group keeps its reputation because it is never tested, at the price of the decisive engagement the operation was meant to deliver. Whether an unresolved question is worth more than a result, win or lose, cannot be judged until long afterward.",
            },
          ],
        };
        },
        get kantokuenFinalWord46() {
          return {
          date: "1946",
          title: "The Price of Striking North",
          historicalRecord: false,
          noFlavor: true,
          situation:
            "Speculative. A war fought north before south: Kantokuen chosen over the Southern Operation's timetable, two sequential wars instead of one, years lost to a front the real Kwantung Army never crossed the border to fight. What follows is a closing accounting of what the choice to strike north cost, back to the alliance with Germany and a summer's gamble on Soviet weakness.",
          choices: [
            {
              label: "Protect the planning staff who championed Kantokuen from any institutional consequence: no reassignment, no board of inquiry, no career cost",
              advisor: { name: "Tojo", position: "History can judge whether this was the right war to fight first, but the staff officers who argued for Kantokuen should not be made scapegoats for a decision the whole General Staff approved." },
              setFlags: { kantokuenFinalPath: "heldGround" },
              impact: { readiness: -1, pipeline: -1, initiative: 0 },
              next: "END",
              outcome:
                "Speculative. Under the Meiji Constitution the War Minister was not answerable to any civilian government, and the Imperial Army had no tradition of a formal inquiry into a strategic judgment, however costly. Protecting the planning staff is therefore easy: the officers who argued hardest for striking north keep their postings, their reputations and their future assignments.",
            },
            {
              label: "Convene a board of inquiry: name the specific General Staff officers who championed the northern gamble and remove them from further planning authority",
              advisor: { name: "Nagano", position: "Kantokuen solved a problem Japan did not have, and the men who argued loudest for it should never again be trusted with a war plan." },
              setFlags: { kantokuenFinalPath: "wrongGamble" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "END",
              outcome:
                "Speculative. An unusual step for an institution with no tradition of holding a strategic judgment to account: the officers who pressed hardest for Kantokuen are named and removed from planning authority, not court-martialed, since no charge exists, but sidelined. The Navy's case against a northern war is vindicated, and being right costs someone something specific and not only a line in the record.",
            },
          ],
        };
        },
        get indochinaOccupation41() {
          return {
          date: "JULY 1941",
          title: "Indochina and the Embargo Question",
          historicalRecord: true,
          situation:
            "With Vichy France in no position to resist, the Army is pushing to occupy the whole of French Indochina rather than the limited northern access already secured, completing the encirclement of the Southern Resource Area's approaches. The Navy has quietly dreaded exactly this move for months: roughly eighty percent of Japan's oil comes from the United States, and a full occupation is the most likely trigger for a total embargo, which would leave the fleet about eighteen months of fuel.",
          choices: [
            {
              label: "Proceed with the full occupation of southern Indochina",
              advisor: { name: "Tojo", position: "For a year Japan has been told that provoking America is the one thing it cannot afford, and waiting for an embargo that may come regardless has bought nothing." },
              historical: true,
              setFlags: { indochinaPath: "fullOccupation" },
              impact: { readiness: 0, pipeline: -2, initiative: 2 },
              next: "novemberUltimatum41",
              outcome:
                "Japanese troops land in southern Indochina in late July 1941. Roosevelt freezes Japanese assets on July 26, and the oil embargo the Navy dreaded follows on August 1. The eighteen-month clock the fleet is running against starts here. The embargo, and not Pearl Harbor, sets the war's deadline.",
            },
            {
              label: "Negotiate limited basing and transit rights instead: stop short of full occupation",
              advisor: { name: "Nomura", position: "Full occupation would close the negotiating options Nomura has left, and he is the one who must sit across from Secretary Hull afterward." },
              setFlags: { indochinaPath: "limited", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "novemberUltimatum41",
              outcome:
                "A modeled alternative, close to the cautious course Ambassador Nomura's cables argued for. Limited transit rights give most of the military value, staging bases within range of Malaya and the Indies, without the diplomatic cost of full occupation, and any embargo comes later and may be partial. Whether Washington would read restraint as an opening or as a slower version of the same expansion is not something the record settles.",
            },
            {
              label: "Occupy in stages: take key ports and airfields first, hold the rest in reserve as leverage while watching Washington's response",
              advisor: { name: "Konoe", position: "Learning the cost in stages beats learning it all at once, so the bases the fleet needs should be taken first and Washington's reaction watched before the rest is spent." },
              setFlags: { indochinaPath: "staged" },
              impact: { readiness: 0, pipeline: 0, initiative: 0 },
              next: "novemberUltimatum41",
              outcome:
                "A modeled alternative: key ports and airfields taken at once, and the rest of the colony left unoccupied as a card in hand. Historians are divided on whether a staged occupation would have brought the same freeze order or bought time, and the game does not pick a side. Tokyo keeps a decision that the full occupation made for it in the real war.",
            },
          ],
        };
        },
        get novemberUltimatum41() {
          return {
          date: "LATE NOVEMBER 1941",
          title: "The Hull Note",
          historicalRecord: true,
          situation:
            "Secretary of State Hull's note of November 26 demands a complete Japanese withdrawal from China and Indochina in return for lifting the embargo. Every faction in the government reads it as an ultimatum, whatever Washington calls it. Prince Konoe, who resigned as prime minister in October, never arranged the summit with Roosevelt he had worked on for months. The Imperial Conference has to decide within days whether to confirm the war deadline already agreed in principle, or to try once more to extend the talks against odds nobody in the room thinks are good.",
          choices: [
            {
              label: "Confirm the deadline: proceed toward the Southern Operation and the opening strike",
              advisor: { name: "Tojo", position: "The Hull Note asks Japan to surrender everything built since Manchuria, unilaterally and on trust, and further negotiation will not change those terms." },
              historical: true,
              setFlags: { novemberPath: "confirmed" },
              impact: { readiness: 0, pipeline: 0, initiative: 1 },
              next: "pearlHarbor41",
              outcome:
                "December 1, 1941: the Imperial Conference confirms the war decision and closes the diplomatic track that Nomura, and before him Konoe, had kept open for most of the year. The strike force bound for Pearl Harbor has been at sea since November 26 and carries on, on a deadline set months earlier.",
            },
            {
              label: "Seek one more extension of the negotiating window",
              advisor: { name: "Togo", position: "One more extension is unlikely to change Hull's terms, but it is worth being the government that asked, when history decides who chose the war and who tried to avoid it." },
              setFlags: { novemberPath: "delayed", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 2, initiative: -2 },
              disabledReason: meters.pipeline <= -4 ? "The embargo has already cut too deep to buy with more time. The fleet's reserves force this decision now, whatever the diplomatic calendar would prefer." : undefined,
              gateCheck: { meter: "pipeline", threshold: -4, label: "Pipeline" },
              next: "pearlHarbor41",
              outcome:
                "A modeled alternative, close to the position Foreign Minister Togo held before he went along with the war decision. An extension buys weeks and no breakthrough, because Hull's terms were not likely to move and the embargo's clock keeps running. It changes something smaller and internal: the government has visibly asked for more time before choosing war, which counts for little with the war ministry's hardliners.",
            },
            {
              label: "Counter-offer a partial withdrawal: pull out of southern Indochina while keeping northern positions and China off the table entirely",
              advisor: { name: "Togo", position: "Hull is asking for everything, and the government's answer, once, should be something other than a plain yes or no to that question." },
              setFlags: { novemberPath: "counterOffer", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              disabledReason: meters.pipeline <= -4 ? "The embargo has already cut too deep to spend more weeks on a counter-offer Hull's own position gives little reason to expect will be entertained." : undefined,
              gateCheck: { meter: "pipeline", threshold: -4, label: "Pipeline" },
              next: "pearlHarbor41",
              outcome:
                "Japan had made an offer of this kind on November 20 (Proposal B: withdrawal from southern Indochina in return for oil and American restraint over China), and Washington drafted a three-month truce in reply before dropping it on November 26 and sending the Hull Note instead. Here the counter-offer is made again after the Note, with China still untouched, which is the demand the Note's harshest language was aimed at. By this point American policy treated complete withdrawal as the price of ending the embargo, and a partial offer had little chance.",
            },
          ],
        };
        },
        get pearlHarbor41() {
          return {
          date: "DECEMBER 1941",
          title: "The Opening Vector",
          historicalRecord: true,
          situation:
            "The Southern Resource Area, Malaya's rubber and tin, the Dutch East Indies' oil, is the entire point of this war, and the American embargo has left the fleet perhaps eighteen months of oil at current consumption. The question is what to do about the U.S. Pacific Fleet while the Southern Operation unfolds. Yamamoto's staff has spent a year on one answer: a six-carrier strike on Pearl Harbor, timed with landings in Malaya and the Philippines, to cripple the American Pacific Fleet before it can interfere with the conquest of the resource area.\n\nYamamoto has been blunt in private about what it buys: a year, perhaps two, of a free hand, and not a war America cannot win on production in the end.\n\nNagumo's strike force is already at sea under radio silence. The alternative, proposed and rejected months ago but still technically available, is to leave Hawaii alone entirely and commit every carrier to the Southern Operation itself." +
            (flags.novemberPath === "delayed"
              ? " The extra weeks IGHQ asked for at the Imperial Conference didn't move Washington's terms. They also didn't change what happens next."
              : ""),
          choices: [
            {
              label: "Execute the Pearl Harbor strike as planned: six carriers, full surprise",
              advisor: { name: "Yamamoto", position: "The strike buys no unlimited time, and a long war against that industrial base looks the same after today as it did before." },
              historical: true,
              setFlags: { openingVector: "pearlHarbor" },
              impact: { readiness: 0, pipeline: 0, initiative: 0 },
              next: "burmaRangoon42",
              outcome:
                "Eight battleships are hit at anchor, 2,403 Americans are dead, and the surprise is complete. The three American carriers are at sea and untouched, and the oil tanks and dry docks, arguably worth more than the battleships, are not attacked. Nagumo declines a third strike rather than risk his carriers hunting for a fleet he cannot find. Yamamoto gets the free hand he asked for, and the carriers survive to take it away.",
            },
            {
              label: "Bypass Oahu entirely: commit every carrier to the Southern Resource Area instead",
              advisor: { name: "Nagano", position: "Every ship sent to Hawaii is one not covering the landings in Malaya, so the fleet should take the oil and leave America a war it has not yet decided to fight." },
              setFlags: { openingVector: "southBlitz", usCarriersUntouched: true, speculativePath: true },
              impact: { readiness: 1, pipeline: 2, initiative: -1 },
              disabledReason: meters.pipeline <= -3 ? "The Southern Operation can't absorb every carrier at this pipeline level without a Hawaii strike to buy the time the supply chain needs to catch up. There isn't enough slack left for the bet Nagano is proposing." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "unhinderedSouth42",
              outcome:
                "A modeled alternative that the Naval General Staff argued and lost before Yamamoto's plan carried the day. Without a Hawaii strike there is no Pearl Harbor to unite American opinion at once. A Congress that spent 1941 divided over intervention in Europe must decide, on its own timetable, whether Japanese landings half a world away justify a two-ocean war. The Southern Operation runs faster and better supplied with every carrier committed to it. America still has an intact Pacific Fleet.",
            },
          ],
        };
        },
        get burmaRangoon42() {
          return {
          date: "MARCH 1942",
          title: "The Road to Rangoon",
          historicalRecord: true,
          situation:
            "Fifteenth Army's drive into Burma is arguably the cleanest strategic objective of the whole Southern Operation: Rangoon's port and the road running north from it are the only route still supplying Chiang Kai-shek's government with Western war material, and cutting it starves China's resistance at the source rather than fighting through it directly. Lieutenant General Iida's divisions are pushing through jungle terrain no prewar staff study rated as passable this fast, racing a mixed British, Indian and Burmese defense and the first divisions of the Chinese Expeditionary Force, which Chiang sent across the border, after months of British hesitation, to help hold the road that keeps his government supplied." +
            (flags.openingVector === "southBlitz"
              ? " This campaign runs regardless of what happened at Hawaii. Burma was always the Army's war, not the Navy's, and Fifteenth Army's timetable was never built around Pearl Harbor at all."
              : "") +
            (flags.congressResult === "divided"
              ? " Washington's own Congress, still divided without a Pearl Harbor to unify it, isn't a variable Fifteenth Army's own staff tracks directly, but the wider bet it represents, that this war can be fought and won piece by piece before American opinion catches up, is the same bet this jungle campaign is quietly relying on too."
              : flags.congressResult === "unified"
              ? " Washington's Congress unified over Manila and Singapore's fall despite never having its Pearl Harbor, a fact Fifteenth Army's own staff has no direct stake in but that quietly changes the shape of the war this campaign is actually fighting toward: a fully mobilized America, not a divided one, waiting at the end of it."
              : ""),
          choices: [
            {
              label: "Press the jungle drive at speed: take Rangoon before British and Chinese reinforcements consolidate",
              advisor: { name: "Iida", position: "The road to China closes the day Rangoon falls, and each cautious week lets China keep breathing through a port the army could already have taken." },
              historical: true,
              setFlags: { burmaPath: "speed" },
              impact: { readiness: -1, pipeline: 1, initiative: 2 },
              disabledReason: meters.pipeline <= -3 ? "The supply train can't sustain a forced march through this terrain at this pipeline level. A rushed drive here risks stranding the division, not just tiring it." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: flags.openingVector === "southBlitz" ? "washingtonDecides42" : "bataanPOWQuestion42",
              outcome:
                "Rangoon falls on March 8, 1942, faster than British planning had judged possible, and the port that fed the Burma Road is lost. The road itself closes when Lashio falls at the end of April. China's supply then depends on the Hump, transport aircraft flying over the Himalayas at a fraction of the road's capacity, at a cost in aircrew and airframes that becomes its own long campaign.",
            },
            {
              label: "Advance methodically along the coast with naval gunfire support: slower, but preserves the division for the India campaign to come",
              advisor: { name: "Sakurai", position: "Rangoon will fall either way, and a division that is still a division for the harder push into India is worth more than one spent winning a race the British retreat would have lost anyway." },
              setFlags: { burmaPath: "methodical" },
              impact: { readiness: 1, pipeline: -1, initiative: -1 },
              next: flags.openingVector === "southBlitz" ? "washingtonDecides42" : "bataanPOWQuestion42",
              outcome:
                "A modeled alternative. A slower advance still takes Rangoon, weeks later, and lets more of the retreating British, Indian and Chinese forces escape north with their equipment. That is a fair trade for the harder campaign toward Assam, which this path is better prepared for, and China keeps its supply line a little longer.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Divert divisions earmarked for Burma toward a genuine invasion of Ceylon, over the Army's real historical objection",
                    advisor: { name: "Sugiyama", position: "The Navy has asked for these divisions three times and been refused, because Burma and the mainland already claim more of the army than it can supply, but at this rate of advance refusing is no longer clearly the more disciplined course." },
                    setFlags: { ceylonPath: "invade" },
                    impact: { readiness: -3, pipeline: -2, initiative: -1 },
                    next: flags.openingVector === "southBlitz" ? "washingtonDecides42" : "bataanPOWQuestion42",
                    outcome:
                      "The actual historical refusal, reversed: the Imperial Army declined to allocate troops for a Ceylon invasion in 1942, over the Navy's real objections that the opportunity wouldn't hold. Churchill himself later called the moment Japan's fleet turned toward Ceylon the single most dangerous of the entire war for Britain, by his own account worse than anything the Battle of Britain produced. What an actual invasion would have achieved, control of the Indian Ocean, isolation of Middle Eastern oil from Britain's war effort, is a question the historical refusal never let anyone test. This path spends real divisions finding out.",
                  },
                ]
              : []),
          ],
        };
        },
        get burmaRangoon42Delayed() {
          return {
          date: "LATE 1942",
          title: "The Road to Rangoon, Months Late",
          historicalRecord: false,
          situation:
            "Speculative. Fifteenth Army's drive into Burma, thinned by months of shipping diverted to the Australia gamble, is only now getting properly under way, long after the window in which the real campaign was won. Rangoon's port and the road running north from it are still the objective; whether they're still worth the same price is a different question. British and Chinese forces have had the better part of a year, not weeks, to reinforce a city the historical Fifteenth Army took before its defenders had time to organize a serious answer." +
            (flags.openingVector === "southBlitz"
              ? " This campaign runs regardless of what happened at Hawaii. Burma was always the Army's war, not the Navy's, and Fifteenth Army's timetable was never built around Pearl Harbor at all, even if this specific timetable has clearly been built around something else instead."
              : "") +
            (flags.australiaResult === "beachhead"
              ? " The Australia gamble that delayed this campaign did buy a real, if brief, beachhead, some return on the tonnage it cost, even if that return has nothing directly to do with the harder fight this thinned-out division is about to have in Burma."
              : " The Australia gamble that delayed this campaign bought nothing: a failed landing, real tonnage spent, and a Fifteenth Army paying for someone else's failure with a Burma campaign this understrength was never supposed to fight."),
          choices: [
            {
              label: "Press the drive at speed regardless of the delay: take Rangoon before the reinforced defense hardens further",
              advisor: { name: "Iida", position: "The window the plan was built for has already been lost, and a late start is no reason to lose the city as well by moving slowly." },
              setFlags: { burmaPath: "speedDelayed" },
              impact: { readiness: -2, pipeline: 0, initiative: 1 },
              disabledReason: meters.pipeline <= -3 ? "The supply train can't sustain a forced march through this terrain at this pipeline level, and this division has less margin for that risk than the historical timetable's version ever did." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: flags.openingVector === "southBlitz" ? "washingtonDecides42" : "bataanPOWQuestion42",
              outcome:
                "The historical Fifteenth Army took Rangoon on March 8, 1942, before its defenders had time to organize a serious answer. This division, arriving months later against a city that's had the whole intervening stretch to reinforce, still takes it, but at a cost the historical timetable never had to pay: British and Chinese forces extract a slower, more contested withdrawal than the real one, and the Burma Road closes later and more expensively than it did in the actual war.",
            },
            {
              label: "Advance methodically: accept an even longer delay rather than spend this weakened division on speed",
              advisor: { name: "Sakurai", position: "The division is already fighting a campaign the plan did not budget for and should not also be asked to fight it fast." },
              setFlags: { burmaPath: "methodicalDelayed" },
              impact: { readiness: 1, pipeline: -1, initiative: -2 },
              next: flags.openingVector === "southBlitz" ? "washingtonDecides42" : "bataanPOWQuestion42",
              outcome:
                "A slower version of an already-late campaign. Rangoon falls eventually, well outside the window the historical March 8th date represents, having let considerably more of the reinforced British-Indian and Chinese defense escape north intact than either the historical campaign or a faster version of this delayed one would have allowed. What it preserves is the division itself, spent thin already by the Australia detour and not spent further here.",
            },
          ],
        };
        },
        get bataanPOWQuestion42() {
          return {
          date: "APRIL 1942",
          title: "Bataan: More Prisoners Than Anyone Planned For",
          historicalRecord: true,
          situation:
            "Bataan's garrison surrenders on April 9. Fourteenth Army's staff planned for about 25,000 prisoners. About 75,000 American and Filipino troops surrender, most of them starving and sick with malaria after months on short rations, and there are no trucks to move so many men and no camp to hold them. General Homma's attention is still on Corregidor, whose garrison has not surrendered and whose guns can still reach the strait his supply lines use. Colonel Kawane's transport command and the field officers handling the surrender will decide, hour by hour, how the prisoners cover the sixty-odd miles to the rail line at San Fernando. Homma has to decide how much of his own attention to give them.",
          choices: [
            {
              label: "Leave transport arrangements to Kawane's command and the field officers already on the ground: keep personal attention on Corregidor's guns",
              advisor: { name: "Homma", position: "Corregidor still threatens the army's supply line while Bataan has already surrendered, and where the commander's attention belongs is not a question with two right answers." },
              historical: true,
              setFlags: { bataanPath: "delegated" },
              impact: { readiness: 1, pipeline: 0, initiative: 1 },
              next: "doolittleRaid42",
              outcome:
                "What happened. The prisoners walk and ride toward Camp O'Donnell over the following week, under guards who treat them with little regard for their lives, on a supply and medical plan built for a third of their number. Thousands die on the march, from beating, exhaustion, disease and neglect. Estimates run from 5,000 to 18,000 Filipinos and several hundred Americans. The death rate in Japanese camps was high throughout the war: about 27 percent of Western prisoners held by Japan died, against about 4 percent of those held by Germany and Italy. At the Pantingan River, 350 to 400 surrendered Filipino officers and NCOs are executed on the initiative of Colonel Masanobu Tsuji, against Homma's stated wish that the prisoners be moved without incident. Whether a commander who ordered none of it bears command responsibility for what his delegated authority produced was the question before the Manila tribunal that tried Homma in 1945–46. He was convicted and executed in April 1946.",
            },
            {
              label: "Personally order humane transport standards for the entire march, backed by real enforcement down the chain of command",
              advisor: { name: "Homma", position: "Corregidor can wait a week, and seventy-eight thousand prisoners are not a number the command can treat as someone else's administrative problem." },
              setFlags: { bataanPath: "personalOrder" },
              impact: { readiness: -2, pipeline: -1, initiative: -1 },
              next: "doolittleRaid42",
              uncertain: [
                {
                  weight: modWeight(40, meters.readiness),
                  title: "The order substantially holds",
                  setFlags: { bataanResult: "orderHeld" },
                  impact: { readiness: 1, pipeline: 0, initiative: 0 },
                  outcome:
                    "An order that is checked as well as issued changes outcomes even though the supply crisis remains. Exhaustion, disease and a march planned for a third of the men still kill many prisoners, but the deliberate cruelties of the real march, summary executions among them, do not happen on anything like the same scale. A command that enforces its own order has still not solved a transport problem it had no trucks to solve.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The order gets undermined at the field level regardless",
                  setFlags: { bataanResult: "orderDefied" },
                  impact: { readiness: -2, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome. An order from Manila does not reliably survive a field officer who disagrees with it. In the real war Colonel Tsuji had 350 to 400 surrendered Filipino officers and NCOs executed at the Pantingan River against Homma's stated wish, and no order from further up the chain is sure to prevent the same. What changes is the paper trail: it now shows a humane order defied, instead of no order. That matters to later judgment and not at all to the men marching.",
                },
              ],
              outcome:
                "A modeled alternative. Homma takes his attention from the siege of Corregidor and treats the prisoners as his own responsibility instead of a delegated detail. Whether the men marching notice depends on whether an order from Manila survives officers in the field who do not share it, which is the same question Homma's defense argued at his tribunal.",
            },
            ...(meters.pipeline >= 6
              ? [
                  {
                    label: "Divert real transport capacity, trucks and rail cars pulled from Corregidor's own siege supply, to actually move this many men rather than just order it",
                    advisor: { name: "Kawane", position: "An order solves nothing if the trucks do not exist, and the command needs the transport the number of prisoners requires, after which the order enforces itself." },
                    setFlags: { bataanPath: "resourced" },
                    impact: { readiness: -3, pipeline: -3, initiative: 1 },
                    next: "doolittleRaid42",
                    outcome:
                      "The version of this decision that answers the actual bottleneck rather than the command's attention to it: real trucks and rail capacity, taken directly from Corregidor's own siege supply, move prisoners at something closer to the rate 78,000 men actually requires. Corregidor's own reduction slows measurably for it. What this buys isn't a clean outcome, disease and the general chaos of a surrender twice the planned size still cost real lives, but it removes the specific bottleneck, insufficient transport capacity, that the historical march never had answered at any level of the command, ordered or not.",
                  },
                ]
              : []),
          ],
        };
        },
        get doolittleRaid42() {
          return {
          date: "APRIL 1942",
          title: "Sixteen Bombers Over Tokyo",
          historicalRecord: true,
          situation:
            "Sixteen twin-engine Army bombers, launched from a carrier far outside the range the Navy thought possible, have bombed Tokyo, Yokohama and four other cities. The damage is small by the standards of the war to come: Japanese records give some 87 civilians killed, and accounts vary. The embarrassment is large. The home islands were supposed to be safe from air attack, and the services had told the Emperor so. There is nothing left of the raid to answer militarily. The question is how urgently the gap that let it happen has to be closed." +
            (flags.ceylonPath === "invade"
              ? " The timing could not be worse: the divisions and the fleet attention an actual Ceylon invasion demands are exactly what a homeland already this embarrassed would like back, and there is no honest way to have both a serious Indian Ocean campaign and a full-throated response to a raid that reached the Emperor's own capital."
              : ""),
          choices: [
            {
              label: "Treat it as confirmation that Midway must proceed on the accelerated timetable Yamamoto's staff has been pushing for",
              advisor: { name: "Yamamoto", position: "Months of being told the operation can wait have been answered by fifteen minutes over Tokyo, and Midway should go ahead on the accelerated timetable." },
              historical: true,
              setFlags: { doolittlePath: "accelerate" },
              impact: { readiness: 0, pipeline: 0, initiative: 2 },
              next: "doolittleAirmen42",
              outcome:
                "What happened, more or less. The raid did not create the case for Midway, which Yamamoto had been arguing already, but it left the plan's remaining skeptics in the Naval General Staff with little to say, and the operation is approved within days on a timetable that leaves little room to absorb the lessons of Coral Sea.",
            },
            {
              label: "Treat it as a propaganda embarrassment, not a strategic one: decline to let it accelerate operations already running on their own schedule",
              advisor: { name: "Nagano", position: "Sixteen bombers that could not find their landing fields show no strategic gap, and the problem is better fixed with better picket coverage than with an operation rushed to prove a point." },
              setFlags: { doolittlePath: "measured" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              disabledReason: meters.pipeline <= -3 ? "There isn't the picket-boat and reconnaissance capacity left to fix this gap properly. The measured response Nagano wants requires resources this pipeline level doesn't have." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "doolittleAirmen42",
              outcome:
                "A modeled alternative, built on the skeptical view that existed in the Naval General Staff before the raid. The raid killed few people and destroyed little, and a slower, better prepared answer to the gap it exposed is a fair reading of the military stakes. It gives up the urgency that pushed the Midway operation through in the real war, and Midway's planning gets the extra weeks its critics wanted.",
            },
          ],
        };
        },
        get doolittleAirmen42() {
          return {
          date: "AUGUST 1942",
          title: "The Captured Airmen",
          historicalRecord: true,
          situation:
            "Eight of the raid's eighty airmen were captured after their aircraft went down in Japanese-held China. A military tribunal has tried them with no meaningful defense on a charge of strafing civilians, which the crews deny and for which there is no independent evidence. It has sentenced all eight to death, and Imperial Headquarters must decide whether to carry the sentences out and how many. A separate campaign is already under way regardless of their fate: General Hata's China Expeditionary Army is advancing into Zhejiang and Jiangxi, where villagers sheltered the raid's other crews. Estimates of the civilian dead run from tens of thousands to several hundred thousand, and no count settles the range. The method is not in dispute: whole villages were treated as guilty for the help given to American airmen." +
            (flags.bataanPath === "personalOrder"
              ? " This isn't the first time this command has had to decide, specifically, how prisoners actually get treated rather than simply delegating the question downward. Bataan asked the same thing of this command four months ago, and whether that earlier order actually held against the officers meant to carry it out is a fact this room already knows the answer to, whatever it decides about these eight men." +
                (flags.bataanResult === "orderHeld"
                  ? " It held, that time, checked rather than merely issued. Whether this room is prepared to check this decision the same way is a different question than whether it's prepared to issue one."
                  : flags.bataanResult === "orderDefied"
                  ? " It didn't hold, that time, an order from this command overridden by an officer in the field who disagreed with it. Whatever this room decides about these eight men, the same defiance is available to whoever's actually responsible for carrying the decision out."
                  : "")
              : flags.bataanPath === "delegated"
              ? " Bataan asked this command the same underlying question four months ago and got an answer by default: attention stayed on Corregidor, transport stayed delegated, and thousands of men died on a march this command never personally supervised. Eight specific men and a documented tribunal finding are a different kind of decision than that was, but it's the same command being asked, again, how directly it wants to own what happens to prisoners in its custody."
              : ""),
          choices: [
            {
              label: "Carry out the sentences: execute a portion of the condemned airmen, commute the rest",
              advisor: { name: "Tojo", position: "The tribunal has ruled, and the army will not overturn a military court's finding on airmen accused of striking noncombatants, whatever doubt there is about the specific charge." + (flags.novemberPath === "confirmed" ? " The war deadline was confirmed once already, and decisions are not reversed because they have become uncomfortable." : "") },
              historical: true,
              setFlags: { doolittleAirmenPath: "executed" },
              impact: { readiness: 0, pipeline: 0, initiative: 0 },
              next: "coralSea42",
              outcome:
                "Three of the eight are shot on October 15. The Emperor commutes the other five sentences to life imprisonment, and one of the five dies of malnutrition and dysentery in captivity before the war ends. The charge of strafing civilians was never supported by evidence beyond the tribunal's own finding. Zhejiang and Jiangxi are devastated regardless of this decision, as a punishment of villagers who had no connection to the eight men the tribunal reached.",
            },
            {
              label: "Overturn the tribunal: hold the captured airmen as conventional prisoners of war instead",
              advisor: { name: "Nagano", position: "There is no evidence for the charge beyond the tribunal's own say-so, and it is wrong to execute men on a finding that thin, whatever it costs the command to say so in public." },
              setFlags: { doolittleAirmenPath: "pow", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 0, pipeline: 0, initiative: -1 },
              next: "coralSea42",
              outcome:
                "A modeled alternative. Treating the airmen as ordinary prisoners of war costs the command nothing strategically and denies the war ministry's hardliners an execution to use at home as proof of resolve. It does not restore the credibility of Tokyo's air defense, and it does not touch Zhejiang and Jiangxi, where Hata's campaign proceeds on its own orders.",
            },
          ],
        };
        },
        get coralSea42() {
          return {
          date: "MAY 1942",
          title: "Coral Sea and the Port Moresby Question",
          historicalRecord: true,
          situation:
            "The Southern Operation has run ahead of every prewar estimate: Malaya, the Indies and Burma have fallen faster than the staffs planned. Port Moresby, on Papua's southern coast, is the next objective. Taken, it puts northern Australia within bomber range. A light carrier covers the invasion convoy, with the fleet carriers Shokaku and Zuikaku in support. American codebreakers have read enough traffic to have carriers of their own in the Coral Sea, Yorktown and Lexington, and contact reports confirm it.\n\nIn the battle of May 7–8 the light carrier Shoho is sunk. Lexington is lost and Yorktown is damaged. Shokaku is damaged, and both Shokaku and Zuikaku lose so many aircraft and aircrew that neither can be ready for the next operation. The Port Moresby invasion is turned back.",
          choices: [
            {
              label: "Accept the decisive battle Yamamoto wants: commit the fleet toward Midway",
              advisor: { name: "Yamamoto", position: "The Pacific Fleet's carriers are still afloat, each month brings America's shipyards closer to making the war unwinnable, and the carriers should be sunk before that month arrives." },
              historical: true,
              setFlags: { coralSeaPath: "midway" },
              impact: { readiness: -1, pipeline: 0, initiative: 1 },
              next: "midway42",
              outcome:
                "Shokaku and Zuikaku, with their air groups mauled at Coral Sea, are judged not ready in time, and the Midway force sails with four fleet carriers instead of the six the plan assumed. Combined Fleet headquarters does not treat this as decisive.",
            },
            {
              label: "Consolidate: hold what the Southern Operation has already won and decline further overextension",
              advisor: { name: "Inoue", position: "The Southern Operation has already won more than the plan asked for, and every mile beyond Truk is a mile of supply line that has to be defended as well as extended." },
              setFlags: { coralSeaPath: "consolidate", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 2, pipeline: -1, initiative: -2 },
              next: "perimeterDoctrine42",
              uncertain: [
                {
                  weight: modWeight(40, meters.readiness),
                  title: "Patience holds",
                  setFlags: { coralSeaPerimeterBet: "patient" },
                  impact: { readiness: 1, pipeline: 1, initiative: 0 },
                  outcome:
                    "Speculative. Inoue's argument holds up better than Combined Fleet staff expected. A perimeter defended atoll by atoll is expensive for an impatient American public to keep attacking, and for now the arithmetic Yamamoto worried about favors Japan.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "America doesn't tire",
                  setFlags: { coralSeaPerimeterBet: "impatient" },
                  impact: { readiness: -1, pipeline: -1, initiative: -1 },
                  outcome:
                    "Speculative. Inoue's bet fails. American production and public will both prove more patient than Fourth Fleet's staff hoped, and the perimeter becomes the string of costly fights the consolidation was meant to avoid, spread over more years.",
                },
              ],
            },
          ],
        };
        },
        get midway42() {
          return {
          date: "JUNE 1942",
          title: "Midway: The Search for the Decisive Battle",
          historicalRecord: true,
          situation:
            "Four fleet carriers, Akagi, Kaga, Soryu and Hiryu, approach Midway atoll under Nagumo, on a plan to draw the Pacific Fleet's remaining carriers into a battle that Japan's larger force should win. The plan does not know that American cryptanalysts have read enough of the naval code to identify Midway as the target weeks in advance, or that Yorktown, estimated to need ninety days of repair after Coral Sea, was patched in three days at Pearl Harbor and is sailing as a third carrier.\n\nAn alternative, argued and shelved months ago in the Naval General Staff, would have sent the carriers against Fiji and Samoa to cut the sea lanes between America and Australia, instead of seeking a fleet battle. The fleet has already sailed toward Midway. What remains open is how hard to press the search for American carriers that the staff assumes are not yet there." +
            (flags.doolittlePath === "measured"
              ? " This plan has the extra weeks its skeptics wanted after the Tokyo raid. Whether that changes anything about what Nagumo's search radars actually find today is a different question entirely."
              : "") +
            (flags.forkYorktownDelayed
              ? " Naval Intelligence's unconfirmed reports of trouble in the American repair yards, if accurate, would mean whatever carrier force is out there tonight is thinner than this plan's own assumptions account for."
              : ""),
          choices: [
            {
              label: "Proceed with the plan as built: full commitment to the Midway invasion and the decisive battle it's meant to force",
              advisor: { name: "Nagumo", position: "The plan assumes that no American carriers are within range, and if that is wrong the search planes will show it, perhaps too late to matter." },
              historical: true,
              setFlags: { midwayPath: "committed" },
              impact: { readiness: -1, pipeline: 0, initiative: 1 },
              next: "kokodaTrail42",
              uncertain: [
                {
                  weight: modWeight((carriersUntouched ? 15 : 8) + (flags.forkYorktownDelayed ? 5 : 0), meters.readiness),
                  title: "The morning breaks Japan's way instead",
                  setFlags: { midwayResult: "decisive" },
                  impact: { readiness: 3, pipeline: 1, initiative: 3 },
                  next: "yamamotoAscendant42",
                  outcome:
                    "Speculative, and the least likely of the three. American search planes miss the Japanese carriers in the early hours, and Nagumo's strike force finds Yorktown, Enterprise and Hornet with their aircraft on deck, rearming." +
                    (flags.forkYorktownDelayed
                      ? " Whatever thinned the American carrier deck tonight, Yorktown's name is conspicuously absent from the wreckage this force's own scouts report."
                      : ""),
                },
                {
                  weight: modWeight(carriersUntouched ? 32 : 20, meters.readiness),
                  title: "The strike force survives the morning",
                  setFlags: { midwayResult: "survived" },
                  impact: { readiness: -2, pipeline: 0, initiative: -1 },
                  outcome:
                    "Speculative. American dive bombers catch the carriers while they are rearming, but damage-control parties get the fires out before the magazines explode. Two carriers are lost rather than four, and the fleet retreats with enough left to fight another campaign.",
                },
                {
                  weight: (() => {
                    const vw = modWeight(carriersUntouched ? 15 : 8, meters.readiness);
                    const sw = modWeight(carriersUntouched ? 32 : 20, meters.readiness);
                    return Math.max(5, 100 - vw - sw);
                  })(),
                  title: "The five fatal minutes",
                  setFlags: { midwayResult: "disaster" },
                  impact: { readiness: -4, pipeline: 0, initiative: -2 },
                  next: "earlyPeaceQuestion42",
                  outcome:
                    "American dive bombers arrive while the Japanese carriers have aircraft, bombs and fuel exposed on their decks in the changeover between a strike on the island and a strike on ships. Akagi, Kaga and Soryu are burning within minutes of each other. Hiryu survives long enough to cripple Yorktown and is lost that evening. Four fleet carriers and about a hundred of their best aircrew are gone in a day.",
                },
              ],
            },
            {
              label: "Redirect at sea: abandon the Midway plan, commit the carrier force to the Fiji-Samoa supply line operation instead",
              advisor: { name: "Ugaki", position: "Cutting the sea road between America and Australia forces every reinforcement promised to MacArthur onto a longer route. It is a slower way to win, and it does not stake the carriers on a fleet battle." },
              setFlags: { midwayPath: "diverted", suspicion: (flags.suspicion || 0) + 1, speculativePath: true },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "severSupplyLine42",
              outcome:
                "A modeled alternative: the operation the Naval General Staff favored before Yamamoto's insistence on a decisive battle won out. The carriers sail against lightly defended islands in the South Pacific and degrade the Australia supply line without risking a fleet carrier against an enemy that was waiting at Midway, which the command cannot know. At the time it looks like caution.",
            },
          ],
        };
        },
        get yamamotoAscendant42() {
          return {
          date: "JUNE 1942",
          title: "The Fantasy Considered Seriously for a Single Afternoon",
          historicalRecord: false,
          situation:
            "Speculative: here Midway is a Japanese victory and the American carriers are gone. Combined Fleet staff are considering, for the first time without dismissing it, an idea shelved months ago as fantasy: a follow-on strike on Hawaii, perhaps an invasion, while the Pacific Fleet has nothing afloat to contest it. Army planners, consulted briefly and unhappy to be asked, object on grounds that do not depend on the naval battle: Japan has no five spare divisions and not nearly the shipping an invasion and occupation of Hawaii would need. What is being decided is how far the Navy indulges the idea before returning to what it can do.",
          choices: [
            {
              label: "Push toward Hawaii: commit to raids and reconnaissance in force, testing exactly how far this advantage extends",
              advisor: { name: "Ugaki", position: "Hawaii cannot be held, but raids can make the Americans spend six months learning that, which is worth nearly as much." },
              setFlags: { ascendantPath: "pressHawaii" },
              impact: { readiness: -2, pipeline: -3, initiative: 3 },
              disabledReason: meters.pipeline <= -3 ? "There isn't fuel for a sustained raiding campaign this far from any friendly base. Whatever this advantage is worth, it isn't worth spending on a reach this long at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "aPacificWonTwice43",
              outcome:
                "Speculative. A raiding campaign against Hawaii with no capacity to invade gives some psychological and reconnaissance value and no territory, and it burns fuel and aircrew that the Navy has no surplus of even after a victory. Historians of Japanese logistics generally agree that an occupation was never within reach. What is speculative is how much a campaign of raids could have gained against a Pacific Fleet with no carriers to answer it.",
            },
            {
              label: "Consolidate the win: use the destroyed American carrier force to guarantee the Southern Operation's flank, without chasing the Hawaii fantasy",
              advisor: { name: "Yamamoto", position: "The Navy wanted the American fleet destroyed, and that has now been done twice over, so the gain should not be spent on an island Japan cannot hold and does not need." },
              setFlags: { ascendantPath: "consolidate" },
              impact: { readiness: 1, pipeline: 1, initiative: 0 },
              next: "aPacificWonTwice43",
              outcome:
                "Speculative. Yamamoto's known doubts about overreach make this the likelier choice. The resource area is secure against any near-term American naval response for the first time in the war, and the victory has bought time: a year or two of uncontested waters, instead of the six months Yamamoto had told Konoe he could promise.",
            },
          ],
        };
        },
        get aPacificWonTwice43() {
          return {
          date: "1943",
          title: "A Free Hand's Price",
          historicalRecord: false,
          situation:
            "Speculative: Midway was a Japanese victory, and a year later Japan has uncontested waters for the first time since the war began. American shipyards are still building, because American industrial capacity never depended on one battle. IGHQ has to decide what to spend the free year on.",
          choices: [
            {
              label: "Press the advantage into the Indian Ocean: coordinate with German efforts against British supply lines while the free hand lasts",
              advisor: { name: "Ugaki", position: "Japan has the ocean to itself for the first time in the war, and the time is better spent helping a war it is fighting alongside than on a defensive perimeter." },
              setFlags: { pacificWonPath: "indianOcean" },
              impact: { readiness: -2, pipeline: -1, initiative: 2 },
              disabledReason: meters.pipeline <= -2 ? "The Indian Ocean is too far to sustain a fleet operation at this pipeline level. Whatever this free hand is worth, it isn't worth spending on a voyage this force can't fuel both ways." : undefined,
              gateCheck: { meter: "pipeline", threshold: -2, label: "Pipeline" },
              next: "theRommelQuestion43",
              outcome:
                "Speculative. Japanese naval pressure in the Indian Ocean, timed against German operations in North Africa and the Middle East, is the closest Axis coordination to a real joint strategy that the war could have produced, and in the real war it never happened. Whether Berlin has anything to coordinate by the time the fleet arrives is the next question.",
            },
            {
              label: "Turn the free hand entirely inward: use the time to harden the resource area against the war everyone still expects eventually",
              advisor: { name: "Yamamoto", position: "A year with nobody shooting at the fleet is worth more spent making the perimeter hard to break than spent on a coordination with Berlin that has never worked." },
              setFlags: { pacificWonPath: "harden" },
              impact: { readiness: 2, pipeline: 1, initiative: -1 },
              disabledReason: meters.readiness <= -4 ? "There isn't the organizational capacity left to execute a full perimeter-hardening program at this readiness level. The resource area holds what it already has, nothing more." : undefined,
              gateCheck: { meter: "readiness", threshold: -4, label: "Readiness" },
              next: "theMainlandCrisis44",
              outcome:
                "Speculative. The year goes into making the existing resource empire harder to break, instead of reaching for a coordination that the alliance never supported. The Pacific war reaches its later years from a stronger defensive position and still faces the same American production.",
            },
          ],
        };
        },
        get theRommelQuestion43() {
          return {
          date: "1943",
          title: "Berlin's Real Offer",
          historicalRecord: false,
          situation:
            "Speculative. A Japanese naval squadron reaches the Indian Ocean ready to act against the British supply lines to the Middle East and North Africa, and finds the German war already lost there. El Alamein ended Rommel's advance in late 1942, and by the time the fleet is on station the Afrika Korps is in retreat and cannot exploit any pressure on British shipping.",
          choices: [
            {
              label: "Press on regardless: degrade British shipping in the Indian Ocean even without a German offensive to support",
              advisor: { name: "Ugaki", position: "Rommel's retreat does not make the British supply lines through the Indian Ocean less worth cutting, and the fleet is already there and should be used, not turned round over a timing it could not control." },
              setFlags: { rommelPath: "pressAnyway" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: "theMainlandCrisis44",
              outcome:
                "Speculative. The squadron attacks British shipping in the Indian Ocean on its own, a modest gain that does not change the course of the Mediterranean war. By the time the fleet is in position there is no German partner able to use it.",
            },
            {
              label: "Recall the fleet: a coordination this late, against a losing partner, isn't worth the fuel",
              advisor: { name: "Yamamoto", position: "The coordination did not look workable when it was proposed and a losing partner does not change that, so the fleet should come home before more is spent on it." },
              setFlags: { rommelPath: "recall" },
              impact: { readiness: 1, pipeline: 1, initiative: -1 },
              disabledReason: meters.pipeline <= -5 ? "There isn't fuel for a clean withdrawal from this distance at this pipeline level. Whatever this squadron does next, an orderly recall isn't an option anymore." : undefined,
              gateCheck: { meter: "pipeline", threshold: -5, label: "Pipeline" },
              next: "theMainlandCrisis44",
              outcome:
                "Speculative. The fleet turns back instead of spending more fuel on a coordination that has come too late to matter.",
            },
          ],
        };
        },
        get earlyPeaceQuestion42() {
          return {
          date: "JUNE – JULY 1942",
          title: "Midway's Concealed Cost",
          historicalRecord: false,
          situation:
            "Naval General Staff knows what the public does not: four fleet carriers and about a hundred of the Navy's best aircrew are gone, hidden behind a communique that announces a victory. Japan still holds the Philippines, Malaya, the Indies, Burma and most of the Southern Resource Area. Roosevelt will not announce unconditional surrender at Casablanca until January 1943. For a short time a negotiated peace has something real to offer in exchange, and no one in the war ministry has yet asked the question now put.",
          choices: [
            {
              label: "Treat Midway as a setback to route around: the war continues on its original premise",
              advisor: { name: "Tojo", position: "Four carriers have been lost, not the war, and one afternoon's misfortune is no argument for abandoning what the government committed to in December." },
              historical: true,
              setFlags: { earlyPeacePath: "fightOn" },
              impact: { readiness: -1, pipeline: 0, initiative: 1 },
              next: "kokodaTrail42",
              outcome:
                "The best negotiating position of the war goes unused, and the war continues on its original timetable toward three more years of attrition.",
            },
            {
              label: "Explore a negotiated exit now, while the territorial position is still real leverage rather than a memory",
              advisor: { name: "Yonai", position: "The war was unwinnable on the terms it was fought for before it started, four lost carriers do not change that, and they finally make it possible to say so aloud." },
              setFlags: { earlyPeacePath: "explore", suspicion: (flags.suspicion || 0) + 2 },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "earlyPeaceChannel42",
              outcome:
                "Speculative. Yonai's well-documented doubts about the war now have somewhere to go. Whether they survive the war ministry, let alone Washington, is the next question.",
            },
            ...(meters.readiness >= 3 && meters.pipeline >= 3
              ? [
                  {
                    label: "Explore a negotiated exit backed by genuine strength, not just an intact map: a Japan that has managed this war well has more to offer than territory alone",
                    advisor: { name: "Yonai", position: "Earlier arguments for a negotiated exit were made while the staff privately thought there was nothing behind them but a hope that Washington would take pity, and this time there is something behind it." },
                    setFlags: { earlyPeacePath: "exploreFromStrength" },
                    impact: { readiness: -1, pipeline: -1, initiative: -1 },
                    next: "aStrongerHandToPlay42",
                    outcome:
                      "A version of Yonai's real argument that his actual 1942 colleagues never had the standing to make: not a plea built on territory alone, but a negotiating position backed by a war effort well-managed up to this point, readiness and supply both intact in ways the historical mid-1942 war ministry, already feeling Midway's unspoken cost, simply didn't have available to point to.",
                  },
                ]
              : []),
          ],
        };
        },
        get aStrongerHandToPlay42() {
          return {
          date: "AUGUST 1942",
          title: "Peace From Strength",
          historicalRecord: false,
          situation:
            "Speculative. Yonai's channel through neutral Switzerland carries an offer that the real war ministry never had the position to make: not a plea to bank wartime gains before they slip away, but a proposal from a Japan whose logistics and readiness are good enough that it reads as strength. There is no precedent for how Washington would receive it.",
          choices: [
            {
              label: "Offer genuine, substantial withdrawal from China in exchange for a negotiated peace recognizing the rest",
              advisor: { name: "Togo", position: "China is the concession that costs the war ministry something, which is why it is the one worth offering, because a peace bought with something real might hold." },
              setFlags: { strongerHandPath: "chinaWithdrawal" },
              impact: { readiness: 0, pipeline: 1, initiative: -2 },
              next: "END",
              uncertain: [
                {
                  weight: modWeight(25, meters.readiness),
                  title: "Washington treats the offer as worth testing",
                  setFlags: { strongerHandResult: "negotiated" },
                  impact: { readiness: 2, pipeline: 1, initiative: 0 },
                  next: "aPeaceNooneExpected42",
                  outcome:
                    "The rarer outcome. A large withdrawal from China, backed by a war effort strong enough that the offer cannot be read as desperation, brings Washington to the table.",
                },
                {
                  weight: (() => { const w = modWeight(25, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "Washington reads the offer as leverage to extract more, not a genuine opening",
                  setFlags: { strongerHandResult: "exploited" },
                  impact: { readiness: -1, pipeline: -1, initiative: -2 },
                  next: "kokodaTrail42",
                  outcome:
                    "The likelier outcome. An offer this far beyond anything Japan has proposed before reads in Washington as weakness to be pressed, and the administration uses the opening to demand more. The war continues, and the China concession is spent for a negotiating position that did not hold.",
                },
              ],
              outcome:
                "A modeled alternative. Historians argue over whether a credible offer from strength, instead of desperation, could have found a more receptive Washington than Japan's weaker approaches ever tested. Roosevelt's unconditional surrender policy was still months from being announced at Casablanca, and whether he would have announced it against an adversary negotiating from strength is unknown.",
            },
            {
              label: "Hold the current territorial line as the offer: no further concessions, take the map as it stands or reject it",
              advisor: { name: "Nagano", position: "The Navy argued for a decade that it needed the resource area and not the mainland, and it will not give up what the war was fought for to pay for a concession that was never its aim." },
              setFlags: { strongerHandPath: "holdLine" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              uncertain: [
                {
                  weight: modWeight(15, meters.readiness),
                  title: "The harder line holds anyway",
                  setFlags: { strongerHandResult: "negotiated" },
                  impact: { readiness: 2, pipeline: 1, initiative: 0 },
                  next: "aPeaceNooneExpected42",
                  outcome:
                    "The rarer outcome. The war effort is strong enough to make the line credible without giving up China, and Washington, unable to dismiss a position this intact, agrees to test it at the table.",
                },
                {
                  weight: (() => { const w = modWeight(15, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "Washington tests the line and finds it bluffable",
                  setFlags: { strongerHandResult: "exploited" },
                  impact: { readiness: -1, pipeline: -1, initiative: -2 },
                  next: "kokodaTrail42",
                  outcome:
                    "The likelier outcome. Washington reads the firmer position as one to test and not to accept, and presses. The war continues on its original terms, and the harder line is never tested at a table.",
                },
              ],
              outcome:
                "A modeled alternative: a harder position than Togo favored, betting that a well-run war effort is leverage enough without giving up China. Whether that holds against an American administration with every reason to test the line is open.",
            },
          ],
        };
        },
        get aPeaceNooneExpected42() {
          return {
          date: "SEPTEMBER 1942",
          title: "The Shape of a Peace That Wasn't Supposed to Happen",
          historicalRecord: false,
          situation:
            "Speculative: there was no negotiation at this stage in the real war. State Department officials, working through the Swiss channel on instructions that keep changing as Washington weighs the offer, are asking questions the real war never reached. Terms for withdrawing from China are agreed in principle. What is not settled is how much of the Southern Resource Area (the Indies' oil, Malaya's rubber, the Philippines) Japan keeps, and on what timetable the rest reverts.",
          choices: [
            {
              label: "Accept a phased withdrawal from the Philippines and Malaya, retaining the Indies as the core of a smaller, negotiated resource sphere",
              advisor: { name: "Togo", position: "A peace on top of every territory the war seized is not on offer, so Japan should keep the resource area that justified the war and let the rest go rather than lose the negotiation trying to keep it all." },
              setFlags: { peaceShapePath: "phasedWithdrawal" },
              impact: { readiness: 1, pipeline: 2, initiative: -1 },
              next: "END",
              outcome:
                "Speculative. A settlement on the resource logic Nagano and the Navy argued from the start: the oil and rubber the war was fought for, kept under a negotiated arrangement, while the Philippines and Malaya revert in phases. It is not the war Japan set out to win. The war ends in 1942, on terms that a strong hand could buy and exhaustion could not, and the three years that followed in the real war do not happen.",
            },
            {
              label: "Hold out for retaining the Indies and the Philippines both, offering only Malaya's withdrawal as the further concession",
              advisor: { name: "Nagano", position: "The Philippines cost the Navy nothing to take and would cost the negotiation everything to give up without a fight, so the value of the position should be tested before the answer is assumed." },
              setFlags: { peaceShapePath: "heldMore" },
              impact: { readiness: -1, pipeline: 0, initiative: 1 },
              next: "END",
              uncertain: [
                {
                  weight: modWeight(40, meters.readiness),
                  title: "The broader position holds through the final rounds",
                  setFlags: { peaceShapeResult: "held" },
                  impact: { readiness: 1, pipeline: 1, initiative: 0 },
                  outcome:
                    "The harder ask pays off. Washington, having decided the negotiation is worth keeping, does not walk away over the Philippines and reopen a war it believed was ending. The 1942 peace leaves Japan a wider sphere than the modest offer would have, a rare outcome within a rare ending.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "Washington's patience for the broader ask runs out",
                  setFlags: { peaceShapeResult: "collapsed" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier outcome. Holding out for more than China and a modest withdrawal costs the negotiation the credibility it needed with an administration that had no obligation to keep testing an offer that kept growing. The channel goes quiet, and the war continues on a timetable the attempt did not shorten.",
                },
              ],
              outcome:
                "A modeled alternative: a more ambitious position than Togo favored, testing what a strong hand is worth instead of settling for the first credible terms. Whether Washington's patience survives an offer that keeps asking for more is what the negotiation is about to show.",
            },
          ],
        };
        },
        get earlyPeaceChannel42() {
          return {
          date: "AUGUST 1942",
          title: "A Channel, If Anyone Answers",
          historicalRecord: false,
          situation:
            "Speculative. Yonai's contacts run through neutral Switzerland. The approach is deliberately vague: an inquiry about what general terms might be discussed, not a formal offer. Two obstacles stand however carefully it is worded. The mood of the American public after Pearl Harbor is no secret, and the Marines are landing on Guadalcanal. Washington, looking at a Japan that still holds the whole resource area, has little reason to treat an overture as anything but an attempt to keep wartime gains at the table.",
          choices: [
            {
              label: "Open the channel anyway: even a rejected overture establishes there was one",
              advisor: { name: "Togo", position: "Washington is unlikely to answer generously, but it may matter later that Japan asked while it still held everything it had taken and before the war reached Japan itself." },
              setFlags: { earlyPeaceChannelPath: "press" },
              impact: { readiness: 0, pipeline: 0, initiative: -1 },
              next: "earlyPeaceOutcome42",
              outcome:
                "The inquiry goes forward and nothing comes of it. Washington reads it as an attempt to keep gains at the table, from a government still holding everything it took eight months ago.",
            },
            {
              label: "Withdraw the inquiry before it reaches anyone who might leak it: the domestic risk outweighs the diplomatic upside",
              advisor: { name: "Nagano", position: "If the inquiry becomes known inside the war ministry before Washington, the channel does not matter, and what matters is who moves against Yonai first." },
              setFlags: { earlyPeaceChannelPath: "withdraw", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "earlyPeaceOutcome42",
              outcome:
                "The inquiry is shelved before it reaches Bern in any form Washington could act on. It was never rejected, because it was never sent.",
            },
          ],
        };
        },
        get earlyPeaceOutcome42() {
          return {
          date: "1942 – 1945",
          title: "Three Years Early",
          historicalRecord: false,
          situation:
            "Speculative. Whether it was pressed or withdrawn, the 1942 channel changes nothing in the arithmetic of the rest of the war: American industrial capacity and the Manhattan Project did not depend on one overture. What it changes is smaller. Someone in this government asked the question three years before the real government asked it." +
            (flags.earlyPeaceChannelPath === "press"
              ? " This particular someone pressed the channel even expecting rejection, on the theory that a rejected overture on the record still counts for something a silent one never could."
              : flags.earlyPeaceChannelPath === "withdraw"
              ? " This particular someone withdrew rather than press a channel already expected to fail, on the theory that a quiet retreat costs less than a rejection this government would have had to answer for."
              : ""),
          choices: [
            {
              label: "Let the record show the question was asked early, whatever else follows from here",
              advisor: { name: "Yonai", position: "Ending the war in 1942 was never the expectation, but it should mean something, eventually, that someone asked in 1942 and not in 1945." },
              setFlags: { earlyPeaceFinalPath: "askedEarly" },
              impact: { readiness: 0, pipeline: 1, initiative: -1 },
              next: "END",
              outcome:
                "The question was asked early and not answered. It changes nothing about where the war ends, and changes how it is remembered in the room where it was asked: Midway was met with reconsideration, not with reflexive continuation.",
            },
            {
              label: "Close the thread here and let the historical war simply resume",
              advisor: { name: "Tojo", position: "Whatever was or was not asked in the summer of 1942, the government is fighting the war it committed to, and looking back at a closed channel accomplishes nothing now." },
              setFlags: { earlyPeaceFinalPath: "resumed" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: "END",
              outcome:
                "The war resumes on its historical footing, and the 1942 channel is never tried again. The summer spent on a question this government was not built to ask has cost readiness and initiative.",
            },
          ],
        };
        },
        get kokodaTrail42() {
          return {
          date: "JULY – NOVEMBER 1942",
          title: "The Kokoda Track",
          historicalRecord: true,
          situation:
            "With the seaborne invasion of Port Moresby turned back at Coral Sea, Major General Horii's South Seas Detachment is attempting the only alternative: an overland march across the Owen Stanley Range on a single foot-track, carrying supplies on men's backs because no vehicle can follow. The detachment has pushed to within thirty miles of Port Moresby, but the supply line behind it, stretched past what porters can sustain, is failing faster than the advance.",
          choices: [
            {
              label: "Press the final push toward Port Moresby despite the supply collapse behind it",
              advisor: { name: "Horii", position: "The force has come further than any staff estimate thought possible, and its commander will not be the officer who turns back thirty miles from the objective because a supply line built for half the distance is failing." },
              historical: true,
              setFlags: { kokodaPath: "press" },
              impact: { readiness: -3, pipeline: -3, initiative: 1 },
              disabledReason: meters.pipeline <= -2 ? "There's no tonnage left to carry further up a track porters are already failing to supply. The push cannot be sustained, only ordered." : undefined,
              gateCheck: { meter: "pipeline", threshold: -2, label: "Pipeline" },
              next: "guadalcanal42",
              outcome:
                "IGHQ orders the advance halted in September, because of the supply situation as much as the Australian resistance, and the withdrawal back across the same mountains becomes its own disaster: starvation, disease and a fighting retreat that costs nearly as many men as the advance. Horii drowns crossing the Kumusi River during the retreat. Most of the detachment is lost before the campaign ends.",
            },
            {
              label: "Order an earlier withdrawal: preserve the detachment before the supply line fully collapses",
              advisor: { name: "Imamura", position: "Thirty miles from an objective that cannot be supplied is not thirty miles closer to winning it, and a detachment that survives the year is worth more than one that dies short of Port Moresby proving a point." },
              setFlags: { kokodaPath: "earlyWithdraw" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "guadalcanal42",
              outcome:
                "A modeled alternative, on the supply arithmetic that forced IGHQ's hand in the real war. Withdrawing before the advance exhausts itself keeps more of the detachment for the later fighting in New Guinea, at the price of never testing whether the last thirty miles could have been crossed. Most historians of the campaign judge Port Moresby out of reach given what the track could carry, so an early withdrawal spends fewer lives to reach the same limit.",
            },
          ],
        };
        },
        get guadalcanal42() {
          return {
          date: "AUGUST – NOVEMBER 1942",
          title: "The Attrition Nobody Planned For",
          historicalRecord: true,
          situation:
            (flags.midwayResult === "disaster"
              ? "Four fleet carriers and their air crews are gone. Whatever happens in the Solomons now happens without the striking power this war was built around. "
              : flags.midwayResult === "survived"
              ? "Two fleet carriers survived Midway's morning, bruised but afloat, a fraction of the striking power this plan was built around, but a fraction that still matters. "
              : "") +
            "American Marines have landed on Guadalcanal and seized the unfinished airfield the Navy was building there, Henderson Field, now flying American aircraft against the very supply line it was meant to protect. What follows is not the decisive battle either side planned: six months of night destroyer actions, starvation on both sides of the jungle line, and a steady loss of veteran naval aircrew that Japan's training system cannot replace at this rate." +
            (flags.kokodaPath === "press"
              ? " Horii's column is still pushing toward Port Moresby on a supply line already failing, a second front bleeding the same limited transport capacity this campaign needs for its own night runs down the Slot."
              : flags.kokodaPath === "earlyWithdraw"
              ? " The early withdrawal from the Kokoda Track freed transport capacity that, in principle, this campaign could use, though freed capacity and available capacity aren't quite the same thing once Guadalcanal's own demands are counted."
              : ""),
          choices: [
            {
              label: "Commit destroyers and remaining naval air strength to retake Henderson Field",
              advisor: { name: "Tanaka", position: "The Tokyo Express runs every night destroyers remain, and every night they do not, the airfield gets stronger and the campaign more expensive to reverse." },
              historical: true,
              setFlags: { guadalcanalPath: "commit" },
              impact: { readiness: -3, pipeline: -2, initiative: 0 },
              disabledReason: meters.pipeline <= -2 ? "Destroyer squadron fuel stocks can't sustain nightly Tokyo Express runs at this tonnage. There's nothing left to commit." : undefined,
              gateCheck: { meter: "pipeline", threshold: -2, label: "Pipeline" },
              next: "keGoWithdrawal43",
              uncertain: [
                {
                  weight: modWeight(45, meters.initiative),
                  title: "The November naval battle goes as close as it did",
                  setFlags: { guadalcanalNavalResult: "contested" },
                  impact: { readiness: 0, pipeline: 0, initiative: 1 },
                  outcome:
                    "The night actions off Guadalcanal in November are as close and as costly as the real ones: two Japanese battleships lost, two American admirals killed, the outcome in doubt until the last exchanges of fire. The campaign's course does not change. It gives the fleet a fighting chance that nobody at Combined Fleet headquarters expected.",
                },
                {
                  weight: (() => { const w = modWeight(45, meters.initiative); return Math.max(5, 100 - w); })(),
                  title: "The reinforcement runs are caught cold",
                  setFlags: { guadalcanalNavalResult: "disaster" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "A worse night than the real one. Radar-equipped American cruisers catch the reinforcement convoy with less warning than in the real battle, and the destroyer force meant to keep Henderson Field contested loses more of itself in a week than the campaign's normal rate of loss.",
                },
              ],
              outcome:
                "What happened, roughly: six months of night naval actions, fought with skill and with no answer to American aircraft flying from a field that is never retaken. The veteran aircrew spent here are never replaced. What comes next is how the army gets off the island.",
            },
            {
              label: "Concede Guadalcanal early: pull back to a defensible perimeter at Rabaul and Bougainville",
              advisor: { name: "Inoue", position: "Japan is trading its most experienced pilots for a jungle airfield it may not hold, and should trade ground it can afford to lose for pilots it cannot replace." },
              setFlags: { guadalcanalPath: "earlyWithdraw", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 2, pipeline: -1, initiative: -2 },
              next: "earlyPerimeter43",
              outcome:
                "A modeled alternative. Conceding early spares the destroyers and the remaining naval aircrew six months of losses, at the price of giving up the initiative in the Solomons months ahead of the real schedule and handing American planners a forward base sooner.",
            },
            ...(meters.pipeline <= -6
              ? [
                  {
                    label: "Abandon destroyer resupply entirely: drum-float what little remains ashore and let the garrison stretch it as far as it goes",
                    advisor: { name: "Tanaka", position: "Full drums sealed with enough air to float, tied on a line and cut loose offshore for the current to carry in, are not a supply run, and are closer to a message in a bottle read by starving men." },
                    setFlags: { guadalcanalPath: "drumResupply" },
                    impact: { readiness: -1, pipeline: 1, initiative: -1 },
                    next: "keGoWithdrawal43",
                    outcome:
                      "A real, documented method, not an invented one: with destroyer runs no longer sustainable at any acceptable loss rate, the Navy improvised steel drums partially filled with food and medical supplies, sealed with enough trapped air to float, lashed together and cut loose offshore for the current and the garrison's own swimmers to recover under fire. It never approached what the destroyer runs, at full strength, could deliver, and a hard scramble in current and darkness was as likely to lose the drums to the sea as get them ashore intact. It kept a starving garrison fed at the barest possible margin, at a fuel cost the destroyer runs, however dangerous, never actually approached.",
                  },
                ]
              : []),
          ],
        };
        },
        get keGoWithdrawal43() {
          return {
          date: "JANUARY – FEBRUARY 1943",
          title: "Operation Ke-Go",
          historicalRecord: true,
          situation:
            "Guadalcanal is lost, and Imperial Headquarters has to decide how to get roughly 11,000 remaining soldiers off the island before American forces finish reducing the perimeter. The real operation, Ke-Go, is one of the most skillful pieces of naval logistics either side manages in the war: a buildup that leads the Americans to expect reinforcement, and an air campaign that draws their attention away from the destroyer runs." +
            (flags.guadalcanalPath === "drumResupply"
              ? " The men being evacuated now are the same ones who spent the campaign's final weeks recovering sealed drums from the surf under fire rather than eating anything a destroyer actually delivered. Whatever this evacuation manages to save, it isn't saving a garrison that was ever properly fed."
              : "") +
            (flags.guadalcanalNavalResult === "contested"
              ? " The destroyer force this evacuation depends on is the same one that fought the November naval battles to a genuine standstill rather than a rout, a fighting chance that's part of why there's still enough of a squadron left to attempt Ke-Go's kind of precision at all."
              : flags.guadalcanalNavalResult === "disaster"
              ? " The destroyer force this evacuation depends on is thinner than it should be, having taken losses in November closer to a rout than a contested fight, which is exactly the kind of shortfall a deception plan this precise has no real margin to absorb."
              : ""),
          choices: [
            {
              label: "Commit to the deception plan in full: stage a visible reinforcement buildup to mask the actual evacuation",
              advisor: { name: "Tanaka", position: "Five months of watching how much attention American reconnaissance gives this water show how to make them see an army arriving while one is taken away." },
              historical: true,
              setFlags: { keGoPath: "deception" },
              impact: { readiness: 1, pipeline: -1, initiative: 1 },
              next: "yamamotoDeath43",
              outcome:
                "On February 1, 4 and 7, destroyers lift more than 10,000 soldiers off Guadalcanal. The American command does not realize an evacuation is under way until it is nearly complete, having spent the preceding weeks expecting a reinforcement effort. It is a rare success: an evacuation that costs far less than the fighting it ends, and a deception that worked against an opponent whose intelligence was by 1943 very good at reading Japanese naval movements.",
            },
            {
              label: "Skip the deception, evacuate directly under cover of the remaining air strength: faster, more exposed",
              advisor: { name: "Yamamoto", position: "The deception asks for more patience than the fleet has fuel to spend, and it is better to move the men now under whatever cover remains than lose them to a plan that runs a week too long." },
              setFlags: { keGoPath: "direct" },
              impact: { readiness: -1, pipeline: 1, initiative: -1 },
              next: "yamamotoDeath43",
              uncertain: [
                {
                  weight: modWeight(40, meters.readiness),
                  title: "The faster timeline gets most of the garrison out before American forces adjust",
                  setFlags: { keGoResult: "mostlyClean" },
                  impact: { readiness: 1, pipeline: 0, initiative: 0 },
                  outcome:
                    "Speed pays off well enough. Most of the garrison is off the island before the American command turns to stopping the withdrawal, at a bearable cost to the destroyers running without the cover of a deception.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "American forces catch the withdrawal partway through",
                  setFlags: { keGoResult: "costlyExposed" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier outcome. American reconnaissance identifies the withdrawal while it is happening, and the later runs go in against a defense that has had warning. More destroyers are lost and a larger part of the garrison is left behind when the window closes.",
                },
              ],
              outcome:
                "A modeled alternative: a faster, more exposed evacuation that skips the weeks of false reinforcement and has to survive being seen for what it is.",
            },
          ],
        };
        },
        get yamamotoDeath43() {
          return {
          date: "APRIL 1943",
          title: "Operation Vengeance",
          historicalRecord: true,
          situation:
            "American codebreakers intercepted Yamamoto's inspection itinerary days ago, down to the minute his aircraft would arrive over Bougainville. P-38 fighters met his flight on schedule on April 18. Yamamoto is dead, and IGHQ has to decide within hours what the country is told." +
            (flags.keGoPath === "deception"
              ? " The deception plan that pulled Guadalcanal's garrison out under cover of a staged buildup worked, a real, recent success in managing what the enemy sees and what this government tells its own public. Whether the same discipline can be applied to a loss this personal, rather than a withdrawal this practical, is about to be tested."
              : flags.keGoPath === "direct"
              ? " The direct evacuation chosen at Guadalcanal skipped the deception this government might otherwise have practiced managing bad news. There's less institutional muscle memory here for shaping what the country hears than there might have been."
              : "") +
            (flags.keGoResult === "mostlyClean"
              ? " Whatever this government tells the public about Yamamoto, it does so from a Guadalcanal withdrawal that actually held together, the garrison mostly out before American pressure caught up with it, a rare piece of recent news this staff didn't have to manage carefully."
              : flags.keGoResult === "costlyExposed"
              ? " Whatever this government tells the public about Yamamoto, it does so from a Guadalcanal withdrawal that cost more than planned, American forces catching part of the garrison mid-evacuation, one more piece of bad news this staff has had to manage in the same stretch of weeks."
              : "") +
            (flags.perimeterResult === "denied"
              ? " This is a staff that, weeks ago, actually denied the Americans their airfield outright, the rare early win this carrier gamble was actually sent to produce. Losing Yamamoto now lands against a record with at least one real success on it, not against an unbroken run of bad news."
              : flags.perimeterResult === "tooLate"
              ? " This is a staff that spent its carrier force's early advantage at the Solomons without actually stopping the airfield it was sent to deny, one more setback in the same stretch of weeks Yamamoto's death now joins."
              : ""),
          choices: [
            {
              label: "Conceal the death for now: announce it publicly only once the shock can be managed",
              advisor: { name: "Tojo", position: "The Emperor will know today and the country need not, and it is better to choose the moment the news arrives than let it arrive on its own." },
              historical: true,
              setFlags: { yamamotoDeathPath: "concealed" },
              impact: { readiness: 0, pipeline: 0, initiative: -1 },
              next: "attu43",
              outcome:
                "Word reaches the Emperor at once, and the public announcement waits until May 21, more than a month later. Yamamoto is given a state funeral on June 5 and promoted posthumously to Fleet Admiral. The Navy has lost the officer who had said from the start that the war could be won only quickly.",
            },
            {
              label: "Announce it immediately: the country will find out regardless, better to control the story from the start",
              advisor: { name: "Koga", position: "The country will find out regardless, the new commander takes over whether the news is public today or in a month, and the Navy's officers should hear it from their own side first." },
              setFlags: { yamamotoDeathPath: "announced" },
              impact: { readiness: -1, pipeline: 0, initiative: 0 },
              next: "attu43",
              outcome:
                "A modeled alternative: the loss is announced at once instead of after a month. Whether early honesty costs more in morale than the month of concealment bought is not settled here. Admiral Koga inherits a Combined Fleet that has lost its most influential voice on how to end the war.",
            },
          ],
        };
        },
        get attu43() {
          return {
          date: "MAY 1943",
          title: "Attu",
          historicalRecord: true,
          situation:
            "The garrison holding Attu in the Aleutians, roughly 2,600 men under Colonel Yamasaki, is cut off, out of most of its ammunition, and facing an American force it has no realistic path to defeating or escaping. After the Komandorski Islands engagement in March there is no fleet in the region to attempt a relief, and no convoy IGHQ can promise and deliver. Yamasaki's message to Tokyo is not a request for rescue. It asks for instructions.",
          choices: [
            {
              label: "Authorize surrender: order Yamasaki to lay down arms rather than continue an unwinnable defense",
              advisor: { name: "Sugiyama", position: "The order costs the army's own doctrine something to issue, but twenty-six hundred men should not be spent on a battle already lost to prove a point about what the army will order." },
              setFlags: { attuPath: "surrender" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "theMainlandCrisis44",
              outcome:
                "A modeled alternative that breaks with the doctrine governing every other besieged garrison: surrender instead of a final stand. It saves lives that the real battle spent. It also leaves IGHQ with a question its propaganda cannot answer: what to tell the public about a garrison that surrendered, in a war whose public story is gyokusai, the shattered jewel.",
            },
            {
              label: "Leave the decision to Yamasaki's own command: no order either way, let the garrison decide its own end",
              advisor: { name: "Tojo", position: "Twenty-six hundred men do not die or surrender on an order given from a desk in Tokyo, and Colonel Yamasaki, who has commanded the garrison from the start, should command its end." },
              historical: true,
              setFlags: { attuPath: "noOrder" },
              impact: { readiness: -1, pipeline: 0, initiative: 1 },
              next: "theMainlandCrisis44",
              outcome:
                "What happened, in substance: no surrender order reaches Attu, and Yamasaki leads about 1,000 men still able to walk in a final charge on May 29 that breaks through the American lines before it is destroyed almost to the last man. Of the garrison of about 2,600, 28 are taken alive. It is an early example of the mass banzai charge that later defenses on Saipan and elsewhere repeat.",
            },
          ],
        };
        },
        get theMainlandCrisis44() {
          const fleetPreserved = !!(flags.perimeterPath || flags.fsPath || flags.earlyPerimeterPath);
          return {
          date: "1944",
          title: "Two Fronts, One Army Left",
          historicalRecord: true,
          situation:
            "In early 1944 the mainland and Pacific fronts are competing for the same shrinking reserve of infantry divisions, and neither offensive on the table can be fully supplied without starving the other. Operation U-Go proposes a drive across the Chindwin into Assam to take Imphal and Kohima and break up the supply base Britain's Fourteenth Army has spent two years building. Operation Ichi-Go proposes the opposite theater: a drive by some 500,000 men through China to overrun the airfields from which General Chennault's Fourteenth Air Force attacks Japanese shipping and, increasingly, the home islands." +
            (flags.burmaPath === "methodical"
              ? " Fifteenth Army's more deliberate advance into Burma two years ago has left it in somewhat better order for whatever comes next here than the historical record's harder-used divisions were."
              : "") +
            (flags.chinaPeacePath === "negotiate"
              ? " The divisions a genuine 1940 settlement with Chiang would have freed are, in this history, exactly the divisions this crisis is short of. The war ministry's decision to keep fighting China instead of ending it is the debt coming due here."
              : "") +
            (fleetPreserved
              ? " None of this changes for having a fleet still afloat somewhere in the Pacific. The mainland's divisions were never the Navy's to allocate, and Army planning here runs on its own logic regardless of how the carrier war went."
              : "") +
            (flags.australiaLandingPath === "press"
              ? " The shipping tonnage burned chasing a beachhead in northern Australia two years ago is exactly the tonnage this crisis needs and doesn't have. Nobody in this room says the word Darwin out loud. Nobody needs to."
              : flags.australiaLandingPath === "abort"
              ? " The recall off the Australian coast two years ago cost less than a pressed landing would have, but the tonnage stripped from three fronts to attempt it in the first place never fully came back, and this crisis is short exactly that much."
              : "") +
            (flags.attuPath === "surrender"
              ? " Attu's garrison surrendered rather than die in place, a quiet break from the historical record's own account of that island, and whatever men that decision preserved are, in some diminished form, part of what this crisis has left to draw on."
              : flags.attuPath === "noOrder"
              ? " Attu's garrison got the historical order and the historical result: a banzai charge into American lines rather than surrender, and none of those men are any part of what this crisis has left to draw on now."
              : "") +
            (flags.ascendantPath === "pressHawaii"
              ? " The raids pressed toward Hawaii two years ago cost real carrier time and aircrew this crisis could use now, spent testing a reach that never converted into anything this mainland front can currently draw on."
              : flags.ascendantPath === "consolidate"
              ? " The decision to consolidate rather than press toward Hawaii two years ago banked exactly the kind of reserve this mainland crisis is short of everywhere else."
              : ""),
          choices: [
            {
              label: "Launch both offensives as planned: bet the army can sustain two fronts running at once",
              advisor: { name: "Sugiyama", position: "Telling either front commander that his offensive is the one the army cannot afford is not a call the chief of staff will make, so both go ahead and the army finds out what it can sustain." },
              historical: true,
              setFlags: { mainlandPath: "both" },
              impact: { readiness: -4, pipeline: -3, initiative: 1 },
              disabledReason: meters.readiness <= -3 ? "Combat effectiveness has degraded too far to sustain two simultaneous offensives. The divisions available can support one front, not two." : undefined,
              gateCheck: { meter: "readiness", threshold: -3, label: "Readiness" },
              next: fleetPreserved ? "theLongWarFooting45" : "philippineSea44",
              outcome:
                "What happened: both offensives were launched within weeks of each other, U-Go in March and Ichi-Go in April. Ichi-Go becomes the largest Japanese ground offensive of the war, overrunning Chennault's forward airfields and opening a corridor through southern China. U-Go is a disaster: three divisions go forward on twenty days of rations into a campaign that the monsoon and Fourteenth Army's defense stretch past three months, and the retreat is one of the worst defeats the Imperial Army suffers anywhere, with some 55,000 casualties. Japan wins the battle it needed less and loses the one it needed more.",
            },
            {
              label: "Recognize the logistics can't support both: commit fully to Ichi-Go, cancel U-Go outright",
              advisor: { name: "Kawabe", position: "Mutaguchi has not answered in two years what the divisions eat after day twenty, and the divisions should go to China instead." },
              setFlags: { mainlandPath: "ichiGoOnly", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: -1, initiative: 1 },
              next: "ichiGoTriumph44",
              outcome:
                "A modeled alternative that concentrates the army. The divisions U-Go would have spent in Assam's monsoon reinforce a larger, better supplied Ichi-Go, and Britain's Fourteenth Army never fights the defensive battle at Imphal and Kohima. The casualties U-Go cost are not suffered there. What a fully supplied Ichi-Go buys is a separate question.",
            },
            {
              label: "Launch both offensives, but hold back genuine reserves to resupply U-Go past the twenty-day ration assumption that doomed it historically",
              advisor: { name: "Kawabe", position: "Mutaguchi's ration plan was never expected to survive the monsoon, and there are now divisions that can be held back to keep U-Go supplied." },
              setFlags: { mainlandPath: "bothResourced" },
              impact: { readiness: -3, pipeline: -3, initiative: 2 },
              disabledReason: meters.readiness < 5 ? "This army doesn't have reserve strength to spare. Resupplying U-Go past its historical failure point needs a readiness margin this command doesn't currently have." : undefined,
              gateCheck: { meter: "readiness", threshold: 5, label: "Readiness" },
              next: fleetPreserved ? "theLongWarFooting45" : "philippineSea44",
              outcome:
                "A modeled alternative. With a reserve in hand, U-Go need not repeat its real failure of three divisions on twenty days of rations in a campaign that ran past three months. Ichi-Go still succeeds much as it did. U-Go, properly resupplied, is a different fight from the one that cost some 55,000 casualties, but not necessarily a won one, because Fourteenth Army's defense of Imphal and Kohima did not depend only on Japanese logistics.",
            },
          ],
        };
        },
        get ichiGoTriumph44() {
          const fleetPreserved = !!(flags.perimeterPath || flags.fsPath || flags.earlyPerimeterPath);
          return {
          date: "LATE 1944",
          title: "The Corridor",
          historicalRecord: false,
          situation:
            "Speculative. A fully supplied Ichi-Go does what the real one only partly achieved: a continuous overland corridor from Manchuria to French Indochina, Chennault's forward airfields overrun one after another, more Chinese territory taken in one campaign than in any Japanese offensive since 1938. Staff maps at Imperial Headquarters show the largest area of Japanese-held land of the war. The question is what this solves.",
          choices: [
            {
              label: "Present the corridor as proof the war in China is winnable outright",
              advisor: { name: "Kawabe", position: "More ground has changed hands this year than in any since the war began, and the staff should be asked what that ground has done to the war that is being lost." },
              historical: true,
              setFlags: { ichiGoTriumphPath: "proofOfWin" },
              impact: { readiness: 0, pipeline: -1, initiative: 1 },
              next: fleetPreserved ? "theLongWarFooting45" : "philippineSea44",
              outcome:
                "The corridor holds, and holding it changes nothing in the war that decides the outcome. American submarines are still cutting the oil route from the Indies, and B-29s are still reaching the home islands from the Marianas, which the China campaign never threatened. A staff that spent a year measuring success in captured territory arrives at 1945 with a better map and a war going as badly as before.",
            },
            {
              label: "Treat the corridor honestly, as a battlefield win with no bearing on the war Japan is actually losing",
              advisor: { name: "Umezu", position: "A map is not a strategy, Chennault's airbases are gone, and the war those bases were never going to win for America is still being lost somewhere else entirely." },
              setFlags: { ichiGoTriumphPath: "honestAccounting" },
              impact: { readiness: -1, pipeline: 0, initiative: -1 },
              next: fleetPreserved ? "theLongWarFooting45" : "philippineSea44",
              outcome:
                "Speculative. The staff admits that a real victory in China is worth almost nothing against an opponent whose war was never decided there. Troop dispositions and resources change little. It changes what the men making the next decision let themselves believe about the one before it.",
            },
          ],
        };
        },
        get theLongWarFooting45() {
          return {
          date: "1945",
          title: "A War Fought From a Different Position",
          historicalRecord: false,
          noFlavor: true,
          situation:
            "Speculative. Whatever carrier strength or veteran aircrew survived the years since Midway is still on the books in 1945. It does not change what American shipyards can build in a year, or the Marianas: Saipan, Tinian and Guam fell in the summer of 1944 to a Central Pacific campaign on its own timetable, and Tinian's airfields are what put the home islands within B-29 range. What a surviving fleet or cadre changes is the argument inside Imperial Headquarters. In the real war the surrender debate broke only when Anami's war ministry ran out of anything left to point to." +
            (flags.kuritaPath === "withdraw"
              ? " The surface fleet that turned back at Leyte rather than pressing through is long gone as an offensive force either way, but the decision itself still gets argued over in this room, whether caution at San Bernardino Strait was prudence or a lost chance nobody here will ever fully settle."
              : "") +
            (flags.tripartitePath || flags.washingtonPath
              ? " Yamamoto's own 1941 warning was that Pearl Harbor bought a year, perhaps two, of a free hand, not a war stretched this far past it. Whether the extra years were worth it is the question his warning was trying to head off in the first place."
              : "") +
            (flags.yamamotoDeathPath === "announced"
              ? " His death was absorbed honestly back in April 1943, not staged for a quieter month. Whatever that cost in morale at the time, it isn't a debt this government is still carrying now."
              : "") +
            (flags.midwayResult === "survived"
              ? " Carriers that never went down at Midway are the reason one more season of resistance can be argued for at all without sounding delusional."
              : "") +
            (flags.indochinaPath === "staged"
              ? " The cautious, staged approach to Indochina back in 1941 bought a slower slide toward war than the historical full occupation did. Whether the caution was worth it is a question this government still hasn't had to answer honestly."
              : "") +
            (flags.unificationPath === "forced"
              ? " The joint command structure forced through in 1940, resented in both services ever since, is at least still running. Whatever gets decided here is being decided on one intelligence picture instead of two."
              : "") +
            (flags.ichiGoTriumphPath === "proofOfWin"
              ? " The China corridor is still, in some quarters, being cited as proof the war in China was winnable outright, an argument this room has heard enough times by now to have stopped fully believing it either way."
              : flags.ichiGoTriumphPath === "honestAccounting"
              ? " Nobody in this room has to relitigate what the China corridor was actually worth. That honesty was bought once already, and it's still on the books."
              : ""),
          choices: [
            {
              label: "Use what's actually still intact to seek terms from a position of genuine remaining strength, rather than the historical exhaustion",
              advisor: { name: "Togo", position: "A ministry that goes to the table with nothing to offer and nothing to threaten with gets the terms it deserves, and the fleet, air arm or cadre that Tokyo assumed would be spent is worth using at a table as well as in a battle." },
              setFlags: { longWarPath: "terms", suspicion: (flags.suspicion || 0) + 2 },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "END",
              outcome:
                "Speculative. Togo's peace faction loses its strongest card, that there is nothing left, but gains a negotiating hand. Washington's demand for unconditional surrender was never about how much Japan had left to lose, so the offer may go unanswered. If it lands, the peace looks nothing like the occupation: an armistice instead of unconditional surrender could leave the imperial institution's authority unsettled, keep Korea and Formosa an open question into the late 1940s, and leave Japan's Cold War alignment undecided. None of that is guaranteed.",
            },
            {
              label: "Commit whatever's preserved to Ketsu-Go regardless: a squadron saved from history doesn't settle the argument, it just changes who's making it",
              advisor: { name: "Anami", position: "A preserved squadron does not change what America can build in a year that Japan cannot, but it changes how long the minister can keep telling the cabinet that the fight is worth having." },
              setFlags: { longWarPath: "ketsuGoRegardless" },
              impact: { readiness: -3, pipeline: -1, initiative: 2 },
              next: "afterHiroshima45",
              outcome:
                "Speculative. The preserved strength is spent on the same home-islands defense Ketsu-Go always planned. The larger effect is inside Imperial Headquarters: a war ministry with a fleet or aircrew to point to can argue that the fight is not over with material behind it, and not only resolve.",
            },
          ],
        };
        },
        get philippineSea44() {
          return {
          date: "JUNE 1944",
          title: "The Marianas: What's Left of the Carrier Air Arm",
          historicalRecord: true,
          situation:
            "American forces landed on Saipan on June 15. The Mobile Fleet under Ozawa, nine carriers rebuilt since the losses of 1942, is the last serious attempt to contest American carrier superiority, but its pilots have a fraction of the flight hours their 1942 predecessors had. The plan relies on land-based aircraft in the Marianas to strike first and wear down the American carriers before Ozawa's inexperienced air groups have to close the range. Whether it can survive American radar-directed fighter control is the open question.",
          choices: [
            {
              label: "Commit the fleet to the decisive battle for the Marianas as planned",
              advisor: { name: "Ozawa", position: "The air groups are not what a fleet action against this many American carriers would have needed two years ago, but Saipan falls regardless if the fleet does not fight for it." },
              historical: true,
              setFlags: { philippineSeaPath: "commit" },
              impact: { readiness: -4, pipeline: -1, initiative: 0 },
              disabledReason: meters.readiness <= -3 ? "There aren't enough trained aircrew left to man Ozawa's air groups at all, let alone commit them to a fleet action. The training pipeline is the casualty here, not just this battle's outcome." : undefined,
              gateCheck: { meter: "readiness", threshold: -3, label: "Readiness" },
              next: "onishiKamikaze44",
              outcome:
                "American pilots call it the Marianas Turkey Shoot. About 600 Japanese aircraft are lost over the two days against about 120 American, and it is the worst defeat Japanese naval aviation suffers in the war. Two fleet carriers, Taiho and Shokaku, are also sunk by submarines. The loss that matters most is the last pilots trained to a real standard, and the training system has neither the fuel nor the time to produce more.",
            },
            {
              label: "Decline the fleet action: withdraw the Mobile Fleet, abandon Saipan's garrison without a naval battle",
              advisor: { name: "Toyoda", position: "The fleet can be committed and lost along with Saipan, or withheld and only Saipan lost, and it is not clear that committing it changes which of those happens." },
              setFlags: { philippineSeaPath: "withdraw" },
              impact: { readiness: 2, pipeline: 0, initiative: -2 },
              next: "onishiKamikaze44",
              outcome:
                "A modeled alternative. Ozawa's inexperienced air groups were unlikely to change the outcome on Saipan whether they fought or not, given the gap in training and the American advantage in radar and fighter control. Withdrawing keeps the fleet's ships and what is left of its pilots for a later battle, at the price of leaving Saipan's garrison and its civilians to face the invasion with no naval support at all.",
            },
            ...(meters.readiness >= 4
              ? [
                  {
                    label: "Commit the fleet with a more experienced air wing than history had to work with, the training pipeline this war has protected until now",
                    advisor: { name: "Ozawa", position: "These are not the pilots Nagumo had at Midway, but they are veterans and not the barely trained boys a rushed replacement pipeline would have sent, and that difference is the plan." },
                    setFlags: { philippineSeaPath: "commitTrained" },
                    impact: { readiness: -3, pipeline: -1, initiative: 1 },
                    next: "onishiKamikaze44",
                    uncertain: [
                      {
                        weight: modWeight(30, meters.readiness),
                        title: "The land-based strike thins the American carrier screen first",
                        setFlags: { philippineSeaResult: "genuineContest" },
                        impact: { readiness: 1, pipeline: 0, initiative: 2 },
                        outcome:
                          "The rarer, more consequential branch: pilots with real flight hours behind them close the range in a battle that costs the American fleet something real rather than the historical near-massacre, still a defeat against American radar-directed fighter control and industrial numbers neither side's planning could change, but a contested defeat rather than a one-sided one, the training pipeline this war managed to protect finally showing up where it mattered most.",
                      },
                      {
                        weight: (() => { const w = modWeight(30, meters.readiness); return Math.max(5, 100 - w); })(),
                        title: "American radar and numbers decide it regardless of pilot quality",
                        setFlags: { philippineSeaResult: "stillLopsided" },
                        impact: { readiness: -2, pipeline: 0, initiative: -1 },
                        outcome:
                          "The likelier outcome, and the one serious historians of the battle would expect: American radar-directed fighter control and sheer numerical advantage were never primarily a function of Japanese pilot experience, and a better-trained air wing still runs into a fight it can't win on those terms, a costlier defeat to inflict than the historical one, but a defeat all the same.",
                      },
                    ],
                    outcome:
                      "A position the historical Mobile Fleet, whose pilots the actual Japanese Navy's own training pipeline had already failed to properly prepare by 1944, never had: an experienced air wing behind the same plan, the return on whatever this war's training and readiness decisions really protected rather than spent elsewhere.",
                  },
                ]
              : []),
          ],
        };
        },
        get onishiKamikaze44() {
          return {
          date: "OCTOBER 1944",
          title: "Onishi's Proposal",
          historicalRecord: true,
          situation:
            "With the Leyte landing under way and the First Air Fleet down to about thirty operational aircraft, Vice Admiral Onishi has arrived in the Philippines with a proposal: to crash aircraft deliberately into American ships, not as the last act of individual pilots but as organized policy, with its own units and a name. He wants it made the fleet's doctrine and not an exception to it." +
            (flags.philippineSeaPath === "withdraw"
              ? " The aircraft this fleet has left are fewer than they might have been, but not for the reason Onishi is describing. The Marianas withdrawal preserved something, and this proposal is being made from a position slightly less desperate than the historical one, for whatever difference that actually makes to the argument."
              : "") +
            (flags.philippineSeaResult === "genuineContest"
              ? " The air wing that fought a real, contested battle at the Marianas rather than the historical near-massacre is most of the reason Onishi has thirty aircraft left to describe at all, rather than fewer still."
              : flags.philippineSeaResult === "stillLopsided"
              ? " The better-trained air wing that fought the Marianas anyway is largely why there are still thirty aircraft to talk about, a training investment spent regardless of what the battle itself cost."
              : ""),
          choices: [
            {
              label: "Approve organized suicide attacks as formal naval doctrine",
              advisor: { name: "Onishi", position: "In the present situation there is only one way to channel Japan's meager strength into maximum efficiency: organize suicide attack units of Zero fighters armed with 250-kilogram bombs, each plane to crash-dive into an enemy carrier." },
              attested: { by: "Onishi", text: "organize suicide attack units composed of Zero fighters armed with 250 kilogram bombs, with each plane to crash-dive into enemy carriers", source: "Onishi to the staff of the 201st Air Group, 19 October 1944, as recorded in Inoguchi and Nakajima, The Divine Wind (1958)" },
              historical: true,
              setFlags: { kamikazePath: "approved" },
              impact: { readiness: -1, pipeline: 0, initiative: 2 },
              next: "leyteGulf44",
              outcome:
                "Within days the first organized kamikaze attacks hit escort carriers off Leyte, and the practice spreads from one air fleet to Navy and Army policy for the rest of the war, ending in the massed Kikusui attacks at Okinawa. Onishi kills himself on August 16, 1945, the day after the surrender broadcast.",
            },
            {
              label: "Decline to formalize it: permit individual voluntary acts but refuse to make suicide attack organized policy",
              advisor: { name: "Toyoda", position: "The Navy should not make suicide attacks its doctrine on paper, with a name and a training pipeline, because what individual pilots choose to do in extremity is not what a command chooses to institutionalize." },
              setFlags: { kamikazePath: "declinedFormal", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "leyteGulf44",
              outcome:
                "A modeled alternative that draws a line the real Navy leadership largely did not: individual acts are tolerated, and the practice is not made doctrine. Pilots in desperate circumstances may still choose it, but it has no units, no training and none of the scale that policy gave it, at a cost in conventional strike capability.",
            },
          ],
        };
        },
        get leyteGulf44() {
          return {
          date: "OCTOBER 1944",
          title: "Sho-Go: The Fleet as Decoy",
          historicalRecord: true,
          situation:
            "MacArthur's forces landed at Leyte on October 20. The Combined Fleet's battleships and cruisers have spent most of the war in reserve for lack of fuel and air cover, and have one plan left: Sho-Go. The fleet's last carriers, with barely trained air groups, are to serve as bait to draw the American covering fleet north, while Kurita's battleships slip through San Bernardino Strait to fall on the invasion beaches and transports.\n\nBy any ordinary accounting it is a fleet being spent and not fought. It is the surface navy's last chance to disrupt a landing that most of the staff at Combined Fleet headquarters privately expect to succeed.",
          choices: [
            {
              label: "Execute Sho-Go as planned: the carrier force as decoy, the battleships through San Bernardino Strait",
              advisor: { name: "Kurita", position: "The fleet knows what it is being asked to be, and the commander will take it through the strait regardless." },
              historical: true,
              setFlags: { leytePath: "shoGo" },
              impact: { readiness: -3, pipeline: -2, initiative: 0 },
              next: "kuritaAtLeyte44",
              outcome:
                "The decoy works. Halsey's carriers are drawn north, and Kurita's battleships come through San Bernardino Strait to find only escort carriers and destroyers between his guns and the landing beaches, with the invasion transports still unloading nearby. What he does next is the most argued-over decision of the naval war.",
            },
            {
              label: "Concentrate what remains on Formosa and the home approaches: decline the Leyte gamble, abandon the Philippines",
              advisor: { name: "Toyoda", position: "The fleet can be spent on one throw at Leyte or kept to contest the approaches to the home islands, and it cannot do both." },
              setFlags: { leytePath: "abandonPhilippines", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 2, pipeline: -4, initiative: -1 },
              disabledReason: meters.pipeline <= -5 ? "There isn't fuel left to relocate and sustain a fleet-in-being at Formosa. Whatever's still afloat has to fight now or not at all." : undefined,
              gateCheck: { meter: "pipeline", threshold: -5, label: "Pipeline" },
              next: "surrenderInquiry45",
              outcome:
                "A modeled alternative. Keeping the fleet in being preserves a defensive force, but giving up the Philippines without a naval fight cuts the oil route from the Indies completely, months ahead of the real timetable, and a fleet that survives has no fuel to move.",
            },
          ],
        };
        },
        get kuritaAtLeyte44() {
          return {
          date: "OCTOBER 25, 1944",
          title: "Taffy 3",
          historicalRecord: true,
          situation:
            "Kurita's battleships, Yamato among them, have come through San Bernardino Strait to find a single escort carrier group, Taffy 3, with six small carriers, three destroyers and four destroyer escorts, between his guns and the Leyte beaches. Halsey's fast carriers are far to the north, still chasing the decoy force. Taffy 3's destroyers are charging Kurita's line to buy time, and the transports still unloading at the beachhead have almost nothing to defend them if the line gets past the escort carriers.",
          choices: [
            {
              label: "Withdraw: uncertain reports and fear of a trap outweigh the opportunity in front of this fleet",
              advisor: { name: "Kurita", position: "What lies to the north is not clear, and the commander will not commit the last battleships against an enemy carrier force he cannot see, so the fleet turns back." },
              historical: true,
              setFlags: { kuritaPath: "withdraw" },
              impact: { readiness: 1, pipeline: -1, initiative: -1 },
              next: "iwoJima45",
              outcome:
                "What happened. Kurita, receiving fragmentary and contradictory reports about American carriers to his north and unaware how close Taffy 3 is to the end of its resistance, turns his battleships around and withdraws the way he came. The Japanese surface navy ceases to exist as an offensive force after this battle whatever the decision, but the transports at Leyte survive intact.",
            },
            {
              label: "Finish the attack: break through to the transports and the beachhead while Taffy 3 is still all that stands in the way",
              advisor: { name: "Ugaki", position: "Six escort carriers and a handful of destroyers are not what turns this fleet back after it has fought through the strait, whatever comes north later, and the beach is in front of it now." },
              setFlags: { kuritaPath: "press" },
              impact: { readiness: -2, pipeline: -1, initiative: 3 },
              next: "leyteBeachheadAftermath44",
              outcome:
                "A modeled alternative. Taffy 3's destroyers keep contesting the approach with a ferocity that rattled the Japanese line, but a battleship force of this size, committed and not withdrawn, has the firepower to get through to a beachhead with almost nothing left to defend it.",
            },
          ],
        };
        },
        get leyteBeachheadAftermath44() {
          return {
          date: "OCTOBER 1944",
          title: "The Beachhead's Reach",
          historicalRecord: false,
          situation:
            "Speculative: the real Kurita withdrew. Everything from here is extrapolated from Taffy 3's resistance, the vulnerability of the Leyte beachhead that morning, and uncertainty about how much damage a battleship force could do to an invasion already ashore. The question is whether this is the disaster MacArthur's staff feared or a costly raid the landing survives.",
          choices: [
            {
              label: "Commit fully to bombarding the beachhead and the transport anchorage before American forces can respond",
              advisor: { name: "Ugaki", position: "The fleet has the guns and the range, and carefulness is not what got it through the strait, so it should not spend the opportunity carefully." },
              setFlags: { beachheadPath: "fullBombardment" },
              impact: { readiness: -3, pipeline: -1, initiative: 2 },
              next: "iwoJima45",
              uncertain: [
                {
                  weight: modWeight(35, meters.readiness),
                  title: "The bombardment disrupts the landing",
                  setFlags: { beachheadResult: "disrupted" },
                  impact: { readiness: 1, pipeline: 0, initiative: 2 },
                  outcome:
                    "The rarer outcome. Sustained gunfire against transports and beach stores does real damage before Halsey's returning carriers and Seventh Fleet's remaining ships force Kurita to withdraw. The Leyte landing survives, with supplies burned on the beach and transports sunk at anchor, and the campaign has to rebuild its logistics before it can resume the advance.",
                },
                {
                  weight: (() => { const w = modWeight(35, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The window closes before the damage compounds",
                  setFlags: { beachheadResult: "limited" },
                  impact: { readiness: -1, pipeline: 0, initiative: 0 },
                  outcome:
                    "The likelier outcome. Kurita does more damage than in the real battle, but Taffy 3's continued resistance, air strikes on the line and the return of heavier American ships force a withdrawal before the bombardment becomes a decisive blow. The beachhead holds, badly bruised.",
                },
              ],
              outcome:
                "Speculative, and the most speculative naval branch in the game. Historians of the battle are divided on how much damage Kurita's force could have done to an exposed beachhead, and on how quickly returning American air and surface forces would have made the raid too costly.",
            },
            {
              label: "Conduct a limited strike and withdraw before American carrier air power can fully organize a response",
              advisor: { name: "Kurita", position: "The commander is prepared to have pressed further than caution would argue, but not to lose the whole fleet for a beachhead Japan cannot hold or occupy afterward." },
              setFlags: { beachheadPath: "limitedStrike" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: "iwoJima45",
              outcome:
                "A modeled alternative between the real withdrawal and an all-out bombardment: damage is done in a short window and the line withdraws before American air power organizes against it. It is arguably the most defensible way to press the attack, with a cost imposed and the fleet kept for a day that may not come.",
            },
          ],
        };
        },
        get iwoJima45() {
          return {
          date: "FEBRUARY 1945",
          title: "Iwo Jima: The Doctrine That Abandoned the Beach",
          historicalRecord: true,
          situation:
            "American Marines are landing on eight square miles of volcanic ash whose value is its airfields, close enough to escort B-29s to Tokyo and back. Lieutenant General Kuribayashi has abandoned the beach-defense doctrine that failed on earlier islands: no counterattack at the water's edge, no banzai charge to waste the garrison in an afternoon. Instead, over eleven miles of tunnels cut into volcanic rock, he means to bleed the invasion for as long as possible. Imperial Headquarters has one real decision left: whether the garrison already there is the last reinforcement the island gets, or whether more can still be found.",
          choices: [
            {
              label: "Reinforce and hold as long as the garrison physically can: no evacuation, no withdrawal",
              advisor: { name: "Kuribayashi", position: "Kuribayashi does not expect to leave the island and means to make the Americans pay for it, and he asks for whatever can be sent, all of which he will use." },
              historical: true,
              setFlags: { iwoJimaPath: "hold" },
              impact: { readiness: -3, pipeline: -1, initiative: 1 },
              disabledReason: meters.pipeline <= -3 ? "There's no shipping left to run reinforcements to an island already effectively cut off by American naval and air superiority. Nothing more can physically reach the garrison." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "okinawa45",
              outcome:
                "Of about 21,000 defenders, around 200 are taken prisoner; the rest are killed over five weeks of fighting in tunnels and rock that neither naval bombardment nor flamethrowers fully cleared. The battle costs the Marines their heaviest losses of the war, nearly 7,000 American dead, and produces the best-known photograph of the Pacific War, the flag raising on Suribachi on the fifth day of a battle that has thirty more to run.",
            },
            {
              label: "Decline further reinforcement: treat the island as an expendable delay, redirect any spare strength to Okinawa",
              advisor: { name: "Toyoda", position: "Kuribayashi's plan was always to make the island expensive and not to win it, and sending more men into a battle already understood to be lost spends strength that Okinawa will need more." },
              setFlags: { iwoJimaPath: "conserve" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "okinawa45",
              outcome:
                "A modeled alternative. Kuribayashi's garrison fights much the same battle whatever IGHQ decides, because there was little capacity to reinforce an island already cut off by American naval and air power. The change is small: fewer units are assigned to a fight IGHQ expects to lose, and a slightly larger reserve is left for Okinawa.",
            },
          ],
        };
        },
        get okinawa45() {
          return {
          date: "APRIL – JUNE 1945",
          title: "Okinawa: What's Left to Spend",
          historicalRecord: true,
          situation:
            "The largest amphibious landing of the Pacific War is under way on the last island before the home islands. The Navy's remaining offensive strength is its kamikaze aircraft and the battleship Yamato, with a handful of destroyers, ordered on a sortie in which her loss is assumed. Operation Ten-Go and the mass kamikaze attacks called Kikusui are the last coordinated offensive the Navy can mount. The question is whether to spend all of it here or hold some back for the home islands." +
            (flags.kamikazePath === "declinedFormal"
              ? " The scale of what's being spent here is smaller than history's Kikusui waves. Without a formal doctrine and training pipeline behind it, this fleet has fewer pilots trained toward this specific end than the historical Navy had by this point in the war."
              : "") +
            (flags.iwoJimaPath === "conserve"
              ? " Whatever was held back rather than sent to Kuribayashi's tunnels is part of what's being weighed here now. It wasn't enough to save the island. Whether it's enough to matter here is a different question."
              : ""),
          choices: [
            {
              label: "Commit everything: Yamato's sortie, the full Kikusui kamikaze campaign, against the invasion fleet",
              advisor: { name: "Ugaki", position: "This is the fleet's last mission whether it is spent here or lost at anchor to the next carrier strike, and it should at least cost the Americans something on the way down." },
              historical: true,
              setFlags: { okinawaPath: "commitAll", suspicion: (flags.suspicion || 0) - 1 },
              impact: { readiness: -4, pipeline: -2, initiative: 2 },
              disabledReason: meters.pipeline <= -6 ? "There isn't fuel left for a one-way Yamato sortie, let alone the sustained kamikaze sortie rate Kikusui requires. Whatever's left can defend or it can sail. It can't do both at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -6, label: "Pipeline" },
              next: "theSubmarineCarriersQuestion45",
              outcome:
                "On April 7 American carrier aircraft sink Yamato before she reaches Okinawa, and about 3,000 of her crew die. The ten Kikusui mass attacks over the following three months sink or damage more American ships than any other campaign of the Pacific War, and the Navy's remaining kamikaze pilots are almost all used up. Okinawa is the costliest battle of the war for the U.S. Navy, and it does not change its outcome.",
            },
            {
              label: "Withhold Yamato and conserve remaining kamikaze-capable aircraft for the home islands' own defense instead",
              advisor: { name: "Toyoda", position: "Spending Yamato at Okinawa buys nothing that Yamato at Kyushu would not buy more of, and if the Navy has one more mission it should choose where." },
              setFlags: { okinawaPath: "husband", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 2, pipeline: -1, initiative: -2 },
              next: "theSubmarineCarriersQuestion45",
              outcome:
                "A modeled alternative. The war ministry, already suspicious of restraint, reads it as the hesitation that the real order for Yamato's sortie was meant to rule out. Whether Yamato kept for Kyushu would change Ketsu-Go's arithmetic is uncertain, since a fleet held back this late in the war tends to reach the next decision weaker, not stronger.",
            },
          ],
        };
        },
        get theSubmarineCarriersQuestion45() {
          return {
          date: "JUNE 1945",
          title: "The World's Largest Submarines, Still Waiting for Orders",
          historicalRecord: true,
          situation:
            "I-400 and I-401, the largest submarines built by any navy in the war, carry three Aichi M6A1 Seiran floatplanes each, folding-wing bombers launched by catapult from a hangar in the hull, each with an 1,800-pound bomb. Yamamoto backed the class in 1942 for a target no other Japanese weapon could reach: the lock gates of the Panama Canal, struck from the Caribbean side, cutting the shortest route between the American fleet's two oceans. The order has since shrunk from eighteen hulls to five, and with the American fleet closing on the home islands themselves there is less reason to send the boats all the way to Panama.",
          choices: [
            {
              label: "Launch the original mission: the Panama Canal, struck from the Caribbean side, severing the fleet's shortest route between two oceans",
              advisor: { name: "Ariizumi", position: "The Panama Canal mission is the one the submarines were built for, everything since Yamamoto's death has been an argument for spending them closer to home, and the original order should stand." },
              historical: false,
              setFlags: { submarineCarriersPath: "panama" },
              impact: { readiness: -1, pipeline: -2, initiative: 2 },
              next: "ketsuGo45",
              outcome:
                "Speculative. The Canal Zone's real defenses, fighters on patrol, regular submarine sweeps and a base built on the assumption that someone would try this, were never tested against it. What two submarines and six floatplanes could have done to locks built to survive far more is a question the real war never answered.",
            },
            {
              label: "Redirect toward the closer target: American forces massing at Ulithi Atoll, the same decision the real Imperial Japanese Headquarters made on June 25th, 1945",
              advisor: { name: "Toyoda", position: "The Americans are no longer two oceans away and are at Okinawa, and the Navy's last submarines should strike something they can still reach." },
              historical: true,
              setFlags: { submarineCarriersPath: "ulithi" },
              impact: { readiness: 0, pipeline: -1, initiative: 1 },
              next: "ketsuGo45",
              outcome:
                "What happened. On this date the order to stop preparing for Panama went out, and the boats were redirected against a reported concentration of fifteen carriers at Ulithi, close enough to reach. Delays, including a missed rendezvous between the two boats, push the attack date to August 25. The surrender comes first, and I-400 and I-401 are ordered to destroy their aircraft and give themselves up without flying a sortie.",
            },
          ],
        };
        },
        get ketsuGo45() {
          return {
          date: "1945",
          title: "Ketsu-Go: The Home Islands Question",
          historicalRecord: true,
          situation:
            "The surface navy is gone, the merchant fleet is being strangled by submarines and mines faster than it can be replaced, and American bombers are burning Japan's cities faster than air defense can answer. Ketsu-Go, the plan to defend the home islands with civilian militia and suicide boats, on the assumption that the cost of an invasion can be made politically unbearable for the Americans, is IGHQ's last coherent strategy. The alternative, not formally proposed at this stage but possible to raise, is to use neutral channels to find out what terms a negotiated end might carry." +
            (flags.leytePath === "abandonPhilippines"
              ? " The fleet preserved rather than spent at Leyte has nowhere left to sail. The fuel is gone regardless of how many hulls remain."
              : "") +
            (flags.okinawaPath === "husband"
              ? " Whatever was held back from Okinawa is still, nominally, on the ledger, for whatever that turns out to be worth against an invasion fleet this navy no longer has the fuel or the aircrew to seriously contest."
              : "") +
            (flags.guadalcanalPath === "earlyWithdraw"
              ? " The men pulled back early from Guadalcanal, three years ago now, are among the veteran cadre this militia plan is counting on. Whether that early call bought this moment anything measurable is exactly the kind of arithmetic nobody at IGHQ has time left to run."
              : "") +
            (flags.mainlandPath === "ichiGoOnly"
              ? " The China divisions freed by declining U-Go three years ago are, in some diminished form, still part of what's left to defend these islands with. It isn't much. It's more than the alternative would have left."
              : "") +
            (flags.coralSeaPath === "consolidate"
              ? " The patient, defensive doctrine argued for after Coral Sea never fully gave way to something more aggressive. It ends here, on the beaches of the home islands themselves, which is either its logical conclusion or its final failure, depending on who in this room is asked."
              : "") +
            (flags.australiaLandingPath === "press"
              ? " Three years on, nobody drafting this militia plan has forgotten what a beachhead nobody could supply cost this fleet in tonnage it never got back."
              : ""),
          choices: [
            {
              label: "Commit to Ketsu-Go: mobilize civilian militia, prepare the home islands for invasion",
              advisor: { name: "Anami", position: "The army's slogan that a hundred million die together rather than surrender is not offered lightly, and the minister will not abandon it while the army still stands." },
              historical: true,
              setFlags: { endgamePath: "ketsuGo" },
              impact: { readiness: -4, pipeline: -3, initiative: 2 },
              next: "afterHiroshima45",
              outcome:
                "The militia mobilization goes ahead through the summer of 1945: suicide boats, bamboo spears for civilians with no rifles to issue, and a doctrine aimed at making an invasion too costly and not at winning. The war ministry's hardliners call it the empire's last real chance. Togo's foreign ministry privately calls it a plan with no way out.",
            },
            {
              label: "Open a conditional surrender inquiry through neutral channels",
              advisor: { name: "Togo", position: "Japan can lose the war while there is still a country left to lose it for or after there is not, and Imperial Headquarters should notice that those are different outcomes." },
              setFlags: { endgamePath: "surrenderInquiry", suspicion: (flags.suspicion || 0) + 2 },
              impact: { readiness: 1, pipeline: 1, initiative: -3 },
              next: "moscowMediates45",
              outcome:
                "A modeled alternative, close to the path Togo's foreign ministry pushed and lost to the war ministry's wish to hold out for better terms. In the real war Togo did approach Moscow in the final weeks, asking the still-neutral Soviets to mediate with the Americans, and Stalin left the approach unanswered while he moved forces for his own invasion of Manchuria. An earlier channel, without the shock of the bombs or the Soviet declaration to break the cabinet's deadlock, risks the same fate: the militarists would treat it as defeatism, and no neutral intermediary was sure to carry a serious offer to a United States committed to unconditional surrender.",
            },
            {
              label: "Move preemptively against the peace faction: foreclose any surrender inquiry before it can be raised",
              advisor: { name: "Umezu", position: "Togo will raise the question again as soon as the cabinet looks weak enough to hear it, and the army should decide now that there is no question left to raise." },
              setFlags: { endgamePath: "purgePeaceFaction", suspicion: (flags.suspicion || 0) + 3 },
              impact: { readiness: -3, pipeline: -2, initiative: 3 },
              disabledReason: meters.pipeline <= -8 ? "There isn't fuel or transport left to move loyal units against anyone. Whatever this army wants to do about the peace faction, it no longer has the physical means to act on it." : undefined,
              gateCheck: { meter: "pipeline", threshold: -8, label: "Pipeline" },
              next: "afterHiroshima45",
              outcome:
                "Speculative. Silencing the peace faction does not strengthen Ketsu-Go. It removes the one internal check on the war ministry's most extreme instincts, just before the atomic bombs and the Soviet declaration make that check matter most. In the real war officers with this instinct attempted the Kyujo coup on the night of August 14 against the surrender broadcast, and it failed. Here the peace faction is gone before that night.",
            },
            ...(meters.pipeline <= -7
              ? [
                  {
                    label: "Divert every gallon the pine-root program actually yields to the kamikaze reserve, at the cost of everything else that still burns fuel",
                    advisor: { name: "Toyoda", position: "Two hundred pine roots, properly distilled, keep one aircraft in the air for an hour, which sounds as it sounds, and it is the only fuel the Navy has left to allocate." },
                    setFlags: { endgamePath: "pineRootDiversion" },
                    impact: { readiness: -2, pipeline: 1, initiative: 1 },
                    next: "afterHiroshima45",
                    outcome:
                      "A real, desperate program, not an invented one: by 1945 roughly thirty-seven thousand improvised stills across Japan were distilling pine tree roots, dug up in places by entire classes of schoolchildren, into a raw oil so contaminated that Allied jeeps testing it after the surrender broke down within days. The program's total output across the whole war never exceeded around three thousand barrels of usable aviation fuel, against a prewar Combined Fleet consumption once measured in the hundreds of thousands. Diverting what little of it exists entirely to the kamikaze reserve doesn't change that arithmetic. It only decides, with total clarity for the first time, exactly what the last of it gets spent on.",
                  },
                ]
              : []),
            ...(meters.readiness <= -7
              ? [
                  {
                    label: "Extend the Volunteer Fighting Corps conscription past its own real limits: no exemption for married women, no upper age this desperate",
                    advisor: { name: "Anami", position: "The corps already reaches every man of fifteen and every unmarried woman of seventeen, and there is no honest argument left for where the line was meant to hold." },
                    setFlags: { endgamePath: "totalMobilization" },
                    impact: { readiness: -1, pipeline: 0, initiative: 1 },
                    next: "afterHiroshima45",
                    outcome:
                      "The real Volunteer Fighting Corps, established by an actual June 1945 conscription law, already reached further than most accounts of the war remember: every man from fifteen to sixty, every unmarried woman from seventeen to forty, a pool of some twenty-eight million people, of whom roughly two million were actually under arms by the surrender. The exemptions that remained, married women, the very old, the very young, were never a matter of military logic so much as the last shape the historical war ministry's imagination hadn't yet been forced to abandon. Removing them here doesn't materially change the invasion's outcome. It only removes the last line nobody, historically, ever actually had to cross.",
                  },
                ]
              : []),
            ...(meters.readiness >= 5 && meters.pipeline >= 3
              ? [
                  {
                    label: "Negotiate from what's still intact: open the surrender channel backed by genuine remaining strength, not desperation",
                    advisor: { name: "Togo", position: "Earlier arguments for surrender were lost while the war ministry held nothing it thought worth trading, and this time Japan is not holding nothing." },
                    setFlags: { endgamePath: "negotiatedFromStrength" },
                    impact: { readiness: -2, pipeline: -1, initiative: -1 },
                    next: "termsWorthHaving45",
                    outcome:
                      "A version of Togo's real, historical argument that his actual cabinet colleagues never had the standing to make: not a plea to stop losing, but a negotiation opened while there's still an intact force behind it, fuel in the tanks and formations in the field that the historical August 1945 simply didn't have left to point to. Whether that changes what terms are reachable, or just changes how the war ministry's hardliners choose to hear the same request, is the question the room has to answer next.",
                  },
                ]
              : []),
          ],
        };
        },
        get afterHiroshima45() {
          return {
          date: "AUGUST 6, 1945",
          title: "Hiroshima",
          historicalRecord: true,
          noFlavor: true,
          situation:
            "At 8:15 in the morning a single American bomber destroys Hiroshima with a single weapon, unlike anything used in any war. Early reports reaching Tokyo are fragmentary and contradictory, and some credit an ordinary large raid, but within a day the scale cannot be explained any other way. The Supreme Council for the Direction of the War, the Big Six, has to decide what this changes, if anything. The war ministry's position is that one bomb, however terrible, is not by itself a reason to abandon a defense the empire has spent the summer preparing.",
          choices: [
            {
              label: "Move to surrender now, before a second weapon falls",
              advisor: { name: "Togo", position: "Nobody knows how many of these weapons America has, and finding out by losing a second city is a failure to have a policy, so the council should decide now, while there is still a decision to make." },
              setFlags: { hiroshimaResponsePath: "surrenderNow" },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "END",
              outcome:
                "A modeled alternative, which the real Big Six never seriously considered: even after Hiroshima was confirmed, the war ministry held its position for three more days while a second city waited. Surrender before Nagasaki is what Togo's diplomatic instincts wanted and never had the votes for. Whether one destroyed city could move men who had accepted a hundred million deaths as a price is the question this choice answers by not waiting to find out.",
            },
            {
              label: "Hold the position: one bomb, however terrible, does not by itself void Ketsu-Go's own logic",
              advisor: { name: "Anami", position: "One city, against an invasion the empire means to make impossibly costly, is no reason to abandon a defense built on that cost, because the enemy has found a more efficient way to burn a city than the hundred he has already burned." },
              historical: true,
              setFlags: { hiroshimaResponsePath: "holdPosition" },
              impact: { readiness: -2, pipeline: -1, initiative: 1 },
              next: "afterNagasaki45",
              outcome:
                "What happened. The war ministry's position holds, and the leaders reach no consensus in the days after Hiroshima, still weighing whether one weapon changes the strategic picture Ketsu-Go was built for. Three days pass. A second American bomber is already in the air.",
            },
          ],
        };
        },
        get afterNagasaki45() {
          return {
          date: "AUGUST 9, 1945",
          title: "Nagasaki",
          historicalRecord: true,
          noFlavor: true,
          situation:
            "Early on August 9 the Soviet Union declares war, and Red Army formations move into Manchuria against a Kwantung Army that cannot resist them. Hours later a second bomb destroys Nagasaki. The Big Six meet again and split three to three: three ministers for surrender on the single condition that the Emperor is preserved, three for surrender only with further conditions that Washington has signaled it will not accept. Two atomic bombs and a second front have not produced agreement, and the council's procedures have no way to break the tie.",
          choices: [
            {
              label: "Defer to the Emperor's own direct intervention: let the sacred decision break the deadlock",
              advisor: { name: "Suzuki", position: "The council cannot break its own tie, and the Emperor should be asked to do what six votes could not before a third weapon or a Soviet army makes the question academic." },
              historical: true,
              setFlags: { nagasakiResponsePath: "imperialIntervention" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "sacredDecision45",
              outcome:
                "What actually happened: with the council unable to break its own three-three deadlock, Prime Minister Suzuki takes the unprecedented step of asking the Emperor to decide, in a way the constitutional order was not meant to work. Hirohito's answer, given in the small hours of August 10, is that the war must end.",
            },
            {
              label: "Reject the deadlock-breaking precedent: the council's own split stands, and the war ministry's hardliners hold the line regardless",
              advisor: { name: "Anami", position: "The minister understands what is being asked of the Emperor and why, and says plainly that not every officer in the army will accept a decision reached this way, however lawfully." },
              setFlags: { nagasakiResponsePath: "rejectPrecedent" },
              impact: { readiness: -3, pipeline: -1, initiative: 2 },
              next: "ketsuGoFinalStand45",
              outcome:
                "A modeled alternative. Without the request to the Emperor, the three-three deadlock stands, with no lawful way left to settle it. Anami's warning that not every officer would accept a decision reached by unusual means is tested anyway by the Kyujo incident. Here nobody finds out whether the Emperor's intervention would have held, and the war ministry fractures slowly, without the single clear authority that held the army together long enough to stand down in the real war.",
            },
          ],
        };
        },
        get sacredDecision45() {
          return {
          date: "AUGUST 14 – 15, 1945",
          title: "The Recording",
          historicalRecord: true,
          noFlavor: true,
          situation:
            "The Emperor's decision is made. On the night of August 14 a recording of his surrender broadcast, the first time the Japanese public will hear his voice, is made in secret at the Imperial Household Ministry, to be aired the next day. A group of army officers, who consider surrender a betrayal of everyone who died believing the empire would never yield, moves that night to seize the Imperial Palace, isolate the Emperor and destroy the recording before it can air. The outcome is not settled until nearly dawn.",
          choices: [
            {
              label: "The Imperial Guard holds: the palace garrison does not join the coup, and loyalist officers move to suppress it",
              advisor: { name: "Suzuki", position: "Nobody knows tonight whether the men guarding the palace will fire on other Japanese soldiers to protect a recording, and if they will not, there may be no surrender broadcast left to protect by morning." },
              historical: true,
              setFlags: { coupOutcomePath: "suppressed" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "END",
              outcome:
                "What happened. The plotters never win over Lieutenant General Mori, commander of the Imperial Guard Division, who refuses to join them and is killed. Without his authority the garrison does not move, and the plotters search the palace for a recording they never find. Loyalist officers end the coup before dawn. Anami, the war minister who might have stopped it with a word, kills himself that morning, leaving a note that asks the Emperor's pardon for his great crime. The broadcast airs at noon on August 15, the first time most Japanese hear the Emperor's voice, announcing a surrender he never calls by that name.",
            },
            {
              label: "The coup succeeds long enough to matter: the recording is seized, and the broadcast does not air on schedule",
              advisor: { name: "Anami", position: "The minister did not order the coup, understands why it happened, and is not sure tonight that he will be the man to order it stopped." },
              setFlags: { coupOutcomePath: "succeeded", speculativePath: true },
              impact: { readiness: -2, pipeline: -1, initiative: 2 },
              next: "END",
              outcome:
                "Speculative. The plotters search the Imperial Household Ministry through the night and, here, find the recording. The broadcast does not air on August 15. The Emperor's decision is delayed and not reversed, and Anami, still war minister, commands an army whose younger officers have done something he did not order and will not quite condemn. The record has no answer to what follows.",
            },
          ],
        };
        },
        get ketsuGoFinalStand45() {
          return {
          date: "AUGUST 1945",
          title: "A Deadlock With No One Left to Break It",
          historicalRecord: false,
          noFlavor: true,
          situation:
            "Speculative: in the real war Suzuki asked the Emperor to break this deadlock, and he did. Here the request is never made, and the Big Six's three-three split stands. Two cities are gone. A Soviet army is inside Manchuria and not stopping at the border. The hardliners hold their three votes for surrender with conditions, the peace faction holds its three for surrender on the throne alone, and nobody has the authority, or the willingness, to be the deciding vote.",
          choices: [
            {
              label: "Break ranks: one member of the war ministry's own bloc crosses to end the deadlock without invoking the Emperor at all",
              advisor: { name: "Togo", position: "The foreign minister does not need six votes, only one man on the other side of the deadlock who decides that a third city is worse than losing an argument." },
              setFlags: { deadlockPath: "brokenByDefection" },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "END",
              outcome:
                "Speculative. One minister of the war ministry's bloc crosses to the peace faction under the pressure of a possible third bomb and a Soviet army already past negotiating. The real deadlock was broken another way, and there is no evidence whether a defection like this was more or less plausible than the Emperor's intervention.",
            },
            {
              label: "The deadlock holds: no third path emerges, and Ketsu-Go proceeds toward whatever invasion actually arrives",
              advisor: { name: "Anami", position: "Then nothing has been decided, the minister did not create the deadlock, and he will not manufacture a resolution the council never reached." },
              setFlags: { deadlockPath: "unresolved" },
              impact: { readiness: -3, pipeline: -2, initiative: 1 },
              next: "theDeadlockHolds45",
              outcome:
                "Speculative. A council too evenly split to decide, a defense still nominally in force, and an American invasion that in the real war was never tested because the war ended first. Whether Ketsu-Go's logic, that the cost of invasion could be made politically unbearable, would have held against the planned Operations Olympic and Coronet is a question the real ending spared everyone. This history does not.",
            },
          ],
        };
        },
        get theDeadlockHolds45() {
          return {
          date: "LATE AUGUST 1945",
          title: "What the Deadlock Doesn't Stop",
          historicalRecord: false,
          speculative: true,
          noFlavor: true,
          situation:
            "Speculative: the real deadlock was broken by the Emperor, and here nothing breaks it. Some things continue regardless. A third atomic bomb could be ready for use in the second half of August, according to messages from General Groves to Marshall. The night of August 14–15 saw the largest conventional raid of the war, more than a thousand aircraft, and a council that never decides does not escape it or the raids scheduled after it. The Soviet army in Manchuria is also moving into Korea and southern Sakhalin, whatever Tokyo decides.",
          choices: [
            {
              label: "IGHQ orders no change: the deadlock in the war ministry is a civilian government question, not a military one, and the military keeps executing Ketsu-Go's existing plan without waiting on Tokyo to decide anything",
              advisor: { name: "Umezu", position: "The council's paralysis is its own failure to resolve and not the chief of staff's to solve by exceeding his authority, so the staff goes on preparing the defense it was already preparing." },
              setFlags: { finalDeadlockPath: "militaryProceeds" },
              impact: { readiness: -1, pipeline: -1, initiative: 0 },
              next: "END",
              outcome:
                "Speculative. The government does not collapse. Every part of it goes on doing what it was doing, because nobody with the authority to change it has. The military keeps preparing a defense against an invasion whose date no one in this history knows, and the two blocs of three votes stay where they were. What ends the war, another bomb, an invasion, a defection, is not recorded here.",
            },
            {
              label: "Send the deadlock itself to the Emperor as a formal question, without asking him to break it: state plainly that the council could not decide, and let him choose what, if anything, that information changes",
              advisor: { name: "Kido", position: "There is a difference between asking the Emperor to cast the deciding vote and telling him the vote could not be cast, and the second is the only honest option the council has left." },
              setFlags: { finalDeadlockPath: "informedAnyway" },
              impact: { readiness: 0, pipeline: 0, initiative: -1 },
              next: "END",
              outcome:
                "Speculative. Telling the Emperor that his council could not agree is not the same act as asking him to break the tie, though what he does with the information is not something the council decides or can predict. The record does not say how he would answer, because nobody told him this way.",
            },
          ],
        };
        },
        get termsWorthHaving45() {
          return {
          date: "1945",
          title: "A Negotiation With Something Behind It",
          historicalRecord: false,
          situation:
            "Speculative. Here Japan enters its final surrender talks with real military strength, instead of the exhausted, fuel-starved state the August 1945 cabinet negotiated from. Togo's channel reaches Washington with an offer backed by something real and not only an appeal to end the killing. Whether an intact force changes what the unconditional surrender policy would bend on has no historical answer.",
          choices: [
            {
              label: "Press for the Emperor's institutional preservation as the core, non-negotiable term",
              advisor: { name: "Togo", position: "Every other term can be negotiated down, but the preservation of the throne cannot, and it is the term the war ministry has never wavered on." },
              setFlags: { termsPath: "throne" },
              impact: { readiness: 1, pipeline: 0, initiative: 0 },
              next: "END",
              outcome:
                "The one term the real war ministry held firm on, backed here by real capability instead of exhaustion. Whether that changes how firmly Washington would hold to unconditional surrender is uncertain, and historians differ on how far military strength moves an adversary's declared policy.",
            },
            {
              label: "Press for broader terms: the throne, but also a negotiated timeline for withdrawal rather than immediate occupation",
              advisor: { name: "Umezu", position: "If the army still has something to negotiate with, it should ask for more than the throne, and above all for time, now, while there is still a position to ask from." },
              setFlags: { termsPath: "broader" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: "END",
              outcome:
                "A harder ask than Togo favored, using remaining strength as leverage for more than the real negotiation ever had standing to request. Historians treat a negotiated occupation timeline for an undefeated Japan with skepticism, because American pressure for a swift and total end to the war was strong whatever Japan still had in the field.",
            },
          ],
        };
        },
        get unhinderedSouth42() {
          return {
          date: "EARLY – MID 1942",
          title: "The War America Didn't Wake Up To",
          historicalRecord: false,
          situation:
            "Speculative. The Southern Resource Area falls faster still with every carrier committed to it instead of held back for Hawaii, and the American Pacific Fleet sits intact at Pearl Harbor. Washington faces landings across a string of colonial possessions without the single attack that ended the argument over intervention overnight in the real war. Congress is as divided as it was on December 6. Whether it holds together once Manila and Singapore fall is uncertain, and American politics were never Imperial Headquarters' to decide.",
          choices: [
            {
              label: "Spend every advantage the intact resource area buys: accelerate the Burma and Indies timetable",
              advisor: { name: "Sugiyama", position: "Japan has bought time with something worth more than a strike on Hawaii, an enemy who has not yet decided he is at war, and the time should be spent before he decides." },
              setFlags: { southPath: "accelerate" },
              impact: { readiness: 1, pipeline: 2, initiative: 1 },
              disabledReason: meters.pipeline <= -2 ? "Tanker capacity is already short of what a compressed timetable would need to move the resource area's output home at all. Accelerating further just strands oil at the source." : undefined,
              gateCheck: { meter: "pipeline", threshold: -2, label: "Pipeline" },
              next: "burmaRangoon42",
              outcome:
                "Speculative. The resource area is secured on a timetable that Japan's shipping could not fully absorb: oil and rubber flow faster than tankers exist to carry them home. Whether an America that never had its Pearl Harbor still declares war over Manila, Singapore and the Indies is the question Tokyo can only watch.",
            },
            {
              label: "Hold back: consolidate the resource area's gains and avoid provoking Washington further than the landings already have",
              advisor: { name: "Nagano", position: "Japan has what the war was fought for, and there is no reason to give the Americans another reason to finish deciding what they have not decided yet." },
              setFlags: { southPath: "consolidate", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 2, pipeline: 1, initiative: -1 },
              next: "burmaRangoon42",
              uncertain: [
                {
                  weight: modWeight(45, meters.readiness),
                  title: "Congress stays divided",
                  setFlags: { congressResult: "divided" },
                  impact: { readiness: 1, pipeline: 0, initiative: 0 },
                  outcome:
                    "Speculative. Without a single galvanizing attack Congress stays about as split as it was in December, with isolationists holding real ground. Tokyo has bought something the real war never gave it: time to watch Washington argue with itself.",
                },
                {
                  weight: (() => { const w = modWeight(45, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "Manila and Singapore prove enough on their own",
                  setFlags: { congressResult: "unified" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "Speculative. Manila and Singapore prove enough. A Congress that stayed divided in the absence of Pearl Harbor unites anyway once the scale of the landings is clear, later than the real single morning but arriving at nearly the same place. Not knowing Washington's internal argument costs more than it saved.",
                },
              ],
            },
            {
              label: "Push further still: commit the fleet toward an outright invasion of Australia",
              advisor: { name: "Sugiyama", position: "The Army's planners say there is not the shipping to invade Australia and no version of the war ends with Japan finding it, and the chief of staff recommends against the invasion and does not propose it." },
              setFlags: { southPath: "australiaGamble" },
              impact: { readiness: -4, pipeline: -4, initiative: 2 },
              disabledReason: meters.pipeline <= -1 ? "The Army's own transport-tonnage study already says no at this pipeline level, let alone a lower one. There is no honest path to greenlighting this." : undefined,
              gateCheck: { meter: "pipeline", threshold: -1, label: "Pipeline" },
              next: "australiaLanding42",
              outcome:
                "Speculative. The Army General Staff studied an invasion of Australia in 1942 and rejected it, for the reason that applies everywhere else: the shipping does not exist, and trying anyway strips every other front of tonnage. What the intact resource area bought Tokyo is spent on a plan the Army's planners knew was unreal.",
            },
          ],
        };
        },
        get australiaLanding42() {
          return {
          date: "LATE 1942",
          title: "Darwin: The Beachhead Nobody Could Supply",
          historicalRecord: false,
          situation:
            "Speculative: the Army General Staff rejected an invasion of Australia before it became an operational plan, and what follows is extrapolated from the shipping arithmetic its own staff ran. The invasion fleet, assembled by stripping transport tonnage from Burma, the Solomons and the home-waters reserve, reaches the northern coast near Darwin short of the escort and sealift that the Army's own studies said the operation needed before a soldier boarded a ship.",
          choices: [
            {
              label: "Force the landing regardless: get troops ashore before the fleet's escort thins any further",
              advisor: { name: "Sugiyama", position: "The chief of staff said in the planning room what the landing would cost, and the arithmetic has not changed now that the ships are at sea." },
              setFlags: { australiaLandingPath: "press" },
              impact: { readiness: -3, pipeline: -3, initiative: 1 },
              next: "burmaRangoon42Delayed",
              uncertain: [
                {
                  weight: modWeight(25, meters.pipeline),
                  title: "A beachhead holds, briefly",
                  setFlags: { australiaResult: "beachhead" },
                  impact: { readiness: -1, pipeline: 0, initiative: 1 },
                  outcome:
                    "Speculative. Troops get ashore and hold a strip of coast for several weeks, long enough for Tokyo's propaganda to call it a landing, though the army's logisticians know it is a garrison with no realistic resupply on a continent without the roads or railways to project power inland. It does not hold.",
                },
                {
                  weight: (() => { const w = modWeight(25, meters.pipeline); return Math.max(5, 100 - w); })(),
                  title: "The landing fails before it establishes anything",
                  setFlags: { australiaResult: "disaster" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier outcome, and the one Sugiyama's staff study predicted. The escort is too thin to cover the transports, Allied air power operates from bases the fleet was never strong enough to neutralize first, and the landing fails to establish a defensible position before the ships carrying its supplies are turned back or sunk.",
                },
              ],
            },
            {
              label: "Abort the landing: recall the fleet before the losses compound further",
              advisor: { name: "Yamamoto", position: "The operation did not have the admiral's support in the planning room, and it is failing in exactly the way he was told it would, so it should be abandoned." },
              setFlags: { australiaLandingPath: "abort" },
              impact: { readiness: -1, pipeline: -2, initiative: -1 },
              next: "burmaRangoon42Delayed",
              outcome:
                "Speculative. A recall, not a rout. The fleet turns back before the landing is fully committed, sparing the transports and escort the losses a pressed landing would have added. The tonnage stripped from three other fronts for the attempt is not recovered, and Burma, the Solomons and the home-waters reserve are short of it until it is replaced.",
            },
          ],
        };
        },
        get washingtonDecides42() {
          return {
          date: "LATE 1942",
          title: "Washington's Verdict",
          historicalRecord: false,
          situation:
            "Speculative. Reports through the Swiss and Swedish legations describe a Congress no less divided than before the landings: isolationists still argue that colonial possessions half a world away are not worth American lives, while the fall of Singapore and Manila has strengthened the interventionist case. Nobody at Imperial Headquarters can poll the Senate, and this is a premise and not a forecast. IGHQ must decide what to do while the ambiguity lasts." +
            (flags.southPath === "accelerate"
              ? " The compressed resource-area timetable has bought speed. It hasn't bought certainty about what Washington does next."
              : " The consolidated, unprovocative posture has bought caution. It hasn't bought certainty either.") +
            (flags.ceylonPath === "invade"
              ? " One thing does cut through the ambiguity: a British Empire threatened in the Indian Ocean, its Middle Eastern oil route under real pressure, is a British Empire with every reason to lobby Washington harder for intervention than a Congress still arguing over Pacific colonies alone would otherwise hear. Ambiguity about America's mood was never going to survive contact with a desperate ally asking for help."
              : ""),
          choices: [
            {
              label: "Test a negotiated settlement through neutral channels: offer open trade in the resource area in exchange for recognition of the conquests",
              advisor: { name: "Togo", position: "Japan never fought a war expecting an unconditional victory over the United States, and if there is a table where it stops now on terms that can be lived with, it should be found before someone decides there is none." },
              setFlags: { washingtonPath: "negotiate", suspicion: (flags.suspicion || 0) + 2 },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "americaDecides44",
              outcome:
                "Speculative. The overture reflects a hope in the Foreign Ministry that a fait accompli offered with open trade might be accepted and not fought over. Whether a divided Congress would take it seriously, or read it as proof that Japan feared the war it hoped to avoid, cannot be said: there is no polling for a Senate that never had its Pearl Harbor. Tokyo has tried the quieter door first.",
            },
            {
              label: "Harden the whole resource arc now, on the working assumption that war comes regardless",
              advisor: { name: "Sugiyama", position: "Being wrong about a war that never comes costs less than being right about one for which Japan was not ready, so the resource arc should be fortified while the ambiguity holds, which will not be forever." },
              setFlags: { washingtonPath: "fortify" },
              impact: { readiness: 2, pipeline: -1, initiative: 1 },
              disabledReason: meters.pipeline <= -3 ? "There isn't the construction material and shipping capacity left to fortify an arc this size. Hardening it further isn't available at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "americaDecides44",
              outcome:
                "Speculative. The resource arc, from Burma to the Indies to the mandates, is fortified far more thoroughly than the real 1942 perimeter, with garrisons and coastal defenses built in time and not improvised under attack. Whatever war arrives meets a defense in better order than the real one. The cost is a diplomatic window that is never tested.",
            },
          ],
        };
        },
        get americaDecides44() {
          return {
          date: "1943 – 1944",
          title: "Two Years Without a Pearl Harbor",
          historicalRecord: false,
          situation:
            "Speculative. Two years into a Pacific standoff with no shooting war, IGHQ's intelligence on Washington's intentions is what it was in 1942: educated guessing. Congress has authorized rearmament at a pace that could support entry into the Pacific at any time but has passed no declaration, and American shipping moves around the edges of the resource arc without confrontation. This is speculation about American politics over several years, far less certain than anywhere else in the game.",
          choices: [
            {
              label: "Spend the remaining window preparing for war, betting the standoff won't hold forever",
              advisor: { name: "Nagano", position: "A war this size does not wait forever at the edge of so valuable a resource line, and the remaining certainty should be spent preparing for it and not on pretending the ambiguity will last." },
              setFlags: { americaPath: "prepareForWar" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "aQuietEmpire45",
              outcome:
                "Speculative. A bet that the standoff is a delay and not a resolution. Defenses and stockpiles are built for a war treated as close to inevitable once any trigger forces Washington's hand. Whether the trigger comes is the question the final chapter on this path has to answer.",
            },
            {
              label: "Keep building the resource-area empire as is, betting Congress never fully commits",
              advisor: { name: "Yonai", position: "Every year the standoff holds is a year the minister did not have to be wrong about how it ends, and a war avoided for two years should not be assumed to be coming." },
              setFlags: { americaPath: "isolatedEmpire" },
              impact: { readiness: 2, pipeline: 1, initiative: -2 },
              disabledReason: meters.readiness <= -5 ? "There isn't the institutional confidence left to bet on Congress staying divided at this readiness level. This staff can't sell optimism it doesn't have." : undefined,
              gateCheck: { meter: "readiness", threshold: -5, label: "Readiness" },
              next: "aQuietEmpire45",
              outcome:
                "Speculative. The optimistic bet, and the one with the least evidence behind it: a divided, isolationist Congress that never rearms fully for a Pacific war it was not attacked into. What Japan builds with two peaceful years is the question the final chapter on this path has to answer.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Actively work to keep Congress divided: fund and expand the same kind of American opinion apparatus Tokyo already ran once, rather than just hope the division holds on its own",
                    advisor: { name: "Togo", position: "The ministry once ran a committee in San Francisco aimed at the educated Americans with the standing to move Congress, and a larger version, with two more years and a real ambiguity to work with, should be funded now." },
                    setFlags: { americaPath: "activeInfluence" },
                    impact: { readiness: -1, pipeline: -1, initiative: 2 },
                    next: "aQuietEmpire45",
                    outcome:
                      "The actual Japanese Committee on Trade and Information ran out of the San Francisco consulate from 1937, using distinctly American political language, New Deal, Manifest Destiny, Open Door, to reach the business and academic audiences with real standing to influence Congress. Funding a larger version of the same effort, aimed at a genuine two-year ambiguity instead of a war already underway, is a bet on a documented method, the actual apparatus expanded rather than invented from nothing. Whether propaganda built to sustain uncertainty works as well as propaganda built to defend an already-committed policy is a question the historical committee, shut down and its staff eventually imprisoned once the real war started, never actually had the chance to answer either way.",
                  },
                ]
              : []),
          ],
        };
        },
        get aQuietEmpire45() {
          return {
          date: "1945",
          title: "The War That Waited",
          historicalRecord: false,
          noFlavor: true,
          situation:
            "Speculative. In the real war Japan surrendered in 1945 under two atomic bombs, a firebombing campaign and a Soviet declaration of war. None of that has happened here, because the chain of events that produced it, Pearl Harbor, the carrier war and the island campaigns, never started. Japan has a resource empire several years old that has never been tested by war. Whether the standoff is stable, or a war deferred and not avoided, is what Imperial Headquarters must decide how to treat." +
            (flags.americaPath === "prepareForWar"
              ? " Two years of quiet rearmament are already on the ledger either way, a bet that the standoff was borrowed time rather than a resolution, made before this exact question was ever formally asked."
              : flags.americaPath === "isolatedEmpire"
              ? " Two years of betting Congress would stay divided are already on the ledger either way, a wager this exact question is now asking this government to either double down on or finally reconsider."
              : flags.americaPath === "activeInfluence"
              ? " Two years of an actively funded opinion campaign are already on the ledger either way, a bet that Congress's division could be maintained rather than just hoped for, whose actual effectiveness this exact question is now asking this government to honestly assess."
              : ""),
          choices: [
            {
              label: "Treat the standoff as a genuine, if fragile, peace: stand down from a war footing",
              advisor: { name: "Nagano", position: "Japan has gone longer without this war than most of the staff thought possible in 1941, and that can be called something other than luck." },
              setFlags: { quietEmpirePath: "standDown" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "newWorldOrder45",
              outcome:
                "Speculative. The empire stands down from a war footing and turns to administration and consolidation. What the late 1940s bring is open: an America turning to Europe and the opening Cold War might leave a completed Japanese conquest unaddressed for years, as Manchukuo was in the 1930s, or a Japan holding the Indies' oil and Malaya's rubber without defeat might become an unresolved colonial question that a postwar order built on decolonization has no place for. Both are plausible, and the standoff is not the last question this government has to answer.",
            },
            {
              label: "Treat the standoff as borrowed time: commit to permanent war footing regardless of the peace's apparent stability",
              advisor: { name: "Sugiyama", position: "Borrowed time spent as though it were permanent is how empires lose wars they had years of warning about, so Japan should keep building for the day the quiet ends." },
              setFlags: { quietEmpirePath: "permanentReadiness" },
              impact: { readiness: -1, pipeline: -2, initiative: 1 },
              next: "newWorldOrder45",
              outcome:
                "Speculative. A Japan permanently mobilized against a war that has not arrived, at a cost to the civilian economy that the real Japan never bore for so many years. If the reckoning comes, in 1946 or 1950 or whenever American attention turns back to the Pacific, this is the Japan best placed to meet it. If it never comes, this is the Japan that spent a decade bankrupting itself preparing for a ghost.",
            },
            ...(meters.pipeline >= 6
              ? [
                  {
                    label: "Convert to an armed-neutrality reserve model: low standing costs, a citizen-militia structure built for rapid mobilization rather than permanent readiness or genuine demobilization",
                    advisor: { name: "Sugiyama", position: "The choice is not between spending everything and spending nothing, and Switzerland and Sweden built real deterrence from a militia that costs little to keep and a great deal to fight against, a structure Japan should copy." },
                    setFlags: { quietEmpirePath: "armedNeutrality" },
                    impact: { readiness: -1, pipeline: 2, initiative: -1 },
                    next: "newWorldOrder45",
                    outcome:
                      "The actual Swiss and Swedish Cold War doctrine of armed neutrality rested on a citizen-militia system, low standing costs, genuine mass on rapid recall, that let both countries maintain credible deterrence for a fraction of what a comparable standing army cost to garrison year-round. Switzerland alone could field over four hundred thousand men within days by relying almost entirely on part-time reservists who trained regularly and kept their equipment at home. Converting this resource empire's own posture along the same lines isn't a weaker version of either extreme available here, and it isn't a compromise invented to split the difference between them. It's a different strategic philosophy entirely, betting that latent capability, cheaply maintained, deters as effectively as expensive capability kept constantly ready.",
                  },
                ]
              : []),
          ],
        };
        },
        get newWorldOrder45() {
          return {
          date: "1945 – 1946",
          title: "A Charter With No Chair for This Japan",
          historicalRecord: false,
          situation:
            "Speculative. The United Nations Charter is signed at San Francisco in June 1945 by fifty states, with enemy-state clauses (Articles 53 and 107) that apply to states that were enemies of the Allies in the war. Bretton Woods, a year earlier, built the IMF and World Bank around the same Allied coalition. None of it was drafted with this Japan in mind: a government still formally allied to Germany by treaty and still at war with China, but never at war with the United States, Britain or the other founding powers. Whether that technicality matters to the men drawing up the enemy-state list, nobody in Tokyo can know.",
          choices: [
            {
              label: "Petition for recognition: argue formally that a Japan never at war with the Allied powers doesn't belong on their enemy list",
              advisor: { name: "Togo", position: "Japan has never fired on an American or British soldier, and whether that argument moves men who watched it sign a pact with Germany and fight in China is unknown, but it is the only argument it has." },
              setFlags: { newOrderPath: "petition" },
              impact: { readiness: 0, pipeline: 1, initiative: -2 },
              next: "coldWarOpening48",
              outcome:
                "Speculative. A formal case on a technicality: the enemy-state clauses were written for governments the Allies had defeated, and this one never was. Whether the delegates at San Francisco, still fighting the real war's last months, have any appetite for the distinction is uncertain. In the real war Japan did not join the UN until 1956, after losing a war and signing a peace treaty. This Japan is asking a body built to process defeated enemies to classify it as something else, and there is no precedent for the answer.",
            },
            {
              label: "Decline engagement: treat the new international order as an Allied club with no genuine place for an unconquered Japan",
              advisor: { name: "Sugiyama", position: "Japan should not send a delegation to beg a seat at a table built by men who would rather it did not exist, and should let them write their charter and still be there when it is finished." },
              setFlags: { newOrderPath: "decline" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "coldWarOpening48",
              outcome:
                "Speculative. Japan opts out of the postwar order before the order has to decide whether it wants Japan in it. It has no IMF standing, no World Bank access and no seat at the table the fifty signatories built, and also no enemy-state designation ever tested or confirmed. Whether that is stable or a quieter version of the deferred question the empire has lived with since the war that never started is not resolved by declining to ask.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Work Chile specifically, not the full Charter body: a real signatory whose own war against Japan is barely more genuine than this one",
                    advisor: { name: "Togo", position: "Chile signed the Charter after declaring war on Japan months after the event, for reasons to do with founding membership, and it is better to work one delegate who understands what such a declaration is worth than petition fifty who do not." },
                    setFlags: { newOrderPath: "chileChannel" },
                    impact: { readiness: -1, pipeline: 0, initiative: 2 },
                    next: "coldWarOpening48",
                    outcome:
                      "A real, specific asymmetry, not an invented one: Chile's actual February 1945 declaration of war on Japan came after years of neutrality, driven by the practical need for founding UN membership rather than any genuine hostility, the real historical record's own closest parallel to this Japan's own never-quite-a-war status. Working one delegation that understands the difference between a real war and a procedural one, rather than petitioning a full body of fifty signatories with wildly different actual grievances, is a narrower, more targeted bet. Whether one sympathetic voice inside the room accomplishes more than a formal argument addressed to all of them is exactly the kind of question this specific channel is built to test.",
                  },
                ]
              : []),
          ],
        };
        },
        get coldWarOpening48() {
          return {
          date: "1947 – 1950",
          title: "The Uses of an Unconquered Japan",
          historicalRecord: false,
          situation:
            "Speculative. By 1948 the Cold War is under way here as in the real war, and Washington's China policy is collapsing as Mao's forces close on final victory. In the real war the United States, watching its investment in an occupied Japan become the anchor of its Pacific containment strategy, rewrote its occupation priorities to rebuild Japanese industry as a bulwark against communism. This Japan was never occupied and never needed rebuilding. It has an intact industrial base, a working empire and a Communist government about to take power next door, which is what containment strategy is built to court, if Washington can treat a government it spent years refusing to recognize as something other than an unresolved enemy." +
            (flags.newOrderPath === "petition"
              ? " The petition Togo's ministry filed three years ago is still sitting, formally unanswered, in a filing cabinet in a UN building that has other things on its mind. It may finally be worth revisiting."
              : flags.newOrderPath === "chileChannel"
              ? " The Chilean channel opened three years ago never produced a formal resolution, but it left this government one real relationship inside the Charter system that the flat refusal never did, a delegate who already understood the argument before Washington's own China problem gave that argument new relevance."
              : " Tokyo's government never asked for a seat at the table. It is about to find out whether the table starts asking for it."),
          choices: [
            {
              label: "Open informal channels to Washington: offer the resource area's stability as a Cold War asset, formal recognition or not",
              advisor: { name: "Yoshida", position: "A career in the ministry was not spent to stay outside a door the Americans are now considering opening for their own reasons, and whatever recognition costs, it costs less than staying outside." },
              setFlags: { coldWarPath: "align" },
              impact: { readiness: 1, pipeline: 2, initiative: 0 },
              next: "END",
              outcome:
                "Speculative. A quiet, transactional opening on the logic that rehabilitated the real Japan: an unconquered empire with industrial capacity and a stable anti-communist government is worth more to Washington's containment strategy than the unresolved enemy-state question is worth enforcing. Formal UN membership, if it comes, probably comes this way and not through the petition, because the Cold War made alignment matter more than the legal argument.",
            },
            {
              label: "Hold the line: continue treating recognition as beneath negotiation, whatever Washington's China problem is worth to them",
              advisor: { name: "Kido", position: "The Americans ignored Japan when it cost them nothing, Japan will not be useful to them now that it costs them something, and the empire should stay exactly as unresolved as they left it." },
              setFlags: { coldWarPath: "holdLine" },
              impact: { readiness: -1, pipeline: -1, initiative: 2 },
              next: "END",
              outcome:
                "Speculative. Japan declines an opening that the occupied Japan of the real war had no standing to decline. Pride, or distrust of an opening this transactional, or both, keep the empire as unresolved as it has been since 1945. Whether that holds once Washington's strategy needs Pacific partners, or becomes a stance the government cannot afford, the record cannot say.",
            },
            ...(meters.pipeline >= 6
              ? [
                  {
                    label: "Get ahead of it: propose a formal economic and security partnership matching what Washington's own internal policy is already discussing, rather than wait for an informal channel to slowly become one",
                    advisor: { name: "Yoshida", position: "Washington's security establishment issued a formal policy directive in October 1948 describing this kind of relationship with an occupied, war-damaged partner, Japan is neither, and it should answer their paper with a proposal of equal weight instead of waiting for an informal signal." },
                    setFlags: { coldWarPath: "formalProposal" },
                    impact: { readiness: -2, pipeline: -3, initiative: 2 },
                    next: "END",
                    outcome:
                      "NSC 13/2, issued October 7, 1948, formally directed American strategy to prioritize a war-damaged Japan's economic stabilization and internal security as a bulwark against communism, the actual paper trail behind the historical reverse course. Proposing a matching formal framework here, for an empire with an intact industrial base that document's own authors never had to plan around, is a considerably bolder opening bid than an informal channel content to develop slowly. Whether Washington's own containment strategists find an unoccupied, unconquered Japan proposing its own terms more useful than a defeated one accepting them, or simply harder to trust, is the real question this proposal puts directly in front of them rather than letting it develop at its own pace.",
                  },
                ]
              : []),
          ],
        };
        },
        get perimeterDoctrine42() {
          return {
          date: "MID 1942",
          title: "The Fortress That Held Longer",
          historicalRecord: false,
          situation:
            "Declining to press toward a decisive fleet battle after Coral Sea leaves the carrier force intact and the Southern Operation's gains consolidated into a genuine defensive ring: Rabaul, the Indies, Malaya, held rather than extended. There is no Midway on this path; the four fleet carriers that historically burned in a single June morning remain, for now, afloat. What this buys against an American war machine already converting to a wartime production footing is the open question." +
            (flags.coralSeaPerimeterBet === "patient"
              ? " Inoue's own bet on American patience running out first held up through the spring. Whether that holds for another season, with the carrier force this decision is about to spend, is a different question."
              : flags.coralSeaPerimeterBet === "impatient"
              ? " Inoue's own bet on American patience running out first already didn't hold this spring. Whatever gets decided here is being decided with that specific failure already on the record, not in the abstract."
              : ""),
          choices: [
            {
              label: "Use the preserved carrier strength to contest the Solomons before America can build up Guadalcanal",
              advisor: { name: "Yamamoto", position: "A fleet in being is worth something, and a fleet used to hold the perimeter before the Americans finish their airfield is worth considerably more." },
              setFlags: { perimeterPath: "contest" },
              impact: { readiness: -1, pipeline: -1, initiative: 2 },
              next: "yamamotoDeath43",
              uncertain: [
                {
                  weight: modWeight(40, meters.initiative),
                  title: "The early move denies Henderson Field entirely",
                  setFlags: { perimeterResult: "denied" },
                  impact: { readiness: 1, pipeline: 0, initiative: 1 },
                  outcome:
                    "Speculative. Four intact carriers committed before the Americans finish their airfield can contest the landing directly, which the real campaign, fought after Midway's losses, never had the strength to do. Henderson Field never becomes the base that wore down Japan's naval air arm over six months.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.initiative); return Math.max(5, 100 - w); })(),
                  title: "The Americans dig in regardless",
                  setFlags: { perimeterResult: "tooLate" },
                  impact: { readiness: -1, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier outcome: an early landing is contestable, but the airfield itself, once construction starts, is defensible even against an intact carrier force offshore. The fleet spends its early advantage without actually preventing what it was sent to prevent.",
                },
              ],
              outcome:
                "A pre-emptive move into the Solomons with the fleet carrier force still intact. Whether four carriers committed early enough could have denied Henderson Field's construction entirely is a real, open strategic question: what's not in doubt is that this path never pays Midway's price, for better or worse, and the war's later chapters unfold from a materially different starting position than the one history actually reached.",
            },
            {
              label: "Hold the fleet in reserve: let the perimeter's static defenses absorb the first American attacks",
              advisor: { name: "Inoue", position: "The enemy should break himself on Rabaul's air garrison first, and the fleet should be spent when spending it decides something." },
              setFlags: { perimeterPath: "reserve", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 2, pipeline: 0, initiative: -2 },
              next: "yamamotoDeath43",
              outcome:
                "The fleet stays intact and the perimeter's garrisons absorb the opening American attacks alone, a patient strategy that trades early initiative for a preserved carrier force whose eventual use is still an open question. That question doesn't get answered here; it gets carried forward into 1944, when the mainland front's own crisis arrives regardless of what the Navy decided to do with its fleet.",
            },
          ],
        };
        },
        get severSupplyLine42() {
          return {
          date: "MID 1942",
          title: "The Road Not Cut at Midway",
          historicalRecord: false,
          situation:
            "The carrier force that historically burned at Midway sails instead against Fiji and Samoa, degrading the sea lanes between the United States and Australia rather than seeking the decisive battle Yamamoto wanted. American codebreakers, who had Midway's location read weeks in advance, have no ambush to spring against a fleet that never arrives at the coordinates they were watching. Four fleet carriers and their trained air crews, the war's least replaceable asset, remain intact, for now, on a path history never took.",
          choices: [
            {
              label: "Press the supply-line campaign further: extend operations toward the New Hebrides and threaten the Australia route directly",
              advisor: { name: "Ugaki", position: "Japan has already done what Midway was meant to make possible, degraded the road to Australia, and should finish the job while the Americans are reorganizing around an ambush that never happened." },
              setFlags: { supplyLinePath: "extend" },
              impact: { readiness: -1, pipeline: 2, initiative: 1 },
              disabledReason: meters.readiness <= -3 ? "There isn't the strike capacity left to extend this campaign further. The carrier force that survived Midway can defend what it's already taken, not push past it." : undefined,
              gateCheck: { meter: "readiness", threshold: -3, label: "Readiness" },
              next: "operationFsCulmination42",
              outcome:
                "An extended campaign against the Australia route, fought with a carrier force history never had intact this late. MacArthur's Southwest Pacific buildup is running behind whatever schedule the war kept, and Combined Fleet staff are already looking at the map for what an intact carrier force could still finish.",
            },
            {
              label: "Withdraw the fleet to consolidate: bank the preserved carriers rather than press further into contested waters",
              advisor: { name: "Nagumo", position: "Japan has four carriers that were meant to be at the bottom of the Pacific by now, and they should be kept that way a little longer before luck is tested a second time." },
              setFlags: { supplyLinePath: "bank" },
              impact: { readiness: 2, pipeline: 0, initiative: -1 },
              next: "operationFsCulmination42",
              outcome:
                "The fleet withdraws intact, banking four fleet carriers and their air crews against whatever comes next, an asset history's Japan never had past June 1942. Whether that asset gets spent finishing the job in the South Pacific or held back is a question Combined Fleet staff take up next, not one this withdrawal settles by itself.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Escalate the submarine campaign against Australia itself, past what the historical raids ever sustained: coastal shipping, port cities, and the shock of it kept up rather than left as isolated incidents",
                    advisor: { name: "Yamamoto", position: "Japan's submarines hit Sydney Harbor, shelled Newcastle and sank ships off the coast for a few months and then let it fade into what the Australians call nuisance attacks, and the same campaign sustained would be something more." },
                    setFlags: { supplyLinePath: "terrorCampaign" },
                    impact: { readiness: -2, pipeline: -1, initiative: 2 },
                    next: "operationFsCulmination42",
                    outcome:
                      "A real campaign, escalated past its actual historical scale rather than invented from nothing: Japanese submarines raided Sydney Harbor in a midget-submarine attack that killed twenty-one sailors, shelled Newcastle and Sydney's own suburbs, and sank Allied shipping off the Australian coast through mid-1942, a run of attacks serious enough to force convoying but ultimately limited enough that Australian histories call the whole effort a nuisance campaign, not a real interdiction. Sustaining it instead of letting it trail off after a few months, as the historical Sixth Fleet did, tests whether the actual constraint was ever really about capability or simply about a command that stopped pressing an advantage it never fully committed to in the first place.",
                  },
                ]
              : []),
          ],
        };
        },
        get operationFsCulmination42() {
          return {
          date: "LATE 1942",
          title: "Finishing What FS Started",
          historicalRecord: false,
          situation:
            "Operation FS, the actual, historical plan to seize Fiji, New Caledonia, and Samoa and cut Australia off from American resupply entirely, was shelved in the real war after Coral Sea's carrier losses made it unaffordable. On this path, the carriers Coral Sea would have bled are the ones Midway never got to burn either; the plan that history couldn't fund still sits on Combined Fleet's table. Reconnaissance is also reporting more American reinforcement convoys threading the South Pacific than the timetable expected, which is either a reason to finish the job before the window closes or a reason to believe the window is closing already." +
            (flags.supplyLinePath === "extend"
              ? " The fleet is already committed to an aggressive posture in these waters, having pressed the supply-line campaign toward the New Hebrides rather than withdraw when the chance came. Launching FS now is less a new decision than a continuation of one already made."
              : flags.supplyLinePath === "bank"
              ? " The fleet withdrew to consolidate rather than press further into contested waters the last time this exact question came up. Whatever argument favors FS now has to overcome a more cautious posture than the one already chosen once."
              : flags.supplyLinePath === "terrorCampaign"
              ? " The submarine campaign against Australia's own coast is still running, sustained rather than left to trail off, and FS would mean this command committing to two simultaneous pressure campaigns against the same strategic goal, cutting Australia off, rather than choosing between them."
              : ""),
          choices: [
            {
              label: "Launch the full invasion: take Fiji and New Caledonia, sever Australia's supply route completely",
              advisor: { name: "Ugaki", position: "Coral Sea could not afford this and Japan can, and the one prize the war was fought over should not be left on the table because history's navy could not reach it." },
              setFlags: { fsPath: "invade" },
              impact: { readiness: -3, pipeline: -1, initiative: 2 },
              disabledReason: meters.pipeline <= -2 ? "The supply chain doesn't have the tonnage left to sustain an amphibious invasion this far south. An already-stretched arc can't stretch further." : undefined,
              gateCheck: { meter: "pipeline", threshold: -2, label: "Pipeline" },
              next: "yamamotoDeath43",
              outcome:
                "Speculative. Fiji and New Caledonia are taken, and Australia's American lifeline is cut at the root. It is the biggest prize on this path, and the point where Japan's supply chain, stretched across an arc no logistics plan was built to sustain, begins to show the strain that led to the cancellation of Operation FS in the real war. The mainland front is about to make its own demands on the same shrinking reserve of divisions.",
            },
            {
              label: "Stop short: consolidate the raiding gains already won rather than risk the overextension Coral Sea's cancellation was meant to prevent",
              advisor: { name: "Nagano", position: "Coral Sea taught the Navy General Staff the cost of reaching past what the supply chain can carry, and the survival of the carriers is no reason to unlearn it." },
              setFlags: { fsPath: "consolidate", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 1, initiative: -1 },
              next: "yamamotoDeath43",
              outcome: meters.pipeline <= -4
                ? "Not even an orderly stop, at this pipeline level, so much as the campaign simply stopping under its own exhaustion: the raiding effort halts because there's no longer the shipping to sustain it further, not by a controlled choice to hold what's already won. The Australia route degraded but not severed, the fleet preserved mostly by having nothing left to spend rather than by careful restraint."
                : "Speculative. The raiding stops at what it has won: the Australia route degraded and not severed, the fleet intact, and the overextension that killed Operation FS in the real war avoided by choice. Whether Australia's supply recovers once the pressure eases is not for this fleet to settle, because Imperial Headquarters has a mainland front demanding the same shrinking reserve of divisions.",
            },
          ],
        };
        },
        get earlyPerimeter43() {
          return {
          date: "1943",
          title: "The Line Held at Bougainville",
          historicalRecord: false,
          situation:
            "Conceding Guadalcanal early spared the destroyer force and remaining naval air crews the historical campaign's six-month bleed, but it also hands American planners a forward airfield months ahead of schedule. The perimeter now runs through Bougainville and Rabaul, a shorter, more defensible line, held by a Combined Fleet with more of its veteran pilots still alive than the historical record can claim at this point in the war.",
          choices: [
            {
              label: "Use the preserved pilot cadre to rebuild carrier air groups for a future fleet action",
              advisor: { name: "Ozawa", position: "The pilots not lost in the Solomons are the ones the next generation can be trained on, and that pipeline is the only asset the Navy has that compounds." },
              setFlags: { earlyPerimeterPath: "rebuild" },
              impact: { readiness: 2, pipeline: -1, initiative: -1 },
              next: "yamamotoDeath43",
              outcome:
                "Speculative. Japan's carrier air groups never recovered from the attrition of the Solomons, and a veteran cadre that trains replacements a year earlier is a different foundation for the next fleet action. A mainland crisis is coming regardless of how the Solomons went, and it will test it.",
            },
            {
              label: "Reinforce Bougainville and Rabaul's static defenses: dig the perimeter in rather than rebuild for offense",
              advisor: { name: "Kusaka", position: "A pilot cadre saved for a future battle has to survive until that battle comes, and the time bought is better spent making the line unbreakable." },
              setFlags: { earlyPerimeterPath: "fortify" },
              impact: { readiness: 1, pipeline: -2, initiative: -2 },
              disabledReason: meters.pipeline <= -4 ? "There isn't construction material and shipping left to harden this perimeter further. It holds what it already has, nothing more." : undefined,
              gateCheck: { meter: "pipeline", threshold: -4, label: "Pipeline" },
              next: "yamamotoDeath43",
              outcome:
                "Speculative. The perimeter becomes a hard line to crack, on ground chosen without first bleeding the destroyer force dry over Guadalcanal. Whether it slows the island-hopping campaign that bypassed and starved Rabaul in the real war is open. The mainland front's crisis in 1944 arrives regardless.",
            },
          ],
        };
        },
        get moscowMediates45() {
          return {
          date: "1945",
          title: "Moscow's Price",
          historicalRecord: false,
          situation:
            "Speculative. The approach to Moscow goes out earlier than in the real war, while the Soviet Union is still bound by the Neutrality Pact signed in April 1941. Tokyo does not know that Stalin promised Roosevelt at Yalta in February 1945 that the Soviet Union would enter the war about three months after Germany's surrender, in return for territory in Manchuria and the Kurils. Whether an earlier approach could change a decision made in a room Tokyo was never in is the question behind the whole channel.",
          choices: [
            {
              label: "Press the channel formally: request that Moscow mediate terms with Washington",
              advisor: { name: "Togo", position: "What promises have been made in rooms the ministry was not invited into cannot be said, but asking Moscow to mediate is the only version of the argument available, and it is better to ask early than not at all." },
              setFlags: { moscowPath: "pressed" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "END",
              uncertain: [
                {
                  weight: modWeight(15, meters.initiative),
                  title: "Moscow's neutrality holds",
                  setFlags: { moscowResult: "neutralityHolds" },
                  impact: { readiness: 1, pipeline: 1, initiative: 0 },
                  outcome:
                    "Speculative, and the rarest outcome. For reasons no account can reconstruct, Stalin's commitment at Yalta does not hold, and the Soviet declaration of war never comes. Japan fights on against the Western Allies alone, without the two-front shock that broke the war ministry's last argument. Whether that changes how the war ends, or only removes one of two shocks that arrived in the same week, has no historical answer.",
                },
                {
                  weight: (() => { const w = modWeight(15, meters.initiative); return Math.max(5, 100 - w); })(),
                  title: "The declaration arrives regardless",
                  setFlags: { moscowResult: "declarationArrives" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome. Whatever the channel achieves, it does not touch the commitment Stalin made to Roosevelt, for reasons of his own. The declaration of war comes within days of when it did, with the redeployment from Europe already well under way before the approach reaches Moscow.",
                },
              ],
              outcome:
                "Speculative. A formal request on the channel Togo's ministry used in the war's final weeks, opened earlier in the hope that more lead time changes Moscow's answer. Stalin's commitment to Roosevelt at Yalta had nothing to do with how earnestly Tokyo asked, and historians are skeptical that an earlier request could have changed a decision made elsewhere.",
            },
            {
              label: "Offer territorial concessions directly: propose ceding the southern Kurils in exchange for continued neutrality",
              advisor: { name: "Sato", position: "The ambassador has served in Moscow long enough to know the government does not trade in gestures, and if neutrality is for sale he would rather know the price than guess at Soviet intentions from cables." },
              setFlags: { moscowPath: "concessions", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: -1, pipeline: 0, initiative: -1 },
              next: "END",
              outcome:
                "Speculative. A direct territorial offer, on the record that Ambassador Naotake Sato's cables from Moscow complained of an unreadable Soviet position. It cannot overcome timing: the Kurils and southern Sakhalin were already promised to Stalin at Yalta, through the Allied coalition and not through any deal Tokyo could offer. Japan is trying to buy with territory a concession the other side has already been promised free.",
            },
          ],
        };
        },
        get surrenderInquiry45() {
          return {
          date: "1945",
          title: "A Fleet Preserved, A War Still Lost",
          historicalRecord: false,
          situation:
            "Abandoning the Philippines rather than spending the fleet at Leyte preserved the Combined Fleet's remaining hulls, and cost the oil route from the Indies months ahead of the historical timetable regardless. A fleet with no fuel and nowhere worth going is not, in any practical sense, a navy. The question Ketsu-Go's advocates and the diplomatic faction are both circling is the same one the historical record eventually reached anyway: how does this war end." +
            (flags.hokushinPath === "south"
              ? " Nagano argued back in 1941 that this navy's whole case was resources, not territory for its own sake. A fleet preserved but stranded is close to the exact failure mode his own argument against Kantokuen was built to avoid, and if he's still in the room for this conversation, he knows it."
              : "") +
            (flags.doolittleAirmenPath === "pow"
              ? " Whatever war crimes accounting eventually comes, this command's decision to hold the captured Doolittle airmen as conventional prisoners rather than execute them on a thin tribunal finding is at least one count that can be stated honestly."
              : ""),
          choices: [
            {
              label: "Commit the preserved fleet to a final defense of the home waters",
              advisor: { name: "Toyoda", position: "The fleet was kept alive for a reason, and that reason is now." },
              setFlags: { finalPath: "lastStand" },
              impact: { readiness: -3, pipeline: -1, initiative: 1 },
              disabledReason: meters.pipeline <= -4 ? "There isn't fuel left for even a single final sortie. Whatever this fleet was preserved for, it can't reach the fight at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -4, label: "Pipeline" },
              next: "END",
              outcome:
                "Speculative. The preserved fleet, with too little fuel for extended operations, makes its last stand in home waters instead of the Philippines. It ends where the real war ended: a Japan with no navy left and a decision about surrender still to make.",
            },
            {
              label: "Push the diplomatic channel harder, using the preserved fleet as leverage rather than a weapon",
              advisor: { name: "Togo", position: "A fleet spent buys nothing at a negotiating table, while a fleet that could still fight and does not is the only leverage the ministry has left." },
              setFlags: { finalPath: "leverage", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "END",
              outcome:
                "Speculative. The diplomatic faction has a stronger hand than in the real war: an intact fleet to bargain with instead of a wreck to explain. American terms were probably not a function of Japanese naval strength by this point, so Washington's insistence on unconditional surrender likely stands. What changes is the argument inside Japan, where the militarists have one less excuse to insist the fight is not over.",
            },
          ],
        };
        },
      };
      return nodes[id];
    },
    positionLabel(flags, meters) {
      if (flags.purged) return "Deposed by Their Own Hardliners";
      // These five checks come first because hiroshimaResponsePath/coupOutcomePath/
      // deadlockPath represent the deepest, most specific terminal state reachable
      // through the ketsuGo45 endgame thread — four different endgamePath choices
      // (ketsuGo, purgePeaceFaction, pineRootDiversion, totalMobilization) all funnel
      // into the same handful of possible final resolutions, and the title should
      // reflect how the war actually ended, not just which strategic choice was made
      // on the way there. The epilogue() function already narrates all five of these
      // distinctly (see atomicChainOutcome below); positionLabel previously didn't,
      // so every one of these five genuinely different endings — including the one
      // that matches the real historical outcome — fell through to the generic
      // "A Different Command" title, indistinguishable from an unfinished run.
      if (flags.hiroshimaResponsePath === "surrenderNow") return "The War That Ended at Hiroshima Alone";
      if (flags.nagasakiResponsePath === "imperialIntervention" && flags.coupOutcomePath === "suppressed") return "The Broadcast That Almost Wasn't";
      if (flags.nagasakiResponsePath === "imperialIntervention" && flags.coupOutcomePath === "succeeded") return "The Recording That Never Aired";
      if (flags.deadlockPath === "brokenByDefection") return "One Vote, Not Six";
      if (flags.deadlockPath === "unresolved") return "A Council That Never Decided";
      if (flags.peaceShapePath === "phasedWithdrawal") return "A Smaller War, Ended Whole";
      if (flags.peaceShapeResult === "held") return "The War That Ended in 1942, On Japan's Terms";
      if (flags.peaceShapeResult === "collapsed") return "The Peace That Asked for Too Much";
      if (flags.strongerHandResult === "exploited") return "Strength Read as Weakness";
      if (flags.termsPath === "throne") return "The One Term That Held";
      if (flags.termsPath === "broader") return "Terms Worth Having";
      if (flags.beachheadPath === "fullBombardment") return "The Beach Kurita Reached";
      if (flags.beachheadPath === "limitedStrike") return "A Raid, Not a Rout";
      if (flags.earlyPeaceFinalPath === "askedEarly") return "The Question Asked Three Years Early";
      if (flags.earlyPeaceFinalPath === "resumed") return "The Channel That Closed Itself";
      if (flags.kantokuenFinalPath === "heldGround") return "Held to the Last Man, Lost to the Ledger";
      if (flags.kantokuenFinalPath === "wrongGamble") return "The Lesson Nomonhan Taught Twice";
      if (flags.rommelPath === "pressAnyway") return "A Coordination That Arrived Too Late";
      if (flags.rommelPath === "recall") return "The Fleet That Turned for Home";
      if (flags.pacificWonPath === "harden") return "The Gift Yamamoto Asked For";
      if (flags.quietEmpirePath === "standDown" && flags.coldWarPath === "align") return "A Quiet Empire, Quietly Courted";
      if (flags.quietEmpirePath === "standDown" && flags.coldWarPath === "holdLine") return "The War That Waited, Still Waiting";
      if (flags.quietEmpirePath === "standDown" && flags.coldWarPath === "formalProposal") return "An Unoccupied Japan Names Its Own Price";
      if (flags.quietEmpirePath === "permanentReadiness" && flags.coldWarPath === "align") return "Armed for a War That Became an Alliance";
      if (flags.quietEmpirePath === "permanentReadiness" && flags.coldWarPath === "holdLine") return "Armed Against a Ghost";
      if (flags.quietEmpirePath === "permanentReadiness" && flags.coldWarPath === "formalProposal") return "Two Decades of Readiness, Finally Spent on Paper";
      if (flags.quietEmpirePath === "armedNeutrality" && flags.coldWarPath === "align") return "A Militia Empire, Courted Anyway";
      if (flags.quietEmpirePath === "armedNeutrality" && flags.coldWarPath === "holdLine") return "Cheap Deterrence, Held on Principle";
      if (flags.quietEmpirePath === "armedNeutrality" && flags.coldWarPath === "formalProposal") return "The Swiss Model, Offered as Leverage";
      if (flags.quietEmpirePath === "permanentReadiness") return "Armed Against a Ghost";
      if (flags.moscowResult === "neutralityHolds") return "The War Moscow Sat Out";
      if (flags.moscowPath === "concessions") return "A Price Already Paid to Someone Else";
      if (flags.endgamePath === "surrenderInquiry") return "The Peace Nobody Was Ready For";
      if (flags.finalPath === "lastStand") return "The Fleet's Last Sortie";
      if (flags.finalPath === "leverage") return "A Navy Held Hostage to Its Own Survival";
      if (flags.longWarPath === "terms") return "Peace Bought With What Remained";
      return "A Different Command";
    },
    epilogue(flags, meters) {
      const opening = flags.openingVector === "southBlitz"
        ? "A war that never had its Pearl Harbor, "
        : "A war that opened at Pearl Harbor, ";
      if (flags.peaceShapePath === "phasedWithdrawal") {
        return "The settlement lands on the same resource logic the Navy argued for since before this war started: the Indies retained under a negotiated arrangement, the Philippines and Malaya reverting on a phased timeline. Not the war Japan set out in 1941 to win, but a war that ended in 1942 instead of 1945, nearly three years before the actual war's eventual close. Most of the real total, more than 2.3 million Japanese military dead and over a million civilian deaths across the full 1937–1945 war, was still ahead of this point in the historical timeline, not behind it: this ending doesn't get to claim a specific number spared, only that the years the historical toll was mostly still accumulating in never happened here.";
      }
      if (flags.peaceShapeResult === "held") {
        return "The harder ask pays off: a broader Japanese sphere held through the final rounds of a negotiation Washington had every reason to walk away from and chose not to. A rarer outcome within an already rare ending, a war that ended in 1942 instead of 1945, nearly three years early. Most of the real total, more than 2.3 million Japanese military dead and over a million civilian deaths across the full 1937–1945 war, was still ahead of this point in the historical timeline: a number this ending can't honestly claim credit for avoiding precisely, only for the years it was mostly still being accumulated in never happening here.";
      }
      if (flags.peaceShapeResult === "collapsed") {
        return "The negotiation that came closer to ending this war in 1942 than the historical record ever managed collapses anyway, asking for more than an American administration under no obligation to keep testing an increasingly ambitious offer was willing to grant. The channel goes quiet, and the war Yonai's entire argument was built to end continues on a timetable this attempt never managed to shorten, a rare opportunity reached and then lost to its own reach.";
      }
      if (flags.strongerHandResult === "exploited") {
        return "A strong negotiating position, offered in good faith and backed by real material strength rather than desperation, read by Washington as an opening to press harder rather than an offer worth meeting halfway. The China concession is spent for nothing, and the war continues on a timetable this government's own genuine strength was never enough to shorten.";
      }
      if (flags.strongerHandPath === "holdLine") {
        return "A negotiating position built on genuine strength, offered without spending China as a further concession, betting that a well-managed war effort is leverage enough on its own. Whether that calculation would have held against an American administration with every reason to test how firm the line really was is worth raising honestly, without pretending to an answer no one actually has. Whether the line holds and this is where the war actually ends, or breaks and the war proceeds toward its historical shape regardless, several more years of exactly the fighting this offer was meant to avoid, is left open rather than resolved either way.";
      }
      if (flags.termsPath === "throne") {
        return "The one term the historical war ministry held firm on, the Emperor's institutional survival, holds here too, backed by a stronger hand than history ever had to play it with. Whether real strength moved unconditional surrender doctrine any further than exhaustion alone would have was never put to the test. What isn't tested either is whether securing this one term actually ends the war here, or simply becomes one more position in a negotiation that still runs its historical course regardless, several more years of war neither side has actually avoided yet.";
      }
      if (flags.termsPath === "broader") {
        return "This ministry asks for more than the historical negotiation ever had standing to request, the throne, and a negotiated withdrawal timeline besides, using real strength as leverage the real war ministry never possessed. Whether Washington's own pressure for a swift, total end to the war would ever have bent that far is exactly the kind of claim that doesn't survive close scrutiny. Whether asking for more here means getting less, a rejected offer and a war that proceeds toward its historical length regardless, is the real risk this broader ask runs and doesn't get to resolve.";
      }
      if (flags.beachheadPath === "fullBombardment") {
        return "The beachhead his battleships reached paid for the historical retreat's absence in burned supplies and sunk transports." +
          (flags.beachheadResult === "disrupted"
            ? " The bombardment disrupts the landing before returning American forces finally drive the battle line off, real damage compounding past what a single pass could have done."
            : flags.beachheadResult === "limited"
            ? " The damage is real but doesn't fully compound before Taffy 3's resistance and returning air power force the withdrawal, a beachhead badly bruised rather than broken."
            : "") +
          " MacArthur's liberation of the Philippines survives, wounded in a way the historical campaign never had to absorb, forced to rebuild its own logistics before resuming an advance the real timetable never had to interrupt. The most speculative naval counterfactual here, honestly labeled as one: serious historians remain divided on how much damage was actually achievable here.";
      }
      if (flags.beachheadPath === "limitedStrike") {
        return "A compressed strike, then a withdrawal before American air power could fully organize against the battle line. Less dramatic than either the historical full retreat or an all-in bombardment, and arguably the most tactically defensible version of pressing the attack at all: real cost imposed on Leyte's landing, the fleet preserved to fight another day it may or may not get.";
      }
      if (flags.earlyPeaceFinalPath === "askedEarly") {
        return "After the historical Midway disaster, IGHQ pressed for a negotiated exit in 1942 rather than waiting three more years to ask the question the war ministry never entertained. The channel went nowhere. The question was asked anyway, years before history's version of the same government finally asked it.";
      }
      if (flags.earlyPeaceFinalPath === "resumed") {
        return "After the historical Midway disaster, a 1942 peace channel was opened and closed before it left the building, and the war resumed on its historical footing regardless. What it cost was a summer spent on a question this government was never built to ask.";
      }
      if (flags.kantokuenFinalPath === "heldGround" || flags.kantokuenFinalPath === "wrongGamble") {
        const siberia = flags.siberianPath === "holdGains"
          ? "held the Siberian gains through a hard winter rather than withdraw,"
          : flags.siberianPath === "pressWest"
          ? "pushed west chasing a German link-up several thousand kilometers of terrain never let it reach,"
          : "withdrew from Siberia once the winter made the gamble's cost clear,";
        const south = flags.delayedSouthPath === "rushed"
          ? "raced the delayed Southern Operation against a two-year fuel deficit,"
          : "ran that delayed operation deliberately, spending time it couldn't fully spare,";
        const fuel = flags.fuelLedgerPath === "fleet"
          ? "starving the Kwantung Army's own allocation to keep the Navy fueled."
          : flags.fuelLedgerPath === "unified"
          ? "forcing the Army and Navy onto a single fuel ledger rather than let two separate procurement systems keep losing fuel neither front could afford to an administrative seam."
          : "starving the fleet's reserves to keep the Army's northern garrison intact.";
        const finalWord = flags.kantokuenFinalPath === "heldGround"
          ? "On balance, this was the harder road available to Tokyo in 1941."
          : "The Navy's decade-long argument against this war was right, and this whole detour exists mainly to show how right.";
        const secondFront = flags.armisticeQuestionPath === "accounting"
          ? " The full accounting this staff commissioned afterward confirmed what the numbers already implied: a war fought in two sequential pieces performed worse on both fronts than the single, undivided war history never had to compare it against. No case study said otherwise, because no real war was ever fought this way."
          : flags.armisticeQuestionPath === "pressForward"
          ? " This staff declined to reckon with the cost in writing and pressed forward instead, the same unexamined momentum that let the original 1941 optimism go untested against Nomonhan's own lessons for as long as it did. The southern war fought two years late, on a ledger this command chose not to read, closes out anyway."
          : flags.armisticeQuestionPath === "boundInAdvance"
          ? " This staff commissioned its accounting already bound to act on the answer, the one real difference between this reckoning and the Total War Research Institute's actual 1941 prediction, heard in full by the actual cabinet and then filed and ignored regardless. Whether being bound in advance changed what the accounting actually found is a separate question from whether it changed what got done about it."
          : " Whatever the delayed Southern Operation itself achieves, years late and against an American industrial base this whole detour never actually weakened, is a second war this timeline still has to fight and still, on the same arithmetic the historical war never escaped, loses.";
        const legacy = flags.kantokuenLegacyPath === "hardlinerSeizure"
          ? " The war ministry's hardest faction did, in the end, get the argument it wanted: civilian government sidelined, the decision to keep fighting made by exactly the officers a real, historical coup attempt was made by too, in a war too exhausted by two sequential fronts to produce the same last-minute reversal that actually happened."
          : "";
        const fleets = flags.unbloodiedFleetsPath === "trustVeterans"
          ? " The veteran air groups this timeline never bled out at Midway got their one real test against an American carrier force neither side had ever actually faced, a genuine unknown resolved rather than left standing, whatever the resolution actually cost."
          : flags.unbloodiedFleetsPath === "decline"
          ? " The veteran air groups this timeline preserved intact through two and a half years never did get tested against the fleet they were preserved to eventually meet. Whether that restraint was wisdom or simply delay is a question this timeline's own ending doesn't get to settle any more clearly than the choice itself did."
          : "";
        return `Imperial Headquarters chose a war against the Soviet Union over a war against the United States: ${siberia} ${south} ${fuel} ${finalWord}${secondFront}${legacy}${fleets}`;
      }
      if (flags.quietEmpirePath === "standDown" && flags.coldWarPath === "align") {
        return "By the end of the decade, this empire is courted rather than shunned. Washington's real Cold War rebuilding of occupied Japan happens here too, minus the occupation: an intact, unconquered resource base and an anti-communist government turn out to matter more to containment strategy than the unresolved enemy-state question was worth still enforcing. Formal recognition, if it fully arrives, comes this way, alignment outweighing the legal argument.";
      }
      if (flags.quietEmpirePath === "standDown" && flags.coldWarPath === "holdLine") {
        return "The Cold War's opening arrives, and is declined. What's left is a resource empire that never earned recognition through victory, never lost it through defeat, and never asked for it on any terms but its own. Whether that holds, or is just a quieter version of the same deferred question, no one can yet say.";
      }
      if (flags.quietEmpirePath === "standDown" && flags.coldWarPath === "formalProposal") {
        return "A demobilized empire makes the boldest opening bid available to it anyway: a formal partnership proposal matching Washington's own real NSC 13/2 framework, offered by a government that stood down from war footing years before this Cold War opening ever appeared. Whether Washington's containment strategists find a peaceable, unoccupied Japan proposing its own terms more trustworthy than a defeated one accepting theirs, or simply harder to categorize, is the question this specific combination, a quiet empire making a loud opening move, leaves open longer than either simpler path would have.";
      }
      const southernExtent =
        flags.southPath === "australiaGamble" || flags.australiaLandingPath === "press"
          ? "an empire that reaches as far as an actual invasion of northern Australia was seriously attempted, the resource area's furthest possible extent under this command"
          : flags.southPath === "accelerate"
          ? "a resource area pressed and expanded at every opportunity offered, the Indies, Malaya, and Burma held at their fullest wartime extent"
          : flags.southPath === "consolidate"
          ? "a resource area consolidated rather than pressed further, held securely if not at its widest possible reach"
          : "";
      if (flags.quietEmpirePath === "permanentReadiness" && flags.coldWarPath === "align") {
        return "Years spent bankrupting the civilian economy to prepare for a war that never came instead buy something else: Washington's containment strategy finds real use for a permanently mobilized, anti-communist Japan the enemy-state question never fully closed off. The spending built a harder bargaining position, not the war it was built for." +
          (southernExtent ? ` What that bargaining position is actually built on is real: ${southernExtent}, held without ever having to fight the war that, historically, cost Japan every acre of it.` : "");
      }
      if (flags.quietEmpirePath === "permanentReadiness" && flags.coldWarPath === "holdLine") {
        return "The posture holds even once an opening exists to stand down from it. A resource empire kept permanently mobilized against a ghost, still waiting on a reckoning, or a recognition, it spent a decade refusing on principle rather than being denied." +
          (southernExtent ? ` What it's mobilized to defend is real: ${southernExtent}, the actual territorial fact standing behind a decade of refusing to negotiate its own legitimacy.` : "");
      }
      if (flags.quietEmpirePath === "permanentReadiness" && flags.coldWarPath === "formalProposal") {
        return "A decade of permanent mobilization finally gets spent on something other than waiting: a formal partnership proposal, matched directly against Washington's own real October 1948 policy framework, backed by a readiness posture the historical, occupied Japan never had the independent standing to build. This is a harder bargaining position than either simpler path produces, an empire arriving at the table already armed rather than either courted quietly or holding a line nobody's actually testing." +
          (southernExtent ? ` What it's bargaining with is real: ${southernExtent}, spent here as leverage rather than just defended as territory.` : "");
      }
      if (flags.quietEmpirePath === "armedNeutrality" && flags.coldWarPath === "align") {
        return "A militia empire, built on the real Swiss and Swedish Cold War model of cheap standing costs and expensive latent capability, turns out to be exactly the kind of stable, low-maintenance anti-communist partner containment strategy can work with. Washington's courtship arrives at a government that never bankrupted itself proving readiness and never fully stood down either, a middle path that reads, from outside, as genuine strategic discipline rather than indecision." +
          (southernExtent ? ` What it's defending at that discipline's low cost is real: ${southernExtent}.` : "");
      }
      if (flags.quietEmpirePath === "armedNeutrality" && flags.coldWarPath === "holdLine") {
        return "The same real Swiss and Swedish logic that let armed neutrality function throughout an actual Cold War holds up here too: deterrence maintained cheaply, on principle, without needing Washington's validation to justify the cost. Declining the opening isn't the harder sacrifice permanent readiness would have made it. A structure built for exactly this kind of prolonged, unresolved standoff doesn't have to choose between bankrupting itself and disarming just because nobody's offering recognition." +
          (southernExtent ? ` What it holds without needing anyone's validation is real: ${southernExtent}.` : "");
      }
      if (flags.quietEmpirePath === "armedNeutrality" && flags.coldWarPath === "formalProposal") {
        return "The real armed-neutrality model, cheap standing costs and genuine latent mass, becomes the actual argument in a formal proposal matched against Washington's own October 1948 policy framework: not a defeated Japan needing rebuilding, and not a permanently mobilized one straining its own economy, but a government offering exactly the kind of disciplined, sustainable deterrence containment strategy claims to want. Whether Washington's own planners find that argument more credible than either simpler pitch, or simply harder to categorize against a framework built for occupied and defeated governments, is the real test this specific combination puts in front of them." +
          (southernExtent ? ` What's on the table, held cheaply rather than expensively, is real: ${southernExtent}.` : "");
      }
      if (flags.quietEmpirePath === "standDown") {
        return "No Pearl Harbor, no carrier war, no island campaigns. A resource empire stood down from war footing, holding the Indies' oil and Malaya's rubber into a postwar world it never earned through victory or lost through defeat, the one unresolved colonial question a decolonizing order may not be able to leave alone." +
          (flags.southPath === "australiaGamble" || flags.australiaLandingPath === "press" ? " What it's actually standing down from is the furthest extent this empire ever reached, an attempted invasion of northern Australia among it, held rather than fought over now that there's no war left to settle the question by force." : "");
      }
      if (flags.quietEmpirePath === "permanentReadiness") {
        return "A resource empire kept permanently mobilized against a reckoning that may arrive in 1946, in 1950, or never, at a cost to its own civilian economy the historical Japan was spared by losing the war on a fixed schedule instead of an open-ended one." +
          (southernExtent ? ` The empire being defended at that cost is real: ${southernExtent}.` : "");
      }
      if (flags.quietEmpirePath === "armedNeutrality") {
        return "A resource empire that split the difference deliberately rather than by indecision: the real Swiss and Swedish model of cheap standing costs and genuine rapid-mobilization capability, adapted to a standoff neither side has resolved. Whatever comes of it, this empire never bankrupted itself proving readiness the way permanent mobilization would have, and never gambled its deterrence away the way full demobilization would have either." +
          (southernExtent ? ` What that discipline is actually built to defend is real: ${southernExtent}.` : "");
      }
      if (flags.longWarPath === "terms") {
        return opening + "and by 1945 fought from a materially different carrier or air-cadre position than the historical record ever held, ends on Togo's argument that a Japan with something left to offer has more to negotiate with than a Japan with nothing left to lose. A negotiated armistice rather than unconditional surrender leaves real questions open that the historical occupation closed immediately: whether Korea and Formosa stay under Japanese administration into the late 1940s rather than passing to Allied control at once, whether the imperial institution's postwar authority gets settled by treaty rather than dictated by an American occupation government, and how an early Cold War divides its attention when Japan's alignment isn't already fixed. None of it is certain. A Japan that keeps something at the table in 1945 is a Japan the rest of the decade has to negotiate with, not simply administer.";
      }
      const atomicChainOutcome = flags.hiroshimaResponsePath === "surrenderNow"
        ? " Hiroshima was the only city this war lost to the weapon. The war ministry's position broke before a second bomb could test how much further it would have held."
        : flags.nagasakiResponsePath === "imperialIntervention" && flags.coupOutcomePath === "suppressed"
        ? " Both cities were lost. The Big Six's own deadlock broke only when the Emperor intervened directly, and the coup that followed, real and nearly successful, was suppressed by dawn, the historical finish arrived at by the historical route."
        : flags.nagasakiResponsePath === "imperialIntervention" && flags.coupOutcomePath === "succeeded"
        ? " Both cities were lost, the Emperor's own intervention broke the cabinet's deadlock, and the coup that followed came further than the real one did: the recording seized rather than found, the broadcast delayed rather than airing on schedule, an ending the historical record's own narrow margin didn't actually produce."
        : flags.deadlockPath === "brokenByDefection"
        ? " Both cities were lost, and rather than ask the Emperor to break the Big Six's own deadlock, a single minister crossed his own faction to end it, a resolution the historical council never needed because it resolved a different way."
        : flags.deadlockPath === "unresolved"
        ? " Both cities were lost, and the deadlock that historically broke under the Emperor's own direct intervention was never given the chance to: no one asked, and the council's three-three split stood, unresolved. What doesn't pause for it: a third weapon, already in production on a schedule that owes nothing to this room's paperwork; conventional bombing raids against cities the council hasn't gotten to discussing; and a Soviet army already inside Manchuria with no reason of its own to wait on Tokyo. The deadlock is a real, honest place for this history to end, not a resolution deferred to some later point this record reaches. It is not a place where the war itself was waiting."
        : " The war reaches the same historical finish everything else here reaches, the bombs, the Soviet declaration, the Emperor's own intervention, largely unmoved by the specifics of this particular choice.";
      if (flags.longWarPath === "ketsuGoRegardless") {
        return opening + "and by 1945 held assets the historical record never let Japan keep, ends with those assets spent on the same home-islands defense Ketsu-Go always planned for regardless. The preserved strength didn't change the production arithmetic behind the war's broad ending; it changed how long the war ministry's hardliners could keep insisting the fight wasn't over." + atomicChainOutcome;
      }
      if (flags.moscowResult === "neutralityHolds") {
        return opening + "reaches its end without the Soviet declaration of war that historically arrived in its final week, for reasons no surviving cable or record ever explains. Stalin's real commitment at Yalta, made to Roosevelt months earlier and entirely independent of anything Tokyo asked, simply doesn't hold here. Japan fights the rest of this war, and loses it, against the Western Allies alone, without the two-front collapse that historically broke the war ministry's last argument, a rare branch, kept honest about how thin the historical basis for it is.";
      }
      if (flags.moscowPath === "concessions") {
        return opening + "reaches its end with a real, documented offer, the southern Kurils, made directly to a Soviet government already promised those same islands for free by Roosevelt and Churchill at Yalta months earlier. The rest of the war proceeds regardless: Stalin's actual timetable for entering the Pacific war was never contingent on anything Tokyo could offer bilaterally, and a territorial concession aimed at buying neutrality was, without anyone in this ministry knowing it, competing against an offer that had already won.";
      }
      if (flags.endgamePath === "surrenderInquiry") {
        return opening + "reaches its end not at the historical moment the Emperor's own intervention finally broke a deadlocked cabinet, but earlier: Togo's peace faction opening a channel Imperial Headquarters never historically tested this soon, without the shock of the bombs or the Soviet declaration to force the war ministry's hand. Whether that channel reached anyone in Washington ready to use it is uncertain; what's certain is the shape of the argument happening inside Tokyo, months before history's version of the same argument finally ended.";
      }
      if (flags.endgamePath === "purgePeaceFaction") {
        return opening + "removes the one internal check that historically kept the war ministry's most extreme instincts from running unopposed. The final word on this thread: institutionalizing that instinct in advance, rather than leaving it as a last failed gasp, was the clearest bad decision available here, not a defensible alternative in different clothes." + atomicChainOutcome;
      }
      if (flags.endgamePath === "ketsuGo") {
        return opening + "runs its full course toward the historical finish: militia mobilized, the home islands prepared for an invasion." +
          " The same real 1945 planning study that gave American staff a range of 1.7 to 4 million U.S. casualties for an actual landing projected five to ten million Japanese dead on the other side of that same invasion, a range built on the same assumption this militia mobilization makes real: large-scale civilian participation in the defense of the home islands. The invasion never actually comes." +
          atomicChainOutcome;
      }
      if (flags.endgamePath === "pineRootDiversion") {
        return opening + "runs its full course toward the same historical finish." + atomicChainOutcome + " What's different here is smaller and more specific: a navy's last coherent fuel policy, decided in the full knowledge that thirty-seven thousand improvised stills across the country were never going to produce enough pine-root oil to matter strategically, spent anyway, on the theory that a decision made with total clarity is worth more than one made in denial of what little was actually left.";
      }
      if (flags.endgamePath === "totalMobilization") {
        return opening + "runs its full course toward the same historical finish." + atomicChainOutcome + " What's different here is a real, if narrow, expansion past a conscription law the historical government left standing, the exemptions for married women and the very old and the very young removed here for a defense that, historically and here alike, the war's actual ending arrived before anyone had to fully test.";
      }
      if (flags.washingtonPath === "negotiate") {
        return "Pearl Harbor never happened, and IGHQ chose to seek terms instead of fighting for them, testing whether a Congress really divided over intervention would take a negotiated peace seriously. The confidence here is real but bounded: what Tokyo tried is known; what Washington's Congress would really have done with an offer history never had to answer isn't, and no pretense is made otherwise.";
      }
      if (flags.washingtonPath === "fortify") {
        return "There was no Pearl Harbor in this history, and the opening advantage went into hardening the whole resource arc instead of testing diplomacy, a bet that American entry, if it came at all, would meet a defense in far better order than history's improvised one ever was. Whether that defense was ever tested is more than this venture was ever positioned to answer.";
      }
      if (flags.finalPath === "lastStand") {
        return "The Philippines were conceded without a fleet action at Leyte, and whatever the Navy preserved by not spending it there gets committed instead to a final defense in home waters. A different final chapter than the historical one, but leaving Japan facing an identical bottom line: a Japan with no navy left and a surrender still to negotiate. The closest real analogue isn't hypothetical: the actual Yamato, held back from Leyte's own fighting, was sent on exactly this kind of one-way final sortie six months later anyway, Operation Ten-Go in April 1945, fuel for a single trip and orders to beach herself as a coastal gun platform once the fuel ran out. She and her escorts were found and sunk before reaching Okinawa at all, roughly 3,700 to 4,200 Japanese sailors dead, Yamato alone losing 3,055 of her 3,332 crew, against ten American aircraft lost taking her down. Whatever fleet survives to be spent here is being spent on a mission the actual historical record already ran once, at almost exactly this cost.";
      }
      if (flags.finalPath === "leverage") {
        return "Leyte never happened. The fleet that would have been spent there survives Manila's loss instead, and becomes a bargaining chip rather than a weapon in the war's final diplomatic maneuvering. Whether an intact fleet changed Washington's committed insistence on unconditional surrender is uncertain, and probably didn't: American terms weren't primarily a function of Japan's remaining naval strength. What it changed was the shape of the argument happening inside Japan's own war ministry in the war's final weeks. The real Yamato never got this chance: preserved through Leyte only to be spent six months later anyway, on a one-way sortie that cost roughly 3,700 to 4,200 Japanese sailors and never reached its target. A fleet that survives long enough to matter at the negotiating table, rather than being spent the same way regardless, is the rarer outcome this path actually tests.";
      }
      if (flags.rommelPath === "pressAnyway") {
        return "Midway broke the other way, one of the rarest breaks in this war, and the free hand it bought sailed for the Indian Ocean only to find Rommel already beaten at El Alamein. The squadron pressed on and degraded British shipping anyway, a modest result that doesn't change the Mediterranean war's already-settled trajectory. The coordination imagined here never had a German partner capable of using it by the time Japan's fleet was actually in position to offer it.";
      }
      if (flags.rommelPath === "recall") {
        return "Midway broke the other way, one of the rarest breaks in this war, and the free hand it bought sailed for the Indian Ocean only to find Rommel already beaten at El Alamein. Rather than spend more fuel on a coordination that arrived too late to matter, the fleet turned for home, a quieter ending to the most speculative attempt at genuine Axis partnership than the historical alliance, which never got this far in the first place, ever had to reckon with.";
      }
      if (flags.pacificWonPath === "indianOcean") {
        return "Midway broke the other way, one of the rarest breaks in this war, and Combined Fleet staff spent the free hand it bought reaching for a coordination with Germany the real wartime alliance never developed the habits to support. Whether a single won naval battle changes an alliance built on distance and distrust more than shared planning is a real, unresolved question.";
      }
      if (flags.pacificWonPath === "harden") {
        return "One of the rarest breaks in this war went Japan's way at Midway, and bought the one thing Yamamoto actually asked for at the start of this war: time, spent hardening the resource empire rather than reaching for a wider coordination this war's actual alliance structure never supported. What Japan does with a stronger defensive position in the later years isn't covered here, a question this venture never gets to answer.";
      }
      const expansionMarkers = [
        flags.perimeterPath === "contest",
        flags.fsPath === "invade",
        flags.ascendantPath === "pressHawaii",
        flags.earlyPerimeterPath === "rebuild",
        flags.kantokuenPath === "deep",
        flags.southPath === "accelerate",
      ].filter(Boolean).length;
      if (expansionMarkers >= 3) {
        return opening + "reaches its historical conclusion regardless: the atomic bombs, the Soviet declaration, and a war cabinet that runs out of arguments arrive on essentially the same schedule no empire's territorial extent ever actually changed. What's real and worth naming plainly is that this empire, at its widest point here, held ground the historical one often couldn't afford to hold, spent on choices that pressed rather than conserved at nearly every opportunity offered. None of it was ever going to be enough against an opponent whose industrial base was never in question. It was still, on its own terms, held.";
      }
      if (expansionMarkers >= 1) {
        return opening + "reaches its historical conclusion by whatever route this specific run of choices carved to it, an ending the broad record would still recognize even where the path here diverged from it in the details. Some real ground was pressed for and held along the way rather than conserved, without changing what the war's own arithmetic was always going to decide regardless.";
      }
      return "The war reaches its historical conclusion by whatever route this history's specific choices carved to it, an ending the broad record would still recognize even where the path here diverged from it in the details.";
    },
  },
