import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  let alias = {};

  if (mode === "development") {
    alias = {
      ["backgroundstyle-material-plugin"]: path.resolve(
        __dirname,
        "../package/index.js",
      ),
    };
  }

  return {
    resolve: {
      alias: alias,
    },
    plugins: [],
  };
});
