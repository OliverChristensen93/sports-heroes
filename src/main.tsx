import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { PicksProvider } from "./contexts/PicksContext.tsx";

createRoot(document.getElementById("root")!).render(
  <PicksProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PicksProvider>
);
