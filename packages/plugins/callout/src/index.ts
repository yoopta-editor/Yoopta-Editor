import { Callout } from './plugin/CalloutPlugin';
import { CalloutElement, CalloutElementProps } from './types';
import './styles.css';

declare module 'slate' {
  type CustomTypes = {
    Element: CalloutElement;
  };
}

export { CalloutCommands } from './commands/CalloutCommands';

export default Callout;
export { CalloutElement, CalloutElementProps };
