import { Editor, Element } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { YooEditor } from '../types';
import type { IsElementEmptyOptions } from './types';

/**
 * Check if element is empty (has no text content)
 *
 * @param editor - YooEditor instance
 * @param options - Check options
 * @returns true if element is empty, false otherwise
 *
 * @example
 * ```typescript
 * // Check if content is empty
 * const isEmpty = editor.isElementEmpty({
 *   blockId: 'accordion-1',
 *   type: 'accordion-list-item-content',
 *   path: [0, 1, 1]
 * });
 * ```
 */
export function isElementEmpty(editor: YooEditor, options: IsElementEmptyOptions): boolean {
  const { blockId, type, path } = options;

  const block = editor.children[blockId];
  if (!block) {
    return true;
  }

  const slate = findSlateBySelectionPath(editor, { at: block.meta.order });
  if (!slate) {
    return true;
  }

  const atPath = path || slate.selection || [0];

  try {
    const [elementEntry] = Editor.nodes(slate, {
      at: atPath,
      match: (n) => Element.isElement(n) && n.type === type,
      mode: 'lowest',
    });

    if (elementEntry) {
      const [, nodePath] = elementEntry;
      const string = Editor.string(slate, nodePath);
      return string.trim().length === 0;
    }

    return true;
  } catch (error) {
    return true;
  }
}
