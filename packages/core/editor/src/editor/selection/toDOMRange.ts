import type { Range as SlateRange } from 'slate';
import { ReactEditor } from 'slate-react';

import { Blocks } from '../blocks';
import type { YooEditor } from '../types';

export type ToDOMRangeOptions = {
  /** Block ID containing the Slate selection */
  blockId: string;
  /** Slate Range to convert to a DOM Range */
  slateRange: SlateRange;
};

/**
 * Convert a Slate Range within a specific block to a native DOM Range.
 *
 * This method uses Slate's internal WeakMaps (via ReactEditor.toDOMRange)
 * which are only available inside @yoopta/editor where the Slate editors
 * are rendered.
 *
 * @param editor - YooEditor instance
 * @param options - Block ID and Slate range
 * @returns Native DOM Range or null if the range can't be resolved
 *
 * @example
 * ```typescript
 * const domRange = Selection.toDOMRange(editor, {
 *   blockId: 'block-1',
 *   slateRange: { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 5 } },
 * });
 *
 * if (domRange) {
 *   const rect = domRange.getBoundingClientRect();
 * }
 * ```
 */
export function toDOMRange(editor: YooEditor, options: ToDOMRangeOptions): Range | null {
  const { blockId, slateRange } = options;

  const slate = Blocks.getBlockSlate(editor, { id: blockId });
  if (!slate) return null;

  try {
    return ReactEditor.toDOMRange(slate, slateRange);
  } catch {
    return null;
  }
}
