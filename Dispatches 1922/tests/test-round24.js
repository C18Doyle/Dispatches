#!/usr/bin/env node
/**
 * Behavioral jsdom test for Round 24's new campaign (Provisional Government,
 * Petrograd 1917). Confirms it's actually reachable through the real menu
 * (not just a resolveNode object nobody can get to), that "VIEW FRONT MAP"
 * is correctly absent for this campaign (hasFrontMap: false), that "KEY
 * EVENTS" still works, and that a full historical playthrough reaches the
 * historical ending.
 */
const { JSDOM } = require("jsdom");
const fs = require("fs");

function findClickableWithText(root, text) {
  let candidates = [];
  function walk(node) {
    if (node.nodeType === 1) {
      if (node.tagName === "SCRIPT" || node.tagName === "STYLE") return;
      const t = (node.textContent || "").trim();
      if (t.includes(text)) candidates.push(node);
      for (const child of node.children) walk(child);
    }
  }
  walk(root);
  candidates.sort((a, b) => a.textContent.trim().length - b.textContent.trim().length);
  return candidates[0] || null;
}
function click(el) {
  el.dispatchEvent(new el.ownerDocument.defaultView.MouseEvent("click", { bubbles: true }));
}
// Each choice renders as a card (div.border-2.p-4.mb-3) containing the full
// label + advisor quote, with a generic "ISSUE THE ORDER" button inside
// that same card — the button's own text is NOT the choice label. Find the
// smallest element containing the label substring, walk up to the card,
// then click the button inside it.
function clickChoiceByLabel(doc, labelSubstring) {
  const card = findClickableWithText(doc.body, labelSubstring);
  if (!card) return false;
  let node = card;
  while (node && !(node.className && node.className.includes && node.className.includes("border-2"))) {
    node = node.parentElement;
  }
  const btn = node && node.querySelector("button");
  if (!btn) return false;
  click(btn);
  return true;
}
function dump(doc, label, len = 500) {
  console.log(`\n=== ${label} ===`);
  console.log(doc.body.textContent.replace(/\s+/g, " ").trim().slice(0, len));
}
function buttons(doc) {
  return Array.from(doc.querySelectorAll("button")).map((b) => b.textContent.trim());
}

async function main() {
  const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, {
    runScripts: "dangerously",
    resources: "usable",
    url: "https://example.com/",
  });
  const { window } = dom;
  const bundle = fs.readFileSync("bundle_test.js", "utf8");
  const scriptEl = window.document.createElement("script");
  scriptEl.textContent = bundle;
  window.document.body.appendChild(scriptEl);
  await new Promise((r) => setTimeout(r, 400));
  const doc = window.document;

  dump(doc, "main menu (should include PETROGRAD, 1917 section)", 400);
  const sectionHeader = findClickableWithText(doc.body, "PETROGRAD, 1917");
  console.log("\nsection header found:", !!sectionHeader);

  const campaignCard = findClickableWithText(doc.body, "The Provisional Government");
  console.log("campaign card found:", !!campaignCard);
  click(campaignCard);
  await new Promise((r) => setTimeout(r, 100));
  dump(doc, "campaign detail screen", 400);

  let openCmd = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "OPEN CABINET" || b.textContent.trim() === "OPEN COMMAND");
  console.log("\nopen-command button label found:", openCmd && openCmd.textContent.trim());
  click(openCmd);
  await new Promise((r) => setTimeout(r, 100));

  let enterCmd = Array.from(doc.querySelectorAll("button")).find((b) => /ENTER/i.test(b.textContent.trim()));
  console.log("enter-command button found:", enterCmd && enterCmd.textContent.trim());
  click(enterCmd);
  await new Promise((r) => setTimeout(r, 100));
  dump(doc, "first node (aprilCrisis17)", 400);

  const btns1 = buttons(doc);
  console.log("\nbuttons at first node:", JSON.stringify(btns1));
  console.log("VIEW FRONT MAP present (should be false):", btns1.some((b) => b.includes("VIEW FRONT MAP")));
  console.log("KEY EVENTS present (should be true):", btns1.some((b) => b.includes("KEY EVENTS")));

  // Play the fully historical path: coalition -> pressForward(roll) -> targetedCrackdown -> accept Soviet offer.
  const clickedCoalition = clickChoiceByLabel(doc, "Accept the Soviet's terms");
  console.log("\ncoalition choice clicked:", clickedCoalition);
  await new Promise((r) => setTimeout(r, 100));
  let cont = Array.from(doc.querySelectorAll("button")).find((b) => /CONTINUE/i.test(b.textContent.trim()));
  if (cont) { click(cont); await new Promise((r) => setTimeout(r, 100)); }
  cont = Array.from(doc.querySelectorAll("button")).find((b) => /CONTINUE/i.test(b.textContent.trim()));
  if (cont) { click(cont); await new Promise((r) => setTimeout(r, 100)); }
  dump(doc, "after April Crisis choice (should be June Offensive node)", 400);

  const clickedPress = clickChoiceByLabel(doc, "Commit the reserves forward");
  console.log("\npress-forward choice clicked:", clickedPress);
  await new Promise((r) => setTimeout(r, 100));
  cont = Array.from(doc.querySelectorAll("button")).find((b) => /CONTINUE/i.test(b.textContent.trim()));
  if (cont) { click(cont); await new Promise((r) => setTimeout(r, 100)); }
  cont = Array.from(doc.querySelectorAll("button")).find((b) => /CONTINUE/i.test(b.textContent.trim()));
  if (cont) { click(cont); await new Promise((r) => setTimeout(r, 100)); }
  dump(doc, "after June Offensive roll (should be July Days node)", 400);

  const clickedCrackdown = clickChoiceByLabel(doc, "Bring in loyal front-line units");
  console.log("\ntargeted-crackdown choice clicked:", clickedCrackdown);
  await new Promise((r) => setTimeout(r, 100));
  cont = Array.from(doc.querySelectorAll("button")).find((b) => /CONTINUE/i.test(b.textContent.trim()));
  if (cont) { click(cont); await new Promise((r) => setTimeout(r, 100)); }
  cont = Array.from(doc.querySelectorAll("button")).find((b) => /CONTINUE/i.test(b.textContent.trim()));
  if (cont) { click(cont); await new Promise((r) => setTimeout(r, 100)); }
  dump(doc, "after July Days choice (should be Kornilov Affair node)", 400);

  const clickedAccept = clickChoiceByLabel(doc, "Accept the Soviet's offer");
  console.log("\naccept-Soviet-offer choice clicked:", clickedAccept);
  await new Promise((r) => setTimeout(r, 100));
  cont = Array.from(doc.querySelectorAll("button")).find((b) => /CONTINUE/i.test(b.textContent.trim()));
  if (cont) { click(cont); await new Promise((r) => setTimeout(r, 100)); }
  dump(doc, "should now be the ending screen (The Winter Palace Falls)", 800);

  window.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
