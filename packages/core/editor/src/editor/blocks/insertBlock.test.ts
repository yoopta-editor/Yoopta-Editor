import { type Mock, vi } from 'vitest';

import { insertBlock } from './insertBlock';
import type { PluginElement } from '../../plugins/types';
import { buildBlockElementsStructure } from '../../utils/block-elements';
import type { SlateElement, YooEditor, YooptaBlockBaseMeta } from '../types';

vi.mock('../../utils/block-elements', () => ({
  buildBlockElementsStructure: vi.fn(),
}));

vi.mock('../../utils/generateId', () => ({
  generateId: vi.fn(() => 'test-id'),
}));

describe('insertBlock', () => {
  let editor: Partial<YooEditor>;
  let mockSlateStructure: SlateElement;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSlateStructure = {
      id: 'test-id',
      type: 'test-type',
      children: [{ text: '' }],
    };

    (buildBlockElementsStructure as Mock).mockReturnValue(mockSlateStructure);

    // Setup editor mock
    editor = {
      path: { current: 0 },
      plugins: {
        TestBlock: {
          type: 'TestBlock',
          elements: {
            root: {
              props: { nodeType: 'block' },
            } as PluginElement<string, any>,
          },
          events: {
            onBeforeCreate: vi.fn(),
            onCreate: vi.fn(),
          },
        },
      },
      children: {},
      blockEditorsMap: {},
      applyTransforms: vi.fn(),
      focusBlock: vi.fn(),
    };
  });

  it('should insert a basic block', () => {
    const blockId = insertBlock(editor as YooEditor, 'TestBlock');

    expect(blockId).toBe('test-id');
    expect(editor.applyTransforms).toHaveBeenCalledWith([
      {
        type: 'insert_block',
        path: { current: 0 },
        block: {
          id: 'test-id',
          type: 'TestBlock',
          value: [mockSlateStructure],
          meta: {
            align: 'left',
            depth: 0,
            order: 0,
          },
        },
      },
    ]);
  });

  it('should insert a block with custom data', () => {
    const customData = {
      id: 'custom-id',
      value: [
        {
          id: 'custom-element-id',
          type: 'custom',
          children: [{ text: 'test' }],
        },
      ],
      meta: {
        align: 'center',
        depth: 1,
        order: 0,
      } as YooptaBlockBaseMeta,
    };

    const blockId = insertBlock(editor as YooEditor, 'TestBlock', {
      blockData: customData,
    });

    expect(blockId).toBe('custom-id');
    expect(editor.applyTransforms).toHaveBeenCalledWith([
      {
        type: 'insert_block',
        path: { current: 0 },
        block: {
          id: 'custom-id',
          type: 'TestBlock',
          value: customData.value,
          meta: {
            align: 'center',
            depth: 1,
            order: 0,
          },
        },
      },
    ]);
  });

  it('should insert a block at specific position', () => {
    const blockId = insertBlock(editor as YooEditor, 'TestBlock', {
      at: 2,
    });

    expect(blockId).toBe('test-id');
    expect(editor.applyTransforms).toHaveBeenCalledWith([
      {
        type: 'insert_block',
        path: { current: 2 },
        block: {
          id: 'test-id',
          type: 'TestBlock',
          value: [mockSlateStructure],
          meta: {
            align: 'left',
            depth: 0,
            order: 2,
          },
        },
      },
    ]);
  });

  it('should focus block when focus option is true', () => {
    const blockId = insertBlock(editor as YooEditor, 'TestBlock', {
      focus: true,
    });

    expect(blockId).toBe('test-id');
    expect(editor.focusBlock).toHaveBeenCalledWith('test-id');
  });

  it('should call onBeforeCreate and onCreate events', () => {
    const onBeforeCreate = vi.fn().mockReturnValue(mockSlateStructure);
    const onCreate = vi.fn();

    editor.plugins = {
      TestBlock: {
        type: 'TestBlock',
        elements: {
          root: {
            props: { nodeType: 'block' },
          } as PluginElement<string, unknown>,
        },
        events: {
          onBeforeCreate,
          onCreate,
        },
      },
    };

    const blockId = insertBlock(editor as YooEditor, 'TestBlock');

    expect(onBeforeCreate).toHaveBeenCalledWith(editor);
    expect(onCreate).toHaveBeenCalledWith(editor, blockId);
  });

  it('should use custom slate structure from blockData if provided', () => {
    const customStructure: SlateElement = {
      id: 'custom-element-id',
      type: 'custom',
      children: [{ text: 'test' }],
    };

    const blockId = insertBlock(editor as YooEditor, 'TestBlock', {
      blockData: {
        value: [customStructure],
      },
    });

    expect(buildBlockElementsStructure).not.toHaveBeenCalled();
    expect(editor.applyTransforms).toHaveBeenCalledWith([
      {
        type: 'insert_block',
        path: { current: 0 },
        block: {
          id: 'test-id',
          type: 'TestBlock',
          value: [customStructure],
          meta: {
            align: 'left',
            depth: 0,
            order: 0,
          },
        },
      },
    ]);
  });

  it('should handle editor with no current path', () => {
    editor.path = { current: null };
    editor.children = {
      'existing-block': {
        id: 'existing-block',
        type: 'TestBlock',
        value: [],
        meta: { order: 0, depth: 0 },
      },
    };

    const blockId = insertBlock(editor as YooEditor, 'TestBlock');

    expect(blockId).toBe('test-id');
    expect(editor.applyTransforms).toHaveBeenCalledWith([
      {
        type: 'insert_block',
        path: { current: 1 }, // When path.current is null, order becomes the length of children
        block: {
          id: 'test-id',
          type: 'TestBlock',
          value: [mockSlateStructure],
          meta: {
            align: 'left',
            depth: 0,
            order: 1, // Should be the length of children
          },
        },
      },
    ]);
  });
});
