import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

const rootHasSSRContent = document.getElementById("root")!.hasChildNodes();
if (rootHasSSRContent) {
  ReactDOM.hydrateRoot(
    document.getElementById("root")!,
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
