import { useCallback, useEffect, useRef, useState } from 'react';
import { Selection, useYooptaEditor } from '@yoopta/editor';

import type { CollaborationYooEditor, RemoteCursorData } from '../types';
import './remote-cursors.css';

/**
 * Renders remote user cursors with:
 * - Inline caret cursor at the exact character position
 * - Text selection highlight overlay
 * - Multi-block selection highlight
 * - Scroll-aware positioning
 *
 * Must be used as a child of <YooptaEditor>.
 */
export const RemoteCursors = () => {
  const editor = useYooptaEditor() as CollaborationYooEditor;
  const [cursors, setCursors] = useState<RemoteCursorData[]>([]);
  const [, forceUpdate] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor.collaboration) return;

    const handler = (payload: RemoteCursorData[]) => {
      setCursors(payload);
    };

    (editor as any).on('collaboration:cursors-change', handler);
    return () => {
      (editor as any).off('collaboration:cursors-change', handler);
    };
  }, [editor]);

  // Re-render on scroll so cursor positions update
  useEffect(() => {
    const editorEl = editor.refElement;
    if (!editorEl) return;

    // Find the scrollable ancestor
    const scrollParent = findScrollParent(editorEl);

    const onScroll = () => forceUpdate((n) => n + 1);
    scrollParent.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      scrollParent.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, [editor]);

  if (cursors.length === 0) return null;

  return (
    <div ref={containerRef} className="yoopta-collab-cursors-container">
      {cursors.map((cursor) => (
        <RemoteCursorOverlay key={cursor.clientId} cursor={cursor} editor={editor} />
      ))}
    </div>
  );
};

type RemoteCursorOverlayProps = {
  cursor: RemoteCursorData;
  editor: CollaborationYooEditor;
};

const RemoteCursorOverlay = ({ cursor, editor }: RemoteCursorOverlayProps) => {
  const { user, blockId, selection, selectedBlocks } = cursor;

  const isMultiBlockSelection = selectedBlocks && selectedBlocks.length > 1;
  const isSingleBlockSelection = blockId && !isMultiBlockSelection;

  return (
    <>
      {/* Multi-block selection overlay */}
      {isMultiBlockSelection && (
        <MultiBlockSelection
          selectedBlocks={selectedBlocks}
          user={user}
          editor={editor}
        />
      )}

      {/* Single block: inline caret + selection highlight */}
      {isSingleBlockSelection && (
        <InlineBlockCursor
          blockId={blockId}
          selection={selection}
          user={user}
          editor={editor}
        />
      )}
    </>
  );
};

// ---- Multi-block selection ----

type MultiBlockSelectionProps = {
  selectedBlocks: number[];
  user: RemoteCursorData['user'];
  editor: CollaborationYooEditor;
};

const MultiBlockSelection = ({ selectedBlocks, user, editor }: MultiBlockSelectionProps) => {
  const editorRect = editor.refElement?.getBoundingClientRect();
  if (!editorRect) return null;

  // Find block IDs for the selected orders
  const blockEntries = Object.values(editor.children);
  const selectedBlockIds = selectedBlocks
    .map((order) => blockEntries.find((b) => b.meta.order === order)?.id)
    .filter(Boolean) as string[];

  if (selectedBlockIds.length === 0) return null;

  // Get bounding rects for all selected blocks
  const rects = selectedBlockIds
    .map((id) => {
      const el = document.querySelector(`[data-yoopta-block-id="${id}"]`);
      return el?.getBoundingClientRect() ?? null;
    })
    .filter(Boolean) as DOMRect[];

  if (rects.length === 0) return null;

  const labelOnFirst = rects[0];

  return (
    <>
      {rects.map((rect, i) => (
        <div
          key={selectedBlockIds[i]}
          className="yoopta-collab-multi-block-highlight"
          style={{
            position: 'fixed',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            backgroundColor: user.color,
            opacity: 0.08,
            pointerEvents: 'none',
            borderRadius: '2px',
            zIndex: 49,
          }}
        />
      ))}

      {/* Name label on the first selected block */}
      <CursorLabel
        user={user}
        style={{
          position: 'fixed',
          top: labelOnFirst.top - 20,
          left: labelOnFirst.left,
          zIndex: 51,
        }}
      />

      {/* Left accent bar spanning all blocks */}
      <div
        className="yoopta-collab-multi-block-bar"
        style={{
          position: 'fixed',
          top: rects[0].top,
          left: rects[0].left - 4,
          width: 3,
          height: rects[rects.length - 1].bottom - rects[0].top,
          backgroundColor: user.color,
          borderRadius: '2px',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      />
    </>
  );
};

// ---- Single block inline cursor ----

type InlineBlockCursorProps = {
  blockId: string;
  selection: RemoteCursorData['selection'];
  user: RemoteCursorData['user'];
  editor: CollaborationYooEditor;
};

const InlineBlockCursor = ({ blockId, selection, user, editor }: InlineBlockCursorProps) => {
  const caretRect = useSlateCaretRect(blockId, selection, editor);
  const selectionRects = useSlateSelectionRects(blockId, selection, editor);
  const blockEl = document.querySelector(`[data-yoopta-block-id="${blockId}"]`);
  const blockRect = blockEl?.getBoundingClientRect();

  // If we can resolve the Slate selection to DOM rects, show inline cursor
  if (caretRect) {
    return (
      <>
        {/* Selection highlight rectangles */}
        {selectionRects.map((rect) => (
          <div
            key={`${rect.left}-${rect.top}-${rect.width}`}
            className="yoopta-collab-selection-highlight"
            style={{
              position: 'fixed',
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              backgroundColor: user.color,
              opacity: 0.25,
              pointerEvents: 'none',
              zIndex: 49,
            }}
          />
        ))}

        {/* Caret line */}
        <div
          className="yoopta-collab-inline-caret"
          style={{
            position: 'fixed',
            top: caretRect.top,
            left: caretRect.left,
            width: 2,
            height: caretRect.height,
            backgroundColor: user.color,
            pointerEvents: 'none',
            zIndex: 50,
          }}
        >
          <CursorLabel
            user={user}
            style={{
              position: 'absolute',
              top: -20,
              left: -1,
            }}
          />
        </div>
      </>
    );
  }

  // Fallback: block-level presence bar (when Slate selection can't be resolved to DOM)
  if (!blockRect) return null;

  return (
    <div
      className="yoopta-collab-block-presence"
      style={{
        position: 'fixed',
        top: blockRect.top,
        left: blockRect.left - 4,
        height: blockRect.height,
        width: 3,
        borderRadius: '2px',
        backgroundColor: user.color,
        pointerEvents: 'none',
        transition: 'top 0.15s ease, height 0.15s ease',
        zIndex: 50,
      }}
    >
      <CursorLabel
        user={user}
        style={{
          position: 'absolute',
          top: -20,
          left: 0,
        }}
      />
    </div>
  );
};

// ---- Shared label component ----

type CursorLabelProps = {
  user: RemoteCursorData['user'];
  style?: React.CSSProperties;
};

const CursorLabel = ({ user, style }: CursorLabelProps) => (
  <span
    className="yoopta-collab-cursor-label"
    style={{
      backgroundColor: user.color,
      color: '#fff',
      fontSize: '11px',
      padding: '1px 6px',
      borderRadius: '3px',
      whiteSpace: 'nowrap',
      lineHeight: '16px',
      userSelect: 'none',
      pointerEvents: 'none',
      ...style,
    }}
  >
    {user.name}
  </span>
);

// ---- Hooks using Selection.toDOMRange from @yoopta/editor ----

function useSlateCaretRect(
  blockId: string,
  selection: RemoteCursorData['selection'],
  editor: CollaborationYooEditor,
): { top: number; left: number; height: number } | null {
  const getCaretRect = useCallback(() => {
    if (!selection) return null;

    const domRange = Selection.toDOMRange(editor, {
      blockId,
      slateRange: { anchor: selection.focus, focus: selection.focus },
    });

    if (!domRange) return null;

    const rect = domRange.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return null;

    return { top: rect.top, left: rect.left, height: rect.height };
  }, [blockId, selection, editor]);

  return getCaretRect();
}

function useSlateSelectionRects(
  blockId: string,
  selection: RemoteCursorData['selection'],
  editor: CollaborationYooEditor,
): DOMRect[] {
  const getSelectionRects = useCallback(() => {
    if (!selection) return [];

    const isCollapsed =
      selection.anchor.offset === selection.focus.offset &&
      selection.anchor.path.length === selection.focus.path.length &&
      selection.anchor.path.every((v, i) => v === selection.focus.path[i]);

    if (isCollapsed) return [];

    const domRange = Selection.toDOMRange(editor, {
      blockId,
      slateRange: { anchor: selection.anchor, focus: selection.focus },
    });
    if (!domRange) return [];

    const rects = Array.from(domRange.getClientRects());
    return mergeRects(rects);
  }, [blockId, selection, editor]);

  return getSelectionRects();
}

// ---- Utilities ----

function findScrollParent(el: HTMLElement): HTMLElement | Window {
  let parent = el.parentElement;
  while (parent) {
    const { overflow, overflowY } = getComputedStyle(parent);
    if (overflow === 'auto' || overflow === 'scroll' || overflowY === 'auto' || overflowY === 'scroll') {
      return parent;
    }
    parent = parent.parentElement;
  }
  return window;
}

function mergeRects(rects: DOMRect[]): DOMRect[] {
  if (rects.length <= 1) return Array.from(rects);

  // Filter out zero-size rects
  const valid = Array.from(rects).filter((r) => r.width > 0 && r.height > 0);
  if (valid.length === 0) return [];

  // Group by approximate top position (same line)
  const lines: DOMRect[][] = [];
  for (const rect of valid) {
    const existingLine = lines.find(
      (line) => Math.abs(line[0].top - rect.top) < 3,
    );
    if (existingLine) {
      existingLine.push(rect);
    } else {
      lines.push([rect]);
    }
  }

  // Merge each line into a single rect
  return lines.map((line) => {
    const top = Math.min(...line.map((r) => r.top));
    const bottom = Math.max(...line.map((r) => r.bottom));
    const left = Math.min(...line.map((r) => r.left));
    const right = Math.max(...line.map((r) => r.right));
    return new DOMRect(left, top, right - left, bottom - top);
  });
}
