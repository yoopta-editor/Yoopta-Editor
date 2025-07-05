import YooptaEditor, { createYooptaEditor, YooptaOnChangeOptions, YooEditor, YooptaContentValue } from '@yoopta/editor';
import { withMentions } from '@yoopta/mention';
import {
  FloatingBlockActions,
  YooptaDndKit,
  useFloatingBlockActions,
  useBlockOptionDefaultHandlers,
  useYooptaDndKitContext,
  BlockOptionsProvider,
  useBlockOptionsContext,
  BlockOptions,
  useFloatingBlockActionDefaultHandlers,
} from '@yoopta/ui';
import { useMemo, useRef, useState } from 'react';
import React from 'react';

import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { TOOLS } from '../../utils/yoopta/tools';
import { FixedToolbar } from '../../components/FixedToolbar/FixedToolbar';

import { DEFAULT_VALUE } from '@/utils/yoopta/value';
import { CopyIcon, Link2Icon, TrashIcon, EditIcon, EyeIcon, SettingsIcon, MoveIcon } from 'lucide-react';

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
              tools={TOOLS}
              style={EDITOR_STYLE}
              value={value}
              onChange={onChange}
              renderBlock={BlockItem}
            >
              <FloatingBlockActionsExample />
              <BlockOptionsComponent />
            </YooptaEditor>
          </YooptaDndKit.Root>
        </BlockOptionsProvider>
      </div>
    </>
  );
};

export default BasicExample;
