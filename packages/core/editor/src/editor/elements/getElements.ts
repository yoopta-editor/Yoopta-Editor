import { Editor, Element } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateElement, YooEditor } from '../types';
import type { GetElementsOptions } from './types';

/**
 * Get multiple elements from a block
 *
 * @param editor - YooEditor instance
 * @param options - Get options
 * @returns Array of elements (empty array if none found)
 *
 * @example
 * ```typescript
 * // Get all items
 * const items = editor.getElements({
 *   blockId: 'accordion-1',
 *   type: 'accordion-list-item'
 * });
 *
 * // Get with custom matcher
 * const expandedItems = editor.getElements({
 *   blockId: 'accordion-1',
 *   match: (el) => el.type === 'accordion-list-item' && el.props?.isExpanded
 * });
 * ```
 */
export function getElements(editor: YooEditor, options: GetElementsOptions): SlateElement[] {
  const { blockId, type, match } = options;

  const block = editor.children[blockId];
  if (!block) {
    return [];
  }

  const slate = findSlateBySelectionPath(editor, { at: block.meta.order });
  if (!slate) {
    return [];
  }

  // Build matcher function
  const matchFn = match || (type ? (n) => Element.isElement(n) && n.type === type : (n) => Element.isElement(n));

  try {
    const entries = Array.from(
      Editor.nodes<SlateElement>(slate, {
        at: [],
        match: matchFn,
        mode: 'all',
      }),
    );

    return entries.map(([node]) => node);
  } catch (error) {
    return [];
  }
}

