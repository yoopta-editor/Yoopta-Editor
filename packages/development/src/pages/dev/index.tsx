import YooptaEditor, {
  createYooptaEditor,
  YooptaOnChangeOptions,
  YooEditor,
  YooptaContentValue,
  YooptaPath,
  useYooptaEditor,
  generateId,
} from '@yoopta/editor';
import { MentionCommands, MentionDropdown, withMentions } from '@yoopta/mention';
import { FloatingBlockActions, YooptaDndKit, useFloatingBlockActions, useYooptaDndKitContext } from '@yoopta/ui';
import { useMemo, useRef, useState } from 'react';
import React from 'react';

import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { TOOLS } from '../../utils/yoopta/tools';
import { FixedToolbar } from '../../components/FixedToolbar/FixedToolbar';

import { DEFAULT_VALUE } from '@/utils/yoopta/value';

const EDITOR_STYLE = {
  width: 750,
};

const fetchUsers = async (query: string): Promise<any[]> => {
  try {
    const url = new URL('http://localhost:3001/users');

    if (query) {
      url.searchParams.set('q', query);
    }

    url.searchParams.set('_limit', '10');

    const response = await fetch(url.toString());
    const users: any[] = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

const FloatingBlockActionsExample = () => {
  const { handlers, hoveredBlockId } = useFloatingBlockActions({});
  const { dragHandlesRef } = useYooptaDndKitContext();

  const dragHandle = useMemo(() => {
    const handler = dragHandlesRef?.current?.get(hoveredBlockId || '');
    return handler;
  }, [dragHandlesRef, hoveredBlockId]);

  return (
    <FloatingBlockActions.Root>
      <FloatingBlockActions.PlusAction onClick={handlers.onPlusClick} />
      <FloatingBlockActions.DragAction
        onClick={handlers.onDragClick}
        ref={dragHandle?.setActivatorNodeRef}
        {...dragHandle?.attributes}
        {...dragHandle?.listeners}
      />
    </FloatingBlockActions.Root>
  );
};

const BlockItem = ({ blockRender, block }: { blockRender: any; block: any }) => {
  return <YooptaDndKit.Item id={block.id}>{blockRender}</YooptaDndKit.Item>;
};

const BasicExample = () => {
  const editor: YooEditor = useMemo(() => withMentions(createYooptaEditor()), []);
  const selectionRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<YooptaContentValue>(DEFAULT_VALUE as YooptaContentValue);

  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    console.log('onChange', value, options);
    setValue(value);
  };

  const onPathChange = (path: YooptaPath) => {};

  return (
    <>
      <div className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col items-center" ref={selectionRef}>
        <FixedToolbar editor={editor} DEFAULT_DATA={DEFAULT_VALUE} />
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
          </YooptaEditor>
        </YooptaDndKit.Root>
      </div>
    </>
  );
};

export default BasicExample;
