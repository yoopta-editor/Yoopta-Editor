import React, { useCallback } from 'react';
import YooptaEditorLib, { createYooptaEditor, RenderBlockProps } from '@yoopta/editor';
import { useMemo } from 'react';
import { plugins } from './plugins';
import { marks } from './marks';
import { SlashMenu } from './components/slash-menu';
import { FloatingToolbarComponent } from './components/floating-toolbar';
import { SelectionBox } from '@yoopta/ui/selection-box';
import { FloatingBlockActionsComponent } from './components/floating-block-actions';
import { withMentions } from '@yoopta/mention';
import { MentionDropdown } from '@yoopta/themes-shadcn/mention';
import { BlockDndContext, SortableBlock } from '@yoopta/ui/block-dnd';

const EDITOR_STYLE = {
  width: '100%',
  paddingBottom: 100,
};

type YooptaEditorProps = {
  containerRef: React.RefObject<HTMLDivElement>;
};

export const YooptaEditor = ({ containerRef }: YooptaEditorProps) => {
  const editor = useMemo(() => withMentions(createYooptaEditor({
    plugins: plugins,
    marks: marks,
    value: JSON.parse(localStorage.getItem('value') || '{}'),
  })), []);

  const renderBlock = useCallback(({ children, blockId }: RenderBlockProps) => {
    return <SortableBlock id={blockId} useDragHandle>{children}</SortableBlock>;
  }, []);

  return (
    <BlockDndContext editor={editor}>
      <YooptaEditorLib
        renderBlock={renderBlock}
        editor={editor}
        autoFocus
        style={EDITOR_STYLE}
        onChange={(value) => {
          localStorage.setItem('value', JSON.stringify(value));
        }}
      >
        <FloatingBlockActionsComponent />
        <SlashMenu />
        <FloatingToolbarComponent />
        <SelectionBox selectionBoxElement={containerRef} />
        <MentionDropdown />
      </YooptaEditorLib>
    </BlockDndContext>
  );
};