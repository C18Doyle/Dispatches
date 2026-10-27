import { flag, all, any, not, res } from "./lib.mjs";

const end = (id, title, kind, headline, text, variants) => {
  const e = { id, title, kind, headline, text };
  if (variants?.length) e.variants = variants.map(([cond, headline, text]) => ({ ...(cond.flag && Object.keys(cond).length === 1 ? { flag: cond.flag } : { when: cond }), headline, text }));
  return e;
};

export const endings = [
  // ───────────── the three ways to be ruined ─────────────
  end(
    "ENDING_CRISIS_EVIDENCE",
    "The Case Collapses",
    "failure",
    "FAMOUS DETECTIVE'S 'NAPOLEON' CALLED A FANCY: THE PROFESSOR THANKS THE POLICE",
    "It goes slowly, and then all at once. A witness retracts. A ledger is found to be a copy, and the copy a forgery. A bank-book that should have hanged a man is found to be in the wrong year. By the time the Assistant Commissioner closes the file, there is nothing left in it that a jury would look at twice. Professor Moriarty is invited to dine with the Lord Mayor in the autumn, and sends his regrets. You are not invited anywhere. In Baker Street the files lie where you left them, and every one of them is perfectly true, and not one of them can be proved.",
  ),
  end(
    "ENDING_CRISIS_STANDING",
    "The Discredited Detective",
    "failure",
    "BAKER STREET 'CONSULTANT' WARNED BY MAGISTRATE: A MAN WHO SEES CONSPIRACIES",
    "A man may be right a hundred times and wrong once, and the world will remember only the once. By the end of the month there is a paragraph in the Standard, a joke in Punch, a letter from the Home Office and a visit from a quiet gentleman of the Yard. You are told, with every courtesy, that the Metropolitan Police will no longer be requiring your assistance. The clients stop coming. The telegrams stop coming. The Professor, meanwhile, has taken a villa at Sevenoaks and is said to be writing a book. You play the violin, and the street below goes by without looking up.",
  ),
  end(
    "ENDING_CRISIS_NERVE",
    "The Black Dog",
    "failure",
    "CELEBRATED DETECTIVE TAKEN ILL: DOCTOR FORBIDS ALL VISITORS",
    "There is a limit to what a mind can do without sleep, and you have been past it since March. It comes in the small hours, in a silence so total that you hear the blood in your ears: a heaviness, a sullen refusal of the machine to turn. You sit in the chair and cannot rise. Watson comes at dawn with his bag and his grave, tired face, and sits with you through the morning, and says nothing that is not kind. The Professor has won nothing. He has only waited. A man who has driven himself so hard, you understand, needs no enemy in the end.",
  ),

  // ───────────── the Yard ─────────────
  end(
    "ENDING_NET_CLOSES",
    "The Net Closes",
    "narrative",
    "NAPOLEON OF CRIME TAKEN AT LAST: PROFESSOR MORIARTY IN CUSTODY",
    "The trial at the Old Bailey lasts eleven days. Professor Moriarty stands in the dock with his hands folded, a tall, patient, scholarly figure, and listens to the whole of it with the attentive politeness of a man at a lecture. When the verdict is read he inclines his head, as if to a colleague whose argument he had expected. The sentence is penal servitude for life. In the weeks that follow, the network that took ten years to build falls into pieces, and a hundred small crimes across London simply stop. Lestrade shakes your hand on the steps of the court. 'I'll not say I understood it,' he says. 'But I'll say it was done right.'",
    [
      [flag("lawFirst"), "THE LAW HAS ITS DAY: NO BARGAIN WITH THE PROFESSOR", "The trial lasts eleven days, and it is held in public, to the last witness, because you refused your brother's quiet arrangement. The names in the Professor's second ledger are read out in open court, and two Members of Parliament resign before the week is out. The Government is furious. The press is rapturous. You receive a short note from Mycroft, written in a hand that is noticeably less steady than usual. It says only: 'You were right, and I shall never forgive you.' The Professor goes down for life, and so, in due course, do eleven men of rank."],
      [flag("moleExposed"), "A TRAITOR IN THE YARD AND A NAPOLEON IN THE DOCK", "The trial lasts eleven days. The Professor is convicted, and so is Sergeant Pike, who sells the Yard's secrets in the same dock. The Yard is ashamed and grateful in about equal measure, and the shame lasts longer. Lestrade is made Chief Inspector. You are asked to dinner by people who would not have asked you in January. It is a victory that leaves a taste in the mouth: the net is closed, and a good many hands have been burned by it."],
      [flag("mycroftFavour"), "A QUIET WORD IN WHITEHALL, AND THE NET CLOSES", "The trial lasts eleven days, and it runs more smoothly than a trial of its kind has any right to. Doors open. Witnesses arrive. A file that was lost is found again. You know whom to thank, and you know that one day you will be asked to return the favour. The Professor is sentenced to penal servitude for life, and Lestrade shakes your hand on the court steps, and does not ask why the road was so clear."],
    ],
  ),
  end(
    "ENDING_NAPOLEON_ESCAPES",
    "The Napoleon Escapes",
    "narrative",
    "GREAT ROUND-UP AT SCOTLAND YARD: PRINCIPAL STILL AT LARGE",
    "The gang is broken, and the Professor is not. The newspapers print the numbers: thirty-one arrested, nineteen convicted, a bishop's secretary in the dock. Of the man whose organisation it was, they print only a name, and a question. He is believed to have left England. He is believed to be in Lisbon, or Vienna, or Buenos Aires. He is believed, by the more imaginative papers, to have died. You know better. Somewhere there is a mild, tall man in a quiet room who has begun again. The war is not over. It has only changed address, and you will have to follow it.",
    [
      [all({ branch: "STREET" }, flag("boyLost")), "THE WAR ENDS WITHOUT AN END", "The Professor goes down the river in the dark, and you let him, and walk the length of Narrow Street with Alf's name in your head. You have not won, and you have not been beaten, and there is a boy in a grave at Limehouse to tell you that it was not a game. Wiggins does not speak to you for a month. When he does, he asks only, in a very small voice, whether it was worth it. You tell him that you do not know. It is the first true thing you have said to him in a year."],
      [{ branch: "YARD" }, "THE NET WAS DRAWN. THE FISH WERE NOT ALL IN IT", "The lieutenants go to prison for ten years, fifteen years, life. The Professor goes nowhere at all. The Yard's inquiries lead to Calais, then to Marseilles, then into a long, grey silence. Lestrade says it was a fine piece of work. You say that it was half a piece of work. You are both right. The Professor's chair stands empty in his study at Kensington, with the chess game unfinished, and black to move."],
      [flag("mycroftFavour"), "A BROTHER WHO KNEW WHERE", "The Professor leaves England by a route that the Yard never finds. Mycroft finds it for you, and sends a single line on Foreign Office paper: 'He sailed from Antwerp on Tuesday. I thought you should know. I did not think you should do anything about it.' You keep the note in the drawer with the ledger. The war goes on, but it goes on at a distance, and your brother is now a party to it."],
    ],
  ),
  end(
    "ENDING_REASON_OF_STATE",
    "Reason of State",
    "narrative",
    "PROFESSOR MORIARTY: A SEALED PROCEEDING AT THE OLD BAILEY",
    "He is never tried in public. A closed court is convened by a judge whose name is not in the paper, in a room that does not appear on any plan of the building, and when it rises, the Professor is gone. Some say he is in Dartmoor under another name. Some say he is a guest of the Government in a house in the country. No one says that he is free, and no one says that he is not. The Prime Minister thanks you in a private letter for your discretion. Mycroft sends a case of claret. You drink none of it. Somewhere, in a locked drawer in Whitehall, a grey cloth ledger lies in the dark, and a good many men sleep a little easier.",
    [
      [flag("mycroftTold"), "THE GOVERNMENT CLOSES ITS OWN LEDGER", "You know what is in the second ledger, because Mycroft told you. You know who is in it, and why they are not in the dock. The knowledge sits in you like a cold stone. The Professor has been disposed of with every propriety, and a nation's secrets have been kept, and your brother has never in his life been so pleased with you. You wonder, in the small hours, whether you have served the law or merely the men who write it."],
    ],
  ),

  // ───────────── the streets ─────────────
  end(
    "ENDING_PRIVATE_WAR",
    "The Private War",
    "narrative",
    "MYSTERY OF THE LIMEHOUSE WHARF: BODY OF A TALL MAN TAKEN FROM THE THAMES",
    "They find him on the second morning, caught in the piles at Limehouse, and the coroner records an open verdict. There is nothing to connect the drowned man with the Professor except the shape of his forehead and the fact that, within a month, the great grey organisation of the City is in ruins. Banks close their doors. Lieutenants turn on each other. The cab-yards, the printing-shops and the public-houses are quiet. London does not know who did it. The Yard has a suspicion, and does not trouble to pursue it. You have won the war, in your own way, and the only decoration you will receive is the silence of men who prefer not to ask.",
    [
      [flag("boyLost"), "A WAR WON, A BOY LOST", "They find the Professor on the second morning, and a month later they find nothing at all left of his organisation. Wiggins comes to Baker Street in his best coat, and stands in the sitting-room with his cap in his hands. 'It was worth it, wasn't it, Mr Holmes?' he says. You say yes. It is the only lie you have ever told him, and he knows it, and he thanks you for it. The boys never speak of Alf. They carry on, and are very quiet."],
      [flag("boyFound"), "THE IRREGULARS' VICTORY", "They find the Professor on the second morning, and a month later the whole of his organisation has dissolved like sugar in water. The Irregulars have a party, in the kitchen at Baker Street, with a ham and a cake and a barrel of ginger-beer. Alf, with his arm in a sling, makes a speech that nobody can hear for cheering. Wiggins makes you stand on a chair. You have never in your life been so embarrassed, or so happy."],
      [flag("vigilante"), "NO ONE ASKED HOW", "The Professor is gone, and the Yard is relieved, and nobody mentions the Shoreditch counting-house or the cab-yard or the printer's shop. Lestrade comes to Baker Street, accepts a whisky, and says only that if there should be any more unfortunate accidents of the sort, it would be a kindness if the gentleman responsible would let him know in advance. You promise that there will be none. It is a promise you mean. It is also, you think, the last one you are sure of."],
    ],
  ),
  end(
    "ENDING_BAKER_STREET_BURNS",
    "Ashes in Baker Street",
    "narrative",
    "FIRE IN BAKER STREET: FAMOUS LODGINGS DESTROYED; THE PROFESSOR UNSEEN",
    "You are fished out at Wapping Stairs by a lighterman who takes you for a drowned seaman, and carried to a lodging-house with a cup of tea and a blanket. The house in Baker Street is a charred shell by the time you reach it. The papers are ash. The violin is a few burnt strings in the cellar. Of the Professor's organisation, the newspapers report that it has survived the police, the Yard and the Shadow War, and has emerged, if anything, stronger. London goes about its business. You stand in the wet street with Watson, and look up at the black, empty windows, and begin to think about what it is that you have left to lose.",
    [
      [flag("hudsonSafe"), "BAKER STREET LOST. MRS HUDSON SAFE IN BRIGHTON", "The house is gone, and the Professor is not, and there is only one thing to be thankful for: Mrs Hudson, who is a hundred miles away in Brighton with a hamper and a cold. She comes up on the first train, in her black bonnet, and stands in the road with her hands folded. 'Seventeen steps, I counted them every morning,' she says, in a voice that is not at all steady. 'Well. They're gone now. Come along to Brighton, the pair of you, and have a decent breakfast.'"],
    ],
  ),
  end(
    "ENDING_THE_COMPACT",
    "The Professor's Terms",
    "narrative",
    "SOCIETY NOTES: A CELEBRATED CONSULTANT RETIRES TO THE COUNTRY",
    "It is a very handsome house, with a library and a long garden that runs down to a stream, and you are told that the money will come from a bank in Zurich. You are not told which bank. You are never asked to do anything. You are simply asked to stop, and the Professor's people, whom you pass sometimes in the lane, tip their hats with exactly the right degree of courtesy. London goes on being what it is, a little quieter, a little richer, a little more afraid. You read in the papers that a clerk has been found drowned. You turn the page. In a locked drawer you keep the grey ledger, which you have never opened again.",
    [
      [{ branch: "CONTINENT" }, "A SWISS HOLIDAY: THE DETECTIVE RETURNS ALONE", "You come down from the Falls with the Professor's paper in your coat, and a very different idea of what you are. Watson never learns what passed on the path. He is told only that the Professor was not there, and that you changed your mind. You go to Interlaken. In the autumn, a house in Sussex is bought in a name that is not yours. You do not ask where the money came from, and you do not much like the look of your own face in the shaving-glass."],
    ],
  ),

  // ───────────── the mountain ─────────────
  end(
    "ENDING_THE_FALL",
    "The Reichenbach Fall",
    "narrative",
    "TERRIBLE ACCIDENT IN THE SWISS ALPS: TWO ENGLISHMEN FEARED LOST AT THE REICHENBACH FALLS",
    "The guides search the gorge for three days, and find nothing. At the edge of the path above the Falls, in a patch of trodden mud, there are two sets of footprints that go to the brink and none that come back. A walking-stick leans against the rock, with a cigarette-case beneath it. In the English papers the obituary of Sherlock Holmes is a long one, and kind, and in some places wrong. The Professor's name is printed beside yours. In a village in the valley, for many years afterwards, they will point out the place to travellers, and say that two men met there, and that only the water knows what they said.",
    [
      [all(flag("noteLeft"), flag("watsonDecoyed")), "A LETTER FOUND ON THE PATH: DR WATSON'S LAST DUTY", "Watson finds the note at dusk, after the hotel and the empty bed and the cold evening walk back along the river. It is four lines long, folded under your case. He reads it twice by lantern-light. He sits down on the wet rock, and stays there until the guides come at midnight to take him away. In the years after, he writes the whole thing out in a clear, grave hand, and calls it the Final Problem, and does not once say what he thinks of the man who sent him to the hotel."],
      [all(flag("noteLeft"), flag("watsonStays")), "TWO ENGLISHMEN AT THE FALLS: ONE SURVIVOR", "Watson was beside you on the path, and he was the one who saw it. He tells the guides, in a flat voice, that the Professor came along the ledge, that there was a struggle, that the two men fell together. He does not say what you said before. He puts your note in his pocket-book, and carries it for the rest of his life, and when he is asked, years afterwards, whether he has ever lost a friend, he answers only that he has lost the best and the wisest man whom he has ever known."],
      [flag("mycroftFavour"), "A BROTHER IN BLACK", "Mycroft is told by telegram, and arrives in Meiringen on the fourth day, in a closed carriage, a great grey presence at the edge of the gorge. He says nothing at all. He looks at the water for a long while, and then at the stick, and then he asks the guides, courteously, to leave him alone. When Watson finds him he is sitting on the wet rock with his hat in his hands. It is the only time that anyone has seen the elder Holmes brother without his composure."],
    ],
  ),
  end(
    "ENDING_THE_EMPTY_GRAVE",
    "The Empty Grave",
    "narrative",
    "HOLMES: A MEMORIAL. THE GREAT DETECTIVE'S NAME IS PRINTED IN BLACK",
    "You hang under a ledge in the dark until the stars come out, and then you climb. By dawn you are in a farmer's loft above the valley, with a bandaged hand and a stolen hat, and by evening you are in Florence. The English papers print your obituary. You read it in a cafe, over a cup of black coffee, with the strange, dizzy feeling of one who has been invited to his own funeral. The Professor's organisation is a ruin. The Colonel is a hunted man. For the next three years there will be no Sherlock Holmes in England, but there will be a Norwegian explorer named Sigerson in Tibet, and a French chemist in Montpellier, and a quiet man in Khartoum who is wondering when to come home.",
    [
      [flag("mycroftFunds"), "ONE MAN IN LONDON KNOWS", "Your brother's draft is waiting at the bank in Florence, and a short note: 'I have put on mourning. It is very becoming, I am told. M.' He is the one soul in England who is not grieving. He sends money every quarter, and information every month, and nothing at all of sentiment, and you are grateful for each in its turn. When you return to Baker Street, three years afterwards, he is waiting in the sitting-room, in your chair, with a cold supper laid."],
      [flag("watsonDecoyed"), "A FRIEND'S FUNERAL", "Watson comes back from the hotel and finds the note, and the cigarette-case, and the stick. He does not know what to believe, so he believes the worst. For three years he mourns a man who is sitting in a Florentine cafe, reading his own obituary. You will tell him, one day, in a darkened room in Kensington. He will faint. When he recovers, he will not speak to you for a week, and then he will ask you, very gently, why you did not trust him."],
    ],
  ),
  end(
    "ENDING_WATSON_STANDS",
    "Two at the Falls",
    "narrative",
    "REICHENBACH TRAGEDY: THE PROFESSOR DEAD, THE DETECTIVE SAFE. COLONEL MORAN FLEES",
    "The guides arrive with their lanterns just after dark, and find two Englishmen sitting on a wet rock with a revolver between them. The Professor's body is found two days later at the foot of the Falls. Colonel Moran has been taken at Interlaken, in a railway carriage, with an air-gun in a violin case. In Baker Street, a month afterwards, the lamp is lit and the fire is kept, and the old armchair across the hearth is occupied again. Watson writes it all down, in his own way, and gives it to a magazine. You tell him that it is too romantic. He tells you that you are an ungrateful man. It is, you both agree, a perfectly satisfactory way to end an argument.",
    [
      [flag("lettersWritten"), "THE CASE-BOOK AND THE CARRIED LETTER", "The thirty pages you wrote at the inn are never needed. You carry them back to London in your breast-pocket and give them to Mycroft, who files them without reading, and says that it is a pity to waste such good work. Watson reads them in a night, in the old armchair, and sets them down with a face you have not seen before. 'You were prepared to die,' he says. 'You wrote it all down in case.' You tell him that you were prepared for anything. It is almost the truth."],
    ],
  ),
  end(
    "ENDING_FATAL_SHOT",
    "The Colonel's Shot",
    "narrative",
    "ENGLISH DOCTOR SHOT DEAD AT THE REICHENBACH FALLS: AIR-GUN SUSPECTED",
    "The report of an air-gun is very small, and is lost entirely in the roar of the water. The guides, who come up with their lanterns in the early dark, find no struggle and no robbery, only a body on a rock and a living man sitting beside it, not speaking. The Professor lies at the foot of the Falls. The Colonel is taken at Interlaken three days later, quietly, in a railway carriage. It is no consolation. The war is won, and a friend is dead, and the long ride home in a first-class carriage is the quietest you have ever known.",
    [
      [flag("watsonStays"), "DR JOHN WATSON: A SOLDIER'S DEATH", "Watson dies on the ledge, with his hand in yours, saying something about a patient in Kensington whom he has forgotten to see. It is a small, absurd, ordinary last remark, and you will remember it for the rest of your life. Mary Watson is told in London by Mycroft, who takes the news in person. You go back to Baker Street by yourself. The armchair across the hearth is the first thing you see when you light the lamp. You do not sit in your own for a very long time."],
      [any(flag("watsonDecoyed"), flag("watsonSent")), "HOLMES SHOT ON THE SWISS PATH", "You die on the ledge alone, with the last light going out of the sky and the thunder of the Falls in your ears. Watson, summoned by a false message to an empty hotel, comes up the path at nightfall and finds you gone. In a notebook, under the rock, there are four lines in your hand. He reads them. He sits down in the road. He does not get up for a long time. The world believes that the greatest detective in London met his death in a fight with the Napoleon of crime. It is, as these things go, very nearly the truth."],
    ],
  ),
];
