/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      // Houndstooth: tweed on the walls, cream paper cards, stitched leather, brass buttons. The token names are shared with the other Dispatches
      // games on purpose, so App.tsx's bg-*/text-*/border-* classes take the palette without being touched.
      colors: {
        void: "#2b2118",
        void2: "#201810",
        parchment: "#f1e8d3",
        "parchment-dim": "#ded2b4",
        ink: "#241b13",
        "ink-soft": "#4a3b2d",
        blood: "#7b2a1d",
        "blood-bright": "#a63f2b",
        verdigris: "#4a5d3a",
        "verdigris-bright": "#2f6b40",
        brass: "#b8893f",
        "brass-bright": "#e0b360",
        "brass-dim": "#6b4f24",
        ash: "#b0a287",
      },
      fontFamily: {
        // fonts are bundled (scripts/fonts.mjs), not fetched at play time
        display: ["'Playfair Display'", "Georgia", "serif"],
        heading: ["Rokkitt", "Georgia", "serif"],
        body: ["Lora", "Georgia", "'Times New Roman'", "serif"],
        broadsheet: ["'Playfair Display'", "Georgia", "serif"],
        hand: ["Caveat", "'Comic Sans MS'", "cursive"],
      },
    },
  },
  plugins: [],
};
