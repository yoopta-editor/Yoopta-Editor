import { Image } from './plugin/image-plugin';

export {
  ImageElement,
  ImageElementProps,
  ImageUploadResponse,
  ImagePluginOptions,
  ImageUploadOptions,
} from './types';
export {
  useImageUpload,
  useImageDimensions,
  useImagePreview,
  ImageUploadProgress,
  ImageUploadPreview,
} from './hooks';

export { ImageCommands } from './commands';

export default Image;
