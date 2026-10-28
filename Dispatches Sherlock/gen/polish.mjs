// The copy-edit pass. Everything the generator assembles goes through here once, just before it is written, and the same rules run every build, so a
// new scene is edited exactly as an old one is. It is rules, not hand edits to the text: the rules are the house style, and scripts/check_prose.mjs holds
// the result to a budget (phrase counts, sentence length, each speaker's voice) so that the habits cannot creep back.
//   1. intensifiers: "very", "perfectly", "quite", "rather" and "a good deal" thinned out (a word that is on every line says nothing)
//   2. closers: an outcome that ends on a reflective "It is..." sentence loses most of them
//   3. long sentences split where the second half can stand on its own
//   4. shape: some quotes go silent, some long scenes break into two paragraphs
//   5. voices: each speaker's quotes held to a length and to the speaker's diction (gen/voices.mjs)
//   6. a table of rewrites for the stock constructions that remain
import { VOICES, KEEP } from "./voices.mjs";
import { REWRITES } from "./rewrites.mjs";

const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const isCaps = (s) => /[A-Z]/.test(s) && s === s.toUpperCase();
const stats = {};
const bump = (k, n = 1) => (stats[k] = (stats[k] ?? 0) + n);

// ───────────── sentences ─────────────
const splitSentences = (t) => t.split(/(?<=[.!?]["”]?)\s+(?=["“]?[A-Z])/);
const words = (t) => t.split(/\s+/).filter(Boolean).length;
const upFirst = (t) => t.replace(/^(["“']?)([a-z])/, (_m, q, c) => q + c.toUpperCase());

// ───────────── 1. intensifiers ─────────────
/** "a" or "an" for the word that now follows it. */
const article = (next) => (/^(?:[aeio]|un|um|up|hour|honest|heir)/i.test(next) && !/^(?:one|once|eu|uni|use|usu)/i.test(next) ? "an" : "a");
const withArticle = (art, next) => (art ? (art[0] === art[0].toUpperCase() ? article(next).replace(/^./, (c) => c.toUpperCase()) : article(next)) + " " : "");
const KEEP_VERY = /^(much|little|well|few|many|same|own|first|last|least|best|worst|moment|thing|end|day|top|edge|man|one|idea|beginning|bottom)\b/;
function intensifiers(text, key) {
  let t = text;
  // "very": dropped unless it is the emphatic "the very thing" or part of a stock phrase
  t = t.replace(/(\bthe |\bthis |\bthat |\bits |\bhis |\bher |\btheir |\b[Aa]n? )?\bvery (\S+)/g, (m, pre, next) => {
    if (KEEP_VERY.test(next)) return m;
    if (pre && !/^an? $/i.test(pre)) return m;
    bump("very");
    return pre ? withArticle(pre.trim(), next) + next : next;
  });
  // "perfectly" before an adjective: dropped two times in three
  t = t.replace(/(\b[Aa]n? )?\bperfectly (?!well\b|right\b|all\b)(\S+)/g, (m, pre, next) => {
    if (hash(key + m + next) % 3 === 0) return m;
    bump("perfectly");
    return (pre ? withArticle(pre.trim(), next) : "") + next;
  });
  // "quite" and "rather": dropped half the time, never in a stock phrase
  t = t.replace(/(\b[Aa]n? )?\b(quite|rather) (?!so\b|right\b|than\b|a few\b|a lot\b|the\b|well\b)(\S+)/g, (m, pre, w, next) => {
    if (hash(key + m) % 2 === 0) return m;
    bump(w);
    return (pre ? withArticle(pre.trim(), next) : "") + next;
  });
  // "a good deal": "much" before a comparison or a noun, a third of them kept
  t = t.replace(/\ba good deal (more|less|better|worse|longer|larger|smaller|easier|harder|higher|lower|wiser|older|younger|colder|warmer)\b/g, (m, w) => {
    if (hash(key + m) % 3 === 0) return m;
    bump("good deal");
    return "much " + w;
  });
  t = t.replace(/\ba good deal of (\S+)/g, (m, next) => {
    const pick = hash(key + m) % 4;
    if (pick === 0) return m;
    bump("good deal");
    return (pick === 1 ? "much" : pick === 2 ? "plenty of" : "more than a little") + " " + next;
  });
  // "you find that you ...": the finding is implied
  t = t.replace(/\b(Y|y)ou find that you (\w+)/g, (m, y, verb) => {
    if (hash(key + m) % 4 === 0) return m;
    bump("you find");
    return y + "ou " + verb;
  });
  return t;
}

// ───────────── 2. closers ─────────────
function closers(text, key) {
  const ss = splitSentences(text);
  if (ss.length < 4) return text;
  const last = ss[ss.length - 1];
  if (!/^It (is|was) /.test(last) || words(last) > 28) return text;
  if (hash(key + last) % 20 >= 11) return text;
  bump("closer");
  return ss.slice(0, -1).join(" ");
}

// ───────────── 3. long sentences ─────────────
const SUBJECT = "(he|she|it|you|they|there|his|her|your|the|a|an|its|we|i|nobody|nothing|everything|somebody|someone)";
function longSentences(text) {
  const ss = splitSentences(text);
  let changed = false;
  const out = ss.map((s) => {
    let cur = s;
    for (let guard = 0; guard < 3 && words(cur) > 40; guard++) {
      if (cur.includes("“") || cur.includes("”")) break;
      const re = new RegExp(`, (and|but) ${SUBJECT} `, "gi");
      let m;
      let cut = -1;
      let cutWord = "and";
      while ((m = re.exec(cur))) {
        const before = words(cur.slice(0, m.index));
        const after = words(cur.slice(m.index + 2));
        if (before >= 12 && after >= 8) {
          cut = m.index;
          cutWord = m[1];
          break;
        }
      }
      if (cut < 0) {
        const semi = cur.search(/; (?=[a-z])/);
        if (semi > 0 && words(cur.slice(0, semi)) >= 10 && words(cur.slice(semi + 2)) >= 8) {
          cur = cur.slice(0, semi) + ". " + upFirst(cur.slice(semi + 2));
          bump("split");
          changed = true;
          continue;
        }
        break;
      }
      cur = cur.slice(0, cut) + ". " + (cutWord.toLowerCase() === "but" ? "But " + cur.slice(cut + 7) : upFirst(cur.slice(cut + 6)));
      bump("split");
      changed = true;
    }
    return cur;
  });
  return changed ? out.join(" ") : text;
}

// ───────────── 6. rewrites ─────────────
const usedRewrites = new Set();
function rewrites(text) {
  let t = text;
  for (const [from, to] of REWRITES) {
    if (t.includes(from)) {
      t = t.split(from).join(to);
      usedRewrites.add(from);
      bump("rewrite");
    }
  }
  return t;
}

// ───────────── 5. voices ─────────────
function voice(speaker, text, key) {
  const v = VOICES[speaker];
  if (!v) return text;
  let t = text;
  for (const [re, to] of v.swap ?? []) t = t.replace(re, to);
  if (v.noSemicolon) t = t.replace(/; (\S)/g, (_m, c) => ". " + c.toUpperCase());
  if (v.noExclaim) t = t.replace(/!/g, ".");
  // too long for the speaker: whole sentences are dropped from the end, never mid-sentence
  // (only a quote well over the limit is cut, the middle sentences go first so that a quote keeps the one that sets it up and the one that lands,
  // and a quote that carries a fact the story needs is exempt: gen/voices.mjs KEEP)
  if (v.maxWords && words(t) > v.maxWords * 1.25 && !KEEP.has(key)) {
    const ss = splitSentences(t);
    while (ss.length > 2 && words(ss.join(" ")) > v.maxWords) ss.splice(1, 1);
    if (ss.join(" ") !== t) {
      bump("voice trim");
      if (process.env.POLISH_REPORT === "trims") console.log("  trim " + key + ": " + ss.join(" "));
    }
    t = ss.join(" ");
  }
  return t;
}

// ───────────── the pass ─────────────
const prose = (t, key, { closer = false } = {}) => {
  if (typeof t !== "string" || !t || isCaps(t)) return t;
  let out = rewrites(t);
  out = intensifiers(out, key);
  if (closer) out = closers(out, key);
  out = longSentences(out);
  return out;
};

export function polish({ nodes, endings, interludes, flavor }) {
  for (const [id, n] of Object.entries(nodes)) {
    n.description = prose(n.description, id + ":d");
    for (const e of n.echoes ?? []) e.text = prose(e.text, id + ":e");
    n.options.forEach((o, i) => {
      const k = `${id}:${i}`;
      o.detail = prose(o.detail, k + ":detail");
      o.outcome = prose(o.outcome, k + ":o", { closer: true });
      if (o.roll) {
        o.roll.success.outcome = prose(o.roll.success.outcome, k + ":ok", { closer: true });
        o.roll.failure.outcome = prose(o.roll.failure.outcome, k + ":bad", { closer: true });
      }
      if (o.quote) o.quote.text = voice(o.quote.speaker, prose(o.quote.text, k + ":q"), k);
    });
  }
  for (const [id, e] of Object.entries(endings)) {
    e.text = prose(e.text, id + ":t");
    for (const [i, v] of (e.variants ?? []).entries()) v.text = prose(v.text, `${id}:v${i}`);
  }
  for (const [id, it] of Object.entries(interludes)) it.bodyText = prose(it.bodyText, id + ":b");
  // 4. shape: some options are silent (an empty quote: nobody speaks, and the UI draws nothing), so that not every choice ends on a line of dialogue
  const SILENT = { "Dr Watson": 4, "Inspector Lestrade": 5, "Your own notebook": 2, "Your own reflection": 2, "Your own conscience": 2, "Wiggins": 6 };
  for (const [id, n] of Object.entries(nodes)) {
    n.options.forEach((o, i) => {
      const every = SILENT[o.quote?.speaker];
      if (every && hash(id + ":" + i + ":silent") % every === 0 && !KEEP.has(id + ":" + i)) {
        o.quote = { speaker: "", text: "" };
        bump("silent");
      }
    });
  }
  // 4. shape: paragraphs
  for (const [id, n] of Object.entries(nodes)) {
    const ss = splitSentences(n.description);
    if (words(n.description) >= 100 && ss.length >= 5 && !n.description.includes("\n") && hash(id + ":para") % 3 === 0) {
      let acc = 0;
      const total = words(n.description);
      let at = 0;
      for (let i = 0; i < ss.length - 1; i++) {
        acc += words(ss[i]);
        if (acc >= total * 0.4) {
          at = i + 1;
          break;
        }
      }
      if (at > 0 && at < ss.length) {
        n.description = ss.slice(0, at).join(" ") + "\n\n" + ss.slice(at).join(" ");
        bump("paragraph");
      }
    }
  }
  const stale = REWRITES.filter(([from]) => !usedRewrites.has(from)).map(([from]) => from);
  if (stale.length) throw new Error(`gen/rewrites.mjs: ${stale.length} rewrite(s) match no text any more:\n  ${stale.map((s) => s.slice(0, 90)).join("\n  ")}`);
  return stats;
}
