import React from 'react';
import YooptaEditorLib, { createYooptaEditor } from '@yoopta/editor';
import { useMemo } from 'react';
import { plugins } from './plugins';
import { marks } from './marks';
import { SlashMenu } from './components/slash-menu';
import { FloatingToolbarComponent } from './components/floating-toolbar';
import { SelectionBox } from '@yoopta/ui/selection-box';
import { FloatingBlockActionsComponent } from './components/floating-block-actions';

const EDITOR_STYLE = {
  width: '100%',
  paddingBottom: 100,
};

type YooptaEditorProps = {
  containerRef: React.RefObject<HTMLDivElement>;
};

export const YooptaEditor = ({ containerRef }: YooptaEditorProps) => {
  const editor = useMemo(() => createYooptaEditor({
    plugins: plugins,
    marks: marks,
    value: JSON.parse(localStorage.getItem('value') || '{}'),
  }), []);

  return (
    <YooptaEditorLib editor={editor} autoFocus onChange={(value) => {
      localStorage.setItem('value', JSON.stringify(value));
    }} style={EDITOR_STYLE}>
      <FloatingBlockActionsComponent />
      <SlashMenu />
      <FloatingToolbarComponent />
      <SelectionBox selectionBoxElement={containerRef} />
    </YooptaEditorLib>
  );
};