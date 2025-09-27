import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Blockquote from '@yoopta/blockquote';
import Paragraph from '@yoopta/paragraph';
import Image from '@yoopta/image';
import { Bold, Italic, CodeMark, Strike, Underline } from '@yoopta/marks';
import Lists from '@yoopta/lists';
import Link from '@yoopta/link';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import Code from '@yoopta/code';
import { useMemo } from 'react';
import {
  List,
  ListOrdered,
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  LinkIcon,
  TextQuoteIcon,
  CodeIcon,
  FileCodeIcon,
} from 'lucide-react';
import s from './SlackChat.module.scss';

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

  return (
    <div id="slack" className={s.root}>
      <div className={s.chat}>
        <div className={s.toolbar}>
          <button
            className={s.toolbarItem}
            data-state-active={editor.formats.bold?.isActive()}
            onClick={() => editor.formats.bold.toggle()}>
            <BoldIcon size={15} strokeWidth={1.5} />
          </button>
          <button
            className={s.toolbarItem}
            data-state-active={editor.formats.italic?.isActive()}
            onClick={() => editor.formats.italic.toggle()}>
            <ItalicIcon size={15} strokeWidth={1.5} />
          </button>
          <button
            className={s.toolbarItem}
            data-state-active={editor.formats.strike?.isActive()}
            onClick={() => editor.formats.strike.toggle()}>
            <StrikethroughIcon size={15} strokeWidth={1.5} />
          </button>
          <span className={s.separator} />
          <button className={s.toolbarItem}>
            <LinkIcon size={15} strokeWidth={1.5} />
          </button>
          <span className={s.separator} />
          <button
            className={s.toolbarItem}
            data-state-active={editor.blocks.NumberedList?.isActive()}
            onClick={() => editor.toggleBlock('NumberedList', { focus: true })}>
            <ListOrdered size={15} strokeWidth={1.5} />
          </button>
          <button
            className={s.toolbarItem}
            data-state-active={editor.blocks.BulletedList?.isActive()}
            onClick={() => editor.toggleBlock('BulletedList', { focus: true })}>
            <List size={15} strokeWidth={1.5} />
          </button>
          <span className={s.separator} />
          <button
            className={s.toolbarItem}
            data-state-active={editor.blocks.Blockquote?.isActive()}
            onClick={() => editor.toggleBlock('Blockquote', { focus: true })}>
            <TextQuoteIcon size={15} strokeWidth={1.5} />
          </button>
          <span className={s.separator} />
          <button className={s.toolbarItem} onClick={() => editor.formats.code.toggle()}>
            <CodeIcon size={15} strokeWidth={1.5} />
          </button>
          <button
            className={s.toolbarItem}
            onClick={() => editor.toggleBlock('Code', { focus: true })}>
            <FileCodeIcon size={15} strokeWidth={1.5} />
          </button>
        </div>
        <div className={s.inputWrap}>
          <YooptaEditor
            editor={editor}
            plugins={plugins}
            marks={MARKS}
            className={s.editor}
            placeholder="Job something done"
          />
        </div>
      </div>
    </div>
  );
};

export { SlackChat };
