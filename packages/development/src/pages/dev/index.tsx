import { DEFAULT_VALUE } from '@/utils/yoopta/default-value';
import YooptaEditor, { YooEditor, createYooptaEditor, Elements } from '@yoopta/editor';
import { useEffect, useMemo, useState } from 'react';

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

    setTimeout(() => {
      Elements.createElement(editor, 'ccf07889-23a3-44f3-9b9d-2270b149fb26', {
        type: 'accordion-list',
      });
    }, 0);
  }, []);

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
      value={DEFAULT_VALUE}
      className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col">
      <YooptaToolbar />
      <YooptaFloatingBlockActions />
      <YooptaBlockOptions />
      <YooptaSlashCommandMenu />
      <YooptaActionMenuList />
    </YooptaEditor>
  );
};

export default YooptaUIPackageExample;
