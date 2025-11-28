import { describe, expect, it, beforeEach } from 'vitest';
import type { YooEditor, SlateElement } from '../types';
import { h, createJSXFactory } from './createElementStructure';
import type { Plugin } from '../../plugins/types';

describe('createElementStructure', () => {
  let mockEditor: Partial<YooEditor>;

  beforeEach(() => {
    mockEditor = {
      plugins: {
        Paragraph: {
          type: 'Paragraph',
          elements: {
            paragraph: {
              props: { nodeType: 'block' },
            },
          },
        } as Plugin<any, any>,
        Accordion: {
          type: 'Accordion',
          elements: {
            'accordion-list': {
              props: { nodeType: 'block' },
              children: ['accordion-list-item'],
            },
            'accordion-list-item': {
              props: { nodeType: 'block', isExpanded: true },
              children: ['accordion-list-item-heading', 'accordion-list-item-content'],
            },
            'accordion-list-item-heading': {
              props: { nodeType: 'block' },
            },
            'accordion-list-item-content': {
              props: { nodeType: 'block' },
            },
          },
        } as Plugin<any, any>,
        HeadingOne: {
          type: 'HeadingOne',
          elements: {
            'heading-one': {
              props: { nodeType: 'block', level: 1 },
            },
          },
        } as Plugin<any, any>,
      },
    } as Partial<YooEditor>;
  });

  describe('basic functionality', () => {
    it('should create a simple element', () => {
      const result = h(mockEditor as YooEditor, 'paragraph');

      expect(result).toMatchObject({
        type: 'paragraph',
        props: { nodeType: 'block' },
        children: [{ text: '' }],
      });
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
    });

    it('should create element with custom props', () => {
      const result = h(mockEditor as YooEditor, 'paragraph', {
        props: { customProp: 'value' },
      });

      expect(result.props).toEqual({
        nodeType: 'block',
        customProp: 'value',
      });
    });

    it('should override default props with custom props', () => {
      const result = h(mockEditor as YooEditor, 'heading-one', {
        props: { level: 2 },
      });

      expect(result.props).toEqual({
        nodeType: 'block',
        level: 2,
      });
    });
  });

  describe('nested structures', () => {
    it('should create nested structure from config', () => {
      const result = h(mockEditor as YooEditor, 'accordion-list');

      expect(result.type).toBe('accordion-list');
      expect(result.children).toHaveLength(1);

      const listItem = result.children[0] as SlateElement;
      expect(listItem.type).toBe('accordion-list-item');
      expect(listItem.props).toMatchObject({ nodeType: 'block', isExpanded: true });
      expect(listItem.children).toHaveLength(2);

      const heading = listItem.children[0] as SlateElement;
      expect(heading.type).toBe('accordion-list-item-heading');
      expect(heading.children).toEqual([{ text: '' }]);

      const content = listItem.children[1] as SlateElement;
      expect(content.type).toBe('accordion-list-item-content');
      expect(content.children).toEqual([{ text: '' }]);
    });

    it('should create nested structure with custom children', () => {
      const paragraphChild = h(mockEditor as YooEditor, 'paragraph');
      const headingChild = h(mockEditor as YooEditor, 'heading-one');

      const result = h(mockEditor as YooEditor, 'accordion-list-item-content', {
        children: [paragraphChild, headingChild],
      });

      expect(result.type).toBe('accordion-list-item-content');
      expect(result.children).toHaveLength(2);
      expect((result.children[0] as SlateElement).type).toBe('paragraph');
      expect((result.children[1] as SlateElement).type).toBe('heading-one');
    });

    it('should create complex nested structure', () => {
      const result = h(mockEditor as YooEditor, 'accordion-list', {
        children: [
          h(mockEditor as YooEditor, 'accordion-list-item', {
            props: { isExpanded: false },
            children: [
              h(mockEditor as YooEditor, 'accordion-list-item-heading'),
              h(mockEditor as YooEditor, 'accordion-list-item-content', {
                children: [
                  h(mockEditor as YooEditor, 'paragraph'),
                  h(mockEditor as YooEditor, 'heading-one'),
                ],
              }),
            ],
          }),
        ],
      });

      expect(result.type).toBe('accordion-list');
      const listItem = result.children[0] as SlateElement;
      expect(listItem.props?.isExpanded).toBe(false);

      const content = listItem.children[1] as SlateElement;
      expect(content.type).toBe('accordion-list-item-content');
      expect(content.children).toHaveLength(2);
    });
  });

  describe('error handling', () => {
    it('should throw error for non-existent element type', () => {
      expect(() => {
        h(mockEditor as YooEditor, 'non-existent-element');
      }).toThrow('Element type "non-existent-element" not found in any plugin');
    });

    it('should handle empty custom children array', () => {
      const result = h(mockEditor as YooEditor, 'paragraph', {
        children: [],
      });

      expect(result.children).toEqual([{ text: '' }]);
    });

    it('should create text node for element with allowedPlugins when children not specified', () => {
      // Add allowedPlugins to accordion-list-item-content
      (mockEditor as any).plugins.Accordion.elements['accordion-list-item-content'].allowedPlugins =
        ['Paragraph', 'HeadingOne'];

      const result = h(mockEditor as YooEditor, 'accordion-list-item-content');

      expect(result.type).toBe('accordion-list-item-content');
      expect(result.children).toEqual([{ text: '' }]);
    });

    it('should use explicit children for element with allowedPlugins when children are specified', () => {
      // Add allowedPlugins to accordion-list-item-content
      (mockEditor as any).plugins.Accordion.elements['accordion-list-item-content'].allowedPlugins =
        ['Paragraph', 'HeadingOne'];

      const paragraph = h(mockEditor as YooEditor, 'paragraph');
      const heading = h(mockEditor as YooEditor, 'heading-one');

      const result = h(mockEditor as YooEditor, 'accordion-list-item-content', {
        children: [paragraph, heading],
      });

      expect(result.type).toBe('accordion-list-item-content');
      expect(result.children).toHaveLength(2);
      expect((result.children[0] as SlateElement).type).toBe('paragraph');
      expect((result.children[1] as SlateElement).type).toBe('heading-one');
    });
  });

  describe('props merging', () => {
    it('should merge default props with custom props', () => {
      const result = h(mockEditor as YooEditor, 'accordion-list-item', {
        props: { customProp: 'test' },
      });

      expect(result.props).toEqual({
        nodeType: 'block',
        isExpanded: true,
        customProp: 'test',
      });
    });

    it('should preserve all default props when no custom props provided', () => {
      const result = h(mockEditor as YooEditor, 'heading-one');

      expect(result.props).toEqual({
        nodeType: 'block',
        level: 1,
      });
    });
  });
});

describe('createJSXFactory', () => {
  let mockEditor: Partial<YooEditor>;
  let h: ReturnType<typeof createJSXFactory>;

  beforeEach(() => {
    mockEditor = {
      plugins: {
        Paragraph: {
          type: 'Paragraph',
          elements: {
            paragraph: {
              props: { nodeType: 'block' },
            },
          },
        } as Plugin<any, any>,
        Accordion: {
          type: 'Accordion',
          elements: {
            'accordion-list': {
              props: { nodeType: 'block' },
              children: ['accordion-list-item'],
            },
            'accordion-list-item': {
              props: { nodeType: 'block', isExpanded: true },
              children: ['accordion-list-item-heading', 'accordion-list-item-content'],
            },
            'accordion-list-item-heading': {
              props: { nodeType: 'block' },
            },
            'accordion-list-item-content': {
              props: { nodeType: 'block' },
            },
          },
        } as Plugin<any, any>,
        HeadingOne: {
          type: 'HeadingOne',
          elements: {
            'heading-one': {
              props: { nodeType: 'block', level: 1 },
            },
          },
        } as Plugin<any, any>,
      },
    } as Partial<YooEditor>;

    h = createJSXFactory(mockEditor as YooEditor);
  });

  describe('JSX compatibility', () => {
    it('should work with JSX-like function calls', () => {
      const result = h('paragraph', null);

      expect(result).toMatchObject({
        type: 'paragraph',
        props: { nodeType: 'block' },
        children: [{ text: '' }],
      });
    });

    it('should handle JSX props', () => {
      const result = h('accordion-list-item', { isExpanded: false });

      expect(result.props).toMatchObject({
        nodeType: 'block',
        isExpanded: false,
      });
    });

    it('should handle JSX children', () => {
      const child1 = h('accordion-list-item-heading', null);
      const child2 = h('accordion-list-item-content', null);
      const result = h('accordion-list-item', null, child1, child2);

      expect(result.children).toHaveLength(2);
      expect((result.children[0] as SlateElement).type).toBe('accordion-list-item-heading');
      expect((result.children[1] as SlateElement).type).toBe('accordion-list-item-content');
    });

    it('should filter out null/undefined children', () => {
      const child1 = h('paragraph', null);
      const result = h('accordion-list-item-content', null, child1, null, undefined);

      expect(result.children).toHaveLength(1);
      expect((result.children[0] as SlateElement).type).toBe('paragraph');
    });

    it('should flatten nested children arrays', () => {
      const child1 = h('paragraph', null);
      const child2 = h('heading-one', null);
      const result = h('accordion-list-item-content', null, [child1, child2]);

      expect(result.children).toHaveLength(2);
    });

    it('should ignore React-specific props (key, ref)', () => {
      const result = h('paragraph', { key: 'test-key', ref: () => {}, customProp: 'value' });

      expect(result.props).toEqual({
        nodeType: 'block',
        customProp: 'value',
      });
      expect(result.props).not.toHaveProperty('key');
      expect(result.props).not.toHaveProperty('ref');
    });

    it('should handle empty props', () => {
      const result = h('paragraph', {});

      expect(result.props).toEqual({
        nodeType: 'block',
      });
    });
  });

  describe('complex JSX structures', () => {
    it('should create nested structure via JSX function calls', () => {
      const result = h(
        'accordion-list',
        null,
        h(
          'accordion-list-item',
          { isExpanded: false },
          h('accordion-list-item-heading', null),
          h('accordion-list-item-content', null, h('paragraph', null), h('heading-one', null)),
        ),
      );

      expect(result.type).toBe('accordion-list');
      const listItem = result.children[0] as SlateElement;
      expect(listItem.type).toBe('accordion-list-item');
      expect(listItem.props?.isExpanded).toBe(false);

      const content = listItem.children[1] as SlateElement;
      expect(content.type).toBe('accordion-list-item-content');
      expect(content.children).toHaveLength(2);
    });
  });
});
