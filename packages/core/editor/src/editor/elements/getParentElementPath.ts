import type { Path } from 'slate';
import { Path as SlatePath } from 'slate';
import { ReactEditor } from 'slate-react';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateElement, YooEditor } from '../types';
import type { GetElementPathOptions } from './types';

/**
 * Get parent path of an element in the Slate tree
 *
 * @param editor - YooEditor instance
 * @param options - Get options
 * @returns Parent path or null if not found
 *
 * @example
 * ```typescript
 * // Get parent path of element
 * const parentPath = editor.getParentElementPath({
 *   blockId: 'accordion-1',
 *   element: accordionContentElement
 * });
 * ```
 */
export function getParentElementPath(editor: YooEditor, options: GetElementPathOptions): Path | null {
  const { blockId, element } = options;

  const block = editor.children[blockId];
  if (!block) {
    return null;
  }

  const slate = findSlateBySelectionPath(editor, { at: block.meta.order });
  if (!slate) {
    return null;
  }

  try {
    const path = ReactEditor.findPath(slate, element);
    return SlatePath.parent(path);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getParentElementPath] Failed to find parent path', error);
    }
    return null;
  }
}
