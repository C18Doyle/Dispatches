const ADVISOR_DOSSIERS = {
  Mikoyan: { role: "Politburo — Lend-Lease administration", bio: "Ran the Soviet side of Lend-Lease logistics, and later acknowledged more openly than most Soviet officials how much American trucks and aviation fuel in fact mattered to the war effort.", fate: "One of the few Old Bolsheviks to survive every purge and outlast Stalin himself, dying peacefully in 1978.", faction: "soviet", rank: 2 },
  Timoshenko: { role: "Marshal — early Eastern Front command", bio: "Replaced the disgraced Pavlov after the border collapse and steadied a front that had nearly ceased to exist, at a moment when steadying anything counted as a rare success.", fate: "Sidelined from top command after mixed results at Kharkov, but survived the war and Stalin both; died in 1970.", faction: "soviet", rank: 2 },
  Shcherbakov: { role: "Political commissar — army morale and propaganda", bio: "Oversaw wartime political messaging, including the machinery Order No. 227 depended on to reach every unit in the army.", fate: "Died in 1945, days after the Berlin victory, from a heart condition worsened by the strain of the job.", faction: "soviet", rank: 3 },
  Yeryomenko: { role: "General — Stalingrad front command", bio: "Commanded the Stalingrad Front through the city's darkest months, in an uneasy command relationship with Chuikov's more famous defense inside the ruins.", fate: "Continued in senior command through the war's end; died in 1970, his role at Stalingrad often overshadowed by Chuikov's.", faction: "soviet", rank: 2 },
  Bulganin: { role: "Political commissar — Stavka liaison", bio: "A political officer attached to front commands, part of the apparatus balancing military judgment against the Party's confidence in the men making it.", fate: "Rose through postwar Soviet politics to briefly lead the government in the 1950s, before Khrushchev eclipsed him.", faction: "soviet", rank: 3 },
  Molotov: { role: "Foreign Minister", bio: "The face of Soviet diplomacy for two decades — signed the 1939 non-aggression pact with Germany, then the wartime alliance with the powers Germany had made him sign against.", fate: "Outlived Stalin, was expelled from the leadership under Khrushchev, and lived to see the Soviet Union he helped build nearly to its final years, dying in 1986.", faction: "soviet", rank: 1 },
  Ponomarenko: { role: "Head of the Central Staff of the Partisan Movement", bio: "Coordinated Soviet partisan operations behind German lines, including the mass rail-sabotage campaigns of 1943.", fate: "Moved into senior postwar Party administration; died in 1984.", faction: "soviet", rank: 3 },
  Voznesensky: { role: "Economic planner — wartime production", bio: "Directed the wartime economy, including the industrial evacuation east that arguably did as much to win the war as any single battle.", fate: "Purged and executed in 1950 in the postwar 'Leningrad Affair' — a wartime architect of Soviet victory, killed by the peace that followed it.", faction: "soviet", rank: 2 },
  Sokolovsky: { role: "General — Western axis command", bio: "A senior staff officer and field commander associated with the western thrust toward Smolensk and, later, Berlin.", fate: "Rose to Marshal after the war and commanded Soviet forces in occupied Germany; died in 1968.", faction: "soviet", rank: 2 },
  Tyulenev: { role: "General — Caucasus Front command", bio: "Commanded the defense of the Caucasus oil region against the German summer 1942 offensive, one of the war's most resource-critical fronts.", fate: "Continued in senior command through the war; died in 1978.", faction: "soviet", rank: 2 },
  Sudoplatov: { role: "NKVD — intelligence and partisan operations", bio: "Ran Soviet intelligence and sabotage operations, including partisan coordination behind German lines — a career built as much on secrecy as on results.", fate: "Arrested after Stalin's death for his ties to Beria, imprisoned for fifteen years, and later published a controversial memoir; died in 1996.", faction: "soviet", rank: 3 },
  Kaganovich: { role: "Commissar — transport and rail", bio: "Ran Soviet rail logistics, the unglamorous backbone every offensive in this campaign actually depended on to move men, fuel, and shells to the front.", fate: "A loyal Stalinist to the end, expelled from leadership under Khrushchev; died in 1991, one of the last purge-era figures still alive.", faction: "soviet", rank: 2 },
  "The Special Section": { role: "NKVD — front-line political oversight", bio: "Not one man but an institution: the NKVD's presence inside the army, tasked with monitoring officers' political reliability alongside their military judgment.", fate: "Its wartime powers and personnel were absorbed into SMERSH counter-intelligence in 1943, and later folded into the postwar security apparatus.", faction: "soviet", rank: 4 },
  Mountbatten: { role: "Chief of Combined Operations", bio: "Oversaw Britain's amphibious raiding doctrine, including the costly 1942 Dieppe raid whose lessons shaped invasion planning for the rest of the war.", fate: "Later the last Viceroy of India and a senior royal-family figure; assassinated by the IRA in 1979.", faction: "allied", rank: 2 },
  Alexander: { role: "Field Marshal — Mediterranean theater command", bio: "Held senior Allied command across North Africa and Italy, known for a diplomatic touch that kept a truly multinational command structure functioning.", fate: "Became Governor General of Canada after the war; died in 1969.", faction: "allied", rank: 2 },
  Clark: { role: "General — Fifth Army command (Italy)", bio: "Led the US Fifth Army through Salerno, Anzio, and the drive on Rome — his decision to race for the capital rather than close the trap on the retreating German Tenth Army at Valmontone remains one of the Italian campaign's most debated command calls.", fate: "Later commanded UN forces in the Korean War; died in 1984.", faction: "allied", rank: 2 },
  Portal: { role: "Chief of the Air Staff, RAF", bio: "Britain's senior airman for most of the war, and the figure most responsible for the Combined Bomber Offensive's refusal to choose between Harris's area bombing and the American precision doctrine.", fate: "Ennobled after the war; died in 1971.", faction: "allied", rank: 1 },
  Tedder: { role: "Air Marshal — Eisenhower's deputy at SHAEF", bio: "Eisenhower's own deputy supreme commander, and the chief architect of the pre-invasion Transportation Plan against the French rail network.", fate: "Continued in senior RAF leadership after the war; died in 1967.", faction: "allied", rank: 1 },
  McNaughton: { role: "General — Canadian Army command", bio: "Commanded Canadian forces training in Britain, and was among the clearest internal skeptics of the 1942 Dieppe raid's plan before it went ahead regardless.", fate: "Removed from field command in 1943 amid friction with British planners; later served in Canadian politics and diplomacy.", faction: "allied", rank: 2 },

  Manstein: { role: "Field Marshal — the operational mind", bio: "Architect of the Ardennes plan that felled France and of the eastern war's most admired counterstrokes. Argued constantly, and usually correctly, for mobile defense over rigid holding.", fate: "Dismissed by Hitler in 1944; convicted of war crimes by a British court in 1949, served four years, later advised the postwar West German army.", faction: "german", rank: 2 },
  Guderian: { role: "Colonel-General — panzer doctrine's founder", bio: "Built the armored force and the doctrine that used it, then spent the war fighting the leadership over how it was spent. Famously asked how many Germans even knew where Kursk was.", fate: "Dismissed twice; ended the war as Chief of the General Staff, released without trial in 1948.", faction: "german", rank: 3 },
  Rommel: { role: "Field Marshal — the theater commander", bio: "The desert war's defining commander and later architect of the Atlantic Wall's forward defense. His supply-line arithmetic in Africa was as sound as his tactics were bold.", fate: "Implicated — to a degree historians still debate — in the July 20 plot; forced to take poison in October 1944 in exchange for his family's safety, and buried with full honors under a state lie.", faction: "german", rank: 2 },
  Model: { role: "Field Marshal — 'the Führer's fireman'", bio: "The defensive specialist sent wherever the front was collapsing, from Rzhev to the Ruhr. Blunt, tireless, and one of few who could tell Hitler no and keep his command.", fate: "Encircled in the Ruhr pocket in April 1945; dissolved his army group rather than surrender it, then took his own life in a forest near Duisburg.", faction: "german", rank: 2 },
  Heinrici: { role: "Colonel-General — the defensive craftsman", bio: "Master of the elastic defense, most famously emptying the Seelow trenches ahead of Zhukov's bombardment. Openly contemptuous of orders that spent men for ground.", fate: "Relieved in the war's final week for refusing to sacrifice his troops in Berlin; died in 1971.", faction: "german", rank: 4 },
  Halder: { role: "Colonel-General — Chief of the General Staff", bio: "Ran the army's planning through the war's ascendant years, from Case Yellow to Barbarossa, in permanent quiet tension with Hitler's intuitions.", fate: "Dismissed in 1942; imprisoned after July 20 and sent to a concentration camp; liberated in 1945, later led the U.S. Army's German war-history program.", faction: "german", rank: 3 },
  Jodl: { role: "Colonel-General — OKW operations chief", bio: "The staff officer at Hitler's elbow for the entire war, translating intent into directives across every theater.", fate: "Signed the surrender at Reims; convicted at Nuremberg and executed in 1946.", faction: "german", rank: 3 },
  Keitel: { role: "Field Marshal — OKW chief", bio: "The high command's administrator and the regime's most reliable military signature — his nickname among officers, 'Lakeitel,' was a pun on 'lackey.'", fate: "Signed the ratified surrender at Karlshorst; convicted at Nuremberg and executed in 1946.", faction: "german", rank: 2 },
  Raeder: { role: "Grand Admiral — the surface fleet's advocate", bio: "Built the navy back from Versailles and argued the Mediterranean strategy the land-focused leadership never adopted. Spent his fleet at Norway with his eyes open.", fate: "Resigned in 1943 after Hitler threatened to scrap the surface fleet; sentenced to life at Nuremberg, released in 1955.", faction: "german", rank: 2 },
  Dönitz: { role: "Grand Admiral — the U-boat war's commander", bio: "Ran the tonnage war with cold statistical clarity, including the decision to concede the Atlantic in Black May. Hitler's unexpected named successor.", fate: "Led the 23-day Flensburg government and ordered the surrender; served ten years after Nuremberg.", faction: "german", rank: 2 },
  Göring: { role: "Reichsmarschall — the Luftwaffe's master", bio: "The air force's political chief, whose promises — Dunkirk from the air, Stalingrad by airlift — repeatedly wrote cheques his squadrons could not cash.", fate: "Convicted at Nuremberg; took poison hours before his scheduled execution in 1946.", faction: "german", rank: 1 },
  Rundstedt: { role: "Field Marshal — the old school's dean", bio: "The army's senior professional, three times dismissed and three times recalled. Advocate of the massed reserve in the west and of telling uncomfortable truths in committee.", fate: "Captured in 1945; charges were prepared but never tried owing to his health; died in 1953.", faction: "german", rank: 2 },
  Speer: { role: "Minister of Armaments — the technocrat", bio: "Ran the late-war production 'miracle' atop a system of forced and slave labor, a fact his postwar memoirs polished and historians have since restored to the ledger.", fate: "Served twenty years after Nuremberg — the architect who claimed not to have known, and profited from the claim.", faction: "german", rank: 2 },
  Ribbentrop: { role: "Foreign Minister", bio: "The diplomat of the Pact and the Axis, whose assessments — of Britain, of America, of Japan's intentions — were wrong at nearly every decisive moment.", fate: "Convicted at Nuremberg and executed in 1946, the first of the condemned to hang.", faction: "german", rank: 2 },
  Kesselring: { role: "Field Marshal — the optimist", bio: "'Smiling Albert,' commander of the Italian defense that ground the Allies down peninsula river by river. His optimism was a running staff joke and his defenses were not.", fate: "Sentenced to death by a British court for reprisal massacres in Italy, commuted; released in 1952.", faction: "german", rank: 2 },
  Bock: { role: "Field Marshal — Army Group Center's commander", bio: "Led the drive on Moscow to its winter culmination, a professional of the old Prussian school with limited patience for ideology and less for interference.", fate: "Dismissed in 1942; killed with his family in an air attack in the war's final days, May 1945.", faction: "german", rank: 2 },
  Kluge: { role: "Field Marshal — the man in the middle", bio: "Commanded in the east and then the west, courted by the resistance and never quite committed to it — a career of maintaining balance on a collapsing beam.", fate: "Recalled after the July 20 plot's suspicion touched him; took poison en route to Berlin in August 1944.", faction: "german", rank: 2 },
  Weizsäcker: { role: "State Secretary — the professional diplomat", bio: "The foreign ministry's senior civil servant, running channels and caution beneath Ribbentrop's certainties.", fate: "Convicted at the Ministries Trial for his signature on deportation documents; released in 1950; his defense counsel included his son, a future German president.", faction: "german", rank: 2 },
  Galland: { role: "Lieutenant-General — the fighter arm's voice", bio: "Fighter ace turned general who argued the defense-of-the-Reich case — fighters over bombers, quality over retaliation — and lost it until it was too late to matter.", fate: "Dismissed in early 1945 after the 'fighter pilots' revolt'; flew jets in combat in the war's last weeks; died in 1996.", faction: "german", rank: 4 },
  Wenck: { role: "General — the war's youngest army commander", bio: "Given the improvised Twelfth Army in 1945 and history's most impossible relief order. Chose, in the end, to hold a corridor for the fleeing rather than die reaching Berlin.", fate: "Led perhaps a hundred thousand soldiers and civilians into American lines; died in 1982.", faction: "german", rank: 4 },
  Weidling: { role: "General — Berlin's last commandant", bio: "Artillery officer handed the capital's final defense — a command he reportedly greeted by saying he'd rather have been shot, as ordered days earlier by mistake.", fate: "Surrendered Berlin to Chuikov; died in Soviet captivity in 1955.", faction: "german", rank: 4 },
  Böhme: { role: "General — Festung Norwegen's commander", bio: "Commanded the war's strangest asset: a 350,000-man garrison in a country nobody invaded, intact from 1940 to the end.", fate: "Surrendered Norway's garrison unbeaten in May 1945; died in custody in 1947 awaiting extradition for Balkan-era reprisals.", faction: "german", rank: 4 },
  Heisenberg: { role: "Physicist — the atomic program's face", bio: "Led a nuclear effort that was, by 1942, years behind the Allied one — starved of resources and, historians still debate how deliberately, of urgency.", fate: "Interned at Farm Hall, where hidden microphones recorded the German physicists learning of Hiroshima; led postwar German physics.", faction: "german", rank: 5 },
  Goebbels: { role: "Propaganda Minister — Berlin's Defense Commissioner", bio: "The regime's voice, who conscripted the city's children and elders into its final defense and named the myth of the Werwolf resistance.", fate: "Took his own life in the bunker in May 1945, after he and his wife murdered their six children.", faction: "german", rank: 2 },
  List: { role: "Field Marshal — Army Group A", bio: "Commanded the Caucasus drive of Case Blue until its impossible twin objectives consumed it.", fate: "Dismissed by Hitler in September 1942 for the geography's failures; sentenced at the Hostages Trial for Balkan reprisals; released in 1952.", faction: "german", rank: 2 },
  Hitler: { role: "Führer — the regime itself", bio: "This game treats him as what the record shows at the map table: the strategic center every decision orbited, whose intuitions won the gambles of 1940 and whose refusals — to withdraw, to trade ground, to hear arithmetic — drove the catastrophes after. The regime's crimes, from the camps to the planned starvation of the East, proceed from his intent; no dossier entry can or should soften that.", fate: "Took his own life in the Berlin bunker on April 30, 1945, days before the surrender, leaving instructions that the war continue.", faction: "german", rank: 0 },
  Paulus: { role: "Field Marshal — Sixth Army", bio: "The staff officer given the war's most famous field command, promoted to Field Marshal in the pocket precisely because no German officer of that rank had ever surrendered — an instruction he declined to take.", fate: "Surrendered at Stalingrad in 1943; testified for the prosecution at Nuremberg; died in Dresden in 1957.", faction: "german", rank: 2 },
  Bayerlein: { role: "General — the desert staff hand", bio: "Rommel's chief of staff in Africa, later commander of the Panzer Lehr division through Normandy's attrition and the Ardennes.", fate: "Surrendered in the Ruhr pocket; died in 1970.", faction: "german", rank: 4 },
  Westphal: { role: "General — the operations officer", bio: "Staff officer to Rommel, Kesselring, and Rundstedt in turn — the professional connective tissue of three theaters.", fate: "Ended the war as chief of staff in the west; died in 1982.", faction: "german", rank: 4 },
  Speidel: { role: "Lieutenant-General — Army Group B's chief of staff", bio: "Ran Army Group B's staff work through Normandy, kept the command functioning after Rommel's wounding, and carried real, documented ties to the officers behind July 20th that were never conclusively proven.", fate: "Arrested in September 1944 on suspicion of complicity in the plot; held but not tried before the war ended. Rehabilitated after 1945 into a senior NATO command in the 1950s — a rare postwar career for a name that close to the conspiracy.", faction: "german", rank: 3 },
  Godt: { role: "Rear Admiral — U-boat operations", bio: "Ran the day-to-day direction of the wolfpacks under Dönitz for nearly the whole tonnage war.", fate: "Briefly detained postwar; died in 1995.", faction: "german", rank: 4 },
  Zeitzler: { role: "Colonel-General — Chief of the General Staff", bio: "Halder's successor, who argued hard for Sixth Army's breakout from Stalingrad and lost the argument to the airlift promise.", fate: "Dismissed in 1944 after repeated clashes; dismissed from the army entirely without the customary courtesies; died in 1963.", faction: "german", rank: 3 },
  Gehlen: { role: "General — Foreign Armies East (FHO)", bio: "Ran eastern intelligence assessment — the confident, repeatedly wrong estimates this game keeps quoting are substantially his shop's.", fate: "Traded his files to the Americans in 1945; founded and led West Germany's postwar intelligence service until 1968.", faction: "german", rank: 4 },
  Busch: { role: "Field Marshal — Army Group Center, 1944", bio: "Held the central front's command when Bagration struck it, executing the standing no-withdrawal orders as the front dissolved around them.", fate: "Relieved during the collapse; died a British prisoner in 1945.", faction: "german", rank: 4 },
  Student: { role: "Colonel-General — the airborne's creator", bio: "Built the Fallschirmjäger arm and spent it at Crete — the victory whose casualties ended German airborne operations at scale.", fate: "Convicted for Crete-related reprisals, sentence not confirmed; released 1948; died in 1978.", faction: "german", rank: 4 },
  Manteuffel: { role: "General — the panzer commander", bio: "Led Fifth Panzer Army through the Ardennes offensive's deepest advances and the war's final battles in the east.", fate: "Postwar member of the Bundestag; died in 1978.", faction: "german", rank: 4 },
  "Terboven's staff officer": { role: "A composite voice — Reichskommissariat Norwegen", bio: "This speaker is the game's one composite character: a staff-level voice for the Norwegian occupation administration. Josef Terboven himself, Reichskommissar for Norway, ruled the country with documented brutality.", fate: "Terboven destroyed himself with dynamite in his bunker in May 1945 rather than surrender. The staff officer speaking here stands for the administrators who chose differently.", faction: "german", rank: 5 },
  Krebs: { role: "General — the last Chief of the General Staff", bio: "The final holder of the army's senior staff post, whose last professional act was negotiating with Chuikov in a Berlin basement.", fate: "Took his own life in the Reich Chancellery on May 1, 1945.", faction: "german", rank: 3 },
  Zhukov: { role: "Marshal — the Soviet war's central commander", bio: "From Khalkhin Gol to Berlin, present at nearly every decisive Soviet moment — fired for being right about Kiev, recalled to save Moscow, Leningrad, and Stalingrad.", fate: "Sidelined by Stalin after the war as too prominent; briefly Defense Minister under Khrushchev; died in 1974.", faction: "soviet", rank: 1 },
  Stalin: { role: "Supreme Commander — the dictator", bio: "Ran the war through terror, will, and a slowly learned deference to his generals — the early catastrophes were substantially his; so, historians grant, was the machine that recovered from them.", fate: "Ruled until his death in 1953; his crimes — the purges, the Gulag, engineered famine — killed millions before a single German soldier crossed the border.", faction: "soviet", rank: 0 },
  Vasilevsky: { role: "Marshal — Stavka's planner", bio: "The general staff's calm center, co-architect of Uranus and Bagration — the professional's professional, trusted by Stalin as few were.", fate: "Commanded the 1945 Manchurian campaign; died in 1977.", faction: "soviet", rank: 2 },
  Rokossovsky: { role: "Marshal — Bagration's executor", bio: "Arrested and tortured in the purges, released to become one of the war's finest front commanders — his double-axis Bagration plan was argued to Stalin's face, twice.", fate: "Later Poland's imposed Defense Minister — a Soviet marshal governing a country that never asked for him; died in 1968.", faction: "soviet", rank: 2 },
  Vatutin: { role: "General — the southern front's driver", bio: "Aggressive, gifted, and central to Stalingrad's encirclement and the Kursk defense's southern face.", fate: "Mortally wounded in a Ukrainian nationalist ambush in February 1944.", faction: "soviet", rank: 3 },
  Konev: { role: "Marshal — Zhukov's rival", bio: "The other half of the race to Berlin, given his chance at the prize by Stalin's deliberately ambiguous boundary line.", fate: "Led the suppression of the 1956 Hungarian uprising; died in 1973.", faction: "soviet", rank: 2 },
  Chuikov: { role: "General — Stalingrad's street-fighter", bio: "Held the city's rubble at hugging distance, then carried the same army to Berlin and took the capital's surrender in person.", fate: "Maintained to his death that Berlin could have fallen in February 1945; died in 1982, buried at Volgograd by his own wish.", faction: "soviet", rank: 2 },
  Tolbukhin: { role: "Marshal — the Balkan front's commander", bio: "Drove the southern advance through Romania's defection and into the Balkans.", fate: "Died in 1949, still in command in the Transcaucasus.", faction: "soviet", rank: 2 },
  Antonov: { role: "General — the staff's staff officer", bio: "Ran Stavka's operations directorate with a precision the memoirs of every marshal acknowledge; the only Soviet general awarded the Order of Victory without front command.", fate: "Served into the Warsaw Pact era; died in 1962.", faction: "soviet", rank: 3 },
  Golikov: { role: "General — the intelligence chief", bio: "Ran military intelligence in 1941 — filtering warnings of Barbarossa to match what Stalin wished to hear — then commanded fronts with mixed results.", fate: "Survived every purge and reorganization; died a Marshal in 1980.", faction: "soviet", rank: 3 },
  Zhdanov: { role: "Party chief — Leningrad's political master", bio: "Ran the besieged city's party apparatus through the starvation winters, ruthless in defense and in doctrine alike.", fate: "Died in 1948; his death was later spun into the fabricated 'Doctors' Plot' that fed Stalin's final purge.", faction: "soviet", rank: 3 },
  Eisenhower: { role: "General — Supreme Allied Commander", bio: "The coalition's manager more than its tactician — the broad front, the Berlin halt, and the alliance's cohesion were his real battlefield.", fate: "Thirty-fourth President of the United States.", faction: "allied", rank: 1 },
  Churchill: { role: "Prime Minister", bio: "The coalition's voice and its Mediterranean strategist, wrong and right in equal measure and immovable on the only question that decided 1940.", fate: "Lost the 1945 election weeks after victory; returned to office in 1951; buried at Blenheim's parish church in 1965.", faction: "allied", rank: 0 },
  Marshall: { role: "General — the organizer of victory", bio: "Built the American army from almost nothing and argued the earliest possible cross-Channel blow — Churchill called him the war's true architect.", fate: "Author of the Marshall Plan; Nobel Peace Prize, 1953.", faction: "allied", rank: 1 },
  Montgomery: { role: "Field Marshal — the set-piece master", bio: "Methodical to a fault and vain past one, but Alamein and Normandy were his — and Arnhem, the one gamble, was too.", fate: "Postwar chief of the imperial general staff and NATO deputy commander; died in 1976.", faction: "allied", rank: 2 },
  Patton: { role: "General — the pursuit commander", bio: "The Allies' finest exploiter of a broken front, whose Bastogne wheel remains a staff-college set piece.", fate: "Died in December 1945 from injuries in a road accident in occupied Germany.", faction: "allied", rank: 2 },
  Bradley: { role: "General — the GI's general", bio: "The steady operational hand of the American advance, less quotable than Patton and more trusted with an army group.", fate: "First chairman of the Joint Chiefs; the army's last five-star general; died in 1981.", faction: "allied", rank: 2 },
  King: { role: "Fleet Admiral — the Pacific's advocate", bio: "Fought the Navy's corner in every Europe First conference and kept the Pacific war resourced despite the formal priority.", fate: "Retired 1945; died in 1956.", faction: "allied", rank: 2 },
  Harris: { role: "Air Chief Marshal — Bomber Command", bio: "Prosecuted the area-bombing campaign with total conviction — a strategy postwar surveys judged less effective than the precision targeting he resisted.", fate: "The one major British commander denied a peerage after the war — the campaign's controversy attached to him permanently; died in 1984.", faction: "allied", rank: 2 },
  Spaatz: { role: "General — American strategic air", bio: "Champion of precision daylight bombing and, once escorts arrived, of the oil campaign that finally grounded the Luftwaffe.", fate: "First Chief of Staff of the independent US Air Force.", faction: "allied", rank: 2 },
  Roosevelt: { role: "President", bio: "The coalition's strategic center of gravity — Europe First, unconditional surrender, and the Yalta accommodations were all, finally, his calls.", fate: "Died in office in April 1945, weeks before the surrender he had defined.", faction: "allied", rank: 0 },
  Cunningham: { role: "Admiral of the Fleet — the Mediterranean's master", bio: "Ran the naval Mediterranean with Nelsonian aggression; his signal at Crete — 'it takes three years to build a ship, three hundred to build a tradition' — is the Royal Navy in one line.", fate: "First Sea Lord through the war's end; died in 1963.", faction: "allied", rank: 2 },
  Browning: { role: "Lieutenant-General — the airborne's commander", bio: "Led the airborne corps at Market Garden; the phrase 'a bridge too far' is attributed to his pre-battle reservation about Arnhem.", fate: "Postwar comptroller of the royal household; died in 1965.", faction: "allied", rank: 3 },
  Horton: { role: "Admiral — Western Approaches", bio: "The submariner set to catch submariners; his escort-group system and training regime broke the wolfpacks' spring in 1943.", fate: "Retired 1945; died in 1951.", faction: "allied", rank: 3 },
  Eden: { role: "Foreign Secretary", bio: "Churchill's diplomatic right hand and designated successor, managing the alliance's political seams from Moscow to Washington.", fate: "Prime Minister 1955–57; his premiership broke on Suez.", faction: "allied", rank: 2 },
  Stimson: { role: "Secretary of War", bio: "The elder statesman of the American war effort, who killed the Morgenthau Plan's harshest form and oversaw the Manhattan Project's civilian control.", fate: "Retired 1945 after arguing the bomb's use and Japan's surrender terms; died in 1950.", faction: "allied", rank: 2 },
  Morgenthau: { role: "Treasury Secretary", bio: "Proposed pastoralizing Germany — dismantling its industry permanently — a plan briefly endorsed at Quebec and then buried by its own implications.", fate: "Resigned in 1945; led postwar Jewish philanthropy on a vast scale; died in 1967.", faction: "allied", rank: 2 },

  "von Leeb": { role: "Field Marshal — Army Group North's commander", bio: "Led the drive on Leningrad and, before that, helped study the contingency plan for invading a neutral Switzerland that the Wehrmacht never executed.", fate: "Resigned in January 1942 over Hitler's no-retreat order; convicted on a minor count at the 1948 High Command Trial and released for time served; died in 1956.", faction: "german", rank: 2 },
  Bormann: { role: "Reichsleiter — head of the Party Chancellery", bio: "Hitler's indispensable gatekeeper, who absorbed Hess's authority and access after the deputy's unauthorized flight to Scotland and never relinquished either.", fate: "Died fleeing the bunker in early May 1945 — an SS companion said he took poison rather than be taken alive — though the fact stayed unconfirmed until remains found near Berlin in 1972 were DNA-matched in 1998.", faction: "german", rank: 2 },
  "K.H. Frank": { role: "SS-Gruppenführer — State Secretary, Bohemia and Moravia", bio: "The Protectorate's day-to-day enforcer, who helped direct the Lidice reprisals after Heydrich's assassination.", fate: "Convicted by a Czechoslovak court and hanged publicly in Prague on May 22, 1946.", faction: "german", rank: 3 },
  Daluege: { role: "Colonel-General — Order Police chief, Heydrich's stand-in", bio: "Took over as acting Reichsprotektor after Heydrich's assassination and oversaw the Ordnungspolizei's role in the Lidice reprisals.", fate: "Convicted by a Czechoslovak court and hanged in Prague in October 1946.", faction: "german", rank: 3 },
  Himmler: { role: "Reichsführer-SS — the SS and police empire", bio: "Ran the SS apparatus that both sponsored and distrusted Vlasov's Russian Liberation Army, and by late 1944 held the Replacement Army command that shadowed Rommel's forced suicide.", fate: "Captured by British troops attempting to flee in disguise; bit a concealed cyanide capsule and died on May 23, 1945.", faction: "german", rank: 1 },
  Vlasov: { role: "General — captured Red Army commander turned collaborator", bio: "A Soviet general taken prisoner in 1942 who agreed to front the German-sponsored Russian Liberation Army, a project the regime funded generously and trusted little.", fate: "Captured by Soviet forces in May 1945; tried for treason and hanged in Moscow on August 1, 1946.", faction: "soviet", rank: 3 },
  Skorzeny: { role: "SS-Obersturmbannführer — commando specialist", bio: "Led the glider raid that pulled Mussolini out of Gran Sasso captivity in September 1943, the exploit that made his postwar legend.", fate: "Tried at Dachau in 1947 over the Ardennes false-flag operation and acquitted; escaped internment in 1948 and settled in Spain, where he died of lung cancer in 1975.", faction: "german", rank: 4 },
  Kleist: { role: "Foreign Office — Ostministerium liaison", bio: "Ran the Foreign Office's quiet Stockholm back-channel probing Soviet intermediaries for a separate peace in late 1943, a track the leadership never seriously authorized.", fate: "Interned after the war; published memoirs on the failed contacts; died in 1971.", faction: "german", rank: 4 },
  Friessner: { role: "Colonel-General — Army Group South Ukraine's commander", bio: "Held the Romanian front when Bucharest switched sides in August 1944, a collapse no defensive scheme could have absorbed.", fate: "Relieved soon after; survived the war and died in 1971.", faction: "german", rank: 3 },
  Burgdorf: { role: "General — Hitler's chief adjutant and army personnel chief", bio: "Delivered Hitler's ultimatum to Rommel in October 1944 — suicide by poison, framed as a heart attack, in exchange for his family's safety, or a public trial.", fate: "Took his own life in the Führerbunker on May 1–2, 1945, alongside Krebs.", faction: "german", rank: 3 },
  Hausser: { role: "SS-Oberstgruppenführer — Waffen-SS field commander", bio: "One of the Waffen-SS's founding organizers, commanding Seventh Army in the Falaise pocket in August 1944, where he was severely wounded fighting clear of the encirclement.", fate: "Survived the war and later founded HIAG, the Waffen-SS veterans' lobbying organization; died in 1972.", faction: "german", rank: 3 },
  Rotmistrov: { role: "General — tank corps commander", bio: "Led armor committed to stem the German winter 1942 breakout attempts toward the Stalingrad pocket's trapped Sixth Army.", fate: "Later led the Fifth Guards Tank Army at Kursk and rose to Chief Marshal of Armored Troops; died in 1982.", faction: "soviet", rank: 3 },
  Khrulev: { role: "General — Red Army's chief of rear services", bio: "Ran Soviet military logistics, the unglamorous machinery behind Bagration's June 1944 supply and movement.", fate: "Continued in senior postwar defense-ministry roles before later administrative posts; died in 1962.", faction: "soviet", rank: 3 },
  Ironside: { role: "Field Marshal — Chief of the Imperial General Staff", bio: "Britain's senior soldier during the Norway campaign's Narvik fighting in spring 1940, a command relationship strained by the campaign's confusion.", fate: "Replaced as CIGS that same month; created Baron Ironside; died in 1959.", faction: "allied", rank: 2 },
  Gort: { role: "Field Marshal — commander of the British Expeditionary Force", bio: "Made the call to fall back on Dunkirk in May 1940 rather than fight on for a doomed link-up with French forces to the south.", fate: "Later governor of Gibraltar and Malta; died of cancer in 1946.", faction: "allied", rank: 2 },
  Halifax: { role: "Foreign Secretary — the war cabinet's other voice", bio: "Pressed the War Cabinet in late May 1940 to explore terms through Mussolini's mediation, the road not taken that Churchill closed off.", fate: "Sent as ambassador to Washington from 1941; died in 1959.", faction: "allied", rank: 2 },
  Dowding: { role: "Air Chief Marshal — Fighter Command's commander", bio: "Husbanded RAF Fighter Command's strength through the Battle of Britain, wary of the 'Big Wing' tactics Leigh-Mallory and Park's squadrons argued over.", fate: "Relieved of command that November amid the tactical dispute; ennobled after the war; died in 1970.", faction: "allied", rank: 2 },
  "Leigh-Mallory": { role: "Air Marshal — AOC No. 11 Group, the 'Big Wing' advocate", bio: "Pushed the massed-squadron 'Big Wing' approach against Park's more cautious interceptions during the Battle of Britain.", fate: "Killed in a plane crash in the French Alps in November 1944, en route to a new Southeast Asia command.", faction: "allied", rank: 3 },
  Pound: { role: "Admiral of the Fleet — First Sea Lord", bio: "Ordered convoy PQ-17 to scatter in July 1942 on fragmentary intelligence of the battleship Tirpitz's movements, a decision that cost the convoy most of its ships.", fate: "Resigned in September 1943 after a series of strokes; died weeks later, on October 21, 1943, of a brain tumor.", faction: "allied", rank: 1 },
  Tovey: { role: "Admiral — Commander-in-Chief, Home Fleet", bio: "Commanded the covering force for convoy PQ-17 in July 1942 and had argued against the scatter order Pound issued from London.", fate: "Retired in 1946; died in 1971.", faction: "allied", rank: 2 },
  "de Gaulle": { role: "General — leader of Free France", bio: "Denounced the Allies' November 1942 deal recognizing Vichy's Admiral Darlan in North Africa as a betrayal of principle for expedience.", fate: "Led the postwar provisional government, later founded the Fifth Republic and served as its President from 1959 to 1969; died in 1970.", faction: "allied", rank: 1 },
  Dulles: { role: "OSS — Bern station chief", bio: "Ran American intelligence's Swiss listening post, cultivating the resistance contacts that fed Washington's picture of the opposition inside Germany through 1944.", fate: "Later the first civilian Director of Central Intelligence, serving until 1961; died in 1969.", faction: "allied", rank: 3 },
  Horrocks: { role: "Lieutenant-General — XXX Corps commander", bio: "Led the ground column meant to relieve Arnhem's airborne perimeter in September 1944, stalled short by a single blown bridge and a road too narrow for the plan.", fate: "Retired in 1949 owing to war wounds; became a television historian and broadcaster; died in 1985.", faction: "allied", rank: 3 },
  Urquhart: { role: "Major General — 1st Airborne Division commander at Arnhem", bio: "Commanded the division dropped too far from its objective and left holding a shrinking perimeter through late September 1944.", fate: "Continued a postwar army career; died in 1988.", faction: "allied", rank: 3 },
  Truscott: { role: "Major General — VI Corps commander at Anzio", bio: "Took over the Anzio beachhead's stalled corps in the winter siege of early 1944 and led the eventual breakout that spring.", fate: "Later commanded Fifth Army and, briefly, Third Army; died in 1965.", faction: "allied", rank: 3 },
  Kirk: { role: "Rear Admiral — commander, Western Naval Task Force", bio: "Ran the naval side of the Omaha Beach landings on the morning of June 6, 1944, as the assault stalled on the sand below the bluffs.", fate: "Later a career diplomat, serving as ambassador to Belgium, the Soviet Union, and Taiwan; died in 1963.", faction: "allied", rank: 3 },
  Gerow: { role: "Major General — V Corps commander at Omaha", bio: "Commanded the corps fighting for a foothold above Omaha Beach on June 11, 1944, days after the landing's costliest hours.", fate: "Later commanded Fifteenth Army; died in 1972.", faction: "allied", rank: 3 },

  Mussolini: { role: "Duce — head of government (to July 1943); RSI head of state (Sept 1943–Apr 1945)", bio: "Took Italy into the 'parallel war' on Germany's coattails in 1940, convinced a fast, cheap victory was there to be claimed; presided instead over a series of unforced disasters in Greece and North Africa that made the dependence he'd hoped to avoid unavoidable.", fate: "Captured by Communist partisans fleeing toward Switzerland on April 27, 1945; shot the next day and displayed hanging in a Milan piazza.", faction: "italy", rank: 1 },
  Badoglio: { role: "Marshal — Chief of Comando Supremo (1925–Dec 1940); Prime Minister (July 1943–June 1944)", bio: "Ran Italy's armed forces through the war's opening disasters and resigned after Greece; recalled by the King in 1943 to negotiate the armistice he had no part in causing.", fate: "Retired after the war; died in 1956.", faction: "italy", rank: 2 },
  Graziani: { role: "Marshal — Army Chief of Staff and Libya commander (1940); RSI Minister of Defense (1943–45)", bio: "Presided over the Tenth Army's destruction in Operation Compass, then returned in 1943 as the Republic of Salò's defense minister, building the only real RSI military the client state had.", fate: "Convicted of collaboration after the war, sentenced to 19 years, served under a year before amnesty; died in 1955.", faction: "italy", rank: 2 },
  Cavallero: { role: "Marshal — Chief of Comando Supremo (Dec 1940–Jan 1943)", bio: "Took personal command in Albania to stabilize the Greek front's winter collapse, then oversaw the North African seesaw campaign through its worst years.", fate: "Found dead, reportedly by his own hand, in September 1943, days after the armistice — accounts of exactly what happened remain disputed.", faction: "italy", rank: 2 },
  Ambrosio: { role: "General — Chief of Comando Supremo (Feb–Nov 1943)", bio: "Took over Comando Supremo amid North Africa's collapsing front in early 1943 — months before Tunisia's final surrender — and became one of the central military figures pressing for a break with Germany that culminated in the July 1943 coup.", fate: "Retired after the armistice government reorganized its command; died in 1958.", faction: "italy", rank: 2 },
  Ciano: { role: "Foreign Minister (1936–Feb 1943); Grand Council member", bio: "Mussolini's son-in-law and foreign minister, increasingly skeptical of the German alliance by 1943; voted with the majority to restore constitutional authority to the King at the Grand Council.", fate: "Arrested by the RSI and executed by firing squad at Verona in January 1944 for that vote, on his father-in-law's order.", faction: "italy", rank: 2 },
  "Victor Emmanuel III": { role: "King of Italy", bio: "Stayed largely silent through two decades of Fascist rule, then used his still-intact constitutional authority to dismiss and arrest Mussolini in July 1943 once the Grand Council's own vote gave him the opening.", fate: "Abdicated in favor of his son in May 1946 days before the referendum that abolished the monarchy; died in exile in Egypt in 1947.", faction: "italy", rank: 1 },
  Cavagnari: { role: "Admiral — Chief of Naval Staff (to Dec 1940)", bio: "Signed off on Taranto's harbor defenses without the torpedo nets those defenses assumed were in place, a gap the November 1940 raid exposed in a single night.", fate: "Resigned in the aftermath of the Taranto raid; died in 1966.", faction: "italy", rank: 3 },
  Iachino: { role: "Admiral — battle fleet commander (Dec 1940–1943)", bio: "Took over the battle fleet after Taranto and commanded it at Cape Matapan, a night action Italian doctrine wasn't trained to fight against a British force reading Italian naval codes.", fate: "Relieved of sea command in 1943 after criticism of his Mediterranean convoy actions; died in 1976.", faction: "italy", rank: 3 },
  Bastico: { role: "Marshal — Governor of Libya and Italian theater commander, North Africa (1941–43)", bio: "Held nominal authority over Rommel's Afrika Korps for most of the desert seesaw campaign, an arrangement more often honored on paper than in the field.", fate: "Recalled after El Alamein; died in 1972.", faction: "italy", rank: 3 },
  Messe: { role: "General — commander, 1st Italian Army, Tunisia (1943)", bio: "Took over the reinforced Tunisia bridgehead in early 1943 and commanded the last organized Axis resistance in North Africa through its final collapse.", fate: "Surrendered the last Axis forces in Tunisia in May 1943, promoted to Field Marshal by radio hours beforehand; later served as a postwar senator; died in 1968.", faction: "italy", rank: 3 },
  Castellano: { role: "General — secret armistice negotiator (1943)", bio: "Conducted the covert negotiations with Allied representatives in Lisbon and Sicily that produced the September 1943 armistice.", fate: "Continued to serve in the postwar Italian army; died in 1977.", faction: "italy", rank: 3 },
  Pavolini: { role: "Republican Fascist Party secretary; Black Brigades organizer (RSI)", bio: "Ran the Italian Social Republic's party apparatus and its anti-partisan Black Brigades militia, pushing the regime's hardest line through its final, shrinking territory.", fate: "Captured and shot with Mussolini's group at Dongo in April 1945.", faction: "italy", rank: 3 },
  Utili: { role: "General — Italian Co-Belligerent Army combat commander", bio: "Commanded the Corpo Italiano di Liberazione and later the Gruppo di Combattimento 'Legnano,' the Co-Belligerent Army's combat formations built up through 1943–44 to fight alongside Allied forces.", fate: "Continued a postwar Italian army career; died in 1972.", faction: "italy", rank: 4 },
};

const OBJECTIVES = [
  { id: "historian", title: "The Historical Officer", desc: "Match the historical decision at 90%+ of comparable points." },
  { id: "betterThanOKW", title: "Better Than OKW", desc: "Outperform the historical choice at 60%+ of comparable points." },
  { id: "longDefense", title: "The Long Defense", desc: "Keep organized resistance running to October 1945 or beyond." },
  { id: "armyPreserved", title: "The Army Preserved", desc: "Finish a war with Manpower at +4 or better." },
  { id: "relieved", title: "Relieved of Command", desc: "Preside over a front collapse — some lessons only teach themselves this way." },
  { id: "neverEast", title: "The War That Never Went East", desc: "Find the war in which Barbarossa was never launched." },
  { id: "untouchedArmy", title: "The Untouched Army", desc: "End the war holding Festung Norwegen, intact and unbeaten." },
  { id: "againstOdds", title: "Against the Odds", desc: "Complete a war whose exact dice path had under 5% compound likelihood." },
  { id: "ironWill", title: "Iron Will", desc: "Complete a German war in Führer Mode." },
  { id: "quietHeresies", title: "The Quiet Heresies", desc: "In Führer Mode, spend every point of political capital defying the command structure." },
  { id: "survivedTheTerror", title: "Survived the Terror", desc: "Complete a Soviet war under NKVD Mode without being recalled." },
  { id: "recalled", title: "Recalled to Moscow", desc: "Find out what NKVD Mode was watching for." },
  { id: "grandAlliance", title: "The Grand Alliance", desc: "Finish a war under Yalta Mode with Coalition Cohesion strongly positive." },
  { id: "papersOverCracks", title: "Paper Over the Cracks", desc: "Finish a war under Yalta Mode with Coalition Cohesion critically frayed — and hold the alliance together anyway." },
  { id: "romeActsAlone", title: "Rome Acts Alone", desc: "Complete an Italian war under Axis Mode without being superseded." },
  { id: "supersededByBerlin", title: "Case Achse, Early", desc: "Find out what Axis Mode was watching for." },
  { id: "germanHistorian", title: "By the Book, OKW", desc: "Complete a German war matching the historical record at nearly every comparable decision." },
  { id: "sovietHistorian", title: "By the Book, STAVKA", desc: "Complete a Soviet war matching the historical record at nearly every comparable decision." },
  { id: "alliedHistorian", title: "By the Book, SHAEF", desc: "Complete an Allied war matching the historical record at nearly every comparable decision." },
  { id: "moscow", title: "The Kuibyshev Lesson", desc: "Capture Moscow — and learn what it does and doesn't decide." },
  { id: "speculativeFile", title: "The Speculative File", desc: "Reach one of the campaign's rarest speculative endings — the two armistices, or the earliest end this war ever reaches." },
  { id: "aheadOfHistory", title: "Ahead of History", desc: "Finish a war meaningfully earlier than it actually ended — from either side that wanted it over." },
  { id: "bankedAndSpent", title: "Banked and Spent", desc: "Reach one of the surplus-only decisions and take it — a choice available solely to a command that arrived with something left." },
  { id: "casablancaHeld", title: "The Position Held", desc: "Refuse separate terms with the war visibly ending and the offer on the table." },
  { id: "threeCommands", title: "Four Commands", desc: "Complete a war from every high command — German, Soviet, Allied, and Italian." },
  { id: "italianHistorian", title: "By the Book, Comando Supremo", desc: "Complete an Italian war matching the historical record at nearly every comparable decision." },
];

// The meta-save unlock (feature request: reward a player who clears every OBJECTIVES entry
// across their save history, not just within one run — record.objectives already accumulates
// across runs via saveRunRecord(), this is the payoff for that accumulation). Text written to
// read as the last page of the same institutional dossier voice the rest of the game uses —
// not a congratulatory banner, a closing file note.
const FULL_CLEARANCE_DEBRIEF =
  "Every objective on file has now been closed, across all four commands. No single desk sees " +
  "the whole war while it is happening — that was true in 1940 and it is true of this exercise. " +
  "OKW never read STAVKA's cables. SHAEF never saw the Wolf's Lair minutes. Comando Supremo answered " +
  "to Berlin more than it ever admitted, and after September 1943, split into two desks that no " +
  "longer answered to each other at all. The file in front of you now is the only vantage that ever " +
  "held all four at once, and it only exists because someone sat through the historical record, the " +
  "counterfactual record, and everything in between, from more than one chair.\n\nThere is no further " +
  "clearance above this one. The record stands complete — which, on a file this size, is its own kind " +
  "of rare ending.";

function evaluateObjectives(ctx) {
  const { campaignId, flags, meters, log, rewinds, mode, favor } = ctx;
  const comparable = (log || []).filter((e) => e.histSum != null);
  const matched = comparable.filter((e) => e.isHistorical).length;
  const outperformed = comparable.filter((e) => e.sum > e.histSum).length;
  const rolls = (log || []).filter((e) => e.rollP != null);
  const compound = rolls.reduce((a, e) => a * e.rollP, 1);
  const earned = [];
  if (comparable.length >= 8 && matched / comparable.length >= 0.9) earned.push("historian");
  if (campaignId === "german" && comparable.length >= 8 && matched / comparable.length >= 0.9) earned.push("germanHistorian");
  if (campaignId === "soviet" && comparable.length >= 6 && matched / comparable.length >= 0.9) earned.push("sovietHistorian");
  if (campaignId === "allied" && comparable.length >= 6 && matched / comparable.length >= 0.9) earned.push("alliedHistorian");
  if (campaignId === "italy" && comparable.length >= 6 && matched / comparable.length >= 0.9) earned.push("italianHistorian");
  if (comparable.length >= 8 && outperformed / comparable.length >= 0.6) earned.push("betterThanOKW");
  if (
    campaignId === "german" &&
    // "The Long Defense" is a DURATION achievement, so it reads OKW's endurance rather than its
    // initiative. Those are different quantities for this command and frequently opposed: the
    // longest German wars are yielding ones. Keyed to initiative it rewarded the opposite run.
    (typeof CAMPAIGNS.german.endurance === "function" ? CAMPAIGNS.german.endurance(flags, meters) : 0) >= 4 &&
    !["earlyCollapse", "collapse44", "noBarbarossa", "armisticeWest", "eastArmistice"].includes(flags.pathVariant)
  )
    earned.push("longDefense");
  if ((meters.manpower || 0) >= 4) earned.push("armyPreserved");
  if (flags.pathVariant === "earlyCollapse" || flags.pathVariant === "collapse44") earned.push("relieved");
  if (flags.pathVariant === "noBarbarossa") earned.push("neverEast");
  if (flags.northStand === "held") earned.push("untouchedArmy");
  if (rolls.length >= 2 && compound < 0.05) earned.push("againstOdds");
  if (campaignId === "german" && mode === "iron" && !flags.dismissed) earned.push("ironWill");
  if (mode === "iron" && favor === 0 && !flags.dismissed) earned.push("quietHeresies");
  if (campaignId === "soviet" && mode === "purge" && !flags.purged) earned.push("survivedTheTerror");
  if (flags.purged) earned.push("recalled");
  // Early-finish objectives. "Ahead of History" only counts for the two commands that actually
  // wanted the war over sooner — a German war ending early is a defeat arriving faster, not an
  // achievement, so it is deliberately excluded rather than quietly rewarded.
  if (
    (campaignId === "soviet" && (flags.berlinFeb45 || flags.berlinEnveloped45)) ||
    (campaignId === "allied" && flags.westernCollapse45)
  )
    earned.push("aheadOfHistory");
  if (
    flags.earlyDnieper43 ||
    flags.forwardSupply44 ||
    flags.berlinEnveloped45 ||
    flags.antwerpSeptember ||
    flags.dispersedReich45
  )
    earned.push("bankedAndSpent");
  if (flags.westernCollapse45 === "unconditional") earned.push("casablancaHeld");
  if (campaignId === "allied" && mode === "coalition" && (flags.cohesion || 0) >= 3) earned.push("grandAlliance");
  if (campaignId === "allied" && mode === "coalition" && (flags.cohesion || 0) <= -4 && !flags.relieved) earned.push("papersOverCracks");
  if (campaignId === "italy" && mode === "axis" && !flags.superseded) earned.push("romeActsAlone");
  if (flags.superseded) earned.push("supersededByBerlin");
  if (flags.moscowCaptured) earned.push("moscow");
  if (flags.pathVariant === "armisticeWest" || flags.pathVariant === "eastArmistice" || flags.hitlerDead44 === "valkyrieSucceeds") earned.push("speculativeFile");
  return earned;
}

async function withRetry(fn, attempts = 3, delayMs = 250) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}

async function saveActiveRun(payload) {
  try {
    await withRetry(() => window.storage.set("ww2-command-active", JSON.stringify(payload)));
    return true;
  } catch (e) {
    return false;
  }
}

async function clearActiveRun() {
  try {
    await withRetry(() => window.storage.delete("ww2-command-active"));
  } catch (e) {
    // nothing to clear
  }
}

async function saveRunRecord(campaign, flags, meters, visited, mode, log, rewinds, favor) {
  try {
    let record = { runs: [], nodes: [] };
    try {
      const existing = await window.storage.get("ww2-command-record");
      if (existing && existing.value) record = JSON.parse(existing.value);
    } catch (e) {
      // no existing record — first run
    }
    record.runs = (record.runs || []).slice(-24);
    record.runs.push({
      when: Date.now(),
      label: campaign.positionLabel ? campaign.positionLabel(flags, meters) : null,
      endDate: campaign.projectedEnd ? campaign.projectedEnd(flags, meters).stamp : null,
      mode: mode || "open",
    });
    record.nodes = [...new Set([...(record.nodes || []), ...visited])];
    const earned = evaluateObjectives({ campaignId: campaign.id, flags, meters, log, rewinds, mode, favor });
    record.objectives = [...new Set([...(record.objectives || []), ...earned])];
    record.campaignsPlayed = [...new Set([...(record.campaignsPlayed || []), campaign.id])];
    if (record.campaignsPlayed.length >= Object.keys(CAMPAIGNS).length && !record.objectives.includes("threeCommands"))
      record.objectives.push("threeCommands");
    const advisors = record.advisors || {};
    (log || []).forEach((e) => {
      if (e.advisor) advisors[e.advisor] = (advisors[e.advisor] || 0) + 1;
    });
    record.advisors = advisors;
    // Grand Campaign prototype: keep only the most recent completion per campaign — this isn't
    // a history, just "what's available to seed a Grand Campaign leg with right now" (per the
    // spec). Written unconditionally, regardless of GRAND_CAMPAIGN_ENABLED — cheap, and means
    // legacy data is already accumulating by the time the feature is ready to leave prototype.
    record.legacy = record.legacy || {};
    record.legacy[campaign.id] = { flags, meters, endDate: campaign.projectedEnd ? campaign.projectedEnd(flags, meters).stamp : null, when: Date.now() };
    await withRetry(() => window.storage.set("ww2-command-record", JSON.stringify(record)), 5, 400);
    return true;
  } catch (e) {
    return false;
  }
}

function resolveStage(campaign, position, flags, meters) {
  return campaign.dynamic
    ? campaign.resolveNode(position, flags, meters)
    : campaign.getStage(position, flags, meters);
}

// A saved run is only safe to offer for resume if it matches the current save-schema version
// AND the node it points at still actually resolves against the current campaign data. Node
// names and structure have changed repeatedly over this project's life — an old save pointing
// at a since-renamed or removed node would otherwise crash the resume flow instead of just
// failing to load. Invalid saves are treated as if they don't exist, not surfaced as an error.
function isValidActiveRun(saved) {
  if (!saved || typeof saved !== "object") return false;
  if (saved.version !== SAVE_VERSION) return false;
  const campaign = CAMPAIGNS[saved.campaignId];
  if (!campaign || !saved.position) return false;
  try {
    const stage = resolveStage(campaign, saved.position, saved.flags || {}, saved.meters || EMPTY_METERS);
    if (!stage || !stage.choices || !stage.choices.length) return false;
  } catch (e) {
    return false;
  }
  return true;
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // Nothing to report to — this is a client-only artifact. Keeping the error
    // visible in the console is the best available diagnostic for a bug report.
    console.error("WW2 Command crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center px-4 py-10 text-center">
          <div className="bg-white text-black shadow-[0_8px_30px_rgba(0,0,0,0.5)] w-full max-w-md p-8">
            <h2 className="text-2xl mb-3" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600 }}>
              The File Was Damaged
            </h2>
            <p className="text-[14px] leading-relaxed mb-6 text-[#000000]" style={{ fontFamily: "'Courier Prime', monospace" }}>
              Something in this session went wrong in a way the game couldn't recover from on its own.
              Your progress autosaves as you play, so reloading should return you to the menu with a
              "War in Progress" option to resume close to where you left off.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full border-2 border-black px-4 py-3 text-sm uppercase tracking-[0.2em] font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

