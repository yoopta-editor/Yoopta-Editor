import { type Mock, vi, describe, it, expect, beforeEach } from 'vitest';
import { Editor, Element } from 'slate';

import { isElementEmpty } from './isElementEmpty';
import type { SlateElement, YooEditor } from '../types';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';

vi.mock('../../utils/findSlateBySelectionPath');
vi.mock('slate', () => ({
  Editor: {
    nodes: vi.fn(),
    string: vi.fn(),
  },
  Element: {
    isElement: vi.fn(),
  },
}));

describe('isElementEmpty', () => {
  let editor: Partial<YooEditor>;
  let mockSlate: any;
  let mockElement: SlateElement;
  let mockBlock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockElement = {
      id: 'element-1',
      type: 'accordion-list-item-content',
      props: {},
      children: [{ text: 'Content' }],
    };

    mockSlate = {
      selection: { anchor: { path: [0], offset: 0 }, focus: { path: [0], offset: 0 } },
      children: [mockElement],
    };

    mockBlock = {
      id: 'block-1',
      type: 'Accordion',
      meta: { order: 0, depth: 0 },
      value: [mockElement],
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

  it('should return true for empty element', () => {
    const mockEntry: any = [[mockElement], [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);
    (Editor.string as Mock).mockReturnValue('   '); // Only whitespace

    const result = isElementEmpty(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item-content',
      path: [0, 0],
    });

    expect(result).toBe(true);
    expect(Editor.string).toHaveBeenCalledWith(mockSlate, [0, 0]);
  });

  it('should return false for element with content', () => {
    const mockEntry: any = [[mockElement], [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);
    (Editor.string as Mock).mockReturnValue('Some content');

    const result = isElementEmpty(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item-content',
      path: [0, 0],
    });

    expect(result).toBe(false);
  });

  it('should return true when block not found', () => {
    const result = isElementEmpty(editor as YooEditor, {
      blockId: 'non-existent',
      type: 'accordion-list-item-content',
    });

    expect(result).toBe(true);
    expect(findSlateBySelectionPath).not.toHaveBeenCalled();
  });

  it('should return true when slate not found', () => {
    (findSlateBySelectionPath as Mock).mockReturnValue(undefined);

    const result = isElementEmpty(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item-content',
    });

    expect(result).toBe(true);
  });

  it('should return true when element not found', () => {
    (Editor.nodes as Mock).mockReturnValue([]);

    const result = isElementEmpty(editor as YooEditor, {
      blockId: 'block-1',
      type: 'non-existent-type',
      path: [0, 0],
    });

    expect(result).toBe(true);
  });

  it('should use selection path when path not provided', () => {
    const mockEntry: any = [[mockElement], [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);
    (Editor.string as Mock).mockReturnValue('');

    const result = isElementEmpty(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item-content',
    });

    expect(result).toBe(true);
    expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
      at: mockSlate.selection,
      match: expect.any(Function),
      mode: 'lowest',
    });
  });

  it('should use default path [0] when no selection', () => {
    mockSlate.selection = null;
    const mockEntry: any = [[mockElement], [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);
    (Editor.string as Mock).mockReturnValue('');

    const result = isElementEmpty(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item-content',
    });

    expect(result).toBe(true);
    expect(Editor.nodes).toHaveBeenCalledWith(mockSlate, {
      at: [0],
      match: expect.any(Function),
      mode: 'lowest',
    });
  });

  it('should handle error gracefully', () => {
    (Editor.nodes as Mock).mockImplementation(() => {
      throw new Error('Test error');
    });

    const result = isElementEmpty(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item-content',
      path: [0, 0],
    });

    expect(result).toBe(true);
  });

  it('should trim whitespace when checking emptiness', () => {
    const mockEntry: any = [[mockElement], [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);

    // Test various whitespace scenarios
    const testCases = [
      { text: '', expected: true },
      { text: '   ', expected: true },
      { text: '\n\t  \n', expected: true },
      { text: '  content  ', expected: false },
      { text: 'content', expected: false },
    ];

    testCases.forEach(({ text, expected }) => {
      (Editor.string as Mock).mockReturnValue(text);

      const result = isElementEmpty(editor as YooEditor, {
        blockId: 'block-1',
        type: 'accordion-list-item-content',
        path: [0, 0],
      });

      expect(result).toBe(expected);
    });
  });

  it('should match element by type correctly', () => {
    const mockEntry: any = [[mockElement], [0, 0]];
    (Editor.nodes as Mock).mockReturnValue([[mockEntry[0], mockEntry[1]]]);
    (Editor.string as Mock).mockReturnValue('');

    isElementEmpty(editor as YooEditor, {
      blockId: 'block-1',
      type: 'accordion-list-item-content',
      path: [0, 0],
    });

    const matchFn = (Editor.nodes as Mock).mock.calls[0][1].match;
    expect(matchFn(mockElement)).toBe(true);
  });
});

