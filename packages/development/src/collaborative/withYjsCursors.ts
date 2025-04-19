import { Awareness } from 'y-protocols/awareness';
import { YjsYooEditor } from './withCollaboration';
import { Blocks, YooptaPath } from '@yoopta/editor';

export type CursorUser = {
  name: string;
  color: string;
};

export type CursorPath = {
  selection: YooptaPath['selection'];
  blockId: string | null;
  current: YooptaPath['current'];
  selected: YooptaPath['selected'];
};

export type CursorState = {
  user: string | null;
  color: string | undefined;
  path: CursorPath;
  timestamp: number;
};

export type CursorStateChangeEvent = {
  added: number[];
  updated: number[];
  removed: number[];
};

export type RemoteCursorChangeEventListener = (event: CursorStateChangeEvent) => void;

const CURSOR_CHANGE_EVENT_LISTENERS: WeakMap<EditorWithAwareness, Set<RemoteCursorChangeEventListener>> = new WeakMap();

export type EditorWithAwareness = YjsYooEditor & {
  awareness: Awareness;
  cursor: {
    on: (event: 'change', handler: RemoteCursorChangeEventListener) => void;
    off: (event: 'change', handler: RemoteCursorChangeEventListener) => void;
    getStates: () => Map<number, CursorState>;
    getLocalState: () => CursorState;
  };
};

export type WithCursorsOptions = {
  data: CursorUser;
};

export function withYjsCursors(
  editor: YjsYooEditor,
  awareness: Awareness,
  options: WithCursorsOptions,
): EditorWithAwareness {
  const e = editor as EditorWithAwareness;

  e.awareness = awareness;

  const awarenessChangeHandler = (yEvent: CursorStateChangeEvent) => {
    console.log('withYjsCursors awarenessChangeHandler', yEvent);
    const listeners = CURSOR_CHANGE_EVENT_LISTENERS.get(e);

    if (!listeners) {
      return;
    }

    const localId = e.awareness.clientID;

    const event = {
      added: yEvent.added.filter((id) => id !== localId),
      removed: yEvent.removed.filter((id) => id !== localId),
      updated: yEvent.updated.filter((id) => id !== localId),
    };

    if (event.added.length > 0 || event.removed.length > 0 || event.updated.length > 0) {
      listeners.forEach((listener) => listener(event));
    }
  };

  const updateCursor = (path: YooptaPath) => {
    const { selected, selection, current } = path;
    let block;
    if (current !== null) {
      block = Blocks.getBlock(e, { at: current });
    }

    const cursorState: CursorState = {
      user: options.data!.name,
      color: options.data!.color,
      path: {
        selection: selection || null,
        blockId: block?.id || null,
        current,
        selected,
      },
      timestamp: Date.now(),
    };

    console.log('e.awareness.setLocalState', cursorState);
    e.awareness.setLocalState(cursorState);
  };

  e.cursor = {
    on: (event: 'change', handler: RemoteCursorChangeEventListener) => {
      if (event !== 'change') {
        return;
      }

      const listeners = CURSOR_CHANGE_EVENT_LISTENERS.get(e) ?? new Set();
      listeners.add(handler);
      CURSOR_CHANGE_EVENT_LISTENERS.set(e, listeners);
    },
    off: (event: 'change', listener: RemoteCursorChangeEventListener) => {
      if (event !== 'change') {
        return;
      }

      const listeners = CURSOR_CHANGE_EVENT_LISTENERS.get(e);
      if (listeners) {
        listeners.delete(listener);
      }
    },
    getStates: () => {
      const states = new Map();
      const localId = e.awareness.clientID;

      e.awareness.getStates().forEach((state, clientId) => {
        if (clientId !== localId) {
          states.set(clientId, state);
        }
      });

      return states;
    },
    getLocalState: () => {
      return e.awareness.getLocalState() as CursorState;
    },
  };

  const { disconnect, connect } = e;

  e.connect = () => {
    connect?.();
    e.awareness.on('change', (event) => {
      console.log('e.connect Raw awareness change event:', event);
    });

    e.awareness.on('change', awarenessChangeHandler);

    console.log('e.connect Initial awareness call');

    awarenessChangeHandler({
      removed: [],
      added: Array.from(e.awareness.getStates().keys()),
      updated: [],
    });

    e.awareness.setLocalState({
      user: options.data?.name,
      color: options.data?.color,
      path: {
        blockId: null,
        current: null,
        selected: null,
        selection: null,
      },
    });

    e.on('path-change', updateCursor);
  };

  e.disconnect = () => {
    e.awareness.off('change', awarenessChangeHandler);
    e.off('path-change', updateCursor);
    e.awareness.setLocalState(null);
    CURSOR_CHANGE_EVENT_LISTENERS.delete(e);
    disconnect?.();
  };

  return e;
}
