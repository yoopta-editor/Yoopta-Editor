import type { YooEditor, YooptaPath } from '../types';
import type { SetSelectedOptions } from './types';

/**
 * Set selected block orders
 *
 * @param editor - YooEditor instance
 * @param options - Set selected options
 *
 * @example
 * ```typescript
 * // Select single block
 * Selection.setSelected(editor, { at: 0 });
 *
 * // Select multiple blocks
 * Selection.setSelected(editor, { at: [0, 1, 2] });
 *
 * // Select with source
 * Selection.setSelected(editor, {
 *   at: [0, 1],
 *   source: 'selection-box'
 * });
 * ```
 */
export function setSelected(editor: YooEditor, options: SetSelectedOptions): void {
  const { at, source } = options;

  const selected = Array.isArray(at) ? at : [at];
  const filteredSelected = selected.filter((order): order is number => typeof order === 'number');

  const path: YooptaPath = {
    current: editor.path.current,
    selected: filteredSelected.length > 0 ? filteredSelected : null,
    selection: editor.path.selection,
    source: source ?? editor.path.source ?? null,
  };

  editor.setPath(path);
}

