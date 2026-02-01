import type { YooEditor, YooptaPathIndex } from '../types';
import type { GetNextBlockOptions } from './types';

/**
 * Get previous block order
 *
 * @param editor - YooEditor instance
 * @param options - Get previous options
 * @returns Previous block order or null
 *
 * @example
 * ```typescript
 * // Get previous block from current
 * const previous = Selection.getPrevious(editor);
 *
 * // Get previous block from specific order
 * const previous = Selection.getPrevious(editor, { at: 1 });
 * ```
 */
export function getPrevious(editor: YooEditor, options?: GetNextBlockOptions): YooptaPathIndex {
  const current = options?.at ?? editor.path.current;

  if (typeof current === 'number' && current > 0) {
    return current - 1;
  }

  return null;
}

