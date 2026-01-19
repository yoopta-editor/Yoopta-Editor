import type { YooEditor, YooptaPath } from '../types';
import type { SetCurrentOptions } from './types';

/**
 * Set current block order
 *
 * @param editor - YooEditor instance
 * @param options - Set current options
 *
 * @example
 * ```typescript
 * // Set current block to order 0
 * Selection.setCurrent(editor, { at: 0 });
 *
 * // Set current block with source
 * Selection.setCurrent(editor, {
 *   at: 1,
 *   source: 'keyboard'
 * });
 * ```
 */
export function setCurrent(editor: YooEditor, options: SetCurrentOptions): void {
  const { at, source } = options;

  const path: YooptaPath = {
    current: at,
    selected: editor.path.selected,
    selection: editor.path.selection,
    source: source ?? editor.path.source ?? null,
  };

  editor.setPath(path);
}

