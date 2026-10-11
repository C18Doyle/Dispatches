/** Colour themes (src/63-themes.jsx). Every pair of text and ground reaches the WCAG ratio for normal text (4.5 to 1; 7 to 1 in High contrast) in every
 *  theme and for every command, every command has an accent in every theme, and the stylesheet generated from the tokens names them all. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
const HEX = /^#[0-9a-f]{6}$/i;

for (const theme of E.THEME_IDS) {
  const min = E.THEME_MIN_RATIO[theme];
  const t = E.THEME_TOKENS[theme];
  for (const [k, v] of Object.entries(t.base)) if (!HEX.test(v)) problems.push(`${theme}: token ${k} is not #rrggbb (${v})`);
  for (const cid of E.CAMPAIGN_IDS) {
    if (!t.campaigns[cid] || !HEX.test(t.campaigns[cid].accent)) problems.push(`${theme}/${cid}: no accent`);
    const tok = E.tokensFor(theme, cid);
    for (const [fg, bg] of E.THEME_PAIRS) {
      checked++;
      const r = E.contrastRatio(tok[fg], tok[bg]);
      if (r < min) problems.push(`${theme}/${cid}: ${fg} ${tok[fg]} on ${bg} ${tok[bg]} is ${r.toFixed(2)} to 1 (needs ${min})`);
    }
  }
}
// the stylesheet carries every theme and every command
const css = E.themeCss();
for (const theme of ["sepia", "night", "contrast"]) if (!css.includes(`[data-theme="${theme}"] .dg-root{`)) problems.push(`the stylesheet has no rules for ${theme}`);
for (const cid of E.CAMPAIGN_IDS) {
  checked++;
  if (!css.includes(`.dg-root[data-campaign="${cid}"]`)) problems.push(`the stylesheet has no rule for ${cid}`);
  if (!css.includes(`--acc-${cid}:`)) problems.push(`the stylesheet has no --acc-${cid}`);
  if (!E.CAMPAIGN_BANDS[cid]) problems.push(`${cid}: no band`);
}
// the choice of theme
checked++;
if (E.resolveTheme("auto", true, false) !== "night" || E.resolveTheme("auto", false, true) !== "contrast" || E.resolveTheme("auto", false, false) !== "paper" || E.resolveTheme("nonsense", false, false) !== E.DEFAULT_THEME || E.resolveTheme("sepia", false, false) !== "sepia") problems.push("resolveTheme");
if (E.DEFAULT_THEME !== "sepia") problems.push("the default theme is not sepia");
// the Sepia sheet is scoped to its theme and keeps every command on the one ink
checked++;
const sepia = E.sepiaCss();
if (/(^|[,}{])s*.dg-/.test(sepia.replace(/@media[^{]*{/g, "{"))) problems.push("a Sepia rule is not scoped to [data-theme=\"sepia\"]");
for (const cid of E.CAMPAIGN_IDS) if (!sepia.includes(`--acc-${cid}:`)) problems.push(`sepiaCss has no --acc-${cid}`);
if (E.THEME_LABELS.auto === undefined || E.THEME_IDS.some((id) => !E.THEME_LABELS[id])) problems.push("a theme has no label");
process.exit(report("check-themes", problems, checked) ? 1 : 0);
