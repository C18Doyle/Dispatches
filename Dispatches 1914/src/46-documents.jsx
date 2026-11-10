// =============================================================================
// DOCUMENTS FROM THE RECORD
// =============================================================================
//
// A real document at the head of a report, in place of the wire bulletin the game would otherwise invent: a message, an order, a memorandum, a note, a
// declaration, quoted from a published text and named. Each is keyed by the report it opens: { by, date, source, text }. `text` is the passage as it was
// published, in the translation named in the claims register (claims/<command>.json, kind quotation, web-checked), with the spelling made British. Nothing
// here is shortened inside a sentence; a passage that is cut from a longer text begins and ends at a sentence. check-documents.js proves each key names a
// report and that every document is logged as a claim. Where a report has a document, the report's own bulletin is not shown.
// =============================================================================

export const DOCUMENTS = {
  ohl_1917_06_pless: {
    by: "Admiral von Holtzendorff, Chief of the Admiralty Staff",
    date: "Memorandum of 22 December 1916",
    source: "German History in Documents and Images, document 811",
    text: "I am not afraid of saying that, given the way things now stand, with unlimited submarine warfare we can force England to sue for peace in five months.",
  },
  ohl_1918_15_wilson: {
    by: "Max, Prince of Baden, the Chancellor",
    date: "The first German note to President Wilson, Berlin, 3 October 1918",
    source: "German History in Documents and Images",
    text: "The German government requests that the President of the United States of America take the initiative in bringing about peace, that he inform all the belligerent states of this request, and that he invite them to send plenipotentiaries for purposes of beginning negotiations. In order to avoid further bloodshed, the German government requests the immediate conclusion of an armistice on land, at sea, and in the air.",
  },
  gqg_1917_08_mutinies: {
    by: "General Pétain, as reported",
    date: "1917",
    source: "Wikipedia, French Army mutinies",
    text: "I am waiting for the tanks and the Americans.",
  },
  stavka_1914_01_prussia: {
    by: "Nicholas II, Emperor of Russia",
    date: "Manifesto of 2 August 1914",
    source: "Russian Imperial Manifesto, August 1914 (translation, C. T. Evans)",
    text: "We firmly believe that all Our loyal subjects will rally self-sacrificingly and with one accord to the defence of the Russian soil. At this hour of threatening danger, let domestic strife be forgotten.",
  },
  bef_1914_01_warcouncil: {
    by: "Lord Kitchener, Secretary of State for War",
    date: "Message to the troops, issued 9 August 1914",
    source: "Roger Ingpen, The Fighting Retreat to Paris (Project Gutenberg)",
    text: "You are ordered abroad as a soldier of the King to help our French comrades against the invasion of a common enemy. You have to perform a task which will need your courage, your energy, your patience. Remember that the honour of the British Army depends on your individual conduct.",
  },
  bef_1918_19_backs: {
    by: "Field Marshal Sir Douglas Haig",
    date: "Special Order of the Day, 11 April 1918",
    source: "British Library, Haig's Special Order, as printed in the newspapers of 13 April 1918",
    text: "There is no other course open to us but to fight it out. Every position must be held to the last man: there must be no retirement. With our backs to the wall and believing in the justice of our cause each one of us must fight on to the end. The safety of our homes and the freedom of mankind alike depend upon the conduct of each one of us at this critical moment.",
  },
  aok_1914_15_mobilise: {
    by: "Franz Joseph, Emperor of Austria and King of Hungary",
    date: "To My Peoples, 28 July 1914",
    source: "Wikipedia, To my peoples (English translation)",
    text: "It was my fervent wish to consecrate the years which, by the grace of God, still remain to me, to the works of peace and to protect my peoples from the heavy sacrifices and burdens of war. Providence, in its wisdom, has otherwise decreed.",
  },
  otto_1917_02_jerusalem: {
    by: "Arthur Balfour, Foreign Secretary, to Lord Rothschild",
    date: "The Balfour Declaration, 2 November 1917",
    source: "The Avalon Project, Yale Law School",
    text: "His Majesty's Government view with favour the establishment in Palestine of a national home for the Jewish people, and will use their best endeavours to facilitate the achievement of this object, it being clearly understood that nothing shall be done which may prejudice the civil and religious rights of existing non-Jewish communities in Palestine, or the rights and political status enjoyed by Jews in any other country.",
  },
  ohl_1918_12_faustschlag: {
    by: "Leon Trotsky, People's Commissar for Foreign Affairs",
    date: "Statement at Brest-Litovsk, 10 February 1918",
    source: "Marxists Internet Archive, from Mirnye Peregovory, p. 207",
    text: "We are withdrawing from the war. We are informing all peoples and all Governments of this. We are issuing orders for the complete demobilisation of our armies now confronting the German, Austro-Hungarian, Turkish, and Bulgarian troops.",
  },
  stavka_1917_14_armistice: {
    by: "The workers' and peasants' government, Petrograd",
    date: "Decree on Peace, 26 October 1917 (Old Style)",
    source: "V. I. Lenin, Collected Works, vol. XXVI, pp. 249-53, as printed by the University of Pittsburgh",
    text: "The workers' and peasants' government, created by the Revolution of October 24-25 and basing itself on the Soviets of Workers', Soldiers' and Peasants' Deputies, calls upon all the belligerent peoples and their governments to start immediate negotiations for a just, democratic peace.",
  },
  stavka_1917_06_february: {
    by: "The Petrograd Soviet of Workers' and Soldiers' Deputies",
    date: "Order No. 1, 1 March 1917 (Old Style)",
    source: "The Avalon Project, Yale Law School",
    text: "Arms of all kinds, as rifles, machine-guns, armoured automobiles and others must be at the disposition and under the control of the company and battalion committees and are not in any case to be given out to officers, even upon their command.",
  },
  aok_1918_13_vittorio: {
    by: "Karl, Emperor of Austria",
    date: "To My Faithful Austrian Peoples, 16 October 1918",
    source: "habsburger.net, translated by Peter John Nicholson",
    text: "In accordance with the will of its peoples, Austria is to become a federal state in which each nationality shall form its own polity on the territory on which it lives.",
  },
  otto_1914_01_straits: {
    by: "The secret treaty of alliance between Germany and the Ottoman Empire",
    date: "Constantinople, 2 August 1914, Article 3",
    source: "The Avalon Project, Yale Law School",
    text: "In case of war, Germany will leave her military mission at the disposal of Turkey. The latter, for her part, assures the said military mission an effective influence on the general conduct of the army, in accordance with the understanding arrived at directly between His Excellency the Minister of War and His Excellency the Chief of the Military Mission.",
  },
  bef_1918_16_manpower: {
    by: "David Lloyd George, Prime Minister",
    date: "Address to the Trade Union Conference, London, 5 January 1918",
    source: "Foreign Relations of the United States, 1918, Supplement 1, vol. I, Office of the Historian",
    text: "We are not fighting a war of aggression against the German people. Their leaders have persuaded them that they are fighting a war of self-defence against a league of rival nations, bent on the destruction of Germany. That is not so.",
  },
};

/** The document that opens a report, or null. */
export function documentOf(nodeId) {
  return DOCUMENTS[nodeId] || null;
}
