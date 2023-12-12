import React, { StrictMode } from "react";
import { renderToString } from "react-dom/server";

import App from "./App";
import "./index.css";

export async function render(url: string, template: string) {
  return template.replace(
    '<div id="root"></div>',
    renderToString(
      <div id="root">
        <StrictMode>
          <App />
        </StrictMode>
      </div>
    )
  );
}
