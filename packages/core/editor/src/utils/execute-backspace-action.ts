import { Editor, Element, Path, Range, Transforms } from 'slate';

import { getRootBlockElement } from './block-elements';
import { findSlateBySelectionPath } from './findSlateBySelectionPath';
import { getLastNodePoint } from './get-node-points';
import { Blocks } from '../editor/blocks';
import { Paths } from '../editor/paths';
import type { SlateElement, YooEditor } from '../editor/types';

type BackspaceResult =
  | { action: 'delete-injected-element'; path: Path }
  | { action: 'delete-block' }
  | { action: 'move-cursor'; targetPath: Path }
  | { action: 'move-to-previous-block' }
  | { action: 'merge-with-previous-block' }
  | { action: 'default' }
  | { action: 'prevent' };

/**
 * Checks if an element is injected from another plugin
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
 * Checks if an element is an inline element
 */
function isInlineElement(editor: YooEditor, element: SlateElement): boolean {
  const currentBlock = Blocks.getBlock(editor, { at: editor.path.current });
  if (!currentBlock) return false;

  const plugin = editor.plugins[currentBlock.type];
  if (!plugin?.elements) return false;

  const elementConfig = plugin.elements[element.type];

  return elementConfig?.props?.nodeType === 'inline';
}

/**
 * Checks if an element is a leaf element in the plugin configuration
 */
function isPluginLeafElement(editor: YooEditor, elementType: string): boolean {
  const currentBlock = Blocks.getBlock(editor, { at: editor.path.current });
  if (!currentBlock) return false;

  const plugin = editor.plugins[currentBlock.type];
  if (!plugin?.elements) return false;

  const elementConfig = plugin.elements[elementType];
  if (!elementConfig) return false;

  return !elementConfig.children || elementConfig.children.length === 0;
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
 * Checks if a block is "simple" — meaning it can be deleted entirely on Backspace
 * Simple block: all elements are leaf (no nested structure like tabs/steps)
 */
function isSimpleBlock(editor: YooEditor): boolean {
  const currentBlock = Blocks.getBlock(editor, { at: editor.path.current });
  if (!currentBlock) return false;

  const plugin = editor.plugins[currentBlock.type];
  if (!plugin?.elements) return false;

  // Check if there are elements with children (complex structure)
  const hasComplexStructure = Object.values(plugin.elements).some((element) => {
    // Skip injected elements (they have rootPlugin)
    if (element.rootPlugin) return false;

    // If element has children — it's a complex structure
    return element.children && element.children.length > 0;
  });

  return !hasComplexStructure;
}

/**
 * Finds the nearest injected ancestor element
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
      // Path does not exist
    }

    currentPath = currentPath.slice(0, -1);
  }

  return null;
}

/**
 * Finds the parent leaf element of the plugin
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

        if (
          isPluginLeafElement(editor, slateElement.type) &&
          canContainInjectedElements(editor, slateElement.type)
        ) {
          return { element: slateElement, path: currentPath };
        }
      }
    } catch {
      // Path does not exist
    }

    currentPath = currentPath.slice(0, -1);
  }

  return null;
}

/**
 * Finds the previous sibling element
 */
function getPreviousSiblingEntry(
  slate: Editor,
  path: Path,
): { element: SlateElement; path: Path } | null {
  if (path.length === 0) return null;

  const index = path[path.length - 1];
  if (index === 0) return null;

  const siblingPath = [...path.slice(0, -1), index - 1];

  try {
    const [node] = Editor.node(slate, siblingPath);
    if (Element.isElement(node)) {
      return { element: node as SlateElement, path: siblingPath };
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Finds the last editable position inside an element
 */
function getLastEditablePoint(slate: Editor, path: Path): Path {
  try {
    const end = Editor.end(slate, path);
    return end.path;
  } catch {
    return path;
  }
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
 * Checks if a block type is mergeable (has nodeType 'block' or undefined, not 'void' or 'inline')
 */
function isMergeableBlockType(editor: YooEditor, blockType: string): boolean {
  const plugin = editor.plugins[blockType];
  if (!plugin) return false;

  const rootElement = getRootBlockElement(plugin.elements);
  const nodeType = rootElement?.props?.nodeType;

  // nodeType 'block' is the default, so undefined also means 'block'
  // Only void and inline elements are not mergeable
  return nodeType !== 'void' && nodeType !== 'inline';
}

/**
 * Checks if the current block can be merged with the previous one
 */
function canMergeWithPrevious(editor: YooEditor): boolean {
  const currentBlock = Blocks.getBlock(editor, { at: editor.path.current });
  const prevBlockOrder = Paths.getPreviousBlockOrder(editor);

  if (typeof prevBlockOrder !== 'number') return false;

  const prevBlock = Blocks.getBlock(editor, { at: prevBlockOrder });

  if (!currentBlock || !prevBlock) return false;

  return isMergeableBlockType(editor, currentBlock.type) && isMergeableBlockType(editor, prevBlock.type);
}

/**
 * Main function to determine the action for Backspace
 */
export function getBackspaceAction(editor: YooEditor, slate: Editor): BackspaceResult {
  if (!slate.selection) return { action: 'prevent' };

  const isCollapsed = Range.isCollapsed(slate.selection);

  // If there's a selection — standard deletion
  if (!isCollapsed) {
    return { action: 'default' };
  }

  const { anchor } = slate.selection;

  // Find the current element
  const currentElementEntry = Editor.above<SlateElement>(slate, {
    at: anchor,
    match: (n) => Element.isElement(n),
  });

  if (!currentElementEntry) return { action: 'default' };

  const [, currentPath] = currentElementEntry;

  // Check if cursor is at the start of the current element
  const isAtStart = Editor.isStart(slate, anchor, currentPath);

  if (!isAtStart) {
    return { action: 'default' };
  }

  // === Cursor at the start of element ===

  // Case 1 & 3: Check if we're inside an injected element
  const injectedAncestor = findInjectedAncestor(editor, slate, anchor.path);

  if (injectedAncestor) {
    // For inline elements (like links), let Slate handle backspace normally
    // This allows proper deletion of characters before/inside inline elements
    if (isInlineElement(editor, injectedAncestor.element)) {
      return { action: 'default' };
    }

    const isInjectedEmpty = isElementEmpty(slate, injectedAncestor.path);

    if (isInjectedEmpty) {
      return { action: 'delete-injected-element', path: injectedAncestor.path };
    }

    const prevSibling = getPreviousSiblingEntry(slate, injectedAncestor.path);

    if (prevSibling) {
      const targetPath = getLastEditablePoint(slate, prevSibling.path);
      return { action: 'move-cursor', targetPath };
    }

    return { action: 'prevent' };
  }

  // Check if this is a simple block (can be deleted entirely)
  const isSimple = isSimpleBlock(editor);
  const isBlockEmpty = isElementEmpty(slate, []);
  const prevBlockOrder = Paths.getPreviousBlockOrder(editor);
  const hasPrevBlock = typeof prevBlockOrder === 'number';

  // Case 5: Simple block (Paragraph, Heading, Callout, Blockquote, etc.)
  if (isSimple) {
    // Check if cursor is at the start of the entire block (not just current element)
    const isAtBlockStart = Editor.isStart(slate, anchor, []);

    if (isAtBlockStart) {
      if (isBlockEmpty) {
        // Empty block — delete it
        if (hasPrevBlock) {
          return { action: 'delete-block' };
        }
        // First block — do nothing
        return { action: 'prevent' };
      }

      // Block is not empty, but cursor is at the start
      if (hasPrevBlock) {
        if (canMergeWithPrevious(editor)) {
          return { action: 'merge-with-previous-block' };
        }
        return { action: 'move-to-previous-block' };
      }

      return { action: 'prevent' };
    }

    // Cursor is not at the start of block — standard behavior
    return { action: 'default' };
  }

  // Case 2 & 4: Complex plugin (Tabs, Steps, etc.)
  const parentLeaf = findParentLeafElement(editor, slate, currentPath);

  if (parentLeaf) {
    const isLeafEmpty = isElementEmpty(slate, parentLeaf.path);

    if (isLeafEmpty) {
      // Empty leaf — find where to move cursor
      const prevSibling = getPreviousSiblingEntry(slate, parentLeaf.path);

      if (prevSibling) {
        const targetPath = getLastEditablePoint(slate, prevSibling.path);
        return { action: 'move-cursor', targetPath };
      }

      // Try to go up
      let checkPath = Path.parent(parentLeaf.path);

      while (checkPath.length > 0) {
        const prevParentSibling = getPreviousSiblingEntry(slate, checkPath);

        if (prevParentSibling) {
          const targetPath = getLastEditablePoint(slate, prevParentSibling.path);
          return { action: 'move-cursor', targetPath };
        }

        checkPath = Path.parent(checkPath);
      }

      // We're at the very start of the complex plugin
      return { action: 'prevent' };
    }

    // Leaf is not empty — find previous sibling
    const prevSibling = getPreviousSiblingEntry(slate, currentPath);

    if (prevSibling && isInjectedElement(editor, prevSibling.element)) {
      const targetPath = getLastEditablePoint(slate, prevSibling.path);
      return { action: 'move-cursor', targetPath };
    }

    const prevLeafSibling = getPreviousSiblingEntry(slate, parentLeaf.path);

    if (prevLeafSibling) {
      const targetPath = getLastEditablePoint(slate, prevLeafSibling.path);
      return { action: 'move-cursor', targetPath };
    }

    return { action: 'prevent' };
  }

  // Fallback for complex plugins without parentLeaf
  // Check if cursor is at the start of the entire block
  const isAtBlockStart = Editor.isStart(slate, anchor, []);

  if (isAtBlockStart && isBlockEmpty && hasPrevBlock) {
    return { action: 'delete-block' };
  }

  return { action: 'prevent' };
}

/**
 * Executes the Backspace action
 */
export function executeBackspaceAction(
  editor: YooEditor,
  slate: Editor,
  result: BackspaceResult,
): void {
  switch (result.action) {
    case 'delete-injected-element': {
      Transforms.removeNodes(slate, { at: result.path });
      break;
    }

    case 'delete-block': {
      editor.deleteBlock({ at: editor.path.current, focus: true });
      break;
    }

    case 'move-cursor': {
      const point = Editor.end(slate, result.targetPath);
      Transforms.select(slate, point);
      break;
    }

    case 'move-to-previous-block': {
      const prevBlockOrder = Paths.getPreviousBlockOrder(editor);
      if (typeof prevBlockOrder !== 'number') break;

      const prevBlock = Blocks.getBlock(editor, { at: prevBlockOrder });
      if (!prevBlock) break;

      const prevSlate = findSlateBySelectionPath(editor, { at: prevBlockOrder });
      if (!prevSlate) break;

      const lastPoint = getLastNodePoint(prevSlate);

      editor.focusBlock(prevBlock.id, {
        focusAt: lastPoint,
        waitExecution: false,
        shouldUpdateBlockPath: true,
      });
      break;
    }

    case 'merge-with-previous-block': {
      editor.mergeBlock();
      break;
    }

    case 'default':
    case 'prevent':
      break;

    default:
      break;
  }
}
