import { type SlateElement } from '@yoopta/editor';

export type ImageSizes = {
  width: number | string;
  height: number | string;
};

export type ImageElementProps = {
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
  method?: 'POST' | 'PUT';
  headers?: Record<string, string>;
  fieldName?: string;
  maxSize?: number;
  accept?: string;
  onProgress?: (progress: any) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
};

export type ImagePluginOptions = {
  upload?: ImageUploadOptions;
  maxSizes?: {
    maxWidth?: number | string;
    maxHeight?: number | string;
  } | null;
  optimizations?: ImageOptimizationFields | null;
};

export type ImageElementMap = {
  image: ImageElement;
};
