import path from 'path';
import recorderConfig from '../playwright/packages/recorder/vite.config';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import assert from 'assert';

const userRecorderConfig = recorderConfig as UserConfig;

// https://vitejs.dev/config/
export default defineConfig({
  ...userRecorderConfig,
  plugins: [
    ...userRecorderConfig.plugins!,
    {
      name: 'playwright-bundle',
      transformIndexHtml: {
        order: 'pre',
        handler: (html) => {
          // inject contentscript.ts in the recorder
          const result = html.replace(`<script type="module" src="/src/index.tsx"></script>`, `
          <script type="module" src="../../../recorder/src/contentscript.ts"></script>
          <script type="module" src="/src/index.tsx"></script>
          `);
          assert(html !== result, 'html should have been changed');
          return result;
        }
      },
    }
  ],
  base: './',
  root: '../playwright/packages/recorder',
  build: {
    ...userRecorderConfig.build,
    emptyOutDir: false,
    outDir: path.resolve(__dirname, './dist'),
  },
  optimizeDeps: {
    include: [
      path.resolve(__dirname, './src/contentscript.ts'),
    ],
  },
});
