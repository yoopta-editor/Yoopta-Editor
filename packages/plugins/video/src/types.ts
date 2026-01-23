import { type SlateElement } from '@yoopta/editor';

// ============================================================================
// VIDEO ELEMENT TYPES
// ============================================================================

export type VideoSizes = {
  width: number | string;
  height: number | string;
};

export type VideoElementSettings = {
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
};

export type VideoProviderTypes =
  | 'youtube'
  | 'vimeo'
  | 'dailymotion'
  | 'loom'
  | 'wistia'
  | 'custom'
  | string
  | null;

export type VideoProvider = {
  type: VideoProviderTypes;
  id: string;
  url?: string;
};

export type VideoElementProps = {
  id?: string | null;
  src?: string | null;
  srcSet?: string | null;
  bgColor?: string | null;
  settings?: VideoElementSettings;
  sizes?: VideoSizes;
  provider?: VideoProvider;
  fit?: 'contain' | 'cover' | 'fill' | null;
  poster?: string | null;
};

export type VideoPluginElements = 'video';
export type VideoElement = SlateElement<'video', VideoElementProps>;

export type VideoElementMap = {
  video: VideoElement;
};

// ============================================================================
// UPLOAD/DELETE TYPES
// ============================================================================

// Upload response from server/custom function
export type VideoUploadResponse = {
  id?: string;
  src: string;
  poster?: string;
  sizes?: VideoSizes;
  provider?: VideoProvider;
};

// Progress tracking
export type VideoUploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
};

// Error handling
export type VideoUploadError = {
  message: string;
  code?: string;
  status?: number;
};

// Upload result
export type VideoUploadResult = {
  id: string;
  url: string;
  poster?: string;
  width?: number;
  height?: number;
  duration?: number;
  size?: number;
  format?: string;
  provider?: VideoProvider;
  [key: string]: any;
};

// Upload state
export type VideoUploadState = {
  loading: boolean;
  progress: VideoUploadProgress | null;
  error: VideoUploadError | null;
  result: VideoUploadResult | null;
};

// ============================================================================
// CUSTOM FUNCTION TYPES
// ============================================================================

// Custom function type for direct video uploads (Cloudinary, S3, Firebase, Mux, etc.)
export type VideoUploadFn = (
  file: File,
  onProgress?: (progress: VideoUploadProgress) => void,
) => Promise<VideoUploadResponse>;

// Custom function type for direct video deletes
export type VideoDeleteFn = (src: string) => Promise<void>;

// Custom function type for poster upload
export type VideoPosterUploadFn = (
  file: File,
  onProgress?: (progress: VideoUploadProgress) => void,
) => Promise<string>;

// ============================================================================
// ENDPOINT-BASED TYPES
// ============================================================================

// Endpoint-based upload options (for backend API)
export type VideoUploadEndpointOptions = {
  endpoint: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  fieldName?: string;
  maxSize?: number;
  accept?: string;
  onProgress?: (progress: VideoUploadProgress) => void;
  onSuccess?: (result: VideoUploadResult) => void;
  onError?: (error: VideoUploadError) => void;
};

// Endpoint-based delete options (for backend API)
export type VideoDeleteEndpointOptions = {
  endpoint: string;
  method?: 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  fieldName?: string;
  onProgress?: (progress: VideoUploadProgress) => void;
  onSuccess?: (result: VideoUploadResult) => void;
  onError?: (error: VideoUploadError) => void;
};

// Endpoint-based poster upload options
export type VideoPosterUploadEndpointOptions = {
  endpoint: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  fieldName?: string;
  maxSize?: number;
  accept?: string;
  onProgress?: (progress: VideoUploadProgress) => void;
  onSuccess?: (result: VideoUploadResult) => void;
  onError?: (error: VideoUploadError) => void;
};

// ============================================================================
// UNION TYPES FOR OPTIONS
// ============================================================================

// Upload options: endpoint-based OR custom function
export type VideoUploadOptions = VideoUploadEndpointOptions | VideoUploadFn;

// Delete options: endpoint-based OR custom function
export type VideoDeleteOptions = VideoDeleteEndpointOptions | VideoDeleteFn;

// Poster upload options: endpoint-based OR custom function
export type VideoPosterUploadOptions = VideoPosterUploadEndpointOptions | VideoPosterUploadFn;

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

export type UseVideoUploadReturn = {
  upload: (file: File) => Promise<VideoUploadResult>;
  cancel: () => void;
  reset: () => void;
} & VideoUploadState;

export type UseVideoDeleteReturn = {
  deleteVideo: (element: VideoElement) => Promise<VideoUploadResult>;
  cancel: () => void;
  reset: () => void;
} & VideoUploadState;

export type UseVideoPosterUploadReturn = {
  uploadPoster: (file: File) => Promise<string>;
  cancel: () => void;
  reset: () => void;
} & VideoUploadState;

// ============================================================================
// PREVIEW TYPES
// ============================================================================

export type VideoUploadPreview = {
  url: string;
  width?: number;
  height?: number;
  duration?: number;
};

// ============================================================================
// PROVIDER TYPES
// ============================================================================

export type ParsedVideoUrl = {
  provider: VideoProviderTypes;
  id: string;
  originalUrl: string;
  embedUrl: string;
  thumbnailUrl?: string;
  isValid: boolean;
};

export type VideoProviderConfig = {
  name: string;
  patterns: RegExp[];
  getVideoId: (url: string) => string | null;
  getEmbedUrl: (id: string) => string;
  getThumbnailUrl?: (id: string) => string;
};

// ============================================================================
// PLUGIN OPTIONS
// ============================================================================

export type VideoPluginOptions = {
  upload?: VideoUploadOptions;
  delete?: VideoDeleteOptions;
  uploadPoster?: VideoPosterUploadOptions;
  onError?: (error: VideoUploadError) => void;
  accept?: string;
  maxFileSize?: number;
  maxSizes?: {
    maxWidth?: number | string;
    maxHeight?: number | string;
  } | null;
  // Default video settings
  defaultSettings?: VideoElementSettings;
  // Allowed providers (if not set, all providers are allowed)
  allowedProviders?: VideoProviderTypes[];
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
  onProgress?: (progress: VideoUploadProgress) => void;
  onSuccess?: (result: VideoUploadResult) => void;
  onError?: (error: VideoUploadError) => void;
};
