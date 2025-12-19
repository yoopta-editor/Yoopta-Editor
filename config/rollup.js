// const json = require('rollup-plugin-json');
const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');
const terser = require('@rollup/plugin-terser');
const svgr = require('@svgr/rollup');
const autoprefixer = require('autoprefixer');
const postcssNesting = require('postcss-nesting');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const postcss = require('rollup-plugin-postcss');
const sourceMaps = require('rollup-plugin-sourcemaps');
const typescript = require('rollup-plugin-typescript2');
const tailwindcss = require('tailwindcss');

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

function getPlugins({ tailwindConfig }) {
  const postcssPlugins = [postcssNesting(), autoprefixer()];

  // Add Tailwind only if tailwindConfig is provided
  if (tailwindConfig) {
    const { content, theme, ...restConfig } = tailwindConfig;

    postcssPlugins.unshift(
      tailwindcss({
        content: content || ['./src/**/*.{js,ts,jsx,tsx}'],
        theme: theme || {
          extend: {},
        },
        plugins: [],
        ...restConfig,
      }),
    );
  }

  return [
    peerDepsExternal(),
    commonjs(),
    nodeResolve(),
    svgr({
      typescript: true,
    }),
    postcss({
      plugins: postcssPlugins,
      extract: false,
      modules: {
        generateScopedName: isProd ? '[hash:base64:8]' : '[name]_[local]',
      },
      autoModules: true,
      minimize: true,
      use: ['sass'],
    }),
    typescript({
      clean: true,
      check: true,
      abortOnError: false,
      tsconfig: `./tsconfig.json`,

      tsconfigOverride: {
        compilerOptions: {
          declarationDir: isProd ? './dist/types' : undefined,
        },
      },
    }),
    sourceMaps(),
    replace({
      exclude: 'node_modules/**',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true,
    }),
    isProd && terser(),
  ].filter(Boolean);
}

/**
 * @type {import('rollup').RollupOptions}
 */
export function createRollupConfig({ pkg, tailwindConfig, outputOptions }) {
  return {
    input: `./src/index.ts`,
    output: [
      {
        format: 'es',
        sourcemap: isDev,
        globals: { react: 'React' },
        file: `./${pkg.module}`,
        exports: 'named',
        ...outputOptions,
      },
    ],
    plugins: getPlugins({ tailwindConfig }),
    cache: isDev,
    external: [...Object.keys(pkg.peerDependencies)],
  };
}
