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
    by: "General Petain, as reported",
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
};

/** The document that opens a report, or null. */
export function documentOf(nodeId) {
  return DOCUMENTS[nodeId] || null;
}
