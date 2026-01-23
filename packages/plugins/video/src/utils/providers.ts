import type { ParsedVideoUrl, VideoProvider, VideoProviderConfig, VideoProviderTypes } from '../types';

// ============================================================================
// PROVIDER ID EXTRACTORS
// ============================================================================

export const getYoutubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const getVimeoId = (url: string): string | null => {
  try {
    const vimeoUrl = new URL(url);
    const pathParts = vimeoUrl.pathname.split('/').filter(Boolean);
    // Handle different Vimeo URL formats
    // Standard: vimeo.com/123456789
    // Player: player.vimeo.com/video/123456789
    // Private: vimeo.com/123456789/abc123
    if (pathParts[0] === 'video') {
      return pathParts[1] || null;
    }
    return pathParts[0] || null;
  } catch {
    return null;
  }
};

export const getDailymotionId = (url: string): string | null => {
  const m = url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);
  if (m !== null) {
    if (m[4] !== undefined) {
      return m[4];
    }
    return m[2];
  }
  // Handle dai.ly short URLs
  const shortMatch = url.match(/dai\.ly\/([a-zA-Z0-9]+)/);
  if (shortMatch) {
    return shortMatch[1];
  }
  return null;
};

export const getWistiaId = (url: string): string | null => {
  try {
    // Handle iframe embed URLs
    const iframeMatch = url.match(
      /(?:https?:\/\/)?(?:fast\.)?wistia\.(?:com|net)\/embed\/iframe\/([a-zA-Z0-9]+)/,
    );
    if (iframeMatch) return iframeMatch[1];

    // Handle medias URLs
    const mediasMatch = url.match(/(?:https?:\/\/)?(?:www\.)?wistia\.com\/medias\/([a-zA-Z0-9]+)/);
    if (mediasMatch) return mediasMatch[1];

    return null;
  } catch (error) {
    console.error('Error extracting Wistia ID:', error);
    return null;
  }
};

export const getLoomId = (url: string): string | null => {
  try {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting Loom ID:', error);
    return null;
  }
};

// ============================================================================
// PROVIDER DETECTION
// ============================================================================

export function getProvider(url: string): VideoProviderTypes | null {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  if (url.includes('dailymotion.com') || url.includes('dai.ly')) {
    return 'dailymotion';
  }
  if (url.includes('loom.com')) {
    return 'loom';
  }
  if (url.includes('wistia.com') || url.includes('wistia.net')) {
    return 'wistia';
  }
  return null;
}

// Map of provider type to ID getter function
export const ProviderGetters: Record<string, (url: string) => string | null> = {
  youtube: getYoutubeId,
  vimeo: getVimeoId,
  dailymotion: getDailymotionId,
  loom: getLoomId,
  wistia: getWistiaId,
};

// ============================================================================
// EMBED URL GENERATORS
// ============================================================================

export const getYoutubeEmbedUrl = (id: string): string => `https://www.youtube.com/embed/${id}`;

export const getVimeoEmbedUrl = (id: string): string => `https://player.vimeo.com/video/${id}`;

export const getDailymotionEmbedUrl = (id: string): string => `https://www.dailymotion.com/embed/video/${id}`;

export const getLoomEmbedUrl = (id: string): string => `https://www.loom.com/embed/${id}`;

export const getWistiaEmbedUrl = (id: string): string => `https://fast.wistia.net/embed/iframe/${id}`;

export const ProviderEmbedUrlGetters: Record<string, (id: string) => string> = {
  youtube: getYoutubeEmbedUrl,
  vimeo: getVimeoEmbedUrl,
  dailymotion: getDailymotionEmbedUrl,
  loom: getLoomEmbedUrl,
  wistia: getWistiaEmbedUrl,
};

export const getEmbedUrl = (provider: VideoProviderTypes, id: string): string | null => {
  if (!provider || !id) return null;
  const getter = ProviderEmbedUrlGetters[provider];
  return getter ? getter(id) : null;
};

// ============================================================================
// THUMBNAIL URL GENERATORS
// ============================================================================

export const getYoutubeThumbnailUrl = (id: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string => {
  const qualityMap = {
    default: 'default',
    hq: 'hqdefault',
    mq: 'mqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault',
  };
  return `https://img.youtube.com/vi/${id}/${qualityMap[quality]}.jpg`;
};

export const getVimeoThumbnailUrl = (id: string): string =>
  // Note: Vimeo requires API call to get thumbnail, this returns a placeholder
  // For actual thumbnail, use Vimeo oEmbed API: https://vimeo.com/api/oembed.json?url=...
  `https://vumbnail.com/${id}.jpg`
  ;

export const getDailymotionThumbnailUrl = (id: string): string => `https://www.dailymotion.com/thumbnail/video/${id}`;

export const getLoomThumbnailUrl = (id: string): string => `https://cdn.loom.com/sessions/thumbnails/${id}-with-play.gif`;

export const getWistiaThumbnailUrl = (id: string): string =>
  // Note: Wistia requires API call to get thumbnail, this returns embed still
  `https://fast.wistia.net/embed/medias/${id}/swatch`
  ;

export const ProviderThumbnailGetters: Record<string, (id: string) => string> = {
  youtube: getYoutubeThumbnailUrl,
  vimeo: getVimeoThumbnailUrl,
  dailymotion: getDailymotionThumbnailUrl,
  loom: getLoomThumbnailUrl,
  wistia: getWistiaThumbnailUrl,
};

export const getThumbnailUrl = (provider: VideoProviderTypes, id: string): string | null => {
  if (!provider || !id) return null;
  const getter = ProviderThumbnailGetters[provider];
  return getter ? getter(id) : null;
};

// ============================================================================
// PROVIDER CONFIGURATIONS
// ============================================================================

export const VIDEO_PROVIDERS: Record<string, VideoProviderConfig> = {
  youtube: {
    name: 'YouTube',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/,
      /(?:https?:\/\/)?youtu\.be\/([^?]+)/,
    ],
    getVideoId: getYoutubeId,
    getEmbedUrl: getYoutubeEmbedUrl,
    getThumbnailUrl: getYoutubeThumbnailUrl,
  },
  vimeo: {
    name: 'Vimeo',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/,
      /(?:https?:\/\/)?player\.vimeo\.com\/video\/(\d+)/,
    ],
    getVideoId: getVimeoId,
    getEmbedUrl: getVimeoEmbedUrl,
    getThumbnailUrl: getVimeoThumbnailUrl,
  },
  dailymotion: {
    name: 'Dailymotion',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/video\/([a-zA-Z0-9]+)/,
      /(?:https?:\/\/)?dai\.ly\/([a-zA-Z0-9]+)/,
    ],
    getVideoId: getDailymotionId,
    getEmbedUrl: getDailymotionEmbedUrl,
    getThumbnailUrl: getDailymotionThumbnailUrl,
  },
  loom: {
    name: 'Loom',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?loom\.com\/share\/([a-zA-Z0-9]+)/,
      /(?:https?:\/\/)?(?:www\.)?loom\.com\/embed\/([a-zA-Z0-9]+)/,
    ],
    getVideoId: getLoomId,
    getEmbedUrl: getLoomEmbedUrl,
    getThumbnailUrl: getLoomThumbnailUrl,
  },
  wistia: {
    name: 'Wistia',
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?wistia\.com\/medias\/([a-zA-Z0-9]+)/,
      /(?:https?:\/\/)?(?:fast\.)?wistia\.(?:com|net)\/embed\/iframe\/([a-zA-Z0-9]+)/,
    ],
    getVideoId: getWistiaId,
    getEmbedUrl: getWistiaEmbedUrl,
    getThumbnailUrl: getWistiaThumbnailUrl,
  },
};

// ============================================================================
// UNIFIED VIDEO URL PARSER
// ============================================================================

/**
 * Parse a video URL and extract provider information, video ID, embed URL, and thumbnail URL.
 * This is the main utility function for handling video URLs from various providers.
 *
 * @param url - The video URL to parse
 * @returns ParsedVideoUrl object with all extracted information
 *
 * @example
 * ```ts
 * const result = parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 * // {
 * //   provider: 'youtube',
 * //   id: 'dQw4w9WgXcQ',
 * //   originalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
 * //   embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 * //   thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
 * //   isValid: true
 * // }
 * ```
 */
export const parseVideoUrl = (url: string): ParsedVideoUrl => {
  const provider = getProvider(url);

  if (!provider) {
    return {
      provider: null,
      id: '',
      originalUrl: url,
      embedUrl: '',
      thumbnailUrl: undefined,
      isValid: false,
    };
  }

  const idGetter = ProviderGetters[provider];
  const id = idGetter ? idGetter(url) : null;

  if (!id) {
    return {
      provider,
      id: '',
      originalUrl: url,
      embedUrl: '',
      thumbnailUrl: undefined,
      isValid: false,
    };
  }

  const embedUrl = getEmbedUrl(provider, id) || '';
  const thumbnailUrl = getThumbnailUrl(provider, id) || undefined;

  return {
    provider,
    id,
    originalUrl: url,
    embedUrl,
    thumbnailUrl,
    isValid: true,
  };
};

/**
 * Check if a URL is a valid video URL from a supported provider.
 *
 * @param url - The URL to validate
 * @returns true if the URL is a valid video URL from a supported provider
 */
export const isValidVideoUrl = (url: string): boolean => {
  const parsed = parseVideoUrl(url);
  return parsed.isValid;
};

/**
 * Check if a URL is from a specific provider.
 *
 * @param url - The URL to check
 * @param provider - The provider to check for
 * @returns true if the URL is from the specified provider
 */
export const isProviderUrl = (url: string, provider: VideoProviderTypes): boolean => {
  const parsed = parseVideoUrl(url);
  return parsed.provider === provider && parsed.isValid;
};

/**
 * Build a VideoProvider object from a URL.
 * This is useful for storing provider information in the video element props.
 *
 * @param url - The video URL
 * @returns VideoProvider object or null if URL is invalid
 */
export const buildVideoProvider = (url: string): VideoProvider | null => {
  const parsed = parseVideoUrl(url);

  if (!parsed.isValid) {
    return null;
  }

  return {
    type: parsed.provider,
    id: parsed.id,
    url: parsed.originalUrl,
  };
};

/**
 * Get all supported provider types.
 *
 * @returns Array of supported provider type strings
 */
export const getSupportedProviders = (): VideoProviderTypes[] => Object.keys(VIDEO_PROVIDERS) as VideoProviderTypes[];

/**
 * Check if a provider type is supported.
 *
 * @param provider - The provider type to check
 * @returns true if the provider is supported
 */
export const isProviderSupported = (provider: VideoProviderTypes): boolean => {
  if (!provider) return false;
  return provider in VIDEO_PROVIDERS;
};
