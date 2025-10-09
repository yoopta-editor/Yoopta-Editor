import { DEFAULT_VALUE } from '@/utils/yoopta/default-value';
import type {
  YooEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
  YooptaPath,
} from '@yoopta/editor';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import { MentionCommands, MentionDropdown, withMentions } from '@yoopta/mention';
import { useMemo, useRef, useState } from 'react';

import { FixedToolbar } from '../../components/FixedToolbar/FixedToolbar';
import { fetchUsers } from '../../utils/yoopta/api';
import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { TOOLS } from '../../utils/yoopta/tools';

const EDITOR_STYLE = {
  width: 750,
};

const BasicExample = () => {
  const editor: YooEditor = useMemo(() => withMentions(createYooptaEditor()), []);
  const selectionRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<YooptaContentValue>(DEFAULT_VALUE);

  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    console.log('onChange', value, options);
    setValue(value);
  };

  return (
    <div
      className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col items-center"
      ref={selectionRef}>
      <FixedToolbar editor={editor} DEFAULT_DATA={DEFAULT_VALUE} />
      <div className="flex gap-2 mb-4">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          type="button"
          onClick={() => MentionCommands.closeDropdown(editor)}>
          Close dropdown
        </button>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          type="button"
          onClick={() => {
            const mentions = MentionCommands.findMentions(editor);
            console.log('MentionCommands.findMentions', mentions);
          }}>
          Find mentions
        </button>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          type="button"
          onClick={() => {
            const mention = MentionCommands.findMention(editor, { at: 1 });
            console.log('MentionCommands.findMention', mention);
          }}>
          Find mention
        </button>
        <button
          type="button"
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={() => {
            const search = MentionCommands.getSearchQuery(editor);
            console.log('MentionCommands.getSearchQuery', search);
          }}>
          Get Search Query
        </button>
      </div>
      <YooptaEditor
        editor={editor}
        plugins={YOOPTA_PLUGINS}
        selectionBoxRoot={selectionRef}
        marks={MARKS}
        autoFocus
        readOnly={false}
        placeholder="Type / to open menu"
        tools={TOOLS}
        style={EDITOR_STYLE}
        value={value}
        onChange={onChange}>
        <MentionDropdown
          getItems={async (query) => {
            const users = await fetchUsers(query);
            return users;
          }}
          debounceMs={500}
          onSelect={(mention) => {
            MentionCommands.insertMention(editor, {
              id: mention.id,
              name: mention.name,
              avatar: mention.avatar || '',
            });
          }}
        />
      </YooptaEditor>
    </div>
  );
};

export default BasicExample;
