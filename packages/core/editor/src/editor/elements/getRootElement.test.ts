import { describe, it, expect, beforeEach } from 'vitest';

import { getRootElement } from './getRootElement';
import type { YooEditor } from '../types';

describe('getRootElement', () => {
  let editor: Partial<YooEditor>;

  beforeEach(() => {
    editor = {
      plugins: {
        Paragraph: {
          type: 'Paragraph',
          elements: {
            paragraph: {
              render: () => null as any,
              props: { nodeType: 'block' },
            },
          },
        },
        Accordion: {
          type: 'Accordion',
          elements: {
            'accordion-list': {
              render: () => null as any,
              props: { nodeType: 'block' },
              asRoot: true,
              children: ['accordion-list-item'],
            },
            'accordion-list-item': {
              render: () => null as any,
              props: { nodeType: 'block' },
            },
          },
        },
        Image: {
          type: 'Image',
          elements: {
            image: {
              render: () => null as any,
              props: { nodeType: 'void' },
            },
          },
        },
      },
    } as any;
  });

  it('should return the single element as root when plugin has one element', () => {
    const result = getRootElement(editor as YooEditor, { blockType: 'Paragraph' });

    expect(result).toBeDefined();
    expect(result?.props?.nodeType).toBe('block');
  });

  it('should return the element marked with asRoot when plugin has multiple elements', () => {
    const result = getRootElement(editor as YooEditor, { blockType: 'Accordion' });

    expect(result).toBeDefined();
    expect(result?.asRoot).toBe(true);
    expect(result?.children).toContain('accordion-list-item');
  });

  it('should return undefined for non-existent plugin', () => {
    const result = getRootElement(editor as YooEditor, { blockType: 'NonExistent' });

    expect(result).toBeUndefined();
  });

  it('should return undefined when plugin has no elements', () => {
    (editor.plugins as any).Empty = { type: 'Empty' };

    const result = getRootElement(editor as YooEditor, { blockType: 'Empty' });

    expect(result).toBeUndefined();
  });

  it('should return void root element for void plugins', () => {
    const result = getRootElement(editor as YooEditor, { blockType: 'Image' });

    expect(result).toBeDefined();
    expect(result?.props?.nodeType).toBe('void');
  });

  it('should return undefined when multi-element plugin has no asRoot marker', () => {
    (editor.plugins as any).Broken = {
      type: 'Broken',
      elements: {
        'broken-a': { render: () => null, props: { nodeType: 'block' } },
        'broken-b': { render: () => null, props: { nodeType: 'block' } },
      },
    };

    const result = getRootElement(editor as YooEditor, { blockType: 'Broken' });

    expect(result).toBeUndefined();
  });
});
