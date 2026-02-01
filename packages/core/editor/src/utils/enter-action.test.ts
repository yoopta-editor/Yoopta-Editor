import { Editor, Element, Range, Transforms } from 'slate';
import type { Path } from 'slate';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { executeEnterAction, getEnterAction } from './enter-action';
import { findSlateBySelectionPath } from './findSlateBySelectionPath';
import { Blocks } from '../editor/blocks';
import { Paths } from '../editor/paths';
import type { SlateEditor, SlateElement, YooEditor } from '../editor/types';

vi.mock('./findSlateBySelectionPath');
vi.mock('../editor/blocks');
vi.mock('../editor/paths');
vi.mock('../editor/blocks', () => ({
  Blocks: {
    getBlock: vi.fn(),
    buildBlockData: vi.fn(),
  },
}));
vi.mock('./generateId', () => ({
  generateId: vi.fn(() => 'new-block-id'),
}));
vi.mock('slate-react', () => ({}));

vi.mock('slate', () => ({
  Editor: {
    node: vi.fn(),
    above: vi.fn(),
    isStart: vi.fn(),
    isEnd: vi.fn(),
    string: vi.fn(),
    first: vi.fn(),
    last: vi.fn(),
  },
  Element: {
    isElement: vi.fn(),
  },
  Range: {
    isCollapsed: vi.fn(),
    isExpanded: vi.fn(),
  },
  Transforms: {
    delete: vi.fn(),
    insertText: vi.fn(),
    splitNodes: vi.fn(),
    insertNodes: vi.fn(),
    removeNodes: vi.fn(),
  },
  Path: {
    parent: (path: Path) => path.slice(0, -1),
  },
}));

describe('enter-action', () => {
  let editor: Partial<YooEditor>;
  let slate: Partial<SlateEditor>;

  beforeEach(() => {
    vi.clearAllMocks();

    slate = {
      children: [
        {
          id: 'element-1',
          type: 'paragraph',
          children: [{ text: 'Hello world' }],
        } as SlateElement,
      ],
      selection: {
        anchor: { path: [0, 0], offset: 5 },
        focus: { path: [0, 0], offset: 5 },
      },
    } as Partial<SlateEditor>;

    editor = {
      path: { current: 0 },
      plugins: {
        Paragraph: {
          type: 'Paragraph',
          elements: {
            paragraph: {
              asRoot: true,
              render: vi.fn(),
              props: { nodeType: 'block' },
            },
          },
        },
        HeadingOne: {
          type: 'HeadingOne',
          elements: {
            'heading-one': {
              asRoot: true,
              render: vi.fn(),
              props: { nodeType: 'block' },
            },
          },
        },
      },
      children: {
        'block-1': {
          id: 'block-1',
          type: 'Paragraph',
          value: slate.children ?? [],
          meta: { order: 0, depth: 0, align: 'left' },
        },
      },
      splitBlock: vi.fn(),
      insertBlock: vi.fn(),
      focusBlock: vi.fn(),
      batchOperations: vi.fn((fn) => fn()),
      toggleBlock: vi.fn(),
    };

    (Blocks.getBlock as Mock).mockImplementation((_editor, { at }) => {
      if (at === 0) return _editor.children?.['block-1'] ?? null;
      return null;
    });

    (Blocks.buildBlockData as Mock).mockReturnValue({
      id: 'new-block-id',
      type: 'Paragraph',
      meta: { order: 0, depth: 0, align: 'left' },
    });

    (Paths.getNextBlockOrder as Mock).mockReturnValue(1);
    (findSlateBySelectionPath as Mock).mockReturnValue(slate);

    // Setup default Editor mocks
    (Range.isCollapsed as Mock).mockImplementation((selection) => {
      if (!selection) return false;
      return (
        selection.anchor.path[0] === selection.focus.path[0] &&
        selection.anchor.path[1] === selection.focus.path[1] &&
        selection.anchor.offset === selection.focus.offset
      );
    });

    (Element.isElement as unknown as Mock).mockImplementation(
      (node) => node && typeof node === 'object' && 'type' in node && 'children' in node,
    );

    (Editor.above as Mock).mockImplementation((_slate, { at }) => {
      const path = at.path || at;
      if (path.length === 0) return null;
      const elementPath = path.slice(0, -1);
      if (elementPath.length === 0) return null;
      const element = _slate.children?.[elementPath[0]];
      if (element) {
        return [element, elementPath];
      }
      return null;
    });

    (Editor.isStart as Mock).mockImplementation((_slate, point, path) => {
      if (path.length === 0) {
        return point.path.length === 1 && point.path[0] === 0 && point.offset === 0;
      }
      return (
        point.path.length === path.length &&
        point.path.every((p, i) => p === path[i]) &&
        point.offset === 0
      );
    });

    (Editor.isEnd as Mock).mockImplementation((_slate, point, path) => {
      if (path.length === 0) {
        const text = (Editor.string as Mock)(_slate, []);
        return point.path.length === 1 && point.path[0] === 0 && point.offset === text.length;
      }
      const text = (Editor.string as Mock)(_slate, path);
      return (
        point.path.length === path.length &&
        point.path.every((p, i) => p === path[i]) &&
        point.offset === text.length
      );
    });

    (Editor.string as Mock).mockImplementation((_slate, path) => {
      if (path.length === 0) {
        return (
          _slate.children
            ?.map((child: any) => {
              if (child.children) {
                return child.children
                  .map((c: any) => (typeof c === 'string' ? c : c.text || ''))
                  .join('');
              }
              return '';
            })
            .join('') || ''
        );
      }
      const element = _slate.children?.[path[0]];
      if (element?.children) {
        return element.children
          .map((c: any) => (typeof c === 'string' ? c : c.text || ''))
          .join('');
      }
      return '';
    });

    (Editor.first as Mock).mockImplementation((_slate, path) => {
      if (path.length === 0) {
        const firstChild = _slate.children?.[0];
        if (firstChild) {
          return [firstChild, [0]];
        }
      }
      return [null, []];
    });

    (Editor.last as Mock).mockImplementation((_slate, path) => {
      if (path.length === 0) {
        const lastIndex = (_slate.children?.length ?? 1) - 1;
        const lastChild = _slate.children?.[lastIndex];
        if (lastChild) {
          return [lastChild, [lastIndex]];
        }
      }
      return [null, []];
    });

    (Editor.node as Mock).mockImplementation((_slate, path) => {
      if (path.length === 0) return [_slate, []];
      const element = _slate.children?.[path[0]];
      if (element) {
        return [element, path];
      }
      throw new Error('Node not found');
    });
  });

  describe('getEnterAction', () => {
    describe('No selection', () => {
      it('should return prevent action when there is no selection', () => {
        slate.selection = null;

        const result = getEnterAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'prevent' });
      });
    });

    describe('Expanded selection', () => {
      it('should delete selection and continue', () => {
        slate.selection = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 5 },
        };

        (Range.isCollapsed as Mock).mockReturnValue(false);

        const result = getEnterAction(editor as YooEditor, slate as SlateEditor);

        expect(Transforms.delete).toHaveBeenCalledWith(slate, { at: slate.selection });
        expect(result.action).toBe('split-block');
      });
    });

    describe('Simple block', () => {
      beforeEach(() => {
        (Editor.first as Mock).mockReturnValue([
          {
            id: 'element-1',
            type: 'paragraph',
            children: [{ text: 'Hello world' }],
          },
          [0],
        ]);
        (Editor.last as Mock).mockReturnValue([
          {
            id: 'element-1',
            type: 'paragraph',
            children: [{ text: 'Hello world' }],
          },
          [0],
        ]);
      });

      it('should return split-block when cursor is in the middle', () => {
        slate.selection = {
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 0], offset: 5 },
        };

        (Editor.isStart as Mock).mockReturnValue(false);
        (Editor.isEnd as Mock).mockReturnValue(false);

        const result = getEnterAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'split-block' });
      });

      it('should return insert-block-after when cursor is at the end', () => {
        slate.selection = {
          anchor: { path: [0, 0], offset: 11 },
          focus: { path: [0, 0], offset: 11 },
        };

        (Editor.isStart as Mock).mockReturnValue(false);
        (Editor.isEnd as Mock).mockReturnValue(true);

        const result = getEnterAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'insert-block-after' });
      });

      it('should return insert-block-before when cursor is at the start of non-empty block', () => {
        slate.selection = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        (Editor.isStart as Mock).mockReturnValue(true);
        (Editor.isEnd as Mock).mockReturnValue(false);

        const result = getEnterAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'insert-block-before' });
      });

      it('should return reset-to-paragraph when block is empty and is heading', () => {
        slate.children = [
          {
            id: 'element-1',
            type: 'heading-one',
            children: [{ text: '' }],
          } as SlateElement,
        ];
        slate.selection = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        (Blocks.getBlock as Mock).mockReturnValue({
          id: 'block-1',
          type: 'HeadingOne',
          value: slate.children,
          meta: { order: 0, depth: 0, align: 'left' },
        });
        (Editor.string as Mock).mockReturnValue('');
        (Editor.isStart as Mock).mockReturnValue(true);
        (Editor.isEnd as Mock).mockReturnValue(true);

        const result = getEnterAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'reset-to-paragraph' });
      });

      it('should return insert-block-after when block is empty and is not heading', () => {
        slate.children = [
          {
            id: 'element-1',
            type: 'paragraph',
            children: [{ text: '' }],
          } as SlateElement,
        ];
        slate.selection = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        (Editor.string as Mock).mockReturnValue('');
        (Editor.isStart as Mock).mockReturnValue(true);
        (Editor.isEnd as Mock).mockReturnValue(true);

        const result = getEnterAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'insert-block-after' });
      });
    });

    describe('Injected element', () => {
      beforeEach(() => {
        editor.plugins = {
          Callout: {
            type: 'Callout',
            elements: {
              callout: {
                asRoot: true,
                render: vi.fn(),
                props: { nodeType: 'block' },
                injectElementsFromPlugins: ['Paragraph'],
              },
              paragraph: {
                render: vi.fn(),
                props: { nodeType: 'block' },
                rootPlugin: 'Paragraph',
              },
            },
          },
          Paragraph: {
            type: 'Paragraph',
            elements: {
              paragraph: {
                asRoot: true,
                render: vi.fn(),
                props: { nodeType: 'block' },
              },
            },
          },
        };

        slate.children = [
          {
            id: 'callout-1',
            type: 'callout',
            children: [
              {
                id: 'paragraph-1',
                type: 'paragraph',
                children: [{ text: 'Hello' }],
              } as SlateElement,
            ],
          } as SlateElement,
        ];
      });

      it('should return delete-empty-injected when injected element is empty', () => {
        slate.children = [
          {
            id: 'callout-1',
            type: 'callout',
            children: [
              {
                id: 'paragraph-1',
                type: 'paragraph',
                children: [{ text: '' }],
              } as SlateElement,
            ],
          } as SlateElement,
        ];
        slate.selection = {
          anchor: { path: [0, 0, 0], offset: 0 },
          focus: { path: [0, 0, 0], offset: 0 },
        };

        (Blocks.getBlock as Mock).mockReturnValue({
          id: 'block-1',
          type: 'Callout',
          value: slate.children,
          meta: { order: 0, depth: 0, align: 'left' },
        });
        (Editor.above as Mock).mockReturnValue([
          {
            id: 'paragraph-1',
            type: 'paragraph',
            children: [{ text: '' }],
          },
          [0, 0],
        ]);
        (Editor.node as Mock).mockImplementation((_slate, path) => {
          if (path.length === 3 && path[0] === 0 && path[1] === 0 && path[2] === 0) {
            return [{ text: '' }, path];
          }
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return [
              {
                id: 'paragraph-1',
                type: 'paragraph',
                children: [{ text: '' }],
              },
              path,
            ];
          }
          if (path.length === 1 && path[0] === 0) {
            return [
              {
                id: 'callout-1',
                type: 'callout',
                children: [
                  {
                    id: 'paragraph-1',
                    type: 'paragraph',
                    children: [{ text: '' }],
                  },
                ],
              },
              path,
            ];
          }
          if (path.length === 0) {
            return [_slate, []];
          }
          throw new Error(`Node not found at path ${JSON.stringify(path)}`);
        });
        (Editor.string as Mock).mockImplementation((_slate, path) => {
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return '';
          }
          return '';
        });

        const result = getEnterAction(editor as YooEditor, slate as SlateEditor);

        expect(result.action).toBe('delete-empty-injected');
        if (result.action === 'delete-empty-injected') {
          expect(result.path).toEqual([0, 0]);
        }
      });

      it('should return exit-injected-element when cursor is at the end of injected element', () => {
        slate.selection = {
          anchor: { path: [0, 0, 0], offset: 5 },
          focus: { path: [0, 0, 0], offset: 5 },
        };

        (Blocks.getBlock as Mock).mockReturnValue({
          id: 'block-1',
          type: 'Callout',
          value: slate.children,
          meta: { order: 0, depth: 0, align: 'left' },
        });
        (Editor.above as Mock).mockReturnValue([
          {
            id: 'paragraph-1',
            type: 'paragraph',
            children: [{ text: 'Hello' }],
          },
          [0, 0],
        ]);
        (Editor.isEnd as Mock).mockImplementation((_slate, point, path) => {
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return point.offset === 5;
          }
          return false;
        });
        (Editor.node as Mock).mockImplementation((_slate, path) => {
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return [
              {
                id: 'paragraph-1',
                type: 'paragraph',
                children: [{ text: 'Hello' }],
              },
              path,
            ];
          }
          if (path.length === 1 && path[0] === 0) {
            return [
              {
                id: 'callout-1',
                type: 'callout',
                children: [
                  {
                    id: 'paragraph-1',
                    type: 'paragraph',
                    children: [{ text: 'Hello' }],
                  },
                ],
              },
              path,
            ];
          }
          if (path.length === 0) {
            return [_slate, []];
          }
          throw new Error(`Node not found at path ${JSON.stringify(path)}`);
        });
        (Editor.string as Mock).mockImplementation((_slate, path) => {
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return 'Hello';
          }
          return '';
        });

        const result = getEnterAction(editor as YooEditor, slate as SlateEditor);

        expect(result.action).toBe('exit-injected-element');
        if (result.action === 'exit-injected-element') {
          expect(result.injectedPath).toEqual([0, 0]);
          expect(result.parentLeafPath).toBeDefined();
        }
      });

      it('should return split-injected-element when cursor is in the middle of splittable element', () => {
        slate.selection = {
          anchor: { path: [0, 0, 0], offset: 3 },
          focus: { path: [0, 0, 0], offset: 3 },
        };

        (Blocks.getBlock as Mock).mockReturnValue({
          id: 'block-1',
          type: 'Callout',
          value: slate.children,
          meta: { order: 0, depth: 0, align: 'left' },
        });
        (Editor.above as Mock).mockReturnValue([
          {
            id: 'paragraph-1',
            type: 'paragraph',
            children: [{ text: 'Hello' }],
          },
          [0, 0],
        ]);
        (Editor.isStart as Mock).mockImplementation((_slate, point, path) => {
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return point.offset === 0;
          }
          return false;
        });
        (Editor.isEnd as Mock).mockImplementation((_slate, point, path) => {
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return point.offset === 5;
          }
          return false;
        });
        (Editor.string as Mock).mockImplementation((_slate, path) => {
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return 'Hello';
          }
          return '';
        });
        (Editor.node as Mock).mockImplementation((_slate, path) => {
          if (path.length === 3 && path[0] === 0 && path[1] === 0 && path[2] === 0) {
            return [{ text: 'Hello' }, path];
          }
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return [
              {
                id: 'paragraph-1',
                type: 'paragraph',
                children: [{ text: 'Hello' }],
              },
              path,
            ];
          }
          if (path.length === 1 && path[0] === 0) {
            return [
              {
                id: 'callout-1',
                type: 'callout',
                children: [
                  {
                    id: 'paragraph-1',
                    type: 'paragraph',
                    children: [{ text: 'Hello' }],
                  },
                ],
              },
              path,
            ];
          }
          if (path.length === 0) {
            return [_slate, []];
          }
          throw new Error(`Node not found at path ${JSON.stringify(path)}`);
        });

        const result = getEnterAction(editor as YooEditor, slate as SlateEditor);

        expect(result.action).toBe('split-injected-element');
        if (result.action === 'split-injected-element') {
          expect(result.path).toEqual([0, 0]);
        }
      });

      it('should return insert-soft-break when injected element cannot be split', () => {
        editor.plugins = {
          Callout: {
            type: 'Callout',
            elements: {
              callout: {
                asRoot: true,
                render: vi.fn(),
                props: { nodeType: 'block' },
                injectElementsFromPlugins: ['Code'],
              },
              code: {
                render: vi.fn(),
                props: { nodeType: 'block' },
                rootPlugin: 'Code',
              },
            },
          },
          Code: {
            type: 'Code',
            elements: {
              code: {
                asRoot: true,
                render: vi.fn(),
                props: { nodeType: 'block' },
              },
            },
          },
        };

        slate.children = [
          {
            id: 'callout-1',
            type: 'callout',
            children: [
              {
                id: 'code-1',
                type: 'code',
                children: [{ text: 'code' }],
              } as SlateElement,
            ],
          } as SlateElement,
        ];
        slate.selection = {
          anchor: { path: [0, 0, 0], offset: 2 },
          focus: { path: [0, 0, 0], offset: 2 },
        };

        (Blocks.getBlock as Mock).mockReturnValue({
          id: 'block-1',
          type: 'Callout',
          value: slate.children,
          meta: { order: 0, depth: 0, align: 'left' },
        });
        (Editor.above as Mock).mockReturnValue([
          {
            id: 'code-1',
            type: 'code',
            children: [{ text: 'code' }],
          },
          [0, 0],
        ]);
        (Editor.isStart as Mock).mockImplementation((_slate, point, path) => {
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return point.offset === 0;
          }
          return false;
        });
        (Editor.isEnd as Mock).mockImplementation((_slate, point, path) => {
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return point.offset === 4;
          }
          return false;
        });
        (Editor.string as Mock).mockImplementation((_slate, path) => {
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return 'code';
          }
          return '';
        });
        (Editor.node as Mock).mockImplementation((_slate, path) => {
          if (path.length === 3 && path[0] === 0 && path[1] === 0 && path[2] === 0) {
            return [{ text: 'code' }, path];
          }
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return [
              {
                id: 'code-1',
                type: 'code',
                children: [{ text: 'code' }],
              },
              path,
            ];
          }
          if (path.length === 1 && path[0] === 0) {
            return [
              {
                id: 'callout-1',
                type: 'callout',
                children: [
                  {
                    id: 'code-1',
                    type: 'code',
                    children: [{ text: 'code' }],
                  },
                ],
              },
              path,
            ];
          }
          if (path.length === 0) {
            return [_slate, []];
          }
          throw new Error(`Node not found at path ${JSON.stringify(path)}`);
        });

        const result = getEnterAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'insert-soft-break' });
      });
    });

    describe('Complex plugin', () => {
      it('should return delegate-to-plugin for complex plugins', () => {
        editor.plugins = {
          Steps: {
            type: 'Steps',
            elements: {
              'step-container': {
                asRoot: true,
                render: vi.fn(),
                props: { nodeType: 'block' },
                children: ['step-list'] as any,
              },
              'step-list': {
                render: vi.fn(),
                props: { nodeType: 'block' },
                children: ['step-list-item'] as any,
              },
            },
          },
        };

        slate.children = [
          {
            id: 'step-container-1',
            type: 'step-container',
            children: [
              {
                id: 'step-list-1',
                type: 'step-list',
                children: [],
              } as SlateElement,
            ],
          } as SlateElement,
        ];
        slate.selection = {
          anchor: { path: [0, 0, 0], offset: 0 },
          focus: { path: [0, 0, 0], offset: 0 },
        };

        (Blocks.getBlock as Mock).mockReturnValue({
          id: 'block-1',
          type: 'Steps',
          value: slate.children,
          meta: { order: 0, depth: 0, align: 'left' },
        });
        (Editor.above as Mock).mockReturnValue([
          {
            id: 'step-list-1',
            type: 'step-list',
            children: [],
          },
          [0, 0],
        ]);
        (Editor.node as Mock).mockImplementation((_slate, path) => {
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return [
              {
                id: 'step-list-1',
                type: 'step-list',
                children: [],
              },
              path,
            ];
          }
          if (path.length === 1 && path[0] === 0) {
            return [
              {
                id: 'step-container-1',
                type: 'step-container',
                children: [
                  {
                    id: 'step-list-1',
                    type: 'step-list',
                    children: [],
                  },
                ],
              },
              path,
            ];
          }
          if (path.length === 0) {
            return [_slate, []];
          }
          throw new Error(`Node not found at path ${JSON.stringify(path)}`);
        });

        const result = getEnterAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'delegate-to-plugin' });
      });
    });
  });

  describe('executeEnterAction', () => {
    beforeEach(() => {
      slate.selection = {
        anchor: { path: [0, 0], offset: 5 },
        focus: { path: [0, 0], offset: 5 },
      };
    });

    it('should split block', () => {
      const result = { action: 'split-block' as const };

      executeEnterAction(editor as YooEditor, slate as SlateEditor, result);

      expect(editor.splitBlock).toHaveBeenCalledWith({ focus: true });
    });

    it('should insert block after', () => {
      const result = { action: 'insert-block-after' as const };

      executeEnterAction(editor as YooEditor, slate as SlateEditor, result);

      expect(editor.insertBlock).toHaveBeenCalledWith('Paragraph' as any, {
        at: 1,
        focus: true,
      });
    });

    it('should insert block before', () => {
      const result = { action: 'insert-block-before' as const };

      (Blocks.getBlock as Mock).mockReturnValue({
        id: 'block-1',
        type: 'Paragraph',
        value: slate.children,
        meta: { order: 0, depth: 0, align: 'left' },
      });

      executeEnterAction(editor as YooEditor, slate as SlateEditor, result);

      expect(editor.batchOperations).toHaveBeenCalled();
      expect(editor.insertBlock).toHaveBeenCalledWith('Paragraph' as any, {
        at: 0,
        focus: false,
      });
      expect(editor.focusBlock).toHaveBeenCalledWith('block-1');
    });

    it('should insert soft break', () => {
      const result = { action: 'insert-soft-break' as const };

      executeEnterAction(editor as YooEditor, slate as SlateEditor, result);

      expect(Transforms.insertText).toHaveBeenCalledWith(slate, '\n');
    });

    it('should split injected element', () => {
      const result = {
        action: 'split-injected-element' as const,
        path: [0, 0] as Path,
      };

      (Blocks.getBlock as Mock).mockReturnValue({
        id: 'block-1',
        type: 'Callout',
        value: slate.children,
        meta: { order: 0, depth: 0, align: 'left' },
      });

      executeEnterAction(editor as YooEditor, slate as SlateEditor, result);

      expect(Transforms.splitNodes).toHaveBeenCalled();
    });

    it('should exit injected element', () => {
      const result = {
        action: 'exit-injected-element' as const,
        injectedPath: [0, 0] as Path,
        parentLeafPath: [0] as Path,
      };

      executeEnterAction(editor as YooEditor, slate as SlateEditor, result);

      expect(Transforms.insertNodes).toHaveBeenCalledWith(
        slate,
        { text: '' },
        {
          at: [0, 1],
          select: true,
        },
      );
    });

    it('should delete empty injected element', () => {
      const result = {
        action: 'delete-empty-injected' as const,
        path: [0, 0] as Path,
      };

      executeEnterAction(editor as YooEditor, slate as SlateEditor, result);

      expect(Transforms.removeNodes).toHaveBeenCalledWith(slate, { at: [0, 0] });
    });

    it('should reset to paragraph', () => {
      const result = { action: 'reset-to-paragraph' as const };

      executeEnterAction(editor as YooEditor, slate as SlateEditor, result);

      expect(editor.toggleBlock).toHaveBeenCalledWith('Paragraph', { focus: true });
    });

    it('should do nothing for delegate-to-plugin action', () => {
      const result = { action: 'delegate-to-plugin' as const };

      executeEnterAction(editor as YooEditor, slate as SlateEditor, result);

      expect(editor.splitBlock).not.toHaveBeenCalled();
      expect(editor.insertBlock).not.toHaveBeenCalled();
      expect(Transforms.insertText).not.toHaveBeenCalled();
    });

    it('should do nothing for default action', () => {
      const result = { action: 'default' as const };

      executeEnterAction(editor as YooEditor, slate as SlateEditor, result);

      expect(editor.splitBlock).not.toHaveBeenCalled();
      expect(editor.insertBlock).not.toHaveBeenCalled();
      expect(Transforms.insertText).not.toHaveBeenCalled();
    });

    it('should do nothing for prevent action', () => {
      const result = { action: 'prevent' as const };

      executeEnterAction(editor as YooEditor, slate as SlateEditor, result);

      expect(editor.splitBlock).not.toHaveBeenCalled();
      expect(editor.insertBlock).not.toHaveBeenCalled();
      expect(Transforms.insertText).not.toHaveBeenCalled();
    });
  });
});
