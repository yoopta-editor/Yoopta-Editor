import { Divider } from './plugin';
import { DividerElement, DividerElementProps, DividerTheme } from './types';

export { DividerCommands } from './commands';

declare module 'slate' {
  type CustomTypes = {
    Element: DividerElement;
  };
}

export default Divider;

export { DividerElement, DividerElementProps, DividerTheme };
