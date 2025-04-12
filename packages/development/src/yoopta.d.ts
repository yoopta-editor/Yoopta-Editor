import { YooEditor } from '@yoopta/editor';
import { I18nYooEditor } from '@yoopta/i18n';

declare module '@yoopta/editor' {
  interface CustomTypes {
    Editor: YooEditor & I18nYooEditor;
  }
}
