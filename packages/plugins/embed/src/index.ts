import { Embed } from './plugin';
import { EmbedElement, EmbedElementProps } from './types';

declare module 'slate' {
  type CustomTypes = {
    Element: EmbedElement;
  };
}

export { EmbedCommands } from './commands';

export default Embed;
export { EmbedElement, EmbedElementProps };
