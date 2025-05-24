import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';
import type { UserConfig as VitestConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      exportAsDefault: true,
      svgrOptions: {},
      include: '**/*.svg',
    }),
  ],
  test: {
    css: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    include: ['packages/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      'packages/development',
      'packages/development/**/*.{test,spec}.{ts,tsx}',
    ],
  },
  resolve: {
    alias: {
      'test-utils': resolve(__dirname, 'tests/test-utils.tsx'),
    },
  },
} as VitestConfig);
