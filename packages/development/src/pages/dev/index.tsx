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
import { BlockDndContext, SortableBlock, DragHandle } from '@yoopta/ui/block-dnd';

const EDITOR_STYLE = {
  width: 750,
  paddingBottom: 100,
};

const YooptaUIPackageExample = () => {
  const selectionBoxRef = useRef<HTMLDivElement>(null);
  const editor = useMemo(
    () =>
      withMentions(createYooptaEditor({
        plugins: YOOPTA_PLUGINS,
        marks: MARKS,
        readOnly: false,
      })),
    [],
  );

  const renderBlock = useCallback(({ children, blockId }: RenderBlockProps) => {
    return <SortableBlock id={blockId} useDragHandle>{children}</SortableBlock>;
  }, []);

  useEffect(() => {
    const localStorageValue = localStorage.getItem('yoopta-editor-value');
    const data = localStorageValue ? JSON.parse(localStorageValue) : DEFAULT_VALUE;
    editor.setEditorValue(data);
    editor.applyTransforms([{ type: 'validate_block_paths' }]);
  }, []);

  return (
    <div className="flex flex-col gap-2 mt-10" ref={selectionBoxRef}>
      <BlockDndContext editor={editor}>
        <YooptaEditor
          editor={editor}
          autoFocus
          placeholder="Type / to open menu"
          style={EDITOR_STYLE}
          onChange={(value) => {
            console.log('value', value);
            localStorage.setItem('yoopta-editor-value', JSON.stringify(value));
          }}
          className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col"
          renderBlock={renderBlock}>
          <YooptaToolbar />
          <YooptaFloatingBlockActions />
          <YooptaSlashCommandMenu />
          <SelectionBox selectionBoxElement={selectionBoxRef} />
          <MentionDropdown />
        </YooptaEditor>
      </BlockDndContext>
    </div>
  );
};

export default YooptaUIPackageExample;
