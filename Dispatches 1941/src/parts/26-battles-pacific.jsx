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

// ------------------------------------------------------------------------------------------------------------------------
// Operation Watchtower, 7-9 August 1942, from the American side. Hosted by guadalcanalAllied42, "Land the Marines immediately".
// The win is the beachhead holding with what was landed. Facts (see claims/battles-round2.json, mostly marked unchecked until the
// fact-check pass): the 1st Marine Division under Major General Alexander Vandegrift landed on Guadalcanal and Tulagi on 7 August;
// Tulagi, Gavutu and Tanambogo were taken against a hard defense in two days; the unfinished airfield on Guadalcanal was taken on 8
// August against almost no opposition and renamed Henderson Field; Fletcher's three carriers gave air cover for two days and he
// withdrew them on the evening of 8 August; Rear Admiral Richmond Kelly Turner took the transports out on 9 August with much of the
// cargo still aboard; Rabaul's bombers raided on both days.
// ------------------------------------------------------------------------------------------------------------------------
KEY_BATTLE_CONFIGS.watchtowerAllied42 = {
  id: "watchtowerAllied42",
  title: "Order of Battle: Watchtower",
  flavor:
    "The first American offensive of the war goes ashore on two islands in the Solomons with a Marine division that has never fought, a fleet that is meant to leave after two days, and an airfield the Japanese have almost finished. The Rabaul bombers are four hundred miles away. How the effort is spread between the landing force, the carriers, the unloading of the ships and the coastwatchers decides how much of the division's food and ammunition is on the beach when the fleet sails.",
  categories: [
    { id: "landing", name: "The Marine Landing Force", meter: "readiness", strand: "trn" },
    { id: "carriers", name: "Carrier Air Cover", meter: "readiness", strand: "flt" },
    { id: "unload", name: "Transports and Unloading", meter: "pipeline", strand: "shp" },
    { id: "watch", name: "Coastwatchers and Search", meter: "initiative", strand: "int" },
  ],
  // The landing first, because the whole operation exists to put the division ashore. The carriers second: they are the only air
  // cover and they are leaving. Unloading third, and the watchers last, though they bought the carriers' fighters time to climb.
  effectiveness: { landing: 2.3, carriers: 2.2, unload: 2.0, watch: 1.8 },
  orderOfBattle: {
    landing: {
      units: [
        "The 1st Marine Division under Major General Alexander Vandegrift, landing on Guadalcanal",
        "The 1st Raider Battalion and the 1st Parachute Battalion, landing on Tulagi, Gavutu and Tanambogo",
      ],
      real:
        "The Marines took Tulagi, Gavutu and Tanambogo against a determined garrison in two days, and walked onto the unfinished airfield on Guadalcanal on 8 August almost unopposed: the Japanese there were mostly construction troops and had gone west into the jungle.",
    },
    carriers: {
      units: [
        "Task Force 61 under Vice Admiral Frank Jack Fletcher: the carriers Saratoga, Enterprise and Wasp",
        "Their Wildcat fighters, Dauntless dive bombers and Avenger torpedo planes",
      ],
      real:
        "The carriers kept station south of Guadalcanal for two days and their fighters met the Rabaul raids, with the loss of about twenty aircraft. On the evening of 8 August Fletcher asked leave to withdraw, citing fuel and the risk to his carriers, and the transports lost their air cover.",
    },
    unload: {
      units: [
        "Rear Admiral Richmond Kelly Turner's amphibious force: the transports and cargo ships of the landing",
        "The Marine shore parties and the naval beach battalion on the Guadalcanal beaches",
      ],
      real:
        "Unloading was slower than planned and the beach was jammed with stores. Turner took the transports out on 9 August, after the night action off Savo Island, with a part of the cargo and heavy equipment still aboard, and the Marines went on short rations.",
    },
    watch: {
      units: [
        "The coastwatchers of the Allied Intelligence Bureau, reporting from Bougainville and New Georgia",
        "Catalina flying boats and Australian search aircraft flying from Espiritu Santo and Australia",
      ],
      real:
        "The coastwatchers reported the Rabaul bombers as they passed, which gave the carriers' fighters time to climb. The sightings of Mikawa's cruisers on 8 August did not reach Turner in a form he could act on before dark.",
    },
  },
  hardRule: {
    text: "Orders from Pearl Harbor fix the carriers to a stay of two days, so the airfield must be taken and the landing pushed ashore at once.",
    lockApproach: "takeAirfield",
  },
  conditions:
    "A tropical morning with a light sea and a low overcast that comes and goes. The Japanese know nothing of the landing until the naval guns open fire, and Rabaul's bombers are four hundred miles away.",
  terrainModifiers: { landing: 1.1 },
  terrainNotes: { landing: "open beaches and a coastal plain, with the airfield close behind" },
  decisions: [
    {
      id: "theCarriersLeave",
      time: "1800",
      title: "The carriers' withdrawal",
      prompt:
        "Evening on 8 August. The carriers have flown for two days and have lost a number of their fighters, and Fletcher wants to take them south before the Japanese find them. The transports are not unloaded. Turner needs another day. Fletcher can withdraw as planned, keep the carriers on station for another day with the fuel that costs, or leave and keep the transports unloading through the night under the cruiser screen.",
      options: [
        {
          id: "withdrawAsPlanned",
          name: "Withdraw the carriers as planned",
          note: "The carriers are kept out of range of the Japanese and the transports lose their air cover.",
          bonus: 0,
          bonusByPosture: { raidsFromRabaul: -3, jungleRetreat: 2, tulagiHolds: 0 },
          reportLine: "The carriers turn south in the evening and the transports are left to the cruiser screen.",
        },
        {
          id: "keepCarriers",
          name: "Keep the carriers on station for another day",
          note: "The transports keep their air cover through the next day's raids. The carriers burn fuel they will need later.",
          bonus: 1,
          bonusByPosture: { raidsFromRabaul: 4, tulagiHolds: 2, jungleRetreat: -1 },
          meters: { pipeline: -1 },
          costReason: "Fleet oil burned keeping the carriers on station",
          reportLine: "Fletcher holds the carriers south of the island for one more day.",
        },
        {
          id: "unloadByNight",
          name: "Unload through the night under the cruiser screen",
          note: "More of the cargo reaches the beach. The ships are exposed to a night attack.",
          bonus: 0,
          bonusByPosture: { jungleRetreat: 3, tulagiHolds: 1 },
          severity: 1,
          reportLine: "The transports keep their lights down and the boats run to the beach all night.",
        },
      ],
    },
  ],
  counterattack: {
    category: "carriers",
    severity: { raidsFromRabaul: 2, tulagiHolds: 0, jungleRetreat: 1 },
    warn: {
      1: "A coastwatcher on Bougainville reports a large formation of twin-engined bombers heading southeast.",
      2: "The bombers are over the Sound in two waves, with fighters above them.",
    },
    results: {
      repulsed: "The raids are met by Wildcats and the ships' guns, and few bombers reach the transports.",
      heldAtCost: "The raids get through to the transports, and one ship is hit and set on fire.",
      broke: "The raids break through the fighters and the transports are bombed and torpedoed at anchor.",
      gaveGround: "The transports weigh anchor and stand out to sea, and the unloading stops for the day.",
    },
  },
  categoryContext: {
    landing:
      "The Marines are the reason for the whole operation. Each commitment puts more of the division on the beaches in the first hours, against two islands with different garrisons and an airfield that has to be taken before it flies.",
    carriers:
      "The three carriers are the only air cover for the landing and they have orders to leave. Each commitment puts more fighters over the beaches and the transports, and burns more of the fleet's oil.",
    unload:
      "The transports carry the division's food, ammunition and heavy equipment, and they cannot stay. Each commitment puts more boats and shore parties on the work, and gets more of the cargo ashore before the ships sail.",
    watch:
      "The coastwatchers and the search planes tell the fleet what is coming from Rabaul and from the Slot. Each commitment puts more patrols in the air and more reports on the radio, and gives the fleet more time to act.",
  },
  flashups: {
    landing: [
      "The first boats ground on the beach east of the Lunga River without a shot fired at them.",
      "A Marine rifle company moves inland through the coconut groves toward the airfield.",
      "The Raiders go ashore on Tulagi and meet fire from caves in the ridge.",
      "A Marine battalion crosses the Tenaru River and finds the Japanese camp deserted.",
      "Marines on Gavutu are pinned down on the beach by fire from the hill.",
    ],
    carriers: [
      "Wildcats climb from Wasp and form up over the transports.",
      "A fighter director sends a division of Wildcats to meet a raid reported from the northwest.",
      "Dive bombers from Enterprise strike the Japanese position on Tulagi.",
      "A Wildcat is lost in the dusk and the pilot is picked up by a destroyer.",
      "The carriers turn into the wind and launch the day's patrols.",
    ],
    unload: [
      "Landing craft run in to the beach in a steady line with ammunition and rations.",
      "A pile of stores on the beach grows faster than the working parties can move it.",
      "A transport hoists out a cargo of vehicles and the boats take them in.",
      "Marines unload crates in the dark by the light of shaded lamps.",
      "The shore party reports that the beach cannot take more cargo than it is taking.",
    ],
    watch: [
      "A coastwatcher on Bougainville reports aircraft heading southeast.",
      "A Catalina reports a column of ships east of New Ireland.",
      "A coastwatcher on New Georgia reports a formation of bombers passing overhead.",
      "A patrol aircraft returns with nothing to report from its sector.",
      "A search plane sights ships near Savo Island and sends its report by radio.",
    ],
  },
  reportTimes: { open: "0613", contact: "0910", cats: ["1100", "1300", "1630", "1800"], reserve: "2100", counter: "2330" },
  idleLines: {
    landing: [
      "No more of the division is sent in on the first day, and the beachhead is thin.",
      "The Marines land with what the plan gave them and no more.",
    ],
    carriers: [
      "The carriers fly their regular patrols and no extra fighters are sent to the beaches.",
      "No extra air cover is added, and the transports rely on the ships' own guns.",
    ],
    unload: [
      "The transports unload at the pace the boats allow and no faster.",
      "No extra working parties are put on the beach, and the cargo comes ashore slowly.",
    ],
    watch: [
      "The search covers the sectors it was given, and the coastwatchers report what they happen to see.",
      "No extra patrols are flown and the fleet waits for reports to come in.",
    ],
  },
  verdicts: ["The Beachhead Holds", "The Beachhead Is Left Short"],
  verdictGrades: {
    clean:
      "The Marines took the airfield, the carriers covered the transports through the raids, the cargo came ashore, and the coastwatchers gave the warning each time.",
    costly:
      "The beachhead held and the airfield was taken, but the carriers, the transports and the fleet's oil paid more than the plan allowed for.",
    marginal:
      "The airfield was taken and the Marines held it, but the landing was thin, the cargo was short and the air cover was too brief.",
    total:
      "The landing force, the carriers and the transports each worked alone, and the division was ashore with too little of everything.",
  },
};

KEY_BATTLE_COMMANDERS.watchtowerAllied42 = [
  { id: "vandegrift", name: "Major General Alexander Vandegrift", role: "Commanding the 1st Marine Division", category: "landing", note: "He took the division ashore on Guadalcanal and Tulagi. Effort in the Marine Landing Force carries further under him.", reportLine: "Vandegrift sends the first battalions ashore and moves his headquarters to the beach." },
  { id: "fletcher", name: "Vice Admiral Frank Jack Fletcher", role: "Commanding Task Force 61 and the expeditionary force", category: "carriers", note: "The three carriers were his to keep or to withdraw. Effort in Carrier Air Cover carries further under him.", reportLine: "Fletcher keeps the carriers south of the island and flies the patrols." },
  { id: "turner", name: "Rear Admiral Richmond Kelly Turner", role: "Commanding the amphibious force", category: "unload", note: "The transports and the unloading were his. Effort in Transports and Unloading carries further under him.", reportLine: "Turner drives the boat crews and keeps the transports at anchor as long as he dares." },
  { id: "feldt", name: "Lieutenant Commander Eric Feldt", role: "Director of the Coastwatching Service, Royal Australian Navy", category: "watch", note: "The coastwatchers on the islands reported to his service. Effort in Coastwatchers and Search carries further under him.", reportLine: "Feldt's stations on Bougainville and New Georgia pass each raid on to the fleet." },
];

KEY_BATTLE_APPROACHES.watchtowerAllied42 = [
  {
    id: "takeAirfield",
    name: "Take the Airfield First",
    subtitle: "Put the Marines and their stores ashore before anything else",
    note: "Seize the airfield before the Japanese can fly from it. Effort in the Marine Landing Force and in Transports and Unloading carries further; effort in Carrier Air Cover carries less, the carriers staying clear of the beach.",
    modifiers: { landing: 0.6, unload: 0.5, carriers: -0.5 },
    reportLine: "The landing goes in at full weight and the carriers stay south of the island.",
  },
  {
    id: "coverTheLanding",
    name: "Cover the Landing with the Fleet",
    subtitle: "Keep the carriers and the search over the beaches",
    note: "Keep the air cover and the warning over the landing. Effort in Carrier Air Cover and in Coastwatchers and Search carries further; effort in the Marine Landing Force carries less, the division landing at the pace the cover allows.",
    modifiers: { carriers: 0.6, watch: 0.5, landing: -0.5 },
    reportLine: "The Marines land at the pace the fleet can cover, and the patrols go out wide.",
  },
];

KEY_BATTLE_POSTURES.watchtowerAllied42 = [
  {
    id: "jungleRetreat",
    name: "The Guadalcanal garrison falls back into the jungle",
    weight: 2,
    modifiers: { landing: 1.1, carriers: 0.9, unload: 1.4, watch: 1.0 },
    hints: [
      "Reconnaissance photographs show the Japanese camp near the airfield largely built by laborers.",
      "Coastwatchers report no Japanese combat units on Guadalcanal.",
    ],
    reveal: "Contact: the Japanese on Guadalcanal are mostly construction troops, and they are leaving the airfield and going west. The beach is the Marines' to use, and the question is how much can be put on it.",
  },
  {
    id: "tulagiHolds",
    name: "The Tulagi garrison fights to the last",
    modifiers: { landing: 1.4, carriers: 0.9, unload: 0.8, watch: 1.0 },
    hints: [
      "Photographs show caves and dug-in positions on the ridge above Tulagi harbor.",
      "Reports speak of a naval landing force on Tulagi and Gavutu.",
    ],
    reveal: "Contact: the Japanese on Tulagi and Gavutu are naval troops in caves and dugouts, and they will not surrender. The fight is on the beaches and the ridge.",
  },
  {
    id: "raidsFromRabaul",
    name: "Rabaul sends its bombers against the ships",
    modifiers: { landing: 0.9, carriers: 1.4, unload: 0.9, watch: 1.3 },
    hints: [
      "Radio intelligence suggests the air units at Rabaul have been put on alert.",
      "A coastwatcher reports aircraft taking off from Rabaul and heading southeast.",
    ],
    reveal: "Contact: the bombers from Rabaul are on their way to the Sound in force, and the ships at anchor are the target.",
  },
];

KEY_BATTLE_ECHOES.watchtowerAllied42 = {
  counter: {
    repulsed: "The Rabaul raids were broken up over the Sound, and the transports lost little.",
    heldAtCost: "The Rabaul raids got through to the transports, and one ship was hit and burned.",
    broke: "The Rabaul raids broke through the fighters and the transports were bombed at anchor.",
    gaveGround: "The transports stood out to sea under the raids, and the unloading stopped for a day.",
  },
  neglected: {
    landing: "Too few Marines were put ashore, and the beachhead was thin.",
    carriers: "The carriers were kept back, and the transports had little air cover.",
    unload: "The unloading went slowly, and much of the cargo was still aboard when the ships left.",
    watch: "The search was thin, and the fleet had little warning of what was coming.",
  },
  commander: {
    vandegrift: "Vandegrift is ashore with his staff, counting the stores on the beach.",
    fletcher: "Fletcher is south of the island, and the carriers are already short of fuel.",
    turner: "Turner is on his flagship, and the transports are loaded to leave.",
    feldt: "Feldt's stations are still reporting from the islands, and the coastwatchers are hidden in the hills.",
  },
};
KEY_BATTLE_TITLES.push({ id: "watchtowerAllied42", seal: "CINCPAC", title: "Watchtower" });

// ------------------------------------------------------------------------------------------------------------------------
// Sho-Go, 22-25 October 1944, from the Japanese side. Hosted by leyteGulf44, "Execute Sho-Go as planned". The win is the force
// reaching the Samar approach in a shape to fight, as it did. Facts (see claims/battles-round2.json): Kurita's Center Force, with
// Yamato and Musashi, left Brunei on 22 October; submarines Darter and Dace sank the cruisers Atago and Maya on 23 October;
// American carrier aircraft sank Musashi in the Sibuyan Sea on 24 October; Nishimura's Southern Force was destroyed in Surigao
// Strait that night; Ozawa's carriers, with few aircraft, drew Halsey north and lost four carriers off Cape Engano on 25 October;
// Kurita came through San Bernardino Strait during the night and met Taffy 3 off Samar on the morning of 25 October.
// ------------------------------------------------------------------------------------------------------------------------
KEY_BATTLE_CONFIGS.shoGo44 = {
  id: "shoGo44",
  title: "Order of Battle: Sho-Go",
  flavor:
    "The Combined Fleet has one plan left. Ozawa's carriers, with hardly any aircraft, are to draw the American covering fleet north, and Kurita's battleships are to go through San Bernardino Strait and Nishimura's squadron through Surigao Strait to fall on the landing at Leyte. The fleet has fuel for the voyage and not much more, and almost no air cover. How the effort is spread between the main body, the decoy, the southern force and the land-based aircraft decides how many of the ships reach the beaches.",
  categories: [
    { id: "center", name: "Kurita's Center Force", meter: "readiness", strand: "flt" },
    { id: "decoy", name: "Ozawa's Carrier Decoy", meter: "initiative", strand: "tmp" },
    { id: "south", name: "The Southern Force", meter: "pipeline", strand: "oil" },
    { id: "air", name: "Land-Based Naval Air Forces", meter: "readiness", strand: "trn" },
  ],
  // The main body first: the battleships are the only ships that can wreck a landing. The decoy second: nothing else works unless
  // Halsey leaves. The aircraft third, thin as they are. The southern force last: it was old ships sent in two columns with no
  // chance of concentrating.
  effectiveness: { center: 2.4, decoy: 2.2, air: 1.8, south: 1.6 },
  orderOfBattle: {
    center: {
      units: [
        "Vice Admiral Takeo Kurita's First Striking Force: the battleships Yamato, Musashi, Nagato, Kongo and Haruna, with heavy cruisers and destroyers",
        "Fuel for the sortie from Brunei, and no fighter cover over the Sibuyan Sea",
      ],
      real:
        "Submarines sank two heavy cruisers on 23 October. On 24 October carrier aircraft sank Musashi and damaged other ships, and Kurita turned away briefly, then turned back and came through San Bernardino Strait in the night. He met a force of escort carriers off Samar on the morning of 25 October and broke off the action.",
    },
    decoy: {
      units: [
        "Vice Admiral Jisaburo Ozawa's Main Body: the carriers Zuikaku, Zuiho, Chitose and Chiyoda, and the battleship-carriers Ise and Hyuga",
        "About a hundred aircraft among all the carriers, mostly with half-trained crews",
      ],
      real:
        "Ozawa had to make himself seen. He sent a signal to be sure the Americans had found him, and on 24 October Halsey took Third Fleet's carriers north after him. Four of Ozawa's carriers were sunk off Cape Engano on 25 October, and the decoy had done its work.",
    },
    south: {
      units: [
        "Vice Admiral Shoji Nishimura's Southern Force: the old battleships Fuso and Yamashiro and a heavy cruiser",
        "Vice Admiral Kiyohide Shima's squadron of cruisers and destroyers, following behind",
      ],
      real:
        "The two columns came to Surigao Strait separately in the night of 24 to 25 October. Nishimura's force was met by American destroyers and then by Admiral Oldendorf's battleships and cruisers, and was destroyed. Shima turned back.",
    },
    air: {
      units: [
        "The First Air Fleet on Luzon under Vice Admiral Takijiro Onishi",
        "Vice Admiral Fukudome's Second Air Fleet on Formosa, whose strength was largely destroyed in the air battle off Formosa on 12 to 16 October",
      ],
      real:
        "The Navy's land-based aircraft were largely spent in the fighting off Formosa earlier in the month. The few that were left attacked the American carriers and the landing from Luzon, and gave Kurita no fighter cover.",
    },
  },
  hardRule: {
    text: "Combined Fleet orders every force to press on whatever the losses, so the main body is to go through the strait at once and the decoy is to stay in sight of the Americans.",
    lockApproach: "forceTheStrait",
  },
  conditions:
    "Fair weather in the Sibuyan Sea and on the approach to the straits. The American submarines are on station, and the American carriers are within range of the Center Force.",
  terrainModifiers: { south: 1.1 },
  terrainNotes: { south: "narrow waters and a dark night in the strait" },
  decisions: [
    {
      id: "afterTheSibuyanSea",
      time: "1530",
      title: "After the Sibuyan Sea",
      prompt:
        "Afternoon on 24 October. Musashi is sinking and the Center Force has been attacked from the air for most of the day. There has been no fighter cover. Kurita can press on toward San Bernardino Strait, turn back to the west to wait for the air attacks to lessen, or ask for air cover and slow the advance until it comes.",
      options: [
        {
          id: "pressOn",
          name: "Press on toward the strait without a pause",
          note: "Keeps the schedule, and the fleet is exposed to a further day of air attack.",
          bonus: 0,
          bonusByPosture: { halseyTakesBait: 3, halseyKeepsWatch: -3, oldendorfWaits: 0 },
          reportLine: "Kurita holds his course toward San Bernardino Strait.",
        },
        {
          id: "turnWest",
          name: "Turn west for a time, out of range of the carriers",
          note: "The fleet is out of the American air attacks and loses hours of the schedule, and the Southern Force goes in alone.",
          bonus: 0,
          bonusByPosture: { halseyTakesBait: -2, halseyKeepsWatch: 3, oldendorfWaits: 1 },
          reportLine: "The Center Force turns west and the air attacks fall away.",
        },
        {
          id: "askForCover",
          name: "Ask for fighter cover from Luzon and slow the advance",
          note: "The request costs the aircraft that are left, and the air units are spent before Kurita reaches the strait.",
          bonus: 1,
          bonusByPosture: { oldendorfWaits: 3, halseyTakesBait: 0, halseyKeepsWatch: 1 },
          meters: { readiness: -1 },
          costReason: "Land-based aircraft spent to cover the Center Force",
          reportLine: "The Center Force slows and signals Luzon for fighters.",
        },
      ],
    },
  ],
  counterattack: {
    category: "center",
    severity: { halseyKeepsWatch: 2, halseyTakesBait: 0, oldendorfWaits: 1 },
    warn: {
      1: "Radar shows large formations of American aircraft approaching the Center Force from the east.",
      2: "Wave after wave of American dive bombers and torpedo planes are over the fleet.",
    },
    results: {
      repulsed: "The fleet's anti-aircraft fire breaks up the attacks, and few of the American aircraft reach the ships.",
      heldAtCost: "The fleet is hit, and a battleship is damaged but keeps her station.",
      broke: "The American aircraft concentrate on one battleship and she is sunk.",
      gaveGround: "The fleet turns away from the attacks and the sortie loses a day.",
    },
  },
  categoryContext: {
    center:
      "The battleships are the only ships that can destroy a landing from the sea. Each commitment puts more of the heavy ships into the strait, and burns more of the fuel the fleet barely has.",
    decoy:
      "The carriers have few aircraft and are not meant to fight. Each commitment makes the decoy easier to find and harder to ignore, and draws the American carriers further north.",
    south:
      "The southern force is old ships sent through a second strait to meet the main body at the beaches. Each commitment adds more ships to the column, and costs the fuel they burn on the way.",
    air:
      "The land-based aircraft are all that is left of the naval air arm in the Philippines. Each commitment sends more of them against the American carriers and the landing, and has less to give the fleet.",
  },
  flashups: {
    center: [
      "The Center Force steams east through the Sibuyan Sea in a long column.",
      "A cruiser blows up and sinks after a hit from a submarine's torpedo.",
      "A battleship takes a torpedo hit and lists to port.",
      "Yamato opens fire with her main guns on the American escort carriers.",
      "The fleet turns north and then back toward the strait in the dark.",
    ],
    decoy: [
      "Ozawa's carriers steam south with their decks nearly bare.",
      "A signal is sent in the clear to tell the Americans where the carriers are.",
      "A search aircraft from the Americans sights the carrier force on the horizon.",
      "The carriers launch their handful of aircraft and turn away.",
      "The decoy force turns north with the American carriers coming after it.",
    ],
    south: [
      "Nishimura's squadron steams east through the Sulu Sea in column.",
      "American patrol boats attack the column in the strait with torpedoes.",
      "A destroyer is hit by a torpedo and lights up the strait.",
      "The old battleships open fire on a target they cannot see.",
      "Shima's ships arrive in the strait behind the wreckage of the first force.",
    ],
    air: [
      "Fighters leave Luzon for the Sibuyan Sea at dawn.",
      "A bomber attacks the American carriers off Luzon and does not return.",
      "A flight of aircraft makes for Leyte Gulf and meets American fighters.",
      "The airfields on Luzon are bombed and the aircraft on them burn.",
      "A pilot reports the American carriers forty miles east of Luzon.",
    ],
  },
  reportTimes: { open: "0800", contact: "1000", cats: ["1115", "1330", "1530", "1800"], reserve: "2000", counter: "2300" },
  idleLines: {
    center: [
      "The main body is not strengthened, and the battleships go in with what they have.",
      "No extra heavy ships are sent, and the strait is left to the ships already there.",
    ],
    decoy: [
      "The carriers make no effort to be seen, and the Americans do not come north.",
      "The decoy is left to move on its own and the American carriers stay where they are.",
    ],
    south: [
      "The southern force is held back and does not go into the strait.",
      "No more ships are sent to the Southern Force, and it goes in thin.",
    ],
    air: [
      "The land-based aircraft are held on Luzon and do not attack.",
      "No extra aircraft are sent, and the fleet has no cover.",
    ],
  },
  verdicts: ["The Fleet Reaches the Beaches", "The Fleet Is Stopped in the Straits"],
  verdictGrades: {
    clean:
      "The decoy drew the American carriers north, the main body came through the strait with its heavy ships, and the southern force and the aircraft pulled their weight.",
    costly:
      "The fleet reached the beaches in the end, but the main body, the decoy and the aircraft were spent more than the plan allowed for.",
    marginal:
      "The fleet got through the straits and the decoy drew the Americans north, but the battleships arrived with too little to destroy the landing.",
    total:
      "The decoy was ignored, the aircraft were gone, and the battleships were turned back in the straits before they reached the beaches.",
  },
};

KEY_BATTLE_COMMANDERS.shoGo44 = [
  { id: "kurita", name: "Vice Admiral Takeo Kurita", role: "Commanding the First Striking Force", category: "center", note: "He led the main body through the Sibuyan Sea and the strait. Effort in Kurita's Center Force carries further under him.", reportLine: "Kurita keeps the battleships in column and holds the course for San Bernardino Strait." },
  { id: "ozawa", name: "Vice Admiral Jisaburo Ozawa", role: "Commanding the Main Body, the carrier force", category: "decoy", note: "He commanded the carriers that were sent out to be found. Effort in Ozawa's Carrier Decoy carries further under him.", reportLine: "Ozawa steams south with his carriers in plain view and signals the Americans his position." },
  { id: "nishimura", name: "Vice Admiral Shoji Nishimura", role: "Commanding the Southern Force", category: "south", note: "He led the old battleships into Surigao Strait. Effort in the Southern Force carries further under him.", reportLine: "Nishimura takes the column through the Sulu Sea at full speed." },
  { id: "onishi", name: "Vice Admiral Takijiro Onishi", role: "Commanding the First Air Fleet, Luzon", category: "air", note: "The land-based naval aircraft in the Philippines were his. Effort in Land-Based Naval Air Forces carries further under him.", reportLine: "Onishi sends the aircraft on Luzon against the American carriers." },
];

KEY_BATTLE_APPROACHES.shoGo44 = [
  {
    id: "forceTheStrait",
    name: "Force the Strait",
    subtitle: "Send the main body through at once and accept the cost",
    note: "Get the battleships to the beaches on schedule. Effort in Kurita's Center Force and in the Southern Force carries further; effort in Ozawa's Carrier Decoy carries less, the carriers not drawing the Americans away in time.",
    modifiers: { center: 0.6, south: 0.5, decoy: -0.5 },
    reportLine: "The main body and the southern force are sent through the straits on schedule.",
  },
  {
    id: "bringHalseyNorth",
    name: "Bring Halsey North First",
    subtitle: "Make the decoy work before the battleships go through",
    note: "Give the carriers time to draw the Americans away. Effort in Ozawa's Carrier Decoy and in the Land-Based Naval Air Forces carries further; effort in Kurita's Center Force carries less, the battleships waiting for the carriers to be found.",
    modifiers: { decoy: 0.6, air: 0.5, center: -0.5 },
    reportLine: "The decoy is shown to the Americans and the battleships wait for them to move.",
  },
];

KEY_BATTLE_POSTURES.shoGo44 = [
  {
    id: "halseyTakesBait",
    name: "Third Fleet goes north after the carriers",
    weight: 2,
    modifiers: { center: 1.3, decoy: 1.0, south: 0.9, air: 0.9 },
    hints: [
      "Signals traffic shows the American carriers have turned north.",
      "A search aircraft reports American carriers moving away from San Bernardino Strait.",
    ],
    reveal: "Contact: the American covering fleet has gone north after Ozawa, and the strait is open. The question is how much of the main body reaches the other end.",
  },
  {
    id: "halseyKeepsWatch",
    name: "Third Fleet stays off the strait",
    modifiers: { center: 0.7, decoy: 1.4, south: 1.0, air: 1.2 },
    hints: [
      "Reports show the American carriers are not moving away from the Philippines.",
      "A submarine reports a strong American force still close to San Bernardino Strait.",
    ],
    reveal: "Contact: the American carriers are still near the strait and the decoy has not drawn them away.",
  },
  {
    id: "oldendorfWaits",
    name: "American old battleships wait in Surigao Strait",
    modifiers: { center: 1.0, decoy: 0.9, south: 0.7, air: 1.1 },
    hints: [
      "Intelligence reports old American battleships anchored in Leyte Gulf.",
      "Reports speak of American destroyers and patrol boats in Surigao Strait.",
    ],
    reveal: "Contact: a line of old American battleships and cruisers is waiting at the end of Surigao Strait with radar fire control, and the southern force will meet it head on.",
  },
];

KEY_BATTLE_ECHOES.shoGo44 = {
  counter: {
    repulsed: "The air attacks on the Center Force were broken up before they did great harm.",
    heldAtCost: "The Center Force was hit from the air, and a battleship was damaged.",
    broke: "The American aircraft concentrated on one battleship and sank her.",
    gaveGround: "The Center Force turned away from the air attacks and lost a day.",
  },
  neglected: {
    center: "The battleships went in light, and the main body was short of heavy ships.",
    decoy: "The decoy was not shown to the Americans, and the covering fleet stayed where it was.",
    south: "The Southern Force went in thin and was met by a stronger enemy.",
    air: "The land-based aircraft were held back, and the fleet went in with no cover.",
  },
  commander: {
    kurita: "Kurita is on the bridge of Yamato, with the strait behind him and the beaches ahead.",
    ozawa: "Ozawa is on his flagship, still signaling the position of the carriers to the Americans.",
    nishimura: "Nishimura's squadron is in the strait, and no word has come back.",
    onishi: "Onishi's staff on Luzon are counting the aircraft that are left.",
  },
};
KEY_BATTLE_TITLES.push({ id: "shoGo44", seal: "IGHQ", title: "Sho-Go" });

// ------------------------------------------------------------------------------------------------------------------------
// Iwo Jima, 19 February to 26 March 1945, from the Japanese side. Hosted by iwoJima45, "Reinforce and hold as long as the garrison
// physically can". The win is the garrison holding the island as long as it did. Facts (see claims/battles-round2.json): about
// 21,000 men under Lieutenant General Tadamichi Kuribayashi, in a system of tunnels the node text puts at eleven miles; Rear
// Admiral Toshinosuke Ichimaru commanded the naval troops; Colonel Baron Takeichi Nishi commanded the 26th Tank Regiment, whose
// tanks were mostly dug in as fixed guns; Mount Suribachi was reached on 23 February; the island was declared secured on 16 March
// and the last organized attack came in the night of 25 to 26 March; about 200 of the garrison were taken prisoner.
// ------------------------------------------------------------------------------------------------------------------------
KEY_BATTLE_CONFIGS.iwoJimaJapan45 = {
  id: "iwoJimaJapan45",
  title: "Order of Battle: Iwo Jima",
  flavor:
    "Eight square miles of volcanic ash, two airfields and twenty-one thousand men. There is no hope of relief, and Kuribayashi has given up the beaches to fight from the rock. Every man is to kill ten of the enemy before he dies. How the effort is spread between the infantry in the tunnels, the guns, the tanks and the stores of water and ammunition decides how many days the island lasts.",
  categories: [
    { id: "garrison", name: "Infantry in the Tunnels", meter: "readiness", strand: "mor" },
    { id: "guns", name: "Artillery, Mortars and Naval Guns", meter: "pipeline", strand: "ind" },
    { id: "tanks", name: "The Tank Regiment and Mobile Reserve", meter: "readiness", strand: "flt" },
    { id: "stores", name: "Water, Ammunition and Medical Stores", meter: "pipeline", strand: "shp" },
  ],
  // The infantry first: the tunnels are the battle. The guns second: they cover the beaches and the airfields from the rock. Stores
  // third, because a garrison with no water cannot hold. The tanks last: they were dug in and used as pillboxes.
  effectiveness: { garrison: 2.4, guns: 2.2, stores: 1.9, tanks: 1.6 },
  orderOfBattle: {
    garrison: {
      units: [
        "Lieutenant General Tadamichi Kuribayashi's 109th Division and the 2nd Mixed Brigade, about 21,000 men on the island",
        "Strongpoints cut into the rock at Mount Suribachi, the northern plateau and the airfields, linked by tunnels",
      ],
      real:
        "The garrison did not meet the landing on the beaches. It let the Marines come ashore and fought from the tunnels, and the Marines needed thirty-six days to take the island. About 200 of the garrison were taken alive.",
    },
    guns: {
      units: [
        "The Army's artillery, heavy mortars and rocket units, and the Navy's coast defense and anti-aircraft guns",
        "Gun positions in caves on Mount Suribachi and on the northern plateau, laid on the beaches and the airfields",
      ],
      real:
        "The guns held their fire during the bombardment and opened on the beaches when the landing craft were packed with men. Many were silenced by the Marines in the first weeks, but they cost the landing heavy casualties on the first day.",
    },
    tanks: {
      units: [
        "Colonel Baron Takeichi Nishi's 26th Tank Regiment",
        "A mobile reserve of infantry held behind the airfields",
      ],
      real:
        "The regiment's tanks were first dug in as fixed guns, and as the Marines advanced they were used in local counterattacks. Nishi was killed in the fighting in March.",
    },
    stores: {
      units: [
        "Reserves of ammunition, rations and water cisterns stored underground, with a medical station in the main tunnel",
        "A supply line from the home islands by way of Chichi Jima, cut by American submarines and aircraft",
      ],
      real:
        "The island had no fresh water of its own, and the garrison depended on rain and cisterns. The supply line from Chichi Jima was cut after the American fleet closed in, and by March the defenders were short of food and water.",
    },
  },
  hardRule: {
    text: "The Navy garrison and Tokyo press for the old doctrine of meeting the landing at the water's edge, so a night counterattack is ordered.",
    lockApproach: "counterattackByNight",
  },
  conditions:
    "Heavy surf on the beaches and a landing in daylight. The ash is soft, so tanks and vehicles bog down, and the Marines cannot dig in.",
  terrainModifiers: { guns: 1.1 },
  terrainNotes: { guns: "caves with a clear field of fire across open ash" },
  decisions: [
    {
      id: "theLastAttack",
      time: "0400",
      title: "The last attack",
      prompt:
        "The northern end of the island is all that is left. The command post is a cave, and Kuribayashi has three hundred men able to fight. He can make a last night attack with all of them, break them into small groups and go on fighting from the caves, or hold the last cave and keep the radio open to Tokyo.",
      options: [
        {
          id: "finalCharge",
          name: "Make a last night attack with every man who can walk",
          note: "Ends the fight in the open and spends the last of the garrison at once.",
          bonus: 1,
          bonusByPosture: { tanksAndFlame: 3, sealTheCaves: 0, navalGunfire: -2 },
          reportLine: "The survivors form up in the dark and move out against the Marine camps.",
        },
        {
          id: "smallGroups",
          name: "Break into small groups and go on fighting from the caves",
          note: "Keeps men in the field for days, and the groups lose touch with one another.",
          bonus: 0,
          bonusByPosture: { sealTheCaves: -1, navalGunfire: 3, tanksAndFlame: 0 },
          reportLine: "The men split into parties of ten and twenty and scatter to the caves in the cliffs.",
        },
        {
          id: "holdTheCave",
          name: "Hold the last cave and keep the radio open to Tokyo",
          note: "Keeps the garrison's last report going, and cuts the men off from the fight.",
          bonus: 1,
          bonusByPosture: { sealTheCaves: 4, tanksAndFlame: -1 },
          meters: { initiative: -1 },
          costReason: "The last of the garrison's communications used up",
          reportLine: "Kuribayashi stays in the cave and sends his last report to Tokyo.",
        },
      ],
    },
  ],
  counterattack: {
    category: "garrison",
    severity: { tanksAndFlame: 1, sealTheCaves: 2, navalGunfire: 0 },
    warn: {
      1: "Marines with flamethrowers and demolition charges are working along the ridge.",
      2: "The Marines are sealing the cave mouths one by one with explosives.",
    },
    results: {
      repulsed: "The Marine assault is stopped at the cave mouths and the ridge holds.",
      heldAtCost: "The ridge holds, but several strongpoints are overrun and the tunnels are cut in two.",
      broke: "The Marines break into the tunnel system and the strongpoints behind it fall one by one.",
      gaveGround: "The garrison falls back to the northern end of the island.",
    },
  },
  categoryContext: {
    garrison:
      "The infantry in the tunnels are the battle. Each commitment puts more men into the strongpoints and makes each one dearer to take.",
    guns:
      "The guns and mortars cover the beaches and the airfields from the rock. Each commitment puts more of them into the caves, and costs the ammunition they will need.",
    tanks:
      "The tanks are heavy and the ash is soft. Each commitment holds more of them as a mobile force, and takes them from the strongpoints where they are most use.",
    stores:
      "A garrison with no water or ammunition cannot hold. Each commitment puts more stores deep in the rock, and takes the men and the time from the fighting.",
  },
  flashups: {
    garrison: [
      "A machine gun in a cave mouth fires down the length of the ridge.",
      "A rifle company withdraws through a tunnel and takes up a new position.",
      "A Marine flamethrower team crawls up to a cave mouth under fire.",
      "A tunnel entrance is blown in and the men inside are sealed alive.",
      "A sentry in a pillbox watches the slope below and sees nothing move.",
    ],
    guns: [
      "A mortar opens on the beach and walks its fire down the line of landing craft.",
      "A gun in a cave on Suribachi fires and withdraws into the rock.",
      "A rocket battery on the plateau fires across the airfield.",
      "A naval gun is knocked out by a battleship's shell.",
      "The crew of a mortar pit works through the night to reload.",
    ],
    tanks: [
      "A tank buried to its turret in the ash fires on the advancing Marines.",
      "Nishi's regiment moves its tanks forward in the dark.",
      "A tank is knocked out by a bazooka at close range.",
      "A mobile reserve is held behind the airfield and not committed.",
      "The last tank of a company is blown up in its pit.",
    ],
    stores: [
      "A water cistern is found empty in a tunnel.",
      "Ammunition crates are passed from hand to hand along a tunnel.",
      "A medical orderly treats the wounded on a stretcher in the dark.",
      "A ration is split among a dozen men.",
      "A supply party makes for the main cave at night with water cans.",
    ],
  },
  reportTimes: { open: "0830", contact: "0900", cats: ["1000", "1200", "1500", "1800"], reserve: "2000", counter: "2300" },
  idleLines: {
    garrison: [
      "No more men are put into the strongpoints, and the line is thin.",
      "The infantry hold their positions as ordered and no more.",
    ],
    guns: [
      "The guns are held back and do not open on the beaches.",
      "No extra ammunition is put to the guns, and they fire only when ordered.",
    ],
    tanks: [
      "The tanks stay dug in where they are and are not moved.",
      "The mobile reserve is held back and is not committed.",
    ],
    stores: [
      "The stores are left in the main tunnel and are not spread through the island.",
      "No extra water or ammunition is moved forward.",
    ],
  },
  verdicts: ["The Tunnels Hold for Thirty-Six Days", "The Tunnels Are Cleared in a Fortnight"],
  verdictGrades: {
    clean:
      "The infantry held the strongpoints, the guns covered the beaches, the tanks were used where they counted and the stores lasted, and the island cost the Marines every day of the thirty-six.",
    costly:
      "The tunnels held for the full battle, but the garrison, the guns and the stores were spent faster than the plan had allowed for.",
    marginal:
      "The garrison fought well and died in its tunnels, but the guns and the stores ran short and the island fell sooner than it might.",
    total:
      "The arms of the garrison fought separately, the stores ran out, and the tunnels were cleared in far less time than the plan assumed.",
  },
};

KEY_BATTLE_COMMANDERS.iwoJimaJapan45 = [
  { id: "kuribayashi", name: "Lieutenant General Tadamichi Kuribayashi", role: "Commanding the Ogasawara Group and the garrison", category: "garrison", note: "He chose to fight from the tunnels and not from the beaches. Effort in Infantry in the Tunnels carries further under him.", reportLine: "Kuribayashi moves between the strongpoints and holds the line in the rock." },
  { id: "ichimaru", name: "Rear Admiral Toshinosuke Ichimaru", role: "Commanding the Navy troops on the island", category: "guns", note: "The Navy manned many of the island's guns. Effort in Artillery, Mortars and Naval Guns carries further under him.", reportLine: "Ichimaru's naval gunners fire from the caves on Suribachi and fall back into the rock." },
  { id: "nishi", name: "Colonel Baron Takeichi Nishi", role: "Commanding the 26th Tank Regiment", category: "tanks", note: "His tanks were the island's only armor. Effort in the Tank Regiment and Mobile Reserve carries further under him.", reportLine: "Nishi brings his tanks forward in the dark and digs them into the ash." },
];

KEY_BATTLE_APPROACHES.iwoJimaJapan45 = [
  {
    id: "fightFromTunnels",
    name: "Fight from the Tunnels",
    subtitle: "Hold every position and give up none of the rock",
    note: "Stay in the rock and make each position dear. Effort in Infantry in the Tunnels and in Artillery, Mortars and Naval Guns carries further; effort in the Tank Regiment and Mobile Reserve carries less, the tanks fixed in their pits.",
    modifiers: { garrison: 0.6, guns: 0.5, tanks: -0.5 },
    reportLine: "The garrison stays in the rock and gives up no position without a fight.",
  },
  {
    id: "counterattackByNight",
    name: "Counterattack by Night",
    subtitle: "Strike the Marine camps in the dark and withdraw",
    note: "Hit the Marines when they cannot see. Effort in the Tank Regiment and in Water, Ammunition and Medical Stores carries further; effort in Infantry in the Tunnels carries less, men leaving the strongpoints to fight in the open.",
    modifiers: { tanks: 0.6, stores: 0.5, garrison: -0.5 },
    reportLine: "Parties go out from the tunnels at night against the Marine camps and return before dawn.",
  },
];

KEY_BATTLE_POSTURES.iwoJimaJapan45 = [
  {
    id: "tanksAndFlame",
    name: "The Marines push on with tanks and flamethrowers",
    weight: 2,
    modifiers: { garrison: 1.3, guns: 1.0, tanks: 0.9, stores: 0.9 },
    hints: [
      "Reports show Marine tanks and flamethrower tanks coming ashore across the black ash.",
      "Observers on Suribachi report the Marines gathering at the neck of the island.",
    ],
    reveal: "Contact: the Marines are coming on across the ash with tanks and flamethrowers, and the fight is for each strongpoint in turn.",
  },
  {
    id: "sealTheCaves",
    name: "The Marines seal each cave with demolitions",
    modifiers: { garrison: 0.8, guns: 0.9, tanks: 1.0, stores: 1.5 },
    hints: [
      "Reports speak of Marine engineers working along the ridges with explosive charges.",
      "Tunnel mouths are being blown in, and the men inside are cut off.",
    ],
    reveal: "Contact: the Marines are sealing the cave mouths with demolitions, and the garrison is being cut off from its water and its ammunition.",
  },
  {
    id: "navalGunfire",
    name: "The fleet brings its guns to bear",
    modifiers: { garrison: 0.9, guns: 1.4, tanks: 1.0, stores: 1.0 },
    hints: [
      "Battleships and cruisers are reported close inshore off the western beaches.",
      "Naval gunfire is falling on the northern plateau by day and by night.",
    ],
    reveal: "Contact: battleships and cruisers are firing from close inshore, and the Marines call the fleet's guns down on every position that fires.",
  },
];

KEY_BATTLE_ECHOES.iwoJimaJapan45 = {
  counter: {
    repulsed: "The Marine assaults on the ridge were stopped at the cave mouths.",
    heldAtCost: "The ridge held, but the strongpoints behind it were cut in two.",
    broke: "The Marines broke into the tunnel system and the strongpoints fell one by one.",
    gaveGround: "The garrison fell back to the northern end of the island.",
  },
  neglected: {
    garrison: "Too few men held the strongpoints, and the line was thin.",
    guns: "The guns were held back, and the beaches were hardly shelled.",
    tanks: "The tanks sat in their pits and were knocked out one by one.",
    stores: "The stores were not spread through the rock, and the garrison ran short of water.",
  },
  commander: {
    kuribayashi: "Kuribayashi is in the northern caves, with the last of his staff around him.",
    ichimaru: "Ichimaru's gunners are in the caves of Suribachi, with the ammunition running low.",
    nishi: "Nishi is with the last of his tanks, dug in at the edge of the airfield.",
  },
};
KEY_BATTLE_TITLES.push({ id: "iwoJimaJapan45", seal: "IGHQ", title: "Iwo Jima" });

// ------------------------------------------------------------------------------------------------------------------------
// Iwo Jima, 19 February 1945, from the American side. Hosted by iwoJimaAllied45, "Accept the compressed three-day bombardment and
// proceed on schedule". The win is the landing seizing the island on the historical timetable. Facts (see claims/battles-
// round2.json): the Marines had asked for ten days of naval bombardment and were given three; the V Amphibious Corps landed the 4th
// and 5th Marine Divisions on the southeast beaches on 19 February, with the 3rd Marine Division as the corps reserve; Mount
// Suribachi was reached on 23 February; the escort carrier Bismarck Sea was sunk by special attack aircraft on 21 February; the
// island was declared secured on 16 March, and the Marines lost nearly 7,000 killed.
// ------------------------------------------------------------------------------------------------------------------------
KEY_BATTLE_CONFIGS.iwoJimaAllied45 = {
  id: "iwoJimaAllied45",
  title: "Order of Battle: Iwo Jima",
  flavor:
    "Three Marine divisions are to take an island that the Navy has shelled for three days instead of the ten the Marines asked for. The airfields are close to Tokyo and the garrison is dug in. The beaches are soft black ash. How the effort is spread between the naval gunfire, the assault regiments, the beach parties and the intelligence on the defense decides how many Marines are alive when the island is taken.",
  categories: [
    { id: "assault", name: "The Marine Assault Regiments", meter: "readiness", strand: "trn" },
    { id: "gunfire", name: "Naval Gunfire and Carrier Air", meter: "readiness", strand: "flt" },
    { id: "beach", name: "Beach Parties and Logistics", meter: "pipeline", strand: "shp" },
    { id: "recon", name: "Reconnaissance and Intelligence", meter: "initiative", strand: "int" },
  ],
  // The assault first: it is the work. The gunfire second, the arm the Marines wanted more of. The beach parties third: the ash
  // swallowed vehicles. Intelligence last, though it was the arm that found the least.
  effectiveness: { assault: 2.4, gunfire: 2.2, beach: 2.0, recon: 1.8 },
  orderOfBattle: {
    assault: {
      units: [
        "The 4th and 5th Marine Divisions, landing side by side on the southeast beaches",
        "The 3rd Marine Division, held in corps reserve and committed in the following days",
      ],
      real:
        "The Marines took heavy fire on the beaches from the first minutes and had Mount Suribachi cut off by the afternoon of the first day. The 28th Marines took the summit on 23 February. The Marines announced the capture of the island on 14 March, and the last Japanese attack came on the night of 25 to 26 March.",
    },
    gunfire: {
      units: [
        "Rear Admiral William Blandy's Amphibious Support Force: old battleships, cruisers and destroyers",
        "Carrier aircraft from Task Force 58 and escort carriers",
      ],
      real:
        "The fleet fired for three days before the landing, and Marine planners later said that the guns had done little to the buried defenses. Of the island's fortified positions, only a fraction had been destroyed when the Marines landed.",
    },
    beach: {
      units: [
        "The shore parties, engineers and beach battalions of the landing force",
        "Landing craft, amphibious tractors and the ships that carried the division's supplies",
      ],
      real:
        "The ash was so soft that vehicles bogged down, and the beaches became a jam of wrecked craft and stores under fire. Engineers laid steel matting to get tracked vehicles off the beach.",
    },
    recon: {
      units: [
        "Photographic reconnaissance, carried out by aircraft and by the Underwater Demolition Teams",
        "Intelligence on the garrison's strength and positions, mostly from aerial photographs",
      ],
      real:
        "The intelligence staff expected a hard fight and a fortified island, and the photographs showed few of the defenses. The Marines learned the scale of the tunnel system by finding it.",
    },
  },
  hardRule: {
    text: "Nimitz has ordered the landing on 19 February whatever the weather and the state of the bombardment, so the assault regiments are to go in on the first day.",
    lockApproach: "landInStrength",
  },
  conditions:
    "A heavy surf on the beaches that grows through the morning. The black ash is soft, and the island is within range of the Japanese home air bases.",
  terrainModifiers: { beach: 0.9 },
  terrainNotes: { beach: "soft ash and heavy surf" },
  decisions: [
    {
      id: "theReserve",
      time: "1600",
      title: "The reserve",
      prompt:
        "Late afternoon on the first day. The beaches are crowded and under fire, and the assault regiments have taken heavy losses. The corps reserve is afloat off the island. The commander can land the reserve now to keep the attack moving, hold it afloat until the beaches are clear, or land tanks and artillery first.",
      options: [
        {
          id: "commitReserve",
          name: "Land the reserve at once",
          note: "Keeps the attack moving, and puts more men on a beach under fire.",
          bonus: 1,
          bonusByPosture: { fireOnTheBeaches: -3, tunnelsIntact: 2, kamikazeAtSea: 1 },
          reportLine: "The reserve regiments are sent to the beaches in the late afternoon.",
        },
        {
          id: "holdReserve",
          name: "Hold the reserve afloat until the beaches are clear",
          note: "Keeps the men out of the fire, and gives the defense time to recover.",
          bonus: 0,
          bonusByPosture: { fireOnTheBeaches: 3, tunnelsIntact: 0, kamikazeAtSea: -1 },
          reportLine: "The reserve stays in the transports while the beaches are cleared.",
        },
        {
          id: "tanksFirst",
          name: "Land the tanks and artillery first",
          note: "Gets the heavy weapons ashore, and takes landing craft from the stores.",
          bonus: 0,
          bonusByPosture: { kamikazeAtSea: 4, tunnelsIntact: -1, fireOnTheBeaches: 1 },
          meters: { pipeline: -1 },
          costReason: "Landing craft diverted from stores to tanks and guns",
          reportLine: "The landing craft carry tanks and guns to the beach in place of rations and ammunition.",
        },
      ],
    },
  ],
  counterattack: {
    category: "beach",
    severity: { fireOnTheBeaches: 2, tunnelsIntact: 1, kamikazeAtSea: 0 },
    warn: {
      1: "Mortar and artillery fire is falling on the beaches from Mount Suribachi and the northern plateau.",
      2: "The fire is heavy and accurate, and the landing craft are burning on the beach.",
    },
    results: {
      repulsed: "The Marines get past the fire on the beaches and move inland with few losses.",
      heldAtCost: "The beaches are cleared, but wrecked craft and stores are strewn along the shore.",
      broke: "The beaches are jammed with wrecks, and the second wave cannot land.",
      gaveGround: "The landing craft are pulled back from the beaches, and the landing stops for the night.",
    },
  },
  categoryContext: {
    assault:
      "The Marines take the island or it is not taken. Each commitment puts more rifle companies ashore in the first hours, in front of guns they cannot see.",
    gunfire:
      "The fleet's guns and the carriers' aircraft are the Marines' heavy weapons. Each commitment puts more ships on call, and keeps the Japanese guns quieter for the landing.",
    beach:
      "The beaches decide whether the Marines are supplied. Each commitment puts more engineers, tractors and craft on the shore, and clears the wrecks sooner.",
    recon:
      "The reconnaissance finds the defenses the guns must hit. Each commitment puts more aircraft and swimmers on the beaches, and gives the plan a truer picture.",
  },
  flashups: {
    assault: [
      "A Marine rifle company runs forward across the black ash under mortar fire.",
      "A platoon digs a hole in the ash and finds it fills as fast as it is dug.",
      "The 28th Marines move across the island and cut off Mount Suribachi.",
      "A flamethrower team works up to a pillbox at the foot of the ridge.",
      "A battalion commander is hit and the executive officer takes over.",
    ],
    gunfire: [
      "A battleship fires on the island from a few thousand yards offshore.",
      "Carrier aircraft rocket and napalm a ridge in front of the Marines.",
      "A cruiser fires star shells over the island at night.",
      "A destroyer closes the shore to fire on a cave at point-blank range.",
      "A gunnery officer reports that the shells make no impression on the rock.",
    ],
    beach: [
      "Landing craft jam the beach and unload in the surf.",
      "A tractor bogs down in the ash and blocks the lane.",
      "Engineers lay steel matting across the sand.",
      "A beach master directs the boats between the wrecks.",
      "A stack of ammunition on the beach is hit by a mortar shell.",
    ],
    recon: [
      "A photographic aircraft crosses the island at low level.",
      "The swimmers of an Underwater Demolition Team survey the beaches under fire.",
      "An intelligence officer marks fresh positions on the map.",
      "A captured map shows the layout of the Japanese guns.",
      "A scout reports a new cave mouth on the slope of Suribachi.",
    ],
  },
  reportTimes: { open: "0640", contact: "0900", cats: ["1000", "1200", "1500", "1730"], reserve: "1900", counter: "2200" },
  idleLines: {
    assault: [
      "The assault goes in with the regiments it had planned and no more.",
      "No extra rifle companies are sent ashore in the first hours.",
    ],
    gunfire: [
      "The fleet fires on its schedule and the carriers fly their regular missions.",
      "No extra ships are put on call, and the Marines wait for the guns.",
    ],
    beach: [
      "The beach parties work with the craft they have, and the shore stays jammed.",
      "No extra engineers are sent to the beaches, and the wrecks stay where they lie.",
    ],
    recon: [
      "The reconnaissance flies its planned missions and no more.",
      "No extra patrols are sent over the island, and the plan rests on the old photographs.",
    ],
  },
  verdicts: ["The Island Falls on the Timetable", "The Landing Stalls on the Beaches"],
  verdictGrades: {
    clean:
      "The assault regiments got off the beaches, the fleet's guns were on call, the stores came ashore and the plan matched the defense, and the island was taken at a lower price than it might have been.",
    costly:
      "The landing succeeded and the island was taken, but the Marines, the fleet and the beaches paid more than the plan had allowed for.",
    marginal:
      "The island was taken in the end, but the guns did too little, the beaches were jammed and the Marines paid for the delay.",
    total:
      "The landing, the gunfire and the beach parties worked at cross purposes, and the Marines were pinned on the beaches for days.",
  },
};

KEY_BATTLE_COMMANDERS.iwoJimaAllied45 = [
  { id: "schmidt", name: "Major General Harry Schmidt", role: "Commanding the V Amphibious Corps", category: "assault", note: "He commanded the landing force of three divisions. Effort in the Marine Assault Regiments carries further under him.", reportLine: "Schmidt sends the regiments in from the transports and keeps his headquarters afloat." },
  { id: "blandy", name: "Rear Admiral William Blandy", role: "Commanding the Amphibious Support Force", category: "gunfire", note: "The fleet's guns for the landing were his. Effort in Naval Gunfire and Carrier Air carries further under him.", reportLine: "Blandy brings the battleships close inshore and calls in the carrier aircraft." },
  { id: "turner", name: "Vice Admiral Richmond Kelly Turner", role: "Commanding the Joint Expeditionary Force", category: "beach", note: "The landing ships, craft and stores were his. Effort in Beach Parties and Logistics carries further under him.", reportLine: "Turner drives the boats to the beach through the surf and the wrecks." },
];

KEY_BATTLE_APPROACHES.iwoJimaAllied45 = [
  {
    id: "landInStrength",
    name: "Land in Strength",
    subtitle: "Put as many Marines ashore on the first day as the beaches will take",
    note: "Get the assault regiments and the stores onto the island before the defense recovers. Effort in the Marine Assault Regiments and in Beach Parties and Logistics carries further; effort in Naval Gunfire and Carrier Air carries less, the landing going in before the guns have done their work.",
    modifiers: { assault: 0.6, beach: 0.5, gunfire: -0.5 },
    reportLine: "The assault regiments land together on the first day, with the stores behind them.",
  },
  {
    id: "batterFirst",
    name: "Batter the Island First",
    subtitle: "Let the guns and the aircraft work for longer before the Marines land",
    note: "Give the fleet time to find and destroy the defenses. Effort in Naval Gunfire and Carrier Air and in Reconnaissance and Intelligence carries further; effort in the Marine Assault Regiments carries less, the Marines waiting while the fleet works.",
    modifiers: { gunfire: 0.6, recon: 0.5, assault: -0.5 },
    reportLine: "The fleet keeps firing and the Marines wait offshore until the guns have done their work.",
  },
];

KEY_BATTLE_POSTURES.iwoJimaAllied45 = [
  {
    id: "tunnelsIntact",
    name: "The tunnels survive the bombardment",
    weight: 2,
    modifiers: { assault: 1.1, gunfire: 0.7, beach: 0.9, recon: 1.4 },
    hints: [
      "Photographs show few damaged positions after the bombardment.",
      "Reports suggest the Japanese are dug in far deeper than the shells reach.",
    ],
    reveal: "Contact: the Japanese are in tunnels cut deep in the rock, and the bombardment has hardly touched them. The Marines have to find each position as it fires.",
  },
  {
    id: "fireOnTheBeaches",
    name: "Guns on Suribachi and the plateau cover the beaches",
    modifiers: { assault: 0.9, gunfire: 1.1, beach: 1.4, recon: 1.0 },
    hints: [
      "Reconnaissance shows gun positions on Mount Suribachi covering the landing beaches.",
      "Reports speak of mortars and rockets sited on the northern plateau.",
    ],
    reveal: "Contact: guns on Suribachi and on the northern plateau cover every landing beach, and they open fire when the craft are packed with men.",
  },
  {
    id: "kamikazeAtSea",
    name: "Special attack aircraft hit the fleet offshore",
    modifiers: { assault: 1.0, gunfire: 1.3, beach: 0.8, recon: 1.0 },
    hints: [
      "Radio intelligence reports aircraft concentrating on the home island airfields.",
      "Radar shows aircraft approaching from the north at dusk.",
    ],
    reveal: "Contact: special attack aircraft from the home islands are diving on the ships off the beaches, and the fleet has to fight for its own survival.",
  },
];

KEY_BATTLE_ECHOES.iwoJimaAllied45 = {
  counter: {
    repulsed: "The Marines got past the fire on the beaches and moved inland.",
    heldAtCost: "The beaches were cleared, but wrecked craft were strewn along the shore.",
    broke: "The beaches were jammed with wrecks, and the second wave could not land.",
    gaveGround: "The landing craft were pulled back, and the landing stopped for the night.",
  },
  neglected: {
    assault: "Too few Marines were put ashore early, and the beachhead was held by a thin line.",
    gunfire: "The fleet's guns were held back, and the Japanese guns kept firing.",
    beach: "The beaches were jammed, and the stores came ashore slowly.",
    recon: "The plan rested on old photographs, and the Marines found the defenses by running into them.",
  },
  commander: {
    schmidt: "Schmidt is on his command ship, reading casualty reports.",
    blandy: "Blandy's ships are still off the island, firing on call.",
    turner: "Turner's boats are still running to the beach through the surf.",
  },
};
KEY_BATTLE_TITLES.push({ id: "iwoJimaAllied45", seal: "CINCPAC", title: "Iwo Jima" });

// ------------------------------------------------------------------------------------------------------------------------
// Okinawa, April to June 1945, from the Japanese side. Hosted by okinawa45, "Commit everything: Yamato's sortie, the full Kikusui
// kamikaze campaign". The win is the sacrifice taking the toll it was planned to take. Facts (see claims/battles-round2.json):
// Operation Ten-Go sent Yamato, the light cruiser Yahagi and eight destroyers under Vice Admiral Seiichi Ito on 6 April, and
// American carrier aircraft sank Yamato on 7 April with the loss of about 3,000 of her crew; Kikusui No. 1 on 6 and 7 April used
// some 355 kamikaze aircraft; ten Kikusui attacks were made between April and June; Lieutenant General Mitsuru Ushijima's Thirty-
// Second Army defended in depth around Shuri and made a counteroffensive on 4 and 5 May that failed.
// ------------------------------------------------------------------------------------------------------------------------
KEY_BATTLE_CONFIGS.okinawaJapan45 = {
  id: "okinawaJapan45",
  title: "Order of Battle: Okinawa",
  flavor:
    "The Navy has one battleship, one cruiser and a handful of destroyers left that can sail, and a few thousand aircraft that can be flown once. The Army has a garrison on the island that is to hold the Americans as long as it can. Nobody expects to win. How the effort is spread between Yamato's sortie, the mass kamikaze attacks, the army on the island and the direction of the whole decides what the sacrifice costs the American fleet.",
  categories: [
    { id: "kikusui", name: "The Kikusui Kamikaze Attacks", meter: "readiness", strand: "trn" },
    { id: "army", name: "Thirty-Second Army on Okinawa", meter: "readiness", strand: "mor" },
    { id: "yamato", name: "Yamato's Sortie", meter: "pipeline", strand: "oil" },
    { id: "direction", name: "Reconnaissance and Direction", meter: "initiative", strand: "int" },
  ],
  // The kamikaze first: they sank and damaged more American ships than any other arm. The army second: it held the island for
  // eighty days. Yamato third: she never reached the island. Direction last: the attacks were flown by crews with few instruments.
  effectiveness: { kikusui: 2.4, army: 2.2, yamato: 2.0, direction: 1.8 },
  orderOfBattle: {
    kikusui: {
      units: [
        "The Navy's Fifth Air Fleet and the Army's Sixth Air Army, flying from Kyushu and Formosa",
        "Kamikaze pilots with a few weeks of training, and a smaller number of conventional strike and escort aircraft",
      ],
      real:
        "Ten large Kikusui attacks were flown between April and June, with several thousand kamikaze sorties in all. They sank thirty or more ships and damaged hundreds, and killed nearly five thousand American sailors, the Navy's costliest battle of the war. They did not stop the landing.",
    },
    army: {
      units: [
        "Lieutenant General Mitsuru Ushijima's Thirty-Second Army, with about 100,000 men and Okinawan conscripts",
        "A defense in depth on the Shuri line, with artillery in caves and little on the beaches",
      ],
      real:
        "The army let the Americans land unopposed on 1 April and fought from the Shuri line for the next eighty days. A counteroffensive on 4 and 5 May was beaten, and Ushijima died in the south in June. Okinawan civilians died in the fighting in very large numbers.",
    },
    yamato: {
      units: [
        "Vice Admiral Seiichi Ito's Second Fleet: Yamato, the cruiser Yahagi and eight destroyers",
        "Fuel for the sortie from the Inland Sea, and no fighter cover",
      ],
      real:
        "The squadron sailed on 6 April and was found by American search aircraft. On 7 April carrier aircraft sank Yamato, Yahagi and four destroyers, and about 3,000 of Yamato's crew died. She never came within sight of Okinawa.",
    },
    direction: {
      units: [
        "The staff of the Combined Fleet under Admiral Soemu Toyoda, and the Army's Sixth Air Army headquarters",
        "Reconnaissance aircraft and radio intelligence units reporting on the American fleet",
      ],
      real:
        "Toyoda ordered the sortie and the attacks from Japan. The reconnaissance had little to see with, and many of the kamikaze pilots never found their targets, and attacked the first ships they saw.",
    },
  },
  hardRule: {
    text: "Combined Fleet orders Yamato to beach herself on Okinawa and fight as a shore battery, so the sortie is made whatever it costs.",
    lockApproach: "everythingAtOnce",
  },
  conditions:
    "Spring weather over the East China Sea, with low cloud on some days. American carriers are within range of Kyushu, and the American fleet is anchored off the beaches.",
  terrainModifiers: { army: 1.1 },
  terrainNotes: { army: "high ground and caves behind the landing beaches" },
  decisions: [
    {
      id: "theSortie",
      time: "1500",
      title: "The sortie",
      prompt:
        "Afternoon on 6 April. Yamato has fuel for a voyage that may be one way, and no fighter cover. Ito can sail at once, wait in the Inland Sea until fighters can be gathered, or send the destroyers ahead as a screen of decoys.",
      options: [
        {
          id: "sailNow",
          name: "Sail at once on the fuel on hand",
          note: "Gets the squadron out before the American submarines are placed, and leaves it with no fighters.",
          bonus: 0,
          bonusByPosture: { pickets: 0, kyushuStrikes: -2, fleetAtAnchor: 3 },
          reportLine: "Yamato weighs anchor in the afternoon and the squadron sails for the Bungo Strait.",
        },
        {
          id: "waitForCover",
          name: "Wait in the Inland Sea for fighters to be gathered",
          note: "The squadron burns fuel at anchor, and the Americans may find it first.",
          bonus: 0,
          bonusByPosture: { kyushuStrikes: 3, pickets: -1, fleetAtAnchor: -1 },
          meters: { pipeline: -1 },
          costReason: "Fuel burned waiting at anchor",
          reportLine: "The squadron stays at anchor while the fighters are called in from other bases.",
        },
        {
          id: "decoyDestroyers",
          name: "Send the destroyers ahead as decoys",
          note: "The destroyers draw the American search away from Yamato, and are lost doing it.",
          bonus: 1,
          bonusByPosture: { pickets: 2, kyushuStrikes: 0, fleetAtAnchor: 0 },
          meters: { readiness: -1 },
          costReason: "Destroyers lost ahead of the main body",
          reportLine: "The destroyers sail ahead of the squadron, making as much smoke and noise as they can.",
        },
      ],
    },
  ],
  counterattack: {
    category: "yamato",
    severity: { pickets: 1, kyushuStrikes: 2, fleetAtAnchor: 0 },
    warn: {
      1: "American search aircraft are reported shadowing the squadron.",
      2: "Radar shows several hundred American aircraft approaching from the south.",
    },
    results: {
      repulsed: "The squadron's anti-aircraft fire breaks up the American attacks, and the ships are not badly hit.",
      heldAtCost: "Yamato is hit and slowed, and the squadron presses on without two of its destroyers.",
      broke: "The American aircraft sink the cruiser and several destroyers, and Yamato is hit by torpedoes on one side.",
      gaveGround: "The squadron turns back for the Inland Sea and the sortie is called off.",
    },
  },
  categoryContext: {
    kikusui:
      "The kamikaze attacks are the Navy's last weapon with any reach. Each commitment puts more aircraft and pilots into the attacks, and uses up what is left of the air arm.",
    army:
      "The army on Okinawa is meant to hold the island as long as it can. Each commitment puts more men and guns into the Shuri line, and makes each hill dearer to take.",
    yamato:
      "Yamato is the fleet's last great ship. Each commitment puts more fuel and destroyers behind the sortie, and takes them from the home islands that will need them.",
    direction:
      "The staffs plan, time and direct the attacks. Each commitment puts more reconnaissance in the air and more radio intelligence on the American fleet, and gets the attacks to the ships that count.",
  },
  flashups: {
    kikusui: [
      "Kamikaze aircraft leave the Kyushu airfields at dawn in loose formations.",
      "A pilot dives at a destroyer on the radar picket line and hits her amidships.",
      "A flight of aircraft finds only clouds and turns back to the coast.",
      "Fighters cover a formation of attackers as far as the American patrols.",
      "A bomber carrying a rocket-powered piloted bomb is shot down short of the fleet.",
    ],
    army: [
      "An artillery piece rolls out of a cave, fires, and is pulled back inside.",
      "A rifle company holds a ridge for two days against tanks and flamethrowers.",
      "The 4 May counteroffensive moves out behind a barrage and is stopped by American guns.",
      "A battalion withdraws from the Shuri line in the dark.",
      "Okinawan conscripts carry ammunition up a hill under fire.",
    ],
    yamato: [
      "Yamato steams south through the Bungo Strait in the afternoon.",
      "An American submarine sights the squadron and sends a radio report.",
      "Yahagi is hit by a bomb and lists to port.",
      "The destroyers circle Yamato at high speed and fire at the aircraft.",
      "Yamato's guns fire at the American aircraft and the ship shakes.",
    ],
    direction: [
      "A reconnaissance aircraft reports the American fleet off the Hagushi beaches.",
      "The staff in Tokyo plan the day's Kikusui attack from a table of ships.",
      "A radio operator logs the American fighter direction nets.",
      "A scout reports the American carriers east of Okinawa.",
      "A message is sent to the squadron ordering it to proceed.",
    ],
  },
  reportTimes: { open: "0600", contact: "0800", cats: ["0930", "1130", "1330", "1530"], reserve: "1700", counter: "1900" },
  idleLines: {
    kikusui: [
      "The air units hold their aircraft back and fly only a few sorties.",
      "No extra kamikaze pilots are sent, and the attacks are thin.",
    ],
    army: [
      "The army on the island is left to hold its lines with the men it has.",
      "No more men or guns are put into the Shuri line.",
    ],
    yamato: [
      "Yamato stays in the Inland Sea and the sortie is not made.",
      "No extra fuel is found, and the squadron cannot go far.",
    ],
    direction: [
      "The reconnaissance flies its usual patrols and finds little.",
      "No extra intelligence is gathered, and the attacks are flown by guess.",
    ],
  },
  verdicts: ["The Sacrifice Takes Its Toll", "The Sacrifice Is Spent for Little"],
  verdictGrades: {
    clean:
      "The kamikaze attacks found the American ships, the army held the island for the full eighty days, Yamato drew off the American carriers, and the direction from Tokyo held it together.",
    costly:
      "The sacrifice cost the American fleet dearly, but the air arm, the army and the squadron paid more than the plan had allowed for.",
    marginal:
      "The attacks and the army hurt the Americans, but the squadron was lost early and the direction fell short of the plan.",
    total:
      "The attacks were scattered, the squadron was sunk without reaching the island, and the army was cut off, so the sacrifice cost the Americans little.",
  },
};

KEY_BATTLE_COMMANDERS.okinawaJapan45 = [
  { id: "ugaki", name: "Vice Admiral Matome Ugaki", role: "Commanding the Fifth Air Fleet, Kyushu", category: "kikusui", note: "The Navy's kamikaze units on Kyushu were his. Effort in the Kikusui Kamikaze Attacks carries further under him.", reportLine: "Ugaki sends the Fifth Air Fleet's aircraft against the American fleet." },
  { id: "ushijima", name: "Lieutenant General Mitsuru Ushijima", role: "Commanding the Thirty-Second Army", category: "army", note: "He led the army that held the island. Effort in Thirty-Second Army on Okinawa carries further under him.", reportLine: "Ushijima holds the Shuri line and keeps his army in the caves." },
  { id: "ito", name: "Vice Admiral Seiichi Ito", role: "Commanding the Second Fleet", category: "yamato", note: "He took Yamato out on her last voyage. Effort in Yamato's Sortie carries further under him.", reportLine: "Ito brings the squadron out of the Inland Sea and sets course for the south." },
  { id: "toyoda", name: "Admiral Soemu Toyoda", role: "Commander in Chief, Combined Fleet", category: "direction", note: "He ordered the sortie and the attacks. Effort in Reconnaissance and Direction carries further under him.", reportLine: "Toyoda orders the sortie and the attacks from the Combined Fleet headquarters." },
];

KEY_BATTLE_APPROACHES.okinawaJapan45 = [
  {
    id: "everythingAtOnce",
    name: "Everything at Once",
    subtitle: "Send the squadron and the attacks together on the same days",
    note: "Put the squadron and the first Kikusui waves against the American fleet together. Effort in Yamato's Sortie and in the Kikusui Kamikaze Attacks carries further; effort in Reconnaissance and Direction carries less, the plan leaving little room to adjust.",
    modifiers: { yamato: 0.6, kikusui: 0.5, direction: -0.5 },
    reportLine: "The squadron sails and the first Kikusui waves are flown on the same days.",
  },
  {
    id: "wearThemDown",
    name: "Wear the Americans Down",
    subtitle: "Spread the attacks over the weeks and hold the army in the south",
    note: "Make the Americans pay by the day. Effort in Thirty-Second Army on Okinawa and in Reconnaissance and Direction carries further; effort in Yamato's Sortie carries less, the squadron held back for a later day.",
    modifiers: { army: 0.6, direction: 0.5, yamato: -0.5 },
    reportLine: "The attacks are spread over the weeks and the army digs in on the Shuri line.",
  },
];

KEY_BATTLE_POSTURES.okinawaJapan45 = [
  {
    id: "pickets",
    name: "The American fleet spreads radar pickets around the island",
    weight: 2,
    modifiers: { kikusui: 0.8, army: 1.1, yamato: 1.0, direction: 1.4 },
    hints: [
      "Reports show destroyers on station around Okinawa, with radar.",
      "Aircraft that return report destroyers and small craft in a ring around the island.",
    ],
    reveal: "Contact: a ring of American destroyers and small craft stands radar picket duty around Okinawa, and the attacking aircraft meet them first.",
  },
  {
    id: "kyushuStrikes",
    name: "American carriers strike the Kyushu airfields",
    modifiers: { kikusui: 0.7, army: 1.2, yamato: 0.8, direction: 1.0 },
    hints: [
      "American carrier aircraft are reported over the Kyushu airfields.",
      "Radar shows American carriers within range of Kyushu.",
    ],
    reveal: "Contact: the American carriers are within range of Kyushu and their aircraft are over the airfields, destroying the aircraft on the ground before they can fly.",
  },
  {
    id: "fleetAtAnchor",
    name: "The American fleet is crowded at anchor off the beaches",
    modifiers: { kikusui: 1.4, army: 0.9, yamato: 1.1, direction: 0.9 },
    hints: [
      "Reconnaissance reports many ships at anchor off the Hagushi beaches.",
      "A scout reports transports and cargo ships crowded off the island.",
    ],
    reveal: "Contact: the transports and the supply ships are crowded at anchor off the landing beaches, within reach of every aircraft that can get through.",
  },
];

KEY_BATTLE_ECHOES.okinawaJapan45 = {
  counter: {
    repulsed: "Yamato's squadron beat off the first American attacks and sailed on.",
    heldAtCost: "Yamato was hit and slowed, and the squadron lost two destroyers.",
    broke: "The American aircraft sank the cruiser and several destroyers, and Yamato was torpedoed.",
    gaveGround: "The squadron turned back for the Inland Sea and the sortie was called off.",
  },
  neglected: {
    kikusui: "The kamikaze attacks were thin, and the American fleet was barely troubled.",
    army: "The army on the island was left short, and the Shuri line fell sooner than planned.",
    yamato: "Yamato never sailed, and her fuel stayed in the tanks.",
    direction: "The attacks were flown without reconnaissance, and many never found their targets.",
  },
  commander: {
    ugaki: "Ugaki is at his headquarters on Kyushu, counting the aircraft that did not return.",
    ushijima: "Ushijima is in the caves of the Shuri line, with the army still around him.",
    ito: "Ito is on Yamato's bridge, with the squadron in column behind him.",
    toyoda: "Toyoda is at Combined Fleet headquarters, reading the day's reports.",
  },
};
KEY_BATTLE_TITLES.push({ id: "okinawaJapan45", seal: "IGHQ", title: "Okinawa" });

// ------------------------------------------------------------------------------------------------------------------------
// Okinawa, April to June 1945, from the American side. Hosted by okinawaAllied45, "Hold the radar picket line as planned". The
// win is the picket line holding and the fleet behind it surviving. Facts (see claims/battles-round2.json): the Fifth Fleet under
// Admiral Raymond Spruance; Vice Admiral Richmond Kelly Turner commanded the amphibious forces; Vice Admiral Marc Mitscher's Task
// Force 58 struck the Kyushu airfields; Major General Francis Mulcahy commanded the Tactical Air Force from the island; the radar
// picket stations were manned by destroyers and, from April, by landing craft carrying guns; of 101 destroyers and destroyer
// types on picket duty, 10 were sunk and 32 damaged; just over 4,900 Navy personnel were killed in the campaign.
// ------------------------------------------------------------------------------------------------------------------------
KEY_BATTLE_CONFIGS.okinawaAllied45 = {
  id: "okinawaAllied45",
  title: "Order of Battle: Okinawa",
  flavor:
    "More than a thousand ships lie off the beaches at Okinawa, and the Japanese are going to send every aircraft they can at them. A ring of destroyers stands out in front on radar picket stations to give warning and take the first blow. How the effort is spread between the pickets, the combat air patrol, the carriers' strikes on Kyushu and the repair of damaged ships decides how many of the destroyers and how many of the men in the fleet survive.",
  categories: [
    { id: "pickets", name: "The Radar Picket Destroyers", meter: "readiness", strand: "mor" },
    { id: "patrol", name: "Combat Air Patrol over the Pickets", meter: "readiness", strand: "trn" },
    { id: "strikes", name: "Carrier Strikes on Kyushu", meter: "initiative", strand: "tmp" },
    { id: "repair", name: "Repair and Damage Control", meter: "pipeline", strand: "ind" },
  ],
  // The pickets first: they are the warning and the first target. The patrol second: fighters over the stations are what stops
  // the kamikaze. The strikes third: they destroy aircraft on the ground. Repair last: it saves ships once they are hit.
  effectiveness: { pickets: 2.4, patrol: 2.2, strikes: 2.0, repair: 1.8 },
  orderOfBattle: {
    pickets: {
      units: [
        "Destroyers, destroyer escorts and minesweepers on the radar picket stations ringing Okinawa",
        "From April, landing craft armed with rockets and guns, sent out to reinforce the destroyers",
      ],
      real:
        "The pickets were the first ships the kamikaze met, and took the heaviest share of the attacks. Of 101 destroyers and similar ships assigned to the stations, 10 were sunk and 32 damaged. Sailors on the stations called them a death sentence.",
    },
    patrol: {
      units: [
        "Marine and Navy fighters flying from the Okinawa airfields and the carriers",
        "Major General Francis Mulcahy's Tactical Air Force, with the escort carriers' aircraft",
      ],
      real:
        "Fighters on patrol over the stations shot down most of the attackers. The Marine squadrons on Okinawa took over the main work from the carriers as the airfields were captured, and flew night patrols against raids.",
    },
    strikes: {
      units: [
        "Vice Admiral Marc Mitscher's Task Force 58: the fast carriers and their air groups",
        "The British Pacific Fleet's carriers, striking the airfields on the islands south of Okinawa",
      ],
      real:
        "The fast carriers struck the Kyushu airfields before and during the Kikusui attacks and destroyed many aircraft on the ground. Their ships were hit by kamikaze themselves in April and May, and several carriers were put out of action.",
    },
    repair: {
      units: [
        "Service Squadron ships at Kerama Retto, with repair ships and floating dry docks",
        "Fleet tugs and salvage vessels working at the picket stations",
      ],
      real:
        "Damaged ships were patched at Kerama Retto and many went back on station. The Navy's repair ships worked through the campaign, and tugs towed burning ships out of the line.",
    },
  },
  hardRule: {
    text: "Spruance's orders hold the stations where they are, so the pickets must stay on their stations whatever the warning costs.",
    lockApproach: "holdTheStations",
  },
  conditions:
    "Spring weather with low cloud on some days. The Japanese airfields on Kyushu and Formosa are within an hour's flight of the stations, and the fleet is anchored off the beaches in range of every raid.",
  terrainModifiers: { patrol: 1.05 },
  terrainNotes: { patrol: "land-based fighters close at hand" },
  decisions: [
    {
      id: "theStations",
      time: "1100",
      title: "The picket stations",
      prompt:
        "The first Kikusui attack is expected. Each picket station has two destroyers and a handful of smaller craft, and the fighter patrols are thin. The fleet commander can reinforce every station with more ships, pull the stations in toward the fleet, or add fighters over the stations by drawing them from the carriers' strikes.",
      options: [
        {
          id: "reinforceStations",
          name: "Reinforce every station with more destroyers and gunboats",
          note: "Gives each station more guns, and puts more ships where the attacks fall.",
          bonus: 1,
          bonusByPosture: { massedKikusui: 3, scatteredRaids: -1, nightAndWeather: 0 },
          meters: { readiness: -1 },
          costReason: "More ships exposed on the stations",
          reportLine: "More destroyers and gunboats are sent to each picket station.",
        },
        {
          id: "pullStationsIn",
          name: "Pull the stations in toward the fleet",
          note: "Fewer ships are lost on the stations, and the warning is shorter.",
          bonus: 0,
          bonusByPosture: { scatteredRaids: 3, massedKikusui: -2, nightAndWeather: 1 },
          reportLine: "The stations are drawn in toward the anchorage.",
        },
        {
          id: "moreFighters",
          name: "Draw fighters from the carriers' strikes to cover the stations",
          note: "More fighters over the pickets, and fewer aircraft to strike Kyushu.",
          bonus: 0,
          bonusByPosture: { nightAndWeather: 4, scatteredRaids: 1, massedKikusui: 1 },
          meters: { initiative: -1 },
          costReason: "Carrier aircraft taken from the strikes on Kyushu",
          reportLine: "Fighters from the carriers are sent to patrol over the picket stations.",
        },
      ],
    },
  ],
  counterattack: {
    category: "pickets",
    severity: { massedKikusui: 2, scatteredRaids: 0, nightAndWeather: 1 },
    warn: {
      1: "Radar shows a large formation of aircraft approaching the northern stations.",
      2: "Several formations are attacking at once, and the pickets are fighting alone.",
    },
    results: {
      repulsed: "The pickets and the fighters beat off the attacks, and the stations hold.",
      heldAtCost: "The stations hold, but several ships are hit and a destroyer is sunk.",
      broke: "A station is overwhelmed, and the ships on it are burned and sunk.",
      gaveGround: "The surviving pickets are pulled back toward the fleet.",
    },
  },
  categoryContext: {
    pickets:
      "The pickets are the fleet's warning and the first target of every raid. Each commitment puts more ships and guns on the stations, and puts more sailors where the attacks fall.",
    patrol:
      "Fighters on patrol over the stations shoot down the attackers before they reach the ships. Each commitment keeps more aircraft in the air longer, and puts the fighter director where it counts.",
    strikes:
      "The carriers' strikes destroy aircraft on the ground before they fly. Each commitment sends more aircraft against the Kyushu fields, and exposes the carriers that launch them.",
    repair:
      "The repair ships and the tugs save ships that are hit. Each commitment puts more crews at Kerama Retto and at sea, and gets damaged ships back on station sooner.",
  },
  flashups: {
    pickets: [
      "A destroyer on a picket station reports aircraft closing from the north.",
      "A destroyer opens fire with every gun as a kamikaze dives on her.",
      "A kamikaze strikes a destroyer's bridge and the ship burns.",
      "A landing craft with rockets joins the picket station in the evening.",
      "A destroyer circles at full speed to avoid the aircraft overhead.",
    ],
    patrol: [
      "A division of Corsairs climbs from the Yontan airfield toward the north.",
      "A fighter director sends the patrol to intercept a raid from the radar.",
      "Fighters intercept a formation of Japanese aircraft over the stations.",
      "A Marine night fighter patrols over the stations in the dark.",
      "A Hellcat pilot reports that the raid is shot down.",
    ],
    strikes: [
      "The carriers turn into the wind and launch strikes against the Kyushu airfields.",
      "Hellcats sweep over an airfield and burn the aircraft parked on it.",
      "A carrier is hit by a kamikaze and her flight deck burns.",
      "A strike returns from Kyushu with its fighters short of fuel.",
      "Bombers hit the hangars at a Kyushu airfield.",
    ],
    repair: [
      "A tug takes a burning destroyer in tow.",
      "Repair crews work through the night on a damaged ship at Kerama Retto.",
      "A repair ship secures alongside a destroyer with a shattered bow.",
      "Damage control parties fight a fire on a picket ship's deck.",
      "A salvage crew pumps out a destroyer that is sinking by the stern.",
    ],
  },
  reportTimes: { open: "0530", contact: "0800", cats: ["1000", "1200", "1400", "1600"], reserve: "1800", counter: "2000" },
  idleLines: {
    pickets: [
      "The stations keep the ships they have, and no more are sent.",
      "No more destroyers are put on the stations.",
    ],
    patrol: [
      "The fighter patrols fly their regular schedule and no more.",
      "No extra fighters are sent over the stations.",
    ],
    strikes: [
      "The carriers fly their regular strikes and no more.",
      "No extra aircraft are sent against Kyushu.",
    ],
    repair: [
      "The repair ships work at their usual pace and no more.",
      "No extra tugs and repair crews are sent to the stations.",
    ],
  },
  verdicts: ["The Picket Line Holds", "The Picket Line Is Broken"],
  verdictGrades: {
    clean:
      "The pickets gave the warning, the fighters met the raids over the stations, the carriers' strikes cut the numbers coming in, and the repair crews saved the ships that were hit.",
    costly:
      "The line held and the fleet was warned, but the pickets, the patrols and the repair crews paid more than the plan had allowed for.",
    marginal:
      "The stations held and the fleet was saved, but the fighters were too few, the strikes did too little, and the pickets paid for it.",
    total:
      "The stations were overwhelmed one after another, the fighters could not cover them, and the attacks reached the ships behind.",
  },
};

KEY_BATTLE_COMMANDERS.okinawaAllied45 = [
  { id: "turner", name: "Vice Admiral Richmond Kelly Turner", role: "Commanding the amphibious forces", category: "pickets", note: "The radar picket stations around the island were set up under his command. Effort in the Radar Picket Destroyers carries further under him.", reportLine: "Turner posts the destroyers on the stations and keeps the transports unloading." },
  { id: "mulcahy", name: "Major General Francis Mulcahy", role: "Commanding the Tactical Air Force, Tenth Army", category: "patrol", note: "The Marine and Army fighters on the island were his. Effort in Combat Air Patrol over the Pickets carries further under him.", reportLine: "Mulcahy sends the Marine squadrons from the Okinawa airfields to patrol over the stations." },
  { id: "mitscher", name: "Vice Admiral Marc Mitscher", role: "Commanding Task Force 58", category: "strikes", note: "The fast carriers were his. Effort in Carrier Strikes on Kyushu carries further under him.", reportLine: "Mitscher launches the carriers' strikes against the Kyushu airfields." },
  { id: "smith", name: "Vice Admiral William W. Smith", role: "Commanding the Service Force, Pacific Fleet", category: "repair", note: "The repair ships, tugs and floating docks were his. Effort in Repair and Damage Control carries further under him.", reportLine: "Smith's repair ships and tugs work at the stations and at Kerama Retto." },
];

KEY_BATTLE_APPROACHES.okinawaAllied45 = [
  {
    id: "holdTheStations",
    name: "Hold the Stations",
    subtitle: "Keep the pickets out where they give warning, and cover them",
    note: "Keep the ring of pickets out and strengthen it. Effort in the Radar Picket Destroyers and in Combat Air Patrol over the Pickets carries further; effort in Carrier Strikes on Kyushu carries less, the aircraft kept to cover the ring.",
    modifiers: { pickets: 0.6, patrol: 0.5, strikes: -0.5 },
    reportLine: "The pickets stay on their stations and the fighters are kept over them.",
  },
  {
    id: "strikeTheFields",
    name: "Strike the Airfields",
    subtitle: "Destroy the aircraft on the ground before they fly",
    note: "Go after the attackers at their airfields. Effort in Carrier Strikes on Kyushu and in Repair and Damage Control carries further; effort in the Radar Picket Destroyers carries less, the pickets left to look after themselves.",
    modifiers: { strikes: 0.6, repair: 0.5, pickets: -0.5 },
    reportLine: "The carriers strike the airfields day after day while the pickets keep what cover they can.",
  },
];

KEY_BATTLE_POSTURES.okinawaAllied45 = [
  {
    id: "massedKikusui",
    name: "A massed Kikusui attack",
    weight: 2,
    modifiers: { pickets: 1.2, patrol: 1.3, strikes: 0.8, repair: 1.0 },
    hints: [
      "Radio intelligence reports a large concentration of aircraft on Kyushu.",
      "Reconnaissance shows the Japanese airfields crowded with aircraft.",
    ],
    reveal: "Contact: hundreds of Japanese aircraft are in the air at once, and the stations are the first thing they find.",
  },
  {
    id: "scatteredRaids",
    name: "Scattered raids by small groups of aircraft",
    modifiers: { pickets: 0.9, patrol: 0.9, strikes: 1.4, repair: 1.0 },
    hints: [
      "Radar picks up small groups of aircraft approaching in turn.",
      "Reports show raids coming from many directions in small numbers.",
    ],
    reveal: "Contact: the Japanese are sending small groups from many fields, and the carriers' strikes on the airfields reduce them.",
  },
  {
    id: "nightAndWeather",
    name: "Raids at night and in low cloud",
    modifiers: { pickets: 1.0, patrol: 0.7, strikes: 1.0, repair: 1.4 },
    hints: [
      "Weather reports promise low cloud over the stations for the next days.",
      "Radar shows aircraft approaching in the dusk.",
    ],
    reveal: "Contact: the raids are coming in low cloud and after dark, when the fighters cannot find them, and the ships must look after themselves.",
  },
];

KEY_BATTLE_ECHOES.okinawaAllied45 = {
  counter: {
    repulsed: "The pickets and the fighters beat off the attacks, and the stations held.",
    heldAtCost: "The stations held, but several ships were hit and a destroyer was sunk.",
    broke: "A station was overwhelmed and the ships on it were burned and sunk.",
    gaveGround: "The surviving pickets were pulled back toward the fleet.",
  },
  neglected: {
    pickets: "The stations were thin, and the warning came late.",
    patrol: "Too few fighters flew over the stations, and the raids reached the ships.",
    strikes: "The carriers struck the airfields only lightly, and the raids kept coming.",
    repair: "The repair crews were short, and damaged ships stayed out of the line.",
  },
  commander: {
    turner: "Turner is on his flagship, with the station reports on the table.",
    mulcahy: "Mulcahy's Marines are on the Okinawa airfields, counting the day's kills.",
    mitscher: "Mitscher's carriers are at sea off Kyushu, with their decks full.",
    smith: "Smith's repair ships are at Kerama Retto, working through the night.",
  },
};
KEY_BATTLE_TITLES.push({ id: "okinawaAllied45", seal: "CINCPAC", title: "Okinawa" });
