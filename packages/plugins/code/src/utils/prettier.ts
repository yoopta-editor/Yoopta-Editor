export const PRETTIER_PARSER_MAP: Record<string, string> = {
  // Built-in / Core Web Languages
  javascript: 'babel',
  typescript: 'typescript',
  jsx: 'babel',
  tsx: 'typescript',
  html: 'html',
  css: 'css',
  scss: 'scss',
  less: 'less',
  json: 'json',
  jsonc: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  vue: 'vue',
  'angular-html': 'angular',
  markdown: 'markdown',
  mdx: 'mdx',
  graphql: 'graphql',

  // Community Plugins (Require separate installation)
  php: 'php',
  sql: 'sql',
  java: 'java',
  xml: 'xml',
  python: 'python',
  bash: 'sh',
  shell: 'sh',
  zsh: 'sh',
  rust: 'rust', // prettier-plugin-rust
  toml: 'toml', // prettier-plugin-toml
};

export const PLUGIN_LOADERS: Record<string, () => Promise<any[]>> = {
  javascript: async () => [
    (await import('prettier/plugins/babel')).default,
    (await import('prettier/plugins/estree')).default,
  ],
  typescript: async () => [
    (await import('prettier/plugins/typescript')).default,
    (await import('prettier/plugins/estree')).default,
  ],
  json: async () => [
    (await import('prettier/plugins/babel')).default,
    (await import('prettier/plugins/estree')).default,
  ],
  css: async () => [(await import('prettier/plugins/postcss')).default],
  scss: async () => [(await import('prettier/plugins/postcss')).default],
  html: async () => [(await import('prettier/plugins/html')).default],
  vue: async () => [
    (await import('prettier/plugins/html')).default,
    (await import('prettier/plugins/postcss')).default,
    (await import('prettier/plugins/babel')).default,
    (await import('prettier/plugins/estree')).default,
  ],
  yaml: async () => [(await import('prettier/plugins/yaml')).default],

  // Example for third-party plugins
  // php: async () => [(await import('@prettier/plugin-php/standalone')).default],
  // sql: async () => [(await import('prettier-plugin-sql')).default],
  // xml: async () => [(await import('@prettier/plugin-xml')).default],
  // shell: async () => [(await import('prettier-plugin-sh')).default],
};
