import YooptaEditor, { createYooptaEditor, YooptaOnChangeOptions, YooEditor, YooptaContentValue } from '@yoopta/editor';
import { withMentions } from '@yoopta/mention';
import {
  FloatingBlockActions,
  YooptaDndKit,
  useFloatingBlockActions,
  useYooptaDndKitContext,
  BlockOptionsProvider,
  useBlockOptionsContext,
  BlockOptions,
} from '@yoopta/ui';
import { useMemo, useRef, useState } from 'react';
import React from 'react';

import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { TOOLS } from '../../utils/yoopta/tools';
import { FixedToolbar } from '../../components/FixedToolbar/FixedToolbar';

import { DEFAULT_VALUE } from '@/utils/yoopta/value';
import { CopyIcon, Link2Icon, TrashIcon } from 'lucide-react';

const EDITOR_STYLE = {
  width: 750,
};

const FloatingBlockActionsExample = () => {
  const { handlers, hoveredBlockId } = useFloatingBlockActions({});
  const { getDragHandleProps } = useYooptaDndKitContext();
  const { open } = useBlockOptionsContext();

  const onDragClick = (event: React.MouseEvent) => {
    handlers.onDragClick(event);
    open({ element: event.currentTarget as HTMLElement });
  };

  const dragProps = getDragHandleProps(hoveredBlockId);

  return (
    <FloatingBlockActions.Root>
      <FloatingBlockActions.PlusAction onClick={handlers.onPlusClick} />
      <FloatingBlockActions.DragAction onClick={onDragClick} {...dragProps} />
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
  return (
    <BlockOptions.Root>
      <BlockOptions.Content>
        <BlockOptions.Group>
          <BlockOptions.Button icon={<TrashIcon />}>Delete block</BlockOptions.Button>
          <BlockOptions.Button icon={<CopyIcon />}>Duplicate block</BlockOptions.Button>
          <BlockOptions.Separator />
          <BlockOptions.Button icon={<Link2Icon />}>Copy link to block</BlockOptions.Button>
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
