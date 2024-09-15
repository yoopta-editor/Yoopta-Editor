import { generateId, YooEditor } from '@yoopta/editor';
import { Descendant } from 'slate';
import { TableElement, TableRowElement } from '../../types';

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

        if (th?.hasAttribute('data-width')) {
          cellElement.props.width = parseInt((th as HTMLElement).getAttribute('data-width') || '200', 10);
        }

        let textNodes = deserializeTextNodes(th.childNodes);
        cellElement.children = textNodes;
        rowElement.children.push(cellElement);
      }
    });

    tableElement.children.push(rowElement);
  }

  tbody?.childNodes.forEach((tr) => {
    const trChildNodes = Array.from(tr.childNodes).filter((node) => node.nodeName === 'TD' || node.nodeName === 'TH');

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
          if (td?.hasAttribute('data-width')) {
            cellElement.props.width = parseInt((td as HTMLElement).getAttribute('data-width') || '200', 10);
          }

          let textNodes = deserializeTextNodes(td.childNodes);
          cellElement.children = textNodes;
          rowElement.children.push(cellElement);
        }
      });

      tableElement.children.push(rowElement);
    }
  });

  return tableElement;
}

// MOVE to common utils in @yoopta/editor
function deserializeTextNodes(nodes: NodeListOf<ChildNode>): Descendant[] {
  const deserializedNodes: Descendant[] = [];

  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      deserializedNodes.push({
        text: node.textContent || '',
      });
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;

      if (element.nodeName === 'B') {
        deserializedNodes.push({
          bold: true,
          ...deserializeTextNodes(element.childNodes)[0],
        });
      }

      if (element.nodeName === 'I') {
        deserializedNodes.push({
          italic: true,
          ...deserializeTextNodes(element.childNodes)[0],
        });
      }

      if (element.nodeName === 'S') {
        deserializedNodes.push({
          strike: true,
          ...deserializeTextNodes(element.childNodes)[0],
        });
      }

      if (element.nodeName === 'U') {
        deserializedNodes.push({
          underline: true,
          ...deserializeTextNodes(element.childNodes)[0],
        });
      }

      if (element.nodeName === 'CODE') {
        deserializedNodes.push({
          code: true,
          ...deserializeTextNodes(element.childNodes)[0],
        });
      }

      if (element.nodeName === 'A') {
        deserializedNodes.push({
          id: generateId(),
          type: 'link',
          props: {
            url: element.getAttribute('href') || '',
            target: element.getAttribute('target') || '',
            rel: element.getAttribute('rel') || '',
          },
          children: deserializeTextNodes(element.childNodes),
        });
      }
    }
  });

  // @ts-ignore [FIXME] - Fix this
  if (deserializedNodes.length === 0 && !deserializedNodes[0]?.text) {
    deserializedNodes.push({ text: '' });
  }

  return deserializedNodes;
}
