import type { Path } from 'slate';
import { Editor, Element, Transforms } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateEditor, SlateElement, YooEditor } from '../types';
import type { ElementPath, UpdateElementOptions } from './types';

/**
 * Update element props in a block
 *
 * @param editor - YooEditor instance
 * @param options - Update options
 *
 * @example
 * ```typescript
 * // Update element props
 * editor.updateElement({
 *   blockId: 'accordion-1',
 *   type: 'accordion-list-item',
 *   props: { isExpanded: true },
 *   path: [0, 1]
 * });
 *
 * // Update with matcher
 * editor.updateElement({
 *   blockId: 'tabs-1',
 *   type: 'tabs-item-heading',
 *   props: { active: true },
 *   match: (el) => el.id === 'tab-1'
 * });
 * ```
 */
export function updateElement(editor: YooEditor, options: UpdateElementOptions): void {
  const { blockId, type, props, path, match } = options;

  const block = editor.children[blockId];
  if (!block) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[updateElement] Block with id ${blockId} not found`);
    }
    return;
  }

  const slate = findSlateBySelectionPath(editor, { at: block.meta.order });
  if (!slate) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[updateElement] Slate not found for block ${blockId}`);
    }
    return;
  }

  Editor.withoutNormalizing(slate, () => {
    // Resolve matcher function
    const matchFn = match || ((n: SlateElement) => Element.isElement(n) && n.type === type);

    // Resolve path
    const atPath = resolveElementPath(slate, path, type);

    // Find element
    const [elementEntry] = Editor.nodes<SlateElement>(slate, {
      at: atPath,
      match: matchFn,
      mode: 'lowest',
    });

    if (!elementEntry) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[updateElement] Element of type "${type}" not found`);
      }
      return;
    }

    const [element, elementPath] = elementEntry;

    // Update element props
    Transforms.setNodes<SlateElement>(
      slate,
      {
        props: {
          ...element.props,
          ...props,
        },
      },
      {
        at: elementPath,
        match: matchFn,
      },
    );
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
