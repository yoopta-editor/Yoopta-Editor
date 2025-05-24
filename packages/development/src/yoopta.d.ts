import { BaseYooEditor } from '@yoopta/editor';
import { MentionEditor } from '@yoopta/mention';

declare module '@yoopta/editor' {
  interface ExtendYooptaTypes {
    YooEditor: BaseYooEditor & MentionEditor;
  }
}
