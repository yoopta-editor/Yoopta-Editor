import { SupporedEmbedProviders } from '../types';

export const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const getVimeoId = (url: string) => {
  const vimeoUrl = new URL(url);
  const vimeoVideoId = vimeoUrl.pathname.split('/')[1];
  return vimeoVideoId;
};

export const getDailymotionId = (url: string) => {
  var m = url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);
  if (m !== null) {
    if (m[4] !== undefined) {
      return m[4];
    }
    return m[2];
  }
  return null;
};

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

export function getProvider(url: string): SupporedEmbedProviders | null {
  if (url.includes('youtube.com')) {
    return 'youtube';
  } else if (url.includes('vimeo.com')) {
    return 'vimeo';
  } else if (url.includes('dailymotion.com')) {
    return 'dailymotion';
  } else if (url.includes('twitter')) {
    return 'twitter';
  } else if (url.includes('figma')) {
    return 'figma';
  } else {
    return null;
  }
}
