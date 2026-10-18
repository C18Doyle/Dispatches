// =============================================================================
// WHAT AN ORDER COMMITS THE COMMAND TO
// =============================================================================
//
// An order that no adviser argues for would show as its label alone. Each of these carries one plain sentence under the label that says what the order
// would do, in the words of the report that hosts it and with nothing added to it: no forecast and no argument, which are the advisers' and the
// outcome's. Keyed "<report id>|<order id>". check-order-notes.js proves that every order with no adviser has a note, that every key names an order, and
// that a note keeps to the style of the game.
// =============================================================================

export const ORDER_NOTES = {
  "ohl_1916_14_somme|elastic": "Second Army would give up ground that cannot be held cheaply and build a second line behind it.",
  "ohl_1917_13_caporetto|refuse": "Berlin would send heavy guns and staff officers to the Isonzo and keep its divisions in Flanders.",
  "ohl_1918_13_aisne|halt": "The armies would stop on the Vesle, where the plan said they should, and the reserves would go back north for the attack in Flanders.",
  "ohl_1918_14_blackday|offensive": "Divisions from the quiet sectors would be gathered for one more attack in September, before the Americans arrive in strength.",
  "gqg_1914_12_retreat|stand": "The armies would stay where they are and fight on the Sambre and the Meuse, in place of withdrawing.",
  "gqg_1914_13_sack|keep": "The commanders would keep their armies, with officers from General Headquarters sent beside them to see that the orders are carried out.",
  "gqg_1914_14_race|dig": "The line on the Aisne would be dug in as it stands, and the left wing would not be extended to the north.",
  "gqg_1915_14_salonika|refuse": "No divisions would be taken from France for Salonika, though the government has decided to send them.",
  "gqg_1915_15_chantilly|free": "The French army would plan its own campaign for 1916 and would not agree to a scheme fixed with the other armies.",
  "gqg_1916_14_douaumont|wait": "No attack would be made this autumn: the divisions would rest and the shells would be kept for the spring.",
  "gqg_1917_12_calais|agreement": "The British army would stay under Haig, and the two headquarters would coordinate by agreement between them.",
  "gqg_1917_13_directive|offensive": "The army would be told to prepare another great offensive for the summer.",
  "gqg_1918_12_link|allin": "Every division that can be moved would go north to hold the junction with the British, and Champagne would be left thin.",
  "gqg_1918_13_aisne|depth": "The front line would be thinned to a screen and the divisions drawn back behind the ridge, as Petain's order requires.",
  "gqg_1918_15_grand|limited": "The attacks would go on one front at a time, each on its own date, with the army kept in hand.",
  "stavka_1914_12_tannenberg|halt": "The Second Army would stop at the frontier until its supply and the First Army come up.",
  "stavka_1915_12_carpathians|press": "The armies would go on over the passes into Hungary, in the snow and short of shells.",
  "stavka_1915_12_carpathians|halt": "The armies would hold the passes they have and stop attacking, and the spring would go to refitting.",
  "stavka_1916_12_kovel|hold": "Offensive operations toward Kovel would stop, the front would hold what it has taken and the Guards would stay in reserve.",
  "stavka_1916_13_romania|army": "An army would go to Romania at once, and the line in Galicia would be shortened to find it.",
  "stavka_1917_12_deathpenalty|restore": "The death penalty would be restored at the front, and courts-martial would be set up.",
  "stavka_1917_12_deathpenalty|refuse": "The penalty would not be restored, and order would rest on the commissars and the committees.",
  "stavka_1917_13_kornilov|refuse": "The dismissal would be refused, and Krymov's cavalry corps would keep marching toward Petrograd.",
  "stavka_1917_13_kornilov|obey": "The dismissal would be accepted, and the cavalry corps would be recalled before it reaches the capital.",
  "stavka_1917_14_armistice|obey": "The order of the Council of People's Commissars would be carried out, and an armistice proposed to the German command.",
  "bef_1914_02_seine|seine": "The army would leave the line and march to the Seine to refit before it returns.",
  "bef_1914_03_ypres|coast": "The army would fall back toward the coast, to a shorter line that covers Dunkirk and Calais.",
};

/** The sentence under an order that no adviser argues for, or "". */
export function orderNote(nodeId, orderId) {
  return ORDER_NOTES[nodeId + "|" + orderId] || "";
}
