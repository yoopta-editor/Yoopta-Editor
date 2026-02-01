import type { Path } from 'slate';
import { ReactEditor } from 'slate-react';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { YooEditor } from '../types';
import type { GetElementPathOptions } from './types';

/**
 * Get path of an element in the Slate tree
 *
 * @param editor - YooEditor instance
 * @param options - Get options
 * @returns Element path or null if not found
 *
 * @example
 * ```typescript
 * // Get path of element
 * const path = editor.getElementPath({
 *   blockId: 'accordion-1',
 *   element: accordionItemElement
 * });
 * ```
 */
export function getElementPath(editor: YooEditor, options: GetElementPathOptions): Path | null {
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
    return path;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getElementPath] Failed to find element path', error);
    }
    return null;
  }
}
