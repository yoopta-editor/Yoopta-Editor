import { createRollupConfig } from '../../../config/rollup';

const pkg = require('./package.json');

const config = createRollupConfig({
  pkg,
  tailwindConfig: { content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'], prefix: 'yoo-code-' },
});

// Fix for shiki dynamic imports - inline them to avoid multiple chunks
config.output[0].inlineDynamicImports = true;

export default config;
