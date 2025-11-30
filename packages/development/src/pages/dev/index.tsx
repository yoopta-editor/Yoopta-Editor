import YooptaEditor, { YooEditor, createYooptaEditor } from '@yoopta/editor';
import { useEffect, useMemo } from 'react';

import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { TOOLS } from '../../utils/yoopta/tools';

const EDITOR_STYLE = {
  width: 750,
};

import { YooptaToolbar } from '@/components/new-yoo-components/yoopta-toolbar';
import { YooptaFloatingBlockActions } from '@/components/new-yoo-components/yoopta-floating-block-actions';
import { YooptaSlashCommandMenu } from '@/components/new-yoo-components/yoopta-slash-command-menu';
import { YooptaBlockOptions } from '@/components/new-yoo-components/yoopta-block-options';
import { YooptaActionMenuList } from '@/components/new-yoo-components/yoopta-action-menu-list';
import { FixedToolbar } from '@/components/FixedToolbar/FixedToolbar';

const YooptaUIPackageExample = () => {
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);

  useEffect(() => {
    editor.applyTransforms([{ type: 'validate_block_paths' }]);
  }, []);

  const insertAccordion = () => {
    const elements = editor.h('accordion-list', {
      children: [
        editor.h('accordion-list-item', {
          props: { isExpanded: true },
          children: [
            editor.h('accordion-list-item-heading'),
            editor.h('accordion-list-item-content', {
              children: [editor.h('blockquote')],
            }),
          ],
        }),
      ],
    });

    editor.insertBlock('Accordion', {
      elements,
      at: 0,
      focus: true,
    });

    console.log('insertAccordion editor.h elements', elements);
  };

  const insertSteps = () => {
    const elements = editor.h('step-container', {
      children: [
        editor.h('step-list', {
          children: [
            editor.h('step-list-item', {
              props: { isCompleted: false },
              children: [editor.h('step-list-item-heading'), editor.h('step-list-item-content')],
            }),
          ],
        }),
      ],
    });

    editor.insertBlock('Steps', {
      elements,
      at: 0,
      focus: true,
    });
  };

  return (
    <YooptaEditor
      editor={editor}
      plugins={YOOPTA_PLUGINS}
      marks={MARKS}
      autoFocus
      readOnly={false}
      placeholder="Type / to open menu"
      tools={TOOLS}
      style={EDITOR_STYLE}
      onChange={(value) => console.log('value', value)}
      // value={DEFAULT_VALUE}
      className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col">
      <YooptaToolbar />
      <YooptaFloatingBlockActions />
      <YooptaBlockOptions />
      <YooptaSlashCommandMenu />
      <YooptaActionMenuList />
      <div className="flex gap-2">
        <button
          onClick={insertAccordion}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
          Add Accordion
        </button>
        <button
          onClick={insertSteps}
          className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
          Add Steps
        </button>
      </div>
      <FixedToolbar editor={editor} />
    </YooptaEditor>
  );
};

export default YooptaUIPackageExample;
