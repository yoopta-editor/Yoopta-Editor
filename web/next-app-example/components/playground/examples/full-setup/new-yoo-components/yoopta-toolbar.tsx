import { useRef, useState } from 'react';
import {
  ChevronDownIcon,
  CodeIcon,
  BoldIcon,
  ItalicIcon,
  Strikethrough,
  Underline,
} from 'lucide-react';
import { Marks, useYooptaEditor } from '@yoopta/editor';
import { FloatingToolbar } from '@yoopta/ui/floating-toolbar';
import { HighlightColorPicker } from '@yoopta/ui/highlight-color-picker';
import { HighlighterIcon } from 'lucide-react';
import { YooptaActionMenuList } from './yoopta-action-menu-list';

export const YooptaToolbar = () => {
  const editor = useYooptaEditor();
  const turnIntoRef = useRef<HTMLButtonElement>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);

  const highlightValue = Marks.getValue(editor, { type: 'highlight' }) as
    | { color?: string; backgroundColor?: string }
    | null;

  const onTurnIntoClick = () => {
    setActionMenuOpen(true);
  };

  return (
    <>
      <FloatingToolbar frozen={actionMenuOpen}>
        <FloatingToolbar.Content>
          <FloatingToolbar.Group>
            <FloatingToolbar.Button ref={turnIntoRef} onClick={onTurnIntoClick}>
              Turn into
              <ChevronDownIcon width={16} height={16} />
            </FloatingToolbar.Button>
          </FloatingToolbar.Group>
          <FloatingToolbar.Separator />
          <FloatingToolbar.Group>
            {editor.formats.bold && (
              <FloatingToolbar.Button
                onClick={() => Marks.toggle(editor, { type: 'bold' })}
                active={Marks.isActive(editor, { type: 'bold' })}
                title="Bold"
              >
                <BoldIcon />
              </FloatingToolbar.Button>
            )}
            {editor.formats.italic && (
              <FloatingToolbar.Button
                onClick={() => Marks.toggle(editor, { type: 'italic' })}
                active={Marks.isActive(editor, { type: 'italic' })}
                title="Italic"
              >
                <ItalicIcon />
              </FloatingToolbar.Button>
            )}
            {editor.formats.underline && (
              <FloatingToolbar.Button
                onClick={() => Marks.toggle(editor, { type: 'underline' })}
                active={Marks.isActive(editor, { type: 'underline' })}
                title="Underline"
              >
                <Underline />
              </FloatingToolbar.Button>
            )}
            {editor.formats.strike && (
              <FloatingToolbar.Button
                onClick={() => Marks.toggle(editor, { type: 'strike' })}
                active={Marks.isActive(editor, { type: 'strike' })}
                title="Strikethrough"
              >
                <Strikethrough />
              </FloatingToolbar.Button>
            )}
            {editor.formats.code && (
              <FloatingToolbar.Button
                onClick={() => Marks.toggle(editor, { type: 'code' })}
                active={Marks.isActive(editor, { type: 'code' })}
                title="Code"
              >
                <CodeIcon />
              </FloatingToolbar.Button>
            )}
            {editor.formats.highlight && (
              <HighlightColorPicker
                value={highlightValue ?? {}}
                presets={[
                  '#FFFF00',
                  '#FFE066',
                  '#FFCC99',
                  '#FF9999',
                  '#99CCFF',
                  '#99FF99',
                  '#FF99FF',
                  '#000000',
                ]}
                onChange={(values) => {
                  Marks.add(editor, {
                    type: 'highlight',
                    value: {
                      color: values.color,
                      backgroundColor: values.backgroundColor,
                    },
                  });
                }}
              >
                <FloatingToolbar.Button
                  active={Marks.isActive(editor, { type: 'highlight' })}
                  title="Highlight"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (Marks.isActive(editor, { type: 'highlight' })) {
                      Marks.remove(editor, { type: 'highlight' });
                    }
                  }}
                  style={{
                    backgroundColor: Marks.isActive(editor, { type: 'highlight' }) ? highlightValue?.backgroundColor : undefined,
                    color: Marks.isActive(editor, { type: 'highlight' }) ? highlightValue?.color : undefined,
                  }}
                >
                  <HighlighterIcon />
                </FloatingToolbar.Button>
              </HighlightColorPicker>
            )}
          </FloatingToolbar.Group>
        </FloatingToolbar.Content>
      </FloatingToolbar>

      <YooptaActionMenuList
        open={actionMenuOpen}
        onOpenChange={setActionMenuOpen}
        anchor={turnIntoRef.current}
        placement='bottom-start'
      />
    </>
  );
};
