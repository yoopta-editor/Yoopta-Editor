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

export type ImagePluginOptions = {
  onUpload: (file: File) => Promise<ImageUploadResponse>;
  onError?: (error: any) => void;
  accept?: string;
  optimizations?: ImageOptimizationFields;
  maxSizes?: {
    maxWidth?: number | string;
    maxHeight?: number | string;
  };
};

export type ImageElementMap = {
  image: ImageElement;
};
