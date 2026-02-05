import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

console.log("✅ main.tsx loaded");

const rootElement = document.getElementById("root");

if (rootElement && rootElement.children.length === 0) {
  try {
    console.log("🚀 Creating root...");
    const root = createRoot(rootElement);
    console.log("✅ Root created");
    console.log("🎨 Rendering...");
    root.render(React.createElement(App));
    console.log("✅ Rendered!");
  } catch (error) {
    console.error("❌ ERROR:", error);
    const err = error as any;
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: monospace;">
        <h2>Error Rendering App</h2>
        <p>${err.message}</p>
        <pre>${err.stack}</pre>
      </div>
    `;
  }
}

// Catch runtime errors in components
window.addEventListener("error", (event) => {
  console.error("🔴 Runtime error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("🔴 Promise rejection:", event.reason);
});
