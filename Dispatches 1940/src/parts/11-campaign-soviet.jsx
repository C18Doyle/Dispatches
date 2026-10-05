  soviet: {
    id: "soviet",
    seal: "STAVKA",
    name: "Soviet High Command",
    dates: "1941 — 1945",
    brief: "Direct the Red Army from the shock of invasion to the fall of Berlin. The industrial arithmetic favors you — what's open is how many men and how much of the country it costs to use it.",
    accent: "#8a2f1f",
    dynamic: true,
    start: "border41",
    resolveNode(id, flags, meters) {
      const nodes = {        get border41() {
          return {
          date: "JUNE 1941",
          title: "The Border Collapses",
          historicalRecord: true,
          situation:
            "Operation Barbarossa has struck along the entire frontier with a violence Soviet intelligence assessments insisted was still months away. Whole air regiments are destroyed on the ground in the opening hours; forward armies, deployed close to the border under the doctrine of meeting any attack on enemy soil, are being encircled faster than Stavka can confirm the reports. Stalin has not been seen in public for two days — the apparatus is, for a moment, functioning without its center.\n\nThe honest question in front of you has nothing to do with cleverness: it is whether the forward-deployed armies fight where they stand, or whether what can still move, moves east before the encirclements close." +
            (flags.legacyGermanOpening === "westCommitted"
              ? "\n\n[Grand Campaign] History will note that Berlin spent real effort chasing a cross-Channel invasion that never came before turning fully east — a delay nobody in this room can see or credit, but one that means the divisions now pouring over the frontier are not quite the force they might have been."
              : flags.legacyGermanOpening === "eastPriority"
              ? "\n\n[Grand Campaign] History will note that Berlin abandoned any real pretense of finishing Britain months ago and committed everything to this instead — which may be exactly why the forward armies are vanishing from the map faster than the reports can be confirmed."
              : "") +
            (flags.forkBarbarossaDelay
              ? " Fragmentary reports from the frontier commands describe some German formations still arriving even now, hours into the attack — if accurate, the opening blow may not have landed with its full intended weight."
              : ""),
          choices: [
            {
              label: "Hold every position — no retreat without Moscow's explicit order",
              advisor: { name: "Stalin", quote: "Not one step back. An army that retreats without orders is an army that has decided its own defeat." },
              historical: true,
              setFlags: { border41: "hold" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: "smolensk41",
              outcome:
                "Order No. 227 was still a year away, but its spirit governed June 1941 already: forward armies held rigid lines and were encircled wholesale — Białystok–Minsk alone cost some 300,000 men in the war's first ten days. The doctrine that caused this catastrophe was itself a product of the purges: officers who might have argued for elastic defense had, disproportionately, already been shot.",
            },
            {
              label: "Order a fighting withdrawal — trade ground for the army's survival",
              advisor: { name: "Zhukov", quote: "Territory can be recovered. An army encircled in the first week cannot be. Let them advance into space; space is the one thing we are not short of." },
              setFlags: { border41: "withdraw", suspicion: Math.min(5, (flags.suspicion || 0) + 1) },
              suspicionDelta: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "smolensk41",
                            outcome:
                "Not the historical choice — Stalin's early instinct ran the opposite direction, and few commanders survived arguing for it in June 1941. An earlier, more disciplined withdrawal preserves meaningfully more of the pre-war army, at the direct cost of ceding territory and industrial capacity faster than the historical retreat did. The trade this campaign will keep returning to — men against ground — opens here at its most extreme.",
              uncertain: flags.hardMode
                ? [
                    {
                      weight: 94,
                      title: "The order stands unquestioned",
                      impact: { manpower: 1, fuel: 0, initiative: -1 },
                      next: "smolensk41",
                      outcome:
                        "Not the historical choice — Stalin's early instinct ran the opposite direction, and few commanders survived arguing for it in June 1941. An earlier, more disciplined withdrawal preserves meaningfully more of the pre-war army, at the direct cost of ceding territory and industrial capacity faster than the historical retreat did. The trade this campaign will keep returning to — men against ground — opens here at its most extreme.",
                    },
                    {
                      weight: 6,
                      title: "Reprimanded",
                      favor: -1,
                      impact: { manpower: 0, fuel: 0, initiative: -1 },
                      next: "smolensk41",
                      outcome:
                        "A car is waiting outside headquarters before the order has even finished being transmitted down the line — but the war's first week buys a rare mercy an identical order later would not: there is no established record yet to weigh it against. The reprimand is formal and written, not fatal. Ordering a withdrawal in June 1941 reads, to the men who report on this sort of thing, as exactly the defeatism the standing order exists to punish — and it will be remembered, the next time this decision comes up again.",
                    },
                  ]
                : undefined,
            },
          ],
        };
        },
        get smolensk41() {
          return {
          date: "JULY – SEPTEMBER 1941",
          title: "Smolensk and the Kiev Question",
          historicalRecord: true,
          // Round 13 (Craig, relaying player feedback): "Army Group Center's panzers turn to
          // envelop it" credited the whole pincer to one army group. Verified (Wikipedia, Battle
          // of Kiev (1941), 2026-09-24): Army Group South's own Panzer Group, under Kleist, was
          // already across the Dnieper far to the south at Kremenchuk and driving north to close
          // the other half of the ring — named here rather than folded silently into "German."
          situation:
            "The battle around Smolensk is the first real check on the German advance — costly, and not decisive, but it buys weeks German planning did not budget for. Further south, an entire Southwestern Front sits exposed around Kiev as German panzers close on it from two directions at once — Army Group Center's turning south to envelop rather than pressing on toward Moscow, Army Group South's already across the Dnieper far to the south at Kremenchuk and driving north to meet them. Zhukov has already told Stalin directly that Kiev cannot be held and should be abandoned now, before the trap closes. Stalin's response was to relieve Zhukov of his post as Chief of the General Staff on the spot." +
            (flags.border41 === "hold"
              ? " Zhukov's own argument for abandoning Kiev is the same one this command already overruled once at the border, in June — and it went no better received the second time."
              : flags.border41 === "withdraw"
              ? " This command has already conceded the principle Zhukov is now arguing for at Kiev — that ground traded early is sometimes ground saved later — even if Stalin's answer to hearing it again is exactly the same."
              : "") +
            (flags.forkKievPush
              ? " Something is different about this axis of advance, and Kiev is the reason: Army Group Center's panzers never turned south to envelop the Southwestern Front at all — every report has them continuing straight toward Moscow instead, leaving Kiev's fate an open question rather than a foregone one."
              : "") +
            (flags.hardMode && (flags.suspicion || 0) >= 1
              ? " Something else is different this time, and it has nothing to do with Kiev: the special section's interest in this headquarters did not end with the border. Obedience was once its own protection. It no longer reads as a guarantee of anything."
              : ""),
          choices: [
            {
              label: "Hold Kiev — the city does not fall without a fight",
              advisor: { name: "Stalin", quote: "Kiev is not a line on a map. Abandon it and you abandon the idea that any Soviet city can be defended." },
              historical: true,
              setFlags: { kiev41: "hold" },
              impact: { manpower: -3, fuel: 0, initiative: 0 },
              next: "evacuateIndustry41",
                            outcome:
                "What happened, and among the costliest single decisions of the entire war on either side: over 600,000 Soviet troops were killed or captured when the Kiev pocket closed in September — the largest encirclement in military history. Zhukov's warning was exact and was overruled anyway. The southern front effectively ceases to exist as an organized force for months.",
              uncertain: flags.hardMode && (flags.suspicion || 0) >= 1
                ? [
                    {
                      weight: 100 - 6 * (flags.suspicion || 0),
                      title: "The order obeyed, the disaster survived",
                      impact: { manpower: -3, fuel: 0, initiative: 0 },
                      next: "evacuateIndustry41",
                      outcome:
                        "What happened, and among the costliest single decisions of the entire war on either side: over 600,000 Soviet troops were killed or captured when the Kiev pocket closed in September — the largest encirclement in military history. Zhukov's warning was exact and was overruled anyway. This time, obedience is enough to survive being right about nothing.",
                    },
                    {
                      weight: 6 * (flags.suspicion || 0),
                      title: "Recalled",
                      setFlags: { purged: true, purgedAt: "smolensk41-obedient" },
                      impact: { manpower: 0, fuel: 0, initiative: 0 },
                      next: "END",
                      outcome:
                        "Obeying the order does not save you. Someone must answer for six hundred thousand men, and an officer already noted for one prior hesitation is a considerably more convenient answer than the strategy itself. Pavlov obeyed too, at Belostok, and was shot for the disaster his obedience helped produce. The apparatus does not require defiance to find a use for you — it only requires a disaster and a name already in the file.",
                    },
                  ]
                : undefined,
            },
            {
              label: "Withdraw the Southwestern Front now, before the encirclement closes",
              advisor: { name: "Zhukov", quote: "I have already said this once and been removed from my post for saying it. I am saying it again because it is still true." },
              setFlags: { kiev41: "withdraw", suspicion: Math.min(5, (flags.suspicion || 0) + 1) },
              suspicionDelta: 1,
              impact: { manpower: 2, fuel: 0, initiative: 0 },
              next: "evacuateIndustry41",
                            outcome:
                "The option Zhukov actually proposed and was fired for proposing. An early withdrawal saves the bulk of the Southwestern Front's men and equipment, at the cost of Kiev itself and the political admission that Soviet territory can be voluntarily surrendered. It is, by most postwar assessments, the single clearest 'if only' of the entire eastern war's first year.",
              uncertain: flags.hardMode
                ? [
                    {
                      weight: 100 - (18 + 5 * (flags.suspicion || 0)),
                      title: "Overruled, not removed",
                      impact: { manpower: 2, fuel: 0, initiative: 0 },
                      next: "evacuateIndustry41",
                      outcome:
                        "The option Zhukov actually proposed and was fired for proposing — and this time, being right lands you only in Zhukov's actual chair rather than somewhere worse: relieved of authority over this decision, overruled, but still standing in the room. An early withdrawal saves the bulk of the Southwestern Front's men and equipment, at the cost of Kiev itself and the political admission that Soviet territory can be voluntarily surrendered.",
                    },
                    {
                      weight: 18 + 5 * (flags.suspicion || 0),
                      title: "Recalled",
                      setFlags: { purged: true, purgedAt: "smolensk41" },
                      impact: { manpower: 0, fuel: 0, initiative: 0 },
                      next: "END",
                      outcome:
                        "Zhukov himself was only relieved of his post for making this exact argument — a demotion, not a disappearance. The room you're standing in proves less forgiving. Advising the voluntary surrender of a city bearing the name it bears, however sound the reasoning, is not a position the political apparatus of September 1941 is prepared to hear twice from the same officer.",
                    },
                  ]
                : undefined,
            },
          ],
        };
        },
        get industrialShortfall42() {
          return {
          date: "LATE 1941",
          title: "The Gap in the Ledger",
          historicalRecord: false,
          situation:
            "The choice to spare rail capacity for the front this autumn is already showing its cost: fewer machine tools reached the Urals than the historical evacuation moved, and the replacement tanks and shells the front will need through the winter and into next year's fighting are going to arrive in smaller numbers than they should. Stavka's planners are now working out how to spread a shortage that doesn't go away just because the front held today.",
          choices: [
            {
              label: "Spread what's available thin — every front gets something rather than some fronts getting enough",
              advisor: { name: "Voznesensky", quote: "A rifle division with half its guns is still a rifle division. One with none is a rumor. Spread it." },
              historical: false,
              setFlags: { industrialShortfall42: "spread" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "leningrad41",
              outcome:
                "The equitable answer to a genuine shortage: no single front is left with nothing, but no front gets what the historical, fully-evacuated industrial base would have supplied either. Every unit fights at something under full strength through the winter — survivable, broadly, but a drag on this campaign's numbers that the fuller evacuation never had to carry.",
            },
            {
              label: "Concentrate what's available — fully equip fewer divisions rather than under-equip many",
              advisor: { name: "Zhukov", quote: "I would rather have three divisions that can really attack than nine that can only apologize for existing. Give me the full ones." },
              setFlags: { industrialShortfall42: "concentrate" },
              impact: { manpower: -1, fuel: 1, initiative: 0 },
              next: "leningrad41",
              outcome:
                "The harder-nosed answer: a smaller number of divisions get equipped to genuine full strength, capable of real offensive action, while others make do with considerably less. It is a defensible use of a real shortage — better one hammer than several sticks — at the acknowledged cost of leaving whole sectors of the front thinner than this campaign's fuller-evacuation path ever left them.",
            },
          ],
          };
        },

        get leningrad41() {
          return {
          date: "SEPTEMBER 1941",
          title: "The Siege of Leningrad",
          historicalRecord: true,
          situation:
            "German and Finnish forces have closed the ring around Leningrad, cutting every land route into the city. Hitler's directive is explicit: Leningrad is not to be taken by storm but starved and leveled, denying its population even the option of surrender. Some 2.5 million civilians remain inside alongside the garrison. The only way in or out is across Lake Ladoga — a route that will only become a usable ice road once the winter turns hard enough, and cannot come close to feeding the city before then." +
            (flags.forkBarbarossaDelay
              ? " The frontier's uneven opening in June is still being felt this far into the year — whatever it cost the initial advance, this siege line is the one place it plainly hasn't loosened anything."
              : "") +
            (flags.hardMode && (flags.suspicion || 0) >= 1
              ? " The file on this headquarters has not closed. If anything it has thickened — and a command that has already drawn one look from the special section learns to read every subsequent order as a test, whether or not it was meant as one."
              : ""),
          choices: [
            {
              label: "Hold the city at all costs — no evacuation, no surrender",
              advisor: { name: "Zhdanov", quote: "Leningrad does not surrender. Whatever the winter costs us, it costs the enemy an army that is not in front of Moscow." },
              historical: true,
              setFlags: { leningrad41: "hold" },
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: flags.kiev41 === "withdraw" ? "moscowVyazma41" : "moscowPanic41", // round 13: see moscowVyazma41's own comment
                            outcome:
                "The city held through 872 days of siege. The first winter alone is estimated to have killed several hundred thousand civilians from cold and starvation, part of a total siege death toll historians place between 800,000 and over a million — overwhelmingly civilian, the deadliest single siege in recorded history. The city never fell, and it held down Army Group North for the rest of the war, a force that never reinforced the drive on Moscow.",
              uncertain: flags.hardMode && (flags.suspicion || 0) >= 1
                ? [
                    {
                      weight: 100 - 5 * (flags.suspicion || 0),
                      title: "The order obeyed, no further attention drawn",
                      impact: { manpower: 0, fuel: -1, initiative: 0 },
                      next: flags.kiev41 === "withdraw" ? "moscowVyazma41" : "moscowPanic41", // round 13: see moscowVyazma41's own comment
                      outcome:
                        "The city held through 872 days of siege, at a civilian cost historians place between 800,000 and over a million. This order, at least, is followed to the letter, and the letter is enough — for now.",
                    },
                    {
                      weight: 5 * (flags.suspicion || 0),
                      title: "Recalled",
                      setFlags: { purged: true, purgedAt: "leningrad41-obedient" },
                      impact: { manpower: 0, fuel: 0, initiative: 0 },
                      next: "END",
                      outcome:
                        "The order was followed exactly as written, and it makes no difference. A headquarters already flagged once does not get the benefit of the doubt on the second occasion, whatever it actually did — the file wants a pattern, and a command that hesitated at the border and now oversees a siege killing hundreds of thousands supplies one, regardless of which orders were whose.",
                    },
                  ]
                : undefined,
            },
            {
              label: "Prioritize evacuation across Lake Ladoga even before the ice road is reliable",
              advisor: { name: "Vasilevsky", quote: "The lake will not freeze on our schedule. If we wait for a safe crossing, we are choosing how many more die waiting for it." },
              setFlags: { leningrad41: "evacuate", suspicion: Math.min(5, (flags.suspicion || 0) + 1) },
              suspicionDelta: 1,
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: flags.kiev41 === "withdraw" ? "moscowVyazma41" : "moscowPanic41", // round 13: see moscowVyazma41's own comment
                            outcome:
                "An earlier, more aggressive evacuation by small boat and barge before the lake fully freezes — accepting real losses to German air attack — plausibly moves more civilians out before the worst of the first winter, at the cost of transport and escort resources the historical defense used to hold the perimeter instead. No version of this choice escapes the underlying arithmetic of nearly three million people cut off from food; the honest difference is only in how the catastrophe is distributed.",
              uncertain: flags.hardMode
                ? [
                    {
                      weight: 100 - (10 + 5 * (flags.suspicion || 0)),
                      title: "Noted, not acted on",
                      impact: { manpower: -1, fuel: 0, initiative: 0 },
                      next: flags.kiev41 === "withdraw" ? "moscowVyazma41" : "moscowPanic41", // round 13: see moscowVyazma41's own comment
                      outcome:
                        "An earlier, more aggressive evacuation across Lake Ladoga plausibly moves more civilians out before the worst of the first winter. The order goes into a file somewhere, alongside a note about the officer who proposed prioritizing evacuation over holding — a note that, this time, goes no further.",
                    },
                    {
                      weight: 10 + 5 * (flags.suspicion || 0),
                      title: "Recalled",
                      setFlags: { purged: true, purgedAt: "leningrad41" },
                      impact: { manpower: 0, fuel: 0, initiative: 0 },
                      next: "END",
                      outcome:
                        "Proposing to move people out of a city Moscow has just ordered held to the last is heard, by the apparatus responsible for hearing such things, as a judgment that the city cannot be held — which is not a judgment any officer is currently permitted to have reached, whatever the actual math on three million people and a lake that hasn't frozen yet.",
                    },
                  ]
                : undefined,
            },
          ],
        };
        },
        get evacuateIndustry41() {
          return {
          date: "JULY – NOVEMBER 1941",
          title: "The Factories Go East",
          historicalRecord: true,
          situation:
            "Behind the collapsing front, one of the war's least famous decisive operations is already underway: the physical evacuation of Soviet industry — whole factories, machine tools, and workers — onto flatcars and east beyond the Urals, out of the invader's reach. The scale defies the usual language: over 1,500 major enterprises and some ten million people will move before winter. Every train carrying a dismantled tank plant east is a train not carrying ammunition west, on a rail network already breaking under the weight of the retreat. The choice is brutal arithmetic about which year of the war matters more.",
          choices: [
            {
              label: "Full priority to the evacuation — strip rail capacity from the front to move industry east",
              advisor: { name: "Voznesensky", quote: "The front is losing a battle. If the factories stay west of the Volga, we lose the arithmetic of the entire war. Trains for the machines." },
              historical: true,
              setFlags: { evacIndustry: "full" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "leningrad41",
              outcome:
                "What happened, and it is arguably the single most consequential logistical decision of the Second World War: the evacuated plants, reassembled in the Urals and Siberia — sometimes producing tanks within weeks of arrival, under open sky before the walls went up around them — became the industrial base that out-produced Germany decisively from 1942 onward. The front paid for it in the short term with everything the diverted trains didn't carry.",
            },
            {
              label: "The front comes first — evacuate only what the fighting can spare",
              advisor: { name: "Timoshenko", quote: "There will be no 1943 arithmetic if the 1941 front dissolves for want of shells. Factories can be rebuilt. A collapsed front cannot." },
              setFlags: { evacIndustry: "partial" },
              impact: { manpower: 1, fuel: 1, initiative: 0 },
              next: "industrialShortfall42",
              outcome:
                "Prioritizing front supply eases the immediate crisis — more shells, more fuel, more units moved where they're needed this autumn — at the cost of industrial capacity captured or destroyed that the historical evacuation saved. The bill arrives in 1942 and never stops arriving: every tank not built in the Urals is a gap this campaign's later years will quietly account for.",
            },
          ],
        };
        },
        // Round 13 (Craig: saving troops at Kiev "shouldn't then go into a Moscow panic but
        // actually some different nodes with those extra troops"): before this fix, every path
        // through leningrad41 routed to moscowPanic41 regardless of flags.kiev41 — an early
        // withdrawal from Kiev saved manpower on the meter but never changed which nodes the
        // player actually saw. This node is reached instead of moscowPanic41 specifically when
        // flags.kiev41 === "withdraw" (see leningrad41's next pointers). It's deliberately not a
        // rerun of the historical October 16 panic with better numbers — the panic was a crisis
        // of nerve at the top as much as a shortage of troops, and a command that made the
        // harder call at Kiev in July has already shown its nerve. So the beat here is what an
        // early, unglamorous reserve is actually for: closing the Vyazma gap immediately, or
        // banking it for December — distinct from, and roughly six weeks before, the Far
        // Eastern/Siberian reserve decision moscowDefense41 already poses, and both choices
        // reconnect there. flags.reserveCommitment41 (set below) feeds a small bonus into that
        // later choice if the player banked rather than spent — the "content written but never
        // wired" trap this project's own retrospectives flag most often, avoided on purpose.
        // historicalRecord: false because nothing in this node happened — it's what a reserve
        // the historical defense never had would plausibly have been used for, not a claim
        // about what did occur.
        get moscowVyazma41() {
          return {
          date: "OCTOBER 16, 1941",
          title: "The Reserve Kiev Bought",
          historicalRecord: false,
          situation:
            "German spearheads have broken through at Vyazma — the same breakthrough that, in the historical record, is the trigger for the October 16 government panic in Moscow. This time the picture at Stavka's own map table is different: the Southwestern Front, withdrawn from Kiev before the historical encirclement ever closed it, still exists as an organized force. It isn't enough army to close the Vyazma gap outright on its own, but it's a real reserve — one the historical defense of Moscow never had this early in October — and the question Stavka actually faces is what an intact reserve this early is for.",
          choices: [
            {
              label: "Commit the Southwestern survivors now — close the Vyazma gap before it widens further",
              advisor: { name: "Konev", quote: "The gap does not wait for a better week to close it. Every hour it stays open is ground the historical defense had to buy back later, in blood it didn't have to spend." },
              setFlags: { moscowPanic: "stay", reserveCommitment41: "now" },
              impact: { manpower: 1, fuel: 0, initiative: 1 },
              next: "moscowDefense41",
              outcome:
                "A reasoned projection, not a rerun of anything in the record: committed immediately, the preserved Southwestern divisions narrow the Vyazma gap enough that the breakthrough never reaches the scale that triggered the historical government panic in the first place. There is no dramatic evacuation crisis to manage here, no train standing ready with its steam up — a real division of practical, unglamorous soldiering, exactly the kind of thing an intact reserve is supposed to make possible. What it doesn't do is leave anything banked for December.",
            },
            {
              label: "Hold them back — bank the reserve for a winter counteroffensive with more behind it than history's version had",
              advisor: { name: "Zhukov", quote: "Vyazma will cost us ground either way. Spend this reserve closing the gap and it is spent. Hold it, and in six weeks it is the difference between driving them back and merely stopping them." },
              setFlags: { moscowPanic: "stay", reserveCommitment41: "hold" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "moscowDefense41",
              outcome:
                "The harder-nerved bet: the Vyazma gap is left to the historical defense's own thinner October resources to manage, at a real cost in ground and casualties the immediate commitment above would have avoided. What survives the wait is a reserve genuinely larger than the historical Far Eastern divisions alone — whatever December's counteroffensive does with it, it does with more than history's version had to work with.",
              uncertain: [
                {
                  weight: 70,
                  title: "The gap holds, barely, without them",
                  impact: { manpower: -1, fuel: 0, initiative: 0 },
                  outcome:
                    "The thinner October line holds through the worst of it — barely, and at a cost the preserved reserve could have prevented had it been spent here instead of banked. Whether the bet on December was worth it is a question December's own answer hasn't written yet.",
                },
                {
                  weight: 30,
                  title: "The gap very nearly doesn't",
                  impact: { manpower: -2, fuel: 0, initiative: -1 },
                  outcome:
                    "The October line comes closer to real collapse than the historical record's own version ever did — the reserve that could have closed this gap is sitting in the rear, banked for a battle that hasn't happened yet. It holds, in the end, on very little more than the same overextension and exhaustion that saved it historically. Whether banking the reserve was worth this is, again, December's question to answer.",
                },
              ],
            },
          ],
          };
        },
        get moscowPanic41() {
          return {
          date: "OCTOBER 16, 1941",
          title: "The Moscow Panic",
          historicalRecord: true,
          situation:
            "German spearheads have broken through at Vyazma, and for one day — October 16 — the Soviet capital comes closer to collapse from within than the enemy ever forces from without. Government ministries burn documents; the rail stations mob with fleeing officials; NKVD order in parts of the city briefly lapses. The government has formally decided to evacuate to Kuibyshev. The question that history turned on was narrower: does Stalin himself go — with everything his departure would tell the city, the army, and the world?" +
            (flags.forkKievPush
              ? " Without the historical Kiev diversion to slow Army Group Center down over the late summer, the spearheads that broke through at Vyazma arrived considerably sooner than the historical schedule ever allowed for — which is most of why today's panic reaches as far into the government as it does."
              : ""),
          choices: [
            {
              label: "Stalin stays in Moscow — the announcement itself is the weapon",
              advisor: { name: "Stalin", quote: "If I board that train, Moscow is already German. I will be at the parade on November 7, in this city, and the radio will say so." },
              historical: true,
              setFlags: { moscowPanic: "stay" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "moscowDefense41",
              outcome:
                "The announcement that Stalin remained — capped by the November 7 Revolution Day parade, troops marching through Red Square directly to the front line — is credited by most historians with breaking the panic within days. Whatever else is true of the man, the decision to visibly stay was among the most effective single acts of the Soviet war. The NKVD restored order in the city by methods this campaign does not need to romanticize to acknowledge the result.",
            },
            {
              label: "The government evacuates in full, Stalin included — continuity of command over symbolism",
              advisor: { name: "Molotov", quote: "Governments that are captured do not get credit for their symbolism. Kuibyshev exists precisely for this moment." },
              setFlags: { moscowPanic: "left" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: "moscowDefense41",
              outcome:
                "A plausible projection of the decision Stalin's own train stood ready for — it waited, steam up, while he decided: a full evacuation is the administratively sound choice and the psychologically catastrophic one. The capital's defense continues under Zhukov regardless, but the panic that history's version broke in days runs deeper and longer here, and every soldier holding the Mozhaisk line does so knowing the government did not believe the line would hold.",
            },
          ],
        };
        },
        get specialSection41() {
          return {
          date: "DECEMBER 1941",
          title: "The Special Section",
          historicalRecord: false,
          situation:
            "A visit that is not on your calendar: the front's Special Section — the NKVD's presence inside the army, the organ that will later be named SMERSH — has a file open on one of your best divisional commanders. In October his division retreated eleven kilometers without written orders; it is also the reason the division still exists, and for half your line's stability since. The special section officer across the desk is not asking whether the retreat was correct. He is asking for your assessment of the commander's political reliability, and both of you know the assessment is the verdict.",
          choices: [
            {
              label: "Give them what the file needs — the commander's war is over, yours continues",
              advisor: { name: "The Special Section", quote: "No one is asking you to invent anything. Only to confirm what is already written. It is a small signature." },
              setFlags: { specialSection41: "comply", suspicion: Math.max(0, (flags.suspicion || 0) - 1) },
              suspicionDelta: -1,
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "lendLease42",
              outcome:
                "The signature is small, as promised. The commander is recalled within the week and your own file grows correspondingly thinner — the apparatus remembers cooperation, and forgets it exactly as fast as it stops being offered. The division fights on under a replacement who has learned the only lesson this transaction teaches: eleven kilometers of survivable retreat is worth less than one page of political reliability. Your line is politically secure and militarily dumber, in precisely that order.",
            },
            {
              label: "Defend him on the record — the retreat saved the division and your assessment says so",
              advisor: { name: "Rokossovsky", quote: "I have been in the building they would send him to. Write the truth. It is the only thing worth the paper in that entire file." },
              setFlags: { specialSection41: "protect", suspicion: Math.min(5, (flags.suspicion || 0) + 1) },
              suspicionDelta: 1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "lendLease42",
              outcome:
                "The assessment goes in as written: the retreat was militarily correct and the commander is among the front's best. The special section officer thanks you without warmth and closes the file without comment — his file. Somewhere, yours acquires a page. The commander keeps his division, the division keeps its judgment, and the front is stronger for a decision whose full price, if there is one, will be presented later, without an itemized bill.",
            },
          ],
        };
        },
        get lendLease42() {
          return {
          date: "1942",
          title: "The Lifeline Routes",
          historicalRecord: true,
          situation:
            "American and British aid — trucks, aviation fuel, rail stock, food, the unglamorous sinews the Soviet war economy is shortest of — flows along two main arteries: the Arctic convoys to Murmansk, fast but running a gauntlet of German aircraft and U-boats based in Norway, and the Persian Corridor through Iran, safe but slow and still being built out. Moscow's pressure on the Western Allies is constant: more, faster, whatever the losses. The question on the Soviet side of the ledger is which route to stake the year's planning on." +
            // Round 21 (Moscow echo): only when the player actually fought the December battle.
            (flags.moscow41 === "counteroffensive"
              ? (flags.moscow41Result === "spent" ? " The winter's blow before Moscow gained ground and no more, and the army that fought it is short of everything the convoys bring." : "") + keyBattleEcho("moscow41", flags)
              : ""),
          choices: [
            {
              label: "Press for maximum Arctic deliveries — accept the convoy losses for the speed",
              advisor: { name: "Mikoyan", quote: "The trucks we receive in November fight in December. The trucks that go through Persia fight next spring. The front does not run on next spring." },
              historical: true,
              setFlags: { lendLease: "arctic" },
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: "order227_42",
              uncertain: [
                {
                  weight: 70,
                  title: "The convoys get through",
                  impact: { manpower: 0, fuel: 1, initiative: 1 },
                  outcome:
                    "Substantially the historical pattern outside its worst month: most Arctic convoys arrived, and the aid mattered enormously — Soviet accounts after the archives opened acknowledge what wartime propaganda minimized, that Lend-Lease trucks, rail stock, and aviation fuel were load-bearing elements of every offensive from Stalingrad onward. The Arctic route stays open at a cost in ships and sailors that the tonnage delivered justified — and delivered on the timetable Mikoyan actually argued for.",
                },
                {
                  weight: 30,
                  title: "A PQ17 summer",
                  impact: { manpower: 0, fuel: -1, initiative: 0 },
                  outcome:
                    "The worst historical face of the route, here: a scattered convoy — as PQ17 really was in July 1942, ordered to disperse against a battleship threat that never materialized, then destroyed piecemeal from the air — costs two-thirds of its ships and forces a months-long suspension of Arctic sailings at the exact moment the southern front needs everything. The Persian Corridor's slow build-out suddenly looks less like a hedge and more like the plan.",
                },
              ],
            },
            {
              label: "Shift the weight to the Persian Corridor — slower, but nothing sinks in the desert",
              advisor: { name: "Kaganovich", quote: "A supply route is a railway timetable, not an adventure story. Build the boring road and let it carry the war." },
              setFlags: { lendLease: "persian" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "order227_42",
              outcome:
                "One considered account of the rebalancing that history performed gradually anyway — by 1943 the Persian Corridor carried more tonnage than the Arctic ever had. Doing it a year early trades 1942 deliveries for 1943 reliability: safer, larger, later. The front's hardest year feels the difference in every quartermaster's ledger before the compensation arrives.",
            },
          ],
        };
        },
        // Round 13b (Craig, relaying a player review's "railroading" complaint): the reviewer
        // named Rzhev/Karmanovo specifically as a flanking option the campaign never offers —
        // and the campaign's only Rzhev content was `rzhev42`, Operation Mars in November-December.
        // Verified (Wikipedia, Battle of Rzhev, summer 1942, 2026-09-24): there was an earlier,
        // separate operation first — the First Rzhev-Sychyovka Offensive, 30 July-23 August 1942 —
        // fought by Konev's Kalinin Front and Zhukov's Western Front (20th, 31st, 5th, 33rd
        // Armies) against Model's 9th Army. Karmanovo itself fell to the 20th Army on 23 August,
        // the operation's near-final day, after which it "could advance no further against a
        // shortened and strengthened German line." Combined Soviet losses across the participating
        // armies ran above 290,000; German 9th Army alone lost over 53,000 by mid-September. The
        // line barely moved — contemporaries called it the Rzhev Meat Grinder. This is a distinct,
        // earlier operation from Mars, not the same one under another name, and it is inserted here
        // as a new predecessor to `autumnWeight42` (all four `next: "autumnWeight42"` sites in
        // `order227_42` below now route through it instead).
        get rzhevSummer42() {
          return {
          date: "JULY – AUGUST 1942",
          title: "The First Blow at the Salient",
          historicalRecord: true,
          situation:
            "While Case Blue tears open the southern front, Zhukov has his own offensive underway in the center: a push by the Western and Kalinin Fronts to crack the German salient at Rzhev before it can be reinforced from elsewhere. Konev's armies opened the attack on the 30th of July with the heaviest artillery preparation the front has yet fired; the Western Front's own assault followed days later, driving toward Karmanovo and the Vazuza. Model's 9th Army has thrown five fresh divisions into the gap and stabilized the line — the advance now runs a village at a time, and every village costs a division's worth of men to take.",
          choices: [
            {
              label: "Press the assault to its historical limit — Karmanovo or the last man",
              advisor: { name: "Zhukov", quote: "The salient does not open by itself. It opens because I spend what it costs, until it costs less than staying closed." },
              historical: true,
              setFlags: { rzhevSummer42: "pressed" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: "autumnWeight42",
              outcome:
                "What happened: the offensive ran five more weeks past this point, capturing Karmanovo on the 23rd of August and a bridgehead over the Vazuza near Zubtsov — and then stopping, unable to force the shortened line Model had built behind the first collapse. Combined losses across the participating armies passed 290,000; German 9th Army alone lost over 53,000 by mid-September. The salient held. Contemporaries called it the Rzhev Meat Grinder, and Soviet official histories stayed quiet about the toll for decades.",
            },
            {
              label: "Scale the offensive back to holding pressure — preserve the armies for autumn",
              advisor: { name: "Konev", quote: "I inherit this front from Georgy Konstantinovich at the end of the month regardless. I would rather inherit armies than a casualty report." },
              setFlags: { rzhevSummer42: "limited" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "autumnWeight42",
              outcome:
                "Speculative: the historical operation never broke the salient at any cost, so trading the second half of its casualty bill for a smaller advance forfeits little the full-price version actually bought. What it costs is a hedge, not a result — if Mars is chosen again in the autumn, it will be argued for by the same logic that just failed here, against the same commander, on the same ground.",
            },
          ],
        };
        },
        get order227_42() {
          return {
          date: "JULY 1942",
          title: "Not One Step Back",
          historicalRecord: true,
          situation:
            "As the German summer offensive tears open the southern front, Order No. 227 arrives from Moscow — the order history remembers by its refrain: Ni shagu nazad. Not one step back. Its instruments are explicit in the text itself: blocking detachments positioned behind wavering units, penal battalions for officers and men deemed to have retreated without orders, and a definition of 'panic-monger' elastic enough to reach anyone. It is among the most infamous documents of the Soviet war — and among the most debated, because a real historiographic argument exists about how much its terror, versus its frank admission of the country's desperate position, actually did the work of stiffening the front." +
            (flags.border41 === "withdraw"
              ? " This command has argued for a fighting withdrawal before, at the border in June of last year, and survived saying so. Order 227 is Moscow settling that argument for good, in writing, for every headquarters and not just this one."
              : flags.border41 === "hold"
              ? " This command never had to make the case for trading ground that Order 227 now forecloses outright — the border was held, not withdrawn, and the question the order answers was never really this desk's own open question."
              : "") +
            (flags.forkStalingradConsolidate
              ? " One thing about the southern front doesn't fit the pattern Order 227 was written to answer: forward units approaching the city are reportedly consolidating short of it rather than pressing directly into the outskirts — an uncharacteristic pause nobody in this room ordered or expected."
              : "") +
            (flags.hardMode && (flags.suspicion || 0) >= 2
              ? " Your own headquarters is, by this point in the war, a place the special section has visited more than once. The order's language about panic-mongers and defeatists is elastic enough to reach anyone standing in this room — obedient or not, hesitant or not. No order at this point is read as merely an order."
              : ""),
          choices: [
            {
              label: "Enforce the order in full — blocking detachments, penal units, the entire apparatus",
              advisor: { name: "Shcherbakov", quote: "The order does not ask to be admired. It asks to be obeyed, visibly, until the front believes it." },
              historical: true,
              setFlags: { order227: "enforce" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "rzhevSummer42",
                            outcome:
                "The order was read aloud to every unit in the Red Army; penal battalions and blocking detachments became institutional facts, and hundreds of thousands of men eventually passed through the penal system, used for the war's most lethal tasks. Whether the terror or the honesty did more of the work remains a real dispute — soldiers' memoirs cite both — but the southern front's collapse slowed, and this campaign will not pretend the human cost of the method was incidental to it.",
              uncertain: flags.hardMode && (flags.suspicion || 0) >= 2
                ? [
                    {
                      weight: 100 - 5 * (flags.suspicion || 0),
                      title: "Enforced, and enough",
                      impact: { manpower: -1, fuel: 0, initiative: 0 },
                      next: "rzhevSummer42",
                      outcome:
                        "The order was enforced to the letter — penal battalions, blocking detachments, the full apparatus — and this time full compliance is exactly what the file wanted to see. The southern front's collapse slows. Nothing further is asked of this headquarters this month.",
                    },
                    {
                      weight: 5 * (flags.suspicion || 0),
                      title: "Recalled",
                      setFlags: { purged: true, purgedAt: "order227_42-obedient" },
                      impact: { manpower: 0, fuel: 0, initiative: 0 },
                      next: "END",
                      outcome:
                        "Full enforcement, to the letter, changes nothing about a file that was already open. By this stage of the terror's logic, the question was never really whether this headquarters would comply — it was whether compliance would be believed. This time, it isn't.",
                    },
                  ]
                : undefined,
            },
            {
              label: "Transmit the order, but leave enforcement to commanders' discretion at the front",
              advisor: { name: "Vasilevsky", quote: "The words will do their work read aloud once. The blocking detachments standing behind men already fighting for their lives are rifles pointed the wrong way." },
              setFlags: { order227: "discretion", suspicion: Math.min(5, (flags.suspicion || 0) + 1) },
              suspicionDelta: 1,
                            impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "rzhevSummer42",
              outcome:
                "A speculative reading of the argument some front commanders quietly made and some quietly practiced: the order's admission of crisis travels army-wide either way, while its cruelest instruments are applied sparingly. Most of the historical order's disciplinary architecture was, in practice, softened within months as the crisis passed — this path simply starts there.",
              uncertain: flags.hardMode
                ? [
                    {
                      weight: 100 - (5 + 5 * (flags.suspicion || 0)),
                      title: "The discretion holds",
                      impact: { manpower: 1, fuel: 0, initiative: 0 },
                      next: "rzhevSummer42",
                      outcome:
                        "The likely shape of the argument some front commanders quietly made and some quietly practiced: the order's admission of crisis travels army-wide either way, while its cruelest instruments are applied sparingly. The paperwork records full compliance. The paperwork is not closely audited this month; the front is too busy surviving.",
                    },
                    {
                      weight: 5 + 5 * (flags.suspicion || 0),
                      title: "Recalled",
                      setFlags: { purged: true, purgedAt: "order227_42" },
                      impact: { manpower: 0, fuel: 0, initiative: 0 },
                      next: "END",
                      outcome:
                        "Softening the enforcement of the most explicit order Moscow has issued all war is a decision that requires nobody to report it — and someone does. By 1942 the apparatus reaches for commanders less freely than in 1941; it has not stopped reaching entirely, and an officer who edited Order No. 227 into a suggestion has made himself the easiest possible example.",
                    },
                  ]
                : undefined,
            },
          ],
        };
        },
        get stalingradStreets42() {
          return {
          date: "SEPTEMBER – NOVEMBER 1942",
          title: "The City on the Volga",
          historicalRecord: true,
          situation:
            "Sixth Army is inside Stalingrad, and the battle has become the thing the word 'Stalingrad' now means: a fight measured in buildings, floors, and hours of life expectancy. Chuikov's 62nd Army holds a shrinking strip of ruins against the river. His emerging doctrine is unconventional and deliberate — 'hug' the enemy so closely that German air and artillery superiority cannot be used without hitting their own men, feed the fight in small packets across the Volga at night, make every cellar cost a squad. The alternative pressed by some staff officers is to fight the defense conventionally: proper lines, proper reliefs, proper distances — and proper exposure to everything the Luftwaffe can drop." +
            (flags.caucasus42 === "elastic"
              ? " Whatever reinforcement the Caucasus front traded away for room to maneuver isn't reaching this city either way — Stalingrad's defenders are fighting with what Chuikov already has, regardless of which mountain valley the German advance is currently exhausting itself in."
              : flags.caucasus42 === "terek"
              ? " The rigid Terek line to the south is holding on its own reserves, at least, which is one flank Chuikov doesn't have to think about tonight."
              : ""),
          choices: [
            {
              label: "Chuikov's way — hug them, bleed them, hold the rubble at grenade range",
              advisor: { name: "Chuikov", quote: "Every German who wants a building must come inside it and meet us on the stairs. Their bombers cannot tell our staircase from theirs. That is the whole doctrine." },
              historical: true,
              setFlags: { stalingradStreets: "hug" },
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "stalingradCounter42",
              outcome:
                "What happened, and it worked: the hugging doctrine neutralized German air superiority inside the city, turned Sixth Army's strength into a liability fed piecemeal into rubble, and — the strategic point — held the fight in place, consuming German attention and reserves while Uranus massed on the flanks. The cost inside the 62nd Army was staggering and Chuikov never pretended otherwise; divisions crossed the Volga and ceased to exist in days. The city held by exactly as much as it needed to: the last few hundred meters to the river, never lost.",
            },
            {
              label: "A conventional defense — proper lines and reliefs, spare the 62nd the meat-grinder method",
              advisor: { name: "Yeryomenko", quote: "Doctrine written in a burning cellar is desperation with good publicity. Give the army a real defensive framework and it will hold longer than mystique will." },
              setFlags: { stalingradStreets: "conventional" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "stalingradCounter42",
              outcome:
                "A fair projection of the orthodox alternative, and most assessments think it fails faster: conventional lines at conventional distances are exactly what German air and artillery superiority was built to destroy. The 62nd Army husbands its men better week to week — and likely gets pushed into the Volga sooner, which puts the entire Uranus timetable, built on the city continuing to hold and consume, under pressure it historically never faced.",
            },
          ],
        };
        },
        get escapedRemnants43() {
          return {
          date: "DECEMBER 1942",
          title: "What the Looser Ring Let Through",
          historicalRecord: false,
          situation:
            "The shallower encirclement did what it was built to do — closed faster, held tighter against relief — and let through exactly what a looser ring always lets through: organized German remnants who fought clear of the pocket before it sealed, rather than the disorganized stragglers a tighter trap would have produced. They are somewhere on the winter steppe now, still armed, still capable of forming a defensive line if given the time to do it.",
          choices: [
            {
              label: "Detach mobile forces to hunt the remnants down before they can regroup",
              advisor: { name: "Rotmistrov", quote: "Every day they are loose is a day they use to become a line instead of a rumor. Tanks can still catch them. Infantry cannot." },
              historical: false,
              setFlags: { escapedRemnants43: "hunt" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "southernPursuit43",
              outcome:
                "The aggressive answer to a problem the shallow ring created: armor peels off from the main pursuit to run the remnants down before they can organize, at a real cost in fuel and tempo the wider offensive can otherwise less afford to spend on mopping up. Most of what escaped is caught or scattered for good — the encirclement's incompleteness is corrected after the fact, at a price the deep envelopment never would have required paying at all.",
            },
            {
              label: "Let them go — the main offensive's momentum matters more than a clean count",
              advisor: { name: "Vasilevsky", quote: "We are not in the business of accounting. We are in the business of not stopping. Let the remnants be someone else's problem, later and smaller." },
              historical: false,
              setFlags: { escapedRemnants43: "letGo" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "southernPursuit43",
              outcome:
                "The offensive-minded answer: the main pursuit keeps its full weight and tempo, and the escaped remnants are left to whatever the front's rear-area security forces eventually make of them. Some truly disappear into the winter; a smaller fraction reappears later, reorganized, as exactly the kind of scratch defensive line the tighter historical envelopment made considerably rarer.",
            },
          ],
          };
        },

        get southernPursuit43() {
          return {
          date: "DECEMBER 1942 – JANUARY 1943",
          title: "The Bigger Prize",
          historicalRecord: true,
          situation:
            "With Sixth Army sealed in the Stalingrad pocket, a larger opportunity glitters on the map: German Army Group A is still deep in the Caucasus, at the end of a single vulnerable corridor running through Rostov. A hard drive to Rostov could close that corridor and trap not one army but an entire army group — a catastrophe beside which even Stalingrad would look preliminary. The historical Stavka saw it, reached for it, and watched it slip away: the drive fell short and Army Group A conducted one of the war's great escapes. How much to stake on the reach is what's actually being decided." +
            (flags.uranus42 === "deep"
              ? " The ring that closed around Sixth Army last month closed deep and clean — nothing of note slipped it — and the same divisions freed by that fuller envelopment are the ones this drive on Rostov would actually use."
              : flags.uranus42 === "shallow"
              ? " The looser ring Stavka chose to close around Stalingrad let a real slice of German strength escape west before the encirclement finished forming — strength that is, this month, exactly what a Rostov drive would run into first."
              : ""),
          choices: [
            {
              label: "Drive hard for Rostov — trap Army Group A in the Caucasus entirely",
              advisor: { name: "Vatutin", quote: "Stalingrad is already won; it merely hasn't finished happening. Rostov is the door to a bigger room, and the door is closing on its own schedule, not ours." },
              historical: true,
              setFlags: { pursuit43: "rostov" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "kharkov43",
              uncertain: [
                {
                  weight: modWeight(flags.uranus42 === "deep" ? 33 : flags.uranus42 === "shallow" ? 18 : 25, meters.fuel),
                  title: "The door slams",
                  impact: { manpower: 0, fuel: -1, initiative: 1 },
                  next: "southernVacuum43",
                  outcome:
                    "The reach succeeds where history's fell short: Rostov falls before Army Group A can thread the corridor, and the largest encirclement of the war closes around an entire army group — a projection at the favorable edge of what the logistics plausibly allowed, and marked accordingly. The German southern front doesn't merely lose a battle; it loses its entire structure a year ahead of the historical schedule, and there is suddenly very little German army left between Stavka and the Balkans.",
                },
                {
                  weight: 100 - modWeight(flags.uranus42 === "deep" ? 33 : flags.uranus42 === "shallow" ? 18 : 25, meters.fuel),
                  title: "The great escape",
                  next: "rostovAftermath43",
                  impact: { manpower: -1, fuel: -1, initiative: 0 },
                  outcome:
                    "The drive on Rostov, running on the same exhausted logistics as everything else that winter, fell short by days — and Army Group A executed one of the war's most skillful withdrawals through the closing gap, extracting the bulk of its strength to fight on. The attempt was correct and the Germans were simply better at leaving than the pursuit was at arriving; most staff studies since have scored it the same way. What Stavka does with a pursuit that arrived late is the next real question.",
                },
              ],
            },
            {
              label: "Consolidate around Stalingrad — reduce the pocket first, secure what's already won",
              advisor: { name: "Rokossovsky", quote: "A quarter-million Germans are in a ring my army is holding shut. I would like to finish one historic victory before we go shopping for a second." },
              setFlags: { pursuit43: "consolidate" },
              impact: { manpower: 1, fuel: 1, initiative: -1 },
              next: "kharkov43",
              outcome:
                "An honest account of the conservative allocation: the pocket is reduced faster and at lower cost, the winter's gains are properly consolidated — and Army Group A walks out of the Caucasus entirely unmolested, its escape not even contested. The safest version of the winter, and the one that leaves the largest German force intact for 1943's battles.",
            },
          ],
        };
        },
        get partisans43() {
          return {
          date: "SPRING – SUMMER 1943",
          title: "The War Behind the Lines",
          historicalRecord: true,
          situation:
            "By 1943 the partisan movement in the occupied territories has grown from scattered survival into something Moscow can actually direct: perhaps 200,000 armed fighters with radio links to the Central Staff. As the Kursk confrontation builds, what to spend them on is the real decision. The staff's plan — what will become Operation Rail War — proposes coordinated mass attacks on the rail network feeding the German buildup. The alternative is quieter: keep the partisans gathering intelligence and husbanding strength, and accept that visible sabotage brings reprisals against the civilian population on a scale the movement cannot prevent.",
          choices: [
            {
              label: "Launch the Rail War — coordinated mass sabotage of the German supply network",
              advisor: { name: "Ponomarenko", quote: "Twenty thousand rails cut in one month is not sabotage. It is a second front made of track beds, and it costs us no divisions." },
              historical: true,
              setFlags: { partisans43: "railWar" },
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: "kurskDefense43",
              uncertain: [
                {
                  weight: 40,
                  title: "Closer to paralysis than the record usually credits",
                  impact: { manpower: 0, fuel: 2, initiative: 0 },
                  outcome:
                    "Tens of thousands of demolition charges hit the rail network feeding Kursk, and this time the locomotives go with the track — the harder loss to replace, and the outcome the operation's planners had promised. German logistics into the salient tighten measurably in the weeks before the offensive. The reprisals follow as they always followed: villages burned and populations shot in reprisal ratios set in advance, on a scale that does not depend on how effective the sabotage was.",
                },
                {
                  weight: 60,
                  title: "Rails, not locomotives — the skeptics' reading",
                  impact: { manpower: 0, fuel: 1, initiative: 0 },
                  outcome:
                    "The charges go in by the tens of thousands and the disruption is real, but it is track, not locomotives — the rails are relaid faster than they are cut, and the paralysis Ponomarenko promised Stavka does not arrive. The reprisals arrive on schedule regardless: villages burned and populations shot at ratios set in advance, which were never calibrated to how much damage the partisans actually did.",
                },
              ],
            },
            {
              label: "Keep them dark — intelligence and preservation over visible sabotage",
              advisor: { name: "Sudoplatov", quote: "A partisan who cuts a rail is spent in one night. A partisan who reads the timetable feeds the front forever — and brings no burned village down on the people hiding him." },
              setFlags: { partisans43: "intelligence" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "kurskDefense43",
              outcome:
                "A careful extrapolation of the quieter doctrine: the movement's intelligence value — already substantial in the historical record — becomes its whole purpose, and the reprisal cycle visible sabotage fed runs measurably cooler. The cost is the Rail War's real, if debated, contribution to the Kursk defensive victory, and the harder-to-measure effect that visible resistance had on both occupied morale and German rear-area nerves.",
            },
          ],
        };
        },
        get eastPrussia45() {
          return {
          date: "JANUARY – APRIL 1945",
          title: "The Fortress in the Rear",
          historicalRecord: true,
          situation:
            "The Vistula–Oder advance has left German East Prussia — and the fortress city of Königsberg — cut off but unconquered in the rear, a garrison of hundreds of thousands behind the main axis of advance. The historical Stavka committed enormous forces to storming it: a two-and-a-half-month reduction of some of the most fortified ground in Europe. The alternative was always available on the map: seal it, screen it, and let a garrison that can no longer affect the war rot on the wrong side of the front while everything else drives on Berlin." +
            (flags.finlandOutcome === "occupation"
              ? " The manpower still garrisoning a hostile Finland isn't available for either answer to this question — a cost from a different front, still being paid on this one."
              : flags.finlandOutcome === "armistice"
              ? " The northern flank settled by armistice rather than occupation means every division that would otherwise be garrisoning Finland is available for whichever answer this staff chooses."
              : ""),
          choices: [
            {
              label: "Storm East Prussia and Königsberg — no intact German army group stays in the rear",
              advisor: { name: "Vasilevsky", quote: "I have read the arguments for leaving it. I have also read the fortress's artillery inventory. It sits astride the Baltic flank of everything we do next; it comes down." },
              historical: true,
              setFlags: { eastPrussia45: "storm" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: "berlinRace45",
              outcome:
                "The East Prussian operation became one of the costliest campaigns of the war's final year — Königsberg itself fell in April after a siege reduction of exceptional violence, and total Soviet casualties in the operation ran into the hundreds of thousands. Whether the fortress truly threatened the Berlin axis or merely offended the doctrine that no enemy force stays intact in the rear remains a fair question; the historical answer was paid for either way.",
            },
            {
              label: "Seal it and starve it — screen the fortress, keep the weight on Berlin",
              advisor: { name: "Rokossovsky", quote: "A garrison with no fuel, no relief, and no war left to affect is not a threat. It is a prisoner-of-war camp that hasn't finished the paperwork." },
              setFlags: { eastPrussia45: "sealed" },
              impact: { manpower: 2, fuel: 0, initiative: 0 },
              next: "maskingForceQuestion45",
              outcome:
                "A screened East Prussia can shell the Baltic coast and consume a masking force, and can do essentially nothing else — Courland's actual garrison sat exactly this way, intact and irrelevant, until May 8. The men the historical storm spent are preserved for the Berlin operation instead. What this path forgoes is harder to put on a ledger: the historical campaign was also, unavoidably, about what East Prussia meant — the war being carried, finally and terribly, into the country that launched it. What in fact to do with the troops now watching a garrison that can't affect the war is its own, smaller question.",
            },
          ],
        };
        },
        get berlinRivalryIncident45() {
          return {
          date: "APRIL 1945",
          title: "Fire in the Smoke",
          historicalRecord: false,
          situation:
            "Two Soviet spearheads, each convinced the other is a slower-moving problem rather than an army sharing the same burning city, exchange fire in the confusion of a converging double envelopment. It is quietly the kind of incident every army that has ever fought this way has feared and rarely spoken of afterward — and Stavka now has to decide, with the war a matter of days from ending, what to do about a story that reflects badly on the rivalry Stalin himself engineered. This is the exact cost the decision to let both fronts race for the city rather than concentrate behind a single thrust was always going to risk somewhere — it has just arrived a few days before the surrender rather than after it.",
          choices: [
            {
              label: "File it honestly — the incident goes into the record, consequences where they're due",
              advisor: { name: "Antonov", quote: "We are days from Berlin's fall. I would rather this cost someone a reprimand now than cost this army its honesty about itself for the next fifty years." },
              setFlags: { berlinRivalryIncident45: "honest" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "berlinAssault45",
              outcome:
                "The rarer choice, and the harder one to make about your own celebrated victory in its final week: the incident is recorded plainly, without the usual smoothing. It changes nothing about Berlin's fall, and it costs this campaign a small piece of the myth the rivalry was already generating for itself.",
            },
            {
              label: "Absorb it quietly — the victory's story doesn't need this chapter",
              advisor: { name: "Zhukov", quote: "The city falls in days. I am not spending any of them explaining a tragedy neither front intended to a Stavka that engineered the conditions for it." },
              historical: false,
              setFlags: { berlinRivalryIncident45: "quiet" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "berlinAssault45",
              outcome:
                "The likelier choice, and the one the war's actual triumphant record tends to make about its own costliest week: the incident is absorbed into the general chaos of the assault, unrecorded as anything distinct, the same way most of what a converging double envelopment costs quietly becomes 'friendly fire, confirmed unavoidable' in the after-action file.",
            },
          ],
        };
        },
        get berlinAssault45() {
          return {
          date: "APRIL 16 – MAY 2, 1945",
          title: "Seelow and the City",
          historicalRecord: true,
          situation:
            "The final assault. Between the Oder bridgeheads and Berlin stand the Seelow Heights — the last prepared defensive line of the war, held by everything Heinrici could scrape together and positioned exactly where every Soviet planning map said the main blow must fall. Zhukov's plan for the opening night is infamous before it begins: a massed night attack behind 143 anti-aircraft searchlights, intended to blind the defenders. The alternative pressed within his own staff is patience — take an extra day to suppress the heights properly before the infantry goes up them." +
            (meters.manpower <= -6
              ? " There is a fact this staff meeting doesn't need to say aloud: four years of costly choices have left this army with too little left in the ranks to spend on a shock assault against a prepared line. Whatever Berlin costs from here, it will be paid for the methodical way — there isn't a division to spare for the other one."
              : "") +
            (flags.berlin45soviet === "concentrated"
              ? " Konev's front is not a second claimant on the searchlights or the Seelow assault at all this week — Stavka settled that argument before the Oder bridgeheads were even secured, and this staff meeting is arguing tactics for one front's attack, not deconflicting two."
              : flags.berlin45soviet === "race"
              ? " Zhukov's own urgency about the searchlights and the extra day has a second audience this week that the historical planning never quite had: Konev's front is coming from the south on its own schedule, and neither commander is inclined to be the one who arrives second."
              : ""),
          choices: [
            {
              label: "The searchlight assault — hit them tonight, blind them, take the heights by shock",
              advisor: { name: "Zhukov", quote: "Every day Berlin stands is a day Koniev's tanks get closer to it from the south. The lights go on tonight." },
              historical: true,
              setFlags: { berlinAssault: "seelow" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: "END",
              outcome:
                "What happened, and it went wrong in every way the skeptics predicted: the searchlights silhouetted the attackers against their own beams and reflected off battlefield haze into Soviet eyes; Heinrici had already pulled his men off the bombarded first line into the second; and the heights held for three days at a cost in Soviet dead that Zhukov's rivals never let him forget. Berlin fell on schedule anyway — May 2 — because by April 1945 no tactical setback could change the arithmetic. The men spent on the heights were spent against a verdict already rendered.",
            },
            {
              label: "Suppress first, assault second — give the heights a full preparatory day",
              advisor: { name: "Chuikov", quote: "I took one city the patient way, house by house, and it is why I am alive to take this one. The heights will still be there tomorrow. So will more of my men." },
              setFlags: { berlinAssault: "methodical" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "END",
              outcome:
                "A plausible projection of the methodical alternative: a properly suppressed Seelow costs a day — a day Koniev's southern axis uses to strengthen its claim on the city, with everything the Zhukov–Koniev rivalry made of such things — and spares a meaningful fraction of the assault's historical casualties. Berlin's fall moves by days at most; the war's final ledger of Soviet dead moves by more. Which of those mattered more in April 1945 depends entirely on which map table you were standing at.",
            },
          ].concat([
              {
                label: "Don't take Seelow at all — release Koniev south and Rokossovsky north at full strength and let the heights hold an empty front",
                disabledReason: (meters.manpower || 0) >= 4 && (meters.fuel || 0) >= 2 ? undefined : "Requires Manpower +4, Fuel +2 — two axes at full weight, or neither",
                advisor: { name: "Chuikov", quote: "Heinrici built his line where our maps said we had to come. We do not have to come. For the first time in this war we have enough army to go around a position instead of through it, and I would like to spend that on the last week rather than save it for a week that will not arrive." },
                setFlags: { berlinAssault: "envelop", berlinEnveloped45: true },
                impact: { manpower: -1, fuel: -2, initiative: 1 },
                next: "END",
                outcome:
                  "SPECULATIVE in more than scale here — Koniev's southern axis on Berlin was real, but Rokossovsky's front was historically pointed north, at Stettin and the Baltic coast, in part precisely so it would not become a third claimant on a city Zhukov and Koniev were already racing each other for. Turning it onto Berlin's northern approaches instead is this branch's actual invention, not just a heavier version of what happened. What that invention buys, though, holds up on its own terms: the last prepared defensive line of the war has no answer to an attack that never arrives, while the city behind it is encircled from two directions at once. Berlin falls faster and cheaper than the historical assault managed, and the searchlights stay in their crates. The garrison surrenders to a ring rather than a battle.",
              },
            ]),
        };
        },
        get moscowDefense41() {
          return {
          date: "OCTOBER – DECEMBER 1941",
          title: "The Defense of Moscow",
          historicalRecord: true,
          situation:
            (flags.kiev41 === "hold"
              ? "Kiev's fall freed German armor for a renewed push directly at the capital — Operation Typhoon — and the southern front's collapse means fewer reserves stand between the panzers and Moscow than a cleaner withdrawal would have preserved. "
              : "Typhoon comes regardless, aimed now at a capital defended by a southern front that survived Kiev in better order than history's version. ") +
            "German spearheads reach within twenty miles of the city. The government has partially evacuated to Kuibyshev; panic briefly grips Moscow itself in mid-October. What Stavka has that the German staff does not yet know about: fresh, winter-equipped divisions from the Far East, released once intelligence — a spy network reporting from Tokyo — confirms Japan will move south, not against Siberia." +
            (flags.border41 === "withdraw"
              ? " The army defending the capital this week is, in no small part, the one a fighting withdrawal at the border saved five months ago rather than spent holding ground that couldn't be held anyway."
              : flags.border41 === "hold"
              ? " Whatever divisions were lost holding rigid at the border in June are divisions this defense cannot call back now, whatever their absence costs the line outside Moscow."
              : "") +
            (flags.reserveCommitment41 === "hold"
              ? " And the Far Eastern divisions aren't the only reserve on the board this time — the Southwestern Front survivors banked back in October, rather than spent closing the Vyazma gap, are still sitting uncommitted behind the line."
              : flags.reserveCommitment41 === "now"
              ? " The Southwestern Front survivors that closed the Vyazma gap back in October are already spent — whatever December decides, it decides with the Far Eastern divisions alone, same as the historical record."
              : ""),
          choices: [
            {
              label: "Commit the Siberian divisions to a full winter counteroffensive",
              advisor: { name: "Zhukov", quote: "They have no winter clothing and no reserves left. We have both. This is the only week of the war where that will be entirely true." },
              historical: true,
              setFlags: { moscow41: "counteroffensive" },
              impact: { manpower: 2, fuel: 0, initiative: flags.reserveCommitment41 === "hold" ? 2 : 1 },
              next: flags.hardMode ? "specialSection41" : "lendLease42",
              // Round 21 (2026-10-05, Craig: the first Order of Battle for the Soviet campaign,
              // the Moscow counteroffensive). Same pattern as the German Sedan choice: a new
              // uncertain[] whose first outcome is the text that used to be this choice's own.
              // Facts verified 2026-10-05 (Wikipedia, Battle of Moscow; 1st Shock Army; Pavel
              // Belov; Winter campaign of 1941-1942): Zhukov's Western Front, Konev's Kalinin
              // Front and the right wing of Timoshenko's Southwestern Front took part, with the
              // 1st Shock, 5th, 10th, 16th, 20th, 30th, 33rd, 43rd, 49th and 50th Armies; some 58
              // reserve divisions had been gathered by early December; 1st Shock Army was formed in
              // the Stavka reserve in November 1941; the offensive began on the Kalinin Front on 5
              // December and took Klin on 7 December; German Army Group Centre had only a third
              // of its vehicles running, infantry divisions at a third to a half of strength, and
              // no winter clothing; the Soviets pushed the Germans back 150-300 km but mostly
              // failed to encircle German units; Belov's corps had been renamed 1st Guards Cavalry
              // Corps on 26 November and had stopped Guderian near Kashira.
              keyBattleSubgame: {
                id: "moscow41",
                title: "Order of Battle — The Blow Before Moscow",
                flavor:
                  "The Germans have shot their bolt. Army Group Centre has barely a third of its vehicles running, its infantry regiments are down to a hundred and fifty or two hundred riflemen, and no one in the German line has winter clothing. Zhukov wants every fresh army that has come west — 1st Shock, the divisions released from the Far East, the rest of the reserve Stavka has been gathering since the autumn — to attack together, on the same morning, before the Germans can dig in. The reserve is large by the standards of this war and small by the standards of the front it has to cover, and Zhukov himself said so. What's decided here is how thinly it is spread: how much into the rifle armies' blow, how much into the cavalry and ski columns that have to get behind the German flank, how much of the air that came west covers them, and how much of the railway goes to ammunition and winter clothing in place of more men.",
                categories: [
                  { id: "reserves", name: "Fresh Rifle Armies", meter: "manpower", glyph: "▮▮▮" },
                  { id: "exploitation", name: "Cavalry & Ski Columns", meter: "initiative", glyph: "⇉" },
                  { id: "air", name: "Air Cover", meter: "fuel", glyph: "✈" },
                  { id: "supply", name: "Rail & Winter Supply", meter: "fuel", glyph: "▤" },
                ],
                // Reserves highest — the new armies are the blow itself; Exploitation second —
                // a hollow German line is a thing cavalry and skiers can get through, but only
                // where someone holds the ground behind them; Air third — real, but German
                // air strength was also much reduced; Supply lowest, deliberately — the railway
                // fed the armies all winter, and the shortage is shells and clothing rather than
                // men, which is a sharper limit than any one battle can lift.
                effectiveness: { reserves: 2.5, exploitation: 2.2, air: 1.9, supply: 1.7 },
                // Round 22. Ground and weather, verified 2026-10-05 (Wikipedia, Battle of Moscow): sources disagree
                // on the December temperature (Soviet records -28.8 C at the lowest, German reports -36 to -45 C),
                // and German frostbite cases passed 130,000, so the cold is a fact of the ground. The attrition rule
                // charges the same cold to the columns that ride out in it.
                conditions: "Deep cold, with the sources giving anything from -29 to -45 degrees, and deep snow on every road. It is the Germans' problem first, since they have no winter clothing, but it reaches the columns that go out in it too.",
                terrainModifiers: { supply: 0.9, air: 0.9 },
                terrainNotes: { supply: "locomotives and roads in deep cold", air: "frozen fields and short days" },
                attrition: [
                  { category: "exploitation", atLeast: 3, meter: "manpower", delta: -1, reason: "Frostbite among the columns left out in the open" },
                ],
                // Field decision: the second day. Facts (Wikipedia, Winter campaign of 1941-1942): the Red Army
                // pushed the Germans back 150-300 km but "mostly failed to encircle the German units" at Klin and
                // elsewhere. The three answers are the real options for running a pursuit with too few reserves;
                // the payoff against each German posture is modeled.
                decisions: [
                  {
                    id: "runningThePursuit",
                    time: "1600",
                    title: "The second day",
                    prompt: "The first blows have gone in and the Germans are falling back, in some places in good order and in others hardly at all. Stavka wants the armies to pursue everywhere. Zhukov has to decide how the pursuit is run, with reserves that were never enough.",
                    options: [
                      {
                        id: "pressHighways",
                        label: "Press the pursuit down the main roads at once",
                        note: "The fastest way, if the enemy is truly broken.",
                        bonus: 0,
                        bonusByPosture: { frozenLine: 4, mobileFlanks: -3, orderlyWithdrawal: -2 },
                        reportLine: "The armies go down the main roads after the Germans without waiting to regroup.",
                      },
                      {
                        id: "cutBehind",
                        label: "Wheel the cavalry and ski columns around to cut the roads behind them",
                        note: "The roads are the Germans' only way out, but the columns will be far from help.",
                        bonus: 0,
                        bonusByPosture: { frozenLine: 2, mobileFlanks: -4, orderlyWithdrawal: 4 },
                        reportLine: "The cavalry and the ski columns ride around the flank and across the roads behind the retreating Germans.",
                      },
                      {
                        id: "pauseAndFeed",
                        label: "Pause a day to bring up the guns and the shells",
                        note: "Costs Initiative, and the Germans get a day.",
                        bonus: 0,
                        bonusByPosture: { mobileFlanks: 4, orderlyWithdrawal: 1 },
                        meters: { initiative: -1 },
                        costReason: "A day's pause in the pursuit",
                        reportLine: "The pursuit halts for a day while the guns and the shells come up the railway.",
                      },
                    ],
                  },
                ],
                categoryContext: {
                  reserves:
                    "The fresh armies are the weight of the blow, and they are all the reserve there is. Zhukov's argument is that they should go in together. Each commitment here puts more of them into the first morning's attack.",
                  exploitation:
                    "Cavalry and skiers can go where tanks cannot, through the forest and the snow and around the strongpoints. Each commitment here sends another column out beyond the German line, if the line is thin enough to get through.",
                  air:
                    "Part of the air that came west covers the advance. The Germans' own airfields near the front are in poor shape, but any aircraft they have will hunt anything on the roads. Each commitment here puts more fighters over the columns.",
                  supply:
                    "The railway must now carry shells and winter clothing as well as men, and the roads beyond the railheads are snow. Each commitment here gives the supply trains first call on the rails.",
                },
                flashups: {
                  reserves: [
                    "A fresh rifle division goes forward in white snowsuits, a long line on the snow.",
                    "1st Shock Army's regiments cross their start line at dawn in the cold.",
                    "A reserve army's artillery opens fire on the German strongpoints for the first time.",
                    "A division that came from the Far East takes a village in the first morning's attack.",
                    "A battalion reaches the edge of a town the Germans held for three weeks.",
                  ],
                  exploitation: [
                    "A cavalry regiment rides through a gap in the forest and into a village full of surprised Germans.",
                    "A ski battalion goes past the German strongpoints on a forest track.",
                    "The horsemen cut a road behind the German line and hold it for the night.",
                    "A raiding column reports a German headquarters abandoned and its papers left behind.",
                    "A cavalry division finds a bridge undefended and takes it.",
                  ],
                  air: [
                    "Fighters from the Far East patrol over the columns on the road to Klin.",
                    "A flight of ground-attack aircraft hits a German column stuck in the snow.",
                    "German bombers turn back when a Soviet fighter flight comes in out of the cloud.",
                    "A Soviet air regiment operates from a frozen field close behind the front.",
                    "An air raid hits a rail station behind the Soviet line, and the trains stop for an hour.",
                  ],
                  supply: [
                    "A long train of ammunition cars reaches the railhead on time.",
                    "Felt boots and sheepskin coats are handed out to the front-line companies.",
                    "A supply column bogs down in snow on the road beyond the railhead.",
                    "Locomotives are kept running in the cold by crews working through the night.",
                    "The artillery gets its shells at last and begins to fire at the rate it has wanted.",
                  ],
                },
                reportTimes: { open: "0300", contact: "0700", cats: ["0900", "1200", "1500", "1800"], reserve: "2000", counter: "2200" },
                idleLines: {
                  reserves: [
                    "No more of the fresh armies are committed to the first blow. The attack goes in with what was already on the start line.",
                    "The reserve is held back and the line it might have strengthened moves forward alone.",
                  ],
                  exploitation: [
                    "The cavalry and ski columns stay in their villages. No one goes around the strongpoints.",
                    "No raiding columns go out. The front moves forward at the pace of the infantry on the road.",
                  ],
                  air: [
                    "No extra fighters fly over the columns. They go forward under whatever cover the front already has.",
                    "The air regiments stay on their frozen fields, and the roads are unguarded.",
                  ],
                  supply: [
                    "No priority goes to the supply trains. Shells and clothing arrive when the railway can bring them.",
                    "The railway is left as it is. The front gets what trickles through.",
                  ],
                },
                verdicts: ["The Germans Are Thrown Back From Moscow", "The Blow Spends Itself Short of Its Goal"],
                verdictGrades: {
                  clean: "The fresh armies, the cavalry, the air and the railway all worked at once, and the German front went back in the cold with nothing to stop it.",
                  costly: "The Germans are driven back, but every arm of the attack was worn thinner than the plan allowed for before it was done.",
                  marginal: "The attack gains ground but not the breakthrough. The line moves back and holds, and the Germans get away with more than they should have.",
                  total: "The attack drives the Germans back a few miles and then stops, its reserves spent and the front still in front of Moscow.",
                },
                counterattack: {
                  category: "reserves",
                  severity: { mobileFlanks: 2, orderlyWithdrawal: 1, frozenLine: 1 },
                  warn: {
                    1: "German rearguards are counterattacking along the flanks of the advance.",
                    2: "The German tank groups at the flanks are turning on the shoulders of the advance, and the armies have to hold them off.",
                  },
                  results: {
                    repulsed: "The German counterattack is beaten off at the shoulder, and the advance goes on past it.",
                    heldAtCost: "The shoulder of the advance holds against the Germans, but the divisions that held it are badly worn.",
                    broke: "The Germans break into the shoulder of the advance, and the armies on either side have to stop and fight for it.",
                    gaveGround: "The shoulder gives ground, and the advance slows beside it to stay in touch with the armies that held.",
                  },
                },
              },
              uncertain: [
                {
                  weight: Math.min(95, modWeight(70, meters.initiative) + (flags.reserveCommitment41 === "hold" ? 10 : 0)),
                  title: "The counteroffensive throws Army Group Centre back",
                  setFlags: { moscow41Result: "thrown" },
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  outcome:
                    "What happened, launched December 5, 1941. Fresh Siberian divisions, and a German army with no winter equipment because the campaign was planned to be over by autumn, combined to drive Army Group Center back as much as 150 miles in places. It was the first major German reversal of the war, and it ended, permanently, any version of a quick victory in the east." +
                    (flags.reserveCommitment41 === "hold"
                      ? " This time the Siberian divisions aren't attacking alone — the Southwestern Front reserve banked in October goes in beside them, a counteroffensive with more actual weight behind it than the historical version ever had."
                      : ""),
                },
                {
                  weight: 100 - Math.min(95, modWeight(70, meters.initiative) + (flags.reserveCommitment41 === "hold" ? 10 : 0)),
                  title: "The blow gains ground and no more",
                  setFlags: { moscow41Result: "spent" },
                  impact: { manpower: -2, fuel: -1, initiative: -1 },
                  outcome:
                    "The minority projection, closer to what Zhukov feared than to what happened: the armies drive the Germans from the immediate approaches to Moscow and then stop, their reserves spent and their ammunition short, against a line that has fallen back onto villages it can hold. The capital is safe and the front stays close to it. What was history's first great Soviet reversal becomes a costly relief of the siege, and the winter's other offensives, which never had enough reserve behind them, have even less.",
                },
              ],
            },
            {
              label: "Hold the Siberian divisions in reserve — defend the capital, do not yet counterattack",
              advisor: { name: "Stalin", quote: "We will not know if the line holds until it is tested. Do not spend the only reserve we have on a battle we might not need to fight." },
              setFlags: { moscow41: "defend" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: flags.hardMode ? "specialSection41" : "lendLease42",
              outcome:
                "One considered account of the more cautious path: Moscow's defense holds on the strength of the city's own garrison and the German offensive's own exhaustion, without spending the Far Eastern reserve. It preserves a fresh, uncommitted force for 1942 at the cost of the historical counteroffensive's dramatic reversal — Army Group Center is fought to a halt rather than driven back, and the initiative changes hands more slowly.",
            },
          ],
        };
        },
        get autumnWeight42() {
          return {
          date: "AUTUMN 1942",
          title: "Where the Reserve Goes",
          historicalRecord: true,
          directive: true,
          situation:
            "The autumn's strategic reserve — fresh armies forming behind the Volga — can weight one of two theaters, and Stavka's internal argument over which is genuine. The center: the Rzhev salient still points at Moscow, and Zhukov wants the reserve for a matched pair of offensives, Mars against Rzhev alongside Uranus in the south. The south: everything — the city fight on the Volga, the Caucasus oil line where German spearheads have reached the high passes — argues the war's decision is being made there and the reserve belongs behind it.",
          choices: [
            {
              label: "Weight the center — the reserve backs Mars against the Rzhev salient",
              advisor: { name: "Zhukov", quote: "Two offensives, launched together, and the enemy must fail somewhere. The salient is a loaded weapon and I intend to take it away." },
              historical: true,
              setFlags: { autumnWeight: "center" },
              impact: { manpower: -3, fuel: 0, initiative: 0 },
              next: "rzhev42",
              outcome:
                "What happened — the reserve fed both Mars and Uranus, and the center's share was about to be spent against Model's prepared defense at Rzhev. The twin-offensive concept was sound arithmetic and, in the center, terrible geology; this campaign's next chapter is the one Soviet histories stayed silent about for fifty years.",
            },
            {
              label: "Weight the south — everything behind the Volga and the Caucasus line",
              advisor: { name: "Vasilevsky", quote: "Rzhev threatens Moscow. The south threatens the war. The reserve goes where the verdict is being written." },
              setFlags: { autumnWeight: "south" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "caucasusDefense42",
              outcome:
                "A speculative reading of the single-theater concentration: the center holds Rzhev with pressure rather than assault — sparing Mars's historical six-figure cost — and the reserve's full weight goes behind the Volga and the mountain passes. What the concentration buys in the south, the next chapter tests directly; what it forgoes is the pinning effect Mars's defenders always claimed for it, which German reserves are now free to disprove.",
            },
          ],
        };
        },
        get caucasusDefense42() {
          return {
          date: "AUTUMN 1942",
          title: "The Mountain Line",
          historicalRecord: false,
          situation:
            "With the reserve weighted south, the Caucasus defense becomes a chosen battle rather than an improvised one. German spearheads hold the high passes and have planted a flag on Elbrus for the newsreels — but their supply line runs six hundred kilometers back to Rostov, and every kilometer of mountain road is an argument against them. The reinforced defense can be spent two ways: holding the oil line rigidly at Grozny and the Terek, or trading the last mountain approaches for position — letting the German advance exhaust itself another valley deeper before the winter counterblow.",
          choices: [
            {
              label: "Hold the Terek line rigid — not a barrel of Grozny's oil within their reach",
              advisor: { name: "Tyulenev", quote: "The oil is the war. The line holds at the river because there is nothing behind the river worth trading." },
              checkLabel: "Manpower",
              disabledReason: meters.manpower <= -4 ? "not enough reserve infantry left to hold the Terek rigidly rather than trading ground for time" : undefined,
              setFlags: { caucasus42: "terek" },
              impact: { manpower: -1, fuel: 1, initiative: 0 },
              next: "stalingradStreets42",
              outcome:
                "The reinforced Terek line holds as the historical, thinner version of it also ultimately held — the German mountain drive was beaten as much by its own supply line as by any defense — but the reinforcement buys certainty where history ran on margin. Grozny's refineries keep working; the projection's main dividend is a southern flank entering the winter counteroffensive season already solid rather than merely surviving.",
            },
            {
              label: "Elastic defense — trade the last valleys, let the mountains finish what they started",
              advisor: { name: "Vasilevsky", quote: "Their supply line is our best general in that theater. Give it two more valleys to work with." },
              setFlags: { caucasus42: "elastic" },
              impact: { manpower: 1, fuel: -1, initiative: 0 },
              next: "stalingradStreets42",
              uncertain: [
                {
                  weight: modWeight(72, meters.fuel),
                  title: "The trade holds at a safe distance",
                  impact: { manpower: 1, fuel: -1, initiative: 0 },
                  outcome:
                    "The elastic version spends geography instead of men: the German advance gains valleys it cannot supply and holds passes that winter will close behind it, while the defense banks its strength. The trade runs close to Grozny but stays on the right side of it — the overextension bill arrives on schedule, and the oil survives to collect on it.",
                },
                {
                  weight: 100 - modWeight(72, meters.fuel),
                  title: "The elasticity runs out too close to the wells",
                  impact: { manpower: 0, fuel: -2, initiative: 0 },
                  outcome:
                    "The risk the rigid school named stops being a risk and becomes the result: the trade for space runs a valley further than planned, and Grozny's refineries end up inside the zone traded away before the winter counterblow arrives to take it back. The oil is recovered eventually — the counteroffensive still comes — but not before the enemy gets a season's use of it.",
                },
              ],
            },
          ],
        };
        },
        get rzhev42() {
          return {
          date: "NOVEMBER – DECEMBER 1942",
          title: "The Rzhev Grinder",
          historicalRecord: true,
          situation:
            "A stubborn German salient at Rzhev, roughly 130 miles from Moscow, has absorbed repeated Soviet offensives through 1942 without breaking. As Stavka finalizes the plan that will become Operation Uranus at Stalingrad, Zhukov himself is preparing a second, simultaneous offensive against Rzhev — Operation Mars — arguing the salient still threatens the capital and that German reserves pinned there cannot reinforce the south." +
            (flags.rzhevSummer42 === "limited"
              ? " The armies that will carry Mars are not the ones the historical record spent here in August — this command held the summer offensive to limited pressure rather than pressing it to Karmanovo and past, so Zhukov is arguing his case with formations that went into autumn less bled than they otherwise would have."
              : "") +
            (flags.forkRzhevThin
              ? "\n\nOne detail Zhukov's own staff can't yet explain: Model's garrison here is reporting thinner than the winter's usual pattern — reserves that should be backstopping this salient are, for reasons Soviet intelligence hasn't identified, not where the order of battle says they should be."
              : ""),
          choices: [
            {
              label: "Launch Operation Mars against Rzhev in full strength, alongside the southern offensive",
              advisor: { name: "Zhukov", quote: "Rzhev is a pistol aimed at Moscow's head. I do not intend to let it stay loaded while we fight elsewhere." },
              historical: true,
              setFlags: { rzhev42: "mars" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: "stalingradStreets42",
              outcome:
                "Operation Mars, launched days after Uranus, failed to break the Rzhev salient against a well-prepared defense under Model, at a cost historians estimate above 100,000 Soviet dead — a toll on the scale of Stalingrad's own casualties, for none of its strategic result. Soviet official histories did not acknowledge the operation's existence for nearly fifty years.",
            },
            {
              label: "Scale Rzhev back to holding pressure only — commit the freed reserves to the south",
              advisor: { name: "Vasilevsky", quote: "Uranus is working. Mars is a wager that Rzhev's German garrison would otherwise reinforce the Volga. I do not believe that wager, and I would rather spend the men where the plan is already succeeding." },
              setFlags: { rzhev42: "holding" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "stalingradStreets42",
              outcome:
                "A reduced Rzhev commitment preserves meaningfully more men for the theater where Stavka's main effort is already succeeding. Most postwar assessments judge Mars's actual value in pinning German reserves away from the south to have been smaller than its historical cost — this path tests that judgment directly rather than accepting it on faith.",
            },
          ],
        };
        },
        get stalingradCounter42() {
          return {
          date: "NOVEMBER 1942",
          title: "Operation Uranus",
          historicalRecord: true,
          situation:
            "German Sixth Army is committed, street by street, to the ruins of Stalingrad — exactly the kind of static, grinding fight Soviet planners have learned to feed rather than resist directly. Its flanks, north and south of the city, are held by Romanian and Italian armies: weaker, more thinly equipped, and now the target of the largest counteroffensive Stavka has assembled. How large to make the encirclement, and how far to trust that German reserves cannot reach it in time, is what's actually undecided." +
            (flags.forkStalingradConsolidate
              ? " Sixth Army's own earlier hesitation to press fully into the city has left it somewhat better organized on the flanks than the historical, fully-committed version ever was — Uranus is closing on a defense that had a little more time to prepare for it."
              : "") +
            (flags.forkRzhevThin && flags.rzhev42 === "mars"
              ? " Whatever thinned Model's garrison at Rzhev never got explained, and it hasn't mattered enough on its own to change anything here — Mars still spent itself against the salient at full historical cost, and Uranus was assembled and launched without reference to it."
              : ""),
          choices: [
            {
              label: "The full envelopment — strike deep, trap Sixth Army entirely",
              advisor: { name: "Zhukov", quote: "Do not merely push them back from the city. Close the ring far enough out that nothing can reopen it before winter finishes what the ring starts." },
              historical: true,
              setFlags: { uranus42: "deep" },
              impact: { manpower: 1, fuel: 0, initiative: 1 },
              next: "southernPursuit43",
              outcome:
                "What happened, November 19–23, 1942. The pincers closed roughly 100 kilometers west of Stalingrad, trapping the entire Sixth Army — some 250,000 men — far more completely than a shallower envelopment would have. Manstein's relief attempt in December came within roughly 30 miles and was stopped; the trapped army surrendered in February 1943, one of the war's genuine turning points.",
            },
            {
              label: "A shallower envelopment — trap the city's garrison, accept more will escape",
              advisor: { name: "Vasilevsky", quote: "A tighter ring risks less if German armor moves faster than we project. A looser one guarantees less if it moves exactly as slowly as we hope." },
              setFlags: { uranus42: "shallow" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "escapedRemnants43",
              outcome:
                "The likely shape of the more conservative version of the same plan: a shallower ring is faster to close and harder for a relief attempt to threaten from outside, but it lets a meaningful fraction of Sixth Army fight its way out or avoid encirclement entirely before the trap shuts. Stalingrad still falls; the encirclement's total prisoner count — the number that shocked the German high command most — is smaller. What escaped is now somewhere on the steppe, and still armed.",
            },
          ],
        };
        },
        get southernVacuum43() {
          return {
          date: "JANUARY 1943",
          title: "The Southern Vacuum",
          historicalRecord: false,
          situation:
            "An entire German army group is gone, a full year ahead of the historical schedule this campaign otherwise tracks — and the southern theater that army group anchored is, for the moment, essentially empty. Ukraine and the approaches to the Balkans lie open in a way no Soviet offensive has found the German line before. The trouble with a vacuum this size and this early is that filling it faster than the front's own logistics can support is exactly the mistake that produced the historical Kharkov overextension a month later — on a much smaller collapse than this one. The deep envelopment Stalingrad closed in November is the same instinct that just closed this one too — the ring that let nothing out at the Volga is the ring that let nothing out at Rostov, and this vacuum is what a full year of that instinct, run twice, actually looks like on a map." +
            (meters.fuel <= -3
              ? " The maximalist answer is already off the table before the staff finishes briefing it: there isn't fuel enough left in this theater's tanks to drive deep into a vacuum this size, whatever the map's temptation. Whatever fills the gap, it won't be a fast armored push."
              : ""),
          choices: [
            {
              label: "Pour everything into the gap — the whole southern front is open, take Ukraine before it can be replugged",
              advisor: { name: "Vatutin", quote: "I have spent the entire war being told to consolidate before the enemy has a chance to recover. For once, there is no enemy left in front of us to recover. Move." },
              historical: false,
              checkLabel: "Fuel",
              disabledReason: meters.fuel <= -3 ? "insufficient fuel to press this deep into the vacuum" : undefined,
              setFlags: { southernVacuum43: "pour" },
              impact: { manpower: -2, fuel: -2, initiative: 1 },
              next: "vacuumOverreach43",
              outcome:
                "The maximalist read of an unprecedented opportunity: the offensive drives deep into Ukraine on momentum and audacity, well past what the supply lines can actually sustain — the historical Kharkov overextension, repeated at a scale the historical version never risked, because this time the prize actually justified the gamble. Whether the front can hold what it just took is now the entire war in miniature.",
            },
            {
              label: "Fill the gap methodically — advance only as far as supply lines can properly support",
              advisor: { name: "Vasilevsky", quote: "A vacuum this size is not going anywhere by itself. Filling it badly and losing it back is a worse outcome than filling it slowly and keeping it." },
              historical: false,
              setFlags: { southernVacuum43: "methodical" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "kharkov43",
              outcome:
                "The disciplined answer to a temptation the historical Kharkov overextension existed specifically to warn against: the advance stops where supply allows rather than where the map permits, banking the destroyed army group's strategic effect without gambling it on a logistics-defying lunge. Slower, and considerably less likely to hand back in February what was won in January.",
            },
          ],
          };
        },

        get vacuumOverreach43() {
          return {
          date: "FEBRUARY 1943",
          title: "The Salient Outruns Itself",
          historicalRecord: false,
          situation:
            "Ukraine opened faster than it could be held. The spearhead is now a salient rather than a front — deep, narrow, and increasingly dependent on supply columns running further behind it every day the advance continues — and German intelligence is reading exactly what this staff would read in the same position: an overextension too tempting for whatever counterstroke capacity Manstein still has not to try. The question is no longer whether to take more ground. It's whether to keep reaching for the Dnieper crossings before that counterstroke can organize, or spend this month's momentum digging in on ground that can actually be defended when it comes." +
            (meters.fuel <= -4
              ? " The reaching option is already closing itself off — there isn't fuel left in this salient's tanks to run further columns out from a supply line already stretched past what doctrine calls sound."
              : ""),
          choices: [
            {
              label: "Keep reaching — push for the Dnieper crossings before Manstein can organize a response",
              advisor: { name: "Vatutin", quote: "Every additional kilometer we take now is a kilometer the counterstroke has to cross before it reaches anything that matters. I would rather be too far forward than early enough to be comfortable." },
              historical: false,
              checkLabel: "Fuel",
              disabledReason: meters.fuel <= -4 ? "insufficient fuel left in the salient to run columns any further forward" : undefined,
              setFlags: { vacuumOverreach43: "reach" },
              impact: { manpower: -1, fuel: -2, initiative: 1 },
              next: "kharkov43",
              uncertain: [
                {
                  weight: modWeight(30, meters.fuel),
                  title: "The crossings are actually taken",
                  setFlags: { vacuumOverreachResult: "crossings" },
                  impact: { manpower: 0, fuel: -1, initiative: 2 },
                  outcome:
                    "The gamble clears ground the historical offensive never reached: forward elements seize crossings over the Dnieper a full year ahead of the real 1943 fighting for the same river line, on a salient thinner and more exposed than any staff manual would sign off on. What Manstein's counterstroke meets, when it comes, is a front that has already banked a prize this campaign's own historical version spent another year fighting for — whatever the counterstroke costs to answer, it isn't answering nothing.",
                },
                {
                  weight: 100 - modWeight(30, meters.fuel),
                  title: "The spearhead is cut off before it reaches the river",
                  setFlags: { vacuumOverreachResult: "cutOff" },
                  impact: { manpower: -3, fuel: -1, initiative: -1 },
                  outcome:
                    "The overextension does exactly what overextensions do: the lead formations outrun both fuel and infantry support, and Manstein's counterstroke doesn't wait for the crossings to be reached — it cuts the salient's neck first. What was the most exposed Soviet spearhead of the entire eastern war loses more, in men and equipment, than the historical Kharkov overextension ever risked, for a river line that stays German for another year regardless.",
                },
              ],
            },
            {
              label: "Dig in — trade some of the gained ground for a shape Manstein's counterstroke can't easily unhinge",
              advisor: { name: "Vasilevsky", quote: "A salient this narrow is an invitation, not an achievement. I would rather hold a shorter line I can actually supply than a longer one I am explaining the loss of by March." },
              favor: 1,
              setFlags: { vacuumOverreach43: "consolidate" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "kharkov43",
              outcome:
                "The harder discipline, held a second time in as many decisions: rather than reach for a prize the salient's own supply lines can't yet support defending, the front pulls back onto ground with a real flank and a real rear — costing some of January's gains but denying Manstein's counterstroke the thin, overextended neck it would otherwise be built to cut.",
            },
          ],
          };
        },

        get rostovAftermath43() {
          return {
          date: "JANUARY 1943",
          title: "What's Left to Chase",
          historicalRecord: true,
          situation:
            "Army Group A is through the gap, but 'through' doesn't mean 'safe' — the withdrawal is a column strung out across difficult Caucasus terrain, rear guards fighting delaying actions, equipment abandoned at every river crossing that couldn't be forced fast enough. The door that was supposed to close is open a crack, and a crack is still something. What it costs to widen it, against an enemy that has already proven this winter it can extract itself skillfully even from a closing trap, is the real question now." +
            (flags.uranus42 === "deep"
              ? " There is a real irony in that: the same command that closed the Stalingrad ring without a single gap open in it is watching this one slip anyway, on ground and weather Sixth Army's own encirclement never had to contend with."
              : flags.uranus42 === "shallow"
              ? " It is the same pattern this command has now seen twice this winter — the looser ring at Stalingrad let a slice of German strength go, and this drive is watching a second one do the same."
              : ""),
          choices: [
            {
              label: "Press the pursuit into the mountains — the withdrawal isn't finished being punished",
              advisor: { name: "Vatutin", quote: "They are still on the road. A column on a road is not an army that has escaped — it is an army that is still being caught, one rear guard at a time." },
              historical: false,
              setFlags: { rostovAftermath43: "press" },
              favor: -1,
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "kharkov43",
              outcome:
                "The harder read of an unresolved question: continuing to press into terrain that favors the withdrawing force over the pursuing one costs real strength for real but limited additional damage — more equipment abandoned, more rear guards destroyed rather than merely delayed, none of it changing the fact that Army Group A's core survived intact through the gap regardless of how hard the pursuit runs after it.",
            },
            {
              label: "Let the withdrawal finish — pivot the freed-up strength toward exploiting Stalingrad instead",
              advisor: { name: "Rokossovsky", quote: "I have a quarter-million prisoners to process and an army to rebuild from a battle already won. Chasing stragglers through mountains is someone else's war to fight, not mine." },
              historical: true,
              setFlags: { rostovAftermath43: "pivot" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "kharkov43",
              outcome:
                "What actually happened, and the disciplined reading of a costly winter: the pursuit is called off, the strength it would have spent goes instead into properly exploiting the Stalingrad victory already banked, and Army Group A's survival becomes 1943's problem rather than a debt collected in the mountains at a price this winter's logistics couldn't really afford.",
            },
          ],
        };
        },
        get kharkov43() {
          return {
          date: "FEBRUARY – MARCH 1943",
          title: "The Overextension at Kharkov",
          historicalRecord: true,
          situation:
            "Fresh from Stalingrad's triumph, Soviet forces push aggressively west, liberating Kharkov in mid-February and continuing toward the Dnieper — outrunning fuel depots, tank repair shops, and their own infantry support in the process. German intelligence, and Manstein personally, read the overextension as an opening for exactly the kind of mobile backhand counterstroke the German army no longer has the strength to attempt on any larger scale." +
            (flags.rostovAftermath43 === "press"
              ? " This is the second time in as many months this front has pressed a pursuit past what its own supply lines could support — Rostov's aftermath already ran this exact risk once, and the habit that worked there is being tested again here."
              : flags.rostovAftermath43 === "pivot"
              ? " Rostov's pursuit was reined in deliberately last month rather than run to its limit — whatever discipline that decision reflected isn't the one governing this front's current momentum toward Kharkov."
              : "") +
            (flags.vacuumOverreachResult === "crossings"
              ? " This front has already gambled once this winter and won — the Dnieper crossings taken in January are the reason Manstein's counterstroke has more ground to cross before it reaches anything that matters."
              : flags.vacuumOverreachResult === "cutOff"
              ? " This front has already paid for one overextended salient this winter, cut off before it ever reached the river it was reaching for — whatever appetite existed for repeating that risk should have been spent already."
              : flags.southernVacuum43 === "methodical"
              ? " This front chose the disciplined read of January's vacuum over the maximalist one — the caution now facing its own test against Manstein's counterstroke."
              : ""),
          choices: [
            {
              label: "Continue the pursuit at full speed — the German army is broken, press the advantage",
              advisor: { name: "Golikov", quote: "We have not stopped moving since Stalingrad. I do not intend to be the front commander who stopped first." },
              historical: true,
              setFlags: { kharkov43: "press" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "katynRevelation43",
              // Hidden-information choice: whether the German army has anything left for a
              // counterstroke is the exact thing Soviet intelligence in February 1943 could not
              // actually read — concealRoll withholds the odds until the OutcomeScreen's post-hoc
              // reveal, matching the genuine fog this decision was made under.
              concealRoll: true,
              uncertain: [
                {
                  weight: modWeight(70, meters.fuel),
                  title: "Manstein's backhand lands",
                  impact: { manpower: -2, fuel: 0, initiative: 0 },
                  outcome:
                    "Largely what happened. Manstein's counterstroke, spearheaded by SS Panzer divisions, recaptures Kharkov in mid-March — the last major German operational victory in the east, and a sharp reminder that even after Stalingrad the war was not a one-way advance. The front stabilizes into the salient that will become Kursk.",
                },
                {
                  weight: 100 - modWeight(70, meters.fuel),
                  title: "The pursuit outruns Manstein's window",
                  impact: { manpower: 0, fuel: -1, initiative: 0 },
                  outcome:
                    "Better logistics discipline than the historical overextension keeps enough reserve in hand that Manstein's counterattack achieves less than its historical result. Kharkov still changes hands, but at lower cost, and the front settles close to where the historical spring line eventually stabilized regardless.",
                },
              ],
            },
            {
              label: "Halt and consolidate before the supply lines catch up",
              advisor: { name: "Vasilevsky", quote: "An army that has outrun its own artillery is not an army in pursuit. It is a target with good morale." },
              setFlags: { kharkov43: "halt" },
              impact: { manpower: 1, fuel: 1, initiative: 0 },
              next: "katynRevelation43",
              outcome:
                "A fair projection of the more disciplined choice: forgoing Kharkov's recapture for now in exchange for a defensive line German counterattack has much less to work with. It is, in essence, the lesson Stavka only fully absorbed after the historical version of this exact mistake — arrived at here a season early.",
            },
          ].concat([
              {
                label: "Skip Kharkov's recapture entirely — press the reserve straight past it toward the Dnieper crossings",
                disabledReason: (meters.manpower || 0) >= 3 && (meters.initiative || 0) >= 3 ? undefined : "Requires Manpower +3, Initiative +3 — the reserve to go around Kharkov rather than through it",
                advisor: { name: "Vatutin", quote: "Manstein needs the salient we would hand him at Kharkov. Don't hand it to him. Go around it entirely." },
                setFlags: { kharkov43: "dnieperPress", earlyDnieper43: true, speculativePath: true },
                impact: { manpower: -2, fuel: -1, initiative: 1 },
                next: "katynRevelation43",
                outcome:
                  "SPECULATIVE — no version of this front actually had a reserve intact enough to try this; the historical overextension happened precisely because Golikov's front had nothing left to screen its own flank once it reached Kharkov. Here, the discipline this command has banked since Stalingrad means there is something left: a covering force screens the Kharkov approach while the main body presses on toward the Dnieper without waiting to refight the city at all. Most operational historians would still back Manstein to find some opening elsewhere — the man built a career on finding them — but he isn't handed this particular one. The cost is a reserve spent thin at exactly the moment it might have been needed for something else, and a front now committed further west than its supply lines were built to support this early.",
              },
            ]).concat(
            flags.hardMode && (flags.suspicion || 0) >= 3
              ? [
                  {
                    label: "Request reassignment to a quieter sector — let a less-watched name carry the next decision",
                    advisor: { name: "Antonov", quote: "Nobody will call it cowardice on paper. A command change during an active offensive never is. Whether anyone believes the paper is a separate question." },
                    setFlags: { kharkov43: "step back" },
                    suspicionDelta: -1,
                    impact: { manpower: -1, fuel: 0, initiative: 0 },
                    next: "quietSector43",
                    outcome:
                      "A path only a sufficiently marked officer would think to take: stepping sideways into a quieter command, away from the decisions a watched file makes riskier than they should be. It costs standing and a share of the war's biggest moments. It also, for now, costs the special section a reason to keep looking.",
                  },
                ]
              : []
          ),
        };
        },
        get quietSector43() {
          return {
          date: "SPRING 1943",
          title: "The Quiet Sector",
          historicalRecord: false,
          situation:
            "The reassignment goes through without comment, which is itself a kind of answer. A quieter army, holding a quieter stretch of front, has smaller decisions and a smaller file. The war does not stop needing decisions made here, only smaller ones — and smaller decisions, made carefully, are how a marked officer stops being an interesting one.",
          choices: [
            {
              label: "Run the sector by the book — no initiative, no risk, no further attention",
              advisor: { name: "Antonov", quote: "The safest career in this army right now is the most boring one. I recommend it without embarrassment." },
              setFlags: { quietSector43: "byBook" },
              suspicionDelta: -1,
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: "katynRevelation43",
              outcome:
                "The sector holds, unremarkably, and unremarkable is exactly the point. The file, six months on, has a new note in it: nothing. For an officer in this position in 1943, nothing is close to the best entry available.",
            },
            {
              label: "Use the quieter posting to really fix something the front-line commands never had time for",
              advisor: { name: "Vasilevsky", quote: "A quiet sector is not a wasted one, whatever Moscow currently thinks of you. Fix the supply discipline nobody upstream had the time to fix." },
              setFlags: { quietSector43: "useful" },
              impact: { manpower: 1, fuel: 1, initiative: 0 },
              next: "katynRevelation43",
              outcome:
                "The quieter posting turns out to be really useful — supply and replacement discipline the front-line commands never had time to institute gets built here instead, quietly improving the divisions that eventually rotate through. It is not the kind of contribution that gets an officer noticed. It is, this year, exactly the kind an officer in this position should want.",
            },
          ],
        };
        },
        get katynRevelation43() {
          return {
          date: "APRIL 1943",
          title: "The Katyn Announcement",
          historicalRecord: true,
          situation:
            "German radio announces the discovery of mass graves at Katyn Forest — thousands of Polish officers, executed in 1940. Berlin blames Moscow. Moscow's own hands are, in fact, not clean here, and everyone making this decision already knows it.",
          choices: [
            {
              label: "Deny everything — blame German atrocity propaganda",
              advisor: { name: "Molotov", quote: "The Germans murder millions and accuse us of thousands. The answer is the same either way: it is a lie." },
              historical: true,
              setFlags: { katyn43: "deny" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "katynBreak43",
              outcome:
                "The denial held as Soviet policy for nearly fifty years — the USSR would not formally acknowledge Katyn until 1990. In April 1943 it costs one relationship directly: the Polish government-in-exile in London, already suspicious, breaks diplomatic relations within weeks. What fills the vacuum that break leaves is the next real question.",
            },
            {
              label: "Offer a limited, quiet acknowledgment to London alone",
              advisor: { name: "Molotov", quote: "You want me to hand the Poles a confession they will publish tomorrow. I decline to arm a government I already distrust." },
              historical: false,
              setFlags: { katyn43: "acknowledge" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "katynBreak43",
              outcome:
                "A quiet, limited acknowledgment might have slowed the diplomatic break with London — or, just as plausibly, have been leaked and used against Moscow regardless. Either way, the wartime alliance with the London Poles was already effectively over; this only changes how it ends, not whether — and what fills the vacuum is still the next real question.",
            },
          ],
        };
        },
        get katynBreak43() {
          return {
          date: "MAY 1943",
          title: "Who Speaks for Poland Now",
          historicalRecord: true,
          situation:
            "The London Poles are gone from Moscow's diplomatic table, and the practical question that leaves behind is not sentimental — it is who Stavka coordinates with, recognizes, and arms as Soviet forces approach Polish territory over the next two years. London's government-in-exile still has genuine standing with most Poles and with the Western Allies. It also, after Katyn, has no interest whatsoever in coordinating with Moscow, and won't for the rest of the war. The choice made here is the first real step toward a question this campaign will keep returning to as the front moves west.",
          choices: [
            {
              label: "Begin cultivating an alternative Polish political body — one that will actually work with Moscow",
              advisor: { name: "Molotov", quote: "If London will not speak to us, Poland will need a voice that does. I do not intend to leave that vacancy unfilled for two years." },
              historical: true,
              setFlags: { katynBreak43: "cultivate" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "partisans43",
              outcome:
                "What actually happened: the diplomatic vacuum left by the break becomes the space in which what will eventually be called the Lublin Committee starts to take shape — a Polish political leadership willing to coordinate with Moscow, assembled well before Soviet forces reach Polish soil. It resolves the immediate coordination problem. It also sets up the exact rivalry with London's government that the war's final two years, and the postwar settlement after it, will spend arguing about.",
            },
            {
              label: "Leave the Polish question open for now — a political problem for later, not this spring",
              advisor: { name: "Stalin", quote: "The front is a thousand kilometers from Warsaw. There will be time to decide who speaks for Poland when Poland is somewhere we can actually reach." },
              historical: false,
              setFlags: { katynBreak43: "defer" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "partisans43",
              outcome:
                "The patient reading, and a legitimately plausible one: with the front still deep in Soviet territory, formalizing a rival Polish leadership this early commits to a political fight before the military situation demands one. It costs the two years of preparation the historical alternative body used to build real standing before Soviet forces actually needed a Polish administration to hand territory to — a decision this campaign's later Polish-question nodes will inherit either way.",
            },
          ],
        };
        },
        get kurskDefense43() {
          return {
          date: "JULY 1943",
          title: "The Kursk Salient",
          historicalRecord: true,
          situation:
            "Soviet intelligence — including sources inside British codebreaking that Stavka does not fully explain even internally — has identified the coming German attack on the Kursk salient with unusual precision: axis, approximate date, even something close to the true order of battle. The question this creates is unfamiliar in this war: not how to survive a surprise, but what to do with the rarest asset either side has held — advance knowledge of the enemy's plan." +
            (flags.quietSector43 === "useful"
              ? " The supply and replacement discipline built quietly in a sector nobody was watching is, this month, exactly the kind of unglamorous readiness that turns advance warning into a defense actually capable of using it — divisions rotating into the salient arrive fed, equipped, and on schedule, which is not something this war has been able to take for granted."
              : flags.quietSector43 === "byBook"
              ? " The quiet, unremarkable sector that earned no attention earned no particular readiness either — an officer who spent the spring being invisible is, this month, simply one more command among many executing Zhukov's plan, no better prepared than the war generally allows and no worse."
              : "") +
            (meters.manpower <= -3
              ? " One answer to advance warning isn't available regardless of what this staff decides: there aren't reserves left to strike the assembly areas first with anything resembling real force. Whatever this knowledge buys, it buys through defense, not preemption."
              : ""),
          choices: [
            {
              label: "Defense in depth — let the offensive break itself on prepared minefields and anti-tank belts",
              advisor: { name: "Zhukov", quote: "We know where they are coming and roughly when. Spend that knowledge on the deepest, densest defensive system this army has ever built, not on trying to be clever about it." },
              historical: true,
              setFlags: { kursk43soviet: "defense" },
              impact: { manpower: -1, fuel: 0, initiative: -1 },
              next: "axis43",
              outcome:
                "What happened, and it worked precisely as planned: minefield densities up to 2,500 per kilometer and anti-tank gun belts arranged in mutually supporting layers absorbed the German offensive's momentum within days. It was the last major German strategic offensive of the eastern war — after Kursk, initiative belongs to Stavka for the rest of the conflict, without interruption.",
            },
            {
              label: "Preempt — strike the assembling German forces before they can launch",
              advisor: { name: "Vatutin", quote: "We know where they are massing. Why wait to be attacked when we could attack the assembly areas first?" },
              checkLabel: "Manpower",
              disabledReason: meters.manpower <= -3 ? "insufficient reserves left to strike first with any real force" : undefined,
              setFlags: { kursk43soviet: "preempt" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: "preemptResult43",
              outcome:
                "An honest account of the option Stavka seriously debated and rejected: striking first sacrifices the defensive advantage of a prepared, mined position in exchange for surprise against forces still assembling. Most Soviet planners judged the defensive plan superior specifically because it let German armor exhaust itself against prepared ground — attacking first risks meeting that same armor at its freshest, on ground not yet fortified in your favor. Which risk actually paid off is the rare question in this campaign the planners themselves were still arguing when the guns went off.",
            },
          ],
        };
        },
        get preemptResult43() {
          return {
          date: "JULY 1943",
          title: "The Strike Before the Storm",
          historicalRecord: false,
          situation:
            "The preemptive strike has landed against German forces still assembling in their jump-off positions — and the honest verdict is mixed in exactly the way the planners who rejected this option warned it would be. Some formations are caught disorganized. Others, further from the strike's actual axis, absorb the blow and simply launch on schedule regardless, now fully alerted rather than surprised.",
          choices: [
            {
              label: "Press the advantage where the strike actually landed — reinforce the disrupted sectors immediately",
              advisor: { name: "Vatutin", quote: "Half a success spent immediately is worth more than a whole success admired from a safe distance. Push where it worked." },
              historical: false,
              setFlags: { preemptResult43: "press" },
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "axis43",
              outcome:
                "The aggressive read of a truly mixed result: reserves pour into the sectors where the preemptive strike in truth disrupted German assembly, turning a partial success into something closer to a real local victory — while the sectors where the strike missed absorb the German offensive at close to its full, alerted strength, exactly as the planners who preferred the defensive plan predicted they would.",
            },
            {
              label: "Fall back on the prepared defensive lines regardless — the strike bought what it bought, don't chase more",
              advisor: { name: "Zhukov", quote: "We built the deepest defensive system this army has ever fielded. I am not abandoning it to chase a result the strike only half-delivered." },
              setFlags: { preemptResult43: "fallback" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "axis43",
              outcome:
                "The disciplined answer: whatever the preemptive strike achieved or didn't, the prepared minefields and anti-tank belts are still there, and the plan reverts to absorbing the offensive on ground built for exactly that purpose. The strike's actual contribution — real in places, negligible in others — gets banked rather than gambled further, which is close to what the planners who preferred the defensive option in the first place would have recommended doing with it.",
            },
          ],
          };
        },

        get axis43() {
          return {
          date: "AUGUST 1943",
          title: "The Axis of Pursuit",
          historicalRecord: true,
          directive: true,
          situation:
            "Kursk is won, the initiative is permanently Soviet, and the summer's pursuit must choose its main axis. South: the race to the Dnieper — the Donbas industrial region, Kiev, and the road into Ukraine, where the terrain runs fast and the political weight is heaviest. West: the Smolensk axis — Operation Suvorov's road, straight toward Belorussia and the shortest geographic line to Germany, into terrain of forests and prepared defensive lines that favors the defender. The historical answer weighted south decisively; the western school never stopped arguing its case.",
          choices: [
            {
              label: "South — the Dnieper, the Donbas, and Kiev before winter",
              advisor: { name: "Vatutin", quote: "Ukraine is grain, coal, iron, and forty million people. The war's ledger is written in the south and the pursuit belongs where the ledger is." },
              historical: true,
              setFlags: { axis43: "dnieper" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "dnieperRace43",
              outcome:
                "The southern weighting drove the pursuit to the Dnieper and across it before the year ended — the fastest strategic advance the Soviet war had yet produced, into the theater where the economic and political stakes ran highest. The western axis advanced too, took Smolensk, and stalled exactly where its skeptics predicted: in the forests and field fortifications that would wait for Bagration to solve them properly.",
            },
            {
              label: "West — the Smolensk axis, the shortest line pointed at Germany itself",
              advisor: { name: "Sokolovsky", quote: "Every kilometer west is a kilometer of the war's actual distance. The south is rich; the west is the way home — theirs and ours." },
              setFlags: { axis43: "west" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "smolenskGates43",
              outcome:
                "The western school gets the reserves the historical Suvorov never had, against terrain that was always the argument for not doing this. What the weighting buys — position for 1944's decisive blow a season early — and what it costs against forests and fortified lines, the next chapter settles in detail.",
            },
          ],
        };
        },
        get smolenskGates43() {
          return {
          date: "AUGUST – NOVEMBER 1943",
          title: "The Gates of Smolensk",
          historicalRecord: false,
          situation:
            "The reinforced western axis grinds forward through terrain that explains, kilometer by kilometer, why the historical Stavka weighted south: forest, marsh, and German field fortifications in successive belts — the same ground that will make Bagration's 1944 deception necessary. Smolensk falls, as it did historically; what the reinforcement buys beyond it is the real matter. The staff's argument now is between pressing into the fortified Orsha–Vitebsk gateway before winter, or converting the season's gains into forward positioning and letting 1944's blow start from here." +
            (meters.manpower <= -3
              ? " The more aggressive answer isn't seriously on the table this month — there isn't strength left to press a fortified gateway this deep. Whatever 1944 starts from, it starts from wherever this season's more modest gains leave it."
              : ""),
          choices: [
            {
              label: "Press the gateway — Orsha and Vitebsk before the year ends",
              advisor: { name: "Sokolovsky", quote: "The gateway is fortified because it matters. Every month it stands is a month their engineers improve it." },
              checkLabel: "Manpower",
              disabledReason: meters.manpower <= -3 ? "insufficient strength left to press a fortified gateway" : undefined,
              setFlags: { smolenskGates: "press" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: "bagrationSoviet44",
              uncertain: [
                {
                  weight: modWeight(30, meters.manpower),
                  title: "The gateway cracks further than expected",
                  impact: { manpower: -1, fuel: 0, initiative: 1 },
                  outcome:
                    "The favorable edge of an honestly contested question: reinforced mass, thrown at Orsha and Vitebsk in enough weight, does more than the smaller historical offensives managed — forward positions gained hold through the season, and the western axis enters 1944 further along than the historical stop line reached. It is not a breakthrough. It is a meaningfully better foothold than most staff assessments of this exact gamble expected.",
                },
                {
                  weight: 100 - modWeight(30, meters.manpower),
                  title: "The gateway holds regardless",
                  impact: { manpower: -2, fuel: 0, initiative: 0 },
                  outcome:
                    "The likelier reading, and the one that vindicates the historical pattern: even reinforced, the gateway holds through winter — the western axis's terrain problem was never a mass problem, and mass was what the reinforcement supplied. The forward positions are real; the cost of pressing them was the western school's own argument used against it.",
                },
              ],
            },
            {
              label: "Consolidate the season — winter positions now, the decisive blow from here in 1944",
              advisor: { name: "Antonov", quote: "We have moved the start line two hundred kilometers west. That is the season's victory; do not spend the winter buying its decimal places." },
              setFlags: { smolenskGates: "consolidate" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "bagrationSoviet44",
              outcome:
                "The consolidation banks the axis shift: 1944's great offensive will launch from positions the historical version spent its opening days reaching, with the armies that would have been spent on winter gateway assaults intact. The projection's honest caveat: the southern theater this weighting starved advanced correspondingly slower, and Ukraine's liberation — with everything it meant to the people waiting for it — runs months behind the historical clock.",
            },
          ],
        };
        },
        get dnieperRace43() {
          return {
          date: "AUGUST – NOVEMBER 1943",
          title: "The Race to the Dnieper",
          historicalRecord: true,
          situation:
            "The post-Kursk advance reaches the Dnieper faster than the army's own bridging equipment can follow. Hitler has ordered the river held as the 'Eastern Wall' — a fortified line meant to stop the Soviet advance outright. The choice in front of Stavka is whether to force crossings immediately, by whatever means troops can improvise, or wait for proper artillery and bridging support at the cost of giving German engineers time to dig the wall in.",
          choices: [
            {
              label: "Force the river now, wherever a crossing presents itself — improvise the means",
              advisor: { name: "Konev", quote: "Give them one week and the Eastern Wall is real concrete. Give me tonight and a raft, and it is a river with soldiers already on the far bank." },
              historical: true,
              setFlags: { dnieper43: "forced" },
              impact: { manpower: -2, fuel: 0, initiative: 1 },
              next: "bagrationSoviet44",
              outcome:
                "Soviet troops crossed the Dnieper on log rafts, empty fuel drums, and anything else that floated, seizing dozens of small bridgeheads before German defenses could properly organize along the 'Eastern Wall.' The improvisation worked strategically — the river line never became the fortress Hitler had ordered — at a cost in drowned and killed soldiers high enough that the crossing generated an unusually large number of the war's Hero of the Soviet Union citations, itself a measure of the losses involved.",
            },
            {
              label: "Slow down — mass artillery and proper bridging equipment before attempting a crossing",
              advisor: { name: "Vatutin", quote: "A bridgehead held by a company that drowned getting there is not a bridgehead. Give me three days and it holds because it is actually supplied." },
              setFlags: { dnieper43: "prepared" },
              impact: { manpower: 1, fuel: -1, initiative: -1 },
              next: "easternWallBreach43",
              outcome:
                "A more methodical crossing saves lives at the cost of time the Germans use to entrench the west bank further, turning the 'Eastern Wall' into something closer to the fortified line it was designed to be. Kiev's liberation — timed historically to fall on the anniversary of the Revolution, November 7 — would likely land later on this path, and the wall the extra days bought is now a real defensive line rather than a propaganda phrase, which changes what breaching it actually costs.",
            },
          ],
        };
        },
        get easternWallBreach43() {
          return {
          date: "NOVEMBER 1943",
          title: "The Wall That Actually Held",
          historicalRecord: false,
          situation:
            "The extra days bought German engineers what Hitler's order alone never could: a real defensive line along the west bank, not the improvised scramble the historical rushed crossing caught half-finished. Kiev sits behind it, and taking the city now means a proper set-piece assault against prepared positions rather than the historical race against an incomplete wall.",
          choices: [
            {
              label: "Mass artillery for a deliberate breakthrough — spend the shells the wait bought time to bring up",
              advisor: { name: "Vatutin", quote: "We paid for this wall in time instead of blood at the river. I would rather spend shells on it now than spend the blood we saved, later, trying to go around it." },
              historical: false,
              checkLabel: "Fuel",
              disabledReason: meters.fuel <= -3 ? "not enough shells and fuel left to mass artillery for a deliberate set-piece breakthrough" : undefined,
              setFlags: { easternWallBreach43: "artillery" },
              impact: { manpower: 1, fuel: -2, initiative: 0 },
              next: "bagrationSoviet44",
              outcome:
                "The trade the slower crossing was always implicitly making: fuel and shells spent now, against a wall that exists specifically because the crossing bought time to build it. Kiev falls to a genuine breakthrough rather than an improvised rush — slower, better-supplied, and arguably the more honest use of the caution that created the problem in the first place.",
              uncertain: [
                {
                  weight: modWeight(60, meters.fuel),
                  title: "The bombardment does what it was supposed to do",
                  impact: { manpower: 1, fuel: -2, initiative: 0 },
                  outcome:
                    "The shells buy exactly what they were spent for: the wall cracks where the guns are pointed, Kiev falls on schedule, and the deliberate approach vindicates itself in full — slower than the historical rush, but with a fraction of its cost in drowned and killed soldiers.",
                },
                {
                  weight: 100 - modWeight(60, meters.fuel),
                  title: "The wall is deeper than the reconnaissance estimated",
                  impact: { manpower: 0, fuel: -2, initiative: -1 },
                  outcome:
                    "The bombardment opens the first belt and finds a second behind it that nobody's maps showed — the extra days German engineers had didn't just widen the wall, they deepened it. Kiev still falls, a week later than planned and for more shells than budgeted, but it falls.",
                },
              ],
            },
            {
              label: "Probe for the weak sector rather than force the whole line — patience over weight",
              advisor: { name: "Konev", quote: "A wall this fresh has seams. Find one before you spend a winter's worth of shells proving the strong sections are strong." },
              historical: false,
              setFlags: { easternWallBreach43: "probe" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "bagrationSoviet44",
              outcome:
                "The patient answer to a problem the impatient answer created: reconnaissance in force finds a weakly-held sector rather than testing the wall's strongest point directly, and Kiev falls to infiltration rather than bombardment. Slower again, but the fuel this path saves is fuel Bagration will want next summer.",
            },
          ],
          };
        },

        get bagrationSoviet44() {
          return {
          date: "JUNE 1944",
          title: "Operation Bagration",
          historicalRecord: true,
          situation:
            "Stavka's deception effort — maskirovka — for the summer offensive is the largest of the war: false radio traffic, dummy armor concentrations, and leaked plans all point German intelligence toward a strike in the south, against Army Group North Ukraine. The real blow, some 2.3 million men with overwhelming armor and air support, is massing in secret against Army Group Center. How far to press it once German lines break is what's actually unresolved — whether Bagration remains a destruction of Army Group Center, or becomes a race for Warsaw and the war's political map." +
            (meters.manpower <= -5
              ? " One question the staff maps don't need to settle: three years of costly choices have left this front with nothing left to press with. Whatever Bagration destroys, it will not be chasing the wreckage to Warsaw's gates afterward — there is no reserve behind the breakthrough to do the chasing."
              : "") +
            (flags.smolenskGates === "press"
              ? " The habit of pressing past the safe stopping point is an old one on this front by now — Smolensk's gates were the first place this command chose momentum over caution, and Bagration is only the largest version of a decision already made once before."
              : "") +
            (flags.easternWallBreach43 === "probe"
              ? " The fuel saved probing rather than bombarding the Eastern Wall last autumn is fuel this offensive is spending now instead."
              : "") +
            (flags.forkDeceptionSeen
              ? " One thread of the maskirovka plan hasn't held as cleanly as the rest: persistent German air reconnaissance over the Center sector's concentration areas — ground the deception plan was supposed to keep uninteresting — has been reported for a fortnight now, and staff cannot yet say whether it will be read correctly, or in time, by whoever receives it in Berlin."
              : ""),
          choices: [
            {
              label: "Press the offensive to its logical operational limit — destroy Army Group Center completely",
              advisor: { name: "Rokossovsky", quote: "We have broken the front open. The only question left is how much of the enemy's army we destroy before our own supply lines tell us to stop." },
              historical: true,
              setFlags: { bagration44soviet: "full" },
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "warsawUprising44",
              outcome:
                "What happened, launched June 22, 1944 — three years to the day after Barbarossa. Army Group Center was effectively destroyed: 28 divisions gone, casualties estimated between 300,000 and 450,000, the largest single defeat the German army suffered in the entire war. Soviet forces reached the outskirts of Warsaw by early August — where the offensive's own supply lines, not German resistance, finally imposed a halt.",
              // Key Battle Subgame, battle #6 (round 15). Dev build only, same
              // KEY_BATTLE_SUBGAME_ENABLED-gated spread as Omaha/Stalingrad/Alam Halfa — shipped
              // builds keep this choice exactly as it was (deterministic, straight to
              // warsawUprising44). Models the opening breakthrough and the encirclement east of
              // Minsk, the operation's first and most decisive phase — not the whole June-August
              // offensive the outer choice's own text already covers. All facts verified
              // 2026-09-25 (Wikipedia: Operation Bagration, Minsk offensive): Soviet strength of
              // roughly 1,670,300 personnel, ~6,000 tanks and assault guns, and 7,799 aircraft
              // against Army Group Center's 486,493 combat troops, 495 tanks and assault guns,
              // and 920 aircraft (602 operational); the double maskirovka deception that left
              // four tank armies visible near Lvov while concealing the real Belorussian axis;
              // Hitler's Feste Plätze ("fortified places") order turning strongpoints into traps;
              // and the roughly 100,000-strong pocket east of Minsk, closed by early July, whose
              // trapped divisions (including the 25th Panzergrenadier Division, spearheading)
              // attempted a desperate breakout to the northwest and west on the night of 5 July
              // and were largely scattered, with Lieutenant-General Müller captured on 8 July.
              concealRoll: true,
              ...(KEY_BATTLE_SUBGAME_ENABLED
                ? {
                    keyBattleSubgame: {
                      id: "bagrationSoviet44",
                      title: "Order of Battle — The Drive on Minsk",
                      flavor:
                        "The front is open, and the only real question left is how fast the ring closes east of Minsk before what's left of Army Group Center finds a way back through it. The maskirovka has done its work — the reserves that could have blunted this are watching Lvov instead — and what stands between the spearheads and a hundred thousand trapped Germans is a matter of pace: how much of the rifle mass keeps the pocket sealed, how much of the tank strength drives the encirclement shut, what the air armies can do to a road network already choked with retreating columns, and how much gets held back to keep the whole advance fed rather than stretched thin across four hundred miles of liberated Belorussia.",
                      effectiveness: { divisions: 2.0, armour: 2.6, air: 1.8, supply: 2.2 },
                      // Round 22. Verified 2026-10-05 (Wikipedia, Operation Bagration): the Soviets left four tank armies
                      // in the L'vov area and let the Germans know it, so that the reserves stayed in the south; the
                      // fortified cities (Vitebsk, Orsha, Mogilev, Bobruisk, Minsk) became traps; the Soviet air armies
                      // dominated the roads; Minsk fell on 3 or 4 July. The three answers are options of the day;
                      // their payoffs against each German posture are modeled.
                      conditions: "High summer, with marsh, forest and river crossings across the line of advance. The roads are choked with retreating columns, and the Soviet air armies are over them.",
                      terrainModifiers: { armour: 0.9, air: 1.1 },
                      terrainNotes: { armour: "marsh and forest keep the tanks to the roads", air: "the Soviet air armies own the sky" },
                      decisions: [
                        {
                          id: "aimOfTheTanks",
                          time: "2130",
                          title: "Where the tanks are aimed",
                          prompt: "The front is open and the tank armies are through. Minsk is the great prize, and the German Fourth Army is falling back across the Berezina toward it. The tanks cannot do everything. The front commanders have to decide what they are aimed at.",
                          options: [
                            {
                              id: "straightAtMinsk",
                              label: "Drive the tank armies straight at Minsk",
                              note: "Take the city before a line can form, and leave the retreating army behind.",
                              bonus: 0,
                              bonusByPosture: {collapsingCenter: 4, fortifiedResistance: -3, deceptionHolding: 1},
                              reportLine: "The tank armies drive straight at Minsk down the roads, leaving the retreating Germans to their rear.",
                            },
                            {
                              id: "closeTheRing",
                              label: "Hold the tanks to close the ring behind the German Fourth Army",
                              note: "Trap the army rather than take the city first.",
                              bonus: 0,
                              bonusByPosture: {fortifiedResistance: 3, collapsingCenter: -2},
                              reportLine: "The tank armies turn to close the ring around the German Fourth Army east of Minsk.",
                            },
                            {
                              id: "keepTheFeint",
                              label: "Keep the feint toward the south alive to pin the German reserves",
                              note: "Costs Initiative to sustain, and keeps the reserves away from the fight.",
                              bonus: 0,
                              bonusByPosture: {deceptionHolding: 4, fortifiedResistance: 1},
                              meters: {initiative: -1},
                              costReason: "A deception sustained at the cost of the staff's attention",
                              reportLine: "The southern feint is kept up, and the German reserves stay where they were, watching Lvov.",
                            },
                          ],
                        },
                      ],
                      categoryContext: {
                        divisions:
                          "The rifle armies seal the ring after the tanks cut it. Chernyakhovsky's front alone commits rifle strength in the hundreds of thousands. Without them pressing behind the armored spearheads, whatever gets encircled finds its way back out.",
                        armour:
                          "Roughly six thousand tanks and assault guns committed against fewer than five hundred the Germans can field. Rotmistrov sees less a battle of maneuver than a battle of arithmetic — and the arithmetic is decided. The only variable is how quickly the ring closes.",
                        air:
                          "Nearly eight thousand aircraft massed against well under a thousand the Luftwaffe can put up, barely six hundred of those still flying. The roads out of the pocket are ours to strike whenever chosen.",
                        supply:
                          "Four hundred miles of advance since Vitebsk means four hundred miles of front for the rear services to feed. What isn't stockpiled now becomes a shortage the offensive discovers somewhere past the Berezina.",
                      },
                      flashups: {
                        divisions: [
                          "A rifle division moves up to seal another stretch of the encirclement line.",
                          "Forward scouts report a German column trying to slip the ring under cover of dark.",
                          "A rifle regiment digs in across a road the pocket's garrison will need.",
                          "Partisan units link up with the advancing rifle line, reporting German movements.",
                          "A company holds a crossroads against a probing German patrol.",
                        ],
                        armour: [
                          "The tank spearhead cuts another road west of the pocket.",
                          "A tank column brushes aside a blocking position without slowing.",
                          "Rotmistrov's tanks close another few kilometers of the ring.",
                          "A tank brigade reports the encirclement line now continuous along its whole front.",
                          "The armored screen turns back a column trying to break west in the dark.",
                        ],
                        air: [
                          "Ground-attack aircraft work over a column jammed on the road out of the pocket.",
                          "A reconnaissance flight reports the pocket's exact shape by first light.",
                          "Fighters sweep the sky over the encirclement without contest.",
                          "A flight of bombers catches a column trying to move by daylight.",
                          "Air reconnaissance flags a gap in the ring before the ground troops find it themselves.",
                        ],
                        supply: [
                          "A fuel column finally catches up to the leading tank brigades.",
                          "Engineers finish a bridge the retreating Germans tried to destroy.",
                          "An ammunition train reaches the front after four hundred miles of track.",
                          "A supply officer reports the forward dumps thinner than the plan assumed.",
                          "Rail repair crews restore another stretch of line behind the advance.",
                        ],
                      },
                      reportTimes: { open: "0300", contact: "0600", cats: ["0900", "1200", "1600", "2000"], reserve: "2300", counter: "0100" },
                      idleLines: {
                        divisions: [
                          "The rifle armies stay on their start lines. Nobody is sealing anything yet.",
                          "No infantry moves up behind the spearhead. The ring stays open where they'd have closed it.",
                        ],
                        armour: [
                          "The tank reserve sits fueled and idle. Nothing is cutting the roads west.",
                          "No armored spearhead goes forward. The encirclement has nothing driving it shut.",
                        ],
                        air: [
                          "Nothing flies over the pocket's roads. Whatever moves on them, moves unmolested.",
                          "The air armies stay grounded. The Luftwaffe's remnant has the sky to itself today.",
                        ],
                        supply: [
                          "Nothing extra moves up behind the advance. The spearheads run on what they already have.",
                          "The rear services make no special effort today. The front feeds itself or it doesn't.",
                        ],
                      },
                      verdicts: ["The Ring Closes at Minsk", "The Pocket Stays Open"],
                      verdictGrades: {
                        clean: "Every arm moved together, and a hundred thousand Germans found the ring already shut behind them.",
                        costly: "The ring closes at Minsk — but it cost more to hold shut than the plan allowed for.",
                        marginal: "The encirclement stalls with a gap still open. The plan held together; the ring didn't quite.",
                        total: "The encirclement doesn't stall so much as come apart before it ever really closes.",
                      },
                      counterattack: {
                        category: "divisions",
                        severity: { deceptionHolding: 1, fortifiedResistance: 1, collapsingCenter: 2 },
                        warn: {
                          1: "German troops trapped inside the pocket are probing the ring for a way out.",
                          2: "Whole divisions inside the pocket — the 25th Panzergrenadier spearheading — are massing for a breakout west, not a token probe.",
                        },
                        results: {
                          repulsed: "The breakout is thrown back into the pocket and the ring holds its shape.",
                          heldAtCost: "The ring holds, and the rifle division that held it is badly cut up doing it.",
                          broke: "The breakout punches through the ring before the line can be reinforced.",
                          gaveGround: "The line gives up a stretch of the ring rather than fight the breakout out where it lands.",
                        },
                      },
                    },
                    uncertain: [
                      {
                        weight: modWeight(60, meters.fuel),
                        title: "The Ring Closes at Minsk",
                        setFlags: { bagrationMinsk: "sealed" },
                        impact: { manpower: 1, fuel: 0, initiative: 1 },
                        outcome:
                          "The ring closes east of Minsk close to on schedule, and what the historical record already calls the worst German intelligence failure of the war gets the clean encirclement its own planning assumed rather than the partial one several divisions actually escaped through. Army Group Center doesn't just lose 28 divisions' worth of strength on paper — it loses the men inside this specific pocket as an organized force, in full, rather than in the scattered fragments that historically slipped west.",
                      },
                      {
                        weight: 100 - modWeight(60, meters.fuel),
                        title: "The Pocket Stays Open",
                        setFlags: { bagrationMinsk: "leaked" },
                        impact: { manpower: -2, fuel: -1, initiative: -1 },
                        outcome:
                          "Close to what actually happened: the ring closes late and thin, and a meaningful fraction of the encircled force — spearheaded by the 25th Panzergrenadier Division, the way the record already describes — scatters west through gaps the advance didn't have the reach to seal in time. Army Group Center is still destroyed as a fighting force; it just isn't destroyed as completely, or as fast, as the plan wanted.",
                      },
                    ],
                  }
                : {}),
            },
            {
              label: "Halt at Warsaw's approaches — consolidate the gains, let supply lines catch up first",
              advisor: { name: "Vasilevsky", quote: "An army that has advanced this far this fast is an army running on momentum, not fuel. Let the rear catch up before we ask it to do more." },
              setFlags: { bagration44soviet: "halt" },
              impact: { manpower: 1, fuel: 1, initiative: 0 },
              next: "balkans44",
              outcome:
                "A careful extrapolation of the more conservative operational choice: consolidating before Warsaw preserves the offensive's own logistics and reduces losses to overextension, at the cost of momentum the historical push all the way to the city's outskirts carried. With the northern axis paused, Stavka's attention shifts south, where Romania's own government is about to hand the war a different kind of opportunity.",
            },
          ].concat([
              {
                label: "Delay the launch a fortnight — push forward supply echelons up behind the start line first, so the offensive doesn't culminate where the map says it must",
                disabledReason: (meters.fuel || 0) >= 3 && (meters.manpower || 0) >= 2 ? undefined : "Requires Fuel +3, Manpower +2 — supply enough to dump forward and still launch",
                advisor: { name: "Khrulev", quote: "Every offensive this war has run until its trucks stopped, and then we have called the stopping place a decision. Give me two weeks and this one stops where you choose instead." },
                setFlags: { bagration44soviet: "full", forwardSupply44: true },
                impact: { manpower: 0, fuel: -3, initiative: -1 },
                next: "warsawUprising44",
                outcome:
                  "SPECULATIVE in scale, not in kind — the Red Army's rear services did exactly this sort of forward dumping before major operations, and Khrulev spent the war arguing for more of it; what no 1944 front had was the accumulated surplus to do it on the scale this command can now afford. Bagration launches a fortnight later and destroys Army Group Center just as thoroughly, but the spearheads that reach the Vistula in August arrive with fuel in the tanks and a supply chain that has moved up behind them rather than stretched out behind them. Whatever happens at Warsaw next, the logistics argument that dominated the historical decision will not be available in the same form.",
              },
            ]),
        };
        },
        get warsawUprising44() {
          return {
          date: "AUGUST 1944",
          title: "The Warsaw Uprising",
          historicalRecord: true,
          situation:
            "As Soviet spearheads reach the Vistula outside Warsaw, the Polish Home Army rises against the German garrison inside the city, expecting the Red Army's advance to complete its link-up within days. What in fact stands between the two is a real point of dispute among historians, and this campaign does not resolve which explanation carries more weight: Soviet forces have just completed an extraordinary 400-mile advance and are, by every logistics assessment, badly overextended, with armor down to a fraction of starting strength and facing a fresh German counterattack — including II SS Panzer Corps — at the city's approaches. At the same time, the Home Army answers to the Polish government-in-exile in London, a rival to the Soviet-backed committee Stalin has installed at Lublin, and some historians argue that political rivalry shaped what Stavka chose to do next as much as the logistics did." +
            (meters.fuel <= -4
              ? " Whatever weight the political argument carries, it isn't being tested this month — there isn't fuel enough left for a relief column to attempt the approach at all, regardless of who wanted to send one."
              : "") +
            (flags.forwardSupply44
              ? " The fortnight spent dumping supply forward before Bagration launched has an uncomfortable consequence here: these divisions are not the overextended, fuel-starved formations the historical halt was explained by. The logistics case that carried real weight in the actual August of 1944 carries much less of it on this front, this month. What that leaves standing is the other argument — the one about Lublin and London — with rather less to stand behind."
              : "") +
            (flags.forkDeceptionSeen && flags.bagration44soviet === "full"
              ? " The reconnaissance thread noted over the concentration areas a fortnight before launch never did resolve into a repositioned defense — whoever read those reports in Berlin, and whatever they made of them, Army Group Center was still destroyed on schedule. Wehrmacht postwar accounts would later wonder aloud how a warning that specific went nowhere."
              : "") +
            // Round 15 (battle #6 echo): the Minsk encirclement's own detail, not a fork — the
            // overextension this node's own text already turns on reads the same regardless of
            // whether the pocket sealed clean or leaked.
            (flags.bagrationMinsk ? keyBattleEcho("bagrationSoviet44", flags) : ""),
          choices: [
            {
              label: "Push the advance to relieve the uprising, whatever the logistics say",
              advisor: { name: "Rokossovsky", quote: "I do not enjoy telling Warsaw to wait. I enjoy even less the idea of feeding tired divisions into fresh SS armor to prove a point about how much I don't enjoy it." },
              checkLabel: "Fuel",
              disabledReason: meters.fuel <= -4 ? "insufficient fuel to attempt a relief column at all, let alone one that might break through" : undefined,
              setFlags: { warsaw44: "relieve" },
              impact: { manpower: -2, fuel: -1, initiative: 0 },
              next: "finnishArmistice44",
              uncertain: [
                {
                  weight: flags.forwardSupply44 ? modWeight(62, meters.fuel) : modWeight(22, meters.fuel),
                  title: "The relief breaks through",
                  setFlags: { warsawRelieved: true },
                  impact: { manpower: -1, fuel: 0, initiative: 0 },
                  next: "warsawRelief44",
                  outcome: flags.forwardSupply44
                    ? "With supply forward and armor still fuelled, the push reaches the west bank before II SS Panzer Corps can seal it off — at real cost against fresh armor, but not the forlorn hope the same attempt would have been on the historical logistics. This is not the historical record and this campaign will not pretend it is likely on the real August's supply position. It is what the same decision looks like when the fortnight was spent two months earlier, and it makes the halt that history chose look considerably more like a choice."
                    : "The favorable case breaks the way the uprising's fighters hoped it would: the push reaches the west bank before II SS Panzer Corps can seal it off, at real cost against fresh armor. This is not the historical record — most assessments still judge it the less likely outcome — but the logistics case for it was never as closed as the halt's defenders liked to claim, and this roll is where that genuine uncertainty lives.",
                },
                {
                  weight: flags.forwardSupply44 ? 100 - modWeight(62, meters.fuel) : 100 - modWeight(22, meters.fuel),
                  title: "The push is repulsed",
                  impact: { manpower: -1, fuel: -1, initiative: 0 },
                  next: "finnishArmistice44",
                  outcome:
                    "The likelier case, and the one most assessments favor: the rushed relief meets fresh SS armor at the approaches and is thrown back at real cost, without reaching the city. The uprising's fate ends up close to the historical one regardless of the attempt — proof, on this path, that the logistics argument carried real weight even if it wasn't the only thing in the room.",
                },
              ],
            },
            {
              label: "Halt at the Vistula — consolidate the exhausted advance, resupply before any further push",
              advisor: flags.forwardSupply44
                ? { name: "Bulganin", quote: "The order will say supply. Everyone who signs it will know the tanks have fuel. I would rather you heard that from me here than read it in someone's memoir in thirty years." }
                : { name: "Zhukov", quote: "I have looked at what is left of these divisions. I do not have an honest order that sends them further this week." },
              historical: true,
              setFlags: flags.forwardSupply44 ? { warsaw44: "halt", warsawHaltUnexcused: true } : { warsaw44: "halt" },
              impact: { manpower: 1, fuel: 1, initiative: 0 },
              next: "finnishArmistice44",
              outcome: flags.forwardSupply44
                ? "The same halt history ordered, on a front that — uniquely on this path — cannot honestly explain it the same way. Warsaw's uprising fought alone for 63 days and was crushed; the city was then systematically demolished on Hitler's direct order, block by block, after the surrender. Those are the settled facts and they do not change here. What changes is the accounting behind them: with supply forward and armor fuelled, the logistics defence that carries genuine weight in the historical debate has been spent in advance, and the decision stands on the other argument alone."
                : "Soviet forces halted along the Vistula for several months while the uprising, fighting alone, was crushed by German forces over 63 days — the city was then systematically demolished on Hitler's direct order in reprisal, block by block, after the surrender. Whether the halt was primarily a logistics necessity or partly a political calculation to let a rival Polish authority be destroyed remains one of the most contested judgment calls of the entire war among historians; the sources support weight on both sides of that question.",
            },
          ],
        };
        },
        get warsawRelief44() {
          return {
          date: "SEPTEMBER 1944",
          title: "The City Half-Saved",
          historicalRecord: false,
          situation:
            "A version of history that mostly didn't happen: the west bank relieved, a fighting corridor held open into a city still burning from two months of urban combat, the Home Army's survivors reinforced rather than annihilated. It changes what August 1944 means for Warsaw without changing what November 1944 will still cost — the garrison across the river hasn't been dislodged, only outflanked, and the political question underneath the halt decision hasn't gone away just because the logistics one broke the other way.",
          choices: [
            {
              label: "Arm and reinforce the Home Army directly — treat it as an allied force, not a problem",
              advisor: { name: "Rokossovsky", quote: "They fought for two months on captured rifles and belief. Whatever London or Lublin thinks of each other, the men across that river earned resupply." },
              setFlags: { warsawRelief44: "arm" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "polishQuestion45",
              outcome:
                "A rearmed Home Army survives as a fighting force into the winter, and the political question Stalin's installed Lublin committee was built to resolve gets harder to resolve quietly. Poland's postwar shape, on this path, is truly less certain than the historical outcome — which is either the best or the most complicating thing this relief achieved, depending entirely on which government in exile you asked. What Stavka does about an armed, London-loyal force still in the field is a question that has not gone away; it has only moved to next year.",
            },
            {
              label: "Hold the corridor, but keep the Home Army at arm's length — the city, not its garrison, was the objective",
              advisor: { name: "Bulganin", quote: "We relieved a city. We are not obligated to arm a rival government's soldiers while we do it." },
              historical: false,
              setFlags: { warsawRelief44: "distance" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "finnishArmistice44",
              outcome:
                "The narrower reading of the relief: the corridor holds, the city survives in a way its historical version didn't, and the Home Army is fed and treated correctly and armed not at all. The political calculation some historians already suspected in the historical halt doesn't disappear just because the military halt did — it simply moves to a quieter register.",
            },
          ],
        };
        },
        get balkans44() {
          return {
          date: "AUGUST – OCTOBER 1944",
          title: "The Balkan Question",
          historicalRecord: true,
          situation:
            "Romania's government overthrows Antonescu and switches sides in August 1944, opening the road south into the Balkans — Bulgaria, Yugoslavia, where Tito's partisans already control large stretches of territory, and eventually Hungary and the approach to Austria. How hard to press the Balkan axis, against conserving strength for the more direct approach to Germany through Poland, is what's actually unsettled." +
            (meters.fuel <= -3
              ? " One version of that question answers itself before the staff meets: there isn't fuel enough to press an offensive this far south of the main axis, whatever the political case for it."
              : ""),
          choices: [
            {
              label: "Press deep into the Balkans — take Belgrade, then push toward Austria",
              advisor: { name: "Tolbukhin", quote: "Romania fell in days once its own government turned. Bulgaria may do the same. I would rather move while that door is open than find it closed later." },
              setFlags: { balkans44soviet: "deep" },
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "finnishArmistice44",
              uncertain: [
                {
                  weight: 65,
                  title: "Tito's partisans cooperate smoothly",
                  impact: { manpower: -1, fuel: 0, initiative: 1 },
                  outcome:
                    "A deeper Balkan commitment shapes the postwar political map further west and south than the historical, more measured advance did, at the cost of forces the main axis toward Berlin does not have this winter. Tito's partisans, already the dominant force in Yugoslavia, cooperate with the heavier Soviet presence about as well as the historical lighter one — which is to say, cordially and on Tito's own terms.",
                },
                {
                  weight: 35,
                  title: "The deeper presence strains a relationship already headed for 1948",
                  impact: { manpower: -2, fuel: 0, initiative: 0 },
                  outcome:
                    "The genuine variable in any deeper Soviet Balkan commitment: Tito's partisans didn't need Moscow's help to liberate Yugoslavia and the historical record shows he never fully forgot it. A heavier Soviet military presence on his ground now reads less like solidarity and more like the same pattern that actually produced the 1948 break — just arriving with the Wehrmacht still fighting rather than four years later.",
                },
              ],
            },
            {
              label: "Limit the Balkan commitment — support Tito and Bulgaria's switch, keep the main weight aimed at Germany",
              advisor: { name: "Antonov", quote: "Tito's partisans are doing most of the work in Yugoslavia without us. Let them. Our weight belongs on the road to Berlin." },
              historical: true,
              setFlags: { balkans44soviet: "limited" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "finnishArmistice44",
              outcome:
                "Broadly what happened. Red Army support for the Balkan front was real but secondary to the main effort aimed at the German heartland; Belgrade was liberated with Soviet support, but Tito's own partisans did the bulk of Yugoslavia's liberation without extensive direct Soviet occupation — a fact that mattered again in 1948, when Yugoslavia became the first communist state to break from Moscow's bloc.",
            },
            {
              label: "Push further south still — reach Athens before the British do",
              advisor: { name: "Tolbukhin", quote: "EAM already controls most of the Greek countryside. If our own forces are the ones who reach the capital, Moscow negotiates the peace from inside the city, not from a map in London." },
              historical: false,
              checkLabel: "Fuel",
              disabledReason: meters.fuel <= -3 ? "insufficient fuel to press an offensive this far south of the main axis" : undefined,
              setFlags: { balkans44soviet: "greece" },
              impact: { manpower: -2, fuel: -1, initiative: 0 },
              next: "athensRace44",
              outcome:
                "The one Balkan door the historical Red Army never actually tried, because Moscow's own strategic bargaining — the still-unsigned percentages arrangement Churchill will propose to Stalin in person within weeks — assumed Greece as Britain's alone. Pushing south of the historical stop line means arriving somewhere the war's real diplomacy never planned for Soviet boots to be, days before Britain's own landing force is due.",
            },
          ],
        };
        },
        get athensRace44() {
          return {
          date: "OCTOBER 1944",
          title: "The Race for Athens",
          historicalRecord: false,
          situation:
            "EAM's partisans already hold most of the Greek countryside, and the mountain roads south are lightly defended — the retreating Germans have no interest in fighting for ground they've already written off. The one real obstacle is time: a British force is en route by sea, and whichever flag reaches Athens first has the stronger claim on what happens to Greece once the guns go quiet. This is not a fight Moscow's diplomacy planned for. It is happening anyway, because the road was open and someone decided to use it.",
          choices: [
            {
              label: "Push the column through the mountains, whatever the cost — Athens before the British ships arrive",
              advisor: { name: "Tolbukhin", quote: "The ships are still at sea. The mountains are not. We have the only advantage that really matters here, and it is a short one." },
              historical: false,
              setFlags: { athensRace44: "push" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              uncertain: [
                {
                  weight: modWeight(30, meters.fuel),
                  title: "Soviet forces reach Athens first",
                  impact: { manpower: -1, fuel: -1, initiative: 0 },
                  next: "athensStandoff44",
                  outcome:
                    "The long-odds race breaks the way the boldest reading hoped: mountain roads and EAM's local cooperation get a Soviet column into Athens days ahead of the British landing force — the single furthest a Red Army unit ever reaches into what the war's real diplomacy always treated as exclusively Britain's sphere. Whatever the percentages agreement Churchill and Stalin sign in Moscow this month says on paper, on the ground it will already have been argued with rifles first.",
                },
                {
                  weight: 100 - modWeight(30, meters.fuel),
                  title: "The British force arrives first",
                  impact: { manpower: -1, fuel: -1, initiative: 0 },
                  next: "finnishArmistice44",
                  outcome:
                    "The likelier case, and the one the actual balance of naval versus overland logistics generally favors: British forces land and secure Athens before the Soviet column clears the mountains. The gambit costs fuel and time the main Berlin axis will want back, for a prize that arrives a few days too late to claim. Moscow's diplomacy is spared having to explain a fact on the ground it never authorized.",
                },
              ],
            },
            {
              label: "Halt at the Greek border — Athens was never actually the objective, only testing whether the road was open",
              advisor: { name: "Antonov", quote: "We have learned what we needed to learn: the road is open, and we chose not to take it. That is worth more to Moscow's next negotiation than the city itself would have been." },
              historical: true,
              setFlags: { athensRace44: "halt" },
              impact: { manpower: 1, fuel: 1, initiative: 0 },
              next: "finnishArmistice44",
              outcome:
                "What happened, in substance if not in this exact staged form: Soviet forces never seriously contested Greece, and Stalin honored the still-unsigned percentages logic almost to the letter once it was formalized — famously declining to support EAM/ELAS even during the Greek Civil War's bloodiest years that followed. Whatever else is true of the postwar carve-up, this campaign records that this particular restraint was real, and it was Moscow's own choice to keep it.",
            },
          ],
          };
        },

        get athensStandoff44() {
          return {
          date: "OCTOBER 1944",
          title: "A Flag Over Athens",
          historicalRecord: false,
          situation:
            "Soviet forces hold Athens when the British landing force arrives offshore to find someone else's flag already flying over it. Nothing in the war's actual diplomacy prepared for this moment — Churchill's percentages proposal to Stalin, still weeks from being formally discussed in Moscow, assumed exactly the opposite. What happens next is being decided by two capitals that did not plan for this conversation, on a timeline neither controls.",
          choices: [
            {
              label: "Hold the position and let Moscow's diplomats argue from strength — the ground is already won",
              advisor: { name: "Molotov", quote: "We do not hand back a city we hold to make a negotiation easier. Let London explain to its public why British ships are anchored outside a port they cannot land in." },
              historical: false,
              setFlags: { athensStandoff44: "hold" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "finnishArmistice44",
              outcome:
                "The maximalist read of an accident of timing turned into leverage: Soviet forces hold Athens while the diplomats argue over a fact the war's actual peace conferences never had to negotiate around. It very likely changes the percentages logic Churchill and Stalin actually settle on — probably not in Greece's favor of full Soviet control, since the British public and Parliament will not accept losing it quietly, but the eventual compromise costs both sides considerably more than the version history recorded, and the alliance's temperature drops noticeably earlier than it in truth did.",
            },
            {
              label: "Withdraw voluntarily — an accident of timing shouldn't become a permanent crisis between allies",
              advisor: { name: "Stalin", quote: "We were faster, not entitled. Withdraw before this becomes a reason for Churchill to remember it at every table for the rest of the war." },
              historical: true,
              setFlags: { athensStandoff44: "withdraw" },
              cohesionDelta: 0,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "finnishArmistice44",
              outcome:
                "The restraint that, per the historical record, actually characterized Stalin's approach to Greece almost without exception: a fact on the ground that could have been kept is voluntarily surrendered, and the war's real diplomatic logic — Greece as Britain's sphere — reasserts itself close to on schedule. It costs nothing tangible and buys exactly the kind of goodwill that a colder, more suspicious alliance would have had far less of going into 1945.",
            },
          ],
          };
        },

        get polishQuestion45() {
          return {
          date: "WINTER 1944–45",
          title: "The Polish Question",
          historicalRecord: false,
          situation:
            "An armed, rearmed, and unmistakably London-loyal Home Army is still in the field as Soviet forces push toward the Vistula and beyond — a different fact than the historical record, where the organization was broken in the uprising and the Lublin committee's rival claim to govern Poland went essentially unchallenged. Stavka's political officers want an answer: does this force get absorbed, sidelined, or allowed to simply exist as an inconvenient reality the advance rolls past." +
            (flags.katynBreak43 === "defer"
              ? " The rival Polish leadership this moment needs has less standing than it might have — two years ago, this command chose to leave the question open rather than begin building it, and the Lublin committee is now assembling its own legitimacy later and faster than the historical version had to."
              : "") +
            (flags.katyn43 === "deny"
              ? " The Home Army's own rank and file have not forgotten what this command still officially denies — a standing grievance the absorption question cannot fully route around, whatever else changes about the military arithmetic."
              : ""),
          choices: [
            {
              label: "Absorb them into the Soviet-backed Polish forces — one army, one command, no ambiguity",
              advisor: { name: "Bulganin", quote: "An armed force with a rival loyalty does not get to simply continue existing at the front. It joins the army we recognize, or it stops being an army." },
              historical: false,
              setFlags: { polishQuestion45: "absorb" },
              suspicionDelta: 1,
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "finnishArmistice44",
              outcome:
                "The version of the postwar settlement Moscow actually wanted delivered a year early and by more direct means: the Home Army's survivors are folded into the Soviet-recognized Polish forces, by persuasion where possible and by the plain fact of who controls supply and reinforcement where it isn't. London's government-in-exile loses, on this path, the one card the historical outcome never let it hold in the first place — just more visibly, and with your own name closer to the decision.",
            },
            {
              label: "Let them stand apart — a second Polish army exists, and the postwar argument arrives early",
              advisor: { name: "Rokossovsky", quote: "I did not fight two months to save that army so it could be dissolved by paperwork the moment the shooting stopped elsewhere. Let it stand. Let Yalta argue about what standing means." },
              historical: false,
              setFlags: { polishQuestion45: "standApart" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "finnishArmistice44",
              outcome:
                "The harder, more honest version of what this whole relief was in fact for: a really independent Polish force enters 1945 still answering to London, which means the postwar argument about who governs Poland arrives at the negotiating table already half-fought in the field rather than settled by default before anyone sat down. Whether that changes Poland's actual postwar fate, given everything else already decided by whose army stands where, is the rare question in this campaign with no honest answer yet — only a harder version of the argument still to come.",
            },
          ],
          };
        },

        get finnishArmistice44() {
          return {
          date: "SEPTEMBER 1944",
          title: "The Finnish Question",
          historicalRecord: false,
          situation:
            "The Vyborg–Petrozavodsk offensive broke Finland's defensive lines in June, retook Vyborg, and put Finnish forces in a position no amount of the country's earlier resolve can argue away: the Red Army could, if ordered, press through to Helsinki. Finland's government has already answered the writing on the wall — Ryti resigned in August specifically so his own personal promise to Hitler not to seek a separate peace wouldn't bind his successor, and Mannerheim's new government is asking for terms rather than fighting on. What Stavka has to decide is what 'terms' means when the army asking for them is beaten badly enough that unconditional wouldn't be an unreasonable demand.",
          choices: [
            {
              label: "Grant a limited armistice — territory, reparations, and expulsion of German forces, but Finnish sovereignty intact",
              advisor: { name: "Zhdanov", quote: "A Finland that governs itself but owes us its borders and its reparations is a settled question. A Finland we occupy is an open one, indefinitely, with a population that has shown twice now what it costs to conquer." },
              historical: true,
              setFlags: { finlandOutcome: "armistice" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "vistulaOder45",
              outcome:
                "What actually happened, signed September 19th: Finland cedes territory beyond even the 1940 losses, pays substantial reparations, and — the term that matters most for the war still being fought — commits to expelling or interning every German soldier still on Finnish soil, a promise that becomes its own brief war in Lapland once Wehrmacht units refuse to simply leave. No occupation, no garrison, no divisions tied down administering a hostile population. The northern flank is settled for the cost of a signature rather than a campaign.",
            },
            {
              label: "Press for full capitulation and occupation — bring Finland into the Soviet sphere directly, as the Baltics were",
              advisor: { name: "Vasilevsky", quote: "We are extending exactly the mercy Berlin never extended anyone. I am not certain this staff has fully priced in what holding a hostile population this far north, through winters like these, would actually cost us." },
              setFlags: { finlandOutcome: "occupation" },
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "finlandOccupationCost44",
              outcome:
                "The harder path, and the one Finland's own history argues hardest against: divisions that could otherwise be finishing the war against Germany instead garrison a country whose population fought two wars in five years rather than accept exactly this outcome. Occupation is achieved in the narrow military sense — resistance is real but not organized on a scale that changes the map — but it is achieved at the cost of exactly the tied-down manpower and unsettled northern flank the historical armistice was specifically designed to avoid.",
            },
          ],
        };
        },
        get finlandOccupationCost44() {
          return {
          date: "OCTOBER 1944",
          title: "What Holding a Hostile Population Actually Costs",
          historicalRecord: false,
          situation:
            "Finland is occupied in the sense that matters on a map — garrisons sit in Helsinki and every port worth naming — but the population Vasilevsky warned about hasn't stopped being the same one that resisted occupation twice before. Scattered resistance is already testing how this occupation intends to answer it: isolated attacks on rail lines and requisition parties, nothing organized enough to change the military picture, but enough to force a real doctrine question before winter sets the pattern for however long this occupation actually runs.",
          choices: [
            {
              label: "Answer hard — collective reprisals, broad internment, treat any resistance as a population problem",
              advisor: { name: "Zhdanov", quote: "A population that has fought twice does not stop testing an occupation because the testing is gently answered. Answer it in a way that ends the testing, or plan on answering it again every winter." },
              favor: -1,
              setFlags: { finlandOccupationCost44: "harsh" },
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "vistulaOder45",
              outcome:
                "The doctrine this occupation adopts is the one that suppresses fastest and costs most to maintain: collective pressure quiets organized resistance within the winter, at the price of a garrison commitment that has to stay large indefinitely, and a northern population whose loyalty was never actually the goal, only its silence. The manpower this front is spending to hold Finland is manpower the German front doesn't get, for as long as this occupation runs.",
            },
            {
              label: "Answer narrow — garrison strategic points only, leave the countryside its own affairs",
              advisor: { name: "Vasilevsky", quote: "We cannot afford to occupy every farmhouse in this country and still finish the war against the army that actually matters. Hold what we need. Let the rest of it go on being Finland." },
              favor: 1,
              setFlags: { finlandOccupationCost44: "narrow" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "vistulaOder45",
              outcome:
                "The cheaper doctrine, and the one that concedes the most: a narrow garrison footprint costs less in manpower and produces less resistance to answer in the first place, but it is occupation in name more than in practice across most of the country's own territory — the difference between this path and the historical armistice narrows considerably, for a smaller fraction of the price this occupation was originally billed at.",
            },
          ],
          };
        },
        get vistulaOder45() {
          return {
          date: "JANUARY – FEBRUARY 1945",
          title: "Berlin in February?",
          historicalRecord: true,
          situation:
            "The Vistula–Oder offensive is the fastest, most successful Soviet operation of the entire war — a 300-mile advance in three weeks that leaves forward units on the Oder, less than 50 miles from Berlin, by early February, while German defenses are still reeling. Zhukov's own staff draft plans for an immediate continuation straight to the capital. Chuikov — the general who will personally take Berlin's ruins in April — later claimed in his memoirs the city could have fallen in February had Stavka pressed on immediately; most professional military historians treat that claim with real skepticism, citing the undefeated German forces still threatening the offensive's flanks in Pomerania and East Prussia." +
            (flags.earlyDnieper43
              ? " This staff has been here before, in a smaller way — the reserve spent skipping Kharkov's recapture back in '43 exists precisely because this command has made a habit of betting the flank is safer than the manual says."
              : "") +
            (flags.finlandOutcome === "occupation"
              ? (flags.finlandOccupationCost44 === "harsh"
                ? " The northern flank this offensive doesn't have to worry about is one still held down by a garrison this command chose to keep large — manpower that isn't here, on the Oder, because it's still occupying Finland."
                : " The narrow garrison this command settled for in Finland freed up more of the north than the harsher option would have, though not as much as simply signing the historical armistice would have.")
              : flags.finlandOutcome === "armistice"
              ? " The northern flank has been a signed, settled question since September — nothing about Finland is drawing on what this offensive has to spend."
              : ""),
          choices: [
            {
              label: "Press straight for Berlin now, while the shock of the offensive is still working",
              advisor: { name: "Chuikov", quote: "We had the momentum and the distance was nothing to what we had already crossed. I have never stopped believing we let it go for reasons that were not purely military." },
              setFlags: { vistulaOder45: "pushed" },
              impact: { manpower: -1, fuel: -1, initiative: 2 },
              next: "eastPrussia45",
              uncertain: [
                {
                  weight: flags.earlyDnieper43 ? modWeight(65, meters.manpower) : modWeight(25, meters.manpower),
                  title: "The gamble pays off",
                  impact: { manpower: -1, fuel: -1, initiative: 3 },
                  next: flags.earlyDnieper43 ? "berlinFeb45" : "eastPrussia45",
                  outcome: flags.earlyDnieper43
                    ? "The bet this command has been placing since Kharkov pays out at the largest possible stake: the continuation reaches Berlin's outskirts by late February, weeks ahead of the historical April assault, and this time there is a reserve in hand — the one this staff has been quietly husbanding since the Dnieper — to actually hold the ground taken rather than just visit it. The flank exposure Zhukov's own staff worried about doesn't develop into the war-changing counterattack it might have, and for the first time this campaign, that isn't luck."
                    : "The minority case, and a real one: the continuation reaches Berlin's outskirts by late February, briefly, weeks ahead of the historical April assault. But this command spent its reserve holding the historical line elsewhere rather than banking it for exactly this moment, and there is nothing in hand to exploit the opening before the German command reorganizes around it. The position gets visited, not held. The campaign settles into the same two-month pause Zhukov ordered anyway, only now having already paid the cost of finding out the gamble could have worked.",
                },
                {
                  weight: flags.earlyDnieper43 ? 100 - modWeight(65, meters.manpower) : 100 - modWeight(25, meters.manpower),
                  title: "The flanks catch up first",
                  impact: { manpower: -2, fuel: 0, initiative: -1 },
                  outcome:
                    "The outcome most military historians would bet on, and it vindicates the actual Stavka decision: German forces in Pomerania and East Prussia strike the exposed northern flank hard enough to force a costly pause and redeployment before Berlin can be seriously approached. The two-month pause the historical war actually took turns out, on this roll, to have been the cheaper option after all.",
                },
              ],
            },
            {
              label: "Halt on the Oder — clear Pomerania and East Prussia first, as really ordered",
              advisor: { name: "Zhukov", quote: "Chuikov sees the map in front of him. I am required to see the map behind him as well." },
              historical: true,
              setFlags: { vistulaOder45: "halted" },
              impact: { manpower: 1, fuel: 1, initiative: -1 },
              next: "eastPrussia45",
              outcome:
                "Stavka paused the main axis for nearly two months to eliminate the flank threats in Pomerania and East Prussia before resuming toward Berlin in April. Whether this cost the war a faster ending or prevented a disaster remains debated — Chuikov argued one way in his postwar memoirs, most professional assessments the other — but it is what Zhukov, with the fullest picture available to any single commander, actually chose.",
            },
          ],
        };
        },
        get berlinFeb45() {
          return {
          date: "MARCH 1945",
          title: "Berlin, Early",
          historicalRecord: false,
          speculative: true,
          situation:
            "Marked plainly: no version of the real war reached this page. Soviet spearheads stand in Berlin's northern and eastern suburbs three weeks after the historical continuation was called off, with the reserve that would have screened this exact exposure spent, in this timeline, a season earlier at Kharkov instead of at Rostov and Pomerania where history actually spent it. The garrison facing them is the same patchwork of Volkssturm, exhausted line divisions, and SS remnants the historical April battle actually fought through — just caught before the Seelow Heights could be dug in three defensive belts deep, and before Heinrici could be brought in to organize them. Zhukov's own staff, in the historical record, thought the city might have fallen this way. Nobody on this staff has fought a Berlin without Seelow to test that belief against.",
          choices: [
            {
              label: "Push into the city immediately — deny the garrison time to organize the block-by-block defense the historical assault actually faced",
              advisor: { name: "Chuikov", quote: "Every week we give this garrison is a week it spends turning cellars into strongpoints. I have fought that arithmetic once already in this war, at Stalingrad, from the other side of it." },
              checkLabel: "Manpower",
              disabledReason: meters.manpower <= -4 ? "not enough strength left in the spearhead to take the city by immediate assault rather than a properly closed siege" : undefined,
              setFlags: { berlinFeb45: "immediate" },
              impact: { manpower: -3, fuel: -1, initiative: 1 },
              next: "END",
              outcome:
                "The costliest and fastest version of a battle that, in the actual war, took three more weeks and immeasurably more shelling to finish. Street fighting against a garrison that hasn't finished digging in is still street fighting — the casualty rate this path pays is closer to Stalingrad's than to a walkover — but the city changes hands in days rather than the historical fortnight-plus, and a regime that in the real war held out in the ruins until May 2nd has nothing left to hold out in.",
            },
            {
              label: "Pause three days to bring the follow-up armies level — close the ring properly before committing to the streets",
              advisor: { name: "Zhukov", quote: "Three days is not April. I have already spent this war learning what a city costs when it is entered before it is surrounded. I am not paying that lesson twice." },
              historical: false,
              setFlags: { berlinFeb45: "consolidate" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "END",
              outcome:
                "The disciplined version of the same gamble: three days is enough for the follow-up armies to close the ring fully and for the garrison commander to see the position is hopeless before the first street is contested. It is not the historical caution — nothing about a Berlin already reached in March is historical — but it is the same instinct Zhukov's real war ran on. The city surrenders inside a week, without the block-by-block cost the immediate assault pays and without the three additional months of war the historical pace also didn't need to pay.",
            },
          ],
        };
        },
        get maskingForceQuestion45() {
          return {
          date: "FEBRUARY 1945",
          title: "The Watchers at the Gate",
          historicalRecord: false,
          situation:
            "A sealed East Prussia needs a masking force to stay sealed — enough strength to keep several hundred thousand German troops from breaking out toward a front that can't spare the attention, but not so much that it starves the Berlin axis of what the containment strategy was supposed to free up in the first place. Getting that balance wrong in either direction quietly undoes the whole point of not storming the fortress.",
          choices: [
            {
              label: "Mask it lean — minimum force to hold the seal, everything else goes to Berlin",
              advisor: { name: "Rokossovsky", quote: "A garrison that cannot attack does not need an army watching it. It needs a fence and patience. Send the rest west." },
              historical: false,
              setFlags: { maskingForceQuestion45: "lean" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "berlinRace45",
              outcome:
                "The full logic of containment, followed all the way through: the masking force is kept truly minimal, and the strength the historical storm spent stays available for Berlin almost in full. The risk this accepts is real — a lean seal is a seal that could, in principle, be tested — but a garrison this cut off, this low on fuel, was never actually likely to test it, and the front bets accordingly.",
            },
            {
              label: "Mask it heavy — a real containment force, insurance against a fortress with nothing left to lose",
              advisor: { name: "Vasilevsky", quote: "A trapped garrison with artillery and nothing left to lose is not a bookkeeping entry. I would rather over-insure a fortress than explain a breakout to Moscow." },
              setFlags: { maskingForceQuestion45: "heavy" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "berlinRace45",
              outcome:
                "The cautious reading of the same decision: a substantial containment force stays behind, insurance against a fortress that — however unlikely to break out — still has artillery and hundreds of thousands of men with nothing left to lose. It costs the Berlin operation real strength the lean version would have kept, spent on a risk that, this campaign admits plainly, was probably always smaller than the insurance premium paid against it.",
            },
          ],
          };
        },

        get berlinRace45() {
          return {
          date: "APRIL 1945",
          title: "The Race for Berlin",
          historicalRecord: true,
          situation:
            "Western Allied forces have crossed the Rhine and could, by most staff estimates, reach Berlin before Soviet forces if ordered to try — Eisenhower has instead directed the main American thrust toward Leipzig and Dresden, judging the political prize not worth the military cost against a city already assigned to the Soviet occupation zone at Yalta. That judgment is not yours to rely on. Zhukov and Konev's fronts stand on the Oder, sixty kilometers out, and the only question left in this war is how the final assault is fought.",
          choices: [
            {
              label: "A single concentrated thrust under one commander — minimize the political cost of a divided assault",
              advisor: { name: "Stalin", quote: "Two marshals racing each other into the same city is not strategy. Choose the axis, choose the commander, and let the rivalry stay in the reports rather than the streets." },
              setFlags: { berlin45soviet: "concentrated" },
              impact: { manpower: 1, fuel: 0, initiative: 0 },
              next: "berlinAssault45",
              outcome:
                "A plausible projection of the more disciplined option: a single, coordinated axis of advance reduces the friendly-fire and coordination failures that a genuine two-front race invites, at some cost in the speed the historical rivalry between Zhukov and Konev in truth produced. Berlin still falls within days either way — the difference here is measured in the assault's cost, not its outcome.",
            },
            {
              label: "Let both fronts race for the city — Zhukov from the east, Konev from the south",
              advisor: { name: "Zhukov", quote: "Let Konev try to beat me to it. An army that knows it is being watched by a rival moves faster than one that thinks the outcome is already decided." },
              historical: true,
              setFlags: { berlin45soviet: "race" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "berlinAssault45",
              uncertain: [
                {
                  weight: 70,
                  title: "The rivalry stays in the reports",
                  impact: { manpower: -1, fuel: 0, initiative: 1 },
                  next: "berlinAssault45",
                  outcome:
                    "Stalin deliberately left the army-group boundary near Berlin ambiguous, and the resulting rivalry between Zhukov and Konev drove both fronts forward at a pace a single coordinated command likely would not have matched — at a real cost in coordination and in the friendly-fire incidents that a converging, competing double envelopment of a single city invited. Berlin fell in twelve days of the costliest urban combat of the European war, ahead of the more cautious schedule the single-axis option would have kept.",
                },
                {
                  weight: 30,
                  title: "The rivalry reaches the streets",
                  impact: { manpower: -2, fuel: 0, initiative: 0 },
                  next: "berlinRivalryIncident45",
                  outcome:
                    "The same ambiguous boundary, the same two marshals, and this time the genuine risk such an arrangement always carried is realized rather than merely run: converging Soviet formations, each racing to be first into the city, exchange fire on each other in the smoke and confusion of the final days. It is not a hypothetical this campaign is inventing — such incidents were a real and recorded hazard of exactly this kind of deliberately ambiguous double envelopment; this path is simply where the dice landed on it happening badly rather than merely being risked.",
                },
              ],
            },
          ],
        };
        },
      };

      return nodes[id];
    },
    historicity(flags) {
      const HIST = {
        border41: "hold",
        kiev41: "hold",
        evacIndustry: "full",
        leningrad41: "hold",
        moscowPanic: "stay",
        moscow41: "counteroffensive",
        lendLease: "arctic",
        order227: "enforce",
        autumnWeight: "center",
        stalingradStreets: "hug",
        pursuit43: "rostov",
        partisans43: "railWar",
        axis43: "dnieper",
        eastPrussia45: "storm",
        berlinAssault: "seelow",
        rzhev42: "mars",
        uranus42: "deep",
        kharkov43: "press",
        kursk43soviet: "defense",
        dnieper43: "forced",
        bagration44soviet: "full",
        warsaw44: "halt",
        balkans44soviet: "limited",
        vistulaOder45: "halted",
        berlin45soviet: "race",
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
      // Speculative branch endings state their date outright rather than deriving it from the
      // time meter — reaching Berlin in February and taking it in March is a fixed calendar
      // outcome of that branch, not something the aggregate meter should be allowed to reprice.
      if (flags.berlinFeb45)
        return { stamp: "MARCH 1945 (SPECULATIVE)", prose: "March 1945", exact: false };
      if (flags.berlinEnveloped45)
        return { stamp: "APRIL 1945 (SPECULATIVE)", prose: "April 1945", exact: false };
      if (flags.purged) {
        const dateByNode = {
          border41: "JULY 1941",
          smolensk41: "SEPTEMBER 1941",
          leningrad41: "OCTOBER 1941",
          specialSection41: "DECEMBER 1941",
          order227_42: "AUGUST 1942",
          suspicionCeiling: "1942",
        };
        const d = dateByNode[flags.purgedAt] || "1941";
        return { stamp: d + " (RECALLED)", prose: d, exact: false };
      }
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
      // First match wins, so this chain runs rarest-condition-first: a run's title should name the
      // most distinctive thing about it, not whichever flag happens to sit highest in the list.
      // The order here was measured against simulated playthroughs. Leading with the broad flags
      // (autumnWeight, axis43, eastPrussia45, berlinAssault — each matching roughly half of all
      // runs) made every more specific title below them unreachable in practice.
      if (flags.purged) return "Recalled to Moscow";
      // Historical Divergence Mode: only reachable when the kievPush fork fired (no historical
      // Kiev diversion, so Army Group Center pressed straight for Moscow) AND the government
      // evacuated at moscowPanic41 anyway. Placed high — this specific combination is rarer than
      // anything else in this chain.
      if (flags.forkKievPush && flags.moscowPanic === "left") return "The Capital That Evacuated Anyway";
      // Round 20: forkRzhevThin doesn't change what Mars costs — the choice's own outcome text
      // stays the historical failure regardless of the fork, deliberately, since nothing about
      // the garrison being thinner was ever acted on by Stavka's own planning. The ending marks
      // the irony rather than a different result.
      if (flags.forkRzhevThin && flags.rzhev42 === "mars") return "The Weakness Nobody Exploited";
      // Round 20: forkDeceptionSeen, same principle — Army Group Center is still destroyed on
      // the historical schedule; the fork only adds a detail (a German reconnaissance thread
      // that never got acted on in time) that makes the historical surprise look narrower in
      // hindsight than it felt to Stavka's own planners at the time.
      if (flags.forkDeceptionSeen && flags.bagration44soviet === "full") return "The Warning That Went Nowhere";
      // Extreme meter states outrank the flag chain below. An army that finished essentially
      // intact, or one that stopped existing as an army, is the defining fact of a run — a
      // bigger truth about it than any single mid-war decision. Only the extremes qualify;
      // the moderate meter tiers stay at the bottom as last-resort fallbacks, because
      // "priced about the same" is by definition the least distinctive thing a run can be.
      if ((meters.manpower || 0) >= 8) return "The Army That Should Not Have Survived This";
      if (flags.quietSector43 === "useful") return "The Quiet Contribution";
      if (flags.quietSector43 === "byBook") return "The Officer Nobody Remembers";
      if (flags.berlinFeb45 === "immediate") return "Berlin, Taken Early — At Stalingrad's Price";
      if (flags.berlinFeb45 === "consolidate") return "The City That Surrendered to the Ring";
      if (flags.berlinEnveloped45) return "The Heights That Held an Empty Front";
      if (flags.warsawRelieved && flags.forwardSupply44) return "The City Saved by a Fortnight in June";
      if (flags.warsawHaltUnexcused) return "The Halt That Needed No Excuse";
      if (flags.athensStandoff44 === "hold") return "A Flag Over Athens, Kept";
      if (flags.athensStandoff44 === "withdraw") return "A Flag Over Athens, Lowered";
      if (flags.polishQuestion45 === "standApart") return "A Second Polish Army";
      if (flags.polishQuestion45 === "absorb") return "One Army, One Command";
      if (flags.warsawRelieved) return "The City Half-Saved";
      if (flags.southernVacuum43 === "pour") return "Ukraine, Taken on Momentum";
      if (flags.southernVacuum43 === "methodical") return "The Vacuum, Filled Slowly";
      if (flags.berlinRivalryIncident45 === "honest") return "Fire in the Smoke, Named";
      if (flags.athensRace44 === "halt") return "The Road Not Taken to Athens";
      if (flags.easternWallBreach43 === "artillery") return "The Wall Paid For in Shells";
      if (flags.easternWallBreach43 === "probe") return "The Seam in the Wall";
      if (flags.earlyDnieper43) return "The Salient Never Offered";
      if (flags.forwardSupply44) return "The Offensive That Stopped Where It Was Told";
      if (flags.escapedRemnants43 === "hunt") return "The Ring, Closed After the Fact";
      if (flags.escapedRemnants43 === "letGo") return "What the Steppe Kept";
      if (flags.industrialShortfall42 === "spread") return "Thin Across Every Front";
      if (flags.industrialShortfall42 === "concentrate") return "Fewer Divisions, Fully Armed";
      if (flags.preemptResult43 === "press") return "The Half-Success, Spent";
      if (flags.preemptResult43 === "fallback") return "The Strike, Banked and Left";
      if (flags.maskingForceQuestion45 === "lean") return "The Lean Seal";
      if (flags.maskingForceQuestion45 === "heavy") return "The Insurance Premium";
      if (flags.autumnWeight === "south") return "The Reserve That Never Bled at Rzhev";
      if (flags.axis43 === "west") return "Berlin by the Longer Road";
      // "The Fortress Left to Starve" (eastPrussia45==="sealed") sat here and never fired: sampled
      // across 20,000 runs, all 9,896 that reached the East Prussia siege sealed were ALSO already
      // caught by one of the twenty-odd flags above (varied ones — no single blocker, just a chain
      // deep enough that something earlier had matched by the time a run got this far). The choice
      // still gets a callback in the epilogue's thread notes below; it just can't win the title.
      // Deleted here, along with its ENDINGS_GALLERY entry.
      if (flags.berlinAssault === "methodical") return "Chuikov's Patience";
      if (flags.berlinAssault === "seelow") return "The Searchlights at Seelow";
      const h = this.historicity(flags);
      const total = (meters.manpower || 0) + (meters.fuel || 0) + (meters.initiative || 0);
      // The intermediate meter tiers that used to sit here were removed deliberately: they could
      // only fire when NO flag above matched, and by this point in a campaign a flag always has.
      // They were dead strings that looked like content. The meter reality is carried in the
      // epilogue's cost clause instead, where it belongs — a run's TITLE should name a decision.
      // "The War History Already Wrote" (the h.ratio-based tier that used to sit here) turned out
      // to be exactly that same dead-string pattern recurring: berlinAssault above is set on
      // essentially every run that reaches this point, so nothing below it was ever live. Deleted,
      // along with its ENDINGS_GALLERY entry. The unconditional default below stays — it's the
      // required fallback for the rare purge/early-exit runs that never reach berlinAssault at all.
      return "Victory, Priced About the Same";
    },
    epilogue(flags, meters) {
      if (flags.purged) {
        return (
          "This campaign ends here, and not on the battlefield. Under NKVD Mode, suspicion tracked every choice that read as independence rather than obedience — and it has run out. The political apparatus, not the enemy, has judged this command a problem the front didn't have. " +
          "What happens next covers a wider range than the usual telling admits. Most officers recalled under circumstances like these in 1941 were shot or sent to the camps, often within weeks and without a trial worth the name. A minority — Rokossovsky is the documented case, arrested in 1937 and released in 1940 once the war made his competence too valuable to waste — were eventually reinstated, sometimes years later, sometimes at the front they'd been pulled from. Which of the two this recall turns out to be is not knowable from inside it, and the odds do not favor the second. " +
          "The war continues without you. It was never yours to finish."
        );
      }
      const total = (meters.manpower || 0) + (meters.fuel || 0) + (meters.initiative || 0);
      const end = this.projectedEnd(flags, meters);
      const h = this.historicity(flags);

      let dateClause;
      if (end.exact) {
        dateClause =
          "Berlin falls in late April 1945, and Germany surrenders unconditionally on May 8 — essentially the historical timeline.";
      } else if ((meters.initiative || 0) >= 2) {
        dateClause = `Victory in Europe arrives around ${end.prose} — earlier than the historical May 1945, bought with a faster, costlier advance.`;
      } else if ((meters.initiative || 0) <= -2) {
        dateClause = `Victory in Europe arrives around ${end.prose} — later than the historical May 1945, the price of choices that spent time to save men.`;
      } else {
        dateClause = `Victory in Europe arrives close to the historical schedule, around ${end.prose}.`;
      }

      let costClause;
      if ((meters.manpower || 0) >= 3) {
        costClause =
          " The army that reaches Berlin is larger and more intact than the historical one — a war fought with unusual discipline about when territory was worth an army, and when it wasn't.";
      } else if ((meters.manpower || 0) <= -3) {
        costClause =
          " The army that reaches Berlin has paid for the ground twice over — a war fought closer to the historical pattern of holding rigid lines regardless of the arithmetic, at the cost this campaign keeps returning to.";
      } else {
        costClause =
          " The human cost of this path lands close to the historical one — among the highest of any combatant nation in the war by a wide margin, roughly 27 million dead, military and civilian combined.";
      }

      const notes = [];
      const add = (w, t) => notes.push({ w, t });
      if (flags.specialSection41 === "protect" && (meters.manpower || 0) >= 2)
        add(6, "The commander protected in 1941 was never billed for it directly — and stayed in the field long enough that his division's later record reads like the case for having protected him: the itemized bill this campaign promised never quite arrives, though whether that's mercy or simply an apparatus with other priorities by then is not a question with an answer here.");
      if (flags.specialSection41 === "protect")
        add(7, "The Special Section's denunciation was refused on the record — the commander whose retreat saved his division kept it, the assessment told the truth, and your own file acquired a page whose bill was never itemized.");
      if (flags.specialSection41 === "comply")
        add(7, "The Special Section got its signature — a good commander traded for a thinner file, and a front that learned political reliability outranks eleven kilometers of survivable retreat.");
      if (flags.autumnWeight === "south")
        add(7, "The autumn 1942 reserve was weighted entirely south — Mars never launched, the Rzhev grinder's cost declined, and the single-theater concentration tested against the pinning argument Mars's defenders always made.");
      if (flags.axis43 === "west")
        add(7, "The post-Kursk pursuit weighted the western axis toward Smolensk and the shortest road to Germany — the school history kept secondary, given the reserves it never had, against the terrain that was always the counter-argument.");
      if (flags.evacIndustry === "partial")
        add(8, "The industrial evacuation was subordinated to front supply in 1941 — easing that autumn's crisis at a cost in Urals production capacity that every later year of this campaign quietly pays for.");
      if (flags.moscowPanic === "left")
        add(7, "Stalin's train left Moscow in the October panic — the single most effective symbolic act of the historical Soviet war, not performed on this path, with a deeper and longer panic as the price.");
      if (flags.order227 === "discretion")
        add(7, "Order No. 227 was transmitted but its blocking detachments and penal machinery left to commanders' discretion — the argument some front commanders quietly practiced, made policy here.");
      if (flags.pursuit43 === "rostov" && (meters.initiative || 0) >= 1)
        add(8, "The drive on Rostov closed the door on Army Group A — the encirclement history reached for and missed, landed on this path at the favorable edge of what the winter logistics allowed.");
      if (flags.earlyDnieper43)
        add(8, "The reserve banked since Stalingrad was spent skipping Kharkov's recapture entirely rather than refighting it — a front committed further west a season before its logistics were built to support it, and Manstein's last great counterstroke handed nothing to work with.");
      if (flags.berlinEnveloped45)
        add(9, "Seelow was never fought. The last prepared defensive line of the war held its position perfectly while the city behind it was encircled from two directions by an army with enough left in the ranks to go around rather than through.");
      if (flags.berlinFeb45)
        add(9, "Berlin was reached in February and taken by March — six weeks ahead of the historical fall, on the strength of a reserve this campaign spent two years earlier making sure it would still have.");
      if (flags.warsawRelieved && flags.forwardSupply44)
        add(9, "Warsaw was reached — and the thing that reached it was a fortnight of supply dumping done in June, before Bagration launched, by a command that had banked enough to spend it. The uprising's fighters were relieved rather than commemorated.");
      if (flags.warsawHaltUnexcused)
        add(9, "The Vistula halt was ordered by a front that had fuel in its tanks and supply forward — the one version of that decision no logistics assessment can account for, and the one this campaign leaves standing on its own.");
      if (flags.forwardSupply44 && !flags.warsawRelieved && !flags.warsawHaltUnexcused)
        add(7, "Bagration launched a fortnight late with its supply echelons already forward — the offensive that, alone among this war's great advances, stopped where it was told to rather than where its trucks gave out.");
      if (flags.stalingradStreets === "conventional")
        add(6, "Stalingrad was defended conventionally rather than by Chuikov's hugging doctrine — proper lines at proper distances, against the air force those distances were built to feed.");
      if (flags.eastPrussia45 === "sealed")
        add(6, "Königsberg was sealed and screened rather than stormed — the containment argument taken, and the East Prussian operation's enormous historical cost declined.");
      if (flags.berlinAssault === "methodical")
        add(6, "The Seelow Heights were suppressed before they were assaulted — Zhukov's infamous searchlight night declined in favor of Chuikov's patience, at the price of a day in the race with Koniev.");
      if (flags.partisans43 === "intelligence")
        add(5, "The partisan movement was kept dark — intelligence over the Rail War's visible sabotage, and the reprisal cycle that sabotage fed ran measurably cooler.");
      if (flags.rzhev42 === "holding")
        add(8, "Operation Mars was scaled back rather than launched at full strength — sparing the Rzhev grinder's historical cost, a battle Soviet archives themselves stayed quiet about for fifty years.");
      if (flags.vistulaOder45 === "pushed")
        add(8, "The push straight for Berlin in February was actually attempted here — testing Chuikov's postwar claim against the flank risk Zhukov's own staff warned about, rather than leaving the question a memoir argument.");
      if (flags.warsaw44 === "relieve")
        add(8, "The Vistula was crossed to relieve the Warsaw Uprising rather than held at — the option history's Stavka did not take, run here against the fresh SS armor that was actually waiting at the city's approaches.");
      if (flags.leningrad41 === "evacuate")
        add(7, "An early, aggressive evacuation across Lake Ladoga was prioritized over holding the city rigidly — no version of the siege escapes its catastrophe, but this path distributes it differently.");
      if (flags.kiev41 === "withdraw")
        add(7, "The Kiev withdrawal — the option Zhukov was fired for proposing in the real war — is this campaign's clearest 'if only,' and it was taken.");
      if (flags.kharkov43 === "halt")
        add(6, "The pursuit after Stalingrad was deliberately halted before Manstein's backhand blow could land — the lesson Stavka only fully learned from the real Third Kharkov, applied here a season early.");
      if (flags.dnieper43 === "prepared")
        add(6, "The Dnieper crossing was slowed for proper bridging rather than forced by raft and fuel drum — fewer of the war's highest-casualty Hero of the Soviet Union citations, and a later liberation of Kiev.");
      if (flags.balkans44soviet === "deep")
        add(6, "The Balkan advance was pressed deep rather than limited — shaping the postwar political map further west than the historical, more measured campaign did.");
      if (flags.moscow41 === "defend")
        add(6, "Holding the Siberian reserve rather than spending it in December 1941 preserved a fresh force for 1942, at the cost of the historical counteroffensive's dramatic reversal.");
      if (flags.uranus42 === "shallow")
        add(5, "The shallower envelopment at Stalingrad let more of Sixth Army escape the ring than the historical trap allowed.");
      if (flags.kursk43soviet === "preempt")
        add(5, "Striking first at Kursk traded a prepared defensive advantage for surprise — a road Soviet planners considered and rejected for good reason.");
      if (flags.berlin45soviet === "concentrated")
        add(4, "A single concentrated thrust on Berlin avoided the coordination costs the historical Zhukov–Konev rivalry accepted in exchange for speed.");
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
          "Germany's defeat was not a variable Soviet command decisions controlled, only its timing and its price.",
          "No branch of this campaign reaches a different destination — only the timing and the price were ever in Soviet hands.",
          "Berlin's fall was a certainty from the day the front stopped moving west; everything this campaign tracked was the cost of the miles back.",
        ][Math.abs((flags.suspicion || 0) + (meters.initiative || 0) + (meters.manpower || 0)) % 3]
      );
    },
    // Second stage of the multi-stage ending — broad context roughly a year past the date named
    // in epilogue(). Individual fates belong to the "where they ended up" stage, drawn from
    // ADVISOR_DOSSIERS.fate for the officers this command actually leaned on.
    oneYearLater(flags, meters) {
      if (flags.purged) {
        return "The war this command was pulled from ends in Berlin regardless, under whoever answered for it after. A year past the recall, the file this campaign opened with — reinstated at the front, or never reinstated at all — has almost certainly already resolved one way or the other; the war itself did not wait to find out which.";
      }
      const end = this.projectedEnd(flags, meters);
      const timing =
        (meters.initiative || 0) >= 2
          ? "Victory arrived ahead of the historical May 1945, which means the occupation of eastern and central Europe has had that much longer to harden by the time this account picks back up a year later."
          : (meters.initiative || 0) <= -2
          ? "Victory arrived behind the historical May 1945, which means Soviet forces are still consolidating a front the historical record had a year's head start settling by this point."
          : "Victory arrived close to the historical May 8, 1945, and the year that follows tracks the historical one closely: the Red Army's occupation zone, the machinery of a new political order installed behind it, and a wartime alliance already audibly disagreeing about what Europe's map is supposed to mean now that the shooting has stopped.";
      return `${timing} Within the year, the governments this front's advance put in place across Eastern Europe are consolidating along lines this campaign's own choices shaped only at the margins — the deeper political outcome was set well before any of this command's decisions, by where the armies actually stood when Germany surrendered. What Stavka spent this whole campaign managing was never whether that map got drawn. It was how many of the men who drew it lived to see it.`;
    },
  },

