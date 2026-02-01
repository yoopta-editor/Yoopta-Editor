import { File } from './plugin/file-plugin';

// Types
export type {
  FileElement,
  FileElementMap,
  FileElementProps,
  FilePluginElements,
  FilePluginOptions,
  FileUploadResponse,
  FileUploadFn,
  FileDeleteFn,
  FileUploadEndpointOptions,
  FileDeleteEndpointOptions,
  FileUploadOptions,
  FileDeleteOptions,
  FileUploadProgress,
  FileUploadError,
  FileUploadResult,
  FileUploadState,
  UseFileUploadReturn,
  UseFileDeleteReturn,
  FileType,
  FileTypeConfig,
} from './types';

// Commands
export { FileCommands } from './commands';
export type { FileCommandsType } from './commands';

// Hooks
export { useFileUpload, useFileDelete } from './hooks/use-upload';

// Utils
export {
  getFileType,
  getFileTypeConfig,
  getFileTypeLabel,
  getFileExtension,
  isFileType,
  FILE_TYPE_CONFIGS,
} from './utils/file-type';
export { formatFileSize, parseFileSize } from './utils/format-size';

// Plugin
export default File;
