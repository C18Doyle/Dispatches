import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { applyTheme, loadTheme } from "./theme";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("root element missing");

// the colours are variables: set them before the first paint
applyTheme(loadTheme());

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
