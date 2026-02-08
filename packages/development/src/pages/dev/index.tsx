import YooptaEditor, { createYooptaEditor, generateId, Marks, type RenderBlockProps } from '@yoopta/editor';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { DEFAULT_VALUE } from '@/utils/yoopta/default-value';
import { withMentions } from '@yoopta/mention';
import { MentionDropdown } from '@yoopta/themes-shadcn/mention';

import { YooptaToolbar } from '@/components/new-yoo-components/yoopta-toolbar';
import { YooptaFloatingBlockActions } from '@/components/new-yoo-components/yoopta-floating-block-actions';
import { YooptaSlashCommandMenu } from '@/components/new-yoo-components/yoopta-slash-command-menu';

import { SelectionBox } from '@yoopta/ui/selection-box';
import { BlockDndContext, SortableBlock } from '@yoopta/ui/block-dnd';
import { withCollaboration, RemoteCursors, CollaborationConfig } from '@yoopta/collaboration';
import { faker } from '@faker-js/faker';

const EDITOR_STYLE = {
  width: 700,
  paddingBottom: 100,
};

const {
  person: { firstName, lastName },
  color: { rgb },
} = faker;

const YooptaUIPackageExample = () => {
  const selectionBoxRef = useRef<HTMLDivElement>(null);
  const editor = useMemo(
    () => {
      const collabConfig: CollaborationConfig = {
        url: 'ws://localhost:4000',
        roomId: 'document-dev-room',
        user: { id: generateId(), name: `${firstName()} ${lastName()}`, color: rgb() },
        token: 'your-auth-token',
        connect: true,
      }

      const baseEditor = createYooptaEditor({
        plugins: YOOPTA_PLUGINS,
        marks: MARKS,
        readOnly: false,
      })

      const editor = withMentions(withCollaboration(baseEditor, collabConfig))
      return editor
    },
    [],
  );

  const renderBlock = useCallback(({ children, blockId }: RenderBlockProps) => {
    return <SortableBlock id={blockId} useDragHandle>{children}</SortableBlock>;
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('handleBeforeUnload');
      editor.collaboration.destroy();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [editor]);

  return (
    <div className="flex flex-col gap-2" style={{ paddingTop: '80px' }} ref={selectionBoxRef}>
      <BlockDndContext editor={editor}>
        <YooptaEditor
          editor={editor}
          autoFocus
          placeholder="Type / to open menu"
          style={EDITOR_STYLE}
          className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col"
          renderBlock={renderBlock}>
          <YooptaToolbar />
          <YooptaFloatingBlockActions />
          <YooptaSlashCommandMenu />
          <SelectionBox selectionBoxElement={selectionBoxRef} />
          <MentionDropdown />
          <RemoteCursors />
        </YooptaEditor>
      </BlockDndContext>
    </div>
  );
};

export default YooptaUIPackageExample;
