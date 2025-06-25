import { Blocks, useYooptaEditor } from '@yoopta/editor';
import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseFloatingBlockActionsProps {
  readOnly?: boolean;
  hideDelay?: number;
  throttleDelay?: number;
  onBlockHover?: (blockId: string | null) => void;
}

export interface UseFloatingBlockActionsReturn {
  hoveredBlockId: string | null;
  position: { top: number; left: number };
  visible: boolean;
  actionsRef: React.MutableRefObject<HTMLDivElement | null>;
  handlers: {
    onPlusClick: () => void;
    onDragClick: (event: React.MouseEvent) => void;
  };
}

export function useFloatingBlockActions({
  readOnly = false,
  hideDelay = 150,
  throttleDelay = 100,
  onBlockHover,
}: UseFloatingBlockActionsProps): UseFloatingBlockActionsReturn {
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);

  const actionsRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const editor = useYooptaEditor();

  const updateBlockPosition = useCallback(
    (blockElement: HTMLElement, blockId: string) => {
      setHoveredBlockId(blockId);
      onBlockHover?.(blockId);

      const blockElementRect = blockElement.getBoundingClientRect();

      setPosition({
        top: blockElementRect.top + 2,
        left: blockElementRect.left,
      });

      setVisible(true);
    },
    [onBlockHover],
  );

  const hideBlockActions = useCallback(() => {
    setVisible(false);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      setHoveredBlockId(null);
      onBlockHover?.(null);
    }, hideDelay);
  }, [hideDelay, onBlockHover]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      let editorEl = editor.refElement;
      if (!editorEl) return;

      const isInsideEditor = editorEl.contains(event.target as Node);
      const isInsideActions = actionsRef.current?.contains(event.target as Node);

      if (!isInsideEditor) return hideBlockActions();
      if (readOnly) return;
      if (isInsideActions) return;

      const target = event.target as HTMLElement;
      const blockElement = target.closest('[data-yoopta-block]') as HTMLElement;

      if (blockElement) {
        const blockId = blockElement.getAttribute('data-yoopta-block-id');
        if (blockId === hoveredBlockId) return;

        if (blockId) {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
          }

          rafRef.current = requestAnimationFrame(() => {
            updateBlockPosition(blockElement, blockId);
          });
        }
      }
    },
    [editor.refElement, readOnly, hoveredBlockId, hideBlockActions, updateBlockPosition],
  );

  useEffect(() => {
    const handleScroll = () => hideBlockActions();

    document.addEventListener('scroll', handleScroll, true);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('mousemove', handleMouseMove);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [handleMouseMove, hideBlockActions]);

  const onPlusClick = useCallback(() => {
    // TODO: Implement plus click
  }, [hoveredBlockId]);

  const onDragClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      const block = Blocks.getBlock(editor, { id: hoveredBlockId || '' });
      if (!block) return;

      const blockSlate = Blocks.getBlockSlate(editor, { id: block.id });
      if (blockSlate) editor.blur({ slate: blockSlate });
      editor.setPath({ current: block.meta.order, selected: [block.meta.order] });
    },
    [hoveredBlockId],
  );

  return {
    hoveredBlockId,
    position,
    visible,
    actionsRef,
    handlers: {
      onPlusClick,
      onDragClick,
    },
  };
}
