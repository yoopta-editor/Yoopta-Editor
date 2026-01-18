import type { YooEditor } from '../types';

/**
 * Check if path is empty (no current block)
 *
 * @param editor - YooEditor instance
 * @returns True if path is empty, false otherwise
 *
 * @example
 * ```typescript
 * const isEmpty = Selection.isEmpty(editor);
 * ```
 */
export function isEmpty(editor: YooEditor): boolean {
  return editor.path.current === null;
}

