import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

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
            name: 'shadejs',
            fileName: 'index',
        },
    },
    plugins: [
        dts({ rollupTypes: true }),
        nodePolyfills({
            include: ['path', 'buffer'],
            globals: {
                Buffer: true,
            },
        }),
    ],
});
