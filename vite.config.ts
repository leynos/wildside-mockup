import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const repoBasePath = "/radix-daisyui-playground/";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKEN_OUTPUTS = [
  path.resolve(__dirname, "tokens/dist/tokens.css"),
  path.resolve(__dirname, "tokens/dist/tailwind.theme.cjs"),
];

function watchGeneratedTokens() {
  return {
    name: "watch-generated-design-tokens",
    configureServer(server) {
      for (const file of TOKEN_OUTPUTS) {
        server.watcher.add(file);
      }
    },
    handleHotUpdate(context) {
      if (TOKEN_OUTPUTS.includes(context.file)) {
        context.server.ws.send({ type: "full-reload" });
      }
    },
  };
}

export default defineConfig({
  // Configure GitHub Pages project deployments to resolve assets from /<repo>/.
  base: repoBasePath,
  plugins: [tailwindcss(), react(), watchGeneratedTokens()],
});
