import { BaseYooEditor } from '@yoopta/editor';
import { MentionEditor } from './types';

declare module '@yoopta/editor' {
  interface ExtendYooptaTypes {
    YooEditor: BaseYooEditor & MentionEditor;
  }
}
