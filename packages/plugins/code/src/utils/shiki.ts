import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki';
import { createHighlighter } from 'shiki';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    yShiki: HighlighterGeneric<BundledLanguage, BundledTheme> | null;
  }
}

export const SHIKI_CODE_LANGUAGES: { value: BundledLanguage; label: string }[] = [
  { value: '1c', label: '1C' },
  { value: '1c-query', label: '1C Query' },
  { value: 'abap', label: 'ABAP' },
  { value: 'actionscript-3', label: 'ActionScript 3' },
  { value: 'ada', label: 'Ada' },
  { value: 'adoc', label: 'Asciidoc' },
  { value: 'angular-html', label: 'Angular HTML' },
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
  { value: 'dotenv', label: 'Dotenv' },
  { value: 'docker', label: 'Docker' },
  { value: 'c++', label: 'C++' },
  { value: 'c#', label: 'C#' },
  { value: 'java', label: 'Java' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'scala', label: 'Scala' },
  { value: 'scheme', label: 'Scheme' },
  { value: 'scss', label: 'SCSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'swift', label: 'Swift' },
  { value: 'typst', label: 'Typst' },
  { value: 'v', label: 'V' },
  { value: 'vala', label: 'Vala' },
  { value: 'vb', label: 'VB' },
  { value: 'verilog', label: 'Verilog' },
  { value: 'vhdl', label: 'VHDL' },
  { value: 'vim', label: 'Vim' },
  { value: 'viml', label: 'VimL' },
  { value: 'vimscript', label: 'Vimscript' },
  { value: 'vue', label: 'Vue' },
  { value: 'vue-html', label: 'Vue HTML' },
  { value: 'vy', label: 'Vy' },
  { value: 'vyper', label: 'Vyper' },
  { value: 'wasm', label: 'Wasm' },
  { value: 'wenyan', label: 'Wenyan' },
  { value: 'wgsl', label: 'WGSL' },
  { value: 'wiki', label: 'Wiki' },
  { value: 'wikitext', label: 'Wikitext' },
  { value: 'wit', label: 'Wit' },
  { value: 'wl', label: 'WL' },
  { value: 'wolfram', label: 'Wolfram' },
  { value: 'xml', label: 'XML' },
  { value: 'xsl', label: 'XSL' },
  { value: 'yaml', label: 'YAML' },
  { value: 'yml', label: 'YML' },
  { value: 'zenscript', label: 'Zenscript' },
  { value: 'zig', label: 'Zig' },
  { value: 'zsh', label: 'Zsh' },
  { value: '文言', label: '文言' },
];

export const SHIKI_CODE_THEMES: { value: BundledTheme; label: string }[] = [
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
  { value: 'github-dark-default', label: 'GitHub Dark Default' },
  { value: 'github-dark-dimmed', label: 'GitHub Dark Dimmed' },
  { value: 'github-dark-high-contrast', label: 'GitHub Dark High Contrast' },
  { value: 'github-light-default', label: 'GitHub Light Default' },
  { value: 'github-light-high-contrast', label: 'GitHub Light High Contrast' },
  { value: 'gruvbox-dark-hard', label: 'Gruvbox Dark Hard' },
  { value: 'gruvbox-dark-medium', label: 'Gruvbox Dark Medium' },
  { value: 'gruvbox-dark-soft', label: 'Gruvbox Dark Soft' },
  { value: 'gruvbox-light-hard', label: 'Gruvbox Light Hard' },
  { value: 'gruvbox-light-medium', label: 'Gruvbox Light Medium' },
  { value: 'gruvbox-light-soft', label: 'Gruvbox Light Soft' },
  { value: 'houston', label: 'Houston' },
  { value: 'kanagawa-dragon', label: 'Kanagawa Dragon' },
  { value: 'kanagawa-lotus', label: 'Kanagawa Lotus' },
  { value: 'kanagawa-wave', label: 'Kanagawa Wave' },
  { value: 'laserwave', label: 'Laserwave' },
  { value: 'light-plus', label: 'Light Plus' },
  { value: 'material-theme', label: 'Material Theme' },
  { value: 'material-theme-darker', label: 'Material Theme Darker' },
  { value: 'material-theme-lighter', label: 'Material Theme Lighter' },
  { value: 'material-theme-ocean', label: 'Material Theme Ocean' },
  { value: 'material-theme-palenight', label: 'Material Theme Palenight' },
  { value: 'min-dark', label: 'Min Dark' },
  { value: 'min-light', label: 'Min Light' },
  { value: 'monokai', label: 'Monokai' },
  { value: 'night-owl', label: 'Night Owl' },
  { value: 'nord', label: 'Nord' },
  { value: 'one-dark-pro', label: 'One Dark Pro' },
  { value: 'one-light', label: 'One Light' },
  { value: 'plastic', label: 'Plastic' },
  { value: 'poimandres', label: 'Poimandres' },
  { value: 'red', label: 'Red' },
  { value: 'rose-pine', label: 'Rose Pine' },
  { value: 'rose-pine-dawn', label: 'Rose Pine Dawn' },
  { value: 'rose-pine-moon', label: 'Rose Pine Moon' },
  { value: 'slack-dark', label: 'Slack Dark' },
  { value: 'slack-ochin', label: 'Slack Ochin' },
  { value: 'snazzy-light', label: 'Snazzy Light' },
  { value: 'solarized-dark', label: 'Solarized Dark' },
  { value: 'solarized-light', label: 'Solarized Light' },
  { value: 'synthwave-84', label: 'Synthwave 84' },
  { value: 'tokyo-night', label: 'Tokyo Night' },
  { value: 'vesper', label: 'Vesper' },
  { value: 'vitesse-black', label: 'Vitesse Black' },
  { value: 'vitesse-dark', label: 'Vitesse Dark' },
  { value: 'vitesse-light', label: 'Vitesse Light' },
];

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
