import { cx, useNodeElementSettings, YooptaBaseElement } from '@yoopta/editor';
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { Editor, Element, Path, Point, Selection, Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { Actions } from '../components/Actions';
import { ChatInput } from '../components/ChatInput';
import { ChatMessages } from '../components/ChatMessages';
import { useChatActions } from '../hooks/useChatActions';
import { useChatCompletion } from '../hooks/useChatCompletion';
import { useChatMessages } from '../hooks/useChatMessages';
import { ChatMessage, OpenAIChatMessage, Action } from '../types';
import s from './ChatGPT.module.scss';

type MenuProps = { fixedStyle: CSSProperties; absoluteStyle: CSSProperties; point: Point | null };

const getDefaultMenuPropsState = (style?: CSSProperties): MenuProps => ({
  fixedStyle: { position: 'static', opacity: 0, zIndex: 6, left: -1000, bottom: -1000, ...style },
  absoluteStyle: { left: 0, bottom: 0, top: 'auto', right: 'auto' },
  point: null,
});

// [TODO] - check for window.getSelection()
export function getRectByCurrentSelection(): DOMRect {
  const domSelection = window.getSelection();
  const domRange = domSelection!.getRangeAt(0);
  const rect = domRange.getBoundingClientRect();

  return rect;
}

const checkIsChatGPTOpen = (style: CSSProperties) => style.opacity === 1;
// const checkIsChatGPTOpen = (style: CSSProperties) => style.opacity === 1 && !!style.top && !!style.right;

type ChatGPTAssistantProps = {
  // trigger?: string;
  API_URL?: string;
  placeholder?: string;
  context?: OpenAIChatMessage[] | null;
  actions?: Action[] | null;
  [x: string]: any;
};

function parseCodeBlocks(text) {
  const codeBlocks = text.match(/```[^`]*```/g);
  return codeBlocks ? codeBlocks.map((block) => block.replace(/```/g, '')) : [];
}

const TRIGGER = '?';

const ChatGPTAssistant = ({
  API_URL = '',
  placeholder,
  context,
  fromHook,
  options = {},
  actions: baseActions = null,
  ...rest
}: ChatGPTAssistantProps) => {
  const editor = useSlate();
  const [, { changeSelectedNodeElement }] = useNodeElementSettings();
  const [inputMessage, setInputMessage] = useState('');
  const selectionRef = useRef<Selection | null>(rest?.selection || null);

  const [menuProps, setMenuProps] = useState<MenuProps>(() =>
    getDefaultMenuPropsState(rest?.style),
  );
  const chatContentRef = useRef<HTMLDivElement>(null);

  const lastSelectionRef = fromHook ? { current: rest?.selection } : selectionRef;

  const { actions, updateActions } = useChatActions({ actions: baseActions });
  const { messages, updateMessage } = useChatMessages({ context });
  const { loading, fetchChatGPT, streamingMessage, error } = useChatCompletion({
    onUpdateMessage: updateMessage,
    inputMessage,
    messages,
  });

  const showChatGPT = () => {
    if (!editor.selection) return;

    const selectionRect = getRectByCurrentSelection();
    const actionMenuHeight = chatContentRef.current!.clientHeight;

    const showAtTop =
      selectionRect.top + selectionRect.height + actionMenuHeight > window.innerHeight;

    const parentPath = Path.parent(editor.selection.anchor.path);
    const [node] = Editor.node(editor, parentPath) || [];

    if (node) changeSelectedNodeElement(node as YooptaBaseElement<string>);

    selectionRef.current = editor.selection;

    const absoluteStyle = showAtTop
      ? { bottom: 5, right: 'auto', left: 0, top: 0 }
      : { bottom: 'auto', right: 'auto', left: 0, top: 0 };

    setMenuProps({
      absoluteStyle,
      fixedStyle: {
        ...menuProps.fixedStyle,
        left: 0,
        top: document.documentElement.scrollTop + selectionRect.top - selectionRect.height - 10,
        right: 'auto',
        bottom: 'auto',
        opacity: 1,
        position: 'relative',
      },
      point: { path: parentPath, offset: editor.selection.anchor.offset },
    });
  };

  const hideChatGPT = ({ withSelect = true } = {}) => {
    setMenuProps(getDefaultMenuPropsState(rest?.style));
    setInputMessage('');

    if (selectionRef.current) {
      ReactEditor.focus(editor);
    }

    selectionRef.current = null;
  };

  const isChatGPTOpen = checkIsChatGPTOpen(menuProps.fixedStyle);

  const handleKeyup = (event) => {
    if (!editor.selection) return;
    event.preventDefault();

    const parentPath = Path.parent(editor.selection.anchor.path);
    const string = Editor.string(editor, parentPath);

    if (!isChatGPTOpen && string?.trim() === TRIGGER) {
      event.preventDefault();
      return showChatGPT();
    }
  };

  useEffect(() => {
    if (!isChatGPTOpen) return;

    if (!editor.selection || !menuProps.point) return hideChatGPT();

    const parentPath: Path = Path.parent(editor.selection.anchor.path);
    const selectionPoint: Point = { path: parentPath, offset: editor.selection.anchor.offset };

    if (
      !Path.equals(selectionPoint.path, menuProps.point.path) ||
      Point.isBefore(selectionPoint, menuProps.point)
    ) {
      hideChatGPT();
    }
  }, [editor.selection, menuProps.point]);

  useEffect(() => {
    const contentEditor = document.querySelector('#yoopta-contenteditable');
    contentEditor?.addEventListener('keyup', handleKeyup);

    if (isChatGPTOpen) {
      chatContentRef.current?.scrollTo(0, chatContentRef.current?.scrollHeight);
    }

    return () => {
      contentEditor?.removeEventListener('keyup', handleKeyup);
    };
  }, [editor, isChatGPTOpen]);

  const askChatGPT = () => {
    if (loading || inputMessage.trim() === '') return;

    setInputMessage('');
    fetchChatGPT();
  };

  const orderedMessagIds = useMemo(() => {
    if (!messages) return [];

    return Object.keys(messages)
      .sort((keyA, keyB) => messages[keyA].order - messages[keyB].order)
      .filter((messageId) => !messages?.[messageId].fromContext);
  }, [messages]);

  const removeTriggerKey = () => {
    if (options.shouldDeleteText === false) return;

    const lastSelection = selectionRef.current;
    if (!lastSelection) return;

    const { offset, path } = lastSelection.anchor;

    Transforms.delete(editor, {
      at: {
        anchor: { path, offset: 0 },
        focus: { path, offset },
      },
    });
  };

  const pasteContentBelow = (message: ChatMessage) => {
    const lastSelection = lastSelectionRef.current;
    if (!lastSelection) return null;

    const [node] =
      Editor.above(editor, { at: lastSelection, match: (n) => Element.isElement(n) }) || [];
    const { anchor, focus } = lastSelection;
    const string = Editor.string(editor, anchor.path);

    const fromTrigger = string.trim() === TRIGGER;

    if (fromTrigger) {
      Transforms.delete(editor, { at: anchor.path, unit: 'block' });
    }

    const nodeText = fromTrigger ? message.content : ` ${message.content}`;
    Transforms.insertText(editor, nodeText, { at: { path: focus.path, offset: focus.offset } });

    // if (node) {
    //   changeSelectedNodeElement(node as YooptaBaseElement<string>);
    // }

    Transforms.select(editor, {
      anchor: { ...anchor, offset: 0 },
      focus: { path: focus.path, offset: message.content.length },
    });

    hideChatGPT();
  };

  const replaceContent = (message: ChatMessage) => {
    const lastSelection = lastSelectionRef.current;
    if (!lastSelection) return null;

    const { anchor, focus } = lastSelection;
    const [node] =
      Editor.above(editor, { at: lastSelection, match: (n) => Element.isElement(n) }) || [];

    Transforms.delete(editor, { at: anchor.path, unit: 'block' });
    Transforms.insertText(editor, message.content, {
      at: { path: focus.path, offset: focus.offset },
    });

    // if (node) {
    //   changeSelectedNodeElement(node as YooptaBaseElement<string>);
    // }

    Transforms.select(editor, {
      anchor: { ...anchor, offset: 0 },
      focus: { path: focus.path, offset: message.content.length },
    });

    hideChatGPT();
  };

  const handleAction = (action: Action) => {
    setInputMessage(action.name);
  };

  const hasActions = Array.isArray(actions) && actions.length > 0;

  const onChangeMessageInput = (event) => {
    const input = event.target.value;
    updateActions(input);
    setInputMessage(input);
  };

  const isMessageListEmpty = orderedMessagIds.length === 0;

  return (
    <div role={'dialog'} aria-modal className={s.root} style={menuProps.fixedStyle}>
      <div className={s.relative}>
        <div className={s.absolute} style={menuProps.absoluteStyle}>
          <div ref={chatContentRef} className={cx(s.chatContent, 'yoopta-chatGPT')}>
            {isChatGPTOpen && (
              <>
                <ChatMessages
                  messageIds={orderedMessagIds}
                  streamingMessage={streamingMessage}
                  messages={messages}
                  replaceContent={replaceContent}
                  pasteContentBelow={pasteContentBelow}
                />
                <ChatInput
                  value={inputMessage}
                  onChange={onChangeMessageInput}
                  askChatGPT={askChatGPT}
                  loading={loading}
                  onClose={hideChatGPT}
                  placeholder={placeholder}
                  isMessageListEmpty={isMessageListEmpty}
                  selectionRef={lastSelectionRef}
                  editor={editor}
                  shouldDeleteText={options.shouldDeleteText}
                />
                {hasActions && <Actions actions={actions} onAction={handleAction} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ChatGPTAssistant.displayName = 'ChatGPTAssistant';

export { ChatGPTAssistant };
