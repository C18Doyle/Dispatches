/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      // Penny Dreadful Woodcut palette (per Craig's approved UI-style
      // comparison: https://claude.ai/artifact/1Z7fANEH3oZhFqLjMnkeXk, style
      // 4) — near-black ground, off-white engraved parchment, one red
      // accent, everything else demoted to a muted bone/stone gray. The
      // token *names* are unchanged on purpose so every existing bg-*/
      // text-*/border-* class across App.tsx picks up the new palette
      // without being touched individually.
      colors: {
        void: "#0a0a0a",
        void2: "#141414",
        parchment: "#EDEAE0",
        "parchment-dim": "#d7d2c4",
        ink: "#0f0f0e",
        "ink-soft": "#3a3a37",
        blood: "#8a231f",
        "blood-bright": "#BE2A26",
        verdigris: "#3d5c45",
        "verdigris-bright": "#3A754A",
        brass: "#8f887a",
        "brass-bright": "#b8b2a2",
        "brass-dim": "#4a463f",
        ash: "#847f74",
      },
      fontFamily: {
        // True blackletter (UnifrakturMaguntia) read as too hard to read at
        // the menu title's size per Craig — toned down one notch to Pirata
        // One, a gothic display face with real letterforms rather than
        // calligraphic strokes: still dramatic, but legible. Reserved for
        // large/sparse dramatic moments only (the menu title, chapter
        // cards) — both already use font-display, so this alone reskins
        // them without touching App.tsx. Never applied to body copy or
        // small UI chrome.
        display: ["'Pirata One'", "Georgia", "serif"],
        heading: ["Cinzel", "Georgia", "serif"],
        body: ["'IM Fell English'", "Georgia", "'Times New Roman'", "serif"],
        broadsheet: ["'Playfair Display'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
