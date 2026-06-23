import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

// ─── Quality Gates ───────────────────────────────────────────────────────────
const QUALITY_GATES = {
  maxFailures: 0,           // Zero tolerance en main branch
  timeout: 30_000,          // 30s por test
  navigationTimeout: 15_000,
  minPassRate: 100,         // 100% pass rate requerido
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  maxFailures: process.env.CI ? QUALITY_GATES.maxFailures : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['allure-playwright', { outputFolder: 'reports/allure-results' }],
    ...(process.env.CI ? [['github'] as ['github']] : []),
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://reqres.in',
    timeout: QUALITY_GATES.timeout,
    navigationTimeout: QUALITY_GATES.navigationTimeout,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(process.env.API_KEY ? { 'x-api-key': process.env.API_KEY } : {}),
    },
  },

  projects: [
    {
      name: 'API Tests',
      testMatch: '**/tests/api/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'E2E Tests',
      testMatch: '**/tests/e2e/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Regression',
      testMatch: '**/tests/regression/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  outputDir: 'reports/test-artifacts',
});
