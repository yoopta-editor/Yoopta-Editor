"use client";

import { useCallback, useEffect, useMemo, useRef } from 'react';
import YooptaEditor, { createYooptaEditor, RenderBlockProps, SlateElement, YooptaContentValue, YooptaPlugin } from '@yoopta/editor'

import { INJECT_PLUGINS } from './plugins';
import { YOOPTA_MARKS } from '../full-setup/marks';
import { SelectionBox } from '@yoopta/ui/selection-box';
import { YooptaToolbar } from '../full-setup/new-yoo-components/yoopta-toolbar';
import { YooptaSlashCommandMenu } from '../full-setup/new-yoo-components/yoopta-slash-command-menu';
import { YooptaFloatingBlockActions } from '../full-setup/new-yoo-components/yoopta-floating-block-actions';
import { BlockDndContext, SortableBlock } from '@yoopta/ui/block-dnd';
import { withMentions } from '@yoopta/mention';
// @ts-expect-error - MentionDropdown types not properly exported
import { MentionDropdown } from '@yoopta/themes-shadcn/mention';
// @ts-expect-error - EmojiDropdown types not properly exported
import { EmojiDropdown } from '@yoopta/themes-shadcn/emoji';
import { applyTheme } from '@yoopta/themes-shadcn';
import { withEmoji } from '@yoopta/emoji';

const EDITOR_STYLES = {
  width: '100%',
  paddingBottom: 100,
}

type InjectPluginsEditorProps = {
  initialValue?: YooptaContentValue;
  containerBoxRef?: React.RefObject<HTMLDivElement>;
};

const InjectPluginsEditor = ({ initialValue, containerBoxRef: externalRef }: InjectPluginsEditorProps) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const containerBoxRef = externalRef ?? internalRef;

  const editor = useMemo(() => {
    return withEmoji(withMentions(createYooptaEditor({ plugins: applyTheme(INJECT_PLUGINS) as unknown as YooptaPlugin<Record<string, SlateElement>, unknown>[], marks: YOOPTA_MARKS })));
  }, []);

  useEffect(() => {
    if (initialValue) {
      editor.withoutSavingHistory(() => {
        editor.setEditorValue(initialValue);
        editor.focus();
      });
    }
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
          renderBlock={renderBlock}
          onChange={(value) => console.log(value)}
          placeholder="Type / to open menu, or start typing..."
        >
          <YooptaToolbar />
          <YooptaFloatingBlockActions />
          <YooptaSlashCommandMenu />
          <SelectionBox selectionBoxElement={containerBoxRef} />
          <MentionDropdown />
          <EmojiDropdown />
        </YooptaEditor>
      </BlockDndContext>
    </div>
  )
}

export { InjectPluginsEditor }
