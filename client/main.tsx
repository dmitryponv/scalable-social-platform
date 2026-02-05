import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

console.log("✅ main.tsx module loaded");
console.log("📦 React available?", typeof React !== "undefined");
console.log(
  "📦 React.createElement available?",
  typeof React.createElement !== "undefined",
);
console.log("📦 createRoot available?", typeof createRoot !== "undefined");
console.log("📦 App available?", typeof App !== "undefined");

const rootElement = document.getElementById("root");
console.log("🎯 rootElement found?", rootElement !== null);
console.log("🎯 rootElement children:", rootElement?.children.length);

if (rootElement && rootElement.children.length === 0) {
  console.log("🚀 Creating React root...");
  try {
    const root = createRoot(rootElement);
    console.log("✅ Root created successfully");
    console.log("🎨 Rendering App component...");
    root.render(React.createElement(App));
    console.log("✅ App rendered successfully");
  } catch (error) {
    console.error("❌ Error:", error);
    console.error("❌ Stack:", (error as Error).stack);
  }
} else {
  console.warn("⚠️ Root element not found or already has children");
}
