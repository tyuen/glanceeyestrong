import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    headless: !!process.env.CI,
    launchOptions: {
      slowMo: process.env.CI ? 0 : 350,
    },
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    reuseExistingServer: !process.env.CI,
    url: 'http://127.0.0.1:5173',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
