import type { Path } from 'slate';
import { Editor, Element, Path as SlatePath, Transforms } from 'slate';

import type { InsertElementOptions } from './types';
import { buildBlockElement } from '../../components/Editor/utils';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateEditor, SlateElement, YooEditor, YooptaBlockData } from '../types';

/**
 * Build new element with proper structure
 */
function buildNewElement(
  editor: YooEditor,
  block: YooptaBlockData,
  type: string,
  props: Record<string, unknown> | undefined,
  children: SlateElement[] | undefined,
  elementConfig: { props?: Record<string, unknown>; children?: string[] },
): SlateElement {
  const plugin = editor.plugins[block.type];

  // Build base element
  const baseElement = buildBlockElement({
    type,
    props: { ...elementConfig.props, ...props },
  });

  // Add children if provided
  if (children && children.length > 0) {
    baseElement.children = children;
  } else {
    // Build default children from plugin config
    const defaultChildren: SlateElement[] = [];

    if (Array.isArray(elementConfig.children) && elementConfig.children.length > 0) {
      elementConfig.children.forEach((childType: string) => {
        const childConfig = plugin.elements[childType];
        if (childConfig) {
          defaultChildren.push(
            buildBlockElement({
              type: childType,
              props: childConfig.props,
            }),
          );
        }
      });
    }

    if (defaultChildren.length > 0) {
      baseElement.children = defaultChildren;
    }
  }

  return baseElement;
}

/**
 * Resolve insert path based on 'at' option
 */
function resolveInsertPath(
  slate: SlateEditor,
  at: InsertElementOptions['at'],
  type: string,
): Path | undefined {
  // Default to selection or root
  if (!at) {
    if (slate.selection?.anchor.path) {
      return slate.selection.anchor.path;
    }
    return [0];
  }

  // Direct path
  if (Array.isArray(at)) {
    return at;
  }

  // Start of block
  if (at === 'start') {
    return [0];
  }

  // End of block
  if (at === 'end') {
    return [slate.children.length];
  }

  // Next/Prev require finding current element of same type
  if (at === 'next' || at === 'prev') {
    if (!slate.selection) {
      // No selection - fallback to end
      return [slate.children.length];
    }

    const [entry] = Editor.nodes(slate, {
      at: slate.selection,
      match: (n) => Element.isElement(n) && n.type === type,
      mode: 'lowest',
    });

    if (entry) {
      const [, path] = entry;
      return at === 'next' ? SlatePath.next(path) : SlatePath.previous(path);
    }

    // Fallback: insert at selection or end
    return slate.selection.anchor.path || [slate.children.length];
  }

  return undefined;
}

/**
 * Insert element into a block
 *
 * @param editor - YooEditor instance
 * @param options - Insert options
 *
 * @example
 * ```typescript
 * // Insert at next position
 * editor.insertElement({
 *   blockId: 'accordion-1',
 *   type: 'accordion-list-item',
 *   props: { isExpanded: true },
 *   at: 'next',
 *   focus: true
 * });
 * ```
 */
export function insertElement(editor: YooEditor, options: InsertElementOptions): void {
  const { blockId, type, props, children, at, focus = false, select = false } = options;

  const block = editor.children[blockId];
  if (!block) {
    return;
  }

  const slate = findSlateBySelectionPath(editor, { at: block.meta.order });
  if (!slate) {
    return;
  }

  Editor.withoutNormalizing(slate, () => {
    const plugin = editor.plugins[block.type];
    if (!plugin) {
      return;
    }

    const elementConfig = plugin.elements[type];
    if (!elementConfig) {
      return;
    }

    // Build new element
    const newElement = buildNewElement(editor, block, type, props, children, elementConfig);

    // Resolve insert path
    const insertPath = resolveInsertPath(slate, at, type);

    if (!insertPath) {
      return;
    }

    // Insert the element
    const selectValue = select || focus || false;
    Transforms.insertNodes(slate, newElement, {
      at: insertPath,
      select: selectValue,
    });

    // Handle focus
    if (focus && !select) {
      // Focus first child if element has children
      const childElements = Array.isArray(newElement.children)
        ? newElement.children.filter((child) => Element.isElement(child))
        : [];

      if (childElements.length > 0) {
        const firstChildPath = [...insertPath, 0];
        try {
          Transforms.select(slate, firstChildPath);
        } catch (error) {
          // Selection might fail if path doesn't exist yet
        }
      }
    }
  });
}
