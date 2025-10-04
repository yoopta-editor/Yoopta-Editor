import type { YooEditor } from '@yoopta/editor';
import { deserializeTextNodes, generateId } from '@yoopta/editor';

import type { TableElement, TableRowElement } from '../../types';

export function deserializeTable(el: HTMLElement, editor: YooEditor) {
  const tbody = el.querySelector('tbody');
  const thead = el.querySelector('thead');

  const tableElement: TableElement = {
    id: generateId(),
    type: 'table',
    children: [],
    props: {
      headerRow: el.getAttribute('data-header-row') === 'true',
      headerColumn: el.getAttribute('data-header-column') === 'true',
    },
  };

  if (!tbody && !thead) return;

  const theadRow = thead?.querySelector('tr');
  if (theadRow) {
    tableElement.props!.headerRow = true;
  }

  if (theadRow) {
    const rowElement: TableRowElement = {
      id: generateId(),
      type: 'table-row',
      children: [],
    };

    Array.from(theadRow.childNodes).forEach((th) => {
      if (th.nodeName === 'TH') {
        const cellElement = {
          id: generateId(),
          type: 'table-data-cell',
          children: [{ text: '' }],
          props: {
            asHeader: true,
            width: 200,
          },
        };

        if (th instanceof HTMLElement && th?.hasAttribute('data-width')) {
          cellElement.props.width = parseInt(
            (th as HTMLElement).getAttribute('data-width') || '200',
            10,
          );
        }

        const textNodes = deserializeTextNodes(editor, th.childNodes);
        // @ts-ignore [FIXME] - Fix this
        cellElement.children = textNodes;
        rowElement.children.push(cellElement);
      }
    });

    tableElement.children.push(rowElement);
  }

  tbody?.childNodes.forEach((tr) => {
    const trChildNodes = Array.from(tr.childNodes).filter(
      (node) => node.nodeName === 'TD' || node.nodeName === 'TH',
    );

    if (trChildNodes.length > 0) {
      const rowElement: TableRowElement = {
        id: generateId(),
        type: 'table-row',
        children: [],
      };

      trChildNodes.forEach((td) => {
        const cellElement = {
          id: generateId(),
          type: 'table-data-cell',
          children: [{ text: '' }],
          props: {
            asHeader: false,
            width: 200,
          },
        };

        if (td.nodeName === 'TH') {
          cellElement.props.asHeader = true;
        }

        if (td.nodeName === 'TD') {
          cellElement.props.asHeader = false;
        }

        if (td.nodeName === 'TD' || td.nodeName === 'TH') {
          if (td instanceof HTMLElement && td?.hasAttribute('data-width')) {
            cellElement.props.width = parseInt(
              (td as HTMLElement).getAttribute('data-width') || '200',
              10,
            );
          }

          const textNodes = deserializeTextNodes(editor, td.childNodes);
          // @ts-ignore [FIXME] - Fix this
          cellElement.children = textNodes;
          rowElement.children.push(cellElement);
        }
      });

      tableElement.children.push(rowElement);
    }
  });

  return tableElement;
}
