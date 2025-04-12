import { Elements, SlateElement, UI, YooEditor } from '@yoopta/editor';

import { CSSProperties } from 'react';
import { Editor, Element, Path } from 'slate';
import { TrashIcon, MoveDownIcon, MoveUpIcon, CornerUpRight, CornerDownRight } from 'lucide-react';
import { TableCommands } from '../commands';

const { BlockOptionsMenuGroup, BlockOptionsMenuItem, BlockOptions, BlockOptionsSeparator } = UI;

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
  tdElement: SlateElement;
};

const TableRowOptions = ({ editor, blockId, onClose, tdElement, ...props }: Props) => {
  const insertRowBefore = () => {
    TableCommands.insertTableRow(editor, blockId, { insertMode: 'before', select: true });
    onClose();
  };

  const insertRowAfter = () => {
    TableCommands.insertTableRow(editor, blockId, { insertMode: 'after', select: true });
    onClose();
  };

  const deleteTableRow = () => {
    const tdPath = Elements.getElementPath(editor, blockId, tdElement);
    const trElement = Elements.getElement(editor, blockId, { type: 'table-row', path: tdPath });
    if (!trElement) return;

    let path = Elements.getElementPath(editor, blockId, trElement);
    // @ts-ignore [FIXME] - Fix this
    TableCommands.deleteTableRow(editor, blockId, { path });
    onClose();
  };

  const moveRowDown = () => {
    const tdPath = Elements.getElementPath(editor, blockId, tdElement);
    const trElement = Elements.getElement(editor, blockId, { type: 'table-row', path: tdPath });
    if (!trElement) return;

    let path = Elements.getElementPath(editor, blockId, trElement);

    const slate = editor.blockEditorsMap[blockId];
    const nextElementEntry = Editor.next(slate, {
      at: path,
      match: (n) => Element.isElement(n) && n.type === 'table-row',
    });

    if (!nextElementEntry) return onClose();
    TableCommands.moveTableRow(editor, blockId, { from: path!, to: nextElementEntry[1] });
  };

  const moveRowUp = () => {
    const tdPath = Elements.getElementPath(editor, blockId, tdElement);
    const trElement = Elements.getElement(editor, blockId, { type: 'table-row', path: tdPath });
    if (!trElement) return;

    let path = Elements.getElementPath(editor, blockId, trElement);

    const slate = editor.blockEditorsMap[blockId];
    const prevElementEntry = Editor.previous(slate, {
      at: path,
      match: (n) => Element.isElement(n) && n.type === 'table-row',
    });

    if (!prevElementEntry) return onClose();
    TableCommands.moveTableRow(editor, blockId, { from: path!, to: prevElementEntry[1] });
  };

  return (
    <BlockOptions {...props} onClose={onClose} actions={null}>
      <BlockOptionsMenuGroup>
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button" onClick={insertRowBefore}>
            <CornerUpRight className="yoopta-table-icons" />
            {editor.getLabelText('plugins.Table.options.rowOptions.insertAbove') || 'Insert above'}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button" onClick={insertRowAfter}>
            <CornerDownRight className="yoopta-table-icons" />
            {editor.getLabelText('plugins.Table.options.rowOptions.insertBelow') || 'Insertbelow'}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsSeparator />
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button" onClick={moveRowUp}>
            <MoveUpIcon className="yoopta-table-icons" />
            {editor.getLabelText('plugins.Table.options.rowOptions.moveUp') || 'Move up'}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button" onClick={moveRowDown}>
            <MoveDownIcon className="yoopta-table-icons" />
            {editor.getLabelText('plugins.Table.options.rowOptions.moveDown') || 'Move down'}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsSeparator />
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button" onClick={deleteTableRow}>
            <TrashIcon className="yoopta-table-icons" />
            {editor.getLabelText('plugins.Table.options.rowOptions.delete') || 'Delete row'}
          </button>
        </BlockOptionsMenuItem>
      </BlockOptionsMenuGroup>
    </BlockOptions>
  );
};

export { TableRowOptions };
