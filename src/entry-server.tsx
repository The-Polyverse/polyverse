import React from "react";
import { renderToString } from "react-dom/server";

import App from "./App";
import "./index.css";

export async function render(url: string, template: string) {
  console.log("rendering", url);
  return template.replace(
    '<div id="root"></div>',
    renderToString(
      <div id="root">
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </div>
    )
  );
}
