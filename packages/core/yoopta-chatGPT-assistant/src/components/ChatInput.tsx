import { useEffect, useRef } from 'react';
import autosize from 'autosize';
import FlighIcon from '../icons/flight.svg';
import { Loader } from './Loader';
import { cx, HOTKEYS } from '@yoopta/editor';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import s from './ChatInput.module.scss';

const ChatInput = ({
  value,
  onChange,
  askChatGPT,
  editor,
  loading,
  onClose,
  placeholder,
  selectionRef,
  isMessageListEmpty,
  shouldDeleteText,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeydown = (event) => {
    if (HOTKEYS.isBackspace(event)) {
      if (value.length === 0) {
        if (selectionRef.current) {
          Transforms.select(editor, selectionRef.current);
          Transforms.setSelection(editor, selectionRef.current);
          ReactEditor.focus(editor);
        }
        return onClose();
      }
    }

    if (HOTKEYS.isEscape(event)) {
      if (shouldDeleteText === true) {
        const lastSelection = selectionRef.current!;
        const { offset, path } = lastSelection.anchor;

        Transforms.delete(editor, {
          at: {
            anchor: { path, offset: 0 },
            focus: { path, offset },
          },
        });
      }

      return onClose({ withSelect: false });
    }

    if (HOTKEYS.isEnter(event)) {
      event.preventDefault();
      return askChatGPT();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [value]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      autosize(textareaRef.current);
    }
  }, [textareaRef.current]);

  return (
    <div className={cx(s.root, { [s.loading]: loading, [s.rootIsEmpty]: isMessageListEmpty })}>
      <div className={s.content}>
        <div className={s.body}>
          <textarea
            ref={textareaRef}
            placeholder={placeholder || 'Ask ChatGPT...'}
            value={value}
            onChange={onChange}
            className={s.textarea}
            rows={1}
          />
          <button
            type="button"
            onClick={loading ? undefined : askChatGPT}
            disabled={loading}
            className={s.flight}>
            {loading ? <Loader /> : <FlighIcon color="#fff" fill="#fff" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export { ChatInput };
