import { useEffect, useState } from 'react';
import { useYooptaEditor } from '@yoopta/editor';

import type { CollaborationYooEditor, RemoteCursorData } from '../types';
import './remote-cursors.css';

/**
 * Renders remote user cursors.
 *
 * Single-block cursors (caret + text selection) are rendered via the Slate
 * `decorate` / `renderLeaf` pipeline registered by `withCollaboration`.
 *
 * Multi-block selection overlays (which span multiple Slate editors) are
 * still rendered here as fixed-position DOM overlays.
 *
 * Must be used as a child of <YooptaEditor>.
 */
export const RemoteCursors = () => {
  const editor = useYooptaEditor() as CollaborationYooEditor;
  const [cursors, setCursors] = useState<RemoteCursorData[]>([]);
  const [, forceUpdate] = useState(0);

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

  // Filter to only multi-block selections
  const multiBlockCursors = cursors.filter(
    (c) => c.selectedBlocks && c.selectedBlocks.length > 1,
  );

  // Re-render on scroll so multi-block overlay positions update
  useEffect(() => {
    if (multiBlockCursors.length === 0) return;

    const editorEl = editor.refElement;
    if (!editorEl) return;

    const scrollParent = findScrollParent(editorEl);

    const onScroll = () => forceUpdate((n) => n + 1);
    scrollParent.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      scrollParent.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, [editor, multiBlockCursors.length]);

  if (multiBlockCursors.length === 0) return null;

  return (
    <div className="yoopta-collab-cursors-container">
      {multiBlockCursors.map((cursor) => (
        <MultiBlockSelection
          key={cursor.clientId}
          selectedBlocks={cursor.selectedBlocks!}
          user={cursor.user}
          editor={editor}
        />
      ))}
    </div>
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
