import React from 'react';
import { describe, expect, it } from 'vitest';

import { getBlockPlugins } from './get-block-plugins';
import type { YooEditor } from '../editor/types';
import type { Plugin, PluginElement } from '../plugins/types';

describe('getBlockPlugins', () => {
  const createMockPlugin = (
    type: string,
    rootElementType: string,
    nodeType: 'block' | 'inline' | 'inlineVoid' | 'void',
  ): Plugin<Record<string, any>, unknown> => {
    const rootElement: PluginElement<string, any> = {
      render: () => React.createElement('div'),
      props: { nodeType },
      asRoot: true,
    };

    return {
      type,
      elements: {
        [rootElementType]: rootElement,
      },
    } as Plugin<Record<string, any>, unknown>;
  };

  it('should return only block plugins, excluding inline plugins', () => {
    const editor: Partial<YooEditor> = {
      plugins: {
        Paragraph: createMockPlugin('Paragraph', 'paragraph', 'block'),
        Heading: createMockPlugin('Heading', 'heading', 'block'),
        Link: createMockPlugin('Link', 'link', 'inline'),
        Mention: createMockPlugin('Mention', 'mention', 'inlineVoid'),
      },
    };

    const result = getBlockPlugins(editor as YooEditor);

    expect(result).toHaveProperty('Paragraph');
    expect(result).toHaveProperty('Heading');
    expect(result).not.toHaveProperty('Link');
    expect(result).not.toHaveProperty('Mention');
    expect(Object.keys(result)).toHaveLength(2);
  });

  it('should include void plugins', () => {
    const editor: Partial<YooEditor> = {
      plugins: {
        Divider: createMockPlugin('Divider', 'divider', 'void'),
        Image: createMockPlugin('Image', 'image', 'void'),
        Paragraph: createMockPlugin('Paragraph', 'paragraph', 'block'),
      },
    };

    const result = getBlockPlugins(editor as YooEditor);

    expect(result).toHaveProperty('Divider');
    expect(result).toHaveProperty('Image');
    expect(result).toHaveProperty('Paragraph');
    expect(Object.keys(result)).toHaveLength(3);
  });

  it('should exclude inline plugins', () => {
    const editor: Partial<YooEditor> = {
      plugins: {
        Link: createMockPlugin('Link', 'link', 'inline'),
        Bold: createMockPlugin('Bold', 'bold', 'inline'),
      },
    };

    const result = getBlockPlugins(editor as YooEditor);

    expect(result).not.toHaveProperty('Link');
    expect(result).not.toHaveProperty('Bold');
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('should exclude inlineVoid plugins', () => {
    const editor: Partial<YooEditor> = {
      plugins: {
        Mention: createMockPlugin('Mention', 'mention', 'inlineVoid'),
        Emoji: createMockPlugin('Emoji', 'emoji', 'inlineVoid'),
      },
    };

    const result = getBlockPlugins(editor as YooEditor);

    expect(result).not.toHaveProperty('Mention');
    expect(result).not.toHaveProperty('Emoji');
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('should return empty object when all plugins are inline', () => {
    const editor: Partial<YooEditor> = {
      plugins: {
        Link: createMockPlugin('Link', 'link', 'inline'),
        Bold: createMockPlugin('Bold', 'bold', 'inline'),
        Italic: createMockPlugin('Italic', 'italic', 'inline'),
      },
    };

    const result = getBlockPlugins(editor as YooEditor);

    expect(result).toEqual({});
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('should return all block plugins when no inline plugins exist', () => {
    const editor: Partial<YooEditor> = {
      plugins: {
        Paragraph: createMockPlugin('Paragraph', 'paragraph', 'block'),
        Heading: createMockPlugin('Heading', 'heading', 'block'),
        Blockquote: createMockPlugin('Blockquote', 'blockquote', 'block'),
        Divider: createMockPlugin('Divider', 'divider', 'void'),
      },
    };

    const result = getBlockPlugins(editor as YooEditor);

    expect(result).toHaveProperty('Paragraph');
    expect(result).toHaveProperty('Heading');
    expect(result).toHaveProperty('Blockquote');
    expect(result).toHaveProperty('Divider');
    expect(Object.keys(result)).toHaveLength(4);
  });

  it('should handle mixed inline and block plugins correctly', () => {
    const editor: Partial<YooEditor> = {
      plugins: {
        Paragraph: createMockPlugin('Paragraph', 'paragraph', 'block'),
        Heading: createMockPlugin('Heading', 'heading', 'block'),
        Link: createMockPlugin('Link', 'link', 'inline'),
        Mention: createMockPlugin('Mention', 'mention', 'inlineVoid'),
        Divider: createMockPlugin('Divider', 'divider', 'void'),
      },
    };

    const result = getBlockPlugins(editor as YooEditor);

    expect(result).toHaveProperty('Paragraph');
    expect(result).toHaveProperty('Heading');
    expect(result).toHaveProperty('Divider');
    expect(result).not.toHaveProperty('Link');
    expect(result).not.toHaveProperty('Mention');
    expect(Object.keys(result)).toHaveLength(3);
  });

  it('should handle plugin with multiple elements correctly', () => {
    const editor: Partial<YooEditor> = {
      plugins: {
        Accordion: {
          type: 'Accordion',
          elements: {
            'accordion-list': {
              render: () => React.createElement('div'),
              props: { nodeType: 'block' },
              asRoot: true,
              children: ['accordion-list-item'],
            },
            'accordion-list-item': {
              render: () => React.createElement('div'),
              props: { nodeType: 'block' },
            },
          },
        } as unknown as Plugin<Record<string, any>, unknown>,
        Link: createMockPlugin('Link', 'link', 'inline'),
      },
    };

    const result = getBlockPlugins(editor as YooEditor);

    expect(result).toHaveProperty('Accordion');
    expect(result).not.toHaveProperty('Link');
    expect(result.Accordion.type).toBe('Accordion');
    expect(result.Accordion.elements).toHaveProperty('accordion-list');
    expect(result.Accordion.elements).toHaveProperty('accordion-list-item');
  });

  it('should handle empty plugins object', () => {
    const editor: Partial<YooEditor> = {
      plugins: {},
    };

    const result = getBlockPlugins(editor as YooEditor);

    expect(result).toEqual({});
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('should preserve plugin structure in result', () => {
    const editor: Partial<YooEditor> = {
      plugins: {
        Paragraph: {
          type: 'Paragraph',
          elements: {
            paragraph: {
              render: () => React.createElement('p'),
              props: { nodeType: 'block' },
              asRoot: true,
            },
          },
          options: {
            display: {
              title: 'Paragraph',
              description: 'A paragraph block',
            },
          },
        } as unknown as Plugin<Record<string, any>, unknown>,
      },
    };

    const result = getBlockPlugins(editor as YooEditor);

    expect(result.Paragraph).toBeDefined();
    expect(result.Paragraph.type).toBe('Paragraph');
    expect(result.Paragraph.elements).toHaveProperty('paragraph');
    expect(result.Paragraph.options?.display?.title).toBe('Paragraph');
    expect(result.Paragraph.options?.display?.description).toBe('A paragraph block');
  });

  it('should handle plugin without root element props', () => {
    const editor: Partial<YooEditor> = {
      plugins: {
        CustomBlock: {
          type: 'CustomBlock',
          elements: {
            custom: {
              render: () => React.createElement('div'),
              asRoot: true,
              // No props defined
            },
          },
        } as unknown as Plugin<Record<string, any>, unknown>,
      },
    };

    const result = getBlockPlugins(editor as YooEditor);

    // Should still include it since nodeType is undefined (not inline or inlineVoid)
    expect(result).toHaveProperty('CustomBlock');
    expect(result.CustomBlock.type).toBe('CustomBlock');
  });

  it('should handle plugin with root element that has nodeType in props', () => {
    const editor: Partial<YooEditor> = {
      plugins: {
        BlockPlugin: {
          type: 'BlockPlugin',
          elements: {
            block: {
              render: () => React.createElement('div'),
              props: { nodeType: 'block', customProp: 'value' },
              asRoot: true,
            },
          },
        } as unknown as Plugin<Record<string, any>, unknown>,
        InlinePlugin: {
          type: 'InlinePlugin',
          elements: {
            inline: {
              render: () => React.createElement('span'),
              props: { nodeType: 'inline' },
              asRoot: true,
            },
          },
        } as unknown as Plugin<Record<string, any>, unknown>,
      },
    };

    const result = getBlockPlugins(editor as YooEditor);

    expect(result).toHaveProperty('BlockPlugin');
    expect(result).not.toHaveProperty('InlinePlugin');
    expect(result.BlockPlugin.elements.block.props?.nodeType).toBe('block');
    expect(result.BlockPlugin.elements.block.props?.customProp).toBe('value');
  });
});
