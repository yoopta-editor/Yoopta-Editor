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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PLUGIN_LOADERS: Record<string, () => Promise<unknown[]>> = {
  javascript: async () => [
    (await import('prettier/plugins/babel')).default,
    (await import('prettier/plugins/estree')).default,
  ],
  jsx: async () => [
    (await import('prettier/plugins/babel')).default,
    (await import('prettier/plugins/estree')).default,
  ],
  typescript: async () => [
    (await import('prettier/plugins/typescript')).default,
    (await import('prettier/plugins/estree')).default,
  ],
  tsx: async () => [
    (await import('prettier/plugins/typescript')).default,
    (await import('prettier/plugins/estree')).default,
  ],
  json: async () => [
    (await import('prettier/plugins/babel')).default,
    (await import('prettier/plugins/estree')).default,
  ],
  css: async () => [(await import('prettier/plugins/postcss')).default],
  scss: async () => [(await import('prettier/plugins/postcss')).default],
  less: async () => [(await import('prettier/plugins/postcss')).default],
  html: async () => [(await import('prettier/plugins/html')).default],
  vue: async () => [
    (await import('prettier/plugins/html')).default,
    (await import('prettier/plugins/postcss')).default,
    (await import('prettier/plugins/babel')).default,
    (await import('prettier/plugins/estree')).default,
  ],
  yaml: async () => [(await import('prettier/plugins/yaml')).default],
  markdown: async () => [(await import('prettier/plugins/markdown')).default],
  graphql: async () => [(await import('prettier/plugins/graphql')).default],

  // Example for third-party plugins
  // php: async () => [(await import('@prettier/plugin-php/standalone')).default],
  // sql: async () => [(await import('prettier-plugin-sql')).default],
  // xml: async () => [(await import('@prettier/plugin-xml')).default],
  // shell: async () => [(await import('prettier-plugin-sh')).default],
};

export type FormatCodeOptions = {
  printWidth?: number;
  tabWidth?: number;
  useTabs?: boolean;
  semi?: boolean;
  singleQuote?: boolean;
  trailingComma?: 'all' | 'es5' | 'none';
};

const DEFAULT_FORMAT_OPTIONS: FormatCodeOptions = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
};

/**
 * Formats code using Prettier with lazy-loaded plugins.
 * Returns the original code if formatting fails or language is not supported.
 */
export async function formatCode(
  code: string,
  language: string,
  options: FormatCodeOptions = {},
): Promise<{ formatted: string; success: boolean; error?: string }> {
  const parser = PRETTIER_PARSER_MAP[language];
  const loader = PLUGIN_LOADERS[language];

  if (!parser || !loader) {
    return {
      formatted: code,
      success: false,
      error: `No formatter available for language: ${language}`,
    };
  }

  try {
    const [prettier, plugins] = await Promise.all([import('prettier/standalone'), loader()]);

    const mergedOptions = { ...DEFAULT_FORMAT_OPTIONS, ...options };

    const formatted = await prettier.format(code, {
      parser,
      plugins: plugins.map((p) => p.default || p),
      ...mergedOptions,
    });

    // Prettier adds a trailing newline, remove it for editor compatibility
    const trimmedFormatted = formatted.endsWith('\n') ? formatted.slice(0, -1) : formatted;

    return {
      formatted: trimmedFormatted,
      success: true,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown formatting error';
    return {
      formatted: code,
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Checks if a language is supported by Prettier
 */
export function isLanguageSupported(language: string): boolean {
  return language in PRETTIER_PARSER_MAP && language in PLUGIN_LOADERS;
}
