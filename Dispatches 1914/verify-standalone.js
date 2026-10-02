const { JSDOM } = require("jsdom");
const fs = require("fs");
const dom = new JSDOM(fs.readFileSync("dist/index.html","utf8"),
  { runScripts:"dangerously", pretendToBeVisual:true, url:"http://localhost" });
setTimeout(() => {
  const t = dom.window.document.getElementById("root").textContent;
  const ok = t.includes("DISPATCHES") && t.includes("Major Commands") && t.length > 200;
  console.log(ok ? `standalone: MOUNTS OK (${t.length} chars rendered)` : "standalone: BLANK — FAILED");
  process.exit(ok ? 0 : 1);
}, 400);
