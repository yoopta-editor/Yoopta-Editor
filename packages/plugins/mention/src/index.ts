import { Mention, withMentions } from './plugin';
import { MentionDropdown } from './ui/MentionDropdown';
import './styles.css';
import { MentionElement, MentionElementProps, MentionEditor } from './types';

export { MentionCommands } from './commands/MentionCommands';

export { MentionElement, MentionElementProps, MentionEditor };
export { withMentions };

export default Mention;
export { MentionDropdown };

declare module 'slate' {
  interface CustomTypes {
    Element: MentionElement;
  }
}
