import { useEffect, useState } from 'react';
import { Paths } from '../../editor/paths';
import { YooEditor } from '../../editor/types';
import { RectangeSelectionProps, RectangeSelectionState } from './SelectionBox';

const findBlocksUnderSelection = (editor: YooEditor, origin, coords) => {
  const blocksUnderSelection: number[] = [];
  const blocks = editor.refElement?.querySelectorAll(`[data-yoopta-block]`);

  if (!blocks) return blocksUnderSelection;

  blocks.forEach((blockEl, i) => {
    if (!blockEl) return;

    const blockRect = blockEl.getBoundingClientRect();
    const selectionRect = {
      top: Math.min(origin[1], coords[1]),
      left: Math.min(origin[0], coords[0]),
      bottom: Math.max(origin[1], coords[1]),
      right: Math.max(origin[0], coords[0]),
    };

    if (
      selectionRect.top < blockRect.bottom &&
      selectionRect.bottom > blockRect.top &&
      selectionRect.left < blockRect.right &&
      selectionRect.right > blockRect.left
    ) {
      blocksUnderSelection.push(i);
    }
  });

  return blocksUnderSelection;
};

type RectangeSelectionReturn = RectangeSelectionState & {
  onClose: () => void;
};

// [TODO] - Fix selection when multiple editors
// Maybe move to a separate npm package?
export const useRectangeSelectionBox = ({ editor, root }: RectangeSelectionProps): RectangeSelectionReturn => {
  const [state, setState] = useState<RectangeSelectionState>({
    origin: [0, 0],
    coords: [0, 0],
    selection: false,
  });

  const onMouseDown = (event) => {
    if (editor.readOnly || root === false) return;

    const isInsideEditor = editor.refElement?.contains(event.target as Node);
    const selectedBlocks = Paths.getSelectedPaths(editor);

    if (!isInsideEditor && !state.selection && Array.isArray(selectedBlocks) && selectedBlocks.length > 0) {
      editor.setPath({ current: null });
      return onClose();
    }

    if (isInsideEditor) return;

    setState({
      origin: [event.pageX, event.pageY - window.pageYOffset],
      coords: [event.pageX, event.pageY - window.pageYOffset],
      selection: true,
    });
  };

  const onMouseMove = (event) => {
    if (!state.selection || editor.readOnly || root === false) return;

    setState((prevState) => ({
      ...prevState,
      coords: [event.pageX, event.pageY - window.pageYOffset],
    }));

    const blocksUnderSelection = findBlocksUnderSelection(editor, state.origin, [
      event.pageX,
      event.pageY - window.pageYOffset,
    ]);

    editor.setPath({ current: null, selected: blocksUnderSelection, source: 'selection-box' });
  };

  const onMouseUp = () => {
    if (editor.readOnly) return;

    onClose();
  };

  const getRootBlockElement = () => {
    if (root && 'current' in root) return root.current;
    if (root) return root;
    return document;
  };

  useEffect(() => {
    if (editor.readOnly || root === false) return;

    const elementMouseEl = getRootBlockElement();

    if (!elementMouseEl) {
      throw new Error('Root element not found. Please check the `selectionBoxRoot` prop');
    }

    if (!('nodeType' in elementMouseEl)) {
      throw new Error('Root element should be a DOM element or a ref object. Please check the `selectionBoxRoot` prop');
    }

    if (editor.refElement?.contains(elementMouseEl)) {
      throw new Error('Root element should not be a child of the editor. Please check the `selectionBoxRoot` prop');
    }

    elementMouseEl.addEventListener('mousedown', onMouseDown);
    elementMouseEl.addEventListener('mousemove', onMouseMove);
    elementMouseEl.addEventListener('mouseup', onMouseUp);

    return () => {
      elementMouseEl.removeEventListener('mousedown', onMouseDown);
      elementMouseEl.removeEventListener('mousemove', onMouseMove);
      elementMouseEl.removeEventListener('mouseup', onMouseUp);
    };
  }, [editor.path, state, root, editor.readOnly]);

  const onClose = () => {
    setState({
      origin: [0, 0],
      coords: [0, 0],
      selection: false,
    });
  };

  return {
    ...state,
    onClose,
  };
};
