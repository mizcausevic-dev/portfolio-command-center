import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// FX effect library first, app styles second: app's own card border/radius/background
// win on shared properties, FX only contributes the ::before/::after effect layers.
import "./fx-Claude.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
