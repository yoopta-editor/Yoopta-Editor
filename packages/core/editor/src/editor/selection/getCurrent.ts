import type { YooEditor, YooptaPathIndex } from '../types';
import type { GetCurrentOptions } from './types';

/**
 * Get current block order
 *
 * @param editor - YooEditor instance
 * @param options - Get current options
 * @returns Current block order or null
 *
 * @example
 * ```typescript
 * // Get current block order
 * const current = Selection.getCurrent(editor);
 *
 * // Get specific block order (same as editor.path.current)
 * const current = Selection.getCurrent(editor, { at: 0 });
 * ```
 */
export function getCurrent(editor: YooEditor, options?: GetCurrentOptions): YooptaPathIndex {
  if (options?.at !== undefined) {
    return options.at;
  }

  return editor.path.current;
}

