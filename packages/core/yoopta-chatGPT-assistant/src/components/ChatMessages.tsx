import { cx } from '@yoopta/editor';
import { useEffect, useRef } from 'react';
import AddIcon from '../icons/add.svg';
import ReplaceIcon from '../icons/replace.svg';
import { ChatMessage, ChatMessageMap } from '../types';
import s from './ChatMessages.module.scss';

type Props = {
  messageIds: string[];
  streamingMessage: string[];
  messages: ChatMessageMap | null;
  pasteContentBelow: (message: ChatMessage) => void;
  replaceContent: (message: ChatMessage) => void;
};

const ChatMessages = ({
  messageIds,
  streamingMessage,
  messages,
  pasteContentBelow,
  replaceContent,
}: Props) => {
  const streamingMessageRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (streamingMessageRef.current && streamingMessage.length > 0) {
  //     streamingMessageRef.current.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'end' });
  //   }
  // }, [streamingMessage, streamingMessageRef.current]);

  if (messageIds.length === 0 && streamingMessage.length === 0) return null;

  return (
    <div className={s.messages}>
      {messageIds.length > 0 &&
        messageIds.map((messageId) => {
          const message = messages?.[messageId];
          if (!message) return null;
          if (message.fromContext) return null;

          const isUserMessage = message.role === 'user';
          const isAssistantMessage = message.role === 'assistant';

          return (
            <div
              key={message.id}
              className={cx(s.chatMessage, {
                [s.chatMessageAssistant]: isAssistantMessage,
                [s.chatMessageUser]: isUserMessage,
              })}>
              <div className={s.chatMessageWrap}>
                <div className={s.chatMessageContent}>{message.content}</div>
              </div>
              {isAssistantMessage && (
                <div className={s.buttons}>
                  <button
                    type="button"
                    className={s.buttonIcon}
                    title="Paste content below"
                    onClick={() => pasteContentBelow(message)}>
                    <AddIcon width={17} height={17} />
                  </button>
                  <button
                    type="button"
                    className={s.buttonIcon}
                    title="Replace content in block"
                    onClick={() => replaceContent(message)}>
                    <ReplaceIcon width={17} height={17} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      {streamingMessage.length > 0 && (
        <div
          className={cx(s.chatMessage, {
            [s.chatMessageAssistant]: true,
          })}
          ref={streamingMessageRef}>
          <div className={s.chatMessageWrap}>
            <div className={s.chatMessageContent}>{streamingMessage.join('')}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ChatMessages };
