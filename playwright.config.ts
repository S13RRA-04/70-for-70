import { defineConfig, devices } from "@playwright/test";
import { FINANCE_API_TEST_KEY } from "./tests/e2e/finance-test-key";

const baseURL = "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      SITE_LIVE: "true",
      CAMPAIGN_LIVE: "true",
      // Test-only key so tests/e2e/finance-api.spec.ts can exercise auth and validation.
      FINANCE_API_KEY: FINANCE_API_TEST_KEY,
    },
  },
});
