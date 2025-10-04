import type { YooEditor } from '@yoopta/editor';

import { ChatGPTAssistant } from './ui/ChatGPT';

declare module 'slate' {
  type CustomTypes = {
    Editor: YooEditor;
  }
}

export default ChatGPTAssistant;
