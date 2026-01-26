import { useCallback, useState } from 'react';

import type { EmbedProvider, EmbedProviderMeta, EmbedSizes } from '../types';
import { extractProviderMeta, fetchOEmbed } from '../utils/oembed';
import { calculateEmbedDimensions, isEmbedUrl, parseEmbedUrl } from '../utils/providers';

export type UseEmbedUrlState = {
  url: string;
  provider: EmbedProvider | null;
  sizes: EmbedSizes;
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
};

export type UseEmbedUrlActions = {
  setUrl: (url: string) => void;
  parseUrl: (url: string) => EmbedProvider | null;
  fetchMeta: () => Promise<EmbedProviderMeta | undefined>;
  reset: () => void;
};

export type UseEmbedUrlReturn = UseEmbedUrlState & UseEmbedUrlActions;

const DEFAULT_STATE: UseEmbedUrlState = {
  url: '',
  provider: null,
  sizes: { width: 650, height: 400 },
  isValid: false,
  isLoading: false,
  error: null,
};

export function useEmbedUrl(maxWidth: number = 650): UseEmbedUrlReturn {
  const [state, setState] = useState<UseEmbedUrlState>(DEFAULT_STATE);

  const setUrl = useCallback(
    (url: string) => {
      const trimmedUrl = url.trim();

      if (!trimmedUrl) {
        setState(DEFAULT_STATE);
        return;
      }

      const isValid = isEmbedUrl(trimmedUrl);
      const provider = parseEmbedUrl(trimmedUrl);

      let sizes = { width: maxWidth, height: 400 };
      if (provider) {
        sizes = calculateEmbedDimensions(provider.type, maxWidth);
      }

      setState({
        url: trimmedUrl,
        provider,
        sizes,
        isValid,
        isLoading: false,
        error: isValid ? null : 'Unsupported URL format',
      });
    },
    [maxWidth],
  );

  const parseUrl = useCallback((url: string): EmbedProvider | null => {
    return parseEmbedUrl(url);
  }, []);

  const fetchMeta = useCallback(async (): Promise<EmbedProviderMeta | undefined> => {
    if (!state.url || !state.isValid) {
      return undefined;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const oembedData = await fetchOEmbed(state.url);
      const meta = extractProviderMeta(oembedData);

      if (meta && state.provider) {
        setState((prev) => ({
          ...prev,
          provider: prev.provider ? { ...prev.provider, meta } : null,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }

      return meta;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch metadata',
      }));
      return undefined;
    }
  }, [state.url, state.isValid, state.provider]);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return {
    ...state,
    setUrl,
    parseUrl,
    fetchMeta,
    reset,
  };
}

