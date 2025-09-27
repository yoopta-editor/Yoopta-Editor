import { useYooptaEditor } from '@yoopta/editor';
import { ToolbarRenderProps } from '@yoopta/toolbar';
import BoldIcon from './icons/Bold.svg';
import BlockquoteIcon from './icons/Blockquote.svg';
import ItalicIcon from './icons/Italic.svg';
import TitleIcon from './icons/Title.svg';
import LinkIcon from './icons/Link.svg';
import SubtitleIcon from './icons/Subtitle.svg';
import { useRef } from 'react';
import s from './MediumToolbar.module.scss';

const MediumToolbar = (props: ToolbarRenderProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editor = useYooptaEditor();

  return (
    <div>
      <div className={s.root} ref={toolbarRef}>
        <button type="button" className={s.button} onClick={() => editor.formats.bold.toggle()}>
          <span
            style={editor.formats.bold.isActive() ? { color: '#b5e5a4' } : { color: '#fff' }}
            className={s.item}>
            <BoldIcon />
          </span>
        </button>
        <button type="button" className={s.button} onClick={() => editor.formats.italic.toggle()}>
          <span
            style={editor.formats.italic.isActive() ? { color: '#b5e5a4' } : { color: '#fff' }}
            className={s.item}>
            <ItalicIcon />
          </span>
        </button>
        {/* <button type="button" className={s.button} onClick={() => editor.formats.colored.toggle()}>
          <span style={editor.formats.colored.isActive ? { color: '#b5e5a4' } : { color: '#fff' }} className={s.item}>
            <ItalicIcon />
          </span>
        </button> */}
        {/* {hasLinkTool && (
          <button type="button" ref={linkToolButtonRef} className={s.button} onClick={openLinkTool}>
            <span style={marks.code.isActive ? { color: '#b5e5a4' } : { color: '#fff' }} className={s.item}>
              <LinkIcon />
            </span>
          </button>
        )} */}
        <div className={s.separator} />
        <button
          type="button"
          style={editor.blocks.HeadingOne.isActive() ? { color: '#b5e5a4' } : { color: '#fff' }}
          className={s.button}
          onClick={() => editor.toggleBlock('HeadingOne')}>
          <span className={s.item}>
            <TitleIcon />
          </span>
        </button>
        <button
          type="button"
          style={editor.blocks.HeadingTwo.isActive() ? { color: '#b5e5a4' } : { color: '#fff' }}
          className={s.button}
          onClick={() => editor.toggleBlock('HeadingTwo')}>
          <span className={s.item}>
            <SubtitleIcon />
          </span>
        </button>
        <button
          type="button"
          className={s.button}
          style={editor.blocks.Blockquote.isActive() ? { color: '#b5e5a4' } : { color: '#fff' }}
          onClick={() => editor.toggleBlock('Blockquote')}>
          <span className={s.item}>
            <BlockquoteIcon />
          </span>
        </button>
      </div>
    </div>
  );
};

export { MediumToolbar };
