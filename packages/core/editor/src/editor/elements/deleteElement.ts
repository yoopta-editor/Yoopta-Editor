import { Editor, Element, Path, Transforms } from 'slate';

import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateEditor, YooEditor } from '../types';
import type { DeleteElementOptions, ElementMatcher } from './types';

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
  const matcher = customMatcher ?? ((n) => Element.isElement(n) && n.type === type);

  // First try to find within current selection
  if (slate.selection) {
    const [entry] = Editor.nodes(slate, {
      at: slate.selection,
      match: matcher,
      mode: isInline ? 'lowest' : 'highest',
    });

    if (entry) {
      return entry as [Element, Path];
    }
  }

  // Fallback: search entire document (handles unfocused/out-of-focus blocks)
  const [entry] = Editor.nodes(slate, {
    at: [],
    match: matcher,
    mode: isInline ? 'lowest' : 'highest',
  });

  if (entry) {
    return entry as [Element, Path];
  }

  return null;
}

/**
 * Delete inline element (unwrap or remove)
 */
function deleteInlineElement(
  slate: SlateEditor,
  targetPath: Path,
  targetElement: Element,
  mode: 'unwrap' | 'remove',
): void {
  if (mode === 'unwrap') {
    // Unwrap: keep children (text), remove wrapper
    // Example: <link>text</link> → text

    // Check if we're at the element
    if (!slate.selection) {
      // No selection - just unwrap at path
      Transforms.unwrapNodes(slate, {
        at: targetPath,
        match: (n) => n === targetElement,
      });
    } else {
      // Has selection - unwrap at selection
      Transforms.unwrapNodes(slate, {
        at: slate.selection,
        match: (n) => Element.isElement(n) && n.type === targetElement.type,
        split: true,
      });
    }
  } else {
    // Remove: delete entire element including children
    Transforms.removeNodes(slate, {
      at: targetPath,
      match: (n) => n === targetElement,
    });
  }
}

/**
 * Delete block element
 */
function deleteBlockElement(slate: SlateEditor, targetPath: Path, targetElement: Element): void {
  // For block elements, always remove entirely
  Transforms.removeNodes(slate, {
    at: targetPath,
    match: (n) => n === targetElement,
  });
}

/**
 * Delete element from a block
 *
 * @param editor - YooEditor instance
 * @param options - Delete options
 *
 * @example Delete block element by path
 * ```typescript
 * editor.deleteElement({
 *   blockId: 'accordion-1',
 *   type: 'accordion-list-item',
 *   path: [0, 1]
 * });
 * ```
 *
 * @example Delete block element by type
 * ```typescript
 * // Deletes first accordion-list-item found in selection
 * editor.deleteElement({
 *   blockId: 'accordion-1',
 *   type: 'accordion-list-item'
 * });
 * ```
 *
 * @example Delete inline element (remove link wrapper, keep text)
 * ```typescript
 * // Before: "Hello <link>world</link>!"
 * editor.deleteElement({
 *   blockId: 'paragraph-1',
 *   type: 'link',
 *   mode: 'unwrap'  // Keep "world", remove link
 * });
 * // After: "Hello world!"
 * ```
 *
 * @example Delete inline element (remove entirely)
 * ```typescript
 * // Before: "Hello <mention>@John</mention>!"
 * editor.deleteElement({
 *   blockId: 'paragraph-1',
 *   type: 'mention',
 *   mode: 'remove'  // Remove mention entirely
 * });
 * // After: "Hello !"
 * ```
 *
 * @example Delete with custom matcher
 * ```typescript
 * editor.deleteElement({
 *   blockId: 'accordion-1',
 *   type: 'accordion-list-item',
 *   match: (element) => element.props?.id === 'item-5'
 * });
 * ```
 *
 * @example Delete link at current selection
 * ```typescript
 * // User has cursor inside link, wants to remove link
 * editor.deleteElement({
 *   blockId: 'paragraph-1',
 *   type: 'link',
 *   mode: 'unwrap'
 * });
 * ```
 *
 * @example Delete all links in selection with matcher
 * ```typescript
 * editor.deleteElement({
 *   blockId: 'paragraph-1',
 *   type: 'link',
 *   match: (element) => element.props?.url.includes('old-domain.com'),
 *   mode: 'unwrap'
 * });
 * ```
 */
export function deleteElement(editor: YooEditor, options: DeleteElementOptions): void {
  const { blockId, type, path, match, mode = 'remove' } = options;

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
    if (Path.isPath(path)) {
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

    // Delete based on element type
    if (isInline) {
      deleteInlineElement(slate, targetPath, targetElement, mode);
    } else {
      deleteBlockElement(slate, targetPath, targetElement);
    }
  });
}
