import type { EmbedProviderMeta, OEmbedResponse } from '../types';
import { getOEmbedUrl } from './providers';

/**
 * Fetch oEmbed data for a URL
 * Note: This requires CORS support or a proxy for most providers
 */
export async function fetchOEmbed(url: string): Promise<OEmbedResponse | null> {
  const oEmbedUrl = getOEmbedUrl(url);

  if (!oEmbedUrl) {
    return null;
  }

  try {
    const response = await fetch(oEmbedUrl);

    if (!response.ok) {
      return null;
    }

    const data: OEmbedResponse = await response.json();
    return data;
  } catch {
    // oEmbed often fails due to CORS, this is expected
    return null;
  }
}

/**
 * Extract provider metadata from oEmbed response
 */
export function extractProviderMeta(oembedData: OEmbedResponse | null): EmbedProviderMeta | undefined {
  if (!oembedData) return undefined;

  return {
    title: oembedData.title,
    description: undefined, // oEmbed doesn't usually include description
    thumbnailUrl: oembedData.thumbnail_url,
    authorName: oembedData.author_name,
    authorUrl: oembedData.author_url,
  };
}

/**
 * Fetch oEmbed data via a proxy (for production use)
 * You can implement your own proxy endpoint
 */
export async function fetchOEmbedViaProxy(
  url: string,
  proxyUrl: string,
): Promise<OEmbedResponse | null> {
  try {
    const response = await fetch(`${proxyUrl}?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

