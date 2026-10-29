const GS_MERGE = "kharkov43";
// The grand Soviet campaign (EXPERIMENTAL). The consultant's tree for December 1941 to February 1943 (docs/grand/soviet-tree.md) written as data and played
// in place of the Soviet campaign's 1942 reports, only when the page is opened with ?grand=soviet (or localStorage dispatches1940_experimental = "grand-soviet").
// Nothing here runs otherwise, and the four campaigns and their baselines are untouched.
//
// The tree draws the January 1942 theatres side by side, and a player is in one report at a time, so the theatres are interleaved by date. Each order says
// which reports it opens (`then`) and which it closes (`drop`); the reports opened and not yet played wait in a queue (flags.gsQ) and the earliest comes next;
// when the queue is empty the campaign rejoins the Soviet one at GS_MERGE. So a theatre that the player's strategy leaves out simply never appears.
//
// An entry: gsR(id, day, date, title, situation, orders, opts). `day` is YYYYMMDD and only orders the queue. An order: gsO(adviser, label, then, more) with
// more = { otl (the record's order), flags, drop, position, outcome, imp: [manpower, matériel, initiative], rolls: [{ w, title, flags, outcome, imp }] }.
// opts = { rec: false } for a report that did not happen in the record, { alt: true } for one beyond what historians argue. The texts are written; the
// impacts are a first estimate and have not been balanced. tools/check-grand-soviet.mjs checks the graph.

const gsR = (id, at, date, title, situation, orders, opts) => ({ id, at, date, title, situation, orders, ...(opts || {}) });
const gsO = (adviser, label, then, more) => ({ adviser, label, then, ...(more || {}) });
const gsGo = (then, flags, label, outcome, imp) => [gsO("Stavka", label || "Carry on", then, { flags, outcome, imp, position: "There is nothing to decide here, and the war goes on to the next report." })];

const GS_REPORTS = {};
[
  // =============================================================================== DECEMBER 1941 AND THE PLAN FOR THE WINTER
  gsR("gsDec41", 19411205, "DECEMBER 1941", "Moscow: The Turning Point",
    "On 5 December the German armies before Moscow have been stopped, not beaten. Their tanks are worn out, their supplies come by a few railways, and the winter has caught them in summer clothing. The Stavka has held back reserves for weeks: divisions brought from Siberia and the Far East since October, and three new armies formed behind the capital. Zhukov, who commands the Western Front, wants to use them now, before the Germans can dig in. The question is whether to strike at once and along the whole front with what there is, to wait until the reserves are stronger, or to put them on the flanks of the German salient and not at its face.",
    [
      gsO("Rokossovsky", "Postpone the attack until we can amass more", ["gsJan42"], {
        flags: { gsDec41: "postpone" }, imp: [1, 1, -1],
        position: "The armies are not ready, and a failed attack in December would leave nothing to stop the Germans in January, so the blow waits until the reserves have their guns and their tanks.",
        outcome: "Speculative. The attack is put off by a fortnight and then by another, and the reserves reach the line with more of their artillery. The Germans use the time too. They dig the line deeper, bring up what reinforcements they can and begin, on the generals' own initiative, to think of a shorter line. It is a better prepared offensive against a better prepared enemy, and it begins in the worst of the frost.",
      }),
      gsO("Zhukov", "Launch the attack on the 5th across the whole front", ["gsJan42"], {
        otl: true, flags: { gsDec41: "launch" }, imp: [-1, -1, 1],
        position: "The Germans are at the end of their strength and believe that the Red Army has none left, so the blow falls at once, on every part of the front, before they can recover.",
        outcome: "What happened. The Kalinin Front attacked on 5 December and the Western Front on the 6th. The Germans, who had thought the Red Army finished, were thrown back by between 100 and 250 kilometres: Klin and Kalinin were retaken in the middle of December and Kaluga at the end of the month. On 16 December Hitler forbade any retreat, dismissed Brauchitsch and took command of the army himself. The order held Army Group Centre together, at a price in frostbite and dead that the generals who wished to withdraw had foretold.",
      }),
      gsO("Vasilevsky", "Refocus our last reserves on the flanks", ["gsJan42"], {
        flags: { gsDec41: "flanks" }, imp: [-1, 0, 1],
        position: "A blow at the face of the salient meets the German guns where they are thickest, so the last reserves go to the flanks at Klin and Tula, where the line is thin and a thrust can reach the rear.",
        outcome: "Speculative. The reserves go into the northern and southern flanks and not into the centre. The thrusts at Klin and Tula go deeper than they did in the record and the German centre is pinched from both sides. With less weight against its face, though, Army Group Centre is able to fall back in order, and the encirclement that the Stavka had hoped for does not close.",
      }),
    ]),
  gsR("gsJan42", 19420105, "JANUARY 1942", "The Counteroffensive Begins",
    (f) => "On 5 January the Stavka meets to decide what the winter is for. Stalin wants the offensive carried on along the whole front, from Lake Ladoga to the Crimea, while the Germans are off balance and before their reinforcements arrive. Shaposhnikov, the Chief of the General Staff, would see the plan through. Zhukov, whose armies have done most of the fighting, argues that the Red Army has not the men, the guns or the tanks to attack everywhere, and that the weight should stay on the Moscow front, where the Germans can be hurt." + (f.gsDec41 === "postpone" ? " The armies are fresher than they would have been, but the Germans have had their fortnight too." : ""),
    [
      gsO("Shaposhnikov", "Attack along the whole front, from the Baltic to the Black Sea", ["gsJanLyuban", "gsJanMoscow", "gsJanKerch", "gsJanDemyansk", "gsJanSevastopol", "gsJanBarvenkovo", "gsJanKursk"], {
        otl: true, flags: { gsPlan: "wide" }, imp: [-1, -1, 1],
        position: "The Germans have lost the initiative everywhere at once, and an army that stops to gather itself gives back the time it has won, so every front attacks and the enemy has nowhere to send his reserves.",
        outcome: "What happened. Stalin's plan was adopted, with Zhukov's objection heard and not heeded. The winter offensive was a string of separate operations, from Leningrad to the Crimea, each one short of the men, tanks and supplies that it needed. Most of them gained ground at first and then stalled, and several ended with the Soviet force that had advanced cut off behind the German line. The Red Army went into the spring thinly spread, and the Germans struck at its weakest places in May.",
      }),
      gsO("Zhukov", "Concentrate on Moscow only", ["gsJanRzhevVyazma", "gsJanCrisis"], {
        flags: { gsPlan: "moscow" }, imp: [0, 1, 0],
        position: "An army that attacks everywhere is strong nowhere, so the tanks, the guns and the last reserves go into the Moscow front, where a success would break Army Group Centre, and the rest of the line holds with what it has.",
        outcome: "Speculative. Zhukov's argument carries, and the Western and Kalinin Fronts get the tanks and guns that would have been scattered along the line. Leningrad, the Crimea and the south are told to hold. The Germans have time to take their breath in the north and the south, and the offensive that is mounted at Moscow is the heaviest that the Red Army can make.",
      }),
    ]),

  // =============================================================================== THE JANUARY THEATRES
  gsR("gsJanMoscow", 19420108, "JANUARY 1942", "Moscow: How Far West",
    "The Western and Kalinin Fronts are to continue the attack west of Moscow, in an operation against the Rzhev and Vyazma salient that is meant to destroy Army Group Centre. The ground is deep in snow and the roads are few. The armies at the front are well below strength, and the Germans, who still hold Rzhev, Vyazma and Smolensk, are bringing in divisions from the west. The Western Front can aim for Vyazma and the German rear, or for the nearer objects at Olenino and Yukhnov, where the line can be held.",
    [
      gsO("Rokossovsky", "Take the safer bet: Olenino and Yukhnov", ["gsFebExhaustion"], {
        flags: { gsMoscow: "safe" }, imp: [0, 0, -1],
        position: "A deep thrust beyond the supplies of an army that is half strength is a thrust that ends in encirclement, so the nearer objects are taken and held.",
        outcome: "Speculative. The attack at Olenino and Yukhnov goes in with its flanks covered and takes a good part of what it aims at. The armies stay in touch with their supplies and are not cut off. They are also nowhere near Vyazma, and the German line, shorter and straighter, holds.",
      }),
      gsO("Zhukov", "Go all the way to Vyazma", ["gsFebExhaustion"], {
        otl: true, flags: { gsMoscow: "vyazma" }, imp: [-2, -1, 1],
        position: "Vyazma is the key to the German rear, and the Germans have no reserves with which to cover it, so the armies press on while they can.",
        outcome: "What happened. The Rzhev and Vyazma operation began on 8 January. The Kalinin Front broke into the German line near Olenino, and the Western Front's 33rd Army and Belov's cavalry corps got within a few kilometres of Vyazma, where they joined the partisans and the paratroops that had been dropped into the German rear. The German salient at Rzhev was not cut off. By the end of February the advance had been cut off in its turn, and most of the 33rd Army was lost that spring.",
      }),
    ]),
  gsR("gsJanLyuban", 19420110, "JANUARY 1942", "Lyuban",
    "The Volkhov Front, under Meretskov, is to break the German line on the Volkhov and cut off the German force that holds Chudovo and the road to Leningrad. The Second Shock Army is to go through the marshes and the forest at Myasnoi Bor and meet the Leningrad Front at Lyuban. There are no real roads and the Front's supplies are poor. Meretskov would aim for a smaller pincer, with Lyuban as its object. Khozin, who commands the Leningrad Front, holds to the Stavka's larger plan, which would go on to Luga.",
    [
      gsO("Meretskov", "A smaller pincer to Lyuban", ["gsMayLyuban"], {
        flags: { gsLyuban: "small" }, imp: [-1, 0, 0],
        position: "The Second Shock Army cannot be supplied through the marshes for more than a short distance, so the aim is Lyuban and no further, and the army is not stretched beyond what the track will carry.",
        outcome: "Speculative. The Second Shock Army goes in with a limited aim, closer to its supplies, and a shorter neck behind it. It does not reach Luga, and it does not need to. The neck at Myasnoi Bor is narrower to hold than the record's was, but the army at the end of it is still in the marshes in the spring, with the Germans on both sides.",
      }),
      gsO("Khozin", "All the way to Luga", ["gsMayLooming"], {
        otl: true, flags: { gsLyuban: "luga" }, imp: [-2, -1, 1],
        position: "The German Eighteenth Army is stretched round Leningrad and is thinner than it looks, so the blow goes as deep as it can, past Lyuban to Luga, and the whole siege front is rolled up.",
        outcome: "What happened. The Volkhov Front broke into the German line from 7 January, and the Second Shock Army pushed some seventy kilometres through the forest to the Lyuban area, at the end of a corridor only a few kilometres wide. It was never widened. The Germans counterattacked at the neck in March, and the army was left strung out in the marshes with its supplies on a single track.",
      }),
    ]),
  gsR("gsJanKerch", 19420111, "JANUARY 1942", "Kerch and Feodosia",
    "At the end of December the Black Sea Fleet landed troops at Kerch and Feodosia and took back the Kerch peninsula, and the German Eleventh Army, which had been about to take Sevastopol, turned to meet them. A new Crimean Front under Kozlov is being formed on the peninsula, with Mekhlis as the Stavka's representative. The troops are crowded on a narrow neck of land, with little room and few roads. The Front has to say where the weight of its effort will go, and the German counterattack will not be long.",
    [
      gsO("Oktyabrsky", "Only raids, and reinforce Sevastopol", ["gsMarKerch"], {
        flags: { gsCrimea: "raids" }, imp: [0, 0, -1],
        position: "The peninsula cannot be held against the German Eleventh Army without the ships to supply it, and Sevastopol is the base that matters, so the effort goes to the fortress and Kerch is left to raids.",
        outcome: "Speculative. The landing force is held on the peninsula with minimal ambitions, and the ships and the reinforcements go to Sevastopol. The fortress is better supplied than it was in the record when Manstein returns to it. The Soviet position at Kerch is smaller and less exposed, and has less chance of tying down the Germans.",
      }),
      gsO("Tolbukhin", "Main focus on Kerch", ["gsMarKerch"], {
        flags: { gsCrimea: "kerch" }, imp: [-1, 0, 0],
        position: "The peninsula's neck is the Germans' only way in, so the Front is built round it at Kerch, and everything is done to make it as deep and as hard to break as the ground allows.",
        outcome: "Speculative. The Front is organised in depth round Kerch and the neck, with its reserves behind the first line and its guns sited to cover the approaches. Feodosia, on the German side of the neck, is given up in due time, and the line on the Parpach neck is not the single crowded position that it was in the record.",
      }),
      gsO("Kozlov", "Main focus on Feodosia", ["gsMarKerch"], {
        otl: true, flags: { gsCrimea: "feodosia" }, imp: [-1, 0, 1],
        position: "Feodosia is the Germans' door to the peninsula, and the Eleventh Army has to be kept from returning through it, so the weight of the Front is put forward at Feodosia.",
        outcome: "What happened. Feodosia was held by the forces that had been landed there, with the Front's weight forward. The Germans counterattacked on 15 January and retook the town on the 18th, and the Soviet troops fell back to the Parpach neck, where the Crimean Front was formed at the end of the month.",
      }),
      gsO("Alexander", "Focus on the northern port at Sevastopol", ["gsMarKerch"], {
        flags: { gsCrimea: "north" }, imp: [0, 0, 0],
        position: "The northern side of the harbour is where the fortress is open to a storm and where its supplies come in, so the effort goes to holding the port and its approaches.",
        outcome: "Speculative. The northern port and its approaches are strengthened at the cost of the Kerch operation, which is run on what is left. Sevastopol's defence is better placed when the Germans return to it in the summer, and the force on the Kerch peninsula is weaker than it was.",
      }),
    ]),
  gsR("gsJanDemyansk", 19420113, "JANUARY 1942", "Demyansk",
    "The Northwestern Front, under Kurochkin, has attacked south of Lake Ilmen and is behind the German II Corps, which holds the town of Demyansk and the country about it. The Germans are likely to be cut off if the Soviet armies close the ring, and a cut-off garrison will have to be supplied by air. The Front can keep up the pressure towards Staraya Russa, on the Germans' flank, or put airborne troops down inside the German position.",
    [
      gsO("Chernyakhovsky", "Maintain the pressure on Staraya Russa", ["gsFebExhaustion"], {
        flags: { gsDemyansk: "pressure" }, imp: [-1, 0, 0],
        position: "The Germans at Demyansk are held by their flank at Staraya Russa, so it is there that the pressure is kept up, and the ring is closed from the side where the ground is hardest for them.",
        outcome: "Speculative. The Front keeps up its pressure on Staraya Russa. The German hold on the town is made more uncomfortable, and the force at Demyansk is more difficult to supply. It is not cut off in the way that it was in the record, and the airlift is not needed.",
      }),
      gsO("Kurochkin", "Airborne troops inside Demyansk", ["gsFebExhaustion"], {
        otl: true, flags: { gsDemyansk: "airborne" }, imp: [-1, 0, 1],
        position: "A garrison that is cut off must not be allowed to settle, so airborne troops are dropped inside the ring and the Germans have to deal with them as well.",
        outcome: "What happened. Soviet troops of the Northwestern Front closed round the Germans at Demyansk in the second week of February, and the German II Corps, about 95,000 men, was supplied by air for the next two months. Airborne troops were dropped in the area, with little result. A German relief force broke through in April, and the pocket was held.",
      }),
    ]),
  gsR("gsJanSevastopol", 19420115, "JANUARY 1942", "Sevastopol: Where to Expect the Blow",
    "Sevastopol has held out through its first German assault in December, and the garrison has been fed by sea at a heavy cost to the fleet. Petrov commands the Separate Coastal Army inside the fortress. The Germans have turned away to deal with the landings at Kerch, but they will come back, and the defenders have to say where. A great part of the army's strength is tied up in places that the Germans may never attack.",
    [
      gsO("Alexander", "Focus on the northern port", ["gsMarKerch"], {
        flags: { gsSevastopolHold: "port" }, imp: [0, 0, 0],
        position: "The northern side of the harbour is where the fortress is open to a storm and where its supplies come in, so the best of the reserves are held for it.",
        outcome: "Speculative. The reserves are held back for the northern side. The line on the highway is thinner than it was, and the Germans find it out in the summer.",
      }),
      gsO("Petrov", "Focus on the highway", ["gsMarKerch"], {
        otl: true, flags: { gsSevastopolHold: "highway" }, imp: [0, 0, 0],
        position: "The road from Simferopol is the way the Germans came in December, and the way they will come again, so the best of the guns and reserves are put where it enters the fortress.",
        outcome: "What happened. The fortress's best troops were put where the road from Simferopol enters the defences, as in December. The Germans returned in June, after the Kerch peninsula had been lost, and the defence that held on the highway was turned from the other side.",
      }),
    ]),
  gsR("gsJanBarvenkovo", 19420118, "JANUARY 1942", "Barvenkovo",
    "On 18 January the Southwestern and Southern Fronts attack across the Donets south of Kharkov, to take Lozovaya and reach the Dnieper at Dnepropetrovsk and Zaporozhye. Timoshenko directs the south-western axis, with Bagramyan as his chief of staff, and Malinovsky commands the Southern Front beside him. The attack makes ground quickly, and a great bulge forms in the German line. Timoshenko wants to go for the Dnieper. Malinovsky would turn the effort to the two German strongpoints on the shoulders of the bulge, at Slavyansk and Balakleya.",
    [
      gsO("Malinovsky", "Refocus on Slavyansk and Balakleya", ["gsMarUrban"], {
        flags: { gsBarvenkovo: "shoulders" }, imp: [-1, 0, 0],
        position: "A salient whose two shoulders are in German hands is a trap for the army inside it, so Slavyansk and Balakleya are taken first and the bulge is made safe before it is made deeper.",
        outcome: "Speculative. The two shoulders become the objects of the attack. The bulge is a little shallower than it was in the record and the Dnieper is out of reach, but the base of it is wider, and the Soviet armies inside it are less open to being cut off.",
      }),
      gsO("Timoshenko", "To the Dnieper", ["gsMarUrban"], {
        otl: true, flags: { gsBarvenkovo: "dnieper" }, imp: [-1, -1, 1],
        position: "The Germans are off balance and the road to the Dnieper is open, so the armies go on while the frost holds and take the river crossings before the Germans can bring up their reserves.",
        outcome: "What happened. The Barvenkovo and Lozovaya operation made a salient about 100 kilometres deep and 90 wide south of Kharkov in a few days. It was then held up, short of supplies and fuel, and did not reach Dnepropetrovsk or Zaporozhye. Both shoulders stayed in German hands, and the bulge stood as a threat to them and an invitation to the Germans.",
      }),
    ]),
  gsR("gsJanKursk", 19420120, "JANUARY 1942", "Kursk, Oboyan, Orel",
    "On the northern side of the same operation, the Bryansk Front and the left wing of the Southwestern Front are told to attack towards Kursk, Oboyan and Orel. The roads are bad, the frost is hard, and the force that can be spared is small. These are not places that the Germans can be driven out of cheaply. Bagramyan, at Timoshenko's staff, doubts that the attack is worth what it will cost.",
    [
      gsO("Bagramyan", "Stop", ["gsMarUrban"], {
        flags: { gsKursk: "stop" }, imp: [1, 0, -1],
        position: "A second attack towards Kursk spreads the army's strength over two directions, and neither can then be pushed home, so the northern attack is stopped and its troops are sent to the south.",
        outcome: "Speculative. The northern attack is stopped and its troops go to the main effort in the south, which is a little stronger for them. Kursk and Orel stay in German hands, as they did in the record.",
      }),
      gsO("Timoshenko", "Attack", ["gsMarUrban"], {
        otl: true, flags: { gsKursk: "attack" }, imp: [-1, 0, 0],
        position: "The Germans have been driven from Moscow's approaches, and the same blow, struck now towards Kursk and Orel, will find them as weak, so the attack goes in.",
        outcome: "What happened. The attacks towards Kursk and Oboyan were made in January and February and gained little. The Germans held the towns, and Kursk and Orel were not recovered until the summer of 1943.",
      }),
    ]),
  gsR("gsJanRzhevVyazma", 19420108, "JANUARY 1942", "Rzhev and Vyazma: The Operations Begin",
    "Everything that the Stavka can spare has been put into the Western and Kalinin Fronts, and the operation against the Rzhev and Vyazma salient has the weight behind it that it lacked in the record. The Germans are on the defensive and short of reserves. The operation can be run as a safe bite at the salient, at Olenino and Yukhnov, or as a deep thrust for Vyazma and the German rear that could close a ring round Army Group Centre.",
    [
      gsO("Rokossovsky", "Take the safer bet: Olenino and Yukhnov", ["gsFebExhaustion"], {
        flags: { gsMoscow: "safe" }, imp: [0, 0, -1],
        position: "Even with the reserves behind it, an army that goes deep in January is on its own in February, so the nearer objects are taken and held and the Germans are pushed back by stages.",
        outcome: "Speculative. The operation takes Olenino and Yukhnov and a stretch of country behind them. The Germans are driven back, with their line made shorter and straighter than before. The ring is not closed, but the army is not in danger of being cut off, and it has the strength to go on.",
      }),
      gsO("Zhukov", "All towards Vyazma", ["gsAgcAnnihilated"], {
        flags: { gsMoscow: "vyazmaAll" }, imp: [-2, -2, 2],
        position: "With the whole weight of the Stavka behind him, Zhukov has what he lacked in the record, and Vyazma is the point at which Army Group Centre can be cut off, so everything goes towards it.",
        outcome: "Alternate history. The armies go for Vyazma in strength, with their flanks covered and their supplies behind them. They meet there in the second half of February, and the Germans, who have been ordered to hold, are closed in. It is a victory with no parallel in the record, and no one can say how far it would have gone.",
      }),
    ], { rec: false }),
  gsR("gsJanCrisis", 19420125, "JANUARY 1942", "Crisis in Leningrad and Sevastopol",
    "With the reserves at Moscow, the other fronts hold what they have. In Leningrad the dead of the winter are counted in tens of thousands, the bread ration is at its lowest and the ice road across Lake Ladoga is the only way in. At Sevastopol the first German storm has been beaten off, and the garrison is fed by the ships of the Black Sea Fleet at a high price. Both are in trouble, and both have asked the Stavka for more.",
    [
      gsO("Zhukov", "Hold with what you have", ["gsAugSinyavino", "gsMayCrimea"], {
        flags: { gsCrisis: "hold" }, imp: [0, 1, 0],
        position: "The Moscow front is the one on which the war can be won this winter, and every division taken from it is a division the Germans can use against it, so Leningrad and Sevastopol hold what they have.",
        outcome: "Speculative. Leningrad and Sevastopol are left to hold with what they have. The Moscow front keeps its strength. The ice road carries what it can, and Sevastopol is supplied by sea at the risk of the fleet. It is a hard winter in both places and a harder spring.",
      }),
      gsO("Stalin", "Send minor reinforcements: save them", ["gsAugSinyavino", "gsMayCrimea"], {
        flags: { gsCrisis: "minor" }, imp: [-1, -1, 0],
        position: "Neither can be abandoned, and neither can be made strong, so a little is sent to each by the ice road and by sea, and it is hoped that it will be enough.",
        outcome: "Speculative. A few divisions and some supplies are sent to Leningrad and Sevastopol. They are enough to get both through the winter and not enough to change what is likely to happen to them in the summer. The Moscow front is a little weaker for it.",
      }),
    ], { rec: false }),

  // =============================================================================== FEBRUARY AND MARCH
  gsR("gsFebExhaustion", 19420215, "FEBRUARY 1942", "Overall Exhaustion",
    (f) => "By the middle of February the winter offensive is running down. The rifle divisions are at a third or a half of their strength, the tanks are worn out, the guns have no shells and the roads are impassable in the thaw. The German line has stiffened, and the Germans have begun to counterattack." + (f.gsMoscow === "vyazma" ? " The 33rd Army and Belov's cavalry are deep in the German rear west of Vyazma and cannot be reached." : "") + " The Western and Kalinin Fronts can push on for Vyazma, or protect the flanks of what they have taken at Bely and Rzhev, or stop.",
    [
      gsO("Konev", "Focus on our flanks at Bely and Rzhev, to prevent encirclements", ["gsMarAssessment"], {
        flags: { gsFeb: "flanks" }, imp: [0, 0, -1],
        position: "The advance has made salients, and a salient with open flanks is a trap for the army inside it, so the effort goes to the flanks at Bely and Rzhev before the Germans can close them.",
        outcome: "Speculative. The flanks of the advance at Bely and Rzhev are made firm and held, with the troops that would have gone further on. The Soviet advance stops where it is, and the Germans' counterattacks find it harder to cut off than they did in the record.",
      }),
      gsO("Zhukov", "Push on to Vyazma", ["gsMarAssessment"], {
        otl: true, flags: { gsFeb: "vyazma" }, imp: [-2, -1, 1],
        position: "The Germans at Rzhev and Vyazma are on the point of being cut off, and a halt now gives them time to bring up the divisions that they need, so the offensive goes on to the end.",
        outcome: "What happened. The attack on Vyazma went on into March and April and did not reach it. The Germans' counterattacks closed the gap behind the advance in the following weeks, and the force that had gone forward, the 33rd Army, the cavalry and the paratroops, was cut off. The 33rd Army was destroyed in April, and Belov's cavalry broke out in June.",
      }),
      gsO("Purkayev", "Stop and defend", ["gsMarAssessment"], {
        flags: { gsFeb: "stop" }, imp: [1, 1, -1],
        position: "The armies have done what they can, and what they have is worth more as a defence than as a spent attack, so the offensive stops and the line is made firm.",
        outcome: "Speculative. The offensive stops in February. The armies have two months in which to rest, to bring up what they lack and to dig in, and the Germans are free to do the same. The line at Rzhev and Vyazma is one that the Red Army can hold.",
      }),
    ]),
  gsR("gsMarKerch", 19420310, "MARCH 1942", "Kerch: The Direction",
    "The Crimean Front stands on the Parpach neck of the Kerch peninsula, with the sea on both sides and no room for depth. Three offensives are to be made in the late winter to break out and relieve Sevastopol, and Mekhlis, who represents the Stavka at the front, presses for more. The German Eleventh Army is across the neck, and there is little cover. Kozlov, who commands the Front, would prepare to defend the neck. Mekhlis wants the offensive prepared.",
    [
      gsO("Kozlov", "Prepare defences", ["gsMayTrappenjagd"], {
        flags: { gsKerch: "defend" }, imp: [1, 0, -1],
        position: "The peninsula is a narrow place for a large army, and if the Germans attack it the Front will have no room, so the army is dug in in depth and the reserves are kept back.",
        outcome: "Speculative. The army is dug in in depth along the neck, with the reserves held behind the first line, and no further attempts are made to break out. The Germans will attack in May, and the Front is more able to meet them than it was in the record.",
      }),
      gsO("Mekhlis", "Prepare the offensive", ["gsMayCrimea"], {
        otl: true, flags: { gsKerch: "offensive" }, imp: [-2, -1, 1],
        position: "The Front's task is to relieve Sevastopol, and an army that sits still on the neck is an army that has given the Germans time, so it is prepared to attack again.",
        outcome: "What happened. The Crimean Front attacked on 27 February, on 13 March and again from 26 March into April, and the Germans held the line each time. The Front was left with a quarter of a million men crowded on the neck, mostly in the open and none in depth, and the offensive was prepared again in the spring.",
      }),
    ]),
  gsR("gsMarUrban", 19420312, "MARCH 1942", "Urban Crawling",
    (f) => "The Barvenkovo salient has settled down. The army inside it holds a bulge sixty kilometres across at its base, with Kharkov to the north and the Donets bridgeheads behind. The thaw is coming. The Southwestern Direction is making plans for the spring, and Timoshenko wants to take Kharkov, which lies in the north-west and could be taken by a series of slow attacks along the railways and through the suburbs." + (f.gsBarvenkovo === "shoulders" ? " The two shoulders of the bulge are in Soviet hands." : "") + " The Front can fortify the base of the bulge and hold what it has, or press on with more offensive measures.",
    [
      gsO("Malinovsky", "Reinforce and fortify the base of the bulge", ["gsMayKharkov2"], {
        flags: { gsUrban: "fortify" }, imp: [0, 1, -1],
        position: "The neck of the salient is a hundred kilometres from its tip and open to a German attack from both sides, so the base is reinforced and fortified before anything is done at Kharkov.",
        outcome: "Speculative. The base of the Barvenkovo salient is strengthened with infantry, guns and anti-tank defences, and the Southwestern Direction's plans for Kharkov are put back by a few weeks. The neck of the bulge is a harder place for the Germans to cut than it was in the record.",
      }),
      gsO("Bagramyan", "Take more offensive measures", ["gsMayKharkov2"], {
        flags: { gsUrban: "offensive" }, imp: [-1, 0, 1],
        position: "The Germans are weak, and an attack on Kharkov in the spring will find them as weak as they are now, so the preparations go ahead and the strength of the Front is put forward.",
        outcome: "Speculative. The Southwestern Direction puts its strength forward for the attack on Kharkov. Its armies are in better position to open the offensive in May, and less able to meet a German blow at the base of the bulge.",
      }),
    ]),
  gsR("gsMarAssessment", 19420315, "MARCH 1942", "Strategic Assessment for the Year",
    (f) => "The Stavka has to say what 1942 is for. The Germans will attack in the summer, and no one is sure where. Most of the Stavka expects the main blow to fall on Moscow again, and the reserves are held to meet it. Timoshenko wants to strike first in the south, at Kharkov, and spoil the German preparations. Stalin wants to go on attacking everywhere, with limited aims, in the Crimea, at Leningrad and Demyansk, and at Kharkov. Shaposhnikov would keep the main reserves for Moscow." + (f.gsPlan === "moscow" ? " With the winter's weight at Moscow, the south has not been attacked, and there is no Barvenkovo salient." : ""),
    [
      gsO("Timoshenko", "Focus on the south and forestall the Germans at Kharkov", (f) => (f.gsPlan === "moscow" ? ["gsMegaKharkov", "gsJulRzhev", "gsJunReichel"] : ["gsMegaKharkov", "gsJulRzhev"]), {
        drop: ["gsMayKharkov2"], flags: { gsYear: "south" }, imp: [-1, -1, 1],
        position: "The Germans will attack in the south, and the Red Army can be the first to attack, so everything that can be spared goes to the Southwestern Direction and a great battle is fought at Kharkov, on ground and at a time of its own choosing.",
        outcome: "Speculative. The Stavka puts the weight of its reserves into the Southwestern Direction and plans a great battle for Kharkov. The reserves at Moscow are thinner than they were, and the south is stronger than it was. It is a gamble on where the Germans will be, and the Germans, who know their own plans, will be elsewhere.",
      }),
      gsO("Stalin", "Spread our forces everywhere and attack everywhere", (f) => (f.gsPlan === "moscow" ? ["gsJulRzhev", "gsJunReichel"] : ["gsJulRzhev"]), {
        otl: true, flags: { gsYear: "everywhere" }, imp: [-1, -1, 0],
        position: "The Germans are weak everywhere, and the way to keep them from massing is to attack everywhere, so every front is given an offensive of its own and the reserves are shared among them.",
        outcome: "What happened. The Stavka decided on a strategic defence, with limited offensives in several places: in the Crimea, at Leningrad, at Demyansk, and at Kharkov. The reserves were shared among them, and few of the offensives were strong enough to succeed. The Germans, who had the initiative, chose the time and place of their attack.",
      }),
      gsO("Shaposhnikov", "Keep the main reserves for Moscow", (f) => (f.gsPlan === "moscow" ? ["gsJulRzhev", "gsJunReichel"] : ["gsJulRzhev"]), {
        flags: { gsYear: "moscow" }, imp: [1, 1, -1],
        position: "Moscow is where the Germans will strike when they can, and it is the one place that cannot be lost, so the main reserves are kept behind it and the other fronts do what they can with what is left.",
        outcome: "Speculative. The main reserves stay where they are, behind Moscow, and the other fronts are told to make do. The capital is secure, and the Germans, who attack in the south, find fewer reserves there than they might, and fewer Soviet armies in the way of the blow.",
      }),
    ]),

  // =============================================================================== MAY AND JUNE
  gsR("gsMayTrappenjagd", 19420508, "MAY 1942", "Trappenjagd Starts",
    "At dawn on 8 May, after a bombardment from the air and the guns, the German Eleventh Army begins Operation Trappenjagd, the Bustard Hunt, against the Parpach neck. The Crimean Front has dug in on the neck, in more depth than it had in the record. Kozlov expects a blow from the south, along the coast, where the German assault boats and infantry can get round the end of the line. Mekhlis expects it along the highway in the centre.",
    [
      gsO("Kozlov", "The Germans plan a sickle cut from the south", ["gsJunKerchSevastopol"], {
        flags: { gsTrapp: "south" }, imp: [0, 0, 0],
        position: "Manstein has a mind for the flank, and the coast, where the anti-tank ditch is shallowest and the sea is at the Germans' back, is the place where he can break through and turn the line from its end.",
        outcome: "Speculative. The Germans break through on the southern flank beside the sea and turn the line from there, as they did in the record. Because the Front has been dug in in depth, the break is slower and costlier for them, and the army has time to withdraw part of its force to the Kerch fortifications before it is cut off.",
      }),
      gsO("Mekhlis", "The Germans attack along the highway", ["gsJunKerchSevastopol"], {
        flags: { gsTrapp: "highway" }, imp: [-1, 0, 0],
        position: "The highway runs straight through the centre of the neck, and the German tanks need a road, so the reserves are put there and the flanks are left as they are.",
        outcome: "Speculative. The Germans strike on the southern flank beside the sea, where few reserves have been put, and the centre of the line, which has been strengthened to meet an attack on the highway, is turned from the side. The Front is in confusion within two days, though it has the depth to fall back and does not lose its whole force on the neck.",
      }),
    ]),
  gsR("gsMayCrimea", 19420518, "MAY 1942", "The Crimean Catastrophe",
    "On 8 May the German Eleventh Army attacked the Parpach neck, where a quarter of a million Soviet troops, ready to attack and not to defend, were packed into a few kilometres of open ground. The Germans broke through on the southern flank and turned the line from there, and the German air force had the sky. In ten days the Crimean Front was driven off the peninsula. The Front has to say where the Germans will turn next, and where the Soviet force that is left will stand.",
    [
      gsO("Kozlov", "The Germans plan a sickle cut from the south", ["gsJunKerchSevastopol"], {
        flags: { gsTrapp: "south" }, imp: [-2, -1, -1],
        position: "The Germans have broken the line on the coast and will turn it, and the only chance is to get what can be saved over the straits before the line is cut behind them.",
        outcome: "Speculative. The reserves are put behind the southern flank and the coast, where the blow falls, and the line there holds a little longer than it did in the record. With so many men in the open on the neck, though, the German air force and guns are still too much for it, and the Front is driven off the peninsula in the end, with the loss of well over a hundred thousand men.",
      }),
      gsO("Mekhlis", "The Germans attack along the highway", ["gsJunKerchSevastopol"], {
        otl: true, flags: { gsTrapp: "highway" }, imp: [-2, -1, -1],
        position: "The Germans must come along the highway, which is the only road for their tanks, so the line is held on the highway and the reserves are put up to it.",
        outcome: "What happened. The Front's reserves were not where the blow fell. It was turned from the south and broken, and Mekhlis was reduced in rank and recalled. Kerch was lost on 15 May, and the peninsula by the 20th.",
      }),
    ]),
  gsR("gsMayLyuban", 19420510, "MAY 1942", "The Lyuban Bulge",
    (f) => "The Second Shock Army has been cut off in the marshes since the Germans closed the neck at Myasnoi Bor in March. A narrow corridor was reopened and is held at a heavy price. The army, which has not been supplied for weeks, is eating its horses." + (f.gsLyuban === "small" ? " Its aim was Lyuban only, and it is not as far forward as the record's army was." : "") + " Meretskov and Vlasov, the army's new commander, disagree about what to do: to withdraw by a fighting retreat, to hold where they are, or to attack towards Tosno.",
    [
      gsO("Meretskov", "Make a fighting retreat", ["gsAugSinyavino"], {
        flags: { gsLyubanEnd: "retreat" }, imp: [0, 0, 0],
        position: "The army cannot be supplied where it is, and every week it stays there it is weaker, so it withdraws by stages along the corridor, fighting for each stage, before the Germans can close it.",
        outcome: "Speculative. The army begins to withdraw in May, on the Volkhov Front's own authority, and holds the corridor while its troops go through. It leaves its guns and heavy equipment in the marshes, and most of the men are saved. The Germans, who have been preparing to close the neck, find the bag empty.",
      }),
      gsO("Vlasov", "Hold", ["gsAugSinyavino"], {
        flags: { gsLyubanEnd: "hold" }, imp: [-2, -1, -1],
        position: "The army has taken the ground it holds at a great price, and to give it up is to give up what it was sent for, so it holds on and the Volkhov Front is asked to relieve it.",
        outcome: "Speculative. The army holds where it is while the Volkhov Front tries to relieve it. The Germans, who have the troops to close the neck, do so in the first days of June, and the army is cut off in its turn. Its last attempt to break out comes at the end of the month, and only a small number of the men get through.",
      }),
      gsO("Fedyuninsky", "Attack towards Tosno", ["gsAugSinyavino"], {
        flags: { gsLyubanEnd: "tosno" }, imp: [-2, 0, 1],
        position: "An army that cannot go back can go forward, and the way to Tosno is shorter than the way home, so the army attacks the Germans on the railway and breaks the siege from the inside.",
        outcome: "Speculative. The Second Shock Army attacks towards Tosno with all that it has left. It takes some ground and a stretch of the railway, and the Germans, who have to withdraw from the Lyuban area to meet it, are put out of their stride. The army does not reach Leningrad, and it cannot be supplied where it is.",
      }),
    ]),
  gsR("gsMayLooming", 19420512, "MAY 1942", "The Looming Catastrophe",
    "The Second Shock Army, at the end of a corridor that the Germans have closed and the Volkhov Front has reopened, is starving. Khozin's deep thrust to Luga has taken it a long way from its base, and it is in the marshes with no way out but the neck. Meretskov has asked that it be withdrawn. The Stavka has not yet agreed, and Vlasov, who commands the army, thinks that it can hold. Each week that is lost makes a catastrophe more likely.",
    [
      gsO("Vlasov", "Stand", ["gsAugSinyavino"], {
        otl: true, flags: { gsLyubanEnd: "stand" }, imp: [-2, -1, -1],
        position: "The army is placed where it can threaten the Germans, and it will be of no use anywhere else, so it stands where it is and trusts that the Volkhov Front will keep the corridor open.",
        outcome: "What happened. The army stood. In the first days of June the Germans closed the neck at Myasnoi Bor and cut it off from the Volkhov Front. It fought on in the marshes for three weeks and made its last break for the corridor on 24 June. A few thousand got out. Vlasov was captured on 12 July.",
      }),
      gsO("Meretskov", "Retreat early", ["gsAugSinyavino"], {
        flags: { gsLyubanEnd: "early" }, imp: [-1, 0, -1],
        position: "The army cannot be supplied, and the Germans will close the neck as soon as they have the troops, so it goes back now, while it is still strong enough to fight its way out, and not in June.",
        outcome: "Speculative. The army begins to fall back in May, before the Germans are ready to close the neck. It abandons much of its equipment and the ground that it won in the winter, and most of its men get back to the Volkhov Front. The Lyuban operation, for which it was sent, is written off, and it is the army that is saved.",
      }),
    ]),
  gsR("gsMayKharkov2", 19420512, "MAY 1942", "The Second Battle of Kharkov",
    (f) => "On 12 May Timoshenko's Southwestern Front attacks from the northern shoulder at Volchansk and from the Barvenkovo salient towards Kharkov, with the Southern Front on the other side of the bulge. The Soviet armies make good progress on the first days. The Germans are about to begin an operation of their own, Fredericus, to cut off the salient at its base, and the Soviet intelligence does not know it." + (f.gsUrban === "fortify" ? " The base of the salient has been fortified." : "") + " Timoshenko can attack on a wide front, as planned, or concentrate everything on Kharkov, or Malinovsky can strike south to spoil the German assembly.",
    [
      gsO("Malinovsky", "Strike south and stall Fredericus", ["gsMayFredericus"], {
        flags: { gsKharkov2: "south" }, imp: [-1, 0, 0],
        position: "The Germans are assembling to cut the salient at its base, and they can be stopped by an attack on the assembly itself, so the Southern Front strikes south and disrupts it.",
        outcome: "Speculative. The Southern Front's armies strike south at the assembly areas of the German First Panzer Army. The blow does not reach them, but it forces Kleist to use some of his forces earlier than he wished. Fredericus begins in a worse state and a day or two later than it did.",
      }),
      gsO("Timoshenko", "A wide offensive everywhere", ["gsJunReichel"], {
        otl: true, flags: { gsKharkov2: "wide" }, imp: [-2, -1, 1],
        position: "The Germans are weak along the whole of the front, and the way to Kharkov is open, so the attack goes in on every part of the line and reaches the Germans wherever they are.",
        outcome: "What happened. The attack of 12 May made ground for five days. On the 17th the German First Panzer Army and the Seventeenth Army struck at the base of the salient, and Stalin refused to allow a withdrawal until it was too late. By 23 May the Soviet armies were in a pocket west of the Donets. Perhaps two hundred thousand men were lost, killed, wounded or taken, and the front was open to the Don.",
      }),
      gsO("Timoshenko", "Cancel Kursk and Bryansk, and send everything to Kharkov", ["gsMegaKharkov"], {
        flags: { gsKharkov2: "all" }, imp: [-2, -2, 2],
        position: "A second attack in the north is a waste of the army's strength, and Kharkov is the prize, so the northern attacks are cancelled and every division, tank and gun goes to the battle for Kharkov.",
        outcome: "Speculative. The attacks at Kursk and Bryansk are cancelled and their troops, guns and tanks are sent south. The battle for Kharkov is fought with everything that the Southwestern Direction has, and the army that was to have been spread over three attacks is put into one.",
      }),
    ]),
  gsR("gsMayFredericus", 19420517, "MAY 1942", "Fredericus Blunted",
    "The Southern Front's attack has put Kleist's assembly out of its stride, and the German operation to cut off the Barvenkovo salient, Fredericus, has gone in late and in a weaker form. The Soviet armies in the salient are still advancing towards Kharkov and are not yet in danger. The Southwestern Direction has to decide whether to use the respite to counterattack, or to fall back behind the Donets while it can.",
    [
      gsO("Timoshenko", "Counterattack", ["gsJulMillerovo"], {
        flags: { gsFred: "counter" }, imp: [-1, 0, 1],
        position: "The Germans have been thrown off balance, and a blow at the flank of their attack will finish it, so the armies in the salient turn to meet them and attack.",
        outcome: "Speculative. The Soviet armies turn on the German force that has been sent to cut them off and drive it back. The salient is not cut off, and Kharkov is not taken. The Germans' summer offensive, when it comes, begins from a weaker position in the south.",
      }),
      gsO("Malinovsky", "Fight a retreat behind the Donets", ["gsJulMillerovo"], {
        flags: { gsFred: "retreat" }, imp: [0, 0, -1],
        position: "The salient was meant to be a springboard, and it has become a trap, so the armies fall back behind the Donets by stages while the Germans are still unready.",
        outcome: "Speculative. The armies in the salient are withdrawn across the Donets, fighting rearguard actions. The ground that was won in January is given up, but the force is saved, and the line on the Donets is held by a larger and better army than the one that was lost in the record.",
      }),
    ], { rec: false }),
  gsR("gsJunKerchSevastopol", 19420610, "JUNE 1942", "Kerch or Sevastopol?",
    (f) => "The Kerch peninsula" + (f.gsKerch === "defend" ? " has been fought for in depth and is not yet lost." : " is lost, and the Eleventh Army is turning on Sevastopol. The five days' bombardment of the fortress began on 2 June.") + " The Crimean Front, the Black Sea Fleet and the Stavka have to decide where to make the stand: at Kerch, where the fortifications and the harbour can be used to hold the German army for as long as possible, or in Sevastopol, the fortress itself.",
    [
      gsO("Petrov", "Sevastopol", ["gsJulFallSevastopol"], {
        otl: true, flags: { gsSevastopol: "falls" }, imp: [-2, -1, -1],
        position: "Sevastopol is the base of the fleet, and it has held for seven months, so everything that can be sent goes to it, and the garrison fights to the last.",
        outcome: "What happened. The final German assault on Sevastopol began on 7 June, after a bombardment that had lasted five days. The garrison held for nearly a month. The Germans were in the north of the harbour on 29 June, and organised resistance ended on 3 July. Most of the garrison was lost, and a few thousand were taken off by submarine and ship.",
      }),
      gsO("Kozlov", "Hold Kerch: make the port, build artillery and retreat slowly", [], {
        flags: { gsSevastopol: "stands" }, imp: [-1, 0, 1],
        position: "Kerch can be held for months if it is made into a fortress of its own, with a port, guns and a series of lines to fall back on, and the Germans cannot then use the Eleventh Army at Sevastopol.",
        outcome: "Speculative. The Kerch peninsula is turned into a fortress and held for longer than anyone expected, with guns on the Taman shore, a port and a succession of fallback lines. The German Eleventh Army cannot turn its whole weight on Sevastopol, and the fortress, helped by the fleet, stands through the summer.",
      }),
    ]),
  gsR("gsJunReichel", 19420619, "JUNE 1942", "The Reichel Incident",
    "On 19 June a German aircraft carrying a staff officer of the 23rd Panzer Division, Major Reichel, is shot down near the front line, and the papers that he carried, the plan for the first stages of the German summer offensive, are found in the wreck. They are on Stalin's table the next day. They give a plan that is very different from what the Stavka expects, with the main blow in the south and Moscow left alone. The Stavka has to decide whether the plan is real or a trick, and how it is to be met.",
    [
      gsO("Stalin", "The Germans plan to flank Moscow from Voronezh", ["gsJulMillerovo"], {
        otl: true, flags: { gsReichel: "moscow" }, imp: [-1, -1, -1],
        position: "The papers are a trick, put in the Red Army's way to draw its reserves south, and the real blow is at Moscow, as it was last year, so the reserves stay where they are.",
        outcome: "What happened. Stalin judged that the papers were a plant, or that they described only the first stage of a plan that would turn north to Moscow from Voronezh, and the reserves were kept in the centre. The offensive that began on 28 June was almost exactly as the papers had said.",
      }),
      gsO("Vasilevsky", "The Germans plan to go south from Voronezh", ["gsJulMillerovo"], {
        flags: { gsReichel: "south" }, imp: [0, 1, 1],
        position: "The papers are in order, and they say what the staff already feared, so the reserves are moved from the centre to the south, and the Don and the Volga are prepared.",
        outcome: "Speculative. The Stavka takes the papers as they are and moves its reserves south in the second half of June. They are not in time to stop the German advance in the first days, but they are on the Don and the Volga when it arrives there, and the defence in July and August is a good deal firmer than the record's.",
      }),
    ]),
  gsR("gsMegaKharkov", 19420525, "MAY 1942", "The Great Battle of Kharkov",
    "The whole of the Soviet south-west, and all the reserves that the Stavka can spare for it, have been put into the battle for Kharkov. Several armies are in the salient at Barvenkovo, more are in the north at Volchansk and the tank corps are in reserve. Against them the Germans have their Sixth Army, the First Panzer Army and the Seventeenth Army. If the Soviet armies win here, the German summer offensive will begin a good deal worse placed than it was meant to. If they lose, the south is open.",
    [
      gsO("Timoshenko", "Commit everything to the battle", ["gsMegaAfter"], {
        imp: [-2, -2, 2],
        position: "If the Red Army is to have a victory this summer, it will have to be won before the Germans have set out, and the place is Kharkov, so everything that can be spared is committed.",
        outcome: "The battle is fought with all that the Southwestern Direction has.",
        rolls: [
          { w: 35, title: "Kharkov, like Kursk", flags: { gsMega: "big" }, imp: [-1, -1, 2],
            outcome: "Alternate history. The German counterstroke is received and broken. The Sixth Army is beaten at Kharkov in a battle of a kind that the record gives to Kursk a year later, and the German tank force of the south loses its strength before the summer offensive. There is no Case Blue in the form that was planned." },
          { w: 65, title: "The summer offensive exhausted early", flags: { gsMega: "moderate" }, imp: [-2, -2, 1],
            outcome: "Speculative. The battle is long and costly, and neither side wins it. The Germans, who have used a good part of their summer strength to hold Kharkov, begin their offensive late and with fewer tanks than they meant to, and it does not carry as far as the record's did." },
        ] }),
    ], { rec: false }),
  gsR("gsMegaAfter", 19420610, "JUNE 1942", "After Kharkov",
    (f) => (f.gsMega === "big"
      ? "The battle for Kharkov is over, and the Germans have lost it. The Sixth Army has been broken, the First Panzer Army has been thrown back to the Dnieper, and the plan for the summer offensive, the plan that Major Reichel was carrying, is out of date. The Stavka has to say what is to be done with a front that has no enemy in front of it. The tree gives no further steps here, and a separate course for the rest of the war has still to be written."
      : "The battle for Kharkov has been fought to a standstill. The Germans have held the city, and the Soviet armies are spent, but the German force that was to have begun the summer offensive is not what it was, and its attack, which will come in July, is smaller and later than the Stavka had feared."),
    (f) => gsGo(f.gsMega === "big" ? [] : ["gsMidAugStalingrad"], { gsMegaSeen: true }, f.gsMega === "big" ? "Go on from the victory" : "Prepare for the German summer", f.gsMega === "big" ? "Alternate history. The rest of the war has to be written." : "The summer offensive comes later and smaller, and the Don and the Volga are better prepared for it than they were.", [0, 0, 0]),
    { rec: false }),

  // =============================================================================== JULY AND AUGUST
  gsR("gsJulFallSevastopol", 19420704, "JULY 1942", "The Fall of Sevastopol",
    "Sevastopol has fallen. The fortress held out for 250 days, with the sea at its back and the enemy's air force overhead, and for the last four weeks of that time under the full weight of the German Eleventh Army. The Black Sea Fleet has lost many of its ships in supplying it. The Germans, who now have no use for their siege artillery and have their best army free, are sending it north, to Leningrad.",
    gsGo([], { gsSevastopolDone: true }, "Note the loss and go on", "What happened. Sevastopol fell on 3 July, and the German Eleventh Army, under Manstein, was released for the north.", [-1, 0, -1])),
  gsR("gsJulMillerovo", 19420715, "JULY 1942", "Millerovo and Rostov",
    "The German summer offensive began on 28 June at Voronezh and has gone south, down the Don, much faster than the Stavka expected. Millerovo has been taken and the Germans are on the lower Don, with Rostov in front of them and the Caucasus beyond. The Southern Front's armies are in disorder, and Timoshenko's Southwestern Front has been renamed and moved to cover Stalingrad. The south has to decide whether to make a full retreat behind the Don, to try to reorganise on the spot, or to fall back fighting.",
    [
      gsO("Malinovsky", "A full retreat behind the Don, with scorched earth", ["gsAugMillerovo"], {
        flags: { gsMillerovo: "retreat" }, imp: [0, -1, -1],
        position: "The armies are in no state to hold anywhere in the west, so they fall back across the Don, burning the crops and the stores and destroying what cannot be moved, and fight again on the far bank.",
        outcome: "Speculative. The Southern Front falls back across the Don in good order, burning and destroying as it goes, and holds the river for some days. The Germans find no supplies in the country that they cross, but the Don is crossed, as it was in the record, a few days later.",
      }),
      gsO("Timoshenko", "Try to reorganise the troops", ["gsAugMillerovo"], {
        otl: true, flags: { gsMillerovo: "reorganise" }, imp: [-2, -1, -1],
        position: "The armies have lost their staffs and their orders, and they cannot be made to stand until they are in some shape, so the first thing is to reform the divisions and give them their orders.",
        outcome: "What happened. The attempt to reorganise the south was overtaken by the German advance. Millerovo fell in the middle of July, and Rostov on the 23rd. The Southern Front lost much of its strength on the Don, and the Stavka, on 28 July, issued Order No. 227, forbidding any retreat without orders.",
      }),
      gsO("Timoshenko", "A fighting retreat to the Don", ["gsAugDon"], {
        flags: { gsMillerovo: "fighting" }, imp: [-1, 0, 0],
        position: "A retreat that is not fought is a rout, so every river and every ridge is held for as long as it can be, and the army is brought back to the Don by stages.",
        outcome: "Speculative. The army falls back to the Don by stages, fighting rearguard actions at each river. The Germans are delayed, though not stopped, and a larger part of the army is saved.",
      }),
    ]),
  gsR("gsJulRzhev", 19420730, "JULY 1942", "Rzhev and Sychevka",
    "While the Germans are attacking in the south, the Stavka plans an attack at Rzhev, on the Germans' centre, to draw their reserves back. The Western and Kalinin Fronts are to attack from the east and north towards Sychevka, and destroy the German Ninth Army in the Rzhev salient. Zhukov, who commands the Western Front, is to direct it. Shcherbakov does not think that the attack will do any good, and that it will use up the army's strength for nothing.",
    [
      gsO("Shcherbakov", "Do not launch", ["gsAugWirbelwind"], {
        flags: { gsRzhev: "wait" }, imp: [1, 1, -1],
        position: "The Germans at Rzhev are as strong as they were in the winter, and the weather is against an attack, so the armies are kept as they are and the blow is saved for a time when it can succeed.",
        outcome: "Speculative. The attack is not launched, and the armies of the Western and Kalinin Fronts keep their strength for the autumn. The Germans, who have been preparing for it, take the chance to strike first.",
      }),
      gsO("Zhukov", "Launch", ["gsAugDifficulties"], {
        otl: true, flags: { gsRzhev: "launch" }, imp: [-2, -2, 1],
        position: "The Germans must be made to keep their reserves in the centre, and the only way to do it is to attack, so the Rzhev and Sychevka operation goes in on 30 July.",
        outcome: "What happened. The Rzhev and Sychevka operation opened on 30 July. The Kalinin Front made a dent in the German line, and the Western Front was held up before it could do the same. By the middle of August the attack had run down, and the Germans had been put to some trouble but not forced to move any divisions south.",
      }),
    ]),
  gsR("gsAugMillerovo", 19420802, "AUGUST 1942", "The Catastrophe at Millerovo: The Caucasus Exposed",
    "The Southern Front has been broken on the Don, and the Germans are across the river. The First Panzer Army is heading for the oilfields at Maikop and Grozny, and the Fourth Panzer Army has been turned to Stalingrad. Rostov is gone. There is a gap of hundreds of kilometres between the Soviet armies on the Don and those in the Caucasus, and the way to the mountains is open. Budyonny, who commands the North Caucasus Front, has to say whether to hold the Don or to go back to the Terek and the Caucasus ranges.",
    [
      gsO("Malinovsky", "Attempt to hold the Don", ["gsMidAugStalingrad"], {
        flags: { gsCaucasus: "don" }, imp: [-1, 0, 0],
        position: "The Don is the last river before the Volga, and if it goes the whole south is open, so what is left of the Front is put on the river and told to hold it.",
        outcome: "Speculative. The Don is held for a little over a week by the remains of the Southern Front, at a heavy cost. It delays the Germans in the Kuban, and the Caucasus is a few days further from their reach.",
      }),
      gsO("Budyonny", "Retreat to the Terek and the Caucasus", ["gsMidAugStalingrad"], {
        otl: true, flags: { gsCaucasus: "terek" }, imp: [-1, 0, -1],
        position: "The Front cannot hold in the open steppe, and the mountains are a barrier that the Germans will find hard to cross, so it goes back to the Terek and the passes and makes its stand there.",
        outcome: "What happened. The North Caucasus Front withdrew to the Terek and the main range. The Germans took Maikop on 9 August and Krasnodar the same week, reached the foothills and the Terek at Mozdok in the last days of the month, and were held there by the mountains and the lack of fuel.",
      }),
    ]),
  gsR("gsAugDon", 19420804, "AUGUST 1942", "Problems on the Don",
    "The Soviet armies have fallen back to the Don in tolerable order, and they hold the bank at several places. But the Germans are across the river at Tsimlyansk and Konstantinovsk, and the front south of it is thin. In the Caucasus the Transcaucasus Front, under Tyulenev, has few troops in the passes. Budyonny, on the Don, and Tyulenev in the mountains have to say how the Caucasus is to be defended, and how much ground is to be sold for time.",
    [
      gsO("Budyonny", "Retreat to the Terek and the Caucasus", ["gsMidAugStalingrad"], {
        flags: { gsCaucasus: "terek" }, imp: [-1, 0, -1],
        position: "The Front cannot hold the steppe, and the mountains and the Terek can be held, so the army goes back to them and the Don is given up.",
        outcome: "Speculative. The Front goes back to the Terek and the Caucasus in good order. The Germans take the Kuban and Maikop, and are stopped at the mountains, as in the record.",
      }),
      gsO("Tyulenev", "Mine everything and retreat slowly", ["gsMidAugStalingrad"], {
        flags: { gsCaucasus: "mines" }, imp: [0, -1, 0],
        position: "The Germans cannot use what they cannot cross, so the roads, the passes and the bridges are mined and every retreat is made as slowly and as dearly as it can be.",
        outcome: "Speculative. The roads and passes are mined and the retreat is slow. The Germans advance more slowly than they did in the record and take longer to bring up their fuel. The ground that is lost is lost later, and the Caucasus is held by a stronger force.",
      }),
    ]),
  gsR("gsAugWirbelwind", 19420805, "AUGUST 1942", "Wirbelwind",
    "The Rzhev attack has not been launched. The Germans, who have been waiting for it, find that they have the initiative, and use it. Under the name Wirbelwind they strike at the Soviet forces on the edges of the Rzhev salient, where they are thinnest, and try to roll them up before the Red Army can bring up its reserves. The Soviet commanders on the spot have to decide whether to give ground or to stand.",
    [
      gsO("Belov", "Pull back", ["gsNovGodOfWar"], {
        flags: { gsWirbel: "back" }, imp: [0, 0, -1],
        position: "The salient's edges cannot be held against a German attack in strength, and the troops there are worth more to the army than the ground, so they are pulled back before they are cut off.",
        outcome: "Speculative. The Soviet forces on the edges of the salient fall back in good order. The Germans take some ground, and no prisoners to speak of, and the army that was to be used in the autumn is saved.",
      }),
      gsO("Bagramyan", "Hold", ["gsNovGodOfWar"], {
        flags: { gsWirbel: "hold" }, imp: [-1, 0, 0],
        position: "To give ground to the Germans at Rzhev is to give them what they want, which is a shorter line and spare divisions, so the Soviet forces hold on.",
        outcome: "Speculative. The Soviet forces hold on at the edges of the salient, and the German attack, which had been meant to be quick, is a slow and costly one. The Germans take some of the ground at the price of divisions that they would have liked to have sent south.",
      }),
    ], { rec: false }),
  gsR("gsAugDifficulties", 19420810, "AUGUST 1942", "Difficulties",
    "The attack at Rzhev has run into the German defences. The Kalinin Front's divisions are well below strength, the tanks are in poor order and the Germans have brought up reserves. Karmanovo, on the far side of the salient, has been taken, and it is the only place where the attack is going well. The front can stop and save what is left, go on with a frontal attack on the town of Rzhev, or go on flanking at Karmanovo.",
    [
      gsO("Purkayev", "Stop", ["gsNovGodOfWar"], {
        flags: { gsRzhev2: "stop" }, imp: [1, 1, -1],
        position: "The attack has done what it could, and what the army has left is better kept for the autumn, so it stops and digs in on the line that it has reached.",
        outcome: "Speculative. The attack is stopped in the middle of August. The army keeps what it has and prepares for the autumn, and the Germans are free to move some of their reserves south.",
      }),
      gsO("Konev", "A frontal attack on Rzhev", ["gsNovGodOfWar"], {
        otl: true, flags: { gsRzhev2: "frontal" }, imp: [-2, -1, 0],
        position: "Rzhev is the key to the salient, and the Germans have made it into a fortress, so it is better to take it by direct assault, with the armour and the guns that can be got together, than to go round it.",
        outcome: "What happened. The attacks on Rzhev were renewed in August, and they were beaten off with heavy losses. The Germans, who had the town as a fortress, held it, and by the end of the month the operation had come to a stop.",
      }),
      gsO("Zhukov", "Continue flanking at Karmanovo", ["gsSepSychevka"], {
        flags: { gsRzhev2: "flank" }, imp: [-1, -1, 1],
        position: "The Germans have put their strength in Rzhev, and the way to Sychevka is through Karmanovo, where they are weak, so the attack goes on there and the town is left to wither.",
        outcome: "Speculative. The attack at Karmanovo goes on, and the Germans have to use their reserves to meet it. The railway to Sychevka, on which the Ninth Army depends, comes within reach of the Soviet guns, and the Germans at Rzhev are brought to a difficult position.",
      }),
    ]),
  gsR("gsMidAugStalingrad", 19420817, "MID-AUGUST 1942", "Stalingrad Approaches",
    "The German Sixth Army and the Fourth Panzer Army are heading for the Volga at Stalingrad. The Sixth Army is across the Don and in the great bend, with the Fourth Panzer Army coming up from the south. On 23 August the Luftwaffe will fly 1,600 sorties against the city, and the Germans will reach the Volga on its northern edge. The Stalingrad and Southeastern Fronts have to decide how to meet them, in the open steppe or in the city.",
    [
      gsO("Vatutin", "Counterattack the tip of the Fourth Panzer Army from the south", ["gsSepStands"], {
        flags: { gsStalingrad: "south" }, imp: [-1, -1, 1],
        position: "The Fourth Panzer Army's tip is a long way from its supplies, and a blow from the south at its flank will cut it off before it reaches the city.",
        outcome: "Speculative. The counterattack is made on the Fourth Panzer Army's tip from the south, at the cost of an army that was needed for the city. It does not cut the tip off, but it delays it and gives the city a few more days.",
      }),
      gsO("Moskalenko", "Reinforce the northern flank and counterattack", ["gsSepStands"], {
        flags: { gsStalingrad: "north" }, imp: [-1, 0, 1],
        position: "The Germans have reached the Volga on the north side, and the corridor that they have made is narrow, so the reinforcements go to the northern flank and counterattack across it.",
        outcome: "Speculative. The northern flank is reinforced, and the counterattacks across the German corridor from the north go on through September. They do not cut it, and they keep the Sixth Army's attention on the north while the city is held.",
      }),
      gsO("Chuikov", "Fight for every house, whatever it costs", ["gsSepStands"], {
        flags: { gsStalingrad: "houses" }, imp: [-2, 0, 0],
        position: "A city is a better place to fight the Germans than the steppe, since their tanks and their aircraft are of less use in the ruins, so every house is held and the fight is made as close as it can be.",
        outcome: "Speculative. The defence of Stalingrad is made house by house from the start, and the Germans, who have to fight for each of them, are drawn into the city. The Soviet losses are heavy, and the Sixth Army's strength is spent in the streets.",
      }),
      gsO("Yeremenko", "An active defence", ["gsSepCracks"], {
        flags: { gsStalingrad: "active" }, imp: [-1, 0, 1],
        position: "A passive defence will be broken by the Germans' weight, and the way to hold them is to attack their flanks and their supply lines wherever they can be reached.",
        outcome: "Speculative. The front's forces keep up a series of counterattacks on the German flanks, which cost them a good deal and delay the Germans, but leave the city itself thinly held.",
      }),
      gsO("Gordov", "Stand outside the city", ["gsSepCracks"], {
        otl: true, flags: { gsStalingrad: "outside" }, imp: [-1, -1, 0],
        position: "The city is a trap for the army that goes into it, and the steppe in front of it is the place to stop the Germans, so the army stands outside and the city is held by a garrison.",
        outcome: "What happened. The Stalingrad Front fought on the approaches to the city in the second half of August, and the Germans broke through on the 23rd. They reached the Volga north of the city that day, and the front was split. The defence of the city itself was left to the 62nd Army.",
      }),
    ]),
  gsR("gsAugSinyavino", 19420819, "AUGUST 1942", "The Third Battle of Sinyavino",
    (f) => "The Volkhov and Leningrad Fronts are to attack at Sinyavino and break the German hold on the narrow neck south of Lake Ladoga, through which the blockade of Leningrad is maintained. The Germans are bringing the Eleventh Army to the north, and an attack on the city, Operation Nordlicht, is expected in September." + (f.gsSevastopol === "stands" ? " Sevastopol has not fallen, and the Eleventh Army is still in the Crimea." : " Sevastopol has fallen, and the Eleventh Army is on its way."),
    (f) => [
      gsO("Meretskov", "Pre-empt the Germans and attack on Mga", ["gsJanIskra"], {
        flags: { gsSinyavino: "mga" }, imp: [-1, 0, 1],
        position: "The Germans will not be ready to attack until September, and the blow at Mga, the railway junction on which the German hold depends, will find them still arriving, so it is struck now.",
        outcome: "Speculative. The Volkhov Front attacks at Mga in August, before the German reinforcements have arrived. It takes some ground and puts the Germans in difficulty at the junction, but not enough to break the neck, and the Eleventh Army arrives to find a battle already in progress.",
      }),
      gsO("Govorov", "Attack on Sinyavino", ["gsJanIskra"], {
        otl: true, flags: { gsSinyavino: "attack" }, imp: [-2, -1, 1],
        position: "The Sinyavino heights are the key to the neck, and the Germans must be kept from using them, so the attack is made on the heights themselves, by the shortest road.",
        outcome: "What happened. The Sinyavino operation began on 19 August and lasted until the beginning of October. The Soviet armies did not break through, and part of the Second Shock Army was surrounded and lost. But the Germans, who had to use the Eleventh Army to meet it, were forced to give up Nordlicht, the attack on Leningrad that they had meant to make.",
      }),
      gsO("Voroshilov", "Attack on the Ladoga coast, the shortest road", f.gsSevastopol === "stands" ? ["gsAugLeningrad"] : ["gsJanIskra"], {
        flags: { gsSinyavino: "coast" }, imp: [-2, -1, 1],
        position: "The coast of Lake Ladoga is the shortest way to the Neva, and the Germans have the least strength there, so the attack goes along the shore and the blockade is cut at its narrowest.",
        outcome: "Speculative. The attack goes in on the lake shore. It makes some ground in the first week and is held on the Neva, and the Germans have to stretch their line to meet it.",
      }),
    ]),
  gsR("gsAugLeningrad", 19420825, "AUGUST 1942", "Leningrad Unblocked Early: The Nordlicht Counterattack",
    "Because Sevastopol has stood, the German Eleventh Army has not come north, and the attack at Sinyavino has met a weaker defence than it did in the record. The Soviet armies have driven the Germans from the lake shore, and the blockade of Leningrad is broken, months earlier than it was. The Germans have begun to move up what troops they have for a counterattack under the name Nordlicht, and the Leningrad Front has to decide how to meet it.",
    [
      gsO("Voroshilov", "Reinforce Ladoga and retreat slowly to the fortifications", ["gsFebPolarStar"], {
        flags: { gsNordlicht: "fortify" }, imp: [0, 1, -1],
        position: "The new corridor is a narrow one, and the Germans can cut it if they are given time, so the troops there are reinforced and, if the Germans press, fall back to the prepared fortifications that guard it.",
        outcome: "Speculative. The corridor is reinforced, and when the Germans counterattack the Soviet troops fall back by stages to the prepared positions. They are not cut off, and the land route to the city is kept.",
      }),
      gsO("Govorov", "Hold to the Sinyavino Hills", ["gsFebPolarStar"], {
        flags: { gsNordlicht: "hold" }, imp: [-1, 0, 0],
        position: "The hills are the key to the corridor, and if the Germans have them the corridor is theirs, so the Leningrad Front holds them to the last.",
        outcome: "Speculative. The Leningrad Front holds the Sinyavino hills, and the German counterattack is stopped there. It is a costly defence, and the corridor stays open, with the hills as its anchor.",
      }),
    ], { rec: false }),

  // =============================================================================== SEPTEMBER TO NOVEMBER
  gsR("gsSepSychevka", 19420915, "SEPTEMBER 1942", "The Sychevka Railway Almost Cut",
    "The flanking attack has gone on, and it has done well. The Soviet guns can now reach the railway from Rzhev to Sychevka and Vyazma, on which the German Ninth Army depends for its supplies, and the Ninth Army's trains are being shelled. The Germans have been forced to bring in reserves that they would have used elsewhere. The front can make one final push to cut the railway, bring down all the artillery that it has on the line, or flank Gzhatsk, still farther back.",
    [
      gsO("Zhukov", "One final push", ["gsNovGodOfWar"], {
        flags: { gsSych: "push" }, imp: [-2, -1, 1],
        position: "The railway is within reach, and a few days' effort will cut it, so every tank, gun and man that can be got up goes into one last attack.",
        outcome: "Speculative. The final push is made, with the last of the front's reserves, and it takes the railway under fire at several points. The Germans hold it, and the front is spent.",
      }),
      gsO("Voronov", "Suppress it with artillery", ["gsNovGodOfWar"], {
        flags: { gsSych: "guns" }, imp: [0, -1, 0],
        position: "The railway does not have to be taken if it cannot be used, and the artillery can keep it under fire day and night, so the guns are moved up and the line is shelled.",
        outcome: "Speculative. The artillery is brought up and keeps the railway under fire, and the German supply to the Ninth Army is cut to a trickle. It is the most economical way of using the army's strength, and it gives the Germans time to think about their position.",
      }),
      gsO("Bagramyan", "Surprise them and flank Gzhatsk", ["gsOctBuffel"], {
        flags: { gsSych: "gzhatsk" }, imp: [-1, 0, 2],
        position: "The Germans expect the attack on the railway and are ready for it, so the blow is struck farther back, at Gzhatsk, where it is not expected, and the whole salient is threatened.",
        outcome: "Speculative. The attack at Gzhatsk takes the Germans by surprise and the Ninth Army, with its flank turned, is in danger of being cut off. Model, the army commander, asks for permission to withdraw, and for once the permission is not refused at once.",
      }),
    ], { rec: false }),
  gsR("gsSepStands", 19420915, "SEPTEMBER 1942", "Stalingrad Stands",
    "The city has not fallen. The Sixth Army has been drawn into the streets, where its tanks and aircraft are of less use, and every building is a battle of its own. Chuikov's 62nd Army holds a strip of the west bank of the Volga a few hundred metres wide in places. Its supplies come over the river under fire. The defence has to decide how to use the time it has bought, by massing the guns, by bearhugging the Germans, or by striking from the southern flank.",
    [
      gsO("Voronov", "Double down on artillery", ["gsNovUranus"], {
        flags: { gsStands: "guns" }, imp: [0, -1, 1],
        position: "The Germans can be bled in the city only as long as the guns on the east bank can reach them, so the artillery is massed on the Volga and the Red Army's greatest strength is put to its best use.",
        outcome: "Speculative. The artillery is massed on the east bank, and its fire on the German positions in the city and on the crossings is kept up day and night. It costs the Sixth Army a great deal, and it uses up shells that were being saved for the offensive.",
      }),
      gsO("Chuikov", "Continue bearhugging", ["gsNovUranus"], {
        flags: { gsStands: "hug" }, imp: [-2, 0, 0],
        position: "The Germans' strength is in their aircraft and their guns, and they cannot use them against an enemy fifty metres away, so the Soviet lines are held as close to theirs as can be.",
        outcome: "Speculative. The 62nd Army keeps its line as close to the Germans as it can, in the ruins of the factories and the grain elevator. The German aircraft cannot bomb it without bombing their own troops, and the Sixth Army uses up its infantry.",
      }),
      gsO("Shumilov", "An active southern flank", ["gsNovUranus"], {
        flags: { gsStands: "south" }, imp: [-1, 0, 1],
        position: "The Fourth Panzer Army's northern flank is open to attack from the south, and the Germans must be made to look to it, so the 64th Army attacks it in the south of the city.",
        outcome: "Speculative. The 64th Army attacks on the southern flank and draws part of the Fourth Panzer Army's strength away from the city. The attacks do not break the German line, but they keep it extended.",
      }),
    ]),
  gsR("gsSepCracks", 19420915, "SEPTEMBER 1942", "Stalingrad Cracks",
    "The Germans have reached the Volga on both sides of the city, and the defence has been split in two. In the middle of September they enter the centre of the city, and the railway station changes hands again and again. Chuikov's army has been driven back almost to the river. The crossing is under fire, and the 13th Guards Rifle Division, which is to be ferried over to its aid, may arrive too late. The Front has to choose a method of defence, a classic one or a bearhugging one.",
    [
      gsO("Yeremenko", "A classic defence", ["gsNovUranus"], {
        flags: { gsStands: "classic" }, imp: [-1, 0, -1],
        position: "The city is a position like any other, and the way to hold it is to keep a line, with depth and reserves behind it, and to meet each German thrust at the right time with the right force.",
        outcome: "Speculative. The defence of the city is organised in depth, with the reserves behind the line. It gives ground more slowly than a bearhugging defence would, and it uses up the divisions as quickly as they are brought in.",
      }),
      gsO("Chuikov", "Bearhugging", ["gsNovUranus"], {
        otl: true, flags: { gsStands: "hug" }, imp: [-2, 0, 0],
        position: "The Germans have to be held so close that their aircraft and artillery cannot be used, so the 62nd Army fights at ten metres and never gives them the room that they need.",
        outcome: "What happened. Chuikov's 62nd Army fought the Germans at close quarters, from the ruins of the city, to keep them from using their aircraft and guns. The Germans took most of the city, in two months of fighting, but never all of it, and the 62nd Army held a strip of the west bank until the Soviet counteroffensive in November.",
      }),
    ]),
  gsR("gsOctBuffel", 19421015, "OCTOBER 1942", "Buffel, Early",
    "The attack at Gzhatsk has put the German Ninth Army in danger, and its commander has asked to be allowed to withdraw from the Rzhev salient, a retreat that the record gave to the early spring of 1943 under the name Buffel. Hitler, who has just had enough of the army, has given leave, and the Germans are falling back. The Soviet armies have to decide whether to pursue them hard, or to hold back and strike only lightly.",
    [
      gsO("Zhukov", "Pursue them", ["gsSmolenskXmas"], {
        flags: { gsBuffel: "pursue" }, imp: [-2, -1, 2],
        position: "A retreating army is at its weakest, and the Germans cannot be allowed to reach a new line in good order, so every tank and every division that can move is put on the heels of the Ninth Army.",
        outcome: "Speculative. The Western and Kalinin Fronts press hard on the Germans' heels. The Ninth Army loses much of its rearguard and some of its guns, and the retreat is less orderly than it was meant to be.",
      }),
      gsO("Vasilevsky", "Only light strikes", ["gsNovGodOfWar"], {
        flags: { gsBuffel: "light" }, imp: [0, 0, 0],
        position: "The fronts have been fighting for ten months and have little left, and the autumn is to be spent on the great plan in the south, so only light forces follow the Germans up and the main force is kept back.",
        outcome: "Speculative. The Soviet armies follow the Germans with light forces only, and the Ninth Army gets away in good order, with its guns and with a shorter line. The reserves are kept for the south.",
      }),
    ], { rec: false }),
  gsR("gsSmolenskXmas", 19421020, "OCTOBER 1942", "Smolensk by Christmas?",
    "If the Germans are hurried out of the Rzhev salient, a Soviet advance to Smolensk by the end of the year is just possible. The city is 200 kilometres from the line, and the Germans have prepared positions behind it. Zhukov thinks that the chance is worth taking. Antonov, who plans operations for the General Staff, thinks that the roads and the railways cannot support an advance so far.",
    [
      gsO("Zhukov", "Risk it", ["gsNovGodOfWar"], {
        flags: { gsSmolensk: "risk" }, imp: [-2, -2, 2],
        position: "The Germans are on the run, and Smolensk is the key to the whole of the centre, so the armies go on, with whatever they have, and the supplies are made to follow.",
        outcome: "Alternate history. The armies go on towards Smolensk in the first weeks of winter, a long way ahead of their supplies. They reach the outskirts, and the Germans, who have a good line behind it, hold them there, and the exhausted armies cannot be supplied.",
      }),
      gsO("Antonov", "No", ["gsNovGodOfWar"], {
        flags: { gsSmolensk: "no" }, imp: [0, 1, -1],
        position: "An army cannot go two hundred kilometres on a single railway in the first days of the winter, and the Germans have prepared positions behind the line, so the advance is stopped where the supplies end.",
        outcome: "Speculative. The advance is stopped where the supplies end, and the army digs in. Smolensk is not taken, and the army is in a position to be fed.",
      }),
    ], { rec: false }),
  gsR("gsNovGodOfWar", 19421110, "NOVEMBER 1942", "The God of War",
    "The Stavka has made its plans for Operation Mars, a large attack on the German Ninth Army in the Rzhev salient, to begin a few days after the great blow at Stalingrad. The artillery is in place, in more strength than the Red Army has ever massed. But the autumn fog and the low cloud are keeping the Soviet aircraft on the ground, and the air support that the plan assumes will not be there. Stalin is ready to wait for the weather. Zhukov is not.",
    [
      gsO("Stalin", "Better to wait", [], {
        flags: { gsMars: "wait" }, imp: [1, 0, -1],
        position: "The artillery is the Red Army's best arm, but without the aircraft it is half an army, and the plan is a plan for a clear sky, so the operation waits until the weather improves.",
        outcome: "Speculative. The operation is put off until the weather improves. The Germans, who have been told by their own intelligence that an attack is being prepared, are given time to move their reserves, and the army's guns and shells are saved for another time.",
      }),
      gsO("Zhukov", "Launch without aviation", ["gsMarsAfter"], {
        otl: true, imp: [-2, -2, 1],
        position: "The Germans must be kept from sending anything to Stalingrad, and the attack has to be made on the day, with or without the aircraft, so the guns open fire and the armies go in.",
        outcome: "The attack goes in on the date, without the air support that it was planned to have.",
        rolls: [
          { w: 25, title: "Mars breaks through", flags: { gsMars: "breaks" }, imp: [-1, -1, 2],
            outcome: "Speculative. The attack breaks through on the first days, against what the record shows, and the Germans are in danger at Rzhev. The Ninth Army, with its line broken in two places, has to call for help." },
          { w: 75, title: "Mars stalls", flags: { gsMars: "stalls" }, imp: [-2, -2, 0],
            outcome: "What happened. Operation Mars began on 25 November and stalled in the German defences, which were in depth and well supplied with reserves. The Kalinin and Western Fronts lost hundreds of thousands of men and some 1,600 tanks over the next three weeks, and the Rzhev salient held." },
        ] }),
    ]),
  gsR("gsMarsAfter", 19421130, "NOVEMBER 1942", "After Mars",
    (f) => (f.gsMars === "breaks"
      ? "Mars has broken through. The German Ninth Army is in trouble at Rzhev, and the Soviet armies are in the open behind its line. Zhukov wants to go on to Smolensk and make the most of it. Purkayev, who commands the Kalinin Front, would stop and consolidate."
      : "Mars has stalled. The Kalinin and Western Fronts have lost heavily and have gained little, and the Germans hold the Rzhev salient. The great battle at Stalingrad, which has been going well, will have to carry the winter."),
    (f) => (f.gsMars === "breaks"
      ? [
        gsO("Zhukov", "On to Smolensk", [], { flags: { gsMarsEnd: "smolensk" }, imp: [-2, -2, 2], position: "The Germans are off balance, and this is the chance to take Smolensk, so the army goes on and does not give them time.", outcome: "Alternate history. The Soviet armies press on towards Smolensk through December, and the Germans have to give up the Rzhev salient and a good part of the centre." }),
        gsO("Purkayev", "Stop", [], { flags: { gsMarsEnd: "stop" }, imp: [1, 0, -1], position: "The armies are spent, and an army that has broken through and gone on is an army in danger of being cut off, so it stops, consolidates what it has taken and holds it.", outcome: "Speculative. The armies stop on the line they have reached and hold it. The Rzhev salient is broken in two, and the Germans are free to bring their reserves up." }),
      ]
      : gsGo([], { gsMarsEnd: "stalled" }, "Count the cost and go on", "What happened. The Rzhev salient held until the Germans left it themselves in the spring of 1943, and Mars was kept out of the official histories for decades.", [-1, 0, -1])),
    { rec: false }),
  gsR("gsNovUranus", 19421119, "NOVEMBER 1942", "Uranus",
    "The Stavka has been preparing for months a counteroffensive at Stalingrad, to be made not at the city but on the flanks of the German Sixth Army, where the Romanian armies, poorly equipped and short of anti-tank guns, hold the line. Vasilevsky and Zhukov have made the plan. The Southwestern and Don Fronts are to attack from the north on 19 November and the Stalingrad Front from the south on the 20th, and the two will meet at Kalach. Stalin would sooner have something smaller.",
    [
      gsO("Vasilevsky", "Launch Uranus", ["gsDecChir"], {
        otl: true, flags: { gsUranus: "full" }, imp: [-1, -1, 2],
        position: "The Sixth Army is on the Volga, with its flanks held by the Romanians, and the way to destroy it is to cut it off, so the Red Army strikes at the Romanians on both flanks and meets behind it.",
        outcome: "What happened. Uranus began on 19 November. The Romanian Third Army was broken on the first day, and the southern attack on the 20th did the same to the Fourth. The two groups met at Kalach on the 23rd. Some 250,000 German and Romanian troops were encircled in the pocket at Stalingrad.",
      }),
      gsO("Stalin", "A minor attack across the Don", ["gsDecChir"], {
        flags: { gsUranus: "minor" }, imp: [-1, 0, 0],
        position: "A great encirclement is a great risk, and if it fails the Red Army has nothing left, so the aim is a smaller one: a blow across the Don that will push the Germans back and relieve the city.",
        outcome: "Speculative. A smaller attack is made across the Don, with limited aims. It pushes the Germans back from the river and relieves the pressure on the city, but the Sixth Army is not encircled, and it is able to withdraw from the Volga when the winter comes.",
      }),
    ]),

  // =============================================================================== DECEMBER TO FEBRUARY
  gsR("gsDecChir", 19421210, "DECEMBER 1942", "The Chir Stalls",
    "The Sixth Army is in the pocket, and Manstein is collecting a force to relieve it. Hoth's Fourth Panzer Army is assembling at Kotelnikovo, to the south-west, and Hollidt's group holds the line of the River Chir in the north. The Stavka has a plan, Saturn, for a great attack on the Italian Eighth Army on the middle Don, which will cut off the whole of the German south, but it cannot do everything. Its reserves have to be placed where they are most needed, on the Chir, in the ring or at Kotelnikovo.",
    [
      gsO("Zhukov", "Reinforce Tormosin", ["gsDecWinter"], {
        otl: true, flags: { gsChir: "tormosin" }, imp: [-1, -1, 1],
        position: "The Chir is the line on which the Germans in the pocket's north will be held or will break out, and the bridgehead at Tormosin is the key to it, so the reserves go there.",
        outcome: "What happened. The Soviet armies on the Chir were reinforced and fought a series of battles in December for the crossings, which were costly and indecisive. The Germans held the line of the Chir long enough for Manstein to begin his attack.",
      }),
      gsO("Rokossovsky", "Reinforce the ring", ["gsDecWinter"], {
        flags: { gsChir: "ring" }, imp: [-1, 0, 0],
        position: "The Sixth Army will break out if the ring is too thin to hold it, and the Germans outside will break in if the ring is not firm, so the reserves go to the ring itself.",
        outcome: "Speculative. The ring round the pocket is reinforced, and it is stronger than it was in the record. The Germans in the pocket find it harder to break out, and the army that is making the ring is not available to meet a relief force.",
      }),
      gsO("Yeremenko", "Reinforce Kotelnikovo", ["gsDecWinterStalls"], {
        flags: { gsChir: "kotelnikovo" }, imp: [-1, 0, 1],
        position: "The relief will come from Kotelnikovo, and the Germans can be stopped there if they are met in time, so the reserves go to the south, where the blow will fall.",
        outcome: "Speculative. The reserves go south to Kotelnikovo, where the Germans are preparing their relief attack. The attack, when it comes, meets a stronger defence than it did in the record, and it is stopped early.",
      }),
    ]),
  gsR("gsDecWinter", 19421212, "DECEMBER 1942", "Wintergewitter",
    "On 12 December Manstein's relief attack, Wintergewitter, the Winter Storm, goes in from Kotelnikovo with the 6th and 23rd Panzer Divisions and, later, the 17th. It makes fast progress against the Soviet 51st Army, which has few tanks, and by the 19th it is on the Myshkova river, 50 kilometres from the pocket. The Stavka has to decide whether to risk the reserves that it has been saving for Saturn in a gamble to stop it, or to ask the Front for more troops.",
    [
      gsO("Zhukov", "A gamble", ["gsMansteinBreaks"], {
        flags: { gsWinter: "gamble" }, imp: [-1, -1, 2],
        position: "Wintergewitter can be beaten only by a blow at its flank, and the force to give it is the force that was meant for Saturn, so the Stavka takes the risk of using it and goes on with the rest of the plan.",
        outcome: "Speculative. The Stavka uses part of its reserves against Wintergewitter and goes on with Saturn in a reduced form. The gamble does not pay at once. The Germans break through the Soviet line in the south, and the relief force comes within sight of the pocket.",
      }),
      gsO("Yeremenko", "Call for reinforcements", ["gsMansteinStops"], {
        otl: true, flags: { gsWinter: "reinforce" }, imp: [-1, -1, 0],
        position: "The 51st Army cannot hold against the German tanks, and the Stalingrad Front has not the troops to stop them, so the Stavka is asked to send the 2nd Guards Army, which is on its way to the front, to the Myshkova.",
        outcome: "What happened. The Stavka gave the Stalingrad Front the 2nd Guards Army, under Malinovsky, which had been meant for Saturn. It reached the Myshkova on 19 December, as the Germans did, and stopped them there in two days' fighting. Wintergewitter was brought to a stop 50 kilometres from the pocket.",
      }),
    ]),
  gsR("gsDecWinterStalls", 19421214, "DECEMBER 1942", "Wintergewitter Stalls",
    "Kotelnikovo has been reinforced, and Manstein's relief attack has stalled early, with a stronger Soviet defence than he expected. The Sixth Army is still in the pocket, and no relief is on its way. The reserves that were being kept against a relief are free, and the Stavka can go back to its larger plans: the great attack of Saturn, or a smaller version of it, together with the reduction of the pocket.",
    [
      gsO("Vatutin", "Launch Grand Saturn", ["gsRostovTaken"], {
        flags: { gsSaturn: "grand" }, imp: [-2, -2, 2],
        position: "The Italian Eighth Army is weak, the Germans have no reserves behind it, and Saturn aims at Rostov and the whole of the German south, so the whole plan is made and the whole of the force is used.",
        outcome: "Speculative. Grand Saturn goes in with all the reserves that can be found. The Italian Eighth Army is broken, and the Soviet armies drive south towards Rostov. It is a larger and bolder attack than the record's, and the German armies in the Caucasus are in the greatest danger.",
      }),
      gsO("Rokossovsky", "Launch Small Saturn and the Big Koltso", ["gsRostovTaken"], {
        flags: { gsSaturn: "small" }, imp: [-2, -1, 1],
        position: "The Sixth Army has to be dealt with at the same time as the Italians, and the force is not there for both, so the attack is made in two parts: a smaller Saturn, towards the Donets, and the destruction of the pocket.",
        outcome: "Speculative. A smaller Saturn is launched against the Italians, and the Koltso, the operation to destroy the pocket, begins at the same time. Both go well, and neither goes as far as the Stavka would have liked.",
      }),
    ], { rec: false }),
  gsR("gsMansteinBreaks", 19421220, "DECEMBER 1942", "Manstein Breaks Through",
    "Manstein's relief force has broken through the Soviet line on the Myshkova and is within thirty kilometres of the pocket. The Sixth Army has been told to prepare to break out to meet it, and Paulus, who has no fuel to go farther than that, asks for permission. The Stavka has to decide whether to cancel Saturn and put everything into the defeat of the relief, or to launch it and cut off the whole German south, in the hope that Manstein's force is caught behind it.",
    [
      gsO("Vatutin", "Launch Grand Saturn", ["gsRostovOurs"], {
        flags: { gsMansteinResp: "saturn" }, imp: [-2, -2, 2],
        position: "The Germans have used their reserves on the relief, and there is nothing behind the Italians, so Saturn is launched and the German south is cut off, relief or no relief.",
        outcome: "Speculative. Saturn goes in as planned. The Italian Eighth Army is destroyed, and the Soviet armies are at Rostov within weeks. The Sixth Army is not destroyed, and some of it gets out of the pocket in the confusion.",
      }),
      gsO("Rokossovsky", "Cancel Saturn: everything to Stalingrad", ["gsWinterstorm"], {
        flags: { gsMansteinResp: "cancel" }, imp: [-1, 0, -1],
        position: "The Sixth Army is the prize, and if it is not destroyed all else is wasted, so Saturn is cancelled, the reserves are sent to Stalingrad, and the relief is beaten first.",
        outcome: "Speculative. Saturn is cancelled and every reserve goes to the defeat of the relief and the pocket. Manstein's force is stopped at the last moment, and the Sixth Army is destroyed, but the German armies in the Caucasus are not cut off.",
      }),
    ], { rec: false }),
  gsR("gsMansteinStops", 19421220, "DECEMBER 1942", "Manstein Stops",
    "The 2nd Guards Army has stopped Manstein on the Myshkova. His relief force has used up what strength it had, and the Sixth Army has not been ordered to break out. Saturn, which has been changed into a smaller operation called Little Saturn, has begun on the middle Don, and it has already broken the Italian Eighth Army. The Stavka can use the 2nd Guards Army for an attack from Kotelnikovo, with Little Saturn, or can concentrate on the pocket and finish the Koltso.",
    [
      gsO("Zhukov", "Launch Kotelnikovo and Small Saturn", ["gsGermansWithdraw"], {
        otl: true, flags: { gsMansteinEnd: "kotelnikovo" }, imp: [-1, -1, 2],
        position: "The Germans are beaten at the Myshkova and have no strength left, and the best use of the Soviet armies is to go on to Kotelnikovo and Rostov while Little Saturn takes the Italians in the north.",
        outcome: "What happened. The Kotelnikovo operation began on 24 December. The 2nd Guards and the 51st Army drove the Germans from Kotelnikovo in three days and went on towards Rostov, while Little Saturn, in the north, carried the Soviet armies across the Donets. Army Group A in the Caucasus had to begin its withdrawal.",
      }),
      gsO("Rokossovsky", "Finish the Koltso quickly", ["gsGermansWithdraw"], {
        flags: { gsMansteinEnd: "koltso" }, imp: [-1, 0, 0],
        position: "The Sixth Army is still in the pocket, and while it is there a third of a million men are tied down, so the first duty is to finish it off and free the armies for the other tasks.",
        outcome: "Speculative. The Koltso, the operation to reduce the pocket, is begun as soon as the relief is stopped and not on 10 January, and the Sixth Army is destroyed a week or two earlier than it was. The Kotelnikovo attack goes ahead later, with smaller forces.",
      }),
    ]),
  gsR("gsRostovOurs", 19430105, "JANUARY 1943", "Rostov Is Ours, Stalingrad Is German",
    "Grand Saturn has reached Rostov and has cut the road and the railway through it, on which the German armies in the Caucasus depend. But the Sixth Army, whose relief was stopped only for a moment, has not been destroyed, and it still holds the ruins of Stalingrad. The Soviet armies are spread across the south in a long line, with no reserves and few supplies. The Southern Front has to decide whether to rush east to finish the Sixth Army or to hold Rostov and prepare for the German reaction.",
    [
      gsO("Vatutin", "Rush east", [], {
        flags: { gsRostov: "east" }, imp: [-2, -1, 1],
        position: "The Sixth Army is the last thing on the Volga and can be destroyed in a week if the armies are turned on it at once, so the force from Rostov goes east to finish it.",
        outcome: "Speculative. The armies at Rostov turn east and meet the Don Front at the ring. The Sixth Army is destroyed a few weeks later than it was in the record, and Rostov is left with a thin garrison.",
      }),
      gsO("Zhukov", "Hold Rostov and prepare defences", [], {
        flags: { gsRostov: "hold" }, imp: [0, 1, 0],
        position: "Rostov is what has been won, and it is the gate through which the Germans will have to come, so the armies hold it and dig in against the counterattack that Manstein is sure to make.",
        outcome: "Speculative. Rostov is held and fortified. The Germans, who have lost the south, are unable to retake it, and the armies that hold it are in good order when the next stage begins.",
      }),
    ], { rec: false }),
  gsR("gsWinterstorm", 19430102, "JANUARY 1943", "Winterstorm at the Brink",
    "Saturn has been cancelled, and the relief has been beaten off by a hair. The pocket has been reduced, but the Sixth Army has not yet surrendered, and Manstein's force is still on the Myshkova, with its tanks. The armies of the south have been spent in the battle and are not in a state to do more than hold. The Stavka has to decide whether to push on at once everywhere, or to move at the Chir and threaten Rostov, where the Germans are weakest.",
    [
      gsO("Chuikov", "Push everywhere at once", [], {
        flags: { gsBrink: "all" }, imp: [-2, -1, 1],
        position: "The Germans are at the brink, and a push along the whole front will send them over it, so every army attacks at once, with what it has, and the Germans are given no time to rest.",
        outcome: "Speculative. Every army attacks at once, and the Germans are pushed back along the whole of the front. The Soviet advance is weak in places, and the Germans, who have the Chir and the Don to fall back on, escape being cut off.",
      }),
      gsO("Rokossovsky", "Push towards the Chir to threaten Rostov", [], {
        flags: { gsBrink: "chir" }, imp: [-1, 0, 1],
        position: "The Germans' hold on the Caucasus depends on Rostov, and the way to Rostov is along the Chir, so the main force goes there and the rest is held back.",
        outcome: "Speculative. The Soviet main force moves along the Chir towards Rostov, and the Germans have to give up a great deal of ground to keep it from them. Rostov is not taken at once, but the Caucasus is in danger.",
      }),
    ], { rec: false }),
  gsR("gsGermansWithdraw", 19430115, "JANUARY 1943", "The Germans Withdraw from the Caucasus",
    "Little Saturn has broken the Italian Eighth Army, and the Soviet armies are on the Donets and on the road to Rostov. Army Group A, in the Caucasus, is in danger of being cut off, and Hitler, after weeks of delay, has allowed it to begin its withdrawal. The Southern and Transcaucasus Fronts have to go after it. Vatutin would go for Rostov, which is the key to the whole, and Tyulenev would strike south, towards the Kuban, to cut the Germans off from the Crimea.",
    [
      gsO("Vatutin", "Take Rostov", ["gsKuban"], {
        flags: { gsCaucasusEnd: "rostov" }, imp: [-1, -1, 1],
        position: "Rostov is the door through which the whole of the German south has to go, and if it is shut the armies in the Caucasus cannot get out, so it is taken as fast as the troops can get there.",
        outcome: "Speculative. The Southern Front goes for Rostov as fast as it can. The Germans, who have a good deal of ground to cover, only just get the First Panzer Army through in time, and the Seventeenth Army falls back into the Kuban.",
      }),
      gsO("Tyulenev", "Strike south to flank them", ["gsKuban"], {
        flags: { gsCaucasusEnd: "south" }, imp: [-1, 0, 1],
        position: "The Germans are slow, and the way to catch them is to get in front, so the Transcaucasus Front strikes south and west, across the mountains, to cut off the Seventeenth Army.",
        outcome: "Speculative. The Transcaucasus Front attacks from the mountains towards the Kuban. The Germans are pushed back and the Seventeenth Army falls back on the Taman, but the mountain roads are hard, and the Germans are able to get away.",
      }),
    ]),
  gsR("gsJanIskra", 19430112, "JANUARY 1943", "Iskra",
    "The Leningrad and Volkhov Fronts are to attack from both sides of the narrow German neck south of Lake Ladoga, to break the blockade of Leningrad. The Soviet armies are much stronger than they were in the autumn. The Germans, who have had to send divisions south, hold the neck with the 227th Infantry Division and part of the 170th. The attack, Operation Iskra, the Spark, is to begin on 12 January. Govorov would attack at Sinyavino once more, and Voroshilov wants the shortest road, through Schlisselburg.",
    [
      gsO("Govorov", "Sinyavino again", ["gsFebPolarStar"], {
        flags: { gsIskra: "sinyavino" }, imp: [-2, -1, 1],
        position: "The Sinyavino heights are the key to the neck, and they have to be taken, so the main attack is made on them, as before, with a force that is a good deal stronger.",
        outcome: "Speculative. The main attack is made on the Sinyavino heights. They are taken, but the cost is high and the corridor is a little longer and a little slower to open than it was in the record.",
      }),
      gsO("Voroshilov", "Schlisselburg, the shortest road", ["gsFebPolarStar"], {
        otl: true, flags: { gsIskra: "schlisselburg" }, imp: [-1, -1, 2],
        position: "The corridor is shortest at Schlisselburg, only a few kilometres wide, and if it is cut there the blockade is broken at once, so the two Fronts attack towards each other along it.",
        outcome: "What happened. The two Fronts attacked on 12 January and met on the 18th, near Workers' Settlement No. 1. Schlisselburg was retaken. A corridor eight to eleven kilometres wide along the shore of Lake Ladoga linked Leningrad to the rest of the country, and the blockade, which had lasted for sixteen months, was broken. A railway was built along it within weeks.",
      }),
    ]),
  gsR("gsFebPolarStar", 19430210, "FEBRUARY 1943", "Polar Star",
    "After Iskra and the end of the battle at Stalingrad, the Stavka has been planning a much larger operation, Polar Star, for the north: the Northwestern Front under Timoshenko is to destroy the German Sixteenth Army at Demyansk and go on towards the Baltic, while the Leningrad and Volkhov Fronts attack at Mga and Krasny Bor. The troops are short of supplies, and the thaw is coming. The Leningrad Front has to decide how its share is to be made.",
    [
      gsO("Voroshilov", "Reinforce the city, with artillery to harass the Germans and lock them in", [], {
        flags: { gsPolar: "city" }, imp: [0, 1, -1],
        position: "The Germans round Leningrad are a large force and are kept there by the threat to the city, so the artillery is built up to keep them under fire, and the infantry are saved for a time when they can be used.",
        outcome: "Speculative. The Leningrad Front's artillery is built up, and the German positions round the city are kept under steady fire. The infantry are saved. Polar Star is not carried out in the form that it was planned.",
      }),
      gsO("Govorov", "An offensive on the whole front", [], {
        otl: true, flags: { gsPolar: "all" }, imp: [-2, -1, 1],
        position: "The Germans at Leningrad are weaker than they were, and the best time to attack them is while the other fronts are attacking, so the Leningrad Front attacks all along its line.",
        outcome: "What happened. The Leningrad Front attacked at Krasny Bor on 10 February, and the Volkhov Front at Mga, and neither made progress. The Soviet losses were heavy, and the thaw put a stop to the operation. The Northwestern Front's part in Polar Star was carried out only in part and did not destroy the Germans at Demyansk, who withdrew in their own time.",
      }),
      gsO("Meretskov", "Priority to Mga and Krasny Bor", [], {
        flags: { gsPolar: "mga" }, imp: [-1, 0, 1],
        position: "Mga and Krasny Bor are the two places at which the Germans' hold on the railway can be broken, and the force is not enough for more, so it is put there and nowhere else.",
        outcome: "Speculative. The attack is made at Mga and Krasny Bor only, with the whole of the force. It takes ground at Krasny Bor, and the Germans have to use their reserves, but it does not break the German line.",
      }),
    ]),
  gsR("gsRostovTaken", 19430215, "FEBRUARY 1943", "Rostov Is Taken: Where Next?",
    "Rostov has been taken, on 14 February, and the German armies in the Caucasus have got out through it, or have been cut off from it, according to how things have gone. The Southwestern Front is at the Donets, and the Southern Front is in the Donbas. The question is where to go next, south after the Germans in the Kuban, before they are able to pull back, or west into the Donbas and the Ukraine.",
    [
      gsO("Tyulenev", "South, before they pull back", ["gsKuban"], {
        flags: { gsNext: "south" }, imp: [-1, 0, 1],
        position: "The Germans in the Kuban are the last of the army that went into the Caucasus, and they can be caught if the Soviet armies go after them now, before they pull back into the Taman.",
        outcome: "Speculative. The Soviet armies go south, after the Germans in the Kuban. They are in time to catch some of them in the open, and not in time to stop them from falling back on the Taman.",
      }),
      gsO("Vatutin", "Liberate the Donbas", ["gsEarlyUkraine"], {
        flags: { gsNext: "donbas" }, imp: [-2, -2, 2],
        position: "The Donbas is the heart of the Ukraine's industry, and the Germans are weak in it, so the armies turn west and take it, and go on to the Dnieper.",
        outcome: "Alternate history. The Soviet armies go west, into the Donbas, and the Germans have to give ground. The Red Army goes on to the Dnieper in the spring of 1943, a good deal earlier than it did in the record.",
      }),
    ], { rec: false }),
  gsR("gsKuban", 19430220, "FEBRUARY 1943", "The Kuban Stronghold",
    "The Germans have fallen back into the Kuban bridgehead, a strip of land at the end of the Taman peninsula, with the Black Sea on one side and the Sea of Azov on the other, and the Kerch Strait behind them. It is held by the Seventeenth Army and a part of the First Panzer Army, and it is supplied by sea and by a cable line across the strait. The Soviet armies and the Black Sea Fleet have to decide how to deal with it, by a final push, by cutting it off from the sea, or by containing it and turning the main effort to the north.",
    [
      gsO("Vatutin", "One final push", ["gsDestroyed17th"], {
        flags: { gsKubanEnd: "push" }, imp: [-2, -1, 2],
        position: "The Germans in the Kuban are cut off from the rest of the army by a narrow strait, and if they are attacked now, with everything, they will not be able to get away.",
        outcome: "Speculative. The final push is made, with every division that can be brought to the Kuban. The Germans, who are in a strong position, resist for a long time, and the attack takes more ground than it did in the record.",
      }),
      gsO("Oktyabrsky", "Block them off by sea", ["gsDestroyed17th"], {
        flags: { gsKubanEnd: "sea" }, imp: [-1, 0, 1],
        position: "The Germans in the Kuban live by the sea, and the Black Sea Fleet can cut their supply and their escape, so the fleet and the air force blockade the strait and the ports.",
        outcome: "Speculative. The Black Sea Fleet and the air force attack the German supply lines across the Kerch Strait and the ports of the Taman. The German force in the Kuban, short of fuel and food, is weakened, and it is more open to a final blow.",
      }),
      gsO("Zhukov", "Only cover them, and put the main effort in the north", [], {
        otl: true, flags: { gsKubanEnd: "cover" }, imp: [1, 0, 0],
        position: "The Kuban is a sideshow, and the Germans there are of little use to anyone, so a small force covers them and the main effort goes to the north, where the war will be decided.",
        outcome: "What happened. The Germans held the Kuban bridgehead, which they called the Gotenkopf, until October 1943, and the Soviet forces contained it with a limited number of troops. It was one of the places where the Red Army went on trying to dislodge them for most of the year.",
      }),
    ]),

  // =============================================================================== THE SPECULATIVE ENDS OF THE TREE
  gsR("gsAgcAnnihilated", 19420215, "FEBRUARY 1942", "Army Group Centre Annihilated: No Blau",
    "It is the second half of February, and the ring has closed. The armies of the Western and Kalinin Fronts have met west of Vyazma, and Army Group Centre, which has been ordered to hold, is surrounded. Some fifty divisions are in the pocket, with the Ninth Army, the Fourth Army and most of the Third and Fourth Panzer Groups. It is a victory of a scale that the Red Army will not see again until Stalingrad and Bagration. The Germans have no reserves with which to relieve it. The tree gives no further steps, and a separate course of the war has still to be written.",
    gsGo([], { gsVariant: "agcAnnihilated", alternateHistoryPath: true }, "Go on from the victory", "Alternate history. The rest of the war has to be written: with Army Group Centre gone, there is no summer offensive, and no Stalingrad as the record knew it.", [2, 2, 2]),
    { rec: false, alt: true }),
  gsR("gsEarlyUkraine", 19430220, "FEBRUARY 1943", "Early Ukraine, 1943",
    "The Soviet armies have gone west into the Donbas, and they are on the Donets and the Mius in the second half of February, a good deal earlier than the record. The Germans have not had time to prepare their counterstroke, and they are not in a state to make one. The Soviet armies are short of supplies, and a great distance from their railways. The tree gives no further steps.",
    gsGo([], { gsVariant: "earlyUkraine", alternateHistoryPath: true }, "Go on into the Ukraine", "Alternate history. The Donbas and the lower Dnieper are in reach by the spring, and the war in the south is shorter than it was in the record.", [0, -1, 2]),
    { rec: false, alt: true }),
  gsR("gsDestroyed17th", 19430301, "MARCH 1943", "The Seventeenth Army and the First Panzer Army Destroyed",
    "The Germans in the Kuban have been cut off from the sea, and their supplies have run out. The Seventeenth Army, with a part of the First Panzer Army, a quarter of a million men, is destroyed or taken in the course of a few weeks. It is the greatest defeat that the Germans have had in the south since Stalingrad. The tree gives no further steps.",
    gsGo([], { gsVariant: "kubanDestroyed", speculativePath: true }, "Go on from the victory", "Speculative. The Kuban is cleared in the spring and not in the autumn, and a large force that the Germans had in the record is lost to them.", [1, 0, 2]),
    { rec: false }),
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
  const imp = (a) => ({ manpower: (a || [0, 0, 0])[0], fuel: (a || [0, 0, 0])[1], initiative: (a || [0, 0, 0])[2] });
  return {
    date: spec.date,
    title: spec.title,
    historicalRecord: spec.rec === false ? false : orders.some((o) => o.otl) ? true : undefined,
    ...(spec.alt ? { alternateHistory: true } : spec.rec === false ? { speculative: true } : {}),
    situation: typeof spec.situation === "function" ? spec.situation(flags) : spec.situation,
    choices: orders.map((o) => {
      const after = gsAfter(flags, spec, o);
      const bookkeeping = { gsQ: after.queue, gsSeen: after.seen };
      const choice = {
        label: o.label,
        advisor: { name: o.adviser, position: o.position },
        ...(o.otl ? { historical: true } : {}),
        setFlags: { ...(o.flags || {}), ...bookkeeping },
        impact: imp(o.imp),
        next: after.next,
        outcome: o.outcome,
      };
      if (o.rolls) {
        const first = modWeight(o.rolls[0].w, meters.initiative);
        choice.uncertain = o.rolls.map((r, i) => ({
          weight: i === 0 ? first : 100 - first,
          title: r.title,
          setFlags: { ...(r.flags || {}), ...bookkeeping, ...(r.outcome.startsWith("Alternate") ? { alternateHistoryPath: true } : r.outcome.startsWith("Speculative") ? { speculativePath: true } : {}) },
          impact: imp(r.imp),
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
