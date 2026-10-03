// PREVIEW SCREENS
// =============================================================================
// Everything below this line is a standalone preview build, not your production
// screen components (I still don't have the real BriefingScreen/OutcomeScreen/
// EndScreen source — see the top-of-file note). This lets you review the actual
// content and the known-risk-odds mechanic wired end to end before you decide
// how much of this markup, if any, is worth carrying into the real App shell.
//
// Visual conventions matched from your 1941 screenshots: black top bar, cream
// card backgrounds, monospace uppercase labels, bold serif headlines, dashed-
// border hard-mode lock in demo builds, and a per-campaign cipher-block header
// in place of IGHQ's numeric groups — reskinned per campaign, not copied, per
// the note about the 甲/乙/丙 lettering not transferring.
//
// Odds are shown on the choice card itself, before selection — "known-risk
// gambling," per your instruction — not revealed only after the fact.

import React, { useState, useEffect } from "react";
import { resolveChoice, afterOutcome } from "./logic";

// Real Google Fonts, loaded once at the App root. This is a self-contained
// convenience for previewing the file as-is — in the real production build,
// move these @import lines (or equivalent <link> tags) into index.html /
// your CSS entry point instead, so they're preloaded rather than blocking on
// first paint inside the React tree.
function FontImports() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600;700&family=Archivo:wght@500;600;700&family=Oswald:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Playfair+Display:wght@700;900&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Courier+Prime&display=swap');
    `}</style>
  );
}

// Tailwind's text-* classes are rem-based, meaning they scale off the ROOT
// html element's font-size, not any wrapping div's — so the only way to make
// a "Text Size" setting genuinely rescale every text-xs/text-sm/text-2xl
// etc. across the whole app is to actually change the root font-size, not
// wrap things in a scaled container (which rem units would ignore).
const TEXT_SIZE_PX = { small: 14, normal: 16, large: 19 };
function TextScaleStyle({ textSize }) {
  return <style>{`html { font-size: ${TEXT_SIZE_PX[textSize] || 16}px; }`}</style>;
}

// SKINS are FIXED per campaign — not player-selectable. Every skin renders
// the same layout slots (TopBar -> meters -> header device -> date/title/
// badge -> situation -> choices), so the campaigns feel like one cohesive
// game despite looking different. Real named-hex palettes and real Google
// Fonts, not Tailwind's default color ramps and system font stacks — those
// produced the generic look that prompted this rewrite. Cohesion device:
// body text stays Source Serif 4 across all three skins — same voice,
// different accents — while display and mono faces differ per skin.
//
// Uses inline style={} for every custom color and font, NOT Tailwind
// arbitrary-value syntax (bg-[#hex], font-['Name']). First attempt used
// arbitrary values and it broke completely when actually previewed — this
// in-chat sandbox has no Tailwind JIT build step, so those classes silently
// generated zero CSS: black background bleeding through from a parent, text
// falling back to default link-blue, borders falling back to default gray.
// Inline styles need no build step and render identically here and in a
// real compiled app, so that's what every color/font token uses now.
const CAMPAIGN_SKINS = {
  southRussia: "elegy",
  siberia: "frontier",
  bolsheviks: "agitprop",
  provisionalGov17: "telegram",
};

const SKINS = {
  // ELEGY — South Russia / AFSR. Subject: Imperial-era chancery
  // correspondence, black-bordered mourning stationery (a real 19th/20th
  // century Russian convention), wax seals, ledger bookkeeping. "A mourning
  // border, not a battle flag."
  elegy: {
    name: "The Elegy",
    ground: "#241C14",
    paper: "#E8E1D3",
    paperDim: "#B8AA8E",
    ink: "#2B2016",
    inkMuted: "#6B5C47",
    accent: "#5C1A1A",
    accentLight: "#7A2E2E",
    dark: false,
    headerStyle: "seal",
    displayFont: "'Cormorant', serif",
    monoFont: "'IBM Plex Mono', monospace",
  },
  // FRONTIER — Siberia / Omsk. Subject: Trans-Siberian Railway telegraph
  // offices, verst distance markers, rail-tie rhythm, frost and cold steel
  // rather than warm chancery tones.
  frontier: {
    name: "The Frontier",
    ground: "#12181C",
    paper: "#DCE4E6",
    paperDim: "#9FB0B5",
    ink: "#0D1417",
    inkMuted: "#4A5C63",
    accent: "#2C5270",
    accentLight: "#3E6D8F",
    dark: false,
    headerStyle: "railmarker",
    displayFont: "'Archivo', sans-serif",
    monoFont: "'IBM Plex Mono', monospace",
  },
  // AGITPROP — Bolsheviks / Revvoensoviet. Subject: wartime-scarcity
  // lithograph printing — 2-3 ink colors, cheap paper, hand-cut lettering.
  // Signature device: a censor/priority stamp, not a decorative skew block.
  agitprop: {
    name: "The Agitprop",
    ground: "#1C1410",
    paper: "#D9C9A3",
    paperDim: "#B8A87D",
    ink: "#0F0B08",
    accent: "#B31E23",
    accentLight: "#7A1418",
    dark: true,
    headerStyle: "stamp",
    displayFont: "'Oswald', sans-serif",
    monoFont: "'IBM Plex Mono', monospace",
  },
  // TELEGRAM — Provisional Government / Petrograd 1917. Subject: the
  // telegraph office and the mass-printed political proclamation — the
  // first free press the empire ever had, run by a government that never
  // has quite enough authority to match it. Gold rather than blood-red or
  // mourning-maroon: gilt, provisional, and — deliberately — a shade that
  // reads as slightly hollow next to the other three skins' conviction.
  telegram: {
    name: "The Telegram",
    ground: "#1A2430",
    paper: "#EDE6D6",
    paperDim: "#B7AD98",
    ink: "#1D2530",
    inkMuted: "#5B6270",
    accent: "#8A6D1F",
    accentLight: "#A98A34",
    dark: false,
    headerStyle: "telegram",
    displayFont: "'Playfair Display', serif",
    monoFont: "'IBM Plex Mono', monospace",
  },
};

// Body text stays 'Source Serif 4' across all three skins — same voice,
// different accents — that's the deliberate cohesion device. Display and
// mono faces differ per skin above.
const BODY_FONT = "'Source Serif 4', serif";

function skinFor(campaignId) {
  return SKINS[CAMPAIGN_SKINS[campaignId]];
}

// ============================================================================
// FRONT MAP — real geography (Round 22+). Was a hand-placed schematic
// through Round 21 (see the old comment this replaced, preserved in
// CIVILWAR_MAP_NOTES below FrontMapScreen along with the full account of
// what changed). Coordinates are now projected from each city's actual
// lat/long, and the backdrop is real coastline/lake data — not eyeballed.
// Every city below is a real place that appears in an actual written
// node's title or content; nothing here is decorative or invented to fill
// space on the map.
// Each city carries an explicit label anchor. Before this, every label
// rendered to the right at a fixed offset, which made the southern cluster
// (Perekop / Sevastopol / Novorossiysk / Ekaterinodar) and the Don cluster
// (Yuzovka / The Don / Tsaritsyn) overlap into an unreadable smear on a
// phone screen. Anchors are hand-placed to fan labels away from neighbours.
//   anchor: "e" | "w" | "n" | "s"  — which side of the marker the label sits
// Each place carries:
//   anchor — which side of the marker the label sits (see labelPos)
//   kind   — "city" | "region" | "fortification". Marker SHAPE follows this.
//            Two of these entries are not cities and must not be sized as
//            though they were: "The Don" is a Cossack host territory, not a
//            settlement, and Perekop is a fortified isthmus of a few thousand
//            people whose importance is entirely positional. Sizing either by
//            population would mean inventing a number or drawing them as
//            insignificant, and both would be wrong.
//   pop    — population in thousands, c.1914–1917, for cities only. Figures
//            are order-of-magnitude accurate rather than precise: wartime
//            Russian urban populations swung enormously with refugees,
//            garrisons, and evacuation, and no single census covers the
//            period cleanly. Marker AREA scales with population.
//   control — documented changes of hands, as [YYYYMM, side]. Read as
//            "from this month, this side held it." Sides: "red", "white",
//            "other" (German, Ukrainian, Allied, or Japanese-backed control
//            that is neither Red nor White in this game's sense), and
//            "contested" where control genuinely alternated faster than a
//            monthly resolution can express. Marker FILL follows this, at
//            the date of the situation currently in front of the player.
// Shared across all three campaigns — a single alphabetical list rather than
// per-campaign, since a confused player usually doesn't know which
// campaign's vocabulary a term even belongs to. Terms actually used
// elsewhere in this file; nothing added for completeness's own sake.
const GLOSSARY = [
  { term: "AFSR", definition: "Armed Forces of South Russia — the formal name of Denikin's, then Wrangel's, combined White command in the south from January 1919 onward. Encompasses the Volunteer Army, the Don Army, and Kuban/Terek Cossack formations under one nominal command." },
  { term: "Cheka", definition: "The Bolshevik security and secret police apparatus, founded December 1917, tasked with suppressing counter-revolution and enforcing Party authority. Predecessor to the OGPU, then NKVD." },
  { term: "Comintern", definition: "The Communist International, founded in Moscow in March 1919 — an organization explicitly committed to spreading revolution beyond Russia's own borders. Its founding is a major reason Allied support for the Whites hardened through 1919." },
  { term: "Directory", definition: "The Ufa Directory — a short-lived, broadly moderate coalition government formed in September 1918 to unite Siberia's anti-Bolshevik factions. Overthrown by Kolchak's coup in November 1918, the event that opens the siberia campaign." },
  { term: "Duma", definition: "Russia's elected legislature under the old imperial and Provisional Government systems, largely defunct by the period this game covers, but still the reference point every faction's own claim to legitimate authority is implicitly measured against." },
  { term: "Kombedy", definition: "Committees of Poor Peasants — Bolshevik village-level bodies established in mid-1918 to organize grain requisitioning and identify 'kulaks.' Dissolved and folded into regular local soviets by December 1918 after their conflict with existing village authority became unworkable." },
  { term: "NEP", definition: "The New Economic Policy, announced by Lenin at the Tenth Party Congress in March 1921 — the same month as Kronstadt — replacing forced grain requisitioning with a tax in kind and permitting limited private trade. A major, if late, course correction." },
  { term: "Politburo", definition: "The Bolshevik Party's small inner leadership body, formally established in 1919, where the Civil War's most consequential decisions were actually argued and made — distinct from the much larger, more ceremonial Council of People's Commissars (Sovnarkom)." },
  { term: "Prikaz", definition: "A formal military order or directive in Russian usage — the word appears throughout Red and White command communications alike, and simply means an order given the weight of a written command." },
  { term: "Rada", definition: "A council or assembly — used generically, but in this game specifically refers to the Kuban Rada, the elected body representing the Kuban Cossack Host, whose separatist ambitions and eventual violent suppression run through the southRussia campaign." },
  { term: "Revvoensoviet", definition: "The Revolutionary Military Council of the Republic — the Bolshevik government's central body for running the war effort, chaired by Trotsky. The seat commanded in the bolsheviks campaign." },
  { term: "Sivash", definition: "A shallow, wind-exposed lagoon separating the Crimean peninsula from the mainland east of Perekop — nicknamed the 'Rotten Sea.' Its unexpected fordability at low water was what let Frunze's forces turn the Perekop defenses from the flank in November 1920." },
  { term: "Sovnarkom", definition: "The Council of People's Commissars — the Bolshevik government's formal executive cabinet, chaired by Lenin. Larger and more public-facing than the Politburo, which held the real decision-making weight." },
  { term: "Stavka", definition: "General headquarters — the seat of supreme military command, a term inherited from the old Imperial Russian Army and used by multiple factions in this war for their own senior command structures." },
  { term: "Voenspetsy", definition: "Ex-Imperial Russian Army officers recruited into Red Army service as military specialists, over the strong objections of the 'Military Opposition' faction inside the Bolshevik Party who saw the practice as a betrayal of revolutionary principle." },
  { term: "White / Red", definition: "The two main sides of the war in shorthand — White for the loose, often mutually distrustful anti-Bolshevik coalition (monarchists, liberals, Cossack hosts, regional separatists), Red for the Bolshevik-led Soviet government and its Red Army. Neither side was ever as unified internally as the label suggests." },
];

// City coordinates below are real, not schematic: an equirectangular
// projection (standard parallel 53°N -- true scale along every meridian
// and along that parallel, the honest standard choice for a mid-latitude
// regional map) over verified real-world lat/long for every place named,
// looked up individually (Wikipedia infobox coordinates) rather than
// eyeballed. Scale is uniform: 1 unit ~= 7.0 km. See CIVILWAR_MAP_NOTES
// below FrontMapScreen for the full account of what changed and why.
const CITIES = {
  petrograd: { name: "Petrograd", x: 146.4, y: 64.5, anchor: "e", kind: "city", pop: 2400,
    control: [[191710, "red"]] },
  kronstadt: { name: "Kronstadt", x: 141.3, y: 63.6, anchor: "s", kind: "city", pop: 50,
    control: [[191710, "red"], [192103, "contested"], [192104, "red"]] },
  moscow: { name: "Moscow", x: 216.4, y: 131.0, anchor: "e", kind: "city", pop: 1800,
    control: [[191711, "red"]] },
  orel: { name: "Orel", x: 201.6, y: 175.3, anchor: "w", kind: "city", pop: 76,
    control: [[191711, "red"], [191910, "white"], [191911, "red"]] },
  voronezh: { name: "Voronezh", x: 231.7, y: 196.0, anchor: "w", kind: "city", pop: 94,
    control: [[191711, "red"], [191909, "white"], [191910, "red"]] },
  warsaw: { name: "Warsaw", x: 57.4, y: 187.1, anchor: "s", kind: "city", pop: 880,
    control: [[191811, "other"], [192008, "contested"], [192009, "other"]] },
  kharkov: { name: "Kharkov", x: 203.1, y: 222.7, anchor: "w", kind: "city", pop: 244,
    control: [[191804, "other"], [191901, "red"], [191906, "white"], [191912, "red"]] },
  // Added round 22, alongside the kievConvergence19 node -- verified via
  // Wikipedia infobox coordinates and the "1919 Kiev city census" (544,368)
  // and "Battle of Kiev (January 1919)" / "Capture of Kiev by the White
  // Army" / "Battle of Kiev (December 1919)" articles for the control dates.
  kiev: { name: "Kiev", x: 148.5, y: 215.4, anchor: "n", kind: "city", pop: 544,
    control: [[191812, "other"], [191902, "red"], [191908, "white"], [191912, "red"]] },
  yuzovka: { name: "Yuzovka (Donbas)", x: 218.2, y: 254.1, anchor: "n", kind: "city", pop: 70,
    control: [[191804, "contested"], [191912, "red"]] },
  don: { name: "The Don", x: 240.1, y: 263.6, anchor: "e", kind: "region",
    control: [[191805, "white"], [192001, "red"]] },
  saratov: { name: "Saratov", x: 297.0, y: 198.2, anchor: "e", kind: "city", pop: 240,
    control: [[191711, "red"]] },
  tsaritsyn: { name: "Tsaritsyn", x: 282.5, y: 243.1, anchor: "e", kind: "city", pop: 130,
    control: [[191711, "red"], [191906, "white"], [192001, "red"]] },
  ekaterinodar: { name: "Ekaterinodar", x: 229.3, y: 301.6, anchor: "e", kind: "city", pop: 100,
    control: [[191802, "red"], [191808, "white"], [192003, "red"]] },
  novorossiysk: { name: "Novorossiysk", x: 218.0, y: 306.6, anchor: "s", labelNudge: [35, 14], kind: "city", pop: 67,
    control: [[191808, "white"], [192003, "red"]] },
  perekop: { name: "Perekop", x: 178.8, y: 283.6, anchor: "w", kind: "fortification",
    control: [[191904, "white"], [192011, "red"]] },
  sevastopol: { name: "Sevastopol", x: 177.2, y: 308.4, anchor: "s", kind: "city", pop: 74,
    control: [[191812, "other"], [191904, "white"], [192011, "red"]] },
  ufa: { name: "Ufa", x: 391.9, y: 147.4, anchor: "n", kind: "city", pop: 100,
    control: [[191711, "red"], [191807, "white"], [191812, "red"], [191903, "white"], [191906, "red"]] },
  chelyabinsk: { name: "Chelyabinsk", x: 443.9, y: 140.6, anchor: "s", kind: "city", pop: 70,
    control: [[191805, "white"], [191907, "red"]] },
  omsk: { name: "Omsk", x: 558.7, y: 143.3, anchor: "n", kind: "city", pop: 130,
    control: [[191806, "white"], [191911, "red"]] },
  krasnoyarsk: { name: "Krasnoyarsk", x: 745.4, y: 127.0, anchor: "n", kind: "city", pop: 70,
    control: [[191806, "white"], [192001, "red"]] },
  irkutsk: { name: "Irkutsk", x: 854.6, y: 186.1, anchor: "n", kind: "city", pop: 90,
    control: [[191807, "white"], [192001, "contested"], [192003, "red"]] },
  chita: { name: "Chita", x: 942.6, y: 189.9, anchor: "n", kind: "city", pop: 70,
    control: [[191809, "other"], [192010, "red"]] },
};

// MAP_VIEWBOX matches the projection above: width 1000 (same order of
// magnitude as the old schematic map, so marker/stroke/font constants
// tuned for it stay sane), height derived from the real padded lat/long
// extent (Warsaw to Chita, Arctic fringe to the Caucasus coast).
const MAP_VIEWBOX = { w: 1000, h: 372 };

// Real coastline + major-lake water fill, clipped to the map's extent and
// projected the same way as the cities above -- Natural Earth 50m
// coastline/ocean/lakes data (fetched fresh; verified reachable), not
// hand-drawn. Filled with evenodd so each polygon's holes (islands in a
// bay, etc.) punch correctly from a single <path>.
const WATER_PATHS = [
  "M 353.6 272.0 L 354.2 271.8 L 354.9 272.8 L 355.4 273.0 L 357.4 272.0 L 358.1 270.9 L 358.7 270.4 L 360.6 271.0 L 362.9 271.0 L 364.0 272.0 L 364.3 272.6 L 365.3 275.5 L 364.4 277.5 L 364.3 278.6 L 364.7 279.6 L 365.0 283.1 L 364.1 286.7 L 362.6 289.7 L 361.5 293.0 L 362.1 294.2 L 364.5 295.6 L 365.6 296.8 L 364.4 297.2 L 362.8 297.0 L 359.2 295.8 L 358.2 295.7 L 354.6 295.9 L 351.6 295.7 L 349.7 296.6 L 348.5 296.4 L 347.4 298.4 L 346.9 300.2 L 346.0 301.5 L 344.9 302.4 L 344.6 303.3 L 344.7 304.4 L 345.1 305.1 L 346.6 306.7 L 347.5 308.2 L 348.7 308.4 L 349.3 308.8 L 349.7 309.6 L 348.1 309.4 L 346.2 310.0 L 345.0 309.6 L 343.2 308.0 L 338.9 308.1 L 337.8 308.8 L 337.5 309.6 L 337.4 311.5 L 337.6 312.4 L 338.1 312.8 L 341.5 313.8 L 342.9 314.9 L 344.0 318.7 L 345.2 322.0 L 345.9 323.6 L 346.8 324.7 L 347.4 326.2 L 347.5 328.3 L 347.4 331.1 L 350.4 331.4 L 351.2 332.3 L 352.6 335.3 L 353.1 336.0 L 353.7 336.3 L 354.8 335.8 L 355.9 336.0 L 356.7 337.1 L 358.8 336.8 L 359.4 337.0 L 359.8 337.7 L 360.2 341.0 L 360.0 343.0 L 358.5 348.2 L 358.6 351.6 L 358.8 353.3 L 359.9 357.3 L 361.3 359.9 L 362.3 362.5 L 362.4 362.4 L 362.1 360.3 L 362.6 355.3 L 361.9 354.4 L 362.8 351.5 L 363.4 350.2 L 365.3 348.3 L 366.4 348.5 L 369.7 347.7 L 370.9 347.8 L 371.8 348.4 L 374.2 357.5 L 375.0 358.9 L 378.9 362.6 L 379.7 363.8 L 380.1 365.5 L 380.1 367.5 L 379.5 368.0 L 378.5 368.4 L 376.8 367.8 L 376.3 368.4 L 376.9 370.6 L 376.0 370.6 L 375.1 370.2 L 372.0 371.3 L 371.0 371.0 L 369.6 368.6 L 368.7 368.4 L 367.7 369.0 L 366.9 369.2 L 365.1 368.5 L 364.3 367.5 L 363.1 365.1 L 362.2 370.7 L 361.9 372.0 L 332.3 372.0 L 329.8 368.9 L 327.6 365.3 L 326.4 360.9 L 323.7 355.7 L 322.2 353.2 L 319.5 350.6 L 318.0 346.9 L 316.6 344.2 L 314.1 340.1 L 313.2 339.0 L 313.0 336.9 L 312.3 335.4 L 311.3 334.4 L 310.7 333.4 L 311.2 330.4 L 310.9 327.8 L 311.1 325.8 L 312.4 319.8 L 311.6 320.6 L 310.7 325.1 L 310.4 321.5 L 309.7 318.1 L 309.2 316.4 L 308.4 314.9 L 306.5 312.5 L 305.4 311.8 L 303.9 311.3 L 303.6 310.8 L 303.4 310.0 L 303.5 309.1 L 303.9 307.6 L 305.8 305.6 L 306.3 304.1 L 307.0 305.0 L 307.3 303.6 L 308.4 301.7 L 309.6 298.6 L 310.0 297.4 L 310.2 295.4 L 310.9 294.9 L 311.2 294.3 L 311.3 292.5 L 310.7 291.3 L 310.8 291.2 L 312.3 292.8 L 312.5 291.7 L 313.0 291.2 L 314.2 291.6 L 317.3 290.4 L 318.3 289.7 L 320.5 287.2 L 321.5 287.2 L 322.4 288.0 L 322.8 287.8 L 323.0 287.5 L 322.6 286.6 L 322.4 284.8 L 323.6 284.6 L 326.2 283.2 L 326.6 281.7 L 327.7 281.6 L 327.4 280.1 L 328.1 279.2 L 328.9 279.7 L 328.7 277.9 L 333.9 276.7 L 335.0 276.1 L 337.9 273.5 L 339.0 272.2 L 340.5 272.2 L 343.8 269.6 L 346.2 268.5 L 347.3 268.7 L 350.4 269.8 L 351.7 271.3 L 353.6 272.0 Z M 315.1 293.2 L 315.5 294.6 L 315.7 293.3 L 315.3 291.8 L 315.0 292.3 L 315.1 293.2 Z M 359.8 295.3 L 360.5 295.7 L 360.6 295.5 L 360.7 294.8 L 360.4 293.9 L 359.9 293.7 L 359.4 294.6 L 359.8 295.3 Z M 337.8 300.9 L 337.4 301.7 L 337.6 302.8 L 338.1 302.1 L 338.3 300.8 L 337.8 300.9 Z M 336.0 300.8 L 335.2 301.4 L 334.9 303.1 L 335.9 304.8 L 336.4 304.9 L 336.7 304.4 L 335.9 304.0 L 335.3 302.9 L 335.4 301.9 L 336.1 301.2 L 336.0 300.8 Z",
  "M 30.2 72.5 L 30.7 72.7 L 31.3 72.4 L 34.1 70.4 L 35.5 68.9 L 37.9 67.3 L 38.1 66.2 L 37.5 64.4 L 36.1 62.2 L 34.4 61.6 L 33.7 61.1 L 34.0 59.5 L 32.4 58.1 L 31.0 57.7 L 30.2 57.0 L 28.7 55.3 L 28.2 54.1 L 25.4 55.0 L 24.7 53.5 L 24.4 53.3 L 22.5 53.3 L 21.4 52.3 L 21.7 50.6 L 21.0 48.3 L 21.1 47.8 L 20.6 43.2 L 21.0 42.6 L 20.7 41.9 L 20.4 41.5 L 20.6 40.3 L 20.3 38.4 L 21.1 37.1 L 20.9 36.1 L 22.2 36.6 L 23.5 36.7 L 23.0 35.8 L 22.6 33.8 L 23.9 29.0 L 24.4 28.3 L 25.1 28.0 L 24.2 27.5 L 23.1 26.3 L 22.6 24.9 L 22.7 24.3 L 23.0 23.6 L 24.5 24.5 L 25.2 24.5 L 25.9 23.7 L 27.0 23.7 L 28.1 22.5 L 29.0 22.1 L 27.7 21.2 L 28.4 20.2 L 27.6 18.5 L 27.5 17.8 L 27.7 17.6 L 28.1 18.4 L 29.5 18.4 L 29.3 19.1 L 30.2 19.1 L 31.0 18.2 L 33.0 17.4 L 33.4 15.9 L 31.6 15.8 L 31.9 15.3 L 33.7 14.8 L 34.4 12.9 L 36.8 12.5 L 36.8 12.2 L 36.2 12.0 L 36.4 11.7 L 38.5 12.0 L 40.4 10.2 L 40.9 8.9 L 41.6 8.2 L 42.9 9.0 L 43.0 7.7 L 44.5 8.5 L 45.1 8.4 L 45.7 7.2 L 46.9 6.0 L 49.7 5.2 L 51.3 4.3 L 52.1 3.5 L 54.2 2.6 L 55.1 2.0 L 56.0 0.0 L 80.5 0.0 L 78.9 1.5 L 76.6 2.7 L 74.1 4.9 L 72.0 5.5 L 72.0 6.5 L 70.7 7.9 L 70.0 7.7 L 69.9 8.2 L 70.2 8.7 L 69.5 8.5 L 69.2 8.8 L 69.9 10.3 L 70.0 10.8 L 68.1 11.9 L 65.9 12.4 L 65.0 12.0 L 62.6 12.5 L 62.8 14.0 L 63.6 15.1 L 61.9 15.2 L 61.7 16.6 L 59.2 19.1 L 58.5 20.7 L 58.3 21.8 L 58.9 25.1 L 60.4 26.2 L 60.6 27.3 L 60.7 28.1 L 59.8 31.8 L 61.0 33.0 L 62.6 36.4 L 63.1 38.2 L 63.0 38.5 L 62.1 38.8 L 62.7 39.9 L 62.2 39.9 L 62.3 41.0 L 62.2 43.1 L 61.9 44.9 L 61.0 46.6 L 60.8 48.1 L 61.2 51.3 L 61.3 53.4 L 61.5 54.0 L 63.2 55.0 L 64.3 54.2 L 65.0 54.0 L 65.5 55.4 L 66.3 55.5 L 69.4 57.1 L 72.5 57.4 L 71.8 59.0 L 71.9 59.3 L 72.5 59.4 L 72.6 59.9 L 72.3 60.2 L 71.4 60.3 L 71.1 61.0 L 71.4 61.1 L 71.1 62.0 L 71.3 63.0 L 73.1 63.0 L 74.1 62.6 L 74.7 61.9 L 75.2 60.1 L 75.6 60.1 L 76.4 61.9 L 77.2 62.7 L 78.4 63.1 L 78.3 63.9 L 76.1 66.2 L 76.7 66.4 L 78.2 66.0 L 80.9 63.7 L 83.4 64.0 L 89.3 62.8 L 90.3 63.1 L 91.0 62.7 L 91.8 61.7 L 97.1 60.4 L 98.2 59.5 L 100.0 59.3 L 101.9 58.2 L 102.5 59.2 L 102.9 59.2 L 104.7 58.0 L 105.5 58.1 L 105.6 57.6 L 104.8 55.9 L 105.5 55.9 L 107.2 57.0 L 108.8 56.7 L 109.6 56.1 L 109.9 54.7 L 110.7 53.5 L 111.0 53.5 L 110.2 56.0 L 110.3 56.9 L 112.1 56.2 L 114.3 56.0 L 115.5 55.1 L 116.7 54.8 L 119.2 56.1 L 119.8 55.7 L 121.2 55.5 L 122.1 55.0 L 126.1 54.4 L 129.3 52.7 L 130.6 53.8 L 130.3 55.7 L 129.1 54.9 L 129.3 55.8 L 130.5 57.5 L 132.1 58.2 L 134.6 60.4 L 137.5 60.7 L 139.4 60.3 L 140.8 60.4 L 142.3 61.6 L 143.3 63.1 L 145.1 64.2 L 145.0 65.0 L 144.7 65.5 L 140.3 64.2 L 135.3 63.5 L 134.7 64.1 L 133.4 66.2 L 131.5 66.6 L 130.1 66.4 L 129.3 65.9 L 128.7 66.4 L 128.4 67.7 L 127.6 68.4 L 126.4 67.9 L 125.6 66.9 L 124.9 67.0 L 124.5 67.9 L 125.0 70.6 L 124.4 71.9 L 123.3 72.8 L 118.0 72.2 L 114.5 72.2 L 113.4 71.9 L 111.2 70.6 L 109.6 70.6 L 103.2 69.3 L 100.5 69.2 L 100.6 70.5 L 99.9 71.1 L 94.5 71.1 L 91.6 72.1 L 89.7 71.9 L 87.7 73.4 L 86.6 73.5 L 86.9 74.7 L 84.0 75.0 L 81.2 76.3 L 81.4 77.7 L 81.0 78.9 L 81.4 79.4 L 80.6 80.7 L 81.3 82.7 L 83.0 82.8 L 82.7 83.3 L 81.6 83.9 L 81.4 84.8 L 81.9 86.1 L 83.1 87.3 L 83.2 88.4 L 83.8 89.6 L 87.2 91.1 L 88.3 90.7 L 89.3 89.2 L 89.8 89.2 L 91.1 89.7 L 91.3 90.5 L 90.7 91.1 L 90.5 93.6 L 89.2 96.7 L 88.9 98.7 L 89.5 100.9 L 89.9 106.0 L 89.7 107.2 L 88.7 108.5 L 85.4 111.1 L 82.7 111.7 L 79.2 109.8 L 77.8 106.1 L 73.1 101.7 L 72.2 99.7 L 66.4 101.7 L 64.3 102.1 L 61.7 106.1 L 61.4 107.5 L 61.2 109.1 L 60.7 110.9 L 59.8 112.3 L 58.0 114.0 L 57.6 117.0 L 57.5 123.0 L 57.8 126.7 L 57.9 130.1 L 59.6 135.8 L 59.3 137.6 L 59.6 138.7 L 59.1 144.1 L 57.3 144.6 L 56.3 144.5 L 53.5 143.3 L 56.0 140.1 L 57.6 137.4 L 58.3 135.3 L 58.4 133.2 L 57.5 136.6 L 55.9 139.3 L 54.3 141.4 L 52.7 143.1 L 51.6 143.8 L 48.8 143.7 L 47.5 144.3 L 47.2 147.0 L 46.4 148.8 L 45.4 150.3 L 43.5 152.0 L 42.1 152.8 L 38.0 153.4 L 36.6 153.1 L 35.0 152.1 L 34.2 150.8 L 32.8 147.1 L 33.4 147.1 L 36.3 148.9 L 35.9 148.0 L 31.7 145.6 L 29.4 145.6 L 27.1 145.9 L 21.5 147.3 L 17.9 149.4 L 14.8 150.1 L 11.3 154.3 L 8.5 154.9 L 0.0 157.6 L 0.0 142.8 L 0.7 142.7 L 1.2 141.6 L 1.2 140.7 L 0.0 139.9 L 0.0 124.4 L 3.0 124.7 L 5.9 124.2 L 7.8 125.1 L 9.4 123.6 L 10.9 119.1 L 11.5 117.7 L 12.8 115.8 L 14.5 110.1 L 14.1 108.2 L 14.0 107.0 L 15.5 104.4 L 15.7 103.2 L 15.3 102.2 L 15.1 101.0 L 15.1 99.1 L 14.8 98.3 L 15.2 96.7 L 16.1 96.6 L 16.2 92.7 L 16.8 91.9 L 15.7 88.4 L 18.3 87.5 L 17.0 86.0 L 14.0 85.5 L 13.2 85.7 L 11.5 85.2 L 12.5 84.7 L 18.8 84.9 L 20.0 84.0 L 22.4 82.9 L 23.4 81.6 L 25.5 80.7 L 26.4 79.9 L 27.0 80.1 L 29.6 78.4 L 31.3 77.7 L 32.2 76.5 L 32.6 74.8 L 33.4 74.7 L 34.5 74.2 L 34.0 73.1 L 33.5 72.9 L 32.4 73.5 L 31.2 73.6 L 30.6 74.1 L 29.9 74.4 L 28.4 74.2 L 28.3 73.7 L 30.2 72.5 Z M 17.9 111.4 L 19.6 107.9 L 19.5 106.7 L 20.2 106.1 L 19.3 105.7 L 19.0 106.2 L 17.7 109.8 L 16.4 112.8 L 15.5 113.2 L 13.4 118.1 L 13.2 119.4 L 13.3 122.2 L 13.6 123.2 L 14.0 123.3 L 14.5 122.5 L 16.9 114.3 L 17.5 113.7 L 17.9 111.4 Z M 30.0 112.5 L 31.0 112.3 L 31.9 111.6 L 32.3 109.8 L 33.2 108.6 L 35.3 107.3 L 35.7 106.1 L 36.1 105.5 L 37.3 104.9 L 36.2 103.5 L 36.4 100.0 L 37.7 99.4 L 38.1 98.3 L 38.9 97.9 L 37.2 96.6 L 36.7 96.9 L 36.3 98.0 L 35.5 97.5 L 33.8 98.0 L 32.5 99.2 L 29.9 102.4 L 29.8 104.1 L 30.1 105.8 L 29.6 106.9 L 30.6 109.1 L 31.3 109.9 L 30.6 111.0 L 30.0 112.5 Z M 39.5 97.5 L 39.7 96.5 L 41.4 95.9 L 39.5 95.6 L 38.6 96.7 L 39.0 97.4 L 39.5 97.5 Z M 66.9 96.4 L 67.6 96.3 L 68.4 95.8 L 69.1 94.5 L 69.5 92.7 L 70.5 91.8 L 71.7 91.5 L 73.9 91.6 L 74.2 91.1 L 76.3 89.5 L 76.8 89.4 L 77.7 88.4 L 79.6 88.1 L 79.3 87.6 L 76.1 85.7 L 74.8 85.4 L 73.5 85.8 L 72.1 85.3 L 70.0 86.1 L 69.5 87.2 L 68.5 87.1 L 67.7 87.7 L 66.9 87.2 L 65.6 87.4 L 66.8 89.1 L 66.2 90.3 L 65.5 90.5 L 65.8 91.1 L 68.7 92.8 L 66.8 95.4 L 66.7 95.9 L 66.9 96.4 Z M 77.1 85.6 L 79.0 86.7 L 79.8 86.5 L 79.9 86.1 L 79.7 85.0 L 78.1 84.5 L 77.5 84.8 L 77.1 85.6 Z M 74.3 82.2 L 75.0 82.9 L 75.8 82.1 L 76.6 82.0 L 76.3 80.7 L 75.6 79.5 L 73.9 79.2 L 73.6 78.2 L 73.1 78.0 L 72.5 78.1 L 71.7 79.0 L 71.3 79.8 L 67.4 80.3 L 68.5 81.0 L 69.9 81.1 L 70.8 81.6 L 71.5 83.3 L 71.4 84.0 L 72.1 84.3 L 73.2 84.0 L 74.3 82.2 Z M 33.3 77.7 L 32.4 78.0 L 32.0 79.0 L 32.6 78.9 L 33.3 77.7 Z M 34.6 71.6 L 35.3 71.0 L 35.3 70.9 L 34.6 70.7 L 34.1 71.0 L 33.8 71.8 L 34.1 72.4 L 34.6 71.6 Z M 53.6 62.8 L 53.2 62.4 L 52.5 62.3 L 51.6 62.8 L 52.4 63.0 L 52.8 63.3 L 53.5 63.2 L 53.6 62.8 Z M 48.1 62.0 L 48.2 60.6 L 48.5 60.4 L 49.6 60.4 L 50.2 59.3 L 48.6 57.9 L 47.2 57.8 L 46.7 57.0 L 46.1 57.3 L 45.7 57.9 L 46.5 58.7 L 46.3 60.0 L 45.7 60.1 L 45.6 58.9 L 44.8 59.2 L 44.6 59.8 L 45.3 61.9 L 45.8 62.2 L 48.1 62.0 Z M 44.2 60.8 L 44.6 60.9 L 44.2 59.6 L 43.5 59.6 L 43.2 60.5 L 43.3 61.2 L 43.7 61.3 L 44.2 60.8 Z M 66.2 58.2 L 66.9 58.1 L 66.0 57.2 L 66.4 57.1 L 66.0 56.5 L 65.3 56.0 L 65.2 56.3 L 65.4 56.9 L 65.0 57.1 L 65.2 57.4 L 66.2 58.2 Z M 68.1 57.8 L 67.6 58.9 L 68.7 59.7 L 68.9 60.4 L 69.4 60.8 L 70.4 60.9 L 70.2 60.3 L 69.8 59.8 L 69.9 59.2 L 70.9 58.7 L 70.3 57.8 L 69.8 58.0 L 68.6 57.6 L 68.1 57.8 Z M 65.6 60.3 L 64.7 60.3 L 64.1 60.7 L 64.0 61.7 L 64.4 61.8 L 65.3 61.2 L 65.6 60.3 Z M 62.8 60.7 L 62.2 61.1 L 62.0 61.5 L 62.5 61.9 L 63.3 61.8 L 63.5 61.2 L 63.4 60.8 L 62.8 60.7 Z M 60.2 55.9 L 61.5 55.8 L 61.7 55.1 L 60.2 54.0 L 59.9 53.3 L 59.5 53.6 L 59.4 53.9 L 59.7 55.1 L 60.2 55.9 Z M 60.8 12.5 L 61.3 12.6 L 61.4 11.9 L 60.8 11.6 L 59.5 12.2 L 59.4 11.9 L 59.6 11.3 L 58.1 11.3 L 58.8 12.6 L 59.8 13.3 L 60.3 13.2 L 60.8 12.5 Z",
  "M 28.2 371.2 L 23.6 368.3 L 21.7 366.1 L 20.0 364.7 L 14.8 362.0 L 9.6 358.8 L 8.5 357.6 L 8.6 355.9 L 10.9 353.7 L 11.3 352.8 L 11.0 351.5 L 9.1 350.8 L 3.8 351.2 L 1.5 350.9 L 0.0 349.9 L 0.0 317.7 L 1.2 319.5 L 1.8 319.5 L 0.0 316.9 L 0.0 311.3 L 1.5 313.1 L 2.2 312.4 L 0.0 309.6 L 0.0 308.8 L 2.5 311.9 L 4.4 313.7 L 2.6 313.4 L 1.1 313.9 L 1.7 315.3 L 4.7 319.5 L 8.9 323.5 L 8.9 324.9 L 9.3 325.6 L 10.7 325.9 L 13.2 325.3 L 15.2 326.5 L 18.1 327.7 L 20.3 330.6 L 22.2 332.1 L 26.0 336.3 L 21.1 333.5 L 19.5 333.7 L 21.5 334.4 L 24.6 336.5 L 26.9 337.1 L 30.2 339.7 L 33.6 342.9 L 34.8 342.8 L 34.5 343.5 L 34.7 343.8 L 37.2 345.9 L 39.4 348.9 L 40.0 350.6 L 41.5 351.9 L 42.7 352.1 L 43.7 353.2 L 43.7 355.5 L 42.9 356.8 L 42.4 359.0 L 42.8 362.0 L 42.6 364.0 L 42.6 366.8 L 41.4 371.1 L 41.6 372.0 L 28.6 372.0 L 28.2 371.2 Z M 23.2 337.1 L 22.3 337.2 L 26.2 338.7 L 24.9 337.6 L 23.2 337.1 Z M 18.8 335.1 L 20.8 335.2 L 19.9 334.5 L 18.8 334.2 L 17.5 334.4 L 15.7 334.0 L 15.8 334.6 L 16.5 335.3 L 17.6 335.6 L 18.8 335.1 Z M 14.5 330.3 L 13.1 330.5 L 14.7 331.6 L 16.0 332.0 L 20.9 331.9 L 16.1 331.1 L 15.7 330.5 L 14.5 330.3 Z M 13.8 327.8 L 13.5 328.9 L 14.2 329.4 L 17.0 329.6 L 18.0 328.9 L 17.5 328.3 L 13.8 327.8 Z M 2.3 317.6 L 2.1 317.0 L 0.5 315.5 L 1.1 316.5 L 2.3 317.6 Z M 4.1 319.6 L 3.4 318.4 L 2.5 317.8 L 3.5 319.4 L 4.1 319.6 Z",
  "M 84.2 372.0 L 83.6 370.9 L 83.8 369.7 L 85.5 369.7 L 86.8 370.1 L 88.3 369.1 L 89.7 367.1 L 90.6 366.6 L 91.4 366.8 L 92.6 367.8 L 93.6 368.0 L 95.7 366.2 L 96.6 365.8 L 98.0 366.8 L 98.7 366.6 L 100.4 367.5 L 103.8 368.2 L 105.3 369.4 L 106.2 371.9 L 112.8 371.7 L 112.6 372.0 L 93.1 372.0 L 93.5 371.8 L 93.6 370.4 L 93.5 370.0 L 92.9 369.1 L 92.0 369.0 L 91.0 370.7 L 91.0 371.3 L 91.8 372.0 L 84.2 372.0 Z",
  "M 117.2 370.7 L 118.9 368.3 L 119.6 366.2 L 121.9 365.5 L 123.6 365.9 L 126.0 364.4 L 127.2 364.6 L 131.8 366.1 L 133.5 365.6 L 133.9 364.8 L 134.5 362.1 L 133.4 361.8 L 127.7 358.3 L 126.2 356.9 L 124.8 354.1 L 124.2 352.1 L 124.5 350.3 L 124.2 349.1 L 121.6 344.3 L 120.9 343.4 L 119.4 342.4 L 122.0 338.6 L 123.3 337.9 L 123.4 333.6 L 123.7 331.0 L 124.7 329.6 L 125.6 327.6 L 127.4 327.1 L 128.8 327.7 L 129.7 325.9 L 130.0 321.2 L 130.7 318.3 L 130.5 313.3 L 131.0 312.1 L 132.5 310.0 L 132.9 308.9 L 132.1 309.0 L 132.1 308.4 L 132.5 307.9 L 132.5 306.6 L 133.2 305.1 L 132.9 303.4 L 133.3 302.6 L 133.7 302.2 L 134.8 302.5 L 134.4 303.3 L 134.7 305.3 L 134.4 306.0 L 139.3 304.6 L 140.0 302.4 L 140.9 296.6 L 140.3 293.5 L 139.7 292.6 L 139.7 291.2 L 139.9 290.6 L 140.5 290.1 L 141.8 290.5 L 145.6 288.3 L 148.4 284.5 L 149.8 282.0 L 150.4 280.4 L 151.1 277.4 L 154.4 276.3 L 156.1 276.4 L 156.9 276.2 L 157.8 274.4 L 158.5 273.8 L 158.2 275.6 L 160.5 276.1 L 161.4 275.9 L 161.7 274.7 L 161.8 271.5 L 160.3 266.9 L 161.1 267.8 L 162.1 270.6 L 162.3 272.6 L 162.1 273.7 L 162.4 274.9 L 163.1 276.0 L 163.9 276.7 L 166.0 277.2 L 168.2 276.4 L 166.1 278.6 L 163.9 278.1 L 161.5 277.9 L 159.9 277.4 L 158.4 277.4 L 159.9 278.7 L 162.7 279.4 L 162.8 280.0 L 162.6 280.4 L 160.5 281.0 L 161.0 281.7 L 161.9 281.6 L 163.0 282.0 L 167.2 284.9 L 170.3 284.1 L 171.7 284.2 L 174.2 283.4 L 174.7 284.2 L 176.3 285.3 L 177.9 284.7 L 178.6 287.0 L 176.7 288.8 L 174.9 289.9 L 173.6 290.2 L 170.6 292.7 L 167.5 295.7 L 167.9 296.5 L 168.5 296.9 L 170.0 296.4 L 171.4 296.6 L 174.0 299.0 L 174.7 299.4 L 176.0 299.1 L 177.5 300.5 L 178.1 303.6 L 177.3 307.2 L 176.6 308.5 L 176.5 309.2 L 178.5 311.1 L 179.4 311.7 L 180.9 311.8 L 182.5 311.3 L 184.5 309.4 L 186.3 306.5 L 188.7 305.2 L 190.3 304.9 L 192.2 305.2 L 192.8 303.7 L 194.8 302.4 L 195.9 300.5 L 196.8 300.2 L 197.8 300.5 L 199.7 302.0 L 201.5 301.6 L 203.1 301.7 L 204.7 301.1 L 205.3 298.4 L 206.4 295.8 L 203.7 294.8 L 202.6 294.9 L 201.7 295.4 L 201.1 296.2 L 199.3 295.7 L 198.6 295.9 L 196.7 297.2 L 195.7 297.1 L 194.9 296.5 L 193.9 295.0 L 191.6 290.9 L 190.0 286.4 L 189.9 283.2 L 192.0 281.9 L 193.6 279.2 L 194.2 280.3 L 194.0 281.7 L 191.5 284.5 L 192.6 284.2 L 193.3 283.5 L 193.8 282.9 L 195.2 280.1 L 199.3 276.3 L 201.2 275.6 L 202.8 275.9 L 203.6 275.7 L 205.1 274.5 L 206.3 274.1 L 207.5 274.0 L 208.5 274.8 L 209.9 273.1 L 211.0 272.3 L 212.6 271.6 L 213.8 271.6 L 215.7 269.1 L 218.4 268.8 L 221.8 269.0 L 224.7 267.5 L 225.6 266.5 L 227.4 266.1 L 225.4 267.9 L 226.5 268.0 L 229.0 267.5 L 229.9 266.0 L 231.5 266.0 L 232.5 268.6 L 232.2 269.6 L 230.9 269.9 L 227.8 271.8 L 224.3 273.3 L 224.8 274.5 L 224.9 275.6 L 222.3 275.0 L 219.8 276.4 L 217.8 276.1 L 218.3 277.7 L 219.3 279.7 L 219.9 280.1 L 220.8 279.9 L 223.1 282.3 L 224.8 284.8 L 221.8 284.7 L 220.8 287.2 L 220.8 285.9 L 220.2 285.4 L 219.4 286.2 L 218.6 289.4 L 216.9 291.7 L 216.4 293.1 L 216.3 294.2 L 216.9 294.3 L 217.0 295.3 L 216.7 296.1 L 213.0 297.2 L 212.6 297.8 L 211.5 297.3 L 210.3 296.0 L 209.2 295.3 L 207.8 296.2 L 209.9 297.5 L 209.3 298.1 L 206.9 299.1 L 206.9 299.7 L 207.2 300.1 L 210.0 301.0 L 212.5 302.5 L 213.2 303.6 L 213.9 305.5 L 214.4 306.3 L 215.2 306.9 L 217.3 307.5 L 218.7 306.9 L 221.8 311.3 L 223.1 312.0 L 226.2 312.9 L 226.9 313.4 L 232.8 319.6 L 234.6 322.3 L 238.0 326.4 L 241.1 328.9 L 243.7 331.6 L 247.2 332.9 L 249.4 335.0 L 250.0 336.6 L 252.8 338.1 L 253.5 339.3 L 255.2 347.5 L 256.1 350.3 L 256.1 352.7 L 255.5 354.5 L 252.8 359.0 L 248.4 362.4 L 247.1 362.7 L 245.8 364.0 L 241.8 366.3 L 240.5 366.6 L 239.2 366.1 L 238.4 366.3 L 237.4 366.0 L 233.7 364.0 L 228.2 365.4 L 225.4 366.7 L 223.7 366.9 L 219.2 365.7 L 217.8 364.5 L 214.6 363.9 L 211.1 362.8 L 210.4 361.3 L 208.4 359.9 L 207.1 360.1 L 205.8 361.6 L 204.8 361.4 L 203.6 360.4 L 202.7 358.9 L 201.4 354.9 L 200.2 354.4 L 196.7 355.6 L 194.2 354.1 L 192.5 351.6 L 192.5 350.5 L 192.8 349.4 L 191.4 348.8 L 189.0 350.5 L 183.6 350.4 L 175.9 349.5 L 174.9 349.7 L 171.7 351.5 L 167.8 352.9 L 165.6 354.1 L 163.5 356.4 L 157.5 360.6 L 156.4 363.2 L 155.5 364.0 L 151.2 364.4 L 146.8 362.6 L 142.7 363.3 L 137.0 362.1 L 135.3 362.2 L 134.8 362.9 L 134.4 365.6 L 135.0 366.7 L 136.4 368.2 L 137.4 368.8 L 142.1 369.5 L 142.0 369.9 L 134.4 371.3 L 133.1 372.0 L 115.4 372.0 L 117.2 370.7 Z M 159.2 281.9 L 157.9 280.3 L 158.5 282.1 L 159.8 282.8 L 164.1 283.7 L 162.8 282.9 L 159.2 281.9 Z",
  "M 219.8 0.7 L 216.6 1.5 L 214.7 2.8 L 210.3 1.3 L 205.1 0.0 L 220.3 0.0 L 219.8 0.7 Z",
  "M 142.2 43.8 L 142.1 43.3 L 142.5 42.9 L 144.3 43.7 L 144.4 42.8 L 145.3 42.4 L 145.2 41.6 L 145.9 40.3 L 145.8 39.4 L 148.0 39.8 L 148.4 39.2 L 149.3 39.0 L 149.2 37.9 L 150.7 35.9 L 151.7 35.2 L 153.3 36.2 L 154.0 37.7 L 155.3 37.3 L 156.0 38.0 L 156.6 37.6 L 157.7 38.8 L 158.8 40.9 L 159.2 40.2 L 161.7 42.4 L 167.7 45.7 L 168.3 47.6 L 170.0 49.4 L 170.7 52.2 L 171.3 52.5 L 171.7 53.3 L 170.5 55.8 L 169.6 55.2 L 168.4 55.0 L 169.1 57.2 L 168.3 57.8 L 168.5 59.6 L 168.2 60.2 L 166.1 61.1 L 165.1 61.0 L 164.5 60.4 L 163.2 59.9 L 161.1 59.5 L 159.8 59.7 L 158.8 60.8 L 158.9 61.4 L 158.2 62.9 L 158.5 64.0 L 157.9 64.8 L 154.1 64.6 L 153.5 64.3 L 154.5 63.4 L 154.0 62.2 L 154.1 61.2 L 153.2 60.4 L 152.7 59.3 L 151.6 56.4 L 150.9 56.4 L 150.9 55.7 L 150.4 54.5 L 148.6 53.5 L 148.3 52.3 L 148.6 51.3 L 148.5 50.6 L 148.3 50.1 L 146.3 47.5 L 142.1 44.6 L 141.8 44.1 L 142.2 43.8 Z",
  "M 908.0 135.9 L 907.4 137.8 L 907.0 140.1 L 907.1 142.4 L 906.0 146.1 L 905.6 148.2 L 905.0 148.9 L 904.8 150.0 L 904.5 152.9 L 904.5 154.8 L 905.1 156.2 L 904.9 157.1 L 904.6 158.0 L 901.8 161.7 L 901.7 164.0 L 901.5 164.7 L 900.1 164.7 L 899.9 164.2 L 900.4 161.6 L 899.7 161.0 L 899.3 161.1 L 898.2 162.0 L 895.3 166.7 L 898.3 165.5 L 899.0 165.8 L 899.7 167.7 L 899.6 168.6 L 899.1 169.4 L 897.6 170.4 L 896.6 170.0 L 894.0 172.2 L 893.1 173.1 L 893.4 174.2 L 893.0 175.0 L 890.3 177.4 L 889.7 178.3 L 888.0 179.4 L 886.2 179.6 L 884.3 180.4 L 881.6 182.1 L 880.1 183.2 L 878.8 185.5 L 878.3 185.7 L 875.8 184.7 L 874.1 185.6 L 873.7 186.3 L 873.5 187.1 L 873.8 188.1 L 872.9 191.4 L 870.8 194.3 L 869.1 195.5 L 860.6 198.3 L 859.8 198.9 L 858.2 199.0 L 853.4 198.1 L 850.2 196.6 L 849.2 195.6 L 849.9 195.0 L 853.2 194.4 L 857.1 194.2 L 858.3 193.8 L 858.8 193.1 L 859.7 192.8 L 863.1 192.2 L 867.0 189.0 L 869.7 184.6 L 871.6 182.6 L 875.4 180.3 L 878.3 176.9 L 879.7 174.8 L 879.4 174.4 L 878.5 174.5 L 879.2 173.2 L 881.3 171.0 L 885.8 167.9 L 885.9 166.9 L 886.7 165.1 L 890.8 161.3 L 892.4 159.3 L 893.7 156.2 L 894.7 154.5 L 895.9 151.1 L 897.7 148.2 L 898.3 146.2 L 899.1 144.6 L 899.3 144.1 L 899.0 143.8 L 900.3 142.6 L 901.4 139.9 L 901.8 136.6 L 901.6 134.5 L 902.1 133.9 L 905.3 130.7 L 907.1 130.7 L 907.9 131.0 L 908.9 132.3 L 908.0 133.9 L 908.0 135.9 Z M 888.3 168.6 L 887.8 168.5 L 886.2 170.3 L 880.6 173.1 L 880.3 173.6 L 880.3 174.5 L 884.8 173.2 L 886.8 171.3 L 888.0 170.6 L 888.3 168.6 Z",
  "M 205.0 41.6 L 204.5 43.3 L 204.7 44.3 L 204.4 45.0 L 201.9 46.6 L 199.8 48.4 L 200.1 49.1 L 199.5 49.6 L 196.6 48.6 L 195.2 46.9 L 192.6 47.5 L 192.3 46.9 L 190.8 46.5 L 189.9 47.2 L 189.5 46.4 L 189.4 45.6 L 189.8 44.5 L 190.3 44.3 L 192.9 44.5 L 193.6 44.9 L 192.1 45.2 L 191.9 45.3 L 192.0 45.6 L 192.7 46.3 L 195.6 46.6 L 196.4 47.2 L 196.9 47.0 L 197.4 45.9 L 197.4 45.2 L 196.9 43.7 L 195.7 41.9 L 192.8 39.9 L 187.8 37.2 L 185.5 34.9 L 184.8 33.8 L 186.9 34.7 L 187.4 34.1 L 187.4 32.7 L 186.9 31.7 L 184.2 29.0 L 184.2 27.5 L 183.4 26.3 L 181.6 25.2 L 181.3 23.7 L 181.8 23.5 L 182.3 23.8 L 184.9 27.5 L 185.1 28.5 L 186.7 29.8 L 187.9 30.2 L 188.0 29.9 L 187.8 28.8 L 188.1 27.8 L 187.6 26.3 L 188.3 26.3 L 188.4 25.9 L 186.8 23.1 L 187.1 23.1 L 189.8 26.7 L 190.3 28.7 L 191.6 30.4 L 192.5 30.8 L 193.0 30.1 L 191.8 28.0 L 194.6 29.3 L 195.1 29.2 L 196.7 27.9 L 196.8 27.1 L 196.5 26.0 L 194.7 23.4 L 192.8 22.8 L 190.8 21.4 L 189.8 22.3 L 188.9 21.8 L 187.7 20.3 L 186.4 17.8 L 186.5 17.3 L 186.9 17.1 L 188.5 18.2 L 190.5 18.7 L 195.8 22.1 L 196.2 21.7 L 198.4 23.4 L 199.0 24.3 L 199.2 26.1 L 198.4 29.5 L 197.8 30.4 L 198.0 31.0 L 199.2 32.4 L 199.7 34.0 L 200.8 35.6 L 201.5 37.2 L 203.3 39.7 L 204.8 41.0 L 205.0 41.6 Z M 194.7 31.7 L 194.3 30.5 L 193.8 30.4 L 193.2 31.9 L 192.9 33.9 L 193.3 34.2 L 194.0 33.7 L 194.7 31.7 Z",
  "M 226.8 93.5 L 223.7 93.4 L 223.5 93.7 L 224.3 95.0 L 222.8 94.4 L 222.5 93.7 L 222.5 92.1 L 222.2 91.5 L 219.5 90.5 L 219.1 90.7 L 214.5 85.5 L 212.0 84.2 L 212.0 81.8 L 213.5 83.2 L 214.6 83.7 L 214.4 84.6 L 215.7 85.6 L 215.9 86.5 L 216.8 86.4 L 216.6 85.2 L 220.8 86.7 L 221.0 85.2 L 220.0 84.6 L 219.6 83.8 L 219.7 83.5 L 220.3 83.4 L 220.0 81.6 L 219.3 81.6 L 218.4 80.8 L 217.3 80.5 L 216.1 81.0 L 215.3 81.9 L 215.0 81.4 L 215.1 80.6 L 217.0 79.0 L 217.2 78.4 L 216.7 76.9 L 220.0 76.6 L 220.3 77.4 L 221.6 77.8 L 221.8 77.3 L 221.3 76.2 L 221.5 76.1 L 222.9 76.8 L 224.1 76.6 L 223.3 77.9 L 222.4 78.4 L 219.2 77.8 L 218.7 78.2 L 221.2 80.1 L 227.3 86.6 L 229.6 87.4 L 229.7 87.7 L 229.4 88.3 L 229.7 89.6 L 228.4 90.0 L 228.0 90.6 L 227.9 91.3 L 227.9 93.2 L 227.8 93.4 L 226.7 92.0 L 226.2 91.8 L 226.0 92.1 L 226.8 93.5 Z",
  "M 605.8 340.8 L 604.5 341.1 L 601.8 343.0 L 601.6 344.0 L 600.3 346.0 L 598.4 346.9 L 594.8 347.1 L 592.7 346.8 L 589.4 345.2 L 586.4 344.6 L 585.9 342.9 L 586.0 342.5 L 588.2 342.0 L 593.1 340.1 L 596.7 339.2 L 598.6 339.5 L 600.0 338.7 L 603.6 338.3 L 605.4 338.1 L 604.2 339.6 L 604.3 340.2 L 605.9 340.5 L 605.8 340.8 Z",
  "M 664.5 256.7 L 663.9 258.6 L 663.3 259.2 L 662.8 259.0 L 656.9 254.2 L 653.4 252.9 L 651.1 251.0 L 651.3 250.4 L 655.1 250.1 L 655.6 249.5 L 656.0 248.4 L 654.6 246.4 L 654.6 245.6 L 654.9 244.9 L 654.9 242.6 L 655.4 240.7 L 656.5 239.1 L 658.0 237.8 L 660.8 236.7 L 661.6 235.9 L 661.4 234.7 L 659.0 231.8 L 657.2 231.4 L 656.0 230.0 L 655.0 229.3 L 654.4 228.2 L 656.7 228.8 L 658.0 228.4 L 659.4 227.0 L 660.1 226.9 L 660.1 227.3 L 658.7 228.4 L 657.9 230.0 L 663.2 234.7 L 663.9 235.9 L 663.6 236.5 L 656.7 239.9 L 655.8 241.4 L 655.5 242.9 L 656.8 247.4 L 659.7 248.1 L 659.6 248.4 L 657.4 248.8 L 656.6 249.6 L 656.5 250.1 L 661.0 253.0 L 663.7 254.0 L 664.9 254.9 L 665.4 255.5 L 664.5 256.7 Z",
  "M 821.2 200.3 L 820.2 206.9 L 818.5 209.7 L 818.1 210.8 L 817.9 212.1 L 818.2 213.0 L 817.2 214.0 L 815.5 214.7 L 815.4 214.1 L 816.0 210.7 L 816.5 204.9 L 816.4 202.7 L 817.5 200.4 L 817.3 199.2 L 819.0 196.9 L 821.2 200.3 Z",
  "M 739.3 216.0 L 740.4 215.0 L 745.6 212.1 L 746.3 212.4 L 746.5 212.9 L 746.4 214.0 L 747.3 215.8 L 749.1 216.9 L 749.1 217.4 L 750.1 218.1 L 747.5 219.4 L 745.8 221.7 L 742.8 222.5 L 740.7 220.3 L 740.1 217.8 L 739.3 216.0 Z",
  "M 409.8 354.6 L 408.5 355.6 L 405.3 356.6 L 403.6 354.0 L 402.6 354.2 L 402.9 350.3 L 403.7 346.9 L 404.6 345.0 L 405.7 344.5 L 407.2 345.7 L 408.0 347.4 L 407.8 348.2 L 408.5 349.7 L 408.7 351.2 L 410.1 352.4 L 410.3 353.4 L 409.8 354.6 Z",
  "M 119.5 92.4 L 118.8 90.5 L 117.0 88.1 L 116.3 85.0 L 114.5 82.5 L 114.5 81.2 L 115.8 80.1 L 117.6 79.5 L 119.8 79.3 L 121.3 79.7 L 121.9 80.8 L 122.6 87.6 L 122.4 88.2 L 120.4 90.4 L 120.2 91.9 L 119.5 92.4 Z",
  "M 415.1 300.0 L 415.5 297.5 L 416.8 295.6 L 417.0 293.6 L 417.7 292.7 L 417.8 290.6 L 418.4 288.8 L 419.6 288.8 L 419.3 288.1 L 419.7 287.5 L 421.7 287.9 L 421.9 287.1 L 422.8 287.4 L 423.4 286.3 L 424.0 286.2 L 423.5 287.9 L 422.1 287.8 L 420.3 289.5 L 419.9 292.6 L 418.9 293.1 L 418.0 294.8 L 417.6 297.9 L 418.1 300.0 L 416.8 302.0 L 417.2 302.3 L 417.0 303.4 L 417.5 305.0 L 416.9 305.7 L 416.6 309.0 L 416.2 310.0 L 415.0 311.2 L 414.0 311.1 L 413.8 310.7 L 413.8 309.7 L 414.6 308.4 L 413.7 304.5 L 414.5 301.1 L 415.1 300.0 Z",
  "M 437.9 284.3 L 438.6 283.0 L 437.6 280.2 L 436.2 281.5 L 434.0 279.8 L 432.0 280.5 L 430.6 279.2 L 430.7 277.1 L 433.4 275.1 L 434.2 276.4 L 434.6 278.2 L 435.1 276.3 L 436.3 277.2 L 437.8 276.2 L 437.8 275.8 L 435.7 274.2 L 435.7 273.8 L 436.3 273.7 L 438.5 274.3 L 438.1 276.9 L 439.2 278.7 L 441.6 279.0 L 442.8 278.2 L 442.2 277.0 L 443.1 276.5 L 443.3 275.9 L 445.3 275.4 L 443.0 279.1 L 443.1 280.1 L 442.3 282.4 L 440.0 283.5 L 439.0 284.8 L 438.2 284.8 L 437.9 284.3 Z",
  "M 612.5 274.3 L 613.1 273.3 L 613.8 273.5 L 614.7 274.7 L 614.9 275.9 L 614.7 276.5 L 613.5 276.9 L 612.8 279.1 L 611.5 280.3 L 609.8 279.9 L 609.0 280.1 L 608.2 279.8 L 607.5 279.9 L 607.2 280.2 L 607.4 281.2 L 607.3 281.5 L 606.1 280.6 L 604.6 281.1 L 603.7 281.0 L 601.7 279.4 L 599.7 279.6 L 597.6 278.2 L 596.8 278.2 L 596.1 278.7 L 595.0 278.4 L 594.4 279.0 L 592.0 278.4 L 591.0 277.7 L 586.2 277.4 L 584.2 278.1 L 582.6 277.7 L 580.2 278.1 L 579.0 276.7 L 579.0 276.2 L 579.7 275.9 L 579.6 275.5 L 578.7 275.5 L 578.2 276.5 L 578.6 278.3 L 578.2 278.7 L 577.7 278.7 L 577.2 277.9 L 577.0 278.0 L 576.3 279.4 L 575.2 278.9 L 574.4 279.6 L 573.4 279.8 L 572.1 284.5 L 570.0 286.1 L 568.3 285.9 L 567.4 286.1 L 567.1 287.1 L 567.6 289.5 L 567.1 290.1 L 567.7 291.4 L 565.7 293.6 L 565.6 294.0 L 565.5 296.5 L 566.2 297.1 L 566.2 297.8 L 566.1 300.5 L 566.0 301.0 L 565.7 301.2 L 565.9 302.1 L 565.7 302.3 L 564.9 301.9 L 564.7 299.1 L 563.2 297.9 L 561.5 295.2 L 561.0 293.9 L 559.3 292.4 L 559.4 291.6 L 560.2 290.4 L 559.4 289.3 L 559.8 288.9 L 560.5 289.1 L 562.2 286.0 L 561.5 285.2 L 561.3 283.8 L 561.7 283.3 L 562.6 282.9 L 563.1 283.2 L 563.7 282.9 L 564.6 283.2 L 564.9 282.9 L 565.0 282.7 L 564.2 281.6 L 564.9 280.3 L 565.6 279.4 L 567.4 278.7 L 568.3 278.0 L 568.8 277.0 L 569.7 276.3 L 570.0 275.2 L 570.7 274.2 L 573.7 273.2 L 575.1 273.2 L 576.2 274.1 L 577.5 274.6 L 582.2 273.2 L 585.8 273.8 L 586.7 274.2 L 588.2 276.0 L 590.3 275.5 L 591.5 276.2 L 594.2 276.3 L 595.1 277.3 L 595.6 277.2 L 596.0 276.5 L 599.6 275.8 L 601.7 275.9 L 604.3 276.7 L 605.9 278.7 L 606.3 278.0 L 606.5 276.3 L 606.8 275.7 L 607.2 275.8 L 607.3 276.4 L 607.6 276.3 L 608.6 274.7 L 609.1 274.3 L 610.3 274.7 L 610.9 273.5 L 611.9 273.7 L 612.5 274.3 Z",
  "M 195.2 298.0 L 192.0 296.1 L 191.7 295.3 L 192.1 294.2 L 191.4 292.1 L 189.1 290.3 L 188.9 289.6 L 188.0 288.8 L 186.5 289.6 L 187.7 287.5 L 187.6 287.1 L 187.2 286.9 L 186.8 287.7 L 186.2 287.5 L 185.5 288.0 L 185.3 286.2 L 183.6 285.7 L 183.6 286.9 L 183.4 287.1 L 183.0 285.8 L 182.5 285.2 L 181.8 285.0 L 181.1 285.6 L 180.7 285.2 L 180.2 283.9 L 179.6 284.1 L 179.0 283.3 L 179.0 282.8 L 180.3 282.5 L 182.8 283.9 L 182.8 283.3 L 183.4 283.0 L 183.3 281.9 L 183.5 282.0 L 184.6 283.3 L 187.0 283.6 L 187.0 284.4 L 186.3 284.6 L 185.9 285.8 L 186.4 286.5 L 187.4 285.9 L 188.2 283.4 L 188.6 283.6 L 189.0 284.4 L 188.7 284.8 L 188.6 285.4 L 189.3 285.8 L 189.8 288.7 L 190.5 289.5 L 193.1 294.6 L 195.6 297.7 L 195.2 298.0 Z",
  "M 138.9 29.7 L 138.4 30.4 L 138.6 30.9 L 139.2 31.6 L 139.8 31.9 L 140.5 31.6 L 141.2 32.5 L 141.4 33.4 L 140.9 33.7 L 140.9 34.1 L 138.0 35.9 L 136.5 37.8 L 135.0 38.0 L 134.9 38.4 L 131.3 36.9 L 130.4 37.4 L 130.2 37.8 L 131.6 37.9 L 131.9 38.2 L 130.9 38.7 L 131.0 39.9 L 129.9 40.1 L 129.8 40.6 L 127.7 42.0 L 127.8 42.3 L 128.9 42.3 L 130.7 41.7 L 131.2 42.0 L 132.6 43.6 L 131.9 44.3 L 127.1 46.3 L 123.8 46.5 L 123.3 45.8 L 123.2 45.1 L 124.0 44.6 L 126.2 45.0 L 125.0 43.9 L 123.0 43.6 L 120.8 44.2 L 119.7 43.9 L 118.7 43.4 L 118.9 42.9 L 118.3 42.4 L 117.4 42.4 L 117.3 41.6 L 117.7 40.7 L 117.4 40.1 L 117.6 39.9 L 117.4 37.2 L 117.9 36.6 L 118.2 39.1 L 119.2 39.2 L 119.4 37.7 L 119.7 38.4 L 120.5 38.3 L 122.0 37.1 L 122.2 36.7 L 120.7 35.4 L 120.6 35.2 L 120.8 34.8 L 123.1 36.5 L 124.9 39.5 L 125.6 38.8 L 126.1 38.9 L 126.6 37.7 L 126.9 35.7 L 128.6 35.4 L 129.5 34.2 L 132.1 34.4 L 132.4 33.8 L 131.4 33.4 L 129.9 31.8 L 128.2 30.6 L 123.6 29.5 L 123.4 29.2 L 123.2 26.4 L 122.4 24.8 L 120.0 25.1 L 118.8 23.8 L 117.6 24.1 L 116.5 22.9 L 116.3 22.5 L 118.0 23.4 L 118.6 22.5 L 120.5 23.8 L 121.2 23.5 L 120.6 22.1 L 120.7 20.4 L 121.2 19.6 L 121.0 18.7 L 121.3 17.2 L 121.0 17.0 L 120.4 17.4 L 120.1 18.1 L 119.5 17.9 L 118.7 17.3 L 117.9 15.7 L 116.5 14.4 L 116.8 13.8 L 116.6 11.2 L 117.1 10.9 L 117.1 10.5 L 116.1 7.9 L 115.4 7.4 L 115.0 7.8 L 114.4 7.4 L 113.8 6.5 L 116.5 7.5 L 117.0 8.5 L 117.0 9.0 L 116.8 9.1 L 118.2 10.7 L 118.0 12.4 L 117.3 13.4 L 119.0 15.4 L 120.1 15.7 L 120.6 15.5 L 122.1 16.6 L 122.2 15.8 L 121.8 14.8 L 122.1 14.2 L 122.9 14.6 L 122.9 15.3 L 123.3 15.5 L 124.4 15.1 L 125.4 15.6 L 127.7 15.1 L 125.8 16.8 L 126.1 18.0 L 125.7 18.5 L 125.8 18.9 L 126.9 20.7 L 126.9 21.1 L 130.6 23.3 L 132.9 25.5 L 132.1 25.6 L 130.7 25.0 L 129.1 23.7 L 129.8 23.7 L 129.7 23.4 L 127.9 22.3 L 127.0 22.7 L 126.0 24.8 L 125.3 24.6 L 125.7 23.1 L 124.9 20.7 L 124.2 20.0 L 122.9 20.2 L 122.1 20.9 L 122.0 21.3 L 122.4 21.7 L 122.0 22.4 L 122.9 23.3 L 123.5 24.8 L 124.7 25.2 L 124.8 25.6 L 124.0 26.9 L 124.1 27.6 L 127.0 27.6 L 127.0 27.3 L 127.4 27.1 L 128.2 27.9 L 129.8 28.1 L 130.2 27.2 L 131.0 26.4 L 130.7 25.5 L 131.7 26.1 L 132.7 27.9 L 132.4 28.7 L 131.9 28.8 L 132.3 29.5 L 135.8 28.9 L 137.1 29.0 L 137.3 28.2 L 136.8 27.3 L 136.5 25.4 L 136.8 24.9 L 136.8 24.1 L 136.4 22.9 L 136.6 22.1 L 137.1 22.1 L 137.4 23.2 L 138.0 23.4 L 139.9 25.0 L 140.1 24.9 L 139.6 23.7 L 140.0 22.2 L 140.6 22.0 L 141.3 22.5 L 142.8 24.8 L 141.9 25.5 L 141.3 26.7 L 140.1 26.7 L 139.7 27.4 L 140.1 28.1 L 143.1 29.1 L 143.3 29.6 L 142.6 29.8 L 140.7 29.3 L 139.7 29.4 L 138.9 29.7 Z M 122.8 17.2 L 123.3 18.4 L 125.0 19.8 L 125.4 19.7 L 124.9 16.1 L 123.4 16.2 L 122.9 16.5 L 122.8 17.2 Z M 121.3 42.6 L 120.8 41.5 L 118.8 40.6 L 117.9 41.2 L 120.4 43.3 L 120.9 43.2 L 121.3 42.6 Z M 124.0 39.6 L 123.8 39.2 L 123.0 39.3 L 121.8 38.9 L 121.5 39.8 L 119.7 39.9 L 122.0 41.2 L 123.5 40.5 L 124.0 39.6 Z M 128.6 39.4 L 129.1 38.0 L 129.5 37.7 L 129.3 36.5 L 128.9 36.1 L 127.5 36.0 L 127.0 36.3 L 127.3 38.3 L 126.7 39.0 L 126.8 39.7 L 126.5 40.5 L 126.6 41.3 L 129.1 40.5 L 129.1 40.0 L 128.6 39.4 Z M 138.2 31.1 L 137.0 29.6 L 134.1 29.7 L 131.1 30.4 L 131.0 31.1 L 131.2 31.8 L 132.3 32.3 L 133.4 33.7 L 133.8 34.8 L 135.2 35.2 L 136.4 34.7 L 136.9 33.7 L 137.2 32.1 L 138.5 32.5 L 138.2 31.1 Z",
  "M 664.5 256.7 L 663.9 258.6 L 663.3 259.2 L 662.8 259.0 L 656.9 254.2 L 653.4 252.9 L 651.1 251.0 L 651.3 250.4 L 655.1 250.1 L 655.6 249.5 L 656.0 248.4 L 654.6 246.4 L 654.6 245.6 L 654.9 244.9 L 654.9 242.6 L 655.4 240.7 L 656.5 239.1 L 658.0 237.8 L 660.8 236.7 L 661.6 235.9 L 661.4 234.7 L 659.0 231.8 L 657.2 231.4 L 656.0 230.0 L 655.0 229.3 L 654.4 228.2 L 656.7 228.8 L 658.0 228.4 L 659.4 227.0 L 660.1 226.9 L 660.1 227.3 L 658.7 228.4 L 657.9 230.0 L 663.2 234.7 L 663.9 235.9 L 663.6 236.5 L 656.7 239.9 L 655.8 241.4 L 655.5 242.9 L 656.8 247.4 L 659.7 248.1 L 659.6 248.4 L 657.4 248.8 L 656.6 249.6 L 656.5 250.1 L 661.0 253.0 L 663.7 254.0 L 664.9 254.9 L 665.4 255.5 L 664.5 256.7 Z",
  "M 114.1 18.0 L 115.7 18.3 L 114.9 18.4 L 115.0 18.9 L 113.6 19.0 L 114.6 20.8 L 114.3 21.3 L 114.8 21.9 L 113.8 21.7 L 113.0 22.7 L 113.3 23.8 L 114.1 24.0 L 113.9 24.4 L 112.2 23.8 L 111.8 22.2 L 111.5 22.4 L 111.6 22.9 L 110.8 25.1 L 109.3 25.8 L 109.2 26.6 L 108.8 26.2 L 109.1 25.0 L 110.1 24.9 L 110.1 24.5 L 110.5 23.9 L 110.2 23.1 L 108.9 22.7 L 107.8 22.9 L 107.5 23.4 L 107.5 24.0 L 108.2 25.8 L 107.9 26.3 L 106.9 26.0 L 106.4 26.4 L 106.4 27.2 L 105.7 26.1 L 105.1 25.7 L 104.8 26.0 L 105.2 27.3 L 104.7 28.3 L 104.7 29.4 L 104.0 28.4 L 103.5 29.3 L 103.5 30.5 L 104.0 31.3 L 103.2 31.8 L 103.0 32.2 L 101.8 32.5 L 101.7 33.0 L 102.3 33.5 L 101.5 34.2 L 101.3 35.0 L 101.6 35.3 L 102.5 34.6 L 102.1 36.3 L 102.4 38.0 L 101.2 38.2 L 101.1 39.7 L 101.8 40.2 L 100.8 40.8 L 100.9 42.2 L 101.2 42.7 L 105.0 43.5 L 106.0 44.5 L 106.3 44.2 L 106.2 43.7 L 106.8 42.6 L 107.8 41.6 L 107.5 42.5 L 107.7 43.6 L 106.9 43.3 L 106.6 43.5 L 107.1 44.8 L 107.0 45.2 L 107.5 46.0 L 106.1 48.2 L 105.4 48.2 L 105.9 47.5 L 106.2 46.0 L 105.5 44.9 L 104.8 44.6 L 104.0 44.9 L 102.0 43.2 L 101.6 43.4 L 101.9 44.3 L 100.7 45.7 L 101.4 46.7 L 101.3 47.2 L 100.9 47.2 L 100.2 46.2 L 99.5 46.6 L 99.0 46.4 L 100.0 45.1 L 100.4 43.9 L 100.1 43.1 L 99.5 43.6 L 99.0 42.6 L 98.2 42.0 L 97.5 40.0 L 97.4 39.1 L 98.2 38.5 L 99.4 38.3 L 99.6 37.6 L 99.5 36.9 L 97.8 35.5 L 97.6 35.0 L 98.6 35.2 L 99.3 35.0 L 99.9 34.1 L 98.6 33.6 L 98.7 33.2 L 100.5 32.8 L 100.8 31.8 L 101.6 31.6 L 102.1 30.7 L 101.2 30.1 L 100.4 29.9 L 100.1 29.4 L 102.0 29.5 L 102.5 29.1 L 102.7 28.2 L 104.1 27.0 L 104.5 25.5 L 104.2 24.7 L 103.7 24.8 L 102.9 23.2 L 102.2 23.0 L 101.7 21.7 L 103.1 21.3 L 103.2 20.5 L 103.5 20.1 L 104.2 20.2 L 104.1 19.6 L 103.5 19.0 L 103.8 18.5 L 103.9 17.8 L 104.6 17.2 L 103.6 15.5 L 101.5 14.6 L 100.8 15.3 L 100.6 16.3 L 99.8 16.2 L 99.1 15.7 L 99.9 14.9 L 99.8 13.7 L 101.6 12.3 L 101.6 12.9 L 102.1 13.6 L 103.2 14.3 L 103.6 13.7 L 104.3 14.0 L 106.0 15.9 L 105.3 15.9 L 105.3 16.2 L 108.7 19.5 L 108.8 20.1 L 108.1 20.1 L 106.2 18.5 L 105.8 18.6 L 105.3 20.4 L 105.0 20.4 L 105.5 21.6 L 104.4 21.4 L 103.5 21.9 L 103.6 23.2 L 104.6 24.3 L 105.4 24.1 L 105.7 23.4 L 106.1 23.4 L 106.2 23.9 L 105.9 24.5 L 106.0 25.0 L 106.7 25.5 L 107.0 24.3 L 106.9 22.9 L 108.5 22.0 L 108.6 21.6 L 109.5 21.6 L 109.7 20.5 L 108.6 18.5 L 108.6 18.1 L 110.6 20.4 L 112.7 22.0 L 113.0 21.8 L 113.1 20.6 L 110.6 17.4 L 112.2 18.4 L 112.3 17.9 L 112.0 16.9 L 112.2 16.4 L 114.7 15.3 L 115.1 15.5 L 114.6 15.8 L 114.1 16.7 L 114.3 17.1 L 113.8 17.1 L 113.7 17.4 L 114.1 18.0 Z",
  "M 319.5 156.3 L 319.8 149.4 L 321.1 148.6 L 322.9 148.2 L 323.6 147.3 L 324.1 145.1 L 324.0 142.8 L 326.9 140.4 L 327.0 138.4 L 325.8 136.0 L 326.0 135.3 L 326.5 135.5 L 327.6 137.6 L 328.3 137.9 L 328.8 137.6 L 328.5 137.0 L 328.5 134.8 L 328.9 134.4 L 328.9 135.6 L 329.7 136.6 L 332.9 136.9 L 335.0 136.4 L 335.8 135.7 L 338.6 136.2 L 339.6 135.7 L 341.4 135.9 L 347.0 134.7 L 348.5 135.2 L 349.0 134.9 L 349.0 133.6 L 348.3 132.1 L 348.5 130.7 L 349.1 129.8 L 348.9 131.9 L 349.5 133.0 L 350.6 132.7 L 351.8 131.6 L 353.5 131.9 L 353.0 132.4 L 351.7 132.3 L 351.4 133.6 L 349.8 134.1 L 349.6 135.0 L 348.5 136.0 L 346.5 135.2 L 346.2 135.6 L 346.6 136.7 L 346.3 137.3 L 345.2 136.4 L 343.4 135.8 L 342.0 136.5 L 333.9 138.4 L 332.0 140.0 L 329.8 141.2 L 329.7 142.2 L 329.2 142.8 L 327.5 142.7 L 325.5 143.5 L 324.8 144.6 L 325.1 145.8 L 326.3 146.2 L 325.3 147.4 L 325.1 148.7 L 324.4 149.7 L 324.5 150.2 L 324.1 151.0 L 324.1 151.6 L 321.9 152.0 L 320.9 152.7 L 320.6 153.6 L 321.1 155.1 L 322.1 156.2 L 323.5 156.8 L 323.9 158.2 L 325.6 158.7 L 328.0 157.8 L 332.4 155.3 L 332.5 155.9 L 330.5 156.9 L 329.6 158.3 L 327.5 160.0 L 327.5 160.9 L 328.7 162.6 L 328.9 163.8 L 326.6 161.7 L 326.3 162.2 L 326.0 165.2 L 326.2 166.3 L 327.8 166.9 L 333.8 167.1 L 334.1 167.6 L 333.5 168.1 L 330.1 167.9 L 328.4 168.4 L 327.9 169.2 L 327.6 170.3 L 323.5 170.4 L 323.1 169.7 L 326.7 169.9 L 327.4 169.5 L 327.4 169.0 L 325.3 167.8 L 325.5 167.5 L 324.1 164.5 L 324.5 161.7 L 323.6 159.9 L 321.2 157.4 L 319.5 156.3 Z",
  "M 849.3 165.3 L 849.5 167.0 L 849.3 167.1 L 848.2 166.1 L 847.0 165.9 L 846.6 166.6 L 846.4 167.3 L 846.6 171.3 L 845.9 173.1 L 845.6 171.2 L 845.6 165.7 L 845.0 164.1 L 841.1 162.3 L 841.7 161.8 L 843.5 162.5 L 844.4 162.0 L 842.4 157.9 L 842.2 156.5 L 842.5 154.4 L 843.4 152.3 L 844.0 152.2 L 844.4 151.2 L 844.1 149.0 L 842.7 146.5 L 843.0 144.3 L 844.5 142.3 L 845.1 140.5 L 845.0 138.2 L 844.1 135.3 L 843.7 132.1 L 843.1 130.5 L 842.3 129.4 L 841.6 126.1 L 839.6 124.8 L 837.9 124.6 L 837.0 125.7 L 835.0 125.5 L 834.5 126.0 L 832.6 126.7 L 832.8 127.7 L 832.6 128.7 L 831.9 129.8 L 831.9 130.6 L 832.7 131.4 L 833.6 131.6 L 833.7 132.0 L 833.3 132.5 L 833.8 133.0 L 836.0 133.6 L 836.5 134.4 L 835.8 136.6 L 836.1 137.9 L 836.9 138.5 L 836.1 139.3 L 835.0 141.4 L 833.9 142.2 L 835.9 138.7 L 835.3 136.5 L 835.7 135.1 L 835.7 134.6 L 833.5 135.8 L 830.8 136.4 L 830.5 135.6 L 832.6 134.7 L 832.5 134.1 L 830.9 132.6 L 830.7 130.7 L 830.3 130.2 L 826.3 128.0 L 825.8 127.4 L 830.0 127.5 L 830.2 126.0 L 829.6 125.0 L 830.0 124.3 L 830.0 122.9 L 830.6 122.6 L 830.9 122.5 L 831.5 123.4 L 832.4 123.5 L 832.0 124.5 L 832.3 125.1 L 835.2 123.5 L 835.3 123.1 L 837.2 123.1 L 837.3 122.2 L 837.8 121.6 L 838.4 121.8 L 838.8 123.1 L 840.4 122.9 L 841.1 123.9 L 842.6 123.7 L 842.5 126.4 L 843.0 128.4 L 844.7 131.7 L 844.5 134.1 L 845.6 137.3 L 845.8 139.5 L 845.3 142.7 L 844.1 145.0 L 843.8 146.2 L 845.0 149.7 L 845.1 151.3 L 845.7 153.8 L 846.8 156.4 L 846.2 156.2 L 845.4 154.1 L 844.9 153.5 L 843.7 155.1 L 843.3 156.6 L 843.9 158.9 L 845.2 160.9 L 845.5 162.5 L 846.5 164.0 L 847.5 164.7 L 849.3 165.3 Z",
  "M 919.4 23.0 L 920.8 20.4 L 920.5 19.9 L 920.5 19.1 L 920.3 18.2 L 917.4 17.2 L 915.6 16.0 L 913.5 15.9 L 913.5 15.0 L 914.1 14.2 L 914.0 13.6 L 910.4 13.0 L 909.7 12.5 L 912.2 12.3 L 913.0 11.9 L 913.1 10.2 L 910.9 8.8 L 909.4 8.9 L 907.9 9.7 L 905.4 8.5 L 908.4 8.5 L 910.3 5.8 L 910.7 5.9 L 910.8 6.2 L 910.4 6.6 L 910.6 7.2 L 911.7 8.0 L 914.0 8.5 L 915.2 9.6 L 913.9 11.8 L 914.6 12.6 L 915.8 12.6 L 916.5 12.0 L 918.2 12.9 L 918.4 13.2 L 917.8 13.8 L 916.3 14.3 L 916.3 14.8 L 918.4 15.8 L 919.8 14.3 L 919.3 10.8 L 919.9 9.2 L 920.3 9.0 L 920.6 10.1 L 920.3 12.3 L 920.5 13.0 L 921.6 13.9 L 923.5 13.7 L 924.3 13.1 L 924.5 12.3 L 924.1 11.2 L 925.6 11.2 L 927.6 12.3 L 928.4 14.2 L 926.9 15.7 L 926.9 16.4 L 928.5 17.3 L 929.7 17.1 L 930.0 16.2 L 929.6 15.5 L 929.7 13.7 L 929.0 10.8 L 926.8 9.7 L 927.7 9.2 L 929.3 9.3 L 929.7 8.9 L 930.2 9.0 L 929.8 9.7 L 929.9 11.8 L 930.8 13.8 L 932.7 14.6 L 933.1 15.4 L 932.3 15.8 L 932.0 18.3 L 930.2 19.5 L 927.0 17.8 L 925.9 18.2 L 925.6 17.9 L 924.5 18.0 L 923.6 17.8 L 922.8 17.1 L 922.8 16.7 L 925.0 16.2 L 925.2 15.1 L 926.4 14.6 L 927.0 13.8 L 927.0 13.2 L 926.5 12.6 L 925.7 12.8 L 925.1 13.5 L 924.6 14.5 L 923.9 15.0 L 920.9 15.7 L 920.8 16.7 L 922.2 18.2 L 923.0 21.3 L 922.0 22.9 L 922.4 24.2 L 921.8 24.4 L 921.7 24.8 L 922.1 25.3 L 924.7 25.5 L 925.3 26.4 L 925.3 26.7 L 923.8 26.1 L 922.7 26.5 L 922.5 27.2 L 924.7 28.3 L 924.2 28.7 L 922.3 28.1 L 921.7 28.6 L 921.8 29.6 L 922.8 30.8 L 921.3 31.8 L 919.4 31.8 L 913.4 30.2 L 912.3 29.5 L 910.9 29.7 L 909.5 30.4 L 906.2 33.1 L 905.6 35.1 L 905.2 34.9 L 905.1 33.3 L 905.9 31.6 L 905.8 30.8 L 906.6 31.1 L 907.6 30.8 L 910.8 28.4 L 913.5 28.6 L 915.2 29.6 L 919.8 30.9 L 920.4 29.9 L 920.1 28.2 L 920.9 27.6 L 921.3 26.8 L 920.9 24.8 L 920.2 24.0 L 919.1 23.6 L 917.7 24.2 L 916.9 23.3 L 919.4 23.0 Z"
];

// Bare land silhouette (the water polygon's complement within the map's
// bounding box), painted first so unclaimed/unknown territory still reads
// as land rather than page background.
const LAND_PATH = "M 1000.0 0.0 L 1000.0 372.0 L 361.9 372.0 L 362.2 370.7 L 363.1 365.1 L 364.3 367.5 L 365.1 368.5 L 366.9 369.2 L 367.7 369.0 L 368.7 368.4 L 369.6 368.6 L 371.0 371.0 L 372.0 371.3 L 375.1 370.2 L 376.0 370.6 L 376.9 370.6 L 376.5 369.5 L 376.3 368.4 L 376.8 367.8 L 378.5 368.4 L 379.5 368.0 L 380.1 367.5 L 380.1 365.5 L 379.7 363.8 L 378.9 362.6 L 376.0 359.9 L 375.0 358.9 L 374.2 357.5 L 371.8 348.4 L 370.9 347.8 L 369.7 347.7 L 366.4 348.5 L 365.3 348.3 L 363.4 350.2 L 362.8 351.5 L 361.9 354.4 L 362.6 355.3 L 362.1 360.3 L 362.4 362.4 L 362.3 362.5 L 361.3 359.9 L 359.9 357.3 L 358.8 353.3 L 358.6 351.6 L 358.5 348.2 L 360.0 343.0 L 360.2 341.0 L 359.8 337.7 L 359.4 337.0 L 358.8 336.8 L 357.2 336.8 L 356.7 337.1 L 355.9 336.0 L 354.8 335.8 L 353.7 336.3 L 353.1 336.0 L 352.6 335.3 L 351.2 332.3 L 350.4 331.4 L 347.4 331.1 L 347.5 328.3 L 347.4 326.2 L 346.8 324.7 L 345.9 323.6 L 345.2 322.0 L 344.0 318.7 L 342.9 314.9 L 342.5 314.4 L 341.5 313.8 L 338.1 312.8 L 337.6 312.4 L 337.4 311.5 L 337.5 309.6 L 337.8 308.8 L 338.9 308.1 L 343.2 308.0 L 345.0 309.6 L 346.2 310.0 L 348.1 309.4 L 349.7 309.6 L 349.3 308.8 L 348.7 308.4 L 348.0 308.5 L 347.5 308.2 L 346.6 306.7 L 345.1 305.1 L 344.7 304.4 L 344.6 303.3 L 344.9 302.4 L 346.0 301.5 L 346.9 300.2 L 347.4 298.4 L 348.5 296.4 L 349.7 296.6 L 351.6 295.7 L 354.6 295.9 L 358.2 295.7 L 359.2 295.8 L 362.8 297.0 L 364.4 297.2 L 365.6 296.8 L 364.5 295.6 L 362.1 294.2 L 361.5 293.0 L 362.6 289.7 L 364.1 286.7 L 365.0 283.1 L 364.7 279.6 L 364.3 278.6 L 364.4 277.5 L 365.3 275.5 L 364.3 272.6 L 364.0 272.0 L 362.9 271.0 L 360.6 271.0 L 358.7 270.4 L 358.1 270.9 L 357.4 272.0 L 355.4 273.0 L 354.9 272.8 L 354.2 271.8 L 353.6 272.0 L 351.7 271.3 L 350.8 270.0 L 350.4 269.8 L 346.2 268.5 L 343.8 269.6 L 340.5 272.2 L 339.0 272.2 L 337.9 273.5 L 335.0 276.1 L 333.9 276.7 L 328.7 277.9 L 328.9 279.7 L 328.1 279.2 L 327.4 280.1 L 327.7 281.6 L 326.6 281.7 L 326.4 282.6 L 326.2 283.2 L 323.6 284.6 L 322.4 284.8 L 322.6 286.6 L 323.0 287.5 L 322.8 287.8 L 322.4 288.0 L 321.5 287.2 L 320.5 287.2 L 318.3 289.7 L 317.3 290.4 L 314.2 291.6 L 313.0 291.2 L 312.5 291.7 L 312.3 292.8 L 311.1 291.4 L 310.7 291.3 L 311.3 292.5 L 311.3 293.7 L 311.2 294.3 L 310.9 294.9 L 310.2 295.4 L 310.0 297.4 L 309.6 298.6 L 308.4 301.7 L 307.3 303.6 L 307.0 305.0 L 306.3 304.1 L 305.8 305.6 L 303.9 307.6 L 303.5 309.1 L 303.4 310.0 L 303.6 310.8 L 303.9 311.3 L 305.4 311.8 L 306.5 312.5 L 308.4 314.9 L 309.2 316.4 L 309.7 318.1 L 310.4 321.5 L 310.7 325.1 L 311.6 320.6 L 312.4 319.8 L 311.1 325.8 L 310.9 327.8 L 311.2 330.4 L 310.7 333.4 L 311.3 334.4 L 312.3 335.4 L 313.0 336.9 L 313.2 339.0 L 314.1 340.1 L 316.6 344.2 L 318.0 346.9 L 319.5 350.6 L 322.2 353.2 L 323.7 355.7 L 326.4 360.9 L 327.1 363.9 L 327.6 365.3 L 329.8 368.9 L 332.3 372.0 L 133.1 372.0 L 133.5 371.6 L 134.4 371.3 L 142.0 369.9 L 142.1 369.5 L 137.4 368.8 L 136.4 368.2 L 135.0 366.7 L 134.4 365.6 L 134.8 362.9 L 135.3 362.2 L 137.0 362.1 L 142.7 363.3 L 146.8 362.6 L 151.2 364.4 L 155.5 364.0 L 156.4 363.2 L 157.5 360.6 L 163.5 356.4 L 165.6 354.1 L 167.8 352.9 L 171.7 351.5 L 174.9 349.7 L 175.9 349.5 L 183.6 350.4 L 189.0 350.5 L 191.4 348.8 L 192.8 349.4 L 192.5 350.5 L 192.5 351.6 L 193.4 353.1 L 194.2 354.1 L 196.7 355.6 L 200.2 354.4 L 201.4 354.9 L 202.7 358.9 L 203.6 360.4 L 204.8 361.4 L 205.8 361.6 L 206.6 360.5 L 207.1 360.1 L 208.4 359.9 L 210.4 361.3 L 211.1 362.8 L 214.6 363.9 L 217.8 364.5 L 219.2 365.7 L 223.7 366.9 L 225.4 366.7 L 228.2 365.4 L 233.7 364.0 L 237.4 366.0 L 238.4 366.3 L 239.2 366.1 L 240.5 366.6 L 241.8 366.3 L 245.8 364.0 L 247.1 362.7 L 248.4 362.4 L 249.6 361.6 L 252.8 359.0 L 255.5 354.5 L 256.1 352.7 L 256.1 350.3 L 255.2 347.5 L 253.5 339.3 L 252.8 338.1 L 250.0 336.6 L 249.4 335.0 L 247.2 332.9 L 244.2 332.0 L 243.7 331.6 L 241.1 328.9 L 238.0 326.4 L 234.6 322.3 L 232.8 319.6 L 226.9 313.4 L 226.2 312.9 L 223.1 312.0 L 221.8 311.3 L 218.7 306.9 L 217.3 307.5 L 216.0 307.3 L 215.2 306.9 L 214.4 306.3 L 213.9 305.5 L 213.2 303.6 L 212.5 302.5 L 210.0 301.0 L 207.2 300.1 L 206.9 299.7 L 206.9 299.1 L 209.3 298.1 L 209.9 297.5 L 207.8 296.2 L 209.2 295.3 L 210.3 296.0 L 211.5 297.3 L 212.6 297.8 L 213.0 297.2 L 216.7 296.1 L 217.0 295.3 L 216.9 294.3 L 216.3 294.2 L 216.4 293.1 L 216.9 291.7 L 218.6 289.4 L 219.4 286.2 L 220.2 285.4 L 220.8 285.9 L 220.8 287.2 L 221.8 284.7 L 223.9 284.9 L 224.8 284.8 L 223.1 282.3 L 220.8 279.9 L 219.9 280.1 L 219.3 279.7 L 218.3 277.7 L 217.8 276.1 L 219.8 276.4 L 221.6 275.2 L 222.3 275.0 L 224.9 275.6 L 224.8 274.5 L 224.3 273.3 L 226.1 272.3 L 227.8 271.8 L 230.9 269.9 L 232.2 269.6 L 232.5 268.6 L 231.5 266.0 L 229.9 266.0 L 229.0 267.5 L 226.5 268.0 L 225.4 267.9 L 226.3 266.9 L 227.1 266.5 L 227.4 266.1 L 225.6 266.5 L 224.7 267.5 L 221.8 269.0 L 218.4 268.8 L 215.7 269.1 L 213.8 271.6 L 212.6 271.6 L 211.0 272.3 L 209.9 273.1 L 208.5 274.8 L 207.5 274.0 L 206.3 274.1 L 205.1 274.5 L 203.6 275.7 L 202.8 275.9 L 201.2 275.6 L 199.3 276.3 L 195.2 280.1 L 193.8 282.9 L 193.3 283.5 L 192.6 284.2 L 191.5 284.5 L 194.0 281.7 L 194.2 280.3 L 193.6 279.2 L 192.0 281.9 L 189.9 283.2 L 189.9 285.0 L 190.0 286.4 L 190.5 288.1 L 191.6 290.9 L 193.9 295.0 L 194.9 296.5 L 195.7 297.1 L 196.7 297.2 L 198.6 295.9 L 199.3 295.7 L 201.1 296.2 L 201.7 295.4 L 202.6 294.9 L 203.7 294.8 L 206.4 295.8 L 205.3 298.4 L 204.7 301.1 L 203.1 301.7 L 201.5 301.6 L 199.7 302.0 L 197.8 300.5 L 196.8 300.2 L 195.9 300.5 L 194.8 302.4 L 192.8 303.7 L 192.2 305.2 L 190.3 304.9 L 188.7 305.2 L 186.3 306.5 L 184.5 309.4 L 182.5 311.3 L 180.9 311.8 L 179.4 311.7 L 178.5 311.1 L 176.5 309.2 L 176.6 308.5 L 177.3 307.2 L 178.1 303.6 L 178.0 302.4 L 177.5 300.5 L 176.0 299.1 L 174.7 299.4 L 174.0 299.0 L 171.4 296.6 L 170.0 296.4 L 168.5 296.9 L 167.9 296.5 L 167.5 295.7 L 170.6 292.7 L 173.6 290.2 L 174.9 289.9 L 176.7 288.8 L 178.6 287.0 L 178.3 285.7 L 177.9 284.7 L 176.3 285.3 L 174.7 284.2 L 174.2 283.4 L 171.7 284.2 L 170.3 284.1 L 167.2 284.9 L 165.8 284.1 L 163.0 282.0 L 161.9 281.6 L 161.0 281.7 L 160.5 281.0 L 162.6 280.4 L 162.8 280.0 L 162.7 279.4 L 161.3 278.8 L 159.9 278.7 L 158.4 277.4 L 159.9 277.4 L 161.5 277.9 L 163.9 278.1 L 166.1 278.6 L 168.2 276.4 L 166.0 277.2 L 163.9 276.7 L 163.1 276.0 L 162.4 274.9 L 162.1 273.7 L 162.3 272.6 L 162.1 270.6 L 161.1 267.8 L 160.3 266.9 L 161.8 271.5 L 161.7 274.7 L 161.4 275.9 L 160.5 276.1 L 158.2 275.6 L 158.5 273.8 L 157.8 274.4 L 156.9 276.2 L 156.1 276.4 L 154.4 276.3 L 151.1 277.4 L 150.4 280.4 L 149.8 282.0 L 148.4 284.5 L 145.6 288.3 L 141.8 290.5 L 140.5 290.1 L 139.9 290.6 L 139.7 291.2 L 139.7 292.6 L 140.3 293.5 L 140.9 296.6 L 140.0 302.4 L 139.3 304.6 L 134.4 306.0 L 134.7 305.3 L 134.4 303.3 L 134.8 302.5 L 133.7 302.2 L 133.3 302.6 L 132.9 303.4 L 133.2 305.1 L 132.5 306.6 L 132.5 307.9 L 132.1 308.4 L 132.1 309.0 L 132.9 308.9 L 132.5 310.0 L 131.0 312.1 L 130.5 313.3 L 130.7 318.3 L 130.0 321.2 L 129.7 325.9 L 128.8 327.7 L 127.4 327.1 L 125.6 327.6 L 124.7 329.6 L 123.7 331.0 L 123.4 333.6 L 123.3 337.9 L 122.6 338.4 L 122.0 338.6 L 119.4 342.4 L 120.9 343.4 L 121.6 344.3 L 122.6 346.5 L 124.2 349.1 L 124.5 350.3 L 124.2 352.1 L 124.8 354.1 L 126.2 356.9 L 127.7 358.3 L 133.4 361.8 L 134.5 362.1 L 133.9 364.8 L 133.5 365.6 L 131.8 366.1 L 127.2 364.6 L 126.0 364.4 L 125.2 364.8 L 123.6 365.9 L 121.9 365.5 L 119.6 366.2 L 118.9 368.3 L 117.2 370.7 L 115.4 372.0 L 112.6 372.0 L 112.8 371.7 L 108.7 372.0 L 106.2 371.9 L 105.3 369.4 L 103.8 368.2 L 100.4 367.5 L 98.7 366.6 L 98.0 366.8 L 96.6 365.8 L 95.7 366.2 L 93.6 368.0 L 92.6 367.8 L 91.4 366.8 L 90.6 366.6 L 89.7 367.1 L 88.3 369.1 L 86.8 370.1 L 85.5 369.7 L 83.8 369.7 L 83.6 370.9 L 84.2 372.0 L 41.6 372.0 L 41.4 371.1 L 41.9 369.1 L 42.6 366.8 L 42.6 364.0 L 42.8 362.0 L 42.4 359.0 L 42.9 356.8 L 43.7 355.5 L 43.7 353.2 L 42.7 352.1 L 41.5 351.9 L 40.0 350.6 L 39.4 348.9 L 37.2 345.9 L 34.7 343.8 L 34.5 343.5 L 34.8 342.8 L 33.6 342.9 L 30.2 339.7 L 26.9 337.1 L 24.6 336.5 L 21.5 334.4 L 19.5 333.7 L 21.1 333.5 L 26.0 336.3 L 25.4 335.5 L 24.2 334.5 L 22.2 332.1 L 20.3 330.6 L 18.1 327.7 L 15.2 326.5 L 13.2 325.3 L 10.7 325.9 L 9.3 325.6 L 8.9 324.9 L 8.9 323.5 L 4.7 319.5 L 1.7 315.3 L 1.1 313.9 L 2.6 313.4 L 4.4 313.7 L 2.5 311.9 L 0.0 308.8 L 0.0 157.6 L 8.5 154.9 L 11.3 154.3 L 13.1 152.0 L 14.8 150.1 L 17.9 149.4 L 19.1 148.6 L 21.5 147.3 L 27.1 145.9 L 29.4 145.6 L 31.7 145.6 L 35.9 148.0 L 36.3 148.9 L 35.1 148.3 L 33.4 147.1 L 32.8 147.1 L 34.2 150.8 L 35.0 152.1 L 36.6 153.1 L 38.0 153.4 L 42.1 152.8 L 43.5 152.0 L 45.4 150.3 L 46.4 148.8 L 47.2 147.0 L 47.5 144.3 L 48.8 143.7 L 51.6 143.8 L 52.7 143.1 L 54.3 141.4 L 55.9 139.3 L 57.5 136.6 L 57.9 135.4 L 58.2 133.7 L 58.4 133.2 L 58.3 135.3 L 57.6 137.4 L 56.0 140.1 L 53.5 143.3 L 56.3 144.5 L 57.3 144.6 L 59.1 144.1 L 59.6 138.7 L 59.3 137.6 L 59.6 135.8 L 59.0 133.2 L 57.9 130.1 L 57.8 126.7 L 57.5 123.0 L 57.6 117.0 L 58.0 114.0 L 59.8 112.3 L 60.7 110.9 L 61.2 109.1 L 61.4 107.5 L 61.7 106.1 L 64.3 102.1 L 66.4 101.7 L 72.2 99.7 L 73.1 101.7 L 76.8 105.0 L 77.8 106.1 L 79.2 109.8 L 82.7 111.7 L 85.4 111.1 L 88.7 108.5 L 89.7 107.2 L 89.9 106.0 L 89.5 100.9 L 88.9 98.7 L 89.2 96.7 L 90.5 93.6 L 90.7 91.1 L 91.3 90.5 L 91.1 89.7 L 89.8 89.2 L 89.3 89.2 L 88.3 90.7 L 87.2 91.1 L 86.2 90.4 L 83.8 89.6 L 83.2 88.4 L 83.1 87.3 L 81.9 86.1 L 81.4 84.8 L 81.6 83.9 L 82.7 83.3 L 83.0 82.8 L 81.3 82.7 L 80.6 80.7 L 81.2 80.0 L 81.4 79.4 L 81.0 78.9 L 81.1 78.3 L 81.4 77.7 L 81.2 76.3 L 84.0 75.0 L 86.9 74.7 L 86.6 73.5 L 87.7 73.4 L 89.7 71.9 L 91.6 72.1 L 94.5 71.1 L 99.9 71.1 L 100.6 70.5 L 100.5 69.2 L 103.2 69.3 L 109.6 70.6 L 111.2 70.6 L 113.4 71.9 L 114.5 72.2 L 118.0 72.2 L 123.3 72.8 L 124.4 71.9 L 125.0 70.6 L 124.5 67.9 L 124.9 67.0 L 125.6 66.9 L 126.4 67.9 L 127.6 68.4 L 128.4 67.7 L 128.7 66.4 L 129.3 65.9 L 130.1 66.4 L 131.5 66.6 L 133.4 66.2 L 134.7 64.1 L 135.3 63.5 L 140.3 64.2 L 144.7 65.5 L 145.0 65.0 L 145.1 64.2 L 143.3 63.1 L 142.3 61.6 L 140.8 60.4 L 139.4 60.3 L 137.5 60.7 L 134.6 60.4 L 132.1 58.2 L 130.5 57.5 L 129.3 55.8 L 129.1 54.9 L 130.3 55.7 L 130.6 53.8 L 129.3 52.7 L 126.1 54.4 L 122.1 55.0 L 121.2 55.5 L 119.8 55.7 L 119.2 56.1 L 116.7 54.8 L 115.5 55.1 L 114.3 56.0 L 112.1 56.2 L 110.3 56.9 L 110.2 56.0 L 110.5 54.8 L 111.0 54.0 L 111.0 53.5 L 110.7 53.5 L 109.9 54.7 L 109.6 56.1 L 108.8 56.7 L 107.2 57.0 L 105.5 55.9 L 104.8 55.9 L 105.6 57.6 L 105.5 58.1 L 104.7 58.0 L 102.9 59.2 L 102.5 59.2 L 101.9 58.2 L 100.0 59.3 L 98.2 59.5 L 97.1 60.4 L 91.8 61.7 L 91.0 62.7 L 90.3 63.1 L 89.3 62.8 L 83.4 64.0 L 80.9 63.7 L 78.2 66.0 L 76.7 66.4 L 76.1 66.2 L 76.6 65.6 L 77.6 64.9 L 78.3 63.9 L 78.4 63.1 L 77.2 62.7 L 76.4 61.9 L 75.6 60.1 L 75.2 60.1 L 74.7 61.9 L 74.1 62.6 L 73.1 63.0 L 71.3 63.0 L 71.1 62.0 L 71.4 61.1 L 71.1 61.0 L 71.4 60.3 L 72.3 60.2 L 72.6 59.9 L 72.5 59.4 L 71.9 59.3 L 71.8 59.0 L 72.5 57.4 L 69.4 57.1 L 66.3 55.5 L 65.5 55.4 L 65.0 54.0 L 64.3 54.2 L 63.2 55.0 L 61.5 54.0 L 61.3 53.4 L 61.2 51.3 L 60.8 48.1 L 61.0 46.6 L 61.9 44.9 L 62.2 43.1 L 62.3 41.0 L 62.1 40.3 L 62.2 39.9 L 62.7 39.9 L 62.1 38.8 L 62.3 38.6 L 63.0 38.5 L 63.1 38.2 L 62.6 37.0 L 62.6 36.4 L 61.0 33.0 L 59.8 31.8 L 60.7 28.1 L 60.4 26.2 L 58.9 25.1 L 58.3 21.8 L 58.7 19.9 L 59.2 19.1 L 61.7 16.6 L 61.9 15.2 L 63.6 15.1 L 62.8 14.0 L 62.6 12.5 L 65.0 12.0 L 65.9 12.4 L 68.1 11.9 L 70.0 10.8 L 69.9 10.3 L 69.2 8.8 L 69.5 8.5 L 70.2 8.7 L 69.9 8.2 L 70.0 7.7 L 70.7 7.9 L 72.0 6.5 L 72.0 5.5 L 74.1 4.9 L 76.6 2.7 L 78.9 1.5 L 80.5 0.0 L 205.1 0.0 L 210.3 1.3 L 214.1 2.8 L 214.7 2.8 L 216.6 1.5 L 219.8 0.7 L 220.3 0.0 L 1000.0 0.0 Z M 0.0 0.0 L 56.0 0.0 L 55.1 2.0 L 54.2 2.6 L 52.1 3.5 L 51.3 4.3 L 49.7 5.2 L 46.9 6.0 L 45.7 7.2 L 45.1 8.4 L 44.5 8.5 L 43.0 7.7 L 42.9 9.0 L 41.6 8.2 L 40.9 8.9 L 40.4 10.2 L 38.5 12.0 L 36.4 11.7 L 36.2 12.0 L 36.8 12.2 L 36.8 12.5 L 34.4 12.9 L 33.7 14.8 L 31.9 15.3 L 31.6 15.8 L 33.4 15.9 L 33.0 17.4 L 31.0 18.2 L 30.2 19.1 L 29.3 19.1 L 29.5 18.4 L 28.1 18.4 L 27.7 17.6 L 27.5 17.8 L 27.6 18.5 L 28.4 20.2 L 27.7 21.2 L 28.7 21.7 L 29.0 22.1 L 28.1 22.5 L 27.0 23.7 L 25.9 23.7 L 25.2 24.5 L 24.5 24.5 L 23.0 23.6 L 22.7 24.3 L 22.6 24.9 L 23.1 26.3 L 24.2 27.5 L 25.1 28.0 L 24.4 28.3 L 23.9 29.0 L 22.6 33.8 L 23.0 35.8 L 23.5 36.7 L 22.2 36.6 L 20.9 36.1 L 21.1 37.1 L 20.3 38.4 L 20.6 40.3 L 20.4 41.5 L 20.7 41.9 L 21.0 42.6 L 20.6 43.2 L 20.8 43.6 L 21.1 47.8 L 21.0 48.3 L 21.7 50.6 L 21.4 52.3 L 22.5 53.3 L 24.4 53.3 L 24.7 53.5 L 25.4 55.0 L 26.1 54.9 L 28.2 54.1 L 28.7 55.3 L 30.2 57.0 L 31.0 57.7 L 32.4 58.1 L 34.0 59.5 L 33.7 61.1 L 34.4 61.6 L 36.1 62.2 L 37.5 64.4 L 38.1 66.2 L 37.9 67.3 L 35.5 68.9 L 34.1 70.4 L 31.9 71.8 L 31.3 72.4 L 30.7 72.7 L 30.2 72.5 L 28.3 73.7 L 28.4 74.2 L 29.9 74.4 L 30.6 74.1 L 31.2 73.6 L 32.4 73.5 L 33.5 72.9 L 34.0 73.1 L 34.5 74.2 L 33.4 74.7 L 32.6 74.8 L 32.2 76.5 L 31.3 77.7 L 29.6 78.4 L 27.0 80.1 L 26.4 79.9 L 25.5 80.7 L 23.4 81.6 L 22.4 82.9 L 20.0 84.0 L 18.8 84.9 L 12.5 84.7 L 11.5 85.2 L 12.5 85.3 L 13.2 85.7 L 14.0 85.5 L 17.0 86.0 L 18.3 87.5 L 17.4 88.0 L 15.7 88.4 L 16.8 91.9 L 16.2 92.7 L 16.1 96.6 L 15.2 96.7 L 14.8 98.3 L 15.1 99.1 L 15.1 101.0 L 15.3 102.2 L 15.7 103.2 L 15.5 104.4 L 14.0 107.0 L 14.1 108.2 L 14.5 110.1 L 13.4 114.3 L 12.8 115.8 L 11.5 117.7 L 10.9 119.1 L 9.4 123.6 L 7.8 125.1 L 5.9 124.2 L 4.8 124.2 L 3.0 124.7 L 0.0 124.4 L 0.0 0.0 Z M 0.0 139.9 L 1.2 140.7 L 1.2 141.6 L 0.7 142.7 L 0.4 142.9 L 0.0 142.8 L 0.0 139.9 Z M 0.0 309.6 L 1.0 311.1 L 2.2 312.4 L 1.7 312.7 L 1.5 313.1 L 0.3 311.8 L 0.0 311.3 L 0.0 309.6 Z M 0.0 316.9 L 1.7 319.2 L 1.8 319.6 L 1.2 319.5 L 0.0 317.7 L 0.0 316.9 Z M 0.0 372.0 L 0.0 349.9 L 1.5 350.9 L 3.8 351.2 L 9.1 350.8 L 11.0 351.5 L 11.3 352.8 L 10.9 353.7 L 8.6 355.9 L 8.5 357.6 L 9.6 358.8 L 14.8 362.0 L 20.0 364.7 L 21.7 366.1 L 23.6 368.3 L 28.2 371.2 L 28.6 372.0 L 0.0 372.0 Z M 91.8 372.0 L 91.0 371.3 L 91.0 370.7 L 92.0 369.0 L 92.9 369.1 L 93.6 370.4 L 93.4 371.2 L 93.5 371.8 L 91.8 372.0 Z M 17.9 111.4 L 17.5 113.7 L 16.9 114.3 L 14.5 122.5 L 14.0 123.3 L 13.6 123.2 L 13.3 122.2 L 13.2 119.4 L 13.4 118.1 L 15.5 113.2 L 16.4 112.8 L 17.7 109.8 L 18.1 108.4 L 19.0 106.2 L 19.3 105.7 L 20.2 106.1 L 19.5 106.7 L 19.6 107.9 L 17.9 111.4 Z M 30.0 112.5 L 30.6 111.0 L 31.3 109.9 L 30.6 109.1 L 30.2 107.8 L 29.6 106.9 L 30.1 105.8 L 29.8 104.1 L 29.9 102.4 L 32.5 99.2 L 33.8 98.0 L 35.5 97.5 L 36.3 98.0 L 36.7 96.9 L 37.2 96.6 L 38.9 97.9 L 38.1 98.3 L 37.7 99.4 L 36.4 100.0 L 36.2 103.5 L 37.3 104.9 L 36.1 105.5 L 35.7 106.1 L 35.3 107.3 L 33.8 108.1 L 33.2 108.6 L 32.3 109.8 L 31.9 111.6 L 31.0 112.3 L 30.0 112.5 Z M 39.5 97.5 L 39.0 97.4 L 38.6 96.7 L 39.5 95.6 L 41.4 95.9 L 39.7 96.5 L 39.5 97.5 Z M 66.9 96.4 L 66.7 95.9 L 66.8 95.4 L 68.7 92.8 L 67.9 92.6 L 67.2 91.9 L 65.8 91.1 L 65.5 90.5 L 66.2 90.3 L 66.8 89.1 L 65.6 87.4 L 66.2 87.1 L 66.9 87.2 L 67.7 87.7 L 68.5 87.1 L 69.5 87.2 L 70.0 86.1 L 72.1 85.3 L 73.5 85.8 L 74.8 85.4 L 76.1 85.7 L 79.3 87.6 L 79.6 88.1 L 77.7 88.4 L 76.8 89.4 L 76.3 89.5 L 74.2 91.1 L 73.9 91.6 L 71.7 91.5 L 70.5 91.8 L 69.5 92.7 L 69.1 94.5 L 68.4 95.8 L 67.6 96.3 L 66.9 96.4 Z M 77.1 85.6 L 77.5 84.8 L 78.1 84.5 L 79.7 85.0 L 79.9 86.1 L 79.8 86.5 L 79.0 86.7 L 77.1 85.6 Z M 74.3 82.2 L 73.2 84.0 L 72.1 84.3 L 71.4 84.0 L 71.5 83.3 L 70.8 81.6 L 69.9 81.1 L 68.5 81.0 L 67.4 80.3 L 71.3 79.8 L 71.7 79.0 L 72.5 78.1 L 73.1 78.0 L 73.6 78.2 L 73.9 79.2 L 75.6 79.5 L 76.3 80.7 L 76.6 82.0 L 75.8 82.1 L 75.0 82.9 L 74.3 82.2 Z M 33.3 77.7 L 32.6 78.9 L 32.0 79.0 L 32.4 78.0 L 33.3 77.7 Z M 34.6 71.6 L 34.1 72.4 L 33.8 71.8 L 34.1 71.0 L 34.6 70.7 L 35.3 70.9 L 34.6 71.6 Z M 53.6 62.8 L 53.5 63.2 L 52.8 63.3 L 52.4 63.0 L 51.6 62.8 L 52.5 62.3 L 53.2 62.4 L 53.6 62.8 Z M 48.2 60.6 L 48.1 62.0 L 45.8 62.2 L 45.3 61.9 L 44.6 59.8 L 44.8 59.2 L 45.6 58.9 L 45.7 60.1 L 46.3 60.0 L 46.5 58.7 L 45.7 57.9 L 46.1 57.3 L 46.7 57.0 L 47.2 57.8 L 48.6 57.9 L 50.2 59.3 L 49.6 60.4 L 48.5 60.4 L 48.2 60.6 Z M 44.6 60.9 L 43.9 60.9 L 43.7 61.3 L 43.3 61.2 L 43.2 60.5 L 43.5 59.6 L 44.2 59.6 L 44.6 60.9 Z M 66.2 58.2 L 65.2 57.4 L 65.0 57.1 L 65.4 56.9 L 65.2 56.3 L 65.3 56.0 L 66.0 56.5 L 66.4 57.1 L 66.0 57.2 L 66.9 58.1 L 66.2 58.2 Z M 67.6 58.9 L 68.1 57.8 L 68.6 57.6 L 69.8 58.0 L 70.3 57.8 L 70.9 58.7 L 69.9 59.2 L 69.8 59.8 L 70.2 60.3 L 70.4 60.9 L 69.4 60.8 L 68.9 60.4 L 68.7 59.7 L 67.6 58.9 Z M 65.6 60.3 L 65.3 61.2 L 64.4 61.8 L 64.0 61.7 L 64.1 60.7 L 64.7 60.3 L 65.6 60.3 Z M 62.8 60.7 L 63.4 60.8 L 63.5 61.2 L 63.3 61.8 L 62.5 61.9 L 62.0 61.5 L 62.8 60.7 Z M 61.5 55.8 L 60.2 55.9 L 59.7 55.1 L 59.4 53.9 L 59.5 53.6 L 59.9 53.3 L 60.2 54.0 L 61.7 55.1 L 61.5 55.8 Z M 60.8 12.5 L 60.3 13.2 L 59.8 13.3 L 58.8 12.6 L 58.1 11.3 L 59.6 11.3 L 59.4 11.9 L 59.5 12.2 L 60.1 12.1 L 60.8 11.6 L 61.4 11.9 L 61.3 12.6 L 60.8 12.5 Z M 23.2 337.1 L 24.9 337.6 L 26.2 338.7 L 22.3 337.2 L 23.2 337.1 Z M 18.8 335.1 L 17.6 335.6 L 16.5 335.3 L 15.8 334.6 L 15.7 334.0 L 17.5 334.4 L 18.8 334.2 L 19.9 334.5 L 20.8 335.2 L 18.8 335.1 Z M 14.5 330.3 L 15.7 330.5 L 16.1 331.1 L 20.9 331.9 L 16.0 332.0 L 14.7 331.6 L 13.1 330.5 L 14.5 330.3 Z M 13.8 327.8 L 17.5 328.3 L 18.0 328.9 L 17.0 329.6 L 15.5 329.6 L 14.2 329.4 L 13.5 328.9 L 13.8 327.8 Z M 2.3 317.6 L 1.1 316.5 L 0.5 315.5 L 2.1 317.0 L 2.3 317.6 Z M 4.1 319.6 L 3.5 319.4 L 2.8 318.6 L 2.5 317.8 L 3.4 318.4 L 4.1 319.6 Z M 157.9 280.3 L 159.2 281.9 L 162.8 282.9 L 164.1 283.7 L 159.8 282.8 L 158.5 282.1 L 158.1 281.3 L 157.9 280.3 Z M 315.1 293.2 L 315.0 292.3 L 315.3 291.8 L 315.7 293.3 L 315.7 294.3 L 315.5 294.6 L 315.1 293.2 Z M 359.8 295.3 L 359.4 294.6 L 359.9 293.7 L 360.4 293.9 L 360.7 294.8 L 360.6 295.5 L 360.5 295.7 L 359.8 295.3 Z M 337.8 300.9 L 338.3 300.8 L 338.1 302.1 L 337.6 302.8 L 337.4 301.7 L 337.8 300.9 Z M 336.0 300.8 L 336.1 301.2 L 335.4 301.9 L 335.3 302.9 L 335.9 304.0 L 336.7 304.4 L 336.4 304.9 L 335.9 304.8 L 334.9 303.1 L 335.2 301.4 L 336.0 300.8 Z";

// Zone-of-control shading. NOT a hand-drawn front line -- that would assert
// geography this project hasn't verified (exactly where the line ran
// between two known points). Each cell is a Voronoi region ("closer to
// this city than to any other city on the map," clipped to land) computed
// once from the same 22 verified city positions above. Colour is applied
// live, per campaign, from the SAME controlAt(city, atDate) lookup the
// city markers already use -- so this layer adds a technique, not a new
// historical claim. See CIVILWAR_MAP_NOTES below FrontMapScreen.
const ZONE_CELLS = {
  chelyabinsk: "M 499.3 372.0 L 428.7 372.0 L 411.0 0.0 L 502.5 0.0 L 499.3 372.0 Z",
  chita: "M 901.5 0.0 L 1000.0 0.0 L 1000.0 372.0 L 895.7 372.0 L 901.5 0.0 Z",
  don: "M 271.4 311.3 L 226.5 276.1 L 227.1 272.0 L 227.8 271.8 L 230.9 269.9 L 232.2 269.6 L 232.4 269.2 L 232.5 268.6 L 231.5 266.0 L 229.9 266.0 L 229.0 267.5 L 227.8 267.7 L 233.6 230.6 L 255.9 222.8 L 271.4 311.3 Z",
  ekaterinodar: "M 233.3 364.1 L 233.7 364.0 L 237.4 366.0 L 238.4 366.3 L 239.2 366.1 L 240.5 366.6 L 241.8 366.3 L 245.8 364.0 L 247.1 362.7 L 248.4 362.4 L 252.8 359.0 L 255.5 354.5 L 256.1 352.7 L 256.1 350.3 L 255.2 347.5 L 253.5 339.3 L 252.8 338.1 L 250.0 336.6 L 249.4 335.0 L 247.2 332.9 L 244.2 332.0 L 243.7 331.6 L 241.1 328.9 L 238.0 326.4 L 234.6 322.3 L 232.8 319.6 L 226.9 313.4 L 226.2 312.9 L 225.0 312.6 L 220.9 287.0 L 221.8 284.7 L 223.1 284.7 L 223.9 284.9 L 224.8 284.8 L 223.1 282.3 L 220.8 279.9 L 220.5 280.0 L 226.5 276.1 L 271.4 311.3 L 295.6 372.0 L 234.6 372.0 L 233.3 364.1 Z M 220.7 285.9 L 220.8 285.9 L 220.8 286.1 L 220.7 285.9 Z",
  irkutsk: "M 830.7 0.0 L 901.5 0.0 L 895.7 372.0 L 757.7 372.0 L 830.7 0.0 Z",
  kharkov: "M 175.0 235.6 L 176.7 201.3 L 213.6 198.0 L 222.1 223.3 L 195.6 258.3 L 175.0 235.6 Z",
  kiev: "M 139.3 140.2 L 159.8 139.5 L 176.7 201.3 L 175.0 235.6 L 132.6 287.7 L 89.1 324.8 L 109.4 144.1 L 139.3 140.2 Z",
  krasnoyarsk: "M 757.7 372.0 L 659.5 372.0 L 647.8 0.0 L 830.7 0.0 L 757.7 372.0 Z",
  kronstadt: "M 143.9 63.4 L 143.3 63.1 L 142.3 61.6 L 140.8 60.4 L 139.4 60.3 L 137.5 60.7 L 134.6 60.4 L 132.1 58.2 L 130.5 57.5 L 129.3 55.8 L 129.1 54.9 L 130.3 55.7 L 130.6 53.8 L 129.3 52.7 L 126.1 54.4 L 122.1 55.0 L 121.2 55.5 L 119.8 55.7 L 119.2 56.1 L 116.7 54.8 L 115.5 55.1 L 114.3 56.0 L 112.1 56.2 L 111.0 56.5 L 110.3 56.9 L 110.2 56.0 L 110.5 54.8 L 111.0 54.0 L 111.0 53.5 L 110.7 53.5 L 109.9 54.7 L 109.6 56.1 L 108.8 56.7 L 107.2 57.0 L 105.5 55.9 L 104.8 55.9 L 105.6 57.6 L 105.5 58.1 L 104.7 58.0 L 103.7 58.5 L 102.9 59.2 L 102.5 59.2 L 101.9 58.2 L 100.0 59.3 L 98.2 59.5 L 97.1 60.4 L 95.2 61.0 L 94.2 61.0 L 91.8 61.7 L 91.0 62.7 L 90.3 63.1 L 89.3 62.8 L 83.4 64.0 L 80.9 63.7 L 78.2 66.0 L 76.7 66.4 L 76.1 66.2 L 76.6 65.6 L 77.6 64.9 L 78.3 63.9 L 78.4 63.1 L 77.9 62.8 L 77.2 62.7 L 76.4 61.9 L 75.6 60.1 L 75.2 60.1 L 75.0 60.5 L 74.7 61.9 L 74.5 62.3 L 73.1 63.0 L 71.3 63.0 L 71.1 62.0 L 71.4 61.1 L 71.1 61.0 L 71.4 60.3 L 72.3 60.2 L 72.6 59.9 L 72.5 59.4 L 71.9 59.3 L 71.8 59.0 L 72.5 57.4 L 71.9 57.5 L 69.4 57.1 L 66.3 55.5 L 65.5 55.4 L 65.0 54.0 L 64.3 54.2 L 63.2 55.0 L 61.5 54.0 L 61.3 53.4 L 61.2 51.3 L 60.8 48.1 L 61.0 46.6 L 61.7 45.6 L 61.9 44.9 L 62.2 43.1 L 62.3 41.0 L 62.1 40.3 L 62.2 39.9 L 62.7 39.9 L 62.6 39.5 L 62.1 38.8 L 62.3 38.6 L 63.0 38.5 L 63.1 38.2 L 62.6 37.0 L 62.6 36.4 L 61.0 33.0 L 59.8 31.8 L 60.7 28.1 L 60.6 27.3 L 60.4 26.2 L 58.9 25.1 L 58.3 21.8 L 58.5 20.7 L 58.7 19.9 L 59.2 19.1 L 61.7 16.6 L 61.9 15.2 L 63.6 15.1 L 62.8 14.0 L 62.6 13.3 L 62.6 12.5 L 65.0 12.0 L 65.9 12.4 L 68.1 11.9 L 70.0 10.8 L 69.9 10.3 L 69.2 8.8 L 69.5 8.5 L 70.2 8.7 L 69.9 8.2 L 70.0 7.7 L 70.7 7.9 L 72.0 6.5 L 72.0 5.5 L 74.1 4.9 L 76.6 2.7 L 78.9 1.5 L 80.5 0.0 L 147.7 0.0 L 143.9 63.4 Z M 139.3 140.2 L 109.4 144.1 L 89.7 107.2 L 89.9 106.0 L 89.5 100.9 L 88.9 98.7 L 89.2 96.7 L 90.5 93.6 L 90.7 91.1 L 91.2 90.8 L 91.3 90.5 L 91.1 89.7 L 89.8 89.2 L 89.3 89.2 L 88.3 90.7 L 87.2 91.1 L 86.2 90.4 L 83.8 89.6 L 83.2 88.4 L 83.1 87.3 L 81.9 86.1 L 81.4 84.8 L 81.6 83.9 L 82.7 83.3 L 83.0 82.8 L 81.3 82.7 L 81.2 82.3 L 80.6 80.7 L 81.2 80.0 L 81.4 79.4 L 81.0 78.9 L 81.1 78.3 L 81.4 77.7 L 81.2 76.3 L 84.0 75.0 L 86.9 74.7 L 86.6 73.5 L 87.7 73.4 L 89.7 71.9 L 91.6 72.1 L 94.5 71.1 L 99.9 71.1 L 100.6 70.5 L 100.5 69.2 L 101.5 69.4 L 103.2 69.3 L 109.6 70.6 L 111.2 70.6 L 113.4 71.9 L 114.5 72.2 L 118.0 72.2 L 123.3 72.8 L 124.4 71.9 L 125.0 70.6 L 124.8 69.1 L 124.5 67.9 L 124.9 67.0 L 125.6 66.9 L 126.4 67.9 L 127.6 68.4 L 128.4 67.7 L 128.7 66.4 L 129.3 65.9 L 130.1 66.4 L 131.5 66.6 L 133.4 66.2 L 134.7 64.1 L 135.3 63.5 L 140.3 64.2 L 143.8 65.2 L 139.3 140.2 Z M 79.5 88.1 L 79.3 87.6 L 79.6 88.1 L 79.5 88.1 Z M 77.7 84.7 L 78.1 84.5 L 79.7 85.0 L 79.9 86.1 L 79.8 86.5 L 79.0 86.7 L 78.7 86.5 L 77.7 84.7 Z M 74.9 79.4 L 75.6 79.5 L 76.3 80.7 L 76.6 82.0 L 76.3 82.1 L 74.9 79.4 Z M 64.7 60.3 L 65.6 60.3 L 65.2 61.3 L 64.7 60.3 Z M 32.6 0.0 L 56.0 0.0 L 55.1 2.0 L 54.2 2.6 L 52.1 3.5 L 51.3 4.3 L 49.7 5.2 L 46.9 6.0 L 45.7 7.2 L 45.1 8.4 L 44.5 8.5 L 43.0 7.7 L 42.9 9.0 L 41.6 8.2 L 40.9 8.9 L 40.4 10.2 L 38.8 11.7 L 32.6 0.0 Z M 65.2 57.4 L 65.0 57.1 L 65.4 56.9 L 65.2 56.3 L 65.3 56.0 L 66.0 56.5 L 66.4 57.1 L 66.0 57.2 L 66.9 58.1 L 66.2 58.2 L 65.2 57.4 Z M 68.1 57.8 L 68.6 57.6 L 69.8 58.0 L 70.3 57.8 L 70.9 58.7 L 69.9 59.2 L 69.8 59.8 L 70.2 60.3 L 70.4 60.9 L 69.4 60.8 L 68.9 60.4 L 68.7 59.7 L 67.6 58.9 L 67.9 58.5 L 68.1 57.8 Z M 60.8 12.5 L 60.3 13.2 L 59.8 13.3 L 58.8 12.6 L 58.1 11.3 L 59.6 11.3 L 59.4 11.9 L 59.5 12.2 L 60.1 12.1 L 60.8 11.6 L 61.4 11.9 L 61.3 12.6 L 60.8 12.5 Z",
  moscow: "M 214.1 2.8 L 214.7 2.8 L 216.6 1.5 L 219.8 0.7 L 220.3 0.0 L 306.4 0.0 L 265.1 136.9 L 221.8 165.0 L 173.6 120.5 L 214.1 2.8 Z",
  novorossiysk: "M 198.4 355.0 L 200.2 354.4 L 201.4 354.9 L 202.7 358.9 L 203.6 360.4 L 204.8 361.4 L 205.8 361.6 L 206.6 360.5 L 207.1 360.1 L 208.4 359.9 L 210.4 361.3 L 211.1 362.8 L 214.6 363.9 L 217.8 364.5 L 219.2 365.7 L 223.7 366.9 L 225.4 366.7 L 228.2 365.4 L 233.3 364.1 L 234.6 372.0 L 198.6 372.0 L 198.4 355.0 Z M 197.5 299.5 L 198.2 296.1 L 198.6 295.9 L 199.3 295.7 L 201.1 296.2 L 201.7 295.4 L 202.6 294.9 L 203.7 294.8 L 206.4 295.8 L 205.3 298.4 L 204.7 301.1 L 203.1 301.7 L 201.5 301.6 L 199.7 302.0 L 198.6 301.0 L 197.5 300.4 L 197.5 299.5 Z M 220.7 285.9 L 220.7 286.7 L 220.8 287.2 L 220.9 287.0 L 225.0 312.6 L 223.1 312.0 L 221.8 311.3 L 218.7 306.9 L 217.3 307.5 L 216.0 307.3 L 215.2 306.9 L 214.4 306.3 L 213.9 305.5 L 213.2 303.6 L 212.5 302.5 L 210.0 301.0 L 207.2 300.1 L 206.9 299.7 L 206.9 299.1 L 209.3 298.1 L 209.9 297.5 L 207.8 296.2 L 208.5 295.6 L 209.2 295.3 L 210.3 296.0 L 211.5 297.3 L 212.6 297.8 L 213.0 297.2 L 216.7 296.1 L 217.0 295.3 L 216.9 294.3 L 216.6 294.4 L 216.3 294.2 L 216.4 293.1 L 216.9 291.7 L 218.6 289.4 L 219.4 286.2 L 220.2 285.4 L 220.7 285.9 Z",
  omsk: "M 659.5 372.0 L 499.3 372.0 L 502.5 0.0 L 647.8 0.0 L 659.5 372.0 Z",
  orel: "M 159.8 139.5 L 173.6 120.5 L 221.8 165.0 L 213.6 198.0 L 176.7 201.3 L 159.8 139.5 Z",
  perekop: "M 175.0 235.6 L 195.6 258.3 L 200.4 275.9 L 199.3 276.3 L 195.2 280.1 L 193.8 282.9 L 192.6 284.2 L 191.9 284.5 L 191.5 284.5 L 194.0 281.7 L 194.2 280.3 L 193.6 279.2 L 192.0 281.9 L 191.1 282.3 L 189.9 283.2 L 189.9 285.0 L 190.0 286.4 L 190.5 288.1 L 191.6 290.9 L 193.9 295.0 L 194.9 296.5 L 195.7 297.1 L 196.7 297.2 L 198.2 296.1 L 197.5 299.5 L 168.9 294.3 L 170.6 292.7 L 173.6 290.2 L 174.9 289.9 L 176.7 288.8 L 178.6 287.0 L 178.3 285.7 L 177.9 284.7 L 176.3 285.3 L 174.7 284.2 L 174.2 283.4 L 171.7 284.2 L 170.3 284.1 L 167.2 284.9 L 165.8 284.1 L 163.0 282.0 L 161.9 281.6 L 161.0 281.7 L 160.5 281.0 L 161.1 280.7 L 162.6 280.4 L 162.8 280.0 L 162.7 279.4 L 161.3 278.8 L 159.9 278.7 L 158.4 277.4 L 159.9 277.4 L 161.5 277.9 L 163.9 278.1 L 166.1 278.6 L 168.2 276.4 L 166.0 277.2 L 163.9 276.7 L 163.1 276.0 L 162.4 274.9 L 162.1 273.7 L 162.3 272.6 L 162.1 270.6 L 161.3 268.8 L 161.1 267.8 L 160.3 266.9 L 161.1 268.9 L 161.4 270.2 L 161.8 271.5 L 161.7 274.7 L 161.4 275.9 L 160.5 276.1 L 158.2 275.6 L 158.5 273.8 L 157.8 274.4 L 156.9 276.2 L 156.1 276.4 L 154.4 276.3 L 151.1 277.4 L 150.4 280.4 L 149.8 282.0 L 148.4 284.5 L 145.6 288.3 L 145.3 288.6 L 143.2 289.7 L 132.6 287.7 L 175.0 235.6 Z M 159.2 281.9 L 162.8 282.9 L 164.1 283.7 L 159.8 282.8 L 158.5 282.1 L 158.1 281.3 L 157.9 280.3 L 158.7 281.4 L 159.2 281.9 Z",
  petrograd: "M 173.6 120.5 L 159.8 139.5 L 139.3 140.2 L 143.8 65.2 L 144.7 65.5 L 145.0 65.0 L 145.1 64.2 L 143.9 63.4 L 147.7 0.0 L 205.1 0.0 L 210.3 1.3 L 214.1 2.8 L 173.6 120.5 Z",
  saratov: "M 265.1 136.9 L 306.4 0.0 L 310.9 0.0 L 363.6 271.7 L 362.9 271.0 L 360.6 271.0 L 358.7 270.4 L 358.1 270.9 L 357.8 271.5 L 357.4 272.0 L 355.4 273.0 L 354.9 272.8 L 354.2 271.8 L 353.6 272.0 L 351.7 271.3 L 350.8 270.0 L 350.4 269.8 L 347.3 268.7 L 346.2 268.5 L 344.2 269.4 L 264.3 197.9 L 265.1 136.9 Z M 367.2 290.0 L 363.9 287.1 L 365.0 283.1 L 364.7 279.6 L 364.3 278.6 L 364.4 277.5 L 364.7 277.0 L 367.2 290.0 Z",
  sevastopol: "M 89.1 324.8 L 132.6 287.7 L 143.2 289.7 L 141.8 290.5 L 140.5 290.1 L 139.9 290.6 L 139.7 291.2 L 139.7 292.6 L 140.3 293.5 L 140.9 296.6 L 140.0 302.4 L 139.3 304.6 L 134.4 306.0 L 134.7 305.3 L 134.4 303.3 L 134.8 302.5 L 133.7 302.2 L 133.3 302.6 L 132.9 303.4 L 133.2 305.1 L 132.5 306.6 L 132.5 307.9 L 132.1 308.4 L 132.1 309.0 L 132.9 308.9 L 132.5 310.0 L 131.0 312.1 L 130.5 313.3 L 130.7 318.3 L 130.0 321.2 L 129.7 325.9 L 128.8 327.7 L 127.4 327.1 L 125.6 327.6 L 124.7 329.6 L 123.7 331.0 L 123.4 333.6 L 123.3 337.9 L 122.6 338.4 L 122.0 338.6 L 119.4 342.4 L 120.9 343.4 L 121.6 344.3 L 122.6 346.5 L 124.2 349.1 L 124.5 350.3 L 124.2 352.1 L 124.8 354.1 L 126.2 356.9 L 127.7 358.3 L 133.4 361.8 L 134.5 362.1 L 133.9 364.8 L 133.5 365.6 L 131.8 366.1 L 127.2 364.6 L 126.0 364.4 L 125.2 364.8 L 123.6 365.9 L 121.9 365.5 L 119.6 366.2 L 118.9 368.3 L 117.2 370.7 L 115.4 372.0 L 112.6 372.0 L 112.8 371.7 L 110.7 371.7 L 108.7 372.0 L 107.3 371.8 L 106.2 371.9 L 105.3 369.4 L 103.8 368.2 L 100.4 367.5 L 98.7 366.6 L 98.0 366.8 L 96.6 365.8 L 95.7 366.2 L 93.6 368.0 L 92.6 367.8 L 91.4 366.8 L 90.6 366.6 L 89.7 367.1 L 88.3 369.1 L 86.8 370.1 L 85.5 369.7 L 83.8 369.7 L 83.6 370.9 L 84.2 372.0 L 71.7 372.0 L 89.1 324.8 Z M 197.5 299.5 L 197.5 300.4 L 196.8 300.2 L 195.9 300.5 L 194.8 302.4 L 192.8 303.7 L 192.2 305.2 L 190.3 304.9 L 188.7 305.2 L 186.3 306.5 L 184.5 309.4 L 182.5 311.3 L 180.9 311.8 L 179.4 311.7 L 178.5 311.1 L 176.5 309.2 L 176.6 308.5 L 176.9 308.2 L 177.3 307.2 L 178.1 303.6 L 178.0 302.4 L 177.5 300.5 L 176.0 299.1 L 174.7 299.4 L 174.0 299.0 L 171.4 296.6 L 170.0 296.4 L 168.5 296.9 L 167.9 296.5 L 167.5 295.7 L 168.9 294.3 L 197.5 299.5 Z M 198.6 372.0 L 133.1 372.0 L 133.5 371.6 L 134.4 371.3 L 138.8 370.4 L 142.0 369.9 L 142.1 369.5 L 137.4 368.8 L 136.4 368.2 L 135.0 366.7 L 134.4 365.6 L 134.8 362.9 L 135.3 362.2 L 137.0 362.1 L 142.7 363.3 L 146.8 362.6 L 151.2 364.4 L 155.5 364.0 L 156.4 363.2 L 157.5 360.6 L 163.5 356.4 L 165.6 354.1 L 167.8 352.9 L 171.7 351.5 L 174.9 349.7 L 175.9 349.5 L 183.6 350.4 L 189.0 350.5 L 191.4 348.8 L 192.8 349.4 L 192.5 350.5 L 192.5 351.6 L 193.4 353.1 L 194.2 354.1 L 196.7 355.6 L 198.4 355.0 L 198.6 372.0 Z M 91.0 371.3 L 91.0 370.7 L 91.7 369.4 L 92.0 369.0 L 92.9 369.1 L 93.6 370.4 L 93.4 371.2 L 93.5 371.8 L 93.1 372.0 L 91.8 372.0 L 91.0 371.3 Z",
  tsaritsyn: "M 255.9 222.8 L 264.3 197.9 L 344.2 269.4 L 341.5 271.3 L 340.5 272.2 L 340.0 272.3 L 339.0 272.2 L 337.9 273.5 L 335.0 276.1 L 333.9 276.7 L 332.7 277.1 L 331.4 277.2 L 331.0 277.5 L 329.6 277.6 L 328.7 277.9 L 328.9 279.7 L 328.1 279.2 L 327.4 280.1 L 327.7 281.6 L 326.6 281.7 L 326.4 282.6 L 326.2 283.2 L 323.6 284.6 L 322.4 284.8 L 322.6 286.6 L 323.0 287.5 L 322.8 287.8 L 322.4 288.0 L 321.5 287.2 L 320.5 287.2 L 318.3 289.7 L 317.3 290.4 L 314.2 291.6 L 313.6 291.5 L 313.0 291.2 L 312.5 291.7 L 312.3 292.8 L 311.1 291.4 L 310.8 291.2 L 310.7 291.3 L 311.3 292.5 L 311.3 293.7 L 311.2 294.3 L 310.9 294.9 L 310.2 295.4 L 310.0 297.4 L 309.6 298.6 L 308.4 301.7 L 307.3 303.6 L 307.0 305.0 L 306.6 304.7 L 306.3 304.1 L 305.8 305.6 L 303.9 307.6 L 303.5 309.1 L 303.4 310.0 L 303.6 310.8 L 303.9 311.3 L 305.4 311.8 L 306.5 312.5 L 308.4 314.9 L 309.2 316.4 L 309.7 318.1 L 310.4 321.5 L 310.7 325.1 L 311.6 320.6 L 312.4 319.8 L 312.3 321.1 L 311.7 323.0 L 311.1 325.8 L 310.9 327.8 L 311.2 330.4 L 310.7 333.4 L 311.3 334.4 L 312.3 335.4 L 313.0 336.9 L 313.2 339.0 L 314.1 340.1 L 316.6 344.2 L 318.0 346.9 L 319.5 350.6 L 322.2 353.2 L 323.7 355.7 L 326.4 360.9 L 327.1 363.9 L 327.6 365.3 L 329.8 368.9 L 330.7 370.2 L 332.3 372.0 L 295.6 372.0 L 271.4 311.3 L 255.9 222.8 Z M 367.2 290.0 L 393.2 372.0 L 361.9 372.0 L 362.2 370.7 L 363.1 365.1 L 364.3 367.5 L 365.1 368.5 L 366.9 369.2 L 367.7 369.0 L 368.7 368.4 L 369.6 368.6 L 371.0 371.0 L 372.0 371.3 L 374.1 370.4 L 375.1 370.2 L 376.0 370.6 L 376.9 370.6 L 376.5 369.5 L 376.3 368.4 L 376.8 367.8 L 378.5 368.4 L 379.5 368.0 L 380.1 367.5 L 380.2 366.5 L 380.1 365.5 L 380.0 364.6 L 379.7 363.8 L 378.9 362.6 L 376.0 359.9 L 375.0 358.9 L 374.2 357.5 L 372.8 351.9 L 371.8 348.4 L 371.4 347.9 L 370.9 347.8 L 369.7 347.7 L 366.4 348.5 L 365.3 348.3 L 364.7 348.7 L 363.4 350.2 L 362.8 351.5 L 361.9 354.4 L 362.6 355.3 L 362.1 360.3 L 362.4 362.4 L 362.3 362.5 L 361.3 359.9 L 359.9 357.3 L 358.8 353.3 L 358.6 351.6 L 358.5 348.2 L 359.1 346.0 L 360.0 343.0 L 360.2 341.0 L 359.8 337.7 L 359.4 337.0 L 358.8 336.8 L 357.2 336.8 L 356.7 337.1 L 355.9 336.0 L 354.8 335.8 L 353.7 336.3 L 353.1 336.0 L 352.6 335.3 L 352.1 333.8 L 351.2 332.3 L 350.4 331.4 L 347.4 331.1 L 347.3 330.2 L 347.5 328.3 L 347.4 326.2 L 346.8 324.7 L 345.9 323.6 L 345.2 322.0 L 344.0 318.7 L 342.9 314.9 L 342.5 314.4 L 341.5 313.8 L 338.1 312.8 L 337.6 312.4 L 337.4 311.5 L 337.5 309.6 L 337.8 308.8 L 338.9 308.1 L 343.2 308.0 L 345.0 309.6 L 345.6 309.9 L 346.2 310.0 L 348.1 309.4 L 349.7 309.6 L 349.3 308.8 L 348.7 308.4 L 348.0 308.5 L 347.5 308.2 L 346.6 306.7 L 345.1 305.1 L 344.7 304.4 L 344.6 303.3 L 344.9 302.4 L 346.0 301.5 L 346.9 300.2 L 347.4 298.4 L 348.5 296.4 L 349.7 296.6 L 351.6 295.7 L 354.6 295.9 L 358.2 295.7 L 359.2 295.8 L 362.8 297.0 L 364.4 297.2 L 365.6 296.8 L 364.5 295.6 L 362.1 294.2 L 361.5 293.0 L 362.6 289.7 L 363.9 287.1 L 367.2 290.0 Z M 315.0 292.3 L 315.3 291.8 L 315.7 293.3 L 315.7 294.3 L 315.5 294.6 L 315.1 293.2 L 315.0 292.3 Z M 359.4 294.6 L 359.9 293.7 L 360.4 293.9 L 360.7 294.8 L 360.6 295.5 L 360.5 295.7 L 359.8 295.3 L 359.4 294.6 Z M 338.3 300.8 L 338.1 302.1 L 337.9 302.5 L 337.6 302.8 L 337.4 301.7 L 337.8 300.9 L 338.3 300.8 Z M 336.1 301.2 L 335.4 301.9 L 335.3 302.9 L 335.9 304.0 L 336.7 304.4 L 336.4 304.9 L 335.9 304.8 L 334.9 303.1 L 335.2 301.4 L 336.0 300.8 L 336.1 301.2 Z",
  ufa: "M 428.7 372.0 L 393.2 372.0 L 367.2 290.0 L 364.7 277.0 L 365.3 275.5 L 364.3 272.6 L 363.6 271.7 L 310.9 0.0 L 411.0 0.0 L 428.7 372.0 Z",
  voronezh: "M 213.6 198.0 L 221.8 165.0 L 265.1 136.9 L 264.3 197.9 L 255.9 222.8 L 233.6 230.6 L 222.1 223.3 L 213.6 198.0 Z",
  warsaw: "M 38.8 11.7 L 38.5 12.0 L 36.4 11.7 L 36.2 12.0 L 36.8 12.2 L 36.8 12.5 L 35.0 13.0 L 34.4 12.9 L 33.7 14.8 L 31.9 15.3 L 31.6 15.8 L 33.4 15.9 L 33.0 17.4 L 31.0 18.2 L 30.7 18.7 L 30.2 19.1 L 29.3 19.1 L 29.5 18.4 L 28.1 18.4 L 27.7 17.6 L 27.5 17.8 L 27.6 18.5 L 28.4 20.2 L 28.0 20.9 L 27.7 21.2 L 27.9 21.5 L 28.7 21.7 L 29.0 22.1 L 28.1 22.5 L 27.0 23.7 L 25.9 23.7 L 25.2 24.5 L 24.5 24.5 L 23.9 24.0 L 23.0 23.6 L 22.7 24.3 L 22.6 24.9 L 23.1 26.3 L 24.2 27.5 L 25.1 28.0 L 24.4 28.3 L 23.9 29.0 L 22.6 33.8 L 23.0 35.8 L 23.5 36.7 L 22.2 36.6 L 20.9 36.1 L 21.1 37.1 L 20.3 38.4 L 20.6 40.3 L 20.4 41.5 L 20.7 41.9 L 21.0 42.6 L 20.6 43.2 L 20.8 43.6 L 21.1 47.8 L 21.0 48.3 L 21.7 50.6 L 21.4 52.3 L 22.5 53.3 L 24.4 53.3 L 24.7 53.5 L 25.4 55.0 L 26.1 54.9 L 27.4 54.3 L 28.2 54.1 L 28.7 55.3 L 30.2 57.0 L 31.0 57.7 L 32.4 58.1 L 34.0 59.5 L 33.7 61.1 L 34.4 61.6 L 36.1 62.2 L 36.8 63.1 L 37.1 63.8 L 37.5 64.4 L 38.1 66.2 L 37.9 67.3 L 35.5 68.9 L 34.1 70.4 L 32.5 71.6 L 31.9 71.8 L 31.3 72.4 L 30.7 72.7 L 30.2 72.5 L 28.3 73.7 L 28.4 74.2 L 29.9 74.4 L 30.6 74.1 L 31.2 73.6 L 32.4 73.5 L 33.5 72.9 L 34.0 73.1 L 34.5 74.2 L 33.4 74.7 L 32.6 74.8 L 32.2 76.5 L 31.3 77.7 L 29.6 78.4 L 28.4 79.4 L 27.0 80.1 L 26.4 79.9 L 25.5 80.7 L 23.4 81.6 L 22.4 82.9 L 20.0 84.0 L 18.8 84.9 L 12.5 84.7 L 11.5 85.2 L 12.5 85.3 L 13.2 85.7 L 14.0 85.5 L 17.0 86.0 L 18.3 87.5 L 17.4 88.0 L 15.7 88.4 L 16.8 91.9 L 16.2 92.7 L 16.1 96.6 L 15.2 96.7 L 14.8 98.3 L 15.1 99.1 L 15.1 101.0 L 15.3 102.2 L 15.7 103.2 L 15.5 104.4 L 14.0 107.0 L 14.1 108.2 L 14.3 109.0 L 14.5 110.1 L 13.4 114.3 L 12.8 115.8 L 11.5 117.7 L 10.9 119.1 L 9.4 123.6 L 8.7 124.5 L 7.8 125.1 L 5.9 124.2 L 4.8 124.2 L 3.0 124.7 L 0.0 124.4 L 0.0 0.0 L 32.6 0.0 L 38.8 11.7 Z M 65.2 61.3 L 64.4 61.8 L 64.0 61.7 L 64.1 60.7 L 64.7 60.3 L 65.2 61.3 Z M 76.3 82.1 L 75.8 82.1 L 75.0 82.9 L 74.3 82.2 L 73.2 84.0 L 72.1 84.3 L 71.4 84.0 L 71.5 83.3 L 70.8 81.6 L 69.9 81.1 L 68.5 81.0 L 67.4 80.3 L 71.3 79.8 L 71.7 79.0 L 72.5 78.1 L 73.1 78.0 L 73.6 78.2 L 73.9 79.2 L 74.9 79.4 L 76.3 82.1 Z M 78.7 86.5 L 77.1 85.6 L 77.7 84.7 L 78.7 86.5 Z M 79.5 88.1 L 77.7 88.4 L 76.8 89.4 L 76.3 89.5 L 75.4 90.3 L 74.2 91.1 L 73.9 91.6 L 71.7 91.5 L 70.5 91.8 L 69.5 92.7 L 69.1 94.5 L 68.4 95.8 L 67.6 96.3 L 66.9 96.4 L 66.7 95.9 L 66.8 95.4 L 68.4 93.5 L 68.7 92.8 L 67.9 92.6 L 67.2 91.9 L 65.8 91.1 L 65.5 90.5 L 66.2 90.3 L 66.6 89.8 L 66.8 89.1 L 65.6 87.4 L 66.2 87.1 L 66.9 87.2 L 67.7 87.7 L 68.5 87.1 L 68.9 87.0 L 69.5 87.2 L 70.0 86.1 L 72.1 85.3 L 72.8 85.4 L 73.5 85.8 L 74.8 85.4 L 76.1 85.7 L 79.3 87.6 L 79.5 88.1 Z M 109.4 144.1 L 89.1 324.8 L 71.7 372.0 L 41.6 372.0 L 41.4 371.1 L 41.9 369.1 L 42.6 366.8 L 42.6 364.0 L 42.8 362.0 L 42.5 360.6 L 42.4 359.0 L 42.9 356.8 L 43.4 356.2 L 43.7 355.5 L 43.7 353.2 L 42.7 352.1 L 41.5 351.9 L 40.0 350.6 L 39.4 348.9 L 37.2 345.9 L 34.7 343.8 L 34.5 343.5 L 34.8 342.8 L 33.6 342.9 L 30.2 339.7 L 26.9 337.1 L 24.6 336.5 L 21.5 334.4 L 19.5 333.7 L 21.1 333.5 L 26.0 336.3 L 25.4 335.5 L 24.2 334.5 L 22.2 332.1 L 20.3 330.6 L 18.1 327.7 L 15.2 326.5 L 13.2 325.3 L 10.7 325.9 L 9.9 325.9 L 9.3 325.6 L 8.9 324.9 L 8.9 323.5 L 7.7 322.2 L 6.2 321.0 L 4.7 319.5 L 1.7 315.3 L 1.1 313.9 L 2.6 313.4 L 3.4 313.4 L 4.4 313.7 L 2.5 311.9 L 0.0 308.8 L 0.0 157.6 L 8.5 154.9 L 11.3 154.3 L 12.3 153.2 L 13.1 152.0 L 14.8 150.1 L 17.9 149.4 L 19.1 148.6 L 21.5 147.3 L 27.1 145.9 L 29.4 145.6 L 31.7 145.6 L 35.9 148.0 L 36.3 148.9 L 35.1 148.3 L 33.4 147.1 L 32.8 147.1 L 34.2 150.8 L 35.0 152.1 L 36.6 153.1 L 38.0 153.4 L 42.1 152.8 L 43.5 152.0 L 45.4 150.3 L 46.4 148.8 L 47.2 147.0 L 47.5 144.3 L 48.8 143.7 L 51.6 143.8 L 52.7 143.1 L 54.3 141.4 L 55.9 139.3 L 57.5 136.6 L 57.9 135.4 L 58.2 133.7 L 58.4 133.2 L 58.3 135.3 L 57.6 137.4 L 56.0 140.1 L 53.5 143.3 L 54.2 143.7 L 55.2 143.9 L 56.3 144.5 L 57.3 144.6 L 59.1 144.1 L 59.5 141.3 L 59.6 138.7 L 59.3 137.6 L 59.6 135.8 L 59.0 133.2 L 57.9 130.1 L 57.8 126.7 L 57.5 123.0 L 57.6 117.0 L 58.0 114.0 L 59.8 112.3 L 60.7 110.9 L 61.2 109.1 L 61.4 107.5 L 61.7 106.1 L 64.3 102.1 L 66.4 101.7 L 69.1 100.6 L 72.2 99.7 L 73.1 101.7 L 76.8 105.0 L 77.8 106.1 L 79.2 109.8 L 82.7 111.7 L 85.4 111.1 L 88.7 108.5 L 89.7 107.2 L 109.4 144.1 Z M 1.2 140.7 L 1.2 141.6 L 0.7 142.7 L 0.4 142.9 L 0.0 142.8 L 0.0 139.9 L 1.2 140.7 Z M 1.0 311.1 L 2.2 312.4 L 1.7 312.7 L 1.5 313.1 L 0.3 311.8 L 0.0 311.3 L 0.0 309.6 L 1.0 311.1 Z M 1.7 319.2 L 1.8 319.6 L 1.2 319.5 L 0.0 317.7 L 0.0 316.9 L 1.7 319.2 Z M 0.0 349.9 L 1.5 350.9 L 3.8 351.2 L 9.1 350.8 L 10.1 351.0 L 11.0 351.5 L 11.3 352.8 L 10.9 353.7 L 9.8 354.6 L 8.6 355.9 L 8.5 357.6 L 9.6 358.8 L 14.8 362.0 L 20.0 364.7 L 21.7 366.1 L 23.6 368.3 L 28.2 371.2 L 28.6 372.0 L 0.0 372.0 L 0.0 349.9 Z M 17.5 113.7 L 16.9 114.3 L 14.5 122.5 L 14.0 123.3 L 13.6 123.2 L 13.3 122.2 L 13.2 119.4 L 13.4 118.1 L 15.5 113.2 L 16.4 112.8 L 17.7 109.8 L 18.1 108.4 L 19.0 106.2 L 19.3 105.7 L 20.2 106.1 L 19.5 106.7 L 19.6 107.9 L 17.9 111.4 L 17.5 113.7 Z M 30.6 111.0 L 31.3 109.9 L 30.6 109.1 L 30.2 107.8 L 29.6 106.9 L 30.1 105.8 L 29.8 104.1 L 29.9 102.4 L 31.3 100.8 L 32.5 99.2 L 33.8 98.0 L 35.5 97.5 L 36.3 98.0 L 36.7 96.9 L 37.2 96.6 L 37.8 96.9 L 38.9 97.9 L 38.1 98.3 L 37.7 99.4 L 36.4 100.0 L 36.2 103.5 L 37.3 104.9 L 36.1 105.5 L 35.7 106.1 L 35.3 107.3 L 33.8 108.1 L 33.2 108.6 L 32.3 109.8 L 31.9 111.6 L 31.0 112.3 L 30.0 112.5 L 30.6 111.0 Z M 39.0 97.4 L 38.6 96.7 L 39.5 95.6 L 40.9 95.7 L 41.4 95.9 L 39.7 96.5 L 39.5 97.5 L 39.0 97.4 Z M 32.6 78.9 L 32.0 79.0 L 32.4 78.0 L 33.3 77.7 L 32.6 78.9 Z M 34.3 71.9 L 34.1 72.4 L 33.8 71.8 L 34.1 71.0 L 34.6 70.7 L 35.3 70.9 L 35.3 71.0 L 34.3 71.9 Z M 53.5 63.2 L 52.8 63.3 L 52.4 63.0 L 51.7 63.0 L 51.6 62.8 L 51.9 62.5 L 52.5 62.3 L 53.2 62.4 L 53.6 62.8 L 53.5 63.2 Z M 48.1 62.0 L 45.8 62.2 L 45.3 61.9 L 44.6 59.8 L 44.8 59.2 L 45.6 58.9 L 45.7 60.1 L 46.3 60.0 L 46.5 58.7 L 45.7 57.9 L 46.1 57.3 L 46.7 57.0 L 47.2 57.8 L 48.6 57.9 L 49.4 58.5 L 49.5 58.8 L 50.1 59.0 L 50.2 59.3 L 49.6 60.4 L 49.0 60.3 L 48.2 60.6 L 48.1 62.0 Z M 43.9 60.9 L 43.7 61.3 L 43.3 61.2 L 43.2 60.5 L 43.5 59.6 L 44.2 59.6 L 44.6 60.9 L 43.9 60.9 Z M 63.4 60.8 L 63.5 61.2 L 63.3 61.8 L 62.5 61.9 L 62.0 61.5 L 62.2 61.1 L 62.8 60.7 L 63.4 60.8 Z M 60.2 55.9 L 59.7 55.1 L 59.4 53.9 L 59.5 53.6 L 59.9 53.3 L 60.2 54.0 L 61.7 55.1 L 61.5 55.8 L 60.2 55.9 Z M 24.9 337.6 L 26.2 338.7 L 22.3 337.2 L 23.2 337.1 L 24.9 337.6 Z M 17.6 335.6 L 16.5 335.3 L 16.1 335.0 L 15.8 334.6 L 15.7 334.0 L 17.5 334.4 L 18.8 334.2 L 19.9 334.5 L 20.8 335.2 L 18.8 335.1 L 17.6 335.6 Z M 15.7 330.5 L 16.1 331.1 L 20.9 331.9 L 20.2 332.1 L 16.0 332.0 L 14.7 331.6 L 13.1 330.5 L 14.5 330.3 L 15.7 330.5 Z M 15.2 327.8 L 17.5 328.3 L 18.0 328.9 L 17.8 329.2 L 17.0 329.6 L 15.5 329.6 L 14.2 329.4 L 13.5 328.9 L 13.8 327.8 L 15.2 327.8 Z M 1.1 316.5 L 0.5 315.5 L 2.1 317.0 L 2.3 317.6 L 1.1 316.5 Z M 3.5 319.4 L 2.8 318.6 L 2.5 317.8 L 3.4 318.4 L 4.1 319.6 L 3.5 319.4 Z",
  yuzovka: "M 222.1 223.3 L 233.6 230.6 L 227.8 267.7 L 226.5 268.0 L 225.4 267.9 L 226.3 266.9 L 227.1 266.5 L 227.4 266.1 L 225.6 266.5 L 224.7 267.5 L 221.8 269.0 L 218.4 268.8 L 215.7 269.1 L 213.8 271.6 L 212.6 271.6 L 211.0 272.3 L 209.9 273.1 L 208.5 274.8 L 207.5 274.0 L 206.3 274.1 L 205.1 274.5 L 203.6 275.7 L 202.8 275.9 L 201.2 275.6 L 200.4 275.9 L 195.6 258.3 L 222.1 223.3 Z M 226.5 276.1 L 220.5 280.0 L 219.9 280.1 L 219.3 279.7 L 218.3 277.7 L 217.8 276.1 L 219.8 276.4 L 221.6 275.2 L 222.3 275.0 L 224.9 275.6 L 224.8 274.5 L 224.3 273.3 L 227.1 272.0 L 226.5 276.1 Z",
};

// Fill colours for control state. Deliberately fixed rather than skin-derived:
// the whole point is that Red and White read as different sides at a glance,
// and a skin's single accent colour cannot carry that distinction.
const CONTROL_COLORS = {
  red: "#b03a2e",
  white: "#5b6e8c",
  contested: "#b8860b",
  other: "#7a7a72",
  unknown: "#8a8a82",
};

// Unvisited markers need to stay visible against BOTH the light and dark
// paper skins. The old approach (white(0.8) / black(0.45) matching the
// page background) failed exactly the way it sounds like it would: on a
// light cream page, a near-white fill is nearly invisible. Tinting the
// control colour itself instead — same hue as the visited marker, just
// pale — reads on any background because it's never close to either
// extreme.
function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Parse a node's display date ("OCTOBER 1919", "OCTOBER-NOVEMBER 1920") into
// a comparable YYYYMM integer. Takes the FIRST month named in a range.
const MONTH_NUMS = {
  JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6,
  JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12,
};
function dateToYYYYMM(dateStr) {
  if (!dateStr) return null;
  const up = dateStr.toUpperCase();
  const year = (up.match(/\b(19\d{2})\b/) || [])[1];
  if (!year) return null;
  let month = 1;
  for (const [name, num] of Object.entries(MONTH_NUMS)) {
    const idx = up.indexOf(name);
    if (idx !== -1) { month = num; break; }
  }
  return parseInt(year, 10) * 100 + month;
}

function controlAt(city, yyyymm) {
  if (!city.control || !city.control.length) return "unknown";
  if (yyyymm == null) return "unknown";
  let side = "unknown";
  for (const [from, s] of city.control) {
    if (yyyymm >= from) side = s;
    else break;
  }
  return side;
}

// Marker radius from population. Area scales with population, so radius
// scales with its square root — Petrograd at 2.4m should dwarf Orel at 76k
// without making Orel disappear, hence the floor.
function markerRadius(city) {
  if (!city.pop) return 6;
  return 3 + 11 * Math.sqrt(city.pop / 2400);
}

// Every decision node and ending, mapped to the real city its content is
// actually set in or centered on. Built directly from the node titles and
// situation text already written — not a separate invented layer.
const NODE_TO_CITY = {
  wrangelsDismissal20: "sevastopol",
  wrangelsReassignment20: "sevastopol",
  sevastopolCouncil20: "sevastopol",
  endingTheCouncilAtSevastopol20: "sevastopol",
  endingTheAdmiralAtIrkutsk20: "irkutsk",
  polishWar20: "warsaw",
  endingTheVistula20: "warsaw",
  // South Russia
  kornilovsDeath18: "ekaterinodar",
  ekaterinodarAssault18: "ekaterinodar",
  afterEkaterinodar18: "ekaterinodar",
  moscowDirective19: "tsaritsyn",
  kievConvergence19: "kiev",
  volgaThrust19: "tsaritsyn",
  volgaOverextension19: "tsaritsyn",
  volgaCossackDesertion19: "tsaritsyn",
  rearSecurity19: "yuzovka",
  peregonovka19: "yuzovka",
  makhnosAftermath19: "yuzovka",
  orelCulmination19: "orel",
  cossackDesertion19: "don",
  kubanCoup19: "ekaterinodar",
  kubanRadaReorganized19: "ekaterinodar",
  kubanQuotaAftermath19: "ekaterinodar",
  kharkovLine19: "kharkov",
  kharkovEncirclement19: "kharkov",
  afterTheCavalryStrike19: "kharkov",
  endingTheLineThatBroke19: "kharkov",
  novorossiysk20: "novorossiysk",
  voroshilovsCavalry20: "novorossiysk",
  moleRearguardFate20: "novorossiysk",
  landLawDecision20: "sevastopol",
  northernTauride20: "perekop",
  wrangelsEnvoy20: "perekop",
  crimeaDefensePrep20: "sevastopol",
  endingBizerte: "sevastopol",
  endingSecondNovorossiysk: "novorossiysk",
  endingArmyDissolved20: "sevastopol",
  endingCossackMutiny: "don",
  endingTheArmyThatDidNotComeBack18: "ekaterinodar",
  // Siberia
  omskCoup18: "omsk",
  boldyrevsFirstWeek18: "omsk",
  reluctanceAftermath18: "chita",
  semyonovResponse18: "chita",
  springOffensive19: "omsk",
  saratovJunction19: "saratov",
  exposedFlank19: "saratov",
  ufaCounteroffensive19: "ufa",
  chelyabinskGrinder19: "chelyabinsk",
  diterichsOverruled19: "chelyabinsk",
  thirdArmySuccessor19: "chelyabinsk",
  railPriority19: "omsk",
  janinsWord19: "omsk",
  endingBoldyrevsOmsk18: "omsk",
  endingOmskFalls19: "omsk",
  iceMarchDecision19: "krasnoyarsk",
  eichesPursuit20: "krasnoyarsk",
  irkutskUltimatum20: "irkutsk",
  semyonovMerger20: "chita",
  manchurianBorder20: "chita",
  chitaFall20: "chita",
  endingManchuria: "chita",
  endingManchuriaEarly: "chita",
  endingDispersedAtTheBorder: "chita",
  endingColumnScattered20: "chita",
  endingLegionWithdraws: "omsk",
  // Bolsheviks
  revvoensovietFormed18: "moscow",
  militaryOppositionCongress19: "moscow",
  congressFallout19: "moscow",
  smirnovReassignment19: "moscow",
  tsaritsynCrisis18: "tsaritsyn",
  tsaritsynAftermath18: "tsaritsyn",
  stalinsRecall18: "moscow",
  stalinsNewPosting18: "moscow",
  grainRequisition18: "moscow",
  supplyShortfall19: "moscow",
  supplyRationingConsequence19: "moscow",
  southernFrontPlan19: "tsaritsyn",
  donbasMobilization19: "yuzovka",
  donbasAttrition19: "yuzovka",
  reinforcedBattalionsTest19: "yuzovka",
  cavalryArmyDebate19: "voronezh",
  distributedPursuit19: "voronezh",
  endingTheAutumnCrisis19: "orel",
  perekopAssault20: "perekop",
  compressedEvacuation20: "sevastopol",
  kronstadt21: "kronstadt",
  endingIceBroken: "kronstadt",
  endingHollowVictory21: "kronstadt",
  endingUnlikelyPrecedent: "kronstadt",
  endingCentralCommitteeMoves: "moscow",
  endingTheIsland21: "kronstadt",
};

// Inline-style helpers. IMPORTANT: these return real style objects, not
// Tailwind classNames — see the comment above SKINS for why (arbitrary-
// value Tailwind classes don't render in this sandbox, no JIT build step).
//
// ROOT-CAUSE FIX (this round): every helper below now branches on
// skin.dark. Previously screenStyle()/mutedTextStyle() always used `paper`
// as the background and `ink` as text color regardless of the skin's dark
// flag — correct for the two light skins (Elegy, Frontier), completely
// backwards for the dark Agitprop skin, where `paper` was meant to be the
// light TEXT color against a dark `ground` background, not the background
// itself. That's exactly what the screenshot showed: Agitprop rendering
// with a cream background and low-contrast pale-tan muted text instead of
// its intended dark ground with light text.
function screenStyle(skin) {
  return skin.dark
    ? { backgroundColor: skin.ground, color: skin.paper, fontFamily: BODY_FONT }
    : { backgroundColor: skin.paper, color: skin.ink, fontFamily: BODY_FONT };
}
function cardStyle(skin, borderWidth = 2) {
  return { borderColor: skin.accent, borderWidth, borderStyle: "solid", fontFamily: BODY_FONT };
}
function accentTextStyle(skin) {
  return { color: skin.accent };
}
function accentBorderStyle(skin) {
  return { borderColor: skin.accent };
}
function accentBgStyle(skin) {
  return { backgroundColor: skin.accent, color: skin.dark ? skin.ground : skin.paper };
}
function mutedTextStyle(skin) {
  // paperDim is a light muted tone — correct for dark-skin text, wrong
  // (too low-contrast) as muted text on a light paper background.
  return skin.dark ? { color: skin.paperDim } : { color: skin.inkMuted };
}
function primaryTextStyle(skin) {
  return { color: skin.dark ? skin.paper : skin.ink };
}
function displayFontStyle(skin) {
  return { fontFamily: skin.displayFont };
}
function monoFontStyle(skin) {
  return { fontFamily: skin.monoFont };
}
function dividerStyle(skin) {
  return { borderColor: skin.dark ? "rgba(217,201,163,0.25)" : skin.inkMuted };
}


function cipherGroups(seedStr) {
  // Deterministic pseudo-cipher digits from a node id — flavor only, not a
  // claim about real historical cryptography.
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) >>> 0;
  const groups = [];
  for (let i = 0; i < 8; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    groups.push(String(h % 100000).padStart(5, "0"));
  }
  return groups;
}

function TopBar({ title, onClose, menuItems }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="bg-black text-white px-4 py-3 flex items-center justify-between relative">
      <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border border-white/30 text-sm">
        ✕
      </button>
      <div className="font-mono text-sm">{title}</div>
      {menuItems && menuItems.length > 0 ? (
        <>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/30 text-sm"
          >
            ···
          </button>
          {menuOpen && (
            <div className="absolute right-4 top-14 bg-stone-950 border border-white/30 font-mono text-xs z-10 min-w-[220px]">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  onClick={() => {
                    setMenuOpen(false);
                    item.onClick();
                  }}
                  className="px-4 py-3 cursor-pointer border-b border-white/10 last:border-b-0 hover:bg-stone-800"
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="w-8 h-8 flex items-center justify-center rounded-full border border-white/30 text-sm">···</div>
      )}
    </div>
  );
}

function CipherBlock({ campaign, node, skin, reduceMotion }) {
  const groups = cipherGroups(node?.title || campaign.id);
  const originatorMap = {
    southRussia: "AFSR Field Staff",
    siberia: "Supreme Ruler's Staff, Omsk",
    bolsheviks: "Revvoensoviet Staff Train",
    provisionalGov17: "Cabinet Chancery, Mariinsky Palace",
  };
  const addresseeMap = {
    southRussia: "Volunteer Army Command",
    siberia: "Siberian Army Command",
    bolsheviks: "Southern Front Command",
    provisionalGov17: "Petrograd Garrison Staff",
  };

  return (
    <div className="p-4 border-2 text-xs" style={{ ...screenStyle(skin), borderColor: skin.accent, ...monoFontStyle(skin) }}>
      {/* Header device — the one element that's structurally different per
          skin, not just recolored. Everything else in this block keeps the
          same slot order across all three. */}
      {skin.headerStyle === "seal" && (
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-14 h-14 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={accentBorderStyle(skin)}>
            <div className="absolute inset-1 rounded-full border opacity-60" style={accentBorderStyle(skin)} />
            <div className="font-bold tracking-wide" style={{ ...accentTextStyle(skin), fontSize: "10px" }}>{campaign.shortTag}</div>
          </div>
          <div style={mutedTextStyle(skin)}>DISPATCH — ENCIPHERED</div>
        </div>
      )}
      {skin.headerStyle === "railmarker" && (
        <div className="mb-3">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex-1 h-2" style={{ backgroundColor: i % 2 === 0 ? skin.accent : "transparent" }} />
            ))}
          </div>
          <div className="mt-1" style={mutedTextStyle(skin)}>{campaign.shortTag} — VERST 0, TELEGRAPH LINE</div>
        </div>
      )}
      {skin.headerStyle === "stamp" && (
        <div className="mb-3 relative">
          <div className="absolute right-0 top-0 w-16 h-16 rounded-full border-2 flex items-center justify-center opacity-90" style={{ ...accentBorderStyle(skin), transform: reduceMotion ? "none" : "rotate(-9deg)" }}>
            <div className="font-bold text-center leading-tight" style={{ ...accentTextStyle(skin), ...displayFontStyle(skin), fontSize: "9px" }}>
              RESTRICTED<br />{campaign.shortTag}
            </div>
          </div>
          <div style={{ ...mutedTextStyle(skin), maxWidth: "60%" }}>ENCIPHERED DISPATCH</div>
        </div>
      )}
      {skin.headerStyle === "telegram" && (
        <div className="mb-3">
          <div className="tracking-widest font-bold mb-1" style={{ ...accentTextStyle(skin), fontSize: "10px" }}>
            {"· — ·· — ·"} {campaign.shortTag} {"· — ·· — ·"}
          </div>
          <div style={mutedTextStyle(skin)}>TELEGRAPH OFFICE, PETROGRAD — PRIORITY</div>
        </div>
      )}

      <div className="tracking-widest mb-3" style={mutedTextStyle(skin)}>
        {groups.slice(0, 4).join(" ")}
        <br />
        {groups.slice(4).join(" ")}
      </div>
      <div className="border-t-2 border-dashed my-3" style={{ borderColor: skin.paperDim }} />
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div style={mutedTextStyle(skin)}>DATE</div>
          <div className="font-bold">{node?.date || "—"}</div>
        </div>
        <div>
          <div style={mutedTextStyle(skin)}>DISPATCH NO.</div>
          <div className="font-bold">{groups[0].slice(0, 2)}</div>
        </div>
        <div>
          <div style={mutedTextStyle(skin)}>CLASSIFICATION</div>
          <div className="font-bold">RESTRICTED</div>
        </div>
      </div>
      <div className="mt-3">
        <div style={mutedTextStyle(skin)}>ORIGINATOR</div>
        <div className="font-bold">{originatorMap[campaign.id]}</div>
        <div className="mt-1" style={mutedTextStyle(skin)}>ADDRESSEE</div>
        <div className="font-bold">{addresseeMap[campaign.id]}</div>
      </div>
    </div>
  );
}

function TriangleMeters({ campaign, meters, skin }) {
  const borderColor = { borderColor: skin.dark ? skin.paperDim : skin.ink };
  const dividerColor = { borderColor: skin.paperDim };
  // Label column gets a fixed width so the bar itself is always the same
  // size regardless of label length — "MOBILIZATION" and "POLITICAL
  // RELIABILITY" were squeezing the flex-1 bar to different widths before,
  // which is exactly the misaligned-bars bug being fixed here.
  const labelStyle = { width: "108px", flexShrink: 0, lineHeight: 1.2 };
  return (
    <div className="border-2 p-4" style={{ ...borderColor, ...monoFontStyle(skin) }}>
      {campaign.triangleAxes.map(({ key, label }) => {
        const val = meters[key];
        const pct = Math.max(-10, Math.min(10, val));
        return (
          <div key={key} className="flex items-center mb-2 text-xs">
            <span style={labelStyle}>{label}</span>
            <div className="flex-1 mx-3 border-2 h-5 relative flex" style={borderColor}>
              <div className="w-1/2 h-full relative border-r" style={dividerColor}>
                {pct < 0 && (
                  <div className="h-full absolute right-0" style={{ backgroundColor: skin.accent, width: `${(Math.abs(pct) / 10) * 100}%` }} />
                )}
              </div>
              <div className="w-1/2 h-full relative">
                {pct > 0 && <div className="h-full" style={{ backgroundColor: skin.accent, width: `${(pct / 10) * 100}%` }} />}
              </div>
            </div>
            <span className="w-10 text-right flex-shrink-0">{val > 0 ? `+${val}` : val}</span>
          </div>
        );
      })}
      <div className="text-xs mt-2" style={mutedTextStyle(skin)}>
        All three axes start at 0 — the historical baseline. Plus/minus tracks divergence from what actually happened, capped ±10.
      </div>
    </div>
  );
}

function RecordsListScreen({ onOpen, onOpenWarRecord, onOpenSettings, savedRun, onResume }) {
  const campaigns = Object.values(CAMPAIGNS);
  const whiteCampaigns = campaigns.filter((c) => c.coalition === "white");
  const redCampaigns = campaigns.filter((c) => c.coalition === "red");
  // Neither White nor Red — 1917's dual-power government, chronologically
  // before either side of the Civil War exists. Filtered separately rather
  // than folded into "whiteCampaigns" (it is not a White campaign, and
  // treating it as one would misstate exactly the thing its own thesis is
  // about) or generalized into a loop over every coalition value that
  // happens to exist — a third, deliberately-labeled section is clearer
  // than a generic one for a menu this small.
  const provisionalCampaigns = campaigns.filter((c) => c.coalition === "provisional");
  // Shared stamp-red across the whole shell — deliberately not any one
  // campaign's own accent colour, since this menu sits before the player
  // has picked a side.
  const stampRed = "#8a1f1f";

  // Deliberately neutral shell — one consistent tone for the whole menu,
  // not each campaign's own skin. The distinct look (palette, fonts,
  // signature device) only kicks in once a campaign is actually opened;
  // the main menu shouldn't feel like three different apps stitched
  // together before the player has picked one.
  function CampaignCard(c) {
    return (
      <div
        key={c.id}
        onClick={() => onOpen(c.id)}
        className="cursor-pointer relative"
        style={{ background: "#e9e1cc", border: "1px solid #1a1712", padding: "12px 14px", marginBottom: 12 }}
      >
        <div
          style={{
            position: "absolute",
            top: -8,
            right: 12,
            border: `1px solid ${stampRed}`,
            color: stampRed,
            fontSize: 9,
            letterSpacing: 1,
            padding: "1px 6px",
            background: "#f2ecdc",
            fontFamily: "'Courier Prime', monospace",
            transform: `rotate(${c.coalition === "white" ? 3 : c.coalition === "red" ? -2 : 1}deg)`,
          }}
        >
          {c.shortTag}
        </div>
        <div style={{ fontFamily: BODY_FONT, fontWeight: 700, fontSize: 17, color: "#1a1712" }}>{c.label}</div>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#5c5647", marginTop: 2 }}>
          {c.commander}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f2ecdc", minHeight: "100%" }}>
      <TopBar title="dispatches-1922" onClose={() => {}} />
      <div style={{ padding: "16px 16px 10px", borderBottom: "2px double #1a1712" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'Courier Prime', monospace",
            fontSize: 9,
            letterSpacing: 2,
            color: "#6b6150",
            marginBottom: 8,
          }}
        >
          <span>FILE NO. 1922</span>
          <span style={{ color: stampRed }}>RESTRICTED</span>
        </div>
        <div style={{ fontFamily: BODY_FONT, fontWeight: 900, fontSize: 34, color: "#1a1712", lineHeight: 1 }}>
          DISPATCHES
          <br />
          1922
        </div>
      </div>

      {savedRun && (() => {
        const savedCampaign = CAMPAIGNS[savedRun.campaignId];
        let savedNode = null;
        try {
          savedNode = savedCampaign.resolveNode(savedRun.nodeId, savedRun.flags, savedRun.meters);
        } catch (e) {
          savedNode = null;
        }
        if (!savedNode) return null;
        return (
          <div style={{ padding: "14px 16px 0" }}>
            <div
              onClick={onResume}
              className="cursor-pointer"
              style={{
                border: `2px solid ${stampRed}`,
                background: "#f2ecdc",
                padding: "12px 14px",
              }}
            >
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 2, color: stampRed, fontWeight: 700, marginBottom: 4 }}>
                ▶ RESUME COMMAND
              </div>
              <div style={{ fontFamily: BODY_FONT, fontWeight: 700, fontSize: 15, color: "#1a1712" }}>
                {savedCampaign.label} — {savedNode.title}
              </div>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: "#5c5647", marginTop: 2 }}>
                {savedNode.date} · {savedRun.visitedNodes.length} {savedRun.visitedNodes.length === 1 ? "position" : "positions"} on the record
              </div>
            </div>
          </div>
        );
      })()}

      {provisionalCampaigns.length > 0 && (
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 2, color: stampRed, fontWeight: 700, marginBottom: 6 }}>
            PETROGRAD, 1917 — BEFORE THE WAR
          </div>
          {provisionalCampaigns.map((c) => CampaignCard(c))}
        </div>
      )}

      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 2, color: stampRed, fontWeight: 700, marginBottom: 6 }}>
          THE WHITE MOVEMENT
        </div>
        {whiteCampaigns.map((c) => CampaignCard(c))}
      </div>

      <div style={{ padding: "6px 16px 0" }}>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 2, color: stampRed, fontWeight: 700, marginBottom: 6 }}>
          THE RED ARMY
        </div>
        {redCampaigns.map((c) => CampaignCard(c))}
      </div>

      <div
        style={{
          height: 6,
          margin: "8px 0",
          background: `repeating-linear-gradient(90deg, ${stampRed}, ${stampRed} 6px, transparent 6px, transparent 12px)`,
        }}
      />

      <div className="px-4 pb-8">
        <div
          onClick={onOpenWarRecord}
          className="cursor-pointer"
          style={{
            border: "1px solid #1a1712",
            color: "#1a1712",
            padding: 14,
            fontFamily: "'Courier Prime', monospace",
            fontSize: 13,
            background: "#e9e1cc",
            marginBottom: 10,
          }}
        >
          ▶ WAR RECORD
        </div>
        <div
          onClick={onOpenSettings}
          className="cursor-pointer"
          style={{
            border: "1px solid #1a1712",
            color: "#1a1712",
            padding: 14,
            fontFamily: "'Courier Prime', monospace",
            fontSize: 13,
            background: "#e9e1cc",
          }}
        >
          ▶ SETTINGS
        </div>
      </div>
    </div>
  );
}

function CampaignDetailScreen({ campaignId, onEnter, onClose }) {
  const c = CAMPAIGNS[campaignId];
  const skin = skinFor(c.id);
  const written = c.NODE_ATLAS.length;
  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="inline-block border-2 font-bold px-3 py-1 text-sm" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...displayFontStyle(skin) }}>
          {c.shortTag}
        </div>
        <div className="text-3xl font-bold mt-3" style={displayFontStyle(skin)}>{c.label}</div>
        <div className="text-xs mt-1" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>{c.commander} · {c.seat}</div>
        <div className="text-sm mt-4 leading-relaxed">{c.thesis}</div>
        <div className="border-t-2 mt-4 pt-4 text-xs" style={{ borderColor: skin.paperDim, ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          {written} DECISIONS WRITTEN · {c.ENDINGS_GALLERY.length} ENDINGS · KNOWN-RISK ODDS
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onEnter(c.id, false)}
            className="flex-1 border-2 font-bold py-3"
            style={{ borderColor: skin.dark ? skin.paperDim : skin.ink, ...monoFontStyle(skin) }}
          >
            OPEN COMMAND
          </button>
          <button
            onClick={() => onEnter(c.id, true)}
            className="flex-1 border-2 font-bold py-3 text-sm"
            style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...monoFontStyle(skin) }}
          >
            ✕ {c.hardMode.capitalName}
          </button>
        </div>
        <div className="text-xs mt-3" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>{c.hardMode.description}</div>
      </div>
    </div>
  );
}

function WarRoomScreen({ campaignId, hardModeEnabled, onStart, onClose }) {
  const c = CAMPAIGNS[campaignId];
  const skin = skinFor(c.id);
  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-3xl font-bold" style={displayFontStyle(skin)}>{c.label}</div>
        {hardModeEnabled ? (
          <div className="border-2 mt-3 p-4" style={{ borderColor: skin.accent }}>
            <div className="text-xs font-bold" style={{ ...monoFontStyle(skin), ...accentTextStyle(skin) }}>
              ✕ {c.hardMode.capitalName} — {"●".repeat(c.hardMode.maxCap)}
            </div>
            <div className="text-xs mt-1" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>No rewind. Decisions final. Full meter dashboard hidden below the capital counter.</div>
          </div>
        ) : (
          <div className="text-sm mt-3" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>Full meter visibility, known-risk odds shown before every gamble.</div>
        )}
        <div className="mt-6">
          <TriangleMeters campaign={c} meters={c.initialMeters} skin={skin} />
        </div>
        <button
          onClick={() => onStart(c.id)}
          className="mt-6 w-full font-bold py-3"
          style={{ ...accentBgStyle(skin), ...monoFontStyle(skin) }}
        >
          {hardModeEnabled ? `ENTER COMMAND — ${c.hardMode.capitalName}` : "ENTER COMMAND"}
        </button>
      </div>
    </div>
  );
}

function OddsBadge({ entries, skin }) {
  return (
    <div className="border-2 px-2 py-1 mt-2 text-xs" style={{ borderColor: skin.dark ? skin.paperDim : skin.ink, ...monoFontStyle(skin) }}>
      ⚠ CONTESTED — {entries.map((e, i) => `${e.weight}% ${e.title}`).join(" / ")}
    </div>
  );
}

function ChoiceCard({ choice, skin, meters, hardMode, hardModeEnabled, capitalRemaining, onChoose }) {
  const blocked = typeof choice.gate === "function" && !choice.gate(meters);
  const costsCapital = hardModeEnabled && choice.costsCapital === true;
  return (
    <div
      className="border-2 p-4 mb-3"
      style={{ borderColor: blocked ? skin.paperDim : (skin.dark ? skin.paperDim : skin.ink), borderStyle: blocked ? "dashed" : "solid", opacity: blocked ? 0.75 : 1 }}
    >
      <div className="font-bold text-lg" style={displayFontStyle(skin)}>{choice.label}</div>
      {costsCapital && (
        <div className="inline-block border-2 mt-2 px-2 py-1 text-xs font-bold" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...monoFontStyle(skin) }}>
          ✕ COSTS 1 {hardMode.capitalLabel}
        </div>
      )}
      {choice.advisor && (
        <div className="mt-2 border-l-4 pl-3 text-xs italic" style={{ borderColor: skin.paperDim, ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          "{choice.advisor.quote}"
          <div className="not-italic font-bold mt-1" style={primaryTextStyle(skin)}>— {choice.advisor.name.toUpperCase()}</div>
        </div>
      )}
      {choice.historical && (
        <div className="text-xs mt-2" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>◆ HISTORICAL RECORD</div>
      )}
      {choice.uncertain && <OddsBadge entries={choice.uncertain} skin={skin} />}
      {blocked ? (
        <div className="mt-3 text-xs" style={{ ...monoFontStyle(skin), ...accentTextStyle(skin) }}>
          ✕ NOT AVAILABLE — {choice.disabledReason}
        </div>
      ) : (
        <button onClick={() => onChoose(choice)} className="mt-3 border-2 font-bold px-4 py-2 text-sm" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...displayFontStyle(skin) }}>
          ISSUE THE ORDER
        </button>
      )}
    </div>
  );
}

// Real typewriter reveal, not a fake toggle. Reveals in word-sized chunks
// rather than character-by-character — character reveal on a 300-800 word
// situation/epilogue block is a genuinely bad reading experience even at a
// fast interval, and doesn't match what "typewriter" actually reads as in
// prose this long. instantText=true renders the full text immediately, no
// animation at all — this is what actually makes the settings toggle real.
function TypewriterText({ text, instant, className, style }) {
  const words = React.useMemo(() => text.split(" "), [text]);
  const [shown, setShown] = useState(instant ? words.length : 0);

  React.useEffect(() => {
    setShown(instant ? words.length : 0);
    if (instant) return;
    const id = setInterval(() => {
      setShown((n) => {
        if (n >= words.length) {
          clearInterval(id);
          return n;
        }
        return n + 2;
      });
    }, 35);
    return () => clearInterval(id);
  }, [text, instant, words.length]);

  return (
    <div className={className} style={style}>
      {words.slice(0, shown).join(" ")}
    </div>
  );
}

// Interstitial shown between the outcome of a choice and the next War Room,
// only on nodes that carry a `bulletin` field. Not skippable via a close
// icon (none is offered) — grounding the player before the next decision,
// not another menu to back out of. This is the ONLY place bulletin content
// appears; there is deliberately no browse-anytime archive of it — showing
// up unprompted, tied to the moment it's relevant, is the whole design.
function BulletinScreen({ campaignId, nodeId, flags, meters, onContinue }) {
  const c = CAMPAIGNS[campaignId];
  const node = c.resolveNode(nodeId, flags, meters);
  const bulletin = node && node.bulletin;
  const skin = skinFor(c.id);
  if (!bulletin) {
    // Should be unreachable — App only routes here when bulletin exists —
    // but if it ever isn't, don't strand the player on a blank screen.
    onContinue();
    return null;
  }
  const others = Object.values(CAMPAIGNS).filter((oc) => oc.id !== c.id);
  const paperFont = "'Playfair Display', serif";
  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: "#1a1712" }}>
      <div className="flex-1 p-6 flex items-center">
        <div className="w-full mx-auto" style={{ backgroundColor: "#f2ecdc", border: "1px solid #1a1712", color: "#1a1712", maxWidth: 480 }}>
          {/* Masthead */}
          <div style={{ textAlign: "center", padding: "12px 12px 6px", borderBottom: "4px double #1a1712" }}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 2, display: "flex", justifyContent: "space-between", padding: "0 2px 6px", color: "#4a453c" }}>
              <span>DISPATCH</span>
              <span>{c.NEWSPAPER_SUBHEAD}</span>
            </div>
            <div style={{ fontFamily: paperFont, fontWeight: 900, fontSize: 32, letterSpacing: 1, lineHeight: 0.95 }}>
              {c.NEWSPAPER_MASTHEAD}
            </div>
          </div>
          {/* Dateline bar */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 12px", borderBottom: "1px solid #1a1712", fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 1, color: "#4a453c" }}>
            <span>{node.date}</span>
            <span>SINGLE SHEET</span>
          </div>
          {/* Headline + body */}
          <div style={{ padding: "12px 14px 4px", borderBottom: "2px solid #1a1712" }}>
            <div style={{ fontFamily: paperFont, fontWeight: 700, fontSize: 17, lineHeight: 1.15, textAlign: "center" }}>
              {bulletin.headline}
            </div>
          </div>
          <div style={{ padding: "12px 14px", fontFamily: "'PT Serif', serif", fontSize: 13, lineHeight: 1.55, textAlign: "justify" }}>
            {bulletin.body}
          </div>
          {/* Meanwhile */}
          <div style={{ margin: "0 14px 14px", borderTop: "1px solid #1a1712", paddingTop: 8 }}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: 1.5, color: "#4a453c", marginBottom: 6 }}>
              MEANWHILE
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              {others.map((oc) => {
                const text = bulletin.meanwhile && bulletin.meanwhile[oc.id];
                if (!text) return null;
                return (
                  <div key={oc.id} style={{ flex: 1, borderLeft: "2px solid #6b6152", paddingLeft: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 10.5, fontFamily: "'PT Serif', serif" }}>{oc.shortTag}</div>
                    <div style={{ fontSize: 10, color: "#3a352c", lineHeight: 1.4, marginTop: 2, fontFamily: "'PT Serif', serif" }}>{text}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        <button
          onClick={onContinue}
          className="w-full border-2 font-bold py-3 mx-auto block"
          style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...monoFontStyle(skin), maxWidth: 480 }}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}

// Added round 22 — previously the only persistent read on "what is this
// command actually being judged against" was the raw meter dashboard;
// campaign.thesis and campaign.plannedEnding already existed in CAMPAIGNS
// data but were never surfaced during play, only in documentation outside
// the game itself. This doesn't invent an objectives system with its own
// tracked sub-goals — it's a plain-language, always-one-click-away restatement
// of data the file already carries, collapsed by default for the same
// screen-space reason BACKGROUND is.
function ObjectivesPanel({ campaign, skin }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-l-2 mt-3 pl-3 py-1 text-xs leading-relaxed cursor-pointer"
      style={{ borderColor: skin.accent, ...mutedTextStyle(skin) }}
      onClick={() => setOpen((v) => !v)}
    >
      <div
        className="font-bold tracking-widest mb-1 flex items-center justify-between"
        style={{ ...monoFontStyle(skin), ...accentTextStyle(skin) }}
      >
        <span>OBJECTIVES</span>
        <span>{open ? "▾" : "▸"}</span>
      </div>
      {open && (
        <div>
          <div className="mb-2">{campaign.thesis}</div>
          <div className="mb-2" style={monoFontStyle(skin)}>
            <span className="font-bold">PLANNED TERMINUS: </span>
            {campaign.plannedEnding.title} — {campaign.plannedEnding.date}
          </div>
          <div className="mb-2">
            {campaign.triangleAxes.map((a) => a.label).join(" · ")} track this command's real logistics.
            Zero is the historical baseline — it moves only when a choice diverges from what actually
            happened, in either direction.
          </div>
          {campaign.hardMode && (
            <div style={monoFontStyle(skin)}>
              <span className="font-bold">{campaign.hardMode.capitalName}: </span>
              {campaign.hardMode.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BriefingScreen({ campaignId, nodeId, meters, flags, hardModeEnabled, hardModeValue, instantText, reduceMotion, onChoose, onClose, onOpenMap, onOpenTimeline }) {
  const c = CAMPAIGNS[campaignId];
  const skin = skinFor(c.id);
  const node = c.resolveNode(nodeId, flags, meters);
  const capitalRemaining = c.hardMode.maxCap - hardModeValue;
  // Collapsed by default and reset per node — background is reference
  // material for a player who wants it, not something that should eat
  // screen space on every single decision whether they asked for it or not.
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  useEffect(() => { setBackgroundOpen(false); }, [nodeId]);
  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        {hardModeEnabled && (
          <div className="border-2 p-3 mb-3 flex items-center justify-between" style={{ borderColor: skin.accent }}>
            <div className="text-xs font-bold" style={{ ...monoFontStyle(skin), ...accentTextStyle(skin) }}>
              {c.hardMode.capitalName} — NO REWIND, NO DASHBOARD BELOW THIS POINT
            </div>
            <div className="text-lg tracking-widest" style={accentTextStyle(skin)}>
              {"●".repeat(capitalRemaining)}{"○".repeat(c.hardMode.maxCap - capitalRemaining)}
            </div>
          </div>
        )}
        <TriangleMeters campaign={c} meters={meters} skin={skin} />
        <ObjectivesPanel campaign={c} skin={skin} />
        <div className="flex gap-2 mt-3">
          {c.hasFrontMap !== false && (
            <button
              onClick={onOpenMap}
              className="flex-1 border-2 py-2 text-xs font-bold"
              style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...monoFontStyle(skin) }}
            >
              ▶ VIEW FRONT MAP
            </button>
          )}
          <button
            onClick={onOpenTimeline}
            className="flex-1 border-2 py-2 text-xs font-bold"
            style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...monoFontStyle(skin) }}
          >
            ▶ KEY EVENTS
          </button>
        </div>
        <div className="mt-4">
          <CipherBlock campaign={c} node={node} skin={skin} reduceMotion={reduceMotion} />
        </div>
        <div className="mt-4">
          <div className="text-xs" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>{node.date}</div>
          <div className="text-2xl font-bold mt-1" style={displayFontStyle(skin)}>{node.title}</div>
          <div
            className="inline-block text-xs mt-2 px-2 py-1 border-2 font-bold"
            style={{
              ...monoFontStyle(skin),
              ...primaryTextStyle(skin),
              borderColor: node.historicalRecord ? (skin.dark ? skin.paper : skin.ink) : skin.paperDim,
              borderStyle: node.historicalRecord ? "solid" : "dashed",
            }}
          >
            {node.historicalRecord ? "◆ HISTORICAL RECORD" : "◇ SPECULATIVE — DOWNSTREAM OF DIVERGENCE"}
          </div>
          {node.context && (
            <div
              className="border-l-2 mt-4 pl-3 py-1 text-xs leading-relaxed cursor-pointer"
              style={{ borderColor: skin.accent, ...mutedTextStyle(skin) }}
              onClick={() => setBackgroundOpen((v) => !v)}
            >
              <div className="font-bold tracking-widest mb-1 flex items-center justify-between" style={{ ...monoFontStyle(skin), ...accentTextStyle(skin) }}>
                <span>BACKGROUND</span>
                <span>{backgroundOpen ? "▾" : "▸"}</span>
              </div>
              {backgroundOpen && node.context}
            </div>
          )}
          <TypewriterText text={node.situation} instant={instantText} className="text-sm mt-4 leading-relaxed" />
        </div>
        <div className="mt-6">
          {node.choices.map((choice, i) => (
            <ChoiceCard
              key={i}
              choice={choice}
              skin={skin}
              meters={meters}
              hardMode={c.hardMode}
              hardModeEnabled={hardModeEnabled}
              capitalRemaining={capitalRemaining}
              onChoose={() => onChoose(choice, node)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function OutcomeScreen({ campaignId, resolvedText, aftermath, meters, hardModeValue, hardModeMaxed, hardModeEnabled, deltas, onContinue, onClose }) {
  const c = CAMPAIGNS[campaignId];
  const skin = skinFor(c.id);
  const triangleDeltaEntries = Object.entries(deltas.triangle);
  const hasAnyChange = triangleDeltaEntries.length > 0;
  const axisLabel = (key) => (c.triangleAxes.find((a) => a.key === key) || {}).label || key;
  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-xs tracking-widest" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>OUTCOME</div>
        <div className="text-sm mt-4 leading-relaxed whitespace-pre-line">{resolvedText}</div>

        {aftermath && (
          <div className="border-l-2 mt-5 pl-3 py-1 text-xs leading-relaxed" style={{ borderColor: skin.accent, ...mutedTextStyle(skin) }}>
            <div className="font-bold tracking-widest mb-1" style={{ ...monoFontStyle(skin), ...accentTextStyle(skin) }}>
              WHAT FOLLOWED
            </div>
            {aftermath}
          </div>
        )}

        {/* Explicit delta statement — this is what actually answers "did
            anything change." A bar shifting 1-2 points out of ±10 is easy to
            miss; this isn't. */}
        <div className="border-2 mt-5 p-3 text-xs" style={{ borderColor: skin.accent, ...monoFontStyle(skin) }}>
          {hasAnyChange ? (
            <>
              <div className="font-bold mb-1" style={accentTextStyle(skin)}>METER CHANGE THIS TURN</div>
              {triangleDeltaEntries.map(([key, d]) => (
                <div key={key}>{axisLabel(key).toUpperCase()}: {d > 0 ? `+${d}` : d}</div>
              ))}

            </>
          ) : (
            <div className="font-bold" style={mutedTextStyle(skin)}>NO METER CHANGE — HISTORICAL BASELINE (this was the historical choice, or the meter was already at its ±10 cap)</div>
          )}
        </div>

        <div className="mt-4">
          <TriangleMeters campaign={c} meters={meters} skin={skin} />
        </div>
        {hardModeEnabled && (
          <div className="border-2 border-dashed mt-4 p-3 text-xs" style={{ borderColor: skin.paperDim, ...monoFontStyle(skin) }}>
            <div className="font-bold">{c.hardMode.capitalName}: {"●".repeat(c.hardMode.maxCap - hardModeValue)}{"○".repeat(hardModeValue)} ({c.hardMode.maxCap - hardModeValue} of {c.hardMode.maxCap} remaining)</div>
            {hardModeMaxed && <div className="font-bold mt-1" style={accentTextStyle(skin)}>⚠ COMMAND ENDS HERE</div>}
          </div>
        )}
        <button onClick={onContinue} className="mt-6 w-full font-bold py-3" style={{ ...accentBgStyle(skin), ...displayFontStyle(skin) }}>
          CONTINUE
        </button>
      </div>
    </div>
  );
}

// Real rail connections — the Trans-Siberian main line (Moscow-Ufa-
// Chelyabinsk-Omsk-Krasnoyarsk-Irkutsk-Chita) is not a stylistic choice:
// it's the actual route Kolchak's whole campaign and retreat followed,
// which is exactly why the front map should show it as track, not an
// arbitrary connecting line. Southern lines (Moscow-Orel-Kharkov-
// Ekaterinodar-Novorossiysk, the Donbas network around Yuzovka, the
// Perekop isthmus as Crimea's only land route in) are equally real.
const RAIL_LINES = [
  ["petrograd", "moscow"],
  ["moscow", "warsaw"],
  ["moscow", "orel"],
  ["orel", "kharkov"],
  ["kharkov", "yuzovka"],
  ["kharkov", "ekaterinodar"],
  ["ekaterinodar", "novorossiysk"],
  ["ekaterinodar", "perekop"],
  ["perekop", "sevastopol"],
  ["moscow", "voronezh"],
  ["voronezh", "tsaritsyn"],
  ["tsaritsyn", "saratov"],
  ["saratov", "don"],
  ["don", "ekaterinodar"],
  ["moscow", "ufa"],
  ["ufa", "chelyabinsk"],
  ["chelyabinsk", "omsk"],
  ["omsk", "krasnoyarsk"],
  ["krasnoyarsk", "irkutsk"],
  ["irkutsk", "chita"],
];

// Shared by FrontMapScreen and EndingScreen — one map renderer, not two
// copies of the same rail logic drifting apart over time.
function SituationMapSvg({ visitedCityIds, currentCityId, skin, compact = false, atDate = null }) {
  function RailSegment({ a, b, active }) {
    const p1 = CITIES[a];
    const p2 = CITIES[b];
    if (!p1 || !p2) return null;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(2, Math.floor(len / 18));
    const ties = [];
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const x = p1.x + dx * t;
      const y = p1.y + dy * t;
      const nx = -dy / len;
      const ny = dx / len;
      ties.push(
        <line
          key={i}
          x1={x - nx * 4}
          y1={y - ny * 4}
          x2={x + nx * 4}
          y2={y + ny * 4}
          stroke={active ? skin.accent : skin.paperDim}
          strokeWidth={active ? 1.5 : 1}
          opacity={active ? 0.8 : 0.4}
        />
      );
    }
    return (
      <g>
        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={active ? skin.accent : skin.paperDim} strokeWidth={active ? 2 : 1.2} opacity={active ? 0.9 : 0.45} />
        {ties}
      </g>
    );
  }

  // Label geometry per anchor. Sizes are tuned for a ~380px-wide phone
  // viewport, where the old 11px-on-a-1000-unit-viewBox labels rendered
  // at roughly 4 physical pixels — legible on a desktop preview and not
  // on the device anyone actually plays this on. Shrunk from the old
  // schematic map's sizes (16/19px gaps) for Round 22's real-geography
  // map: several real clusters (Perekop/Sevastopol, Novorossiysk/
  // Ekaterinodar, the Don/Yuzovka, Petrograd/Kronstadt) sit only a few
  // real-world km apart, far closer than the old hand-spread schematic
  // ever placed them — smaller text is what keeps those readable rather
  // than mashed together, on top of the anchor choices below that already
  // point each pair's label away from its nearest neighbour.
  function labelPos(city, big) {
    const gap = big ? 12 : 9;
    let p;
    switch (city.anchor) {
      case "w":
        p = { x: city.x - gap, y: city.y + 5, textAnchor: "end" };
        break;
      case "n":
        p = { x: city.x, y: city.y - gap, textAnchor: "middle" };
        break;
      case "s":
        p = { x: city.x, y: city.y + gap + 8, textAnchor: "middle" };
        break;
      default:
        p = { x: city.x + gap, y: city.y + 5, textAnchor: "start" };
        break;
    }
    // Manual nudge for the handful of real clusters where anchor choice
    // alone can't separate two labels — Novorossiysk/Ekaterinodar sit
    // ~12 projected units (~85km) apart, closer together than either
    // label's own text width at any legible font size. A leader-line-free
    // offset (still anchored conceptually to the marker, just pushed
    // further along the same general direction) is the standard
    // cartographic fix for a real dense cluster, and is a display-only
    // nudge — it doesn't move the marker itself or change its geography.
    if (city.labelNudge) {
      p = { ...p, x: p.x + city.labelNudge[0], y: p.y + city.labelNudge[1] };
    }
    return p;
  }

  // Zone-of-control fill per city, evaluated live from the same
  // controlAt() the markers use — see ZONE_CELLS's own comment for why
  // this is a Voronoi tessellation of verified points rather than a
  // hand-drawn front line. Kept at low opacity so the real coastline (and
  // the city markers on top of it) stay the primary read.
  const zoneOpacity = skin.dark ? 0.38 : 0.30;

  return (
    <svg viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`} className="w-full h-auto" style={{ backgroundColor: skin.dark ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.03)" }}>
      {/* Round 23: contested zones and markers get a diagonal-hatch pattern
          on top of their fill, not just a different hue. CONTROL_COLORS.red
          (#b03a2e) and .contested (#b8860b) are the pair most likely to
          collapse under red-green colorblindness, and until now status on
          this map was color-only — nothing else distinguished them. The
          hatch also happens to fit the existing mapVoice copy ("amber where
          it changed hands too often to say") better than a flat fill did:
          visibly unsettled, not just differently colored. */}
      <defs>
        <pattern id="contestedHatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <rect width="6" height="6" fill={CONTROL_COLORS.contested} fillOpacity={zoneOpacity} />
          <line x1="0" y1="0" x2="0" y2="6" stroke={skin.dark ? "#000" : "#fff"} strokeWidth="2" opacity="0.35" />
        </pattern>
      </defs>
      {/* Real geography, bottom to top: bare land, then zone-of-control
          shading (Voronoi cells clipped to land, coloured by who's known
          to have held the nearest city as of this date), then real
          coastline/lake water on top so nothing bleeds into the sea. */}
      <path d={LAND_PATH} fill={skin.dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.035)"} stroke="none" />
      {Object.entries(ZONE_CELLS).map(([cid, d]) => {
        const city = CITIES[cid];
        if (!city || !d) return null;
        const side = controlAt(city, atDate);
        const sideColor = CONTROL_COLORS[side] || CONTROL_COLORS.unknown;
        const fillValue = side === "contested" ? "url(#contestedHatch)" : sideColor;
        return <path key={cid} d={d} fill={fillValue} fillOpacity={side === "contested" ? 1 : zoneOpacity} fillRule="evenodd" stroke="none" />;
      })}
      {WATER_PATHS.map((d, i) => (
        <path key={i} d={d} fill={skin.dark ? "rgba(120,150,180,0.22)" : "rgba(70,110,150,0.16)"} fillRule="evenodd" stroke="none" />
      ))}
      <text x="130" y="355" fontSize="12" fill={skin.paperDim} style={{ fontFamily: skin.monoFont }} opacity="0.7">BLACK SEA</text>
      <text x="342" y="345" fontSize="11" fill={skin.paperDim} style={{ fontFamily: skin.monoFont }} opacity="0.7">CASPIAN SEA</text>
      <text x="880" y="160" fontSize="10" fill={skin.paperDim} style={{ fontFamily: skin.monoFont }} opacity="0.7">L. BAIKAL</text>

      {/* No drawn theatre boundary or divider — the coastline is the real
          one now, so a fictional frame would only compete with it. The
          west/east labelling that boundary used to carry moves to plain
          floating labels near each cluster instead. */}
      <text x="70" y="24" fontSize="12" fill={skin.paperDim} style={{ fontFamily: skin.monoFont }} opacity="0.8">SOUTH RUSSIA &amp; UKRAINE</text>
      <text x="560" y="24" fontSize="12" fill={skin.paperDim} style={{ fontFamily: skin.monoFont }} opacity="0.8">THE TRANS-SIBERIAN — EASTERN FRONT</text>

      {/* Staff-map furniture: north arrow and a rough scale, both against a
          small backing plate now that they can sit over coloured zones
          rather than empty margin. Scale recomputed for the real
          projection: uniform ~7.0 km per unit at this map's standard
          parallel, so 500 miles (~805 km) is ~115 units. */}
      <g opacity="0.85">
        <rect x="932" y="278" width="52" height="56" fill={skin.dark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.55)"} stroke="none" />
        <line x1="958" y1="326" x2="958" y2="290" stroke={skin.paperDim} strokeWidth="1.5" />
        <path d="M 958 284 L 953 296 L 963 296 Z" fill={skin.paperDim} />
        <text x="958" y="342" fontSize="13" textAnchor="middle" fill={skin.paperDim} style={{ fontFamily: skin.monoFont }}>N</text>
      </g>
      <g opacity="0.85">
        <rect x="770" y="332" width="130" height="26" fill={skin.dark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.55)"} stroke="none" />
        <line x1="778" y1="344" x2="893" y2="344" stroke={skin.paperDim} strokeWidth="1.5" />
        <line x1="778" y1="338" x2="778" y2="350" stroke={skin.paperDim} strokeWidth="1.5" />
        <line x1="835" y1="340" x2="835" y2="348" stroke={skin.paperDim} strokeWidth="1" />
        <line x1="893" y1="338" x2="893" y2="350" stroke={skin.paperDim} strokeWidth="1.5" />
        <text x="835" y="356" fontSize="11" textAnchor="middle" fill={skin.paperDim} style={{ fontFamily: skin.monoFont }}>APPROX. 500 MILES</text>
      </g>

      {RAIL_LINES.map(([a, b]) => {
        const active = visitedCityIds.includes(a) && visitedCityIds.includes(b);
        return <RailSegment key={`${a}-${b}`} a={a} b={b} active={active} />;
      })}
      {Object.entries(CITIES).map(([cid, city]) => {
        const visited = visitedCityIds.includes(cid);
        const isCurrent = cid === currentCityId;
        if (compact && !visited) return null;
        const lp = labelPos(city, isCurrent);
        const fontSize = isCurrent ? 14 : visited ? 12 : 10.5;
        const r = markerRadius(city);
        const side = controlAt(city, atDate);
        const sideColor = CONTROL_COLORS[side] || CONTROL_COLORS.unknown;
        // Visited places are filled with the controlling side's colour.
        // Unvisited ones are outlined in it — so the front is readable
        // across the whole map, while the command's own track still reads
        // as the darker, solid one.
        const fill = visited ? sideColor : hexToRgba(sideColor, 0.28);
        const stroke = sideColor;
        const strokeW = isCurrent ? 3.5 : visited ? 2 : 2.25;
        // Round 23: contested markers also get a dashed stroke, the same
        // non-color signal as the hatched zone fill above — see that
        // comment for why color alone wasn't enough here.
        const strokeDash = side === "contested" ? "3 2" : undefined;
        return (
          <g key={cid}>
            {/* Current location gets a ring so it's findable at a glance
                without hunting for the largest marker — necessary now that
                marker size means population, not importance to this run. */}
            {isCurrent && (
              <circle cx={city.x} cy={city.y} r={r + 9} fill="none" stroke={skin.accent} strokeWidth="1.5" opacity="0.55" />
            )}
            {city.kind === "region" ? (
              // Host territory, not a settlement — drawn as a diamond so it
              // never reads as a town with an implied population.
              <path
                d={`M ${city.x} ${city.y - 8} L ${city.x + 8} ${city.y} L ${city.x} ${city.y + 8} L ${city.x - 8} ${city.y} Z`}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeW}
                strokeDasharray={strokeDash}
              />
            ) : city.kind === "fortification" ? (
              // Fortified position — a square. Perekop mattered for where it
              // was, not for how many people lived there.
              <rect
                x={city.x - 6}
                y={city.y - 6}
                width="12"
                height="12"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeW}
                strokeDasharray={strokeDash}
              />
            ) : (
              <circle
                cx={city.x}
                cy={city.y}
                r={r}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeW}
                strokeDasharray={strokeDash}
              />
            )}
            {/* Halo stroke behind the label keeps it readable where it has
                to cross a rail line. */}
            <text
              x={lp.x}
              y={lp.y}
              textAnchor={lp.textAnchor}
              fontSize={fontSize}
              fontWeight={isCurrent || visited ? 700 : 400}
              stroke={skin.dark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.85)"}
              strokeWidth="3.5"
              strokeLinejoin="round"
              fill="none"
              style={{ fontFamily: skin.monoFont }}
            >
              {city.name}
            </text>
            <text
              x={lp.x}
              y={lp.y}
              textAnchor={lp.textAnchor}
              fontSize={fontSize}
              fontWeight={isCurrent || visited ? 700 : 400}
              fill={visited ? (skin.dark ? skin.paper : skin.ink) : skin.paperDim}
              style={{ fontFamily: skin.monoFont }}
            >
              {city.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================================
// CIVILWAR_MAP_NOTES — Round 22 map rebuild: what changed and why.
//
// Through Round 21 the Front Map was a hand-placed schematic: CITIES held
// invented x/y on a 1000x440 canvas, with a drawn dashed "theatre boundary"
// and two freehand sea blobs standing in for real geography. Craig asked
// for "a real historical coloured svg map like we've done for Dispatches
// 1940." Before building anything, that request got checked against what's
// actually true of the two titles rather than assumed equivalent:
//
//   - 1940's Checkpoint Map (see dispatches-1940-specs.md) is built from
//     Python matplotlib/basemap + shapely, with per-country region polygons
//     mostly dissolved straight from MODERN country borders — only Poland/
//     Germany/Czechoslovakia/Hungary needed hand-authoring to their WWII-era
//     shapes, because WWII fronts mostly still ran along recognizable
//     national borders. None of that pipeline or its output exists in this
//     environment; it isn't a port, it's a from-scratch build.
//   - The Russian Civil War doesn't have that shortcut. Fronts ran through
//     gubernias and rail corridors, not countries — modern Russia/Ukraine
//     borders are nearly useless as a source of 1918-21 region shapes, so
//     matching 1940 region-for-region would mean hand-authoring ~20+
//     boundaries with no existing taxonomy, a materially bigger and riskier
//     undertaking than 1940 was.
//
// Asked to choose the scope with that tradeoff stated plainly, Craig picked
// the middle option: real coastline/geography as the backdrop, plus broad
// zone-of-control shading rather than 1940's fine per-region system. What
// got built:
//
//   1. CITIES coordinates are no longer invented. Every one of the 21
//      places was looked up individually (Wikipedia infobox coordinates,
//      not guessed) and projected with a standard equirectangular
//      projection at a 53°N standard parallel -- true scale along every
//      meridian and along that parallel, the ordinary honest choice for a
//      mid-latitude regional map, and (conveniently) also the more legible
//      one: a degree of longitude really is shorter than a degree of
//      latitude this far north, so the geographically correct compression
//      also keeps the map from being an unreadable sliver on a phone.
//      "don" uses Novocherkassk (the historical Don Host capital) as its
//      point, since "The Don" was never a settlement.
//   2. WATER_PATHS / LAND_PATH are real coastline, ocean, and major-lake
//      geometry -- Natural Earth 50m data, fetched fresh from the
//      nvkelso/natural-earth-vector GitHub mirror (verified reachable from
//      this environment) and clipped/simplified to the map's extent.
//      Worth recording one non-obvious find: Natural Earth's dedicated
//      *coastline* layer does NOT include the Caspian Sea's shoreline at
//      all (checked directly, not assumed) -- the Caspian only appears in
//      the *ocean* polygon layer, which is what WATER_PATHS is actually
//      built from.
//   3. ZONE_CELLS is deliberately NOT a hand-drawn front line. A front line
//      between two verified points is new geography this project hasn't
//      verified -- precisely the kind of guess "verify, don't guess" exists
//      to rule out. Instead each city gets a Voronoi cell ("closer to this
//      city than to any other city on the map," clipped to the land
//      polygon), computed once from the same 21 verified positions. Colour
//      is applied live in SituationMapSvg from controlAt(city, atDate) --
//      the SAME function and the SAME control-by-date data the city
//      markers already used pre-Round-22. No new historical claim was
//      introduced; an existing verified fact was extended into a
//      tessellation, an honest technique rather than an invented boundary.
//   4. The drawn dashed "theatre boundary" and the freehand sea blobs are
//      gone -- a fictional frame over real coastline would only compete
//      with it. The orientation labels that boundary used to carry
//      ("SOUTH RUSSIA" / "EASTERN FRONT") are now plain floating text near
//      each cluster instead.
//
// What this is NOT: a claim about where any front line precisely ran on
// any given date. The zone shading is nearest-known-point shading, and
// FrontMapScreen's own in-world copy still says so ("Distances are
// approximate; the line positions are not surveyed").
// ============================================================================

// Added round 22, alongside the real-geography Voronoi zone shading. The
// zone fills and city-marker colours were already explained in prose inside
// mapVoice.body below, but a paragraph is not something a player glances at
// mid-decision — a compact swatch key next to the map itself is. "Own"/
// "enemy" swap per campaign coalition (bolsheviks reads Red as itself,
// white/siberia read White as itself) rather than hard-coding "white"/"red"
// as fixed labels.
function MapLegendRow({ campaignId, skin }) {
  const ownSide = CAMPAIGNS[campaignId].coalition; // "white" or "red"
  const enemySide = ownSide === "red" ? "white" : "red";
  const ownLabel = campaignId === "bolsheviks" ? "THE REPUBLIC — YOUR FORCES" : "AFSR / OWN FORCES — YOUR COMMAND";
  const enemyLabel = campaignId === "bolsheviks" ? "THE WHITES" : "THE RED ARMY";
  const items = [
    { color: CONTROL_COLORS[ownSide], label: ownLabel },
    { color: CONTROL_COLORS[enemySide], label: enemyLabel },
    // Round 23: hatched, not just colored — matches the diagonal-hatch fill
    // and dashed marker outline the map itself now uses for contested
    // territory, so the legend swatch actually previews what's on the map
    // rather than promising a solid color the map doesn't use anymore. See
    // SituationMapSvg's own comment for why (red/contested collapse under
    // red-green colorblindness with color as the only signal).
    { color: CONTROL_COLORS.contested, hatched: true, label: "CONTESTED — CHANGED HANDS THIS MONTH" },
    { color: CONTROL_COLORS.other, label: "OTHER FORCES — NATIONALIST, ALLIED, OR HOST-GOVERNED" },
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 px-1">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1.5">
          <span
            style={{
              width: 10,
              height: 10,
              minWidth: 10,
              background: it.hatched
                ? `repeating-linear-gradient(45deg, ${it.color}, ${it.color} 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 3px)`
                : it.color,
              display: "inline-block",
              border: it.hatched ? "1px dashed rgba(0,0,0,0.55)" : "1px solid rgba(0,0,0,0.35)",
            }}
          />
          <span className="text-[10px]" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
            {it.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function FrontMapScreen({ campaignId, visitedNodes, skin, onClose }) {
  const c = CAMPAIGNS[campaignId];
  const visitedCityIds = [];
  for (const nid of visitedNodes) {
    const cid = NODE_TO_CITY[nid];
    if (cid && !visitedCityIds.includes(cid)) visitedCityIds.push(cid);
  }
  const currentCityId = visitedCityIds[visitedCityIds.length - 1];
  const currentCity = CITIES[currentCityId];
  // Control on this map is shown as of the situation the player is actually
  // looking at, not as of some fixed date — these cities changed hands
  // repeatedly, and a single snapshot would be wrong for most of the war.
  const currentNodeId = visitedNodes[visitedNodes.length - 1];
  const currentNode = currentNodeId ? c.resolveNode(currentNodeId, {}, {}) : null;
  const atDate = dateToYYYYMM(currentNode && currentNode.date);

  // In-world framing per command. The map is a thing a staff officer put on
  // the table, not a progress tracker — so the copy is addressed to the
  // commander reading it, and says what the marks mean in operational
  // terms rather than in terms of nodes, runs, and content.
  const mapVoice = {
    southRussia: {
      heading: "OPERATIONS SECTION — SITUATION AS PLOTTED",
      body:
        "Sketched from telegraph traffic and whatever the rail staff could confirm this morning, sir. Distances are approximate; the line positions are not surveyed and should not be read as such. Marks are drawn to the size of the place, sir — Moscow and Petrograd are what they are, and Perekop is a square because it is a position and not a town. The Don is marked as host country, not a city. Colour is who held it as of this date: our own in blue, the Reds in red, amber where it changed hands too often that month to say. Filled marks are where your orders have already reached; open ones are the war other men are fighting. The track drawn is the track that exists, and runs bright where both ends are within your movements.",
      footer: "The Kuban and the Don are behind you. Everything north of Kharkov is a question of how far the rails hold.",
    },
    siberia: {
      heading: "STAFF SECTION — SITUATION AS PLOTTED",
      body:
        "Compiled from station reports, Supreme Ruler, and they arrive a day late at best. Distances approximate. Marks are sized to the place itself, Supreme Ruler — Omsk against Chita tells you something the old map did not. Colour is who held it as of this date: ours in blue, Red in red, amber where it turned over faster than a report can follow. Filled marks are the points your own command has answered for; open ones are the rest of the war. The line drawn east is the Trans-Siberian itself: one track, every echelon competing for it, bright where both ends lie within your movement.",
      footer: "Everything depends on the single line east. There is no second route and no road worth the name.",
    },
    bolsheviks: {
      heading: "OPERATIONS SECTION — SITUATION AS PLOTTED",
      body:
        "Plotted from front telegrams and rail dispatches, comrade. Distances rough — this is not a survey map and the Republic has no time to make one. Marks are sized to the place, comrade — Moscow and Petrograd carry the weight the Republic actually rests on. Colour is who holds each as of this date: the Republic in red, the Whites in blue, amber where the month is too confused to call. Filled marks are where the Council's own decisions have landed; open ones are the rest of the war, real and ongoing. The track shown is the network as it stands, bright where both ends lie within your operations.",
      footer: "Moscow at the centre, and every front a spoke off it. That is the whole problem of this war in one drawing.",
    },
  }[c.id];

  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-2xl font-bold" style={displayFontStyle(skin)}>{c.label}</div>
        <div className="text-xs mt-1" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          {mapVoice.heading}
        </div>

        {currentCity && (
          <div
            className="border-2 mt-4 px-3 py-2 text-xs"
            style={{ borderColor: skin.accent, ...monoFontStyle(skin) }}
          >
            <span style={mutedTextStyle(skin)}>PRESENT POSITION OF COMMAND — </span>
            <span className="font-bold" style={accentTextStyle(skin)}>{currentCity.name.toUpperCase()}</span>
            <span style={mutedTextStyle(skin)}>
              {"  ·  "}{visitedCityIds.length} {visitedCityIds.length === 1 ? "position" : "positions"} on the record
            </span>
          </div>
        )}

        <div className="border-2 mt-3" style={{ borderColor: skin.accent }}>
          <SituationMapSvg visitedCityIds={visitedCityIds} currentCityId={currentCityId} skin={skin} atDate={atDate} />
        </div>

        <MapLegendRow campaignId={c.id} skin={skin} />

        <div className="text-xs mt-3 leading-relaxed" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          {mapVoice.body}
        </div>
        <div className="text-xs mt-3 leading-relaxed italic" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          {mapVoice.footer}
        </div>

        <button onClick={onClose} className="mt-6 w-full border-2 font-bold py-3" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...monoFontStyle(skin) }}>
          RETURN TO COMMAND
        </button>
      </div>
    </div>
  );
}

/**
 * Round 23 — the "Context/Key Events timeline" named in the file's own
 * BACKLOG comment as still-missing. Scope, stated plainly: this lists the
 * situations this run has actually passed through, in order, with date and
 * title — a legible record of the sequence, replacing "scroll the front
 * map's marker list and infer it." It does NOT reconstruct and display
 * which literal choice text was clicked at each stop (that would mean
 * matching current flags back against each node's choices' setFlags, which
 * gets genuinely ambiguous once an uncertain roll's own setFlags are mixed
 * in on top of the base choice's) — the date+title sequence is what's
 * actually reliable to show, and is what "timeline" means here.
 */
function TimelineScreen({ campaignId, visitedNodes, flags, meters, skin, onClose }) {
  const c = CAMPAIGNS[campaignId];
  const entries = visitedNodes
    .map((nid) => {
      let node;
      try {
        node = c.resolveNode(nid, flags, meters);
      } catch (e) {
        node = null;
      }
      if (!node) return null;
      return { id: nid, date: node.date, title: node.title, historicalRecord: node.historicalRecord, isEnding: !!node.isEnding };
    })
    .filter(Boolean);
  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-2xl font-bold" style={displayFontStyle(skin)}>{c.label}</div>
        <div className="text-xs mt-1" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          KEY EVENTS — THIS RUN, IN ORDER
        </div>
        <div className="text-xs mt-2 leading-relaxed" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          Every situation this command has actually been in, in the order it reached them —
          {" "}{entries.length} so far.
        </div>

        <div className="mt-4">
          {entries.map((e, i) => (
            <div key={`${e.id}-${i}`} className="flex gap-3 py-2" style={{ borderBottom: i < entries.length - 1 ? `1px solid ${skin.paperDim}` : "none" }}>
              <div className="flex-shrink-0 w-5 text-right" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin), fontSize: 11 }}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="text-xs" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
                  {e.date}
                  {e.isEnding && <span style={accentTextStyle(skin)}> · ENDING</span>}
                </div>
                <div className="font-bold" style={displayFontStyle(skin)}>{e.title}</div>
              </div>
              <div className="flex-shrink-0 text-xs" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
                {e.historicalRecord ? "◆" : "◇"}
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="mt-6 w-full border-2 font-bold py-3" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...monoFontStyle(skin) }}>
          RETURN TO COMMAND
        </button>
      </div>
    </div>
  );
}

function EndStubScreen({ onClose }) {
  return (
    <div className="bg-black min-h-full text-white">
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="border-2 border-dashed border-white/40 p-6 font-mono text-sm">
          DEMO CHAIN ENDS HERE. This branch hasn't reached a written ending yet —
          the node graph runs out before its planned endpoint. Not every path
          through every campaign has a real ending written; check
          ENDINGS_GALLERY for which ones do.
        </div>
        <button onClick={onClose} className="mt-6 w-full border-2 border-white font-mono font-bold py-3">
          RETURN TO RECORDS
        </button>
      </div>
    </div>
  );
}

function EndingScreen({ campaignId, endingId, flags, visitedNodes, instantText, onClose }) {
  const c = CAMPAIGNS[campaignId];
  const skin = skinFor(c.id);
  const ending = c.resolveNode(endingId, flags);
  const isHistorical = ending.classification === "historical";
  const visitedCityIds = [];
  for (const nid of [...visitedNodes, endingId]) {
    const cid = NODE_TO_CITY[nid];
    if (cid && !visitedCityIds.includes(cid)) visitedCityIds.push(cid);
  }
  const finalCityId = NODE_TO_CITY[endingId] || visitedCityIds[visitedCityIds.length - 1];
  // Three endings carry a "DATE VARIES — ..." string rather than a month,
  // because they trigger on an accumulated condition rather than at a fixed
  // point. Those won't parse, and an unparsed date would grey out every
  // marker on the map. Fall back to the last dated node the player actually
  // passed through, which is the correct answer anyway: that IS when this
  // run ended.
  let endingDate = dateToYYYYMM(ending && ending.date);
  if (endingDate == null) {
    for (let i = visitedNodes.length - 1; i >= 0; i--) {
      const n = c.resolveNode(visitedNodes[i], flags, {});
      const d = dateToYYYYMM(n && n.date);
      if (d != null) { endingDate = d; break; }
    }
  }
  return (
    <div className="min-h-full" style={screenStyle(skin)}>
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-xs tracking-widest" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
          {ending.date} — ENDING REACHED
        </div>
        <div className="text-3xl font-bold mt-2" style={displayFontStyle(skin)}>{ending.title}</div>
        <div
          className="inline-block text-xs mt-3 px-2 py-1 border-2 font-bold"
          style={{
            ...monoFontStyle(skin),
            ...primaryTextStyle(skin),
            borderColor: isHistorical ? (skin.dark ? skin.paper : skin.ink) : skin.paperDim,
            borderStyle: isHistorical ? "solid" : "dashed",
          }}
        >
          {ending.badge}
        </div>
        {finalCityId && (
          <div className="border-2 mt-5" style={{ borderColor: skin.paperDim }}>
            <SituationMapSvg visitedCityIds={visitedCityIds} currentCityId={finalCityId} skin={skin} compact atDate={endingDate} />
            <div className="text-xs px-3 py-2" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>
              WHERE THIS COMMAND'S STORY ENDS: {CITIES[finalCityId]?.name?.toUpperCase()}
            </div>
          </div>
        )}
        <TypewriterText text={ending.epilogue} instant={instantText} className="text-sm mt-5 leading-relaxed whitespace-pre-line" />
        <button onClick={onClose} className="mt-8 w-full font-bold py-3" style={{ ...accentBgStyle(skin), ...displayFontStyle(skin) }}>
          RETURN TO RECORDS
        </button>
      </div>
    </div>
  );
}

function WarRecordScreen({ onClose, onOpenSection, discovery }) {
  const totalNodes = Object.values(CAMPAIGNS).reduce((sum, c) => sum + c.NODE_ATLAS.length, 0);
  const totalEndings = Object.values(CAMPAIGNS).reduce((sum, c) => sum + c.ENDINGS_GALLERY.length, 0);
  // Round 23: counts against the persistent discovery log, not the raw
  // written total — this is what "not what a given save has actually
  // reached" in the file's own BACKLOG note meant. discoveredNodes/Endings
  // is {} until a run has actually been played in this browser.
  const discoveredNodes = Object.values(discovery.nodes || {}).reduce((sum, byId) => sum + Object.keys(byId).length, 0);
  const discoveredEndings = Object.values(discovery.endings || {}).reduce((sum, byId) => sum + Object.keys(byId).length, 0);
  // Same field-dossier shell as the main menu and Settings — this screen is
  // reached directly from the menu and previously sat on stark black, which
  // read as a different application.
  const stampRed = "#8a1f1f";
  const ink = "#1a1712";
  const mono = "'Courier Prime', monospace";
  const rows = [
    { key: "atlas", label: "DISCOVERY ATLAS", detail: `${discoveredNodes} of ${totalNodes} situation reports discovered` },
    { key: "endingsgallery", label: "ENDINGS GALLERY", detail: `${discoveredEndings} of ${totalEndings} named endings reached` },
    { key: "dossiers", label: "COMMAND DOSSIERS", detail: "The advisors, and what became of them" },
    { key: "glossary", label: "GLOSSARY", detail: "Terms & abbreviations" },
    { key: "howtoread", label: "HOW TO READ THE REPORTS", detail: "Badges, meters, and what the odds mean" },
  ];
  return (
    <div style={{ background: "#f2ecdc", minHeight: "100%" }}>
      <TopBar title="dispatches-1922" onClose={onClose} />

      <div style={{ padding: "16px 16px 10px", borderBottom: `2px double ${ink}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 9, letterSpacing: 2, color: "#6b6150", marginBottom: 8 }}>
          <span>FILE NO. 1922</span>
          <span style={{ color: stampRed }}>WAR RECORD</span>
        </div>
        <div style={{ fontFamily: BODY_FONT, fontWeight: 900, fontSize: 30, color: ink, lineHeight: 1 }}>
          THE WAR RECORD
        </div>
      </div>

      <div style={{ padding: "14px 16px 32px" }}>
        {rows.map((r) => (
          <div
            key={r.key}
            onClick={() => onOpenSection(r.key)}
            style={{
              background: "#e9e1cc",
              border: `1px solid ${ink}`,
              padding: "12px 14px",
              marginBottom: 10,
              cursor: "pointer",
            }}
          >
            <div style={{ fontFamily: BODY_FONT, fontWeight: 700, fontSize: 16, color: ink }}>
              {r.label}
            </div>
            <div style={{ fontFamily: mono, fontSize: 10, color: "#5c5647", marginTop: 2 }}>
              {r.detail}
            </div>
          </div>
        ))}

        <div
          style={{
            height: 3,
            margin: "14px 0",
            background: `repeating-linear-gradient(90deg, ${stampRed}, ${stampRed} 5px, transparent 5px, transparent 10px)`,
          }}
        />

        <div style={{ fontFamily: mono, fontSize: 10, color: "#6b6252", lineHeight: 1.55 }}>
          Round 22: a RESUME COMMAND now saves your last run (one slot, this browser only —
          not multiple save slots), and the OBJECTIVES panel on every situation report restates
          the campaign's own thesis and terminus in plain language. Round 23: the atlas and
          endings gallery below now track what THIS browser has actually discovered, across
          every run you've played here — not just the run in progress, and not everything
          ever written. Still local to this browser only: the discovery log lives in the same
          storage as the save, so a different device or a cleared browser starts it over.
        </div>
      </div>
    </div>
  );
}

function DiscoveryAtlasScreen({ onClose, discovery }) {
  return (
    <div className="bg-stone-50 min-h-full">
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-2xl font-bold mb-4" style={{ fontFamily: BODY_FONT }}>Discovery Atlas</div>
        {Object.values(CAMPAIGNS).map((c) => {
          const skin = skinFor(c.id);
          const found = discovery.nodes[c.id] || {};
          const foundCount = c.NODE_ATLAS.filter((n) => found[n.id]).length;
          return (
            <div key={c.id} className="mb-6">
              <div className="inline-block border-2 font-bold px-3 py-1 text-sm mb-2" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...displayFontStyle(skin) }}>
                {c.shortTag}
              </div>
              <div className="font-mono text-xs text-stone-500 mb-2">{foundCount} OF {c.NODE_ATLAS.length} SITUATION REPORTS DISCOVERED</div>
              {c.NODE_ATLAS.map((n) => {
                const isFound = !!found[n.id];
                return (
                  <div key={n.id} className="border-b border-stone-300 py-2 flex items-center justify-between" style={{ opacity: isFound ? 1 : 0.45 }}>
                    <div>
                      <div className="font-mono text-xs text-stone-500">{isFound ? n.date : "UNDATED"}</div>
                      <div className="font-bold" style={{ fontFamily: BODY_FONT }}>{isFound ? n.title : "Not yet reached"}</div>
                    </div>
                    <div className="font-mono text-xs text-stone-500 flex-shrink-0 pl-2">{isFound ? "●" : "○"}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EndingsGalleryScreen({ onClose, discovery }) {
  return (
    <div className="bg-stone-50 min-h-full">
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-2xl font-bold mb-4" style={{ fontFamily: BODY_FONT }}>Endings Gallery</div>
        {Object.values(CAMPAIGNS).map((c) => {
          const skin = skinFor(c.id);
          const found = discovery.endings[c.id] || {};
          const foundCount = c.ENDINGS_GALLERY.filter((e) => found[e.id]).length;
          return (
            <div key={c.id} className="mb-6">
              <div className="inline-block border-2 font-bold px-3 py-1 text-sm mb-2" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...displayFontStyle(skin) }}>
                {c.shortTag}
              </div>
              <div className="font-mono text-xs text-stone-500 mb-2">{foundCount} OF {c.ENDINGS_GALLERY.length} ENDINGS REACHED</div>
              {c.ENDINGS_GALLERY.map((e) => {
                const isFound = !!found[e.id];
                return (
                  <div key={e.id} className="border-b border-stone-300 py-2 flex items-center justify-between" style={{ opacity: isFound ? 1 : 0.45 }}>
                    <div className="font-bold" style={{ fontFamily: BODY_FONT }}>{isFound ? e.title : "Not yet reached"}</div>
                    <div className="font-mono text-xs text-stone-500 flex-shrink-0 pl-2">
                      {isFound ? (e.classification === "historical" ? "◆ HISTORICAL" : "◇ SPECULATIVE") : "○"}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GlossaryScreen({ onClose }) {
  return (
    <div className="bg-stone-50 min-h-full">
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-2xl font-bold mb-1" style={{ fontFamily: BODY_FONT }}>Glossary</div>
        <div className="font-mono text-xs text-stone-500 mb-6 leading-relaxed">
          Terms used elsewhere in this game, alphabetical, shared across all three campaigns rather than sorted by side — the vocabulary here mostly doesn't respect which command you're playing.
        </div>
        {GLOSSARY.map((g, i) => (
          <div key={i} className="border-b border-stone-300 py-3">
            <div className="font-bold text-sm tracking-wide" style={{ fontFamily: BODY_FONT }}>{g.term}</div>
            <div className="font-mono text-xs text-stone-600 mt-1 leading-relaxed">{g.definition}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommandDossiersScreen({ onClose }) {
  return (
    <div className="bg-stone-50 min-h-full">
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-2xl font-bold mb-4" style={{ fontFamily: BODY_FONT }}>Command Dossiers</div>
        {Object.values(CAMPAIGNS).map((c) => {
          const skin = skinFor(c.id);
          const advisors = Object.values(c.ADVISOR_DOSSIERS).sort((a, b) => a.rank - b.rank);
          return (
            <div key={c.id} className="mb-6">
              <div className="inline-block border-2 font-bold px-3 py-1 text-sm mb-2" style={{ ...accentBorderStyle(skin), ...accentTextStyle(skin), ...displayFontStyle(skin) }}>
                {c.shortTag}
              </div>
              {advisors.map((a, i) => (
                <div key={i} className="border-b border-stone-300 py-3">
                  <div className="font-bold" style={{ fontFamily: BODY_FONT }}>{a.role}</div>
                  <div className="font-mono text-xs text-stone-600 mt-1">{a.bio}</div>
                  <div className="font-mono text-xs text-stone-500 mt-2 italic">{a.fate}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsScreen({ textSize, setTextSize, reduceMotion, setReduceMotion, instantText, setInstantText, soundOn, setSoundOn, musicOn, setMusicOn, onClose }) {
  // Matches the main menu's field-dossier treatment: cream stock, stamp-red
  // section rules, Courier for labels, Playfair for the header. Deliberately
  // NOT a campaign skin — Settings sits outside any campaign, same as the
  // main menu it's reached from.
  const stampRed = "#8a1f1f";
  const ink = "#1a1712";
  const mono = "'Courier Prime', monospace";

  function Row({ label, value, onClick, note, live }) {
    return (
      <div
        style={{
          background: "#e9e1cc",
          border: `1px solid ${ink}`,
          padding: "10px 12px",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: ink, flex: 1 }}>
            {label}
          </div>
          <button
            onClick={onClick}
            style={{
              border: `1px solid ${ink}`,
              background: value === "ON" || (value && value !== "OFF") ? stampRed : "transparent",
              color: value === "ON" || (value && value !== "OFF") ? "#f2ecdc" : ink,
              fontFamily: mono,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              padding: "5px 12px",
              flexShrink: 0,
              minWidth: 74,
              cursor: "pointer",
            }}
          >
            {value}
          </button>
        </div>
        {note && (
          <div style={{ fontFamily: mono, fontSize: 10, color: "#6b6252", marginTop: 6, lineHeight: 1.45 }}>
            {!live && (
              <span style={{ color: stampRed, fontWeight: 700 }}>NOT YET WIRED — </span>
            )}
            {note}
          </div>
        )}
      </div>
    );
  }

  function SectionRule({ children }) {
    return (
      <div style={{ marginTop: 18, marginBottom: 8 }}>
        <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 2, color: stampRed, fontWeight: 700 }}>
          {children}
        </div>
        <div
          style={{
            height: 3,
            marginTop: 4,
            background: `repeating-linear-gradient(90deg, ${stampRed}, ${stampRed} 5px, transparent 5px, transparent 10px)`,
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ background: "#f2ecdc", minHeight: "100%" }}>
      <TopBar title="dispatches-1922" onClose={onClose} />

      <div style={{ padding: "16px 16px 10px", borderBottom: `2px double ${ink}` }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: mono,
            fontSize: 9,
            letterSpacing: 2,
            color: "#6b6150",
            marginBottom: 8,
          }}
        >
          <span>FILE NO. 1922</span>
          <span style={{ color: stampRed }}>STAFF USE</span>
        </div>
        <div style={{ fontFamily: BODY_FONT, fontWeight: 900, fontSize: 30, color: ink, lineHeight: 1 }}>
          SETTINGS
        </div>
      </div>

      <div style={{ padding: "4px 16px 32px" }}>
        <SectionRule>READING</SectionRule>
        <Row
          label="TEXT SIZE"
          value={textSize.toUpperCase()}
          onClick={() => setTextSize((v) => (v === "small" ? "normal" : v === "normal" ? "large" : "small"))}
          live
          note="Rescales the whole application, not just situation text."
        />
        <Row
          label="INSTANT TEXT"
          value={instantText ? "ON" : "OFF"}
          onClick={() => setInstantText((v) => !v)}
          live
          note="Skips the word-by-word reveal on situation and ending text."
        />

        <SectionRule>PRESENTATION</SectionRule>
        <Row
          label="REDUCE MOTION"
          value={reduceMotion ? "ON" : "OFF"}
          onClick={() => setReduceMotion((v) => !v)}
          live
          note="Drops the stamp-tilt transform on dispatch headers and transitions."
        />

        <SectionRule>AUDIO</SectionRule>
        <Row
          label="SOUND EFFECTS"
          value={soundOn ? "ON" : "OFF"}
          onClick={() => setSoundOn((v) => !v)}
          note="Toggle is real and its state persists, but this build ships no audio assets — typewriter, stamp, and dice sounds do not exist yet."
        />
        <Row
          label="MUSIC"
          value={musicOn ? "ON" : "OFF"}
          onClick={() => setMusicOn((v) => !v)}
          note="Same — the switch works, there is nothing behind it."
        />

        <div
          style={{
            marginTop: 22,
            borderTop: `1px solid ${ink}`,
            paddingTop: 10,
            fontFamily: mono,
            fontSize: 10,
            color: "#6b6252",
            lineHeight: 1.55,
          }}
        >
          Every setting above that is not marked otherwise is fully wired. The two audio
          toggles are marked because they are not — they are honest switches attached to
          nothing, kept visible rather than hidden so the gap is legible rather than
          disguised.
        </div>
      </div>
    </div>
  );
}

function HowToReadScreen({ onClose }) {
  const items = [
    ["◆ HISTORICAL RECORD", "This is the choice that was actually made. Its triangle impact is always zero — it's the baseline everything else is measured against, not a reward for picking it."],
    ["◇ SPECULATIVE — DOWNSTREAM OF DIVERGENCE", "A genuine counterfactual, argued from the same evidence as the historical choice, not an invented alternative. Its impact shows how it diverges from what actually happened."],
    ["⚠ CONTESTED — odds shown", "Real historiographical uncertainty, not a random skin on a settled fact. Odds are shown before you choose — known-risk, not a hidden roll."],
    ["Triangle meters (±10, start at 0)", "Zero is the historical baseline for that campaign's three axes. Plus or minus tracks divergence from the record, not an absolute strength score."],
    ["Hard mode meter", "A campaign-specific erosion track, not part of the zero-baseline system. Rises when a subordinate's judgment gets overridden by central authority; at 100 the campaign ends in something other than battlefield defeat."],
  ];
  return (
    <div className="bg-stone-50 min-h-full">
      <TopBar title="dispatches-1922" onClose={onClose} />
      <div className="p-6">
        <div className="text-2xl font-bold mb-4" style={{ fontFamily: BODY_FONT }}>How to Read the Reports</div>
        {items.map(([label, body], i) => (
          <div key={i} className="border-b border-stone-300 py-3">
            <div className="font-mono text-sm font-bold">{label}</div>
            <div className="font-mono text-xs text-stone-600 mt-1">{body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Save / resume — added round 22. Previously flagged as a real gap (see the
// header note and WarRecordScreen's own text, both now stale and updated
// alongside this). Single slot, "your last run" — not save slots, not
// autosave-every-screen. Persisted only at the two screens whose full
// content is reconstructable from {campaignId, nodeId, flags, meters} alone
// (briefing, bulletin) so a resume never has to fake transient text (an
// outcome screen's resolved roll text, for instance, isn't saved and isn't
// meant to be — resuming mid-outcome would need to re-derive a dice roll
// that already happened, which is exactly the kind of save-schema trap the
// header note's 1940 reference warns about). Wrapped in try/catch per this
// environment's localStorage guidance — a viewer in private browsing, or
// with storage blocked, should never see play break because of this.
