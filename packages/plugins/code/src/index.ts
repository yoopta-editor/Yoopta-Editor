import { CodeGroup } from './plugin/code-group-plugin';
import { Code } from './plugin/code-plugin';
import {
  CodeElement,
  CodeElementProps,
  CodeGroupElementMap,
  CodeGroupPluginBlockOptions,
} from './types';
import { initHighlighter } from './utils/shiki';

initHighlighter();

export { HighlightedCodeOverlay, useHighlighter } from './components/highlighted-code-overlay';
export { CodeCommands, type BeautifyCodeResult } from './commands/code-commands';
export { CodeGroupCommands, type BeautifyTabResult } from './commands/code-group-commands';
export { SHIKI_CODE_LANGUAGES, SHIKI_CODE_THEMES } from './utils/shiki';
export { isLanguageSupported, type FormatCodeOptions } from './utils/prettier';

export { CodeElement, CodeElementProps };
export { CodeGroupElementMap, CodeGroupPluginBlockOptions };
export { CodeGroup, Code };

const CodePlugins = {
  Code,
  CodeGroup,
};

export default CodePlugins;
