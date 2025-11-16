import {
  ChevronDownIcon,
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  UnderlineIcon,
} from '@radix-ui/react-icons';
import { useYooptaEditor } from '@yoopta/editor';
import { Toolbar, useToolbar } from '@yoopta/ui';

export const YooptaToolbar = () => {
  const editor = useYooptaEditor();
  const { isOpen, getRootProps } = useToolbar();

  const isBoldActive = editor.formats.bold?.isActive();
  const isItalicActive = editor.formats.italic?.isActive();
  const isUnderlineActive = editor.formats.underline?.isActive();
  const isStrikeActive = editor.formats.strike?.isActive();
  const isCodeActive = editor.formats.code?.isActive();

  const onTurnIntoClick = (e: React.MouseEvent) => {};

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
          <Toolbar.Button onClick={editor.formats.bold?.toggle} active={isBoldActive} title="Bold">
            <FontBoldIcon />
          </Toolbar.Button>
        )}
        {editor.formats.italic && (
          <Toolbar.Button
            onClick={editor.formats.italic?.toggle}
            active={isItalicActive}
            title="Italic">
            <FontItalicIcon />
          </Toolbar.Button>
        )}
        {editor.formats.underline && (
          <Toolbar.Button
            onClick={editor.formats.underline?.toggle}
            active={isUnderlineActive}
            title="Underline">
            <UnderlineIcon />
          </Toolbar.Button>
        )}
        {editor.formats.strike && (
          <Toolbar.Button
            onClick={editor.formats.strike?.toggle}
            active={isStrikeActive}
            title="Strikethrough">
            <StrikethroughIcon />
          </Toolbar.Button>
        )}
        {editor.formats.code && (
          <Toolbar.Button onClick={editor.formats.code?.toggle} active={isCodeActive} title="Code">
            <CodeIcon />
          </Toolbar.Button>
        )}
      </Toolbar.Group>
      <Toolbar.Separator />
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
      </Toolbar.Group>
    </Toolbar.Root>
  );
};
