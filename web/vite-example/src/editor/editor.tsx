import React from 'react';
import YooptaEditorLib, { createYooptaEditor } from '@yoopta/editor';
import { useMemo } from 'react';
import { plugins } from './plugins';
import { marks } from './marks';
import { SlashMenu } from './slash-menu';
import { ToolbarComponent } from './toolbar';

export const YooptaEditor = () => {
  const editor = useMemo(() => createYooptaEditor({
    plugins: plugins,
    marks: marks,
    value: JSON.parse(localStorage.getItem('value') || '{}'),
  }), []);

  return (
    <YooptaEditorLib editor={editor} width="100%" autoFocus onChange={(value) => {
      localStorage.setItem('value', JSON.stringify(value));
    }}>
      <SlashMenu />
      <ToolbarComponent />
    </YooptaEditorLib>
  );
};