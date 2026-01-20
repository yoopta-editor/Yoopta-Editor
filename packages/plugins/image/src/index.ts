import { Image } from './plugin/image-plugin';

export {
  ImageElement,
  ImageElementProps,
  ImageUploadResponse,
  ImagePluginOptions,
  ImageUploadOptions,
  ImageDeleteOptions,
  ImageUploadFn,
  ImageDeleteFn,
  ImageUploadEndpointOptions,
  ImageDeleteEndpointOptions,
  ImageUploadPreview,
  UseImageDeleteReturn,
  UseImageUploadReturn,
  ImageUploadProgress,
} from './types';
export {
  useImageUpload,
  useImageDelete,
  useImageDimensions,
  useImagePreview,
} from './hooks/use-upload';

export { ImageCommands } from './commands';

export default Image;
