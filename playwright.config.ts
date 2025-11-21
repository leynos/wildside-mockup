/** @file Playwright configuration for Wildside mockup e2e tests. */

import { spawnSync } from "node:child_process";
import { URL } from "node:url";

import { defineConfig, devices } from "@playwright/test";

process.env.PLAYWRIGHT_BROWSERS_PATH ??= "0";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:5173";
const parsedBaseURL = new URL(baseURL);
const basePort =
  parsedBaseURL.port !== ""
    ? Number.parseInt(parsedBaseURL.port, 10)
    : parsedBaseURL.protocol === "https:"
      ? 443
      : 80;

function serverIsReachable(target: string): boolean {
  if (process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1") {
    return true;
  }
  try {
    const url = new URL(target);
    const port = url.port ? Number.parseInt(url.port, 10) : url.protocol === "https:" ? 443 : 80;
    const hostArg = JSON.stringify(url.hostname);
    const portArg = JSON.stringify(port);
    const script = `
const net = require("node:net");
const socket = net.createConnection({ host: ${hostArg}, port: ${portArg} });
socket.on("connect", () => { socket.destroy(); process.exit(0); });
socket.on("error", () => { socket.destroy(); process.exit(1); });
setTimeout(() => { socket.destroy(); process.exit(1); }, 500);
`;
    const result = spawnSync(process.execPath, ["-e", script], { stdio: "ignore" });
    return result.status === 0;
  } catch {
    return false;
  }
}

const shouldLaunchWebServer = !serverIsReachable(baseURL);

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: ["**/*.pw.ts"],
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
  webServer: shouldLaunchWebServer
    ? {
        command: `bun run dev -- --host --port ${basePort} --strictPort`,
        url: baseURL,
        reuseExistingServer: true,
        stdout: "pipe",
        stderr: "pipe",
        timeout: 120_000,
      }
    : undefined,
});
