import { useEffect, useState } from 'react';
import { useYooptaEditor } from '@yoopta/editor';

import type { CollaborationState, CollaborationYooEditor } from '../types';

/**
 * Hook to access the current collaboration state.
 * Must be used within a <YooptaEditor> that has collaboration enabled.
 */
export function useCollaboration(): CollaborationState {
  const editor = useYooptaEditor() as CollaborationYooEditor;

  const [state, setState] = useState<CollaborationState>(() => {
    if (editor.collaboration) {
      return editor.collaboration.state;
    }
    return {
      status: 'disconnected',
      connectedUsers: [],
      document: null,
      isSynced: false,
    };
  });

  useEffect(() => {
    const handler = (payload: CollaborationState) => {
      setState(payload);
    };

    (editor as any).on('collaboration:state-change', handler);
    return () => {
      (editor as any).off('collaboration:state-change', handler);
    };
  }, [editor]);

  return state;
}
