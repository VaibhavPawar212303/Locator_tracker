import path from 'path';
import { defineConfig } from 'vite';
import sourcemaps from 'rollup-plugin-sourcemaps';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // recorder assets are copied to devtools output dir, so this will prevent those assets from being deleted.
    emptyOutDir: false,
    // skip code obfuscation
    minify: false,
    // chunk limit is not an issue, this is a browser extension
    chunkSizeWarningLimit: 10240,
    sourcemap: true,
    rollupOptions: {
      // @ts-ignore
      plugins: [sourcemaps()],
      input: {
        'background': path.resolve(__dirname, 'src/background.ts'),
        'options': path.resolve(__dirname, 'options.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
});
