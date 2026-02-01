'use client';

import { useMemo } from 'react';
import YooptaEditor, {
  createYooptaEditor,
  SlateElement,
  YooptaPlugin,
} from '@yoopta/editor';
import { applyTheme } from '@yoopta/themes-shadcn';
import { YooptaToolbar } from '@/components/playground/examples/full-setup/new-yoo-components/yoopta-toolbar';
import { YooptaSlashCommandMenu } from '@/components/playground/examples/full-setup/new-yoo-components/yoopta-slash-command-menu';
import { YOOPTA_MARKS } from '@/components/playground/examples/full-setup/marks';
import type { YooptaPlugin as YooptaPluginType } from '@yoopta/editor';

const EDITOR_STYLES = {
  width: '100%',
  paddingBottom: 80,
};

type PluginDemoEditorProps = {
  plugins: YooptaPluginType<Record<string, SlateElement>, unknown>[];
};

export const PluginDemoEditor = ({ plugins }: PluginDemoEditorProps) => {
  const themedPlugins = useMemo(
    () => applyTheme(plugins) as unknown as YooptaPlugin<Record<string, SlateElement>, unknown>[],
    [plugins],
  );
  const editor = useMemo(
    () => createYooptaEditor({ plugins: themedPlugins, marks: YOOPTA_MARKS }),
    [themedPlugins],
  );

  const onChange = () => { };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <YooptaEditor
        editor={editor}
        style={EDITOR_STYLES}
        onChange={onChange}
        placeholder="Type / to open menu..."
      >
        <YooptaToolbar />
        <YooptaSlashCommandMenu />
      </YooptaEditor>
    </div>
  );
};
