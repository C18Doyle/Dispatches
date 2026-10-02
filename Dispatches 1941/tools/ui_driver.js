// Browser-side driver for the UI-differential tests (see tools/README via CLAUDE.md).
// Loaded into the page with: eval(await (await fetch("/__driver")).text())
// Then: await window.__rec("<tag>", "japan"|"alliedPacific", "open"|"fanatical"|"coalition", <seed>)
// Plays one seeded run (instant text, seeded Math.random, seeded choice picking), hashing the
// page text after every click, and POSTs the result to /__record/<tag>/<name>.
window.__run = async function(seed, camp, mode, maxSteps){
  maxSteps = maxSteps || 300;
  const mk=(s)=>{let a=s>>>0;return()=>{a=(a+0x6d2b79f5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}};
  Math.random=mk(seed); const pick=mk(seed^0x9e3779b9);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const lab=b=>(b.getAttribute("aria-label")||b.textContent).trim().replace(/\s+/g," ");
  const vis=()=>[...document.querySelectorAll("button,[role=tab]")].filter(b=>b.offsetParent!==null&&!b.disabled);
  const hash=()=>{const t=document.body.innerText;let h=5381;for(let i=0;i<t.length;i++)h=((h<<5)+h+t.charCodeAt(i))|0;return (h>>>0).toString(36)+":"+t.length};
  // Wait for the DOM to stop changing (3 identical reads, 25ms apart) so async renders cannot race the hash.
  const settle=async()=>{let last=hash(),stable=0;for(let i=0;i<80&&stable<3;i++){await sleep(25);const h=hash();if(h===last)stable++;else{stable=0;last=h}}};
  const click=async(b)=>{b.click();await sleep(20);await settle()};
  const find=(re)=>vis().find(b=>re.test(lab(b)));
  await click(find(/^settings$/i));
  await click(find(/instant text: off/i));
  await click(find(camp==="japan"?/imperial general headquarters.*expand/i:/allied pacific command.*expand/i));
  const m = mode==="fanatical"?/fanatical/i:mode==="coalition"?/coalition/i:/^open command/i;
  const mb=find(m); if(!mb) return JSON.stringify({error:"mode button missing",btns:vis().map(lab)});
  await click(mb);
  const crashes=[]; const ce=console.error; console.error=(...a)=>{crashes.push(a.map(x=>String((x&&x.message)||x)).join(' ').slice(0,300)); ce(...a)}; let crashed=false;
  await settle(); const firstText=document.body.innerText.slice(0,1500); const hashes=[hash()]; let same=0, ended=false; const labels=[];
  const skip=/^(save|home|dossiers|records|settings|rewind|sound|menu|text size|reduced|instant|share|download)/i;
  for(let i=0;i<maxSteps;i++){
    const t=document.body.innerText;
    if(/FILE CLOSED/.test(t)){ended=true;}
    if(/File Was Damaged/.test(t)){crashed=true;break;}
    const bs=vis().filter(b=>!skip.test(lab(b))&&!/rewind|expand|collapse/i.test(lab(b)));
    const choices=bs.filter(b=>lab(b).length>=45);
    let b;
    if(choices.length&&!ended){b=choices[Math.floor(pick()*choices.length)];}
    else b=bs.find(b=>/^(proceed|continue|acknowledge|file|issue|begin|enter|next|open|sign|accept|brief|read|resume)/i.test(lab(b)))||bs[0];
    if(!b||ended){break;}
    labels.push(lab(b).slice(0,24));
    await click(b); const h=hash(); hashes.push(h);
    if(h===hashes[hashes.length-2]){if(++same>=4)break}else same=0;
  }
  const lastText=document.body.innerText.slice(0,2500); console.error=ce; return JSON.stringify({seed,camp,mode,n:hashes.length,ended,crashed,crash:crashes.slice(0,2),hashes:hashes.join(","),tail:labels.slice(-3),firstText,lastText});
};
window.__rec = async function(tag,camp,mode,seed){
  if(!window.__noClear){ localStorage.clear(); }
  const out = await window.__run(seed,camp,mode,300);
  await fetch("/__record/"+tag+"/"+camp+"-"+mode+"-"+seed,{method:"POST",body:out});
  const r=JSON.parse(out); return camp+"/"+mode+"/"+seed+" n="+r.n+" ended="+r.ended+(r.error?" ERR "+r.error:"");
};
// Runs a list of [campaign, mode, seed] one after another, each in a fresh same-origin iframe
// (so each run starts from a freshly loaded app). Returns progress in window.__mx.
//   eval(await (await fetch("/__driver")).text());
//   window.__matrixDone = false; __matrix("legacy", MATRIX).then(() => (window.__matrixDone = true));
window.MATRIX = [];
for (const [c, modes] of [["japan", ["open", "fanatical"]], ["alliedPacific", ["open", "coalition"]]])
  for (const m of modes) for (let s = 1; s <= 6; s++) window.MATRIX.push([c, m, s]);
window.__matrix = async function (tag, list) {
  const src = await (await fetch("/__driver")).text();
  const out = [];
  window.__mx = out;
  for (const [c, m, s] of list || window.MATRIX) {
    // Fresh storage BEFORE the app mounts (it reads saved runs on mount); give the previous
    // iframe a moment to flush any late writes first so runs cannot leak into each other.
    await new Promise((r) => setTimeout(r, 250));
    localStorage.clear();
    const f = document.createElement("iframe");
    f.style.cssText = "width:1000px;height:800px;border:0";
    f.src = "/";
    document.body.appendChild(f);
    await new Promise((r) => (f.onload = r));
    await new Promise((r) => setTimeout(r, 300));
    f.contentWindow.eval(src);
    f.contentWindow.__noClear = true;
    out.push(await f.contentWindow.__rec(tag, c, m, s));
    f.remove();
  }
  return out;
};
