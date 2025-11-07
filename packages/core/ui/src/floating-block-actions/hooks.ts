import { useEffect, useRef, useCallback } from 'react';
import { useYooptaEditor, YooptaBlockData } from '@yoopta/editor';
import { throttle } from '../utils/throttle';
import { useFloatingBlockActionsStore } from './store';

/**
 * Hook for FloatingBlockActions
 * Handles mouse tracking, positioning, and provides access to store
 */
export const useFloatingBlockActions = () => {
  const editor = useYooptaEditor();
  const store = useFloatingBlockActionsStore();

  const updateBlockPosition = useCallback(
    (blockElement: HTMLElement, blockData: YooptaBlockData) => {
      const blockElementRect = blockElement.getBoundingClientRect();
      const blockActionsWidth = store.reference?.offsetWidth || 46;

      store.updatePosition(blockElementRect.top + 2, blockElementRect.left, blockActionsWidth);
    },
    [store],
  );

  const hideBlockActions = useCallback(() => {
    store.hide();
  }, [store]);

  // Find the closest block to cursor position (optimized for viewport only)
  const findClosestBlock = useCallback(
    (mouseY: number): { element: HTMLElement; data: YooptaBlockData } | null => {
      if (!editor.refElement) return null;

      const blocks = editor.refElement.querySelectorAll<HTMLElement>('[data-yoopta-block]');
      const viewportHeight = window.innerHeight;
      const VIEWPORT_MARGIN = 200; // Extra margin for smooth experience
      const MAX_DISTANCE = 100; // Maximum distance to show actions

      let closestBlock: HTMLElement | null = null;
      let minDistance = Infinity;

      blocks.forEach((blockElement) => {
        const rect = blockElement.getBoundingClientRect();

        // Skip blocks outside viewport (with margin)
        if (rect.bottom < -VIEWPORT_MARGIN || rect.top > viewportHeight + VIEWPORT_MARGIN) {
          return;
        }

        // Check if cursor is within the block's vertical bounds
        if (mouseY >= rect.top && mouseY <= rect.bottom) {
          closestBlock = blockElement;
          minDistance = 0;
          return;
        }

        // Calculate distance to block
        const distance = mouseY < rect.top ? rect.top - mouseY : mouseY - rect.bottom;

        if (distance < minDistance) {
          minDistance = distance;
          closestBlock = blockElement;
        }
      });

      // Only show actions if cursor is close enough
      if (closestBlock && minDistance <= MAX_DISTANCE) {
        const blockId = (closestBlock as HTMLElement).getAttribute('data-yoopta-block-id');
        const blockData = blockId ? editor.children[blockId] : null;

        if (blockId && blockData) {
          return { element: closestBlock, data: blockData };
        }
      }

      return null;
    },
    [editor],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      // If frozen, ignore mousemove
      if (store.state === 'frozen') return;

      const target = event.target as HTMLElement;
      const isInsideEditor = editor.refElement?.contains(event.target as Node);
      const isInsideActions = store.reference?.contains(target);

      if (!isInsideEditor) return hideBlockActions();
      if (editor.readOnly) return;
      if (isInsideActions) return;

      const closestBlock = findClosestBlock(event.clientY);

      if (closestBlock) {
        const { element, data } = closestBlock;
        if (data.id !== store.blockId) {
          store.toggle('hovering', data.id);
          updateBlockPosition(element, data);
        }
      } else if (store.blockId !== null) {
        hideBlockActions();
      }
    },
    [store, editor, hideBlockActions, findClosestBlock, updateBlockPosition],
  );

  const throttledMouseMove = throttle(handleMouseMove, 100, { leading: true, trailing: true });

  useEffect(() => {
    const handleScroll = () => {
      if (store.state === 'frozen') return;
      hideBlockActions();
    };

    document.addEventListener('mousemove', throttledMouseMove);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [throttledMouseMove, hideBlockActions, store.state]);

  return {
    reference: store.reference,

    floatingBlockId: store.blockId,
    state: store.state,
    styles: store.styles,

    toggle: store.toggle,
    hide: store.hide,
    reset: store.reset,
  };
};
