import { createRollupConfig } from '../../../config/rollup';

const pkg = require('./package.json');
export default createRollupConfig({
  pkg,
  tailwindConfig: { content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'] },
});
