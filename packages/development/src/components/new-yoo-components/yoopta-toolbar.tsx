import {
  ChevronDownIcon,
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from '@radix-ui/react-icons';
import { Blocks, Marks, useYooptaEditor } from '@yoopta/editor';
import { Toolbar, useToolbar } from '@yoopta/ui/toolbar';
import { useActionMenuListActions } from '@yoopta/ui/action-menu-list';
import { HighlightColorPicker } from '@yoopta/ui/highlight-color-picker';
import { HighlighterIcon } from 'lucide-react';

export const YooptaToolbar = () => {
  const editor = useYooptaEditor();
  const { isOpen, getRootProps } = useToolbar();
  const { open: openActionMenuList } = useActionMenuListActions();

  const isBoldActive = Marks.isActive(editor, { type: 'bold' });
  const isItalicActive = Marks.isActive(editor, { type: 'italic' });
  const isUnderlineActive = Marks.isActive(editor, { type: 'underline' });
  const isStrikeActive = Marks.isActive(editor, { type: 'strike' });
  const isCodeActive = Marks.isActive(editor, { type: 'code' });
  const isHighlightActive = Marks.isActive(editor, { type: 'highlight' });

  const highlightValue = Marks.getValue(editor, { type: 'highlight' }) as
    | { color?: string; backgroundColor?: string }
    | null;

  const onTurnIntoClick = (e: React.MouseEvent) => {
    const block = Blocks.getBlock(editor, { at: editor.path.current });
    if (!block) return;

    openActionMenuList({
      reference: e.currentTarget as HTMLElement,
      view: 'small',
      placement: 'bottom-start',
      blockId: block.id,
    });
  };

  if (!isOpen) return null;

  return (
    <Toolbar.Root {...getRootProps()}>
      <Toolbar.Group>
        <Toolbar.Button onClick={onTurnIntoClick}>
          Turn into
          <ChevronDownIcon width={16} height={16} />
        </Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group>
        {editor.formats.bold && (
          <Toolbar.Button onClick={() => Marks.toggle(editor, { type: 'bold' })} active={isBoldActive} title="Bold">
            <FontBoldIcon />
          </Toolbar.Button>
        )}
        {editor.formats.italic && (
          <Toolbar.Button
            onClick={() => Marks.toggle(editor, { type: 'italic' })}
            active={isItalicActive}
            title="Italic">
            <FontItalicIcon />
          </Toolbar.Button>
        )}
        {editor.formats.underline && (
          <Toolbar.Button
            onClick={() => Marks.toggle(editor, { type: 'underline' })}
            active={isUnderlineActive}
            title="Underline">
            <UnderlineIcon />
          </Toolbar.Button>
        )}
        {editor.formats.strike && (
          <Toolbar.Button
            onClick={() => Marks.toggle(editor, { type: 'strike' })}
            active={isStrikeActive}
            title="Strikethrough">
            <StrikethroughIcon />
          </Toolbar.Button>
        )}
        {editor.formats.code && (
          <Toolbar.Button onClick={() => Marks.toggle(editor, { type: 'code' })} active={isCodeActive} title="Code">
            <CodeIcon />
          </Toolbar.Button>
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
            }}>
            <Toolbar.Button
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
              }}>
              <HighlighterIcon />
            </Toolbar.Button>
          </HighlightColorPicker>
        )}
      </Toolbar.Group>
      {/* <Toolbar.Separator />
      <Toolbar.Group>
        <Toolbar.Button onClick={() => console.log('Align left')}>
          <TextAlignLeftIcon />
        </Toolbar.Button>
        <Toolbar.Button onClick={() => console.log('Align center')}>
          <TextAlignCenterIcon />
        </Toolbar.Button>
        <Toolbar.Button onClick={() => console.log('Align right')}>
          <TextAlignRightIcon />
        </Toolbar.Button>
      </Toolbar.Group> */}
    </Toolbar.Root>
  );
};
