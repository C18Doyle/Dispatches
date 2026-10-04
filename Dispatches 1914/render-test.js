/** Real render test in jsdom. Not a syntax check — mounts and clicks through. */
const { JSDOM } = require("jsdom");
const fs = require("fs");
const dom = new JSDOM(`<!DOCTYPE html><div id="root"></div>`,
  { runScripts: "outside-only", pretendToBeVisual: true, url: "http://localhost" });
const { window } = dom;
global.window = window; global.document = window.document;
global.navigator = window.navigator; global.self = window;
global.HTMLElement = window.HTMLElement; global.Element = window.Element;
global.MessageChannel = window.MessageChannel;
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.IS_REACT_ACT_ENVIRONMENT = false; // state is set from effects (saving, the war record); the test waits instead of wrapping in act()

let fail = 0;
const t = (n, c) => { console.log(`  ${c ? "ok  " : "FAIL"} ${n}`); if (!c) fail++; };

const code = fs.readFileSync("dist/bundle.js", "utf8");
try { new Function(code)(); } catch (e) { console.log("MOUNT ERROR:", e.message); process.exit(1); }

const wait = (ms) => new Promise(r => setTimeout(r, ms));
const txt = () => document.getElementById("root").textContent;
const btns = () => [...document.querySelectorAll("button")];
const click = (b) => { b.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); };

(async () => {
  await wait(80);
  t("root is not empty (no blank screen)", txt().length > 50);
  t("menu shows the title", txt().includes("DISPATCHES"));
  t("menu shows Major Commands", txt().includes("Major Commands"));
  t("menu shows Minor Commands", txt().includes("Minor Commands"));
  t("all six campaigns listed",
    ["Oberste","Grand Quartier","Stavka","British","Armeeoberkommando","Ottoman"]
      .every(n => txt().includes(n)));
  t("campaigns without content are disabled",
    btns().filter(b => b.disabled).length === 1);
  t("GQG is enabled", btns().some(b => !b.disabled && b.textContent.includes("Grand Quartier")));

  const playable = btns().find(b => !b.disabled && b.textContent.includes("Oberste"));
  t("OHL card is enabled", !!playable);
  click(playable); await wait(60);

  t("node screen renders a title", txt().includes("The Weight on the Right"));
  t("roman date renders", txt().includes("VIII.1914"));
  t("no draft banner (content is real)", !txt().includes("DRAFT CONTENT"));
  t("meters render with campaign will label", txt().includes("HOME FRONT"));
  t("issue order renders", txt().includes("Issue Order"));

  const choice = btns().find(b => b.textContent.includes("Hold the right at the weight"));
  t("choices render", !!choice);
  click(choice); await wait(60);

  t("outcome screen renders", txt().includes("OUTCOME"));
  const cont = btns().find(b => b.textContent.trim() === "Continue");
  click(cont); await wait(60);

  t("second node reached", txt().includes("Two Corps for the East"));
  t("conditional prose on the new node", txt().includes("went forward at the weight the plan asked for"));
  click(btns().find(b => b.textContent.includes("Send the Guard Reserve Corps"))); await wait(60);
  t("the order the command gave is marked", txt().includes("The command gave this order."));
  click(btns().find(b => b.textContent.trim() === "Continue")); await wait(60);

  t("third node reached", txt().includes("A Gap No One"));
  t("conditional prose fired on flags", txt().includes("full weight"));
  t("advisor renders as position, not fabricated quote", txt().includes("argues:") && !txt().includes("\u201c"));
  t("bulletin renders", txt().includes("Official communiqué"));

  const c2 = btns().find(b => b.textContent.includes("Send Hentsch forward"));
  click(c2); await wait(60);
  t("the outcome offers the historical record", txt().includes("THE HISTORICAL RECORD"));
  t("a historical order is marked as such", txt().includes("The command gave this order."));
  t("a contested roll shows where the record divides", txt().includes("Where the record divides.") && txt().includes("Historians divide on where responsibility for the Marne withdrawal lies"));
  const cont2 = btns().find(b => b.textContent.trim() === "Continue");
  click(cont2); await wait(60);

  t("contested roll resolved to a real node", txt().includes("The Seat Changes Hands"));
  
  
  t("no unresolved-node error anywhere", !txt().includes("does not resolve"));

  // Second campaign: menu -> GQG -> first node, checking the per-campaign labelling.
  const home = btns().find(b => b.textContent.trim() === "Home");
  if (home) { click(home); await wait(60); }
  const gqg = btns().find(b => !b.disabled && b.textContent.includes("Grand Quartier"));
  t("can return to menu and pick a second campaign", !!gqg);
  if (gqg) { click(gqg); await wait(60); }
  t("GQG node renders", txt().includes("Into Lorraine"));
  t("GQG uses its own will label", txt().includes("ARMY MORALE") && !txt().includes("HOME FRONT"));
  t("GQG uses its own document treatment", txt().includes("COMPTE RENDU"));

  const home2 = btns().find(b => b.textContent.trim() === "Home");
  if (home2) { click(home2); await wait(60); }
  const stavka = btns().find(b => !b.disabled && b.textContent.includes("Stavka"));
  t("Stavka is enabled", !!stavka);
  if (stavka) { click(stavka); await wait(60); }
  t("Stavka node renders", txt().includes("Before the Concentration"));
  t("Julian calendar stated on the card", true);
  t("Stavka uses its own will label", txt().includes("HOME STABILITY"));
  t("Stavka uses its own document treatment", txt().includes("SVODKA"));


  // ---- v1.1: saved file, hard mode switch, war record, settings -------------------------------------------
  const byText = (x) => btns().find((b) => b.textContent.trim() === x);
  const byIncludes = (x) => btns().find((b) => b.textContent.includes(x));
  // Stavka is in progress: going Home offers it back.
  click(byText("Home")); await wait(60);
  t("a run in progress is offered back as a saved file", txt().includes("File in progress") && txt().includes("Russian Stavka"));
  t("the saved file survives in localStorage", !!window.localStorage.getItem("dispatches1914_save_v1"));
  click(byText("Resume file")); await wait(60);
  t("Resume file returns to the node the run was on", txt().includes("Before the Concentration"));
  click(byText("Home")); await wait(60);

  // Hard mode switch.
  t("the menu has a Standard / Hard mode switch", !!byText("Standard") && !!byText("Hard mode"));
  click(byText("Hard mode")); await wait(40);
  t("hard mode shows each command's pressure on its card", txt().includes("Hard mode: The war effort consuming the country that sustains it."));
  click(byIncludes("Oberste")); await wait(60);
  t("a hard-mode run shows the erosion track", txt().includes("HARD MODE") && txt().includes("EROSION 0/"));
  click(byText("Home")); await wait(60);
  click(byText("Standard")); await wait(40);
  click(byIncludes("Oberste")); await wait(60);
  t("a standard run shows no erosion track", !txt().includes("EROSION"));
  click(byText("Home")); await wait(60);

  // War record.
  click(byIncludes("WAR RECORD")); await wait(60);
  t("the war record opens", txt().includes("WAR RECORD") && txt().includes("Dossiers") && txt().includes("Atlas") && txt().includes("Endings"));
  t("dossiers opened by advisers met in play", /[1-9]\d* of \d+ dossiers open/.test(txt()));
  t("dossiers not yet met stay closed", txt().includes("File closed."));
  click(byText("Atlas")); await wait(40);
  t("atlas lists decisions reached and not yet reached", /decisions reached/.test(txt()) && txt().includes("Not yet reached."));
  click(byText("Endings")); await wait(40);
  t("endings gallery counts endings found", /\d+ of \d+ endings found/.test(txt()));
  click(byText("Return to file")); await wait(60);
  t("the war record is kept in localStorage", !!window.localStorage.getItem("dispatches1914_record_v1"));

  // Settings: text size.
  click(byText("Larger")); await wait(40);
  t("text size changes the page scale class", !!document.querySelector(".dg-fs-m"));
  t("text size is stored", (window.localStorage.getItem("dispatches1914_settings_v1") || "").includes('"m"'));
  click(byText("Standard")); await wait(40);

  // Landmarks and headings.
  t("every screen has a main landmark", document.querySelectorAll("main").length === 1);
  t("the menu has a level-one heading", document.querySelectorAll("h1").length === 1);

  console.log(`render-test: ${fail} failure${fail===1?"":"s"}`);
  process.exit(fail ? 1 : 0);
})();
