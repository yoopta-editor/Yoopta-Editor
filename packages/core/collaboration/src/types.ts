import type { YooEditor, YooptaContentValue } from '@yoopta/editor';
import type { Doc as YDoc } from 'yjs';

// ---- Origin markers for preventing sync loops ----

export const LOCAL_ORIGIN = 'yoopta-local' as const;
export const COLLAB_ORIGIN = 'yoopta-collaboration' as const;

// ---- Configuration ----

export type CollaborationConfig = {
  /** WebSocket server URL, e.g. "wss://collab.yoopta.cloud" */
  url: string;
  /** Room/document identifier */
  roomId: string;
  /** User info for awareness (cursors, presence) */
  user: CollaborationUser;
  /** Optional: provide your own Y.Doc instance */
  document?: YDoc;
  /** Initial value to seed the document if no remote state exists */
  initialValue?: YooptaContentValue;
  /** Whether to connect immediately (default: true) */
  connect?: boolean;
  /** Authentication token sent to the server on connect */
  token?: string;
};

// ---- User ----

export type CollaborationUser = {
  id: string;
  name: string;
  color: string;
  avatar?: string;
};

// ---- Connection ----

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// ---- State ----

export type CollaborationState = {
  status: ConnectionStatus;
  connectedUsers: CollaborationUser[];
  document: YDoc | null;
  isSynced: boolean;
};

// ---- Remote Cursors ----

export type RemoteCursorData = {
  clientId: number;
  user: CollaborationUser;
  blockId: string | null;
  selection: {
    anchor: { path: number[]; offset: number };
    focus: { path: number[]; offset: number };
  } | null;
  /** Block orders selected during multi-block selection (Shift+click / drag) */
  selectedBlocks: number[] | null;
};

// ---- Editor Extension ----

export type CollaborationAPI = {
  readonly state: CollaborationState;
  connect: () => void;
  disconnect: () => void;
  destroy: () => void;
  getDocument: () => YDoc;
};

export type CollaborationYooEditor = YooEditor & {
  collaboration: CollaborationAPI;
};
