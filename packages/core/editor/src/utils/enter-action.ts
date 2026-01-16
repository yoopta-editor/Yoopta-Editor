import type { Path } from 'slate';
import { Editor, Element, Range, Transforms } from 'slate';

import { generateId } from './generateId';
import { Blocks } from '../editor/blocks';
import { Paths } from '../editor/paths';
import type { SlateElement, YooEditor } from '../editor/types';

type EnterResult =
  | { action: 'split-block' }
  | { action: 'insert-block-after' }
  | { action: 'insert-block-before' }
  | { action: 'insert-soft-break' }
  | { action: 'split-injected-element'; path: Path }
  | { action: 'exit-injected-element'; injectedPath: Path; parentLeafPath: Path }
  | { action: 'delete-empty-injected'; path: Path }
  | { action: 'reset-to-paragraph' }
  | { action: 'delegate-to-plugin' }
  | { action: 'default' }
  | { action: 'prevent' };

/**
 * Checks if an element is injected
 */
function isInjectedElement(editor: YooEditor, element: SlateElement): boolean {
  const currentBlock = Blocks.getBlock(editor, { at: editor.path.current });
  if (!currentBlock) return false;

  const plugin = editor.plugins[currentBlock.type];
  if (!plugin?.elements) return false;

  const elementConfig = plugin.elements[element.type];

  return !!elementConfig?.rootPlugin && elementConfig.rootPlugin !== currentBlock.type;
}

/**
 * Checks if a block is simple
 */
function isSimpleBlock(editor: YooEditor): boolean {
  const currentBlock = Blocks.getBlock(editor, { at: editor.path.current });
  if (!currentBlock) return false;

  const plugin = editor.plugins[currentBlock.type];
  if (!plugin?.elements) return false;

  const hasComplexStructure = Object.values(plugin.elements).some((element) => {
    if (element.rootPlugin) return false;
    return element.children && element.children.length > 0;
  });

  return !hasComplexStructure;
}

/**
 * Checks if an element can contain injected elements
 */
function canContainInjectedElements(editor: YooEditor, elementType: string): boolean {
  const currentBlock = Blocks.getBlock(editor, { at: editor.path.current });
  if (!currentBlock) return false;

  const plugin = editor.plugins[currentBlock.type];
  if (!plugin?.elements) return false;

  const elementConfig = plugin.elements[elementType];

  return (
    Array.isArray(elementConfig?.injectElementsFromPlugins) &&
    elementConfig.injectElementsFromPlugins.length > 0
  );
}

/**
 * Finds the injected ancestor element
 */
function findInjectedAncestor(
  editor: YooEditor,
  slate: Editor,
  path: Path,
): { element: SlateElement; path: Path } | null {
  let currentPath = path;

  while (currentPath.length > 0) {
    try {
      const [node] = Editor.node(slate, currentPath);

      if (Element.isElement(node) && isInjectedElement(editor, node as SlateElement)) {
        return { element: node as SlateElement, path: currentPath };
      }
    } catch {
      // Ignore
    }

    currentPath = currentPath.slice(0, -1);
  }

  return null;
}

/**
 * Finds the parent leaf element of the plugin (which can contain injected elements)
 */
function findParentLeafElement(
  editor: YooEditor,
  slate: Editor,
  path: Path,
): { element: SlateElement; path: Path } | null {
  let currentPath = path;

  while (currentPath.length > 0) {
    try {
      const [node] = Editor.node(slate, currentPath);

      if (Element.isElement(node)) {
        const slateElement = node as SlateElement;

        if (canContainInjectedElements(editor, slateElement.type)) {
          return { element: slateElement, path: currentPath };
        }
      }
    } catch {
      // Ignore
    }

    currentPath = currentPath.slice(0, -1);
  }

  return null;
}

/**
 * Checks if an element is empty
 */
function isElementEmpty(slate: Editor, path: Path): boolean {
  try {
    const text = Editor.string(slate, path);
    return text.trim().length === 0;
  } catch {
    return true;
  }
}

/**
 * Checks if an injected element can be split
 */
function canSplitInjectedElement(editor: YooEditor, element: SlateElement): boolean {
  const splittableTypes = new Set([
    'paragraph',
    'heading-one',
    'heading-two',
    'heading-three',
    'blockquote',
  ]);

  return splittableTypes.has(element.type);
}

/**
 * Checks if the block type should be reset to Paragraph
 */
function shouldResetToParagraph(editor: YooEditor): boolean {
  const currentBlock = Blocks.getBlock(editor, { at: editor.path.current });
  if (!currentBlock) return false;

  const resetTypes = new Set(['HeadingOne', 'HeadingTwo', 'HeadingThree', 'Blockquote']);

  return resetTypes.has(currentBlock.type);
}

/**
 * Main function to determine the action for Enter
 */
export function getEnterAction(editor: YooEditor, slate: Editor): EnterResult {
  if (!slate.selection) return { action: 'prevent' };

  const { anchor } = slate.selection;
  const isCollapsed = Range.isCollapsed(slate.selection);

  // If there's a selection — delete it first
  if (!isCollapsed) {
    Transforms.delete(slate, { at: slate.selection });
  }

  // Find the current element
  const currentElementEntry = Editor.above<SlateElement>(slate, {
    at: anchor,
    match: (n) => Element.isElement(n),
  });

  if (!currentElementEntry) return { action: 'default' };

  const [, currentPath] = currentElementEntry;

  // Check cursor position relative to the entire block
  const first = Editor.first(slate, []);
  const last = Editor.last(slate, []);
  const isAtBlockStart = Editor.isStart(slate, anchor, first[1]);
  const isAtBlockEnd = Editor.isEnd(slate, anchor, last[1]);
  const isBlockEmpty = isElementEmpty(slate, []);

  // === Case 3: Injected elements ===
  const injectedAncestor = findInjectedAncestor(editor, slate, anchor.path);

  if (injectedAncestor) {
    const isInjectedEmpty = isElementEmpty(slate, injectedAncestor.path);

    // Case 3c: Empty injected element — delete it
    if (isInjectedEmpty) {
      return { action: 'delete-empty-injected', path: injectedAncestor.path };
    }

    const isAtInjectedEnd = Editor.isEnd(slate, anchor, injectedAncestor.path);
    const isAtInjectedStart = Editor.isStart(slate, anchor, injectedAncestor.path);

    // Case 3a: Cursor at the end of injected element — exit from it
    if (isAtInjectedEnd) {
      // Find parent leaf element
      const parentLeaf = findParentLeafElement(editor, slate, injectedAncestor.path);

      if (parentLeaf) {
        return {
          action: 'exit-injected-element',
          injectedPath: injectedAncestor.path,
          parentLeafPath: parentLeaf.path,
        };
      }

      // Fallback: soft break
      return { action: 'insert-soft-break' };
    }

    // Case 3b: Cursor in the middle — try to split
    if (!isAtInjectedStart && canSplitInjectedElement(editor, injectedAncestor.element)) {
      return { action: 'split-injected-element', path: injectedAncestor.path };
    }

    // Insert soft break
    return { action: 'insert-soft-break' };
  }

  // === Case 1: Simple block ===
  if (isSimpleBlock(editor)) {
    // Case 1d: Empty block
    if (isBlockEmpty) {
      if (shouldResetToParagraph(editor)) {
        return { action: 'reset-to-paragraph' };
      }
      return { action: 'insert-block-after' };
    }

    // Case 1b: Cursor at the end
    if (isAtBlockEnd) {
      return { action: 'insert-block-after' };
    }

    // Case 1c: Cursor at the start of non-empty block
    if (isAtBlockStart) {
      return { action: 'insert-block-before' };
    }

    // Case 1a: Cursor in the middle
    return { action: 'split-block' };
  }

  // === Case 2: Complex plugin ===
  const parentLeaf = findParentLeafElement(editor, slate, currentPath);

  if (parentLeaf) {
    return { action: 'delegate-to-plugin' };
  }

  return { action: 'delegate-to-plugin' };
}

/**
 * Executes the Enter action
 */
export function executeEnterAction(editor: YooEditor, slate: Editor, result: EnterResult): void {
  switch (result.action) {
    case 'split-block': {
      editor.splitBlock({ focus: true });
      break;
    }

    case 'insert-block-after': {
      const defaultBlock = Blocks.buildBlockData({ id: generateId() });
      const nextPath = Paths.getNextBlockOrder(editor);

      editor.insertBlock(defaultBlock.type, {
        at: nextPath,
        focus: true,
      });
      break;
    }

    case 'insert-block-before': {
      const currentBlock = Blocks.getBlock(editor, { at: editor.path.current });
      const defaultBlock = Blocks.buildBlockData({ id: generateId() });

      editor.batchOperations(() => {
        editor.insertBlock(defaultBlock.type, {
          at: editor.path.current,
          focus: false,
        });

        if (currentBlock) {
          editor.focusBlock(currentBlock.id);
        }
      });
      break;
    }

    case 'insert-soft-break': {
      Transforms.insertText(slate, '\n');
      break;
    }

    case 'split-injected-element': {
      Transforms.splitNodes(slate, {
        at: slate.selection!,
        match: (n) => {
          if (!Element.isElement(n)) return false;
          const currentBlock = Blocks.getBlock(editor, { at: editor.path.current });
          if (!currentBlock) return false;
          const plugin = editor.plugins[currentBlock.type];
          if (!plugin?.elements) return false;
          const elementConfig = plugin.elements[(n as SlateElement).type];
          return !!elementConfig?.rootPlugin && elementConfig.rootPlugin !== currentBlock.type;
        },
        always: true,
      });
      break;
    }

    case 'exit-injected-element': {
      // Calculate path for new element INSIDE parentLeaf, after injected element
      // injectedPath relative to slate: e.g. [0, 0, 0, 1, 0]
      // we need to insert sibling after injected inside parentLeaf

      const { injectedPath, parentLeafPath } = result;

      // Path of injected element relative to parentLeaf
      // Example: injectedPath = [0, 0, 0, 1, 0], parentLeafPath = [0, 0, 0, 1]
      // Then injected inside parent is [0], and we insert [1]

      // Find index of injected element inside parentLeaf
      const injectedIndexInParent = injectedPath[parentLeafPath.length];

      // Path for new element (next sibling inside parentLeaf)
      const newElementPath = [...parentLeafPath, injectedIndexInParent + 1];

      // Create empty text node
      const textNode = { text: '' };

      Transforms.insertNodes(slate, textNode, {
        at: newElementPath,
        select: true,
      });
      break;
    }

    case 'delete-empty-injected': {
      Transforms.removeNodes(slate, { at: result.path });
      break;
    }

    case 'reset-to-paragraph': {
      editor.toggleBlock('Paragraph', { focus: true });
      break;
    }

    case 'delegate-to-plugin':
    case 'default':
    case 'prevent':
      break;

    default:
      break;
  }
}
