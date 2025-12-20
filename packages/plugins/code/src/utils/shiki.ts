import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki';
import { createHighlighter } from 'shiki';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    yShiki: HighlighterGeneric<BundledLanguage, BundledTheme> | null;
  }
}

// [TODO] - implement clean up
export async function initHighlighter(): Promise<
  HighlighterGeneric<BundledLanguage, BundledTheme>
> {
  if (typeof window !== 'undefined' && window.yShiki) {
    return window.yShiki;
  }

  const highlighter = await createHighlighter({
    themes: [
      'github-dark',
      'github-light',
      'andromeeda',
      'aurora-x',
      'ayu-dark',
      'catppuccin-frappe',
      'catppuccin-latte',
      'catppuccin-macchiato',
      'catppuccin-mocha',
      'dark-plus',
    ],
    langs: [
      'javascript',
      'typescript',
      'python',
      'html',
      'css',
      'json',
      'rust',
      'go',
      'bash',
      'shell',
      'sql',
      'dotenv',
      'docker',
      'c++',
      'c#',
      'java',
      'kotlin',
      'php',
      'ruby',
      'swift',
      'dart',
      'elixir',
    ],
  });

  if (typeof window !== 'undefined') {
    if (!window.yShiki) {
      window.yShiki = highlighter;
      return window.yShiki;
    }
  }

  return highlighter;
}
