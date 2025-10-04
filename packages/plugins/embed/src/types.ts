import { type SlateElement } from '@yoopta/editor';
import type { RenderElementProps } from 'slate-react';

export type EmbedSizes = {
  width: number | 'auto';
  height: number | 'auto';
};

export type EmbedProviderTypes =
  | 'youtube'
  | 'vimeo'
  | 'dailymotion'
  | 'wistia'
  | 'loom'
  | 'twitter'
  | 'figma'
  | 'instagram'
  | string
  | null;
export type EmbedProvider = {
  type: EmbedProviderTypes;
  id: string;
  url?: string;
};

export type EmbedElementProps = {
  sizes?: EmbedSizes;
  provider?: EmbedProvider;
};

export type EmbedPluginElements = 'embed';
export type EmbedElement = SlateElement<'embed', EmbedElementProps>;

export type EmbedPluginOptions = {
  maxSizes?: {
    maxWidth?: number | 'auto';
    maxHeight?: number | 'auto';
  };
};

export type ProviderRenderProps = {
  provider: EmbedProvider;
  blockId: string;
  width: number;
  height: number;
} & Pick<RenderElementProps, 'attributes' | 'children'>;

export type EmbedElementMap = {
  embed: EmbedElement;
};
