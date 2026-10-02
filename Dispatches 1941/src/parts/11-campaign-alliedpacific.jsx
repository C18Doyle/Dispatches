  alliedPacific: {
    id: "alliedPacific",
    seal: "CINCPAC",
    name: "Allied Pacific Command",
    dates: "Beginning 1941",
    brief: "Direct the Allied war against Japan from the embargo decision through the surrender, balancing Washington's Europe-first doctrine, MacArthur's promises, and a coalition that includes Britain, China, and Australia, none of whom want quite the same war you do.",
    teaser: "One war, four allies, and no agreement on how to win it.",
    accent: "#28497a",
    dynamic: true,
    intro: "July 1941. Japan has just occupied southern Indochina, and how strictly Washington enforces the resulting freeze on Japanese assets is still a honestly open administrative question. This command is about to help answer it, for better or worse.",
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
              advisor: { name: "Acheson", quote: "I am not aware of an ambiguity in the freezing order that requires me to issue licenses I don't believe this administration wants issued. If the President wants oil flowing to Japan, he can say so directly." },
              historical: true,
              setFlags: { embargoPath: "total", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: 0, pipeline: 1, initiative: 1 },
              next: "wakeIslandRelief41",
              outcome:
                "The freeze becomes, in practice if not in explicit policy, a complete embargo. Japan's oil reserves start their real countdown from this administrative decision as much as from any formal declaration, and the eighteen-month clock the fleet in Tokyo is already running against starts here. Roosevelt reportedly wanted to preserve some flexibility in the freeze; the bureaucracy that implemented it read the order more literally, and by the time anyone senior enough to calibrate it notices, the embargo has already hardened into policy by default.",
            },
            {
              label: "Intervene to calibrate the embargo: issue licenses permitting limited oil shipments",
              advisor: { name: "Grew", quote: "This government's mood has shifted for a decade under my watch, and I am telling Washington plainly: a total cutoff does not make Japan back down. It makes the faction that already wants war impossible to argue against." },
              setFlags: { embargoPath: "calibrated", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: 1, pipeline: -1, initiative: -1 },
              next: "wakeIslandRelief41",
              uncertain: [
                {
                  weight: 30,
                  title: "Grew's warning holds: the war faction loses its strongest argument",
                  setFlags: { embargoResult: "avoided" },
                  impact: { readiness: 1, pipeline: 0, initiative: 0 },
                  next: "aStandoffInsteadOfAWar41",
                  outcome:
                    "The rarer, more speculative branch: a calibrated embargo denies Tokyo's war faction the deadline argument that historically carried the room, and the collision Grew's cables warned about doesn't arrive on the historical schedule. Whether it's avoided or merely delayed is a question that doesn't get answered here.",
                },
                {
                  weight: 70,
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
              advisor: { name: "Roosevelt", quote: "If this government is going to embargo Japan's oil, I would rather it be my decision, made in public, than a filing-cabinet judgment nobody signed their name to. Say what we're really doing." },
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
          return dataNode(ALLIED_PACIFIC_DATA, "aStandoffInsteadOfAWar41");
        },
        get theSlowerDeclaration42() {
          return dataNode(ALLIED_PACIFIC_DATA, "theSlowerDeclaration42");
        },
        get warBeginsLate42() {
          return dataNode(ALLIED_PACIFIC_DATA, "warBeginsLate42");
        },
        get theUnopposedConsolidation42() {
          return {
          date: "LATE 1942",
          title: "A Resource Area With Nobody Contesting It",
          historicalRecord: false,
          speculative: true,
          situation:
            "Roughly a year of unopposed administration is a real, specific kind of time, and this resource area has had it: no historical raiding, no submarine interdiction worth the name, no Doolittle-style shock to answer for, just the accumulated ordinary business of running an occupied territory with nobody contesting the sea lanes around it. The Two-Ocean Navy Act's own eighteen fleet carriers and seven battleships are still maturing on a schedule this occupation's own success or failure never had the power to interrupt, the same production math that governed the delayed-strike thread's own fleet. What this year has actually bought, on the ground, in Java's oil fields and Malaya's rubber plantations, is the open question. The Dutch administration's own demolition planning, the real historical precedent that cut Japan's actual wartime oil output to a fraction of capacity, has had a full extra year either to be reinforced against exactly this scenario, or to lapse the way undisturbed wartime readiness always tends to when the attack it was built for never comes.",
          choices: [
            {
              label: "Spend the year on defense: fortify the perimeter, harden the approaches, assume whatever American force eventually arrives will come looking for a fight",
              advisor: { name: "Terauchi", quote: "A year with nobody testing us is not a year to spend guessing what we could still take. It is a year to spend making certain nothing we already hold is easy to retake." },
              setFlags: { consolidationPath: "fortify" },
              impact: { readiness: 2, pipeline: 1, initiative: -1 },
              next: "twoForcesNeitherTested43",
              outcome:
                "A real, if unglamorous, use of unopposed time: coastal defenses, garrison strength, and air-base construction across the resource area's own perimeter, built to a standard the historical occupation, constantly managing active threats elsewhere, never had the uninterrupted year to fully complete. Whether fortification this thorough matters against a force that hasn't been specified yet is a question this choice defers rather than answers.",
            },
            {
              label: "Spend the year expanding: push the perimeter further out while nothing is actively contesting it, on the theory that unopposed time is a resource that stops being available the moment a war actually starts",
              advisor: { name: "Sugiyama", quote: "Every additional mile of perimeter we take now, uncontested, is a mile the eventual American advance has to cross later, contested. I would rather spend this year taking ground than sitting on what we already have." },
              setFlags: { consolidationPath: "expand" },
              impact: { readiness: -1, pipeline: -2, initiative: 2 },
              disabledReason: meters.pipeline <= -4 ? "There isn't fuel to garrison a wider perimeter on top of what's already held. Expansion needs a margin this pipeline level doesn't have." : undefined,
              gateCheck: { meter: "pipeline", threshold: -4, label: "Pipeline" },
              next: "twoForcesNeitherTested43",
              outcome:
                "A real bet that unopposed time is a depreciating asset best spent rather than banked: further outposts, a wider perimeter, more territory nominally held, at the direct cost of the fuel and readiness a defense-first year would have kept in reserve. Whether a wider perimeter is worth more than a harder one to crack is a trade this specific counterfactual, absent any historical case to check it against, has no real precedent to settle either way.",
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
            "What finally arrives to contest the resource area is a strange match, the CINCPAC mirror of a problem this whole counterfactual has run into before: neither side has fought the other. The Two-Ocean Navy Act's hulls exist on schedule regardless of anything Japan did or didn't do, so the ships are real and roughly where the historical 1943 Pacific Fleet would have been. What isn't the same is the crews, and the doctrine, and the urgency: a force built by a nation walked to war by hearings and atrocity reports rather than shocked into it by a single morning trains on a correspondingly less urgent timeline, conscription and flight training both running the peacetime-adjacent pace an unshocked Congress funded rather than the all-hands wartime pace Pearl Harbor actually produced. Across the water, a Japanese garrison that has had a full year to either fortify or expand, depending on what this staff chose to do with it, and just as little combat experience against this specific opponent as the opponent has against it." +
            (flags.consolidationPath === "fortify"
              ? " What's waiting for this force is a resource area hardened rather than widened, built on the assumption that whoever eventually arrived would be arriving to fight for it."
              : flags.consolidationPath === "expand"
              ? " What's waiting for this force is a resource area wider than the one it was briefed on, expanded on the theory that unopposed time doesn't last and territory taken while it's available doesn't have to be earned twice."
              : ""),
          choices: [
            {
              label: "Commit fully: bring this slower-trained, less battle-urgent force to a decisive engagement anyway, on the theory that matériel and numbers outweigh the experience gap on both sides",
              advisor: { name: "Nimitz", quote: "Neither side in this fight has faced the other before. I would rather find out what that actually means with the fleet the Two-Ocean Act gave us than wait for a more urgent one that isn't coming." },
              setFlags: { neitherTestedPath: "commit" },
              impact: { readiness: -3, pipeline: -1, initiative: 2 },
              uncertain: [
                {
                  weight: modWeight(35, meters.readiness),
                  title: "Matériel and numbers carry the day despite the training gap",
                  setFlags: { neitherTestedResult: "americanWin" },
                  impact: { readiness: 2, pipeline: 0, initiative: 2 },
                  outcome:
                    "The rarer, more consequential reading: a less urgently trained force, but a larger and better-equipped one, proves the Two-Ocean Navy Act's own hulls and aircraft mattered more than the training pipeline's peacetime pace cost them. The resource area's own fortification or expansion, whichever this staff chose, isn't enough to offset a materially larger fleet meeting it for the first time.",
                },
                {
                  weight: (() => { const w = modWeight(35, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The training gap costs more than the matériel advantage covers",
                  setFlags: { neitherTestedResult: "costlyDraw" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier reading: a peacetime-paced training pipeline, however well-equipped the force it produced, meets a garrison that has spent its own unopposed year preparing specifically for this, and the engagement costs considerably more than either side's own planners projected going in. Neither force's inexperience against this specific opponent resolves cleanly in either direction; both walk away having learned something the hard way that Pearl Harbor's real urgency taught the historical Navy months or years earlier.",
                },
              ],
              next: "END",
              outcome:
                "A real bet with no historical case to check it against: whether an unshocked nation's own slower, less urgent mobilization produces a force that wins on matériel despite it, or loses ground it should have held because urgency, not just equipment, was doing real work in the historical Navy's own wartime training pipeline.",
            },
            {
              label: "Hold back: use this first contact to gather real intelligence on what this specific Japanese position has actually become, rather than commit blind to a decisive engagement",
              advisor: { name: "King", quote: "We have never fought this fleet, against this position, prepared however this staff has spent the last year preparing it. I would rather know what we're actually looking at before this Navy spends anything real finding out the hard way." },
              setFlags: { neitherTestedPath: "reconnoiter" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "END",
              outcome:
                "The more cautious wager, and the one with no clean historical analogue to weigh it against: real reconnaissance on a position and a garrison this force has never contested before, at the cost of whatever advantage a first-contact engagement might otherwise have offered. What this intelligence is actually worth, against an opponent just as untested and just as uncertain what it's facing, is a question this counterfactual closes without fully answering, honestly, because the real war it diverges from never had to ask it.",
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
            "Two years into an American war that only exists in Europe, China's war against Japan is in its sixth year, fought without the American matériel, air support, and eventual troop commitment the historical alliance actually provided. Chiang Kai-shek's government, publicly still an American partner in principle, privately understands that principle has produced no divisions and no bombers. Meanwhile the occupied Philippines, Malaya, and the Indies remain occupied, their populations governed by an empire no outside power is contesting militarily. Whether this is a stable equilibrium or a war deferred rather than a war avoided is the question Washington has to decide how to treat.",
          choices: [
            {
              label: "Extend material support to China without a declaration of war: matériel, not divisions",
              advisor: { name: "Stilwell", quote: "This army has fought six years on promises, and I've watched every year of it. I would rather send them what they can use than keep sending them reasons why we can't." },
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
                    "The rarer, more consequential branch: matériel without a declared alliance turns out to be enough. Chinese forces, better armed for the first time in years, push back against Japanese positions in ways the historical stalemate never allowed for, not a war won, but a war that finally starts moving after six years of not.",
                },
                {
                  weight: (() => { const w = modWeight(30, meters.pipeline); return Math.max(5, 100 - w); })(),
                  title: "The stalemate holds regardless",
                  setFlags: { chinaAloneAidResult: "unchanged" },
                  impact: { readiness: 0, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome: trucks and small arms without the air support, advisors, and troop commitment the historical alliance eventually provided aren't enough to break a stalemate six years in the making. The war grinds on exactly as it was, better supplied but no closer to moving.",
                },
              ],
              outcome:
                "A middle position between full alliance and full abandonment: American aircraft, trucks, and small arms reach China through the same difficult supply lines the historical alliance struggled with, without the American combat presence that historically came alongside it. It's more than China had before and considerably less than an actual declared ally would have provided. China's war isn't the only one still being fought without American help, though.",
            },
            {
              label: "Hold to strict non-engagement: no material support, no complications with the war being fought in Europe",
              advisor: { name: "Marshall", quote: "I said Europe First. I meant it as a doctrine, not a slogan I abandon the moment it becomes uncomfortable to watch what it costs everyone we're not helping." },
              setFlags: { chinaAloneAidPath: "none" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "britainsCalculus43",
              outcome:
                "An uncomfortable doctrine, held to consistently rather than abandoned under pressure: the European war gets everything, the Pacific gets nothing, and China's war against Japan continues exactly as unsupported as it would have been had the historical alliance never existed at all. Whatever the moral weight of that choice, it isn't softened here by a partial gesture that wouldn't have changed much regardless. China isn't the only Allied power fighting Japan without an American partner, though.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Authorize a volunteer combat program: pilots resign their commissions and fly for China as technical mercenaries, the same legal fiction the actual Flying Tigers used",
                    advisor: { name: "Stilwell", quote: "There is a precedent for exactly this, a hundred pilots who resigned their commissions and flew for China as private citizens before this country ever declared anything. I would like to use it again, at whatever scale this staff is willing to authorize." },
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
            "Without an American Pacific commitment splitting the war's resources, every dollar of Lend-Lease Congress ever approved has gone to Britain and the Soviet Union undiluted for two years running, and London's own assessment of what that buys is more candid than anything the historical alliance's diplomacy ever let London say to Washington directly: General Wavell's staff in India has concluded that no Asian possession is currently worth the cost of retaking it, and would rather hold India than spend a rebuilt army fighting back into Burma for a colony London hasn't decided it can actually afford to keep. Churchill's own position is less settled. He has called Singapore's fall the worst capitulation in British history and has said, more than once and not quietly, that he has no intention of presiding over the empire's dissolution. Whether that's a war aim London can resource on its own, without the American matériel and manpower that historically underwrote it, is the actual question in front of the War Cabinet, one Washington is reading about secondhand rather than negotiating directly.",
          choices: [
            {
              label: "Note London's caution without comment: this is a British decision to make, not an American one to weigh in on from outside the alliance",
              advisor: { name: "Hull", quote: "This government does not have us as an ally in the Pacific. I don't believe we've earned a vote in how London spends an army we didn't help build or supply." },
              historical: false,
              setFlags: { britainAsiaPath: "deferObserved" },
              impact: { readiness: 0, pipeline: 0, initiative: -1 },
              next: "japanUnopposed43",
              outcome:
                "Wavell's own real historical caution, resourced here by two years of undiluted Lend-Lease rather than the split allocation the historical campaign fought under, but deferred rather than attempted: Burma, Malaya, and Singapore stay occupied, not from American pressure to hold back or press forward, since there's no American voice in the room to press either way, but from London's own honest arithmetic about what an empire not currently at war with the country holding these colonies can actually afford to retake.",
            },
            {
              label: "Signal quiet support for Churchill's more aggressive position: an unopposed Japan consolidating its gains is a problem for later, worth discouraging now",
              advisor: { name: "Stimson", quote: "This is not our war to direct, and I know it. I don't think that means we're indifferent to whether Japan gets to finish consolidating an empire nobody is contesting while we watch." },
              setFlags: { britainAsiaPath: "encouraged" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: "japanUnopposed43",
              outcome:
                "A quiet nudge rather than a demand, since there's no formal alliance obligation behind it: informal encouragement toward the more aggressive Churchill position, that empire's restoration is worth contesting now rather than deferring, backed by nothing more binding than Washington's own preference for Japan not being left entirely uncontested. Whether Churchill needed the encouragement or would have reached the same conclusion regardless isn't something this signal can determine on its own.",
            },
            ...(meters.readiness >= 6
              ? [
                  {
                    label: "Formalize it: offer a specific, binding Lend-Lease increase conditional on London actually committing to retake Burma, not just an informal preference",
                    advisor: { name: "Stimson", quote: "A signal costs London nothing and commits them to nothing. Lend-Lease conditionality is an instrument this government has used before, tying specific aid increases to specific commitments. I would rather use the real instrument than a preference Churchill can act on or ignore with equal ease." },
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
          return dataNode(ALLIED_PACIFIC_DATA, "japanUnopposed43");
        },
        get chinaCivilWarShadow43() {
          return {
          date: "1943",
          title: "Five Hundred Thousand Men Not Fighting Japan",
          historicalRecord: false,
          situation:
            "What thin, secondhand intelligence reaches Washington from a China with no American observers in it at all suggests something at least as bad as the historical record's own accounting: Chiang's government, free of even the minimal restraint an American alliance historically applied, appears to be holding several hundred thousand of its own troops in place to contain the Communist-held territories around Yan'an rather than commit them against Japan. Nothing is pushing him to do otherwise, no Lend-Lease to withhold, no Stilwell to trade for access, no Dixie Mission possible without an American war effort in the theater to justify sending one. Meanwhile Yan'an, equally unmonitored, continues building the kind of local governance and popular support that, in the historical record, made it the stronger of the two Chinese factions by the time anyone in Washington was paying close attention. There is almost nothing the United States can actually do about any of this from outside a war it isn't fighting. Whether there's anything worth attempting anyway is the real question.",
          choices: [
            {
              label: "Attempt an unofficial, non-binding channel to both Chungking and Yan'an: not aid, just contact, so China's civil war isn't decided in total American blindness",
              advisor: { name: "Davies", quote: "I am not proposing we fund a civil war we have no standing to referee. I am proposing that the alternative to talking to Yan'an isn't neutrality. It's leaving the field entirely to Moscow, and I don't think that's actually the position this country wants to be in when this is finally settled." },
              historical: false,
              setFlags: { chinaCivilWarPath: "contact" },
              impact: { readiness: 0, pipeline: 0, initiative: 0 },
              next: "dutchExileCalculus44",
              outcome:
                "A minimal, deniable presence rather than a real policy: an informal channel that gathers information without offering aid, influence, or any actual leverage over how either side treats the other. It's not nothing, since it means China's civil war isn't being decided in total American blindness the way an entirely hands-off posture would guarantee. It's also not close to what the historical alliance's aid relationship, however compromised, actually gave Washington some ability to shape.",
            },
            {
              label: "Stay entirely hands-off: this isn't America's war to referee, and any contact at all risks looking like exactly the kind of meddling the standoff was meant to avoid",
              advisor: { name: "Hull", quote: "We chose not to fight this war. I don't think that choice comes with a side door where we still get to referee who governs China when it's over." },
              setFlags: { chinaCivilWarPath: "handsOff" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "dutchExileCalculus44",
              outcome:
                "A consistent position, at least: having chosen not to fight Japan alongside China, Washington also declines to weigh in on who China fights itself over afterward. Whatever shape China's internal conflict takes from here is settled entirely without American knowledge, aid, or influence, the most complete version of non-engagement this whole standoff has produced, and the one with the least visibility into what it actually produces.",
            },
            ...(meters.initiative >= 6
              ? [
                  {
                    label: "Send an actual observer mission to Yan'an: OSS-staffed, intelligence-gathering, the real proposal rather than the watered-down version of it",
                    advisor: { name: "Davies", quote: "What I proposed the first time was never just a channel. It was an actual observer group, OSS officers included, gathering real intelligence rather than trading polite cables. I would like this staff to authorize what I actually asked for, not the smaller version it settled for instead." },
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
            "The Netherlands East Indies Government-in-Exile, headquartered now in Australia after fleeing Java's fall in 1942, faces a gap between its stated goal and its actual capacity that even its closest remaining partner can't close: Australia has no significant military industry of its own, historically dependent on American resources to properly supply anyone, resources that in this history were never redirected toward a Pacific war the United States isn't fighting. What the Dutch government-in-exile does have is a real, unresolved argument inside its own colonial apparatus. Hubertus van Mook and other administrators who spent years actually governing the Indies favor real dialogue with the nationalist movement Japan's occupation has, whatever else it's done, also energized. The government in London wants what it has always wanted: full recolonization, administered on the same terms as before the war, and is keeping the more accommodating voices in Australia on a tight rein rather than a free hand. Neither position currently has the resources behind it to actually retake the territory it's arguing over.",
          choices: [
            {
              label: "Quietly signal diplomatic sympathy for Van Mook's accommodating position, consistent with this administration's own instincts about colonial rule, even with no aid to attach to that preference",
              advisor: { name: "Hull", quote: "I don't have a fleet or a dollar to offer this argument. I do have an opinion, formed well before this war started, that colonial arrangements built on the assumption nothing has changed since 1940 are going to have a difficult decade ahead of them regardless of what we say." },
              historical: false,
              setFlags: { dutchExilePath: "sympathyForAccommodation" },
              impact: { readiness: 0, pipeline: 0, initiative: 0 },
              next: "warWithoutAmerica45",
              outcome:
                "A diplomatic preference with nothing material behind it: Washington's real, documented discomfort with restored European empire, held since well before this specific war, expressed here with no aid, no fleet, and no actual leverage over a Dutch internal argument this country has no material standing in. Whether a preference with nothing behind it changes anything London decides is exactly the kind of question this choice can't answer on its own.",
            },
            {
              label: "Stay entirely neutral on the Dutch government's internal colonial question: even less American standing here than in China's civil war",
              advisor: { name: "Marshall", quote: "The Dutch government does not have us as an ally any more than Chungking does. I don't see the case for having an opinion about a colonial argument between London and Batavia that we have no forces, no aid, and no treaty obligation anywhere near." },
              setFlags: { dutchExilePath: "neutral" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "warWithoutAmerica45",
              outcome:
                "The most consistent version of this whole standoff's logic: having chosen not to fight this war, Washington also declines to referee an argument between a government-in-exile and its own colonial administrators about a territory neither has the resources to actually retake. Van Mook's accommodating instincts and London's recolonization demand are left to resolve themselves entirely without an American voice in the room, for better or worse.",
            },
            ...(meters.pipeline >= 6
              ? [
                  {
                    label: "Offer a real, material proposal: American administration of specific resource zones in exchange for guaranteed access, the same arrangement already standing in Dutch Guiana",
                    advisor: { name: "Hull", quote: "This isn't a new idea. Washington already administers Dutch Guiana's bauxite mines under a real 1941 agreement, made specifically to keep that resource secure. I am proposing this government offer London the same arrangement for the Indies, real American administration in exchange for real guaranteed access, not another opinion with nothing behind it." },
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
          return dataNode(ALLIED_PACIFIC_DATA, "warWithoutAmerica45");
        },
        get wakeIslandRelief41() {
          return {
          date: "DECEMBER 1941",
          title: "The Relief Force",
          historicalRecord: true,
          situation:
            "Wake Island's garrison, a few hundred Marines and civilian contractors, has already done what nobody expected: repelled the first Japanese invasion attempt outright, sinking two destroyers with shore batteries built for a much larger defense than the atoll has. A second, larger invasion force is now approaching, and Task Force 14, built around the carrier Saratoga, is at sea carrying reinforcements and supplies, still several days out. Pearl Harbor is twelve days gone, the Pacific Fleet's confidence and its actual carrier strength both still raw, and the officers now commanding it have to decide whether to press the relief force on toward an island that may already be lost by the time it arrives.",
          choices: [
            {
              label: "Recall the relief force: preserve Saratoga and her escort rather than risk them against a force already converging on the island",
              advisor: { name: "Pye", quote: "I am not willing to risk this fleet's only available carrier on a relief operation that may be steaming toward an island that has already fallen by the time it arrives. We have lost enough ships this month." },
              historical: true,
              setFlags: { wakeReliefPath: "recalled" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "arcadia41",
              outcome:
                "The relief force is recalled roughly a day before it would have reached Wake, and the garrison surrenders on December 23rd after a second landing overwhelms what's left of the defense. The decision remains one of the most argued-over calls of the early Pacific war: caution that was defensible given how raw the fleet's carrier strength still was twelve days after Pearl Harbor, or a lost chance to relieve a garrison that had already, against real odds, won its first fight.",
            },
            {
              label: "Send the relief force onward: commit Saratoga to reaching Wake regardless of the risk",
              advisor: { name: "Fletcher", quote: "The risk to this carrier is not lost on me. I am also aware of what recalling this force costs the Marines on that island, and I would rather explain a lost ship than explain a relief force that turned back within a day of arriving." },
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
                    "Saratoga's air group reaches Wake ahead of the second landing, and the garrison holds. It's a real, if costly, vindication of the task force commanders who reportedly wanted this chance and weren't given it. Whether the fleet's raw, untested carrier strength twelve days after Pearl Harbor was ever really equal to what Pye feared risking it against is a question this outcome answers only for this one battle, not for the ones still to come.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.initiative); return Math.max(5, 100 - w); })(),
                  title: "The relief force arrives to find the garrison already fallen",
                  setFlags: { wakeReliefResult: "tooLate" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier outcome, and the one Pye's own caution was built around: the second landing overwhelms Wake before Saratoga is close enough to intervene, and the relief force arrives to find nothing left to relieve, the carrier risked for a rescue that was already too late to attempt by the time it was ordered.",
                },
              ],
              outcome:
                "A plausible extension of the argument the task force's own commanders reportedly wanted to make and weren't given the chance to. Whether Saratoga's air group could have actually turned back a second, larger invasion force, or whether pressing on simply risks the Pacific Fleet's only available carrier for a garrison already likely to fall regardless, is a dispute historians of the decision still haven't settled.",
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
            "Pearl Harbor is eight days old and Churchill is already in Washington. The question Arcadia has to settle isn't whether America fights, that's decided, but where its still-mobilizing production goes first. The standing prewar plan, ABC-1, already assumes Germany is the more dangerous enemy and commits the bulk of resources there once America enters. Admiral King, newly installed as Commander in Chief of the fleet, is making the case hard in private that a Pacific war started by a Japanese attack on American soil deserves more than a defensive holding action while Europe gets the war's main weight." +
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
              advisor: { name: "Marshall", quote: "Germany is the only enemy capable of winning this war outright before we're ready to stop them. Japan can be answered second without losing the fight to answer them at all." },
              historical: true,
              setFlags: { arcadiaPath: "europeFirst", cohesion: (flags.cohesion || 0) + 1 },
              next: "internmentQuestion42",
              outcome:
                "Roosevelt and Churchill confirm Germany as the priority enemy, and the Pacific is left to hold what it can with whatever King can pry loose from a production pipeline aimed mostly east across the Atlantic. King never stops arguing the point for the rest of the war, and never quite loses the argument either. The Pacific ends up with more than 'defensive minimum' ever technically promised, extracted a fight at a time from a doctrine that never fully changed on paper.",
            },
            {
              label: "Back King's case: argue for near-parity Pacific resourcing given Japan struck first",
              advisor: { name: "King", quote: "An enemy attacked us in home waters. I am aware that isn't supposed to be the argument that sets grand strategy. I am making it anyway." },
              setFlags: { arcadiaPath: "pacificParity", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: 1, pipeline: -2, initiative: 1 },
              disabledReason: meters.pipeline <= -3 ? "There isn't enough shipping margin left to make this case credibly. King can't ask for near-parity resourcing while the Pacific's own supply chain is already this thin." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "internmentQuestion42",
              outcome:
                "A reasoned projection of the argument King actually made and lost. Winning it here means the Atlantic convoy escort and the buildup for a future European invasion both run thinner through 1942 and 1943 than the historical timetable allowed. Britain's own planners, already anxious about the shipping math, would have grounds to object hard. What a faster, better-resourced Pacific war buys against what a slower Atlantic one costs is exactly the trade this path now has to answer for.",
            },
            {
              label: "Confirm Europe First in principle, but attach a formal review trigger if Pacific losses cross a set threshold",
              advisor: { name: "Marshall", quote: "I am willing to write down the conditions under which this doctrine gets revisited. I am not willing to leave it open-ended, or King will treat every bad week in the Pacific as grounds to reopen a settled argument." },
              setFlags: { arcadiaPath: "conditional", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: 0, pipeline: -1, initiative: 0 },
              next: "internmentQuestion42",
              outcome:
                "A structural compromise the actual Arcadia conference never produced on paper, though something like it operated in practice as King kept extracting Pacific resources a crisis at a time regardless of the doctrine. Formalizing the trigger doesn't change the underlying allocation much, Europe still gets the weight, the Pacific still gets what it can argue for, but it changes the shape of the argument: a doctrine with a written escape hatch is a different kind of commitment than one King has to fight to bend every single time.",
            },
          ],
        };
        },
        get internmentQuestion42() {
          return dataNode(ALLIED_PACIFIC_DATA, "internmentQuestion42");
        },
        get rangoonRetreatAllied42() {
          return {
          date: "MARCH – APRIL 1942",
          title: "The Fall of Rangoon",
          historicalRecord: true,
          situation:
            "General Slim's Burma Corps and the Chinese Expeditionary Force divisions Chiang Kai-shek sent across the border at his own initiative, to defend the road that supplies his own government, are both being outpaced by Iida's faster-than-expected advance on Rangoon. The question facing this command isn't whether Rangoon holds; British planning has already concluded it can't. The question is what happens to the armies still trying to defend it." +
            (flags.arcadiaPath === "pacificParity"
              ? " Whatever Washington decided at Arcadia about Pacific resourcing, it hasn't reached Burma yet. This theater runs on British and Indian divisions King's argument was never going to reallocate regardless of how it came out."
              : ""),
          choices: [
            {
              label: "Order a fighting retreat toward the Indian border: preserve the army over the city",
              advisor: { name: "Slim", quote: "An army that survives a defeat can fight the next battle. An army spent holding a city already judged indefensible cannot fight anything at all. We go north." },
              historical: true,
              setFlags: { rangoonAlliedPath: "retreat", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: 1, pipeline: -2, initiative: -2 },
              next: flags.arcadiaPath === "pacificParity" ? "pacificFirstGamble42" : "curtinsTurn42",
              outcome:
                "Burma Corps conducts what's still called, without much exaggeration, the longest retreat in British military history, nearly a thousand miles to the Indian frontier, fought the whole way, but an army that arrives intact rather than an army that's destroyed. The Burma Road closes regardless; China's supply becomes entirely dependent on the Hump airlift for the rest of the war. What's preserved here is the force Slim rebuilds into Fourteenth Army, the one that eventually breaks Japan at Imphal and Kohima two years later.",
            },
            {
              label: "Commit the Chinese divisions to an absolute defense of Rangoon",
              advisor: { name: "Stilwell", quote: "Chiang sent those divisions to keep his own supply line open. If we pull them back without a fight, we've told him exactly what his alliance with us is worth the first time it costs something." },
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
                    "The gamble pays off more than the historical retreat ever could have: the Chinese divisions buy real weeks before Rangoon finally falls, weeks that let more equipment and more of the wider Burma garrison reach India intact than the historical timeline managed. It costs the Chinese Expeditionary Force badly, nearly encircled at Toungoo exactly as it was historically, but this time the cost bought something concrete.",
                },
                {
                  weight: (() => { const w = modWeight(30, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "A harder defeat, not a saved city",
                  setFlags: { rangoonDefendResult: "wasted" },
                  impact: { readiness: -2, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier result. Rangoon falls anyway, on very nearly the historical timetable, and the Chinese divisions that might have retreated intact are mauled holding a city British staff planning had already written off. The Burma Road closes on schedule regardless of the extra fighting, and Stilwell's alliance-signaling costs considerably more than it bought.",
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
              advisor: { name: "Curtin", quote: "Without any inhibitions of any kind, I make it clear that Australia looks to America, free of any pangs as to our traditional links or kinship with the United Kingdom." },
              historical: true,
              setFlags: { curtinPath: "defied", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: 1, pipeline: 0, initiative: 0 },
              next: "corregidorEvacuation42",
              outcome:
                "The division comes home over Churchill's strong objections, and Curtin's public statement, Australia looking to America rather than Britain, becomes the moment historians point to as the real rupture in Australian-British defense relations. It costs real friction with London at a moment the alliance can least afford it, and it sets the tone for an Australian-American defense relationship that outlasts the war by decades.",
            },
            {
              label: "Accept Churchill's redirection: keep the division in the fight for Burma rather than break with London",
              advisor: { name: "Churchill", quote: "I am asking Australia to trust that a war fought together is better defended together, even when the map makes that trust harder to extend than it should be." },
              setFlags: { curtinPath: "deferred", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: -1, pipeline: 0, initiative: 1 },
              next: "corregidorEvacuation42",
              outcome:
                "A defensible extension of the position Churchill really pushed for and, this time, gets. The division fights in Burma rather than defending Australian soil directly, preserving Commonwealth unity at a moment London badly needed it, at real political cost to Curtin domestically and a home defense Australia has to build without its own most experienced division for the war's most dangerous early stretch.",
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
              advisor: { name: "MacArthur", quote: "I came through and I shall return. That promise is worth more to the men left on this rock than my body would be if I stayed and let it be captured or buried here." },
              historical: true,
              setFlags: { corregidorPath: "evacuated", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: 0, pipeline: 0, initiative: 1 },
              next: "doolittleRaidAllied42",
              outcome:
                "MacArthur reaches Australia by PT boat and submarine relay in one of the war's more harrowing evacuations, and 'I shall return' becomes the promise that shapes Pacific strategy for the next two and a half years. The men left on Bataan and Corregidor surrender within weeks, beginning the death march and the years of captivity MacArthur's own return doesn't reach in time to prevent.",
            },
            {
              label: "Defy the order: remain on Corregidor with the garrison rather than leave them behind",
              advisor: { name: "Wainwright", quote: "I have told him plainly that his leaving does not look like cowardice to the men here, whatever the newspapers make of it elsewhere. I have also told him I understand exactly why he does not want to hear that from me." },
              setFlags: { corregidorPath: "remained", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: -2, pipeline: 0, initiative: -2 },
              next: "doolittleRaidAllied42",
              outcome:
                "An honest projection of the choice MacArthur reportedly considered and, under direct presidential order, ultimately didn't make. Remaining costs the Pacific war its most politically valuable commander at the exact moment Washington needs a rallying figure for a theater that has produced almost nothing but defeats, and risks his capture or death alongside a garrison already understood to be lost regardless of who commands it. What it doesn't cost is the promise 'I shall return' was built to answer for, since there's no departure left to redeem.",
            },
          ],
        };
        },
        get doolittleRaidAllied42() {
          return dataNode(ALLIED_PACIFIC_DATA, "doolittleRaidAllied42");
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
              advisor: { name: "Nimitz", quote: "I am gambling three carriers, most of what this fleet has left, on codebreakers being right about a target and a date. I am also not aware of a better gamble available to us." },
              historical: true,
              setFlags: { midwayAlliedPath: "ambush" },
              impact: { readiness: -2, pipeline: 0, initiative: 3 },
              next: "kokodaTrailAllied42",
              uncertain: [
                {
                  weight: modWeight(60 + (flags.forkToneOnTime ? 5 : 0), meters.initiative),
                  title: "The strike arrives in the window that matters",
                  setFlags: { midwayAlliedResult: "decisive" },
                  impact: { readiness: 1, pipeline: 0, initiative: 2 },
                  outcome:
                    "Dauntless dive bombers from Enterprise and Yorktown arrive in the single window when all four Japanese carriers have exposed, fully armed aircraft on their flight decks mid-changeover. Akagi, Kaga, and Soryu burn within six minutes of each other; Hiryu is sunk that evening after crippling Yorktown in return. Four Japanese fleet carriers and their veteran air crews are destroyed for one American carrier, the single most consequential naval battle of the Pacific war, decided as much by minutes of timing as by any strategic advantage.",
                },
                {
                  weight: 100 - modWeight(60, meters.initiative),
                  title: "The strike misses its window",
                  setFlags: { midwayAlliedResult: "costly" },
                  impact: { readiness: -3, pipeline: 0, initiative: 0 },
                  outcome:
                    "The dice of this contested morning break the other way: the dive bombers arrive after the Japanese carriers have already launched, catching a fleet with fighters aloft and decks clear rather than the loaded, vulnerable ones history's timing exposed. Two Japanese carriers go down in a costlier, less decisive exchange, and Yorktown is lost outright. The Pacific Fleet holds the line but doesn't break Japan's carrier arm the way the historical morning did. The initiative changes hands more slowly, and at a higher price.",
                },
              ],
            },
            {
              label: "Play conservative: preserve the carrier force, fortify Hawaii and the Australia route instead",
              advisor: { name: "Fletcher", quote: "We have three carriers left in the entire Pacific. I understand the intelligence looks good. I am less confident it's good enough to bet the whole fleet on a single morning." },
              setFlags: { midwayAlliedPath: "conservative", speculativePath: true },
              impact: { readiness: 2, pipeline: -1, initiative: -3 },
              next: "conservativePacific42",
              outcome:
                "A reasoned projection of the caution that a less confident reading of the codebreaking intelligence might have justified. Declining the ambush preserves the fleet against the very real risk that the intercepts were wrong or the Japanese force stronger than estimated, but it also means Japan's four fleet carriers sail home intact, undefeated, free to choose the Pacific's next major operation on their own schedule rather than America's.",
            },
            ...(meters.pipeline >= 3
              ? [
                  {
                    label: "Commit all three carriers, and hold a genuine reserve group ready to exploit the result immediately rather than regroup after",
                    advisor: { name: "Nimitz", quote: "I am gambling three carriers on codebreakers being right. I would like to gamble a fourth on the possibility they're right enough that Combined Fleet doesn't get a quiet month to regroup afterward, win or lose." },
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
            "Australian militia, mostly young, poorly equipped conscripts not yet reinforced by the veteran AIF divisions still returning from the Middle East, are conducting a fighting withdrawal down the Kokoda Track as Horii's South Seas Detachment pushes toward Port Moresby. MacArthur, running the campaign from Australia with limited visibility into history's own terrain and supply conditions on the track itself, is reading the retreat as a failure of will rather than the skillfully executed delaying action Australian commanders on the ground understand it to be, and is pressing hard for an immediate stand.",
          choices: [
            {
              label: "Back Blamey and the Australian commanders' fighting-withdrawal strategy: trade ground for time until reinforcements arrive",
              advisor: { name: "Blamey", quote: "I have officers on that track who know exactly what it costs to hold ground we cannot supply. I am not going to overrule them from Australia to satisfy a headline General MacArthur wants to send to Washington." },
              historical: true,
              setFlags: { kokodaAlliedPath: "support" },
              impact: { readiness: 1, pipeline: -1, initiative: -1 },
              next: "guadalcanalAllied42",
              outcome:
                "What happened, broadly, though not without real friction at the top. The fighting withdrawal holds the Japanese advance to a crawl exactly as Australian commanders intended, buying time for veteran AIF divisions to arrive and eventually reverse the advance entirely by November. MacArthur's public criticism of Australian fighting quality during the retreat, delivered without having visited the track himself, becomes one of the more bitter command controversies of the entire Pacific war, souring a relationship between American and Australian commands that never fully recovers.",
            },
            {
              label: "Demand an immediate stand: overrule the fighting withdrawal MacArthur reads as a failure of nerve",
              advisor: flags.corregidorPath === "remained"
                ? { name: "Sutherland", quote: "The general isn't here to say this himself, so I'll say it for the command he left behind: I want a line held, and I want it held now, not somewhere further back down a track we're told doesn't have room for the divisions we'd need to hold it properly." }
                : { name: "MacArthur", quote: "Coming to this theater was not to preside over a retreat. I want a line held, and I want it held now, not somewhere further back down a track I am told does not have room for the divisions I'd need to hold it properly." },
              setFlags: { kokodaAlliedPath: "standFast" },
              impact: { readiness: -3, pipeline: -1, initiative: 1 },
              disabledReason: meters.pipeline <= -4 ? "There's no supply capacity left to hold a fixed line on this track at all. The militia battalions can execute a fighting withdrawal or they can be encircled, but they can't be resupplied in place at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -4, label: "Pipeline" },
              next: "guadalcanalAllied42",
              outcome:
                "A grounded projection of the pressure MacArthur applied, taken to its logical operational conclusion: forcing a stand before reinforcements arrive risks the encirclement and destruction of the militia battalions actually conducting the withdrawal, on terrain serious historians of the campaign agree offered no defensible line short of the one Australian commanders had already chosen. This is one of the more direct rebukes of a command decision anywhere here: the historical criticism of the Kokoda withdrawal is now generally regarded by military historians as unfair to troops executing a sound tactical choice under impossible conditions, and this path plays that unfairness out to something closer to its actual cost.",
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
              advisor: { name: "King", quote: "Every week we wait is a week closer to that airfield flying combat missions against our own supply line to Australia. We land now, underprepared, or we land later against a base that's already hardened." },
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
              advisor: { name: "Ghormley", quote: "History can have a slower victory. The Marine Corps does not get a landing this fleet cannot adequately support." },
              setFlags: { guadalcanalAlliedPath: "delay" },
              impact: { readiness: 2, pipeline: -2, initiative: -3 },
              next: "unconditionalSurrender43",
              outcome:
                "A better-supplied landing, three months later, against an airfield the delay gives Japanese engineers time to finish and fortify. The historical campaign's razor-thin margins, Henderson Field held by aircraft flying on fumes, Marines fighting on captured rations, don't repeat here, but neither does the historical timeline: Japan gets a longer, freer hand in the Solomons before the American offensive that eventually came arrives. What that costs the wider 1943 campaign is a question the rest of the war gets to answer, not one this landing settles by itself.",
            },
            ...(meters.readiness <= -4
              ? [
                  {
                    label: "Land on schedule, but pull escort carriers built for convoy and invasion-support duty into the landing's own air cover",
                    advisor: { name: "Nimitz", quote: "The Sangamons were built for anti-submarine work and ferrying aircraft, not fleet action. I am aware of that. I am also aware Enterprise and Saratoga are, at this readiness level, close to the entire fleet carrier force this command actually has left to commit." },
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
            "Four days after the landing, a Japanese cruiser squadron under Mikawa slips past Allied picket destroyers at night and catches the covering force completely by surprise off Savo Island. Four Allied heavy cruisers, Astoria, Quincy, Vincennes, and the Australian cruiser Canberra, are sunk in under an hour, in what becomes one of the worst single defeats in U.S. Navy history. Mikawa withdraws without pressing the attack against the transports themselves, a decision that saves the landing but does nothing to soften what just happened to the covering force meant to protect it. Over a thousand Allied sailors are dead by morning, and Nimitz's command has to decide how this gets handled, immediately, while the Guadalcanal campaign is still very much underway.",
          choices: [
            {
              label: "Order a full court of inquiry and make the findings public: accountability now, whatever it costs morale mid-campaign",
              advisor: { name: "Nimitz", quote: "The men who died at Savo Island deserve better than becoming a story we quietly stop telling. If a command failure put them there, I want it found and I want it said." },
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
                    "What happened, roughly. The Navy's own inquiry finds real, specific failures, inadequate night-scouting doctrine, a covering force spread too thin, no unified command able to react fast enough once contact was made, and the findings reach the fleet fast enough to change doctrine before a second squadron makes the same mistake in the dark.",
                },
                {
                  weight: (() => { const w = modWeight(55, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The findings land, but too slowly to matter",
                  setFlags: { savoInquiryResult: "tooSlow" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The inquiry is thorough and the findings are real, but the bureaucratic distance between a published report and a destroyer captain's actual night-scouting drills turns out to be wider than Nimitz hoped. The lesson is on the record. Whether it reaches the right wardroom before the next dark night off an unfamiliar island is a separate question left standing here.",
                },
              ],
            },
            {
              label: "Classify the full findings and manage the story: an active campaign is the wrong moment for a public reckoning",
              advisor: { name: "King", quote: "I am not disputing what happened. I am disputing whether the Marines still fighting on that island need to read about it in a newspaper this week." },
              setFlags: { savoPath: "classified" },
              impact: { readiness: 1, pipeline: 0, initiative: 1 },
              next: "unconditionalSurrender43",
              outcome:
                "The findings stay internal, doctrine changes quietly rather than publicly, and the campaign's morale is spared a blow the Navy's own leadership judged it couldn't currently afford. What it costs is exactly what Nimitz's real historical inquiry was built to avoid: a lesson learned in private rather than one the whole fleet gets to learn from immediately, at the cost of whichever future squadron makes a version of the same mistake before word quietly gets around.",
            },
            ...(meters.initiative <= -6
              ? [
                  {
                    label: "Have King intervene directly from Washington: bypass the normal chain of command to force a decision this stalled campaign hasn't produced on its own",
                    advisor: { name: "King", quote: "It now appears that campaign continues in current status of delay, linger, and wait." },
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
            "Roosevelt and Churchill are meeting at Casablanca to set Allied war aims for the years ahead, and Roosevelt is preparing to announce a policy that will define exactly how this war ends: unconditional surrender, for Germany, Italy, and Japan alike, with no negotiated terms available to any Axis government at any point. Some of his own military advisors have quietly raised the same concern historians still argue about: that removing any negotiated off-ramp might harden resistance in a Japanese war ministry already inclined to fight rather than yield, extending a war a more flexible policy might have shortened." +
            (flags.savoInquiryResult === "actedOn"
              ? " The Navy's own recent reckoning with Savo Island, acted on before it cost a second disaster, is the kind of institutional self-correction that makes Roosevelt's own case, that this war is best fought by an alliance willing to look honestly at its own failures, considerably easier to make in this room."
              : flags.savoInquiryResult === "tooSlow"
              ? " The Navy's own recent reckoning with Savo Island, real but too slow to prevent a second cost, is a reminder in this room that declared policy and institutional follow-through don't always move at the same speed, a caution nobody at Casablanca says out loud but everyone weighing this declaration understands."
              : ""),
          choices: [
            {
              label: "Announce unconditional surrender as declared Allied policy",
              advisor: { name: "Roosevelt", quote: "The mistake of 1918 is not one I intend to repeat, where an armistice let Germany's militarists claim they were never defeated. Peace comes only by the total elimination of German and Japanese war power. Nothing less." },
              historical: true,
              setFlags: { surrenderDoctrinePath: "unconditional" },
              impact: { readiness: 0, pipeline: 0, initiative: 1 },
              next: "torpedoCrisis43",
              outcome:
                "The doctrine holds for the rest of the war, shaping every subsequent decision about how to end it, including, covered later, the debate over whether the Emperor's position could be preserved under a surrender otherwise unconditional. Historians remain divided on whether the policy prolonged Japanese resistance by removing incentive to negotiate, or whether Japan's war ministry was never going to accept negotiated terms regardless of what Washington offered.",
            },
            {
              label: "Leave room for negotiated terms: decline to foreclose a settlement short of unconditional surrender",
              advisor: { name: "Marshall", quote: "I am not certain removing every off-ramp shortens this war. I am fairly certain it removes any chance of the enemy government reading a path to ending it that doesn't require its own destruction first." },
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
                    "The bet pays off more than the historical record's own debate suggests it might have: a declared willingness to consider terms gives Japan's peace faction a genuine argument to make against the war ministry's hardliners, years before history's version of that same argument finally broke through in 1945. It doesn't end the war by itself. It changes what the internal argument inside Tokyo sounds like from here on.",
                },
                {
                  weight: (() => { const w = modWeight(35, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The war ministry treats it as weakness, not opening",
                  setFlags: { surrenderDoctrineResult: "readAsWeakness" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome, and the one Roosevelt's own real reasoning at Casablanca was built to avoid: Japan's war ministry reads any declared openness to terms as evidence the Allies are losing their nerve, not as an offer worth exploring, and holds out harder rather than softer. The negotiated-terms door stays open. Nobody on the other side of it is interested in walking through.",
                },
              ],
              outcome:
                "A defensible extension of the concern real historians of the period have raised: that a declared willingness to consider terms short of unconditional surrender might have given Japan's peace faction more room to argue for an earlier end to the war. Whether Japan's war ministry, which held out even after two atomic bombs in the history, would have taken a negotiated opening seriously at any point before 1945 is disputed among historians, and no resolution is offered here, declining to invent a Japanese response there's no way to know with confidence.",
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
            "Submarine patrol reports from the past year describe the same failure over and over: a perfect firing solution, a clean hit, and no explosion. The Bureau of Ordnance's official position is that the Mark 14 is sound and the fault lies with approach technique and crew error. Newly appointed COMSUBPAC Charles Lockwood has just run his own field tests, firing torpedoes through a fishing net to measure actual running depth against the set depth, and the results contradict BuOrd's position directly: the torpedoes are running roughly ten feet deeper than commanded, missing under targets that should have been hit clean." +
            (flags.surrenderDoctrineResult === "peaceFactionRoom"
              ? " Washington's unconditional-surrender declaration, just made, is landing this same month against reports suggesting it may have left Japan's peace faction real room to argue back home, an early, uncomfortable data point about how much a single declared policy actually controls in a war this large — not unlike Lockwood's own fight against a bureau that's been declaring a torpedo sound for a year despite what the field keeps showing."
              : flags.surrenderDoctrineResult === "readAsWeakness"
              ? " Washington's unconditional-surrender declaration, just made, is landing this same month against reports suggesting Japan's war ministry read it as confirmation of exactly the resolve it was meant to project, one policy at least behaving the way its authors intended, even as this same command discovers its own Mark 14 hasn't been behaving the way anyone intended for a year."
              : ""),
          choices: [
            {
              label: "Back Lockwood's field data over BuOrd's official position: order the fleet's own depth-control fix",
              advisor: { name: "Lockwood", quote: "BuOrd has offered me theory. I am offering this command a torpedo that runs at the depth it is set to. I would like the record to show which one of us actually tested it." },
              historical: true,
              setFlags: { torpedoCrisisPath: "backLockwood" },
              impact: { readiness: 1, pipeline: 0, initiative: 1 },
              next: "theBatBombQuestion43",
              outcome:
                "What actually happened: Lockwood's field tests, run without BuOrd's cooperation and initially dismissed by it, are eventually confirmed once BuOrd is finally pressured into running its own tests in August 1942, exactly a year into the war for a defect that should have been caught before it started. The depth fix helps immediately. It takes until mid-1943 and two more independently discovered defects, a magnetic exploder triggered by nothing at all and a contact firing pin too delicate to survive the hit it's meant to detonate on, before the Mark 14 becomes the weapon it was supposed to be from the start.",
            },
            {
              label: "Defer to BuOrd's official assessment: maintain standard procedure while the Bureau's own review continues",
              advisor: { name: "Nimitz", quote: "I have read the patrol reports as carefully as anyone in this room, and I do not believe every failed attack this year is bad approach work. I am not overruling the Bureau of Ordnance from here. I am asking them, again, to actually look." },
              setFlags: { torpedoCrisisPath: "deferBuOrd" },
              impact: { readiness: -1, pipeline: -1, initiative: -1 },
              next: "theBatBombQuestion43",
              outcome:
                "The more institutionally cautious path, and the one that costs the most in ships not sunk: without a theater commander's field tests forcing the issue early, the depth defect goes uncorrected for longer, and 1942's own submarine force keeps firing spreads that hit clean and detonate late, or not at all, against a Bureau of Ordnance still confident the fault lies everywhere but the torpedo itself.",
            },
          ],
        };
        },
        get theBatBombQuestion43() {
          return dataNode(ALLIED_PACIFIC_DATA, "theBatBombQuestion43");
        },
        get bismarckSea43() {
          return dataNode(ALLIED_PACIFIC_DATA, "bismarckSea43");
        },
        get yamamotoIntercept43() {
          return {
          date: "APRIL 1943",
          title: "Operation Vengeance: The Yamamoto Intercept",
          historicalRecord: true,
          situation:
            "Fleet intelligence has decrypted a JN-25 message giving Admiral Yamamoto's precise inspection itinerary: his aircraft will pass within fighter range of Guadalcanal in roughly three days. Killing the officer who planned Pearl Harbor is suddenly possible. It is also, several people in this room point out plainly, a strike specific enough to raise an uncomfortable question afterward: if the Japanese ever ask themselves how the Americans knew exactly which aircraft, in exactly which twenty-minute window, over exactly which stretch of water, there may be only one answer that actually fits, and it isn't luck." +
            (flags.bismarckSeaPath === "fullCommit"
              ? " The full-commitment doctrine that just cost a Japanese convoy dearly off New Guinea is barely a month old. Whether the same appetite for a coordinated, all-in strike extends to a target this specific and this consequential is exactly what this room is about to find out."
              : flags.bismarckSeaPath === "reserved"
              ? " The more reserved doctrine chosen off New Guinea a month ago argued for holding capability back rather than committing everything to a single strike. This target tests whether that same caution survives contact with an opportunity this rare."
              : ""),
          choices: [
            {
              label: "Authorize the strike: send fighters to intercept Yamamoto's flight on schedule",
              advisor: { name: "Nimitz", quote: "Do we try to get him? Would the Japanese replace him with someone better?" },
              historical: true,
              setFlags: { yamamotoInterceptPath: "authorize" },
              impact: { readiness: 0, pipeline: 0, initiative: 3 },
              next: "tehransPromise43",
              outcome:
                "Sixteen P-38s meet Yamamoto's flight on schedule near Bougainville; Halsey's own order back to the squadron leaves no doubt where he stood on the question: get the bastard. Japan's subsequent inquiry concludes the encounter was coincidence, a routine patrol in the wrong place at the worst possible time for Yamamoto, not proof the code was broken. The gamble on secrecy holds, this time, and JN-25 stays readable for the rest of the war.",
            },
            {
              label: "Decline the strike, or let the window close: the intelligence source is worth more than one admiral",
              advisor: { name: "Knox", quote: "This decrypt has had eleven readings from me. One admiral is not worth what discovery costs for the rest of this war." },
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
          return dataNode(ALLIED_PACIFIC_DATA, "yamamotoSurvives43");
        },
        get tehransPromise43() {
          return {
          date: "NOVEMBER – DECEMBER 1943",
          title: "Stalin's Promise, Pressed Early",
          historicalRecord: true,
          situation:
            "At Tehran, Stalin tells Roosevelt privately that the Soviet Union will enter the Pacific war once Germany is defeated, an informal commitment later formalized at Yalta and honored, on schedule, in August 1945. The Eastern Front is still consuming the overwhelming majority of Soviet manpower and industrial output, and any Soviet division redirected east now is a division not fighting Germany. Washington's planners have to decide whether to accept the deferred commitment as offered, or press Stalin for something more concrete: an earlier date, or a diversion of forces before Germany really falls." +
            (flags.magicDisciplinePath === "conservative"
              ? " This delegation negotiates from a Pacific intelligence picture built on real discipline: MAGIC kept reserved for exactly the kind of strategic warning a promise like Stalin's needs verified against, not spent on tactical targets that would have told this room less about Soviet timing and more about one dead admiral."
              : flags.magicDisciplinePath === "willing" && flags.magicResult === "clean"
              ? " This delegation negotiates from a Pacific intelligence picture that's stayed intact despite looser use, a source proven resilient enough that Washington's read on Japan's actual position, weighed against Stalin's promise, is built on current signals rather than a year-old snapshot."
              : flags.magicDisciplinePath === "willing" && flags.magicResult === "closeCall"
              ? " This delegation negotiates from a Pacific intelligence picture that came uncomfortably close to going dark earlier this year, a source this room is trusting a little less completely than it might have, in a negotiation where verifying Stalin's own timetable against real Japanese dispositions matters more than usual."
              : ""),
          choices: [
            {
              label: "Accept the deferred commitment: let Stalin fight Germany first, honor his own timetable for the Pacific",
              advisor: { name: "Marshall", quote: "Weakening the front that is actually killing the largest share of the German army this war has anywhere is not something I'll ask Stalin to do. His timetable serves both wars better than a rushed one would." },
              historical: true,
              setFlags: { tehranPath: "deferred" },
              impact: { readiness: 0, pipeline: 0, initiative: 0 },
              next: "centralPacificDrive43",
              outcome:
                "What happened, in substance if not in every diplomatic detail. Stalin's commitment stands as made, informally at Tehran and formally at Yalta fourteen months later, honored to the letter in August 1945: Soviet entry roughly three months after Germany's surrender, redeployment from the European front already underway well before the formal declaration. The Eastern Front loses nothing to an early Pacific diversion it was never actually asked to make.",
            },
            {
              label: "Press for an earlier date: request a diversion of Soviet forces to the Far East before Germany falls",
              advisor: { name: "King", quote: "Every month sooner the Soviets open a second front against Japan is a month sooner this fleet isn't fighting the entire Kwantung Army alone. I would rather ask for more than I expect to get than not ask at all." },
              setFlags: { tehranPath: "pressed" },
              impact: { readiness: 1, pipeline: -1, initiative: 1 },
              disabledReason: meters.pipeline <= -6 ? "There isn't the diplomatic capital left to press an ally already fighting the war's largest land campaign for a concession this costly. The relationship can't absorb the request at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -6, label: "Pipeline" },
              next: "centralPacificDrive43",
              outcome:
                "An honest projection of the argument King and other Pacific-focused planners found frustrating: every month the Kwantung Army in Manchuria sits uncommitted to any active front is a month the Pacific war fights Japan's full remaining strength alone. Whether Stalin, mid-war against Germany and in no position to weaken the front actually breaking the Wehrmacht, would have entertained an earlier date at any price is a request scholars of the period of Soviet wartime strategy consider close to a non-starter: the Eastern Front's manpower needs weren't negotiable at any point before Germany's actual collapse, regardless of what Washington offered or asked.",
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
            "With Guadalcanal held and Japan's carrier arm broken since Midway, the strategic question shifts to how to close the distance to the home islands. Nimitz's staff favors island-hopping: seizing lightly-held atolls that matter for airfields and bypassing heavily fortified ones like Truk entirely, starving them of supply rather than assaulting them. The Joint Chiefs, and MacArthur especially, want a more direct reduction of Japanese strongpoints, arguing bypassed garrisons remain a threat to the flanks of any advance." +
            (flags.guadalcanalAlliedPath === "delay"
              ? " The three-month delay before Guadalcanal's landing is still being felt in the timetable. Command starts from a position roughly a season behind where the historical record had it."
              : ""),
          choices: [
            {
              label: "Bypass the fortified atolls: isolate Truk and other strongpoints via air and submarine blockade",
              advisor: { name: "Nimitz", quote: "Killing every garrison Japan has left behind is not the job. We need the airfields and anchorages that get us to the next objective. Truk starves just as well from a distance." },
              historical: true,
              setFlags: { centralPacificPath: "leapfrog" },
              next: "macArthurTension44",
              outcome:
                "Truk, once considered the 'Gibraltar of the Pacific,' is neutralized by carrier air strikes and submarine blockade without ever being invaded, tens of thousands of Japanese troops left to starve on bypassed islands for the rest of the war while the American advance moves past them at a pace direct assault could never have matched.",
            },
            {
              label: "Direct assault: reduce the Gilberts, Marshalls, and Marianas strongpoint by strongpoint",
              advisor: { name: "Holland Smith", quote: "Bypassing a fortified position doesn't make it stop being fortified. It makes it someone else's problem, later, when we have less time to solve it." },
              setFlags: { centralPacificPath: "assault" },
              impact: { readiness: -2, pipeline: 0, initiative: 3 },
              disabledReason: meters.readiness <= -3 ? "Marine and Army divisions can't absorb Tarawa-scale casualties again at this readiness level. The fleet doesn't have the replacements to sustain repeated direct assaults." : undefined,
              gateCheck: { meter: "readiness", threshold: -3, label: "Readiness" },
              next: "theTarawaQuestion43",
              outcome:
                "A costlier, more direct campaign that removes bypassed-garrison risk entirely but pays for it in casualties the historical leapfrogging strategy was specifically designed to avoid. Tarawa's brutal three-day fight, fought historically as a cautionary lesson in fortified-atoll assault, becomes this path's template rather than its exception. The advance moves faster in a straight line and slower in aggregate, and the mainland front's own 1944 crisis is arriving regardless of which strategy got the fleet there.",
            },
            ...(meters.pipeline >= 5
              ? [
                  {
                    label: "Run both strategies at once: leapfrog most of the strongpoints while still reducing the two or three that threaten the flank",
                    advisor: { name: "Spruance", quote: "I would not have proposed running both doctrines at once with the tonnage this fleet had eighteen months ago. I am not going to pretend the surplus we're sitting on now doesn't change that math." },
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
          return dataNode(ALLIED_PACIFIC_DATA, "theTarawaQuestion43");
        },
        get macArthurTension44() {
          return dataNode(ALLIED_PACIFIC_DATA, "macArthurTension44");
        },
        get macArthurAftermath44() {
          return dataNode(ALLIED_PACIFIC_DATA, "macArthurAftermath44");
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
            : "Ozawa's Mobile Fleet is somewhere west of Saipan, and Task Force 58's carrier commander, Mitscher, wants to go find it and finish it, the same instinct that made Halsey aggressive at Leyte later this year. Spruance, commanding the covering force, has a different priority written into his orders: protect the Saipan landing above all else. If the Japanese fleet slips past Task Force 58 while it's off hunting Ozawa, transports and Marines already ashore have nothing between them and a bombardment force. The question is whether to release the carriers for an aggressive pursuit or hold them close to the landing regardless of what that costs in Japanese ships that get away.",
          choices: midwayDeclined
            ? [
                {
                  label: "Treat the sizing gap as reason for maximum caution: hold the full covering force at the landing, accept whatever escapes rather than risk it against an unknown-strength fleet",
                  advisor: { name: "Spruance", quote: "My orders protected this landing against a fleet whose size we actually knew. I am not loosening that protection against one we don't, on the strength of a hope that three years did the Navy's job for us." },
                  setFlags: { philippineSeaAlliedPath: "maxCaution", carrierEstimateTrust: "distrusted" },
                  impact: { readiness: 2, pipeline: 0, initiative: -3 },
                  next: "chinaCrisisAllied44",
                  outcome:
                    "The safest reading of an unreadable situation: the full covering force never leaves the landing, and whatever Ozawa's fleet actually is by 1944, larger, more experienced, or nearly as worn down as the historical one, it clears the area intact either way, because nothing in this decision was built to find out. What's carried forward instead of an answer is the same open question fleet intelligence walked in with, still unresolved when Downfall's own planners have to size the same fleet again a year from now.",
                },
                {
                  label: "Push Layton's section for a hard count before deciding either way: hold the main decision for a reconnaissance-in-force",
                  advisor: { name: "Layton", quote: "I can keep giving this staff an estimate built on an assumption that stopped being true two years ago, or I can ask for the time to replace it with an actual count. I would rather be late with a real number than on time with a wrong one." },
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
                  advisor: { name: "Mitscher", quote: "Four extra hulls that survived one morning two years ago do not mean four extra carriers' worth of trained pilots survived everything since. I am willing to fight this the way the plan already assumes." },
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
                        advisor: { name: "Spruance", quote: "The sizing gap is the actual problem here, not which half of this fleet gets which job. Give both halves enough carriers to do their own job completely, and the gap stops being something we have to gamble around." },
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
              advisor: { name: "Spruance", quote: "My mission is the landing force, not Ozawa's fleet. If protecting the first one costs me a cleaner shot at the second, I will take that cost every time." },
              historical: true,
              setFlags: { philippineSeaAlliedPath: "protect" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "chinaCrisisAllied44",
              outcome:
                "The Marianas Turkey Shoot destroys Japanese naval aviation as a serious fighting force regardless of Spruance's caution, but Ozawa's remaining carrier hulls, stripped of aircrews but not sunk, escape the battle intact, a fact naval aviators like Mitscher argued for years afterward represented a missed opportunity to end Japanese carrier aviation as a hull-count threat, not just a trained-pilot one. Spruance's defenders, then and since, point out that a landing force left uncovered while the carriers went hunting was a risk with no acceptable failure mode.",
            },
            {
              label: "Release the carriers for an aggressive pursuit: prioritize destroying Ozawa's fleet over the landing's immediate cover",
              advisor: { name: "Mitscher", quote: "We have this fleet in a position no American commander has had it in this war. I do not want to explain to history why we let it go find its way home instead." },
              setFlags: { philippineSeaAlliedPath: "pursue" },
              impact: { readiness: -1, pipeline: 0, initiative: 3 },
              disabledReason: meters.readiness <= -4 ? "The carrier air groups don't have the strength left to leave the landing force uncovered and still win a pursuit. The fleet can protect the beach or gamble, not both, at this readiness level." : undefined,
              gateCheck: { meter: "readiness", threshold: -4, label: "Readiness" },
              next: "chinaCrisisAllied44",
              uncertain: [
                {
                  weight: modWeight(40, meters.initiative),
                  title: "The pursuit catches Ozawa's carriers",
                  setFlags: { philippineSeaAlliedResult: "caughtFleet" },
                  impact: { readiness: 0, pipeline: 0, initiative: 2 },
                  outcome:
                    "Mitscher's bet pays off. Task Force 58 runs down Ozawa's remaining carrier hulls before they can clear the range of American strike aircraft, finishing as hull losses what the Turkey Shoot already finished as a trained-pilot force. Japanese carrier aviation stops being a threat in any sense the historical battle left unresolved. The landing force went briefly uncovered to buy it, and this time the gamble that Spruance's orders were written to prevent simply didn't get tested by anything worse showing up.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.initiative); return Math.max(5, 100 - w); })(),
                  title: "The pursuit comes up empty",
                  setFlags: { philippineSeaAlliedResult: "missedFleet" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome, and the one Spruance's defenders always argued was the real risk: Ozawa's remaining hulls have too much of a head start, and Task Force 58 spends fuel and time chasing a fleet already most of the way home. The landing force sat briefly uncovered for a pursuit that caught nothing, exactly the failure mode Spruance's original orders were written to rule out.",
                },
              ],
              outcome:
                "A plausible extension of the aggressive pursuit doctrine Halsey would apply at Leyte a few months later, with famously mixed results there too. Committing to the chase here risks exactly the scenario Spruance's orders were written to prevent, a landing force temporarily uncovered while the fleet hunts a retreating enemy, in exchange for a chance at destroying more of Ozawa's carrier hulls than the historical battle managed. Whether that trade was worth making is a dispute serious naval historians still haven't fully settled, split between Spruance's defenders and Mitscher's.",
            },
            ...(meters.readiness >= 6
              ? [
                  {
                    label: "Split the force with genuine strength behind both halves: hold the landing's cover intact while still releasing a pursuit group",
                    advisor: { name: "Spruance", quote: "The argument for choosing one or the other assumes I have to. I have enough carriers, for once, that I don't. Half stays on the beach. Half goes after Ozawa. Neither half is a bluff." },
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
            "Marshall has the President's approval for an ultimatum to Chiang: put Stilwell in unrestricted command of every Chinese force in the field, or lose American aid entirely. Stilwell is standing by to deliver it in person, and by every account of the man he is eager to. Patrick Hurley, the President's own envoy already in Chungking, is asking for something different: hold the message a few days, let him work Chiang toward a version of the same demand Chiang can actually survive delivering to his own generals. Chiang provisionally agreed to something close to this arrangement in August. Whether that agreement holds depends heavily on how the next message arrives.",
          choices: [
            {
              label: "Send Stilwell in immediately, full ultimatum, no softening",
              advisor: { name: "Stilwell", quote: "I have waited two and a half years for Washington to back this play. I am not waiting for Hurley to make it gentler." },
              historical: true,
              setFlags: { stilwellUltimatumPath: "immediate" },
              impact: { readiness: -1, pipeline: -1, initiative: 1 },
              next: divergentPath ? "aDifferentPacific45" : "portChicago44",
              outcome:
                "Stilwell delivers the ultimatum in person, by most accounts openly satisfied to finally be doing it. Chiang's patience breaks entirely: rather than accept command being handed to an American officer at gunpoint, he demands Stilwell's outright recall, aid or no aid. Washington backs down rather than lose China's cooperation altogether, and Stilwell is ordered home on October 19th. The command authority the ultimatum was built to win is never actually exercised by the man it was written for.",
            },
            {
              label: "Hold the message: let Hurley negotiate a version of the same demand Chiang can survive delivering to his own government",
              advisor: { name: "Hurley", quote: "Give me a week before this becomes a public humiliation neither man can walk back from. That's all I'm asking for." },
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
            "Preliminary carrier strikes against Peleliu and the southern Philippines have revealed something planning assumed away: Japanese air power in the Palaus is far weaker than expected, and the airfield threat the whole Peleliu landing was built to remove barely exists anymore. Halsey has sent Carney to Nimitz's headquarters with a blunt recommendation: cancel Operation Stalemate II entirely, and use the assigned divisions somewhere the war can still use them. The invasion force is already at sea, three days from the beaches.",
          choices: [
            {
              label: "Proceed with the landing as planned: the force is committed, and Peleliu's airfield still matters",
              advisor: { name: "Nimitz", quote: "The force is at sea and the plan has already gone to Washington. I'm not confident enough in a carrier pilot's read on ground defenses to unwind that on three days' notice." + (flags.yamamotoInterceptPath === "authorize" ? " I made a call like this on a single read once before, on Yamamoto. I'm not going to make it twice with the odds reversed and less time to think." : flags.yamamotoInterceptPath === "declined" ? " I turned down a bet on a single intelligence read once already, on Yamamoto. I'm not going to start trusting one now just because it's Halsey's name on it." : "") },
              historical: true,
              setFlags: { peleliuPath: "proceed" },
              impact: { readiness: -3, pipeline: -1, initiative: -1 },
              next: "portChicago44",
              outcome:
                "The 1st Marine Division lands on September 15th into defenses that turn out to be dug in, disciplined, and nothing like the weakened garrison the preliminary strikes suggested from the air. What staff estimates call a three-day operation runs past two months, at a cost, over 9,500 American casualties against roughly 10,900 Japanese defenders, that becomes one of the most argued-over price tags of the entire Pacific War for an airfield the campaign that justified it barely ends up needing.",
            },
            {
              label: "Cancel Stalemate II on Halsey's recommendation: recall the invasion force before it lands",
              advisor: { name: "Halsey", quote: "I'm going to stick my neck out. Skip Peleliu, and put these divisions somewhere the war still needs them." },
              setFlags: { peleliuPath: "cancelled", speculativePath: true },
              impact: { readiness: 2, pipeline: 0, initiative: -1 },
              next: "peleliuForcesRedirected44",
              outcome:
                "The order goes out with the fleet still three days from the beach. No landing happens; the Palaus garrison, real and substantial, roughly 10,900 men, stays exactly where it is, bypassed and left to wither without the supply or reinforcement to matter strategically again. What Nimitz's staff actually does with two divisions suddenly freed of an assignment isn't decided by this message. It's decided by the next one.",
            },
            ...(meters.initiative >= 7
              ? [
                  {
                    label: "Take Halsey's full recommendation to Washington, not just Peleliu: push the Joint Chiefs to move Leyte up past even the historical two months",
                    advisor: { name: "MacArthur", quote: "Washington already moved Leyte's own date up two full months on a single carrier pilot's report. I intend to ask them to move faster still, on the same evidence, while the door Halsey found still stands this far open." },
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
            "The 1st Marine Division and the Army's 81st Infantry, packed and briefed for Peleliu, are sitting on transports with no landing to make. Nimitz's own planning staff has one real candidate for where they'd matter most: pulling the Iwo Jima timetable forward, months ahead of the historical February 1945 date planning otherwise assumed. The case for it is genuine. So are the reasons the historical timetable waited: naval gunfire ships committed elsewhere, a landing season this early nobody has actually war-gamed, and an island whose defenses, unlike Peleliu's, nobody currently believes are weaker than expected." +
            (flags.leyteAccelerationPath === "pushedFurther"
              ? " The same argument that just pushed Washington past its own historical appetite for accelerating Leyte is sitting in this room already. Whether it's still sound advice the second time it's made in one week, or a momentum this staff has simply stopped questioning, is not a distinction anyone here has fully worked out yet."
              : ""),
          choices: [
            {
              label: "Push for the accelerated Iwo Jima timeline: use the window while it's open",
              advisor: { name: "Spruance", quote: "We have two divisions and no orders. I would rather spend that on an island we know we need than let it sit idle while staff argues about naval gunfire schedules." },
              setFlags: { ironBottomPath: "accelerated" },
              impact: { readiness: -1, pipeline: -2, initiative: 2 },
              uncertain: [
                {
                  weight: modWeight(40, meters.pipeline),
                  title: "The early window holds",
                  setFlags: { ironBottomResult: "success" },
                  impact: { readiness: 1, pipeline: 0, initiative: 2 },
                  outcome:
                    "The gamble on timing pays off: naval gunfire support gets reassigned fast enough to matter, and Iwo Jima's garrison, still finishing the tunnel network that made the historical February assault so costly, hasn't finished it yet. This is the version of Iwo Jima the freed Peleliu divisions were spent to buy, months earlier and meaningfully cheaper than the historical assault ever was.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.pipeline); return Math.max(5, 100 - w); })(),
                  title: "The acceleration costs what the caution was actually protecting against",
                  setFlags: { ironBottomResult: "costly" },
                  impact: { readiness: -3, pipeline: -2, initiative: -1 },
                  outcome:
                    "The reasons the historical timetable waited turn out to have been real reasons, not just caution for its own sake: naval gunfire support arrives thinner than the plan needed, and an accelerated landing against defenses nobody actually reconnoitered in advance costs close to what the historical assault did anyway, just months earlier and with less time to prepare for it. The freed divisions get spent regardless. What's uncertain is whether they were spent better here than they would have been at Peleliu.",
                },
              ],
              next: "portChicago44",
              outcome:
                "Two divisions with no orders, an island everyone already knew needed taking eventually, and a window nobody's sure is actually as open as it looks from a transport deck three days after a canceled landing.",
            },
            {
              label: "Hold the divisions in theater reserve instead: don't spend an opportunity on an unplanned assault",
              advisor: { name: "Nimitz", quote: "An accelerated landing nobody has properly planned is how the exact mistake we just avoided at Peleliu happens again somewhere else. I would rather hold them." },
              historical: false,
              setFlags: { ironBottomPath: "held" },
              impact: { readiness: 1, pipeline: 1, initiative: -2 },
              next: "portChicago44",
              outcome:
                "The safer read, and an honest one: two divisions held in reserve rather than committed to a landing this staff hasn't actually planned. Whether that caution preserves men who would otherwise have been spent on a rushed Iwo Jima assault, or simply delays a fight that was always coming on worse terms later, isn't something held-in-reserve divisions can answer by sitting on transports.",
            },
          ],
        };
        },
        get stilwellPreserved44() {
          return dataNode(ALLIED_PACIFIC_DATA, "stilwellPreserved44");
        },
        get chinaCrisisAllied44() {
          const divergentPath = flags.arcadiaPath === "pacificParity" || flags.midwayAlliedPath === "conservative" || flags.centralPacificPath === "assault";
          return {
          date: "1944",
          title: "Two Fronts, One Air Bridge",
          historicalRecord: true,
          situation:
            "Ichi-Go's offensive is overrunning the Fourteenth Air Force's forward airbases faster than Chennault's command can evacuate them, and Chiang's Nationalist divisions, chronically under-supplied, chronically riven by the rivalry between Chiang and Stilwell that's about to cost Stilwell his command entirely, are giving ground across southern China. In the north, Communist forces under Mao have spent the war largely intact, fighting a guerrilla campaign against Japanese occupation that American observers newly arrived at Yan'an report is considerably more effective than anything the Nationalist front is currently managing." +
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
              : ""),
          choices: [
            {
              label: "Maintain support solely to Chiang's Nationalist government: hold the alliance's official line even as Ichi-Go costs airbases",
              advisor: { name: "Stilwell", quote: "Two years now, watching Chiang hoard American equipment for a civil war he expects to fight after this one, instead of the war we're in. I'll keep backing him because Washington tells me to, not because I think it's the choice that stops Ichi-Go." },
              historical: true,
              setFlags: { chinaPath: "nationalistOnly", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: -2, pipeline: -2, initiative: -1 },
              next: "stilwellUltimatum44",
              outcome:
                "What happened, broadly, up to this point. Support stays channeled through Chiang's government even as Ichi-Go overruns the airbases it was meant to protect, and the Stilwell-Chiang relationship, already poisonous, is about to reach the moment that actually breaks it.",
            },
            {
              label: "Open a channel of material support to Communist forces in the north as a hedge against Chiang's weakening position",
              advisor: { name: "Davies", quote: "I've read the Yan'an observer reports the same as everyone else. Mao's forces are fighting the occupation harder and more effectively than Chungking's are, and we are choosing not to arm them for reasons that have more to do with Chiang's politics than with beating Japan. I think that's the wrong call, and I think history is going to have opinions about it." },
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
                    "Davies's case holds up. Material support reaching Communist forces in the north translates into real pressure on Japanese supply lines feeding Ichi-Go, enough to slow, though not stop, the offensive's advance. Whether it was worth what it costs the alliance with Chiang's government is a different question. On the narrow military question, it did what its advocates said it would.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The support arrives too late and too thin",
                  setFlags: { chinaCrisisResult: "tooLittle" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome, and the one skeptics of the policy always argued for: whatever reaches Yan'an arrives too late and too thin to meaningfully change a five-hundred-thousand-man offensive's trajectory, while still costing everything it cost with Chiang's government. Ichi-Go succeeds regardless, and the alliance damage from arming Chiang's rivals turns out to have bought considerably less than its advocates hoped.",
                },
              ],
              outcome:
                "A path the real war flirted with, the Dixie Mission's observers at Yan'an made close to this exact case in 1944, but never adopted at any real scale, for reasons that were as much about the alliance's postwar politics as about the war still being fought. Whether meaningful material support meaningfully blunts Ichi-Go, or simply arrives too late and too thin to matter against a five-hundred-thousand-man offensive, is contested among historians of the period; what's not contested is that this choice reshapes the postwar Nationalist-Communist balance in ways beyond what happens here to follow through to their 1949 conclusion.",
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
            "Three weeks ago, on the night of July 17th, two ammunition ships being loaded at the Port Chicago Naval Magazine outside San Francisco exploded, killing 320 sailors and civilians and injuring 390 more. Nearly all of the dead were Black enlisted men, assigned to munitions loading because the Navy's segregated personnel policy routed Black sailors into the most dangerous shore duty available and gave them no specialized training for it, no hazard pay, and white officers who timed the loading crews against each other for speed. The Bureau of Ordnance's own investigation found no fault with procedures. What sits in front of this command now is a straightforward order: the surviving sailors, transferred to Mare Island, are to resume loading ammunition under the identical conditions, the same untrained crews, the same competitive timing, the same absence of any safety change traceable to an explosion that just killed a third of their division.",
          choices: [
            {
              label: "Issue the order as planned: identical conditions, no changes, return to loading immediately",
              advisor: { name: "Bureau of Ordnance", quote: "The investigation found no fault in procedure. There is no operational basis for a delay this war effort cannot currently afford." },
              historical: true,
              setFlags: { portChicagoPath: "orderedBack" },
              impact: { readiness: 0, pipeline: 0, initiative: 0 },
              next: "philippinesFormosaAllied44",
              outcome:
                "What actually happened. Two hundred and fifty-eight sailors refuse the order on August 9th. Under threat of the death penalty for mutiny in wartime, 208 relent and are convicted in summary courts-martial of the lesser charge of disobeying orders, receiving bad conduct discharges that cost them veterans' benefits for the rest of their lives. Fifty hold their refusal and are charged with mutiny outright, a capital wartime offense. Their trial, watched from the gallery for twelve days by NAACP counsel Thurgood Marshall, ends in October with all fifty convicted, sentenced to eight to fifteen years of hard labor. The men who died on July 17th are already dead by the time this order reaches anyone; what this decision actually determines is what happens to the men who lived, and it treats their refusal to return to the identical conditions that killed their friends as a capital crime rather than as evidence the conditions needed to change.",
            },
            {
              label: "Halt loading operations fleet-wide pending an actual safety and training review before ordering anyone back",
              advisor: { name: "Nimitz", quote: "I would rather explain a delay in ammunition flow than explain why this command's answer to 320 dead sailors was to change nothing and then prosecute the survivors for noticing." },
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
                    "The review that never happened historically gets a real hearing here: proper training, hazard pay, integrated crews, and loading rates no longer timed as a competition between divisions. It costs real weeks of ammunition flow to the Pacific at a moment the war can least easily spare them, and it means the fifty men whose historical refusal became a mutiny trial never have to make that choice at all, because the order they'd have refused never gets issued in its original form.",
                },
                {
                  weight: (() => { const w = modWeight(45, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The Bureau of Ordnance's own institutional resistance stalls the review into something closer to the original order",
                  setFlags: { portChicagoResult: "reformStalled" },
                  impact: { readiness: -1, pipeline: -2, initiative: -1 },
                  outcome:
                    "The historical Bureau of Ordnance investigation found no fault in procedure at all; an order to review doesn't automatically overcome an institution that had already concluded, on paper, that nothing needed changing. The review runs long, produces real but modest changes, mostly training, none of the deeper integration or hazard-pay questions the sailors themselves actually raised, and the delay this command absorbed buys less than it was meant to.",
                },
              ],
              outcome:
                "A position that treats the explosion itself as the evidence requiring a response, rather than treating the survivors' refusal to return unchanged as the thing this command actually has to answer. What it costs is weeks of ammunition flow the Pacific war doesn't have much slack to absorb; what it avoids is a mutiny trial for fifty men whose actual crime, in the historical record, was refusing to go back to the conditions that just killed 320 of their own.",
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
                ? { name: "Eichelberger", quote: "He never got the chance to say it himself. I am making the argument he would have made, because I watched what staying there cost him, and I am not willing to let it have cost nothing." }
                : { name: "MacArthur", quote: "I said I would return. That was not a strategic argument when I made it, and I am not going to pretend it's only a strategic argument now." },
              historical: true,
              setFlags: { philippinesPath: "liberate", cohesion: (flags.cohesion || 0) + 1 },
              impact: { readiness: -2, pipeline: 1, initiative: 1 },
              disabledReason: meters.readiness <= -4 ? "Too few combat-ready divisions remain for a full Leyte-to-Luzon campaign. A smaller, faster objective is what this force can sustain." : undefined,
              gateCheck: { meter: "readiness", threshold: -4, label: "Readiness" },
              next: "quezonsSuccessor44",
              outcome:
                "The Leyte landing draws the Imperial Navy's remaining surface strength into the war's largest naval battle, fought and won even after Kurita's battleships broke through to the invasion beaches and then, controversially, withdrew. Luzon's liberation runs through the month-long battle for Manila itself, the single most destructive urban fighting of the entire Pacific War. Yamashita's own order was to abandon the city rather than defend it; Rear Admiral Sanji Iwabuchi, commanding the naval garrison and carrying the disgrace of a warship lost at Guadalcanal two years earlier, refused and chose to fight regardless. What follows over the next month is a civilian death toll estimated at a minimum of 100,000, credible estimates running considerably higher, split between American artillery once fire restrictions were lifted and systematic killing by Japanese forces as the city fell around them. Manila's liberation delivers forward air bases the final approach to Japan uses directly, and a reckoning, at the postwar tribunals, over how much responsibility a commanding general bears for atrocities carried out by a subordinate who disobeyed his direct order to withdraw.",
            },
            {
              label: "Bypass the Philippines: seize Formosa instead",
              advisor: { name: "King", quote: "Formosa gets us closer to Japan with fewer Japanese troops between us and the objective. MacArthur's promise to the Philippines is not, with respect, a war-winning consideration." },
              setFlags: { philippinesPath: "bypassFormosa", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: -4, pipeline: 0, initiative: 4 },
              next: "halseyTyphoon44",
              outcome:
                "A faster, more direct approach that the actual Joint Chiefs debate seriously considered and set aside, partly on the logistics of supporting a Formosa landing without Philippine bases first, partly on the political and moral weight of MacArthur's argument. This path takes the road not taken: a shorter geographic route bought with harder fighting against a more concentrated Japanese defense, and Philippine civilians left under occupation for a war's final year this path never liberates them from. The rest of the war, the fleet's own reckonings, the islands still ahead, the war's actual conclusion still to be decided, continues regardless of which approach reached Formosa.",
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
            "President Manuel Quezon, who led the Philippine government-in-exile from Washington for the length of the occupation, died of tuberculosis in August, weeks before the Leyte landing he'd spent years pressing for finally happened. Sergio Osmeña, his vice president, is the one who really wades ashore beside MacArthur, an image the newsreels will use for the rest of the war, representing a president who isn't there to see it. Quezon's own real, well-documented position, pressed on Washington for years, was independence on the existing 1946 schedule with no reduction in American commitment. What Osmeña presses for now, with the war's actual cost freshly visible on the beach behind him, is an open question.",
          choices: [
            {
              label: "Confirm the existing 1946 independence timeline unchanged: no acceleration, no extended conditions",
              advisor: { name: "Osmeña", quote: "President Quezon fought for this date for years before any of us knew there would be a war to fight through first. I am not going to use his death as a reason to ask for something he never asked for himself." },
              historical: true,
              setFlags: { philippineIndependencePath: "unchanged" },
              impact: { readiness: 0, pipeline: 0, initiative: 1 },
              next: "halseyTyphoon44",
              outcome:
                "The Tydings-McDuffie timetable holds exactly as set a decade earlier, and the Philippines become independent on July 4, 1946, within a year of the war's own end. What doesn't stay simple is everything negotiated alongside it: history's own postwar Military Bases Agreement grants the United States access to Clark Field, Subic Bay, and other installations on terms that remain contentious for decades, an arrangement this decision doesn't resolve one way or the other, just declines to complicate further with a changed date.",
            },
            {
              label: "Press for extensive, long-term American basing rights as the price of continued full support through liberation",
              advisor: { name: "MacArthur", quote: "This theater will need permanent forward bases after this war ends, whatever we pretend now. I would rather negotiate for them now, from a position where the alliance actually needs each other, than beg for them later." },
              setFlags: { philippineIndependencePath: "basingRights", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: 1, pipeline: 1, initiative: -1 },
              next: "halseyTyphoon44",
              outcome:
                "A harder bargain than Quezon's own real position ever pushed for, using the liberation campaign's urgency as leverage while Manila is still occupied and the alliance's asymmetry is at its most visible. It gets Washington more durable, more explicitly negotiated access than the historical 1947 agreement's own contested terms ultimately provided, at a cost to Filipino goodwill, not a free one: an independence granted with strings attached reads differently than one granted cleanly, whatever the strategic logic behind the strings.",
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
            : "Pressing King's case at Arcadia for near-parity Pacific resourcing, against the standing Europe First doctrine, has meant three years of a materially better-supplied Pacific Fleet than the historical one, extracted a fight at a time from a production pipeline that never fully changed its priorities on paper. By 1945 that accumulated advantage is real and measurable. Whether it's enough to change how the war ends, or simply enough to have fought a bigger war at the same ending, is what the Joint Chiefs have to decide now.") +
            (flags.chinaCrisisResult === "blunted"
              ? " China's own front, at least, isn't a drag on this year's planning: the material support that reached Communist forces during Ichi-Go's advance slowed it, one theater the Joint Chiefs don't have to spend fresh attention rescuing while they work through everything else 1945 is asking of them."
              : flags.chinaCrisisResult === "tooLittle"
              ? " China's own front is still a drag on this year's planning: the material support sent north during Ichi-Go's advance arrived too late and too thin to change its trajectory, one more open account the Joint Chiefs are carrying into 1945 alongside everything else."
              : ""),
          choices: midwayDeclined
            ? [
                {
                  label: "Assume the surviving Combined Fleet still poses a surface threat: commit additional escort and air cover to Downfall's invasion screen",
                  advisor: { name: "Spruance", quote: "This invasion does not get planned around a carrier force I have no confirmed count on. If Akagi and Kaga are still out there in any strength, I want the screen built for that possibility, not for a comfortable assumption that they aren't." },
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
                  advisor: { name: "Nimitz", quote: "Four carriers that survived one morning in 1942 are not the same four carriers three years and a fuel crisis later. I am willing to bet the older assumption about their strength still holds, because everything else about this fleet's condition says it should." },
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
                  advisor: { name: "Marshall", quote: "This country has read a casualty list out of the Pacific every few months for three years running and kept supporting the war. I am prepared to make the case that Downfall's number, however large, isn't the number that breaks that pattern." },
                  setFlags: { publicTolerancePath: "survivable" },
                  impact: { readiness: 0, pipeline: 0, initiative: 2 },
                  next: "aDifferentPacificFinalWord45",
                  outcome:
                    "An argument built on a pattern, three years of costly direct assaults absorbed without the public support for the war meaningfully cracking, extended to cover an invasion whose projected cost dwarfs anything Tarawa or Peleliu asked for individually. Whether steady exposure to a high but survivable cost actually predicts tolerance for one enormous number, or whether Downfall's scale is a different kind of ask entirely, is the gamble this argument makes.",
                },
                {
                  label: "Argue the opposite: three years of high casualties has used up whatever patience existed, and Downfall needs a lower-cost alternative",
                  advisor: { name: "Nimitz", quote: "This country has absorbed every casualty list we've sent it without complaint. I do not think that means it has an infinite amount more patience to absorb. I would rather test that with a blockade than with an invasion." },
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
                  advisor: { name: "King", quote: "I asked for this resourcing at Arcadia specifically so this fleet would have more to work with when it mattered most. It matters most now. I intend to use it." },
                  setFlags: { resourcingUsePath: "accelerate" },
                  impact: { readiness: 1, pipeline: -1, initiative: 2 },
                  next: "aDifferentPacificFinalWord45",
                  outcome:
                    "The resourcing argument King made at Arcadia, and kept making for three years afterward, finally cashed in on the one decision it was always aimed at: a materially larger invasion force, assembled faster than the historically resourced Pacific Fleet ever could have managed, betting that three years of incremental production advantage adds up to real time saved at the war's most expensive remaining moment.",
                },
                {
                  label: "Treat the extra resourcing as a bigger war fought at the same pace, not a faster one: proceed on the historical timeline",
                  advisor: { name: "Marshall", quote: "More ships and more material bought this fleet a larger margin, not a shorter war. I am not convinced the two are the same thing, and I am not willing to bet Downfall's timetable on an assumption that they are." },
                  historical: false,
                  setFlags: { resourcingUsePath: "unchanged" },
                  impact: { readiness: 0, pipeline: 1, initiative: -1 },
                  next: "aDifferentPacificFinalWord45",
                  outcome:
                    "A more skeptical read of what three years of near-parity resourcing actually bought: a bigger, better-supplied fleet, proceeding on essentially the historical schedule regardless, because more material was never the same thing as a fundamentally different war. The advantage isn't wasted, exactly. It's banked, in a margin for error the historical fleet never had, rather than spent on speed.",
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
            : "The bomb, the Soviet declaration, and Japan's cabinet deadlock aren't pushed off schedule by how the Pacific Fleet was resourced getting here. What's provably different is the fleet itself, and the price the European theater quietly paid in production priority for three years, so that this fleet could be larger than the historical one without the war's broad ending ever actually depending on it being so." +
              (flags.resourcingUsePath === "accelerate"
                ? " King's own resourcing argument from Arcadia got spent, in the end, on trying to buy real time at the war's most expensive remaining moment, not just on a larger margin for error."
                : flags.resourcingUsePath === "unchanged"
                ? " The accumulated advantage went unspent on speed, banked instead as a margin for error the historical fleet never had, proceeding on essentially the historical timetable regardless."
                : ""),
          choices: [
            {
              label: "Put a documented comparison on the record: state plainly how this fleet's own toll measures against the war's real historical cost",
              advisor: { name: "King", quote: "The war's documented cost in this theater runs to something over a hundred and eleven thousand American dead. I am not going to let whatever this fleet's own divergence added to or spared from that number live only in a file nobody outside this command ever reads." },
              setFlags: { differentPacificFinalPath: "acceptTrade" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              next: "END",
              outcome: midwayDeclined
                ? "The documented total for this theater, a little over 111,000 American dead, is the real number this fleet's own account now sits beside on the record rather than apart from it. Three additional years of an Imperial Navy the historical record never had to account for meant three additional years of resources spent managing it, a real, countable addition to that total rather than a rounding error, even if the war's broad shape and its final year land almost exactly where the historical record says they should."
                : assaultDoctrine
                ? "The documented total for this theater, a little over 111,000 American dead, is the real number a strongpoint-by-strongpoint doctrine's own higher toll now sits beside on the record rather than apart from it. The historical leapfrogging campaign bypassed exactly the kind of costly direct assaults this path chose to fight instead, and the difference between those two approaches is a real, countable addition to the documented total, not a rounding error, even where the war's broad shape and its final year land almost exactly on schedule regardless."
                : "The documented total for this theater, a little over 111,000 American dead, is the real number this fleet's own account now sits beside on the record rather than apart from it. Whatever three years of King's own resourcing argument from Arcadia bought this fleet in size and readiness, it was bought at a real, countable cost to the European theater's own production priorities, now weighed openly against the same documented total the historical fleet's cost is measured against, rather than left as something only this command quietly knows.",
            },
            {
              label: "Decline to reduce it to a single number: state plainly that an honest accounting of this fleet's own divergence isn't the same thing as a precise one",
              advisor: { name: "Nimitz", quote: "The Army's own casualty accounting after this war ran to real, documented disputes between good sources that never fully reconciled. I am not going to hand this command's own, considerably less-audited internal count more confidence than the official record itself was able to claim for its own numbers." },
              setFlags: { differentPacificFinalPath: "acceptUncertainty" },
              impact: { readiness: -1, pipeline: 1, initiative: 0 },
              next: "END",
              outcome:
                "A real, documented precedent, not a rhetorical dodge: the National Archives' own postwar compilation of American casualties across every theater openly acknowledges the same problem this command is running into now, categories of missing, captured, and declared-dead that never fully reconciled even with a dedicated postwar accounting effort behind them, and good sources that still differ from each other in places. Handing this fleet's own considerably rougher internal count a precision the official record's own numbers couldn't fully claim for themselves would be the actual dishonesty here. What this divergence changed about the fleet's condition and the war's real cost stays real regardless of whether it gets reduced to a number this command was never actually positioned to defend to the last digit.",
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
            "Halsey's Third Fleet, refueling destroyers at sea to support the Luzon landings, sails directly into a typhoon whose position his own staff misjudged, against warnings from ships in company that read the deteriorating weather correctly and said so. Three destroyers, Hull, Monaghan, and Spence, capsize and sink. Nearly 800 sailors are dead, more than some actual naval battles cost, and a court of inquiry is convening to determine whether this was unavoidable weather or a command failure with a name attached to it.",
          choices: [
            {
              label: "Find questionable judgment but retain Halsey in command: his record and standing outweigh one weather error",
              advisor: { name: "Nimitz", quote: "The court's findings have had a full reading from me. I am not going to relieve the officer who won the Philippine Sea and Leyte Gulf over a typhoon his own staff misjudged, when the honest truth is that misjudging a typhoon's track was a mistake several other flag officers in this fleet could have made in his position." },
              historical: true,
              setFlags: { halseyTyphoonPath: "retained" },
              impact: { readiness: 0, pipeline: -1, initiative: 0 },
              next: "burmaReconquest45",
              outcome:
                "The court of inquiry finds Halsey exercised questionable judgment and recommends no punitive action. He retains command of the fleet, and eight months later sails it directly into a second typhoon under startlingly similar circumstances, a second, smaller round of losses that becomes its own smaller footnote to this one. Popularity and a strong combat record bought him a second chance the court's own findings didn't clearly justify on the facts alone.",
            },
            {
              label: "Relieve Halsey of fleet command: the court's findings on judgment stand regardless of reputation",
              advisor: { name: "King", quote: "Relieving Halsey costs this fleet something in morale, and costs me something personally in a fight with the newspapers. I know both. What I also know is that seven hundred and ninety dead sailors deserve a judgment that doesn't bend around a famous name." + (flags.macArthurTensionPath === "relieved" ? " I relieved a more famous name than his once already this year." : "") },
              setFlags: { halseyTyphoonPath: "relieved", cohesion: (flags.cohesion || 0) - 1, speculativePath: true },
              impact: { readiness: -1, pipeline: 0, initiative: -2 },
              next: "halseyAftermath44",
              outcome:
                "A relief the actual court of inquiry's findings could have supported but didn't recommend. Halsey's public standing, built on real victories at the Philippine Sea and Leyte Gulf, made this a costly call to make, and the fleet loses a commander whose aggression, for all its real costs, also produced real results.",
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
            "The historical Pacific Fleet ran on an unusual system: the same ships, alternately called Third Fleet under Halsey and Fifth Fleet under Spruance, depending on who currently held the wheel, an arrangement that let one staff plan the next operation while the other executed the current one. With Halsey relieved, that alternating structure has no second commander to alternate with. Spruance, methodical where Halsey was aggressive, inherits sole command of the fast carrier fleet for the war's final stretch.",
          choices: [
            {
              label: "Keep Spruance's cautious doctrine as the fleet's only operating style for the rest of the war",
              advisor: { name: "Spruance", quote: flags.philippineSeaAlliedPath === "protect" ? "I am not going to apologize for caution twice in one war. I made this same call at the Philippine Sea, and I'd make it again." : flags.philippineSeaAlliedPath === "splitForce" ? "I did not have to choose between caution and aggression at the Philippine Sea. I had the strength to do both honestly. I would rather have that kind of choice available again than pick a permanent doctrine because, this once, I didn't need one." : "What the other choice costs when it goes wrong is not something I need to guess at. I am not interested in finding out a second time." },
              setFlags: { halseyAftermathPath: "singleDoctrine" },
              impact: { readiness: 2, pipeline: 0, initiative: -2 },
              next: flags.philippinesPath === "liberate" ? "cabanatuanRaid45" : "iwoJimaAllied45",
              outcome:
                "A fleet that fights its entire final year under a single, consistent doctrine rather than alternating between two commanders' really different instincts. What's lost is the aggressive pursuit Halsey's style occasionally bought at Leyte's own cost; what's gained is a fleet that never again sails into a typhoon it should have seen coming, and a command structure with one clear answer instead of two competing ones.",
            },
            {
              label: "Promote a second carrier commander to restore the alternating structure, even without Halsey",
              advisor: { name: "Mitscher", quote: "The alternating command was never really about the two men in the two chairs. It was about giving this fleet's staff time to plan without also having to fight. I would like to keep that, whoever sits in the second chair." },
              setFlags: { halseyAftermathPath: "restoredAlternation" },
              impact: { readiness: -1, pipeline: 0, initiative: 2 },
              disabledReason: meters.readiness <= -4 ? "There isn't the depth of trained staff to stand up a second full command structure at this readiness level. One doctrine has to do for the rest of the war." : undefined,
              gateCheck: { meter: "readiness", threshold: -4, label: "Readiness" },
              next: flags.philippinesPath === "liberate" ? "cabanatuanRaid45" : "iwoJimaAllied45",
              outcome:
                "The alternating structure survives Halsey's relief, restored under a less famous name history never had reason to record. The planning advantage the system was actually built for continues into the war's final year, at the cost of the specific aggressive instinct Halsey personally brought to it, replaced by a competent but less recognizable hand on the wheel.",
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
            "Slim's Fourteenth Army, rebuilt from the longest retreat in British military history three years earlier, has retaken Burma, closing the loop on a theater that opened the mainland thread back in 1942. The question left standing is almost administrative by comparison to the fighting that got here: whether to force construction of the Ledo Road, an overland supply route through the reconquered territory into China, or rely permanently on the Hump airlift and put the engineering effort somewhere the Pacific advance can use it directly." +
            (flags.rangoonAlliedPath === "defend"
              ? " The Chinese divisions committed to the costlier defense of Rangoon back in 1942 are, on this path, part of the army that just finished retaking the ground they were nearly lost holding three years ago."
              : ""),
          choices: [
            {
              label: "Force the Ledo Road's construction through reconquered northern Burma",
              advisor: { name: "Stilwell", quote: "Three years now, being told the airlift is enough. I would like, once, to hand Chiang a road instead of an excuse." },
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
              advisor: { name: "Slim", quote: "Burma is taken. I am not certain we need to also pave it before this war is over. Send the engineers where the war is still being decided." },
              setFlags: { overlandPath: "airOnly", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: 1, pipeline: -1, initiative: 2 },
              next: flags.philippinesPath === "liberate" ? "cabanatuanRaid45" : "iwoJimaAllied45",
              outcome:
                "A reasoned projection built on an argument that has real hindsight behind it: the historical Ledo Road's strategic payoff was marginal given how late it opened, and engineers freed for Pacific basing and airfield construction have an unambiguous, immediate use closer to the war's actual decisive theater. What's given up is symbolic as much as material: the road that proved the CBI theater's logistics could be solved by more than air power alone, on a path that never bothers proving it.",
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
            "Intelligence reaching Sixth Army's headquarters carries a specific fear, not a general one: on Palawan, last month, Japanese guards herded roughly 150 American POWs into air raid shelters and burned them alive as the Allied advance approached, a kill-all policy rather than an improvised atrocity. More than 500 American and Allied prisoners, most of them Bataan and Corregidor survivors who've already spent nearly three years in captivity, are held at a camp near Cabanatuan City, thirty miles behind the current front line and directly in the path of the same advance that triggered Palawan. Lieutenant General Krueger has a rescue plan in front of him: the 6th Ranger Battalion, ten Alamo Scouts, and several hundred Filipino guerrillas under Captain Juan Pajota, moving on foot through Japanese-held territory to reach the camp before the regular advance does, or before the guards decide the regular advance is close enough to matter.",
          choices: [
            {
              label: "Authorize the raid: send the Rangers, Scouts, and guerrillas in on foot, thirty miles behind enemy lines",
              advisor: { name: "Krueger", quote: "Palawan was not a threat this command gets to treat as theoretical after the fact. If there is a real chance of the same order reaching Cabanatuan's guards before we do, I am not willing to let the regular advance be the thing that decides the timing." },
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
                    "What actually happened, and one of the cleanest special-operations successes of the entire war: more than 500 prisoners liberated in a raid lasting under half an hour, at a cost of two Rangers killed against several hundred Japanese casualties. Malnourished men too weak to walk are carried out on the backs of the same Rangers who broke them out, and on Filipino carabao carts requisitioned from villages along the thirty-mile route back to American lines. The camp's entire garrison and the reinforcement column that arrived mid-raid are wiped out before either can carry out whatever order Palawan's guards already had.",
                },
                {
                  weight: (() => { const w = modWeight(75, meters.initiative); return Math.max(5, 100 - w); })(),
                  title: "The raid runs into real resistance the historical operation was fortunate enough to avoid",
                  setFlags: { cabanatuanResult: "costly" },
                  impact: { readiness: -3, pipeline: -1, initiative: -1 },
                  outcome:
                    "Thirty miles on foot through enemy-held territory to reach a fortified camp was always a genuine operational risk, not a formality on the way to a foregone success; the historical raid's near-bloodless outcome depended on timing and reconnaissance that don't hold as cleanly here. The camp is still taken and the prisoners still freed, but at a real cost in Rangers and guerrillas the historical operation, remarkably, never had to pay.",
                },
              ],
              outcome:
                "A genuine gamble made against a real, specific, recently-demonstrated risk: Palawan's guards received and executed a kill-all order against their own prisoners within the last month, and nothing about Cabanatuan's guards makes that order less possible here. Thirty miles on foot behind enemy lines to preempt it is a real operational risk, not a safe bet dressed up as one.",
            },
            {
              label: "Decline the raid: let the regular Sixth Army advance reach the camp on its own timetable instead",
              advisor: { name: "Sixth Army staff", quote: "A deep-penetration raid this size risks the force conducting it as much as it protects the prisoners it's meant to save. The advance will reach that camp in weeks regardless." },
              setFlags: { cabanatuanPath: "declined" },
              impact: { readiness: 1, pipeline: 0, initiative: -2 },
              next: "iwoJimaAllied45",
              outcome:
                "The cautious reading, and the one that treats Palawan as an isolated atrocity rather than a demonstrated policy this command has direct evidence of. Whether that reading is right is a bet made with roughly 500 men's lives as the stake, against guards who, a month ago and thirty miles from a camp very much like this one, proved they were both willing and ordered to kill their prisoners rather than let them be liberated. The regular advance does reach Cabanatuan eventually. What condition it finds the camp in when it arrives is the actual, unresolved question this choice leaves open.",
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
              advisor: { name: "Spruance", quote: "Ten days would buy something real. It would also cost something real: every one of those ships sitting idle off Iwo Jima instead of over Japan's home-island air defenses, where they're needed. Three days, and we land." },
              historical: true,
              setFlags: { iwoJimaAlliedPath: "compressed" },
              impact: { readiness: -3, pipeline: 0, initiative: 2 },
              next: "okinawaAllied45",
              outcome:
                "The compressed bombardment fails to meaningfully touch Kuribayashi's tunnel network, and the Marines who land on February 19th walk into a defense barely dented by three days of shelling. The battle runs five weeks and costs the Marine Corps nearly 7,000 dead, its highest single-battle toll of the war, a price historians have argued for decades might have been lower with the ten days originally requested, against a Navy schedule that had competing claims on the same ships.",
            },
            {
              label: "Insist on the full extended bombardment before landing, delaying the operation",
              advisor: { name: "Holland Smith", quote: "I have asked for ten days because I believe ten days saves Marine lives on the beach. I am aware of what else the Navy wants those ships doing. I am asking Nimitz to decide which cost he would rather explain." },
              setFlags: { iwoJimaAlliedPath: "extended" },
              impact: { readiness: 2, pipeline: -2, initiative: -3 },
              disabledReason: meters.pipeline <= -5 ? "There isn't fuel to keep this bombardment force on station for ten days without pulling ships from Okinawa's own preparation. The extended schedule isn't available at this pipeline level." : undefined,
              gateCheck: { meter: "pipeline", threshold: -5, label: "Pipeline" },
              next: "okinawaAllied45",
              outcome:
                "A reasoned projection of the argument Marine planners actually lost: a longer bombardment that pulls carrier support away from strikes against Japanese airfields elsewhere, on the historically contested premise that naval gunfire could meaningfully crack a tunnel network built specifically to survive it. Whether ten days saves the casualties the compressed schedule cost, or simply delays the same battle against a defense that had already gone to ground regardless of how long the shelling ran, is a dispute serious historians of the battle still haven't fully settled.",
            },
            ...(meters.pipeline >= 7
              ? [
                  {
                    label: "Take the full ten-day bombardment without pulling a single ship from Okinawa's preparation: let the fleet train actually carry both",
                    advisor: { name: "Nimitz", quote: "I refueled six destroyers off a hose trailed from an oiler's stern in 1917 and called it a revolution. The fleet train this command has built since makes that revolution look like a parlor trick. It can carry both commitments. I intend to let it." },
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
                    advisor: { name: "King", quote: "I called this island a waste of resources at the actual September 1944 planning conference, and nothing about the tunnel network we've since found under it has changed my reasoning. It has no anchorage, no useful land area, and it sits farther from Kyushu than Okinawa does. I am asking this command to act on the argument I already made, not refight it." },
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
              advisor: { name: "Nimitz", quote: "Every minute of warning the pickets buy is a minute the carriers get their fighters up before the wave arrives. That minute is not worth trading away just to make the picket assignment feel safer." },
              historical: true,
              setFlags: { okinawaAlliedPath: "holdPicket" },
              impact: { readiness: -3, pipeline: -1, initiative: 1 },
              next: "strategicBombingAllied45Delayed",
              outcome:
                "The picket destroyers absorb a disproportionate share of the kamikaze campaign's cost, several are sunk outright, dozens more damaged, casualties among picket crews running severe enough that surviving sailors describe station assignment there as effectively a death sentence with better odds than the alternative. The early warning they provide is real and saves ships further in; it does not change what standing that watch costs the destroyers doing it.",
            },
            {
              label: "Pull the picket line back further offshore, accepting slower warning for reduced picket exposure",
              advisor: { name: "King", quote: "This doctrine is spending more destroyers on warning time than sits comfortably with me. If pulling the line back costs us minutes rather than ships, I want to know that's the trade before we keep paying the current price." },
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
                    "King's bet holds. Fighter direction and radar coverage compensate for the pulled-back line closely enough that the carriers still get their combat air patrol up before the mass waves arrive, and the destroyer losses this doctrine was built to reduce come down without the fleet paying for it in ships hit deeper in the formation.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.initiative); return Math.max(5, 100 - w); })(),
                  title: "The slower warning costs ships further in",
                  setFlags: { okinawaPickResult: "warningLost" },
                  impact: { readiness: -1, pipeline: -1, initiative: -1 },
                  outcome:
                    "The trade King worried about materializes. Fewer picket destroyers are lost, but the waves that do get through arrive with less warning, and ships further back in the formation, carriers and transports the whole doctrine existed to protect, take hits the historical forward-picket arrangement was specifically built to prevent.",
                },
              ],
              outcome:
                "A reasoned projection built on an internal Navy debate about picket doctrine's cost: pulling the line back plausibly reduces destroyer losses, at an uncertain cost in warning time for the carriers and transports the pickets exist to protect in the first place. Whether this trade nets out better for the fleet as a whole, given how effective the kamikaze threat proves against ships of every size at Okinawa regardless of formation, is a tactical question that doesn't resolve with full confidence here; the historical doctrine was itself revised repeatedly during the battle for exactly this reason.",
            },
            ...(meters.pipeline >= 4
              ? [
                  {
                    label: "Hold the close picket line, but backstop it with a genuine reserve of radar-equipped destroyers the historical picket doctrine never had spare hulls to field",
                    advisor: { name: "Nimitz", quote: "This whole doctrine has been a choice between early warning and picket survival, because this fleet never had enough radar-equipped hulls to stop choosing. I would like the record to note that, for once, it does." },
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
            "The night of March 9th–10th, before this staff's own attention was consumed by the picket-line argument off Okinawa, roughly 300 B-29s already firebombed Tokyo at low altitude, killing an estimated 100,000 people in a single night, the deadliest single bombing raid in human history, on schedule regardless of what this specific command was occupied with at the time. LeMay's doctrine shift wasn't a decision this staff was in the room for; it's a fact already on the record by the time Okinawa's own argument is finally settled. What's actually in front of this staff now is narrower: whether the incendiary campaign LeMay already started continues expanding to the sixty-odd cities it eventually reached, or whether the results reaching this desk months late are grounds to press for reconsidering a doctrine that's been running without this command's own sign-off." +
            (flags.okinawaPickResult === "warningHeld"
              ? " The picket doctrine argument off Okinawa, pulled back and vindicated by radar and fighter direction closing the gap, is the kind of recent institutional success that makes trusting LeMay's own already-running judgment an easier case to accept without relitigating it from scratch."
              : flags.okinawaPickResult === "warningLost"
              ? " The picket doctrine argument off Okinawa, pulled back at a cost in ships hit deeper in the formation, is a recent reminder that a plausible-sounding change to doctrine doesn't always survive contact with results, a caution this staff can't fully apply retroactively to a firebombing campaign that's been running for months without its direct sign-off."
              : ""),
          choices: [
            {
              label: "Endorse the campaign as already run: let LeMay's doctrine continue expanding to the remaining target list",
              advisor: { name: "LeMay", quote: "I did not wait for a sign-off this command was not in a position to give in March. I would like one now, but the campaign does not stop while this staff catches up on the reading." },
              historical: true,
              setFlags: { bombingPath: "incendiaryLate" },
              impact: { readiness: 1, pipeline: 0, initiative: 2 },
              next: "atomicDemonstration45",
              outcome:
                "What already happened, ratified rather than decided: the incendiary campaign that began over Tokyo in March continues expanding through the spring exactly as the historical record shows, sixty-odd Japanese cities firebombed by war's end, this staff's late endorsement changing nothing about a doctrine that was never actually waiting on it.",
            },
            {
              label: "Press for a reconsideration despite the months already spent: raise the moral cost of continuing now, even this late",
              advisor: { name: "Arnold", quote: "I am aware how late this objection arrives. I am raising it anyway, because the campaign continuing for another month is not the same question as the campaign having already run for one." },
              setFlags: { bombingPath: "reconsiderLate" },
              impact: { readiness: -1, pipeline: -1, initiative: -1 },
              next: "atomicDemonstration45",
              outcome:
                "A late objection to an early decision, and an honest one: this staff can't undo March, only argue about April onward. The campaign's remaining scope narrows somewhat under the reconsideration, at real cost to the industrial-target case LeMay's doctrine was built on, without changing anything about the deadliest raid already on the record before this argument even started.",
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
            "The bomb works, or will within weeks, Trinity's test is imminent, and the Interim Committee convened to advise on its use has a genuine, seriously argued alternative on the table. A group of Manhattan Project scientists, in what became known as the Franck Report, has proposed a demonstration: detonate the weapon on an uninhabited island or a stretch of open desert, with Japanese observers invited, before ever considering its use on a populated city. The counter-argument inside the Committee is blunt: there are only two bombs ready, a demonstration that failed to impress or that simply failed to detonate would hand Japan's war ministry exactly the propaganda victory the peace faction can least afford, and no one has satisfactorily explained how to guarantee an invited observer party's safety or credibility as witnesses in the first place." +
            (flags.surrenderDoctrinePath === "negotiated"
              ? " Casablanca's declared willingness to consider terms short of unconditional surrender is still, in this history, the standing policy. Whatever the bomb does here, it lands on a Japanese war ministry that has had two years longer to weigh a negotiated exit than the historical record ever gave it."
              : ""),
          choices: [
            {
              label: "Reject the demonstration: proceed directly to use on a Japanese city without warning",
              advisor: { name: "Stimson", quote: "I have argued against a demonstration on strategic grounds, not moral comfort. Whether I can say the same about every name still on that target list is a separate question I haven't settled yet." },
              historical: true,
              setFlags: { demonstrationPath: "reject" },
              impact: { readiness: 1, pipeline: 0, initiative: 2 },
              next: "kyotoTargetDebate45",
              outcome:
                "What happened, up to this point. The Franck Report's demonstration proposal is set aside for the reasons the Interim Committee gave: too few bombs to risk one on a demonstration whose failure would cost more than its success could buy, and no confident answer for how a demonstration compels a surrender that the real bombings only narrowly did, alongside the Soviet declaration of war the same week. One question about which city still isn't settled.",
            },
            {
              label: "Attempt the demonstration first — detonate on an uninhabited site, invite Japanese observers, withhold direct city use pending the result",
              advisor: { name: "Compton", quote: "I signed the Franck Report because I believe a demonstration that fails to move Japan's war ministry still costs us less than a first use on a city we can never take back. I am aware I am arguing a minority position, and I am aware why." },
              setFlags: { demonstrationPath: "attempt" },
              impact: { readiness: -1, pipeline: 1, initiative: -2 },
              next: "downfallOrBlockade45",
              outcome:
                "A defensible extension of the position the Franck Report's own signatories held and lost. Whether a demonstration moves a war ministry that has, by this point in the record, treated two firebombed cities and a hundred thousand nightly deaths as an acceptable cost of continued resistance is honestly uncertain. The same faction that dismissed Hiroshima's destruction for several critical days before Nagasaki, in history's own historical record, may treat a demonstration on an empty island as easier still to discount. What this path spares, if it works, is the immediate civilian death toll of a first city strike; what it risks, if it doesn't, is losing the shock value that, combined with the Soviet declaration a few days later, is what really broke the cabinet deadlock in the historical record.",
            },
          ],
        };
        },
        get kyotoTargetDebate45() {
          return dataNode(ALLIED_PACIFIC_DATA, "kyotoTargetDebate45");
        },
        get kyotoStruck45() {
          return dataNode(ALLIED_PACIFIC_DATA, "kyotoStruck45");
        },
        get targetSelection45() {
          return dataNode(ALLIED_PACIFIC_DATA, "targetSelection45");
        },
        get hiroshima45() {
          return dataNode(ALLIED_PACIFIC_DATA, "hiroshima45");
        },
        get nagasaki45() {
          return dataNode(ALLIED_PACIFIC_DATA, "nagasaki45");
        },
        get radiationDisclosure45() {
          return {
          date: "SEPTEMBER 1945",
          title: "A Very Pleasant Way to Die",
          historicalRecord: true,
          situation:
            "Reports are reaching Washington from Japanese doctors, and from the first American personnel on the ground, that people who survived both blasts uninjured are sickening and dying in the weeks afterward: radiation sickness, a mechanism of harm the weapon's own designers understood in secret memoranda but that has not been said plainly to the public. General Groves has already told a reporter the Japanese reports are almost certainly exaggerated. What he says next, to Congress and in public, is still his to decide." +
            (flags.nagasakiAnnouncePath === "minimal"
              ? " Truman's own decision to say nothing further after Nagasaki set the tone this administration has kept ever since: minimal statement, minimal follow-up, and a public posture that leaves Groves plenty of room to characterize what comes next however he judges best."
              : flags.nagasakiAnnouncePath === "direct"
              ? " Truman's own more forthcoming statement after Nagasaki leaves less room than usual for a quiet dismissal here. A government that already chose candor once this year has a harder case for abandoning it now."
              : ""),
          choices: [
            {
              label: "Dismiss the reports: characterize radiation deaths as minimal, Japanese claims as propaganda",
              advisor: { name: "Groves", quote: "They say it is a very pleasant way to die. I have no reason to contradict that testimony with speculation dressed up as certainty." },
              historical: true,
              setFlags: { radiationDisclosurePath: "denied" },
              impact: { readiness: 0, pipeline: 0, initiative: 1 },
              next: "downfallOrBlockade45",
              outcome:
                "Groves tells Congress in November there was no radioactive residue of consequence and that radiation exposure causes no undue suffering, a claim contradicted by secret memoranda his own project had already produced by September. The gap between the classified record and the public one isn't closed for years, closed eventually by outside reporting rather than an official account correcting its own.",
            },
            {
              label: "Report the secret findings honestly: radiation sickness is real, already documented internally, and worth saying so",
              advisor: { name: "Kistiakowsky", quote: "We have a memorandum in this building dated the first of September that already answers the question General Groves is telling reporters is unanswered. I don't understand what's served by pretending otherwise." },
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
            "The second weapon is paused, not canceled: ready, but withheld pending a decision nobody in Washington has actually made yet. Japan's Big Six war council still has only Hiroshima and the advancing Soviet declaration to weigh, not a second city. Whether that changes anything is a real, unresolved historical question, not a settled one: some historians argue the council was never going to move without both shocks arriving close together; others argue a second bomb specifically, not just the passage of time, was what actually broke the deadlock the historical record shows persisting even after Nagasaki.",
          choices: [
            {
              label: "Hold the pause and see whether Hiroshima alone, given time, moves the council",
              advisor: { name: "McCloy", quote: "I asked for a decision to be made instead of assumed. I did not promise anyone that decision would be an easy one, or a fast one." },
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
                    "The rarer reading of a contested question: given days rather than hours, and without a second city added to the first, the peace faction's argument gains real ground within the council for the first time. It isn't a surrender yet, only a shifted balance inside a body that was deadlocked three to three; the Joint Chiefs keep planning for the war's final campaign regardless, because a shifted argument in Tokyo isn't a signed instrument in Washington, and won't be treated as one.",
                },
                {
                  weight: (() => { const w = modWeight(35, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The deadlock holds regardless",
                  setFlags: { nagasakiDelayResult: "deadlock" },
                  impact: { readiness: -1, pipeline: -1, initiative: -2 },
                  outcome:
                    "The more likely reading, and the one the historical record's own three-three deadlock after both bombs and the Soviet declaration together tends to support: the war ministry's hardliners hold their position regardless of how much time passes, because the deadlock was never really about how many cities had been hit. Eventually, with no resolution and a weapon sitting ready, the order gets carried out anyway, later and on worse terms than the historical timeline, having spent the intervening days on a pause that didn't change the outcome it was meant to test.",
                },
              ],
              next: "downfallOrBlockade45",
              outcome:
                "Whether Japan's leadership needed two cities or would have moved with time and one is a question serious historians still argue, and this path answers it once, not the debate itself.",
            },
            {
              label: "Use the extra days for something more than waiting: send an explicit guarantee on the Emperor's status through the Swiss legation, rather than leave Byrnes' own deliberate ambiguity to work on its own",
              advisor: { name: "Grew", quote: "I argued for exactly this clarity before the Potsdam Declaration was ever issued, and I was overruled by people who wanted to leave the hardliners no ambiguity to negotiate inside. I am not certain that caution has bought this room anything but time we're now spending on a second bomb." },
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
                    "The rarer, more consequential reading: an explicit guarantee on the throne, rather than the historical Byrnes note's deliberately preserved ambiguity, gives Togo's own faction something concrete to argue with inside the council rather than a promise they have to interpret favorably on faith. It still isn't a surrender, only a shifted argument, but a shifted argument built on a real, stated term rather than an inference the peace faction had to construct for itself.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The clarity reads as weakness, not reassurance",
                  setFlags: { nagasakiDelayResult: "deadlock" },
                  impact: { readiness: -1, pipeline: -1, initiative: -2 },
                  outcome:
                    "The reading Byrnes' own real advisors warned about, and the reason the historical note stayed deliberately vague: an explicit American guarantee, offered before a second weapon forces the issue, reads to the war ministry's hardliners as proof that Washington wants this war over badly enough to bargain, not as reassurance worth conceding for. The deadlock holds, now with a concrete promise already spent for nothing, on the table for a war ministry that reads its unforced offering as leverage rather than generosity.",
                },
              ],
              next: "downfallOrBlockade45",
              outcome:
                "Whether explicit clarity on the Emperor's status would have shortened the real deadlock, or simply been read as weakness by a war ministry already convinced it was winning the argument by attrition, is a genuine dispute among historians of the surrender's final days, not a settled question this path resolves for the debate itself.",
            },
          ],
        };
        },
        get indianapolisSinking45() {
          return dataNode(ALLIED_PACIFIC_DATA, "indianapolisSinking45");
        },
        get indianapolisReview45() {
          return {
          date: "1945",
          title: "The Indianapolis Findings",
          historicalRecord: false,
          situation:
            "The review confirms what was already suspected: no single failure sank nine hundred men into open water for four days, a chain of them did, spread across enough separate desks that the historical Navy's instinct to find one captain to blame was, whatever else it was, also simpler than the truth. Whether fixing the chain this late in the war changes anything for the ships still at sea in the war's final weeks is the real test.",
          choices: [
            {
              label: "Implement the reform fleet-wide immediately, war footing or not",
              advisor: { name: "Nimitz", quote: "This review was not ordered so it could be filed. Every station in this reporting chain gets the new procedure this week, not after the war ends and it stops mattering." },
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
                    "The new procedure catches a routing gap on another ship within weeks, quietly, before it becomes anyone's tragedy. No headline attaches to a failure that gets caught in time, which is exactly the point and exactly why the historical Navy's version of this reform took as long as it did to arrive.",
                },
                {
                  weight: (() => { const w = modWeight(55, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The war ends before the reform is fully tested",
                  setFlags: { indianapolisReviewResult: "untested" },
                  impact: { readiness: 0, pipeline: 0, initiative: -1 },
                  outcome:
                    "The reform is real, but the war ends within weeks of its adoption, too soon for it to be tested against the kind of failure it was built to catch. Whether it would have worked is a question this timeline, like the historical one, never gets a clean answer to.",
                },
              ],
            },
            {
              label: "Study the reform carefully before rolling it out: get it right rather than get it out fast",
              advisor: { name: "King", quote: "This reform needs to actually work when the war is over, not get rushed into the fleet now and quietly fail the way the old procedure did." },
              setFlags: { indianapolisReviewPath: "deliberate" },
              impact: { readiness: 0, pipeline: 1, initiative: -1 },
              next: "hiroshima45",
              outcome:
                "A more careful reform, still being worked out as the war's final weeks play out around it. It's a better piece of procedure than the rushed version might have been, built at a pace that means it isn't ready to protect anyone still at sea while the war's remaining big decisions, the ones still ahead, get made without it.",
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
              advisor: { name: "Marshall", quote: "Blockade may work. I am not prepared to bet the war's final chapter on 'may.' We prepare the invasion, and we prepare it as though we intend to launch it." + (flags.stilwellUltimatumPath === "delayed" ? " I argued for patience on Stilwell's ultimatum and got a different argument later instead of a resolved one. I'm not making that same trade here." : flags.stilwellUltimatumPath === "immediate" ? " I made the decisive call on Stilwell's ultimatum too. I'd rather commit to a plan now than hedge my way into the same argument twice." : "") },
              historical: true,
              setFlags: { endgameAlliedPath: "downfall" },
              impact: { readiness: -5, pipeline: -1, initiative: 3 },
              disabledReason: meters.pipeline <= -5 ? "The landing craft and shipping tonnage a Kyushu-scale invasion fleet requires haven't been rebuilt at this pipeline level. Blockade is the only option this force can resource." : undefined,
              gateCheck: { meter: "pipeline", threshold: -5, label: "Pipeline" },
              next: "gasWarfareQuestion45",
              outcome:
                "What happened: Downfall was prepared in full. Kyushu's invasion planned for November 1945, Honshu's for the following spring, at casualty estimates that shaped the decision to use the atomic bombs rather than execute the plan at all. Two bombs in August, combined with the Soviet declaration of war, forced a surrender before a single soldier of this invasion ever left a landing craft. The plan that was never executed still shaped the war's actual ending more than almost anything that was.",
            },
            {
              label: "Pursue Operation Starvation: naval encirclement and complete air blockade, no invasion",
              advisor: { name: "LeMay", quote: "This country cannot feed itself past this winter if the sea lanes stay closed and the rail network stays broken. I am not certain an invasion is necessary to finish this war. I am fairly certain a winter is." },
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
                    "LeMay's bet pays off. A hard winter without invasion, without the bombs, breaks the war ministry's deadlock on starvation and exhaustion alone, a disputed but real possibility historians of the blockade's real effectiveness argue for. No American soldier lands on the home islands, and no atomic bomb is needed to force the surrender this path reaches by other means.",
                },
                {
                  weight: (() => { const w = modWeight(35, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The blockade alone isn't enough",
                  setFlags: { blockadeResult: "insufficientAlone" },
                  impact: { readiness: -1, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier outcome. Starvation and exhaustion erode Japan's capacity to fight without breaking the war ministry's actual political deadlock over surrender terms, the same deadlock the historical bombs and Soviet declaration needed both together to finally crack. The winter grinds on, and whatever forces the surrender eventually, it isn't the blockade working alone.",
                },
              ],
              outcome:
                "An honest projection of the argument LeMay and blockade advocates made: mining and submarine warfare had already reduced Japan's import tonnage to a fraction of its 1941 level, and a hard winter without invasion might have forced capitulation without American ground casualties at all. What it doesn't resolve any faster is the war ministry's internal deadlock over surrender terms, a blockade starves a country; it doesn't, by itself, break a cabinet split between honor and survival.",
            },
            {
              label: "Accelerate Downfall's timetable regardless of buildup readiness: land before the force is prepared",
              advisor: { name: "Marshall", quote: "I am being asked to explain why this timetable can't move faster. I am telling this room plainly: it can move faster. I am not telling this room it should." },
              setFlags: { endgameAlliedPath: "accelerated" },
              impact: { readiness: -4, pipeline: -2, initiative: 4 },
              disabledReason: meters.readiness <= -8 ? "There is no force left in a state to accelerate. Whatever timetable this staff wants to keep, the divisions available can't sustain the buildup Kyushu already requires, let alone a faster one." : undefined,
              gateCheck: { meter: "readiness", threshold: -8, label: "Readiness" },
              next: "gasWarfareQuestion45",
              outcome:
                "This is the clearest example of a reckless decision on the Allied side, not a defensible alternative in different clothes. Landing craft, naval gunfire support, and the follow-on divisions Kyushu's invasion plan assumed were never really optional line items, they were the plan's whole basis for the casualty estimates it was built on. Compressing the timetable without them doesn't make the invasion faster. It makes the historical casualty estimates, already the grimmest figures anyone in this room has had to plan around, into a floor rather than a ceiling.",
            },
            ...(meters.pipeline >= 6
              ? [
                  {
                    label: "Pursue both simultaneously: prepare Downfall at full strength while running Operation Starvation alongside it, rather than choosing",
                    advisor: { name: "King", quote: "This entire war, I've been told this fleet can't afford to run two strategies at once. I would like the record to show that, for once, it actually can." },
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
            "Marshall's proposal reaches this room close to the way it actually reached Washington: not a plan for gas warfare against Japanese cities, but a narrower one, aimed specifically at the caves and fortified bunkers that have cost more American lives per yard of ground than almost anything else this war has fought. His stated scope is limited to positions that refuse a formal surrender demand, sparing both close assault by riflemen and any wider bombardment. Stilwell made the same case in writing weeks earlier, arguing the stigma of gas warfare stays attached to its use against civilian populations, not to individual bunkers. Roosevelt's own standing policy said the United States would use gas only in retaliation for its first use by an enemy, never first, a pledge Marshall's proposal asks this room to set aside for a use its own author insists is narrow enough to justify the exception. A separate, more expansive study is also sitting on file, prepared in the Chemical Warfare Service, area gas attacks against troop concentrations near invasion objectives rather than individual bunkers, a scope its own authors' numbers say would kill far more than soldiers refusing to surrender.",
          choices: [
            {
              label: "Uphold Roosevelt's no-first-use pledge: decline the proposal, prepare Downfall without gas",
              advisor: { name: "Stimson", quote: "The President's policy was never conditional on how narrow the next proposal manages to sound. I have read Marshall's case carefully. I am still not the one who gets to unmake a pledge this government made in 1943." },
              historical: true,
              setFlags: { gasWarfarePath: "declined" },
              impact: { readiness: 0, pipeline: 0, initiative: -1 },
              next: nextTarget,
              outcome:
                "What actually happened: the proposal reached Truman in June, and he refused it, holding to Roosevelt's retaliation-only pledge over the tactical case Marshall built for an exception. Downfall's own casualty estimates, the ones that would shape the decision to use the atomic bombs rather than execute the invasion at all, are built without gas as a factor anywhere in the arithmetic.",
            },
            {
              label: "Authorize Marshall's proposal as written: gas restricted to caves and bunkers that refuse a surrender demand",
              advisor: { name: "Marshall", quote: "I am not proposing this against a city. I am proposing it against the specific positions that have made every island since Tarawa cost more riflemen than the position was worth. Keep the men in gas masks for a week, and the assault behind it costs a fraction of what a close assault costs now." },
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
                    "Marshall's own stated limits hold in practice, not just on paper: gas is used only against positions that already refused a surrender demand, and the tactical case behind the proposal largely bears out, fewer riflemen spent taking ground that used to cost several times as many. The precedent this sets, a pledge from 1943 quietly set aside once, stays exactly as narrow as its author promised, at least this once.",
                },
                {
                  weight: (() => { const w = modWeight(45, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The limits erode, and the tactical case falls short of the promise",
                  setFlags: { gasWarfareResult: "creepIneffective" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier failure mode, and the one built into any policy exception that depends on staying exactly as narrow as its first use: cave ventilation and gas masks blunt more of the tactical benefit than Marshall's proposal accounted for, and the same commanders who found the exception easy to justify once find it easier to ask for again against positions that don't quite meet the original 'refused a surrender demand' standard. A pledge that held since 1943 doesn't survive its first exception as cleanly as its author intended.",
                },
              ],
              outcome:
                "The proposal exactly as Marshall wrote it and exactly as Truman actually refused it: a narrow military exception to a three-year-old pledge, made in writing, reaching the President's desk in June 1945. Authorizing it here tests the case Marshall believed, that a policy line drawn against city bombardment doesn't have to be a policy line drawn against a bunker that already refused to surrender.",
            },
            {
              label: "Authorize gas warfare at the Chemical Warfare Service's own broader scale: area attacks on troop concentrations near the invasion objectives",
              advisor: { name: "Porter", quote: "Marshall's proposal is the version that reads well in a memo. Mine is the version that actually shortens the campaign, and I am not going to pretend the difference between the two is small." },
              setFlags: { gasWarfarePath: "areaAuthorized" },
              impact: { readiness: 3, pipeline: -2, initiative: 2 },
              next: nextTarget,
              outcome:
                "This is the clearest example of an indefensible decision available anywhere in this war's planning, not Marshall's narrower proposal dressed up in harsher language. The Chemical Warfare Service's own June 1945 study proposed exactly this, area gas attacks on troop concentrations near Kagoshima rather than individual bunkers, and its own authors' numbers already accounted for large casualties among the unprotected civilian population living in the target area, not as an unfortunate side effect discovered later but as a cost calculated into the plan from the start. Choosing this over Marshall's stated limits isn't a harder version of the same argument. It's a different argument, one the historical record shows senior planners studied in real, specific detail and one Truman's actual refusal of even Marshall's narrower version never had to directly confront, because it was never the proposal that reached his desk.",
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
            "The bombs and the Soviet declaration land on their historical schedule regardless of what this staff prepared alongside them, they were never contingent on Downfall or Starvation's own buildup. What's different is what happens in the days immediately after: a war ministry facing not just the shock of August, but a blockade already visibly tightening and an invasion fleet visibly ready to sail the moment the political deadlock breaks. Whether that combined, visible readiness shortens the argument inside Tokyo, or simply arrives at the same surrender by the same argument regardless, is the real question worth asking.",
          choices: [
            {
              label: "Let the combined pressure speak for itself: make no separate demand, let Tokyo draw its own conclusion from what it's actually facing",
              advisor: { name: "Marshall", quote: "A war ministry that can see a blockade and an invasion fleet both in front of it does not need a lecture from me. Let them do the arithmetic themselves." },
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
                    "The rarer, more consequential branch: facing a blockade already visibly working and an invasion force visibly ready to sail rather than either threat in the abstract, the war ministry's deadlock breaks days faster than the historical argument took, a shorter final act with a lower cost in the closing week's fighting than the historical record's own more drawn-out final days carried. Whether a few days saved more lives than the resources spent running both strategies at once is a trade stated plainly here rather than resolves it one way or the other.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The argument runs its historical course regardless",
                  setFlags: { combinedPressureResult: "unchanged" },
                  next: "sovietHokkaido45",
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome: the war ministry's deadlock was never primarily a matter of how much force was visibly arrayed against it, and collapses in almost the same week it actually did, regardless of whether one strategy or two sat behind the bombs and the Soviet declaration that did the work.",
                },
              ],
              outcome:
                "A reasoned projection built on a genuine uncertainty: whether the war ministry's actual deadlock, which historically took the shock of two bombs and a Soviet declaration together to break, would have broken any faster facing a combined, visible threat rather than either strategy in isolation. Serious historians of the surrender debate are honestly divided on how much the specific military pressure mattered against how much the political shock of the bombs themselves did the work regardless of what sat behind them.",
            },
            {
              label: "Make the combined pressure explicit: a formal statement naming the blockade and the invasion fleet together, the same kind of direct warning Potsdam's own 'prompt and utter destruction' language already set precedent for",
              advisor: { name: "Truman", quote: "We told them plainly in July what continuing this war would cost. I don't see the case for going quiet now, with more to point to, not less." },
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
                    "The rarer, more consequential branch: naming the blockade and the invasion fleet together, in the same direct register Potsdam's own warning used in July, gives Togo's faction a specific American statement to invoke inside the council rather than a threat they have to infer and argue for on their own authority. The deadlock breaks days faster than the historical argument took, a shorter final act than the record's own more drawn-out final days.",
                },
                {
                  weight: (() => { const w = modWeight(40, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The explicit statement changes nothing the war ministry hadn't already assumed",
                  setFlags: { combinedPressureResult: "unchanged" },
                  next: "sovietHokkaido45",
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome: a war ministry already watching a blockade tighten and an invasion fleet assemble does not need Washington to say so out loud to understand its own position, and the deadlock collapses in almost the same week it actually did, an explicit statement adding confirmation rather than new pressure to an argument the hardliners were already losing or already immune to.",
                },
              ],
              outcome:
                "A reasoned projection built on the same genuine uncertainty as the quieter approach, tested from the opposite direction: whether naming the combined threat explicitly moves a deadlock that silence alone might not, or whether a war ministry already facing both pressures in plain sight gets nothing new from hearing them stated formally. Historians of the surrender debate divide on this the same way they divide on the silent approach, for the same underlying reason: nobody can fully separate what the bombs' shock did from what the surrounding strategy, stated or not, contributed.",
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
            "Japan's surrender is imminent, and Stalin has made a request Truman did not expect to have to answer this quickly: a Soviet occupation zone on Hokkaido, the northernmost home island, mirroring the occupation-zone arrangement already dividing Germany. The Red Army's Far East offensive against Japanese forces in Manchuria has moved with startling speed in its first week alone, and Soviet troops are realistically capable of reaching northern Hokkaido before any American force could contest the landing. There is no existing agreement that settles this the way Yalta settled Germany's division in advance, this is being decided now, in the days immediately around the surrender itself, largely on the question of who gets there first and how hard Washington is willing to push back." +
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
                ? { name: "Eichelberger", quote: "Three years fighting back across the Pacific were not spent so I could administer half the surrender at the end of it. Japan is occupied by this command, in full." }
                : { name: "MacArthur", quote: "Accepting this surrender was not to administer half of it. Japan is occupied by this command, in full, or this command has failed at the one thing it was actually asked to do here." },
              historical: true,
              setFlags: { hokkaidoPath: "refused" },
              impact: { readiness: 1, pipeline: 0, initiative: -1 },
              disabledReason: meters.readiness <= -4 ? "There isn't the readiness to actually secure Hokkaido before a Soviet landing at this level. Refusing the request on paper means nothing if the fleet can't back the refusal with troops on the ground first." : undefined,
              gateCheck: { meter: "readiness", threshold: -4, label: "Readiness" },
              next: "theEmperorQuestion45",
              outcome:
                "Truman declines Stalin's request outright, and American forces move to secure Hokkaido before any serious Soviet landing can be mounted, helped by the fact that Soviet naval lift capacity for a Hokkaido operation was limited compared to what taking Manchuria and the Kuril Islands already required. Japan is occupied as a single administrative unit under MacArthur, a decision with enormous consequences for the country's postwar reconstruction, political stability, and eventual alliance alignment that go untracked here, reaching decades afterward.",
            },
            {
              label: "Grant a limited Soviet occupation zone on northern Hokkaido, mirroring the German precedent",
              advisor: { name: "Marshall", quote: "We have already accepted a divided Germany rather than fight the Soviets over the difference. I am not certain Japan is the hill either government actually wants to draw that line on again, this soon." },
              setFlags: { hokkaidoPath: "granted" },
              impact: { readiness: -1, pipeline: 0, initiative: -2 },
              next: "theEmperorQuestion45",
              outcome:
                "A plausible extension of the precedent Germany's own division had just set weeks earlier, and one serious historians of the period consider a live possibility rather than pure invention: Stalin's actual request was taken seriously enough in Washington to require an explicit refusal, not simply ignored. A divided Japan, split along roughly the same logic as divided Germany and later divided Korea, is the most consequential Allied-side counterfactual here: a Soviet-administered northern zone would have reshaped Japan's Cold War alignment, its constitutional settlement, and arguably the shape of East Asian politics for the rest of the twentieth century in ways this Pacific War scope explicitly does not have the standing to project forward.",
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
            "With the surrender signed aboard Missouri, the occupation's actual shape depends on one decision more consequential than any single battle in these final weeks: what happens to Hirohito. Some voices in Washington and among Allied governments want him tried as a war criminal, the same standard being applied to Tojo's cabinet. MacArthur's own read, from the ground, is that prosecuting the Emperor risks an occupation-ending uprising in a country whose entire social order still runs through the throne. The decision has to be made now, before the occupation's first administrative order goes out.",
          choices: [
            {
              label: "Preserve the imperial institution: retain Hirohito as a symbolic figurehead, prosecute the war cabinet instead",
              advisor: { name: "MacArthur", quote: "I am telling this government plainly: try the Emperor, and I will need several hundred thousand more troops to hold this occupation together than I currently have. Leave him the throne, and I believe I can govern this country with the force already here." },
              historical: true,
              setFlags: { emperorPath: "preserve" },
              impact: { readiness: 1, pipeline: 0, initiative: 1 },
              next: "occupationAuthority45",
              outcome:
                "Hirohito retains the throne, stripped of the divine-status doctrine but not the position itself, while Tojo and the war cabinet face trial and, in several cases, execution. The occupation proceeds with a degree of order MacArthur's own read on Japanese social structure predicted, and a constitutional monarchy under American oversight becomes history's own postwar settlement, a decision whose full decades-long consequences go untracked herece but that shaped nearly everything about Japan's reconstruction that came after.",
            },
            {
              label: "Include the Emperor among those tried for the war: apply the same standard used against his cabinet",
              advisor: { name: "Webb", quote: "I have sat through testimony implicating this government at every level below the throne. I am not comfortable pretending the throne itself bears no responsibility for what was done in its name." },
              setFlags: { emperorPath: "prosecute", cohesion: (flags.cohesion || 0) - 2 },
              impact: { readiness: -3, pipeline: -1, initiative: -2 },
              next: "occupationAuthority45",
              outcome:
                "A path some Allied governments, and some of MacArthur's own harshest domestic critics, argued for. Whether it produces the occupation-collapsing resistance MacArthur predicted or a harder but ultimately survivable transition is a counterfactual scholars of the occupation are honestly split on; what's certain is that the smoother postwar settlement the historical decision bought was never free; it was purchased specifically by not testing this question at all.",
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
            : "MacArthur is handed something close to personal sovereignty over occupied Japan, an authority historically extraordinary even by the standards of military government: minimal oversight from Washington, direct command of policy from land reform to constitutional drafting, exercised for six years with almost no real check on his judgment.") + kyotoNote,
          choices: macArthurAbsent || macArthurRelieved
            ? [
                {
                  label: "Vest a single administrator with broad authority, following the historical model despite the change in personnel",
                  advisor: { name: "Eichelberger", quote: "This job was not one I asked for, and I am not going to pretend I am the man the history books would have chosen for it. I am going to do it as well as it can be done by whoever is standing here." },
                  setFlags: { occupationPath: "singleAuthority" },
                  impact: { readiness: 1, pipeline: 0, initiative: 0 },
                  next: "END",
                  outcome:
                    "The historical model survives its own namesake's absence: broad, largely unchecked authority vested in a single administrator, just not the one history gave the job to. Whether that authority is wielded with anything like MacArthur's particular blend of theatrical confidence and genuine administrative competence is an open question left standing here, since the historical comparison it would need has no counterpart to check itself against.",
                },
                {
                  label: "Establish a more collegial Allied Control Council structure instead, distributing authority rather than concentrating it",
                  advisor: { name: "Attlee", quote: "If there is no single figure commanding the personal authority the Americans gave their general, I see no reason to manufacture one artificially. Let the Allied powers share this responsibility, as the Charter we just signed suggests we ought to." },
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
                  advisor: { name: "MacArthur", quote: "Coming this far was not so I could administer this occupation by committee. Give me the authority the job actually requires, and I will answer for how I use it." },
                  historical: true,
                  setFlags: { occupationPath: "macArthurFull" },
                  impact: { readiness: 1, pipeline: 0, initiative: 1 },
                  next: "END",
                  outcome:
                    "MacArthur administers occupied Japan for the next six years with a degree of personal authority historically extraordinary for any American general, overseeing land reform, a new constitution, and the country's basic postwar political shape largely on his own judgment, before Truman relieves him of an entirely different command in Korea in 1951 in one of the more consequential civil-military confrontations in American history.",
                },
                {
                  label: "Constrain the occupation authority with a genuine Allied oversight council from the start",
                  advisor: { name: "Attlee", quote: "The general's competence is not in doubt. I doubt the wisdom of any single officer, however capable, governing a defeated nation with as little oversight as this arrangement proposes to give him." },
                  setFlags: { occupationPath: "constrainedAuthority", cohesion: (flags.cohesion || 0) + 1 },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  next: "END",
                  outcome:
                    "Real Allied oversight from the occupation's first year rather than the largely nominal Far Eastern Commission the historical MacArthur mostly outmaneuvered or ignored. Land reform and constitutional drafting still happen, but slower, and subject to a genuine check the historical occupation's central, unusual feature was precisely the absence of.",
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
            "Winning the argument for near-parity Pacific resourcing at Arcadia means King gets more of the fleet, more landing craft, more escort vessels than the historical Europe-first doctrine ever released to him this early. It also means the Atlantic convoy escort runs thinner through 1942's worst months of the U-boat war, and the buildup for any future cross-Channel invasion slips against a timetable Churchill's planners were already anxious about." +
            (flags.rangoonDefendResult === "worthIt"
              ? " Burma's own front, at least, isn't one of the places that extra resourcing had to be spent propping up: the Chinese divisions committed there actually bought real weeks before Rangoon fell, a rare piece of good news from a theater King's own Pacific-first case never had to account for."
              : flags.rangoonDefendResult === "wasted"
              ? " Burma's own front is one more place this resourcing fight didn't help: Rangoon fell anyway despite the cost of trying to hold it, a loss King's Pacific-first case has to be argued past rather than credited to."
              : ""),
          choices: [
            {
              label: "Press the Pacific advantage: accelerate the island campaigns while the resourcing edge lasts",
              advisor: { name: "King", quote: "We won the argument. I intend to spend what we won before Marshall finds a reason to revisit it." },
              setFlags: { pacificFirstPath: "press", cohesion: (flags.cohesion || 0) - 1 },
              impact: { readiness: 1, pipeline: 2, initiative: 2 },
              disabledReason: meters.pipeline <= -3 ? "The Atlantic escort commitment is already stretched too thin to accelerate the Pacific timetable further without risking convoy losses this staff can't accept." : undefined,
              gateCheck: { meter: "pipeline", threshold: -3, label: "Pipeline" },
              next: "chinaCrisisAllied44",
              outcome:
                "A Pacific war run measurably ahead of its historical schedule: more hulls, more landing craft, momentum banked while the political win from Arcadia still holds. What it costs the Atlantic is the harder question: convoy losses through 1942's U-boat 'Happy Time' were already severe on the historical resourcing level, and this path's thinner escort commitment is an uncomfortable trade a full Battle of the Atlantic model would need to resolve on its own terms, not settled here, though the Pacific war's own later chapters still play out regardless.",
            },
            {
              label: "Bank the resourcing win cautiously: use it to shore up defenses rather than accelerate offense",
              advisor: { name: "Nimitz", quote: "Having more in reserve than we'd normally count on doesn't obligate us to spend it faster than we can use it well. I'd rather bank this against a bad month than burn it proving a point." },
              setFlags: { pacificFirstPath: "bank" },
              impact: { readiness: 2, pipeline: 1, initiative: -1 },
              next: "chinaCrisisAllied44",
              outcome:
                "A more conservative use of the Arcadia win: reinforced defenses at Hawaii and Australia rather than an accelerated offensive timetable, and correspondingly less strain on the Atlantic escort commitment than the aggressive path would have caused. This is a more cautious path, and confidence in it is correspondingly narrower, but the Pacific war still has a mainland front waiting on the other side of it regardless of how cautiously the fleet was spent.",
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
            "Declining the Midway ambush preserves three American carriers against the very real risk the codebreaking intelligence was wrong or incomplete, but it also means Japan's four fleet carriers, undefeated, remain free to choose the Pacific's next move on their own schedule. Hawaii and the Australia route are more heavily fortified than history's timeline required them to be this early, at the cost of the initiative history's actual gamble seized in a single June morning.",
          choices: [
            {
              label: "Use the defensive posture to rebuild carrier strength before seeking battle on better terms",
              advisor: { name: "Nimitz", quote: "The initiative was not lost. It was declined to spend it on a single morning's bet. I intend to use the time that buys us." },
              setFlags: { conservativePath: "rebuild" },
              impact: { readiness: 2, pipeline: 0, initiative: -1 },
              next: "japanStrikesAgain42",
              outcome:
                "A patient rebuilding strategy, banking new fleet carrier construction, Essex-class hulls already working through the yards, against an undefeated Japanese carrier force that has, on this path, a freer hand through the second half of 1942 than history ever gave it. Nimitz's staff know that freer hand won't sit idle for long.",
            },
            {
              label: "Accept a smaller-scale engagement to test the fleet without risking the full commitment Midway would have required",
              advisor: { name: "Fletcher", quote: "We don't have to choose between the big gamble and doing nothing. There's a version of this where we probe, and we learn something, without staking three carriers on a single roll." },
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
                    "The limited engagement pays off better than its modest ambitions suggested it might: real damage inflicted on a Japanese screening force without the full carrier commitment Midway would have required, a genuine lesson bought at a limited price.",
                },
                {
                  weight: (() => { const w = modWeight(45, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The probe teaches less than hoped, at a cost anyway",
                  setFlags: { conservativeProbeResult: "costly" },
                  impact: { readiness: -1, pipeline: 0, initiative: -1 },
                  outcome:
                    "The likelier outcome: a limited engagement that costs real ships and aircrew without producing the clean tactical lesson the smaller stakes were supposed to guarantee. Combined Fleet remains fundamentally undefeated, and this fleet has less to show for the probe than the caution behind it was meant to buy.",
                },
              ],
              outcome:
                "A limited engagement: smaller stakes, smaller lessons, and a Japanese carrier fleet that remains fundamentally undefeated regardless of the outcome. The next move belongs to Combined Fleet, not to this staff, and it's coming.",
            },
            ...(meters.readiness >= 3
              ? [
                  {
                    label: "Rebuild and probe simultaneously: the fleet has enough depth now to do both rather than choose",
                    advisor: { name: "Nimitz", quote: "The depth to run both approaches at once was not something I expected when this staff first proposed picking one. I am not going to keep picking one now that we do." },
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
            "Declining Midway left Japan's four fleet carriers undamaged, and Combined Fleet staff, with none of the losses Coral Sea and a decisive battle would have cost them, are reported turning toward Operation FS, the actual historical plan to seize Fiji and New Caledonia and cut Australia off entirely, shelved in the real war for lack of exactly the carrier strength this fleet still has. Nimitz has three carriers against four undamaged ones, and no Midway-sized ambush left to even the odds." +
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
              advisor: { name: "Nimitz", quote: "I don't have Midway's odds to offer this fleet. I have a choice between a bad fight now and letting Australia's lifeline get cut while I wait for a better one that isn't coming." },
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
                    "The rarer, harder-earned branch: outnumbered four-to-three with no surprise and no codebreaking edge, the fleet still manages to damage the invasion force badly enough to force a withdrawal, at a cost in ships and aircrew this navy has no surplus of to spend on it.",
                },
                {
                  weight: (() => { const w = modWeight(30, meters.readiness); return Math.max(5, 100 - w); })(),
                  title: "The numbers hold, and the fleet has to break off",
                  setFlags: { fsAlliedResult: "forcedWithdrawal" },
                  impact: { readiness: -2, pipeline: -1, initiative: -1 },
                  outcome:
                    "The likelier outcome, and the one the raw numbers always favored: four undamaged carriers against three is not a fight this fleet can win outright, and the engagement costs real ships to buy time rather than a victory, a forced withdrawal that at least keeps the fleet in being for whatever comes next.",
                },
              ],
              outcome:
                "A long-odds engagement, fought without the intelligence advantage or the numerical parity Midway actually offered. There's no historical anchor for how a three-carrier fleet fares against four undamaged ones with the element of surprise gone. What's not in question is the stakes: Australia's supply line and the war's entire Southwest Pacific timetable ride on a fight the historical Pacific Fleet never had to have on these terms.",
            },
            {
              label: "Withdraw further: trade New Caledonia and Fiji for time, bank on Essex-class carriers reaching the fleet by 1943",
              advisor: { name: "King", quote: "Losing an island chain costs less than losing the fleet that's supposed to retake it. The yards are building carriers Japan cannot match production for. I want to still have a Navy when they arrive." },
              setFlags: { fsAlliedPath: "withdraw" },
              impact: { readiness: 2, pipeline: -3, initiative: -2 },
              next: "chinaCrisisAllied44",
              outcome:
                "A patient trade: the South Pacific's forward positions conceded to a Japanese fleet still undefeated, banked against the production advantage the historical war eventually made decisive regardless of any single battle's outcome. Whether Australia's supply situation survives the wait is one open question; the mainland front's own crisis is arriving on schedule regardless, and this fleet's Pacific War is fought from a materially worse starting position than history's from here on.",
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
      if (flags.chinaAloneAidResult === "shifted") return "The Stalemate That Finally Moved";
      if (flags.chinaAloneAidPath === "materiel") return "Everything But the Declaration";
      if (flags.chinaAloneAidPath === "none") return "Europe First, Meant Literally";
      if (flags.chinaAloneAidPath === "volunteers") return "Mercenaries in Everything But Name";
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
      if (flags.philippinesPath === "bypassFormosa") return "Manila, Left Behind";
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
