import { type Mock, vi, describe, it, expect, beforeEach } from 'vitest';
import { Editor, Element } from 'slate';
import type { NodeEntry } from 'slate';

import { getElement } from './getElement';
import type { SlateElement, YooEditor } from '../types';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';

vi.mock('../../utils/findSlateBySelectionPath');
vi.mock('slate', () => ({
  Editor: {
    nodes: vi.fn(),
  },
  Element: {
    isElement: vi.fn(),
  },
}));

describe('getElement', () => {
  let editor: Partial<YooEditor>;
  let mockSlate: any;
  let mockElement1: SlateElement;
  let mockElement2: SlateElement;
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

    mockSlate = {
      selection: { anchor: { path: [0], offset: 0 }, focus: { path: [0], offset: 0 } },
      children: [mockElement1],
    };

    mockBlock = {
      id: 'block-1',
      type: 'Accordion',
      meta: { order: 0, depth: 0 },
      value: [mockElement1],
    };

    editor = {
      children: {
        'block-1': mockBlock,
      },
      path: { current: 0 },
    };

    (findSlateBySelectionPath as Mock).mockReturnValue(mockSlate);
    (Element.isElement as unknown as Mock).mockImplementation((node) => {
      return node && typeof node === 'object' && 'type' in node && 'children' in node;
    });
  });

  it('should return element by type and path', () => {
    const mockEntry: NodeEntry<SlateElement> = [mockElement1, [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);

    const result = getElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: [0, 0],
    });

    expect(result).toEqual(mockElement1);
    expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
      at: [0, 0],
      match: expect.any(Function),
      mode: 'lowest',
    });
  });

  it('should return element by type only', () => {
    const mockEntry: NodeEntry<SlateElement> = [mockElement1, [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);

    const result = getElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(result).toEqual(mockElement1);
    expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
      at: mockSlate.selection,
      match: expect.any(Function),
      mode: 'lowest',
    });
  });

  it('should return element with custom matcher', () => {
    const mockEntry: NodeEntry<SlateElement> = [mockElement1, [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);

    const result = getElement(editor as YooEditor, {
      blockId: 'block-1',
      match: (el) => el.type === 'accordion-list-item' && el.props?.isExpanded === true,
    });

    expect(result).toEqual(mockElement1);
    expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
      at: mockSlate.selection,
      match: expect.any(Function),
      mode: 'lowest',
    });
  });

  it('should return null when block not found', () => {
    const result = getElement(editor as YooEditor, {
      blockId: 'non-existent',
      type: 'accordion-list-item',
    });

    expect(result).toBeNull();
    expect(findSlateBySelectionPath).not.toHaveBeenCalled();
  });

  it('should return null when slate not found', () => {
    (findSlateBySelectionPath as Mock).mockReturnValue(undefined);

    const result = getElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(result).toBeNull();
  });

  it('should return null when element not found', () => {
    (Editor.nodes as Mock).mockReturnValue([]);

    const result = getElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'non-existent-type',
      path: [0, 0],
    });

    expect(result).toBeNull();
  });

  it('should handle path "first"', () => {
    const mockEntry: NodeEntry<SlateElement> = [mockElement1, [0, 0]];
    (Editor.nodes as Mock)
      .mockReturnValueOnce([[mockElement1, [0, 0]]]) // For resolveElementPath
      .mockReturnValueOnce([[mockElement1, [0, 0]]]); // For getElement

    const result = getElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: 'first' as any,
    });

    expect(result).toEqual(mockElement1);
  });

  it('should handle path "last"', () => {
    const mockEntry: NodeEntry<SlateElement> = [mockElement2, [0, 1]];
    (Editor.nodes as Mock)
      .mockReturnValueOnce([
        [mockElement1, [0, 0]],
        [mockElement2, [0, 1]],
      ]) // For resolveElementPath - returns all entries
      .mockReturnValueOnce([[mockElement2, [0, 1]]]); // For getElement

    const result = getElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: 'last' as any,
    });

    expect(result).toEqual(mockElement2);
  });

  it('should handle path "selection"', () => {
    const mockEntry: NodeEntry<SlateElement> = [mockElement1, [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);

    const result = getElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: 'selection' as any,
    });

    expect(result).toEqual(mockElement1);
    expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
      at: mockSlate.selection,
      match: expect.any(Function),
      mode: 'lowest',
    });
  });

  it('should handle error gracefully', () => {
    (Editor.nodes as Mock).mockImplementation(() => {
      throw new Error('Test error');
    });

    const result = getElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: [0, 0],
    });

    expect(result).toBeNull();
  });

  it('should use default path [0] when no selection', () => {
    mockSlate.selection = null;
    const mockEntry: NodeEntry<SlateElement> = [mockElement1, [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);

    const result = getElement(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(result).toEqual(mockElement1);
    expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
      at: [0],
      match: expect.any(Function),
      mode: 'lowest',
    });
  });

  it('should match any element when no type or match provided', () => {
    const mockEntry: NodeEntry<SlateElement> = [mockElement1, [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);

    const result = getElement(editor as YooEditor, {
      blockId: 'block-1',
    });

    expect(result).toEqual(mockElement1);
    const matchFn = (Editor.nodes as Mock).mock.calls[0][1].match;
    expect(matchFn(mockElement1 as any)).toBe(true);
  });
});

