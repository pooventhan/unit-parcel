import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ScanProvider } from "./context/ScanContext.tsx";
import "./index.css";
import "./styles/layout.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScanProvider>
        <App />
      </ScanProvider>
    </BrowserRouter>
  </React.StrictMode>
);
