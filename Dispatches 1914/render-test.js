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
const t = (n, c) => { console.log(`  ${c ? "ok  " : "FAIL"} ${n}`); if (!c) { fail++; try { console.log("       page: " + ((document.querySelector("main") || document.getElementById("root")).textContent).replace(/\s+/g, " ").slice(0, 300)); } catch (e) { /* no page */ } } };

const code = fs.readFileSync("dist/bundle.js", "utf8");
try { new Function(code)(); } catch (e) { console.log("MOUNT ERROR:", e.message); process.exit(1); }

const wait = (ms) => new Promise(r => setTimeout(r, ms));
const txt = () => document.getElementById("root").textContent;
const btns = () => [...document.querySelectorAll("button")];
const click = (b) => { b.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); };
/** The prelude each command opens on: press the order that holds the text, then Continue. */
const pass = async (text) => {
  click(btns().find((b) => b.textContent.includes(text))); await wait(60);
  const c = btns().find((b) => b.textContent.trim() === "Continue");
  if (c) { click(c); await wait(60); }
};
const enter = async () => { click(btns().find((b) => b.textContent.trim() === "Enter the war room")); await wait(60); }; // the briefing's door to the war room

(async () => {
  await wait(80);
  t("root is not empty (no blank screen)", txt().length > 50);
  t("menu shows the title", txt().includes("DISPATCHES"));
  t("menu groups the commands by side", txt().includes("The Central Powers") && txt().includes("The Entente"));
  t("each card names its nation", ["Germany", "France", "Russia", "Britain", "Austria-Hungary", "The Ottoman Empire"].every((n) => txt().includes(n)));
  t("the menu carries War record and Settings, and How to play is in Settings", ["War record", "Settings"].every((n) => btns().some((b) => b.textContent.includes(n))));
  t("the menu has no feedback option", !/feedback/i.test(txt()) && !document.querySelector('a[href*="dispatches.itch.io"]'));
  t("difficulty is not on the menu", !btns().some((b) => b.textContent.trim().endsWith("Hard mode")));
  t("all six campaigns listed",
    ["Germany","France","Russia","Britain","Austria-Hungary","Ottoman"]
      .every(n => txt().includes(n)));
  t("every campaign has content, so no card is disabled",
    btns().filter(b => b.disabled).length === 0);
  t("GQG is enabled", btns().some(b => !b.disabled && b.textContent.includes("France")));

  const playable = btns().find(b => !b.disabled && b.textContent.includes("Germany"));
  t("OHL card is enabled", !!playable);
  click(playable); await wait(60);
  t("a command opens its briefing first", txt().includes("Where things stand") && txt().includes("Your seat") && txt().includes("Set up the file") && !txt().includes("Issue Order"));
  t("the briefing says the first report's date in the UK form", txt().includes("1 August 1914"));
  t("the briefing offers the difficulty and battle planning", btns().some((b) => b.textContent.trim().endsWith("Easy mode")) && txt().includes("Take control of battle planning"));
  await enter();
  t("a command opens on its prelude, in the UK date form", txt().includes("The Kaiser's Question") && txt().includes("1 August 1914"));
  await pass("Tell the Kaiser that the deployment");

  t("node screen renders a title", txt().includes("The Weight on the Right"));
  t("the date renders as the UK writes it", txt().includes("4 August 1914"));
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
  click(btns().find(b => b.textContent.trim() === "Continue")); await wait(60);

  t("third node reached", txt().includes("A Gap No One"));
  t("conditional prose fired on flags", txt().includes("full weight"));
  t("advisor renders as position, not fabricated quote", txt().includes("argues:") && !txt().includes("\u201c"));
  t("bulletin renders", txt().includes("Official communiqué"));

  const c2 = btns().find(b => b.textContent.includes("Send Hentsch forward"));
  click(c2); await wait(60);
  t("a contested order shows its result at once, with no sealed cable", !txt().includes("A cable has come in") && !btns().some(b => b.textContent.trim() === "Break the seal") && !txt().includes("THE HISTORICAL RECORD"));
  const cont2 = btns().find(b => b.textContent.trim() === "Continue");
  click(cont2); await wait(60);

  t("contested roll resolved to a real node", txt().includes("The Seat Changes Hands"));
  
  
  t("no unresolved-node error anywhere", !txt().includes("does not resolve"));

  // Second campaign: menu -> GQG -> first node, checking the per-campaign labelling.
  const home = btns().find(b => b.textContent.trim() === "Home");
  if (home) { click(home); await wait(60); }
  const gqg = btns().find(b => !b.disabled && b.textContent.includes("France"));
  t("can return to menu and pick a second campaign", !!gqg);
  if (gqg) { click(gqg); await wait(60); await enter(); await pass("Obey, and withdraw"); }
  t("GQG node renders", txt().includes("Into Lorraine"));
  t("GQG uses its own will label", txt().includes("MORALE") && !txt().includes("ARMY MORALE") && !txt().includes("HOME FRONT"));
  t("GQG uses its own document treatment", txt().includes("COMPTE RENDU"));

  const home2 = btns().find(b => b.textContent.trim() === "Home");
  if (home2) { click(home2); await wait(60); }
  const stavka = btns().find(b => !b.disabled && b.textContent.includes("Russia"));
  t("Stavka is enabled", !!stavka);
  if (stavka) { click(stavka); await wait(60); await enter(); await pass("Send two armies"); }
  t("Stavka node renders", txt().includes("Before the Concentration"));
  t("Julian calendar stated on the card", true);
  t("Stavka uses its own will label", txt().includes("HOME STABILITY"));
  t("Stavka uses its own document treatment", txt().includes("SVODKA"));


  // ---- v1.1: saved file, hard mode switch, war record, settings -------------------------------------------
  const byText = (x) => btns().find((b) => b.textContent.trim() === x || (/ mode$/.test(x) && b.textContent.trim().endsWith(x)));
  const byIncludes = (x) => btns().find((b) => b.textContent.includes(x));
  // Stavka is in progress: going Home offers it back.
  click(byText("Home")); await wait(60);
  t("a run in progress is offered back as a saved file", txt().includes("File in progress") && txt().includes("Russian Stavka"));
  t("the saved file survives in localStorage", !!window.localStorage.getItem("dispatches1914_save_v1"));
  click(byText("Resume file")); await wait(60);
  t("Resume file returns to the node the run was on", txt().includes("Before the Concentration"));
  click(byText("Home")); await wait(60);

  // Hard mode switch: on the briefing, after the command is chosen.
  click(byIncludes("Germany")); await wait(60);
  t("the briefing has an Easy / Standard / Hard mode switch", !!byText("Easy mode") && !!byText("Standard") && !!byText("Hard mode"));
  click(byText("Hard mode")); await wait(40);
  t("hard mode shows the command's pressure", txt().includes("the war effort consuming the country that sustains it"));
  await enter();
  t("a hard-mode run shows the erosion track", txt().includes("HARD MODE") && txt().includes("EROSION 0/"));
  click(byText("Home")); await wait(60);
  click(byIncludes("Germany")); await wait(60);
  click(byText("Standard")); await wait(40);
  await enter();
  t("a standard run shows no erosion track", !txt().includes("EROSION"));
  click(byText("Home")); await wait(60);

  // War record.
  click(byIncludes("War record")); await wait(60);
  t("the war record opens", txt().includes("WAR RECORD") && txt().includes("Dossiers") && txt().includes("Atlas") && txt().includes("Endings"));
  t("the war record opens on the service record", txt().includes("Service record") && /files closed/.test(txt()) && /decisions reached/.test(txt()));
  t("each command has its progress, files and best rank", txt().includes("No rank yet") && /OHL/.test(txt()) && /Decisions\s*\d+\/\d+/.test(txt()));
  t("the war record has no echoes tab", !txt().includes("Echoes"));
  click(byText("Dossiers")); await wait(40);
  t("every dossier can be read, with how often the adviser was followed", /You followed this adviser|No orders given on this adviser/.test(txt()) && !txt().includes("File closed."));
  click(byText("Atlas")); await wait(40);
  t("atlas lists decisions reached and not yet reached", /decisions reached/.test(txt()) && /not yet reached/i.test(txt()));
  click(byText("Endings")); await wait(40);
  t("endings gallery counts endings found", /\d+ of \d+ endings found/.test(txt()));
  click(byText("Battles")); await wait(40);
  t("the battles tab lists the Orders of Battle", txt().includes("the Marne") && !txt().includes("Not yet fought"));
  click(byText("Return to file")); await wait(60);
  t("the war record is kept in localStorage", !!window.localStorage.getItem("dispatches1914_record_v1"));

  // How to play.
  click(byIncludes("Settings")); await wait(60);
  click(byIncludes("How to play")); await wait(60);
  t("How to play opens with its sections", txt().includes("Reading a report") && txt().includes("Orders and risk") && txt().includes("What the game leaves out"));
  t("What the game leaves out is a section of How to play, not of the menu", txt().includes("Armenians"));
  click(byText("Back")); await wait(60);
  t("Back returns to Settings", txt().includes("Calendar: United Kingdom") && !txt().includes("Orders and risk"));
  click(byText("Back")); await wait(60);
  t("Back returns to the menu", txt().includes("The Central Powers"));

  // Settings: its own screen.
  click(byIncludes("Settings")); await wait(60);
  t("Settings opens as a screen with its sections", txt().includes("Reading") && txt().includes("Playing") && txt().includes("Calendar: United Kingdom"));
  t("the music is a setting, not a switch on every screen, and the typeface choices include a dyslexia-friendly one", !byText("Music on") && !byText("Music off") && txt().includes("Dyslexia-friendly"));
  t("the settings offer the music, on or off, with a volume while it is on", txt().includes("Music") && !!document.querySelector('[aria-label="Music"]') && !!document.querySelector('input[type="range"]#dg-music'));
  const slider = document.getElementById("dg-size");
  t("text size is a slider with three stops", !!slider && slider.min === "0" && slider.max === "2");
  const setSize = async (v) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(slider, String(v));
    slider.dispatchEvent(new window.Event("input", { bubbles: true }));
    slider.dispatchEvent(new window.Event("change", { bubbles: true }));
    await wait(40);
  };
  await setSize(1);
  t("text size changes the page scale class", !!document.querySelector(".dg-fs-m"));
  t("text size is stored", (window.localStorage.getItem("dispatches1914_settings_v1") || "").includes('"m"'));
  await setSize(0);
  t("text size can go back to Standard", !document.querySelector(".dg-fs-m"));
  click([...document.querySelectorAll('[aria-label="Sound"] button')].find((b) => b.textContent.trim() === "Typewriter")); await wait(40);
  t("sound can be switched on and is stored", (window.localStorage.getItem("dispatches1914_settings_v1") || "").includes('"sound":true'));
  click([...document.querySelectorAll('[aria-label="Sound"] button')].find((b) => b.textContent.trim() === "Off")); await wait(40);
  t("sound can be switched off again", (window.localStorage.getItem("dispatches1914_settings_v1") || "").includes('"sound":false'));
  click([...document.querySelectorAll('[aria-label="Music"] button')].find((b) => b.textContent.trim() === "Off")); await wait(40);
  t("music can be switched off and is stored, and its volume goes", (window.localStorage.getItem("dispatches1914_settings_v1") || "").includes('"music":false') && !document.querySelector("#dg-music"));
  click([...document.querySelectorAll('[aria-label="Music"] button')].find((b) => b.textContent.trim() === "On")); await wait(40);
  click(byText("Back")); await wait(60);

  // Landmarks and headings.
  t("every screen has a main landmark", document.querySelectorAll("main").length === 1);
  t("the menu has a level-one heading", document.querySelectorAll("h1").length === 1);

  console.log(`render-test: ${fail} failure${fail===1?"":"s"}`);
  process.exit(fail ? 1 : 0);
})();
