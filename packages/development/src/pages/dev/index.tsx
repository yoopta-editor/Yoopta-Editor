import YooptaEditor, { createYooptaEditor, YooptaOnChangeOptions, YooEditor, YooptaContentValue } from '@yoopta/editor';
import { withMentions } from '@yoopta/mention';
import { YooptaDndKit } from '@yoopta/ui';
import { useMemo, useRef, useState } from 'react';
import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { FixedToolbar } from '../../components/FixedToolbar/FixedToolbar';

import { DEFAULT_VALUE } from '@/utils/yoopta/value';

import { Toolbar } from '@/new-components/toolbar/toolbar';
import { BlockOptions, BlockOptionsProvider } from '@/new-components/block-options/block-options';
import { FloatingBlockActions } from '@/new-components/floations-block-actions/floations-block-actions';
import { ActionMenu, ActionMenuProvider } from '@/new-components/action-menu/action-menu';

const EDITOR_STYLE = {
  width: 750,
};

type BlockItemProps = {
  blockRender: any;
  block: any;
};

const BlockItem = ({ blockRender, block }: BlockItemProps) => {
  return <YooptaDndKit.Item id={block.id}>{blockRender}</YooptaDndKit.Item>;
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
          <ActionMenuProvider>
            <YooptaDndKit.Root editor={editor} readOnly={editor.readOnly} id={`yoopta-dnd-kit-${editor.id}`}>
              <YooptaEditor
                editor={editor}
                plugins={YOOPTA_PLUGINS}
                selectionBoxRoot={selectionRef}
                marks={MARKS}
                autoFocus={true}
                readOnly={false}
                placeholder="Type / to open menu"
                style={EDITOR_STYLE}
                value={value}
                onChange={onChange}
                renderBlock={BlockItem}
              >
                <FloatingBlockActions />
                <BlockOptions />
                <Toolbar />
                <ActionMenu />
              </YooptaEditor>
            </YooptaDndKit.Root>
          </ActionMenuProvider>
        </BlockOptionsProvider>
      </div>
    </>
  );
};

export default BasicExample;
