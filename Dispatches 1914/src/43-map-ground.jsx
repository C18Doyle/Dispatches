// =============================================================================
// MAP GROUND
// =============================================================================
//
// The ground a file has taken or given up against the record. The front on the map is drawn from the course of the fighting and does not change with
// the orders, so a departure from the record is marked beside it: a place held or taken that the record did not hold or take ("gained"), or a place
// given up or never taken that the record held or took ("lost"). A mark is read from one flag the orders set (the flag and the values that mark it) and
// is drawn once the flag is set. The ledger feeds the command rank (59-rank.jsx), is listed with the expanded map, and is drawn at the head of the
// file on the ending screen. Every mark is speculative: it carries the tag "Not in the record" when it is shown. Places are [longitude, latitude].
// =============================================================================

const G = (id, flag, at, name, kind, values, text) => ({ id, flag, at, name, kind, values, text });

export const MAP_GROUND = {
  ohl: [
    G("ohl-nancy", "ohl_lorraine", [6.18, 48.69], "Nancy", "gained", ["reinforced"], "Lorraine is reinforced and the line moves toward Nancy."),
    G("ohl-warsaw", "ohl_theatre", [21.0, 52.23], "Warsaw", "gained", ["east"], "The weight goes east in the autumn and the army reaches the Vistula."),
    G("ohl-ypres", "ohl_flanders", [2.89, 50.85], "Ypres", "gained", ["broken"], "The Flanders attack breaks through and Ypres is taken."),
    G("ohl-brestlitovsk", "ohl_gorlice", [23.66, 52.09], "Brest-Litovsk", "gained", ["envelop"], "The envelopment is made and the army reaches the Bug."),
    G("ohl-gorlice", "ohl_gorlice", [21.17, 49.65], "Gorlice", "lost", ["carpathians"], "No army goes to Gorlice and the Russian front is not broken."),
    G("ohl-belgrade", "ohl_serbia", [20.46, 44.82], "Belgrade", "lost", ["declined"], "Serbia is not attacked and is not overrun."),
    G("ohl-douaumont", "ohl_verdun", [5.42, 49.32], "Douaumont", "lost", ["declined"], "Verdun is not attacked and the forts on the Meuse stay French."),
    G("ohl-caporetto", "ohl_caporetto", [13.58, 46.25], "Caporetto", "lost", ["refused"], "No German divisions go south and the Italian line holds."),
    G("ohl-kiev", "ohl_faust", [30.52, 50.45], "Kiev", "lost", ["declared", "narva"], "The advance is stopped short and Kiev is not reached."),
    G("ohl-riga", "ohl_brest", [24.1, 56.95], "Riga", "lost", ["narrow"], "A narrow treaty leaves the Baltic provinces unclaimed."),
    G("ohl-amiens", "ohl_michael", [2.3, 49.89], "Amiens", "gained", ["amiensfirst"], "Amiens is made the first object and the army comes nearer to it."),
    G("ohl-marne", "ohl_aisne", [3.4, 49.04], "Chateau-Thierry", "lost", ["halted"], "The Aisne offensive halts and the Marne is not reached."),
    G("ohl-montdidier", "ohl_salient", [2.57, 49.65], "Montdidier", "lost", ["shortened"], "The salient is given up early, before the summer."),
  ],
  gqg: [
    G("gqg-mulhouse", "gqg_opening", [7.34, 47.75], "Mulhouse", "lost", ["shifted"], "The offensive is moved from Alsace and Mulhouse is not retaken."),
    G("gqg-charleroi", "gqg_retreat", [4.44, 50.41], "Charleroi", "gained", ["stand"], "The army stands on the Sambre and does not fall back."),
    G("gqg-nieuport", "gqg_race", [2.75, 51.13], "Nieuport", "lost", ["dug"], "The line is not extended to the sea and the coast is lost."),
    G("gqg-lorette", "gqg_1915", [2.72, 50.41], "Notre-Dame-de-Lorette", "lost", ["limited"], "The Artois offensive is limited and the ridge is not stormed."),
    G("gqg-salonika", "gqg_salonika", [22.95, 40.64], "Salonika", "lost", ["refused"], "No army is sent to Salonika."),
    G("gqg-verdun", "gqg_verdun", [5.38, 49.16], "Verdun", "lost", ["shortened"], "The right bank is given up and Verdun is nearly surrounded."),
    G("gqg-douaumont", "gqg_douaumont", [5.42, 49.32], "Douaumont", "lost", ["waited"], "The fort is not retaken in October."),
    G("gqg-chemin", "gqg_chemin", [3.74, 49.45], "Chemin des Dames", "lost", ["halted"], "The ridge is not attacked in April and is not taken."),
    G("gqg-laon", "gqg_malmaison", [3.62, 49.56], "Laon", "gained", ["exploited"], "The success at Malmaison is exploited toward Laon."),
    G("gqg-amiens", "gqg_link", [2.3, 49.89], "Amiens", "lost", ["paris"], "Paris is covered first and Amiens is left to the Germans."),
    G("gqg-aisne", "gqg_aisne", [3.7, 49.4], "the Aisne", "gained", ["depth"], "Defence in depth holds the Aisne and the Marne is not reached."),
    G("gqg-soissons", "gqg_1918", [3.33, 49.38], "Soissons", "lost", ["husbanded"], "There is no counterattack in July and Soissons stays German."),
    G("gqg-saintquentin", "gqg_grand", [3.29, 49.85], "Saint-Quentin", "lost", ["limited"], "The limited offensive stops short of Saint-Quentin."),
    G("gqg-mainz", "gqg_senlis", [8.27, 50.0], "Mainz", "lost", ["moderate"], "Moderate terms are asked and there is no bridgehead at Mainz."),
  ],
  stavka: [
    G("stavka-gumbinnen", "stavka_prussia", [22.2, 54.58], "Gumbinnen", "lost", ["concentrated"], "East Prussia is not invaded in the first fortnight."),
    G("stavka-koenigsberg", "stavka_1914theatre", [20.5, 54.7], "Konigsberg", "gained", ["prussia"], "The weight goes to Prussia and the army advances toward Konigsberg."),
    G("stavka-lemberg", "stavka_1914theatre", [24.03, 49.84], "Lemberg", "lost", ["prussia"], "With the weight in Prussia, Lemberg is not taken in 1914."),
    G("stavka-przemysl", "stavka_przemysl", [22.77, 49.78], "Przemyśl", "gained", ["stormed"], "The fortress is stormed and taken early."),
    G("stavka-augustow", "stavka_masuria", [23.0, 53.85], "Augustow", "lost", ["pulled"], "The army pulls back from the Masurian line and the forest is given up."),
    G("stavka-warsaw", "stavka_1915", [21.0, 52.23], "Warsaw", "gained", ["held"], "The army stands in Poland and Warsaw is not given up."),
    G("stavka-vilna", "stavka_sventsiany", [25.28, 54.69], "Vilna", "lost", ["withdrew"], "There is no counterstroke and Vilna is given up to the advance."),
    G("stavka-lemberg2", "stavka_kovel", [24.03, 49.84], "Lemberg", "gained", ["lemberg"], "The weight goes on Lemberg and the city is retaken."),
    G("stavka-bucharest", "stavka_romania", [26.1, 44.43], "Bucharest", "gained", ["army"], "A real army goes to Romania and Bucharest is held longer."),
    G("stavka-galati", "stavka_romfront", [28.05, 45.44], "Galati", "lost", ["limited"], "The Romanian front is not formed and the line falls back to the Sereth."),
    G("stavka-stanislau", "stavka_kerensky", [24.7, 48.93], "Stanislau", "lost", ["refused"], "The June offensive is not made and Stanislau is not taken."),
    G("stavka-riga", "stavka_riga", [24.1, 56.95], "Riga", "gained", ["held"], "The Daugava line is held and Riga is not lost."),
  ],
  bef: [
    G("bef-mons", "bef_landing", [3.94, 50.45], "Mons", "lost", ["amiens"], "The army lands farther back and is not on the Mons line."),
    G("bef-meaux", "bef_seine", [2.88, 48.96], "Meaux", "lost", ["withdrew"], "The army falls back to the Seine and gives up the Marne."),
    G("bef-ypres", "bef_ypres", [2.89, 50.85], "Ypres", "lost", ["withdrew"], "The salient is given up and Ypres is lost."),
    G("bef-helles", "bef_dardanelles", [26.18, 40.05], "Cape Helles", "lost", ["navy"], "The navy goes alone and no army lands at Gallipoli."),
    G("bef-loos", "bef_loos", [2.8, 50.46], "Loos", "lost", ["refused"], "Loos is not attacked."),
    G("bef-anzac", "bef_evacuate", [26.28, 40.25], "Anzac", "gained", ["stayed", "helles"], "The army stays at Gallipoli through the winter."),
    G("bef-pozieres", "bef_somme", [2.72, 50.03], "Pozieres", "gained", ["bitehold"], "Limited bites take the ridge more cheaply."),
    G("bef-flers", "bef_tanks", [2.8, 50.05], "Flers", "lost", ["held"], "The tanks are held back and Flers is not taken in September."),
    G("bef-passchendaele", "bef_ypres3", [3.02, 50.9], "Passchendaele", "lost", ["vetoed"], "The Flanders offensive is vetoed and the ridge is not taken."),
    G("bef-noyon", "bef_manpower", [3.0, 49.58], "Noyon", "lost", ["refused"], "The British do not take over the line toward Noyon."),
    G("bef-kemmel", "bef_backs", [2.8, 50.78], "Kemmel", "lost", ["withdrew"], "The army falls back in the Lys battle and Kemmel is lost."),
    G("bef-cambrai", "bef_hundreddays", [3.24, 50.18], "Cambrai", "lost", ["paused"], "The attack pauses and Cambrai is not taken in October."),
  ],
  aok: [
    G("aok-sabac", "aok_serbia", [19.7, 44.75], "Sabac", "lost", ["galicia"], "The first blow falls on Galicia and Serbia is not invaded in August."),
    G("aok-lemberg", "aok_serbia", [24.03, 49.84], "Lemberg", "gained", ["galicia"], "A stronger army in Galicia holds Lemberg longer."),
    G("aok-krasnik", "aok_galicia", [22.22, 50.92], "Kraśnik", "lost", ["defensive", "cover"], "The army stays on the San and Kraśnik is not attacked."),
    G("aok-rawa", "aok_rawa", [23.6, 50.25], "Rawa Ruska", "lost", ["brokeoff"], "The battle of Rawa is broken off and the ground is not held."),
    G("aok-valjevo", "aok_kolubara", [19.9, 44.27], "Valjevo", "lost", ["declined"], "Serbia is not invaded again and Valjevo is not taken."),
    G("aok-przemysl", "aok_przemyslend", [22.77, 49.78], "Przemyśl", "gained", ["third"], "A third relief holds the fortress."),
    G("aok-gorizia", "aok_isonzo", [13.62, 45.94], "Gorizia", "gained", ["attacked"], "The Isonzo is attacked in the summer and Gorizia is threatened."),
    G("aok-lovcen", "aok_montenegro", [18.83, 42.4], "Lovcen", "lost", ["halted"], "The Montenegro campaign halts and Lovcen is not taken."),
    G("aok-asiago", "aok_strafe", [11.5, 45.88], "Asiago", "lost", ["cancelled"], "The Trentino offensive is cancelled and the plateau is not attacked."),
    G("aok-caporetto", "aok_caporetto", [13.58, 46.25], "Caporetto", "lost", ["defend"], "The army defends alone and the Italian line is not broken."),
    G("aok-treviso", "aok_pursuit", [12.24, 45.67], "the Piave", "lost", ["halted"], "The pursuit halts before the Piave."),
    G("aok-odessa", "aok_ukraine", [30.73, 46.48], "Odessa", "lost", ["kept"], "The army does not enter Ukraine and Odessa is not reached."),
  ],
  otto: [
    G("otto-sarikamis", "otto_sarikamis", [42.58, 40.33], "Sarıkamış", "lost", ["held", "postponed"], "The offensive is not made in the snow and Sarıkamış is not attacked."),
    G("otto-suez", "otto_suez", [32.35, 30.5], "the Suez Canal", "lost", ["kept", "raided"], "The canal is not attacked in force."),
    G("otto-kut", "otto_kut", [46.03, 32.5], "Kut", "gained", ["storm"], "Kut is stormed and taken early."),
    G("otto-erzurum", "otto_erzurum", [41.27, 39.9], "Erzurum", "lost", ["withdrew"], "Erzurum is given up without a defence."),
    G("otto-medina", "otto_medina", [39.6, 24.47], "Medina", "lost", ["evacuated"], "Medina is evacuated."),
    G("otto-romani", "otto_romani", [32.6, 30.97], "Romani", "lost", ["waited", "hejaz"], "The army waits and Romani is not struck."),
    G("otto-baghdad", "otto_baghdad", [44.4, 33.3], "Baghdad", "lost", ["mosul"], "The army falls back on Mosul and Baghdad is given up."),
    G("otto-beersheba", "otto_gaza", [34.79, 31.25], "Beersheba", "lost", ["shortened"], "The line is shortened and Beersheba is given up."),
    G("otto-baghdad2", "otto_yildirim", [44.4, 33.3], "Baghdad", "gained", ["baghdad"], "The Yildirim army goes to Baghdad and retakes it."),
    G("otto-jerusalem", "otto_jerusalem", [35.22, 31.78], "Jerusalem", "gained", ["held"], "Jerusalem is held through the winter."),
    G("otto-baku", "otto_caucasus", [49.87, 40.4], "Baku", "lost", ["held"], "No army goes to Baku."),
    G("otto-damascus", "otto_megiddo", [36.3, 33.5], "Damascus", "gained", ["withdrew"], "An earlier withdrawal saves the army and Damascus is held longer."),
  ],
};

/** The marks a file has made so far: the entries of the command's ledger whose flag holds one of the marking values. */
export function groundOf(campaignId, flags) {
  const list = MAP_GROUND[campaignId] || [];
  const f = flags || {};
  return list.filter((g) => g.values.includes(f[g.flag]));
}

/** { gained, lost } counts, and the net. */
export function groundTally(campaignId, flags) {
  const marks = groundOf(campaignId, flags);
  const gained = marks.filter((g) => g.kind === "gained").length;
  const lost = marks.filter((g) => g.kind === "lost").length;
  return { gained, lost, net: gained - lost };
}
