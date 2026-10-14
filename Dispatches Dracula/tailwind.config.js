/** @type {import('tailwindcss').Config} */

// Colours are CSS variables, set at run time from src/themes.json by src/theme.ts (three themes). The token names are the same as ever, so every bg-*/text-*/border-* class
// in App.tsx follows the chosen theme. `rgb(var(--c-x) / <alpha-value>)` keeps opacity modifiers such as text-ink/70 working.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        void: token("void"),
        void2: token("void2"),
        parchment: token("parchment"),
        "parchment-dim": token("parchment-dim"),
        ink: token("ink"),
        "ink-soft": token("ink-soft"),
        blood: token("blood"),
        "blood-bright": token("blood-bright"),
        verdigris: token("verdigris"),
        "verdigris-bright": token("verdigris-bright"),
        brass: token("brass"),
        "brass-bright": token("brass-bright"),
        "brass-dim": token("brass-dim"),
        ash: token("ash"),
      },
      fontFamily: {
        // The display face is part of the theme (--font-display): large, sparse moments only (the title, chapter cards, drop caps). Never body copy or small chrome.
        display: ["var(--font-display)", "'Pirata One'", "Georgia", "serif"],
        heading: ["Cinzel", "Georgia", "serif"],
        body: ["'IM Fell English'", "Georgia", "'Times New Roman'", "serif"],
        broadsheet: ["'Playfair Display'", "Georgia", "serif"],
        typed: ["'Special Elite'", "'Courier New'", "monospace"],
      },
    },
  },
  plugins: [],
};
