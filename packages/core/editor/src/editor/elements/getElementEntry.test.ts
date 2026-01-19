import { Editor, Element } from 'slate';
import type { NodeEntry } from 'slate';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { getElementEntry } from './getElementEntry';
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

describe('getElementEntry', () => {
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
    (Element.isElement as unknown as Mock).mockImplementation(
      (node) => node && typeof node === 'object' && 'type' in node && 'children' in node,
    );
  });

  it('should return element entry by type and path', () => {
    const mockEntry: NodeEntry<SlateElement> = [mockElement1, [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);

    const result = getElementEntry(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: [0, 0],
    });

    expect(result).toEqual(mockEntry);
    expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
      at: [0, 0],
      match: expect.any(Function),
      mode: 'lowest',
    });
  });

  it('should return element entry by type only', () => {
    const mockEntry: NodeEntry<SlateElement> = [mockElement1, [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);

    const result = getElementEntry(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(result).toEqual(mockEntry);
    expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
      at: mockSlate.selection,
      match: expect.any(Function),
      mode: 'lowest',
    });
  });

  it('should return null when block not found', () => {
    const result = getElementEntry(editor as YooEditor, {
      blockId: 'non-existent',
      type: 'accordion-list-item',
    });

    expect(result).toBeNull();
    expect(findSlateBySelectionPath).not.toHaveBeenCalled();
  });

  it('should return null when slate not found', () => {
    (findSlateBySelectionPath as Mock).mockReturnValue(undefined);

    const result = getElementEntry(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(result).toBeNull();
  });

  it('should return null when element not found', () => {
    (Editor.nodes as Mock).mockReturnValue([]);

    const result = getElementEntry(editor as YooEditor, {
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
      .mockReturnValueOnce([[mockElement1, [0, 0]]]); // For getElementEntry

    const result = getElementEntry(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: 'first' as any,
    });

    expect(result).toEqual(mockEntry);
  });

  it('should handle path "last"', () => {
    const mockEntry: NodeEntry<SlateElement> = [mockElement2, [0, 1]];
    (Editor.nodes as Mock)
      .mockReturnValueOnce([
        [mockElement1, [0, 0]],
        [mockElement2, [0, 1]],
      ]) // For resolveElementPath - returns all entries
      .mockReturnValueOnce([[mockElement2, [0, 1]]]); // For getElementEntry

    const result = getElementEntry(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: 'last' as any,
    });

    expect(result).toEqual(mockEntry);
  });

  it('should handle path "selection"', () => {
    const mockEntry: NodeEntry<SlateElement> = [mockElement1, [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);

    const result = getElementEntry(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: 'selection' as any,
    });

    expect(result).toEqual(mockEntry);
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

    const result = getElementEntry(editor as YooEditor, {
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

    const result = getElementEntry(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
    });

    expect(result).toEqual(mockEntry);
    expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
      at: [0],
      match: expect.any(Function),
      mode: 'lowest',
    });
  });

  it('should match any element when no type provided', () => {
    const mockEntry: NodeEntry<SlateElement> = [mockElement1, [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);

    const result = getElementEntry(editor as YooEditor, {
      blockId: 'block-1',
    });

    expect(result).toEqual(mockEntry);
    const matchFn = (Editor.nodes as Mock).mock.calls[0][1].match;
    expect(matchFn(mockElement1 as any)).toBe(true);
  });

  it('should return entry with correct path', () => {
    const mockEntry: NodeEntry<SlateElement> = [mockElement1, [0, 1, 2]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);

    const result = getElementEntry(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item',
      path: [0, 1, 2],
    });

    expect(result).toEqual(mockEntry);
    expect(result?.[1]).toEqual([0, 1, 2]);
  });
});
