import { type SlateElement } from '@yoopta/editor';

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

export type VideoProviderTypes = 'youtube' | 'vimeo' | 'dailymotion' | 'loom' | 'wistia' | string | null;
export type VideoProvider = {
  type: VideoProviderTypes;
  id: string;
  url?: string;
};

export type VideoElementProps = {
  src?: string | null;
  srcSet?: string | null;
  bgColor?: string | null;
  settings?: VideoElementSettings;
  sizes?: VideoSizes;
  provider?: VideoProvider;
  fit?: 'contain' | 'cover' | 'fill' | null;
  poster?: string;
};

export type VideoPluginElements = 'video';
export type VideoElement = SlateElement<'video', VideoElementProps>;

export type VideoUploadResponse = Omit<VideoElementProps, 'srcSet'>;

export type VideoPluginOptions = {
  onUpload: (file: File) => Promise<VideoUploadResponse>;
  onUploadPoster?: (file: File) => Promise<string>;
  onError?: (error: any) => void;
  accept?: string;
  maxSizes?: {
    maxWidth?: number | string;
    maxHeight?: number | string;
  };
};

export type VideoElementMap = {
  video: VideoElement;
};
