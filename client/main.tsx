import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Make React globally available for JSX
(window as any).React = React;

console.log("✅ main.tsx loaded");
console.log("📦 React available globally?", (window as any).React !== undefined);
console.log("🎨 Checking CSS links...");
const links = document.querySelectorAll('link[rel="stylesheet"]');
console.log(`📋 Found ${links.length} stylesheets`);
links.forEach((link, i) => {
  console.log(`  [${i}] ${link.getAttribute("href")}`);
});

const rootElement = document.getElementById("root");

if (rootElement && rootElement.children.length === 0) {
  try {
    console.log("🚀 Creating root...");
    const root = createRoot(rootElement);
    console.log("✅ Root created");
    console.log("🎨 Rendering App...");
    root.render(React.createElement(App));
    console.log("✅ App rendered successfully!");
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
