import { Blockquote } from './plugin/BlockquotePlugin';
import { BlockquoteElement } from './types';
import './styles.css';

declare module 'slate' {
  type CustomTypes = {
    Element: BlockquoteElement;
  };
}

export { BlockquoteCommands } from './commands/BlockquoteCommands';

export default Blockquote;
export { BlockquoteElement };
