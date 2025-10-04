import { Video } from './plugin';
import { VideoElement, VideoElementProps, VideoUploadResponse } from './types';
import './styles.css';

declare module 'slate' {
  type CustomTypes = {
    Element: VideoElement;
  }
}

export { VideoCommands } from './commands';

export default Video;
export { VideoElement, VideoElementProps, VideoUploadResponse };
