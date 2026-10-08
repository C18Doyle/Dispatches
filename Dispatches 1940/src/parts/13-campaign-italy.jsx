  italy: {
    id: "italy",
    seal: "COMANDO SUPREMO",
    name: "Italian High Command",
    dates: "1940 — 1945",
    brief: "Direct Italy's war from Mussolini's 'parallel war' entry to the armistice split. No other command in this game reaches a fork like that one.",
    accent: "#2e4a6b",
    dynamic: true,
    start: "nonBelligerence40",
    resolveNode(id, flags, meters) {
      const nodes = {
        get nonBelligerence40() {
          return {
          date: "JUNE 1940",
          title: "The Parallel War",
          historicalRecord: true,
          situation:
            "France is collapsing faster than anyone in Rome expected, and Mussolini has a decision that was supposed to have more time attached to it. Italy declared 'non-belligerence' — not neutrality, a deliberately temporary word — in September 1939, and the standing plan always assumed a longer war would eventually force a choice. It hasn't come to that. Germany looks likely to win outright within weeks, and the fear driving every argument in the Palazzo Venezia today is not that Italy might lose a war it joins now, but that it might win nothing at all from a war it sat out entirely. Badoglio, running the armed forces day to day, has a blunter number for the room: the army is short something like a third of the rifles and most of the reserve artillery its own mobilization tables call for, and none of that gets fixed by a declaration of war.",
          choices: [
            {
              label: "Declare war now — France is already beaten, and the peace table seats only belligerents",
              advisor: { name: "Mussolini", position: "A few thousand dead are needed to sit at the peace table as a belligerent, which costs little now and would cost everything to arrive after the terms are written." },
              historical: true,
              setFlags: { italyEntry: "declare" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "alpsFront40",
              outcome:
                "What actually happened: Italy declared war on France and Britain on June 10, 1940, four days before Paris fell. The peace table access it bought turned out to be worth less than advertised — France's armistice terms were dictated overwhelmingly by Berlin, and Italy's own war, launched to share in a victory already mostly won, still had to be fought from where the army's own readiness actually stood, not where the timing suggested it might.",
            },
            {
              label: "Hold non-belligerence a while longer — rebuild stocks before committing to a shooting war",
              advisor: { name: "Badoglio", position: "An army with a third of its rifle stocks unfilled does not become ready by being told the war has started but by having the rifles, and arriving late to a war that can be fought is better than on time to one that cannot." },
              setFlags: { italyEntry: "wait" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "extendedHoldout40",
              outcome:
                "The road Mussolini himself never seriously entertained, whatever his generals privately wished for: France's collapse is happening regardless of Rome's timetable, and the peace conference forming in its wake will seat whoever is a belligerent when it convenes. Holding out a few more weeks costs the one asset the 'parallel war' concept was built on — being present at the finish — in exchange for readiness numbers the standing mobilization plan says the army still needs.",
            },
          ],
        };
        },
        // Round 19: a real delayed/avoided-entry fork off the "wait" choice above, which
        // previously only set a flavor flag before funneling into the same alpsFront40 node
        // "declare" used — no actual delay. This chain gives "wait" somewhere real to lead:
        // a genuine late-declaration branch, and — if the player keeps pushing it — a deep,
        // explicitly speculative non-belligerence arc with its own distinct ending states,
        // built to the same standard as the backMussolini branch below (historicalRecord: false
        // throughout, speculative: true from enduringNeutrality40 onward, marked plainly as
        // departing from the documented record, wired into positionLabel/projectedEnd/epilogue/
        // oneYearLater/mapOverrides/NODE_HIGHLIGHT_REGIONS).
        get extendedHoldout40() {
          return {
          date: "LATE JUNE 1940",
          title: "The Window Closes Without Rome",
          historicalRecord: false,
          situation:
            "The extra weeks this command argued for have arrived at their actual cost: Germany and France are finalizing armistice terms this week at Compiègne, a negotiation Italy has no seat at because Italy has not yet declared war on anyone. The 'parallel war' doctrine's entire premise — being present as a belligerent when the peace table forms — is about to expire with France still fighting nobody but Germany. Badoglio's readiness numbers have improved only marginally in a month; Mussolini's patience for improving them further has not.",
          choices: [
            {
              label: "Declare now, even at the eleventh hour — a late entry is still an entry",
              advisor: { name: "Mussolini", position: "Late is not absent, and it is better to be recorded as the belligerent who arrived at the last possible hour than the one who never arrived at all." },
              historical: false,
              setFlags: { italyEntry: "lateDeclare" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "alpsFront40",
              outcome:
                "Rome declares days before Compiègne closes the question — technically still a belligerent when France's armistice is signed, though with even less of a war fought to justify the claim than the historical June 10 declaration managed. The peace-table logic the whole doctrine was built on survives in name only: presence without participation.",
            },
            {
              label: "Let the window close — France settles its own armistice without Italy ever entering against it",
              advisor: { name: "Badoglio", position: "There is no dishonor in an army that waited to be ready, and there may be real dishonor in entering a war a week before the enemy stops fighting anyone at all, so let the window close." },
              setFlags: { italyEntry: "missedFrance" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "britainAloneQuestion40",
              outcome:
                "For the first time since Mussolini began arguing for a 'parallel war' a decade of doctrine assumed would always be there to join, Rome watches a European power's collapse happen entirely without Italian participation. France signs its armistice with Germany as a belligerent Italy is not, forfeiting whatever claim on French territory or colonies the peace table might otherwise have allowed. What remains open, with France now out of it, is a narrower and stranger question: whether there is still a war worth entering at all.",
            },
          ],
        };
        },
        get britainAloneQuestion40() {
          return {
          date: "JULY 1940",
          title: "A War Only Half Joined",
          historicalRecord: false,
          situation:
            "France is out, and Italy sat out its fall — a fact no amount of after-the-event diplomacy can undo, whatever the peace conference in Paris ultimately looks like. Britain, alone now among the major powers still fighting Germany, has refused every overture toward a negotiated peace and is bracing for whatever comes out of the air campaign already building over the Channel. The Mediterranean ambitions this staff has argued over for years — Malta, Egypt, Suez — were never actually contingent on France; they are a British problem, not a French one. What is different this month is that entering the war now would mean entering it against Britain alone, for reasons that would have to stand on their own rather than ride the peace-table logic that justified the historical June declaration.",
          choices: [
            {
              label: "Declare war on Britain alone — the Mediterranean fight was always a British one, not a French one",
              advisor: { name: "Ciano", position: "Malta and Suez were never France's to contest, and if the government still wants Mare Nostrum it can want it without a peace table that no longer exists." },
              historical: false,
              setFlags: { italyEntry: "britainOnly" },
              impact: { manpower: 0, fuel: -1, initiative: 1 },
              next: "medStrategy40",
              outcome:
                "A declaration built on a different premise than the historical one — not a rush to claim a seat at a peace conference that no longer needs seating, but a direct wager on the Mediterranean prize itself. Italy enters a war it never fought in the Alps and never fought against France at all, funneling straight into the Malta and Egypt argument that was always the more consequential theater regardless of how the war started.",
            },
            {
              label: "Hold non-belligerence indefinitely — Rome stays out of the wider war entirely",
              advisor: { name: "Badoglio", position: "No doctrine requires this country to fight, only a decade of one man's rhetoric that assumed it always would, and he recommends the rhetoric be proven wrong." },
              setFlags: { italyEntry: "neutral" },
              favor: 1,
              impact: { manpower: 1, fuel: 1, initiative: -2 },
              next: "enduringNeutrality40",
              outcome:
                "This is a road essentially no Italian government under Mussolini ever seriously entertained past the planning-document stage, marked plainly for what it is: a genuine counterfactual, run forward on its own terms rather than folded back into the war that actually happened. Rome stays out — not neutral in the legal sense the regime always insisted was different from non-belligerence, but functionally the same thing the word was invented to avoid admitting.",
            },
          ],
        };
        },
        get enduringNeutrality40() {
          return {
          date: "AUTUMN 1940",
          title: "The Cost of Staying Out",
          historicalRecord: false,
          speculative: true,
          situation:
            "Marked plainly, up front: nothing from here reflects a policy any Italian government under Mussolini's regime actually pursued past a planning document's margin notes — it is a counterfactual, run forward on its own terms rather than folded quietly back into the history that actually happened. Sustained non-belligerence is a stranger position for this regime to hold than it sounds: the entire domestic case for Fascism rested on martial prestige, and a country that sits out a war Germany appears to be winning is a government handing its own opposition — what little of it survives — the one argument it never had before. Berlin, meanwhile, has said nothing formal yet. Hitler's attention this autumn is elsewhere, but an Axis partnership that exists on paper without an Italian war to show for it is not a position anyone in this room expects Berlin to leave unexamined indefinitely.",
          choices: [
            {
              label: "Hold firm publicly — declare non-belligerence a settled, permanent state policy",
              advisor: { name: "Mussolini", position: "He would rather stake the government's legitimacy on having judged the war correctly than on having joined it, though history rewards the second far less often than his generals assume." },
              checkLabel: "Initiative",
              disabledReason: (meters.initiative || 0) >= -3 ? undefined : "too little standing left in the regime's own propaganda apparatus to sell indefinite non-belligerence as strength rather than weakness",
              setFlags: { neutralItaly40: "declared" },
              impact: { manpower: 1, fuel: 1, initiative: -1 },
              next: "germanPressure41",
              outcome:
                "A public, formal commitment — non-belligerence recast in the regime's own propaganda as judgment rather than absence, a harder sell domestically than a declaration of war would have been, but a real one. What it does not settle, and cannot settle unilaterally, is what Berlin eventually decides to do about an ally that never actually fought.",
            },
            {
              label: "Stay non-belligerent but quietly hedge — maintain contingency plans in case Berlin's patience runs out",
              advisor: { name: "Badoglio", position: "Say what the propaganda ministry needs said, but the army's readiness is not staked on Berlin's goodwill lasting indefinitely, whatever gets announced on the radio." },
              setFlags: { neutralItaly40: "hedge" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "germanPressure41",
              outcome:
                "A quieter posture — non-belligerence in public, contingency planning in private, in case the regime's wager on Berlin's patience turns out to be wrong. It costs nothing today and buys, at most, a head start on a crisis this command hopes never arrives.",
            },
          ],
        };
        },
        get germanPressure41() {
          return {
          date: "1941",
          title: "Berlin's Patience, Tested",
          historicalRecord: false,
          speculative: true,
          situation:
            "A year into a European war Italy has still not entered on either side, Berlin's attention through most of 1941 is consumed by a campaign in the Soviet Union that dwarfs anything the Mediterranean could offer — which has, so far, worked in Rome's favor more than any Italian diplomacy has. But an ally that contributes nothing militarily while occupying strategically significant territory on Germany's southern flank is not a standing arrangement Berlin's own planners are likely to leave unexamined forever, particularly once the Eastern campaign's own demands make every spare division and every secure supply route worth having elsewhere. What this command controls is not whether the question gets asked, only how it answers when it does." +
            (flags.neutralItaly40 === "hedge"
              ? " The contingency planning kept quiet since last autumn has not gone entirely unnoticed — German liaison officers have asked more questions about Italian mobilization readiness than a purely neutral posture would explain."
              : ""),
          choices: [
            {
              label: "Offer economic concessions short of alliance — raw materials, basing rights, transit access — to keep Berlin tolerant of the arrangement",
              advisor: { name: "Ciano", position: "Berlin does not have to be given a war, only enough of what a war would have provided that the difference stops mattering to them." },
              checkLabel: "Matériel",
              disabledReason: (meters.fuel || 0) >= -2 ? undefined : "too little left in reserve to offer German transit and resource access without visibly straining the arrangement it's meant to protect",
              setFlags: { neutralItalyResponse41: "concede" },
              impact: { manpower: 0, fuel: -2, initiative: 0 },
              next: "neutralItalyEnd45",
              uncertain: [
                {
                  weight: modWeight(55, meters.initiative),
                  title: "The concessions hold Berlin's patience — for the duration",
                  setFlags: { neutralItalyPressure: "tolerated" },
                  impact: { manpower: 1, fuel: 0, initiative: 1 },
                  outcome:
                    "Eastern-front demands keep absorbing everything Berlin has to spare for the rest of the war, and a non-belligerent Italy quietly paying its way in raw materials and transit access turns out to cost Germany less attention than actually compelling compliance would. The arrangement holds, uneasily but completely, for the duration — a country that spends the entire European war neither fighting nor fully sovereign, and never once fires a shot in it.",
                },
                {
                  weight: 100 - modWeight(55, meters.initiative),
                  title: "The concessions buy time, not tolerance",
                  setFlags: { neutralItalyPressure: "coerced" },
                  impact: { manpower: -1, fuel: -1, initiative: -1 },
                  next: "neutralItalyOccupied42",
                  outcome:
                    "What the concessions actually bought turns out to be measured in months, not years — useful cover while Berlin was occupied elsewhere, not a durable settlement. By late 1942, with the strategic picture shifting and Rome's usefulness as a compliant-but-uncommitted neighbor no longer outweighing the risk of leaving it that way, Berlin moves.",
                },
              ],
            },
            {
              label: "Refuse all concessions — stake this government's remaining legitimacy on genuine, unconditional independence",
              advisor: { name: "Mussolini", position: "A neutrality that pays tribute to be tolerated is not neutrality, and he would rather find out directly what the alliance was worth to Berlin than spend it slowly, concession by concession, finding out the same thing." },
              setFlags: { neutralItalyResponse41: "refuse" },
              impact: { manpower: 0, fuel: 1, initiative: 1 },
              next: "neutralItalyEnd45",
              uncertain: [
                {
                  weight: modWeight(35, meters.initiative),
                  title: "Berlin lets it stand — the Eastern campaign has no attention left to spare",
                  setFlags: { neutralItalyPressure: "tolerated" },
                  impact: { manpower: 1, fuel: 1, initiative: 2 },
                  outcome:
                    "The gamble pays off, against odds this staff's own assessment gave it: whatever irritation Rome's refusal generates in Berlin, it never translates into action, because the resources compelling it would require are resources the Eastern Front will not release for the rest of the war. Italy holds an independent, unconditional non-belligerence through to the end of a European war it never once entered — the wager Mussolini staked his government's legitimacy on, vindicated in full.",
                },
                {
                  weight: 100 - modWeight(35, meters.initiative),
                  title: "Berlin answers the refusal directly",
                  setFlags: { neutralItalyPressure: "coerced" },
                  impact: { manpower: -2, fuel: -1, initiative: -1 },
                  next: "neutralItalyOccupied42",
                  outcome:
                    "The refusal is answered, not ignored — German formations already stationed in southern France and the Balkans begin repositioning toward the Italian frontier within weeks, a pressure campaign considerably blunter than the concessions path's slower squeeze. Whatever independence this wager was staked on is about to be tested directly rather than merely asserted.",
                },
              ],
            },
          ],
        };
        },
        get neutralItalyOccupied42() {
          return {
          date: "LATE 1942",
          title: "The Ultimatum",
          historicalRecord: false,
          speculative: true,
          situation:
            "What arrives is not an invasion in the conventional sense — Berlin has neither the spare divisions nor, this deep into the Eastern campaign, the appetite for conquering a nominal ally outright. What arrives instead is closer to the arrangement Germany actually imposed on Vichy France's unoccupied zone the same season, when Allied landings in North Africa made a fully neutral southern France an intolerable risk: German formations moving to occupy strategic points — ports, airfields, the Alpine passes — while offering Rome a choice dressed as a formality. Accept German 'protection' and effective occupation without further resistance, or refuse it and find out directly what a German military response to an ally's refusal actually looks like.",
          choices: [
            {
              label: "Submit — accept German terms rather than resist a war this command spent two years avoiding",
              advisor: { name: "Cavallero", position: "An entire policy was built around not fighting this war, and the men it saved will not be spent proving a point about sovereignty at the last possible moment." },
              historical: false,
              setFlags: { neutralItalyEnd: "submit" },
              impact: { manpower: 0, fuel: -1, initiative: -1 },
              next: "END",
              outcome:
                "The arrangement Mussolini's regime spent two years and considerable domestic credibility avoiding arrives anyway, just later and by a quieter road than the war it sidestepped would have taken: German garrisons at the ports and passes, an occupied-in-practice status dressed in whatever language the propaganda ministry can still manage, and a country that never fired a shot in this war ending up dominated by the same power its non-belligerence was supposed to keep at arm's length.",
            },
            {
              label: "Resist — refuse the ultimatum and find out what a German response to an ally's defiance actually costs",
              advisor: { name: "Ciano", position: "Italy refused to fight for Berlin for two years, and he would like the government's last act to be refusing again, and not simply being absorbed without a shot fired either way." },
              checkLabel: "Manpower",
              disabledReason: (meters.manpower || 0) >= -3 ? undefined : "too depleted a standing army left to make a refusal credible rather than merely symbolic",
              setFlags: { neutralItalyEnd: "resist" },
              impact: { manpower: -2, fuel: -1, initiative: 1 },
              next: "END",
              uncertain: [
                {
                  weight: modWeight(30, meters.initiative),
                  title: "The refusal holds — Berlin doesn't press further",
                  setFlags: { neutralItalyResistResult: "held" },
                  impact: { manpower: -1, fuel: 0, initiative: 1 },
                  outcome:
                    "Against most of this staff's own private assessment, the refusal is not immediately tested further — an occupation Berlin cannot fully resource on top of the Eastern Front's own demands turns out to be a threat with less follow-through behind it than the ultimatum implied. Italy ends the year still formally independent, at a cost measured in reserves spent readying for a fight that, for now, doesn't come.",
                },
                {
                  weight: 100 - modWeight(30, meters.initiative),
                  title: "Berlin presses the point directly",
                  setFlags: { neutralItalyResistResult: "fought" },
                  impact: { manpower: -3, fuel: -1, initiative: -1 },
                  outcome:
                    "The country that spent two years engineering a way to avoid fighting this war ends up fighting a version of it after all — not alongside Germany and not, in any organized sense, against the Allies either, but directly against the ally its entire policy was built to placate. A stranger, smaller war than the one it avoided, against an opponent this army was never built or postured to face.",
                },
              ],
            },
          ],
        };
        },
        get neutralItalyEnd45() {
          return {
          date: "1945",
          title: "The War That Passed Rome By",
          historicalRecord: false,
          speculative: true,
          situation:
            "The war in Europe ends without this command ever having fought it — no declaration against France, no desert campaign, no Greek winter, no armistice split into two rival governments. What the documented record's own Italy paid in casualties, occupied territory, and a fractured postwar reckoning between north and south, this Italy simply never billed. What it also never has is a place at whichever peace conference now assembles: a non-belligerent for six years running is not a power anyone at that table is likely to consult about how Europe gets redrawn.",
          choices: [
            {
              label: "Treat the outcome as vindication — the regime judged the war correctly, and history should say so",
              advisor: { name: "Mussolini", position: "Let the history books record what they will about courage, since he would rather be remembered as the government that judged a catastrophe correctly than the one that shared in it heroically." },
              setFlags: { neutralItalyRetrospect: "vindicated" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "END",
              outcome:
                "A verdict this command is, in fairness, better positioned to argue than almost any other in this war: the army is intact, the cities are unbombed, and the casualty lists that define every other version of this campaign simply don't exist here. What it costs is harder to put a number on — a seat at the table where the postwar order actually gets decided, forfeited the moment this government chose not to be a belligerent on either side of it.",
            },
            {
              label: "Acknowledge the cost plainly — surviving a catastrophe is not the same as having answered for it",
              advisor: { name: "Badoglio", position: "Italy is alive and the army intact, which is not a small thing after what the continent has done to itself in six years, but the country did not answer for anything, it only avoided being asked." },
              favor: 1,
              setFlags: { neutralItalyRetrospect: "unresolved" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "END",
              outcome:
                "The more honest closing note available to this command: a country that spent six years neither fighting fascism's war nor answering for having built the regime that might have joined one, left to decide for itself — in a Europe it had no hand in remaking — what, if anything, that avoidance actually cost it.",
            },
          ],
        };
        },
        get alpsFront40() {
          return {
          date: "JUNE 1940",
          title: "The Alps Offensive",
          historicalRecord: true,
          situation:
            "France's collapse in the north leaves a strange, almost beside-the-point front open in the Alps: a French Army of the Alps, heavily outnumbered and already ordered to prepare a withdrawal, dug into permanent fortifications the Italian army's own prewar planning never seriously expected to have to assault this soon, against this little preparation time. Army Group West's staff work was rushed together in days, not the months a mountain offensive against fortified positions would normally get." +
            (flags.italyEntry === "declare"
              ? " This is exactly the readiness gap Badoglio warned the declaration itself would produce — a rifle shortage and a rushed staff plan, arriving on schedule."
              : flags.italyEntry === "wait"
              ? " The extra weeks this command spent arguing for before declaring bought a marginally less threadbare mobilization than the historical timetable had, though not enough to turn a rushed mountain offensive into a properly planned one."
              : flags.italyEntry === "lateDeclare"
              ? " This command held out nearly to the armistice itself before declaring — the readiness gap Badoglio warned about is smaller than the historical one, but the window to actually use it against a French army already collapsing is smaller still."
              : "") +
            " The armistice clock is also running — France and Germany are already talking terms — which means whatever ground gets taken has to get taken fast to count for anything at the table at all.",
          choices: [
            {
              label: "Push hard for maximum territorial gains before the armistice closes the window",
              advisor: { name: "Graziani", position: "Whatever is held when the guns stop is what is held, and this week's casualties are better spent buying ground than the peace conference spent explaining why there is none to show." },
              historical: true,
              setFlags: { alpsFront40: "push" },
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "medStrategy40",
              // Round 21 (2026-10-05, Craig: the second Italian Order of Battle, the Alps
              // offensive, picked over the Epirus winter). Unlike Sedan, Moscow and Battle of
              // Britain Day, the historical result here is the unlucky one, so the minority
              // outcome comes first and the text that used to be this choice's own outcome is the
              // second: the player's plan can beat the odds the history gives it, not just match
              // them. Facts verified 2026-10-05 (Wikipedia, Italian invasion of France; Alfredo
              // Guzzoni): Army Group West under Crown Prince Umberto, with Graziani the de facto
              // commander, about 300,000 men in 18 infantry and 4 Alpine divisions with some 3,000
              // guns against about 85,000 French at the front; a directive of 7 June ordered an
              // "absolute defensive behaviour" and the offensive began on 21 June; the main attack
              // was by the 4th Army (Guzzoni) through the Little St Bernard Pass on a 34-40 km
              // front, with a secondary advance along the coast; the French had blown the bridges
              // on the Little St Bernard road and held the Redoute Ruinée with seventy men and the
              // advance post at Seloge; many Italian guns were Austro-Hungarian pieces captured in
              // 1918; the Italian fort on Mont Chaberton lost six of eight turrets to 57 shots from
              // French 280-mm mortars; the offensive "penetrated a few kilometres into French
              // territory" and Menton was the most significant conquest; Italian losses were
              // about 640 killed, 2,631 wounded and 2,151 frostbitten, French about 40 killed.
              keyBattleSubgame: {
                id: "alps40",
                title: "Order of Battle — The Little St Bernard",
                flavor:
                  "The directive of 7 June said to stay on the defensive; the order of the third week of June says attack. Army Group West has some three hundred thousand men facing perhaps eighty-five thousand French in prepared positions, on passes that are still snowed in near the top. The French have blown the bridges on the Little St Bernard road and hold the old Redoute Ruinée above it, and a good part of the Italian artillery is Austro-Hungarian, captured in 1918. What's decided here is the weight behind the Fourth Army's main thrust: how much goes to the Alpini and infantry who have to climb, to the guns that must range across the valleys, to the aircraft that Italian staffs cannot easily call on, and to the mule trails and the road that carry everything the army uses.",
                categories: [
                  { id: "assault", name: "Alpini & Infantry Assault", meter: "manpower" },
                  { id: "artillery", name: "Corps Artillery", meter: "fuel", strand: "ammo" },
                  { id: "air", name: "Regia Aeronautica", meter: "fuel", strand: "oil" },
                  { id: "supply", name: "Mules & Mountain Roads", meter: "fuel", strand: "ship" },
                ],
                // Assault highest — the Alpini and the line infantry are the army's best arm, and
                // the offensive turned on whether they could climb; Artillery second — a lot of
                // guns, many of them old; Air third — a large bomber fleet that could hardly be
                // directed from the ground, since orders forbade direct contact between the
                // services; Supply lowest, deliberately — one road with its bridges down and a
                // handful of mule trails are this battle's own ceiling, the same design choice as
                // Monte Marrone's mule trail.
                effectiveness: { assault: 2.3, artillery: 1.8, air: 1.7, supply: 1.6 },
                orderOfBattle: {
                  assault: {
                    units: [
                      "Fourth Army (Guzzoni), whose Alpine Army Corps made the main attack through the Little St Bernard Pass",
                      "First Army (Pintor) on the southern front",
                      "About 300,000 men in all: 18 infantry divisions and 4 Alpine divisions",
                    ],
                    real: "The offensive of 21 June penetrated a few kilometres into France and stalled, with Menton its most significant conquest. Italian losses were about 640 killed, 2,631 wounded and 2,151 cases of frostbite.",
                  },
                  artillery: {
                    units: [
                      "About 3,000 guns in Army Group West, many of them Austro-Hungarian pieces captured in 1918",
                      "The fortress guns of the Alpine Wall, including the fort on Mont Chaberton",
                    ],
                    real: "French 280-mm mortars silenced six of Chaberton's eight armoured turrets in 57 shots.",
                  },
                  air: {
                    units: [
                      "The 1a Squadra Aerea in northern Italy, with SM.79 and BR.20 bombers and CR.42 fighters",
                      "Against about 70 French fighters, 40 bombers and 20 reconnaissance aircraft in the Alps zone",
                    ],
                    real: "The services were forbidden to communicate directly, which made co-operation between the air force and the army almost impossible.",
                  },
                  supply: {
                    units: [
                      "Five practicable roads over the passes: the Little St Bernard, Mont Cenis, Montgenèvre, the Maddalena and the Col de Tende",
                      "Mule trains and the Alpini's own pack transport",
                    ],
                    real: "The French destroyed the bridges on the Little St Bernard road, which would have been the easiest route.",
                  },
                },
                // Round 23: orders from above in the campaign's hard mode (modeled, not documented).
                hardRule: { text: "Mussolini's order stands: attack along the whole front at once.", lockApproach: "wholeFront" },
                // Round 22. Verified 2026-10-05 (Wikipedia, Italian invasion of France): the offensive cost the
                // Italian army 2,151 frostbite casualties in four days, and the passes (the Little St Bernard is
                // above 2,000 metres) were still under snow.
                conditions: "The high passes are still under snow in late June, and the nights are cold enough that frostbite cost the Italian army 2,151 men in four days of fighting. The mountains and the weather make air support hard to direct.",
                terrainModifiers: { supply: 0.85, air: 0.9 },
                terrainNotes: { supply: "snow on the road and trails", air: "cloud over the passes" },
                attrition: [
                  { category: "assault", atLeast: 3, meter: "manpower", delta: -1, reason: "Frostbite on the heights" },
                ],
                // Field decision. Facts (Wikipedia, same article): the French blew the bridges on the Little St
                // Bernard road, held the Redoute Ruinee and the post at Seloge, and had 86 platoons of ski scouts;
                // on 21 June French 280-mm mortars silenced the Chaberton fort. The three answers are the real
                // options of the day; their payoff against each French posture is modeled.
                decisions: [
                  {
                    id: "roadOrHighGround",
                    time: "1100",
                    title: "The road or the high ground",
                    prompt: "The French have blown the bridges on the road and hold the old posts above it. Fighting up the road means mending it under fire. The Alpini could go over the high cols instead, through the snow, and come down behind the posts.",
                    options: [
                      {
                        id: "overCols",
                        name: "Send the Alpini over the high cols, around the French posts",
                        note: "Fast if no one is watching the cols, and costly if they are.",
                        bonus: 0,
                        bonusByPosture: { bridgesDown: 4, fortressGuns: 1, skiScreen: -3 },
                        reportLine: "The Alpini leave the road and climb toward the high cols, in single file through the snow.",
                      },
                      {
                        id: "mendRoad",
                        name: "Mend the road and bring the guns up behind the infantry",
                        note: "Slow, and it costs Matériel, but the guns can answer the forts.",
                        bonus: 0,
                        bonusByPosture: { bridgesDown: 1, fortressGuns: 4, skiScreen: 1 },
                        meters: { fuel: -1 },
                        costReason: "Engineers and guns committed to the road",
                        reportLine: "Engineers go to work on the broken bridges, and the guns wait on the road behind the infantry.",
                      },
                      {
                        id: "standFast",
                        name: "Stand on the ground already held and let the armistice talks decide the rest",
                        note: "No further risk, and nothing more gained.",
                        bonus: 0,
                        bonusByPosture: { skiScreen: 3 },
                        reportLine: "The army stops where it is and waits to hear what the armistice talks will give it.",
                      },
                    ],
                  },
                ],
                categoryContext: {
                  assault:
                    "The Alpini and the line infantry are the arm that climbs, and the passes are steep and still deep in snow. Each commitment here puts more men onto the slope in the first push.",
                  artillery:
                    "Many of the guns are old, and the French forts have the passes ranged. Each commitment here puts more of the corps artillery onto the fortified posts that block the way.",
                  air:
                    "The Italian bomber fleet is large, but the orders forbid the services to speak to each other directly. Each commitment here asks for a mission over the French posts and hopes it can be coordinated with the ground.",
                  supply:
                    "The French have blown the bridges on the Little St Bernard road, and beyond them there are only mule trails. Each commitment here puts engineers on the road and more mules on the trails.",
                },
                flashups: {
                  assault: [
                    "An Alpini battalion starts up the pass in single file, ice axes in their hands.",
                    "A line infantry company goes forward over the snow behind the Alpini.",
                    "A platoon reaches the first French post and finds it empty.",
                    "A company is pinned on an open slope by machine-gun fire from the ruins of the old fort.",
                    "The Alpini reach a ridge above the road and dig in at four in the morning.",
                  ],
                  artillery: [
                    "A battery of old Austro-Hungarian howitzers fires on a French post at the top of the pass.",
                    "The corps artillery shifts fire to a fort that has been shelling the approaches.",
                    "A French gun answers, and a shell lands among the mules.",
                    "A forward observer reports the guns are firing short at the limit of their range.",
                    "The guns fall silent for lack of shells on the right trail.",
                  ],
                  air: [
                    "A formation of Italian bombers goes over the pass, high above the cloud.",
                    "A bomber crew drops on a French post, and the observers on the ground cannot say where.",
                    "A flight of fighters patrols the valley, with nothing to fight.",
                    "A reconnaissance aircraft reports French guns moved to a new position above the road.",
                    "The air attack is cancelled for weather, and the ground troops are told after they have started.",
                  ],
                  supply: [
                    "Engineers begin to bridge the gap where the French blew the road.",
                    "A mule train struggles up the trail through the snow with the next day's rations.",
                    "A supply column halts behind a blown bridge and waits for the engineers.",
                    "A company that came up without winter clothing reports its first cases of frostbite.",
                    "Ammunition is carried the last miles to the front line on men's backs.",
                  ],
                },
                reportTimes: { open: "0400", contact: "0700", cats: ["0830", "1100", "1400", "1700"], reserve: "1930", counter: "2100" },
                idleLines: {
                  assault: [
                    "No extra men go up the slope. The attack goes in with what was on the start line.",
                    "The Alpini hold at the foot of the pass, and the road stays closed.",
                  ],
                  artillery: [
                    "No extra guns are brought to bear. The batteries fire on their plan and nothing more.",
                    "The corps artillery is given no new targets. The French posts above the road are left alone.",
                  ],
                  air: [
                    "No air mission is requested, and the bombers stay at their fields.",
                    "Nothing is asked of the air force, and the ground troops fight without it.",
                  ],
                  supply: [
                    "No extra effort goes into the road or the trails. The army carries what it has.",
                    "The engineers are left to the bridge, and the mule trains go up when they can.",
                  ],
                },
                verdicts: ["The Pass Is Forced", "The Mountain Holds"],
                verdictGrades: {
                  clean: "The Alpini climbed, the guns ranged on the posts, the road was mended, and the pass was forced before the French could make a stand.",
                  costly: "The pass is forced, but the army that did it is worn down by the snow and the road, and each arm paid for it.",
                  marginal: "The attack gets onto the pass but not through it. The French hold the high ground and the road stays closed.",
                  total: "The attack comes to a stop in the snow, with the road behind it still cut and the French still on the heights.",
                },
                counterattack: {
                  category: "assault",
                  severity: { skiScreen: 2, fortressGuns: 1, bridgesDown: 1 },
                  warn: {
                    1: "French posts on the heights are counterattacking along the line.",
                    2: "French ski patrols and mountain troops are massing for a counterattack on the flank of the advance.",
                  },
                  results: {
                    repulsed: "The French counterattack is thrown back and the line stays where it is.",
                    heldAtCost: "The line holds against the French, but the companies that held it are badly cut up.",
                    broke: "The French break into the line, and the fight goes on at close range in the snow.",
                    gaveGround: "The line falls back off the high ground rather than fight the French out where they struck.",
                  },
                },
              },
              uncertain: [
                {
                  weight: modWeight(25, meters.initiative),
                  title: "The pass is forced before the armistice",
                  setFlags: { alps40Result: "forced" },
                  impact: { manpower: 0, fuel: 0, initiative: 1 },
                  outcome:
                    "The minority projection, which the plan on paper allowed for and the mountain gave almost no one: the road is mended, the Alpini climb above the French posts and the attack on the Little St Bernard gets over the pass before the armistice stops it. It is still a few valleys and a coastal town, nowhere near Nice or Savoy, but enough that Rome argues for its claims from a map and not from a wish.",
                },
                {
                  weight: 100 - modWeight(25, meters.initiative),
                  title: "The mountain holds",
                  setFlags: { alps40Result: "stalled" },
                  impact: { manpower: -1, fuel: 0, initiative: 1 },
                  outcome:
                    "The rushed offensive gains almost nothing — French fortified positions at Mont Cenis and along the frontier hold through the war's final week against an attack thrown together too fast to properly support, and casualties run into the low thousands for a few villages' worth of ground. Mussolini's own later verdict on this episode was blunter than any staff assessment: he called the campaign an embarrassment he'd rather not have run at all. The territory claimed at the armistice table comes from the negotiation, not from what the offensive actually seized.",
                },
              ],
            },
            {
              label: "Limited, symbolic advance only — hold the line, let diplomacy do the work",
              advisor: { name: "Badoglio", position: "The negotiators in Munich will decide what Italy gets, and an offensive this rushed spends men to influence a decision that is not being made on this front." },
              setFlags: { alpsFront40: "limited" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "medStrategy40",
              outcome:
                "The historical judgment on the offensive that was launched applies here too, just without the casualties spent proving it: this front was never going to decide anything the armistice terms didn't already decide first. Restraint costs nothing tangible and saves several thousand men a rushed, under-prepared assault would otherwise have spent on fortified ground for symbolic returns — but it also leaves nothing on the record for the propaganda ministry to point to, in a war whose entire premise was arriving at the table with something to show.",
            },
          ],
        };
        },
        get medStrategy40() {
          return {
          date: "JULY 1940",
          title: "The Mediterranean Question",
          historicalRecord: false,
          situation:
            "With France out of the war, the Mediterranean question that Italian naval and colonial planners have argued for years is suddenly live rather than theoretical: Britain's presence in the sea Italian doctrine calls 'Mare Nostrum' now rests on exactly two pillars, Malta and Egypt, and taking either seriously would require committing resources the standing plans for both were never actually funded to the level their advocates wanted. Malta sits astride every convoy route to Libya, weakly garrisoned in the war's opening weeks and — by the fleet staff's own admission — genuinely vulnerable to a properly resourced invasion before British reinforcement catches up. Egypt and the Suez Canal are the larger prize, defended by a British force in Libya's neighboring desert that outnumbers nothing Italian in the theater except manpower on paper. Rome has never had to choose between these two objectives for real, because until this month there was always a war in France absorbing the argument instead." +
            // Round 21 (Alps echo): only when the player ordered the push and fought the battle.
            (flags.alpsFront40 === "push"
              ? (flags.alps40Result === "forced" ? " The army that forced the Little St Bernard is in better spirits than the staff expected." : "") + keyBattleEcho("alps40", flags)
              : ""),
          choices: [
            {
              label: "Move on Malta first — invade now, while the garrison is still weak",
              advisor: { name: "Cavagnari", position: "Every ship lost to Malta's air and submarines this year is one the Libya campaign needed and will not have, so take the island now while it can be taken, or spend the whole war paying its toll." },
              setFlags: { medStrategy: "malta" },
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "greeceDecision40",
              outcome:
                "The invasion the fleet staff argued for and the historical Comando Supremo never actually ordered — attempted here in earnest, this early, against a garrison still reinforcing and defenses still being built rather than the hardened position a later assault would face. It is a real gamble on a real window: every assessment this staff has says Malta will not stay this vulnerable for long.",
              uncertain: [
                {
                  weight: modWeight(45, meters.initiative),
                  title: "The window holds — Malta falls",
                  setFlags: { malta40: "fell", herculesResult: "fell" },
                  impact: { manpower: -1, fuel: 0, initiative: 1 },
                  outcome:
                    "The gamble the historical Comando Supremo never actually took pays off: an amphibious and airborne assault mounted while Malta's garrison is still a fraction of what British reinforcement will eventually make it takes the island within days, not the extended siege a later, hardened assault would need. The convoy war to Libya is rewritten from this point forward — there is no year-long argument left to have about an Operation Hercules, because there is no island left across the shipping lanes to invade. What this early a commitment costs is Egypt's own timetable, spent on a target the record says really was there for the taking.",
                },
                {
                  weight: 100 - modWeight(45, meters.initiative),
                  title: "The garrison holds longer than estimated",
                  setFlags: { malta40: "held" },
                  impact: { manpower: -2, fuel: -1, initiative: -1 },
                  outcome:
                    "The general staff's optimism about a still-reinforcing garrison turns out to have been optimism and nothing more precise than that: the assault stalls against defenses thinner than they will become but not thin enough, and the attempt is called off at a real cost in landing craft and paratroopers Italy cannot easily replace. Malta survives to harden, and the argument this choice was meant to end for good is instead still there to have again in a year, on worse terms.",
                },
              ],
            },
            {
              label: "Push into Egypt immediately — Suez is the prize that actually decides the theater",
              advisor: { name: "Mussolini", position: "The war was not entered to besiege an island. Egypt is where the empire is decided, and the Tenth Army outnumbers Wavell's whole command on paper, so send them forward." },
              historical: true,
              setFlags: { medStrategy: "egypt" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "greeceDecision40",
              outcome:
                "What actually happened, eventually and hesitantly: the Tenth Army's advance into Egypt didn't begin until September, and even then stopped at Sidi Barrani, sixty miles short of the nearest serious British position, digging in rather than pressing on. The paper numbers Mussolini cites were real; what they didn't capture was a logistics train built for colonial policing, not a mechanized desert offensive, and a British Western Desert Force that would spend the intervening months training for exactly the counterattack this hesitation buys it time to prepare.",
            },
            {
              label: "Reach past both — press Berlin and Madrid for an Italian seat in closing Gibraltar",
              advisor: { name: "Ciano", position: "Malta and Egypt are the sea's own doors and Gibraltar is the lock on the whole house, and if it is opened without Rome in the room the rest of the war is spent being handed small change while Berlin and Madrid divide the estate." },
              setFlags: { medStrategy: "gibraltar" },
              impact: { manpower: 0, fuel: -1, initiative: 1 },
              next: "gibraltarGambit40",
              outcome:
                "The boldest reading of the Mediterranean question, and the one the actual Ciano — vain, ambitious, and privately contemptuous of how little Rome was consulted on anything Berlin considered its own diplomacy — would plausibly have argued for, given the chance: rather than contest the sea's two internal doors, press for a role in closing its western mouth entirely. Rome has never had a real seat at this particular table; whether pulling one up changes anything is a question this command is now committed to finding out.",
            },
          ],
        };
        },
        get gibraltarGambit40() {
          return {
          date: "SEPTEMBER 1940",
          title: "A Third Claimant at the Table",
          historicalRecord: false,
          situation:
            "Ciano's overture to Madrid runs immediately into the arithmetic that will, in the war's actual record, sink Franco and Hitler's own Hendaye meeting in October without Rome's help: Franco's price for entering the war is not applause, it is territory — French Morocco, the Oran district, weapons and grain Spain cannot feed itself without — and every acre of French North Africa promised to Madrid is an acre a rival claimant government in Rome has its own long-standing designs on. Italian colonial planning has eyed Tunisia, bordering Spanish-administered Morocco, for years; a Spain rewarded generously enough to actually move against Gibraltar is a Spain whose new North African border sits closer to Italian ambitions than Comando Supremo has ever had to plan around. The choice in front of Ciano is not whether Franco's price is real — the historical record already answers that — it is whether Rome is willing to grease that price with its own claims to get a result Berlin alone never quite bought.",
          choices: [
            {
              label: "Back Franco's price in full, in exchange for German guarantees on Italy's own claims elsewhere",
              advisor: { name: "Ciano", position: "Let Madrid have Oran if Oran unlocks Gibraltar for good, since a French department never going to be held is a fair trade for a written guarantee on Tunisia and Nice, a debt Berlin can be made to remember." },
              setFlags: { gibraltarGambit: "backFranco" },
              impact: { manpower: 0, fuel: -1, initiative: 1 },
              next: "gibraltarResolution40",
              outcome:
                "A real diplomatic wager, and an uncomfortable one for a government that has its own list of French territory it wants at the eventual peace table: sweetening Franco's price with Italian consent, rather than Italian silence, is the one lever the historical Hendaye meeting never actually had available to it. What it buys, if it buys anything, is untested — nothing in the documented record says Franco's caution was only ever about the price on offer.",
            },
            {
              label: "Hold back — let Madrid name its price to Berlin alone, and keep Rome's own claims out of the bargaining",
              advisor: { name: "Ciano", position: "There is a version in which Rome is remembered as the government that helped open Gibraltar and a version in which it gave away Tunisia's borders to buy a door Franco was never going to open, and he knows which one he will not risk his name on." },
              setFlags: { gibraltarGambit: "abstain" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "greeceDecision40",
              outcome:
                "The cautious reading, and very much in character for the real Ciano's own private assessment of overreaching Spanish and German diplomacy he had no confidence in: Rome steps back from a negotiation it never controlled the terms of, at the cost of whatever this attempt might have won. Hendaye happens, or doesn't, entirely without an Italian hand on it — and does so exactly as the documented history already records, for exactly the reasons that history already gives.",
            },
          ],
        };
        },
        get gibraltarResolution40() {
          return {
          date: "OCTOBER 23, 1940",
          title: "Hendaye, With Rome in the Room",
          historicalRecord: false,
          situation:
            "The meeting the documented history actually records — Hitler's train halted at the French-Spanish border town of Hendaye, nine hours of negotiation that end with Franco's price unmet and Spain still out of the war — runs this time with an Italian delegation present and Rome's guarantees on the table alongside Berlin's. It changes the shape of the argument without changing its hardest constraint: Franco's Spain, three years out of its own civil war, cannot feed itself without grain shipments only Germany and Italy can realistically promise, and cannot fight without weapons neither power can spare from fronts already open. Rome's guarantees on Tunisia and Nice sweeten what Franco is offered without touching the actual bottleneck — food and matériel this command's own fuel and manpower ledger will have to answer for, on top of everything already committed to Libya and Greece.",
          choices: [
            {
              label: "Commit real Italian grain and fuel shipments to Spain — make the price actually affordable, not just politically sweeter",
              advisor: { name: "Cavallero", position: "Guarantees on paper cost this command nothing and bought nothing at Hendaye, while ships full of grain cost a great deal and might buy something, so spend the fuel and find out rather than keep the promise cheap and watch it fail the same way." },
              checkLabel: "Matériel",
              disabledReason: meters.fuel <= -3 ? "no fuel reserve left to commit to shipments Spain would actually need to move" : undefined,
              setFlags: { gibraltarCommitment: "shipments" },
              impact: { manpower: 0, fuel: -2, initiative: 1 },
              next: "greeceDecision40",
              outcome:
                "The one variable the historical Hendaye meeting never actually tested: real matériel, not just guarantees, against Franco's stated price. Whether it was ever enough is the honest uncertainty every serious postwar account of this negotiation still argues over — Franco's caution ran deeper than any single shipment, rooted in a Spain that had just spent three years destroying itself and had no illusions left about what a second war would cost a country that hadn't finished burying the first one.",
              uncertain: [
                {
                  weight: modWeight(30, meters.initiative),
                  title: "Against the historical outcome, Franco moves",
                  setFlags: { gibraltarTaken: "success" },
                  impact: { manpower: -1, fuel: -1, initiative: 2 },
                  outcome:
                    "The documented failure of Hendaye turns out not to have been inevitable after all: a properly resourced offer, backed by Italian shipments Berlin alone never put forward, gives Franco's own war cabinet the material argument its more cautious members were missing. Spanish and German forces move on Gibraltar in early 1941, and the Mediterranean's western mouth closes — Force H, the Gibraltar-based squadron that has spent a year raiding Italian convoys and escorting everything bound for Malta, no longer has a home port to sail from. Every convoy calculation this command has made since June 1940 is due for revision.",
                },
                {
                  weight: 100 - modWeight(30, meters.initiative),
                  title: "Franco's caution holds regardless",
                  setFlags: { gibraltarTaken: "failed" },
                  impact: { manpower: 0, fuel: -1, initiative: -1 },
                  outcome:
                    "The costlier and, on the weight of the actual historical evidence, likelier answer: Franco's reluctance was never only a price to be met, and a Spain still counting its own civil war's dead declines a second one regardless of what Rome adds to Berlin's offer. The shipments are spent, the guarantees on Tunisia and Nice stand unused for now, and Gibraltar remains exactly the British fortress it has always been — the documented history reasserting itself despite a materially different attempt to bend it.",
                },
              ],
            },
            {
              label: "Guarantees only — Rome's claims are worth putting in writing, but not worth spending its own fuel reserve on Spain's war",
              advisor: { name: "Ciano", position: "He did not come to Hendaye to hand Franco Italy's fuel reserve on the strength of a wager, and Berlin can spend what Berlin is willing to spend, since his signature costs nothing the command cannot afford to lose." },
              setFlags: { gibraltarCommitment: "guaranteesOnly" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "greeceDecision40",
              outcome:
                "The lower-risk reading of the same table: Rome's territorial guarantees are offered but nothing material backs them, which is close enough to what actually happened at the real Hendaye meeting that the result tracks the documented record — Franco stays out, Gibraltar stays British, and the only difference from history is a promise on Tunisia and Nice that Berlin has now made twice, to two different governments, and will eventually have to reconcile.",
            },
          ],
        };
        },
        get greeceDecision40() {
          return {
          date: "OCTOBER 1940",
          title: "The Greek Question",
          historicalRecord: true,
          situation:
            "Hitler's unannounced occupation of Romania's oilfields in early October — a move made without so much as a courtesy cable to Rome — has left Mussolini furious about being treated as a junior partner informed after the fact rather than consulted before it. His answer, forming now, is to hand Berlin the same treatment in return: invade Greece, on Italy's own initiative, on a timeline nobody outside a small circle has been told about. The plan itself is thin — barely two weeks of preparation, an army in Albania sized for a defensive garrison rather than an invasion force, and a rainy-season timetable the general staff's own Albania commander has quietly warned is close to the worst possible month to attack across mountain terrain with no road network built to support it." +
            (flags.italyEntry === "declare"
              ? " Four months into a war entered on a peace-table deadline rather than a readiness one, the rifle and artillery shortfall Badoglio warned about in June has never actually closed — it has simply moved theaters, from the Alps to Albania."
              : flags.italyEntry === "wait"
              ? " Whatever the extra weeks bought back in June, they bought nothing here — Albania's own garrison-scale army was never going to be an invasion force on two weeks' notice regardless of how the war started."
              : flags.italyEntry === "lateDeclare"
              ? " A declaration made days before France's own armistice closed the question is, four months on, still finding out what it actually bought — Albania's garrison-scale army was never an invasion force on short notice, whenever the war it belongs to happened to start."
              : flags.italyEntry === "britainOnly"
              ? " This command entered a war against Britain alone, never against France — Albania's own thin garrison inherits an invasion timetable set by Berlin's Balkans anger regardless, on an army built for defense rather than offense in either version of this war."
              : "") +
            (flags.forkGreeceResistance
              ? " One report complicates the timetable further: frontier units along the Greek side are said to be standing firmer than any prewar assessment expected, well before the invasion has even crossed the border in strength."
              : "") +
            " The case for delay is entirely military. The case against delay is that Mussolini has already decided, and has said so to people who are not in this room.",
          choices: [
            {
              label: "Proceed on the planned date — the political timing matters more than the readiness gap",
              advisor: { name: "Mussolini", position: "Hitler will find out from the papers that Italy has occupied Greece, and this time the balance will be re-established." },
              attested: { by: "Mussolini", text: "He will find out from the papers that I have occupied Greece.", source: "Mussolini to Ciano, 12 October 1940, in Ciano's Diary 1939-1943" },
              historical: true,
              setFlags: { greeceDecision: "proceed", trust: (flags.trust || 0) + (-1) },
              trustDelta: -1,
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "tarantoDoctrine40",
              outcome:
                "What happened: the invasion launched from Albania on October 28, 1940, into weather every planning assumption had bet against, with an army roughly a third the size later staff studies concluded the terrain and Greek resistance actually required. It would be Comando Supremo's clearest unforced disaster of the war's early years, and everything that follows this decision — the winter reversal, the humiliating request for German rescue, Badoglio's resignation — traces back to this single date being chosen for reasons that had nothing to do with military readiness.",
            },
            {
              label: "Argue for delay — build the Albania force properly before committing to an invasion",
              advisor: { name: "Badoglio", position: "Two weeks is not a plan but a date with a plan's shape drawn around it, and given the spring and the roads it needs the Albania command might make this campaign work the way it is being described to the Duce." },
              setFlags: { greeceDecision: "delay", trust: (flags.trust || 0) + (1) },
              trustDelta: 1,
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -2 },
              next: "tarantoDoctrine40",
              outcome:
                "The argument every honest postwar account of this campaign says should have won, and in the actual October 1940 meeting did not: a properly resourced Albania force, given road-building time and a dry-season start, addresses most of what made the historical invasion a rolling catastrophe. What it doesn't address is the political motive driving the date in the first place — Mussolini's need to answer Romania quickly rather than well — which this path spends outright rather than satisfies.",
            },
          ],
        };
        },
        get tarantoDoctrine40() {
          return {
          date: "NOVEMBER 1940",
          title: "The Taranto Shock",
          historicalRecord: true,
          situation:
            "Twenty-one aging Fairey Swordfish biplanes, launched from a single British carrier on the night of November 11, have done in one attack what years of naval planning assumed a battleship-scale action would be needed to do: torpedo nets that were budgeted, ordered, and never actually delivered to Taranto's harbor turn out to matter more than any tactical decision made that night, and three of the six battleships anchored there are sunk or crippled at their moorings for the loss of two attacking aircraft. Half the Regia Marina's battle line is out of the war in a single evening none of the fleet's own doctrine had modeled as a live threat. Cavagnari, who signed off on Taranto's air defenses without the nets those defenses assumed, is finished as naval chief within weeks regardless of what happens next. The question that survives him is what doctrine the surviving fleet fights under from here." +
            (flags.forkFleetFast
              ? " One piece of unusually good news reaches the naval yards ahead of the doctrine debate itself: work on the crippled battleships is running ahead of the engineers' own initial projections, though nobody in Rome is yet prepared to make a public estimate of when the ships actually rejoin the battle line."
              : ""),
          choices: [
            {
              label: "Preserve the fleet — a 'fleet in being' doctrine, risked only when the odds are clearly favorable",
              advisor: { name: "Cavagnari", position: "No argument for boldness can be made after tonight, and what is left of the fleet is worth more sitting where the British have to plan around it than sunk proving a point." },
              historical: true,
              setFlags: { tarantoDoctrine: "preserve" },
              impact: { manpower: 0, fuel: 1, initiative: -1 },
              next: "greeceWinter40",
              outcome:
                "The doctrine that actually governed the surviving fleet for most of the war: after Taranto, the battle line puts to sea rarely and cautiously, tying down a Royal Navy Mediterranean squadron that has to plan around it without the fleet itself risking the encounters that could settle anything. Critics, then and since, call this a navy that spent the war as a threat rather than a weapon — its defenders point out that a threat the enemy has to respect to is not nothing, and that Taranto had just demonstrated exactly what happens when the fleet is caught unprepared.",
            },
            {
              label: "Commit to aggressive convoy escort — the Libya supply line needs the fleet exposed, not preserved",
              advisor: { name: "Iachino", position: "Every convoy the fleet does not escort to Libya is one the submarines and the RAF get uncontested, and caution over the harbor is a lesson about harbors and not about convoys." },
              setFlags: { tarantoDoctrine: "escort" },
              impact: { manpower: 0, fuel: -1, initiative: 1 },
              next: "greeceWinter40",
              outcome:
                "The road not taken at scale: committing the diminished battle line to active convoy protection rather than harbor caution means more African-bound supply gets through, at the cost of surface actions the weakened fleet — still short exactly the ships Taranto took — is not favored to win outright. What this buys North Africa in fuel and equipment, it risks against a Royal Navy Mediterranean squadron that outnumbers what Taranto left standing, in exactly the kind of open-water encounter the preservation doctrine was built to avoid.",
            },
          ],
        };
        },
        get greeceWinter40() {
          return {
          date: "NOVEMBER 1940 – MARCH 1941",
          title: "The Epirus Front",
          historicalRecord: true,
          situation:
            "The invasion that was supposed to be finished before Athens noticed has instead produced the opposite of every planning assumption: a Greek army mobilized faster and fought harder than any prewar estimate credited, and within two weeks it is the Italian force retreating back across the Albanian frontier it started from, not the other way around. Winter in the Pindus mountains is arriving on schedule regardless of what the general staff wanted, and the choice in front of Comando Supremo now is not really about winning — that window closed in November — but about how much further the line is allowed to give before reinforcement and a defensible position stop the bleeding." +
            (flags.forkGreeceResistance
              ? " The frontier report from October wasn't noise after all — the same firmness Albania's command flagged before a shot was fired has held for four straight months now, longer and more completely than this general staff's worst prewar case ever modeled."
              : ""),
          choices: [
            {
              label: "Commit the strategic reserve immediately — stabilize the line at any cost before it collapses further",
              advisor: { name: "Cavallero", position: "He takes personal command in Albania because no one is left in Rome to blame this on, and every division held back now answers for the front lost without it." },
              historical: true,
              checkLabel: "Manpower",
              disabledReason: meters.manpower <= -3 ? "no strategic reserve left to commit — it has already been spent shoring up another front" : undefined,
              setFlags: { greeceWinter: "reserve" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "compass40",
              keyBattleSubgame: {
                id: "epirus40",
                title: "Order of Battle — The Pindus Winter",
                flavor: "The Greek army has crossed the frontier and taken Korçë, and Comando Supremo's answer is the reserve: every division that can be shipped across the Adriatic to Valona and Durazzo is to be thrown into a front that has almost no roads and a winter coming. Cavallero has taken personal command in Albania, the Alpini of the Julia Division are in the Pindus, and the ports behind them cannot land all that the front needs. What is decided here is where the reserve goes: how much to the divisions arriving from Italy, how much to the Alpini and mountain troops who know this ground, how much to the air force flying from Albanian fields, and how much to the ports and the mountain tracks that feed all of them.",
                categories: [
                  { id: "reserves", name: "Reserve Divisions from Italy", meter: "manpower" },
                  { id: "alpini", name: "Alpini & Mountain Troops", meter: "manpower" },
                  { id: "air", name: "Regia Aeronautica in Albania", meter: "fuel", strand: "oil" },
                  { id: "ports", name: "Ports & Mountain Tracks", meter: "fuel", strand: "ship" },
                ],
                effectiveness: { reserves: 2.2, alpini: 2.5, air: 1.6, ports: 1.5 },
                conditions: "Winter in the Pindus: snow, rain and mud on mountain tracks, with no roads in much of the front, and everything arriving through the two small ports of Valona and Durazzo.",
                terrainModifiers: { ports: 0.85, air: 0.9 },
                terrainNotes: { ports: "mud, snow and mountain tracks", air: "cloud and snow over the passes" },
                attrition: [
                  { category: "alpini", atLeast: 3, meter: "manpower", delta: -1, reason: "Exposure in the winter mountains" },
                ],
                categoryContext: {
                  reserves: "Divisions are arriving from Italy by sea, and the Greek front needs every one of them. Each commitment here puts more of them into the line as soon as they land.",
                  alpini: "The Alpini know the mountains and fight best in them, but their Julia Division has already been mauled in the first weeks. Each commitment here holds the heights with more of them.",
                  air: "The Regia Aeronautica flies from fields in Albania, over mountains and cloud, against a Greek army that is hard to see. Each commitment here puts more missions over the passes.",
                  ports: "Everything arrives through Valona and Durazzo and goes up the mountain tracks on mules and trucks, and the tracks are mud. Each commitment here puts more labour and transport on the ports and the tracks.",
                },
                flashups: {
                  reserves: [
                    "A division newly landed at Valona marches up toward the front.",
                    "A reserve regiment goes into the line at night, with orders it has not had time to read.",
                    "Fresh troops reach the front still in the uniforms they wore in Italy.",
                    "A battalion is fed into a gap on the line and holds it for a day.",
                    "A division arrives short of its guns, which are still on the quay.",
                  ],
                  alpini: [
                    "An Alpini battalion holds a ridge above the road, in the snow.",
                    "The Julia's survivors dig in on a spur they know.",
                    "A mountain company moves along a track no one else is using.",
                    "The Alpini pack their mules in the dark and move off.",
                    "A mountain battalion takes a height back at dawn.",
                  ],
                  air: [
                    "A bomber formation goes over the passes, high above the cloud.",
                    "A flight of fighters patrols the front, with no enemy in sight.",
                    "A reconnaissance aircraft reports Greek columns on the mountain track.",
                    "The air attack is cancelled for weather, and the ground troops are told afterward.",
                    "A bomber crew drops on a village, and no one on the ground can say what it hit.",
                  ],
                  ports: [
                    "A transport unloads at Valona under a grey sky.",
                    "A column of mules goes up the mountain track in the rain.",
                    "A truck slides off the road into the mud and is left where it lies.",
                    "The quays at Durazzo are crowded with stores that cannot be moved.",
                    "Labourers carry ammunition the last miles on their backs.",
                  ],
                },
                reportTimes: {
                  open: "0600",
                  contact: "0800",
                  cats: ["1000", "1200", "1400", "1600"],
                  reserve: "1800",
                  counter: "2000",
                },
                idleLines: {
                  reserves: [
                    "The reserve divisions stay at the ports. The line is held by what was already on it.",
                    "No fresh troops are committed, and the line thins as the days go by.",
                  ],
                  alpini: [
                    "The Alpini are left where they are. The heights above the road are held by no one.",
                    "No mountain troops are sent to the high ground, and the tracks are left open.",
                  ],
                  air: [
                    "No missions are flown over the passes. The Greeks move in daylight unmolested.",
                    "The air force is held at its fields, and the front is left without it.",
                  ],
                  ports: [
                    "No extra effort goes to the ports or the tracks. The front gets what trickles up.",
                    "The quays are left to clog, and the stores stay where they were landed.",
                  ],
                },
                verdicts: ["The Line Is Stabilised", "The Line Gives Way"],
                verdictGrades: {
                  clean: "The reserve, the Alpini, the air force and the ports all pulled together, and the front stopped moving.",
                  costly: "The line is held, but every arm of the army paid more than the winter could spare.",
                  marginal: "The front slows but does not stop, and the Greeks keep the ground they have taken.",
                  total: "The reserve is fed in piecemeal and the line keeps going back, with nothing to show for what was spent.",
                },
                counterattack: {
                  category: "alpini",
                  severity: { greekCounteroffensive: 2, numbersInTheHills: 1, replacementsRunShort: 1 },
                  warn: {
                    "1": "Greek infantry are attacking the heights above the road, in small numbers.",
                    "2": "The Greeks are attacking the Alpini positions in strength, at night, over the snow.",
                  },
                  results: {
                    repulsed: "The Greek attack on the heights is thrown back, and the line stays where it was.",
                    heldAtCost: "The Alpini hold the heights against the Greeks, but the battalions that held them are badly cut up.",
                    broke: "The Greeks break onto the heights, and the fighting goes on for hours in the dark.",
                    gaveGround: "The line falls back off the heights rather than fight the attack out where it struck.",
                  },
                },
                orderOfBattle: {
                  reserves: {
                    units: [
                      "25 or more divisions in Albania by January 1941, up from 6 at the start",
                      "XXV Corps in Epirus and XXVI Corps around Korçë",
                    ],
                    real: "The Greek counteroffensive began on 14 November and Korçë fell on 22 November. Badoglio resigned on 4 December and Cavallero took command from December.",
                  },
                  alpini: {
                    units: [
                      "The 3rd Alpine Division Julia, in the Pindus",
                      "The Centauro Armoured Division, with 163 light tanks that were of little use in the mountains",
                    ],
                    real: "Greek divisions, triangular and about half as large again as the Italian binary ones, took the initiative in the mountains.",
                  },
                  air: {
                    units: ["Regia Aeronautica units based in Albania"],
                    real: "The air force flew against Greek resistance, but could not turn the campaign.",
                  },
                  ports: {
                    units: [
                      "The ports of Valona and Durazzo",
                      "The mountain tracks and the mule trains that carried supplies to the front",
                    ],
                    real: "The supply lines through Valona and Durazzo proved inadequate.",
                  },
                },
                hardRule: { text: "Rome's order is that no more ground is to be given in Albania: the line may not fall back.", noGiveGround: true },
                decisions: [
                  {
                    id: "theSpringOffensive",
                    time: "1700",
                    title: "The spring offensive",
                    prompt: "It is March, and Mussolini has come to Albania to see a great offensive before the Germans arrive in the Balkans. The army is worn, the Greeks are worn too, and the question is how to use the day: a narrow attack behind a heavy bombardment, a patient defence of the line, or a withdrawal to the shorter line behind the passes.",
                    options: [
                      {
                        id: "narrowAttack",
                        name: "Attack on a narrow front behind a heavy bombardment",
                        note: "The offensive Rome wants, and it fires a great deal of ammunition.",
                        bonus: 0,
                        bonusByPosture: { greekCounteroffensive: 4, numbersInTheHills: 0, replacementsRunShort: -3 },
                        meters: { fuel: -1 },
                        costReason: "Ammunition fired in the bombardment",
                        reportLine: "A heavy bombardment opens on a narrow front, and the infantry go forward behind it.",
                      },
                      {
                        id: "holdAndWait",
                        name: "Hold the line and let the Greeks wear themselves out",
                        note: "No offensive, and the Greeks have fewer men to replace their losses.",
                        bonus: 0,
                        bonusByPosture: { replacementsRunShort: 4, greekCounteroffensive: -3, numbersInTheHills: -1 },
                        reportLine: "The line is held where it stands, and the army waits for the Greeks to come on.",
                      },
                      {
                        id: "shorterLine",
                        name: "Draw back to the shorter line behind the passes",
                        note: "Costs Initiative, and gives up ground Rome will not want to give.",
                        bonus: 0,
                        bonusByPosture: { numbersInTheHills: 4, replacementsRunShort: -2 },
                        meters: { initiative: -1 },
                        costReason: "Ground given up in a withdrawal",
                        reportLine: "The army draws back to the shorter line behind the passes.",
                      },
                    ],
                  },
                ],
              },
              uncertain: [
                {
                  weight: modWeight(50, meters.manpower),
                  title: "The line holds, barely, on ground that isn't Albania's border",
                  setFlags: { greeceWinterResult: "held" },
                  impact: { manpower: -1, fuel: 0, initiative: 0 },
                  outcome:
                    "Cavallero's personally-commanded reserve commitment does what the historical one actually did: stops the retreat somewhere inside Albania rather than at the frontier, at a cost in casualties the mountain fighting extracts from both sides in roughly equal, brutal measure through the winter. It is not a victory by any definition Rome would like printed, but it is a front that no longer moves, which by December 1940's standard counts as one.",
                },
                {
                  weight: 100 - modWeight(50, meters.manpower),
                  title: "The reserve arrives late, and the line keeps giving ground",
                  setFlags: { greeceWinterResult: "worse" },
                  impact: { manpower: -2, fuel: 0, initiative: -1 },
                  outcome:
                    "The dice on this one land against the historical outcome: reinforcement that should have stabilized the front arrives piecemeal into a collapse already past the point where it helps, and the Greek counteroffensive pushes further into Albanian territory than the real campaign ever allowed. The eventual rescue this campaign is already heading toward will have a deeper hole to climb out of when it comes.",
                },
              ],
            },
            {
              label: "Trade space for time — fall back to a shorter, more defensible line rather than feed the front piecemeal",
              advisor: { name: "Badoglio", position: "He resigned rather than keep defending a plan that was broken before it launched, and whoever holds this command now should at least stop paying for that plan's mistakes one division at a time." },
              setFlags: { greeceWinter: "withdraw" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "compass40",
              outcome:
                "The historical Badoglio resigned on December 4, 1940 rather than preside over this front any further — a real act, even if it changed nothing about the men still fighting in it. A deliberate, organized withdrawal to shorter interior lines costs less blood per mile given up than the historical reserve-feeding approach did, and produces a more defensible position by the time winter fully sets in — at the price of ceding ground a propaganda ministry already struggling to explain this campaign has no good way to spin as anything but retreat.",
            },
          ],
        };
        },
        get compass40() {
          return {
          date: "DECEMBER 1940",
          title: "Operation Compass",
          historicalRecord: true,
          situation:
            "While Albania absorbs every headline, a British Western Desert Force roughly a third the size of the Tenth Army it is about to attack launches what its own planners initially conceived as a five-day raid against the string of fortified camps Graziani's advance stopped at back in September. There has been no serious effort to link those camps into a continuous defensive line, and the gap between them is exactly wide enough for an armored force to drive through and roll the whole position up from behind rather than through the front anyone actually fortified." +
            (flags.forkDesertGap
              ? " Conflicting reports complicate the picture further: engineers attached to the western camps claim real, if incomplete, progress narrowing that gap, though Rome's own intelligence — already dismissing this as a five-day raid not worth the reserve — has no interest in revising its estimate on the strength of an engineer's unverified claim."
              : "") +
            (flags.greeceWinter === "reserve" ? keyBattleEcho("epirus40", flags) : ""),
          choices: [
            {
              label: "Order an immediate general withdrawal to a shorter line before the flanking attack lands",
              advisor: { name: "Graziani", position: "Every hour the camps are held as arranged is an hour daring an armored force to do exactly what it is built to do, and it is better to give up ground on his own terms than lose the army defending a line that was never a line." },
              setFlags: { compass40: "withdraw" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "germanRescue41",
              outcome:
                "The retreat Graziani never actually ordered in time, historically — his real hesitation, waiting on a clearer picture before committing to the humiliation of giving up ground just claimed in September, is a documented part of why the historical collapse was as total as it was. An earlier, deliberate withdrawal here costs less in prisoners and equipment than the historical rout, though it still concedes essentially everything Compass was launched to take, since the operation's actual scale caught every Italian assumption about British strength equally wrong.",
            },
            {
              label: "Hold the fortified camps and trust the line to absorb what is assumed to be a limited raid",
              advisor: { name: "Cavallero", position: "Rome's own intelligence calls this a reconnaissance in force and not an offensive, so the reserve will not be moved for a five-day raid the estimates say will exhaust itself against the wire." },
              historical: true,
              setFlags: { compass40: "hold" },
              impact: { manpower: -3, fuel: -1, initiative: -2 },
              next: "germanRescue41",
              outcome:
                "What actually happened, and it is the single worst reversal any command in this game presides over: the 'five-day raid' becomes a two-month rout that destroys the Tenth Army as a fighting force, takes some 130,000 Italian prisoners against a few hundred British casualties, and advances 500 miles into Libya before finally outrunning its own supply line near El Agheila. Nothing about the intelligence estimate that called this a limited raid survives contact with what it actually was.",
            },
          ],
        };
        },
        get germanRescue41() {
          return {
          date: "JANUARY 1941",
          title: "Asking Berlin",
          historicalRecord: true,
          situation:
            "Two fronts are collapsing at once, and neither collapse can be solved with what Comando Supremo has left to send. Greece has stabilized, barely, but only by pulling in everything the reserve could spare; Libya's western desert has no reserve left at all after Compass, and the road to Tripoli itself is now fully open if the British pursuit doesn't stop on its own. The request Rome has spent months avoiding — asking the ally it went to war partly to avoid looking dependent on for direct military rescue — is now the only option left that isn't losing both colonies and the Balkans campaign inside the same winter." +
            (flags.forkDesertGap
              ? " The engineers' claim about the gap west of Sidi Barrani, whatever it was actually worth, is academic now — the position it described is gone along with the army that held it, and no amount of partial linkage would have mattered against a defeat this total."
              : ""),
          choices: [
            {
              label: "Request German intervention in both theaters — Libya and Greece, whatever the political cost",
              advisor: { name: "Mussolini", position: "He would rather owe Hitler an army than owe history the loss of Libya, so the request goes, since pride is a luxury item he cannot afford this month." },
              historical: true,
              setFlags: { germanRescue: "both", trust: (flags.trust || 0) + (1) },
              trustDelta: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "matapan41",
              outcome:
                "What happened: a German expeditionary force under Erwin Rommel begins landing at Tripoli in February 1941, and the Twelfth Army moves into Greece and Yugoslavia in April to finish what the Italian invasion couldn't. Both interventions work, militarily — Rommel's Afrika Korps recaptures most of Cyrenaica within weeks, and the Balkans campaign is over in three weeks flat once German mechanized forces are actually committed. What they cost is any pretense that this remains an independent Italian war rather than a theater increasingly run at Berlin's convenience, on Berlin's timetable, with Italian formations answering to it.",
            },
            {
              label: "Request Libya rescue only — hold Greece with what remains of the Italian reserve alone",
              advisor: { name: "Cavallero", position: "Asking for everything brings German terms attached to everything, while asking for Libya only leaves Greece a campaign Italy can still say it finished itself, if the line he is holding actually finishes it." },
              setFlags: { germanRescue: "libyaOnly", trust: (flags.trust || 0) + (-1) },
              trustDelta: -1,
              favor: 1,
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "matapan41",
              outcome:
                "A narrower request preserves more of the fiction that this is still Italy's own war in at least one theater, but it bets the Epirus front's continued stability entirely on a reserve already stretched thin holding the line described in the winter's fighting. Libya recovers on roughly the same German timetable either way; what changes is whether Greece is still an Italian-run campaign when Yugoslavia's own collapse in April makes the question moot regardless of which choice was made here.",
            },
          ],
        };
        },
        get matapan41() {
          return {
          date: "MARCH 1941",
          title: "Cape Matapan",
          historicalRecord: true,
          situation:
            "A sortie meant to intercept British convoys running troops to Greece has instead run straight into a Royal Navy force that, unknown to the fleet staff, is reading Italian naval codes and knows the sortie's course before it sails. By the time contact is made, the battleship Vittorio Veneto has already taken a torpedo hit from carrier aircraft and the fleet is turning for home — but not before a night action neither side's surface radar and gunnery doctrine are evenly matched to fight decides the rest of it in minutes rather than hours.",
          choices: [
            {
              label: "Break off and run for home the moment Vittorio Veneto is hit — preserve what's left of the sortie force",
              advisor: { name: "Iachino", position: "The flagship is damaged and the enemy has a night-fighting advantage the doctrine was never built to match, and the rest of the fleet will not be spent finding that out in the dark." },
              historical: true,
              setFlags: { matapan41: "withdraw" },
              impact: { manpower: 0, fuel: -1, initiative: -1 },
              next: "yugoslaviaBalkans41",
              keyBattleSubgame: {
                id: "matapan41",
                title: "Order of Battle — Cape Matapan",
                flavor: "The fleet is at sea without radar and with little help from the air, and the British are reading its signals. The first battle is fought from the air, by carrier aircraft that will attack through the day; the second will come in the dark, if the fleet can be brought home without it. What is decided here is how the sortie's strength is weighed: how much into the battle fleet and Vittorio Veneto, how much into the cruiser divisions that screen it, how much into the air cover and reconnaissance the fleet can get, and how much into the signals and night-fighting practice that a navy which never planned to fight in the dark has never had.",
                categories: [
                  { id: "battle", name: "The Battle Fleet", meter: "fuel", strand: "oil" },
                  { id: "cruisers", name: "The Cruiser Divisions", meter: "manpower" },
                  { id: "air", name: "Air Cover & Reconnaissance", meter: "fuel", strand: "oil" },
                  { id: "signals", name: "Signals & Night Action", meter: "initiative" },
                ],
                effectiveness: { battle: 2.4, cruisers: 2.2, air: 1.7, signals: 1.6 },
                phases: ["The air attacks of the day", "The night action"],
                counterScale: 1.5,
                conditions: "The fleet sails without radar, with little help from the air, and with a doctrine that did not plan for night action.",
                terrainModifiers: { signals: 0.8, air: 0.9 },
                terrainNotes: { signals: "no radar and no practice at night action", air: "little help from the air" },
                categoryContext: {
                  battle: "The battleship and her screen are the strength of the fleet, and they are short of fuel for a long chase. Each commitment here keeps more of the battle fleet concentrated and ready to fight.",
                  cruisers: "The heavy cruiser divisions are fast and well armed, and they are the fleet's screen. Each commitment here puts more of them in the line and under better control.",
                  air: "The fleet has little air cover and few reconnaissance aircraft, and the enemy has a carrier. Each commitment here asks for more of both and hopes they come.",
                  signals: "The Regia Marina has no radar and has not practised night action, and its signals are being read. Each commitment here puts more effort into the signals and the practice of fighting in the dark.",
                },
                flashups: {
                  battle: [
                    "Vittorio Veneto steams at the head of the fleet, her guns trained to port.",
                    "The battle fleet's destroyers take station on her screen.",
                    "The fleet increases speed as the enemy aircraft are sighted.",
                    "A damaged battleship slows and the fleet slows with her.",
                    "Fuel gauges are watched as the fleet turns for home.",
                  ],
                  cruisers: [
                    "The cruisers of the 1st Division steam in line ahead on the flank.",
                    "A cruiser division is ordered to close on a ship that is signalling for help.",
                    "The cruisers' main batteries are loaded with armour-piercing shell for a surface fight.",
                    "A cruiser turns away from the enemy's shell splashes at long range.",
                    "The 3rd Division keeps station on the battle fleet.",
                  ],
                  air: [
                    "A reconnaissance aircraft reports the enemy battleships at sea.",
                    "Italian fighters appear over the fleet and then go home, short of fuel.",
                    "Carrier aircraft are sighted low on the horizon, and the fleet turns to meet them.",
                    "No aircraft appears over the fleet all afternoon.",
                    "A German reconnaissance plane reports the British carrier's position.",
                  ],
                  signals: [
                    "A signal is passed to the cruisers, and they are slow to answer it.",
                    "The watch on a cruiser sees ships ahead and reports them as friendly.",
                    "A radio message is sent in clear, and the British monitor it.",
                    "The gunnery officers of a heavy cruiser rehearse a night action they have never fired.",
                    "A flag signal is mistaken for another across the dark water.",
                  ],
                },
                reportTimes: {
                  open: "0800",
                  contact: "0930",
                  cats: ["1100", "1300", "1500", "1700"],
                  contact2: "2000",
                  reserve: "2130",
                  counter: "2220",
                },
                idleLines: {
                  battle: [
                    "The battle fleet is left as it is, spread out and slow. No extra effort goes into its station.",
                    "Nothing extra is done for the fleet, and the battleship steams on alone.",
                  ],
                  cruisers: [
                    "The cruiser divisions are given no special orders. They steam on as they were.",
                    "No extra effort goes into the cruisers, and they keep station as best they can.",
                  ],
                  air: [
                    "No extra air cover is requested. The fleet has what it had.",
                    "No reconnaissance is asked for, and the fleet steams on without it.",
                  ],
                  signals: [
                    "No special attention goes to signals or night action. The fleet fights the way it was trained.",
                    "The ships are given no drill for the dark, and the watch is as it was.",
                  ],
                },
                verdicts: ["The Fleet Brings Its Cruisers Home", "The Night Costs the Fleet Its Cruisers"],
                verdictGrades: {
                  clean: "The battle fleet, the cruisers, the air cover and the signals all held together, and the fleet came home whole.",
                  costly: "The fleet comes home, but every arm of it paid more than it could afford.",
                  marginal: "The fleet is badly hurt, but its main force reaches port, and the loss could have been worse.",
                  total: "The night action catches the fleet unready, and its cruisers are lost with their crews in minutes.",
                },
                counterattack: {
                  category: "signals",
                  severity: { britishClose: 2, mistakenForFriends: 1, britishFarAstern: 1, carrierStrikes: 1, cruisersInContact: 1 },
                  warn: {
                    "1": "British cruisers and destroyers are closing on the fleet from astern.",
                    "2": "British battleships are closing at speed in the dark, with radar guiding every gun.",
                  },
                  results: {
                    repulsed: "The ships act as one and the attack is driven off before it can do any harm.",
                    heldAtCost: "The fleet gets away, but the ships that covered it are badly hit.",
                    broke: "The British guns find the cruisers at point-blank range, and the ships are lost in minutes.",
                    gaveGround: "The fleet turns away from the fight and leaves a part of itself behind.",
                  },
                },
                orderOfBattle: {
                  battle: {
                    units: [
                      "The battleship Vittorio Veneto, with her destroyers",
                      "Admiral Angelo Iachino commanding the fleet",
                    ],
                    real: "A torpedo from an Albacore of HMS Formidable struck Vittorio Veneto's outer port propeller at about 15:09, and about 4,000 tons of water came in.",
                  },
                  cruisers: {
                    units: [
                      "The 1st Cruiser Division (Cattaneo): Zara, Fiume and Pola",
                      "The 3rd Cruiser Division: Trento, Trieste and Bolzano",
                      "Two light cruisers and thirteen destroyers in all",
                    ],
                    real: "Pola was crippled by a torpedo at about 19:30, and Iachino sent the 1st Cruiser Division back to help her. Zara, Fiume and Pola were sunk in the night action, and about 2,300 Italian sailors died.",
                  },
                  air: {
                    units: [
                      "Italian air units, which gave the fleet little cover",
                      "Luftwaffe reconnaissance aircraft working with the Italians",
                    ],
                    real: "Albacores from Formidable made three attacks on 28 March: at 09:38, at about 15:09, and between 19:36 and 19:50.",
                  },
                  signals: {
                    units: [
                      "The Regia Marina's signals and code security, which British codebreakers had broken",
                      "Night-action doctrine and gunnery practice, of which the fleet had little",
                    ],
                    real: "Cunningham staged a showy departure from Alexandria to hide that he knew the Italian plan. The Regia Marina had no radar, and its doctrine did not envisage night actions.",
                  },
                },
                hardRule: {
                  text: "The German naval liaison presses Supermarina to keep the fleet at sea and fighting: there is to be no breaking off for home.",
                  noGiveGround: true,
                },
                decisions: [
                  {
                    id: "thePolaDecision",
                    time: "2200",
                    title: "The crippled Pola",
                    prompt: "Pola has been torpedoed and cannot move, and the fleet is steaming west with the night coming on. Iachino can send the 1st Cruiser Division back to stand by her, run for home and leave her to the destroyers, or send only destroyers to take off her crew. No one knows where the British are.",
                    options: [
                      {
                        id: "cruisersBack",
                        name: "Send the 1st Cruiser Division back to stand by Pola",
                        note: "Saves the ship if the sea is empty, and risks three cruisers if it is not.",
                        bonus: 0,
                        bonusByPosture: { britishClose: -5, britishFarAstern: 4, mistakenForFriends: -3 },
                        reportLine: "The 1st Cruiser Division is turned back toward Pola, in the dark.",
                      },
                      {
                        id: "runForHome",
                        name: "Run for home and leave Pola to the destroyers",
                        note: "Costs Initiative, and leaves a cruiser behind.",
                        bonus: 0,
                        bonusByPosture: { britishClose: 3, britishFarAstern: -2, mistakenForFriends: 1 },
                        meters: { initiative: -1 },
                        costReason: "A crippled cruiser left behind",
                        reportLine: "The fleet holds its course for home and leaves Pola to the destroyers.",
                      },
                      {
                        id: "destroyersOnly",
                        name: "Send two destroyers only, to take off her crew",
                        note: "Costs Matériel, and risks two destroyers instead of three cruisers.",
                        bonus: 0,
                        bonusByPosture: { mistakenForFriends: 3, britishClose: 1 },
                        meters: { fuel: -1 },
                        costReason: "Destroyers detached to rescue Pola's crew",
                        reportLine: "Two destroyers are detached to take Pola's crew off.",
                      },
                    ],
                  },
                ],
              },
              uncertain: [
                {
                  weight: modWeight(25, meters.initiative),
                  title: "The cruisers get home",
                  setFlags: { matapan41Result: "home" },
                  impact: { manpower: 0, fuel: -1, initiative: 0 },
                  outcome:
                    "The minority projection, which the sea allowed more easily than the night did: Pola's crew is taken off and the cruisers are kept with the fleet, and the night passes without a gun being fired at the Italian ships. The fleet reaches Taranto with its damaged battleship and its cruisers whole, and Matapan becomes the story of a sortie that failed to find a convoy and cost nothing else.",
                },
                {
                  weight: 100 - modWeight(25, meters.initiative),
                  title: "The night finds the cruisers",
                  setFlags: { matapan41Result: "night" },
                  impact: { manpower: 0, fuel: -1, initiative: -1 },
                  outcome:
                    "What actually happened, and it was still a disaster despite the caution: three heavy cruisers and two destroyers, detached to escort the damaged Vittorio Veneto home, are caught by British ships using radar in the dark — a technology Italian doctrine hadn't trained against — and sunk in under an hour with the loss of over 2,300 sailors. The battle fleet itself survives to fight again, but Matapan effectively ends major Italian surface operations against the Royal Navy's battle line for the rest of the war.",
                },
              ],
            },
            {
              label: "Press the sortie's original objective — the convoy interception mission still stands",
              advisor: { name: "Iachino", position: "The fleet came out to find that convoy and not to nurse a damaged battleship home at the first setback, and abandoning the mission now wastes the exposure already accepted for nothing." },
              setFlags: { matapan41: "press" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "yugoslaviaBalkans41",
              outcome:
                "Pressing on with a damaged flagship and a night-fighting deficiency the fleet doesn't yet know it has invites a worse version of the same night action — the cruiser force that historically detached to escort Vittorio Veneto home is, on this path, still screening an active sortie when the British radar-equipped force finds it, and the losses run higher than the historical night's already severe toll. The convoy the sortie was launched to intercept is never found either way.",
            },
          ],
        };
        },
        get yugoslaviaBalkans41() {
          return {
          date: "APRIL 1941",
          title: "The Balkans, Divided",
          historicalRecord: true,
          situation:
            "German mechanized divisions do in eleven days what the Italian army alone could not do to Greece in five months: Yugoslavia is overrun and Greece's mainland army surrenders by the end of April, and Italy's own contribution to a campaign it originally started is now a supporting role in someone else's rapid, overwhelming victory. What remains for Rome to decide is not whether the Balkans fall — that outcome is already settled by German timetables — but how large a piece of the resulting occupation and annexation map Italy actually claims for itself." +
            (flags.matapan41 === "withdraw"
              ? (flags.matapan41Result === "home" ? " The fleet's cruisers came home from Matapan, which is more than anyone in Rome had expected." : "") + keyBattleEcho("matapan41", flags)
              : ""),
          choices: [
            {
              label: "Claim the maximum annexation — Dalmatia, Montenegro, and a large Greek occupation zone",
              advisor: { name: "Ciano", position: "Berlin is drawing this map quickly, and whatever is not claimed this month will not be offered again, so ask for everything defensible and let the argument happen at the table and not after it." },
              historical: true,
              setFlags: { balkansAnnex: "maximum", trust: (flags.trust || 0) + (-1) },
              trustDelta: -1,
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "eastAfrica41",
              outcome:
                "Roughly what actually happened: Italy annexes Dalmatia outright, installs a protectorate over Montenegro, and takes occupation responsibility for a substantial share of mainland Greece and the Ionian Islands. The territory looks impressive on the map the propaganda ministry prints — what it actually is, within months, is a garrison commitment against a Yugoslav resistance movement that will tie down more divisions than the annexation was ever worth, in a foretaste of exactly the occupation-versus-partisan arithmetic the whole war keeps returning to.",
            },
            {
              label: "Claim a smaller, more defensible zone — fewer garrison obligations, less occupied territory to hold",
              advisor: { name: "Bastico", position: "Every kilometer of occupied coastline needs a garrison the North African front does not have spare, and it is better to hold less and actually hold it." },
              setFlags: { balkansAnnex: "limited", trust: (flags.trust || 0) + (1) },
              trustDelta: 1,
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "eastAfrica41",
              outcome:
                "A smaller occupation footprint costs Rome standing at the table — Ciano's read on how these things get divided when Berlin is setting the pace turns out to be correct, and a share of the annexation goes to German or Ustaše administration instead. What it buys is fewer divisions tied down chasing an insurgency across mountainous coastline over the following two years, freeing at least some of that manpower for the theater that will actually need it.",
            },
          ],
        };
        },
        get eastAfrica41() {
          return {
          date: "MAY 1941",
          title: "The Fall of Italian East Africa",
          historicalRecord: true,
          situation:
            "Cut off from resupply since Italy entered the war, outnumbered several times over by Commonwealth forces advancing from Kenya, Sudan, and British Somaliland at once, Italian East Africa's colonial empire — Ethiopia, Eritrea, Italian Somaliland, five years after the conquest that made Mussolini's imperial reputation — has been shrinking for months toward its last defensible position: Amba Alagi, a mountain fortress the Duke of Aosta's remaining garrison has held past the point any relief could plausibly reach it. The question left is not whether the empire falls — every supply line to it has been severed since June 1940 — but on what terms the men holding out at Amba Alagi surrender, and what, if anything, is worth doing with the guerrilla option some officers are proposing instead." +
            (flags.forkEastAfricaSlow
              ? " The converging Commonwealth columns are, by every report reaching this desk, behind their own schedule — supply trouble across Kenya and Sudan, apparently, though nobody here can confirm why. Amba Alagi's position hasn't changed. What might be worth doing with the extra time is a genuinely open question."
              : ""),
          choices: [
            {
              label: "Surrender Amba Alagi on honorable terms once the position is untenable",
              advisor: { name: "Cavallero", position: "The Duke of Aosta has held longer than anyone in Rome had a right to expect from a garrison this cut off, and there is no dishonor left to spend holding out further, only men." },
              historical: true,
              setFlags: { eastAfrica: "surrender" },
              impact: { manpower: -1, fuel: 0, initiative: -1 },
              next: "convoyWarMalta41",
              outcome:
                "What happened: Amba Alagi surrenders on May 19, 1941, after a defense the British commander accepting it publicly praised, and the Duke of Aosta is granted the formal honors of war — allowed to keep his sword — in recognition of a stand that outlasted every reasonable estimate of how long it could hold. Italy's colonial empire, conquered in 1936, is entirely gone within a year of the wider war reaching it, and the Duke himself dies in British captivity in Kenya the following March, of tuberculosis and exhaustion.",
            },
            {
              label: "Order remaining forces to scatter and fight on as guerrillas rather than surrender the position",
              advisor: { name: "Graziani", position: "A garrison that surrenders is accounted for by the enemy and moved past, while one that scatters into the highlands is a problem the enemy must keep solving for years." },
              checkLabel: "Manpower",
              disabledReason: meters.manpower <= -3 ? "too few men left in the theater to disperse into a sustained highland campaign rather than simply be hunted down piecemeal" : undefined,
              setFlags: { eastAfrica: "guerrilla" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: "convoyWarMalta41",
              uncertain: [
                {
                  // Historical Divergence Mode: the forkEastAfricaSlow fork doesn't force this
                  // outcome, it makes the existing "traction" path meaningfully more likely — a
                  // slower Commonwealth advance gives a scattered holdout more room to organize.
                  // See positionLabel's dedicated title, gated on this SAME outcome plus the fork.
                  weight: modWeight(35, meters.initiative) + (flags.forkEastAfricaSlow ? 20 : 0),
                  title: "The highlands hold a real, if minor, campaign",
                  setFlags: { eastAfricaGuerrilla: "traction" },
                  impact: { manpower: -2, fuel: 0, initiative: 1 },
                  outcome:
                    "Closer to the small-scale version some Italian officers did pursue historically, but organized rather than left to isolated initiative: scattered units link up into a genuine holdout campaign in Ethiopia's highlands, tying down a Commonwealth garrison commitment large enough that London notices it on a theater balance sheet, even if never large enough to matter to North Africa or Europe.",
                },
                {
                  weight: 100 - (modWeight(35, meters.initiative) + (flags.forkEastAfricaSlow ? 20 : 0)),
                  title: "Scattered rather than organized — the highlands absorb men, not divisions",
                  setFlags: { eastAfricaGuerrilla: "fizzle" },
                  impact: { manpower: -3, fuel: 0, initiative: 0 },
                  outcome:
                    "What the order actually produces without the coordination a real guerrilla campaign needs: isolated bands hunted down piecemeal over the following months, at a cost in men the formal surrender this path was meant to avoid ends up paying anyway, in smaller installments and without even the honors of war Amba Alagi's actual garrison received. The theater Britain would need to reinforce to answer a real threat here is one it can spare troops in far more easily than North Africa or Europe regardless of how this played out.",
                },
              ],
            },
          ],
        };
        },
        get convoyWarMalta41() {
          return {
          date: "SUMMER – FALL 1941",
          title: "The Supply Line to Africa",
          historicalRecord: true,
          situation:
            (flags.malta40 === "fell"
              ? "Malta itself is not this planning season's question — the island fell to the 1940 invasion and has been an Italian garrison and forward base for a year now. Every division Rommel and the Italian formations alongside him need in Libya crosses a sea that base, not a hostile one, now sits astride, and the convoy losses that once ran as high as a third of everything shipped have fallen with it. What is still live is what a year of holding a captured island, rather than merely reducing one, is actually for."
              : "Every division Rommel and the Italian formations alongside him need in Libya has to cross a sea Malta sits in the middle of, within easy range of British air and submarine forces the island keeps supplied and rearmed specifically to interdict that traffic. The convoy losses are already running high enough that fuel and equipment reaching North Africa some months amounts to barely half of what was actually shipped — the question facing Comando Supremo's planning staff is where the finite escort and air resources available get spent: protecting the convoys directly, or finally committing to the Malta invasion — Operation Hercules, on the planning table since 1940 and never yet ordered — that would remove the problem at its source.") +
            (flags.malta40 === "held"
              ? " This is the same argument this staff already had in 1940 — the attempted invasion that autumn was thrown back, and a year of hardening on the island since is the cost of a gamble that didn't pay off."
              : flags.medStrategy === "egypt"
              ? " Egypt was named the priority back in 1940, over this exact island — a choice this month's convoy losses are the running bill for."
              : "") +
            (flags.eastAfrica === "guerrilla" ? (flags.eastAfricaGuerrilla === "traction" ? " Italian East Africa's last defenders are still tying down a Commonwealth garrison commitment in the highlands, a fact this planning has to account for even if only at the margins." : " Italian East Africa's last defenders scattered into the highlands rather than surrender outright, a decision this planning doesn't need to account for one way or the other.") : " Italian East Africa's last defenders have already surrendered on terms, the empire entirely gone before this season's Mediterranean planning even begins.") +
            (flags.forkMaltaWeak
              ? " Convoy losses this month are, unusually, running below every recent estimate — escort commanders report unusually light interference from the island's air and submarine forces, though naval staff aren't yet prepared to call it durable."
              : "") +
            (flags.forkFleetFast
              ? " The battle line Taranto crippled is back in service faster than the historical repair schedule ever managed, and the extra hulls available for escort duty are one more reason this quarter's convoy numbers look better than the historical record."
              : "") +
            (flags.gibraltarTaken === "success"
              ? " One change dwarfs everything else in this quarter's convoy report: with Gibraltar closed and Force H gone from the equation entirely, the western Mediterranean is no longer a British-patrolled sea at all, and losses to Libya-bound shipping are a fraction of what any prewar staff estimate assumed this war would cost."
              : ""),
          choices: [
            {
              label: flags.malta40 === "fell"
                ? "Route the freed-up escort resources into the Libya convoys directly — press the advantage"
                : "Commit air and naval resources to direct convoy escort rather than the Malta invasion",
              advisor: flags.malta40 === "fell"
                ? { name: "Iachino", position: "A fleet was spent taking that island, and spending nothing on what it bought would be the stranger decision." }
                : { name: "Iachino", position: "Hercules is a plan on paper that has needed German paratroopers and landing craft not fully under Italian control for over a year, while the convoys are a problem that can be dealt with this month." },
              historical: flags.malta40 !== "fell",
              setFlags: { maltaQuestion: "escort" },
              impact: { manpower: 0, fuel: 1, initiative: -1 },
              next: flags.malta40 === "fell" ? "maltaRetake41" : "rommelAdvance41",
              outcome: flags.malta40 === "fell"
                ? "With Malta already Italian, this is simply the dividend of the 1940 gamble collected in full: escort losses that a year ago ran as high as a third of everything shipped are, with the island's air and submarine forces no longer contesting the route, a fraction of that — Rommel's army fights this season better supplied than at any point in the historical campaign."
                : "The choice that was, in effect, made by default historically — Hercules was planned, argued over, and repeatedly deferred until the strategic moment for it had passed, while escort commitments absorbed whatever resources were actually available. Convoy losses stay severe but Libya-bound tonnage improves somewhat over the campaign's worst months, at the cost of Malta remaining exactly the persistent, self-renewing problem this choice was meant to manage rather than solve.",
            },
            {
              label: flags.malta40 === "fell"
                ? "Garrison and fortify Malta against a British attempt to retake it, rather than banking on the convoy gains alone"
                : "Push to finally execute the Malta invasion — remove the base rather than keep escorting around it",
              advisor: flags.malta40 === "fell"
                ? { name: "Cavallero", position: "Malta is held because it was taken when weak, the Royal Navy has spent a year deciding whether taking it back is worth the fleet action, and it is better not to be unready when it decides." }
                : { name: "Cavallero", position: "Hercules has been planned for a year and nothing executed, every month of delay strengthens the island's air defenses and raises the cost, and if it is ever to work it must be now." },
              setFlags: { maltaQuestion: flags.malta40 === "fell" ? "garrison" : "invade" },
              impact: { manpower: -2, fuel: -2, initiative: 1 },
              next: flags.malta40 === "fell" ? "maltaRetake41" : "herculesExecution41",
              outcome: flags.malta40 === "fell"
                ? "A real commitment of manpower and material to a garrison and fortification effort the historical war never had reason to build, because the historical war never held the island this long. What it buys is insurance against the one thing that could undo 1940's gamble a year later: a Royal Navy and RAF effort to take the island back outright, rather than merely raid around it."
                : "The operation historians have argued about ever since — Hercules required German airborne forces, landing craft, and air cover Italy could not generate alone, and every serious postwar wargame of the plan splits on whether it would have succeeded even fully resourced, given Malta's defenses and the British fleet still able to contest the crossing. Attempting it here draws resources directly away from Rommel's own offensive timetable in the same season, a trade the North African front will notice regardless of how the invasion itself turns out.",
            },
          ],
        };
        },
        get herculesExecution41() {
          return {
          date: "FALL 1941",
          title: "The Plan Without the Parts It Needs",
          historicalRecord: false,
          situation:
            "Authorization is not the same thing as an army. Comando Supremo's own planning staff, ordered to turn Hercules from a paper option into a landing date, runs immediately into the arithmetic the operation has never actually solved: a Malta assault needs a parachute and glider lift considerably larger than anything the Regia Aeronautica can generate on its own, landing craft the navy has never built in the numbers required, and air cover to suppress an island garrison that has spent a year hardening exactly against this. Berlin's own airborne assets and transport aircraft — the pieces that make the plan theoretically workable — are, this autumn, entirely committed to an eastern campaign that has just reached the gates of Moscow, with nothing to spare for a Mediterranean island regardless of what Rome has authorized on its own initiative." +
            (flags.forkMaltaWeak
              ? " Whatever eased the convoy losses a season ago hasn't changed this arithmetic in the slightest — Hercules still needs an army it doesn't have, regardless of how the shipping numbers looked at the time."
              : ""),
          choices: [
            {
              label: "Launch with Italian assets alone — a scaled-down assault rather than no assault at all",
              advisor: { name: "Cavallero", position: "Authorization was asked for and received, and he will not return to the Palazzo Venezia to explain that authorization without German transport aircraft was never a plan, so scale it to what exists and go." },
              checkLabel: "Matériel",
              disabledReason: (meters.fuel || 0) <= -3 ? "insufficient fuel and shipping left to mount an amphibious-airborne assault of any size this season" : undefined,
              setFlags: { herculesExecution41: "launch" },
              impact: { manpower: -3, fuel: -2, initiative: 0 },
              next: "rommelAdvance41",
              outcome:
                "A scaled-down Hercules, run without the German lift the original plan assumed, is close to the worst version of the wargame's own pessimistic branch — an undersized airborne element against a garrison hardened for exactly this scenario, and a naval escort exposed to a Royal Navy and RAF Malta hasn't stopped resupplying all year. What was attempted here at real cost in men and shipping was, in the actual historical planning record, precisely the version Italian staff officers themselves argued against. This run gets to find out firsthand rather than read the postwar verdict.",
              uncertain: [
                {
                  weight: modWeight(25, meters.fuel),
                  title: "Against every reasonable estimate, the island falls",
                  setFlags: { herculesResult: "fell" },
                  impact: { manpower: -3, fuel: 1, initiative: 1 },
                  next: "maltaRetake41",
                  outcome:
                    "The wargame's own pessimistic consensus turns out not to be destiny: the undersized lift and a garrison spread thinner than the year's hardening suggested combine into a result the postwar analysts who studied this exact scenario mostly didn't credit — Malta falls to an assault fully half the historical Herkules plan's own minimum requirement. The convoy war to Libya transforms overnight, at a paratrooper and landing-craft cost this scaled-down force feels considerably more than the joint German-Italian version would have.",
                },
                {
                  weight: 100 - modWeight(25, meters.fuel),
                  title: "The estimate holds — the island doesn't fall",
                  setFlags: { herculesResult: "held" },
                  impact: { manpower: -3, fuel: -2, initiative: -1 },
                  outcome:
                    "The likelier and, on the numbers alone, always the more probable outcome: an undersized airborne element with no realistic prospect of overwhelming a garrison hardened for exactly this scenario, thrown back at a cost in men and shipping that buys nothing strategically. Malta's garrison spends the aftermath exactly as it spent every other reprieve this war offered it — hardening further, and continuing to cost the Africa-bound convoys everything the escort-first choice was always going to cost them regardless.",
                },
              ],
            },
            {
              label: "Stand the operation down again — wait on German assets that Barbarossa's winter may never release",
              advisor: { name: "Bastico", position: "An authorization from Rome does not conjure transport aircraft needed this month at a front the whole war may turn on, and he would rather admit the operation is not yet real than spend men proving it." },
              setFlags: { herculesExecution41: "stand down" },
              favor: 1,
              impact: { manpower: 0, fuel: 1, initiative: -1 },
              next: "rommelAdvance41",
              outcome:
                "The honest, if deflating, answer: Hercules stands down for a second time, for the same reason it stood down the first — the plan was never actually Italy's to execute alone, and the ally whose assets it depends on has its own, larger war absorbing every spare transport aircraft and glider this particular autumn. Malta's garrison spends the reprieve exactly as it spent every other one this war offered it: hardening further, and continuing to cost the Africa-bound convoys everything the escort-first choice was ever going to cost them regardless.",
            },
          ],
        };
        },
        get maltaRetake41() {
          return {
          date: "WINTER 1941 – 1942",
          title: "The Island Britain Won't Write Off",
          historicalRecord: false,
          situation:
            "The scale of what the documented war record shows Britain actually spending to keep Malta merely supplied — never mind holding it outright — is the baseline this command's own intelligence staff keeps returning to: Pedestal-scale relief convoys run at appalling cost, entire submarine flotillas and fighter squadrons committed to one island, a George Cross awarded to its population for enduring a siege the Admiralty never seriously considered simply conceding. That was the response to a Malta merely being starved. A Malta actually lost is, by every reading this staff can produce, a different order of British problem entirely — and Force H, the Mediterranean Fleet, and whatever carrier air power London can free up are the obvious instruments of getting it back." +
            (flags.maltaQuestion === "garrison"
              ? " A year of deliberate fortification — the choice made when this staff first took the island — means the defenses being tested now are not the ones Britain's own planners would have assumed when they last held it."
              : flags.maltaQuestion === "escort"
              ? " The defenses now being tested are close to whatever was captured intact in 1940 — this command spent the intervening year on the convoy war instead of the garrison, and that choice is about to be billed."
              : "") +
            " The question is not whether Britain tries. It is how much of this command's own fleet and air strength gets committed to making sure the attempt fails.",
          choices: [
            {
              label: "Reinforce the garrison and air defenses now, at the fleet's continued expense — hold what was taken",
              advisor: { name: "Iachino", position: "A fleet was spent taking that island once already, and spending less than everything to keep it would make the first expenditure the pointless one." },
              setFlags: { maltaDefense41: "reinforce" },
              impact: { manpower: -1, fuel: -2, initiative: 1 },
              next: "rommelAdvance41",
              outcome:
                "A real, continuing commitment rather than a one-time cost: fighter squadrons, coastal artillery, and the shipping to keep both supplied are held back from the desert war specifically to answer a British effort this staff is confident is coming, whatever it ends up costing Rommel's own timetable in the meantime.",
              uncertain: [
                {
                  weight: modWeight(
                    68 + (flags.maltaQuestion === "garrison" ? 10 : flags.maltaQuestion === "escort" ? -10 : 0) + (flags.malta40 === "fell" ? 5 : 0),
                    meters.initiative
                  ),
                  title: "The defense holds — Malta stays Italian",
                  setFlags: { maltaRetaken: false },
                  impact: { manpower: -1, fuel: -1, initiative: 1 },
                  outcome:
                    "Whatever Britain commits to this — and the documented pattern of effort spent on a Malta it never even lost suggests it is substantial — the reinforced defenses hold. The convoy war to Libya stays rewritten in Rome's favor, and this command has now twice done what the historical war never once required of it: taken the island, and then kept it.",
                },
                {
                  weight: 100 - modWeight(
                    68 + (flags.maltaQuestion === "garrison" ? 10 : flags.maltaQuestion === "escort" ? -10 : 0) + (flags.malta40 === "fell" ? 5 : 0),
                    meters.initiative
                  ),
                  title: "Britain takes it back",
                  setFlags: { maltaRetaken: true },
                  impact: { manpower: -2, fuel: -2, initiative: -1 },
                  outcome:
                    "The documented war's own verdict on how much Britain will spend to control this particular island reasserts itself: a combined Force H and Mediterranean Fleet operation, backed by carrier air power this command's own reinforcements can't match, retakes Malta in a hard-fought amphibious and naval campaign. Everything the 1940 gamble bought is spent retrieving it back for Britain — the convoy war to Libya reverts to the same submarine- and air-harassed arithmetic the historical campaign never escaped, on a supply line now additionally strained by whatever this defense cost outright.",
                },
              ],
            },
            {
              label: "Hold the line with what's already there — the desert war needs the fleet and air assets more than Malta does",
              advisor: { name: "Bastico", position: "Every squadron kept over Malta is one not covering Rommel's convoys, and he would rather risk the island than guarantee the desert front starves waiting for a British attack that may not come this season." },
              setFlags: { maltaDefense41: "minimal" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "rommelAdvance41",
              outcome:
                "The cheaper bet, and the more exposed one: whatever garrison and air strength is already on the island is what answers a British effort, with nothing further diverted from the desert war to reinforce it. What this saves Rommel's own supply picture this season, it risks on the island itself.",
              uncertain: [
                {
                  weight: modWeight(
                    38 + (flags.maltaQuestion === "garrison" ? 10 : flags.maltaQuestion === "escort" ? -10 : 0) + (flags.malta40 === "fell" ? 5 : 0),
                    meters.initiative
                  ),
                  title: "The existing defenses hold, barely",
                  setFlags: { maltaRetaken: false },
                  impact: { manpower: -1, fuel: 0, initiative: 0 },
                  outcome:
                    "The minimal-investment bet pays off, against a real risk this staff knew it was running: whatever was already on the island in 1940 or 1941 proves enough, this time, to see off a British effort that — by every reading of how much London historically spent chasing far smaller Mediterranean objectives — was unlikely to be a token one.",
                },
                {
                  weight: 100 - modWeight(
                    38 + (flags.maltaQuestion === "garrison" ? 10 : flags.maltaQuestion === "escort" ? -10 : 0) + (flags.malta40 === "fell" ? 5 : 0),
                    meters.initiative
                  ),
                  title: "Britain takes it back",
                  setFlags: { maltaRetaken: true },
                  impact: { manpower: -1, fuel: -1, initiative: -1 },
                  outcome:
                    "The cheaper bet fails the way the odds always said it might: a garrison never reinforced past what 1940 or 1941 originally left there gives a determined Force H and Mediterranean Fleet operation exactly the opening the documented British commitment to this island suggests it would take. Malta reverts to Britain, and the desert war's convoy arithmetic reverts with it — the fleet and fuel saved by not reinforcing the island are, in the event, saved for nothing this command can still spend.",
                },
              ],
            },
          ],
        };
        },
        get rommelAdvance41() {
          return {
          date: "NOVEMBER 1941 – JANUARY 1942",
          title: "Command in the Desert",
          historicalRecord: true,
          situation:
            "The British Crusader offensive in November has pushed Rommel's combined German-Italian force back out of Cyrenaica just as decisively as Compass did a year earlier — and just as quickly, a resupplied and reorganized Axis force under Rommel counterattacks in January and retakes most of the same ground again, a seesaw that has now happened twice in thirteen months. What sits underneath the territorial back-and-forth is a command relationship that has never been cleanly settled: Rommel, technically subordinate to Italian theater command under Bastico, in practice makes operational decisions on his own initiative and informs Rome or Bastico's headquarters after the fact more often than before it." +
            (flags.forkEastAfricaSlow
              ? " One quiet side effect of East Africa's longer holdout is on this desk too — the Commonwealth divisions it kept occupied through the autumn are, by every order-of-battle estimate Comando Supremo can get its hands on, still not among the reinforcements this front has had to face this round."
              : ""),
          choices: [
            {
              label: "Assert Italian operational authority — require Rommel to clear major offensives through Comando Supremo first",
              advisor: { name: "Bastico", position: "He is the theater commander of record and learned of this counterattack's exact date from Rommel's dispatches and not by being consulted, and that arrangement ends or his command here is a formality." },
              setFlags: { desertCommand: "assert", trust: (flags.trust || 0) + (-1) },
              trustDelta: -1,
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "tobruk42",
              outcome:
                "A genuine assertion of the nominal chain of command slows Rommel's characteristic speed of decision — the trait that produced both his biggest gains and his worst overextensions — in exchange for operations that at least nominally answer to Rome rather than to a German field marshal's own read of the map. Whether this produces a more sustainable campaign or simply a slower one that still runs out of fuel at the same rate is a question this front's supply arithmetic, not its chain of command, will ultimately answer.",
            },
            {
              label: "Accept the de facto arrangement — Rommel's operational initiative has produced results Italian command alone hadn't",
              advisor: { name: "Cavallero", position: "However irregular the arrangement looks on paper, Rommel has retaken Cyrenaica twice as fast as the staff planning projected, and a working method will not be interrupted to enforce a formality." },
              historical: true,
              setFlags: { desertCommand: "defer", trust: (flags.trust || 0) + (1) },
              trustDelta: 1,
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "tobruk42",
              outcome:
                "What actually happened, more or less — Bastico's nominal authority over Rommel was real on paper and only intermittently exercised in practice, a friction historians of the campaign return to repeatedly as an example of an alliance winning battles while never quite resolving who was actually in charge of winning them. The desert campaign's tempo stays fast; the cost of that tempo, in fuel this theater's supply line can never quite deliver enough of, keeps compounding underneath every gain either army books on the map.",
            },
          ],
        };
        },
        get tobruk42() {
          return {
          date: "JUNE 1942",
          title: "The Fall of Tobruk",
          historicalRecord: true,
          situation:
            "Tobruk withstood an eight-month siege in 1941 and became, in the process, something close to a symbol of Commonwealth resistance in the desert war. This time the garrison — mostly South African, reinforced hastily — falls in a single day's assault, June 21, 1942, yielding over 30,000 prisoners and, more consequentially for the Axis supply picture, enormous captured stocks of fuel and vehicles the desert campaign has never once had enough of. Rommel, newly promoted to Field Marshal on the strength of this single battle, wants to press the advantage immediately into Egypt rather than pause at the Libyan frontier the original campaign plan called a stopping point." +
            (flags.herculesResult === "fell" && !flags.maltaRetaken
              ? " Whatever this pursuit spends, it spends against a supply line no longer bled by Malta — the convoys behind Tobruk are the fullest this desert war has seen."
              : flags.maltaRetaken
              ? " Whatever this pursuit spends, it spends against a supply line bled by Malta all over again — the island Rome once held and then lost back to Britain is exactly as much of a problem for this desert war as it was before 1940's gamble was ever attempted, on top of everything spent taking and then losing it."
              : ""),
          choices: [
            {
              label: "Press on toward Egypt immediately, using Tobruk's captured supplies to fuel the pursuit",
              advisor: { name: "Rommel", position: "The gate to Egypt has never stood this open and will not stand open long, and every day paused to plan is a day the British use to rebuild the line just broken." },
              historical: true,
              checkLabel: "Matériel",
              disabledReason: meters.fuel <= -3 ? "insufficient reserve fuel to stretch a pursuit past whatever Tobruk's captured stocks alone can cover" : undefined,
              setFlags: { tobrukAftermath: "pursue" },
              impact: { manpower: 0, fuel: 1, initiative: 1 },
              next: "alamein42",
              uncertain: [
                {
                  weight: modWeight(55, meters.fuel),
                  title: "Tobruk's stocks stretch exactly as far as the bet needs them to",
                  setFlags: { tobrukPursuitResult: "reached" },
                  impact: { manpower: 0, fuel: 1, initiative: 1 },
                  outcome:
                    "What actually happened: Rommel presses on past the planned stopping point straight to the Egyptian frontier, reaching El Alamein by early July — the deepest Axis penetration of the entire North African campaign, and also the point at which the advance's own logistics, stretched a thousand miles from the nearest working port, finally run out of the margin Tobruk's captured stocks had briefly disguised.",
                },
                {
                  weight: 100 - modWeight(55, meters.fuel),
                  title: "The captured stocks run out before the frontier does",
                  setFlags: { tobrukPursuitResult: "stalled" },
                  impact: { manpower: -1, fuel: -1, initiative: 0 },
                  outcome:
                    "The optimistic bet on captured fuel doesn't clear the distance this time: the spearhead outruns what Tobruk's stocks and the thousand-mile supply line behind them can actually deliver well short of the historical high-water mark, and a hurried, partial consolidation short of Alamein costs momentum without buying the deeper penetration that momentum was spent chasing in the first place.",
                },
              ],
            },
            {
              label: "Halt at the Libya-Egypt frontier and consolidate before any further advance",
              advisor: { name: "Bastico", position: "The plan agreed called this the stopping point for a reason that has not changed just because Tobruk fell faster than expected, so consolidate the supply line before spending the momentum on a deeper gamble." },
              setFlags: { tobrukAftermath: "consolidate" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "alamein42",
              outcome:
                "The cautious option Rommel's own superiors argued for and were overruled on, historically. A consolidated position at the original planned line preserves more of Tobruk's captured supplies for an eventual offensive rather than burning them on an immediate pursuit — at the cost of the operational momentum that, however unsustainably, carried the historical advance to within seventy miles of Alexandria before it finally stalled on its own exhausted logistics anyway.",
            },
          ],
        };
        },
        get alamein42() {
          return {
          date: "OCTOBER – NOVEMBER 1942",
          title: "El Alamein",
          historicalRecord: true,
          situation:
            "The Axis advance stopped for good in July at a narrow, sixty-kilometer gap between the Mediterranean coast and the impassable Qattara Depression — the one stretch of desert too narrow for the usual open-flank maneuver either side has relied on for two years of seesaw campaigning. Montgomery's Eighth Army has spent three months building a materiel advantage in tanks, aircraft, and above all fuel that Rommel's own supply line" +
            (flags.herculesResult === "fell" && !flags.maltaRetaken
              ? ", running a thousand miles from the nearest working port but no longer bled by a Malta this command actually neutralized a year ago,"
              : flags.maltaRetaken
              ? ", running a thousand miles from the nearest working port and bled by a Malta Britain fought hard to take back — the 1940 gamble's dividend spent almost as soon as it was collected,"
              : ", still running the same thousand-mile gauntlet past Malta's aircraft and submarines,") +
            " has no way to match. The battle about to be fought here is not one either theater command has much room left to shape tactically; it is a battle the two sides' respective supply arithmetic has already substantially decided in advance." +
            (flags.tobrukAftermath === "pursue" ? (flags.tobrukPursuitResult === "stalled" ? " This is the army whose pursuit past Tobruk ran out of captured fuel before reaching this line — it arrives here already thinner for it." : " This is the same army that spent Tobruk's captured fuel chasing this frontier back in June.") : " This is the army that chose to consolidate rather than chase Tobruk's momentum back in June."),
          choices: [
            {
              label: "Fight the defensive battle as planned — trust the Alamein line's fortifications to absorb the assault",
              advisor: { name: "Rommel", position: "There is not the fuel to fight this battle the way he would prefer, so the line held is the line held, and Montgomery will pay by the yard for what he takes." },
              historical: true,
              setFlags: { alamein42: "hold" },
              impact: { manpower: -2, fuel: -1, initiative: -1 },
              next: "torchTunisia42",
              outcome:
                "What happened: twelve days of attritional fighting break the Axis line by early November, and what follows is not an orderly withdrawal but a headlong 1,500-mile retreat across Libya that doesn't stop until Tunisia — the beginning of the end for the entire North African campaign, decided as much by the fuel convoys that never arrived as by anything that happened on the battlefield itself.",
            },
            {
              label: "Order a fighting withdrawal before the line is fully committed — preserve the army rather than the ground",
              advisor: { name: "Bastico", position: "Rommel would rather lose this army defending a line than retreat and be blamed for giving up Egypt's approaches, while he would rather have an army left to defend Tunisia with." },
              setFlags: { alamein42: "withdraw" },
              favor: 1,
              impact: { manpower: -1, fuel: 0, initiative: -1 },
              next: "torchTunisia42",
              outcome:
                "A deliberate early withdrawal concedes the same ground the historical battle eventually lost anyway, without first spending twelve days of attritional casualties defending a line the fuel arithmetic never gave it a real chance to hold. What it preserves is a somewhat more intact force reaching Tunisia — the same eventual destination the historical retreat also reached, just with fewer of the men and less of the equipment burned proving the line couldn't be held.",
            },
          ],
        };
        },
        get torchTunisia42() {
          return {
          date: "NOVEMBER 1942",
          title: "Torch and the Race for Tunisia",
          historicalRecord: true,
          situation:
            "Anglo-American landings across French North Africa on November 8 have opened an entirely new front behind the retreating Axis army at exactly the moment it can least afford one — Vichy French forces in Algeria and Morocco largely stop resisting within days, and the strategic picture in the Mediterranean has inverted: instead of Rommel's army retreating toward safety, it is now being squeezed between Montgomery's pursuit from the east and a fresh Allied army landing to the west, with only Tunisia's mountainous terrain offering any prospect of a defensible pocket to fall back into." +
            (flags.herculesResult === "fell" && !flags.maltaRetaken
              ? " One thing this crossing has that the historical Sicilian Strait run never did: Malta, sitting directly across the shortest route to Tunisia, is this command's own base rather than a British one — every convoy runs it without the air and submarine interdiction that historically made this exact crossing as costly as it was."
              : flags.maltaRetaken
              ? " The Sicilian Strait crossing runs past a Malta this command once held and then lost back to Britain — interdiction from the island is, if anything, sharper than the historical baseline, the garrison there fighting a war it has personal cause to make expensive."
              : "") +
            // Round 15 (battle #4 echo): the Alam Halfa key battle's own detail, not a fork —
            // this node's own framing (a retreating army squeezed from both sides) is the fixed
            // outcome either way, since the ridge falling in September doesn't survive Second
            // Alamein in October and November on the historical timeline this campaign's later
            // nodes are built on. keyBattleEcho() is a no-op ("") when the flag isn't set, which
            // covers both shipped builds and a player who chose not to push at Alam Halfa at all.
            (flags.alameinPush ? keyBattleEcho("elAlamein", flags) : ""),
          choices: [
            {
              label: "Rush every available reinforcement into Tunisia to build a defensible bridgehead before the Allies close the trap",
              advisor: { name: "Kesselring", position: "Tunisia is the only ground left where terrain favors the Axis, and every division flown or shipped in before the Allies consolidate buys the rest of the front more time." },
              historical: true,
              checkLabel: "Matériel",
              disabledReason: meters.fuel <= -3 ? "insufficient shipping and fuel left to run the Sicilian Strait crossing at the scale this buildup needs" : undefined,
              setFlags: { tunisiaBuildup: "reinforce" },
              impact: { manpower: 1, fuel: -1, initiative: 0 },
              next: "tunisiaCollapse43",
              uncertain: [
                {
                  weight: modWeight(flags.herculesResult === "fell" && !flags.maltaRetaken ? 80 : 60, meters.fuel),
                  title: "The crossing holds up — reinforcement arrives close to intact",
                  setFlags: { tunisiaCrossing: "held" },
                  impact: { manpower: 1, fuel: -1, initiative: 0 },
                  outcome: flags.herculesResult === "fell" && !flags.maltaRetaken
                    ? "An Italian-held Malta makes the difference the historical crossing never had: without the island's air and submarine forces contesting the Strait, reinforcement — including Messe's newly formed First Italian Army — arrives close to complete, building a defensive position in Tunisia's mountains considerably stronger than the historical buildup managed on a route it never controlled at both ends."
                    : "What happened: a substantial Axis reinforcement — including Messe's newly formed First Italian Army — does establish a real defensive position in Tunisia's mountains through the winter, holding out considerably longer than the immediate post-Torch panic in Rome and Berlin expected. What this buildup does not do is change where the campaign ends, since every reinforced division shipped into Tunisia is a division that will also be captured there when the position finally, inevitably, collapses.",
                },
                {
                  weight: 100 - modWeight(flags.herculesResult === "fell" && !flags.maltaRetaken ? 80 : 60, meters.fuel),
                  title: "Allied air and submarine interdiction across the Strait cuts deeper than planned",
                  setFlags: { tunisiaCrossing: "mauled" },
                  impact: { manpower: -1, fuel: -1, initiative: -1 },
                  outcome: flags.maltaRetaken
                    ? "Even an Italian-held Malta once, and a bitterly recaptured British one now, doesn't spare this crossing — if anything a garrison that fought to retake the island interdicts this convoy run harder than the historical baseline ever did, and the bridgehead gets built at a heavier toll than the historical buildup paid for it."
                    : "The bridgehead gets built, but at a heavier toll than the historical buildup paid: convoys running the narrow Sicilian Strait lose a larger share of the men and matériel committed to interdiction that has only gotten more effective as the campaign wears on, and the mountain position this reinforcement was meant to make properly defensible holds for a shorter, thinner winter than the actual six-month defense managed — the same eventual collapse, reached with less to show for the men spent reaching it.",
                },
              ],
            },
            {
              label: "Limit the Tunisia commitment and prioritize evacuating experienced units back to Italy instead",
              advisor: { name: "Messe", position: "A defense is being built in a pocket with the sea at its back and no realistic relief, and he would rather save the veteran cadres than spend them on a delay whose ending is not in doubt." },
              setFlags: { tunisiaBuildup: "evacuate" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "tunisiaCollapse43",
              outcome:
                "A colder, more clear-eyed read of a position the historical buildup never fully escaped: reinforcing Tunisia bought roughly six months of delay at the cost of the men and equipment doing the buying, all of which was still eventually lost when the position collapsed regardless. Limiting the commitment and prioritizing evacuation trades some of that delay for veteran units preserved to defend Italy itself, when the war's geography turns to face it directly within the year.",
            },
          ],
        };
        },
        get tunisiaCollapse43() {
          return {
          date: "MAY 1943",
          title: "Surrender in Tunisia",
          historicalRecord: true,
          situation:
            "Six months of defense in Tunisia's mountains — genuinely longer than Berlin or Rome expected the position to hold after Torch — ends in a collapse as total, in its own way, as Tunis and Bizerte fall within days of each other and the pocket's remaining defenders, cut off from any further evacuation across a strait the Allied navies and air forces now fully control, are left with nothing but the terms of surrender to decide." +
            (flags.tunisiaBuildup === "reinforce" ? (flags.tunisiaCrossing === "mauled" ? " These are the men left after a reinforcement convoy that took heavy losses crossing the Strait, spent now on a defense that was always going to end here." : " These are the six months the fuller winter buildup bought, spent now on a defense that was always going to end here.") : " This is the leaner defense the evacuation-first choice after Torch left holding the pocket."),
          choices: [
            {
              label: "Order a fighting surrender only after every position is actually untenable",
              advisor: { name: "Messe", position: "He will not order the army to lay down its arms while it can still fight for one more hour of dignity, however little that hour changes the outcome." },
              historical: true,
              setFlags: { tunisiaCollapse: "fight" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: "homeFrontBombing43",
              outcome:
                "What happened: the last organized Axis resistance in Tunisia surrenders on May 13, 1943, after Messe — the last Axis commander still fighting — is promoted to Field Marshal by radio message hours before the surrender, largely so he would not have to surrender at a rank junior to the German commander alongside him. Some 275,000 Axis troops go into captivity, a loss in prisoners alone that rivals Stalingrad's, and North Africa is entirely lost.",
            },
            {
              label: "Negotiate surrender terms as soon as the position is clearly hopeless, to reduce further casualties",
              advisor: { name: "Ambrosio", position: "No version of the next week keeps this army in the field, and every additional day of resistance before terms are settled is a day's casualties spent confirming a conclusion not in question." },
              setFlags: { tunisiaCollapse: "negotiate" },
              favor: 1,
              impact: { manpower: -1, fuel: 0, initiative: -1 },
              next: "homeFrontBombing43",
              outcome:
                "An earlier surrender spares some of the final week's casualties without changing the campaign's outcome in any respect that matters strategically — the same roughly 275,000 men go into Allied captivity either way, on a timeline that differs by days rather than weeks. What it does preserve, marginally, is a slightly larger share of those men returning home able-bodied whenever their captivity eventually ends.",
            },
          ],
        };
        },
        get homeFrontBombing43() {
          return {
          date: "JUNE – JULY 1943",
          title: "The Home Front Under the Bombs",
          historicalRecord: true,
          situation:
            "With North Africa lost and an Allied invasion of Sicily or the mainland clearly the next move, Allied strategic bombing of Italian cities has escalated sharply — Naples, Palermo, and industrial centers in the north are being hit with a regularity and weight the Italian air defense network, thin from three years of war and stretched further defending convoy routes, cannot meaningfully contest. Public morale, already strained by years of rationing and casualty lists, is fraying in ways the propaganda ministry's usual instruments — controlled news, patriotic radio programming — are visibly struggling to manage." +
            (flags.italyEntry === "declare"
              ? " Three years ago this war was sold as a few thousand dead bought against a peace table already mostly decided — the gap between that promise and what the home front is living through under these raids is exactly the gap this ministry's controlled news has to keep papering over."
              : flags.italyEntry === "wait"
              ? " Even the more reluctant version of this war's opening — a declaration argued for on readiness rather than opportunity — bought nothing the propaganda ministry can point to now; three years on, the bombs don't distinguish why the war started."
              : flags.italyEntry === "lateDeclare"
              ? " A declaration made in the war's last days before France's armistice bought this command no readiness advantage worth mentioning by now — three years on, the bombs don't distinguish a late entry from an early one."
              : flags.italyEntry === "britainOnly"
              ? " This war was never sold on a peace-table deadline at all — it was fought for Malta and Egypt from its first declared day — and three years of raids have made that distinction no easier to explain to a home front under the same bombs regardless."
              : "") +
            " The question in front of Comando Supremo is less military than it is political: what, if anything, changes about how the war is presented and resourced at home, with an invasion of Italian soil now a matter of when rather than if.",
          choices: [
            {
              label: "Prioritize air defense reinforcement for the home cities over further North African-adjacent commitments",
              advisor: { name: "Ambrosio", position: "No colonial front is left to defend, and every fighter squadron and anti-aircraft battery that can still be fielded belongs over Naples and Palermo now, not where the war has already moved past." },
              checkLabel: "Matériel",
              disabledReason: meters.fuel <= -3 ? "not enough fuel left to keep a reinforced fighter screen flying over the home cities in strength" : undefined,
              setFlags: { homeFront43: "airDefense" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "sicilyHusky43",
              outcome:
                "Concentrating the depleted air defense network over the home cities reduces bombing losses somewhat in the weeks before the invasion actually lands — a real, if partial, mercy for the civilians under the raids — without changing the strategic picture in any respect that matters: the fighters and guns pulled home are also fighters and guns not defending whatever beach the Allies choose next, and that choice is coming regardless of where air defense is currently concentrated.",
              uncertain: [
                {
                  weight: modWeight(55, meters.fuel),
                  title: "The reinforced screen actually holds a raid or two off",
                  setFlags: { homeFront43Result: "held" },
                  impact: { manpower: 0, fuel: 0, initiative: 0 },
                  outcome:
                    "The concentrated squadrons manage, a handful of times, what the thin dispersed network never could — turning a raid back short of its target rather than merely counting the damage afterward. It's a small mercy, and Rome notices it exists at all.",
                },
                {
                  weight: 100 - modWeight(55, meters.fuel),
                  title: "The numbers were never there to begin with",
                  setFlags: { homeFront43Result: "overwhelmed" },
                  impact: { manpower: 0, fuel: -1, initiative: 0 },
                  outcome:
                    "Concentration helps at the margins and not where it counts — the raids keep arriving in a weight three years of attrition left no real Italian air defense able to contest, wherever the remaining squadrons happen to be standing.",
                },
              ],
            },
            {
              label: "Maintain the existing dispersal of forces and let civil defense authorities manage morale as best they can",
              advisor: { name: "Mussolini", position: "Panic over a bombing campaign is a domestic problem and the regime has instruments for domestic problems, since the war is decided at the front and not in how bravely Naples takes an air raid." },
              historical: true,
              setFlags: { homeFront43: "maintain" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "sicilyHusky43",
              outcome:
                "Roughly what actually happened — home air defense stayed thin and dispersed through the summer of 1943, and the civilian toll from Allied bombing kept climbing largely unanswered. What the regime's propaganda instruments could not actually manage, whatever Mussolini's own read of the problem, was the accumulating gap between what the war's official narrative promised and what people watching their own cities burn could plainly see for themselves — a gap that would matter directly within weeks.",
            },
          ],
        };
        },
        get sicilyHusky43() {
          return {
          date: "JULY 1943",
          title: "The Invasion of Sicily",
          historicalRecord: true,
          situation:
            "The largest amphibious invasion of the war to date lands on Sicily's southern coast on July 9-10, and the island's defense — a mix of static Italian coastal divisions of uneven quality and two mobile German divisions held in reserve — is overwhelmed within days rather than weeks. This is, for the first time since the war began, an Allied army fighting on Italian home soil, and the political shockwave in Rome is arriving faster than the military one: the Fascist Grand Council, dormant since 1939, is about to be convened for the first time in years, and everyone in Comando Supremo can read what that convening probably means." +
            (flags.homeFront43Result === "held"
              ? " Whatever mercy the reinforced air defense bought the home cities last month, it bought nothing here — Sicily's own defenses were never the beneficiary of squadrons kept over Naples and Palermo."
              : ""),
          choices: [
            {
              label: "Concentrate the defense on denying the Strait of Messina — a fighting withdrawal off the island, not a last stand on it",
              advisor: { name: "Ambrosio", position: "Sicily cannot be held with what is left, and what can be saved is the army evacuating across the Strait and not captured on the beaches defending ground already lost." },
              historical: true,
              setFlags: { sicily43: "withdraw" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "mussoliniCoup43",
              outcome:
                "Close to what actually happened: roughly 100,000 Axis troops and their heavy equipment are evacuated across the Strait of Messina over several weeks in August, largely unmolested by an Allied pursuit more focused on racing to Messina than sealing the strait — one of the more consequential missed opportunities of the Mediterranean campaign, from the Allied side, and a real if modest mercy from the Italian one.",
            },
            {
              label: "Order the garrison to hold Sicily as long as possible — a defense-in-place rather than an early withdrawal",
              advisor: { name: "Mussolini", position: "He will not authorize what reads in every newspaper in the world as abandoning Italian soil in a matter of days, so hold the island." },
              checkLabel: "Manpower",
              disabledReason: meters.manpower <= -3 ? "too depleted a garrison left on the island to sustain an extended defense-in-place" : undefined,
              setFlags: { sicily43: "hold" },
              impact: { manpower: -2, fuel: 0, initiative: 0 },
              next: "mussoliniCoup43",
              uncertain: [
                {
                  weight: modWeight(30, meters.initiative),
                  title: "The extra weeks buy something real for the mainland's defenses",
                  setFlags: { sicilyHoldResult: "delay" },
                  impact: { manpower: -2, fuel: 0, initiative: 1 },
                  outcome:
                    "A rarer outcome than the garrison's own commanders expected going in: the extended defense-in-place costs the men and equipment it was always going to cost, but this time buys a genuine, if modest, stretch of extra weeks that mainland defensive preparations put to real use before the Allied army that finally clears Sicily can turn its attention north.",
                },
                {
                  weight: 100 - modWeight(30, meters.initiative),
                  title: "The delay is real on the calendar and worth nothing on the map",
                  setFlags: { sicilyHoldResult: "wasted" },
                  impact: { manpower: -3, fuel: 0, initiative: 0 },
                  outcome:
                    "Holding in place longer costs more men and equipment against an Allied force with total air and naval superiority over the island — the same eventual loss of Sicily happens regardless, just with fewer veteran troops surviving to defend the mainland afterward, and a political cost of its own: a defeat that arrives visibly slower does not read, to a Grand Council already assembling its case, as a defeat that arrives any less certainly.",
                },
              ],
            },
          ],
        };
        },
        get mussoliniCoup43() {
          return {
          date: "JULY 25, 1943",
          title: "The Grand Council",
          historicalRecord: true,
          situation:
            "The Fascist Grand Council meets for the first time since the war began, summoned by Mussolini himself in an attempt to reassert his authority by having the regime's own institutions formally endorse it — a gamble that misreads how far confidence in his leadership has actually collapsed among the very men he convened. After a session running past two in the morning, the Council votes 19 to 7 to restore full constitutional authority to King Victor Emmanuel III, effectively a vote of no confidence dressed in procedural language. Mussolini treats the vote as advisory, not binding, and goes to the Palazzo the next afternoon expecting to continue governing regardless. He is wrong about that, in a way nothing in the Council's own vote actually determines: the King, not the Council, holds the only power that matters here, and has already decided independently to act." +
            (flags.sicily43 === "hold" ? (flags.sicilyHoldResult === "delay" ? " The officer corps gathering for this vote just finished an island defense that, unusually, bought real time for the mainland rather than nothing at all." : " The officer corps gathering for this vote just finished bleeding for an island defended in place rather than evacuated.") : " The officer corps gathering for this vote just finished pulling Sicily's garrison back across the Strait rather than losing it on the beaches."),
          choices: [
            {
              label: "Comando Supremo recognizes the King's constitutional authority once he acts",
              advisor: { name: "Victor Emmanuel III", position: "Marshal Badoglio is the last man in Italy who can be sent to lead the government, and the war continues but it will not be left in the hands that brought the country here." },
              historical: true,
              setFlags: { coupResponse: "recognizeKing", trust: (flags.trust || 0) + (-1) },
              trustDelta: -1,
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "armisticeNegotiation43",
              outcome:
                "What happened: the King informs Mussolini after their audience on July 25 that he is dismissed and Badoglio will form a new government; Mussolini is arrested by Carabinieri in the palace courtyard on the way to his car, and the news is announced by radio that evening to a country that reacts with more relief than shock. Comando Supremo's institutional continuity survives the transition essentially intact — the same officer corps, reporting now to Badoglio instead of Mussolini, with the actual question of what to do about the war itself still entirely unresolved.",
            },
            {
              label: "Comando Supremo's officer corps rallies to Mussolini against the King's move — a speculative counterfactual",
              advisor: { name: "Graziani", position: "The Grand Council's vote is advisory, and the King's constitutional authority over the armed forces has never been tested against a Duce who refuses to accept it, until perhaps now." },
              setFlags: { coupResponse: "backMussolini", trust: (flags.trust || 0) + (1) },
              trustDelta: 1,
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "romeStandoff43",
              outcome:
                "The road essentially no one actually took: in the real July 1943, the officer corps' loyalty to the constitutional monarchy proved deeper than its loyalty to Mussolini personally, and the transition happened with no meaningful resistance from the military. What this file now follows instead is marked plainly for what it is — a minority, counterfactual branch with almost no footing in the documented record, run forward on its own terms rather than folded quietly back into the history that actually happened.",
            },
          ],
        };
        },
        get romeStandoff43() {
          return {
          date: "JULY 26, 1943",
          title: "A Palace Under Two Claims",
          historicalRecord: false,
          speculative: true,
          situation:
            "Marked plainly, up front: everything from here follows a road essentially no one in the real July 1943 actually took, and it is labelled as such rather than folded quietly back into the historical record. In the hours after Mussolini's audience with the King, word reaches the small circle of officers who consider their loyalty personal rather than constitutional — and rather than accept the dismissal as settled, they move. Carabinieri units already positioned around the Quirinale and key ministries answer to the Crown by training and by oath; whatever 'loyalist' divisions exist here answer to a Duce whose actual authority to command them, this afternoon, is a question the Italian constitution has never had to answer, because in the documented history it was never asked.",
          choices: [
            {
              label: "Order loyalist divisions to move on the Quirinale and secure the ministries outright",
              advisor: { name: "Graziani", position: "The King's authority over this army was never tested because no one tested it, and he proposes testing it this afternoon, before Badoglio's government has a chance to become a fact and not a rumor." },
              checkLabel: "Initiative",
              disabledReason: (meters.initiative || 0) >= 1 ? undefined : "insufficient momentum among loyalist units to attempt seizing the capital's institutions outright",
              setFlags: { romeStandoff43: "seize" },
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "factionSplit43",
              outcome:
                "A direct move on the Quirinale is the boldest version of a scenario the documented history never came close to producing — the Carabinieri units actually posted around the palace that afternoon were there specifically because the King and Badoglio expected exactly this possibility and prepared for it, which this speculative branch's own loyalist officers now discover the hard way, in a standoff that is more confusion and shouted orders than the clean coup the plan assumed.",
            },
            {
              label: "Seek a negotiated, face-saving arrangement rather than open confrontation in the capital",
              advisor: { name: "Cavallero", position: "With no command left to order anyone into anything, he says that whatever loyalty is owed the Duce personally is not worth Italian soldiers firing on other Italian soldiers outside the palace gates, so find a formula that avoids it, even an ugly one." },
              setFlags: { romeStandoff43: "negotiate" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "factionSplit43",
              outcome:
                "A quieter opening move — an attempt to extract some formal concession from the King's new government (a delayed transition, a role preserved for Mussolini, anything short of the clean dismissal that actually happened) without first forcing the question at gunpoint. It buys a few days of ambiguity rather than an immediate crisis, at the cost of the momentum a direct move might have carried, however briefly, into the vacuum left the moment the King's own intentions became public.",
            },
          ],
        };
        },
        get factionSplit43() {
          return {
          date: "LATE JULY – AUGUST 1943",
          title: "An Army That No Longer Agrees With Itself",
          historicalRecord: false,
          speculative: true,
          situation:
            "This is still speculation beyond anything the documented record supports, and the honest scholarly baseline governs the odds here as much as it did at the palace gates: the officer corps' loyalty to the constitutional monarchy, in the war that actually happened, ran deep enough that no meaningful military faction ever rallied behind Mussolini against it. What this file is testing is the minority argument — that a determined, well-placed push in the crisis's first hours could have found enough personal loyalists to fracture that unity rather than simply fail against it. The answer this branch is finding is not encouraging for the loyalists: most garrison and field commands, reached by radio and rumor rather than clear orders from either side, are declaring for the King within days, leaving Mussolini's remaining backers a shrinking island of committed units rather than the army the coup's own premise required.",
          choices: [
            {
              label: "Move against wavering and defecting commanders — treat the split as a discipline problem to be enforced",
              advisor: { name: "Graziani", position: "Every commander who declares for the King today is one the movement cannot afford to lose tomorrow, and he would rather arrest the wavering ones now than watch the army dissolve by the end of the week." },
              setFlags: { factionSplit43: "enforce" },
              impact: { manpower: -2, fuel: 0, initiative: 1 },
              next: "germanExploitation43",
              outcome:
                "Enforcing loyalty at gunpoint against an officer corps whose actual, documented sympathies ran overwhelmingly the other way produces exactly the kind of internal violence the real transition of July 1943 — bloodless, and by most accounts almost anticlimactic — never had to absorb. What it buys the loyalist faction is a smaller, more tightly committed core; what it costs is any remaining claim that this movement represents more than a fraction of an army that has, in the documented history this branch has now fully departed from, already decided where its loyalty actually lies.",
            },
            {
              label: "Accept the fracture rather than force it — avoid a Fascist-on-Fascist civil war inside the army itself",
              advisor: { name: "Cavallero", position: "An army that arrests its own wavering commanders spends its last cohesion on itself and not on anyone opposing it, so let those who want to leave, leave, and what is left will at least answer to someone." },
              favor: 1,
              setFlags: { factionSplit43: "tolerate" },
              impact: { manpower: -1, fuel: 0, initiative: -1 },
              next: "germanExploitation43",
              outcome:
                "Tolerating the split rather than punishing it costs the loyalist faction most of the army within weeks — the same underlying loyalty to the Crown that made the historical transition bloodless simply reasserts itself once nobody is being arrested for declaring it openly — but it spares this counterfactual branch the specific horror of Italian units fighting each other in the capital over a question the documented history never had to force.",
            },
          ],
        };
        },
        get germanExploitation43() {
          return {
          date: "AUGUST 1943",
          title: "Berlin Reads the Confusion",
          historicalRecord: false,
          speculative: true,
          situation:
            "One fact does carry over intact from the documented record into this speculative branch: Hitler's own headquarters, distrustful of Rome's intentions from the moment the Grand Council's vote became known, had contingency plans for occupying Italy drawn up well before the historical armistice ever made them necessary. In the war that actually happened, those plans — Achse, Alarich — activated in September against a government that had already, quietly, negotiated terms with the Allies. Here, they activate a month earlier, against a country visibly fighting itself, and German formations already moving south through the Brenner Pass arrive with a pretext the historical timeline never handed them this early: not liberation, not alliance, but 'stabilization' of an ally that can no longer stabilize itself.",
          choices: [
            {
              label: "Refuse German reinforcement of Rome — insist this remains an internal Italian question",
              advisor: { name: "Graziani", position: "The day the movement needs German divisions to hold the capital against other Italians is the day it has lost whatever it thought it was fighting for, and he will not send that invitation." },
              checkLabel: "Manpower",
              disabledReason: (meters.manpower || 0) >= -2 && (meters.fuel || 0) >= -1 ? undefined : "insufficient independent strength left to refuse German 'assistance' and still hold the capital",
              setFlags: { germanExploitation43: "refuse" },
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "civilConflictEnd43",
              outcome:
                "Refusing the German offer preserves, for whatever it is still worth, the claim that this remains an Italian argument rather than a German occupation dressed as one — a distinction that matters considerably more to the men making it than to Berlin, which has wanted direct control of the peninsula's defense since Sicily fell regardless of which Italian faction happens to be nominally in charge of Rome this particular month.",
            },
            {
              label: "Accept German troops into Rome to help suppress the King's loyalists",
              advisor: { name: "Kesselring", position: "Formations can be at the capital within days, and he does not ask what this costs the movement's independence but tells what it costs the alternative, which is losing the capital to the King's Carabinieri by the end of the week." },
              historical: false,
              setFlags: { germanExploitation43: "accept" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "civilConflictEnd43",
              outcome:
                "Accepting German troops settles the immediate military question and produces, a month earlier than the documented history's own armistice-triggered occupation, the same underlying fact the historical Republic of Salò spent twenty months unable to escape: a government that survives in the capital only because a German garrison, not its own army, actually holds it.",
            },
          ],
        };
        },
        get civilConflictEnd43() {
          return {
          date: "SEPTEMBER 1943",
          title: "Rome, Spent on Itself",
          historicalRecord: false,
          speculative: true,
          situation:
            "This is the last page of a road essentially no one in the real July and August of 1943 actually took, and the honest verdict this branch has to render is the same one the original choice's own outcome text warned about from the start: the deeper problem underneath every hour of this counterfactual crisis — a losing war, a country that has wanted out of it since Compass, an army whose actual documented loyalty never wavered from the Crown — was never a question this internal Italian conflict could resolve, whichever faction happened to hold the Quirinale by the calendar's end. Six weeks that the historical transition of power settled in an afternoon have instead been spent fighting a question the war's own arithmetic had already answered.",
          choices: [
            {
              label: "Let the loyalist movement dissolve rather than spend more of the army proving a point already lost",
              advisor: { name: "Graziani", position: "A career in this army was not spent to end it arguing with the rest of the army over a Duce the war has already defeated, and whatever comes next is not worth one more Italian division spent on this argument." },
              setFlags: { loyalistEnd: "collapse" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "END",
              outcome:
                "The loyalist faction dissolves not through defeat in the field but through the same exhaustion that eventually governs every branch of this campaign — a losing war does not become winnable because the argument over who runs it changes shape. What remains, by the counterfactual autumn this branch closes on, looks less like a restored Fascist state than like the King's government arrived at anyway, six bloodier weeks and several thousand more Italian casualties later, having spent an army the historical transition never had to spend at all.",
            },
            {
              label: "Formalize the arrangement with Berlin — a client relationship, however this movement chooses to describe it",
              advisor: { name: "Kesselring", position: "Call it whatever the propaganda ministry prefers, since what it is is settled: Rome answers to German command now, a month earlier and more openly than the arrangement later histories describe." },
              setFlags: { loyalistEnd: "absorbed" },
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: "END",
              outcome:
                "What this counterfactual actually arrives at, stripped of whichever banner it started under, is recognizably the same client-state arrangement the documented history's Republic of Salò settled into two months later and considerably more visibly — a government that exists in the capital because a German garrison allows it to, fighting a war it was never going to win under a flag that was never actually the question this branch's own internal argument was fought over.",
            },
          ],
        };
        },
        get armisticeNegotiation43() {
          return {
          date: "AUGUST 1943",
          title: "Secret Talks",
          historicalRecord: true,
          situation:
            "Badoglio's new government — installed on the strength of Comando Supremo recognizing the King's own constitutional authority, three weeks ago, rather than contesting it — has publicly declared 'the war continues alongside our German ally,' a line almost nobody in Comando Supremo's own senior ranks actually believes, while General Castellano is dispatched to Lisbon and then Sicily under deep cover to negotiate surrender terms with the Allies. The talks are genuinely fraught on both sides: the Allies want unconditional surrender and are suspicious, not without reason, that Rome is stalling for time to prepare its own defenses; Rome wants Allied airborne forces to help secure the capital against the German garrison already reinforcing in and around it before any armistice is announced publicly, a request the Allies — burned by how little military value they now place on Italian cooperation — are unwilling to fully commit to.",
          choices: [
            {
              label: "Press for firm Allied guarantees on defending Rome before agreeing to any armistice terms",
              advisor: { name: "Castellano", position: "An armistice announced without a plan to hold Rome is not a surrender but an invitation for the German garrison already there to take the city, and he will not sign until Rome's defense is part of the terms." },
              historical: true,
              setFlags: { armisticeTerms: "pressRome" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "armisticeAnnounce43",
              outcome:
                "Historically, Castellano's negotiating position did push for exactly this, and the Allies did tentatively agree to an airborne operation — Giant II — to help secure Rome's airfields ahead of the announcement. What the negotiating table could promise and what actually arrived turned out to be two different things: the operation was cancelled at the last moment once Allied planners concluded German strength around Rome had grown too great for a lightly-armed airborne force to secure the city regardless of what the terms said on paper.",
            },
            {
              label: "Accept the Allied terms without conditions, to avoid losing the diplomatic opening entirely",
              advisor: { name: "Ambrosio", position: "Every week spent negotiating the fine print is a week the German garrison in Rome spends getting stronger, and an armistice with imperfect guarantees is better than none at all." },
              setFlags: { armisticeTerms: "acceptUnconditional" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "armisticeAnnounce43",
              outcome:
                "Accepting terms faster secures the armistice agreement itself with less risk of the whole opening collapsing under Allied suspicion of stalling — but it also means Rome's defense arrangements, whatever they turn out to be, are settled with even less specific Allied commitment behind them than the historical negotiation managed to extract, for whatever that commitment proved worth in the event.",
            },
          ],
        };
        },
        get armisticeAnnounce43() {
          return {
          date: "SEPTEMBER 8, 1943",
          title: "The Announcement",
          historicalRecord: true,
          situation:
            "Eisenhower announces the armistice on Allied radio at 6:30 PM, forcing Badoglio's government to confirm it that same evening — earlier than Rome had wanted, before its own military had been given clear, prepared instructions for what happens next. What follows in the following seventy-two hours is chaos by design failure rather than by German initiative alone: Comando Supremo issues no coherent general order to the roughly 1.5 million Italian troops now scattered across Italy, the Balkans, and France, leaving individual unit commanders to decide for themselves, with no guidance, whether to resist German forces that begin disarming them within hours under a prepared contingency plan — Operation Achse — that Berlin, unlike Rome, had actually finished writing.",
          choices: [
            {
              label: "Execute the armistice as planned — evacuate the government south, leave garrison orders to local commanders",
              advisor: { name: "Badoglio", position: "There is no coherent order ready to send, only a government that must survive to represent Italy past tonight, and that comes first, whatever it costs the units that cannot be reached in time." },
              historical: true,
              setFlags: { armisticeExecution: "evacuate" },
              impact: { manpower: -2, fuel: 0, initiative: -1 },
              next: "twoItalies43",
              outcome:
                "What happened: the King and Badoglio's government flee Rome for Allied-held Brindisi in the early hours of September 9, most of the fleet escapes to Allied ports per the armistice terms, and the army — without orders — disintegrates almost everywhere at once. Some units resist Operation Achse's disarmament attempts (the garrison on Cephalonia fights for days before its survivors are massacred after surrendering); most simply hand over their weapons; roughly 600,000 Italian soldiers are deported to Germany as forced labor in the weeks that follow. Rome itself is left essentially undefended and falls under German control within days.",
            },
            {
              label: "Delay the public announcement and attempt to concentrate scattered units around Rome first",
              advisor: { name: "Ambrosio", position: "If the announcement can be held two more days and the divisions ringing Rome pulled into a coordinated defense, the German garrison does not have the strength to walk in unopposed." },
              setFlags: { armisticeExecution: "delay" },
              favor: 1,
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "twoItalies43",
              // Hidden-information choice: whether German intelligence reads the delay as a stall
              // in time to reinforce is exactly what Ambrosio's gamble couldn't know in the room —
              // concealRoll withholds the odds until the OutcomeScreen's post-hoc reveal.
              concealRoll: true,
              uncertain: [
                {
                  weight: modWeight(40, meters.manpower),
                  title: "The delay buys a defended, if brief, stand around Rome",
                  setFlags: { romeDefenseResult: "stood" },
                  impact: { manpower: -1, fuel: 0, initiative: 1 },
                  outcome:
                    "The gamble pays off in the narrow military sense: Italian divisions around Rome, given two additional days to concentrate and coordinate, mount a genuine defense of the city's approaches before German reinforcements arrive in overwhelming strength — a stand the historical, unplanned scattering never managed. Eisenhower's own broadcast schedule cannot be held back on Rome's account for long, and the city falls within the week regardless, but not without a fight this timeline's chaos denied the historical defenders any chance to mount.",
                },
                {
                  weight: 100 - modWeight(40, meters.manpower),
                  title: "The delay is used by Berlin, not Rome",
                  setFlags: { romeDefenseResult: "worse" },
                  impact: { manpower: -2, fuel: 0, initiative: -1 },
                  outcome:
                    "The dice on this one land against the gamble: German intelligence, already suspicious of the negotiating silence, uses the extra days to reinforce the Rome garrison faster than Italian units can concentrate, and Operation Achse executes even more completely than its historical version — the delay bought nothing except two additional days under a German occupation that arrives, in the end, just as total.",
                },
              ],
            },
          ],
        };
        },
        get twoItalies43() {
          return {
          date: "SEPTEMBER – OCTOBER 1943",
          title: "Two Italies",
          historicalRecord: true,
          situation:
            "Within weeks of the armistice, Italy is no longer one country fighting one war — it is two, each claiming to be the legitimate Italian state, each commanding a fraction of the officer corps and army that existed a month earlier. German commandos free Mussolini from his mountaintop prison at Gran Sasso on September 12 and install him as head of a new Italian Social Republic — the Republic of Salò — governing the German-occupied north as a client state in every respect but name. In the south, the King and Badoglio's government, protected by Allied lines, declares war on Germany on October 13 and is recognized by the Allies as a 'co-belligerent,' a status short of full alliance but a formal break with the Axis all the same. Every officer, every unit, every remaining piece of what used to be Comando Supremo's single chain of command now has to decide, individually, which of the two Italys it answers to — and this campaign's remaining chapters follow that choice all the way to the war's end. The government in the south exists to be followed at all only because this desk recognized the King's authority over Mussolini's back in July; that choice didn't decide which Italy wins this argument, but it decided which one gets to make the case.",
          choices: [
            {
              label: "Follow the King south — recognize Badoglio's government and fight on as an Allied co-belligerent",
              advisor: { name: "Victor Emmanuel III", position: "The crown's legitimacy did not go north with the men who freed a prisoner from a mountain, but is here, with the government that broke from Berlin honestly, in the open, and answered for it." },
              historical: true,
              setFlags: { italyPath: "coBelligerent" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "salernoAvalanche43",
              outcome:
                "The choice roughly three-quarters of the surviving regular officer corps made, in fact — the constitutional monarchy's continuity, however compromised by three years of losing war and the King's own long silence about Fascism's excesses, still commanded more institutional loyalty than a republic installed by German paratroopers around a leader everyone in the room had just watched be deposed by the very system he built. What follows is a war fought as a junior partner in someone else's coalition, on Italian soil, against other Italians.",
            },
            {
              label: "Answer Mussolini's recall — serve the Italian Social Republic in the German-occupied north",
              advisor: { name: "Pavolini", position: "The King fled and the Duce did not, and whatever this republic is short on, it is not short on knowing which of the two governments stayed and fought." },
              setFlags: { italyPath: "rsi" },
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: "saloRepublic43",
              outcome:
                "The choice a real minority did make — some 25 divisions' worth of RSI military manpower over the war's remaining nineteen months, drawn from genuine Fascist conviction, from units simply caught in the north when the armistice broke, and from conscription the Republic enforced with a brutality the historical record documents in detail. This path answers to a government that is, by any honest accounting, a German client state fighting the war's final phase on the losing side of it — a fact no amount of the Republic's own propaganda ever successfully obscured from the people living under it.",
            },
          ],
        };
        },
        get salernoAvalanche43() {
          return {
          date: "SEPTEMBER 1943",
          title: "Salerno, and What the Co-Belligerent Army Actually Is",
          historicalRecord: true,
          situation:
            "Allied forces land at Salerno the same week the armistice is announced, opening the mainland invasion into a German defense that very nearly throws the landing back into the sea before reinforcement stabilizes the beachhead. What remains of the Italian regular army under Badoglio's government — the piece of the old Comando Supremo that chose the co-belligerent path over Salò when the two Italys split — is, in these first weeks, mostly a question mark to Allied planners rather than an asset — disarmed by the armistice's own chaos in many sectors, distrusted after three years as an enemy, and offered, for now, a status considerably smaller than full co-belligerent partnership: labor units, garrison duties, a first small combat formation being assembled from what didn't scatter. The choice facing what remains of Comando Supremo's southern rump is how hard to push for a larger, meaningfully combat-capable role rather than accept the auxiliary status the Allies' initial caution has assigned it.",
          choices: [
            {
              label: "Push hard for an expanded combat role — offer whatever intact formations remain for the front line",
              advisor: { name: "Ambrosio", position: "A larger role will not be won by asking politely from the rear, so put the divisions that remain in front of Allied command and let them see what is left is worth using." },
              setFlags: { coBelligerentRole: "expand" },
              favor: 1,
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "imiCrisis43",
              outcome:
                "Closer to the more ambitious end of what actually happened: an Italian Co-Belligerent Army does grow over the following months from a handful of scratch units into a force of several divisions serving alongside Allied formations, though Allied command remains cautious about committing it to the heaviest fighting for most of the campaign. Pressing the case early accelerates that trust-building process, at the cost of committing scarce, still-reorganizing formations to combat sooner than a more patient approach would.",
            },
            {
              label: "Accept the auxiliary role for now — rebuild strength and credibility gradually",
              advisor: { name: "Badoglio", position: "An army that was fighting for the other side three weeks ago does not earn a front-line role by asking for one but by being visibly, patiently reliable in whatever role it is given first." },
              historical: true,
              setFlags: { coBelligerentRole: "gradual" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "imiCrisis43",
              outcome:
                "What actually happened, largely: the Co-Belligerent Army's expansion was gradual and cautious on both sides, with Allied command slow to extend real combat trust and Rome largely accepting that caution rather than fighting it. The relationship this builds is a more durable one, but it also means the army's first opportunities to demonstrate what it can do arrive later and smaller than the more assertive approach would have produced.",
            },
          ],
        };
        },
        get imiCrisis43() {
          return {
          date: "OCTOBER – DECEMBER 1943",
          title: "Six Hundred Thousand Men Germany Won't Call Prisoners",
          historicalRecord: true,
          situation:
            "Of the roughly 600,000 Italian soldiers disarmed across Italy, the Balkans, and France in the days after the armistice and shipped to Germany, almost none are treated as prisoners of war — not because Berlin disputes that they were soldiers, but because Hitler has personally ordered otherwise. A new classification, invented for exactly this purpose, calls them 'Italian Military Internees': a status with no standing under the Geneva Convention, which means no guaranteed Red Cross inspection rights, no protected correspondence, and no legal floor under how they can be worked or fed. Most are put to forced labor in German factories, mines, and farms. The new government in Brindisi, recognized by the Allies but without real standing to negotiate with Berlin at all, has almost no leverage over any of it — the co-belligerent path chosen when the two Italys split bought Allied recognition, not a seat Berlin will hear anything from — and the question in front of Comando Supremo's diplomatic staff is not whether they can free these men, which nobody credibly believes is on the table, but whether there is anything at all worth attempting on their behalf.",
          choices: [
            {
              label: "Press the Allies to raise IMI treatment directly with Germany through neutral channels",
              advisor: { name: "Badoglio", position: "There is no seat at any table Berlin still recognizes, but there is an Allied government that does, and a moral claim on six hundred thousand men that costs nothing further to keep making, loudly, until someone with leverage listens." },
              historical: true,
              setFlags: { imiCrisis43: "press" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "monteLungo43",
              outcome:
                "Roughly what the Badoglio government actually attempted — repeated appeals routed through the Allies and neutral intermediaries, none of which Berlin had any real obligation to answer and few of which it did. The IMI status itself was never rescinded for the great majority of the men held under it; what these appeals mostly accomplished was keeping the issue visible rather than solving it, which the historical record suggests was, given the actual leverage available, close to the ceiling of what was achievable at all.",
            },
            {
              label: "Concentrate the government's limited diplomatic capital on the war effort instead — the IMI question has no near-term leverage regardless",
              advisor: { name: "Ambrosio", position: "He says it plainly though not without cost: Italy has almost nothing Berlin wants on this question, and spending what little standing it has chasing it leaves none for anything the war still requires." },
              setFlags: { imiCrisis43: "deprioritize" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "monteLungo43",
              outcome:
                "A colder accounting of a plainly weak hand — this government's actual leverage over how Germany treats the men it is holding was, in fact, close to nothing, and this choice simply says so out loud rather than spending effort on appeals unlikely to move Berlin regardless. What it does not change is what those men are living through in the meantime, which this choice does nothing to improve and does not claim to.",
            },
          ],
        };
        },
        get vaticanChannel44() {
          return {
          date: "JANUARY 1944",
          title: "What Rome's Other Government Can Still Do",
          historicalRecord: true,
          situation:
            "The Vatican, formally neutral and sitting inside German-occupied Rome, is one of vanishingly few channels still capable of reaching German-run camps at all — and even it is hobbled by the same legal invention that hobbles everyone else: the International Red Cross's inspection mandate covers prisoners of war, and Berlin's 'Military Internee' classification was constructed specifically to sit outside that mandate. What limited relief does reach the IMI camps — some food parcels, some correspondence, a handful of documented interventions on behalf of individual men — moves through informal Vatican and Red Cross channels willing to work around, rather than through, the legal gap Germany built for exactly this purpose.",
          choices: [
            {
              label: "Formally request the Vatican's intercession and back it with whatever documentation on individual cases can be gathered",
              advisor: { name: "Badoglio", position: "The Holy See can open doors this government cannot, and he would rather hand it every name and camp location the intelligence service can still produce than assume the request alone is enough." },
              historical: true,
              setFlags: { vaticanChannel44: "request" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "imiOutcome44",
              outcome:
                "Close to the documented pattern: Vatican channels, operating from inside German-occupied Rome, did manage some informal relief work on individual internees' behalf — outside any recognized inspection mandate, since Germany's 'Military Internee' classification was constructed specifically to keep the International Red Cross's normal prisoner-of-war access rights from ever applying. What that channel could not do, however hard it worked, is change the underlying legal status keeping roughly six hundred thousand men outside Geneva's protection — that status was a deliberate German policy choice, and no amount of Vatican diplomacy was ever positioned to reverse a decision Berlin had no intention of revisiting.",
            },
            {
              label: "Rely on informal contacts rather than a formal request that German authorities might read as provocation",
              advisor: { name: "Ambrosio", position: "A formal request through Vatican channels is also a public one, and it is doubtful a public request improves conditions for men Berlin has already decided sit outside every protection that would normally apply." },
              setFlags: { vaticanChannel44: "informal" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "imiOutcome44",
              outcome:
                "A quieter approach avoids handing German authorities a public grievance to react against, at the cost of the modest additional pressure a formal request might have applied — in practice, a difference more of method than of outcome, since informal Vatican channels were, by most accounts, already operating near the limits of what Berlin's own policy allowed regardless of how loudly Rome asked.",
            },
          ],
        };
        },
        get imiOutcome44() {
          return {
          date: "SPRING 1944",
          title: "What Six Hundred Thousand Men Were Actually Offered",
          historicalRecord: true,
          situation:
            "Germany's own answer to the IMI question, when one finally comes, is not clemency — it is an offer. Men willing to renounce their internee status and either join the Republic of Salò's rebuilding military or 'volunteer' for German war industry as free civilian labor are promised better food, better pay, and an end to the legal limbo built specifically to deny them those things in the first place. A significant majority — the documented estimate runs above eighty percent — refuse, choosing to remain classified as internees under objectively worse material conditions rather than put on a German or RSI uniform, or its civilian-labor equivalent, in exchange for relief the Reich itself is dangling as leverage rather than offering unconditionally.",
          choices: [
            {
              label: "Publicly honor the men who refused the offer, regardless of the cost that refusal is still costing them",
              advisor: { name: "Badoglio", position: "Six hundred thousand men were offered an easier war in exchange for the uniform they were asked not to wear, and the overwhelming majority said no without anyone able to promise them anything for it, and that refusal deserves to be named, whatever else this government can do about their conditions." },
              historical: true,
              setFlags: { imiOutcome44: "honor" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "monteCassino44",
              outcome:
                "What the postwar Italian state did eventually do, if considerably later than this choice attempts it: formal recognition of the IMIs' collective refusal as a quiet, widely distributed act of resistance — men with no weapons, no chain of command, and no promise of rescue choosing worse material conditions over collaboration, roughly eight times out of ten, entirely on their own judgment. The men still in the camps themselves see none of the practical benefit of that recognition before the war actually ends.",
            },
            {
              label: "Keep the government's public messaging focused on the war effort rather than a story it cannot yet resolve",
              advisor: { name: "Ambrosio", position: "A government that publicizes a hardship it is powerless to end risks looking like it trades on other men's suffering for its own legitimacy, and he would rather stay quiet until there is something concrete to say." },
              setFlags: { imiOutcome44: "quiet" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "monteCassino44",
              outcome:
                "A more cautious read of the same facts — the refusal happened regardless of whether Rome publicized it, and staying quiet costs the men who made that choice a measure of the recognition the more vocal path offers, without changing anything material about the camps they are refusing to leave under better terms.",
            },
          ],
        };
        },
        get monteCassino44() {
          return {
          date: "JANUARY – MAY 1944",
          title: "The Gustav Line",
          historicalRecord: true,
          situation:
            "The Allied advance up the peninsula has stalled for months against the Gustav Line's anchor position at Monte Cassino, a medieval abbey on commanding high ground that four successive Allied offensives — American, British, New Zealand and Indian, Polish — will eventually need to break, at a combined cost that will run past 50,000 Allied casualties before the position finally falls in May. The Co-Belligerent Army's own combat formations, still small and still building the trust Salerno's aftermath left an open question, are offered a role in the supporting operations around the main assault rather than the abbey assault itself — a decision partly about combat readiness and partly, still, about how much Allied command trusts a very recently former enemy with a battle this costly." +
            (flags.monteLungo43 === "attack"
              ? " The Group that went up Monte Lungo twice in December, failing the first time and not the second, is the one being offered the supporting role."
              : flags.monteLungoResult === "prepared"
              ? " The Group that took Monte Lungo in December on its second attempt, with a week's rehearsal behind it, is the one being offered the supporting role."
              : flags.monteLungoResult === "sidelined"
              ? " The Group that was put in reserve at Monte Lungo in December, and has been trying to earn its place back since, is being offered the supporting role."
              : flags.monteLungo43 === "decline"
              ? " The Group that was kept out of Monte Lungo in December has not yet fought a German in a prepared position, which is why a supporting role is what it is offered."
              : ""),
          choices: [
            {
              label: "Accept the supporting role and use it to build a combat record methodically",
              advisor: { name: "Ambrosio", position: "A supporting role executed well is still a combat record, and the abbey assault itself is not needed to prove this army can be relied on, only reliability in whatever role it is given." },
              historical: true,
              setFlags: { cassino44: "support" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "romeLiberation44",
              outcome:
                "Roughly what happened: Italian Co-Belligerent formations serve in supporting and flank operations around the Gustav Line's collapse rather than in the abbey assault's main effort, a role that costs fewer casualties than the direct assaults absorbed but also builds trust more slowly than a larger role would have. By the time Rome falls, the army's combat record is real but modest — the kind of foundation later, larger commitments in the northern campaign can be built on rather than a dramatic single moment that changes Allied minds outright.",
            },
            {
              label: "Push for direct participation in the main assault, whatever the cost, to force the trust question",
              advisor: { name: "Utili", position: "The Poles who finally take that hill will be remembered for it for a hundred years, and he would rather this army earn a share of that record now than a safer, smaller one nobody remembers by name." },
              checkLabel: "Manpower",
              disabledReason: meters.manpower <= -3 ? "too few reserves left in the Co-Belligerent Army's ranks to commit to an assault this costly" : undefined,
              setFlags: { cassino44: "direct" },
              impact: { manpower: -2, fuel: 0, initiative: 1 },
              next: "romeLiberation44",
              // Key Battle Subgame, battle #5 (round 15). Same unconditional-add pattern as
              // Kursk (uncertain[] already existed on this choice before the subgame, so
              // keyBattleSubgame is added directly rather than spread behind
              // KEY_BATTLE_SUBGAME_ENABLED — shipped builds never read keyBattleSubgame at all,
              // and check-battle-balance.js/check-reachability.js both evaluate with the flag
              // false, so the shipped graph is unaffected either way).
              //
              // Bespoke categories, not the default Divisions/Armour/Air/Supply set the other
              // land battles reuse: the actual Co-Belligerent combat action this choice's own
              // text describes ("the abbey assault's main effort") was never realistic at this
              // army's size, and what it fought instead — the Battle of Monte Marrone, 31 March
              // - 28 April 1944, the actual engagement that "forces the trust question" this
              // choice is about — was a mountain infantry action with no Italian armor in it at
              // all. Forcing tanks into an order of battle that didn't have them would be
              // inventing a unit, not modeling one, so this uses the real four arms instead. All
              // facts verified 2026-09-25 (Wikipedia: Battle of Monte Marrone, Italian
              // Co-belligerent Army): Piemonte Alpine Battalion took the 1,805m peak by night
              // surprise attack on 31 March; German counterattacks came on 2 April (an
              // exploratory push stopped 800m out), 3 April (a strong dawn attack repelled by
              // fire and mines), and 10 April (three Gebirgsjäger — German mountain — battalions,
              // one of which broke in for hand-to-hand trench fighting before Italian
              // reinforcements and artillery sealed it off); the force numbered 4,933 Italians
              // against roughly 3,000 Germans, with Anglo-Polish artillery attached; the
              // advance reached Picinisco on 28 April. General Vincenzo Dapino commanded the 1st
              // Motorized Group (the CIL's own predecessor formation — it wasn't reorganized and
              // renamed the Corpo Italiano di Liberazione under Utili until 18 April, after most
              // of this specific fighting) — which is why Dapino, not Utili, is this subgame's
              // one commander pick.
              concealRoll: true,
              keyBattleSubgame: {
                id: "monteCassino44",
                title: "Order of Battle — Monte Marrone",
                flavor:
                  "Not the abbey — this army's own share of the Cassino winter is a mountain fifteen miles east of it, 1,805 meters up in the Mainarde range, held by German troops who don't yet know an attack is coming. Taking it by surprise, at night, on foot, is the plan; holding it against whatever comes up the mountain afterward, with Anglo-Polish guns as the only support that can actually reach this ground, is the part that will decide whether anyone outside this army's own ranks remembers it did either. What's decided here is how much of the assault force leads the climb, how much of the elite Nembo paratroop element goes in beside it, what the attached artillery is asked to range in on, and how much gets held back on the mule trails that are this mountain's only supply line.",
                categories: [
                  { id: "assault", name: "Alpine & Bersaglieri Assault", meter: "manpower" },
                  { id: "paratroops", name: "Nembo Paratroops", meter: "manpower" },
                  { id: "artillery", name: "Anglo-Polish Artillery", meter: "fuel", strand: "ammo" },
                  { id: "supply", name: "Mule-Train Supply", meter: "fuel", strand: "ship" },
                ],
                // Paratroops highest (a small, elite, all-volunteer force); assault second
                // (Piemonte + the two Bersaglieri battalions, the numerical bulk of the force);
                // artillery third (real, but it's attached support, not this army's own guns);
                // supply lowest, deliberately — a mule trail up a 1,805m mountain is this
                // battle's own well-documented logistics ceiling, the same design choice as
                // Kursk's mud or Alam Halfa's fuel arithmetic.
                effectiveness: { assault: 2.2, paratroops: 2.6, artillery: 2.0, supply: 1.6 },
                orderOfBattle: {
                  assault: {
                    units: [
                      "The Piemonte Alpine Battalion and two Bersaglieri battalions of the 1st Motorized Group",
                      "About 4,933 Italians against roughly 3,000 Germans",
                    ],
                    real: "The Piemonte battalion took the 1,805-metre peak by a night surprise attack on 31 March 1944.",
                  },
                  paratroops: {
                    units: [
                      "The Nembo paratroopers, the 185th's Arditi paratroop element",
                    ],
                    real: "German counterattacks came on 2 April, 3 April and 10 April. On the 10th three Gebirgsjäger battalions broke in for hand-to-hand fighting before Italian reinforcements and artillery sealed it off.",
                  },
                  artillery: {
                    units: [
                      "The Anglo-Polish artillery attached to the Italian force",
                    ],
                    real: "The attached artillery helped seal off the German break-in of 10 April.",
                  },
                  supply: {
                    units: [
                      "Mule trains up the mountain's trails: no road reached the peak",
                    ],
                    real: "The advance reached Picinisco on 28 April.",
                  },
                },
                // Round 23: orders from above in the campaign's hard mode (modeled, not documented).
                hardRule: { text: "The Allied command orders the artillery fire plan registered first, as it does for every attack in its sector.", lockApproach: "gunsForward" },
                // Round 22. The cold and altitude are real (this battle's own notes: a 1,805 m peak held through
                // German counterattacks on 2, 3 and 10 April); the attrition rule charges them to a heavy assault.
                conditions: "Snow and bitter cold above 1,800 meters, with no road, only mule trails, against German mountain troops who know the ground.",
                attrition: [
                  { category: "assault", atLeast: 3, meter: "manpower", delta: -1, reason: "Exposure on the peak" },
                ],
                decisions: [
                  {
                    id: "holdTheSummit",
                    time: "1230",
                    title: "The summit under counterattack",
                    prompt: "German mountain troops are forming up below the peak. The position taken by night is exposed on its forward slope, and the reverse slope is steep and open to the cold. The commander has to decide how the line meets what is coming.",
                    options: [
                      {
                        id: "holdSummit",
                        name: "Hold the summit where it stands",
                        note: "Keeps the ground, and keeps every man exposed on it.",
                        bonus: 0,
                        bonusByPosture: {thinInitialLine: 2, gebirgsjagerReserve: -3},
                        reportLine: "The line holds the summit where it is, with every man on the forward slope.",
                      },
                      {
                        id: "reverseSlope",
                        name: "Pull back to the reverse slope and let the guns work",
                        note: "The Anglo-Polish guns can range the summit, if the men are off it.",
                        bonus: 0,
                        bonusByPosture: {gebirgsjagerReserve: 4, thinInitialLine: -2, highAltitudeCold: 2},
                        reportLine: "The line falls back behind the crest, and the attached guns range on the summit it left.",
                      },
                      {
                        id: "counterAtOnce",
                        name: "Counterattack before the Germans finish forming up",
                        note: "Costs men, and may catch them off balance.",
                        bonus: 0,
                        bonusByPosture: {thinInitialLine: 4, gebirgsjagerReserve: -2, highAltitudeCold: -2},
                        meters: {manpower: -1},
                        costReason: "A counterattack made on the exposed slope",
                        reportLine: "The Italians go down at the Germans before they have formed up, in the snow.",
                      },
                    ],
                  },
                ],
                categoryContext: {
                  assault:
                    "The Piemonte battalion and both Bersaglieri battalions form the assault force — roughly five thousand men against perhaps three thousand Germans dug in on the peak. Dapino notes that surprise and night attack favor the numbers more than daylight calculations suggest.",
                  paratroops:
                    "The 185th's Arditi paratroopers are smaller in number but the most aggressive troops in the force. Placed beside the assault battalions instead of held in reserve, they're the difference between taking a position and taking it quickly.",
                  artillery:
                    "The Anglo-Polish guns are the only heavy support this force brings with it. Everything else is carried up the mountain on foot. Ranged in ahead of time, they're what stops a German counterattack before it reaches the line.",
                  supply:
                    "There is no road to that peak — only mule trails. Every round and ration this force uses has to go up them. What isn't stockpiled before the attack becomes a shortage discovered during it.",
                },
                flashups: {
                  assault: [
                    "The Piemonte battalion moves up the last stretch of trail in silence.",
                    "A Bersaglieri company reaches the ridge line ahead of schedule.",
                    "Rifle fire opens somewhere along the peak's northern shoulder.",
                    "A forward platoon signals the summit position is in Italian hands.",
                    "The assault line digs in on ground it didn't hold an hour ago.",
                  ],
                  paratroops: [
                    "The Nembo company moves ahead of the main line, quiet, looking for the gap.",
                    "A paratroop section clears a forward outpost before it can raise the alarm.",
                    "The Arditi element pushes past the first line rather than stopping to consolidate it.",
                    "A Nembo patrol reports the ground ahead clear, for now.",
                    "The paratroop company holds the most exposed stretch of the new line.",
                  ],
                  artillery: [
                    "The Anglo-Polish battery fires a ranging round onto the approach the maps say the Germans would use.",
                    "A fire mission breaks up a German column before it reaches the line.",
                    "The guns fall silent for an hour, waiting on a target worth the ammunition.",
                    "Observers on the peak correct a battery's fire onto a reported assembly area.",
                    "A German patrol turns back under artillery fire well short of the line.",
                  ],
                  supply: [
                    "A mule train switchbacks up the trail with the next load of ammunition.",
                    "A supply party reports the trail iced over on the mountain's shaded face.",
                    "Rations are split smaller to stretch what's already up the mountain.",
                    "A mule goes down on the trail and its load is redistributed by hand.",
                    "The forward dressing station reports it's short of morphine again.",
                  ],
                },
                reportTimes: { open: "2200", contact: "0130", cats: ["0230", "0500", "0800", "1100"], reserve: "1400", counter: "1600" },
                idleLines: {
                  assault: [
                    "The assault battalions stay on the start line. Nobody is climbing yet.",
                    "No infantry moves up the trail. The peak stays exactly whose it already was.",
                  ],
                  paratroops: [
                    "The Nembo company stays in reserve, unused. Whatever's ahead, the line finds it alone.",
                    "No paratroop element goes forward. The assault has nothing screening its point.",
                  ],
                  artillery: [
                    "The guns stay laid on their registered points, unfired. Nothing is asked of them yet.",
                    "No fire mission goes up. Whatever the line runs into, it runs into without support.",
                  ],
                  supply: [
                    "Nothing extra goes up the mule trail before the attack. The force carries what it already has.",
                    "The forward dump stays where it is, untouched, at the bottom of the mountain.",
                  ],
                },
                verdicts: ["Monte Marrone Falls by Surprise", "The Peak Costs More Than It's Worth"],
                verdictGrades: {
                  clean: "Every arm moved together, and the peak fell before its garrison could make the fight even.",
                  costly: "The peak falls — but holding it after cost more than the plan allowed for.",
                  marginal: "The assault stalls short of the summit. The plan held together; the mountain didn't give it up.",
                  total: "The assault doesn't stall so much as come apart on the mountain's own ground.",
                },
                counterattack: {
                  category: "assault",
                  severity: { gebirgsjagerReserve: 2, thinInitialLine: 1, highAltitudeCold: 1 },
                  warn: {
                    1: "German mountain troops are probing the new line's flank.",
                    2: "German Gebirgsjäger — mountain specialists, not the garrison troops expected — are massing for a real counterattack on the line.",
                  },
                  results: {
                    repulsed: "The Gebirgsjäger attack is thrown back and the line holds without giving an inch.",
                    heldAtCost: "The line holds, and the company that held it is badly cut up doing it.",
                    broke: "The Gebirgsjäger break into the line and it comes to hand-to-hand fighting in the trenches.",
                    gaveGround: "The line falls back off the most exposed ground rather than fight the counterattack out where it lands.",
                  },
                },
              },
              uncertain: [
                {
                  weight: modWeight(45, meters.initiative),
                  title: "The gambit lands — the record this army wanted is a record it gets",
                  setFlags: { cassinoDirectResult: "recognized" },
                  favor: 1,
                  impact: { manpower: -2, fuel: 0, initiative: 1 },
                  outcome:
                    "The riskier bet pays off close to what Utili was arguing for: Monte Marrone falls by surprise at night, holds against the Gebirgsjäger counterattack that follows, and produces a faster, more visible answer to the trust question Salerno's aftermath left open, at a casualty cost the still-rebuilding Co-Belligerent Army feels but survives. The historical fourth and final assault on the abbey itself fell to Polish forces specifically, at a cost their own government spent decades ensuring was remembered; here, a documented Italian victory next door earns enough of a share of that same recognition to matter to how Allied command treats this army afterward.",
                },
                {
                  weight: 100 - modWeight(45, meters.initiative),
                  title: "The cost lands; the recognition mostly doesn't",
                  setFlags: { cassinoDirectResult: "unrecognized" },
                  impact: { manpower: -3, fuel: 0, initiative: 0 },
                  outcome:
                    "The casualties this gambit risked arrive in full, and the trust question it was meant to force stays open regardless: a mountain taken and held at real cost, fifteen miles from a battle already being fought by Polish, British, American, Indian, and New Zealand formations at a scale hard to distinguish from the outside, doesn't reach the ears it needed to reach — the discrete, rememberable moment Utili was actually betting on.",
                },
              ],
            },
          ],
        };
        },
        get romeLiberation44() {
          return {
          date: "JUNE 1944",
          title: "Rome, Open and Then Free",
          historicalRecord: true,
          situation:
            "Rome falls to advancing Allied forces on June 4, 1944, two days before Overlord's landings in Normandy make the moment a footnote in most of the world's newspapers within seventy-two hours — a piece of timing that has genuinely irritated Clark's Fifth Army command, whose costly Anzio and Gustav Line campaigns to reach the capital are about to be overshadowed almost entirely by an invasion elsewhere. For the government now moving north from Brindisi to reoccupy the capital — the same institutional line that dates back to a Comando Supremo choosing the King's authority over Mussolini's, nearly a year ago — the question is less about the military moment than the political one: what kind of state gets reconstituted in the city the war has just returned to Italian civil administration." +
            (flags.cassino44 === "direct" ? (flags.cassinoDirectResult === "recognized" ? " The army marching in with this government spent the Gustav Line proving a point at the abbey's foothills — and this time, the point landed." : " The army marching in with this government spent the Gustav Line proving a point at the abbey's foothills that mostly went unnoticed.") : " The army marching in with this government built its Gustav Line record the patient way, in the supporting line rather than the headline assault.") +
            // Round 15 (battle #5 echo): Monte Marrone's own detail, not a fork — the recognized/
            // unrecognized split above already carries the branch this node's text turns on.
            (flags.cassino44 === "direct" ? keyBattleEcho("monteCassino44", flags) : ""),
          choices: [
            {
              label: "Move quickly to a broader, more representative government beyond the monarchy's own circle",
              advisor: { name: "Badoglio", position: "He has been a wartime administrator and not a peacetime government, and Rome deserves a government that the resistance parties who fought the Germans in the city itself can recognize as theirs." },
              historical: true,
              setFlags: { romeGovernment: "broaden" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "adriaticRoad44",
              outcome:
                "What actually happened: Badoglio resigns as prime minister within days of Rome's liberation, and a new government under Ivanoe Bonomi, drawing on the anti-Fascist parties that organized the Committee of National Liberation, takes office — a genuine broadening of the government's political base beyond the monarchy's own wartime circle, and a step that helps establish the political legitimacy the eventual postwar republic will build on.",
            },
            {
              label: "Maintain continuity under the existing wartime government rather than reorganize during an active campaign",
              advisor: { name: "Victor Emmanuel III", position: "There will be time to rebuild the government's politics once the Germans are out of Italy entirely, and he would rather not change commanders in the middle of the only battle that matters now." },
              setFlags: { romeGovernment: "maintain" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "adriaticRoad44",
              outcome:
                "Continuity keeps the wartime administrative machinery running without the disruption a government reorganization brings during an active campaign — at the cost of a broader political legitimacy question left unresolved for longer, one the eventual peace and the 1946 referendum on the monarchy's own future will still have to answer regardless of how long this path defers it.",
            },
          ],
        };
        },
        get clnLiaison44() {
          return {
          date: "JULY 1944",
          title: "The War the South Can Only Fund, Not Fight",
          historicalRecord: true,
          situation:
            "North of the Gothic Line, the Committee of National Liberation for Northern Italy — CLNAI, drawing together Communist, Socialist, Catholic, Liberal, and Action Party resistance formations that agree on almost nothing except opposing the German occupation and the Salò Republic both — has grown from scattered bands into a genuine irregular army tying down German and RSI garrison forces across the mountains and industrial cities alike. What the government now reconstituted in Rome can offer this movement is not soldiers — the Gothic Line stalemate has none to spare crossing it — but money, arms shipments run by clandestine channels, and formal political recognition of a resistance the south had no hand in organizing and only limited ability to actually direct.",
          choices: [
            {
              label: "Commit arms shipments and gold to the CLNAI, whatever the front-line resources it costs",
              advisor: { name: "Ambrosio", position: "Every rifle that reaches the mountains north of this line pins down a German soldier who is not facing the Allied advance this week, and that trade is worth making even at real cost to the little matériel that can be spared." },
              historical: true,
              checkLabel: "Matériel",
              disabledReason: (meters.fuel || 0) >= 1 && (meters.manpower || 0) >= 0 ? undefined : "insufficient matériel left to arm and supply partisan formations across an active front line",
              setFlags: { clnLiaison44: "arm" },
              impact: { manpower: 0, fuel: -1, initiative: 1 },
              next: "gothicLine44",
              outcome:
                "Closer to the more assertive end of what Allied and Italian channels actually managed through 1944 — clandestine arms drops and gold shipments did reach CLNAI formations in meaningful, if never sufficient, quantities, a material commitment that helped the northern resistance grow into the force that would eventually help liberate Milan and Turin largely on its own initiative in April 1945.",
            },
            {
              label: "Offer political recognition without significant material commitment — the front line's own supply needs come first",
              advisor: { name: "Badoglio", position: "He does not doubt what the partisans are accomplishing, but doubts this government's standing to spend scarce matériel on a front it cannot see or coordinate while the front it can see still needs everything." },
              favor: 1,
              setFlags: { clnLiaison44: "recognize" },
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "gothicLine44",
              outcome:
                "A more conservative accounting of a thin supply picture — formal recognition costs the government nothing it doesn't already have to give, while material support is left mostly to Allied channels operating independently of Rome's own priorities. The CLNAI grows and fights regardless, largely on its own organizational strength, with or without this government's own gold behind it.",
            },
          ],
        };
        },
        get gothicLine44() {
          return {
          date: "AUGUST – DECEMBER 1944",
          title: "The Gothic Line",
          historicalRecord: true,
          situation:
            "Kesselring's last major defensive position in Italy runs along the northern Apennines, and the Allied offensive against it through the autumn of 1944 — resourced well below what an earlier, faster campaign might have had, since divisions and landing craft have been steadily withdrawn for the southern France landings and other theaters judged higher priority — grinds to a halt short of the Po valley as winter closes the mountain passes. The Co-Belligerent Army, considerably larger and more combat-proven than it was at Salerno fourteen months earlier, is offered a genuine front-line sector for the first time — the campaign's clearest test yet of whether the trust-building since 1943 has actually produced a force Allied command is willing to rely on rather than merely tolerate.",
          choices: [
            {
              label: "Commit the Co-Belligerent Army's combat groups to the main Gothic Line offensive in full",
              advisor: { name: "Utili", position: "This is the sector where the answer to what this army is gets written down and not argued about, so commit everything that can fight." },
              historical: true,
              setFlags: { gothicLine44: "commit" },
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "combatGroups44",
              outcome:
                "The fuller commitment this path represents mirrors the actual expansion of Italian combat groups into the Gothic Line fighting through late 1944 — formations that by the campaign's final phase are integrated into Allied corps structure as genuine front-line units rather than auxiliary support. The offensive still stalls for the winter regardless of how committed any single army's sector is, since the halt is a resourcing and weather problem the whole Allied front shares, not a question any one formation's effort could individually solve.",
            },
            {
              label: "Commit more cautiously — preserve the army's strength for the final spring offensive rather than the winter grind",
              advisor: { name: "Ambrosio", position: "The line will stall for the winter regardless of what any single division does, and he would rather have this army intact and rested for spring than spent proving a point in a season everyone expects to end in stalemate." },
              setFlags: { gothicLine44: "conserve" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "combatGroups44",
              outcome:
                "A more conservative commitment through the winter's stalemate preserves the Co-Belligerent Army's strength for the spring 1945 offensive that will finally break the Gothic Line and end the Italian campaign — at the cost of a slightly less complete combat record built up through 1944's fighting, a trade between what this army demonstrably did and what it demonstrably still has left when the decisive push finally comes.",
            },
          ],
        };
        },
        // Round 24 (Craig: "the Italian campaign should be expanded to fight the Germans if you choose that
        // path"). The co-belligerent path had one battle and a great deal of diplomacy, and the army that
        // fought the Germans from October 1943 had almost no decisions of its own. monteLungo43,
        // adriaticRoad44, combatGroups44, partisanWinter44, groupsCommand45 and springOffensive45 put its
        // own war on the page, in order, and what is chosen in them is read later (the odds of the spring
        // offensive, the ending). Facts checked 2026-10-06 against Wikipedia (Italian Co-belligerent Army,
        // Italian Liberation Corps, Battle of Ancona, Battle of Montecarotto, 184th Infantry Division
        // "Nembo", Umberto Utili, Giovanni Messe, Raffaele Cadorna, Spring 1945 offensive in Italy,
        // Motorized Brigade "Cremona", 15th Panzergrenadier Division) and liberationroute.com for Monte
        // Lungo's first attack (47 dead, 102 wounded; written here as "about fifty dead and more than a
        // hundred wounded", since Italian sources give higher figures). The Rome Protocols and Alexander's
        // proclamation are from the National WWII Museum timeline and the CLNAI article.
        get monteLungo43() {
          return {
          date: "DECEMBER 1943",
          title: "The First Italian Attack",
          historicalRecord: true,
          situation:
            "Eight weeks after the declaration of war on Germany, the Co-Belligerent Army has one formation it can put in the line: the 1st Motorized Group, about 5,000 men under General Dapino, built around the 67th Infantry Regiment, a battalion of Bersaglieri cadets and the 11th Artillery Regiment, and put together in Puglia that autumn from what survived the armistice. General Clark's Fifth Army is working up the Mignano gap toward the Gustav Line through the German Bernhardt Line, whose anchors are the hills of Monte Lungo and Monte Sammucro, held by the 15th Panzergrenadier Division. II Corps offers the Group a place in its attack on Monte Lungo on December 8, in the morning mist, beside American infantry. For Brindisi it is the first chance to show the Allies, and the Italian army itself, that a unit that wore the other uniform in September will fight in this one. The Group has not trained with the guns that will support it, and none of its men has seen a German prepared position." +
            (flags.coBelligerentRole === "expand"
              ? " The larger combat role pressed for after Salerno is being tested here, on the first hill it is offered."
              : " The auxiliary role accepted after Salerno has bought the Group a quiet autumn, and the first hill it is offered is not a quiet one."),
          choices: [
            {
              label: "Accept the American plan — attack on December 8, in the morning mist, beside II Corps",
              advisor: { name: "Messe", position: "An army that is never seen fighting is never equipped to fight, and the Group goes in on the day it is asked to, with the guns it is given." },
              historical: true,
              setFlags: { monteLungo43: "attack" },
              impact: { manpower: -2, fuel: 0, initiative: 1 },
              next: "vaticanChannel44",
              outcome:
                "What happened. On December 8 the Group went up Monte Lungo beside American infantry under the morning mist. When the mist lifted the Italians were on open slopes under fire from German positions the hurried plan had not found, and the attack failed, with about fifty dead and more than a hundred wounded. It was the first action of the Royal Army on the Allied side. It was repeated on December 16 with a heavy artillery preparation and American infantry beside it, and this time the hill was taken. General Clark wrote to congratulate the Group on its determination to free Italy from German domination: the Allies had watched the Italian army fight twice, and win the second time.",
            },
            {
              label: "Ask II Corps for another week — rehearse the attack with the guns and the American infantry that will support it",
              advisor: { name: "Dapino", position: "A group that has been together a few weeks knows neither the guns beside it nor the hill in front of it, and a week to learn both is cheaper than the first attack." },
              setFlags: { monteLungo43: "delay" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "vaticanChannel44",
              concealRoll: true,
              uncertain: [
                {
                  weight: modWeight(60, meters.initiative),
                  title: "II Corps gives the week",
                  setFlags: { monteLungoResult: "prepared" },
                  impact: { manpower: -1, fuel: 0, initiative: 1 },
                  outcome:
                    "Speculative. Clark's staff agrees, and the Group spends a week in the valley rehearsing with the guns that will fire for it and the American infantry that will go up beside it. It attacks on December 16 with a full artillery preparation, as the real second attack did, and takes the hill without having paid for the first. The Italian army's first battle against the Germans is won with fewer dead than the real one cost it. What is lost is the story the Allies remembered: a Group that failed on the 8th and went back up on the 16th.",
                },
                {
                  weight: 100 - modWeight(60, meters.initiative),
                  title: "II Corps will not wait",
                  setFlags: { monteLungoResult: "sidelined" },
                  impact: { manpower: 0, fuel: 0, initiative: -1 },
                  outcome:
                    "Speculative. The offensive has a timetable, and the Americans cannot hold an assault on a mountain for a week for a Group that has not yet fought. The Group is dropped from the attack of the 8th and put in reserve, takes part in the second attack only on the margin, and comes out of the battle with the status Allied planners had already given it: an Italian unit that is not yet ready. Asking for a week to prepare for a battle that was already being fought is remembered at II Corps longer than the week would have been.",
                },
              ],
            },
            {
              label: "Keep the Group out of the line until it is trained and equipped as a division",
              advisor: { name: "Ambrosio", position: "An army that has not fought can still be presumed reliable, while one that fails its first battle before an Allied audience cannot, so it is kept for a battle it can win." },
              setFlags: { monteLungo43: "decline" },
              impact: { manpower: 1, fuel: 0, initiative: -2 },
              next: "vaticanChannel44",
              outcome:
                "Speculative. The Group stays in the rear, drilling and guarding the lines of communication, and the Americans take Monte Lungo without it in the second half of December. No Italian blood is spilt on the hill and no Italian flag is planted on it. The army's first test is put off to the spring, and the Allied staff officers who had wondered whether the Italians would fight at all go on wondering, with more evidence.",
            },
          ],
        };
        },
        get adriaticRoad44() {
          return {
          date: "JUNE – JULY 1944",
          title: "The Adriatic Road",
          historicalRecord: true,
          situation:
            "From the middle of June the Eighth Army's weight is on the Adriatic side, and its objective is Ancona, a seaport closer to the fighting that will shorten supply lines which still run back to Pescara and Anzio. The task is given to General Anders's Polish II Corps, about 50,000 men, and under its command since May 27 is the Italian Liberation Corps that Utili has led since April: the old 1st Motorized Group, now some 16,000 men, joined on May 26 by the paratroopers of the Nembo Division from Sardinia, about 6,000 more. The Germans, elements of the 71st Infantry Division and the 1st Parachute Division among them, are falling back by stages toward the Gothic Line, and the hill town of Filottrano, inland from Ancona, commands the road. What Comando Supremo has to settle is what part its best formation should play in a battle whose command, language and supplies are all someone else's." +
            (flags.monteLungoResult === "prepared"
              ? " The Group that took Monte Lungo on its second attempt and lost fewer men doing it has been believed since, and the Polish staff know the name."
              : flags.monteLungoResult === "sidelined"
              ? " The Group that was put in reserve at Monte Lungo has had to earn its place twice since then, and the Poles have been told so."
              : flags.monteLungo43 === "attack"
              ? " The Group's veterans have been up Monte Lungo twice, once failing and once not, and the Poles have heard both halves of that."
              : flags.monteLungo43 === "decline"
              ? " The Group kept out of Monte Lungo has still not fought a German in a prepared position, and everyone in the Polish corps staff has noticed."
              : "") +
            (flags.cassino44 === "direct"
              ? " The corps also carries Monte Marrone, which the Eighth Army has not forgotten."
              : ""),
          choices: [
            {
              label: "Let the Nembo lead the hill fighting — Filottrano, with the Polish armour behind them",
              advisor: { name: "Utili", position: "The paratroopers were made for this ground, and a corps that leads at Ancona is a corps that is asked to lead afterwards." },
              historical: true,
              setFlags: { adriaticRoad44: "lead" },
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "clnLiaison44",
              uncertain: [
                {
                  weight: Math.min(90, modWeight(72, meters.initiative)),
                  title: "Filottrano falls to the Nembo",
                  setFlags: { adriaticResult44: "taken" },
                  impact: { manpower: -1, fuel: 0, initiative: 1 },
                  outcome:
                    "What happened. The Nembo's paratroopers fought for Filottrano through the first days of July and the town was liberated on July 9, opening the road to Ancona; two of the division's regiments were decorated for it. The Poles entered Ancona on July 18 at half past two in the afternoon, and the Eighth Army had its port. Allied losses across the whole battle, which began on June 16, were about 500 killed, 1,800 wounded and 140 missing, against some 800 Germans killed and 2,500 taken. The Italian Liberation Corps came out of Ancona with a battle honour of its own, won on ground that was never going to be easy for anyone.",
                },
                {
                  weight: 100 - Math.min(90, modWeight(72, meters.initiative)),
                  title: "The first assault is thrown back",
                  setFlags: { adriaticResult44: "stopped" },
                  impact: { manpower: -2, fuel: 0, initiative: 0 },
                  outcome:
                    "Speculative. The first assault on Filottrano is stopped on the olive terraces at the edge of the town by paratroopers who are as good as the Italians are and have the better ground, and the Polish armour and guns have to be brought up before the place falls, some days later than the Polish plan had allowed. The Nembo's casualties are heavy, and the Polish staff, who had been told the Italians were the best formation on the Adriatic side, note in their reports that the paratroopers are brave and are not yet a corps.",
                },
              ],
            },
            {
              label: "Keep the Corps on the flank — screening and follow-up under the Poles, while their tanks and guns take the town",
              advisor: { name: "Messe", position: "The Corps is the one real formation the army has, and he would rather see it screen a flank than be spent on a hilltop that Polish guns can take." },
              setFlags: { adriaticRoad44: "flank" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "clnLiaison44",
              outcome:
                "Speculative. The Poles take Filottrano with their own armour and artillery, a day or two later than they might have with the Italian paratroopers in front, and Ancona falls on July 18 as it did. The Corps screens the flank and moves up behind the advance, losing few men and earning few lines in the communiqués. It comes out of the Adriatic summer intact, and as what it already was: a formation the Allies have used where it was convenient, and not yet one they have asked for.",
            },
          ],
        };
        },
        get combatGroups44() {
          return {
          date: "SEPTEMBER – NOVEMBER 1944",
          title: "Six Groups, and Everyone Else",
          historicalRecord: true,
          situation:
            "On September 24 the Italian Liberation Corps is disbanded, and its men are used to raise the first of the Combat Groups. The Allied offer is specific. The Italian General Staff may set up two Groups at once, named for the Cremona and Friuli divisions, and four more a few weeks later: Folgore, Legnano, Piceno and Mantova. Each will have some 9,000 men, in British battledress and with British weapons — 116 field guns, 170 mortars, over 500 light machine guns, nearly 1,300 vehicles — and will be attached to an Allied corps. Every other Italian formation south of the front, between 150,000 and 190,000 men, stays as auxiliary troops: labour, guards, supply, the men who keep the Allied armies moving. The case for a larger army is the obvious one: an army of six divisions is a token army, in a war the Italian army has spent a year trying to enter. The British position is that there is no equipment for more, and that Italian formations must prove themselves before they get it." +
            (flags.adriaticRoad44 === "lead" && flags.adriaticResult44 === "taken"
              ? " The Corps that has just been broken up to make the first Groups is the one that took Filottrano, and no one at Allied headquarters needs to be reminded of it."
              : flags.adriaticRoad44 === "lead"
              ? " The Corps that has just been broken up to make the first Groups went to Ancona to lead and was stopped at Filottrano, and Allied headquarters remembers that, too."
              : flags.adriaticRoad44 === "flank"
              ? " The Corps that has just been broken up to make the first Groups spent the Adriatic summer screening a flank, and Allied headquarters has drawn its own conclusion."
              : ""),
          choices: [
            {
              label: "Accept six fully equipped Groups — and keep the rest of the army working behind the line",
              advisor: { name: "Utili", position: "A division that is fully armed and fed is worth three that are not, and the six that exist will do more for the army's name than twenty that reach the line without guns." },
              historical: true,
              setFlags: { combatGroups44: "six" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "partisanWinter44",
              outcome:
                "What happened. Six Combat Groups were raised between the autumn of 1944 and the winter of 1945, equipped by the British, while the great mass of the army worked behind the line; by the war's end there were some 50,000 Italians in the combat formations, against 150,000 to 190,000 auxiliary troops and another 66,000 on traffic control and the defence of installations. The Groups were small beside the Allied armies and what they were given came from British stocks, but they were real: at the end the Co-Belligerent Army made up about an eighth of the fighting force of the Allied 15th Army Group, and with its auxiliaries a quarter of its whole force.",
            },
            {
              label: "Press the Allies for a larger combat army — more Groups on a lighter scale, Italian rifles and mules, British guns only",
              advisor: { name: "Messe", position: "An army of twenty divisions on paper and six in the line is a labour corps with a flag, and he would rather field twice the infantry on half the guns." },
              setFlags: { combatGroups44: "wide" },
              impact: { manpower: -1, fuel: -1, initiative: 0 },
              next: "partisanWinter44",
              concealRoll: true,
              uncertain: [
                {
                  weight: modWeight(35, meters.initiative),
                  title: "Two more Groups, on a lighter scale",
                  setFlags: { combatGroupsExtra44: true },
                  impact: { manpower: 0, fuel: -1, initiative: 1 },
                  outcome:
                    "Speculative. The British agree to equip two more Groups beyond the six, on a lighter scale: Italian small arms, mules for the heavy weapons and British artillery only. The Co-Belligerent Army puts more infantry in the line than it did historically, and spends part of the winter explaining to the Allied supply officers why its Groups do not fit their tables. The Allies' doubts about reliability do not go away; they are answered, for the moment, by numbers.",
                },
                {
                  weight: 100 - modWeight(35, meters.initiative),
                  title: "The Allies refuse",
                  impact: { manpower: -1, fuel: 0, initiative: -1 },
                  outcome:
                    "Speculative. The answer from the Allied staff is that British equipment is committed elsewhere, in the Far East and in northwest Europe, and that the case for six Groups has been made once and need not be made again. The six are raised as they were. The request is remembered as an army asking for a third more than it had been offered, in the week its first Group was still learning to use what it had.",
                },
              ],
            },
          ],
        };
        },
        get partisanWinter44() {
          return {
          date: "NOVEMBER – DECEMBER 1944",
          title: "The Stand-Down",
          historicalRecord: true,
          situation:
            "On November 13 General Alexander broadcasts to the partisans of the north over Radio Italia Combatte. The summer offensive is over; they are to lay down their arms, save their ammunition and wait for further orders. They had been told in the summer to rise and fight, and most accounts say the proclamation reached them with despair, with the winter coming and the German and Fascist sweeps of the autumn behind them. In Rome the Bonomi government, drawn from the same anti-Fascist parties as the committee in the north, wants the northern resistance under its authority, and since August General Raffaele Cadorna has been in Milan, sent north to command the Corps of Volunteers of Freedom. A CLNAI delegation is now in Rome to bargain with the Allied command: recognition and money in exchange for obedience. The Italian High Command has to say where it stands." +
            (flags.clnLiaison44 === "arm"
              ? " The arms and gold sent in the summer are in the mountains, and those who carry them will want to know whether they were sent for the winter or for the spring."
              : " What was sent in the summer was recognition, not rifles, and the men in the mountains are aware of the difference."),
          choices: [
            {
              label: "Follow the Allied line — tell the partisans to disperse and wait out the winter, and sign the Rome Protocols",
              advisor: { name: "Ambrosio", position: "A movement that takes Allied orders and Allied pay is a movement the Allies must arm in the spring, and the front is better served by a quiet north until then." },
              historical: true,
              setFlags: { partisanWinter44: "standDown" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "groupsCommand45",
              outcome:
                "What happened. The Rome Protocols were signed on December 7: the CLNAI agreed to take its orders from the Allied command, to recognise the Bonomi government and to keep order in the north until an Allied occupation could be organised, and the Allies agreed to pay it 160 million lire a month. Alexander's proclamation had already told the partisans to wait; the winter that followed was the hardest the movement faced. By April the movement that rose in the northern cities was the one that had been recognised in December, and it did not need to be told when.",
            },
            {
              label: "Refuse to endorse the stand-down — press the Allies to keep arming and supplying the partisans through the winter",
              advisor: { name: "Cadorna", position: "A volunteer corps that is told to go home for the winter does not come back in the spring, so the drops and the pay must keep coming." },
              setFlags: { partisanWinter44: "keepFighting" },
              impact: { manpower: -1, fuel: -1, initiative: 1 },
              next: "groupsCommand45",
              concealRoll: true,
              uncertain: [
                {
                  weight: modWeight(30, meters.initiative),
                  title: "The drops keep coming",
                  setFlags: { partisanResult44: "supplied" },
                  impact: { manpower: 0, fuel: -1, initiative: 2 },
                  outcome:
                    "Speculative. Allied command, which had meant the proclamation as an economy of ammunition and not as a verdict on the partisans, accepts that the north cannot be left to the winter: the air drops continue through December and January, at a cost in aircraft the Allied air forces have other uses for. The bands that would have scattered stay in the hills and keep tying down garrisons that might otherwise have been sent to the front. The movement that rises in April is bigger and better armed than the one the proclamation would have left, and it knows who kept it supplied.",
                },
                {
                  weight: 100 - modWeight(30, meters.initiative),
                  title: "The Allies hold to the proclamation",
                  setFlags: { partisanResult44: "refused" },
                  impact: { manpower: -1, fuel: 0, initiative: -1 },
                  outcome:
                    "Speculative. A decision made at the level of the theatre is not changed by a request from Rome, and the signing of the protocols is delayed while the Italian side argues. The recognition and the money are held up; the CLNAI is split between the bands that follow the proclamation and the ones that follow Cadorna; and the winter, which was always going to be hard, is harder for a movement that has spent part of it arguing with its only source of supply.",
                },
              ],
            },
          ],
        };
        },
        get groupsCommand45() {
          return {
          date: "JANUARY – MARCH 1945",
          title: "Who Commands the Groups",
          historicalRecord: true,
          situation:
            "By January the first Combat Groups are ready, and where they fight is a political question as much as a military one. Cremona is the first into the line, on January 12, with the British V Corps, on the stretch between the Ravenna–Alfonsine railway and the sea; each of the others will be attached to a different Allied corps, Friuli to X Corps and Folgore to XIII Corps. The Italian staff would rather they fought together under an Italian corps headquarters, as the army of a nation instead of as spare divisions of other men's corps. The Allies, who have the supplies, the artillery and the corps staffs, see no reason to build a new headquarters for four small divisions in the middle of a winter." +
            (flags.combatGroupsExtra44
              ? " Eight Groups are on the books on this timeline, not six, the last two on a lighter scale than the British will give the first, and an argument for a headquarters of their own is, for once, an argument about a corps."
              : "") +
            (flags.partisanWinter44 === "keepFighting" && flags.partisanResult44 === "supplied"
              ? " In the north, partisan bands that were kept supplied through the winter are asking Rome how the regular army means to meet them in the spring."
              : ""),
          choices: [
            {
              label: "Accept attachment to the Allied corps — each Group fights where the Eighth and Fifth Armies need it",
              advisor: { name: "Messe", position: "The guns, the shells and the trucks are with the Allied corps, and a Group that fights under one has them behind it, which is what wins a battle." },
              historical: true,
              setFlags: { groupsCommand45: "attached" },
              impact: { manpower: 0, fuel: 1, initiative: 0 },
              next: "springOffensive45",
              outcome:
                "What happened. Cremona entered the line on January 12 with the British V Corps, Friuli went to X Corps and Folgore to XIII Corps, and each fought where it was sent. Each was one more division in someone else's corps, supplied from someone else's stocks. It was not a national army, and it never had the chance to look like one. It did have the shells.",
            },
            {
              label: "Press for an Italian corps headquarters to command the Groups together — one army, one flag, one sector",
              advisor: { name: "Utili", position: "An army that fights as one body is remembered as an army, while a handful of divisions spread across other men's corps is remembered as reinforcements, so the Groups fight under their own headquarters." },
              setFlags: { groupsCommand45: "corps" },
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: "springOffensive45",
              concealRoll: true,
              uncertain: [
                {
                  weight: modWeight(30, meters.initiative),
                  title: "The Allies accept a corps headquarters",
                  setFlags: { groupsCorps45: true },
                  impact: { manpower: 0, fuel: -1, initiative: 2 },
                  outcome:
                    "Speculative. Allied command, which has no great objection to a headquarters that will run the supplies it is given, agrees to an Italian corps for the spring. The staff is cobbled together from the Corps that was broken up in September and from the General Staff in the south, and it spends February working out how to do what the British corps staffs have done for years. By April it can put the Groups into the offensive as one body under Italian command, in a sector of its own.",
                },
                {
                  weight: 100 - modWeight(30, meters.initiative),
                  title: "The Allies decline",
                  impact: { manpower: 0, fuel: 0, initiative: -1 },
                  outcome:
                    "Speculative. The Allied answer is courteous and short: there are no headquarters to spare, and no time to train one before the spring. The Groups go to the corps they were always going to go to. What the request costs is a little goodwill at the corps staffs, which are asked to take on divisions whose own command would rather they were somewhere else.",
                },
              ],
            },
          ],
        };
        },
        get springOffensive45() {
          const lead = Math.min(
            90,
            modWeight(58, meters.manpower) +
              (flags.combatGroups44 === "six" ? 6 : 0) +
              (flags.combatGroupsExtra44 ? 4 : 0) +
              (flags.groupsCorps45 ? 8 : 0) +
              (flags.monteLungoResult === "prepared" ? 3 : 0) +
              (flags.partisanResult44 === "supplied" ? 4 : 0)
          );
          return {
          date: "APRIL 1945",
          title: "The Last Offensive",
          historicalRecord: true,
          situation:
            "On April 6 the Allied offensive in Italy opens. The Eighth Army attacks across the Senio on the 9th, the Fifth Army's Apennine attack follows, and the German armies in Italy, short of everything and told to hold, are about to be cut in two. Behind the German line the CLNAI has been told to prepare an insurrection in the northern cities, and the signal will come on April 25. The Combat Groups are in the line: Cremona with V Corps in front of the Senio at Alfonsine, Friuli and Folgore in the hills in front of Bologna. What the Italian command has to decide is how much to ask for, and how much of its small army to spend on the last month of a war that is already decided." +
            (flags.partisanWinter44 === "standDown"
              ? " The partisans who were told to wait through the winter are ready, and have been told when."
              : flags.partisanWinter44 === "keepFighting" && flags.partisanResult44 === "supplied"
              ? " The partisans who were kept supplied through the winter are not waiting to be told."
              : flags.partisanWinter44 === "keepFighting"
              ? " The partisans, split by the winter's argument, rise less as one body than the Allies had planned for."
              : ""),
          choices: [
            {
              label: "Ask for the assault roles — Cremona across the Senio at Alfonsine, Friuli and Folgore on the road to Bologna",
              advisor: { name: "Utili", position: "A national army is remembered for the river it crossed and the city it entered, not for the line it held, so the Groups ask to be where the offensive will be won." },
              historical: true,
              setFlags: { springOffensive45: "lead" },
              impact: { manpower: -2, fuel: 0, initiative: 1 },
              next: "coBelligerentEnding45",
              uncertain: [
                {
                  weight: lead,
                  title: "The Groups take what they asked for",
                  setFlags: { springResult45: "decisive" },
                  impact: { manpower: -1, fuel: 0, initiative: 2 },
                  outcome:
                    "What happened. At dawn on April 10 Cremona crossed the Senio at Alfonsine and took the town that day, crossed the Santerno, and went north through Cavarzere, Chioggia and Mestre to Venice, which it reached at the end of the month. In the hills, Friuli and Folgore took Case Grizzano and Casalecchio de' Conti on April 19, where the Nembo's second battalion drove off the German 1st Parachute Division five times in hand-to-hand fighting, and on the morning of April 21 Friuli entered Bologna beside the Polish 3rd Carpathian Division. The German armies in Italy surrendered at Caserta on April 29, effective on May 2. The Italian divisions had been in the line for three months, and for the last three weeks of the war some of them were at the front of it.",
                },
                {
                  weight: 100 - lead,
                  title: "The assault is paid for in full",
                  setFlags: { springResult45: "costly" },
                  impact: { manpower: -3, fuel: 0, initiative: 0 },
                  outcome:
                    "Speculative. The Groups' first assault against a prepared river line is stopped on the first day by an enemy who is short of everything and has been told not to give ground, and what the Italian divisions take, they take two days late and at a price a small army can ill afford. The offensive goes on around them: the Allied armies break through on other sectors, and the Groups follow up in the pursuit. They are in the line for the German collapse, and they have paid more than their share of the cost of it.",
                },
              ],
            },
            {
              label: "Keep the Groups to supporting roles — flanks, follow-up and the occupation — and hold them whole for the peace",
              advisor: { name: "Messe", position: "An army that comes out of the last month whole has something to put on the table at the peace, while one that has bled for a river crossing has a casualty list." },
              setFlags: { springOffensive45: "support" },
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "coBelligerentEnding45",
              outcome:
                "Speculative. The Groups cover flanks, take over ground the Allied armies have passed, and move up behind the breakthrough, entering Bologna and Venice as part of an occupation and not at the head of an attack. They come out of the war with few of their men lost and a good many of the Allied commanders who might have written about them unable to say what they did in April. The Co-Belligerent Army arrives at the end intact, as what it was in the beginning: an army that the Allies used and did not rely on.",
            },
          ],
        };
        },
        get coBelligerentEnding45() {
          return {
          date: "APRIL – MAY 1945",
          title: "The War's End, From the South",
          historicalRecord: true,
          situation:
            "The final Allied offensive breaks the Gothic Line in April 1945, and what remains of German Army Group C in Italy surrenders unconditionally on May 2 — five days before the wider European war ends, and the culmination of nineteen months in which what used to be a single Comando Supremo fought its final act as a junior partner in someone else's coalition, on its own soil, against other Italians wearing the same uniforms a year and a half earlier wore alongside it. The reckoning this ending leaves behind is not primarily military: it is the question of what Italy's own war record, split as it was between two governments and an army that fought on both sides of the final line, actually amounts to when the guns finally stop." +
            " The army that fought on the Allied side put some 50,000 combat troops in the line by the end; the navy that sailed to Allied ports in September 1943 brought nine cruisers and thirty-three destroyers, and the air force flew more than 4,000 missions between September 1943 and May 1945." +
            (flags.springOffensive45 === "lead" && flags.springResult45 === "decisive"
              ? " The Combat Groups spent the last weeks of the war at the head of the Allied offensive, from the Senio to Bologna and Venice, and that is a fact the peace table will find easier to ignore than to dispute."
              : flags.springOffensive45 === "lead"
              ? " The Combat Groups spent the last weeks of the war at the head of the Allied offensive, and paid for it."
              : flags.springOffensive45 === "support"
              ? " The Combat Groups spent the last weeks of the war behind the advance, whole, with little to show for it that anyone outside the army will remember."
              : ""),
          choices: [
            {
              label: "Press for full recognition of the Co-Belligerent Army's contribution in the postwar settlement",
              advisor: { name: "Ambrosio", position: "Nineteen months were fought on the correct side of the war's final chapter, and that record deserves to be argued for at whatever table decides Italy's postwar status and not simply assumed." },
              setFlags: { postwarRecognition: "press" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "END",
              outcome:
                "What the historical record actually shows is a partial, contested answer: the Co-Belligerent Army's combat record was real, but Italy's postwar treatment at the peace conference — loss of colonies, war reparations, territorial concessions to Yugoslavia — reflected its status as a defeated former Axis power considerably more than its status as a co-belligerent ally, whatever the campaign's final nineteen months had actually cost in Italian lives fighting Germans. The distinction mattered less at the peace table than the men who fought this campaign's final year, on the correct side of it, might reasonably have hoped.",
            },
            {
              label: "Accept the settlement quietly and focus on the republic's own reconstruction instead",
              advisor: { name: "Badoglio", position: "Arguing over how the war is remembered is a project for the peacetime now starting, while what the country needs is to be rebuilt, and that argument feeds no one." },
              historical: true,
              setFlags: { postwarRecognition: "accept" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "END",
              outcome:
                "The path closer to how Italy's postwar politics actually unfolded, in substance if not always in tone: the peace treaty's harsh terms were accepted rather than fought at length, and national energy went overwhelmingly toward reconstruction and, within a year, the referendum that would abolish the monarchy Victor Emmanuel III abdicated just ahead of. Comando Supremo, in any form resembling what it was in 1940, does not survive this campaign's end — its wartime institutions, and the monarchy some of them served, are replaced rather than restored.",
            },
          ],
        };
        },
        get saloRepublic43() {
          return {
          date: "SEPTEMBER – OCTOBER 1943",
          title: "Founding the Republic",
          historicalRecord: true,
          situation:
            "Freed from his mountaintop prison by German commandos and installed as head of a new Italian Social Republic governing the German-occupied north — the north this command chose to answer to, when Comando Supremo split, rather than follow the King south — Mussolini is, by any honest reading available to the men now serving under him, less a restored leader than a managed asset — the RSI's ministries are headquartered in small towns around Lake Garda rather than Rome, its army answers in practice to German operational command whenever the two disagree, and its territory shrinks by the month as the Allied advance and the front both press north. The republic's founding proclamation promises a return to the movement's original, more radical 1919 program — a rhetorical move Pavolini and the party's hardliners push hard, aimed at recapturing something of Fascism's early energy rather than defending the compromises the regime made with the monarchy and industry over two decades in power.",
          choices: [
            {
              label: "Build a genuine RSI military, conscripted and organized, to hold a real front line alongside the Wehrmacht",
              advisor: { name: "Graziani", position: "A republic without an army is a German administrative zone with an Italian flag on it, and he is not interested in that, so give him the conscription authority and he will give the government something resembling a real force." },
              historical: true,
              setFlags: { rsiMilitary: "build" },
              impact: { manpower: 0, fuel: -1, initiative: 0 },
              next: "alpenvorlandQuestion43",
              outcome:
                "What Graziani, as the RSI's Minister of Defense, actually attempted: a conscription law that summoned roughly 300,000 men to the colors, of whom perhaps half actually reported — draft evasion into the mountains, often straight into the arms of the partisan bands it was meant to fight, undercut the program from the start. What did materialize were several properly trained divisions, some formed and equipped in Germany itself, that fought on the front line alongside the Wehrmacht through the campaign's final phase — a real military, just never the reliable mass mobilization its planners on paper had projected.",
            },
            {
              label: "Keep the RSI's military footprint deliberately small — rely on German forces for the front, Italian units for internal order only",
              advisor: { name: "Ambrosio", position: "Speaking from the government that was not chosen, he says plainly to anyone listening in the north that a smaller army conscripted from a population that increasingly does not want this war is a smaller number of Italians spent on a cause already lost." },
              setFlags: { rsiMilitary: "minimal" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "alpenvorlandQuestion43",
              outcome:
                "A minimal-conscription approach avoids feeding the draft-evasion pipeline that historically swelled partisan ranks with reluctant conscripts fleeing induction, and spares a meaningful number of young men from being spent, one way or another, on a war whose outcome by this point in the conflict is not seriously in doubt among the officers actually running it. What it costs the Republic is exactly the thing Graziani's larger buildup was meant to provide: any real claim to being more than an administrative appendage of the German occupation, defended by someone else's army.",
            },
          ],
        };
        },
        get alpenvorlandQuestion43() {
          return {
          date: "SEPTEMBER – OCTOBER 1943",
          title: "The Provinces Salò Never Actually Governed",
          historicalRecord: true,
          situation:
            "Within days of the armistice, German administrative decree quietly removes two entire border regions from whatever authority the new Republic claims to hold: the Alpine provinces around Bolzano and Trento are folded into an 'Operational Zone Alpine Foothills' under direct German civil administration, and the northeastern provinces around Trieste and Udine into a matching 'Operational Zone Adriatic Littoral' — both run by German Gauleiters, both a hedge, unmistakable to anyone reading the paperwork, against exactly the kind of German territorial claims on former Habsburg and Italian-Austrian borderlands that outlasted the empire that first drew them. The Republic's founding proclamation speaks of restoring Italian sovereignty in full; this decree, issued by the same patrons who freed Mussolini at Gran Sasso, quietly removes a meaningful share of that sovereignty before the Republic has even finished being founded.",
          choices: [
            {
              label: "Formally protest the annexation to Berlin — insist the operational zones are provisional, not permanent",
              advisor: { name: "Graziani", position: "Men are asked to fight and die for a Republic whose own government cannot say with a straight face where its northern border is this month, and he would rather lodge the protest and be told no than let the question go unasked." },
              checkLabel: "Initiative",
              disabledReason: (meters.initiative || 0) >= 1 ? undefined : "insufficient standing left to contest a German administrative decision inside the Republic's own claimed territory",
              setFlags: { alpenvorlandQuestion43: "protest" },
              impact: { manpower: 0, fuel: 0, initiative: 1 },
              next: "civilWarPartisans44",
              outcome:
                "The protest is heard and, in every practical sense, ignored — both operational zones remain under direct German civil administration for the entirety of the war, run by their own Gauleiters answering to Berlin rather than to any office in Salò, a fact the Republic's own propaganda apparatus finds no honest way to describe as anything other than what it plainly is.",
            },
            {
              label: "Accept the arrangement quietly — preserve the relationship with Berlin rather than contest a decision already made",
              advisor: { name: "Pavolini", position: "The Republic exists because Berlin decided it should, and the little goodwill that decision bought will not be spent arguing over provinces the Reich has already made up its mind about." },
              historical: true,
              setFlags: { alpenvorlandQuestion43: "accept" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "civilWarPartisans44",
              outcome:
                "Roughly what actually happened — the Republic never seriously contested either zone's removal from its authority for the whole of its twenty-month existence, an acceptance that costs it nothing further to admit and that changes nothing about a fact every officer in this chain of command can read for themselves on any map issued after October 1943: this Republic's sovereignty was conditional, partial, and set by someone else's decree from its very first weeks.",
            },
          ],
        };
        },
        get civilWarPartisans44() {
          return {
          date: "1944",
          title: "The War Behind the Front",
          historicalRecord: true,
          situation:
            "Partisan resistance in the RSI-controlled north has grown from scattered, poorly armed bands into a genuine irregular army — tens of thousands of fighters across a political spectrum from Communist to Catholic to purely apolitical draft-evaders, tying down German and RSI garrison forces across the mountains and industrial cities alike. Pavolini's Black Brigades, the Republic's own paramilitary anti-partisan force, are conducting reprisal operations with a brutality that has, if anything, deepened rather than suppressed the resistance they're meant to be fighting — a dynamic every occupation in this war's European theaters has produced in some form, and one this republic's own remaining legitimacy is being spent on regardless of which side of the argument the men actually running it privately believe.",
          choices: [
            {
              label: "Commit RSI forces fully to anti-partisan operations, including the reprisal tactics German command favors",
              advisor: { name: "Pavolini", position: "Every village that shelters partisans has chosen a side, and the Black Brigades will treat that choice with the seriousness it deserves." },
              historical: true,
              checkLabel: "Manpower",
              disabledReason: meters.manpower <= -4 ? "too few Black Brigade units left standing to run reprisal operations at the scale German command is asking for" : undefined,
              setFlags: { partisanWar44: "reprisal" },
              impact: { manpower: -1, fuel: 0, initiative: 1 },
              next: "gothicLineRSI44",
              outcome:
                "What actually happened across large stretches of the RSI's territory: a campaign of mass reprisal killings — Marzabotto, where roughly 770 civilians were killed by German and RSI forces in a matter of days, is the single worst but far from the only example — that suppressed partisan activity in some areas temporarily while entrenching a level of hatred toward the Republic and its forces that made any postwar reconciliation, for the men who carried these operations out personally, essentially impossible. The military effectiveness of the approach, measured strictly, is genuinely disputed by postwar historians; its political and moral cost is not.",
              uncertain: [
                {
                  weight: modWeight(35, meters.initiative),
                  title: "The suppression is real, locally, for a while",
                  setFlags: { partisanWar44Result: "suppressed" },
                  impact: { manpower: -1, fuel: 0, initiative: 1 },
                  outcome:
                    "In the districts hit hardest, partisan activity does drop for weeks afterward — the military logic Pavolini argued for is not simply propaganda, in these specific sectors. What it buys the Republic in the same districts, longer term, is a hatred no garrison report is honest enough to put a number on.",
                },
                {
                  weight: 100 - modWeight(35, meters.initiative),
                  title: "The reprisals recruit for the other side faster than they deter",
                  setFlags: { partisanWar44Result: "backfired" },
                  impact: { manpower: -1, fuel: 0, initiative: -1 },
                  outcome:
                    "The likelier reading, and the one most postwar assessments of this exact tactic reach: each reprisal operation drives recruits into the partisan bands faster than it suppresses them, the mountains fill rather than empty, and the Black Brigades spend a campaign season discovering that a policy built on fear works only on people who had somewhere else to go.",
                },
              ],
            },
            {
              label: "Limit RSI forces to defensive garrison duty and leave the harshest anti-partisan operations to German units alone",
              advisor: { name: "Graziani", position: "He did not build this army to spend it burning villages, and whatever the government's survival requires from someone, it does not require that from the men he commands." },
              setFlags: { partisanWar44: "limited" },
              favor: 1,
              impact: { manpower: 0, fuel: 0, initiative: -1 },
              next: "gothicLineRSI44",
              outcome:
                "A real, if narrow, distinction some RSI military officers did draw in practice — declining to personally lead the harshest reprisal operations while still serving a government whose German patrons conducted them regardless, with or without Italian participation. It spares RSI forces some of the direct authorship of the war's ugliest chapter in the north without meaningfully changing the campaign's outcome or sparing the civilians those German-led operations were still visited upon.",
            },
          ],
        };
        },
        get gothicLineRSI44() {
          return {
          date: "AUGUST – DECEMBER 1944",
          title: "The Republic's Front",
          historicalRecord: true,
          situation:
            "RSI divisions — the ones Graziani's conscription program actually produced, several trained and equipped in Germany — hold sectors of the Gothic Line alongside Wehrmacht formations as the Allied autumn offensive grinds to a halt in the northern Apennines' winter weather, the same stalemate the campaign's southern, co-belligerent counterpart is experiencing on the other side of the same line. What is different here is what holding this front is actually for: not liberation, but the postponement of a defeat every officer in this chain of command can read as clearly as anyone in Rome can." +
            (flags.partisanWar44Result === "backfired"
              ? " The mountains behind this line are fuller of armed partisans than they were a season ago, a direct dividend of the reprisal campaign, and every division holding the Gothic Line is a division that can also feel it has an enemy at its back now, not only in front."
              : flags.partisanWar44Result === "suppressed"
              ? " The rear areas behind this stretch of the line are, for now, quieter than the reprisal campaign's critics predicted — a fact this command is careful not to mistake for a verdict on the policy as a whole."
              : ""),
          choices: [
            {
              label: "Hold the line with full commitment — the republic's legitimacy depends on being seen to fight, not merely exist",
              advisor: { name: "Graziani", position: "Whatever this government becomes in the history books, it will not be recorded as one that did not fight, and that distinction is the only thing left entirely in its own hands." },
              historical: true,
              setFlags: { gothicLineRSI: "commit" },
              impact: { manpower: -1, fuel: 0, initiative: 0 },
              next: "rsiCollapse45",
              outcome:
                "The RSI's military did, in fact, fight with a determination that surprised some Allied assessments of a client-state army's likely reliability — several units held their sectors through the winter stalemate as capably as the German formations alongside them. What this commitment could not do, any more than the equivalent commitment on the co-belligerent side of the line could reverse Germany's wider strategic collapse, is change where this front — and the government it serves — ultimately ends, within months, regardless of how well any single winter's defense was fought.",
            },
            {
              label: "Preserve forces where possible, quietly deprioritizing the hardest-held sectors",
              advisor: { name: "Ambrosio", position: "An army preserved can still choose, later, what its surrender looks like, while an army spent proving a point to history has no such choice left, and this is said to whoever in that chain of command is still listening to reason and not to Salò." },
              setFlags: { gothicLineRSI: "preserve" },
              favor: 1,
              impact: { manpower: 1, fuel: 0, initiative: -1 },
              next: "rsiCollapse45",
              outcome:
                "A quieter, more self-preserving posture through the winter's fighting costs the Republic whatever propaganda value a fuller commitment might have produced, and draws private German suspicion about Italian reliability in sectors where it's applied — but it does leave more RSI units intact and closer to their home communities when the final collapse comes in the spring, a difference that will matter considerably more to the men in those units, and to their families, than to the war's actual outcome.",
            },
          ],
        };
        },
        get rsiCollapse45() {
          return {
          date: "APRIL 1945",
          title: "The Republic's Last Address",
          historicalRecord: true,
          situation:
            "The Gothic Line finally breaks in April, and the Republic's territory, already reduced to a strip of the Po valley and the Alpine foothills, collapses within weeks. Mussolini, in Milan, is weighing options that have narrowed to essentially none: a last, symbolic stand in the Valtellina mountains that a handful of loyalists still argue for and that has no realistic military basis; negotiated surrender terms with the resistance, which Cardinal Schuster is attempting to broker in Milan even as the front dissolves; or flight toward the Swiss border, in the company of whichever RSI officials and family choose to go with him. Partisan forces, coordinated with the advancing Allied armies, are converging on every road out of the city.",
          choices: [
            {
              label: "Attempt to negotiate surrender terms through Cardinal Schuster's mediation before the city falls",
              advisor: { name: "Graziani", position: "No version of this week ends with the Republic intact, and whatever terms Schuster can broker for an orderly transfer should be taken, for the sake of the men under arms who did not choose to be here at the end." },
              setFlags: { rsiEnd: "negotiate" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "END",
              outcome:
                "Graziani's own historical instinct — he did in fact favor negotiation through Schuster's channel, and eventually surrendered the RSI's remaining forces to Allied command directly on April 29, a full accounting of the choice that saved him, uniquely among the Republic's senior figures, from summary execution. Mussolini himself never accepted this path: he left the negotiation meeting on April 25 and fled north the same night, a decision this choice does nothing to change, since the negotiation was always Graziani's initiative and Mussolini's alone to reject.",
            },
            {
              label: "Attempt to flee toward Switzerland with the government's remaining officials",
              advisor: { name: "Mussolini", position: "There is nothing left to negotiate and no one left who would honor terms given to him personally, and whatever is left of this government moves north tonight, or it does not move at all." },
              historical: true,
              setFlags: { rsiEnd: "flee" },
              impact: { manpower: 0, fuel: 0, initiative: 0 },
              next: "END",
              outcome:
                "What happened: Mussolini's convoy, attempting to reach the Swiss border disguised among retreating German troops, is stopped by Communist partisans near the village of Dongo on April 27. Recognized despite the disguise, he is shot the following day along with his mistress Clara Petacci and several other captured RSI officials — Pavolini among them — on partisan orders, without trial. Their bodies are transported to Milan and hung by the feet in the Piazzale Loreto the next morning, on the same square where partisan bodies had been displayed by Fascist authorities the previous August, a circularity the crowd gathering to see it does not need explained to them. The Republic of Salò, twenty months after its founding at Gran Sasso, ends here — and this campaign, whichever of its two governments this chain of command ultimately served, ends with it.",
            },
          ],
        };
        },
      };

      return nodes[id];
    },
    historicity(flags) {
      const HIST = {
        italyEntry: "declare",
        alpsFront40: "push",
        medStrategy: "egypt",
        greeceDecision: "proceed",
        tarantoDoctrine: "preserve",
        greeceWinter: "reserve",
        compass40: "hold",
        germanRescue: "both",
        matapan41: "withdraw",
        balkansAnnex: "maximum",
        eastAfrica: "surrender",
        maltaQuestion: "escort",
        desertCommand: "defer",
        tobrukAftermath: "pursue",
        alamein42: "hold",
        tunisiaBuildup: "reinforce",
        tunisiaCollapse: "fight",
        homeFront43: "maintain",
        sicily43: "withdraw",
        coupResponse: "recognizeKing",
        armisticeTerms: "pressRome",
        armisticeExecution: "evacuate",
        italyPath: "coBelligerent",
        coBelligerentRole: "gradual",
        imiCrisis43: "press",
        vaticanChannel44: "request",
        imiOutcome44: "honor",
        cassino44: "support",
        romeGovernment: "broaden",
        clnLiaison44: "arm",
        gothicLine44: "commit",
        monteLungo43: "attack",
        adriaticRoad44: "lead",
        combatGroups44: "six",
        partisanWinter44: "standDown",
        groupsCommand45: "attached",
        springOffensive45: "lead",
        postwarRecognition: "accept",
        rsiMilitary: "build",
        alpenvorlandQuestion43: "accept",
        partisanWar44: "reprisal",
        gothicLineRSI: "commit",
        rsiEnd: "flee",
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
      // Axis Mode's own hard-mode ceiling: German Trust running out ends the run outright,
      // pre-armistice, the same way flags.relieved/purged/dismissed end the other three
      // campaigns — checked first, ahead of even the backMussolini speculative branch, since
      // it can in principle interrupt that branch too.
      if (flags.superseded)
        return { stamp: "COMMAND SUPERSEDED", prose: "Berlin superseding this command's authority", exact: false };
      // Unlike OKW/STAVKA/SHAEF, this campaign's variability is which of two endings a run
      // reaches, not how far a sliding meter-driven date moves within a single continuous war —
      // the armistice fork genuinely splits the campaign into two different wars with their own
      // fixed historical close, so the dates below are stated outright rather than derived.
      // The backMussolini branch never reaches the armistice fork at all — it closes on its own,
      // entirely speculative, September 1943 terminal node, so it gets its own case here rather
      // than falling through to the "incomplete record" default meant for runs that stop early.
      if (flags.coupResponse === "backMussolini")
        return { stamp: "SEPTEMBER 1943 — SPECULATIVE", prose: "September 1943", exact: false };
      // Round 19: the extended non-belligerence branch never reaches the armistice fork either —
      // it closes on its own dates, same reasoning as the backMussolini case immediately above.
      if (flags.italyEntry === "neutral" && flags.neutralItalyEnd)
        return { stamp: "LATE 1942 — SPECULATIVE", prose: "late 1942", exact: false };
      if (flags.italyEntry === "neutral" && flags.neutralItalyPressure === "tolerated")
        return { stamp: "1945 — SPECULATIVE", prose: "1945", exact: false };
      if (flags.italyPath === "rsi") {
        if (flags.rsiEnd === "flee")
          return { stamp: "APRIL 28, 1945", prose: "April 28, 1945", exact: true };
        if (flags.rsiEnd === "negotiate")
          return { stamp: "APRIL 29, 1945", prose: "April 29, 1945", exact: true };
        return { stamp: "APRIL 1945", prose: "April 1945", exact: false };
      }
      if (flags.italyPath === "coBelligerent")
        return { stamp: "MAY 2, 1945", prose: "May 2, 1945", exact: true };
      return { stamp: "1943 (INCOMPLETE)", prose: "1943", exact: false };
    },
    positionLabel(flags, meters) {
      // First match wins, rarest/most-specific first — same convention as the other three
      // commands. The armistice fork (italyPath) dominates every title below it, since it is
      // this campaign's single most defining fact about any given run.
      if (flags.superseded) return "Rome Stops Being Consulted";
      // Historical Divergence Mode: only reachable when the eastAfricaSlow fork fired (the
      // Commonwealth advance into East Africa stalled) AND the highland guerrilla campaign
      // actually gained traction rather than fizzling. Placed high as the rarest combination.
      if (flags.forkEastAfricaSlow && flags.eastAfricaGuerrilla === "traction") return "The Highland War Rome Didn't Plan For";
      // Round 19: the extended non-belligerence branch (off nonBelligerence40's "wait" choice,
      // several steps deeper) is a second, deeper counterfactual than anything else in this
      // chain — checked here, ahead of even the manpower extremes, for the same "rarer and more
      // specific outranks a meter reading" reasoning documented at those checks below.
      if (flags.italyEntry === "neutral" && flags.neutralItalyEnd === "resist") return "The War Rome Refused, Then Fought Anyway";
      if (flags.italyEntry === "neutral" && flags.neutralItalyEnd === "submit") return "Occupied Without Ever Having Fought";
      if (flags.italyEntry === "neutral" && flags.neutralItalyPressure === "tolerated") return "The War That Passed Rome By";
      if ((meters.manpower || 0) <= -6) return "An Army Spent Twice, on Both Sides of the Line";
      if ((meters.manpower || 0) >= 6) return "The Command That Lost the Least";
      if (flags.coupResponse === "backMussolini" && flags.loyalistEnd === "absorbed") return "A Republic Founded a Month Early";
      if (flags.coupResponse === "backMussolini") return "The Coup That Didn't Take";
      if (flags.italyPath === "rsi" && flags.rsiEnd === "negotiate") return "The Uniform Handed Over, Not Torn Off";
      if (flags.italyPath === "rsi" && flags.partisanWar44 === "reprisal") return "A Republic Remembered by Marzabotto";
      if (flags.italyPath === "rsi" && flags.rsiEnd === "flee") return "The Republic's Last Address";
      // "Twenty Months at Salò" (the italyPath==="rsi" catch-all with no rsiEnd/partisanWar44
      // condition) is DELETED here, along with its ENDINGS_GALLERY entry — Round 19 audit traced
      // it and found it permanently unreachable, not merely rare: rsiCollapse45, the RSI path's
      // only terminal node, has exactly two choices and BOTH set rsiEnd (to "negotiate" or
      // "flee"), both already claimed by the two checks immediately above. No run can reach this
      // point with italyPath==="rsi" and rsiEnd still unset. Same pattern check-reachability.js's
      // own header comment says has already been found and fixed at least four times elsewhere
      // in this file (20 Soviet ending titles, atomic45/finalStand nesting, iberianQuestion42
      // promoted twice, the darlanDeal42/battleOfBritain40 nesting fix).
      // Round 24: the co-belligerent path's own war. Narrow combinations only.
      if (flags.italyPath === "coBelligerent" && flags.groupsCorps45 && flags.springResult45 === "decisive") return "A Corps With Its Own Flag";
      if (flags.italyPath === "coBelligerent" && flags.combatGroupsExtra44 && flags.springOffensive45 === "lead") return "Eight Groups Where Six Were Offered";
      if (flags.italyPath === "coBelligerent" && flags.partisanWinter44 === "keepFighting" && flags.partisanResult44 === "supplied") return "The Winter Nobody Stood Down";
      if (flags.italyPath === "coBelligerent" && flags.springOffensive45 === "lead" && flags.springResult45 === "costly") return "The Price of Leading";
      if (flags.italyPath === "coBelligerent" && flags.postwarRecognition === "press") return "A Record Argued For, Not Assumed";
      if (flags.italyPath === "coBelligerent" && flags.gothicLine44 === "commit") return "The Line Held on Its Own Front";
      if (flags.italyPath === "coBelligerent") return "The Co-Belligerent's Uncertain Honor";
      // Defensive-only fallback, not listed in ENDINGS_GALLERY. Every path that reaches END
      // without setting italyPath is now caught by one of the three neutral-branch checks above
      // (germanPressure41's uncertain roll always sets neutralItalyPressure; the coerced side
      // always resolves neutralItalyEnd before END). This line should be structurally
      // unreachable — kept only in case a future branch reaches END some other way, same
      // reasoning as any function needing an exhaustive fallback. The old label here ("Two
      // Italies, One File") was ALSO permanently unreachable before Round 19 for a different
      // reason (twoItalies43, the armistice-fork node, always sets italyPath — no run could
      // leave it unset either), so its ENDINGS_GALLERY entry was deleted rather than kept as a
      // stale reference to dead code.
      return "An Incomplete File";
    },
    epilogue(flags, meters) {
      if (flags.superseded) {
        return (
          "This campaign ends here, and not on any battlefield. Under Axis Mode, German Trust tracked every choice that read to Berlin as Rome acting on its own judgment rather than deferring to the senior partner's — and it has run out, well before whatever September the historical armistice would have arrived in on this path. There is no dramatic arrest, no summons to the Palazzo Venezia. Case Achse — the real contingency plan the Wehrmacht kept updated for exactly this scenario throughout the war, the one actually executed within hours of the historical armistice announcement in September 1943 — is simply triggered early, against a command Berlin has already stopped trusting to be told the date in advance. German formations already stationed on Italian soil for 'joint defense' move on their own authority to disarm the formations nominally still commanding them. Comando Supremo does not resign. It is no longer the office anyone in Berlin, or increasingly in Rome, is bothering to call. " +
          "What this command spent, choice by choice, wasn't manpower or fuel — it was the one resource this junior partnership was always going to be measured in, and every act of independent judgment this campaign rewarded as the bolder, more Italian answer was also, without exception, a withdrawal against it. The war continues without this file's author in the room where it gets decided. It was never actually Rome's war to run alone, only Rome's war to be seen running."
        );
      }
      const end = this.projectedEnd(flags, meters);
      const h = this.historicity(flags);

      let dateClause;
      if (flags.coupResponse === "backMussolini") {
        dateClause =
          `This file closes on ${end.prose}, a speculative branch's own ending rather than a date the documented record recognizes — six weeks of an Italian army fighting itself that the actual, bloodless transition of July 1943 never had to spend.`;
      } else if (flags.italyPath === "rsi") {
        dateClause =
          `The Italian Social Republic ends on ${end.prose}, twenty months after Mussolini's rescue from Gran Sasso installed it as a German client state in the occupied north.`;
      } else if (flags.italyPath === "coBelligerent") {
        dateClause =
          `Army Group C surrenders in Italy on ${end.prose}, five days before the wider European war ends — the close of nineteen months fighting as a junior Allied partner on Italian soil.`;
      } else if (flags.italyEntry === "neutral" && flags.neutralItalyEnd === "resist") {
        dateClause =
          `This file closes on ${end.prose}, speculative throughout — a non-belligerent Italy that held out for two years, then fought a war after all, just against the ally its whole policy was built to accommodate rather than for it.`;
      } else if (flags.italyEntry === "neutral" && flags.neutralItalyEnd === "submit") {
        dateClause =
          `This file closes on ${end.prose}, speculative throughout — a non-belligerent Italy occupied in practice, without ever having fought a war on either side of it.`;
      } else if (flags.italyEntry === "neutral") {
        dateClause =
          `This file closes on ${end.prose}, speculative throughout — the war in Europe ends with this command never having entered it, on either side.`;
      } else {
        dateClause = "This file ends before the armistice fork that defines the rest of this campaign — an incomplete record.";
      }

      let costClause;
      if (flags.italyEntry === "neutral" && flags.neutralItalyEnd === "resist") {
        costClause =
          " The human cost of this path is real but not comparable to the documented record's roughly 300,000 Italian dead — a short, localized conflict against a former ally, fought years into a war this command otherwise avoided entirely.";
      } else if (flags.italyEntry === "neutral" && flags.neutralItalyEnd === "submit") {
        costClause =
          " The human cost of this path is the lowest of any branch this campaign can reach — an occupation absorbed without armed resistance, paid for in sovereignty rather than in the roughly 300,000 dead the documented war actually cost Italy.";
      } else if (flags.italyEntry === "neutral") {
        costClause =
          " The human cost of this path is the lowest of any branch this campaign can reach — a European war that, for this file alone among every other run of this campaign, was never actually fought.";
      } else if ((meters.manpower || 0) >= 3) {
        costClause =
          " The forces under this command's authority came through both the North African collapse and the armistice split more intact than the historical record — fewer of them spent proving points the war's arithmetic had already settled.";
      } else if ((meters.manpower || 0) <= -3) {
        costClause =
          " The human cost of this path runs higher than the historical one at nearly every hinge point — Italy's own wartime dead, roughly 300,000 military and civilian combined split across two governments and a country fought over twice, were already among the higher tolls of any Axis power relative to population.";
      } else {
        costClause =
          " The human cost of this path lands close to the historical record — a war that cost Italy its colonial empire, its monarchy within a year of the peace, and a divided memory of who actually fought whom in its final nineteen months.";
      }

      const notes = [];
      const add = (w, t) => notes.push({ w, t });
      if (flags.italyEntry === "wait")
        add(7, "Non-belligerence was held past the historical June 10 declaration — a delay that cost the peace-table access Mussolini's actual gamble was built to secure, in exchange for readiness numbers the standing mobilization plan still needed.");
      if (flags.italyEntry === "lateDeclare")
        add(8, "War was declared only in the war's last days before France's own armistice — a real entry, but with almost none of the peace-table logic the historical June 10 declaration was built around still intact by the time it happened.");
      if (flags.italyEntry === "britainOnly")
        add(9, "War was declared on Britain alone, months after France had already settled its own armistice without Italian participation — a different opening than the historical one, fought for the Mediterranean prize directly rather than for a seat at a peace table that no longer existed to claim.");
      if (flags.italyEntry === "neutral")
        add(10, "Non-belligerence was held past every deadline the historical 'parallel war' doctrine assumed would force a choice — France's fall, Britain's survival, Barbarossa's launch — a counterfactual with almost no footing in what any Italian government under this regime actually considered.");
      if (flags.neutralItalyResponse41 === "refuse")
        add(7, "Berlin's 1941 pressure was met with an outright refusal to offer any concessions at all, a wager staked directly on this government's own remaining legitimacy rather than on a negotiated accommodation.");
      if (flags.neutralItalyResponse41 === "concede")
        add(6, "Berlin's 1941 pressure was answered with economic concessions short of alliance — raw materials and transit access offered to keep the arrangement tolerable without actually joining the war.");
      if (flags.neutralItalyResistResult === "held")
        add(7, "The refusal to submit to Berlin's 1942 ultimatum held — an occupation Germany could not fully resource on top of the Eastern Front's own demands never materialized past the threat of it.");
      else if (flags.neutralItalyResistResult === "fought")
        add(8, "The refusal to submit to Berlin's 1942 ultimatum was pressed, and answered directly — a real, if small and strange, war fought against the ally this command spent two years avoiding fighting for.");
      if (flags.neutralItalyRetrospect === "vindicated")
        add(6, "This command's own closing verdict on six years of non-belligerence was vindication — a judgment defended on the strength of an army that survived intact and cities that were never bombed, whatever it cost at the peace table this government never had a seat at.");
      else if (flags.neutralItalyRetrospect === "unresolved")
        add(6, "This command's own closing verdict on six years of non-belligerence declined to claim vindication — survival, it argued, is not the same thing as having answered for the choice not to fight.");
      if (flags.malta40 === "fell" && flags.maltaRetaken)
        add(6, "Malta was taken in an actual 1940 invasion, while the garrison was still weak — then lost back to a determined British counter-effort over the following winter, the documented British commitment to the island reasserting itself even against an early and successful Italian gamble.");
      else if (flags.malta40 === "fell")
        add(9, "The Mediterranean question was answered with an actual 1940 invasion of Malta, while the garrison was still weak — the operation the historical Comando Supremo only ever planned as Operation Hercules a year too late, attempted, won, and then held against Britain's own attempt to take it back.");
      else if (flags.herculesResult === "fell" && flags.maltaRetaken)
        add(6, "Operation Hercules was finally executed and won in 1941 — then lost back to Britain within a season, the historical Comando Supremo's own caution about the island's real cost vindicated even by a late and successful invasion.");
      else if (flags.medStrategy === "malta")
        add(7, "The Mediterranean question was answered with Malta named the priority in 1940 — an early invasion attempt was thrown back, and the base survived to become the same year-long argument over Operation Hercules the historical Comando Supremo also never resourced in time.");
      else if (flags.medStrategy === "gibraltar")
        add(
          flags.gibraltarTaken === "success" ? 10 : 7,
          flags.gibraltarTaken === "success"
            ? "Rome reached past both Malta and Egypt for the whole sea's western lock — Italian shipments to Madrid succeeded where the real Hitler-Franco meeting at Hendaye failed, and Gibraltar's fall took Force H off the board entirely, a strategic reversal with no equivalent anywhere else in the documented Mediterranean war."
            : "Rome pressed Berlin and Madrid for a seat in the Gibraltar question rather than settling for Malta or Egypt alone — a diplomatic wager the documented record never records Italy attempting, win or lose at Hendaye's actual table."
        );
      // Round 19: gibraltarGambit and gibraltarCommitment were flagged write-only by the audit —
      // set at gibraltarGambit40/gibraltarResolution40, but previously only ever read indirectly
      // through the derived gibraltarTaken flag above. These give the player's actual choice at
      // each of those two nodes its own narrative line, independent of how the roll landed.
      if (flags.gibraltarGambit === "backFranco")
        add(5, "Rome pressed its own seat at the Gibraltar question rather than let Berlin negotiate it alone — a real diplomatic stake taken up even before the fuel-and-shipments question that followed it was decided.");
      else if (flags.gibraltarGambit === "abstain")
        add(5, "Rome floated a seat at the Gibraltar question and then abandoned it, closer to the documented Hendaye meeting's actual absence of an Italian delegate than the alternative this branch also offered.");
      if (flags.gibraltarCommitment === "guaranteesOnly")
        add(5, "Franco's price at Hendaye was met with paper guarantees on Tunisia and Nice rather than real Italian shipments — a wager this command declined to make, leaving Gibraltar exactly the fortress the documented meeting also failed to close.");
      if (flags.maltaDefense41 === "reinforce")
        add(5, "Malta's garrison was reinforced from the fleet's own continuing budget rather than left to what was already there — an ongoing commitment against a British effort this command judged certain to come, whatever it cost the desert war's own timetable.");
      else if (flags.maltaDefense41 === "minimal")
        add(5, "Malta was defended with whatever was already on the island, nothing further diverted from the desert war to reinforce it — the cheaper bet, and the more exposed one, whichever way the British effort against it actually went.");
      if (flags.greeceDecision === "delay")
        add(8, "Mussolini's answer to Romania was delayed rather than rushed — the single change every honest account of the Greek campaign says should have been made, and on this path, was.");
      if (flags.tarantoDoctrine === "escort")
        add(6, "The diminished battle fleet was committed to active convoy escort after Taranto rather than preserved in harbor — more fuel and equipment reaching Libya, at a risk the historical 'fleet in being' doctrine was built specifically to avoid.");
      if (flags.compass40 === "withdraw")
        add(8, "Graziani ordered the withdrawal from the fortified camps before Compass's flanking attack landed, rather than holding as the historical delay did — sparing the Tenth Army the worst of a rout that historically cost some 130,000 men taken prisoner.");
      if (flags.germanRescue === "libyaOnly")
        add(6, "The request to Berlin was narrowed to Libya alone — preserving, for one more season, the fiction that Greece remained an Italian-run campaign, right up until Yugoslavia's collapse made the question moot regardless.");
      if (flags.balkansAnnex === "limited")
        add(6, "The Balkans annexation was kept deliberately small — fewer divisions tied down chasing a Yugoslav insurgency across occupied coastline over the following two years, at the cost of standing at Berlin's table.");
      if (flags.eastAfrica === "guerrilla")
        add(5, "East Africa's last garrison was ordered to scatter and fight on rather than surrender at Amba Alagi — a real option a handful of officers pursued historically at small scale, ordered here at a cost in the campaign's final week that bought no lasting diversion.");
      if (flags.maltaQuestion === "invade")
        add(7, "Operation Hercules was finally pushed to execution after a year of deferred planning — the invasion historians still argue would or wouldn't have worked, attempted here at direct cost to Rommel's own offensive timetable in the same season.");
      if (flags.desertCommand === "assert")
        add(6, "Italian theater command's nominal authority over Rommel was actually enforced rather than left informal — slowing the desert war's characteristic speed of decision in exchange for operations that answered, on paper and in practice, to Rome.");
      if (flags.tobrukAftermath === "consolidate")
        add(6, "The advance halted at the planned Libya-Egypt line after Tobruk's fall rather than pressing on toward Alamein — preserving more of the captured supplies for a later offensive at the cost of the momentum the historical pursuit spent instead.");
      if (flags.alamein42 === "withdraw")
        add(7, "A deliberate early withdrawal from the Alamein line concedes the same ground the historical twelve-day battle eventually lost anyway, without first spending the attritional casualties a fuel-starved defense was never favored to hold.");
      if (flags.tunisiaBuildup === "evacuate")
        add(6, "The Tunisia commitment was limited in favor of evacuating veteran cadres back to Italy — trading roughly six months of delay the historical buildup bought for units preserved to defend the home front the war's geography was about to turn to face directly.");
      if (flags.homeFront43 === "airDefense")
        add(5, "Air defense was concentrated over the home cities in the weeks before Sicily fell — a partial mercy for the civilians under the summer 1943 bombing campaign, though it changed nothing about which beach the Allies chose to land on next.");
      if (flags.coupResponse === "backMussolini")
        add(9, "A speculative path with almost no historical footing: the officer corps' actual loyalty to the constitutional monarchy in July 1943 proved deeper than any loyalty to Mussolini personally. What this file records instead is a counterfactual crisis of legitimacy inside the regime's own institutions — one the losing war underneath it would have overtaken regardless of who signed the orders.");
      if (flags.romeStandoff43 === "seize")
        add(8, "The loyalist movement tried to seize the Quirinale and the capital's ministries outright rather than negotiate — a direct test of an authority the real King's Carabinieri were, historically, already positioned to defend against exactly this scenario.");
      if (flags.factionSplit43 === "enforce")
        add(8, "Wavering and defecting commanders were arrested rather than allowed to declare for the King quietly — Italian units turned on each other in a way the actual, largely bloodless transition of power never required.");
      if (flags.germanExploitation43 === "accept")
        add(7, "German troops were invited into Rome to help suppress the King's loyalists a full month before the historical armistice ever gave Berlin a comparable opening — the same client-state arrangement the real Republic of Salò reached in September, reached here in August instead.");
      if (flags.imiCrisis43 === "press")
        add(6, "The government pressed the Allies to raise the roughly 600,000 Italian Military Internees' treatment directly with Berlin — close to what Badoglio's government actually attempted, against a German policy choice no amount of appeal was ever positioned to reverse.");
      if (flags.imiOutcome44 === "honor")
        add(6, "The government publicly honored the documented majority of IMIs who refused Germany's offer of better conditions in exchange for a German or RSI uniform — recognition the postwar Italian state did eventually extend, though not in time to change what those men were living through.");
      if (flags.alpenvorlandQuestion43 === "protest")
        add(6, "The Republic formally protested Berlin's removal of the Alpine and Adriatic border provinces from its own authority — a protest the historical record shows went nowhere, since both operational zones stayed under direct German civil administration for the RSI's entire existence.");
      if (flags.clnLiaison44 === "arm")
        add(6, "The government in the south committed arms and gold to the CLNAI partisans fighting north of the Gothic Line, at real cost to its own front-line supply — a material commitment the resistance that helped liberate Milan and Turin in April 1945 partly depended on.");
      if (flags.herculesExecution41 === "launch")
        add(5, "Operation Hercules was actually attempted with Italian assets alone once German transport aircraft proved unavailable — a scaled-down version of the plan Italian staff officers themselves argued against, run here instead of left on paper.");
      if (flags.armisticeExecution === "delay" && flags.romeDefenseResult === "stood")
        add(9, "The armistice announcement was actually delayed long enough to concentrate a real defense around Rome — a stand the historical chaos of September 8-9, 1943 never gave the scattered garrison any chance to mount, even though the city still fell within the week regardless.");
      if (flags.armisticeExecution === "delay" && flags.romeDefenseResult === "worse")
        add(8, "The delay meant to buy Rome a coordinated defense instead bought German intelligence two additional days to reinforce the garrison — Operation Achse executed even more completely than its historical version.");
      if (flags.greeceWinterResult === "worse")
        add(6, "The Epirus winter reserve arrived too late to stop the bleeding — the Greek counteroffensive pushed further into Albanian territory than the historical campaign ever allowed, a deeper hole for the German rescue that follows to climb out of.");
      if (flags.greeceWinterResult === "held")
        add(5, "The Epirus front's winter reserve held the line inside Albania, roughly where the historical campaign's own costly stabilization managed to hold it.");
      if (flags.italyPath === "coBelligerent" && flags.coBelligerentRole === "expand")
        add(6, "The Co-Belligerent Army pushed hard and early for an expanded combat role after Salerno rather than accepting the auxiliary status Allied caution first assigned it — accelerating the trust-building the historical, more gradual approach spent over a year completing.");
      if (flags.italyPath === "coBelligerent" && flags.cassino44 === "direct")
        add(6, "Italian formations pushed for direct participation in the Cassino assault itself rather than the supporting role history assigned them — a faster answer to the trust question, at a cost the still-rebuilding army could less easily absorb than the campaign's larger Allied formations.");
      if (flags.italyPath === "rsi" && flags.rsiMilitary === "minimal")
        add(6, "The Republic's conscription was kept deliberately small — sparing a real number of young men the draft-evasion pipeline that historically fed conscripts straight into partisan ranks, at the cost of any claim to being more than an administered zone defended by someone else's army.");
      if (flags.italyPath === "rsi" && flags.partisanWar44 === "limited")
        add(7, "RSI forces were kept to defensive garrison duty rather than committed to the reprisal operations German command favored — a real distinction some officers drew historically, sparing this command's forces the direct authorship of the north's worst chapter, without changing what German-led units still visited on the same villages regardless.");
      // Round 24: what the co-belligerent army's own war left behind.
      if (flags.italyPath === "coBelligerent" && flags.monteLungo43 === "attack")
        add(6, "The first Italian attack on Monte Lungo went in on December 8, 1943, as the Americans had planned it, and failed; the second, on the 16th, did not. The Allies had watched the Italian army fight twice.");
      if (flags.italyPath === "coBelligerent" && flags.monteLungoResult === "prepared")
        add(6, "Monte Lungo was taken on the second date, the 16th, after a week of rehearsal with the guns, and without the first attack's dead: a first battle won, and without the story of the one that had been lost.");
      if (flags.italyPath === "coBelligerent" && flags.monteLungoResult === "sidelined")
        add(5, "The request for a week to prepare for Monte Lungo was refused and the Group was put in reserve for the first battle the Italian army was offered, a lost opportunity that took the rest of the year to recover.");
      if (flags.italyPath === "coBelligerent" && flags.monteLungo43 === "decline")
        add(5, "The 1st Motorized Group was kept out of Monte Lungo and its first test put off to the spring, and the Allied staffs that had wondered whether Italians would fight were given more time to wonder.");
      if (flags.italyPath === "coBelligerent" && flags.adriaticRoad44 === "lead" && flags.adriaticResult44 === "taken")
        add(7, "The Nembo paratroopers led at Filottrano, which fell on July 9, 1944, and two of the division's regiments were decorated for it: the battle honour the Italian Liberation Corps wanted, won under Polish command.");
      if (flags.italyPath === "coBelligerent" && flags.adriaticResult44 === "stopped")
        add(6, "The first assault on Filottrano was stopped, and the Polish armour had to be brought up to take the town: the best formation the army had, found to be brave and not yet a corps.");
      if (flags.italyPath === "coBelligerent" && flags.adriaticRoad44 === "flank")
        add(5, "The Italian Liberation Corps screened a flank under the Poles at Ancona rather than leading at Filottrano, and came out of the Adriatic summer intact and unnoticed.");
      if (flags.italyPath === "coBelligerent" && flags.combatGroups44 === "six")
        add(5, "The Allied offer of six fully equipped Combat Groups was accepted and the rest of the army left behind the line, the choice the British would have made for it in any case.");
      if (flags.italyPath === "coBelligerent" && flags.combatGroups44 === "wide" && flags.combatGroupsExtra44)
        add(7, "The Allies agreed to equip two Groups beyond the six on a lighter scale, a larger combat army than the one the real record gave Italy, and a supply problem that went with it.");
      if (flags.italyPath === "coBelligerent" && flags.combatGroups44 === "wide" && !flags.combatGroupsExtra44)
        add(5, "A larger combat army was asked for on a lighter scale of equipment and refused: six Groups were raised as offered, and the request was remembered.");
      if (flags.italyPath === "coBelligerent" && flags.partisanWinter44 === "standDown")
        add(6, "Alexander's proclamation of November 13, 1944 was backed and the Rome Protocols signed on December 7: the partisans waited out the winter on Allied orders, paid 160 million lire a month, and rose in April on the signal.");
      if (flags.italyPath === "coBelligerent" && flags.partisanResult44 === "supplied")
        add(8, "The air drops to the northern partisans were kept up through the winter of 1944 against the proclamation's advice, and the movement that rose in April was larger and better armed for it.");
      if (flags.italyPath === "coBelligerent" && flags.partisanResult44 === "refused")
        add(6, "The refusal to endorse the winter stand-down was overruled at theatre level, and the northern resistance spent part of the winter divided over whom to obey.");
      if (flags.italyPath === "coBelligerent" && flags.groupsCommand45 === "attached")
        add(5, "The Combat Groups fought under Allied corps, as they did, each one more division in someone else's corps: supplied from someone else's stocks, and with the shells.");
      if (flags.italyPath === "coBelligerent" && flags.groupsCorps45)
        add(8, "An Italian corps headquarters was allowed to command the Combat Groups together in the spring of 1945, which the Allies in the real record never allowed: an army that fought, for once, as one.");
      if (flags.italyPath === "coBelligerent" && flags.groupsCommand45 === "corps" && !flags.groupsCorps45)
        add(5, "A request for an Italian corps headquarters to command the Combat Groups was made and declined, and the Groups went to the corps they were always going to go to.");
      if (flags.italyPath === "coBelligerent" && flags.springOffensive45 === "lead" && flags.springResult45 === "decisive")
        add(8, "Cremona crossed the Senio at Alfonsine on April 10, 1945 and went on to Venice; Friuli entered Bologna on the 21st beside the Poles; the Nembo's second battalion drove off the German 1st Parachute Division five times at Case Grizzano.");
      if (flags.italyPath === "coBelligerent" && flags.springResult45 === "costly")
        add(7, "The Combat Groups asked for the assault roles in April 1945 and paid more than their share of the cost: a small army, in at the German collapse, with its casualties to show for it.");
      if (flags.italyPath === "coBelligerent" && flags.springOffensive45 === "support")
        add(6, "The Combat Groups were held to supporting roles in the last offensive and came out of the war whole, as an army the Allies had used and not relied on.");
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
          "Italy's defeat was never a variable this command's decisions controlled — only which of two governments it answered to when the choice was finally forced, and what that choice cost the men who made it with it.",
          "No branch of this campaign avoids the armistice fork; the war that follows it was already decided by an arithmetic no single command, on either side of the line, could overturn.",
          "What this file actually records is not whether Italy's war was lost — that was settled well before September 1943 — but which of two answers to losing it this command chose to give.",
        ][Math.abs((meters.initiative || 0) + (meters.manpower || 0) + h.matched) % 3]
      );
    },
    // Second stage of the multi-stage ending — broad context roughly a year past the date named
    // in epilogue(). Individual fates belong to the "where they ended up" stage, drawn from
    // ADVISOR_DOSSIERS.fate for the officers this command actually leaned on. Bucketed first on
    // italyPath, same as positionLabel and epilogue — the armistice fork dominates everything
    // that follows it, including what "a year later" even means for this file.
    oneYearLater(flags, meters) {
      if (flags.superseded) {
        return "A year past a supersession that was never announced as one, Italy's war is still being fought — by German formations using whatever Italian units didn't disarm or scatter when Case Achse triggered, on a timetable this file's author had no further say in. Badoglio's actual armistice, when it comes on whatever this timeline's own delayed schedule allows, finds a country already split in practice, if not yet on paper, between an occupied north and a south the Allies are fighting their way up. Whoever ends up signing that document, and whoever ends up governing what's left of the Fascist state in the meantime, it is not this command — German Trust ran out before either question was this desk's to answer.";
      }
      if (flags.coupResponse === "backMussolini") {
        const aftermath =
          flags.loyalistEnd === "absorbed"
            ? "the loyalist movement formalized its dependence on Berlin barely a month after the crisis began, reaching in August what the documented history's Republic of Salò reached in September — a client state whichever banner happens to fly over it"
            : "the loyalist movement dissolved under its own exhaustion rather than in battle, arriving by autumn at something close to the King's government anyway, several bloodier weeks and several thousand more Italian casualties later than the transition that actually happened";
        return `SPECULATIVE — a year past a crisis of legitimacy inside the regime's own institutions rather than the historical, quieter transfer of power to Badoglio, the losing war underneath either choice runs on the same schedule regardless: ${aftermath}. Whatever this file's counterfactual palace politics actually produced, it did not produce a different arithmetic for the war Italy could no longer win.`;
      }
      if (flags.italyPath === "rsi") {
        const memory =
          flags.rsiEnd === "flee"
            ? "the Republic's last address ends with its own leadership caught and killed trying to reach it, and the year that follows is spent by a country trying to decide how much of its own recent history that image is allowed to stand for"
            : flags.rsiEnd === "negotiate"
            ? "the handover was negotiated rather than fled from, and the year that follows argues, more than most, over whether that distinction changed anything about what the Republic actually was"
            : "the Republic dissolves into occupied and then liberated territory, and the year that follows is Italy's first real reckoning with having fought a war against itself";
        return `A year past the Salò government's collapse, Italy is holding a referendum — June 1946 — on whether it keeps its monarchy at all. The House of Savoy's wartime record, including the same King who dismissed Mussolini in 1943 and then largely vanished from the war his signature had co-authored since 1940, does not survive that vote: Italy becomes a republic within roughly a year of this file's own close. Partisan tribunals and formal courts are, in the same year, working through a case list this command's own RSI choices did a great deal to lengthen — reprisal operations, conscription policy, who cooperated and how much, argued case by case in a country that fought itself for nineteen months and has not agreed, a year on, what that argument was actually about. And ${memory}.`;
      }
      if (flags.italyPath === "coBelligerent") {
        const standing =
          flags.postwarRecognition === "press"
            ? "the harder diplomatic push for recognized co-belligerent standing has, within the year, produced language in the peace negotiations that a purely passive record never would have earned — not equal treatment, but not the flattest possible defeated-power terms either"
            : "the more gradual, Allied-paced path to recognition means the peace negotiations opening within the year still treat Italy substantially as a defeated Axis power, whatever combat record the Co-Belligerent Army actually built";
        return `A year past Army Group C's surrender in Italy, the same June 1946 referendum that follows the RSI's collapse follows this branch too — the monarchy that declared war in 1940 does not survive a popular vote a year after the fighting stops, whichever branch of this campaign reaches that vote. What differs on this path is the country's negotiating position going in: ${standing}. Either way, the peace conference that opens within the year will cost Italy its colonial empire outright and leave the Trieste border an open dispute — an argument this command's wartime choices never actually reached.`;
      }
      if (flags.italyEntry === "neutral") {
        if (flags.neutralItalyEnd === "resist") {
          return "SPECULATIVE — a year past a short, strange war against the ally this command spent two years avoiding, Italy is not the country the documented June 1946 referendum actually found: Mussolini's regime, having staked its legitimacy on judgment rather than combat, faces a domestic reckoning of its own, though not the same one — a public asked to weigh a government that kept the country largely out of Europe's catastrophe against one that ultimately fought anyway, on nobody's side but its own, against the power it spent two years trying not to provoke.";
        }
        if (flags.neutralItalyEnd === "submit") {
          return "SPECULATIVE — a year past an occupation absorbed rather than resisted, Italy exists in a strange diplomatic limbo the documented postwar order has no real category for: neither a defeated Axis power nor a liberated Allied one, a country whose army never fired a shot in Europe's war now administered, in practice, by the ally it spent two years trying to avoid antagonizing.";
        }
        return "SPECULATIVE — a year past a European war this command never entered on either side, Italy faces a postwar order it had no hand in shaping and no casualty list to bring to the table. Mussolini's regime, whatever it argued about vindicated judgment, is a government that sat out the defining catastrophe of its own generation — a fact history is likely to remember differently than this file's own closing choice framed it.";
      }
      return "This file closes before the armistice fork that defines what 'a year later' would even mean for the rest of this campaign — an incomplete record with no later chapter to project.";
    },
  },
};

// ---------- STYLE HELPERS ----------
// The artifact environment ships only Tailwind's precompiled core classes — arbitrary
// values like text-[#ffffff] are never generated. This stylesheet implements every
// arbitrary class this campaign uses, so the classes behave as written.
