import { Path } from 'slate';
import { ReactEditor } from 'slate-react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { getParentElementPath } from './getParentElementPath';
import { findSlateBySelectionPath } from '../../utils/findSlateBySelectionPath';
import type { SlateElement, YooEditor } from '../types';

vi.mock('../../utils/findSlateBySelectionPath');
vi.mock('slate-react', () => ({
  ReactEditor: {
    findPath: vi.fn(),
  },
}));
vi.mock('slate', () => ({
  Path: {
    parent: vi.fn(),
  },
}));

describe('getParentElementPath', () => {
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
  });

  it('should return parent element path', () => {
    const elementPath = [0, 1, 2];
    const parentPath = [0, 1];
    (ReactEditor.findPath as Mock).mockReturnValue(elementPath);
    (Path.parent as Mock).mockReturnValue(parentPath);

    const result = getParentElementPath(editor as YooEditor, {
      blockId: 'block-1',
      element: mockElement,
    });

    expect(result).toEqual(parentPath);
    expect(ReactEditor.findPath).toHaveBeenCalledWith(mockSlate, mockElement);
    expect(Path.parent).toHaveBeenCalledWith(elementPath);
  });

  it('should return null when block not found', () => {
    const result = getParentElementPath(editor as YooEditor, {
      blockId: 'non-existent',
      element: mockElement,
    });

    expect(result).toBeNull();
    expect(ReactEditor.findPath).not.toHaveBeenCalled();
  });

  it('should return null when slate not found', () => {
    (findSlateBySelectionPath as Mock).mockReturnValue(undefined);

    const result = getParentElementPath(editor as YooEditor, {
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

    const result = getParentElementPath(editor as YooEditor, {
      blockId: 'block-1',
      element: mockElement,
    });

    expect(result).toBeNull();
    expect(Path.parent).not.toHaveBeenCalled();
  });

  it('should handle root element (path [0])', () => {
    const elementPath = [0];
    const parentPath: any = null; // Root has no parent
    (ReactEditor.findPath as Mock).mockReturnValue(elementPath);
    (Path.parent as Mock).mockReturnValue(parentPath);

    const result = getParentElementPath(editor as YooEditor, {
      blockId: 'block-1',
      element: mockElement,
    });

    expect(result).toEqual(parentPath);
  });

  it('should handle nested elements', () => {
    const elementPath = [0, 1, 2, 3];
    const parentPath = [0, 1, 2];
    (ReactEditor.findPath as Mock).mockReturnValue(elementPath);
    (Path.parent as Mock).mockReturnValue(parentPath);

    const result = getParentElementPath(editor as YooEditor, {
      blockId: 'block-1',
      element: mockElement,
    });

    expect(result).toEqual(parentPath);
  });

  it('should not log warning in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    (ReactEditor.findPath as Mock).mockImplementation(() => {
      throw new Error('Element not found');
    });

    getParentElementPath(editor as YooEditor, {
      blockId: 'block-1',
      element: mockElement,
    });

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });
});
