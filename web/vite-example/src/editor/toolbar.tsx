import React from 'react';
import { Toolbar, useToolbar } from '@yoopta/ui/toolbar';
import { HighlightColorPicker } from '@yoopta/ui/highlight-color-picker';
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, CodeIcon, HighlighterIcon } from 'lucide-react';
import { Marks, useYooptaEditor } from '@yoopta/editor';

export const ToolbarComponent = () => {
  const editor = useYooptaEditor();
  const { isOpen, getRootProps } = useToolbar();

  if (!isOpen) return null;

  const highlightValue = Marks.getValue(editor, { type: 'highlight' }) as { color?: string; backgroundColor?: string } | null;

  return (
    <Toolbar.Root {...getRootProps()}>
      <Toolbar.Group>
        <Toolbar.Button active={Marks.isActive(editor, { type: 'bold' })} onClick={() => {
          Marks.toggle(editor, { type: 'bold' });
        }}>
          <BoldIcon />
        </Toolbar.Button>
        <Toolbar.Button active={Marks.isActive(editor, { type: 'italic' })} onClick={() => {
          Marks.toggle(editor, { type: 'italic' });
        }}>
          <ItalicIcon />
        </Toolbar.Button>
        <Toolbar.Button active={Marks.isActive(editor, { type: 'underline' })} onClick={() => {
          Marks.toggle(editor, { type: 'underline' });
        }}>
          <UnderlineIcon />
        </Toolbar.Button>
        <Toolbar.Button active={Marks.isActive(editor, { type: 'strike' })} onClick={() => {
          Marks.toggle(editor, { type: 'strike' });
        }}>
          <StrikethroughIcon />
        </Toolbar.Button>
        <Toolbar.Button active={Marks.isActive(editor, { type: 'code' })} onClick={() => {
          Marks.toggle(editor, { type: 'code' });
        }}>
          <CodeIcon />
        </Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group>
        <HighlightColorPicker
          value={highlightValue ?? {}}
          onChange={(values) => {
            Marks.add(editor, { type: 'highlight', value: values });
          }}>
          <Toolbar.Button>
            <HighlighterIcon />
          </Toolbar.Button>
        </HighlightColorPicker>
      </Toolbar.Group>
    </Toolbar.Root>
  );
};