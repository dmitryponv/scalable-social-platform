import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
if (rootElement && rootElement.children.length === 0) {
  createRoot(rootElement).render(React.createElement(App));
}
