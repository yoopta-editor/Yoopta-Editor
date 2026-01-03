import type { Path } from 'slate';
import { Editor, Element, Text, Transforms } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateEditor, YooEditor } from '../types';
import type { ElementMatcher, UpdateElementOptions } from './types';

/**
 * Check if element type is inline based on nodeType prop
 */
function isInlineElementType(editor: YooEditor, blockType: string, elementType: string): boolean {
  const plugin = editor.plugins[blockType];
  const elementConfig = plugin?.elements[elementType];

  if (!elementConfig) {
    return false;
  }

  const nodeType = elementConfig.props?.nodeType;
  return nodeType === 'inline' || nodeType === 'inlineVoid';
}

/**
 * Find element by type and matcher in current selection
 */
function findElement(
  slate: SlateEditor,
  type: string,
  isInline: boolean,
  customMatcher?: ElementMatcher,
): [Element, Path] | null {
  if (!slate.selection) {
    return null;
  }

  const matcher = customMatcher || ((n: any) => Element.isElement(n) && n.type === type);

  const [entry] = Editor.nodes(slate, {
    at: slate.selection,
    match: matcher,
    mode: isInline ? 'lowest' : 'highest',
  });

  if (entry) {
    return entry as [Element, Path];
  }

  return null;
}

/**
 * Update text content of inline element
 */
function updateInlineElementText(slate: SlateEditor, targetPath: Path, newText: string): void {
  // Get current element
  const [element] = Editor.node(slate, targetPath);

  if (!Element.isElement(element)) {
    return;
  }

  // Remove all current text children
  const textChildren = element.children.filter((child) => Text.isText(child));

  if (textChildren.length > 0) {
    // Replace first text node, remove others
    Transforms.insertText(slate, newText, {
      at: [...targetPath, 0],
    });

    // Remove extra text nodes if any
    for (let i = textChildren.length - 1; i > 0; i -= 1) {
      try {
        Transforms.removeNodes(slate, {
          at: [...targetPath, i],
        });
      } catch (error) {
        // Node might not exist
      }
    }
  } else {
    // No text children - insert new text node
    Transforms.insertNodes(slate, { text: newText }, { at: [...targetPath, 0] });
  }
}

/**
 * Update element properties
 *
 * @param editor - YooEditor instance
 * @param options - Update options
 *
 * @example Update block element by path
 * ```typescript
 * editor.updateElement({
 *   blockId: 'accordion-1',
 *   type: 'accordion-list-item',
 *   path: [0, 1],
 *   props: { isExpanded: false }
 * });
 * ```
 *
 * @example Update block element by type
 * ```typescript
 * editor.updateElement({
 *   blockId: 'accordion-1',
 *   type: 'accordion-list-item',
 *   props: { isExpanded: false }
 * });
 * ```
 *
 * @example Update inline element (link)
 * ```typescript
 * // Update link at current selection
 * editor.updateElement({
 *   blockId: 'paragraph-1',
 *   type: 'link',
 *   props: { url: 'https://new-url.com', target: '_self' }
 * });
 * ```
 *
 * @example Update inline element text and props
 * ```typescript
 * // Update both link URL and displayed text
 * editor.updateElement({
 *   blockId: 'paragraph-1',
 *   type: 'link',
 *   props: { url: 'https://example.com' },
 *   text: 'New link text'
 * });
 * ```
 *
 * @example Update with custom matcher
 * ```typescript
 * editor.updateElement({
 *   blockId: 'accordion-1',
 *   type: 'accordion-list-item',
 *   match: (element) => element.props?.id === 'item-5',
 *   props: { isExpanded: true }
 * });
 * ```
 *
 * @example Update mention user name
 * ```typescript
 * editor.updateElement({
 *   blockId: 'paragraph-1',
 *   type: 'mention',
 *   props: { userName: 'Jane Doe' },
 *   text: '@Jane Doe'  // Update displayed text too
 * });
 * ```
 */
export function updateElement(editor: YooEditor, options: UpdateElementOptions): void {
  const { blockId, type, props, path, match, text } = options;

  const block = editor.children[blockId];
  if (!block) {
    console.warn(`Block ${blockId} not found`);
    return;
  }

  const slate = findSlateBySelectionPath(editor, { at: block.meta.order });
  if (!slate) {
    console.warn(`Slate editor not found for block ${blockId}`);
    return;
  }

  Editor.withoutNormalizing(slate, () => {
    const plugin = editor.plugins[block.type];
    if (!plugin) {
      console.warn(`Plugin ${block.type} not found`);
      return;
    }

    const elementConfig = plugin.elements[type];
    if (!elementConfig) {
      console.warn(`Element type ${type} not found in plugin ${block.type}`);
      return;
    }

    const isInline = isInlineElementType(editor, block.type, type);

    let targetPath: Path | null = null;
    let targetElement: Element | null = null;

    // Case 1: Direct path provided
    if (path) {
      targetPath = path;
      try {
        const node = Editor.node(slate, targetPath);
        if (node && Element.isElement(node[0])) {
          targetElement = node[0] as Element;
        }
      } catch (error) {
        console.warn(`Element not found at path ${path}`);
        return;
      }
    }
    // Case 2: Find by type and optional matcher
    else {
      const found = findElement(slate, type, isInline, match);
      if (found) {
        [targetElement, targetPath] = found;
      } else {
        console.warn(`Element of type ${type} not found in current selection`);
        return;
      }
    }

    if (!targetPath || !targetElement) {
      console.warn('Could not resolve target element');
      return;
    }

    // Update props if provided
    if (props) {
      // Merge new props with existing ones
      const currentProps = { ...targetElement.props };
      const newProps = { ...currentProps, ...props };

      Transforms.setNodes(slate, { props: newProps } as any, { at: targetPath });
    }

    // Update text if provided (only for inline elements)
    if (text !== undefined && isInline) {
      updateInlineElementText(slate, targetPath, text);
    } else if (text !== undefined && !isInline) {
      console.warn('Text option is only supported for inline elements');
    }
  });
}
