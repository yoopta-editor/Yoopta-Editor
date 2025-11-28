import { Link } from './plugin/link-plugin';
import './styles.css';
import { LinkElement, LinkElementProps } from './types';

declare module 'slate' {
  type CustomTypes = {
    Element: LinkElement;
  };
}

export { LinkCommands } from './commands/link-commands';

export { LinkElement, LinkElementProps };

export default Link;
