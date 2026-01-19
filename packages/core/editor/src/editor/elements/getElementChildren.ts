import { getElement } from './getElement';
import type { SlateElement, YooEditor } from '../types';
import type { GetElementChildrenOptions } from './types';

/**
 * Get children of an element
 *
 * @param editor - YooEditor instance
 * @param options - Get options
 * @returns Element children or null if element not found
 *
 * @example
 * ```typescript
 * // Get children of accordion item
 * const children = editor.getElementChildren({
 *   blockId: 'accordion-1',
 *   type: 'accordion-list-item',
 *   path: [0, 1]
 * });
 * ```
 */
export function getElementChildren(
  editor: YooEditor,
  options: GetElementChildrenOptions,
): SlateElement['children'] | null {
  const element = getElement(editor, options);
  if (element && 'children' in element) {
    return element.children;
  }

  return null;
}
