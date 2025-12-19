import { Paragraph } from './plugin/paragraph-plugin';
import { ParagraphElement } from './types';

export { ParagraphCommands } from './commands/ParagraphCommands';

declare module 'slate' {
  type CustomTypes = {
    Element: ParagraphElement;
  };
}

export default Paragraph;

export { ParagraphElement };
