import type { YooEditor, YooptaPathIndex } from '../types';
import type { GetNextBlockOptions } from './types';

/**
 * Get next block order
 *
 * @param editor - YooEditor instance
 * @param options - Get next options
 * @returns Next block order or null
 *
 * @example
 * ```typescript
 * // Get next block from current
 * const next = Selection.getNext(editor);
 *
 * // Get next block from specific order
 * const next = Selection.getNext(editor, { at: 0 });
 * ```
 */
export function getNext(editor: YooEditor, options?: GetNextBlockOptions): YooptaPathIndex {
  const current = options?.at ?? editor.path.current;

  if (typeof current === 'number') {
    return current + 1;
  }

  return null;
}

