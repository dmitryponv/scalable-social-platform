import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
if (rootElement) {
  // Check if element is empty to prevent double renders
  if (rootElement.children.length === 0) {
    createRoot(rootElement).render(
      React.createElement(App)
    );
  }
}
