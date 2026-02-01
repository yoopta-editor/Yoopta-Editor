import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, Elements, buildBlockData, generateId } from '@yoopta/editor';

import type {
  EmbedElement,
  EmbedElementProps,
  EmbedProvider,
  EmbedProviderMeta,
  EmbedSizes,
} from '../types';
import { extractProviderMeta, fetchOEmbed } from '../utils/oembed';
import {
  calculateEmbedDimensions,
  isEmbedUrl,
  parseEmbedUrl,
} from '../utils/providers';

type EmbedElementOptions = {
  props?: Partial<EmbedElementProps>;
};

type InsertEmbedOptions = EmbedElementOptions & {
  at?: YooptaPathIndex;
  focus?: boolean;
};

type InsertEmbedFromUrlOptions = {
  url: string;
  at?: YooptaPathIndex;
  focus?: boolean;
  fetchMeta?: boolean;
  maxWidth?: number;
};

type UpdateEmbedUrlOptions = {
  blockId: string;
  url: string;
  fetchMeta?: boolean;
  maxWidth?: number;
};

export type EmbedCommandsType = {
  buildEmbedElements: (editor: YooEditor, options?: Partial<EmbedElementOptions>) => EmbedElement;
  insertEmbed: (editor: YooEditor, options?: Partial<InsertEmbedOptions>) => void;
  insertEmbedFromUrl: (editor: YooEditor, options: InsertEmbedFromUrlOptions) => Promise<string | null>;
  deleteEmbed: (editor: YooEditor, blockId: string) => void;
  updateEmbed: (editor: YooEditor, blockId: string, props: Partial<EmbedElementProps>) => void;
  updateEmbedUrl: (editor: YooEditor, options: UpdateEmbedUrlOptions) => Promise<void>;
  updateEmbedSizes: (editor: YooEditor, blockId: string, sizes: EmbedSizes) => void;
  isValidEmbedUrl: (editor: YooEditor, url: string) => boolean;
  parseUrl: (editor: YooEditor, url: string) => EmbedProvider | null;
};

export const EmbedCommands: EmbedCommandsType = {
  buildEmbedElements: (editor: YooEditor, options = {}): EmbedElement => {
    const defaultSizes = { width: 650, height: 400 };

    const embedProps: EmbedElementProps = {
      provider: options.props?.provider ?? null,
      sizes: options.props?.sizes ?? defaultSizes,
      nodeType: 'void',
    };

    return {
      id: generateId(),
      type: 'embed',
      children: [{ text: '' }],
      props: embedProps,
    };
  },

  insertEmbed: (editor: YooEditor, options = {}): void => {
    const { at, focus, props } = options;
    const embed = EmbedCommands.buildEmbedElements(editor, { props });

    const block = buildBlockData({
      value: [embed],
      type: 'Embed',
      meta: { align: 'center', depth: 0 },
    });

    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },

  insertEmbedFromUrl: async (
    editor: YooEditor,
    options: InsertEmbedFromUrlOptions,
  ): Promise<string | null> => {
    const { url, at, focus, fetchMeta = false, maxWidth = 650 } = options;

    const provider = parseEmbedUrl(url);
    if (!provider) {
      console.warn('[Embed] Could not parse URL:', url);
      return null;
    }

    const sizes = calculateEmbedDimensions(provider.type, maxWidth);

    let meta: EmbedProviderMeta | undefined;
    if (fetchMeta) {
      try {
        const oembedData = await fetchOEmbed(url);
        meta = extractProviderMeta(oembedData);
      } catch {
        // Silently fail - metadata is optional
      }
    }

    const providerWithMeta: EmbedProvider = {
      ...provider,
      meta,
    };

    // Build and insert the embed
    const embed = EmbedCommands.buildEmbedElements(editor, {
      props: {
        provider: providerWithMeta,
        sizes,
      },
    });

    const block = buildBlockData({
      value: [embed],
      type: 'Embed',
      meta: { align: 'center', depth: 0 },
    });

    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });

    return block.id;
  },

  /**
   * Delete embed block
   */
  deleteEmbed: (editor: YooEditor, blockId: string): void => {
    Blocks.deleteBlock(editor, { blockId });
  },

  /**
   * Update embed element props
   */
  updateEmbed: (editor: YooEditor, blockId: string, props: Partial<EmbedElementProps>): void => {
    Elements.updateElement(editor, { blockId, type: 'embed', props });
  },

  /**
   * Update embed URL (re-parses and updates provider)
   */
  updateEmbedUrl: async (editor: YooEditor, options: UpdateEmbedUrlOptions): Promise<void> => {
    const { blockId, url, fetchMeta = false, maxWidth = 650 } = options;

    const provider = parseEmbedUrl(url);
    if (!provider) {
      console.warn('[Embed] Could not parse URL:', url);
      return;
    }

    const sizes = calculateEmbedDimensions(provider.type, maxWidth);

    let meta: EmbedProviderMeta | undefined;
    if (fetchMeta) {
      try {
        const oembedData = await fetchOEmbed(url);
        meta = extractProviderMeta(oembedData);
      } catch {
        // Silently fail
      }
    }

    const providerWithMeta: EmbedProvider = {
      ...provider,
      meta,
    };

    EmbedCommands.updateEmbed(editor, blockId, {
      provider: providerWithMeta,
      sizes,
    });
  },

  /**
   * Update embed sizes only
   */
  updateEmbedSizes: (editor: YooEditor, blockId: string, sizes: EmbedSizes): void => {
    EmbedCommands.updateEmbed(editor, blockId, { sizes });
  },

  /**
   * Check if URL is a valid embed URL
   */
  isValidEmbedUrl: (_editor: YooEditor, url: string): boolean => isEmbedUrl(url),

  /**
   * Parse URL and return provider info (utility)
   */
  parseUrl: (_editor: YooEditor, url: string): EmbedProvider | null => parseEmbedUrl(url),
};
