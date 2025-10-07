import { Paragraph } from './plugin/ParagraphPlugin';
import { ParagraphElement } from './types';
import './styles.css';

export { ParagraphCommands } from './commands/ParagraphCommands';

declare module 'slate' {
  type CustomTypes = {
    Element: ParagraphElement;
  };
}

export default Paragraph;

export { ParagraphElement };
