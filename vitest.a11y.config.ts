import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.a11y.test.ts", "tests/**/*.a11y.test.tsx"],
    environment: "jsdom",
    setupFiles: ["tests/setup-vitest-a11y.ts"],
    globals: true,
    reporters: "default",
    coverage: {
      enabled: false,
    },
    css: false,
  },
});
