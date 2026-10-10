// =============================================================================
// GLOSSARY
// =============================================================================
//
// Words and places a reader may not know, defined once. On each screen the first mention of a term in the story text is
// underlined; pressing it shows the definition. People are not here: they have dossiers. Each definition is meant to be
// plain fact and kept short; check-glossary.js checks that every term is used in the game and that none is defined twice.
// `match` is a regular expression (default: the term itself), `ci` makes it case-insensitive.
// =============================================================================

export const GLOSSARY = [
  { id: "general-staff", term: "General Staff", def: "The permanent body of officers that plans and directs an army. Each great power ran its war through its general staff and the officer who headed it." },
  { id: "supreme-commander", term: "Supreme Commander", def: "The Russian title for the officer who commanded all the armies. Grand Duke Nikolai Nikolaevich held it until September 1915, when Tsar Nicholas II took it himself." },
  { id: "corps", term: "corps", ci: true, def: "A formation of two or more divisions under a general: the level between a division and an army." },
  { id: "army-group", term: "army group", ci: true, def: "A command over several armies at once, one level above an army." },
  { id: "salient", term: "salient", ci: true, def: "A bulge in a front line that pushes into enemy ground, so that it can be fired on from more than one side." },
  { id: "barrage", term: "barrage", ci: true, def: "A heavy, sustained artillery bombardment. A creeping barrage moves forward ahead of the infantry at a set pace." },
  { id: "tank", term: "tank", ci: true, match: "tanks?", def: "An armoured, tracked vehicle carrying guns. The British first used tanks in action on 15 September 1916, on the Somme." },
  { id: "convoy", term: "convoy", ci: true, match: "convoys?", def: "Merchant ships sailing together under naval escort. The Royal Navy adopted the system in 1917 against submarine attack." },
  { id: "blockade", term: "blockade", ci: true, def: "Using warships to stop a country's trade by sea. The Royal Navy's blockade restricted Germany's imports throughout the war." },
  { id: "conscription", term: "conscription", ci: true, def: "Compulsory military service. Britain relied on volunteers until the Military Service Act of January 1916." },
  { id: "shell-shortage", term: "shell shortage", ci: true, def: "In May 1915 the British commander blamed a lack of high-explosive shells for a failed attack, and the press took up the charge. It helped bring in a coalition government and a Ministry of Munitions." },
  { id: "unrestricted", term: "unrestricted submarine warfare", ci: true, def: "Sinking merchant ships without warning, neutrals' included. Germany adopted it on 1 February 1917, and the United States declared war in April." },
  { id: "hindenburg-programme", term: "Hindenburg Programme", def: "The German plan of August 1916 to raise munitions and weapons output sharply, named for the new head of the army, Field Marshal Hindenburg." },
  { id: "war-cabinet", term: "War Cabinet", def: "The body of ministers that directed the British war. In December 1916 Lloyd George replaced the large Cabinet with a War Cabinet of five." },
  { id: "admiralty", term: "Admiralty", def: "The British government department that ran the Royal Navy, under a minister, the First Lord, and an admiral, the First Sea Lord." },
  { id: "reichstag", term: "Reichstag", def: "The German national parliament. It voted the money for the war, but the army answered to the Kaiser, not to it." },
  { id: "kaiser", term: "Kaiser", def: "The German word for emperor. The German Kaiser in this war was Wilhelm II." },
  { id: "provisional-government", term: "Provisional Government", def: "The Russian government formed after the Tsar abdicated in March 1917. It ruled until the Bolsheviks seized power in November." },
  { id: "soviet", term: "Soviet", def: "A council of elected workers' and soldiers' deputies. In 1917 the Petrograd Soviet shared power with the Provisional Government." },
  { id: "old-style", term: "Old Style", def: "The Julian calendar, which Russia used until February 1918. In this war it ran thirteen days behind the Western calendar. Dates in the Russian command are given Old Style, with the Western date in brackets." },
  { id: "central-powers", term: "Central Powers", def: "Germany, Austria-Hungary, the Ottoman Empire and Bulgaria." },
  { id: "entente", term: "Entente", def: "The alliance of France, Russia and Britain, later joined by Italy, Romania, the United States and others." },
  { id: "armistice", term: "armistice", ci: true, def: "An agreement to stop fighting, short of a peace treaty. The one signed on 11 November 1918 ended the war in the west." },
  { id: "stavka", term: "Stavka", def: "The supreme headquarters of the Russian army: the command you hold in this game." },
  { id: "bef", term: "BEF", def: "The British Expeditionary Force: the army sent to France in August 1914, and the name for the British forces on the Western Front." },
  { id: "galicia", term: "Galicia", def: "The Austrian province north of the Carpathians, now divided between south-eastern Poland and western Ukraine. It was the main Austro-Russian battlefield." },
  { id: "carpathians", term: "Carpathians", match: "Carpathians?", def: "The mountain range between Galicia and Hungary. Fighting there in the winter of 1914-15 cost both armies heavily." },
  { id: "przemysl", term: "Przemysl", def: "A fortress city in Galicia. The Russians besieged it from late 1914 and it surrendered in March 1915; German and Austro-Hungarian troops retook it in June." },
  { id: "lemberg", term: "Lemberg", def: "Now Lviv, the capital of Galicia. The Russians took it in September 1914 and lost it in June 1915." },
  { id: "gorlice", term: "Gorlice", def: "The town in Galicia where, in May 1915, German and Austro-Hungarian armies broke the Russian front in the Gorlice-Tarnow offensive." },
  { id: "isonzo", term: "Isonzo", def: "The river on the Italian-Austrian front, where twelve battles were fought between 1915 and 1917." },
  { id: "trentino", term: "Trentino", def: "The Italian-speaking Alpine region then held by Austria. Austria-Hungary attacked Italy from it in May 1916." },
  { id: "caporetto", term: "Caporetto", def: "The Austro-German offensive of October 1917 that broke the Italian line on the Isonzo." },
  { id: "salonika", term: "Salonika", def: "The Greek port where Allied troops landed in October 1915 to help Serbia. It became a front against Bulgaria." },
  { id: "dardanelles", term: "Dardanelles", def: "The narrow strait between the Aegean and the Sea of Marmara. The Allies tried to force it in 1915." },
  { id: "gallipoli", term: "Gallipoli", def: "The peninsula on the strait's European shore, where Allied troops landed in April 1915 and from which they withdrew by January 1916." },
  { id: "marne", term: "Marne", def: "The river east of Paris. The battle of September 1914 stopped the German advance, and a second battle in July 1918 stopped the last one." },
  { id: "ypres", term: "Ypres", def: "The Belgian town the Allies held in a salient, fought over in 1914, 1915 and 1917." },
  { id: "loos", term: "Loos", def: "The British and French offensive of September 1915 in Artois, in which the British first used poison gas and the new volunteer divisions first fought." },
  { id: "verdun", term: "Verdun", def: "The French fortress city on the Meuse. The German attack began there in February 1916 and the fighting lasted until December." },
  { id: "somme", term: "Somme", def: "The river in Picardy where the British and French attacked from 1 July to November 1916." },
  { id: "chantilly", term: "Chantilly", def: "The town that held the French headquarters. The Allies met there in December 1915 and November 1916 to plan their offensives together." },
  { id: "chemin-des-dames", term: "Chemin des Dames", def: "The ridge north of the Aisne, where the French offensive of April 1917 failed." },
  { id: "doullens", term: "Doullens", def: "The town where, on 26 March 1918, Allied leaders agreed to put Foch in charge of coordinating their armies." },
  { id: "brest-litovsk", term: "Brest-Litovsk", def: "The town where Russia signed a peace with the Central Powers on 3 March 1918." },
  { id: "hundred-days", term: "Hundred Days", def: "The Allied advance from 8 August 1918 to the armistice on 11 November." },
];

/** What the game leaves out: shown on the menu. */
export const LEAVES_OUT = [
  "The war here is the war as the commands in this game saw it from headquarters. Most of it is not in view: the colonies and the fighting outside Europe, the war at sea beyond what a headquarters decided about it, the smaller allies and their armies, and the hunger and work of the home fronts.",
  "The people the orders fell on are in the meters and not in the story. Millions of soldiers died, and millions of civilians were driven from their homes, starved, imprisoned or killed. The German army killed thousands of Belgian and French civilians in the invasion of 1914, and in 1915 the Russian army's headquarters ordered the border regions laid waste and their peoples expelled: about half a million Jews and a quarter of a million Germans were deported into the interior.",
  "Some of the worst events of the war were crimes, not decisions a general could take, and the game does not offer them as choices. One is the killing of Armenians in the Ottoman Empire from 1915, which the International Association of Genocide Scholars affirmed in 1997 was a genocide.",
];
// Source for the expulsions: Great Retreat (Russian), Wikipedia (wp-greatretreat in claims/sources.json): Yanushkevich, backed by the Grand Duke, ordered the army to devastate the border territories and expel the "enemy" nations; about 500,000 Jews and 250,000 Germans were deported.
// Source for the last sentence: the IAGS resolution on the Armenian Genocide, passed unanimously at its Montreal conference, 13 June 1997
// (genocidescholars.org, "IAGS Armenian Genocide Resolution"). It says the mass murder of over a million Armenians in 1915 meets the UN
// Convention's definition of genocide.
