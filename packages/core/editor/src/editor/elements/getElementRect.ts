import { ReactEditor } from 'slate-react';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { YooEditor } from '../types';
import type { GetElementRectOptions } from './types';

/**
 * Get the DOMRect of a Slate element
 *
 * @param editor - YooEditor instance
 * @param options - Get options
 * @returns DOMRect of the element or null if not found
 *
 * @example
 * ```typescript
 * // Get rect of element for positioning UI
 * const rect = editor.getElementRect({
 *   blockId: 'image-1',
 *   element: imageElement
 * });
 *
 * if (rect) {
 *   console.log('Element position:', rect.x, rect.y);
 *   console.log('Element size:', rect.width, rect.height);
 * }
 * ```
 */
export function getElementRect(editor: YooEditor, options: GetElementRectOptions): { domRect: DOMRect; clientRects: DOMRectList } | null {
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
    const domNode = ReactEditor.toDOMNode(slate, element);
    if (!domNode) {
      return null;
    }

    return {
      domRect: domNode.getBoundingClientRect(),
      clientRects: domNode.getClientRects(),
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[getElementRect] Failed to get element rect', error);
    }
    return null;
  }
}
