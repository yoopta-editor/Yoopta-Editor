import type { CSSProperties } from 'react';
import type { SlateElement, YooEditor } from '@yoopta/editor';
import { Elements, UI } from '@yoopta/editor';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MoveLeftIcon,
  MoveRightIcon,
  TrashIcon,
} from 'lucide-react';
import { Editor, Element, Path, Transforms } from 'slate';

import { TableCommands } from '../commands';

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  refs: any;
  style: CSSProperties;
  children?: React.ReactNode;
  actions?: ['delete', 'duplicate', 'turnInto', 'copy'] | null;
} & {
  editor: YooEditor;
  blockId: string;
  element: SlateElement;
};

const TableColumnOptions = ({ editor, blockId, element, onClose, ...props }: Props) => {
  const insertColumnBefore = () => {
    TableCommands.insertTableColumn(editor, blockId, { insertMode: 'before' });
    onClose();
  };

  const insertColumnAfter = () => {
    TableCommands.insertTableColumn(editor, blockId, { insertMode: 'after' });
    onClose();
  };

  const deleteTableColumn = () => {
    const path = Elements.getElementPath(editor, blockId, element);
    if (!path) return;

    // @ts-ignore [FIXME] - fix types
    TableCommands.deleteTableColumn(editor, blockId, { path });
    onClose();
  };

  const moveColumnRight = () => {
    const slate = editor.blockEditorsMap[blockId];
    const tdElementEntry = Elements.getElementEntry(editor, blockId, {
      type: 'table-data-cell',
      // @ts-ignore [FIXME] - fix types
      path: slate.selection,
    });

    if (tdElementEntry) {
      const [, tdPath] = tdElementEntry;

      const nextTdEntry = Editor.next(slate, {
        at: tdPath,
        match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
      });

      if (!nextTdEntry) return;

      const [, nextTdPath] = nextTdEntry;
      TableCommands.moveTableColumn(editor, blockId, { from: tdPath, to: nextTdPath });
    }
  };

  const moveColumnLeft = () => {
    const slate = editor.blockEditorsMap[blockId];

    const tdElementEntry = Elements.getElementEntry(editor, blockId, {
      type: 'table-data-cell',
      // @ts-ignore [FIXME] - fix types
      path: slate.selection,
    });

    if (tdElementEntry) {
      const [, tdPath] = tdElementEntry;

      const prevTdEntry = Editor.previous(slate, {
        at: tdPath,
        match: (n) => Element.isElement(n) && n.type === 'table-data-cell',
      });

      if (!prevTdEntry) return;

      const [, prevTdPath] = prevTdEntry;
      TableCommands.moveTableColumn(editor, blockId, { from: tdPath, to: prevTdPath });
    }
  };

  return (
    <BlockOptions {...props} onClose={onClose} actions={null}>
      <BlockOptionsMenuGroup>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button"
            onClick={insertColumnBefore}>
            <ArrowLeftIcon className="yoopta-table-icons" />
            Insert left
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button" onClick={insertColumnAfter}>
            <ArrowRightIcon className="yoopta-table-icons" />
            Insert right
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsSeparator />
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button" onClick={moveColumnRight}>
            <MoveRightIcon className="yoopta-table-icons" />
            Move right
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button" onClick={moveColumnLeft}>
            <MoveLeftIcon className="yoopta-table-icons" />
            Move left
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsSeparator />

        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button" onClick={deleteTableColumn}>
            <TrashIcon className="yoopta-table-icons" />
            Delete
          </button>
        </BlockOptionsMenuItem>
      </BlockOptionsMenuGroup>
    </BlockOptions>
  );
};

export { TableColumnOptions };
