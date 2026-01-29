"use client";

import { useCallback, useMemo, useRef } from 'react';
import YooptaEditor, { createYooptaEditor, RenderBlockProps, SlateElement, YooptaContentValue, YooptaPlugin } from '@yoopta/editor'

import { applyTheme, MentionDropdown } from '@yoopta/themes-shadcn';
import { YOOPTA_PLUGINS } from './plugins';
import { YOOPTA_MARKS } from './marks';
import { SelectionBox } from '@yoopta/ui/selection-box';
import { YooptaToolbar } from './new-yoo-components/yoopta-toolbar';
import { YooptaSlashCommandMenu } from './new-yoo-components/yoopta-slash-command-menu';
import { YooptaFloatingBlockActions } from './new-yoo-components/yoopta-floating-block-actions';
import { BlockDndContext, SortableBlock } from '@yoopta/ui/block-dnd';
import { withMentions } from '@yoopta/mention';

const EDITOR_STYLES = {
  width: '100%',
  paddingBottom: 100,
}

const FullSetupEditor = () => {
  const editor = useMemo(() => {
    console.log('editor useMemo', localStorage);
    const initialValue = {};
    return withMentions(createYooptaEditor({ plugins: applyTheme(YOOPTA_PLUGINS) as unknown as YooptaPlugin<Record<string, SlateElement>, unknown>[], marks: YOOPTA_MARKS, value: initialValue }));
  }, []);

  const containerBoxRef = useRef<HTMLDivElement>(null);

  const renderBlock = useCallback(({ children, blockId }: RenderBlockProps) => {
    return <SortableBlock id={blockId} useDragHandle>{children}</SortableBlock>;
  }, []);

  const onChange = (value: YooptaContentValue) => {
    console.log('onChange value', value);
    localStorage.setItem('yoopta-editor-value', JSON.stringify(value));
  }

  return (
    <div ref={containerBoxRef} className="w-full max-w-4xl mx-auto">
      <BlockDndContext editor={editor}>
        <YooptaEditor 
          editor={editor} 
          style={EDITOR_STYLES} 
          onChange={onChange} 
          renderBlock={renderBlock}
          placeholder="Type / to open menu, or start typing..."
        >
          <YooptaToolbar />
          <YooptaFloatingBlockActions />
          <YooptaSlashCommandMenu />
          <SelectionBox selectionBoxElement={containerBoxRef} />
          <MentionDropdown />
        </YooptaEditor>
      </BlockDndContext>
    </div>
  )
}

export { FullSetupEditor }