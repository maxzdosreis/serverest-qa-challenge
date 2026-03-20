import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: process.env.CI ? 2 : 1,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    },
  },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
    },
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: {
        baseURL: process.env.FRONT_URL,
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
  ],
});
