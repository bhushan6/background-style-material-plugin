/* eslint-disable no-undef */
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: path.resolve(__dirname, "index.js"),
      name: "backgroundStyleMaterialPlugin",
      formats: ["es"],
      fileName: (format) => `backgroundStyleMaterialPlugin.${format}.js`,
    },
    rollupOptions: {
      external: ["@babylonjs/core"],
    },
  },
});
