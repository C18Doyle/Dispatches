#!/usr/bin/env node
/**
 * Behavioral jsdom test for round-23's discovery log and Key Events timeline.
 * Plays a real run (southRussia), makes a real choice, checks the discovery
 * localStorage key updates, opens the Key Events screen and confirms it
 * lists what was actually visited, then exits to the menu and confirms the
 * War Record / Discovery Atlas reflect the discovered count.
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

function dump(doc, label, len = 500) {
  console.log(`\n=== ${label} ===`);
  console.log(doc.body.textContent.replace(/\s+/g, " ").trim().slice(0, len));
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

  console.log("discovery before play:", window.localStorage.getItem("dispatches1922_discovered_v1"));

  click(findClickableWithText(doc.body, "Armed Forces of South Russia"));
  await new Promise((r) => setTimeout(r, 100));
  click(Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "OPEN COMMAND"));
  await new Promise((r) => setTimeout(r, 100));
  click(Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "ENTER COMMAND"));
  await new Promise((r) => setTimeout(r, 100));

  console.log("\ndiscovery after entering first node:", window.localStorage.getItem("dispatches1922_discovered_v1"));

  // Open Key Events from the briefing screen.
  let keyEventsBtn = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "▶ KEY EVENTS");
  console.log("\nKEY EVENTS button found:", !!keyEventsBtn);
  click(keyEventsBtn);
  await new Promise((r) => setTimeout(r, 100));
  dump(doc, "Key Events screen (should list 1 entry: kornilovsDeath18 / APRIL 1918)", 500);

  let returnBtn = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "RETURN TO COMMAND");
  click(returnBtn);
  await new Promise((r) => setTimeout(r, 100));

  // Make a real choice to advance, then check discovery grew.
  let issueBtn = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "ISSUE THE ORDER");
  click(issueBtn);
  await new Promise((r) => setTimeout(r, 100));
  let contBtn = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "CONTINUE");
  click(contBtn);
  await new Promise((r) => setTimeout(r, 100));
  contBtn = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "CONTINUE");
  if (contBtn) { click(contBtn); await new Promise((r) => setTimeout(r, 100)); }

  console.log("\ndiscovery after second node reached:", window.localStorage.getItem("dispatches1922_discovered_v1"));

  // Open Key Events again — should now show 2 entries.
  keyEventsBtn = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "▶ KEY EVENTS");
  click(keyEventsBtn);
  await new Promise((r) => setTimeout(r, 100));
  dump(doc, "Key Events screen after 2nd node (should list 2 entries)", 600);
  returnBtn = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "RETURN TO COMMAND");
  click(returnBtn);
  await new Promise((r) => setTimeout(r, 100));

  // Exit to menu, open War Record, check the discovered count shows 2.
  let closeBtn = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "✕");
  click(closeBtn);
  await new Promise((r) => setTimeout(r, 100));

  let warRecordEl = findClickableWithText(doc.body, "THE WAR RECORD");
  // Navigate menu -> war record via whatever the real UI path is; try a
  // direct click on a "WAR RECORD"-labeled element first.
  let warRecordBtn = findClickableWithText(doc.body, "War Record") || findClickableWithText(doc.body, "WAR RECORD");
  console.log("\nwar record nav candidate:", warRecordBtn && warRecordBtn.tagName, warRecordBtn && warRecordBtn.textContent.trim().slice(0, 60));
  if (warRecordBtn) {
    click(warRecordBtn);
    await new Promise((r) => setTimeout(r, 100));
    dump(doc, "War Record screen (should show '2 of N situation reports discovered')", 700);

    let atlasBtn = findClickableWithText(doc.body, "DISCOVERY ATLAS");
    click(atlasBtn);
    await new Promise((r) => setTimeout(r, 100));
    dump(doc, "Discovery Atlas screen (kornilovsDeath18 + moscowDirective19 should be full-opacity/discovered)", 900);
  }

  window.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
