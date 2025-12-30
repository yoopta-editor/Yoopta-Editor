import { Code } from './plugin/code-plugin';
import { CodeElement, CodeElementProps } from './types';

export { HighlightedCodeOverlay, useHighlighter } from './components/highlighted-code-overlay';
export { CodeCommands } from './commands';
export { SHIKI_CODE_LANGUAGES, SHIKI_CODE_THEMES } from './utils/shiki';

export { CodeElement, CodeElementProps };
export default Code;
