import { useEffect, useRef, useState } from 'react';
import { generateId } from '@yoopta/editor';

import type {
  ChatMessage,
  ChatMessageMap,
  OpenAIChatCompletionChunk,
  OpenAIChatMessage} from '../types';
import {
  OpenAIChatRole,
} from '../types';

const textDecoder = new TextDecoder();

type Props = {
  onUpdateMessage: (message: Omit<ChatMessage, 'order'>) => void;
  inputMessage: string;
  messages: ChatMessageMap | null;
};

export const useChatCompletion = ({ onUpdateMessage, inputMessage, messages = {} }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(false);
  const [isStreamingFinished, setIsStreamingFinished] = useState<boolean>(false);
  const [streamingMessage, setStreamingMessage] = useState<string[]>([]);

  useEffect(() => {
    if (isStreamingFinished) {
      setIsStreamingFinished(false);
      setLoading(false);
      setStreamingMessage([]);

      onUpdateMessage({ role: 'assistant', content: streamingMessage.join(''), id: generateId() });
    }
  }, [isStreamingFinished, streamingMessage]);

  function readStream(reader) {
    return reader.read().then(({ done, value }) => {
      if (done) return setIsStreamingFinished(done);

      const decodedData = textDecoder.decode(value as Buffer);
      const lines = decodedData.split(/(\n){2}/);
      const chunks: OpenAIChatCompletionChunk[] = lines
        .map((line) => line.replace(/(\n)?^data:\s*/, '').trim())
        .filter((line) => line !== '' && line !== '[DONE]')
        .map((line) => JSON.parse(line));

      for (const chunk of chunks) {
        const chunkContent: string = (chunk.choices[0].delta.content || '').replace(/^`\s*/, '`');
        setStreamingMessage((prev) => [...prev, chunkContent]);
      }

      return readStream(reader);
    });
  }

  const fetchChatGPT = async () => {
    try {
      setLoading(true);

      const abortController = new AbortController();
      const signal = abortController.signal;

      let GPTMessages: OpenAIChatMessage[] = [{ role: 'user', content: inputMessage }];

      if (messages && Object.keys(messages).length > 0) {
        const orederedMessages = Object.values(messages)
          .sort((a, b) => a.order - b.order)
          .map((message) => ({ content: message.content, role: message.role }));

        GPTMessages = [...orederedMessages, ...GPTMessages];
      }

      onUpdateMessage({ role: 'user', content: inputMessage, id: generateId() });

      const headers = { 'Content-Type': 'application/json' };
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers,
        body: JSON.stringify({ messages: GPTMessages }),
        signal,
      });

      if (!response.ok) {
        throw new Error(`Response error with: ${response.status} - ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response error with empty body');
      }

      const reader = response.body.getReader();
      await readStream(reader);
    } catch (_err) {
      setError(_err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchChatGPT, streamingMessage };
};
