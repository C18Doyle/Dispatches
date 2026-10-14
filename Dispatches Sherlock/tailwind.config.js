/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      // Gaslit London: a green-black ground like fog behind a lamp, cream
      // case-paper, one oxblood accent and warm brass. The token names are
      // shared with the other Dispatches games on purpose, so App.tsx's
      // bg-*/text-*/border-* classes pick the palette up without being touched.
      colors: {
        void: "#0b0f0d",
        void2: "#131916",
        parchment: "#F0E8D4",
        "parchment-dim": "#d9cfb6",
        ink: "#16130f",
        "ink-soft": "#3b362d",
        blood: "#7d2230",
        "blood-bright": "#b23244",
        verdigris: "#3d5c45",
        "verdigris-bright": "#3A754A",
        brass: "#a8884a",
        "brass-bright": "#d3b56c",
        "brass-dim": "#5f4e2b",
        ash: "#8f897a",
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        heading: ["Cinzel", "Georgia", "serif"],
        body: ["'IM Fell English'", "Georgia", "'Times New Roman'", "serif"],
        broadsheet: ["'Playfair Display'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
