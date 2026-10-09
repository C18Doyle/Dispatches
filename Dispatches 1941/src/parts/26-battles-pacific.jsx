// The Pacific battles that open on the Order of Battle screen. Each entry of KEY_BATTLE_CONFIGS is the `keyBattleSubgame` of the
// choice that hosts it, and the registries in 25-battle-subgame.jsx are filled in below, keyed by the same id. Facts were checked on
// 2026-10-09 against the standard histories (see claims/battles-round1.json); anything modeled and not documented is marked as such.

const KEY_BATTLE_CONFIGS = {
  // ------------------------------------------------------------------------------------------------------------------------
  // Midway, 4 June 1942, from the American side. Hosted by coralSeaMidwayAllied42, "Commit all three available carriers".
  // The win is the strike arriving in the window that mattered. Facts: Station HYPO (Rochefort) read the plan and the date; the
  // first Japanese carriers were reported by a PBY at about 05:34; the carrier strike was launched from about 175 miles at 07:00;
  // the torpedo squadrons attacked first and were destroyed (Torpedo Eight lost all fifteen aircraft and all but one of its crews);
  // the dive bombers of Enterprise and Yorktown arrived at about 10:22 and three carriers burned within five minutes; Hornet's
  // air group missed the enemy; Hiryu hit Yorktown twice that afternoon and was sunk in the evening.
  // ------------------------------------------------------------------------------------------------------------------------
  midwayAllied42: {
    id: "midwayAllied42",
    title: "Order of Battle: Midway",
    flavor:
      "Three carriers, an island and a codebreaking cell have to find four Japanese carriers before the Japanese find them. Nothing is certain except the date: the carrier fleet is reading Nagumo's plan and the Japanese are not reading Nimitz's. How the American air strength is spread across the day decides whether the blow lands in the one window that counts.",
    categories: [
      { id: "dive", name: "Carrier Dive Bombers", meter: "readiness", strand: "trn" },
      { id: "torpedo", name: "Carrier Torpedo Squadrons", meter: "readiness", strand: "flt" },
      { id: "search", name: "Search and Codebreaking", meter: "initiative", strand: "int" },
      { id: "island", name: "Midway's Own Aircraft", meter: "pipeline", strand: "oil" },
    ],
    // Dive bombers first: three carriers were put out of action in five minutes by the two squadrons that arrived together.
    // Search second: the whole battle rests on knowing where the carriers were before they knew. The island's aircraft third, and
    // the torpedo squadrons last on their own terms: they hit nothing, though they drew the fighters down to the sea.
    effectiveness: { dive: 2.4, search: 2.2, island: 1.8, torpedo: 1.5 },
    orderOfBattle: {
      dive: {
        units: [
          "Enterprise's Air Group 6 dive bombers, led by Lieutenant Commander Wade McClusky",
          "Yorktown's Bombing Three and Scouting Three, led by Lieutenant Commander Maxwell Leslie",
          "Hornet's dive bombers and fighters, sent on a course that never met the enemy",
        ],
        real:
          "McClusky followed a lone Japanese destroyer to the carriers and arrived over them at about 10:22, when the Zeros had been pulled down to sea level by the torpedo planes. In five minutes Akagi, Kaga and Soryu were burning. Hornet's air group flew the wrong way and found nothing.",
      },
      torpedo: {
        units: [
          "Torpedo Eight (Hornet), 15 Devastators under Lieutenant Commander John Waldron",
          "Torpedo Six (Enterprise) under Lieutenant Commander Eugene Lindsey",
          "Torpedo Three (Yorktown) under Lieutenant Commander Lance Massey",
        ],
        real:
          "The torpedo squadrons found the carriers first, without fighter escort, and flew in low and slow. Torpedo Eight lost every aircraft and all but one of its crews. Torpedo Six and Torpedo Three lost most of theirs. They scored no hit, and they drew the Zeros down to the water just before the dive bombers arrived.",
      },
      search: {
        units: [
          "Station HYPO at Pearl Harbor under Commander Joseph Rochefort, which read the Japanese plan",
          "PBY Catalinas flying 700-mile searches from Midway",
          "Yorktown's scouting squadron, flying the carriers' own patrols",
        ],
        real:
          "Rochefort's team told Nimitz that the target was Midway, which the Japanese called AF, and gave the date weeks ahead. A PBY found the Japanese carriers at about 05:30 on June 4, so the American carriers knew where the enemy was before the enemy knew they were there.",
      },
      island: {
        units: [
          "Marine Scout Bombing Squadron 241 and Marine Fighting Squadron 221 on Midway",
          "Army B-17 Flying Fortresses and a few B-26 and Avenger torpedo bombers",
          "Navy PBYs on the atoll's seaplane ramp",
        ],
        real:
          "The island's aircraft attacked the Japanese carriers from early morning and hit none of them, and about half were lost. Nagumo had to deal with their attacks and with the need for a second strike on the island, and the argument about what to arm his aircraft with was under way when the American dive bombers arrived.",
      },
    },
    hardRule: {
      text: "Nimitz has ordered the principle of calculated risk: the carriers are not to be exposed to superior force without a good prospect of damaging the enemy, so the strike is to be made together and not piecemeal.",
      lockApproach: "strikeTogether",
    },
    conditions:
      "A fine morning with broken cloud, good for the scouts. The Japanese carriers are 175 miles northwest of the American carriers at the moment the first strike is launched, at the limit of a loaded dive bomber's range.",
    terrainModifiers: { search: 1.1 },
    terrainNotes: { search: "good visibility, broken cloud" },
    decisions: [
      {
        id: "theLaunch",
        time: "0702",
        title: "The launch",
        prompt:
          "Morning on 4 June. A PBY has reported two carriers and their escort 175 miles out. The Japanese have not yet found the American carriers. Spruance can launch everything now, at the edge of the range, with the fighters and bombers sorting themselves out in the air, or close the range first and strike together a little later, with the risk that the Japanese find him in the meantime.",
        options: [
          {
            id: "launchNow",
            name: "Launch the full deck load at once, at extreme range",
            note: "The first blow goes in before the Japanese can launch against the carriers. The squadrons arrive in pieces.",
            bonus: 1,
            bonusByPosture: { caughtRearming: 4, hiddenUnderCloud: -2, fightersAloft: -3 },
            reportLine: "Every aircraft that can fly is launched at once, and the squadrons form up as they climb.",
          },
          {
            id: "closeFirst",
            name: "Close the range before launching",
            note: "A shorter flight and a better chance of striking together, and an hour in which the Japanese may find the carriers first.",
            bonus: 0,
            bonusByPosture: { fightersAloft: 3, hiddenUnderCloud: 2, caughtRearming: -3 },
            reportLine: "The carriers turn toward the enemy and hold their aircraft on deck while the range closes.",
          },
          {
            id: "holdReserve",
            name: "Launch most of the deck, and hold a second wave back",
            note: "Costs weight in the first blow and keeps something in hand if the first goes wrong.",
            bonus: 0,
            bonusByPosture: { hiddenUnderCloud: 3, caughtRearming: -1, fightersAloft: 1 },
            meters: { readiness: -1 },
            costReason: "Aircraft held back from the first blow",
            reportLine: "The first wave goes, and a second wave is kept on deck, fuelled and armed, for whatever the morning shows.",
          },
        ],
      },
    ],
    counterattack: {
      category: "search",
      severity: { caughtRearming: 0, fightersAloft: 2, hiddenUnderCloud: 1 },
      warn: {
        1: "Radar shows a large formation of aircraft approaching Yorktown from the northwest.",
        2: "The Japanese carrier that survived the morning has launched its dive bombers and torpedo planes against the carriers.",
      },
      results: {
        repulsed: "The Japanese attack is met by fighters sent out on the radar warning, and few of its aircraft reach the carrier.",
        heldAtCost: "The carriers survive the Japanese attack, but a carrier is hit, burning and slowed.",
        broke: "Hiryu's aircraft find a carrier and hit her twice. The fires are bad and the ship is dead in the water.",
        gaveGround: "The carriers turn away from the Japanese attack and the fight goes on without them.",
      },
    },
    categoryContext: {
      dive:
        "The dive bombers are the arm that can sink a carrier. Each commitment puts more of them over the target in the one window when the Japanese decks are crowded and their fighters are low.",
      torpedo:
        "The torpedo squadrons are slow and short of fighter escort, and the American torpedo has not been proved. Each commitment sends more of them in low, to draw the Zeros down and make the carriers turn.",
      search:
        "The codebreakers and the scouts decide whether the blow lands where the enemy is. Each commitment puts more patrols over the sea and more men on the decrypts, and keeps the American carriers unseen a little longer.",
      island:
        "Midway's aircraft are the first to meet the enemy. Each commitment sends more of them against the carriers, and keeps more of Nagumo's attention on the island.",
    },
    flashups: {
      dive: [
        "A dive bomber squadron climbs out over the carrier and turns northwest.",
        "McClusky finds a Japanese destroyer steaming north at speed and follows her.",
        "Bombers peel off over the Japanese carriers, with their decks crowded below.",
        "A squadron leader signals the bombers into line astern for the dive.",
        "A Dauntless pulls out of its dive at the water's edge and turns for home.",
      ],
      torpedo: [
        "The Devastators skim the sea toward the carriers with no fighters above them.",
        "A torpedo squadron leader reports the carriers in sight and turns in alone.",
        "Zeros dive from every direction on a squadron of slow torpedo planes.",
        "A torpedo plane drops its torpedo and the weapon runs on out of sight.",
        "The last torpedo plane of a squadron goes into the sea ahead of the carriers.",
      ],
      search: [
        "A PBY reports two carriers, bearing 320 degrees, distance 180 miles.",
        "A scout plane reports the enemy's course and speed in a clear voice.",
        "The decrypts at Pearl Harbor give the time of the Japanese strike on the island.",
        "A second scout reports the Japanese screen and the carriers behind it.",
        "A patrol finds nothing and turns for Midway.",
      ],
      island: [
        "A Marine squadron leaves Midway in the half-light and turns northwest.",
        "The Flying Fortresses bomb from high over the Japanese carriers and score no hit.",
        "A Marine dive bomber attacks a carrier under fire from the Zeros.",
        "A Navy torpedo plane limps back to the airstrip with its crew wounded.",
        "A PBY lands on the lagoon and its crew report the Japanese force.",
      ],
    },
    reportTimes: { open: "0534", contact: "0702", cats: ["0830", "0920", "1022", "1130"], reserve: "1230", counter: "1400" },
    idleLines: {
      dive: [
        "No extra dive bombers are held for the blow. The carriers send the squadrons they have.",
        "The dive bombers are given no more than their regular share of the strike.",
      ],
      torpedo: [
        "No extra torpedo planes are added. The squadrons that go are those already on the decks.",
        "The torpedo squadrons are not asked for more than the plan gave them.",
      ],
      search: [
        "No extra patrols are flown. The search covers the sectors it was given.",
        "The scouts go out on the day's ordinary plan, and the codebreakers are left to their desks.",
      ],
      island: [
        "Midway's aircraft are sent against the carriers on the ordinary plan and no more.",
        "No extra weight is put on the island's aircraft. They fly what they were given.",
      ],
    },
    verdicts: ["The Dive Bombers Arrive in the Window", "The Strike Misses Its Window"],
    verdictGrades: {
      clean:
        "The scouts had the enemy first, the dive bombers arrived together while the Zeros were low, and every part of the American air strength worked on the same morning.",
      costly:
        "The dive bombers got their window and three carriers burned, but the torpedo squadrons, the island and the scouts paid more than the plan allowed for to bring them there.",
      marginal:
        "The blow was struck and the Japanese took heavy losses, but the American air strength arrived in pieces and the morning did not break clean.",
      total:
        "The squadrons arrived late and apart, the scouts lost the enemy, and the carriers were left to fight the Japanese air groups on their own terms.",
    },
  },
};

// ---------------------------------------------------------------------------------------------------------------------------
// Registries for the battles above.
// ---------------------------------------------------------------------------------------------------------------------------

// Commanders: each is tied to the arm of his own documented command (modeled bonus, not a claim about his skill).
KEY_BATTLE_COMMANDERS.midwayAllied42 = [
  { id: "spruance", name: "Rear Admiral Raymond Spruance", role: "Commanding Task Force 16 (Enterprise and Hornet)", category: "dive", note: "He launched the full deck load at extreme range. Effort in Carrier Dive Bombers carries further under him.", reportLine: "Spruance orders the dive bombers launched and keeps the carriers closed up behind them." },
  { id: "rochefort", name: "Commander Joseph Rochefort", role: "Chief of Station HYPO, Pearl Harbor", category: "search", note: "His codebreakers read the plan and the date. Effort in Search and Codebreaking carries further under him.", reportLine: "Rochefort's team has the Japanese plan on the table and gives the carriers their time and place." },
  { id: "simard", name: "Captain Cyril Simard", role: "Commanding Naval Air Station Midway", category: "island", note: "Every aircraft on the atoll is his to fly. Effort in Midway's Own Aircraft carries further under him.", reportLine: "Simard sends everything on the atoll into the air, and keeps the airstrip ready for the survivors." },
  { id: "massey", name: "Lieutenant Commander Lance Massey", role: "Commanding Torpedo Three, Yorktown", category: "torpedo", note: "His squadron goes in with no escort. Effort in Carrier Torpedo Squadrons carries further under him.", reportLine: "Massey leads Torpedo Three in low over the water toward the carriers." },
];

// Approaches: what the carriers do with the strike. Modeled tradeoffs, not two named historical plans (the documented fact is the tension).
KEY_BATTLE_APPROACHES.midwayAllied42 = [
  {
    id: "strikeTogether",
    name: "Strike Together",
    subtitle: "Hold the squadrons to one coordinated blow",
    note: "Wait for the squadrons to form up and go in as a group. Effort in Carrier Dive Bombers and Carrier Torpedo Squadrons carries further; effort in Search and Codebreaking carries less, tied to the carriers' own position.",
    modifiers: { dive: 0.6, torpedo: 0.5, search: -0.4 },
    reportLine: "The squadrons are held until they can go in together.",
  },
  {
    id: "launchAtOnce",
    name: "Launch at Once",
    subtitle: "Send each squadron as soon as it is ready",
    note: "Get the blow in before the enemy can launch against the carriers. Effort in Midway's Own Aircraft and Search and Codebreaking carries further; effort in Carrier Torpedo Squadrons carries less, going in without cover.",
    modifiers: { island: 0.6, search: 0.5, torpedo: -0.5 },
    reportLine: "Each squadron is launched the moment it is ready, and the blow goes in as it arrives.",
  },
];

// Enemy setups: what Nagumo's force is doing when the American blow arrives. The first is the historical one and is drawn twice as often.
KEY_BATTLE_POSTURES.midwayAllied42 = [
  {
    id: "caughtRearming",
    name: "Decks crowded, aircraft being rearmed",
    weight: 2,
    modifiers: { dive: 1.5, torpedo: 0.9, search: 1, island: 0.9 },
    hints: [
      "The Japanese strike on Midway is reported returning to its carriers.",
      "Signals traffic suggests the Japanese are changing their loads and their plans.",
    ],
    reveal: "Contact: the Japanese carriers are crowded with aircraft being rearmed and refuelled, and their strike on the island is landing on.",
  },
  {
    id: "fightersAloft",
    name: "Fighters aloft, decks clear",
    modifiers: { torpedo: 0.5, dive: 0.8, island: 1.2, search: 1 },
    hints: [
      "The carriers' fighters are reported over the Japanese fleet in strength.",
      "A scout reports the Japanese flight decks clear and the fighters circling.",
    ],
    reveal: "Contact: the Japanese fighters are aloft in strength and the flight decks are clear, and nothing gets through to the carriers without a fight.",
  },
  {
    id: "hiddenUnderCloud",
    name: "Carriers screened by cloud",
    modifiers: { search: 1.4, dive: 0.9, torpedo: 0.9, island: 0.8 },
    hints: [
      "A front of low cloud is reported lying over the Japanese approach.",
      "The scouts report broken cloud and poor sightings to the northwest.",
    ],
    reveal: "Contact: the Japanese carriers are under broken cloud, and they are found only by the scouts that stay on them.",
  },
];

KEY_BATTLE_ECHOES.midwayAllied42 = {
  counter: {
    repulsed: "The Japanese attack on the carriers was broken up before it did harm.",
    heldAtCost: "The carriers survived the Japanese attack, but one of them was badly hit.",
    broke: "The Japanese found a carrier and hit her twice, and she was lost.",
    gaveGround: "The carriers turned away from the Japanese attack and left the fight to others.",
  },
  neglected: {
    dive: "There were too few dive bombers over the Japanese carriers to finish the work.",
    torpedo: "The torpedo squadrons barely flew, and the Japanese fighters were never drawn down.",
    search: "The scouts and the codebreakers were left short, and the carriers went on half blind.",
    island: "Midway's aircraft were hardly used, and the island's attacks never drew the Japanese off.",
  },
  commander: {
    spruance: "Spruance is back on his flagship with the day's reports to read.",
    rochefort: "Rochefort has gone back to his desk at Pearl Harbor to read the next day's traffic.",
    simard: "Simard is counting the aircraft that came back to the atoll.",
    massey: "Massey's squadron is a name on a casualty list, and the others flew on.",
  },
};

KEY_BATTLE_TITLES.push({ id: "midwayAllied42", seal: "CINCPAC", title: "Midway" });

// ------------------------------------------------------------------------------------------------------------------------
// The Naval Battle of Guadalcanal, 12-15 November 1942, from the Japanese side. Hosted by guadalcanal42, "Commit destroyers and
// remaining naval air strength to retake Henderson Field". The win is the first outcome, "as close as it did". Facts: Abe's
// bombardment force (Hiei, Kirishima) met Callaghan's cruisers and destroyers on the night of 12-13 November and Hiei was crippled and
// lost the next day; Callaghan and Scott were killed; Mikawa's Suzuya and Maya shelled Henderson on the night of 13-14 November
// for about 35 minutes; aircraft from Henderson and Enterprise sank Kinugasa and, with the battleships' help, seven of Tanaka's
// eleven transports on 14 November; the other four were beached on 15 November and destroyed; about 2,000 of 7,000 troops landed;
// Washington sank Kirishima by radar-directed fire on the night of 14-15 November. See claims/battles-round1.json.
// ------------------------------------------------------------------------------------------------------------------------
KEY_BATTLE_CONFIGS.guadalcanalNaval42 = {
  id: "guadalcanalNaval42",
  title: "Order of Battle: The November Battles off Guadalcanal",
  flavor:
    "Yamamoto has ordered the last great effort to retake Henderson Field. Seven thousand troops are to be landed from eleven transports, and before they come the battleships must wreck the airfield that threatens them. Against that, the Americans have a field they cannot be driven from, a handful of cruisers and destroyers that will fight at point-blank range, and two new battleships with radar fire control. The weight you place across the fleet decides whether the transports reach the beach.",
  categories: [
    { id: "battleline", name: "Bombardment Battleships", meter: "readiness", strand: "flt" },
    { id: "screen", name: "Cruisers and Night Destroyers", meter: "pipeline", strand: "oil" },
    { id: "convoy", name: "Tanaka's Transports", meter: "pipeline", strand: "shp" },
    { id: "air", name: "Air Cover from Rabaul", meter: "readiness", strand: "trn" },
  ],
  effectiveness: { screen: 2.4, battleline: 2.3, convoy: 1.9, air: 1.8 },
  orderOfBattle: {
    battleline: {
      units: [
        "Vice Admiral Hiroaki Abe's bombardment force: the battleships Hiei and Kirishima",
        "Vice Admiral Nobutake Kondo's force for the second attempt, with Kirishima and heavy cruisers",
      ],
      real:
        "Hiei was crippled in the night action of 12 to 13 November and lost the next day to aircraft. Kirishima was sunk on the night of 14 to 15 November by the American battleship Washington, firing by radar at about 8,500 yards. Henderson Field was not put out of action.",
    },
    screen: {
      units: [
        "Vice Admiral Gunichi Mikawa's cruisers, among them Suzuya and Maya, which shelled Henderson Field on the night of 13 to 14 November",
        "The destroyer squadrons, with their long-range oxygen torpedoes and night training",
      ],
      real:
        "At close range on the first night the Japanese sank or crippled American cruisers and destroyers and killed Rear Admirals Callaghan and Scott. The cruisers' bombardment of Henderson lasted about 35 minutes and left the airfield in use, and the next morning the cruiser Kinugasa was sunk by American aircraft.",
    },
    convoy: {
      units: [
        "Rear Admiral Raizo Tanaka's convoy of eleven transports carrying some 7,000 troops",
        "Twelve destroyers as escort",
      ],
      real:
        "Seven transports were sunk by aircraft on 14 November. The four that remained were run aground on Guadalcanal on 15 November and destroyed there. About 2,000 of the 7,000 men were landed, with a fraction of their supplies.",
    },
    air: {
      units: [
        "Aircraft of the 11th Air Fleet at Rabaul, some 650 miles away",
        "Carrier air groups that had lost most of their veteran pilots in the Solomons",
      ],
      real:
        "Rabaul could cover the convoy only at the limit of its fighters' range, and the cover was not enough to stop the American attacks on 14 November. The Japanese lost about 64 aircraft in the four days.",
    },
  },
  hardRule: {
    text: "Combined Fleet has ordered the transports beached on Guadalcanal by dawn on 15 November whatever happens, so the convoy must be run through.",
    lockApproach: "runTheConvoy",
  },
  conditions:
    "Moonless nights and an American force too weak to hold the Slot by day. The transports can only come in at night, and by day they are within reach of Henderson Field's aircraft.",
  terrainModifiers: { screen: 1.1 },
  terrainNotes: { screen: "narrow waters, a dark night and a short range" },
  decisions: [
    {
      id: "theConvoyByDay",
      time: "1330",
      title: "The convoy by day",
      prompt:
        "The first night's bombardment has failed and Hiei is gone. The transports are still at sea, and Henderson Field's aircraft are airborne in the daylight. Tanaka can press on by day with all eleven transports, hold them back for the night and take the delay, or break the convoy into groups and run what he can.",
      options: [
        {
          id: "pressOn",
          name: "Press on by day with all eleven transports",
          note: "The troops land on schedule if the air attacks miss, and the transports are exposed to them for hours.",
          bonus: 0,
          bonusByPosture: { radarCruisers: 2, cactusAirReady: -5, washingtonWaiting: 1 },
          reportLine: "Tanaka orders the transports on at full speed through the afternoon.",
        },
        {
          id: "holdForNight",
          name: "Turn away and run in by night",
          note: "Keeps the transports out of the daylight air attacks, and the schedule slips a day.",
          bonus: 0,
          bonusByPosture: { radarCruisers: -2, cactusAirReady: 3, washingtonWaiting: -1 },
          reportLine: "The convoy turns away to the north to wait for dark.",
        },
        {
          id: "splitTheConvoy",
          name: "Break the convoy up and run it in groups",
          note: "Costs Pipeline in shipping scattered across the sea, and the groups are harder to catch together.",
          bonus: 0,
          bonusByPosture: { washingtonWaiting: 3 },
          meters: { pipeline: -1 },
          costReason: "Shipping scattered and lost in the separate runs",
          reportLine: "The transports split into small groups, each with its own escorts.",
        },
      ],
    },
  ],
  counterattack: {
    category: "convoy",
    severity: { radarCruisers: 0, cactusAirReady: 2, washingtonWaiting: 1 },
    warn: {
      1: "American aircraft are reported over the Slot, flying from Henderson Field.",
      2: "Wave after wave of dive bombers and torpedo planes are attacking the transports in daylight.",
    },
    results: {
      repulsed: "The air attacks are beaten off, and the transports go on toward Guadalcanal with few losses.",
      heldAtCost: "The convoy goes on, but several transports are lost to the air attacks.",
      broke: "The transports are caught in the open and most of them are sunk.",
      gaveGround: "The convoy turns back to the Shortlands, and the landing is put off.",
    },
  },
  categoryContext: {
    battleline:
      "The battleships are the only weapon that can wreck Henderson Field in one night, which is why Yamamoto sent them. Each commitment puts more of the fleet's heavy ships in the bombardment, and puts them in range of the American cruisers.",
    screen:
      "The cruisers and destroyers fight the night action, and their torpedoes and training are the Japanese Navy's best edge. Each commitment sends more of them into the Slot, and costs the fuel they burn doing it.",
    convoy:
      "The transports carry the troops the whole operation exists to land. Each commitment adds more ships to the convoy, and more of the army's strength to land on the first night.",
    air:
      "Aircraft from Rabaul and the carriers can cover the convoy in daylight, but only at the end of their range and with crews who are not the pilots of 1941. Each commitment sends more of them over the Slot.",
  },
  flashups: {
    battleline: [
      "Hiei's lookouts sight the American cruisers in the dark at a range of a few thousand yards.",
      "The bombardment force turns away from Savo Island without firing on the airfield.",
      "A battleship fires a salvo at a cruiser at point-blank range, and the shells go through her without bursting.",
      "Searchlights pick out a Japanese battleship, and the American destroyers close in.",
      "A damaged battleship turns north at slow speed with a rudder jammed.",
    ],
    screen: [
      "A Japanese destroyer launches torpedoes at an American cruiser and turns away in the dark.",
      "Cruisers shell the airfield for a short time and then withdraw.",
      "Two destroyers close at point-blank range and open fire with every gun.",
      "A Japanese destroyer burns on the surface, and her crew abandons ship.",
      "Mikawa's cruisers turn northwest before dawn and leave the airfield behind them.",
    ],
    convoy: [
      "The transports steam down the Slot in line with the destroyers around them.",
      "Tanaka signals the convoy to hold its speed and its formation.",
      "A transport is set on fire, and her troops take to the boats.",
      "The four surviving transports turn in toward the beach at Tassafaronga.",
      "Men and boxes of supplies are unloaded as fast as the crews can work.",
    ],
    air: [
      "Zeros leave Rabaul before dawn for the long flight to the Slot.",
      "A formation of fighters circles over the convoy for twenty minutes and turns back.",
      "A bomber leaves Rabaul to attack the American ships off Guadalcanal.",
      "A fighter pilot reports the American dive bombers coming in from the south.",
      "The cover is short of fuel and leaves the convoy to the American aircraft.",
    ],
  },
  reportTimes: { open: "2230", contact: "0120", cats: ["0200", "0630", "1100", "1500"], reserve: "1900", counter: "2300" },
  idleLines: {
    battleline: [
      "The battleships are held back. Henderson Field is not shelled.",
      "No more heavy ships are sent in, and the airfield flies its aircraft in the morning.",
    ],
    screen: [
      "The night destroyers are kept in reserve and the cruisers do not go in.",
      "No more of the screen is committed, and the Slot is left to the Americans.",
    ],
    convoy: [
      "No more transports are sent, and the troops stay on the Shortlands.",
      "The convoy goes with the ships it has, and the army lands what it can.",
    ],
    air: [
      "No extra aircraft are sent from Rabaul, and the convoy is left to its own guns.",
      "The cover is kept at its usual strength, and the American aircraft get through.",
    ],
  },
  verdicts: ["The Battle Goes As Close As It Did", "The Convoy Is Caught Cold"],
  verdictGrades: {
    clean:
      "The battleships, the destroyers, the transports and the air cover all worked together, and the fight over Henderson Field stayed as close as the commanders had hoped.",
    costly:
      "The battle was kept in the balance, but the heavy ships, the destroyers and the convoy paid more than the plan had allowed for.",
    marginal:
      "The Japanese fleet fought well and lost, mostly to the odds, and the transports were left to the American aircraft.",
    total:
      "The fleet's arms fought separate battles, the cover failed, and the transports were destroyed with little of what they carried landed.",
  },
};

KEY_BATTLE_COMMANDERS.guadalcanalNaval42 = [
  { id: "abe", name: "Vice Admiral Hiroaki Abe", role: "Commanding the bombardment force", category: "battleline", note: "He led Hiei and Kirishima down the Slot on the night of 12 November. Effort in Bombardment Battleships carries further under him.", reportLine: "Abe takes the battleships down the Slot toward Savo Island." },
  { id: "mikawa", name: "Vice Admiral Gunichi Mikawa", role: "Commanding the Eighth Fleet's cruisers", category: "screen", note: "His cruisers shelled Henderson Field on the night of 13 November. Effort in Cruisers and Night Destroyers carries further under him.", reportLine: "Mikawa's cruisers close the island and open fire on the airfield." },
  { id: "tanaka", name: "Rear Admiral Raizo Tanaka", role: "Commanding the reinforcement convoy", category: "convoy", note: "He ran the destroyer supply runs down the Slot all autumn. Effort in Tanaka's Transports carries further under him.", reportLine: "Tanaka keeps the transports in formation and holds course for Tassafaronga." },
  { id: "kusaka", name: "Vice Admiral Jinichi Kusaka", role: "Commanding the 11th Air Fleet, Rabaul", category: "air", note: "The aircraft at Rabaul are his to send. Effort in Air Cover from Rabaul carries further under him.", reportLine: "Kusaka sends every aircraft at Rabaul that has the range to reach the convoy." },
];

KEY_BATTLE_APPROACHES.guadalcanalNaval42 = [
  {
    id: "silenceHenderson",
    name: "Silence Henderson First",
    subtitle: "Bombard the airfield, then bring the transports in behind it",
    note: "Wreck the airfield on the night before the troops land. Effort in Bombardment Battleships and Cruisers and Night Destroyers carries further; effort in Tanaka's Transports carries less, the convoy waiting on the result.",
    modifiers: { battleline: 0.6, screen: 0.5, convoy: -0.5 },
    reportLine: "The battleships go in first, and the transports wait behind them.",
  },
  {
    id: "runTheConvoy",
    name: "Run the Convoy Through",
    subtitle: "Send the transports in whether or not the airfield is silenced",
    note: "Get the troops ashore on schedule. Effort in Tanaka's Transports and Air Cover from Rabaul carries further; effort in Bombardment Battleships carries less, the battleships not shielding the convoy.",
    modifiers: { convoy: 0.6, air: 0.5, battleline: -0.5 },
    reportLine: "The transports are sent in on schedule, with whatever cover can be found.",
  },
];

KEY_BATTLE_POSTURES.guadalcanalNaval42 = [
  {
    id: "radarCruisers",
    name: "American cruisers and destroyers meet the bombardment force",
    weight: 2,
    modifiers: { screen: 1.4, battleline: 0.8, convoy: 1, air: 0.9 },
    hints: [
      "Coastwatchers report American cruisers and destroyers leaving Espiritu Santo for the Solomons.",
      "A reconnaissance aircraft reports a column of American cruisers southeast of Guadalcanal.",
    ],
    reveal: "Contact: a small column of American cruisers and destroyers is waiting at the entrance to the Sound, and the fight will be at point-blank range.",
  },
  {
    id: "cactusAirReady",
    name: "The airfield's aircraft are intact and ready",
    modifiers: { air: 0.8, convoy: 0.6, battleline: 1.1, screen: 1 },
    hints: [
      "Reports speak of American aircraft arriving at Henderson Field in numbers.",
      "A carrier is reported south of Guadalcanal, within range of the Slot.",
    ],
    reveal: "Contact: the airfield's aircraft are in the air at first light, with the carrier's aircraft in support, and the transports are the target.",
  },
  {
    id: "washingtonWaiting",
    name: "American battleships wait in the dark",
    modifiers: { battleline: 0.7, screen: 1, convoy: 1.1, air: 1.2 },
    hints: [
      "Intelligence reports two American battleships have left the carrier screen.",
      "The radio traffic suggests a heavy American force is close to the Sound.",
    ],
    reveal: "Contact: two American battleships with radar are waiting in the dark, and the heavy ships are the targets.",
  },
];

KEY_BATTLE_ECHOES.guadalcanalNaval42 = {
  counter: {
    repulsed: "The air attacks on the convoy were beaten off, and the transports reached the island.",
    heldAtCost: "The convoy went on after the air attacks, but several transports did not arrive.",
    broke: "The transports were caught in daylight, and most of them were sunk.",
    gaveGround: "The convoy turned back to the Shortlands, and the landing was put off.",
  },
  neglected: {
    battleline: "The battleships were barely used, and the airfield flew on untouched.",
    screen: "The cruisers and destroyers were held back, and the night belonged to the Americans.",
    convoy: "Too few transports were sent, and the army landed with little of its strength.",
    air: "The cover from Rabaul was thin, and the convoy was open to the American aircraft.",
  },
  commander: {
    abe: "Abe's battleship is on the bottom, and he has been relieved of command.",
    mikawa: "Mikawa's cruisers are back at Rabaul, and the airfield they shelled is flying aircraft.",
    tanaka: "Tanaka is back at the Shortlands with the destroyers that came through.",
    kusaka: "Kusaka's aircraft crews at Rabaul are counting the losses of the four days.",
  },
};
KEY_BATTLE_TITLES.push({ id: "guadalcanalNaval42", seal: "IGHQ", title: "The November Battles off Guadalcanal" });

// ------------------------------------------------------------------------------------------------------------------------
// The Battle of the Philippine Sea, 19-20 June 1944, from the American side. Hosted by philippineSeaAllied44, "Release the carriers
// for an aggressive pursuit" (a modeled alternative to Spruance's choice; the real battle was fought partly in these terms).
// Facts: Flying Fish sighted the Japanese fleet leaving the Philippines on 15 June, Seahorse tracked it on the 16th; on 19 June TF 58
// destroyed hundreds of Japanese aircraft ("the Turkey Shoot"); Albacore sank Taiho and Cavalla sank Shokaku that day; on 20 June
// Mitscher launched an evening strike at long range, sank Hiyo, and ordered the ships' lights turned on for the return in the dark;
// about 80 aircraft were lost on the return. See claims/battles-round1.json.
// ------------------------------------------------------------------------------------------------------------------------
KEY_BATTLE_CONFIGS.philippineSea44 = {
  id: "philippineSea44",
  title: "Order of Battle: The Philippine Sea",
  flavor:
    "Ozawa's Mobile Fleet is west of Saipan with nine carriers, and its aircraft can outrange Mitscher's. Spruance's orders are to protect the landing. Mitscher wants to go and find the fleet, and finish it. How the American strength is spread among the carriers' air groups, the submarines and the search, the battle line and the fleet's own oil decides whether the pursuit finds the enemy and what it costs to bring the aircraft home.",
  categories: [
    { id: "air", name: "Carrier Air Groups", meter: "readiness", strand: "trn" },
    { id: "subs", name: "Submarines and Search", meter: "initiative", strand: "int" },
    { id: "train", name: "Fleet Train and Tankers", meter: "pipeline", strand: "oil" },
    { id: "battleline", name: "Battle Line and Screen", meter: "readiness", strand: "flt" },
  ],
  effectiveness: { air: 2.4, subs: 2.1, train: 2.0, battleline: 1.7 },
  orderOfBattle: {
    air: {
      units: [
        "Task Force 58 under Vice Admiral Marc Mitscher: fifteen carriers in four task groups",
        "Hellcat fighters, Helldiver dive bombers and Avenger torpedo planes, many with new radar-fuzed ordnance and trained crews",
      ],
      real:
        "On 19 June the carriers' fighters, guided by radar, shot down hundreds of Japanese aircraft. Across the two days Japan lost an estimated 550 to 645 aircraft to about 123 American, and Japanese carrier aviation never recovered. About 80 American aircraft were lost on the dark return of 20 June.",
    },
    subs: {
      units: [
        "Pacific Fleet submarines under Vice Admiral Charles Lockwood, among them Flying Fish, Seahorse, Albacore and Cavalla",
        "Search aircraft flown from the carriers and from Saipan's captured fields",
      ],
      real:
        "Flying Fish sighted the Japanese fleet leaving the Philippines on 15 June and Seahorse followed it. On 19 June Albacore sank the carrier Taiho and Cavalla sank Shokaku. The Japanese carrier groups were sighted late on 20 June, at the limit of the strike aircraft's range.",
    },
    train: {
      units: [
        "The Service Force's fast oilers under Vice Admiral William Calhoun",
        "Escort carriers, which carried replacement aircraft to the fleet",
      ],
      real:
        "The fast carrier force had to refuel on the move and replace its aircraft from the fleet train. The pursuit on 20 June was made at the end of the aircraft's fuel, and the return in darkness was far from the oilers.",
    },
    battleline: {
      units: [
        "Task Group 58.7 under Vice Admiral Willis Lee: seven fast battleships and cruisers and destroyers in a line west of the carriers",
        "Destroyers that picked up pilots from the sea after the dark return",
      ],
      real:
        "Lee's battleships were stationed west of the carriers on 19 June, but the Japanese raids were broken up mostly by fighters before they reached the ships. After the return on 20 June, the destroyers combed the sea for days for ditched crews and rescued most of them.",
    },
  },
  hardRule: {
    text: "Nimitz's orders to Spruance put the Saipan landing first, so the fleet is to stay within reach of it and not be drawn away.",
    lockApproach: "holdTheLine",
  },
  conditions:
    "A fine summer day with good visibility and a light wind from the east, and a sea in which the carriers can turn into the wind to launch and land. The Japanese fleet is more than two hundred miles to the west.",
  terrainModifiers: { air: 1.05 },
  terrainNotes: { air: "good visibility and a light wind" },
  decisions: [
    {
      id: "eveningStrike",
      time: "1615",
      title: "The evening strike",
      prompt:
        "Late on 20 June a search plane has found the Japanese carriers at long range. It is nearly dark, and a strike launched now will have to come home in the dark with little fuel to spare. Mitscher can launch everything at once, hold the aircraft for the morning, or launch a smaller strike and prepare to light the ships for the return.",
      options: [
        {
          id: "launchAtRange",
          name: "Launch everything now, at the limit of the range",
          note: "The Japanese ships are hit before they get away, and the return is made in the dark.",
          bonus: 0,
          bonusByPosture: { ozawaWithdrawing: 4, mobileFleetAttacks: 0, guamShuttle: -2 },
          reportLine: "Every available aircraft is launched into the sunset.",
        },
        {
          id: "holdForMorning",
          name: "Hold the aircraft and search again at dawn",
          note: "Keeps the aircraft and their crews, and Ozawa is further away by then.",
          bonus: 0,
          bonusByPosture: { ozawaWithdrawing: -3, mobileFleetAttacks: 3, guamShuttle: 2 },
          reportLine: "The carriers hold their aircraft on deck as the light fails.",
        },
        {
          id: "smallStrikeLights",
          name: "Launch a smaller strike and plan to light the ships for the return",
          note: "Costs Readiness in the aircraft that will not be recovered, and the crews have a chance of finding the ships.",
          bonus: 0,
          bonusByPosture: { guamShuttle: 4 },
          meters: { readiness: -1 },
          costReason: "Aircraft lost on the dark return",
          reportLine: "A reduced strike is launched, and the ships are told to show their lights when it returns.",
        },
      ],
    },
  ],
  counterattack: {
    category: "battleline",
    severity: { mobileFleetAttacks: 2, ozawaWithdrawing: 0, guamShuttle: 1 },
    warn: {
      1: "Radar shows large formations of aircraft approaching from the west.",
      2: "Several large raids are coming in at once, and the fighters are running short of fuel.",
    },
    results: {
      repulsed: "The Japanese raids are broken up well short of the fleet, and few aircraft reach the ships.",
      heldAtCost: "The fleet is not hit hard, but the battleships are attacked and a ship is damaged.",
      broke: "Several raids get through, and a carrier and a battleship are hit.",
      gaveGround: "The fleet turns east to keep the raids away from the carriers, and the pursuit loses a day.",
    },
  },
  categoryContext: {
    air:
      "The carriers' air groups can destroy a fleet and defend one. Each commitment puts more fighters and bombers into the pursuit, and uses more of the fuel they will need for the return.",
    subs:
      "The submarines and the search tell the carriers where the Japanese are and sometimes sink them. Each commitment puts more boats and scouts on the Japanese track, and keeps the American carriers a little better informed.",
    train:
      "The oilers keep the carriers moving fast enough to run down the Japanese and to launch aircraft into the wind. Each commitment puts more tankers close to the fleet, and takes them away from the other fleets that need them.",
    battleline:
      "The battleships and their screen guard the carriers against raids and rescue the aircrews that go into the sea. Each commitment puts more of them between the Japanese and the American carriers.",
  },
  flashups: {
    air: [
      "Hellcats climb out of the carriers and form into division after division.",
      "A radar controller sends a division of fighters to meet an incoming raid.",
      "Helldivers go in on a Japanese carrier and the Japanese fighters are few.",
      "Avengers drop their torpedoes at long range on a carrier in the dusk.",
      "A pilot short of fuel makes his approach to the nearest carrier in the dark.",
    ],
    subs: [
      "A submarine reports the Japanese fleet leaving the Philippines.",
      "Albacore fires a spread of torpedoes at a Japanese carrier.",
      "Cavalla fires on a carrier at close range and holds it in her sights.",
      "A search plane reports the Japanese fleet at the limit of its range.",
      "A submarine surfaces at night and radios the enemy's course.",
    ],
    train: [
      "A fast oiler comes alongside a carrier and the hoses are passed across.",
      "The fleet turns into the wind to launch and the ships' speed climbs.",
      "An oiler turns back to Eniwetok for the next load.",
      "The fleet runs west at twenty-three knots, burning oil.",
      "A destroyer is refuelled in the dusk and returns to her station.",
    ],
    battleline: [
      "Lee's battleships form a line ahead of the carriers with the sun behind them.",
      "Anti-aircraft fire fills the sky above the fleet and a Japanese bomber falls.",
      "A destroyer picks a pilot out of the sea.",
      "The ships turn on their lights, and searchlights and star shells light the horizon.",
      "A battleship opens fire on a low-flying torpedo plane.",
    ],
  },
  reportTimes: { open: "0600", contact: "1000", cats: ["1115", "1330", "1615", "1900"], reserve: "2030", counter: "2200" },
  idleLines: {
    air: [
      "No extra air groups are committed, and the strike goes with what it has.",
      "The carriers hold their reserves on deck.",
    ],
    subs: [
      "No extra submarines are sent on the Japanese track, and the search flies its usual sectors.",
      "The submarines are left on their stations, with no new orders.",
    ],
    train: [
      "No more tankers are sent to the fleet, and the ships run on what they carry.",
      "The oilers stay at Eniwetok.",
    ],
    battleline: [
      "The battle line is kept at its usual strength, and the carriers are covered as before.",
      "No extra ships are put on the screen, and the rescue destroyers are few.",
    ],
  },
  verdicts: ["The Pursuit Catches the Fleet", "The Pursuit Comes Up Empty"],
  verdictGrades: {
    clean:
      "The submarines found the fleet, the air groups reached it with fuel to spare, and the oilers and the battle line kept the carriers fighting and the aircrews alive.",
    costly:
      "The pursuit caught the Japanese carriers, but the aircraft, the oilers and the screen paid more than the plan allowed for.",
    marginal:
      "The pursuit was well planned and the Japanese fleet got away, and the fault lay with the distance and the odds.",
    total:
      "The strike left too late and too weak, the fleet ran short of oil, and the aircraft returned in the dark to ships that had little to give them.",
  },
};

KEY_BATTLE_COMMANDERS.philippineSea44 = [
  { id: "mitscher", name: "Vice Admiral Marc Mitscher", role: "Commanding Task Force 58", category: "air", note: "He launched the strike on the evening of 20 June at long range and ordered the lights turned on for its return. Effort in Carrier Air Groups carries further under him.", reportLine: "Mitscher orders the air groups launched and keeps the carriers steaming west." },
  { id: "lockwood", name: "Vice Admiral Charles Lockwood", role: "Commanding the Pacific Fleet's submarines", category: "subs", note: "His boats shadowed the Japanese fleet and sank two of its carriers. Effort in Submarines and Search carries further under him.", reportLine: "Lockwood's boats hold the Japanese track and radio each change of course." },
  { id: "calhoun", name: "Vice Admiral William Calhoun", role: "Commanding the Service Force, Pacific Fleet", category: "train", note: "The fast oilers and the replacement aircraft were his to send. Effort in Fleet Train and Tankers carries further under him.", reportLine: "Calhoun's oilers keep pace with the fleet and top up the destroyers." },
  { id: "lee", name: "Vice Admiral Willis Lee", role: "Commanding Task Group 58.7, the battle line", category: "battleline", note: "His seven fast battleships formed the line west of the carriers. Effort in Battle Line and Screen carries further under him.", reportLine: "Lee holds the battleships in line ahead of the carriers." },
];

KEY_BATTLE_APPROACHES.philippineSea44 = [
  {
    id: "closeTheRange",
    name: "Close the Range",
    subtitle: "Steam west at speed to bring the Japanese within strike range",
    note: "Go after the Japanese fleet and bring it within reach of the strike aircraft. Effort in Carrier Air Groups and Submarines and Search carries further; effort in Fleet Train and Tankers carries less, the fleet burning oil faster than the tankers can bring it.",
    modifiers: { air: 0.6, subs: 0.5, train: -0.5 },
    reportLine: "The fleet turns west at high speed and the oilers follow.",
  },
  {
    id: "holdTheLine",
    name: "Hold the Line West of Saipan",
    subtitle: "Keep the fleet between the Japanese and the landing",
    note: "Let the Japanese come to the fleet. Effort in Battle Line and Screen and Fleet Train and Tankers carries further; effort in Carrier Air Groups carries less, the carriers staying near the transports.",
    modifiers: { battleline: 0.6, train: 0.5, air: -0.5 },
    reportLine: "The fleet holds its station west of Saipan and waits for the Japanese to come.",
  },
];

KEY_BATTLE_POSTURES.philippineSea44 = [
  {
    id: "mobileFleetAttacks",
    name: "The Mobile Fleet launches its raids",
    weight: 2,
    modifiers: { air: 1.4, battleline: 1.1, subs: 1, train: 0.9 },
    hints: [
      "Radio intelligence suggests the Japanese are about to launch from long range.",
      "Search planes report the Japanese carriers turning into the wind.",
    ],
    reveal: "Contact: the Japanese carriers are launching raids at long range, and the American fighters have time to climb to meet them.",
  },
  {
    id: "ozawaWithdrawing",
    name: "Ozawa breaks off and withdraws",
    modifiers: { air: 0.8, subs: 1.2, train: 0.7, battleline: 0.8 },
    hints: [
      "The Japanese carriers have turned to the northwest and increased speed.",
      "Submarine reports show the Japanese fleet moving away from the American track.",
    ],
    reveal: "Contact: the Japanese fleet is withdrawing at speed and the pursuit is a stern chase.",
  },
  {
    id: "guamShuttle",
    name: "The Japanese use the airfields on Guam",
    modifiers: { air: 0.9, battleline: 1.3, subs: 1, train: 1 },
    hints: [
      "Reports show many Japanese aircraft on Guam.",
      "Radar shows aircraft flying from Guam toward the American fleet.",
    ],
    reveal: "Contact: Japanese aircraft are flying from Guam as well as from the carriers, and the screen is under attack from two directions.",
  },
];

KEY_BATTLE_ECHOES.philippineSea44 = {
  counter: {
    repulsed: "The Japanese raids were broken up before they reached the fleet.",
    heldAtCost: "The fleet was not badly hit, but one of its ships was damaged.",
    broke: "Several raids got through and a carrier and a battleship were hit.",
    gaveGround: "The fleet turned east to cover the carriers, and the pursuit lost a day.",
  },
  neglected: {
    air: "Too few air groups were sent against the Japanese, and the strike was weak.",
    subs: "The submarines and the search were left short, and the fleet was slow to find the enemy.",
    train: "The oilers were left behind, and the fleet ran short of fuel on the chase.",
    battleline: "The battle line was thin, and the raids and the dark return cost more ships and men.",
  },
  commander: {
    mitscher: "Mitscher is on his flagship counting the aircraft that came back.",
    lockwood: "Lockwood's submarines are back on patrol with the carriers they sank on the record.",
    calhoun: "Calhoun's oilers are back at Eniwetok, loading for the next sortie.",
    lee: "Lee is at the head of the battle line with the fleet still around him.",
  },
};
KEY_BATTLE_TITLES.push({ id: "philippineSea44", seal: "CINCPAC", title: "The Philippine Sea" });
