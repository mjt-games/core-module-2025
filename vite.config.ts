// vite.config.ts
import { defineConfig, Plugin } from "vitest/config";
import ViteRestart from "vite-plugin-restart";

import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const assemblyWatcherPlugin = () => {
  let isBuilding = false;
  return {
    name: "vite-plugin-assemblyscript-pnpm-build",
    configureServer(server: any) {
      const watchDir = path.resolve(__dirname, "assembly");

      fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
        if (isBuilding) return;
        if (filename?.endsWith(".ts")) {
          isBuilding = true;

          console.log(
            `[asc] Change detected in ${filename}, running pnpm build...`
          );
          const build = spawn("pnpm", ["run", "build"], {
            stdio: "inherit",
            shell: true,
          });

          build.on("exit", (code) => {
            isBuilding = false;
            if (code === 0) {
              console.log(`[asc] Build completed`);
              server.ws.send({ type: "full-reload" }); // reload Vite in dev mode
            } else {
              console.error(`[asc] Build failed with code ${code}`);
            }
          });
        }
      });
    },
  };
};

export default defineConfig({
  assetsInclude: ["**/*.wasm"], // Include binary files
  plugins: [
    assemblyWatcherPlugin(), // Custom plugin to watch AssemblyScript files
  ],
  test: {
    environment: "node", // Use 'node' or 'jsdom' as needed
  },
});
