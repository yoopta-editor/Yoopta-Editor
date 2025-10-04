import { useState } from 'react';
import { generateId } from '@yoopta/editor';

import type { ChatMessage, ChatMessageMap, OpenAIChatMessage } from '../types';

type Props = {
  context?: OpenAIChatMessage[] | null;
};

export const useChatMessages = ({ context }: Props) => {
  const getDefaultMessages = () => {
    if (!Array.isArray(context)) return {};
    if (context.length === 0) return {};

    const messageMap = {};

    context.forEach((msg, i) => {
      const id = generateId();
      // messageMap[id] = { ...msg, id, fromContext: false, order: i };
      messageMap[id] = { ...msg, id, fromContext: true, order: i };
    });

    return messageMap;
  };

  const [messages, setMessages] = useState<ChatMessageMap | null>(() => getDefaultMessages());

  const addMessage = (message: Omit<ChatMessage, 'order'>) =>
    setMessages((prevMsgs) => ({
      ...prevMsgs,
      [message.id]: { ...message, order: Object.keys(prevMsgs || {}).length },
    }));

  return { messages, updateMessage: addMessage };
};
