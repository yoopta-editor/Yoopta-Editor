import YooptaEditor, { createYooptaEditor, YooptaOnChangeOptions, YooEditor, YooptaContentValue } from '@yoopta/editor';
import { withMentions } from '@yoopta/mention';
import { Toolbar, useToolbarActions, ToolbarProvider, useToolbar } from '@yoopta/ui/toolbar';

import { YooptaDndKit, useYooptaDndKitContext } from '@yoopta/ui/dnd-kit';

import {
  BlockOptions,
  BlockOptionsProvider,
  useBlockOptionsContext,
  useBlockOptionDefaultHandlers,
} from '@yoopta/ui/block-options';
import {
  FloatingBlockActions,
  useFloatingBlockActions,
  useFloatingBlockActionDefaultHandlers,
} from '@yoopta/ui/floating-block-actions';

import { useMemo, useRef, useState } from 'react';
import React from 'react';

import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { TOOLS } from '../../utils/yoopta/tools';
import { FixedToolbar } from '../../components/FixedToolbar/FixedToolbar';

import { DEFAULT_VALUE } from '@/utils/yoopta/value';
import { CopyIcon, Link2Icon, TrashIcon, EditIcon, EyeIcon, SettingsIcon, MoveIcon } from 'lucide-react';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
} from 'lucide-react';

const EDITOR_STYLE = {
  width: 750,
};

const FloatingBlockActionsExample = () => {
  const { hoveredBlockId } = useFloatingBlockActions();
  const { onPlusClick, onDragClick } = useFloatingBlockActionDefaultHandlers();

  const { getDragHandleProps } = useYooptaDndKitContext();

  const { open, close, isOpen } = useBlockOptionsContext();

  const dragActionClick = (event: React.MouseEvent) => {
    onDragClick(event);
    if (isOpen) {
      close();
    } else {
      open({ element: event.currentTarget as HTMLElement });
    }
  };

  const plusActionClick = (event: React.MouseEvent) => {
    onPlusClick(event);
    open({ element: event.currentTarget as HTMLElement });
  };

  const dragProps = getDragHandleProps(hoveredBlockId);

  return (
    <FloatingBlockActions.Root>
      <FloatingBlockActions.PlusAction onClick={plusActionClick} />
      <FloatingBlockActions.DragAction onClick={dragActionClick} {...dragProps} />
    </FloatingBlockActions.Root>
  );
};

type BlockItemProps = {
  blockRender: any;
  block: any;
};

const BlockItem = ({ blockRender, block }: BlockItemProps) => {
  return <YooptaDndKit.Item id={block.id}>{blockRender}</YooptaDndKit.Item>;
};

const BlockOptionsComponent = () => {
  const { duplicateBlock, copyLinkToBlock, deleteBlock } = useBlockOptionDefaultHandlers();

  return (
    <BlockOptions.Root>
      <BlockOptions.Content>
        <BlockOptions.Group>
          <BlockOptions.Button icon={<EditIcon />} size="md">
            Edit block
          </BlockOptions.Button>
          <BlockOptions.Button icon={<EyeIcon />} size="md">
            Preview
          </BlockOptions.Button>
          <BlockOptions.Button icon={<CopyIcon />} size="md" onClick={duplicateBlock}>
            Duplicate block
          </BlockOptions.Button>
          <BlockOptions.Button icon={<MoveIcon />} size="md">
            Move block
          </BlockOptions.Button>
          <BlockOptions.Separator />
          <BlockOptions.Button icon={<Link2Icon />} size="md" onClick={copyLinkToBlock}>
            Copy link to block
          </BlockOptions.Button>
          <BlockOptions.Button icon={<SettingsIcon />} size="md">
            Block settings
          </BlockOptions.Button>
          <BlockOptions.Separator />
          <BlockOptions.Button icon={<TrashIcon />} variant="destructive" size="md" onClick={deleteBlock}>
            Delete block
          </BlockOptions.Button>
        </BlockOptions.Group>
      </BlockOptions.Content>
    </BlockOptions.Root>
  );
};

// TODO: Uncomment when Toolbar is ready
const ToolbarView = () => {
  const { toggleMark, toggleAlign, isMarkActive, getCurrentAlign } = useToolbarActions();
  const { isOpen } = useToolbar();

  // console.log('ToolbarView', { isMarkActive: isMarkActive('bold'), isOpen });

  const getAlignIcon = () => {
    const align = getCurrentAlign();
    switch (align) {
      case 'left':
        return <AlignLeftIcon />;
      case 'center':
        return <AlignCenterIcon />;
      case 'right':
        return <AlignRightIcon />;
      default:
        return <AlignLeftIcon />;
    }
  };

  return (
    <ToolbarProvider>
      <Toolbar.Root>
        <Toolbar.Content>
          <Toolbar.Group>
            <Toolbar.Toggle
              icon={<BoldIcon />}
              active={isMarkActive('bold')}
              onClick={() => toggleMark('bold')}
              aria-label="Bold"
            />
            <Toolbar.Toggle
              icon={<ItalicIcon />}
              active={isMarkActive('italic')}
              onClick={() => toggleMark('italic')}
              aria-label="Italic"
            />
            <Toolbar.Toggle
              icon={<UnderlineIcon />}
              active={isMarkActive('underline')}
              onClick={() => toggleMark('underline')}
              aria-label="Underline"
            />
            <Toolbar.Toggle
              icon={<StrikethroughIcon />}
              active={isMarkActive('strike')}
              onClick={() => toggleMark('strike')}
              aria-label="Strikethrough"
            />
            <Toolbar.Toggle
              icon={<CodeIcon />}
              active={isMarkActive('code')}
              onClick={() => toggleMark('code')}
              aria-label="Code"
            />
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Group>
            <Toolbar.Toggle icon={getAlignIcon()} onClick={toggleAlign} aria-label="Text alignment" />
          </Toolbar.Group>
        </Toolbar.Content>
      </Toolbar.Root>
    </ToolbarProvider>
  );
};

const BasicExample = () => {
  const editor: YooEditor = useMemo(() => withMentions(createYooptaEditor()), []);
  const selectionRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<YooptaContentValue>(DEFAULT_VALUE as YooptaContentValue);

  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    setValue(value);
  };

  return (
    <>
      <div className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col items-center" ref={selectionRef}>
        <FixedToolbar editor={editor} DEFAULT_DATA={DEFAULT_VALUE} />
        <BlockOptionsProvider>
          <YooptaDndKit.Root editor={editor} readOnly={editor.readOnly} id={`yoopta-dnd-kit-${editor.id}`}>
            <YooptaEditor
              editor={editor}
              plugins={YOOPTA_PLUGINS}
              selectionBoxRoot={selectionRef}
              marks={MARKS}
              autoFocus={true}
              readOnly={false}
              placeholder="Type / to open menu"
              // tools={TOOLS}
              style={EDITOR_STYLE}
              value={value}
              onChange={onChange}
              renderBlock={BlockItem}
            >
              <FloatingBlockActionsExample />
              <BlockOptionsComponent />
              <ToolbarView />
            </YooptaEditor>
          </YooptaDndKit.Root>
        </BlockOptionsProvider>
      </div>
    </>
  );
};

export default BasicExample;
