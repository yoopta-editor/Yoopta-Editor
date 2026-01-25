import { useCallback, useEffect, useRef, useState } from 'react';
import { Paths, type YooEditor } from '@yoopta/editor';

import type { RectangeSelectionProps, RectangeSelectionState } from './SelectionBox';

type Coords = [number, number];

const findBlocksUnderSelection = (editor: YooEditor, origin: Coords, coords: Coords): number[] => {
  const blocksUnderSelection: number[] = [];
  const blocks = editor.refElement?.querySelectorAll(`[data-yoopta-block]`);

  if (!blocks) return blocksUnderSelection;

  const selectionRect = {
    top: Math.min(origin[1], coords[1]),
    left: Math.min(origin[0], coords[0]),
    bottom: Math.max(origin[1], coords[1]),
    right: Math.max(origin[0], coords[0]),
  };

  blocks.forEach((blockEl, i) => {
    const blockRect = blockEl.getBoundingClientRect();

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

const INITIAL_STATE: RectangeSelectionState = {
  origin: [0, 0],
  coords: [0, 0],
  selection: false,
};

// [TODO] - Fix selection when multiple editors
export const useRectangeSelectionBox = ({
  editor,
  root,
}: RectangeSelectionProps): RectangeSelectionReturn => {
  const [state, setState] = useState<RectangeSelectionState>(INITIAL_STATE);

  // Use refs to avoid stale closures in event handlers
  const stateRef = useRef(state);
  stateRef.current = state;

  const onClose = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  useEffect(() => {
    if (editor.readOnly) return;

    const getRootElement = (): HTMLElement | Document | null => {
      if (root && 'current' in root) return root.current;
      if (root) return root;
      return null;
    };

    const elementMouseEl = getRootElement();

    // Skip if root element is not yet available (e.g., ref not mounted)
    if (!elementMouseEl) return;

    if (editor.refElement?.contains(elementMouseEl as Node)) {
      throw new Error(
        'Root element should not be a child of the editor. Please check the `selectionBoxElement` prop',
      );
    }

    const onMouseDown = (event: MouseEvent) => {
      const isInsideEditor = editor.refElement?.contains(event.target as Node);
      const selectedBlocks = Paths.getSelectedPaths(editor);

      if (
        !isInsideEditor &&
        !stateRef.current.selection &&
        Array.isArray(selectedBlocks) &&
        selectedBlocks.length > 0
      ) {
        editor.setPath({ current: null });
        onClose();
        return;
      }

      if (isInsideEditor) return;

      const coords: Coords = [event.pageX, event.pageY - window.scrollY];
      setState({
        origin: coords,
        coords,
        selection: true,
      });
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!stateRef.current.selection) return;

      const newCoords: Coords = [event.pageX, event.pageY - window.scrollY];

      setState((prevState) => ({
        ...prevState,
        coords: newCoords,
      }));

      const blocksUnderSelection = findBlocksUnderSelection(
        editor,
        stateRef.current.origin,
        newCoords,
      );

      editor.setPath({ current: null, selected: blocksUnderSelection, source: 'selection-box' });
    };

    const onMouseUp = () => {
      if (stateRef.current.selection) {
        onClose();
      }
    };

    elementMouseEl.addEventListener('mousedown', onMouseDown as EventListener);
    elementMouseEl.addEventListener('mousemove', onMouseMove as EventListener);
    elementMouseEl.addEventListener('mouseup', onMouseUp);

    return () => {
      elementMouseEl.removeEventListener('mousedown', onMouseDown as EventListener);
      elementMouseEl.removeEventListener('mousemove', onMouseMove as EventListener);
      elementMouseEl.removeEventListener('mouseup', onMouseUp);
    };
  }, [editor, root, onClose]);

  return {
    ...state,
    onClose,
  };
};

