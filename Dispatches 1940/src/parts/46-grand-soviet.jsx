const GS_MERGE = "kharkov43";
// The grand Soviet campaign (EXPERIMENTAL). The consultant's tree for December 1941 to February 1943 (docs/grand/soviet-tree.md) written as data and played
// in place of the Soviet campaign's 1942 reports, only when the page is opened with ?grand=soviet (or localStorage dispatches1940_experimental = "grand-soviet").
// Nothing here runs otherwise, and the four campaigns and their baselines are untouched.
//
// The tree draws the January 1942 theatres side by side, and a player is in one report at a time, so the theatres are interleaved by date. Each order says
// which reports it opens (`then`) and which it closes (`drop`); the reports opened and not yet played wait in a queue (flags.gsQ) and the earliest comes next;
// when the queue is empty the campaign rejoins the Soviet one at GS_MERGE. So a theatre that the player's strategy leaves out simply never appears.
//
// Order of an entry: gsR(id, day, date, title, situation, orders). `day` is YYYYMMDD and only orders the queue. Every text is a DRAFT that follows the
// consultant's labels; the numbers (impacts) are all zero until the tree is balanced. tools/check-grand-soviet.mjs checks the graph.

const gsR = (id, at, date, title, situation, orders) => ({ id, at, date, title, situation, orders });
const gsO = (adviser, label, then, more) => ({ adviser, label, then, ...(more || {}) });
const gsGo = (then, flags) => [gsO("Stavka", "Carry on", then, { flags })];

const GS_REPORTS = {};
[
  gsR("gsDec41", 19411205, "DECEMBER 1941", "Moscow: The Turning Point",
    "The German armies are stopped at the gates of Moscow and the Red Army has fresh divisions from Siberia and the Urals. The Stavka has to decide whether to strike now, with what it has, or to wait until it has more.",
    [
      gsO("Rokossovsky", "Postpone the attack until we can amass more", ["gsJan42"], { flags: { gsDec41: "postpone" } }),
      gsO("Zhukov", "Launch the attack on the 5th across the whole front", ["gsJan42"], { otl: true, flags: { gsDec41: "launch" } }),
      gsO("Vasilevsky", "Refocus our last reserves on the flanks", ["gsJan42"], { flags: { gsDec41: "flanks" } }),
    ]),
  gsR("gsJan42", 19420105, "JANUARY 1942", "The Counteroffensive Begins",
    "The attack at Moscow has thrown the Germans back, and Stalin wants it carried on everywhere. Shaposhnikov would attack along the whole front from the Baltic to the Black Sea. Zhukov would put everything that can be found into the Moscow front and hold the rest.",
    [
      gsO("Shaposhnikov", "Attack from the Baltic to the Black Sea", ["gsJanLyuban", "gsJanMoscow", "gsJanKerch", "gsJanDemyansk", "gsJanSevastopol", "gsJanBarvenkovo", "gsJanKursk"], { flags: { gsPlan: "wide" } }),
      gsO("Zhukov", "Concentrate on Moscow only", ["gsJanRzhevVyazma", "gsJanCrisis"], { flags: { gsPlan: "moscow" } }),
    ]),

  // ---- the January theatres ----
  gsR("gsJanMoscow", 19420108, "JANUARY 1942", "Moscow: How Far West",
    "The Western and Kalinin Fronts are advancing west of Moscow, and the question is whether to press on for Vyazma and the rear of Army Group Centre or to take a safer line at Olenino and Yukhnov.",
    [
      gsO("Rokossovsky", "Take the safer bet: Olenino and Yukhnov", ["gsFebExhaustion"]),
      gsO("Zhukov", "Go all the way to Vyazma", ["gsFebExhaustion"], { otl: true, flags: { gsMoscow: "vyazma" } }),
    ]),
  gsR("gsJanLyuban", 19420110, "JANUARY 1942", "Lyuban",
    "The Volkhov Front is to break through on the Volkhov and cut off the Germans besieging Leningrad. Meretskov would aim for a smaller pincer at Lyuban, and Khozin wants the whole army to go for Luga.",
    [
      gsO("Meretskov", "A smaller pincer to Lyuban", ["gsMayLyuban"]),
      gsO("Khozin", "All the way to Luga", ["gsMayLyuban"], { otl: true, flags: { gsLyuban: "luga" } }),
    ]),
  gsR("gsJanKerch", 19420111, "JANUARY 1942", "Kerch and Feodosia",
    "Landings at Kerch and Feodosia have put troops back on the Kerch peninsula, and the Crimean Front has to say where the weight of its effort will go.",
    [
      gsO("Oktyabrsky", "Only raids, and reinforce Sevastopol", ["gsMarKerch"], { flags: { gsCrimea: "raids" } }),
      gsO("Tolbukhin", "Main focus on Kerch", ["gsMarKerch"], { flags: { gsCrimea: "kerch" } }),
      gsO("Kozlov", "Main focus on Feodosia", ["gsMarKerch"], { otl: true, flags: { gsCrimea: "feodosia" } }),
      gsO("Alexander", "Focus on the northern port at Sevastopol", ["gsMarKerch"], { flags: { gsCrimea: "north" } }),
    ]),
  gsR("gsJanDemyansk", 19420113, "JANUARY 1942", "Demyansk",
    "The Northwestern Front has cut off a German force at Demyansk. It can keep up the pressure towards Staraya Russa or put a force into the pocket itself.",
    [
      gsO("Chernyakhovsky", "Maintain the pressure on Staraya Russa", ["gsFebExhaustion"]),
      gsO("Kurochkin", "Airborne troops inside Demyansk", ["gsFebExhaustion"], { otl: true, flags: { gsDemyansk: "airborne" } }),
    ]),
  gsR("gsJanSevastopol", 19420115, "JANUARY 1942", "Sevastopol: Where to Expect the Blow",
    "Sevastopol is under siege and a German storm is expected. The garrison has to guess where it will fall and where to put its few reserves.",
    [
      gsO("Petrov", "Focus on the highway", ["gsMarKerch"], { otl: true, flags: { gsSevastopolHold: "highway" } }),
    ]),
  gsR("gsJanBarvenkovo", 19420118, "JANUARY 1942", "Barvenkovo",
    "The Southwestern Front has taken a salient across the Donets at Barvenkovo. Timoshenko wants to go on to the Dnieper, and Malinovsky wants to refocus on Slavyansk and Balakleya.",
    [
      gsO("Malinovsky", "Refocus on Slavyansk and Balakleya", ["gsMarUrban"]),
      gsO("Timoshenko", "To the Dnieper!", ["gsMarUrban"], { otl: true, flags: { gsBarvenkovo: "dnieper" } }),
    ]),
  gsR("gsJanKursk", 19420120, "JANUARY 1942", "Kursk, Oboyan, Orel",
    "Timoshenko's armies are also pressing on towards Kursk, Oboyan and Orel, which would take them beyond what the supply lines can bear.",
    [
      gsO("Bagramyan", "Stop", ["gsMarUrban"]),
      gsO("Timoshenko", "Attack!", ["gsMarUrban"], { otl: true, flags: { gsKursk: "attack" } }),
    ]),
  gsR("gsJanRzhevVyazma", 19420108, "JANUARY 1942", "Rzhev and Vyazma: The Operations Begin",
    "With the whole weight of the Stavka behind it, the attack at Rzhev and Vyazma can be run as a safe bite at the salient or as a deep thrust for the rear of Army Group Centre.",
    [
      gsO("Rokossovsky", "Take the safer bet: Olenino and Yukhnov", ["gsFebExhaustion"]),
      gsO("Zhukov", "All towards Vyazma", ["gsAgcAnnihilated"], { flags: { gsMoscow: "vyazmaAll" } }),
    ]),
  gsR("gsJanCrisis", 19420125, "JANUARY 1942", "Crisis in Leningrad and Sevastopol",
    "While everything goes to Moscow, Leningrad and Sevastopol are left with what they have, and both are in trouble.",
    [
      gsO("Zhukov", "Hold with what you have", ["gsMayLooming"], { flags: { gsCrisis: "hold" } }),
      gsO("Stalin", "Send minor reinforcements: save them", ["gsMayLooming"], { flags: { gsCrisis: "minor" } }),
    ]),

  // ---- February and March ----
  gsR("gsFebExhaustion", 19420215, "FEBRUARY 1942", "Overall Exhaustion",
    "The counteroffensive is running down: the armies are worn, the rifle divisions are far under strength and the German line is hardening again.",
    [
      gsO("Konev", "Focus on our flanks at Bely and Rzhev, to prevent encirclements", ["gsMarAssessment"]),
      gsO("Zhukov", "Push on to Vyazma", ["gsMarAssessment"], { otl: true, flags: { gsFeb: "vyazma" } }),
      gsO("Purkayev", "Stop and defend", ["gsMarAssessment"], { flags: { gsFeb: "stop" } }),
    ]),
  gsR("gsMarKerch", 19420310, "MARCH 1942", "Kerch: The Direction",
    "The Crimean Front stands on the Parpach line of the Kerch peninsula and has to decide whether to prepare to defend it or to prepare another offensive.",
    [
      gsO("Kozlov", "Prepare defences", ["gsMayTrappenjagd"], { flags: { gsKerch: "defend" } }),
      gsO("Mekhlis", "Prepare the offensive", ["gsMayCrimea"], { otl: true, flags: { gsKerch: "offensive" } }),
    ]),
  gsR("gsMarUrban", 19420312, "MARCH 1942", "Urban Crawling",
    "The fighting at the Barvenkovo salient has settled into slow work, and the Southwestern Front has to choose between fortifying the base of the bulge and pushing on with more offensive measures.",
    [
      gsO("Malinovsky", "Reinforce and fortify the base of the bulge", ["gsMayKharkov2"]),
      gsO("Bagramyan", "Take more offensive measures", ["gsMayKharkov2"]),
    ]),
  gsR("gsMarAssessment", 19420315, "MARCH 1942", "Strategic Assessment for the Year",
    "The Stavka has to say where the weight of 1942 will fall. Timoshenko wants to strike in the south first and forestall the Germans at Kharkov. Stalin wants to attack everywhere. Shaposhnikov wants the main reserves held for Moscow.",
    [
      gsO("Timoshenko", "Focus on the south and forestall the Germans at Kharkov", ["gsMegaKharkov", "gsJulRzhev"], { drop: ["gsMayKharkov2"], flags: { gsYear: "south" } }),
      gsO("Stalin", "Spread our forces everywhere and attack everywhere", ["gsJulRzhev"], { otl: true, flags: { gsYear: "everywhere" } }),
      gsO("Shaposhnikov", "Keep the main reserves for Moscow", ["gsJulRzhev"], { flags: { gsYear: "moscow" } }),
    ]),

  // ---- May and June ----
  gsR("gsMayTrappenjagd", 19420508, "MAY 1942", "Trappenjagd Starts",
    "The German attack on the Kerch peninsula, Operation Trappenjagd, begins. The Crimean Front has to decide where the blow will fall.",
    [
      gsO("Kozlov", "The Germans plan a sickle cut from the south", ["gsJunKerchSevastopol"]),
      gsO("Mekhlis", "The Germans attack along the highway", ["gsJunKerchSevastopol"]),
    ]),
  gsR("gsMayCrimea", 19420518, "MAY 1942", "The Crimean Catastrophe",
    "The Crimean Front, ready to attack and not to defend, is struck by the German offensive and driven off the Kerch peninsula.",
    [
      gsO("Kozlov", "The Germans plan a sickle cut from the south", ["gsJunKerchSevastopol"]),
      gsO("Mekhlis", "The Germans attack along the highway", ["gsJunKerchSevastopol"]),
    ]),
  gsR("gsMayLyuban", 19420510, "MAY 1942", "The Lyuban Bulge",
    "The Second Shock Army is cut off in the marshes at Lyuban. Meretskov and Vlasov disagree about whether to hold, to attack or to withdraw.",
    [
      gsO("Meretskov", "Make a fighting retreat", ["gsAugSinyavino"]),
      gsO("Vlasov", "Hold", ["gsAugSinyavino"]),
      gsO("Fedyuninsky", "Attack towards Tosno", ["gsAugSinyavino"]),
    ]),
  gsR("gsMayLooming", 19420512, "MAY 1942", "The Looming Catastrophe",
    "The Second Shock Army is in a worse state each day, and the Volkhov Front has to say whether it stands or retreats early.",
    [
      gsO("Vlasov", "Stand", ["gsAugSinyavino"], { otl: true, flags: { gsLyubanEnd: "stand" } }),
      gsO("Meretskov", "Retreat early", ["gsAugSinyavino"], { flags: { gsLyubanEnd: "early" } }),
    ]),
  gsR("gsMayKharkov2", 19420512, "MAY 1942", "The Second Battle of Kharkov",
    "Timoshenko attacks from the Barvenkovo salient towards Kharkov, with German forces gathering to cut the salient off in Operation Fredericus.",
    [
      gsO("Malinovsky", "Strike south and stall Fredericus", ["gsMayFredericus"]),
      gsO("Timoshenko", "A wide offensive everywhere", ["gsJunReichel"], { otl: true, flags: { gsKharkov2: "wide" } }),
      gsO("Timoshenko", "Cancel Kursk and Bryansk, and send everything to Kharkov", ["gsMegaKharkov"], { flags: { gsKharkov2: "all" } }),
    ]),
  gsR("gsMayFredericus", 19420517, "MAY 1942", "Fredericus Blunted",
    "The German attack on the salient has been blunted for now, and the Southwestern Front has to decide how to use the respite.",
    [
      gsO("Timoshenko", "Counterattack", ["gsJulMillerovo"]),
      gsO("Malinovsky", "Fight a retreat behind the Donets", ["gsJulMillerovo"]),
    ]),
  gsR("gsJunKerchSevastopol", 19420610, "JUNE 1942", "Kerch or Sevastopol?",
    "Kerch has fallen or is falling, and the Black Sea fleet and the Stavka must choose between fighting on for the peninsula and putting everything into Sevastopol.",
    [
      gsO("Petrov", "Sevastopol", ["gsJulFallSevastopol"], { otl: true, flags: { gsSevastopol: "falls" } }),
      gsO("Kozlov", "Kerch: make the port, build artillery and retreat slowly", [], { flags: { gsSevastopol: "stands" } }),
    ]),
  gsR("gsJunReichel", 19420619, "JUNE 1942", "The Reichel Incident",
    "A German staff officer carrying the plan for the summer offensive is shot down over Soviet lines. The Stavka has to decide whether the papers are real and what they mean.",
    [
      gsO("Stalin", "The Germans plan to flank Moscow from Voronezh", ["gsJulMillerovo"], { otl: true, flags: { gsReichel: "moscow" } }),
      gsO("Vasilevsky", "The Germans plan to go south from Voronezh", ["gsJulMillerovo"], { flags: { gsReichel: "south" } }),
    ]),
  gsR("gsMegaKharkov", 19420525, "MAY 1942", "The Great Battle of Kharkov",
    "The whole of the Soviet southwest, and all the reserves that can be spared for it, are committed to the battle for Kharkov.",
    [
      gsO("Timoshenko", "Commit everything to the battle", ["gsMegaAfter"], {
        rolls: [
          { w: 35, title: "Kharkov, like Kursk", flags: { gsMega: "big" }, outcome: "Speculative (draft). The Germans are beaten at Kharkov on a scale that the record gives to Kursk, and their summer offensive is not what it was to be." },
          { w: 65, title: "The summer offensive exhausted early", flags: { gsMega: "moderate" }, outcome: "Speculative (draft). The battle is costly and not decisive, but it drains the force that was to launch the German summer offensive." },
        ],
      }),
    ]),
  gsR("gsMegaAfter", 19420610, "JUNE 1942", "After Kharkov",
    (flags) => (flags.gsMega === "big"
      ? "Draft. The Germans have been beaten at Kharkov and are in no state to go south. The tree gives no further steps for this case, and an alternate spine is to be written."
      : "Draft. The Germans are weaker than they were, but not beaten, and the summer offensive comes in a smaller form."),
    (flags) => gsGo(flags.gsMega === "big" ? [] : ["gsMidAugStalingrad"], { gsMegaSeen: true })),

  // ---- July and August ----
  gsR("gsJulFallSevastopol", 19420704, "JULY 1942", "The Fall of Sevastopol",
    "Sevastopol falls after a siege of 250 days, and the German Eleventh Army is free for other work.",
    gsGo([])),
  gsR("gsJulMillerovo", 19420715, "JULY 1942", "Millerovo and Rostov",
    "The German summer offensive has broken through towards the Don, and Rostov and Millerovo are threatened. The south has to choose between retreat and trying to reorganise.",
    [
      gsO("Malinovsky", "A full retreat behind the Don, with scorched earth", ["gsAugMillerovo"]),
      gsO("Timoshenko", "Try to reorganise the troops", ["gsAugMillerovo"], { otl: true, flags: { gsMillerovo: "reorganise" } }),
      gsO("Timoshenko", "A fighting retreat to the Don", ["gsAugDon"]),
    ]),
  gsR("gsJulRzhev", 19420730, "JULY 1942", "Rzhev and Sychevka",
    "The Stavka can launch the summer attack on the Rzhev salient, or leave it. Shcherbakov would not launch it.",
    [
      gsO("Shcherbakov", "Do not launch", ["gsAugWirbelwind"], { flags: { gsRzhev: "wait" } }),
      gsO("Zhukov", "Launch", ["gsAugDifficulties"], { otl: true, flags: { gsRzhev: "launch" } }),
    ]),
  gsR("gsAugMillerovo", 19420802, "AUGUST 1942", "The Catastrophe at Millerovo: The Caucasus Exposed",
    "The front on the Don has gone, and the Caucasus lies open behind it.",
    [
      gsO("Malinovsky", "Attempt to hold the Don", ["gsMidAugStalingrad"]),
      gsO("Budyonny", "Retreat to the Terek and the Caucasus", ["gsMidAugStalingrad"], { otl: true, flags: { gsCaucasus: "terek" } }),
    ]),
  gsR("gsAugDon", 19420804, "AUGUST 1942", "Problems on the Don",
    "The armies on the Don are falling back in order, but the Caucasus is thinly held and the Germans are across the river in places.",
    [
      gsO("Budyonny", "Retreat to the Terek and the Caucasus", ["gsMidAugStalingrad"]),
      gsO("Tyulenev", "Mine everything and retreat slowly", ["gsMidAugStalingrad"]),
    ]),
  gsR("gsAugWirbelwind", 19420805, "AUGUST 1942", "Wirbelwind",
    "The Rzhev attack has not been launched, and the Germans use the time for Operation Wirbelwind against the Soviet armies on the salient.",
    [
      gsO("Belov", "Pull back", ["gsNovGodOfWar"]),
      gsO("Bagramyan", "Hold", ["gsNovGodOfWar"]),
    ]),
  gsR("gsAugDifficulties", 19420810, "AUGUST 1942", "Difficulties",
    "The attack at Rzhev has run into the German defences, and the front has to decide whether to stop, to hammer at the town or to go round it at Karmanovo.",
    [
      gsO("Purkayev", "Stop", ["gsNovGodOfWar"]),
      gsO("Konev", "A frontal attack on Rzhev", ["gsNovGodOfWar"], { otl: true, flags: { gsRzhev2: "frontal" } }),
      gsO("Zhukov", "Continue flanking at Karmanovo", ["gsSepSychevka"], { flags: { gsRzhev2: "flank" } }),
    ]),
  gsR("gsMidAugStalingrad", 19420817, "MID-AUGUST 1942", "Stalingrad Approaches",
    "The German Sixth Army and Fourth Panzer Army are heading for the Volga at Stalingrad. The front has to decide how to meet them.",
    [
      gsO("Vatutin", "Counterattack the tip of the Fourth Panzer Army from the south", ["gsSepStands"]),
      gsO("Moskalenko", "Reinforce the northern flank and counterattack", ["gsSepStands"]),
      gsO("Chuikov", "Fight for every house, whatever it costs", ["gsSepStands"]),
      gsO("Yeremenko", "An active defence", ["gsSepCracks"]),
      gsO("Gordov", "Stand outside the city", ["gsSepCracks"], { otl: true, flags: { gsStalingrad: "outside" } }),
    ]),
  gsR("gsAugSinyavino", 19420819, "AUGUST 1942", "The Third Battle of Sinyavino",
    "The Leningrad and Volkhov Fronts are to break the blockade at Sinyavino before the Germans can attack the city in Operation Nordlicht.",
    (flags) => [
      gsO("Meretskov", "Pre-empt the Germans and attack on Mga", ["gsJanIskra"]),
      gsO("Govorov", "Attack on Sinyavino", ["gsJanIskra"], { otl: true, flags: { gsSinyavino: "attack" } }),
      gsO("Voroshilov", "Attack on the Ladoga coast, the shortest road", flags.gsSevastopol === "stands" ? ["gsAugLeningrad"] : ["gsJanIskra"], { flags: { gsSinyavino: "coast" } }),
    ]),
  gsR("gsAugLeningrad", 19420825, "AUGUST 1942", "Leningrad Unblocked Early: The Nordlicht Counterattack",
    "Sevastopol has held, and the German Eleventh Army is not on its way to Leningrad. The blockade is broken early, and the Germans may still try a counterattack.",
    [
      gsO("Voroshilov", "Reinforce Ladoga and retreat slowly to the fortifications", ["gsFebPolarStar"]),
      gsO("Govorov", "Hold to the Sinyavino Hills", ["gsFebPolarStar"]),
    ]),

  // ---- September to November ----
  gsR("gsSepSychevka", 19420915, "SEPTEMBER 1942", "The Sychevka Railway Almost Cut",
    "The flanking attack has almost cut the Sychevka railway, the main supply line of the German armies in the Rzhev salient.",
    [
      gsO("Zhukov", "One final push", ["gsNovGodOfWar"]),
      gsO("Voronov", "Suppress it with artillery", ["gsNovGodOfWar"]),
      gsO("Bagramyan", "Surprise them and flank Gzhatsk", ["gsOctBuffel"]),
    ]),
  gsR("gsSepStands", 19420915, "SEPTEMBER 1942", "Stalingrad Stands",
    "The city has not fallen, and the Sixth Army is being drawn into the streets. The defence has to say how to use the time.",
    [
      gsO("Voronov", "Double down on artillery", ["gsNovUranus"]),
      gsO("Chuikov", "Continue bearhugging", ["gsNovUranus"]),
      gsO("Shumilov", "An active southern flank", ["gsNovUranus"]),
    ]),
  gsR("gsSepCracks", 19420915, "SEPTEMBER 1942", "Stalingrad Cracks",
    "The Germans have reached the Volga on both sides of the city, and the defence is split and close to collapse.",
    [
      gsO("Yeremenko", "A classic defence", ["gsNovUranus"]),
      gsO("Chuikov", "Bearhugging", ["gsNovUranus"], { otl: true, flags: { gsStalingrad2: "bearhug" } }),
    ]),
  gsR("gsOctBuffel", 19421015, "OCTOBER 1942", "Buffel, Early",
    "Threatened with the loss of the Sychevka railway, the Germans start to withdraw from the Rzhev salient months before they did in the record.",
    [
      gsO("Zhukov", "Pursue them", ["gsSmolenskXmas"]),
      gsO("Vasilevsky", "Only light strikes", ["gsNovGodOfWar"]),
    ]),
  gsR("gsSmolenskXmas", 19421020, "OCTOBER 1942", "Smolensk by Christmas?",
    "If the Germans are hurried out of the salient, Smolensk might be in reach by the end of the year. Antonov doubts that it is.",
    [
      gsO("Zhukov", "Risk it", ["gsNovGodOfWar"], { flags: { gsSmolensk: "risk" } }),
      gsO("Antonov", "No", ["gsNovGodOfWar"], { flags: { gsSmolensk: "no" } }),
    ]),
  gsR("gsNovGodOfWar", 19421110, "NOVEMBER 1942", "The God of War",
    "The Stavka has prepared Operation Mars against the Rzhev salient. The artillery is there, but the aircraft are grounded by the weather. Stalin is ready to wait for it to clear.",
    [
      gsO("Stalin", "Better to wait", [], { flags: { gsMars: "wait" } }),
      gsO("Zhukov", "Launch without aviation", ["gsMarsAfter"], {
        otl: true,
        rolls: [
          { w: 25, title: "Mars breaks through", flags: { gsMars: "breaks" }, outcome: "Speculative (draft). The attack breaks through on the first days, against what the record shows, and the Germans are in danger at Rzhev." },
          { w: 75, title: "Mars stalls", flags: { gsMars: "stalls" }, outcome: "What happened (draft). The attack stalls in the German defences, with heavy losses, and the Rzhev salient holds." },
        ],
      }),
    ]),
  gsR("gsMarsAfter", 19421130, "NOVEMBER 1942", "After Mars",
    (flags) => (flags.gsMars === "breaks"
      ? "Draft. Mars has broken through, and Zhukov wants to go on to Smolensk."
      : "Draft. Mars has stalled and the Rzhev salient holds."),
    (flags) => (flags.gsMars === "breaks"
      ? [
        gsO("Zhukov", "On to Smolensk", [], { flags: { gsMarsEnd: "smolensk" } }),
        gsO("Purkayev", "Stop", [], { flags: { gsMarsEnd: "stop" } }),
      ]
      : gsGo([], { gsMarsEnd: "stalled" }))),
  gsR("gsNovUranus", 19421119, "NOVEMBER 1942", "Uranus",
    "The Stalingrad armies are ready to strike at the German flanks. The plan is Vasilevsky's and Zhukov's, and Stalin would rather have a smaller attack across the Don.",
    [
      gsO("Vasilevsky", "Launch Uranus", ["gsDecChir"], { otl: true, flags: { gsUranus: "full" } }),
      gsO("Stalin", "A minor attack across the Don", ["gsDecChir"], { flags: { gsUranus: "minor" } }),
    ]),

  // ---- December to February ----
  gsR("gsDecChir", 19421210, "DECEMBER 1942", "The Chir Stalls",
    "Sixth Army is surrounded, but the fighting on the Chir and at Kotelnikovo will decide whether it can be relieved, and the Stavka has to place its reserves.",
    [
      gsO("Zhukov", "Reinforce Tormosin", ["gsDecWinter"], { otl: true, flags: { gsChir: "tormosin" } }),
      gsO("Rokossovsky", "Reinforce the ring", ["gsDecWinter"], { flags: { gsChir: "ring" } }),
      gsO("Yeremenko", "Reinforce Kotelnikovo", ["gsDecWinterStalls"], { flags: { gsChir: "kotelnikovo" } }),
    ]),
  gsR("gsDecWinter", 19421212, "DECEMBER 1942", "Wintergewitter",
    "Manstein's relief attack, Wintergewitter, is moving up from Kotelnikovo towards the Sixth Army.",
    [
      gsO("Zhukov", "A gamble", ["gsMansteinBreaks"], { flags: { gsWinter: "gamble" } }),
      gsO("Yeremenko", "Call for reinforcements", ["gsMansteinStops"], { otl: true, flags: { gsWinter: "reinforce" } }),
    ]),
  gsR("gsDecWinterStalls", 19421214, "DECEMBER 1942", "Wintergewitter Stalls",
    "With Kotelnikovo reinforced, the German relief attack has stalled early, and the Stavka can think of bigger things.",
    [
      gsO("Vatutin", "Launch Grand Saturn", ["gsRostovTaken"]),
      gsO("Rokossovsky", "Launch Small Saturn and the Big Koltso", ["gsRostovTaken"]),
    ]),
  gsR("gsMansteinBreaks", 19421220, "DECEMBER 1942", "Manstein Breaks Through",
    "Manstein's relief force has broken through towards Stalingrad. The Stavka has to decide between Saturn and the pocket.",
    [
      gsO("Vatutin", "Launch Grand Saturn", ["gsRostovOurs"]),
      gsO("Rokossovsky", "Cancel Saturn: everything to Stalingrad", ["gsWinterstorm"]),
    ]),
  gsR("gsMansteinStops", 19421220, "DECEMBER 1942", "Manstein Stops",
    "The relief attack has been stopped short of the Sixth Army, and the Stavka can go for the Kotelnikovo attack and Small Saturn or finish the Koltso quickly.",
    [
      gsO("Zhukov", "Launch Kotelnikovo and Small Saturn", ["gsGermansWithdraw"], { otl: true }),
      gsO("Rokossovsky", "Finish the Koltso quickly", ["gsGermansWithdraw"]),
    ]),
  gsR("gsRostovOurs", 19430105, "JANUARY 1943", "Rostov Is Ours, Stalingrad Is German",
    "Grand Saturn has reached Rostov, and the Sixth Army has not been destroyed.",
    [
      gsO("Vatutin", "Rush east", [], { flags: { gsRostov: "east" } }),
      gsO("Zhukov", "Hold Rostov and prepare defences", [], { flags: { gsRostov: "hold" } }),
    ]),
  gsR("gsWinterstorm", 19430102, "JANUARY 1943", "Winterstorm at the Brink",
    "Stalingrad has held, and the Germans are at the brink of relieving it.",
    [
      gsO("Chuikov", "Push everywhere at once", [], { flags: { gsBrink: "all" } }),
      gsO("Rokossovsky", "Push towards the Chir to threaten Rostov", [], { flags: { gsBrink: "chir" } }),
    ]),
  gsR("gsGermansWithdraw", 19430115, "JANUARY 1943", "The Germans Withdraw from the Caucasus",
    "With Stalingrad lost to them, the German armies in the Caucasus are withdrawing, and the Southern and Transcaucasus Fronts have to go after them.",
    [
      gsO("Vatutin", "Take Rostov", ["gsKuban"]),
      gsO("Tyulenev", "Strike south to flank them", ["gsKuban"]),
    ]),
  gsR("gsJanIskra", 19430112, "JANUARY 1943", "Iskra",
    "The Leningrad and Volkhov Fronts break the blockade of Leningrad in Operation Iskra.",
    [
      gsO("Govorov", "Sinyavino again", ["gsFebPolarStar"]),
      gsO("Voroshilov", "Schlisselburg, the shortest road", ["gsFebPolarStar"], { otl: true }),
    ]),
  gsR("gsFebPolarStar", 19430210, "FEBRUARY 1943", "Polar Star",
    "The next step at Leningrad is the great offensive in the north, Polar Star.",
    [
      gsO("Voroshilov", "Reinforce the city, with artillery to harass the Germans and lock them in", [], { flags: { gsPolar: "city" } }),
      gsO("Govorov", "An offensive on the whole front", [], { otl: true, flags: { gsPolar: "all" } }),
      gsO("Meretskov", "Priority to Mga and Krasny Bor", [], { flags: { gsPolar: "mga" } }),
    ]),
  gsR("gsRostovTaken", 19430215, "FEBRUARY 1943", "Rostov Is Taken: Where Next?",
    "Rostov is in Soviet hands, and the question is where to go on.",
    [
      gsO("Tyulenev", "South, before they pull back", ["gsKuban"]),
      gsO("Vatutin", "Liberate the Donbas", ["gsEarlyUkraine"]),
    ]),
  gsR("gsKuban", 19430220, "FEBRUARY 1943", "The Kuban Stronghold",
    "The Germans have withdrawn into the Kuban bridgehead, and the Seventeenth Army and part of the First Panzer Army can be trapped there.",
    [
      gsO("Vatutin", "One final push", ["gsDestroyed17th"]),
      gsO("Oktyabrsky", "Block them off by sea", ["gsDestroyed17th"]),
      gsO("Zhukov", "Only cover them, and put the main effort in the north", []),
    ]),

  // ---- the speculative ends of the tree ----
  gsR("gsAgcAnnihilated", 19420215, "FEBRUARY 1942", "Army Group Centre Annihilated: No Blau",
    "Draft. The thrust for Vyazma closes round Army Group Centre, and some fifty German divisions are lost. There is no summer offensive. The tree gives no further steps, and an alternate spine is to be written.",
    gsGo([], { gsVariant: "agcAnnihilated" })),
  gsR("gsEarlyUkraine", 19430220, "FEBRUARY 1943", "Early Ukraine, 1943",
    "Draft. The Donbas is attacked in February and not left until the spring. The tree gives no further steps.",
    gsGo([], { gsVariant: "earlyUkraine" })),
  gsR("gsDestroyed17th", 19430301, "MARCH 1943", "The Seventeenth Army and the First Panzer Army Destroyed",
    "Draft. The Germans in the Kuban are trapped and destroyed. The tree gives no further steps.",
    gsGo([], { gsVariant: "kubanDestroyed" })),
].forEach((r) => { GS_REPORTS[r.id] = r; });

/** The queue after an order: the reports it opens are added, those it closes (and the report itself) are taken out, and the earliest comes next. */
function gsAfter(flags, spec, order) {
  const seen = [...(Array.isArray(flags.gsSeen) ? flags.gsSeen : []), spec.id, ...(order.drop || [])];
  const drop = new Set([spec.id, ...(order.drop || [])]);
  const then = typeof order.then === "function" ? order.then(flags) : order.then || [];
  const queue = (Array.isArray(flags.gsQ) ? flags.gsQ : []).filter((id) => !drop.has(id));
  for (const id of then) if (GS_REPORTS[id] && !queue.includes(id) && !seen.includes(id)) queue.push(id);
  queue.sort((a, b) => GS_REPORTS[a].at - GS_REPORTS[b].at);
  return { next: queue.length ? queue[0] : GS_MERGE, queue: queue.slice(1), seen };
}

function gsBuildReport(spec, flags, meters) {
  const orders = typeof spec.orders === "function" ? spec.orders(flags) : spec.orders;
  return {
    date: spec.date,
    title: spec.title,
    historicalRecord: orders.some((o) => o.otl) ? true : undefined,
    situation: typeof spec.situation === "function" ? spec.situation(flags) : spec.situation,
    choices: orders.map((o) => {
      const after = gsAfter(flags, spec, o);
      const bookkeeping = { gsQ: after.queue, gsSeen: after.seen };
      const choice = {
        label: o.label,
        advisor: { name: o.adviser, position: o.position || "Draft: " + o.label + "." },
        ...(o.otl ? { historical: true } : {}),
        setFlags: { ...(o.flags || {}), ...bookkeeping },
        impact: { manpower: 0, fuel: 0, initiative: 0 },
        next: after.next,
        outcome: o.outcome || (o.otl ? "What happened (draft). The outcome is to be written." : "Speculative (draft). The outcome is to be written."),
      };
      if (o.rolls) {
        const first = modWeight(o.rolls[0].w, meters.initiative);
        choice.uncertain = o.rolls.map((r, i) => ({
          weight: i === 0 ? first : 100 - first,
          title: r.title,
          setFlags: { ...(r.flags || {}), ...bookkeeping },
          impact: { manpower: 0, fuel: 0, initiative: 0 },
          outcome: r.outcome,
        }));
      }
      return choice;
    }),
  };
}

/** The Soviet campaign with the tree in place of its 1942 reports: the two reports that led to the defence of Moscow now lead to the tree. */
function gsMakeCampaign(base) {
  return {
    ...base,
    name: "Soviet High Command: Grand Campaign (experimental)",
    resolveNode(id, flags, meters) {
      if (GS_REPORTS[id]) return gsBuildReport(GS_REPORTS[id], flags, meters);
      const node = base.resolveNode(id, flags, meters);
      if (!node || !node.choices) return node;
      return { ...node, choices: node.choices.map((c) => (c.next === "moscowDefense41" ? { ...c, next: "gsDec41" } : c)) };
    },
  };
}

const GS_ACTIVE = (() => {
  try {
    return typeof window !== "undefined" && (new URLSearchParams(window.location.search).get("grand") === "soviet" || window.localStorage.getItem("dispatches1940_experimental") === "grand-soviet");
  } catch (e) {
    return false;
  }
})();
if (GS_ACTIVE) CAMPAIGNS.soviet = gsMakeCampaign(CAMPAIGNS.soviet);
