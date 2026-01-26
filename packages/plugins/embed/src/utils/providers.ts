import type { EmbedAspectRatio, EmbedProvider, EmbedProviderType, ProviderConfig } from '../types';

// ============================================================================
// Provider Configurations
// ============================================================================

export const PROVIDER_CONFIGS: ProviderConfig[] = [
  // YouTube
  {
    type: 'youtube',
    name: 'YouTube',
    patterns: [
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ],
    extractId: (url: string) => {
      for (const pattern of PROVIDER_CONFIGS[0].patterns) {
        const match = url.match(pattern);
        if (match?.[1]) return match[1];
      }
      return null;
    },
    buildEmbedUrl: (id: string) => `https://www.youtube.com/embed/${id}`,
    aspectRatio: { width: 16, height: 9 },
    oEmbedUrl: (url: string) => `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
  },

  // Vimeo
  {
    type: 'vimeo',
    name: 'Vimeo',
    patterns: [/vimeo\.com\/(\d+)/, /player\.vimeo\.com\/video\/(\d+)/],
    extractId: (url: string) => {
      for (const pattern of PROVIDER_CONFIGS[1].patterns) {
        const match = url.match(pattern);
        if (match?.[1]) return match[1];
      }
      return null;
    },
    buildEmbedUrl: (id: string) => `https://player.vimeo.com/video/${id}`,
    aspectRatio: { width: 16, height: 9 },
    oEmbedUrl: (url: string) => `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
  },

  // Dailymotion
  {
    type: 'dailymotion',
    name: 'Dailymotion',
    patterns: [
      /dailymotion\.com\/video\/([a-zA-Z0-9]+)/,
      /dailymotion\.com\/embed\/video\/([a-zA-Z0-9]+)/,
      /dai\.ly\/([a-zA-Z0-9]+)/,
    ],
    extractId: (url: string) => {
      for (const pattern of PROVIDER_CONFIGS[2].patterns) {
        const match = url.match(pattern);
        if (match?.[1]) return match[1];
      }
      return null;
    },
    buildEmbedUrl: (id: string) => `https://www.dailymotion.com/embed/video/${id}`,
    aspectRatio: { width: 16, height: 9 },
    oEmbedUrl: (url: string) => `https://www.dailymotion.com/services/oembed?url=${encodeURIComponent(url)}&format=json`,
  },

  // Loom
  {
    type: 'loom',
    name: 'Loom',
    patterns: [/loom\.com\/share\/([a-zA-Z0-9]+)/, /loom\.com\/embed\/([a-zA-Z0-9]+)/],
    extractId: (url: string) => {
      for (const pattern of PROVIDER_CONFIGS[3].patterns) {
        const match = url.match(pattern);
        if (match?.[1]) return match[1];
      }
      return null;
    },
    buildEmbedUrl: (id: string) =>
      `https://www.loom.com/embed/${id}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`,
    aspectRatio: { width: 16, height: 9 },
  },

  // Wistia
  {
    type: 'wistia',
    name: 'Wistia',
    patterns: [
      /wistia\.(?:com|net)\/embed\/iframe\/([a-zA-Z0-9]+)/,
      /wistia\.com\/medias\/([a-zA-Z0-9]+)/,
    ],
    extractId: (url: string) => {
      for (const pattern of PROVIDER_CONFIGS[4].patterns) {
        const match = url.match(pattern);
        if (match?.[1]) return match[1];
      }
      return null;
    },
    buildEmbedUrl: (id: string) => `https://fast.wistia.net/embed/iframe/${id}?videoFoam=false`,
    aspectRatio: { width: 16, height: 9 },
  },

  // Twitter/X
  {
    type: 'twitter',
    name: 'Twitter',
    patterns: [
      /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
    ],
    extractId: (url: string) => {
      const match = url.match(/\/status\/(\d+)/);
      return match?.[1] ?? null;
    },
    buildEmbedUrl: (id: string) =>
      `https://platform.twitter.com/embed/Tweet.html?id=${id}&theme=light`,
    aspectRatio: { width: 550, height: 600 }, // Twitter has variable height
  },

  // Instagram
  {
    type: 'instagram',
    name: 'Instagram',
    patterns: [
      /instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/,
    ],
    extractId: (url: string) => {
      const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
      return match?.[1] ?? null;
    },
    buildEmbedUrl: (id: string) => `https://www.instagram.com/p/${id}/embed`,
    aspectRatio: { width: 1, height: 1 }, // Square for Instagram
  },

  // Figma
  {
    type: 'figma',
    name: 'Figma',
    patterns: [
      /figma\.com\/(file|proto|design)\/([a-zA-Z0-9]+)/,
    ],
    extractId: (url: string) => url,
    buildEmbedUrl: (_id: string, url: string) =>
      `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`,
    aspectRatio: { width: 16, height: 9 },
  },

  // CodePen
  {
    type: 'codepen',
    name: 'CodePen',
    patterns: [
      /codepen\.io\/([a-zA-Z0-9_-]+)\/(?:pen|full|details|debug)\/([a-zA-Z0-9]+)/,
    ],
    extractId: (url: string) => {
      const match = url.match(/codepen\.io\/([a-zA-Z0-9_-]+)\/(?:pen|full|details|debug)\/([a-zA-Z0-9]+)/);
      if (match) return `${match[1]}/${match[2]}`;
      return null;
    },
    buildEmbedUrl: (id: string) => {
      const [user, penId] = id.split('/');
      return `https://codepen.io/${user}/embed/${penId}?default-tab=result&theme-id=dark`;
    },
    aspectRatio: { width: 16, height: 9 },
  },

  // CodeSandbox
  {
    type: 'codesandbox',
    name: 'CodeSandbox',
    patterns: [
      /codesandbox\.io\/(?:s|embed)\/([a-zA-Z0-9-]+)/,
    ],
    extractId: (url: string) => {
      const match = url.match(/codesandbox\.io\/(?:s|embed)\/([a-zA-Z0-9-]+)/);
      return match?.[1] ?? null;
    },
    buildEmbedUrl: (id: string) =>
      `https://codesandbox.io/embed/${id}?fontsize=14&hidenavigation=1&theme=dark`,
    aspectRatio: { width: 16, height: 9 },
  },

  // Spotify
  {
    type: 'spotify',
    name: 'Spotify',
    patterns: [
      /open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/,
    ],
    extractId: (url: string) => {
      const match = url.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
      if (match) return `${match[1]}/${match[2]}`;
      return null;
    },
    buildEmbedUrl: (id: string) => `https://open.spotify.com/embed/${id}`,
    aspectRatio: { width: 300, height: 380 }, // Spotify player is more square
  },

  // SoundCloud
  {
    type: 'soundcloud',
    name: 'SoundCloud',
    patterns: [
      /soundcloud\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/,
    ],
    extractId: (url: string) => url,
    buildEmbedUrl: (_id: string, url: string) =>
      `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`,
    aspectRatio: { width: 100, height: 166 }, // SoundCloud is tall and narrow
  },

  // Google Maps
  {
    type: 'google-maps',
    name: 'Google Maps',
    patterns: [
      /google\.com\/maps\/embed/,
      /google\.com\/maps\/place/,
      /google\.com\/maps\/@/,
      /maps\.google\.com/,
    ],
    extractId: (url: string) => url,
    buildEmbedUrl: (_id: string, url: string) => {
      // If it's already an embed URL, return as is
      if (url.includes('/maps/embed')) return url;
      // Otherwise, try to convert to embed format
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d0!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${encodeURIComponent(url)}!5e0!3m2!1sen!2sus!4v0`;
    },
    aspectRatio: { width: 16, height: 9 },
  },
];

// ============================================================================
// Provider Detection & Parsing
// ============================================================================

/**
 * Get provider config by type
 */
export function getProviderConfig(type: EmbedProviderType): ProviderConfig | undefined {
  return PROVIDER_CONFIGS.find((config) => config.type === type);
}

/**
 * Detect provider type from URL
 */
export function detectProvider(url: string): EmbedProviderType {
  const normalizedUrl = url.toLowerCase().trim();

  for (const config of PROVIDER_CONFIGS) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalizedUrl)) {
        return config.type;
      }
    }
  }

  return 'unknown';
}

/**
 * Check if URL is a valid embed URL
 */
export function isEmbedUrl(url: string): boolean {
  return detectProvider(url) !== 'unknown';
}

/**
 * Parse URL and extract provider info
 */
export function parseEmbedUrl(url: string): EmbedProvider | null {
  if (!url) return null;

  try {
    const providerType = detectProvider(url);

    if (providerType === 'unknown') {
      return {
        type: 'unknown',
        id: url,
        url,
        embedUrl: url,
      };
    }

    const config = getProviderConfig(providerType);
    if (!config) return null;

    const id = config.extractId(url);
    if (!id) return null;

    const embedUrl = config.buildEmbedUrl(id, url);

    return {
      type: providerType,
      id,
      url,
      embedUrl,
    };
  } catch {
    return null;
  }
}

/**
 * Get aspect ratio for provider
 */
export function getProviderAspectRatio(type: EmbedProviderType): EmbedAspectRatio {
  const config = getProviderConfig(type);
  return config?.aspectRatio ?? { width: 16, height: 9 };
}

/**
 * Calculate dimensions based on aspect ratio and max width
 */
export function calculateEmbedDimensions(
  type: EmbedProviderType,
  maxWidth: number = 650,
): { width: number; height: number } {
  const aspectRatio = getProviderAspectRatio(type);
  const width = maxWidth;
  const height = Math.round((maxWidth * aspectRatio.height) / aspectRatio.width);

  return { width, height };
}

/**
 * Get oEmbed URL for provider
 */
export function getOEmbedUrl(url: string): string | null {
  const providerType = detectProvider(url);
  const config = getProviderConfig(providerType);

  if (!config?.oEmbedUrl) return null;

  return config.oEmbedUrl(url);
}

/**
 * Get list of supported providers for display
 */
export function getSupportedProviders(): { type: EmbedProviderType; name: string }[] {
  return PROVIDER_CONFIGS.map((config) => ({
    type: config.type,
    name: config.name,
  }));
}

// ============================================================================
// Legacy exports (for backward compatibility)
// ============================================================================

export const getProvider = detectProvider;

export const ProviderGetters: Record<EmbedProviderType, (url: string) => string | null> =
  PROVIDER_CONFIGS.reduce<Record<EmbedProviderType, (url: string) => string | null>>(
    (result, config) => ({
      ...result,
      [config.type]: config.extractId,
    }),
    {} as Record<EmbedProviderType, (url: string) => string | null>,
  );
