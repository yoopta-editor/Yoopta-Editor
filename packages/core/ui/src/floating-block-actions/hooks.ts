import { useContext, useEffect, useRef, useCallback, useState, CSSProperties } from 'react';
import { useYooptaEditor, YooptaBlockData } from '@yoopta/editor';
import { YooptaUIContext } from '../ui-context/yoopta-ui-context';
import { throttle } from '../utils/throttle';

type UseFloatingBlockActionsOptions = {
  onPlusClick?: (blockId: string, event: React.MouseEvent) => void;
  onDragClick?: (blockId: string, event: React.MouseEvent) => void;
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
  const { hoveredBlockId, onSetHoveredBlockId } = useContext(YooptaUIContext);
  const editor = useYooptaEditor();

  const [actionStyles, setActionStyles] = useState<ActionStyles>(INITIAL_STYLES);
  const blockActionsRef = useRef<HTMLDivElement>(null);

  const updateBlockPosition = useCallback(
    (blockElement: HTMLElement, blockData: YooptaBlockData) => {
      onSetHoveredBlockId(blockData.id);

      const blockElementRect = blockElement.getBoundingClientRect();
      const blockActionsWidth = blockActionsRef.current?.offsetWidth || 46;

      setActionStyles((prev) => ({
        ...prev,
        top: blockElementRect.top + 2,
        left: blockElementRect.left,
        opacity: 1,
        transform: `scale(1) translateX(-${blockActionsWidth + 2}px)`,
        pointerEvents: 'auto',
      }));
    },
    [onSetHoveredBlockId],
  );

  const hideBlockActions = useCallback(() => {
    setActionStyles((prev) => ({
      ...prev,
      opacity: 0,
      transform: INITIAL_STYLES.transform,
      pointerEvents: 'none',
    }));

    onSetHoveredBlockId(null);
  }, [onSetHoveredBlockId]);

  // Find the closest block to cursor position (optimized for viewport only)
  const findClosestBlock = useCallback(
    (mouseY: number): { element: HTMLElement; data: YooptaBlockData } | null => {
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
    },
    [editor.refElement, editor.children],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isInsideEditor = editor.refElement?.contains(event.target as Node);
      const isInsideActions = blockActionsRef.current?.contains(target);

      // Hide if outside editor or in read-only mode
      if (!isInsideEditor) return hideBlockActions();
      if (editor.readOnly) return;
      if (isInsideActions) return;

      // Find closest block to cursor position
      const closestBlock = findClosestBlock(event.clientY);

      if (closestBlock) {
        const { element, data } = closestBlock;
        if (data.id !== hoveredBlockId) {
          updateBlockPosition(element, data);
        }
      } else if (hoveredBlockId !== null) {
        hideBlockActions();
      }
    },
    [
      editor.refElement,
      editor.readOnly,
      hoveredBlockId,
      hideBlockActions,
      updateBlockPosition,
      findClosestBlock,
    ],
  );

  const throttledMouseMove = useCallback(
    throttle(handleMouseMove, 100, { leading: true, trailing: true }),
    [handleMouseMove],
  );

  useEffect(() => {
    const handleScroll = () => {
      hideBlockActions();
    };

    document.addEventListener('mousemove', throttledMouseMove);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('scroll', handleScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideBlockActions]);

  // Handlers
  const handlePlusClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (hoveredBlockId && options?.onPlusClick) {
        options.onPlusClick(hoveredBlockId, event);
      }
    },
    [hoveredBlockId, options],
  );

  const handleDragClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (hoveredBlockId && options?.onDragClick) {
        options.onDragClick(hoveredBlockId, event);
      }
    },
    [hoveredBlockId, options],
  );

  return {
    hoveredBlockId,
    isVisible: hoveredBlockId !== null,
    style: actionStyles,
    blockActionsRef,
    onPlusClick: handlePlusClick,
    onDragClick: handleDragClick,
  };
};
