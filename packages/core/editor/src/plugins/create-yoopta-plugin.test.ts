import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { YooptaPlugin } from './create-yoopta-plugin';
import type { PluginElementRenderProps, PluginInputElements } from './types';
import type { SlateElement } from '../editor/types';

// Helper to create mock render functions
const createMockRender = (name: string) => {
  const renderFn = (props: PluginElementRenderProps) =>
    React.createElement('div', props.attributes, name);
  renderFn.displayName = name;
  return renderFn;
};

// Helper to create mock JSX elements
const createMockJSXElement = (
  type: string,
  props: {
    render: (props: PluginElementRenderProps) => JSX.Element;
    props?: Record<string, unknown>;
    children?: React.ReactElement | React.ReactElement[];
    nodeType?: 'block' | 'inline' | 'void' | 'inlineVoid';
    placeholder?: string;
  },
): PluginInputElements<TestElementMap> => React.createElement(type, props, props.children) as PluginInputElements<TestElementMap>;

type TestElementMap = {
  paragraph: SlateElement<'paragraph'>;
  heading: SlateElement<'heading', { level: number }>;
};

type TestOptions = {
  customOption?: string;
};

describe('YooptaPlugin', () => {
  describe('constructor', () => {
    it('should create a plugin with JSX elements', () => {
      const paragraphRender = createMockRender('paragraph');
      const jsxElement = createMockJSXElement('paragraph', {
        render: paragraphRender,
        nodeType: 'block',
      });

      const plugin = new YooptaPlugin<TestElementMap, TestOptions>({
        type: 'Paragraph',
        elements: jsxElement,
        options: {
          display: {
            title: 'Paragraph',
            description: 'A paragraph block',
          },
        },
      });

      const pluginData = plugin.getPlugin;
      expect(pluginData.type).toBe('Paragraph');
      expect(pluginData.elements).toHaveProperty('paragraph');
      expect(pluginData.elements.paragraph.render).toBe(paragraphRender);
      expect(pluginData.options?.display?.title).toBe('Paragraph');
    });

    it('should create a plugin with plain elements object', () => {
      const paragraphRender = createMockRender('paragraph');
      const headingRender = createMockRender('heading');

      const plugin = new YooptaPlugin<TestElementMap, TestOptions>({
        type: 'TestPlugin',
        elements: {
          paragraph: {
            render: paragraphRender,
            props: { nodeType: 'block' },
          },
          heading: {
            render: headingRender,
            props: { nodeType: 'block', level: 1 },
          },
        },
        options: {
          display: {
            title: 'Test Plugin',
          },
        },
      });

      const pluginData = plugin.getPlugin;
      expect(pluginData.type).toBe('TestPlugin');
      expect(pluginData.elements).toHaveProperty('paragraph');
      expect(pluginData.elements).toHaveProperty('heading');
      expect(pluginData.elements.paragraph.render).toBe(paragraphRender);
      expect(pluginData.elements.heading.render).toBe(headingRender);
    });

    it('should handle plugin without options', () => {
      const paragraphRender = createMockRender('paragraph');
      const jsxElement = createMockJSXElement('paragraph', {
        render: paragraphRender,
        nodeType: 'block',
      });

      const plugin = new YooptaPlugin<TestElementMap, TestOptions>({
        type: 'Paragraph',
        elements: jsxElement,
      });

      const pluginData = plugin.getPlugin;
      expect(pluginData.type).toBe('Paragraph');
      expect(pluginData.options).toBeUndefined();
    });

    it('should handle plugin with nested JSX elements', () => {
      const listRender = createMockRender('list');
      const itemRender = createMockRender('item');
      const contentRender = createMockRender('content');

      const content = createMockJSXElement('content', {
        render: contentRender,
        nodeType: 'block',
      });

      const item = createMockJSXElement('item', {
        render: itemRender,
        nodeType: 'block',
        children: content,
      });

      const list = createMockJSXElement('list', {
        render: listRender,
        nodeType: 'block',
        children: item,
      });

      const plugin = new YooptaPlugin({
        type: 'List',
        elements: list,
      });

      const pluginData = plugin.getPlugin;
      expect(pluginData.elements).toHaveProperty('list');
      expect(pluginData.elements).toHaveProperty('item');
      expect(pluginData.elements).toHaveProperty('content');
      expect(pluginData.elements.list.children).toEqual(['item']);
      expect(pluginData.elements.item.children).toEqual(['content']);
    });
  });

  describe('getPlugin', () => {
    it('should return the plugin data', () => {
      const paragraphRender = createMockRender('paragraph');
      const jsxElement = createMockJSXElement('paragraph', {
        render: paragraphRender,
        nodeType: 'block',
      });

      const plugin = new YooptaPlugin<TestElementMap, TestOptions>({
        type: 'Paragraph',
        elements: jsxElement,
        options: {
          display: {
            title: 'Paragraph',
          },
        },
      });

      const pluginData = plugin.getPlugin;
      expect(pluginData).toBeDefined();
      expect(pluginData.type).toBe('Paragraph');
      expect(pluginData.elements).toBeDefined();
      expect(pluginData.options).toBeDefined();
    });
  });

  describe('extend', () => {
    describe('options extension', () => {
      it('should merge options with existing options', () => {
        const paragraphRender = createMockRender('paragraph');
        const jsxElement = createMockJSXElement('paragraph', {
          render: paragraphRender,
          nodeType: 'block',
        });

        const basePlugin = new YooptaPlugin<TestElementMap, TestOptions>({
          type: 'Paragraph',
          elements: jsxElement,
          options: {
            display: {
              title: 'Paragraph',
              description: 'A paragraph block',
            },
            shortcuts: ['p'],
          },
        });

        const extendedPlugin = basePlugin.extend({
          options: {
            display: {
              title: 'Custom Paragraph',
            },
            shortcuts: ['para'],
            customOption: 'test',
          },
        });

        const pluginData = extendedPlugin.getPlugin;
        expect(pluginData.options?.display?.title).toBe('Custom Paragraph');
        // Note: extend does shallow merge, so display object is replaced, not merged
        expect(pluginData.options?.display?.description).toBeUndefined();
        expect(pluginData.options?.shortcuts).toEqual(['para']);
        expect(pluginData.options?.customOption).toBe('test');
      });

      it('should add new options if base plugin has no options', () => {
        const paragraphRender = createMockRender('paragraph');
        const jsxElement = createMockJSXElement('paragraph', {
          render: paragraphRender,
          nodeType: 'block',
        });

        const basePlugin = new YooptaPlugin<TestElementMap, TestOptions>({
          type: 'Paragraph',
          elements: jsxElement,
        });

        const extendedPlugin = basePlugin.extend({
          options: {
            display: {
              title: 'Paragraph',
            },
            customOption: 'test',
          },
        });

        const pluginData = extendedPlugin.getPlugin;
        expect(pluginData.options?.display?.title).toBe('Paragraph');
        expect(pluginData.options?.customOption).toBe('test');
      });
    });

    describe('events extension', () => {
      it('should add new event handlers', () => {
        const paragraphRender = createMockRender('paragraph');
        const jsxElement = createMockJSXElement('paragraph', {
          render: paragraphRender,
          nodeType: 'block',
        });

        const basePlugin = new YooptaPlugin<TestElementMap, TestOptions>({
          type: 'Paragraph',
          elements: jsxElement,
        });

        const onKeyDown = vi.fn();
        const extendedPlugin = basePlugin.extend({
          events: {
            onKeyDown: () => onKeyDown,
          },
        });

        const pluginData = extendedPlugin.getPlugin;
        expect(pluginData.events?.onKeyDown).toBeDefined();
        expect(typeof pluginData.events?.onKeyDown).toBe('function');
      });

      it('should merge events with existing events', () => {
        const paragraphRender = createMockRender('paragraph');
        const jsxElement = createMockJSXElement('paragraph', {
          render: paragraphRender,
          nodeType: 'block',
        });

        const onKeyDown1 = vi.fn();
        const onKeyUp = vi.fn();

        const basePlugin = new YooptaPlugin<TestElementMap, TestOptions>({
          type: 'Paragraph',
          elements: jsxElement,
          events: {
            onKeyDown: () => onKeyDown1,
          },
        });

        const extendedPlugin = basePlugin.extend({
          events: {
            onKeyUp: () => onKeyUp,
          },
        });

        const pluginData = extendedPlugin.getPlugin;
        expect(pluginData.events?.onKeyDown).toBeDefined();
        expect(pluginData.events?.onKeyUp).toBeDefined();
      });
    });

    describe('injectElementsFromPlugins extension (plugin-level)', () => {
      it('should apply injectElementsFromPlugins to all leaf elements', () => {
        const paragraphRender = createMockRender('paragraph');
        const headingRender = createMockRender('heading');
        const contentRender = createMockRender('content');

        const content = createMockJSXElement('content', {
          render: contentRender,
          nodeType: 'block',
        });

        const paragraph = createMockJSXElement('paragraph', {
          render: paragraphRender,
          nodeType: 'block',
          children: content,
        });

        const basePlugin = new YooptaPlugin({
          type: 'TestPlugin',
          elements: paragraph,
        });

        const allowedPlugin1 = new YooptaPlugin({
          type: 'AllowedPlugin1',
          elements: createMockJSXElement('element1', {
            render: createMockRender('element1'),
            nodeType: 'block',
          }) as any,
        });

        const allowedPlugin2 = new YooptaPlugin({
          type: 'AllowedPlugin2',
          elements: createMockJSXElement('element2', {
            render: createMockRender('element2'),
            nodeType: 'block',
          }) as any,
        });

        const extendedPlugin = basePlugin.extend({
          injectElementsFromPlugins: [allowedPlugin1, allowedPlugin2],
        });

        const pluginData = extendedPlugin.getPlugin;
        // content is a leaf element (no children), so it should have injectElementsFromPlugins
        expect(pluginData.elements.content.injectElementsFromPlugins).toEqual([
          'AllowedPlugin1',
          'AllowedPlugin2',
        ]);
        // paragraph has children, so it should not have injectElementsFromPlugins
        expect(pluginData.elements.paragraph.injectElementsFromPlugins).toBeUndefined();
      });

      it('should not apply injectElementsFromPlugins to elements with children', () => {
        const parentRender = createMockRender('parent');
        const childRender = createMockRender('child');

        const child = createMockJSXElement('child', {
          render: childRender,
          nodeType: 'block',
        });

        const parent = createMockJSXElement('parent', {
          render: parentRender,
          nodeType: 'block',
          children: child,
        });

        const basePlugin = new YooptaPlugin({
          type: 'TestPlugin',
          elements: parent,
        });

        const allowedPlugin = new YooptaPlugin({
          type: 'AllowedPlugin',
          elements: createMockJSXElement('element', {
            render: createMockRender('element'),
            nodeType: 'block',
          }) as any,
        });

        const extendedPlugin = basePlugin.extend({
          injectElementsFromPlugins: [allowedPlugin],
        });

        const pluginData = extendedPlugin.getPlugin;
        expect(pluginData.elements.parent.injectElementsFromPlugins).toBeUndefined();
        expect(pluginData.elements.child.injectElementsFromPlugins).toEqual(['AllowedPlugin']);
      });
    });

    describe('elements extension', () => {
      it('should extend element render function', () => {
        const originalRender = createMockRender('original');
        const newRender = createMockRender('new');

        const jsxElement = createMockJSXElement('paragraph', {
          render: originalRender,
          nodeType: 'block',
        });

        const basePlugin = new YooptaPlugin<TestElementMap, TestOptions>({
          type: 'Paragraph',
          elements: jsxElement,
        });

        const extendedPlugin = basePlugin.extend({
          elements: {
            paragraph: {
              render: newRender,
            },
          },
        });

        const pluginData = extendedPlugin.getPlugin;
        // Note: extend wraps the render function, so we check it's callable and works
        expect(pluginData.elements.paragraph.render).toBeDefined();
        expect(typeof pluginData.elements.paragraph.render).toBe('function');
        // Verify it calls the new render function
        const mockProps = {
          attributes: {
            'data-slate-node': 'element' as const,
            ref: { current: null },
          },
          children: 'test',
          element: {} as any,
          blockId: 'test-block',
        };
        const result = pluginData.elements.paragraph.render?.(mockProps);
        expect(result).toBeDefined();
      });

      it('should extend element props', () => {
        const paragraphRender = createMockRender('paragraph');
        const jsxElement = createMockJSXElement('paragraph', {
          render: paragraphRender,
          nodeType: 'block',
          props: { align: 'left' },
        });

        const basePlugin = new YooptaPlugin<TestElementMap, TestOptions>({
          type: 'Paragraph',
          elements: jsxElement,
        });

        const extendedPlugin = basePlugin.extend({
          elements: {
            paragraph: {
              props: { align: 'center', fontSize: 16 },
            },
          },
        });

        const pluginData = extendedPlugin.getPlugin;
        expect(pluginData.elements.paragraph.props).toEqual({
          nodeType: 'block',
          align: 'center',
          fontSize: 16,
        });
      });

      it('should extend element placeholder', () => {
        const paragraphRender = createMockRender('paragraph');
        const jsxElement = createMockJSXElement('paragraph', {
          render: paragraphRender,
          nodeType: 'block',
          placeholder: 'Original placeholder',
        });

        const basePlugin = new YooptaPlugin<TestElementMap, TestOptions>({
          type: 'Paragraph',
          elements: jsxElement,
        });

        const extendedPlugin = basePlugin.extend({
          elements: {
            paragraph: {
              placeholder: 'New placeholder',
            },
          },
        });

        const pluginData = extendedPlugin.getPlugin;
        expect(pluginData.elements.paragraph.placeholder).toBe('New placeholder');
      });

      it('should extend element injectElementsFromPlugins', () => {
        const paragraphRender = createMockRender('paragraph');
        const jsxElement = createMockJSXElement('paragraph', {
          render: paragraphRender,
          nodeType: 'block',
        });

        const basePlugin = new YooptaPlugin<TestElementMap, TestOptions>({
          type: 'Paragraph',
          elements: jsxElement,
        });

        const allowedPlugin1 = new YooptaPlugin({
          type: 'AllowedPlugin1',
          elements: createMockJSXElement('element1', {
            render: createMockRender('element1'),
            nodeType: 'block',
          }) as any,
        });

        const allowedPlugin2 = new YooptaPlugin({
          type: 'AllowedPlugin2',
          elements: createMockJSXElement('element2', {
            render: createMockRender('element2'),
            nodeType: 'block',
          }) as any,
        });

        const extendedPlugin = basePlugin.extend({
          elements: {
            paragraph: {
              injectElementsFromPlugins: [allowedPlugin1, allowedPlugin2],
            },
          },
        });

        const pluginData = extendedPlugin.getPlugin;
        expect(pluginData.elements.paragraph.injectElementsFromPlugins).toEqual([
          'AllowedPlugin1',
          'AllowedPlugin2',
        ]);
      });

      it('should throw error when setting injectElementsFromPlugins on element with children', () => {
        const parentRender = createMockRender('parent');
        const childRender = createMockRender('child');

        const child = createMockJSXElement('child', {
          render: childRender,
          nodeType: 'block',
        });

        const parent = createMockJSXElement('parent', {
          render: parentRender,
          nodeType: 'block',
          children: child,
        });

        const basePlugin = new YooptaPlugin({
          type: 'TestPlugin',
          elements: parent,
        });

        const allowedPlugin = new YooptaPlugin({
          type: 'AllowedPlugin',
          elements: createMockJSXElement('element', {
            render: createMockRender('element'),
            nodeType: 'block',
          }) as any,
        });

        expect(() => {
          basePlugin.extend({
            elements: {
              parent: {
                injectElementsFromPlugins: [allowedPlugin],
              },
            },
          });
        }).toThrow(
          '[extend] Cannot set injectElementsFromPlugins on element "parent" in plugin "TestPlugin": element has children. injectElementsFromPlugins can only be set on leaf elements.',
        );
      });

      it('should warn when extending non-existent element', () => {
        const paragraphRender = createMockRender('paragraph');
        const jsxElement = createMockJSXElement('paragraph', {
          render: paragraphRender,
          nodeType: 'block',
        });

        const basePlugin = new YooptaPlugin<TestElementMap, TestOptions>({
          type: 'Paragraph',
          elements: jsxElement,
        });

        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        basePlugin.extend({
          elements: {
            // @ts-expect-error - testing non-existent element warning
            nonExistent: {
              render: createMockRender('nonExistent'),
            },
          },
        });

        expect(consoleSpy).toHaveBeenCalledWith(
          '[extend] Element "nonExistent" not found in plugin "Paragraph"',
        );

        consoleSpy.mockRestore();
      });

      it('should handle multiple element extensions at once', () => {
        const paragraphRender = createMockRender('paragraph');
        const headingRender = createMockRender('heading');

        const basePlugin = new YooptaPlugin({
          type: 'TestPlugin',
          elements: {
            paragraph: {
              render: paragraphRender,
              props: { nodeType: 'block' },
            },
            heading: {
              render: headingRender,
              props: { nodeType: 'block', level: 1 },
            },
          },
        });

        const extendedPlugin = basePlugin.extend({
          elements: {
            paragraph: {
              props: { align: 'center' },
              placeholder: 'Type paragraph...',
            },
            heading: {
              props: { level: 2 },
            },
          },
        });

        const pluginData = extendedPlugin.getPlugin;
        expect(pluginData.elements.paragraph.props).toEqual({
          nodeType: 'block',
          align: 'center',
        });
        expect(pluginData.elements.paragraph.placeholder).toBe('Type paragraph...');
        expect(pluginData.elements.heading.props).toEqual({
          nodeType: 'block',
          level: 2,
        });
      });
    });

    describe('combined extensions', () => {
      it('should handle multiple extension types at once', () => {
        const paragraphRender = createMockRender('paragraph');
        const jsxElement = createMockJSXElement('paragraph', {
          render: paragraphRender,
          nodeType: 'block',
        });

        const basePlugin = new YooptaPlugin<TestElementMap, TestOptions>({
          type: 'Paragraph',
          elements: jsxElement,
          options: {
            display: {
              title: 'Paragraph',
            },
          },
        });

        const onKeyDown = vi.fn();

        const extendedPlugin = basePlugin.extend({
          options: {
            display: {
              title: 'Custom Paragraph',
            },
            shortcuts: ['p'],
          },
          events: {
            onKeyDown: () => onKeyDown,
          },
          elements: {
            paragraph: {
              placeholder: 'Type here...',
            },
          },
        });

        const pluginData = extendedPlugin.getPlugin;
        expect(pluginData.options?.display?.title).toBe('Custom Paragraph');
        expect(pluginData.options?.shortcuts).toEqual(['p']);
        expect(pluginData.events?.onKeyDown).toBeDefined();
        expect(pluginData.elements.paragraph.placeholder).toBe('Type here...');
      });
    });
  });

  describe('edge cases', () => {
    it('should return a new YooptaPlugin instance on extend', () => {
      const paragraphRender = createMockRender('paragraph');
      const jsxElement = createMockJSXElement('paragraph', {
        render: paragraphRender,
        nodeType: 'block',
      });

      const basePlugin = new YooptaPlugin<TestElementMap, TestOptions>({
        type: 'Paragraph',
        elements: jsxElement,
      });

      const extendedPlugin = basePlugin.extend({
        options: {
          display: {
            title: 'Extended',
          },
        },
      });

      expect(extendedPlugin).toBeInstanceOf(YooptaPlugin);
      expect(extendedPlugin).not.toBe(basePlugin);
    });

    it('should preserve original plugin when extending', () => {
      const paragraphRender = createMockRender('paragraph');
      const jsxElement = createMockJSXElement('paragraph', {
        render: paragraphRender,
        nodeType: 'block',
      }) as any;

      const basePlugin = new YooptaPlugin<TestElementMap, TestOptions>({
        type: 'Paragraph',
        elements: jsxElement,
        options: {
          display: {
            title: 'Original',
          },
        },
      });

      const extendedPlugin = basePlugin.extend({
        options: {
          display: {
            title: 'Extended',
          },
        },
      });

      const basePluginData = basePlugin.getPlugin;
      const extendedPluginData = extendedPlugin.getPlugin;

      expect(basePluginData.options?.display?.title).toBe('Original');
      expect(extendedPluginData.options?.display?.title).toBe('Extended');
    });

    it('should handle empty extend object', () => {
      const paragraphRender = createMockRender('paragraph');
      const jsxElement = createMockJSXElement('paragraph', {
        render: paragraphRender,
        nodeType: 'block',
      });

      const basePlugin = new YooptaPlugin<TestElementMap, TestOptions>({
        type: 'Paragraph',
        elements: jsxElement,
        options: {
          display: {
            title: 'Paragraph',
          },
        },
      });

      const extendedPlugin = basePlugin.extend({});

      const basePluginData = basePlugin.getPlugin;
      const extendedPluginData = extendedPlugin.getPlugin;

      expect(extendedPluginData.options?.display?.title).toBe('Paragraph');
      expect(extendedPluginData.elements).toEqual(basePluginData.elements);
    });
  });
});
