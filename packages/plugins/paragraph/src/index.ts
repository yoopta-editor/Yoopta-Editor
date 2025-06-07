import { ParagraphElement } from './types';
import { Paragraph } from './plugin/ParagraphPlugin';
export { ParagraphCommands } from './commands/ParagraphCommands';
import './styles.css';

declare module 'slate' {
  interface CustomTypes {
    Element: ParagraphElement;
  }
}

export default Paragraph;

export { ParagraphElement };
