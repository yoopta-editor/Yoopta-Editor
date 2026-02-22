'use client';

import { useMemo } from 'react';
import YooptaEditor, {
  createYooptaEditor,
  SlateElement,
} from '@yoopta/editor';
import { applyTheme } from '@yoopta/themes-shadcn';
// @ts-expect-error - MentionDropdown types not properly exported
import { MentionDropdown } from '@yoopta/themes-shadcn/mention';
// @ts-expect-error - EmojiDropdown types not properly exported
import { EmojiDropdown } from '@yoopta/themes-shadcn/emoji';
import { withMentions } from '@yoopta/mention';
import { YooptaToolbar } from '@/components/playground/examples/full-setup/new-yoo-components/yoopta-toolbar';
import { YooptaSlashCommandMenu } from '@/components/playground/examples/full-setup/new-yoo-components/yoopta-slash-command-menu';
import { YOOPTA_MARKS } from '@/components/playground/examples/full-setup/marks';
import type { YooptaPlugin as YooptaPluginType } from '@yoopta/editor';
import { withEmoji } from '@yoopta/emoji';

const EDITOR_STYLES = {
  width: '100%',
  paddingBottom: 80,
};

type PluginDemoEditorProps = {
  plugins: YooptaPluginType<Record<string, SlateElement>, unknown>[];
  slug: string;
};

export const PluginDemoEditor = ({ plugins, slug }: PluginDemoEditorProps) => {
  const editor = useMemo(
    () => {
      const baseEditor = withEmoji(withMentions(createYooptaEditor({ plugins: applyTheme(plugins), marks: YOOPTA_MARKS })));
      return baseEditor;
    },
    [plugins],
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
        {slug === 'mention' && <MentionDropdown />}
        {slug === 'emoji' && <EmojiDropdown />}
      </YooptaEditor>
    </div>
  );
};
