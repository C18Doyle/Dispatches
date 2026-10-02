// Production entry point. App.jsx exports the root component but does not mount itself.
import { createRoot } from "react-dom/client";
import WW2Command from "./App.jsx";

createRoot(document.getElementById("root")).render(<WW2Command />);
