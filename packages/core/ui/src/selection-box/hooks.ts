import { useCallback, useEffect, useRef, useState } from 'react';
import { Paths, type YooEditor } from '@yoopta/editor';

import type { RectangeSelectionProps, RectangeSelectionState } from './SelectionBox';

type Coords = [number, number];

const SCROLL_EDGE_THRESHOLD = 60;
const SCROLL_MAX_SPEED = 15;

// origin is in page (document) coordinates; coords is in viewport coordinates.
// Convert origin to viewport space for hit-testing against getBoundingClientRect().
const findBlocksUnderSelection = (editor: YooEditor, originPage: Coords, coords: Coords): number[] => {
  const blocksUnderSelection: number[] = [];
  const blocks = editor.refElement?.querySelectorAll(`[data-yoopta-block]`);

  if (!blocks) return blocksUnderSelection;

  // Convert origin from page to viewport coords
  const scrollX = typeof window !== 'undefined' ? window.scrollX : 0;
  const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
  const originViewport: Coords = [originPage[0] - scrollX, originPage[1] - scrollY];

  const selectionRect = {
    top: Math.min(originViewport[1], coords[1]),
    left: Math.min(originViewport[0], coords[0]),
    bottom: Math.max(originViewport[1], coords[1]),
    right: Math.max(originViewport[0], coords[0]),
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

  const scrollRafRef = useRef<number | null>(null);
  const lastMouseYRef = useRef(0);
  const lastMouseXRef = useRef(0);

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

      // Prevent native text selection when starting selection box
      event.preventDefault();

      // Clear any existing native selection
      window.getSelection()?.removeAllRanges();

      // Add user-select: none to editor during selection
      if (editor.refElement) {
        editor.refElement.style.userSelect = 'none';
      }

      // Store origin in page (document) coordinates so it stays anchored
      // to the document position even when the page scrolls.
      const scrollX = typeof window !== 'undefined' ? window.scrollX : 0;
      const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
      const originPage: Coords = [event.clientX + scrollX, event.clientY + scrollY];
      // Current coords stay in viewport space (clientX/clientY)
      const currentCoords: Coords = [event.clientX, event.clientY];
      setState({
        origin: originPage,
        coords: currentCoords,
        selection: true,
      });
    };

    const updateSelectionFromCoords = (clientX: number, clientY: number) => {
      const newCoords: Coords = [clientX, clientY];

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

    const startAutoScroll = () => {
      if (scrollRafRef.current !== null) return;

      const tick = () => {
        if (!stateRef.current.selection) {
          scrollRafRef.current = null;
          return;
        }

        const mouseY = lastMouseYRef.current;
        const viewportHeight = window.innerHeight;
        let scrollDelta = 0;

        if (mouseY < SCROLL_EDGE_THRESHOLD) {
          // Near top edge — scroll up
          const proximity = 1 - mouseY / SCROLL_EDGE_THRESHOLD;
          scrollDelta = -Math.round(SCROLL_MAX_SPEED * proximity);
        } else if (mouseY > viewportHeight - SCROLL_EDGE_THRESHOLD) {
          // Near bottom edge — scroll down
          const proximity = 1 - (viewportHeight - mouseY) / SCROLL_EDGE_THRESHOLD;
          scrollDelta = Math.round(SCROLL_MAX_SPEED * proximity);
        }

        if (scrollDelta !== 0) {
          window.scrollBy(0, scrollDelta);
          // Update selection to account for scroll — origin shifts with viewport
          updateSelectionFromCoords(lastMouseXRef.current, lastMouseYRef.current);
          scrollRafRef.current = requestAnimationFrame(tick);
        } else {
          scrollRafRef.current = null;
        }
      };

      scrollRafRef.current = requestAnimationFrame(tick);
    };

    const stopAutoScroll = () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!stateRef.current.selection) return;

      // Prevent native selection during drag
      event.preventDefault();

      // Clear any native selection that might have occurred
      window.getSelection()?.removeAllRanges();

      lastMouseXRef.current = event.clientX;
      lastMouseYRef.current = event.clientY;

      updateSelectionFromCoords(event.clientX, event.clientY);

      // Start auto-scrolling if near viewport edges
      if (
        event.clientY < SCROLL_EDGE_THRESHOLD ||
        event.clientY > window.innerHeight - SCROLL_EDGE_THRESHOLD
      ) {
        startAutoScroll();
      } else {
        stopAutoScroll();
      }
    };

    const onMouseUp = () => {
      stopAutoScroll();
      if (stateRef.current.selection) {
        // Restore user-select on editor
        if (editor.refElement) {
          editor.refElement.style.userSelect = '';
        }
        onClose();
      }
    };

    elementMouseEl.addEventListener('mousedown', onMouseDown as EventListener);
    elementMouseEl.addEventListener('mousemove', onMouseMove as EventListener);
    elementMouseEl.addEventListener('mouseup', onMouseUp);

    return () => {
      stopAutoScroll();
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

