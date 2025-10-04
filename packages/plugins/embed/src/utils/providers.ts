import type { EmbedProviderTypes } from '../types';

export const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const getVimeoId = (url: string) => {
  const vimeoUrl = new URL(url);
  const vimeoEmbedId = vimeoUrl.pathname.split('/')[1];
  return vimeoEmbedId;
};

export const getDailymotionId = (url: string) => {
  const m = url.match(/^.+dailymotion.com\/(embed|hub)\/([^_]+)[^#]*(#embed=([^_&]+))?/);
  if (m !== null) {
    if (m[4] !== undefined) {
      return m[4];
    }
    return m[2];
  }
  return null;
};

export const getWistiaId = (url: string) => {
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

export const getLoomId = (url: string) => {
  try {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?loom\.com\/share\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting Loom ID:', error);
    return null;
  }
};

export function getInstagramId(url: string) {
  const regex = /(?:https?:\/\/)?(?:www\.)?instagram\.com(?:\/p\/|\/reel\/|\/tv\/)([^\/?#&]+).*$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function getProvider(url: string): EmbedProviderTypes | null {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  } if (url.includes('vimeo.com')) {
    return 'vimeo';
  } if (url.includes('dailymotion.com') || url.includes('dai.ly')) {
    return 'dailymotion';
  } if (url.includes('loom.com')) {
    return 'loom';
  } if (url.includes('wistia.com') || url.includes('wistia.net')) {
    return 'wistia';
  } if (url.includes('twitter') || url.includes('https://x.com')) {
    return 'twitter';
  } if (url.includes('figma')) {
    return 'figma';
  } if (url.includes('instagram.com')) {
    return 'instagram';
  } 
    return null;
  
}

export function getTwitterEmbedId(url) {
  const match = url.match(/\/status\/(\d+)/);
  if (match) {
    return match[1];
  }
  return null;
}

export function getFigmaUrl(url) {
  const search = new URL(url).searchParams;
  const nodeId = search.get('node-id');
  if (search.get('node-id')) {
    return nodeId;
  }

  return 'unknown';
}

export const ProviderGetters = {
  youtube: getYoutubeId,
  vimeo: getVimeoId,
  dailymotion: getDailymotionId,
  wistia: getWistiaId,
  loom: getLoomId,
  twitter: getTwitterEmbedId,
  figma: getFigmaUrl,
  instagram: getInstagramId,
};
