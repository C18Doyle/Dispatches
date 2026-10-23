import React from "react";
import { createRoot } from "react-dom/client";
import App from "./dispatches-greatwar.jsx";
// The soundtrack (assets/theme.mp3, from Dispatches 1940) is bundled as a data URL: a copy opened from disk (file://) cannot fetch it, and a media element
// built on a file:// address plays silence once it goes through Web Audio. The game reads it from window.__DISPATCHES_THEME__ (src/98-sound.jsx) and plays
// nothing when it is absent, as in the validators and the test pages that load the game without this entry.
import THEME_MUSIC from "./assets/theme.mp3";
window.__DISPATCHES_THEME__ = THEME_MUSIC;
createRoot(document.getElementById("root")).render(<App />);
