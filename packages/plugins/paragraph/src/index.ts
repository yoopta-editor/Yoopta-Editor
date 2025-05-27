import { ParagraphElement } from './types';
import { Paragraph } from './plugin';
export { ParagraphCommands } from './commands';

declare module 'slate' {
  interface CustomTypes {
    Element: ParagraphElement;
  }
}

export default Paragraph;

export { ParagraphElement };
