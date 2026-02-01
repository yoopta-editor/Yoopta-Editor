"use client";

import { useCallback, useEffect, useMemo, useRef } from 'react';
import YooptaEditor, { createYooptaEditor, RenderBlockProps, SlateElement, YooptaContentValue, YooptaPlugin } from '@yoopta/editor'

import { YOOPTA_PLUGINS } from './plugins';
import { YOOPTA_MARKS } from './marks';
import { SelectionBox } from '@yoopta/ui/selection-box';
import { YooptaToolbar } from './new-yoo-components/yoopta-toolbar';
import { YooptaSlashCommandMenu } from './new-yoo-components/yoopta-slash-command-menu';
import { YooptaFloatingBlockActions } from './new-yoo-components/yoopta-floating-block-actions';
import { BlockDndContext, SortableBlock } from '@yoopta/ui/block-dnd';
import { withMentions } from '@yoopta/mention';
import { MentionDropdown } from '@yoopta/themes-shadcn/mention';
import { applyTheme } from '@yoopta/themes-shadcn';

const EDITOR_STYLES = {
  width: '100%',
  paddingBottom: 100,
}

type FullSetupEditorProps = {
  initialValue: YooptaContentValue;
  containerBoxRef: React.RefObject<HTMLDivElement>;
};

const FullSetupEditor = ({ initialValue, containerBoxRef }: FullSetupEditorProps) => {
  const editor = useMemo(() => {
    return withMentions(createYooptaEditor({ plugins: applyTheme(YOOPTA_PLUGINS) as unknown as YooptaPlugin<Record<string, SlateElement>, unknown>[], marks: YOOPTA_MARKS }));
  }, []);

  const onChange = (value: YooptaContentValue) => {
    console.log('yoopta-full-setup-editor-value', value)
    // localStorage.setItem('yoopta-full-setup-editor-value', JSON.stringify(value));
  }

  useEffect(() => {
    const localStorageValue = localStorage.getItem('yoopta-full-setup-editor-value');
    const data = localStorageValue ? JSON.parse(localStorageValue) : initialValue;

    editor.withoutSavingHistory(() => {
      editor.setEditorValue(data);
      editor.focus();
    });
  }, [editor, initialValue]);

  const renderBlock = useCallback(({ children, blockId }: RenderBlockProps) => {
    return <SortableBlock id={blockId} useDragHandle>{children}</SortableBlock>;
  }, []);

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