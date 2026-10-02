  japan: {
    id: "japan",
    seal: "IGHQ",
    name: "Imperial General Headquarters",
    dates: "Beginning 1940",
    brief: "Direct Japan's war from the road to the Tripartite Pact through the surrender debate. Army and Navy will argue past each other more often than they agree. Some calls were contested even inside Imperial Headquarters at the time — those can break either way.",
    teaser: "A war chosen in confidence, fought in doubt.",
    accent: "#5c1a1a",
    dynamic: true,
    intro: "September 1940. The alliance with Germany and Italy is on the table, and the Southern Resource Area's oil and rubber sit behind every argument being made in this room right now. China is still unresolved after three years. What Tokyo does next, in each of these rooms, is yours to decide.",
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
            "Three years into a war against Chiang Kai-shek's government that was supposed to be finished in months, the China war is consuming a divisions and a budget the Southern Operation's planners increasingly resent. A negotiated settlement isn't fantasy. Contacts through intermediaries in Hong Kong and Shanghai have floated terms more than once, and elements inside the Army itself argue that a China still fighting is the single biggest drain on everything Japan wants to do next. The alternative, the one that's happening, is a puppet government under Wang Jingwei in Nanjing, recognized by Tokyo and by almost nobody else, while the real war against Chiang's Nationalists, and increasingly Mao's Communists, continues without resolution.",
          choices: [
            {
              label: "Continue backing the Wang Jingwei government: pursue victory over Chiang rather than terms with him",
              advisor: { name: "Tojo", quote: "Chiang has rejected every terms we have offered because he believes America will eventually fight this war for him. I do not think further concessions change that calculation. I think finishing the war does." },
              historical: true,
              setFlags: { chinaPeacePath: "continueWar" },
              impact: { readiness: 0, pipeline: -1, initiative: 0 },
              next: "tripartitePact40",
              outcome:
                "China's war grinds on with no resolution, consuming roughly a million men Japan will spend the rest of the war wishing it had for the Southern Operation and, later, for the mainland crisis of 1944. Wang Jingwei's government is recognized by Tokyo, Germany, and Italy, and functionally by nobody whose recognition matters to the war's actual outcome.",
            },
            {
              label: "Pursue a genuine negotiated settlement with Chiang, offering real terms rather than a puppet government",
              advisor: { name: "Konoe", quote: "I have said before that we should not have a policy of refusing to deal with Chiang's government. I am aware that saying so again, three years into this war, sounds like weakness. I believe continuing to refuse is the real weakness." },
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
                    "Konoe's bet pays off better than the historical record's own outcome ever allowed it to be tested. With real terms on the table instead of a puppet government, Chiang's government engages seriously enough that the divisions this war has consumed for three years start coming home instead of digging in further.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "Chiang holds out for outside support",
                  setFlags: { chinaPeaceResult: "rejected" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome, and the one this uncertainty was honestly hedging toward: Chiang, still expecting eventual American or Soviet backing, reads real terms as a sign Japan is tiring of the war rather than as a genuine offer worth taking, and holds out. The negotiating effort costs real diplomatic capital and buys nothing tangible in return.",
                },
              ],
              outcome:
                "A reasoned projection of the position Prince Konoe's own government held before ultimately declaring, in January 1938, that it would no longer deal with Chiang's government at all, a declaration many historians consider one of the war's more consequential unforced errors, foreclosing exactly this kind of settlement while the terms available were still relatively generous. Whether Chiang, still expecting eventual American or Soviet support, would have taken real terms seriously in 1940 is uncertain; what's certain is that the divisions freed by an actual settlement would have changed the resourcing math behind everything that follows.",
            },
            {
              label: "Escalate the military pressure while quietly keeping a back channel open: force better terms rather than choosing between war and peace",
              advisor: { name: "Sugiyama", quote: "Chiang does not negotiate from a position he doesn't feel pressure in. Pressure alone, though, has not produced terms in three years of trying. I would like to attempt both at once before I concede either has failed." },
              setFlags: { chinaPeacePath: "pressureAndTalk" },
              impact: { readiness: -1, pipeline: 0, initiative: 1 },
              next: "tripartitePact40",
              outcome:
                "A harder push against Chiang's remaining strongholds, paired with an intermediary channel neither side treats as a real offer yet. It's the kind of half-measure that satisfies neither the Army's appetite for a decisive campaign nor Konoe's case for genuine terms, and it largely reproduces the historical war's actual shape: pressure without resolution, a channel that exists but is never seriously used, and the same million men still committed to a war that was supposed to be finished in months.",
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
            "Foreign Minister Matsuoka has pushed hard for a formal alliance with Germany and Italy, on the theory that a three-power pact makes Washington think twice about opposing Japan's ambitions in Asia: deterrence through the threat of a two-front war America would rather avoid. The Navy's own leadership isn't convinced. Yamamoto in particular has said, in terms his superiors found unwelcome, that an alliance built to intimidate the United States risks provoking exactly the confrontation it's meant to prevent, against an industrial base Japan has no real prospect of outproducing in a prolonged war." +
            (flags.chinaPeaceResult === "accepted"
              ? " This argument is being made by a government that just freed roughly a million men from a China war Chiang actually agreed to settle, a fact Matsuoka's own case for deterrence-through-strength doesn't quite know what to do with: the strength on offer is suddenly real rather than theoretical, and Yamamoto's skepticism has less to stand on than it would have a season ago."
              : flags.chinaPeaceResult === "rejected"
              ? " This argument is being made by a government that just watched a negotiating effort with Chiang fail, a million men still committed to a war with no resolution in sight, which does nothing to help Matsuoka's case that Japan is negotiating from strength rather than searching for it."
              : ""),
          choices: [
            {
              label: "Sign the Tripartite Pact, formalizing the alliance with Germany and Italy",
              advisor: { name: "Matsuoka", quote: "America respects strength and despises weakness. A three-power pact is the clearest strength we can show without firing a shot. I believe it keeps the peace, not breaks it." },
              historical: true,
              setFlags: { tripartitePath: "signed" },
              impact: { readiness: 0, pipeline: 0, initiative: 1 },
              next: "unificationQuestion40",
              outcome:
                "September 27, 1940: the pact is signed, formalizing what Washington reads, correctly, as a hostile alignment. Rather than deterring American opposition, it hardens it. Roosevelt's administration treats the pact as confirmation that Japan has chosen its side, and the diplomatic room to maneuver that Matsuoka believed the alliance would buy narrows rather than widens over the following year.",
            },
            {
              label: "Decline the pact, keeping Japan's diplomatic hands free rather than binding to Germany's fortunes",
              advisor: { name: "Yamamoto", quote: "I am being asked to plan a war against the country that would have to supply half of what I'd need to fight it. I would like that considered before this alliance is signed, not after." },
              setFlags: { tripartitePath: "declined" },
              impact: { readiness: 1, pipeline: 1, initiative: -1 },
              next: "unificationQuestion40",
              outcome:
                "A grounded projection of the argument the Navy's leadership made and lost. Declining the pact costs Matsuoka's deterrence theory its test, and leaves Japan without the formal alliance framework that historically shaped Berlin's and Tokyo's largely uncoordinated expectations of each other for the rest of the war. Whether it meaningfully changes Washington's read on Japan's intentions is uncertain; the oil embargo's actual triggers, covered shortly, have more to do with Indochina than with Berlin.",
            },
            {
              label: "Negotiate a narrower agreement: technical and economic cooperation with Germany, without the mutual military defense commitment",
              advisor: { name: "Yonai", quote: "I am not opposed to German engineering. I am opposed to a clause that puts this country's war decisions on a timetable Berlin sets. Take the technology. Decline the obligation." },
              setFlags: { tripartitePath: "limited" },
              impact: { readiness: 1, pipeline: 0, initiative: 0 },
              next: "unificationQuestion40",
              outcome:
                "A middle position some in the Foreign Ministry floated: German aircraft and submarine technology without the mutual-defense clause that turns a trade relationship into a shared war. Berlin's negotiators, historically insistent on the full pact, would need real convincing to accept a partner who wants the engineering without the obligation, and that convincing was never easy or likely. What it buys, if Berlin accepts it, is real technical benefit without Matsuoka's deterrence theory ever being tested and without the alliance narrowing Japan's diplomatic room the way the full pact historically did.",
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
            "The Army and Navy run separate codebreaking bureaus that rarely share results, separate aircraft procurement programs that duplicate engines and airframes neither service will let the other use, and separate intelligence networks that have, more than once, produced contradictory assessments of the same enemy fleet movement. This is not a secret inside Imperial Headquarters. It is a standing joke with real operational costs attached, and for the moment, before the war actually starts, there is still time to fix at least some of it.",
          choices: [
            {
              label: "Leave the services running parallel: unification fights are for peacetime, not for a staff about to plan a war",
              advisor: { name: "Sugiyama", quote: "Fighting the Navy over which service's codebreakers get first look at a decrypt is not how I intend to spend the months before this war starts. We fight the war we have the structure for." },
              historical: true,
              setFlags: { unificationPath: "parallel" },
              impact: { readiness: 0, pipeline: 0, initiative: 1 },
              next: "hokushinDebate41",
              outcome:
                "Separate codebreaking, separate intelligence assessments, separate aircraft programs that never converge on shared standards: that's how the Army and Navy fight the entire war. It is a real, well-documented drag on the war effort for the whole of its duration, and it never becomes the crisis any single decision maker can point to and fix, because the cost is distributed across four years rather than concentrated in one afternoon.",
            },
            {
              label: "Force a genuine joint command structure now, before the shooting starts",
              advisor: { name: "Nagano", quote: "This fight is unpopular in both services, and I know it. Unpopular is not the same as wrong, and the war we are about to start will not forgive us the years we didn't spend fixing this." },
              setFlags: { unificationPath: "forced", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 1, initiative: -1 },
              next: "hokushinDebate41",
              outcome:
                "A genuine structural reform neither service historically accepted without years of wartime pressure forcing it. Shared codebreaking, coordinated aircraft standards, a single intelligence assessment instead of two competing ones: real, unglamorous administrative work with real operational upside, bought at the cost of institutional goodwill later chapters will have to spend down.",
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
            "Germany's invasion of the Soviet Union six weeks ago appears, from every report reaching Tokyo, to be succeeding faster than anyone expected. Army Group Center is already deep into Soviet territory, and if Moscow falls this year, the Kwantung Army's staff argue that Siberia becomes an undefended prize rather than the hardened frontier it's been since the humiliating defeat at Nomonhan two years ago. Kantokuen, the Kwantung Special Maneuvers, has quietly mobilized nearly 700,000 men and equipment on the Manchurian border under cover of an exercise, ready to strike north the moment Soviet forces in Siberia are thin enough to make the gamble look survivable. It is the last live moment for the strategic argument the Navy has been winning for a decade: whether Japan's war is against Russia, as the Army has always preferred, or against the resource-rich south, as the Navy has always needed it to be.",
          choices: [
            {
              label: "Hold to the Southern Operation: the resources that actually solve the oil problem are south, not north",
              advisor: { name: "Nagano", quote: "Kantokuen solves a problem we don't have. We are not short on land. We are eighteen months from being short on fuel, and there is no fuel in Siberia worth this fleet's time." },
              historical: true,
              setFlags: { hokushinPath: "south", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 0, pipeline: 1, initiative: 0 },
              next: "indochinaOccupation41",
              outcome:
                "Kantokuen is quietly stood down by late August as Soviet resistance around Smolensk proves harder than German planning assumed, and the Kwantung Army's mobilized divisions are gradually released back to garrison duty, some eventually redeployed south instead. The strategic argument the Navy had been winning since the 1930s is settled for good: Japan's war, when it comes, is the one that follows.",
            },
            {
              label: "Execute Kantokuen: strike north into Siberia while Soviet attention is fixed on Germany",
              advisor: { name: "Tojo", quote: "The Army has waited a decade to answer what Nomonhan cost us. If there is ever a year Russia cannot afford to fight on two fronts, staff estimates say this is it." },
              setFlags: { hokushinPath: "north" },
              impact: { readiness: -2, pipeline: -2, initiative: 1 },
              next: "kantokuenOffensive41",
              outcome:
                "This is the single largest departure from the historical record, and whatever happens from here is harder to project than anywhere else in this war. A Japan at war with the Soviet Union instead of the United States is not a different chapter of the same war. It is a different war, fought on different terrain, against a different production base. The Kwantung Army's staff, flush with Germany's early momentum, now has to decide how deep into Siberia this offensive goes.",
            },
            ...(meters.pipeline >= 3
              ? [
                  {
                    label: "Hold to the Southern Operation, but run a limited northern reconnaissance-in-force to test Soviet weakness rather than guess at it",
                    advisor: { name: "Nagano", quote: "I am not proposing Kantokuen. I am proposing this staff stop arguing about Soviet weakness from rumor and Berlin's own optimism, and go find out what's across that border, on a scale that costs us nothing if the answer is unfavorable." },
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
            "The Kwantung Army has crossed the border, and the first weeks bring the kind of resistance staff optimism had discounted: Soviet garrison divisions dug in around Lake Baikal and the Trans-Siberian Railway are fighting with a discipline the Nomonhan generation didn't expect a Soviet high command distracted by Germany to still be capable of. The historical record has nothing to say past this point: the actual Kantokuen was stood down before crossing the border at all, so everything from here is built on staff-plan logistics and Nomonhan's own lessons about what this terrain does to an offensive that outruns its supply — extrapolation, since nothing here actually happened.",
          choices: [
            {
              label: "Push deep: drive for the Trans-Siberian Railway itself, cutting the Soviet Far East off from resupply entirely",
              advisor: { name: "Tojo", quote: "Nomonhan taught us the cost of fighting Zhukov on a battlefield he chose. This time we choose it, deep enough that the railway itself becomes the objective, not a fortified line we have to grind through first." },
              setFlags: { kantokuenPath: "deep" },
              impact: { readiness: -4, pipeline: -3, initiative: 2 },
              disabledReason: meters.pipeline <= -3 ? "There isn't rail capacity left to sustain a drive this deep into Siberia. The border gains can be held, but the railway itself is out of reach at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "siberianReckoning42",
              outcome:
                "The offensive's logistics, already the weakest part of any Kwantung Army staff estimate, are stretched past what Manchuria's rail network can actually sustain this far from the border, on terrain and against a Soviet defense-in-depth doctrine not meaningfully different from what broke the Kwantung Army at Nomonhan two years earlier. The operational specifics from here are hard to project. What's not hard to say is that an army whose own staff studies never solved Nomonhan's supply problem hasn't solved it now either, at three times the distance.",
            },
            {
              label: "Limit the objective: seize the border regions and key resource areas, decline the deeper drive",
              advisor: { name: "Nagano", quote: "Whatever this offensive was supposed to prove about Nomonhan, it is not going to prove it by repeating Nomonhan's mistake at a larger scale. Take what the border gives us. Do not go looking for the railway." },
              setFlags: { kantokuenPath: "limited" },
              impact: { readiness: -1, pipeline: -1, initiative: -1 },
              next: "siberianReckoning42",
              outcome:
                "A more disciplined version of the same gamble: border resource areas and a shortened, more defensible line, trading the railway's strategic value for a supply line this army's logistics staff can actually project sustaining. The fundamental problem doesn't go away: this is a second front against an enemy Japan chose not to fight for good strategic reasons, and limiting the objective limits the exposure without resolving why the exposure exists at all.",
            },
            ...(meters.readiness >= 6
              ? [
                  {
                    label: "Hold the border and wait: commit nothing further until the Kwantung Army actually reaches the two-to-one edge its own staff studies say the offensive needs",
                    advisor: { name: "Nagano", quote: "A real American intelligence estimate this October puts us at rough parity with the Siberian army, not superiority. Our own staff studies say two to one before this offensive makes sense. I would like to actually have that before we spend men finding out we don't." },
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
            "Winter in Siberia arrives on its own schedule, and it arrives on top of a supply situation that was never solved, only sized differently depending on how deep the Kwantung Army actually pushed. Germany's own war against the Soviet Union is stalling short of the quick collapse Tokyo's planners assumed when this operation was approved. Moscow hasn't fallen, and a Soviet high command that can spare divisions for a counteroffensive in the east is a very different problem than the distracted, one-front adversary this operation was built to exploit. Imperial Headquarters has to decide what this second front is worth continuing to pay for." +
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
              advisor: { name: "Tojo", quote: "A single hard winter is not a reason to withdraw from a war we chose to start. This army holds what it has taken." },
              setFlags: { siberianPath: "holdGains" },
              impact: { readiness: -3, pipeline: -2, initiative: 0 },
              disabledReason: meters.pipeline <= -3 ? "There isn't the winter supply capacity to hold this ground through an attrition campaign. A dug-in position this exposed needs sustainment this pipeline level can't provide." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "twoFrontStrain44",
              outcome:
                "A Japan now committed to a ground war against the Soviet Union, on terrain that broke its own army's confidence once already, fighting alongside a German war effort that is not delivering the quick Soviet collapse this operation's entire premise depended on. Meanwhile the Southern Resource Area, the oil and rubber this whole war was supposed to be about, sits untouched and unresourced on the other side of an empire now fighting two serious wars instead of managing one embargo. What that costs over the following years is the next chapter's question, not this one's.",
            },
            {
              label: "Cut losses: negotiate a local ceasefire with Soviet forces and withdraw to the original border",
              advisor: { name: "Nagano", quote: "We were told this would be over before the snow. It is not over, and there is snow. I would rather explain a withdrawal to the Emperor than explain why I let a resource war become a two-front war on top of it." },
              setFlags: { siberianPath: "withdraw" },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "twoFrontStrain44",
              outcome:
                "A withdrawal back to the original frontier, conceding the gamble without conceding the argument that started it. The Navy's decade-long case for a southern war rather than a northern one is now settled by direct experience rather than staff debate. What this timeline does about the Southern Resource Area, the oil embargo, and everything else that follows is a full year behind where the historical timeline had it, fought by an army that has just spent a year and real casualties confirming what its own 1939 defeat at Nomonhan already tried to teach it.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Press for the actual German objective: drive west toward a link-up on the Trans-Siberian line before the window closes",
                    advisor: { name: "Tojo", quote: "Ribbentrop's own telegram to this embassy was explicit: the goal was always a meeting of German and Japanese forces on that railroad before winter. Every month we spend digging in instead of driving toward it is a month closer to that goal becoming permanently impossible." },
                    setFlags: { siberianPath: "pressWest" },
                    impact: { readiness: -4, pipeline: -3, initiative: 3 },
                    disabledReason: meters.pipeline <= -2 ? "There isn't fuel or rail capacity to drive west at all, let alone far enough to matter. A push toward a link-up that never gets close enough to attempt isn't a push, it's a further withdrawal in slow motion." : undefined,
                    gateCheck: { meter: "pipeline", threshold: -2, label: "Pipeline" },
                    next: "twoFrontStrain44",
                    outcome:
                      "A real German ambition, documented in Ribbentrop's own July 1941 telegram to the Tokyo embassy, which called for 'the meeting of Germany and Japan on the Trans-Siberian railroad' before that winter set in. The distance involved, several thousand kilometers of Siberian terrain neither army's actual logistics ever came close to bridging in reality, makes the ambition itself the clearest evidence of how removed from military fact this alliance's own war aims sometimes were. This push doesn't reach anything resembling a link-up. It reaches somewhat further west than the historical Kwantung Army ever operated, at a cost this front's own supply situation was never built to absorb, chasing a meeting point neither Axis power's actual military position in 1942 made remotely achievable.",
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
            "Whatever the Kwantung Army's Siberian adventure cost, held ground and an ongoing second front, or a chastened withdrawal, the Southern Resource Area's oil and rubber remain exactly as unaddressed as they were in 1941, now a full two years further into an embargo clock that never stopped running while Tokyo's attention was pointed north. IGHQ finally has to turn to the war history already treats as the one that matters, years late and with an army whose confidence and readiness this whole detour has already spent." +
            (flags.siberianPath === "holdGains"
              ? " That army is still committed north, dividing whatever the Southern Operation gets to work with."
              : flags.siberianPath === "pressWest"
              ? " That army is scattered somewhere west of where it started, chasing a link-up with German forces that never got remotely close to happening, in worse shape to redeploy south than either a dug-in defense or a clean withdrawal would have left it."
              : " That army is at least undivided now, for whatever a chastened, once-bloodied Kwantung Army's confidence is worth."),
          choices: [
            {
              label: "Launch the delayed Southern Operation at full urgency: race to close a two-year gap the embargo clock never paused for",
              advisor: { name: "Tojo", quote: "The deliberate timeline this operation would have had in 1941 is not a luxury we have. Every month further behind is a month closer to a fuel crisis this whole war was supposed to solve, not deepen." },
              setFlags: { delayedSouthPath: "rushed", speculativePath: true },
              impact: { readiness: -2, pipeline: -1, initiative: 2 },
              disabledReason: meters.pipeline <= -4 ? "There isn't fuel to compress this timetable at all. A rushed operation needs a margin to rush with, and this pipeline level has none left." : undefined,
              gateCheck: { meter: "pipeline", threshold: -4, label: "Pipeline" },
              next: "theDelayedStrike44",
              outcome:
                "A compressed, urgent version of the Southern Operation the historical record fought on a full timeline: rushed, under-prepared by comparison, and starting from an oil position considerably worse than the historical 1941 baseline given two additional years of consumption without the resource area's supply to offset it. Whether speed compensates for the compounded fuel deficit is the last open question this path leaves standing.",
            },
            {
              label: "Proceed deliberately: apply the caution the Siberian front's own hard lessons argue for, despite the compounding fuel deficit",
              advisor: { name: "Nagano", quote: "We have just spent a year learning what happens when this staff assumes a timeline the terrain and the enemy don't agree to. I would rather apply that lesson here than repeat the assumption that cost us the last one." },
              setFlags: { delayedSouthPath: "deliberate", speculativePath: true },
              impact: { readiness: 1, pipeline: -2, initiative: -1 },
              next: "theDelayedStrike44",
              outcome:
                "A more disciplined Southern Operation, planned with the caution Siberia's hard lessons taught this staff, at the direct cost of time this timeline can least afford, given an embargo clock that has already run two years longer than the historical war. Discipline and time are the trade this final chapter has to weigh.",
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
            "The fleet this operation is about to strike is not the one the historical Combined Fleet caught at anchor. The real Two-Ocean Navy Act, signed in July 1940 after France fell, authorized eighteen fleet carriers, seven battleships, and over a hundred destroyers, a construction program that ran on its own schedule regardless of anything Japan did or didn't do, and two and a half additional years of that schedule have now matured into hulls the historical Pearl Harbor attack never had to face at full strength. What hasn't matured is the war itself: Germany's actual 1941 declaration of war on the United States was tied specifically to the Tripartite Pact obligation triggered by an attack on America that, in this timeline, never happened, and the real undeclared naval war already running in the Atlantic, U-boats and American destroyers already trading fire off Iceland, has had two more years to either cool or escalate into something this room has no way of knowing the state of. Whatever gets struck here today, it is being struck without the element this operation's entire historical justification depended on: an America that has never had a reason to think about Japan as an enemy at all." +
            (flags.delayedSouthPath === "rushed"
              ? " The rushed timetable means this fleet goes in with less reconnaissance on what that Two-Ocean construction has actually produced by now than the historical planners had on a fleet they'd been watching for years."
              : " The deliberate timetable at least bought real reconnaissance on what two and a half years of undisturbed American shipbuilding actually looks like. What it found doesn't change what has to happen next."),
          choices: [
            {
              label: "Strike the fleet directly: whatever it has become, hitting it before it can be used is still the whole strategic logic of this operation",
              advisor: { name: "Toyoda", quote: "A fleet that has never once been struck has no reason to expect to be struck. That is the one advantage two and a half years of delay hasn't cost us yet, whatever this fleet's actual strength turns out to be." },
              setFlags: { delayedStrikePath: "strike" },
              impact: { readiness: -3, pipeline: -2, initiative: 3 },
              next: "theUndemolishedFields44",
              outcome:
                "Surprise, the one asset this delayed timeline hasn't spent, holds up: an unwarned fleet is still an unwarned fleet regardless of its size. What the strike actually accomplishes against a force that may be more than double the historical fleet's carrier strength is a different question than what the historical attack accomplished against the fleet it actually found, and no war-gamed estimate this staff commissioned had real data to answer it with.",
            },
            {
              label: "Reconnoiter first: confirm what the fleet has actually become before committing to a strike built on two-and-a-half-year-old intelligence",
              advisor: { name: "Nagano", quote: "I am being asked to authorize a strike on a fleet we have not properly observed since before this whole detour began. I would like one real look at what we're actually striking before this navy commits to it." },
              setFlags: { delayedStrikePath: "reconnoiter" },
              impact: { readiness: 1, pipeline: -1, initiative: -2 },
              disabledReason: meters.initiative <= -4 ? "There isn't the operational tempo left to reconnoiter and still strike before the fleet's own position shifts again. This delay has already cost more of that margin than this staff can spare a second time." : undefined,
              gateCheck: { meter: "initiative", threshold: -4, label: "Initiative" },
              next: "theUndemolishedFields44",
              outcome:
                "A real look at two and a half years of undisturbed construction costs the one advantage this operation still had going for it: an unwarned fleet has now had one more window to notice something is being watched, and the actual scale of the Two-Ocean Navy Act's maturing production, confirmed rather than estimated, is not the kind of news that makes the operation that follows any easier to justify.",
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
            "The resource area's Dutch administrators had, in the real war, a demolition plan ready before Japanese troops ever came ashore: Balikpapan and Tarakan's oil facilities wrecked deliberately rather than handed over intact, a decision that cut the historical Japanese occupation's actual output to a fraction of what full capacity would have produced. This timeline's Dutch administrators have had two and a half more years to refine that same plan, sitting on a war footing without ever having a Japanese fleet actually appear to trigger it. Whether that extra warning time means a more thoroughly prepared demolition, or whether two and a half years without an actual attack has let colonial administrators' readiness lapse the way undisturbed peacetime readiness always tends to, is not something reconnaissance from the air can settle either way.",
          choices: [
            {
              label: "Move fast: land ahead of any warning the fleet's own approach might give the demolition teams time to act on",
              advisor: { name: "Terauchi", quote: "The Dutch have had two and a half years of undisturbed war footing to prepare demolition plans for exactly this scenario. I intend to give them less warning of our approach than that preparation assumes, not more." },
              setFlags: { resourceFieldsPath: "moveFast" },
              impact: { readiness: -2, pipeline: 1, initiative: 1 },
              next: "theFuelLedger44",
              outcome:
                "A real bet on the same logic that failed to prevent the historical demolition, tried again with whatever margin speed can actually buy against administrators who have had two and a half additional years to plan for exactly this scenario. Whether the fields are found intact or already wrecked is not a question this operation gets to answer until the landing itself confirms it either way.",
            },
            {
              label: "Accept the likely demolition and plan around a damaged resource area from the start, rather than bet the operation's own fuel math on an intact one",
              advisor: { name: "Nagano", quote: "I would rather this staff plan for the fields we're actually likely to get than the fields we're hoping for. Two and a half years of Dutch preparation is a reason to expect a more thorough demolition plan." },
              setFlags: { resourceFieldsPath: "planForDamage" },
              impact: { readiness: 1, pipeline: -2, initiative: -1 },
              next: "theFuelLedger44",
              outcome:
                "The more conservative planning assumption, and probably the more honest one: two and a half extra years of colonial war-footing preparation is a reason to expect a more thorough demolition, whatever the temptation to hope otherwise. Restoration crews go in already planned for damaged wells and wrecked refineries rather than discovering the gap between hope and result on arrival.",
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
            "Whatever the delayed Southern Operation's results, the fleet and the Kwantung Army are now drawing on the same shrinking fuel ledger, and Combined Fleet staff are reporting reserves that won't cover both a Siberian garrison and a Pacific naval presence at the levels either front's own commanders consider adequate. This is the arithmetic Nagano warned about back in 1941, arriving on schedule regardless of how the intervening years really played out: a two-front empire spending fuel a one-front war was never going to have to divide." +
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
              advisor: { name: "Yamamoto", quote: "Whatever this army needs in Siberia, it needs it less than this fleet needs fuel to still be a fleet. I am not going to watch the Navy starve for an army's garrison duty." },
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
                    "The bet pays off. Fuel diverted from the Siberian garrison buys the Pacific fleet real additional weeks of operational tempo, exactly the trade Yamamoto's own argument assumed would matter more than a static northern garrison's comfort.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.pipeline); return Math.max(5, 100 - w); })(),
                  title: "The Kwantung Army's drawdown costs more than the fleet gains",
                  setFlags: { fuelLedgerResult: "costly" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome: the fuel diverted south buys the fleet a marginal, hard-to-measure gain, while the Kwantung Army's now-thinner Siberian position becomes a genuine vulnerability the moment Soviet attention turns east, a cost this reallocation didn't fully account for when it was made.",
                },
              ],
              outcome:
                "The fleet gets priority, and whatever the Kwantung Army's Siberian position was worth holding at full strength, it isn't held at full strength any longer. A real, if quiet, drawdown reduces one front's readiness to preserve the other's fuel.",
            },
            {
              label: "Prioritize the army: the northern front IGHQ chose to open still has to be sustained on its own terms",
              advisor: { name: "Tojo", quote: "A second front does not get starved the moment it becomes inconvenient to the Navy's own priorities. This army gets what it needs to hold what it was ordered to hold." },
              setFlags: { fuelLedgerPath: "army" },
              impact: { readiness: -1, pipeline: 1, initiative: 0 },
              next: "aSecondArmisticeQuestion44",
              outcome:
                "The army holds its allocation, and the fleet's own reserves narrow instead. It's a choice that keeps faith with the decision to open a northern front in the first place, at a direct cost to the naval war matters everywhere else. Both fronts are now, by this point, running on borrowed fuel regardless of which one gets the marginal priority.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Force genuine unified allocation: break the structural split where the Army controls captured oil and the Navy consumes most of it",
                    advisor: { name: "Nagano", quote: "The Army administers the fields. This fleet burns most of what comes out of them. That arrangement was never designed by anyone, it simply happened, and every month it costs us fuel neither service can actually account for. I want one ledger, not two." },
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
            "Whether the delayed Southern Operation went rushed or deliberate, its results are now in, and they confirm what this whole detour has been building toward since Kantokuen was first approved: a war fought in two sequential pieces performs worse on both fronts than a single, undivided war would have, and there is no historical case study to point to that says otherwise, because no real war was ever fought this way. IGHQ's remaining choice is less about strategy at this point than about how honestly to reckon with a position two years of sequential wars have produced." +
            (flags.fuelLedgerResult === "helped"
              ? " The fuel gamble at least paid off: the Pacific fleet got real weeks out of what the Kwantung Army gave up, one of the few line items in this whole two-front reckoning that came back showing a genuine return rather than a straight loss."
              : flags.fuelLedgerResult === "costly"
              ? " The fuel gamble didn't pay off: the Kwantung Army's thinner Siberian position bought the fleet a gain too marginal to show clearly in this accounting, one more line item in a two-front war's ledger that reads as cost without a matching return."
              : ""),
          choices: [
            {
              label: "Commission a full accounting of what the two-front choice cost, however uncomfortable the answer",
              advisor: { name: "Nagano", quote: "I would like this staff to know, in writing, what choosing Kantokuen over the Southern Operation's original timetable has cost us. I do not expect the answer to be comfortable. I expect it to be useful." },
              setFlags: { armisticeQuestionPath: "accounting" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "theBelatedReckoning45",
              outcome:
                "A rare moment of institutional honesty with no historical precedent to confirm it would have happened: an internal reckoning with the cost of fighting two wars instead of one, information that at least gives whatever choice comes next a clearer basis than the optimistic staff estimates that started this whole detour in the summer of 1941.",
            },
            {
              label: "Decline the accounting: press forward without dwelling on what the delay and division already cost",
              advisor: { name: "Tojo", quote: "I am not interested in a ledger of what we have already spent. I am interested in what this army does next. Save the accounting for historians, if there are any left to write it." },
              setFlags: { armisticeQuestionPath: "pressForward" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: "theBelatedReckoning45",
              outcome:
                "A choice to keep moving rather than reckon with the compounding cost of this path's own decisions. It's understandable under wartime pressure, and also exactly the kind of unexamined momentum that let the original Kantokuen optimism go untested against Nomonhan's own lessons for as long as it did.",
            },
            ...(meters.readiness >= 6
              ? [
                  {
                    label: "Commission the accounting and commit in advance to acting on it, whatever it shows",
                    advisor: { name: "Nagano", quote: "A real institute gathered this government's own brightest analysts in the summer of 1941 and told the cabinet, to their faces, that a war with America ends in defeat. The report was filed and ignored. I am not interested in filing another one." },
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
            "Japan reaches 1945 having fought two wars in sequence rather than one: a Siberian gambit" +
            (flags.siberianPath === "holdGains" ? ", held through a hard winter at real cost, " : flags.siberianPath === "withdraw" ? ", conceded once the winter made the cost clear, " : flags.siberianPath === "pressWest" ? ", pushed toward a German link-up several thousand kilometers of Siberian terrain never let it reach, " : ", ") +
            "followed by a Southern Operation launched years behind the embargo clock that was always the real constraint." +
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
            " There's no historical record of a war fought this way; what follows is a reasoned accounting, not a forecast." +
            (flags.armisticeQuestionPath === "accounting"
              ? " The staff at least knows, in writing, what the two-front choice really cost. Whatever gets decided from here starts from an honest number instead of an optimistic guess."
              : flags.armisticeQuestionPath === "boundInAdvance"
              ? " This staff commissioned that accounting already bound to act on it, the one thing the real 1941 version of this moment never actually tried. Whatever gets decided from here isn't just informed by the honest number. It's already committed to following where that number points."
              : ""),
          choices: [
            {
              label: "Seek terms: a delayed, diminished war looking for an exit before the arithmetic gets worse",
              advisor: { name: "Togo", quote: "We have fought two wars back to back instead of the one we needed to win. I would rather ask for terms from this position than wait for a third." },
              setFlags: { kantokuenLegacyPath: "seekTerms" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "kantokuenFinalWord46",
              outcome:
                "A Japan seeking terms not from the historical war's exhaustion, but from a different one: two sequential wars, a divided army, an embargo clock that outlasted every timeline this path tried to manage. Whether Washington is even fighting a war with Japan to negotiate an end to, in this timeline, is a question the earlier chapters never resolved.",
            },
            {
              label: "Fight on: commit whatever remains to finishing the Southern Operation's original promise, however late",
              advisor: { name: "Tojo", quote: "Late is not the same as failed. We finish what this war was supposed to be about, on whatever timeline it takes." },
              setFlags: { kantokuenLegacyPath: "fightOn" },
              impact: { readiness: -2, pipeline: -1, initiative: 1 },
              next: "theUnbloodiedFleets45",
              outcome:
                "A Japan still fighting for the Southern Resource Area's original promise, years behind the timeline that promise was built around, on an army and a fuel position steadily narrowed rather than grown. What's left to decide is less strategy than posture.",
            },
            ...(meters.readiness <= -6
              ? [
                  {
                    label: "Let the war ministry's hardest faction settle it: sideline whoever is still arguing for terms and commit to fighting past the point civilian government can still order otherwise",
                    advisor: { name: "Anami", quote: "This staff has watched two governments, one after the other, run out of the authority to end a war on their own terms. I am not confident a third attempt at terms succeeds where the first two didn't." },
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
            "What meets in the resource area's own waters is a strange matchup neither side's actual doctrine was built to fight: Japan's carrier air groups are still, in real and specific terms, the elite prewar force that never bled out at Midway or in the Solomons' six-month meat grinder, veteran aircrew this timeline never asked to die in a single afternoon or fly missions with no rotation home. What they haven't done is meaningfully improve. The real Japanese naval air training pipeline never expanded past a system built for a short war, because this timeline never produced the crisis that historically, belatedly, forced Tokyo to try. Across the water, American naval aviation has had two and a half more years of a wartime aircraft industry that kept advancing regardless of whether Japan specifically was the enemy driving it, newer airframes flown by a pilot corps built by a training program that, in the real war, produced two and a half times as many aviators as Japan ever trained in total. Neither air group has ever fought the other. Both are, in their own way, the best version of themselves this war was ever going to produce.",
          choices: [
            {
              label: "Trust the veterans: commit the fleet's experienced aircrew to a decisive engagement on skill this timeline never let America's newer pilots prove against Japan specifically",
              advisor: { name: "Ozawa", quote: "These are the same aircrews that fought over Malaya and the Indian Ocean when this war was still winning. They have never once faced American carrier aviation directly. I do not think that omission favors the Americans as much as their aircraft roster suggests it should." },
              setFlags: { unbloodiedFleetsPath: "trustVeterans" },
              impact: { readiness: -3, pipeline: -2, initiative: 2 },
              next: "kantokuenFinalWord46",
              outcome:
                "The actual Japanese naval aviators who never fought Midway or the Solomons were, on raw skill, among the best carrier pilots of the entire war, exactly the asset the historical IJN spent by 1943 and this timeline never had to. Whether elite skill in aircraft that stopped meaningfully improving after 1941 beats adequate skill in aircraft that kept improving for two and a half more years is a real, if narrow, historical question no wargame, historical or fictional, ever had real data to settle before this moment forces an answer.",
            },
            {
              label: "Decline the engagement: preserve the veteran air groups rather than test them against an unknown quantity in unfamiliar aircraft",
              advisor: { name: "Nagano", quote: "I have an air group with no equal in raw skill and no experience whatsoever against the fleet it's about to meet. I would rather keep that air group intact and uncertain than spend it finding out for certain in a single afternoon." },
              setFlags: { unbloodiedFleetsPath: "decline" },
              impact: { readiness: 1, pipeline: 1, initiative: -3 },
              disabledReason: meters.pipeline <= -5 ? "There isn't fuel to maintain a fleet in being and decline this engagement indefinitely. Declining costs time this pipeline level doesn't have left to spend." : undefined,
              gateCheck: { meter: "pipeline", threshold: -5, label: "Pipeline" },
              next: "kantokuenFinalWord46",
              outcome:
                "The more cautious wager: an untested air group's reputation survives intact specifically because it was never tested, a fleet-in-being that costs the resource area's own defense the decisive engagement this operation was supposed to deliver. Whether preserved uncertainty is worth more than a resolved outcome, win or lose, is a trade this command doesn't get to fully evaluate until long after the choice is made.",
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
            "A war fought north before south: Kantokuen chosen over the Southern Operation's original timetable, two sequential wars instead of one, years lost to a front the actual Kwantung Army never crossed the border to fight. There's no historical record past this point. What follows is a closing accounting of what the choice to strike north actually cost, all the way back to a Foreign Minister's alliance with Germany and a summer's gamble on Soviet weakness.",
          choices: [
            {
              label: "Protect the planning staff who championed Kantokuen from any institutional consequence: no reassignment, no board of inquiry, no career cost",
              advisor: { name: "Tojo", quote: "History can judge whether this was the right war to fight first. I will not spend the officers who argued for it as this army's own scapegoats for an argument the whole General Staff, myself included, ultimately approved." },
              setFlags: { kantokuenFinalPath: "heldGround" },
              impact: { readiness: -1, pipeline: -1, initiative: 0 },
              next: "END",
              outcome:
                "Under the Meiji Constitution, the War Minister answered only to the Emperor, never to any civilian government, and the actual Imperial Army had no real tradition of a formal board of inquiry over a strategic judgment call, however costly. That structural fact makes this choice easier than it should be: protecting the planning staff isn't a hard decision inside a system built with no real mechanism for the alternative. It just means the specific officers who argued hardest for striking north keep their postings, their reputations, and every future assignment a court of inquiry never gets convened to threaten.",
            },
            {
              label: "Convene a board of inquiry: name the specific General Staff officers who championed the northern gamble and remove them from further planning authority",
              advisor: { name: "Nagano", quote: "I said in 1941 that Kantokuen solved a problem we did not have. I am not interested in a formal apology from this staff. I am interested in the specific men who argued loudest for it never being trusted with a war plan again." },
              setFlags: { kantokuenFinalPath: "wrongGamble" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "END",
              outcome:
                "An unusual step for an institution with no real tradition of holding a strategic judgment call to formal account: the officers who pressed hardest for Kantokuen are named directly and moved out of further planning authority, not court-martialed, since no real charge exists to bring, but sidelined all the same. The Navy's decade-long argument against a northern war was right, and this entire fork exists to show exactly how right, in the operational detail the historical record never had to provide because Tokyo never actually chose this road. What's different here is that being right costs someone something specific rather than just being noted for the record.",
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
            "With Vichy France in no position to resist, the Army is pushing to occupy the whole of French Indochina rather than the limited northern access already secured, completing the encirclement of the Southern Resource Area's approaches. The Navy has quietly dreaded exactly this move for months: roughly eighty percent of Japan's oil currently comes from the United States, and a full occupation is the single most likely trigger for the total embargo that would make the current supply arrangement irrelevant within eighteen months regardless of anything else that follows.",
          choices: [
            {
              label: "Proceed with the full occupation of southern Indochina",
              advisor: { name: "Tojo", quote: "We have been told for a year that provoking America is the one thing we cannot afford. I would like someone to explain what continuing to wait for an embargo that may come regardless has actually bought us." },
              historical: true,
              setFlags: { indochinaPath: "fullOccupation" },
              impact: { readiness: 0, pipeline: -2, initiative: 2 },
              next: "novemberUltimatum41",
              outcome:
                "By late July 1941 the occupation is complete, and Roosevelt freezes Japanese assets within days, followed within weeks by the full oil embargo the Navy had dreaded. The eighteen-month clock the fleet is already running against starts from this decision as much as from any single choice made after it. The embargo, not Pearl Harbor, is the moment the war's actual deadline gets set.",
            },
            {
              label: "Negotiate limited basing and transit rights instead: stop short of full occupation",
              advisor: { name: "Nomura", quote: "I am the one who has to sit across from Secretary Hull after this decision is made. I am telling you plainly that full occupation forecloses every negotiating option I currently have left." },
              setFlags: { indochinaPath: "limited", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "novemberUltimatum41",
              outcome:
                "A defensible extension of the more cautious path Ambassador Nomura's own cables argued for. Limited transit rights secure much of the practical military value, staging bases within range of Malaya and the Indies, without the full occupation's diplomatic cost, and the embargo this path faces, if it comes at all, arrives later and possibly partial rather than total. Whether Washington reads restraint here as an opening or simply as a slower version of the same expansion is a question Nomura's own cables never answered with confidence, and that's left unresolved here too.",
            },
            {
              label: "Occupy in stages: take key ports and airfields first, hold the rest in reserve as leverage while watching Washington's response",
              advisor: { name: "Konoe", quote: "Learning what this costs us in stages beats finding out all at once. Take what the fleet needs first. See what Washington does before spending the rest of the country." },
              setFlags: { indochinaPath: "staged" },
              impact: { readiness: 0, pipeline: 0, initiative: 0 },
              next: "novemberUltimatum41",
              outcome:
                "A slower approach that never fully commits or fully holds back: key ports and airfields secured immediately, the rest of the colony left formally unoccupied as a card still in hand. Washington's actual response to partial occupation is uncertain, historians of the period are divided on whether a staged approach would have triggered the same freeze order or bought real additional time, and no side is picked here either. What's certain is that this path leaves Tokyo still holding a decision the full occupation had already made for it in the historical record.",
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
            "Secretary of State Hull's latest proposal, already being called the Hull Note inside Imperial Headquarters, demands a complete Japanese withdrawal from China and Indochina in exchange for lifting the embargo. Every faction in the government reads this as functionally an ultimatum, regardless of how Washington frames it diplomatically. Prince Konoe's months-long effort to arrange a direct summit with Roosevelt never produced one; that door is effectively closed. The Imperial Conference has to decide, in the next several days, whether to confirm the war deadline already agreed to in principle, or make one further attempt to extend the negotiating window against odds nobody in the room believes are good.",
          choices: [
            {
              label: "Confirm the deadline: proceed toward the Southern Operation and the opening strike",
              advisor: { name: "Tojo", quote: "The Hull Note has had as careful a reading from me as anyone in this room can claim. It asks us to surrender everything this government has built since Manchuria, unilaterally, on trust. I do not believe further negotiation changes those terms." },
              historical: true,
              setFlags: { novemberPath: "confirmed" },
              impact: { readiness: 0, pipeline: 0, initiative: 1 },
              next: "pearlHarbor41",
              outcome:
                "December 1st, 1941: the Imperial Conference confirms the war decision, formally closing the diplomatic track Nomura and, before him, Konoe had spent most of the year trying to keep open. The fleet that sails for Pearl Harbor a week later does so on a deadline set months earlier and already confirmed, with no room left for improvisation. By the time the strike force is at sea, this decision, more than any single tactical choice, is the one that has already determined the shape of everything that follows.",
            },
            {
              label: "Seek one more extension of the negotiating window",
              advisor: { name: "Togo", quote: "One more extension is unlikely to change Secretary Hull's terms. I believe it is still worth being the government that asked, when history is done deciding who chose this war and who tried not to." },
              setFlags: { novemberPath: "delayed", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 2, initiative: -2 },
              disabledReason: meters.pipeline <= -4 ? "The embargo has already cut too deep to buy with more time. The fleet's reserves force this decision now, whatever the diplomatic calendar would prefer." : undefined,
              gateCheck: { meter: "pipeline", threshold: -4, label: "Pipeline" },
              next: "pearlHarbor41",
              outcome:
                "An honest projection of the position Foreign Minister Togo himself held before ultimately going along with the war decision. An extension buys weeks, not a breakthrough. Hull's terms were never likely to move, and the oil embargo's clock keeps running regardless of how long the Imperial Conference deliberates. What it changes, if anything, is smaller and more internal: a government that visibly asked for more time before choosing war, for whatever that turns out to be worth to the war ministry's hardliners watching this decision closely.",
            },
            {
              label: "Counter-offer a partial withdrawal: pull out of southern Indochina while keeping northern positions and China off the table entirely",
              advisor: { name: "Togo", quote: "Hull is asking for everything. I would like this conference's actual answer, once, to be something other than yes or no to that exact question." },
              setFlags: { novemberPath: "counterOffer", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              disabledReason: meters.pipeline <= -4 ? "The embargo has already cut too deep to spend more weeks on a counter-offer Hull's own position gives little reason to expect will be entertained." : undefined,
              gateCheck: { meter: "pipeline", threshold: -4, label: "Pipeline" },
              next: "pearlHarbor41",
              outcome:
                "A genuine counter-proposal rather than a request for more time, and one Hull's own actual terms gave very little room to accept: partial withdrawal from the exact territory that triggered the embargo, while leaving the China war, the thing the historical Hull Note's harshest language was aimed at, completely untouched. Whether Washington ever seriously weighs a partial offer against the total one it really demanded is a genuine unknown; American policy by this point was built around complete withdrawal as the price of ending the embargo, and a partial counter, however good-faith, was never confirmed to be a door anyone in Washington was still willing to open.",
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
            "The Southern Resource Area, Malaya's rubber and tin, the Dutch East Indies' oil, is the entire point of this war, and the American embargo has left the fleet perhaps eighteen months of oil at current consumption. The question is what to do about the U.S. Pacific Fleet while the Southern Operation unfolds. Yamamoto's staff has spent a year on a single answer: a six-carrier strike on Pearl Harbor, timed to the hour with landings in Malaya and the Philippines, meant to cripple American naval power in the Pacific before it can interfere with the resource-area conquest at all.\n\nYamamoto himself has been blunt in private about what this buys: a year, perhaps two, of a free hand. Not a war America cannot eventually win on production alone.\n\nNagumo's strike force is already at sea under radio silence. The alternative, proposed and rejected months ago but still technically available, is to leave Hawaii alone entirely and commit every carrier to the Southern Operation itself." +
            (flags.novemberPath === "delayed"
              ? " The extra weeks IGHQ asked for at the Imperial Conference didn't move Washington's terms. They also didn't change what happens next."
              : ""),
          choices: [
            {
              label: "Execute the Pearl Harbor strike as planned: six carriers, full surprise",
              advisor: { name: "Yamamoto", quote: "Whatever this morning buys us, it isn't unlimited time. I've told this cabinet before what a protracted war against that industrial base actually looks like. Nothing that happened today changes that math." },
              historical: true,
              setFlags: { openingVector: "pearlHarbor" },
              impact: { readiness: 0, pipeline: 0, initiative: 0 },
              next: "burmaRangoon42",
              outcome:
                "Eight battleships hit at anchor, over 2,400 dead, and total tactical surprise. But the fleet's three carriers were at sea and untouched, and the base's oil tanks and dry docks, arguably worth more than the battleships, went unstruck. Nagumo declined a third strike wave rather than risk his carriers hunting for a fleet he couldn't find. The blow was real. The free hand Yamamoto asked for was granted, with the one asset the next eighteen months would prove decisive left standing.",
            },
            {
              label: "Bypass Oahu entirely: commit every carrier to the Southern Resource Area instead",
              advisor: { name: "Nagano", quote: "Every ship the Navy General Staff sends to Hawaii is a ship not covering Malaya's landings. Take the oil. Leave the Americans a war they haven't decided to fight yet." },
              setFlags: { openingVector: "southBlitz", usCarriersUntouched: true, speculativePath: true },
              impact: { readiness: 1, pipeline: 2, initiative: -1 },
              disabledReason: meters.pipeline <= -3 ? "The Southern Operation can't absorb every carrier at this pipeline level without a Hawaii strike to buy the time the supply chain needs to catch up. There isn't enough slack left for the bet Nagano is proposing." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "unhinderedSouth42",
              outcome:
                "A reasoned projection with real weight behind it. This was argued and lost inside Naval General Staff before Yamamoto's plan carried the day. Without a Hawaii strike, there is no Pearl Harbor to unify American opinion overnight. A Congress that spent 1941 badly divided over intervention in Europe now has to decide, on its own political timetable, whether Japanese landings eight time zones away justify a two-ocean war. The Southern Operation itself runs faster and better-supplied with every carrier committed to it. What America decides to do with a still-intact Pacific Fleet and no morning of infamy to answer is the question the next report has to sit with.",
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
            "Fifteenth Army's drive into Burma is arguably the cleanest strategic objective of the whole Southern Operation: Rangoon's port and the road running north from it are the only route still supplying Chiang Kai-shek's government with Western war material, and cutting it starves China's resistance at the source rather than fighting through it directly. Lieutenant General Iida's divisions are pushing through jungle terrain no prewar staff study rated as passable this fast, racing a mixed British-Indian-Burmese defense and the first Chinese Expeditionary Force divisions Chiang has sent across the border at his own initiative to help hold the road that keeps his government supplied." +
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
              advisor: { name: "Iida", quote: "The road closes the day Rangoon falls, not the day the campaign is declared won. Every week we spend being careful is a week China keeps breathing through a port we could have already taken." },
              historical: true,
              setFlags: { burmaPath: "speed" },
              impact: { readiness: -1, pipeline: 1, initiative: 2 },
              disabledReason: meters.pipeline <= -3 ? "The supply train can't sustain a forced march through this terrain at this pipeline level. A rushed drive here risks stranding the division, not just tiring it." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: flags.openingVector === "southBlitz" ? "washingtonDecides42" : "bataanPOWQuestion42",
              outcome:
                "Rangoon fell on March 8, 1942, faster than British defensive planning had judged possible, and the Burma Road, China's last land connection to Western supply, closed with it. What replaces it is the Hump: transport aircraft flying matériel over the Himalayas at a fraction of the road's capacity, at a cost in aircrew and airframes that becomes its own grinding campaign for the rest of the war.",
            },
            {
              label: "Advance methodically along the coast with naval gunfire support: slower, but preserves the division for the India campaign to come",
              advisor: { name: "Sakurai", quote: "Rangoon will fall either way. I would rather my division still be a division when the harder push into India comes, than a division that spent itself winning a race against a British retreat that was never going to hold the city regardless." },
              setFlags: { burmaPath: "methodical" },
              impact: { readiness: 1, pipeline: -1, initiative: -1 },
              next: flags.openingVector === "southBlitz" ? "washingtonDecides42" : "bataanPOWQuestion42",
              outcome:
                "A reasoned projection built on a tension in Fifteenth Army's actual planning. Speed was chosen historically precisely because Rangoon's port, once lost to demolition, was assumed to be worth little either way, so haste cost less than it seemed to. A slower advance still takes the city, weeks later, having let more of the retreating British-Indian and Chinese forces escape north with their equipment intact, a defensible trade for the harder campaign into Assam this path is quietly better prepared for, bought at the cost of a longer Chinese lifeline this timeline's China gets to keep a little while longer.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Divert divisions earmarked for Burma toward a genuine invasion of Ceylon, over the Army's real historical objection",
                    advisor: { name: "Sugiyama", quote: "The Navy has asked for these divisions three times and I have refused three times, because Burma and the mainland already have more claims on this army than it can honestly satisfy. At this rate of advance, I am no longer certain refusing is the more disciplined position." },
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
            "Fifteenth Army's drive into Burma, thinned by months of transport tonnage diverted to the Australia gamble, is only now getting properly underway, deep into the window the historical campaign actually closed inside of. Rangoon's port and the road running north from it are still the objective; whether they're still worth the same price is a different question. British and Chinese forces have had the better part of a year, not weeks, to reinforce a city the historical Fifteenth Army took before its defenders had time to organize a serious answer." +
            (flags.openingVector === "southBlitz"
              ? " This campaign runs regardless of what happened at Hawaii. Burma was always the Army's war, not the Navy's, and Fifteenth Army's timetable was never built around Pearl Harbor at all, even if this specific timetable has clearly been built around something else instead."
              : "") +
            (flags.australiaResult === "beachhead"
              ? " The Australia gamble that delayed this campaign did buy a real, if brief, beachhead, some return on the tonnage it cost, even if that return has nothing directly to do with the harder fight this thinned-out division is about to have in Burma."
              : " The Australia gamble that delayed this campaign bought nothing: a failed landing, real tonnage spent, and a Fifteenth Army paying for someone else's failure with a Burma campaign this understrength was never supposed to fight."),
          choices: [
            {
              label: "Press the drive at speed regardless of the delay: take Rangoon before the reinforced defense hardens further",
              advisor: { name: "Iida", quote: "We have already lost the window this plan was actually built for. I am not interested in losing the city on top of it by treating a late start as a reason to also be slow." },
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
              advisor: { name: "Sakurai", quote: "This division is already fighting the campaign the plan didn't budget for. I am not going to also ask it to fight fast." },
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
            "Bataan's garrison surrendered on April 9th, and Fourteenth Army's own prewar staff work planned for roughly 40,000 prisoners. What actually surrendered is closer to double that, nearly 78,000 American and Filipino troops, most of them already starving and malaria-ridden after months on quarter rations, with no supply train built to move a number this size and no camp built to hold them. General Homma's own attention is still on Corregidor, whose garrison hasn't surrendered yet and whose guns can still reach the strait his supply lines need. Colonel Kawane's transport command and the division-level field officers already handling Bataan's surrender are the ones who will actually decide, hour to hour, how nearly 78,000 men move sixty-some miles to the rail line at San Fernando. What Homma does with that gap between his own attention and theirs is the real decision in front of him.",
          choices: [
            {
              label: "Leave transport arrangements to Kawane's command and the field officers already on the ground: keep personal attention on Corregidor's guns",
              advisor: { name: "Homma", quote: "Corregidor is the position that still threatens this army's own supply line. Bataan has already surrendered. I am not persuaded that where my attention belongs is a question with two right answers." },
              historical: true,
              setFlags: { bataanPath: "delegated" },
              impact: { readiness: 1, pipeline: 0, initiative: 1 },
              next: "doolittleRaid42",
              outcome:
                "What actually happened. Roughly 78,000 men move on foot and by rail toward Camp O'Donnell over the following week, under guards who, in the words of one of Homma's own staff officers after the war, held prisoners of war in an regard that was \"thin\" throughout the command, and under a supply and medical plan built for half their number. Somewhere between six and ten thousand die before the march ends, from beating, exhaustion, disease, and simple neglect, a death rate the war's own POW statistics bear out more broadly: roughly two in five Americans held by Japan through the whole war never came home, against roughly one in eighty held by Germany. The single worst atrocity of the march, several hundred surrendered Filipino officers and NCOs executed near the Pantingan River, happened on the explicit initiative of Colonel Masanobu Tsuji, acting against Homma's own stated wish that the prisoners be moved without incident. Whether a commander who never personally ordered any of it, and who left one officer's actual atrocity to be discovered only after the war, bears command responsibility for what his own delegated authority produced is the exact question Homma's own war crimes tribunal spent months arguing over four years later.",
            },
            {
              label: "Personally order humane transport standards for the entire march, backed by real enforcement down the chain of command",
              advisor: { name: "Homma", quote: "Corregidor can wait a week for the attention this actually requires. Seventy-eight thousand men is not a number this command gets to treat as someone else's administrative problem." },
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
                    "A direct, personally-attached order, checked rather than merely issued, changes real outcomes even without changing the underlying supply crisis: exhaustion, disease, and a march built for half this many men still kill a real number of prisoners, but the specific, deliberate cruelties the historical march became known for, summary execution among them, don't happen at anything like the same scale. A command that took its own stated intent seriously enough to enforce it still isn't a command that solved a logistics problem it never had the trucks or the rail capacity to solve.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The order gets undermined at the field level regardless",
                  setFlags: { bataanResult: "orderDefied" },
                  impact: { readiness: -2, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier failure mode, and the one the actual historical record already demonstrates once: an order from Manila doesn't reliably survive contact with a field officer who disagrees with it. Colonel Tsuji executed several hundred surrendered Filipino officers at the Pantingan River specifically against Homma's real, stated wish that the march proceed without incident, a defiance no order this command issues from further up the chain is guaranteed to prevent. What changes is that this command's own paper trail now shows an explicit humane order defied, rather than an absence of one, a distinction that matters enormously to history and not at all to the men marching.",
                },
              ],
              outcome:
                "A command decision that costs Corregidor's siege real attention and time in exchange for treating Bataan's aftermath as this command's direct responsibility rather than a delegated administrative detail. Whether that attention translates into anything the men actually marching would notice depends on whether an order from Manila can survive officers in the field who don't share it, the same question Homma's own defense would spend years arguing at his war crimes tribunal.",
            },
            ...(meters.pipeline >= 6
              ? [
                  {
                    label: "Divert real transport capacity, trucks and rail cars pulled from Corregidor's own siege supply, to actually move this many men rather than just order it",
                    advisor: { name: "Kawane", quote: "An order solves nothing if the trucks don't exist. Give this command the transport capacity the actual number of prisoners requires, and the order enforces itself." },
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
            "Sixteen twin-engine Army bombers, launched from a carrier deck far outside any range that should have been possible, have just dropped bombs on Tokyo, Yokohama, and three other cities. Physically inconsequential, seven people killed, a handful of buildings damaged, and yet the single most acutely embarrassing moment of the war for Imperial Headquarters so far. The home islands were supposed to be inviolate. Naval General Staff had assured the Emperor personally that no enemy aircraft could reach Tokyo. The question isn't how to answer the raid militarily, there's nothing left of it to answer, but what its existence changes about how urgently the gap that let it happen needs closing." +
            (flags.ceylonPath === "invade"
              ? " The timing could not be worse: the divisions and the fleet attention an actual Ceylon invasion demands are exactly what a homeland already this embarrassed would like back, and there is no honest way to have both a serious Indian Ocean campaign and a full-throated response to a raid that reached the Emperor's own capital."
              : ""),
          choices: [
            {
              label: "Treat it as confirmation that Midway must proceed on the accelerated timetable Yamamoto's staff has been pushing for",
              advisor: { name: "Yamamoto", quote: "Months of being told this operation can wait, and fifteen minutes over Tokyo has just answered that argument better than I could." },
              historical: true,
              setFlags: { doolittlePath: "accelerate" },
              impact: { readiness: 0, pipeline: 0, initiative: 2 },
              next: "doolittleAirmen42",
              outcome:
                "What happened, more or less. The raid didn't invent the case for Midway, Yamamoto had been arguing for it regardless, but it gave the plan's remaining skeptics inside Naval General Staff nothing left to say, and Imperial Headquarters approves the operation within days on a timetable that leaves little room to properly integrate Coral Sea's lessons before the fleet sails again.",
            },
            {
              label: "Treat it as a propaganda embarrassment, not a strategic one: decline to let it accelerate operations already running on their own schedule",
              advisor: { name: "Nagano", quote: "Sixteen bombers that could not find their own landing fields are not evidence of a strategic gap. I would rather fix this problem with better picket coverage than with an operation rushed to prove a point." },
              setFlags: { doolittlePath: "measured" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              disabledReason: meters.pipeline <= -3 ? "There isn't the picket-boat and reconnaissance capacity left to fix this gap properly. The measured response Nagano wants requires resources this pipeline level doesn't have." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "doolittleAirmen42",
              outcome:
                "A plausible extension of the more skeptical position that existed inside Naval General Staff before the raid's psychological shock overrode it. The raid killed almost nobody and destroyed almost nothing, and a slower, better-prepared response to the carrier-threat gap it exposed is a defensible read of the military stakes involved. What it costs is exactly the sense of urgency that, in the historical record, pushed an operation through real reservations in record time; without that shock, Midway's planning gets the additional weeks its critics wanted, for whatever that turns out to be worth.",
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
            "Eight of the raid's eighty airmen were captured after their aircraft went down in Japanese-held China. A military tribunal has now tried them, without meaningful defense, on a charge unrelated to combat: strafing civilians during the raid, an accusation the crews themselves deny and that no independent evidence supports. The tribunal has returned death sentences for all eight, and the decision of whether to carry them out, and how many, sits with Imperial Headquarters. A separate decision, already made and already underway regardless of what happens to these eight men, is General Hata's China Expeditionary Army advancing into Zhejiang and Jiangxi, the provinces where villagers sheltered the raid's other crews. Estimates of the campaign's civilian death toll vary widely, from the tens of thousands into the hundreds of thousands; no accounting was ever made precise enough to settle the range. What isn't in dispute is the method: entire villages held collectively guilty for the aid given to American airmen, regardless of whether any individual villager had actually given it." +
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
              advisor: { name: "Tojo", quote: "The tribunal has ruled. I am not going to be the officer who overturns a military court's finding on airmen accused of striking noncombatants, whatever doubt exists about the specific charge." + (flags.novemberPath === "confirmed" ? " I confirmed the war deadline once already. I don't reverse decisions because they've become uncomfortable." : "") },
              historical: true,
              setFlags: { doolittleAirmenPath: "executed" },
              impact: { readiness: 0, pipeline: 0, initiative: 0 },
              next: "coralSea42",
              outcome:
                "Three of the eight are executed by firing squad; the Emperor commutes the remaining five death sentences to life imprisonment, one of whom dies of malnutrition and dysentery in captivity before the war ends. The charge underlying the tribunal's verdict, strafing civilians, was never substantiated by evidence beyond the tribunal's own finding. Zhejiang and Jiangxi burn regardless of this decision, a punishment aimed at villagers who sheltered crews with no connection to the eight men this tribunal actually reached.",
            },
            {
              label: "Overturn the tribunal: hold the captured airmen as conventional prisoners of war instead",
              advisor: { name: "Nagano", quote: "I have not seen evidence for the charge beyond the tribunal's own say-so. I am not comfortable executing men on a finding this thin, whatever it costs this command to say so publicly." },
              setFlags: { doolittleAirmenPath: "pow", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 0, pipeline: 0, initiative: -1 },
              next: "coralSea42",
              outcome:
                "A reasoned projection built on the actual thinness of the evidence the historical tribunal relied on. Treating the airmen as conventional prisoners of war costs this command nothing strategically and denies the war ministry's hardliners a propaganda execution they otherwise get to use domestically as proof of resolve. It doesn't undo what already happened to Tokyo's air defense credibility, and it doesn't touch Zhejiang and Jiangxi, where Hata's campaign against the villages that sheltered other crews proceeds on its own separate order, untouched by whatever mercy this tribunal shows the eight men actually in its custody.",
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
            "The Southern Operation has run ahead of every prewar estimate. Malaya, the Indies, Burma, all fallen faster than staff planning assumed. Port Moresby, on Papua's southern coast, is the next objective: taken, it puts northern Australia inside bomber range and closes the ring around the Coral Sea. A light carrier task force already covers the invasion convoy. The problem is that American codebreakers appear to have read enough traffic to have carriers of their own waiting, Yorktown and Lexington, confirmed by contact reports, in a sea fight neither side quite planned to have yet.\n\nLexington goes down and Yorktown limps away damaged in the exchange, but two fleet carriers, Shokaku and Zuikaku, take losses of their own: one damaged, both with air groups gutted badly enough that neither will be ready for whatever comes next. That absence is the real cost of this battle, and it's a cost paid before the next decision is even on the table.",
          choices: [
            {
              label: "Accept the decisive battle Yamamoto wants: commit the fleet toward Midway",
              advisor: { name: "Yamamoto", quote: "The Pacific Fleet's carriers are still afloat. Every month they stay afloat is a month closer to the moment America's shipyards make this war unwinnable. I want them at the bottom of the ocean before that month arrives." },
              historical: true,
              setFlags: { coralSeaPath: "midway" },
              impact: { readiness: -1, pipeline: 0, initiative: 1 },
              next: "midway42",
              outcome:
                "Shokaku and Zuikaku's air groups, mauled at Coral Sea, are judged not ready in time, and the Midway strike force sails at four fleet carriers instead of the six Yamamoto's plan assumed. Nobody at Combined Fleet headquarters treats this as the decisive fact it will turn out to be.",
            },
            {
              label: "Consolidate: hold what the Southern Operation has already won and decline further overextension",
              advisor: { name: "Inoue", quote: "More than the plan asked for is already ours. Every mile further from Truk is a mile the supply line has to be defended, not just extended." },
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
                    "Inoue's argument holds up better than Combined Fleet staff expected. A defensible perimeter, atoll by atoll, is a really expensive thing for an impatient American public to keep paying for, and for now the isolationist arithmetic Yamamoto worried about is cutting Japan's way rather than against it.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "America doesn't tire",
                  setFlags: { coralSeaPerimeterBet: "impatient" },
                  impact: { readiness: -1, pipeline: -1, initiative: -1 },
                  outcome:
                    "Inoue's bet doesn't pay off. American production and public will both prove considerably more patient than Fourth Fleet staff hoped, and the perimeter Japan dug in to defend becomes exactly the string of costly, grinding fights this consolidation was meant to avoid, just spread over more years instead of fewer.",
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
            "Four fleet carriers, Akagi, Kaga, Soryu, Hiryu, approach Midway atoll under Nagumo, built around a plan meant to draw the Pacific Fleet's remaining carriers into a battle Japan's superior numbers should win decisively. What the plan doesn't know is that American cryptanalysts have broken enough of the naval code to have identified Midway as the target weeks in advance, and that Yorktown, officially requiring ninety days of repair after Coral Sea, was patched enough in seventy-two hours at Pearl Harbor to sail as a third carrier nobody in this plan is expecting.\n\nAn alternative, argued and shelved months ago inside Naval General Staff, would have sent the carrier force against Fiji and Samoa instead, cutting the sea lanes between America and Australia rather than seeking a fleet engagement at all. That option no longer exists on its own terms; the fleet has already sailed toward Midway. What remains open is how hard to press the search for the American carriers everyone assumes aren't there yet." +
            (flags.doolittlePath === "measured"
              ? " This plan has the extra weeks its skeptics wanted after the Tokyo raid. Whether that changes anything about what Nagumo's search radars actually find today is a different question entirely."
              : "") +
            (flags.forkYorktownDelayed
              ? " Naval Intelligence's unconfirmed reports of trouble in the American repair yards, if accurate, would mean whatever carrier force is out there tonight is thinner than this plan's own assumptions account for."
              : ""),
          choices: [
            {
              label: "Proceed with the plan as built: full commitment to the Midway invasion and the decisive battle it's meant to force",
              advisor: { name: "Nagumo", quote: "We proceed on the assumption already built into this plan: no American carriers within range. If that assumption is wrong, we will know soon enough, and by then it may already be too late to matter." },
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
                    "The rarest realistic roll of this actually contested morning: American search planes miss the Japanese carriers in the crucial early hours, and Nagumo's own strike force catches Yorktown, Enterprise, and Hornet on their own decks rearming when his dive bombers arrive instead. This is the most speculative branch of the whole battle. Serious historians of Midway, Parshall and Tully's Shattered Sword chief among them, have argued the historical outcome turned on minutes and reconnaissance luck rather than an overdetermined American advantage, which is what makes this outcome defensible as honestly contested rather than invented. It is still, honestly, the least likely of this morning's three possible dawns." +
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
                    "The dice of this contested morning land better than the historical record: American dive bombers catch the carriers mid-rearming but the damage-control parties get fires under control before the magazines go. Two carriers are lost rather than four, a survivable defeat, and the fleet retreats with something left to fight another campaign with. Historians who've always argued the historical outcome hinged on minutes, not strategy, get to say the minutes could have gone either way.",
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
                    "American dive bombers arrive in the single window when all four Japanese carriers have munitions and fuel exposed on open flight decks, mid-changeover between a land-attack strike and a naval one. Akagi, Kaga, and Soryu are burning within six minutes of each other; Hiryu survives long enough to cripple Yorktown before going down herself that evening. Four fleet carriers and most of their trained air crews, the hardest asset in this war to replace, are gone in an afternoon.",
                },
              ],
            },
            {
              label: "Redirect at sea: abandon the Midway plan, commit the carrier force to the Fiji-Samoa supply line operation instead",
              advisor: { name: "Ugaki", quote: "Cut the road between America and Australia and every reinforcement MacArthur is promised has to sail around a war zone instead of through one. That is a slower war to win. It is also a war where our carriers are not required to fight where the enemy has already read our mail." },
              setFlags: { midwayPath: "diverted", suspicion: (flags.suspicion || 0) + 1, speculativePath: true },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "severSupplyLine42",
              outcome:
                "A reasoned projection of the operation Naval General Staff actually favored before Yamamoto's insistence on a decisive battle won out. Without foreknowledge of American codebreaking, this reads at the time as caution rather than the war-saving decision it may be: the fleet that could have been destroyed at Midway sails instead against lightly defended island garrisons in the South Pacific, degrading the Australia supply line without risking a single fleet carrier against an enemy who, though this command has no way to know it, was waiting at the one place this fleet chose not to go.",
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
            "With the Pacific Fleet's carrier force destroyed in a single morning, Combined Fleet staff are entertaining, for the first time without immediately dismissing it, an idea that had been raised and quietly shelved months earlier as fantasy: a follow-on strike against Hawaii itself, perhaps even an invasion attempt, while the American Pacific Fleet has nothing left afloat to contest it. Army planners, consulted only briefly and clearly unhappy about it, are already objecting on grounds that don't depend on how the naval battle went at all: Japan has no five spare divisions and nothing close to the troop transport capacity an actual invasion and occupation of Hawaii would require, decisive naval victory or not. The Army's logistical objection is plainly the correct one regardless of which choice gets made here; what's being decided is how much this navy indulges the fantasy before returning to what it can accomplish.",
          choices: [
            {
              label: "Push toward Hawaii: commit to raids and reconnaissance in force, testing exactly how far this advantage extends",
              advisor: { name: "Ugaki", quote: "Holding Hawaii is not realistic. I believe we can make the Americans spend the next six months finding that out for themselves, which may be worth nearly as much." },
              setFlags: { ascendantPath: "pressHawaii" },
              impact: { readiness: -2, pipeline: -3, initiative: 3 },
              disabledReason: meters.pipeline <= -3 ? "There isn't fuel for a sustained raiding campaign this far from any friendly base. Whatever this advantage is worth, it isn't worth spending on a reach this long at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "aPacificWonTwice43",
              outcome:
                "The most speculative endpoint reached so far. A sustained raiding campaign against Hawaii, absent any real invasion capacity, buys psychological and reconnaissance value without the territory to show for it, and burns fuel and aircrew this navy has no surplus of even after Midway's reversal. Serious historians of Japanese wartime logistics are essentially unanimous that an actual occupation was never within reach at any point in the war; what's speculative is only how much strategic value a raiding-without-holding campaign might have extracted from a Pacific Fleet with no carriers left to answer it, and what Japan does with that extracted time is a question the next chapter has to answer.",
            },
            {
              label: "Consolidate the win: use the destroyed American carrier force to guarantee the Southern Operation's flank, without chasing the Hawaii fantasy",
              advisor: { name: "Yamamoto", quote: "I have wanted this fleet destroyed since the day I planned the attack that was supposed to buy us the year it just bought us twice over. I am not going to spend that gift chasing an island we cannot hold and do not need." },
              setFlags: { ascendantPath: "consolidate" },
              impact: { readiness: 1, pipeline: 1, initiative: 0 },
              next: "aPacificWonTwice43",
              outcome:
                "The more disciplined choice, and the one this Yamamoto, consistently written as privately skeptical of overreach, would plausibly have made. The Southern Operation's resource area is secured against any near-term American naval response for the first time since the war began, and the fleet keeps what a total, honestly won victory should buy: time. What Japan does with a year or two of uncontested Pacific waters, rather than the eighteen months Yamamoto originally asked for, is the question the next chapter has to answer.",
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
            "A year into a Pacific Fleet that never recovered from Midway's reversal in this history, Japan has uncontested waters for the first time since the war began, and American shipyards are still building regardless, on a timeline this decisive-Midway-win premise never had the power to interrupt. A tactical outcome as favorable as this one gets still meets an industrial capacity that was never primarily a function of any single naval battle. IGHQ has a genuine choice about what a won war in the Pacific's first year is really worth spending on next.",
          choices: [
            {
              label: "Press the advantage into the Indian Ocean: coordinate with German efforts against British supply lines while the free hand lasts",
              advisor: { name: "Ugaki", quote: "We have the ocean to ourselves for the first time this war. I would rather spend that on something that helps a war we're actually fighting alongside, not just a defensive perimeter." },
              setFlags: { pacificWonPath: "indianOcean" },
              impact: { readiness: -2, pipeline: -1, initiative: 2 },
              disabledReason: meters.pipeline <= -2 ? "The Indian Ocean is too far to sustain a fleet operation at this pipeline level. Whatever this free hand is worth, it isn't worth spending on a voyage this force can't fuel both ways." : undefined,
              gateCheck: { meter: "pipeline", threshold: -2, label: "Pipeline" },
              next: "theRommelQuestion43",
              outcome:
                "A genuine attempt at the kind of Axis coordination that never meaningfully happened in the historical war, Japanese naval pressure in the Indian Ocean, timed against German operations in North Africa and the Middle East, is the closest thing to the two-front Allied nightmare occasionally raised in period what-if speculation. Whether Berlin actually has anything worth coordinating with by the time this fleet arrives is the next question, not this one's.",
            },
            {
              label: "Turn the free hand entirely inward: use the time to harden the resource area against the war everyone still expects eventually",
              advisor: { name: "Yamamoto", quote: "A year with nobody shooting at this fleet is worth more spent making the perimeter unbreakable than spent chasing a coordination with Berlin we have never actually managed to build." },
              setFlags: { pacificWonPath: "harden" },
              impact: { readiness: 2, pipeline: 1, initiative: -1 },
              disabledReason: meters.readiness <= -4 ? "There isn't the organizational capacity left to execute a full perimeter-hardening program at this readiness level. The resource area holds what it already has, nothing more." : undefined,
              gateCheck: { meter: "readiness", threshold: -4, label: "Readiness" },
              next: "theMainlandCrisis44",
              outcome:
                "The more disciplined use of a rare asset: a won year, spent making the existing resource empire harder to crack rather than reaching for a wider coordination this war's actual alliance structure never supported. It's also, honestly, the least dramatic use of the most speculative kind of win on offer: a Pacific War that reaches its later years from a stronger defensive position, still facing the same American production curve every other path eventually has to reckon with in some form.",
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
            "A Japanese naval squadron reaches the Indian Ocean prepared to coordinate against British supply lines feeding the Middle East and North Africa, and finds a German war that has already lost the argument this coordination was meant to help win. El Alamein broke Rommel's advance in late 1942, and by the time this fleet is on station, the Afrika Korps is in retreat rather than in a position to exploit any pressure Japan applies to British shipping. The coordination this path chose to attempt arrives at a war Germany was already losing, not a war a joint push could still turn.",
          choices: [
            {
              label: "Press on regardless: degrade British shipping in the Indian Ocean even without a German offensive to support",
              advisor: { name: "Ugaki", quote: "Rommel's retreat does not make British supply lines through this ocean any less worth cutting. We are here. I would rather use the fleet than turn it around over timing we could not have controlled." },
              setFlags: { rommelPath: "pressAnyway" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: "theMainlandCrisis44",
              outcome:
                "The squadron degrades British shipping through the Indian Ocean on its own terms, a modest achievement that doesn't change the Mediterranean war's already-settled trajectory. The coordination Ugaki wanted never had a German partner capable of using it by the time Japan's fleet was in position to offer it.",
            },
            {
              label: "Recall the fleet: a coordination this late, against a losing partner, isn't worth the fuel",
              advisor: { name: "Yamamoto", quote: "This coordination did not strike me as workable when it was proposed, and a losing partner does not change that answer. Bring the fleet home before we spend more on it." },
              setFlags: { rommelPath: "recall" },
              impact: { readiness: 1, pipeline: 1, initiative: -1 },
              disabledReason: meters.pipeline <= -5 ? "There isn't fuel for a clean withdrawal from this distance at this pipeline level. Whatever this squadron does next, an orderly recall isn't an option anymore." : undefined,
              gateCheck: { meter: "pipeline", threshold: -5, label: "Pipeline" },
              next: "theMainlandCrisis44",
              outcome:
                "The fleet turns back rather than commit further fuel to a coordination that arrived too late to matter, a quieter, more honest ending to the most speculative attempt at genuine Axis strategic partnership than the historical alliance, which never got this far in the first place, ever had to reckon with.",
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
            "Naval General Staff knows what the public doesn't: four fleet carriers and most of a generation of trained naval aviators are gone, concealed behind a communique describing a victory. Japan still holds the Philippines, Malaya, the Indies, Burma, and most of the Southern Resource Area outright. Roosevelt's unconditional surrender doctrine won't be declared at Casablanca until January 1943, seven months from now. For a brief window, a negotiated peace has something real to offer in exchange for it, and there's no war ministry alive that has ever asked the question about to be asked on its behalf.",
          choices: [
            {
              label: "Treat Midway as a setback to route around: the war continues on its original premise",
              advisor: { name: "Tojo", quote: "We have lost four carriers, not the war. I am not going to let one afternoon's misfortune become the argument for abandoning everything this government committed to in December." },
              historical: true,
              setFlags: { earlyPeacePath: "fightOn" },
              impact: { readiness: -1, pipeline: 0, initiative: 1 },
              next: "kokodaTrail42",
              outcome:
                "This negotiating position, the strongest of the entire war, goes unused, and the war continues on its original timetable toward three more years of grinding attrition.",
            },
            {
              label: "Explore a negotiated exit now, while the territorial position is still real leverage rather than a memory",
              advisor: { name: "Yonai", quote: "I opposed this war before it started because I did not believe it winnable on the terms it was fought for. I do not believe four lost carriers change that argument. I believe they finally make it possible to say out loud." },
              setFlags: { earlyPeacePath: "explore", suspicion: (flags.suspicion || 0) + 2 },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "earlyPeaceChannel42",
              outcome:
                "Yonai's real, well-documented skepticism about the war finally has somewhere to go. Whether it survives contact with Tokyo's own war ministry, let alone with Washington, is the next question.",
            },
            ...(meters.readiness >= 3 && meters.pipeline >= 3
              ? [
                  {
                    label: "Explore a negotiated exit backed by genuine strength, not just an intact map: a Japan that has managed this war well has more to offer than territory alone",
                    advisor: { name: "Yonai", quote: "Every version of this argument I have made, I made while this staff privately believed there was nothing behind it but a hope Washington would take pity on a war we were already losing. That is not what I am asking anyone to believe this time." },
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
            "Yonai's channel through neutral Switzerland carries a really different offer than the historical war ministry, even in its most doveish moments, ever had the material position to make: not a plea to bank wartime gains before they slip away, but a proposal from a Japan that has managed its logistics and its military readiness well enough, this deep into the war, that the offer reads as strength rather than an early admission of eventual defeat. There is no historical precedent for how Washington receives an approach like this, history's own war ministry never had a position strong enough to produce one.",
          choices: [
            {
              label: "Offer genuine, substantial withdrawal from China in exchange for a negotiated peace recognizing the rest",
              advisor: { name: "Togo", quote: "China is the concession that costs the war ministry something to offer, which is exactly why it's the one worth offering. A peace bought with something real is a peace that might really hold." },
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
                    "The rarest, most consequential branch on offer: a substantial China withdrawal, paired with a war effort visibly strong enough that the offer can't be read as desperation, is enough to bring Washington to the table in earnest.",
                },
                {
                  weight: (() => { const w = modWeight(25, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "Washington reads the offer as leverage to extract more, not a genuine opening",
                  setFlags: { strongerHandResult: "exploited" },
                  impact: { readiness: -1, pipeline: -1, initiative: -2 },
                  next: "kokodaTrail42",
                  outcome:
                    "The likelier outcome, and the one serious historians of Roosevelt's actual wartime diplomacy would expect: an offer this far ahead of anything Japan has proposed before reads to Washington as evidence of weakness worth pressing rather than strength worth respecting, and the administration uses the opening to extract a harder line rather than meet it partway. The war continues, the China concession spent for a negotiating position that didn't hold.",
                },
              ],
              outcome:
                "A reasoned projection built on a genuine uncertainty about wartime diplomacy that historians still argue over: whether a substantial, credible peace offer from a position of real strength, rather than one obviously built on desperation, could have found a more receptive Washington than the historical war ministry's own far weaker overtures ever tested. Roosevelt's actual unconditional surrender doctrine was still seven months from being declared at Casablanca; whether it would have been declared at all against an adversary negotiating from strength instead of exhaustion is a counterfactual worth raising honestly without resolving with false confidence.",
            },
            {
              label: "Hold the current territorial line as the offer: no further concessions, take the map as it stands or reject it",
              advisor: { name: "Nagano", quote: "A decade of arguing this navy needed the resource area, not the mainland, and I am not going to spend what we actually fought for on a concession that was never the point of this war to begin with." },
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
                    "The rarer outcome, and the harder ask to have paid off: a war effort visibly strong enough to make the line credible, without China spent as a further concession to sweeten it. Washington, unable to fully dismiss a position this intact, agrees to test it at the table.",
                },
                {
                  weight: (() => { const w = modWeight(15, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "Washington tests the line and finds it bluffable",
                  setFlags: { strongerHandResult: "exploited" },
                  impact: { readiness: -1, pipeline: -1, initiative: -2 },
                  next: "kokodaTrail42",
                  outcome:
                    "The likelier outcome: a firmer ask than Togo's own instinct favored reads to Washington as exactly the kind of position worth testing rather than accepting, and the administration presses rather than meets it partway. The war continues on largely its original terms, the harder line never actually validated at a table that never fully convened.",
                },
              ],
              outcome:
                "A harder negotiating position than Togo's own instinct favored, betting that a well-managed war effort is leverage enough on its own without spending China as a further concession. Whether that calculation holds against an American administration with every reason to test how firm this line actually is, rather than accept it at face value, is exactly the kind of question serious historians of the period still argue over.",
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
            "There is no historical precedent for negotiations at this stage: State Department officials, working through the Swiss channel with instructions that keep changing as Washington actually processes the credibility of Tokyo's offer, are asking questions the historical war never reached anyone qualified to answer. China's withdrawal terms are broadly agreed in principle. What isn't settled is the harder question underneath it: how much of the Southern Resource Area, the Indies' oil, Malaya's rubber, the Philippines, Japan gets to keep, and on what timeline the rest reverts.",
          choices: [
            {
              label: "Accept a phased withdrawal from the Philippines and Malaya, retaining the Indies as the core of a smaller, negotiated resource sphere",
              advisor: { name: "Togo", quote: "Every territory this war seized, and a peace on top of it, is not an offer coming our way. I would rather keep the resource area that justified this war and let the rest go, than lose the negotiation trying to keep all of it." },
              setFlags: { peaceShapePath: "phasedWithdrawal" },
              impact: { readiness: 1, pipeline: 2, initiative: -1 },
              next: "END",
              outcome:
                "A settlement built on the same resource logic Nagano and the Navy argued for since before this war started: the oil and rubber the Southern Resource Area was fought for, retained under a negotiated arrangement rather than seized outright, while the Philippines and Malaya revert on a phased timeline neither side's actual historical position ever had reason to negotiate. It is not the war Japan set out in 1941 to win. It is a war that ends in 1942, on terms a strong hand bought that exhaustion alone never could have, three years and everything they cost never happening at all.",
            },
            {
              label: "Hold out for retaining the Indies and the Philippines both, offering only Malaya's withdrawal as the further concession",
              advisor: { name: "Nagano", quote: "The Philippines cost the Navy nothing to take and would cost this negotiation everything to give up without a fight. I would rather test how much this position is really worth before assuming the answer." },
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
                    "The harder ask pays off. Washington, having already decided the credibility of this negotiation is worth preserving, doesn't walk away over the Philippines rather than reopen a war it had genuine reason to believe was actually ending. The 1942 peace holds a broader Japanese sphere than the more modest offer would have settled for, a rarer outcome within an already rare ending.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "Washington's patience for the broader ask runs out",
                  setFlags: { peaceShapeResult: "collapsed" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier outcome: holding out for more than China and a modest withdrawal costs the negotiation the credibility it needed to survive contact with an American administration that was never obligated to keep testing an offer that kept growing more ambitious. The channel goes quiet, and the war Yonai's whole argument was built to end continues on a timetable this attempt never managed to actually shorten.",
                },
              ],
              outcome:
                "A more ambitious position than Togo's own instinct favored, testing how much a honestly strong hand is actually worth rather than settling for the first terms credible enough to be taken seriously. Whether Washington's patience for an offer that keeps asking for more survives the asking is a real, unresolved question this negotiation is about to answer one way or the other.",
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
            "Yonai's contacts run through neutral Switzerland, the same channel Allen Dulles's OSS station in Bern will later use for real, documented European peace contacts. The approach is deliberately vague: an inquiry about what general terms might even be theoretically discussable, not a formal offer. Two obstacles stand regardless of how carefully it's worded. The American public's mood after Pearl Harbor was never a secret, and Guadalcanal is a month away. Washington's own read on a Japan still holding the entire resource area gives it very little reason to treat any overture as desperation rather than an attempt to bank wartime gains at the table.",
          choices: [
            {
              label: "Open the channel anyway: even a rejected overture establishes there was one",
              advisor: { name: "Togo", quote: "Washington answering generously is not something I expect. I expect, if this is ever written down honestly, for it to matter that Japan asked before the alternative was two cities and an invasion nobody could stop." },
              setFlags: { earlyPeaceChannelPath: "press" },
              impact: { readiness: 0, pipeline: 0, initiative: -1 },
              next: "earlyPeaceOutcome42",
              outcome:
                "The inquiry goes forward and goes nowhere. Washington reads it exactly as the obstacles predicted: an attempt to bank gains through the table rather than concede them on the battlefield, from a government still holding everything it invaded eight months ago.",
            },
            {
              label: "Withdraw the inquiry before it reaches anyone who might leak it: the domestic risk outweighs the diplomatic upside",
              advisor: { name: "Nagano", quote: "If this becomes known inside the war ministry before it becomes known in Washington, the channel does not matter. What matters is who moves against Yonai first." },
              setFlags: { earlyPeaceChannelPath: "withdraw", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "earlyPeaceOutcome42",
              outcome:
                "The inquiry is quietly shelved before it reaches Bern in any form Washington could act on. Not a rejected offer. One that never fully left the building.",
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
            "Whether pressed or withdrawn, the 1942 peace channel changes nothing about the arithmetic the rest of this war runs on: American industrial capacity and the Manhattan Project were never contingent on a single overture this early. What it changes is smaller and, in its own way, harder to let go of: someone, inside this government, finally asked the question three years before history's version of the same government asked it." +
            (flags.earlyPeaceChannelPath === "press"
              ? " This particular someone pressed the channel even expecting rejection, on the theory that a rejected overture on the record still counts for something a silent one never could."
              : flags.earlyPeaceChannelPath === "withdraw"
              ? " This particular someone withdrew rather than press a channel already expected to fail, on the theory that a quiet retreat costs less than a rejection this government would have had to answer for."
              : ""),
          choices: [
            {
              label: "Let the record show the question was asked early, whatever else follows from here",
              advisor: { name: "Yonai", quote: "Ending the war in 1942 was never the expectation here. I expected it to mean something, eventually, that someone asked in 1942 rather than 1945." },
              setFlags: { earlyPeaceFinalPath: "askedEarly" },
              impact: { readiness: 0, pipeline: 1, initiative: -1 },
              next: "END",
              outcome:
                "An early question, asked and unanswered, that changes nothing about where this war ends and everything about how it's remembered inside the room where it was asked. A Midway disaster met with genuine reconsideration instead of reflexive continuation.",
            },
            {
              label: "Close the thread here and let the historical war simply resume",
              advisor: { name: "Tojo", quote: "Whatever was asked or not asked in the summer of 1942, this government is fighting the war it committed to fighting. I do not see what continuing to look backward at a closed channel accomplishes now." },
              setFlags: { earlyPeaceFinalPath: "resumed" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: "END",
              outcome:
                "The war resumes on its historical footing, the 1942 channel a closed, unrepeated experiment. What it cost, in readiness and initiative both, is the price of a summer spent on a question this government was never institutionally built to ask.",
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
            "With the seaborne invasion of Port Moresby stopped at Coral Sea, Major General Horii's South Seas Detachment is attempting the only alternative left: an overland march across the Owen Stanley Range, along a single foot-track through some of the most difficult terrain of the entire war, carrying supplies on human backs because no vehicle can follow where this track goes. The detachment has pushed to within thirty miles of Port Moresby, closer than any Japanese force gets to Australian territory at any point in the war, but the supply line behind it, already stretched past what mountain porters can sustain, is failing faster than the advance itself.",
          choices: [
            {
              label: "Press the final push toward Port Moresby despite the supply collapse behind it",
              advisor: { name: "Horii", quote: "We have come further than any staff estimate believed possible. I am not prepared to be the officer who turns back thirty miles from the objective because a supply line built for half this distance is now failing." },
              historical: true,
              setFlags: { kokodaPath: "press" },
              impact: { readiness: -3, pipeline: -3, initiative: 1 },
              disabledReason: meters.pipeline <= -2 ? "There's no tonnage left to carry further up a track porters are already failing to supply. The push cannot be sustained, only ordered." : undefined,
              gateCheck: { meter: "pipeline", threshold: -2, label: "Pipeline" },
              next: "guadalcanal42",
              outcome:
                "IGHQ halts the advance by order in September, not by Australian resistance alone but by a supply situation judged unsustainable regardless of how the fighting was going, and the detachment's subsequent withdrawal back across the same mountains it had just crossed becomes its own grinding catastrophe: starvation, disease, and a fighting retreat that costs nearly as many men as the advance itself. Horii drowns crossing a river during the retreat. Of the roughly 13,000 men committed across the whole campaign, fewer than half remain fit to fight by the time it ends.",
            },
            {
              label: "Order an earlier withdrawal: preserve the detachment before the supply line fully collapses",
              advisor: { name: "Imamura", quote: "Thirty miles from an objective we cannot supply is not thirty miles closer to winning it. I would rather have a South Seas Detachment that survives this year than one that dies thirty miles short of Port Moresby proving a point about how close it got." },
              setFlags: { kokodaPath: "earlyWithdraw" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "guadalcanal42",
              outcome:
                "A reasoned projection built on the same supply arithmetic that historically forced IGHQ's hand regardless: ordering the withdrawal before the advance fully exhausts itself preserves more of the detachment for whatever New Guinea's later fighting requires, at the cost of never testing whether thirty miles could have been closed. Whether Port Moresby was ever reachable given the track's real carrying capacity is a question historians of the campaign treat as settled in the negative regardless of which choice gets made here. Early withdrawal spends fewer lives to reach the same practical ceiling the historical push discovered the hard way.",
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
            "American Marines have landed on Guadalcanal and seized the unfinished airfield the Navy was building there, Henderson Field, now flying American aircraft against the very supply line it was meant to protect. What follows is not the decisive battle either side planned for: a half-year campaign of night destroyer actions, starvation on both sides of the jungle line, and a steady bleed of the veteran naval air crews Japan has no training pipeline built to replace at this rate." +
            (flags.kokodaPath === "press"
              ? " Horii's column is still pushing toward Port Moresby on a supply line already failing, a second front bleeding the same limited transport capacity this campaign needs for its own night runs down the Slot."
              : flags.kokodaPath === "earlyWithdraw"
              ? " The early withdrawal from the Kokoda Track freed transport capacity that, in principle, this campaign could use, though freed capacity and available capacity aren't quite the same thing once Guadalcanal's own demands are counted."
              : ""),
          choices: [
            {
              label: "Commit destroyers and remaining naval air strength to retake Henderson Field",
              advisor: { name: "Tanaka", quote: "The Tokyo Express runs every night we still have destroyers to run it. Every night we don't, that airfield gets stronger and this campaign gets more expensive to ever reverse." },
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
                    "The night actions off Guadalcanal in November run as close and as costly as the real ones did: two battleships lost on the Japanese side, an American admiral killed on his own bridge, the outcome undecided until the last exchange of fire. The campaign's overall trajectory doesn't change; it never was going to turn on one battle. What this outcome buys is a fighting chance nobody at Combined Fleet headquarters was confident of going in.",
                },
                {
                  weight: (() => { const w = modWeight(45, meters.initiative); return Math.max(5, 100 - w); })(),
                  title: "The reinforcement runs are caught cold",
                  setFlags: { guadalcanalNavalResult: "disaster" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "A worse night than history's own close-run version. Radar-equipped American cruisers catch the reinforcement convoy with less warning than the real battle allowed, and the destroyer force built to keep Henderson Field contested loses more of itself in a single week than the six-month campaign's historical attrition rate would suggest was coming.",
                },
              ],
              outcome:
                "What happened, roughly: six months of night naval actions fought with real tactical skill and no strategic answer to American air power flying from a field that was never fully retaken. The veteran carrier air groups spent here are a loss this war's training pipeline never makes good. What comes next is how this army actually gets off the island.",
            },
            {
              label: "Concede Guadalcanal early: pull back to a defensible perimeter at Rabaul and Bougainville",
              advisor: { name: "Inoue", quote: "We are trading our most experienced pilots for a jungle airfield we may not even hold at the end of it. Trade ground we can afford to lose for pilots we cannot afford to replace." },
              setFlags: { guadalcanalPath: "earlyWithdraw", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 2, pipeline: -1, initiative: -2 },
              next: "earlyPerimeter43",
              outcome:
                "A reasoned projection: conceding early spares the destroyer force and the remaining naval air crews the six-month bleed the historical campaign was, at the cost of surrendering the initiative in the Solomons months ahead of the historical schedule and handing American planners a forward base to build on that much sooner. Whether pilots saved now are worth ground given up this early is exactly the trade the rest of the war has to answer for.",
            },
            ...(meters.pipeline <= -6
              ? [
                  {
                    label: "Abandon destroyer resupply entirely: drum-float what little remains ashore and let the garrison stretch it as far as it goes",
                    advisor: { name: "Tanaka", quote: "Full drums, sealed with enough air to float, tied together on a line and cut loose offshore for the current to carry in. It is not a supply run. It is closer to a message in a bottle, except the men reading it are starving." },
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
            "Guadalcanal is lost in every sense that matters strategically, and Imperial Headquarters has to decide how to actually get roughly 11,000 remaining soldiers off the island before American forces finish reducing what's left of the perimeter. The real operation that follows, Ke-Go, is one of the more skillful pieces of naval logistics either side manages in the entire war: a deceptive buildup that convinces American intelligence Japan is reinforcing rather than evacuating, covered by a sustained air campaign that draws attention away from the destroyer runs." +
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
              advisor: { name: "Tanaka", quote: "Five months of watching exactly how much attention this stretch of water gets from American reconnaissance tells me what I need to know. I intend to use that knowledge to make them see an army arriving while we actually take one away." },
              historical: true,
              setFlags: { keGoPath: "deception" },
              impact: { readiness: 1, pipeline: -1, initiative: 1 },
              next: "yamamotoDeath43",
              outcome:
                "Between the first and seventh of February, twenty destroyer runs pull nearly 11,000 soldiers off Guadalcanal under an American command that doesn't realize an evacuation is underway until it's essentially complete, having spent the preceding weeks convinced a reinforcement effort was building instead. It's a rare thing in this war's actual record: a retreat that costs less than the fighting retreat it replaced, and a deception operation that worked against an opponent whose intelligence had, by 1943, gotten very good at reading Japanese naval movements correctly almost everywhere else.",
            },
            {
              label: "Skip the deception, evacuate directly under cover of the remaining air strength: faster, more exposed",
              advisor: { name: "Yamamoto", quote: "Tanaka's plan asks for more patience than this fleet has fuel to spend on patience. I would rather move these men now, under whatever cover we can still provide, than lose them to a deception that runs a week too long." },
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
                    "The bet on speed over deception pays off well enough: most of the garrison is off the island before American command fully reorients toward interdicting the withdrawal, at a bearable cost to the destroyer force running exposed rather than under cover of a plan that bought Tanaka's actual operation the time it needed.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "American forces catch the withdrawal partway through",
                  setFlags: { keGoResult: "costlyExposed" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier outcome without the deception buying time: American reconnaissance identifies the withdrawal as it's happening rather than after, and the later runs go in against a defense that's had real warning, costing more of the destroyer force and leaving a larger fraction of the garrison unable to be lifted before the window closes.",
                },
              ],
              outcome:
                "A faster, more exposed alternative to the real deception plan, trading the weeks Tanaka's actual operation spent building a false picture of reinforcement for a withdrawal that starts sooner but has to survive being seen for exactly what it is.",
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
            "American codebreakers intercepted Yamamoto's detailed inspection itinerary weeks ago, down to the exact time his aircraft would pass over Bougainville, a message Combined Fleet's own communications discipline should have caught and didn't. Sixteen P-38s met his flight on schedule. Yamamoto is dead, and IGHQ has to decide, within hours, what the country is told about it." +
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
              advisor: { name: "Tojo", quote: "The Emperor will know today. The country does not need to know today. I would rather choose the moment this news arrives than let it arrive on its own." },
              historical: true,
              setFlags: { yamamotoDeathPath: "concealed" },
              impact: { readiness: 0, pipeline: 0, initiative: -1 },
              next: "attu43",
              outcome:
                "Word reaches the Emperor immediately; the public announcement waits until May 21st, more than a month later, timed for the least damaging possible moment. Yamamoto is given a state funeral and posthumously promoted to Fleet Admiral. Whatever the war's remaining chapters do without him, they do it with a command structure that has now lost the one figure who argued, from the very beginning, that this war could only be won quickly or not at all.",
            },
            {
              label: "Announce it immediately: the country will find out regardless, better to control the story from the start",
              advisor: { name: "Koga", quote: "I am taking this command whether the news is public today or in a month. I would rather this navy's officers hear it from us first." },
              setFlags: { yamamotoDeathPath: "announced" },
              impact: { readiness: -1, pipeline: 0, initiative: 0 },
              next: "attu43",
              outcome:
                "A more immediate reckoning with a loss the historical war ministry chose to sit on for over a month. Whether early honesty costs more in morale than the month of concealment bought, or whether the historical delay just postponed a blow the public was going to absorb regardless, isn't resolved here. What's certain either way is that Admiral Koga inherits a Combined Fleet whose most consequential voice on how to end this war is gone.",
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
            "The garrison holding Attu in the Aleutians, roughly 2,600 men under Colonel Yamasaki, is cut off, out of most of its ammunition, and facing an American force it has no realistic path to defeating or escaping. There's no fleet left in the region to attempt a relief after the disaster of the Komandorski Islands engagement in March, and no reinforcement convoy IGHQ can actually promise and deliver. Yamasaki's own message to Tokyo is not a request for rescue. It's a request for instructions.",
          choices: [
            {
              label: "Authorize surrender: order Yamasaki to lay down arms rather than continue an unwinnable defense",
              advisor: { name: "Sugiyama", quote: "This order costs this army's own doctrine something to issue, and I know it. I am not willing to spend twenty-six hundred men on a battle already lost to prove a point about what this army will and will not order." },
              setFlags: { attuPath: "surrender" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "theMainlandCrisis44",
              outcome:
                "A break from the doctrine that governed every other besieged garrison this war, ordering surrender rather than a final stand. It preserves lives the historical battle spent entirely, at a cost this army's own propaganda apparatus has no framework for describing: what does IGHQ tell the public about a garrison that surrendered, in a war whose entire public narrative has been built around gyokusai, the shattered jewel, rather than survival.",
            },
            {
              label: "Leave the decision to Yamasaki's own command: no order either way, let the garrison decide its own end",
              advisor: { name: "Tojo", quote: "Twenty-six hundred men do not die from an order I give from a desk in Tokyo, and they do not surrender on one either. Colonel Yamasaki has commanded this garrison from the beginning. He will command its end." },
              historical: true,
              setFlags: { attuPath: "noOrder" },
              impact: { readiness: -1, pipeline: 0, initiative: 1 },
              next: "theMainlandCrisis44",
              outcome:
                "What happened, in substance: no explicit surrender order reaches Attu, and Yamasaki leads what remains of the garrison, roughly 1,000 men still able to walk, in a final charge on May 29th that breaks through American lines before being annihilated almost to the last man. Of the garrison's original 2,600, fewer than 30 are taken alive. It becomes the first of the war's mass banzai charges on this scale, a grim template the later, larger defenses at Saipan and Okinawa will follow on a far greater scale.",
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
            "By 1944 the mainland front and the Pacific front are competing for the same dwindling reserve of infantry divisions, and neither offensive on the table can be fully resourced without starving the other. Operation U-Go proposes driving through the Chindwin into Assam to seize Imphal and Kohima, threatening to unravel the India supply base Britain's Fourteenth Army has spent two years building. Operation Ichi-Go proposes the opposite theater entirely: a five-hundred-thousand-man drive through China to overrun the airfields General Chennault's Fourteenth Air Force is using to bomb the home islands and Japanese shipping directly." +
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
              advisor: { name: "Sugiyama", quote: "Telling either front commander his offensive is the one we can't afford isn't a call I'm prepared to make. Launch both. We will find out together what the army can really sustain." },
              historical: true,
              setFlags: { mainlandPath: "both" },
              impact: { readiness: -4, pipeline: -3, initiative: 1 },
              disabledReason: meters.readiness <= -3 ? "Combat effectiveness has degraded too far to sustain two simultaneous offensives. The divisions available can support one front, not two." : undefined,
              gateCheck: { meter: "readiness", threshold: -3, label: "Readiness" },
              next: fleetPreserved ? "theLongWarFooting45" : "philippineSea44",
              outcome:
                "What happened: both offensives launched within weeks of each other. Ichi-Go becomes the single most successful Japanese ground offensive of the war, overrunning Chennault's forward airbases and driving a corridor through southern China largely intact. U-Go becomes a catastrophe: three divisions committed on a twenty-day ration assumption for a campaign the monsoon and Fourteenth Army's defense stretch past three months, ending in a retreat historians count among the worst defeats the Imperial Army suffered anywhere in the war, with roughly 55,000 dead. Japan wins the mainland battle it needed less and loses the one it needed more, and the army that fought both emerges from 1944 strategically no better off for either.",
            },
            {
              label: "Recognize the logistics can't support both: commit fully to Ichi-Go, cancel U-Go outright",
              advisor: { name: "Kawabe", quote: "General Mutaguchi has never once, in two years of arguing for this offensive, given me a satisfactory answer about what the divisions eat after day twenty. I am not willing to find out the answer is nothing. Take the divisions to China instead." },
              setFlags: { mainlandPath: "ichiGoOnly", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: -1, initiative: 1 },
              next: "ichiGoTriumph44",
              outcome:
                "A more disciplined resourcing choice than the one Imperial Headquarters actually made. The divisions U-Go would have spent on Assam's monsoon instead reinforce a larger, better-supplied Ichi-Go, while Britain's Fourteenth Army never fights the defensive battle at Imphal and Kohima that history counts among Japan's costliest defeats. The 55,000 dead U-Go actually cost are, on this path, dead somewhere else instead, or not yet. What a fully resourced Ichi-Go actually buys is a separate question.",
            },
            {
              label: "Launch both offensives, but hold back genuine reserves to resupply U-Go past the twenty-day ration assumption that doomed it historically",
              advisor: { name: "Kawabe", quote: "Two years now, telling Mutaguchi his ration plan doesn't survive contact with the monsoon. I have never once had the divisions to fix that instead of just saying it. I have them now." },
              setFlags: { mainlandPath: "bothResourced" },
              impact: { readiness: -3, pipeline: -3, initiative: 2 },
              disabledReason: meters.readiness < 5 ? "This army doesn't have reserve strength to spare. Resupplying U-Go past its historical failure point needs a readiness margin this command doesn't currently have." : undefined,
              gateCheck: { meter: "readiness", threshold: 5, label: "Readiness" },
              next: fleetPreserved ? "theLongWarFooting45" : "philippineSea44",
              outcome:
                "A uncommon position for this army to be launching two offensives from: enough reserve strength that U-Go's actual, well-documented failure, three divisions on a twenty-day ration assumption against a campaign the monsoon stretched past three months, doesn't have to repeat itself the way it did historically. Ichi-Go still succeeds largely as it did in the real war. U-Go, properly resupplied for once, is a different fight than the one that produced 55,000 dead and one of the Imperial Army's worst defeats anywhere in the war, though a different fight is not the same as a won one, and Fourteenth Army's defense at Imphal and Kohima was never only a matter of Japanese logistics to begin with.",
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
            "A fully resourced Ichi-Go does what the historical partial version only threatened to: a continuous overland corridor from Manchuria to French Indochina, Chennault's forward airbases overrun one after another, more Chinese territory taken in a single campaign than any Japanese offensive since 1938. Staff maps at Imperial Headquarters show the largest contiguous Japanese-held territory of the entire war. The question on the table is what this solves.",
          choices: [
            {
              label: "Present the corridor as proof the war in China is winnable outright",
              advisor: { name: "Kawabe", quote: "More ground has changed hands this year than in any since the war began. I would like this staff to explain to me what, specifically, that ground has done to the war we are losing." },
              historical: true,
              setFlags: { ichiGoTriumphPath: "proofOfWin" },
              impact: { readiness: 0, pipeline: -1, initiative: 1 },
              next: fleetPreserved ? "theLongWarFooting45" : "philippineSea44",
              outcome:
                "The corridor holds, and holding it changes nothing about the war that really decides the outcome. American submarines are still cutting the oil route from the Indies. B-29s are still reaching the home islands from bases the China campaign was never going to threaten. A staff that spent a year measuring success in captured Chinese territory arrives at 1945 with a map that looks better and a war that's going exactly as badly as it was before Ichi-Go started.",
            },
            {
              label: "Treat the corridor honestly, as a battlefield win with no bearing on the war Japan is actually losing",
              advisor: { name: "Umezu", quote: "A map is not a strategy. Chennault's airbases are gone. The war those airbases were never going to win for America is still being lost by us somewhere else entirely." },
              setFlags: { ichiGoTriumphPath: "honestAccounting" },
              impact: { readiness: -1, pipeline: 0, initiative: -1 },
              next: fleetPreserved ? "theLongWarFooting45" : "philippineSea44",
              outcome:
                "A rare moment of institutional honesty about what a real, undeniable victory is actually worth: strategically almost nothing, against an opponent whose war-winning theater was never China at all. It doesn't change troop dispositions or resourcing much either way. It changes what the men making the next decision let themselves believe about the one before it.",
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
            "Whatever carrier strength or veteran air cadre survived the years since Midway is still, in some real form, on the ledger in 1945. It doesn't change what American shipyards can build in a year Japan can't match, and it doesn't change the Marianas: Saipan, Tinian, and Guam fell in the summer of 1944 on their own timetable, a Central Pacific campaign fought by a different fleet on a different axis than whatever this staff held onto or lost in the south, and Tinian's own airfields are what actually put B-29 range over the home islands regardless of anything decided here. What a surviving fleet or air cadre changes is the argument happening inside Imperial Headquarters itself. Historically, the surrender debate broke only because Anami's war ministry ran out of anything left to point to. A fleet or air cadre still standing is exactly the kind of thing that argument needs to keep being made with a straight face." +
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
              advisor: { name: "Togo", quote: "A ministry that goes to the table with nothing left to offer and nothing left to threaten with gets the terms it deserves. This ministry still has a fleet, or an air arm, or a cadre most of Tokyo assumed we'd have spent by now. That is worth using at a table, not just in a battle." },
              setFlags: { longWarPath: "terms", suspicion: (flags.suspicion || 0) + 2 },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "END",
              outcome:
                "Togo's peace faction finally has a genuine argument to make against Anami's war ministry: 'we have nothing left' was always their strongest card, and a Japan negotiating from real remaining strength doesn't get to play it, for better or worse. Washington's demand for unconditional surrender was never really about how much Japan had left to lose, so the offer may simply go unanswered. But if it lands, the shape of the peace that follows looks nothing like the historical occupation. A negotiated armistice, rather than unconditional surrender, plausibly leaves the imperial institution's postwar authority unsettled rather than resolved by American fiat, keeps Japan's colonial administration in Korea and Formosa an open question into the late 1940s instead of an immediate loss, and hands the emerging Cold War a Japan whose alignment isn't already locked in by an American occupation government. None of that is guaranteed. It's the door a negotiated peace opens that unconditional surrender never did.",
            },
            {
              label: "Commit whatever's preserved to Ketsu-Go regardless: a squadron saved from history doesn't settle the argument, it just changes who's making it",
              advisor: { name: "Anami", quote: "A preserved squadron does not change what the Americans can build in a year that we cannot. I think it changes how long I can keep telling this cabinet the fight is still worth having." },
              setFlags: { longWarPath: "ketsuGoRegardless" },
              impact: { readiness: -3, pipeline: -1, initiative: 2 },
              next: "afterHiroshima45",
              outcome:
                "The preserved strength gets spent on the same home-islands defense Ketsu-Go always planned for, and the more consequential effect is inside Imperial Headquarters, not on the battlefield: a war ministry that still has a fleet or air cadre to point to argues the fight isn't over with real material behind it, not just resolve. Whether that argument holds up against whatever comes next is a question this room hasn't had to answer yet.",
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
            "American forces have landed on Saipan, and the Mobile Fleet under Ozawa, rebuilt since the Philippine Sea's predecessor battles but crewed overwhelmingly by pilots with a fraction of the flight hours their 1942 counterparts had, represents the last serious attempt to contest American carrier superiority directly. The plan leans on land-based aircraft from the Marianas themselves to strike first, reducing the American carrier force before Ozawa's own inexperienced air groups have to close the range. Whether that plan can survive contact with American radar-directed fighter control, which none of Japan's remaining pilots have faced in this concentration before, is the open question this battle is about to answer.",
          choices: [
            {
              label: "Commit the fleet to the decisive battle for the Marianas as planned",
              advisor: { name: "Ozawa", quote: "These air groups are not what a fleet action against this many American carriers would have required two years ago, and no one in this room needs reminding. Saipan falls regardless if this fleet does not fight for it." },
              historical: true,
              setFlags: { philippineSeaPath: "commit" },
              impact: { readiness: -4, pipeline: -1, initiative: 0 },
              disabledReason: meters.readiness <= -3 ? "There aren't enough trained aircrew left to man Ozawa's air groups at all, let alone commit them to a fleet action. The training pipeline is the casualty here, not just this battle's outcome." : undefined,
              gateCheck: { meter: "readiness", threshold: -3, label: "Readiness" },
              next: "onishiKamikaze44",
              outcome:
                "American pilots nickname it the Marianas Turkey Shoot for a reason: roughly 600 Japanese aircraft are destroyed against a handful of American losses, in the worst single-day defeat suffered by Japanese naval aviation in the war. Two fleet carriers are also sunk by submarines during the battle. What's destroyed here isn't primarily hulls, it's the last generation of Japanese carrier pilots trained to any real standard, and the training pipeline that produced them has neither the fuel nor the time left to produce another.",
            },
            {
              label: "Decline the fleet action: withdraw the Mobile Fleet, abandon Saipan's garrison without a naval battle",
              advisor: { name: "Toyoda", quote: "I can commit this fleet and lose both the fleet and Saipan, or withhold it and lose only Saipan. I am not confident committing it changes which of those losses happens." },
              setFlags: { philippineSeaPath: "withdraw" },
              impact: { readiness: 2, pipeline: 0, initiative: -2 },
              next: "onishiKamikaze44",
              outcome:
                "A reasoned projection built on an uncomfortable but genuine arithmetic: Ozawa's inexperienced air groups were unlikely to change Saipan's outcome regardless of whether they fought, given the gap in pilot training and the American radar-and-fighter-control advantage neither side's planning fully appreciated beforehand. Withdrawing preserves the fleet's hulls and whatever's left of its pilot cadre for a later battle, at the cost of Saipan's garrison, and the civilian population on the island, facing the invasion with no naval support offered at all, a decision that isn't pretended to be a costless one just because the alternative also lost.",
            },
            ...(meters.readiness >= 4
              ? [
                  {
                    label: "Commit the fleet with a more experienced air wing than history had to work with, the training pipeline this war has protected until now",
                    advisor: { name: "Ozawa", quote: "I have flown with these pilots. They are not the men Nagumo had at Midway, but they are veterans all the same, not the barely-trained boys a rushed replacement pipeline would have sent up in their place. That difference is the entire plan." },
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
            "With Leyte's landing underway and the First Air Fleet down to barely thirty operational aircraft against an American carrier force it cannot meaningfully contest by conventional means, Vice Admiral Onishi has flown to the Philippines with a proposal no one before him has formally organized: deliberately crash-loaded aircraft into American ships, not as a desperate last resort by individual pilots but as organized policy, structured, named, and repeatable. He is asking Imperial Headquarters to make this the fleet's actual doctrine, not an exception to it." +
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
              advisor: { name: "Onishi", quote: "In our present situation I firmly believe there is only one way of channeling our meager strength into maximum efficiency: to organize suicide attack units composed of Zero fighters armed with 250-kilogram bombs, with each plane to crash-dive into an enemy carrier." },
              historical: true,
              setFlags: { kamikazePath: "approved" },
              impact: { readiness: -1, pipeline: 0, initiative: 2 },
              next: "leyteGulf44",
              outcome:
                "Within days, the first organized kamikaze attacks strike escort carriers at Leyte Gulf, and the doctrine spreads from an emergency improvisation at one air fleet to official Imperial Navy and Army policy for the rest of the war, culminating in the massed Kikusui waves at Okinawa. Onishi himself never claims the tactic as anything other than what a fleet with barely thirty aircraft left could still do to an enemy it could no longer fight conventionally.",
            },
            {
              label: "Decline to formalize it: permit individual voluntary acts but refuse to make suicide attack organized policy",
              advisor: { name: "Toyoda", quote: "I am not willing to be the officer who makes this the Navy's actual doctrine, on paper, with a name and a training pipeline attached. What individual pilots choose to do in extremity is not the same decision as what this command chooses to institutionalize." },
              setFlags: { kamikazePath: "declinedFormal", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "leyteGulf44",
              outcome:
                "A distinction the real historical Navy leadership largely didn't draw, refusing to formalize what individual desperation had already begun happening in isolated incidents anyway. Declining to institutionalize it doesn't stop pilots in the direst circumstances from choosing it on their own; it just leaves the practice without the training pipeline, the naming, and the escalating scale that formal doctrine gave it historically, at a cost in the conventional strike capability the rest of the war otherwise tracks.",
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
            "MacArthur's forces have landed at Leyte, and the Combined Fleet's surface strength, battleships and cruisers that spent most of this war held in reserve for lack of fuel and air cover, has one plan left worth the name: Sho-Go, using the fleet's last carriers, now with barely trained air groups, as bait to pull the American covering fleet north, while the battleship force under Kurita slips through San Bernardino Strait to fall on the invasion beaches and transports themselves.\n\nIt is, by any conventional accounting, a fleet being spent rather than fought. The surface navy's last operational asset, offered up for one chance at disrupting a landing everyone at Combined Fleet headquarters privately expects cannot be stopped from returning.",
          choices: [
            {
              label: "Execute Sho-Go as planned: the carrier force as decoy, the battleships through San Bernardino Strait",
              advisor: { name: "Kurita", quote: "This fleet knows what it is being asked to be. I will take it through the strait regardless." },
              historical: true,
              setFlags: { leytePath: "shoGo" },
              impact: { readiness: -3, pipeline: -2, initiative: 0 },
              next: "kuritaAtLeyte44",
              outcome:
                "The decoy works exactly as intended: Halsey's carriers are pulled north, and Kurita's battleship force breaks through San Bernardino Strait to find nothing but escort carriers and destroyers between his guns and the landing beaches, history's own invasion transports still unloading nearby. What happens next is the single most argued-over decision of the naval war.",
            },
            {
              label: "Concentrate what remains on Formosa and the home approaches: decline the Leyte gamble, abandon the Philippines",
              advisor: { name: "Toyoda", quote: "We can spend this fleet on one throw at Leyte, or preserve it to contest the approaches to the home islands themselves. I do not believe we get to do both." },
              setFlags: { leytePath: "abandonPhilippines", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 2, pipeline: -4, initiative: -1 },
              disabledReason: meters.pipeline <= -5 ? "There isn't fuel left to relocate and sustain a fleet-in-being at Formosa. Whatever's still afloat has to fight now or not at all." : undefined,
              gateCheck: { meter: "pipeline", threshold: -5, label: "Pipeline" },
              next: "surrenderInquiry45",
              outcome:
                "A reasoned projection with a brutal arithmetic attached: preserving the fleet rather than spending it at Leyte keeps a defensive force in being, but conceding the Philippines without a naval fight cuts the oil route from the Indies completely and months ahead of the historical timetable. The fleet preserved is a fleet with no fuel to move. Whether a husbanded navy or a spent one leaves Japan better positioned for what comes next is a question this path answers earlier, and perhaps more honestly, than the historical one ever had to.",
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
            "Kurita's battleships, including Yamato herself, have broken through San Bernardino Strait to find a single escort carrier group, Taffy 3, six small carriers and a handful of destroyers, standing between his guns and the Leyte invasion beaches. Halsey's real carrier fleet is still hours north, still chasing the decoy force. The destroyers of Taffy 3 are already charging Kurita's battle line in a desperate, near-suicidal attempt to buy time, and the invasion transports, still unloading troops and supplies at the beachhead, have almost nothing left to defend them if this battle line gets past the escort carriers entirely.",
          choices: [
            {
              label: "Withdraw: uncertain reports and fear of a trap outweigh the opportunity in front of this fleet",
              advisor: { name: "Kurita", quote: "What is actually north of this position is not clear to me, and I am not willing to commit this fleet's last battleships against an enemy carrier force I cannot see. We turn back." },
              historical: true,
              setFlags: { kuritaPath: "withdraw" },
              impact: { readiness: 1, pipeline: -1, initiative: -1 },
              next: "iwoJima45",
              outcome:
                "What happened, and it remains one of the most argued-over command decisions of the entire war. Kurita, receiving fragmentary and contradictory reports about American carrier strength to his north and unaware how close Taffy 3's own destroyers were to exhausting their ability to resist, turns his battleships around and withdraws through San Bernardino Strait roughly the way he'd come. The Imperial Japanese surface navy, as an offensive force, effectively ceases to exist after this battle regardless of the decision, but the invasion transports at Leyte survive it entirely intact.",
            },
            {
              label: "Finish the attack: break through to the transports and the beachhead while Taffy 3 is still all that stands in the way",
              advisor: { name: "Ugaki", quote: "Six escort carriers and a handful of destroyers are not what turns this fleet back after fighting through this strait. Whatever comes north later comes later. The beach is in front of us now." },
              setFlags: { kuritaPath: "press" },
              impact: { readiness: -2, pipeline: -1, initiative: 3 },
              next: "leyteBeachheadAftermath44",
              outcome:
                "A grounded projection of the argument some of Kurita's own staff reportedly wanted to make and didn't. Taffy 3's destroyers, already fighting with a ferocity that rattled the Japanese battle line in the engagement, keep contesting the approach, but a battleship force this size, committed rather than withdrawn, has the raw firepower to eventually get through to a beachhead with almost nothing else left to defend it.",
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
            "There is no historical record past this point: the actual Kurita withdrew, and everything from here is built on Taffy 3's own fierce historical resistance, the real vulnerability of Leyte's beachhead at this exact hour, and honest uncertainty about how much damage a battleship force this size could inflict on an invasion already ashore rather than still at sea. Whether this is the disaster MacArthur's own staff feared or a costly, survivable raid is the question the next hours actually answer.",
          choices: [
            {
              label: "Commit fully to bombarding the beachhead and the transport anchorage before American forces can respond",
              advisor: { name: "Ugaki", quote: "We have the guns. We have the range. I am not going to spend this opportunity carefully when carefulness is not what got this fleet through the strait in the first place." },
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
                    "The rarer, more consequential branch: sustained naval gunfire against transports and beach stores does real damage before Halsey's returning carriers and Seventh Fleet's own remaining escorts finally force Kurita's withdrawal. MacArthur's Leyte landing survives, but wounded in a way the historical campaign never had to absorb: supplies burned at the beach, transports sunk at anchor, a liberation campaign that has to rebuild its own logistics before it can resume the advance the historical timetable never had to interrupt.",
                },
                {
                  weight: (() => { const w = modWeight(35, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The window closes before the damage compounds",
                  setFlags: { beachheadResult: "limited" },
                  impact: { readiness: -1, pipeline: 0, initiative: 0 },
                  outcome:
                    "The likelier outcome: real damage, more than the historical battle inflicted, but Taffy 3's own continued resistance, air strikes finally reaching the battle line, and the return of heavier American units combine to force a withdrawal before the bombardment can fully compound into the kind of decisive blow that changes Leyte's outcome. The beachhead holds, badly bruised rather than broken.",
                },
              ],
              outcome:
                "This is the most speculative naval counterfactual here, and it says so honestly: scholars of the battle are divided on how much damage Kurita's force could have inflicted on a beachhead this exposed, versus how quickly returning American air and surface power would have made the raid prohibitively costly regardless of the fleet's initial breakthrough.",
            },
            {
              label: "Conduct a limited strike and withdraw before American carrier air power can fully organize a response",
              advisor: { name: "Kurita", quote: "I am prepared to have pressed further than caution would ordinarily argue for. I am not prepared to lose this fleet entirely for a beachhead we cannot hold or occupy afterward." },
              setFlags: { beachheadPath: "limitedStrike" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: "iwoJima45",
              outcome:
                "A middle path between the historical full withdrawal and an all-in bombardment: real damage inflicted in a compressed window, the battle line withdrawn again before American air power fully organizes against it. Less dramatic than either the historical retreat or a full commitment, and arguably the most tactically defensible version of pressing the attack at all, real cost imposed, the fleet preserved to fight another day it may or may not get.",
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
            "American Marines are landing on eight square miles of volcanic ash whose only value is the airfields on it, close enough to escort B-29s all the way to Tokyo and back. Lieutenant General Kuribayashi has thrown out the beach-defense doctrine that failed at every previous island: no counterattack at the water's edge, no banzai charges to waste the garrison in a single afternoon. Instead, over eleven miles of tunnels bored into volcanic rock, a defense meant to bleed the invasion for as long as physically possible rather than break it in one battle. Imperial Headquarters has one real decision left: whether the garrison already committed is the last reinforcement this island gets, or whether more can still be found for it.",
          choices: [
            {
              label: "Reinforce and hold as long as the garrison physically can — no evacuation, no withdrawal",
              advisor: { name: "Kuribayashi", quote: "I have told my staff, and I will tell Imperial Headquarters directly: I do not expect to leave this island, and I do not intend to make the Americans' cost for it a cheap one. Send what you can. I will use all of it." },
              historical: true,
              setFlags: { iwoJimaPath: "hold" },
              impact: { readiness: -3, pipeline: -1, initiative: 1 },
              disabledReason: meters.pipeline <= -3 ? "There's no shipping left to run reinforcements to an island already effectively cut off by American naval and air superiority. Nothing more can physically reach the garrison." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "okinawa45",
              outcome:
                "Of roughly 21,000 defenders, fewer than 1,000 survive to be taken prisoner; the rest are killed almost to the last man over five weeks of fighting through tunnels and volcanic rock that neither naval bombardment nor flamethrowers ever fully cleared. It costs the Marine Corps its highest single-battle casualty count of the war, nearly 7,000 dead, and produces the single most reproduced photograph of the Pacific War, the flag raising on Suribachi, on day five of a battle that still has thirty more to run.",
            },
            {
              label: "Decline further reinforcement — treat the island as an expendable delay, redirect any spare strength to Okinawa",
              advisor: { name: "Toyoda", quote: "Kuribayashi's plan was always to make this expensive, not to win it. Sending more men into a battle already understood to be unwinnable spends strength Okinawa is going to need considerably more urgently." },
              setFlags: { iwoJimaPath: "conserve" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "okinawa45",
              outcome:
                "A colder arithmetic than the historical command applied: Kuribayashi's garrison, already committed, fights largely the same battle regardless of what reinforcement decision is made at this level, since there was little practical capacity to significantly reinforce an island already effectively cut off by American naval and air superiority. What this path changes is modest and mostly symbolic: fewer additional units formally assigned to a fight IGHQ privately expects to lose, freeing a marginally larger reserve for whatever Okinawa asks for next.",
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
            "The largest amphibious landing of the Pacific War is underway on the last island before the home islands themselves, and the Navy's remaining offensive assets amount to whatever kamikaze-capable aircraft are left and the battleship Yamato, fueled for a one-way voyage, escorted by a handful of destroyers, sailing under orders that assume and accept her destruction. Operation Ten-Go and the massed kamikaze waves of Kikusui represent, honestly, the last coordinated offensive Japan's navy is capable of mounting. What remains open is whether to spend all of it here or hold some of it back for whatever comes after Okinawa falls." +
            (flags.kamikazePath === "declinedFormal"
              ? " The scale of what's being spent here is smaller than history's Kikusui waves. Without a formal doctrine and training pipeline behind it, this fleet has fewer pilots trained toward this specific end than the historical Navy had by this point in the war."
              : "") +
            (flags.iwoJimaPath === "conserve"
              ? " Whatever was held back rather than sent to Kuribayashi's tunnels is part of what's being weighed here now. It wasn't enough to save the island. Whether it's enough to matter here is a different question."
              : ""),
          choices: [
            {
              label: "Commit everything: Yamato's sortie, the full Kikusui kamikaze campaign, against the invasion fleet",
              advisor: { name: "Ugaki", quote: "This is the fleet's last mission whether we spend it here or lose it at anchor to the next carrier strike. I would rather it cost the Americans something on the way down." },
              historical: true,
              setFlags: { okinawaPath: "commitAll", suspicion: (flags.suspicion || 0) - 1 },
              impact: { readiness: -4, pipeline: -2, initiative: 2 },
              disabledReason: meters.pipeline <= -6 ? "There isn't fuel left for a one-way Yamato sortie, let alone the sustained kamikaze sortie rate Kikusui requires. Whatever's left can defend or it can sail. It can't do both at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -6, label: "Pipeline" },
              next: "theSubmarineCarriersQuestion45",
              outcome:
                "Yamato is sunk by American carrier aircraft before ever reaching Okinawa's beaches, taking most of her nearly 3,000-man crew down with her. The Kikusui waves that follow, ten mass kamikaze attacks over three months, sink or damage more American ships than any other battle of the Pacific War, and the Navy's remaining kamikaze-trained pilots are consumed almost entirely by the campaign's end. It is, without much argument, the costliest single battle of the war for the U.S. Navy, and it does not change the outcome of Okinawa or the war by a single day.",
            },
            {
              label: "Withhold Yamato and conserve remaining kamikaze-capable aircraft for the home islands' own defense instead",
              advisor: { name: "Toyoda", quote: "Spending Yamato at Okinawa does not buy anything Yamato spent at Kyushu wouldn't buy more of. If this navy has one more mission in it, I would rather choose where." },
              setFlags: { okinawaPath: "husband", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 2, pipeline: -1, initiative: -2 },
              next: "theSubmarineCarriersQuestion45",
              outcome:
                "A conservation choice that reads, to a war ministry already inclined toward suspicion of restraint, as exactly the kind of hesitancy Ugaki's historical order was meant to foreclose, holding the fleet's last assets back from a battle already understood to matter enormously to the timeline of any home-islands invasion. Whether Yamato surviving to Kyushu changes anything about Ketsu-Go's eventual arithmetic is really uncertain; deferred assets in a war this close to its industrial-arithmetic end tend to arrive at the next decision point diminished rather than decisive, whichever decision point that turns out to be.",
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
            "I-400 and I-401, the largest submarines built by any navy in the war, sit ready with a weapon no other force possesses: three Aichi M6A1 Seiran floatplanes apiece, folding-wing bombers launched by catapult from a hangar built into the hull, each carrying an 1,800-pound bomb. Yamamoto ordered the class before his death in 1943, aimed originally at a target no other Japanese weapon could reach: the Panama Canal's lock gates, struck from the Caribbean side for surprise, severing the shortest route between the American fleet's two oceans. Two more years of the war Yamamoto didn't live to see have narrowed the original order from eighteen hulls to five, and narrowed the case for reaching all the way to Panama when the American fleet closing on the home islands themselves no longer needs to be found at the far end of a fifty-thousand-mile round trip.",
          choices: [
            {
              label: "Launch the original mission: the Panama Canal, struck from the Caribbean side, severing the fleet's shortest route between two oceans",
              advisor: { name: "Ariizumi", quote: "This is the mission these submarines were built for. Everything since Yamamoto's death has been an argument for spending them closer to home instead. I am asking to keep the original order." },
              historical: false,
              setFlags: { submarineCarriersPath: "panama" },
              impact: { readiness: -1, pipeline: -2, initiative: 2 },
              next: "ketsuGo45",
              outcome:
                "The real defenses waiting at the actual Canal Zone were never tested against this: thirty fighter aircraft on permanent patrol, regular submarine sweeps, a base built specifically around the assumption that someone, eventually, would try exactly this. Whatever these two submarines and their six aircraft could have done against locks built to survive far more than six floatplanes' worth of bombs is a real, unresolved question the actual war never let anyone answer, on either side.",
            },
            {
              label: "Redirect toward the closer target: American forces massing at Ulithi Atoll, the same decision the real Imperial Japanese Headquarters made on June 25th, 1945",
              advisor: { name: "Toyoda", quote: "The Americans are not two oceans away anymore. They are at Okinawa. I would rather this navy's last submarines strike something we can actually still reach." },
              historical: true,
              setFlags: { submarineCarriersPath: "ulithi" },
              impact: { readiness: 0, pipeline: -1, initiative: 1 },
              next: "ketsuGo45",
              outcome:
                "What actually happened: the real order to halt Panama Canal preparations went out on exactly this date, redirecting toward a fifteen-carrier concentration at Ulithi instead, close enough to reach and still, on paper, a target worth the world's largest submarines. A missed radio rendezvous between the two boats pushes the real attack date to August 25th. It never happens. Japan surrenders thirteen days earlier, and I-400 and I-401 are ordered to destroy their own aircraft and turn themselves in rather than fly a single sortie either mission was actually built for.",
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
            "The surface navy is gone, the merchant fleet is being strangled by submarines and mines faster than it can be replaced, and American bombers are burning Japan's cities at a rate the air defense cannot meaningfully contest. Ketsu-Go, the plan for defending the home islands themselves, built around civilian militia, suicide boats, and the assumption that the cost of an invasion can be made politically unbearable for the Americans, is IGHQ's last coherent strategy. The alternative, never formally proposed inside Imperial Headquarters at this stage but not impossible to raise, is to use neutral channels to test what terms a negotiated end to the war might really carry." +
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
              advisor: { name: "Anami", quote: "One hundred million die together rather than surrender. That is not a figure I offer lightly, and it is not one I am prepared to abandon while the army still stands." },
              historical: true,
              setFlags: { endgamePath: "ketsuGo" },
              impact: { readiness: -4, pipeline: -3, initiative: 2 },
              next: "afterHiroshima45",
              outcome:
                "The militia mobilization proceeds through the summer of 1945. Suicide boats, sharpened bamboo spears for civilians with no rifles to issue, and a defense doctrine built entirely around making an invasion's cost politically unbearable for the Americans rather than actually winning it. Whatever happens next happens against that backdrop: a defense the war ministry's hardliners call the empire's last real chance, and Togo's own foreign ministry privately calls a plan with no actual exit built into it.",
            },
            {
              label: "Open a conditional surrender inquiry through neutral channels",
              advisor: { name: "Togo", quote: "We can lose this war while there is still a country left to lose it for, or we can lose it after there is not. I am asking Imperial Headquarters to notice that those are different outcomes." },
              setFlags: { endgamePath: "surrenderInquiry", suspicion: (flags.suspicion || 0) + 2 },
              impact: { readiness: 1, pipeline: 1, initiative: -3 },
              next: "moscowMediates45",
              outcome:
                "A defensible extension of the diplomatic path Togo's foreign ministry pushed for and lost to the war ministry's insistence on holding out for better terms. Historically, Togo did attempt something close to this, quietly approaching Moscow in the war's final weeks to ask the still-neutral Soviets to mediate terms with the Americans, an approach Stalin let sit unanswered while he finished redeploying for his own invasion of Manchuria. Opening this channel earlier, without the shock of the bombs or the Soviet declaration to break the cabinet's deadlock, risks the same fate on a longer timeline: the militarists treating it as defeatism rather than realism, and no guarantee any neutral intermediary carries a serious offer to a United States still committed to unconditional surrender.",
            },
            {
              label: "Move preemptively against the peace faction: foreclose any surrender inquiry before it can be raised",
              advisor: { name: "Umezu", quote: "Togo will raise this question again the moment the cabinet looks weak enough to hear it. I would rather this army decide there is no question left to raise." },
              setFlags: { endgamePath: "purgePeaceFaction", suspicion: (flags.suspicion || 0) + 3 },
              impact: { readiness: -3, pipeline: -2, initiative: 3 },
              disabledReason: meters.pipeline <= -8 ? "There isn't fuel or transport left to move loyal units against anyone. Whatever this army wants to do about the peace faction, it no longer has the physical means to act on it." : undefined,
              gateCheck: { meter: "pipeline", threshold: -8, label: "Pipeline" },
              next: "afterHiroshima45",
              outcome:
                "This is the clearest example of an actually bad decision, not a defensible alternative dressed up as one. Sidelining the peace faction doesn't strengthen Ketsu-Go's actual defense; it removes the one internal check that, historically, kept the war ministry's most extreme instincts from running entirely unopposed, and it does so at the exact moment the atomic bombs and the Soviet declaration are about to make that check matter most. The real Kyujo incident, an actual coup attempt against the Emperor's own surrender broadcast, came within hours of succeeding using officers already primed toward exactly this instinct. Institutionalizing that instinct in advance, rather than leaving it as a last, failed gasp, is the most honest answer available to what the fantasy actually costs.",
            },
            ...(meters.pipeline <= -7
              ? [
                  {
                    label: "Divert every gallon the pine-root program actually yields to the kamikaze reserve, at the cost of everything else that still burns fuel",
                    advisor: { name: "Toyoda", quote: "Two hundred pine roots, properly distilled, keep one aircraft in the air for one hour. I am aware how that sounds. I am also aware it is the only fuel this navy has left to allocate at all." },
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
                    advisor: { name: "Anami", quote: "The corps already reaches every man of fifteen and every unmarried woman of seventeen. I am being asked whether it should reach further still, and I no longer have an honest argument for where the line was supposed to hold." },
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
                    advisor: { name: "Togo", quote: "Every version of this argument I have lost, I lost while holding nothing the war ministry believed was worth trading. I am not holding nothing this time." },
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
            "A single American bomber destroys Hiroshima at 8:15 in the morning with a single weapon, a device unlike anything used in this or any other war. Early reports reaching Tokyo are fragmentary and contradictory, some crediting an ordinary large raid, but within a day the scale becomes impossible to explain any other way. The Big Six, Imperial Headquarters' actual inner war council, has to decide what this changes, if anything. The war ministry's real position, held by men still in this room, is that a single bomb, however terrible, is not by itself a reason to abandon a defense the empire has spent the summer preparing.",
          choices: [
            {
              label: "Move to surrender now, before a second weapon falls",
              advisor: { name: "Togo", quote: "I do not know how many of these weapons America has. I know that finding out by losing a second city is not a policy, it is a failure to have one. I am asking this council to decide now, while there is still a decision left to make rather than a disaster left to survive." },
              setFlags: { hiroshimaResponsePath: "surrenderNow" },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "END",
              outcome:
                "A response the actual Big Six never seriously entertained at this exact moment, historically: even after Hiroshima's destruction was fully confirmed, the war ministry held its position for three more days, arguing terms while a second city waited. Moving to surrender here, before Nagasaki, is the version of this decision Togo's own real diplomatic instincts wanted and never got the votes for. Whether one destroyed city was ever going to be enough to move men who had already accepted a hundred million dead as an acceptable cost is a question this choice answers by not waiting to find out.",
            },
            {
              label: "Hold the position: one bomb, however terrible, does not by itself void Ketsu-Go's own logic",
              advisor: { name: "Anami", quote: "One city, against an invasion this empire is prepared to make impossibly costly. I am not going to abandon a defense built on exactly that cost calculation because the enemy found a more efficient way to burn a city than the hundred he has already burned with ordinary bombs." },
              historical: true,
              setFlags: { hiroshimaResponsePath: "holdPosition" },
              impact: { readiness: -2, pipeline: -1, initiative: 1 },
              next: "afterNagasaki45",
              outcome:
                "What actually happened: the war ministry's position held. The Big Six met, argued, and reached no consensus in the days immediately following Hiroshima, still weighing whether a single weapon, terrible as it was, actually changed the strategic picture Ketsu-Go was built to answer. Three days pass. A second American bomber is already in the air.",
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
            "A second bomb destroys Nagasaki. On the same day, hours before the news from Nagasaki even fully reaches Tokyo, the Soviet Union declares war and Red Army formations are already moving into Manchuria against a Kwantung Army that cannot meaningfully resist them. The Big Six meet again, and this time deadlock: three ministers for immediate surrender on the single condition of the Emperor's preservation, three for surrender only with additional conditions Washington has already signaled it won't accept. Two atomic weapons and a second front in the same week haven't produced consensus. They've produced an even split the council's own procedures have no mechanism to break.",
          choices: [
            {
              label: "Defer to the Emperor's own direct intervention: let the sacred decision break the deadlock",
              advisor: { name: "Suzuki", quote: "This council cannot break its own tie. I am asking His Majesty to do what six votes could not, because I do not see another lawful way this deadlock resolves before a third weapon or a Soviet army makes the question academic." },
              historical: true,
              setFlags: { nagasakiResponsePath: "imperialIntervention" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "sacredDecision45",
              outcome:
                "What actually happened: with the council unable to break its own three-three deadlock, Prime Minister Suzuki takes the extraordinary step of asking the Emperor to decide directly, a request with no real precedent in the way Imperial Japan's own constitutional order was supposed to function. Hirohito's own answer, delivered in the small hours of August 10th, is unambiguous: the war must end.",
            },
            {
              label: "Reject the deadlock-breaking precedent: the council's own split stands, and the war ministry's hardliners hold the line regardless",
              advisor: { name: "Anami", quote: "I understand what is being asked of His Majesty, and I understand why. I am telling this council plainly that I do not believe every officer under this army's command will accept a decision reached this way, however lawfully it is reached." },
              setFlags: { nagasakiResponsePath: "rejectPrecedent" },
              impact: { readiness: -3, pipeline: -1, initiative: 2 },
              next: "ketsuGoFinalStand45",
              outcome:
                "A path the actual Suzuki cabinet considered too dangerous to test: refusing to ask the Emperor to break a deadlock the council itself created leaves that deadlock unresolved, three ministers for surrender, three against, with no lawful mechanism left standing to settle it. Anami's own warning, that not every officer would accept a decision reached by unusual means, was about to be tested by the real Kyujo incident regardless. Here, nobody even gets the chance to find out whether the Emperor's own intervention would have held. The war ministry's fracture happens in slow motion instead, without the one moment of clear, single authority that historically, however narrowly, ended up holding the army together long enough to stand down.",
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
            "The Emperor's decision is made, and a recording of his surrender broadcast, the first time his voice will ever be heard by the Japanese public, is made in secret at the Imperial Household Ministry to be aired the next day. A faction of army officers, refusing to accept a surrender they consider a betrayal of everyone who died believing the empire would never yield, moves that same night to seize the Imperial Palace, isolate the Emperor, and find and destroy the recording before it can air. What happens in the palace's corridors over the next several hours is close enough to succeed that the outcome isn't settled until nearly dawn.",
          choices: [
            {
              label: "The Imperial Guard holds: the palace garrison does not join the coup, and loyalist officers move to suppress it",
              advisor: { name: "Suzuki", quote: "I do not know, tonight, whether the men guarding this palace will fire on other Japanese soldiers to protect a recording. I know that if they don't, there may be no surrender broadcast left to protect by morning." },
              historical: true,
              setFlags: { coupOutcomePath: "suppressed" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "END",
              outcome:
                "What actually happened, and by a narrower margin than most accounts of the war's end fully convey: the coup's leaders never secured the Imperial Guard division's actual commanding general, who refused to join them and was killed for it, and without his authority to move the garrison, the plot stalled in the palace's own corridors, searching for a recording it never found before dawn brought loyalist officers who ended it. The war minister who might have stopped it with a word, Anami, took his own life that morning instead, leaving a note that apologized to the Emperor for the crime his own ministry's failure to fully control its officers represented. The broadcast airs at noon on August 15th, the first time most of Japan has ever heard the Emperor's voice, announcing a surrender he does not once call by that name.",
            },
            {
              label: "The coup succeeds long enough to matter: the recording is seized, and the broadcast does not air on schedule",
              advisor: { name: "Anami", quote: "I did not order this. I am telling this council plainly that I understand why it happened, and I am not certain, tonight, that I am prepared to be the man who orders it stopped." },
              setFlags: { coupOutcomePath: "succeeded", speculativePath: true },
              impact: { readiness: -2, pipeline: -1, initiative: 2 },
              next: "END",
              outcome:
                "The real coup came within hours of this outcome, not a fabricated one: the plotters searched the Imperial Household Ministry's grounds for the recording through the night and, in this history, find it. The broadcast that historically told Japan the war was over doesn't air on the fifteenth. What actually happens to the surrender the Emperor already decided on, delayed rather than reversed, contested by a faction that now holds a recording rather than a country, and Anami's own ambiguous position, still war minister, still commanding an army whose younger officers just did something he didn't order and won't quite condemn, is an open question no historical outcome exists to answer.",
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
            "There is no historical record past this point: the actual Suzuki cabinet asked the Emperor to break exactly this deadlock, and he did. Here, that request is never made, and the Big Six's own three-three split stands, unresolved by the one mechanism that historically, however unusually, actually resolved it. Two cities are gone. A Soviet army is inside Manchuria and not stopping at the border. The war ministry's hardliners hold their three votes for conditional surrender, the peace faction holds its three for immediate surrender on the throne alone, and nobody in the room has the authority, or the willingness, to be the deciding vote a council built for consensus was never designed to produce without one.",
          choices: [
            {
              label: "Break ranks: one member of the war ministry's own bloc crosses to end the deadlock without invoking the Emperor at all",
              advisor: { name: "Togo", quote: "I do not need six votes. I need one man on the other side of this deadlock to decide that a third city is a worse outcome than losing an argument. I am asking for exactly one." },
              setFlags: { deadlockPath: "brokenByDefection" },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "END",
              outcome:
                "A resolution the actual deadlock never needed, because the actual deadlock was broken a different way. Whether a single minister crossing his own faction under exactly this pressure, a third bomb's real possibility, a Soviet army already past the point of being negotiated with, is more or less plausible than the historical Emperor's own intervention is a question with no evidence to settle it either way. It's the kind of quiet, unrecorded defection real deadlocked councils sometimes resolve through, and sometimes don't.",
            },
            {
              label: "The deadlock holds: no third path emerges, and Ketsu-Go proceeds toward whatever invasion actually arrives",
              advisor: { name: "Anami", quote: "Then we have not decided. I understand what that costs. I am not the one who created this deadlock, and I am not going to manufacture a resolution to it that this council itself never actually reached." },
              setFlags: { deadlockPath: "unresolved" },
              impact: { readiness: -3, pipeline: -2, initiative: 1 },
              next: "theDeadlockHolds45",
              outcome:
                "The open ending this fork was always building toward: a war council too evenly split to decide, a military defense still nominally in force, and an American invasion timetable that, historically, was never actually tested because the war ended first. Whether Ketsu-Go's own logic, that the invasion's cost could be made politically unbearable, would have held up against the actual Operation Olympic and Coronet planning is a question the real war's own ending spared everyone from ever having to answer. This history doesn't get spared it.",
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
            "There is no historical record past this point, and this node says so honestly rather than inventing a resolution the actual deadlock never reached. What's real: a third weapon's core, in production since before Nagasaki, on a schedule Groves' own communications to Marshall put at ready for shipment within days regardless of anything this room decides. What's also real: the night of August 14th–15th, in the actual historical record, saw the single largest conventional bombing raid of the entire war, over a thousand aircraft, hit Japan, timed after the historical Emperor's surrender decision had already been made privately but before it was ever announced publicly. A council that never reaches that decision doesn't get to skip that raid, or the ones scheduled after it. And the Soviet army already inside Manchuria is, by this point in the real record, also inside Korea and moving on southern Sakhalin, with nothing in Tokyo's own paralysis slowing it down.",
          choices: [
            {
              label: "IGHQ orders no change: the deadlock in the war ministry is a civilian government question, not a military one, and the military keeps executing Ketsu-Go's existing plan without waiting on Tokyo to decide anything",
              advisor: { name: "Umezu", quote: "The council's paralysis is their failure to resolve, not mine to solve for them by exceeding my own authority. This staff continues preparing the defense it was already preparing. That is the one thing that was never actually in question here." },
              setFlags: { finalDeadlockPath: "militaryProceeds" },
              impact: { readiness: -1, pipeline: -1, initiative: 0 },
              next: "END",
              outcome:
                "The honest version of institutional paralysis: not a dramatic collapse, just every part of the government continuing to execute whatever it was already executing, because nobody with the authority to change it has actually changed it. The military keeps preparing a home-islands defense against an invasion nobody in this specific history knows the real timetable for. The war ministry's three votes and the peace faction's three votes stay exactly where they were. Whatever ends this, a fourth weapon, a fifth, an invasion actually landing, a defection nobody's made yet, isn't recorded here, because nothing in this specific room decided it.",
            },
            {
              label: "Send the deadlock itself to the Emperor as a formal question, without asking him to break it: state plainly that the council could not decide, and let him choose what, if anything, that information changes",
              advisor: { name: "Kido", quote: "There is a real difference between asking him to cast the deciding vote and simply telling him the vote could not be cast. I am not certain the distinction is one His Majesty will accept. I am certain it is the only honest option this council has left." },
              setFlags: { finalDeadlockPath: "informedAnyway" },
              impact: { readiness: 0, pipeline: 0, initiative: -1 },
              next: "END",
              outcome:
                "A real, narrow institutional distinction, not a resolution dressed up as one: informing the Emperor that his own council failed to reach consensus is not the same act as the historical request that he personally break the tie, even if what happens after the information reaches him is not something this specific council gets to decide or predict. Whether an Emperor told plainly that his ministers could not agree responds any differently than one formally asked to decide for them is a real, open question this room hands off rather than answers. History does not record what he does with information nobody in the actual timeline ever gave him this way.",
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
            "There is no historical precedent for this specific negotiating position: a Japan entering its final surrender talks with genuine remaining military capability rather than the exhausted, fuel-starved state the actual August 1945 cabinet had to negotiate from. Togo's channel reaches Washington carrying an offer backed by something real, not just an appeal to end the killing. Whether an intact force still in the field changes what unconditional surrender doctrine is willing to bend on is the question with no historical answer to check it against.",
          choices: [
            {
              label: "Press for the Emperor's institutional preservation as the core, non-negotiable term",
              advisor: { name: "Togo", quote: "Every other term in this offer, I am prepared to see negotiated down. This one, I am not. It is the one term this war ministry has never once wavered on, and I am not going to be the minister who wavers on it for them." },
              setFlags: { termsPath: "throne" },
              impact: { readiness: 1, pipeline: 0, initiative: 0 },
              next: "END",
              outcome:
                "The one term the historical war ministry held firm on, here backed by a negotiating position with real capability behind it rather than exhaustion alone. Whether that changes anything about how firmly Washington was ever going to hold unconditional surrender doctrine is honestly uncertain, serious historians remain divided on how much military weakness versus military strength shapes an adversary's willingness to bend a declared policy, and that dispute isn't resolved here by picking a side.",
            },
            {
              label: "Press for broader terms: the throne, but also a negotiated timeline for withdrawal rather than immediate occupation",
              advisor: { name: "Umezu", quote: "If this army still has something to negotiate with, I want more than the throne asked for. I want time, and I want it asked for now, while there is still a position to ask from." },
              setFlags: { termsPath: "broader" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: "END",
              outcome:
                "A harder, more ambitious ask than Togo's own instincts favored, using genuine remaining strength as leverage for more than the historical negotiation ever had standing to request. Whether a still-intact Japan asking for a negotiated occupation timeline, rather than the unconditional immediate occupation the actual war ended with, was ever a realistic possibility is exactly the kind of counterfactual historians of the period treat with real skepticism: American domestic and military pressure for a swift, total end to the war was substantial regardless of what Japan still had in the field.",
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
            "The Southern Resource Area falls even faster with every carrier committed to it rather than held back for Hawaii, and the U.S. Pacific Fleet, battleships and carriers both, sits intact at Pearl Harbor. Washington faces landings across a string of colonial possessions and mandates without the single galvanizing morning that, historically, ended the argument over intervention overnight. Congress remains exactly as divided as it was on December 6th. Whether that division holds once Manila and Singapore fall regardless is uncertain, and it's a question no single decision from this seat can fully answer, since American domestic politics were never Imperial Headquarters' call to make.",
          choices: [
            {
              label: "Spend every advantage the intact resource area buys — accelerate the Burma and Indies timetable",
              advisor: { name: "Sugiyama", quote: "We have bought time with something more valuable than a strike on Hawaii: an enemy who has not yet decided he is at war. Spend that time before he decides." },
              setFlags: { southPath: "accelerate" },
              impact: { readiness: 1, pipeline: 2, initiative: 1 },
              disabledReason: meters.pipeline <= -2 ? "Tanker capacity is already short of what a compressed timetable would need to move the resource area's output home at all. Accelerating further just strands oil at the source." : undefined,
              gateCheck: { meter: "pipeline", threshold: -2, label: "Pipeline" },
              next: "burmaRangoon42",
              outcome:
                "The resource area is secured on a compressed timetable historians of this path judge Japan's actual 1942 supply chain could not fully absorb: oil and rubber flowing faster than tankers exist to move them home. Whether an America that never had its Pearl Harbor still declares war over Manila, Singapore, and the Indies alone is the question Tokyo now has to sit with, watching Washington from the outside.",
            },
            {
              label: "Hold back: consolidate the resource area's gains and avoid provoking Washington further than the landings already have",
              advisor: { name: "Nagano", quote: "We have what the war was fought for. I see no reason to hand the Americans another reason to finish deciding what they haven't decided yet." },
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
                    "The bet pays off, at least for now. Without a single galvanizing attack to point to, Congress stays roughly as split as it was in December — isolationist voices holding real ground against intervention. Tokyo has bought something history never gave it: time to watch Washington argue with itself.",
                },
                {
                  weight: (() => { const w = modWeight(45, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "Manila and Singapore prove enough on their own",
                  setFlags: { congressResult: "unified" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The bet doesn't pay off. Manila and Singapore, it turns out, are enough on their own: a Congress that stayed divided over Pearl Harbor's absence unifies anyway once the scale of the landings becomes clear, on a slower timetable than history's single morning but arriving at very nearly the same place. IGHQ's blind spot into Washington's internal argument turns out to have cost more than it saved.",
                },
              ],
            },
            {
              label: "Push further still: commit the fleet toward an outright invasion of Australia",
              advisor: { name: "Sugiyama", quote: "I am required to say plainly what the Army's own planners have already told me: we do not have the shipping to invade Australia, and no version of this war ends with us finding it. I am recommending against this, not proposing it." },
              setFlags: { southPath: "australiaGamble" },
              impact: { readiness: -4, pipeline: -4, initiative: 2 },
              disabledReason: meters.pipeline <= -1 ? "The Army's own transport-tonnage study already says no at this pipeline level, let alone a lower one. There is no honest path to greenlighting this." : undefined,
              gateCheck: { meter: "pipeline", threshold: -1, label: "Pipeline" },
              next: "australiaLanding42",
              outcome:
                "This is the clearest example of a bad decision, not just a different one. An Australia invasion was studied and rejected by Japan's own Army General Staff in real 1942 planning, for the same reason the logistics have said no everywhere else it comes up: the shipping simply doesn't exist, and committing to try anyway starves every other front of the tonnage this war was really going to be decided by. Whatever the intact resource area bought Tokyo, it's about to get spent on a fantasy the Army's own planners already knew wasn't real.",
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
            "There is no historical record past this point: the actual Army General Staff rejected an Australia invasion before it reached anything resembling an operational plan, so everything from here is built on the shipping arithmetic Sugiyama's own staff already ran — extrapolation, not historical record. The invasion fleet, assembled by stripping transport tonnage from Burma, the Solomons, and the home-waters reserve simultaneously, reaches the northern Australian coast near Darwin still short of the escort and sealift the Army's own studies said this operation required before a single soldier boarded a ship.",
          choices: [
            {
              label: "Force the landing regardless: get troops ashore before the fleet's escort thins any further",
              advisor: { name: "Sugiyama", quote: "I told this command in the planning room what this would cost. I am not going to pretend the arithmetic has changed now that the ships are actually at sea." },
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
                    "Troops get ashore and hold a strip of coastline for several weeks, long enough for Tokyo's propaganda to call it a landing rather than what the Army's own logisticians already know it is: a garrison with no realistic resupply, on a continent with nothing resembling the road or rail network needed to project power inland even if the beachhead held indefinitely. It doesn't hold indefinitely.",
                },
                {
                  weight: (() => { const w = modWeight(25, meters.pipeline); return Math.max(5, 100 - w); })(),
                  title: "The landing fails before it establishes anything",
                  setFlags: { australiaResult: "disaster" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier outcome, and the one Sugiyama's own staff study actually predicted: escort thinned past the point of covering the transports, Allied air power operating from bases the invasion fleet never had the strength to neutralize first, and a landing that fails to establish a defensible position before the ships carrying its follow-on supply are forced to turn back or are sunk trying.",
                },
              ],
            },
            {
              label: "Abort the landing: recall the fleet before the losses compound further",
              advisor: { name: "Yamamoto", quote: "This operation did not have my support in the planning room, and pretending it can still be salvaged now that it's failing in exactly the way I was told it would." },
              setFlags: { australiaLandingPath: "abort" },
              impact: { readiness: -1, pipeline: -2, initiative: -1 },
              next: "burmaRangoon42Delayed",
              outcome:
                "A recall rather than a rout. The fleet turns back before the landing fully commits, sparing the transports and their escort from the losses a pressed landing would have added on top of everything already spent assembling this operation in the first place. What doesn't come back is the tonnage stripped from three other fronts to make the attempt, tonnage Burma, the Solomons, and the home-waters reserve are all short exactly this much of for however long it takes to replace.",
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
            "Reports filtering back through the Swiss and Swedish legations paint a Congress no less divided than it was the week before the landings began: isolationist blocs still argue that colonial possessions eight time zones away aren't worth American blood, while the fall of Singapore and Manila have hardened the interventionist case in equal measure. Nobody at Imperial Headquarters can actually poll the United States Senate, and no pretense is made otherwise: this is speculative fiction built on a premise, not a forecast. What IGHQ can decide is what to do with the ambiguity itself while it lasts." +
            (flags.southPath === "accelerate"
              ? " The compressed resource-area timetable has bought speed. It hasn't bought certainty about what Washington does next."
              : " The consolidated, unprovocative posture has bought caution. It hasn't bought certainty either.") +
            (flags.ceylonPath === "invade"
              ? " One thing does cut through the ambiguity: a British Empire threatened in the Indian Ocean, its Middle Eastern oil route under real pressure, is a British Empire with every reason to lobby Washington harder for intervention than a Congress still arguing over Pacific colonies alone would otherwise hear. Ambiguity about America's mood was never going to survive contact with a desperate ally asking for help."
              : ""),
          choices: [
            {
              label: "Test a negotiated settlement through neutral channels: offer open trade in the resource area in exchange for recognition of the conquests",
              advisor: { name: "Togo", quote: "We have never fought a war we expected to end in an unconditional victory over the United States. If there is a table where this stops now, on terms we can live with, I would like to find it before someone decides there isn't one." },
              setFlags: { washingtonPath: "negotiate", suspicion: (flags.suspicion || 0) + 2 },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "americaDecides44",
              outcome:
                "A diplomatic overture that reflects a period hope inside the Foreign Ministry — that a fait accompli, offered with open trade attached, might be accepted rather than fought over. Whether Washington's divided Congress would have taken that offer seriously, or read it as proof Japan feared exactly the war it was hoping to avoid, is not a question that can be answered with any real confidence: there's no polling data for a Senate that, in this history, never had its Pearl Harbor to unify it, and inventing one would be fiction dressed as prediction. What's certain is only that Tokyo tried the quieter door before assuming the louder one was the only one left, and the years since have to answer whether anyone in Washington walked through it.",
            },
            {
              label: "Harden the whole resource arc now, on the working assumption that war comes regardless",
              advisor: { name: "Sugiyama", quote: "Being wrong about a war that never comes costs less than being right about one we weren't ready for. Fortify while the ambiguity holds. It will not hold forever." },
              setFlags: { washingtonPath: "fortify" },
              impact: { readiness: 2, pipeline: -1, initiative: 1 },
              disabledReason: meters.pipeline <= -3 ? "There isn't the construction material and shipping capacity left to fortify an arc this size. Hardening it further isn't available at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "americaDecides44",
              outcome:
                "The resource arc, from Burma to the Indies to the mandates, hardens into something considerably tougher than the historical 1942 perimeter. Its garrisons and coastal defenses are built on borrowed time rather than the improvisation the real war forced on them. Whatever war eventually arrives, if one does, meets a defense in far better order than history's ever was. What it costs is the diplomatic window this path never tests, and the years since still have to answer whether one was ever there to test.",
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
            "Two years into a Pacific standoff no shooting war has yet confirmed, IGHQ's intelligence on Washington's actual intentions remains exactly what it was in 1942: educated guessing, not certainty. Congress has authorized rearmament at a pace that could support entry into the Pacific at any point, but has passed no declaration, and American shipping continues to move around the resource arc's edges without direct confrontation. This is speculating about American domestic politics across several compounding years now, a far less confident position than anywhere else in the main historical spine.",
          choices: [
            {
              label: "Spend the remaining window preparing for war, betting the standoff won't hold forever",
              advisor: { name: "Nagano", quote: "A war this size does not wait forever at the edge of a resource line this valuable. I would rather spend our remaining certainty preparing for the reckoning than pretending the ambiguity is a permanent state." },
              setFlags: { americaPath: "prepareForWar" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "aQuietEmpire45",
              outcome:
                "A bet that the standoff is a delay, not a resolution. Defenses and stockpiles get built against a war treated as close to inevitable once any single trigger, in any theater, finally forces Washington's hand. Whether that trigger ever arrives in this history is the question the final chapter on this path has to sit with.",
            },
            {
              label: "Keep building the resource-area empire as is, betting Congress never fully commits",
              advisor: { name: "Togo", quote: "Every year this standoff holds is a year I did not have to be wrong about how this ends. I am not going to abandon that record now on the assumption that a war we have successfully avoided for two years is somehow still coming." },
              setFlags: { americaPath: "isolatedEmpire" },
              impact: { readiness: 2, pipeline: 1, initiative: -2 },
              disabledReason: meters.readiness <= -5 ? "There isn't the institutional confidence left to bet on Congress staying divided at this readiness level. This staff can't sell optimism it doesn't have." : undefined,
              gateCheck: { meter: "readiness", threshold: -5, label: "Readiness" },
              next: "aQuietEmpire45",
              outcome:
                "The more optimistic, and plainly the less historically grounded, bet of the two available here. A divided, isolationist-leaning Congress never fully rearming for a Pacific war it was never directly attacked into is a historical possibility with real support, but it's also the possibility with the least actual evidence behind it. What Japan built with two peaceful years is the question the final chapter on this path has to answer.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Actively work to keep Congress divided: fund and expand the same kind of American opinion apparatus Tokyo already ran once, rather than just hope the division holds on its own",
                    advisor: { name: "Togo", quote: "This ministry ran a real committee in San Francisco once, before the war that never happened here, aimed specifically at the educated Americans with the standing to actually move Congress. I see no reason not to fund a larger version of it now, with two additional years and a genuine ambiguity to work with instead of a fait accompli to explain away." },
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
            "By 1945, in the historical record, Japan surrendered under the weight of two atomic bombs, a firebombing campaign, and a Soviet declaration of war. None of that has happened here, because none of the chain of events that produced it, Pearl Harbor, the carrier war, the island campaigns, ever started. What Japan has instead is a resource empire, several years old, that has never been tested by the war the historical record really fought. Whether this standoff has ever been stable, or was simply a war deferred rather than a war avoided, is the question Imperial Headquarters has to decide how to treat." +
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
              advisor: { name: "Nagano", quote: "We have gone longer without this war than most of this staff believed possible in 1941. I am prepared to call that something other than luck." },
              setFlags: { quietEmpirePath: "standDown" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "newWorldOrder45",
              outcome:
                "The empire stands down from war footing and redirects toward administration and consolidation. What the late 1940s actually bring is open: an America whose attention, absent a Pacific war to fight, turns fully toward Europe and the opening Cold War might simply leave a completed Japanese conquest unaddressed for years, the way Manchukuo sat unaddressed through the 1930s. Or a Japan holding the Indies' oil and Malaya's rubber without ever having been defeated becomes exactly the kind of unresolved colonial question a postwar order built around decolonization has no comfortable place for. Both are plausible. What's certain is that the standoff isn't the last question this government has to answer.",
            },
            {
              label: "Treat the standoff as borrowed time: commit to permanent war footing regardless of the peace's apparent stability",
              advisor: { name: "Sugiyama", quote: "Borrowed time spent as though it were permanent is how empires lose wars they had years of warning about. We do not stand down. We keep building for the day this stops being quiet." },
              setFlags: { quietEmpirePath: "permanentReadiness" },
              impact: { readiness: -1, pipeline: -2, initiative: 1 },
              next: "newWorldOrder45",
              outcome:
                "A Japan permanently mobilized against a war that has still never actually arrived, at an ongoing cost to the civilian economy the historical Japan never had to sustain for this many additional years. If the reckoning does eventually come, in 1946, in 1950, whenever American strategic attention finally turns back to the Pacific, this is the version of Japan best positioned to meet it. If it never comes, this is also the version of Japan that spent a decade bankrupting itself preparing for a ghost. What this government does about the wider world in the meantime is a separate question, and one this footing doesn't answer by itself.",
            },
            ...(meters.pipeline >= 6
              ? [
                  {
                    label: "Convert to an armed-neutrality reserve model: low standing costs, a citizen-militia structure built for rapid mobilization rather than permanent readiness or genuine demobilization",
                    advisor: { name: "Sugiyama", quote: "This isn't a choice between spending everything and spending nothing. Switzerland and Sweden built real deterrence out of a militia that costs almost nothing to maintain standing and almost everything to actually fight against, once called up. I would rather this empire copy that structure than either bankrupt itself keeping a standing army fed for a war that hasn't come, or gut its own deterrence entirely." },
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
            "The United Nations Charter is signed at San Francisco in June 1945 by the fifty Allied nations that declared war on the Axis, with enemy-state clauses written directly into its text that name Japan specifically. Bretton Woods, a year earlier, built the IMF and World Bank around the same Allied coalition. None of it was written with this Japan in mind: a government still formally allied to Germany by treaty, still at war with China, but never at war with the United States, Britain, or the other founding powers in any sense the Charter's own drafters anticipated. Whether that technicality means anything to the men actually drawing the enemy-state list is a question nobody in Tokyo can answer from here.",
          choices: [
            {
              label: "Petition for recognition: argue formally that a Japan never at war with the Allied powers doesn't belong on their enemy list",
              advisor: { name: "Togo", quote: "We have never fired on an American or British soldier. I do not know if that argument moves men who watched us sign a pact with Germany and fight a war in China regardless. I know it is the only argument we have." },
              setFlags: { newOrderPath: "petition" },
              impact: { readiness: 0, pipeline: 1, initiative: -2 },
              next: "coldWarOpening48",
              outcome:
                "A formal case, built on a technicality: the Charter's enemy-state clauses were written for governments the Allies had defeated, and this one never was. Whether San Francisco's delegates, still fighting the historical war's final months against the historical Japan even as this petition arrives, have any appetite for the distinction is really uncertain. The historical record offers no guide here at all, Japan didn't join the UN until 1956, eleven years late, after a peace treaty and a war it lost first. This Japan is asking a body built to process defeated enemies to classify it as something else entirely, and there's no precedent anywhere in the record for how that request gets answered.",
            },
            {
              label: "Decline engagement: treat the new international order as an Allied club with no genuine place for an unconquered Japan",
              advisor: { name: "Sugiyama", quote: "Begging for a seat at a table built by men who would still rather this empire didn't exist is not a delegation I intend to send. Let them write their charter. We will still be here when it's finished." },
              setFlags: { newOrderPath: "decline" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "coldWarOpening48",
              outcome:
                "A Japan that opts out of the postwar order before the postwar order has to decide whether it wants Japan in it. No IMF standing, no World Bank access, no seat at any table the Charter's fifty signatories built, and also no formal enemy-state designation ever tested or confirmed. Whether that's a durable equilibrium or just a different, quieter version of the same deferred question the empire has been living with since the war that never started is not something this government resolves by declining to ask it.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Work Chile specifically, not the full Charter body: a real signatory whose own war against Japan is barely more genuine than this one",
                    advisor: { name: "Togo", quote: "Chile signed the Charter having declared war on us in February, months after the fact, for reasons that had considerably more to do with founding membership than with any battle either of us fought. I would rather work one delegate who understands exactly what that kind of declaration is worth than petition fifty who don't." },
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
            "By 1948, the Cold War the historical record's own Japan spent these same years rebuilding under American occupation is fully underway here too, and Washington's China policy is collapsing in real time as Mao's forces close in on final victory. The historical United States, watching its investment in a defeated, occupied Japan become the anchor of its whole Pacific containment strategy, rewrote its own occupation priorities specifically to rebuild Japanese industry as a bulwark against communism. This Japan was never occupied and never needed rebuilding. What it has, instead, is an intact industrial base, a functioning empire, and a Communist government about to take power next door, exactly the kind of anti-communist asset containment strategy is built to court, if Washington can find a way to treat a government it spent years refusing to recognize as anything other than an unresolved enemy." +
            (flags.newOrderPath === "petition"
              ? " The petition Togo's ministry filed three years ago is still sitting, formally unanswered, in a filing cabinet in a UN building that has other things on its mind. It may finally be worth revisiting."
              : flags.newOrderPath === "chileChannel"
              ? " The Chilean channel opened three years ago never produced a formal resolution, but it left this government one real relationship inside the Charter system that the flat refusal never did, a delegate who already understood the argument before Washington's own China problem gave that argument new relevance."
              : " Sugiyama's government never asked for a seat at the table. It's about to find out whether the table starts asking for it instead."),
          choices: [
            {
              label: "Open informal channels to Washington: offer the resource area's stability as a Cold War asset, formal recognition or not",
              advisor: { name: "Yoshida", quote: "A career in this ministry was not spent so that we stand outside a door the Americans are now, for their own reasons, considering opening. Whatever recognition eventually costs, it costs less than staying outside it." },
              setFlags: { coldWarPath: "align" },
              impact: { readiness: 1, pipeline: 2, initiative: 0 },
              next: "END",
              outcome:
                "A quiet, transactional opening, built on the same logic that rehabilitated the historical Japan's own postwar economy: an unconquered empire with real industrial capacity and a stable anti-communist government is worth more to Washington's containment strategy than the unresolved enemy-state question is worth continuing to enforce. Formal UN membership, if it ever comes, likely arrives this way rather than through the petition itself, not because the legal argument won, but because the Cold War made the argument stop mattering as much as the alignment did.",
            },
            {
              label: "Hold the line: continue treating recognition as beneath negotiation, whatever Washington's China problem is worth to them",
              advisor: { name: "Sugiyama", quote: "They ignored us when it cost them nothing. I am not interested in being useful to them now that it costs them something. Let this empire remain exactly as unresolved as they left it." },
              setFlags: { coldWarPath: "holdLine" },
              impact: { readiness: -1, pipeline: -1, initiative: 2 },
              next: "END",
              outcome:
                "A Japan that declines the opening the historical record's own postwar Japan never had the standing to decline, since it was occupied and had no independent policy to assert one way or the other. Pride, or genuine distrust of an opening this transactional, or both, keep this empire exactly as unresolved as it's been since 1945. Whether that's a durable position once Washington's containment strategy really needs Pacific partners, or a stance this government eventually can't afford to hold, is a question the record has no further chapters to answer.",
            },
            ...(meters.pipeline >= 6
              ? [
                  {
                    label: "Get ahead of it: propose a formal economic and security partnership matching what Washington's own internal policy is already discussing, rather than wait for an informal channel to slowly become one",
                    advisor: { name: "Yoshida", quote: "Washington's own security establishment issued a real, formal policy directive in October 1948 laying out exactly this kind of relationship for an occupied, war-damaged partner. We are neither occupied nor war-damaged, and I see no reason that should count against us at the table. I would rather this government match their paper with a proposal of equal weight than wait for an informal signal to slowly earn one." },
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
              advisor: { name: "Yamamoto", quote: "A fleet in being is worth something. A fleet used to hold the perimeter before the Americans finish building their airfield is worth considerably more." },
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
                    "Four intact carriers, committed before the Americans finish their airfield, are enough to contest the landing directly, something the historical campaign, fought after Midway's losses, never had the strength to attempt. Henderson Field never becomes the base that bled Japan's naval air arm white over six months in history's own war.",
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
                "A pre-emptive move into the Solomons with the fleet carrier force still intact. Whether four carriers committed early enough could have denied Henderson Field's construction entirely is a real, open strategic question — what's not in doubt is that this path never pays Midway's price, for better or worse, and the war's later chapters unfold from a materially different starting position than the one history actually reached.",
            },
            {
              label: "Hold the fleet in reserve: let the perimeter's static defenses absorb the first American attacks",
              advisor: { name: "Inoue", quote: "Let them break themselves against Rabaul's air garrison first. We spend the fleet when spending it decides something." },
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
              advisor: { name: "Ugaki", quote: "We have already done what Midway was supposed to make possible eventually: degrade the road to Australia. Finish the job while the Americans are still reorganizing around the ambush that never happened." },
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
              advisor: { name: "Nagumo", quote: "We have four carriers that were supposed to be at the bottom of the Pacific by now. I would like to keep it that way a little longer before we test our luck a second time." },
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
                    advisor: { name: "Yamamoto", quote: "Our own submarine force hit Sydney Harbor, shelled Newcastle, and sank ships off the coast for a few months already, and let it trail off into what the Australians themselves are already calling nuisance attacks. I am not interested in a nuisance. I am interested in what the same campaign does if this command actually sustains it instead of letting it fade." },
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
              label: "Launch the full invasion — take Fiji and New Caledonia, sever Australia's supply route completely",
              advisor: { name: "Ugaki", quote: "Coral Sea couldn't afford this. We can. I don't see the argument for leaving the one prize this war was fought over sitting on the table because history's navy couldn't reach it." },
              setFlags: { fsPath: "invade" },
              impact: { readiness: -3, pipeline: -1, initiative: 2 },
              disabledReason: meters.pipeline <= -2 ? "The supply chain doesn't have the tonnage left to sustain an amphibious invasion this far south. An already-stretched arc can't stretch further." : undefined,
              gateCheck: { meter: "pipeline", threshold: -2, label: "Pipeline" },
              next: "yamamotoDeath43",
              outcome:
                "The invasion goes ahead: Fiji and New Caledonia both taken, Australia's American lifeline cut at the root rather than merely degraded. It's the single biggest prize offered along this path, and also the point at which Japan's supply chain, already stretched across an arc no historical logistics plan was built to sustain this far south, starts to show exactly the strain Coral Sea's cancellation was meant to avoid. The mainland front doesn't care how the South Pacific went, and it's about to make its own demands on the same dwindling reserve of divisions.",
            },
            {
              label: "Stop short: consolidate the raiding gains already won rather than risk the overextension Coral Sea's cancellation was meant to prevent",
              advisor: { name: "Nagano", quote: "Coral Sea taught the actual Navy General Staff a lesson about reaching past what the supply chain can carry. I see no reason this fleet gets to unlearn it just because the carriers survived." },
              setFlags: { fsPath: "consolidate", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 1, initiative: -1 },
              next: "yamamotoDeath43",
              outcome: meters.pipeline <= -4
                ? "Not even an orderly stop, at this pipeline level, so much as the campaign simply stopping under its own exhaustion: the raiding effort halts because there's no longer the shipping to sustain it further, not by a controlled choice to hold what's already won. The Australia route degraded but not severed, the fleet preserved mostly by having nothing left to spend rather than by careful restraint."
                : "The raiding campaign stops at what it's already won: the Australia route degraded but not severed, the fleet intact, the overextension that historically killed Operation FS before it started avoided a second time by choice rather than by Coral Sea's losses. Whether Australia's supply route recovers on its own once the raiding pressure eases is a question this South Pacific fleet doesn't get to answer in isolation: Imperial Headquarters has a mainland front of its own demanding the same shrinking reserve of divisions, regardless of how this campaign went.",
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
              advisor: { name: "Ozawa", quote: "Pilots we did not lose in the Solomons are pilots we can still train the next generation on. That pipeline is the only asset in this navy that compounds." },
              setFlags: { earlyPerimeterPath: "rebuild" },
              impact: { readiness: 2, pipeline: -1, initiative: -1 },
              next: "yamamotoDeath43",
              outcome:
                "A rebuilding strategy with a real historical logic behind it: Japan's actual carrier air groups never recovered from the Solomons' attrition, and a preserved veteran cadre training replacements a year earlier than history allowed is a honestly different foundation for whatever fleet action comes next. That foundation is about to be tested by a mainland crisis that's coming regardless of how the Solomons went.",
            },
            {
              label: "Reinforce Bougainville and Rabaul's static defenses: dig the perimeter in rather than rebuild for offense",
              advisor: { name: "Kusaka", quote: "A pilot cadre saved for a future battle is a pilot cadre that has to survive until that battle arrives. I would rather spend the time we bought making this line unbreakable." },
              setFlags: { earlyPerimeterPath: "fortify" },
              impact: { readiness: 1, pipeline: -2, initiative: -2 },
              disabledReason: meters.pipeline <= -4 ? "There isn't construction material and shipping left to harden this perimeter further. It holds what it already has, nothing more." : undefined,
              gateCheck: { meter: "pipeline", threshold: -4, label: "Pipeline" },
              next: "yamamotoDeath43",
              outcome:
                "The perimeter hardens into a difficult line to crack, built on ground chosen with the benefit of not having bled the destroyer force dry over Guadalcanal first. Whether it changes the pace of the historical island-hopping campaign that eventually bypassed and starved Rabaul anyway is one open question; what isn't open is that the mainland front's own 1944 crisis shows up right on time regardless of how well the Solomons perimeter held.",
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
            "The approach to Moscow goes out earlier than it historically did, while the Soviet Union is still, on paper, bound by the Neutrality Pact both governments signed in April 1941. What Tokyo doesn't know, and has no way to find out, is that Stalin's actual commitment to enter the Pacific war was already made months ago at Yalta, a promise to Roosevelt of Soviet entry roughly three months after Germany's surrender, in exchange for territorial concessions in Manchuria and the Kuril Islands that have nothing to do with whether Japan asks nicely. Whether an earlier approach changes anything about a decision already settled in a room Tokyo was never in is the real, unanswerable question behind this whole channel.",
          choices: [
            {
              label: "Press the channel formally: request that Moscow mediate terms with Washington",
              advisor: { name: "Togo", quote: "What promises have already been made in rooms this ministry was not invited into, I cannot say. What I do know is that asking is the only version of this argument available to us, and I would rather ask early than not at all." },
              setFlags: { moscowPath: "pressed" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "END",
              uncertain: [
                {
                  weight: 15,
                  title: "Moscow's neutrality holds",
                  setFlags: { moscowResult: "neutralityHolds" },
                  impact: { readiness: 1, pipeline: 1, initiative: 0 },
                  outcome:
                    "The rarest realistic branch on offer, and it says so plainly: for reasons no surviving account can reconstruct, whatever calculus produced Stalin's real commitment at Yalta doesn't hold here, and the Soviet declaration of war that historically arrived in the war's final week simply never comes. Japan fights the rest of this war against the Western Allies alone, without the two-front collapse that historically broke the war ministry's last argument. Whether that changes the war's actual ending, or simply removes one of the two shocks that historically arrived in the same week, is a question this timeline reaches without history's own answer available to check it against.",
                },
                {
                  weight: 85,
                  title: "The declaration arrives regardless",
                  setFlags: { moscowResult: "declarationArrives" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome, and the one the actual Yalta record makes almost impossible to avoid: whatever this channel achieves diplomatically, it doesn't touch the commitment Stalin already made to Roosevelt months earlier, for reasons entirely his own. The declaration of war lands within days of when it actually did, redeployment from the European front already well underway by the time this approach even reaches Moscow's desk.",
                },
              ],
              outcome:
                "A formal request built on a real diplomatic channel Togo's ministry used in the war's final weeks, opened earlier here in the hope that more lead time changes Moscow's answer. What can be stated plainly here and what it can't are different things: it can state that Stalin's real, documented commitment to Roosevelt at Yalta had nothing to do with how earnestly Tokyo asked. Whether an earlier ask could have changed a decision already made in a different room entirely is exactly the kind of counterfactual serious historians treat with real skepticism, and no pretense is made otherwise.",
            },
            {
              label: "Offer territorial concessions directly: propose ceding the southern Kurils in exchange for continued neutrality",
              advisor: { name: "Sato", quote: "I have served in Moscow long enough to know this government does not trade in gestures. If neutrality is for sale, it is being sold at a price, and I would rather know that price than continue guessing at Soviet intentions from cables alone." },
              setFlags: { moscowPath: "concessions", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: -1, pipeline: 0, initiative: -1 },
              next: "END",
              outcome:
                "A direct territorial offer, built on the real historical fact that ambassador Naotake Sato's actual cables from Moscow expressed exactly this kind of frustration with an unreadable Soviet position. What this offer can't overcome is timing: the Kuril Islands and southern Sakhalin were already promised to Stalin by Roosevelt and Churchill at Yalta, secured through the Allied coalition rather than through any deal Tokyo could offer directly. Japan is attempting to purchase, with territory, a concession the other side has already been promised for free by someone else entirely.",
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
            "Abandoning the Philippines rather than spending the fleet at Leyte preserved the Combined Fleet's remaining hulls, and cost the oil route from the Indies months ahead of the historical timetable regardless. A navy with fuel to move but nowhere worth moving to is not, in any practical sense, a navy. The question Ketsu-Go's advocates and the diplomatic faction are both circling is the same one the historical record eventually reached anyway: how does this war end." +
            (flags.hokushinPath === "south"
              ? " Nagano argued back in 1941 that this navy's whole case was resources, not territory for its own sake. A fleet preserved but stranded is close to the exact failure mode his own argument against Kantokuen was built to avoid, and if he's still in the room for this conversation, he knows it."
              : "") +
            (flags.doolittleAirmenPath === "pow"
              ? " Whatever war crimes accounting eventually comes, this command's decision to hold the captured Doolittle airmen as conventional prisoners rather than execute them on a thin tribunal finding is at least one count that can be stated honestly."
              : ""),
          choices: [
            {
              label: "Commit the preserved fleet to a final defense of the home waters",
              advisor: { name: "Toyoda", quote: "We kept this fleet alive for a reason. That reason is now." },
              setFlags: { finalPath: "lastStand" },
              impact: { readiness: -3, pipeline: -1, initiative: 1 },
              disabledReason: meters.pipeline <= -4 ? "There isn't fuel left for even a single final sortie. Whatever this fleet was preserved for, it can't reach the fight at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -4, label: "Pipeline" },
              next: "END",
              outcome:
                "A preserved fleet, without fuel enough to sustain extended operations, makes its final commitment in the home waters rather than in the Philippines, a different final chapter than the historical one, though it lands the fleet in the same position the real war eventually reached: a Japan with no navy left and a decision about surrender still to make.",
            },
            {
              label: "Push the diplomatic channel harder, using the preserved fleet as leverage rather than a weapon",
              advisor: { name: "Togo", quote: "A fleet spent buys nothing at a negotiating table. A fleet that could still fight, and doesn't, is the only leverage this ministry has left to offer." },
              setFlags: { finalPath: "leverage", suspicion: (flags.suspicion || 0) + 1 },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "END",
              outcome:
                "The diplomatic faction gets a stronger hand than history ever handed it: an intact fleet as a bargaining chip rather than a wreck to explain away. Whether that changes Washington's committed insistence on unconditional surrender is uncertain and, honestly, likely unchanged; American terms weren't a function of Japanese naval strength by this point in the war. What it does change is the shape of Japan's internal argument: the militarists have one fewer excuse to insist the fight isn't over.",
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
      if (flags.strongerHandPath === "holdLine") return "The Line Not Moved";
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
      if (flags.pacificWonPath === "indianOcean") return "Two Empires, Two Different Wars";
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
      if (flags.quietEmpirePath === "standDown") return "The War That Waited";
      if (flags.quietEmpirePath === "permanentReadiness") return "Armed Against a Ghost";
      if (flags.quietEmpirePath === "armedNeutrality") return "A Different Kind of Ready";
      if (flags.moscowResult === "neutralityHolds") return "The War Moscow Sat Out";
      if (flags.moscowPath === "concessions") return "A Price Already Paid to Someone Else";
      if (flags.endgamePath === "surrenderInquiry") return "The Peace Nobody Was Ready For";
      if (flags.endgamePath === "purgePeaceFaction") return "The Check Removed Before It Was Needed";
      if (flags.endgamePath === "ketsuGo") return "One Hundred Million, Together";
      if (flags.endgamePath === "pineRootDiversion") return "Two Hundred Roots, One Hour";
      if (flags.endgamePath === "totalMobilization") return "The Line Nobody Had to Cross";
      if (flags.finalPath === "lastStand") return "The Fleet's Last Sortie";
      if (flags.finalPath === "leverage") return "A Navy Held Hostage to Its Own Survival";
      if (flags.longWarPath === "terms") return "Peace Bought With What Remained";
      if (flags.longWarPath === "ketsuGoRegardless") return "Spent Regardless of the Reason";
      return "A Different Command";
    },
    epilogue(flags, meters) {
      const opening = flags.openingVector === "southBlitz"
        ? "A war that never had its Pearl Harbor, "
        : "A war that opened at Pearl Harbor, ";
      if (flags.peaceShapePath === "phasedWithdrawal") {
        return "The settlement lands on the same resource logic the Navy argued for since before this war started: the Indies retained under a negotiated arrangement, the Philippines and Malaya reverting on a phased timeline. Not the war Japan set out in 1941 to win, but a war that ended in 1942 instead of 1945, nearly three years before the actual war's eventual close. Most of the real total, more than 2.3 million Japanese military dead and over a million civilian deaths across the full 1937–1945 war, was still ahead of this point in the historical timeline, not behind it — this ending doesn't get to claim a specific number spared, only that the years the historical toll was mostly still accumulating in never happened here.";
      }
      if (flags.peaceShapeResult === "held") {
        return "The harder ask pays off: a broader Japanese sphere held through the final rounds of a negotiation Washington had every reason to walk away from and chose not to. A rarer outcome within an already rare ending, a war that ended in 1942 instead of 1945, nearly three years early. Most of the real total, more than 2.3 million Japanese military dead and over a million civilian deaths across the full 1937–1945 war, was still ahead of this point in the historical timeline — a number this ending can't honestly claim credit for avoiding precisely, only for the years it was mostly still being accumulated in never happening here.";
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
        return "Leyte never happened. The fleet that would have been spent there survives Manila's loss instead, and becomes a bargaining chip rather than a weapon in the war's final diplomatic maneuvering. Whether an intact fleet changed Washington's committed insistence on unconditional surrender is uncertain, and probably didn't — American terms weren't primarily a function of Japan's remaining naval strength. What it changed was the shape of the argument happening inside Japan's own war ministry in the war's final weeks. The real Yamato never got this chance: preserved through Leyte only to be spent six months later anyway, on a one-way sortie that cost roughly 3,700 to 4,200 Japanese sailors and never reached its target. A fleet that survives long enough to matter at the negotiating table, rather than being spent the same way regardless, is the rarer outcome this path actually tests.";
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
