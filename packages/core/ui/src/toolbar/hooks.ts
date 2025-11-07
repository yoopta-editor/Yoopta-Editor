import { useEffect, useCallback } from 'react';
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
  const { state, frozen, reference, open, close, updateStyles, setFrozen, toggle, reset } =
    useToolbarStore();

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
      return close();
    }

    const domRange = domSelection.getRangeAt(0);
    const selectionRect = domRange.getBoundingClientRect();
    const text = domRange.toString().trim();

    const pluginWithCustomEditor = document.querySelectorAll('[data-custom-editor]');
    const ancestor = domRange?.commonAncestorContainer;

    let isInsideCustomEditor = false;
    for (let i = 0; i < pluginWithCustomEditor.length; i++) {
      if (pluginWithCustomEditor[i].contains(ancestor)) {
        isInsideCustomEditor = true;
        break;
      }
    }

    if (!editor.refElement?.contains(ancestor) || isInsideCustomEditor) {
      return close();
    }

    if (domRange && text.length > 0) {
      // refs.setReference({
      //   getBoundingClientRect: () => selectionRect,
      //   getClientRects: () => domRange.getClientRects(),
      // });

      const reference = {
        getBoundingClientRect: () => selectionRect,
        getClientRects: () => domRange.getClientRects(),
      };

      refs.setReference(reference);
      open(reference as HTMLElement);
    }
  }, [frozen, refs, editor.refElement, close, open]);

  // Block selection change handler
  const onBlockSelectionChange = useCallback(() => {
    if (
      !Array.isArray(editor.path.selected) ||
      editor.path.selected.length === 0 ||
      (editor.path.source !== 'mousemove' && editor.path.source !== 'keyboard')
    ) {
      return close();
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
    const blockEl = editor.refElement?.querySelector<HTMLElement>(
      `[data-yoopta-block-id="${selectedBlock?.id}"]`,
    );
    if (!blockEl) return;

    // refs.setReference({
    //   getBoundingClientRect: () => blockEl.getBoundingClientRect(),
    //   getClientRects: () => blockEl.getClientRects(),
    // });

    const reference = {
      getBoundingClientRect: () => blockEl.getBoundingClientRect(),
      getClientRects: () => blockEl.getClientRects(),
    };

    refs.setReference(reference);
    open(reference as HTMLElement);
  }, [close, refs, editor, open]);

  // useEffect(() => {
  //   refs.setReference(reference);
  //   if (state === 'open') update();
  // }, [refs, reference, state]);

  const throttledSelectionChange = throttle(selectionChange, 200, {
    leading: true,
    trailing: true,
  });

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
    editor.path,
    editor.children,
    state,
    throttledSelectionChange,
    close,
    onBlockSelectionChange,
  ]);

  useEffect(() => {
    if (isMounted && state === 'open') {
      updateStyles({ ...floatingStyles, ...transitionStyles });
    }
  }, [floatingStyles, transitionStyles, isMounted, state, updateStyles]);

  return {
    setFloating: refs.setFloating,
    isMounted,

    state,
    frozen,
    styles: { ...floatingStyles, ...transitionStyles },

    open,
    close,
    toggle,
    setFrozen,
    reset,
  };
};
