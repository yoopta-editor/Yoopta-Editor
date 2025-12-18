import type { PluginEventHandlerOptions, SlateEditor, YooEditor } from '@yoopta/editor';
import { Editor, Element, Node, Path, Range, Text, Transforms } from 'slate';

import { TableCommands } from '../commands';
import { EDITOR_TO_SELECTION } from '../utils/weakMaps';

export function onKeyDown(
  editor: YooEditor,
  slate: SlateEditor,
  { hotkeys, currentBlock }: PluginEventHandlerOptions,
) {
  return (event) => {
    if (!slate.selection) return;

    if (hotkeys.isBackspace(event)) {
      const parentPath = Path.parent(slate.selection.anchor.path);
      const isStart = Editor.isStart(slate, slate.selection.anchor, parentPath);

      const elementEntries = EDITOR_TO_SELECTION.get(slate);
      if (elementEntries) {
        event.preventDefault();

        Editor.withoutNormalizing(slate, () => {
          // just remove text in selected nodes
          for (const [, path] of elementEntries) {
            for (const [childNode, childPath] of Node.children(slate, path)) {
              if (Text.isText(childNode)) {
                const textLength = Node.string(childNode).length;
                if (textLength > 0) {
                  Transforms.delete(slate, {
                    at: {
                      anchor: { path: childPath, offset: 0 },
                      focus: { path: childPath, offset: textLength },
                    },
                  });
                }
              }
            }
          }

          Transforms.select(slate, { path: elementEntries[0][1].concat(0), offset: 0 });
        });
        return;
      }

      if (isStart && Range.isCollapsed(slate.selection)) {
        event.preventDefault();
        return;
      }
    }

    // add new row before current row
    if (hotkeys.isCmdShiftEnter(event)) {
      event.preventDefault();
      TableCommands.insertTableRow(editor, currentBlock.id, { select: true, insertMode: 'before' });
      return;
    }

    // add new row after current row
    if (hotkeys.isShiftEnter(event)) {
      event.preventDefault();
      TableCommands.insertTableRow(editor, currentBlock.id, { select: true, insertMode: 'after' });
      return;
    }

    if (hotkeys.isCmdShiftRight(event)) {
      event.preventDefault();
      TableCommands.insertTableColumn(editor, currentBlock.id, {
        select: true,
        insertMode: 'after',
      });
      return;
    }

    if (hotkeys.isCmdShiftLeft(event)) {
      event.preventDefault();
      TableCommands.insertTableColumn(editor, currentBlock.id, {
        select: true,
        insertMode: 'before',
      });
      return;
    }

    if (hotkeys.isCmdShiftDelete(event)) {
      event.preventDefault();
      TableCommands.deleteTableRow(editor, currentBlock.id);
      return;
    }

    if (hotkeys.isCmdAltDelete(event)) {
      event.preventDefault();
      TableCommands.deleteTableColumn(editor, currentBlock.id);
      return;
    }

    if (hotkeys.isArrowUp(event)) {
      event.preventDefault();

      const dataCellEntry = Editor.above(slate, {
        at: slate.selection.anchor,
        match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
      });

      if (!dataCellEntry) return;
      const [, dataCellpath] = dataCellEntry;

      try {
        const columnIndex = dataCellpath[dataCellpath.length - 1];
        const prevRowPath = Path.previous(dataCellpath.slice(0, -1));
        const prevDataCellPath = prevRowPath.concat(columnIndex);

        // throws error if no node found in the path
        Editor.node(slate, prevDataCellPath);
        Transforms.select(slate, prevDataCellPath);
      } catch (error) {}

      return;
    }

    if (hotkeys.isArrowDown(event)) {
      event.preventDefault();

      const dataCellEntry = Editor.above(slate, {
        at: slate.selection.anchor,
        match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
      });

      if (!dataCellEntry) return;
      const [, dataCellpath] = dataCellEntry;

      try {
        const columnIndex = dataCellpath[dataCellpath.length - 1];
        const nextRowPath = Path.next(dataCellpath.slice(0, -1));
        const nextDataCellPath = nextRowPath.concat(columnIndex);

        // throws error if no node found in the path
        Editor.node(slate, nextDataCellPath);
        Transforms.select(slate, nextDataCellPath);
      } catch {
        // ignore
      }

      return;
    }

    if (hotkeys.isEnter(event)) {
      event.preventDefault();
      Transforms.insertText(slate, '\n');
    }

    // if first select then select the whole table
    if (hotkeys.isSelect(event)) {
      const tdElementEntry = Editor.above(slate, {
        match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
      });

      if (tdElementEntry) {
        event.preventDefault();
        const [, tdElementPath] = tdElementEntry;
        const string = Editor.string(slate, tdElementPath);

        if (Range.isExpanded(slate.selection) || string.length === 0) {
          editor.blur();
          editor.setPath({ current: null, selected: [currentBlock.meta.order] });
          return;
        }

        Transforms.select(slate, tdElementPath);
      }
    }

    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'h') {
      event.preventDefault();
      TableCommands.toggleHeaderRow(editor, currentBlock.id);
    }

    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'v') {
      event.preventDefault();
      TableCommands.toggleHeaderColumn(editor, currentBlock.id);
    }
  };
}
