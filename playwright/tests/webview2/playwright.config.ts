import { config as loadEnv } from 'dotenv';
loadEnv({ path: path.join(__dirname, '..', '..', '.env') });

import type { Config, PlaywrightTestOptions, PlaywrightWorkerOptions } from '@playwright/test';
import * as path from 'path';

process.env.PWPAGE_IMPL = 'webview2';

const outputDir = path.join(__dirname, '..', '..', 'test-results');
const testDir = path.join(__dirname, '..');
const config: Config<PlaywrightWorkerOptions & PlaywrightTestOptions> = {
  testDir,
  outputDir,
  timeout: 30000,
  globalTimeout: 5400000,
  workers: process.env.CI ? 1 : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  reporter: process.env.CI ? [
    ['dot'],
    ['json', { outputFile: path.join(outputDir, 'report.json') }],
    ['blob', { fileName: `${process.env.PWTEST_BOT_NAME}.zip` }],
  ] : 'line',
  projects: [],
  globalSetup: './globalSetup.ts',
};

const metadata = {
  platform: process.platform,
  headless: 'headed',
  browserName: 'webview2',
  channel: undefined,
  mode: 'default',
  video: false,
};

config.projects.push({
  name: 'webview2',
  // Share screenshots with chromium.
  snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-chromium{ext}',
  use: {
    browserName: 'chromium',
    headless: false,
  },
  testDir: path.join(testDir, 'page'),
  metadata,
});

export default config;
