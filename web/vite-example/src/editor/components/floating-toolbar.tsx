import React from 'react';
import { FloatingToolbar } from '@yoopta/ui/floating-toolbar';
import { HighlightColorPicker } from '@yoopta/ui/highlight-color-picker';
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, CodeIcon, HighlighterIcon } from 'lucide-react';
import { Marks, useYooptaEditor } from '@yoopta/editor';

export const FloatingToolbarComponent = () => {
  const editor = useYooptaEditor();

  const highlightValue = Marks.getValue(editor, { type: 'highlight' }) as { color?: string; backgroundColor?: string } | null;

  return (
    <FloatingToolbar.Root>
      <FloatingToolbar.Content>
        <FloatingToolbar.Group>
          <FloatingToolbar.Button active={Marks.isActive(editor, { type: 'bold' })} onClick={() => {
            Marks.toggle(editor, { type: 'bold' });
          }}>
            <BoldIcon />
          </FloatingToolbar.Button>
          <FloatingToolbar.Button active={Marks.isActive(editor, { type: 'italic' })} onClick={() => {
            Marks.toggle(editor, { type: 'italic' });
          }}>
            <ItalicIcon />
          </FloatingToolbar.Button>
          <FloatingToolbar.Button active={Marks.isActive(editor, { type: 'underline' })} onClick={() => {
            Marks.toggle(editor, { type: 'underline' });
          }}>
            <UnderlineIcon />
          </FloatingToolbar.Button>
          <FloatingToolbar.Button active={Marks.isActive(editor, { type: 'strike' })} onClick={() => {
            Marks.toggle(editor, { type: 'strike' });
          }}>
            <StrikethroughIcon />
          </FloatingToolbar.Button>
          <FloatingToolbar.Button active={Marks.isActive(editor, { type: 'code' })} onClick={() => {
            Marks.toggle(editor, { type: 'code' });
          }}>
            <CodeIcon />
          </FloatingToolbar.Button>
        </FloatingToolbar.Group>
        <FloatingToolbar.Separator />
        <FloatingToolbar.Group>
          <HighlightColorPicker
            value={highlightValue ?? {}}
            onChange={(values) => {
              Marks.add(editor, { type: 'highlight', value: values });
            }}>
            <FloatingToolbar.Button>
              <HighlighterIcon />
            </FloatingToolbar.Button>
          </HighlightColorPicker>
        </FloatingToolbar.Group>
      </FloatingToolbar.Content>
    </FloatingToolbar.Root>
  );
};