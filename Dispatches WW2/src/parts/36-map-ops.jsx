const mapArrow = (kind, from, to) => ({ kind, from, to });
const mapStand = (at) => ({ kind: "hold", at });

// The orders on the map. For a report, each order that can be given is drawn on the checkpoint map when the player picks it from the list under the map:
// a solid arrow for an attack, a dashed one for a move, a dashed one that fades for a withdrawal, a ring for a stand. Positions are [longitude, latitude]
// and the drawing is schematic: it shows where the weight goes, not a line of advance. An order is found by the start of its label (`match`), so a report
// whose orders change with the file still finds the ones it has. tools/check-map-ops.mjs checks every entry. The reports not drawn here have no list.
const MAP_OPS = {
  german: {
  norway40: [
    { match: "Commit the surface fleet", note: "Warships and transports sail on the same night for Narvik, Trondheim, Bergen, Kristiansand and Oslo.", arrows: [mapArrow("move", [10.1, 54.3], [10.75, 59.9]), mapArrow("move", [8.1, 53.5], [5.3, 60.4]), mapArrow("move", [8.1, 53.5], [10.4, 63.4]), mapArrow("move", [8.1, 53.5], [17.4, 68.4])] },
    { match: "Limited landings", note: "A smaller force takes Oslo and Trondheim, and Narvik, the ore port itself, is left alone.", arrows: [mapArrow("move", [10.1, 54.3], [10.75, 59.9]), mapArrow("move", [8.1, 53.5], [10.4, 63.4])] },
  ],
  caseYellow40: [
    { match: "Adopt the Manstein Plan", note: "The armour crosses the Ardennes to the Meuse at Sedan and then runs for the Channel, while a smaller force draws the Allies into Belgium.", arrows: [mapArrow("attack", [8.0, 50.3], [4.95, 49.7]), mapArrow("attack", [4.95, 49.7], [1.85, 50.1]), mapArrow("move", [6.9, 51.5], [4.4, 51.2])] },
    { match: "Hold to the original plan", note: "The weight goes through the Belgian plain towards Brussels and Lille, where the Allies are waiting for it.", arrows: [mapArrow("attack", [6.9, 50.9], [4.35, 50.85]), mapArrow("attack", [4.35, 50.85], [3.06, 50.63])] },
  ],
  dunkirk: [
    { match: "Order the halt", note: "The tanks stand on the line of the canals west of Dunkirk while the Luftwaffe is sent against the pocket.", arrows: [mapStand([2.2, 50.75])] },
    { match: "Press the attack", note: "The armour goes into the pocket from the west and south at once.", arrows: [mapArrow("attack", [1.5, 50.2], [2.37, 51.03]), mapArrow("attack", [2.9, 50.4], [2.37, 51.03])] },
  ],
  channel: [
    { match: "Commit fully to Sea Lion", note: "Barges and transports gather in the Channel ports for landings on the Kent and Sussex coasts and in Lyme Bay.", arrows: [mapArrow("attack", [1.8, 50.95], [1.1, 51.1]), mapArrow("attack", [0.2, 49.5], [-0.1, 50.8]), mapArrow("attack", [-1.6, 49.65], [-2.2, 50.6])] },
    { match: "Shift to attrition", note: "The Luftwaffe turns on London and the ports, the U-boats go out from Lorient, and the staff begins to look east.", arrows: [mapArrow("attack", [2.0, 50.9], [-0.1, 51.5]), mapArrow("move", [-3.4, 47.8], [-9.6, 50.0])] },
    { match: "Begin Barbarossa planning now", note: "The Channel coast is held as it is, and the divisions are moved east for a war against the Soviet Union.", arrows: [mapStand([1.6, 50.9]), mapArrow("move", [6.9, 50.9], [21.0, 52.2])] },
    { match: "Launch Sea Lion in September", note: "The crossing is ordered on the first date the barges are ready, from Calais, Boulogne and Le Havre.", arrows: [mapArrow("attack", [1.8, 50.95], [1.1, 51.1]), mapArrow("attack", [1.6, 50.2], [0.5, 50.8]), mapArrow("attack", [0.2, 49.5], [-0.1, 50.8])] },
  ],
  balkans: [
    { match: "Full intervention", note: "Armies enter Greece from Bulgaria and Yugoslavia from Austria, Hungary and Romania, and the Balkans are cleared before the east.", arrows: [mapArrow("attack", [23.3, 42.7], [22.95, 40.64]), mapArrow("attack", [22.95, 40.64], [23.73, 38.1]), mapArrow("attack", [15.4, 47.07], [15.98, 45.8]), mapArrow("attack", [21.2, 45.75], [20.46, 44.8])] },
    { match: "Ignore the Balkans", note: "Nothing is sent south. The divisions stay on the eastern frontier and the timetable is kept.", arrows: [mapArrow("move", [15.0, 52.0], [23.0, 52.0]), mapStand([20.0, 43.5])] },
    { match: "Limited intervention", note: "A small force goes through Bulgaria to Salonica and another threatens Belgrade, with the rest held back for the east.", arrows: [mapArrow("attack", [23.3, 42.7], [22.95, 40.64]), mapArrow("attack", [21.2, 45.75], [20.46, 44.8])] },
  ],
  barbarossa41: [
    { match: "Launch Barbarossa as planned", note: "Three army groups cross the frontier: one towards Leningrad, one towards Moscow and one towards Kiev.", arrows: [mapArrow("attack", [22.0, 54.5], [30.3, 59.95]), mapArrow("attack", [23.7, 52.1], [37.6, 55.75]), mapArrow("attack", [24.0, 50.2], [30.5, 50.45])] },
    { match: "Postpone one year", note: "The army waits on the line of the frontier and is built up through the winter.", arrows: [mapArrow("move", [10.0, 51.0], [21.0, 52.2]), mapStand([21.5, 52.5])] },
    { match: "Cancel Barbarossa", note: "There is no eastern war. The divisions stay where they are.", arrows: [mapStand([21.0, 52.5])] },
    { match: "Delay Barbarossa", note: "The summer goes to a campaign in the Mediterranean, against Malta and against Gibraltar through Spain, and the east waits for the autumn.", arrows: [mapArrow("attack", [-1.8, 43.3], [-5.35, 36.5]), mapArrow("attack", [15.0, 37.6], [14.51, 35.9])] },
  ],
  moscowKiev: [
    { match: "Press directly for Moscow", note: "Army Group Centre goes straight on from Smolensk.", arrows: [mapArrow("attack", [32.05, 54.78], [37.6, 55.75])] },
    { match: "Divert south", note: "Guderian's tanks turn south from Roslavl to meet Kleist coming north from the Dnieper, and close the pocket east of Kiev.", arrows: [mapArrow("attack", [32.9, 53.9], [33.25, 50.35]), mapArrow("attack", [33.4, 49.07], [33.25, 50.35])] },
    { match: "Split forces", note: "Part of the armour goes south and the rest keeps its face to Moscow.", arrows: [mapArrow("attack", [32.9, 53.9], [33.2, 51.2]), mapArrow("attack", [32.05, 54.78], [35.0, 55.3])] },
  ],
  caseBlue: [
    { match: "Pursue both objectives", note: "One army goes for Stalingrad and the Volga, the other for the oilfields of the Caucasus, and neither is strong enough.", arrows: [mapArrow("attack", [38.0, 51.5], [44.5, 48.7]), mapArrow("attack", [39.7, 47.2], [40.1, 44.6]), mapArrow("attack", [39.7, 47.2], [45.7, 43.3])] },
    { match: "Concentrate fully on the Caucasus", note: "Everything goes south to Maikop and Grozny, and the flank on the Don is held where it stands.", arrows: [mapArrow("attack", [39.7, 47.2], [40.1, 44.6]), mapArrow("attack", [39.7, 47.2], [45.7, 43.3]), mapStand([44.0, 49.0])] },
    { match: "Concentrate fully on Stalingrad", note: "Both armies go for the Volga, and the Caucasus is left for later.", arrows: [mapArrow("attack", [38.0, 51.5], [44.5, 48.7]), mapArrow("attack", [41.0, 49.0], [44.5, 48.7]), mapStand([39.7, 47.2])] },
  ],
  kursk: [
    { match: "Strike now, in spring", note: "The attack goes in at once, from Orel in the north and Belgorod in the south, with the tanks on hand.", arrows: [mapArrow("attack", [36.07, 52.97], [36.2, 51.73]), mapArrow("attack", [36.6, 50.6], [36.2, 51.73])] },
    { match: "Wait for the Panthers", note: "The same two thrusts, from Orel and Belgorod, are launched in July with the new tanks.", arrows: [mapArrow("attack", [36.07, 52.97], [36.2, 51.73]), mapArrow("attack", [36.6, 50.6], [36.2, 51.73])] },
    { match: "Cancel the offensive", note: "The line is shortened and the tanks are held back for a counterstroke.", arrows: [mapArrow("withdraw", [36.07, 52.97], [34.4, 53.25]), mapStand([36.25, 50.0])] },
  ],
  normandy: [
    { match: "Release Panzer reserves", note: "The armoured divisions near Paris and Amiens are ordered to Caen at once.", arrows: [mapArrow("move", [2.35, 48.85], [-0.37, 49.18]), mapArrow("move", [2.3, 49.9], [-0.37, 49.18])] },
    { match: "Hold reserves", note: "The armour waits near Calais and on the Seine until the main landing is certain.", arrows: [mapStand([1.9, 50.5]), mapStand([1.1, 49.45])] },
  ],
  ardennes: [
    { match: "Launch the Ardennes offensive", note: "Three armies attack through the Eifel and the Ardennes towards the Meuse and Antwerp.", arrows: [mapArrow("attack", [6.3, 50.5], [4.4, 51.2]), mapArrow("attack", [6.2, 50.1], [4.87, 50.47]), mapArrow("attack", [6.6, 49.8], [5.72, 49.9])] },
    { match: "Hold remaining reserves", note: "The reserves stay behind the Rhine at Bonn and Düsseldorf for the defence of the Reich.", arrows: [mapStand([7.1, 50.7]), mapStand([6.77, 51.2])] },
  ],
  berlinDefense45: [
    { match: "Commit the Volkssturm", note: "Old men and boys are put into the line beside the regular troops, on the Seelow Heights and around Berlin.", arrows: [mapStand([13.4, 52.5]), mapStand([14.4, 52.55])] },
    { match: "Limit the defense", note: "The line is held by regular troops alone, and falls back on the city when it is pierced.", arrows: [mapStand([14.38, 52.56]), mapArrow("withdraw", [14.38, 52.56], [13.4, 52.5])] },
  ],

  },
  soviet: {
  border41: [
    { match: "Hold every position", note: "Every army stays where it stands: at Brest, at Lvov and on the Niemen.", arrows: [mapStand([23.7, 52.1]), mapStand([24.0, 49.84]), mapStand([23.9, 54.9])] },
    { match: "Order a fighting withdrawal", note: "The armies give ground to Minsk, Kiev and the Dvina to keep their strength.", arrows: [mapArrow("withdraw", [23.7, 52.1], [27.55, 53.9]), mapArrow("withdraw", [24.0, 49.84], [30.5, 50.45]), mapArrow("withdraw", [23.9, 54.9], [26.5, 55.9])] },
  ],
  smolensk41: [
    { match: "Hold Kiev", note: "The Southwestern Front stays on the Dnieper at Kiev and Chernigov while the Germans close behind it.", arrows: [mapStand([30.5, 50.45]), mapStand([31.3, 51.5])] },
    { match: "Withdraw the Southwestern Front", note: "The front pulls back east of the Dnieper before the pocket closes.", arrows: [mapArrow("withdraw", [30.5, 50.45], [34.55, 49.6]), mapArrow("withdraw", [31.3, 51.5], [35.0, 50.9])] },
  ],
  leningrad41: [
    { match: "Hold the city", note: "The city is held and its people stay in it.", arrows: [mapStand([30.3, 59.95])] },
    { match: "Prioritize evacuation", note: "Civilians and the wounded are taken over Lake Ladoga by boat before the ice is firm.", arrows: [mapArrow("move", [30.1, 60.1], [32.4, 59.95]), mapStand([30.3, 59.95])] },
  ],
  moscowVyazma41: [
    { match: "Commit the Southwestern survivors", note: "The survivors from the south go into the gap at Vyazma at once, from Tula.", arrows: [mapArrow("attack", [37.6, 54.2], [34.5, 55.2]), mapStand([36.0, 55.5])] },
    { match: "Hold them back", note: "The reserve is kept at Tula and Moscow for a counteroffensive in the winter.", arrows: [mapStand([37.6, 54.2]), mapStand([37.6, 55.75])] },
  ],
  stalingradCounter42: [
    { match: "The full envelopment", note: "The attack goes deep, from the Don bridgehead in the north and the lakes south of the city, to meet at Kalach.", arrows: [mapArrow("attack", [42.7, 49.6], [43.5, 48.7]), mapArrow("attack", [44.5, 47.0], [43.5, 48.7])] },
    { match: "A shallower envelopment", note: "The pincers meet close to the city and shut in the garrison there.", arrows: [mapArrow("attack", [43.0, 49.6], [44.4, 48.9]), mapArrow("attack", [44.5, 47.0], [44.4, 48.3])] },
  ],
  kharkov43: [
    { match: "Continue the pursuit", note: "The armies go on at speed from Kharkov towards the Dnieper at Dnepropetrovsk.", arrows: [mapArrow("attack", [36.25, 50.0], [35.0, 48.45])] },
    { match: "Halt and consolidate", note: "The advance stops at Kharkov until the railways have caught up.", arrows: [mapStand([36.25, 50.0])] },
    { match: "Skip Kharkov", note: "The reserve goes past Kharkov to the crossings of the Dnieper at Kremenchug.", arrows: [mapArrow("attack", [37.5, 50.0], [33.4, 49.07])] },
  ],
  kurskDefense43: [
    { match: "Defense in depth", note: "The salient is held behind belts of mines and anti-tank guns, and the reserves are kept back.", arrows: [mapStand([36.2, 51.5]), mapStand([36.5, 51.0])] },
    { match: "Preempt", note: "The Red Army strikes the German assembly areas at Orel and Belgorod before they can attack.", arrows: [mapArrow("attack", [36.1, 51.9], [36.07, 52.97]), mapArrow("attack", [36.6, 51.1], [36.6, 50.6])] },
  ],
  bagrationSoviet44: [
    { match: "Press the offensive", note: "The fronts go through Vitebsk and Bobruisk to Minsk and then on to the Vistula, until supply stops them.", arrows: [mapArrow("attack", [30.4, 54.5], [27.55, 53.9]), mapArrow("attack", [27.55, 53.9], [21.0, 52.23])] },
    { match: "Halt at Warsaw", note: "The fronts take Minsk and stop at the approaches to Warsaw.", arrows: [mapArrow("attack", [30.4, 54.5], [27.55, 53.9]), mapArrow("attack", [27.55, 53.9], [23.7, 52.1]), mapStand([21.5, 52.3])] },
    { match: "Delay the launch", note: "Supplies are brought up behind the start line for two weeks before the attack begins.", arrows: [mapArrow("move", [37.0, 54.5], [30.4, 54.5]), mapStand([30.3, 54.5])] },
  ],
  warsawUprising44: [
    { match: "Push the advance", note: "The leading armies go on to the Vistula at Warsaw without waiting for their supplies.", arrows: [mapArrow("attack", [22.0, 52.25], [21.0, 52.23])] },
    { match: "Halt at the Vistula", note: "The advance stops on the east bank and the armies are resupplied.", arrows: [mapStand([21.3, 52.25])] },
  ],
  balkans44: [
    { match: "Press deep into the Balkans", note: "The armies cross Romania to Belgrade and then go north-west through Hungary towards Vienna.", arrows: [mapArrow("attack", [26.1, 44.43], [20.46, 44.8]), mapArrow("attack", [20.46, 44.8], [19.04, 47.5]), mapArrow("attack", [19.04, 47.5], [16.37, 48.2])] },
    { match: "Limit the Balkan commitment", note: "The armies go into Bulgaria and hold on the Danube while Tito's partisans clear Belgrade.", arrows: [mapArrow("move", [26.1, 44.43], [23.3, 42.7]), mapStand([20.46, 44.8])] },
    { match: "Push further south", note: "The armies go on through Bulgaria to Salonica and Larissa, towards Athens, before the British land.", arrows: [mapArrow("attack", [23.3, 42.7], [22.95, 40.64]), mapArrow("attack", [22.95, 40.64], [22.42, 39.64])] },
  ],
  vistulaOder45: [
    { match: "Press straight for Berlin", note: "The armies cross the Oder at Küstrin and go on for the capital.", arrows: [mapArrow("attack", [21.0, 52.23], [14.65, 52.58]), mapArrow("attack", [14.65, 52.58], [13.4, 52.5])] },
    { match: "Halt on the Oder", note: "The armies stop on the Oder while other fronts clear Pomerania and East Prussia.", arrows: [mapStand([14.65, 52.58]), mapArrow("attack", [17.0, 53.2], [15.57, 54.18]), mapArrow("attack", [20.5, 53.6], [20.5, 54.7])] },
  ],
  berlinRace45: [
    { match: "A single concentrated thrust", note: "One front, under one commander, attacks from the Oder, and the other waits.", arrows: [mapArrow("attack", [14.65, 52.58], [13.4, 52.5])] },
    { match: "Let both fronts race", note: "Zhukov goes from the Oder and Konev from the Neisse, and they meet in Berlin.", arrows: [mapArrow("attack", [14.65, 52.58], [13.4, 52.5]), mapArrow("attack", [14.8, 51.5], [13.4, 52.45])] },
  ],

  },
  allied: {
  dunkirk40: [
    { match: "Full evacuation effort", note: "Every ship that can be found, large and small, lifts men from the beaches and the mole to Dover and Ramsgate.", arrows: [mapArrow("withdraw", [2.37, 51.03], [1.3, 51.13]), mapArrow("withdraw", [2.37, 51.03], [1.4, 51.33])] },
    { match: "Prioritize the professional core", note: "The trained divisions are taken first and the rest hold the perimeter.", arrows: [mapArrow("withdraw", [2.37, 51.03], [1.3, 51.13]), mapStand([2.4, 51.0])] },
  ],
  sicilyHusky43: [
    { match: "Redirect naval and air assets", note: "Ships and aircraft from Tunisia are turned on the Strait of Messina to stop the Germans leaving.", arrows: [mapArrow("attack", [10.2, 36.8], [15.6, 38.1])] },
    { match: "Continue the race for Messina", note: "Patton goes along the north coast and Montgomery up the east, and the evacuation goes on.", arrows: [mapArrow("attack", [14.2, 37.1], [15.55, 38.19]), mapArrow("attack", [13.4, 38.1], [15.55, 38.19])] },
  ],
  anzio44: [
    { match: "Launch Shingle", note: "A landing from Naples at Anzio, behind the Gustav Line, with the aim of reaching the Alban Hills.", arrows: [mapArrow("move", [14.27, 40.85], [12.63, 41.45]), mapArrow("attack", [12.63, 41.45], [12.3, 42.3])] },
    { match: "Cancel Shingle", note: "The landing craft are kept for Overlord and the Gustav Line is attacked from the front at Cassino.", arrows: [mapArrow("attack", [14.5, 41.0], [13.8, 41.5])] },
  ],
  normandy44: [
    { match: "Back Montgomery's narrow thrust", note: "Everything goes to one spearhead in the north, through Belgium and over the Rhine into the Ruhr.", arrows: [mapArrow("attack", [1.5, 49.1], [4.4, 51.2]), mapArrow("attack", [4.4, 51.2], [7.0, 51.45])] },
    { match: "Hold Eisenhower's broad front", note: "Every army advances on its own line, from Antwerp in the north to Strasbourg in the south.", arrows: [mapArrow("attack", [1.5, 49.1], [4.4, 51.2]), mapArrow("attack", [2.35, 48.5], [6.17, 49.12]), mapArrow("attack", [4.0, 48.3], [7.75, 48.58])] },
  ],
  anvilDragoon44: [
    { match: "Proceed with the southern France landing", note: "A landing on the coast of Provence takes Marseille and Toulon and goes up the Rhône to Lyon.", arrows: [mapArrow("attack", [6.64, 43.27], [5.37, 43.3]), mapArrow("attack", [5.5, 43.8], [4.84, 45.76])] },
    { match: "Redirect to the Balkans", note: "The force goes by sea from Naples to Trieste and on through the Ljubljana gap towards Vienna.", arrows: [mapArrow("move", [14.27, 40.85], [13.77, 45.65]), mapArrow("attack", [13.77, 45.65], [14.5, 46.05]), mapArrow("attack", [14.5, 46.05], [16.37, 48.2])] },
  ],
  marketGarden44: [
    { match: "Launch Market Garden", note: "Three airborne divisions seize the bridges and the Guards Armoured Division drives up the single road from Neerpelt to Arnhem.", arrows: [mapArrow("attack", [5.4, 51.2], [5.9, 51.98])] },
    { match: "Scale the plan back", note: "Only the nearer bridges, as far as Nijmegen, are taken, and Arnhem is left for a slower advance.", arrows: [mapArrow("attack", [5.4, 51.2], [5.85, 51.84])] },
  ],
  ardennesResponse44: [
    { match: "Approve Patton's rapid wheel", note: "Third Army turns ninety degrees from the Saar and attacks north from Luxembourg to Bastogne.", arrows: [mapArrow("attack", [6.17, 49.12], [5.72, 50.0])] },
    { match: "Take the more cautious", note: "Third Army moves up in stages and does not risk its flank, with Bastogne holding on its own.", arrows: [mapArrow("attack", [6.1, 49.1], [5.9, 49.75]), mapStand([5.72, 50.0])] },
  ],
  berlinDecision45: [
    { match: "Push for Berlin", note: "The American armies go on from the Elbe at Magdeburg to Berlin, over the line the zone agreement draws.", arrows: [mapArrow("attack", [11.63, 52.13], [13.4, 52.5])] },
    { match: "Halt on the Elbe", note: "The American armies stop at the Elbe and leave Berlin to the Red Army.", arrows: [mapStand([11.63, 52.13])] },
  ],
  dieppe42: [
    { match: "Launch the raid", note: "Canadian troops cross the Channel from Newhaven and land at Dieppe and on the beaches beside it.", arrows: [mapArrow("attack", [0.05, 50.79], [1.08, 49.93])] },
    { match: "Cancel the raid", note: "The troops stay in England and the harbour at Dieppe is left alone.", arrows: [mapStand([0.05, 50.79])] },
  ],

  },
  italy: {
  alpsFront40: [
    { match: "Push hard", note: "The Italian armies attack over the Little St Bernard and along the Riviera towards Nice before the armistice.", arrows: [mapArrow("attack", [7.6, 43.8], [6.4, 43.5]), mapArrow("attack", [6.9, 45.7], [6.0, 45.4])] },
    { match: "Limited, symbolic advance", note: "The armies keep to the passes and the coast road and do little more.", arrows: [mapStand([7.0, 45.5]), mapStand([7.5, 43.85])] },
  ],
  medStrategy40: [
    { match: "Move on Malta first", note: "A landing from Sicily on Malta while the garrison is weak.", arrows: [mapArrow("attack", [14.0, 37.1], [14.51, 35.9])] },
    { match: "Push into Egypt", note: "The army goes along the coast from Bardia to Alexandria and the Suez Canal.", arrows: [mapArrow("attack", [25.1, 31.76], [29.9, 31.2])] },
    { match: "Reach past both", note: "The effort goes into diplomacy: a seat in Berlin's plans and in the Spanish closing of Gibraltar.", arrows: [mapArrow("move", [12.5, 41.9], [13.4, 52.5]), mapArrow("move", [12.5, 41.9], [-3.7, 40.4])] },
  ],
  greeceDecision40: [
    { match: "Proceed on the planned date", note: "The army attacks from Albania towards Ioannina and the Epirus coast on the date the political timing sets.", arrows: [mapArrow("attack", [20.1, 40.6], [20.85, 39.67]), mapArrow("attack", [19.5, 40.2], [20.2, 39.4])] },
    { match: "Argue for delay", note: "The force in Albania is built up first and the attack waits.", arrows: [mapStand([19.8, 41.3])] },
  ],
  compass40: [
    { match: "Order an immediate general withdrawal", note: "The garrison at Sidi Barrani falls back to Bardia and Tobruk before the British attack.", arrows: [mapArrow("withdraw", [25.9, 31.6], [24.0, 32.0])] },
    { match: "Hold the fortified camps", note: "The army stays in its camps around Sidi Barrani and trusts them to hold.", arrows: [mapStand([25.9, 31.6]), mapStand([25.5, 31.4])] },
  ],
  tobruk42: [
    { match: "Press on toward Egypt", note: "The army goes on from Tobruk to the Alamein position, using what it has captured.", arrows: [mapArrow("attack", [23.97, 32.08], [28.95, 30.83])] },
    { match: "Halt at the Libya-Egypt frontier", note: "The army stops at the frontier at Sollum and consolidates.", arrows: [mapArrow("attack", [23.97, 32.08], [25.15, 31.77]), mapStand([25.2, 31.57])] },
  ],
  alamein42: [
    { match: "Fight the defensive battle", note: "The army stays in the Alamein line between the sea and the Qattara Depression.", arrows: [mapStand([28.95, 30.83]), mapStand([28.3, 30.6])] },
    { match: "Order a fighting withdrawal", note: "The army leaves the line and falls back into Libya, towards Benghazi.", arrows: [mapArrow("withdraw", [28.95, 30.83], [25.15, 31.77]), mapArrow("withdraw", [25.15, 31.77], [20.07, 32.12])] },
  ],
  torchTunisia42: [
    { match: "Rush every available reinforcement", note: "Troops and stores are flown and shipped from Naples and Palermo to Tunis and Bizerte.", arrows: [mapArrow("move", [14.27, 40.85], [10.18, 36.8]), mapArrow("move", [13.36, 38.12], [9.87, 37.27])] },
    { match: "Limit the Tunisia commitment", note: "The experienced units are taken back to Italy and Tunisia is held with what is there.", arrows: [mapArrow("withdraw", [10.18, 36.8], [14.27, 40.85]), mapStand([10.18, 36.8])] },
  ],
  sicilyHusky43: [
    { match: "Concentrate the defense on denying the Strait", note: "The garrison falls back through the island to Messina and crosses to the mainland.", arrows: [mapArrow("withdraw", [14.2, 37.4], [15.55, 38.19]), mapArrow("withdraw", [13.36, 38.12], [15.55, 38.19])] },
    { match: "Order the garrison to hold Sicily", note: "The garrison stands where it is, at Gela, Catania and Palermo, and is not withdrawn.", arrows: [mapStand([14.2, 37.3]), mapStand([13.36, 38.12]), mapStand([14.9, 37.5])] },
  ],
  armisticeAnnounce43: [
    { match: "Execute the armistice", note: "The King and the government leave Rome for Brindisi, and the garrisons are left to act on their own.", arrows: [mapArrow("move", [12.5, 41.9], [17.94, 40.63])] },
    { match: "Delay the public announcement", note: "The scattered units are drawn in around Rome first, and the announcement waits.", arrows: [mapArrow("move", [11.0, 43.5], [12.5, 41.9]), mapArrow("move", [13.5, 42.5], [12.5, 41.9]), mapStand([12.5, 41.9])] },
  ],
  monteLungo43: [
    { match: "Accept the American plan", note: "The Group attacks Monte Lungo on 8 December, in the morning mist, beside the American II Corps.", arrows: [mapArrow("attack", [13.45, 41.15], [14.0, 41.55])] },
    { match: "Ask II Corps for another week", note: "The attack is put off for a week to rehearse it with the guns and the infantry that will support it.", arrows: [mapStand([13.7, 41.25])] },
    { match: "Keep the Group out of the line", note: "The Group stays in the rear, in Apulia, until it is trained and equipped as a division.", arrows: [mapStand([16.87, 41.12])] },
  ],
  gothicLine44: [
    { match: "Commit the Co-Belligerent Army", note: "The combat groups go in with the Allied armies on the Adriatic and over the Apennines towards Bologna.", arrows: [mapArrow("attack", [13.0, 43.6], [12.4, 44.2]), mapArrow("attack", [11.25, 43.77], [11.34, 44.5])] },
    { match: "Commit more cautiously", note: "Only a part of the army is committed, on the Adriatic, and the rest is kept for the spring.", arrows: [mapArrow("attack", [13.1, 43.5], [12.6, 44.0]), mapStand([11.25, 43.77])] },
  ],
  springOffensive45: [
    { match: "Ask for the assault roles", note: "Cremona crosses the Senio at Alfonsine, and Friuli and Folgore take the road towards Bologna.", arrows: [mapArrow("attack", [12.2, 44.3], [11.34, 44.5]), mapArrow("attack", [11.0, 44.0], [11.34, 44.5])] },
    { match: "Keep the Groups to supporting roles", note: "The Groups hold the flanks and follow up, and are kept whole for the occupation.", arrows: [mapStand([12.2, 44.3]), mapStand([11.0, 44.0])] },
  ],
  },
};

