import type { SlateElement } from '@yoopta/editor';

import { ActionMenuList } from './components/ActionMenuList';

import './styles.css';

export { DefaultActionMenuRender } from './components/DefaultActionMenuRender';
export { ActionMenuRenderProps, ActionMenuToolProps } from './types';
export { buildActionMenuRenderProps } from './components/utils';

declare module 'slate' {
  type CustomTypes = {
    Element: SlateElement<string>;
  }
}

export default ActionMenuList;
