import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

const rootHasSSRContent = document.getElementById("root")!.hasChildNodes();
if (rootHasSSRContent) {
  ReactDOM.hydrateRoot(
    document.getElementById("root")!,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
