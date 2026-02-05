console.log("📝 PostCSS config loaded");
console.log("🎨 Tailwind CSS will process content from:", {
  cwd: process.cwd(),
  clientDir: "./client/**/*.{ts,tsx}",
  indexHtml: "./index.html",
});

export default {
  plugins: {
    tailwindcss: {
      // Enable debug mode
      config: "./tailwind.config.ts",
    },
    autoprefixer: {},
  },
};
