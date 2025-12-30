import type { SlateEditor, SlateElement, SlateElementTextNode } from './editor/types';

declare module 'slate' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface CustomTypes {
    Editor: SlateEditor;
    Element: SlateElement;
    Text: SlateElementTextNode;
  }
}
