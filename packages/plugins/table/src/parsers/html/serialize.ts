import type { SlateElement, YooptaBlockData } from '@yoopta/editor';
import { serializeTextNodes } from '@yoopta/editor';

import type { TableCellElement } from '../../types';

export function serializeTable(
  element: SlateElement,
  text: string,
  blockMeta?: YooptaBlockData['meta'],
) {
  const columns = (element.children[0] as SlateElement).children as TableCellElement[];
  const { align = 'left', depth = 0 } = blockMeta || {};

  const serialized = `<table style="margin-left: ${
    depth * 20
  }px; text-align: ${align}" data-meta-align="${align}" data-meta-depth="${depth}" data-header-row="${
    element.props?.headerRow
  }" data-header-column="${element.props?.headerColumn}">
        <colgroup>
        ${columns
          .map((td) => `<col style="width: ${td.props?.width ? `${td.props?.width}px` : 'auto'}" />`)
          .join('')}
        </colgroup>
        <tbody>${element.children
          .map((trElement) => 
            // @ts-ignore - fixme
             `<tr>${trElement.children
              .map((td) => {
                const text = serializeTextNodes(td.children);
                if (td.props?.asHeader) {
                  return `<th data-width="${
                    td.props?.width || 200
                  }" rowspan="1" colspan="1">${text}</th>`;
                }

                return `<td data-width="${
                  td.props?.width || 200
                }" rowspan="1" colspan="1">${text}</td>`;
              })
              .join('')}</tr>`
          )
          .join('')}</tbody></table>`;

  return serialized;
}
