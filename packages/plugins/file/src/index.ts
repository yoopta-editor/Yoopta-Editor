import { File } from './plugin';
import { FileElement, FileElementProps, FileUploadResponse } from './types';

declare module 'slate' {
  type CustomTypes = {
    Element: FileElement;
  };
}

export { FileCommands } from './commands';

export default File;
export { FileElement, FileElementProps, FileUploadResponse };
