import { BaseYooEditor } from '@yoopta/editor';
import { MentionEditor } from '@yoopta/mention';
import { YjsYooEditor } from './collaborative/withCollaboration';
import { EditorWithAwareness } from './collaborative/withYjsCursors';
import { EditorWithYjsHistory } from './collaborative/withYjsHistory';

declare module '@yoopta/editor' {
  interface ExtendYooptaTypes {
    YooEditor: BaseYooEditor & MentionEditor & YjsYooEditor;
  }
}
