import { DEFAULT_VALUE } from '@/utils/yoopta/default-value';
import YooptaEditor, {
  useYooptaEditor,
  YooEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
  createYooptaEditor,
  Blocks,
} from '@yoopta/editor';
import {
  FloatingBlockActions,
  useBlockOptions,
  BlockOptions,
  useFloatingBlockActions,
  Toolbar,
} from '@yoopta/ui';
import { useMemo, useRef, useState } from 'react';

import { FixedToolbar } from '../../components/FixedToolbar/FixedToolbar';
import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { TOOLS } from '../../utils/yoopta/tools';
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, MagnetIcon, PlusIcon } from 'lucide-react';
import {
  DragHandleDots2Icon,
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
} from '@radix-ui/react-icons';

const EDITOR_STYLE = {
  width: 750,
};

const FloatingBlockActionsComponent = () => {
  const editor = useYooptaEditor();
  const { open: openBlockOptions } = useBlockOptions();
  const { toggle, reference, floatingBlockId } = useFloatingBlockActions();

  const onPlusClick = (e: React.MouseEvent) => {
    editor.insertBlock('Paragraph', { at: editor.path.current, focus: true });
  };

  const onDragClick = (e: React.MouseEvent) => {
    if (!floatingBlockId) return;
    openBlockOptions({ reference: reference as HTMLElement, blockId: floatingBlockId });
    toggle('frozen', floatingBlockId);
  };

  const dragHandleProps = {};

  return (
    <FloatingBlockActions.Root>
      <FloatingBlockActions.Button onClick={onPlusClick}>
        <PlusIcon />
      </FloatingBlockActions.Button>
      <FloatingBlockActions.Button onClick={onDragClick} {...dragHandleProps}>
        <DragHandleDots2Icon />
      </FloatingBlockActions.Button>
    </FloatingBlockActions.Root>
  );
};

const BlockOptionsComponent = () => {
  const { duplicateBlock, copyBlockLink, deleteBlock } = useBlockOptions();
  const { toggle: toggleFloatingBlockActions, floatingBlockId } = useFloatingBlockActions();

  const onDuplicateBlock = () => {
    if (!floatingBlockId) return;
    duplicateBlock(floatingBlockId);
    toggleFloatingBlockActions('hovering');
  };

  const onCopyBlockLink = () => {
    if (!floatingBlockId) return;
    copyBlockLink(floatingBlockId);
    toggleFloatingBlockActions('hovering');
  };

  const onDeleteBlock = () => {
    if (!floatingBlockId) return;
    deleteBlock(floatingBlockId);
    toggleFloatingBlockActions('hovering');
  };

  const onClose = () => {
    toggleFloatingBlockActions('closed');
  };

  return (
    <BlockOptions.Root onClose={onClose}>
      <BlockOptions.Content>
        <BlockOptions.Group>
          <BlockOptions.Button onClick={onDuplicateBlock}>Turn into</BlockOptions.Button>
        </BlockOptions.Group>
        <BlockOptions.Separator />
        <BlockOptions.Group>
          <BlockOptions.Button onClick={onDuplicateBlock}>Duplicate</BlockOptions.Button>
          <BlockOptions.Button onClick={onCopyBlockLink}>Copy link to block</BlockOptions.Button>
          <BlockOptions.Button onClick={onDeleteBlock}>Delete</BlockOptions.Button>
        </BlockOptions.Group>
      </BlockOptions.Content>
      <BlockOptions.Separator />
      <BlockOptions.Group>
        <BlockOptions.Button onClick={onDuplicateBlock}>Generate AI</BlockOptions.Button>
      </BlockOptions.Group>
    </BlockOptions.Root>
  );
};

const ToolbarComponent = () => {
  const editor = useYooptaEditor();

  const isBoldActive = editor.formats.bold?.isActive();
  const isItalicActive = editor.formats.italic?.isActive();
  const isUnderlineActive = editor.formats.underline?.isActive();
  const isStrikeActive = editor.formats.strike?.isActive();
  const isCodeActive = editor.formats.code?.isActive();

  return (
    <Toolbar.Root>
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
          <AlignLeftIcon />
        </Toolbar.Button>
        <Toolbar.Button onClick={() => console.log('Align center')}>
          <AlignCenterIcon />
        </Toolbar.Button>
        <Toolbar.Button onClick={() => console.log('Align right')}>
          <AlignRightIcon />
        </Toolbar.Button>
      </Toolbar.Group>
    </Toolbar.Root>
  );
};

const BasicExample = () => {
  // move plugins, marks and other things to this object setup
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<YooptaContentValue>(DEFAULT_VALUE);

  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    console.log('onChange', value, options);
    setValue(value);
  };

  return (
    <div
      className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col items-center"
      ref={selectionRef}>
      <FixedToolbar editor={editor} DEFAULT_DATA={DEFAULT_VALUE} />
      <YooptaEditor
        editor={editor}
        plugins={YOOPTA_PLUGINS}
        selectionBoxRoot={selectionRef}
        marks={MARKS}
        autoFocus
        readOnly={false}
        placeholder="Type / to open menu"
        tools={TOOLS}
        style={EDITOR_STYLE}
        value={value}
        onChange={onChange}>
        <FloatingBlockActionsComponent />
        <BlockOptionsComponent />
        <ToolbarComponent />
      </YooptaEditor>
    </div>
  );
};

export default BasicExample;
