import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki';
import { createHighlighter } from 'shiki';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    yShiki: HighlighterGeneric<BundledLanguage, BundledTheme> | null;
  }
}

export const SHIKI_CODE_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'sql', label: 'SQL' },
  { value: 'dotenv', label: 'Dotenv' },
  { value: 'docker', label: 'Docker' },
  { value: 'c++', label: 'C++' },
  { value: 'c#', label: 'C#' },
  { value: 'java', label: 'Java' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'dart', label: 'Dart' },
  { value: 'elixir', label: 'Elixir' },
] as const;

export const SHIKI_CODE_THEMES = [
  { value: 'andromeeda', label: 'Andromeeda' },
  { value: 'aurora-x', label: 'Aurora X' },
  { value: 'ayu-dark', label: 'Ayu Dark' },
  { value: 'catppuccin-frappe', label: 'Catppuccin Frappé' },
  { value: 'catppuccin-latte', label: 'Catppuccin Latte' },
  { value: 'catppuccin-macchiato', label: 'Catppuccin Macchiato' },
  { value: 'catppuccin-mocha', label: 'Catppuccin Mocha' },
  { value: 'dark-plus', label: 'Dark Plus' },
  { value: 'github-dark', label: 'GitHub Dark' },
  { value: 'github-light', label: 'GitHub Light' },
] as const;

// [TODO] - implement clean up
export async function initHighlighter(): Promise<
  HighlighterGeneric<BundledLanguage, BundledTheme>
> {
  if (typeof window !== 'undefined' && window.yShiki) {
    return window.yShiki;
  }

  const highlighter = await createHighlighter({
    themes: SHIKI_CODE_THEMES.map((theme) => theme.value),
    langs: SHIKI_CODE_LANGUAGES.map((language) => language.value),
  });

  if (typeof window !== 'undefined') {
    if (!window.yShiki) {
      window.yShiki = highlighter;
      return window.yShiki;
    }
  }

  return highlighter;
}
