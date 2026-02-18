import YooptaEditor, { Columns, createYooptaEditor, type RenderBlockProps } from '@yoopta/editor';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { withMentions } from '@yoopta/mention';
import { withEmoji } from '@yoopta/emoji';
import { MentionDropdown } from '@yoopta/themes-shadcn/mention';
import { EmojiDropdown } from '@yoopta/themes-shadcn/emoji';

import { YooptaToolbar } from '@/components/new-yoo-components/yoopta-toolbar';
import { YooptaFloatingBlockActions } from '@/components/new-yoo-components/yoopta-floating-block-actions';
import { YooptaSlashCommandMenu } from '@/components/new-yoo-components/yoopta-slash-command-menu';

import { SelectionBox } from '@yoopta/ui/selection-box';
import { BlockDndContext, SortableBlock } from '@yoopta/ui/block-dnd';
import { DEFAULT_VALUE } from '@/utils/yoopta/default-value';

const EDITOR_STYLE = {
  width: 700,
  paddingBottom: 100,
};

const YooptaUIPackageExample = () => {
  const selectionBoxRef = useRef<HTMLDivElement>(null);
  const editor = useMemo(
    () => {
      const baseEditor = createYooptaEditor({
        plugins: YOOPTA_PLUGINS,
        marks: MARKS,
        readOnly: false,
        value: DEFAULT_VALUE
      })

      const editor = withEmoji(withMentions(baseEditor))
      return editor
    },
    [],
  );

  const renderBlock = useCallback(({ children, blockId }: RenderBlockProps) => {
    return <SortableBlock id={blockId} useDragHandle>{children}</SortableBlock>;
  }, []);

  useEffect(() => {
    const groupId = Columns.createColumnGroup(editor, {
      blockIds: ['980b9946-9a2e-4707-9046-e10175c82e7d', 'b1fd5415-6c13-4e57-8fbb-aa69581793b7']
    });

    editor.addToColumn({ blockId: 'd7bd9ade-f81e-4f1d-880c-0a0a590cf8a9', columnGroup: groupId!, columnIndex: 1 });
    console.log('Columns.createColumnGroup', groupId);
  }, [editor]);

  return (
    <div className="flex flex-col gap-2" style={{ paddingTop: '80px' }} ref={selectionBoxRef}>
      <BlockDndContext editor={editor}>
        <YooptaEditor
          editor={editor}
          autoFocus
          placeholder="Type / to open menu"
          style={EDITOR_STYLE}
          onChange={(value) => {
            console.log('onChange value', value)
          }}
          className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col"
          renderBlock={renderBlock}>
          <YooptaToolbar />
          <YooptaFloatingBlockActions />
          <YooptaSlashCommandMenu />
          <SelectionBox selectionBoxElement={selectionBoxRef} />
          <MentionDropdown />
          <EmojiDropdown />
        </YooptaEditor>
      </BlockDndContext>
    </div>
  );
};

export default YooptaUIPackageExample;
