const SPECIAL_EVENTS = [
  // ---- OKW -----------------------------------------------------------------------------------------------------------------------
  {
    id: "dunkirk-lift",
    campaign: "german",
    at: ["channel"],
    dateline: "Dunkirk, 26 May to 4 June 1940",
    title: "The beaches are empty",
    text: [
      "The Royal Navy and hundreds of small craft have taken some 338,000 British and French soldiers off the beaches and the harbour mole. They left almost all their guns and vehicles behind, but the army that has come home is whole.",
      "Hitler was promised that the Luftwaffe would finish the work from the air. Cloud, the Royal Air Force and the sheer number of targets did not let it.",
    ],
    source: "Operation Dynamo, 26 May to 4 June 1940.",
  },
  {
    id: "stalingrad-last-pocket",
    campaign: "german",
    at: ["easternCollapse1943"],
    dateline: "Stalingrad, 31 January to 2 February 1943",
    title: "The Sixth Army is gone",
    text: [
      "The southern pocket surrendered on 31 January, the day after Paulus was made a field marshal, and the northern pocket on 2 February. About 91,000 men went into captivity.",
      "The wireless played slow music, and the High Command's communiqué spoke of a fight to the last man, which was not what had happened.",
    ],
    source: "The surrender of the Sixth Army, 31 January and 2 February 1943. Of the 91,000 prisoners, perhaps one in twenty came home.",
  },
  {
    id: "hamburg-firestorm",
    campaign: "german",
    at: ["twoFires1943"],
    dateline: "Hamburg, 24 July to 3 August 1943",
    title: "Four nights over Hamburg",
    text: [
      "Bomber Command by night and the Eighth Air Force by day have burnt out the eastern districts. On the night of 27 July the fires drew together into a storm that no fire brigade could enter. More than 30,000 people died, and perhaps a million left the city.",
      "The radar of the night fighters and the guns was blinded on the first night by strips of metal foil dropped from the bombers, which the British had never used before.",
    ],
    source: "Operation Gomorrah, 24 July to 3 August 1943.",
  },
  {
    id: "centre-in-moscow",
    campaign: "german",
    at: ["romaniaDefects44"],
    dateline: "Moscow, 17 July 1944",
    title: "The prisoners are marched through Moscow",
    text: [
      "Some 57,000 German prisoners, most of them taken from Army Group Centre, were marched through the streets of Moscow while the city watched. The newsreels have it already.",
      "Behind them the Red Army has taken Minsk, and Army Group Centre has lost most of its divisions.",
    ],
    source: "The march of German prisoners through Moscow, 17 July 1944.",
  },
  {
    id: "v2-and-dora",
    campaign: "german",
    at: ["ardennes"],
    dateline: "Paris and London, 8 September 1944",
    title: "The first V-2s",
    text: [
      "The first long-range rockets were fired at Paris and London on 8 September, and from October Antwerp became their chief target. Nothing can be done to stop one in flight.",
      "They are assembled underground in the Harz, at Mittelbau-Dora, by prisoners who are worked until they die.",
    ],
    source: "The V-2 campaign, from 8 September 1944. About 3,000 were fired; by most counts more prisoners died building them than the rockets killed.",
  },

  // ---- STAVKA --------------------------------------------------------------------------------------------------------------------
  {
    id: "brest-casemates",
    campaign: "soviet",
    at: ["smolensk41"],
    dateline: "Brest, from 22 June 1941",
    title: "The fortress at Brest",
    text: [
      "The old fortress on the frontier was surrounded on the first morning. Groups of its garrison fought on in the casemates for weeks, the last of them into July, long after the front had passed them by.",
      "Almost nothing about it reached the staff at the time, and no one in Moscow could say for certain who was still holding out there.",
    ],
    source: "The defence of the Brest fortress, 22 June to July 1941.",
  },
  {
    id: "red-square-parade",
    campaign: "soviet",
    at: ["specialSection41"],
    dateline: "Moscow, 7 November 1941",
    title: "The parade on Red Square",
    text: [
      "On the anniversary of the revolution, with the Germans about a hundred kilometres away, the parade went ahead in the snow. Stalin spoke of the great Russian commanders of the past, and the regiments marched from the square to the front.",
      "The counteroffensive that followed on 5 and 6 December was fought in part by divisions brought from Siberia and the Far East in the weeks before.",
    ],
    source: "The Red Square parade of 7 November 1941 and the Moscow counteroffensive of December.",
  },
  {
    id: "stalingrad-bombed",
    campaign: "soviet",
    at: ["stalingradStreets42"],
    dateline: "Stalingrad, 23 August 1942",
    title: "The city burns",
    text: [
      "The Luftwaffe flew more than a thousand sorties against Stalingrad in a day and killed thousands of civilians. The same afternoon the leading German tanks reached the Volga north of the city, at Rynok.",
      "No one had ordered the population out. The factories are still working, and the men who work in them are being armed in the yards.",
    ],
    source: "The bombing of Stalingrad and the German advance to the Volga, 23 August 1942.",
  },
  {
    id: "leningrad-corridor",
    campaign: "soviet",
    at: ["quietSector43"],
    dateline: "Leningrad, 18 January 1943",
    title: "A corridor to Leningrad",
    text: [
      "The Leningrad and Volkhov Fronts have met near Shlisselburg and opened a land corridor on the south shore of Lake Ladoga, between eight and eleven kilometres wide. A railway is laid along it within weeks.",
      "The siege that began on 8 September 1941 is not over. The corridor stays under German guns, and the city will not be freed until January 1944.",
    ],
    source: "Operation Iskra, 12 to 18 January 1943.",
  },
  {
    id: "warsaw-sixty-three-days",
    campaign: "soviet",
    at: ["polishQuestion45"],
    dateline: "Warsaw, 1 August to 2 October 1944",
    title: "Sixty-three days",
    text: [
      "The rising in Warsaw ended on 2 October with a capitulation. About 16,000 Home Army fighters were killed, and some 150,000 civilians. The survivors were driven out of the city, and what was left of it was then destroyed building by building.",
      "The Red Army stood on the east bank of the Vistula through all of it, and the question of why will be asked in London and in Washington.",
    ],
    source: "The Warsaw Rising, 1 August to 2 October 1944.",
  },

  // ---- SHAEF ---------------------------------------------------------------------------------------------------------------------
  {
    id: "dunkirk-home",
    campaign: "allied",
    at: ["battleOfBritain40"],
    dateline: "Dover, 4 June 1940",
    title: "The army is home",
    text: [
      "Some 338,000 men came off the beaches at Dunkirk, and the trains have been carrying them across England for a week. They left more than 63,000 vehicles and nearly 2,500 guns on the French side.",
      "The Prime Minister has warned the House of Commons that wars are not won by evacuations. The men will be rearmed, and Britain is now an island with an army and almost nothing to equip it with.",
    ],
    source: "Operation Dynamo, 26 May to 4 June 1940.",
  },
  {
    id: "pearl-harbor-aftermath",
    campaign: "allied",
    at: ["europeFirst42"],
    dateline: "Washington, 7 to 13 December 1941",
    title: "Two oceans",
    text: [
      "Japan attacked Pearl Harbor on 7 December and killed 2,403 Americans. Four days later Germany and Italy declared war on the United States, which settled a question that the Americans had not wished to settle for themselves.",
      "The Prime Minister sailed for Washington on 13 December to put the order of the war to the President before the Pacific takes the whole of the country's attention.",
    ],
    source: "Pearl Harbor, 7 December 1941; the German and Italian declarations of war, 11 December.",
  },
  {
    id: "church-bells",
    campaign: "allied",
    at: ["casablanca43"],
    dateline: "Britain, 15 November 1942",
    title: "The church bells",
    text: [
      "For the first time since the summer of 1940 the church bells of Britain were rung, for the victory of the Eighth Army at El Alamein. They had been kept silent as the warning of an invasion.",
      "Speaking at the Mansion House, the Prime Minister called it not the end, nor the beginning of the end, but perhaps the end of the beginning.",
    ],
    source: "The Battle of El Alamein, 23 October to 11 November 1942; the Mansion House speech, 10 November.",
  },
  {
    id: "hamburg-gomorrah",
    campaign: "allied",
    at: ["tehran43"],
    dateline: "Hamburg, 24 July to 3 August 1943",
    title: "The firestorm",
    text: [
      "Bomber Command by night and the Eighth Air Force by day have raided Hamburg for ten days. On the night of 27 July the fires joined into a firestorm, and more than 30,000 people died.",
      "It is the largest single success the bombing offensive has had, and the argument over what it is worth has not yet been settled in London or in Washington.",
    ],
    source: "Operation Gomorrah, 24 July to 3 August 1943.",
  },
  {
    id: "the-camps",
    campaign: "allied",
    at: ["germanyOccupation45"],
    dateline: "Buchenwald, 11 April, and Bergen-Belsen, 15 April 1945",
    title: "The camps",
    text: [
      "American troops reached Buchenwald on 11 April and British troops Bergen-Belsen on 15 April. Thousands of dead lay unburied, and thousands of the living were too weak to be moved.",
      "General Eisenhower went to Ohrdruf the day after it was taken, and asked that journalists and legislators from both countries be brought to see what he had seen, so that no one could say afterwards that it was not so.",
    ],
    source: "The liberation of Buchenwald and Bergen-Belsen, April 1945; Eisenhower at Ohrdruf, 12 April.",
  },

  // ---- COMANDO SUPREMO -----------------------------------------------------------------------------------------------------------
  {
    id: "korce-falls",
    campaign: "italy",
    at: ["compass40"],
    dateline: "Albania, 22 November 1940",
    title: "The Greeks are in Albania",
    text: [
      "Within a month of the invasion of Greece the Greek army has taken Korçë and holds ground well inside Albania.",
      "The offensive that was to reach Athens in days has become a fight for the passes in the snow. The mountain roads are mud and then snow, and everything the divisions need crosses the Adriatic to Durazzo and Valona, where the ports are under attack from the air.",
    ],
    source: "The Greek counteroffensive, November 1940.",
  },
  {
    id: "pedestal",
    campaign: "italy",
    at: ["alamein42"],
    dateline: "Malta, 11 to 15 August 1942",
    title: "Five ships of fourteen",
    text: [
      "Fourteen merchant ships sailed for Malta in Operation Pedestal. Italian submarines, torpedo boats and aircraft joined the Germans in the attacks, and nine of the merchant ships were sunk, with an aircraft carrier and two cruisers. Five ships got in, among them the tanker Ohio, held up between two destroyers, which came into Grand Harbour on 15 August.",
      "The island will live on what they carried. The convoys that supply Rommel are about to feel it.",
    ],
    source: "Operation Pedestal, 10 to 15 August 1942.",
  },
  {
    id: "rome-bombed",
    campaign: "italy",
    at: ["mussoliniCoup43"],
    dateline: "Rome, 19 July 1943",
    title: "Bombs on Rome",
    text: [
      "American bombers hit the railway yards at San Lorenzo, and more than a thousand people died in the district beside them. It was the first time that bombs had fallen on the capital. The Pope came to San Lorenzo the same day.",
      "Five days later the Grand Council met.",
    ],
    source: "The bombing of Rome, 19 July 1943; the Grand Council, 24 to 25 July.",
  },
  {
    id: "ardeatine",
    campaign: "italy",
    at: ["romeLiberation44"],
    dateline: "Rome, 23 and 24 March 1944",
    title: "The Ardeatine caves",
    text: [
      "A bomb in the Via Rasella killed thirty-three men of a German police regiment. The next day 335 Italians, taken from the prisons, were shot in a quarry on the Via Ardeatina, ten for each German and five more by mistake.",
      "Rome has been an open city in name for months. It is now a city that is counting its dead before it is freed.",
    ],
    source: "The attack in the Via Rasella and the massacre at the Ardeatine caves, 23 and 24 March 1944.",
  },
  {
    id: "verona-trial",
    campaign: "italy",
    at: ["civilWarPartisans44"],
    dateline: "Verona, 11 January 1944",
    title: "The Verona trial",
    text: [
      "Five of the men on the Grand Council who voted against Mussolini on 24 and 25 July were shot at Verona, among them Galeazzo Ciano, Mussolini's son-in-law and his former foreign minister. Mussolini had refused to hear his daughter's appeal.",
      "The others who had voted with them, and had got away, were condemned in their absence.",
    ],
    source: "The Verona trial, 8 to 10 January 1944, and the executions of 11 January.",
  },
  // ---- The home front (Dispatches WW2, November 2026; facts in claims/home-front-round1.json) ------------------------------------------
  {
    id: "home-reich-ration-card",
    campaign: "german",
    at: ["phoneyWar39"],
    dateline: "Berlin, autumn 1939",
    title: "The ration card",
    text: [
      "Food has been rationed since the last days of August, before a shot was fired in Poland. Meat, fats, sugar, milk and bread now come by card, and the cards are graded by the work a person does, so a miner draws more than a clerk.",
      "Clothing follows on a points card in the autumn. The regime remembers the hunger winters of the last war and the strikes that came with them, and it means to keep the shops supplied from the conquered lands rather than ask more of its own people.",
    ],
    source: "German food and clothing rationing from late August and November 1939.",
  },
  {
    id: "home-reich-total-war",
    campaign: "german",
    at: ["atlanticWall43"],
    dateline: "Berlin, February 1943",
    title: "Total war at home",
    text: [
      "In the Sportpalast on 18 February Goebbels asks a hand-picked crowd whether it wants total war, and it roars that it does. A decree of January has already ordered women and men not yet at work to register for war labour.",
      "The factories run on more than Germans. Millions of foreign workers, many of them taken from their homes by force, and prisoners of war now stand at the machines and in the fields, and the war economy cannot run without them.",
    ],
    source: "The Sportpalast speech of 18 February 1943 and the labour registration decree of January 1943.",
  },
  {
    id: "home-ussr-labour-decree",
    campaign: "soviet",
    at: ["games41"],
    dateline: "Moscow, January 1941",
    title: "The factory clock",
    text: [
      "Since the decree of 26 June 1940 the working day is eight hours instead of seven and the week has seven days. A worker may not leave a job without permission, and coming more than twenty minutes late is a crime that the courts punish.",
      "The country is being made ready for a war it has not yet been told it must fight. More than a million have already been convicted under it, most of them sentenced to corrective labour at their own benches with part of their pay withheld.",
    ],
    source: "Decree of the Presidium of the Supreme Soviet, 26 June 1940.",
  },
  {
    id: "home-ussr-rations",
    campaign: "soviet",
    at: ["order227_42"],
    dateline: "Kuibyshev, summer 1942",
    title: "Bread by category",
    text: [
      "Rationing began in Moscow and Leningrad in July 1941 and now reaches every town. Workers in war industry draw the most bread, office staff less, and dependants and children least of all. A card lost is a month gone hungry.",
      "What the card does not give, the collective farm market sells at prices many times higher. Women, teenagers and the old fill the factories that were carried east, often working twelve hours, and sleep in dugouts and barracks beside the lines.",
    ],
    source: "Soviet rationing from July 1941 and the wartime labour of evacuated industry.",
  },
  {
    id: "home-britain-rationing",
    campaign: "allied",
    at: ["altmarkRaid40"],
    dateline: "London, February 1940",
    title: "Bacon, butter and sugar",
    text: [
      "Rationing began on 8 January with bacon, butter and sugar, and meat is to follow in March. Each household is registered with its own grocer and butcher, and the coupons in the ration book are cut out at the counter.",
      "Most of the children sent to the country in September have drifted home again, because the bombers have not come. The blackout has killed more people on the roads than the enemy has.",
    ],
    source: "British rationing from 8 January 1940; the evacuation of September 1939.",
  },
  {
    id: "home-britain-volunteers",
    campaign: "allied",
    at: ["halifaxCrisis40"],
    dateline: "London, late May 1940",
    title: "The volunteers",
    text: [
      "On 14 May Anthony Eden asked on the wireless for men to join a force of Local Defence Volunteers, and within days hundreds of thousands had given their names at police stations. Most have an armband and no rifle.",
      "On 22 May Parliament passed in a single afternoon an Act that puts every person and every piece of property at the government's disposal. Signposts are being taken down so that an invader cannot read the roads.",
    ],
    source: "The Local Defence Volunteers broadcast of 14 May 1940 and the Emergency Powers (Defence) Act of 22 May 1940.",
  },
  {
    id: "home-italy-bread",
    campaign: "italy",
    at: ["rommelAdvance41"],
    dateline: "Rome, winter 1941",
    title: "Bread on the card",
    text: [
      "Since October bread has been rationed, at about two hundred grams a day for most people, and pasta, oil and sugar were on the card before it. Coffee has all but gone, and the substitutes are made from barley and chicory.",
      "The black market supplies whoever can pay. In the cities the ration does not cover the hunger, and the prefects report that people talk more about the price of bread than about the war in Africa.",
    ],
    source: "Italian bread rationing from October 1941 and the prefects' reports on public opinion.",
  },
  {
    id: "home-italy-strikes",
    campaign: "italy",
    at: ["tunisiaCollapse43"],
    dateline: "Turin and Milan, March 1943",
    title: "The March strikes",
    text: [
      "On 5 March the workers at Fiat Mirafiori in Turin stopped work, and within days the strikes had spread to the factories of Milan. They asked for bread, for the allowance paid to families bombed out of their homes, and in some shops for an end to the war.",
      "They were the first mass strikes in Axis Europe. The regime gave way on pay, arrested some of the organisers and could not hide what the stoppage showed about how far its own workers still followed it.",
    ],
    source: "The strikes in Turin and Milan of March 1943.",
  },
  {
    id: "home-japan-rice",
    campaign: "japan",
    at: ["neutralityPact41"],
    dateline: "Tokyo, April 1941",
    title: "Rice by the passbook",
    text: [
      "From this month rice is rationed in the six largest cities, at 2.3 go, about 330 grams, a day for an adult. Each household has a passbook, and the neighbourhood association hands out the ration and passes on the orders of the state.",
      "Sugar and matches were rationed before the rice. The National Mobilisation Law of 1938 lets the government direct labour, prices and goods without asking the Diet, and it is using that power more each month.",
    ],
    source: "Rice rationing in the six largest cities from April 1941; the National Mobilisation Law of 1938.",
  },
  {
    id: "home-japan-evacuation",
    campaign: "japan",
    at: ["ichiGoTriumph44"],
    dateline: "Tokyo, autumn 1944",
    title: "The children leave the cities",
    text: [
      "Since August the schoolchildren of the great cities have been sent in their classes to temples and inns in the countryside, hundreds of thousands of them, with their teachers. The parents stay behind at work.",
      "The government expects American bombers from the airfields on Saipan to reach the home islands soon. In the countryside the evacuated children are often hungry, and the farmers who keep them have little enough to eat themselves.",
    ],
    source: "The school evacuation from the cities of Japan from August 1944.",
  },
  {
    id: "home-us-war-plants",
    campaign: "alliedPacific",
    at: ["doolittleRaidAllied42"],
    dateline: "Washington, spring 1942",
    title: "The last cars",
    text: [
      "In February the last cars built for civilians came off the lines in Detroit, and the plants have turned to tanks, engines and aircraft. Tyres were rationed in the first weeks after Pearl Harbor because the rubber came from Malaya.",
      "Sugar has gone on the ration book in May, and on the East Coast petrol is rationed too, to save the tankers the U-boats are sinking off the beaches. A War Production Board decides what may still be made for the home.",
    ],
    source: "American civilian car production halted February 1942; tyre, sugar and petrol rationing in 1942.",
  },
  {
    id: "home-us-women-at-work",
    campaign: "alliedPacific",
    at: ["torpedoCrisis43"],
    dateline: "Detroit and Seattle, January 1943",
    title: "Women at the benches",
    text: [
      "In the aircraft plants of Seattle and the shipyards of the West Coast, women now rivet, weld and inspect. More than six million women will join the paid work force before the war ends, many of them in jobs they were told before the war they could not do.",
      "Black workers, whom many defence plants turned away until the President's order of June 1941 forbade it, are moving north and west to the war jobs, and the cities they come to are short of houses.",
    ],
    source: "Women's war work in American industry; Executive Order 8802 of June 1941.",
  },
];

function SpecialEventScreen({ campaign, event, onContinue }) {
  const paperTint = { german: "#fbfaf8", soviet: "#f8f1e2", allied: "#eff3f4", italy: "#f2f0e8" }[campaign.id] || "#ffffff";
  const headingRef = useRef(null);
  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
  }, []);
  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <h1 ref={headingRef} tabIndex={-1} className="sr-only outline-none">
          {t("Special dispatch")}
        </h1>
        <div className="wire-tear" style={{ "--wire-paper": paperTint }}></div>
        <div className="px-5 py-5" style={{ backgroundColor: paperTint }}>
          <div className="pb-2 mb-3" style={{ borderBottom: `2px solid ${campaign.accent}`, fontFamily: "'IBM Plex Mono', monospace" }}>
            <div className="text-xs font-bold tracking-[0.16em]" style={{ color: campaign.accent }}>
              {t("SPECIAL DISPATCH")}
            </div>
            <div className="text-[11px] text-[#444] mt-0.5">{event.dateline}</div>
          </div>
          <h2 className="text-2xl uppercase leading-tight mb-3 text-[#16130f]" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700 }}>
            {event.title}
          </h2>
          {event.text.map((p, i) => (
            <p key={i} className="text-[14px] leading-relaxed mb-3 text-[#2a2622]" style={{ fontFamily: "'Courier Prime', monospace" }}>
              {p}
            </p>
          ))}
          <div className="text-[11px] pt-2 text-[#555]" style={{ borderTop: "1px dashed #ccc4b8", fontFamily: "'IBM Plex Mono', monospace" }}>
            {event.source ? t("For the record: {eventSource}", { eventSource: event.source }) : t("Nothing in this dispatch changes a meter.")}
          </div>
        </div>
        <div className="wire-tear wire-tear-bottom" style={{ "--wire-paper": paperTint }}></div>
        <button
          data-hotkey="enter"
          onClick={onContinue}
          className="w-full border-2 mt-4 px-4 py-3 text-sm uppercase tracking-[0.2em] font-bold transition-colors duration-150"
          style={{ borderColor: campaign.accent, color: campaign.accent, fontFamily: "'IBM Plex Mono', monospace", background: paperTint }}
        >
          {t("Continue")}
        </button>
      </div>
    </div>
  );
}

// ---------- THE PACIFIC COMMANDS' STATE-DRIVEN EVENTS (from Dispatches 1941) ----------
// 1941's STATE_EVENTS, unchanged but for the meters (Readiness is manpower, Pipeline is fuel): a piece of context the state of the file
// brings to a headquarters between two reports, shown once before the first report whose date starts inside its window (from, to) when
// `when` holds. They are shown on the special-dispatch screen above (pacificStateEvent turns one into a dispatch); the flag ev_<id>
// records it, the same flag the European dispatches use. Claims: claims/pacific-events-round1.json.
const PACIFIC_STATE_EVENTS = [
  // ---- IGHQ ----
  {
    id: "japan_munitions", campaign: "japan", kind: "Politics", anchor: "theMainlandCrisis44",
    from: "1943-10", to: "1944-03", date: "NOVEMBER 1943",
    title: "The Ministry of Munitions",
    when: (f) => f.unificationPath !== "forced",
    paras: [
      "In November 1943 the government sets up a Ministry of Munitions to unify the production of arms, aircraft above all. The Army and the Navy have been bidding against each other for aluminum and engines, and each has kept its own factories and its own designs.",
      "The new ministry moves the quarrel into one building and does not end it. Aircraft output goes on rising through 1944, and the pilots to fly the aircraft do not keep pace.",
    ],
  },
  {
    id: "japan_students", campaign: "japan", kind: "The home front", anchor: "theMainlandCrisis44",
    from: "1943-10", to: "1944-06", date: "OCTOBER 1943",
    title: "The Students Are Called Up",
    when: (f, m) => m.manpower <= -2,
    paras: [
      "On 21 October 1943 tens of thousands of students march past Prime Minister Tojo in the rain at the Meiji Jingu stadium in Tokyo. The deferment that kept university students out of the army has ended, and the first of them are called up in December.",
      "The armed forces need officers and pilots, and the classrooms that trained them are emptying. Factories lose the young men who ran the machines, and schoolgirls take their places on the lines.",
    ],
  },
  {
    id: "japan_tankers", campaign: "japan", kind: "The sea lanes", anchor: "philippineSea44",
    from: "1943-06", to: "1944-09", date: "NOVEMBER 1943",
    title: "The Tankers",
    when: (f, m) => m.fuel <= -3,
    paras: [
      "American submarines are sinking merchant ships faster than Japan can build them, and the tankers that carry oil from Borneo and Sumatra to the home islands are among the first to go. The Navy has too few escorts, and the ships run in small groups with little cover.",
      "The Navy forms an independent escort command in November 1943. By then the voyage from the Indies to the home islands has become the most dangerous one in the war.",
    ],
  },
  {
    id: "japan_tojo", campaign: "japan", kind: "Politics", anchor: "onishiKamikaze44",
    from: "1944-07", to: "1944-10", date: "JULY 1944",
    title: "The Cabinet Falls",
    when: () => true,
    paras: [
      "Saipan falls in early July 1944, and with it the home islands come within range of the new bombers. On 16 July Tojo is removed as Chief of the Army General Staff, and on 18 July he and his cabinet announce their resignation, under pressure from the senior statesmen and from inside the Navy. General Koiso becomes Prime Minister on 22 July.",
      "In August a Supreme Council for the Direction of the War is formed from the Prime Minister, the Foreign Minister, the two service ministers and the two chiefs of staff, to settle the basic policy of the war.",
    ],
  },
  {
    id: "japan_rice", campaign: "japan", kind: "The home front", anchor: "theSubmarineCarriersQuestion45",
    from: "1945-04", to: "1945-08", date: "JUNE 1945",
    title: "The Rice Crop",
    when: (f, m) => m.fuel <= -3,
    paras: [
      "The year's rice crop is poor, and the city ration has already been cut to a level that leaves people hungry. Farm labor has gone to the war, and the blockade has stopped the rice that came from Korea, Taiwan and Indochina.",
      "The ministries tell the cabinet that the food will not last into the winter. It is one of the figures the cabinet is shown that summer.",
    ],
  },
  // ---- CINCPAC ----
  {
    id: "allied_carriers", campaign: "alliedPacific", kind: "Production", anchor: "unconditionalSurrender43",
    from: "1943-01", to: "1943-12", date: "1943",
    title: "The New Carriers",
    when: (f, m) => m.fuel >= 2,
    paras: [
      "The carrier Essex joins the fleet at the end of 1942, and more of her class follow through 1943. The carriers the fleet lost in 1942, Lexington, Yorktown, Wasp and Hornet, are being replaced faster than Japan can replace the ones it lost.",
      "The first of the new carriers do not reach the Pacific in strength until the autumn, and the staff in Hawaii plans around that date. Until then the fleet has the carriers it has.",
    ],
  },
  {
    id: "allied_landing_ships", campaign: "alliedPacific", kind: "Production", anchor: "philippineSeaAllied44",
    from: "1943-12", to: "1944-06", date: "FEBRUARY 1944",
    title: "The Landing Ship Shortage",
    when: (f, m) => m.fuel <= -2,
    paras: [
      "Landing ships tank are the scarcest ships in the Allied navies. The Atlantic needs every one it can get for the landing in Normandy, and the Pacific has a fraction of what its commanders have asked for. The operations in the Central Pacific are timed around the few that are available.",
      "The planners in Hawaii and Washington argue over every ship, and the Pacific is told again that the Atlantic comes first.",
    ],
  },
  {
    id: "allied_special_attack", campaign: "alliedPacific", kind: "The enemy", anchor: "quezonsSuccessor44",
    from: "1944-10", to: "1944-12", date: "OCTOBER 1944",
    title: "The First Special Attacks",
    when: () => true,
    paras: [
      "On 25 October 1944, off Samar, Japanese naval aircraft dive into the escort carriers of Taffy 3 on purpose. The escort carrier St. Lo is sunk by a single hit, the first major warship lost to a kamikaze attack.",
      "The attacks go on over Leyte Gulf in the days that follow. The fleet has no answer to them except to shoot the aircraft down before they arrive.",
    ],
  },
  {
    id: "allied_roosevelt", campaign: "alliedPacific", kind: "Politics", anchor: "okinawaAllied45",
    from: "1945-04", to: "1945-04", date: "APRIL 1945",
    title: "The President Is Dead",
    when: () => true,
    paras: [
      "President Roosevelt dies at Warm Springs, Georgia, on 12 April 1945. Vice President Truman is sworn in that evening, and he has been told almost nothing of the war's secret programs.",
      "The Joint Chiefs carry on as they were. The fleet is off Okinawa, and the war does not pause for the change of President.",
    ],
  },
  {
    id: "allied_fatigue", campaign: "alliedPacific", kind: "The fleet", anchor: "strategicBombingAllied45Delayed",
    from: "1945-04", to: "1945-06", date: "MAY 1945",
    title: "The Ships on Station",
    when: (f, m) => m.manpower <= -3,
    paras: [
      "The ships on the Okinawa stations are at general quarters for much of every day and night. Sailors who have gone without sleep for days fall ill with what the medical officers call combat fatigue, and the sick lists show it.",
      "The fatigue is one reason the Navy relieves the ships on the stations by turn, and one more cost of a campaign that lasts close to three months.",
    ],
  },
  // ---- more from outside the headquarters ----
  {
    id: "japan_singapore", campaign: "japan", kind: "The war", anchor: "burmaRangoon42",
    from: "1942-02", to: "1942-03", date: "FEBRUARY 1942",
    title: "Singapore",
    when: () => true,
    paras: [
      "Singapore surrenders on 15 February 1942, a week after the first Japanese troops cross the strait. Percival, the British commander, gives up a garrison of tens of thousands of British, Indian and Australian troops. It is the largest surrender in British military history.",
      "The Southern Operation is weeks ahead of its timetable. The Army and Navy staffs have to plan the next stage of a war that is going better than they expected.",
    ],
  },
  {
    id: "japan_tokyo_raid", campaign: "japan", kind: "The home front", anchor: "okinawa45",
    from: "1945-03", to: "1945-04", date: "MARCH 1945",
    title: "The Night of 9 March",
    when: () => true,
    paras: [
      "On the night of 9 to 10 March 1945, B-29s from the Marianas drop incendiaries on the crowded east side of Tokyo from low altitude. The fire destroys about sixteen square miles of the city. Estimates of the dead run from about 80,000 to more than 100,000.",
      "It is the first of the low-level fire raids on the large cities. In the ten days that follow the same method is used on Nagoya, Osaka and Kobe.",
    ],
  },
  {
    id: "allied_singapore", campaign: "alliedPacific", kind: "The war", anchor: "curtinsTurn42",
    from: "1942-02", to: "1942-02", date: "FEBRUARY 1942",
    title: "Singapore Falls",
    when: () => true,
    paras: [
      "Singapore surrenders on 15 February 1942. Percival gives up a garrison of tens of thousands of British, Indian and Australian troops, the largest surrender in British military history.",
      "In Washington and Canberra the fall is read as the end of the Malay Barrier. The Australian government, with its best divisions in the Middle East, turns to the United States for its defense.",
    ],
  },
  {
    id: "allied_germany", campaign: "alliedPacific", kind: "Politics", anchor: "kyotoTargetDebate45",
    from: "1945-05", to: "1945-06", date: "MAY 1945",
    title: "Germany Surrenders",
    when: () => true,
    paras: [
      "Germany signs an unconditional surrender at Reims early on 7 May 1945, and the act is ratified in Berlin on 8 May. The war in Europe is over.",
      "The Pacific is now the whole of the war, and the forces that fought in Europe are to be redeployed across the world to the Pacific.",
    ],
  },
];

/** The state-driven event due on arriving at a Pacific command's report, as a special dispatch, or null. */
function pacificStateEvent(campaignId, nextPos, flags, meters) {
  if (!PACIFIC_COMMANDS.includes(campaignId)) return null;
  let nextDate;
  try {
    nextDate = CAMPAIGNS[campaignId].resolveNode(String(nextPos), flags, meters)?.date;
  } catch (e) {
    nextDate = undefined;
  }
  const e = dueStateEvent({ campaignId, events: PACIFIC_STATE_EVENTS, nextDate, flags, meters });
  if (!e) return null;
  const dateline = String(e.date || "").toLowerCase().replace(/(^|[\s–-])([a-z])/g, (m, s, c) => s + c.toUpperCase());
  return { id: e.id, campaign: e.campaign, kind: e.kind, dateline: e.kind ? `${e.kind}, ${dateline}` : dateline, title: e.title, text: e.paras };
}

// ---------- THE EUROPEAN COMMANDS' STATE-DRIVEN EVENTS (Dispatches WW2) ----------
// The same rules as the Pacific commands' above (a window of months, a condition on the file's state, two paragraphs, shown once on the
// special-dispatch screen), for OKW, STAVKA, the War Cabinet and Comando Supremo. An event with `command` shows only in that command's file
// (the War Cabinet's are filed under SHAEF's source file, which the Joint Chiefs' file also reads). Claims: claims/europe-events-round1.json.
const EUROPE_STATE_EVENTS = [
  // ---- OKW ----
  {
    id: "ger_speer", campaign: "german", kind: "Production", anchor: "stalingradPocket",
    from: "1942-02", to: "1942-09", date: "FEBRUARY 1942",
    title: "A New Armaments Minister",
    when: (f, m) => m.fuel <= -2,
    paras: [
      "On 8 February 1942 Fritz Todt, the Minister for Armaments and Munitions, is killed when his aircraft crashes after taking off from the Führer's headquarters at Rastenburg. Hitler gives the ministry to his architect, Albert Speer, the same day.",
      "Speer sets up central committees of industrialists for each kind of weapon and pushes the services to accept fewer types in longer runs. Output of arms rises steeply through 1942 and 1943, from factories that had been run as if the war would be short.",
    ],
  },
  {
    id: "ger_synthetic_fuel", campaign: "german", kind: "Production", anchor: "ardennes",
    from: "1944-05", to: "1944-12", date: "MAY 1944",
    title: "The Hydrogenation Plants",
    when: (f, m) => m.fuel <= -3,
    paras: [
      "On 12 May 1944 the American heavy bombers strike the synthetic oil plants at Leuna, Brüx, Böhlen and elsewhere, and they come back again and again through the summer. The plants turn coal into the aviation spirit the Luftwaffe flies on.",
      "Speer writes to Hitler that the attacks are the most dangerous of the war. By the autumn the output of aviation spirit is a small fraction of what it was in the spring, and pilots go into action with only a few hours of training in the air.",
    ],
  },
  {
    id: "ger_volkssturm", campaign: "german", kind: "The home front", anchor: "ardennes",
    from: "1944-09", to: "1945-04", date: "OCTOBER 1944",
    title: "The Volkssturm",
    when: (f, m) => m.manpower <= -4,
    paras: [
      "A decree of 25 September 1944, announced in October, calls up every man from sixteen to sixty not already in the forces into the Volkssturm, a people's militia raised by the Party, not the army. The men keep their jobs and drill on Sundays.",
      "Many have no uniform but an armband, and their weapons are old rifles and the new Panzerfaust. Battalions of them are sent to the frontier in the East and the West as the armies fall back toward the Reich.",
    ],
  },
  // ---- STAVKA ----
  {
    id: "sov_road_of_life", campaign: "soviet", kind: "Supply", anchor: "winterGeneral42",
    from: "1941-11", to: "1942-04", date: "NOVEMBER 1941",
    title: "The Road Across the Ice",
    when: (f, m) => m.fuel <= -2 || m.manpower <= -2,
    paras: [
      "Leningrad is cut off by land, and the bread ration for most of its people has been cut again and again. On 22 November 1941 the first column of lorries crosses the frozen surface of Lake Ladoga to the city, on ice that has only just become thick enough to bear them.",
      "The road across the ice carries food and fuel in and the sick, the old and the children out through the winter. Hundreds of thousands of people in the city die of hunger and cold before the spring.",
    ],
  },
  {
    id: "sov_tankograd", campaign: "soviet", kind: "Production", anchor: "kharkov42",
    from: "1942-01", to: "1942-10", date: "1942",
    title: "Tankograd",
    when: (f, m) => m.fuel <= -3,
    paras: [
      "The Kirov works, moved out of Leningrad in the autumn of 1941, has been joined at Chelyabinsk in the Urals to the tractor plant and the Kharkov diesel works. The people of the city call the place Tankograd.",
      "Engineers and workers from three cities live in barracks and dugouts and work long shifts in cold buildings. In the summer of 1942 the plant begins to build the T-34 alongside its heavy tanks, and its output rises month after month.",
    ],
  },
  {
    id: "sov_partisans", campaign: "soviet", kind: "Behind the lines", anchor: "kharkov42",
    from: "1942-05", to: "1942-12", date: "MAY 1942",
    title: "A Staff for the Partisans",
    when: (f, m) => m.initiative <= -2,
    paras: [
      "On 30 May 1942 the State Defence Committee sets up a Central Staff of the Partisan Movement under Panteleimon Ponomarenko, the Party's first secretary in Belorussia. Bands that have fought on their own in the forests are to be supplied, given radios and directed from Moscow.",
      "The partisans' war is a war on the railways and on the occupiers' outposts, and it brings reprisals on the villages around them. In the summer of 1943 the Central Staff orders a campaign against the rail lines behind the German armies.",
    ],
  },
  // ---- The War Cabinet (SHAEF's source file) ----
  {
    id: "brit_lend_lease", campaign: "allied", command: "british", kind: "Supply", anchor: "compassGreece41",
    from: "1941-01", to: "1941-06", date: "MARCH 1941",
    title: "Lend-Lease",
    when: (f, m) => m.fuel <= -2,
    paras: [
      "Britain's gold and dollars are nearly gone: the cash the United States has demanded for every ship, aircraft and shell since 1939 can no longer be found. On 11 March 1941 President Roosevelt signs the Lend-Lease Act, which lets him lend or lease arms and supplies to any country whose defence he judges vital to that of the United States.",
      "Payment is put off until after the war. The first cargoes are food and steel as much as weapons, and the shipping to carry them has still to get through the Atlantic.",
    ],
  },
  {
    id: "brit_beveridge", campaign: "allied", command: "british", kind: "The home front", anchor: "casablanca43",
    from: "1942-11", to: "1943-04", date: "DECEMBER 1942",
    title: "The Beveridge Report",
    when: () => true,
    paras: [
      "On 1 December 1942 Sir William Beveridge publishes his report on social insurance: a single scheme to pay for sickness, unemployment and old age, against what he calls the five giants of want, disease, ignorance, squalor and idleness.",
      "Long queues form to buy it, and hundreds of thousands of copies are sold. The government is wary of the cost while the war lasts, and in February 1943 more than a hundred members of the Commons vote against its delay.",
    ],
  },
  {
    id: "brit_bevin_boys", campaign: "allied", command: "british", kind: "The home front", anchor: "anzio44",
    from: "1943-12", to: "1944-06", date: "DECEMBER 1943",
    title: "The Ballot for the Pits",
    when: (f, m) => m.manpower <= -3,
    paras: [
      "The mines are short of tens of thousands of men, and coal is the fuel of every factory and power station in the country. In December 1943 Ernest Bevin, the Minister of Labour, announces that one young man in ten called up for service will be sent down the pits instead, chosen by ballot.",
      "The Bevin Boys come from every kind of home and many of them have never seen a mine. They are given a few weeks of training and no uniform, and some are taken for men dodging the call-up.",
    ],
  },
  // ---- Comando Supremo ----
  {
    id: "ita_fleet_fuel", campaign: "italy", kind: "Supply", anchor: "tobruk42",
    from: "1942-06", to: "1943-05", date: "1942",
    title: "The Fleet Without Oil",
    when: (f, m) => m.fuel <= -3,
    paras: [
      "Italy entered the war with a few months of fuel oil for the fleet, and Germany sends less from Romania than the navy asks for. By 1942 the battleships at Taranto and La Spezia can rarely put to sea, and the oil that is left goes to the destroyers that escort the convoys to Libya.",
      "Each convoy that sails is weighed against the fuel it burns, and each tanker sunk on the way to Tripoli or Benghazi is fuel the army in the desert does not get.",
    ],
  },
  {
    id: "ita_armir", campaign: "italy", kind: "The Eastern Front", anchor: "torchTunisia42",
    from: "1942-12", to: "1943-05", date: "DECEMBER 1942",
    title: "The Army on the Don",
    when: (f, m) => m.manpower <= -3,
    paras: [
      "The Italian Eighth Army, more than two hundred thousand men sent to Russia in 1942, holds a long stretch of the Don. In December 1942 the Soviet winter offensive breaks through its divisions, and in January the Alpine Corps is cut off further north.",
      "The Alpini fight their way west through the snow, breaking out at Nikolayevka at the end of January. Tens of thousands of the army's men are dead or missing, and many of those taken prisoner do not come home.",
    ],
  },
  {
    id: "ita_cities", campaign: "italy", kind: "The home front", anchor: "torchTunisia42",
    from: "1942-10", to: "1943-04", date: "NOVEMBER 1942",
    title: "The Raids on the Northern Cities",
    when: (f, m) => m.initiative <= -2,
    paras: [
      "From October 1942 British bombers cross the Alps by night to Genoa, Turin and Milan, and once by day to Milan. The shelters are few and the fire services small, and the raids fall on the factories and on the old centres of the cities alike.",
      "Hundreds of thousands of people leave the cities for the countryside, sleeping in villages and travelling in to work. The flight from the cities becomes part of daily life in the north.",
    ],
  },
];

/** The state-driven event due on arriving at a report of a European command, as a special dispatch, or null (the same rules as the Pacific's). */
function europeStateEvent(command, campaignId, nextPos, flags, meters) {
  if (PACIFIC_COMMANDS.includes(campaignId)) return null;
  const events = EUROPE_STATE_EVENTS.filter((e) => !e.command || e.command === command);
  let nextDate;
  try {
    nextDate = CAMPAIGNS[campaignId].resolveNode(String(nextPos), flags, meters)?.date;
  } catch (e) {
    nextDate = undefined;
  }
  // A European adviser's resignation is the European special dispatches' business (dueEvent), so it is not offered again here.
  const quiet = Object.fromEntries(Object.entries(flags).filter(([k]) => !k.startsWith("trgone_")));
  const e = dueStateEvent({ campaignId, events, nextDate, flags: quiet, meters });
  if (!e) return null;
  const dateline = String(e.date || "").toLowerCase().replace(/(^|[\s–-])([a-z])/g, (m, s, c) => s + c.toUpperCase());
  return { id: e.id, campaign: e.campaign, kind: e.kind, dateline: e.kind ? `${e.kind}, ${dateline}` : dateline, title: e.title, text: e.paras };
}
