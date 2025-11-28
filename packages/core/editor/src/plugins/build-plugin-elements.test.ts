import React from 'react';
import { describe, expect, it } from 'vitest';

import { buildPluginElements, isReactElement } from './build-plugin-elements';
import type { PluginJSXElement } from './build-plugin-elements';
import type { PluginElementRenderProps } from './types';

// Helper to create mock JSX elements that match PluginJSXElement structure
const createMockElement = (
  type: string,
  props: {
    render: (props: PluginElementRenderProps) => JSX.Element;
    props?: Record<string, unknown>;
    nodeType?: 'block' | 'inline' | 'void' | 'inlineVoid';
    children?: React.ReactElement | React.ReactElement[];
  },
): PluginJSXElement => React.createElement(type, props, props.children) as PluginJSXElement;

describe('buildPluginElements', () => {
  describe('basic functionality', () => {
    it('should build a simple single element', () => {
      const mockRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'test');
      const element = createMockElement('paragraph', {
        render: mockRender,
        nodeType: 'block',
      });

      const result = buildPluginElements(element);

      expect(result).toHaveProperty('paragraph');
      expect(result.paragraph.render).toBe(mockRender);
      expect(result.paragraph.asRoot).toBe(true);
      expect(result.paragraph.props?.nodeType).toBe('block');
    });

    it('should set nodeType to "block" by default', () => {
      const mockRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'test');
      const element = createMockElement('paragraph', {
        render: mockRender,
      });

      const result = buildPluginElements(element);

      expect(result.paragraph.props?.nodeType).toBe('block');
    });

    it('should handle element with custom props', () => {
      const mockRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'test');
      const element = createMockElement('paragraph', {
        render: mockRender,
        props: { align: 'center', fontSize: 16 },
        nodeType: 'block',
      });

      const result = buildPluginElements(element);

      expect(result.paragraph.props).toEqual({
        nodeType: 'block',
        align: 'center',
        fontSize: 16,
      });
    });
  });

  describe('children handling', () => {
    it('should handle element with single child', () => {
      const parentRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'parent');
      const childRender = (props: PluginElementRenderProps) =>
        React.createElement('span', props.attributes, 'child');

      const child = createMockElement('child-element', {
        render: childRender,
        nodeType: 'block',
      });

      const parent = createMockElement('parent-element', {
        render: parentRender,
        nodeType: 'block',
        children: child,
      });

      const result = buildPluginElements(parent);

      expect(result).toHaveProperty('parent-element');
      expect(result).toHaveProperty('child-element');
      expect(result['parent-element'].children).toEqual(['child-element']);
      expect(result['parent-element'].asRoot).toBe(true);
      expect(result['child-element'].asRoot).toBeUndefined();
    });

    it('should handle element with multiple children', () => {
      const parentRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'parent');
      const child1Render = (props: PluginElementRenderProps) =>
        React.createElement('span', props.attributes, 'child1');
      const child2Render = (props: PluginElementRenderProps) =>
        React.createElement('span', props.attributes, 'child2');

      const child1 = createMockElement('child-1', {
        render: child1Render,
        nodeType: 'block',
      });

      const child2 = createMockElement('child-2', {
        render: child2Render,
        nodeType: 'block',
      });

      const parent = createMockElement('parent', {
        render: parentRender,
        nodeType: 'block',
        children: [child1, child2],
      });

      const result = buildPluginElements(parent);

      expect(result).toHaveProperty('parent');
      expect(result).toHaveProperty('child-1');
      expect(result).toHaveProperty('child-2');
      expect(result.parent.children).toEqual(['child-1', 'child-2']);
    });

    it('should handle nested children (3 levels)', () => {
      const level1Render = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'level1');
      const level2Render = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'level2');
      const level3Render = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'level3');

      const level3 = createMockElement('level-3', {
        render: level3Render,
        nodeType: 'block',
      });

      const level2 = createMockElement('level-2', {
        render: level2Render,
        nodeType: 'block',
        children: level3,
      });

      const level1 = createMockElement('level-1', {
        render: level1Render,
        nodeType: 'block',
        children: level2,
      });

      const result = buildPluginElements(level1);

      expect(result).toHaveProperty('level-1');
      expect(result).toHaveProperty('level-2');
      expect(result).toHaveProperty('level-3');
      expect(result['level-1'].children).toEqual(['level-2']);
      expect(result['level-2'].children).toEqual(['level-3']);
      expect(result['level-3'].children).toBeUndefined();
    });
  });

  describe('nodeType handling', () => {
    it('should not set asRoot for inline elements', () => {
      const mockRender = (props: PluginElementRenderProps) =>
        React.createElement('span', props.attributes, 'inline');
      const element = createMockElement('link', {
        render: mockRender,
        nodeType: 'inline',
      });

      const result = buildPluginElements(element);

      expect(result.link.asRoot).toBeUndefined();
      expect(result.link.props?.nodeType).toBe('inline');
    });

    it('should not set asRoot for inlineVoid elements', () => {
      const mockRender = (props: PluginElementRenderProps) =>
        React.createElement('img', { ...props.attributes, alt: 'void' });
      const element = createMockElement('image', {
        render: mockRender,
        nodeType: 'inlineVoid',
      });

      const result = buildPluginElements(element);

      expect(result.image.asRoot).toBeUndefined();
      expect(result.image.props?.nodeType).toBe('inlineVoid');
    });

    it('should set asRoot for block elements', () => {
      const mockRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'block');
      const element = createMockElement('paragraph', {
        render: mockRender,
        nodeType: 'block',
      });

      const result = buildPluginElements(element);

      expect(result.paragraph.asRoot).toBe(true);
      expect(result.paragraph.props?.nodeType).toBe('block');
    });

    it('should set asRoot for void elements', () => {
      const mockRender = (props: PluginElementRenderProps) =>
        React.createElement('hr', props.attributes);
      const element = createMockElement('divider', {
        render: mockRender,
        nodeType: 'void',
      });

      const result = buildPluginElements(element);

      expect(result.divider.asRoot).toBe(true);
      expect(result.divider.props?.nodeType).toBe('void');
    });
  });

  describe('complex structures', () => {
    it('should handle accordion-like structure', () => {
      const listRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'list');
      const itemRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'item');
      const headingRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'heading');
      const contentRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'content');

      const heading = createMockElement('accordion-list-item-heading', {
        render: headingRender,
        nodeType: 'block',
      });

      const content = createMockElement('accordion-list-item-content', {
        render: contentRender,
        nodeType: 'block',
      });

      const item = createMockElement('accordion-list-item', {
        render: itemRender,
        nodeType: 'block',
        children: [heading, content],
      });

      const list = createMockElement('accordion-list', {
        render: listRender,
        nodeType: 'block',
        children: item,
      });

      const result = buildPluginElements(list);

      expect(result).toHaveProperty('accordion-list');
      expect(result).toHaveProperty('accordion-list-item');
      expect(result).toHaveProperty('accordion-list-item-heading');
      expect(result).toHaveProperty('accordion-list-item-content');

      expect(result['accordion-list'].asRoot).toBe(true);
      expect(result['accordion-list'].children).toEqual(['accordion-list-item']);

      expect(result['accordion-list-item'].children).toEqual([
        'accordion-list-item-heading',
        'accordion-list-item-content',
      ]);
    });

    it('should handle element with mixed props and children', () => {
      const parentRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'parent');
      const childRender = (props: PluginElementRenderProps) =>
        React.createElement('span', props.attributes, 'child');

      const child = createMockElement('child', {
        render: childRender,
        props: { color: 'red' },
        nodeType: 'block',
      });

      const parent = createMockElement('parent', {
        render: parentRender,
        props: { width: 100, height: 200 },
        nodeType: 'block',
        children: child,
      });

      const result = buildPluginElements(parent);

      expect(result.parent.props).toEqual({
        nodeType: 'block',
        width: 100,
        height: 200,
      });
      expect(result.child.props).toEqual({
        nodeType: 'block',
        color: 'red',
      });
      expect(result.parent.children).toEqual(['child']);
    });
  });

  describe('error handling', () => {
    it('should throw error if element type is not a string', () => {
      const mockRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'test');
      const Component = () => React.createElement('div');
      const element = React.createElement(Component, {
        render: mockRender,
      });

      expect(() => buildPluginElements(element as any)).toThrow(
        '[buildPluginElements] Element type must be a string',
      );
    });

    it('should throw error if render function is missing', () => {
      const element = createMockElement('paragraph', {
        nodeType: 'block',
      } as any);

      // Remove render to test error
      delete (element.props as any).render;

      expect(() => buildPluginElements(element)).toThrow(
        '[buildPluginElements] Element "paragraph" must define a render function',
      );
    });

    it('should throw error if render is not a function', () => {
      const element = createMockElement('paragraph', {
        render: 'not-a-function' as any,
        nodeType: 'block',
      });

      expect(() => buildPluginElements(element)).toThrow(
        '[buildPluginElements] Element "paragraph" must define a render function',
      );
    });
  });

  describe('edge cases', () => {
    it('should handle element without props', () => {
      const mockRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'test');
      const element = createMockElement('paragraph', {
        render: mockRender,
      });

      const result = buildPluginElements(element);

      expect(result.paragraph.render).toBe(mockRender);
      expect(result.paragraph.props?.nodeType).toBe('block');
    });

    it('should handle element with empty children array', () => {
      const mockRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'test');
      const element = createMockElement('paragraph', {
        render: mockRender,
        nodeType: 'block',
        children: [],
      });

      const result = buildPluginElements(element);

      expect(result.paragraph.children).toBeUndefined();
    });

    it('should handle element with null/undefined children', () => {
      const mockRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'test');
      const element = createMockElement('paragraph', {
        render: mockRender,
        nodeType: 'block',
        children: undefined,
      });

      const result = buildPluginElements(element);

      expect(result.paragraph.children).toBeUndefined();
    });

    it('should preserve render function reference', () => {
      const mockRender = (props: PluginElementRenderProps) =>
        React.createElement('div', props.attributes, 'test');
      const element = createMockElement('paragraph', {
        render: mockRender,
        nodeType: 'block',
      });

      const result = buildPluginElements(element);

      expect(result.paragraph.render).toBe(mockRender);
      expect(result.paragraph.render).not.toBeUndefined();
      expect(typeof result.paragraph.render).toBe('function');
    });
  });
});

describe('isReactElement', () => {
  it('should return true for valid React elements', () => {
    const mockRender = (props: PluginElementRenderProps) =>
      React.createElement('div', props.attributes, 'test');
    const element = createMockElement('div', {
      render: mockRender,
    });

    expect(isReactElement(element)).toBe(true);
  });

  it('should return false for non-React elements', () => {
    expect(isReactElement(null)).toBe(false);
    expect(isReactElement(undefined)).toBe(false);
    expect(isReactElement('string')).toBe(false);
    expect(isReactElement(123)).toBe(false);
    expect(isReactElement({})).toBe(false);
    expect(isReactElement([])).toBe(false);
  });
});
