import './awareness/remote-cursors.css';

// Main extension
export { withCollaboration } from './withCollaboration';

// Types
export type {
  CollaborationConfig,
  CollaborationUser,
  CollaborationState,
  ConnectionStatus,
  RemoteCursorData,
  CollaborationAPI,
  CollaborationYooEditor,
} from './types';

// React hooks
export { useCollaboration } from './hooks/useCollaboration';
export { useRemoteCursors } from './hooks/useRemoteCursors';
export { useConnectionStatus } from './hooks/useConnectionStatus';

// React components
export { RemoteCursors } from './awareness/RemoteCursors';

// Provider (for advanced usage / custom server integration)
export { WebSocketProvider } from './provider/WebSocketProvider';
