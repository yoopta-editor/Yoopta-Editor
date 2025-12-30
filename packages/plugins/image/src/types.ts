import { type SlateElement } from '@yoopta/editor';

export type ImageSizes = {
  width: number | string;
  height: number | string;
};

export type ImageElementProps = {
  id: string | null;
  src?: string | null;
  alt?: string | null;
  srcSet?: string | null;
  bgColor?: string | null;
  fit?: 'contain' | 'cover' | 'fill' | null;
  sizes?: ImageSizes;
};

export type ImagePluginElements = 'image';
export type ImageElement = SlateElement<'image', ImageElementProps>;

export type ImageUploadResponse = Omit<ImageElementProps, 'srcSet'>;

export type ImageOptimizationFields = {
  deviceSizes?: number[];
  provider?: 'imgix' | 'cloudinary' | 'akamai';
};

export type ImageUploadOptions = {
  endpoint: string;
  method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  fieldName?: string;
  maxSize?: number;
  accept?: string;
  onProgress?: (progress: any) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
};

export type ImageDeleteOptions = {
  endpoint: string;
  method?: 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  fieldName?: string;
  onProgress?: (progress: any) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
};

export type ImagePluginOptions = {
  upload?: ImageUploadOptions;
  delete?: ImageDeleteOptions;
  maxSizes?: {
    maxWidth?: number | string;
    maxHeight?: number | string;
  } | null;
  optimizations?: ImageOptimizationFields | null;
};

export type ImageElementMap = {
  image: ImageElement;
};

// XHR Request - upload/delete
export type ImageUploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
};

export type UploadError = {
  message: string;
  code?: string;
  status?: number;
};

export type UploadResult = {
  id: string;
  url: string;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
  [key: string]: any;
};

export type UploadState = {
  loading: boolean;
  progress: ImageUploadProgress | null;
  error: UploadError | null;
  result: UploadResult | null;
};

export type UseImageUploadReturn = {
  upload: (file: File) => Promise<UploadResult>;
  cancel: () => void;
  reset: () => void;
} & UploadState;

export type UseImageDeleteReturn = {
  deleteImage: (element: ImageElement) => Promise<UploadResult>;
  cancel: () => void;
  reset: () => void;
} & UploadState;

export type ImageUploadPreview = {
  url: string;
  width?: number;
  height?: number;
};
