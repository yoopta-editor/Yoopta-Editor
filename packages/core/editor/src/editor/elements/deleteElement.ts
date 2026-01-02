import type { Path } from 'slate';
import { Editor, Element, Transforms } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateEditor, SlateElement, YooEditor } from '../types';
import type { DeleteElementOptions, ElementPath } from './types';

/**
 * Delete element from a block
 *
 * @param editor - YooEditor instance
 * @param options - Delete options
 *
 * @example
 * ```typescript
 * // Delete by path
 * editor.deleteElement({
 *   blockId: 'accordion-1',
 *   type: 'accordion-list-item',
 *   path: [0, 2]
 * });
 *
 * // Delete with matcher
 * editor.deleteElement({
 *   blockId: 'tabs-1',
 *   type: 'tabs-item-content',
 *   match: (el) => el.props?.referenceId === 'tab-1'
 * });
 * ```
 */
export function deleteElement(editor: YooEditor, options: DeleteElementOptions): void {
  const { blockId, type, path, match } = options;

  const block = editor.children[blockId];
  if (!block) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[deleteElement] Block with id ${blockId} not found`);
    }
    return;
  }

  const slate = findSlateBySelectionPath(editor, { at: block.meta.order });
  if (!slate) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[deleteElement] Slate not found for block ${blockId}`);
    }
    return;
  }

  Editor.withoutNormalizing(slate, () => {
    // Resolve matcher function
    const matchFn = match || ((n: SlateElement) => Element.isElement(n) && n.type === type);

    // Resolve path
    const atPath = resolveElementPath(slate, path, type);

    // Find and remove element
    try {
      Transforms.removeNodes(slate, {
        at: atPath,
        match: matchFn,
        mode: 'lowest',
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[deleteElement] Failed to delete element of type "${type}"`, error);
      }
    }
  });
}

/**
 * Resolve element path based on various path options
 */
function resolveElementPath(
  slate: SlateEditor,
  path: ElementPath | undefined,
  type: string,
): Path | undefined {
  // No path specified - use selection or root
  if (!path) {
    return slate.selection?.anchor.path || [0];
  }

  // Direct path array
  if (Array.isArray(path)) {
    return path;
  }

  // Selection path
  if (path === 'selection') {
    return slate.selection?.anchor.path;
  }

  // First element of type
  if (path === 'first') {
    const [entry] = Editor.nodes(slate, {
      match: (n) => Element.isElement(n) && n.type === type,
      mode: 'lowest',
    });
    return entry?.[1];
  }

  // Last element of type
  if (path === 'last') {
    const entries = Array.from(
      Editor.nodes(slate, {
        match: (n) => Element.isElement(n) && n.type === type,
        mode: 'lowest',
      }),
    );
    return entries[entries.length - 1]?.[1];
  }

  return undefined;
}
