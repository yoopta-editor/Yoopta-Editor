import { Editor, Element, Range, Transforms } from 'slate';
import type { Path } from 'slate';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { executeBackspaceAction, getBackspaceAction } from './execute-backspace-action';
import { findSlateBySelectionPath } from './findSlateBySelectionPath';
import { getLastNodePoint } from './get-node-points';
import { Blocks } from '../editor/blocks';
import { Paths } from '../editor/paths';
import type { SlateEditor, SlateElement, YooEditor } from '../editor/types';

vi.mock('./findSlateBySelectionPath');
vi.mock('./get-node-points');
vi.mock('../editor/blocks');
vi.mock('../editor/paths');
vi.mock('slate-react', () => ({}));

vi.mock('slate', () => ({
  Editor: {
    node: vi.fn(),
    above: vi.fn(),
    isStart: vi.fn(),
    isEnd: vi.fn(),
    string: vi.fn(),
    end: vi.fn(),
    range: vi.fn(),
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
    removeNodes: vi.fn(),
    select: vi.fn(),
  },
  Path: {
    parent: (path: Path) => path.slice(0, -1),
  },
}));

describe('execute-backspace-action', () => {
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
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
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
      deleteBlock: vi.fn(),
      mergeBlock: vi.fn(),
      focusBlock: vi.fn(),
    };

    (Blocks.getBlock as Mock).mockImplementation((_editor, { at }) => {
      if (at === 0) return _editor.children?.['block-1'] ?? null;
      return null;
    });

    (Paths.getPreviousBlockOrder as Mock).mockReturnValue(null);
    (findSlateBySelectionPath as Mock).mockReturnValue(slate);
    (getLastNodePoint as Mock).mockReturnValue({ path: [0, 0], offset: 11 });

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

    (Editor.node as Mock).mockImplementation((_slate, path) => {
      if (path.length === 0) return [_slate, []];
      const element = _slate.children?.[path[0]];
      if (element) {
        return [element, path];
      }
      throw new Error('Node not found');
    });

    (Editor.end as Mock).mockImplementation((_slate, path) => {
      const text = (Editor.string as Mock)(_slate, path);
      return {
        path,
        offset: text.length,
      };
    });

    // Path.parent is already mocked in vi.mock('slate')
  });

  describe('getBackspaceAction', () => {
    describe('No selection', () => {
      it('should return prevent action when there is no selection', () => {
        slate.selection = null;

        const result = getBackspaceAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'prevent' });
      });
    });

    describe('Expanded selection', () => {
      it('should return default action when selection is expanded', () => {
        slate.selection = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 5 },
        };

        const result = getBackspaceAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'default' });
      });
    });

    describe('Cursor not at element start', () => {
      it('should return default action when cursor is not at element start', () => {
        slate.selection = {
          anchor: { path: [0, 0], offset: 5 },
          focus: { path: [0, 0], offset: 5 },
        };

        (Editor.isStart as Mock).mockReturnValue(false);

        const result = getBackspaceAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'default' });
      });
    });

    describe('Simple block - empty block at start', () => {
      it('should return delete-block when block is empty and has previous block', () => {
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

        (Paths.getPreviousBlockOrder as Mock).mockReturnValue(-1);
        (Editor.isStart as Mock).mockReturnValue(true);

        const result = getBackspaceAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'delete-block' });
      });

      it('should return prevent when block is empty and is first block', () => {
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

        (Paths.getPreviousBlockOrder as Mock).mockReturnValue(null);
        (Editor.isStart as Mock).mockReturnValue(true);

        const result = getBackspaceAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'prevent' });
      });
    });

    describe('Simple block - non-empty block at start', () => {
      it('should return merge-with-previous-block when blocks are mergeable', () => {
        slate.selection = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        (Paths.getPreviousBlockOrder as Mock).mockReturnValue(-1);
        (Editor.isStart as Mock).mockReturnValue(true);
        (Blocks.getBlock as Mock).mockImplementation((_editor, { at }) => {
          if (at === 0)
            return {
              id: 'block-1',
              type: 'Paragraph',
              value: slate.children,
              meta: { order: 0, depth: 0, align: 'left' },
            };
          if (at === -1)
            return {
              id: 'block-0',
              type: 'Paragraph',
              value: [],
              meta: { order: -1, depth: 0, align: 'left' },
            };
          return null;
        });

        const result = getBackspaceAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'merge-with-previous-block' });
      });

      it('should return move-to-previous-block when blocks are not mergeable', () => {
        slate.selection = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        (Paths.getPreviousBlockOrder as Mock).mockReturnValue(-1);
        (Editor.isStart as Mock).mockReturnValue(true);
        (Blocks.getBlock as Mock).mockImplementation((_editor, { at }) => {
          if (at === 0)
            return {
              id: 'block-1',
              type: 'Paragraph',
              value: slate.children,
              meta: { order: 0, depth: 0, align: 'left' },
            };
          if (at === -1)
            return {
              id: 'block-0',
              type: 'Code',
              value: [],
              meta: { order: -1, depth: 0, align: 'left' },
            };
          return null;
        });

        const result = getBackspaceAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'move-to-previous-block' });
      });

      it('should return merge-with-previous-block when nodeType is undefined (defaults to block)', () => {
        // Test that plugins without explicit nodeType (which defaults to 'block') are mergeable
        editor.plugins = {
          Paragraph: {
            type: 'Paragraph',
            elements: {
              paragraph: {
                asRoot: true,
                render: vi.fn(),
                // No explicit nodeType - should default to 'block'
              },
            },
          },
          HeadingOne: {
            type: 'HeadingOne',
            elements: {
              'heading-one': {
                asRoot: true,
                render: vi.fn(),
                // No explicit nodeType - should default to 'block'
              },
            },
          },
        };

        slate.selection = {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        };

        (Paths.getPreviousBlockOrder as Mock).mockReturnValue(-1);
        (Editor.isStart as Mock).mockReturnValue(true);
        (Blocks.getBlock as Mock).mockImplementation((_editor, { at }) => {
          if (at === 0)
            return {
              id: 'block-1',
              type: 'Paragraph',
              value: slate.children,
              meta: { order: 0, depth: 0, align: 'left' },
            };
          if (at === -1)
            return {
              id: 'block-0',
              type: 'HeadingOne',
              value: [],
              meta: { order: -1, depth: 0, align: 'left' },
            };
          return null;
        });

        const result = getBackspaceAction(editor as YooEditor, slate as SlateEditor);

        expect(result).toEqual({ action: 'merge-with-previous-block' });
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
                children: [{ text: '' }],
              } as SlateElement,
            ],
          } as SlateElement,
        ];
      });

      it('should return delete-injected-element when injected element is empty', () => {
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
        (Editor.isStart as Mock).mockReturnValue(true);
        (Editor.above as Mock).mockReturnValue([
          {
            id: 'paragraph-1',
            type: 'paragraph',
            children: [{ text: '' }],
          },
          [0, 0],
        ]);

        // Mock Editor.node for findInjectedAncestor traversal
        (Editor.node as Mock).mockImplementation((_slate, path) => {
          // Path [0, 0, 0] - text node
          if (path.length === 3 && path[0] === 0 && path[1] === 0 && path[2] === 0) {
            return [{ text: '' }, path];
          }
          // Path [0, 0] - paragraph element (injected)
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
          // Path [0] - callout element
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
          // Empty path
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

        const result = getBackspaceAction(editor as YooEditor, slate as SlateEditor);

        expect(result.action).toBe('delete-injected-element');
        if (result.action === 'delete-injected-element') {
          expect(result.path).toEqual([0, 0]);
        }
      });

      it('should return default for inline injected elements (like links)', () => {
        editor.plugins = {
          Paragraph: {
            type: 'Paragraph',
            elements: {
              paragraph: {
                asRoot: true,
                render: vi.fn(),
                props: { nodeType: 'block' },
                injectElementsFromPlugins: ['Link'],
              },
              link: {
                render: vi.fn(),
                props: { nodeType: 'inline' },
                rootPlugin: 'Link',
              },
            },
          },
          Link: {
            type: 'Link',
            elements: {
              link: {
                asRoot: true,
                render: vi.fn(),
                props: { nodeType: 'inline' },
              },
            },
          },
        };

        slate.children = [
          {
            id: 'paragraph-1',
            type: 'paragraph',
            children: [
              { text: 'Hello ' },
              {
                id: 'link-1',
                type: 'link',
                children: [{ text: 'world' }],
                props: { nodeType: 'inline', url: 'https://example.com' },
              } as SlateElement,
              { text: ' text' },
            ],
          } as SlateElement,
        ];

        // Cursor at start of link text
        slate.selection = {
          anchor: { path: [0, 1, 0], offset: 0 },
          focus: { path: [0, 1, 0], offset: 0 },
        };

        (Blocks.getBlock as Mock).mockReturnValue({
          id: 'block-1',
          type: 'Paragraph',
          value: slate.children,
          meta: { order: 0, depth: 0, align: 'left' },
        });
        (Editor.isStart as Mock).mockReturnValue(true);
        (Editor.above as Mock).mockReturnValue([
          {
            id: 'link-1',
            type: 'link',
            children: [{ text: 'world' }],
            props: { nodeType: 'inline' },
          },
          [0, 1],
        ]);

        // Mock Editor.node for findInjectedAncestor traversal
        (Editor.node as Mock).mockImplementation((_slate, path) => {
          // Path [0, 1, 0] - text node inside link
          if (path.length === 3 && path[0] === 0 && path[1] === 1 && path[2] === 0) {
            return [{ text: 'world' }, path];
          }
          // Path [0, 1] - link element (inline injected)
          if (path.length === 2 && path[0] === 0 && path[1] === 1) {
            return [
              {
                id: 'link-1',
                type: 'link',
                children: [{ text: 'world' }],
                props: { nodeType: 'inline' },
              },
              path,
            ];
          }
          // Path [0] - paragraph element
          if (path.length === 1 && path[0] === 0) {
            return [slate.children?.[0], path];
          }
          throw new Error(`Node not found at path ${JSON.stringify(path)}`);
        });

        const result = getBackspaceAction(editor as YooEditor, slate as SlateEditor);

        // Inline elements should return 'default' to let Slate handle normally
        expect(result.action).toBe('default');
      });

      it('should return move-cursor when injected element has previous sibling', () => {
        slate.children = [
          {
            id: 'callout-1',
            type: 'callout',
            children: [
              {
                id: 'paragraph-1',
                type: 'paragraph',
                children: [{ text: 'First' }],
              } as SlateElement,
              {
                id: 'paragraph-2',
                type: 'paragraph',
                children: [{ text: 'Second' }],
              } as SlateElement,
            ],
          } as SlateElement,
        ];

        slate.selection = {
          anchor: { path: [0, 1, 0], offset: 0 },
          focus: { path: [0, 1, 0], offset: 0 },
        };

        (Blocks.getBlock as Mock).mockReturnValue({
          id: 'block-1',
          type: 'Callout',
          value: slate.children,
          meta: { order: 0, depth: 0, align: 'left' },
        });
        (Editor.isStart as Mock).mockReturnValue(true);
        (Editor.above as Mock).mockReturnValue([
          {
            id: 'paragraph-2',
            type: 'paragraph',
            children: [{ text: '' }],
          },
          [0, 1],
        ]);
        (Editor.node as Mock).mockImplementation((_slate, path) => {
          // Path [0, 1, 0] - text node inside paragraph-2
          if (path.length === 3 && path[0] === 0 && path[1] === 1 && path[2] === 0) {
            return [{ text: '' }, path];
          }
          // Path [0, 1] - paragraph-2 element (injected)
          if (path.length === 2 && path[0] === 0 && path[1] === 1) {
            return [
              {
                id: 'paragraph-2',
                type: 'paragraph',
                children: [{ text: '' }],
              },
              path,
            ];
          }
          // Path [0, 0] - paragraph-1 element (injected)
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return [
              {
                id: 'paragraph-1',
                type: 'paragraph',
                children: [{ text: 'First' }],
              },
              path,
            ];
          }
          // Path [0] - callout element
          if (path.length === 1 && path[0] === 0) {
            return [
              {
                id: 'callout-1',
                type: 'callout',
                children: [
                  {
                    id: 'paragraph-1',
                    type: 'paragraph',
                    children: [{ text: 'First' }],
                  },
                  {
                    id: 'paragraph-2',
                    type: 'paragraph',
                    children: [{ text: '' }],
                  },
                ],
              },
              path,
            ];
          }
          throw new Error(`Node not found at path ${JSON.stringify(path)}`);
        });
        (Editor.string as Mock).mockImplementation((_slate, path) => {
          if (path.length === 2 && path[0] === 0 && path[1] === 1) {
            return 'Second'; // Element is not empty
          }
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return 'First';
          }
          return '';
        });
        (Editor.end as Mock).mockImplementation((_slate, path) => {
          if (path.length === 2 && path[0] === 0 && path[1] === 0) {
            return { path: [0, 0, 0], offset: 5 };
          }
          return { path: [...path, 0], offset: 0 };
        });

        const result = getBackspaceAction(editor as YooEditor, slate as SlateEditor);

        expect(result.action).toBe('move-cursor');
      });
    });
  });

  describe('executeBackspaceAction', () => {
    beforeEach(() => {
      slate.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      };
    });

    it('should delete injected element', () => {
      const result = {
        action: 'delete-injected-element' as const,
        path: [0, 0] as Path,
      };

      executeBackspaceAction(editor as YooEditor, slate as SlateEditor, result);

      expect(Transforms.removeNodes).toHaveBeenCalledWith(slate, { at: [0, 0] });
    });

    it('should delete block', () => {
      const result = { action: 'delete-block' as const };

      executeBackspaceAction(editor as YooEditor, slate as SlateEditor, result);

      expect(editor.deleteBlock).toHaveBeenCalledWith({
        at: 0,
        focus: true,
      });
    });

    it('should move cursor to target path', () => {
      const result = {
        action: 'move-cursor' as const,
        targetPath: [0, 0] as Path,
      };

      (Editor.end as Mock).mockReturnValue({
        path: [0, 0],
        offset: 11,
      });

      executeBackspaceAction(editor as YooEditor, slate as SlateEditor, result);

      expect(Editor.end).toHaveBeenCalledWith(slate, [0, 0]);
      expect(Transforms.select).toHaveBeenCalledWith(slate, {
        path: [0, 0],
        offset: 11,
      });
    });

    it('should move to previous block', () => {
      const result = { action: 'move-to-previous-block' as const };

      (Paths.getPreviousBlockOrder as Mock).mockReturnValue(-1);
      (Blocks.getBlock as Mock).mockImplementation((_editor, { at }) => {
        if (at === -1)
          return {
            id: 'block-0',
            type: 'Paragraph',
            value: [],
            meta: { order: -1, depth: 0, align: 'left' },
          };
        return null;
      });
      (findSlateBySelectionPath as Mock).mockReturnValue(slate);

      executeBackspaceAction(editor as YooEditor, slate as SlateEditor, result);

      expect(editor.focusBlock).toHaveBeenCalledWith('block-0', {
        focusAt: { path: [0, 0], offset: 11 },
        waitExecution: false,
        shouldUpdateBlockPath: true,
      });
    });

    it('should merge with previous block', () => {
      const result = { action: 'merge-with-previous-block' as const };

      executeBackspaceAction(editor as YooEditor, slate as SlateEditor, result);

      expect(editor.mergeBlock).toHaveBeenCalled();
    });

    it('should do nothing for default action', () => {
      const result = { action: 'default' as const };

      executeBackspaceAction(editor as YooEditor, slate as SlateEditor, result);

      expect(editor.deleteBlock).not.toHaveBeenCalled();
      expect(editor.mergeBlock).not.toHaveBeenCalled();
      expect(editor.focusBlock).not.toHaveBeenCalled();
    });

    it('should do nothing for prevent action', () => {
      const result = { action: 'prevent' as const };

      executeBackspaceAction(editor as YooEditor, slate as SlateEditor, result);

      expect(editor.deleteBlock).not.toHaveBeenCalled();
      expect(editor.mergeBlock).not.toHaveBeenCalled();
      expect(editor.focusBlock).not.toHaveBeenCalled();
    });
  });
});
