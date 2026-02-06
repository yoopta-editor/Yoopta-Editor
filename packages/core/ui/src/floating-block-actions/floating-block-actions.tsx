import {
  type CSSProperties,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { type YooptaBlockData, useYooptaEditor } from '@yoopta/editor';

import { FloatingBlockActionsContext } from './context';
import { throttle } from '../utils/throttle';
import './floating-block-actions.css';

type FloatingBlockActionsApi = {
  /** Currently hovered block ID */
  blockId: string | null;
  /** Block data for the hovered block */
  blockData: YooptaBlockData | null;
  /** Whether actions are visible */
  isVisible: boolean;
  /** Hide the floating actions manually */
  hide: () => void;
};

type FloatingBlockActionsRootProps = {
  children: ReactNode | ((api: FloatingBlockActionsApi) => ReactNode);
  /** When true, hover tracking is paused (e.g., when BlockOptions is open) */
  frozen?: boolean;
  className?: string;
  style?: CSSProperties;
};

type FloatingBlockActionsButtonProps = {
  children: ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  title?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const HIDDEN_STYLES: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  opacity: 0,
  pointerEvents: 'none',
  transform: 'scale(0.95)',
  transition: 'transform 150ms ease-out',
};

const getVisibleStyles = (top: number, left: number, width: number): CSSProperties => ({
  position: 'fixed',
  top,
  left,
  opacity: 1,
  pointerEvents: 'auto',
  transform: `scale(1) translateX(-${width + 2}px)`,
  transition: 'transform 150ms ease-out',
});

const FloatingBlockActionsRoot = ({ children, style, frozen = false, className = '' }: FloatingBlockActionsRootProps) => {
  const editor = useYooptaEditor();
  const containerRef = useRef<HTMLDivElement>(null);

  // Internal state
  const [blockId, setBlockId] = useState<string | null>(null);
  const [styles, setStyles] = useState<CSSProperties>({ ...style, ...HIDDEN_STYLES });

  // Derived state
  const blockData = blockId ? editor.children[blockId] ?? null : null;
  const isVisible = blockId !== null && styles.opacity === 1;

  // Hide actions
  const hide = useCallback(() => {
    setBlockId(null);
    setStyles({ ...style, ...HIDDEN_STYLES });
  }, [style]);

  // Update position based on block element
  const updatePosition = useCallback((blockElement: HTMLElement) => {
    const rect = blockElement.getBoundingClientRect();
    const containerWidth = containerRef.current?.offsetWidth ?? 46;

    // Account for margin collapse: if the rendered element has margin-top,
    // it collapses through the parent wrapper, making rect.top appear
    // higher than where the content visually starts
    let marginOffset = 0;
    const renderedElement = blockElement.querySelector('[data-element-type]') as HTMLElement | null;
    if (renderedElement) {
      const elementStyle = window.getComputedStyle(renderedElement);
      marginOffset = parseFloat(elementStyle.marginTop) || 0;
    }

    setStyles({ ...style, ...getVisibleStyles(rect.top + marginOffset, rect.left, containerWidth) });
  }, [style]);

  // Find closest block to cursor
  const findClosestBlock = useCallback(
    (mouseY: number): { element: HTMLElement; data: YooptaBlockData } | null => {
      if (!editor.refElement) return null;

      const blocks = editor.refElement.querySelectorAll<HTMLElement>('[data-yoopta-block]');
      const viewportHeight = window.innerHeight;
      const VIEWPORT_MARGIN = 200;
      const MAX_DISTANCE = 100;

      let closestBlock: HTMLElement | null = null;
      let minDistance = Infinity;

      for (const blockElement of blocks) {
        const rect = blockElement.getBoundingClientRect();

        // Skip blocks outside viewport
        if (rect.bottom < -VIEWPORT_MARGIN || rect.top > viewportHeight + VIEWPORT_MARGIN) {
          continue;
        }

        // Cursor is within block bounds
        if (mouseY >= rect.top && mouseY <= rect.bottom) {
          closestBlock = blockElement;
          minDistance = 0;
          break;
        }

        // Calculate distance
        const distance = mouseY < rect.top ? rect.top - mouseY : mouseY - rect.bottom;
        if (distance < minDistance) {
          minDistance = distance;
          closestBlock = blockElement;
        }
      }

      if (closestBlock && minDistance <= MAX_DISTANCE) {
        const foundBlockId = closestBlock.getAttribute('data-yoopta-block-id');
        const foundBlockData = foundBlockId ? editor.children[foundBlockId] : null;

        if (foundBlockId && foundBlockData) {
          return { element: closestBlock, data: foundBlockData };
        }
      }

      return null;
    },
    [editor],
  );

  // Mouse move handler
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      // If frozen, ignore mouse movement
      if (frozen) return;

      const target = event.target as HTMLElement;
      const isInsideEditor = editor.refElement?.contains(target);
      const isInsideActions = containerRef.current?.contains(target);

      // Check if mouse is within extended bounds of floating actions (hover bridge)
      // This creates a "ghost" area that doesn't block interactions but keeps actions visible
      const isInExtendedBounds = (() => {
        if (!containerRef.current) return false;
        const rect = containerRef.current.getBoundingClientRect();
        const padding = { top: 8, right: 24, bottom: 8, left: 8 };
        return (
          event.clientX >= rect.left - padding.left &&
          event.clientX <= rect.right + padding.right &&
          event.clientY >= rect.top - padding.top &&
          event.clientY <= rect.bottom + padding.bottom
        );
      })();

      // Inside floating actions or extended hover area - keep current state
      if (isInsideActions || isInExtendedBounds) return;

      // Outside editor - hide
      if (!isInsideEditor) {
        hide();
        return;
      }

      // Read-only mode - ignore
      if (editor.readOnly) return;

      const closestBlock = findClosestBlock(event.clientY);

      if (closestBlock) {
        const { element, data } = closestBlock;
        // Only update if different block
        if (data.id !== blockId) {
          setBlockId(data.id);
          updatePosition(element);
        }
      } else if (blockId !== null) {
        hide();
      }
    },
    [frozen, editor, blockId, findClosestBlock, updatePosition, hide],
  );

  // Throttled mouse move
  const throttledMouseMove = useMemo(
    () => throttle(handleMouseMove, 100, { leading: true, trailing: true }),
    [handleMouseMove],
  );

  // Set up event listeners
  useEffect(() => {
    const handleScroll = () => {
      if (frozen) return;
      hide();
    };

    document.addEventListener('mousemove', throttledMouseMove);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [throttledMouseMove, hide, frozen]);

  // Context value
  const contextValue = useMemo<FloatingBlockActionsApi>(
    () => ({
      blockId,
      blockData,
      isVisible,
      hide,
    }),
    [blockId, blockData, isVisible, hide],
  );

  // Render props or regular children
  const content = typeof children === 'function' ? children(contextValue) : children;

  return (
    <FloatingBlockActionsContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={`yoopta-ui-floating-block-actions ${className}`}
        style={styles}
        contentEditable={false}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </FloatingBlockActionsContext.Provider>
  );
};

FloatingBlockActionsRoot.displayName = 'FloatingBlockActions';

const FloatingBlockActionsButton = forwardRef<HTMLButtonElement, FloatingBlockActionsButtonProps>(
  ({ children, onClick, className = '', disabled, title, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={`yoopta-ui-floating-action-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      {...props}
    >
      {children}
    </button>
  ),
);

FloatingBlockActionsButton.displayName = 'FloatingBlockActions.Button';

export const FloatingBlockActions = Object.assign(FloatingBlockActionsRoot, {
  Root: FloatingBlockActionsRoot,
  Button: FloatingBlockActionsButton,
});

export type { FloatingBlockActionsRootProps, FloatingBlockActionsButtonProps, FloatingBlockActionsApi };