import { Image } from './plugin/image-plugin';
import { ImageElement, ImageElementProps, ImageUploadResponse } from './types';
import './styles.css';

declare module 'slate' {
  type CustomTypes = {
    Element: ImageElement;
  };
}

export { ImageCommands } from './commands';

export default Image;
export { ImageElement, ImageElementProps, ImageUploadResponse };
