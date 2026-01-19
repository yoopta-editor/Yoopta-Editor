import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { getElement } from './getElement';
import { getElementChildren } from './getElementChildren';
import type { SlateElement, YooEditor } from '../types';

vi.mock('./getElement');

describe('getElementChildren', () => {
  let editor: Partial<YooEditor>;
  let mockElement: SlateElement;
  let mockChildren: SlateElement[];

  beforeEach(() => {
    vi.clearAllMocks();

    mockChildren = [
      {
        id: 'child-1',
        type: 'accordion-list-item-heading',
        props: {},
        children: [{ text: 'Heading' }],
      },
      {
        id: 'child-2',
        type: 'accordion-list-item-content',
        props: {},
        children: [{ text: 'Content' }],
      },
    ];

    mockElement = {
      id: 'element-1',
      type: 'accordion-list-item',
      props: { isExpanded: true },
      children: mockChildren,
    };

    editor = {
      children: {},
      path: { current: 0 },
    };
  });

  it('should return element children', () => {
    (getElement as Mock).mockReturnValue(mockElement);

    const result = getElementChildren(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: [0, 0],
    });

    expect(result).toEqual(mockChildren);
    expect(getElement).toHaveBeenCalledWith(editor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: [0, 0],
    });
  });

  it('should return null when element not found', () => {
    (getElement as Mock).mockReturnValue(null);

    const result = getElementChildren(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: [0, 0],
    });

    expect(result).toBeNull();
  });

  it('should return null when element has no children property', () => {
    const elementWithoutChildren = {
      id: 'element-1',
      type: 'void-element',
      props: {},
    } as any;

    (getElement as Mock).mockReturnValue(elementWithoutChildren);

    const result = getElementChildren(editor as YooEditor, {
      blockId: 'block-1',
      type: 'void-element',
      path: [0, 0],
    });

    expect(result).toBeNull();
  });

  it('should return empty array when element has empty children', () => {
    const elementWithEmptyChildren = {
      id: 'element-1',
      type: 'accordion-list-item',
      props: {},
      children: [],
    };

    (getElement as Mock).mockReturnValue(elementWithEmptyChildren);

    const result = getElementChildren(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: [0, 0],
    });

    expect(result).toEqual([]);
  });

  it('should return children with text nodes', () => {
    const elementWithTextChildren = {
      id: 'element-1',
      type: 'paragraph',
      props: {},
      children: [{ text: 'Hello' }, { text: ' World' }],
    };

    (getElement as Mock).mockReturnValue(elementWithTextChildren);

    const result = getElementChildren(editor as YooEditor, {
      blockId: 'block-1',
      type: 'paragraph',
      path: [0],
    });

    expect(result).toEqual([{ text: 'Hello' }, { text: ' World' }]);
  });

  it('should return nested children structure', () => {
    const nestedChildren = [
      {
        id: 'nested-1',
        type: 'nested-element',
        props: {},
        children: [
          {
            id: 'deep-1',
            type: 'deep-element',
            props: {},
            children: [{ text: 'Deep content' }],
          },
        ],
      },
    ];

    const elementWithNestedChildren = {
      id: 'element-1',
      type: 'container',
      props: {},
      children: nestedChildren,
    };

    (getElement as Mock).mockReturnValue(elementWithNestedChildren);

    const result = getElementChildren(editor as YooEditor, {
      blockId: 'block-1',
      type: 'container',
      path: [0],
    });

    expect(result).toEqual(nestedChildren);
  });

  it('should pass options correctly to getElement', () => {
    (getElement as Mock).mockReturnValue(mockElement);

    getElementChildren(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: [0, 1, 2],
    });

    expect(getElement).toHaveBeenCalledWith(editor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: [0, 1, 2],
    });
  });

  it('should handle element with only type and no path', () => {
    (getElement as Mock).mockReturnValue(mockElement);

    getElementChildren(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(getElement).toHaveBeenCalledWith(editor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: undefined,
    });
  });
});
