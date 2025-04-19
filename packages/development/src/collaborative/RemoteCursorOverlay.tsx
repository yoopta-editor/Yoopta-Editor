import { useEffect, useReducer, useRef, useState } from 'react';
import { CursorState, EditorWithAwareness, RemoteCursorChangeEventListener } from './withYjsCursors';
import { Blocks } from '@yoopta/editor';
import { ReactEditor } from 'slate-react';

type RemoteOverlayCursorProps = {
  editor: EditorWithAwareness;
};

export const RemoteOverlayCursor = ({ editor }: RemoteOverlayCursorProps) => {
  const [cursors, setCursors] = useState<Map<number, CursorState>>(new Map());

  useEffect(() => {
    const handleCursorsUpdate: RemoteCursorChangeEventListener = (event) => {
      console.log('Cursors updated:', event);
      setCursors((prevCursors) => {
        const newCursors = new Map(prevCursors);

        event.removed.forEach((clientId) => {
          newCursors.delete(clientId);
        });

        event.added.forEach((clientId) => {
          const state = editor.awareness.getStates().get(clientId) as CursorState;
          if (state) newCursors.set(clientId, state);
        });

        event.updated.forEach((clientId) => {
          const state = editor.awareness.getStates().get(clientId) as CursorState;
          if (state) newCursors.set(clientId, state);
        });

        return newCursors;
      });
    };

    editor.cursor.on('change', handleCursorsUpdate);
    return () => {
      editor.cursor.off('change', handleCursorsUpdate);
    };
  }, [editor]);

  return (
    <>
      {Array.from(cursors.entries()).map(([clientId, state]) => (
        <CursorOverlay key={clientId} clientId={clientId} state={state} editor={editor} />
      ))}
    </>
  );
};

interface CursorOverlayProps {
  clientId: number;
  state: CursorState;
  editor: EditorWithAwareness;
}

const CursorOverlay = ({ state, editor }: CursorOverlayProps) => {
  const observedNodesRef = useRef(new Set<string>());
  const [, forceRender] = useReducer((v) => !v, false);

  useEffect(() => {
    const blockIds = new Set<string>();

    if (state.path.blockId) {
      blockIds.add(state.path.blockId);
    }

    state.path.selected?.forEach((order) => {
      const blockId = Blocks.getBlock(editor, { at: order })?.id;
      if (blockId) blockIds.add(blockId);
    });

    const resizeObserver = new ResizeObserver(() => {
      forceRender();
    });

    const intersectionObserver = new IntersectionObserver(() => {
      forceRender();
    });

    blockIds.forEach((blockId) => {
      if (observedNodesRef.current.has(blockId)) return;

      const element = document.querySelector(`[data-yoopta-block-id="${blockId}"]`);
      if (!element) return;

      resizeObserver.observe(element);
      intersectionObserver.observe(element);
      observedNodesRef.current.add(blockId);
    });

    observedNodesRef.current.forEach((blockId) => {
      if (!blockIds.has(blockId)) {
        const element = document.querySelector(`[data-yoopta-block-id="${blockId}"]`);
        if (element) {
          resizeObserver.unobserve(element);
          intersectionObserver.unobserve(element);
        }
        observedNodesRef.current.delete(blockId);
      }
    });

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      observedNodesRef.current.clear();
    };
  }, [state.path.blockId, state.path.selected, editor]);

  const renderBlockSlateSelection = () => {
    if (!state.path.blockId || !state.path.selection) return null;

    try {
      const slate = Blocks.getBlockSlate(editor, { id: state.path.blockId });
      if (!slate || !state.path.selection) return null;

      const domRange = ReactEditor.toDOMRange(slate, state.path.selection);
      const rects = Array.from(domRange.getClientRects());

      return rects.map((rect, index) => (
        <div
          key={`selection-${index}`}
          className="selection-overlay"
          style={{
            position: 'absolute',
            top: rect.top + window.scrollY,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            backgroundColor: `${state.color}33`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      ));
    } catch (error) {
      // console.warn('Failed to render selection:', error);
      return null;
    }
  };

  const renderSelectedBlocksSelection = () => {
    if (!state.path.selected?.length) return null;

    return state.path.selected.map((order) => {
      const blockId = Blocks.getBlock(editor, { at: order })?.id;
      if (!blockId) return null;

      const blockElement = document.querySelector(`[data-yoopta-block-id="${blockId}"]`);
      if (!blockElement) return null;

      const rect = blockElement.getBoundingClientRect();

      return (
        <div
          key={blockId}
          className="block-selection-overlay"
          style={{
            position: 'absolute',
            top: rect.top + window.scrollY,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            backgroundColor: `${state.color}1A`,
            border: `2px solid ${state.color}`,
            pointerEvents: 'none',
          }}
        />
      );
    });
  };

  const renderCaret = () => {
    if (!state.path.blockId || !state.path.selection) return null;

    try {
      const slate = Blocks.getBlockSlate(editor, { id: state.path.blockId });
      if (!slate || !state.path.selection) return null;

      const [node, offset] = ReactEditor.toDOMPoint(slate, state.path.selection.focus);
      // const [node, offset] = ReactEditor.toDOMPoint(slate, state.path.selection.focus);
      const range = document.createRange();
      range.setStart(node, offset);
      range.setEnd(node, offset);

      const rect = range.getBoundingClientRect();

      return (
        <div
          className="remote-caret"
          style={{
            position: 'absolute',
            top: rect.top + window.scrollY,
            left: rect.left,
            width: 2,
            height: rect.height || 20,
            backgroundColor: state.color,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <div
            className="user-label"
            style={{
              position: 'absolute',
              top: -20,
              left: 0,
              backgroundColor: state.color,
              color: 'white',
              padding: '2px 4px',
              borderRadius: 3,
              fontSize: 12,
              whiteSpace: 'nowrap',
            }}
          >
            {state.user}
          </div>
        </div>
      );
    } catch (error) {
      console.warn('Failed to render caret:', error);
      return null;
    }
  };

  return (
    <div className="cursor-overlay-container">
      {renderBlockSlateSelection()}
      {renderSelectedBlocksSelection()}
      {renderCaret()}
    </div>
  );
};
