import { Editor, Element } from 'slate';
import type { NodeEntry } from 'slate';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { getElements } from './getElements';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateElement, YooEditor } from '../types';

vi.mock('../../utils/findSlateBySelectionPath');
vi.mock('slate', () => ({
  Editor: {
    nodes: vi.fn(),
  },
  Element: {
    isElement: vi.fn(),
  },
}));

describe('getElements', () => {
  let editor: Partial<YooEditor>;
  let mockSlate: any;
  let mockElement1: SlateElement;
  let mockElement2: SlateElement;
  let mockElement3: SlateElement;
  let mockBlock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockElement1 = {
      id: 'element-1',
      type: 'accordion-list-item',
      props: { isExpanded: true },
      children: [{ text: 'Item 1' }],
    };

    mockElement2 = {
      id: 'element-2',
      type: 'accordion-list-item',
      props: { isExpanded: false },
      children: [{ text: 'Item 2' }],
    };

    mockElement3 = {
      id: 'element-3',
      type: 'accordion-list-item-heading',
      props: {},
      children: [{ text: 'Heading' }],
    };

    mockSlate = {
      selection: { anchor: { path: [0], offset: 0 }, focus: { path: [0], offset: 0 } },
      children: [mockElement1, mockElement2, mockElement3],
    };

    mockBlock = {
      id: 'block-1',
      type: 'Accordion',
      meta: { order: 0, depth: 0 },
      value: [mockElement1, mockElement2, mockElement3],
    };

    editor = {
      children: {
        'block-1': mockBlock,
      },
      path: { current: 0 },
    };

    (findSlateBySelectionPath as Mock).mockReturnValue(mockSlate);
    (Element.isElement as unknown as Mock).mockImplementation(
      (node) => node && typeof node === 'object' && 'type' in node && 'children' in node,
    );
  });

  it('should return all elements of specified type', () => {
    const entries: NodeEntry<SlateElement>[] = [
      [mockElement1, [0, 0]],
      [mockElement2, [0, 1]],
    ];
    (Editor.nodes as Mock).mockReturnValue(entries);

    const result = getElements(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(result).toEqual([mockElement1, mockElement2]);
    expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
      at: [],
      match: expect.any(Function),
      mode: 'all',
    });
  });

  it('should return empty array when no elements found', () => {
    (Editor.nodes as Mock).mockReturnValue([]);

    const result = getElements(editor as YooEditor, {
      blockId: 'block-1',
      type: 'non-existent-type',
    });

    expect(result).toEqual([]);
  });

  it('should return empty array when block not found', () => {
    const result = getElements(editor as YooEditor, {
      blockId: 'non-existent',
      type: 'accordion-list-item',
    });

    expect(result).toEqual([]);
    expect(findSlateBySelectionPath).not.toHaveBeenCalled();
  });

  it('should return empty array when slate not found', () => {
    (findSlateBySelectionPath as Mock).mockReturnValue(undefined);

    const result = getElements(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(result).toEqual([]);
  });

  it('should return elements with custom matcher', () => {
    const entries: NodeEntry<SlateElement>[] = [[mockElement1, [0, 0]]];
    (Editor.nodes as Mock).mockReturnValue(entries);

    const result = getElements(editor as YooEditor, {
      blockId: 'block-1',
      match: (el) => el.type === 'accordion-list-item' && el.props?.isExpanded === true,
    });

    expect(result).toEqual([mockElement1]);
    const matchFn = (Editor.nodes as Mock).mock.calls[0][1].match;
    expect(matchFn(mockElement1 as any)).toBe(true);
    expect(matchFn(mockElement2 as any)).toBe(false);
  });

  it('should return all elements when no type or match provided', () => {
    const entries: NodeEntry<SlateElement>[] = [
      [mockElement1, [0, 0]],
      [mockElement2, [0, 1]],
      [mockElement3, [0, 2]],
    ];
    (Editor.nodes as Mock).mockReturnValue(entries);

    const result = getElements(editor as YooEditor, {
      blockId: 'block-1',
    });

    expect(result).toEqual([mockElement1, mockElement2, mockElement3]);
    const matchFn = (Editor.nodes as Mock).mock.calls[0][1].match;
    expect(matchFn(mockElement1 as any)).toBe(true);
    expect(matchFn(mockElement2 as any)).toBe(true);
    expect(matchFn(mockElement3 as any)).toBe(true);
  });

  it('should handle error gracefully', () => {
    (Editor.nodes as Mock).mockImplementation(() => {
      throw new Error('Test error');
    });

    const result = getElements(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(result).toEqual([]);
  });

  it('should match elements correctly by type', () => {
    const entries: NodeEntry<SlateElement>[] = [
      [mockElement1, [0, 0]],
      [mockElement2, [0, 1]],
    ];
    (Editor.nodes as Mock).mockReturnValue(entries);

    getElements(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    const matchFn = (Editor.nodes as Mock).mock.calls[0][1].match;
    expect(matchFn(mockElement1 as any)).toBe(true);
    expect(matchFn(mockElement2 as any)).toBe(true);
    expect(matchFn(mockElement3 as any)).toBe(false);
  });

  it('should use custom matcher when provided instead of type', () => {
    const entries: NodeEntry<SlateElement>[] = [[mockElement1, [0, 0]]];
    (Editor.nodes as Mock).mockReturnValue(entries);

    const customMatcher = vi.fn((el) => el.props?.isExpanded === true);

    getElements(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      match: customMatcher,
    });

    const matchFn = (Editor.nodes as Mock).mock.calls[0][1].match;
    expect(matchFn(mockElement1 as any)).toBe(true);
    expect(matchFn(mockElement2 as any)).toBe(false);
  });
});
