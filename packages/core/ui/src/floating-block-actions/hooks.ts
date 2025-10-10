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
};

export const useFloatingBlockActions = (options?: UseFloatingBlockActionsOptions) => {
  const { hoveredBlockId, onSetHoveredBlockId } = useContext(YooptaUIContext);
  const editor = useYooptaEditor();

  const [actionStyles, setActionStyles] = useState<ActionStyles>(INITIAL_STYLES);
  const blockActionsRef = useRef<HTMLDivElement>(null);

  const updateBlockPosition = (blockElement: HTMLElement, blockData: YooptaBlockData) => {
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
  };

  const hideBlockActions = () => {
    setActionStyles((prev) => ({
      ...prev,
      opacity: 0,
      transform: INITIAL_STYLES.transform,
      pointerEvents: 'none',
    }));

    onSetHoveredBlockId(null);
  };

  const handleMouseMove = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const isInsideEditor = editor.refElement?.contains(event.target as Node);
    const isInsideActions = blockActionsRef.current?.contains(target);

    if (!isInsideEditor) return hideBlockActions();
    if (editor.readOnly) return;
    if (isInsideActions) return;

    // Find closest block
    const blockElement = target.closest('[data-yoopta-block]') as HTMLElement;

    if (blockElement) {
      const blockId = blockElement.getAttribute('data-yoopta-block-id');
      if (blockId && blockId !== hoveredBlockId) {
        updateBlockPosition(blockElement, editor.children[blockId]);
      }
    } else if (hoveredBlockId !== null) {
      hideBlockActions();
    }
  };

  const throttledMouseMove = throttle(handleMouseMove, 100, { leading: true, trailing: true });

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
  }, [hoveredBlockId, onSetHoveredBlockId]);

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
