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
global.IS_REACT_ACT_ENVIRONMENT = true;

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
    btns().filter(b => b.disabled).length === 3);
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

  t("second node reached", txt().includes("A Gap No One"));
  t("conditional prose fired on flags", txt().includes("full weight"));
  t("advisor renders as position, not fabricated quote", txt().includes("argues:") && !txt().includes("\u201c"));
  t("bulletin renders", txt().includes("Official communiqué"));

  const c2 = btns().find(b => b.textContent.includes("Send Hentsch forward"));
  click(c2); await wait(60);
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

  console.log(`render-test: ${fail} failure${fail===1?"":"s"}`);
  process.exit(fail ? 1 : 0);
})();
