import { Blocks, useYooptaEditor } from '@yoopta/editor';

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

const SlackTopToolbar = () => {
  const editor = useYooptaEditor();
  const isBlockActive = (type: string) => {
    const block = Blocks.getBlock(editor, { at: editor.path.current });
    return block?.type === type;
  };

  return (
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
      <button className={s.toolbarItem} onClick={() => alert('in progress')}>
        <LinkIcon size={15} strokeWidth={1.5} />
      </button>
      <span className={s.separator} />
      <button
        className={s.toolbarItem}
        data-state-active={isBlockActive('NumberedList')}
        onClick={() => editor.toggleBlock('NumberedList')}>
        <ListOrdered size={15} strokeWidth={1.5} />
      </button>
      <button
        className={s.toolbarItem}
        data-state-active={isBlockActive('BulletedList')}
        onClick={() => editor.toggleBlock('BulletedList')}>
        <List size={15} strokeWidth={1.5} />
      </button>
      <span className={s.separator} />
      <button
        className={s.toolbarItem}
        data-state-active={isBlockActive('Blockquote')}
        onClick={() => {
          editor.toggleBlock('Blockquote');
        }}>
        <TextQuoteIcon size={15} strokeWidth={1.5} />
      </button>
      <span className={s.separator} />
      <button className={s.toolbarItem} onClick={() => editor.formats.code.toggle()}>
        <CodeIcon size={15} strokeWidth={1.5} />
      </button>
      <button
        className={s.toolbarItem}
        onClick={() => {
          editor.toggleBlock('Code');
        }}>
        <FileCodeIcon size={15} strokeWidth={1.5} />
      </button>
    </div>
  );
};

export { SlackTopToolbar };
