import type { FileType, FileTypeConfig } from '../types';

// File type configurations
export const FILE_TYPE_CONFIGS: FileTypeConfig[] = [
  {
    type: 'pdf',
    extensions: ['.pdf'],
    mimeTypes: ['application/pdf'],
    label: 'PDF',
  },
  {
    type: 'document',
    extensions: ['.doc', '.docx', '.odt', '.rtf', '.pages'],
    mimeTypes: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text',
      'application/rtf',
      'application/x-iwork-pages-sffpages',
    ],
    label: 'Document',
  },
  {
    type: 'spreadsheet',
    extensions: ['.xls', '.xlsx', '.csv', '.ods', '.numbers'],
    mimeTypes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/x-iwork-numbers-sffnumbers',
    ],
    label: 'Spreadsheet',
  },
  {
    type: 'presentation',
    extensions: ['.ppt', '.pptx', '.odp', '.key'],
    mimeTypes: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.oasis.opendocument.presentation',
      'application/x-iwork-keynote-sffkey',
    ],
    label: 'Presentation',
  },
  {
    type: 'image',
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico', '.tiff'],
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'image/x-icon',
      'image/tiff',
    ],
    label: 'Image',
  },
  {
    type: 'video',
    extensions: ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.wmv', '.flv'],
    mimeTypes: [
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-matroska',
      'video/x-ms-wmv',
      'video/x-flv',
    ],
    label: 'Video',
  },
  {
    type: 'audio',
    extensions: ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma'],
    mimeTypes: [
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/flac',
      'audio/aac',
      'audio/mp4',
      'audio/x-ms-wma',
    ],
    label: 'Audio',
  },
  {
    type: 'archive',
    extensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
    mimeTypes: [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/gzip',
      'application/x-bzip2',
    ],
    label: 'Archive',
  },
  {
    type: 'code',
    extensions: [
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.html',
      '.css',
      '.json',
      '.xml',
      '.py',
      '.java',
      '.c',
      '.cpp',
      '.h',
      '.rb',
      '.php',
      '.go',
      '.rs',
      '.swift',
      '.kt',
    ],
    mimeTypes: [
      'text/javascript',
      'application/javascript',
      'text/typescript',
      'text/html',
      'text/css',
      'application/json',
      'application/xml',
      'text/x-python',
      'text/x-java-source',
      'text/x-c',
      'text/x-c++',
    ],
    label: 'Code',
  },
  {
    type: 'text',
    extensions: ['.txt', '.md', '.log', '.ini', '.cfg'],
    mimeTypes: ['text/plain', 'text/markdown'],
    label: 'Text',
  },
];

/**
 * Detect file type from filename or MIME type
 */
export const getFileType = (filename?: string | null, mimeType?: string | null): FileType => {
  if (!filename && !mimeType) return 'unknown';

  const extension = filename ? `.${filename.split('.').pop()?.toLowerCase()}` : null;

  for (const config of FILE_TYPE_CONFIGS) {
    // Check by extension first (more reliable)
    if (extension && config.extensions.includes(extension)) {
      return config.type;
    }
    // Fallback to MIME type
    if (mimeType && config.mimeTypes.includes(mimeType)) {
      return config.type;
    }
  }

  return 'unknown';
};

/**
 * Get file type configuration
 */
export const getFileTypeConfig = (fileType: FileType): FileTypeConfig | undefined =>
  FILE_TYPE_CONFIGS.find((config) => config.type === fileType);

/**
 * Get file type label
 */
export const getFileTypeLabel = (filename?: string | null, mimeType?: string | null): string => {
  const fileType = getFileType(filename, mimeType);
  const config = getFileTypeConfig(fileType);
  return config?.label ?? 'File';
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename?: string | null): string | null => {
  if (!filename) return null;
  const parts = filename.split('.');
  if (parts.length < 2) return null;
  return parts.pop()?.toLowerCase() ?? null;
};

/**
 * Check if file is of a specific type
 */
export const isFileType = (
  fileType: FileType,
  filename?: string | null,
  mimeType?: string | null,
): boolean => getFileType(filename, mimeType) === fileType;
