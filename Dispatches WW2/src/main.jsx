// Production entry point. Not part of the game logic itself — App.jsx exports the root
// component (WW2Command) but has no ReactDOM mount call of its own, so something has to
// bootstrap it. This file, like build.mjs and tools/extract_campaigns.js before it, was
// missing from the delivered V6 files even though the built bundle.js in builds/ clearly
// came from one (its license banner lists react-dom-client and Tone.js as bundled deps,
// and the minified tail is a plain createRoot(...).render(<WW2Command />) call). Reconstructed
// this session to match what the existing build output implies.
import { createRoot } from "react-dom/client";
import WW2Command from "./App.jsx";

createRoot(document.getElementById("root")).render(<WW2Command />);
