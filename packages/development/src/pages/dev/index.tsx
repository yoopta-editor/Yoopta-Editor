import { DEFAULT_VALUE } from '@/utils/yoopta/default-value';
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
              children: [editor.h('paragraph'), editor.h('heading-one'), editor.h('paragraph')],
            }),
          ],
        }),
        editor.h('accordion-list-item', {
          props: { isExpanded: true },
          children: [
            editor.h('accordion-list-item-heading'),
            editor.h('accordion-list-item-content', {
              children: [editor.h('paragraph')],
            }),
          ],
        }),
        editor.h('accordion-list-item', {
          props: { isExpanded: true },
          children: [
            editor.h('accordion-list-item-heading'),
            editor.h('accordion-list-item-content'),
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
      <button onClick={insertAccordion}>add accordion</button>
    </YooptaEditor>
  );
};

export default YooptaUIPackageExample;
