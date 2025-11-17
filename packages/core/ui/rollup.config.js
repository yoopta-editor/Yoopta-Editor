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
      index: './src/index.ts',
      'floating-block-actions': './src/floating-block-actions/index.tsx',
      // portal: './src/portal.ts',
      // overlay: './src/overlay.ts',
      // 'block-options': './src/block-options.ts',
      // 'dnd-kit': './src/dnd-kit.ts',
      // toolbar: './src/toolbar.ts',
      // 'highlight-color': './src/highlight-color.ts',
      // 'action-menu': './src/action-menu.ts',
    },
    output: {
      format: 'es',
      sourcemap: process.env.NODE_ENV === 'development',
      globals: { react: 'React' },
      dir: './dist',
      entryFileNames: '[name].js',
      exports: 'named',
    },
  };
};

export default createMultiEntryConfig();
