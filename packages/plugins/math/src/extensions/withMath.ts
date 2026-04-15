import type { YooEditor } from '@yoopta/editor';

import type { MathBlockElement, MathInlineElement, MathState, MathYooEditor } from '../types';
import { INITIAL_MATH_STATE } from '../types';

type MathEmit = (event: string, payload: unknown) => void;

export function withMath(editor: YooEditor): MathYooEditor {
  const mathEditor = editor as MathYooEditor;

  let state: MathState = { ...INITIAL_MATH_STATE };

  const emit = editor.emit as MathEmit;

  mathEditor.math = {
    get state() {
      return state;
    },
    setState: (newState: Partial<MathState>) => {
      state = { ...state, ...newState };
    },
    open: (params: {
      element?: (MathInlineElement | MathBlockElement) | null;
      blockId: string | null;
      anchorEl: HTMLElement | null;
    }) => {
      state = {
        isOpen: true,
        editingElement: params.element ?? null,
        blockId: params.blockId ?? null,
        anchorEl: params.anchorEl ?? null,
      };

      emit('math:open', {
        element: params.element,
        blockId: params.blockId,
      });
    },
    close: () => {
      state = { ...INITIAL_MATH_STATE };
      emit('math:close', {});
    },
  };

  return mathEditor;
}
