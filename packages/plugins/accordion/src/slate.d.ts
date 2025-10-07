import { SlateEditor, SlateElement, SlateElementTextNode } from '@yoopta/editor';

declare module 'slate' {
  type CustomTypes = {
    Editor: SlateEditor;
    Element: SlateElement;
    Text: SlateElementTextNode;
  }
}