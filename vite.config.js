// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import dts from 'vite-plugin-dts';
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
        manifest: true,
        minify: true,
        reportCompressedSize: true,
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'index',
            formats: ['es', 'cjs'],
        },
    },
    plugins: [dts({ rollupTypes: true })],
});
