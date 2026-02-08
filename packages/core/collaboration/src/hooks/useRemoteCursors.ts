import { useState, useEffect } from 'react';
import { useYooptaEditor } from '@yoopta/editor';
import type { CollaborationYooEditor, RemoteCursorData } from '../types';

/**
 * Hook to access remote cursor data for all connected users.
 * Must be used within a <YooptaEditor> that has collaboration enabled.
 */
export function useRemoteCursors(): RemoteCursorData[] {
  const editor = useYooptaEditor() as CollaborationYooEditor;
  const [cursors, setCursors] = useState<RemoteCursorData[]>([]);

  useEffect(() => {
    const handler = (payload: RemoteCursorData[]) => {
      setCursors(payload);
    };

    (editor as any).on('collaboration:cursors-change', handler);
    return () => {
      (editor as any).off('collaboration:cursors-change', handler);
    };
  }, [editor]);

  return cursors;
}
