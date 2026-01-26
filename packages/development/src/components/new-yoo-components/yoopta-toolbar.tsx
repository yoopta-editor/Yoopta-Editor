import { useRef, useState } from 'react';
import {
  ChevronDownIcon,
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from '@radix-ui/react-icons';
import { Blocks, Marks, useYooptaEditor } from '@yoopta/editor';
import { FloatingToolbar } from '@yoopta/ui/floating-toolbar';
import { HighlightColorPicker } from '@yoopta/ui/highlight-color-picker';
import { HighlighterIcon } from 'lucide-react';
import { YooptaActionMenuList } from './yoopta-action-menu-list';

export const YooptaToolbar = () => {
  const editor = useYooptaEditor();
  const turnIntoRef = useRef<HTMLButtonElement>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);

  const isBoldActive = Marks.isActive(editor, { type: 'bold' });
  const isItalicActive = Marks.isActive(editor, { type: 'italic' });
  const isUnderlineActive = Marks.isActive(editor, { type: 'underline' });
  const isStrikeActive = Marks.isActive(editor, { type: 'strike' });
  const isCodeActive = Marks.isActive(editor, { type: 'code' });
  const isHighlightActive = Marks.isActive(editor, { type: 'highlight' });

  const highlightValue = Marks.getValue(editor, { type: 'highlight' }) as
    | { color?: string; backgroundColor?: string }
    | null;

  const onTurnIntoClick = () => {
    setActionMenuOpen(true);
  };

  const currentBlockId =
    typeof editor.path.current === 'number'
      ? Blocks.getBlock(editor, { at: editor.path.current })?.id ?? null
      : null;

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
                active={isBoldActive}
                title="Bold"
              >
                <FontBoldIcon />
              </FloatingToolbar.Button>
            )}
            {editor.formats.italic && (
              <FloatingToolbar.Button
                onClick={() => Marks.toggle(editor, { type: 'italic' })}
                active={isItalicActive}
                title="Italic"
              >
                <FontItalicIcon />
              </FloatingToolbar.Button>
            )}
            {editor.formats.underline && (
              <FloatingToolbar.Button
                onClick={() => Marks.toggle(editor, { type: 'underline' })}
                active={isUnderlineActive}
                title="Underline"
              >
                <UnderlineIcon />
              </FloatingToolbar.Button>
            )}
            {editor.formats.strike && (
              <FloatingToolbar.Button
                onClick={() => Marks.toggle(editor, { type: 'strike' })}
                active={isStrikeActive}
                title="Strikethrough"
              >
                <StrikethroughIcon />
              </FloatingToolbar.Button>
            )}
            {editor.formats.code && (
              <FloatingToolbar.Button
                onClick={() => Marks.toggle(editor, { type: 'code' })}
                active={isCodeActive}
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
                  active={isHighlightActive}
                  title="Highlight"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (isHighlightActive) {
                      Marks.remove(editor, { type: 'highlight' });
                    }
                  }}
                  style={{
                    backgroundColor: isHighlightActive ? highlightValue?.backgroundColor : undefined,
                    color: isHighlightActive ? highlightValue?.color : undefined,
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
        blockId={currentBlockId}
      />
    </>
  );
};
