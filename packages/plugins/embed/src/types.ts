import type { SlateElement } from '@yoopta/editor';
import type { RenderElementProps } from 'slate-react';

// Supported embed providers
export type EmbedProviderType =
  | 'youtube'
  | 'vimeo'
  | 'dailymotion'
  | 'wistia'
  | 'loom'
  | 'twitter'
  | 'figma'
  | 'instagram'
  | 'codepen'
  | 'codesandbox'
  | 'spotify'
  | 'soundcloud'
  | 'google-maps'
  | 'unknown';

// Provider metadata from oEmbed or parsing
export type EmbedProviderMeta = {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  authorName?: string;
  authorUrl?: string;
};

// Provider info extracted from URL
export type EmbedProvider = {
  type: EmbedProviderType;
  id: string;
  url: string;
  embedUrl: string;
  meta?: EmbedProviderMeta;
};

// Element sizes
export type EmbedSizes = {
  width: number;
  height: number;
};

// Aspect ratio for providers
export type EmbedAspectRatio = {
  width: number;
  height: number;
};

// Element props
export type EmbedElementProps = {
  provider: EmbedProvider | null;
  sizes: EmbedSizes;
  nodeType: 'void';
};

// Slate element
export type EmbedPluginElements = 'embed';
export type EmbedElement = SlateElement<'embed', EmbedElementProps>;

// Plugin options
export type EmbedPluginOptions = {
  maxWidth?: number;
  defaultSizes?: EmbedSizes;
};

// Provider render props for theme components
export type EmbedProviderRenderProps = {
  provider: EmbedProvider;
  blockId: string;
  width: number;
  height: number;
  isLoading?: boolean;
  error?: string | null;
} & Pick<RenderElementProps, 'attributes' | 'children'>;

// Element map for plugin
export type EmbedElementMap = {
  embed: EmbedElement;
};

// oEmbed response type
export type OEmbedResponse = {
  type: 'video' | 'photo' | 'link' | 'rich';
  version: string;
  title?: string;
  author_name?: string;
  author_url?: string;
  provider_name?: string;
  provider_url?: string;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
  html?: string;
  width?: number;
  height?: number;
};

// Provider config type
export type ProviderConfig = {
  type: EmbedProviderType;
  name: string;
  // Regex patterns to match URLs
  patterns: RegExp[];
  // Function to extract ID from URL
  extractId: (url: string) => string | null;
  // Function to build embed URL from ID
  buildEmbedUrl: (id: string, url: string) => string;
  // Default aspect ratio
  aspectRatio: EmbedAspectRatio;
  // oEmbed endpoint (optional)
  oEmbedUrl?: (url: string) => string;
};
