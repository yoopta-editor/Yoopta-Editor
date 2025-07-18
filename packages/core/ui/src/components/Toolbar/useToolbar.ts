import { useFloating, offset, flip, shift, inline, useTransitionStyles, autoUpdate } from '@floating-ui/react';
import { useYooptaEditor } from '@yoopta/editor';
import { CSSProperties, useEffect, useState } from 'react';
import throttle from 'lodash.throttle';

export type ToolbarRefs = {
  setRef: (node: HTMLElement | null) => void;
  setFloatingRef: (node: HTMLDivElement | null) => void;
};

export type ToolbarReturn = ToolbarRefs & {
  style: CSSProperties;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useToolbar = (): ToolbarReturn => {
  const editor = useYooptaEditor();
  const [isOpen, setIsOpen] = useState(false);
  const [hold, setHold] = useState(false);

  const {
    refs: toolbarRefs,
    floatingStyles: toolbarStyles,
    context: toolbarContext,
  } = useFloating({
    placement: 'top',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted: isToolbarMounted, styles: toolbarTransitionStyles } = useTransitionStyles(toolbarContext, {
    duration: 100,
  });

  const toolbarFloatingStyle = { ...toolbarStyles, ...toolbarTransitionStyles };

  // Selection change handler
  const selectionChange = () => {
    if (hold) return;

    const toolbarEl = toolbarRefs.floating.current;
    if (toolbarEl && toolbarEl.contains(document.activeElement)) {
      return;
    }

    const domSelection = window.getSelection();

    if (!domSelection || domSelection?.isCollapsed || domSelection?.anchorOffset === domSelection?.focusOffset) {
      return setIsOpen(false);
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
      return setIsOpen(false);
    }

    if (domRange && text.length > 0) {
      toolbarRefs.setReference({
        getBoundingClientRect: () => selectionRect,
        getClientRects: () => domRange.getClientRects(),
      });

      setIsOpen(true);
    }
  };

  const onSelectionChange = throttle(selectionChange, 200);

  // Block selection change handler
  const onBlockSelectionChange = () => {
    if (
      !Array.isArray(editor.path.selected) ||
      editor.path.selected.length === 0 ||
      (editor.path.source !== 'mousemove' && editor.path.source !== 'keyboard')
    ) {
      return setIsOpen(false);
    }

    const firstSelectedBlockPath = Math.min(...editor.path.selected);
    const lastSelectedBlockPath = Math.max(...editor.path.selected);

    let isBottomDirection = true;

    if (typeof editor.path.current === 'number') {
      isBottomDirection =
        Math.abs(editor.path.current - lastSelectedBlockPath) <= Math.abs(editor.path.current - firstSelectedBlockPath);
    }

    const selectedBlock = editor.getBlock({ at: isBottomDirection ? lastSelectedBlockPath : firstSelectedBlockPath });
    const blockEl = editor.refElement?.querySelector(`[data-yoopta-block-id="${selectedBlock?.id}"]`);
    if (!blockEl) return;

    toolbarRefs.setReference({
      getBoundingClientRect: () => blockEl.getBoundingClientRect(),
      getClientRects: () => blockEl.getClientRects(),
    });

    setIsOpen(true);
  };

  useEffect(() => {
    if (!Array.isArray(editor.path.selected) && !editor.path.selection) {
      setIsOpen(false);
      return;
    }

    if (Array.isArray(editor.path.selected) && !editor.path.selection) {
      onBlockSelectionChange();
      return;
    }

    window.document.addEventListener('selectionchange', onSelectionChange);
    return () => window.document.removeEventListener('selectionchange', onSelectionChange);
  }, [editor.path, hold, editor.children]);

  return {
    setRef: toolbarRefs.setReference,
    setFloatingRef: toolbarRefs.setFloating,
    style: toolbarFloatingStyle,
    isOpen: isToolbarMounted,
    setIsOpen,
  };
};

// Hook for toolbar actions
export const useToolbarActions = () => {
  const editor = useYooptaEditor();

  const toggleMark = (format: string) => {
    console.log('toggleMark', format);
    if (editor.formats[format]) {
      editor.formats[format].toggle();
    }
  };

  const toggleAlign = () => {
    const aligns = ['left', 'center', 'right'] as const;
    const blockData = editor.getBlock({ at: editor.path.current });

    if (!blockData) return;

    const currentAlign = blockData?.meta?.align || 'left';
    const nextAlign = aligns[(aligns.indexOf(currentAlign as (typeof aligns)[number]) + 1) % aligns.length];

    if (Array.isArray(editor.path.selected) && editor.path.selected.length > 0) {
      for (const path of editor.path.selected) {
        const block = editor.getBlock({ at: path });
        if (!block) continue;
        editor.updateBlock(block.id, { meta: { ...block.meta, align: nextAlign } });
      }
      return;
    }

    editor.updateBlock(blockData.id, { meta: { ...blockData.meta, align: nextAlign } });
  };

  const isMarkActive = (format: string) => {
    return editor.formats[format]?.isActive() || false;
  };

  const getCurrentAlign = () => {
    if (typeof editor.path.current !== 'number') return 'left';
    const blockData = editor.getBlock({ at: editor.path.current });
    return blockData?.meta?.align || 'left';
  };

  return {
    toggleMark,
    toggleAlign,
    isMarkActive,
    getCurrentAlign,
  };
};
