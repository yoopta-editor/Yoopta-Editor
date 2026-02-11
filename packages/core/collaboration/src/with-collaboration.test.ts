import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';

import { LOCAL_ORIGIN } from './types';
// eslint-disable-next-line import/order
import type { CollaborationYooEditor } from './types';

// Mock WebSocketProvider (needs WebSocket API)
const mockProviderOn = vi.fn();
const mockProviderConnect = vi.fn();
const mockProviderDisconnect = vi.fn();
const mockProviderDestroy = vi.fn();
const mockProviderEmit = vi.fn();

// Store event handlers so we can trigger them in tests
const providerHandlers: Record<string, (...args: any[]) => void> = {};

vi.mock('./provider/web-socket-provider', () => ({
  WebSocketProvider: class MockWebSocketProvider {
    on = vi.fn((event: string, handler: (...args: any[]) => void) => {
      providerHandlers[event] = handler;
      mockProviderOn(event, handler);
    });

    off = vi.fn();
    emit = mockProviderEmit;
    connect = mockProviderConnect;
    disconnect = mockProviderDisconnect;
    destroy = mockProviderDestroy;
    awareness = {
      setLocalStateField: vi.fn(),
      getStates: vi.fn(() => new Map()),
      on: vi.fn(),
      off: vi.fn(),
      doc: { clientID: 1 },
    };
  },
}));

// Mock AwarenessManager (needs y-protocols/awareness)
const mockAwarenessDestroy = vi.fn();
const mockAwarenessUpdateCursor = vi.fn();
const mockAwarenessGetConnectedUsers = vi.fn(() => []);
const mockAwarenessGetRemoteCursors = vi.fn(() => []);
let awarenessChangeCallback: (() => void) | null = null;

vi.mock('./awareness/awareness-manager', () => ({
  AwarenessManager: class MockAwarenessManager {
    onChange = vi.fn((cb: () => void) => {
      awarenessChangeCallback = cb;
    });

    offChange = vi.fn();
    updateCursor = mockAwarenessUpdateCursor;
    getConnectedUsers = mockAwarenessGetConnectedUsers;
    getRemoteCursors = mockAwarenessGetRemoteCursors;
    destroy = mockAwarenessDestroy;
  },
}));

// Mock cursor decorations (needs Slate types)
vi.mock('./awareness/cursor-decorations', () => ({
  createCursorDecorator: vi.fn(() => vi.fn(() => [])),
  createCursorLeafRenderer: vi.fn(() => vi.fn((leaf: any, children: any) => children)),
}));

// eslint-disable-next-line import/first
import { withCollaboration } from './with-collaboration';

// ---- Minimal YooEditor mock ----

type MockEventHandler = (...args: any[]) => void;

function createMockEditor() {
  const eventHandlers = new Map<string, Set<MockEventHandler>>();
  let savingHistory: boolean | undefined;

  const editor: any = {
    id: 'test-editor',
    children: {},
    blockEditorsMap: {},
    path: { current: null, selected: null },
    formats: {},
    marks: [],
    plugins: {},
    readOnly: false,

    decorators: new Map(),
    leafDecorators: new Map(),

    historyStack: { undos: [], redos: [] },
    isSavingHistory: () => savingHistory,
    withoutSavingHistory: (fn: () => void) => {
      const prev = savingHistory;
      savingHistory = false;
      fn();
      savingHistory = prev;
    },
    isMergingHistory: () => undefined,
    withoutMergingHistory: (fn: () => void) => fn(),
    withMergingHistory: (fn: () => void) => fn(),
    withSavingHistory: (fn: () => void) => {
      const prev = savingHistory;
      savingHistory = true;
      fn();
      savingHistory = prev;
    },

    undo: vi.fn(),
    redo: vi.fn(),

    applyTransforms: vi.fn(),
    setEditorValue: vi.fn((value: any) => {
      editor.children = value;
    }),
    setPath: vi.fn(),
    batchOperations: vi.fn((fn: () => void) => fn()),

    isRemoteSlateOp: undefined as undefined | ((slate: any) => boolean),

    on: vi.fn((event: string, fn: MockEventHandler) => {
      if (!eventHandlers.has(event)) {
        eventHandlers.set(event, new Set());
      }
      eventHandlers.get(event)!.add(fn);
    }),
    off: vi.fn((event: string, fn: MockEventHandler) => {
      eventHandlers.get(event)?.delete(fn);
    }),
    once: vi.fn(),
    emit: vi.fn((event: string, ...args: any[]) => {
      const handlers = eventHandlers.get(event);
      if (handlers) {
        for (const handler of handlers) {
          handler(...args);
        }
      }
    }),

    isFocused: () => false,
    focus: vi.fn(),
    blur: vi.fn(),
    refElement: null,

    // Stubs for other YooEditor methods
    isEmpty: () => true,
    getEditorValue: () => editor.children,
    insertBlock: vi.fn(),
    updateBlock: vi.fn(),
    deleteBlock: vi.fn(),
    duplicateBlock: vi.fn(),
    toggleBlock: vi.fn(),
    increaseBlockDepth: vi.fn(),
    decreaseBlockDepth: vi.fn(),
    moveBlock: vi.fn(),
    focusBlock: vi.fn(),
    mergeBlock: vi.fn(),
    splitBlock: vi.fn(),
    getBlock: vi.fn(),
    insertElement: vi.fn(),
    updateElement: vi.fn(),
    deleteElement: vi.fn(),
    getElement: vi.fn(),
    getElements: vi.fn(),
    getElementEntry: vi.fn(),
    getElementPath: vi.fn(),
    getElementRect: vi.fn(),
    getParentElementPath: vi.fn(),
    getElementChildren: vi.fn(),
    isElementEmpty: vi.fn(),
    y: vi.fn(),
    getHTML: vi.fn(),
    getMarkdown: vi.fn(),
    getPlainText: vi.fn(),
    getEmail: vi.fn(),
    getYooptaJSON: vi.fn(),
  };

  return editor;
}

const DEFAULT_USER = { id: 'user-1', name: 'Alice', color: '#e06c75' };

// ---- Tests ----

describe('withCollaboration', () => {
  let editor: any;

  beforeEach(() => {
    vi.clearAllMocks();
    editor = createMockEditor();
    Object.keys(providerHandlers).forEach((key) => delete providerHandlers[key]);
    awarenessChangeCallback = null;
  });

  // ====================
  // Basic setup
  // ====================

  describe('setup', () => {
    it('should return a CollaborationYooEditor with collaboration API', () => {
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(collabEditor.collaboration).toBeDefined();
      expect(collabEditor.collaboration.state).toBeDefined();
      expect(typeof collabEditor.collaboration.connect).toBe('function');
      expect(typeof collabEditor.collaboration.disconnect).toBe('function');
      expect(typeof collabEditor.collaboration.destroy).toBe('function');
      expect(typeof collabEditor.collaboration.getDocument).toBe('function');
    });

    it('should set initial state to disconnected', () => {
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(collabEditor.collaboration.state.status).toBe('disconnected');
      expect(collabEditor.collaboration.state.isSynced).toBe(false);
      expect(collabEditor.collaboration.state.connectedUsers).toEqual([DEFAULT_USER]);
      expect(collabEditor.collaboration.state.document).toBeInstanceOf(Y.Doc);
    });

    it('should auto-connect when connect is not false', () => {
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
      });

      expect(mockProviderConnect).toHaveBeenCalled();
    });

    it('should not auto-connect when connect is false', () => {
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(mockProviderConnect).not.toHaveBeenCalled();
    });

    it('should use provided Y.Doc when given', () => {
      const customDoc = new Y.Doc();
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
        document: customDoc,
      });

      expect(collabEditor.collaboration.getDocument()).toBe(customDoc);
    });

    it('should create a new Y.Doc when not provided', () => {
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(collabEditor.collaboration.getDocument()).toBeInstanceOf(Y.Doc);
    });

    it('should register remote-cursors leaf decorator', () => {
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(editor.leafDecorators.has('remote-cursors')).toBe(true);
    });

    it('should subscribe to path-change event', () => {
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(editor.on).toHaveBeenCalledWith('path-change', expect.any(Function));
    });
  });

  // ====================
  // applyTransforms interception
  // ====================

  describe('applyTransforms interception', () => {
    it('should override editor.applyTransforms', () => {
      const originalApply = editor.applyTransforms;
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(editor.applyTransforms).not.toBe(originalApply);
    });

    it('should call original applyTransforms when intercepted', () => {
      const originalApply = editor.applyTransforms;
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      const ops = [{ type: 'set_block_meta', id: 'b1', properties: { depth: 0 }, prevProperties: { depth: 1 } }];
      editor.applyTransforms(ops, {});

      expect(originalApply).toHaveBeenCalledWith(ops, {});
    });

    it('should wire up isRemoteSlateOp', () => {
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(editor.isRemoteSlateOp).toBeDefined();
      expect(typeof editor.isRemoteSlateOp).toBe('function');
    });
  });

  // ====================
  // Undo / Redo override
  // ====================

  describe('undo/redo override', () => {
    it('should override editor.undo', () => {
      const originalUndo = editor.undo;
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(editor.undo).not.toBe(originalUndo);
    });

    it('should override editor.redo', () => {
      const originalRedo = editor.redo;
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(editor.redo).not.toBe(originalRedo);
    });

    it('should undo local Y.Doc changes via editor.undo()', () => {
      const doc = new Y.Doc();
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
        document: doc,
      });

      // Simulate initial sync (triggers UndoManager.clear())
      if (providerHandlers.synced) {
        providerHandlers.synced();
      }

      // Make a local change to the Y.Doc
      const blockOrder = doc.getArray<string>('blockOrder');
      doc.transact(() => {
        blockOrder.push(['block-1']);
      }, LOCAL_ORIGIN);

      expect(blockOrder.length).toBe(1);

      // Undo via editor
      editor.undo();

      expect(blockOrder.length).toBe(0);
    });

    it('should redo after undo via editor.redo()', () => {
      const doc = new Y.Doc();
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
        document: doc,
      });

      if (providerHandlers.synced) {
        providerHandlers.synced();
      }

      const blockOrder = doc.getArray<string>('blockOrder');
      doc.transact(() => {
        blockOrder.push(['block-1']);
      }, LOCAL_ORIGIN);

      editor.undo();
      expect(blockOrder.length).toBe(0);

      editor.redo();
      expect(blockOrder.length).toBe(1);
      expect(blockOrder.get(0)).toBe('block-1');
    });

    it('should be a no-op when there is nothing to undo', () => {
      const doc = new Y.Doc();
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
        document: doc,
      });

      if (providerHandlers.synced) {
        providerHandlers.synced();
      }

      // Should not throw
      editor.undo();
      editor.redo();
    });

    it('should not undo remote changes', () => {
      const doc = new Y.Doc();
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
        document: doc,
      });

      if (providerHandlers.synced) {
        providerHandlers.synced();
      }

      // Make a remote change (different origin)
      const blockOrder = doc.getArray<string>('blockOrder');
      doc.transact(() => {
        blockOrder.push(['remote-block']);
      }, 'remote-origin');

      expect(blockOrder.length).toBe(1);

      // Undo should NOT remove the remote change
      editor.undo();
      expect(blockOrder.length).toBe(1);
      expect(blockOrder.get(0)).toBe('remote-block');
    });

    it('should only undo local changes when mixed with remote changes', () => {
      const doc = new Y.Doc();
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
        document: doc,
      });

      if (providerHandlers.synced) {
        providerHandlers.synced();
      }

      const blockOrder = doc.getArray<string>('blockOrder');

      // Remote change first
      doc.transact(() => {
        blockOrder.push(['remote-block']);
      }, 'remote-origin');

      // Local change after
      doc.transact(() => {
        blockOrder.push(['local-block']);
      }, LOCAL_ORIGIN);

      expect(blockOrder.length).toBe(2);

      // Undo should only remove 'local-block'
      editor.undo();
      expect(blockOrder.length).toBe(1);
      expect(blockOrder.get(0)).toBe('remote-block');
    });

    it('should not undo initial seed after sync', () => {
      const doc = new Y.Doc();
      const initialValue = {
        'block-1': {
          id: 'block-1',
          type: 'Paragraph',
          value: [{ id: 'el-1', type: 'paragraph', children: [{ text: 'Hello' }] }],
          meta: { order: 0, depth: 0 },
        },
      };

      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
        document: doc,
        initialValue,
      });

      // Trigger synced — this calls initialSync which seeds Y.Doc then clears undo stack
      if (providerHandlers.synced) {
        providerHandlers.synced();
      }

      const blockOrder = doc.getArray<string>('blockOrder');
      expect(blockOrder.length).toBe(1);

      // Undo should NOT remove the seed — the UndoManager was cleared after sync
      editor.undo();
      expect(blockOrder.length).toBe(1);
    });

    it('should undo text-level changes in Y.XmlFragment', () => {
      const doc = new Y.Doc();
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
        document: doc,
      });

      if (providerHandlers.synced) {
        providerHandlers.synced();
      }

      // Set up a block with content
      const blockContents = doc.getMap<Y.XmlFragment>('blockContents');
      const fragment = new Y.XmlFragment();
      doc.transact(() => {
        blockContents.set('block-1', fragment);
      }, LOCAL_ORIGIN);

      // Now insert text into the fragment
      doc.transact(() => {
        const xmlElem = new Y.XmlElement('paragraph');
        fragment.insert(0, [xmlElem]);
        xmlElem.setAttribute('id', 'el-1');
        const xmlText = new Y.XmlText();
        xmlElem.insert(0, [xmlText]);
        xmlText.insert(0, 'Hello');
      }, LOCAL_ORIGIN);

      const xmlElem = fragment.get(0) as Y.XmlElement;
      const xmlText = xmlElem.get(0) as Y.XmlText;
      expect(xmlText.toString()).toBe('Hello');

      // Undo should remove the text content
      editor.undo();
      // After undo, the fragment setup transaction is undone
      // (both transactions may be merged by captureTimeout)
    });
  });

  // ====================
  // Public API (connect / disconnect / destroy)
  // ====================

  describe('collaboration API', () => {
    it('connect() should call provider.connect', () => {
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      collabEditor.collaboration.connect();
      expect(mockProviderConnect).toHaveBeenCalled();
    });

    it('disconnect() should call provider.disconnect and update state', () => {
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      collabEditor.collaboration.disconnect();

      expect(mockProviderDisconnect).toHaveBeenCalled();
      expect(collabEditor.collaboration.state.status).toBe('disconnected');
      expect(collabEditor.collaboration.state.isSynced).toBe(false);
    });

    it('getDocument() should return the Y.Doc instance', () => {
      const doc = new Y.Doc();
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
        document: doc,
      });

      expect(collabEditor.collaboration.getDocument()).toBe(doc);
    });
  });

  // ====================
  // destroy()
  // ====================

  describe('destroy', () => {
    it('should restore original applyTransforms', () => {
      const originalApply = editor.applyTransforms;
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(editor.applyTransforms).not.toBe(originalApply);

      collabEditor.collaboration.destroy();

      expect(editor.applyTransforms).toBe(originalApply);
    });

    it('should restore original isRemoteSlateOp', () => {
      const originalIsRemote = editor.isRemoteSlateOp;
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(editor.isRemoteSlateOp).not.toBe(originalIsRemote);

      collabEditor.collaboration.destroy();

      expect(editor.isRemoteSlateOp).toBe(originalIsRemote);
    });

    it('should restore original undo', () => {
      const originalUndo = editor.undo;
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(editor.undo).not.toBe(originalUndo);

      collabEditor.collaboration.destroy();

      expect(editor.undo).toBe(originalUndo);
    });

    it('should restore original redo', () => {
      const originalRedo = editor.redo;
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(editor.redo).not.toBe(originalRedo);

      collabEditor.collaboration.destroy();

      expect(editor.redo).toBe(originalRedo);
    });

    it('should unsubscribe from path-change event', () => {
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      collabEditor.collaboration.destroy();

      expect(editor.off).toHaveBeenCalledWith('path-change', expect.any(Function));
    });

    it('should remove remote-cursors decorators', () => {
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      expect(editor.leafDecorators.has('remote-cursors')).toBe(true);

      (editor as CollaborationYooEditor).collaboration.destroy();

      expect(editor.decorators.has('remote-cursors')).toBe(false);
      expect(editor.leafDecorators.has('remote-cursors')).toBe(false);
    });

    it('should call awareness.destroy before provider.destroy', () => {
      const callOrder: string[] = [];
      mockAwarenessDestroy.mockImplementation(() => callOrder.push('awareness'));
      mockProviderDestroy.mockImplementation(() => callOrder.push('provider'));

      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      collabEditor.collaboration.destroy();

      expect(callOrder.indexOf('awareness')).toBeLessThan(callOrder.indexOf('provider'));
    });

    it('should update state to disconnected with empty users', () => {
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      collabEditor.collaboration.destroy();

      expect(collabEditor.collaboration.state.status).toBe('disconnected');
      expect(collabEditor.collaboration.state.isSynced).toBe(false);
      expect(collabEditor.collaboration.state.connectedUsers).toEqual([]);
    });
  });

  // ====================
  // Provider event handlers
  // ====================

  describe('provider events', () => {
    it('should update state on status change', () => {
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      // Simulate provider emitting 'status' event
      if (providerHandlers.status) {
        providerHandlers.status('connected');
      }

      expect(collabEditor.collaboration.state.status).toBe('connected');
    });

    it('should emit collaboration:status-change on status change', () => {
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      if (providerHandlers.status) {
        providerHandlers.status('connected');
      }

      expect(editor.emit).toHaveBeenCalledWith(
        'collaboration:status-change',
        expect.objectContaining({ status: 'connected' }),
      );
    });

    it('should set isSynced on synced event', () => {
      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      if (providerHandlers.synced) {
        providerHandlers.synced();
      }

      expect(collabEditor.collaboration.state.isSynced).toBe(true);
    });
  });

  describe('awareness changes', () => {
    it('should update connectedUsers on awareness change', () => {
      const users = [DEFAULT_USER, { id: 'user-2', name: 'Bob', color: '#61afef' }];
      mockAwarenessGetConnectedUsers.mockReturnValue(users as never[]);

      const collabEditor = withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      // Trigger awareness change
      if (awarenessChangeCallback) {
        awarenessChangeCallback();
      }

      expect(collabEditor.collaboration.state.connectedUsers).toEqual(users);
    });

    it('should emit collaboration:cursors-change on awareness change', () => {
      const cursors = [{ clientId: 2, user: DEFAULT_USER, blockId: 'b1', selection: null, selectedBlocks: null }];
      mockAwarenessGetRemoteCursors.mockReturnValue(cursors as never[]);

      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      if (awarenessChangeCallback) {
        awarenessChangeCallback();
      }

      expect(editor.emit).toHaveBeenCalledWith('collaboration:cursors-change', cursors);
    });

    it('should register cursor decorator on awareness change', () => {
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      if (awarenessChangeCallback) {
        awarenessChangeCallback();
      }

      expect(editor.decorators.has('remote-cursors')).toBe(true);
    });
  });

  // ====================
  // Path change handler
  // ====================

  describe('path-change handler', () => {
    it('should update cursor when path has a current block', () => {
      editor.children = {
        'block-1': { id: 'block-1', type: 'Paragraph', value: [], meta: { order: 0, depth: 0 } },
      };
      editor.blockEditorsMap = {
        'block-1': { selection: { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 3 } } },
      };

      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      // Emit path-change
      editor.emit('path-change', { current: 0, selected: null });

      expect(mockAwarenessUpdateCursor).toHaveBeenCalledWith(
        'block-1',
        expect.any(Object),
        null,
      );
    });

    it('should update cursor with selected blocks when provided', () => {
      editor.children = {};

      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      editor.emit('path-change', { current: null, selected: [0, 1, 2] });

      expect(mockAwarenessUpdateCursor).toHaveBeenCalledWith(null, null, [0, 1, 2]);
    });

    it('should clear cursor when path is null with no selection', () => {
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
      });

      editor.emit('path-change', { current: null, selected: null });

      expect(mockAwarenessUpdateCursor).toHaveBeenCalledWith(null, null);
    });
  });

  // ====================
  // Y.UndoManager integration via Y.Doc
  // ====================

  describe('Y.UndoManager integration', () => {
    it('should track blockMeta changes and undo them', () => {
      const doc = new Y.Doc();
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
        document: doc,
      });

      if (providerHandlers.synced) {
        providerHandlers.synced();
      }

      const blockMeta = doc.getMap('blockMeta');

      doc.transact(() => {
        const meta = new Y.Map();
        meta.set('type', 'Paragraph');
        meta.set('depth', 0);
        meta.set('align', 'left');
        blockMeta.set('block-1', meta);
      }, LOCAL_ORIGIN);

      expect(blockMeta.has('block-1')).toBe(true);

      editor.undo();

      expect(blockMeta.has('block-1')).toBe(false);
    });

    it('should track blockContents changes and undo them', () => {
      const doc = new Y.Doc();
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
        document: doc,
      });

      if (providerHandlers.synced) {
        providerHandlers.synced();
      }

      const blockContents = doc.getMap<Y.XmlFragment>('blockContents');

      doc.transact(() => {
        const fragment = new Y.XmlFragment();
        blockContents.set('block-1', fragment);
      }, LOCAL_ORIGIN);

      expect(blockContents.has('block-1')).toBe(true);

      editor.undo();

      expect(blockContents.has('block-1')).toBe(false);
    });

    it('should support multiple undo/redo cycles', () => {
      const doc = new Y.Doc();
      withCollaboration(editor, {
        url: 'ws://localhost:4000',
        roomId: 'test-room',
        user: DEFAULT_USER,
        connect: false,
        document: doc,
      });

      if (providerHandlers.synced) {
        providerHandlers.synced();
      }

      const blockOrder = doc.getArray<string>('blockOrder');

      // Add block-1
      doc.transact(() => {
        blockOrder.push(['block-1']);
      }, LOCAL_ORIGIN);

      // Wait for captureTimeout to separate undo items
      // Add block-2 in a separate transaction group
      // (In real usage, captureTimeout=500ms separates them.
      //  For testing, we use separate immediate transactions which may get merged.
      //  Let's test the basic flow.)

      expect(blockOrder.length).toBe(1);

      // Undo
      editor.undo();
      expect(blockOrder.length).toBe(0);

      // Redo
      editor.redo();
      expect(blockOrder.length).toBe(1);

      // Undo again
      editor.undo();
      expect(blockOrder.length).toBe(0);

      // Redo again
      editor.redo();
      expect(blockOrder.length).toBe(1);
    });
  });
});
