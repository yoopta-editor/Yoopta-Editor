import { Mention } from './plugin';
import './styles.css';
import { MentionElement, MentionElementProps } from './types';

declare module 'slate' {
  interface CustomTypes {
    Element: MentionElement;
  }
}

export { MentionCommands } from './commands';

export { MentionElement, MentionElementProps };

export default Mention;
