import type { SlateElement } from '@yoopta/editor';

import { LinkTool } from './components/LinkTool';

import './styles.css';

export { DefaultLinkToolRender } from './components/DefaultLinkToolRender';

declare module 'slate' {
  type CustomTypes = {
    Element: SlateElement<string>;
  }
}

export default LinkTool;
