import { useEffect, useCallback, useMemo } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  inline,
  useTransitionStyles,
} from '@floating-ui/react';
import { useYooptaEditor } from '@yoopta/editor';
import { throttle } from '../utils/throttle';
import { useToolbarStore } from './store';

/**
 * Hook for Toolbar
 * Handles selection tracking, positioning, and provides access to store
 */
export const useToolbar = () => {
  const editor = useYooptaEditor();
  const { state, frozen, open, close, setFrozen, toggle, reset } = useToolbarStore();

  const { refs, floatingStyles, context, update } = useFloating({
    placement: 'top',
    open: state === 'open',
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 100,
  });

  // Selection change handler for text selection
  const selectionChange = useCallback(() => {
    if (frozen) return;

    const toolbarEl = refs.floating.current;
    if (toolbarEl && toolbarEl.contains(document.activeElement)) {
      return;
    }

    const domSelection = window.getSelection();

    if (
      !domSelection ||
      domSelection?.isCollapsed ||
      domSelection?.anchorOffset === domSelection?.focusOffset
    ) {
      if (state === 'open') {
        close();
      }
      return;
    }

    const domRange = domSelection.getRangeAt(0);
    const selectionRect = domRange.getBoundingClientRect();
    const text = domRange.toString().trim();

    const ancestor = domRange?.commonAncestorContainer;

    // Check if inside custom editor (optimized - check closest instead of querySelectorAll)
    const isInsideCustomEditor = !!(ancestor as Element)?.closest?.('[data-custom-editor]');

    if (!editor.refElement?.contains(ancestor) || isInsideCustomEditor) {
      if (state === 'open') {
        close();
      }
      return;
    }

    if (domRange && text.length > 0) {
      const reference = {
        getBoundingClientRect: () => selectionRect,
        getClientRects: () => domRange.getClientRects(),
      };

      refs.setReference(reference);

      if (state !== 'open') {
        open();
      }
    }
  }, [frozen, refs, editor.refElement, close, open, state]);

  // Block selection change handler
  const onBlockSelectionChange = useCallback(() => {
    if (
      !Array.isArray(editor.path.selected) ||
      editor.path.selected.length === 0 ||
      (editor.path.source !== 'mousemove' && editor.path.source !== 'keyboard')
    ) {
      if (state === 'open') {
        close();
      }
      return;
    }

    const firstSelectedBlockPath = Math.min(...editor.path.selected);
    const lastSelectedBlockPath = Math.max(...editor.path.selected);

    let isBottomDirection = true;

    if (typeof editor.path.current === 'number') {
      isBottomDirection =
        Math.abs(editor.path.current - lastSelectedBlockPath) <=
        Math.abs(editor.path.current - firstSelectedBlockPath);
    }

    const selectedBlock = editor.getBlock({
      at: isBottomDirection ? lastSelectedBlockPath : firstSelectedBlockPath,
    });

    if (!selectedBlock) return;

    const blockEl = editor.refElement?.querySelector<HTMLElement>(
      `[data-yoopta-block-id="${selectedBlock.id}"]`,
    );

    if (!blockEl) return;

    refs.setReference(blockEl);

    if (state !== 'open') {
      open();
    }
  }, [editor, refs, close, open, state]);

  // Memoize throttled function to avoid recreation
  const throttledSelectionChange = useMemo(
    () =>
      throttle(selectionChange, 200, {
        leading: true,
        trailing: true,
      }),
    [selectionChange],
  );

  useEffect(() => {
    if (!Array.isArray(editor.path.selected) && !editor.path.selection) {
      if (state === 'open') {
        close();
      }
      return;
    }

    if (Array.isArray(editor.path.selected) && !editor.path.selection) {
      onBlockSelectionChange();
      return;
    }

    window.document.addEventListener('selectionchange', throttledSelectionChange);
    return () => window.document.removeEventListener('selectionchange', throttledSelectionChange);
  }, [
    editor.path.selected,
    editor.path.selection,
    state,
    throttledSelectionChange,
    close,
    onBlockSelectionChange,
  ]);

  // Combine styles once
  const combinedStyles = useMemo(
    () => ({ ...floatingStyles, ...transitionStyles }),
    [floatingStyles, transitionStyles],
  );

  const getRootProps = () => ({
    ref: refs.setFloating,
    style: combinedStyles,
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
  });

  return {
    isOpen: isMounted,
    state,
    frozen,
    open,
    close,
    toggle,
    setFrozen,
    reset,
    getRootProps,
  };
};
