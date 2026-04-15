import { MathInline } from './plugin/math-inline-plugin';
import { MathBlock } from './plugin/math-block-plugin';

// --- MathInline types ---
export type {
  MathInlineElementProps,
  MathInlineElement,
  MathInlineElementMap,
  MathInlinePluginElementKeys,
} from './types';

// --- MathBlock types ---
export type {
  MathBlockElementProps,
  MathBlockElement,
  MathBlockElementMap,
  MathBlockPluginElementKeys,
} from './types';

// --- Shared types ---
export type {
  MathState,
  MathPluginOptions,
  MathEditor,
  MathYooEditor,
} from './types';

export { INITIAL_MATH_STATE } from './types';

// --- Commands ---
export { MathInlineCommands } from './commands/math-inline-commands';
export type { MathInlineCommandsType } from './commands/math-inline-commands';

export { MathBlockCommands } from './commands/math-block-commands';
export type { MathBlockCommandsType } from './commands/math-block-commands';

// --- Hooks ---
export { useMathState } from './hooks';

// --- Extension ---
export { withMath } from './extensions/withMath';

// --- Utils ---
export { renderLatexToHTML } from './utils';

// --- Plugins ---
export { MathInline, MathBlock };

const Math = {
  MathInline,
  MathBlock,
};

export default Math;
