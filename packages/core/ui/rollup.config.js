// eslint-disable-next-line import/no-relative-packages
import { createRollupConfig } from '../../../config/rollup';

const pkg = require('./package.json');

const createMultiEntryConfig = () => {
  const baseConfig = createRollupConfig({
    pkg,
    tailwindConfig: { content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'], prefix: 'yoo-ui-' },
  });

  return {
    ...baseConfig,
    input: {
      // Main entry (includes all components for convenience)
      index: './src/index.ts',

      // Individual component entries (for tree-shaking)
      'floating-block-actions': './src/floating-block-actions/index.tsx',
      toolbar: './src/toolbar/index.ts',
      'action-menu-list': './src/action-menu-list/index.ts',
      'slash-command-menu': './src/slash-command-menu/index.ts',
      'block-options': './src/block-options/index.ts',
      'highlight-color-picker': './src/highlight-color-picker/index.ts',
      'selection-box': './src/selection-box/index.ts',
      'element-options': './src/element-options/index.ts',
      portal: './src/portal/index.ts',
      overlay: './src/overlay/index.ts',
      theme: './src/theme/index.ts',
    },
    output: {
      format: 'es',
      sourcemap: process.env.NODE_ENV === 'development',
      globals: { react: 'React' },
      dir: './dist',
      entryFileNames: '[name].js',
      chunkFileNames: 'chunks/[name]-[hash].js',
      exports: 'named',
    },
  };
};

export default createMultiEntryConfig();
