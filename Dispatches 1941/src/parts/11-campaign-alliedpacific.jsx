  alliedPacific: {
    id: "alliedPacific",
    seal: "CINCPAC",
    name: "Allied Pacific Command",
    dates: "Beginning 1941",
    brief: "Direct the Allied war against Japan from the embargo decision to the surrender.",
    teaser: "One war, four allies, and no agreement on how to win it.",
    accent: "#28497a",
    dynamic: true,
    intro: "July 1941. Japan has occupied southern Indochina, and how strictly Washington enforces the freeze on Japanese assets is still an open question.",
    start: "americanEmbargoResponse41",
    resolveNode(id, flags, meters) {
      return {
        get americanEmbargoResponse41() {
          return {
          date: "JULY 1941",
          title: "The Embargo Decision",
          historicalRecord: true,
          situation:
            "Japan's occupation of southern Indochina is complete, and Roosevelt has signed an order freezing Japanese assets in the United States, a step meant to signal serious displeasure without necessarily foreclosing every avenue of trade. Britain and the Dutch East Indies government have moved in step, freezing Japanese assets of their own on the assumption that Washington's order will hold as a real, coordinated front. The order itself doesn't specify exactly how strictly the resulting licensing system should be enforced, and in the weeks that follow, whether Japan can still buy any oil at all is effectively decided administratively: State and Treasury officials interpret the freeze more strictly than some in the administration privately expected, and the licenses that would let limited oil shipments continue simply stop being issued. What began as calculated pressure is quietly becoming a total embargo without anyone in the Cabinet having explicitly voted for one.",
          choices: [
            {
              label: "Let the strict interpretation stand: a de facto total oil embargo",
              advisor: { name: "Acheson", position: "The Treasury's order contains no ambiguity that requires licenses to be issued, and if the President wants oil flowing to Japan he can say so directly." },
              historical: true,
              setFlags: { embargoPath: "total", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: 0, pipeline: 1, initiative: 1 },
              next: "wakeIslandRelief41",
              outcome:
                "The freeze becomes, in practice if not in explicit policy, a complete embargo. Japan's oil reserves start their real countdown from this administrative decision as much as from any formal declaration, and the eighteen-month clock the fleet in Tokyo is already running against starts here. Roosevelt reportedly wanted to preserve some flexibility in the freeze; the bureaucracy that implemented it read the order more literally, and by the time anyone senior enough to calibrate it notices, the embargo has already hardened into policy by default.",
            },
            {
              label: "Intervene to calibrate the embargo: issue licenses permitting limited oil shipments",
              advisor: { name: "Grew", position: "Japan's mood has shifted for a decade under the ambassador's eye, and a total cutoff does not make Japan back down but makes the faction that already wants war impossible to argue against." },
              setFlags: { embargoPath: "calibrated", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: 1, pipeline: -1, initiative: -1 },
              next: "wakeIslandRelief41",
              uncertain: [
                {
                  weight: modWeight(30, meters.initiative),
                  title: "Grew's warning holds: the war faction loses its strongest argument",
                  setFlags: { embargoResult: "avoided" },
                  impact: { readiness: 1, pipeline: 0, initiative: 0 },
                  next: "aStandoffInsteadOfAWar41",
                  outcome:
                    "The rarer, more speculative branch: a calibrated embargo denies Tokyo's war faction the deadline argument that historically carried the room, and the collision Grew's cables warned about doesn't arrive on the historical schedule. Whether it's avoided or merely delayed is a question that doesn't get answered here.",
                },
                {
                  weight: (() => { const w = modWeight(30, meters.initiative); return Math.max(5, 100 - w); })(),
                  title: "The path to war holds regardless",
                  setFlags: { embargoResult: "insufficient" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome: a calibrated embargo buys Grew's argument a genuine hearing in Washington, but doesn't reach whatever's decided in Tokyo. The same collision happens on nearly the same calendar regardless, negotiating leverage preserved but never spent on anything that changes the outcome.",
                },
              ],
              outcome:
                "An honest projection of the warning Ambassador Grew's actual cables to Washington made repeatedly through 1941: that an embargo severe enough to threaten Japan's oil supply outright would strengthen the war faction's argument that negotiation had failed and only force remained, rather than restraining Japan's expansion as intended. A calibrated embargo preserves more negotiating leverage and denies Tokyo's militarists their strongest deadline argument, at the cost of leaving Japan's war-making capacity less constrained than the historical total embargo did.",
            },
            {
              label: "Make the total embargo an explicit, publicly announced presidential decision rather than an administrative drift",
              advisor: { name: "Roosevelt", position: "If the government is going to embargo Japan's oil, it should be the President's decision, made in public, and not a filing-cabinet judgment nobody signed." },
              setFlags: { embargoPath: "explicit", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: 0, pipeline: 1, initiative: 2 },
              next: "wakeIslandRelief41",
              outcome:
                "The same practical embargo the strict administrative reading produced, but arrived at deliberately rather than discovered after the fact. Historically, the ambiguity itself did real work: it let Roosevelt maintain plausible distance from a decision his own bureaucracy effectively made for him. Removing that ambiguity removes the deniability too, an explicit presidential embargo is a harder policy to walk back quietly if the diplomatic situation changes, and a clearer signal to Tokyo that this was considered policy, not bureaucratic accident.",
            },
          ],
        };
        },
        get aStandoffInsteadOfAWar41() {
          return dataNode(ALLIED_PACIFIC_DATA, "aStandoffInsteadOfAWar41", meters);
        },
        get theSlowerDeclaration42() {
          return dataNode(ALLIED_PACIFIC_DATA, "theSlowerDeclaration42", meters);
        },
        get warBeginsLate42() {
          return dataNode(ALLIED_PACIFIC_DATA, "warBeginsLate42", meters);
        },
        get theUnopposedConsolidation42() {
          return {
          date: "LATE 1942",
          title: "A Resource Area With Nobody Contesting It",
          historicalRecord: false,
          speculative: true,
          situation:
            "Speculative. Japan's resource area has had about a year of unopposed administration: no raiding, no submarine interdiction worth the name and no Doolittle-style shock, only the ordinary business of running occupied territory with nobody contesting the sea lanes. The Two-Ocean Navy Act's eighteen fleet carriers and seven battleships are still being built on a schedule that this occupation cannot interrupt. What the year has bought in Java's oil fields and Malaya's rubber plantations is open.",
          choices: [
            {
              label: "Spend the year on defense: fortify the perimeter, harden the approaches, assume whatever American force eventually arrives will come looking for a fight",
              advisor: { name: "Terauchi", position: "A year with nobody testing the perimeter is for making certain nothing already held is easy to retake, not for guessing at what more could be taken." },
              setFlags: { consolidationPath: "fortify" },
              impact: { readiness: 2, pipeline: 1, initiative: -1 },
              next: "twoForcesNeitherTested43",
              outcome:
                "Speculative. Coastal defenses, garrisons and airbases across the resource area's perimeter are built to a standard the real occupation, always managing active threats elsewhere, never had an uninterrupted year to complete. Whether fortification this thorough matters against a force not yet specified is deferred.",
            },
            {
              label: "Spend the year expanding: push the perimeter further out while nothing is actively contesting it, on the theory that unopposed time is a resource that stops being available the moment a war actually starts",
              advisor: { name: "Sugiyama", position: "Every extra mile of perimeter taken now uncontested is a mile the eventual American advance must cross later under fire, so the year should be spent taking ground and not sitting on what is held." },
              setFlags: { consolidationPath: "expand" },
              impact: { readiness: -1, pipeline: -2, initiative: 2 },
              disabledReason: meters.pipeline <= -4 ? "There isn't fuel to garrison a wider perimeter on top of what's already held. Expansion needs a margin this pipeline level doesn't have." : undefined,
              gateCheck: { meter: "pipeline", threshold: -4, label: "Pipeline" },
              next: "twoForcesNeitherTested43",
              outcome:
                "Speculative. A bet that unopposed time is an asset best spent: further outposts, a wider perimeter and more territory nominally held, at the cost of the fuel and readiness that a defensive year would have kept in reserve. Whether a wider perimeter is worth more than a harder one has no precedent to settle it.",
            },
          ],
        };
        },
        get twoForcesNeitherTested43() {
          return {
          date: "1943",
          title: "Two Forces, Neither Tested",
          historicalRecord: false,
          speculative: true,
          situation:
            "Speculative. What finally arrives to contest the resource area is a match neither side has fought before. The Two-Ocean Navy Act's ships exist on schedule, roughly where the real 1943 Pacific Fleet was. The crews, the doctrine and the urgency differ: a nation walked to war by hearings trains at the pace an unshocked Congress funded, not the all-hands pace Pearl Harbor produced. Across the water, a Japanese garrison has had a year to fortify or expand, depending on what this staff chose, and has as little combat experience against this opponent as the opponent has against it." +
            (flags.consolidationPath === "fortify"
              ? " What's waiting for this force is a resource area hardened rather than widened, built on the assumption that whoever eventually arrived would be arriving to fight for it."
              : flags.consolidationPath === "expand"
              ? " What's waiting for this force is a resource area wider than the one it was briefed on, expanded on the theory that unopposed time doesn't last and territory taken while it's available doesn't have to be earned twice."
              : ""),
          choices: [
            {
              label: "Commit fully: bring this slower-trained, less battle-urgent force to a decisive engagement anyway, on the theory that matériel and numbers outweigh the experience gap on both sides",
              advisor: { name: "Nimitz", position: "Neither side has faced the other before, and it is better to find out what that means with the fleet the Two-Ocean Act provided than to wait for a more urgent one that is not coming." },
              setFlags: { neitherTestedPath: "commit" },
              impact: { readiness: -3, pipeline: -1, initiative: 2 },
              uncertain: [
                {
                  weight: modWeight(35, meters.readiness),
                  title: "Matériel and numbers carry the day despite the training gap",
                  setFlags: { neitherTestedResult: "americanWin" },
                  impact: { readiness: 2, pipeline: 0, initiative: 2 },
                  outcome:
                    "Speculative. A less urgently trained force that is larger and better equipped proves that the Two-Ocean Navy Act's ships and aircraft mattered more than the slower training pace cost. The resource area's defenses, fortified or expanded, cannot offset a materially larger fleet meeting them for the first time.",
                },
                {
                  weight: (() => { const w = modWeight(35, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The training gap costs more than the matériel advantage covers",
                  setFlags: { neitherTestedResult: "costlyDraw" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "Speculative. A force trained at peacetime pace, however well equipped, meets a garrison that has spent an unopposed year preparing for exactly this, and the engagement costs far more than either side's planners expected. Neither side's inexperience resolves cleanly; both learn the hard way what Pearl Harbor taught the real Navy months or years earlier.",
                },
              ],
              next: "END",
              outcome:
                "Speculative. Whether an unshocked nation's slower mobilization produces a force that wins on matériel anyway, or loses ground because urgency, and not only equipment, did real work in the real Navy's training, has no historical case to check it against.",
            },
            {
              label: "Hold back: use this first contact to gather real intelligence on what this specific Japanese position has actually become, rather than commit blind to a decisive engagement",
              advisor: { name: "King", position: "The Navy has never fought this fleet against this position, and it should learn what it faces before it spends anything real finding out the hard way." },
              setFlags: { neitherTestedPath: "reconnoiter" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "END",
              outcome:
                "Speculative. The cautious wager: reconnaissance on a position and garrison this force has never contested, at the cost of whatever advantage a first-contact engagement might offer. What the intelligence is worth against an equally untested opponent is not answered here, because the real war never had to ask.",
            },
          ],
        };
        },
        get chinasWarAlone43() {
          return {
          date: "1943",
          title: "The War Nobody Came to Help Finish",
          historicalRecord: false,
          situation:
            "Speculative. Two years into an American war that exists only in Europe, China's war against Japan is in its sixth year, fought without the American matériel, air support and troop commitment that the real alliance provided. Chiang Kai-shek's government, still an American partner in principle, understands privately that the principle has produced no divisions and no bombers. The occupied Philippines, Malaya and the Indies stay occupied, and no outside power contests the empire that governs them. Washington has to decide how to treat the standoff.",
          choices: [
            {
              label: "Extend material support to China without a declaration of war: matériel, not divisions",
              advisor: { name: "Stilwell", position: "China has fought six years on promises, and it is better to send it what it can use than to keep sending reasons why America cannot." },
              setFlags: { chinaAloneAidPath: "materiel" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: "britainsCalculus43",
              uncertain: [
                {
                  weight: modWeight(30, meters.pipeline),
                  title: "The aid shifts the stalemate",
                  setFlags: { chinaAloneAidResult: "shifted" },
                  impact: { readiness: 0, pipeline: 0, initiative: 2 },
                  outcome:
                    "Speculative. Matériel without a declared alliance turns out to be enough. Better armed for the first time in years, Chinese forces push Japanese positions in ways the real stalemate never allowed. It is not a war won, but it begins to move after six years of not moving.",
                },
                {
                  weight: (() => { const w = modWeight(30, meters.pipeline); return Math.max(5, 100 - w); })(),
                  title: "The stalemate holds regardless",
                  setFlags: { chinaAloneAidResult: "unchanged" },
                  impact: { readiness: 0, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome. Trucks and small arms, without the air support, advisers and troops that the real alliance eventually provided, are not enough to break a stalemate six years old. The war grinds on, better supplied and no closer to moving.",
                },
              ],
              outcome:
                "Speculative. A middle position between alliance and abandonment: American aircraft, trucks and small arms reach China by the same difficult supply routes the real alliance used, without the American combat presence that came with it. It is more than China had before and far less than a declared ally would provide.",
            },
            {
              label: "Hold to strict non-engagement: no material support, no complications with the war being fought in Europe",
              advisor: { name: "Marshall", position: "Europe First was meant as a doctrine and not a slogan to drop the moment its cost becomes uncomfortable to watch." },
              setFlags: { chinaAloneAidPath: "none" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "britainsCalculus43",
              outcome:
                "Speculative. Europe First, held consistently and not abandoned under pressure: the European war gets everything, the Pacific gets nothing, and China fights as unsupported as if the real alliance had never existed.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Authorize a volunteer combat program: pilots resign their commissions and fly for China as technical mercenaries, the same legal fiction the actual Flying Tigers used",
                    advisor: { name: "Stilwell", position: "There is a precedent in the hundred pilots who resigned their commissions and flew for China as private citizens before America declared anything, and it should be used again at whatever scale the staff will authorize." },
                    setFlags: { chinaAloneAidPath: "volunteers" },
                    impact: { readiness: -2, pipeline: -2, initiative: 3 },
                    next: "britainsCalculus43",
                    outcome:
                      "The actual American Volunteer Group, a hundred pilots who resigned their US commissions to fly for China through a front company as technical mercenaries, existed specifically to let Washington provide real combat power while maintaining what the Pentagon's own history calls a facade of neutrality. In the historical record, that hundred-pilot force destroyed nearly three hundred Japanese aircraft for fourteen pilots lost, an extraordinary ratio no formally declared unit matched for the rest of the war. Authorizing the same program here, at whatever scale this staff can actually resource, is real combat power without a war declaration, the same deniable middle ground the historical government found once already.",
                  },
                ]
              : []),
          ],
        };
        },
        get britainsCalculus43() {
          return {
          date: "1943",
          title: "No Asiatic Possession Worth the Cost",
          historicalRecord: false,
          situation:
            "Speculative. With no American Pacific commitment to split the war's resources, every dollar of Lend-Lease has gone undiluted to Britain and the Soviet Union for two years, and London's assessment is blunter than it could be in the real alliance. General Wavell's staff in India has concluded that no Asian possession is worth the cost of retaking, and would rather hold India than spend a rebuilt army fighting back into Burma for a colony London has not decided it can afford to keep. Churchill is less settled. He has called the fall of Singapore the worst capitulation in British history and has said he has no intention of presiding over the liquidation of the empire. Whether that is a war aim London can supply without the American matériel and manpower that underwrote it in the real war is the question before the War Cabinet, which Washington reads about secondhand.",
          choices: [
            {
              label: "Note London's caution without comment: this is a British decision to make, not an American one to weigh in on from outside the alliance",
              advisor: { name: "Hull", position: "The United States does not have Britain as an ally in the Pacific, and has not earned a vote in how London spends an army it did not help build or supply." },
              historical: false,
              setFlags: { britainAsiaPath: "deferObserved" },
              impact: { readiness: 0, pipeline: 0, initiative: -1 },
              next: "japanUnopposed43",
              outcome:
                "Speculative. Wavell's real caution, here backed by two years of undiluted Lend-Lease, is acted on and not overcome: Burma, Malaya and Singapore stay occupied, not because of American pressure either way, since there is no American voice in the room, but because of London's own arithmetic about what an empire can afford to retake.",
            },
            {
              label: "Signal quiet support for Churchill's more aggressive position: an unopposed Japan consolidating its gains is a problem for later, worth discouraging now",
              advisor: { name: "Stimson", position: "The Pacific is not America's war to direct, but that does not make it indifferent to whether Japan finishes consolidating an empire that nobody contests while it watches." },
              setFlags: { britainAsiaPath: "encouraged" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: "japanUnopposed43",
              outcome:
                "Speculative. A quiet nudge and not a demand, with no alliance obligation behind it: informal encouragement of Churchill's more aggressive position, that the empire's restoration is worth contesting now. Whether Churchill needed the encouragement is not something the signal can show.",
            },
            ...(meters.readiness >= 6
              ? [
                  {
                    label: "Formalize it: offer a specific, binding Lend-Lease increase conditional on London actually committing to retake Burma, not just an informal preference",
                    advisor: { name: "Stimson", position: "A signal costs London nothing and commits it to nothing, and Lend-Lease conditionality has been used before to tie specific aid to specific commitments, so the real instrument should be used." },
                    setFlags: { britainAsiaPath: "conditionalCommitment" },
                    impact: { readiness: -2, pipeline: -2, initiative: 2 },
                    next: "japanUnopposed43",
                    outcome:
                      "Lend-Lease agreements carried explicit political and military commitments attached to specific aid, documented in the real wartime record as more than a one-way gift, a tool the actual Lend-Lease Administration used repeatedly to shape recipient behavior rather than just fund it. Offering London a real, countable increase specifically conditioned on retaking Burma moves this from a preference Churchill can act on or ignore with equal ease into a proposal with actual leverage attached, undiluted Lend-Lease allocation this timeline has entirely to itself, spent here on trying to buy a commitment rather than just hint at wanting one.",
                  },
                ]
              : []),
          ],
        };
        },
        get japanUnopposed43() {
          return dataNode(ALLIED_PACIFIC_DATA, "japanUnopposed43", meters);
        },
        get chinaCivilWarShadow43() {
          return {
          date: "1943",
          title: "Five Hundred Thousand Men Not Fighting Japan",
          historicalRecord: false,
          situation:
            "Speculative. Thin, secondhand intelligence from a China with no American observers suggests something at least as bad as in the real war: Chiang's government, free of the restraint an American alliance imposed, appears to be holding several hundred thousand troops in place to contain the Communist-held areas around Yan'an instead of committing them against Japan. Nothing pushes him to do otherwise: no Lend-Lease to withhold, no Stilwell to trade for access, no Dixie Mission without an American war effort to justify one. Yan'an, equally unobserved, continues building local government and popular support. There is almost nothing the United States can do about any of this from outside a war it is not fighting. Whether anything is worth attempting is the question.",
          choices: [
            {
              label: "Attempt an unofficial, non-binding channel to both Chungking and Yan'an: not aid, just contact, so China's civil war isn't decided in total American blindness",
              advisor: { name: "Davies", position: "The proposal is not to fund a civil war America has no standing to referee, but to see that the alternative to talking to Yan'an is not neutrality and leaves the field to Moscow." },
              historical: false,
              setFlags: { chinaCivilWarPath: "contact" },
              impact: { readiness: 0, pipeline: 0, initiative: 0 },
              next: "dutchExileCalculus44",
              outcome:
                "Speculative. A minimal, deniable presence and not a real policy: an informal channel that gathers information and offers no aid or leverage. It means China's civil war is not decided in complete American blindness. It is far less than the real aid relationship, however compromised, gave Washington the ability to shape.",
            },
            {
              label: "Stay entirely hands-off: this isn't America's war to referee, and any contact at all risks looking like exactly the kind of meddling the standoff was meant to avoid",
              advisor: { name: "Hull", position: "America chose not to fight this war, and that choice does not carry a side door through which it still referees who governs China at the end." },
              setFlags: { chinaCivilWarPath: "handsOff" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "dutchExileCalculus44",
              outcome:
                "Speculative. A consistent position: having chosen not to fight Japan alongside China, Washington also declines to weigh in on who China fights over afterward. China's internal conflict is settled without American knowledge, aid or influence, the most complete non-engagement this standoff has produced and the one with the least visibility.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Send an actual observer mission to Yan'an: OSS-staffed, intelligence-gathering, the real proposal rather than the watered-down version of it",
                    advisor: { name: "Davies", position: "The first proposal was never just a channel but an observer group, OSS officers included, gathering real intelligence, and the staff should authorize what was asked and not the smaller version it settled for." },
                    setFlags: { chinaCivilWarPath: "observerMission" },
                    impact: { readiness: -2, pipeline: -1, initiative: 2 },
                    next: "dutchExileCalculus44",
                    outcome:
                      "The real historical proposal, not the smaller channel this staff settled for the first time around: John Paton Davies' actual January 1944 memo called for an OSS-staffed observer group in Yan'an itself, gathering direct intelligence on Japanese positions and Communist military capability, not just an informal line of communication. Without Stilwell's existing command relationship to justify it, the mission is harder to arrange and draws real suspicion from a Nationalist government already uneasy about American attention toward Yan'an, but it's the genuine version of the proposal, real observers gathering real intelligence rather than a diplomatic gesture standing in for one.",
                  },
                ]
              : []),
          ],
        };
        },
        get dutchExileCalculus44() {
          return {
          date: "1944",
          title: "Recolonization Without the Means to Enforce It",
          historicalRecord: false,
          situation:
            "Speculative. The Netherlands East Indies government in exile, based in Australia since the fall of Java in 1942, has a gap between its aim and its means that even its closest partner cannot close: Australia has little military industry and depended on American resources to supply anyone, and those resources were never directed at a Pacific war the United States is not fighting. The government also has an unresolved argument inside its own colonial apparatus. Hubertus van Mook and other administrators who governed the Indies favor dialogue with the nationalist movement that the Japanese occupation has energized. The government in London wants full recolonization on the prewar terms and keeps the more accommodating voices in Australia on a tight rein. Neither position has the resources to retake the territory it argues over.",
          choices: [
            {
              label: "Quietly signal diplomatic sympathy for Van Mook's accommodating position, consistent with this administration's own instincts about colonial rule, even with no aid to attach to that preference",
              advisor: { name: "Hull", position: "The department has no fleet or dollar to offer the Dutch, only an opinion formed before the war that colonial arrangements built on the assumption that nothing has changed since 1940 face a hard decade whatever Washington says." },
              historical: false,
              setFlags: { dutchExilePath: "sympathyForAccommodation" },
              impact: { readiness: 0, pipeline: 0, initiative: 0 },
              next: "warWithoutAmerica45",
              outcome:
                "Speculative. A preference with nothing material behind it: Washington's documented discomfort with restored European empire, expressed without aid, fleet or leverage over a Dutch argument in which it has no standing. Whether that changes anything London decides is not something the choice can show.",
            },
            {
              label: "Stay entirely neutral on the Dutch government's internal colonial question: even less American standing here than in China's civil war",
              advisor: { name: "Marshall", position: "The Dutch government is no more an ally than Chungking is, and there is no case for an opinion on a colonial argument between London and Batavia in which America has no forces, aid or treaty obligation." },
              setFlags: { dutchExilePath: "neutral" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "warWithoutAmerica45",
              outcome:
                "Speculative. Having chosen not to fight, Washington also declines to referee an argument between a government in exile and its colonial administrators about a territory neither can retake. Van Mook's accommodating instincts and London's demand for recolonization are left to settle themselves with no American voice in the room.",
            },
            ...(meters.pipeline >= 6
              ? [
                  {
                    label: "Offer a real, material proposal: American administration of specific resource zones in exchange for guaranteed access, the same arrangement already standing in Dutch Guiana",
                    advisor: { name: "Hull", position: "Washington already administers the bauxite mines of Dutch Guiana under a 1941 agreement made to keep that resource secure, and the same arrangement should be offered for the Indies, American administration in exchange for guaranteed access." },
                    setFlags: { dutchExilePath: "materialProposal" },
                    impact: { readiness: -2, pipeline: -2, initiative: 1 },
                    next: "warWithoutAmerica45",
                    outcome:
                      "The United States and the Dutch government-in-exile signed an actual agreement in November 1941 placing Dutch Guiana's bauxite mines under American administration specifically to secure them, months before this country was formally at war with anyone. Offering London the same structure for parts of the Indies, direct American administration of specific resource zones in exchange for guaranteed access, is real material weight behind a preference, not just a preference stated aloud. Whether London accepts an arrangement that concedes real administrative control in exchange for security it currently has no other way to guarantee is a negotiation this offer starts, not one it settles by itself.",
                  },
                ]
              : []),
          ],
        };
        },
        get warWithoutAmerica45() {
          return dataNode(ALLIED_PACIFIC_DATA, "warWithoutAmerica45", meters);
        },
        get wakeIslandRelief41() {
          return {
          date: "DECEMBER 1941",
          title: "The Relief Force",
          historicalRecord: true,
          situation:
            "Wake Island's garrison, a few hundred Marines and civilian contractors, has already done what nobody expected: repelled the first Japanese invasion attempt outright, sinking two destroyers with its few guns and aircraft. A second, larger invasion force is now approaching, and Task Force 14, built around the carrier Saratoga, is at sea carrying reinforcements and supplies, still several days out. Pearl Harbor is twelve days gone, the Pacific Fleet's confidence and its actual carrier strength both still raw, and the officers now commanding it have to decide whether to press the relief force on toward an island that may already be lost by the time it arrives.",
          choices: [
            {
              label: "Recall the relief force: preserve Saratoga and her escort rather than risk them against a force already converging on the island",
              advisor: { name: "Pye", position: "The only available carrier should not be risked on a relief operation that may arrive at an island that has already fallen, after the fleet has lost enough ships this month." },
              historical: true,
              setFlags: { wakeReliefPath: "recalled" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "arcadia41",
              outcome:
                "The relief force is recalled roughly a day before it would have reached Wake, and the garrison surrenders on December 23rd after a second landing overwhelms what's left of the defense. The decision remains one of the most argued-over calls of the early Pacific war: caution that was defensible given how raw the fleet's carrier strength still was twelve days after Pearl Harbor, or a lost chance to relieve a garrison that had already, against real odds, won its first fight.",
            },
            {
              label: "Send the relief force onward: commit Saratoga to reaching Wake regardless of the risk",
              advisor: { name: "Fletcher", position: "The risk to the carrier is plain, but recalling the force costs the Marines on the island, and a lost ship is easier to explain than a relief force that turned back within a day of arriving." },
              setFlags: { wakeReliefPath: "pressed" },
              impact: { readiness: -2, pipeline: -1, initiative: 2 },
              next: "arcadia41",
              uncertain: [
                {
                  weight: modWeight(40, meters.initiative),
                  title: "The relief force reaches Wake in time",
                  setFlags: { wakeReliefResult: "reachedInTime" },
                  impact: { readiness: 1, pipeline: 0, initiative: 1 },
                  outcome:
                    "Speculative. Saratoga's air group reaches Wake ahead of the second landing, and the garrison holds. It is a costly vindication of the officers who wanted the chance. Whether the fleet's raw carrier strength was equal to the risk is answered only for this one battle.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.initiative); return Math.max(5, 100 - w); })(),
                  title: "The relief force arrives to find the garrison already fallen",
                  setFlags: { wakeReliefResult: "tooLate" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier outcome, and the one Pye's caution was built around. The second landing overwhelms Wake before Saratoga is close enough to intervene, and the relief force arrives to find nothing left to relieve.",
                },
              ],
              outcome:
                "A modeled alternative. Some of the task force's officers reportedly wanted to press on. Whether Saratoga's air group could have turned back a second, larger invasion force, or would only have risked the Pacific Fleet's only available carrier for a garrison likely to fall anyway, is still disputed by historians.",
            },
          ],
        };
        },
        get arcadia41() {
          return {
          date: "DECEMBER 1941 – JANUARY 1942",
          title: "Arcadia: Europe First, Confirmed",
          historicalRecord: true,
          situation:
            "Pearl Harbor is two weeks old and Churchill is in Washington for the Arcadia conference. America is at war, and the question is where its still-mobilizing production goes first. The standing prewar plan, ABC-1, already assumes Germany is the more dangerous enemy and commits the bulk of resources there once America enters. Admiral King, newly installed as Commander in Chief of the fleet, is making the case hard in private that a Pacific war started by a Japanese attack on American soil deserves more than a defensive holding action while Europe gets the war's main weight." +
            (flags.embargoPath === "calibrated"
              ? " Whatever room the calibrated embargo left for a different 1941 didn't survive Pearl Harbor regardless. The attack itself, not the oil policy that preceded it, is what actually settled the question of whether this war happens."
              : "") +
            (flags.wakeReliefResult === "reachedInTime"
              ? " Wake Island's garrison, reinforced in time rather than left to fall, is the one piece of good news the Pacific side of this argument actually has to point to this month, a rare data point King can cite that isn't purely theoretical."
              : flags.wakeReliefResult === "tooLate"
              ? " Wake Island fell before relief arrived, one more loss added to a Pacific ledger that, this month, has nothing but losses to show for itself, which does King's case for more resourcing there no favors at all."
              : ""),
          choices: [
            {
              label: "Affirm Europe First: the Pacific gets a defensive minimum while the main weight goes to the Atlantic",
              advisor: { name: "Marshall", position: "Germany is the only enemy able to win the war outright before America is ready to stop it, and Japan can be answered second without losing the fight to answer them at all." },
              historical: true,
              setFlags: { arcadiaPath: "europeFirst", cohesion: (flags.cohesion || 0) + 1 },
              next: "internmentQuestion42",
              outcome:
                "Roosevelt and Churchill confirm Germany as the priority enemy, and the Pacific is left to hold what it can with whatever King can pry loose from a production pipeline aimed mostly east across the Atlantic. King argues the point for the rest of the war and never quite loses it. The Pacific ends up with more than the defensive minimum promised, gained one fight at a time under a doctrine that never changed on paper.",
            },
            {
              label: "Back King's case: argue for near-parity Pacific resourcing given Japan struck first",
              advisor: { name: "King", position: "An enemy attacked America in its home waters, which is not supposed to be the argument that sets grand strategy, and it is made all the same." },
              setFlags: { arcadiaPath: "pacificParity", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: 1, pipeline: -2, initiative: 1 },
              disabledReason: meters.pipeline <= -3 ? "There isn't enough shipping margin left to make this case credibly. King can't ask for near-parity resourcing while the Pacific's own supply chain is already this thin." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "internmentQuestion42",
              outcome:
                "A modeled alternative: the argument King made and lost. Winning it means the Atlantic convoy escort and the buildup for a European invasion run thinner through 1942 and 1943 than in the real timetable, and Britain's planners, already anxious about shipping, would object hard. A faster Pacific war is bought with a slower Atlantic one.",
            },
            {
              label: "Confirm Europe First in principle, but attach a formal review trigger if Pacific losses cross a set threshold",
              advisor: { name: "Marshall", position: "The conditions under which Europe First is revisited should be written down and not left open-ended, or King will treat every bad week in the Pacific as grounds to reopen a settled argument." },
              setFlags: { arcadiaPath: "conditional", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: 0, pipeline: -1, initiative: 0 },
              next: "internmentQuestion42",
              outcome:
                "A modeled alternative: a compromise the conference never wrote down, though something like it operated in practice as King extracted Pacific resources one crisis at a time. A written trigger does not change the allocation much, since Europe still gets the weight, but a doctrine with an escape hatch is a different commitment from one King has to fight to bend each time.",
            },
          ],
        };
        },
        get internmentQuestion42() {
          return dataNode(ALLIED_PACIFIC_DATA, "internmentQuestion42", meters);
        },
        get rangoonRetreatAllied42() {
          return {
          date: "MARCH – APRIL 1942",
          title: "The Fall of Rangoon",
          historicalRecord: true,
          situation:
            "British, Indian and Burmese forces in Burma, soon to be reorganized as Slim's Burma Corps, and the divisions of the Chinese Expeditionary Force that Chiang sent across the border, after months of British hesitation, to defend the road that supplies his government, are being outpaced by Iida's advance on Rangoon. The question is not whether Rangoon holds, because British planning has already concluded that it cannot. It is what happens to the armies still trying to defend it." +
            (flags.arcadiaPath === "pacificParity"
              ? " Whatever Washington decided at Arcadia about Pacific resourcing, it hasn't reached Burma yet. This theater runs on British and Indian divisions King's argument was never going to reallocate regardless of how it came out."
              : ""),
          choices: [
            {
              label: "Order a fighting retreat toward the Indian border: preserve the army over the city",
              advisor: { name: "Slim", position: "An army that survives a defeat can fight the next battle and one spent holding a city already judged indefensible cannot, so the army goes north." },
              historical: true,
              setFlags: { rangoonAlliedPath: "retreat", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: 1, pipeline: -2, initiative: -2 },
              next: flags.arcadiaPath === "pacificParity" ? "pacificFirstGamble42" : "curtinsTurn42",
              outcome:
                "Burma Corps makes the longest retreat in British military history, nearly a thousand miles to the Indian frontier, fought the whole way, and arrives intact. The Burma Road closes regardless, and China's supply depends on the Hump airlift for the rest of the war. What is preserved is the force Slim rebuilds into Fourteenth Army, which turns the Japanese back at Imphal and Kohima two years later.",
            },
            {
              label: "Commit the Chinese divisions to an absolute defense of Rangoon",
              advisor: { name: "Stilwell", position: "Chiang sent those divisions to keep his own supply line open, and pulling them back without a fight tells him what the alliance is worth the first time it costs anything." },
              setFlags: { rangoonAlliedPath: "defend", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: -3, pipeline: 1, initiative: 1 },
              next: flags.arcadiaPath === "pacificParity" ? "pacificFirstGamble42" : "curtinsTurn42",
              uncertain: [
                {
                  weight: modWeight(30, meters.readiness),
                  title: "The extra weeks matter",
                  setFlags: { rangoonDefendResult: "worthIt" },
                  impact: { readiness: -1, pipeline: 1, initiative: 1 },
                  outcome:
                    "Speculative. The Chinese divisions buy real weeks before Rangoon falls, and more equipment and more of the wider Burma garrison reach India intact than in the real retreat. It costs the Chinese Expeditionary Force badly, nearly encircled at Toungoo as it was in the real campaign, but this time the cost buys something.",
                },
                {
                  weight: (() => { const w = modWeight(30, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "A harder defeat, not a saved city",
                  setFlags: { rangoonDefendResult: "wasted" },
                  impact: { readiness: -2, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome. Rangoon falls anyway, on nearly the real timetable, and the Chinese divisions that might have retreated intact are mauled holding a city British planning had written off. The Burma Road closes on schedule, and Stilwell's signal to Chiang costs more than it buys.",
                },
              ],
            },
          ],
        };
        },
        get curtinsTurn42() {
          return {
          date: "FEBRUARY 1942",
          title: "Curtin's Turn",
          historicalRecord: true,
          situation:
            "Singapore has fallen, and Churchill wants the Australian 7th Division, already at sea and heading home for the continent's own defense, diverted to Burma instead. Australian Prime Minister John Curtin has to decide whether to accept London's redirection of Australian troops in a war Britain is now visibly losing in the region, or defy Churchill outright and insist the division comes home to defend Australia itself. This is the moment usually credited with Australia's real, lasting turn away from Britain and toward the United States as its primary defense partner." +
            (flags.rangoonDefendResult === "worthIt"
              ? " Whatever Churchill's case for Burma is worth on its own terms, it's being made in the shadow of a real, recent success there: the Chinese divisions committed to defending Rangoon actually bought weeks the historical retreat never had, which does nothing to make Curtin's own calculation about Australia's defense any less urgent, but at least means London isn't asking for more sacrifice toward a front that's already failed."
              : flags.rangoonDefendResult === "wasted"
              ? " Whatever Churchill's case for Burma is worth on its own terms, it's being made days after Rangoon fell anyway despite the cost of trying to hold it, which sharpens rather than softens Curtin's own instinct that London's requests keep costing Commonwealth forces more than they return."
              : ""),
          choices: [
            {
              label: "Defy Churchill: insist the division returns home for Australia's own defense",
              advisor: { name: "Curtin", position: "Australia looks to America and not to Britain, and the division should come home for Australia's defense." },
              attested: { by: "Curtin", text: "Australia looks to America, free of any pangs as to our traditional links or kinship with the United Kingdom", source: "John Curtin, 'The Task Ahead', Melbourne Herald, 27 December 1941" },
              historical: true,
              setFlags: { curtinPath: "defied", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: 1, pipeline: 0, initiative: 0 },
              next: "corregidorEvacuation42",
              outcome:
                "The division comes home over Churchill's strong objections. Curtin's refusal, following his December 1941 statement that Australia looks to America, is the moment historians point to as the rupture in Australian-British defense relations. It costs real friction with London at a moment the alliance can least afford it, and it sets the tone for an Australian-American defense relationship that outlasts the war by decades.",
            },
            {
              label: "Accept Churchill's redirection: keep the division in the fight for Burma rather than break with London",
              advisor: { name: "Churchill", position: "A war fought together is better defended together, even when the map makes that trust harder to extend than it should be, and Australia is asked to trust it." },
              setFlags: { curtinPath: "deferred", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: -1, pipeline: 0, initiative: 1 },
              next: "corregidorEvacuation42",
              outcome:
                "A modeled alternative: the position Churchill pushed in the real war, here granted. The division fights in Burma rather than defending Australian soil directly, preserving Commonwealth unity at a moment London badly needed it, at real political cost to Curtin domestically and a home defense Australia has to build without its own most experienced division for the war's most dangerous early stretch.",
            },
          ],
        };
        },
        get corregidorEvacuation42() {
          return {
          date: "MARCH 1942",
          title: "The Order to Leave",
          historicalRecord: true,
          situation:
            "Corregidor's garrison is besieged and Bataan is weeks from collapse, and Roosevelt has ordered MacArthur to leave the Philippines for Australia rather than stay with the men he commands. MacArthur has resisted the order for weeks, reportedly considering resignation to remain and fight, or even die, alongside his troops. The decision of whether to actually comply sits with him now, and either choice will be remembered.",
          choices: [
            {
              label: "Comply with the order: leave by PT boat for Australia and organize the wider Pacific war from there",
              advisor: { name: "MacArthur", position: "The general's promise to return is worth more to the men left on the rock than his capture or burial there would be, and he should leave by PT boat for Australia." },
              attested: { by: "MacArthur", text: "I came through and I shall return.", source: "MacArthur, interview with the Adelaide Advertiser at Terowie, 20 March 1942" },
              historical: true,
              setFlags: { corregidorPath: "evacuated", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: 0, pipeline: 0, initiative: 1 },
              next: "doolittleRaidAllied42",
              outcome:
                "MacArthur leaves Corregidor by PT boat on March 11, flies on from Mindanao in a B-17 and reaches Australia on March 17. The promise 'I shall return' shapes Pacific strategy for the next two and a half years. The men left on Bataan and Corregidor surrender within weeks, and the death march and years of captivity begin before MacArthur's return can reach them.",
            },
            {
              label: "Defy the order: remain on Corregidor with the garrison rather than leave them behind",
              advisor: { name: "Wainwright", position: "Leaving does not look like cowardice to the men on the island, whatever the newspapers make of it, and Wainwright, who takes over from MacArthur, says so." },
              setFlags: { corregidorPath: "remained", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: -2, pipeline: 0, initiative: -2 },
              next: "doolittleRaidAllied42",
              outcome:
                "A modeled alternative: the choice MacArthur reportedly considered and did not make against a direct presidential order. Staying would cost the Pacific war its most politically valuable commander when Washington needs a rallying figure in a theater that has produced only defeats, and would risk his capture or death with a garrison already understood to be lost. It also removes the promise to return, since there is no departure to redeem.",
            },
          ],
        };
        },
        get doolittleRaidAllied42() {
          return dataNode(ALLIED_PACIFIC_DATA, "doolittleRaidAllied42", meters);
        },
        get coralSeaMidwayAllied42() {
          return {
          date: "MAY – JUNE 1942",
          title: "Midway: The Ambush Nobody Was Supposed to Win",
          historicalRecord: true,
          situation:
            "Codebreakers at Station HYPO have done something close to the impossible: identified Midway as the next Japanese target weeks in advance, against analysts in Washington who initially doubted the intercepts. Yorktown, officially needing ninety days in dry dock after Coral Sea's damage, is the wild card: Pearl Harbor's yard has been given roughly seventy-two hours to make her seaworthy enough to fight. Whether to actually commit her, patched and undermanned, alongside Enterprise and Hornet against a Japanese force with four fleet carriers to America's three, is the call this staff meeting keeps returning to." +
            (flags.doolittleAlliedPath === "launch"
              ? " Doolittle's raiders bought something real here, whether or not it was intended: a Japanese command still stinging from Tokyo's bombing, rushing a plan its own skeptics hadn't fully vetted, is exactly the kind of adversary Station HYPO's intelligence can be turned against most effectively."
              : ""),
          choices: [
            {
              label: "Commit all three available carriers to ambush the Japanese fleet at Midway",
              advisor: { name: "Nimitz", position: "Three carriers, most of what the fleet has left, are being gambled on the codebreakers being right about a target and a date, and there is no better gamble available." },
              historical: true,
              setFlags: { midwayAlliedPath: "ambush" },
              impact: { readiness: -2, pipeline: 0, initiative: 3 },
              next: "kokodaTrailAllied42",
              keyBattleSubgame: KEY_BATTLE_CONFIGS.midwayAllied42,
              uncertain: [
                {
                  weight: modWeight(60 + (flags.forkToneOnTime ? 5 : 0), meters.initiative),
                  title: "The strike arrives in the window that matters",
                  setFlags: { midwayAlliedResult: "decisive" },
                  impact: { readiness: 1, pipeline: 0, initiative: 2 },
                  outcome:
                    "Dauntless dive bombers from Enterprise and Yorktown arrive while all four Japanese carriers have armed aircraft on their decks. Akagi, Kaga and Soryu burn within minutes of each other, and Hiryu is sunk that evening after crippling Yorktown. Four Japanese fleet carriers and many of their veteran aircrew are destroyed for one American carrier, the most consequential naval battle of the Pacific war.",
                },
                {
                  weight: 100 - modWeight(60, meters.initiative),
                  title: "The strike misses its window",
                  setFlags: { midwayAlliedResult: "costly" },
                  impact: { readiness: -3, pipeline: 0, initiative: 0 },
                  outcome:
                    "Speculative. The dive bombers arrive after the Japanese carriers have launched, finding fighters aloft and decks clear. Two Japanese carriers go down in a costlier, less decisive exchange, and Yorktown is lost outright. The Pacific Fleet holds the line but does not break Japan's carrier arm. The initiative changes hands more slowly and at a higher price.",
                },
              ],
            },
            {
              label: "Play conservative: preserve the carrier force, fortify Hawaii and the Australia route instead",
              advisor: { name: "Fletcher", position: "Three carriers are all that is left in the Pacific, the intelligence looks good, but it is not certain it is good enough to bet the whole fleet on a single morning." },
              setFlags: { midwayAlliedPath: "conservative", speculativePath: true },
              impact: { readiness: 2, pipeline: -1, initiative: -3 },
              next: "conservativePacific42",
              outcome:
                "A modeled alternative: the caution that a less confident reading of the codebreaking might have justified. Declining the ambush guards against intercepts that were wrong or a Japanese force stronger than estimated, but Japan's four fleet carriers sail home intact and free to choose the next operation on their own schedule.",
            },
            ...(meters.pipeline >= 3
              ? [
                  {
                    label: "Commit all three carriers, and hold a genuine reserve group ready to exploit the result immediately rather than regroup after",
                    advisor: { name: "Nimitz", position: "Three carriers are staked on the codebreakers being right, and a fourth should be held as a reserve on the chance they are right enough that Combined Fleet does not get a quiet month to regroup afterward." },
                    setFlags: { midwayAlliedPath: "ambushWithReserve" },
                    impact: { readiness: -1, pipeline: -2, initiative: 4 },
                    next: "kokodaTrailAllied42",
                    uncertain: [
                      {
                        weight: modWeight(60 + (flags.forkToneOnTime ? 5 : 0), meters.initiative),
                        title: "The strike arrives in the window that matters, and the reserve is ready to press it",
                        setFlags: { midwayAlliedResult: "decisiveExploited" },
                        impact: { readiness: 1, pipeline: 0, initiative: 3 },
                        outcome:
                          "The historical morning's own decisive result, plus something the actual Pacific Fleet's threadbare 1942 order of battle never had spare hulls to attempt: a reserve carrier group ready to press the advantage the moment Akagi, Kaga, and Soryu burn, rather than the historical pause to regroup and repair Yorktown's damage before the fleet could seriously consider its next move. Combined Fleet's shattered carrier arm gets no quiet month this time.",
                      },
                      {
                        weight: 100 - modWeight(60, meters.initiative),
                        title: "The strike misses its window, and the reserve is spent absorbing the cost instead",
                        setFlags: { midwayAlliedResult: "costlyReserveSpent" },
                        impact: { readiness: -3, pipeline: -1, initiative: 0 },
                        outcome:
                          "The same really contested morning breaks the harder way, and the reserve group held back to exploit a decisive win instead gets spent covering a costlier, less decisive exchange, an ambitious bet on a battle that didn't pay off the way it needed to for the extra commitment to have been worth making.",
                      },
                    ],
                    outcome:
                      "A position the real threadbare 1942 Pacific Fleet never had the hulls to consider: not just committing everything to the ambush, but holding a genuine reserve back specifically to press whatever result the battle produces, rather than needing the historical month afterward to regroup and patch Yorktown's damage before the fleet could move again.",
                  },
                ]
              : []),
          ],
        };
        },
        get kokodaTrailAllied42() {
          return {
          date: "JULY – NOVEMBER 1942",
          title: "The Kokoda Track",
          historicalRecord: true,
          situation:
            "Australian militia, mostly young, poorly equipped conscripts not yet reinforced by the veteran AIF divisions still returning from the Middle East, are conducting a fighting withdrawal down the Kokoda Track as Horii's South Seas Detachment pushes toward Port Moresby. MacArthur, running the campaign from Australia with little visibility into the terrain and supply conditions on the track, is reading the retreat as a failure of will rather than the skillfully executed delaying action Australian commanders on the ground understand it to be, and is pressing hard for an immediate stand." + (flags.midwayAlliedPath === "ambush" ? keyBattleEcho("midwayAllied42", flags) : ""),
          choices: [
            {
              label: "Back Blamey and the Australian commanders' fighting-withdrawal strategy: trade ground for time until reinforcements arrive",
              advisor: { name: "Blamey", position: "The Australian officers on the track know what it costs to hold ground that cannot be supplied, and they should not be overruled from Australia to satisfy a headline MacArthur wants to send to Washington." },
              historical: true,
              setFlags: { kokodaAlliedPath: "support" },
              impact: { readiness: 1, pipeline: -1, initiative: -1 },
              next: "guadalcanalAllied42",
              outcome:
                "What happened, broadly, though not without real friction at the top. The fighting withdrawal holds the Japanese advance to a crawl exactly as Australian commanders intended, buying time for veteran AIF divisions to arrive and eventually reverse the advance entirely by November. MacArthur's criticism of the Australian militia, made without his having visited the track, becomes one of the bitterest command disputes of the Pacific war and sours relations between the American and Australian commands.",
            },
            {
              label: "Demand an immediate stand: overrule the fighting withdrawal MacArthur reads as a failure of nerve",
              advisor: flags.corregidorPath === "remained"
                ? { name: "Sutherland", position: "The general is not here to say it himself, so the command he left behind says it: a line should be held and held now, and not further back down a track with no room for the divisions needed to hold it properly." }
                : { name: "MacArthur", position: "The general did not come to this theater to preside over a retreat, and he wants a line held now and not further back down a track he is told has no room for the divisions needed to hold it." },
              setFlags: { kokodaAlliedPath: "standFast" },
              impact: { readiness: -3, pipeline: -1, initiative: 1 },
              disabledReason: meters.pipeline <= -4 ? "There's no supply capacity left to hold a fixed line on this track at all. The militia battalions can execute a fighting withdrawal or they can be encircled, but they can't be resupplied in place at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -4, label: "Pipeline" },
              next: "guadalcanalAllied42",
              outcome:
                "A modeled alternative: MacArthur's pressure taken to its conclusion. Forcing a stand before reinforcements arrive risks the encirclement and destruction of the militia battalions conducting the withdrawal, on ground that historians of the campaign agree offered no defensible line short of the one the Australian commanders had chosen. Military historians now generally regard the criticism of the withdrawal as unfair to troops carrying out a sound plan in impossible conditions.",
            },
          ],
        };
        },
        get guadalcanalAllied42() {
          return {
          date: "AUGUST 1942",
          title: "Watchtower: The First Offensive",
          historicalRecord: true,
          situation:
            "Midway broke Japan's carrier arm, but the war in the Pacific is still Japan's to lose slowly rather than America's to win quickly, production superiority takes time to convert into fielded strength. Guadalcanal, where the Japanese are building an airfield that would put bombers within range of the sea lanes to Australia, is the target for the first American offensive of the war: risky, under-resourced, and scheduled well ahead of when the Joint Chiefs' own staff studies said an amphibious landing this size should be attempted." +
            (flags.wakeReliefPath === "recalled"
              ? " Nobody on this staff has forgotten what a recalled relief force cost at Wake. That memory cuts both ways here: caution has an institutional cost, and so does the alternative."
              : flags.wakeReliefPath === "pressed"
              ? " This command has already shown, at Wake, that it's willing to risk a carrier on a contested call. Whether that instinct still holds for a landing this under-resourced is about to be tested again."
              : "") +
            (flags.kokodaAlliedPath === "support"
              ? " Blamey's fighting withdrawal on the Kokoda Track is still trading ground for time as this landing goes in, a second under-resourced front asking the same theater command for reinforcements this one also needs."
              : flags.kokodaAlliedPath === "standFast"
              ? " MacArthur's own stand-fast order on the Kokoda Track is testing Australian units against the same supply reality this landing is about to run into on a different island entirely."
              : ""),
          choices: [
            {
              label: "Land the Marines immediately: seize the unfinished airfield before it's operational",
              advisor: { name: "King", position: "Every week of waiting is a week closer to the airfield flying combat missions against the supply line to Australia, so the Marines land now, underprepared, or later against a hardened base." },
              historical: true,
              setFlags: { guadalcanalAlliedPath: "immediate" },
              impact: { readiness: -3, pipeline: -1, initiative: 2 },
              disabledReason: meters.readiness <= -3 ? "The Marine divisions available can't absorb an underprepared landing at this readiness level on top of everything already committed. There isn't a force left to land immediately with." : undefined,
              gateCheck: { meter: "readiness", threshold: -3, label: "Readiness" },
              next: "savoIslandReckoning42",
              outcome:
                "Unprepared, the airfield's garrison loses it days from completion, but the six-month campaign that follows, the 'Tokyo Express' night naval battles, the starvation conditions in the jungle on both sides, is fought on a logistical shoestring the Joint Chiefs never fully resourced. Guadalcanal is held, barely, and becomes the campaign that starts converting American industrial advantage into a Pacific-wide offensive.",
            },
            {
              label: "Delay three months: build up shipping, air cover, and supply before landing",
              advisor: { name: "Ghormley", position: "History can have a slower victory, and the Marine Corps should not be given a landing the fleet cannot adequately support." },
              setFlags: { guadalcanalAlliedPath: "delay" },
              impact: { readiness: 2, pipeline: -2, initiative: -3 },
              next: "unconditionalSurrender43",
              outcome:
                "A modeled alternative. The landing is better supplied and three months later, against an airfield that the delay gives Japanese engineers time to finish and fortify. The thin margins of the real campaign do not repeat, Henderson Field held by aircraft flying on fumes and Marines living on captured rice, but neither does the real timeline: Japan gets a longer, freer hand in the Solomons before any American offensive arrives.",
            },
            ...(meters.readiness <= -4
              ? [
                  {
                    label: "Land on schedule, but pull escort carriers built for convoy and invasion-support duty into the landing's own air cover",
                    advisor: { name: "Nimitz", position: "The Sangamons were built for anti-submarine work and ferrying aircraft and not for fleet action, but Enterprise and Saratoga are close to the whole fleet carrier force the command has left to commit." },
                    setFlags: { guadalcanalAlliedPath: "escortCarriers" },
                    impact: { readiness: 1, pipeline: -2, initiative: 1 },
                    next: "savoIslandReckoning42",
                    outcome:
                      "A real redeployment, only earlier and more improvised than the one that actually happened: the Sangamon-class escort carriers, converted oiler hulls never designed for fleet action, historically reached the Pacific at the end of 1942 once their Atlantic convoy and Operation Torch duties were finished, arriving right as the fleet carrier force had fallen to just Enterprise and Saratoga. Pulling them into Guadalcanal's own landing earlier means an under-designed ship doing a job it was never built for, months ahead of when history actually needed it to.",
                  },
                ]
              : []),
          ],
        };
        },
        get savoIslandReckoning42() {
          return {
          date: "AUGUST 1942",
          title: "Savo Island",
          historicalRecord: true,
          situation:
            "On the night of August 8–9, two days after the landing, a Japanese cruiser squadron under Mikawa slips past Allied picket destroyers at night and catches the covering force completely by surprise off Savo Island. Four Allied heavy cruisers, Astoria, Quincy, Vincennes, and the Australian cruiser Canberra, are sunk in under an hour, in what becomes one of the worst single defeats in U.S. Navy history. Mikawa withdraws without attacking the transports, which saves the landing and does nothing for the covering force. More than a thousand Allied sailors are dead by morning, and Nimitz's command has to decide how the defeat is handled while the Guadalcanal campaign is under way.",
          choices: [
            {
              label: "Order a full court of inquiry and make the findings public: accountability now, whatever it costs morale mid-campaign",
              advisor: { name: "Nimitz", position: "The men who died at Savo Island deserve better than a story quietly dropped, and if a command failure put them there it should be found and stated." },
              historical: true,
              setFlags: { savoPath: "publicInquiry" },
              impact: { readiness: -1, pipeline: 0, initiative: -1 },
              next: "unconditionalSurrender43",
              uncertain: [
                {
                  weight: modWeight(55, meters.readiness),
                  title: "The findings change doctrine before it costs another ship",
                  setFlags: { savoInquiryResult: "actedOn" },
                  impact: { readiness: 1, pipeline: 0, initiative: 0 },
                  outcome:
                    "What happened, roughly. The Navy's inquiry finds specific failures: inadequate night-scouting doctrine, a covering force spread too thin, and no unified command able to react once contact was made. The findings reach the fleet in time to change doctrine before a second squadron repeats the mistake in the dark.",
                },
                {
                  weight: (() => { const w = modWeight(55, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The findings land, but too slowly to matter",
                  setFlags: { savoInquiryResult: "tooSlow" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The inquiry is thorough, but the distance between a published report and a destroyer captain's night-scouting drills is wider than Nimitz hoped. The lesson is on the record. Whether it reaches the right wardroom before the next dark night off an unfamiliar island is not settled.",
                },
              ],
            },
            {
              label: "Classify the full findings and manage the story: an active campaign is the wrong moment for a public reckoning",
              advisor: { name: "King", position: "The facts are not disputed, only whether the Marines still fighting on the island need to read about them in a newspaper this week." },
              setFlags: { savoPath: "classified" },
              impact: { readiness: 1, pipeline: 0, initiative: 1 },
              next: "unconditionalSurrender43",
              outcome:
                "The findings stay internal and doctrine changes quietly, sparing the campaign a blow to morale that the Navy's leadership judged it could not afford. The price is a lesson learned in private, and some future squadron may repeat the mistake before word gets around.",
            },
            ...(meters.initiative <= -6
              ? [
                  {
                    label: "Have King intervene directly from Washington: bypass the normal chain of command to force a decision this stalled campaign hasn't produced on its own",
                    advisor: { name: "King", position: "The admiral's position is that the campaign continues in its present state of delay, linger and wait, and that the Washington staff should step in directly." },
                    setFlags: { savoPath: "kingIntervenes" },
                    impact: { readiness: -1, pipeline: 1, initiative: 3 },
                    next: "unconditionalSurrender43",
                    outcome:
                      "A real, documented frustration, escalated here into something the historical King mostly kept to a terse written note: direct intervention from Washington into a theater commander's own operational decisions, a chain-of-command breach King's own real irritation with the campaign's grinding pace never quite crossed into. It forces movement where the campaign had stalled into exactly the delay, linger, and wait he complained about, at the real cost of a precedent for Washington overriding the men actually fighting the war on the spot.",
                  },
                ]
              : []),
          ],
        };
        },
        get unconditionalSurrender43() {
          return {
          date: "JANUARY 1943",
          title: "The Casablanca Declaration",
          historicalRecord: true,
          situation:
            "Roosevelt and Churchill are meeting at Casablanca to set Allied war aims for the years ahead, and Roosevelt is preparing to announce a policy that will define exactly how this war ends: unconditional surrender, for Germany, Italy, and Japan alike, with no negotiated terms available to any Axis government at any point. Some of his own advisers have raised a concern that historians still argue about: that removing any negotiated way out might harden a Japanese war ministry already inclined to fight, and prolong a war that a more flexible policy could have shortened." +
            (flags.savoInquiryResult === "actedOn"
              ? " The Navy's own recent reckoning with Savo Island, acted on before it cost a second disaster, is the kind of institutional self-correction that makes Roosevelt's own case, that this war is best fought by an alliance willing to look honestly at its own failures, considerably easier to make in this room."
              : flags.savoInquiryResult === "tooSlow"
              ? " The Navy's own recent reckoning with Savo Island, real but too slow to prevent a second cost, is a reminder in this room that declared policy and institutional follow-through don't always move at the same speed, a caution nobody at Casablanca says out loud but everyone weighing this declaration understands."
              : ""),
          choices: [
            {
              label: "Announce unconditional surrender as declared Allied policy",
              advisor: { name: "Roosevelt", position: "The mistake of 1918, when an armistice let Germany's militarists claim they were never defeated, must not be repeated, and peace comes only through the total elimination of German and Japanese war power." },
              historical: true,
              setFlags: { surrenderDoctrinePath: "unconditional" },
              impact: { readiness: 0, pipeline: 0, initiative: 1 },
              next: "torpedoCrisis43",
              outcome:
                "The policy holds for the rest of the war and shapes every later decision about how to end it, including the debate over whether the Emperor's position could be kept under a surrender that was otherwise unconditional. Historians remain divided on whether it prolonged Japanese resistance by removing the incentive to negotiate, or whether Japan's war ministry would never have accepted negotiated terms.",
            },
            {
              label: "Leave room for negotiated terms: decline to foreclose a settlement short of unconditional surrender",
              advisor: { name: "Marshall", position: "Removing every off-ramp may not shorten the war, and it removes any chance of the enemy government seeing a path to the end that does not require its own destruction first." },
              setFlags: { surrenderDoctrinePath: "negotiated" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "torpedoCrisis43",
              uncertain: [
                {
                  weight: modWeight(35, meters.readiness),
                  title: "The peace faction gets real room to argue",
                  setFlags: { surrenderDoctrineResult: "peaceFactionRoom" },
                  impact: { readiness: 0, pipeline: 0, initiative: 1 },
                  outcome:
                    "Speculative. A declared willingness to consider terms gives Japan's peace faction a real argument against the war ministry's hardliners, years before the same argument broke through in 1945. It does not end the war by itself. It changes what the argument inside Tokyo sounds like.",
                },
                {
                  weight: (() => { const w = modWeight(35, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The war ministry treats it as weakness, not opening",
                  setFlags: { surrenderDoctrineResult: "readAsWeakness" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome, and the one Roosevelt's reasoning at Casablanca was meant to avoid. Japan's war ministry reads any openness to terms as a sign that the Allies are losing their nerve, and holds out harder. The door to negotiation stays open and nobody on the other side wants to walk through it.",
                },
              ],
              outcome:
                "A modeled alternative, on the concern historians have raised: that a declared willingness to consider terms short of unconditional surrender might have given Japan's peace faction more room to argue for an earlier end. Whether the war ministry, which held out even after two atomic bombs, would have taken an opening seriously before 1945 is disputed, and the game does not invent a Japanese answer.",
            },
          ],
        };
        },
        get torpedoCrisis43() {
          return {
          date: "JANUARY 1943",
          title: "The Torpedo That Won't Explode",
          historicalRecord: true,
          situation:
            "Submarine patrol reports from the past year describe the same failure over and over: a perfect firing solution, a clean hit, and no explosion. The Bureau of Ordnance's official position is that the Mark 14 is sound and the fault lies with approach technique and crew error. Rear Admiral Charles Lockwood, who commanded the submarines in Australia until this month and has just been named COMSUBPAC, ran his own field tests there in 1942, firing torpedoes through a fishing net to measure the actual running depth against the set depth. The results contradict the Bureau of Ordnance directly: the torpedoes run about ten feet deeper than set and pass under targets that should have been hit." +
            (flags.surrenderDoctrineResult === "peaceFactionRoom"
              ? " Washington's unconditional-surrender declaration, just made, is landing this same month against reports suggesting it may have left Japan's peace faction real room to argue back home, an early, uncomfortable data point about how much a single declared policy actually controls in a war this large, not unlike Lockwood's own fight against a bureau that's been declaring a torpedo sound for a year despite what the field keeps showing."
              : flags.surrenderDoctrineResult === "readAsWeakness"
              ? " Washington's unconditional-surrender declaration, just made, is landing this same month against reports suggesting Japan's war ministry read it as confirmation of exactly the resolve it was meant to project, one policy at least behaving the way its authors intended, even as this same command discovers its own Mark 14 hasn't been behaving the way anyone intended for a year."
              : ""),
          choices: [
            {
              label: "Back Lockwood's field data over BuOrd's official position: order the fleet's own depth-control fix",
              advisor: { name: "Lockwood", position: "The Bureau of Ordnance has offered theory, and the submarine commander offers a torpedo that runs at the depth it is set to and asks that the record show who actually tested it." },
              historical: true,
              setFlags: { torpedoCrisisPath: "backLockwood" },
              impact: { readiness: 1, pipeline: 0, initiative: 1 },
              next: "theBatBombQuestion43",
              outcome:
                "What happened. Lockwood's tests, run without the Bureau's cooperation and at first dismissed by it, are confirmed when the Bureau is pressed into running its own tests in August 1942, eight months into the war. The depth fix helps at once. Two more defects remain, a magnetic exploder that fires early or not at all and a contact firing pin that crumples on a square hit, and it is not until September 1943 that the Mark 14 works as intended.",
            },
            {
              label: "Defer to BuOrd's official assessment: maintain standard procedure while the Bureau's own review continues",
              advisor: { name: "Nimitz", position: "The patrol reports show more than bad approach work, the Bureau of Ordnance is not being overruled from here, and it is being asked again to look." },
              setFlags: { torpedoCrisisPath: "deferBuOrd" },
              impact: { readiness: -1, pipeline: -1, initiative: -1 },
              next: "theBatBombQuestion43",
              outcome:
                "The institutionally cautious path, and the one that costs the most in ships not sunk. Without a theater commander's tests forcing the issue, the depth defect goes uncorrected for longer, and the submarine force goes on firing spreads that run under their targets or fail to detonate, against a Bureau that still blames everything but the torpedo.",
            },
          ],
        };
        },
        get theBatBombQuestion43() {
          return dataNode(ALLIED_PACIFIC_DATA, "theBatBombQuestion43", meters);
        },
        get bismarckSea43() {
          return dataNode(ALLIED_PACIFIC_DATA, "bismarckSea43", meters);
        },
        get yamamotoIntercept43() {
          return {
          date: "APRIL 1943",
          title: "Operation Vengeance: The Yamamoto Intercept",
          historicalRecord: true,
          situation:
            "Fleet intelligence has decrypted a JN-25 message giving Admiral Yamamoto's inspection itinerary: his aircraft will pass within fighter range of Guadalcanal in a few days. Killing the officer who planned Pearl Harbor is suddenly possible. Several people in the room point out that a strike this specific, on one aircraft in one twenty-minute window over one stretch of water, may lead the Japanese to ask how the Americans knew, and the only answer that fits is a broken code." +
            (flags.bismarckSeaPath === "fullCommit"
              ? " The full-commitment doctrine that just cost a Japanese convoy dearly off New Guinea is barely a month old. Whether the same appetite for a coordinated, all-in strike extends to a target this specific and this consequential is exactly what this room is about to find out."
              : flags.bismarckSeaPath === "reserved"
              ? " The more reserved doctrine chosen off New Guinea a month ago argued for holding capability back rather than committing everything to a single strike. This target tests whether that same caution survives contact with an opportunity this rare."
              : ""),
          choices: [
            {
              label: "Authorize the strike: send fighters to intercept Yamamoto's flight on schedule",
              advisor: { name: "Nimitz", position: "The question is whether to try to get Yamamoto and whether the Japanese would replace him with someone better." },
              historical: true,
              setFlags: { yamamotoInterceptPath: "authorize" },
              impact: { readiness: 0, pipeline: 0, initiative: 3 },
              next: "tehransPromise43",
              outcome:
                "P-38 fighters meet Yamamoto's flight on schedule near Bougainville on April 18. Japan's inquiry concludes that the interception was coincidence, a patrol in the wrong place at the worst time for Yamamoto, and not proof that the code was broken. The secret holds, and JN-25 stays readable for the rest of the war.",
            },
            {
              label: "Decline the strike, or let the window close: the intelligence source is worth more than one admiral",
              advisor: { name: "Knox", position: "The decrypt has had eleven readings, and one admiral is not worth what its discovery would cost for the rest of the war." },
              setFlags: { yamamotoInterceptPath: "declined", speculativePath: true },
              impact: { readiness: 0, pipeline: 1, initiative: -2 },
              next: "yamamotoSurvives43",
              outcome:
                "The window closes on its own; no order goes out, and Yamamoto's flight passes over Bougainville unmolested. The source stays protected by never being used this way at all, at a cost nobody in the room can actually price: whether that admiral, still in command, changes anything that matters isn't something this meeting can answer, only the months after it.",
            },
          ],
        };
        },
        get yamamotoSurvives43() {
          return dataNode(ALLIED_PACIFIC_DATA, "yamamotoSurvives43", meters);
        },
        get tehransPromise43() {
          return {
          date: "NOVEMBER – DECEMBER 1943",
          title: "Stalin's Promise, Pressed Early",
          historicalRecord: true,
          situation:
            "At Tehran, Stalin tells Roosevelt privately that the Soviet Union will enter the Pacific war once Germany is defeated, an informal commitment later formalized at Yalta and honored, on schedule, in August 1945. The Eastern Front is still consuming the overwhelming majority of Soviet manpower and industrial output, and any Soviet division redirected east now is a division not fighting Germany. Washington's planners have to decide whether to accept the deferred commitment as offered, or press Stalin for something more concrete: an earlier date, or a diversion of forces before Germany really falls." +
            (flags.magicDisciplinePath === "conservative"
              ? " This delegation negotiates from a Pacific intelligence picture built on real discipline: the decrypts kept reserved for exactly the kind of strategic warning a promise like Stalin's needs verified against, not spent on tactical targets that would have told this room less about Soviet timing and more about one dead admiral."
              : flags.magicDisciplinePath === "willing" && flags.magicResult === "clean"
              ? " This delegation negotiates from a Pacific intelligence picture that's stayed intact despite looser use, a source proven resilient enough that Washington's read on Japan's actual position, weighed against Stalin's promise, is built on current signals rather than a year-old snapshot."
              : flags.magicDisciplinePath === "willing" && flags.magicResult === "closeCall"
              ? " This delegation negotiates from a Pacific intelligence picture that came uncomfortably close to going dark earlier this year, a source this room is trusting a little less completely than it might have, in a negotiation where verifying Stalin's own timetable against real Japanese dispositions matters more than usual."
              : ""),
          choices: [
            {
              label: "Accept the deferred commitment: let Stalin fight Germany first, honor his own timetable for the Pacific",
              advisor: { name: "Marshall", position: "Weakening the front that kills the largest share of the German army is not something to ask of Stalin, whose timetable serves both wars better than a rushed one would." },
              historical: true,
              setFlags: { tehranPath: "deferred" },
              impact: { readiness: 0, pipeline: 0, initiative: 0 },
              next: "centralPacificDrive43",
              outcome:
                "What happened, in substance. Stalin's commitment stands as made, informally at Tehran and formally at Yalta fourteen months later, and it is honored in August 1945: Soviet entry roughly three months after Germany's surrender, with redeployment from Europe under way well before the declaration. The Eastern Front loses nothing to an early diversion it was never asked to make.",
            },
            {
              label: "Press for an earlier date: request a diversion of Soviet forces to the Far East before Germany falls",
              advisor: { name: "King", position: "Every month sooner the Soviet Union opens a second front against Japan is a month sooner the fleet is not fighting the Kwantung Army alone, and it is better to ask for more than expected than not to ask." },
              setFlags: { tehranPath: "pressed" },
              impact: { readiness: 1, pipeline: -1, initiative: 1 },
              disabledReason: meters.pipeline <= -6 ? "There isn't the diplomatic capital left to press an ally already fighting the war's largest land campaign for a concession this costly. The relationship can't absorb the request at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -6, label: "Pipeline" },
              next: "centralPacificDrive43",
              outcome:
                "A modeled alternative, on the argument Pacific-minded planners found frustrating: every month that the Kwantung Army in Manchuria sits uncommitted is a month that the Pacific war faces Japan's full remaining strength alone. Historians of Soviet wartime strategy consider an earlier date close to a non-starter, because the Eastern Front's needs for manpower were not negotiable before Germany's collapse.",
            },
          ],
        };
        },
        get centralPacificDrive43() {
          return {
          date: "1943 – 1944",
          title: "Leapfrogging the Strong Points",
          historicalRecord: true,
          situation:
            "With Guadalcanal held and Japan's carrier arm broken at Midway, the question is how to close the distance to the home islands. Nimitz's staff favors a drive through the Central Pacific by island-hopping: taking lightly held atolls that matter for airfields and bypassing heavily fortified ones such as Truk, starving them of supply instead of assaulting them. Marine commanders such as Holland Smith argue that bypassed garrisons remain a threat to the flanks of any advance." +
            (flags.guadalcanalAlliedPath === "delay"
              ? " The three-month delay before Guadalcanal's landing is still being felt in the timetable. Command starts from a position roughly a season behind where the historical record had it."
              : ""),
          choices: [
            {
              label: "Bypass the fortified atolls: isolate Truk and other strongpoints via air and submarine blockade",
              advisor: { name: "Nimitz", position: "Killing every garrison Japan has left behind is not the job, only the airfields and anchorages that lead to the next objective, and Truk starves as well from a distance." },
              historical: true,
              setFlags: { centralPacificPath: "leapfrog" },
              next: "macArthurTension44",
              outcome:
                "Truk, once called the 'Gibraltar of the Pacific,' is neutralized by carrier air strikes and a submarine blockade without being invaded, and tens of thousands of Japanese troops are left to starve on bypassed islands while the American advance moves past them at a pace direct assault could not have matched.",
            },
            {
              label: "Direct assault: reduce the Gilberts, Marshalls, and Marianas strongpoint by strongpoint",
              advisor: { name: "Holland Smith", position: "Bypassing a fortified position does not stop it being fortified, only makes it someone else's problem later, when there is less time to solve it." },
              setFlags: { centralPacificPath: "assault" },
              impact: { readiness: -2, pipeline: 0, initiative: 3 },
              disabledReason: meters.readiness <= -3 ? "Marine and Army divisions can't absorb Tarawa-scale casualties again at this readiness level. The fleet doesn't have the replacements to sustain repeated direct assaults." : undefined,
              gateCheck: { meter: "readiness", threshold: -3, label: "Readiness" },
              next: "theTarawaQuestion43",
              outcome:
                "A modeled alternative. Direct assault removes the risk of bypassed garrisons and pays for it in casualties that leapfrogging was designed to avoid. Tarawa, a cautionary fight in the real war, becomes this path's template. The advance moves faster in a straight line and slower overall.",
            },
            ...(meters.pipeline >= 5
              ? [
                  {
                    label: "Run both strategies at once: leapfrog most of the strongpoints while still reducing the two or three that threaten the flank",
                    advisor: { name: "Spruance", position: "Running both doctrines at once would not have been proposed with the tonnage the fleet had eighteen months ago, and the surplus it has now changes that." },
                    setFlags: { centralPacificPath: "hybrid" },
                    impact: { readiness: -1, pipeline: -4, initiative: 2 },
                    next: "macArthurTension44",
                    outcome:
                      "A uncommon position to be advancing from: enough tonnage and hull strength that this fleet doesn't have to choose between Nimitz's patience and MacArthur's insistence on reducing every real threat to the flank. Most of the Central Pacific's fortified atolls still get bypassed and starved, exactly as the historical campaign did it, but the two or three dangerous strongpoints along the flank get taken directly, at a cost in tonnage this campaign is only able to absorb because of how far ahead of schedule the supply picture already is.",
                  },
                ]
              : []),
          ],
        };
        },
        get theTarawaQuestion43() {
          return dataNode(ALLIED_PACIFIC_DATA, "theTarawaQuestion43", meters);
        },
        get macArthurTension44() {
          return dataNode(ALLIED_PACIFIC_DATA, "macArthurTension44", meters);
        },
        get macArthurAftermath44() {
          return dataNode(ALLIED_PACIFIC_DATA, "macArthurAftermath44", meters);
        },
        get philippineSeaAllied44() {
          const midwayDeclined = flags.midwayAlliedPath === "conservative";
          return {
          date: "JUNE 1944",
          title: midwayDeclined
            ? "The Marianas: A Fleet Intelligence Never Retired"
            : "The Marianas: Spruance's Choice",
          historicalRecord: !midwayDeclined,
          situation: midwayDeclined
            ? "Every carrier-strength estimate Nimitz's staff has built for Ozawa's Mobile Fleet since 1942 rests on a fixed premise: four fleet carriers gone at Midway, a subtraction baked into two years of planning assumptions that never had to be revisited. It never happened here. Three more years of the Solomons campaign, Rabaul's slow isolation, and a training pipeline stretched thinner every month have still worn this fleet down, but Layton's own section has no clean way to say by how much a fleet that was never supposed to still exist has actually degraded, and every naval-threat assumption Downfall's planners lean on a year from now traces back to what gets decided about that gap this month. Ozawa is somewhere west of Saipan with more hulls than the historical battle ever had to account for. Mitscher wants to go find him regardless of the uncertainty. Spruance's orders still say protect the landing above all else, and protecting it against a fleet nobody can confidently size is a different order than the one his historical counterpart had to follow."
            : "Ozawa's Mobile Fleet is somewhere west of Saipan, and Mitscher, commanding Task Force 58's carriers, wants to find it and finish it. Spruance, commanding the covering force, has a different priority in his orders: protect the Saipan landing above all else. If the Japanese fleet slips past while Task Force 58 is hunting Ozawa, the transports and the Marines ashore have nothing between them and a bombardment force. The question is whether to release the carriers for a pursuit or hold them close to the landing, whatever that costs in Japanese ships that get away.",
          choices: midwayDeclined
            ? [
                {
                  label: "Treat the sizing gap as reason for maximum caution: hold the full covering force at the landing, accept whatever escapes rather than risk it against an unknown-strength fleet",
                  advisor: { name: "Spruance", position: "The orders protected the landing against a fleet of known size, and that protection should not be loosened against one of unknown size in the hope that three years did the Navy's work for it." },
                  setFlags: { philippineSeaAlliedPath: "maxCaution", carrierEstimateTrust: "distrusted" },
                  impact: { readiness: 2, pipeline: 0, initiative: -3 },
                  next: "chinaCrisisAllied44",
                  outcome:
                    "The safest reading of an unreadable situation: the full covering force never leaves the landing, and whatever Ozawa's fleet actually is by 1944, larger, more experienced, or nearly as worn down as the historical one, it clears the area intact either way, because nothing in this decision was built to find out. What's carried forward instead of an answer is the same open question fleet intelligence walked in with, still unresolved when Downfall's own planners have to size the same fleet again a year from now.",
                },
                {
                  label: "Push Layton's section for a hard count before deciding either way: hold the main decision for a reconnaissance-in-force",
                  advisor: { name: "Layton", position: "The intelligence officer can keep giving an estimate built on an assumption that stopped being true two years ago or ask for time to replace it with an actual count, and a real number late is better than a wrong one on time." },
                  setFlags: { philippineSeaAlliedPath: "reconFirst" },
                  impact: { readiness: 0, pipeline: -1, initiative: -1 },
                  next: "chinaCrisisAllied44",
                  uncertain: [
                    {
                      weight: modWeight(50, meters.readiness),
                      title: "The reconnaissance finds a fleet closer to the historical picture than feared",
                      setFlags: { carrierEstimateTrust: "confirmedSmaller", philippineSeaAlliedResult: "reconClear" },
                      impact: { readiness: 1, pipeline: 0, initiative: 2 },
                      outcome:
                        "The count comes back close enough to the historical Mobile Fleet's own diminished strength that the delay buys real confidence rather than just lost time: whatever four surviving fleet carriers changed about this war on paper, three years of the same attrition that ground down the historical fleet ground this one down nearly as far, and Task Force 58 can commit to the battle that follows on terms close to the ones the historical Turkey Shoot was fought on.",
                    },
                    {
                      weight: (() => { const w = modWeight(50, meters.readiness); return Math.max(5, 100 - w); })(),
                      title: "The reconnaissance confirms the worse case: a fleet meaningfully larger than the historical one",
                      setFlags: { carrierEstimateTrust: "confirmedLarger", philippineSeaAlliedResult: "reconConfirmedThreat" },
                      impact: { readiness: -1, pipeline: 0, initiative: -1 },
                      outcome:
                        "The count that comes back is the one Layton's section was afraid of: a Mobile Fleet with real hull and air-group strength the historical battle never had to plan against, confirmed rather than merely feared, at the direct cost of the days spent finding out. Task Force 58 now knows exactly what it's protecting the landing against. Knowing does not make the fleet any smaller.",
                    },
                  ],
                  outcome:
                    "A bet that time spent replacing an inherited assumption with an actual number is worth more than the days it costs, made against a fleet, a landing, and a war that don't stop moving while Layton's section works.",
                },
                {
                  label: "Trust that attrition closed enough of the gap regardless: release the carriers for an aggressive pursuit on the historical assumption",
                  advisor: { name: "Mitscher", position: "Four extra hulls that survived one morning two years ago do not mean four extra carriers' worth of trained pilots survived everything since, and the fight should go as the plan already assumes." },
                  historical: false,
                  setFlags: { philippineSeaAlliedPath: "aggressiveTrust", carrierEstimateTrust: "assumedSmaller" },
                  impact: { readiness: -2, pipeline: 0, initiative: 2 },
                  disabledReason: meters.readiness <= -4 ? "The carrier air groups don't have the strength left to leave the landing force uncovered and still win a pursuit whose fleet strength is unknown. The fleet can protect the beach or gamble, not both, at this readiness level." : undefined,
                  gateCheck: { meter: "readiness", threshold: -4, label: "Readiness" },
                  next: "chinaCrisisAllied44",
                  uncertain: [
                    {
                      weight: modWeight(30, meters.initiative),
                      title: "The assumption holds: the fleet fights close to the historical Turkey Shoot's own terms",
                      setFlags: { philippineSeaAlliedResult: "gambleHeld" },
                      impact: { readiness: 0, pipeline: 0, initiative: 3 },
                      outcome:
                        "The bet pays off. Whatever additional hulls and pilots three extra years theoretically preserved, the same fuel shortages, the same thinned training pipeline, and the same American radar-and-fighter-control advantage that gutted the historical Mobile Fleet gut this one too, close enough to the historical result that the pursuit Mitscher wanted finds a fleet it can actually finish.",
                    },
                    {
                      weight: (() => { const w = modWeight(30, meters.initiative); return Math.max(5, 100 - w); })(),
                      title: "The assumption fails: the fleet is the real, larger threat the sizing gap always risked",
                      setFlags: { philippineSeaAlliedResult: "gambleFailed", carrierThreatConfirmedEarly: true },
                      impact: { readiness: -3, pipeline: -1, initiative: -2 },
                      outcome:
                        "The likelier failure mode, and the one the sizing gap always made possible: the fleet committed to this pursuit is not the historical Mobile Fleet's own scraped-together remainder, and Task Force 58 finds that out with the landing already left uncovered on the strength of an assumption that stopped being safe the day Akagi, Kaga, Soryu, and Hiryu didn't sink. What Spruance's actual orders were written to prevent happens here on a bet that never had the intelligence behind it to justify the odds.",
                    },
                  ],
                  outcome:
                    "The historical playbook, run on a fleet the historical playbook was never built to describe. Mitscher's real instinct for aggression gets applied to a premise that, this time, nobody in the room can actually confirm.",
                },
                ...(meters.readiness >= 6
                  ? [
                      {
                        label: "Split the force with genuine strength behind both halves: keep the landing covered at full strength while a second full-strength element finds Ozawa's fleet before anyone commits to fighting it",
                        advisor: { name: "Spruance", position: "The sizing gap is the real problem and not which half of the fleet gets which job, and giving both halves enough carriers to do their own job stops the gap being something to gamble around." },
                        setFlags: { philippineSeaAlliedPath: "splitRecon" },
                        impact: { readiness: -2, pipeline: -1, initiative: 1 },
                        next: "chinaCrisisAllied44",
                        uncertain: [
                          {
                            weight: modWeight(60, meters.readiness),
                            title: "The full-strength search finds a fleet closer to the historical picture",
                            setFlags: { carrierEstimateTrust: "confirmedSmaller", philippineSeaAlliedResult: "splitReconClear" },
                            impact: { readiness: 1, pipeline: 0, initiative: 1 },
                            outcome:
                              "A search conducted at genuine full strength, not a scraped-together screen, finds what Layton's section hoped for: Ozawa's fleet, whatever four extra hulls theoretically added to it, is close enough to the historical Mobile Fleet's own worn-down condition that the gap this choice was built to answer closes on its own.",
                          },
                          {
                            weight: (() => { const w = modWeight(60, meters.readiness); return Math.max(5, 100 - w); })(),
                            title: "The full-strength search confirms the larger, more dangerous fleet",
                            setFlags: { carrierEstimateTrust: "confirmedLarger", philippineSeaAlliedResult: "splitReconThreat" },
                            impact: { readiness: -1, pipeline: 0, initiative: 0 },
                            outcome:
                              "Even a search run at full strength doesn't get to choose its own answer: Ozawa's fleet turns out to be the real, larger threat the sizing gap always risked. The landing was never actually exposed to find that out, the entire point of committing enough carriers to do both jobs at once, but the fleet itself is exactly as dangerous as the worse estimate feared.",
                          },
                        ],
                        outcome:
                          "A position that answers the sizing gap with strength instead of a bet: enough carriers, for once, to hold the landing at genuine full cover and still send a force to find Ozawa's fleet and confirm what it actually is before Task Force 58 commits to fighting it on an assumption either way. The historical argument over which priority Spruance should have picked doesn't happen in these terms, because the sizing gap that made every other version of this choice a gamble gets answered with reconnaissance and force strength instead of faith in an inherited number.",
                      },
                    ]
                  : []),
              ]
            : [
            {
              label: "Hold the carriers close to protect the landing: accept that some of Ozawa's fleet escapes",
              advisor: { name: "Spruance", position: "The mission is the landing force and not Ozawa's fleet, and if protecting the first costs a cleaner shot at the second, that cost is accepted every time." },
              historical: true,
              setFlags: { philippineSeaAlliedPath: "protect" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "chinaCrisisAllied44",
              outcome:
                "The Marianas Turkey Shoot destroys Japanese naval aviation as a serious force regardless of Spruance's caution, but Ozawa's remaining carriers, stripped of aircrews and not sunk, escape. Mitscher and other naval aviators argued for years afterward that this was a missed chance to end Japanese carrier aviation as a threat in ships and not only in pilots. Spruance's defenders point out that a landing force left uncovered while the carriers went hunting was a risk with no acceptable way to fail.",
            },
            {
              label: "Release the carriers for an aggressive pursuit: prioritize destroying Ozawa's fleet over the landing's immediate cover",
              advisor: { name: "Mitscher", position: "The fleet is in a position no American commander has had it in this war, and the carriers should not be held back to let it find its way home." },
              setFlags: { philippineSeaAlliedPath: "pursue" },
              impact: { readiness: -1, pipeline: 0, initiative: 3 },
              disabledReason: meters.readiness <= -4 ? "The carrier air groups don't have the strength left to leave the landing force uncovered and still win a pursuit. The fleet can protect the beach or gamble, not both, at this readiness level." : undefined,
              gateCheck: { meter: "readiness", threshold: -4, label: "Readiness" },
              next: "chinaCrisisAllied44",
              keyBattleSubgame: KEY_BATTLE_CONFIGS.philippineSea44,
              uncertain: [
                {
                  weight: modWeight(40, meters.initiative),
                  title: "The pursuit catches Ozawa's carriers",
                  setFlags: { philippineSeaAlliedResult: "caughtFleet" },
                  impact: { readiness: 0, pipeline: 0, initiative: 2 },
                  outcome:
                    "Speculative. Mitscher's bet pays off. Task Force 58 runs down Ozawa's remaining carriers before they clear the range of American strike aircraft, finishing in ships what the Turkey Shoot finished in pilots. The landing force is briefly uncovered, and nothing worse turns up to test it.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.initiative); return Math.max(5, 100 - w); })(),
                  title: "The pursuit comes up empty",
                  setFlags: { philippineSeaAlliedResult: "missedFleet" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome, and the one Spruance's defenders always feared. Ozawa's remaining ships have too much of a head start, and Task Force 58 spends fuel and time chasing a fleet already most of the way home. The landing force sat briefly uncovered for a pursuit that caught nothing.",
                },
              ],
              outcome:
                "A modeled alternative. Committing to the chase risks the thing Spruance's orders were written to prevent, a landing force uncovered while the fleet hunts a retreating enemy, in exchange for a chance to destroy more of Ozawa's carriers than the real battle did. Naval historians remain split between Spruance's defenders and Mitscher's.",
            },
            ...(meters.readiness >= 6
              ? [
                  {
                    label: "Split the force with genuine strength behind both halves: hold the landing's cover intact while still releasing a pursuit group",
                    advisor: { name: "Spruance", position: "The argument for choosing one task or the other assumes there is only enough for one, but there are enough carriers for once, so half stays on the beach and half goes after Ozawa, and neither half is a bluff." },
                    setFlags: { philippineSeaAlliedPath: "splitForce" },
                    impact: { readiness: -2, pipeline: -1, initiative: 2 },
                    next: "chinaCrisisAllied44",
                    outcome:
                      "A position the actual June 1944 argument never had the carrier strength to consider: Spruance's real historical choice was forced precisely because dividing Task Force 58 meant neither half was strong enough to guarantee its own job. Here, both halves can. The landing stays covered by a force with real teeth, not a screen, while a second, equally real force goes after Ozawa's retreating carriers, and the debate historians have run for decades over which priority Spruance should have picked doesn't get to happen in quite the same terms, because this fleet was never actually forced to pick.",
                  },
                ]
              : []),
          ],
        };
        },
        get stilwellUltimatum44() {
          const divergentPath = flags.arcadiaPath === "pacificParity" || flags.midwayAlliedPath === "conservative" || flags.centralPacificPath === "assault";
          return {
          date: "SEPTEMBER 1944",
          title: "Deliver It Now, or Not At All",
          historicalRecord: true,
          situation:
            "Marshall has the President's approval for an ultimatum to Chiang: put Stilwell in unrestricted command of every Chinese force in the field, or lose American aid entirely. Stilwell stands ready to deliver it in person and, by every account, is eager to. Patrick Hurley, the President's envoy in Chungking, asks for something different: hold the message a few days, and let him work Chiang toward a version of the same demand that Chiang can survive delivering to his own generals. Chiang agreed in principle to something close to this in August. Whether that agreement holds depends on how the next message arrives.",
          choices: [
            {
              label: "Send Stilwell in immediately, full ultimatum, no softening",
              advisor: { name: "Stilwell", position: "The general has waited two and a half years for Washington to back this move and will not wait for Hurley to make it gentler, so the full ultimatum goes in now." },
              historical: true,
              setFlags: { stilwellUltimatumPath: "immediate" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: divergentPath ? "aDifferentPacific45" : "portChicago44",
              outcome:
                "Stilwell delivers the ultimatum in person on September 19, by most accounts openly satisfied to be doing it. Chiang refuses to accept command handed to an American general at gunpoint and demands Stilwell's recall, aid or no aid. Washington backs down rather than lose China's cooperation, and Stilwell is ordered home on October 19. The command authority the ultimatum was meant to win is never exercised by the man it was written for.",
            },
            {
              label: "Hold the message: let Hurley negotiate a version of the same demand Chiang can survive delivering to his own government",
              advisor: { name: "Hurley", position: "A week should be allowed before the matter becomes a public humiliation neither man can walk back from." },
              setFlags: { stilwellUltimatumPath: "delayed" },
              impact: { readiness: 0, pipeline: 0, initiative: -1 },
              next: "stilwellPreserved44",
              outcome:
                "The message waits. Hurley gets his week, and spends it exactly the way he asked to: working Chiang privately toward language he can present as his own decision rather than an order delivered by the American officer he's already come to resent. Whether that difference in delivery actually changes anything Chiang was ever going to accept isn't something this room can answer yet.",
            },
          ],
        };
        },
        get peleliuDecision44() {
          return {
          date: "SEPTEMBER 1944",
          title: "Halsey's Recommendation",
          historicalRecord: true,
          situation:
            "Carrier strikes against the Palaus and the southern Philippines have shown that Japanese air power there is far weaker than expected, and the airfield threat that the Peleliu landing was meant to remove barely exists. Halsey has sent his chief of staff, Carney, to Nimitz with a blunt recommendation: cancel Operation Stalemate II and use the assigned divisions somewhere the war can use them. The invasion force is already at sea, three days from the beaches.",
          choices: [
            {
              label: "Proceed with the landing as planned: the force is committed, and Peleliu's airfield still matters",
              advisor: { name: "Nimitz", position: "The force is at sea and the plan has gone to Washington, and a carrier pilot's read on the ground defenses is not enough to unwind it on three days' notice." + (flags.yamamotoInterceptPath === "authorize" ? " One call like this has been made on a single read before, on Yamamoto, and it should not be made twice with the odds reversed and less time to think." : flags.yamamotoInterceptPath === "declined" ? " A bet on a single intelligence read was turned down once already, on Yamamoto, and one should not be trusted now because it carries Halsey's name." : "") },
              historical: true,
              setFlags: { peleliuPath: "proceed" },
              impact: { readiness: -3, pipeline: -1, initiative: -1 },
              next: "portChicago44",
              outcome:
                "The 1st Marine Division lands on September 15 into defenses that are dug in, disciplined and nothing like the weakened garrison the air strikes suggested. What staff estimates called a three-day operation runs past two months and costs over 9,500 American casualties against roughly 10,900 Japanese defenders, a price argued over for decades, for an airfield the campaign barely needs.",
            },
            {
              label: "Cancel Stalemate II on Halsey's recommendation: recall the invasion force before it lands",
              advisor: { name: "Halsey", position: "Skipping Peleliu is a recommendation worth sticking a neck out for, and the divisions should go where the war still needs them." },
              setFlags: { peleliuPath: "cancelled", speculativePath: true },
              impact: { readiness: 2, pipeline: 0, initiative: -1 },
              next: "peleliuForcesRedirected44",
              outcome:
                "Speculative. The order goes out with the fleet still three days from the beach. There is no landing, and the Palau garrison of roughly 10,900 men is bypassed and left to wither. What Nimitz's staff does with two freed divisions is decided by the next message.",
            },
            ...(meters.initiative >= 7
              ? [
                  {
                    label: "Take Halsey's full recommendation to Washington, not just Peleliu: push the Joint Chiefs to move Leyte up past even the historical two months",
                    advisor: { name: "MacArthur", position: "Washington already moved Leyte's date up two months on a single carrier pilot's report, and it should be asked to move faster still on the same evidence while the door Halsey found stands open." },
                    setFlags: { peleliuPath: "cancelled", leyteAccelerationPath: "pushedFurther", speculativePath: true },
                    impact: { readiness: -2, pipeline: -2, initiative: 2 },
                    next: "peleliuForcesRedirected44",
                    outcome:
                      "The real acceleration was itself already remarkable: Leyte moved from a tentative December 20th date to October 20th, two full months, on the strength of a single rescued pilot's account of Japanese weakness and Halsey's own aggressive read of unopposed carrier strikes. Pushing further than that runs past what even Washington's actual wartime alacrity was willing to risk on one week's intelligence picture, and the shipping and fire-support studies that complicated the historical acceleration don't resolve themselves just because the argument for speed got louder. Whether the extra weeks bought here matter as much as the two months history already claimed is a considerably smaller question than this room is currently treating it as.",
                  },
                ]
              : []),
          ],
        };
        },
        get peleliuForcesRedirected44() {
          return {
          date: "SEPTEMBER 1944",
          title: "Peleliu's Redirected Divisions",
          historicalRecord: false,
          situation:
            "Speculative. The 1st Marine Division and the Army's 81st Infantry Division, packed and briefed for Peleliu, sit on transports with no landing to make. Nimitz's planners have one candidate for where they would matter most: pulling the Iwo Jima date forward from February 1945. The case is real, and so are the reasons the real timetable waited: naval gunfire ships committed elsewhere, a landing season nobody has war-gamed, and an island whose defenses, unlike Peleliu's, nobody believes are weaker than expected." +
            (flags.leyteAccelerationPath === "pushedFurther"
              ? " The same argument that just pushed Washington past its own historical appetite for accelerating Leyte is sitting in this room already. Whether it's still sound advice the second time it's made in one week, or a momentum this staff has simply stopped questioning, is not a distinction anyone here has fully worked out yet."
              : ""),
          choices: [
            {
              label: "Push for the accelerated Iwo Jima timeline: use the window while it's open",
              advisor: { name: "Spruance", position: "Two divisions with no orders are better spent on an island the Navy knows it needs than left idle while the staff argues about naval gunfire schedules." },
              setFlags: { ironBottomPath: "accelerated" },
              impact: { readiness: -1, pipeline: -2, initiative: 2 },
              uncertain: [
                {
                  weight: modWeight(40, meters.pipeline),
                  title: "The early window holds",
                  setFlags: { ironBottomResult: "success" },
                  impact: { readiness: 1, pipeline: 0, initiative: 2 },
                  outcome:
                    "Speculative. The gamble pays off. Naval gunfire support is reassigned in time, and Iwo Jima's garrison, still finishing the tunnel network that made the real February assault so costly, has not finished it. The landing comes months earlier and is much cheaper than the real one.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.pipeline); return Math.max(5, 100 - w); })(),
                  title: "The acceleration costs what the caution was actually protecting against",
                  setFlags: { ironBottomResult: "costly" },
                  impact: { readiness: -3, pipeline: -2, initiative: -1 },
                  outcome:
                    "Speculative. The reasons the real timetable waited were real. Naval gunfire support is thinner than the plan needed, and a landing against defenses nobody has reconnoitered costs close to what the real assault did, months earlier and with less preparation. The freed divisions are spent regardless.",
                },
              ],
              next: "portChicago44",
              outcome:
                "Speculative. Two divisions with no orders, an island everyone knew would need taking, and a window nobody is sure is as open as it looks from a transport deck.",
            },
            {
              label: "Hold the divisions in theater reserve instead: don't spend an opportunity on an unplanned assault",
              advisor: { name: "Nimitz", position: "An accelerated landing nobody has properly planned is how the mistake just avoided at Peleliu happens again, so the divisions should be held in theater reserve." },
              historical: false,
              setFlags: { ironBottomPath: "held" },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "portChicago44",
              outcome:
                "Speculative. Two divisions are held in reserve instead of committed to a landing that has not been planned. Whether that saves men who would have been spent on a rushed assault, or only delays a fight that was always coming, is not something divisions sitting on transports can answer.",
            },
          ],
        };
        },
        get stilwellPreserved44() {
          return dataNode(ALLIED_PACIFIC_DATA, "stilwellPreserved44", meters);
        },
        get chinaCrisisAllied44() {
          const divergentPath = flags.arcadiaPath === "pacificParity" || flags.midwayAlliedPath === "conservative" || flags.centralPacificPath === "assault";
          return {
          date: "1944",
          title: "Two Fronts, One Air Bridge",
          historicalRecord: true,
          situation:
            ("Ichi-Go's offensive is overrunning the Fourteenth Air Force's forward airbases faster than Chennault's command can evacuate them, and Chiang's Nationalist divisions, chronically under-supplied, chronically riven by the rivalry between Chiang and Stilwell that's about to cost Stilwell his command entirely, are giving ground across southern China. In the north, Communist forces under Mao have spent the war largely intact, fighting a guerrilla campaign against Japanese occupation that American observers newly arrived at Yan'an report is considerably more effective than anything the Nationalist front is currently managing." +
            (divergentPath
              ? " None of that changes for how the naval war went: China's crisis runs on Chennault's airbases and Chiang's divisions, not on which islands the fleet has taken."
              : "") +
            (flags.pacificFirstPath === "press"
              ? " The decision to press the Pacific advantage and spend the resourcing edge while it lasted means this air bridge is competing for airlift capacity against island campaigns that, right now, have Washington's fuller attention."
              : flags.pacificFirstPath === "bank"
              ? " The decision to bank the Pacific advantage rather than press it has, if nothing else, left more of the theater's attention actually available for a crisis in China that needed it."
              : "") +
            (flags.philippineSeaAlliedResult === "caughtFleet"
              ? " The fleet arrives in this crisis fresh off catching the Japanese carrier force at the Philippine Sea before it could strike first, a recent win that leaves more of Washington's attention available for China than a harder Pacific fight would have."
              : flags.philippineSeaAlliedResult === "missedFleet"
              ? " The fleet arrives in this crisis having let the Japanese carrier force slip away at the Philippine Sea rather than catching it outright, an unfinished piece of business that's competing for the same attention this China crisis is asking for."
              : "") +
            (flags.fsAlliedResult === "costlyWin"
              ? " This theater is still absorbing the cost of a hard-fought, long-odds win over an undamaged Japanese carrier fleet at FS, a victory but not a cheap one, and China's own crisis is landing on a Pacific command that has less spare capacity than the historical 1944 war ever had to work with at this point."
              : flags.fsAlliedResult === "forcedWithdrawal"
              ? " This theater is still recovering from a forced withdrawal against an undamaged Japanese carrier fleet at FS, and China's own crisis is landing on a Pacific command working from a materially weaker position than the historical 1944 war ever had to answer from."
              : "")) + (flags.philippineSeaAlliedPath === "pursue" ? keyBattleEcho("philippineSea44", flags) : ""),
          choices: [
            {
              label: "Maintain support solely to Chiang's Nationalist government: hold the alliance's official line even as Ichi-Go costs airbases",
              advisor: { name: "Stilwell", position: "Chiang hoards American equipment for a civil war he expects to fight after this one, and he is backed because Washington says so and not because it is the choice that stops Ichi-Go." },
              historical: true,
              setFlags: { chinaPath: "nationalistOnly", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: -2, pipeline: -2, initiative: -1 },
              next: "stilwellUltimatum44",
              outcome:
                "What happened, broadly, up to this point. Support stays channeled through Chiang's government even as Ichi-Go overruns the airbases it was meant to protect, and the Stilwell-Chiang relationship, already poisonous, is about to reach the moment that actually breaks it.",
            },
            {
              label: "Open a channel of material support to Communist forces in the north as a hedge against Chiang's weakening position",
              advisor: { name: "Davies", position: "The Yan'an observer reports show Mao's forces fighting the occupation harder and more effectively than Chungking's, and not arming them has more to do with Chiang's politics than with beating Japan." },
              setFlags: { chinaPath: "communistCooperation", cohesion: (flags.cohesion || 0) - 2 },
              impact: { readiness: 1, pipeline: 1, initiative: -3 },
              next: divergentPath ? "aDifferentPacific45" : "portChicago44",
              uncertain: [
                {
                  weight: modWeight(40, meters.readiness),
                  title: "The support blunts Ichi-Go's advance",
                  setFlags: { chinaCrisisResult: "blunted" },
                  impact: { readiness: 1, pipeline: 0, initiative: 1 },
                  outcome:
                    "Speculative. Davies's case holds. Support reaching Communist forces in the north puts pressure on the supply lines feeding Ichi-Go, enough to slow the offensive and not to stop it. Whether that was worth the cost to the alliance with Chiang's government is another question. On the narrow military point, it did what its advocates said.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The support arrives too late and too thin",
                  setFlags: { chinaCrisisResult: "tooLittle" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome. Whatever reaches Yan'an arrives too late and too thin to change an offensive of that size, and still costs what it costs with Chiang's government. Ichi-Go succeeds regardless, and arming Chiang's rivals buys less than its advocates hoped.",
                },
              ],
              outcome:
                "A modeled alternative. The Dixie Mission's observers at Yan'an made close to this case in 1944, and it was never adopted at any scale, for reasons that had as much to do with the alliance's postwar politics as with the war. Whether material support would have blunted Ichi-Go, or arrived too late and too thin against an offensive of some 500,000 men, is disputed. It would have changed the balance of the Chinese civil war that ended in 1949.",
            },
          ],
        };
        },
        get portChicago44() {
          return {
          date: "AUGUST 1944",
          title: "Port Chicago: The Order Back to the Pier",
          historicalRecord: true,
          situation:
            "Three weeks ago, on the night of July 17, two ammunition ships being loaded at the Port Chicago Naval Magazine outside San Francisco exploded, killing 320 sailors and civilians and injuring 390. Most of the dead, 202, were Black enlisted men. The Navy's segregated personnel policy assigned Black sailors to loading ammunition, with no specialized training, no hazard pay, and white officers who timed the loading crews against each other for speed. The Bureau of Ordnance's investigation found no fault with procedures. The order now before the command is to return the surviving sailors, transferred to Mare Island, to loading ammunition under the same conditions: the same untrained crews, the same competitive timing, and no safety change.",
          choices: [
            {
              label: "Issue the order as planned: identical conditions, no changes, return to loading immediately",
              advisor: { name: "Bureau of Ordnance", position: "The investigation found no fault in procedure, and there is no operational basis for a delay the war effort cannot afford." },
              historical: true,
              setFlags: { portChicagoPath: "orderedBack" },
              impact: { readiness: 0, pipeline: 0, initiative: 0 },
              next: "philippinesFormosaAllied44",
              outcome:
                "What happened. On August 9, 258 sailors refuse the order. Under threat of a mutiny charge, 208 relent and are tried in summary courts-martial for disobeying orders. Fifty hold out and are charged with mutiny, a capital offense in wartime. Their trial, watched by NAACP counsel Thurgood Marshall, ends in October with all fifty convicted and sentenced to eight to fifteen years of hard labor. The order treated their refusal to return to the conditions that killed their shipmates as a crime, and not as evidence that the conditions needed to change.",
            },
            {
              label: "Halt loading operations fleet-wide pending an actual safety and training review before ordering anyone back",
              advisor: { name: "Nimitz", position: "It is better to explain a delay in ammunition flow than a command that answered 320 dead sailors by changing nothing and prosecuting the survivors for noticing." },
              setFlags: { portChicagoPath: "reviewFirst" },
              impact: { readiness: 0, pipeline: -3, initiative: -1 },
              next: "philippinesFormosaAllied44",
              uncertain: [
                {
                  weight: modWeight(45, meters.readiness),
                  title: "The review produces real, implemented change before crews return",
                  setFlags: { portChicagoResult: "reformHeld" },
                  impact: { readiness: 1, pipeline: -1, initiative: 0 },
                  outcome:
                    "Speculative. The review that never happened in the real war gets a hearing: proper training, hazard pay, integrated crews, and loading rates no longer timed as a contest between divisions. It costs weeks of ammunition flow at a moment the war can least spare them, and the fifty men whose refusal became a mutiny trial never have to make it, because the order is not issued in its original form.",
                },
                {
                  weight: (() => { const w = modWeight(45, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The Bureau of Ordnance's own institutional resistance stalls the review into something closer to the original order",
                  setFlags: { portChicagoResult: "reformStalled" },
                  impact: { readiness: -1, pipeline: -2, initiative: -1 },
                  outcome:
                    "Speculative. The real Bureau of Ordnance investigation found no fault in procedure, and an order to review does not by itself overcome an institution that had already concluded that nothing needed changing. The review runs long and produces modest changes, mostly in training, and none of the integration or hazard-pay questions the sailors raised. The delay buys less than it was meant to.",
                },
              ],
              outcome:
                "A modeled alternative that treats the explosion as the evidence requiring a response. It costs weeks of ammunition flow that the Pacific war has little slack to absorb, and it avoids a mutiny trial of fifty men whose crime, in the real record, was refusing to return to the conditions that had just killed 320 of their own.",
            },
          ],
        };
        },
        get philippinesFormosaAllied44() {
          return {
          date: "LATE 1944",
          title: "Return to the Philippines, or Bypass for Formosa",
          historicalRecord: true,
          situation:
            "The debate that reaches Roosevelt directly at Honolulu: MacArthur, who left the Philippines in 1942 promising to return, argues the moral and strategic case for liberating them outright. King and the Navy staff favor Operation Causeway, bypassing the Philippines for Formosa, closer to Japan and, in their assessment, a better base for the final approach. The decision here effectively sets the shape of the war's last year." +
            (flags.corregidorPath === "remained"
              ? " There is no promise to redeem this time. MacArthur never left Corregidor to make one, and whatever became of him after the garrison's fall, this argument has to be won or lost on Causeway's own strategic merits alone, without the moral weight of a broken pledge sitting on the scale."
              : flags.eichelbergerPath === "reconsider"
              ? " The argument already happened once, quietly, when Eichelberger inherited this command: reconsidered on military merits alone rather than a public pledge, and the debate that follows here carries less of the personal weight MacArthur himself would have brought to it, win or lose."
              : flags.eichelbergerPath === "honorPledge"
              ? " Eichelberger already committed this command to finishing what MacArthur started, before MacArthur himself was ever in a position to argue for it again here. The pledge survives the man who made it, even without him in the room to defend it."
              : "") +
            (flags.ironBottomPath === "held"
              ? " The two divisions freed by Peleliu's cancellation sat this one out, held in reserve rather than spent on an unplanned Iwo Jima assault, which means whatever Honolulu decides here about the Philippines or Formosa, it decides with two full divisions still uncommitted and available for whichever answer this room reaches."
              : flags.ironBottomPath === "accelerated" && flags.ironBottomResult === "success"
              ? " Iwo Jima is already done, taken early and at real cost savings by the divisions freed from Peleliu, one fewer island this debate has to account for when it weighs what the Philippines-or-Formosa choice will cost against everything still ahead."
              : flags.ironBottomPath === "accelerated" && flags.ironBottomResult === "costly"
              ? " Iwo Jima is already done, but not cheaply: the accelerated assault cost close to what the historical timetable would have anyway, and this debate inherits a theater with less spare capacity than it would have had if that gamble had paid off."
              : "") +
            (flags.chinaCrisisResult === "blunted"
              ? " Whatever Honolulu decides about the Philippines or Formosa, it decides it with China's own crisis at least partly contained: the material support that reached Communist forces during Ichi-Go's advance slowed it, one fewer open front competing for the attention this debate needs."
              : flags.chinaCrisisResult === "tooLittle"
              ? " Whatever Honolulu decides about the Philippines or Formosa, it decides it with China's own crisis still fully open: the material support sent north during Ichi-Go's advance arrived too late and too thin to change its trajectory, one more unresolved front this debate has to weigh against everything else."
              : ""),
          choices: [
            {
              label: "Liberate the Philippines: Leyte, then Luzon",
              advisor: flags.corregidorPath === "remained"
                ? { name: "Eichelberger", position: "Quezon never got the chance to say it himself, so the argument he would have made is made for him: staying cost him, and it should not have cost nothing." }
                : { name: "MacArthur", position: "The promise to return was not a strategic argument when it was made, and it is not only a strategic argument now." },
              historical: true,
              setFlags: { philippinesPath: "liberate", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: -2, pipeline: 1, initiative: 1 },
              disabledReason: meters.readiness <= -4 ? "Too few combat-ready divisions remain for a full Leyte-to-Luzon campaign. A smaller, faster objective is what this force can sustain." : undefined,
              gateCheck: { meter: "readiness", threshold: -4, label: "Readiness" },
              next: "quezonsSuccessor44",
              outcome:
                "The Leyte landing draws the Imperial Navy's remaining surface strength into the largest naval battle of the war, which the Americans win even after Kurita's battleships break through to the invasion beaches and then withdraw. Luzon's liberation runs through the month-long battle for Manila, the most destructive urban fighting of the Pacific War. Yamashita ordered the city abandoned. Rear Admiral Sanji Iwabuchi, commanding the naval garrison, refused and fought on. The civilian dead are estimated at no fewer than 100,000, some of them killed by American artillery once fire restrictions were lifted and many by systematic killing by Japanese forces as the city fell. Manila gives the final approach to Japan its forward air bases, and the postwar tribunals later weigh how much responsibility a general bears for atrocities committed by a subordinate who disobeyed his order to withdraw.",
            },
            {
              label: "Bypass the Philippines: seize Formosa instead",
              advisor: { name: "King", position: "Formosa brings the fleet closer to Japan with fewer Japanese troops in the way, and MacArthur's promise to the Philippines is not a war-winning consideration." },
              setFlags: { philippinesPath: "bypassFormosa", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: -4, pipeline: 0, initiative: 4 },
              next: "halseyTyphoon44",
              outcome:
                "A modeled alternative that the Joint Chiefs seriously considered and set aside, partly on the logistics of supporting a Formosa landing without Philippine bases, partly on the political and moral weight of MacArthur's argument. The route is shorter and the fighting harder, against a more concentrated defense, and Philippine civilians stay under occupation for the last year of the war.",
            },
          ],
        };
        },
        get quezonsSuccessor44() {
          return {
          date: "OCTOBER 1944",
          title: "A President Who Didn't Live to See the Beach",
          historicalRecord: true,
          situation:
            "President Manuel Quezon, who led the Philippine government in exile from Washington, died of tuberculosis on August 1, weeks before the Leyte landing he had spent years pressing for. Sergio Osmeña, his vice president, is the one who wades ashore beside MacArthur, in an image the newsreels will use for the rest of the war. Quezon's position, pressed on Washington for years, was independence on the existing 1946 schedule with no reduction in American commitment. What Osmeña asks for now is open.",
          choices: [
            {
              label: "Confirm the existing 1946 independence timeline unchanged: no acceleration, no extended conditions",
              advisor: { name: "Osmeña", position: "President Quezon fought for the 1946 date for years before the war, and his death is no reason to ask for something he never asked for himself." },
              historical: true,
              setFlags: { philippineIndependencePath: "unchanged" },
              impact: { readiness: 0, pipeline: 0, initiative: 1 },
              next: "halseyTyphoon44",
              outcome:
                "The Tydings-McDuffie timetable holds as set a decade earlier, and the Philippines become independent on July 4, 1946. What is negotiated alongside it stays contentious: in the real war the Military Bases Agreement of 1947 gave the United States Clark Field, Subic Bay and other installations on terms disputed for decades, and this decision does not resolve that, only declines to complicate it with a changed date.",
            },
            {
              label: "Press for extensive, long-term American basing rights as the price of continued full support through liberation",
              advisor: { name: "MacArthur", position: "The theater will need permanent forward bases after the war, and it is better to negotiate for them now, when the alliance needs both sides, than to beg for them later." },
              setFlags: { philippineIndependencePath: "basingRights", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: 1, pipeline: 1, initiative: -1 },
              next: "halseyTyphoon44",
              outcome:
                "A modeled alternative: a harder bargain than Quezon ever pushed for, using the urgency of the liberation campaign as leverage while Manila is still occupied. It gets Washington more durable and more explicitly negotiated access than the 1947 agreement provided, at a cost in Filipino goodwill, since independence with strings attached reads differently from independence granted cleanly.",
            },
          ],
        };
        },
        get aDifferentPacific45() {
          // Three genuinely different earlier divergences can trigger this node, and they
          // deserve genuinely different content, not one blob hedged across all three. This
          // was previously a single generic node ("whichever/however this path went") that
          // read as vague because it was vague — reworked to actually check which divergence
          // happened and write concretely to that one. Priority order reflects real narrative
          // weight: an intact Japanese carrier fleet is a bigger deal than a resourcing shift.
          const midwayDeclined = flags.midwayAlliedPath === "conservative";
          const assaultDoctrine = !midwayDeclined && flags.centralPacificPath === "assault";
          const arcadiaParity = !midwayDeclined && !assaultDoctrine && flags.arcadiaPath === "pacificParity";
          // What the 1944 Marianas sizing-gap decision (philippineSeaAllied44) actually
          // resolved, if anything: maxCaution left the gap open, reconFirst/splitRecon
          // got a real count either way, and aggressiveTrust's gamble stands in for a
          // count nobody actually took. This node used to re-ask the identical "trust
          // the gap closed or don't" question a year later as if 1944 never happened —
          // now it checks what's already known and writes to that instead.
          const marianasLarger = flags.carrierEstimateTrust === "confirmedLarger" || flags.philippineSeaAlliedResult === "gambleFailed" || !!flags.carrierThreatConfirmedEarly;
          const marianasSmaller = flags.carrierEstimateTrust === "confirmedSmaller" || flags.philippineSeaAlliedResult === "gambleHeld";
          return {
          date: "1945",
          title: midwayDeclined
            ? "The Carriers That Didn't Sink"
            : assaultDoctrine
            ? "The Bill for Every Island"
            : "The Extra Tonnage",
          historicalRecord: false,
          situation: (midwayDeclined
            ? "Declining the Midway ambush in 1942 meant Japan's four fleet carriers, Akagi, Kaga, Soryu, and Hiryu, sailed home undefeated instead of burning at the bottom of the Pacific. Three years of attrition across the Solomons and the Central Pacific have worn that force down since, but Downfall's own naval-threat assumptions were built around a Combined Fleet carrier arm that, historically, simply didn't exist anymore by 1945." +
              (marianasLarger
                ? " The one hard data point available, gathered at real cost off the Marianas a year ago, confirmed the larger, more dangerous end of that range. A single reading a year old doesn't guarantee the fleet hasn't changed further since, but Nimitz's staff isn't starting this decision blind."
                : marianasSmaller
                ? " The one hard data point available, gathered off the Marianas a year ago, pointed toward the smaller end of that range, closer to the historical fleet's own worn-down condition than the worst fears going in. A year is still a year, and nothing about that reading is guaranteed to still hold."
                : " Nothing has narrowed that estimate since: the covering force held close at the Marianas rather than risk finding out, and the same open question fleet intelligence walked into that battle with is still open now.") +
              " Nimitz's staff has to decide whether to trust that three more years of losses closed the gap, or plan the invasion screen as if it didn't."
            : assaultDoctrine
            ? "Three years of reducing the Gilberts, Marshalls, and Marianas strongpoint by strongpoint instead of bypassing them has put a real, higher casualty count into American newspapers every few months since Tarawa, a steady public exposure to the war's cost the historical leapfrogging campaign mostly spared. What isn't clear from here is which way that cuts: whether a public already accustomed to costly island fighting has more patience left for Downfall's own casualty estimate, or less."
            : "Speculative. King won the argument at Arcadia for near-parity Pacific resourcing, and three years of a better-supplied Pacific Fleet than the real one have followed, taken from a production system that never changed its priorities on paper. By 1945 the advantage is real. Whether it is enough to change how the war ends, or only to fight a bigger war to the same end, is what the Joint Chiefs have to decide.") +
            (flags.chinaCrisisResult === "blunted"
              ? " China's own front, at least, isn't a drag on this year's planning: the material support that reached Communist forces during Ichi-Go's advance slowed it, one theater the Joint Chiefs don't have to spend fresh attention rescuing while they work through everything else 1945 is asking of them."
              : flags.chinaCrisisResult === "tooLittle"
              ? " China's own front is still a drag on this year's planning: the material support sent north during Ichi-Go's advance arrived too late and too thin to change its trajectory, one more open account the Joint Chiefs are carrying into 1945 alongside everything else."
              : ""),
          choices: midwayDeclined
            ? [
                {
                  label: "Assume the surviving Combined Fleet still poses a surface threat: commit additional escort and air cover to Downfall's invasion screen",
                  advisor: { name: "Spruance", position: "The invasion should not be planned around a carrier force of unknown size, and if Akagi and Kaga are still out there in any strength the screen should be built for that." },
                  setFlags: { carrierThreatPath: "screened" },
                  impact: { readiness: 1, pipeline: -2, initiative: -1 },
                  next: "aDifferentPacificFinalWord45",
                  outcome:
                    "Escort carriers and fighter cover pulled from elsewhere in the Pacific to cover a threat nobody can fully confirm is still there, at a direct cost to the naval war that matters everywhere else. Whether the four carriers that survived 1942 amount to anything by 1945, after three more years of attrition, fuel shortage, and pilot losses the historical Combined Fleet suffered just as badly, is a question this screen answers with resources rather than with confidence either way." +
                    (marianasLarger
                      ? " The Marianas reading argued for exactly this kind of hedge, and this screen is Nimitz's staff finally acting on evidence they already had a year to sit with."
                      : marianasSmaller
                      ? " The Marianas reading actually argued the opposite, that the gap had likely closed, and this screen spends real resources hedging against a threat the best available evidence a year ago already leaned against."
                      : ""),
                },
                {
                  label: "Trust that three years of attrition closed the gap regardless: proceed on the historical naval-threat assumption",
                  advisor: { name: "Nimitz", position: "Four carriers that survived one morning in 1942 are not the same four three years and a fuel crisis later, and the older assumption about their strength should still hold, because everything else about the fleet's condition says it should." },
                  historical: false,
                  setFlags: { carrierThreatPath: "trusted" },
                  impact: { readiness: -1, pipeline: 1, initiative: 1 },
                  next: "aDifferentPacificFinalWord45",
                  uncertain: [
                    {
                      weight: modWeight(marianasLarger ? 15 : marianasSmaller ? 80 : 55, meters.initiative),
                      title: "The bet holds: the surviving carriers really have been ground down close to the historical fleet's own condition",
                      setFlags: { trustedBetResult: "held" },
                      impact: { readiness: 1, pipeline: 0, initiative: 1 },
                      outcome:
                        "The bet pays off. Whatever four extra hulls theoretically preserved, the same fuel shortages, the same thinned training pipeline, and the same production gap that gutted the historical Combined Fleet gut this one too, closely enough that trusting three years of general attrition over a specific count turns out to have been the right call.",
                    },
                    {
                      weight: (() => { const w = modWeight(marianasLarger ? 15 : marianasSmaller ? 80 : 55, meters.initiative); return Math.max(5, 100 - w); })(),
                      title: "The bet fails: the fleet is more dangerous than the assumption allowed for",
                      setFlags: { trustedBetResult: "failed" },
                      impact: { readiness: -3, pipeline: -1, initiative: -2 },
                      outcome:
                        "The bet doesn't pay off. The surviving carriers, whatever their exact condition, prove more dangerous than a general argument about fuel shortages and training pipelines was ever equipped to predict on its own, and Downfall's invasion screen goes forward built around an assumption the fleet itself didn't actually meet.",
                    },
                  ],
                  outcome:
                    "A bet that the war's broader arithmetic, fuel shortages, pilot attrition, a production gap neither side's operational choices in the Pacific ever closed, mattered more to the Combined Fleet's real 1945 condition than one battle's outcome three years earlier. Probably a safe bet. Not a confirmed one, since nothing about a fleet that was never sunk gets the kind of after-action accounting a fleet that was actually destroyed at Midway would have generated." +
                    (marianasSmaller
                      ? " The Marianas reading backs this bet up with something more than the war's general arithmetic: a count a year old, pointing the same direction this assumption does."
                      : marianasLarger
                      ? " The Marianas reading argued directly against this bet: a count a year old that found the larger, more dangerous fleet this assumption is choosing not to plan around."
                      : ""),
                },
              ]
            : assaultDoctrine
            ? [
                {
                  label: "Argue the public's demonstrated tolerance for costly island fighting means Downfall's estimate is politically survivable",
                  advisor: { name: "Marshall", position: "Three years of Pacific casualty lists have not broken public support, and Downfall's number, however large, is not the number that breaks that pattern." },
                  setFlags: { publicTolerancePath: "survivable" },
                  impact: { readiness: 0, pipeline: 0, initiative: 2 },
                  next: "aDifferentPacificFinalWord45",
                  outcome:
                    "An argument built on a pattern, three years of costly direct assaults absorbed without the public support for the war meaningfully cracking, extended to cover an invasion whose projected cost dwarfs anything Tarawa or Peleliu asked for individually. Whether steady exposure to a high but survivable cost actually predicts tolerance for one enormous number, or whether Downfall's scale is a different kind of ask entirely, is the gamble this argument makes.",
                },
                {
                  label: "Argue the opposite: three years of high casualties has used up whatever patience existed, and Downfall needs a lower-cost alternative",
                  advisor: { name: "Nimitz", position: "Three years of high casualties have been absorbed without complaint, which does not mean there is infinite patience left, and a blockade is a better test of it than an invasion." },
                  setFlags: { publicTolerancePath: "exhausted" },
                  impact: { readiness: 1, pipeline: -1, initiative: -2 },
                  next: "aDifferentPacificFinalWord45",
                  outcome:
                    "The more cautious reading of the same three years: a public that has kept supporting a costly war isn't proof it will support a costlier one, only proof it hasn't been asked to yet. This argument pushes planning toward blockade and starvation instead of direct invasion, betting that a strongpoint-by-strongpoint doctrine that already cost more than history's leapfrogging campaign has already spent whatever margin existed for Downfall's own number.",
                },
              ]
            : [
                {
                  label: "Press the accumulated resourcing advantage into an accelerated Downfall timeline",
                  advisor: { name: "King", position: "The resourcing was asked for at Arcadia so that the fleet would have more to work with when it mattered most, and it matters most now." },
                  setFlags: { resourcingUsePath: "accelerate" },
                  impact: { readiness: 1, pipeline: -1, initiative: 2 },
                  next: "aDifferentPacificFinalWord45",
                  outcome:
                    "Speculative. King's resourcing argument, kept up for three years, is cashed in on the decision it was always aimed at: a larger invasion force, assembled faster than the real Pacific Fleet could have managed, on the bet that three years of extra production add up to real time saved at the most expensive moment of the war.",
                },
                {
                  label: "Treat the extra resourcing as a bigger war fought at the same pace, not a faster one: proceed on the historical timeline",
                  advisor: { name: "Marshall", position: "More ships and material bought a larger margin and not a shorter war, and Downfall's timetable should not be bet on the two being the same." },
                  historical: false,
                  setFlags: { resourcingUsePath: "unchanged" },
                  impact: { readiness: 0, pipeline: 1, initiative: -1 },
                  next: "aDifferentPacificFinalWord45",
                  outcome:
                    "Speculative. A bigger, better supplied fleet proceeds on essentially the real schedule, because more material is not the same as a different war. The advantage is not wasted. It is banked as a margin for error the real fleet never had, and not spent on speed.",
                },
              ],
        };
        },
        get aDifferentPacificFinalWord45() {
          const midwayDeclined = flags.midwayAlliedPath === "conservative";
          const assaultDoctrine = !midwayDeclined && flags.centralPacificPath === "assault";
          const marianasLarger = flags.carrierEstimateTrust === "confirmedLarger" || flags.philippineSeaAlliedResult === "gambleFailed" || !!flags.carrierThreatConfirmedEarly;
          const marianasSmaller = flags.carrierEstimateTrust === "confirmedSmaller" || flags.philippineSeaAlliedResult === "gambleHeld";
          return {
          date: "1945",
          title: "The Different Road's Price",
          historicalRecord: false,
          situation: midwayDeclined
            ? "The bomb, the Soviet declaration, and Japan's cabinet deadlock land within the historical window regardless of what happened to four carriers three years and a different battle ago: those forces were never contingent on the Combined Fleet's fate at Midway. What's provably different is everything that happened in between, an Imperial Navy that stayed a diminishing but real factor through 1943 and 1944 in a way the historical record never had to account for, and a Pacific Fleet that spent real resources over three years managing a threat that, in the historical timeline, simply wasn't there to manage." +
              (flags.carrierThreatPath === "screened"
                ? " Real escort carriers and fighter cover went to that management for three years, resources the historical fleet never had to spend covering a threat that, historically, sank at Midway."
                : flags.carrierThreatPath === "trusted"
                ? (flags.trustedBetResult === "held"
                    ? " The bet that attrition alone would neutralize the surviving carriers regardless of the historical assumption held, freeing resources the more cautious path would have spent watching a threat that, in the end, mattered as little as the trust in it assumed."
                    : flags.trustedBetResult === "failed"
                    ? " The bet that attrition alone would neutralize the surviving carriers regardless of the historical assumption didn't hold: the fleet proved more dangerous than a general argument about fuel shortages and training pipelines was ever equipped to predict, and Downfall's invasion screen went forward built around an assumption the fleet itself didn't actually meet."
                    : "")
                : "") +
              (marianasLarger
                ? " The record on the fleet's actual condition isn't a blank, either: a confirmed reading off the Marianas in 1944 found the larger, more dangerous end of the range this whole account has been arguing about."
                : marianasSmaller
                ? " The record on the fleet's actual condition isn't a blank, either: a confirmed reading off the Marianas in 1944 found the smaller end of the range, closer to the historical fleet's own worn-down state than the divergence's worst case."
                : " The record on the fleet's actual condition stayed a blank the entire way through: the Marianas covering force never risked finding out in 1944, and nothing since has closed that gap either.")
            : assaultDoctrine
            ? "The bomb, the Soviet declaration, and Japan's cabinet deadlock still show up close to schedule no matter how many Marines and soldiers a strongpoint-by-strongpoint doctrine cost getting here. What's provably different is the casualty count already spent before Downfall's own estimate ever gets added to it, a toll the historical leapfrogging campaign never asked American families to pay in the same way." +
              (flags.publicTolerancePath === "survivable"
                ? " The argument that a public already hardened to a high toll could absorb Downfall's own number is the one Washington actually chose to make, betting three years of steady exposure predicted something it may not have."
                : flags.publicTolerancePath === "exhausted"
                ? " Washington chose the more cautious reading instead, treating three years of high casualties as proof of exhaustion rather than tolerance, and planned toward blockade rather than invasion on that basis."
                : "")
            : "Speculative. The bomb, the Soviet declaration and the deadlock in Japan's cabinet do not move because of how the Pacific Fleet was resourced. What is different is the fleet, and the price the European theater paid in production priority for three years so that this fleet could be larger than the real one, without the broad ending of the war depending on it." +
              (flags.resourcingUsePath === "accelerate"
                ? " King's own resourcing argument from Arcadia got spent, in the end, on trying to buy real time at the war's most expensive remaining moment, not just on a larger margin for error."
                : flags.resourcingUsePath === "unchanged"
                ? " The accumulated advantage went unspent on speed, banked instead as a margin for error the historical fleet never had, proceeding on essentially the historical timetable regardless."
                : ""),
          choices: [
            {
              label: "Put a documented comparison on the record: state plainly how this fleet's own toll measures against the war's real historical cost",
              advisor: { name: "King", position: "The war's cost in the Pacific theater was well over a hundred thousand American dead, and what this fleet's divergence added or spared should be on the record where others can read it." },
              setFlags: { differentPacificFinalPath: "acceptTrade" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "END",
              outcome: midwayDeclined
                ? "The documented total for this theater, a little over 111,000 American dead, is the real number this fleet's own account now sits beside on the record rather than apart from it. Three additional years of an Imperial Navy the historical record never had to account for meant three additional years of resources spent managing it, a real, countable addition to that total rather than a rounding error, even if the war's broad shape and its final year land almost exactly where the historical record says they should."
                : assaultDoctrine
                ? "The documented total for this theater, a little over 111,000 American dead, is the real number a strongpoint-by-strongpoint doctrine's own higher toll now sits beside on the record rather than apart from it. The historical leapfrogging campaign bypassed exactly the kind of costly direct assaults this path chose to fight instead, and the difference between those two approaches is a real, countable addition to the documented total, not a rounding error, even where the war's broad shape and its final year land almost exactly on schedule regardless."
                : "Speculative. This fleet's account is set beside the documented toll of the theater, more than a hundred thousand American dead. Whatever three years of King's resourcing bought in size and readiness was bought at a countable cost to the European theater's production priorities, now weighed openly and not left as something only this command knows.",
            },
            {
              label: "Decline to reduce it to a single number: state plainly that an honest accounting of this fleet's own divergence isn't the same thing as a precise one",
              advisor: { name: "Nimitz", position: "The postwar casualty accounting had real disputes between good sources that never fully reconciled, and this command's own count should not be given more confidence than the official record could claim." },
              setFlags: { differentPacificFinalPath: "acceptUncertainty" },
              impact: { readiness: -1, pipeline: 1, initiative: 0 },
              next: "END",
              outcome:
                "Speculative. The official postwar casualty counts have categories of missing, captured and declared-dead that never fully reconciled, and good sources that differ. Giving this fleet's rougher internal count a precision that the official record cannot claim would be the real dishonesty. What the divergence changed about the fleet and the war's cost stays real whether or not it is reduced to a number this command cannot defend to the last digit.",
            },
          ],
        };
        },
        get halseyTyphoon44() {
          return {
          date: "DECEMBER 1944",
          title: "Typhoon Cobra",
          historicalRecord: true,
          situation:
            "Halsey's Third Fleet, refueling destroyers at sea to support the Luzon landings, sails into a typhoon whose position his staff misjudged, against warnings from ships in company that read the weather correctly and said so. Three destroyers, Hull, Monaghan and Spence, capsize and sink on December 18. Nearly 800 sailors are dead, more than some naval battles cost, and a court of inquiry convenes to decide whether this was unavoidable weather or a command failure with a name attached.",
          choices: [
            {
              label: "Find questionable judgment but retain Halsey in command: his record and standing outweigh one weather error",
              advisor: { name: "Nimitz", position: "The court's findings have been read in full, and the officer who commanded at Leyte Gulf and in the Solomons should not be relieved over a typhoon his staff misjudged, when several other flag officers could have made the same mistake." },
              historical: true,
              setFlags: { halseyTyphoonPath: "retained" },
              impact: { readiness: 0, pipeline: -1, initiative: 0 },
              next: "burmaReconquest45",
              outcome:
                "The court of inquiry finds that Halsey exercised questionable judgment and recommends no punishment. He keeps command of the fleet and, six months later, takes it into a second typhoon in similar circumstances, with smaller losses. His record bought him a second chance that the court's findings did not clearly justify.",
            },
            {
              label: "Relieve Halsey of fleet command: the court's findings on judgment stand regardless of reputation",
              advisor: { name: "King", position: "Relieving Halsey costs the fleet in morale and costs King personally in a fight with the newspapers, and seven hundred and ninety dead sailors deserve a judgment that does not bend around a famous name." + (flags.macArthurTensionPath === "relieved" ? " A more famous name was relieved once already this year." : "") },
              setFlags: { halseyTyphoonPath: "relieved", cohesion: (flags.cohesion || 0) - 1, speculativePath: true },
              impact: { readiness: -1, pipeline: 0, initiative: -2 },
              next: "halseyAftermath44",
              outcome:
                "A modeled alternative that the court's findings could have supported and did not recommend. Halsey's public standing, built on real victories in the Solomons and at Leyte Gulf, made relieving him costly, and the fleet loses a commander whose aggression also produced results.",
            },
          ],
        };
        },
        get halseyAftermath44() {
          return {
          date: "1945",
          title: "One Command, Not Two",
          historicalRecord: false,
          situation:
            "Speculative. The real Pacific Fleet ran on an unusual system: the same ships were called Third Fleet under Halsey and Fifth Fleet under Spruance, depending on who held command, so that one staff could plan the next operation while the other carried out the current one. With Halsey relieved, there is no second commander to alternate with, and Spruance, methodical where Halsey was aggressive, inherits sole command of the fast carrier fleet for the last stretch of the war.",
          choices: [
            {
              label: "Keep Spruance's cautious doctrine as the fleet's only operating style for the rest of the war",
              advisor: { name: "Spruance", position: flags.philippineSeaAlliedPath === "protect" ? "Caution is not something to apologize for twice in one war, and the same call made at the Philippine Sea would be made again." : flags.philippineSeaAlliedPath === "splitForce" ? "At the Philippine Sea there was no need to choose between caution and aggression because there was the strength to do both, and that kind of choice is better than a permanent doctrine picked because, once, none was needed." : "What the other choice costs when it goes wrong is not something to guess at, and it is not worth finding out a second time." },
              setFlags: { halseyAftermathPath: "singleDoctrine" },
              impact: { readiness: 2, pipeline: 0, initiative: -2 },
              next: flags.philippinesPath === "liberate" ? "cabanatuanRaid45" : "iwoJimaAllied45",
              outcome:
                "Speculative. The fleet fights its final year under one doctrine and not two commanders' different instincts. The aggressive pursuit that Halsey's style sometimes bought, at its own cost, is lost, and the fleet never again sails into a typhoon it should have seen coming. The command structure has one answer and not two.",
            },
            {
              label: "Promote a second carrier commander to restore the alternating structure, even without Halsey",
              advisor: { name: "Mitscher", position: "The alternating command was about giving the fleet's staff time to plan without having to fight, not about the two men in the two chairs, and that should be kept whoever sits in the second chair." },
              setFlags: { halseyAftermathPath: "restoredAlternation" },
              impact: { readiness: -1, pipeline: 0, initiative: 2 },
              disabledReason: meters.readiness <= -4 ? "There isn't the depth of trained staff to stand up a second full command structure at this readiness level. One doctrine has to do for the rest of the war." : undefined,
              gateCheck: { meter: "readiness", threshold: -4, label: "Readiness" },
              next: flags.philippinesPath === "liberate" ? "cabanatuanRaid45" : "iwoJimaAllied45",
              outcome:
                "Speculative. The alternating structure survives Halsey's relief under a less famous name, and the planning advantage it was built for continues into the last year of the war, at the cost of the aggressive instinct Halsey brought to it.",
            },
          ],
        };
        },
        get burmaReconquest45() {
          return {
          date: "1945",
          title: "Reopening the Overland Route",
          historicalRecord: true,
          situation:
            "Slim's Fourteenth Army, rebuilt from the retreat of 1942, is retaking Burma. The question left standing is almost administrative by comparison to the fighting that got here: whether to force construction of the Ledo Road, an overland supply route through the reconquered territory into China, or rely permanently on the Hump airlift and put the engineering effort somewhere the Pacific advance can use it directly." +
            (flags.rangoonAlliedPath === "defend"
              ? " The Chinese divisions committed to the costlier defense of Rangoon back in 1942 are, on this path, part of the army that just finished retaking the ground they were nearly lost holding three years ago."
              : ""),
          choices: [
            {
              label: "Force the Ledo Road's construction through reconquered northern Burma",
              advisor: { name: "Stilwell", position: "After three years of being told the airlift is enough, Chiang should be handed a road once, instead of an excuse." },
              historical: true,
              setFlags: { overlandPath: "ledoRoad", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: -2, pipeline: 4, initiative: 1 },
              disabledReason: meters.readiness <= -6 ? "There's no engineering corps capacity to spare for a road project at this readiness level. Every combat engineer available is already committed to the Pacific advance." : undefined,
              gateCheck: { meter: "readiness", threshold: -6, label: "Readiness" },
              next: flags.philippinesPath === "liberate" ? "cabanatuanRaid45" : "iwoJimaAllied45",
              outcome:
                "The Ledo Road is completed and the first convoy reaches China in early 1945, a genuine engineering achievement through some of the war's worst terrain, and one that arrives so late in the conflict its actual strategic contribution is modest at best; the Hump airlift, by this point, is already moving more tonnage than the road ever will. The road's real legacy is the demonstration that it could be built at all, not what it changed about the war's final months.",
            },
            {
              label: "Rely permanently on the Hump airlift: divert the engineering effort to the Pacific advance instead",
              advisor: { name: "Slim", position: "Burma is taken and need not also be paved before the war ends, and the engineers should go where the war is still being decided." },
              setFlags: { overlandPath: "airOnly", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: 1, pipeline: -1, initiative: 2 },
              next: flags.philippinesPath === "liberate" ? "cabanatuanRaid45" : "iwoJimaAllied45",
              outcome:
                "A modeled alternative. The real Ledo Road's strategic payoff was marginal because it opened so late, and engineers freed for airfield and base construction in the Pacific have an immediate use closer to the decisive theater. What is given up is symbolic as much as material: the road that proved the China-Burma-India theater's logistics could be solved by more than air power.",
            },
          ],
        };
        },
        get cabanatuanRaid45() {
          return {
          date: "JANUARY 1945",
          title: "Cabanatuan: Thirty Miles Behind the Lines",
          historicalRecord: true,
          situation:
            "Intelligence reaching Sixth Army's headquarters carries a specific fear. On Palawan in December, Japanese guards herded about 150 American prisoners into air raid shelters and burned them alive as the Allied advance approached. More than 500 American and Allied prisoners, most of them Bataan and Corregidor survivors with nearly three years in captivity, are held at a camp near Cabanatuan City, thirty miles behind the front line and in the path of the same advance. Lieutenant General Krueger has a rescue plan: the 6th Ranger Battalion, ten Alamo Scouts and several hundred Filipino guerrillas under Captain Juan Pajota would go in on foot through Japanese-held territory to reach the camp before the regular advance does, or before the guards decide that the advance is close enough to matter.",
          choices: [
            {
              label: "Authorize the raid: send the Rangers, Scouts, and guerrillas in on foot, thirty miles behind enemy lines",
              advisor: { name: "Krueger", position: "Palawan showed that the threat to the prisoners is real, and if the same order may reach Cabanatuan's guards before the army does, the regular advance should not decide the timing." },
              historical: true,
              setFlags: { cabanatuanPath: "authorized" },
              impact: { readiness: -1, pipeline: 0, initiative: 2 },
              next: "iwoJimaAllied45",
              uncertain: [
                {
                  weight: modWeight(75, meters.initiative),
                  title: "The raid succeeds close to how it actually happened",
                  setFlags: { cabanatuanResult: "success" },
                  impact: { readiness: 1, pipeline: 0, initiative: 2 },
                  outcome:
                    "What happened, and one of the cleanest special-operations successes of the war. More than 500 prisoners are freed in a raid lasting under half an hour, for the loss of two Americans, against several hundred Japanese killed. Prisoners too weak to walk are carried out on the Rangers' backs and on carabao carts requisitioned from villages along the thirty-mile route back. The camp's garrison and the reinforcement column that arrives mid-raid are destroyed before either can carry out any order like Palawan's.",
                },
                {
                  weight: (() => { const w = modWeight(75, meters.initiative); return Math.max(5, 100 - w); })(),
                  title: "The raid runs into real resistance the historical operation was fortunate enough to avoid",
                  setFlags: { cabanatuanResult: "costly" },
                  impact: { readiness: -3, pipeline: -1, initiative: -1 },
                  outcome:
                    "Speculative. The real raid's near-bloodless result depended on timing and reconnaissance that do not hold as cleanly here. The camp is taken and the prisoners freed, but at a cost in Rangers and guerrillas that the real operation never had to pay.",
                },
              ],
              outcome:
                "A gamble against a real and recent risk: the guards on Palawan carried out a kill-all order against their prisoners a month ago, and nothing about Cabanatuan's guards makes that less possible here. Thirty miles on foot behind enemy lines to get ahead of it is a real operational risk.",
            },
            {
              label: "Decline the raid: let the regular Sixth Army advance reach the camp on its own timetable instead",
              advisor: { name: "Sixth Army staff", position: "A deep-penetration raid of this size risks the force carrying it out as much as it protects the prisoners, and the advance will reach the camp in weeks regardless." },
              setFlags: { cabanatuanPath: "declined" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "iwoJimaAllied45",
              outcome:
                "A modeled alternative that treats Palawan as an isolated atrocity and not as a policy. It is a bet on the lives of roughly 500 men, against guards who a month earlier, not far away, showed that they were ready to kill their prisoners rather than see them liberated. The regular advance does reach Cabanatuan eventually. What condition it finds the camp in is the question this choice leaves open.",
            },
          ],
        };
        },
        get iwoJimaAllied45() {
          return {
          date: "FEBRUARY 1945",
          title: "Iwo Jima: The Bombardment Argument",
          historicalRecord: true,
          situation:
            "Iwo Jima's airfields matter enormously: close enough to give B-29s a fighter escort all the way to Tokyo, and a rescue strip for crippled bombers that would otherwise ditch in open ocean. Marine planners requested ten days of naval bombardment to soften a defense already known to be dug in deep rather than massed on the beaches. The Navy, with carrier strikes against the home islands and Okinawa's coming invasion both competing for the same ships, is offering three." +
            (flags.tarawaResult === "overruled"
              ? " Congress's own doctrinal review after Tarawa is still standing policy, a preparatory-bombardment mandate this command didn't choose for itself and can't simply set aside because the Navy's own ship schedule argues otherwise. Offering three days here isn't just a tactical call anymore. It's a live question of whether this command is prepared to test a political mandate it has no real authority to overrule."
              : "") +
            (flags.cabanatuanResult === "success"
              ? " Cabanatuan is three weeks old and still the story every correspondent in theater wants to keep telling, over five hundred men carried out alive against a fear that turned out to be exactly justified. Whatever this landing costs, it isn't starting from a public mood that's stopped believing this command can still pull off the harder version of a rescue."
              : flags.cabanatuanResult === "costly"
              ? " Cabanatuan is three weeks old, and the men it actually freed are real, but so is what it cost getting them out, a fact this command is still weighing against the raid's own success in deciding how much appetite remains for the next deep, risky operation this campaign asks of it."
              : flags.cabanatuanPath === "declined"
              ? " Cabanatuan's camp is finally within the regular advance's reach, three weeks after the raid this command chose not to attempt. Whether that decision cost the prisoners held there anything is still the same unresolved question it was in January, only closer now to actually being answered."
              : ""),
          choices: [
            {
              label: "Accept the compressed three-day bombardment and proceed on schedule",
              advisor: { name: "Spruance", position: "Ten days of bombardment would buy something real, but ten days of ships idle off Iwo Jima instead of over Japan's air defenses would cost something real too, so it is three days and then the landing." },
              historical: true,
              setFlags: { iwoJimaAlliedPath: "compressed" },
              impact: { readiness: -3, pipeline: 0, initiative: 2 },
              next: "okinawaAllied45",
              outcome:
                "The compressed bombardment fails to meaningfully touch Kuribayashi's tunnel network, and the Marines who land on February 19th walk into a defense barely dented by three days of shelling. The battle runs five weeks and costs the Marine Corps nearly 7,000 dead, its highest single-battle toll of the war, a price historians have argued for decades might have been lower with the ten days originally requested, against a Navy schedule that had competing claims on the same ships.",
            },
            {
              label: "Insist on the full extended bombardment before landing, delaying the operation",
              advisor: { name: "Holland Smith", position: "Ten days of bombardment saves Marine lives on the beach, the Navy wants those ships for other things, and Nimitz is asked to decide which cost he would rather explain." },
              setFlags: { iwoJimaAlliedPath: "extended" },
              impact: { readiness: 2, pipeline: -2, initiative: -3 },
              disabledReason: meters.pipeline <= -5 ? "There isn't fuel to keep this bombardment force on station for ten days without pulling ships from Okinawa's own preparation. The extended schedule isn't available at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -5, label: "Pipeline" },
              next: "okinawaAllied45",
              outcome:
                "A modeled alternative: the argument Marine planners lost. A longer bombardment pulls carrier support away from strikes on Japanese airfields elsewhere, on the contested premise that naval gunfire could crack a tunnel network built to survive it. Whether ten days would have saved the casualties the short schedule cost, or only delayed the same battle against a defense that had already gone to ground, is still disputed.",
            },
            ...(meters.pipeline >= 7
              ? [
                  {
                    label: "Take the full ten-day bombardment without pulling a single ship from Okinawa's preparation: let the fleet train actually carry both",
                    advisor: { name: "Nimitz", position: "The fleet train built since 1917, when six destroyers were refueled from a hose off an oiler's stern, can carry both commitments, and the admiral intends to let it." },
                    setFlags: { iwoJimaAlliedPath: "fullSupport" },
                    impact: { readiness: 1, pipeline: -2, initiative: 1 },
                    next: "okinawaAllied45",
                    outcome:
                      "A logistics picture the actual Joint Chiefs never had available to them: by October 1944 the At Sea Logistics Service Group alone ran 34 oilers, 11 escort carriers, and dozens of destroyers and destroyer escorts as a rotating, self-sustaining base that kept task forces at sea for months without ever returning to port, a capability that only grew from there. The historical three-day compromise existed because the fleet train, extensive as it already was, still had to choose. Here it doesn't have to. The bombardment runs the full ten days Marine planners actually wanted, Okinawa's own preparation proceeds on schedule regardless, and Kuribayashi's tunnel network gets tested against everything naval gunfire could throw at it. Whether that changes what five weeks of fighting a network built to survive shelling ultimately costs is the same open historical question either way.",
                  },
                ]
              : []),
            ...(meters.initiative >= 7
              ? [
                  {
                    label: "Skip Iwo Jima entirely: take King's real dismissal of the island seriously and bet everything on Okinawa alone",
                    advisor: { name: "King", position: "King called Iwo Jima a waste of resources at the September 1944 planning conference, and the tunnel network found under it changes nothing, since it has no anchorage, no useful land and lies farther from Kyushu than Okinawa." },
                    setFlags: { iwoJimaAlliedPath: "skipped", speculativePath: true },
                    impact: { readiness: -4, pipeline: 3, initiative: 3 },
                    next: "okinawaAllied45",
                    uncertain: [
                      {
                        weight: modWeight(30, meters.initiative),
                        title: "The bypass costs less than feared",
                        setFlags: { iwoSkipResult: "acceptable" },
                        impact: { readiness: 2, pipeline: 0, initiative: 1 },
                        outcome:
                          "The gamble King actually argued for pays off closer to what he predicted: B-29 losses that would have used Iwo Jima's emergency strips prove survivable at a rate the bombing campaign can absorb, and the five weeks of fighting the historical battle cost never happen at all. Kuribayashi's tunnel network, real and formidable, simply never gets tested, because nobody lands to test it.",
                      },
                      {
                        weight: (() => { const w = modWeight(30, meters.initiative); return Math.max(5, 100 - w); })(),
                        title: "The bypass costs more than King's argument accounted for",
                        setFlags: { iwoSkipResult: "costly" },
                        impact: { readiness: -3, pipeline: -1, initiative: -2 },
                        outcome:
                          "The likelier outcome: the real emergency-landing capability Iwo Jima's airfields provided, and the fighter escort range it bought B-29s over Tokyo, prove to matter more than King's September 1944 argument accounted for. Bomber crews who historically survived a crippled aircraft by putting it down on Iwo Jima's strips have nowhere to land here, and the home-island bombing campaign pays a cost in aircrew this command spends the rest of the war reckoning with, a bill Kuribayashi's tunnels were never actually sent, but one paid regardless.",
                      },
                    ],
                    outcome:
                    "Admiral King dismissed Iwo Jima's occupation as worthless at the actual planning conference in September 1944, arguing it had no anchorage, inadequate land area, and sat farther from the ultimate objective than Okinawa did. Acting on that argument fully, rather than compromising toward the historical decision to take the island anyway, is the real question his actual objection raises. Whether it saves the five weeks and nearly seven thousand Marine dead the historical battle cost, or simply moves that cost onto bomber crews with nowhere to put down a crippled aircraft, is a dispute this gamble settles by living it rather than debating it.",
                  },
                ]
              : []),
          ],
        };
        },
        get okinawaAllied45() {
          return {
          date: "APRIL – JUNE 1945",
          title: "Okinawa: The Picket Line",
          historicalRecord: true,
          situation:
            "The largest amphibious landing of the Pacific War is ashore, and the kamikaze threat covering it is unlike anything the fleet has faced before: ten mass Kikusui attacks over three months, aimed as much at the destroyers standing radar picket duty around the fleet as at the carriers and transports those pickets exist to protect. The tactical question is where those picket ships actually stand: close enough to give early warning and absorb the first wave themselves, or pulled back to reduce their exposure at the cost of slower warning for everyone behind them." +
            (flags.philippineSeaAlliedPath === "pursue"
              ? " The aggressive instinct that chased Ozawa's fleet rather than holding close at the Marianas is still the instinct running this fleet's tactical thinking now, for better and for worse."
              : flags.philippineSeaAlliedPath === "splitForce"
              ? " This fleet has done the harder version of this argument before, holding a landing's cover intact while still committing real strength elsewhere. The instinct that split the force at the Marianas without weakening either half is exactly what this picket question is asking for again."
              : "") +
            (flags.iwoJimaAlliedPath === "extended"
              ? " The extended bombardment insisted on before Iwo Jima bought real credibility for hard tactical arguments in this room. Nobody dismisses a request for more preparation time as easily as they might have a year ago."
              : flags.iwoJimaAlliedPath === "fullSupport"
              ? " The fleet train that carried both Iwo Jima's full bombardment and this preparation at once is the same one this picket line is leaning on now. Whatever margin that abundance bought doesn't disappear just because the argument here is a different one."
              : flags.iwoJimaAlliedPath === "skipped" && flags.iwoSkipResult === "acceptable"
              ? " This fleet arrives at Okinawa having never fought Iwo Jima at all, King's real argument acted on and, so far, vindicated: the B-29 losses his bypass risked proved survivable, and the tunnel network at Iwo Jima never got tested because nobody landed to test it. Whatever this picket line costs, it isn't compounding a bill this command already regrets."
              : flags.iwoJimaAlliedPath === "skipped" && flags.iwoSkipResult === "costly"
              ? " This fleet arrives at Okinawa having never fought Iwo Jima at all, King's real argument acted on rather than compromised toward, and whether that decision was the right one is still being tallied in bomber crews with nowhere to put down a crippled aircraft, a bill this picket line's own kamikaze exposure is about to add its own line to."
              : "") +
            (flags.overlandPath === "ledoRoad"
              ? " The Ledo Road option kept China supplied by land rather than air alone, and whatever that bought the wider war effort, it's one fewer variable competing for the same shipping this fleet is drawing on right now."
              : ""),
          choices: [
            {
              label: "Hold the radar picket line as planned: early warning takes priority over picket-ship survival",
              advisor: { name: "Nimitz", position: "Every minute of warning the pickets buy is a minute the carriers get their fighters up before the wave arrives, and that minute is not worth trading away to make the picket assignment feel safer." },
              historical: true,
              setFlags: { okinawaAlliedPath: "holdPicket" },
              impact: { readiness: -3, pipeline: -1, initiative: 1 },
              next: "strategicBombingAllied45Delayed",
              outcome:
                "The picket destroyers absorb a disproportionate share of the kamikaze campaign's cost: several are sunk and dozens more damaged, with casualties among picket crews severe enough that the sailors on those stations speak of them as death sentences. The early warning they give is real and saves ships further in. It does not change what the watch costs the destroyers that keep it.",
            },
            {
              label: "Pull the picket line back further offshore, accepting slower warning for reduced picket exposure",
              advisor: { name: "King", position: "The doctrine spends more destroyers on warning time than sits comfortably, and if pulling the line back costs minutes and not ships, the trade should be known before the current price keeps being paid." },
              setFlags: { okinawaAlliedPath: "pullBack" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "strategicBombingAllied45Delayed",
              uncertain: [
                {
                  weight: modWeight(40, meters.initiative),
                  title: "The warning still arrives in time",
                  setFlags: { okinawaPickResult: "warningHeld" },
                  impact: { readiness: 1, pipeline: 0, initiative: 0 },
                  outcome:
                    "Speculative. King's bet holds. Fighter direction and radar coverage compensate for the pulled-back line closely enough that the carriers still get their combat air patrol up before the mass waves arrive, and destroyer losses come down without more ships being hit deeper in the formation.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.initiative); return Math.max(5, 100 - w); })(),
                  title: "The slower warning costs ships further in",
                  setFlags: { okinawaPickResult: "warningLost" },
                  impact: { readiness: -1, pipeline: -1, initiative: -1 },
                  outcome:
                    "Speculative. The trade King worried about materializes. Fewer picket destroyers are lost, but the waves that get through arrive with less warning, and ships further back, carriers and transports among them, take hits that the forward picket line was built to prevent.",
                },
              ],
              outcome:
                "A modeled alternative, on a debate inside the Navy about what picket doctrine cost. Pulling the line back plausibly reduces destroyer losses, at an uncertain cost in warning for the carriers and transports the pickets protect. The kamikaze threat proved effective against ships of every size, and the real doctrine was revised repeatedly during the battle.",
            },
            ...(meters.pipeline >= 4
              ? [
                  {
                    label: "Hold the close picket line, but backstop it with a genuine reserve of radar-equipped destroyers the historical picket doctrine never had spare hulls to field",
                    advisor: { name: "Nimitz", position: "The doctrine has been a choice between early warning and picket survival because the fleet never had enough radar-equipped hulls, and the record should note that this time it has enough." },
                    setFlags: { okinawaAlliedPath: "holdWithReserve" },
                    impact: { readiness: -2, pipeline: -3, initiative: 2 },
                    next: "strategicBombingAllied45Delayed",
                    outcome:
                      "A position the actual 1945 fleet, its destroyer strength already stretched thin across every picket station Okinawa's scale demanded, never had the hulls to occupy: the close picket line held exactly as doctrine intended, early warning uncompromised, but backstopped by a genuine reserve able to relieve battered picket ships and reinforce stations losing cohesion mid-attack, rather than leaving each picket station to absorb what came at it alone until the historical rotation eventually got around to relieving it.",
                  },
                ]
              : []),
          ],
        };
        },
        get strategicBombingAllied45Delayed() {
          return {
          date: "APRIL – JUNE 1945",
          title: "The Incendiary Campaign, Already Underway",
          historicalRecord: true,
          situation:
            "On the night of March 9–10, roughly 300 B-29s firebombed Tokyo at low altitude and killed an estimated 100,000 people, the deadliest air raid in history. LeMay's change of doctrine was not a decision this staff was in the room for. What is in front of the staff now is narrower: whether the incendiary campaign continues to the sixty-odd cities it eventually reached, or whether the results reaching this desk months late are grounds to press for a reconsideration of a doctrine that has been running without this command's sign-off." +
            (flags.okinawaPickResult === "warningHeld"
              ? " The picket doctrine argument off Okinawa, pulled back and vindicated by radar and fighter direction closing the gap, is the kind of recent institutional success that makes trusting LeMay's own already-running judgment an easier case to accept without relitigating it from scratch."
              : flags.okinawaPickResult === "warningLost"
              ? " The picket doctrine argument off Okinawa, pulled back at a cost in ships hit deeper in the formation, is a recent reminder that a plausible-sounding change to doctrine doesn't always survive contact with results, a caution this staff can't fully apply retroactively to a firebombing campaign that's been running for months without its direct sign-off."
              : ""),
          choices: [
            {
              label: "Endorse the campaign as already run: let LeMay's doctrine continue expanding to the remaining target list",
              advisor: { name: "LeMay", position: "The campaign did not wait for a sign-off the command was not in a position to give in March, and a sign-off is wanted now, but the campaign does not stop while the staff catches up." },
              historical: true,
              setFlags: { bombingPath: "incendiaryLate" },
              impact: { readiness: 1, pipeline: 0, initiative: 2 },
              next: "atomicDemonstration45",
              outcome:
                "What happened, ratified and not decided. The incendiary campaign that began over Tokyo in March continues through the spring, and sixty-odd Japanese cities are firebombed by the end of the war. The staff's late endorsement changes nothing in a doctrine that never waited on it.",
            },
            {
              label: "Press for a reconsideration despite the months already spent: raise the moral cost of continuing now, even this late",
              advisor: { name: "Arnold", position: "The objection is late, but another month of the campaign is not the same question as the campaign having already run for one." },
              setFlags: { bombingPath: "reconsiderLate" },
              impact: { readiness: -1, pipeline: -1, initiative: -1 },
              next: "atomicDemonstration45",
              outcome:
                "A modeled alternative: a late objection to an early decision. The staff cannot undo March, only argue about April onward. The campaign's remaining scope narrows somewhat, at a cost to the industrial-target case LeMay's doctrine was built on, and the deadliest raid is already on the record.",
            },
          ],
        };
        },
        get atomicDemonstration45() {
          return {
          date: "JUNE – JULY 1945",
          title: "The Interim Committee's Question",
          historicalRecord: true,
          situation:
            "The bomb works, or will within weeks, and the Trinity test is near. The Interim Committee, convened to advise on its use, has a seriously argued alternative before it. A group of Manhattan Project scientists, in what became known as the Franck Report, proposes a demonstration: detonate the weapon on an uninhabited island or open desert, with Japanese observers invited, before considering use on a populated city. The counter-argument in the Committee is blunt: only two bombs are ready, a demonstration that failed to impress or failed to detonate would hand Japan's war ministry a propaganda victory that the peace faction can least afford, and no one has explained how to guarantee the safety or credibility of invited observers." +
            (flags.surrenderDoctrinePath === "negotiated"
              ? " Casablanca's declared willingness to consider terms short of unconditional surrender is still, in this history, the standing policy. Whatever the bomb does here, it lands on a Japanese war ministry that has had two years longer to weigh a negotiated exit than the historical record ever gave it."
              : ""),
          choices: [
            {
              label: "Reject the demonstration: proceed directly to use on a Japanese city without warning",
              advisor: { name: "Stimson", position: "The argument against a demonstration is strategic and not a matter of moral comfort, and whether the same can be said of every name on the target list is a separate question not yet settled." },
              historical: true,
              setFlags: { demonstrationPath: "reject" },
              impact: { readiness: 1, pipeline: 0, initiative: 2 },
              next: "kyotoTargetDebate45",
              outcome:
                "What happened. The Franck Report's proposal is set aside for the reasons the Interim Committee gave: too few bombs to risk one on a demonstration whose failure would cost more than its success could gain, and no confident answer on how a demonstration would compel a surrender that the real bombings, together with the Soviet declaration of war, achieved only narrowly. Which city is still undecided.",
            },
            {
              label: "Attempt the demonstration first: detonate on an uninhabited site, invite Japanese observers, withhold direct city use pending the result",
              advisor: { name: "Franck", position: "A demonstration that fails to move Japan's war ministry still costs less than a first use on a city that can never be taken back, and the Franck Report's authors know theirs is the minority position." },
              setFlags: { demonstrationPath: "attempt" },
              impact: { readiness: -1, pipeline: 1, initiative: -2 },
              next: "downfallOrBlockade45",
              outcome:
                "A modeled alternative, the position the Franck Report's signatories held and lost. Whether a demonstration would move a war ministry that had treated two firebombed cities and a hundred thousand dead in a night as an acceptable cost is uncertain, and the same faction that dismissed Hiroshima for several days might discount a demonstration on an empty island still more easily. If it works, it spares the civilian dead of a first city strike. If it fails, it loses the shock that, with the Soviet declaration days later, broke the cabinet deadlock in the real war.",
            },
          ],
        };
        },
        get kyotoTargetDebate45() {
          return dataNode(ALLIED_PACIFIC_DATA, "kyotoTargetDebate45", meters);
        },
        get kyotoStruck45() {
          return dataNode(ALLIED_PACIFIC_DATA, "kyotoStruck45", meters);
        },
        get targetSelection45() {
          return dataNode(ALLIED_PACIFIC_DATA, "targetSelection45", meters);
        },
        get hiroshima45() {
          return dataNode(ALLIED_PACIFIC_DATA, "hiroshima45", meters);
        },
        get nagasaki45() {
          return dataNode(ALLIED_PACIFIC_DATA, "nagasaki45", meters);
        },
        get radiationDisclosure45() {
          return {
          date: "SEPTEMBER – NOVEMBER 1945",
          title: "A Very Pleasant Way to Die",
          historicalRecord: true,
          situation:
            "Reports are reaching Washington from Japanese doctors, and from the first American personnel on the ground, that people who survived both blasts uninjured are sickening and dying in the weeks afterward. The cause is radiation sickness, which the weapon's designers understood from secret memoranda and which has not been said plainly to the public. General Groves has already told a reporter that the Japanese reports are almost certainly exaggerated. What he says next, to Congress and in public, is his to decide." +
            (flags.nagasakiAnnouncePath === "minimal"
              ? " Truman's own decision to say nothing further after Nagasaki set the tone this administration has kept ever since: minimal statement, minimal follow-up, and a public posture that leaves Groves plenty of room to characterize what comes next however he judges best."
              : flags.nagasakiAnnouncePath === "direct"
              ? " Truman's own more forthcoming statement after Nagasaki leaves less room than usual for a quiet dismissal here. A government that already chose candor once this year has a harder case for abandoning it now."
              : ""),
          choices: [
            {
              label: "Dismiss the reports: characterize radiation deaths as minimal, Japanese claims as propaganda",
              advisor: { name: "Groves", position: "The deaths from radiation are described as a very pleasant way to die, and there is no reason to contradict that with speculation dressed up as certainty." },
              attested: { by: "Groves", text: "they say it is a very pleasant way to die", source: "Leslie Groves, testimony to the Senate Special Committee on Atomic Energy, 1945" },
              historical: true,
              setFlags: { radiationDisclosurePath: "denied" },
              impact: { readiness: 0, pipeline: 0, initiative: 1 },
              next: "downfallOrBlockade45",
              outcome:
                "Groves tells Congress in November that there was no radioactive residue of consequence and that radiation caused no undue suffering, a claim contradicted by secret memoranda his own project had produced by September. The gap between the classified record and the public one is not closed for years, and then by outside reporting and not by an official account correcting itself.",
            },
            {
              label: "Report the secret findings honestly: radiation sickness is real, already documented internally, and worth saying so",
              advisor: { name: "Kistiakowsky", position: "Memoranda inside the project already answer the question General Groves tells reporters is unanswered, and nothing is served by pretending otherwise." },
              setFlags: { radiationDisclosurePath: "honest" },
              impact: { readiness: -1, pipeline: 0, initiative: -1 },
              next: "downfallOrBlockade45",
              outcome:
                "A path that costs the program some of the clean narrative Groves spent the historical record protecting, and buys an honest public record years earlier than the one that actually emerged. It doesn't change what happened at either city. It changes how soon the country deciding whether to build more of these weapons has to reckon with what the first ones actually did.",
            },
          ],
        };
        },
        get nagasakiDelayed45() {
          return {
          date: "AUGUST 1945",
          title: "The Extra Days",
          historicalRecord: false,
          situation:
            "Speculative. The second weapon is paused and not canceled: ready, but withheld pending a decision nobody in Washington has made. Japan's Big Six has only Hiroshima and the Soviet declaration to weigh, not a second city. Historians differ on whether the council would have moved without both shocks close together, or whether a second bomb specifically broke a deadlock that persisted even after Nagasaki.",
          choices: [
            {
              label: "Hold the pause and see whether Hiroshima alone, given time, moves the council",
              advisor: { name: "McCloy", position: "The Assistant Secretary asked for a decision to be made and not assumed, and did not promise it would be an easy one or a fast one." },
              historical: false,
              setFlags: { nagasakiDelayPath: "held" },
              impact: { readiness: -1, pipeline: 0, initiative: -1 },
              uncertain: [
                {
                  weight: modWeight(35, meters.readiness),
                  title: "The council moves without a second strike",
                  setFlags: { nagasakiDelayResult: "surrender" },
                  impact: { readiness: 1, pipeline: 0, initiative: 1 },
                  outcome:
                    "Speculative, and the rarer outcome. Given days and not hours, and without a second city, the peace faction's argument gains ground in the council for the first time. It is not a surrender, only a shifted balance in a body deadlocked three to three, and the Joint Chiefs keep planning for the final campaign, because a shifted argument in Tokyo is not a signed instrument in Washington.",
                },
                {
                  weight: (() => { const w = modWeight(35, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The deadlock holds regardless",
                  setFlags: { nagasakiDelayResult: "deadlock" },
                  impact: { readiness: -1, pipeline: -1, initiative: -2 },
                  outcome:
                    "The likelier outcome. The war ministry's hardliners hold their position however much time passes, because the deadlock was never about how many cities had been hit; in the real war it survived two bombs and the Soviet declaration. With no resolution and a weapon ready, the order is carried out anyway, later and on worse terms, after days spent on a pause that changed nothing.",
                },
              ],
              next: "downfallOrBlockade45",
              outcome:
                "Whether Japan's leadership needed two cities or would have moved with time and one is still argued by historians. This path answers it once, and does not settle the debate.",
            },
            {
              label: "Use the extra days: send an explicit guarantee on the Emperor's status through the Swiss legation, instead of leaving the deliberate ambiguity of Byrnes's reply to work on its own",
              advisor: { name: "Grew", position: "The ambassador argued for exactly this clarity before the Potsdam Declaration and was overruled by people who wanted to leave the hardliners no ambiguity to negotiate inside, and the caution may have bought only time now being spent on a second bomb." },
              historical: false,
              setFlags: { nagasakiDelayPath: "clarified" },
              impact: { readiness: -1, pipeline: 0, initiative: -2 },
              uncertain: [
                {
                  weight: modWeight(40, meters.readiness),
                  title: "The clarity moves the peace faction's case",
                  setFlags: { nagasakiDelayResult: "surrender" },
                  impact: { readiness: 1, pipeline: 0, initiative: 1 },
                  outcome:
                    "Speculative, and the rarer outcome. An explicit guarantee on the throne, in place of the deliberate vagueness of Byrnes's reply, gives Togo's faction something concrete to argue with inside the council, a stated term instead of a promise to be read favorably on faith. It is not a surrender, only a shifted argument.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The clarity reads as weakness, not reassurance",
                  setFlags: { nagasakiDelayResult: "deadlock" },
                  impact: { readiness: -1, pipeline: -1, initiative: -2 },
                  outcome:
                    "The likelier outcome, and the reading Byrnes's advisers warned of. An explicit American guarantee, offered before a second weapon forces the issue, reads to the hardliners as proof that Washington wants the war over badly enough to bargain. The deadlock holds, with a concrete promise spent for nothing and now treated as leverage.",
                },
              ],
              next: "downfallOrBlockade45",
              outcome:
                "Whether explicit clarity on the Emperor's status would have shortened the real deadlock, or been read as weakness by a war ministry that believed it was winning by attrition, is disputed among historians of the surrender's last days.",
            },
          ],
        };
        },
        get indianapolisSinking45() {
          return dataNode(ALLIED_PACIFIC_DATA, "indianapolisSinking45", meters);
        },
        get indianapolisReview45() {
          return {
          date: "1945",
          title: "The Indianapolis Findings",
          historicalRecord: false,
          situation:
            "Speculative. The review confirms what was suspected: no single failure left nine hundred men in the water for four days. A chain of them did, across enough separate desks that the Navy's instinct to find one captain to blame was simpler than the truth. Whether fixing the chain this late changes anything for ships still at sea is the test.",
          choices: [
            {
              label: "Implement the reform fleet-wide immediately, war footing or not",
              advisor: { name: "Nimitz", position: "The review was not ordered to be filed, and every station in the reporting chain gets the new procedure this week and not after the war when it no longer matters." },
              setFlags: { indianapolisReviewPath: "immediate" },
              impact: { readiness: 1, pipeline: -1, initiative: 0 },
              next: "hiroshima45",
              uncertain: [
                {
                  weight: modWeight(55, meters.readiness),
                  title: "The reform holds",
                  setFlags: { indianapolisReviewResult: "held" },
                  impact: { readiness: 1, pipeline: 0, initiative: 0 },
                  outcome:
                    "Speculative. The new procedure catches a routing gap on another ship within weeks, quietly, before it becomes anyone's tragedy. No headline attaches to a failure that is caught in time.",
                },
                {
                  weight: (() => { const w = modWeight(55, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The war ends before the reform is fully tested",
                  setFlags: { indianapolisReviewResult: "untested" },
                  impact: { readiness: 0, pipeline: 0, initiative: -1 },
                  outcome:
                    "Speculative. The reform is real, but the war ends within weeks of its adoption, too soon to test it against the failure it was built to catch.",
                },
              ],
            },
            {
              label: "Study the reform carefully before rolling it out: get it right rather than get it out fast",
              advisor: { name: "King", position: "The reform has to work when the war is over and should not be rushed into the fleet to fail quietly as the old procedure did." },
              setFlags: { indianapolisReviewPath: "deliberate" },
              impact: { readiness: 0, pipeline: 1, initiative: -1 },
              next: "hiroshima45",
              outcome:
                "Speculative. A more careful reform, still being worked out as the last weeks of the war pass. It is better procedure than a rushed one would have been, and it is not ready to protect anyone still at sea.",
            },
          ],
        };
        },
        get downfallOrBlockade45() {
          return {
          date: "1945",
          title: "Downfall or Starvation",
          historicalRecord: true,
          situation:
            "With the Philippines liberated and Okinawa's brutal cost weighing on every planning session since, the Joint Chiefs face the war's final strategic choice: prepare Operation Downfall, the invasion of Kyushu and eventually Honshu, at casualty estimates nobody involved fully believes but nobody can responsibly ignore either, or pursue Operation Starvation, naval encirclement and total air blockade, betting that Japan can be forced to surrender without a single soldier setting foot on the home islands." +
            (flags.indianapolisPath === "systemicReview"
              ? " The reporting reforms ordered after the Indianapolis are still recent enough that this staff double-checks its own assumptions more carefully than it might have a year ago." +
                (flags.indianapolisReviewResult === "held"
                  ? " The reform has already caught one real routing gap before it became a second tragedy, which is exactly the kind of quiet success this staff is inclined to trust going into a decision this consequential."
                  : flags.indianapolisReviewResult === "untested"
                  ? " Whether the reform actually works was never settled before the war moved past the point of testing it, which leaves this staff double-checking its assumptions without much beyond faith that the double-checking itself is worth doing."
                  : "")
              : "") +
            (flags.targetSelectionPath === "warned"
              ? " Whatever the named warnings accomplished in July, this planning session is being run by people who already chose, once, to weigh civilian cost against military effectiveness out loud rather than let the calculation stay implicit."
              : "") +
            (flags.radiationDisclosurePath === "denied"
              ? " The same instinct that kept radiation sickness out of the public record in September is available again here: nobody in this room has to say out loud what Downfall's own casualty estimate is actually built on, if nobody asks the question directly."
              : flags.radiationDisclosurePath === "honest"
              ? " Having already put the classified radiation findings on the record once rather than let Groves' public denial stand uncorrected, this planning session has less room than it might have had to keep Downfall's own casualty math comfortably abstract."
              : "") +
            (flags.okinawaAlliedPath === "holdWithReserve"
              ? " The destroyer reserve fielded to backstop Okinawa's picket line is exactly the kind of hull surplus this planning session is now asking whether it can still afford to spend the same way twice."
              : "") +
            (flags.torpedoCrisisPath === "backLockwood"
              ? " LeMay's own blockade argument is standing on a submarine campaign that spent 1942 actually sinking what it aimed at, not just firing at it, thanks to a depth-fix this room mostly doesn't remember was ever in doubt."
              : flags.torpedoCrisisPath === "deferBuOrd"
              ? " LeMay's own blockade argument is standing on a submarine campaign that spent longer than it should have firing torpedoes that ran too deep to hit anything, a slower start whose actual tonnage cost nobody in this room has fully reckoned with."
              : "") +
            (flags.indianapolisReviewPath === "immediate"
              ? " The reform ordered after the Indianapolis went fleet-wide immediately rather than waiting on a careful rollout, this staff's own recent preference for speed over deliberation when a fix is available, a preference worth noting going into a decision this room is about to make on a similarly compressed timeline."
              : flags.indianapolisReviewPath === "deliberate"
              ? " The reform ordered after the Indianapolis is still being worked out carefully rather than rushed to the fleet, this staff's own recent preference for getting a fix right over getting it out fast, a preference this room is about to test against a decision that doesn't obviously reward patience."
              : "") +
            (flags.nagasakiDelayResult === "surrender"
              ? " The pause on the second weapon, held rather than let run on the standing order's own momentum, is the reason this room is even having this conversation: the peace faction's argument gained real ground without a second city added to the first, and Downfall's own planning is proceeding into a war ministry this staff has genuine, if cautious, reason to think may already be closer to breaking than the historical timeline suggested."
              : flags.nagasakiDelayResult === "deadlock"
              ? " The pause on the second weapon, held rather than let run on the standing order's own momentum, didn't move the war ministry's deadlock at all: the extra days bought nothing, and this room is planning Downfall against a Japan whose internal resistance to surrender looks exactly as intact as the historical record's own three-three split ever showed it."
              : ""),
          choices: [
            {
              label: "Prepare Operation Downfall: the amphibious invasion of the home islands",
              advisor: { name: "Marshall", position: "A blockade may work, and the war's final chapter should not be bet on 'may', so the invasion is prepared as though it will be launched." + (flags.stilwellUltimatumPath === "delayed" ? " Patience was argued on Stilwell's ultimatum and produced a different argument later, not a resolved one, and the same trade is not made here." : flags.stilwellUltimatumPath === "immediate" ? " Stilwell's ultimatum was decided decisively too, and it is better to commit to a plan now than hedge into the same argument twice." : "") },
              historical: true,
              setFlags: { endgameAlliedPath: "downfall" },
              impact: { readiness: -5, pipeline: -1, initiative: 3 },
              disabledReason: meters.pipeline <= -5 ? "The landing craft and shipping tonnage a Kyushu-scale invasion fleet requires haven't been rebuilt at this pipeline level. Blockade is the only option this force can resource." : undefined,
              gateCheck: { meter: "pipeline", threshold: -5, label: "Pipeline" },
              next: "gasWarfareQuestion45",
              outcome:
                "What happened. Downfall was prepared in full: the invasion of Kyushu planned for November 1945 and of Honshu for the following spring, at casualty estimates that bore on the decision to use the atomic bombs. Two bombs in August and the Soviet declaration of war brought a surrender before a soldier of the invasion left a landing craft.",
            },
            {
              label: "Pursue Operation Starvation: naval encirclement and complete air blockade, no invasion",
              advisor: { name: "LeMay", position: "Japan cannot feed itself past this winter if the sea lanes stay closed and the rail network stays broken, and an invasion may not be needed to finish the war, but a winter probably is." },
              setFlags: { endgameAlliedPath: "blockade" },
              impact: { readiness: 2, pipeline: -3, initiative: -2 },
              next: "sovietHokkaido45",
              uncertain: [
                {
                  weight: modWeight(35, meters.readiness),
                  title: "The blockade forces the surrender on its own",
                  setFlags: { blockadeResult: "sufficientAlone" },
                  impact: { readiness: 1, pipeline: 0, initiative: 1 },
                  outcome:
                    "Speculative. LeMay's bet pays off. A hard winter, without invasion and without the bombs, breaks the war ministry's deadlock through starvation and exhaustion alone, a disputed but real possibility. No American soldier lands on the home islands and no atomic bomb is needed.",
                },
                {
                  weight: (() => { const w = modWeight(35, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The blockade alone isn't enough",
                  setFlags: { blockadeResult: "insufficientAlone" },
                  impact: { readiness: -1, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier outcome. Starvation and exhaustion erode Japan's capacity to fight without breaking the political deadlock over surrender terms, the deadlock that in the real war took the bombs and the Soviet declaration together to crack. The winter grinds on.",
                },
              ],
              outcome:
                "A modeled alternative, on the argument LeMay and the blockade's advocates made: mining and submarine warfare had already cut Japan's imports to a fraction of the 1941 level, and a hard winter without invasion might have forced a surrender without American ground casualties. A blockade starves a country. It does not by itself break a cabinet split between honor and survival.",
            },
            {
              label: "Accelerate Downfall's timetable regardless of buildup readiness: land before the force is prepared",
              advisor: { name: "Marshall", position: "The timetable can move faster, though the chief of staff does not say that it should." },
              setFlags: { endgameAlliedPath: "accelerated" },
              impact: { readiness: -4, pipeline: -2, initiative: 4 },
              disabledReason: meters.readiness <= -8 ? "There is no force left in a state to accelerate. Whatever timetable this staff wants to keep, the divisions available can't sustain the buildup Kyushu already requires, let alone a faster one." : undefined,
              gateCheck: { meter: "readiness", threshold: -8, label: "Readiness" },
              next: "gasWarfareQuestion45",
              outcome:
                "Speculative. Landing craft, naval gunfire support and the follow-on divisions that the Kyushu plan assumed were the basis of its casualty estimates. Compressing the timetable without them does not make the invasion faster. It turns estimates that were already the grimmest anyone in the room had planned around into a floor and not a ceiling.",
            },
            ...(meters.pipeline >= 6
              ? [
                  {
                    label: "Pursue both simultaneously: prepare Downfall at full strength while running Operation Starvation alongside it, rather than choosing",
                    advisor: { name: "King", position: "The fleet has always been told it cannot run two strategies at once, and the record should show that for once it can." },
                    setFlags: { endgameAlliedPath: "both" },
                    impact: { readiness: -2, pipeline: -5, initiative: 2 },
                    next: "gasWarfareQuestion45",
                    outcome:
                      "A position unavailable to the actual Joint Chiefs, who had to choose between Downfall's invasion buildup and Starvation's naval commitment because no realistic supply picture supported both at once. Here, both proceed together: the blockade tightening through the winter exactly as LeMay's real argument predicted, while Kyushu's invasion force builds toward November regardless, each strategy no longer needing to bet on succeeding alone. Whether that combined pressure actually breaks the war ministry's deadlock any faster than either path would have on its own is the next question, not this one's.",
                  },
                ]
              : []),
          ],
        };
        },
        get gasWarfareQuestion45() {
          // Marshall's real May 1945 proposal reached Truman specifically because Downfall's
          // invasion planning was moving forward, not because of the blockade-only path — so
          // this only fires for the three choices at downfallOrBlockade45 that actually commit
          // to landing troops. The 'both' path still routes to combinedPressureCollapse45
          // afterward rather than sovietHokkaido45, same as it did before this node existed.
          const nextTarget = flags.endgameAlliedPath === "both" ? "combinedPressureCollapse45" : "sovietHokkaido45";
          return {
          date: "MAY–JUNE 1945",
          title: "The Argument for Gas",
          historicalRecord: true,
          situation:
            "Marshall's proposal reaches this room much as it reached Washington in May 1945: not a plan for gas warfare against Japanese cities but a narrower one, aimed at the caves and fortified bunkers that have cost more American lives per yard of ground than almost anything else in the war. He limits it to positions that refuse a formal surrender demand, sparing both close assault and any wider bombardment. Roosevelt's policy said that the United States would use gas only in retaliation for its first use by an enemy, a pledge Marshall's proposal asks the room to set aside for a use its author calls narrow enough to justify the exception. A broader study from the Army's Chemical Warfare Service is also on file, considering area gas attacks on troop concentrations near invasion objectives, a scope that would kill far more than soldiers refusing to surrender.",
          choices: [
            {
              label: "Uphold Roosevelt's no-first-use pledge: decline the proposal, prepare Downfall without gas",
              advisor: { name: "Stimson", position: "The President's policy was never conditional on how narrow the next proposal sounds, and the Secretary is not the one to unmake a pledge the government made in 1943." },
              historical: true,
              setFlags: { gasWarfarePath: "declined" },
              impact: { readiness: 0, pipeline: 0, initiative: -1 },
              next: nextTarget,
              outcome:
                "What happened. The proposal reached Truman in June, and he refused it, holding to Roosevelt's retaliation-only pledge over the tactical case Marshall made for an exception. Downfall's casualty estimates are built without gas.",
            },
            {
              label: "Authorize Marshall's proposal as written: gas restricted to caves and bunkers that refuse a surrender demand",
              advisor: { name: "Marshall", position: "The proposal is against specific positions that have made every island since Tarawa cost more riflemen than the position was worth, not against a city, and a week of gas masks would cut the cost of the assault behind it." },
              setFlags: { gasWarfarePath: "limitedAuthorized" },
              impact: { readiness: 2, pipeline: -1, initiative: 1 },
              next: nextTarget,
              uncertain: [
                {
                  weight: modWeight(45, meters.readiness),
                  title: "The limited scope holds, and the tactical case pays off",
                  setFlags: { gasWarfareResult: "containedEffective" },
                  impact: { readiness: 2, pipeline: 0, initiative: 1 },
                  outcome:
                    "Speculative. Marshall's limits hold in practice as well as on paper: gas is used only against positions that have refused a surrender demand, and the tactical case largely bears out, with fewer riflemen spent on ground that used to cost several times as many. The precedent, a pledge from 1943 set aside once, stays as narrow as promised, at least this once.",
                },
                {
                  weight: (() => { const w = modWeight(45, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The limits erode, and the tactical case falls short of the promise",
                  setFlags: { gasWarfareResult: "creepIneffective" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier outcome. Cave ventilation and gas masks blunt more of the tactical benefit than the proposal allowed for, and the commanders who found the exception easy to justify once find it easier to ask again, for positions that do not quite meet the standard of having refused a surrender demand. A pledge that held since 1943 does not survive its first exception as cleanly as its author intended.",
                },
              ],
              outcome:
                "A modeled alternative: the proposal as Marshall wrote it and as Truman refused it, a narrow military exception to a pledge made in 1943 and put in writing in May 1945. Authorizing it tests Marshall's belief that a line drawn against bombarding cities need not be drawn against a bunker that has refused to surrender.",
            },
            {
              label: "Authorize gas warfare at the Chemical Warfare Service's own broader scale: area attacks on troop concentrations near the invasion objectives",
              advisor: { name: "Porter", position: "Marshall's proposal reads well in a memo, while the Chemical Warfare Service's version is the one that actually shortens the campaign, and the difference is not small." },
              setFlags: { gasWarfarePath: "areaAuthorized" },
              impact: { readiness: 3, pipeline: -2, initiative: 2 },
              next: nextTarget,
              outcome:
                "Speculative. The Chemical Warfare Service's own June 1945 study considered area gas attacks on troop concentrations near the invasion objectives and not individual bunkers, a scope that would also fall on civilians in the target area. Choosing this over Marshall's limits is a different argument from his, and one that Truman's refusal of the narrower proposal never had to confront, because it never reached his desk.",
            },
          ],
        };
        },
        get combinedPressureCollapse45() {
          return {
          date: "AUGUST 1945",
          title: "Two Strategies, One Question",
          historicalRecord: false,
          situation:
            "Speculative. The bombs and the Soviet declaration come on their real schedule, because neither depended on Downfall or Starvation. What differs is the days after: a war ministry facing the shock of August, a blockade visibly tightening and an invasion fleet visibly ready to sail the moment the deadlock breaks. Whether that readiness shortens the argument in Tokyo, or the surrender comes by the same argument regardless, is the question.",
          choices: [
            {
              label: "Let the combined pressure speak for itself: make no separate demand, let Tokyo draw its own conclusion from what it's actually facing",
              advisor: { name: "Marshall", position: "A war ministry that can see a blockade and an invasion fleet in front of it does not need to be told, and should do the arithmetic itself." },
              setFlags: { combinedPressurePath: "silent" },
              impact: { readiness: 1, pipeline: 0, initiative: 0 },
              next: "sovietHokkaido45",
              uncertain: [
                {
                  weight: modWeight(40, meters.readiness),
                  title: "The combined pressure shortens the argument",
                  setFlags: { combinedPressureResult: "shortened" },
                  next: "END",
                  impact: { readiness: 1, pipeline: 0, initiative: 1 },
                  outcome:
                    "Speculative, and the rarer outcome. Facing a blockade already working and an invasion force visibly ready to sail, the war ministry's deadlock breaks days sooner than in the real war, with a shorter final act and lower cost in the last week of fighting. Whether a few days saved more lives than the resources spent on both strategies is left open.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The argument runs its historical course regardless",
                  setFlags: { combinedPressureResult: "unchanged" },
                  next: "sovietHokkaido45",
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome. The war ministry's deadlock was not mainly a matter of how much force was visibly arrayed against it, and it collapses in nearly the same week it did in the real war.",
                },
              ],
              outcome:
                "A modeled alternative. Historians of the surrender are divided on how much the military pressure mattered, against how much the political shock of the bombs did the work whatever sat behind them.",
            },
            {
              label: "Make the combined pressure explicit: a formal statement naming the blockade and the invasion fleet together, in the direct register of the Potsdam Declaration's warning of 'prompt and utter destruction'",
              advisor: { name: "Truman", position: "Japan was told plainly in July what continuing the war would cost, and there is no case for going quiet now with more to point to." },
              setFlags: { combinedPressurePath: "explicit" },
              impact: { readiness: 0, pipeline: 1, initiative: 1 },
              next: "sovietHokkaido45",
              uncertain: [
                {
                  weight: modWeight(40, meters.readiness),
                  title: "The explicit statement gives the peace faction something concrete to point to",
                  setFlags: { combinedPressureResult: "shortened" },
                  next: "END",
                  impact: { readiness: 1, pipeline: 0, initiative: 1 },
                  outcome:
                    "Speculative, and the rarer outcome. Naming the blockade and the invasion fleet together gives Togo's faction a specific American statement to cite in the council, and the deadlock breaks days sooner than in the real war.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The explicit statement changes nothing the war ministry hadn't already assumed",
                  setFlags: { combinedPressureResult: "unchanged" },
                  next: "sovietHokkaido45",
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome. A war ministry watching a blockade tighten and an invasion fleet assemble does not need Washington to say so, and the deadlock collapses in nearly the same week it did in the real war.",
                },
              ],
              outcome:
                "A modeled alternative, tested from the other side: whether naming the combined threat moves a deadlock that silence would not, or gives a war ministry that already sees both pressures nothing new. Historians divide on this as they do on the quiet approach, because nobody can separate what the bombs' shock did from what the surrounding strategy contributed.",
            },
          ],
        };
        },
        get sovietHokkaido45() {
          return {
          date: "AUGUST 1945",
          title: "Stalin's Request",
          historicalRecord: true,
          situation:
            "Japan's surrender is imminent, and Stalin has made a request Truman did not expect so soon: a Soviet occupation zone on Hokkaido, the northernmost home island, like the zones dividing Germany. The Red Army's offensive in Manchuria has moved with great speed in its first week, and Soviet troops could reach northern Hokkaido before any American force could contest a landing. No agreement settles this as Yalta settled Germany's division in advance. It is being decided in the days around the surrender, on the question of who gets there first and how hard Washington will push back." +
            (flags.curtinPath === "defied"
              ? " Curtin's Australia, having turned decisively toward Washington rather than London back in 1942, has its own strong opinion about how this occupation question gets settled, and expects to be consulted as something closer to a partner than a spectator."
              : "") +
            (flags.internmentPath === "citizensExempt"
              ? " The narrower internment order back in 1942, sparing citizens by birth, is the kind of decision this administration can point to now as evidence it drew real lines under real pressure, for whatever that's worth in a room deciding how the next occupied territory gets governed."
              : "") +
            (flags.portChicagoPath === "orderedBack"
              ? " Fifty sailors from Port Chicago are still serving prison sentences for refusing to go back to the exact conditions that killed 320 of their own a year ago this month, a fact nobody in this room is raising, and nobody needs to raise, for it to still be true while this administration argues about how the next occupied population gets treated."
              : flags.portChicagoResult === "reformHeld"
              ? " The Port Chicago review that actually changed procedure a year ago is the rare case where this administration's stated principles and its actual practice lined up, a small, specific data point worth remembering in a room about to decide how much practice will match the principle this time."
              : "") +
            (flags.demonstrationPath === "attempt"
              ? " Whatever the attempted demonstration accomplished, this room is one where the alternative to the bombs was at least seriously tried, not just theoretically available."
              : "") +
            (flags.bombingPath === "precision"
              ? " The decision to hold to precision bombing rather than follow Tokyo's example everywhere else is still shaping how this administration argues, internally, about what victory is allowed to cost civilians."
              : "") +
            (flags.chinaPath === "communistCooperation"
              ? " Whatever cooperation with the Communists bought against Japan, it's already shaping how nervously this room is watching what happens in China the moment this war really ends."
              : "") +
            (flags.endgameAlliedPath === "blockade"
              ? " Whatever the blockade actually settled on its own, this administration is walking into the occupation question having already chosen once to bet on starvation and patience over invasion. That instinct is very much still in the room." +
                (flags.blockadeResult === "sufficientAlone"
                  ? " That bet paid off more than this room expected: the blockade alone broke the war ministry's deadlock, no invasion and no bomb required to reach this surrender, which makes the case for patience over force considerably easier to make now than it would have been a year ago."
                  : flags.blockadeResult === "insufficientAlone"
                  ? " That bet didn't fully pay off: starvation eroded Japan's capacity to fight without breaking the war ministry's actual political deadlock, the same deadlock this week's other pressures are the ones actually cracking. Patience bought real damage, just not, on its own, this surrender."
                  : "")
              : "") +
            (flags.macArthurTensionPath === "relieved"
              ? " The Pacific's most politically outsized personality is gone from this command structure, relieved after Typhoon Cobra rather than shielded by his own record. Whoever is arguing the American position on Hokkaido right now, it isn't him, and the argument sounds different for it."
              : "") +
            (flags.savoPath === "publicInquiry"
              ? " This Navy has a real, recent history of choosing public accountability over quiet management when a command failure costs American lives. That history is worth something in a room deciding how honestly to handle whatever comes next in occupied Japan."
              : flags.savoPath === "kingIntervenes"
              ? " This command has a precedent for Washington reaching past a theater commander's own judgment when the pace on the ground wasn't moving fast enough. Whether that precedent argues for or against doing the same thing again here depends entirely on who in this room is asked."
              : "") +
            (flags.tehranPath === "pressed"
              ? " Whatever came of pressing Stalin for an earlier Pacific commitment back at Tehran, this room is negotiating with a Soviet leader who has already been asked for more than his own timetable once before. That history shapes how the request for Hokkaido gets read now."
              : "") +
            (flags.tarawaPath === "adjust"
              ? " The doctrinal correction made after Tarawa, before Congress ever had to force one, is the kind of quiet institutional credibility this room draws on now without anyone needing to say so directly."
              : "") +
            (flags.philippineIndependencePath === "basingRights"
              ? " The harder bargain struck over Philippine basing rights is still fresh enough that this room's appetite for another territorial negotiation, so soon after the last contentious one, is thinner than it might otherwise be."
              : ""),
          choices: [
            {
              label: "Refuse the Soviet occupation zone: insist on sole American administration of the home islands",
              advisor: flags.corregidorPath === "remained"
                ? { name: "Eichelberger", position: "Three years of fighting back across the Pacific were not spent to administer half the surrender at the end, and Japan is occupied by the command in full." }
                : { name: "MacArthur", position: "Accepting the surrender was not meant to administer half of it, and Japan is occupied by the command in full or the command has failed at the one thing it was asked to do here." },
              historical: true,
              setFlags: { hokkaidoPath: "refused" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              disabledReason: meters.readiness <= -4 ? "There isn't the readiness to actually secure Hokkaido before a Soviet landing at this level. Refusing the request on paper means nothing if the fleet can't back the refusal with troops on the ground first." : undefined,
              gateCheck: { meter: "readiness", threshold: -4, label: "Readiness" },
              next: "theEmperorQuestion45",
              outcome:
                "Truman declines Stalin's request outright, and the Soviet landing planned for Hokkaido is abandoned, helped by the limits on Soviet sealift, which Manchuria and the Kurils had already stretched. Japan is occupied as a single unit under MacArthur, a decision with large consequences for its postwar reconstruction, political stability and alignment.",
            },
            {
              label: "Grant a limited Soviet occupation zone on northern Hokkaido, mirroring the German precedent",
              advisor: { name: "Marshall", position: "The Allies have accepted a divided Germany rather than fight the Soviets over the difference, and it is doubtful that Japan is the hill either government wants to draw that line on again so soon." },
              setFlags: { hokkaidoPath: "granted" },
              impact: { readiness: -1, pipeline: 0, initiative: -2 },
              next: "theEmperorQuestion45",
              outcome:
                "Speculative. Stalin's request was taken seriously enough in Washington to need an explicit refusal, and some historians treat a divided Japan as a live possibility. A Soviet-administered northern zone, like divided Germany and later divided Korea, would have changed Japan's Cold War alignment and constitutional settlement, and perhaps the shape of East Asian politics for the rest of the century. The game does not try to project that.",
            },
          ],
        };
        },
        get theEmperorQuestion45() {
          return {
          date: "SEPTEMBER 1945",
          title: "The Emperor Question",
          historicalRecord: true,
          situation:
            "With the surrender signed aboard Missouri on September 2, the shape of the occupation depends on one decision: what happens to Hirohito. Some voices in Washington and in Allied governments want him tried as a war criminal, as Tojo's cabinet will be. MacArthur's own view from the ground is that prosecuting the Emperor risks an uprising in a country whose social order runs through the throne. The decision has to be made before the occupation's first administrative order goes out.",
          choices: [
            {
              label: "Preserve the imperial institution: retain Hirohito as a symbolic figurehead, prosecute the war cabinet instead",
              advisor: { name: "MacArthur", position: "If the Emperor is tried, the occupation will need up to a million more troops than it has, and if he keeps the throne it can be governed with the force already there." },
              historical: true,
              setFlags: { emperorPath: "preserve" },
              impact: { readiness: 1, pipeline: 0, initiative: 1 },
              next: "occupationAuthority45",
              outcome:
                "Hirohito keeps the throne, stripped of the doctrine of divinity, while Tojo and the war cabinet are tried and, in several cases, executed. The occupation proceeds with the order MacArthur predicted, and a constitutional monarchy under American oversight becomes the postwar settlement of the real war.",
            },
            {
              label: "Include the Emperor among those tried for the war: apply the same standard used against his cabinet",
              advisor: { name: "Webb", position: "Testimony implicates the government at every level below the throne, and it is not comfortable to pretend that the throne itself bears no responsibility for what was done in its name." },
              setFlags: { emperorPath: "prosecute", cohesion: (flags.cohesion || 0) - 2 },
              impact: { readiness: -3, pipeline: -1, initiative: -2 },
              next: "occupationAuthority45",
              outcome:
                "A modeled alternative that some Allied governments and some of MacArthur's critics at home argued for. Whether it would have produced the resistance MacArthur predicted, or a harder but survivable transition, is disputed among historians of the occupation. The smoother settlement of the real war was bought by not testing the question.",
            },
          ],
        };
        },
        get occupationAuthority45() {
          const macArthurAbsent = flags.corregidorPath === "remained";
          const macArthurRelieved = flags.macArthurTensionPath === "relieved";
          const kyotoStruck = flags.kyotoPath === "struck";
          const kyotoRestoration = flags.kyotoAftermathPath === "restoration";
          const kyotoNote = kyotoStruck
            ? kyotoRestoration
              ? " The cultural-preservation commitment made in the war's final weeks, after Kyoto rather than Hiroshima took the first weapon, is no longer a stated intention. It's the occupation's actual policy now, tested for the first time against a country that watched what the alternative would have meant."
              : " Kyoto, not Hiroshima, took the first weapon in this history, and the occupation now administering Japan has already decided, deliberately, not to treat that as requiring any different a policy than the historical one would have used."
            : "";
          return {
          date: "SEPTEMBER 1945",
          title: macArthurAbsent
            ? "Command Without Its Commander"
            : macArthurRelieved
            ? "A Relieved General's Uncertain Legacy"
            : "One Man, One Occupation",
          historicalRecord: !macArthurAbsent && !macArthurRelieved && !kyotoStruck,
          situation: (macArthurAbsent
            ? "There is no MacArthur to hand the occupation to. Whatever became of him after Corregidor's fall, three years ago now, the man who historically administered Japan single-handedly for the next six years simply isn't available, and Washington has to decide who does the job instead, and how much personal authority to vest in whoever it is."
            : macArthurRelieved
            ? "MacArthur's relief earlier in the war left him without the standing the historical record gave him at this exact moment: sole occupation authority over Japan, granted with a degree of personal latitude Washington rarely extended to any single general. Whoever administers the occupation now inherits a version of that job without MacArthur's particular combination of theatrical authority and genuine administrative skill behind it."
            : "MacArthur is given something close to personal sovereignty over occupied Japan, an authority extraordinary even for military government: little oversight from Washington, direct control of policy from land reform to constitutional drafting, held for almost six years with little real check on his judgment.") + kyotoNote,
          choices: macArthurAbsent || macArthurRelieved
            ? [
                {
                  label: "Vest a single administrator with broad authority, following the historical model despite the change in personnel",
                  advisor: { name: "Eichelberger", position: "The job was not asked for and the man is not the one history would have chosen, and he will do it as well as it can be done by whoever is standing there." },
                  setFlags: { occupationPath: "singleAuthority" },
                  impact: { readiness: 1, pipeline: 0, initiative: 0 },
                  next: "END",
                  outcome:
                    "The historical model survives its own namesake's absence: broad, largely unchecked authority vested in a single administrator, just not the one history gave the job to. Whether that authority is wielded with anything like MacArthur's particular blend of theatrical confidence and genuine administrative competence is an open question left standing here, since the historical comparison it would need has no counterpart to check itself against.",
                },
                {
                  label: "Establish a more collegial Allied Control Council structure instead, distributing authority rather than concentrating it",
                  advisor: { name: "Attlee", position: "If no single figure commands the personal authority the Americans gave their general, there is no reason to manufacture one, and the Allied powers should share the responsibility as the Charter suggests." },
                  setFlags: { occupationPath: "councilStructure", cohesion: (flags.cohesion || 0) + 1 },
                  impact: { readiness: -1, pipeline: 1, initiative: -1 },
                  next: "END",
                  outcome:
                    "A different occupation structure than the historical record ever tested: authority distributed across an Allied council rather than concentrated in one general's hands, closer to the arrangement Britain and the Soviet Union both reportedly would have preferred historically, and were overruled on. Whether a council governs occupied Japan more slowly, more contentiously, or simply differently than MacArthur's singular authority did is a genuine counterfactual with no historical answer to check it against.",
                },
              ]
            : [
                {
                  label: "Grant MacArthur the full personal authority the historical occupation really gave him",
                  advisor: { name: "MacArthur", position: "The general did not come this far to administer the occupation by committee and asks for the authority the job requires, for which he will answer." },
                  historical: true,
                  setFlags: { occupationPath: "macArthurFull" },
                  impact: { readiness: 1, pipeline: 0, initiative: 1 },
                  next: "END",
                  outcome:
                    "MacArthur administers occupied Japan for the next six years with extraordinary personal authority, overseeing land reform, a new constitution and the country's postwar political shape largely on his own judgment, until Truman relieves him of his Korean command in 1951 in one of the most consequential civil-military confrontations in American history.",
                },
                {
                  label: "Constrain the occupation authority with a genuine Allied oversight council from the start",
                  advisor: { name: "Attlee", position: "The general's competence is not in doubt, but no single officer, however capable, should govern a defeated nation with so little oversight." },
                  setFlags: { occupationPath: "constrainedAuthority", cohesion: (flags.cohesion || 0) + 1 },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  next: "END",
                  outcome:
                    "A modeled alternative: real Allied oversight from the first year, in place of the largely nominal Far Eastern Commission that MacArthur mostly outmaneuvered or ignored. Land reform and constitutional drafting still happen, but more slowly and under a check that the real occupation conspicuously lacked.",
                },
              ],
        };
        },
        get pacificFirstGamble42() {
          return {
          date: "1942",
          title: "The Atlantic, Thinner",
          historicalRecord: false,
          situation:
            "Speculative. Winning the argument for near-parity Pacific resourcing at Arcadia gives King more of the fleet, more landing craft and more escort vessels than Europe First released to him this early. The Atlantic convoy escort runs thinner through the worst months of 1942's U-boat war, and the buildup for a cross-Channel invasion slips against a timetable Churchill's planners were already anxious about." +
            (flags.rangoonDefendResult === "worthIt"
              ? " Burma's own front, at least, isn't one of the places that extra resourcing had to be spent propping up: the Chinese divisions committed there actually bought real weeks before Rangoon fell, a rare piece of good news from a theater King's own Pacific-first case never had to account for."
              : flags.rangoonDefendResult === "wasted"
              ? " Burma's own front is one more place this resourcing fight didn't help: Rangoon fell anyway despite the cost of trying to hold it, a loss King's Pacific-first case has to be argued past rather than credited to."
              : ""),
          choices: [
            {
              label: "Press the Pacific advantage: accelerate the island campaigns while the resourcing edge lasts",
              advisor: { name: "King", position: "The argument was won, and the advantage should be spent before Marshall finds a reason to revisit it." },
              setFlags: { pacificFirstPath: "press", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: 1, pipeline: 2, initiative: 2 },
              disabledReason: meters.pipeline <= -3 ? "The Atlantic escort commitment is already stretched too thin to accelerate the Pacific timetable further without risking convoy losses this staff can't accept." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "chinaCrisisAllied44",
              outcome:
                "Speculative. A Pacific war run ahead of its real schedule, with more ships and landing craft and momentum banked while the Arcadia win holds. The cost to the Atlantic is the harder question: convoy losses in the U-boat 'Happy Time' of 1942 were already severe, and a thinner escort commitment makes them worse.",
            },
            {
              label: "Bank the resourcing win cautiously: use it to shore up defenses rather than accelerate offense",
              advisor: { name: "Nimitz", position: "Having more in reserve than expected does not oblige the Navy to spend it faster than it can use it well, and it is better banked against a bad month than burned to prove a point." },
              setFlags: { pacificFirstPath: "bank" },
              impact: { readiness: 2, pipeline: 1, initiative: -1 },
              next: "chinaCrisisAllied44",
              outcome:
                "Speculative. A more conservative use of the Arcadia win: stronger defenses at Hawaii and Australia in place of an accelerated offensive, and less strain on the Atlantic escort commitment than the aggressive path.",
            },
          ],
        };
        },
        get conservativePacific42() {
          return {
          date: "MID-LATE 1942",
          title: "The Fleet That Didn't Gamble",
          historicalRecord: false,
          situation:
            "Speculative. Declining the Midway ambush keeps three American carriers safe from the risk that the codebreaking was wrong or incomplete, but Japan's four fleet carriers, undefeated, remain free to choose the Pacific's next move. Hawaii and the Australia route are more heavily fortified than the real timeline required this early, at the cost of the initiative that the real gamble seized in one June morning.",
          choices: [
            {
              label: "Use the defensive posture to rebuild carrier strength before seeking battle on better terms",
              advisor: { name: "Nimitz", position: "The initiative was not lost but was declined for a single morning's bet, and the time that buys should be used." },
              setFlags: { conservativePath: "rebuild" },
              impact: { readiness: 2, pipeline: 0, initiative: -1 },
              next: "japanStrikesAgain42",
              outcome:
                "Speculative. A patient rebuilding strategy, banking new carrier construction, with Essex-class ships already working through the yards, against an undefeated Japanese carrier force that has a freer hand through the second half of 1942 than it had in the real war. Nimitz's staff know that hand will not sit idle.",
            },
            {
              label: "Accept a smaller-scale engagement to test the fleet without risking the full commitment Midway would have required",
              advisor: { name: "Fletcher", position: "The choice is not between the big gamble and doing nothing, and the fleet can probe and learn something without staking three carriers on a single roll." },
              setFlags: { conservativePath: "probe" },
              impact: { readiness: -1, pipeline: 0, initiative: 1 },
              next: "japanStrikesAgain42",
              uncertain: [
                {
                  weight: modWeight(45, meters.readiness),
                  title: "The probe draws real blood without real exposure",
                  setFlags: { conservativeProbeResult: "productive" },
                  impact: { readiness: 1, pipeline: 0, initiative: 1 },
                  outcome:
                    "Speculative. The limited engagement does damage to a Japanese screening force without the full carrier commitment Midway would have needed, a real lesson bought at a limited price.",
                },
                {
                  weight: (() => { const w = modWeight(45, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The probe teaches less than hoped, at a cost anyway",
                  setFlags: { conservativeProbeResult: "costly" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome. The limited engagement costs ships and aircrew without producing the clean lesson the smaller stakes were meant to guarantee. Combined Fleet remains undefeated, and this fleet has less to show for the probe than the caution behind it was meant to buy.",
                },
              ],
              outcome:
                "Speculative. A limited engagement: smaller stakes, smaller lessons, and a Japanese carrier fleet that remains undefeated whatever the outcome. The next move belongs to Combined Fleet.",
            },
            ...(meters.readiness >= 3
              ? [
                  {
                    label: "Rebuild and probe simultaneously: the fleet has enough depth now to do both rather than choose",
                    advisor: { name: "Nimitz", position: "The fleet has the depth to run both approaches at once, which was not expected when the staff first proposed choosing one, and there is no reason to keep choosing one now." },
                    setFlags: { conservativePath: "both" },
                    impact: { readiness: 1, pipeline: -2, initiative: 1 },
                    next: "japanStrikesAgain42",
                    outcome:
                      "A position the threadbare mid-1942 Pacific Fleet never had the carrier depth to occupy: real rebuilding of Essex-class strength continues undiminished, while a genuine probing engagement still tests the fleet against Combined Fleet's screening forces, rather than needing to spend the same limited hulls on one approach at the expense of the other.",
                  },
                ]
              : []),
          ],
        };
        },
        get japanStrikesAgain42() {
          return {
          date: "MID-LATE 1942",
          title: "The Fleet That Wasn't Beaten",
          historicalRecord: false,
          situation:
            "Speculative. Declining Midway leaves Japan's four fleet carriers undamaged, and Combined Fleet staff, with none of the losses a decisive battle would have cost them, are reported turning toward Operation FS, the plan to seize Fiji and New Caledonia and cut Australia off, which was shelved in the real war for lack of the carrier strength this fleet still has. Nimitz has three carriers against four undamaged ones and no Midway-sized ambush left to even the odds." +
            (flags.conservativePath === "rebuild"
              ? " The decision to spend the time since Midway rebuilding rather than probing for an opening is exactly why three carriers, not fewer, are what's actually available to answer this with."
              : flags.conservativePath === "probe"
              ? " The probing posture chosen since Midway cost real carrier time this fleet could have spent rebuilding instead, time that isn't available to spend twice."
              : flags.conservativePath === "both"
              ? " Attempting both rebuilding and probing at once since Midway has left this fleet with neither the full carrier strength a pure rebuild would have banked nor the intelligence picture a full probe would have bought."
              : "") +
            (flags.conservativeProbeResult === "productive"
              ? " The probe this fleet ran instead of the full Midway gamble actually paid off, real damage on a Japanese screening force at limited cost, a rare recent win this staff can point to going into a fight against four undamaged carriers that offers considerably worse odds."
              : flags.conservativeProbeResult === "costly"
              ? " The probe this fleet ran instead of the full Midway gamble cost real ships and aircrew without teaching much, one more thin margin this staff is carrying into a fight against four undamaged carriers that already offered worse odds than Midway ever did."
              : ""),
          choices: [
            {
              label: "Commit everything to intercept before the invasion convoys land: worse odds than Midway ever offered, but a chance to stop it",
              advisor: { name: "Nimitz", position: "There are no Midway odds to offer, only a choice between a bad fight now and letting Australia's lifeline be cut while waiting for a better one that is not coming." },
              setFlags: { fsAlliedPath: "intercept" },
              impact: { readiness: -4, pipeline: -1, initiative: 2 },
              next: "chinaCrisisAllied44",
              uncertain: [
                {
                  weight: modWeight(30, meters.readiness),
                  title: "The three-carrier fleet draws blood before it has to break off",
                  setFlags: { fsAlliedResult: "costlyWin" },
                  impact: { readiness: 1, pipeline: 0, initiative: 2 },
                  outcome:
                    "Speculative, and the rarer outcome. Outnumbered four to three, with no surprise and no codebreaking edge, the fleet still damages the invasion force badly enough to force a withdrawal, at a cost in ships and aircrew that it has no surplus to spend.",
                },
                {
                  weight: (() => { const w = modWeight(30, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The numbers hold, and the fleet has to break off",
                  setFlags: { fsAlliedResult: "forcedWithdrawal" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier outcome. Four undamaged carriers against three is not a fight this fleet can win, and the engagement costs ships to buy time and not a victory. The forced withdrawal keeps the fleet in being.",
                },
              ],
              outcome:
                "Speculative. A long-odds engagement, without the intelligence advantage or the rough parity Midway offered. There is no anchor in the record for how three carriers fare against four undamaged ones with surprise gone. The stakes are plain: Australia's supply line and the Southwest Pacific timetable ride on a fight the real Pacific Fleet never had to fight on these terms.",
            },
            {
              label: "Withdraw further: trade New Caledonia and Fiji for time, bank on Essex-class carriers reaching the fleet by 1943",
              advisor: { name: "King", position: "Losing an island chain costs less than losing the fleet that is meant to retake it, and the yards are building carriers Japan cannot match, so the Navy should still exist when they arrive." },
              setFlags: { fsAlliedPath: "withdraw" },
              impact: { readiness: 2, pipeline: -3, initiative: -2 },
              next: "chinaCrisisAllied44",
              outcome:
                "Speculative. A patient trade: the South Pacific's forward positions are conceded to a Japanese fleet still undefeated, against the production advantage that made the real war's outcome certain whatever any single battle did. Whether Australia's supply survives the wait is open, and this fleet fights the rest of the Pacific war from a worse starting position than the real one.",
            },
          ],
        };
        },
      }[id];
    },
    positionLabel(flags, meters) {
      if (flags.relieved) return "The Coalition Comes Apart";
      if (flags.combinedPressureResult === "shortened") return "A Shorter Final Act";
      // These three come before the standoffPath checks below for the same reason the
      // IGHQ endgame cluster's deepest-state checks were moved to the top of that
      // campaign's positionLabel earlier this session: neitherTestedResult/Path represent
      // a further, more specific continuation of the same "pressWar" thread, and the
      // title should reflect how the resulting war actually went, not just that a slower
      // declaration happened. Before this fix, all three of these terminal states fell
      // through to the shallower "A Slower, Angrier War" title regardless of how the
      // first contact between the two untested forces actually resolved.
      if (flags.neitherTestedResult === "americanWin") return "The Fleet the Act Built Anyway";
      if (flags.neitherTestedResult === "costlyDraw") return "What Urgency Was Actually Worth";
      if (flags.neitherTestedPath === "reconnoiter") return "First Contact, Held";
      if (flags.standoffPath === "pressWar" && flags.declarationPath === "forceVote") return "A Vote Forced, and Won";
      if (flags.standoffPath === "pressWar") return "A Slower, Angrier War";
      if (flags.warWithoutAmericaFinalPath === "maintainStandoff") return "Manchuria, Not Hiroshima";
      if (flags.warWithoutAmericaFinalPath === "lateEngagement") return "A Seat Bought Late";
      if (flags.kyotoPath === "struck" && flags.kyotoAftermathPath === "restoration") return "Stimson's Warning, Answered";
      if (flags.kyotoPath === "struck") return "Stimson's Warning, Ignored";
      if (flags.yamamotoInterceptPath === "declined") return "The Admiral Who Wasn't Removed";
      if (flags.peleliuPath === "cancelled") return "The Landing That Never Happened";
      if (flags.stilwellFatePath === "preserved") return "The General Who Stayed";
      if (flags.halseyAftermathPath === "singleDoctrine") return "One Doctrine, No Second Chair";
      if (flags.halseyAftermathPath === "restoredAlternation") return "A Less Famous Hand on the Wheel";
      if (flags.occupationPath === "singleAuthority") return "Command Without Its Commander";
      if (flags.occupationPath === "councilStructure") return "The Council MacArthur Never Allowed";
      if (flags.hokkaidoPath === "granted" && flags.emperorPath === "preserve") return "A Second Korea, A Kept Throne";
      if (flags.hokkaidoPath === "granted" && flags.emperorPath === "prosecute") return "Divided Ground, No Institution Spared";
      if (flags.hokkaidoPath === "refused" && flags.emperorPath === "preserve") return "Japan, Kept Whole";
      if (flags.hokkaidoPath === "refused" && flags.emperorPath === "prosecute") return "One Occupation, No Exceptions";
      if (flags.differentPacificFinalPath === "acceptTrade") return "The Cost of the Other Road";
      if (flags.differentPacificFinalPath === "acceptUncertainty") return "An Honest Silence at the End";
      return "A Different Command";
    },
    epilogue(flags, meters) {
      const opening = flags.arcadiaPath === "pacificParity"
        ? "A war that pressed for Pacific parity at Arcadia over King's own objections to Europe First, "
        : "A war that confirmed Europe First at Arcadia, ";
      if (flags.combinedPressureResult === "shortened") {
        return "Downfall and Starvation ran together in this war's final weeks, a position the actual Joint Chiefs never had the supply picture to support. Facing a blockade already visibly tightening and an invasion fleet visibly ready to sail rather than either threat in the abstract, the war ministry's real, historical deadlock broke days faster than it actually took, a shorter final act bought by resources the historical planning never had to spend running two strategies instead of choosing one.";
      }
      if (flags.neitherTestedResult === "americanWin") {
        return opening + "and followed the slower declaration all the way to its own first contact: a resource area Japan had a year or more to fortify or expand unopposed, met by a Two-Ocean Navy Act fleet that exists on schedule regardless of when Congress actually voted, crewed by a force trained at the pace an unshocked nation funded rather than the pace Pearl Harbor's real urgency demanded. Matériel and numbers carried the engagement anyway, an answer tested rather than assumed, to a question the historical war's own galvanizing morning never had to ask: whether hulls and aircraft built on schedule outweigh a training pipeline built without wartime urgency behind it.";
      }
      if (flags.neitherTestedResult === "costlyDraw") {
        return opening + "and followed the slower declaration all the way to its own first contact, where the training gap cost more than the fleet's own equipment advantage covered. A resource area Japan spent a year fortifying or expanding unopposed met a force whose ships existed on the Two-Ocean Navy Act's own schedule but whose crews trained at the pace an unshocked Congress funded, and the difference showed. Neither side's planners projected a fight this costly going in. Urgency, this war's own galvanizing morning apparently did real work the historical Navy's training pipeline never had to reckon with the absence of.";
      }
      if (flags.neitherTestedPath === "reconnoiter") {
        return opening + "and followed the slower declaration to the edge of its own first contact, then chose not to complete it. A resource area Japan spent a year consolidating unopposed, and a Navy this war's own slower mobilization built without Pearl Harbor's urgency behind it, meet for the first time and immediately step back from each other, real intelligence gathered rather than a decisive engagement risked. What either force actually is, tested against the specific other rather than assumed, is a question this thread closes without answering, honestly, because the real war it diverges from never had cause to ask it either.";
      }
      if (flags.standoffPath === "pressWar" && flags.declarationPath === "forceVote") {
        return "The war against Japan gets fought anyway, not built case by case but forced onto the floor early and won by a margin narrower than the historical declaration ever needed. It arrives later, angrier about the delay, and with the Philippines already lost before the first American shot is fired. The gamble that could have cost the argument its own momentum instead cut months off the wait, a riskier road to the same war, and one Congress had no guarantee of landing this way.";
      }
      if (flags.standoffPath === "pressWar") {
        return "The war against Japan gets fought anyway, built one senator at a time rather than unified by a single morning, hearings and documented reports out of the occupied Philippines standing in for the headline Pearl Harbor never had to provide. It arrives later, angrier about the delay, and with the Philippines already lost before the first American shot is fired. Whatever unity the historical attack provided overnight, this Congress had to construct for itself, the hard way, against an isolationist bloc that never had to be defeated in a single morning's argument.";
      }
      if (flags.warWithoutAmericaFinalPath === "maintainStandoff") {
        return "A war that never once involved American combat forces ends the way it was always going to end without them: on the Soviet Union's own timetable, for the Soviet Union's own reasons, with Manchuria rather than Hiroshima as the shock that finally breaks Japan's war cabinet. No atomic bomb was ever built for a war America wasn't fighting, and none was needed once an army Tokyo considered its strongest collapsed in a week regardless. What settles the postwar order isn't abstract: it's " +
          (flags.britainAsiaPath === "conditionalCommitment" ? "a Britain moved not by preference but by a real, binding Lend-Lease commitment Washington actually attached to retaking Burma, " : flags.britainAsiaPath === "encouraged" ? "a Britain that moved on Churchill's own instinct to contest empire rather than defer it, " : "a Britain that settled into Wavell's own caution, empire's reconquest banked rather than attempted, ") +
          (flags.japanExpansionPath === "credited" ? "an unopposed Japan Washington worried still had room left to expand, " : "an unopposed Japan whose own fuel and shipping ceiling did the limiting that no outside power had to, ") +
          (flags.chinaCivilWarPath === "observerMission" ? "a Chinese civil war Washington actually sent real observers into, gathering direct intelligence rather than trading polite cables from a distance, " : flags.chinaCivilWarPath === "contact" ? "a Chinese civil war Washington chose to at least watch rather than let settle in total blindness, " : "a Chinese civil war settled entirely without American knowledge, aid, or influence, ") +
          (flags.dutchExilePath === "materialProposal" ? "and a Dutch colonial argument Washington backed with real material weight, the same administrative arrangement already standing in Dutch Guiana, offered rather than just preferred." : flags.dutchExilePath === "sympathyForAccommodation" ? "and a Dutch colonial argument Washington's sympathy, toothless as it was, nudged toward accommodation." : "and a Dutch colonial argument left entirely to London and Batavia to resolve.") +
          " The country that spent four years choosing not to fight has, by its own consistent logic, very little claim to a voice in any of it now.";
      }
      if (flags.warWithoutAmericaFinalPath === "lateEngagement") {
        return "A war that never once involved American combat forces ends on the Soviet Union's own timetable regardless, Manchuria rather than Hiroshima the shock that finally breaks Japan's war cabinet, four years of principled non-engagement broken only at the very end, when Washington finally reenters a conversation it spent the whole war choosing not to join. What it's reentering isn't abstract: it's " +
          (flags.britainAsiaPath === "conditionalCommitment" ? "a Britain moved not by preference but by a real, binding Lend-Lease commitment Washington actually attached to retaking Burma, " : flags.britainAsiaPath === "encouraged" ? "a Britain that moved on Churchill's own instinct to contest empire rather than defer it, " : "a Britain that settled into Wavell's own caution, empire's reconquest banked rather than attempted, ") +
          (flags.japanExpansionPath === "credited" ? "an unopposed Japan Washington worried still had room left to expand, " : "an unopposed Japan whose own fuel and shipping ceiling did the limiting that no outside power had to, ") +
          (flags.chinaCivilWarPath === "observerMission" ? "a Chinese civil war Washington actually sent real observers into, gathering direct intelligence rather than trading polite cables from a distance, " : flags.chinaCivilWarPath === "contact" ? "a Chinese civil war Washington chose to at least watch rather than let settle in total blindness, " : "a Chinese civil war settled entirely without American knowledge, aid, or influence, ") +
          (flags.dutchExilePath === "materialProposal" ? "and a Dutch colonial argument Washington backed with real material weight, the same administrative arrangement already standing in Dutch Guiana, offered rather than just preferred." : flags.dutchExilePath === "sympathyForAccommodation" ? "and a Dutch colonial argument Washington's sympathy, toothless as it was, nudged toward accommodation." : "and a Dutch colonial argument left entirely to London and Batavia to resolve.") +
          " Whether a seat claimed this late carries the weight of one earned by the fighting this country specifically declined to do is a question the postwar settlement will spend years answering, not this one final choice.";
      }
      if (flags.kyotoPath === "struck" && flags.kyotoAftermathPath === "restoration") {
        return "Kyoto, not Hiroshima, took the first weapon. Over a thousand years of temples, shrines, and archives with no second copy anywhere in the world went with the people who were there to tend them, at a scale the historical Hiroshima toll didn't reach, in a city the firebombing campaign had deliberately left untouched specifically so the weapon's effects could be measured against an intact baseline. Stimson's own real, documented fear, that this loss would poison whatever relationship the occupation needed to build afterward, became the actual condition his own occupation policy had to answer for, and did: cultural preservation became explicit occupation priority, not because it could undo anything, but because the alternative was pretending the loss required no different an answer than any other wartime decision. Whether an occupier's stated commitment to what's left means anything to a population that watched what happened to what wasn't isn't a question policy documents settle. It's a question the decades since have to keep answering.";
      }
      if (flags.kyotoPath === "struck") {
        return "Kyoto, not Hiroshima, took the first weapon. Over a thousand years of temples, shrines, and archives with no second copy anywhere in the world went with the people who were there to tend them, at a scale the historical Hiroshima toll didn't reach, in a city the firebombing campaign had deliberately left untouched specifically so the weapon's effects could be measured against an intact baseline. Stimson's own real, documented fear, that a loss like this would poison whatever relationship the occupation needed to build afterward, was treated here as one wartime cost among many rather than a condition requiring its own answer. Whether that reads, to the country being occupied, as consistency or as indifference was never actually decided. It just happened, the way most of this history did.";
      }
      if (flags.yamamotoInterceptPath === "declined") {
        return "Yamamoto lives past April 1943, the one clean divergence point in a war whose broader shape moves on almost entirely without regard for it. Guadalcanal's exhaustion, the Central Pacific's atoll-by-atoll grind, Leyte, Iwo Jima, Okinawa, and the two cities the historical record actually lost to atomic weapons all still land within the historical window, because the oil, shipping, and production arithmetic that actually decided this war was never something one admiral's survival could rewrite. What's different is smaller and more specific: a fleet that spent real resources managing an uncertainty the historical Pacific Fleet never had to carry, and a strategic mind that kept arguing, right up until whatever end this war actually found him, that Japan's only real chance had already closed before most of this war was fought.";
      }
      if (flags.peleliuPath === "cancelled") {
        return "Stalemate II never happens, and the Palaus garrison sits bypassed rather than fought for, a real, specific difference against a war whose broader shape barely notices it. The Philippines campaign, Iwo Jima, Okinawa, and the atomic decisions that actually ended the war keep to almost exactly the historical calendar regardless, since two freed divisions were only ever going to change one theater's arithmetic, not the whole war's. What's different is countable and real: a battle some historians still call the war's least necessary simply doesn't happen, and the men who would have fought it get spent, if they get spent at all, somewhere this history had to decide for itself rather than inherit from the record.";
      }
      if (flags.stilwellFatePath === "preserved") {
        return "Stilwell stays in China on a narrower mandate than the ultimatum that started this argument ever asked for, a real, specific difference against a broader war that mostly doesn't care. Ichi-Go succeeds regardless, since it was never actually a command-structure problem for any American general to solve, and the island campaigns, the atomic decisions, and the war's actual ending hold to essentially the same timing, untouched by who did or didn't hold a liaison post in Chungking. What's different is smaller and more personal: one man's specific, difficult relationship with China's wartime government continues instead of ending in an October recall, for whatever that continuity was actually worth to a war it never had the power to redirect.";
      }
      if (flags.chinaAloneAidResult === "shifted") {
        return "The United States chooses the middle path: matériel, but not divisions, for China's own six-year war against Japan, and against the odds, it's enough. Chinese forces, better armed for the first time in years, finally push back in ways six years of stalemate never allowed for. Not a war won, but a war that starts moving, on the strength of trucks and aircraft rather than a declared alliance the United States never actually needed to enter.";
      }
      if (flags.chinaAloneAidPath === "materiel") {
        return "The United States chooses the middle path: full commitment to the war in Europe, and matériel, but not divisions, for China's own six-year war against Japan. Aircraft and trucks reach Chungking through the same difficult supply lines the historical alliance struggled with, without the American combat presence that came alongside it historically. More than nothing. Considerably less than an actual ally.";
      }
      if (flags.chinaAloneAidPath === "none") {
        return "The United States holds to Europe First as a literal doctrine rather than a slogan abandoned once it becomes uncomfortable to watch what it costs everyone left outside it. China's war against Japan continues exactly as unsupported as it would have without the historical alliance at all, and the occupied Philippines, Malaya, and the Indies remain occupied by an empire no outside power is contesting militarily, a cost, not a softened one, for the people left to fight it alone.";
      }
      if (flags.chinaAloneAidPath === "volunteers") {
        return "The United States finds the same deniable middle ground the real 1941 government found once already: American pilots resign their commissions and fly for China as technical mercenaries, real combat power without a declaration attached to it. It's the boldest posture available short of an actual alliance, and it's still, by design, not one. China gets American aircrew in its skies. It does not get an American ally on paper, and the distinction is the entire point of the arrangement.";
      }
      if (flags.halseyAftermathPath === "singleDoctrine") {
        return "A fleet that fights its entire final year, Iwo Jima, Okinawa, and whatever Downfall or blockade follows, under a single, consistent doctrine rather than alternating between two commanders' really different instincts. Spruance's caution costs the aggressive pursuit Halsey's style occasionally bought, and buys a fleet that never again sails into a typhoon it should have seen coming. The rest of the war's actual shape, the islands still to be taken, the war's actual conclusion still to be decided, unfolds on nearly the same calendar regardless of which admiral's temperament was running the fast carriers.";
      }
      if (flags.halseyAftermathPath === "restoredAlternation") {
        return "The typhoon that killed nearly 800 sailors got a reckoning this time: Halsey relieved, and the alternating command structure he was half of restored under a name history never had reason to record. The planning advantage the system was built for survives him for whatever remains of the war, Iwo Jima, Okinawa, and the war's actual conclusion beyond them, showing up within days of when they actually did. The specific aggressive instinct Halsey personally brought to the arrangement doesn't survive him, replaced by whoever took the second chair instead.";
      }
      if (flags.occupationPath === "singleAuthority") {
        return "MacArthur never lived to administer this occupation, and Washington vested his authority in Eichelberger instead, following the historical model of near-total personal command right down to the officer's own acknowledgment that history hadn't chosen him for the job. Whether unchecked personal authority works the same way regardless of who holds it, or whether it was always specifically MacArthur's particular blend of theater and administrative skill that made the historical arrangement work, was never put to the test.";
      }
      if (flags.occupationPath === "councilStructure") {
        return "With no single figure commanding the personal authority MacArthur held historically, occupied Japan is governed instead by a genuine Allied council, the shared-authority arrangement Britain and the Soviet Union both reportedly preferred and were overruled on in the real history. Land reform and constitutional drafting happen more slowly and more contentiously than the historical MacArthur's largely unilateral six years, a really different occupation than the record ever tested.";
      }
      // Real, checked figures: the actual 1945 planning estimates for Operation Downfall
      // varied enormously depending on which staff produced them and what assumptions
      // they used, from the Sixth Army's own ~125,000 battle-casualty estimate for
      // Kyushu alone to a Stimson-commissioned study projecting 1.7–4 million American
      // casualties if Japanese civilians fought too. The 500,000 Purple Heart medals
      // manufactured in advance are a real, physical, still-partly-unissued stockpile —
      // the US military was still awarding Purple Hearts from that same WWII order as
      // of the Iraq and Afghanistan wars, decades later. Genuinely disputed among
      // historians, not settled here: whether the highest estimates reflected honest
      // planning uncertainty or were emphasized after the fact to justify a decision
      // already made on other grounds. Both readings are real positions in the actual
      // historiography, not invented for this game.
      const downfallCasualtyNote = flags.endgameAlliedPath === "downfall"
        ? " The invasion this occupation follows from was never tested against a single number: Sixth Army's own planners put Kyushu alone at roughly 125,000 battle casualties, while a study commissioned for Stimson's own staff projected 1.7 to 4 million American casualties if Japanese civilians fought too, a spread historians still argue reflects either honest uncertainty or a case built after the fact. What's certain and not disputed: the US government manufactured half a million Purple Heart medals in advance, a stockpile large enough that the military was still issuing decorations from that same order more than seventy years later, in Iraq and Afghanistan."
        : "";
      if (flags.hokkaidoPath === "granted" && flags.emperorPath === "preserve") {
        return "Japan surrenders into an occupation split along roughly the same logic as divided Germany, a Soviet-administered northern zone on Hokkaido, and a throne left standing under American oversight regardless." +
          (flags.occupationPath === "macArthurFull" ? " MacArthur administers all of it, undivided authority over a divided country, for the next six years." : flags.occupationPath === "constrainedAuthority" ? " A genuine Allied oversight council checks even this divided occupation's administration from the start, rather than leaving it to one general's judgment." : "") +
          " A divided country with an intact imperial institution is a different postwar settlement than either the historical one or the fully divided alternative, the most consequential Allied-side counterfactual here, layered with a second, related one that doesn't have the standing to project forward either." +
          downfallCasualtyNote;
      }
      if (flags.hokkaidoPath === "granted" && flags.emperorPath === "prosecute") {
        return "The most consequential double departure from the historical record produced here: a divided Japan, split like Germany, with no institution, not the throne, not the war cabinet, spared the tribunal. Whether an occupation carrying both burdens at once holds together at all is uncertain. Anyone who lived through the actual single-burden occupation would likely call this the least probable of the ways things could have gone, kept in because the underlying fork was worth taking seriously on its own terms regardless." +
          downfallCasualtyNote;
      }
      if (flags.hokkaidoPath === "refused" && flags.emperorPath === "preserve") {
        return "Japan surrenders into a single American-administered occupation, Stalin's request for a northern zone refused outright, and Hirohito retains the throne under American oversight. This is, in both its major particulars, what happened, and the postwar settlement it produced, a unified, stable occupation and a constitutional monarchy, shaped nearly everything about Japan's reconstruction that came after." +
          downfallCasualtyNote;
      }
      if (flags.hokkaidoPath === "refused" && flags.emperorPath === "prosecute") {
        return "A unified American occupation, the kind that historically ran smoothly in large part because it never tested the Emperor question at all, now tests it anyway. Whether MacArthur's real prediction of occupation-collapsing unrest was accurate or overstated is a genuine dispute, never put to the test; what's certain is that the smoother real occupation was never free, it was bought specifically by leaving this exact question unasked." +
          downfallCasualtyNote;
      }
      if (flags.differentPacificFinalPath === "acceptTrade") {
        return opening + "and fought a honestly different middle, a declined Midway ambush, or every Central Pacific atoll taken by direct assault instead of bypassed, converges back toward its historical shape at the finish anyway. The bomb, the Soviet declaration, and Japan's cabinet deadlock land almost exactly when they actually did, largely indifferent to which operational road got the fleet to 1945. What changed, put plainly on the record rather than left in this fleet's own files, sits beside the documented total for this theater, a little over 111,000 American dead: not a different destination, but a real, countable addition to or subtraction from that number, depending on which road actually got walked.";
      }
      if (flags.differentPacificFinalPath === "acceptUncertainty") {
        return opening + "and fought a different middle, reaches its final chapter choosing not to reduce that divergence to a single number. American industrial capacity and the Manhattan Project weren't contingent on any of these operational choices, and the war's broad ending was never fully up for grabs regardless. What this specific road changed about the fleet's condition and the war's real cost stays real without being reduced to a precision even the official postwar casualty count, by its own compilers' admission, couldn't fully claim for every category it tried to reconcile.";
      }
      if (flags.philippinesPath === "bypassFormosa") {
        return "The Philippines were bypassed for Formosa, the shorter geographic route the actual Joint Chiefs debate seriously considered and set aside. Filipino civilians remain under occupation through the war's final year on this path, a cost stated plainly rather than resolved, in exchange for a faster approach to the home islands that MacArthur's actual historical argument, moral as much as strategic, didn't allow to happen.";
      }
      return "The war reaches its historical conclusion by whatever route this history's specific choices carved to it, an ending the broad record would still recognize even where the path here diverged from it in the details.";
    },
  },
};


// ---------- STYLE HELPERS ----------
// The artifact environment ships only Tailwind's precompiled core classes — arbitrary
// values like text-[#ffffff] are never generated. This stylesheet implements every
// arbitrary class this file uses, so the classes behave as written.
