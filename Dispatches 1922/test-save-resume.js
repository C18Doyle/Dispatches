#!/usr/bin/env node
/**
 * Behavioral jsdom test for the round-22 save/resume feature. Static
 * checks (tsc, check-*.js) can't catch a React-hooks-plus-localStorage bug
 * like this one, so this actually renders the app, clicks through a real
 * run, closes back to the menu, and confirms the RESUME banner brings the
 * player back to the same node.
 */
const { JSDOM } = require("jsdom");
const fs = require("fs");

function findDeepestWithText(root, text) {
  let best = null;
  function walk(node) {
    if (node.nodeType === 1) {
      if (node.tagName === "SCRIPT" || node.tagName === "STYLE") return;
      const t = (node.textContent || "").trim();
      if (t.includes(text)) {
        if (!best || t.length < best.textContent.trim().length) best = node;
        for (const child of node.children) walk(child);
      }
    }
  }
  walk(root);
  return best;
}

function findClickableWithText(root, text) {
  // Prefer an actual button/clickable element whose OWN text (not just a
  // descendant's) contains the target substring.
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
  // Smallest matching element = most specific = likely the actual button.
  candidates.sort((a, b) => a.textContent.trim().length - b.textContent.trim().length);
  return candidates[0] || null;
}

function click(el) {
  el.dispatchEvent(new el.ownerDocument.defaultView.MouseEvent("click", { bubbles: true }));
}

function dump(doc, label) {
  console.log(`\n=== ${label} ===`);
  console.log(doc.body.textContent.replace(/\s+/g, " ").trim().slice(0, 600));
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
  console.log("localStorage before any play:", window.localStorage.getItem("dispatches1922_save_v1"));
  dump(doc, "initial screen");

  // Open the first campaign card (southRussia — "Armed Forces of South Russia").
  let el = findClickableWithText(doc.body, "Armed Forces of South Russia");
  if (!el) throw new Error("campaign card not found");
  click(el);
  await new Promise((r) => setTimeout(r, 100));
  dump(doc, "after clicking campaign card");

  // Print all buttons currently in the DOM to find the real labels.
  let buttons = Array.from(doc.querySelectorAll("button")).map((b) => b.textContent.trim().slice(0, 40));
  console.log("\nbuttons on detail screen:", JSON.stringify(buttons));

  // Click "OPEN COMMAND" to enter the war room / briefing.
  let openCmd = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "OPEN COMMAND");
  if (!openCmd) throw new Error("OPEN COMMAND button not found");
  click(openCmd);
  await new Promise((r) => setTimeout(r, 100));
  dump(doc, "after clicking OPEN COMMAND");
  buttons = Array.from(doc.querySelectorAll("button")).map((b) => b.textContent.trim().slice(0, 40));
  console.log("\nbuttons on next screen:", JSON.stringify(buttons));

  // Click "ENTER COMMAND" to actually start the run.
  let enterCmd = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "ENTER COMMAND");
  if (!enterCmd) throw new Error("ENTER COMMAND button not found");
  click(enterCmd);
  await new Promise((r) => setTimeout(r, 100));
  dump(doc, "after clicking ENTER COMMAND (should be first node)");
  buttons = Array.from(doc.querySelectorAll("button")).map((b) => b.textContent.trim().slice(0, 60));
  console.log("\nbuttons on node screen:", JSON.stringify(buttons));

  let saveAfterStart = window.localStorage.getItem("dispatches1922_save_v1");
  console.log("\nlocalStorage after ENTER COMMAND:", saveAfterStart ? "PRESENT" : "MISSING");
  if (saveAfterStart) console.log(JSON.parse(saveAfterStart));

  // Make one real choice to advance a node and confirm the save updates.
  const choiceBtn = doc.querySelector("button:not([disabled])");
  const allButtons = Array.from(doc.querySelectorAll("button"));
  // Pick a button that isn't the close (✕) button — first real choice button.
  const pickChoice = allButtons.find((b) => b.textContent.trim() !== "✕" && b.textContent.trim().length > 3);
  if (pickChoice) {
    console.log("\nclicking choice button:", pickChoice.textContent.trim().slice(0, 80));
    click(pickChoice);
    await new Promise((r) => setTimeout(r, 100));
    dump(doc, "after making first choice");
    buttons = Array.from(doc.querySelectorAll("button")).map((b) => b.textContent.trim().slice(0, 60));
    console.log("\nbuttons after first choice:", JSON.stringify(buttons));
  }

  saveAfterStart = window.localStorage.getItem("dispatches1922_save_v1");
  console.log("\nlocalStorage after first choice:", saveAfterStart ? "PRESENT" : "MISSING");
  if (saveAfterStart) console.log(JSON.parse(saveAfterStart));

  // Return to command (close the front map overlay) and make a REAL choice
  // this time ("ISSUE THE ORDER").
  let returnBtn = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "RETURN TO COMMAND");
  if (returnBtn) {
    click(returnBtn);
    await new Promise((r) => setTimeout(r, 100));
  }
  buttons = Array.from(doc.querySelectorAll("button")).map((b) => b.textContent.trim().slice(0, 60));
  console.log("\nbuttons back at node screen:", JSON.stringify(buttons));

  let issueBtn = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "ISSUE THE ORDER");
  if (!issueBtn) throw new Error("ISSUE THE ORDER button not found");
  click(issueBtn);
  await new Promise((r) => setTimeout(r, 100));
  dump(doc, "after ISSUE THE ORDER (real choice)");
  buttons = Array.from(doc.querySelectorAll("button")).map((b) => b.textContent.trim().slice(0, 60));
  console.log("\nbuttons after real choice:", JSON.stringify(buttons));

  let saveAfterChoice = window.localStorage.getItem("dispatches1922_save_v1");
  console.log("\nlocalStorage after real choice (screen likely 'bulletin'):", saveAfterChoice ? "PRESENT" : "MISSING");
  if (saveAfterChoice) console.log(JSON.parse(saveAfterChoice));

  // Continue past the bulletin to the next node's briefing, to see the save
  // track the new node.
  let continueBtn = Array.from(doc.querySelectorAll("button")).find((b) =>
    /CONTINUE|PROCEED|NEXT|ACKNOWLEDGE/i.test(b.textContent.trim())
  );
  console.log("\ncontinue-candidate:", continueBtn && continueBtn.textContent.trim());
  if (continueBtn) {
    click(continueBtn);
    await new Promise((r) => setTimeout(r, 100));
    dump(doc, "after continuing past bulletin");
    let saveAfterContinue = window.localStorage.getItem("dispatches1922_save_v1");
    console.log("\nlocalStorage after continue:", saveAfterContinue ? "PRESENT" : "MISSING");
    if (saveAfterContinue) console.log(JSON.parse(saveAfterContinue));
  }

  buttons = Array.from(doc.querySelectorAll("button")).map((b) => b.textContent.trim().slice(0, 60));
  console.log("\nbuttons on bulletin/dispatch screen:", JSON.stringify(buttons));

  // The newspaper "DISPATCH" screen only has CONTINUE; click through it to
  // reach the next node's actual briefing/choice screen where ✕ lives.
  let contBtn2 = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "CONTINUE");
  if (contBtn2) {
    click(contBtn2);
    await new Promise((r) => setTimeout(r, 100));
    dump(doc, "after second CONTINUE (should be node briefing)");
    buttons = Array.from(doc.querySelectorAll("button")).map((b) => b.textContent.trim().slice(0, 60));
    console.log("\nbuttons now:", JSON.stringify(buttons));
  }

  // Now bail out to the main menu via the ✕ close button and check the
  // RECORDS list for the RESUME banner.
  let closeBtn = Array.from(doc.querySelectorAll("button")).find((b) => b.textContent.trim() === "✕");
  if (closeBtn) {
    click(closeBtn);
    await new Promise((r) => setTimeout(r, 100));
    dump(doc, "after clicking ✕ to exit to menu");
    buttons = Array.from(doc.querySelectorAll("button")).map((b) => b.textContent.trim().slice(0, 60));
    console.log("\nbuttons after exit:", JSON.stringify(buttons));
  }

  let saveAfterExit = window.localStorage.getItem("dispatches1922_save_v1");
  console.log("\nlocalStorage after exit-to-menu (should be unchanged, still PRESENT):", saveAfterExit ? "PRESENT" : "MISSING");
  if (saveAfterExit) console.log(JSON.parse(saveAfterExit));

  // Click the RESUME COMMAND banner (likely a div/el with an onClick, not a
  // <button>) and confirm it restores the exact saved node/meters/flags.
  let resumeEl = findClickableWithText(doc.body, "RESUME COMMAND");
  console.log("\nresume element found:", resumeEl ? resumeEl.tagName + " :: " + resumeEl.textContent.trim().slice(0, 80) : "NONE");
  if (resumeEl) {
    click(resumeEl);
    await new Promise((r) => setTimeout(r, 100));
    const fullText = doc.body.textContent.replace(/\s+/g, " ").trim();
    console.log("\n=== after clicking RESUME COMMAND (full, 1200 chars) ===");
    console.log(fullText.slice(0, 1200));
    buttons = Array.from(doc.querySelectorAll("button")).map((b) => b.textContent.trim().slice(0, 60));
    console.log("\nbuttons after resume:", JSON.stringify(buttons));
    console.log("\ncontains 'Directive' (expected, from moscowDirective19 title):", fullText.includes("Directive"));
    console.log("contains 'ekaterinodarChoice' echo n/a (flags not shown in UI) -- checking meters/visited via localStorage instead");
  }
  const finalSave = window.localStorage.getItem("dispatches1922_save_v1");
  console.log("\nfinal localStorage state:", finalSave ? JSON.stringify(JSON.parse(finalSave)) : "MISSING");

  window.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
