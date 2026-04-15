import type { SlateElement, YooEditor } from '@yoopta/editor';

// --- MathInline (inlineVoid) ---

export type MathInlinePluginElementKeys = 'math-inline';

export type MathInlineElementProps = {
  latex: string;
  nodeType: 'inlineVoid';
};

export type MathInlineElement = SlateElement<'math-inline', MathInlineElementProps>;

export type MathInlineElementMap = {
  'math-inline': MathInlineElement;
};

// --- MathBlock (void block) ---

export type MathBlockPluginElementKeys = 'math-block';

export type MathBlockElementProps = {
  latex: string;
  nodeType: 'void';
};

export type MathBlockElement = SlateElement<'math-block', MathBlockElementProps>;

export type MathBlockElementMap = {
  'math-block': MathBlockElement;
};

// --- Shared editor extension state ---

export type MathState = {
  isOpen: boolean;
  editingElement: (MathInlineElement | MathBlockElement) | null;
  blockId: string | null;
  anchorEl: HTMLElement | null;
};

export const INITIAL_MATH_STATE: MathState = {
  isOpen: false,
  editingElement: null,
  blockId: null,
  anchorEl: null,
};

export type MathPluginOptions = {
  onInsert?: (latex: string) => void;
  onUpdate?: (latex: string) => void;
};

export type MathEditor = {
  math: {
    state: MathState;
    setState: (state: Partial<MathState>) => void;
    open: (params: {
      element?: (MathInlineElement | MathBlockElement) | null;
      blockId: string | null;
      anchorEl: HTMLElement | null;
    }) => void;
    close: () => void;
  };
};

export type MathYooEditor = YooEditor & MathEditor;
