import { defineConfig } from 'vite';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import dts from 'vite-plugin-dts';
// eslint-disable-next-line import/no-extraneous-dependencies
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({

  // @ts-ignore
  // vitest configs
  test: {
    globals: true,
  },

  resolve: {
    alias: {
      '~': `${path.resolve(__dirname, 'src')}`,
    },
  },

  build: {
    target: 'node',
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ShadeJS',
      fileName: 'shade-js',
    },
  },
  plugins: [
    dts({ rollupTypes: true }),
    nodePolyfills({
      include: ['path']
    }),
  ],
});
