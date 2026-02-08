import { useState, useEffect } from 'react';
import { useYooptaEditor } from '@yoopta/editor';
import type { CollaborationYooEditor, ConnectionStatus } from '../types';

/**
 * Hook to access the current WebSocket connection status.
 * Must be used within a <YooptaEditor> that has collaboration enabled.
 */
export function useConnectionStatus(): ConnectionStatus {
  const editor = useYooptaEditor() as CollaborationYooEditor;

  const [status, setStatus] = useState<ConnectionStatus>(() => {
    if (editor.collaboration) {
      return editor.collaboration.state.status;
    }
    return 'disconnected';
  });

  useEffect(() => {
    const handler = (payload: { status: ConnectionStatus }) => {
      setStatus(payload.status);
    };

    (editor as any).on('collaboration:status-change', handler);
    return () => {
      (editor as any).off('collaboration:status-change', handler);
    };
  }, [editor]);

  return status;
}
