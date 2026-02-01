import { Editor, Element, Path, Point, Range } from 'slate';

import type { SlateElement, YooEditor } from '../editor/types';

type HierarchicalSelectResult =
  | { action: 'select-path'; path: Path }
  | { action: 'select-range'; range: Range }
  | { action: 'select-block'; blockOrder: number }
  | { action: 'select-all-blocks'; blockOrders: number[] }
  | { action: 'none' };

/**
 * Checks if an element at the specified path is fully selected
 */
function isPathFullySelected(slate: Editor, selection: Range, targetPath: Path): boolean {
  const targetRange = Editor.range(slate, targetPath);
  const [selStart, selEnd] = Range.edges(selection);
  const [targetStart, targetEnd] = Range.edges(targetRange);

  return Point.compare(selStart, targetStart) <= 0 && Point.compare(selEnd, targetEnd) >= 0;
}

/**
 * Finds the path to the current Element (not a text node)
 */
function getCurrentElementPath(slate: Editor): Path | null {
  if (!slate.selection) return null;

  const entry = Editor.above<SlateElement>(slate, {
    at: slate.selection.anchor,
    match: (n) => Element.isElement(n),
  });

  return entry ? entry[1] : null;
}

/**
 * Checks if an element is a leaf (contains only text nodes)
 */
function isLeafElement(slate: Editor, path: Path): boolean {
  try {
    const [node] = Editor.node(slate, path);
    if (!Element.isElement(node)) return false;

    // Leaf element if all children are text nodes
    return node.children.every((child) => !Element.isElement(child));
  } catch {
    return false;
  }
}

export function getNextHierarchicalSelection(
  editor: YooEditor,
  slate: Editor,
): HierarchicalSelectResult {
  if (!slate.selection) return { action: 'none' };

  // Case 1: Blocks are already selected at editor level
  const selectedPaths = editor.path.selected;
  if (Array.isArray(selectedPaths) && selectedPaths.length > 0) {
    if (selectedPaths.length === 1) {
      const allBlockPaths = Array.from(
        { length: Object.keys(editor.children).length },
        (_, i) => i,
      );
      return { action: 'select-all-blocks', blockOrders: allBlockPaths };
    }
    return { action: 'none' };
  }

  const isExpanded = Range.isExpanded(slate.selection);
  const currentElementPath = getCurrentElementPath(slate);

  if (!currentElementPath) return { action: 'none' };

  // Case 2: Nothing is selected — select current element
  if (!isExpanded) {
    const currentText = Editor.string(slate, currentElementPath);

    // If element is empty — move up to parent immediately
    if (currentText.trim().length === 0) {
      if (currentElementPath.length <= 1) {
        return {
          action: 'select-block',
          blockOrder: editor.path.current as number,
        };
      }
      const parentPath = Path.parent(currentElementPath);
      return { action: 'select-path', path: parentPath };
    }

    // For leaf elements use range, for others use path
    if (isLeafElement(slate, currentElementPath)) {
      return { action: 'select-range', range: Editor.range(slate, currentElementPath) };
    }
    return { action: 'select-path', path: currentElementPath };
  }

  // Case 3: Something is selected — check current element and move up
  const isCurrentFullySelected = isPathFullySelected(slate, slate.selection, currentElementPath);

  if (!isCurrentFullySelected) {
    // Current element is not fully selected — select it
    if (isLeafElement(slate, currentElementPath)) {
      return { action: 'select-range', range: Editor.range(slate, currentElementPath) };
    }
    return { action: 'select-path', path: currentElementPath };
  }

  // Current element is fully selected — find nearest unselected parent
  let pathToCheck = currentElementPath;

  while (pathToCheck.length > 0) {
    const parentPath = Path.parent(pathToCheck);

    // Reached slate root
    if (parentPath.length === 0 || parentPath.length === 1) {
      // Check if entire slate is selected
      const isFullSlateSelected = isPathFullySelected(slate, slate.selection, []);

      if (isFullSlateSelected) {
        return {
          action: 'select-block',
          blockOrder: editor.path.current as number,
        };
      }
      // Select entire slate
      return { action: 'select-path', path: [] };
    }

    // Check if parent is selected
    const isParentFullySelected = isPathFullySelected(slate, slate.selection, parentPath);

    if (!isParentFullySelected) {
      // Parent is not selected — select it
      return { action: 'select-path', path: parentPath };
    }

    // Parent is already selected — move up
    pathToCheck = parentPath;
  }

  // Fallback
  return { action: 'none' };
}
