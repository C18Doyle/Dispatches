  siberia: {
    id: "siberia",
    label: "Provisional All-Russian Government",
    coalition: "white", // Supreme Ruler government -- see kolchak/denikin dossiers for the real, purely symbolic chain of command with AFSR
    shortTag: "OMSK", // identity — fixed regardless of skin choice
    commander: "Admiral Alexander Kolchak",
    seat: "Supreme Ruler's Staff, Omsk",
    thesis: "One war. A White movement nominally united under Kolchak but fought, in practice, as an independent campaign — managing the shape of a defeat, not chasing an alternate victory.",
    start: "omskCoup18",

    initialMeters: {
      manpower: 0,
      materiel: 0,
      rail: 0,
    },
    triangleAxes: [
      { key: "manpower", label: "MANPOWER" },
      { key: "materiel", label: "FOREIGN MATÉRIEL" },
      { key: "rail", label: "RAIL CONTROL" },
    ],
    initialLegitimacy: 0,
    plannedEnding: {
      date: "LATE 1920",
      title: "Dissolution Under Semyonov",
      note:
        "Not the Vladivostok government of 1922 -- that was a genuinely different political entity with different leadership; carrying this command seat that far is a stretch past what the same seat can plausibly claim. End on the Kappelite remnant's absorption into, and Semyonov's own collapse in, the Transbaikal -- keeps the actual command thread intact rather than borrowing a later, unrelated story's ending.",
    },
    hardMode: {
      key: "authorityErosion",
      label: "Ataman Authority",
      capitalName: "JANIN MODE",
      capitalLabel: "AUTHORITY CAPITAL",
      description:
        "No rewind, no meter dashboard — only staff reports. Five points of Authority Capital to spend asserting sole command over nominally subordinate atamans and, critically, over the Czechoslovak Legion units who control the rail line this whole retreat depends on. Spend all five and the Legion withdraws its protection at the fifth override — the campaign ending the way it really did: betrayal, not defeat in the field. Named for General Janin, whose Allied guarantee of protection meant exactly as much as the Legion's own convenience allowed.",
      buttonLabel: "OPEN COMMAND",
      maxCap: 5,
      maxEndingId: "endingLegionWithdraws",
    },

    NEWSPAPER_MASTHEAD: "SIBIRSKAYA RECH",
    NEWSPAPER_SUBHEAD: "Siberian Speech — as read at Omsk",
    ADVISOR_DOSSIERS: {
      vologodsky: {
        role: "Prime Minister, Provisional All-Russian Government",
        bio:
          "A moderate Siberian regionalist politician who chaired the Council of Ministers through the Directory's collapse and the transfer of power to Kolchak, having concluded that a single military authority was the only alternative to total governmental breakdown.",
        fate:
          "Remained Prime Minister under Kolchak until November 1919, resigning as the government's collapse became undeniable. Died in exile in Harbin in 1925.",
        faction: "Council of Ministers",
        rank: 1,
      },
      boldyrev: {
        role: "Commander-in-Chief, Directory Forces; briefly Supreme Ruler on the path where Kolchak redirected the office to him",
        bio:
          "A career general and founding member of the Union for the Regeneration of Russia, a moderate anti-Bolshevik coalition that included Kadets and Right SRs. On record as more sympathetic to the Directory's socialist wing than most of the officers who ended it — the reason Kolchak first proposed redirecting the Supreme Ruler offer to him rather than accepting it himself.",
        fate:
          "Historically declined any role once Kolchak's coup succeeded, and left for Japan ten days later. Returned to Vladivostok in 1920 as commander of the Far East's forces, was arrested by the Red Army in 1922, declared willingness to serve the Soviet government, taught for a decade in Novosibirsk, and was shot in 1933 on a fabricated espionage charge.",
        faction: "Union for the Regeneration of Russia",
        rank: 1,
      },
      kolchak: {
        role: "Supreme Ruler, Provisional All-Russian Government — recognized as supreme commander of all White forces by Denikin, Yudenich, and Miller from June 1919",
        bio:
          "Former Imperial Navy admiral with no experience commanding land armies before assuming supreme power in November 1918. Relied heavily on his chief of staff for operational planning and never fully resolved his authority over the regional atamans who controlled the rail line behind his own front. His recognition as supreme commander by every other major White general in mid-1919 was genuine and diplomatically significant — it secured Allied recognition of his government as Russia's legitimate authority — but it never translated into actual coordination with AFSR a continent away. The two campaigns fought, in practice, entirely independent wars against the same enemy.",
        fate:
          "Renounced supreme power on January 4, 1920, as his government collapsed, naming Denikin as his successor. Handed over by the Czechoslovak Legion to the Bolshevik-aligned Irkutsk Political Centre in exchange for safe passage east. Executed by firing squad on February 7, 1920; his body was put through the ice of the frozen Angara River and never recovered.",
        faction: "Provisional All-Russian Government",
        rank: 0,
      },
      gajda: {
        role: "Commander, Siberian Army",
        bio:
          "A Czechoslovak Legion officer turned Russian general, celebrated for the capture of Perm in December 1918 and popular with his troops. Pushed hard for continuing the offensive north toward a junction with Allied forces at Archangel rather than diverting south.",
        fate:
          "Dismissed by Kolchak in July 1919 after the offensive's collapse. In November 1919 organized an armed revolt against Kolchak's government in Vladivostok, which failed. Returned to Czechoslovakia, became leader of the country's small fascist party, and died in Prague in 1948.",
        faction: "Siberian Army",
        rank: 1,
      },
      kappel: {
        role: "Commander-in-Chief, Eastern Front (from mid-December 1919)",
        bio:
          "Appointed to lead the retreat as Kolchak's authority collapsed, trusted by the rank and file in a way few other White commanders in Siberia were. Insisted on keeping the retreating army together as a fighting force rather than letting it dissolve into separate columns.",
        fate:
          "Suffered severe frostbite crossing a frozen river during the retreat, developed pneumonia, and transferred command to General Voitsekhovsky on January 21, 1920. Died four days later, on January 25, 1920, at Nizhneozyornaya.",
        faction: "Eastern Front Command",
        rank: 1,
      },
      voitsekhovsky: {
        role: "Corps commander, Eastern Front",
        bio:
          // Round 23: fleshed out from a 150-char stub. Cross-verified against
          // two independent Wikipedia articles (his own biography page and
          // the Great Siberian Ice March page) for Kappel's death date and
          // the succession — both agree on 26 January 1920.
          "A Czechoslovak Legion commander from December 1917, he took Chelyabinsk in May 1918 and transferred to Kolchak's Russian command in March 1919 as commander of the 2nd Ufa Corps, rising to command the whole 2nd Army by October — already the army's most experienced field officer well before Kappel's death made him its last one.",
        fate:
          "Took command of the Eastern Front on Kappel's death from pneumonia on 26 January 1920 and led the remnant into Transbaikal, evacuating via Vladivostok to Istanbul that November. Settled in Czechoslovakia, rose to army general, and led its underground resistance after the 1939 German occupation. Abducted by Soviet SMERSH from Prague in 1945, he died in the Ozerlag Gulag camp in 1951 — the only advisor in this file whose Civil War service ended in a Soviet prison camp anyway, three decades and a second world war later.",
        faction: "Eastern Front Command",
        rank: 2,
      },
      semyonov: {
        role: "Ataman of the Transbaikal Cossack Host; Japanese-backed autocrat of Chita",
        bio:
          "Ruled Transbaikal from 1918 with Japanese military backing and nominal, largely theoretical subordination to Kolchak's government. His own troops developed a well-documented reputation among the civilian population for theft, arson, and murder — a record the Kappelite officer corps despised him for even while depending on his territory to survive.",
        fate:
          "Lost Chita in October 1920 and retreated to Manchuria. Lived in exile in China and Japan, drawing a Japanese government pension. Captured by Soviet forces in Manchuria in 1945 and executed in Moscow the following year.",
        faction: "Transbaikal Cossack Host",
        rank: 1,
      },
      sakharov: {
        role: "Chief of Staff, Western Army; later Commander-in-Chief (Nov 1919 – Jan 1920)",
        bio:
          "Argued through the spring 1919 offensive for concentrating the dispersed White armies on a single central axis toward Kazan rather than splitting toward Gajda's Archangel and Denikin's Saratov junctions — a position he restated at length in his own postwar memoir, which is not a disinterested account of a plan he had proposed himself. Given supreme command in the war's final, hopeless stretch after Dieterichs' dismissal.",
        fate:
          "Commanded through the retreat from Omsk and the worst of the Great Siberian Ice March before being replaced by Kappel in January 1920. Escaped through Harbin. Died in emigration in Belgium in 1935.",
        faction: "Western Army",
        rank: 1,
      },
      diterichs: {
        role: "Commander, 3rd Army; briefly Minister of War under Kolchak (August 1919)",
        bio:
          "A staff officer known for internal discipline and self-confidence rather than a record of dramatic field command before this war. Ordered the July 1919 counterattack to retake Chelyabinsk's rail junction from the advancing Red 3rd Army under Frunze.",
        fate:
          "Later led the last White government in the Russian Far East (the Priamurye government) in 1922, framing his cause explicitly as a religious crusade, before its final collapse that October. Died of tuberculosis in Shanghai in September 1937.",
        faction: "Siberian Army Command",
        rank: 2,
      },
    },

    NODE_ATLAS: [
      { id: "omskCoup18", date: "NOVEMBER 1918", title: "Omsk: The Offer Kolchak First Refused" },
      { id: "boldyrevsFirstWeek18", date: "NOVEMBER 1918", title: "Omsk: The First Week" },
      { id: "reluctanceAftermath18", date: "NOVEMBER 1918", title: "Chita: What the Delay Signals" },
      { id: "semyonovResponse18", date: "DECEMBER 1918", title: "Chita: A Small, Real Opening" },
      { id: "springOffensive19", date: "MARCH 1919", title: "Omsk: The Spring Offensive" },
      { id: "saratovJunction19", date: "MAY 1919", title: "The Southern Flank" },
      { id: "exposedFlank19", date: "MAY 1919", title: "The Flank: What the Reserves Found" },
      { id: "ufaCounteroffensive19", date: "JUNE 1919", title: "Ufa: The Red Counteroffensive" },
      { id: "chelyabinskGrinder19", date: "JULY 1919", title: "Chelyabinsk: The Grinder" },
      { id: "diterichsOverruled19", date: "AUGUST 1919", title: "The General Overruled" },
      { id: "thirdArmySuccessor19", date: "SEPTEMBER 1919", title: "Third Army: Who Replaces a Capable General" },
      { id: "railPriority19", date: "NOVEMBER 1919", title: "Omsk: The Evacuation Trains" },
      { id: "janinsWord19", date: "DECEMBER 1919", title: "The General's Word" },
      { id: "iceMarchDecision19", date: "DECEMBER 1919", title: "The Trakt: Who Rides, Who Walks" },
      { id: "eichesPursuit20", date: "JANUARY 1920", title: "The Distance Eiche Closed" },
      { id: "irkutskUltimatum20", date: "FEBRUARY 1920", title: "Irkutsk: The Ultimatum" },
      { id: "semyonovMerger20", date: "MARCH 1920", title: "Chita: A Loathed Necessity" },
      { id: "manchurianBorder20", date: "APRIL 1920", title: "The Border: Whoever Asks Permission" },
      { id: "chitaFall20", date: "OCTOBER 1920", title: "Chita: The Plug Comes Out" },
    ],
    NODE_TOTAL: 19,
    ENDINGS_GALLERY: [
      { id: "endingManchuria", title: "The Manchurian Border", classification: "historical" },
    { id: "endingBoldyrevsOmsk18", title: "Boldyrev's Omsk", classification: "speculative" },
    { id: "endingOmskFalls19", title: "Omsk Falls", classification: "speculative" },
      { id: "endingTheAdmiralAtIrkutsk20", title: "The Admiral at Irkutsk", classification: "historical" },
      { id: "endingManchuriaEarly", title: "The Army That Left First", classification: "speculative" },
      { id: "endingDispersedAtTheBorder", title: "Dispersed at the Border", classification: "historical" },
      { id: "endingColumnScattered20", title: "The Column That Scattered", classification: "speculative" },
      { id: "endingLegionWithdraws", title: "The Legion Withdraws", classification: "speculative" },
    ],
    ENDING_CLASSIFICATION: {
      endingManchuria: "historical",
      endingBoldyrevsOmsk18: "speculative",
      endingOmskFalls19: "speculative",
      endingTheAdmiralAtIrkutsk20: "historical",
      endingManchuriaEarly: "speculative",
      endingDispersedAtTheBorder: "historical",
      endingColumnScattered20: "speculative",
      endingLegionWithdraws: "speculative",
    },

    resolveNode(nodeId, flags = {}, meters = {}) {
      switch (nodeId) {
        // -------------------------------------------------------------------
        case "omskCoup18":
          return {
            date: "NOVEMBER 1918",
            title: "Omsk: The Offer Kolchak First Refused",
            bulletin: {
              headline: "THE LEGION THAT MADE THIS WAR POSSIBLE",
              body: "There is a government to overthrow here because of an army that is not Russian. Roughly 50,000 men of the Czechoslovak Legion — former Austro-Hungarian prisoners organized under an emerging Czechoslovak National Council — were evacuating peacefully east under Bolshevik agreement. A clash at Chelyabinsk in May, followed by Moscow's order to disarm them outright, ended that agreement. The Legion answered by seizing the Trans-Siberian station by station. That seizure broke Bolshevik control of Siberia — not any Russian faction's own initiative.",
              meanwhile: {
                southRussia: "Seven months after Kornilov's death at Ekaterinodar, the Volunteer Army survives under Denikin, still a modest force based in the Kuban — not yet the major southern threat it becomes through 1919.",
                bolsheviks: "The Left SR uprising was crushed in July; an assassination attempt on Lenin himself in August has hardened the government's own security apparatus considerably. The Republic is fighting for its life on several fronts now, not just this one.",
              },
            },
            historicalRecord: true,
            situation:
              "Cossack troops under ataman Krasilnikov arrested the Directory's Socialist-Revolutionary members overnight, purging the government's left wing without your explicit order — though you did nothing to discourage it either. What remains of the Council of Ministers is now offering you, War Minister for barely two weeks, supreme power with emergency authority. You are on record as having refused it once already this morning.",
            choices: [
              {
                label: "Accept the offer. Take supreme power with full emergency authority as Supreme Ruler.",
                advisor: {
                  name: "Vologodsky",
                  quote:
                    "The Directory is already gone in every way that matters — the only open question left is whether Russia's government has one authority or none at all. I am asking you to accept the first option before events settle on the second for us.",
                },
                historical: true,
                setFlags: { omskCoupChoice: "accept" },
                impact: {},
                next: "springOffensive19",
                outcome:
                  "The office is accepted. You are named Supreme Ruler, promote yourself to full admiral, and inherit a government that exists because Cossacks it does not fully control decided it should. The Left SR reaction is immediate — a small Omsk uprising in late December is put down by the same Cossacks and Czech Legion troops who made this possible, roughly five hundred executed. It will not be the last time this government's authority over the men enforcing it is more theoretical than real.",
              },
              {
                label: "Press for a collective military council instead of sole authority, before accepting the role if that arrangement fails.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I did not ask to be the answer to this question by myself. I would rather propose that three of us hold this authority jointly than accept alone a title Cossacks I don't fully command just handed me by removing everyone who might have argued the point.",
                },
                historical: false,
                setFlags: { omskCoupChoice: "council_first" },
                impact: { rail: -2 },
                next: "reluctanceAftermath18",
                outcome:
                  "The Council of Ministers considers the proposal and rejects it within the day — a single authority is exactly what the cabinet was trying to establish by removing the Directory's left wing in the first place. You accept the Supreme Ruler title anyway, a few hours later than history recorded it, having spent those hours on record as reluctant rather than willing.",
              },
              {
                label: "Redirect the offer to Boldyrev, as you argued when it was first raised this morning — and mean it this time.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I told the Council this morning that the post belongs to Boldyrev, as a member of the Directory and its own commander-in-chief, and I meant it before I let myself be talked into a second conversation. He is still in this city. I am not going to spend the rest of the day being persuaded out of the answer I already gave once.",
                },
                historical: false,
                setFlags: { omskCoupChoice: "redirect_boldyrev" },
                impact: { rail: -1 },
                next: "boldyrevsFirstWeek18",
                outcome:
                  "The redirection holds this time. Boldyrev has not yet left for Japan — that departure, historically, is still ten days off — and he is in Omsk to receive an office he did not ask for from a War Minister who is refusing, for the second time today, to be the answer to a question that was never really about him personally.",
              },
            ],
          };

        // ---------------------------------------------------------------------
        // ENDING — reached only by Kolchak following through on redirecting
        // the office to Boldyrev, which he raised in the room and then let
        // himself be argued out of. historicalRecord false for the premise;
        // Boldyrev's actual career facts used here (Union for the
        // Regeneration of Russia, the eventual Japan posting he does NOT
        // take on this branch, his real 1922 arrest and 1933 execution) are
        // documented and are deliberately NOT transplanted wholesale onto a
        // counterfactual government they never actually served — the
        // epilogue says so explicitly rather than papering over it.
        // ---------------------------------------------------------------------
        // Second chapter for the Boldyrev divergence — the ending previously
        // resolved after a single choice at omskCoup18, which is exactly the
        // shallow-fork pattern this project's own conventions rule out. Gives
        // the divergence one real decision of its own before it terminates.
        // Grounded in what actually distinguished Boldyrev's real politics:
        // the arrested Directory members (Avksentiev, Zenzinov, and others)
        // were expelled abroad rather than harmed, and a genuinely more
        // moderate Supreme Ruler is the one figure in the room with real
        // standing to argue for bringing them back into the government.
        case "boldyrevsFirstWeek18":
          return {
            date: "NOVEMBER 1918",
            title: "Omsk: The First Week",
            historicalRecord: false,
            context:
              "The Council of Ministers has already made its own preference clear: a single conservative authority, the Directory's moderate socialist wing removed from the government entirely. Avksentiev, Zenzinov, and the other arrested Directory members are being held for expulsion abroad rather than harmed — the Council's idea of restraint. Boldyrev's own political sympathies run the other way, toward the men now being escorted to the border.",
            situation:
              "A week into the office he twice tried to decline, Boldyrev has to decide what kind of government this actually is. Arguing for the arrested men's reinstatement costs him whatever goodwill the Council extended him for lack of an alternative in the room. Accepting their expulsion as settled keeps the peace with a cabinet that never wanted him and governs exactly as reactively as it would have under Kolchak.",
            choices: [
              {
                label: "Press for the arrested Directory members' reinstatement. Spend the goodwill; it's what the office is for.",
                advisor: {
                  name: "Boldyrev",
                  quote:
                    "I did not take this post to preside over the same government with a different name on the door. If I am not willing to spend what little standing I have on the one thing I actually believe, the Council can find someone who agrees with them completely and save us all the pretense.",
                },
                historical: false,
                setFlags: { boldyrevFirstWeek: "reinstatement_pressed" },
                impact: {},
                next: "endingBoldyrevsOmsk18",
                outcome:
                  "The Council refuses outright — Avksentiev and Zenzinov are already at the border, and reversing the expulsion now would read as reinstalling exactly the government the coup existed to remove. Boldyrev presses the argument anyway, and loses it in his first week, which tells every minister in the room exactly how much authority the new Supreme Ruler actually carries.",
              },
              {
                label: "Accept the expulsion as settled. A fight over it now costs more than it can possibly buy.",
                advisor: {
                  name: "Boldyrev",
                  quote:
                    "I have been in this office a week and I do not yet have the standing to win a fight with the Council over men already on a train to the frontier. I would rather keep the authority I have and spend it on something I can actually change than lose it in the first week proving a point that changes nothing for Avksentiev either way.",
                },
                historical: false,
                setFlags: { boldyrevFirstWeek: "expulsion_accepted" },
                impact: {},
                next: "endingBoldyrevsOmsk18",
                outcome:
                  "The expulsion stands unopposed. Boldyrev keeps the Council's tolerance and spends none of it — on this or, as it turns out, on much else. The government he presides over looks, in its first week, very much like the one Kolchak would have run.",
              },
            ],
          };

        // ---------------------------------------------------------------------
        // ENDING — the mid-war collapse for Siberia. The campaign previously
        // jumped from November 1918 straight to February 1920; the entire
        // 1919 collapse, which is the actual substance of this front's
        // history, had no terminal outcome attached to it. Reached by losing
        // the rail argument with the Legion while the rail net is already
        // gone — the two things this whole campaign runs on.
        case "endingOmskFalls19":
          return {
            isEnding: true,
            title: "Omsk Falls",
            date: "NOVEMBER 1919",
            badge: "\u25c7 SPECULATIVE — DOWNSTREAM OF DIVERGENCE",
            classification: "speculative",
            epilogue:
              "The evacuation does not happen, because an evacuation requires trains and this government no longer commands any. The Legion holds the junctions; the government's own echelons sit on sidings east of the city while the Fifth Army enters it. What leaves Omsk leaves on foot, in November, in Siberia.\n\nHistorically Omsk fell on 14 November 1919 and the government got out — badly, chaotically, with the gold reserve and most of the ministries strung along the Trans-Siberian for two thousand miles, but out. That withdrawal was the thing that made the Great Siberian Ice March possible at all, and made Kappel's column, and Irkutsk, and eventually Chita. None of it is available to a command that reaches November with no rail control left to spend.\n\nKolchak is taken at Omsk rather than handed over at Irkutsk three months later. There is no Political Centre transaction, no Legion bargain, no interrogation transcripts running to nine sessions. The Supreme Ruler's government ends in the city it governed from, which is a tidier end than the historical one and not a better one — the record it leaves is shorter, and the men who would have walked two thousand miles to reach Chita mostly do not leave the Irtysh."
          };

        case "endingBoldyrevsOmsk18":
          return {
            isEnding: true,
            title: "Boldyrev's Omsk",
            date: "NOVEMBER 1918",
            badge: "◇ SPECULATIVE — DOWNSTREAM OF DIVERGENCE",
            classification: "speculative",
            epilogue:
              "The Council of Ministers, having spent the morning removing the Directory's left wing specifically to install a single authority, is not enthusiastic about a redirection to a general most of them regard as barely less socialist than the men they just arrested. They accept it anyway, for lack of an alternative in the room, and Vasily Boldyrev — commander-in-chief of the Directory's own forces, a founding member of the Union for the Regeneration of Russia, and a man on record as more sympathetic to the moderate socialists than to the officers who just cleared his path — becomes Supreme Ruler instead of Kolchak." +
              (flags.boldyrevFirstWeek === "reinstatement_pressed"
                ? " He tests that reputation almost immediately, pressing for the arrested Directory members' reinstatement against a Council that refuses outright — and loses, in his first week, which settles the question of how much real authority came with the title."
                : flags.boldyrevFirstWeek === "expulsion_accepted"
                ? " He does not test that reputation. The Council's expulsion of the arrested Directory members stands unopposed, and the government he presides over looks, from its first week, very much like the one it replaced."
                : "") +
              "\n\nNone of this claims the war goes differently. The military position east of the Urals in November 1918 is what it is regardless of whose name is on the office — the numbers, the rail capacity, and the Red Army's growing organisational advantage were never a function of this specific appointment. A more moderate Supreme Ruler might hold the SR delegations closer and govern with less of the naked reaction that alienated the peasantry Kolchak's own government needed; whether that changes anything material by 1919 is a genuinely open question, and one the record does not settle" +
              (flags.boldyrevFirstWeek === "reinstatement_pressed"
                ? " — though a man who loses his first real fight with his own cabinet is not obviously the one who gets to answer it."
                : ".") +
              "\n\nWhat it does not do is follow Kolchak. He is a decorated admiral relieved of a title he twice tried to refuse, not a prisoner and not a target — where he goes and what becomes of him afterward is simply not part of this account — this account was always about the office, not the man. Boldyrev's own later record is real and is not quietly repurposed here: historically he went to Japan ten days after this point, returned to Vladivostok in 1920, signed a neutral-zone agreement with the Japanese as commander of the Far East's forces, was arrested when the Red Army took Vladivostok in November 1922, declared his willingness to serve the Soviet government, taught at a research institute in Novosibirsk for a decade, and was shot in August 1933 on a fabricated espionage charge. None of that happened to a man who was Supreme Ruler. A general who takes this office in November 1918 is not living that career, and no honest account can say which parts of it he keeps.",
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of the council proposal being
        // rejected. historicalRecord false: this is what having the
        // reluctance on record does to how regional commanders read the new
        // government, not a documented event.
        case "reluctanceAftermath18":
          return {
            date: "NOVEMBER 1918",
            title: "Chita: What the Delay Signals",
            historicalRecord: false,
            situation:
              "Word of the hesitation has reached Ataman Semyonov in Chita before the ink on your acceptance is dry. He was never going to fully acknowledge Omsk's authority regardless — but a Supreme Ruler who is on record proposing to share the title looks, to a man already inclined to treat Omsk as one voice among several, like confirmation rather than news.",
            choices: [
              {
                label: "Address it directly. Send a formal communication asserting the title is not, in practice, negotiable.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I would rather correct the record now, plainly, than let a private hesitation calcify into a public precedent. Semyonov was never going to be an easy subordinate. I don't need to hand him a documented reason to be a harder one.",
                },
                historical: false,
                setFlags: { reluctanceResponse: "assert" },
                impact: { rail: -1 },
                next: "semyonovResponse18",
                outcome:
                  "The message goes out. Whether it actually changes Semyonov's calculation, or simply gives him a formal statement to point to as evidence Omsk feels the need to insist, is open. The roll answers it.",
                uncertain: (() => {
                  const landsWeight = modWeight(40, meterPct(meters.rail));
                  return [
                    {
                      weight: landsWeight,
                      title: "The assertion lands",
                      setFlags: { reluctanceOutcome: "accepted" },
                      impact: { rail: 2 },
                      outcome:
                        "Semyonov's public posture toward Omsk doesn't visibly change, but the private correspondence between his staff and the capital grows measurably more cooperative in the following weeks — a small, real gain that costs nothing further to have tried for.",
                    },
                    {
                      weight: 100 - landsWeight,
                      title: "The assertion reads as exactly the insistence it feared looking like",
                      setFlags: { reluctanceOutcome: "backfired" },
                      impact: { rail: -3 },
                      outcome:
                        "Semyonov's response is polite and entirely unchanged in substance. If anything, having a formal assertion of authority to not-quite-comply with gives his own staff a cleaner story for why cooperation with Omsk continues to lag.",
                    },
                  ];
                })(),
              },
              {
                label: "Let it pass without comment. A response risks confirming there was ever a real question to answer.",
                advisor: {
                  name: "Vologodsky",
                  quote:
                    "Silence has its own risk — it can read as confidence or as evasion depending entirely on who's already inclined to distrust you. With Semyonov, I suspect it reads as the latter regardless of what we actually do.",
                },
                historical: false,
                setFlags: { reluctanceResponse: "ignore" },
                impact: {},
                next: "springOffensive19",
                outcome:
                  "Nothing is said. Semyonov's cooperation with Omsk continues on the same limited, self-interested terms it was already operating on before any of this — the hesitation neither helped nor meaningfully worsened a relationship that was never going to be straightforward.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — genuinely different content depending on how
        // Semyonov actually responded. historicalRecord false throughout.
        case "semyonovResponse18":
          if (flags.reluctanceOutcome === "accepted") {
            return {
              date: "DECEMBER 1918",
              title: "Chita: A Small, Real Opening",
              historicalRecord: false,
              situation:
                "The improved private correspondence with Semyonov's staff is slight but unmistakable — the kind of opening that could plausibly be built on with a further, concrete request, or left alone as a fragile gain not worth risking on a bigger ask. Whether to press for something more substantial while the door is genuinely, if narrowly, open is a real choice this rare cooperation has created.",
              choices: [
                {
                  label: "Press for something concrete — a specific commitment on rail cooperation — while the opening is real.",
                  advisor: {
                    name: "Kolchak",
                    quote:
                      "A private correspondence that grows warmer costs us nothing if we never actually spend it on anything. I would rather test what this opening is worth in practice than let it remain a pleasant but unused fact about Semyonov's staff.",
                  },
                  historical: false,
                  setFlags: { semyonovOpeningChoice: "pressed" },
                  impact: { rail: 2 },
                  next: "springOffensive19",
                  outcome:
                    "The request goes out, specific and concrete. It tests the opening rather than just enjoying it — and whatever the answer, it's an answer, not the ambiguous warmth of correspondence that was never actually asked to produce anything.",
                },
                {
                  label: "Leave it alone. A fragile gain not yet asked to prove anything is safer than one that's just been tested and found wanting.",
                  advisor: {
                    name: "Vologodsky",
                    quote:
                      "I understand the appeal of testing what we have. I would rather bank a small, real improvement than risk discovering, by asking for more, that it was smaller than it looked.",
                  },
                  historical: false,
                  setFlags: { semyonovOpeningChoice: "preserved" },
                  impact: { rail: 1 },
                  next: "springOffensive19",
                  outcome:
                    "The opening is left untested, preserved as a modest, real improvement rather than risked on a bigger ask. Whether that caution was warranted or simply left value on the table is a question this decision doesn't resolve either way.",
                },
              ],
            };
          }
          return {
            date: "DECEMBER 1918",
            title: "Chita: The Assertion That Didn\'t Land",
            bulletin: {
              headline: "THE ARMISTICE ENDS THE LEGION\'S REASON FOR BEING HERE",
              body: "The war the Czechoslovak Legion took up arms to reach ended on 11 November. A Czechoslovak state exists, recognised at Paris. The men holding the Trans-Siberian from Penza to Vladivostok are no longer soldiers working their way toward a front — they are an army waiting for ships, in a country whose civil war is not theirs. Their commanders have begun treating their remaining time in Russia as a question of extraction. Nothing about this government\'s dependence on that railway has changed.",
              meanwhile: {
                southRussia: "The Volunteer Army has been consolidated as the Armed Forces of South Russia under Denikin, and the Armistice has freed Allied shipping to reach Novorossiysk with supplies for the first time in quantity.",
                bolsheviks: "The Armistice annulled Brest-Litovsk. German forces are withdrawing from Ukraine, and the Red Army is moving into the vacuum they leave behind.",
              },
            },
            historicalRecord: false,
            situation:
              "The assertion backfired, and Semyonov's staff now has a cleaner story for continued non-cooperation than they had before Omsk tried to correct the record. Whether to escalate the assertion further — formally, on the record, risking an open rupture — or quietly let the matter drop and accept that this particular approach didn't work, is the real choice a failed assertion has left behind.",
            choices: [
              {
                label: "Escalate. A half-measure that backfired is worse than either full commitment or none — press the point formally.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I have already tried the moderate version of this and watched it hand Semyonov's staff an excuse instead of a correction. I am not inclined to leave the record standing at 'attempted and failed' when escalating it costs little more than the attempt already did.",
                },
                historical: false,
                setFlags: { assertionEscalation: "escalated" },
                impact: { rail: -2 },
                next: "springOffensive19",
                outcome:
                  "The assertion is pressed further, formally, on the record. It risks the open rupture the original message was specifically designed to avoid — an escalation of a relationship that was already the campaign's most persistent authority problem before this exchange made it more so.",
              },
              {
                label: "Let it drop. The approach didn't work; repeating it more forcefully isn't likely to work better.",
                advisor: {
                  name: "Vologodsky",
                  quote:
                    "I said at the outset that silence carries its own risk. I did not say every risk is worth answering with a bigger version of the same failed approach. Let this one go.",
                },
                historical: false,
                setFlags: { assertionEscalation: "dropped" },
                impact: {},
                next: "springOffensive19",
                outcome:
                  "The matter is allowed to drop. The relationship with Semyonov returns to its baseline — no worse than it was before the assertion, no better either, the whole exchange a real but ultimately inconclusive attempt to correct a problem that was never going to be solved by correspondence alone.",
              },
            ],
          };

        // -------------------------------------------------------------------
        case "springOffensive19":
          return {
            date: "MARCH 1919",
            title: "Omsk: The Spring Offensive",
            bulletin: {
              headline: "MOSCOW DECLARES FOR WORLD REVOLUTION",
              body: "A congress in Moscow this month declares itself the Communist International, aim stated plainly: revolution beyond Russia's own borders. Foreign delegate attendance was thin, several parties represented in name only — but the declaration answers the one question every Allied government has been weighing: whether Bolshevik Russia means to stay inside its own borders. On the record now, it does not.",
              meanwhile: {
                southRussia: "A comparatively quiet stretch for the AFSR — Denikin's forces regrouping through the winter before the summer offensive that becomes the Moscow Directive in July.",
                bolsheviks: "The Eighth Party Congress is meeting in this same city, this same month — the Military Opposition's fight over relying on ex-Imperial officers is being argued in parallel with the Comintern's own founding sessions.",
              },
            },
            historicalRecord: true,
            situation:
              "Your armies have broken the Red center and are approaching the Volga — the largest White force in Russia, at its historical high point. Denikin has written from the south, proposing a junction at Saratov for a combined march on Moscow. Gajda argues for continuing north instead, toward Vyatka and a link with the Allied force at Archangel." +
              (flags.assertionEscalation === "escalated"
                ? " The formal escalation with Semyonov has left the Transbaikal rear on worse terms than it was. Neither axis under discussion here can be supplied through a rear that is now openly contested."
                : flags.assertionEscalation === "dropped"
                ? " The Semyonov question was allowed to drop. The Transbaikal rear is exactly as reliable as it was before the attempt, which is to say the supply for either axis rests on an ataman's continued goodwill."
                : ""),
            choices: [
              {
                label: "Continue the northward drive toward Vyatka, pursuing the Archangel junction.",
                advisor: {
                  name: "Gajda",
                  quote:
                    "The Allied force at Archangel is real, supplied, and waiting. Denikin's proposal asks us to abandon a plan already succeeding for one that exists only in a letter.",
                },
                historical: true,
                setFlags: { offensiveDirection: "north" },
                impact: {},
                next: "ufaCounteroffensive19",
                outcome:
                  "The northward push continues. It gains ground for another month before the overextension Denikin's letter warned about starts to show in the supply returns.",
              },
              {
                label: "Divert south toward Saratov, attempting the junction with Denikin's forces.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "Denikin is right that a combined front is worth more than two fronts advancing alone. Whether we can actually reach Saratov before the Red reserves reach us first is a separate question entirely.",
                },
                historical: false,
                setFlags: { offensiveDirection: "south" },
                impact: { manpower: -1, materiel: -1, rail: -1 },
                costsCapital: true,
                next: "saratovJunction19",
                outcome:
                  "The diversion order overrides Gajda's standing dispositions without his agreement — a decision that will not be forgotten. The southward march begins, exposed on a flank it was never prepared to defend.",
              },
              {
                label: "Neither flank. Concentrate on the central axis — drive straight west on Kazan and Nizhny Novgorod.",
                advisor: {
                  name: "Sakharov",
                  quote:
                    "Gajda wants Archangel and Denikin wants Saratov, and both of them are asking this army to march away from the only objective that ends the war. The Red centre is what broke in March. Kazan is the road to Moscow and it is open now in a way it will not be in June.",
                },
                historical: false,
                setFlags: { offensiveDirection: "centre" },
                impact: { manpower: -1, rail: 1 },
                aftermath:
                  "No central concentration was attempted. The Siberian Army went north under Gajda and the Western Army south-west under Khanzhin, and the gap between them was where Frunze's counteroffensive went in at Buguruslan in late April. Sakharov's argument for concentration was made at the time and made again at length in his 1923 emigre account, which is not a neutral source about a plan he proposed himself.",
                next: "ufaCounteroffensive19",
                outcome:
                  "Both flank proposals are refused and the weight goes to the centre. It concentrates a force that was dangerously dispersed, and it does so along the axis where the Red command has the shortest distance to reinforce — Kazan is close to Moscow in both directions.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of the speculative southward-diversion
        // choice at the spring offensive. historicalRecord false throughout.
        case "saratovJunction19":
          return {
            date: "MAY 1919",
            title: "The Southern Flank",
            historicalRecord: false,
            situation:
              "The southward diversion toward Denikin has exposed a flank Gajda's original northern plan never had to worry about. Word from the south is that Denikin's own forces are pushing toward Tsaritsyn — the junction Kolchak proposed might genuinely be within reach. It might also be the reason the Red reserves massing to the east go unnoticed until they've already turned this army's undefended flank.",
            choices: [
              {
                label: "Continue toward the junction. The political value of a combined White front may be worth the flank risk.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "A combined front with Denikin is worth more to the movement than any ground either of us holds alone. That calculation is considerably easier to make from a desk in Omsk than it will be to defend on the flank it actually costs, and I am not going to pretend otherwise to make it sound braver.",
                },
                historical: false,
                setFlags: { saratovChoice: "continue" },
                impact: { manpower: -4, rail: -2 },
                next: "exposedFlank19",
                outcome:
                  "The push continues. The exposed flank is exactly as costly as feared — by the time contact with Denikin's forces looks even theoretically possible, the eastern reserves this diversion ignored have already begun the counteroffensive that was always coming regardless.",
              },
              {
                label: "Pull back from the junction attempt and shore up the exposed flank instead.",
                advisor: {
                  name: "Gajda",
                  quote:
                    "I opposed this diversion from the start, but I will not pretend reversing it now is free. It is still better than losing the flank entirely to a counteroffensive we should have seen coming the moment we turned south.",
                },
                historical: false,
                setFlags: { saratovChoice: "withdraw" },
                impact: { manpower: 2, rail: 3 },
                next: "ufaCounteroffensive19",
                outcome:
                  "The withdrawal from the junction attempt happens in time to matter, if only barely. The flank holds a little longer than it otherwise would have — not because the underlying position was ever strong, but because the exposure was corrected before the counteroffensive fully arrived.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of continuing the Saratov push.
        // historicalRecord false throughout: this is what the ignored
        // eastern reserves actually do once they arrive, not a documented
        // event.
        case "exposedFlank19":
          return {
            date: "MAY 1919",
            title: "The Flank: What the Reserves Found",
            historicalRecord: false,
            situation:
              "The eastern reserves have reached the flank the southward push left uncovered, and they haven't wasted the opening. What's left of the army pressing toward Saratov now has to decide whether to abandon the junction attempt outright to meet the threat, or trust that the political value of reaching Denikin is still worth fighting through an active counteroffensive rather than turning to face it.",
            choices: [
              {
                label: "Turn to meet the counteroffensive directly. The junction can wait; the flank can't.",
                advisor: {
                  name: "Gajda",
                  quote:
                    "I told you what this would cost when you overruled me. I am not going to spend more time being right about it than it takes to actually turn this army around and face the threat that's already here.",
                },
                historical: false,
                setFlags: { exposedFlankChoice: "turn_to_meet" },
                impact: { manpower: -2, rail: 2 },
                next: "ufaCounteroffensive19",
                outcome:
                  "The army turns to face the threat rather than press on. It costs the Saratov attempt entirely — the junction that was never going to happen anyway is now also not going to be the reason this army says it turned back.",
              },
              {
                label: "Press on toward Saratov anyway. Fight through the counteroffensive rather than let it dictate the campaign's direction.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "There is an argument for turning back, and I have heard it stated correctly. What I do not believe is that an army which reverses its own strategic direction every time a Red counteroffensive materializes was ever going to reach a junction with anyone, on any axis, at any point in this war.",
                },
                historical: false,
                setFlags: { exposedFlankChoice: "press_on" },
                impact: { manpower: -3, rail: -2 },
                next: "ufaCounteroffensive19",
                gate: (m) => m.manpower >= -5,
                disabledReason: "fighting through an active counteroffensive requires an army still capable of fighting through one — this force is already too depleted to press on rather than turn.",
                outcome:
                  "The push continues through the counteroffensive rather than around it. It costs considerably more than turning to meet the threat would have — and it doesn't produce a junction with Denikin either, since the Red reserves were never actually the only obstacle between here and Saratov.",
              },
            ],
          };

        case "ufaCounteroffensive19":
          return {
            date: "JUNE 1919",
            title: "Ufa: The Red Counteroffensive",
            bulletin: {
              headline: "PARIS WILL RECOGNISE OMSK. ON CONDITIONS.",
              body: "The Allied Supreme Council has replied to this government\'s request for recognition with terms rather than an answer: a commitment to convene a Constituent Assembly, to accept the independence of Poland and Finland, to honour Russia\'s foreign debts, and to submit other border questions to the League of Nations. Recognition is offered against a promise about what this government would do after winning a war it is currently losing. Denikin has already accepted this command\'s seniority; the Allies have not.",
              meanwhile: {
                southRussia: "Denikin took Kharkov in June and is preparing the order that becomes the Moscow Directive — the southern front at its strongest exactly as this one breaks.",
                bolsheviks: "The Red counteroffensive out of Buguruslan has already reversed the spring advance. Moscow\'s attention is turning south, toward the front that is still growing.",
              },
            },
            historicalRecord: true,
            situation:
              "The Red counteroffensive has broken through and retaken Ufa. Your armies are falling back toward the Urals with their supply lines already strained. The mountains offer a natural defensive line — but holding them means committing reserves you may need for the much longer retreat behind them." +
              (flags.offensiveDirection === "north"
                ? " The northern drive toward Vyatka and the Archangel junction is now a salient pointing at nothing, and the units in it are the ones furthest from the line the Urals would have to be held with."
                : flags.offensiveDirection === "south"
                ? " The southward diversion toward Denikin never reached him, and the counteroffensive has arrived while the army is still strung out along an axis chosen for a junction that did not happen."
                : flags.offensiveDirection === "centre"
                ? " The army went west in one body rather than splitting toward Archangel or Saratov, so there is no gap between two armies for the counteroffensive to enter. It has come at the concentration head-on instead, which is a different problem and not obviously a smaller one."
                : ""),
            choices: [
              {
                label: "Stand at the Urals. Commit the reserves to holding the line.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "Give up the mountains without a fight and there is no natural line between here and Omsk. We hold here, or we do not hold anywhere.",
                },
                historical: false,
                setFlags: { uralsStand: true },
                impact: { manpower: -3, materiel: -2, rail: 3 },
                next: "chelyabinskGrinder19",
                gate: (m) => m.manpower >= -3 && m.materiel >= -5,
                disabledReason: "Holding a fixed line requires reserves to commit and the matériel to equip them — the reserves exist on paper and cannot be armed to stand.",
                outcome:
                  "The reserves go into the Urals line. It slows the Red advance for several weeks — at a cost the army can less and less afford to pay again.",
              },
              {
                label: "Withdraw in good order toward the Trans-Siberian. Preserve the army for the line at Omsk.",
                advisor: {
                  name: "Gajda",
                  quote:
                    "The mountains are not the war. The railway is the war — it is the only thing keeping this army fed, armed, and moving. Spend men holding rock and you will still lose the line that matters.",
                },
                historical: true,
                setFlags: { uralsStand: false },
                impact: {},
                next: "railPriority19",
                outcome:
                  "The withdrawal continues past the Urals largely intact. But it concedes the last natural obstacle between the front and Omsk itself, with nothing but open steppe and a single rail line behind it.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of committing reserves to a stand at
        // the Urals. historicalRecord true: the battle for Chelyabinsk and
        // its outcome are real regardless of exactly how command handles the
        // counterattack decision within it.
        case "chelyabinskGrinder19":
          return {
            date: "JULY 1919",
            title: "Chelyabinsk: The Grinder",
            bulletin: {
              headline: "DENIKIN AT HIS HIGH-WATER MARK",
              body: "This front is fighting for a rail junction it cannot afford to lose, in the same weeks the southern White front reaches the furthest extent of its own advance. Two theatres, one movement, moving in opposite directions.",
              meanwhile: {
                southRussia: "Kharkov fell to Denikin's forces at the end of June. On 3 July he issues the Moscow Directive, ordering a broad-front advance on the capital — the most ambitious single order of the entire war, and the one the southern command is currently executing at full confidence.",
                bolsheviks: "The 'Military Opposition' fight from March's Party Congress is still unsettled in practice even where it was formally resolved on paper. Trotsky remains under real internal criticism even as the southern front, the one actually threatening Moscow, continues to worsen.",
              },
            },
            historicalRecord: true,
            situation:
              "The reserves committed to the Urals line have reached Chelyabinsk, and General Diterichs is proposing a counterattack to retake the city's rail junction before Frunze's 3rd Army can fully consolidate around it — a strike that, if it works, could stabilize the whole southern flank of the retreat. Frunze's forces are already massing for exactly this contingency." +
              (flags.uralsStand === true
                ? " These are the reserves committed to standing at the Urals rather than withheld for the retreat behind it. Diterichs is proposing to spend them a second time, on the argument that the first commitment only makes sense if it is followed through."
                : ""),
            choices: [
              {
                label: "Commit to Diterichs' counterattack. Throw the reserves into retaking the city.",
                advisor: {
                  name: "Diterichs",
                  quote:
                    "Today the army must deliver a decisive blow to the Chelyabinsk group, or every mile we have already spent holding the Urals line was spent for nothing. This is the moment that decision either pays for itself or doesn't.",
                },
                historical: true,
                setFlags: { chelyabinskChoice: "counterattack" },
                impact: {},
                next: "railPriority19",
                outcome:
                  "The counterattack goes in on July 29 — directly into Frunze's prepared flanking strike. What follows becomes known simply as the Chelyabinsk grinder: roughly 15,000 men captured, the reserves that were meant to stabilize the southern flank instead consumed by it. The army does not recover its strategic initiative after this. It never really had the chance to.",
              },
              {
                label: "Decline the counterattack. Pull the reserves back to a more defensible line rather than commit them to urban fighting.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I do not relish overruling Diterichs on the ground. I relish even less the prospect of losing the reserves we already sacrificed the Urals timeline to preserve, in a fight inside a city Frunze has clearly built his own plan around.",
                },
                historical: false,
                setFlags: { chelyabinskChoice: "withdraw" },
                impact: { manpower: 3 },
                next: "diterichsOverruled19",
                outcome:
                  "The counterattack is called off. The reserves survive intact — the grinder simply doesn't happen this way. What doesn't change is the broader collapse: Chelyabinsk falls regardless, the strategic initiative is gone regardless, and this choice's real effect is on how many men are still alive to retreat further, not on whether the retreat itself continues.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of overruling Diterichs on the
        // ground. historicalRecord false: the specific aftermath is
        // invented, but it tests something real already in his own dossier
        // — a man who would go on to frame his own last command, two years
        // later, explicitly as a religious crusade. Being overruled here, by
        // an admiral he privately regards as a British-installed political
        // appointee rather than a real soldier, is exactly the kind of
        // grievance that account makes plausible.
        case "diterichsOverruled19":
          return {
            date: "AUGUST 1919",
            title: "The General Overruled",
            historicalRecord: false,
            situation:
              "Diterichs has accepted the countermanded order without public objection — but the request to relieve him of Third Army command, quietly submitted the following week, is sitting on your desk. Whether to accept it and let him go, or refuse it and keep a capable but visibly resentful general in place, is a real command decision with no clean answer.",
            choices: [
              {
                label: "Accept the resignation request. A commander who no longer trusts your judgment isn't one you can rely on regardless of his competence.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I would rather lose a capable general who has already told me, in every way but directly, that he does not trust this command's judgment, than keep him in place and discover exactly how far that distrust extends the next time I need to overrule him.",
                },
                historical: false,
                setFlags: { diterichsHandling: "released" },
                impact: { manpower: -1 },
                next: "thirdArmySuccessor19",
                outcome:
                  "Diterichs is released from Third Army command. The Eastern Front loses a genuinely capable officer over a disagreement that, in the broader collapse already underway, may not have mattered much either way — but the precedent of a general who can simply request his way out of a command he disagrees with is its own real cost.",
              },
              {
                label: "Refuse the request. Keep Diterichs in command and address the resentment directly rather than lose the officer.",
                advisor: {
                  name: "Diterichs",
                  quote:
                    "I did not submit that request lightly, and I will not pretend a refusal resolves what prompted it. But if you are asking me to stay, I will stay — competently, and without the illusion that this settles what I actually think about how that order was given.",
                },
                historical: false,
                setFlags: { diterichsHandling: "retained" },
                impact: { manpower: 2 },
                next: "railPriority19",
                outcome:
                  "Diterichs stays. The competence is retained; the resentment isn't resolved, only deferred — carried forward, unaddressed, into a command relationship that this decision has made no more trusting than it already wasn't.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of releasing Diterichs. historical-
        // Record false: this specific succession decision is invented.
        case "thirdArmySuccessor19":
          return {
            date: "SEPTEMBER 1919",
            title: "Third Army: Who Replaces a Capable General",
            historicalRecord: false,
            situation:
              "Third Army needs a new commander, and the two realistic candidates represent a trade-off this command has faced before: a proven but politically cautious senior officer with no independent standing to challenge future orders, or a less experienced but genuinely talented younger commander whose independence is exactly what made Diterichs difficult in the first place.",
            choices: [
              {
                label: "Promote the cautious senior officer. Competence that won't argue is worth more right now than competence that might.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I have just spent a command decision on a general whose independence became a liability. I am not eager to install his replacement's replacement on the same trajectory within the year.",
                },
                historical: false,
                setFlags: { thirdArmySuccessor: "cautious" },
                impact: { manpower: -1, rail: 1 },
                next: "railPriority19",
                outcome:
                  "The cautious officer takes command. Third Army gets a commander unlikely to repeat Diterichs' problem — and, by the same logic, one less likely to make the kind of independent judgment call that occasionally justified Diterichs' confidence in the first place.",
              },
              {
                label: "Promote the talented but independent younger officer. The Front needs genuine ability more than it needs another compliant appointment.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "I understand the caution after Diterichs. I would still rather have a commander capable of a genuinely good independent decision under pressure than one whose main qualification is being unlikely to make one at all.",
                },
                historical: false,
                setFlags: { thirdArmySuccessor: "independent" },
                impact: { manpower: 2, rail: -1 },
                next: "railPriority19",
                outcome:
                  "The independent officer takes command. Third Army gets the talent — and this command has, by its own recent history, just accepted the risk that the next disagreement over an order won't stay as contained as this one eventually was.",
              },
            ],
          };

        // -------------------------------------------------------------------
        case "railPriority19":
          return {
            date: "NOVEMBER 1919",
            title: "Omsk: The Evacuation Trains",
            historicalRecord: true,
            context:
              "The Trans-Siberian east of Omsk is a single track. Roughly 60,000 Czechoslovak Legion troops control its stations and junctions under an arrangement that made them responsible for guarding the line rather than fighting on it, and their commander answers to the French general Maurice Janin, not to Omsk. Kolchak's own train carries what remains of the imperial gold reserve seized at Kazan in 1918 — some 500 tons of bullion. Omsk falls on 14 November. Roughly a million refugees, soldiers, and officials are trying to move east along one line at the same time.",
            situation:
              "Omsk is being evacuated. The Trans-Siberian has one track and far more trains than it can move at once — government trains, army trains, refugee trains, and the Czechoslovak Legion's own trains, all converging on the same line. The Legion controls the junctions. What moves, and in what order, is no longer entirely your decision to make." +
              (flags.diterichsHandling === "released"
                ? " Diterichs, who argued for abandoning Omsk before it came to this, is no longer in a position to say so. The evacuation he wanted is happening on the schedule he warned it would happen on."
                : flags.diterichsHandling === "retained"
                ? " Diterichs is still in command and has not mentioned that he argued for abandoning Omsk before it came to this. His staff have mentioned it for him."
                : "") +
              (flags.thirdArmySuccessor === "independent"
                ? " Third Army's new commander has already begun making dispositions without waiting for confirmation from a headquarters that is currently loading onto trains."
                : flags.thirdArmySuccessor === "cautious"
                ? " Third Army's new commander is waiting for orders from a headquarters that is currently loading onto trains, which is exactly the behavior he was promoted for."
                : ""),
            choices: [
              {
                label: "Assert priority for the government and gold reserve trains over the Legion's own.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "The Legion has fought alongside us for a year and profited from every mile of that railway. If they will not yield the junction to their own government's evacuation, say so plainly and we will know exactly where we stand.",
                },
                historical: true,
                setFlags: { railPriorityAsserted: true },
                impact: { materiel: -1 },
                costsCapital: true,
                gate: (m) => m.rail >= -4,
                disabledReason: "Rail control too degraded — the Legion holds the junctions outright and a demand from this headquarters would not reach the men operating the switches.",
                aftermath:
                  "The Legion did not yield the junctions. Kolchak's train was repeatedly sidetracked in favour of Legion echelons through November and December, and he was reduced to travelling under Legion guard rather than his own. The Supreme Ruler of Russia spent the last two months of his government waiting on sidings for permission to move along a railway his government nominally owned.",
                next: "iceMarchDecision19",
                outcome:
                  "The order is given. Whether the Legion honors it, and what that answer costs the authority of a government that no longer controls its own evacuation, is written next.",
              },
              {
                label: "Concede priority to the Legion's trains and negotiate passage for the rest.",
                advisor: {
                  name: "Sakharov",
                  quote:
                    "You do not have the leverage to make demands of the men holding the only railway east of here. I argued once for concentrating this army instead of splitting it, and lost that argument too — I am not going to lose a second one to pride when the answer is this obvious. Negotiate, and you may still get your trains through. Demand, and you will not.",
                },
                historical: false,
                setFlags: { railPriorityAsserted: false },
                // Conceding priority is the pragmatic call — unless the rail
                // position is already so bad that conceding means having nothing.
                nextIf: (m) => (m.rail <= -6 ? "endingOmskFalls19" : null),
                impact: { rail: 1 },
                next: "janinsWord19",
                outcome:
                  "The concession is made quietly, without an order on record. Whether yielding the junction buys the Legion's continued cooperation, or merely postpones the same betrayal by a few weeks once Bolshevik forces are closer to Irkutsk, is a real point of dispute — the Legion's own command was neither unified nor fully in control of its constituent units by this point in the retreat. Which way it fell here is rolled.",
                uncertain: (() => {
                  const cooperativeWeight = modWeight(40, meterPct(meters.rail));
                  return [
                    {
                      weight: cooperativeWeight,
                      title: "The concession buys real cooperation",
                      setFlags: { legionOutcome: "cooperative" },
                      impact: { rail: 2 },
                      outcome:
                        "The Legion honors the arrangement further than expected. It is not loyalty — it is self-interest in an orderly eastward evacuation — but for now the government trains keep moving.",
                    },
                    {
                      weight: 100 - cooperativeWeight,
                      title: "The concession only delays the reckoning",
                      setFlags: { legionOutcome: "delayed_betrayal" },
                      impact: { rail: -2 },
                      outcome:
                        "Individual Legion units continue prioritizing their own trains regardless of the arrangement. The concession bought weeks, not safety — and the question of what happens when Bolshevik forces close on Irkutsk has only been postponed.",
                    },
                  ];
                })(),
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of conceding rail priority to the
        // Legion. Both choices historical:false — General Janin's actual
        // betrayal of Kolchak happens on a fixed historical timeline (January
        // 1920) regardless of this earlier choice, so nothing here is trying
        // to avert it. What differs is whether the government's own posture
        // toward Janin's guarantee going in is trusting or wary.
        case "janinsWord19":
          return {
            date: "DECEMBER 1919",
            title: "The General's Word",
            historicalRecord: false,
            situation:
              "With rail priority already conceded, General Janin — the Allied commander who actually controls whether the Legion cooperates at all — is offering something more formal: his personal guarantee of safe passage for the Supreme Ruler's train, in exchange for placing the evacuation openly under his protection rather than negotiating piecemeal with individual Legion units.",
            choices: [
              {
                label: "Accept Janin's guarantee. Place the evacuation formally under Allied protection.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "I do not particularly trust a general who regards me as a British instrument he was never consulted about installing. I trust the alternative — negotiating separately with every Legion unit between here and Irkutsk — even less.",
                },
                historical: false,
                setFlags: { janinChoice: "accepted" },
                impact: { rail: 3, materiel: 2 },
                next: "irkutskUltimatum20",
                outcome:
                  "The guarantee is accepted, formally, in writing. It changes nothing about what happens in January — Janin gives his word to protect Kolchak and orders the handover to the Political Centre days later regardless. Among White émigrés afterward, he becomes known simply as 'the general without honor.' This choice bought a smoother December. It did not buy a different January.",
              },
              {
                label: "Decline the formal guarantee. Continue negotiating passage independently rather than depend on Janin's word.",
                advisor: {
                  name: "Kolchak",
                  quote:
                    "A guarantee that depends entirely on one foreign general's discretion is not a guarantee — it is a hope with better paperwork. I would rather retain whatever independent leverage this government still has than trade it for a document.",
                },
                historical: false,
                setFlags: { janinChoice: "declined" },
                impact: { rail: -2, materiel: -2 },
                next: "irkutskUltimatum20",
                outcome:
                  "The formal guarantee is declined. It does not meaningfully change the eventual outcome — Janin's authority over the Legion's cooperation was never actually contingent on Kolchak's own consent to it — but whether independent negotiation in the following weeks buys any marginal improvement in the trains' treatment is unsettled. The roll settles it.",
                uncertain: (() => {
                  const gainsWeight = modWeight(30, meterPct(meters.rail));
                  return [
                    {
                      weight: gainsWeight,
                      title: "Independent negotiation buys small, real concessions",
                      setFlags: { janinDeclinedOutcome: "marginal_gain" },
                      impact: { rail: 2 },
                      outcome:
                        "Working the individual Legion units directly, rather than through Janin's office, produces a handful of small, real concessions on train scheduling. It changes nothing about January. It changes something about the weeks leading up to it.",
                    },
                    {
                      weight: 100 - gainsWeight,
                      title: "Independent negotiation gains nothing Janin's guarantee wouldn't have",
                      setFlags: { janinDeclinedOutcome: "no_gain" },
                      impact: { rail: -1 },
                      outcome:
                        "The individual units defer to Janin's office regardless of who's asking. Declining the formal guarantee preserved a principle without buying any practical advantage over the alternative.",
                    },
                  ];
                })(),
              },
            ],
          };

        // -------------------------------------------------------------------
        case "iceMarchDecision19":
          return {
            date: "DECEMBER 1919",
            title: "The Trakt: Who Rides, Who Walks",
            historicalRecord: true,
            situation:
              "Krasnoyarsk has fallen and the Trans-Siberian behind it is no longer a way out. What remains of the army under General Kappel is striking east overland, across the frozen Kan and Yenisei, in temperatures that kill exposed skin in minutes. A typhus outbreak is spreading through the column. The sick and wounded are slowing the march to a pace that may cost everyone still capable of walking their chance of reaching Chita alive." +
              (flags.railPriorityAsserted === true
                ? " The order asserting government priority over the Legion's trains is what the overland march is the answer to. It was given, it was not honored, and the column is walking."
                : flags.railPriorityAsserted === false
                ? " Priority was conceded to the Legion rather than demanded from it. The concession bought passage for some trains and not for this column, which is walking regardless."
                : ""),
            choices: [
              {
                label: "Press forward at full pace. Combat-effective troops keep moving; the worst-off are left with the trains that can no longer keep up.",
                advisor: {
                  name: "Kappel",
                  quote:
                    "I take no comfort in this order, and I will not pretend to anyone that I do. But a column that stops for every man who cannot walk becomes a column that saves no one — least of all the men we stopped for.",
                },
                historical: true,
                setFlags: { iceMarchPolicy: "press_forward" },
                impact: {},
                next: "irkutskUltimatum20",
                outcome:
                  "The order goes out and the column keeps moving. Entire trainloads of typhus-stricken men are left behind on the track — some rail cars freeze shut with the sick still inside them. It is the decision the record actually shows: roughly 30,000 reach Chita by March. The ones who don't are not softened by the operational logic that left them.",
              },
              {
                label: "Hold the column together. The sick and wounded stay with the main body regardless of pace.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "I understand the arithmetic against this. I am telling you that an army which abandons its own sick to freeze in locked railcars is not an army I am confident will hold together for whatever comes after this march, whatever the pace bought us.",
                },
                historical: false,
                setFlags: { iceMarchPolicy: "held_together" },
                impact: { manpower: -2 },
                costsCapital: true,
                next: "eichesPursuit20",
                outcome:
                  "The column moves as one, at the pace of its slowest wagons. Whether the men and matériel this costs against the pursuing Red 5th Army are outweighed by whatever cohesion a column that didn't abandon its own sick carries forward is a real, unresolved question — the historical record shows what leaving them cost in lives saved by speed. It does not show what holding together would have cost in everything else.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of holding the column together at a
        // slower pace. historicalRecord false: this specific engagement is
        // invented, but Genrich Eiche's Red 5th Army pursuit of the retreat
        // is real, and the reduced pace is a direct, checkable consequence
        // of the choice at iceMarchDecision19.
        case "eichesPursuit20":
          return {
            date: "JANUARY 1920",
            title: "The Distance Eiche Closed",
            historicalRecord: false,
            situation:
              "The slower pace has cost the column exactly what it was expected to: Genrich Eiche's pursuing Red 5th Army has closed the gap enough that its advance elements are now in contact with the rearguard. Voitsekhovsky has to decide whether to turn and fight to buy the main column time, or keep moving and accept that the rearguard will absorb whatever the pursuit throws at it without support." +
              (flags.iceMarchPolicy === "held_together"
                ? " The column was kept together at the pace of its slowest wagons rather than broken into a fast element and an abandoned one. This contact is the bill for that decision, arriving on schedule."
                : ""),
            choices: [
              {
                label: "Turn the rearguard to fight. Buy the column time at the cost of the men holding the line.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "I did not argue for holding the column together so that the first contact with Eiche's advance guard scatters it anyway. A rearguard that actually fights buys real distance. One that simply keeps retreating buys nothing but a shorter chase.",
                },
                historical: false,
                setFlags: { eichePursuitChoice: "fight" },
                impact: { manpower: -3 },
                next: "irkutskUltimatum20",
                gate: (m) => m.manpower >= -3,
                disabledReason: "a rearguard that fights needs a rearguard capable of fighting — this column's manpower is already too depleted to spare one.",
                outcome:
                  "The rearguard turns and holds long enough for the column to widen its lead. It's a small vindication of the choice to hold together in the first place — bought, as everything on this march has been, at a cost measured in the men who did the holding.",
              },
              {
                label: "Keep the whole column moving. Accept the rearguard's exposure rather than slow down further to support it.",
                advisor: {
                  name: "A Column Staff Officer",
                  quote:
                    "General Kappel made the argument for speed himself, before the frostbite took him off the column entirely. I am only repeating it now because he no longer can. I am not going to pretend slowing down again to reinforce a rearguard skirmish is free — but it was never his argument that it would be.",
                },
                historical: false,
                setFlags: { eichePursuitChoice: "continue" },
                impact: { manpower: 1 },
                next: "irkutskUltimatum20",
                outcome:
                  "The column keeps moving without turning to reinforce the contact. The rearguard absorbs what the pursuit throws at it alone — costly in a different way than the fight would have been, and no cleaner a resolution to the argument this whole branch started with.",
              },
            ],
          };

        // -------------------------------------------------------------------
        case "irkutskUltimatum20":
          return {
            date: "FEBRUARY 1920",
            title: "Irkutsk: The Ultimatum",
            bulletin: {
              headline: "THE OTHER WHITE FRONT IS ALSO COLLAPSING",
              body: "Not the only White army in general retreat this month. Two thousand miles west, the same arithmetic runs on its own schedule, against its own version of the same exhausted logistics.",
              meanwhile: {
                southRussia: "Denikin's own front has broken entirely. Novorossiysk, the port his retreating army is converging on, will be the site of a chaotic evacuation within weeks — tens of thousands left on the docks, the Cossack formations that made up much of his army effectively dissolving as organized units.",
                bolsheviks: "With Denikin's collapse in the south now visible and this front's own end approaching, Moscow's attention is beginning to turn toward a question that will define the rest of the year: how far west the Red Army's own ambitions should now reach.",
              },
            },
            historicalRecord: true,
            situation:
              "Kappel is dead; Voitsekhovsky commands what is left of the army, one day's march from Irkutsk, where the Political Centre holds Kolchak prisoner. An ultimatum has already gone to the city: let the army pass unopposed, and release the Admiral. The Reds have not answered it with a release. They have answered it with defenses.",
            choices: [
              {
                label: "Attack. Force the issue at Irkutsk and try to take Kolchak back by strength.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "He would not have left any of us to a Political Centre firing squad if the positions were reversed, and I am not prepared to be the man who decided it was more practical to leave him to one. We go in.",
                },
                historical: true,
                setFlags: { irkutskChoice: "assault" },
                impact: {},
                uncertain: [
                  {
                    title: "The column holds together and goes on east",
                    weight: 70,
                    setFlags: { irkutskAssaultOutcome: "column_survives" },
                    impact: { manpower: -2 },
                    next: "semyonovMerger20",
                    outcome:
                      "The assault reaches Innokentievskaya, seven kilometers from the city, before the line holds. Kolchak is executed before dawn on February 7 — the Bolshevik command's own stated reason is to remove the army's motive for taking the city at all. By the 8th, what is left of the army bypasses Irkutsk and continues east without him, still recognisably a formation.",
                  },
                  {
                    title: "The assault breaks the column as well as failing",
                    weight: 30,
                    setFlags: { irkutskAssaultOutcome: "column_broken" },
                    impact: { manpower: -3 },
                    next: "endingTheAdmiralAtIrkutsk20",
                    outcome:
                      "The assault reaches Innokentievskaya and stops there. Kolchak is shot before dawn on February 7. What breaks with him is the column's own reason to remain a column — the formation that historically bypassed the city and went on does not re-form here, and the men who tried to reach him go east as individuals or not at all.",
                  },
                ],
                next: "semyonovMerger20",
                outcome:
                  "The order goes out. Voitsekhovsky's men move on the city with the Admiral seven kilometers away and a Political Centre garrison between.",
              },
              {
                label: "Do not attack. Accept the Political Centre's terms and bypass the city, prioritizing the army's survival over the rescue.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "I have already told you what I think of leaving him. I am telling you now, separately, what a failed assault against a fortified city with an army this exhausted actually costs — because that arithmetic does not go away just because the other argument is the more honorable one.",
                },
                historical: false,
                setFlags: { irkutskChoice: "bypass" },
                impact: { manpower: 3 },
                next: "semyonovMerger20",
                outcome:
                  "The army bypasses Irkutsk without contesting it. Kolchak is executed regardless, on the same timeline, for the same stated reason — the Bolshevik command was not, in the end, negotiating in good faith on his release either way. What this choice changes is not his fate. It is how many of the men following Voitsekhovsky are still alive to reach Chita.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // ---------------------------------------------------------------------
        // ENDING — the campaign ending at Irkutsk in February 1920 rather than
        // at the Manchurian border eight months later. Every other ending in
        // this campaign is a variant of "where did the column get to"; this is
        // the one where the government itself ends, and it ends first.
        // Reached by pressing the assault at Irkutsk and having it fail badly
        // enough that the column stops being an army with anywhere to go.
        // historicalRecord true for everything it describes: the handover, the
        // execution, and the Ushakovka.
        case "endingTheAdmiralAtIrkutsk20":
          return {
            isEnding: true,
            title: "The Admiral at Irkutsk",
            date: "FEBRUARY 1920",
            badge: "◆ HISTORICAL RECORD",
            classification: "historical",
            epilogue:
              "The assault does not take the city, and after it fails there is no longer a government to retreat on behalf of. Kolchak was handed to the Political Centre by the Czechoslovak Legion on 15 January 1920, passed from them to the Bolshevik Revolutionary Committee, interrogated over nine sessions whose transcripts survive, and shot alongside his prime minister Viktor Pepelyaev before dawn on 7 February. The bodies were pushed under the ice of the Ushakovka. There is no grave.\n\nWhat this account records is not the death — that was never in doubt — but the fact that this command spent itself trying to prevent it and stopped existing in the attempt. Kappel was already dead of frostbite and pneumonia at Utai three weeks earlier. Voitsekhovsky's column, which historically bypassed the city and went on to reach Chita and then Manchuria as a formation, does not do so here. Men go east in groups, or they do not go east.\n\nThe Supreme Ruler's government lasted fourteen months. It was recognised by nobody who mattered, funded by a gold reserve it could not move along its own railway, and defended at the end by an army that had to choose between saving him and saving itself. Choosing him was defensible, and it was also the end of both.",
          };

        case "semyonovMerger20":
          return {
            date: "MARCH 1920",
            title: "Chita: A Loathed Necessity",
            historicalRecord: true,
            situation:
              "What is left of the army has reached Transbaikal, and with it, Ataman Semyonov — a Japanese-backed warlord whose own troops have a documented reputation for theft, arson, and murder against the civilians they're supposed to be protecting. Voitsekhovsky's officers loathe him without exception. He also controls the only functioning territory and supply base left to retreat into. He is offering to fold what remains of the Eastern Front into his own command as a single Far Eastern Army." +
              (flags.irkutskChoice === "assault"
                ? " The assault at Innokentievskaya spent men this column no longer has, and did not recover the Admiral. Semyonov is making his offer to a force that arrives smaller than it needed to be and without the man whose authority would have been the argument against accepting."
                : flags.irkutskChoice === "bypass"
                ? " Bypassing Irkutsk preserved the column at the cost of leaving Kolchak to the Political Centre. Semyonov is making his offer to officers who are intact, and who know exactly what was traded to keep them that way."
                : "") +
              (flags.irkutskAssaultOutcome === "column_survives"
                ? " That the column re-formed at all after Innokentievskaya is the only reason there is anything here for Semyonov to fold into his command. It was not a certainty on the night, and the officers who held it together know how close it ran."
                : ""),
            choices: [
              {
                label: "Accept the merger. Fold the army into Semyonov's command structure to survive the winter.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "I do not ask any of you to respect him. I ask you to recognize that an army that refuses shelter on principle, in this condition, in this season, is not making a stand — it is simply choosing a slower way to stop existing.",
                },
                historical: true,
                setFlags: { semyonovChoice: "merged" },
                impact: {},
                costsCapital: true,
                next: "chitaFall20",
                outcome:
                  "The Far Eastern Army is formed, nominally unified, in practice an uneasy coalition the officers who agreed to it did not stop resenting. It will not hold together for long — the same command tension that made this decision hard does not resolve just because the merger went through.",
              },
              {
                label: "Refuse. Attempt independent passage toward Manchuria rather than serve under Semyonov.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "I have said what I think of him plainly enough already. What I have not said is what an unsupplied march to the Chinese border, right now, in the state this army is actually in, is likely to cost — and I do not think that cost is smaller than the one we're trying to avoid.",
                },
                historical: false,
                setFlags: { semyonovChoice: "refused" },
                impact: { manpower: -3 },
                next: "manchurianBorder20",
                outcome:
                  "The army moves independently rather than merge. It reaches Manchuria diminished by the attempt — the same border Voitsekhovsky himself eventually crossed anyway, months later, after actually breaking with Semyonov for real. This crossing comes faster, and thinner.",
              },
            ],
          };

        // -------------------------------------------------------------------
        // DIVERGENT BRANCH — downstream of refusing the Semyonov merger and
        // attempting independent passage. historicalRecord true: Chinese
        // border policy toward unaffiliated White forces is real and well
        // documented — over 11,000 White soldiers, Semyonov's and Kappelite
        // troops alike, were disarmed at the Sino-Russian border and shipped
        // to Vladivostok regardless of which banner they arrived under, and
        // Ataman Dutov's independently-commanded Orenburg Cossacks — who
        // answered to no one but themselves — were separately disarmed and
        // interned by Chinese authorities in Xinjiang. Going it alone was
        // never obviously safer.
        case "manchurianBorder20":
          return {
            date: "APRIL 1920",
            title: "The Border: Whoever Asks Permission",
            bulletin: {
              headline: "THE INTERVENTION ENDS. JAPAN DOES NOT LEAVE.",
              body: "American forces completed their withdrawal from Vladivostok on 1 April; the British and French are gone. Japan alone remains, with roughly seventy thousand men in the Maritime Province and Transbaikal and no announced date for leaving. The intervention that justified itself in 1918 as a way to reconstitute an eastern front against Germany has outlived the German war by seventeen months, and what is left of it has nothing to do with Germany at all.",
              meanwhile: {
                southRussia: "Denikin resigned at Sevastopol on 4 April after Novorossiysk. Wrangel has the Crimea and roughly seven months in which to hold it.",
                bolsheviks: "A Far Eastern Republic has been proclaimed at Verkhneudinsk this month — a buffer state Moscow tolerates precisely to avoid a direct confrontation with the Japanese forces still ashore.",
              },
            },
            historicalRecord: true,
            situation:
              "The column has reached the Manchurian frontier without Semyonov's Japanese-backed diplomatic standing to smooth the crossing. Chinese border authorities, wary of White 'Russia one and indivisible' ambitions on their own territory, are demanding the column disarm before being permitted through — the same treatment independently-commanded White forces have received elsewhere on this frontier, regardless of how loathed or trusted their nominal patron was.",
            choices: [
              {
                label: "Comply. Surrender arms at the border rather than risk a confrontation with Chinese forces the column can't win.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "We left Semyonov specifically to avoid answering to someone else's authority, and now I am recommending we answer to China's instead. I do not see a version of reaching safety from here that doesn't run through someone else's terms.",
                },
                historical: true,
                setFlags: { borderChoice: "disarm" },
                impact: {},
                next: "endingDispersedAtTheBorder",
                outcome:
                  "The column disarms at the border, as thousands of other White troops — Semyonov's own men among them — do at crossings up and down this frontier regardless of their command affiliation. Most are eventually moved on toward Vladivostok or dispersed to make their own way home. Refusing Semyonov bought independence from one authority. It did not buy exemption from every authority this border answers to.",
              },
              {
                label: "Refuse to disarm. Attempt to force or negotiate passage while keeping the column armed.",
                advisor: {
                  name: "Kappel's Former Staff Officer",
                  quote:
                    "The principle is sound enough on paper. Paper is not what a Chinese garrison responds to — they have disarmed better-supplied columns than ours without much trouble at all. We already walked away from one loathed authority. I see no reason to assume this one has more patience than the last.",
                },
                historical: false,
                setFlags: { borderChoice: "refuse" },
                impact: { manpower: -2 },
                next: "endingDispersedAtTheBorder",
                outcome:
                  "The standoff doesn't hold. Chinese forces disarm the column regardless — the precedent set elsewhere on this same frontier by Dutov's independently-commanded Cossacks, disarmed and interned in Xinjiang despite answering to no White government at all, was never really about which banner a column carried. It was about whose territory this actually was.",
              },
            ],
          };

        // ---------------------------------------------------------------------
        // ENDING — for the manchurianBorder20 branch specifically. A genuinely
        // different fate than endingManchuria/endingManchuriaEarly, because
        // this command explicitly left Semyonov's orbit rather than falling
        // with it. historicalRecord true: the Chinese disarmament policy and
        // the dispersal/Grodekovo movement are both documented in period
        // consular telegrams, not invented for this ending.
        case "endingDispersedAtTheBorder":
          return {
            isEnding: true,
            title: "Dispersed at the Border",
            date: "APRIL–NOVEMBER 1920",
            badge: "HISTORICAL RECORD",
            classification: "historical",
            epilogue:
              "There is no Far Eastern Army left to dissolve, because this command never joined one. What's left of it is disarmed at the Manchurian frontier and, per the pattern documented up and down this border through 1920, mostly disperses — men making their own way home individually, or moving on toward the Japanese-controlled zone around Vladivostok rather than staying together as a fighting force. A parallel case makes the point plainly: Ataman Dutov's independently-commanded Orenburg Cossacks, who answered to no White government at all, were disarmed and interned by Chinese authorities in Xinjiang all the same. Command structure was never really what determined this outcome."
              + (flags.omskCoupChoice === "council_first"
                  ? "\n\nThere is a real symmetry here, whether or not anyone living through it noticed it: a command that opened, in November 1918, by proposing to share supreme power rather than hold it alone closes, in 1920, by refusing to fold itself into someone else's authority even when doing so might have offered more protection than going it alone actually provided. The instinct toward shared or independent authority over centralized command turns out to have been consistent from the very first morning to the very last border crossing — for whatever that consistency was worth against a Chinese garrison that disarmed columns regardless of the principle behind them."
                  : "\n\nThe command that disperses at this border accepted supreme, undivided authority without hesitation at the very start, in November 1918. It ends the same way it began — asserting its own independent standing right up to the border that made the assertion irrelevant. Confidence and consistency, it turns out, are not the same thing as leverage.")
              + "\n\nThe command that has held this seat since November 1918 ends here too — not in Semyonov's betrayal, and not in a battle, but in a column that simply stops being a column, man by man, at a border that was never going to let it cross intact regardless of whose command it left or refused to join." +
              (flags.borderChoice === "disarm"
                ? "\n\nAgreeing to disarm at the frontier is what made the crossing possible and what made it final. Chinese authorities interned the column on the terms they set; the weapons went into Chinese armories, and the men went into camps that emptied slowly into the same Harbin streets everyone else reached anyway."
                : flags.borderChoice === "refuse"
                ? "\n\nRefusing to disarm kept the column an army for a few more days and cost it the orderly crossing. The border was crossed regardless, in worse order, by men who had insisted on remaining soldiers right up to the moment it stopped being a category anyone was willing to recognize."
                : "") +
              (flags.legionOutcome === "delayed_betrayal"
                ? "\n\nThe Legion's cooperation, bought by conceding the junctions at Omsk, lasted precisely as long as the Legion's own interests did. Nobody who reached this border was surprised by that. A few of them had said so at the time."
                : ""),
          };

        // ---------------------------------------------------------------------
        // HARD MODE ENDING — triggers whenever Ataman Authority (authority-
        // Erosion) reaches 100, at whatever node the player happens to be on.
        // Not tied to a single date — it's the accumulated culmination of the
        // pattern the campaign's real content already shows: Kolchak's
        // subordinates overridden once too often, the Legion's cooperation
        // withdrawn the way Janin's own guarantee historically was.
        case "endingLegionWithdraws":
          return {
            isEnding: true,
            title: "The Legion Withdraws",
            date: "DATE VARIES — TRIGGERED BY ACCUMULATED AUTHORITY EROSION",
            badge: "SPECULATIVE — HARD MODE COLLAPSE",
            classification: "speculative",
            epilogue:
              "It is not a single betrayal — it is the accumulated pattern of every override that came before it: an ataman's objection dismissed once too often, a subordinate commander's judgment overruled past the point of trust, the rail line's actual controllers reminded one time too many that this government's authority was more nominal than real even to the people nominally protecting it. Somewhere on the retreat, the Czechoslovak Legion — the only force that actually controls whether this command's trains move at all — formally withdraws its cooperation.\n\nThis is the same betrayal Janin's real, documented conduct toward Kolchak shows the Legion was capable of regardless of the path that led here — the pattern was always live. What accumulated authority erosion changes is not whether the Legion could withdraw its protection. It's how much authority this command had left to withdraw it from by the time it did.\n\nThe Legion's own priority was never in dispute, and it was never Omsk. Sixty thousand Czech and Slovak soldiers wanted passage east to Vladivostok and ships to a country that had existed for barely a year. They got both. The arrangement that delivered Kolchak to the Political Centre at Irkutsk in January 1920 secured their trains and a share of what remained of the imperial gold reserve's transit, and the last of them sailed from Vladivostok in September. They went home. The government whose protection they had nominally been guaranteeing did not survive the winter they left it in." +
              (flags.janinDeclinedOutcome === "marginal_gain"
                ? "\n\nNegotiating passage independently, without Janin's formal guarantee, did buy the trains marginally better treatment than the guarantee would have. It is a small thing to have been right about, and it does not offset what the withdrawal of cooperation costs here."
                : flags.janinDeclinedOutcome === "no_gain"
                ? "\n\nNegotiating passage independently bought nothing the formal guarantee wouldn't have. Both roads led to a Legion that answered to its own timetable, and the choice between them turned out to be a choice about self-respect rather than outcomes."
                : ""),
          };

        // -------------------------------------------------------------------
        case "chitaFall20":
          return {
            date: "OCTOBER 1920",
            title: "Chita: The Plug Comes Out",
            bulletin: {
              headline: "BOTH REMAINING WHITE FRONTS, THE SAME MONTH",
              body: "This front and the one remaining in the south reach their endings in the same weeks — the first time in the whole war either front's timeline has actually lined up with the other's.",
              meanwhile: {
                southRussia: "Wrangel's Crimea is preparing its own defense at Perekop, and — quietly, alongside that defense rather than instead of it — its own evacuation. The lesson of Novorossiysk, eight months ago, was that failing to prepare for a retreat in advance costs more than admitting one might be necessary.",
                bolsheviks: "The Polish war has just ended in an armistice, with formal peace talks opening at Riga. Frunze's Southern Front, freed from sharing reserves with the Polish front, is about to turn its full weight against the Crimea within weeks.",
              },
            },
            historicalRecord: true,
            situation:
              "The Far Eastern Republic's National Revolutionary Army and Red partisan forces are closing on Chita — the last chokepoint keeping direct Soviet control off the Trans-Siberian's eastern stretch. Japanese support that has propped up this position for two years is withdrawing under the Gongota Agreement. Semyonov wants to hold. What remains of the Kappelite command has to decide whether holding a doomed position is worth the men it costs." +
              (flags.semyonovChoice === "merged"
                ? " The merger was accepted, which is why Semyonov gets to say what he wants at all. The officers who loathed him then are the ones being asked to die for his position now."
                : ""),
            choices: [
              {
                label: "Make a real stand at Chita rather than abandon the position without a fight.",
                advisor: {
                  name: "Semyonov",
                  quote:
                    "I have held this city since 1918 against worse odds than these, and against men who thought their reasons for wanting it were better than mine. I am not asking anyone to die for my own authority, though I would let them think that if it moved them faster. Everything east of here answers to whoever holds Chita. I intend for that to still be me.",
                },
                historical: true,
                setFlags: { chitaDefense: "stand" },
                impact: {},
                next: "chitaReckoning20",
                outcome:
                  "The defense holds for a time before Chita falls on October 22. Semyonov's remaining forces retreat toward Manchuria — the position could not be held indefinitely against Japan's withdrawal and the NRA's numbers, whatever the defense actually cost to mount.",
              },
              {
                label: "Withdraw toward the Manchurian border immediately rather than commit to a defense of Chita.",
                advisor: {
                  name: "Voitsekhovsky",
                  quote:
                    "Holding this city buys Semyonov's authority a few more weeks. It does not change where any of us end up when those weeks run out. I would rather cross that border with an army than without one.",
                },
                historical: false,
                setFlags: { chitaDefense: "immediate_withdrawal" },
                impact: { manpower: 3 },
                costsCapital: true,
                next: "chitaReckoning20",
                outcome:
                  "The withdrawal begins before Chita actually falls, over Semyonov's open objection. More men reach Manchuria intact — and the decision to abandon his capital without a fight is not one Semyonov, or the officers who still answer to him, forget quickly.",
              },
            ],
          };

        // ---------------------------------------------------------------------
        // CHECKPOINT — meter-gated routing, not a decision. If accumulated
        // manpower this run has actually sustained is catastrophic, the
        // column crossing into Manchuria isn't a coherent retreating force
        // anymore — it's scattered groups making the crossing individually,
        // which is a genuinely different ending than either organized
        // border crossing this campaign already had. Gate was originally
        // the accumulated manpower meter (<= -6) — changed for the same
        // reason as southRussia's finalReckoning20: raw meter arithmetic
        // isn't the same thing as a genuinely reckless command decision, and
        // the triangle shouldn't be the thing routing to a different ending.
        // Earned now by the Saratov-junction gamble specifically: pressing
        // toward the junction against the flank warning, then pressing on
        // again once the counteroffensive actually hit the exposed flank.
        case "chitaReckoning20":
          if (flags.saratovChoice === "continue" && flags.exposedFlankChoice === "press_on") {
            return this.resolveNode("endingColumnScattered20");
          }
          return this.resolveNode(flags.chitaDefense === "stand" ? "endingManchuria" : "endingManchuriaEarly");

        // ---------------------------------------------------------------------
        // ENDING — reachable only via the Saratov-junction decision chain:
        // pressing for the junction against the flank warning, then pressing
        // on again once the counteroffensive actually exposed the flank.
        // historicalRecord false: no scattered, non-organized crossing at
        // this scale is documented; the real Kappelite-Semyonovite column
        // that crossed in October 1920 remained cohesive enough to be
        // described as an army. What's real is the underlying mechanism —
        // a force gutted by that specific double-down loses the capacity to
        // cross as a body it would otherwise have kept.
        case "endingColumnScattered20":
          return {
            isEnding: true,
            title: "The Column That Scattered",
            date: "OCTOBER–NOVEMBER 1920",
            badge: "SPECULATIVE — PLAUSIBLE, NOT SETTLED",
            classification: "speculative",
            epilogue:
              "There is no organized column crossing into Manchuria to describe, because by the time Chita falls there isn't one left to organize. The damage traces to the Saratov junction: pressing for the link-up against the flank warning, and then, once the counteroffensive actually landed on that exposed flank, pressing on toward Saratov anyway rather than turning to meet it. The force that reaches Chita is smaller than the one that would have turned back at either warning, and it never recovers the difference. Groups of a few dozen, a few hundred, cross the border independently, on their own initiative, answering to no unified command by the time they actually reach it. Some find their way to Harbin. Most simply disperse into the same uncertain exile the organized column eventually reached — just without ever having been a column to begin with.\n\nThis is not the historical record — the real retreat, battered as it genuinely was, remained cohesive enough to be called an army all the way to the Manchurian border. What's speculative here is a command that doubled down on the Saratov gamble twice in direct sequence, and paid for both." +
              (flags.reluctanceResponse === "assert"
                ? "\n\nThe title was asserted formally, early, against the officers who questioned it. Authority insisted upon in November 1918 is worth nothing to a column dispersing across a frozen border two years later, and the men crossing it individually are not consulting anyone about whether they are permitted to."
                : flags.reluctanceResponse === "ignore"
                ? "\n\nThe question of the title was left to pass without comment, which was the wiser handling and made no difference at all. Command that is never tested formally still dissolves informally, and this is what that looks like when it happens."
                : ""),
          };

        // ---------------------------------------------------------------------
        // ENDINGS
        // ---------------------------------------------------------------------
        case "endingManchuria":
          return {
            isEnding: true,
            title: "The Manchurian Border",
            date: "OCTOBER 1920",
            badge: "HISTORICAL RECORD",
            classification: "historical",
            epilogue:
              "Chita falls on October 22, 1920, after a defense that could not outlast the loss of Japanese support and the National Revolutionary Army's numbers. What remains of Semyonov's Far Eastern Army — Kappelites and Transbaikal Cossacks alike, a coalition built on necessity rather than trust — retreats across the border into Manchuria. Many settle into Harbin's already-large Russian émigré community; some later take service with regional Chinese warlords, or find themselves, decades on, still displaced when Japan occupies Manchuria outright."
              + (flags.omskCoupChoice === "council_first"
                  ? "\n\nThe hesitation at Omsk, two years and one command earlier, is a footnote by now — nobody crossing into Harbin in October 1920 is thinking about a proposal for collective leadership that lasted a few hours before being rejected. But the pattern it set, of an authority that had to assert itself rather than simply holding it, runs in a more or less straight line from that first morning to this border. Whether asserting it harder at the start would have changed anything by the end is exactly the kind of counterfactual this crossing doesn't get to answer."
                  : "\n\nThe command that crosses this border is, in the narrowest sense, the same one that accepted supreme power without hesitation in November 1918. Confidence at the start bought nothing durable by the end — the same dissolution, on the same schedule, regardless.")
              + "\n\nThe command seat held since the Omsk coup in November 1918 ends here — not in a lost battle, but in a border crossed. Dissolution into exile, not defeat in the field, is how this story was always going to end; the only real question was ever how many of the men following that command survived to make the crossing." +
              (flags.eichePursuitChoice === "fight"
                ? "\n\nThe rearguard that turned to fight Eiche's advance elements bought the column the lead it needed to reach this border. It did not make the crossing itself. The formation that survives to be interned is, in a real sense, the one that was covered by men who are not here to be interned with it."
                : flags.eichePursuitChoice === "continue"
                ? "\n\nThe column kept moving and let the rearguard absorb the pursuit unsupported. More men reached the border for it. The decision is recorded in nobody's memoir as anything other than the correct one, which is its own kind of comment on what this retreat had become by then."
                : "") +
              (flags.chelyabinskChoice === "counterattack"
                ? "\n\nDiterichs' counterattack at Chelyabinsk was committed to and did not stabilize the flank it was meant to. The reserves it spent were the ones that would otherwise have been available for exactly this stretch of the retreat, and their absence shaped who was still walking by the Manchurian border."
                : ""),
          };

        case "endingManchuriaEarly":
          return {
            isEnding: true,
            title: "The Army That Left First",
            date: "OCTOBER 1920",
            badge: "SPECULATIVE — PLAUSIBLE, NOT SETTLED",
            classification: "speculative",
            epilogue:
              "The withdrawal begins before Chita actually falls, against Semyonov's open objection. More of the column reaches Manchuria intact than the historical retreat managed. The cost is Semyonov's trust — and by extension, whatever fragile authority was holding this coalition of convenience together in the first place.\n\nHistorians broadly agree the eventual outcome, dissolution into exile, was not seriously in doubt by this point in the war regardless of the exact shape the defense took. What this choice actually changes is not the destination — it's whether the men following Voitsekhovsky get to say they chose the moment they left, rather than had it chosen for them by a city falling around them.\n\nManchuria was not a refuge so much as a waiting room nobody was called out of. Harbin, already a Russian railway city before the war, absorbed tens of thousands of them — officers driving cabs, selling what they carried, running restaurants for other exiles. Some drifted on to Shanghai, some to Europe, some eventually accepted Soviet amnesties and went back to outcomes that varied from unremarkable to fatal. The Japanese backing that had propped up Semyonov's Transbaikal evaporated with the withdrawal in 1922, and the men who left Chita a few weeks early ended up in exactly the same cities as the men who left it a few weeks late. The margin this choice bought was real, and it was measured in casualties on the road, not in destinations." +
              (flags.janinChoice === "accepted"
                ? "\n\nJanin's formal guarantee was accepted, and Janin's guarantee is the one documented fact of this whole retreat that most reliably meant nothing. The evacuation placed under Allied protection was protected exactly as far as Allied interests extended, which stopped at Irkutsk. Leaving Chita early was, among other things, a decision made by men who had already learned what a guarantee was worth."
                : flags.janinChoice === "declined"
                ? "\n\nThe formal Allied guarantee was declined and passage negotiated unit by unit instead. It changed less than it should have — but the command that walks away from Chita early is the same one that had already decided not to rely on anyone else's protection, and the two decisions belong to the same instinct."
                : ""),
          };

        default:
          return null;
      }
    },
  },
};

// =============================================================================
// BOLSHEVIKS — Revolutionary Military Council of the Republic (Revvoensoviet)
// =============================================================================
// Design note, not to be quietly dropped: this campaign does NOT share the
// "managing the shape of a defeat" thesis the other two were built around —
// the Reds won the Civil War. Its moral weight comes from a different place:
// not loss, but what winning required (grain requisitioning, the Cheka, and
// eventually Kronstadt/Tambov once the "main" war is technically over). Don't
// let content sessions default back to a defeat-shaped arc out of habit —
// check every ending draft against what this campaign is actually about.
