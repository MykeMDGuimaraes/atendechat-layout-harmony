import { createRoot } from "react-dom/client";
import CssBaseline from "@material-ui/core/CssBaseline";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <CssBaseline>
    <App />
  </CssBaseline>
);
