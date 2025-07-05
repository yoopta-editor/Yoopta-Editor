import { createRollupConfig } from '../../../config/rollup';

const pkg = require('./package.json');

// Создаем конфигурацию для множественных входных точек
const createMultiEntryConfig = () => {
  const baseConfig = createRollupConfig({
    pkg,
    tailwindConfig: { content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'], prefix: 'yoo-ui-' },
  });

  return {
    ...baseConfig,
    input: {
      index: './src/index.ts',
      portal: './src/portal.ts',
      overlay: './src/overlay.ts',
      'block-options': './src/block-options.ts',
      'floating-block-actions': './src/floating-block-actions.ts',
      'dnd-kit': './src/dnd-kit.ts',
      toolbar: './src/toolbar.ts',
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
