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
          Special dispatch
        </h1>
        <div className="wire-tear" style={{ "--wire-paper": paperTint }}></div>
        <div className="px-5 py-5" style={{ backgroundColor: paperTint }}>
          <div className="pb-2 mb-3" style={{ borderBottom: `2px solid ${campaign.accent}`, fontFamily: "'IBM Plex Mono', monospace" }}>
            <div className="text-xs font-bold tracking-[0.16em]" style={{ color: campaign.accent }}>
              SPECIAL DISPATCH
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
            {event.source ? `For the record: ${event.source}` : "Nothing in this dispatch changes a meter."}
          </div>
        </div>
        <div className="wire-tear wire-tear-bottom" style={{ "--wire-paper": paperTint }}></div>
        <button
          onClick={onContinue}
          className="w-full border-2 mt-4 px-4 py-3 text-sm uppercase tracking-[0.2em] font-bold transition-colors duration-150"
          style={{ borderColor: campaign.accent, color: campaign.accent, fontFamily: "'IBM Plex Mono', monospace", background: paperTint }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

