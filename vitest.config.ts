import { defineConfig } from 'vitest/config';
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
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 2,
        maxThreads: 4,
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    reporters: ['default', 'verbose'],
    outputFile: {
      verbose: './test-results/verbose.log',
    },
    onConsoleLog(log, type) {
      console.log(`[${type}] ${log}`);
      return false;
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.config.ts',
        '**/types.ts',
      ],
      all: true,
      clean: true,
      cleanOnRerun: true,
    },
  },
  resolve: {
    alias: {
      'test-utils': resolve(__dirname, 'tests/test-utils.tsx'),
    },
  },
});
