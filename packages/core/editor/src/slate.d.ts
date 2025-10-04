import type { SlateEditor, SlateElement, SlateElementTextNode } from './editor/types';

declare module 'slate' {
  type CustomTypes = {
    Editor: SlateEditor;
    Element: SlateElement;
    Text: SlateElementTextNode;
  }
}
