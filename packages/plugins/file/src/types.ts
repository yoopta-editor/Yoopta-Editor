import { type SlateElement } from '@yoopta/editor';

// ============================================================================
// FILE ELEMENT TYPES
// ============================================================================

export type FileElementProps = {
  id?: string | null;
  src: string | null;
  name: string | null;
  size: number | null;
  format?: string | null;
};

export type FilePluginElements = 'file';
export type FileElement = SlateElement<'file', FileElementProps>;

export type FileElementMap = {
  file: FileElement;
};

// ============================================================================
// UPLOAD/DELETE TYPES
// ============================================================================

// Upload response from server/custom function
export type FileUploadResponse = {
  id?: string;
  src: string;
  name?: string;
  size?: number;
  format?: string;
};

// Progress tracking
export type FileUploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
};

// Error handling
export type FileUploadError = {
  message: string;
  code?: string;
  status?: number;
};

// Upload result
export type FileUploadResult = {
  id: string;
  url: string;
  name?: string;
  size?: number;
  format?: string;
  [key: string]: unknown;
};

// Upload state
export type FileUploadState = {
  loading: boolean;
  progress: FileUploadProgress | null;
  error: FileUploadError | null;
  result: FileUploadResult | null;
};

// ============================================================================
// CUSTOM FUNCTION TYPES
// ============================================================================

// Custom function type for direct file uploads (S3, Firebase, Cloudinary, etc.)
export type FileUploadFn = (
  file: File,
  onProgress?: (progress: FileUploadProgress) => void,
) => Promise<FileUploadResponse>;

// Custom function type for direct file deletes
export type FileDeleteFn = (element: FileElement) => Promise<unknown>;

// ============================================================================
// ENDPOINT-BASED TYPES
// ============================================================================

// Endpoint-based upload options (for backend API)
export type FileUploadEndpointOptions = {
  endpoint: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  fieldName?: string;
  maxSize?: number;
  accept?: string;
  onProgress?: (progress: FileUploadProgress) => void;
  onSuccess?: (result: FileUploadResult) => void;
  onError?: (error: FileUploadError) => void;
};

// Endpoint-based delete options (for backend API)
export type FileDeleteEndpointOptions = {
  endpoint: string;
  method?: 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  fieldName?: string;
  onProgress?: (progress: FileUploadProgress) => void;
  onSuccess?: (result: FileUploadResult) => void;
  onError?: (error: FileUploadError) => void;
};

// ============================================================================
// UNION TYPES FOR OPTIONS
// ============================================================================

// Upload options: endpoint-based OR custom function
export type FileUploadOptions = FileUploadEndpointOptions | FileUploadFn;

// Delete options: endpoint-based OR custom function
export type FileDeleteOptions = FileDeleteEndpointOptions | FileDeleteFn;

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

export type UseFileUploadReturn = {
  upload: (file: File) => Promise<FileUploadResult>;
  cancel: () => void;
  reset: () => void;
} & FileUploadState;

export type UseFileDeleteReturn = {
  deleteFile: (element: FileElement) => Promise<unknown>;
  cancel: () => void;
  reset: () => void;
} & FileUploadState;

// ============================================================================
// FILE TYPE/ICON TYPES
// ============================================================================

export type FileType =
  | 'pdf'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'code'
  | 'text'
  | 'unknown';

export type FileTypeConfig = {
  type: FileType;
  extensions: string[];
  mimeTypes: string[];
  label: string;
};

// ============================================================================
// PLUGIN OPTIONS
// ============================================================================

export type FilePluginOptions = {
  upload?: FileUploadOptions;
  delete?: FileDeleteOptions;
  onError?: (error: FileUploadError) => void;
  accept?: string;
  maxFileSize?: number;
};

// ============================================================================
// XHR REQUEST OPTIONS (internal)
// ============================================================================

export type XHRRequestOptions = {
  endpoint: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  fieldName?: string;
  maxSize?: number;
  accept?: string;
  onProgress?: (progress: FileUploadProgress) => void;
  onSuccess?: (result: FileUploadResult) => void;
  onError?: (error: FileUploadError) => void;
};
