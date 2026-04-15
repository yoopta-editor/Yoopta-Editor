import { useEffect, useState } from 'react';
import { useYooptaEditor } from '@yoopta/editor';

import type { MathState, MathYooEditor } from '../types';
import { INITIAL_MATH_STATE } from '../types';

/**
 * Hook to subscribe to math editor extension state changes.
 * Returns the current state of the math inline edit popover.
 */
export function useMathState(): MathState {
  const editor = useYooptaEditor() as MathYooEditor;
  const [state, setState] = useState<MathState>(
    () => editor.math?.state ?? INITIAL_MATH_STATE,
  );

  useEffect(() => {
    const onOpen = () => {
      setState({ ...editor.math.state });
    };

    const onClose = () => {
      setState({ ...INITIAL_MATH_STATE });
    };

    editor.on('math:open', onOpen);
    editor.on('math:close', onClose);

    return () => {
      editor.off('math:open', onOpen);
      editor.off('math:close', onClose);
    };
  }, [editor]);

  return state;
}
