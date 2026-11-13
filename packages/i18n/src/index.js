// @dispatches/i18n: the language layer shared by the games. No dependencies. See docs/LOCALISATION.md.
//
// The English text is the key. `t("Continue")` returns the translation of "Continue" in the current language, or "Continue" itself
// when there is none, so a line that has been edited in English simply falls back to English until it is translated again.
//
//   t("Continue")
//   t("{n} situation reports discovered", { n: 12 })
//   t("{n, plural, one {# war} other {# wars}} fought", { n: 3 })          (# is the number; forms follow Intl.PluralRules)
//   t("Close", { context: "map" })                                          (context picks the entry "map|Close" when there is one)
//
// Data written at module level (tables, lists) is marked with T("English"), which is the identity function: the extractor finds the
// string, and the place that shows it calls t(...) on it.

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "zh-Hans", name: "简体中文" },
  { code: "ru", name: "Русский" },
  { code: "de", name: "Deutsch" },
  { code: "pt-BR", name: "Português (Brasil)" },
  { code: "es", name: "Español" },
  { code: "it", name: "Italiano" },
];

// Languages a game adds for itself (addLanguages): only that game offers them, so a game without their tables never shows them.
const EXTRA = [];
const CODES = LANGUAGES.map((l) => l.code);
const codes = () => [...CODES, ...EXTRA.map((l) => l.code)];

/** Adds languages this game has tables for, beyond the shared LANGUAGES: [{ code, name }]. */
export function addLanguages(list) {
  for (const l of list || []) if (l && l.code && !codes().includes(l.code)) EXTRA.push({ code: l.code, name: l.name || l.code });
}

/** Every language this game offers: the shared LANGUAGES and any it added. Use this for the language picker. */
export function languages() {
  return [...LANGUAGES, ...EXTRA];
}
let tables = {};
let current = "en";
const listeners = new Set();
let storageKey = null;

/** The text marker for data written at module level: returns its argument. The extractor treats T("...") like t("..."). */
export const T = (s) => s;

/** Adds translation tables: { "ru": { "Continue": "Продолжить", ... }, ... }. A later call adds to what is there. */
export function registerTables(add) {
  for (const [lang, table] of Object.entries(add || {})) tables[lang] = { ...(tables[lang] || {}), ...table };
}

export function getLanguage() {
  return current;
}

export function hasLanguage(code) {
  return codes().includes(code) || code === "pseudo";
}

/** Picks the best of our languages for a list of browser languages ("de-AT" gives "de", "zh-CN" gives "zh-Hans", "pt-PT" gives "pt-BR"). */
export function matchLanguage(browserLanguages) {
  for (const raw of browserLanguages || []) {
    const l = String(raw || "").toLowerCase();
    const all = codes();
    if (all.some((c) => c.toLowerCase() === l)) return all.find((c) => c.toLowerCase() === l);
    if (l.startsWith("zh")) return "zh-Hans";
    if (l.startsWith("pt")) return "pt-BR";
    const base = l.split("-")[0];
    const hit = all.find((c) => c.toLowerCase() === base);
    if (hit) return hit;
  }
  return "en";
}

export function setLanguage(code, { persist = true } = {}) {
  const next = hasLanguage(code) ? code : "en";
  if (next === current) return current;
  current = next;
  if (typeof document !== "undefined" && document.documentElement) document.documentElement.lang = next === "pseudo" ? "en" : next;
  if (persist && storageKey) {
    try {
      localStorage.setItem(storageKey, next);
    } catch (e) {
      /* storage may be blocked */
    }
  }
  listeners.forEach((fn) => fn());
  return current;
}

/**
 * Starts the layer for a game: reads the stored language (else matches the browser's), and remembers where to keep it.
 * Call once, before the first render.
 */
export function initLanguage({ key, browserLanguages } = {}) {
  storageKey = key || null;
  let stored = null;
  if (storageKey) {
    try {
      stored = localStorage.getItem(storageKey);
    } catch (e) {
      /* none */
    }
  }
  // ?lang=de in the address chooses a language for this visit (and "pseudo" marks every translated text, to find the ones that are not)
  let fromUrl = null;
  try {
    fromUrl = typeof location !== "undefined" ? new URLSearchParams(location.search).get("lang") : null;
  } catch (e) {
    /* none */
  }
  if (fromUrl && hasLanguage(fromUrl)) {
    setLanguage(fromUrl, { persist: false });
    return current;
  }
  const langs = browserLanguages || (typeof navigator !== "undefined" ? navigator.languages || [navigator.language] : []);
  // a stored choice wins; with none, the browser's language is used for this visit only and not saved until the player picks one
  setLanguage(hasLanguage(stored) ? stored : matchLanguage(langs), { persist: false });
  return current;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ---- messages ------------------------------------------------------------------------------------------------------

/** Finds the end of the brace group that opens at s[i] === "{" and returns its index. */
function closeOf(s, i) {
  let depth = 0;
  for (let k = i; k < s.length; k++) {
    if (s[k] === "{") depth++;
    else if (s[k] === "}") {
      depth--;
      if (depth === 0) return k;
    }
  }
  return -1;
}

/** Fills a message: {name} from params, and {name, plural, one {...} other {...}} by the language's plural rules. */
export function format(msg, params, lang = current) {
  if (!params || msg.indexOf("{") < 0) return msg;
  let out = "";
  for (let i = 0; i < msg.length; i++) {
    const ch = msg[i];
    if (ch !== "{") {
      out += ch;
      continue;
    }
    const end = closeOf(msg, i);
    if (end < 0) {
      out += msg.slice(i);
      break;
    }
    const body = msg.slice(i + 1, end);
    const comma = body.indexOf(",");
    if (comma < 0) {
      const v = params[body.trim()];
      out += v === undefined || v === null ? `{${body}}` : v === false || v === true ? "" : String(v);
    } else {
      const name = body.slice(0, comma).trim();
      const rest = body.slice(comma + 1).trim();
      if (rest.startsWith("plural")) {
        const forms = {};
        const spec = rest.slice("plural".length).replace(/^\s*,/, "");
        for (let k = 0; k < spec.length; k++) {
          if (/\s/.test(spec[k])) continue;
          let j = k;
          while (j < spec.length && spec[j] !== "{" && !/\s/.test(spec[j])) j++;
          const key = spec.slice(k, j);
          while (j < spec.length && /\s/.test(spec[j])) j++;
          if (spec[j] !== "{") break;
          const e2 = closeOf(spec, j);
          if (e2 < 0) break;
          forms[key] = spec.slice(j + 1, e2);
          k = e2;
        }
        const n = Number(params[name]);
        let form = "other";
        try {
          form = new Intl.PluralRules(lang).select(n);
        } catch (e) {
          /* keep other */
        }
        const exact = forms["=" + n];
        const pick = exact !== undefined ? exact : forms[form] !== undefined ? forms[form] : forms.other !== undefined ? forms.other : "";
        out += format(pick.replace(/#/g, String(n)), params, lang);
      } else {
        out += `{${body}}`;
      }
    }
    i = end;
  }
  return out;
}

/** The text for a message in the current language. */
export function t(msg, params) {
  if (current === "pseudo") return "⟦" + format(msg, params, "en") + "⟧";
  let text = msg;
  const table = tables[current];
  if (table && current !== "en") {
    const ctx = params && params.context;
    const hit = (ctx && table[ctx + "|" + msg]) || table[msg];
    if (typeof hit === "string" && hit) text = hit;
  }
  return format(text, params, current);
}

/** Every text in the current language starts with the one a message was written in (the key), so a table can be checked against the source. */
export function tablesOf() {
  return tables;
}
