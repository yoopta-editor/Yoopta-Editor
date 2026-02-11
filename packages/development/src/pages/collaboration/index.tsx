import YooptaEditor, { createYooptaEditor, generateId, type RenderBlockProps } from '@yoopta/editor';
import { withMentions } from '@yoopta/mention';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';

import { YooptaToolbar } from '@/components/new-yoo-components/yoopta-toolbar';
import { YooptaFloatingBlockActions } from '@/components/new-yoo-components/yoopta-floating-block-actions';
import { YooptaSlashCommandMenu } from '@/components/new-yoo-components/yoopta-slash-command-menu';

import { SelectionBox } from '@yoopta/ui/selection-box';
import { BlockDndContext, SortableBlock } from '@yoopta/ui/block-dnd';
import { withCollaboration, RemoteCursors, CollaborationConfig } from '@yoopta/collaboration';

import { Separator } from '@/components/ui/separator';

const ROOM_ID = 'collab-test-room';

const USERS = [
  { id: generateId(), name: 'Alice Johnson', color: '#d1fae5' },
  { id: generateId(), name: 'Bob Smith', color: '#ffe2e3' },
];

const EDITOR_STYLE = {
  width: '100%',
  padding: '20px 20px 60px 80px',
};

type CollaborativeEditorProps = {
  user: (typeof USERS)[0];
  label: string;
}

function CollaborativeEditor({ user, label }: CollaborativeEditorProps) {
  const selectionBoxRef = useRef<HTMLDivElement>(null);

  const editor = useMemo(() => {
    const collabConfig: CollaborationConfig = {
      url: 'ws://localhost:4000',
      roomId: ROOM_ID,
      user,
      token: 'collab-test-token',
      connect: true,
    };

    const baseEditor = createYooptaEditor({
      plugins: YOOPTA_PLUGINS,
      marks: MARKS,
      readOnly: false,
    });

    const editor = withMentions(withCollaboration(baseEditor, collabConfig))
    return editor;
  }, []);

  const renderBlock = useCallback(({ children, blockId }: RenderBlockProps) => {
    return (
      <SortableBlock id={blockId} useDragHandle>
        {children}
      </SortableBlock>
    );
  }, []);

  useEffect(() => {
    return () => {
      editor.collaboration.destroy();
    };
  }, [editor]);

  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: user.color }} />
        <span className="text-sm font-medium truncate">{label}</span>
        {/* <span className="text-xs text-muted-foreground truncate">({user.name})</span> */}
      </div>
      <div className="flex-1 overflow-y-auto" ref={selectionBoxRef}>
        <BlockDndContext editor={editor}>
          <YooptaEditor
            editor={editor}
            placeholder="Type / to open menu"
            style={EDITOR_STYLE}
            className="px-6 py-4"
            renderBlock={renderBlock}
          >
            <YooptaToolbar />
            <YooptaFloatingBlockActions />
            <YooptaSlashCommandMenu />
            <SelectionBox selectionBoxElement={selectionBoxRef} />
            <RemoteCursors />
          </YooptaEditor>
        </BlockDndContext>
      </div>
    </div>
  );
}

const CollaborationTestPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="border-b" style={{ padding: '1rem' }}>
        <h1 className="text-lg font-semibold">Room name: <span style={{ textDecoration: 'underline' }}>{ROOM_ID}</span></h1>
      </div>
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-w-0">
          <CollaborativeEditor user={USERS[0]} label={USERS[0].name} />
        </div>
        <Separator orientation="vertical" className='h-[100vh]' />
        <div className="flex-1 min-w-0">
          <CollaborativeEditor user={USERS[1]} label={USERS[1].name} />
        </div>
      </div>
    </div>
  );
};

export default CollaborationTestPage;
