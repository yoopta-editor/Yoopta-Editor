import YooptaEditor, {
  Blocks,
  createYooptaEditor,
  generateId,
  YooptaBlockData,
} from '@yoopta/editor';
import Blockquote from '@yoopta/blockquote';
import Paragraph from '@yoopta/paragraph';
import Image from '@yoopta/image';
import { Bold, Italic, CodeMark, Strike, Underline } from '@yoopta/marks';
import Lists from '@yoopta/lists';
import Link from '@yoopta/link';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import Code from '@yoopta/code';
import { useEffect, useMemo } from 'react';
import s from './SlackChat.module.scss';
import { SlackTopToolbar } from './SlackTopToolbar';

const plugins = [
  Paragraph.extend({
    options: {
      HTMLAttributes: {
        className: s.chatText,
      },
    },
  }),
  Blockquote.extend({
    options: {
      HTMLAttributes: {
        className: s.chatText,
      },
    },
  }),
  Image,
  Video,
  File,
  Lists.BulletedList.extend({
    options: {
      HTMLAttributes: {
        className: s.chatText,
      },
    },
  }),
  Lists.NumberedList.extend({
    options: {
      HTMLAttributes: {
        className: s.chatText,
      },
    },
  }),
  Link,
  Code,
];

const MARKS = [Bold, Italic, CodeMark, Strike, Underline];

const SlackChat = () => {
  const editor = useMemo(() => createYooptaEditor(), []);

  useEffect(() => {
    editor.withoutSavingHistory(() => {
      const id = generateId();
      const blockData: YooptaBlockData = Blocks.buildBlockData({ id });
      editor.setEditorValue({ [id]: blockData });
      editor.focusBlock(id);
    });
  }, []);

  return (
    <div id="slack" className={s.root}>
      <div className={s.chat}>
        <div className={s.chatInput}>
          <YooptaEditor
            editor={editor}
            plugins={plugins}
            marks={MARKS}
            className={s.editor}
            placeholder="Job something done"
            selectionBoxRoot={false}
            width="100%">
            <SlackTopToolbar />
          </YooptaEditor>
        </div>
      </div>
    </div>
  );
};

export { SlackChat };
