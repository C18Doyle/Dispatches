// Reads a game's entry in itch.json. Two shapes are understood:
//
//   one page, one channel per release variant (older):
//     "1914": { "target": "dispatches/dispatches-1914", "channels": { "web": "web" } }
//
//   any number of pages and channels per variant (the same zip can go to several pages):
//     "1940": { "pushes": { "demo": ["dispatches/dispatches-1940:web-demo"],
//                           "full": ["dispatches/dispatches-1940:download-full", "dispatches/dispatches-1940-confidential:web-full"] } }
//
// A page that still reads REPLACE_ME, or a game with no entry, is "not set up": the release then skips the itch.io push instead of failing.

export const PUSH_FORMAT = /^[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+:[A-Za-z0-9_-]+$/;

/** Every "user/page:channel" a release variant is pushed to ([] when none). */
export function pushesFor(cfg, variant) {
  if (!cfg) return [];
  if (cfg.pushes) return (cfg.pushes[variant] ?? []).filter((p) => !/REPLACE_ME/.test(p));
  const channel = cfg.channels?.[variant];
  if (!channel || !cfg.target || /REPLACE_ME/.test(cfg.target)) return [];
  return [`${cfg.target}:${channel}`];
}

/** Every variant name the entry mentions. */
export function variantsOf(cfg) {
  if (!cfg) return [];
  return Object.keys(cfg.pushes ?? cfg.channels ?? {});
}

/** True when at least one push is configured for real. */
export function isSetUp(cfg) {
  return variantsOf(cfg).some((v) => pushesFor(cfg, v).length > 0);
}

/** The pages (user/slug) the entry pushes to, for display. */
export function pagesOf(cfg) {
  const pages = new Set();
  for (const v of variantsOf(cfg)) for (const p of pushesFor(cfg, v)) pages.add(p.split(":")[0]);
  return [...pages];
}
