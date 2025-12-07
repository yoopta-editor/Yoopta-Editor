import type {
  PluginEventHandlerOptions,
  SlateEditor,
  YooEditor,
  YooptaBlockData,
} from '@yoopta/editor';
import { Blocks, Elements, buildBlockData, buildBlockElement } from '@yoopta/editor';
import type { Path } from 'slate';
import { Editor, Element } from 'slate';

import type { BulletedListElement, NumberedListElement, TodoListElement } from '../types';

type ListNode = NumberedListElement | BulletedListElement | TodoListElement;

export function onKeyDown(
  editor: YooEditor,
  slate: SlateEditor,
  { hotkeys, defaultBlock }: PluginEventHandlerOptions,
) {
  return (event) => {
    Editor.withoutNormalizing(slate, () => {
      const block = Blocks.getBlock(editor, { at: editor.path.current });

      if (!slate.selection || !block) return;
      const selection = slate.selection;
      const { anchor } = selection;

      if (hotkeys.isCmdEnter(event)) {
        const nodeEntry = Editor.above<TodoListElement>(slate, {
          at: anchor,
          match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'todo-list',
          mode: 'highest',
        });

        if (!nodeEntry) return;

        const [todoListNode] = nodeEntry as [TodoListElement, Path];
        const checked = todoListNode.props?.checked || false;
        Elements.updateElement(editor, block.id, {
          type: 'todo-list',
          props: { checked: !checked },
        });
        return;
      }

      if (hotkeys.isEnter(event)) {
        event.preventDefault();

        const nodeEntry = Editor.above<ListNode>(slate, {
          at: anchor,
          match: (n) =>
            !Editor.isEditor(n) &&
            Element.isElement(n) &&
            (n.type === 'numbered-list' || n.type === 'bulleted-list' || n.type === 'todo-list'),
          mode: 'highest',
        });

        if (!nodeEntry) return;

        const [listNode, listPath] = nodeEntry as [ListNode, Path];

        const isEndAtNode = Editor.isEnd(slate, anchor, listPath);
        const isStartAtNode = Editor.isStart(slate, anchor, listPath);
        const text = Editor.string(slate, listPath);

        const isBlockIsInFirstDepth = block.meta.depth === 0;
        const hasText = text.trim().length > 0;

        if (!hasText) {
          if (isBlockIsInFirstDepth) {
            const currentOrder = block.meta.order;

            editor.batchOperations(() => {
              editor.deleteBlock({ blockId: block.id });
              editor.insertBlock(defaultBlock.type, {
                at: currentOrder,
                focus: true,
                blockData: defaultBlock,
              });
            });
            return;
          }

          editor.decreaseBlockDepth({ blockId: block.id });
          return;
        }

        if (isStartAtNode) {
          const prevListBlock: YooptaBlockData = buildBlockData({
            type: block.type,
            meta: { order: block.meta.order, depth: block.meta.depth },
            value: [
              buildBlockElement({
                type: listNode.type,
                props: { nodeType: 'block' },
              }),
            ],
          });

          editor.insertBlock(prevListBlock.type, {
            at: block.meta.order,
            focus: false,
            blockData: prevListBlock,
          });
          editor.setPath({ current: prevListBlock.meta.order + 1 });
          return;
        }

        if (hasText && !isStartAtNode && !isEndAtNode) {
          editor.splitBlock({ slate, focus: true });
          return;
        }

        const nextListBlock: YooptaBlockData = buildBlockData({
          type: block.type,
          meta: { order: block.meta.order + 1, depth: block.meta.depth },
          value: [
            buildBlockElement({
              type: listNode.type,
              props: { nodeType: 'block' },
            }),
          ],
        });

        editor.insertBlock(nextListBlock.type, {
          at: block.meta.order + 1,
          focus: true,
          blockData: nextListBlock,
        });
      }
    });
  };
}
