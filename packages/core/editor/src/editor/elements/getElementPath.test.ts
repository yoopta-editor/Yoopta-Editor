import { type Mock, vi, describe, it, expect, beforeEach } from 'vitest';
import { ReactEditor } from 'slate-react';

import { getElementPath } from './getElementPath';
import type { SlateElement, YooEditor } from '../types';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';

vi.mock('../../utils/findSlateBySelectionPath');
vi.mock('slate-react', () => ({
  ReactEditor: {
    findPath: vi.fn(),
  },
}));

describe('getElementPath', () => {
  let editor: Partial<YooEditor>;
  let mockSlate: any;
  let mockElement: SlateElement;
  let mockBlock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockElement = {
      id: 'element-1',
      type: 'accordion-list-item',
      props: { isExpanded: true },
      children: [{ text: 'Item 1' }],
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
  });

  it('should return element path', () => {
    const expectedPath = [0, 0];
    (ReactEditor.findPath as Mock).mockReturnValue(expectedPath);

    const result = getElementPath(editor as YooEditor, {
      blockId: 'block-1',
      element: mockElement,
    });

    expect(result).toEqual(expectedPath);
    expect(ReactEditor.findPath).toHaveBeenCalledWith(mockSlate, mockElement);
  });

  it('should return null when block not found', () => {
    const result = getElementPath(editor as YooEditor, {
      blockId: 'non-existent',
      element: mockElement,
    });

    expect(result).toBeNull();
    expect(ReactEditor.findPath).not.toHaveBeenCalled();
  });

  it('should return null when slate not found', () => {
    (findSlateBySelectionPath as Mock).mockReturnValue(undefined);

    const result = getElementPath(editor as YooEditor, {
      blockId: 'block-1',
      element: mockElement,
    });

    expect(result).toBeNull();
    expect(ReactEditor.findPath).not.toHaveBeenCalled();
  });

  it('should return null when element not found in slate', () => {
    (ReactEditor.findPath as Mock).mockImplementation(() => {
      throw new Error('Element not found');
    });

    const result = getElementPath(editor as YooEditor, {
      blockId: 'block-1',
      element: mockElement,
    });

    expect(result).toBeNull();
  });

  it('should handle different path formats', () => {
    const paths = [
      [0],
      [0, 0],
      [0, 1, 2],
      [1, 0, 3, 2],
    ];

    paths.forEach((path) => {
      (ReactEditor.findPath as Mock).mockReturnValue(path);

      const result = getElementPath(editor as YooEditor, {
        blockId: 'block-1',
        element: mockElement,
      });

      expect(result).toEqual(path);
    });
  });

  it('should not log warning in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    (ReactEditor.findPath as Mock).mockImplementation(() => {
      throw new Error('Element not found');
    });

    getElementPath(editor as YooEditor, {
      blockId: 'block-1',
      element: mockElement,
    });

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });
});

