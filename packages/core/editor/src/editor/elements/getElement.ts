import { Editor, Element } from 'slate';
import type { Location, Node } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateEditor, SlateElement, YooEditor } from '../types';
import type { ElementPath, GetElementOptions } from './types';

/**
 * Resolve element path based on various path options
 */
function resolveElementPath(
  slate: SlateEditor,
  path: ElementPath | undefined,
  type: string | undefined,
): Location {
  // No path specified - use selection or root
  if (!path) {
    return slate.selection ?? [0];
  }

  // Direct path array
  if (Array.isArray(path)) {
    return path;
  }

  // Selection path
  if (path === 'selection') {
    return slate.selection ?? [0];
  }

  // First element of type
  if (path === 'first' && type) {
    const [entry] = Editor.nodes(slate, {
      match: (n) => Element.isElement(n) && n.type === type,
      mode: 'lowest',
    });
    return entry?.[1] ?? [0];
  }

  // Last element of type
  if (path === 'last' && type) {
    const entries = Array.from(
      Editor.nodes(slate, {
        match: (n) => Element.isElement(n) && n.type === type,
        mode: 'lowest',
      }),
    );
    return entries[entries.length - 1]?.[1] ?? [0];
  }

  return [0];
}

/**
 * Get single element from a block
 *
 * @param editor - YooEditor instance
 * @param options - Get options
 * @returns Element or null if not found
 *
 * @example
 * ```typescript
 * // Get element by type and path
 * const element = editor.getElement({
 *   blockId: 'accordion-1',
 *   type: 'accordion-list-item',
 *   path: [0, 1]
 * });
 *
 * // Get element with custom matcher
 * const activeItem = editor.getElement({
 *   blockId: 'accordion-1',
 *   match: (el) => el.type === 'accordion-list-item' && el.props?.isExpanded
 * });
 * ```
 */
export function getElement(editor: YooEditor, options: GetElementOptions): SlateElement | null {
  const { blockId, type, path, match } = options;

  const block = editor.children[blockId];
  if (!block) {
    return null;
  }

  const slate = findSlateBySelectionPath(editor, { at: block.meta.order });
  if (!slate) {
    return null;
  }

  // Build matcher function - accepts Node to match Slate's API
  let matchFn: (node: Node) => boolean;

  if (match) {
    matchFn = (n): n is SlateElement => Element.isElement(n) && match(n as SlateElement);
  } else if (type) {
    matchFn = (n): n is SlateElement => Element.isElement(n) && n.type === type;
  } else {
    matchFn = (n): n is SlateElement => Element.isElement(n);
  }

  // Resolve path
  const atPath = resolveElementPath(slate, path, type);

  try {
    const [elementEntry] = Editor.nodes<SlateElement>(slate, {
      at: atPath,
      match: matchFn,
      mode: 'lowest',
    });

    return elementEntry ? elementEntry[0] : null;
  } catch (error) {
    return null;
  }
}
