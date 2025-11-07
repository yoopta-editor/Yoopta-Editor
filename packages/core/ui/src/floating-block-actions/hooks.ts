import { useEffect, useRef, useCallback, useState, CSSProperties } from 'react';
import { useYooptaEditor, YooptaBlockData } from '@yoopta/editor';
import { throttle } from '../utils/throttle';
import { useFloatingBlockActionsStore } from './store';

type UseFloatingBlockActionsOptions = {
  onPlusClick?: (blockId: string, event: React.MouseEvent) => void;
  onDragClick?: (blockId: string, event: React.MouseEvent) => void;
  toggle?: (state: 'hovering' | 'frozen' | 'closed') => void;
  blockId?: string;
  state?: 'hovering' | 'frozen' | 'closed';
  floatingBlockActionRef?: React.RefObject<HTMLDivElement>;
};

type ActionStyles = CSSProperties;

const INITIAL_STYLES: ActionStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  opacity: 0,
  pointerEvents: 'none',
  transform: 'scale(0.95) translateX(-46px)',
  transition: 'opacity 150ms ease-out, transform 150ms ease-out',
};

export const useFloatingBlockActions = (options?: UseFloatingBlockActionsOptions) => {
  const editor = useYooptaEditor();
  const floatingActionsStore = useFloatingBlockActionsStore();

  const [actionStyles, setActionStyles] = useState<ActionStyles>(INITIAL_STYLES);
  const floatingBlockActionRef = useRef<HTMLDivElement>(null);
  const floatingBlockId = floatingActionsStore.id;

  const updateBlockPosition = useCallback(
    (blockElement: HTMLElement, blockData: YooptaBlockData) => {
      const blockElementRect = blockElement.getBoundingClientRect();
      const blockActionsWidth = floatingBlockActionRef.current?.offsetWidth || 46;

      setActionStyles((prev) => ({
        ...prev,
        top: blockElementRect.top + 2,
        left: blockElementRect.left,
        opacity: 1,
        transform: `scale(1) translateX(-${blockActionsWidth + 2}px)`,
        pointerEvents: 'auto',
      }));
    },
    [floatingActionsStore],
  );

  const hideBlockActions = useCallback(() => {
    setActionStyles((prev) => ({
      ...prev,
      opacity: 0,
      transform: INITIAL_STYLES.transform,
      pointerEvents: 'none',
    }));

    floatingActionsStore.toggle('closed', null);
  }, [floatingActionsStore]);

  // Find the closest block to cursor position (optimized for viewport only)
  const findClosestBlock = (
    mouseY: number,
  ): { element: HTMLElement; data: YooptaBlockData } | null => {
    if (!editor.refElement) return null;

    const blocks = editor.refElement.querySelectorAll('[data-yoopta-block]');
    const viewportHeight = window.innerHeight;
    const VIEWPORT_MARGIN = 200; // Extra margin for smooth experience
    const MAX_DISTANCE = 100; // Maximum distance to show actions

    let closestBlock: HTMLElement | null = null;
    let minDistance = Infinity;

    blocks.forEach((block) => {
      const blockElement = block as HTMLElement;
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
      const blockId = closestBlock.getAttribute('data-yoopta-block-id');
      const blockData = blockId ? editor.children[blockId] : null;

      if (blockId && blockData) {
        return { element: closestBlock, data: blockData };
      }
    }

    return null;
  };

  const handleMouseMove = (event: MouseEvent) => {
    // If frozen, ignore mousemove
    if (floatingActionsStore.state === 'frozen') return;

    const target = event.target as HTMLElement;
    const isInsideEditor = editor.refElement?.contains(event.target as Node);
    const isInsideActions = floatingBlockActionRef.current?.contains(target);

    if (!isInsideEditor) return hideBlockActions();
    if (editor.readOnly) return;
    if (isInsideActions) return;

    const closestBlock = findClosestBlock(event.clientY);

    if (closestBlock) {
      const { element, data } = closestBlock;
      if (data.id !== floatingBlockId) {
        floatingActionsStore.toggle('hovering', data.id);
        updateBlockPosition(element, data);
      }
    } else if (floatingBlockId !== null) {
      hideBlockActions();
    }
  };

  const throttledMouseMove = throttle(handleMouseMove, 100, { leading: true, trailing: true });

  useEffect(() => {
    const handleScroll = () => {
      if (floatingActionsStore.state === 'frozen') return;
      hideBlockActions();
    };

    document.addEventListener('mousemove', throttledMouseMove);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [hideBlockActions, floatingActionsStore.id, floatingActionsStore.state]);

  const handlePlusClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (floatingBlockId && options?.onPlusClick) {
      options.onPlusClick(floatingBlockId, event);
    }
  };

  const handleDragClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (floatingBlockId && options?.onDragClick) {
      options.onDragClick(floatingBlockId, event);
    }
  };

  return {
    style: actionStyles,
    floatingBlockActionRef,
    floatingBlockId: floatingActionsStore.id,
    toggle: floatingActionsStore.toggle,
    onPlusClick: handlePlusClick,
    onDragClick: handleDragClick,
  };
};
